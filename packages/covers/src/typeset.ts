import { existsSync } from "node:fs";
import { join } from "node:path";
import { GlobalFonts, createCanvas, loadImage, type SKRSContext2D } from "@napi-rs/canvas";
import type { TypeBand } from "./types.js";

/**
 * The title is set by CODE, never by the image model: models still misspell titles, and a series wants
 * one lettering system. The model is told to leave the top band calm; this draws into it.
 */

export const COVER_WIDTH = 1024;
export const COVER_HEIGHT = 1536;

const FONT_FILES: Record<string, { file: string; family: string }> = {
  "display-deco": { file: "Limelight-Regular.ttf", family: "Limelight" },
  "display-thin": { file: "PoiretOne-Regular.ttf", family: "Poiret One" },
  "display-serif": { file: "Cinzel.ttf", family: "Cinzel" },
  small: { file: "JosefinSans.ttf", family: "Josefin Sans" },
};
const FALLBACK_FAMILY = "Georgia";
const registered = new Set<string>();

/** Register the fonts in `fontsDir` once per process. Returns the alias → family map actually available. */
export const registerCoverFonts = (fontsDir: string): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [alias, { file, family }] of Object.entries(FONT_FILES)) {
    const path = join(fontsDir, file);
    if (!registered.has(path) && existsSync(path)) {
      GlobalFonts.registerFromPath(path, family);
      registered.add(path);
    }
    out[alias] = registered.has(path) ? family : FALLBACK_FAMILY;
  }
  return out;
};

const hexToRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
};
/** Relative luminance, 0 (black) – 1 (white). */
export const luminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export const darkestInk = (inks: string[]) => [...inks].sort((a, b) => luminance(a) - luminance(b))[0];
export const lightestInk = (inks: string[]) => [...inks].sort((a, b) => luminance(b) - luminance(a))[0];

/**
 * Break `text` into at most `maxLines` lines no wider than `maxWidth`, at the largest size from `maxSize`
 * down to `minSize` that also fits `maxHeight`. Pure apart from `measure`, so it is unit-testable.
 */
export const fitTitle = (
  text: string,
  measure: (s: string, size: number) => number,
  box: { maxWidth: number; maxHeight: number; maxLines: number; maxSize: number; minSize: number; lineHeight: number },
): { size: number; lines: string[] } => {
  const words = text.split(/\s+/).filter(Boolean);
  for (let size = box.maxSize; size >= box.minSize; size -= 2) {
    const lines: string[] = [];
    let cur = "";
    let ok = true;
    for (const w of words) {
      const next = cur ? `${cur} ${w}` : w;
      if (measure(next, size) <= box.maxWidth) cur = next;
      else {
        if (!cur || measure(w, size) > box.maxWidth) { ok = false; break; }
        lines.push(cur);
        cur = w;
      }
    }
    if (!ok) continue;
    if (cur) lines.push(cur);
    if (lines.length <= box.maxLines && lines.length * size * box.lineHeight <= box.maxHeight) return { size, lines };
  }
  // Nothing fits: smallest size, greedy wrap, overflow allowed — a cramped title beats no cover.
  return { size: box.minSize, lines: [words.join(" ")] };
};

/**
 * "THE HALF-HOUR HAND: A THEATRE CLOCK DECEPTION" → main + subtitle. MEASURED on the first matrix: set as one
 * run, the line broke after "A" and the thin display face drew the colon like a full stop.
 */
export const splitTitle = (title: string): { main: string; sub?: string } => {
  const i = title.search(/\s*[:—–]\s+/);
  if (i <= 0) return { main: title };
  const main = title.slice(0, i).trim();
  const sub = title.slice(i).replace(/^\s*[:—–]\s+/, "").trim();
  return sub ? { main, sub } : { main: title };
};

const averageLuminance =(ctx: SKRSContext2D, x: number, y: number, w: number, h: number) => {
  const { data } = ctx.getImageData(x, y, w, h);
  let sum = 0;
  let n = 0;
  for (let i = 0; i < data.length; i += 4 * 37) {
    sum += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
    n++;
  }
  return n ? sum / n : 0.5;
};

export interface TypesetArgs {
  art: Buffer;
  title: string;
  author?: string;
  /** Small line above the title. Default "A Mystery". */
  strap?: string;
  band: TypeBand;
  inks: string[];
  titleFont: string;
  fontsDir: string;
}

export const typesetCover = async (args: TypesetArgs): Promise<Buffer> => {
  const fonts = registerCoverFonts(args.fontsDir);
  const W = COVER_WIDTH;
  const H = COVER_HEIGHT;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext("2d");

  // Art, scaled to cover the 2:3 frame and centred.
  const img = await loadImage(args.art);
  const scale = Math.max(W / img.width, H / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, (W - dw) / 2, (H - dh) / 2, dw, dh);

  const dark = darkestInk(args.inks);
  const light = lightestInk(args.inks);
  const bandH = Math.round(H * args.band.height);
  const margin = Math.round(W * 0.045);
  const titleFamily = fonts[args.titleFont] ?? FALLBACK_FAMILY;
  const smallFamily = fonts.small ?? FALLBACK_FAMILY;

  let textColour: string;
  let shadow = false;
  if (args.band.style === "framed") {
    // A solid band inside a margin, with a double rule — the poster samples' framed type panel.
    ctx.fillStyle = dark;
    ctx.fillRect(margin, margin, W - 2 * margin, bandH - margin);
    ctx.strokeStyle = light;
    ctx.lineWidth = 3;
    ctx.strokeRect(margin + 10, margin + 10, W - 2 * margin - 20, bandH - margin - 20);
    ctx.lineWidth = 1;
    ctx.strokeRect(margin + 17, margin + 17, W - 2 * margin - 34, bandH - margin - 34);
    textColour = light;
  } else {
    // Lettering straight onto the reserved area; colour chosen against what the model actually painted.
    const lum = averageLuminance(ctx, 0, 0, W, bandH);
    textColour = lum < 0.5 ? light : dark;
    shadow = true;
  }

  const strap = (args.strap ?? "A Mystery").toUpperCase();
  const title = args.title.toUpperCase();
  const strapSize = Math.round(bandH * 0.1);
  const innerTop = args.band.style === "framed" ? margin + 30 : margin;
  const innerBottom = args.band.style === "framed" ? bandH - 30 : bandH - margin / 2;

  ctx.fillStyle = textColour;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  if (shadow) {
    ctx.shadowColor = textColour === light ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.45)";
    ctx.shadowBlur = 8;
  }

  ctx.font = `${strapSize}px "${smallFamily}"`;
  const strapSpaced = strap.split("").join(" ");
  ctx.fillText(strapSpaced, W / 2, innerTop);

  const lineHeight = 1.08;
  const titleTop = innerTop + strapSize * 1.6;
  const { main, sub } = splitTitle(title);
  const subSize = sub ? Math.max(24, Math.round(bandH * 0.085)) : 0;
  const subBlock = sub ? subSize * 1.9 : 0;
  const fit = fitTitle(
    main,
    (s, size) => {
      ctx.font = `${size}px "${titleFamily}"`;
      return ctx.measureText(s).width;
    },
    { maxWidth: W - 2 * margin - 60, maxHeight: innerBottom - titleTop - subBlock, maxLines: 3, maxSize: 132, minSize: 36, lineHeight },
  );
  ctx.font = `${fit.size}px "${titleFamily}"`;
  fit.lines.forEach((line, i) => ctx.fillText(line, W / 2, titleTop + i * fit.size * lineHeight));
  if (sub) {
    // The subtitle in the strap face, smaller: a colon is a break between two things, not a word in a line.
    ctx.font = `${subSize}px "${smallFamily}"`;
    ctx.fillText(sub, W / 2, titleTop + fit.lines.length * fit.size * lineHeight + subSize * 0.5);
  }

  if (args.author) {
    const authorSize = 34;
    const stripH = authorSize * 2.2;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    if (args.band.style === "framed") {
      ctx.fillStyle = dark;
      ctx.fillRect(margin, H - margin - stripH, W - 2 * margin, stripH);
      ctx.fillStyle = light;
    } else {
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, H - stripH - margin / 2, W, stripH);
      ctx.fillStyle = "#f4ecd8";
    }
    ctx.font = `${authorSize}px "${smallFamily}"`;
    ctx.textBaseline = "middle";
    ctx.fillText(args.author.toUpperCase().split("").join(" "), W / 2, H - margin - stripH / 2 + (args.band.style === "framed" ? 0 : margin / 2));
  }

  return canvas.toBuffer("image/png");
};

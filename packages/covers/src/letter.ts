import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { resolveCardsDir } from "./cards.js";
import { typesetCover } from "./typeset.js";
import type { CoverBrief, CoverManifest } from "./types.js";

/**
 * Letter (or re-letter) the art of an earlier generateCovers() call with a title — no image call, no cost.
 *
 * A cover painted FIRST (from the setting, before the book has a title) is art only; this sets the title once
 * the CML names it, and again if the finished book's title differs. Writes `cover-<id>.png` and `cover.png` in
 * `outDir` and updates covers.json. Throws when the out dir holds no art — callers record that as a warning.
 */
export const letterCover = async (args: {
  outDir: string;
  title: string;
  author?: string;
  fontsDir?: string;
}): Promise<{ coverPath: string; briefId: string }> => {
  const manifestPath = join(args.outDir, "covers.json");
  if (!existsSync(manifestPath)) throw new Error(`no covers.json in ${args.outDir}`);
  const m = JSON.parse(readFileSync(manifestPath, "utf8")) as CoverManifest;
  const rec = m.covers.find((c) => c.artPath && existsSync(join(args.outDir, c.artPath)));
  if (!rec?.artPath) throw new Error(`no painted art in ${args.outDir}`);
  const brief = JSON.parse(readFileSync(join(args.outDir, rec.briefPath), "utf8")) as CoverBrief;
  const fontsDir = args.fontsDir ?? join(dirname(resolveCardsDir()), "fonts");
  const png = await typesetCover({
    art: readFileSync(join(args.outDir, rec.artPath)),
    title: args.title,
    author: args.author,
    band: brief.typeBand,
    inks: brief.inks,
    titleFont: brief.titleFont,
    fontsDir,
  });
  const name = `cover-${rec.briefId}.png`;
  writeFileSync(join(args.outDir, name), png);
  copyFileSync(join(args.outDir, name), join(args.outDir, "cover.png"));
  rec.coverPath = name;
  m.title = args.title;
  m.primary = "cover.png";
  writeFileSync(manifestPath, JSON.stringify(m, null, 2));
  return { coverPath: join(args.outDir, "cover.png"), briefId: rec.briefId };
};

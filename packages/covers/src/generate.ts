import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { extractAnchors } from "./anchors.js";
import { composeBrief } from "./brief.js";
import { loadStyleCards, resolveCardsDir } from "./cards.js";
import { renderContactSheet } from "./contact-sheet.js";
import { resolveImageQuality } from "./image-client.js";
import { makeRng, randomSeed } from "./framings.js";
import { resolveStyleChoices } from "./select.js";
import type { TitleChecker } from "./title-check.js";
import type {
  CoverAnchors,
  CoverChatClient,
  CoverManifest,
  CoverRecord,
  ImageClient,
  ImageRequest,
  StoryCoverInput,
  StyleCard,
} from "./types.js";

export interface GenerateCoversOptions {
  input: StoryCoverInput;
  outDir: string;
  /** See resolveStyleChoices: "auto" | "auto:N" | "all" | "a,b" | "a+b". Default "auto". */
  styles?: string;
  variants?: number;
  /** Write anchors + briefs + contact sheet, make NO image call. */
  dryRun?: boolean;
  llm?: CoverChatClient;
  image?: ImageClient;
  quality?: ImageRequest["quality"];
  /** Skip the LLM: reuse anchors from an earlier run (anchors.json) so only the style varies. */
  anchors?: CoverAnchors;
  cards?: StyleCard[];
  cardsDir?: string;
  logContext?: { runId: string; projectId: string };
  /** Parallel image calls. Default 3. */
  concurrency?: number;
  /**
   * Reads the painted title back (title-check.ts). On a mismatch the cover is repainted ONCE with the misread
   * quoted back to the model; the read is recorded on the cover's row either way.
   */
  checkTitle?: TitleChecker;
  /** Replay a recorded seed. Omitted → a fresh random seed, so every run differs. */
  seed?: number;
  log?: (line: string) => void;
}

export const IMAGE_SIZE = "1024x1536";

/**
 * Story → anchors → briefs (with the exact title) → images, the title painted in → title check → covers, all
 * written under `outDir`, plus `covers.json`
 * (the manifest) and `index.html` (the contact sheet). Never throws for a single failed image: the
 * failure is recorded on that cover's row and the rest carry on.
 */
export const generateCovers = async (opts: GenerateCoversOptions): Promise<CoverManifest> => {
  const log = opts.log ?? (() => {});
  const cardsDir = opts.cardsDir ?? resolveCardsDir();
  const cards = opts.cards ?? loadStyleCards(cardsDir);
  if (!opts.input.title.trim()) throw new Error("generateCovers needs the book's title — it is painted into the cover");
  mkdirSync(opts.outDir, { recursive: true });

  let anchors = opts.anchors;
  if (!anchors) {
    const res = await extractAnchors(opts.input, opts.llm, opts.logContext);
    anchors = res.anchors;
    if (res.error) log(`[covers] anchors fell back to inputs: ${res.error}`);
  }
  writeFileSync(join(opts.outDir, "anchors.json"), JSON.stringify(anchors, null, 2));
  log(`[covers] anchors (${anchors.source}): ${anchors.place} · object: ${anchors.clue_object}`);

  // One seed per call: a fresh one unless the caller replays one, so every run makes different covers and
  // any cover can be reproduced from the seed recorded in its brief and in covers.json.
  const seed = (opts.seed ?? randomSeed()) >>> 0;
  const rng = makeRng(seed);
  log(`[covers] seed ${seed}`);
  // True to the decade: the run's era if it has one, else the decade the anchor step read from the text.
  const input = opts.input.era || !anchors.decade ? opts.input : { ...opts.input, era: anchors.decade };
  if (input !== opts.input) log(`[covers] era from the text: ${input.era}`);
  const choices = resolveStyleChoices(opts.styles ?? "auto", cards, input, opts.variants ?? 1, rng, anchors);
  const briefs = choices.map((c, i) => composeBrief(input, anchors!, c, i, seed));
  const quality = opts.quality ?? resolveImageQuality();

  const records: CoverRecord[] = briefs.map((b) => {
    const briefPath = join(opts.outDir, `brief-${b.id}.json`);
    writeFileSync(briefPath, JSON.stringify({ ...b, size: IMAGE_SIZE, quality, title: opts.input.title }, null, 2));
    return { briefId: b.id, styles: b.styles, palette: b.palette, framing: b.framing, briefPath: relative(opts.outDir, briefPath) };
  });

  if (!opts.dryRun) {
    if (!opts.image) {
      for (const r of records) r.error = "no image client configured";
    } else {
      const image = opts.image;
      let next = 0;
      const worker = async () => {
        for (;;) {
          const i = next++;
          if (i >= briefs.length) return;
          const b = briefs[i];
          const r = records[i];
          try {
            log(`[covers] ${b.id}: requesting ${image.provider}/${image.model} ${quality}`);
            let res = await image.generate({ prompt: b.prompt, size: IMAGE_SIZE, quality });
            let attempts = 1;
            let latency = res.latencyMs;
            if (opts.checkTitle) {
              let check = await opts.checkTitle(res.png, b.title).catch((e) => ({ ok: true, read: `(check failed: ${(e as Error).message})` }));
              if (!check.ok) {
                log(`[covers] ${b.id}: title read back as "${check.read}" — repainting once`);
                const retry = await image.generate({
                  prompt: `${b.prompt}
TITLE CHECK: a previous attempt lettered the title as "${check.read}". Letter it exactly as "${b.title}".`,
                  size: IMAGE_SIZE,
                  quality,
                });
                const recheck = await opts.checkTitle(retry.png, b.title).catch(() => ({ ok: false, read: "" }));
                attempts = 2;
                latency += retry.latencyMs;
                // The retry is kept whether or not it reads right: it had the stronger prompt, and the read is recorded.
                res = retry;
                check = recheck;
              }
              r.titleCheck = { ok: check.ok, read: check.read, attempts };
            }
            const coverPath = join(opts.outDir, `cover-${b.id}.png`);
            writeFileSync(coverPath, res.png);
            r.coverPath = relative(opts.outDir, coverPath);
            r.image = { provider: res.provider, model: res.model, quality, latencyMs: latency, usage: res.usage };
            log(`[covers] ${b.id}: done in ${(latency / 1000).toFixed(1)}s${r.titleCheck ? ` · title ${r.titleCheck.ok ? "OK" : `MISREAD "${r.titleCheck.read}"`}` : ""}`);
          } catch (e) {
            r.error = String((e as Error)?.message ?? e);
            log(`[covers] ${b.id}: FAILED ${r.error}`);
          }
        }
      };
      await Promise.all(Array.from({ length: Math.max(1, opts.concurrency ?? 3) }, worker));
    }
  }

  const first = records.find((r) => r.coverPath);
  const manifest: CoverManifest = {
    title: opts.input.title,
    generatedAt: new Date().toISOString(),
    dryRun: !!opts.dryRun,
    seed,
    anchors,
    covers: records,
    primary: first ? "cover.png" : undefined,
  };
  if (first?.coverPath) copyFileSync(join(opts.outDir, first.coverPath), join(opts.outDir, "cover.png"));
  writeFileSync(join(opts.outDir, "covers.json"), JSON.stringify(manifest, null, 2));
  writeFileSync(join(opts.outDir, "index.html"), renderContactSheet(manifest, briefs));
  return manifest;
};

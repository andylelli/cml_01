import { copyFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { extractAnchors } from "./anchors.js";
import { composeBrief } from "./brief.js";
import { loadStyleCards, resolveCardsDir } from "./cards.js";
import { renderContactSheet } from "./contact-sheet.js";
import { resolveImageQuality } from "./image-client.js";
import { makeRng, randomSeed } from "./framings.js";
import { resolveStyleChoices } from "./select.js";
import { typesetCover } from "./typeset.js";
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
  fontsDir?: string;
  logContext?: { runId: string; projectId: string };
  /** Parallel image calls. Default 3. */
  concurrency?: number;
  /** Replay a recorded seed. Omitted → a fresh random seed, so every run differs. */
  seed?: number;
  log?: (line: string) => void;
}

export const IMAGE_SIZE = "1024x1536";

/**
 * Story → anchors → briefs → images → typeset covers, all written under `outDir`, plus `covers.json`
 * (the manifest) and `index.html` (the contact sheet). Never throws for a single failed image: the
 * failure is recorded on that cover's row and the rest carry on.
 */
export const generateCovers = async (opts: GenerateCoversOptions): Promise<CoverManifest> => {
  const log = opts.log ?? (() => {});
  const cardsDir = opts.cardsDir ?? resolveCardsDir();
  const fontsDir = opts.fontsDir ?? join(dirname(cardsDir), "fonts");
  const cards = opts.cards ?? loadStyleCards(cardsDir);
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
  const choices = resolveStyleChoices(opts.styles ?? "auto", cards, opts.input, opts.variants ?? 1, rng, anchors);
  const briefs = choices.map((c, i) => composeBrief(opts.input, anchors!, c, i, seed));
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
            const res = await image.generate({ prompt: b.prompt, size: IMAGE_SIZE, quality });
            const artPath = join(opts.outDir, `art-${b.id}.png`);
            writeFileSync(artPath, res.png);
            r.artPath = relative(opts.outDir, artPath);
            r.image = { provider: res.provider, model: res.model, quality, latencyMs: res.latencyMs, usage: res.usage };
            const cover = await typesetCover({
              art: res.png,
              title: opts.input.title,
              author: opts.input.author,
              band: b.typeBand,
              inks: b.inks,
              titleFont: b.titleFont,
              fontsDir,
            });
            const coverPath = join(opts.outDir, `cover-${b.id}.png`);
            writeFileSync(coverPath, cover);
            r.coverPath = relative(opts.outDir, coverPath);
            log(`[covers] ${b.id}: done in ${(res.latencyMs / 1000).toFixed(1)}s`);
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

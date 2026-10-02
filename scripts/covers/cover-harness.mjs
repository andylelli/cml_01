#!/usr/bin/env node
/**
 * Book-cover test harness — documentation/covers/COVER-HARNESS-PLAN.md.
 *
 * Story → anchors (1 text-LLM call, chapters 1–2 only) → style card(s) → brief (template) → image model →
 * typeset title band → cover PNGs + covers.json + index.html (contact sheet).
 *
 *   node scripts/covers/cover-harness.mjs --story stories/story_20261002-1855 --styles all --dry-run
 *   node scripts/covers/cover-harness.mjs --story <dir> --styles flat-travel-poster,deco-portrait --variants 2
 *   node scripts/covers/cover-harness.mjs --story <dir> --styles magazine-illustration+flat-travel-poster
 *   node scripts/covers/cover-harness.mjs --latest 3 --styles auto --dry-run
 *   node scripts/covers/cover-harness.mjs --story <dir> --reuse-anchors temp/covers/out/<id>/<ts>/anchors.json --styles all
 *   node scripts/covers/cover-harness.mjs --list-styles
 *
 * Flags
 *   --story <dir>        a stories/<id> folder (manuscript .md, optional run-params.json). Repeatable.
 *   --latest <n>         the n newest stories/ folders that hold a manuscript.
 *   --styles <spec>      auto | auto:N | all | a,b | a+b (blend). Default auto.
 *   --variants <n>       palettes per style. Default 1.
 *   --dry-run            anchors + briefs + contact sheet; NO image call (anchors still cost one text call;
 *                        add --no-llm for a fully free run on fallback anchors).
 *   --quality <q>        low | medium | high. Default CML_COVER_IMAGE_QUALITY or medium.
 *   --author <name>      author line on the cover.
 *   --out <dir>          default temp/covers/out/<story-id>/<timestamp>.
 *   --into-story         also copy the primary cover to <story>/cover.png (what the pipeline does).
 *   --yes                skip the paid-call confirmation line (non-interactive use).
 *
 * Env: see packages/covers/src/image-client.ts and llm.ts. CML_COVER_LLM_PROVIDER=anthropic routes the
 * anchor step to Claude.
 */
import { config } from "dotenv";
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
config({ path: path.join(root, ".env") });
config({ path: path.join(root, ".env.local"), override: true });

const covers = await import(new URL("../../packages/covers/dist/index.js", import.meta.url).href).catch((e) => {
  console.error("packages/covers/dist missing — run: npm run build:all -- @cml/covers\n", e.message);
  process.exit(1);
});

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, dflt) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : dflt;
};
const opts = (name) => argv.flatMap((a, i) => (a === `--${name}` && argv[i + 1] ? [argv[i + 1]] : []));

const cardsDir = covers.resolveCardsDir(root);
const cards = covers.loadStyleCards(cardsDir);

if (flag("list-styles")) {
  for (const c of cards) console.log(`${c.id.padEnd(24)} ${c.label} — ${c.summary}\n${"".padEnd(25)}palettes: ${c.palettes.map((p) => p.name).join(", ")}`);
  process.exit(0);
}

const storiesRoot = path.join(root, "stories");
let storyDirs = opts("story").map((s) => path.resolve(root, s));
const latest = Number(opt("latest", 0));
if (latest > 0) {
  const found = readdirSync(storiesRoot)
    .filter((d) => /^story_/.test(d))
    .map((d) => path.join(storiesRoot, d))
    .filter((d) => statSync(d).isDirectory() && readdirSync(d).some((f) => f.endsWith(".md")))
    .sort((a, b) => b.localeCompare(a))
    .slice(0, latest);
  storyDirs.push(...found);
}
if (storyDirs.length === 0) {
  console.error("no story: pass --story <dir> or --latest <n> (or --list-styles)");
  process.exit(1);
}

const dryRun = flag("dry-run");
const styles = opt("styles", "auto");
const variants = Number(opt("variants", 1));
const quality = covers.resolveImageQuality(opt("quality", process.env.CML_COVER_IMAGE_QUALITY));
const reuse = opt("reuse-anchors");
const reusedAnchors = reuse ? JSON.parse((await import("node:fs")).readFileSync(path.resolve(root, reuse), "utf8")) : undefined;

const llm = flag("no-llm") || reusedAnchors ? {} : covers.createCoverLlmFromEnv(process.env);
if (llm.error) console.log(`[covers] text LLM unavailable (${llm.error}) — anchors will fall back to run params`);
const image = dryRun ? {} : covers.createImageClientFromEnv(process.env);
if (!dryRun && image.error) {
  console.error(`[covers] ${image.error}`);
  process.exit(1);
}

// Plan, stated before any paid call (CLAUDE.md: state the parameters first).
const inputs = storyDirs.map((d) => ({ dir: d, input: { ...covers.readStoryDir(d), author: opt("author") } }));
let imageCalls = 0;
for (const { input } of inputs) imageCalls += covers.resolveStyleChoices(styles, cards, input, variants).length;
console.log(`[covers] ${inputs.length} stor${inputs.length === 1 ? "y" : "ies"} · styles=${styles} · variants=${variants} · ` +
  (dryRun ? "DRY RUN (no image calls)" : `${imageCalls} image call(s) via ${image.client.provider}/${image.client.model} @ ${quality}`) +
  ` · anchors via ${reusedAnchors ? "reused file" : llm.client ? `${llm.provider}/${llm.model}` : "fallback"}`);
for (const { dir, input } of inputs) {
  const ranked = covers.rankCards(cards, input).map(({ card, score }) => `${card.id}:${score}`).join(" ");
  console.log(`  ${path.relative(root, dir)} — "${input.title}" · ${input.era ?? "?"} · ${input.locationPreset ?? "?"} · ${input.primaryAxis ?? "?"} · fit ${ranked}`);
}
if (!dryRun && !flag("yes") && process.stdin.isTTY) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ans = await rl.question(`Make ${imageCalls} paid image call(s)? [y/N] `);
  rl.close();
  if (!/^y/i.test(ans)) process.exit(0);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
for (const { dir, input } of inputs) {
  const outDir = path.resolve(root, opt("out", path.join("temp", "covers", "out", path.basename(dir), stamp)));
  const manifest = await covers.generateCovers({
    input,
    outDir,
    styles,
    variants,
    dryRun,
    quality,
    anchors: reusedAnchors,
    llm: llm.client,
    image: image.client,
    cardsDir,
    log: (l) => console.log(l),
  });
  const ok = manifest.covers.filter((c) => c.coverPath).length;
  const failed = manifest.covers.filter((c) => c.error);
  console.log(`[covers] ${path.basename(dir)}: ${dryRun ? `${manifest.covers.length} brief(s)` : `${ok}/${manifest.covers.length} cover(s)`} → ${path.relative(root, path.join(outDir, "index.html"))}`);
  for (const f of failed) if (!dryRun) console.log(`  FAILED ${f.briefId}: ${f.error}`);
  if (flag("into-story") && manifest.primary) {
    copyFileSync(path.join(outDir, manifest.primary), path.join(dir, "cover.png"));
    console.log(`  primary → ${path.relative(root, path.join(dir, "cover.png"))}`);
  }
}

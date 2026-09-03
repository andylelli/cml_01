#!/usr/bin/env node
/**
 * SEEDED RUN PARAMETERS — random by default, exactly reproducible on demand.
 *
 * ── WHY ──────────────────────────────────────────────────────────────────────────────────────────
 *
 * `scripts/canary-core-inputs.yaml` pins every story parameter, so every run is the same story with
 * different words. MEASURED over the stored corpus:
 *
 *   axis        temporal 32 · authority 2 · spatial 1 · identity 1 · behavioral 1
 *   externally read books                 : 14, ALL temporal. Zero non-temporal reads exist.
 *   chapter-1 openings naming the detective: 61% of August books
 *   cast                                  : the SAME SIX NAMES in every book
 *
 * The axis skew is not a pipeline defect — `scripts/axis-sweep.mjs:14` already records the cause:
 * the pinned theme *"driven by a mechanical clock-tampering method"* forces a temporal story, so
 * varying `primaryAxis` alone would measure nothing. The theme and the axis have to move together.
 *
 * The consequence is that every instrument this project owns is calibrated on one axis with one cast.
 * The register correlation (−0.697), "best ever 86", "prose is 0-for-43" — all temporal statements.
 *
 * ── THE TRADE, STATED ────────────────────────────────────────────────────────────────────────────
 *
 * Randomising costs comparability. Fourteen reads share a theme, which is why cross-run comparison
 * has been possible at all. That is why this is a SEPARATE inputs file rather than an edit to the
 * pinned one: `canary-core-inputs.yaml` stays exactly as it is, and a seeded run is opt-in.
 *
 *   node scripts/run-params.mjs                 # new random seed, prints it
 *   node scripts/run-params.mjs --seed 8143     # reproduce that run's parameters EXACTLY
 *   node scripts/run-params.mjs --axis spatial  # pin one field, randomise the rest
 *
 * It writes `scripts/generated/run-params-<seed>.yaml` and prints the line to run. The seed is in the
 * filename, in a comment at the top of the file, and echoed as RUN_SEED= — three places, because the
 * whole point is that a run can be found again.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();

// ── a deterministic PRNG, so a seed is a promise ────────────────────────────────────────────────
// mulberry32: small, fast, and — the property that matters here — identical across platforms and
// Node versions. Math.random() cannot be seeded and would make every "reproduce" claim a lie.
const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const argv = process.argv.slice(2);
const arg = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i > -1 ? argv[i + 1] : undefined;
};

/**
 * `--self-test` — the seed makes a promise; this checks it is still kept.
 *
 * A reproducibility guarantee that silently stops holding is worse than none, because every replay
 * quietly becomes a different experiment. Runs the generator twice on fixed seeds and compares.
 */
if (argv.includes("--self-test")) {
  const gen = (s) => {
    const r = mulberry32(s);
    return Array.from({ length: 40 }, () => r()).join(",");
  };
  const pairs = [1, 8143, 25479, 99999];
  const same = pairs.every((s) => gen(s) === gen(s));
  const distinct = new Set(pairs.map(gen)).size === pairs.length;
  console.log(`
  same seed reproduces      : ${same ? "PASS" : "FAIL"}`);
  console.log(`  distinct seeds differ     : ${distinct ? "PASS" : "FAIL"}`);
  // A known vector, so a change to the PRNG itself is caught rather than silently accepted.
  //
  // MEASURED, not invented. The first version of this line carried a hand-written constant and the
  // self-test failed on its own first run — which is the check doing exactly its job, and the ninth
  // instance in three days of a probe asserting something its author had not verified.
  const vector = mulberry32(8143)();
  const EXPECTED = 0.13783118315041065;
  const pinned = Math.abs(vector - EXPECTED) < 1e-15;
  console.log(`  PRNG vector unchanged     : ${pinned ? "PASS" : `FAIL (got ${vector})`}`);
  process.exit(same && distinct && pinned ? 0 : 1);
}

const seed = Number(arg("seed") ?? Math.floor(Math.random() * 100000));
if (!Number.isFinite(seed)) { console.error("\n  --seed must be a number\n"); process.exit(1); }
const rnd = mulberry32(seed);
const pick = (list) => list[Math.floor(rnd() * list.length)];
const pickN = (list, n) => {
  const pool = [...list];
  const out = [];
  while (out.length < n && pool.length) out.push(...pool.splice(Math.floor(rnd() * pool.length), 1));
  return out;
};

/**
 * THEMES ARE PAIRED TO AXES, NOT DRAWN INDEPENDENTLY.
 *
 * This is the whole reason the existing skew exists. A clock-tampering brief forces a temporal story
 * whatever `primaryAxis` says — `axis-sweep.mjs` learned this and says so in its header. Each entry
 * below is a concealment the named axis can actually carry.
 */
const AXES = {
  temporal: [
    "a mechanical clock-tampering method — a timepiece made to lie about when the death happened",
    "a chiming clock whose strike was made to fall at the wrong hour",
    "a staged interruption that makes the death seem to fall inside a witnessed hour",
  ],
  spatial: [
    "a concealment of WHERE the death happened — the body moved, the true scene disguised",
    "a room that appears sealed but is not, so the killer is placed outside a space they were inside",
    "a route nobody believes exists, making an impossible presence look like an absence",
  ],
  identity: [
    "a concealment of WHO acted — one person taken for another at the critical moment",
    "a mistaken identification the whole household repeats until it hardens into fact",
    "a person believed absent who was present under another name",
  ],
  behavioral: [
    "a concealment of HOW someone behaves — a habit everyone believes is unbreakable and is not",
    "a routine so reliable that its one exception is invisible to every witness",
    "a character whose known incapacity is a performance",
  ],
  authority: [
    "a concealment resting on WHO IS BELIEVED — a testimony trusted because of the speaker's standing",
    "an official record accepted without question, and wrong",
    "a professional judgement nobody thinks to re-examine",
  ],
};

/** Period-plausible names, drawn fresh so the corpus stops sharing one cast. */
const SURNAMES = ["Ashgrove", "Bellamy", "Carrick", "Dunmore", "Ellery", "Fairweather", "Gaunt",
  "Halloway", "Ingram", "Jardine", "Kestrel", "Lachlan", "Merrow", "Norbury", "Orme", "Penhale",
  "Quayle", "Rutherford", "Selwyn", "Thorne", "Underhill", "Vance", "Whitlock", "Yardley"];
const FEMALE = ["Adela", "Beatrice", "Clarissa", "Dorothy", "Edith", "Frances", "Gwendolyn",
  "Harriet", "Iris", "Josephine", "Katherine", "Lavinia", "Marguerite", "Nora", "Ottoline", "Prudence"];
const MALE = ["Ambrose", "Bertram", "Cecil", "Desmond", "Edmund", "Ferdinand", "Gerald", "Hector",
  "Ivor", "Julian", "Kenneth", "Leonard", "Montague", "Neville", "Oswald", "Percival"];

const axis = arg("axis") ?? pick(Object.keys(AXES));
if (!AXES[axis]) {
  console.error(`\n  unknown axis "${axis}" — one of: ${Object.keys(AXES).join(", ")}\n`);
  process.exit(1);
}

const castSize = Number(arg("cast") ?? pick([5, 6, 6, 6, 7]));
const surnames = pickN(SURNAMES, castSize);
const castNames = [];
const castGenders = {};
for (let i = 0; i < castSize; i += 1) {
  const female = rnd() < 0.5;
  const given = pick(female ? FEMALE : MALE);
  // The victim is a doctor often enough in this genre to be worth keeping; the title also exercises
  // the honorific-stripping paths that have broken twice.
  const title = i === 1 && rnd() < 0.5 ? "Dr. " : "";
  const name = `${title}${given} ${surnames[i]}`;
  castNames.push(name);
  castGenders[name] = female ? "female" : "male";
}

const params = {
  seed,
  theme: `Golden Age murder mystery built on ${pick(AXES[axis])}. Enforce strict fair-play: `
    + `reveal all mechanism-critical clues to the reader by mid-story, and place the discriminating `
    + `test before the reveal.`,
  primaryAxis: axis,
  eraPreference: arg("era") ?? pick(["1920s", "1930s", "1930s", "1940s", "1950s"]),
  locationPreset: arg("location") ?? pick(["CountryHouse", "SeasideHotel", "Village", "Liner", "Theatre"]),
  tone: arg("tone") ?? pick(["Cozy", "Classic", "Classic", "Dark"]),
  /**
   * SHORT BY DEFAULT, and this is a correction rather than a preference.
   *
   * `canary-core-inputs.yaml` sets `targetLength: short`. A generated file REPLACES that file (it is
   * passed as CANARY_CORE_INPUTS_YAML, not merged into it), so omitting the field silently fell
   * through to the code default of "medium" — `prompt-builder.ts:1773`,
   * `const { targetLength = "medium" } = inputs`. The first seeded run therefore produced a medium
   * book while every prior book in the corpus is short, which would have confounded the one
   * comparison the run existed to make.
   *
   * Every field the baseline pins must be pinned here too, or the generator quietly changes things
   * nobody asked it to change. Override with `--length medium|long` when that is the point.
   */
  targetLength: arg("length") ?? "short",
  detectiveType: pick(["amateur", "amateur", "private", "police"]),
  narrativeStyle: pick(["classic", "classic", "atmospheric", "modern"]),
  castSize,
  castNames,
  castGenders,
};

const yaml = [
  `# GENERATED RUN PARAMETERS — seed ${seed}`,
  `#`,
  `# Reproduce this exact parameter set:`,
  `#     node scripts/run-params.mjs --seed ${seed}`,
  `#`,
  `# Run it:`,
  `#     CANARY_CORE_INPUTS_YAML=scripts/generated/run-params-${seed}.yaml \\`,
  `#       node --use-system-ca scripts/canary-core.mjs`,
  `#`,
  `# The pinned baseline (scripts/canary-core-inputs.yaml) is untouched and still the default.`,
  `# Generated ${new Date().toISOString()}`,
  ``,
  `seed: ${seed}`,
  `theme: ${JSON.stringify(params.theme)}`,
  `primaryAxis: ${params.primaryAxis}`,
  `eraPreference: ${JSON.stringify(params.eraPreference)}`,
  `locationPreset: ${params.locationPreset}`,
  `tone: ${JSON.stringify(params.tone)}`,
  `targetLength: ${params.targetLength}`,
  `detectiveType: ${params.detectiveType}`,
  `narrativeStyle: ${params.narrativeStyle}`,
  `castSize: ${params.castSize}`,
  `castNames:`,
  ...castNames.map((n) => `  - ${JSON.stringify(n)}`),
  `castGenders:`,
  ...castNames.map((n) => `  ${JSON.stringify(n)}: ${castGenders[n]}`),
  ``,
  `# ── SUBSYSTEM SWITCHES, copied verbatim from scripts/canary-core-inputs.yaml ────────────────────`,
  `#`,
  `# MEASURED, and this is the second instance of the defect the targetLength comment above describes.`,
  `# A generated file REPLACES the baseline rather than merging into it, and every one of these is read`,
  `# as a bare truthiness check (\`if (ctx.inputs.enableLockedFactRegistry)\`) with no \`?? true\` default —`,
  `# so omitting them SWITCHED SIX SUBSYSTEMS OFF on every seeded run.`,
  `#`,
  `# PROVEN for enableLockedFactRegistry: 42 \`apps/worker/logs/locked-facts-*.json\` files exist and the`,
  `# newest is from 2026-09-02, none for any seeded run — and that block also contains X38, the`,
  `# device-arithmetic reconciler and the case-time coherence check. The 76/100 read whose FIRST`,
  `# complaint was "that arithmetic is wrong" was produced by a run with the entire arithmetic-checking`,
  `# subsystem switched off. Not blind checks — absent ones.`,
  `enableLockedFactRegistry: true`,
  `enableLockedFactGate: true`,
  `enableBindingGates: true`,
  `enableCharacterBundle: true`,
  `enableOutlineCompleteness: true`,
  `enableSurgicalFingerprintRetry: true`,
  `proseBatchSize: 1`,
  `similarityThreshold: 0.9`,
  `skipNoveltyCheck: false`,
  ``,
].join("\n");

const outDir = join(ROOT, "scripts", "generated");
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, `run-params-${seed}.yaml`);
writeFileSync(outPath, yaml, "utf8");

console.log(`\nRUN_SEED=${seed}`);
console.log(`\n  axis      ${params.primaryAxis}`);
console.log(`  location  ${params.locationPreset} · ${params.eraPreference} · ${params.tone}`);
console.log(`  length    ${params.targetLength}${params.targetLength === "short" ? " (default — matches every prior book)" : " (OVERRIDDEN)"}`);
console.log(`  detective ${params.detectiveType} · ${params.narrativeStyle} · cast of ${castSize}`);
console.log(`  cast      ${castNames.join(", ")}`);
console.log(`\n  written   ${outPath.replace(ROOT, ".")}`);
console.log(`\n  RUN IT:`);
console.log(`    CANARY_CORE_INPUTS_YAML=scripts/generated/run-params-${seed}.yaml \\`);
console.log(`      node --use-system-ca scripts/canary-core.mjs`);
console.log(`\n  REPRODUCE THESE PARAMETERS:`);
console.log(`    node scripts/run-params.mjs --seed ${seed}\n`);

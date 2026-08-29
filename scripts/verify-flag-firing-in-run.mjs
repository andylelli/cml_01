#!/usr/bin/env node
/**
 * DID THE FLAGS ACTUALLY FIRE IN THE RUN? — read the evidence, do not assume it.
 *
 * `scripts/rehearse-flag-firing.mjs` proves a flag CAN change the model's instructions, by driving
 * each builder at its own gate for £0. That is necessary and not sufficient: it says nothing about
 * whether the gate was ever reached in a real run.
 *
 * This reads the run's own prompt log and manuscript. The rule this project learned the hard way
 * (memory: "always verify a lever via its agent label in llm-prompts-full.jsonl") is that grepping
 * the module proves nothing — only the bytes the model actually received do.
 *
 * IMPORTANT READING RULE. Four of these flags are CONDITIONAL:
 *   · AGENT9_LENGTH_COUNTERPRESSURE fires only if a chapter overshoots by >= 25%
 *   · AGENT9_CLUE_LIST_GRAMMAR      fires only if the missing-clue injector runs
 *   · AGENT9_REGEN_CONVERGENCE_STOP fires only if a regen loop fails repeatedly
 *   · AGENT9_CLEARANCE_TRIM         fires only if there are clearances to trim
 * "did not fire" for these means the run never entered the state, NOT that the flag is broken.
 * A clean run SHOULD leave several of them silent.
 *
 *   node scripts/verify-flag-firing-in-run.mjs [storyDir]
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();

/** The newest story folder, unless one was named. */
const storyDir = process.argv[2] || (() => {
  const base = join(ROOT, "stories");
  const dirs = readdirSync(base, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith("story_"))
    .map((e) => join(base, e.name))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return dirs[0];
})();

if (!storyDir || !existsSync(storyDir)) {
  console.error("\n  no story folder found\n");
  process.exit(1);
}

const manuscript = (() => {
  const f = readdirSync(storyDir).filter((n) => n.endsWith(".md") && !/review|report|notes/i.test(n));
  return f.length ? readFileSync(join(storyDir, f[0]), "utf8") : "";
})();

/** Prompts from this run only — matched by mtime window against the story folder. */
const promptLog = join(ROOT, "logs", "llm-prompts-full.jsonl");
const since = statSync(storyDir).mtimeMs - 90 * 60 * 1000;
const prompts = [];
if (existsSync(promptLog)) {
  for (const line of readFileSync(promptLog, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      const t = Date.parse(row.timestamp ?? row.time ?? 0) || 0;
      if (t >= since) prompts.push(row);
    } catch { /* a truncated tail line is not a reason to abandon the file */ }
  }
}
const promptText = prompts.map((p) => JSON.stringify(p)).join("\n");

const CHECKS = [
  { env: "AGENT9_AFTERMATH_GROUNDING", where: "prompt", needle: "PUT THE CONSEQUENCE IN THE ROOM",
    conditional: false, note: "finale grounding requirements reached Ch10" },
  { env: "AGENT9_VOICE_SPEC", where: "prompt", needle: "words per sentence",
    conditional: false, note: "a committed voice spec reached the writer" },
  { env: "AGENT9_LENGTH_COUNTERPRESSURE", where: "prompt", needle: "% of preferred length",
    conditional: true, note: "a chapter overshot and was told to tighten" },
  { env: "AGENT9_CLUE_LIST_GRAMMAR", where: "manuscript", needle: "one detail told against the account",
    conditional: true, note: "the injector ran and used the list grammar" },
];

console.log(`\n  FLAG FIRING IN THE RUN\n  story : ${storyDir}`);
console.log(`  prompts in window: ${prompts.length}   manuscript: ${manuscript.length} chars\n`);
console.log(`    ${"flag".padEnd(32)} ${"fired".padEnd(8)} ${"where".padEnd(11)} evidence`);
console.log(`    ${"-".repeat(100)}`);

for (const c of CHECKS) {
  const hay = c.where === "prompt" ? promptText : manuscript;
  const hit = hay.includes(c.needle);
  const verdict = hit ? "YES" : (c.conditional ? "not hit" : "NO");
  console.log(`    ${c.env.padEnd(32)} ${verdict.padEnd(8)} ${c.where.padEnd(11)} ${c.note}`);
}

// The voice spec is worth reading, not just counting: the whole point is that it DIVERGES.
//
// Read it ONLY from a ProseGenerator prompt. The voice-spec GENERATION prompt also contains
// "N words per sentence" — twice, as the open BANDS ("9.0 to 11.6", "19.2 to 22.0") — so a match
// across the whole log returns a band edge and reports a spec that was never committed. That is
// how this first reported 11.6 for a book whose committed spec was 22.
const proseOnly = prompts.filter((p) => String(p.agent ?? "").includes("ProseGenerator"))
  .map((p) => JSON.stringify(p)).join("\n");
const specLine = proseOnly.match(/(\d+(?:\.\d+)?) words per sentence/);
if (specLine) {
  console.log(`\n  committed voice: ${specLine[1]} words per sentence (corpus mean is 15.6; the gate demands >= 2.0 away)`);
  console.log(`  measure what the book DELIVERED against it — a spec that reaches the prompt and is`);
  console.log(`  ignored is a fired flag and a dead lever, and only the delivered number tells them apart.`);
}

console.log(`
  A "not hit" on a conditional flag means the run never entered its state. That is not a failure,
  and it is not evidence the flag works either — it is simply unmeasured by this run.
`);

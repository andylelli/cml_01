#!/usr/bin/env node
/**
 * A_75 P1v — read a MATCHED PAIR deterministically, before a human reads it.
 *
 * ── WHAT THIS IS FOR ─────────────────────────────────────────────────────────────────────────────
 *
 * A_74 §6.1 measured that no judge model resolves a gap under ~7 marks on this project, so the mark
 * itself has to come from a paying reader. That is expensive and slow, and it is the ONLY thing that
 * settles quality — which makes it worth knowing, before spending it, whether the two arms actually
 * differ in the way the lever claims.
 *
 * This answers the cheap half: **did the lever DELIVER?** Every number here is deterministic, needs
 * no model, and separates the two outcomes that A_75 §6.1 says must not be confused:
 *
 *   - the spec never reached the prose  → the read says nothing either way, and the pair is wasted
 *   - the spec reached the prose        → the read is evidence, whichever way it falls
 *
 * It does NOT say which book is better. Nothing here does. If it ever appears to, that is Goodhart
 * and the number should be deleted rather than trusted.
 *
 *   node scripts/matched-pair-report.mjs <armA.md> <armB.md>
 *   node scripts/matched-pair-report.mjs <armA.md> <armB.md> --spec '{"sentenceLength":{"mean":11,"sd":5}}'
 *
 * The `--spec` is arm B's committed VoiceSpec, copied from its run warnings ("VOICE SPEC committed:").
 * Given it, conformance is reported for BOTH arms — arm A's conformance against a spec it never saw
 * is the control, and it is the number that says whether the spec asked for anything unusual at all.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();

const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const specIdx = process.argv.indexOf("--spec");
const specRaw = specIdx >= 0 ? process.argv[specIdx + 1] : null;

if (args.length < 2) {
  console.error("\n  usage: node scripts/matched-pair-report.mjs <armA.md> <armB.md> [--spec '<json>']\n");
  process.exit(1);
}

const guardPath = join(ROOT, "packages", "prose-guard", "dist");
for (const f of ["machine-register.js", "voice-spec.js"]) {
  if (!existsSync(join(guardPath, f))) {
    console.error(`\n  build @cml/prose-guard first — ${join(guardPath, f)} is missing.\n`);
    process.exit(1);
  }
}
const { machineRegisterRate } = await import(pathToFileURL(join(guardPath, "machine-register.js")).href);
const { measureVoice, voiceConformance } = await import(pathToFileURL(join(guardPath, "voice-spec.js")).href);

const templates = join(ROOT, "packages", "prompts-llm", "dist", "agent9-prose", "injection-templates.js");
const { isInjectedSentence } = existsSync(templates)
  ? await import(pathToFileURL(templates).href)
  : { isInjectedSentence: () => false };

// ── read the arms ────────────────────────────────────────────────────────────

const stripFurniture = (text) => text.replace(/^\s*#.*$/gm, " ").replace(/^\s*\*.*$/gm, " ");

const load = (p, label) => {
  const full = existsSync(p) ? p : join(ROOT, p);
  if (!existsSync(full)) {
    console.error(`\n  ${label}: no such manuscript — ${p}\n`);
    process.exit(1);
  }
  const raw = readFileSync(full, "utf8");
  const text = stripFurniture(raw);
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 3);
  return {
    label,
    path: full,
    raw,
    text,
    sentences,
    voice: measureVoice(text),
    register: machineRegisterRate(text, 3),
    injected: sentences.filter((s) => isInjectedSentence(s)),
    words: text.split(/\s+/).filter(Boolean).length,
  };
};

const A = load(args[0], "arm A");
const B = load(args[1], "arm B");

let spec = null;
if (specRaw) {
  try {
    spec = JSON.parse(specRaw);
  } catch {
    console.error(`\n  --spec is not valid JSON. Copy it from the run's "VOICE SPEC committed" warning.\n`);
    process.exit(1);
  }
}

// ── report ───────────────────────────────────────────────────────────────────

const row = (name, a, b, note = "") => {
  const delta = typeof a === "number" && typeof b === "number"
    ? `${b - a > 0 ? "+" : ""}${(b - a).toFixed(2)}`
    : "";
  const fmt = (v) => (typeof v === "number" ? v.toFixed(2).padStart(8) : String(v).padStart(8));
  console.log(`  ${name.padEnd(30)} ${fmt(a)} ${fmt(b)} ${delta.padStart(9)}   ${note}`);
};

console.log(`\n  A_75 P1v — matched-pair delivery report\n`);
console.log(`  arm A : ${A.path}`);
console.log(`  arm B : ${B.path}\n`);
console.log(`  ${"".padEnd(30)} ${"arm A".padStart(8)} ${"arm B".padStart(8)} ${"delta".padStart(9)}`);
console.log(`  ${"-".repeat(76)}`);

row("words", A.words, B.words);
row("sentences", A.sentences.length, B.sentences.length);
row("mean sentence length", A.voice.mean, B.voice.mean, "<- THE lever's delivery");
row("within-book sd", A.voice.sd, B.voice.sd);
row("register rate @3 (%)", 100 * A.register.rate, 100 * B.register.rate, "measure only, never a verdict");
row("injected sentences", A.injected.length, B.injected.length, "machine text we wrote");

if (spec) {
  const ca = voiceConformance(A.text, spec);
  const cb = voiceConformance(B.text, spec);
  console.log(`  ${"-".repeat(76)}`);
  row("conformance to B's spec", ca.score, cb.score, `target ${spec.sentenceLength?.mean}±${spec.sentenceLength?.sd}`);
  row("  drift from target", ca.drift, cb.drift, "signed, in words");
  console.log("");
  // The two outcomes A_75 §6.1 insists must not be confused.
  if (cb.score >= 0.8) {
    console.log(`  DELIVERED (${cb.score.toFixed(2)} >= 0.80). Arm B held the voice it committed to, so a cold`);
    console.log(`  read of this pair IS evidence about the hypothesis — whichever way it falls.`);
  } else {
    console.log(`  NOT DELIVERED (${cb.score.toFixed(2)} < 0.80). Arm B did not hold its spec, so a read of this`);
    console.log(`  pair says NOTHING about whether a distinct voice raises the mark. Fix delivery first;`);
    console.log(`  spending a reader here would burn the only instrument that resolves a single mark.`);
  }
  if (ca.score >= 0.8) {
    console.log(`\n  NOTE: arm A also scores ${ca.score.toFixed(2)} against a spec it never saw — so the spec did not`);
    console.log(`  ask for anything the pipeline was not already doing, and the pair is not a contrast.`);
  }
}

// The separation the whole item rests on, stated in the units a reader would notice.
const gap = Math.abs(B.voice.mean - A.voice.mean);
console.log(`\n  voice separation: ${gap.toFixed(2)} words per sentence between the arms`);
console.log(`  (A_75 §3: BETWEEN-book sd across the last 15 manuscripts was 1.02 words. A pair that`);
console.log(`   separates by less than that has reproduced the uniformity, not broken it.)\n`);

if (B.injected.length > 0 || A.injected.length > 0) {
  console.log(`  injected sentences still present — these are the lines readers quote back as residue:`);
  for (const s of [...new Set([...A.injected, ...B.injected])].slice(0, 6)) {
    console.log(`    ${s.slice(0, 104)}`);
  }
  console.log("");
}

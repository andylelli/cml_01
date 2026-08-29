#!/usr/bin/env node
/**
 * Which measurable property of a manuscript predicts the HUMAN `prose` mark?
 *
 * Every prose lever this project has tried was justified by a defect a reader mentioned, or by how
 * often a detector fires. Four such hypotheses were tested against the ledger and four came back null
 * or wrong-signed (A_75 §12.3). The only validated instrument is the machine-register RATE.
 *
 * This sweeps a wide set of cheap text statistics against the mark itself — the ground truth, not a
 * proxy — over every manuscript with an external read. A property that does not correlate here cannot
 * be worth building a lever for, and one that does is worth more than any amount of reader anecdote.
 *
 *   node scripts/prose-feature-sweep.mjs
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const guard = join(ROOT, "packages/prose-guard/dist/machine-register.js");
if (!existsSync(guard)) { console.error("\n  build @cml/prose-guard first\n"); process.exit(1); }
const { machineRegisterRate } = await import(pathToFileURL(guard).href);

const manifest = JSON.parse(readFileSync(join(ROOT, "eval/results/external-read/manifest.json"), "utf8"));

const books = [];
for (const e of manifest) {
  const p = e?.storyPath && join(ROOT, e.storyPath);
  if (!p || !existsSync(p) || !e.externalCategories) continue;
  const raw = readFileSync(p, "utf8");
  const body = raw.replace(/^\s*#.*$/gm, " ");
  const chapters = raw.split(/^##\s+/m).slice(1);

  // Dialogue vs narration. These manuscripts use straight quotes, sometimes mismatched.
  const quoted = body.match(/"[^"]{2,400}"/g) ?? [];
  const dialogueWords = quoted.join(" ").split(/\s+/).filter(Boolean).length;
  const words = body.split(/\s+/).filter(Boolean).length;
  const narration = body.replace(/"[^"]*"/g, " ");

  const sentences = narration.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => s.split(/\s+/).length >= 3);
  const lens = sentences.map((s) => s.split(/\s+/).length);
  const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  const sd = (xs) => {
    if (xs.length < 2) return 0;
    const m = mean(xs);
    return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
  };
  const paras = body.split(/\n\s*\n/).map((x) => x.trim()).filter((x) => x.split(/\s+/).length > 12);
  const per1k = (n) => (words ? (1000 * n) / words : 0);
  const count = (re) => (narration.match(re) ?? []).length;

  books.push({
    mark: e.externalCategories.prose ?? 0,
    headline: e.externalFinal ?? 0,
    f: {
      "register rate @3": machineRegisterRate(body, 3).rate * 100,
      "dialogue share %": words ? (100 * dialogueWords) / words : 0,
      "mean sentence len": mean(lens),
      "sentence len sd": sd(lens),
      "short sents <8w %": lens.length ? (100 * lens.filter((x) => x < 8).length) / lens.length : 0,
      "long sents >25w %": lens.length ? (100 * lens.filter((n) => n > 25).length) / lens.length : 0,
      "mean para words": mean(paras.map((p) => p.split(/\s+/).length)),
      "paras per chapter": chapters.length ? paras.length / chapters.length : 0,
      "chapters": chapters.length,
      "total words": words,
      "semicolons /1k": per1k(count(/;/g)),
      "em-dashes /1k": per1k(count(/—/g)),
      "adverbs -ly /1k": per1k(count(/\b\w+ly\b/gi)),
      "was|were /1k": per1k(count(/\b(?:was|were)\b/gi)),
      "questions /1k": per1k(count(/\?/g)),
      "sensory verbs /1k": per1k(count(/\b(?:saw|heard|felt|smelled|tasted|touched)\b/gi)),
    },
  });
}

const spearman = (xs, ys) => {
  const rank = (v) => {
    const s = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
    const out = new Array(v.length);
    s.forEach(([, i], k) => { out[i] = k + 1; });
    return out;
  };
  const rx = rank(xs), ry = rank(ys), n = xs.length;
  const d2 = rx.reduce((a, x, i) => a + (x - ry[i]) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
};

const n = books.length;
const crit = 1.96 / Math.sqrt(n - 1);
console.log(`\n  ${n} manuscripts with an external read · |rho| > ${crit.toFixed(3)} to signify\n`);
console.log(`    ${"feature".padEnd(22)} ${"vs prose".padStart(9)}  ${"vs headline".padStart(11)}   verdict`);
console.log(`    ${"-".repeat(70)}`);

const names = Object.keys(books[0].f);
const rows = names.map((k) => {
  const xs = books.map((b) => b.f[k]);
  return { k, prose: spearman(xs, books.map((b) => b.mark)), head: spearman(xs, books.map((b) => b.headline)) };
});
rows.sort((a, b) => Math.abs(b.prose) - Math.abs(a.prose));
for (const r of rows) {
  const sig = Math.abs(r.prose) > crit ? (r.prose < 0 ? "SIGNIFICANT (less is better)" : "SIGNIFICANT (more is better)") : "";
  console.log(`    ${r.k.padEnd(22)} ${r.prose.toFixed(3).padStart(9)}  ${r.head.toFixed(3).padStart(11)}   ${sig}`);
}
console.log("");

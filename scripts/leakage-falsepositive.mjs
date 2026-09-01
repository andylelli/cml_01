#!/usr/bin/env node
/**
 * A_80 §2.3 — false-positive rate of the control-plane-leakage rules.
 *
 *   node scripts/leakage-falsepositive.mjs
 *
 * Runs every rule in `packages/story-validation/src/control-plane-leakage.ts` over two populations
 * that are clean BY CONSTRUCTION: our 204 archived manuscripts, and the 12 real Golden Age novels in
 * `library/texts/`. A rule that fires on Wilkie Collins cannot tell prompt leakage from English.
 *
 * MEASURED 2026-08-31: `instruction_shape` fires on 2 of 12 canonical novels (16.7%) on the phrase
 * "required to". In run mystery-1788202899854 it flagged a chapter whose sentence stated the case's
 * arithmetic correctly, forced a regeneration, and the regenerated chapter shipped with the arithmetic
 * broken — which the external reader scored 4/10 on clue logic.
 *
 * 17 of the 19 rules are clean against canon, so this is a narrow defect in a mostly sound detector
 * family, not grounds to distrust the component. This script is the regression test for that fix.
 */
import fs from "node:fs";
import path from "node:path";

const RULES = [];
const src = fs.readFileSync("C:/CML/packages/story-validation/src/control-plane-leakage.ts", "utf8");
// Pull { code: '...', pattern: /.../flags, confidence: '...', severity: '...' } tuples out of the source.
const re = /\{\s*code:\s*'([^']+)'\s*,\s*pattern:\s*(\/(?:\\.|\[[^\]]*\]|[^/\\])+\/[gimsuy]*)\s*,\s*confidence:\s*'([^']+)'\s*,\s*severity:\s*'([^']+)'/g;
let m;
while ((m = re.exec(src)) !== null) {
  const [, code, litr, confidence, severity] = m;
  const lastSlash = litr.lastIndexOf("/");
  const body = litr.slice(1, lastSlash);
  const flags = litr.slice(lastSlash + 1).replace(/[gy]/g, "");
  try { RULES.push({ code, confidence, severity, re: new RegExp(body, flags + "g") }); } catch (e) { console.error("skip " + code + ": " + e.message); }
}
console.log(`rules parsed: ${RULES.length}\n`);

const collect = (dir, ext, min) => {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith(ext) && fs.statSync(p).size > min) out.push(p);
    }
  };
  walk(dir);
  return out;
};

const ours = collect("C:/CML/stories", ".md", 4000);
const canon = collect("C:/CML/library/texts", ".txt", 1000);
console.log(`ours: ${ours.length} manuscripts   canon: ${canon.length} novels\n`);

const measure = (files, label) => {
  const rows = RULES.map((r) => ({ code: r.code, conf: r.confidence, sev: r.severity, docs: 0, hits: 0, sample: "" }));
  for (const f of files) {
    const t = fs.readFileSync(f, "utf8");
    RULES.forEach((r, i) => {
      r.re.lastIndex = 0;
      const ms = t.match(r.re);
      if (ms && ms.length) {
        rows[i].docs += 1;
        rows[i].hits += ms.length;
        if (!rows[i].sample) rows[i].sample = String(ms[0]).slice(0, 34);
      }
    });
  }
  console.log(`── ${label} (n=${files.length}) ───────────────────────────────────────────`);
  console.log(`  ${"code".padEnd(28)} ${"sev".padEnd(6)} ${"docs firing".padStart(13)} ${"hits".padStart(7)}   example`);
  for (const r of rows.sort((a, b) => b.docs - a.docs)) {
    const pct = files.length ? ((100 * r.docs) / files.length).toFixed(1) : "0";
    console.log(`  ${r.code.padEnd(28)} ${r.sev.padEnd(6)} ${String(`${r.docs} (${pct}%)`).padStart(13)} ${String(r.hits).padStart(7)}   ${r.sample}`);
  }
  console.log();
  return rows;
};

measure(ours, "OUR 204 ARCHIVED MANUSCRIPTS");
measure(canon, "12 REAL GOLDEN AGE NOVELS (known-clean by construction)");

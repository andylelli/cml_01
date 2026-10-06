#!/usr/bin/env node
/**
 * A_111 P-2 — would arm B's tail deletions have landed without `registerNotWorse`?
 *
 * Arm B's editor edit lists were never persisted (the prompt log keeps prompts only), so the editor is SIMULATED: for
 * each `body_tail` finding the v2 finder would raise (its regex, its "after the first three, at most twelve" rule), the
 * edit the finding asks for — "cut the clause after the comma …; end the sentence before it" — is built as a strict
 * deletion and applied through `dist`'s real `applyEditList` with the real guards, flag OFF and ON. The tail rate is the
 * pair's own instrument (`measurePageShape(...).tailPer10k`, prose-guard). Lock values are unknown here (none passed),
 * so `lockedValuesIntact` cannot fire; every other guard is live.
 *
 *   node documentation/analysis/ANALYSIS_111/probes/tail-deletion-replay.mjs <book.md> <projectId>
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const [md, projectId] = process.argv.slice(2);
const pe = await import(pathToFileURL(`${process.cwd()}/packages/prose-engine/dist/index.js`).href);
const pg = await import(pathToFileURL(`${process.cwd()}/packages/prose-guard/dist/index.js`).href);

const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const cast = Object.values(store.artifacts).filter((a) => a.projectId === projectId && a.type === "cast").at(-1)?.payload;
const castNames = ((cast?.cast ?? cast)?.characters ?? []).map((c) => c.name).filter(Boolean);

const raw = readFileSync(md, "utf8");
const chapters = raw.split(/^##\s+Chapter\s+\d+[^\n]*$/m).slice(1)
  .map((c, i) => ({ title: `Chapter ${i + 1}`, paragraphs: c.replace(/^---\s*$/gm, "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) }));

// The finder's own regex and selection (findings.ts, A_110 L6).
const TAIL = /,\s+(?:his|her|their)\s+(?:\w+\s+)?(?:hands?|fingers?|eyes|gaze|voice|tone|face|expression|jaw|lips|posture|manner|movements?|words|resolve|pen|shoulders)\s+\w+/i;
const sentencesOf = (p) => p.match(/[^.!?]+[.!?]+["”’]?/g) ?? [];

const run = (flagOn) => {
  if (flagOn) process.env.PROSE_V2_TAIL_FINDING = "1"; else delete process.env.PROSE_V2_TAIL_FINDING;
  let asked = 0, applied = 0, skipped = 0;
  const rolledBack = {};
  const out = chapters.map((ch) => {
    const tails = ch.paragraphs.flatMap(sentencesOf).map((s) => s.trim()).filter((s) => TAIL.test(s) && !/["“”]/.test(s));
    if (tails.length < 4) return ch;
    const edits = tails.slice(3, 15).map((s) => {
      const at = s.search(TAIL);
      const end = s.match(/[.!?]+["”’]?$/)?.[0] ?? ".";
      return { find: s, replace: s.slice(0, at) + end, addresses: [0] };
    }).filter((e) => pe.isStrictDeletion(e.find, e.replace));
    asked += edits.length;
    const r = pe.applyEditList(ch, { edits, cannot: [] }, { lockedValues: [], castNames, findings: [] });
    applied += r.outcome.applied;
    skipped += r.outcome.skipped;
    for (const [g, n] of Object.entries(r.outcome.rolledBack ?? {})) rolledBack[g] = (rolledBack[g] ?? 0) + n;
    return r.chapter;
  });
  const body = out.map((c) => c.paragraphs.join("\n\n")).join("\n\n");
  return { asked, applied, skipped, rolledBack, tailPer10k: pg.measurePageShape(body).tailPer10k, register: pe.bookRegisterRate(out) };
};

const before = pg.measurePageShape(chapters.map((c) => c.paragraphs.join("\n\n")).join("\n\n")).tailPer10k;
console.log(`book ${md.split(/[\\/]/).slice(-2).join("/")} · cast names ${castNames.length} · tail per 10k as saved ${before.toFixed(1)}`);
for (const on of [false, true]) {
  const r = run(on);
  console.log(`PROSE_V2_TAIL_FINDING ${on ? "ON " : "OFF"}  asked ${r.asked} · applied ${r.applied} · skipped ${r.skipped} · rolled back ${JSON.stringify(r.rolledBack)} · tail per 10k after ${r.tailPer10k.toFixed(1)} · register rate ${r.register.toFixed(4)}`);
}

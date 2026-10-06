// V-15 over the 29 distinct stored books with their contracts. Known positives: a case's OWN chapters. Known
// negatives: another case's chapter of the same number (offset 7 in the case list, so never the same cast), and
// canon chapters (1,250-word windows of three library texts).
//  1. the selector's clue_missing: OFF (chapterMentionsRequiredClue, the path run.ts takes) vs ON (clueTermsOnPage);
//  2. the gate's decisive-clue stop: OFF (any one term, substring) vs ON (the built applyGate), and, for the record,
//     the same word rule required inside ONE chapter or ONE paragraph instead of across all the pre-reveal text.
// Usage: node clue-rule.mjs
import { distinct, canonChapters, CANON, PE } from "./cases.mjs";
const PL = await import("file:///C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prompts-llm/dist/index.js");
const books = distinct.filter((c) => c.chapters.length >= 8);
const canon = CANON.map((p) => canonChapters(p));
const body = (c) => (c?.paragraphs ?? []).join("\n");
const t = {}; const add = (k, v, ok) => { t[k] ??= {}; t[k][v] ??= [0, 0]; t[k][v][0] += ok ? 1 : 0; t[k][v][1]++; };
let fewTerms = 0, surfaces = 0;
for (const [bi, b] of books.entries()) {
  const other = books[(bi + 7) % books.length];
  for (const scene of b.contract.scenes) for (const s of scene.mustSurface) {
    surfaces++; if (s.keyTerms.length < 2) fewTerms++;
    const texts = {
      "own chapter (positive)": body(b.chapters.find((c) => c.number === scene.chapter)),
      "another case's chapter (negative)": body(other.chapters.find((c) => c.number === scene.chapter) ?? other.chapters[0]),
      ...Object.fromEntries(canon.map((cb, ci) => [`canon ${ci} (negative)`, body(cb[(scene.chapter - 1) % cb.length])])),
    };
    for (const [k, txt] of Object.entries(texts)) {
      add(k, "OFF chapterMentionsRequiredClue", PL.chapterMentionsRequiredClue(txt, s.id, b.clues, b.castNames));
      add(k, "ON  clueTermsOnPage", PE.clueTermsOnPage(s.keyTerms, txt.toLowerCase()));
    }
  }
}
console.log(`SELECTOR clue_missing — ${books.length} books, ${surfaces} chapter x clue pairs (${fewTerms} with fewer than 2 key terms)`);
for (const [k, row] of Object.entries(t)) { console.log(" ", k); for (const [v, [p, n]] of Object.entries(row)) console.log(`     ${v.padEnd(34)} present ${p} of ${n} (${((100 * p) / n).toFixed(0)}%)`); }

const g = {}; const gadd = (k, v, ok) => { g[k] ??= {}; g[k][v] ??= [0, 0]; g[k][v][0] += ok ? 1 : 0; g[k][v][1]++; };
let decisive = 0;
for (const [bi, b] of books.entries()) {
  const other = books[(bi + 7) % books.length];
  const reveal = b.contract.roles.reveal;
  const sources = { "own book (positive)": b.chapters, "another case (negative)": other.chapters, ...Object.fromEntries(canon.map((cb, ci) => [`canon ${ci} (negative)`, cb])) };
  for (const id of b.contract.fairPlay.decisiveClueIds) {
    const s = b.contract.scenes.flatMap((x) => x.mustSurface).find((x) => x.id === id);
    if (!s || s.keyTerms.length < 3) continue;
    decisive++;
    const core = { ...b.contract, fairPlay: { ...b.contract.fairPlay, culprits: [], decisiveClueIds: [id] } };
    for (const [k, chs] of Object.entries(sources)) {
      const numbered = chs.map((c, i) => ({ ...c, number: c.number ?? i + 1 }));
      const expected = numbered.map((c) => c.number);
      const passes = (flag) => {
        if (flag) process.env.PROSE_V2_AUDIT_FIXES = "1"; else delete process.env.PROSE_V2_AUDIT_FIXES;
        const v = PE.applyGate({ chapters: numbered, core, expected, findings: [], deterministicWrites: 0 });
        delete process.env.PROSE_V2_AUDIT_FIXES;
        return !v.stops.some((x) => x.startsWith("the decisive clue"));
      };
      gadd(k, "OFF any one term, substring", passes(false));
      gadd(k, "ON  built gate (one chapter, word rule)", passes(true));
      const pre = numbered.filter((c) => c.number < reveal);
      gadd(k, "    (word rule, all pre-reveal text)", PE.clueTermsOnPage(s.keyTerms, pre.map(body).join(" ").toLowerCase()));
      gadd(k, "    (word rule inside one paragraph)", pre.some((c) => (c.paragraphs ?? []).some((p) => PE.clueTermsOnPage(s.keyTerms, p.toLowerCase()))));
    }
  }
}
console.log(`\nGATE decisive-clue stop — ${decisive} decisive clues with 3+ key terms; "passes" = the stop stays silent`);
for (const [k, row] of Object.entries(g)) { console.log(" ", k); for (const [v, [p, n]] of Object.entries(row)) console.log(`     ${v.padEnd(38)} passes ${p} of ${n}`); }

// Per CHAPTER, for early-placement clues: how often does a chapter show the observation (observable-only
// pool says present) while the current pool (observable + pointsTo) says absent? Those are the chapters
// where the clue is on the page without its conclusion words — the placement early clues are FOR — and
// where the floor pastes the label. Measured across every stored book with prose + clues.
import { readFileSync } from "node:fs";
import { tokenizeForClueObligation, tokenMatchesText } from "file:///C:/CML/packages/prompts-llm/dist/agent9-prose/clue-validation.js";

const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const byProject = new Map();
for (const a of Object.values(store.artifacts)) {
  if (!byProject.has(a.projectId)) byProject.set(a.projectId, {});
  byProject.get(a.projectId)[a.type] = a.payload;
}
const verdict = (tokens, lowered) => {
  const t = Array.from(new Set(tokens)).slice(0, 10);
  if (t.length === 0) return null;
  const matched = t.filter((x) => tokenMatchesText(x, lowered)).length;
  return matched >= Math.max(1, Math.ceil(t.length * 0.55));
};
let books = 0, earlyClues = 0, chaptersObs = 0, chaptersObsNotCurrent = 0, firstObsChapterMissedByCurrent = 0, neverObserved = 0;
const examples = [];
for (const [pid, p] of byProject) {
  if (!p.clues || !p.prose) continue;
  const chapters = (p.prose?.chapters ?? p.prose?.prose?.chapters ?? []).map((c) => (c?.paragraphs ?? []).join(" ").toLowerCase());
  if (chapters.length < 6) continue;
  books += 1;
  for (const clue of p.clues.clues ?? []) {
    if (clue.placement !== "early") continue;
    const observable = String(clue.observable ?? "").trim();
    const pointsTo = String(clue.pointsTo ?? "").trim();
    if (!observable || !pointsTo) continue;
    earlyClues += 1;
    const obsTokens = tokenizeForClueObligation(observable);
    const curTokens = [...obsTokens, ...tokenizeForClueObligation(pointsTo)];
    let first = -1;
    chapters.forEach((text, i) => {
      const obs = verdict(obsTokens, text);
      if (obs !== true) return;
      chaptersObs += 1;
      if (first < 0) first = i;
      if (verdict(curTokens, text) !== true) chaptersObsNotCurrent += 1;
    });
    if (first < 0) { neverObserved += 1; continue; }
    if (verdict(curTokens, chapters[first]) !== true) {
      firstObsChapterMissedByCurrent += 1;
      if (examples.length < 5) examples.push(`${pid.slice(-6)} ch${first + 1} ${clue.id}  pointsTo="${pointsTo.slice(0, 40)}"`);
    }
  }
}
console.log(`books ${books} · early clues ${earlyClues} · never observed anywhere ${neverObserved}`);
console.log(`  chapters where the OBSERVATION is on the page                         : ${chaptersObs}`);
console.log(`  ...of which the current pool (observation + inference words) says ABSENT: ${chaptersObsNotCurrent} (${(100 * chaptersObsNotCurrent / Math.max(1, chaptersObs)).toFixed(1)}%)`);
console.log(`  early clues whose FIRST observed chapter the current pool judges absent  : ${firstObsChapterMissedByCurrent} of ${earlyClues - neverObserved} (${(100 * firstObsChapterMissedByCurrent / Math.max(1, earlyClues - neverObserved)).toFixed(1)}%)`);
for (const e of examples) console.log("   e.g. " + e);

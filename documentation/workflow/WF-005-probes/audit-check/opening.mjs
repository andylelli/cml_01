// Arm B, segment 0 (chapter 1): rebuild the three drafts from the writer responses, score them as the run did, and
// choose with and without the M10 opening option — which one reproduces the run's reported "rank 5.5"?
import fs from 'node:fs';
import { buildContract } from './contract.mjs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const { contract, artifacts } = buildContract('2026-10-06T17:43');
const lines = fs.readFileSync('C:/CML/.claude/worktrees/a110-pair/logs/llm.jsonl', 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const scored = [1, 2, 3].map((d) => {
  const raw = lines.filter((j) => j.runId === 'resume-1791308574179' && j.agent === `Agent9v2-Writer-S0-D${d}` && j.operation === 'chat_response').map((r) => r.response).join('\n\n');
  const parsed = PE.parseWriterOutput(raw, [1]);
  const draft = { attempt: d, chapters: parsed.chapters, missing: parsed.missing ?? [] };
  return { draft, score: PE.scoreDraft(draft, contract, [1], { witTargetPer10k: 41, clueDistribution: artifacts.clues }) };
});
const primary = artifacts.location_profiles.primary;
const nouns = [...PE.contentWordsOf(`${primary.visualDescription ?? ''} ${primary.summary ?? ''}`)];
const corpus = JSON.parse(fs.readFileSync('C:/CML/.claude/worktrees/a110-pair/data/opening-corpus.json', 'utf8'));
const pastOpenings = [...(corpus.recentOpenings ?? []), ...(corpus.recentOpeningSituations ?? [])].map(String).filter(Boolean);
for (const withOpening of [false, true]) {
  const copy = scored.map((s) => ({ ...s }));
  const chosen = PE.chooseDraft(copy, { bookSoFar: '', ...(withOpening ? { opening: { nouns, pastOpenings } } : {}) });
  console.log(`opening option ${withOpening ? 'PASSED' : 'absent'}:`);
  console.log(PE.summariseSelection(copy, chosen));
}
for (const s of scored) console.log('draft', s.draft.attempt, JSON.stringify(s.score.hard));
// The run recorded draft 2 with [book_short] only: align the hard hits with the run's record and choose again.
for (const s of scored) s.score = { ...s.score, hard: s.score.hard.filter((h) => h.kind !== 'clue_missing') };
for (const withOpening of [false, true]) {
  const copy = scored.map((s) => ({ ...s }));
  const chosen = PE.chooseDraft(copy, { bookSoFar: '', ...(withOpening ? { opening: { nouns, pastOpenings } } : {}) });
  console.log(`[aligned to the run's hard hits] opening option ${withOpening ? 'PASSED' : 'absent'}:`);
  console.log(PE.summariseSelection(copy, chosen));
}

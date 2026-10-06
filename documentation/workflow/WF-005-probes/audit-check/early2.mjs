import fs from 'node:fs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const cases = [['C:/CML/apps/worker/logs/agent9v2-checkpoint-canary_1790272530595.json', 6], ['C:/CML/apps/worker/logs/agent9v2-checkpoint-canary_1790272530595.pair2-2026-09-25.json', 4], ['C:/CML/apps/worker/logs/agent9v2-checkpoint-proj_d0ee7b26-7e02-43f2-98a6-2c4993d9d59e.json', 6], ['C:/CML/.claude/worktrees/a110-pair/apps/worker/logs/agent9v2-checkpoint-proj_5eb8c115-ca42-4e66-997d-74fff1b327db.json', 8]];
for (const [f, idx] of cases) {
  const s = JSON.parse(fs.readFileSync(f, 'utf8')).segments[idx];
  const mk = (strip) => s.drafts.map(d => ({ draft: { attempt: d.attempt, chapters: d.chapters, missing: [] }, score: { ...d.score, hard: d.score.hard.filter(h => !(strip && (h.kind === 'culprit_early' || h.kind === 'reveal_unnamed'))) } }));
  for (const ranks of ['0', '1']) {
    process.env.PROSE_V2_SELECTOR_RANKS = ranks;
    const a = PE.chooseDraft(mk(false)), b = PE.chooseDraft(mk(true));
    console.log(f.split('checkpoint-')[1].slice(0, 40), 'seg', idx, 'ranks', ranks, 'recorded chosen', s.chosen, '| replay chosen', a.draft.attempt, '| without the false hit', b.draft.attempt, '| composites', s.drafts.map(d => `${d.attempt}:${d.score.composite.toFixed(1)}`).join(' '));
  }
}

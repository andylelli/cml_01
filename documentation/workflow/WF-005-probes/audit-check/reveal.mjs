import fs from 'node:fs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const files = ['C:/CML/.claude/worktrees/a110-pair/apps/worker/logs/agent9v2-checkpoint-proj_5eb8c115-ca42-4e66-997d-74fff1b327db.json','C:/CML/apps/worker/logs/agent9v2-checkpoint-canary_1790272530595.json','C:/CML/apps/worker/logs/agent9v2-checkpoint-canary_1790272530595.pair2-2026-09-25.json'];
for (const f of files) {
  const c = JSON.parse(fs.readFileSync(f,'utf8'));
  for (const s of c.segments) {
    const has = s.drafts.map(d => d.score.hard.find(h => h.kind === 'reveal_unnamed'));
    if (!(has.some(Boolean) && !has.every(Boolean))) continue;
    const detail = has.find(Boolean).detail;
    const culprit = detail.split(' is never named')[0];
    console.log(f.split('/').pop(), 'segment', s.index, 'chapters', s.chapters, '|', detail);
    for (const d of s.drafts) {
      const text = d.chapters.map(ch => ch.paragraphs.join(' ')).join(' ');
      const words = text.split(/\s+/).length;
      const named = culprit.split(', ').some(cu => PE.namesAsCulprit(text, cu));
      const sent = named ? text.split(/(?<=[.!?]["”]?)\s+/).find(x => culprit.split(', ').some(cu => PE.namesAsCulprit(x, cu))) : '';
      const v = d.score.vector;
      console.log(`   draft ${d.attempt}${d.attempt === s.chosen ? '*' : ' '} words ${words} composite ${d.score.composite.toFixed(1)} speech ${(v.dialogueOpenShare*100).toFixed(0)}% wit ${v.witPer10k.toFixed(0)} namesCulprit=${named} ${sent ? '"' + sent.slice(0, 200) + '"' : ''}`);
    }
  }
}

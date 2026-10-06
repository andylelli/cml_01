// NOTE (vbatch-B): story_20261002-2110 is the SAME case (it names Isabel Morton; 8/8 terms in one paragraph) — a known POSITIVE, not a negative.
// Gate stop 2 ("a decisive clue is on no page before the reveal"): does it fire when the clue is certainly ABSENT?
// Known negative: another case's chapters, or a canon novel, under THIS case's contract.
import fs from 'node:fs';
import { buildContract } from './contract.mjs';
const PE = await import('file:///C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prose-engine/dist/index.js');
const { contract } = buildContract('2026-10-06T17:43');
const reveal = contract.roles.reveal;
const decisive = contract.fairPlay.decisiveClueIds;
console.log('reveal', reveal, 'decisive clues', decisive.length);
for (const id of decisive) {
  const s = contract.scenes.flatMap((x) => x.mustSurface).find((x) => x.id === id);
  console.log('  ', id, s ? `${s.keyTerms.length} terms: ${s.keyTerms.join(' | ')}` : '(no surface)');
}
const chaptersOf = (file) => fs.readFileSync(file, 'utf8').split(/^## Chapter \d+[^\n]*$/m).slice(1)
  .map((body, i) => ({ number: i + 1, title: '', paragraphs: body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) }));
const canonChapters = (file) => {
  const paras = fs.readFileSync(file, 'utf8').split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const out = []; let cur = []; let n = 0;
  for (const p of paras) { cur.push(p); n += p.split(' ').length; if (n >= 1250) { out.push(cur); cur = []; n = 0; } if (out.length === 10) break; }
  return out.map((paragraphs, i) => ({ number: i + 1, title: '', paragraphs }));
};
const expected = contract.scenes.map((s) => s.chapter);
const verdict = (label, chapters) => {
  // vbatch-B: OFF and ON (PROSE_V2_AUDIT_FIXES, read at call time).
  for (const flag of [false, true]) {
    if (flag) process.env.PROSE_V2_AUDIT_FIXES = '1'; else delete process.env.PROSE_V2_AUDIT_FIXES;
    const v = PE.applyGate({ chapters, core: contract, expected, findings: [], deterministicWrites: 0 });
    delete process.env.PROSE_V2_AUDIT_FIXES;
    const clueStops = v.stops.filter((s) => s.startsWith('the decisive clue'));
    console.log(`${flag ? 'ON ' : 'OFF'} ${label}: decisive-clue stops ${clueStops.length} of ${decisive.length}; culprit stop ${v.stops.some((s) => s.startsWith('no chapter')) ? 'FIRES' : 'silent'}`);
  }
};
verdict('this case (arm B)', chaptersOf('C:/CML/stories/story_20261006-1853/resumed_resume_1791308574179.md'));
const others = ['story_20261002-2110', 'story_20260930-2042', 'story_20260925-1148'];
for (const o of others) {
  const dir = `C:/CML/stories/${o}`;
  const md = fs.readdirSync(dir).find((f) => f.endsWith('.md'));
  verdict(`ANOTHER case (${o})`, chaptersOf(`${dir}/${md}`));
}
for (const t of ['the_mysterious_affair_at_styles.txt', 'a_study_in_scarlet.txt', 'the_moonstone.txt']) {
  const p = `C:/CML/library/texts/${t}`;
  if (fs.existsSync(p)) verdict(`CANON ${t}`, canonChapters(p));
}

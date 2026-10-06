// Selector hard gate clue_missing (chapterMentionsRequiredClue, the path the run takes with ctx.clues):
// on text that certainly does NOT carry this case's clues (canon chapters, another case), how often is a clue "present"?
import fs from 'node:fs';
import { buildContract } from './contract.mjs';
const PL = await import('file:///C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prompts-llm/dist/index.js');
const { contract, artifacts, castNames } = buildContract('2026-10-06T17:43');
const clues = artifacts.clues;
const surfaces = contract.scenes.flatMap((s) => s.mustSurface.map((m) => ({ chapter: s.chapter, id: m.id })));
console.log('clue surfaces owed', surfaces.length);
const canonChunks = (file, n = 10) => {
  const paras = fs.readFileSync(file, 'utf8').split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const out = []; let cur = []; let w = 0;
  for (const p of paras.slice(40)) { cur.push(p); w += p.split(' ').length; if (w >= 1250) { out.push(cur.join('\n')); cur = []; w = 0; } if (out.length === n) break; }
  return out;
};
const ownChapters = fs.readFileSync('C:/CML/stories/story_20261006-1853/resumed_resume_1791308574179.md', 'utf8').split(/^## Chapter \d+[^\n]*$/m).slice(1);
// vbatch-B: ON is the selector's audited rule, the word rule on the clue's own key terms (PE.clueTermsOnPage).
const PE = await import('file:///C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prose-engine/dist/index.js');
const termsOf = (id) => contract.scenes.flatMap((s) => s.mustSurface).find((s) => s.id === id)?.keyTerms ?? [];
const test = (label, texts) => {
  let present = 0, presentOn = 0, total = 0;
  for (const { chapter, id } of surfaces) {
    const body = texts[(chapter - 1) % texts.length];
    total++;
    if (PL.chapterMentionsRequiredClue(body, id, clues, castNames)) present++;
    if (PE.clueTermsOnPage(termsOf(id), body.toLowerCase())) presentOn++;
  }
  console.log(`${label}: clue reported PRESENT in ${present} (OFF) / ${presentOn} (ON) of ${total} chapter-clue pairs`);
};
test('own book, own chapters (known positive)', ownChapters);
test('own book, chapters shifted by 5 (clue owed elsewhere)', ownChapters.map((_, i) => ownChapters[(i + 5) % ownChapters.length]));
for (const t of ['a_study_in_scarlet.txt', 'the_moonstone.txt', 'a_silent_witness.txt']) test(`CANON ${t} (known negative)`, canonChunks(`C:/CML/library/texts/${t}`));

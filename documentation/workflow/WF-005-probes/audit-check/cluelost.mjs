// Did any applied edit take a chapter's owed clue from present to absent? Compare the editor's input chapter with the
// shipped chapter (prose artifact), on the selector's own clue test (chapterMentionsRequiredClue with ctx.clues).
import { editorCalls, parsePrompt, RUNS, loadStore } from './ctx.mjs';
import { buildContract } from './contract.mjs';
const PL = await import('file:///C:/CML/packages/prompts-llm/dist/index.js');
const store = loadStore();
const prose = Object.values(store.artifacts).filter((a) => a.projectId === 'proj_5eb8c115-ca42-4e66-997d-74fff1b327db' && a.type === 'prose' && a.createdAt);
for (const [arm, after, stamp] of [['A', '2026-10-06T17:31', '2026-10-06T17:41'], ['B', '2026-10-06T17:43', '2026-10-06T17:53']]) {
  process.env.PROSE_V2_CONTRACT_FIXES = arm === 'B' ? '1' : '0';
  const { contract, artifacts, castNames } = buildContract(after);
  const shipped = prose.find((p) => p.createdAt.startsWith(stamp)).payload.chapters;
  const firstInput = new Map();
  for (const c of editorCalls(RUNS[arm])) { const p = parsePrompt(c.user); if (!firstInput.has(p.chapterNumber)) firstInput.set(p.chapterNumber, p.paragraphs.join('\n')); }
  let owed = 0, lost = 0, gained = 0;
  for (const scene of contract.scenes) {
    const before = firstInput.get(scene.chapter);
    const afterText = (shipped[scene.chapter - 1]?.paragraphs ?? []).join('\n');
    if (!before) continue;
    for (const s of scene.mustSurface) {
      owed++;
      const b = PL.chapterMentionsRequiredClue(before, s.id, artifacts.clues, castNames);
      const a = PL.chapterMentionsRequiredClue(afterText, s.id, artifacts.clues, castNames);
      if (b && !a) { lost++; console.log(`  ${arm} ch${scene.chapter} ${s.id}: present before the editor, ABSENT in the shipped chapter`); }
      if (!b && a) gained++;
    }
  }
  console.log(`arm ${arm}: owed clue surfaces ${owed}; lost by editing ${lost}; gained ${gained}`);
}

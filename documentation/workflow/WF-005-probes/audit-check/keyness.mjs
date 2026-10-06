// M8 keyness: the reference is built from SAVED manuscripts (straight apostrophes); the finding runs on DRAFT paragraphs
// (typographic apostrophes). Same book, both texts.
import fs from 'node:fs';
import { loadStore } from './ctx.mjs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const ref = JSON.parse(fs.readFileSync('C:/CML/data/keyness-reference.json', 'utf8'));
const withApos = Object.keys(ref.phrases).filter((p) => p.includes("'")).length;
console.log(`reference phrases ${Object.keys(ref.phrases).length}, containing an apostrophe ${withApos}`);
const store = loadStore();
const prose = Object.values(store.artifacts).filter((a) => a.projectId === 'proj_5eb8c115-ca42-4e66-997d-74fff1b327db' && a.type === 'prose' && a.createdAt).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
for (const [arm, stamp, md] of [['A-prime', '2026-10-06T17:41', 'C:/CML/stories/story_20261006-1842/resumed_resume_1791307885184.md'], ['B', '2026-10-06T17:53', 'C:/CML/stories/story_20261006-1853/resumed_resume_1791308574179.md']]) {
  const art = prose.find((p) => p.createdAt.startsWith(stamp)).payload.chapters.map((c) => c.paragraphs.join(' ')).join('\n\n');
  const saved = fs.readFileSync(md, 'utf8').replace(/^#.*$/gm, '');
  const a = PE.rankHousePhrases(art, ref, { max: 50 });
  const s = PE.rankHousePhrases(saved, ref, { max: 50 });
  const curly = (art.match(/’/g) ?? []).length;
  const onlySaved = s.filter((x) => !a.some((y) => y.phrase === x.phrase));
  console.log(`arm ${arm}: draft text has ${curly} typographic apostrophes; ranked phrases: draft ${a.length}, saved ${s.length}; ranked on the saved text but never on the draft: ${onlySaved.length}`);
  for (const x of onlySaved.slice(0, 6)) console.log(`    "${x.phrase}" x${x.inBook} (canon ${x.inCanon})`);
}

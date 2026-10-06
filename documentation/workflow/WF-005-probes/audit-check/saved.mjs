import fs from 'node:fs';
import { loadStore } from './ctx.mjs';
const PG = await import('file:///C:/CML/packages/prose-guard/dist/index.js');
const store = loadStore();
const prose = Object.values(store.artifacts).filter(a => a.projectId === 'proj_5eb8c115-ca42-4e66-997d-74fff1b327db' && a.type === 'prose' && a.createdAt).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
const md = { A: fs.readFileSync('C:/CML/stories/story_20261006-1842/resumed_resume_1791307885184.md','utf8'), B: fs.readFileSync('C:/CML/stories/story_20261006-1853/resumed_resume_1791308574179.md','utf8') };
const arms = { A: prose.find(p => p.createdAt.startsWith('2026-10-06T17:41')), B: prose.find(p => p.createdAt.startsWith('2026-10-06T17:53')) };
for (const arm of ['A','B']) {
  const chs = arms[arm].payload.chapters;
  const art = chs.map(c => c.paragraphs.join('\n\n')).join('\n\n');
  const saved = md[arm];
  const count = (s, re) => (s.match(re) ?? []).length;
  console.log(arm, 'artifact em-dash', count(art, /—/g), 'saved em-dash', count(saved, /—/g), 'saved " - "', count(saved, / - /g), 'artifact curly quotes', count(art, /[“”‘’]/g), 'saved curly', count(saved, /[“”‘’]/g));
  const sa = PG.measurePageShape(art), ss = PG.measurePageShape(saved);
  console.log('   page shape artifact', JSON.stringify(sa));
  console.log('   page shape saved   ', JSON.stringify(ss));
  const ra = PG.repetitionDensity(chs.map(c => c.paragraphs.join(' ')).join(' ')), rs = PG.repetitionDensity(saved);
  console.log('   repetition per10k artifact', ra.per10k.toFixed(1), 'saved', rs.per10k.toFixed(1));
}

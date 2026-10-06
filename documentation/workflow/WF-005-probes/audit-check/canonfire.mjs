// Checker findings per 1,000-word "chapter" on canon novels vs the two v2 pair books, with a contract that owns nothing
// (so only the text-only checkers can fire). A checker that fires on canon as often as on ours is not finding OUR defect.
import fs from 'node:fs';
import path from 'node:path';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const core = {
  scenes: [], chronology: { rows: [] }, roles: { reveal: 999, aftermath: null, discriminatingTest: null },
  fairPlay: { culprits: [], victim: '', decisiveClueIds: [] }, book: { words: { min: 0 } },
};
const CH_WORDS = 1250; // the size of a v2 chapter
const chunk = (text) => {
  const paras = text.split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()).filter((p) => p.length > 0);
  const chapters = []; let cur = []; let n = 0;
  for (const p of paras) { cur.push(p); n += p.split(' ').length; if (n >= CH_WORDS) { chapters.push(cur); cur = []; n = 0; } }
  return chapters.map((paragraphs, i) => ({ number: i + 1, title: '', paragraphs }));
};
const tally = (chapters) => {
  const expected = chapters.map((c) => c.number);
  const f = PE.collectCheckerFindings(chapters, core, expected, {});
  const by = {};
  for (const x of f) { by[x.class] ??= new Set(); by[x.class].add(x.chapter); }
  const counts = {}; for (const x of f) counts[x.class] = (counts[x.class] ?? 0) + 1;
  return { chapters: chapters.length, counts, chaptersHit: Object.fromEntries(Object.entries(by).map(([k, v]) => [k, v.size])) };
};
const sum = (rows) => {
  const out = { chapters: 0, counts: {}, chaptersHit: {} };
  for (const r of rows) { out.chapters += r.chapters; for (const k in r.counts) out.counts[k] = (out.counts[k] ?? 0) + r.counts[k]; for (const k in r.chaptersHit) out.chaptersHit[k] = (out.chaptersHit[k] ?? 0) + r.chaptersHit[k]; }
  return out;
};
const show = (label, s) => {
  const keys = ['abstract_subject', 'body_tail', 'operation_narrated', 'chapter_reference', 'humour_move_narrated', 'summary_ending', 'copied_sentence', 'repeat_passage', 'register_sentence', 'catchphrase_repeated'];
  console.log(label, `chapters ${s.chapters}`);
  for (const k of keys) console.log(`   ${k.padEnd(22)} per chapter ${((s.counts[k] ?? 0) / s.chapters).toFixed(2)}   chapters hit ${(100 * (s.chaptersHit[k] ?? 0) / s.chapters).toFixed(0)}%`);
};
const texts = fs.readdirSync('C:/CML/library/texts').filter((f) => f.endsWith('.txt'));
const canonRows = [];
for (const f of texts) {
  const t = fs.readFileSync(path.join('C:/CML/library/texts', f), 'utf8');
  if (t.split(/\s+/).length < 20000) continue;
  canonRows.push(tally(chunk(t)));
}
show(`CANON (${canonRows.length} novels >= 20k words)`, sum(canonRows));
for (const [label, file] of [['ARM A-prime', 'C:/CML/stories/story_20261006-1842/resumed_resume_1791307885184.md'], ['ARM B', 'C:/CML/stories/story_20261006-1853/resumed_resume_1791308574179.md']]) {
  const t = fs.readFileSync(file, 'utf8');
  const chapters = t.split(/^## Chapter \d+[^\n]*$/m).slice(1).map((body, i) => ({ number: i + 1, title: '', paragraphs: body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) }));
  show(label, sum([tally(chapters)]));
}

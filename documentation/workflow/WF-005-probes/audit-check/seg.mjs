import fs from 'node:fs';
const c = JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const segs = c.segments;
console.log(Array.isArray(segs) ? 'array' : Object.keys(segs));
const first = Array.isArray(segs)? segs[0] : Object.values(segs)[0];
console.log(Object.keys(first));
for (const [k, s] of Object.entries(segs)) {
  const rows = (s.drafts||[]).map(d => {
    const words = d.chapters.reduce((n,ch)=>n+(ch.paragraphs||[]).join(' ').split(/\s+/).filter(Boolean).length,0);
    return `${d.attempt}${d.attempt===s.chosen?'*':' '} w=${words} hard=[${d.score.hard.map(h=>h.kind).join(',')}] comp=${d.score.composite}`;
  });
  console.log(k, rows.join(' | '));
}

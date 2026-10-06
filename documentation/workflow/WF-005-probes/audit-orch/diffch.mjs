import { readFileSync } from "node:fs";
const arts = JSON.parse(readFileSync(process.argv[2], "utf8"));
const art = arts.find(a => a.id.endsWith(process.argv[3])).payload;
const ck = JSON.parse(readFileSync(process.argv[4], "utf8"));
const chosen = ck.segments.flatMap(s => s.drafts.find(d => d.attempt === s.chosen).chapters);
const only = process.argv[5] ? Number(process.argv[5]) : null;
art.chapters.forEach((c, i) => {
  if (only && i+1 !== only) return;
  const k = chosen[i];
  c.paragraphs.forEach((p, j) => {
    const q = k.paragraphs[j];
    if (p !== q) {
      // find common prefix/suffix
      let a = 0; while (a < p.length && p[a] === q[a]) a++;
      let b = 0; while (b < p.length - a && b < q.length - a && p[p.length-1-b] === q[q.length-1-b]) b++;
      console.log(`ch${i+1} p${j}: -[${q.slice(Math.max(0,a-30), q.length-b+10)}]\n        +[${p.slice(Math.max(0,a-30), p.length-b+10)}]`);
    }
  });
});

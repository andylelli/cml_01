import fs from 'node:fs';
const files = process.argv.slice(2);
for (const f of files) {
  const c = JSON.parse(fs.readFileSync(f,'utf8'));
  const segs = c.segments;
  let segCount = 0, bookShortAll = 0, revealSplit = 0, revealDecided = 0;
  const notes = [];
  for (const s of segs) {
    segCount++;
    const ds = s.drafts || [];
    if (ds.length && ds.every(d => d.score.hard.some(h=>h.kind==='book_short'))) bookShortAll++;
    const has = ds.map(d => d.score.hard.some(h=>h.kind==='reveal_unnamed'));
    if (has.some(Boolean) && !has.every(Boolean)) {
      revealSplit++;
      const best = [...ds].sort((a,b)=>b.score.composite-a.score.composite)[0];
      const chosen = ds.find(d=>d.attempt===s.chosen);
      if (chosen && best.attempt !== chosen.attempt && !chosen.score.hard.some(h=>h.kind==='reveal_unnamed')) { revealDecided++; }
      notes.push(`seg${s.index} ch${s.chapters} chosen=${s.chosen} ` + ds.map(d=>`${d.attempt}:${d.score.composite.toFixed(1)}${d.score.hard.some(h=>h.kind==='reveal_unnamed')?'U':''}`).join(' '));
    }
  }
  console.log(f.split('/').pop(), `segments=${segCount} chaptersPerSeg=${segs.map(s=>s.chapters.length).join(',')} bookShortOnAllDrafts=${bookShortAll} revealUnnamedSplit=${revealSplit} decidedAgainstBestComposite=${revealDecided}`);
  for (const n of notes) console.log('   ', n);
}

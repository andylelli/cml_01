// noOrphanedTag: of the paragraphs its pattern counts as "opening on a bare dialogue tag", how many carry the speech
// right after the tag (`Name asked, "…"`) — a legitimate, standard construction?
import fs from 'node:fs';
import path from 'node:path';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/edits.js');
const count = (paras) => {
  let tagged = 0, speechFollows = 0; const ex = [];
  for (const p of paras) {
    if (PE.orphanedTags(p) !== 1) continue;
    tagged++;
    if (/^[^"“]{0,60}?\b\w+\s*[,.]\s*["“]/.test(p.trim()) || /^[^"“]{0,60}?[,:]\s*["“]/.test(p.trim())) { speechFollows++; if (ex.length < 2) ex.push(p.slice(0, 90)); }
  }
  return { tagged, speechFollows, ex };
};
const canon = fs.readdirSync('C:/CML/library/texts').filter((f) => f.endsWith('.txt'));
let T = 0, S = 0; const ex = [];
for (const f of canon) {
  const paras = fs.readFileSync(path.join('C:/CML/library/texts', f), 'utf8').split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim());
  const r = count(paras); T += r.tagged; S += r.speechFollows; if (ex.length < 3) ex.push(...r.ex.slice(0, 1).map((e) => `${f}: ${e}`));
}
console.log(`CANON ${canon.length} works: paragraphs counted as orphaned tags ${T}; of them the speech follows the tag ${S} (${(100 * S / Math.max(1, T)).toFixed(0)}%)`);
for (const e of ex) console.log('   ', e);
for (const f of ['C:/CML/stories/story_20261006-1842/resumed_resume_1791307885184.md', 'C:/CML/stories/story_20261006-1853/resumed_resume_1791308574179.md']) {
  const r = count(fs.readFileSync(f, 'utf8').split(/\n\s*\n/).map((p) => p.trim()));
  console.log(path.basename(path.dirname(f)), `counted ${r.tagged}, speech follows ${r.speechFollows}`, r.ex[0] ?? '');
}

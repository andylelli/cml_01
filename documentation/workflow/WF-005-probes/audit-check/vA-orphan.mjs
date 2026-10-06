// A_111 V-16b (V2K-09), noOrphanedTag. orphan.mjs re-pointed at THIS checkout's dist, run with PROSE_V2_AUDIT_FIXES unset
// and "1". Of the paragraphs `orphanedTags` counts, how many carry their speech right after the tag (`Name asked, "…"`)?
// The speech test is the original probe's, independent of the fix. Known positive kept: the shipped bcc0d637 line.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './vA-ctx.mjs';
const PE = await import(new URL('packages/prose-engine/dist/edits.js', ROOT));
const speech = (p) => /^[^"“]{0,60}?\b\w+\s*[,.]\s*["“]/.test(p.trim()) || /^[^"“]{0,60}?[,:]\s*["“]/.test(p.trim());
const count = (paras) => {
  let tagged = 0, speechFollows = 0;
  for (const p of paras) { if (PE.orphanedTags(p) !== 1) continue; tagged++; if (speech(p)) speechFollows++; }
  return { tagged, speechFollows };
};
const canon = fs.readdirSync('C:/CML/library/texts').filter((f) => f.endsWith('.txt'));
const canonParas = canon.map((f) => fs.readFileSync(path.join('C:/CML/library/texts', f), 'utf8').split(/\n\s*\n/).map((p) => p.replace(/\s+/g, ' ').trim()));
const books = ['C:/CML/stories/story_20261006-1842/resumed_resume_1791307885184.md', 'C:/CML/stories/story_20261006-1853/resumed_resume_1791308574179.md'];
// The line run bcc0d637 shipped (stories/story_20261002-2110, chapter 5), its first two sentences.
const knownPositive = "Eleanor Gresham asked, her voice level as she set the weather log on the table in the hotel lounge, the thick glass panes reflecting the grey drift of fog outside. She pressed her palm flat against the paper, feeling the weight of the evening's confusion.";
for (const flag of [false, true]) {
  if (flag) process.env.PROSE_V2_AUDIT_FIXES = '1'; else delete process.env.PROSE_V2_AUDIT_FIXES;
  let T = 0, S = 0;
  for (const paras of canonParas) { const r = count(paras); T += r.tagged; S += r.speechFollows; }
  const bookRows = books.map((f) => { const r = count(fs.readFileSync(f, 'utf8').split(/\n\s*\n/).map((p) => p.trim())); return `${path.basename(path.dirname(f))} counted ${r.tagged} (speech follows ${r.speechFollows})`; });
  console.log(`AUDIT ${flag ? 'ON ' : 'OFF'} canon ${canon.length} works: counted as orphaned ${T}, of them speech follows ${S} | ${bookRows.join(' | ')} | known positive counted ${PE.orphanedTags(knownPositive)}`);
}
delete process.env.PROSE_V2_AUDIT_FIXES;

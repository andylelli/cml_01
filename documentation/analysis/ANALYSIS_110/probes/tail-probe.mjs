// The ", her fingers steady" tail: a comma, a possessive, a body/voice noun, and a state. Book vs canon, per 10k words.
import fs from 'node:fs';
const RE = /,\s+(?:his|her|their)\s+(?:\w+\s+)?(?:hands?|fingers?|eyes|gaze|voice|tone|face|expression|jaw|lips|posture|manner|movements?|words|resolve|pen|shoulders)\s+\w+/gi;
const PARA_NAME = /^(?:"[^"]*"\s+)?[A-Z][a-z]+(?:\s[A-Z][a-z]+\.?){0,2}\s(?:was|had|stood|sat|looked|watched|made|moved|closed|opened|picked|leaned|entered|examined|reviewed|glanced|nodded|turned|reached|set|placed|took|paused)\b/;
const rate = t => { const w = (t.match(/[A-Za-z][A-Za-z'’]*/g) || []).length; return { w, per10k: +(((t.match(RE) || []).length) / w * 1e4).toFixed(1) }; };
const book = fs.readFileSync(process.argv[2] || 'stories/story_20261002-2110/the_fog_bound_masquerade_at_cliffhaven_hotel.md', 'utf8').replace(/^#.*$/gm, '');
console.log('book:', JSON.stringify(rate(book)), 'examples:', (book.match(RE) || []).slice(0, 6).join(' | '));
const dir = 'library/texts'; const rows = [];
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.txt'))) { const t = fs.readFileSync(`${dir}/${f}`, 'utf8'); if (t.length < 200000) continue; rows.push(rate(t.slice(20000, 220000)).per10k); }
rows.sort((a, b) => a - b);
console.log('canon texts:', rows.length, 'median', rows[Math.floor(rows.length / 2)], 'p90', rows[Math.floor(rows.length * 0.9)], 'max', rows[rows.length - 1]);
for (const d of ['story_20261002-1830', 'story_20261002-1855', 'story_20261002-0022', 'story_20260930-2042']) { const md = fs.readdirSync(`stories/${d}`).find(f => f.endsWith('.md')); console.log(d, JSON.stringify(rate(fs.readFileSync(`stories/${d}/${md}`, 'utf8')))); }

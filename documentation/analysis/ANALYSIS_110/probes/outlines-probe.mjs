// Across every stored outline: does scene 1 (beat "gathering") honour its beat, or is it the discovery?
import fs from 'node:fs';
const store = JSON.parse(fs.readFileSync('data/store.json', 'utf8'));
const byProject = new Map();
for (const a of store.artifacts) { if (!byProject.has(a.projectId)) byProject.set(a.projectId, {}); byProject.get(a.projectId)[a.type] = a.payload; }
const DISC = /\b(body|corpse|dead|death|murder(?:ed)?|killed|lifeless|slain|stabbed|poisoned|discover\w*|found)\b/i;
let n = 0, gathering1 = 0, disc1 = 0, crime2 = 0, victimListed = 0, morningAfter = 0, entryWhy = 0, keyLocCover = [], covered = 0, total = 0, isoHave = 0, policing = 0, settings = 0, clearVictim = 0, cmls = 0, surnameClash = 0, firstNameClash = 0, casts = 0, maskUsed = 0, culpritListedPre = 0;
const rows = [];
for (const [pid, arts] of byProject) {
  const cast = arts.cast?.cast ?? arts.cast;
  const chars = cast?.characters ?? [];
  if (chars.length) {
    casts++;
    const firsts = chars.map(c => String(c.name).split(/\s+/)[0]); const lasts = chars.map(c => String(c.name).replace(/\s+(Jr\.?|Sr\.?)$/i, '').split(/\s+/).pop());
    if (new Set(firsts).size < firsts.length) firstNameClash++;
    const det = chars.find(c => /detective/i.test(c.role ?? '') || /sleuth|detective|investigator|inspector/i.test(c.roleArchetype ?? ''));
    const vic = chars.find(c => /victim/i.test(`${c.role} ${c.roleArchetype}`));
    if (det && vic && lasts[chars.indexOf(det)] === lasts[chars.indexOf(vic)]) surnameClash++;
  }
  const s = arts.setting?.setting ?? arts.setting;
  if (s?.location) { settings++; if (String(s.location.geographicIsolation ?? '').trim()) isoHave++; if ((s.era?.policing ?? []).length) policing++; }
  if (arts.cml) { cmls++; const c = arts.cml.CASE ?? arts.cml.cml?.CASE ?? arts.cml; const vicName = chars.find(ch => /victim/i.test(`${ch.role} ${ch.roleArchetype}`))?.name; const sc = c.prose_requirements?.suspect_clearance_scenes ?? []; if (vicName && sc.some(e => e.suspect_name === vicName)) clearVictim++; }
  const o = arts.outline; if (!o) continue;
  const scenes = (o.acts ?? o.outline?.acts ?? []).flatMap(a => a.scenes ?? []);
  if (scenes.length < 5) continue;
  n++;
  const s1 = scenes[0], s2 = scenes[1];
  const blob1 = `${s1.title} ${s1.summary} ${s1.purpose}`;
  if (s1.beat === 'gathering') gathering1++;
  const d1 = DISC.test(blob1); if (d1) disc1++;
  if (s2?.beat === 'crime') crime2++;
  const vic = chars.find(ch => /victim/i.test(`${ch.role} ${ch.roleArchetype}`))?.name;
  if (vic && (s1.characters ?? []).includes(vic)) victimListed++;
  if (/after the murder|morning after/i.test(JSON.stringify(s1.setting ?? ''))) morningAfter++;
  if (/research|invited|guest|visiting|staying|holiday|summoned|arriv/i.test(scenes.slice(0, 3).map(x => x.summary).join(' '))) entryWhy++;
  const names = new Set(chars.map(c => c.name));
  const allChars = scenes.flatMap(x => x.characters ?? []);
  if (allChars.some(c => !names.has(c))) maskUsed++;
  const keyLocs = (arts.location_profiles?.keyLocations ?? []).map(k => String(k.name).toLowerCase());
  if (keyLocs.length) {
    const w = v => v.toLowerCase().replace(/[^a-z\s]/g, ' ').split(/\s+/).filter(x => x.length >= 4).map(x => x.slice(0, 5));
    const counts = new Map(); for (const k of keyLocs) for (const x of new Set(w(k))) counts.set(x, (counts.get(x) || 0) + 1);
    const PLAIN = new Set(['room', 'areas', 'area', 'nearb', 'adjoi', 'main', 'estat', 'manor', 'house', 'corne', 'withi', 'groun']);
    const distinct = v => w(v).filter(x => !PLAIN.has(x) && (counts.get(x) || 0) < Math.max(2, keyLocs.length / 2));
    let c = 0; for (const sc of scenes) { const want = new Set(distinct(String(sc.setting?.location ?? ''))); if (keyLocs.some(k => distinct(k).some(x => want.has(x)))) c++; }
    covered += c; total += scenes.length; keyLocCover.push(+(c / scenes.length).toFixed(2));
  }
  rows.push(`${pid.slice(5, 13)} s1.beat=${s1.beat} disc1=${d1} s2.beat=${s2?.beat} | ${String(s1.title).slice(0, 34)} | ${String(s1.setting?.timeOfDay ?? '').slice(0, 30)}`);
}
console.log(`outlines=${n}  scene1 beat=gathering: ${gathering1}  scene1 is the discovery (title/summary/purpose): ${disc1}  scene2 beat=crime: ${crime2}  victim in scene-1 cast: ${victimListed}  scene-1 hour says "after the murder": ${morningAfter}`);
console.log(`a reason for the detective's presence in scenes 1-3 summaries (loose regex): ${entryWhy}/${n}`);
console.log(`outlines whose scene cast lists carry a non-cast name (mask or invention): ${maskUsed}/${n}`);
console.log(`scenes set in a profiled key location (depth.ts matcher): ${covered}/${total} = ${(covered / total * 100).toFixed(0)}%  per-outline median ${keyLocCover.sort((a, b) => a - b)[Math.floor(keyLocCover.length / 2)]}`);
console.log(`settings=${settings} with geographicIsolation: ${isoHave}; with era.policing: ${policing}`);
console.log(`CMLs=${cmls} listing the VICTIM in suspect_clearance_scenes: ${clearVictim}`);
console.log(`casts=${casts} with a shared first name: ${firstNameClash}; detective shares the victim's surname: ${surnameClash}`);
console.log(rows.slice(-12).join('\n'));

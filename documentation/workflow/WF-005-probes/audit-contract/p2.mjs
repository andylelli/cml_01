import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import(new URL("../../../../packages/prose-engine/dist/index.js", import.meta.url).href);
const cml = await import(new URL("../../../../packages/cml/dist/index.js", import.meta.url).href);
const arm = process.argv[2] ?? "OFF";
setEnv(arm);
const hit = {}; const ex = {}; const cnt = {};
const add = (k, id, detail) => { (hit[k] ??= new Set()).add(id); cnt[k] = (cnt[k] ?? 0) + 1; if (!ex[k]) ex[k] = `${id.slice(5, 13)}: ${detail}`; };
const sec = (t, name) => (t.split(/\n(?=## )/).find((s) => s.startsWith(`## ${name}`)) ?? "");
let n = 0;
for (const c of cases) {
  const k = pe.buildBookContract(c.input); n++;
  const bible = k.bible.text; const victim = k.fairPlay.victim; const culprits = k.fairPlay.culprits; const roles = k.roles;
  // ── P4/P5 THE CLOCK
  const clock = sec(bible, "THE CLOCK").split("\n").slice(2).filter((l) => /^\s{2}\S/.test(l));
  const byDial = new Map();
  for (const line of clock) {
    const value = line.trim().split(" — ")[0];
    if (/ to .*\(/.test(value)) continue; // interval rows
    const dial = cml.parseClockTime(value);
    if (dial === null) continue;
    if (!byDial.has(dial)) byDial.set(dial, new Set());
    byDial.get(dial).add(value);
  }
  for (const [dial, spellings] of byDial) if (spellings.size > 1) add("P4_clockTwoSpellingsOneHour", c.id, [...spellings].map((s) => `"${s}"`).join(" vs "));
  const digit = clock.filter((l) => /\b\d{1,2}[:.]\d{2}\b/.test(l.split(" — ").slice(1).join(" — ")));
  if (digit.length) add("P5_clockLabelCarriesDigitTime", c.id, `${digit.length} lines, e.g. ${digit[0].trim().slice(0, 90)}`);
  // the window the contract states vs THE CLOCK's spelling
  for (const s of k.scenes) {
    if (s.timeWindow) {
      const a = cml.parseClockTime(s.timeWindow.from), b = cml.parseClockTime(s.timeWindow.to);
      if (a !== null && b !== null && a > b) add("P3_timeWindowReversed", c.id, `ch${s.chapter} "between ${s.timeWindow.from} and ${s.timeWindow.to}"`);
      if (a !== null && b !== null && a === b) add("P3b_timeWindowZero", c.id, `ch${s.chapter} "between ${s.timeWindow.from} and ${s.timeWindow.to}"`);
      for (const v of [s.timeWindow.from, s.timeWindow.to]) {
        const exact = clock.some((l) => l.trim().split(" — ")[0] === v);
        if (!exact) add("P3c_timeWindowValueNotARowAsSpelled", c.id, `ch${s.chapter} "${v}"`);
      }
    }
  }
  // ── P7 bible truncation, section by section
  const castNames = (c.input.cast?.characters ?? []).map((m) => String(m?.name ?? "").trim()).filter(Boolean);
  const people = sec(bible, "THE PEOPLE");
  const missingCast = castNames.filter((nm) => !new RegExp(`^${nm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( \\(|$| —|,)`, "m").test(people));
  if (missingCast.length) add("P7a_castMemberMissingFromPeople", c.id, `${missingCast.length}/${castNames.length}: ${missingCast.join(", ")}`);
  const surfaced = k.scenes.reduce((sum, s) => sum + s.mustSurface.filter((m) => m.observable || m.keyTerms.length).length, 0);
  const evidenceLines = sec(bible, "THE EVIDENCE").split("\n").filter((l) => /^\s{2}\[/.test(l)).length;
  if (evidenceLines < surfaced) add("P7b_evidenceLinesDropped", c.id, `${surfaced - evidenceLines} of ${surfaced} dropped; last kept chapter ${(sec(bible, "THE EVIDENCE").match(/chapter (\d+):[^\n]*$/) ?? [])[1]}`);
  const rowsExpected = k.chronology.rows.length + (c.input.lockedFacts ?? []).filter((f) => String(f.value ?? "").trim() && !k.chronology.rows.some((r) => r.value === String(f.value).replace(/\s+/g, " ").trim())).length;
  if (clock.length < rowsExpected) add("P7c_clockRowsDropped", c.id, `${rowsExpected - clock.length} of ${rowsExpected} dropped`);
  if (k.bible.truncated.length) add("P7d_sectionDropped", c.id, k.bible.truncated.join(","));
  // culprit's or victim's lines missing specifically
  if (culprits.some((x) => missingCast.includes(x))) add("P7e_culpritMissingFromPeople", c.id, culprits.join(","));
  // ── P9 stock line for a culprit after the reveal
  for (const cu of culprits) {
    const block = people.split(/\n(?=\S)/).find((b) => b.startsWith(cu));
    const m = block?.match(/Says this once in the book, in chapter (\d+)/);
    if (m && Number(m[1]) > roles.reveal) add("P9_culpritStockLineAfterReveal", c.id, `${cu} ch${m[1]} reveal ${roles.reveal}`);
  }
  // ── P17 wound chapter before the crime
  const crime = k.scenes.find((s) => s.beat === "crime")?.chapter;
  const wound = k.scenes.find((s) => s.wound)?.chapter;
  if (wound !== undefined && crime !== undefined && wound < crime) add("P17_woundBeforeCrimeChapter", c.id, `wound ch${wound} crime ch${crime}`);
  const firstBody = k.scenes.find((s) => s.present.includes(victim) && !s.wound)?.chapter;
  // ── brief: the dead given a speaking register in every call
  if (new RegExp(`^- ${victim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} is (funny|in earnest)`, "m").test(k.brief.text)) add("P18_briefGivesVictimARegister", c.id, (k.brief.text.match(new RegExp(`^- ${victim.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} is [^\n]*`, "m")) ?? [""])[0]);
  if (culprits.length > 1) add("P20_multiCulprit", c.id, culprits.join(" | "));
}
console.log(`arm ${arm}: ${n} contracts`);
for (const [k, v] of Object.entries(hit).sort()) console.log(`${k.padEnd(38)} ${String(v.size).padStart(3)}/${n} (${cnt[k]} rows)  e.g. ${ex[k]}`);

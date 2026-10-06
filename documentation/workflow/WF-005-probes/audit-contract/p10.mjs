import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import("file:///C:/CML/packages/prose-engine/dist/index.js");
setEnv(process.argv[2] ?? "OFF");
const t = {}; const ex = {};
const add = (k, d) => { t[k] = (t[k] ?? 0) + 1; (ex[k] ??= []).length < 4 && ex[k].push(d); };
const roleText = (m) => String(m?.role_archetype ?? m?.roleArchetype ?? m?.role ?? "").toLowerCase();
for (const c of cases) {
  const k = pe.buildBookContract(c.input);
  const id = c.id.slice(5, 13);
  const cb = pe.unwrapCase(c.input.cml);
  const cast = c.input.cast?.characters ?? [];
  const names = cast.map((m) => String(m.name ?? "").trim());
  // 5 — which interval is "the chance to do it"
  const intervals = k.chronology.rows.filter((r) => r.kind === "interval");
  const reveal = k.scenes.find((s) => s.chapter === k.roles.reveal);
  const ow = reveal?.opportunityWindow;
  if (ow) {
    const byRegex = intervals.find((r) => /murder|entry|the act|opportunit|window|access/i.test(r.label));
    const how = byRegex ? "regex" : "fallback intervals[0]";
    add(`5_window_${how}`, `${id}: "${ow.value}" — ${ow.label}`);
    const person = names.find((n) => n && (ow.label.includes(n) || ow.label.includes(n.split(" ").pop())));
    if (person && !k.fairPlay.culprits.includes(person)) add("5b_window_is_an_innocents_interval", `${id}: "${ow.value}" — ${ow.label} (culprit ${k.fairPlay.culprits.join(",")})`);
  } else add("5_no_window", id);
  // 6 — who the test is first applied to
  const ts = k.scenes.find((s) => s.testSubjects)?.testSubjects;
  if (ts) {
    const m = cast.find((x) => x.name === ts.innocent);
    if (/detective|investigator|inspector|sleuth|police|constable|sergeant/.test(roleText(m))) add("6_test_innocent_is_investigator", `${id}: ${ts.innocent} (${roleText(m)})`);
    if (!names.includes(ts.innocent)) add("6b_test_innocent_not_a_cast_name", `${id}: ${ts.innocent}`);
    const present = k.scenes.find((s) => s.testSubjects).present;
    const clearedOnPage = (cb.prose_requirements?.suspect_clearance_scenes ?? []).map((e) => String(e?.suspect_name ?? "").trim()).filter((n) => n && present.includes(n) && !k.fairPlay.culprits.includes(n) && n !== k.fairPlay.victim);
    if (!present.includes(ts.innocent) && clearedOnPage.length) add("6c_offpage_innocent_but_a_cleared_suspect_was_on_page", `${id}: chose ${ts.innocent}, on page: ${clearedOnPage.join(", ")}`);
  }
  // 14 — how decisive clues were decided
  const ids = (c.input.clues?.clues ?? []).map((x) => x.id);
  add(ids.some((i) => /culprit|reveal|discriminating|decisive/i.test(i)) ? "14_decisive_by_id_regex" : "14_decisive_by_other", id);
  // 19 — outline characters dropped from "On the page" by the exact-name join
  for (const scene of pe.flattenScenes(c.input.outline)) {
    for (const ch of scene.characters ?? []) {
      const n = String(ch ?? "").trim();
      if (!n || names.includes(n)) continue;
      const near = names.find((x) => x && (x.includes(n) || n.includes(x) || x.split(" ").pop() === n.split(" ").pop()));
      add(near ? "19_dropped_near_cast_name" : "19_dropped_other", `${id}: "${n}"${near ? ` ~ ${near}` : ""}`);
    }
  }
  // 20 — victim and culprit identity
  if (!k.fairPlay.victim) add("20_no_victim", id);
  else if (!names.includes(k.fairPlay.victim)) add("20b_victim_not_a_cast_name", `${id}: ${k.fairPlay.victim}`);
  const roleVictim = cast.find((m) => /victim/.test(roleText(m)));
  if (!roleVictim) add("20c_victim_from_case_fallback", `${id}: ${k.fairPlay.victim} | cast roles: ${cast.map((m) => roleText(m)).join(" / ").slice(0, 80)}`);
  for (const cu of k.fairPlay.culprits) if (!names.includes(cu)) add("20d_culprit_not_a_cast_name", `${id}: "${cu}"`);
}
for (const [k, v] of Object.entries(t).sort()) console.log(`${k.padEnd(55)} ${v}   e.g. ${ex[k].join(" || ").slice(0, 330)}`);

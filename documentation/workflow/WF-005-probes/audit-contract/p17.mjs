// A_111 V batch, group C — the defects p1–p16 read off the contract OBJECT, measured on what the writer READS, plus the
// no-new-defect checks. `node p17.mjs OFF|AUDIT|B|B_AUDIT`.
//   V1  the reveal's window does not contain the case's actual time of death, or names a living non-culprit
//   V2  the crime chapter's rendered "The clock:" line gives its two times out of clock order (shorter way round)
//   V9  an outline name that resolves to exactly one cast member by name tokens is missing from "On the page"
//   MS  clue obligations (mustSurface) that differ from the same arm without the V batch, other than a decisive clue
//       moved before the test
import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import(new URL("../../../../packages/prose-engine/dist/index.js", import.meta.url).href);
const cml = await import(new URL("../../../../packages/cml/dist/index.js", import.meta.url).href);
const run = await import(new URL("../../../../apps/worker/dist/jobs/agents/agent9-v2/run.js", import.meta.url).href);
const arm = process.argv[2] ?? "OFF";
const hit = {}; const ex = {}; const cnt = {};
const add = (k, id, detail) => { (hit[k] ??= new Set()).add(id); cnt[k] = (cnt[k] ?? 0) + 1; if (!ex[k]) ex[k] = `${id.slice(5, 13)}: ${detail}`; };
const mod = (x) => ((x % 720) + 720) % 720;
const TITLES = new Set("lady lord sir dame dr doctor mr mrs miss ms master madam inspector detective sergeant constable captain colonel major reverend rev father professor prof chief superintendent the of de van von".split(" "));
const toks = (v) => String(v).toLowerCase().replace(/[^a-z\s'-]/g, " ").split(/[\s-]+/).map((t) => t.replace(/'s$/, "")).filter((t) => t.length > 1 && !TITLES.has(t));
let n = 0;
for (const c of cases) {
  setEnv(arm === "AUDIT" ? "OFF" : arm.replace(/_AUDIT$/, "")); // the same arm without the V batch
  const off = pe.buildBookContract(c.input);
  setEnv(arm);
  const k = pe.buildBookContract(c.input);
  n++;
  const cb = pe.unwrapCase(c.input.cml);
  const culprits = k.fairPlay.culprits, victim = k.fairPlay.victim;
  const names = (c.input.cast?.characters ?? []).map((m) => String(m.name ?? "").trim()).filter(Boolean);
  const people = cml.identifyPeople(names);
  // V1
  const ow = k.scenes.find((s) => s.chapter === k.roles.reveal)?.opportunityWindow;
  if (ow) {
    const chrono = cml.deriveCaseChronology(cb, c.input.lockedFacts);
    const byId = new Map(chrono.events.map((e) => [e.id, e]));
    const iv = chrono.intervals.find((i) => i.label === ow.label && byId.get(i.start) && byId.get(i.end));
    const tod = cml.parseClockTime(String(cb.hidden_model?.mechanism?.actual_time_of_death ?? ""));
    if (iv && tod !== null && mod(tod - byId.get(iv.start).dial) > mod(byId.get(iv.end).dial - byId.get(iv.start).dial)) add("V1a_windowMissesTimeOfDeath", c.id, `"${ow.value}" — ${ow.label} | actual ${cb.hidden_model?.mechanism?.actual_time_of_death}`);
    const innocents = cml.namesIn(ow.label, people).filter((p) => !culprits.includes(p) && p !== victim);
    if (innocents.length) add("V1b_windowNamesALivingInnocent", c.id, `"${ow.label}" names ${innocents.join(", ")}`);
    if (tod === null && !/\b(murder\w*|kill\w*|death|died|the act|opportunit\w*|access|entry)\b/i.test(ow.label)) add("V1c_noTimeOfDeathAndNotTheAct", c.id, ow.label);
  } else add("V1_info_noWindowStated", c.id, "");
  // V2
  for (const s of k.scenes) {
    const line = run.renderSceneContract(k, s.chapter).split("\n").find((l) => /^\s+The clock:/.test(l));
    if (!line) continue;
    const between = line.match(/between (.+) and (.+)\.$/);
    if (between) {
      const a = cml.parseClockTime(between[1]), b = cml.parseClockTime(between[2]);
      if (a !== null && b !== null && mod(b - a) > 360) { add("V2_clockLineOutOfOrder", c.id, line.trim()); if (process.env.SHOW && !(a > b)) console.log("wrap:", c.id.slice(5, 13), line.trim()); }
      continue;
    }
    const mech = cb.hidden_model?.mechanism ?? {};
    const A = cml.parseClockTime(mech.actual_time_of_death), P = cml.parseClockTime(mech.apparent_time_of_death);
    const at = (v) => line.indexOf(v);
    const dc = s.deathClock;
    if (!dc) { add("V2_lineWithoutDeathClock", c.id, line); continue; }
    if (at(dc.actual) < 0 || at(dc.apparent) < 0) add("V2_lineMissesAValue", c.id, line.trim());
    if (A !== null && P !== null && A !== P) {
      const firstIsApparent = at(dc.apparent) < at(dc.actual);
      const apparentEarlier = mod(A - P) < 360;
      if (firstIsApparent !== apparentEarlier) add("V2_clockLineOutOfOrder", c.id, line.trim());
    }
    const clock = k.bible.text.split(/\n(?=## )/).find((x) => x.startsWith("## THE CLOCK")) ?? "";
    for (const v of [dc.actual, dc.apparent]) if (!clock.split("\n").some((l) => l.trim().split(" — ")[0] === v)) add("V2_valueNotSpelledAsTheClock", c.id, v);
    if (s.deathClock && apparentEarlierCount(A, P)) add("V2_info_apparentEarlierCases", c.id, line.trim());
  }
  // V9
  for (const scene of pe.flattenScenes(c.input.outline)) {
    const ch = Number(scene.sceneNumber);
    const sc = k.scenes.find((s) => s.chapter === ch);
    if (!sc) continue;
    for (const raw of scene.characters ?? []) {
      const nm = String(raw ?? "").trim();
      if (!nm || names.includes(nm)) continue;
      const t = toks(nm);
      const fits = names.filter((x) => { const own = new Set(toks(x)); return t.length && t.every((y) => own.has(y)); });
      if (fits.length === 1 && !sc.present.includes(fits[0])) add("V9_resolvableNameOffPage", c.id, `ch${ch} "${nm}" = ${fits[0]}`);
    }
  }
  // MS — obligations versus OFF
  const stage = (kk) => { const m = new Map(); for (const s of kk.scenes) for (const x of s.mustSurface) m.set(`${x.id}@${s.chapter}`, true); return m; };
  const a = stage(off), b = stage(k);
  const test = k.roles.discriminatingTest ?? k.roles.reveal;
  for (const key of new Set([...a.keys(), ...b.keys()])) {
    if (a.has(key) && b.has(key)) continue;
    const [id, chs] = key.split("@"); const chn = Number(chs);
    const decisive = k.fairPlay.decisiveClueIds.includes(id);
    const movedEarlier = decisive && ((a.has(key) && chn >= test) || (b.has(key) && chn < test));
    if (!movedEarlier) add("MS_obligationChangedOtherThanV3", c.id, `${a.has(key) ? "lost" : "gained"} ${key}`);
    else add("MS_info_v3Move", c.id, `${a.has(key) ? "from" : "to"} ${key}`);
  }
  if (b.size !== a.size) add("MS_obligationCountChanged", c.id, `${a.size} -> ${b.size}`);
}
function apparentEarlierCount(A, P) { return A !== null && P !== null && mod(A - P) > 0 && mod(A - P) < 360; }
console.log(`arm ${arm}: contracts built ${n} of ${cases.length}`);
for (const [k, v] of Object.entries(hit).sort()) console.log(`${k.padEnd(36)} ${String(v.size).padStart(3)}/${n} (${cnt[k]} rows)  e.g. ${ex[k]}`);

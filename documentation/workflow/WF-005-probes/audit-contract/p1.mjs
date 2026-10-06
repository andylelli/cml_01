import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import("file:///C:/CML/packages/prose-engine/dist/index.js");
const run = await import("file:///C:/CML/apps/worker/dist/jobs/agents/agent9-v2/run.js");
const arm = process.argv[2] ?? "OFF";
setEnv(arm);
let n = 0;
const hit = {}; const ex = {}; const cnt = {};
const add = (k, id, detail) => { (hit[k] ??= new Set()).add(id); cnt[k] = (cnt[k] ?? 0) + 1; if (!ex[k]) ex[k] = `${id.slice(5, 13)}: ${detail}`; };
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
for (const c of cases) {
  let k;
  try { k = pe.buildBookContract(c.input); } catch (e) { add("BUILD_ERROR", c.id, e.message); continue; }
  n++;
  const { roles, fairPlay } = k; const culprits = fairPlay.culprits; const victim = fairPlay.victim;
  const test = roles.discriminatingTest ?? roles.reveal;
  for (const s of k.scenes) {
    const text = run.renderSceneContract(k, s.chapter);
    if (s.testSubjects && !s.present.includes(s.testSubjects.innocent)) add("P1_testInnocentOffPage", c.id, `ch${s.chapter} innocent=${s.testSubjects.innocent} present=[${s.present.join(", ")}]`);
    if (s.testSubjects && !culprits.every((x) => s.present.includes(x))) add("P1b_testCulpritOffPage", c.id, `ch${s.chapter}`);
    if (s.chapter > roles.reveal && s.beats.depth && culprits.includes(s.beats.depth.name)) add("P2_depthToCulpritAfterReveal", c.id, `ch${s.chapter} ${s.beats.depth.name}`);
    if (s.chapter > roles.reveal && s.beats.wit && [s.beats.wit.name, ...s.beats.wit.shapes.map((x) => x.name)].some((x) => culprits.includes(x))) add("P2b_witToCulpritAfterReveal", c.id, `ch${s.chapter}`);
    if (s.beats.depth && s.beats.depth.name === victim) add("P2c_depthToVictim", c.id, `ch${s.chapter}`);
    if (s.job) for (const [f, v] of Object.entries(s.job)) if (f !== "beat" && typeof v === "string") add("P6_jobFieldNamePrinted", c.id, `ch${s.chapter} ${f}: ${v.slice(0, 50)}`);
    if (culprits.some((x) => new RegExp(`^\\s+consequenceFor: ${esc(x)}`, "m").test(text))) add("P6b_consequenceForCulpritLine", c.id, `ch${s.chapter}`);
    if (culprits.some((x) => new RegExp(`^\\s+${esc(x)} is the first of them we see`, "m").test(text))) add("P6c_firstOfThemCulprit", c.id, `ch${s.chapter}`);
    for (const e of s.eliminationsAllowed) if (!s.present.includes(e.name)) add("P8_clearedOffPage", c.id, `ch${s.chapter} ${e.name} present=[${s.present.join(", ")}]`);
    if (s.chapter < roles.reveal) for (const m of s.mustSurface) if (pe.namesCulprit(m.observable, culprits)) add("P10_culpritNamedInClueBeforeReveal", c.id, `ch${s.chapter} [${m.id}] ${m.observable.slice(0, 80)}`);
    for (const r of s.mayMention) {
      const earlier = k.scenes.some((t) => t.chapter < s.chapter && t.mustSurface.some((m) => m.id === r.id));
      if (!earlier) add("P13_alreadyOnPageButNotEarlier", c.id, `ch${s.chapter} ${r.id} firstChapter=${r.firstChapter} role=${s.role}`);
      if (r.firstChapter >= s.chapter) add("P13b_firstChapterNotEarlier", c.id, `ch${s.chapter} ${r.id} firstChapter=${r.firstChapter}`);
    }
    if (s.chapter > roles.reveal && s.mustSurface.length) add("P12_clueStagedAfterReveal", c.id, `ch${s.chapter} role=${s.role} ${s.mustSurface.map((m) => m.id).join(",")}`);
    if (s.chapter > test && s.chapter < roles.reveal && s.mustSurface.length) add("P12b_clueStagedBetweenTestAndReveal", c.id, `ch${s.chapter} ${s.mustSurface.map((m) => m.id).join(",")}`);
    if (s.chapter === roles.reveal && s.mustSurface.length) add("P12c_clueStagedAtReveal", c.id, `ch${s.chapter} ${s.mustSurface.map((m) => m.id).join(",")}`);
  }
  const accused = String((pe.unwrapCase(c.input.cml).false_solution ?? {}).accused_suspect ?? "").trim();
  if (accused && roles.falseSolution !== null) for (const s of k.scenes) if (s.chapter < roles.falseSolution && s.eliminationsAllowed.some((e) => e.name === accused)) add("P11_accusedClearedBeforeAccused", c.id, `cleared ch${s.chapter}, accused ch${roles.falseSolution}`);
  for (const note of k.notes) { const m = note.match(/^(contract rules violated|trace rules violated|trace rules unknown)/); if (m) add("NOTE_" + m[1].replace(/ /g, "_"), c.id, note.slice(0, 220)); }
}
console.log(`arm ${arm}: contracts built ${n} of ${cases.length}`);
for (const [k, v] of Object.entries(hit).sort()) console.log(`${k.padEnd(40)} ${String(v.size).padStart(3)}/${n} (${cnt[k]} rows)  e.g. ${ex[k]}`);

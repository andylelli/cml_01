// Detail for the time-window and THE CLOCK findings.
import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import("file:///C:/CML/packages/prose-engine/dist/index.js");
const cml = await import("file:///C:/CML/packages/cml/dist/index.js");
const run = await import("file:///C:/CML/apps/worker/dist/jobs/agents/agent9-v2/run.js");
setEnv("OFF");
const sec = (t, name) => (t.split(/\n(?=## )/).find((s) => s.startsWith(`## ${name}`)) ?? "");
const which = process.argv[2];
const tally = { reversed: 0, digitWindow: 0, windowStated: 0, kinds: {}, lfDropped: 0, lfTotal: 0, casesLfDropped: new Set(), oppMissing: 0, oppStated: 0, x51Dropped: 0, x51Cases: new Set(), dropKinds: {} };
for (const c of cases) {
  const k = pe.buildBookContract(c.input);
  const mech = pe.unwrapCase(c.input.cml).hidden_model?.mechanism ?? {};
  const clockText = sec(k.bible.text, "THE CLOCK");
  const clock = clockText.split("\n").slice(2).filter((l) => /^\s{2}\S/.test(l));
  const values = clock.map((l) => l.trim().split(" — ")[0]);
  for (const s of k.scenes) {
    if (!s.timeWindow) continue;
    tally.windowStated++;
    const a = cml.parseClockTime(s.timeWindow.from), b = cml.parseClockTime(s.timeWindow.to);
    if (/\d/.test(s.timeWindow.from + s.timeWindow.to)) tally.digitWindow++;
    if (a > b) {
      tally.reversed++;
      if (which === "rev") console.log(`${c.id.slice(5, 13)} ch${s.chapter} beat=${s.beat}: rendered "${run.renderSceneContract(k, s.chapter).split("\n").find((l) => /The clock:/.test(l))?.trim()}" | case actual="${mech.actual_time_of_death}" apparent="${mech.apparent_time_of_death}"`);
    }
  }
  // two spellings, by kind
  const byDial = new Map();
  for (const v of values) { if (/ to .*\(/.test(v)) continue; const d = cml.parseClockTime(v); if (d === null) continue; (byDial.get(d) ?? byDial.set(d, new Set()).get(d)).add(v); }
  for (const sp of byDial.values()) if (sp.size > 1) {
    const arr = [...sp];
    const strip = (x) => x.replace(/^(a|the)\s+/i, "").replace(/\s+(at night|in the (morning|evening|afternoon)|p\.?m\.?|a\.?m\.?)$/i, "").trim().toLowerCase();
    const kind = arr.some((x) => /\d/.test(x)) && arr.some((x) => !/\d/.test(x)) ? "digits-vs-words" : new Set(arr.map(strip)).size === 1 ? "article/suffix-only" : "different-wording";
    tally.kinds[kind] = (tally.kinds[kind] ?? 0) + 1;
    if (which === "spell" && kind !== "article/suffix-only") console.log(`${c.id.slice(5, 13)} ${kind}: ${arr.map((x) => `"${x}"`).join(" vs ")}`);
  }
  // locked facts dropped from THE CLOCK by the token budget
  const rowValues = new Set(k.chronology.rows.map((r) => r.value));
  for (const f of c.input.lockedFacts ?? []) {
    const v = String(f.value ?? "").replace(/\s+/g, " ").trim();
    if (!v || rowValues.has(v)) continue;
    tally.lfTotal++;
    if (!values.includes(v)) {
      tally.lfDropped++; tally.casesLfDropped.add(c.id);
      const isClock = cml.parseClockTime(v) !== null;
      const kind = isClock ? "clock" : "non-clock (X51 weapon/alibi/etc)";
      tally.dropKinds[kind] = (tally.dropKinds[kind] ?? 0) + 1;
      if (!isClock) { tally.x51Dropped++; tally.x51Cases.add(c.id); }
      if (which === "lf") console.log(`${c.id.slice(5, 13)} dropped locked fact ${f.id}="${v}"`);
    }
  }
  const reveal = k.scenes.find((s) => s.chapter === k.roles.reveal);
  if (reveal?.opportunityWindow) { tally.oppStated++; if (!values.includes(reveal.opportunityWindow.value)) { tally.oppMissing++; if (which === "opp") console.log(`${c.id.slice(5, 13)} opportunity window "${reveal.opportunityWindow.value}" not in THE CLOCK as printed (${clock.length} lines)`); } }
}
console.log(JSON.stringify({ ...tally, casesLfDropped: tally.casesLfDropped.size, x51Cases: tally.x51Cases.size }));

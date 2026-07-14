// Pure analysis helpers for the AGENT9_REGEN_CLUE N≥4 A/B (see
// documentation/plan/regen-clue-n4-experiment.md). No I/O, no LLM — importable and unit-tested
// offline. Consumes the paired per-arm records written by exp-regen-clue-ab.mjs.
//
// Each arm record: { arm, runId, exitCode, status, regen: {plantedCount, plantedClues,
//   unresolvedCount, unresolved}, dump: <boundary prose dump | null> }.

import { detectScaffoldNotProse } from "@cml/prose-guard";

const MALE_RE = /\b(?:he|him|his|himself)\b/gi;
const FEMALE_RE = /\b(?:she|her|hers|herself)\b/gi;
const PRONOUN_SIGNAL_RE = /pronoun|misgender|wrong-gender|re-?gender/i;

/**
 * Scaffold occurrences over the shipped prose, counted PER CHAPTER (detectScaffoldNotProse dedups
 * by rule within a single text, so per-chapter granularity is what gives a real occurrence count).
 * `a1` isolates the A1 clue/inference-surfacing family — the exact injector this flag replaces.
 */
export function scaffoldStats(chapters) {
  let total = 0;
  let a1 = 0;
  const byRule = {};
  for (const ch of chapters ?? []) {
    const hits = detectScaffoldNotProse(String(ch?.text ?? ""));
    for (const h of hits) {
      total += 1;
      byRule[h.rule] = (byRule[h.rule] ?? 0) + 1;
      if (String(h.rule).startsWith("A1:")) a1 += 1;
    }
  }
  return { total, a1, byRule };
}

/** Descriptive gendered-pronoun token totals (NOT a correctness metric — see the doc). */
export function pronounTokenTotals(chapters) {
  let male = 0;
  let female = 0;
  for (const ch of chapters ?? []) {
    const text = String(ch?.text ?? "");
    male += (text.match(MALE_RE) ?? []).length;
    female += (text.match(FEMALE_RE) ?? []).length;
  }
  return { male, female };
}

/** Pronoun/misgender warning strings — the honest guardrail signal. */
export function pronounSignals(warnings) {
  return (warnings ?? []).map(String).filter((w) => PRONOUN_SIGNAL_RE.test(w));
}

/** Collapse one arm record into the comparable summary the pair check uses. */
export function summarizeArm(record) {
  const dump = record?.dump ?? null;
  const completed = record?.status === "success" && !!dump;
  const chapters = Array.isArray(dump?.chapters) ? dump.chapters : [];
  const gate = dump?.releaseGate ?? { status: null, hardStops: [], warnings: [] };
  return {
    arm: record?.arm ?? null,
    runId: record?.runId ?? dump?.runId ?? null,
    completed,
    exitCode: record?.exitCode ?? null,
    chapterCount: dump?.chapterCount ?? (chapters.length || null),
    totalWords: dump?.totalWords ?? null,
    costUsd: Number(dump?.agent9CostUsd) || 0,
    scaffold: scaffoldStats(chapters),
    pronouns: pronounTokenTotals(chapters),
    pronounSignals: pronounSignals(dump?.warnings),
    gateStatus: gate.status ?? null,
    gateHardStops: Array.isArray(gate.hardStops) ? gate.hardStops.length : 0,
    synthesizedAgent7: record?.synthesizedAgent7 === true,
    regen: record?.regen ?? { plantedCount: 0, unresolvedCount: 0 },
  };
}

/** Compare one matched pair (same case, flag off vs on). Returns per-check ok flags + overall ok. */
export function comparePair(controlRecord, treatmentRecord) {
  const c = summarizeArm(controlRecord);
  const t = summarizeArm(treatmentRecord);
  const checks = [];
  const add = (name, ok, detail) => checks.push({ name, ok, detail });

  const bothCompleted = c.completed && t.completed;
  add("both_arms_completed", bothCompleted, `control=${c.completed} treatment=${t.completed}`);

  // Matched-by-construction guard: if either arm re-synthesised Agent 7, the two arms used
  // different outlines and the pair is invalid (not matched on chapter count + opening).
  add(
    "outline_hydrated_not_synthesized",
    !c.synthesizedAgent7 && !t.synthesizedAgent7,
    `control_synth=${c.synthesizedAgent7} treatment_synth=${t.synthesizedAgent7}`,
  );

  if (bothCompleted) {
    // Match sanity — identical hydrated outline must yield identical chapter count.
    add("chapter_count_matched", c.chapterCount === t.chapterCount, `control=${c.chapterCount} treatment=${t.chapterCount}`);
    // Primary — the A1 mole must not survive worse than control (target: gone).
    add("a1_scaffold_not_worse", t.scaffold.a1 <= c.scaffold.a1, `control=${c.scaffold.a1} treatment=${t.scaffold.a1}`);
    // Guardrails — no regression.
    add("total_scaffold_not_worse", t.scaffold.total <= c.scaffold.total, `control=${c.scaffold.total} treatment=${t.scaffold.total}`);
    add("gate_hardstops_not_worse", t.gateHardStops <= c.gateHardStops, `control=${c.gateHardStops} treatment=${t.gateHardStops}`);
    add("no_new_pronoun_signals", t.pronounSignals.length <= c.pronounSignals.length, `control=${c.pronounSignals.length} treatment=${t.pronounSignals.length}`);
    const wc = c.totalWords || 0;
    const wt = t.totalWords || 0;
    add("word_parity_20pct", wc === 0 ? true : Math.abs(wt - wc) / wc <= 0.2, `control=${wc} treatment=${wt}`);
  }

  return { runId: c.runId ?? t.runId, control: c, treatment: t, checks, ok: checks.every((k) => k.ok) };
}

/** Aggregate over all pairs → totals + gates + overall PASS/FAIL. */
export function aggregate(pairComparisons) {
  const totals = {
    pairs: pairComparisons.length,
    controlA1: 0,
    treatmentA1: 0,
    controlScaffold: 0,
    treatmentScaffold: 0,
    controlCost: 0,
    treatmentCost: 0,
    plantedTotal: 0,
    unresolvedTotal: 0,
    pairsOk: 0,
  };
  for (const p of pairComparisons) {
    totals.controlA1 += p.control.scaffold.a1;
    totals.treatmentA1 += p.treatment.scaffold.a1;
    totals.controlScaffold += p.control.scaffold.total;
    totals.treatmentScaffold += p.treatment.scaffold.total;
    totals.controlCost += Number(p.control.costUsd) || 0;
    totals.treatmentCost += Number(p.treatment.costUsd) || 0;
    totals.plantedTotal += Number(p.treatment.regen?.plantedCount) || 0;
    totals.unresolvedTotal += Number(p.treatment.regen?.unresolvedCount) || 0;
    if (p.ok) totals.pairsOk += 1;
  }

  const allPairsOk = totals.pairs > 0 && totals.pairsOk === totals.pairs;
  const costOk = totals.controlCost === 0 ? true : totals.treatmentCost <= totals.controlCost * 2;
  const a1NotWorse = totals.treatmentA1 <= totals.controlA1;
  const a1Eliminated = totals.treatmentA1 === 0;

  const gates = [
    { name: "all_pairs_ok", ok: allPairsOk, detail: `${totals.pairsOk}/${totals.pairs}` },
    { name: "aggregate_cost_within_2x", ok: costOk, detail: `control=$${totals.controlCost.toFixed(4)} treatment=$${totals.treatmentCost.toFixed(4)}` },
    { name: "aggregate_a1_scaffold_reduced_or_equal", ok: a1NotWorse, detail: `control=${totals.controlA1} treatment=${totals.treatmentA1}` },
    { name: "a1_scaffold_eliminated (target)", ok: a1Eliminated, detail: `treatment A1 total=${totals.treatmentA1}`, advisory: true },
  ];

  const pass = allPairsOk && costOk && a1NotWorse;
  return { totals, gates, pass };
}

/** Parse the two regen telemetry lines the Agent-9 clue-regen pass logs to stdout. */
export function parseRegenTelemetry(stdout) {
  const text = String(stdout ?? "");
  const plantedClues = [];
  let unresolvedCount = 0;
  const unresolved = [];
  const plantedRe = /regen-clue planted \[([^\]]*)\] in ch(\d+)/g;
  let m;
  while ((m = plantedRe.exec(text)) !== null) {
    for (const id of m[1].split(",").map((s) => s.trim()).filter(Boolean)) {
      plantedClues.push(id);
    }
  }
  const unresolvedRe = /regen-clue UNRESOLVED ch(\d+) (\S+):/g;
  while ((m = unresolvedRe.exec(text)) !== null) {
    unresolvedCount += 1;
    unresolved.push(m[2]);
  }
  return { plantedCount: plantedClues.length, plantedClues, unresolvedCount, unresolved };
}

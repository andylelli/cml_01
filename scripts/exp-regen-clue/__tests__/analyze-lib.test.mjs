import { test } from "node:test";
import assert from "node:assert/strict";
import {
  scaffoldStats,
  pronounSignals,
  parseRegenTelemetry,
  comparePair,
  aggregate,
} from "../analyze-lib.mjs";

// A real A1 injector signature (deterministic-repair.ts:300) — detectScaffoldNotProse must fire on it.
const A1_CH = { index: 1, title: "Ch1", text: "The inspector weighed the note, and the trail bent toward Hastings. She lingered." };
const CLEAN_CH = { index: 1, title: "Ch1", text: "Rain streaked the tall windows. The inspector turned the note over in gloved hands and said nothing." };

test("scaffoldStats fires on the A1 signature and isolates the A1 family", () => {
  const stats = scaffoldStats([A1_CH]);
  assert.equal(stats.a1, 1, "A1 rule should fire once");
  assert.ok(stats.total >= 1);
  assert.ok(Object.keys(stats.byRule).some((r) => r.startsWith("A1:")));
});

test("scaffoldStats returns zero on clean, grounded prose", () => {
  const stats = scaffoldStats([CLEAN_CH]);
  assert.equal(stats.a1, 0);
  assert.equal(stats.total, 0);
});

test("comparePair passes when treatment removes the A1 scaffold, holds gate + words", () => {
  const control = {
    arm: "control", runId: "R1", status: "success",
    dump: { runId: "R1", chapterCount: 1, totalWords: 12, chapters: [A1_CH], agent9CostUsd: 0.3, releaseGate: { status: "passed", hardStops: [], warnings: [] }, warnings: [] },
  };
  const treatment = {
    arm: "treatment", runId: "R1", status: "success",
    regen: { plantedCount: 1, unresolvedCount: 0 },
    dump: { runId: "R1", chapterCount: 1, totalWords: 13, chapters: [CLEAN_CH], agent9CostUsd: 0.34, releaseGate: { status: "passed", hardStops: [], warnings: [] }, warnings: [] },
  };
  const pair = comparePair(control, treatment);
  assert.equal(pair.ok, true);
  assert.equal(pair.control.scaffold.a1, 1);
  assert.equal(pair.treatment.scaffold.a1, 0);
});

test("comparePair fails when treatment regresses a guardrail (new gate hard-stop)", () => {
  const control = {
    arm: "control", runId: "R2", status: "success",
    dump: { runId: "R2", chapterCount: 1, totalWords: 12, chapters: [A1_CH], agent9CostUsd: 0.3, releaseGate: { status: "passed", hardStops: [], warnings: [] }, warnings: [] },
  };
  const treatment = {
    arm: "treatment", runId: "R2", status: "success",
    dump: { runId: "R2", chapterCount: 1, totalWords: 12, chapters: [CLEAN_CH], agent9CostUsd: 0.31, releaseGate: { status: "failed", hardStops: ["clue visibility incomplete"], warnings: [] }, warnings: [] },
  };
  const pair = comparePair(control, treatment);
  assert.equal(pair.ok, false);
  assert.ok(pair.checks.find((c) => c.name === "gate_hardstops_not_worse" && !c.ok));
});

test("comparePair fails when an arm did not complete", () => {
  const control = { arm: "control", runId: "R3", status: "success", dump: { chapterCount: 1, totalWords: 10, chapters: [CLEAN_CH], releaseGate: { hardStops: [] } } };
  const treatment = { arm: "treatment", runId: "R3", status: "failure", exitCode: 1, dump: null };
  const pair = comparePair(control, treatment);
  assert.equal(pair.ok, false);
  assert.ok(pair.checks.find((c) => c.name === "both_arms_completed" && !c.ok));
});

test("comparePair fails when an arm re-synthesized Agent 7 (pair not matched)", () => {
  const control = {
    arm: "control", runId: "R4", status: "success", synthesizedAgent7: true,
    dump: { runId: "R4", chapterCount: 10, totalWords: 100, chapters: [CLEAN_CH], agent9CostUsd: 0.3, releaseGate: { status: "passed", hardStops: [], warnings: [] }, warnings: [] },
  };
  const treatment = {
    arm: "treatment", runId: "R4", status: "success", synthesizedAgent7: false,
    dump: { runId: "R4", chapterCount: 10, totalWords: 100, chapters: [CLEAN_CH], agent9CostUsd: 0.31, releaseGate: { status: "passed", hardStops: [], warnings: [] }, warnings: [] },
  };
  const pair = comparePair(control, treatment);
  assert.equal(pair.ok, false);
  assert.ok(pair.checks.find((c) => c.name === "outline_hydrated_not_synthesized" && !c.ok));
});

test("aggregate PASSES when all pairs ok, cost within 2x, A1 reduced", () => {
  const pairs = [
    { runId: "R1", ok: true, control: { scaffold: { a1: 2, total: 3 }, costUsd: 0.3 }, treatment: { scaffold: { a1: 0, total: 1 }, costUsd: 0.34, regen: { plantedCount: 2, unresolvedCount: 0 } } },
    { runId: "R2", ok: true, control: { scaffold: { a1: 1, total: 1 }, costUsd: 0.3 }, treatment: { scaffold: { a1: 0, total: 0 }, costUsd: 0.33, regen: { plantedCount: 1, unresolvedCount: 0 } } },
  ];
  const agg = aggregate(pairs);
  assert.equal(agg.pass, true);
  assert.equal(agg.totals.treatmentA1, 0);
  assert.equal(agg.totals.plantedTotal, 3);
  assert.ok(agg.gates.find((g) => g.name === "a1_scaffold_eliminated (target)" && g.ok));
});

test("aggregate FAILS on cost blowout even if pairs individually ok", () => {
  const pairs = [
    { runId: "R1", ok: true, control: { scaffold: { a1: 1, total: 1 }, costUsd: 0.3 }, treatment: { scaffold: { a1: 0, total: 0 }, costUsd: 0.9, regen: { plantedCount: 1, unresolvedCount: 0 } } },
  ];
  const agg = aggregate(pairs);
  assert.equal(agg.pass, false);
  assert.ok(agg.gates.find((g) => g.name === "aggregate_cost_within_2x" && !g.ok));
});

test("parseRegenTelemetry extracts planted clues and unresolved count from stdout", () => {
  const stdout = [
    "[Agent 9] regen-clue planted [clue_3, clue_7] in ch2 (A1 patch suppressed for these).",
    "[Agent 9] regen-clue UNRESOLVED ch5 clue_9: paragraph anchor not found (deterministic floor will apply)",
    "[Agent 9] regen-clue planted [clue_11] in ch6 (A1 patch suppressed for these).",
  ].join("\n");
  const t = parseRegenTelemetry(stdout);
  assert.deepEqual(t.plantedClues, ["clue_3", "clue_7", "clue_11"]);
  assert.equal(t.plantedCount, 3);
  assert.equal(t.unresolvedCount, 1);
  assert.deepEqual(t.unresolved, ["clue_9"]);
});

test("pronounSignals surfaces only pronoun/misgender warnings", () => {
  const sigs = pronounSignals([
    "Outline coverage gap: clue_2 missing",
    "deterministic pronoun sweep repaired 3 wrong-gender pronouns",
    "misgender detected for Hastings",
  ]);
  assert.equal(sigs.length, 2);
});

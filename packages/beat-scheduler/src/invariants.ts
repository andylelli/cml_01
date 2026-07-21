/**
 * Scene-grid invariants (Agent 7 redesign §4.3 / §9.4). The point of scheduler-first is that
 * correctness is a *property*, not a vibe — so these are pure, deterministic checks the scheduler
 * self-verifies before returning a grid, and the property tests + shadow harness assert directly:
 *
 *   COMPLETE — every collected obligation is placed in exactly one slot.
 *   ORDERED  — every §4.1 precedence edge holds (a pure DAG check over slot order).
 *   COVERAGE — ≥60% clue-bearing slots, and no run of >2 clueless slots.
 */

import type { Obligation, SceneGrid } from "./types.js";

function obligationSig(o: Obligation): string {
  switch (o.kind) {
    case "introduce_suspect":
    case "clear_suspect":
      return `${o.kind}:${o.name}`;
    case "reveal_clue":
    case "plant_clue":
    case "plant_red_herring":
      return `${o.kind}:${o.id}`;
    default:
      return o.kind;
  }
}

export interface CompletenessResult {
  ok: boolean;
  missing: string[];
  duplicated: string[];
}

/** Every collected obligation appears exactly once across the grid. */
export function checkComplete(grid: SceneGrid, collected: Obligation[]): CompletenessResult {
  const want = new Map<string, number>();
  for (const o of collected) want.set(obligationSig(o), (want.get(obligationSig(o)) ?? 0) + 1);
  const got = new Map<string, number>();
  for (const slot of grid.slots) for (const o of slot.obligations) got.set(obligationSig(o), (got.get(obligationSig(o)) ?? 0) + 1);

  const missing: string[] = [];
  const duplicated: string[] = [];
  for (const [sig, n] of want) {
    const g = got.get(sig) ?? 0;
    if (g < n) missing.push(sig);
    else if (g > n) duplicated.push(sig);
  }
  return { ok: missing.length === 0 && duplicated.length === 0, missing, duplicated };
}

interface Indexed {
  testIdx: number;
  falseIdx: number;
  revealIdx: number; // reveal_solution
  revealByClue: Map<string, number>;
}

function indexGrid(grid: SceneGrid): Indexed {
  let testIdx = -1;
  let falseIdx = -1;
  let revealIdx = -1;
  const revealByClue = new Map<string, number>();
  grid.slots.forEach((slot, idx) => {
    for (const o of slot.obligations) {
      if (o.kind === "discriminating_test") testIdx = idx;
      else if (o.kind === "false_solution") falseIdx = idx;
      else if (o.kind === "reveal_solution") revealIdx = idx;
      else if (o.kind === "reveal_clue" && !revealByClue.has(o.id)) revealByClue.set(o.id, idx);
    }
  });
  return { testIdx, falseIdx, revealIdx, revealByClue };
}

export interface OrderingResult {
  ok: boolean;
  violations: string[];
}

/** Every §4.1 precedence edge holds, checked over slot order. */
export function checkOrdered(grid: SceneGrid): OrderingResult {
  const v: string[] = [];
  const { testIdx, falseIdx, revealIdx, revealByClue } = indexGrid(grid);
  const lastIdx = grid.slots.length - 1;

  grid.slots.forEach((slot, idx) => {
    for (const o of slot.obligations) {
      switch (o.kind) {
        case "introduce_victim":
        case "discover_crime":
          if (slot.act !== 1) v.push(`${o.kind} must be in Act I (is in Act ${slot.act})`);
          break;
        case "reveal_clue":
          if (idx === lastIdx) v.push(`reveal_clue ${o.id} sits in the final slot (no clue may follow the reveal)`);
          if (o.criticality === "essential" && testIdx >= 0 && idx >= testIdx)
            v.push(`essential clue ${o.id} (slot ${idx + 1}) not revealed before the discriminating test (slot ${testIdx + 1})`);
          break;
        case "discriminating_test":
          for (const cid of o.supportingClues) {
            const r = revealByClue.get(cid);
            if (r == null) v.push(`discriminating test cites clue ${cid} which is never revealed`);
            else if (r >= idx) v.push(`discriminating test (slot ${idx + 1}) uses clue ${cid} not visible until slot ${r + 1}`);
          }
          if (revealIdx >= 0 && idx >= revealIdx) v.push(`discriminating test (slot ${idx + 1}) is not before the reveal (slot ${revealIdx + 1})`);
          break;
        case "clear_suspect":
          for (const cid of o.supportingClues) {
            const r = revealByClue.get(cid);
            if (r != null && r > idx) v.push(`clear_suspect ${o.name} (slot ${idx + 1}) uses clue ${cid} not visible until slot ${r + 1}`);
          }
          if (revealIdx >= 0 && idx > revealIdx) v.push(`clear_suspect ${o.name} occurs after the reveal`);
          break;
        case "false_solution":
          if (testIdx >= 0 && idx >= testIdx) v.push(`false_solution (slot ${idx + 1}) is not before the discriminating test (slot ${testIdx + 1})`);
          break;
        case "plant_red_herring":
          if (falseIdx >= 0 && idx > falseIdx) v.push(`red herring ${o.id} (slot ${idx + 1}) planted after the false solution it feeds (slot ${falseIdx + 1})`);
          break;
        case "plant_clue": {
          // A_64 C1 — a plant must sit ≥2 slots before the reveal it foreshadows.
          const rp = revealByClue.get(o.id);
          if (rp == null) v.push(`plant_clue ${o.id} (slot ${idx + 1}) foreshadows a clue that is never revealed`);
          else if (idx > rp - 2) v.push(`plant_clue ${o.id} (slot ${idx + 1}) is not ≥2 slots before its reveal (slot ${rp + 1})`);
          break;
        }
        case "reveal_solution":
          if (idx !== lastIdx) v.push(`reveal_solution is not the final beat (slot ${idx + 1} of ${grid.slots.length})`);
          break;
      }
    }
  });
  return { ok: v.length === 0, violations: v };
}

export interface CoverageResult {
  /** ratioOk && pacingOk. */
  ok: boolean;
  /** HARD guarantee: ≥minRatio clue-bearing slots (§4.3). */
  ratioOk: boolean;
  /** SOFT pacing target: no run of >2 clueless slots (§1). Best-effort, not enforced by a throw. */
  pacingOk: boolean;
  ratio: number;
  clueBearing: number;
  longestCluelessRun: number;
  violations: string[];
}

/**
 * A_64 §3.3 C1 — the plant-before-reveal guarantee: every ESSENTIAL clue revealed at slot ≥3 has a
 * plant_clue ≥2 slots earlier. Reveals at slots 1–2 are already early (the corpus complaint —
 * "introduced too late" — cannot apply) and are exempt.
 */
export interface PlantCoverageResult {
  ok: boolean;
  violations: string[];
}

export function checkPlantBeforeReveal(grid: SceneGrid): PlantCoverageResult {
  const violations: string[] = [];
  const plantIdxByClue = new Map<string, number>();
  grid.slots.forEach((slot, idx) => {
    for (const o of slot.obligations) {
      if (o.kind === "plant_clue" && !plantIdxByClue.has(o.id)) plantIdxByClue.set(o.id, idx);
    }
  });
  grid.slots.forEach((slot, idx) => {
    for (const o of slot.obligations) {
      if (o.kind !== "reveal_clue" || o.criticality !== "essential" || idx < 2) continue;
      const p = plantIdxByClue.get(o.id);
      if (p == null) violations.push(`essential clue ${o.id} (reveal slot ${idx + 1}) has no plant slot`);
      else if (p > idx - 2) violations.push(`essential clue ${o.id}: plant (slot ${p + 1}) is not ≥2 slots before the reveal (slot ${idx + 1})`);
    }
  });
  return { ok: violations.length === 0, violations };
}

/** A slot is clue-bearing if it reveals a clue OR cites prior clues (clearance/test) OR plants a herring.
 *  A_64 C1 note: plant_clue deliberately does NOT count — plants are incidental, unflagged appearances,
 *  and counting them would loosen the ≥60% coverage guarantee that predates them. */
export function isClueBearing(slot: SceneGrid["slots"][number]): boolean {
  if (slot.cluesRevealed.length > 0) return true;
  return slot.obligations.some(
    (o) =>
      (o.kind === "clear_suspect" && o.supportingClues.length > 0) ||
      (o.kind === "discriminating_test" && o.supportingClues.length > 0) ||
      o.kind === "plant_red_herring",
  );
}

export function checkCoverage(grid: SceneGrid, minRatio = 0.6): CoverageResult {
  const flags = grid.slots.map(isClueBearing);
  const clueBearing = flags.filter(Boolean).length;
  const ratio = grid.slots.length === 0 ? 0 : clueBearing / grid.slots.length;

  let longestCluelessRun = 0;
  let run = 0;
  for (const f of flags) {
    run = f ? 0 : run + 1;
    if (run > longestCluelessRun) longestCluelessRun = run;
  }

  const ratioOk = ratio >= minRatio;
  const pacingOk = longestCluelessRun <= 2;
  const violations: string[] = [];
  if (!ratioOk) violations.push(`only ${clueBearing}/${grid.slots.length} (${Math.round(ratio * 100)}%) clue-bearing slots, need ${Math.round(minRatio * 100)}%`);
  if (!pacingOk) violations.push(`a run of ${longestCluelessRun} consecutive clueless slots (soft target: max 2)`);
  return { ok: ratioOk && pacingOk, ratioOk, pacingOk, ratio, clueBearing, longestCluelessRun, violations };
}

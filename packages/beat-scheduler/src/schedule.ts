/**
 * The Beat Scheduler (Agent 7 redesign §4.1 step 3) — `buildSceneGrid`.
 *
 * A small, robust constraint layout: collect the CML obligations, lay them into exactly `sceneCount`
 * slots split by act ratio, honour the precedence laws (clue-before-test, test-before-reveal,
 * false-before-test, victim/crime in Act I, reveal last with no clue after), and spread clue reveals
 * so ≥60% of slots are clue-bearing — all by construction, no LLM. Returns a grid that passes the
 * §4.3 invariants, or throws `SchedulerInfeasibleError` with the precise unmet constraint.
 */

import { collectObligations } from "./collect.js";
import { checkComplete, checkCoverage, checkOrdered, isClueBearing } from "./invariants.js";
import {
  type Act,
  type Obligation,
  type SceneGrid,
  type SceneSlot,
  SchedulerInfeasibleError,
  type SchedulerInput,
} from "./types.js";

const ACT1_RATIO = 0.28;
const ACT2_RATIO = 0.47;

const GOLDEN_AGE_BEATS = [
  "gathering", "crime", "first_enquiries", "motives", "alibis",
  "false_solution", "secrets", "pattern", "final_trap", "revelation",
] as const;

interface MutSlot {
  sceneNumber: number;
  act: Act;
  obligations: Obligation[];
  cluesRevealed: string[];
}

function actCounts(n: number): { a1: number; a2: number; a3: number } {
  let a1 = Math.max(1, Math.round(n * ACT1_RATIO));
  let a2 = Math.max(1, Math.round(n * ACT2_RATIO));
  let a3 = n - a1 - a2;
  while (a3 < 1) {
    if (a2 > a1) a2--;
    else a1--;
    a3 = n - a1 - a2;
  }
  return { a1, a2, a3 };
}

function add(slot: MutSlot, o: Obligation): void {
  slot.obligations.push(o);
  if (o.kind === "reveal_clue" && !slot.cluesRevealed.includes(o.id)) slot.cluesRevealed.push(o.id);
}

function functionString(o: Obligation): string {
  switch (o.kind) {
    case "introduce_victim": return "introduce the victim";
    case "discover_crime": return "discover the crime";
    case "introduce_suspect": return `introduce ${o.name}`;
    case "detective_entry": return `detective enters (${o.type})`;
    case "reveal_clue": return `reveal ${o.id}`;
    case "plant_red_herring": return `plant herring ${o.id}`;
    case "clear_suspect": return `clear ${o.name}`;
    case "false_solution": return "the false solution";
    case "discriminating_test": return "discriminating test";
    case "reveal_solution": return "reveal the solution";
    case "denouement": return "denouement";
  }
}

export function buildSceneGrid(input: SchedulerInput, sceneCount: number): SceneGrid {
  if (!Number.isInteger(sceneCount) || sceneCount < 4) {
    throw new SchedulerInfeasibleError(`scene count ${sceneCount} too small (need ≥4 for victim/crime/test/reveal)`);
  }
  const collected = collectObligations(input.cml, input.clues, input.redHerrings);
  const { a1, a2 } = actCounts(sceneCount);
  const N = sceneCount;

  const slots: MutSlot[] = Array.from({ length: N }, (_, i) => ({
    sceneNumber: i + 1,
    act: (i < a1 ? 1 : i < a1 + a2 ? 2 : 3) as Act,
    obligations: [],
    cluesRevealed: [],
  }));
  const lastIdx = N - 1;
  const actIdxs = (act: Act): number[] => slots.map((s, i) => (s.act === act ? i : -1)).filter((i) => i >= 0);

  // ── key indices ────────────────────────────────────────────────────────────
  const test = collected.obligations.find((o) => o.kind === "discriminating_test") as
    | Extract<Obligation, { kind: "discriminating_test" }>
    | undefined;
  const timing = test?.timing ?? "early_act3";
  let testIdx =
    timing === "late_act2" ? a1 + a2 - 1 : timing === "mid_act3" ? a1 + a2 + Math.floor((N - a1 - a2) / 2) : a1 + a2;
  if (testIdx >= lastIdx) testIdx = lastIdx - 1; // the test must precede the reveal
  if (testIdx < 1) testIdx = 1;

  let falseIdx = Math.min(testIdx - 1, a1 + a2 - 1);
  if (falseIdx < a1) falseIdx = Math.max(0, testIdx - 1); // tiny grids: just keep it before the test

  // ── anchors ─────────────────────────────────────────────────────────────────
  add(slots[0], { kind: "introduce_victim" });
  for (const o of collected.obligations) if (o.kind === "introduce_suspect") add(slots[0], o);
  const crimeIdx = Math.min(1, a1 - 1);
  add(slots[crimeIdx], { kind: "discover_crime" });
  const det = collected.obligations.find((o) => o.kind === "detective_entry");
  if (det) add(slots[crimeIdx], det);
  if (collected.hasFalseSolution) add(slots[falseIdx], { kind: "false_solution" });
  if (test) add(slots[testIdx], test);
  add(slots[lastIdx], { kind: "reveal_solution" });
  add(slots[lastIdx], { kind: "denouement" });

  // ── reveals (essentials first, ordered by placement; spread to empty slots) ──
  const placementAct = (p: string): Act => (p === "early" ? 1 : p === "late" ? 3 : 2);
  const critRank = { essential: 0, supporting: 1, optional: 2 } as const;
  const placeRank = { early: 0, mid: 1, late: 2 } as const;
  const reveals = collected.obligations
    .filter((o): o is Extract<Obligation, { kind: "reveal_clue" }> => o.kind === "reveal_clue")
    .sort((x, y) => critRank[x.criticality] - critRank[y.criticality] || placeRank[x.placement] - placeRank[y.placement]);

  const eligibleForReveal = (idx: number, essential: boolean): boolean => {
    if (idx === lastIdx) return false; // no clue may follow the reveal
    if (essential && idx >= testIdx) return false; // essentials before the test
    return true;
  };
  const pickRevealSlot = (essential: boolean, prefAct: Act): number => {
    let pool = actIdxs(prefAct).filter((i) => eligibleForReveal(i, essential));
    if (pool.length === 0) pool = slots.map((_, i) => i).filter((i) => eligibleForReveal(i, essential));
    // prefer an empty (not-yet-clue-bearing) slot to maximise spread, then least-loaded, then earliest
    pool.sort((i, j) => {
      const ei = isClueBearing(viewSlot(i)) ? 1 : 0;
      const ej = isClueBearing(viewSlot(j)) ? 1 : 0;
      return ei - ej || slots[i].obligations.length - slots[j].obligations.length || i - j;
    });
    return pool[0];
  };
  // a read-only view so isClueBearing can be reused during layout
  const viewSlot = (i: number): SceneSlot => ({ ...slots[i], beat: undefined, function: "" });

  for (const r of reveals) {
    const essential = r.criticality === "essential";
    add(slots[pickRevealSlot(essential, placementAct(r.placement))], r);
  }

  // ── clearances (after supporting clues, before the reveal) ───────────────────
  const revealIdxByClue = new Map<string, number>();
  slots.forEach((s, i) => s.obligations.forEach((o) => o.kind === "reveal_clue" && !revealIdxByClue.has(o.id) && revealIdxByClue.set(o.id, i)));
  for (const o of collected.obligations) {
    if (o.kind !== "clear_suspect") continue;
    const minIdx = Math.max(
      a1, // clearances live in Act II+
      ...o.supportingClues.map((c) => revealIdxByClue.get(c)).filter((i): i is number => i != null),
    );
    let pool = slots.map((_, i) => i).filter((i) => i >= minIdx && i < lastIdx);
    if (pool.length === 0) pool = [Math.max(minIdx, lastIdx - 1)];
    pool.sort((i, j) => {
      const bi = i <= testIdx ? 0 : 1; // prefer clearing before the test
      const bj = j <= testIdx ? 0 : 1;
      return bi - bj || slots[i].obligations.length - slots[j].obligations.length || i - j;
    });
    add(slots[pool[0]], o);
  }

  // ── red herrings (planted before the false solution) ─────────────────────────
  for (const o of collected.obligations) {
    if (o.kind !== "plant_red_herring") continue;
    const cap = collected.hasFalseSolution ? falseIdx : a1 + a2 - 1;
    let pool = slots.map((_, i) => i).filter((i) => i <= cap && i < lastIdx);
    if (pool.length === 0) pool = [0];
    pool.sort((i, j) => slots[i].obligations.length - slots[j].obligations.length || i - j);
    add(slots[pool[0]], o);
  }

  // ── coverage lift: spread stacked reveals into empty eligible slots ───────────
  liftCoverage(slots, testIdx, lastIdx, revealIdxByClue);

  // ── assemble ─────────────────────────────────────────────────────────────────
  const finalSlots: SceneSlot[] = slots.map((s, i) => ({
    sceneNumber: s.sceneNumber,
    act: s.act,
    obligations: s.obligations,
    cluesRevealed: s.cluesRevealed,
    beat: N === 10 ? GOLDEN_AGE_BEATS[i] : undefined,
    function: s.obligations.map(functionString).join("; ") || "connective scene",
  }));
  const counts = actCounts(N);
  const grid: SceneGrid = {
    slots: finalSlots,
    sceneCount: N,
    actCounts: { act1: counts.a1, act2: counts.a2, act3: counts.a3 },
    provenComplete: true,
  };

  // ── self-verify (throw rather than return a wrong grid) ──────────────────────
  const complete = checkComplete(grid, collected.obligations);
  if (!complete.ok) throw new SchedulerInfeasibleError(`incomplete grid — missing [${complete.missing.join(", ")}]`);
  const ordered = checkOrdered(grid);
  if (!ordered.ok) throw new SchedulerInfeasibleError(`ordering broken — ${ordered.violations[0]}`);
  const coverage = checkCoverage(grid);
  if (!coverage.ratioOk) {
    throw new SchedulerInfeasibleError(`coverage ${Math.round(coverage.ratio * 100)}% < 60% — too few clue-bearing slots for ${N} scenes`);
  }
  return grid;
}

/**
 * Spread reveals to satisfy the §4.3 pacing guarantee: ≥60% clue-bearing AND no run of >2 clueless
 * slots. Best-effort: it relocates a reveal from a slot that stays clue-bearing without it into a
 * non-bearing recipient — preferring the middle of the longest clueless run so runs shrink first.
 */
function liftCoverage(slots: MutSlot[], testIdx: number, lastIdx: number, _by: Map<string, number>): void {
  const bearing = (s: MutSlot): boolean =>
    s.cluesRevealed.length > 0 ||
    s.obligations.some(
      (o) =>
        (o.kind === "clear_suspect" && o.supportingClues.length > 0) ||
        (o.kind === "discriminating_test" && o.supportingClues.length > 0) ||
        o.kind === "plant_red_herring",
    );
  /** Can this slot donate one reveal and still be clue-bearing? */
  const canDonate = (s: MutSlot): boolean =>
    s.cluesRevealed.length >= 2 ||
    (s.cluesRevealed.length === 1 &&
      s.obligations.some(
        (o) =>
          (o.kind === "clear_suspect" && o.supportingClues.length > 0) ||
          (o.kind === "discriminating_test" && o.supportingClues.length > 0) ||
          o.kind === "plant_red_herring",
      ));
  const target = Math.ceil(slots.length * 0.6);

  const longestRunMiddle = (): number => {
    let bestStart = -1;
    let bestLen = 0;
    let runStart = -1;
    let runLen = 0;
    slots.forEach((s, i) => {
      if (!bearing(s)) {
        if (runLen === 0) runStart = i;
        runLen++;
        if (runLen > bestLen) {
          bestLen = runLen;
          bestStart = runStart;
        }
      } else runLen = 0;
    });
    return bestLen > 2 ? bestStart + Math.floor(bestLen / 2) : -1;
  };

  for (let guard = 0; guard < slots.length * 4; guard++) {
    const count = slots.filter(bearing).length;
    const runMid = longestRunMiddle();
    if (count >= target && runMid < 0) return;

    // recipient: break the longest clueless run first; else any non-bearing eligible slot.
    const recipientIdx =
      runMid >= 0 && runMid !== lastIdx ? runMid : slots.findIndex((s, i) => i !== lastIdx && !bearing(s));
    if (recipientIdx < 0 || recipientIdx === lastIdx) return;

    // donor: any slot that stays clue-bearing after losing one reveal, with a movable clue.
    let moved = false;
    for (let d = 0; d < slots.length && !moved; d++) {
      if (d === recipientIdx || !canDonate(slots[d])) continue;
      const donor = slots[d];
      const cand = [...donor.obligations]
        .reverse()
        .find(
          (o): o is Extract<Obligation, { kind: "reveal_clue" }> =>
            o.kind === "reveal_clue" && (o.criticality !== "essential" || recipientIdx < testIdx),
        );
      if (!cand) continue;
      donor.obligations.splice(donor.obligations.indexOf(cand), 1);
      donor.cluesRevealed = donor.cluesRevealed.filter((id) => id !== cand.id);
      add(slots[recipientIdx], cand);
      moved = true;
    }
    if (!moved) return; // best effort exhausted
  }
}

/**
 * Solvability proof + difficulty report (Agent 6 redesign §4.1 / §9.2).
 *
 * Agent 6 today is "an LLM grading an LLM's logic," with a second stochastic LLM holding a veto that
 * can kill a sound case. The redesign splits fair play into its two halves and never lets them trade
 * places: a **deterministic checker owns correctness** (the proof below), and a **panel of reader-
 * simulators owns difficulty/felt-fairness** (the report below) — and the panel can only ever
 * annotate, never abort.
 *
 * `proveSolvability` is the correctness half. Crucially it is NOT a new prover: §4.1/§9.3 say "the
 * Solvability Checker is a superset of Agent 3's deducibility + uniqueness engines — I reuse those
 * engines, I do not re-implement a parallel prover." So this is a thin, faithful *adapter* over
 * `@cml/cml-core`'s `certify` + engines, projecting their result into the `SolvabilityProof` contract
 * Agents 7/9 will consume. It is pure and deterministic over (cml) — the §9.4 determinism invariant
 * (the same case certifies identically every time, regardless of any reader's bad day) holds by
 * construction.
 *
 * Representation note: the doc's contract is phrased over the visible-evidence set V with early/mid/
 * late *placements*; the typed core's native ordering axis is the integer `availableByStep`, so the
 * proof is expressed in step terms (`visibleByStep`, `firstVisibleAtStep`). The placement↔step bridge
 * for the live (prose-stage) cml+clues is a later-phase concern (§9.3), not part of this increment.
 */

import type { EntityId, EliminationEdge, TypedCml } from "./types.js";
import { certify, CHECKER_VERSION } from "./certify.js";

/** The machine-checkable correctness verdict (§9.2). When `!solvable`, exactly one typed defect. */
export interface SolvabilityProof {
  solvable: boolean;
  culprit: EntityId;
  /** The proof trace: each non-culprit, the clue(s) that eliminate them, and when they're visible. */
  eliminated: Array<{ suspect: EntityId; byClue: string; visibleByStep: number }>;
  /** Suspects for whom a consistent guilty-world survives the visible clues (1 ⇔ unique). */
  uniqueAmong: EntityId[];
  /** A step that consumes evidence the reader hasn't seen yet (temporal-availability violation). */
  temporalViolations: Array<{ stepIndex: number; needsClue: string; firstVisibleAtStep: number }>;
  /** Reveal facts not grounded in the visible-evidence set (info-parity). Empty in the typed model. */
  parityViolations: Array<{ revealFact: string }>;
  checkerVersion: string;
  /** When `!solvable`: one obligation routed to one upstream owner — no four-agent escalation. */
  defect?: { obligation: string; owner: "agent3" | "agent5" };
}

function clueAvailabilityByStep(cml: TypedCml): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of cml.clues) m.set(c.id, c.availableByStep);
  return m;
}

/**
 * Prove a typed CML solvable by reusing the fair-play engines (timeline / deducibility / uniqueness)
 * and projecting their certificate into a `SolvabilityProof`. The correctness verdict (`solvable`,
 * `culprit`, `uniqueAmong`, `defect`) comes straight from `certify`; the proof trace (`eliminated`)
 * and `temporalViolations` are read structurally off the inference path so the report is actionable.
 */
export function proveSolvability(cml: TypedCml): SolvabilityProof {
  const cert = certify(cml);
  const availability = clueAvailabilityByStep(cml);

  // Proof trace: each elimination edge names a suspect and the clues that clear them.
  const eliminated: SolvabilityProof["eliminated"] = [];
  cml.inferencePath.forEach((edge) => {
    if (edge.rule === "time_correction") return;
    const e = edge as EliminationEdge;
    const visibleByStep = Math.max(
      0,
      ...e.from.map((id) => availability.get(id)).filter((s): s is number => s != null),
    );
    eliminated.push({ suspect: e.eliminates, byClue: e.from.join("+"), visibleByStep });
  });

  // Temporal-availability replay: a premise clue must be visible by the step that consumes it
  // (position = 1-based index in the inference path). This is the §4.1 "step consumes evidence the
  // reader hasn't seen yet" check, consistent with the deducibility engine's availability rule.
  const temporalViolations: SolvabilityProof["temporalViolations"] = [];
  cml.inferencePath.forEach((edge, idx) => {
    const position = idx + 1;
    for (const id of edge.from) {
      const firstVisibleAtStep = availability.get(id);
      if (firstVisibleAtStep != null && firstVisibleAtStep > position) {
        temporalViolations.push({ stepIndex: position, needsClue: id, firstVisibleAtStep });
      }
    }
  });

  const proof: SolvabilityProof = {
    solvable: cert.ok,
    culprit: cert.culpritId,
    eliminated,
    uniqueAmong: cert.uniqueAmong,
    temporalViolations,
    parityViolations: [], // the typed model's V *is* the clue set; no separate reveal facts to ground
    checkerVersion: CHECKER_VERSION,
  };

  if (!cert.ok) {
    // Route one defect to one owner: a placement/availability gap is Agent 5's (clue exposure);
    // an unsound or non-unique proof is Agent 3's (the logic itself).
    const owner: "agent3" | "agent5" = temporalViolations.length > 0 ? "agent5" : "agent3";
    proof.defect = { obligation: cert.failures[0] ?? "case is not provably solvable", owner };
  }

  return proof;
}

// ── Difficulty report (the panel half — §4.2) ────────────────────────────────
// Computed deterministically from the panel's guesses. This is the contract; the panel itself
// (N diverse reader-simulators) is a later phase. Difficulty is *metadata*, never a pass/fail gate.

export type Difficulty = "trivial" | "easy" | "hard" | "obscure";

export interface PanelGuess {
  persona: string;
  suspectedCulprit: string;
  confidence: "certain" | "likely" | "uncertain" | "impossible";
  missingInformation?: string[];
}

export interface DifficultyReport {
  panelSize: number;
  /** Fraction of the panel that named the real culprit. */
  solveRate: number;
  difficulty: Difficulty;
  /** Wrong suspects the panel converged on (an unintended-red-herring signal). */
  wrongConvergence: Array<{ suspect: string; count: number }>;
  /** Experiential gaps a real reader would feel — distinct from the formal proof. */
  experientialWarnings: string[];
}

/** Loose name match — the blind reader may say "Avery" for "John Avery". */
function sameName(a: string, b: string): boolean {
  const na = a.trim().toLowerCase();
  const nb = b.trim().toLowerCase();
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

/**
 * Fold a panel's guesses into a difficulty reading (§4.2). Because the checker has already *proven*
 * the case solvable, a low solve rate means "hard", not "unfair" — it is surfaced as metadata.
 */
export function summarizeDifficulty(guesses: PanelGuess[], culprit: string): DifficultyReport {
  const panelSize = guesses.length;
  const solved = guesses.filter((g) => sameName(g.suspectedCulprit, culprit)).length;
  const solveRate = panelSize === 0 ? 0 : solved / panelSize;

  let difficulty: Difficulty;
  if (solveRate >= 0.9) difficulty = "trivial";
  else if (solveRate >= 0.6) difficulty = "easy";
  else if (solveRate >= 0.2) difficulty = "hard";
  else difficulty = "obscure";

  const wrongCounts = new Map<string, number>();
  for (const g of guesses) {
    if (sameName(g.suspectedCulprit, culprit)) continue;
    const key = g.suspectedCulprit.trim();
    if (!key) continue;
    wrongCounts.set(key, (wrongCounts.get(key) ?? 0) + 1);
  }
  const wrongConvergence = [...wrongCounts.entries()]
    .map(([suspect, count]) => ({ suspect, count }))
    .sort((a, b) => b.count - a.count || a.suspect.localeCompare(b.suspect));

  // Experiential warning: a "missing information" complaint shared by ≥ half the panel.
  const missingCounts = new Map<string, number>();
  for (const g of guesses) {
    for (const m of new Set((g.missingInformation ?? []).map((s) => s.trim()).filter(Boolean))) {
      missingCounts.set(m, (missingCounts.get(m) ?? 0) + 1);
    }
  }
  const experientialWarnings = [...missingCounts.entries()]
    .filter(([, count]) => panelSize > 0 && count / panelSize >= 0.5)
    .sort((a, b) => b[1] - a[1])
    .map(([m, count]) => `${count}/${panelSize} readers wanted: ${m}`);

  return { panelSize, solveRate, difficulty, wrongConvergence, experientialWarnings };
}

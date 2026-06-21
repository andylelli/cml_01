/**
 * The propose → verify → repair loop (§4.4 / §9.1 spike steps 2–3).
 *
 * `certify()` is the verifier; this is the loop that drives a *proposer* against it until the case
 * holds a clean certificate or a turn budget is exhausted. The proposer is injectable — a mock in
 * tests (proves the control flow converges, offline), the real model in the live harness
 * (`scripts/cml-core-certify-loop.mjs`).
 *
 * The action space is deliberately CONSTRAINED to *adding facts* and re-pointing premises. There is
 * **no "remove suspect" operation** — so a model cannot "fix" non-uniqueness by deleting the spare
 * suspect (one of §9.1's explicit falsification guards); it must add a discriminating clue.
 *
 * Pure: no LLM dependency, no I/O. The loop and its guards are unit-tested with a mock proposer.
 */

import type { CapabilityObservation, FairPlayCertificate, PresenceObservation, TypedCml } from "./types.js";
import { certify } from "./certify.js";

export type RepairAction =
  | { op: "add_presence_clue"; clue: PresenceObservation }
  | { op: "attach_premise"; stepId: string; clueId: string }
  | {
      // Higher-level repair: the model supplies the LOGIC (who to alibi, where, when) and the
      // solver does the bookkeeping (mint the clue + attach it to the step that eliminates them).
      // §9.6 #4: "what the LLM proposes vs what the solver fills."
      op: "eliminate_suspect";
      suspectId: string;
      location: string;
      interval: { start: number; end: number };
      availableByStep?: number;
      worded?: string;
    }
  | {
      // Contradiction-safe alibi: WIDEN the suspect's EXISTING presence at a location to cover the
      // window (or add one if none), then attach it to the eliminating step. Because it extends a
      // known whereabouts instead of inventing a new conflicting one, it cannot create a
      // "two places at once" timeline contradiction — the failure both gpt-4o-mini and gpt-4.1 hit.
      op: "extend_presence";
      suspectId: string;
      location: string;
      interval: { start: number; end: number };
      availableByStep?: number;
      worded?: string;
    }
  | {
      // Capability/access repair: establish that a suspect LACKS (has=false) a capability the crime
      // required — the locked-room / unique-means analogue of an alibi. Auto-attaches to the
      // unique_capability step that eliminates them.
      op: "establish_capability";
      suspectId: string;
      capability: string;
      has: boolean;
      availableByStep?: number;
      worded?: string;
    }
  | { op: "set_culprit"; culpritId: string }
  | { op: "give_up"; reason?: string };

export interface LoopState {
  turn: number;
  cml: TypedCml;
  certificate: FairPlayCertificate;
}

/** Returns the next repair action given the current state (sync or async). */
export type Proposer = (state: LoopState) => Promise<RepairAction> | RepairAction;

export type StopReason = "converged" | "gave_up" | "budget_exhausted" | "no_progress" | "invalid_action";

export interface LoopTurn {
  turn: number;
  action: RepairAction;
  ok: boolean;
  failures: string[];
}

export interface LoopResult {
  converged: boolean;
  turns: number;
  cml: TypedCml;
  certificate: FairPlayCertificate;
  history: LoopTurn[];
  stoppedReason: StopReason;
}

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

/** Apply a constrained repair action to a CML, returning a new CML (never mutates the input). */
export function applyAction(cml: TypedCml, action: RepairAction): TypedCml {
  const next = clone(cml);
  switch (action.op) {
    case "add_presence_clue":
      if (!next.clues.some((c) => c.id === action.clue.id)) next.clues.push(action.clue);
      break;
    case "attach_premise": {
      const step = next.inferencePath.find((e) => e.id === action.stepId);
      if (step && !step.from.includes(action.clueId)) step.from.push(action.clueId);
      break;
    }
    case "eliminate_suspect": {
      const elimStep = next.inferencePath.find(
        (e) => (e.rule === "access_impossible" || e.rule === "alibi_contradiction") && e.eliminates === action.suspectId,
      );
      const stepIndex = elimStep ? next.inferencePath.indexOf(elimStep) + 1 : 1;
      const id = `clue_${action.suspectId}_${action.location}_${action.interval.start}_${action.interval.end}`;
      if (!next.clues.some((c) => c.id === id)) {
        next.clues.push({
          kind: "presence",
          id,
          person: action.suspectId,
          location: action.location,
          interval: action.interval,
          availableByStep: action.availableByStep ?? stepIndex,
          worded: action.worded ?? `${action.suspectId} was at ${action.location} for the crime window.`,
        });
      }
      if (elimStep && !elimStep.from.includes(id)) elimStep.from.push(id);
      break;
    }
    case "extend_presence": {
      const elimStep = next.inferencePath.find(
        (e) => (e.rule === "access_impossible" || e.rule === "alibi_contradiction") && e.eliminates === action.suspectId,
      );
      const stepIndex = elimStep ? next.inferencePath.indexOf(elimStep) + 1 : 1;
      const existing = next.clues.find(
        (c): c is PresenceObservation =>
          c.kind === "presence" && c.person === action.suspectId && c.location === action.location,
      );
      let clueId: string;
      if (existing) {
        // widen the known presence to cover the union (never narrows, never conflicts)
        existing.interval = {
          start: Math.min(existing.interval.start, action.interval.start),
          end: Math.max(existing.interval.end, action.interval.end),
        };
        if (existing.availableByStep > stepIndex) existing.availableByStep = stepIndex;
        clueId = existing.id;
      } else {
        clueId = `clue_${action.suspectId}_${action.location}_ext`;
        next.clues.push({
          kind: "presence",
          id: clueId,
          person: action.suspectId,
          location: action.location,
          interval: action.interval,
          availableByStep: action.availableByStep ?? stepIndex,
          worded: action.worded ?? `${action.suspectId} was at ${action.location} for the crime window.`,
        });
      }
      if (elimStep && !elimStep.from.includes(clueId)) elimStep.from.push(clueId);
      break;
    }
    case "establish_capability": {
      // find-or-create the unique_capability step that eliminates this suspect (a broken case may
      // not yet have a step for the spare — the repair must add both the clue AND the step).
      let elimStep = next.inferencePath.find((e) => e.rule === "unique_capability" && e.eliminates === action.suspectId);
      if (!elimStep) {
        elimStep = { id: `e_${action.suspectId}_capability`, rule: "unique_capability", from: [], eliminates: action.suspectId };
        next.inferencePath.push(elimStep);
      }
      const stepIndex = next.inferencePath.indexOf(elimStep) + 1;
      const id = `clue_${action.suspectId}_${action.capability}_${action.has ? "has" : "lacks"}`;
      if (!next.clues.some((c) => c.id === id)) {
        const obs: CapabilityObservation = {
          kind: "capability",
          id,
          person: action.suspectId,
          capability: action.capability,
          has: action.has,
          availableByStep: action.availableByStep ?? stepIndex,
          worded: action.worded ?? `${action.suspectId} ${action.has ? "has" : "lacks"} ${action.capability}.`,
        };
        next.clues.push(obs);
      }
      if (!elimStep.from.includes(id)) elimStep.from.push(id);
      break;
    }
    case "set_culprit":
      next.solution.culpritId = action.culpritId;
      break;
    case "give_up":
      break;
  }
  return next;
}

/**
 * Run the loop from `initial` until certified or stopped. `maxTurns` bounds the search (§9.1: the
 * loop must converge in a bounded number of turns and never exit *without* a certificate it claims
 * to have). A repeated failure signature trips the `no_progress` guard before the hard budget.
 */
export async function runCertifyLoop(
  initial: TypedCml,
  propose: Proposer,
  opts: { maxTurns?: number } = {},
): Promise<LoopResult> {
  const maxTurns = opts.maxTurns ?? 5;
  let cml = clone(initial);
  let certificate = certify(cml);
  const history: LoopTurn[] = [];

  if (certificate.ok) {
    return { converged: true, turns: 0, cml, certificate, history, stoppedReason: "converged" };
  }

  const seenFailureSignatures = new Set<string>([JSON.stringify(certificate.failures)]);

  for (let turn = 1; turn <= maxTurns; turn++) {
    const action = await propose({ turn, cml, certificate });

    if (action.op === "give_up") {
      history.push({ turn, action, ok: false, failures: certificate.failures });
      return { converged: false, turns: turn, cml, certificate, history, stoppedReason: "gave_up" };
    }

    cml = applyAction(cml, action);
    certificate = certify(cml);
    history.push({ turn, action, ok: certificate.ok, failures: certificate.failures });

    if (certificate.ok) {
      return { converged: true, turns: turn, cml, certificate, history, stoppedReason: "converged" };
    }

    const sig = JSON.stringify(certificate.failures);
    if (seenFailureSignatures.has(sig)) {
      // the action did not change the verdict — the proposer is stuck/oscillating
      return { converged: false, turns: turn, cml, certificate, history, stoppedReason: "no_progress" };
    }
    seenFailureSignatures.add(sig);
  }

  return { converged: false, turns: maxTurns, cml, certificate, history, stoppedReason: "budget_exhausted" };
}

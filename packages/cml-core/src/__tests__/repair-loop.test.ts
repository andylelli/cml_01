import { describe, expect, it, vi } from "vitest";
import { runCertifyLoop, type LoopState, type RepairAction } from "../repair-loop.js";
import { certify } from "../certify.js";
import { clockSetFastBroken, clockSetFastRepaired } from "../fixtures/clock-set-fast.js";
import { lockedStudyBroken } from "../fixtures/broadened.js";

/**
 * A state-driven mock standing in for the model: it READS the certifier's failures and proposes
 * the §4.6 repair (add the station-master clue, then attach it as Step 3's premise). This proves
 * the propose→verify→repair control flow converges, without a live model.
 */
const smartProposer = (state: LoopState): RepairAction => {
  const f = state.certificate.failures.join(" ");
  const hasPlatform = state.cml.clues.some((c) => c.id === "clue_vale_platform");
  if (!hasPlatform && /SOLUTION_NOT_UNIQUE|UNSOUND/i.test(f) && /vale/i.test(f)) {
    return {
      op: "add_presence_clue",
      clue: {
        kind: "presence",
        id: "clue_vale_platform",
        person: "vale",
        location: "station",
        interval: { start: 480, end: 492 },
        availableByStep: 3,
        worded: "The station-master confirms Vale on the platform 08:00–08:12.",
      },
    };
  }
  const step3 = state.cml.inferencePath.find((e) => e.id === "step3_vale");
  if (step3 && !step3.from.includes("clue_vale_platform")) {
    return { op: "attach_premise", stepId: "step3_vale", clueId: "clue_vale_platform" };
  }
  return { op: "give_up", reason: "no further repair known" };
};

describe("certify repair loop — convergence (§9.1 spike step 3)", () => {
  it("drives the broken §4.6 case to a clean certificate within the turn budget", async () => {
    const result = await runCertifyLoop(clockSetFastBroken(), smartProposer, { maxTurns: 5 });
    expect(result.converged).toBe(true);
    expect(result.stoppedReason).toBe("converged");
    expect(result.turns).toBeLessThanOrEqual(2);
    expect(result.certificate.ok).toBe(true);
    expect(result.certificate.uniqueAmong).toEqual(["carrow"]);
    // it converged by ADDING a discriminating clue, not by deleting a suspect
    expect(result.cml.entities.filter((e) => e.kind === "person" && e.role === "suspect")).toHaveLength(3);
  });

  it("converges in ONE turn via the higher-level eliminate_suspect op (solver does the bookkeeping)", async () => {
    const oneShot = (state: LoopState): RepairAction =>
      ({ op: "eliminate_suspect", suspectId: "vale", location: "station", interval: { start: 480, end: 492 } });
    const result = await runCertifyLoop(clockSetFastBroken(), oneShot, { maxTurns: 5 });
    expect(result.converged).toBe(true);
    expect(result.turns).toBe(1);
    expect(result.certificate.ok).toBe(true);
    expect(result.certificate.uniqueAmong).toEqual(["carrow"]);
  });

  it("extend_presence reconciles with existing evidence: converges in ONE turn, no contradiction", async () => {
    // This is the fix for the live-spike failure: instead of inventing `vale@away` (which
    // contradicts the existing `vale@station[492,492]` boarding clue), extend Vale's STATION
    // presence to cover the window. One turn, and re-certify is clean (no timeline violation).
    const extend = (state: LoopState): RepairAction =>
      ({ op: "extend_presence", suspectId: "vale", location: "station", interval: { start: 480, end: 492 } });
    const result = await runCertifyLoop(clockSetFastBroken(), extend, { maxTurns: 5 });
    expect(result.converged).toBe(true);
    expect(result.turns).toBe(1);
    expect(result.certificate.ok).toBe(true);
    expect(certify(result.cml).ok).toBe(true);
    // Vale has exactly one presence (the widened station one) — no "two places at once".
    const valePresence = result.cml.clues.filter((c) => c.kind === "presence" && c.person === "vale");
    expect(valePresence).toHaveLength(1);
    expect(valePresence[0].kind === "presence" && valePresence[0].interval).toEqual({ start: 480, end: 492 });
  });

  it("eliminate_suspect at a REACHABLE location does NOT converge (it isn't a real alibi)", async () => {
    const wrong = (state: LoopState): RepairAction =>
      ({ op: "eliminate_suspect", suspectId: "vale", location: "kitchen", interval: { start: 480, end: 492 } });
    const result = await runCertifyLoop(clockSetFastBroken(), wrong, { maxTurns: 5 });
    expect(result.converged).toBe(false); // kitchen is reachable from the study
  });

  it("repairs a CAPABILITY non-unique case (locked room) via establish_capability in one turn", async () => {
    // The loop generalises beyond timing: alibi the spare (Dunmore) by proving he lacked a key.
    const proposer = (state: LoopState): RepairAction =>
      ({ op: "establish_capability", suspectId: "dunmore", capability: "key_to_study", has: false });
    const result = await runCertifyLoop(lockedStudyBroken(), proposer, { maxTurns: 5 });
    expect(result.converged).toBe(true);
    expect(result.turns).toBe(1);
    expect(result.certificate.ok).toBe(true);
    expect(result.certificate.uniqueAmong).toEqual(["reeve"]);
    expect(certify(result.cml).ok).toBe(true);
  });

  it("returns immediately (0 turns) when the case is already certified", async () => {
    const proposer = vi.fn();
    const result = await runCertifyLoop(clockSetFastRepaired(), proposer, { maxTurns: 5 });
    expect(result.converged).toBe(true);
    expect(result.turns).toBe(0);
    expect(proposer).not.toHaveBeenCalled();
  });

  it("re-running certify on the loop's output independently confirms ok (no self-agreement)", async () => {
    const result = await runCertifyLoop(clockSetFastBroken(), smartProposer, { maxTurns: 5 });
    expect(certify(result.cml).ok).toBe(true);
  });
});

describe("certify repair loop — falsification guards (§9.1 kill signals)", () => {
  it("CANNOT 'fix' non-uniqueness by renaming the culprit (the spare survives)", async () => {
    // A model that keeps flipping the named culprit between the two consistent suspects never
    // converges — because uniqueness depends on the CLUES, not on who is named.
    const flipCulprit = (state: LoopState): RepairAction => ({
      op: "set_culprit",
      culpritId: state.cml.solution.culpritId === "carrow" ? "vale" : "carrow",
    });
    const result = await runCertifyLoop(clockSetFastBroken(), flipCulprit, { maxTurns: 5 });
    expect(result.converged).toBe(false);
    expect(result.certificate.ok).toBe(false);
  });

  it("there is no action that removes a suspect (delete-the-spare cheat is unrepresentable)", async () => {
    // The action space has no remove op; assert the loop never drops a suspect.
    const result = await runCertifyLoop(clockSetFastBroken(), smartProposer, { maxTurns: 5 });
    const suspects = result.cml.entities.filter((e) => e.kind === "person" && e.role === "suspect");
    expect(suspects.map((s) => s.id).sort()).toEqual(["carrow", "hartwell", "vale"]);
  });

  it("stops with `no_progress` when the proposer repeats an ineffective action", async () => {
    const noop = (state: LoopState): RepairAction => ({ op: "set_culprit", culpritId: state.cml.solution.culpritId });
    const result = await runCertifyLoop(clockSetFastBroken(), noop, { maxTurns: 5 });
    expect(result.converged).toBe(false);
    expect(result.stoppedReason).toBe("no_progress");
  });

  it("honors `give_up` and never claims a certificate it does not have", async () => {
    const giveUp = (): RepairAction => ({ op: "give_up", reason: "stuck" });
    const result = await runCertifyLoop(clockSetFastBroken(), giveUp, { maxTurns: 5 });
    expect(result.converged).toBe(false);
    expect(result.stoppedReason).toBe("gave_up");
    expect(result.certificate.ok).toBe(false);
  });

  it("never exceeds the turn budget", async () => {
    // a proposer that makes a different-but-useless change each turn must still stop at maxTurns
    let n = 0;
    const churn = (): RepairAction => ({
      op: "add_presence_clue",
      clue: { kind: "presence", id: `junk_${n++}`, person: "hartwell", location: "kitchen", interval: { start: 1, end: 2 }, availableByStep: 1, worded: "" },
    });
    const result = await runCertifyLoop(clockSetFastBroken(), churn, { maxTurns: 3 });
    expect(result.turns).toBeLessThanOrEqual(3);
    expect(result.converged).toBe(false);
  });
});

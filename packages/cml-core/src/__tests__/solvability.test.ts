import { describe, expect, it } from "vitest";
import { proveSolvability, summarizeDifficulty, type PanelGuess } from "../solvability.js";
import { certify } from "../certify.js";
import { clockSetFastBroken, clockSetFastRepaired } from "../fixtures/clock-set-fast.js";
import {
  largeCircleUnique,
  lockedStudyBroken,
  lockedStudyRepaired,
  uniqueMeansBroken,
  uniqueMeansRepaired,
} from "../fixtures/broadened.js";

const ALL_FIXTURES = {
  clockSetFastBroken,
  clockSetFastRepaired,
  largeCircleUnique,
  lockedStudyBroken,
  lockedStudyRepaired,
  uniqueMeansBroken,
  uniqueMeansRepaired,
};

describe("proveSolvability — correctness verdict (§4.1)", () => {
  it("certifies the repaired worked example as solvable, with a clean proof trace", () => {
    const proof = proveSolvability(clockSetFastRepaired());
    expect(proof.solvable).toBe(true);
    expect(proof.culprit).toBe("carrow");
    expect(proof.uniqueAmong).toEqual(["carrow"]);
    expect(proof.temporalViolations).toEqual([]);
    expect(proof.parityViolations).toEqual([]);
    expect(proof.defect).toBeUndefined();
    // the proof trace names the eliminated non-culprits
    expect(proof.eliminated.map((e) => e.suspect).sort()).toEqual(["hartwell", "vale"]);
  });

  it("a non-unique case is NOT solvable and routes one defect to agent3 (the logic)", () => {
    const proof = proveSolvability(clockSetFastBroken());
    expect(proof.solvable).toBe(false);
    expect(proof.uniqueAmong.length).toBeGreaterThan(1); // {carrow, vale} both survive
    expect(proof.temporalViolations).toEqual([]); // not a placement problem
    expect(proof.defect?.owner).toBe("agent3");
    expect(proof.defect?.obligation).toBeTruthy();
  });
});

describe("proveSolvability — §9.4 checker-correctness fixtures", () => {
  it("a clue consumed before the reader has it yields exactly one temporalViolation, owned by agent5", () => {
    const cml = clockSetFastRepaired();
    // The time-correction clue is consumed at step 1, but mark it first-visible at step 3.
    const clock = cml.clues.find((c) => c.id === "clue_clock")!;
    clock.availableByStep = 3;

    const proof = proveSolvability(cml);
    expect(proof.temporalViolations).toEqual([
      { stepIndex: 1, needsClue: "clue_clock", firstVisibleAtStep: 3 },
    ]);
    expect(proof.solvable).toBe(false);
    expect(proof.defect?.owner).toBe("agent5"); // a placement/exposure gap, not a logic gap
  });

  it("the proof's verdict ALWAYS agrees with certify() across every fixture (faithful adapter, not a parallel prover)", () => {
    for (const [name, make] of Object.entries(ALL_FIXTURES)) {
      const cml = make();
      const proof = proveSolvability(cml);
      const cert = certify(cml);
      expect(proof.solvable, name).toBe(cert.ok);
      expect(proof.culprit, name).toBe(cert.culpritId);
      expect(proof.uniqueAmong, name).toEqual(cert.uniqueAmong);
    }
  });
});

describe("proveSolvability — §9.4 determinism invariant (the category-error fix)", () => {
  it("is byte-identical across 10 runs on the same case (no stochastic bad day)", () => {
    const cml = clockSetFastRepaired();
    const first = JSON.stringify(proveSolvability(cml));
    for (let i = 0; i < 10; i++) {
      expect(JSON.stringify(proveSolvability(cml))).toBe(first);
    }
  });

  it("is pure: equivalent fresh inputs produce identical proofs", () => {
    expect(JSON.stringify(proveSolvability(clockSetFastRepaired()))).toBe(
      JSON.stringify(proveSolvability(clockSetFastRepaired())),
    );
  });
});

describe("summarizeDifficulty — the panel half (§4.2): metadata, never a gate", () => {
  const culprit = "John Avery";
  const guess = (persona: string, suspect: string, missing: string[] = []): PanelGuess => ({
    persona,
    suspectedCulprit: suspect,
    confidence: "likely",
    missingInformation: missing,
  });

  it("5/5 solved → trivial", () => {
    const r = summarizeDifficulty(Array.from({ length: 5 }, (_, i) => guess(`p${i}`, "John Avery")), culprit);
    expect(r.solveRate).toBe(1);
    expect(r.difficulty).toBe("trivial");
  });

  it("0/5 solved → obscure, and converges on the wrong suspect (red-herring signal)", () => {
    const r = summarizeDifficulty(Array.from({ length: 5 }, (_, i) => guess(`p${i}`, "the rival")), culprit);
    expect(r.solveRate).toBe(0);
    expect(r.difficulty).toBe("obscure");
    expect(r.wrongConvergence[0]).toEqual({ suspect: "the rival", count: 5 });
  });

  it("2/5 solved → hard (the satisfying band)", () => {
    const r = summarizeDifficulty(
      [guess("a", "John Avery"), guess("b", "Avery"), guess("c", "the rival"), guess("d", "the maid"), guess("e", "the rival")],
      culprit,
    );
    expect(r.solveRate).toBeCloseTo(0.4);
    expect(r.difficulty).toBe("hard");
  });

  it("loose name match: 'Avery' counts as solving 'John Avery'", () => {
    const r = summarizeDifficulty([guess("a", "Avery")], culprit);
    expect(r.solveRate).toBe(1);
  });

  it("surfaces an experiential warning shared by ≥ half the panel", () => {
    const r = summarizeDifficulty(
      [
        guess("a", "the rival", ["why the clock was reset"]),
        guess("b", "the rival", ["why the clock was reset"]),
        guess("c", "John Avery", []),
      ],
      culprit,
    );
    expect(r.experientialWarnings.some((w) => w.includes("why the clock was reset"))).toBe(true);
  });

  it("an empty panel is well-defined (obscure, no throw)", () => {
    const r = summarizeDifficulty([], culprit);
    expect(r).toMatchObject({ panelSize: 0, solveRate: 0, difficulty: "obscure", wrongConvergence: [] });
  });
});

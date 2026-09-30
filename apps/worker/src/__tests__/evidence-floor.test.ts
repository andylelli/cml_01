import { describe, expect, it } from "vitest";
import { DISCRIMINATING_EVIDENCE_MIN, ensureDiscriminatingEvidenceFloor } from "../jobs/clue-contracts/evidence-floor.js";

/** Owner decision 6 (A5-Q05): discriminating_test.evidence_clues holds at least two, set before Agent 6 audits. */
const clues = () => ({
  clues: [
    { id: "clue_clock_face", description: "The clock face shows tampering marks", placement: "early", criticality: "essential" },
    { id: "clue_witness_timing", description: "A witness heard the clock chime late", placement: "mid", criticality: "essential" },
    { id: "clue_teacup", description: "A teacup on the sill", placement: "mid", criticality: "supporting" },
    { id: "clue_late_note", description: "A note found later", placement: "late", criticality: "optional" },
  ],
}) as any;
const cmlWith = (evidence: unknown[]) => ({
  CASE: { discriminating_test: { design: "Compare the clock face with the witness timing", evidence_clues: evidence } },
}) as any;

describe("ensureDiscriminatingEvidenceFloor", () => {
  it("the floor is two", () => { expect(DISCRIMINATING_EVIDENCE_MIN).toBe(2); });

  it("tops an empty list up to two early/mid candidates", () => {
    const cml = cmlWith([]);
    const added = ensureDiscriminatingEvidenceFloor(cml, clues());
    expect(added).toHaveLength(2);
    expect(cml.CASE.discriminating_test.evidence_clues).toEqual(added);
    expect(added).not.toContain("clue_late_note");
  });

  it("keeps an existing id first and adds one", () => {
    const cml = cmlWith(["clue_teacup"]);
    const added = ensureDiscriminatingEvidenceFloor(cml, clues());
    expect(added).toHaveLength(1);
    expect(cml.CASE.discriminating_test.evidence_clues).toEqual(["clue_teacup", added[0]]);
  });

  it("never writes when the floor already holds (the field is read-only past Agent 5)", () => {
    const cml = cmlWith(["clue_teacup", "clue_late_note"]);
    const before = cml.CASE.discriminating_test.evidence_clues;
    expect(ensureDiscriminatingEvidenceFloor(cml, clues())).toEqual([]);
    expect(cml.CASE.discriminating_test.evidence_clues).toBe(before);
  });

  it("adds nothing when no canonical clue exists (the zero-evidence gate still reports it)", () => {
    const cml = cmlWith([]);
    expect(ensureDiscriminatingEvidenceFloor(cml, { clues: [] } as any)).toEqual([]);
    expect(cml.CASE.discriminating_test.evidence_clues).toEqual([]);
  });
});

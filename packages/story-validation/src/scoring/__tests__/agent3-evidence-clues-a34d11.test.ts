import { afterEach, describe, expect, it } from "vitest";
import { scoreRealCml } from "../phase-scorers/agent3-cml-real-scorer.js";

/** A34-D11: with CML_VERIFIED_FIXES on, an empty evidence_clues at Agent 3 is what the skeleton asks for. */
const cml = (evidence: string[]) => ({ CASE: {
  cast: [{ name: "A" }, { name: "B" }], closed_circle: { suspects: ["A", "B"] }, culpability: { culprits: ["A"] },
  discriminating_test: { design: "the clock is wound", knowledge_revealed: "it was wound after nine", evidence_clues: evidence },
} });
const dtTest = (c: unknown) => scoreRealCml(c).tests.find((t) => t.name === "Discriminating test")!;
afterEach(() => { delete process.env.CML_VERIFIED_FIXES; });

describe("Agent 3's discriminating-test check and an empty evidence_clues", () => {
  it("OFF: empty evidence_clues fails (unchanged)", () => {
    expect(dtTest(cml([])).passed).toBe(false);
    expect(dtTest(cml(["clue_1"])).passed).toBe(true);
  });
  it("ON: empty evidence_clues passes; a missing design still fails", () => {
    process.env.CML_VERIFIED_FIXES = "1";
    expect(dtTest(cml([])).passed).toBe(true);
    const noDesign = cml([]); (noDesign.CASE.discriminating_test as any).design = "";
    expect(dtTest(noDesign).passed).toBe(false);
  });
});

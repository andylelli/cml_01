import { describe, expect, it } from "vitest";
import { caseOf } from "../case-view.js";

// A5-04 / A6-18 — caseOf is `(cml as any)?.CASE ?? cml`, typed: same reference, no defaults.
describe("caseOf", () => {
  const legacy = (cml: any) => cml?.CASE ?? cml;

  it("unwraps a { CASE } wrapper to the same reference", () => {
    const inner = { cast: [{ name: "A" }] };
    const wrapped = { CASE: inner };
    expect(caseOf(wrapped)).toBe(inner);
  });

  it("returns a bare case block itself", () => {
    const bare = { culpability: { culprits: ["A"] } };
    expect(caseOf(bare)).toBe(bare);
  });

  it("lets a caller's mutation reach the original CML", () => {
    const cml = { CASE: { discriminating_test: { design: "d" } } } as any;
    caseOf(cml).discriminating_test!.evidence_clues = ["clue_1"];
    expect(cml.CASE.discriminating_test.evidence_clues).toEqual(["clue_1"]);
  });

  it("matches the legacy expression on every edge input", () => {
    const inputs = [undefined, null, "", "text", 0, 7, false, [], {}, { CASE: null }, { CASE: undefined }, { CASE: 0 }, { CASE: "" }, { CASE: false }];
    for (const input of inputs) expect(caseOf(input)).toBe(legacy(input));
  });
});

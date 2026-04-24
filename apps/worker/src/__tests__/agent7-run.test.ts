import { describe, expect, it } from "vitest";
import { computeDeterministicGapFillCap } from "../jobs/agents/agent7-run.js";

describe("agent7 deterministic pacing cap", () => {
  it("keeps a minimum cap of 3 for short outlines", () => {
    expect(computeDeterministicGapFillCap(0)).toBe(3);
    expect(computeDeterministicGapFillCap(8)).toBe(3);
  });

  it("scales cap for medium outlines", () => {
    expect(computeDeterministicGapFillCap(19)).toBe(5);
    expect(computeDeterministicGapFillCap(24)).toBe(6);
  });

  it("caps deterministic fill at 8 for large outlines", () => {
    expect(computeDeterministicGapFillCap(40)).toBe(8);
    expect(computeDeterministicGapFillCap(80)).toBe(8);
  });
});

/**
 * P2.2 (ANALYSIS_50 / T2.4) unit tests for the Agent 3b plausibility judge pure helpers:
 * mode parsing (default OFF), the ≥80 floor gate, the prompt shape, and feedback de-duplication.
 * The LLM call itself (judgeMechanismPlausibility) is covered by the worker run-flow tests.
 */
import { describe, expect, it } from "vitest";
import {
  AGENT3B_PLAUSIBILITY_FLOOR,
  parsePlausibilityJudgeMode,
  plausibilityGatePass,
  buildPlausibilityJudgePrompt,
  buildPlausibilityJudgeFeedback,
  type PlausibilityJudgeResult,
} from "../agent3b-plausibility-judge.js";
import type { HardLogicDeviceIdea } from "../types.js";

const device: HardLogicDeviceIdea = {
  title: "The Reversed Pendulum",
  corePrinciple: "Thermal expansion of a brass rod alters a pendulum's period",
  principleType: "physical_law",
  surfaceIllusion: "The clock appears to run backward",
  underlyingReality: "A heated brass rod lengthens, slowing the pendulum measurably",
  fairPlayClues: ["a warm radiator beside the clock"],
  whyNotTrope: "Uses real thermal physics, not a stock secret panel",
  variationEscalation: "Add a second heat source",
  mechanismFamilyHints: ["thermal"],
};

describe("parsePlausibilityJudgeMode", () => {
  it("defaults to off for unset/empty/off/false/0", () => {
    expect(parsePlausibilityJudgeMode(undefined)).toBe("off");
    expect(parsePlausibilityJudgeMode("")).toBe("off");
    expect(parsePlausibilityJudgeMode("OFF")).toBe("off");
    expect(parsePlausibilityJudgeMode("false")).toBe("off");
    expect(parsePlausibilityJudgeMode("0")).toBe("off");
  });
  it("maps enforce and treats other truthy values as shadow", () => {
    expect(parsePlausibilityJudgeMode("enforce")).toBe("enforce");
    expect(parsePlausibilityJudgeMode("shadow")).toBe("shadow");
    expect(parsePlausibilityJudgeMode("on")).toBe("shadow");
  });
});

describe("plausibilityGatePass", () => {
  it("passes at/above the floor and fails below or for non-finite", () => {
    expect(AGENT3B_PLAUSIBILITY_FLOOR).toBe(80);
    expect(plausibilityGatePass(80)).toBe(true);
    expect(plausibilityGatePass(100)).toBe(true);
    expect(plausibilityGatePass(79)).toBe(false);
    expect(plausibilityGatePass(0)).toBe(false);
    expect(plausibilityGatePass(NaN)).toBe(false);
  });
});

describe("buildPlausibilityJudgePrompt", () => {
  it("asks one feasibility question grounded in era + the underlying reality, JSON only", () => {
    const { system, user } = buildPlausibilityJudgePrompt(device, {
      decade: "1930s",
      location: "a country manor",
      institution: "private estate",
    });
    expect(system).toMatch(/strict JSON/i);
    expect(system).toMatch(/score/);
    expect(user).toMatch(/1930s/);
    expect(user).toContain(device.underlyingReality);
    expect(user).toMatch(/does this mechanism actually work/i);
  });
});

describe("buildPlausibilityJudgeFeedback", () => {
  it("cites the score, the floor, and de-duplicates reasons/suggestions", () => {
    const result: PlausibilityJudgeResult = {
      ran: true,
      score: 55,
      verdict: "fail",
      reasons: ["A pendulum does not run backward", "A pendulum does not run backward"],
      suggestions: ["Use a thermal effect with the right magnitude"],
      cost: 0,
      durationMs: 0,
    };
    const fb = buildPlausibilityJudgeFeedback(result);
    expect(fb).toMatch(/55\/100/);
    expect(fb).toMatch(/floor 80/);
    // de-dup: the repeated reason appears exactly once
    expect(fb.match(/does not run backward/g)?.length).toBe(1);
    expect(fb).toMatch(/Fix: Use a thermal effect/);
  });
});

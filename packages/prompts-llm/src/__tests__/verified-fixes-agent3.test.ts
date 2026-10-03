import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildCMLPrompt } from "../agent3-cml.ts";
import { buildHardLogicDevicePrompt, extractThemeMechanismFamilies, themeWithoutRetryFeedback } from "../agent3b-hard-logic-devices.ts";

const FLAG = "CML_VERIFIED_FIXES";
let saved: string | undefined;
beforeEach(() => { saved = process.env[FLAG]; delete process.env[FLAG]; });
afterEach(() => { if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved; });

const baseInput = {
  decade: "1930s", location: "Yorkshire", institution: "manor house", tone: "classic", weather: "misty",
  socialStructure: "gentry and staff", theme: "deception", primaryAxis: "temporal" as const, castSize: 4,
  castNames: ["Iwan Hale", "Agnes Pike", "Marta Dean", "Reid Shaw"], detectiveType: "inspector",
  victimArchetype: "industrialist", complexityLevel: "moderate" as const, mechanismFamilies: ["clockwork tampering"],
  runId: "run-test", projectId: "proj-test",
};

const OLD_CONSTRAINT = "- Ensure discriminating_test.evidence_clues is non-empty and each clue ID appears in prose_requirements.clue_to_scene_mapping.";
const OLD_RULE_E = "    e. EVIDENCE TRACEABILITY: discriminating_test.evidence_clues MUST be a non-empty array of clue IDs and each listed clue ID must appear in prose_requirements.clue_to_scene_mapping.";

describe("A34-D11 — evidence_clues rules agree with the skeleton (owner decision 12)", () => {
  const text = (p: ReturnType<typeof buildCMLPrompt>) => p.messages.map((m) => m.content).join("\n");

  it("flag OFF: the two non-empty rules are still in the prompt, verbatim", () => {
    const all = text(buildCMLPrompt(baseInput as any));
    expect(all).toContain(OLD_CONSTRAINT);
    expect(all).toContain(OLD_RULE_E);
    expect(all).toContain("evidence_clues: []");
  });

  it("flag ON: no rule demands a non-empty evidence_clues; the skeleton is unchanged", () => {
    const off = text(buildCMLPrompt(baseInput as any));
    process.env[FLAG] = "1";
    const on = text(buildCMLPrompt(baseInput as any));
    expect(on).not.toContain(OLD_CONSTRAINT);
    expect(on).not.toContain(OLD_RULE_E);
    expect(on).not.toMatch(/evidence_clues (is|MUST be a) non-empty/);
    expect(on).toContain("Agent 5 back-fills it with the planted clue IDs");
    expect(on).toContain("evidence_clues: []");
    // Only the two rule lines move.
    const diff = (a: string, b: string) => a.split("\n").filter((l) => !b.split("\n").includes(l));
    expect(diff(off, on).length).toBe(2 * (off.split(OLD_CONSTRAINT).length - 1));
  });
});

describe("A34-09 — theme families ignore the appended retry feedback (unflagged)", () => {
  const theme = "a country-house murder among rival heirs";
  const withFeedback = `${theme}\n\nRetry guidance:\nThe clock-tampering device was implausible; do not use poison.`;

  it("strips exactly the appendRetryFeedback block", () => {
    expect(themeWithoutRetryFeedback(theme)).toBe(theme);
    expect(themeWithoutRetryFeedback(withFeedback)).toBe(theme);
    expect(themeWithoutRetryFeedback("Retry guidance:\nuse a clock")).toBe("");
    expect(themeWithoutRetryFeedback(undefined)).toBeUndefined();
  });

  const inputs3b = { decade: "1940s", location: "a seaside hotel", institution: "hotel", tone: "Classic", primaryAxis: "temporal" as const };

  it("feedback words no longer lock an open theme to a mechanism family", () => {
    // Known-positive: the raw (feedback-polluted) theme DOES name a family.
    expect(extractThemeMechanismFamilies(withFeedback).length).toBeGreaterThan(0);
    const { developer } = buildHardLogicDevicePrompt({ ...inputs3b, theme: withFeedback } as any);
    expect(developer).not.toContain("LOCKED THEME — PRIMARY DEVICE CONSTRAINT");
  });

  it("a call with no feedback is unchanged: a committed theme still locks", () => {
    const { developer } = buildHardLogicDevicePrompt({ ...inputs3b, theme: "a mechanical clock-tampering murder" } as any);
    expect(developer).toContain("LOCKED THEME — PRIMARY DEVICE CONSTRAINT");
    expect(developer).toContain('(from the theme: "a mechanical clock-tampering murder")');
  });
});

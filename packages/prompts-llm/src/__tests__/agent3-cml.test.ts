import { describe, expect, it } from "vitest";
import { buildCMLPrompt } from "../agent3-cml.ts";

describe("agent3 cml prompt required-evidence hardening", () => {
  const baseInput = {
    decade: "1930s",
    location: "Yorkshire",
    institution: "manor house",
    tone: "classic",
    weather: "misty",
    socialStructure: "gentry and staff",
    theme: "deception",
    primaryAxis: "temporal" as const,
    castSize: 4,
    castNames: ["Iwan Hale", "Agnes Pike", "Marta Dean", "Reid Shaw"],
    detectiveType: "inspector",
    victimArchetype: "industrialist",
    complexityLevel: "moderate" as const,
    mechanismFamilies: ["clockwork tampering"],
    runId: "run-test",
    projectId: "proj-test",
  };

  it("includes explicit anti-abstractness contract for required_evidence in developer prompt", () => {
    const prompt = buildCMLPrompt(baseInput);

    expect(prompt.developer).toContain("REQUIRED_EVIDENCE ANTI-ABSTRACTNESS CONTRACT");
    expect(prompt.developer).toContain("Reject placeholders and generic summaries");
    expect(prompt.developer).toContain("If a step cannot be supported by 2-4 concrete entries");
  });

  it("requires pre-output required_evidence self-check in user prompt", () => {
    const prompt = buildCMLPrompt(baseInput);

    expect(prompt.user).toContain("REQUIRED SELF-CHECK BEFORE OUTPUT");
    expect(prompt.user).toContain("Verify each step has required_evidence length 2-4");
    expect(prompt.user).toContain("not detective-private cognition");
  });
});

import { describe, expect, it } from "vitest";
import { buildRevisionPrompt } from "../agent4-revision.ts";

describe("agent4 revision prompt first-pass contracts", () => {
  const baseInput = {
    originalPrompt: {
      system: "sys",
      developer: "dev",
      user: "Create a CML mystery based on 1940s estate setting.",
    },
    invalidCml: "{}",
    attempt: 1,
  };

  it("injects required-evidence hard contract when required_evidence gaps are present", () => {
    const prompt = buildRevisionPrompt({
      ...baseInput,
      validationErrors: [
        "CASE.inference_path.steps[0].required_evidence is missing or empty - each step needs at least 1 evidence item",
      ],
    });

    expect(prompt.developer).toContain("First-Pass Required-Evidence Contract");
    expect(prompt.user).toContain("Every 'inference_path.steps[i]' MUST include 'required_evidence' with 2-4");
    expect(prompt.user).toContain("Do NOT output any step that omits 'required_evidence'");
  });

  it("injects required self-check for first-pass required_evidence correctness", () => {
    const prompt = buildRevisionPrompt({
      ...baseInput,
      validationErrors: [
        "CASE.inference_path.steps[2].required_evidence is missing or empty - each step needs at least 1 evidence item",
      ],
    });

    expect(prompt.user).toContain("Required Self-Check");
    expect(prompt.user).toContain("Verify 'required_evidence' exists and length is between 2 and 4");
    expect(prompt.user).toContain("If any check fails, self-correct before emitting final JSON");
  });

  it("activates the same contract for structural fair-play coverage revision requests", () => {
    const prompt = buildRevisionPrompt({
      ...baseInput,
      validationErrors: [
        "Fair-play clue coverage remains structurally insufficient. Revise CML so the reader can logically solve the case BEFORE discriminating test",
      ],
    });

    expect(prompt.developer).toContain("First-Pass Required-Evidence Contract");
    expect(prompt.user).toContain("Do NOT use abstract placeholders such as");
    expect(prompt.user).toContain("timeline discrepancy");
  });

  it("selects required-evidence contract branch for missing signals", () => {
    const prompt = buildRevisionPrompt({
      ...baseInput,
      validationErrors: [
        "CASE.inference_path.steps[1].required_evidence is missing",
      ],
    });

    expect(prompt.developer).toContain("First-Pass Required-Evidence Contract (non-negotiable)");
    expect(prompt.user).toContain("First-Pass Required-Evidence Contract (MANDATORY)");
  });

  it("selects required-evidence contract branch for empty signals", () => {
    const prompt = buildRevisionPrompt({
      ...baseInput,
      validationErrors: [
        "CASE.inference_path.steps[0].required_evidence is empty",
      ],
    });

    expect(prompt.developer).toContain("First-Pass Required-Evidence Contract (non-negotiable)");
    expect(prompt.user).toContain("First-Pass Required-Evidence Contract (MANDATORY)");
  });

  it("does not select required-evidence contract branch for unrelated validation errors", () => {
    const prompt = buildRevisionPrompt({
      ...baseInput,
      validationErrors: [
        "CASE.meta.license must be a string",
      ],
    });

    expect(prompt.developer).not.toContain("First-Pass Required-Evidence Contract (non-negotiable)");
    expect(prompt.user).not.toContain("First-Pass Required-Evidence Contract (MANDATORY)");
  });

  it("always includes explicit inference-step required_evidence invariants in prompt body", () => {
    const prompt = buildRevisionPrompt({
      ...baseInput,
      validationErrors: [
        "CASE.meta.title is required",
      ],
    });

    expect(prompt.user).toContain("Non-Negotiable Inference-Step Structural Invariants (FIRST PASS)");
    expect(prompt.user).toContain("For EVERY 'inference_path.steps[i]', retain 'required_evidence'");
    expect(prompt.user).toContain("'required_evidence' MUST contain 2-4 entries");
    expect(prompt.user).toContain("Forbidden abstract placeholders in 'required_evidence'");
  });
});

import { describe, it, expect, beforeEach, vi } from "vitest";
import { buildCMLPrompt } from "../src/agent3-cml";
import type { CMLPromptInputs } from "../src/types";

describe("Agent 3: CML Generator", () => {
  let baseInputs: CMLPromptInputs;

  beforeEach(() => {
    baseInputs = {
      decade: "1930s",
      location: "Country house",
      institution: "Private estate",
      tone: "Classic Golden Age",
      weather: "Fog",
      socialStructure: "Rigid class hierarchy",
      primaryAxis: "temporal",
      castSize: 6,
      castNames: ["Inspector Blake", "Lord Ashford", "Lady Ashford", "Dr. Marsh", "Miss Grey", "Butler Stevens"],
      detectiveType: "Professional police detective",
      victimArchetype: "Wealthy aristocrat",
      complexityLevel: "moderate",
      mechanismFamilies: ["clock manipulation", "timeline confusion"],
      runId: "test-run-123",
      projectId: "test-project-456",
    };
  });

  describe("buildCMLPrompt", () => {
    it("generates complete prompt structure", () => {
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.system).toBeDefined();
      expect(prompt.developer).toBeDefined();
      expect(prompt.user).toBeDefined();
      expect(prompt.messages).toHaveLength(3);
    });

    it("includes CML specialist system prompt", () => {
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.system).toContain("CML (Case Modeling Language) 2.0 specialist");
      expect(prompt.system).toContain("fair-play");
    });

    it("includes CML schema in developer section", () => {
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.developer).toContain("CML 2.0 Structure");
      expect(prompt.developer).toContain("meta:");
      expect(prompt.developer).toContain("cast:");
      expect(prompt.developer).toContain("false_assumption:");
    });

    it("includes era constraints for specified decade", () => {
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.developer).toContain("1930s Era Constraints");
      expect(prompt.developer).toContain("Technology:");
      expect(prompt.developer).toContain("Forensics:");
    });

    it("includes all cast names in user prompt", () => {
      const prompt = buildCMLPrompt(baseInputs);

      baseInputs.castNames.forEach(name => {
        expect(prompt.user).toContain(name);
      });
    });

    it("specifies primary axis correctly", () => {
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.user).toContain("Primary Axis: temporal");
      expect(prompt.user).toContain("False Assumption Type: Must be temporal");
    });

    it("includes complexity level", () => {
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.user).toContain("Complexity Level: moderate");
    });

    it("formats messages array correctly", () => {
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.messages[0].role).toBe("system");
      expect(prompt.messages[1].role).toBe("developer");
      expect(prompt.messages[2].role).toBe("user");
    });
  });

  describe("buildCMLPrompt - different axes", () => {
    it("builds prompt for spatial axis", () => {
      baseInputs.primaryAxis = "spatial";
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.user).toContain("Primary Axis: spatial");
      expect(prompt.user).toContain("False Assumption Type: Must be spatial");
    });

    it("builds prompt for identity axis", () => {
      baseInputs.primaryAxis = "identity";
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.user).toContain("Primary Axis: identity");
      expect(prompt.user).toContain("False Assumption Type: Must be identity");
    });

    it("builds prompt for behavioral axis", () => {
      baseInputs.primaryAxis = "behavioral";
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.user).toContain("Primary Axis: behavioral");
      expect(prompt.user).toContain("False Assumption Type: Must be behavioral");
    });

    it("builds prompt for authority axis", () => {
      baseInputs.primaryAxis = "authority";
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.user).toContain("Primary Axis: authority");
      expect(prompt.user).toContain("False Assumption Type: Must be authority");
    });
  });

  describe("buildCMLPrompt - novelty constraints", () => {
    it("includes novelty constraints when provided", () => {
      baseInputs.noveltyConstraints = {
        divergeFrom: ["study_in_scarlet", "moonstone"],
        areas: ["mechanism", "false_assumption"],
        avoidancePatterns: ["poison", "inheritance dispute"],
      };

      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.developer).toContain("Novelty Constraints");
      expect(prompt.developer).toContain("study_in_scarlet");
      expect(prompt.developer).toContain("moonstone");
      expect(prompt.developer).toContain("mechanism");
      expect(prompt.developer).toContain("poison");
    });

    it("omits novelty section when not provided", () => {
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.developer).not.toContain("Novelty Constraints");
    });
  });

  describe("seed pattern loading", () => {
    it("handles missing examples directory gracefully", () => {
      const prompt = buildCMLPrompt(baseInputs, "/nonexistent/path");

      expect(prompt.developer).toContain("Seed CML Structural Patterns");
      // Should have fallback text
    });
  });
});

describe("Era and Location Constraints", () => {
  const baseInputs: CMLPromptInputs = {
    decade: "1930s",
    location: "Country house",
    institution: "Private estate",
    tone: "Classic Golden Age",
    weather: "Fog",
    socialStructure: "Rigid class hierarchy",
    primaryAxis: "temporal",
    castSize: 6,
    castNames: ["Inspector Blake", "Lord Ashford", "Lady Ashford", "Dr. Marsh", "Miss Grey", "Butler Stevens"],
    detectiveType: "Professional police detective",
    victimArchetype: "Wealthy aristocrat",
    complexityLevel: "moderate",
    mechanismFamilies: ["clock manipulation", "timeline confusion"],
    runId: "test-run-123",
    projectId: "test-project-456",
  };

  it("generates different constraints for different decades", () => {
    const inputs1920s = { ...baseInputs, decade: "1920s" };
    const inputs1950s = { ...baseInputs, decade: "1950s" };

    const prompt1920s = buildCMLPrompt(inputs1920s);
    const prompt1950s = buildCMLPrompt(inputs1950s);

    expect(prompt1920s.developer).toContain("1920s Era Constraints");
    expect(prompt1920s.developer).toContain("No television");
    
    expect(prompt1950s.developer).toContain("1950s Era Constraints");
    expect(prompt1950s.developer).toContain("Television spreading");
  });
});

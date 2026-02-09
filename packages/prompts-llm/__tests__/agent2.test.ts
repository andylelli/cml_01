/**
 * Tests for Agent 2 (Cast & Motive Designer)
 */

import { describe, it, expect } from "vitest";
import { buildCastPrompt, type CastInputs } from "../src/agent2-cast.js";

describe("Agent 2: Cast & Motive Designer", () => {
  const baseInputs: CastInputs = {
    runId: "test-run-1",
    projectId: "test-project",
    characterNames: [
      "Lady Margaret Ashford",
      "Professor James Hartford",
      "Miss Emily Thornton",
      "Dr. Charles Westwood",
      "Mrs. Catherine Blake",
      "Inspector Thomas Reid",
    ],
    setting: "1930s English country manor",
    crimeType: "Murder",
    tone: "Classic golden age mystery",
    socialContext: "English aristocracy with staff",
  };

  describe("buildCastPrompt", () => {
    it("generates complete prompt structure", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.system).toBeDefined();
      expect(prompt.developer).toBeDefined();
      expect(prompt.user).toBeDefined();
      expect(prompt.messages).toHaveLength(2);
    });

    it("includes character design specialist system prompt", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.system).toContain("character design specialist");
      expect(prompt.system).toContain("psychologically rich");
      expect(prompt.system).toContain("diverse casts");
    });

    it("includes character profile template", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.developer).toContain("Character Profile Template");
      expect(prompt.developer).toContain("ageRange");
      expect(prompt.developer).toContain("occupation");
      expect(prompt.developer).toContain("publicPersona");
      expect(prompt.developer).toContain("privateSecret");
      expect(prompt.developer).toContain("motiveSeed");
      expect(prompt.developer).toContain("motiveStrength");
    });

    it("includes relationship web template", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.developer).toContain("Relationship Web Template");
      expect(prompt.developer).toContain("tension");
      expect(prompt.developer).toContain("sharedHistory");
    });

    it("includes diversity check requirements", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.developer).toContain("Diversity");
      expect(prompt.developer).toContain("stereotypeCheck");
      expect(prompt.developer).toContain("recommendations");
    });

    it("includes crime dynamics analysis", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.developer).toContain("Crime Dynamics");
      expect(prompt.developer).toContain("possibleCulprits");
      expect(prompt.developer).toContain("redHerrings");
      expect(prompt.developer).toContain("victimCandidates");
      expect(prompt.developer).toContain("detectiveCandidates");
    });

    it("includes JSON output format specification", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.developer).toContain("Output Format");
      expect(prompt.developer).toContain('"characters"');
      expect(prompt.developer).toContain('"relationships"');
      expect(prompt.developer).toContain('"diversity"');
      expect(prompt.developer).toContain('"crimeDynamics"');
    });

    it("includes all character names in user prompt", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.user).toContain("Lady Margaret Ashford");
      expect(prompt.user).toContain("Professor James Hartford");
      expect(prompt.user).toContain("Miss Emily Thornton");
      expect(prompt.user).toContain("Dr. Charles Westwood");
      expect(prompt.user).toContain("Mrs. Catherine Blake");
      expect(prompt.user).toContain("Inspector Thomas Reid");
    });

    it("includes setting and crime type", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.user).toContain("1930s English country manor");
      expect(prompt.user).toContain("Murder");
      expect(prompt.user).toContain("Classic golden age mystery");
    });

    it("formats messages array correctly", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.messages).toHaveLength(2);
      expect(prompt.messages[0].role).toBe("system");
      expect(prompt.messages[1].role).toBe("user");

      // System message should combine system + developer
      expect(prompt.messages[0].content).toContain(prompt.system);
      expect(prompt.messages[0].content).toContain(prompt.developer);

      expect(prompt.messages[1].content).toBe(prompt.user);
    });
  });

  describe("buildCastPrompt - different settings", () => {
    it("builds prompt for ocean liner setting", () => {
      const inputs: CastInputs = {
        ...baseInputs,
        setting: "1930s luxury ocean liner",
        socialContext: "International passengers, wealthy elite",
      };
      const prompt = buildCastPrompt(inputs);

      expect(prompt.user).toContain("1930s luxury ocean liner");
      expect(prompt.user).toContain("International passengers");
    });

    it("builds prompt for university setting", () => {
      const inputs: CastInputs = {
        ...baseInputs,
        setting: "1950s American university",
        socialContext: "Academic hierarchy, students and faculty",
      };
      const prompt = buildCastPrompt(inputs);

      expect(prompt.user).toContain("1950s American university");
      expect(prompt.user).toContain("Academic hierarchy");
    });

    it("handles missing optional socialContext", () => {
      const inputs: CastInputs = {
        runId: "test",
        projectId: "test",
        characterNames: ["Name 1", "Name 2", "Name 3", "Name 4", "Name 5", "Name 6"],
        setting: "1940s hotel",
        crimeType: "Theft",
        tone: "Noir",
      };
      const prompt = buildCastPrompt(inputs);

      expect(prompt.user).toContain("1940s hotel");
      expect(prompt.user).not.toContain("undefined");
    });
  });

  describe("buildCastPrompt - different crime types", () => {
    it("builds prompt for theft", () => {
      const inputs: CastInputs = {
        ...baseInputs,
        crimeType: "Theft of valuable artifact",
      };
      const prompt = buildCastPrompt(inputs);

      expect(prompt.user).toContain("Theft of valuable artifact");
    });

    it("builds prompt for blackmail", () => {
      const inputs: CastInputs = {
        ...baseInputs,
        crimeType: "Blackmail and extortion",
      };
      const prompt = buildCastPrompt(inputs);

      expect(prompt.user).toContain("Blackmail and extortion");
    });
  });

  describe("buildCastPrompt - requirements", () => {
    it("requires character count", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.user).toContain(`all ${baseInputs.characterNames.length} characters`);
    });

    it("requires diverse representation", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.user).toContain("diverse representation");
      expect(prompt.user).toContain("age, background, archetype");
    });

    it("requires interconnected relationships", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.user).toContain("interconnected relationships");
      expect(prompt.user).toContain("hidden tensions");
    });

    it("requires motive and alibi generation", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.user).toContain("motives and alibis");
    });

    it("requires culprit candidates", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.user).toContain("culprit candidates");
    });

    it("requires red herrings", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.user).toContain("red herrings");
    });

    it("requires stereotype avoidance", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.user).toContain("Avoid stereotypes");
    });

    it("requires public facade and private secrets", () => {
      const prompt = buildCastPrompt(baseInputs);

      expect(prompt.user).toContain("public facade and private secrets");
    });
  });
});

/**
 * Tests for Agent 1 (Era & Setting Refiner)
 */

import { describe, it, expect } from "vitest";
import { buildSettingPrompt, type SettingInputs } from "../src/agent1-setting.js";

describe("Agent 1: Era & Setting Refiner", () => {
  const baseInputs: SettingInputs = {
    runId: "test-run-1",
    projectId: "test-project",
    decade: "1930s",
    location: "Country manor",
    institution: "Private residence",
    weather: "Stormy night",
    socialStructure: "English aristocracy",
    tone: "Classic golden age mystery",
  };

  describe("buildSettingPrompt", () => {
    it("generates complete prompt structure", () => {
      const prompt = buildSettingPrompt(baseInputs);
      
      expect(prompt.system).toBeDefined();
      expect(prompt.developer).toBeDefined();
      expect(prompt.user).toBeDefined();
      expect(prompt.messages).toHaveLength(2);
    });

    it("includes setting specialist system prompt", () => {
      const prompt = buildSettingPrompt(baseInputs);
      
      expect(prompt.system).toContain("mystery setting specialist");
      expect(prompt.system).toContain("Historical authenticity");
      expect(prompt.system).toContain("anachronism detection");
    });

    it("includes era constraints template", () => {
      const prompt = buildSettingPrompt(baseInputs);
      
      expect(prompt.developer).toContain("Era Constraints Template");
      expect(prompt.developer).toContain("technology");
      expect(prompt.developer).toContain("forensics");
      expect(prompt.developer).toContain("socialNorms");
    });

    it("includes location constraints template", () => {
      const prompt = buildSettingPrompt(baseInputs);
      
      expect(prompt.developer).toContain("Location Constraints Template");
      expect(prompt.developer).toContain("physicalConstraints");
    });

    it("includes JSON output format specification", () => {
      const prompt = buildSettingPrompt(baseInputs);
      
      expect(prompt.developer).toContain("Output Format");
      expect(prompt.developer).toContain('"era"');
      expect(prompt.developer).toContain('"location"');
      expect(prompt.developer).toContain('"atmosphere"');
      expect(prompt.developer).toContain('"realism"');
    });

    it("includes user specifications in user prompt", () => {
      const prompt = buildSettingPrompt(baseInputs);
      
      expect(prompt.user).toContain("1930s");
      expect(prompt.user).toContain("Country manor");
      expect(prompt.user).toContain("Private residence");
      expect(prompt.user).toContain("Stormy night");
      expect(prompt.user).toContain("English aristocracy");
    });

    it("formats messages array correctly", () => {
      const prompt = buildSettingPrompt(baseInputs);

      expect(prompt.messages).toHaveLength(2);
      expect(prompt.messages[0].role).toBe("system");
      expect(prompt.messages[1].role).toBe("user");
      
      // System message should combine system + developer
      expect(prompt.messages[0].content).toContain(prompt.system);
      expect(prompt.messages[0].content).toContain(prompt.developer);
      
      expect(prompt.messages[1].content).toBe(prompt.user);
    });
  });

  describe("buildSettingPrompt - different eras", () => {
    it("builds prompt for 1920s", () => {
      const inputs: SettingInputs = {
        ...baseInputs,
        decade: "1920s",
      };
      const prompt = buildSettingPrompt(inputs);

      expect(prompt.user).toContain("1920s");
      expect(prompt.developer).toContain("technology");
    });

    it("builds prompt for 1940s", () => {
      const inputs: SettingInputs = {
        ...baseInputs,
        decade: "1940s",
      };
      const prompt = buildSettingPrompt(inputs);

      expect(prompt.user).toContain("1940s");
    });

    it("builds prompt for 1960s", () => {
      const inputs: SettingInputs = {
        ...baseInputs,
        decade: "1960s",
      };
      const prompt = buildSettingPrompt(inputs);

      expect(prompt.user).toContain("1960s");
    });
  });

  describe("buildSettingPrompt - different locations", () => {
    it("builds prompt for ocean liner", () => {
      const inputs: SettingInputs = {
        ...baseInputs,
        location: "Ocean liner",
        institution: "Passenger ship",
      };
      const prompt = buildSettingPrompt(inputs);

      expect(prompt.user).toContain("Ocean liner");
      expect(prompt.user).toContain("Passenger ship");
    });

    it("builds prompt for university", () => {
      const inputs: SettingInputs = {
        ...baseInputs,
        location: "University campus",
        institution: "Academic institution",
      };
      const prompt = buildSettingPrompt(inputs);

      expect(prompt.user).toContain("University campus");
      expect(prompt.user).toContain("Academic institution");
    });

    it("handles missing optional fields", () => {
      const inputs: SettingInputs = {
        runId: "test",
        projectId: "test",
        decade: "1930s",
        location: "Hotel",
      };
      const prompt = buildSettingPrompt(inputs);

      expect(prompt.user).toContain("Hotel");
      expect(prompt.user).not.toContain("undefined");
    });
  });

  describe("buildSettingPrompt - requirements", () => {
    it("requires anachronism detection", () => {
      const prompt = buildSettingPrompt(baseInputs);
      
      expect(prompt.developer).toContain("anachronisms");
      expect(prompt.user).toContain("anachronisms");
    });

    it("requires physical constraints", () => {
      const prompt = buildSettingPrompt(baseInputs);
      
      expect(prompt.developer).toContain("physicalConstraints");
    });

    it("requires atmosphere details", () => {
      const prompt = buildSettingPrompt(baseInputs);
      
      expect(prompt.developer).toContain("atmosphere");
      expect(prompt.user).toContain("Atmosphere");
    });

    it("requires realism recommendations", () => {
      const prompt = buildSettingPrompt(baseInputs);
      
      expect(prompt.developer).toContain("recommendations");
      expect(prompt.user).toContain("recommendations");
    });
  });
});

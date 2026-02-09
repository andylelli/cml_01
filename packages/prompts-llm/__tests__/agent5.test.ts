import { describe, it, expect } from "vitest";
import { buildCluePrompt } from "../src/agent5-clues";
import type { ClueExtractionInputs } from "../src/agent5-clues";

describe("Agent 5: Clue Distribution & Red Herring Agent", () => {
  const mockCML = {
    CML_VERSION: 2.0,
    CASE: {
      meta: {
        title: "The Clockwork Murder",
        crime_class: {
          category: "murder",
        },
      },
      cast: [
        {
          name: "Inspector Blake",
          evidence_sensitivity: ["pocket watch", "train ticket"],
        },
        {
          name: "Lady Ashford",
          evidence_sensitivity: ["diary entry"],
        },
      ],
      false_assumption: {
        type: "temporal",
        statement: "The murder occurred at midnight",
      },
      inference_path: {
        steps: [
          {
            observation: "Library clock stopped at 9:15",
            correction: "Clock was tampered with",
            effect: "False timeline established",
          },
          {
            observation: "Train arrival delayed 2 hours",
            correction: "Witnesses' alibis shift",
            effect: "Access window changes",
          },
        ],
      },
      constraint_space: {
        time: {
          anchors: ["9:00 PM dinner bell", "11:30 PM last witness sighting"],
          contradictions: ["Two conflicting time reports"],
        },
        access: {
          actors: ["Butler", "Lady", "Doctor"],
          objects: ["Study key", "Poison bottle"],
        },
        physical: {
          traces: ["Muddy footprints", "Torn fabric"],
        },
      },
    },
  };

  describe("buildCluePrompt", () => {
    it("generates complete prompt structure", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 2,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt).toHaveProperty("system");
      expect(prompt).toHaveProperty("developer");
      expect(prompt).toHaveProperty("user");

      expect(prompt.system).toBeTruthy();
      expect(prompt.developer).toBeTruthy();
      expect(prompt.user).toBeTruthy();
    });

    it("includes clue extraction specialist system prompt", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 1,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt.system).toContain("clue extraction specialist");
      expect(prompt.system).toContain("Extract clues ONLY from existing CML facts");
      expect(prompt.system).toContain("fair play");
    });

    it("lists clue categories", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 0,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt.system).toContain("Temporal");
      expect(prompt.system).toContain("Spatial");
      expect(prompt.system).toContain("Physical");
      expect(prompt.system).toContain("Behavioral");
      expect(prompt.system).toContain("Testimonial");
    });

    it("includes CML summary in developer prompt", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 1,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt.developer).toContain("temporal axis");
      expect(prompt.developer).toContain("The Clockwork Murder");
      expect(prompt.developer).toContain("murder");
      expect(prompt.developer).toContain("2 characters");
    });

    it("extracts inference path observations", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 0,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt.developer).toContain("Library clock stopped at 9:15");
      expect(prompt.developer).toContain("Train arrival delayed 2 hours");
    });

    it("includes constraint space facts", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 0,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt.developer).toContain("Temporal Constraints");
      expect(prompt.developer).toContain("Access Constraints");
      expect(prompt.developer).toContain("Physical Evidence");
    });

    it("lists evidence-sensitive characters", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 0,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt.developer).toContain("Inspector Blake");
      expect(prompt.developer).toContain("Lady Ashford");
      expect(prompt.developer).toContain("sensitive items");
    });

    describe("clue density handling", () => {
      it("handles minimal density", () => {
        const inputs: ClueExtractionInputs = {
          cml: mockCML,
          clueDensity: "minimal",
          redHerringBudget: 0,
        };

        const prompt = buildCluePrompt(inputs);

        expect(prompt.developer).toContain("minimal");
        expect(prompt.developer).toContain("5-8 essential clues");
      });

      it("handles moderate density", () => {
        const inputs: ClueExtractionInputs = {
          cml: mockCML,
          clueDensity: "moderate",
          redHerringBudget: 0,
        };

        const prompt = buildCluePrompt(inputs);

        expect(prompt.developer).toContain("moderate");
        expect(prompt.developer).toContain("8-12 clues");
      });

      it("handles dense density", () => {
        const inputs: ClueExtractionInputs = {
          cml: mockCML,
          clueDensity: "dense",
          redHerringBudget: 0,
        };

        const prompt = buildCluePrompt(inputs);

        expect(prompt.developer).toContain("dense");
        expect(prompt.developer).toContain("12-18 clues");
      });
    });

    describe("red herring budget handling", () => {
      it("includes red herring guidance when budget > 0", () => {
        const inputs: ClueExtractionInputs = {
          cml: mockCML,
          clueDensity: "moderate",
          redHerringBudget: 3,
        };

        const prompt = buildCluePrompt(inputs);

        expect(prompt.developer).toContain("Red Herring Budget: 3");
        expect(prompt.developer).toContain("Create 3 red herrings");
        expect(prompt.developer).toContain("The murder occurred at midnight");
      });

      it("skips red herring guidance when budget = 0", () => {
        const inputs: ClueExtractionInputs = {
          cml: mockCML,
          clueDensity: "moderate",
          redHerringBudget: 0,
        };

        const prompt = buildCluePrompt(inputs);

        expect(prompt.developer).toContain("Red Herring Budget: 0");
        expect(prompt.developer).toContain("No red herrings requested");
      });
    });

    it("includes clue placement strategy", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 1,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt.developer).toContain("Clue Placement Strategy");
      expect(prompt.developer).toContain("Early (Act I");
      expect(prompt.developer).toContain("Mid (Act II");
      expect(prompt.developer).toContain("Late (Act III");
      expect(prompt.developer).toContain("essential");
      expect(prompt.developer).toContain("supporting");
      expect(prompt.developer).toContain("optional");
    });

    it("includes output JSON schema", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 1,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt.developer).toContain("Output JSON Schema");
      expect(prompt.developer).toContain('"clues"');
      expect(prompt.developer).toContain('"redHerrings"');
      expect(prompt.developer).toContain('"category"');
      expect(prompt.developer).toContain('"placement"');
      expect(prompt.developer).toContain('"criticality"');
    });

    it("includes extraction requirements in user prompt", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 2,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt.user).toContain("Extract and organize clues");
      expect(prompt.user).toContain("8-12");
      expect(prompt.user).toContain("2 red herrings");
      expect(prompt.user).toContain("Do NOT invent new facts");
      expect(prompt.user).toContain("traceable to CML");
    });

    it("emphasizes fair play requirement", () => {
      const inputs: ClueExtractionInputs = {
        cml: mockCML,
        clueDensity: "moderate",
        redHerringBudget: 1,
      };

      const prompt = buildCluePrompt(inputs);

      expect(prompt.user).toContain("fair play");
      expect(prompt.user).toContain("reader can solve the mystery");
    });
  });
});

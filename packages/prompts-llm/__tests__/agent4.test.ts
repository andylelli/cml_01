import { describe, it, expect } from "vitest";
import { buildRevisionPrompt } from "../src/agent4-revision";
import type { RevisionInputs } from "../src/agent4-revision";

describe("Agent 4: CML Revision Agent", () => {
  describe("buildRevisionPrompt", () => {
    const mockOriginalPrompt = {
      system: "You are a mystery writer...",
      developer: "Generate CML for a temporal axis mystery...",
      user: "Create a mystery set in 1930s manor with temporal axis focus...",
    };

    const mockInvalidCml = `CASE:
  meta:
    title: "The Clockwork Murder"
    author: "Test Author"
    version: "2.0"
  cast:
    - name: "Inspector Blake"
      occupation: "Detective"
    - name: "Lady Ashford"
      occupation: "Widow"`;

    it("generates complete prompt structure", () => {
      const inputs: RevisionInputs = {
        originalPrompt: mockOriginalPrompt,
        invalidCml: mockInvalidCml,
        validationErrors: [
          "CASE.meta.license is required",
          "CASE.meta.era is required",
          "CASE.cast[0].age_range is required",
        ],
        attempt: 1,
      };

      const prompt = buildRevisionPrompt(inputs);

      expect(prompt).toHaveProperty("system");
      expect(prompt).toHaveProperty("developer");
      expect(prompt).toHaveProperty("user");

      expect(prompt.system).toBeTruthy();
      expect(prompt.developer).toBeTruthy();
      expect(prompt.user).toBeTruthy();
    });

    it("includes revision specialist system prompt", () => {
      const inputs: RevisionInputs = {
        originalPrompt: mockOriginalPrompt,
        invalidCml: mockInvalidCml,
        validationErrors: ["CASE.meta.license is required"],
        attempt: 1,
      };

      const prompt = buildRevisionPrompt(inputs);

      expect(prompt.system).toContain("CML (Case Markup Language) revision specialist");
      expect(prompt.system).toContain("Fix ONLY the validation errors");
      expect(prompt.system).toContain("Preserve all existing content");
    });

    it("categorizes errors by type", () => {
      const inputs: RevisionInputs = {
        originalPrompt: mockOriginalPrompt,
        invalidCml: mockInvalidCml,
        validationErrors: [
          "CASE.meta.license is required",
          "CASE.meta.era is required",
          "CASE.discriminating_test.method must be one of reenactment, trap",
          "CASE.inference_path must be object",
        ],
        attempt: 1,
      };

      const prompt = buildRevisionPrompt(inputs);

      // Should categorize: 2 missing, 1 allowed value, 1 type error
      expect(prompt.developer).toContain("Missing Required Fields (2)");
      expect(prompt.developer).toContain("Allowed Value Errors (1)");
      expect(prompt.developer).toContain("Type Errors (1)");
    });

    it("groups errors by section", () => {
      const inputs: RevisionInputs = {
        originalPrompt: mockOriginalPrompt,
        invalidCml: mockInvalidCml,
        validationErrors: [
          "CASE.meta.license is required",
          "CASE.meta.era is required",
          "CASE.cast[0].age_range is required",
          "CASE.cast[0].role_archetype is required",
          "CASE.cast[1].age_range is required",
          "CASE.culpability.culprit_count is required",
        ],
        attempt: 1,
      };

      const prompt = buildRevisionPrompt(inputs);

      // Should group by: CASE.meta (2), CASE.cast[0] (2), CASE.cast[1] (1), CASE.culpability (1)
      expect(prompt.developer).toContain("Errors by Section");
      expect(prompt.developer).toContain("CASE.meta");
      expect(prompt.developer).toContain("CASE.cast[0]");
      expect(prompt.developer).toContain("CASE.cast[1]");
      expect(prompt.developer).toContain("CASE.culpability");
    });

    it("includes common fix patterns", () => {
      const inputs: RevisionInputs = {
        originalPrompt: mockOriginalPrompt,
        invalidCml: mockInvalidCml,
        validationErrors: ["CASE.meta.license is required"],
        attempt: 1,
      };

      const prompt = buildRevisionPrompt(inputs);

      expect(prompt.developer).toContain("Common Fix Patterns");
      expect(prompt.developer).toContain("Missing Cast Fields");
      expect(prompt.developer).toContain("Missing Meta Fields");
      expect(prompt.developer).toContain("Missing Culpability Fields");
      expect(prompt.developer).toContain("Type Errors");
    });

    it("includes attempt number in prompt", () => {
      const inputs: RevisionInputs = {
        originalPrompt: mockOriginalPrompt,
        invalidCml: mockInvalidCml,
        validationErrors: ["CASE.meta.license is required"],
        attempt: 3,
      };

      const prompt = buildRevisionPrompt(inputs);

      expect(prompt.developer).toContain("Attempt 3 of 5");
    });

    it("includes invalid CML in user prompt", () => {
      const inputs: RevisionInputs = {
        originalPrompt: mockOriginalPrompt,
        invalidCml: mockInvalidCml,
        validationErrors: ["CASE.meta.license is required"],
        attempt: 1,
      };

      const prompt = buildRevisionPrompt(inputs);

      expect(prompt.user).toContain(mockInvalidCml);
      expect(prompt.user).toContain("Invalid CML to Fix");
    });

    it("provides clear revision instructions", () => {
      const inputs: RevisionInputs = {
        originalPrompt: mockOriginalPrompt,
        invalidCml: mockInvalidCml,
        validationErrors: ["CASE.meta.license is required"],
        attempt: 1,
      };

      const prompt = buildRevisionPrompt(inputs);

      expect(prompt.user).toContain("Fix ALL validation errors");
      expect(prompt.user).toContain("Add ALL missing required fields");
      expect(prompt.user).toContain("Return COMPLETE YAML");
      expect(prompt.user).toContain("Return ONLY the corrected JSON");
    });

    describe("error categorization edge cases", () => {
      it("handles errors with no category matches", () => {
        const inputs: RevisionInputs = {
          originalPrompt: mockOriginalPrompt,
          invalidCml: mockInvalidCml,
          validationErrors: ["Unknown error format"],
          attempt: 1,
        };

        const prompt = buildRevisionPrompt(inputs);

        // Should still build valid prompt
        expect(prompt.developer).toContain("Validation Errors");
      });

      it("handles large number of errors gracefully", () => {
        const errors: string[] = [];
        for (let i = 0; i < 100; i++) {
          errors.push(`CASE.cast[${i}].age_range is required`);
        }

        const inputs: RevisionInputs = {
          originalPrompt: mockOriginalPrompt,
          invalidCml: mockInvalidCml,
          validationErrors: errors,
          attempt: 1,
        };

        const prompt = buildRevisionPrompt(inputs);

        // Should truncate display but mention total count
        expect(prompt.developer).toContain("100 total");
        expect(prompt.developer).toMatch(/and \d+ more/); // Should show "and X more"
      });

      it("handles section grouping with various path formats", () => {
        const inputs: RevisionInputs = {
          originalPrompt: mockOriginalPrompt,
          invalidCml: mockInvalidCml,
          validationErrors: [
            "CASE.meta.license is required",
            "CASE.cast[0].age_range is required",
            "CASE.culpability.culprits is required",
            "CASE.surface_model.accepted_facts is required",
            "CASE.false_assumption.statement is required",
          ],
          attempt: 1,
        };

        const prompt = buildRevisionPrompt(inputs);

        // Should create separate sections for each top-level field
        expect(prompt.developer).toContain("CASE.meta");
        expect(prompt.developer).toContain("CASE.cast[0]");
        expect(prompt.developer).toContain("CASE.culpability");
        expect(prompt.developer).toContain("CASE.surface_model");
        expect(prompt.developer).toContain("CASE.false_assumption");
      });
    });

    describe("attempt tracking", () => {
      it("tracks attempt 1", () => {
        const inputs: RevisionInputs = {
          originalPrompt: mockOriginalPrompt,
          invalidCml: mockInvalidCml,
          validationErrors: ["CASE.meta.license is required"],
          attempt: 1,
        };

        const prompt = buildRevisionPrompt(inputs);

        expect(prompt.developer).toContain("Attempt 1 of 5");
      });

      it("tracks attempt 5 (final)", () => {
        const inputs: RevisionInputs = {
          originalPrompt: mockOriginalPrompt,
          invalidCml: mockInvalidCml,
          validationErrors: ["CASE.meta.license is required"],
          attempt: 5,
        };

        const prompt = buildRevisionPrompt(inputs);

        expect(prompt.developer).toContain("Attempt 5 of 5");
      });
    });

    describe("fix pattern guidance", () => {
      it("provides cast field examples", () => {
        const inputs: RevisionInputs = {
          originalPrompt: mockOriginalPrompt,
          invalidCml: mockInvalidCml,
          validationErrors: [
            "CASE.cast[0].age_range is required",
            "CASE.cast[0].motive_strength is required",
          ],
          attempt: 1,
        };

        const prompt = buildRevisionPrompt(inputs);

        expect(prompt.developer).toContain("age_range");
        expect(prompt.developer).toContain("motive_strength");
        expect(prompt.developer).toContain("weak | moderate | strong | compelling");
      });

      it("provides meta field examples", () => {
        const inputs: RevisionInputs = {
          originalPrompt: mockOriginalPrompt,
          invalidCml: mockInvalidCml,
          validationErrors: [
            "CASE.meta.license is required",
            "CASE.meta.crime_class is required",
          ],
          attempt: 1,
        };

        const prompt = buildRevisionPrompt(inputs);

        expect(prompt.developer).toContain('license: "CC-BY-4.0"');
        expect(prompt.developer).toContain("crime_class: murder | theft | blackmail");
      });

      it("provides type error examples", () => {
        const inputs: RevisionInputs = {
          originalPrompt: mockOriginalPrompt,
          invalidCml: mockInvalidCml,
          validationErrors: [
            "CASE.inference_path must be object",
            "CASE.discriminating_test.method must be one of reenactment, trap",
          ],
          attempt: 1,
        };

        const prompt = buildRevisionPrompt(inputs);

        expect(prompt.developer).toContain("inference_path must be an object");
        expect(prompt.developer).toContain("discriminating_test.method must be");
      });
    });

    describe("original context preservation", () => {
      it("includes abbreviated original requirements", () => {
        const inputs: RevisionInputs = {
          originalPrompt: {
            system: "System prompt",
            developer: "Developer context",
            user: "Create a temporal axis mystery set in a 1930s manor with focus on alibi reconstruction...",
          },
          invalidCml: mockInvalidCml,
          validationErrors: ["CASE.meta.license is required"],
          attempt: 1,
        };

        const prompt = buildRevisionPrompt(inputs);

        expect(prompt.developer).toContain("Original Requirements (for context)");
        // Should truncate long original prompt
        expect(prompt.developer.length).toBeLessThan(5000); // Reasonable prompt size
      });
    });
  });
});

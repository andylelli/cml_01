import { describe, it, expect } from "vitest";
import { buildRevisionPrompt, reviseCml } from "../src/agent4-revision";
import type { RevisionInputs } from "../src/agent4-revision";

function makeMockClient(responses: string[]) {
  const calls: Array<{ messages: Array<{ role: string; content: string }> }> = [];
  let responseIndex = 0;
  const logger = {
    logRequest: async () => undefined,
    logResponse: async () => undefined,
    logError: async () => undefined,
  };

  const client = {
    getLogger: () => logger,
    getCostTracker: () => ({ getSummary: () => ({ byAgent: { "Agent4-Revision": 0 } }) }),
    chat: async (request: { messages: Array<{ role: string; content: string }> }) => {
      calls.push({ messages: request.messages });
      const content = responses[Math.min(responseIndex, responses.length - 1)];
      responseIndex++;
      return {
        model: "test-model",
        content,
        latencyMs: 1,
        finishReason: "stop",
      };
    },
  };

  return { client, calls };
}

function buildValidCml(overrides?: Record<string, unknown>) {
  return {
    CML_VERSION: 2.0,
    CASE: {
      meta: {
        title: "The Case",
        author: "Author",
        license: "CC-BY-4.0",
        era: { decade: "1930s", realism_constraints: [] as string[] },
        setting: { location: "London", institution: "Yard" },
        crime_class: { category: "murder", subtype: "poisoning" },
      },
      cast: [
        {
          name: "Inspector Blake",
          age_range: "40s",
          role_archetype: "detective",
          relationships: [] as string[],
          public_persona: "calm",
          private_secret: "secret",
          motive_seed: "truth",
          motive_strength: "moderate",
          alibi_window: "9pm-10pm",
          access_plausibility: "high",
          opportunity_channels: [] as string[],
          behavioral_tells: [] as string[],
          stakes: "career",
          evidence_sensitivity: [] as string[],
          culprit_eligibility: "eligible",
          culpability: "innocent",
          gender: "male",
          role: "detective",
          moral_complexity: "Flawed but principled.",
        },
      ],
      culpability: { culprit_count: 1, culprits: ["Inspector Blake"] },
      surface_model: {
        narrative: { summary: "A death seems natural." },
        accepted_facts: ["The victim collapsed at dinner."],
        inferred_conclusions: ["No foul play."],
      },
      hidden_model: {
        mechanism: { description: "Poisoned drink.", delivery_path: [{ step: "Poison added." }] },
        outcome: { result: "Victim died from poison." },
      },
      false_assumption: {
        statement: "It was an accident.",
        type: "temporal",
        why_it_seems_reasonable: "Timing appeared consistent.",
        what_it_hides: "Delayed toxin.",
      },
      constraint_space: {
        time: { anchors: [], windows: [], contradictions: [] },
        access: { actors: [], objects: [], permissions: [] },
        physical: { laws: [], traces: [] },
        social: { trust_channels: [], authority_sources: [] },
      },
      inference_path: {
        steps: [
          {
            observation: "A wiped fingerprint arc appears on the poison vial stopper.",
            correction: "The vial was handled intentionally after the victim collapsed.",
            effect: "Post-incident tampering narrows access to informed suspects.",
            required_evidence: ["A wiped fingerprint arc appears on the poison vial stopper beside the drinks tray."],
          },
          {
            observation: "The clock in the corridor stopped during a brief power dip.",
            correction: "Witness timings anchored to that clock are ten minutes late.",
            effect: "The culprit's claimed location window no longer holds.",
            required_evidence: ["The corridor clock stopped during a brief power dip noted by the porter."],
          },
          {
            observation: "Ledger ink on the blackmail note matches the bursar's desk.",
            correction: "The note originated inside the institution, not externally.",
            effect: "The motive trail aligns with one internal actor.",
            required_evidence: ["Ledger ink on the blackmail note matches the bursar's desk blotter."],
          },
        ],
      },
      discriminating_test: {
        method: "trap",
        design: "Confront suspect",
        knowledge_revealed: "Only culprit knew timing",
        pass_condition: "The suspect cannot reconcile the corridor clock delay with the poison vial handling.",
      },
      fair_play: {
        all_clues_visible: true,
        no_special_knowledge_required: true,
        no_late_information: true,
        reader_can_solve: true,
        explanation: "Clues appear before reveal.",
      },
      quality_controls: {
        inference_path_requirements: {
          min_steps: 3,
          max_steps: 8,
          require_observation_correction_effect: true,
        },
        clue_visibility_requirements: {
          essential_clues_min: 3,
          essential_clues_before_test: true,
          early_clues_min: 1,
          mid_clues_min: 1,
          late_clues_min: 1,
        },
        discriminating_test_requirements: {
          timing: "early_act3",
          must_reference_inference_step: true,
        },
      },
    },
    ...(overrides ?? {}),
  };
}

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

    it("surfaces grounding errors with explicit repair guidance", () => {
      const inputs: RevisionInputs = {
        originalPrompt: mockOriginalPrompt,
        invalidCml: mockInvalidCml,
        validationErrors: [
          "CASE.hidden_model.mechanism.description is not grounded in reader-visible inference evidence — add these mechanism/test terms to earlier observations or required_evidence: clock, tampered, timeline",
        ],
        attempt: 1,
      };

      const prompt = buildRevisionPrompt(inputs);

      expect(prompt.developer).toContain("Grounding Errors (1)");
      expect(prompt.developer).toContain("copy the named terms into one or more earlier inference_path.steps");
      expect(prompt.developer).toContain("do NOT force those terms into required_evidence");
      expect(prompt.user).toContain("For grounding errors, revise earlier inference_path evidence");
      expect(prompt.user).toContain("Exception: if the failed terms are procedural wrappers");
    });

    it("forbids reaction-only fair-play repairs", () => {
      const inputs: RevisionInputs = {
        originalPrompt: mockOriginalPrompt,
        invalidCml: mockInvalidCml,
        validationErrors: [
          "CASE.discriminating_test.knowledge_revealed is not grounded in reader-visible inference evidence — add these mechanism/test terms to earlier observations or required_evidence: signals, guilt, tampering",
        ],
        attempt: 1,
      };

      const prompt = buildRevisionPrompt(inputs);

      expect(prompt.developer).toContain("Never satisfy grounding or fair-play repairs by injecting detective-only behavioral shorthand");
      expect(prompt.developer).toContain("guest reactions alone are not proof");
      expect(prompt.user).toContain("Do not repair with reaction-only proof");
      expect(prompt.user).toContain("signals of guilt");
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
      expect(prompt.developer).toContain("Structural Fair-Play Repairs");
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
      expect(prompt.user).toContain("Return COMPLETE JSON");
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

      it("uses configured max attempts when provided", () => {
        const inputs: RevisionInputs = {
          originalPrompt: mockOriginalPrompt,
          invalidCml: mockInvalidCml,
          validationErrors: ["CASE.meta.license is required"],
          attempt: 2,
          maxAttempts: 3,
        };

        const prompt = buildRevisionPrompt(inputs);

        expect(prompt.developer).toContain("Attempt 2 of 3");
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
        expect(prompt.developer).toContain("crime_class: murder | theft | disappearance | fraud");
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

  describe("reviseCml", () => {
    const basePrompt = {
      system: "System",
      developer: "Developer",
      user: "User",
    };

    it("preserves downstream-critical cast fields and unknown fields", async () => {
      const cml = buildValidCml();
      const cast0 = (cml as any).CASE.cast[0];
      cast0.nickname = "Blake";
      cast0.gender = "female";
      cast0.role = "victim";
      cast0.moral_complexity = "Complicit in prior cover-up.";

      const { client } = makeMockClient([JSON.stringify(cml)]);
      const result = await reviseCml(client as any, {
        originalPrompt: basePrompt,
        invalidCml: "CASE: {}",
        validationErrors: ["CASE.meta is required"],
        attempt: 1,
      });

      const revisedCast0 = ((result.cml as any).CASE.cast ?? [])[0];
      expect(revisedCast0.gender).toBe("female");
      expect(revisedCast0.role).toBe("victim");
      expect(revisedCast0.moral_complexity).toBe("Complicit in prior cover-up.");
      expect(revisedCast0.nickname).toBe("Blake");
    });

    it("clamps enum fields to schema-allowed values", async () => {
      const cml = buildValidCml();
      (cml as any).CASE.meta.crime_class.category = "kidnapping";
      (cml as any).CASE.false_assumption.type = "causal";
      (cml as any).CASE.cast[0].role = "janitor";
      (cml as any).CASE.cast[0].gender = "robot";
      (cml as any).CASE.culpability.culprit_count = 5;

      const { client } = makeMockClient([JSON.stringify(cml)]);
      const result = await reviseCml(client as any, {
        originalPrompt: basePrompt,
        invalidCml: "CASE: {}",
        validationErrors: ["CASE.meta is required"],
        attempt: 1,
      });

      const revised = result.cml as any;
      expect(revised.CASE.meta.crime_class.category).toBe("murder");
      expect(revised.CASE.false_assumption.type).toBe("temporal");
      expect(revised.CASE.cast[0].role).toBe("suspect");
      expect(revised.CASE.cast[0].gender).toBe("non-binary");
      expect(revised.CASE.culpability.culprit_count).toBe(1);
    });

    it("uses normalized CML as next retry input", async () => {
      const invalidRetryCandidate = buildValidCml({ CML_VERSION: undefined as unknown as number });
      (invalidRetryCandidate as any).CASE.hidden_model.mechanism.delivery_path = [{}];
      const validSecondAttempt = buildValidCml();

      const { client, calls } = makeMockClient([
        JSON.stringify(invalidRetryCandidate),
        JSON.stringify(validSecondAttempt),
      ]);

      await reviseCml(client as any, {
        originalPrompt: basePrompt,
        invalidCml: "CASE: {}",
        validationErrors: ["CASE.hidden_model.mechanism.delivery_path[0].step is required"],
        attempt: 1,
      });

      expect(calls.length).toBe(2);
      const secondUserPrompt = calls[1].messages.find((m) => m.role === "user")?.content ?? "";
      expect(secondUserPrompt).toContain("CML_VERSION: 2");
    });

    it("retries on transient runtime errors and succeeds on a later attempt", async () => {
      const cml = buildValidCml();
      let callCount = 0;
      const client = {
        getLogger: () => ({
          logRequest: async () => undefined,
          logResponse: async () => undefined,
          logError: async () => undefined,
        }),
        getCostTracker: () => ({ getSummary: () => ({ byAgent: { "Agent4-Revision": 0 } }) }),
        chat: async () => {
          callCount += 1;
          if (callCount === 1) {
            throw new Error("Transient upstream timeout");
          }
          return {
            model: "test-model",
            content: JSON.stringify(cml),
            latencyMs: 1,
            finishReason: "stop",
          };
        },
      };

      const result = await reviseCml(client as any, {
        originalPrompt: basePrompt,
        invalidCml: "CASE: {}",
        validationErrors: ["CASE.meta is required"],
        attempt: 1,
      }, 2);

      expect(callCount).toBe(2);
      expect(result.validation.valid).toBe(true);
    });

    it("does not mutate caller-provided validationErrors array", async () => {
      const cml = buildValidCml();
      const initialErrors = ["CASE.meta is required"];
      const snapshot = [...initialErrors];

      const { client } = makeMockClient([JSON.stringify(cml)]);
      await reviseCml(client as any, {
        originalPrompt: basePrompt,
        invalidCml: "CASE: {}",
        validationErrors: initialErrors,
        attempt: 1,
      });

      expect(initialErrors).toEqual(snapshot);
    });
  });
});

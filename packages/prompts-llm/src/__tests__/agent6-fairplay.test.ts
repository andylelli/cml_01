import { describe, expect, it } from "vitest";
import { buildFairPlayPrompt } from "../agent6-fairplay.ts";

describe("agent6 fair-play prompt contract alignment", () => {
  it("enforces concrete mechanism/chain/timing checks in audit checklist", () => {
    const prompt = buildFairPlayPrompt({
      caseData: {
        CASE: {
          meta: { title: "Clockwork Silence", crime_class: { subtype: "murder" } },
          culpability: { culprits: ["Iwan Hale"] },
          false_assumption: {
            type: "temporal",
            statement: "The clock stopped naturally.",
            why_it_seems_reasonable: "Everyone heard the same chime.",
            what_it_hides: "The clock was manually stalled.",
          },
          hidden_model: {
            mechanism: {
              description: "The culprit stalled the movement with grease and rewound it after discovery.",
              delivery_path: [{ step: "Tamper key slot" }],
            },
            outcome: { result: "False timeline obscured culprit access window." },
          },
          inference_path: {
            steps: [
              {
                observation: "Grease marked the key slot before supper.",
                correction: "The clock time was staged.",
                required_evidence: ["Witness heard mismatched chimes."],
              },
            ],
          },
          discriminating_test: {
            method: "trace comparison",
            design: "Match grease residue against key pattern.",
            knowledge_revealed: "Only culprit handled the key.",
          },
          cast: [{ name: "Iwan Hale", alibi_window: "after supper", access_plausibility: "high" }],
          constraint_space: {
            time: { anchors: ["supper bell at seven"], contradictions: ["clock read half-past eight"] },
            access: { actors: ["butler"], objects: ["clock key"], permissions: ["study access"] },
            physical: { laws: ["metal expands with heat"], traces: ["grease in key slot"] },
            social: { trust_channels: [], authority_sources: [] },
          },
          quality_controls: {
            clue_visibility_requirements: {
              essential_clues_min: 3,
              essential_clues_before_test: true,
              early_clues_min: 1,
              mid_clues_min: 1,
              late_clues_min: 0,
            },
            discriminating_test_requirements: { timing: "late_act_2_or_early_act_3" },
          },
        },
      } as any,
      clues: {
        clues: [
          {
            id: "clue_mechanism_visibility_core",
            category: "physical",
            description: "Grease marks in the clock key slot before supper.",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            pointsTo: "Clock movement was handled before the test.",
            placement: "early",
            criticality: "essential",
          },
        ],
        redHerrings: [],
        clueTimeline: { early: ["clue_mechanism_visibility_core"], mid: [], late: [] },
        fairPlayChecks: {
          allEssentialCluesPresent: true,
          noNewFactsIntroduced: true,
          redHerringsDontBreakLogic: true,
        },
        latencyMs: 1,
        cost: 0,
      },
    });

    expect(prompt.user).toContain("mechanism-visibility clue");
    expect(prompt.user).toContain("observation -> correction -> elimination");
    expect(prompt.user).toContain("the test must confirm evidence, not introduce it");
    expect(prompt.user).toContain("semantically equivalent clues as valid");
  });
});

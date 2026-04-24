import { describe, expect, it } from "vitest";
import { buildCluePrompt } from "../agent5-clues.ts";

describe("agent5 clue prompt first-pass contract", () => {
  it("includes fixed required clue slot IDs in developer prompt", () => {
    const prompt = buildCluePrompt({
      cml: {
        CASE: {
          meta: { title: "Clockwork Silence", crime_class: { category: "murder" } },
          false_assumption: { type: "temporal", statement: "The clock stopped naturally." },
          culpability: { culprits: ["Iwan Hale"] },
          hidden_model: { mechanism: { description: "The culprit wound and stalled the clock movement." } },
          discriminating_test: {
            design: "Use grease traces on the key slot to prove staged stoppage.",
            evidence_clues: ["clue_clock_trace"],
          },
          inference_path: {
            steps: [
              {
                observation: "Grease marked the key slot before supper.",
                correction: "The displayed time was staged.",
                required_evidence: ["Witness heard false chime sequence."],
              },
            ],
          },
          cast: [
            { name: "Iwan Hale", culprit_eligibility: "eligible" },
            { name: "Agnes Pike", culprit_eligibility: "eligible", alibi_window: "in the pantry" },
          ],
          constraint_space: {
            time: { anchors: ["supper bell at seven"], contradictions: [] },
            access: { actors: ["butler"], objects: ["clock key"], permissions: [] },
            physical: { laws: [], traces: ["grease streak"] },
          },
        },
      },
      clueDensity: "moderate",
      redHerringBudget: 1,
    });

    expect(prompt.developer).toContain("First-pass Required Output Slots");
    expect(prompt.developer).toContain("clue_mechanism_visibility_core");
    expect(prompt.developer).toContain("clue_core_contradiction_chain");
    expect(prompt.developer).toContain("clue_core_elimination_chain");
  });

  it("includes strict output-shape and chain constraints in user prompt", () => {
    const prompt = buildCluePrompt({
      cml: {
        CASE: {
          false_assumption: { statement: "The clock stopped naturally." },
          hidden_model: { mechanism: { description: "Clock movement was deliberately tampered with." } },
          discriminating_test: { design: "Compare key marks against expected chime order." },
          inference_path: {
            steps: [{ observation: "Grease around key slot.", correction: "Clock was staged.", required_evidence: [] }],
          },
          cast: [{ name: "Iwan Hale", culprit_eligibility: "eligible" }],
        },
      },
      clueDensity: "minimal",
      redHerringBudget: 0,
    });

    expect(prompt.user).toContain("OUTPUT SHAPE CONTRACT");
    expect(prompt.user).toContain("CONTRADICTION CHAIN");
    expect(prompt.user).toContain("ELIMINATION CHAIN");
  });
});

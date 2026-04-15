import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { buildCMLPrompt } from "../src/agent3-cml.js";
import { buildHardLogicDevicePrompt } from "../src/agent3b-hard-logic-devices.js";
import { buildRevisionPrompt } from "../src/agent4-revision.js";
import { buildCluePrompt } from "../src/agent5-clues.js";
import { buildFairPlayPrompt } from "../src/agent6-fairplay.js";
import { buildNarrativePrompt } from "../src/agent7-narrative.js";
import { buildNoveltyPrompt } from "../src/agent8-novelty.js";

type EvalResult = { score: number; misses: string[] };

const scoreConceptCoverage = (
  text: string,
  agentLabel: string,
  concepts: Array<{ regex: RegExp; points: number; label: string }>,
): EvalResult => {
  let score = 0;
  const misses: string[] = [];
  for (const c of concepts) {
    if (c.regex.test(text)) {
      score += c.points;
    } else {
      misses.push(`${agentLabel}: missing ${c.label}`);
    }
  }
  return { score, misses };
};

const baseCase: any = {
  CML_VERSION: 2.0,
  CASE: {
    meta: {
      title: "The Clockwork Alibi",
      era: { decade: "1930s", realism_constraints: ["No DNA", "Limited telephony"] },
      setting: { location: "Country manor", institution: "Private residence" },
      crime_class: { category: "murder", subtype: "poisoning" },
    },
    cast: [
      {
        name: "Iris Cole",
        role_archetype: "detective",
        alibi_window: "after dinner",
        access_plausibility: "possible",
        opportunity_channels: ["study", "wine cellar"],
        evidence_sensitivity: ["ledger entries"],
        culprit_eligibility: "eligible",
      },
      {
        name: "Martin Hale",
        role_archetype: "suspect",
        alibi_window: "library interval",
        access_plausibility: "easy",
        opportunity_channels: ["service stair"],
        evidence_sensitivity: ["ink stains"],
        culprit_eligibility: "eligible",
      },
    ],
    culpability: { culprit_count: 1, culprits: ["Martin Hale"] },
    false_assumption: {
      statement: "The poison was administered at dinner",
      type: "temporal",
      why_it_seems_reasonable: "Symptoms appeared after dinner",
      what_it_hides: "Delayed administration in tonic",
    },
    hidden_model: {
      mechanism: { description: "Delayed-dose tonic", delivery_path: ["swap", "serve"] },
      outcome: { result: "Victim collapses later" },
    },
    surface_model: {
      narrative: { summary: "Dinner poisoning appears obvious" },
      accepted_facts: ["Victim drank port"],
      inferred_conclusions: ["Poison in port"],
    },
    constraint_space: {
      time: { anchors: ["ten past eight chime"], windows: ["from eight o'clock until half past eight"], contradictions: ["receipt timestamp mismatch"] },
      access: { actors: ["butler", "heir"], objects: ["decanter"], permissions: ["after service"] },
      physical: { laws: ["solubility lag"], traces: ["ring residue"] },
      social: { trust_channels: ["housekeeper"], authority_sources: ["doctor"] },
    },
    inference_path: {
      steps: [
        {
          observation: "Decanter seal broken early",
          correction: "tampering preceded dinner",
          effect: "narrows window",
          required_evidence: ["seal note", "butler log"],
          reader_observable: true,
        },
      ],
    },
    discriminating_test: {
      method: "trap",
      design: "offer duplicate tonic",
      knowledge_revealed: "culprit anticipates delay",
      pass_condition: "culprit intervenes",
      evidence_clues: ["clue_1"],
    },
    fair_play: {
      all_clues_visible: true,
      no_special_knowledge_required: true,
      no_late_information: true,
      reader_can_solve: true,
      explanation: "Clues map directly to each inference step.",
    },
    quality_controls: {
      clue_visibility_requirements: {
        essential_clues_min: 3,
        essential_clues_before_test: true,
        early_clues_min: 2,
        mid_clues_min: 2,
        late_clues_min: 1,
      },
      discriminating_test_requirements: { timing: "early_act3", must_reference_inference_step: true },
    },
    prose_requirements: {
      clue_to_scene_mapping: [{ clue_id: "clue_1", act_number: 1, scene_number: 2, delivery_method: "observation" }],
      discriminating_test_scene: { act_number: 3, scene_number: 3, required_elements: ["trap"], test_type: "trap" },
      culprit_revelation_scene: { act_number: 3, scene_number: 5, revelation_method: "confrontation" },
    },
  },
};

const clues: any = {
  clues: [
    {
      id: "clue_1",
      category: "temporal",
      description: "Seal break noted before dinner",
      sourceInCML: "CASE.constraint_space.time.anchors[0]",
      pointsTo: "early tampering",
      placement: "early",
      criticality: "essential",
      supportsInferenceStep: 1,
      evidenceType: "observation",
    },
  ],
  redHerrings: [
    {
      id: "rh_1",
      description: "Heir arguing loudly",
      supportsAssumption: "dinner poisoning",
      misdirection: "implies impulsive motive",
    },
  ],
};

describe("Prompt Eval Harness: Agent 2b-8 Concept Coverage", () => {
  it("scores Agent 3-8 prompt concept coverage >= 85", () => {
    const a3 = buildCMLPrompt({
      runId: "eval-a3",
      projectId: "eval",
      decade: "1930s",
      location: "Country manor",
      institution: "Private residence",
      weather: "Rain",
      socialStructure: "Aristocracy",
      tone: "Classic",
      castSize: 6,
      castNames: ["Iris Cole", "Martin Hale", "Nora Bell", "Edgar Pike", "Ruth Vale", "Tom Quill"],
      detectiveType: "amateur",
      victimArchetype: "patriarch",
      primaryAxis: "temporal",
      complexityLevel: "moderate",
      mechanismFamilies: ["timing", "administrative"],
      hardLogicModes: ["clockwork"],
      difficultyMode: "standard",
    } as any);
    const a3b = buildHardLogicDevicePrompt({
      runId: "eval-a3b",
      projectId: "eval",
      decade: "1930s",
      location: "Country manor",
      institution: "Private residence",
      tone: "Classic",
      primaryAxis: "temporal",
      mechanismFamilies: ["timing"],
      hardLogicModes: ["clockwork"],
      difficultyMode: "standard",
      theme: "Guilt",
    } as any);
    const a4 = buildRevisionPrompt({
      runId: "eval-a4",
      projectId: "eval",
      originalPrompt: { user: "Generate CML with temporal axis" },
      invalidCml: "CASE: {}",
      validationErrors: ["Missing required field: CASE.cast"],
      attempt: 1,
    } as any);
    const a5 = buildCluePrompt({ cml: baseCase, clueDensity: "moderate", redHerringBudget: 2 } as any);
    const a6 = buildFairPlayPrompt({ caseData: baseCase, clues } as any);
    const a7 = buildNarrativePrompt({ caseData: baseCase, clues, targetLength: "medium", narrativeStyle: "classic" } as any);
    const a8 = buildNoveltyPrompt({ generatedCML: baseCase, seedCMLs: [baseCase], similarityThreshold: 0.7 } as any);

    const concepts = [
      { regex: /Quality bar|Quality Bar/i, points: 30, label: "quality bar" },
      { regex: /Micro-exemplar|Micro-exemplars/i, points: 35, label: "micro-exemplars" },
      { regex: /silent checklist|Silent Pre-Output Checklist|Before finalizing/i, points: 35, label: "self-check" },
    ];

    const results = [
      scoreConceptCoverage(a3.developer, "Agent3", concepts),
      scoreConceptCoverage(a3b.developer, "Agent3b", concepts),
      scoreConceptCoverage(a4.developer, "Agent4", concepts),
      scoreConceptCoverage(a5.developer, "Agent5", concepts),
      scoreConceptCoverage(a6.user, "Agent6", concepts),
      scoreConceptCoverage(a7.developer, "Agent7", concepts),
      scoreConceptCoverage(a8.user, "Agent8", concepts),
    ];

    const minScore = Math.min(...results.map((r) => r.score));
    expect(minScore).toBeGreaterThanOrEqual(85);
  });

  it("checks source-level concept coverage for Agent 2b-2e", () => {
    const files = [
      "src/agent2b-character-profiles.ts",
      "src/agent2c-location-profiles.ts",
      "src/agent2d-temporal-context.ts",
      "src/agent2e-background-context.ts",
    ];

    for (const relativePath of files) {
      const fullPath = `C:/CML/packages/prompts-llm/${relativePath}`;
      const text = readFileSync(fullPath, "utf8");
      expect(text).toMatch(/Quality bar|Quality Bar/i);
      expect(text).toMatch(/Micro-exemplar|Micro-exemplars/i);
    }
  });
});

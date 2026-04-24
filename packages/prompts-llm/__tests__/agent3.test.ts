import { describe, it, expect, beforeEach, vi } from "vitest";
import { buildCMLPrompt, generateCML } from "../src/agent3-cml";
import type { CMLPromptInputs } from "../src/types";

function buildValidCml() {
  return {
    CML_VERSION: 2.0,
    CASE: {
      meta: {
        title: "The Case",
        author: "Author",
        license: "CC-BY-4.0",
        era: { decade: "1930s", realism_constraints: [] as string[] },
        setting: { location: "Country house", institution: "Private estate", place: "Sussex", country: "England" },
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
          gender: "female",
          role: "victim",
          moral_complexity: "Complicit in prior cover-up.",
          nickname: "Blake",
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
            required_evidence: [
              "A wiped fingerprint arc appears on the poison vial stopper beside the drinks tray.",
              "The tray linen carries a fresh smear of bitter almond residue.",
            ],
            reader_observable: true,
          },
          {
            observation: "The clock in the corridor stopped during a brief power dip.",
            correction: "Witness timings anchored to that clock are ten minutes late.",
            effect: "The culprit's claimed location window no longer holds.",
            required_evidence: [
              "The porter notes the corridor clock stopped during the brief power dip.",
              "The mains switch was reset three minutes after the corridor clock failed.",
            ],
            reader_observable: true,
          },
          {
            observation: "Ledger ink on the blackmail note matches the bursar's desk.",
            correction: "The note originated inside the institution, not externally.",
            effect: "The motive trail aligns with one internal actor.",
            required_evidence: [
              "Ledger ink on the blackmail note matches the bursar's desk blotter.",
              "A torn blotter corner fits the missing edge of the blackmail note.",
            ],
            reader_observable: true,
          },
        ],
      },
      discriminating_test: {
        method: "trap",
        design: "Confront the bursar with the blackmail note, matching blotter, and delayed corridor clock.",
        knowledge_revealed: "Only culprit knew timing",
        pass_condition: "The suspect cannot explain the matching blotter corner and delayed corridor clock.",
        evidence_clues: ["clue_1", "clue_2", "clue_3"],
      },
      fair_play: {
        all_clues_visible: true,
        no_special_knowledge_required: true,
        no_late_information: true,
        reader_can_solve: true,
        explanation: "Step 1 uses clue_1 and clue_2; step 2 uses clue_2 and clue_3.",
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
      prose_requirements: {
        discriminating_test_scene: {
          act_number: 3,
          scene_number: 4,
          required_elements: ["Execute trap", "Observe reaction", "Conclude guilt"],
          test_type: "trap",
        },
        suspect_clearance_scenes: [],
        culprit_revelation_scene: {
          act_number: 3,
          scene_number: 6,
          revelation_method: "Confrontation with evidence",
        },
        identity_rules: [],
        clue_to_scene_mapping: [
          { clue_id: "clue_1", act_number: 1, scene_number: 2, delivery_method: "Observation" },
          { clue_id: "clue_2", act_number: 2, scene_number: 3, delivery_method: "Interview" },
          { clue_id: "clue_3", act_number: 2, scene_number: 4, delivery_method: "Document" },
        ],
      },
    },
  };
}

function makeMockClientForAgent3Fallback(agent3Response: string, agent4Response: string) {
  const logger = {
    logRequest: vi.fn(async () => undefined),
    logResponse: vi.fn(async () => undefined),
    logError: vi.fn(async () => undefined),
  };

  return {
    getLogger: () => logger,
    getCostTracker: () => ({
      getSummary: () => ({ byAgent: { "Agent3-CMLGenerator": 0, "Agent4-Revision": 0 } }),
    }),
    chatWithRetry: vi.fn(async () => ({
      model: "test-model",
      content: agent3Response,
      latencyMs: 1,
      finishReason: "stop",
    })),
    chat: vi.fn(async () => ({
      model: "test-model",
      content: agent4Response,
      latencyMs: 1,
      finishReason: "stop",
    })),
  };
}

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
      expect(prompt.messages).toHaveLength(2); // system+developer combined, user
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

    it("forbids reaction-only discriminating-test proof", () => {
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.developer).toContain("Do NOT use detective-only behavioral shorthand as evidence");
      expect(prompt.developer).toContain("signals of guilt");
      expect(prompt.developer).toContain("Do NOT make the proof depend on reactions, defensiveness");
      expect(prompt.developer).toContain("Do NOT use procedure-only wrapper wording in discriminating_test.design");
      expect(prompt.user).toContain("FACT-FORWARD TEST DESIGN");
      expect(prompt.developer).toContain("Weak discriminating test design");
      expect(prompt.developer).toContain("Strong discriminating test design");
      expect(prompt.developer).toContain("Weak discriminating test");
      expect(prompt.developer).toContain("Strong discriminating test");
    });

    it("formats messages array correctly", () => {
      const prompt = buildCMLPrompt(baseInputs);

      expect(prompt.messages).toHaveLength(2);
      expect(prompt.messages[0].role).toBe("system");
      expect(prompt.messages[1].role).toBe("user");
      
      // System message should combine system + developer
      expect(prompt.messages[0].content).toContain(prompt.system);
      expect(prompt.messages[0].content).toContain(prompt.developer);
      
      expect(prompt.messages[1].content).toBe(prompt.user);
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

describe("Agent 3 -> Agent 4 Handoff", () => {
  it("preserves cast gender/role/moral_complexity and unknown fields through revision fallback", async () => {
    const base = buildValidCml();
    const invalidForAgent3 = JSON.parse(JSON.stringify(base));
    invalidForAgent3.CASE.false_assumption.type = "causal";

    const revisedFromAgent4 = JSON.parse(JSON.stringify(base));

    const client = makeMockClientForAgent3Fallback(
      JSON.stringify(invalidForAgent3),
      JSON.stringify(revisedFromAgent4)
    );

    const inputs: CMLPromptInputs = {
      decade: "1930s",
      location: "Country house",
      institution: "Private estate",
      tone: "Classic Golden Age",
      weather: "Fog",
      socialStructure: "Rigid class hierarchy",
      primaryAxis: "temporal",
      castSize: 1,
      castNames: ["Inspector Blake"],
      detectiveType: "Professional police detective",
      victimArchetype: "Wealthy aristocrat",
      complexityLevel: "moderate",
      mechanismFamilies: ["clock manipulation", "timeline confusion"],
      runId: "handoff-test-run",
      projectId: "handoff-test-project",
    };

    const result = await generateCML(client as any, inputs, undefined, 1);

    expect(result.revisedByAgent4).toBe(true);
    const cast0 = (result.cml as any).CASE.cast[0];
    expect(cast0.gender).toBe("female");
    expect(cast0.role).toBe("victim");
    expect(cast0.moral_complexity).toBe("Complicit in prior cover-up.");
    expect(cast0.nickname).toBe("Blake");
  });

  it("clamps enum-like fields through revision fallback", async () => {
    const base = buildValidCml();
    const invalidForAgent3 = JSON.parse(JSON.stringify(base));
    invalidForAgent3.CASE.false_assumption.type = "causal";

    const revisedFromAgent4 = JSON.parse(JSON.stringify(base));
    revisedFromAgent4.CASE.meta.crime_class.category = "kidnapping";
    revisedFromAgent4.CASE.false_assumption.type = "causal";
    revisedFromAgent4.CASE.cast[0].role = "janitor";
    revisedFromAgent4.CASE.cast[0].gender = "robot";
    revisedFromAgent4.CASE.culpability.culprit_count = 5;

    const client = makeMockClientForAgent3Fallback(
      JSON.stringify(invalidForAgent3),
      JSON.stringify(revisedFromAgent4)
    );

    const inputs: CMLPromptInputs = {
      decade: "1930s",
      location: "Country house",
      institution: "Private estate",
      tone: "Classic Golden Age",
      weather: "Fog",
      socialStructure: "Rigid class hierarchy",
      primaryAxis: "temporal",
      castSize: 1,
      castNames: ["Inspector Blake"],
      detectiveType: "Professional police detective",
      victimArchetype: "Wealthy aristocrat",
      complexityLevel: "moderate",
      mechanismFamilies: ["clock manipulation", "timeline confusion"],
      runId: "handoff-clamp-test-run",
      projectId: "handoff-clamp-test-project",
    };

    const result = await generateCML(client as any, inputs, undefined, 1);

    expect(result.revisedByAgent4).toBe(true);
    const cml = result.cml as any;
    expect(cml.CASE.meta.crime_class.category).toBe("murder");
    expect(cml.CASE.false_assumption.type).toBe("temporal");
    expect(cml.CASE.cast[0].role).toBe("suspect");
    expect(cml.CASE.cast[0].gender).toBe("non-binary");
    expect(cml.CASE.culpability.culprit_count).toBe(1);
  });
});

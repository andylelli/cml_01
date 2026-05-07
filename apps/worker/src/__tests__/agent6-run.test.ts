import { describe, expect, it } from "vitest";
import { __testables } from "../jobs/agents/agent6-run.js";

describe("agent6-run regenerated clue contracts", () => {
  it("enforces fair-play retry budget as a hard stop", () => {
    const budget = __testables.createFairPlayRetryBudgetTracker(0.15);

    budget.consume(0.10, "first retry");
    expect(() => budget.consume(0.06, "second retry")).toThrow(/cost limit reached/i);
  });

  it("fails when regenerated clues violate Agent 5 deterministic source-path contract", () => {
    const ctx = {
      cml: {
        CASE: {
          cast: [],
          inference_path: { steps: [{ observation: "Clock hands were moved." }] },
          discriminating_test: { evidence_clues: ["clue_anchor"] },
          culpability: { culprits: [] },
        },
      },
      clues: {
        clues: [
          {
            id: "clue_anchor",
            sourceInCML: "CASE.cast[99].alibi_window",
            description: "Aled Price was seen near the station before supper.",
            pointsTo: "Timeline inconsistency around station witness accounts.",
            placement: "mid",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_fill_early",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "The corridor carpet held damp marks by early evening.",
            pointsTo: "Supports sequence-of-movement reconstruction.",
            placement: "early",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_fill_late",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "A witness recalled footsteps near the clock room.",
            pointsTo: "Corroborates the movement timeline.",
            placement: "late",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
        ],
        redHerrings: [],
        clueTimeline: { early: ["clue_fill_early"], mid: ["clue_anchor"], late: ["clue_fill_late"] },
      },
      warnings: [],
      errors: [],
    } as any;

    expect(() => __testables.applyAgent5ContractsToRegeneratedClues(ctx, "unit")).toThrow(/source-path gate failed/i);
    expect(ctx.errors.some((e: string) => /deterministic contract \(unit\)/i.test(e))).toBe(true);
  });

  it("propagates deterministic synthesis warnings during regenerated clue validation", () => {
    const ctx = {
      cml: {
        CASE: {
          cast: [{ name: "Iwan Hale", alibi_window: "after supper" }],
          inference_path: { steps: [{ observation: "Grease marked the clock key slot." }] },
          discriminating_test: {
            design: "Use clock grease and timing mismatch to isolate culprit",
            evidence_clues: ["clue_clock_smudge"],
          },
          culpability: { culprits: [] },
        },
      },

      clues: {
        clues: [
          {
            id: "clue_seed_early",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "A damp overcoat hem brushed the vestibule skirting board.",
            pointsTo: "Supports movement sequencing between side entrance and gallery.",
            placement: "early",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_seed_mid",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "A housemaid logged an unlabeled parcel in the pantry ledger.",
            pointsTo: "Corroborates access-path ambiguity before evening roll call.",
            placement: "mid",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_seed_late",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "A porter recalled an unusual scraping noise in the hall.",
            pointsTo: "Supports timeline reconstruction during evening rounds.",
            placement: "late",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
        ],
        redHerrings: [],
        clueTimeline: {
          early: ["clue_seed_early"],
          mid: ["clue_seed_mid"],
          late: ["clue_seed_late"],
        },
      },
      warnings: [],
    } as any;

    __testables.applyAgent5ContractsToRegeneratedClues(ctx, "unit");

    expect(ctx.warnings.some((w: string) => /evidence-id deterministic synthesis/i.test(w))).toBe(true);
    expect(ctx.clues.clues.some((clue: any) => clue.id === "clue_clock_smudge")).toBe(true);
    expect(Array.isArray(ctx.allCoverageIssues)).toBe(true);
    expect(ctx.allCoverageIssues.length).toBeGreaterThan(0);
    expect(Array.isArray(ctx.coverageResult?.issues)).toBe(true);
    for (const issue of ctx.coverageResult.issues) {
      expect(
        ctx.allCoverageIssues.some((candidate: any) => String(candidate?.message ?? "") === String(issue?.message ?? "")),
      ).toBe(true);
    }
  });

  it("prefers current CML cast names over stale upstream cast names for structural revision context", () => {
    const ctx = {
      cml: {
        CASE: {
          cast: [{ name: "Cml Name One" }, { name: "Cml Name Two" }],
        },
      },
      cast: {
        cast: {
          characters: [{ name: "Stale Upstream Name" }],
        },
      },
    } as any;

    const names = __testables.deriveEffectiveCastNamesForStructuralRevision(ctx);
    expect(names).toEqual(["Cml Name One", "Cml Name Two"]);
  });

  it("classifies timing+parity critical combinations as structural before abstract-step heuristics", () => {
    const cml = {
      CASE: {
        inference_path: {
          steps: [
            { observation: "Short", required_evidence: ["One"] },
            { observation: "Also short", required_evidence: ["Two"] },
            { observation: "Adequate observation evidence for this step", required_evidence: ["Three", "Four"] },
          ],
        },
        constraint_space: {
          time: { anchors: ["a"], contradictions: ["b"] },
          access: { actors: ["c"] },
          physical: { traces: ["d"] },
        },
      },
    } as any;

    const fairPlayAudit = {
      violations: [
        { severity: "critical", rule: "Discriminating Test Timing" },
        { severity: "critical", rule: "Information Parity" },
      ],
    } as any;

    const failureClass = __testables.classifyFairPlayFailure(
      { hasCriticalGaps: false, issues: [], coverageMap: new Map(), uncoveredSteps: [] },
      fairPlayAudit,
      cml,
    );
    expect(failureClass).toBe("inference_path_abstract");
  });

  it("derives blind-reader remediation phrases that force culprit-unique named evidence", () => {
    const phrases = __testables.deriveBlindReaderRequiredCluePhrases(
      ["Timeline around the clock tampering is unclear."],
      "Sylvia Trent",
      "Agnes Pike",
    );

    const joined = phrases.join(" ");
    expect(joined).toContain("points uniquely to culprit Sylvia Trent");
    expect(joined).toContain("explicitly name Sylvia Trent");
    expect(joined).toContain("Eliminates Agnes Pike because");
  });

  it("still emits culprit-unique phrase when blind reader suspect is absent", () => {
    const phrases = __testables.deriveBlindReaderRequiredCluePhrases(
      ["Need clearer motive evidence."],
      "Eleanor Voss",
      "",
    );

    const joined = phrases.join(" ");
    expect(joined).toContain("points uniquely to culprit Eleanor Voss");
    expect(joined).toContain("explicitly name Eleanor Voss");
  });

  it("derives strict paired directives for logical deducibility + discriminating timing failures", () => {
    const fairPlayAudit = {
      overallStatus: "fail",
      violations: [
        {
          severity: "critical",
          rule: "Logical Deducibility",
          description: "Reader cannot infer clock tampering chain from available clues.",
          suggestion: "Add earlier contradiction evidence.",
        },
        {
          severity: "critical",
          rule: "Discriminating Test Timing",
          description: "Test relies on facts first revealed in Act III.",
          suggestion: "Move supporting clues before test.",
        },
      ],
      warnings: [],
      recommendations: [],
    } as any;

    const cml = {
      CASE: {
        culpability: { culprits: ["Sylvia Trent"] },
        discriminating_test: {
          design: "Cross-check grease traces against shifted chime order.",
          knowledge_revealed: "Clock stoppage was staged by deliberate tampering.",
        },
        inference_path: {
          steps: [
            {
              required_evidence: [
                "Grease in key slot before supper.",
                "Witness heard false chime sequence.",
              ],
            },
          ],
        },
      },
    } as any;

    const phrases = __testables.deriveRequiredCluePhrases(fairPlayAudit, cml);
    const joined = phrases.join(" ");

    expect(joined).toContain("PAIR CONTRACT");
    expect(joined).toContain("observation -> correction -> elimination");
    expect(joined).toContain("clue_mechanism_visibility_core");
    expect(joined).toContain("clue_core_elimination_chain");
  });

  it("builds bounded fair-play feedback payload with acceptance summary and delta scope", () => {
    const fairPlayAudit = {
      overallStatus: "fail",
      violations: [
        {
          severity: "critical",
          rule: "Logical Deducibility",
          description: "Missing contradiction chain.",
          suggestion: "Add early contradiction clue.",
        },
      ],
      warnings: ["existing warning"],
      recommendations: ["existing recommendation"],
    } as any;

    const payload = __testables.buildFairPlayFeedbackPayload(fairPlayAudit, {
      CASE: {
        discriminating_test: {
          design: "Clock-key trace confrontation.",
          evidence_clues: ["clue_clock_trace"],
        },
      },
    } as any, {
      clues: [
        { id: "clue_seed_keep" },
        { id: "clue_clock_trace" },
        { id: "clue_mechanism_visibility_core" },
      ],
    } as any);

    expect(payload.warnings.some((entry: string) => /first-pass acceptance contract/i.test(entry))).toBe(true);
    expect(payload.warnings.some((entry: string) => /unified retry contract/i.test(entry))).toBe(true);
    expect(payload.recommendations).toEqual(["existing recommendation"]);
    expect(payload.violationCodes).toEqual(["logical_deducibility"]);
    expect(payload.targetedClueIds).toEqual(expect.arrayContaining([
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
      "clue_clock_trace",
    ]));
    expect(payload.preserveClueIds).toEqual(expect.arrayContaining(["clue_seed_keep"]));
    expect(payload.preserveClueIds).not.toContain("clue_clock_trace");
    expect(payload.requiredCluePhrases.join(" ")).toContain("clue_core_contradiction_chain");
    expect(payload.requiredCluePhrases.join(" ")).toContain("DISCRIMINATING ID PARITY CONTRACT");
    expect(payload.castPathBindingRules.join(" ")).toContain("CASE.cast[N].*");
    expect(payload.castPathNameIndexMap).toEqual([]);
  });

  it("forwards strict Agent 5 retry contracts in fair-play feedback payload", () => {
    const fairPlayAudit = {
      overallStatus: "fail",
      violations: [
        {
          severity: "critical",
          rule: "Clue Visibility",
          description: "Maintenance-log clue arrives too late.",
          suggestion: "Move the clue earlier.",
        },
      ],
      warnings: [],
      recommendations: [],
    } as any;

    const payload = __testables.buildFairPlayFeedbackPayload(fairPlayAudit, {
      CASE: {
        cast: [
          {
            name: "Iwan Hale",
            access_plausibility: "easy",
            alibi_window: "in the pantry after supper",
            evidence_sensitivity: ["clock grease"],
          },
          {
            name: "Agnes Pike",
            access_plausibility: "limited",
            alibi_window: "at the scullery door",
            evidence_sensitivity: [],
          },
        ],
        culpability: { culprits: ["Iwan Hale"] },
        discriminating_test: {
          design: "Compare the maintenance log against Iwan Hale's access window.",
          evidence_clues: ["clue_clock_trace"],
        },
        inference_path: {
          steps: [
            {
              observation: "Grease marked the clock key slot before supper.",
              correction: "The displayed time was staged.",
              required_evidence: ["Witness heard a false chime sequence."],
            },
          ],
        },
        prose_requirements: {
          clue_to_scene_mapping: [
            { clue_id: "clue_clock_trace" },
          ],
        },
        quality_controls: {
          clue_visibility_requirements: {
            late_clues_min: 1,
          },
        },
      },
    } as any, {
      clues: [
        { id: "clue_seed_keep" },
        { id: "clue_clock_trace" },
      ],
    } as any);

    expect(payload.strictSourcePaths).toEqual(expect.arrayContaining([
      "CASE.inference_path.steps[0].observation",
      "CASE.discriminating_test.evidence_clues[0]",
    ]));
    expect(payload.requiredIdToSourceMappings).toEqual(expect.arrayContaining([
      { id: "clue_clock_trace", sourceInCML: "CASE.discriminating_test.evidence_clues[0]" },
    ]));
    expect(payload.requiredStepCoverageFloors).toEqual([
      { step: 1, requireContradiction: true, requireMapped: true },
    ]);
    expect(payload.requiredLateClueSlot).toEqual({
      id: "clue_late_optional_slot_1",
      placement: "late",
      criticality: "optional",
    });
    expect(payload.requiredDirectCulpritClue).toMatchObject({
      id: "clue_culprit_direct_iwan_hale",
      culpritName: "Iwan Hale",
    });
    expect(payload.requiredDirectCulpritClue?.allowedSourcePaths).toEqual(expect.arrayContaining([
      "CASE.cast[0].access_plausibility",
    ]));
  });

  it("includes cast index map in fair-play feedback payload when CML cast is available", () => {
    const fairPlayAudit = {
      overallStatus: "fail",
      violations: [],
      warnings: [],
      recommendations: [],
    } as any;

    const payload = __testables.buildFairPlayFeedbackPayload(fairPlayAudit, {
      CASE: {
        cast: [{ name: "Iwan Hale" }, { name: "Agnes Pike" }],
      },
    } as any);

    expect(payload.castPathNameIndexMap).toEqual([
      { index: 0, name: "Iwan Hale" },
      { index: 1, name: "Agnes Pike" },
    ]);
  });

  it("syncs essential repaired clues into clue-to-scene mapping before re-audit", () => {
    const cml = {
      CASE: {
        discriminating_test: {
          evidence_clues: ["clue_1"],
        },
        prose_requirements: {
          discriminating_test_scene: {
            act_number: 3,
            scene_number: 4,
          },
          clue_to_scene_mapping: [
            { clue_id: "clue_1", act_number: 1, scene_number: 1, delivery_method: "Direct observation" },
          ],
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_1",
          placement: "early",
          criticality: "essential",
          evidenceType: "observation",
          category: "temporal",
        },
        {
          id: "clue_fingerprint",
          placement: "mid",
          criticality: "essential",
          evidenceType: "observation",
          category: "physical",
        },
        {
          id: "clue_late_optional_slot_1",
          placement: "late",
          criticality: "optional",
          evidenceType: "observation",
          category: "temporal",
        },
      ],
      clueTimeline: {
        early: ["clue_1"],
        mid: ["clue_fingerprint"],
        late: ["clue_late_optional_slot_1"],
      },
    } as any;

    const updates = __testables.synchronizeClueTraceabilityFromCurrentClues(cml, clues);

    expect(updates).toContain("clue_fingerprint -> Act 2, Scene 1");
    expect(cml.CASE.prose_requirements.clue_to_scene_mapping).toEqual(expect.arrayContaining([
      expect.objectContaining({
        clue_id: "clue_fingerprint",
        act_number: 2,
        scene_number: 1,
        delivery_method: "Direct observation",
      }),
    ]));
    expect(cml.CASE.prose_requirements.clue_to_scene_mapping.some((entry: any) => entry.clue_id === "clue_late_optional_slot_1")).toBe(false);
  });

  it("caps pre-test clue mapping scenes instead of assigning scene numbers beyond the discriminating-test budget", () => {
    const cml = {
      CASE: {
        prose_requirements: {
          discriminating_test_scene: {
            act_number: 3,
            scene_number: 4,
          },
          clue_to_scene_mapping: [],
        },
      },
    } as any;

    const clues = {
      clues: [
        { id: "clue_1", placement: "mid", criticality: "essential", evidenceType: "observation", category: "temporal" },
        { id: "clue_2", placement: "mid", criticality: "essential", evidenceType: "observation", category: "temporal" },
        { id: "clue_3", placement: "mid", criticality: "essential", evidenceType: "observation", category: "temporal" },
        { id: "clue_4", placement: "mid", criticality: "essential", evidenceType: "observation", category: "temporal" },
        { id: "clue_5", placement: "mid", criticality: "essential", evidenceType: "observation", category: "temporal" },
      ],
      clueTimeline: {
        early: [],
        mid: ["clue_1", "clue_2", "clue_3", "clue_4", "clue_5"],
        late: [],
      },
    } as any;

    __testables.synchronizeClueTraceabilityFromCurrentClues(cml, clues);

    const mappedScenes = cml.CASE.prose_requirements.clue_to_scene_mapping.map((entry: any) => Number(entry.scene_number));
    expect(Math.max(...mappedScenes)).toBe(3);
    expect(cml.CASE.prose_requirements.clue_to_scene_mapping).toEqual(expect.arrayContaining([
      expect.objectContaining({ clue_id: "clue_4", act_number: 2, scene_number: 3 }),
      expect.objectContaining({ clue_id: "clue_5", act_number: 2, scene_number: 3 }),
    ]));
  });

  it("injects parity bridge clues with inference-step source paths and case-grounded phrasing", () => {
    const cml = {
      CASE: {
        inference_path: {
          steps: [
            {
              observation: "Grease streaks appear around the clock face fasteners.",
              correction: "The stopped time is staged by deliberate tampering.",
            },
          ],
        },
        discriminating_test: {
          design: "Use grease traces and timing mismatch to prove staged clock stoppage.",
          knowledge_revealed: "Clock stoppage was staged by tampering with the movement.",
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_seed",
          sourceInCML: "CASE.inference_path.steps[0].observation",
          description: "A faint smear of grease marked the brass bezel.",
          pointsTo: "Someone handled the clock mechanism recently.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: ["clue_seed"], late: [] },
    } as any;

    const bridgeId = __testables.ensureParityBridgeClue(cml, clues);
    expect(bridgeId).toBeTruthy();

    const bridge = clues.clues.find((clue: any) => clue.id === bridgeId);
    expect(bridge).toBeTruthy();
    expect(String(bridge.sourceInCML)).toMatch(/^CASE\.inference_path\.steps\[\d+\]\.(observation|correction)$/);
    expect(bridge.placement).toBe("early");
    expect(bridge.criticality).toBe("essential");
    expect(String(bridge.description).toLowerCase()).toContain("clock stoppage");
    expect(String(bridge.description).toLowerCase()).not.toContain("reader");
    expect(String(bridge.description).toLowerCase()).not.toContain("pre-test");
    expect(String(bridge.pointsTo).toLowerCase()).toContain("conclusion that");
    expect(String(bridge.pointsTo).toLowerCase()).not.toContain("reader");
    expect(String(bridge.pointsTo).toLowerCase()).not.toContain("discriminating test");
    expect(Number(bridge.supportsInferenceStep)).toBeGreaterThanOrEqual(1);
    expect(Array.isArray(clues.clueTimeline.early)).toBe(true);
    expect(clues.clueTimeline.early).toContain(bridgeId);
  });

  it("synthesizes early/mid essential backstop clues for uncovered inference steps", () => {
    const cml = {
      CASE: {
        inference_path: {
          steps: [
            {
              observation: "Soot dust was found inside the clock back panel.",
              correction: "The clock mechanism was accessed shortly before discovery.",
              effect: "Narrows access to suspects with study access.",
              required_evidence: ["CASE.inference_path.steps[0].observation"],
            },
            {
              observation: "A witness heard the study door at twenty past ten.",
              correction: "The reported chime time conflicts with the staged clock display.",
              effect: "Eliminates suspects relying on the false clock time.",
              required_evidence: ["clue_noncanonical_anchor"],
            },
          ],
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_seed",
          sourceInCML: "CASE.inference_path.steps[0].observation",
          description: "A faint soot smear marked the brass hinge.",
          pointsTo: "Someone handled the rear panel recently.",
          placement: "late",
          criticality: "supporting",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: [], late: ["clue_seed"] },
    } as any;

    const repairs = __testables.ensureCriticalFairPlayBackstopClues(cml, clues);
    expect(repairs.length).toBeGreaterThanOrEqual(2);

    const step1Backstop = clues.clues.find((clue: any) => clue.id.startsWith("clue_fp_backstop_step_1"));
    const step2Backstop = clues.clues.find((clue: any) => clue.id.startsWith("clue_fp_backstop_step_2"));

    expect(step1Backstop).toBeTruthy();
    expect(step2Backstop).toBeTruthy();
    expect(step1Backstop.placement).toBe("early");
    expect(step2Backstop.placement).toBe("early");
    expect(step1Backstop.criticality).toBe("essential");
    expect(step2Backstop.criticality).toBe("essential");
    expect(String(step1Backstop.description).toLowerCase()).toContain("soot dust was found inside the clock back panel");
    expect(String(step1Backstop.description).toLowerCase()).not.toContain("reader-visible");
    expect(String(step1Backstop.description).toLowerCase()).not.toContain("inference step");
    expect(String(step1Backstop.pointsTo).toLowerCase()).toContain("clock mechanism was accessed shortly before discovery");
    expect(String(step2Backstop.sourceInCML)).toMatch(/^CASE\.inference_path\.steps\[1\]\.(observation|correction)$/);
    expect(clues.clueTimeline.early).toContain(step1Backstop.id);
    expect(clues.clueTimeline.early).toContain(step2Backstop.id);
  });

  it("adds grounded contradiction backstop clues when a step lacks early contradiction coverage", () => {
    const cml = {
      CASE: {
        inference_path: {
          steps: [
            {
              observation: "A soot smear sat inside the clock hatch.",
              correction: "The clock face was opened before the body was discovered.",
              effect: "Undercuts the false time-of-death account.",
            },
          ],
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_seed_early",
          sourceInCML: "CASE.inference_path.steps[0].observation",
          description: "A faint soot smear marked the clock hatch.",
          pointsTo: "Someone handled the hatch recently.",
          placement: "early",
          criticality: "essential",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
      ],
      redHerrings: [],
      clueTimeline: { early: ["clue_seed_early"], mid: [], late: [] },
    } as any;

    const repairs = __testables.ensureCriticalFairPlayBackstopClues(cml, clues);
    expect(repairs.some((entry: string) => /contradiction clue/i.test(entry))).toBe(true);

    const contradictionClue = clues.clues.find((clue: any) => clue.id.startsWith("clue_fp_contradiction_step_1"));
    expect(contradictionClue).toBeTruthy();
    expect(String(contradictionClue.description).toLowerCase()).toContain("soot smear sat inside the clock hatch");
    expect(String(contradictionClue.description).toLowerCase()).not.toContain("reader-visible");
    expect(String(contradictionClue.description).toLowerCase()).not.toContain("inference step");
    expect(String(contradictionClue.pointsTo).toLowerCase()).toContain("clock face was opened before the body was discovered");
    expect(String(contradictionClue.pointsTo).toLowerCase()).not.toContain("supports correction");
    expect(contradictionClue.evidenceType).toBe("contradiction");
  });

  it("keeps regenerated clues contract-safe during parity remediation", () => {
    const ctx = {
      cml: {
        CASE: {
          cast: [{ name: "Iwan Hale", alibi_window: "after supper" }],
          inference_path: {
            steps: [
              {
                observation: "Grease marked the clock key slot.",
                correction: "The clock face was intentionally tampered with before discovery.",
              },
            ],
          },
          discriminating_test: {
            design: "Use clock grease and timing mismatch to isolate culprit",
            knowledge_revealed: "Clock stoppage was staged by deliberate tampering.",
            evidence_clues: ["clue_clock_smudge"],
          },
          culpability: { culprits: [] },
        },
      },
      clues: {
        clues: [
          {
            id: "clue_seed_early",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "Fresh grease marked the clock key slot after tea.",
            pointsTo: "Supports timeline tampering tied to access opportunity.",
            placement: "early",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_seed_mid",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "The same residue appeared on nearby brass fittings.",
            pointsTo: "Corroborates deliberate clock handling.",
            placement: "mid",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_seed_late",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "A porter recalled an unusual scraping noise in the hall.",
            pointsTo: "Supports timeline reconstruction during evening rounds.",
            placement: "late",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
        ],
        redHerrings: [],
        clueTimeline: {
          early: ["clue_seed_early"],
          mid: ["clue_seed_mid"],
          late: ["clue_seed_late"],
        },
      },
      warnings: [],
      errors: [],
    } as any;

    __testables.applyAgent5ContractsToRegeneratedClues(ctx, "unit-parity");

    const parityBridge = ctx.clues.clues.find((clue: any) => String(clue.id).startsWith("clue_parity_bridge"));
    if (parityBridge) {
      expect(String(parityBridge.sourceInCML)).toMatch(/^CASE\.inference_path\.steps\[\d+\]\.(observation|correction)$/);
    }

    const badSource = ctx.clues.clues.find((clue: any) =>
      String(clue?.sourceInCML ?? "").includes("CASE.discriminating_test.knowledge_revealed"),
    );
    expect(badSource).toBeUndefined();
    expect(ctx.errors.length).toBe(0);
  });
});

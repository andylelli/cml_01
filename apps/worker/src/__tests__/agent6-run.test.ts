import { describe, expect, it } from "vitest";
import { __testables } from "../jobs/agents/agent6-run.js";

describe("agent6-run regenerated clue contracts", () => {
  it("repairs an unrescuable regenerated source path instead of aborting the contract (repair-not-abort)", () => {
    // Previously an invalid regenerated sourceInCML hard-failed the run via the source-path gate. The
    // gate is now repair-not-abort: a path no targeted heuristic can rescue is anchored to a valid CML
    // location and the regeneration continues.
    const ctx = {
      cml: {
        CASE: {
          cast: [{ name: "Iwan Hale", alibi_window: "after supper" }],
          inference_path: { steps: [{ observation: "Grease marked the clock key slot." }] },
          discriminating_test: {
            design: "Use clock grease and timing mismatch to isolate culprit",
            evidence_clues: ["clue_anchor"],
          },
          culpability: { culprits: [] },
        },
      },
      clues: {
        clues: [
          {
            id: "clue_anchor",
            sourceInCML: "CASE.entirely.made.up.path", // no targeted heuristic (cast/step/clamp) can rescue this shape
            description: "Aled Price was seen near the station before supper.",
            pointsTo: "Timeline inconsistency around station witness accounts.",
            placement: "early",
            criticality: "essential",
            evidenceType: "observation",
            supportsInferenceStep: 1,
          },
          {
            id: "clue_fill_mid",
            sourceInCML: "CASE.inference_path.steps[0].observation",
            description: "The corridor carpet held damp marks by early evening.",
            pointsTo: "Supports sequence-of-movement reconstruction.",
            placement: "mid",
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
        clueTimeline: { early: ["clue_anchor"], mid: ["clue_fill_mid"], late: ["clue_fill_late"] },
      },
      warnings: [],
      errors: [],
    } as any;

    expect(() => __testables.applyAgent5ContractsToRegeneratedClues(ctx, "unit")).not.toThrow();
    // the unrescuable path is repaired to a real CML location rather than aborting the run
    const anchor = ctx.clues.clues.find((c: any) => c.id === "clue_anchor");
    expect(anchor.sourceInCML).not.toBe("CASE.entirely.made.up.path");
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

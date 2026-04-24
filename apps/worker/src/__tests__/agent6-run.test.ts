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

  it("builds strict fair-play feedback payload with acceptance summary", () => {
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
        discriminating_test: { design: "Clock-key trace confrontation." },
      },
    } as any);

    expect(payload.warnings.some((entry: string) => /first-pass acceptance contract/i.test(entry))).toBe(true);
    expect(payload.recommendations.some((entry: string) => /first-pass acceptance contract/i.test(entry))).toBe(true);
    expect(payload.requiredCluePhrases.join(" ")).toContain("clue_core_contradiction_chain");
  });

  it("injects parity bridge clues with inference-step source paths and pre-test linkage", () => {
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
    expect(String(bridge.pointsTo).toLowerCase()).toContain("before the discriminating test");
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
    expect(String(step2Backstop.sourceInCML)).toMatch(/^CASE\.inference_path\.steps\[1\]\.(observation|correction)$/);
    expect(clues.clueTimeline.early).toContain(step1Backstop.id);
    expect(clues.clueTimeline.early).toContain(step2Backstop.id);
  });

  it("adds reader-visible clues from critical parity/withholding audit language", () => {
    const cml = {
      CASE: {
        inference_path: {
          steps: [
            {
              observation: "A bruise on the latch suggests forced handling.",
              correction: "The clock casing was opened intentionally before the body was found.",
            },
          ],
        },
        discriminating_test: {
          design: "Match hidden weight placement with latch marks.",
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_seed",
          sourceInCML: "CASE.inference_path.steps[0].observation",
          description: "A latch bruise marked the rear plate.",
          pointsTo: "Someone opened the casing recently.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: ["clue_seed"], late: [] },
    } as any;

    const fairPlayAudit = {
      violations: [
        {
          severity: "critical",
          rule: "No Withholding",
          description: "The detective has knowledge about the hidden weight before the reader.",
        },
      ],
    } as any;

    const repairs = __testables.synthesizeAuditVisibilityClues(cml, clues, fairPlayAudit);
    expect(repairs.length).toBeGreaterThan(0);

    const visibilityClue = clues.clues.find((clue: any) => clue.id.startsWith("clue_audit_visibility"));
    expect(visibilityClue).toBeTruthy();
    expect(visibilityClue.placement).toBe("early");
    expect(visibilityClue.criticality).toBe("essential");
    expect(String(visibilityClue.description).toLowerCase()).toContain("hidden weight");
    expect(clues.clueTimeline.early).toContain(visibilityClue.id);
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

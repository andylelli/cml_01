import { describe, expect, it } from "vitest";
import { __testables } from "../jobs/mystery-orchestrator.js";

describe("mystery orchestrator fix coverage", () => {
  it("deterministic clue pre-assignment reaches minimum coverage", () => {
    const narrative = {
      acts: [
        { actNumber: 1, scenes: [{ sceneNumber: 1 }, { sceneNumber: 2 }, { sceneNumber: 3 }, { sceneNumber: 4 }] },
        { actNumber: 2, scenes: [{ sceneNumber: 5 }, { sceneNumber: 6 }, { sceneNumber: 7 }] },
        { actNumber: 3, scenes: [{ sceneNumber: 8 }, { sceneNumber: 9 }, { sceneNumber: 10 }] },
      ],
    } as any;

    const cml = {
      CASE: {
        prose_requirements: {
          clue_to_scene_mapping: [{ clue_id: "c1", act_number: 1, scene_number: 2 }],
        },
      },
    } as any;

    const clues = {
      clues: [
        { id: "c1", criticality: "essential", placement: "early" },
        { id: "c2", criticality: "essential", placement: "mid" },
        { id: "c3", criticality: "supporting", placement: "late" },
        { id: "c4", criticality: "supporting", placement: "early" },
      ],
      clueTimeline: { early: ["c1", "c4"], mid: ["c2"], late: ["c3"] },
    } as any;

    const stats = __testables.applyDeterministicCluePreAssignment(narrative, cml, clues, 0.6);
    expect(stats.after).toBeGreaterThanOrEqual(stats.minRequired);

    const mappedScene = (narrative.acts[0].scenes as any[]).find((s) => s.sceneNumber === 2);
    expect(mappedScene?.cluesRevealed).toContain("c1");
  });

  it("scene count floor rejects total and per-act shrink", () => {
    const baseline = {
      acts: [
        { actNumber: 1, scenes: [{ sceneNumber: 1 }, { sceneNumber: 2 }] },
        { actNumber: 2, scenes: [{ sceneNumber: 3 }, { sceneNumber: 4 }] },
        { actNumber: 3, scenes: [{ sceneNumber: 5 }, { sceneNumber: 6 }] },
      ],
    } as any;

    const candidate = {
      acts: [
        { actNumber: 1, scenes: [{ sceneNumber: 1 }, { sceneNumber: 2 }] },
        { actNumber: 2, scenes: [{ sceneNumber: 3 }] },
        { actNumber: 3, scenes: [{ sceneNumber: 4 }, { sceneNumber: 5 }] },
      ],
    } as any;

    const lock = __testables.captureNarrativeSceneCountSnapshot(baseline);
    const check = __testables.checkNarrativeSceneCountFloor(candidate, lock);

    expect(check.ok).toBe(false);
    expect(check.message).toContain("changed");
  });

  it("deterministic scene-count rebalance restores exact medium target", () => {
    const underfilled = {
      acts: [
        {
          actNumber: 1,
          title: "Act I",
          purpose: "Setup",
          scenes: Array.from({ length: 7 }, (_, i) => ({
            sceneNumber: i + 1,
            act: 1,
            title: `A1-${i + 1}`,
            setting: { location: "Hall", timeOfDay: "Night", atmosphere: "Tense" },
            characters: ["Detective"],
            purpose: "Advance setup",
            cluesRevealed: i % 2 === 0 ? ["c1"] : [],
            dramaticElements: {},
            summary: "Setup beat.",
            estimatedWordCount: 1200,
          })),
        },
        {
          actNumber: 2,
          title: "Act II",
          purpose: "Investigation",
          scenes: Array.from({ length: 10 }, (_, i) => ({
            sceneNumber: 8 + i,
            act: 2,
            title: `A2-${i + 1}`,
            setting: { location: "Library", timeOfDay: "Evening", atmosphere: "Uneasy" },
            characters: ["Detective", "Suspect"],
            purpose: "Advance investigation",
            cluesRevealed: i % 3 === 0 ? ["c2"] : [],
            dramaticElements: {},
            summary: "Investigation beat.",
            estimatedWordCount: 1300,
          })),
        },
        {
          actNumber: 3,
          title: "Act III",
          purpose: "Resolution",
          scenes: Array.from({ length: 7 }, (_, i) => ({
            sceneNumber: 18 + i,
            act: 3,
            title: `A3-${i + 1}`,
            setting: { location: "Study", timeOfDay: "Dawn", atmosphere: "Charged" },
            characters: ["Detective", "Culprit"],
            purpose: "Advance resolution",
            cluesRevealed: i === 0 ? ["c3"] : [],
            dramaticElements: {},
            summary: "Resolution beat.",
            estimatedWordCount: 1400,
          })),
        },
      ],
      totalScenes: 24,
      estimatedTotalWords: 0,
      pacingNotes: [],
      cost: 0,
      durationMs: 0,
    } as any;

    const clues = {
      clues: [
        { id: "c1", criticality: "essential", placement: "early" },
        { id: "c2", criticality: "essential", placement: "mid" },
        { id: "c3", criticality: "supporting", placement: "late" },
      ],
      clueTimeline: { early: ["c1"], mid: ["c2"], late: ["c3"] },
    } as any;

    const result = __testables.rebalanceNarrativeSceneCountsDeterministically(underfilled, 30, clues);
    expect(result.changed).toBe(true);

    const snapshot = __testables.captureNarrativeSceneCountSnapshot(underfilled);
    expect(snapshot.totalScenes).toBe(30);
    expect(snapshot.perAct[1]).toBe(8);
    expect(snapshot.perAct[2]).toBe(14);
    expect(snapshot.perAct[3]).toBe(8);
  });

  it("prose post-processing rewrites scaffold leakage and dedups repeated long paragraphs", () => {
    const scaffold = "At the old hall, the smell of oil and wet stone mixed with wind and weather, creating an atmosphere ripe for revelation.";
    const repeated = "This is an intentionally long repeated paragraph used for deterministic dedup testing. ".repeat(4);

    const prose = {
      chapters: [
        { title: "Ch1", paragraphs: [scaffold, repeated] },
        { title: "Ch2", paragraphs: [repeated] },
      ],
    } as any;

    const locationProfiles = [{ name: "The Hall", place: "Harrow", country: "England" }] as any;
    const processed = __testables.applyDeterministicProsePostProcessing(prose, locationProfiles);

    expect(processed.chapters[0].paragraphs.some((p: string) => /atmosphere\s+ripe\s+for\s+revelation/i.test(p))).toBe(false);
    expect(processed.chapters[1].paragraphs[0]).not.toBe(repeated);
  });

  it("suspect elimination classifier recognizes alias error keys", () => {
    const err = { type: "suspect_elimination_coverage_incomplete", message: "coverage missing" };
    expect(__testables.isSuspectEliminationCoverageError(err)).toBe(true);
  });

  it("downgrades standalone Logical Deducibility critical flag when deterministic coverage has no structural corroboration", () => {
    const result = __testables.deriveStructuralBlockingFairPlayViolations({
      fairPlayAudit: {
        overallStatus: "fail",
        checks: [],
        violations: [
          {
            severity: "critical",
            rule: "Logical Deducibility",
            description: "Reader cannot deduce culprit.",
            location: "inference_path",
            suggestion: "Tighten clue chain and elimination logic.",
          },
        ],
        warnings: [],
        recommendations: [],
        summary: "",
        cost: 0,
        durationMs: 0,
      },
      coverageResult: {
        hasCriticalGaps: false,
        uncoveredSteps: [],
      },
      allCoverageIssues: [],
    });

    expect(result.blockingViolations).toHaveLength(0);
    expect(result.downgradedLogicalDeducibility).toBe(true);
  });

  it("keeps Logical Deducibility critical flag blocking when deterministic coverage corroborates structural gaps", () => {
    const result = __testables.deriveStructuralBlockingFairPlayViolations({
      fairPlayAudit: {
        overallStatus: "fail",
        checks: [],
        violations: [
          {
            severity: "critical",
            rule: "Logical Deducibility",
            description: "Reader cannot deduce culprit.",
            location: "inference_path",
            suggestion: "Tighten clue chain and elimination logic.",
          },
        ],
        warnings: [],
        recommendations: [],
        summary: "",
        cost: 0,
        durationMs: 0,
      },
      coverageResult: {
        hasCriticalGaps: true,
        uncoveredSteps: [1],
      },
      allCoverageIssues: [],
    });

    expect(result.blockingViolations).toHaveLength(1);
    expect(result.blockingViolations[0].rule).toBe("Logical Deducibility");
    expect(result.downgradedLogicalDeducibility).toBe(false);
  });

  it("downgrades clue visibility and no withholding when deterministic traceability shows evidence is pre-test", () => {
    const result = __testables.deriveStructuralBlockingFairPlayViolations({
      fairPlayAudit: {
        overallStatus: "fail",
        checks: [],
        violations: [
          {
            severity: "critical",
            rule: "Clue Visibility",
            description: "Essential clue allegedly arrives too late.",
            location: "clue_1",
            suggestion: "Move the clue earlier.",
          },
          {
            severity: "critical",
            rule: "No Withholding",
            description: "Reader allegedly lacks detective parity.",
            location: "clue_2",
            suggestion: "Reveal the fact earlier.",
          },
        ],
        warnings: [],
        recommendations: [],
        summary: "",
        cost: 0,
        durationMs: 0,
      },
      coverageResult: {
        hasCriticalGaps: false,
        uncoveredSteps: [],
      },
      allCoverageIssues: [],
      cml: {
        CASE: {
          discriminating_test: {
            evidence_clues: ["clue_1", "clue_2"],
          },
          prose_requirements: {
            discriminating_test_scene: {
              act_number: 3,
              scene_number: 4,
            },
            clue_to_scene_mapping: [
              { clue_id: "clue_1", act_number: 1, scene_number: 2 },
              { clue_id: "clue_2", act_number: 2, scene_number: 1 },
            ],
          },
        },
      } as any,
      clues: {
        clues: [
          { id: "clue_1", placement: "early", criticality: "essential" },
          { id: "clue_2", placement: "mid", criticality: "essential" },
        ],
      } as any,
    });

    expect(result.blockingViolations).toHaveLength(0);
    expect(result.downgradedLogicalDeducibility).toBe(false);
  });

  it("keeps clue visibility blocking when deterministic traceability still shows late or unmapped evidence", () => {
    const result = __testables.deriveStructuralBlockingFairPlayViolations({
      fairPlayAudit: {
        overallStatus: "fail",
        checks: [],
        violations: [
          {
            severity: "critical",
            rule: "Clue Visibility",
            description: "Essential clue arrives too late.",
            location: "clue_1",
            suggestion: "Move the clue earlier.",
          },
        ],
        warnings: [],
        recommendations: [],
        summary: "",
        cost: 0,
        durationMs: 0,
      },
      coverageResult: {
        hasCriticalGaps: false,
        uncoveredSteps: [],
      },
      allCoverageIssues: [],
      cml: {
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
              { clue_id: "clue_1", act_number: 3, scene_number: 4 },
            ],
          },
        },
      } as any,
      clues: {
        clues: [
          { id: "clue_1", placement: "late", criticality: "essential" },
        ],
      } as any,
    });

    expect(result.blockingViolations).toHaveLength(1);
    expect(result.blockingViolations[0].rule).toBe("Clue Visibility");
  });

  it("early structural abort triggers when fair-play blocking violations remain after Agent 6", () => {
    const decision = __testables.evaluateEarlyStructuralAbort({
      fairPlayAudit: {
        overallStatus: "fail",
        checks: [],
        violations: [
          {
            severity: "critical",
            rule: "Clue Visibility",
            description: "Essential clue arrives too late.",
            location: "clue_1",
            suggestion: "Move the clue earlier.",
          },
        ],
        warnings: [],
        recommendations: [],
        summary: "",
        cost: 0,
        durationMs: 0,
      },
      coverageResult: {
        hasCriticalGaps: true,
        uncoveredSteps: [1],
      },
      allCoverageIssues: [],
      cml: {
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
              { clue_id: "clue_1", act_number: 3, scene_number: 4 },
            ],
          },
        },
      } as any,
      clues: {
        clues: [{ id: "clue_1", placement: "late", criticality: "essential" }],
      } as any,
    });

    expect(decision.shouldAbort).toBe(true);
    expect(decision.blockingRules).toContain("Clue Visibility");
  });

  it("early structural abort stays open when only uncorroborated logical deducibility remains", () => {
    const decision = __testables.evaluateEarlyStructuralAbort({
      fairPlayAudit: {
        overallStatus: "fail",
        checks: [],
        violations: [
          {
            severity: "critical",
            rule: "Logical Deducibility",
            description: "Reader cannot deduce culprit.",
            location: "inference_path",
            suggestion: "Tighten elimination chain.",
          },
        ],
        warnings: [],
        recommendations: [],
        summary: "",
        cost: 0,
        durationMs: 0,
      },
      coverageResult: {
        hasCriticalGaps: false,
        uncoveredSteps: [],
      },
      allCoverageIssues: [],
    });

    expect(decision.shouldAbort).toBe(false);
    expect(decision.downgradedLogicalDeducibility).toBe(true);
  });
});

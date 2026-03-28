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
});

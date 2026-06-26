import { describe, it, expect } from "vitest";
import { findUnplantedDiscriminatingClues } from "../agent3-discriminating-planting.js";

// A_50 §9.3 fix #2 — the reveal must rely only on clues planted BEFORE the discriminating-test
// scene. The probe pinned the culprit on "mechanical knowledge" / "dining logs" never shown
// earlier → judge flag "reveal uses evidence not planted earlier" (fair-play 70/100).

const buildCase = (
  evidenceClues: string[],
  mapping: Array<{ clue_id: string; act_number: number; scene_number?: number }>,
  testScene: { act_number: number; scene_number: number } | null = { act_number: 3, scene_number: 4 },
) => ({
  CASE: {
    discriminating_test: { evidence_clues: evidenceClues },
    prose_requirements: {
      clue_to_scene_mapping: mapping,
      ...(testScene ? { discriminating_test_scene: testScene } : {}),
    },
  },
});

describe("findUnplantedDiscriminatingClues", () => {
  it("passes when every discriminating clue is planted before the reveal", () => {
    const c = buildCase(
      ["clue_1", "clue_2"],
      [
        { clue_id: "clue_1", act_number: 1, scene_number: 3 },
        { clue_id: "clue_2", act_number: 2, scene_number: 1 },
      ],
    );
    const res = findUnplantedDiscriminatingClues(c);
    expect(res.unplanted).toEqual([]);
    expect(res.unmapped).toEqual([]);
    expect(res.testSceneKey).toBe(304);
  });

  it("flags a clue mapped AT the reveal scene as unplanted", () => {
    const c = buildCase(
      ["clue_1", "clue_late"],
      [
        { clue_id: "clue_1", act_number: 1, scene_number: 2 },
        { clue_id: "clue_late", act_number: 3, scene_number: 4 }, // == reveal scene
      ],
    );
    expect(findUnplantedDiscriminatingClues(c).unplanted).toEqual(["clue_late"]);
  });

  it("flags a clue mapped AFTER the reveal scene", () => {
    const c = buildCase(
      ["clue_after"],
      [{ clue_id: "clue_after", act_number: 3, scene_number: 6 }],
    );
    expect(findUnplantedDiscriminatingClues(c).unplanted).toEqual(["clue_after"]);
  });

  it("treats an evidence clue absent from the mapping as unplanted AND unmapped", () => {
    const c = buildCase(
      ["clue_1", "clue_ghost"],
      [{ clue_id: "clue_1", act_number: 1, scene_number: 1 }],
    );
    const res = findUnplantedDiscriminatingClues(c);
    expect(res.unmapped).toEqual(["clue_ghost"]);
    expect(res.unplanted).toEqual(["clue_ghost"]);
  });

  it("only flags unmapped clues (not ordering) when the reveal scene is unspecified", () => {
    const c = buildCase(
      ["clue_1", "clue_ghost"],
      [{ clue_id: "clue_1", act_number: 9, scene_number: 9 }],
      null,
    );
    const res = findUnplantedDiscriminatingClues(c);
    expect(res.testSceneKey).toBeNull();
    // clue_ghost is unmapped → flagged; clue_1 (mapped, late) is NOT flagged for ordering (no test scene)
    expect(res.unplanted).toEqual(["clue_ghost"]);
  });

  it("treats a missing scene_number as scene 0 of its act (act-level ordering)", () => {
    const c = buildCase(
      ["clue_act1"],
      [{ clue_id: "clue_act1", act_number: 1 }], // scene omitted (allowed per the contract)
    );
    expect(findUnplantedDiscriminatingClues(c).unplanted).toEqual([]);
  });

  it("is a no-op with no evidence_clues", () => {
    expect(findUnplantedDiscriminatingClues(buildCase([], [])).unplanted).toEqual([]);
  });

  it("accepts a bare case block (no CASE wrapper)", () => {
    const bare = {
      discriminating_test: { evidence_clues: ["c1"] },
      prose_requirements: {
        clue_to_scene_mapping: [{ clue_id: "c1", act_number: 1, scene_number: 1 }],
        discriminating_test_scene: { act_number: 3, scene_number: 1 },
      },
    };
    expect(findUnplantedDiscriminatingClues(bare).unplanted).toEqual([]);
  });
});

import { describe, expect, it } from "vitest";
import { applyGridClueJobs } from "../scene-job-authority.js";

// A_53 P8 — the clue-job stamp is now ADDITIVE (never deletes an LLM-assigned clue) and aligns by
// (act, act-scene-number), not raw array index.

describe("applyGridClueJobs — additive union (gridcluejob-empties-noncovered-scenes)", () => {
  it("unions the grid clues with each scene's existing clues (no overwrite)", () => {
    const scenes = [
      { cluesRevealed: ["keep1"] },
      { cluesRevealed: [] as string[] },
      { cluesRevealed: ["keep3"] },
    ];
    const slots = [{ cluesRevealed: ["c1"] }, { cluesRevealed: ["c2"] }, { cluesRevealed: [] as string[] }];

    const result = applyGridClueJobs(scenes, slots);

    expect(scenes[0].cluesRevealed).toEqual(["keep1", "c1"]);
    expect(scenes[1].cluesRevealed).toEqual(["c2"]);
    expect(scenes[2].cluesRevealed).toEqual(["keep3"]); // empty grid slot must NOT delete keep3
    expect(result.fellBack).toBe(false);
  });

  it("a scene with no grid slot keeps its existing clues (never wholesale-emptied)", () => {
    const scenes = [{ cluesRevealed: ["keep-me"] }, { cluesRevealed: ["also-keep"] }];
    const slots = [{ cluesRevealed: ["  c1  ", "", 42 as unknown as string, "c1"] }];

    const result = applyGridClueJobs(scenes, slots);

    expect(scenes[0].cluesRevealed).toEqual(["keep-me", "c1"]); // trimmed; blank/number/in-slot-dup dropped
    expect(scenes[1].cluesRevealed).toEqual(["also-keep"]); // no aligned slot ⇒ kept, not emptied
    expect(result.dedupRemoved).toBe(1); // the duplicate "c1" within the slot
  });

  it("still guarantees no clue id appears in more than one scene (global first-wins)", () => {
    const scenes = [{ cluesRevealed: [] as string[] }, { cluesRevealed: [] as string[] }, { cluesRevealed: [] as string[] }];
    const slots = [
      { cluesRevealed: ["c1", "c2"] },
      { cluesRevealed: ["c2", "c3"] },
      { cluesRevealed: ["c1", "c4"] },
    ];

    applyGridClueJobs(scenes, slots);

    const all = scenes.flatMap((s) => s.cluesRevealed as string[]);
    expect(new Set(all).size).toBe(all.length);
    expect(all.sort()).toEqual(["c1", "c2", "c3", "c4"]);
  });
});

describe("applyGridClueJobs — (act, act-scene-number) alignment (grid-cluejob-positional-misalignment)", () => {
  it("aligns by act + scene number, not raw array index", () => {
    // Outline scenes are out of array order; alignment must follow (act, sceneNumber).
    const scenes = [
      { act: 2, sceneNumber: 4, cluesRevealed: [] as string[] },
      { act: 1, sceneNumber: 1, cluesRevealed: [] as string[] },
      { act: 1, sceneNumber: 2, cluesRevealed: [] as string[] },
      { act: 2, sceneNumber: 3, cluesRevealed: [] as string[] },
    ];
    const slots = [
      { act: 1, sceneNumber: 1, cluesRevealed: ["a1s1"] },
      { act: 1, sceneNumber: 2, cluesRevealed: ["a1s2"] },
      { act: 2, sceneNumber: 3, cluesRevealed: ["a2s3"] },
      { act: 2, sceneNumber: 4, cluesRevealed: ["a2s4"] },
    ];

    const result = applyGridClueJobs(scenes, slots);

    expect(result.fellBack).toBe(false);
    expect(scenes[0].cluesRevealed).toEqual(["a2s4"]); // act2/scene4, not slots[0]
    expect(scenes[1].cluesRevealed).toEqual(["a1s1"]);
    expect(scenes[2].cluesRevealed).toEqual(["a1s2"]);
    expect(scenes[3].cluesRevealed).toEqual(["a2s3"]);
  });

  it("falls back (no stamp) when per-act counts differ between grid and outline", () => {
    const scenes = [
      { act: 1, sceneNumber: 1, cluesRevealed: ["keep"] },
      { act: 2, sceneNumber: 2, cluesRevealed: [] as string[] },
    ];
    const slots = [
      { act: 1, sceneNumber: 1, cluesRevealed: ["x"] },
      { act: 1, sceneNumber: 2, cluesRevealed: ["y"] }, // grid puts scene 2 in Act 1, outline in Act 2
    ];

    const result = applyGridClueJobs(scenes, slots);

    expect(result.fellBack).toBe(true);
    expect(result.stamped).toBe(0);
    expect(scenes[0].cluesRevealed).toEqual(["keep"]); // untouched — LLM distribution preserved
  });
});

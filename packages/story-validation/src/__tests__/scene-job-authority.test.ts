import { describe, expect, it } from "vitest";
import { applyGridClueJobs } from "../scene-job-authority.js";

describe("applyGridClueJobs (T1.2 / P1.3)", () => {
  it("stamps each scene's clue job from the aligned grid slot, overwriting prior values", () => {
    const scenes = [
      { cluesRevealed: ["stale1", "stale2"] },
      { cluesRevealed: [] as string[] },
      { cluesRevealed: ["stale3"] },
    ];
    const slots = [
      { cluesRevealed: ["c1"] },
      { cluesRevealed: ["c2", "c3"] },
      { cluesRevealed: ["c4"] },
    ];

    const result = applyGridClueJobs(scenes, slots);

    expect(scenes[0].cluesRevealed).toEqual(["c1"]);
    expect(scenes[1].cluesRevealed).toEqual(["c2", "c3"]);
    expect(scenes[2].cluesRevealed).toEqual(["c4"]);
    expect(result.stamped).toBe(3);
    expect(result.dedupRemoved).toBe(0);
  });

  it("removes a clue that the grid placed in more than one slot (first occurrence wins)", () => {
    const scenes = [{ cluesRevealed: [] as string[] }, { cluesRevealed: [] as string[] }];
    const slots = [{ cluesRevealed: ["c1"] }, { cluesRevealed: ["c1", "c2"] }];

    const result = applyGridClueJobs(scenes, slots);

    // c1 is revealed only in the first scene; the later re-reveal is stripped.
    expect(scenes[0].cluesRevealed).toEqual(["c1"]);
    expect(scenes[1].cluesRevealed).toEqual(["c2"]);
    expect(result.dedupRemoved).toBe(1);
  });

  it("guarantees no clue id appears in more than one scene", () => {
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

  it("empties scenes that have no aligned slot and trims/ignores blank or non-string ids", () => {
    const scenes = [{ cluesRevealed: ["keep-me"] }, { cluesRevealed: ["also-stale"] }];
    const slots = [{ cluesRevealed: ["  c1  ", "", 42 as unknown as string, "c1"] }];

    const result = applyGridClueJobs(scenes, slots);

    expect(scenes[0].cluesRevealed).toEqual(["c1"]); // trimmed; blank/number/dup dropped
    expect(scenes[1].cluesRevealed).toEqual([]); // no aligned slot ⇒ emptied
    expect(result.stamped).toBe(2);
    expect(result.dedupRemoved).toBe(1); // the duplicate "c1" within the slot
  });
});

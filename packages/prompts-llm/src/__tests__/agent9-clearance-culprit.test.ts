import { describe, it, expect } from "vitest";
import { resolveBatchMatchingClearances } from "../agent9-prose/deterministic-repair.js";

// A_50 §9: the deterministic clearance machinery must NEVER author a clearance for the actual
// culprit (or the victim) — clearing the culprit is the upstream cause of cleared_culprit_conflict.
describe("resolveBatchMatchingClearances — excludes the culprit (and victim) from authored clearances", () => {
  const scenes = [{ act: 3, scene: 1 }];
  const cmlCase = {
    cast: [
      { name: "Eleanor Voss", role_archetype: "victim" },
      { name: "Beatrice Quill", role_archetype: "suspect" },
      { name: "Dr Mallory Finch", role_archetype: "suspect" },
    ],
    culpability: { culprits: ["Beatrice Quill"] },
    prose_requirements: {
      suspect_clearance_scenes: [
        { suspect_name: "Beatrice Quill", act_number: 3, scene_number: 1, clearance_method: "alibi" }, // culprit — must be dropped
        { suspect_name: "Dr Mallory Finch", act_number: 3, scene_number: 1, clearance_method: "alibi" },
        { suspect_name: "Eleanor Voss", act_number: 3, scene_number: 1, clearance_method: "alibi" }, // victim — must be dropped
      ],
    },
  };

  it("never lists the culprit or victim in the resolved clearances", () => {
    const { batchMatchingClearances, chapterMatchingClearances } = resolveBatchMatchingClearances({
      batchScenes: scenes,
      batchStart: 0,
      cmlCase,
      scenes,
    });
    const allNames = [
      ...batchMatchingClearances,
      ...chapterMatchingClearances.flat(),
    ].map((c) => c.suspect_name);
    expect(allNames).not.toContain("Beatrice Quill"); // culprit
    expect(allNames).not.toContain("Eleanor Voss"); // victim
    // the genuine non-culprit suspect is still clearable
    expect(allNames).toContain("Dr Mallory Finch");
  });
});

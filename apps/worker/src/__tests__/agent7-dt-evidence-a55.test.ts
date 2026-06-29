import { describe, expect, it } from "vitest";
import { ensureDiscriminatingTestEvidencePresent } from "../jobs/agents/agent7-run.js";

// A_55 #5 (G4 gap) — the discriminating-test scene must reference at least one of its evidence clues.
// The pass is ADDITIVE: it never removes a clue, only adds one to the test scene when none is present.

const makeCtx = (evidenceClues: string[], testScenePos = { act_number: 3, scene_number: 1 }) => ({
  cml: {
    CASE: {
      discriminating_test: { evidence_clues: evidenceClues },
      prose_requirements: { discriminating_test_scene: testScenePos },
    },
  },
  warnings: [] as string[],
});

// Three acts; the DT scene is Act 3, scene 1.
const makeNarrative = (dtSceneClues: string[], earlierClues: string[]) => ({
  acts: [
    { actNumber: 1, scenes: [{ sceneNumber: 1, cluesRevealed: [...earlierClues] }] },
    { actNumber: 2, scenes: [{ sceneNumber: 2, cluesRevealed: [] }] },
    { actNumber: 3, scenes: [{ sceneNumber: 3, cluesRevealed: [...dtSceneClues] }] },
  ],
});

describe("A_55 #5 — ensureDiscriminatingTestEvidencePresent", () => {
  it("adds a FRESH evidence clue when the DT scene references none", () => {
    const ctx = makeCtx(["clue_13", "clue_14"]);
    const narrative = makeNarrative([], ["clue_2"]); // DT scene empty; clue_13/14 not revealed earlier
    ensureDiscriminatingTestEvidencePresent(ctx as any, narrative as any);
    const dtScene = narrative.acts[2].scenes[0];
    expect(dtScene.cluesRevealed.some((c) => ["clue_13", "clue_14"].includes(c))).toBe(true);
    expect(ctx.warnings.join(" ")).toMatch(/fresh evidence clue/);
  });

  it("re-surfaces a planted evidence clue when all are already revealed earlier", () => {
    const ctx = makeCtx(["clue_13"]);
    const narrative = makeNarrative([], ["clue_13"]); // clue_13 revealed earlier, absent from the DT scene
    ensureDiscriminatingTestEvidencePresent(ctx as any, narrative as any);
    expect(narrative.acts[2].scenes[0].cluesRevealed).toContain("clue_13");
    expect(ctx.warnings.join(" ")).toMatch(/re-surfaced evidence clue/);
  });

  it("is a no-op when the DT scene already references an evidence clue", () => {
    const ctx = makeCtx(["clue_13", "clue_14"]);
    const narrative = makeNarrative(["clue_14"], ["clue_2"]);
    ensureDiscriminatingTestEvidencePresent(ctx as any, narrative as any);
    expect(narrative.acts[2].scenes[0].cluesRevealed).toEqual(["clue_14"]); // unchanged
    expect(ctx.warnings).toHaveLength(0);
  });

  it("never removes existing clues — additive only", () => {
    const ctx = makeCtx(["clue_13"]);
    const narrative = makeNarrative(["clue_99"], ["clue_2"]); // DT scene has a non-evidence clue
    ensureDiscriminatingTestEvidencePresent(ctx as any, narrative as any);
    expect(narrative.acts[2].scenes[0].cluesRevealed).toContain("clue_99");
    expect(narrative.acts[2].scenes[0].cluesRevealed).toContain("clue_13");
  });

  it("no-ops when there are no evidence clues defined", () => {
    const ctx = makeCtx([]);
    const narrative = makeNarrative([], ["clue_2"]);
    ensureDiscriminatingTestEvidencePresent(ctx as any, narrative as any);
    expect(narrative.acts[2].scenes[0].cluesRevealed).toEqual([]);
    expect(ctx.warnings).toHaveLength(0);
  });
});

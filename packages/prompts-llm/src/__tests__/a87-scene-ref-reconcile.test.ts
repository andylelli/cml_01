import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

vi.mock("@cml/story-validation", async () => {
  const actual = await vi.importActual<any>("@cml/story-validation");
  return {
    ...actual,
    getGenerationParams: () => ({
      agent9_prose: { rollout_flags: { tiered_phrase_contract_enabled: false } },
    }),
  };
});

import { buildChapterObligationBlock } from "../agent9-prose/obligation-block.ts";
import { resolveSceneRef } from "../agent9-prose/clue-validation.ts";
import { reconcileCmlSceneRefs, selectRevealScene } from "../agent9-prose/scene-ref-reconcile.ts";

/**
 * A_87 P7 — reconcile the CML scene refs once the outline exists, and prove it against the archive.
 *
 * The reveal contract is recovered semantically by P4's arbitration, but consumers that read the
 * COORDINATE arithmetic are untouched by that — and `isPostRevealChapter` is false for every chapter
 * of all 45 archived runs, so the post-reveal naming constraint has never fired. This asserts that
 * reconciliation makes the coordinate real, and that it picks the same scene the arbitration does.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const PAIRS: any[] = JSON.parse(
  fs.readFileSync(path.join(here, "fixtures", "a87-scene-ref-pairs.json"), "utf8"),
);
const clone = (p: any) => JSON.parse(JSON.stringify(p));

const caseFor = (pair: any): any => ({
  meta: { setting: { location: "Archived Hall" } },
  cast: pair.cast?.length ? pair.cast : [{ name: "Alice Grey", role: "detective", gender: "female" }],
  culpability: { culprits: pair.culprits?.length ? pair.culprits : ["Edgar Vale"] },
  hidden_model: { mechanism: { description: pair.mechanism || "the mechanism" } },
  prose_requirements: pair.prose_requirements,
});

/** obligation-block's isPostRevealChapter arithmetic, replicated to measure its reach. */
const perActNumber = (s: any, all: any[]): number =>
  all.filter((x) => Number(x.act) === Number(s.act))
     .findIndex((x) => Number(x.sceneNumber) === Number(s.sceneNumber)) + 1;
const postRevealChapters = (pair: any): number => {
  const ref = pair.prose_requirements?.culprit_revelation_scene;
  if (!ref) return 0;
  return pair.scenes.filter((s: any) =>
    Number(s.act) > Number(ref.act_number) ||
    (Number(s.act) === Number(ref.act_number) &&
     Number(s.sceneNumber) > Number(ref.scene_number) &&
     perActNumber(s, pair.scenes) > Number(ref.scene_number))).length;
};

describe("A_87 P7 — reconciling the scene refs against the outline that exists", () => {
  it("KNOWN-POSITIVE: a ref that already resolves is left alone", () => {
    const scenes = [1, 2, 3].map((n) => ({ sceneNumber: n, act: n <= 2 ? 1 : 2, beat: "x" }));
    const cml = { prose_requirements: { culprit_revelation_scene: { act_number: 2, scene_number: 3 } } };
    const res = reconcileCmlSceneRefs(cml, scenes);
    expect(res.rewritten).toEqual([]);
    expect(res.alreadyExact.length).toBe(1);
    expect(cml.prose_requirements.culprit_revelation_scene).toEqual({ act_number: 2, scene_number: 3 });
  });

  it("BEFORE: the reveal ref resolves 0/45 and no chapter is ever post-reveal", () => {
    const resolves = PAIRS.filter((p) =>
      p.scenes.some((s: any) => resolveSceneRef(s, p.prose_requirements.culprit_revelation_scene, p.scenes) !== "none"));
    expect(resolves.length).toBe(0);
    expect(PAIRS.reduce((n, p) => n + postRevealChapters(p), 0)).toBe(0);
  });

  it("AFTER: every reveal ref resolves by coordinate, on all 45", () => {
    const after = PAIRS.map(clone);
    for (const p of after) reconcileCmlSceneRefs({ prose_requirements: p.prose_requirements }, p.scenes);
    const resolves = after.filter((p) =>
      p.scenes.some((s: any) => resolveSceneRef(s, p.prose_requirements.culprit_revelation_scene, p.scenes) !== "none"));
    expect(resolves.length).toBe(45);
  });

  /**
   * A SEPARATE DEFECT, found by this test failing and kept as the assertion.
   *
   * `isPostRevealChapter` requires BOTH `scene.sceneNumber > ref.scene_number` (global numbering)
   * AND `perActSceneNumber > ref.scene_number` (per-act numbering) against the SAME field. For any
   * reveal in the final act the two cannot both hold: a global index of 8+ is never exceeded by a
   * per-act index of 1..3. So the branch is unsatisfiable BEFORE reconciliation (ref act3/sc6) and
   * still unsatisfiable AFTER it — fixing the coordinate does not fix this, because the consumer
   * itself mixes the two numbering systems.
   *
   * Left as a pinned measurement rather than repaired here: repairing it would newly activate a
   * naming constraint that has never once run, on the chapters after the reveal, which is a
   * behaviour change that needs its own run. Recorded in ANALYSIS_87 §8.6.
   */
  it("the post-reveal branch stays dead even after reconciliation — it mixes both numberings", () => {
    expect(PAIRS.reduce((n, p) => n + postRevealChapters(p), 0)).toBe(0);
    const after = PAIRS.map(clone);
    for (const p of after) reconcileCmlSceneRefs({ prose_requirements: p.prose_requirements }, p.scenes);
    expect(after.reduce((n, p) => n + postRevealChapters(p), 0)).toBe(0);
    // And the reason: every reconciled reveal sits in the final act, where the conjunction cannot hold.
    const finalActReveals = after.filter((p) => {
      const ref = p.prose_requirements.culprit_revelation_scene;
      const finalAct = Math.max(...p.scenes.map((s: any) => Number(s.act) || 0));
      return Number(ref.act_number) === finalAct;
    });
    expect(finalActReveals.length).toBe(45);
  });

  it("P7 and P4c agree on the reveal scene for all 45 pairs", () => {
    const prior = process.env.AGENT9_SCENE_REF_ARBITRATION;
    process.env.AGENT9_SCENE_REF_ARBITRATION = "1";
    try {
      for (const pair of PAIRS) {
        const chosen = selectRevealScene({ prose_requirements: pair.prose_requirements }, pair.scenes);
        const contracted: number[] = [];
        pair.scenes.forEach((scene: any, i: number) => {
          const block = buildChapterObligationBlock(
            [scene], i + 1, caseFor(pair), [] as any, undefined, { clues: [] } as any,
            undefined, undefined, undefined, undefined, undefined, undefined, pair.scenes, undefined,
          );
          if (block.includes("CULPRIT REVELATION REQUIRED")) contracted.push(Number(scene.sceneNumber));
        });
        expect(contracted).toEqual([Number(chosen?.sceneNumber)]);
      }
    } finally {
      if (prior === undefined) delete process.env.AGENT9_SCENE_REF_ARBITRATION;
      else process.env.AGENT9_SCENE_REF_ARBITRATION = prior;
    }
  });
});

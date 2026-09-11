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
import { auditCmlSceneRefs, resolveSceneRef } from "../agent9-prose/clue-validation.ts";

/**
 * A_87 P5 — ASSERT THE JOIN, NOT THE MATCHER.
 *
 * `sceneMatchesCmlSceneRef` has always been correct against its own fixtures. What was never tested
 * is whether a coordinate Agent 3 actually emits resolves against an outline Agent 7 actually
 * produces — and it does not. The unit was right; the integration was never exercised.
 *
 * The fixture is the 45 stored (cml, outline) pairs, frozen. `data/store.json` is a 35 MB untracked
 * working file that grows with every run, so it cannot be the fixture itself. The frozen copy keeps
 * `purpose`, `summary`, `title` and `dramaticElements` in full: the first cut of this fixture
 * truncated `purpose` to 400 characters and the suite then reported ONE broken run instead of
 * eleven, because the keyword fallback reads all four fields.
 *
 * These are CHARACTERIZATION assertions. The numbers are the measured status quo, not a target. A
 * change that moves them SHOULD fail here — that is the alarm the project did not have for 45 runs.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const PAIRS: any[] = JSON.parse(
  fs.readFileSync(path.join(here, "fixtures", "a87-scene-ref-pairs.json"), "utf8"),
);

const REVEAL_OBLIGATION = "CULPRIT REVELATION REQUIRED";

const caseFor = (pair: any): any => ({
  meta: { setting: { location: "Archived Hall" } },
  cast: pair.cast?.length ? pair.cast : [{ name: "Alice Grey", role: "detective", gender: "female" }],
  culpability: { culprits: pair.culprits?.length ? pair.culprits : ["Edgar Vale"] },
  hidden_model: { mechanism: { description: pair.mechanism || "the mechanism" } },
  prose_requirements: pair.prose_requirements,
});

/**
 * Which chapters receive the reveal contract? `allOutlineScenes` is parameter 13 — passing it one
 * slot late lands it in `currentStageMode`, which silently disables per-act numbering AND the
 * arbitration below, and made an earlier draft of this file measure the wrong thing entirely.
 */
const revealChapters = (pair: any): number[] => {
  const outline = pair.scenes;
  const hits: number[] = [];
  outline.forEach((scene: any, i: number) => {
    const block = buildChapterObligationBlock(
      [scene], i + 1, caseFor(pair), [] as any, undefined, { clues: [] } as any,
      undefined, undefined, undefined, undefined, undefined, undefined, outline, undefined,
    );
    if (block.includes(REVEAL_OBLIGATION)) hits.push(i + 1);
  });
  return hits;
};

const withArbitration = <T>(on: boolean, fn: () => T): T => {
  const prior = process.env.AGENT9_SCENE_REF_ARBITRATION;
  if (on) process.env.AGENT9_SCENE_REF_ARBITRATION = "1";
  else delete process.env.AGENT9_SCENE_REF_ARBITRATION;
  try { return fn(); } finally {
    if (prior === undefined) delete process.env.AGENT9_SCENE_REF_ARBITRATION;
    else process.env.AGENT9_SCENE_REF_ARBITRATION = prior;
  }
};

const tally = (on: boolean) => {
  const counts = withArbitration(on, () => PAIRS.map((p) => revealChapters(p).length));
  return {
    lost: counts.filter((c) => c === 0).length,
    one: counts.filter((c) => c === 1).length,
    doubled: counts.filter((c) => c > 1).length,
  };
};

describe("A_87 P5 — the CML→outline scene-ref join, against real archived pairs", () => {
  it("KNOWN-POSITIVE: a ref that names a real scene resolves exactly", () => {
    const scenes = [1, 2, 3].map((n) => ({ sceneNumber: n, act: n <= 2 ? 1 : 2 }));
    expect(resolveSceneRef(scenes[2], { act_number: 2, scene_number: 3 }, scenes)).toBe("exact");
    const audit = auditCmlSceneRefs(
      { prose_requirements: { culprit_revelation_scene: { act_number: 2, scene_number: 3 } } },
      scenes,
    );
    expect(audit.exact).toBe(1);
    expect(audit.unresolved).toBe(0);
  });

  it("the fixture is the archive, not a hand-made pair", () => {
    expect(PAIRS.length).toBe(45);
    expect(PAIRS.every((p) => p.scenes.length > 0)).toBe(true);
    // The signal fields the keyword fallback reads must be present, or every count below is optimistic.
    expect(PAIRS.every((p) => p.scenes.some((s: any) => String(s.purpose ?? "").length > 0))).toBe(true);
  });

  it("MEASURED: the culprit_revelation_scene ref resolves by coordinate in 0 of 45 runs", () => {
    const resolved = PAIRS.filter((p) => {
      const ref = p.prose_requirements?.culprit_revelation_scene;
      return ref ? p.scenes.some((s: any) => resolveSceneRef(s, ref, p.scenes) !== "none") : false;
    });
    expect(resolved.length).toBe(0);
  });

  it("MEASURED: Agent 3 emits ONE distinct reveal coordinate across the whole archive", () => {
    const distinct = new Set(
      PAIRS.map((p) => {
        const r = p.prose_requirements?.culprit_revelation_scene;
        return r ? `act${r.act_number}/sc${r.scene_number}` : "(absent)";
      }),
    );
    // The prompt's own worked example, copied verbatim — A_67's lesson recurring.
    expect([...distinct]).toEqual(["act3/sc6"]);
  });

  it("THE DEFECT, flag OFF: the reveal contract lands on exactly one chapter in only 28 of 45 runs", () => {
    expect(tally(false)).toEqual({ lost: 11, one: 28, doubled: 6 });
  });

  it("THE FIX, AGENT9_SCENE_REF_ARBITRATION=1: 43 of 45, and never twice", () => {
    expect(tally(true)).toEqual({ lost: 2, one: 43, doubled: 0 });
  });
});

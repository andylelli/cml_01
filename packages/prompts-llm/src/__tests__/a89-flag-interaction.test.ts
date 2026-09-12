import { describe, expect, it, vi } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

vi.mock("@cml/story-validation", async () => {
  const actual = await vi.importActual<any>("@cml/story-validation");
  return {
    ...actual,
    getGenerationParams: () => ({ agent9_prose: { rollout_flags: { tiered_phrase_contract_enabled: false } } }),
  };
});

import { buildChapterObligationBlock } from "../agent9-prose/obligation-block.ts";
import { resolveStageModeKey, getRequiredClueIdsForScene } from "../agent9-prose/clue-validation.ts";

/**
 * A_89 QUALITY AUDIT — the flags must compose, and none of them may lose a clue.
 *
 * Six levers landed across A_87/A_88/A_89 and they touch one prompt. Two properties matter more than
 * any single measurement:
 *
 *   1. FAIR PLAY IS NOT TRADEABLE. B1 changes what each chapter is ASKED to dramatize; if any clue
 *      ends up dramatized in NO chapter, the book is unfair and the lever is wrong regardless of what
 *      it does to repetition.
 *   2. FLAGS MUST COMPOSE. MEASURED here: the recommended set takes books carrying more than one
 *      culprit-naming mandate from 42/45 to 15/45 — but adding `AGENT9_SCENE_REF_RESOLUTION`, which
 *      A_87 §8.1 already recommended against, takes it to 45/45, WORSE than changing nothing. That
 *      flag resolves the reveal ref onto the `false_solution` beat (43 of 45 archived cases), which
 *      defeats B3's arbitration entirely.
 */
const here = path.dirname(fileURLToPath(import.meta.url));
const PAIRS: any[] = JSON.parse(
  fs.readFileSync(path.join(here, "fixtures", "a87-scene-ref-pairs.json"), "utf8"),
);
const RECOMMENDED = ["AGENT9_SCENE_REF_ARBITRATION", "AGENT9_CLUE_OWNERSHIP", "AGENT9_RELATIONSHIP_CONTENT"];
const RECOMMENDED_AGAINST = "AGENT9_SCENE_REF_RESOLUTION";

const caseFor = (p: any): any => ({
  meta: { setting: { location: "Hall" } },
  cast: p.cast?.length ? p.cast : [{ name: "Alice Grey", role: "detective" }],
  culpability: { culprits: p.culprits?.length ? p.culprits : ["Edgar Vale"] },
  hidden_model: { mechanism: { description: p.mechanism || "the mechanism" } },
  prose_requirements: p.prose_requirements,
});
const cluesFor = (p: any) => {
  const ids = new Set<string>();
  for (const s of p.scenes) {
    for (const id of getRequiredClueIdsForScene({ prose_requirements: p.prose_requirements }, s, p.scenes)) ids.add(id);
  }
  return {
    clues: [...ids].map((id) => ({
      id, category: "physical", description: `the ${id} detail`, observable: `a visible mark tied to ${id}`,
      pointsTo: "x", placement: "mid", criticality: "supporting", sourceInCML: "x",
    })),
  };
};

const run = (flags: string[]) => {
  const prior = new Map(flags.concat(RECOMMENDED, RECOMMENDED_AGAINST).map((f) => [f, process.env[f]]));
  for (const f of [...RECOMMENDED, RECOMMENDED_AGAINST]) delete process.env[f];
  for (const f of flags) process.env[f] = "1";
  try {
    let threw = 0, emptyBlocks = 0, cluesNeverDramatized = 0, noNaming = 0, multiNaming = 0;
    for (const p of PAIRS) {
      const cml = caseFor(p), cd = cluesFor(p);
      const required = new Set<string>();
      const dramatized = new Set<string>();
      const naming: number[] = [];
      p.scenes.forEach((s: any, i: number) => {
        for (const id of getRequiredClueIdsForScene(cml, s, p.scenes)) required.add(id);
        let block = "";
        try {
          const stage = resolveStageModeKey(i + 1, i + 1, p.scenes.length, false, cml, p.scenes, [s] as any);
          block = buildChapterObligationBlock(
            [s], i + 1, cml, [] as any, undefined, cd as any,
            undefined, undefined, undefined, undefined, undefined, undefined, p.scenes, stage as any,
          );
        } catch { threw++; return; }
        if (!block || !block.trim()) emptyBlocks++;
        if (block.includes("CULPRIT REVELATION REQUIRED") || block.includes("DISCRIMINATING TEST (")) naming.push(i + 1);
        for (const id of required) if (block.includes(`[${id}]`)) dramatized.add(id);
      });
      for (const id of required) if (!dramatized.has(id)) cluesNeverDramatized++;
      if (naming.length === 0) noNaming++;
      if (naming.length > 1) multiNaming++;
    }
    return { threw, emptyBlocks, cluesNeverDramatized, noNaming, multiNaming };
  } finally {
    for (const [f, v] of prior) { if (v === undefined) delete process.env[f]; else process.env[f] = v; }
  }
};

describe("A_89 audit — the levers compose and fair play survives", () => {
  it("FAIR PLAY: no clue is ever left undramatized, in any flag combination", () => {
    expect(run([]).cluesNeverDramatized).toBe(0);
    expect(run(RECOMMENDED).cluesNeverDramatized).toBe(0);
    expect(run([...RECOMMENDED, RECOMMENDED_AGAINST]).cluesNeverDramatized).toBe(0);
  });

  it("nothing throws and no chapter gets an empty obligation block", () => {
    for (const set of [[], RECOMMENDED, [...RECOMMENDED, RECOMMENDED_AGAINST]]) {
      const r = run(set);
      expect(r.threw).toBe(0);
      expect(r.emptyBlocks).toBe(0);
    }
  });

  it("every book still gets at least one culprit-naming mandate", () => {
    expect(run([]).noNaming).toBe(0);
    expect(run(RECOMMENDED).noNaming).toBe(0);
  });

  it("THE RECOMMENDED SET IMPROVES: books with >1 naming mandate 42 -> 15", () => {
    expect(run([]).multiNaming).toBe(42);
    expect(run(RECOMMENDED).multiNaming).toBe(15);
  });

  it("GUARD: AGENT9_SCENE_REF_RESOLUTION defeats B3 — worse than changing nothing", () => {
    // A_87 §8.1 recommended against it because it resolves the reveal ref onto the `false_solution`
    // beat in 43 of 45 cases. This pins the interaction: it does not merely fail to help.
    const withBad = run([...RECOMMENDED, RECOMMENDED_AGAINST]).multiNaming;
    expect(withBad).toBe(45);
    expect(withBad).toBeGreaterThan(run([]).multiNaming);
    expect(withBad).toBeGreaterThan(run(RECOMMENDED).multiNaming);
  });
});

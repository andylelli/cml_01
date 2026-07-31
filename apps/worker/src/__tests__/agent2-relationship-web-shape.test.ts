import { describe, expect, it } from "vitest";
import { adaptCastForScoring } from "../jobs/scoring-adapters/agent2-scoring-adapter.js";

/**
 * A_71 (A_70 §6) — "Cast Design is the weakest phase in every run" was a MEASUREMENT bug.
 *
 * MEASURED across three runs (07-27, 07-31 ×2): Agent 2 emits `relationships` as a bare ARRAY of
 * 9–15 well-formed pairs. Every reader guarded on `Array.isArray(relationships.pairs)`, which is
 * `undefined` on a bare array — so each character was given an EMPTY relationship list, and the two
 * relationship quality tests scored 0 in every report ever written. The relationships were always
 * there; nothing was ever wrong with the cast.
 *
 * Same family as `cast-field-camelcase-vs-snakecase-trap`: a shape assumption that no-ops instead
 * of failing, so it survives indefinitely and reads as a content defect.
 */

const PAIRS = [
  {
    character1: "Eleanor Voss",
    character2: "Dr. Mallory Finch",
    relationship: "Eleanor helped Mallory with her charity projects.",
    tension: "moderate",
    sharedHistory: "Shared community events, differing ethics.",
  },
  {
    character1: "Eleanor Voss",
    character2: "Captain Ivor Hale",
    relationship: "Sibling rivalry over family assets",
    tension: "high",
    sharedHistory: "Fought over inheritance since their father's death.",
  },
];

const CHARACTERS = [
  { name: "Eleanor Voss", roleArchetype: "Matriarch" },
  { name: "Dr. Mallory Finch", roleArchetype: "Physician" },
  { name: "Captain Ivor Hale", roleArchetype: "Soldier" },
];

const castDesign = (relationships: unknown) =>
  ({ characters: CHARACTERS, relationships, crimeDynamics: {} }) as never;

describe("adaptCastForScoring — relationship web shape", () => {
  it("reads the BARE ARRAY the model actually emits (the shape that scored 0 for months)", () => {
    const { cast } = adaptCastForScoring(castDesign(PAIRS));

    expect(cast.find((c) => c.name === "Eleanor Voss")?.relationships).toHaveLength(2);
    expect(cast.find((c) => c.name === "Dr. Mallory Finch")?.relationships).toHaveLength(1);
  });

  it("still reads the declared { pairs: [...] } shape", () => {
    const { cast } = adaptCastForScoring(castDesign({ pairs: PAIRS }));

    expect(cast.find((c) => c.name === "Eleanor Voss")?.relationships).toHaveLength(2);
  });

  it("names the OTHER character, which is what the reciprocity test looks for", () => {
    // `Relationships reference cast` checks `names.some(name => rel.includes(name))`. A relationship
    // string that omitted the other party would pass the density test and fail this one.
    const { cast } = adaptCastForScoring(castDesign(PAIRS));
    const eleanor = cast.find((c) => c.name === "Eleanor Voss");

    expect(eleanor?.relationships?.[0]).toContain("Dr. Mallory Finch");
    expect(eleanor?.relationships?.[1]).toContain("Captain Ivor Hale");
  });

  it("builds BOTH directions from one pair, so reciprocity is satisfiable", () => {
    const { cast } = adaptCastForScoring(castDesign(PAIRS));
    const finch = cast.find((c) => c.name === "Dr. Mallory Finch");

    expect(finch?.relationships?.[0]).toContain("Eleanor Voss");
  });

  it("yields an empty list — not a crash — for missing or malformed webs", () => {
    for (const shape of [undefined, null, {}, { pairs: "nope" }, 42, "relationships"]) {
      const { cast } = adaptCastForScoring(castDesign(shape));
      expect(cast.every((c) => (c.relationships?.length ?? 0) === 0)).toBe(true);
    }
  });
});

import { describe, expect, it } from "vitest";
import { normalizeRelationshipWeb } from "../agent2-cast.js";

/**
 * A_71 (A_70 §6). The declared contract is `{ pairs: [...] }`; the model returns a bare array.
 * Coercing at the source fixes every reader at once — including `normalizeRelationshipTension`,
 * which was gated on the same `Array.isArray(relationships.pairs)` guard and therefore never ran.
 */

const PAIR = {
  character1: "Eleanor Voss",
  character2: "Captain Ivor Hale",
  relationship: "Sibling rivalry over family assets",
  tension: "high" as const,
  sharedHistory: "Fought over inheritance since their father's death.",
};

describe("normalizeRelationshipWeb", () => {
  it("wraps the bare array the model emits", () => {
    expect(normalizeRelationshipWeb([PAIR])).toEqual({ pairs: [PAIR] });
  });

  it("passes the declared shape through unchanged", () => {
    expect(normalizeRelationshipWeb({ pairs: [PAIR] })).toEqual({ pairs: [PAIR] });
  });

  it("returns an empty web rather than throwing on anything else", () => {
    for (const shape of [undefined, null, {}, { pairs: "nope" }, 42, "relationships"]) {
      expect(normalizeRelationshipWeb(shape)).toEqual({ pairs: [] });
    }
  });

  it("drops non-object entries so downstream .tension access is safe", () => {
    expect(normalizeRelationshipWeb([PAIR, null, "x", 7])).toEqual({ pairs: [PAIR] });
  });
});

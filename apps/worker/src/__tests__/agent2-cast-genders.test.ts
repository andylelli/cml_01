import { describe, expect, it } from "vitest";
import { applyCastGenders, normaliseCastOutput } from "../jobs/agents/agent2-run.js";

/** Owner decision 10 (A1X-Q03 + A1X-04 R2, 2026-10-01). */
describe("the user's castGenders win over the cast", () => {
  it("overrides a disagreeing gender, matching names case-insensitively, and says so", () => {
    const characters = [{ name: "Edmund Penhale", gender: "male" }, { name: "Ada Vane", gender: "female" }];
    const warnings: string[] = [];
    expect(applyCastGenders(characters, { " edmund penhale ": "female", "Ada Vane": "female" }, warnings)).toBe(1);
    expect(characters.map((c) => c.gender)).toEqual(["female", "female"]);
    expect(warnings).toEqual(['[cast-gender] Edmund Penhale: "male" → female (the user\'s castGenders)']);
  });

  it("moves nothing without castGenders, and ignores a value outside the vocabulary", () => {
    const characters = [{ name: "Ada Vane", gender: "female" }];
    expect(applyCastGenders(characters, undefined)).toBe(0);
    expect(applyCastGenders(characters, { "Ada Vane": "unknown" })).toBe(0);
    expect(characters[0].gender).toBe("female");
  });
});

describe("one binary gender vocabulary in normaliseCastOutput", () => {
  it("resolves \"non-binary\" like a missing gender (name inference)", () => {
    const cast: Record<string, unknown> = { characters: [{ name: "Margaret Ellis", gender: "non-binary" }, { name: "Arthur Penn", gender: "M" }] };
    normaliseCastOutput(cast);
    expect((cast.characters as Array<{ gender: string }>).map((c) => c.gender)).toEqual(["female", "male"]);
  });
});

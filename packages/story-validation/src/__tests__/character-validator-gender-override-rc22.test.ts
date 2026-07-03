import { describe, expect, it } from "vitest";
import { CharacterConsistencyValidator } from "../character-validator.js";

// A_61 RC2.2 — the validator dereferences the frozen Bible gender map when supplied, instead of the raw
// cast gender. Both directions: the override is authoritative; absent, behaviour is unchanged.

const cml: any = {
  CASE: {
    cast: [
      { name: "Alex Grey", gender: "male", role_archetype: "suspect" },
      { name: "Inspector Poole", gender: "male", role_archetype: "detective" },
    ],
  },
};
const story: any = {
  scenes: [{ number: 1, title: "Ch1", text: "Alex Grey stepped into the hall. She surveyed the room without a word." }],
};

const mismatchCount = (v: CharacterConsistencyValidator) =>
  (v.validate(story, cml).errors ?? []).filter((e: any) => e.type === "pronoun_gender_mismatch").length;

describe("CharacterConsistencyValidator — RC2.2 gender override", () => {
  it("WITHOUT override: raw cast gender (male) + 'She' → a mismatch is flagged", () => {
    expect(mismatchCount(new CharacterConsistencyValidator())).toBeGreaterThan(0);
  });

  it("WITH a Bible override making Alex female: 'She' is correct → no mismatch", () => {
    const v = new CharacterConsistencyValidator({ "Alex Grey": "female", "Inspector Poole": "male" });
    expect(mismatchCount(v)).toBe(0);
  });
});

import { describe, expect, it } from "vitest";
import { buildCharacterPersonalityBlock } from "../agent9-prose/prompt-blocks.ts";

/**
 * A_89 D1 — a 40-character label cap was discarding the motive-bearing half of every relationship.
 *
 * `prompt-blocks.ts` renders `relationship` as a parenthetical LABEL beside `sharedHistory` and drops
 * anything over 40 characters. Agent 2's own prompt asks for a sentence in that field. MEASURED
 * across the archive: 747 of 752 strings (99%) discarded, median length 100 characters.
 *
 * For run 88651 the culprit/victim pair reads "Bertram Norbury pressured Gwendolyn Vance … threatened
 * to cut funding if unsuccessful" and reached ZERO Agent 9 prompts, while the neutral logistical
 * `sharedHistory` reached 13. The external reader asked, in as many words, "did he threaten to
 * dissolve the company?" — the case answered it and the prompt boundary deleted the answer.
 */
const LONG_REL =
  "Bertram Norbury pressured Gwendolyn Vance to secure profits from the ballet company and threatened to cut funding if unsuccessful";
const HISTORY =
  "Bertram Norbury and Gwendolyn Vance met in his cabin to discuss funding shortfalls the afternoon before the murder";

const castDesign: any = {
  characters: [
    { name: "Bertram Norbury", roleArchetype: "victim" },
    { name: "Gwendolyn Vance", roleArchetype: "suspect" },
  ],
  relationships: {
    pairs: [
      { character1: "Bertram Norbury", character2: "Gwendolyn Vance",
        relationship: LONG_REL, tension: "moderate", sharedHistory: HISTORY },
    ],
  },
};
const names = new Set(["Bertram Norbury", "Gwendolyn Vance"]);
// `buildCharacterPersonalityBlock` returns '' unless characterProfiles.profiles is an array.
const profiles: any = { profiles: [{ name: "Bertram Norbury" }, { name: "Gwendolyn Vance" }] };
const render = (on: boolean): string => {
  const prior = process.env.AGENT9_RELATIONSHIP_CONTENT;
  if (on) process.env.AGENT9_RELATIONSHIP_CONTENT = "1";
  else delete process.env.AGENT9_RELATIONSHIP_CONTENT;
  try { return String(buildCharacterPersonalityBlock(profiles, castDesign, names) ?? ""); }
  finally {
    if (prior === undefined) delete process.env.AGENT9_RELATIONSHIP_CONTENT;
    else process.env.AGENT9_RELATIONSHIP_CONTENT = prior;
  }
};

describe("A_89 D1 — the motive must reach the prompt", () => {
  it("THE DEFECT, flag OFF: a 128-character relationship is discarded entirely", () => {
    const out = render(false);
    expect(out).toContain(HISTORY);             // the neutral half survives
    expect(out).not.toContain("threatened to cut funding"); // the motive does not
  });

  it("THE FIX, flag ON: the relationship is rendered as content", () => {
    const out = render(true);
    expect(out).toContain("threatened to cut funding if unsuccessful");
    expect(out).toContain(HISTORY);             // and the history is still there
  });

  it("the A_81 defect the cap was built for is still caught — no restatement", () => {
    const restating: any = {
      ...castDesign,
      relationships: { pairs: [{
        character1: "A Person", character2: "B Person",
        // the label restates the history it introduces
        relationship: "they had a secret affair which one threatened to expose",
        tension: "high",
        sharedHistory: "they had a secret affair which one threatened to expose, three summers ago",
      }]},
      characters: [{ name: "A Person" }, { name: "B Person" }],
    };
    const prior = process.env.AGENT9_RELATIONSHIP_CONTENT;
    process.env.AGENT9_RELATIONSHIP_CONTENT = "1";
    try {
      const out = String(buildCharacterPersonalityBlock({ profiles: [{ name: "A Person" }, { name: "B Person" }] }, restating, new Set(["A Person", "B Person"])) ?? "");
      const hits = (out.match(/they had a secret affair/g) ?? []).length;
      expect(hits).toBe(1);                     // rendered once, not doubled
    } finally {
      if (prior === undefined) delete process.env.AGENT9_RELATIONSHIP_CONTENT;
      else process.env.AGENT9_RELATIONSHIP_CONTENT = prior;
    }
  });

  it("tension survives in both states", () => {
    expect(render(false)).toContain("tension moderate");
    expect(render(true)).toContain("tension moderate");
  });
});

import { describe, expect, it } from "vitest";

import { collectClueEvidenceFromProse } from "../jobs/scoring-adapters/index.js";

/**
 * A_90 §14 — the run-killer run 10845 found, reproduced against the gate's real matcher.
 *
 * The NSD-anchor deterministic floor plants a clue's `observable`; the release gate's matcher
 * (`buildClueSignatures`) builds its required tokens from `description` and `pointsTo`. On run
 * 10845 those were different sentences, the plant carried too few of the gate's tokens, and the
 * run hard-stopped after writing 13,205 words. This pins the divergence at the matcher itself, so
 * the fix is verified against the component that actually decides — not against a copy of it.
 */
const CLUE = {
  id: "clue_core_contradiction_chain",
  category: "spatial",
  criticality: "essential",
  observable: "Distinct knocking echoes and structural differences are noted between the rooms.",
  description:
    "Despite appearances, the two rooms are separate; knocking tests confirm their physical separation contradicting the assumption they are one.",
  pointsTo: "The two rooms, though visually similar, are physically separate and acoustically distinct.",
};
const clues = { clues: [CLUE] } as any;
const cmlCase = { prose_requirements: {}, cast: [], culpability: { culprits: [] } };

const plant = (body: string) => [
  {
    title: "Chapter 1",
    paragraphs: [
      "Rain moved over the brewery yard and nobody spoke of the cellar.",
      `The record now held one further detail, set down without comment: ${body.replace(/\.+$/, "")}.`,
    ],
  },
];
const visible = (body: string) =>
  collectClueEvidenceFromProse(plant(body), cmlCase, clues).visibleClueIds.includes(CLUE.id);

describe("NSD-anchor floor — plant what the gate's matcher reads", () => {
  it("reproduces the run-killer: planting the observable alone is NOT seen by the gate", () => {
    expect(visible(CLUE.observable)).toBe(false);
  });

  it("planting the description — the field the signature is built from — IS seen", () => {
    expect(visible(CLUE.description)).toBe(true);
  });

  it("the combined candidates the floor now tries are all seen", () => {
    expect(visible([CLUE.observable, CLUE.description].join("; "))).toBe(true);
    expect(visible([CLUE.observable, CLUE.description, CLUE.pointsTo].join("; "))).toBe(true);
  });

  it("a chapter that never mentions the clue is still not seen — the floor cannot fake acceptance", () => {
    const bare = [{ title: "Chapter 1", paragraphs: ["Rain moved over the brewery yard."] }];
    expect(collectClueEvidenceFromProse(bare, cmlCase, clues).visibleClueIds).not.toContain(CLUE.id);
  });
});

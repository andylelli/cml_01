/**
 * Act III is a SEQUENCE, and Agent 7 is now told so where it authors the outline.
 *
 * THE CLASH, measured 2026-08-20. `aftermath_consequence` is **21 of the 54 failed chapter attempts
 * across the whole archive, and it appears in ALL NINE runs that retried anything** — the single
 * dominant retry cause, by a factor of two and a half over the next.
 *
 * The cause is a contract clash whose two halves never met. Agent 9 derives a chapter's stage mode
 * FROM the outline, so Agent 7 authors scene purposes without ever seeing the contract they will be
 * judged against. Act III was presented to it as a flat menu — Revelation, Confrontation,
 * Explanation, Justice, Denouement — so it wrote final scenes doing all five at once. On
 * `run_0a61b082` the final scene's purpose was, verbatim:
 *
 *     "Clear all suspects with alibis; confront Harold Simmons with evidence;
 *      reveal motive and method; emotional and social aftermath"
 *
 * `aftermath_consequence` rejects a clearance roll-call and a re-staged reveal, so three attempts
 * burned on that chapter and the violation shipped anyway.
 *
 * **22 of 22 archived outlines put clearance and/or reveal work in the final scene.** It is
 * structural, not a story quirk — which is why the fix is in the authoring prompt rather than in a
 * new validator: a validator here would trade chapter retries for outline retries.
 *
 * This is also the pacing complaint named in three external reads, and REVIEW_15's reader complaint
 * "the ending order is wrong". One clash, three symptoms.
 */

import { describe, it, expect } from "vitest";
import { buildNarrativePrompt } from "../agent7-narrative.js";
import type { CaseData } from "@cml/cml";
import type { ClueDistributionResult } from "../agent5-clues.js";

const caseData = {
  meta: { title: "A Case", primary_axis: "temporal", schema_version: "2.0" },
  setup: {
    era: { year: 1935, location: "A seaside hotel", key_details: ["fog"] },
    crime: {
      description: "Found dead in the lounge",
      victim: "Sylvia Trent",
      method: "struck",
      location: "Lounge",
      when: "a quarter past eight",
    },
  },
  cast: [
    { character_id: "detective", name: "Eleanor Voss", role: "detective", access_level: "full" },
    { character_id: "s1", name: "Hugo Vane", role: "suspect", access_level: "routine" },
  ],
} as unknown as CaseData;

const clues = {
  clues: [
    {
      id: "clue_1",
      category: "temporal",
      description: "A stopped clock",
      sourceInCML: "constraint_space.time[0]",
      pointsTo: "Time of death",
      placement: "early",
      criticality: "essential",
    },
  ],
  redHerrings: [
    {
      id: "rh_1",
      description: "A window slightly ajar",
      supportsAssumption: "Outside entry possible",
      misdirection: "The window is too small",
    },
  ],
  fairPlayChecks: {
    essentialCluesCount: 1,
    allCluesBeforeSolution: true,
    discriminatingTestPresent: true,
    noSpecialKnowledge: true,
  },
} as unknown as ClueDistributionResult;

const promptText = (overrides: Record<string, unknown> = {}): string => {
  const p = buildNarrativePrompt({ caseData, clues, ...overrides } as never);
  return [p.system, p.developer, p.user].filter(Boolean).join("\n");
};

describe("the Act III brief states an order, not a menu", () => {
  it("says the five resolution beats are a sequence", () => {
    expect(promptText()).toMatch(/SEQUENCE, not a menu/);
  });

  it("puts clearance before the reveal, which is the reader complaint in three reads", () => {
    expect(promptText()).toMatch(/Clearing the innocent belongs BEFORE the reveal/);
  });

  it("forbids the three things aftermath_consequence rejects", () => {
    const text = promptText();
    expect(text).toMatch(/re-confront the culprit/);
    expect(text).toMatch(/re-quote the confession|re-stage the accusation/);
    expect(text).toMatch(/NOT introduce decisive new evidence/);
  });

  it("names the exact final-scene purpose the corpus keeps producing", () => {
    // Naming the anti-pattern is REVIEW_12 §3.2's lesson: a message that only restates the rule
    // leaves a model that believes it complied with nothing to change.
    expect(promptText()).toMatch(/clear the suspects and confront the culprit/);
  });

  it("exempts a single-scene Act III, where the reveal IS the final scene", () => {
    // The contract binds only scenes AFTER the reveal. With one Act III scene there are none, and a
    // rule forbidding confrontation there would forbid the ending itself.
    expect(promptText()).toMatch(/single scene, that scene IS the reveal/);
  });
});

describe("the contract is generic across story parameters", () => {
  it("is present at every target length and narrative style", () => {
    for (const targetLength of ["short", "medium", "long"] as const) {
      for (const narrativeStyle of ["classic", "modern", "atmospheric"] as const) {
        expect(promptText({ targetLength, narrativeStyle }), `${targetLength}/${narrativeStyle}`)
          .toMatch(/SEQUENCE, not a menu/);
      }
    }
  });

  it("is present for every detective type", () => {
    for (const detectiveType of ["police", "private", "amateur"] as const) {
      expect(promptText({ detectiveType }), detectiveType).toMatch(/SEQUENCE, not a menu/);
    }
  });

  it("names no mechanism, theme or era — the clash is structural, not a clock problem", () => {
    const contract = promptText().split("SEQUENCE, not a menu")[1]!.slice(0, 1600).toLowerCase();
    for (const themeWord of ["clock", "pendulum", "poison", "sundial", "1930"]) {
      expect(contract, themeWord).not.toContain(themeWord);
    }
  });
});

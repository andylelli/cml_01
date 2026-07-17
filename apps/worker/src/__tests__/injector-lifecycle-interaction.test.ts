/**
 * A_62 abort class #6 — the injector layer fabricated a death event a sibling validator believed.
 *
 * M1v7 run 1 (mystery-1784244374547, optics): the deterministic clue-materialization template
 * shipped ONE sentence — "Eleanor voss continued, voice unwavering, toward the next concrete
 * detail: Puncture wound victim body." — placing the DETECTIVE's name and the raw key-terms
 * ("victim", "body") in a single sentence. The character-lifecycle validator's death heuristic
 * (any cast name + DEATH_RE word in a sentence) marked Eleanor deceased in ch3; her every later
 * action became a `victim_reappears_alive` CRITICAL; the release gate failed; the run aborted.
 * A_61 RC-1 ("injectors WRITE prose") escalated from a rubric cap to a run-killer.
 *
 * The invariant this pins, cross-package with the REAL implementations on both sides:
 * `buildDeterministicClueParagraphs` output must never trip the lifecycle death heuristic for the
 * investigator, even when the clue key-terms are death-adjacent ("Puncture wound victim body").
 */
import { describe, expect, it } from "vitest";
import { buildDeterministicClueParagraphs } from "@cml/prompts-llm";
import { validateCharacterLifecycle } from "@cml/story-validation";

const INVESTIGATOR = "Eleanor Voss";

const storyWith = (ch3Paragraphs: string[]) => ({
  id: "s1",
  projectId: "p1",
  scenes: [
    {
      number: 3,
      title: "Chapter 3",
      text: ch3Paragraphs.join("\n\n"),
      paragraphs: ch3Paragraphs,
    },
    {
      number: 4,
      title: "Chapter 4",
      // Active dialogue AFTER ch3 — the trigger arm of victim_reappears_alive.
      text: `${INVESTIGATOR} said, "The mirror could only have hung at that angle for a reason."`,
      paragraphs: [`${INVESTIGATOR} said, "The mirror could only have hung at that angle for a reason."`],
    },
  ],
  metadata: { cast: [INVESTIGATOR, "Dr. Mallory Finch", "Hugo Vane"] },
});

const cml = {
  CASE: {
    cast: [
      { name: INVESTIGATOR, role_archetype: "Detective" },
      { name: "Dr. Mallory Finch", role_archetype: "Victim" },
      { name: "Hugo Vane", role_archetype: "Suspect" },
    ],
    culpability: { culprits: ["Hugo Vane"] },
  },
} as any;

const criticalsFor = (name: string, errors: any[]) =>
  errors.filter(
    (e) => e.severity === "critical" && String(e.message ?? "").includes(name),
  );

describe("injector output × lifecycle validator — abort class #6", () => {
  it("FIXTURE (the exact abort): the old one-sentence shape DOES mark the detective dead — proves this test can detect the class", () => {
    // Verbatim shape from the aborted run. If the lifecycle heuristic is ever retuned such that
    // this stops firing, this test will fail — update it CONSCIOUSLY with fixtures (RC-4 rule),
    // because the class-#6 invariant below would then be protected by the detector instead.
    const poisoned = storyWith([
      "The lobby had emptied by the time the clocks struck four.",
      "Eleanor voss continued, voice unwavering, toward the next concrete detail: Puncture wound victim body.",
    ]);
    const errors = validateCharacterLifecycle(poisoned as any, cml);
    expect(criticalsFor("Eleanor", errors).length).toBeGreaterThan(0);
  });

  it("the REBUILT template output never trips the death heuristic for the investigator (late placement)", () => {
    const paragraphs = buildDeterministicClueParagraphs(
      [
        {
          description: "Puncture wound victim body",
          pointsTo: "the angle of the mirror",
          isMissing: true,
          requiresEarlyPlacement: false,
        } as any,
      ],
      INVESTIGATOR,
      false,
    );
    expect(paragraphs.length).toBeGreaterThan(0);
    const errors = validateCharacterLifecycle(storyWith(["The lobby had emptied.", ...paragraphs]) as any, cml);
    expect(criticalsFor("Eleanor", errors)).toEqual([]);
  });

  it("same invariant on the early-placement lead", () => {
    const paragraphs = buildDeterministicClueParagraphs(
      [
        {
          description: "corpse discovered near the tide-line",
          pointsTo: undefined,
          isMissing: true,
          requiresEarlyPlacement: true,
        } as any,
      ],
      INVESTIGATOR,
      true,
    );
    const errors = validateCharacterLifecycle(storyWith(["The morning post arrived late.", ...paragraphs]) as any, cml);
    expect(criticalsFor("Eleanor", errors)).toEqual([]);
  });

  it("belt-and-braces: no builder sentence contains both the investigator's name and a death word", () => {
    // Mirrors story-validation's DEATH_RE (single source of truth there; asserted here so a future
    // template edit that re-merges the sentences fails loudly even without the validator).
    const DEATH_RE = /\b(?:dead|body|corpse|deceased|lifeless|murdered|killed|slain)\b/i;
    const paragraphs = buildDeterministicClueParagraphs(
      [
        { description: "victim body slain near the boathouse", isMissing: true, requiresEarlyPlacement: false } as any,
        { description: "bloodstained lifeless corpse markers", isMissing: true, requiresEarlyPlacement: false } as any,
      ],
      INVESTIGATOR,
      false,
    );
    for (const para of paragraphs) {
      for (const sentence of para.split(/(?<=[.!?])\s+/)) {
        const hasName = /\bEleanor\b|\bVoss\b/i.test(sentence);
        const hasDeath = DEATH_RE.test(sentence);
        expect(hasName && hasDeath).toBe(false);
      }
    }
  });
});

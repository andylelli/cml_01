/**
 * A_95 M3 — THE REVEAL CONTRACT REACHED NO CHAPTER, IN THE LAST SIX RUNS.
 *
 * MEASURED over 57 runs in `logs/llm-prompts-full.jsonl`: `CULPRIT REVELATION REQUIRED` reached a
 * chapter in 39 of them, and in the last six — including the 87-class brewery book, the 80/100
 * theatre book, its matched pair and the seed-1358 choir book — it reached NONE.
 *
 * Everything gated behind it went with it: the evidence chain, the kill statement, the pronoun
 * resolution, the resolution event, the close-in-scene rule, `AGENT9_REVEAL_DECEPTION_PURPOSE`
 * (A_84 #1) and `AGENT9_REVEAL_ARITHMETIC` (A_90 §12 #1) — the last of which was built to answer the
 * 87 read's FIRST complaint and has never once reached a prompt.
 *
 * WHY: `isRevealChapter` requires `!isDiscriminatingTestChapter`. The winner-selection excludes the
 * aftermath scene and then falls through keyword/beat candidates onto the same chapter the DT claim
 * holds, and the reveal obligations are dropped with no later chapter to catch them. The coordinate
 * join cannot prevent it: **51 of 51 stored cases put the revelation at "act 3, scene 6" while act 3
 * holds 2-5 scenes**, so `byCoordinate` is always empty.
 */

import { afterEach, describe, expect, it } from "vitest";

import { buildChapterObligationBlock, isRevealOnDtChapterEnabled } from "../agent9-prose/obligation-block.js";

const FLAGS = ["AGENT9_REVEAL_ON_DT_CHAPTER", "AGENT9_SCENE_REF_ARBITRATION", "AGENT9_REVEAL_ARITHMETIC"];
const saved = Object.fromEntries(FLAGS.map((f) => [f, process.env[f]]));
afterEach(() => {
  for (const f of FLAGS) {
    if (saved[f] === undefined) delete process.env[f];
    else process.env[f] = saved[f]!;
  }
});

/**
 * The seed-1358 choir case and outline, reduced to the fields the predicate reads. The CML's
 * "act 3, scene 6" against an act 3 of two scenes is verbatim from the stored artifacts.
 */
const CASE = {
  prose_requirements: {
    culprit_revelation_scene: { act_number: 3, scene_number: 6, revelation_method: "Confrontation with the clock tampering evidence" },
    discriminating_test_scene: { act_number: 3, scene_number: 4, required_elements: ["Execute the clock and watch comparison test"] },
    clue_to_scene_mapping: [],
  },
  discriminating_test: { method: "clock and watch comparison" },
  culpability: { culprits: ["Agatha Innes"] },
  cast: [
    { name: "Agatha Innes", role_archetype: "suspect", motive_seed: "to protect the choir school's endowment" },
    { name: "Edith Penhale", role_archetype: "detective" },
    { name: "Violet Radcliffe", role_archetype: "suspect" },
  ],
  hidden_model: {
    mechanism: {
      apparent_time_of_death: "half past seven in the evening",
      actual_time_of_death: "quarter past seven in the evening",
    },
  },
};

const scene = (n: number, beat: string, title: string, purpose: string) => ({
  sceneNumber: n,
  act: n <= 3 ? 1 : n <= 8 ? 2 : 3,
  beat,
  title,
  purpose,
  summary: purpose,
  characters: ["Edith Penhale", "Agatha Innes"],
});

const SCENES = [
  scene(1, "gathering", "Discovery", "Introduce the crime and detective"),
  scene(2, "crime", "The Crime", "The body is found"),
  scene(3, "first_enquiries", "First Enquiries", "Interviews and the timeline"),
  scene(4, "motives", "Motives", "Reveal the motives"),
  scene(5, "alibis", "Alibis", "Establish alibis"),
  scene(6, "false_solution", "A Wrong Turn", "Reveal early clues"),
  scene(7, "secrets", "Secrets", "Unrelated lies surface"),
  scene(8, "pattern", "The Pattern", "Reconstruct the timeline"),
  scene(9, "final_trap", "The Discriminating Test", "Execute the clock comparison test and expose the culprit"),
  scene(10, "revelation", "Quiet Aftermath", "The household absorbs the truth"),
];

const blockFor = (chapterNumber: number): string =>
  buildChapterObligationBlock(
    [SCENES[chapterNumber - 1]],
    chapterNumber,
    CASE,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    chapterNumber === 10 ? "resolution" : chapterNumber >= 9 ? "climax" : "rising",
    undefined,
    undefined,
    SCENES,
    chapterNumber === 10 ? "aftermath_consequence" : undefined,
    undefined,
    undefined,
    undefined,
  );

const REVEAL_ONLY = [
  "EVIDENCE CHAIN REQUIRED",
  "KILL STATEMENT REQUIRED",
  "PRONOUN RESOLUTION",
  "RESOLUTION EVENT REQUIRED",
  "CLOSE IN-SCENE",
];

describe("the flag defaults OFF and reproduces the defect", () => {
  it("is off unless .env says so", () => {
    delete process.env.AGENT9_REVEAL_ON_DT_CHAPTER;
    expect(isRevealOnDtChapterEnabled()).toBe(false);
  });

  it("THE DEFECT: with the flag off, no chapter carries the reveal-only obligations", () => {
    delete process.env.AGENT9_REVEAL_ON_DT_CHAPTER;
    process.env.AGENT9_SCENE_REF_ARBITRATION = "true";
    const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(blockFor).join("\n");
    for (const phrase of REVEAL_ONLY) expect(all).not.toContain(phrase);
  });

  it("KNOWN-POSITIVE: the DT chapter IS producing a contract, so the defect is a gap and not a dead probe", () => {
    delete process.env.AGENT9_REVEAL_ON_DT_CHAPTER;
    process.env.AGENT9_SCENE_REF_ARBITRATION = "true";
    const dt = blockFor(9);
    expect(dt).toContain("DISCRIMINATING TEST");
    expect(dt).toContain("Agatha Innes");
  });
});

describe("with the flag on, the reveal obligations land on the DT chapter", () => {
  const on = () => {
    process.env.AGENT9_REVEAL_ON_DT_CHAPTER = "true";
    process.env.AGENT9_SCENE_REF_ARBITRATION = "true";
  };

  it("every reveal-only obligation now reaches exactly one chapter", () => {
    on();
    const blocks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(blockFor);
    for (const phrase of REVEAL_ONLY) {
      const carrying = blocks.filter((b) => b.includes(phrase)).length;
      expect(carrying, `${phrase} reached ${carrying} chapters`).toBe(1);
    }
  });

  it("it is the DT chapter that carries them, and never the aftermath chapter", () => {
    on();
    expect(blockFor(9)).toContain("KILL STATEMENT REQUIRED");
    expect(blockFor(10)).not.toContain("KILL STATEMENT REQUIRED");
  });

  it("the culprit-naming and motive lines are NOT duplicated — the DT contract already states both", () => {
    on();
    const dt = blockFor(9);
    expect(dt).not.toContain("CULPRIT REVELATION REQUIRED");
    expect(dt).not.toContain("Motive statement REQUIRED: the culprit must explicitly state or acknowledge their motive in this chapter");
    // the DT block's own versions are still there
    expect(dt).toContain("Convict: name");
  });

  it("the reveal arithmetic — built by A_90 for the 87 read's first complaint — finally reaches a prompt", () => {
    on();
    process.env.AGENT9_REVEAL_ARITHMETIC = "true";
    const dt = blockFor(9);
    expect(dt).toContain("the REAL time of death");
    expect(dt).toContain("quarter past seven in the evening");
    expect(dt).toContain("half past seven in the evening");
  });

  it("with the arithmetic flag off it stays off — the fix opens a gate, it does not force a lever", () => {
    on();
    delete process.env.AGENT9_REVEAL_ARITHMETIC;
    expect(blockFor(9)).not.toContain("the REAL time of death");
  });
});

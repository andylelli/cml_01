import { describe, expect, it, vi } from "vitest";

// obligation-block reads rollout flags at runtime; disable the tiered phrase contract so the
// assertions below stay focused on the reveal/aftermath contracts under test.
vi.mock("@cml/story-validation", async () => {
  const actual = await vi.importActual<any>("@cml/story-validation");
  return {
    ...actual,
    getGenerationParams: () => ({
      agent9_prose: { rollout_flags: { tiered_phrase_contract_enabled: false } },
    }),
  };
});

import { buildChapterObligationBlock } from "../agent9-prose/obligation-block.ts";
import { validateChapterPreCommitObligations } from "../agent9-prose/clue-validation.ts";
import { GOLDEN_AGE_BEAT_GUIDE } from "../agent7-narrative.ts";

// ── Fixtures ─────────────────────────────────────────────────────────────────
// 10-scene outline: act 1 = scenes 1-3, act 2 = scenes 4-7, act 3 = scenes 8-10.
// Per-act numbering in act 3: scene 8 → 1, scene 9 → 2, scene 10 → 3.
const mkScene = (sceneNumber: number, act: number, title: string, purpose: string): any => ({
  act,
  sceneNumber,
  title,
  purpose,
  setting: { location: "Marlowe Hall study" },
  characters: [],
  summary: "",
});

const makeOutline = (): any[] => [
  mkScene(1, 1, "The Gathering", "Guests arrive at the hall."),
  mkScene(2, 1, "The Crime", "The body is discovered."),
  mkScene(3, 1, "First Enquiries", "The inspector questions the household."),
  mkScene(4, 2, "Motives", "Rival motives surface."),
  mkScene(5, 2, "Movements", "Household movements are mapped."),
  mkScene(6, 2, "The False Solution", "A convincing wrong theory takes hold."),
  mkScene(7, 2, "Secrets", "Unrelated lies surface."),
  mkScene(8, 3, "The Pattern", "The inspector reconstructs the sequence."),
  // "trap"/"confrontation" keywords are deliberate — this is the genuine final-trap chapter.
  mkScene(9, 3, "The Final Trap", "The inspector stages the decisive confrontation."),
  // "disproved" deliberately hits the DT keyword fallback pattern — this is the Ch10 that
  // must NOT re-claim the DT contract when Ch9 already exact-matched (run_20260713-1932).
  mkScene(10, 3, "Aftermath", "The household reflects on the timeline that disproved the false theory."),
];

// Reveal + DT both configured at act 3, per-act scene 2 = global scene 9 (the final trap).
const makeCase = (proseRequirementsOverride?: any): any => ({
  meta: { setting: { location: "Marlowe Hall" } },
  cast: [
    { name: "Alice Grey", role: "detective", gender: "female" },
    { name: "Edgar Vale", role_archetype: "suspect", gender: "male" },
    { name: "Clara Whitfield", role_archetype: "suspect", gender: "female" },
    { name: "Lionel Marlowe", role_archetype: "victim", gender: "male" },
  ],
  culpability: { culprits: ["Edgar Vale"] },
  hidden_model: { mechanism: { description: "stabbed with a letter opener while the clock was set back" } },
  prose_requirements: proseRequirementsOverride ?? {
    discriminating_test_scene: { act_number: 3, scene_number: 2 },
    culprit_revelation_scene: { act_number: 3, scene_number: 2 },
    suspect_clearance_scenes: [
      // scene_number 99 never exact-matches any outline scene — exercises the act-level fallback.
      { suspect_name: "Clara Whitfield", act_number: 3, scene_number: 99, clearance_method: "corroborated alibi", supporting_clues: [] },
    ],
    clue_to_scene_mapping: [],
  },
});

const buildBlockFor = (
  scene: any,
  chapterNumber: number,
  cmlCase: any,
  outline: any[],
  arcPosition: string | undefined,
  stageMode: string | undefined,
): string =>
  buildChapterObligationBlock(
    [scene],
    chapterNumber,
    cmlCase,
    [] as any,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    arcPosition,
    undefined,
    undefined,
    outline,
    stageMode,
  );

// ── ITEM 11 #1: aftermath contract vs full reveal mandate ────────────────────
describe("ITEM 11 #1 — final-chapter contract keys off the stage mode, not position alone", () => {
  it("aftermath final chapter gets the AFTERMATH CONTRACT and NOT the 6-item reveal mandate or clearance list", () => {
    const outline = makeOutline();
    const block = buildBlockFor(outline[9], 10, makeCase(), outline, "resolution", "aftermath_consequence");

    expect(block).toContain("AFTERMATH CONTRACT — THIS IS THE FINAL CHAPTER");
    expect(block).toContain("NAME IN RETROSPECT");
    expect(block).toContain("Edgar Vale");
    expect(block).toContain("DO NOT RE-STAGE THE REVEAL");
    // The full-reveal contract and its clearance list must be suppressed.
    expect(block).not.toContain("MANDATORY RESOLUTION");
    expect(block).not.toContain("1. ACCUSATION");
    expect(block).not.toContain("SUSPECT CLEARANCES (MANDATORY");
  });

  it("reveal-as-final-chapter keeps the existing 6-item mandate and clearance list, no aftermath contract", () => {
    const outline = makeOutline();
    const base = makeCase();
    const cml = makeCase({
      ...base.prose_requirements,
      // Reveal moved to act 3, per-act scene 3 = global scene 10: the reveal IS the last chapter.
      culprit_revelation_scene: { act_number: 3, scene_number: 3 },
    });
    const block = buildBlockFor(outline[9], 10, cml, outline, "resolution", "final_reveal");

    expect(block).toContain("⛔ MANDATORY RESOLUTION — THIS IS THE FINAL CHAPTER:");
    expect(block).toContain("1. ACCUSATION");
    expect(block).toContain("5. AFTERMATH");
    expect(block).toContain("SUSPECT CLEARANCES (MANDATORY");
    expect(block).toContain("rejected and regenerated");
    expect(block).not.toContain("AFTERMATH CONTRACT — THIS IS THE FINAL CHAPTER");
  });
});

// ── A_67 FIX-1: de-registered clearance obligations (no copy-me template) ─────
describe("A_67 FIX-1 — clearance obligation blocks model fiction, not a copy-me register sentence", () => {
  it("the reveal-as-final item-6 keeps its header + suspect name but drops the copy-me Example and the single-paragraph rule", () => {
    const outline = makeOutline();
    const base = makeCase();
    const cml = makeCase({
      ...base.prose_requirements,
      culprit_revelation_scene: { act_number: 3, scene_number: 3 },
    });
    const block = buildBlockFor(outline[9], 10, cml, outline, "resolution", "final_reveal");

    // Obligation kept.
    expect(block).toContain("SUSPECT CLEARANCES (MANDATORY");
    expect(block).toContain("rejected and regenerated");
    // The copy-me Example sentence and the single-paragraph constraint (the register drivers) are gone.
    // (The "because / therefore / which proves" connector still legitimately appears in the SEPARATE
    // discriminating-test elimination block — that reveal-side obligation is deliberately untouched.)
    expect(block).not.toContain("Two witnesses had placed");
    expect(block).not.toContain("do not split across paragraphs");
  });

  it("the pre-reveal SUSPECT CLEARANCE REQUIRED block keeps name + clearance method but drops the dedicated-paragraph report framing", () => {
    const outline = makeOutline();
    const cml = makeCase();
    const ch9 = buildBlockFor(outline[8], 9, cml, outline, "climax", "final_reveal");

    // Obligation kept (header + name + method).
    expect(ch9).toContain("SUSPECT CLEARANCE REQUIRED");
    expect(ch9).toContain("Clara Whitfield");
    expect(ch9).toContain("clearance method");
    // The clearance line no longer instructs a dedicated report paragraph (the register driver).
    expect(ch9).not.toContain("write a dedicated paragraph");
  });
});

// ── A_67 FIX-2: the reveal METHOD obligation names the physical cause of death ─
describe("A_67 FIX-2 — reveal METHOD obligation names CASE.death_method, not the concealment mechanism", () => {
  it("feeds the physical manner of death into the 'name the manner of death' half of the METHOD item", () => {
    const outline = makeOutline();
    const base = makeCase();
    const cml = makeCase({ ...base.prose_requirements, culprit_revelation_scene: { act_number: 3, scene_number: 3 } });
    cml.death_method = "strangulation"; // physical cause of death, distinct from the concealment mechanism
    const block = buildBlockFor(outline[9], 10, cml, outline, "resolution", "final_reveal");

    expect(block).toContain("3. METHOD");
    // The manner-of-death half now carries the PHYSICAL cause of death (BUG-1: was fed the concealment string).
    expect(block).toContain("name the manner of death (strangulation)");
    // The concealment description still drives the separate scene/timeline-manipulated half.
    expect(block).toContain("how the scene/timeline was manipulated");
  });
});

// ── ITEM 11 #3: DT exclusivity ───────────────────────────────────────────────
describe("ITEM 11 #3 — the DT contract is exclusive to the exact-matched chapter", () => {
  it("when Ch9 exact-matches the DT ref, Ch10 containing 'disproved' does NOT get the DT block", () => {
    const outline = makeOutline();
    const cml = makeCase();

    const ch9 = buildBlockFor(outline[8], 9, cml, outline, "climax", "final_reveal");
    expect(ch9).toContain("DISCRIMINATING TEST (");

    const ch10 = buildBlockFor(outline[9], 10, cml, outline, "resolution", "aftermath_consequence");
    expect(ch10).not.toContain("DISCRIMINATING TEST (");
  });

  it("keyword fallback still resolves the DT chapter when NO exact match exists anywhere", () => {
    const outline = makeOutline();
    const base = makeCase();
    const cml = makeCase({
      ...base.prose_requirements,
      // scene_number 77 exact-matches nothing in act 3 → fallback must use the keyword signal.
      discriminating_test_scene: { act_number: 3, scene_number: 77 },
    });

    // Scene 9 ("The Final Trap ... confrontation") keyword-matches the DT signal pattern.
    const ch9 = buildBlockFor(outline[8], 9, cml, outline, "climax", "final_reveal");
    expect(ch9).toContain("DISCRIMINATING TEST (");
  });
});

// ── ITEM 11 #2: act-level clearance fallback targets the reveal/DT chapter ───
describe("ITEM 11 #2 — unmatched act clearances attach to the act's resolved reveal/DT chapter", () => {
  it("attaches the unmatched act-3 clearance to Ch9 (resolved reveal chapter), not to last-in-act Ch10", () => {
    const outline = makeOutline();
    const cml = makeCase();

    const ch9 = buildBlockFor(outline[8], 9, cml, outline, "climax", "final_reveal");
    expect(ch9).toContain("SUSPECT CLEARANCE REQUIRED");
    expect(ch9).toContain("Clara Whitfield");

    const ch10 = buildBlockFor(outline[9], 10, cml, outline, "resolution", "aftermath_consequence");
    expect(ch10).not.toContain("SUSPECT CLEARANCE REQUIRED");
  });

  it("falls back to last-in-act when no reveal/DT chapter resolves within the act", () => {
    const outline = makeOutline();
    const cml = makeCase({
      // No reveal ref and no DT ref — the anchor cannot resolve, so last-in-act keeps the clearances.
      suspect_clearance_scenes: [
        { suspect_name: "Clara Whitfield", act_number: 3, scene_number: 99, clearance_method: "corroborated alibi", supporting_clues: [] },
      ],
      clue_to_scene_mapping: [],
    });

    const ch10 = buildBlockFor(outline[9], 10, cml, outline, "resolution", "final_reveal");
    expect(ch10).toContain("SUSPECT CLEARANCE REQUIRED");
    expect(ch10).toContain("Clara Whitfield");

    const ch9 = buildBlockFor(outline[8], 9, cml, outline, "climax", "final_reveal");
    expect(ch9).not.toContain("SUSPECT CLEARANCE REQUIRED");
  });
});

// ── ITEM 11 #4: Layer-2 reveal-aware final-chapter resolution check ──────────
describe("ITEM 11 #4 — Layer-2 resolution check accepts markers in the resolved reveal chapter", () => {
  const ledger: any = { chapterNumber: 10, hardFloorWords: 1, preferredWords: 1, requiredClueIds: [] };
  const resolutionBase = {
    isLastChapter: true,
    culpritName: "Edgar Vale",
    culpritSurname: "Vale",
    murderMethod: "stabbed with a letter opener",
  };
  // Reveal chapter carries RESOLUTION_RE ("confessed", "taken into custody"), the surname, and the method.
  const revealChapterText =
    '"I killed him," Vale confessed at last; he had stabbed Lionel with the letter opener and was taken into custody.';
  const mkChapter = (text: string): any => ({ title: "Chapter 10", paragraphs: [text] });

  it("passes an aftermath final chapter that names the culprit when the reveal chapter satisfied the markers", () => {
    const chapter = mkChapter(
      "In the quiet days that followed, the household spoke of Edgar Vale only in murmurs, and Clara found the study door left open.",
    );
    const result = validateChapterPreCommitObligations(chapter, ledger, undefined, undefined, {
      ...resolutionBase,
      revealChapterText,
    });
    expect(result.hardFailures).toEqual([]);
  });

  it("still hard-fails when the aftermath final chapter never names the culprit surname (G6-Q2 parity)", () => {
    const chapter = mkChapter(
      "In the quiet days that followed, the household spoke of the matter only in murmurs.",
    );
    const result = validateChapterPreCommitObligations(chapter, ledger, undefined, undefined, {
      ...resolutionBase,
      revealChapterText,
    });
    expect(result.hardFailures.some((msg) => msg.includes("never names Edgar Vale"))).toBe(true);
  });

  it("hard-fails when the markers are absent from BOTH the reveal chapter and the final chapter", () => {
    const chapter = mkChapter("The household drifted apart, and nothing more was said of that November.");
    const result = validateChapterPreCommitObligations(chapter, ledger, undefined, undefined, {
      ...resolutionBase,
      revealChapterText: "The inspector walked the gallery once more, counting the chimes.",
    });
    expect(result.hardFailures.some((msg) => msg.includes("no resolution event detected"))).toBe(true);
  });

  it("without revealChapterText the pre-ITEM-11 behaviour is preserved (final chapter must satisfy everything)", () => {
    const passing = mkChapter(
      "Vale confessed that he had stabbed Lionel with the letter opener, and he was arrested before dawn.",
    );
    expect(validateChapterPreCommitObligations(passing, ledger, undefined, undefined, { ...resolutionBase }).hardFailures).toEqual([]);

    const failing = mkChapter("The household drifted apart, and nothing more was said of that November.");
    const result = validateChapterPreCommitObligations(failing, ledger, undefined, undefined, { ...resolutionBase });
    expect(result.hardFailures.some((msg) => msg.includes("no resolution event detected"))).toBe(true);
  });

  it("a reveal chapter missing the murder method does NOT satisfy the check on its own", () => {
    const chapter = mkChapter("The household drifted apart, and nothing more was said of that November.");
    const result = validateChapterPreCommitObligations(chapter, ledger, undefined, undefined, {
      ...resolutionBase,
      revealChapterText: "Vale confessed and was taken into custody.",
    });
    expect(result.hardFailures.some((msg) => msg.includes("no resolution event detected"))).toBe(true);
  });
});

// ── ITEM 11 #5: Agent 7 beat guide — final_trap carries the exposure ─────────
describe("ITEM 11 #5 — Golden Age beat guide splits exposure (final_trap) from aftermath (revelation)", () => {
  it("final_trap remains the deduction-led exposure beat", () => {
    expect(GOLDEN_AGE_BEAT_GUIDE.final_trap).toMatch(/deduction-led/);
    expect(GOLDEN_AGE_BEAT_GUIDE.final_trap).toMatch(/named on-page/);
  });

  it("revelation is aftermath-dominant and forbids re-staging the accusation/confession", () => {
    expect(GOLDEN_AGE_BEAT_GUIDE.revelation).toMatch(/aftermath-dominant/);
    expect(GOLDEN_AGE_BEAT_GUIDE.revelation).toMatch(/WITHOUT re-staging the accusation or confession/);
    expect(GOLDEN_AGE_BEAT_GUIDE.revelation).toMatch(/by name in retrospect/);
    // The old wording forced a second deduction-led solution into the last chapter.
    expect(GOLDEN_AGE_BEAT_GUIDE.revelation).not.toMatch(/deduction-led solution/);
  });
});

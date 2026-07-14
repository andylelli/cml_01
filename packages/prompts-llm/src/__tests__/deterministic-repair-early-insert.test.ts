import { describe, expect, it } from "vitest";
import { applyDeterministicCluePatch } from "../agent9-prose/deterministic-repair.js";
import { chapterClueAppearsEarly } from "../agent9-prose/clue-validation.js";
import type { ChapterRequirementLedgerEntry, ProseChapter } from "../agent9-prose/types.js";

// ITEM 12 — the reveal-style Chapter-1 opening. Root cause: applyDeterministicCluePatch PREPENDED the
// two early-clue template paragraphs at index 0, so the A1 lead became the chapter OPENING and the
// scaffold regen dramatized it as the investigator announcing the case to assembled listeners. The
// fix moves the block to an index >= 1 that still lands inside the first-quarter window
// chapterClueAppearsEarly checks post-insertion. The A1 lead WORDING itself is unchanged (the
// prose-guard A1 detector must keep matching it) — only the PLACEMENT moves.

const A1_LEAD_RE = /laid the facts out plainly where the others could see them/;

const ledger: ChapterRequirementLedgerEntry = {
  chapterNumber: 1,
  hardFloorWords: 1,
  preferredWords: 1,
  requiredClueIds: ["clue_clock"],
  clueObligationContext: [
    { id: "clue_clock", description: "The mantel clock has been rewound.", placement: "early" },
  ],
};

const clueDistribution: any = {
  clues: [
    {
      id: "clue_clock",
      description: "The mantel clock has been rewound.",
      category: "physical",
      criticality: "essential",
      placement: "early",
      pointsTo: "the time of death was staged",
    },
  ],
};

const scene: any = { characters: ["Clara Whitfield", "Edgar Vale"] };
const caseData: any = {
  CASE: { cast: [{ name: "Clara Whitfield", role_archetype: "detective" }] },
};
const castNames = ["Clara Whitfield", "Edgar Vale"];

// Neutral paragraphs: no clue tokens (mantel/clock/rewound/staged/…) and no semantic-anchor family
// tokens (time/hour/wound/…), so the pre-patch early check genuinely fails.
const neutralParagraphs = [
  "Clara Whitfield crossed the drawing room and let the household settle before she spoke.",
  "Edgar kept his eyes on the hearth while the servants avoided one another.",
  "The butler answered each question with the same flat courtesy he gave every guest.",
  "Rain pressed against the tall panes, and the fire did little to warm the corners.",
  "Someone had drawn the curtains early, and no one would say who.",
  "Clara watched the small betrayals pass between them, saying nothing yet.",
  "The maid's account and the gardener's account refused to agree on the smallest points.",
  "By the second round of questions the room had grown noticeably quieter.",
];

describe("applyDeterministicCluePatch — early-clue insertion never opens the chapter (ITEM 12)", () => {
  it("inserts a MISSING early clue at index >= 1: opening preserved, early check satisfied post-insertion", () => {
    const chapter: ProseChapter = { title: "Chapter 1", paragraphs: [...neutralParagraphs] };
    expect(chapterClueAppearsEarly(chapter.paragraphs, "clue_clock", clueDistribution, castNames)).toBe(false);

    const patched = applyDeterministicCluePatch(chapter, scene, ledger, clueDistribution, caseData, castNames);

    expect(patched.insertedEarlyClueIds).toEqual(["clue_clock"]);
    // The original opening still opens the chapter — the A1 lead is NOT paragraph 0.
    expect(patched.chapter.paragraphs[0]).toBe(neutralParagraphs[0]);
    expect(patched.chapter.paragraphs[0]).not.toMatch(A1_LEAD_RE);
    const leadIndex = patched.chapter.paragraphs.findIndex((p) => A1_LEAD_RE.test(p));
    expect(leadIndex).toBeGreaterThanOrEqual(1);
    // The block still lands inside the early quarter the validator checks post-insertion.
    expect(chapterClueAppearsEarly(patched.chapter.paragraphs, "clue_clock", clueDistribution, castNames)).toBe(true);
  });

  it("moves a PRESENT-but-late early clue into the early window without touching the opening", () => {
    const lateParagraphs = [
      ...neutralParagraphs.slice(0, 7),
      "Only at the end did Clara mark it: the mantel clock had been rewound, and the time of death it implied was staged.",
    ];
    const chapter: ProseChapter = { title: "Chapter 1", paragraphs: lateParagraphs };
    expect(chapterClueAppearsEarly(chapter.paragraphs, "clue_clock", clueDistribution, castNames)).toBe(false);

    const patched = applyDeterministicCluePatch(chapter, scene, ledger, clueDistribution, caseData, castNames);

    expect(patched.insertedEarlyClueIds).toEqual(["clue_clock"]);
    expect(patched.chapter.paragraphs[0]).toBe(lateParagraphs[0]);
    expect(patched.chapter.paragraphs[0]).not.toMatch(A1_LEAD_RE);
    expect(chapterClueAppearsEarly(patched.chapter.paragraphs, "clue_clock", clueDistribution, castNames)).toBe(true);
  });

  it("keeps index >= 1 even for a single-paragraph chapter (never a template opening)", () => {
    const chapter: ProseChapter = { title: "Chapter 1", paragraphs: [neutralParagraphs[0]] };
    const patched = applyDeterministicCluePatch(chapter, scene, ledger, clueDistribution, caseData, castNames);

    expect(patched.insertedEarlyClueIds).toEqual(["clue_clock"]);
    expect(patched.chapter.paragraphs[0]).toBe(neutralParagraphs[0]);
    expect(patched.chapter.paragraphs[0]).not.toMatch(A1_LEAD_RE);
  });

  it("does NOT insert when the early clue is already early (legitimate chapter untouched)", () => {
    const earlyParagraphs = [
      "Clara saw at once that the mantel clock had been rewound; whoever staged the time of death had been careless.",
      ...neutralParagraphs.slice(1),
    ];
    const chapter: ProseChapter = { title: "Chapter 1", paragraphs: earlyParagraphs };
    expect(chapterClueAppearsEarly(chapter.paragraphs, "clue_clock", clueDistribution, castNames)).toBe(true);

    const patched = applyDeterministicCluePatch(chapter, scene, ledger, clueDistribution, caseData, castNames);

    expect(patched.insertedClueIds).toEqual([]);
    expect(patched.chapter.paragraphs).toEqual(earlyParagraphs);
  });

  it("leaves an EMPTY chapter unchanged (the guard: nothing to open, nothing inserted)", () => {
    const chapter: ProseChapter = { title: "Chapter 1", paragraphs: [] };
    const patched = applyDeterministicCluePatch(chapter, scene, ledger, clueDistribution, caseData, castNames);

    expect(patched.insertedClueIds).toEqual([]);
    expect(patched.chapter.paragraphs).toEqual([]);
  });

  it("still places late-materials (missing non-early clue) at index >= 1 — unchanged behavior", () => {
    const midLedger: ChapterRequirementLedgerEntry = {
      ...ledger,
      clueObligationContext: [
        { id: "clue_clock", description: "The mantel clock has been rewound.", placement: "mid" },
      ],
    };
    const midDistribution: any = {
      clues: [{ ...clueDistribution.clues[0], placement: "mid" }],
    };
    const chapter: ProseChapter = { title: "Chapter 3", paragraphs: [...neutralParagraphs] };
    const patched = applyDeterministicCluePatch(chapter, scene, midLedger, midDistribution, caseData, castNames);

    expect(patched.insertedClueIds).toEqual(["clue_clock"]);
    expect(patched.insertedEarlyClueIds).toEqual([]);
    expect(patched.chapter.paragraphs[0]).toBe(neutralParagraphs[0]);
  });
});

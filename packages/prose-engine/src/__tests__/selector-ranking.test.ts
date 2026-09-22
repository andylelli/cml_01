/**
 * WHICH HARD HITS MAY DECIDE WHICH DRAFT SHIPS.
 *
 * MEASURED 2026-09-22 on `resume-1790097751711`: the selector chose a 6,620-word draft below the
 * contract floor, with the worse composite, over a 7,615-word draft above it with the better one,
 * because the better draft carried 13 `clue_early` hits and every hard kind counted one. The terms
 * those hits matched were the book's setting — *manor, hall, clock, half past seven* — recurring in
 * chapter 1 because the book is about that clock in that hall.
 */
import { describe, expect, it } from "vitest";

import { buildContractCore } from "../contract.js";
import { SEVERITY } from "../findings.js";
import { checkHardGates, chooseDraft, RANKING_KINDS, rankingFailures, type ScoredDraft } from "../selector.js";
import type { DraftScore, ProseChapterLike } from "../types.js";

const core = buildContractCore({
  cml: {
    CASE: {
      culpability: { culprits: ["Nora Quayle"] },
      cast: [{ name: "Nora Quayle", role_archetype: "suspect" }, { name: "Bertram Norbury", role_archetype: "detective" }],
      hidden_model: { mechanism: { description: "a compass held at a habitual tilt" } },
      prose_requirements: { clue_to_scene_mapping: [] },
    },
  },
  clues: {
    clues: [
      { id: "clue_compass_tilt", observable: "the scuffed brass casing of the compass", description: "worn", criticality: "essential" },
      { id: "clue_ledger_entry", observable: "a fresh ledger entry in different ink at nine o'clock beside the manor hall clock", description: "late entry", criticality: "essential" },
    ],
  },
  outline: {
    acts: [
      {
        scenes: [
          { sceneNumber: 1, act: 1, beat: "gathering", title: "A", characters: [], setting: { location: "x" }, cluesRevealed: ["clue_compass_tilt"] },
          { sceneNumber: 2, act: 2, beat: "final_trap", title: "B", characters: [], setting: { location: "y" }, cluesRevealed: ["clue_ledger_entry"] },
          { sceneNumber: 3, act: 3, beat: "revelation", title: "C", characters: [], setting: { location: "z" } },
        ],
      },
    ],
  },
  cast: { characters: [{ name: "Nora Quayle" }, { name: "Bertram Norbury" }] },
  humourLevel: "classic",
});

const ch = (number: number, ...paragraphs: string[]): ProseChapterLike => ({ title: "t", number, paragraphs });
const ledgerTerms = core.scenes.flatMap((s) => s.mustSurface).find((s) => s.id === "clue_ledger_entry")!.keyTerms;

describe("clue_early fires on a clue staged early, not on a chapter that shares its vocabulary", () => {
  const withInChapter1 = (words: string[]) =>
    checkHardGates([ch(1, `Bertram noticed the ${words.join(" and the ")} before anyone spoke.`), ch(2, "x"), ch(3, "x")], core, [1, 2, 3])
      .filter((h) => h.kind === "clue_early");

  it("KNOWN-NEGATIVE: most of a clue's words, which the old rule called staging, is vocabulary", () => {
    // Enough to satisfy the old ">= max(3, 70%)" and not the new ">= max(4, 90%)".
    const n = ledgerTerms.length;
    const old = Math.max(3, Math.ceil(n * 0.7));
    const now = Math.max(4, Math.ceil(n * 0.9));
    expect(old).toBeLessThan(now); // the fixture must actually separate the two rules
    expect(withInChapter1(ledgerTerms.slice(0, old))).toEqual([]);
  });

  it("KNOWN-POSITIVE: the whole clue on an early page still fires", () => {
    expect(withInChapter1(ledgerTerms).length).toBeGreaterThan(0);
  });

  it("is a defect for the editor, not a fair-play breach", () => {
    expect(SEVERITY.clue_early).toBe("defect");
  });
});

describe("only the kinds that stop or spoil a book rank drafts", () => {
  const scored = (attempt: number, composite: number, hard: Array<DraftScore["hard"][number]["kind"]>): ScoredDraft =>
    ({
      draft: { segment: 0, attempt, chapters: [ch(1, "a"), ch(2, "b"), ch(3, "c")], truncated: false, missing: [] },
      score: { hard: hard.map((kind) => ({ kind, chapter: 1, detail: kind })), composite } as DraftScore,
    }) as ScoredDraft;

  it("KNOWN-POSITIVE: the run's own case — 13 clue_early no longer outrank a sub-floor book", () => {
    const better = scored(1, 22.92, Array(13).fill("clue_early"));
    const shorter = scored(2, 20.07, [...Array(9).fill("clue_early"), "book_short"]);
    expect(chooseDraft([better, shorter])?.draft.attempt).toBe(1);
  });

  it("a draft that ships beats a draft that would stop, whatever the composite says", () => {
    const stops = scored(1, 30, ["reveal_unnamed"]);
    const ships = scored(2, 18, []);
    expect(chooseDraft([stops, ships])?.draft.attempt).toBe(2);
  });

  it("with no ranking failures on either side, the composite decides", () => {
    const a = scored(1, 21, ["clue_early", "clue_early"]);
    const b = scored(2, 24, ["clue_early"]);
    expect(chooseDraft([a, b])?.draft.attempt).toBe(2);
  });

  it("the ranking set is exactly the kinds that stop or spoil, and clue_early is not in it", () => {
    expect([...RANKING_KINDS].sort()).toEqual(["book_short", "chapter_missing", "clue_missing", "culprit_early", "reveal_unnamed", "scaffold"]);
    expect(rankingFailures({ hard: [{ kind: "clue_early", chapter: 1, detail: "" }], composite: 0 } as DraftScore)).toBe(0);
  });
});

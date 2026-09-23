/**
 * THE THREE READS OF 2026-09-22, AS TESTS.
 *
 * A read is an injector audit until it names no injector. These named five phrases of ours on the
 * page and five catchphrases said every chapter, and they found the dead man carrying a comic beat
 * and standing among the living in chapter 1. Each is pinned here with the reader's own example.
 */
import { describe, expect, it } from "vitest";

import { buildContractCore } from "../contract.js";
import { collectCheckerFindings } from "../findings.js";
import { findCatchphrases, findInstructionEchoes, instructionPhrases } from "../instruction-echo.js";
import type { ProseChapterLike } from "../types.js";

const ch = (number: number, ...paragraphs: string[]): ProseChapterLike => ({ title: "t", number, paragraphs });
const asMap = (chapters: ProseChapterLike[]) => new Map(chapters.map((c) => [c.number as number, c]));

describe("instruction echo: our wording on the page, and not the case's", () => {
  const lines = [
    "The second exchange: somebody speaks at length, twenty-five words or more, and the named character answers in six words or fewer.",
    "Opens on the settled outcome",
    "the line that is funnier than its speaker meant",
  ];
  const bible = "The detent lever of the manor clock was found out of place. Beatrice Whitlock's watch stopped at ten past three.";
  const phrases = instructionPhrases(lines, ["Ottoline Dunmore", "Ambrose Halloway"], bible);

  it("KNOWN-POSITIVE: the reader's phrases are echoes", () => {
    const book = asMap([
      ch(3, "Percival delivered his speech, and Josephine answered in six words or fewer."),
      ch(9, "It was, in the end, the settled outcome everyone had dreaded."),
      ch(10, "By morning the settled outcome was known and the house went on."),
    ]);
    const hits = findInstructionEchoes(book, phrases);
    // four words verbatim: an echo on sight
    expect(hits.some((h) => h.chapter === 3 && /six words or fewer/.test(h.phrase))).toBe(true);
    // two words, used twice in the book: an echo in both chapters
    expect(hits.filter((h) => /settled outcome/.test(h.phrase)).map((h) => h.chapter)).toEqual([9, 10]);
  });

  it("KNOWN-NEGATIVE: a short phrase used ONCE is coincidence, not a leak", () => {
    // The first cut reported "short reply" and "next question" on single use in the read books.
    const book = asMap([ch(10, "By morning the settled outcome was known and the house went on.")]);
    expect(findInstructionEchoes(book, phrases)).toEqual([]);
  });

  it("KNOWN-NEGATIVE: function words never make a phrase — 'would have', 'nothing to do with'", () => {
    const withFunctionWords = instructionPhrases(
      ["carries one memory of the dead that is nothing to do with how they died", "what they would have said"],
      [],
      "",
    );
    expect(withFunctionWords).not.toContain("would have");
    expect(withFunctionWords).not.toContain("nothing to do with");
  });

  it("KNOWN-NEGATIVE: the case's own facts are not echoes, however often they recur", () => {
    const book = asMap([ch(1, "The detent lever was out of place, and the manor clock had struck ten past three twice.")]);
    expect(findInstructionEchoes(book, phrases)).toEqual([]);
    expect(phrases.some((p) => /detent lever/.test(p))).toBe(false);
  });

  it("a phrase containing a cast name is never an echo", () => {
    const withName = instructionPhrases(["Ottoline Dunmore answers in six words"], ["Ottoline Dunmore"], "");
    expect(withName.some((p) => /ottoline|dunmore/.test(p))).toBe(false);
  });
});

describe("catchphrase: a voice becomes a label after two", () => {
  const said = (times: number, line: string): ProseChapterLike[] =>
    Array.from({ length: times }, (_u, i) => ch(i + 1, `Nora looked at the ledger. \u201c${line},\u201d she said, and went back to the engine.`));

  it("KNOWN-POSITIVE: 'Torque says otherwise' five times is flagged from the third chapter on", () => {
    const hits = findCatchphrases(asMap(said(5, "Torque says otherwise")));
    expect(hits.map((h) => h.chapter)).toEqual([3, 4, 5]);
    expect(hits[0]?.count).toBe(5);
    expect(hits[0]?.line).toBe("torque says otherwise");
  });

  it("KNOWN-NEGATIVE: twice is a voice", () => {
    expect(findCatchphrases(asMap(said(2, "Torque says otherwise")))).toEqual([]);
  });

  it("a long quoted line is speech, not a catchphrase", () => {
    const long = said(4, "I have said before and will say again that the engine does not lie to me");
    expect(findCatchphrases(asMap(long))).toEqual([]);
  });
});

describe("the victim carries no beat", () => {
  const core = buildContractCore({
    cml: {
      CASE: {
        culpability: { culprits: ["Nora Quayle"] },
        victim: { name: "Montague Gaunt" },
        cast: [
          { name: "Nora Quayle", role_archetype: "suspect" },
          { name: "Bertram Norbury", role_archetype: "detective" },
          { name: "Montague Gaunt", role_archetype: "victim" },
        ],
        hidden_model: { mechanism: { description: "a compass tilt" } },
        prose_requirements: { clue_to_scene_mapping: [] },
      },
    },
    clues: { clues: [{ id: "clue_compass_tilt", observable: "the scuffed brass casing", description: "worn", criticality: "essential" }] },
    outline: {
      acts: [
        {
          scenes: Array.from({ length: 4 }, (_u, i) => ({
            sceneNumber: i + 1,
            act: 1,
            beat: i === 2 ? "final_trap" : i === 3 ? "revelation" : "gathering",
            title: `S${i + 1}`,
            characters: ["Nora Quayle", "Bertram Norbury", "Montague Gaunt"],
            setting: { location: "x" },
            cluesRevealed: i === 0 ? ["clue_compass_tilt"] : [],
          })),
        },
      ],
    },
    cast: { characters: [{ name: "Nora Quayle" }, { name: "Bertram Norbury" }, { name: "Montague Gaunt", role_archetype: "victim" }] },
    profiles: {
      profiles: [
        { name: "Nora Quayle", humourStyle: "dry_wit", humourLevel: 0.6 },
        { name: "Bertram Norbury", humourStyle: "understatement", humourLevel: 0.4 },
        // The only humourless profile is the dead man — which is why he owned the unmeant joke ten times.
        { name: "Montague Gaunt", humourStyle: "none", humourLevel: 0 },
      ],
    },
    humourLevel: "sharp",
  });

  it("KNOWN-POSITIVE: the dead man owns no wit shape in any chapter", () => {
    for (const scene of core.scenes) {
      for (const shape of scene.beats.wit?.shapes ?? []) {
        expect(shape.name, `chapter ${scene.chapter} ${shape.shape}`).not.toBe("Montague Gaunt");
      }
      expect(scene.beats.depth?.name).not.toBe("Montague Gaunt");
    }
  });

  it("and the checker list carries both new checks end to end", () => {
    const chapters = core.scenes.map((s) =>
      ch(s.chapter, "Bertram found the scuffed brass casing. \u201cFact first,\u201d Nora said, and gave the very short answer is what she always gave."),
    );
    const findings = collectCheckerFindings(chapters, core, core.scenes.map((s) => s.chapter), {
      instructionLines: ["the very short answer"],
      caseText: "",
    });
    expect(findings.some((f) => f.class === "catchphrase_repeated")).toBe(true);
    expect(findings.some((f) => f.class === "scaffold_token" && /very short answer/.test(f.note))).toBe(true);
  });
});

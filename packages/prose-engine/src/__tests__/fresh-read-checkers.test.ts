/**
 * 17-hitting-90 §06 — what the first fresh v2 book (run 98dec72a, read 69) carried past the checkers.
 *
 * Every known-positive below is a line from that manuscript, verbatim. Every known-negative is the
 * shape the same checker must leave alone, so a fix for one book cannot become a filter on all of them.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { buildBookContract } from "../book-contract.js";
import { buildContractCore } from "../contract.js";
import { TEMPLATE } from "../contract-phrases.js";
import { anchorFindings, collectCheckerFindings } from "../findings.js";
import { applyEditList, buildGuards } from "../edits.js";
import { indexChapters } from "../chapter-index.js";
import { splitSentences } from "../sentences.js";
import { findInstructionEchoes, instructionStemGrams, stem } from "../instruction-echo.js";
import type { Finding, ProseChapterLike } from "../types.js";

const core = buildContractCore({
  cml: {
    CASE: {
      culpability: { culprits: ["Leonard Pike"] },
      cast: [
        { name: "Leonard Pike", role_archetype: "suspect" },
        { name: "Gerald Harcourt", role_archetype: "detective" },
      ],
    },
  },
  clues: { clues: [] },
  outline: {
    acts: [
      {
        scenes: [
          { sceneNumber: 1, act: 1, beat: "gathering", title: "A", characters: ["Gerald Harcourt"], setting: { location: "x" } },
          { sceneNumber: 2, act: 2, beat: "final_trap", title: "B", characters: ["Gerald Harcourt"], setting: { location: "x" } },
          { sceneNumber: 3, act: 3, beat: "revelation", title: "C", characters: ["Gerald Harcourt"], setting: { location: "x" } },
        ],
      },
    ],
  },
  cast: { characters: [{ name: "Leonard Pike" }, { name: "Gerald Harcourt" }] },
  lockedFacts: [],
});

const chapter = (paragraphs: string[]): ProseChapterLike => ({ title: "t", paragraphs });

const checkerFindings = (chapters: ProseChapterLike[], cls: Finding["class"]): Finding[] =>
  collectCheckerFindings(chapters, core, chapters.map((_, i) => i + 1)).filter((f) => f.class === cls);

describe("one sentence splitter", () => {
  it("an honorific or an initial does not end a sentence", () => {
    expect(splitSentences(`"Order, Mr. Wentworth insists," Charles said. Dr. Langley was dead. J. Pike left.`)).toEqual([
      `"Order, Mr. Wentworth insists," Charles said.`,
      "Dr. Langley was dead.",
      "J. Pike left.",
    ]);
  });

  it("a closing quotation mark ends the sentence with its mark; a speech tag in lower case stays with it", () => {
    expect(splitSentences(`"Is it?" she asked. "Yes." Harcourt turned away.`)).toEqual([
      `"Is it?" she asked.`,
      `"Yes."`,
      "Harcourt turned away.",
    ]);
  });
});

describe("the catchphrase, said through an honorific and with an address added", () => {
  it("KNOWN-POSITIVE: 'Order, Mr. Wentworth insists' three times is found (was 0 — the split at 'Mr.')", () => {
    const written = [
      chapter([`"Order, Mr. Wentworth insists," Charles said, his tone courteous but edged, as he straightened his jacket.`]),
      chapter([`"Order, Mr. Wentworth insists," Charles said, his words a polite rebuke, as he smoothed a crease in his jacket.`]),
      chapter([`"Order, Mr. Wentworth insists," Charles said, his voice polite but with an undertone of accusation.`]),
    ];
    const hits = checkerFindings(written, "catchphrase_repeated");
    expect(hits.map((h) => h.chapter)).toEqual([3]);
    expect(hits[0]!.note).toContain("order mr wentworth insists");
  });

  it("KNOWN-POSITIVE: the line said twice and once more with ', Inspector' is one line said three times", () => {
    const written = [
      chapter([`Margot Ellsworth glanced at Harcourt. "Let's cut to the chase," she said, her voice impatient.`]),
      chapter([`"Let's cut to the chase," Margot said, her voice impatient, reaching for the ink bottle again.`]),
      chapter([`"Let's cut to the chase, Inspector," Margot said, her voice quick, as she reached for a trowel.`]),
    ];
    const hits = checkerFindings(written, "catchphrase_repeated");
    expect(hits.map((h) => h.chapter)).toEqual([3]);
  });

  it("two different lines that share their first words are not merged", () => {
    const written = [
      chapter([`"I don't know," Evelyn said, folding the dust cloth over the back of the chair.`]),
      chapter([`"I don't know," Evelyn said again, and set the tray down on the desk.`]),
      chapter([`"I don't want to," Evelyn said, and did not move from the doorway at all.`]),
    ];
    expect(checkerFindings(written, "catchphrase_repeated")).toEqual([]);
  });
});

describe("a passage repeated inside ONE chapter", () => {
  // Chapter 2 of run 98dec72a, verbatim: the second sentence is the third.
  const repeated = chapter([
    "Leonard Pike crouched at the base of the ladder that rose beside the dig's battered entrance. His finger traced the pale powder, drawing attention to the prints—some overlapping, all fresh, none quite matching the shoe size worn by Charles Wentworth, who stood nearby with arms folded and an expression somewhere between courtesy and concern. His finger traced the pale powder, drawing attention to the prints—some overlapping, all fresh, none quite matching the shoe size worn by Charles Wentworth, who stood nearby with arms folded and an expression somewhere between courtesy and concern. Margot Ellsworth stood with her back to the morning sun, notebook in hand.",
  ]);

  it("KNOWN-POSITIVE: found and anchored (was 0 of 3 — the check looked only across chapters)", () => {
    const hits = checkerFindings([repeated], "copied_sentence");
    expect(hits).toHaveLength(1);
    expect(hits[0]!.note).toBe("earlier in this chapter, word for word");
    const { anchored } = anchorFindings(hits, indexChapters([repeated], [1]));
    expect(anchored).toHaveLength(1);
  });

  it("a short line said twice in a chapter is not a copied passage", () => {
    const written = [chapter([`"No," Evelyn said.`, `Harcourt waited, and asked again, and Evelyn shook her head. "No," Evelyn said.`])];
    expect(checkerFindings(written, "copied_sentence")).toEqual([]);
  });
});

describe("a checker's short quote is widened, not discarded", () => {
  const written = [
    chapter([
      `"Who found the duplicate key in Pike's possession?" Sir Edmund asked, his voice measured but heavy with implication. Harcourt answered with four words.`,
      `"I know what the ledger says," Evelyn said. Evelyn's answer was brief. She turned back to the tray of pens on the desk.`,
    ]),
  ];

  it("KNOWN-POSITIVE: 'answered with four words' is an announced shape (was unmatched: 'with', not 'in')", () => {
    const hits = checkerFindings(written, "operation_narrated");
    expect(hits.some((h) => h.quote.includes("Harcourt answered with four words."))).toBe(true);
  });

  it("KNOWN-POSITIVE: both short announcements reach the editor (were discarded under eight words)", () => {
    const hits = checkerFindings(written, "operation_narrated");
    const { anchored, discarded } = anchorFindings(hits, indexChapters(written, [1]));
    expect(discarded).toEqual([]);
    expect(anchored.map((f) => f.quote)).toEqual([
      expect.stringContaining("Harcourt answered with four words."),
      expect.stringContaining("Evelyn's answer was brief."),
    ]);
    for (const f of anchored) expect(f.quote.split(/\s+/).length).toBeGreaterThanOrEqual(8);
  });
});

describe("the edit guard against a splice that repeats its neighbour", () => {
  const original = chapter([
    "Gerald Harcourt knelt at the foot of the ladder. Leonard Pike watched him from the doorway of the tent, a ledger under one arm.",
  ]);
  const options = { lockedValues: [], castNames: ["Leonard Pike", "Gerald Harcourt"], findings: [] as Finding[] };

  it("KNOWN-POSITIVE: a replacement that restates the next sentence is reverted, and the tally names the guard", () => {
    // The shape of run 98dec72a chapter 4: the replacement carries the text that already follows it.
    const { chapter: out, outcome } = applyEditList(
      original,
      {
        edits: [
          {
            find: "Gerald Harcourt knelt at the foot of the ladder.",
            replace:
              "Gerald Harcourt knelt at the foot of the ladder. Leonard Pike watched him from the doorway of the tent, a ledger under one arm.",
            addresses: [],
          },
        ],
        cannot: [],
      },
      options,
    );
    expect(outcome.applied).toBe(0);
    expect(outcome.rolledBack.noNewDuplicate).toBe(1);
    expect(out).toBe(original);
  });

  it("a repair — fewer copies — is never a new violation of this guard, even a partial one", () => {
    const { validator } = buildGuards({ lockedValues: [], castNames: [] });
    const line = "Leonard Pike watched him from the doorway of the tent, a ledger under one arm.";
    const three = validator(chapter([`${line} ${line} ${line} Harcourt stood.`])).violations;
    const two = validator(chapter([`${line} ${line} Harcourt stood.`])).violations;
    const one = validator(chapter([`${line} Harcourt stood.`])).violations;
    expect(three.filter((v) => v.startsWith("noNewDuplicate"))).toHaveLength(1);
    expect(two.filter((v) => !three.includes(v))).toEqual([]);
    expect(one.filter((v) => v.startsWith("noNewDuplicate"))).toEqual([]);
  });
});

describe("our own instruction, printed in another tense", () => {
  // Two brief lines as they stood when run 98dec72a was written (brief.ts, 2026-09-25).
  const lines = [
    "One paragraph in each chapter is there for its own sake: a detail, a gesture or an exchange that carries nothing the plot needs.",
    "Chapter 10 opens on the first ordinary thing that happens once the case is closed, and ends on the place resuming ordinary use.",
  ];
  const echoes = (sentences: string[], caseText = ""): string[] => {
    const grams = instructionStemGrams(lines, ["Edmund Fairfax"], caseText);
    const map = new Map([[1, chapter(sentences)]]);
    return findInstructionEchoes(map, [], grams).map((h) => h.phrase);
  };

  it("KNOWN-POSITIVE: the three 'carried nothing the plot needed' lines and 'resumed its ordinary use' (were 0 of 4)", () => {
    expect(
      echoes([
        "Sir Edmund Fairfax closed the ledger, his hand lingering on its cover—a gesture that carried nothing the plot needed, only the patience of an owner.",
        "The study resumed its ordinary use, the fire burning low, the evidence stored.",
      ]),
    ).toEqual(["~carry plot need", "~resum ordinary use"]);
  });

  it("ordinary English that shares two of the words is not an echo", () => {
    expect(echoes(["She needed nothing from the plot of land behind the church.", "The ordinary use of the room was for cards."])).toEqual([]);
  });

  it("wording the case itself uses is the case's, not ours", () => {
    expect(echoes(["The study resumed its ordinary use."], "the manor resumed ordinary use after the war")).toEqual([]);
  });

  it("the stem joins the tenses the writer changes and nothing more", () => {
    expect(["carries", "carried", "carry"].map(stem)).toEqual(["carry", "carry", "carry"]);
    expect(["needs", "needed", "resuming", "resumed", "changes", "change"].map(stem)).toEqual([
      "need", "need", "resum", "resum", "chang", "chang",
    ]);
    expect(stem("glass")).toBe("glass");
  });
});

describe("the brief names no property the narrator has already printed from it", () => {
  // Each of these came back as narration on a read book: "spoke at length" (pair 3 x7, 98dec72a x7),
  // "carried nothing the plot needed" x3, "the survivors changed in concrete ways", "Evelyn's answer
  // was brief", "Sir Edmund's reply was short", "The confrontation ended in the scene".
  const PRINTED = /\b(?:at length|the plot|survivors?|concrete change|very short answer|short reply|long speech|in the scene)\b/i;
  const golden = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..", "eval", "golden");
  const bundles = existsSync(golden) ? readdirSync(golden).filter((f) => f.startsWith("bundle-")) : [];

  it.each(bundles)("%s: no brief line carries one", (file) => {
    const a = JSON.parse(readFileSync(join(golden, file), "utf8")).artifacts;
    const contract = buildBookContract({
      cml: a.cml ?? {},
      clues: a.clues ?? null,
      outline: a.outline?.narrative ?? a.outline,
      cast: a.cast?.cast ?? a.cast,
      profiles: a.character_profiles ?? null,
      world: a.world_document,
      locations: a.location_profiles,
      temporal: a.temporal_context,
      setting: a.setting,
      lockedFacts: a.hard_logic_devices?.devices?.[0]?.lockedFacts ?? [],
      humourLevel: "classic",
    });
    expect(contract.brief.asks.map((ask) => ask.line).filter((line) => PRINTED.test(line))).toEqual([]);
    expect(contract.brief.asks.some((ask) => ask.section === "shapes")).toBe(true);
    expect(Object.values(TEMPLATE).filter((phrase) => PRINTED.test(phrase))).toEqual([]);
  });
});

describe("each stock line is owned by one chapter", () => {
  const golden = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..", "eval", "golden");
  const bundles = existsSync(golden) ? readdirSync(golden).filter((f) => f.startsWith("bundle-")) : [];

  it.each(bundles)("%s: one chapter each, the character on the page, never the reveal or the aftermath", (file) => {
    const a = JSON.parse(readFileSync(join(golden, file), "utf8")).artifacts;
    const contract = buildBookContract({
      cml: a.cml ?? {},
      clues: a.clues ?? null,
      outline: a.outline?.narrative ?? a.outline,
      cast: a.cast?.cast ?? a.cast,
      profiles: a.character_profiles ?? null,
      humourLevel: "classic",
    });
    const text = contract.bible.text;
    expect(text).not.toContain("Says, in their own way");
    const owned = [...text.matchAll(/Says this once in the book, in chapter (\d+):/g)].map((m) => Number(m[1]));
    // The dead speak only in the scene set before the death (P2.1), when the case has one.
    const woundChapter = contract.scenes.find((s) => s.wound?.victim === contract.fairPlay.victim)?.chapter;
    const withTic = (a.character_profiles?.profiles ?? []).filter(
      (p: { signatureTic?: string; name?: string }) => p.signatureTic && (p.name !== contract.fairPlay.victim || woundChapter !== undefined),
    );
    expect(owned.length).toBe(withTic.length);
    for (const c of owned) {
      expect([contract.roles.reveal, contract.roles.aftermath]).not.toContain(c);
    }
    // Spread: no chapter carries more stock lines than it must.
    const perChapter = new Map<number, number>();
    for (const c of owned) perChapter.set(c, (perChapter.get(c) ?? 0) + 1);
    expect(Math.max(...perChapter.values())).toBeLessThanOrEqual(Math.ceil(owned.length / (contract.scenes.length - 2)) + 1);
  });
});

describe("a clue recited as a report", () => {
  // The line is run 98dec72a's, verbatim. Its observable is ASSUMED from the line: the case file is
  // on the laptop, so the fixture is the shape, not a record.
  const observable = "Ink composition of forged letter unavailable before half past eleven.";
  const reciteCore = buildContractCore({
    cml: { CASE: { culpability: { culprits: ["Leonard Pike"] }, cast: [{ name: "Leonard Pike" }, { name: "Gerald Harcourt" }] } },
    clues: { clues: [{ id: "clue_ink", observable, criticality: "essential" }] },
    outline: {
      acts: [{ scenes: [{ sceneNumber: 1, act: 1, beat: "investigation", title: "A", characters: ["Gerald Harcourt"], setting: { location: "x" }, cluesRevealed: ["clue_ink"] }] }],
    },
    cast: { characters: [{ name: "Leonard Pike" }, { name: "Gerald Harcourt" }] },
    lockedFacts: [],
  });
  const recited = (paragraphs: string[]): Finding[] =>
    collectCheckerFindings([chapter(paragraphs)], reciteCore, [1]).filter((f) => f.class === "clue_recited");

  it("KNOWN-POSITIVE: the observable, said to the investigator", () => {
    const hits = recited([
      `"Inspector, the ink composition of forged letter unavailable before half past eleven," Pike said, setting the bottle down beside the blotter.`,
    ]);
    expect(hits).toHaveLength(1);
    expect(hits[0]!.severity).toBe("craft");
  });

  it("the same clue found by a person, and read aloud in the speaker's own words, is not a recital", () => {
    expect(
      recited([
        "Harcourt tipped the letter to the lamp. The ink had the violet cast of the new stock the stationer delivered at half past eleven, and the signature sat on top of it.",
        `"Then she signed this after she was dead," Harcourt said. "Which she did not."`,
      ]),
    ).toEqual([]);
  });
});

describe("a clue surfaced in the narration BETWEEN two speeches is not a recital", () => {
  const observable = "Ink composition of forged letter unavailable before half past eleven.";
  const between = buildContractCore({
    cml: { CASE: { culpability: { culprits: ["Leonard Pike"] }, cast: [{ name: "Leonard Pike" }, { name: "Gerald Harcourt" }] } },
    clues: { clues: [{ id: "clue_ink", observable, criticality: "essential" }] },
    outline: {
      acts: [{ scenes: [{ sceneNumber: 1, act: 1, beat: "investigation", title: "A", characters: ["Gerald Harcourt"], setting: { location: "x" }, cluesRevealed: ["clue_ink"] }] }],
    },
    cast: { characters: [{ name: "Leonard Pike" }, { name: "Gerald Harcourt" }] },
    lockedFacts: [],
  });

  it("KNOWN-NEGATIVE: straight quotes either side of narration that carries the clue", () => {
    const paragraph =
      `"Look at it," Harcourt said, tilting the forged letter so the ink composition showed, a violet unavailable before half past eleven, "and tell me she wrote this."`;
    const found = collectCheckerFindings([chapter([paragraph])], between, [1]).filter((f) => f.class === "clue_recited");
    expect(found).toEqual([]);
  });
});

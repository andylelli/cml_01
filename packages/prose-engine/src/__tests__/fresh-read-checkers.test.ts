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
import { textureLines } from "../depth.js";
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
    expect(three.filter((v) => v.startsWith("noNewDuplicate")).length).toBeGreaterThan(0);
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
  const PRINTED = /\b(?:at length|the plot|survivors?|concrete change|very short answer|short reply|long speech|in the scene|could not have|before the arrest|last paragraph|consequence|shows? changed)\b/i;
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

describe("§06 R1, R5 — the test is performed once; the culprit does not find the clues", () => {
  const golden = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..", "eval", "golden");
  const bundles = existsSync(golden) ? readdirSync(golden).filter((f) => f.startsWith("bundle-")) : [];
  const load = (file: string) => {
    const a = JSON.parse(readFileSync(join(golden, file), "utf8")).artifacts;
    return buildBookContract({
      cml: a.cml ?? {},
      clues: a.clues ?? null,
      outline: a.outline?.narrative ?? a.outline,
      cast: a.cast?.cast ?? a.cast,
      profiles: a.character_profiles ?? null,
      humourLevel: "classic",
    });
  };

  it.each(bundles)("%s: one chapter carries the test; the reveal refers back to it (was 8 AND 9 in 4 of 4)", (file) => {
    const contract = load(file);
    const carriers = contract.scenes.filter((s) => s.testSubjects).map((s) => s.chapter);
    const testChapter = contract.roles.discriminatingTest ?? contract.roles.reveal;
    expect(carriers).toEqual([testChapter]);
    const reveal = contract.scenes.find((s) => s.chapter === contract.roles.reveal)!;
    expect(reveal.testSeenIn).toBe(testChapter === contract.roles.reveal ? undefined : testChapter);
  });

  it.each(bundles)("%s: the clue list names who finds them, and it is not the culprit", (file) => {
    const contract = load(file);
    const culprit = contract.fairPlay.culprits[0]!;
    expect(contract.bible.text).toContain(`anyone present except ${culprit}`);
  });
});

describe("§06 R3 — the humour move named by the narrator", () => {
  const moves = (paragraphs: string[]): Finding[] => checkerFindings([chapter(paragraphs)], "humour_move_narrated");

  it("KNOWN-POSITIVE: run 98dec72a's labels", () => {
    expect(
      moves([
        "Charles Wentworth stepped closer. Harcourt noted the phrase, marking it in his mind as the cruellest thing in the room, dressed in perfect politeness.",
        "Evelyn Marsh poured another cup of tea, her humor at her own expense softening the tension.",
        "Margot Ellsworth spoke, her voice ringing with the plain truth everyone else had avoided.",
        "His hand lingered on its frame, the gap between his words and what the moment deserved a reminder of the estate's long winters.",
      ]),
    ).toHaveLength(4);
  });

  it("the corpus's false positives, and the move performed in a line, are not findings", () => {
    expect(
      moves([
        "He stepped aside, the strain on his face betraying both frustration and fear.",
        "Eleanor straightened, her face composed but her hands betraying a slight tremor.",
        "He measured the gap once more—six inches, no more, no less.",
        `"I'm the plain one, and I'll say the thing nobody here will," Margot said, and nobody answered her.`,
      ]),
    ).toEqual([]);
  });
});

describe("§06 R4 — the chapter that ends by summing itself up", () => {
  it("KNOWN-POSITIVE: run 98dec72a's chapter endings", () => {
    const hits = checkerFindings(
      [
        chapter([`"Time matters," Harcourt said.`, "The investigation pressed on, each detail—scarf, smudge, glove mark, ledger—drawing the group closer to the truth hidden within Ashford Manor."]),
        chapter([`"No," Evelyn said.`, "The study held its secrets close, each detail—footprints, dust, bruising—waiting for the careful hands of Inspector Harcourt."]),
      ],
      "summary_ending",
    );
    expect(hits.map((h) => h.chapter)).toEqual([1, 2]);
  });

  it("a chapter that ends on somebody doing something, or on speech, is not one", () => {
    expect(
      checkerFindings(
        [
          chapter(["Harcourt set the key on the tray.", "As Montague Norbury closed the door behind them, the body remained where it lay, her hand still atop an unopened letter."]),
          chapter(["Harcourt waited.", `"Every detail matters," he said, "and the investigation pressed on without me."`]),
        ],
        "summary_ending",
      ),
    ).toEqual([]);
  });
});

describe("§07 — depth from what the pipeline already wrote, each piece owned by one chapter", () => {
  const golden = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..", "eval", "golden");
  const bundles = existsSync(golden) ? readdirSync(golden).filter((f) => f.startsWith("bundle-")) : [];
  const load = (file: string) => {
    const a = JSON.parse(readFileSync(join(golden, file), "utf8")).artifacts;
    return buildBookContract({
      cml: a.cml ?? {},
      clues: a.clues ?? null,
      outline: a.outline?.narrative ?? a.outline,
      cast: a.cast?.cast ?? a.cast,
      profiles: a.character_profiles ?? null,
      world: a.world_document,
      locations: a.location_profiles,
      temporal: a.temporal_context,
      setting: a.setting,
      humourLevel: "classic",
    });
  };

  it.each(bundles)("%s: most chapters before the reveal carry some; no piece is given twice", (file) => {
    const contract = load(file);
    const before = contract.scenes.filter((s) => s.chapter < contract.roles.reveal);
    expect(before.filter((s) => s.texture && textureLines(s.texture).length > 0).length).toBeGreaterThanOrEqual(before.length - 2);
    const pieces = contract.scenes.flatMap((s) => [
      ...(s.texture?.senses ?? []),
      s.texture?.friction,
      s.texture?.conflict?.name,
      s.texture?.history ? `${s.texture.history.a}|${s.texture.history.b}` : undefined,
      s.texture?.access,
    ]).filter(Boolean);
    expect(new Set(pieces).size).toBe(pieces.length);
  });

  it.each(bundles)("%s: the culprit's inner conflict is never asked for, and none of it is in the bible", (file) => {
    const contract = load(file);
    for (const s of contract.scenes) {
      expect(contract.fairPlay.culprits).not.toContain(s.texture?.conflict?.name);
      for (const line of textureLines(s.texture)) {
        const payload = line.split(": ").slice(1).join(": ").slice(0, 40);
        if (payload.length >= 20) expect(contract.bible.text).not.toContain(payload);
      }
    }
  });

  it.each(bundles)("%s: the reveal and the aftermath carry no conflict, relationship or period friction", (file) => {
    const contract = load(file);
    for (const s of contract.scenes.filter((x) => x.chapter >= contract.roles.reveal)) {
      expect([s.texture?.conflict, s.texture?.history, s.texture?.friction].filter(Boolean)).toEqual([]);
    }
  });
});

describe("§06.8 — the same words twice inside one paragraph (the 74's six)", () => {
  const hits = (paragraphs: string[]): Finding[] => checkerFindings([chapter(paragraphs)], "copied_sentence");

  it("KNOWN-POSITIVE: a clause doubled, a line copied to the front, a sentence restated", () => {
    expect(hits([`"We'll see where the facts lead." Inspector Gerald Harcourt crossed the threshold into the study, his shoes catching on the thick Persian carpet that dulled the sound of the rain, his shoes catching on the thick Persian carpet that dulled the sound of the rain. He paused.`])).toHaveLength(1);
    expect(hits([`"Why would anyone need a second key?" Evelyn Marsh straightened the pile of correspondence. "Why would anyone need a second key?" she asked, her hands moving methodically.`])).toHaveLength(1);
    expect(hits([`She paused and turned back, her frustration visible as she returned to the ladder base. She returned to the ladder base, her frustration palpable, but her determination as strong as ever.`])).toHaveLength(1);
  });

  it("a clock value said twice is its locked form, and ordinary prose is not a copy", () => {
    expect(hits([`The clock struck twenty minutes past ten o'clock and Harcourt noted twenty minutes past ten o'clock in the margin.`])).toEqual([]);
    expect(hits([`Harcourt set the key on the tray and turned to the window, where the rain had begun again over the gardens and the dig.`])).toEqual([]);
  });

  it("an edit that doubles a clause is reverted by the guard", () => {
    const original = chapter([
      "Harcourt crossed the threshold, his shoes catching on the thick Persian carpet that dulled the rain. Leonard Pike watched from the doorway.",
    ]);
    const { outcome } = applyEditList(
      original,
      { edits: [{ find: "that dulled the rain.", replace: "that dulled the rain, his shoes catching on the thick Persian carpet that dulled the rain.", addresses: [] }], cannot: [] },
      { lockedValues: [], castNames: ["Leonard Pike"], findings: [] },
    );
    expect(outcome.applied).toBe(0);
    expect(outcome.rolledBack.noNewDuplicate).toBe(1);
  });
});

describe("A_109 M5 — the fact said again in new words", () => {
  const recapCore = buildContractCore({
    cml: { CASE: { culpability: { culprits: ["Leonard Pike"] }, cast: [{ name: "Leonard Pike" }, { name: "Margot Ellsworth" }, { name: "Gerald Harcourt", role_archetype: "detective" }] } },
    clues: { clues: [] },
    outline: {
      acts: [
        {
          scenes: [1, 2, 3, 4, 5].map((n) => ({ sceneNumber: n, act: 1, beat: n === 4 ? "final_trap" : n === 5 ? "revelation" : "investigation", title: `S${n}`, characters: ["Gerald Harcourt", "Margot Ellsworth"], setting: { location: "x" } })),
        },
      ],
    },
    cast: { characters: [{ name: "Leonard Pike" }, { name: "Margot Ellsworth" }, { name: "Gerald Harcourt" }] },
    lockedFacts: [],
  });
  const margot: [number, number] = [540, 600]; // nine o'clock to ten o'clock
  const recaps = (chapters: ProseChapterLike[], windows: Array<[number, number]>) =>
    collectCheckerFindings(chapters, recapCore, chapters.map((_, i) => i + 1), { alibiWindows: windows }).filter((f) => f.class === "recap");

  it("KNOWN-POSITIVE: run 98dec72a's Margot alibi, given in chapter 1 and again in chapters 2 and 3, first person and third", () => {
    const hits = recaps(
      [
        chapter([`Margot glanced toward the dig tent where her own alibi — nine o'clock to ten o'clock — stood, bolstered by witness logs and routine.`]),
        chapter([`"I was in the kitchen from nine o'clock to ten o'clock — everyone saw me, and the logs confirm it," Margot said.`]),
        chapter([`Harcourt reviewed the logs as he noted the timings, nine o'clock to ten o'clock, matched by staff testimony for Margot.`]),
      ],
      [margot],
    );
    expect(hits.map((h) => h.chapter)).toEqual([2, 3]);
    expect(hits[0]!.note).toContain("first given in chapter 1");
  });

  it("a window that is not an alibi — the act, the tide — is not tracked; the test/reveal chapter is exempt, the aftermath is not", () => {
    const tide = [
      chapter([`The cave was open only from twenty minutes past three to half past three, when the tide was out.`]),
      chapter([`"Twenty minutes past three to half past three," Norbury said again, tapping the chart.`]),
    ];
    expect(recaps(tide, [margot])).toEqual([]);
    const reveal = [
      chapter([`Her alibi ran from nine o'clock to ten o'clock, the cook said.`]),
      chapter([`Harcourt waited.`]),
      chapter([`Harcourt waited again.`]),
      chapter([`At the test, the kitchen logs showed nine o'clock to ten o'clock for Margot.`]),
      chapter([`"From nine o'clock to ten o'clock you were in the kitchen, Margot," Harcourt said at the last.`]),
    ];
    // Chapter 4 is the test and the reveal (exempt); chapter 5 is the aftermath, where an alibi said
    // again is a recap like any other.
    expect(recaps(reveal, [margot]).map((h) => h.chapter)).toEqual([5]);
  });
});

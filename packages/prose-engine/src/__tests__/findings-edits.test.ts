/**
 * ANALYSIS_99 §10.13 — the findings' anchoring law, and the edit guards on the corruptions this
 * project has actually shipped.
 *
 * The guard fixtures are not invented. Each is a line an external reader quoted back to us, or a
 * corruption a deterministic pass introduced into a clean chapter:
 *   - "You; searching for blame in the shadowed places"      A_96 F4, run 50862
 *   - "froze at three past midnight past three"               A_90 §11.2
 *   - "Nora gaunt let a flicker of amusement"                  A_89 C1, run 88651
 */
import { describe, expect, it } from "vitest";

import { buildContractCore } from "../contract.js";
import {
  anchorFindings,
  buildCriticPrompt,
  collectCheckerFindings,
  CRITIC_CLASSES,
  parseCriticFindings,
  summariseFindings,
} from "../findings.js";
import { applyEditList, buildEditorPrompt, parseEditList, summariseEdits } from "../edits.js";
import type { Finding, ProseChapterLike } from "../types.js";

const core = buildContractCore({
  cml: {
    CASE: {
      culpability: { culprits: ["Nora Quayle"] },
      cast: [
        { name: "Nora Quayle", role_archetype: "suspect" },
        { name: "Bertram Norbury", role_archetype: "detective" },
      ],
      hidden_model: {
        mechanism: {
          description: "a compass held at a habitual tilt",
          apparent_time_of_death: "a quarter to four",
          actual_time_of_death: "ten minutes past three",
        },
      },
    },
  },
  clues: { clues: [{ id: "clue_compass", observable: "the scuffed brass casing of the compass", criticality: "essential" }] },
  outline: {
    acts: [
      {
        scenes: [
          { sceneNumber: 1, act: 1, beat: "gathering", title: "A", characters: ["Bertram Norbury"], setting: { location: "x" }, cluesRevealed: ["clue_compass"] },
          { sceneNumber: 2, act: 2, beat: "final_trap", title: "B", characters: ["Bertram Norbury"], setting: { location: "x" } },
          { sceneNumber: 3, act: 3, beat: "revelation", title: "C", characters: ["Bertram Norbury"], setting: { location: "x" } },
        ],
      },
    ],
  },
  cast: { characters: [{ name: "Nora Quayle" }, { name: "Bertram Norbury" }] },
  lockedFacts: [
    { id: "chime", value: "ten minutes past three", description: "the chime strikes" },
    { id: "dial", value: "a quarter to four", description: "the dial shows" },
  ],
});

const chapter = (paragraphs: string[]): ProseChapterLike => ({ title: "t", paragraphs });

describe("the anchoring law", () => {
  const chapters = new Map<number, ProseChapterLike>([
    [1, chapter(["Bertram turned the compass over and found the scuffed brass casing, worn along one edge."])],
  ]);

  const make = (quote: string, chapterNumber = 1): Finding => ({
    class: "flat_reveal",
    chapter: chapterNumber,
    quote,
    note: "",
    severity: "craft",
    source: "critic",
  });

  it("a quote that is in the chapter survives", () => {
    const { anchored, discarded } = anchorFindings(
      [make("turned the compass over and found the scuffed brass casing")],
      chapters,
    );
    expect(anchored).toHaveLength(1);
    expect(discarded).toHaveLength(0);
  });

  it("a paraphrase is discarded, because an editor cannot find it either", () => {
    const { anchored, discarded } = anchorFindings([make("he examined the compass casing closely indeed")], chapters);
    expect(anchored).toHaveLength(0);
    expect(discarded).toHaveLength(1);
  });

  it("a quote too short to locate anything is discarded", () => {
    const { discarded } = anchorFindings([make("the compass")], chapters);
    expect(discarded).toHaveLength(1);
  });

  it("a quote from a DIFFERENT chapter is discarded", () => {
    const { discarded } = anchorFindings([make("turned the compass over and found the scuffed brass casing", 2)], chapters);
    expect(discarded).toHaveLength(1);
  });
});

describe("the checkers quote what they matched", () => {
  const written: ProseChapterLike[] = [
    chapter([
      "Bertram turned the compass over and found the scuffed brass casing, worn along one edge where a thumb had rested.",
      "The mechanism behind it all remained hidden, the contradiction unresolved, and the matter stood where it stood.",
    ]),
    chapter(["The dunes were cold, and the tide had gone a long way out by half past eleven."]),
    chapter(["Because the evidence proved it, and the alibi could not have held, the household absorbed the news."]),
  ];

  const findings = collectCheckerFindings(written, core, [1, 2, 3]);

  it("every checker finding is anchored in the chapter it names", () => {
    const map = new Map<number, ProseChapterLike>([
      [1, written[0]!],
      [2, written[1]!],
      [3, written[2]!],
    ]);
    const { discarded } = anchorFindings(findings, map);
    expect(discarded.map((d) => `${d.class}: ${d.quote}`)).toEqual([]);
  });

  it("KNOWN-POSITIVE: a register sentence is found and quoted", () => {
    const register = findings.filter((f) => f.class === "register_sentence");
    expect(register.length).toBeGreaterThan(0);
    expect(register[0]!.quote).toMatch(/mechanism behind it all remained hidden/);
  });

  it("KNOWN-POSITIVE: a clock value on no row of the chronology", () => {
    const clock = findings.filter((f) => f.class === "clock_off_table");
    expect(clock.length).toBeGreaterThan(0);
    expect(clock[0]!.note).toMatch(/half past eleven/);
  });

  it("KNOWN-POSITIVE: the aftermath arguing the case again", () => {
    expect(findings.some((f) => f.class === "reveal_residue_in_aftermath" && f.chapter === 3)).toBe(true);
  });

  it("KNOWN-POSITIVE: a sentence copied into a second chapter", () => {
    const copied = collectCheckerFindings(
      [written[0]!, chapter([written[0]!.paragraphs[0]!]), written[2]!],
      core,
      [1, 2, 3],
    );
    expect(copied.some((f) => f.class === "copied_sentence" && f.chapter === 2)).toBe(true);
  });

  it("a clean chapter of concrete prose produces no craft finding", () => {
    const clean = collectCheckerFindings(
      [
        chapter([
          "Bertram turned the compass over and found the scuffed brass casing, worn along one edge where a thumb had rested.",
          '"You hold it flat," he said, and set it down on the ledger.',
        ]),
        chapter(["She poured the tea and did not look up."]),
        chapter(["Mrs Pardoe swept the promenade at dawn and propped the kiosk shutter open with a brick."]),
      ],
      core,
      [1, 2, 3],
    );
    // The instrument is strict by design: "The promenade had been swept, and the kiosk was open
    // again" scores three of its four features (stative verb, nothing to touch, nothing to sense)
    // and IS the register a reader calls machine-written. A person doing something with a named
    // object scores none of them.
    expect(clean.filter((f) => f.class === "register_sentence")).toEqual([]);
  });
});

describe("the critic's prompt and parser", () => {
  it("the prompt carries the roles, the clock and the closed vocabulary, and quotes no prose", () => {
    const prompt = buildCriticPrompt({
      chapters: [chapter(["A sentence."]), chapter(["Another."]), chapter(["A third."])],
      core,
      expected: [1, 2, 3],
    });
    expect(prompt).toMatch(/The culprit is named in chapter 2/);
    expect(prompt).toMatch(/THE CLOCK/);
    for (const cls of CRITIC_CLASSES) expect(prompt).toContain(cls);
    // A_67 — no specimen finding, because a specimen is reproduced.
    expect(prompt).not.toMatch(/for example/i);
  });

  it("parses findings and rejects a class outside the vocabulary", () => {
    const raw = JSON.stringify({
      findings: [
        { class: "timing_contradiction", chapter: 2, quote: "the tide had gone a long way out by half past eleven", note: "a" },
        { class: "clue_missing", chapter: 1, quote: "this is a checker's class and not the critic's", note: "b" },
        { class: "not_a_class", chapter: 1, quote: "nonsense", note: "c" },
      ],
    });
    const parsed = parseCriticFindings(raw);
    expect(parsed.findings).toHaveLength(1);
    expect(parsed.findings[0]!.class).toBe("timing_contradiction");
    expect(parsed.malformed).toBe(2);
  });

  it("an unreadable reply is zero findings, never an exception", () => {
    for (const raw of ["", "I cannot help with that.", "{broken", "[]"]) {
      expect(parseCriticFindings(raw).findings).toEqual([]);
    }
  });

  it("the summary counts anchored and unanchored per class", () => {
    const f = (cls: Finding["class"], quote: string): Finding => ({ class: cls, chapter: 1, quote, note: "", severity: "craft", source: "critic" });
    const line = summariseFindings([f("flat_reveal", "a")], [f("flat_reveal", "b"), f("pacing_drift", "c")]);
    expect(line).toMatch(/flat_reveal 1\(\+1 unanchored\)/);
    expect(line).toMatch(/pacing_drift 0\(\+1 unanchored\)/);
  });
});

describe("the edit guards — every fixture is a corruption this project shipped", () => {
  const original = chapter([
    "Bertram turned the compass over at ten minutes past three and found the scuffed brass casing.",
    "Nora Quayle let a flicker of amusement cross her face, and said nothing at all about the ledger.",
  ]);
  const options = {
    scene: core.scenes[0]!,
    lockedValues: ["ten minutes past three"],
    castNames: ["Nora Quayle", "Bertram Norbury"],
    findings: [] as Finding[],
  };

  it("a clean edit applies", () => {
    const { chapter: out, outcome } = applyEditList(
      original,
      { edits: [{ find: "said nothing at all about the ledger", replace: "set the ledger down unopened", addresses: [] }], cannot: [] },
      options,
    );
    expect(outcome.applied).toBe(1);
    expect(out.paragraphs[1]).toContain("set the ledger down unopened");
  });

  it("A_90 §11.2 — an edit that moves a clock value is reverted", () => {
    const { chapter: out, outcome } = applyEditList(
      original,
      { edits: [{ find: "at ten minutes past three", replace: "at three past midnight", addresses: [] }], cannot: [] },
      options,
    );
    expect(outcome.applied).toBe(0);
    expect(out.paragraphs[0]).toContain("ten minutes past three");
    expect(Object.keys(outcome.rolledBack).length).toBeGreaterThan(0);
  });

  it("A_89 C1 — an edit that lowercases a surname is reverted", () => {
    const { outcome } = applyEditList(
      original,
      { edits: [{ find: "Nora Quayle let a flicker", replace: "Nora quayle let a flicker", addresses: [] }], cannot: [] },
      options,
    );
    expect(outcome.applied).toBe(0);
  });

  it("A_96 F4 — an edit that splices a malformed clause is reverted", () => {
    const { outcome } = applyEditList(
      original,
      { edits: [{ find: "and said nothing at all", replace: "and you; searching for blame", addresses: [] }], cannot: [] },
      options,
    );
    expect(outcome.applied).toBe(0);
    expect(outcome.rolledBack.noMalformedSplice).toBe(1);
  });

  it("an edit that introduces a scaffold token is reverted", () => {
    const { outcome } = applyEditList(
      original,
      { edits: [{ find: "the scuffed brass casing", replace: "clue_compass, the scuffed brass casing", addresses: [] }], cannot: [] },
      options,
    );
    expect(outcome.applied).toBe(0);
    expect(outcome.rolledBack.noNewScaffold).toBe(1);
  });

  it("an edit that deletes a character is reverted, and the tally names THAT guard", () => {
    // The first cut of this test expected `lengthWithin`; the guard that actually fires is the one
    // that fires FIRST, and losing a cast name is a worse thing than losing words. An attribution
    // that named the wrong guard would send the next reader to the wrong prompt.
    const { outcome } = applyEditList(
      original,
      { edits: [{ find: "Nora Quayle let a flicker of amusement cross her face, and said nothing at all about the ledger.", replace: "She waited.", addresses: [] }], cannot: [] },
      options,
    );
    expect(outcome.applied).toBe(0);
    expect(outcome.rolledBack.castNamesIntact).toBe(1);
  });

  it("an edit that guts the chapter and breaks nothing else is reverted on LENGTH", () => {
    const seaside = chapter([
      "The tide had gone out and the boats leaned over on the mud, their ropes slack across the stones.",
      "A man in a blue coat came down the steps with a bucket in each hand and set them on the wall.",
    ]);
    const { outcome } = applyEditList(
      seaside,
      {
        edits: [
          {
            find: "A man in a blue coat came down the steps with a bucket in each hand and set them on the wall.",
            replace: "A man came down the steps.",
            addresses: [],
          },
        ],
        cannot: [],
      },
      { ...options, lockedValues: [], castNames: [], scene: undefined },
    );
    expect(outcome.applied).toBe(0);
    expect(outcome.rolledBack.lengthWithin).toBe(1);
  });

  it("a `find` that is not unique is SKIPPED, not guessed at", () => {
    const repeated = chapter(["The door was shut. The door was shut again by morning, and nobody said so."]);
    const { outcome } = applyEditList(
      repeated,
      { edits: [{ find: "The door was shut", replace: "The door stood shut", addresses: [] }], cannot: [] },
      { ...options, lockedValues: [], scene: undefined },
    );
    expect(outcome.applied).toBe(0);
    expect(outcome.skipped).toBe(1);
  });

  it("one bad edit does not cost the good ones — each is applied alone", () => {
    const { chapter: out, outcome } = applyEditList(
      original,
      {
        edits: [
          { find: "at ten minutes past three", replace: "at three past midnight", addresses: [] },
          { find: "said nothing at all about the ledger", replace: "set the ledger down unopened", addresses: [] },
        ],
        cannot: [],
      },
      options,
    );
    expect(outcome.applied).toBe(1);
    expect(out.paragraphs[0]).toContain("ten minutes past three");
    expect(out.paragraphs[1]).toContain("set the ledger down unopened");
  });

  it("findings an edit did not address are reported as unresolved", () => {
    const findings: Finding[] = [
      { class: "register_sentence", chapter: 1, quote: "q", note: "", severity: "craft", source: "checker" },
      { class: "flat_reveal", chapter: 1, quote: "q", note: "", severity: "craft", source: "critic" },
    ];
    const { outcome } = applyEditList(
      original,
      { edits: [{ find: "said nothing at all about the ledger", replace: "set the ledger down unopened", addresses: [0] }], cannot: [] },
      { ...options, findings },
    );
    expect(outcome.unresolved.map((f) => f.class)).toEqual(["flat_reveal"]);
  });
});

describe("the editor's prompt and parser", () => {
  it("the prompt quotes the findings and states what the chapter owes", () => {
    const prompt = buildEditorPrompt({
      chapter: chapter(["A sentence that is long enough to matter here."]),
      chapterNumber: 1,
      findings: [{ class: "register_sentence", chapter: 1, quote: "A sentence that is long enough", note: "abstract", severity: "craft", source: "checker" }],
      scene: core.scenes[0]!,
    });
    expect(prompt).toContain("[register_sentence]");
    expect(prompt).toContain("the culprit is named in chapter 2, not here");
    expect(prompt).toContain('{"edits":');
  });

  it("parses an edit list and converts the finding indices to zero-based", () => {
    const list = parseEditList('{"edits":[{"find":"a b c","replace":"d e f","addresses":[1,2]}],"cannot":[{"finding":3,"why":"x"}]}');
    expect(list.edits).toHaveLength(1);
    expect(list.edits[0]!.addresses).toEqual([0, 1]);
    expect(list.cannot[0]!.finding).toBe(2);
  });

  it("an unreadable reply is an empty list", () => {
    for (const raw of ["", "no", "{", '{"edits":"not an array"}']) {
      expect(parseEditList(raw).edits).toEqual([]);
    }
  });

  it("the summary names what was applied, skipped and rolled back", () => {
    const line = summariseEdits([
      { applied: 3, skipped: 1, rolledBack: { clockValuesIntact: 2 }, unresolved: [] },
      { applied: 1, skipped: 0, rolledBack: { noNewScaffold: 1 }, unresolved: [] },
    ]);
    expect(line).toMatch(/applied 4/);
    expect(line).toMatch(/skipped 1/);
    expect(line).toMatch(/clockValuesIntact 2/);
  });
});

describe("17-hitting-90 P4.1 — the abstract subject", () => {
  const written: ProseChapterLike[] = [
    chapter([
      "The room held its breath as the clock struck the half hour and nobody moved.",
      "Norbury held the door for her and said nothing at all about the letter.",
      '"The room held its breath, you know," Bertram said, and laughed at his own line.',
      "The truth remained elusive, and the evidence continued to mount against the wrong man.",
    ]),
  ];
  const findings = collectCheckerFindings(written, core, [1]).filter((f) => f.class === "abstract_subject");

  it("KNOWN-POSITIVE: the room that held its breath and the truth that remained elusive", () => {
    expect(findings.map((f) => f.quote)).toEqual([
      "The room held its breath as the clock struck the half hour and nobody moved.",
      "The truth remained elusive, and the evidence continued to mount against the wrong man.",
    ]);
  });

  it("a person as subject, and a line of dialogue, are not findings", () => {
    expect(findings.some((f) => /Norbury held the door/.test(f.quote))).toBe(false);
    expect(findings.some((f) => /Bertram said/.test(f.quote))).toBe(false);
  });

  it("every one is anchored and classed as craft", () => {
    const { discarded } = anchorFindings(findings, new Map([[1, written[0]!]]));
    expect(discarded).toEqual([]);
    expect(findings.every((f) => f.severity === "craft")).toBe(true);
  });
});

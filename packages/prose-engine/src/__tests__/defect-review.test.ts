/**
 * THE SIX DEFECTS OF PLAN-TO-90 §23, EACH PINNED BY THE THING THAT FOUND IT.
 *
 * Every case below was measured against `resume-1789805865810` — the first v2 book that was a whole
 * book — before any of it was fixed. They are written as known-positives: the assertion fails on the
 * code as it stood, which is the only kind of regression test worth the line.
 */
import { describe, expect, it } from "vitest";

import { applyEditList } from "../edits.js";
import { buildContractCore } from "../contract.js";
import { indexChapters } from "../chapter-index.js";
import { namesAsCulprit } from "../culprit.js";
import { collectCheckerFindings, SEVERITY } from "../findings.js";
import { applyGate } from "../gate.js";
import { checkHardGates } from "../selector.js";
import type { ProseChapterLike } from "../types.js";

const ch = (number: number, ...paragraphs: string[]): ProseChapterLike => ({
  title: `Chapter ${number}`,
  number,
  paragraphs,
});

// ── §23.5 — a missing chapter used to misfile everything after it ────────────────────────────────

describe("§23.5 the chapter number travels with the prose", () => {
  const book = [ch(1, "One."), ch(2, "Two."), ch(4, "Four."), ch(5, "Five.")];

  it("KNOWN-POSITIVE: a gap does not shift the tail", () => {
    const index = indexChapters(book, [1, 2, 3, 4, 5]);
    expect(index.get(4)?.paragraphs).toEqual(["Four."]);
    expect(index.get(5)?.paragraphs).toEqual(["Five."]);
    expect(index.get(3)).toBeUndefined(); // it is MISSING, not silently filled by chapter 4
  });

  it("prose with no numbers still maps by position, for artifacts written before the field", () => {
    const legacy = [{ title: "a", paragraphs: ["One."] }, { title: "b", paragraphs: ["Two."] }];
    const index = indexChapters(legacy, [1, 2]);
    expect(index.get(1)?.paragraphs).toEqual(["One."]);
    expect(index.get(2)?.paragraphs).toEqual(["Two."]);
  });

  it("a half-numbered book falls back rather than guessing a mixture", () => {
    const mixed = [ch(1, "One."), { title: "b", paragraphs: ["Two."] }];
    expect(indexChapters(mixed, [1, 2]).get(2)?.paragraphs).toEqual(["Two."]);
  });
});

// ── §23.4 — an edit that changes nothing was counted as applied ──────────────────────────────────

describe("§23.4 an edit that changes nothing is not an edit", () => {
  const chapter: ProseChapterLike = {
    title: "t",
    number: 1,
    paragraphs: [
      "Bertram crossed the office and opened the window on the cold morning air.",
      "Nora watched him do it and said nothing at all about the ledger.",
    ],
  };
  const findings = [{ class: "register_sentence", chapter: 1, quote: "q", note: "n", severity: "craft", source: "checker" } as never];

  it("KNOWN-POSITIVE: a `find` spanning a paragraph break is skipped, not applied", () => {
    const before = JSON.stringify(chapter.paragraphs);
    const { chapter: after, outcome } = applyEditList(
      chapter,
      { edits: [{ find: "cold morning air.\n\nNora watched him", replace: "cold air.\n\nNora saw him", addresses: [0] }], cannot: [] },
      { lockedValues: [], castNames: ["Nora"], findings },
    );
    expect(outcome.applied).toBe(0);
    expect(outcome.skipped).toBe(1);
    expect(JSON.stringify(after.paragraphs)).toBe(before);
    expect(outcome.unresolved).toHaveLength(1); // and the finding is NOT reported resolved
  });

  it("KNOWN-POSITIVE: an edit whose replace equals its find is skipped", () => {
    const { outcome } = applyEditList(
      chapter,
      { edits: [{ find: "opened the window", replace: "opened the window", addresses: [0] }], cannot: [] },
      { lockedValues: [], castNames: ["Nora"], findings },
    );
    expect(outcome.applied).toBe(0);
    expect(outcome.unresolved).toHaveLength(1);
  });

  it("a real edit inside one paragraph still applies and resolves its finding", () => {
    const { chapter: after, outcome } = applyEditList(
      chapter,
      // 0-based here: `parseEditList` is what converts the model's 1-based indices.
      { edits: [{ find: "opened the window", replace: "pushed the window wide", addresses: [0] }], cannot: [] },
      { lockedValues: [], castNames: ["Nora"], findings },
    );
    expect(outcome.applied).toBe(1);
    expect(after.paragraphs[0]).toContain("pushed the window wide");
    expect(outcome.unresolved).toHaveLength(0);
  });

  it("§23.6 the editor's reason for declining reaches the outcome", () => {
    const { outcome } = applyEditList(
      chapter,
      { edits: [], cannot: [{ finding: 0, why: "the chapter owes this clue" }] },
      { lockedValues: [], castNames: [], findings },
    );
    expect(outcome.declined).toEqual([{ finding: 0, why: "the chapter owes this clue" }]);
  });
});

// ── the contract fixture the checker tests run against ───────────────────────────────────────────

const core = buildContractCore({
  cml: {
    CASE: {
      culpability: { culprits: ["Nora Quayle"] },
      cast: [
        { name: "Nora Quayle", role_archetype: "suspect" },
        { name: "Bertram Norbury", role_archetype: "detective" },
        { name: "Montague Gaunt", role_archetype: "victim" },
      ],
      hidden_model: { mechanism: { description: "a compass held at a habitual tilt" } },
      prose_requirements: { clue_to_scene_mapping: [] },
    },
  },
  clues: {
    clues: [
      {
        id: "clue_compass_tilt",
        observable: "the scuffed brass casing of the compass, worn along one edge",
        description: "the compass casing is worn where a thumb has tilted it",
        criticality: "essential",
      },
    ],
  },
  outline: {
    acts: [
      {
        scenes: [
          { sceneNumber: 1, act: 1, beat: "gathering", title: "Arrival", characters: ["Bertram Norbury"], setting: { location: "the office" }, cluesRevealed: ["clue_compass_tilt"] },
          { sceneNumber: 2, act: 2, beat: "final_trap", title: "The Test", characters: ["Bertram Norbury"], setting: { location: "the dunes" } },
          { sceneNumber: 3, act: 3, beat: "revelation", title: "After", characters: ["Bertram Norbury"], setting: { location: "the promenade" } },
        ],
      },
    ],
  },
  cast: { characters: [{ name: "Nora Quayle" }, { name: "Bertram Norbury" }, { name: "Montague Gaunt", role_archetype: "victim" }] },
  humourLevel: "classic",
});

// ── §23.3 — CASE under /i flagged the commonest noun in the genre ────────────────────────────────

describe("§23.3 a scaffold token is ours, not an English word", () => {
  const scaffoldHits = (text: string) =>
    checkHardGates([ch(1, text), ch(2, "x"), ch(3, "x")], core, [1, 2, 3]).filter((h) => h.kind === "scaffold");

  it("KNOWN-NEGATIVE: a cigarette case is not generator scaffolding", () => {
    // resume-1789805865810, chapter 5, verbatim.
    expect(scaffoldHits("She retrieved her cigarette case, fingers tapping out a rhythm on the lid.")).toEqual([]);
  });

  it("KNOWN-NEGATIVE: the ordinary words of a detective novel", () => {
    for (const text of [
      "The case was closed, and the promenade had never looked emptier.",
      "In any case, the ledger said otherwise.",
      "He carried the case up the stairs himself.",
    ]) {
      expect(scaffoldHits(text), text).toEqual([]);
    }
  });

  it("KNOWN-POSITIVE: the markers and the jargon still fire", () => {
    for (const text of [
      "The CASE block says otherwise.",
      "clue_compass_tilt was visible from the door.",
      "The discriminating test proved it.",
      "Written per prose_requirements, of course.",
    ]) {
      expect(scaffoldHits(text).length, text).toBeGreaterThan(0);
    }
  });
});

// ── §23.1 — the clock check read half the table and no punctuation ───────────────────────────────

describe("§23.1 the clock check reads the whole table", () => {
  const clockFindings = (text: string, rows: Array<{ value: string; label: string }>) => {
    const withRows = { ...core, chronology: { rows: rows.map((r) => ({ kind: "instant" as const, ...r })), unplaced: [] } };
    return collectCheckerFindings([ch(1, text), ch(2, "x"), ch(3, "x")], withRows, [1, 2, 3]).filter(
      (f) => f.class === "clock_off_table",
    );
  };

  it("KNOWN-POSITIVE: a typographic apostrophe is the same time as a straight one", () => {
    // The table holds "nine o'clock"; the prose writes "nine o’clock". Five of eleven findings on
    // the real book were this and nothing else.
    const hits = clockFindings("The judge died at nine o’clock, or so the ledger claimed.", [
      { value: "nine o'clock", label: "apparent time of death" },
    ]);
    expect(hits, JSON.stringify(hits.map((h) => h.note))).toEqual([]);
  });

  it("KNOWN-POSITIVE: a time that appears only in a row's LABEL is on the table", () => {
    const hits = clockFindings("Harriet was cleaning rooms from eight fifty onward.", [
      { value: "ten minutes to nine", label: "eight fifty to nine fifteen - Harriet cleaning rooms" },
    ]);
    expect(hits, JSON.stringify(hits.map((h) => h.note))).toEqual([]);
  });

  it("a time on no row anywhere is still reported", () => {
    const hits = clockFindings("The bell rang at half past four, which nobody expected.", [
      { value: "nine o'clock", label: "apparent time of death" },
    ]);
    expect(hits.length).toBeGreaterThan(0);
  });

  it("§23.1 D2: the class is REPORT-ONLY, because its repair is one the guards revert", () => {
    expect(SEVERITY.clock_off_table).toBe("report");
  });
});

// ── the predicate that had two bodies ────────────────────────────────────────────────────────────

describe("naming the culprit has ONE definition", () => {
  it("the gate and the early-naming check agree, because they call the same function", () => {
    const text = "Nora Quayle engineered the murder, and the ledger had said so for two days.";
    expect(namesAsCulprit(text, "Nora Quayle")).toBe(true);
    const hits = checkHardGates([ch(1, text), ch(2, "x"), ch(3, "x")], core, [1, 2, 3]);
    expect(hits.some((h) => h.kind === "culprit_early")).toBe(true);
  });

  it("KNOWN-NEGATIVE: an unattributed confession names nobody, so it accuses nobody", () => {
    // The selector's copy carried a bare `\\bI killed\\b` with no name in it, so ANY first-person
    // admission — a red herring's false confession — tripped culprit_early for EVERY culprit.
    const text = '"I killed him," said Harriet, who had killed nobody at all that week.';
    expect(namesAsCulprit(text, "Nora Quayle")).toBe(false);
    const hits = checkHardGates([ch(1, text), ch(2, "x"), ch(3, "x")], core, [1, 2, 3]);
    expect(hits.some((h) => h.kind === "culprit_early")).toBe(false);
  });

  it("and the reveal gate uses the same definition", () => {
    const reveal = core.roles.reveal;
    const chapters = [1, 2, 3].map((n) =>
      ch(n, n === reveal ? "Nora Quayle engineered the murder and doctored the records." : "The promenade was swept."),
    );
    const verdict = applyGate({ chapters, core, expected: [1, 2, 3], findings: [], deterministicWrites: 0 });
    expect(verdict.stops.filter((s) => /never names/.test(s))).toEqual([]);
  });
});

// ── §23.2 — obligations no prose could satisfy ───────────────────────────────────────────────────

describe("§23.2 an obligation the clues artifact cannot explain is a CONTRACT defect", () => {
  const withOrphans = buildContractCore({
    cml: {
      CASE: {
        culpability: { culprits: ["Nora Quayle"] },
        cast: [{ name: "Nora Quayle", role_archetype: "suspect" }, { name: "Bertram Norbury", role_archetype: "detective" }],
        hidden_model: { mechanism: { description: "a compass tilt" } },
        prose_requirements: { clue_to_scene_mapping: [] },
      },
    },
    clues: { clues: [{ id: "clue_compass_tilt", observable: "the scuffed brass casing", description: "worn edge", criticality: "essential" }] },
    outline: {
      acts: [
        {
          scenes: [
            { sceneNumber: 1, act: 1, beat: "gathering", title: "A", characters: [], setting: { location: "x" }, cluesRevealed: ["clue_compass_tilt", "time_of_death", "compass_casing_wear"] },
            { sceneNumber: 2, act: 2, beat: "final_trap", title: "B", characters: [], setting: { location: "y" } },
            { sceneNumber: 3, act: 3, beat: "revelation", title: "C", characters: [], setting: { location: "z" } },
          ],
        },
      ],
    },
    cast: { characters: [{ name: "Nora Quayle" }, { name: "Bertram Norbury" }] },
    humourLevel: "classic",
  });

  it("KNOWN-POSITIVE: an id the clues artifact does not hold is not required of any chapter", () => {
    const ids = withOrphans.scenes.flatMap((s) => s.mustSurface.map((m) => m.id));
    expect(ids).not.toContain("time_of_death");
    expect(ids).not.toContain("compass_casing_wear");
  });

  it("every surviving obligation can actually be looked for", () => {
    for (const scene of withOrphans.scenes) {
      for (const surface of scene.mustSurface) {
        expect(surface.keyTerms.length, `${surface.id} has no key terms`).toBeGreaterThan(0);
      }
    }
  });

  it("and it is reported as a note, so the defect is not silent", () => {
    const note = withOrphans.notes.find((n) => /in no clues artifact/.test(n));
    expect(note).toBeDefined();
    expect(note).toContain("time_of_death");
    expect(note).toContain("compass_casing_wear");
  });
});

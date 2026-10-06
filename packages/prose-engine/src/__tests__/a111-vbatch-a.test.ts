/**
 * A_111 V batch, group A — the editor's guards under PROSE_V2_AUDIT_FIXES (WF-005 V2K-01, -04, -07, -09).
 *   V-12  registerNotWorse counts register HITS, not the rate.
 *   V-13  the value guards compare SETS (distinct clock dials, locked values, cast names).
 *   V-14  each never-fall guard is held on its own, not inside a sum.
 *   V-16b noOrphanedTag lets a tag keep its speech; noNewScaffold counts identifiers, not English words.
 * Each fix: a known positive with the flag OFF (the defect fires), the same edit ON, and what must still revert ON.
 * Every chapter is built from text; nothing reads the archive.
 */
import { afterEach, describe, expect, it } from "vitest";

import { applyEditList, buildGuards, measureGuards, orphanedTags } from "../edits.js";
import type { EditList, ProseChapterLike, SceneContract } from "../types.js";

const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});
const on = (): void => {
  process.env.PROSE_V2_AUDIT_FIXES = "1";
};
const off = (): void => {
  delete process.env.PROSE_V2_AUDIT_FIXES;
};

// Concrete narration (register score under 3), enough of it that a one-sentence cut stays inside the 15% tolerance.
const FILL =
  "The tide came in over the flats and the boats lay on their sides in the mud. The smoke from the chimneys lay low over the roofs. A dog barked twice down by the harbour wall.";
// Scores 4 against REGISTER_TELEMETRY_THRESHOLD (3): one machine-register sentence.
const REGISTER = "The significance of the situation was considerable and the implications were profound.";

const chapterOf = (...paragraphs: string[]): ProseChapterLike => ({ title: "One", paragraphs });
const one = (find: string, replace: string): EditList => ({ edits: [{ find, replace, addresses: [0] }], cannot: [] });
const base = { lockedValues: [] as string[], castNames: [] as string[], findings: [] };

describe("V-12 — registerNotWorse counts register sentences, not a rate", () => {
  const chapter = chapterOf(FILL, FILL, `${REGISTER} A cart went by on the cobbles.`, FILL);
  const cut = one(" A cart went by on the cobbles.", "");

  it("the known positive: cutting a concrete sentence raises the RATE and leaves the hit count", () => {
    off();
    const after = chapterOf(FILL, FILL, REGISTER, FILL);
    expect(measureGuards(after, base).registerNotWorse).toBeLessThan(measureGuards(chapter, base).registerNotWorse);
    on();
    expect(measureGuards(after, base).registerNotWorse).toBe(measureGuards(chapter, base).registerNotWorse);
    expect(measureGuards(chapter, base).registerNotWorse).toBe(-1);
  });

  it("OFF: the cut is reverted by registerNotWorse; ON: it lands", () => {
    off();
    const offRun = applyEditList(chapter, cut, base);
    expect(offRun.outcome.applied).toBe(0);
    expect(offRun.outcome.rolledBack.registerNotWorse).toBe(1);
    on();
    const onRun = applyEditList(chapter, cut, base);
    expect(onRun.outcome.applied).toBe(1);
    expect(onRun.chapter.paragraphs[2]).toBe(REGISTER);
  });

  it("ON: an edit that WRITES a register sentence is still reverted", () => {
    on();
    const rewrite = one("A cart went by on the cobbles.", "The relevance of the circumstances was considerable and the consequences were significant.");
    const run = applyEditList(chapter, rewrite, base);
    expect(run.outcome.applied).toBe(0);
    expect(run.outcome.rolledBack.registerNotWorse).toBe(1);
  });

  it("with PROSE_V2_TAIL_FINDING also ON the guard is the hit count: a deletion that leaves a register sentence falls", () => {
    // P-2's shape: a concrete tail keeps an abstract head under the threshold; cutting it makes a register sentence.
    const tail = ", her gaze fixed on the cold grey ledger by the lamp";
    const p2 = chapterOf(FILL, FILL, FILL, `Ada sat down. The significance of the situation was considerable and the implications were profound${tail}.`);
    const cutTail = one(`profound${tail}.`, "profound.");
    process.env.PROSE_V2_TAIL_FINDING = "1";
    off();
    expect(applyEditList(p2, cutTail, base).outcome.applied).toBe(1); // P-2 alone exempts it
    on();
    const both = applyEditList(p2, cutTail, base);
    expect(both.outcome.applied).toBe(0);
    expect(both.outcome.rolledBack.registerNotWorse).toBe(1);
    // ...and a deletion that leaves no register sentence behind lands.
    expect(applyEditList(chapter, cut, base).outcome.applied).toBe(1);
  });
});

describe("V-13 — the value guards compare sets", () => {
  const options = { ...base, castNames: ["Ada Vane", "Tom Bell"], lockedValues: ["fourteen feet"] };
  const opening = "The clock in the hall struck half past nine as Ada Vane came down the stairs to the porch.";
  const ladder = "Tom Bell said the rope from the boathouse was fourteen feet and no more.";
  const restated = "It had been half past nine when Tom Bell went out, and the rope was fourteen feet.";
  const chapter = chapterOf(opening, FILL, ladder, FILL, `${restated} Ada Vane lit the lamp.`, FILL);

  it("OFF: deleting a RESTATED time, name and locked value is reverted (the known positive)", () => {
    off();
    const run = applyEditList(chapter, one(`${restated} `, ""), options);
    expect(run.outcome.applied).toBe(0);
    expect(run.outcome.rolledBack.lockedValuesIntact).toBe(1);
  });

  it("ON: the same deletion lands — every distinct time, name and locked value is still on the page", () => {
    on();
    const before = measureGuards(chapter, options);
    expect(before.clockValuesIntact).toBe(1);
    expect(before.castNamesIntact).toBe(2);
    expect(before.lockedValuesIntact).toBe(1);
    const run = applyEditList(chapter, one(`${restated} `, ""), options);
    expect(run.outcome.applied).toBe(1);
    expect(run.chapter.paragraphs[4]).toBe("Ada Vane lit the lamp.");
  });

  it("OFF vs ON, one guard at a time: a restated clock time alone", () => {
    const clock = chapterOf(opening, FILL, "Ada Vane looked at the clock again; it had been half past nine.", FILL, FILL);
    const cut = one(" it had been half past nine.", " the hands had not moved.");
    off();
    expect(applyEditList(clock, cut, options).outcome.rolledBack.clockValuesIntact).toBe(1);
    on();
    expect(applyEditList(clock, cut, options).outcome.applied).toBe(1);
  });

  it("ON: a time that VANISHES still reverts", () => {
    on();
    const two = chapterOf(opening, FILL, "Tom Bell heard the church strike ten o'clock across the water.", FILL, FILL);
    const run = applyEditList(two, one("strike ten o'clock across the water", "strike across the water"), options);
    expect(run.outcome.applied).toBe(0);
    expect(run.outcome.rolledBack.clockValuesIntact).toBe(1);
  });

  it("ON: a NEW distinct time still reverts, by the whole-chapter dial set", () => {
    on();
    const run = applyEditList(chapter, one("It had been half past nine when", "It had been a quarter to ten when"), options);
    expect(run.outcome.applied).toBe(0);
    expect(run.outcome.rolledBack.clockValuesIntact).toBe(1);
  });

  it("ON: a cast name that leaves the chapter still reverts", () => {
    on();
    const only = chapterOf(opening, FILL, "Tom Bell walked up from the boathouse with the rope over his shoulder.", FILL, FILL);
    const run = applyEditList(only, one("Tom Bell walked up", "A man walked up"), options);
    expect(run.outcome.applied).toBe(0);
    expect(run.outcome.rolledBack.castNamesIntact).toBe(1);
  });

  it("ON: a mis-cased name reverts although the name stands elsewhere (A_89 C1, 'Nora gaunt')", () => {
    on();
    const run = applyEditList(chapter, one("Ada Vane lit the lamp.", "Ada vane lit the lamp."), options);
    expect(run.outcome.applied).toBe(0);
    expect(run.outcome.rolledBack.castNamesIntact).toBe(1);
  });

  it("ON: a locked value that leaves the chapter still reverts", () => {
    on();
    const once = chapterOf(opening, FILL, "Tom Bell said the rope from the boathouse was fourteen feet and no more.", FILL, FILL);
    const run = applyEditList(once, one(" was fourteen feet and no more.", " was long enough."), options);
    expect(run.outcome.applied).toBe(0);
    expect(run.outcome.rolledBack.lockedValuesIntact).toBe(1);
  });
});

describe("V-14 — a never-fall guard may not be paid for by another guard's rise", () => {
  // The arm A′ shape: an edit that cuts a register sentence carrying the clue's key term. Register rises, the clue falls.
  const scene = { chapter: 1, present: [], location: "", mustSurface: [{ id: "clue_a", keyTerms: ["significance"] }] } as unknown as SceneContract;
  const options = { ...base, scene };
  const chapter = chapterOf(FILL, FILL, `${REGISTER} A cart went by on the cobbles.`, FILL);
  const cut = one(`${REGISTER} `, "");

  it("OFF: the edit lands with the clue's key term gone (the defect)", () => {
    off();
    const before = measureGuards(chapter, options);
    const run = applyEditList(chapter, cut, options);
    expect(run.outcome.applied).toBe(1);
    expect(measureGuards(run.chapter, options).clueCoverageNotWorse).toBeLessThan(before.clueCoverageNotWorse);
  });

  it("ON: the summed validator still passes it (register +1, clue −1) — and the editor reverts it as clueCoverageNotWorse", () => {
    on();
    const { validator } = buildGuards(options);
    const after = chapterOf(FILL, FILL, "A cart went by on the cobbles.", FILL);
    expect(validator(after).score).toBe(validator(chapter).score);
    const run = applyEditList(chapter, cut, options);
    expect(run.outcome.applied).toBe(0);
    expect(run.outcome.rolledBack.clueCoverageNotWorse).toBe(1);
    expect(run.chapter).toBe(chapter);
  });
});

describe("V-16b — noOrphanedTag lets a tag keep its speech", () => {
  it("counts the same paragraphs OFF; ON, not a tag whose speech follows it", () => {
    const withSpeech = [
      'Ada Vane asked, "Did you see him near the harbour?"',
      "Ada Vane said, quietly, ‘Come in.’",
      'Ada Vane continued, her tone even. "Somebody crossed the yard."',
      'She said. "Come in."',
    ];
    off();
    for (const p of withSpeech) expect(orphanedTags(p)).toBe(1);
    on();
    for (const p of withSpeech) expect(orphanedTags(p)).toBe(0);
  });

  it("ON: the bare tag still counts (the shape run bcc0d637 shipped), apostrophes are not speech", () => {
    on();
    expect(orphanedTags("Ada Vane asked, her voice level as she set the log on the table. She pressed her palm flat against it.")).toBe(1);
    expect(orphanedTags("Ada Vane asked, her brother's voice low behind her.")).toBe(1);
    expect(orphanedTags("Ada Vane said. She put the cup down.")).toBe(1);
  });

  const chapter = chapterOf('"Did you see him near the harbour?" Ada Vane asked.', "Tom Bell shook his head and looked at the window.", FILL, FILL, FILL);
  const options = { ...base, castNames: ["Ada Vane", "Tom Bell"] };

  it("with PROSE_V2_CONTRACT_FIXES: moving the tag before its speech is reverted OFF, lands ON", () => {
    process.env.PROSE_V2_CONTRACT_FIXES = "1";
    const move = one('"Did you see him near the harbour?" Ada Vane asked.', 'Ada Vane asked, "Did you see him near the harbour?"');
    off();
    const offRun = applyEditList(chapter, move, options);
    expect(offRun.outcome.applied).toBe(0);
    expect(offRun.outcome.rolledBack.noOrphanedTag).toBe(1);
    on();
    expect(applyEditList(chapter, move, options).outcome.applied).toBe(1);
  });

  it("with PROSE_V2_CONTRACT_FIXES, ON: cutting the speech and keeping the tag still reverts (A_110 N5)", () => {
    process.env.PROSE_V2_CONTRACT_FIXES = "1";
    on();
    const run = applyEditList(chapter, one('"Did you see him near the harbour?" Ada Vane asked.', "Ada Vane asked, her voice level."), options);
    expect(run.outcome.applied).toBe(0);
    expect(run.outcome.rolledBack.noOrphanedTag).toBe(1);
  });
});

describe("V-16b — noNewScaffold counts identifiers, not English words", () => {
  const chapter = chapterOf(FILL, "Tom Bell shook his head and looked at the window.", FILL, FILL);
  const english = one("looked at the window.", "looked at the window. The room seemed to contract.");

  it("OFF: the English word 'contract' is reverted as scaffold (the known positive); ON it lands", () => {
    off();
    const offRun = applyEditList(chapter, english, base);
    expect(offRun.outcome.applied).toBe(0);
    expect(offRun.outcome.rolledBack.noNewScaffold).toBe(1);
    on();
    expect(applyEditList(chapter, english, base).outcome.applied).toBe(1);
  });

  it("ON: an identifier is still reverted", () => {
    on();
    for (const token of ["clue_3", "act_2", "scene4", "hidden_model", "locked_fact"]) {
      const run = applyEditList(chapter, one("looked at the window.", `looked at the window by ${token}.`), base);
      expect(run.outcome.rolledBack.noNewScaffold).toBe(1);
    }
  });
});

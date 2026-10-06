/**
 * A_111 P-2..P-4 — the repairs the 2026-10-06 pair on run bcc0d637 asked for, each pinned on its own shape.
 *   P-2 a strict deletion is not measured by registerNotWorse (PROSE_V2_TAIL_FINDING); every other guard still is.
 *   P-3 the newcomers get one operation and their facts, never a sentence to paste (PROSE_V2_OPENING).
 *   P-4 the opening says when it is, from the case's own date (PROSE_V2_OPENING).
 */
import { afterEach, describe, expect, it } from "vitest";

import { applyEditList, isStrictDeletion, measureGuards } from "../edits.js";
import { openingLines } from "../opening.js";
import { dateOf } from "../bible.js";
import type { ContractInput, EditList } from "../types.js";

const saved = { ...process.env };
afterEach(() => {
  process.env = { ...saved };
});

describe("P-2 — isStrictDeletion", () => {
  it("is true when replace is find with one span removed", () => {
    expect(isStrictDeletion("She sat down, her fingers steady on the desk.", "She sat down.")).toBe(true);
    expect(isStrictDeletion("He waited, his eyes on the door, and said nothing.", "He waited and said nothing.")).toBe(true);
  });
  it("is false for a rephrase, an insertion or an identity", () => {
    expect(isStrictDeletion("She sat down, her fingers steady.", "She sat, steady.")).toBe(false);
    expect(isStrictDeletion("She sat down.", "She sat down at once.")).toBe(false);
    expect(isStrictDeletion("She sat down.", "She sat down.")).toBe(false);
  });
});

describe("P-2 — the register guard does not measure a deletion", () => {
  // The arm-B shape: an abstract head that a concrete body-part tail kept under the register threshold (3). Cut the tail
  // and the sentence scores 4 — the chapter's rate rises although no word was written. Built from text, so the test
  // needs no archive; the fill keeps the cut inside the 15% length tolerance.
  const fill = "The tide came in over the flats and the boats lay on their sides in the mud. A cart went by on the cobbles. The smoke from the chimneys lay low over the roofs. Somebody was whistling in the yard behind the inn.";
  const tail = ", her gaze fixed on the cold grey ledger by the lamp";
  const chapter = {
    title: "One",
    paragraphs: [fill, fill, fill, `Ada sat down. The significance of the situation was considerable and the implications were profound${tail}.`],
  };
  const edit: EditList = { edits: [{ find: `profound${tail}.`, replace: "profound.", addresses: [0] }], cannot: [] };
  const options = { lockedValues: [], castNames: ["Ada"], findings: [] };

  it("is a register fall at all (the known positive for this fixture)", () => {
    const before = measureGuards(chapter, options).registerNotWorse;
    const cut = { ...chapter, paragraphs: [fill, fill, fill, "Ada sat down. The significance of the situation was considerable and the implications were profound."] };
    expect(measureGuards(cut, options).registerNotWorse).toBeLessThan(before);
  });

  it("OFF: registerNotWorse reverts the deletion; ON: it applies", () => {
    delete process.env.PROSE_V2_TAIL_FINDING;
    const off = applyEditList(chapter, edit, options);
    expect(off.outcome.applied).toBe(0);
    expect(off.outcome.rolledBack.registerNotWorse).toBe(1);

    process.env.PROSE_V2_TAIL_FINDING = "1";
    const on = applyEditList(chapter, edit, options);
    expect(on.outcome.applied).toBe(1);
    expect(on.chapter.paragraphs[3]).toBe("Ada sat down. The significance of the situation was considerable and the implications were profound.");
  });

  it("ON: a deletion still answers to every other guard (a cast name cut is reverted)", () => {
    process.env.PROSE_V2_TAIL_FINDING = "1";
    const cutName: EditList = { edits: [{ find: "Ada sat down. ", replace: "", addresses: [0] }], cannot: [] };
    const out = applyEditList(chapter, cutName, options);
    expect(out.outcome.applied).toBe(0);
    expect(out.outcome.rolledBack.castNamesIntact).toBe(1);
  });
});

describe("P-3 — newcomers: one operation, then the facts", () => {
  it("renders one count and one fact line per person, with no appositive sentence", () => {
    const lines = openingLines({
      introductions: [
        { name: "Ada Vane", occupation: "family lawyer", relation: "his niece", pronoun: "she is" },
        { name: "Tom Bell", occupation: "harbour master", pronoun: "he is", whyHere: "the storm closed the road" },
      ],
    });
    expect(lines[0]).toMatch(/^2 people are on the page for the first time here\. .*at most one introduction to a paragraph/);
    expect(lines).toContain("  Ada Vane: family lawyer; his niece");
    expect(lines).toContain("  Tom Bell: harbour master");
    expect(lines).toContain("    why here: the storm closed the road");
    expect(lines.join("\n")).not.toMatch(/a clause beside the name/);
  });
});

describe("P-4 — the opening says when", () => {
  it("asks for the month and year when the case has them", () => {
    const lines = openingLines({ establishing: { looks: "A grey stone building.", when: "January 1934" } });
    expect(lines[0]).toContain("One of those two paragraphs says when it is: January 1934. The first line anybody speaks");
  });
  it("asks nothing when there is no date", () => {
    expect(openingLines({ establishing: { looks: "A grey stone building." } })[0]).not.toContain("says when it is");
  });
  it("dateOf reads the temporal context, and falls back to the setting's decade", () => {
    const input = { temporal: { specificDate: { month: "March", year: 1936 } }, setting: { setting: { era: { decade: "1930s" } } } } as unknown as ContractInput;
    expect(dateOf(input)).toEqual({ month: "March", year: "1936", season: "" });
    const noDate = { setting: { setting: { era: { decade: "1930s" } } } } as unknown as ContractInput;
    expect(dateOf(noDate).year).toBe("1930s");
  });
});

/**
 * IDEA 1 — STRUCTURED AT BIRTH. The number is the fact; the words are rendered from it.
 *
 * WHAT THIS REPLACES. Today a locked time is prose, and five consumers try to recover numbers from
 * it. Every temporal defect measured on run mystery-1788457673117 is a failure of that recovery:
 * a parser that drops the daypart, an atomicity test that refuses the qualifier, a reconciler that
 * cannot read the derivation's direction, and a coherence check switched off by a fact count.
 *
 * THE PROPERTY THAT MATTERS MOST is the last describe block. This morning's shipped bug was the
 * canonical value and its forbidden-alternatives list drifting apart: `getForbiddenTimeForms`
 * generated "quarter past nine" from a canonical string while ANOTHER fact's locked value was
 * "a quarter past nine"; the cross-fact filter compared them as strings, a leading article defeated
 * it, and 16 of that check's 18 warnings told the case it contradicted itself. Two bodies computing
 * one concept. Here both come out of one function over one number, and collision is integer
 * equality with no wording in it at all.
 */

import { describe, expect, it } from "vitest";

import {
  alternativeRenderings,
  isValidStructuredTime,
  renderStructuredTime,
  structuredAbsolute,
  structuredTimesCollide,
  toStructuredTime,
  type StructuredTime,
} from "../temporal-spine.js";

/** The real 76/100 fact, as the case SHOULD have declared it. */
const CALL_SHEET_DATE: StructuredTime = { dayOffset: -1, hour: 17, minute: 45, qualifier: "on the evening prior" };

describe("renderStructuredTime — one legal string, derived from the number", () => {
  it("renders the real fact exactly as the case wrote it", () => {
    expect(renderStructuredTime(CALL_SHEET_DATE)).toBe("a quarter to six on the evening prior");
  });

  it("supplies a daypart when the case gives no qualifier, because a bare 12-hour phrase is ambiguous", () => {
    expect(renderStructuredTime({ dayOffset: 0, hour: 17, minute: 45 })).toBe("a quarter to six in the evening");
    expect(renderStructuredTime({ dayOffset: 0, hour: 5, minute: 45 })).toBe("a quarter to six in the morning");
  });

  it("does not stack two dayparts when the case supplied its own", () => {
    // "a quarter to six in the evening on the evening prior" is machine text.
    expect(renderStructuredTime(CALL_SHEET_DATE)).not.toContain("in the evening on");
  });

  it("day offset is arithmetic, not decoration", () => {
    expect(structuredAbsolute(CALL_SHEET_DATE)).toBe(-1440 + 17 * 60 + 45);
    expect(structuredAbsolute({ dayOffset: 0, hour: 17, minute: 45 })).toBe(17 * 60 + 45);
  });

  it("validates range, so an impossible declaration is a case defect rather than a rendering one", () => {
    expect(isValidStructuredTime(CALL_SHEET_DATE)).toBe(true);
    expect(isValidStructuredTime({ dayOffset: 0, hour: 24, minute: 0 })).toBe(false);
    expect(isValidStructuredTime({ dayOffset: 0, hour: 9, minute: 60 })).toBe(false);
    expect(isValidStructuredTime({ dayOffset: 0, hour: 9.5, minute: 0 })).toBe(false);
    expect(isValidStructuredTime(null)).toBe(false);
    expect(isValidStructuredTime("nine o'clock")).toBe(false);
  });
});

describe("alternativeRenderings — the forbidden list, from the same number as the value", () => {
  it("lists the other ways to say the same time", () => {
    const forms = alternativeRenderings({ dayOffset: 0, hour: 9, minute: 15 });
    expect(forms).toContain("9:15");
    expect(forms).toContain("09:15");
    expect(forms).toContain("nine fifteen");
  });

  it("NEVER contains the value's own rendering — the property the shipped bug violated", () => {
    // Exhaustive: if the canonical string can appear in its own forbidden list for ANY time, the
    // check built on it will accuse a case of contradicting itself, which is what happened.
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 1, 5, 15, 20, 29, 30, 31, 40, 45, 55, 59]) {
        const t: StructuredTime = { dayOffset: 0, hour, minute };
        const canonical = renderStructuredTime(t);
        const forms = alternativeRenderings(t);
        expect(forms, `${hour}:${minute} forbids its own value "${canonical}"`).not.toContain(canonical);
      }
    }
  });

  it("does NOT forbid a phrase differing from the value only by an article or a daypart", () => {
    // Caught by these tests: the first version compared exact strings, so with a canonical of
    // "a quarter to ten in the morning" it kept "quarter to ten" forbidden — a phrase one article
    // away from the locked value. That is the same article-sensitivity that produced 18 warnings
    // this morning, reappearing inside the fix for it. An article is not a different time.
    const forms = alternativeRenderings({ dayOffset: 0, hour: 9, minute: 45 });
    expect(forms).not.toContain("quarter to ten");
    expect(forms).not.toContain("a quarter to ten");
    expect(forms).toContain("9:45");
  });

  it("no forbidden form is an article/daypart variant of the value, for ANY time", () => {
    const strip = (x: string) =>
      x.toLowerCase().replace(/^(?:a|an|the)\s+/, "")
        .replace(/\s+(?:in the (?:morning|afternoon|evening|small hours)|at night)$/, "").trim();
    for (let hour = 0; hour < 24; hour++) {
      for (const minute of [0, 5, 15, 30, 45, 50]) {
        const t: StructuredTime = { dayOffset: 0, hour, minute };
        const canonical = strip(renderStructuredTime(t));
        for (const f of alternativeRenderings(t)) {
          expect(strip(f), `${hour}:${minute} forbids a variant of its own value`).not.toBe(canonical);
        }
      }
    }
  });
});

describe("structuredTimesCollide — integers, which have no articles", () => {
  it("detects two facts pinning the same instant however each is worded", () => {
    const a: StructuredTime = { dayOffset: 0, hour: 9, minute: 15, qualifier: "on the murder day" };
    const b: StructuredTime = { dayOffset: 0, hour: 9, minute: 15 };
    expect(renderStructuredTime(a)).not.toBe(renderStructuredTime(b)); // different strings…
    expect(structuredTimesCollide(a, b)).toBe(true); // …same instant
  });

  it("does not collide across a day boundary, which the string comparison could never see", () => {
    expect(
      structuredTimesCollide({ dayOffset: 0, hour: 17, minute: 45 }, { dayOffset: -1, hour: 17, minute: 45 }),
    ).toBe(false);
  });
});

describe("toStructuredTime — upgrade prose that has already been written", () => {
  it("lifts a fully-qualified prose value into the structured form", () => {
    expect(toStructuredTime("a quarter to six on the evening prior")).toMatchObject({
      dayOffset: -1,
      hour: 17,
      minute: 45,
    });
  });

  it("REFUSES rather than guessing when the prose fixes no half of the day", () => {
    // "twenty minutes past three" is 03:20 or 15:20. Inventing one here would reintroduce exactly
    // the silent 12-hour guess this whole module exists to remove.
    expect(toStructuredTime("twenty minutes past three on the murder day")).toBeNull();
    expect(toStructuredTime("thirty-four inches")).toBeNull();
    expect(toStructuredTime("")).toBeNull();
  });

  it("round-trips: prose -> structured -> prose preserves the instant", () => {
    for (const raw of [
      "half past nine in the evening",
      "a quarter past eleven in the morning",
      "twenty minutes to ten at night",
      "a quarter to six on the evening prior",
    ]) {
      const structured = toStructuredTime(raw)!;
      expect(structured, raw).not.toBeNull();
      const rendered = renderStructuredTime(structured);
      const again = toStructuredTime(rendered)!;
      expect(again, `${raw} -> ${rendered}`).not.toBeNull();
      expect(structuredAbsolute(again), `${raw} -> ${rendered}`).toBe(structuredAbsolute(structured));
    }
  });
});

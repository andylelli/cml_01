/**
 * A_96 — a month that dates a DOCUMENT is not the story's calendar.
 *
 * Run 95041 ABORTED on four `temporal_contradiction` majors — "(april, june, july, october vs
 * winter)" — and every month was the case's own MECHANISM: a forged excavation report dated "the
 * twenty-second of April" on paper watermarked "the tenth of October", with filing stamps running
 * "May, July, then June". The whole mystery is that contradiction. The validator read it as a
 * continuity error and the run lost its manuscript.
 *
 * The fixtures below are that book's sentences, verbatim from the Agent 9 checkpoint.
 */
import { afterEach, describe, expect, it } from "vitest";

import {
  analyzeTemporalConsistency,
  isDocumentaryMonthExclusionEnabled,
  stripDocumentaryMonths,
} from "../temporal-consistency.js";

const prev = process.env.VALIDATION_DOCUMENTARY_MONTHS;
afterEach(() => {
  if (prev === undefined) delete process.env.VALIDATION_DOCUMENTARY_MONTHS;
  else process.env.VALIDATION_DOCUMENTARY_MONTHS = prev;
});

// Verbatim from run 95041, chapters 1-3.
const REPORT = `You'll see the date plainly written—a quarter to four on the twenty-second of April. That is the official record.`;
const WATERMARK = `tracing the watermark with the tip of her finger. The words 'the tenth of October' shimmered faintly in the paper's grain.`;
const STAMPS = `three stamps with dates ranging from May to July in illogical filing order, the ink faded but legible.`;
const WINTER = `The winter drizzle pressed against the windowpanes, and the cold had settled into the stones.`;

describe("the flag defaults OFF", () => {
  it("is off unless .env says so", () => {
    delete process.env.VALIDATION_DOCUMENTARY_MONTHS;
    expect(isDocumentaryMonthExclusionEnabled()).toBe(false);
  });
});

describe("THE DEFECT, reproduced on the run's own text", () => {
  const text = [REPORT, WATERMARK, STAMPS, WINTER].join(" ");

  it("OFF: the case's forged dates read as a month/season contradiction — what aborted the run", () => {
    delete process.env.VALIDATION_DOCUMENTARY_MONTHS;
    const a = analyzeTemporalConsistency(text);
    expect(a.mentionedMonths.length).toBeGreaterThan(0);
    expect(a.conflictingSeasons).toContain("winter");
  });

  it("ON: the documentary months are not the story's calendar, and nothing conflicts", () => {
    process.env.VALIDATION_DOCUMENTARY_MONTHS = "true";
    const a = analyzeTemporalConsistency(text);
    expect(a.mentionedMonths).toEqual([]);
    expect(a.conflictingSeasons).toEqual([]);
  });
});

describe("KNOWN-POSITIVE: a real contradiction still fires", () => {
  it("a month describing the STORY's own weather is not excluded", () => {
    process.env.VALIDATION_DOCUMENTARY_MONTHS = "true";
    const a = analyzeTemporalConsistency("It was a bright April morning on the dunes. " + WINTER);
    expect(a.mentionedMonths).toContain("april");
    expect(a.conflictingSeasons).toContain("winter");
  });

  it("and a documentary month in the SAME book does not suppress a genuine one", () => {
    process.env.VALIDATION_DOCUMENTARY_MONTHS = "true";
    const a = analyzeTemporalConsistency(`${REPORT} It was a bright April morning on the dunes. ${WINTER}`);
    expect(a.conflictingSeasons).toContain("winter");
  });
});

describe("stripDocumentaryMonths is narrow by construction", () => {
  it("removes the month and leaves the rest of the sentence", () => {
    const out = stripDocumentaryMonths(REPORT);
    expect(out).not.toMatch(/April/i);
    expect(out).toContain("the official record");
    expect(out).toContain("a quarter to four");
  });

  it("handles the marker on either side of the month", () => {
    expect(stripDocumentaryMonths("dated the twenty-second of April")).not.toMatch(/April/i);
    expect(stripDocumentaryMonths("April, as the ledger records")).not.toMatch(/April/i);
  });

  it("does NOT reach across a sentence boundary", () => {
    const out = stripDocumentaryMonths("She read the report. It was April, and the gorse was in flower.");
    expect(out).toMatch(/April/i);
  });

  it("a month cited inside SINGLE quotes is a value, not the calendar", () => {
    expect(stripDocumentaryMonths(`The words 'the tenth of October' shimmered.`)).not.toMatch(/October/i);
  });

  it("but DIALOGUE in double quotes is untouched, so a character stating the season still counts", () => {
    const line = `"It was April when we found it," she said.`;
    expect(stripDocumentaryMonths(line)).toMatch(/April/i);
  });

  it("a month with no documentary marker anywhere near it survives", () => {
    expect(stripDocumentaryMonths("The October gales had stripped the hedges.")).toMatch(/October/i);
  });

  it("empty and undefined are safe", () => {
    expect(stripDocumentaryMonths("")).toBe("");
    expect(stripDocumentaryMonths(undefined as any)).toBe("");
  });
});

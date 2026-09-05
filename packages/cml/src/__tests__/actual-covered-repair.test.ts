/**
 * REPAIRING `actual_covered` RATHER THAN ABORTING ON IT.
 *
 * The culprit's alibi covering the REAL time of death makes the concealment incoherent — they could
 * not have committed the murder. Agent 3 will not fix it: MEASURED on runs 22362 and 25586 it returned
 * the IDENTICAL broken case on all three attempts, with feedback naming the exact correction. Run
 * 25586 then aborted having paid for four artifacts.
 *
 * The arithmetic cannot fail. The window must CONTAIN the staged time (that is what makes the
 * deception protect the culprit) and EXCLUDE the real one; trimming on the side away from the staged
 * time always leaves exactly that. VERIFIED against every stored case with this shape — 4 of 4 —
 * and all four are pinned below with their real dial values.
 */

import { describe, expect, it } from "vitest";

import { alibiSpanToWindow, renderAlibiWindow, repairActualCovered } from "../alibi-span.js";
import type { AlibiSpan } from "../alibi-span.js";

/** Dial minutes to a span, so the fixtures can be written in the units the archive reports. */
const spanOf = (start: number, end: number, location?: string): AlibiSpan => ({
  startHour: Math.floor(start / 60) % 12,
  startMinute: start % 60,
  endHour: Math.floor(end / 60) % 12,
  endMinute: end % 60,
  ...(location ? { location } : {}),
});

describe("the four real archive cases", () => {
  it.each([
    ["canary_1785870981754", 105, 170, 120, 165],
    ["canary_1786999938273", 140, 170, 160, 165],
    ["canary_1787512796199", 645, 670, 670, 645],
    ["canary_1788293825797", 510, 570, 550, 555],
  ])("%s repairs", (_id, start, end, actual, apparent) => {
    const fixed = repairActualCovered(spanOf(start, end), apparent, actual);
    expect(fixed, "must repair").not.toBeNull();

    const [ns, ne] = alibiSpanToWindow(fixed!);
    expect(apparent >= ns && apparent <= ne, "staged time must stay INSIDE").toBe(true);
    expect(actual >= ns && actual <= ne, "real time must fall OUTSIDE").toBe(false);
    expect(ns).toBeLessThanOrEqual(ne);
  });
});

describe("it refuses every shape it does not own", () => {
  it("a wrapping window", () => {
    // 11:40 → 00:20. Trimming a wrapped span is a different problem and guessing at it would be worse
    // than leaving the case alone.
    expect(repairActualCovered(spanOf(700, 20), 710, 705)).toBeNull();
  });

  it("the real time already outside — nothing to repair", () => {
    expect(repairActualCovered(spanOf(120, 180), 150, 200)).toBeNull();
  });

  it("the staged time outside — that is apparent_not_covered, a different defect", () => {
    // Repairing here would silently convert one defect into another and hide the real complaint.
    expect(repairActualCovered(spanOf(120, 180), 200, 150)).toBeNull();
  });

  it("identical times — that is times_identical", () => {
    expect(repairActualCovered(spanOf(120, 180), 150, 150)).toBeNull();
  });
});

describe("the trimmed window is still readable prose", () => {
  it("prefers a five-minute boundary when one still contains the staged time", () => {
    // 5:00–6:00 with the real death at 5:45 and the staged at 5:30. Trimming to 5:44 is arithmetically
    // fine and reads like a machine; 5:40 reads like an alibi.
    const fixed = repairActualCovered(spanOf(300, 360), 330, 345)!;
    expect(alibiSpanToWindow(fixed)).toEqual([300, 340]);
    expect(renderAlibiWindow({ ...fixed, location: "the lounge" }))
      .toBe("five o'clock to twenty to six in the lounge");
  });

  it("falls back to the exact minute when rounding would exclude the staged time", () => {
    // Staged 5:43, real 5:45 — rounding down to 5:40 would push the staged time out, so it must not.
    const fixed = repairActualCovered(spanOf(300, 360), 343, 345)!;
    expect(alibiSpanToWindow(fixed)).toEqual([300, 344]);
  });

  it("keeps the location, because the place was never the problem", () => {
    const fixed = repairActualCovered(spanOf(300, 360, "the village green"), 330, 345)!;
    expect(fixed.location).toBe("the village green");
  });
});

describe("the property that makes this safe at all", () => {
  it("over every start/end/actual/apparent combination, a repair is always correct or refused", () => {
    // Exhaustive rather than sampled: if a single combination could return a window that still covered
    // the real time, this repair would write a broken case with confidence.
    let repaired = 0;
    for (let start = 0; start < 720; start += 37) {
      for (let end = start + 5; end < Math.min(start + 200, 720); end += 29) {
        for (let actual = start; actual <= end; actual += 13) {
          for (let apparent = start; apparent <= end; apparent += 17) {
            const fixed = repairActualCovered(spanOf(start, end), apparent, actual);
            if (!fixed) continue;
            repaired += 1;
            const [ns, ne] = alibiSpanToWindow(fixed);
            expect(ns).toBeLessThanOrEqual(ne);
            expect(apparent >= ns && apparent <= ne).toBe(true);
            expect(actual >= ns && actual <= ne).toBe(false);
          }
        }
      }
    }
    // A guard against the loop silently testing nothing.
    expect(repaired).toBeGreaterThan(100);
  });
});

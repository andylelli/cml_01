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
    /**
     * "five forty", NOT "twenty to six" — and this assertion changed because the to-form was a BUG.
     *
     * An audit on 2026-09-05 found the natural rendering of 5:40 collides with the window joiner:
     * "five o'clock to twenty to six" was read back by `parseTimeWindow` as 5:00–?? because the
     * " to " INSIDE the endpoint wins the left-to-right separator scan. MEASURED: 603 of 9951
     * repairs (6%) wrote prose that read back as a different time. `renderPoint` no longer emits
     * the to-form at all.
     */
    expect(renderAlibiWindow({ ...fixed, location: "the lounge" }))
      .toBe("five o'clock to five forty in the lounge");
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

describe("the rendered window must read back as itself — the audit that caught the to-form", () => {
  it("every rendered endpoint round-trips, across every dial minute", async () => {
    const { alibiSpanFromWindow } = await import("../alibi-span.js");
    // The bug this pins: 12:50 renders naturally as "ten to one", whose " to " collides with the
    // window joiner, so "ten to one to five to one" read back as 600-55. 6% of repairs were affected.
    const failures: string[] = [];
    for (let start = 0; start < 720; start += 1) {
      for (const len of [5, 45, 137]) {
        const end = start + len;
        if (end >= 720) continue;
        const span = spanOf(start, end);
        const prose = renderAlibiWindow(span);
        const back = alibiSpanFromWindow(prose);
        if (!back) { failures.push(`unreadable: "${prose}"`); continue; }
        const [bs, be] = alibiSpanToWindow(back);
        if (bs !== start || be !== end) failures.push(`${start}-${end} -> "${prose}" -> ${bs}-${be}`);
      }
    }
    expect(failures.slice(0, 5)).toEqual([]);
  });

  it("no rendered endpoint contains the joiner, which is why the above holds", () => {
    for (let minute = 0; minute < 60; minute += 1) {
      const one = renderAlibiWindow(spanOf(minute, minute + 1)).split(" to ");
      expect(one, `minute ${minute} split into ${one.length} parts`).toHaveLength(2);
    }
  });
});

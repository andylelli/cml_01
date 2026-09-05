/**
 * ONE PARSER ANSWERS "WHAT TIME IS THIS".
 *
 * `readDialMinutes` used to be a hand-written "small, strict subset" of `parseClockTime`, justified
 * on the grounds that the spine's job is certainty while `parseClockTime` stays permissive for prose.
 *
 * The argument did not survive contact with the call sites. `parseTemporalValue` is only ever handed
 * `fact.value` — a structured locked-fact field — so the false positive the strictness guarded
 * against ("one of the guests" reading as 1:00) cannot arrive. Meanwhile the subset excluded forms
 * the pipeline really does write as facts:
 *
 *   MEASURED over the 156 distinct locked-fact values in apps/worker/logs/locked-facts-*.json —
 *   the spine returned null for "twenty past ten" and "twenty past seven", which parseClockTime
 *   reads. 2 of 60 clock-valued facts. Small, and a null makes the arithmetic check SILENT, which
 *   on this project has already meant "unparseable" rather than "clean" for a week.
 *
 * These tests exist so the two cannot drift apart again. Two bodies computing the same thing is the
 * trap this repo has been bitten by three times (the A_66 vandal had three bodies across two
 * packages; the B5 injector's builder and its recogniser lived in different modules).
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { parseTemporalValue } from "../temporal-spine.js";
import { parseClockTime } from "../timeline-deception.js";

/** The spine's dial reading, recovered from its richer return so the two are comparable. */
const spineDial = (value: string): number | null => {
  const reading = parseTemporalValue(value);
  if (!reading) return null;
  // parseTemporalValue promotes past noon when a daypart fixes the half of the day; the dial
  // reading is that value modulo the 12-hour face, which is what parseClockTime returns.
  return reading.minutes % 720;
};

describe("the forms the strict subset used to drop", () => {
  it.each([
    ["twenty past ten", 620],
    ["twenty past seven", 440],
  ])("%s — a REAL locked-fact value the spine could not read", (value, want) => {
    // Both of these are in apps/worker/logs/locked-facts-*.json. Before 2026-09-04 the spine
    // returned null for them and the arithmetic check went quiet.
    expect(parseClockTime(value)).toBe(want);
    expect(spineDial(value)).toBe(want);
  });

  it.each(["seven fifteen", "seven twenty", "five forty-five", "three twenty"])(
    "%s — the spoken hour-minutes form",
    (value) => {
      expect(spineDial(value)).toBe(parseClockTime(value));
      expect(spineDial(value)).not.toBeNull();
    },
  );

  it("midday now reads as noon, in BOTH", () => {
    // parseClockTime returned null for "midday" while reading "noon" — the one point where the
    // strict subset was stricter AND better. Normalised in parseClockTime so every branch gains it.
    expect(parseClockTime("midday")).toBe(parseClockTime("noon"));
    expect(parseClockTime("midday")).not.toBeNull();
    expect(spineDial("midday")).toBe(spineDial("noon"));
  });
});

describe("midnight and noon are an ANCHOR, not the whole reading", () => {
  // Found by the corpus differential below, on its first run, against real locked-fact values. The
  // old code tested whether the phrase CONTAINED "midnight" and returned 0, so "a quarter to
  // midnight" read as midnight exactly — a silent fifteen-minute error in a value the arithmetic
  // check then reasons from as fact.
  const abs = (value: string) => parseTemporalValue(value)!.minutes;

  it.each([
    ["midnight", 0],
    ["ten minutes past midnight", 10],
    ["a quarter past midnight", 15],
    ["noon", 720],
    ["midday", 720],
    ["ten minutes past noon", 730],
  ])("%s reads %i", (value, want) => {
    expect(abs(value)).toBe(want);
  });

  it("counting DOWN to an anchor belongs to the other half of the day", () => {
    // "a quarter to midnight" is 23:45 — the night before, not a quarter past eleven in the morning.
    expect(abs("a quarter to midnight")).toBe(23 * 60 + 45);
    expect(parseTemporalValue("a quarter to midnight")!.meridiem).toBe("pm");
    // "a quarter to noon" is 11:45 in the morning.
    expect(abs("a quarter to noon")).toBe(11 * 60 + 45);
    expect(parseTemporalValue("a quarter to noon")!.meridiem).toBe("am");
  });

  it("REGRESSION: the old form collapsed all four of these to the same number", () => {
    // Non-vacuous guard. Every one of these used to return 0.
    const collapsed = ["ten minutes past midnight", "a quarter to midnight", "a quarter past midnight"];
    expect(new Set(collapsed.map(abs)).size).toBe(collapsed.length);
    expect(collapsed.every((v) => abs(v) !== 0)).toBe(true);
  });
});

describe("the refusals the spine must keep — delegation must not make it credulous", () => {
  it.each([
    "one hour and fifty-five minutes",
    "five minutes",
    "twenty minutes",
    "ten seconds",
    "two hours",
    "thirty-four inches",
    "a heavy ornate candlestick",
    "the accepted explanation",
    "",
  ])("refuses %s", (value) => {
    expect(parseTemporalValue(value)).toBeNull();
  });

  it("still refuses undefined", () => {
    expect(parseTemporalValue(undefined)).toBeNull();
  });
});

describe("the two parsers agree on every real locked-fact value", () => {
  const values = (): string[] => {
    const dir = "apps/worker/logs";
    if (!existsSync(dir)) return [];
    const out = new Set<string>();
    for (const file of readdirSync(dir)) {
      if (!file.startsWith("locked-facts-") || !file.endsWith(".json")) continue;
      try {
        const parsed = JSON.parse(readFileSync(`${dir}/${file}`, "utf8"));
        for (const entry of parsed?.registry ?? []) {
          const value = String(entry?.value ?? "").trim();
          if (value) out.add(value);
        }
      } catch {
        // A malformed log is not this test's business.
      }
    }
    return [...out];
  };

  it("no value is read by one and refused by the other, and none disagree", () => {
    const all = values();
    if (all.length === 0) {
      // The logs are local artifacts; absent them the cases above still pin the behaviour. Say so
      // rather than passing silently, because a green vacuous test is how a parser drifts.
      console.warn("[parity] no locked-facts logs on disk — corpus differential skipped");
      return;
    }
    const disagreements: string[] = [];
    for (const value of all) {
      const shared = parseClockTime(value);
      const spine = spineDial(value);
      if (shared !== spine) disagreements.push(`${JSON.stringify(value)}: shared=${shared} spine=${spine}`);
    }
    expect(disagreements, `${all.length} values compared`).toEqual([]);
  });
});

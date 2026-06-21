/**
 * Golden proof for the shared TemporalAnchor module (Agent 2d redesign, phase 2).
 *
 * Phase 2 repointed BOTH live consumers at this shared module:
 *   - ../agent2d-temporal-context.js now imports + re-exports `generateSpecificDate` from here.
 *   - ../agent9-prose/lint.js now imports + re-exports `MONTH_TO_SEASON` / `normalizeMonthToken`
 *     / `CanonicalSeason` from here.
 *
 * That makes the old "shared === live" comparisons CIRCULAR (live now IS shared), so they no
 * longer prove anything on their own. To keep the golden test meaningful, the month→season map
 * is asserted against LITERAL expected values for all 12 months (the load-bearing temporal facts
 * Agent 9 enforces in prose). The LIVE re-exports are still cross-checked to guarantee the two
 * consumers resolve to the same single source, and the determinism test is retained.
 */
import { describe, expect, it } from "vitest";

// --- Module under test (the single shared source of truth) ---
import {
  deriveTemporalAnchor,
  generateSpecificDate as anchorGenerateSpecificDate,
  monthToSeason,
  MONTH_TO_SEASON as ANCHOR_MONTH_TO_SEASON,
} from "../shared/temporal-anchor.js";

// --- LIVE consumers (now re-export from the shared module — used to prove a single source) ---
import { generateSpecificDate as liveGenerateSpecificDate } from "../agent2d-temporal-context.js";
import {
  MONTH_TO_SEASON as LIVE_MONTH_TO_SEASON,
  deriveTemporalSeasonLock,
} from "../agent9-prose/lint.js";

// Literal expected month→season mapping — the source of truth asserted as concrete values
// (verified against shared/temporal-anchor.ts), so the proof does not depend on a self-comparison.
const EXPECTED_MONTH_TO_SEASON: Record<string, "spring" | "summer" | "autumn" | "winter"> = {
  january: "winter",
  february: "winter",
  march: "spring",
  april: "spring",
  may: "spring",
  june: "summer",
  july: "summer",
  august: "summer",
  september: "autumn",
  october: "autumn",
  november: "autumn",
  december: "winter",
};

const FULL_MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// A spread of realistic runId shapes (real runIds look like "run_<uuid8>", plus edge inputs).
const RUN_IDS = [
  "run_0a542613",
  "run_d3cf0c3f",
  "run_08539ae3-f1b5-414d-917d-5c995ca4f286",
  "proj_626a86ab-c1a7-4c72-9596-886cc946b02b",
  "abc",
  "Z",
  "the quick brown fox jumped over the lazy dog 1234567890",
  "9e98f2e3-b11f-4ca1-8d65-a70edbc4c3be",
];

const DECADES = ["1920s", "1930s", "1950s", "1960s", "1980s"];

describe("TemporalAnchor — month→season golden proof (literal expected values)", () => {
  it("monthToSeason returns the exact literal season for each of the 12 months", () => {
    // Concrete spot-checks of the load-bearing facts (one per season + the cross-quarter edges).
    expect(monthToSeason("january")).toBe("winter");
    expect(monthToSeason("april")).toBe("spring");
    expect(monthToSeason("july")).toBe("summer");
    expect(monthToSeason("october")).toBe("autumn");
    expect(monthToSeason("december")).toBe("winter");

    // Full literal sweep of all 12 months (lowercase keys), asserted as concrete values.
    for (const monthName of FULL_MONTH_NAMES) {
      const key = monthName.toLowerCase();
      expect(monthToSeason(key)).toBe(EXPECTED_MONTH_TO_SEASON[key]);
    }
  });

  it("the shared MONTH_TO_SEASON map equals the literal expected mapping", () => {
    // Same keys, same values — the redesign's "one map, one place" invariant, asserted literally.
    expect(ANCHOR_MONTH_TO_SEASON).toStrictEqual(EXPECTED_MONTH_TO_SEASON);
    expect(Object.keys(ANCHOR_MONTH_TO_SEASON).sort()).toStrictEqual(
      Object.keys(EXPECTED_MONTH_TO_SEASON).sort(),
    );
  });

  it("both live consumers resolve to the single shared source (one map, one place)", () => {
    // agent9's re-exported MONTH_TO_SEASON IS the shared map — prove they are the same source.
    expect(LIVE_MONTH_TO_SEASON).toBe(ANCHOR_MONTH_TO_SEASON);
    expect(LIVE_MONTH_TO_SEASON).toStrictEqual(EXPECTED_MONTH_TO_SEASON);
  });

  it("monthToSeason agrees with the LIVE agent9 deriveTemporalSeasonLock for all 12 months", () => {
    // deriveTemporalSeasonLock is the live consumer of MONTH_TO_SEASON in Agent 9. It normalizes
    // the (capitalized) month token, then looks it up. The derivation must match the literal facts.
    for (const monthName of FULL_MONTH_NAMES) {
      const liveLock = deriveTemporalSeasonLock({ specificDate: { month: monthName } } as never);
      expect(liveLock?.season).toBe(EXPECTED_MONTH_TO_SEASON[monthName.toLowerCase()]);
      expect(monthToSeason(monthName)).toBe(liveLock?.season);
    }
  });

  it("normalizes month tokens (case + whitespace) to the literal expected season", () => {
    expect(monthToSeason("  May  ")).toBe("spring");
    expect(monthToSeason("DECEMBER")).toBe("winter");
    // Unknown / empty tokens return undefined (matching deriveTemporalSeasonLock returning undefined).
    expect(monthToSeason("Smarch")).toBeUndefined();
    expect(monthToSeason("")).toBeUndefined();
    expect(monthToSeason(undefined)).toBeUndefined();
  });
});

describe("TemporalAnchor — date derivation (single source + literal anchors)", () => {
  it("agent2d's re-exported generateSpecificDate IS the shared source (one function)", () => {
    // After phase 2, agent2d re-exports generateSpecificDate from the shared module. Prove they
    // are literally the same binding, and that their output still agrees across runIds/decades.
    expect(liveGenerateSpecificDate).toBe(anchorGenerateSpecificDate);
    for (const decade of DECADES) {
      for (const runId of RUN_IDS) {
        const expected = liveGenerateSpecificDate(decade, runId);
        const actual = anchorGenerateSpecificDate(decade, runId);
        expect(actual).toStrictEqual(expected);
      }
    }
  });

  it("generateSpecificDate produces the exact literal anchor for known (decade, runId) pairs", () => {
    // Literal golden values (computed from the shared simpleHash/bit-shift math) so the date
    // derivation is pinned to concrete output, not a self-comparison.
    expect(anchorGenerateSpecificDate("1950s", "run_0a542613")).toStrictEqual({
      year: 1950,
      month: "March",
    });
    expect(anchorGenerateSpecificDate("1920s", "abc")).toStrictEqual({
      year: 1924,
      month: "November",
    });
  });

  it("deriveTemporalAnchor's year/month === LIVE generateSpecificDate output", () => {
    for (const decade of DECADES) {
      for (const runId of RUN_IDS) {
        const live = liveGenerateSpecificDate(decade, runId);
        const anchor = deriveTemporalAnchor(decade, runId);
        expect(anchor.year).toBe(live.year);
        expect(anchor.month).toBe(live.month);
      }
    }
  });

  it("deriveTemporalAnchor's season === LIVE deriveTemporalSeasonLock for the hashed month", () => {
    // End-to-end equivalence: the anchor's season equals what Agent 9 would derive today from
    // the exact month that Agent 2d's generateSpecificDate hashes.
    for (const decade of DECADES) {
      for (const runId of RUN_IDS) {
        const live = liveGenerateSpecificDate(decade, runId);
        const liveLock = deriveTemporalSeasonLock({ specificDate: { month: live.month } } as never);
        const anchor = deriveTemporalAnchor(decade, runId);
        expect(anchor.season).toBe(liveLock?.season);
        // The hashed month is always a real month name, so season is always defined.
        expect(anchor.season).toBeDefined();
      }
    }
  });
});

describe("TemporalAnchor — determinism", () => {
  it("same (decade, runId) ⇒ byte-identical anchor across repeated calls", () => {
    for (const decade of DECADES) {
      for (const runId of RUN_IDS) {
        const a = deriveTemporalAnchor(decade, runId);
        const b = deriveTemporalAnchor(decade, runId);
        expect(b).toStrictEqual(a);
      }
    }
  });
});

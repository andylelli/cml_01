import { describe, expect, it } from "vitest";
import { checkAvailability, listEraYears } from "../oracle.js";

/**
 * §6 acceptance gate: "Period-accuracy — a fixed audit set of (year, claim) pairs … KB must
 * answer correctly 100%." This table is the committed golden. Adding a year anchor that
 * regresses any of these answers fails the build.
 *
 * `available: false` = the means did not exist / was not usable in that year.
 * `available: true`  = it existed (even if with period caveats, e.g. no telephone records).
 */
const AUDIT_SET: Array<{ year: number; term: string; available: boolean; why: string }> = [
  { year: 1931, term: "fluorescent lighting", available: false, why: "no fluorescent light in 1931" },
  { year: 1931, term: "fluorescent", available: false, why: "no fluorescent light in 1931" },
  { year: 1931, term: "dna profiling", available: false, why: "DNA profiling is a 1980s technique" },
  { year: 1931, term: "dna swab", available: false, why: "no DNA forensics" },
  { year: 1931, term: "ballpoint pen", available: false, why: "ballpoint not in common use in 1931" },
  { year: 1931, term: "television", available: false, why: "no domestic TV broadcast in 1931" },
  { year: 1931, term: "mobile phone", available: false, why: "no mobile telephony" },
  { year: 1931, term: "cctv", available: false, why: "no CCTV" },
  { year: 1931, term: "penicillin", available: false, why: "no clinical antibiotics in 1931" },
  { year: 1931, term: "photocopier", available: false, why: "no photocopier" },
  { year: 1931, term: "computer", available: false, why: "no computer" },
  { year: 1931, term: "jet airliner", available: false, why: "no commercial jets" },

  { year: 1931, term: "fingerprinting", available: true, why: "routine by 1931" },
  { year: 1931, term: "fingerprint powder", available: true, why: "routine by 1931" },
  { year: 1931, term: "telephone", available: true, why: "exists (party lines, no records)" },
  { year: 1931, term: "telegram", available: true, why: "exists" },
  { year: 1931, term: "wireless", available: true, why: "broadcast wireless common" },
  { year: 1931, term: "motorcar", available: true, why: "common (if unreliable)" },
  { year: 1931, term: "gaslight", available: true, why: "domestic lighting of the period" },
  { year: 1931, term: "comparison microscope", available: true, why: "ballistics emerging by 1931" },
  { year: 1931, term: "blood typing", available: true, why: "ABO grouping exists (exclusion only)" },

  // Cross-decade: the same term flips with the year — proof the KB is year-sensitive,
  // not a single frozen anchor.
  { year: 1955, term: "fluorescent lighting", available: true, why: "fluorescent standard by the 1950s" },
  { year: 1925, term: "television", available: false, why: "no domestic TV broadcast in 1925" },
  { year: 1965, term: "dna profiling", available: false, why: "DNA profiling is a 1980s technique" },
  { year: 1965, term: "computer", available: true, why: "mainframe computers in use by 1965" },
  { year: 1945, term: "penicillin", available: true, why: "penicillin in clinical use by 1945" },
  { year: 1965, term: "mobile phone", available: false, why: "no mobile telephony in 1965" },
];

describe("§6 period-accuracy audit set (golden)", () => {
  it.each(AUDIT_SET)("$year / $term → available=$available ($why)", ({ year, term, available }) => {
    const result = checkAvailability(year, term, { onWarn: () => {} });
    expect(result.available, `${term}: basis=${result.basis}`).toBe(available);
  });

  it("answers 100% of the audit set correctly", () => {
    const wrong = AUDIT_SET.filter(
      (c) => checkAvailability(c.year, c.term, { onWarn: () => {} }).available !== c.available
    );
    expect(wrong.map((w) => `${w.year}/${w.term}`)).toEqual([]);
  });

  it("invariant: DNA profiling is unavailable in every seeded decade", () => {
    for (const year of listEraYears()) {
      expect(checkAvailability(year, "dna profiling", { onWarn: () => {} }).available).toBe(false);
    }
  });
});

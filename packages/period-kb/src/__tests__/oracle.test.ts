import { describe, expect, it } from "vitest";
import {
  KB_VERSION,
  DEFAULT_ARCHETYPE,
  bindEra,
  bindPlace,
  pickNearestYear,
  listEraYears,
  listPlaceArchetypes,
} from "../oracle.js";

describe("EraOracle.bindEra", () => {
  it("binds the exact seeded year with kb provenance", () => {
    const b = bindEra(1931, { onWarn: () => {} });
    expect(b.exact).toBe(true);
    expect(b.resolvedYear).toBe(1931);
    expect(b.entry.year).toBe(1931);
    expect(b.provenance).toBe(`kb:v${KB_VERSION}/1931`);
    expect(b.fallback).toBeUndefined();
  });

  it("falls back to the nearest anchor for an unseeded year AND warns (no silent default)", () => {
    const warnings: string[] = [];
    const b = bindEra(1933, { onWarn: (m) => warnings.push(m) });
    expect(b.exact).toBe(false);
    expect(b.resolvedYear).toBe(1931); // nearest seeded anchor (Δ2)
    expect(b.fallback?.distanceYears).toBe(2);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("no era anchor for 1933");
  });

  it("breaks an equidistant tie toward the earlier anchor", () => {
    // 1928 is Δ3 from both 1925 and 1931 -> earlier anchor (1925) wins, deterministically.
    const b = bindEra(1928, { onWarn: () => {} });
    expect(b.resolvedYear).toBe(1925);
    expect(b.fallback?.distanceYears).toBe(3);
  });

  it("never throws across a wide range of years", () => {
    for (let y = 1900; y <= 1970; y += 7) {
      expect(() => bindEra(y, { onWarn: () => {} })).not.toThrow();
    }
  });

  it("is deterministic: the bound era entry is byte-identical across calls", () => {
    const a = bindEra(1931, { onWarn: () => {} });
    const b = bindEra(1931, { onWarn: () => {} });
    expect(JSON.stringify(a.entry)).toBe(JSON.stringify(b.entry));
    expect(a.entry).toEqual(b.entry);
  });
});

describe("EraOracle.bindPlace", () => {
  it("binds the exact seeded archetype", () => {
    const b = bindPlace("country_manor", { onWarn: () => {} });
    expect(b.exact).toBe(true);
    expect(b.entry.archetype).toBe("country_manor");
    expect(b.provenance).toBe(`kb:v${KB_VERSION}/country_manor`);
  });

  it("falls back to the default archetype for an unseeded archetype AND warns", () => {
    const warnings: string[] = [];
    const b = bindPlace("submarine", { onWarn: (m) => warnings.push(m) });
    expect(b.exact).toBe(false);
    expect(b.resolvedArchetype).toBe(DEFAULT_ARCHETYPE);
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain('no place archetype "submarine"');
  });
});

describe("pickNearestYear (fallback rule, pure)", () => {
  it("picks the closest anchor", () => {
    expect(pickNearestYear(1940, [1920, 1931, 1955])).toBe(1931);
    expect(pickNearestYear(1953, [1920, 1931, 1955])).toBe(1955);
  });

  it("breaks ties toward the earlier year (deterministic)", () => {
    expect(pickNearestYear(1925, [1920, 1930])).toBe(1920);
    expect(pickNearestYear(1950, [1940, 1960])).toBe(1940);
  });

  it("throws only on an empty anchor set", () => {
    expect(() => pickNearestYear(1931, [])).toThrow();
  });
});

describe("KB inventory", () => {
  it("has 1931 seeded as an era anchor", () => {
    expect(listEraYears()).toContain(1931);
  });

  it("has country_manor seeded as a place archetype", () => {
    expect(listPlaceArchetypes()).toContain("country_manor");
  });
});

import { describe, expect, it } from "vitest";
import {
  listEraYears,
  listPlaceArchetypes,
  loadEraEntry,
  loadPlaceEntry,
  validateEraData,
  validatePlaceData,
} from "../loader.js";

describe("KB data conforms to its strict schema", () => {
  it("every eras/<year>.yaml loads and validates", () => {
    const years = listEraYears();
    expect(years.length).toBeGreaterThan(0);
    for (const year of years) {
      const entry = loadEraEntry(year); // throws if invalid
      expect(entry.year).toBe(year);
      expect(entry.not_yet_invented.length).toBeGreaterThan(0);
      expect(entry.sources.length).toBeGreaterThan(0);
      expect(entry.lighting.domestic.length).toBeGreaterThan(0);
      expect(entry.technology.present.length).toBeGreaterThan(0);
    }
  });

  it("every places/<archetype>.yaml loads and validates", () => {
    const archetypes = listPlaceArchetypes();
    expect(archetypes.length).toBeGreaterThan(0);
    for (const archetype of archetypes) {
      const entry = loadPlaceEntry(archetype); // throws if invalid
      expect(entry.archetype).toBe(archetype);
      expect(entry.access_points.length).toBeGreaterThan(0);
      expect(entry.sources.length).toBeGreaterThan(0);
    }
  });
});

describe("the strict schema actually rejects malformed entries", () => {
  it("accepts the real 1931 entry", () => {
    expect(validateEraData(loadEraEntry(1931))).toBe(true);
  });

  it("rejects an era entry with an unknown key (additionalProperties:false)", () => {
    const bad = { ...loadEraEntry(1931), surprise_field: "nope" };
    expect(validateEraData(bad)).toBe(false);
  });

  it("rejects an era entry missing a required block", () => {
    const bad: Record<string, unknown> = { ...loadEraEntry(1931) };
    delete bad.forensics;
    expect(validateEraData(bad)).toBe(false);
  });

  it("rejects a place entry with a bad isolation profile enum", () => {
    const place = loadPlaceEntry("country_manor");
    const bad = { ...place, isolation: { ...place.isolation, profile: "cosmic" } };
    expect(validatePlaceData(bad)).toBe(false);
  });
});

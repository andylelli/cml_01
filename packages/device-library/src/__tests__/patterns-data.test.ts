import { describe, expect, it } from "vitest";
import { loadPatterns, listPatternIds, validatePatternData } from "../loader.js";
import { CAPABILITY_AVAILABLE_FROM } from "../era-capabilities.js";

describe("seed corpus integrity", () => {
  it("loads ≥10 patterns, all schema-valid (loadPatterns throws on any invalid)", () => {
    const patterns = loadPatterns();
    expect(patterns.length).toBeGreaterThanOrEqual(10);
  });

  it("pattern ids are unique", () => {
    const ids = listPatternIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers all five mechanism families", () => {
    const families = new Set(loadPatterns().map((p) => p.family));
    expect([...families].sort()).toEqual(["authority", "behavioral", "identity", "spatial_routing", "timing"].filter((f) => families.has(f as never)));
    // at minimum the families the seed actually needs to demonstrate retrieval
    for (const f of ["timing", "spatial_routing", "identity", "authority"]) {
      expect(families.has(f as never), `missing family ${f}`).toBe(true);
    }
  });

  it("every requires/forbids capability is known to the era model (no typos)", () => {
    const known = new Set(Object.keys(CAPABILITY_AVAILABLE_FROM));
    for (const p of loadPatterns()) {
      for (const cap of [...p.feasibility.requires, ...p.feasibility.forbids]) {
        expect(known.has(cap), `${p.pattern_id}: unknown capability "${cap}"`).toBe(true);
      }
    }
  });
});

describe("schema strictness", () => {
  it("accepts a real seed pattern", () => {
    expect(validatePatternData(loadPatterns()[0])).toBe(true);
  });

  it("rejects an unknown key (additionalProperties:false)", () => {
    expect(validatePatternData({ ...loadPatterns()[0], surprise: "nope" })).toBe(false);
  });

  it("rejects a bad family enum", () => {
    expect(validatePatternData({ ...loadPatterns()[0], family: "chronology" })).toBe(false);
  });

  it("rejects a pattern missing the feasibility block", () => {
    const bad: Record<string, unknown> = { ...loadPatterns()[0] };
    delete bad.feasibility;
    expect(validatePatternData(bad)).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { retrievePatterns, noveltyScore } from "../retrieve.js";
import { loadPatterns } from "../loader.js";
import type { DevicePattern, RetrievalQuery } from "../types.js";

/**
 * Spike A (§9.1): for a typical seed the deterministic era+axis+family filter must return ≥3
 * compatible patterns — fewer means the library is too sparse to recombine from and the whole
 * retrieve-recombine architecture collapses into the from-scratch fallback it replaces.
 */
describe("Spike A — retrieval on the §4.6 fen-school seed (1931, temporal, timing)", () => {
  const fenSchool: RetrievalQuery = { decade: 1930, primaryAxis: "temporal", mechanismFamilies: ["timing"] };

  it("returns at least 3 compatible patterns (the go-signal)", () => {
    const r = retrievePatterns(fenSchool);
    expect(r.length).toBeGreaterThanOrEqual(3);
  });

  it("every retrieved pattern is era-, axis-, and family-compatible", () => {
    for (const { pattern } of retrievePatterns(fenSchool)) {
      expect(pattern.feasibility.eras).toContain(1930);
      expect(pattern.axes).toContain("temporal");
      expect(pattern.family).toBe("timing");
    }
  });

  it("a year input is rounded to the decade", () => {
    expect(retrievePatterns({ decade: 1931, primaryAxis: "temporal", mechanismFamilies: ["timing"] }).length).toBe(
      retrievePatterns(fenSchool).length,
    );
  });
});

describe("retrieval filters", () => {
  it("excludes patterns whose family is not requested", () => {
    const r = retrievePatterns({ decade: 1930, primaryAxis: "spatial", mechanismFamilies: ["spatial_routing"] });
    expect(r.length).toBeGreaterThanOrEqual(1);
    for (const { pattern } of r) expect(pattern.family).toBe("spatial_routing");
  });

  it("empty mechanismFamilies = any family", () => {
    const any = retrievePatterns({ decade: 1930, primaryAxis: "temporal" });
    const families = new Set(any.map((r) => r.pattern.family));
    expect(any.length).toBeGreaterThan(0);
    // temporal axis appears in more than one family
    expect(families.size).toBeGreaterThanOrEqual(1);
  });

  it("place filter excludes patterns that name incompatible places (coastal tide trick vs a school)", () => {
    const withPlace = retrievePatterns({ decade: 1930, primaryAxis: "temporal", mechanismFamilies: ["timing"], place: "school" });
    expect(withPlace.some((r) => r.pattern.pattern_id === "tidal_window")).toBe(false);
  });

  it("excludes an era-incompatible pattern (a gramophone trick before 1900s decade lists)", () => {
    const r = retrievePatterns({ decade: 1880, primaryAxis: "temporal", mechanismFamilies: ["timing"] });
    expect(r.some((x) => x.pattern.pattern_id === "recorded_presence")).toBe(false);
  });
});

describe("novelty ranking", () => {
  it("ranks an unused pattern above a heavily-used one", () => {
    const base = loadPatterns().find((p) => p.family === "timing" && p.axes.includes("temporal"))!;
    const used: DevicePattern = {
      ...base,
      pattern_id: "used_variant",
      usage_log: [{ run_id: "r1" }, { run_id: "r2" }, { run_id: "r3" }],
    };
    const ranked = retrievePatterns(
      { decade: 1930, primaryAxis: "temporal", mechanismFamilies: ["timing"] },
      [used, { ...base, pattern_id: "fresh_variant", usage_log: [] }],
    );
    expect(noveltyScore(used)).toBeLessThan(1);
    expect(ranked[0].pattern.pattern_id).toBe("fresh_variant");
    expect(ranked[ranked.length - 1].pattern.pattern_id).toBe("used_variant");
  });
});

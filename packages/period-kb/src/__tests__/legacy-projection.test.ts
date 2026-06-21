import { describe, expect, it } from "vitest";
import { loadEraEntry, loadPlaceEntry } from "../loader.js";
import {
  buildEraConstraintsForDecade,
  buildEraConstraintsFromKb,
  buildLocationConstraintsFromKb,
  decadeLabel,
  projectEraFields,
  projectLocationFields,
  representativeYearForDecade,
} from "../legacy-projection.js";

describe("legacy era projection (Phase 1/2 bridge)", () => {
  it("decadeLabel maps a year to the decade string", () => {
    expect(decadeLabel(1931)).toBe("1930s");
    expect(decadeLabel(1925)).toBe("1920s");
  });

  it("projectEraFields emits the setting_refinement era.* shape", () => {
    const f = projectEraFields(loadEraEntry(1931));
    expect(f.decade).toBe("1930s");
    expect(f.technology.length).toBeGreaterThanOrEqual(3);
    expect(f.forensics.join(" ")).toContain("fingerprinting");
    expect(f.socialNorms.length).toBeGreaterThan(0);
    expect(f.policing.length).toBeGreaterThan(0);
  });

  it("buildEraConstraintsFromKb reproduces the legacy 6-bullet string shape", () => {
    const s = buildEraConstraintsFromKb(1931, { onWarn: () => {} });
    expect(s).toContain("1930s Era Constraints");
    for (const label of ["- Technology:", "- Forensics:", "- Transportation:", "- Communication:", "- Social:", "- Policing:"]) {
      expect(s).toContain(label);
    }
  });
});

describe("decade bridge (Phase 1 drop-in for buildEraConstraints)", () => {
  it("maps each legacy decade to its seeded anchor year (no approximation)", () => {
    expect(representativeYearForDecade("1920s")).toBe(1925);
    expect(representativeYearForDecade("1930s")).toBe(1931);
    expect(representativeYearForDecade("1940s")).toBe(1945);
    expect(representativeYearForDecade("1950s")).toBe(1955);
    expect(representativeYearForDecade("1960s")).toBe(1965);
  });

  it("parses an unseeded decade to a mid-decade year (explicit fallback, not undefined)", () => {
    expect(representativeYearForDecade("1910s")).toBe(1915);
    expect(representativeYearForDecade("1931")).toBe(1931);
  });

  it("returns undefined only for unparseable input", () => {
    expect(representativeYearForDecade("the thirties")).toBeUndefined();
  });

  it("builds the legacy era-constraint string for every supported decade", () => {
    for (const [decade, marker] of [
      ["1920s", "1920s Era Constraints"],
      ["1930s", "1930s Era Constraints"],
      ["1940s", "1940s Era Constraints"],
      ["1950s", "1950s Era Constraints"],
      ["1960s", "1960s Era Constraints"],
    ] as const) {
      const s = buildEraConstraintsForDecade(decade, { onWarn: () => {} });
      expect(s, decade).toBeDefined();
      expect(s!).toContain(marker);
    }
  });
});

describe("legacy location projection (Phase 2 bridge)", () => {
  it("projectLocationFields emits the setting_refinement location.* shape", () => {
    const l = projectLocationFields(loadPlaceEntry("country_manor"));
    expect(l.type).toBe("Country Manor House");
    expect(l.physicalConstraints.length).toBeGreaterThan(0);
    expect(l.geographicIsolation.length).toBeGreaterThan(20);
    expect(l.accessControl.length).toBeGreaterThan(0);
  });

  it("buildLocationConstraintsFromKb reproduces a legacy location string", () => {
    const s = buildLocationConstraintsFromKb("country_manor", { onWarn: () => {} });
    expect(s).toContain("Country Manor House");
    expect(s).toContain("Physical Constraints:");
    expect(s).toContain("Access Control:");
  });
});

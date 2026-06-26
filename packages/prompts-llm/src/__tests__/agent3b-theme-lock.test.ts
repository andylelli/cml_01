import { describe, it, expect } from "vitest";
import {
  extractThemeMechanismFamilies,
  scoreDeviceThemeMatch,
  selectThemeCoherentPrimary,
  buildHardLogicDevicePrompt,
} from "../agent3b-hard-logic-devices.js";
import type { HardLogicDeviceIdea } from "../types.js";

// A_50 §9.3 — keep Agent 3b's PRIMARY device coherent with a theme that commits to a concrete
// mechanism (the locked-fact registry + CML are built from devices[0]). The probe
// `mystery-1782504792424` had theme = clock-tampering but a thermal-latch primary, then a
// plausibility regen swapped in a tide/drowning device — neither realized the locked clock.

const device = (over: Partial<HardLogicDeviceIdea>): HardLogicDeviceIdea => ({
  title: "Device",
  corePrinciple: "A constraint-driven contradiction.",
  principleType: "physical_law",
  surfaceIllusion: "An apparently impossible sequence.",
  underlyingReality: "A hidden but fair mechanism resolves it.",
  fairPlayClues: ["a clue"],
  whyNotTrope: "fresh",
  variationEscalation: "one more step",
  mechanismFamilyHints: [],
  ...over,
});

const clockDevice = device({
  title: "The Lying Chime",
  corePrinciple: "A grandfather clock is set so its chime sounds the true hour while the hands show a frozen time.",
  surfaceIllusion: "The clock face fixes the death at a precise minute.",
  underlyingReality: "The clockwork was tampered so the pendulum stopped while the strike train ran on.",
  mechanismFamilyHints: ["clockwork tampering", "timing contradiction"],
});

const tideDevice = device({
  title: "The Misleading Tide",
  corePrinciple: "A hidden sluice raises the water level to fake a drowning time.",
  surfaceIllusion: "The victim appears to have drowned at high tide.",
  underlyingReality: "The tidal schedule was manipulated to stage the drowning.",
  mechanismFamilyHints: ["tide manipulation"],
});

const thermalDevice = device({
  title: "The Thermal Alibi",
  corePrinciple: "A heated brass latch expands, delaying bolt release until the hearth heat peaks.",
  surfaceIllusion: "The door appears locked from inside.",
  underlyingReality: "Thermal expansion of the latch delays access.",
  mechanismFamilyHints: ["thermal expansion"],
});

describe("extractThemeMechanismFamilies", () => {
  it("detects the clock family from a clock-tampering theme", () => {
    expect(extractThemeMechanismFamilies("Golden Age murder driven by a mechanical clock-tampering method")).toEqual([
      "clock",
    ]);
  });

  it("returns [] for a theme that leaves the mechanism open (preserve novelty)", () => {
    expect(extractThemeMechanismFamilies("A country-house murder among rival heirs")).toEqual([]);
  });

  it("reads explicit mechanism-family hints too", () => {
    const fams = extractThemeMechanismFamilies("a murder", ["tidal sluice trick"]);
    expect(fams).toContain("tide");
  });

  it("does not false-match ordinary words (witness 'account', 'heat of the moment')", () => {
    expect(extractThemeMechanismFamilies("the witness gave an account in the heat of the argument")).toEqual([]);
  });
});

describe("scoreDeviceThemeMatch", () => {
  it("scores a clock device against a clock theme", () => {
    expect(scoreDeviceThemeMatch(clockDevice, ["clock"])).toBe(1);
  });
  it("scores an off-theme device 0", () => {
    expect(scoreDeviceThemeMatch(tideDevice, ["clock"])).toBe(0);
    expect(scoreDeviceThemeMatch(thermalDevice, ["clock"])).toBe(0);
  });
  it("scores 0 when there is no locked theme", () => {
    expect(scoreDeviceThemeMatch(clockDevice, [])).toBe(0);
  });
});

describe("selectThemeCoherentPrimary", () => {
  it("promotes the theme-matching device to primary", () => {
    const res = selectThemeCoherentPrimary([thermalDevice, clockDevice, tideDevice], ["clock"]);
    expect(res.devices[0].title).toBe("The Lying Chime");
    expect(res.matchedThemePrimary).toBe(true);
    expect(res.reorderedFrom).toBe(1);
    // preserves the others and never drops a device
    expect(res.devices).toHaveLength(3);
    expect(res.devices.map((d) => d.title)).toEqual([
      "The Lying Chime",
      "The Thermal Alibi",
      "The Misleading Tide",
    ]);
  });

  it("is a no-op when the theme device is already primary", () => {
    const res = selectThemeCoherentPrimary([clockDevice, tideDevice], ["clock"]);
    expect(res.devices[0].title).toBe("The Lying Chime");
    expect(res.matchedThemePrimary).toBe(true);
    expect(res.reorderedFrom).toBe(-1);
  });

  it("flags matchedThemePrimary=false (no reorder) when NO device realizes the locked theme", () => {
    const res = selectThemeCoherentPrimary([thermalDevice, tideDevice], ["clock"]);
    expect(res.matchedThemePrimary).toBe(false);
    expect(res.reorderedFrom).toBe(-1);
    expect(res.devices.map((d) => d.title)).toEqual(["The Thermal Alibi", "The Misleading Tide"]);
  });

  it("is a no-op for an open theme (full novelty preserved)", () => {
    const res = selectThemeCoherentPrimary([tideDevice, clockDevice], []);
    expect(res.devices[0].title).toBe("The Misleading Tide");
    expect(res.matchedThemePrimary).toBe(false);
  });

  it("handles an empty device list", () => {
    expect(selectThemeCoherentPrimary([], ["clock"])).toEqual({
      devices: [],
      matchedThemePrimary: false,
      reorderedFrom: -1,
    });
  });
});

describe("buildHardLogicDevicePrompt — locked-theme section", () => {
  const baseInputs = {
    runId: "r1",
    projectId: "p1",
    decade: "1940s",
    location: "a seaside hotel",
    institution: "hotel",
    tone: "Classic",
    primaryAxis: "temporal" as const,
  };

  it("injects the PRIMARY-device constraint when the theme commits to a mechanism", () => {
    const { developer } = buildHardLogicDevicePrompt({
      ...baseInputs,
      theme: "a mechanical clock-tampering murder",
    });
    expect(developer).toContain("LOCKED THEME — PRIMARY DEVICE CONSTRAINT");
    expect(developer).toContain("PRIMARY device (devices[0]) MUST realize this mechanism family");
    expect(developer).toContain("clock");
  });

  it("omits the locked-theme section for an open theme", () => {
    const { developer } = buildHardLogicDevicePrompt({
      ...baseInputs,
      theme: "a country-house murder among rival heirs",
    });
    expect(developer).not.toContain("LOCKED THEME — PRIMARY DEVICE CONSTRAINT");
  });
});

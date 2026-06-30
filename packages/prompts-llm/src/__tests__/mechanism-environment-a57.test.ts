import { describe, expect, it } from "vitest";
import {
  checkMechanismEnvironmentConsistency,
  deriveMechanismEnvironmentPrecondition,
} from "../mechanism-environment.js";

// A_57 D3 — mechanism–environment consistency. A sundial (solar) mechanism needs CLEAR SKIES; run
// 09168377's setting was winter OVERCAST/drizzle. The check must catch that conflict generically (by
// mechanism family, never by a specific weather), and must NOT invent conflicts that aren't there.

// The real run-09168377 hard-logic device (verbatim-ish from the stored artifact).
const sundialDevice = {
  title: "The Garden Sundial Alibi",
  corePrinciple:
    "The sundial's shadow length and direction, combined with known solar azimuth and elevation angles for the date, temporally contradict the supposed murder time.",
  principleType: "physical_law",
  surfaceIllusion:
    "The victim was declared murdered shortly before sunset; the sundial's shadow on the watch face aligned with a much earlier hour.",
  underlyingReality:
    "The sundial's shadow length and angle can be precisely calculated using solar geometry for the given day and location.",
  fairPlayClues: ["The sundial's gnomon is intact and precisely angled", "Weather logs confirm clear skies that day"],
  mechanismFamilyHints: ["schedule contradiction", "timing window trap"],
};

describe("deriveMechanismEnvironmentPrecondition (A_57 D3)", () => {
  it("derives a SUNLIGHT precondition from the real sundial device", () => {
    const pre = deriveMechanismEnvironmentPrecondition(sundialDevice);
    expect(pre).not.toBeNull();
    expect(pre!.factor).toBe("sunlight");
  });

  it("returns null for a device with no environmental dependency (a social/ledger mechanism)", () => {
    expect(
      deriveMechanismEnvironmentPrecondition({
        title: "The Forged Ledger",
        corePrinciple: "A double-entry bookkeeping inconsistency reveals a backdated transaction.",
        surfaceIllusion: "The accounts appeared to balance.",
        underlyingReality: "The ink and paper dating prove the entry was added later.",
        mechanismFamilyHints: ["document forgery"],
      }),
    ).toBeNull();
  });

  it("derives a NIGHT_SKY precondition for an astronomical mechanism", () => {
    const pre = deriveMechanismEnvironmentPrecondition({
      title: "The Constellation Alibi",
      corePrinciple: "The position of a named constellation fixes the true hour of the crime.",
      mechanismFamilyHints: ["astronomical timing"],
    });
    expect(pre?.factor).toBe("night_sky");
  });
});

describe("checkMechanismEnvironmentConsistency (A_57 D3)", () => {
  it("FLAGS the real run conflict: sundial needs sun, setting is overcast/drizzle", () => {
    const result = checkMechanismEnvironmentConsistency(sundialDevice, {
      weather: "Overcast skies with intermittent light rain, typical of English countryside",
      timeOfDay: "Early evening, just after dinner hour",
      season: "winter",
    });
    expect(result.precondition?.factor).toBe("sunlight");
    expect(result.conflict).toBe(true);
    expect(result.conflictTerm?.toLowerCase()).toMatch(/overcast|cloud|rain/);
    expect(result.repairInstruction).toContain("MECHANISM–ENVIRONMENT EXCEPTION");
    expect(result.repairInstruction).toContain("brief");
  });

  it("does NOT flag when the sundial mechanism has compatible CLEAR weather", () => {
    const result = checkMechanismEnvironmentConsistency(sundialDevice, {
      weather: "Bright, clear winter afternoon with low sun and sharp shadows",
      season: "winter",
    });
    expect(result.precondition?.factor).toBe("sunlight");
    expect(result.conflict).toBe(false);
    expect(result.repairInstruction).toBeUndefined();
  });

  it("does NOT flag a device with no environmental dependency, whatever the weather", () => {
    const result = checkMechanismEnvironmentConsistency(
      { title: "The Forged Ledger", corePrinciple: "A bookkeeping inconsistency reveals a backdated transaction." },
      { weather: "Overcast skies with heavy rain", season: "autumn" },
    );
    expect(result.precondition).toBeNull();
    expect(result.conflict).toBe(false);
  });

  it("is null-safe for missing device or atmosphere", () => {
    expect(checkMechanismEnvironmentConsistency(null, null).conflict).toBe(false);
    expect(checkMechanismEnvironmentConsistency(sundialDevice, null).conflict).toBe(false);
    expect(checkMechanismEnvironmentConsistency(undefined, { weather: "overcast" }).conflict).toBe(false);
  });
});

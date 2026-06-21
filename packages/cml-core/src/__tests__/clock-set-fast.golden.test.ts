import { describe, expect, it } from "vitest";
import { certify } from "../certify.js";
import { checkDeducibility } from "../engines/deducibility.js";
import { checkUniqueness } from "../engines/uniqueness.js";
import { checkTimeline } from "../engines/timeline.js";
import { clockSetFastBroken, clockSetFastRepaired } from "../fixtures/clock-set-fast.js";

const sorted = (xs: string[]) => [...xs].sort();

/**
 * The canonical golden: the §4.6 worked example is the executable spec of the whole thesis.
 * BROKEN must reproduce `SOLUTION_NOT_UNIQUE: {Carrow, Vale}` with the "boarded ≠ departed"
 * diagnosis; REPAIRED (station-master fact added) must flip to UNIQUE {Carrow}.
 */
describe("§4.6 clock-set-fast — BROKEN (the case the current system would ship)", () => {
  const cml = clockSetFastBroken();

  it("timeline is consistent (the bug is not a timeline bug)", () => {
    expect(checkTimeline(cml).consistent).toBe(true);
  });

  it("uniqueness reports SOLUTION_NOT_UNIQUE {Carrow, Vale}", () => {
    const u = checkUniqueness(cml);
    expect(u.unique).toBe(false);
    expect(sorted(u.possibleSuspects)).toEqual(["carrow", "vale"]);
    expect(u.diagnosis).toMatch(/SOLUTION_NOT_UNIQUE/);
    expect(u.diagnosis).toMatch(/vale/);
  });

  it("deducibility flags Step 3's elimination of Vale as UNSOUND", () => {
    const d = checkDeducibility(cml);
    expect(d.sound).toBe(false);
    expect(d.issues.some((i) => /step 3/i.test(i) && /vale/i.test(i) && /unsound/i.test(i))).toBe(true);
  });

  it("the certificate is NOT ok, and says why", () => {
    const cert = certify(cml);
    expect(cert.ok).toBe(false);
    expect(cert.unique).toBe(false);
    expect(cert.failures.some((f) => /SOLUTION_NOT_UNIQUE/.test(f))).toBe(true);
  });
});

describe("§4.6 clock-set-fast — REPAIRED (station-master fact added)", () => {
  const cml = clockSetFastRepaired();

  it("uniqueness flips to UNIQUE {Carrow}", () => {
    const u = checkUniqueness(cml);
    expect(u.unique).toBe(true);
    expect(u.possibleSuspects).toEqual(["carrow"]);
    expect(u.diagnosis).toBeUndefined();
  });

  it("deducibility is sound and reaches the named culprit", () => {
    const d = checkDeducibility(cml);
    expect(d.sound).toBe(true);
    expect(d.reachesCulprit).toBe(true);
    expect(d.issues).toEqual([]);
  });

  it("the certificate is ok with no failures", () => {
    const cert = certify(cml);
    expect(cert.ok).toBe(true);
    expect(cert.timelineConsistent).toBe(true);
    expect(cert.deducible).toBe(true);
    expect(cert.unique).toBe(true);
    expect(cert.uniqueAmong).toEqual(["carrow"]);
    expect(cert.failures).toEqual([]);
  });

  it("THE THESIS IN ONE ASSERTION: adding the discriminating fact flips the verdict", () => {
    expect(certify(clockSetFastBroken()).ok).toBe(false);
    expect(certify(clockSetFastRepaired()).ok).toBe(true);
  });
});

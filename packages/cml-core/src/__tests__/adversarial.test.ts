import { describe, expect, it } from "vitest";
import { certify } from "../certify.js";
import { checkDeducibility } from "../engines/deducibility.js";
import { checkUniqueness } from "../engines/uniqueness.js";
import { clockSetFastRepaired } from "../fixtures/clock-set-fast.js";

/**
 * The battery the checker MUST reject — each with the exact location/diagnosis (§9.4).
 * These are precisely the failure modes the current pipeline ships blind (§3).
 */
describe("adversarial corpus — cases the checker must reject", () => {
  it("IMPOSSIBLE_CULPRIT: the named culprit is themselves eliminated by the clues", () => {
    const cml = clockSetFastRepaired();
    cml.solution.culpritId = "vale"; // but Vale is eliminated in the repaired clue set
    const u = checkUniqueness(cml);
    expect(u.unique).toBe(false);
    expect(u.diagnosis).toMatch(/IMPOSSIBLE_CULPRIT/);
    expect(certify(cml).ok).toBe(false);
  });

  it("SILENT CULPRIT SWAP (the fallbackCulprit failure): the path convicts A but culprit=B", () => {
    const cml = clockSetFastRepaired();
    // The inference path eliminates Hartwell and Vale, singling out Carrow — but the named
    // culprit is Hartwell. Today's normalizeCml would let this pass schema-clean; the checker
    // must not.
    cml.solution.culpritId = "hartwell";
    const d = checkDeducibility(cml);
    expect(d.reachesCulprit).toBe(false);
    expect(d.issues.some((i) => /survivors/i.test(i) && /hartwell/i.test(i))).toBe(true);
    expect(certify(cml).ok).toBe(false);
  });

  it("NO_POSSIBLE_CULPRIT: every suspect is eliminated, so no one could have done it", () => {
    const cml = clockSetFastRepaired();
    // Give Carrow a covering precluding alibi too (off-premises across the whole window).
    cml.clues.push({
      kind: "presence",
      id: "clue_carrow_away",
      person: "carrow",
      location: "away",
      interval: { start: 480, end: 492 },
      availableByStep: 1,
      worded: "A neighbour saw Mrs. Carrow in the village across the whole window.",
    });
    const u = checkUniqueness(cml);
    expect(u.unique).toBe(false);
    expect(u.possibleSuspects).toEqual([]);
    expect(u.diagnosis).toMatch(/NO_POSSIBLE_CULPRIT/);
    expect(certify(cml).ok).toBe(false);
  });

  it("an independent re-run of the engines agrees the repaired golden is clean (no self-agreement bug)", () => {
    // The certificate's verdict must be reproducible by calling the engines directly.
    const cml = clockSetFastRepaired();
    const cert = certify(cml);
    const u = checkUniqueness(cml);
    const d = checkDeducibility(cml);
    expect(cert.ok).toBe(u.unique && d.sound && d.reachesCulprit);
    expect(cert.ok).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { splitMeansLinkTrace } from "../prose-contract/means-link-trace.js";


// A_107 — the confrontation must connect the culprit to the weapon. On the 86-read book the only
// reveal-time sentence doing so was item eight of a proof list in the chapter AFTER the confession.
describe("splitMeansLinkTrace", () => {
  it("splits seed 18179's trace into weapon, finding and culprit", () => {
    expect(splitMeansLinkTrace("birdwatcher's knife: fresh handling marks and smudges found in barn — Gerald Thorne")).toEqual({
      weapon: "birdwatcher's knife",
      finding: "fresh handling marks and smudges found in barn",
      culprit: "Gerald Thorne",
    });
  });

  it("lower-cases a capitalised weapon and drops a 'by' before the name", () => {
    expect(splitMeansLinkTrace("Silver letter opener: scratch on handle found in garden shed — by Percival Thorne")).toEqual({
      weapon: "silver letter opener",
      finding: "scratch on handle found in garden shed",
      culprit: "Percival Thorne",
    });
  });

  it("returns undefined when the trace is absent or not in the weapon-first shape", () => {
    expect(splitMeansLinkTrace(undefined)).toBeUndefined();
    expect(splitMeansLinkTrace("Fingerprints on dagger trace to Gwendolyn")).toBeUndefined();
    expect(splitMeansLinkTrace("knife: no dash here")).toBeUndefined();
  });
});


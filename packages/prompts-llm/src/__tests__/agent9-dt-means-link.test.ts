import { describe, expect, it } from "vitest";
import { buildNameAndReasonLines, splitMeansLinkTrace } from "../agent9-prose/discriminating.ts";

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

// A_107 — seed 18179: after the injector line and chapter 9's list were removed, no sentence in the
// book named the killer. The confrontation carries v2's reveal operation.
describe("buildNameAndReasonLines", () => {
  const cmlCase = {
    culpability: { culprits: ["Gerald Thorne"] },
    cast: [
      { name: "Dr. Ivor Jardine", role_archetype: "victim" },
      { name: "Gerald Thorne", role_archetype: "Steward" },
    ],
  };

  it("names the culprit, a verb of killing and the victim in one required sentence, then the reason", () => {
    const text = buildNameAndReasonLines(cmlCase);
    expect(text).toContain("states as settled fact that Gerald Thorne killed Dr. Ivor Jardine");
    expect(text).toContain("what Gerald Thorne says is the reason");
  });

  it("is empty when the case names no culprit", () => {
    expect(buildNameAndReasonLines({ culpability: { culprits: [] }, cast: [] })).toBe("");
  });
});


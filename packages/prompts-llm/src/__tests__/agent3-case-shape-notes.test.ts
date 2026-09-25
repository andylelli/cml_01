/**
 * 17-hitting-90 P3.1 / P3.2 — known positives first: the seed 23403 case, which two readers stopped
 * on, and the shapes the prompt now asks for.
 */
import { describe, expect, it } from "vitest";

import { actWindowNote, actWindowOf, deathMethodWoundSiteNote } from "../agent3-case-shape-notes.js";

describe("P3.1 — the fatal wound where it kills", () => {
  it("KNOWN-POSITIVE: seed 23403's death_method names a foil and no place on the body", () => {
    expect(deathMethodWoundSiteNote("stabbed with a fencing foil")).toMatch(/no place on the body/);
  });
  it("a wound with a killing site carries no note", () => {
    expect(deathMethodWoundSiteNote("stabbed with a fencing foil, to the chest")).toBeUndefined();
    expect(deathMethodWoundSiteNote("struck on the skull with a fire iron")).toBeUndefined();
    expect(deathMethodWoundSiteNote("shot through the heart")).toBeUndefined();
  });
  it("a death that is not a wound is not asked for a site", () => {
    expect(deathMethodWoundSiteNote("poisoned with arsenic in the cocoa")).toBeUndefined();
    expect(deathMethodWoundSiteNote("strangled with a curtain cord")).toBeUndefined();
    expect(deathMethodWoundSiteNote("")).toBeUndefined();
  });
});

describe("P3.2 — the opportunity as a window with two ends", () => {
  const withWindow = {
    constraint_space: {
      time: {
        windows: ["Two fifty to three twenty five — Hector Gaunt's alibi", "Twenty minutes past three to half past three — murder entry and act duration"],
      },
    },
  };
  it("KNOWN-POSITIVE: seed 23403 states its act window and carries no note", () => {
    expect(actWindowOf(withWindow)).toMatch(/murder entry/);
    expect(actWindowNote(withWindow)).toBeUndefined();
  });
  it("alibi windows alone are not the act's window", () => {
    const alibisOnly = { constraint_space: { time: { windows: ["Alibi for Captain Hale: 8:20 to 8:50 veranda lounge"] } } };
    expect(actWindowOf(alibisOnly)).toBeUndefined();
    expect(actWindowNote(alibisOnly)).toMatch(/no window about the act/);
  });
  it("KNOWN-POSITIVE from the harness: 'earliest to latest time victim could be killed' is the act's window", () => {
    const h = { constraint_space: { time: { windows: ["9:10 to 9:30 — earliest to latest time victim could be killed", "9:00 to 9:30 in barn — Gerald Thorne's alibi"] } } };
    expect(actWindowOf(h)).toMatch(/could be killed/);
    expect(actWindowNote(h)).toBeUndefined();
  });

  it("a window about the act with one end is not a window", () => {
    expect(actWindowOf({ constraint_space: { time: { windows: ["the murder at half past three"] } } })).toBeUndefined();
  });
});

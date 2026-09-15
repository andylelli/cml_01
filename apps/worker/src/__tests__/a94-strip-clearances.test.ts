/**
 * A_94 — Agent 7 put the alibi walk-back AFTER the discriminating test in 15 of 50 stored outlines,
 * against its own prompt. Pinned on run 31372's final scene, verbatim from the stored outline.
 */
import { afterEach, describe, expect, it } from "vitest";

import { isStripClearancesEnabled, stripClearancesFromFinalScene } from "../jobs/agents/agent7-run.js";

const prev = process.env.AGENT7_STRIP_CLEARANCES_FROM_REVEAL;
afterEach(() => {
  if (prev === undefined) delete process.env.AGENT7_STRIP_CLEARANCES_FROM_REVEAL;
  else process.env.AGENT7_STRIP_CLEARANCES_FROM_REVEAL = prev;
});

const outline31372 = () => ({
  acts: [
    { scenes: [{ title: "Discovery", purpose: "Introduce the crime and detective; establish suspects" }] },
    { scenes: [{ title: "Alibis Under Scrutiny", purpose: "Establish alibis for suspects and eliminate them based on timing and location" }] },
    {
      scenes: [
        {
          title: "The Discriminating Test",
          purpose: "Execute the spatial illusion test to prove the alley's false continuity and expose the culprit's escape route",
        },
        {
          title: "Clearances and Culprit Revealed",
          purpose: "Confirm alibis of all suspects except the culprit; confront Adela Sallow with evidence and reveal her guilt",
          summary:
            "Rosalind systematically confirms the alibis of Prudence Danvers, Barnaby Blackwood, Marguerite Greaves, and " +
            "Henrietta Tremayne, clearing them of suspicion. She then confronts Adela Sallow, revealing the manipulated " +
            "time of death and her access to the mirror mechanism, exposing her as the murderer.",
        },
      ],
    },
  ],
});

describe("stripClearancesFromFinalScene — run 31372's own final scene", () => {
  it("flag defaults OFF", () => {
    delete process.env.AGENT7_STRIP_CLEARANCES_FROM_REVEAL;
    expect(isStripClearancesEnabled()).toBe(false);
  });

  it("drops the clearance clause and sentence, keeps the reveal half, retitles", () => {
    const n = outline31372();
    const { stripped } = stripClearancesFromFinalScene(n);
    const last = n.acts[2]!.scenes[1]!;
    expect(last.purpose).toBe("Confront Adela Sallow with evidence and reveal her guilt");
    expect(last.summary).toMatch(/^She then confronts Adela Sallow/);
    expect(last.summary).not.toMatch(/alibi|clearing/i);
    expect(last.title).toBe("Culprit Revealed");
    expect(stripped).toHaveLength(3);
  });

  it("the earlier alibi scene — where clearing belongs — is untouched", () => {
    const n = outline31372();
    stripClearancesFromFinalScene(n);
    expect(n.acts[1]!.scenes[0]!.purpose).toMatch(/Establish alibis/);
  });

  it("a final scene that is ONLY clearances is left alone rather than emptied", () => {
    const n = { acts: [{ scenes: [{ title: "Clearing", purpose: "Confirm every alibi and clear the innocent" }] }] };
    const { stripped } = stripClearancesFromFinalScene(n);
    expect(stripped).toEqual([]);
    expect(n.acts[0]!.scenes[0]!.purpose).toBe("Confirm every alibi and clear the innocent");
  });

  it("'clearly' is not a clearance", () => {
    const n = { acts: [{ scenes: [{ title: "The End", purpose: "Rosalind clearly names the culprit; the household absorbs it" }] }] };
    const { stripped } = stripClearancesFromFinalScene(n);
    expect(stripped).toEqual([]);
  });

  it("no acts, no crash", () => {
    expect(stripClearancesFromFinalScene(null)).toEqual({ stripped: [] });
    expect(stripClearancesFromFinalScene({ acts: [] })).toEqual({ stripped: [] });
  });
});

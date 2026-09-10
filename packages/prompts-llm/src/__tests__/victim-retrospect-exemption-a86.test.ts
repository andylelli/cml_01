/**
 * A_86 item 12 — `AGENT9_VICTIM_RETROSPECT_EXEMPTION`.
 *
 * VICTIM ALIVE was the largest single prose-retry class in the last four runs (3 of 12), and two of
 * the three sentences were ordinary past-tense characterisation of a dead person. Each bought a
 * ~30k-token regeneration for correct prose. The three fixtures below are the REAL sentences, taken
 * from the retry records of runs 24901 and 22362.
 */

import { afterEach, describe, expect, it } from "vitest";
import {
  detectVictimAlive,
  isVictimRetrospectExemptionEnabled,
  isVictimRetrospectSentence,
} from "../agent9-prose/generate.js";

const withEnv = (value: string | undefined, fn: () => void) => {
  const prior = process.env.AGENT9_VICTIM_RETROSPECT_EXEMPTION;
  if (value === undefined) delete process.env.AGENT9_VICTIM_RETROSPECT_EXEMPTION;
  else process.env.AGENT9_VICTIM_RETROSPECT_EXEMPTION = value;
  try { fn(); } finally {
    if (prior === undefined) delete process.env.AGENT9_VICTIM_RETROSPECT_EXEMPTION;
    else process.env.AGENT9_VICTIM_RETROSPECT_EXEMPTION = prior;
  }
};
afterEach(() => { delete process.env.AGENT9_VICTIM_RETROSPECT_EXEMPTION; });

// Verbatim from the retry records.
const RESURRECTION = { victim: "Iris Thorne", text: `"It’s strange," Iris Thorne said, her voice barely above a whisper.` };
const CHARACTERISATION_A = { victim: "Marguerite Selwyn", text: "And yet, Marguerite Selwyn was nothing if not precise." };
const CHARACTERISATION_B = {
  victim: "Adela Ashgrove",
  text: "Adela Ashgrove insisted on cross-checking every delivery against the tide clock and the pier’s table.",
};

const fires = (c: { victim: string; text: string }) => detectVictimAlive({ paragraphs: [c.text] }, c.victim).length > 0;

describe("AGENT9_VICTIM_RETROSPECT_EXEMPTION — the three real retry sentences", () => {
  it("flag OFF: all three fire, including the two that are correct prose (the defect, pinned)", () => {
    withEnv(undefined, () => {
      expect(isVictimRetrospectExemptionEnabled()).toBe(false);
      expect(fires(RESURRECTION)).toBe(true);
      expect(fires(CHARACTERISATION_A)).toBe(true);
      expect(fires(CHARACTERISATION_B)).toBe(true);
    });
  });

  it("flag ON: the quoted-speech resurrection STILL fires", () => {
    withEnv("true", () => {
      expect(isVictimRetrospectExemptionEnabled()).toBe(true);
      expect(fires(RESURRECTION)).toBe(true);
    });
  });

  it("flag ON: both characterisation sentences are exempt", () => {
    withEnv("true", () => {
      expect(fires(CHARACTERISATION_A)).toBe(false);
      expect(fires(CHARACTERISATION_B)).toBe(false);
    });
  });

  it("quoted speech defeats the exemption even with a retrospect marker — the discriminator", () => {
    expect(isVictimRetrospectSentence(CHARACTERISATION_A.text)).toBe(true);
    expect(isVictimRetrospectSentence(`"I always check the ledger," Adela Ashgrove said.`)).toBe(false);
    withEnv("true", () => {
      expect(
        fires({ victim: "Adela Ashgrove", text: `"I always check the ledger," Adela Ashgrove said, turning.` }),
      ).toBe(true);
    });
  });

  it("flag ON: a plain on-page action with no retrospect marker still fires", () => {
    withEnv("true", () => {
      expect(fires({ victim: "Adela Ashgrove", text: "Adela Ashgrove stood and crossed to the window." })).toBe(true);
    });
  });

  it("env is read at call time", () => {
    withEnv(undefined, () => expect(fires(CHARACTERISATION_A)).toBe(true));
    withEnv("1", () => expect(fires(CHARACTERISATION_A)).toBe(false));
    withEnv("off", () => expect(fires(CHARACTERISATION_A)).toBe(true));
  });
});

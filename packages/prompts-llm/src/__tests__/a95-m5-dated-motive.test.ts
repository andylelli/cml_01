/**
 * A_95 M5 — the dated motive.
 *
 * "The motive is still too broad — make it specific" appears in 7 of 15 reviewer texts. A_93
 * measured why it never arrives: 0 of ~4,700 stored character-profile field values carry a date, and
 * the one lever that asked for a dated event (`AGENT2_SHARED_HISTORY_EVENT`) moved its field from
 * 0% to 37% over 850 records. This is that instruction shape, applied to the culprit's motive.
 */
import { afterEach, describe, expect, it } from "vitest";

import { buildCMLPrompt } from "../agent3-cml.js";
import { isDatedMotiveEnabled } from "../agent3-cml.js";

const prev = process.env.AGENT3_DATED_MOTIVE;
afterEach(() => {
  if (prev === undefined) delete process.env.AGENT3_DATED_MOTIVE;
  else process.env.AGENT3_DATED_MOTIVE = prev;
});

const inputs = {
  runId: "a95-m5",
  projectId: "a95",
  decade: "1930s",
  location: "Country manor",
  institution: "Private residence",
  weather: "Rain",
  socialStructure: "Aristocracy",
  tone: "Classic",
  castSize: 5,
  castNames: ["Edith Penhale", "Agatha Innes", "Violet Radcliffe", "Millicent Ashcombe", "Leonard Nettleship"],
  detectiveType: "private",
  victimArchetype: "patriarch",
  primaryAxis: "authority",
  complexityLevel: "moderate",
  mechanismFamilies: ["timing"],
  hardLogicModes: ["clockwork"],
  difficultyMode: "standard",
} as any;

const promptOf = (): string => {
  const p = buildCMLPrompt(inputs) as any;
  return [p?.developer, p?.system, p?.user].filter(Boolean).join(" ") || JSON.stringify(p);
};

describe("the flag defaults OFF", () => {
  it("is off unless .env says so", () => {
    delete process.env.AGENT3_DATED_MOTIVE;
    expect(isDatedMotiveEnabled()).toBe(false);
  });

  it("OFF: the motive line is the one that has always been there", () => {
    delete process.env.AGENT3_DATED_MOTIVE;
    const p = promptOf();
    expect(p).toContain("the culprit's motive must be specific and human");
    expect(p).not.toContain("ONE DATED ACT");
  });
});

describe("ON: three countable things, not a request for depth", () => {
  it("asks for the act, the date and why it was fatal now", () => {
    process.env.AGENT3_DATED_MOTIVE = "true";
    const p = promptOf();
    expect(p).toContain("ONE DATED ACT");
    expect(p).toContain("WHAT THE VICTIM DID");
    expect(p).toContain("WHEN, as a date or an interval");
    expect(p).toContain("WHY IT WAS FATAL NOW");
  });

  it("names the standing-condition trap the reader keeps flagging", () => {
    process.env.AGENT3_DATED_MOTIVE = "true";
    expect(promptOf()).toContain("A standing condition is not a motive");
  });

  it("carries the precedent's measurement, so the instruction says why it is shaped this way", () => {
    process.env.AGENT3_DATED_MOTIVE = "true";
    expect(promptOf()).toContain("0% to 37%");
  });

  it("no worked example a model could lift into the case (A_67)", () => {
    process.env.AGENT3_DATED_MOTIVE = "true";
    const p = promptOf();
    for (const leak of ["Adela", "Edmund", "theatre reputation", "Percival", "carting"]) {
      expect(p).not.toContain(leak);
    }
  });
});

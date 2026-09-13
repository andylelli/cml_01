import { describe, expect, it } from "vitest";

import {
  buildDepthBeatLines,
  buildWitBeatLines,
  isDepthBeatEnabled,
  isWitBeatEnabled,
  selectDepthBeat,
  selectWitBeat,
} from "../agent9-prose/obligation-block.js";
import { HUMOUR_STYLES } from "../agent9-prose/prompt-blocks.js";

/**
 * A_91 — wit and depth as per-chapter OPERATIONS.
 *
 * MEASURED across the last three books: 16 of 17 characters carry a humour style and a level above
 * zero, and a whole book contains 3 to 5 understatement markers while 6 of 17 signature tics appear
 * at all. The data was never the gap; the shape of the ask was. The guide asks for a RATE, and this
 * model complies with countable operations and ignores statistics (VoiceSpec: asked for 22.0-word
 * sentences, got 15.86, in 0 of 10 chapters).
 */
const cast = [
  { name: "Percival Thorne", humourStyle: "dry_wit", humourLevel: 0.5, formativeIncident: "Walked with a stoop ever since a carting accident at nine." },
  { name: "Beatrice Whitlock", humourStyle: "none", humourLevel: 0, formativeIncident: "Lost the family mill in 1921 and has never said so aloud." },
  { name: "Ottoline Dunmore", humourStyle: "polite_savagery", humourLevel: 0.6 },
  { name: "Josephine Rutherford", humourStyle: "deadpan", humourLevel: 0.4, formativeIncident: "Left school at twelve to keep the lock gates." },
];

describe("selectWitBeat / selectDepthBeat — deterministic, one per chapter", () => {
  it("only characters the profile made funny are eligible", () => {
    const picks = [1, 2, 3, 4, 5, 6].map((n) => selectWitBeat(cast, n)?.name);
    expect(picks).not.toContain("Beatrice Whitlock");
    expect(new Set(picks).size).toBe(3);
  });

  it("only characters with a formative incident carry the depth beat", () => {
    const picks = [1, 2, 3, 4, 5, 6].map((n) => selectDepthBeat(cast, n)?.name);
    expect(picks).not.toContain("Ottoline Dunmore");
    expect(new Set(picks).size).toBe(3);
  });

  it("the same chapter always draws the same pair, so a retry reproduces itself", () => {
    for (const n of [1, 4, 7, 10]) {
      expect(selectWitBeat(cast, n)?.name).toBe(selectWitBeat(cast, n)?.name);
      expect(selectDepthBeat(cast, n)?.name).toBe(selectDepthBeat(cast, n)?.name);
    }
    expect(selectWitBeat(cast, 1)?.name).toBe("Percival Thorne");
  });

  it("the two beats rarely land on the same character", () => {
    let collisions = 0;
    for (let n = 1; n <= 10; n += 1) {
      const w = selectWitBeat(cast, n)?.name;
      const d = selectDepthBeat(cast, n)?.name;
      if (w && d && w === d) collisions += 1;
    }
    expect(collisions).toBeLessThanOrEqual(4);
  });

  it("an empty or humourless cast yields no beat, and the block stays silent", () => {
    expect(selectWitBeat([], 1)).toBeUndefined();
    expect(selectWitBeat([{ name: "X", humourStyle: "none", humourLevel: 0 }], 1)).toBeUndefined();
    expect(buildWitBeatLines(undefined, HUMOUR_STYLES)).toEqual([]);
    expect(buildDepthBeatLines(undefined)).toEqual([]);
  });
});

describe("the beats are countable operations, not rates", () => {
  it("the wit beat names the character, the style, its definition, and the three forbidden places", () => {
    const lines = buildWitBeatLines(selectWitBeat(cast, 1), HUMOUR_STYLES).join("\n");
    expect(lines).toContain("Percival Thorne");
    expect(lines).toContain("exactly one remark");
    expect(lines).toContain("dry wit");
    expect(lines).toContain(HUMOUR_STYLES.dry_wit);
    expect(lines).toContain("no other character is funny in this chapter");
    expect(lines).toContain("SKIP the beat entirely rather than force it");
    // never a rate
    expect(lines).not.toMatch(/every \d|per \d|\d%/);
  });

  it("the depth beat shows the trait and forbids explaining it in the same breath", () => {
    const beat = selectDepthBeat(cast, 1);
    const lines = buildDepthBeatLines(beat).join("\n");
    expect(lines).toContain(beat!.name.toUpperCase());
    expect(lines).toContain("shown once and not explained");
    expect(lines).toContain("Do NOT narrate the cause in the same paragraph");
    expect(lines).toContain("ONE line of their own dialogue");
    expect(lines).toContain("never to explain their behaviour");
  });
});

describe("flags are read at call time", () => {
  it("both default off", () => {
    const saved = [process.env.AGENT9_WIT_BEAT, process.env.AGENT9_DEPTH_BEAT];
    try {
      delete process.env.AGENT9_WIT_BEAT;
      delete process.env.AGENT9_DEPTH_BEAT;
      expect(isWitBeatEnabled()).toBe(false);
      expect(isDepthBeatEnabled()).toBe(false);
      process.env.AGENT9_WIT_BEAT = "true";
      process.env.AGENT9_DEPTH_BEAT = "1";
      expect(isWitBeatEnabled()).toBe(true);
      expect(isDepthBeatEnabled()).toBe(true);
    } finally {
      if (saved[0] === undefined) delete process.env.AGENT9_WIT_BEAT; else process.env.AGENT9_WIT_BEAT = saved[0];
      if (saved[1] === undefined) delete process.env.AGENT9_DEPTH_BEAT; else process.env.AGENT9_DEPTH_BEAT = saved[1];
    }
  });
});

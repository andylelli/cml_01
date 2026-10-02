import { describe, expect, it } from "vitest";
import { selectDepthBeat, selectWitBeat } from "../prose-contract/beats.js";


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
});

/**
 * Owner decision 12 (CML_VERIFIED_FIXES) — A6-D07: T2.1's culprit-guess match no longer confuses two cast
 * members who share a surname. OFF: `namesMatch` (exact, or the same surname).
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { evaluateRevealVerdict, guessNamesCulprit } from "../jobs/agents/agent6-reveal-gate.js";

const FLAG = "CML_VERIFIED_FIXES";
let saved: string | undefined;
beforeEach(() => { saved = process.env[FLAG]; });
afterEach(() => { if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved; });
const setFlag = (on: boolean) => { if (on) process.env[FLAG] = "1"; else delete process.env[FLAG]; };

const CAST = ["John Carter", "Mary Carter", "Edith Vane"];

describe("A6-D07 — T2.1 and shared surnames", () => {
  it("flag OFF: guessing the culprit's sister is read as naming the culprit (today's false positive)", () => {
    setFlag(false);
    const v = evaluateRevealVerdict({ earlyMidGuess: "Mary Carter", culprit: "John Carter", castNames: CAST });
    expect(v.verdict).toBe("too_obvious");
  });

  it("flag ON: the sister is not the culprit; the gate passes", () => {
    setFlag(true);
    const v = evaluateRevealVerdict({ earlyMidGuess: "Mary Carter", culprit: "John Carter", castNames: CAST });
    expect(v.verdict).toBe("pass");
  });

  it("flag ON: the full name still matches, with or without an honorific", () => {
    setFlag(true);
    expect(guessNamesCulprit("john carter", "John Carter", CAST)).toBe(true);
    expect(guessNamesCulprit("Dr. John Carter", "John Carter", CAST)).toBe(true);
  });

  it("flag ON: a bare shared surname is ambiguous and does not match", () => {
    setFlag(true);
    expect(guessNamesCulprit("Carter", "John Carter", CAST)).toBe(false);
  });

  it("flag ON: a surname shared with nobody else still matches by surname", () => {
    setFlag(true);
    expect(guessNamesCulprit("Mrs Vane", "Edith Vane", CAST)).toBe(true);
    expect(guessNamesCulprit("Vane", "Edith Vane", CAST)).toBe(true);
  });

  it("flag ON: the culprit's own entry with an honorific is not 'another' member", () => {
    setFlag(true);
    expect(guessNamesCulprit("Carter", "John Carter", ["Dr. John Carter", "Edith Vane"])).toBe(true);
  });

  it("flag ON without a cast list: the OFF rule stands (nothing to disambiguate against)", () => {
    setFlag(true);
    expect(guessNamesCulprit("Mary Carter", "John Carter")).toBe(true);
    expect(evaluateRevealVerdict({ earlyMidGuess: "Dr. Carter", culprit: "Carter" }).verdict).toBe("too_obvious");
  });
});

/**
 * ORC-13 — four copies of `simpleHash` became one shared function plus one named variant.
 *
 * The removed bodies are pinned below VERBATIM (agent2-cast.ts and utils/name-generator.ts, pre-ORC-13), so
 * this test proves the replacement computes the same function, not just that it compiles:
 *   - agent2-cast / name-generator copies  == shared `simpleHash` for every string (10,000 random + edge cases).
 *     They differ only on a non-string (no coercion → TypeError on undefined), which neither call site can
 *     pass: `inputs.runId || inputs.projectId || ""` and `runId || 'default'`.
 *   - agent1-setting's copy is a DIFFERENT function (`>>> 0`, not Math.abs) and was kept as
 *     `simpleHashUnsigned`; the test pins how it differs.
 */
import { describe, expect, it } from "vitest";
import { simpleHash } from "../shared/temporal-anchor.js";
import { simpleHashUnsigned } from "../agent1-setting.js";
import { generateCastNames } from "../utils/name-generator.js";

// --- pre-ORC-13 bodies, verbatim ---------------------------------------------------------------------
const legacyAgent2CastSimpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};
const legacyNameGeneratorSimpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32-bit integer
  }
  return Math.abs(hash);
};
/** The shared mixing loop without the final Math.abs — agent1's variant is this `>>> 0`. */
const signedHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash;
};

// --- inputs ------------------------------------------------------------------------------------------
/** mulberry32 — deterministic, so a failure reproduces. */
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) >>> 0;
  let t = seed;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const randomStrings = (n: number, seed: number): string[] => {
  const r = rng(seed);
  const out: string[] = [];
  for (let k = 0; k < n; k++) {
    const len = Math.floor(r() * 80);
    let s = "";
    for (let i = 0; i < len; i++) {
      const pick = r();
      if (pick < 0.5) s += String.fromCharCode(32 + Math.floor(r() * 95)); // printable ASCII
      else if (pick < 0.75) s += String.fromCharCode(Math.floor(r() * 0x10000)); // any UTF-16 unit, lone surrogates included
      else s += String.fromCodePoint(0x10000 + Math.floor(r() * 0xfffff)); // astral (surrogate pair)
    }
    out.push(s);
  }
  return out;
};

const EDGE_CASES = [
  "",
  "a",
  "default",
  "undefined",
  "run_e68c8118-f1d2-497a-a95a-73d7a66a4287",
  "proj_035fdeda-92e1-4613-b170-1ffba5c017a1",
  "Ünïcödé — 日本語 — 😀🕵️‍♀️",
  "\u0000￿𐏿",
  "x".repeat(100_000),
  "🕵️".repeat(20_000),
];

const INPUTS = [...EDGE_CASES, ...randomStrings(10_000, 0x0c1a13)];

describe("ORC-13 simpleHash unification", () => {
  it("covers both signs of the underlying 32-bit hash (so Math.abs vs >>> 0 is actually exercised)", () => {
    expect(INPUTS.some((s) => signedHash(s) < 0)).toBe(true);
    expect(INPUTS.some((s) => signedHash(s) > 0)).toBe(true);
  });

  it("the shared simpleHash equals the removed agent2-cast and name-generator copies on every string", () => {
    for (const s of INPUTS) {
      const shared = simpleHash(s);
      expect(shared).toBe(legacyAgent2CastSimpleHash(s));
      expect(shared).toBe(legacyNameGeneratorSimpleHash(s));
    }
  });

  it("differs from the removed copies only on undefined, which neither call site can pass", () => {
    expect(() => legacyAgent2CastSimpleHash(undefined as unknown as string)).toThrow(TypeError);
    expect(() => legacyNameGeneratorSimpleHash(undefined as unknown as string)).toThrow(TypeError);
    expect(simpleHash(undefined as unknown as string)).toBe(legacyAgent2CastSimpleHash("undefined"));
    // name-generator's call site: `runId || 'default'`
    expect(generateCastNames(undefined as unknown as string, 6)).toEqual(generateCastNames("default", 6));
    expect(generateCastNames("", 6)).toEqual(generateCastNames("default", 6));
  });

  it("agent1's simpleHashUnsigned is a different function: the same loop masked >>> 0, not Math.abs", () => {
    let disagreements = 0;
    for (const s of INPUTS) {
      const h = signedHash(s);
      expect(simpleHashUnsigned(s)).toBe(h >>> 0);
      if (h >= 0) expect(simpleHashUnsigned(s)).toBe(simpleHash(s));
      else if (simpleHashUnsigned(s) !== simpleHash(s)) disagreements++;
    }
    expect(disagreements).toBeGreaterThan(1000);
  });
});

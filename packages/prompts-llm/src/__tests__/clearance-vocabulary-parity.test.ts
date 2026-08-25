/**
 * A_73 §11.1 / §22.1 — the clearance vocabulary, pinned.
 *
 * The sweep found SEVEN bodies of this regex across five packages, no two identical, diverging in
 * the dangerous direction: the WIDE bodies (story-geometry `accept.ts`, story-validation
 * `suspect-closure-validator.ts`) judge the finished book, while the NARROW body decides whether
 * Agent 9 must REPAIR the prose. A chapter that clears a suspect in ordinary English — "Hale was in
 * the clear" — satisfies the validators, fails the Agent-9 check, spends a retry, and is then
 * overwritten by the deterministic clearance patch whose register two external reads named as the
 * top prose drag.
 *
 * The four prose-stage copies are now one definition. This test pins two things the consolidation
 * cannot enforce by itself:
 *
 *   1. the narrow vocabulary still matches exactly what it always matched (no silent widening);
 *   2. the gap between narrow and wide is EXACTLY the documented list, so the next divergence fails
 *      here instead of surfacing as a reader complaint two months later.
 */
import { describe, it, expect } from "vitest";
import {
  CLEARANCE_TERMS_RE,
  CLEARANCE_TERMS_WITH_KILLER_RE,
  CLEARANCE_EVIDENCE_RE,
  CLEARANCE_TERMS_WIDE_ONLY,
} from "../shared/clearance-vocabulary.js";

const NARROW_MATCHES = [
  "Hale was cleared by the timeline.",
  "She was ruled out entirely.",
  "He was eliminated as a suspect.",
  "Beatrice was not the culprit.",
  "Sylvia was innocent.",
  "His alibi holds.",
  "Her alibi confirmed the account.",
  "He could not have done it.",
];

describe("clearance vocabulary — the narrow (prose-stage) body", () => {
  it.each(NARROW_MATCHES)("matches %s", (sentence) => {
    expect(CLEARANCE_TERMS_RE.test(sentence)).toBe(true);
  });

  it("does NOT match the wide-only phrasings — this is the gap that fires the injector", () => {
    for (const phrase of CLEARANCE_TERMS_WIDE_ONLY) {
      expect(
        CLEARANCE_TERMS_RE.test(`Hale was ${phrase}.`),
        `"${phrase}" is now matched by the narrow vocabulary. That is a BEHAVIOUR CHANGE to ` +
          `clearance gating: it makes the Agent-9 presence check stop firing on prose it used to ` +
          `reject, which is probably desirable (A_73 §11.1) but must ship behind a flag with a run ` +
          `to measure it. Update CLEARANCE_TERMS_WIDE_ONLY deliberately, not to make this pass.`,
      ).toBe(false);
    }
  });

  it("the +killer variant differs from the base by exactly `killer`", () => {
    expect(CLEARANCE_TERMS_WITH_KILLER_RE.test("Hale was not the killer.")).toBe(true);
    expect(CLEARANCE_TERMS_RE.test("Hale was not the killer.")).toBe(false);
    // Everything the base matches, the variant matches too.
    for (const sentence of NARROW_MATCHES) {
      expect(CLEARANCE_TERMS_WITH_KILLER_RE.test(sentence)).toBe(true);
    }
  });

  it("the evidence connector gate is independent of the clearance term", () => {
    expect(CLEARANCE_TERMS_RE.test("Hale was cleared.")).toBe(true);
    expect(CLEARANCE_EVIDENCE_RE.test("Hale was cleared.")).toBe(false);
    expect(CLEARANCE_EVIDENCE_RE.test("Hale was cleared because the timeline ruled him out.")).toBe(true);
  });
});

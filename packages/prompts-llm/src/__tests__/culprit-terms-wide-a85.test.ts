/**
 * A_85 — the culprit-evidence floor fired on 4 of 4 recent books for want of vocabulary, and the
 * registry could not recognise what it wrote.
 *
 * MEASURED 2026-09-08 (scratchpad/probe-culprit-link.mjs, replaying the BUILT predicate over the four
 * most recent manuscripts with the injected sentence stripped): `culpritEvidenceLinkInText` was false
 * for every chapter of every book, and the failing column was the culprit-term one — none of
 * culprit / killer / murderer / responsible / "did it" appears anywhere in any of them. The books
 * confess with "confessed", "killed", "I did". So the floor wrote `buildCulpritEvidenceSentenceInScene`
 * into the aftermath of all four, and three consecutive external reads quoted that sentence and
 * asked for it to be deleted.
 *
 * These tests run against the REAL predicate and the REAL registry, with the flag set both ways.
 * Fixture prose is the shape the reviewers were reading, not the shape the regex was written for.
 */

import { afterEach, describe, expect, it } from "vitest";
import { culpritEvidenceLinkInText, isCulpritTermsWideEnabled } from "../agent9-prose/regen-integration.js";
import {
  INJECTED_SENTENCE_PATTERNS,
  buildCulpritEvidenceSentenceInScene,
  isInjectedSentence,
} from "../agent9-prose/injection-templates.js";

const CULPRIT = "Kenneth Gaunt";

/** A confession as the model actually writes one: no "culprit", no "killer", no "did it". */
const CONFESSION_CHAPTER =
  `Kenneth Gaunt did not sit down. "I altered the jacket on the Tuesday," he said, "because the ` +
  `will left everything to Gerald, and I could not bear it. I killed him at the sundial and put the ` +
  `ring in my pocket." The vicar's wife made a small sound. Cecil laid the tailoring notes on the ` +
  `table beside the watch, and nobody in the study looked at Kenneth again.`;

/** The same man merely SUSPECTED: named, with an evidence term, and no confession vocabulary. */
const SUSPECT_CHAPTER =
  `Kenneth Gaunt had been on the green until three, because the sewing shop closed early on festival ` +
  `days, and Harriet had seen him there. Cecil wrote the time down and said nothing about the ring.`;

const withEnv = (value: string | undefined, fn: () => void) => {
  const prior = process.env.AGENT9_CULPRIT_TERMS_WIDE;
  if (value === undefined) delete process.env.AGENT9_CULPRIT_TERMS_WIDE;
  else process.env.AGENT9_CULPRIT_TERMS_WIDE = value;
  try { fn(); } finally {
    if (prior === undefined) delete process.env.AGENT9_CULPRIT_TERMS_WIDE;
    else process.env.AGENT9_CULPRIT_TERMS_WIDE = prior;
  }
};

afterEach(() => { delete process.env.AGENT9_CULPRIT_TERMS_WIDE; });

describe("AGENT9_CULPRIT_TERMS_WIDE — the vocabulary a confession is written in", () => {
  it("flag OFF: the narrow list does not see a confession written with 'killed' / 'I altered' (the defect, pinned)", () => {
    withEnv(undefined, () => {
      expect(isCulpritTermsWideEnabled()).toBe(false);
      expect(culpritEvidenceLinkInText(CULPRIT, CONFESSION_CHAPTER)).toBe(false);
    });
  });

  it("flag ON: the same confession links", () => {
    withEnv("true", () => {
      expect(isCulpritTermsWideEnabled()).toBe(true);
      expect(culpritEvidenceLinkInText(CULPRIT, CONFESSION_CHAPTER)).toBe(true);
    });
  });

  it("flag ON: a suspect merely named beside an evidence term still does NOT link", () => {
    withEnv("true", () => {
      expect(culpritEvidenceLinkInText(CULPRIT, SUSPECT_CHAPTER)).toBe(false);
    });
  });

  it("flag ON: the narrow vocabulary is a subset — every old positive is still a positive", () => {
    const old = `Kenneth Gaunt was the killer; the evidence left no room for anyone else.`;
    withEnv(undefined, () => expect(culpritEvidenceLinkInText(CULPRIT, old)).toBe(true));
    withEnv("true", () => expect(culpritEvidenceLinkInText(CULPRIT, old)).toBe(true));
  });

  it("the name is still required with the wide list — a confession by someone else does not link the culprit", () => {
    withEnv("true", () => {
      const other = `"I killed him," said Gerald Halloway, because there was nothing else left to say.`;
      expect(culpritEvidenceLinkInText(CULPRIT, other)).toBe(false);
    });
  });

  it("env is read at call time, not module load", () => {
    withEnv(undefined, () => expect(culpritEvidenceLinkInText(CULPRIT, CONFESSION_CHAPTER)).toBe(false));
    withEnv("1", () => expect(culpritEvidenceLinkInText(CULPRIT, CONFESSION_CHAPTER)).toBe(true));
    withEnv("off", () => expect(culpritEvidenceLinkInText(CULPRIT, CONFESSION_CHAPTER)).toBe(false));
  });
});

describe("the registry recognises the in-scene sentence AS SHIPPED, not only as built", () => {
  const built = buildCulpritEvidenceSentenceInScene(CULPRIT);
  // Verbatim from data/store.json for story_20260905-1242: a space and a curly closing quote.
  const shipped =
    `"You did it. ” The words settled and nobody took them back. Kenneth Gaunt said nothing, and the ` +
    `proof on the table said the rest.`;
  const shippedCurlyBoth = shipped.replace(/^"/, "“");

  it("the builder's own output (the fixture every prior test used)", () => {
    expect(isInjectedSentence(built)).toBe(true);
  });

  it("the shipped form — space before a curly closing quote — through isInjectedSentence", () => {
    expect(isInjectedSentence(shipped)).toBe(true);
    expect(isInjectedSentence(shippedCurlyBoth)).toBe(true);
  });

  it("the shipped form through the RAW pattern array, which checkManuscriptGeometry consumes directly", () => {
    expect(INJECTED_SENTENCE_PATTERNS.some((re) => re.test(shipped))).toBe(true);
    expect(INJECTED_SENTENCE_PATTERNS.some((re) => re.test(shippedCurlyBoth))).toBe(true);
  });

  it("authored prose in the same register is not swept up by the fold", () => {
    expect(isInjectedSentence(`"You did it, then," she said, and put the cup down.`)).toBe(false);
    expect(isInjectedSentence(`The words settled over the table like dust.`)).toBe(false);
  });
});

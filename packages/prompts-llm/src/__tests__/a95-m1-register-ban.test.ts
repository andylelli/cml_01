/**
 * A_95 M1 — the register ban list.
 *
 * "Still has generated/scaffold lines" is in 15 of 15 reviewer texts, and prose has never exceeded 8
 * in 61 reads. Machine register is the only validated predictor (ρ −0.60 headline, −0.71 character
 * clarity, n=34) and has acted on nothing since A_88.
 *
 * The fixtures below are REAL sentences: the offenders come from the seed-1358 and matched-pair
 * manuscripts, the clean ones from the same books.
 */

import { afterEach, describe, expect, it } from "vitest";

import { buildPostPassPolishPrompt } from "../agent9-prose/post-pass-polish.js";
import {
  REGISTER_BAN_MAX_SENTENCES,
  buildRegisterBanBlock,
  collectRegisterOffenders,
  isRegisterBanEnabled,
} from "../agent9-prose/register-ban.js";

const prev = process.env.AGENT9_REGISTER_BAN;
afterEach(() => {
  if (prev === undefined) delete process.env.AGENT9_REGISTER_BAN;
  else process.env.AGENT9_REGISTER_BAN = prev;
});

// Verbatim from the shipped books — every one scored >= 3 by machine-register.
const OFFENDERS = [
  "The mechanism behind it all remained hidden, the contradiction unresolved.",
  "The evidence lay in plain sight, but Rosalind kept her thoughts close.",
  "Each entry held firm, the timeline unbroken.",
  "The case was closed, but the theatre's world would never be quite the same.",
];
// Also verbatim, and concrete: a person, an object, an action.
const CLEAN = [
  "Rosalind set the ledger on the table and turned it so the ink faced him.",
  "Barnaby's hands stilled, the nervous tapping fading as he watched Adela's undoing.",
];

const chapterOf = (sentences: string[]) => ({ title: "Chapter 9", paragraphs: [sentences.join(" ")] });

describe("the flag defaults OFF", () => {
  it("is off unless .env says so", () => {
    delete process.env.AGENT9_REGISTER_BAN;
    expect(isRegisterBanEnabled()).toBe(false);
  });
});

describe("it finds the sentences the reader calls generated", () => {
  it("KNOWN-POSITIVE: every offender fixture is detected", () => {
    const found = collectRegisterOffenders(chapterOf(OFFENDERS)).map((o) => o.sentence);
    for (const s of OFFENDERS) expect(found).toContain(s);
  });

  it("and the concrete sentences are left alone — so it separates, rather than flagging everything", () => {
    const found = collectRegisterOffenders(chapterOf(CLEAN)).map((o) => o.sentence);
    expect(found).toEqual([]);
  });

  it("a mixed chapter yields only the offenders", () => {
    const found = collectRegisterOffenders(chapterOf([...OFFENDERS, ...CLEAN])).map((o) => o.sentence);
    expect(found).toHaveLength(OFFENDERS.length);
    for (const s of CLEAN) expect(found).not.toContain(s);
  });

  it("DIALOGUE IS EXEMPT: people may speak in abstractions", () => {
    const spoken = `"The mechanism behind it all remained hidden, the contradiction unresolved," she said.`;
    expect(collectRegisterOffenders(chapterOf([spoken]))).toEqual([]);
  });

  it("worst first, and never more than the cap", () => {
    const many = Array.from({ length: 20 }, (_, i) => `The matter of item ${i} remained unresolved, the question unanswered.`);
    const found = collectRegisterOffenders(chapterOf(many));
    expect(found.length).toBeLessThanOrEqual(REGISTER_BAN_MAX_SENTENCES);
    expect(found[0]!.score).toBeGreaterThanOrEqual(found[found.length - 1]!.score);
  });
});

describe("the block is an operation, not a rule", () => {
  it("names each sentence, numbered, and asks for a thing and a person", () => {
    const block = buildRegisterBanBlock(chapterOf(OFFENDERS));
    expect(block).toContain("THESE SENTENCES, SPECIFICALLY");
    // Entry 1 is the worst-scoring sentence, not the first in document order.
    const worst = collectRegisterOffenders(chapterOf(OFFENDERS))[0]!.sentence;
    expect(block).toContain(`1. "${worst}"`);
    for (const s of OFFENDERS) expect(block).toContain(`"${s}"`);
    expect(block).toContain("physically present in the");
    expect(block).toContain("somebody doing something with it");
    expect(block).toContain("Keep the fact the sentence carries");
    expect(block).toContain("do not move the abstraction into dialogue");
    // no rates — CLAUDE.md
    expect(block).not.toMatch(/per cent|%|per 10k|rate/i);
  });

  it("a clean chapter gets NO block — it is not an off switch with extra steps (B1)", () => {
    expect(buildRegisterBanBlock(chapterOf(CLEAN))).toBe("");
  });
});

describe("it reaches the polish prompt, and only when the flag is on", () => {
  const repairContext = {
    requiredClueSummaries: [],
    matchingClearances: [],
    stageMode: "investigation",
  } as any;

  it("OFF: the prompt is byte-identical to today", () => {
    delete process.env.AGENT9_REGISTER_BAN;
    const prompt = buildPostPassPolishPrompt({ chapter: chapterOf(OFFENDERS), repairContext });
    expect(prompt).not.toContain("THESE SENTENCES, SPECIFICALLY");
    expect(prompt).toContain("THE FIVE THINGS REVIEWERS KEEP FLAGGING");
  });

  it("ON: the chapter's own offenders are in the prompt, before the optional advice", () => {
    process.env.AGENT9_REGISTER_BAN = "true";
    const prompt = buildPostPassPolishPrompt({ chapter: chapterOf(OFFENDERS), repairContext });
    expect(prompt).toContain("THESE SENTENCES, SPECIFICALLY");
    expect(prompt).toContain(OFFENDERS[0]!);
    expect(prompt.indexOf("THESE SENTENCES, SPECIFICALLY")).toBeLessThan(prompt.indexOf("ALSO, WHERE IT HELPS"));
  });

  it("ON with a clean chapter: the prompt is unchanged", () => {
    process.env.AGENT9_REGISTER_BAN = "true";
    const prompt = buildPostPassPolishPrompt({ chapter: chapterOf(CLEAN), repairContext });
    expect(prompt).not.toContain("THESE SENTENCES, SPECIFICALLY");
  });
});

import { afterEach, describe, expect, it } from "vitest";
import { assembleWriterPrompt } from "../jobs/agents/agent9-v2/run.js";

/**
 * A_110 N11 (PROSE_V2_BOOK_FIRST) — the book so far before the craft block and the chapter's contract, so the operations
 * ride beside the format rules at the end of every call. OFF, and in chapter 1 (an empty book so far), byte-identical.
 */
afterEach(() => {
  delete process.env.PROSE_V2_BOOK_FIRST;
});

const parts = {
  bible: "## THE CASE\nthe case",
  brief: "## HOW THEY SPEAK\n- a rule",
  contracts: "=== CHAPTER 10 ===\n  This chapter is the aftermath.",
  soFar: "THE BOOK SO FAR — every word of it, for continuity and for voice:\n\n=== CHAPTER 9: Nine ===\nA paragraph.",
  format: "Write the chapters below, in order, as plain prose.",
};

describe("the writer's prompt order", () => {
  it("OFF: bible, brief, contracts, book so far, format — as before", () => {
    const p = assembleWriterPrompt(parts);
    expect(p.indexOf("## HOW THEY SPEAK")).toBeLessThan(p.indexOf("THE BOOK SO FAR"));
    expect(p.indexOf("=== CHAPTER 10 ===")).toBeLessThan(p.indexOf("THE BOOK SO FAR"));
    expect(p.endsWith(parts.format)).toBe(true);
  });

  it("ON: the book so far follows the bible; the brief and the contract sit just before the format rules", () => {
    process.env.PROSE_V2_BOOK_FIRST = "1";
    const p = assembleWriterPrompt(parts);
    expect(p.indexOf("THE BOOK SO FAR")).toBeLessThan(p.indexOf("## HOW THEY SPEAK"));
    expect(p.indexOf("## HOW THEY SPEAK")).toBeLessThan(p.indexOf("=== CHAPTER 10 ==="));
    expect(p.endsWith(parts.format)).toBe(true);
  });

  it("ON, chapter 1 (nothing written yet): byte-identical to OFF", () => {
    const first = { ...parts, soFar: "" };
    const off = assembleWriterPrompt(first);
    process.env.PROSE_V2_BOOK_FIRST = "1";
    expect(assembleWriterPrompt(first)).toBe(off);
  });
});

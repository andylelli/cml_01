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

// A_110 P3 — a chapter the contract marks `victimAlive` shows the victim alive, not the body.
import { renderSceneContract } from "../jobs/agents/agent9-v2/run.js";
describe("P3 in the writer's contract", () => {
  const base = {
    roles: { reveal: 3, discriminatingTest: 2, aftermath: null, falseSolution: null, clearances: [] },
    fairPlay: { culprits: ["Ada Vane"], victim: "Hugo Pell", mechanismSummary: "", decisiveClueIds: [], revealChapter: 3 },
    bible: { text: "" }, brief: { text: "" }, notes: [],
  };
  const scene = (extra: Record<string, unknown>) => ({
    chapter: 1, beat: "gathering", role: "investigation", title: "One", present: ["Hugo Pell", "Ada Vane"], location: "the hall",
    mustSurface: [], mayMention: [], mustNotReveal: [], eliminationsAllowed: [], job: null, beats: {}, words: { min: 900, max: 1100, preferred: 1000 }, ...extra,
  });
  it("victimAlive: the alive line, never the body line", () => {
    const text = renderSceneContract({ ...base, scenes: [scene({ victimAlive: true })] } as never, 1);
    expect(text).toContain("Hugo Pell is alive in this chapter");
    expect(text).not.toContain("The body:");
  });
  it("unmarked: the body line, as before", () => {
    const text = renderSceneContract({ ...base, scenes: [scene({})] } as never, 1);
    expect(text).toContain("The body: Hugo Pell");
  });
});

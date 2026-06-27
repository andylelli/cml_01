import { describe, expect, it } from "vitest";
import { evaluatePlaceholderLeakage } from "../jobs/agents/agent9-run.js";

/**
 * Regression for the run `mystery-1782577884032` abort: the named-standalone placeholder
 * detector hard-stopped a complete, good story on "a woman Eleanor had once mentored" —
 * a relative clause characterising the victim, with the detective's first name as the
 * clause subject. The fix: a relative-clause guard (a verb/relativizer after the captured
 * name ⇒ not a placeholder).
 */
const prose = (...paragraphs: string[]) => ({
  chapters: [{ title: "Chapter 1", summary: "", paragraphs }],
});

describe("evaluatePlaceholderLeakage — named-standalone relative-clause guard", () => {
  it("does NOT flag a relative clause ('a woman Eleanor had once mentored')", () => {
    const r = evaluatePlaceholderLeakage(
      prose(
        "The body was unmistakable—Beatrice, the hotel's head of guest services, a woman Eleanor had once mentored but lately only regarded across a widening gulf of resentment.",
      ),
      new Set(["Voss", "Finch", "Hale", "Quill"]),
    );
    expect(r.standaloneCount).toBe(0);
    expect(r.hasLeakage).toBe(false);
  });

  it("still FLAGS a genuine appositive placeholder ('a woman Quill, pale and shaking')", () => {
    const r = evaluatePlaceholderLeakage(
      prose("In the doorway stood a woman Quill, pale and shaking, clutching the telegram."),
      new Set(["Voss", "Finch", "Hale", "Quill"]),
    );
    expect(r.standaloneCount).toBe(1);
    expect(r.hasLeakage).toBe(true);
    expect(r.examples.join(" ")).toContain("a woman Quill");
  });

  it("does not flag relative clauses with other relativizers ('a man Hale who had served')", () => {
    const r = evaluatePlaceholderLeakage(
      prose("Across the room sat a man Hale who had served alongside the colonel in Burma."),
      new Set(["Hale"]),
    );
    expect(r.standaloneCount).toBe(0);
  });

  it("surfaces the offending standalone token in examples (so a future abort names it)", () => {
    const r = evaluatePlaceholderLeakage(
      prose("It was a man Crane, silent in the corner."),
      new Set(["Crane"]),
    );
    expect(r.examples.some((e: string) => e.includes("a man Crane"))).toBe(true);
  });
});

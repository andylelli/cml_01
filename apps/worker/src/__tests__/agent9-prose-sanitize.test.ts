/**
 * P0.2 regression tests for sanitizeProseText's deterministic text repairs (run_9b824eb2 leaks):
 *  - doubled function-words ("the the" → "the") collapsed, while valid doublings are preserved.
 *  - the Agent-9 diagnostic note ("Generated in scene batches…") scrubbed even when the full line
 *    (with the "N batch(es) required retry for validation" tail) is present.
 */
import { describe, expect, it } from "vitest";
import { sanitizeProseText } from "../jobs/agents/agent9-run.js";

describe("sanitizeProseText — doubled-word collapse (P0.2)", () => {
  it("collapses 'the the' to a single 'the'", () => {
    expect(sanitizeProseText("She crossed the the threshold.")).toBe("She crossed the threshold.");
  });

  it("preserves the first occurrence's case at a sentence start", () => {
    expect(sanitizeProseText("The the door creaked.")).toBe("The door creaked.");
  });

  it("collapses adjacent duplicate function-words", () => {
    expect(sanitizeProseText("a a man")).toBe("a man");
    expect(sanitizeProseText("walked in in silence")).toBe("walked in silence");
    expect(sanitizeProseText("box of of matches")).toBe("box of matches");
    expect(sanitizeProseText("salt and and pepper")).toBe("salt and pepper");
  });

  it("collapses adjacent duplicate content-words too ('soft soft' → 'soft')", () => {
    // run_9b824eb2 leaked both "the the" AND "soft soft"; a denylist would have missed the latter.
    expect(sanitizeProseText("a soft soft fall of snow")).toBe("a soft fall of snow");
    expect(sanitizeProseText("Soft soft snow")).toBe("Soft snow");
  });

  it("does NOT collapse the grammatical doublings in the allowlist", () => {
    expect(sanitizeProseText("He had had enough.")).toBe("He had had enough.");
    expect(sanitizeProseText("She knew that that man lied.")).toBe("She knew that that man lied.");
    expect(sanitizeProseText("What it is is a mystery.")).toBe("What it is is a mystery.");
  });

  it("does not false-positive where a word merely prefixes the next ('the thermometer')", () => {
    expect(sanitizeProseText("the thermometer rose")).toBe("the thermometer rose");
    expect(sanitizeProseText("a apple a day")).toBe("a apple a day");
  });

  it("does not collapse across sentence boundaries", () => {
    // A period (not whitespace) separates the two words, so this is not a doubling.
    expect(sanitizeProseText("He entered the. The room was cold.")).toBe(
      "He entered the. The room was cold.",
    );
  });
});

describe("sanitizeProseText — diagnostic-note scrub (P0.2)", () => {
  it("removes the full diagnostic line, not just the bare phrase", () => {
    const input = "Generated in scene batches. 10 batch(es) required retry for validation.";
    expect(sanitizeProseText(input)).toBe("");
  });

  it("removes a residue line embedded amongst real prose", () => {
    const input = "Generated in scene batches. 3 batch(es) required retry for validation.\n\nThe study was silent.";
    expect(sanitizeProseText(input)).toBe("The study was silent.");
  });
});

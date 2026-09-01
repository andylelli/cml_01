/**
 * A_81 F16 / F18 — the two defects the fourth external read named that were free to fix.
 *
 * F16, THE DIRECTION OF A CLOCK ERROR. MEASURED on run mystery-1788297847870 (external read 82/100):
 * the case was arithmetically correct and the manuscript wrote "The veranda clock now runs fast — by
 * exactly thirty-five minutes". `runs fast` 1, `slow` 0. The device read 9:10 when the true time was
 * 9:45, so it was thirty-five minutes SLOW. This is the third distinct timing failure mode — after the
 * collapse (A_80 F12) and the repair collision (A_81 §10) — and it is the first where the VALUE was
 * right and the RELATION was inverted. A_80 F15 checks that the gap equals the interval; nothing
 * anywhere checked which way round the prose says the clock runs.
 *
 * The swap case is the load-bearing one: it is what distinguishes a derivation from a hardcoded word.
 *
 * F18, PROOF AFTER THE CONFESSION. The deterministic discriminating-test patch splices three
 * paragraphs at length-1. When the culprit has already broken earlier in the chapter that lands a
 * demonstration after the admission it was meant to force, which two consecutive external reads
 * quoted back ("Run again in front of them all…").
 */

import { describe, expect, it } from "vitest";

import { buildClockDirectionBlock } from "../agent9-prose/prompt-builder.js";
import { applyDeterministicDiscriminatingTestPatch } from "../agent9-prose/deterministic-repair.js";

const DEVICE = { id: "clock_time_displayed", value: "ten minutes past nine", description: "what the veranda clock showed" };
const TRUTH = { id: "actual_time_of_death", value: "forty-five minutes past nine", description: "the true time" };

describe("F16 — the direction is derived from the locked values", () => {
  it("calls a device reading EARLIER than the truth SLOW, and forbids the inverted words", () => {
    const block = buildClockDirectionBlock([DEVICE, TRUTH]);
    expect(block).toContain("SLOW by 35 minutes");
    expect(block).toContain('"fast", "ahead", "gaining", "set forward"');
  });

  it("FLIPS to FAST when the device reads LATER — the derivation, not a hardcoded word", () => {
    // Same labels, values exchanged: the device now shows 9:45 while the truth is 9:10.
    const block = buildClockDirectionBlock([
      { ...DEVICE, value: TRUTH.value },
      { ...TRUTH, value: DEVICE.value },
    ]);
    expect(block).toContain("FAST by 35 minutes");
    expect(block).toContain('"slow", "behind", "losing", "set back"');
  });

  it("is order-independent — the registry order does not decide which side is staged", () => {
    expect(buildClockDirectionBlock([TRUTH, DEVICE])).toContain("SLOW by 35 minutes");
  });

  it("parses values carrying a time-of-day tail, rather than silently degrading", () => {
    const block = buildClockDirectionBlock([
      { id: "sundial_shadow_displayed", value: "half past three in the afternoon", description: "the staged reading" },
      { id: "actual_time_of_death", value: "twenty minutes past four in the afternoon", description: "the true time" },
    ]);
    expect(block).toContain("SLOW by 50 minutes");
  });

  it("names NO direction when neither fact is classifiable as staged or true", () => {
    const block = buildClockDirectionBlock([
      { id: "first_reading", value: "ten minutes past nine", description: "one reading" },
      { id: "second_reading", value: "forty-five minutes past nine", description: "another reading" },
    ]);
    expect(block).toContain("do not name a direction at all");
    expect(block).not.toContain("SLOW by");
    expect(block).not.toContain("FAST by");
  });

  it("is empty when there is no contradiction pair at all", () => {
    expect(buildClockDirectionBlock([DEVICE])).toBe("");
  });
});

const CASE_DATA = {
  CASE: {
    discriminating_test: { eliminated_suspects: ["Hugo Vane"] },
    false_assumption: { statement: "the veranda had been empty all evening" },
  },
} as any;

describe("F18 — the scaffold lands before the confession, not after it", () => {
  const chapter = {
    title: "Ch10",
    paragraphs: [
      "The room settled as the lamps were lit.",
      "Beatrice Quill admitted she had moved the hands herself.",
      "Outside, the tide went on turning over the shingle.",
    ],
  };

  it("inserts the proof BEFORE the admission", () => {
    const { chapter: out, inserted } = applyDeterministicDiscriminatingTestPatch(
      chapter as any, CASE_DATA, "Inspector Wren", "the stopped pendulum", "Beatrice Quill",
    );
    expect(inserted).toBe(true);
    const confessionAt = out.paragraphs.findIndex((p) => /admitted/.test(p));
    const scaffoldAt = out.paragraphs.findIndex((p) => /Run again in front of them all/.test(p));
    expect(scaffoldAt).toBeGreaterThan(-1);
    expect(scaffoldAt).toBeLessThan(confessionAt);
  });

  it("still appends at the end when nobody confesses — the prior behaviour is unchanged", () => {
    const noConfession = {
      title: "Ch10",
      paragraphs: ["The room settled as the lamps were lit.", "Outside, the tide went on turning."],
    };
    const { chapter: out } = applyDeterministicDiscriminatingTestPatch(
      noConfession as any, CASE_DATA, "Inspector Wren", "the stopped pendulum", "Beatrice Quill",
    );
    expect(out.paragraphs[out.paragraphs.length - 1]).toContain("the tide went on turning");
  });

  it("keeps the DT-validity markers the pre-commit gate needs", () => {
    const { chapter: out } = applyDeterministicDiscriminatingTestPatch(
      chapter as any, CASE_DATA, "Inspector Wren", "the stopped pendulum", "Beatrice Quill",
    );
    const text = out.paragraphs.join(" ");
    expect(text).toMatch(/theory/i);
    expect(text).toMatch(/ruled out|result/i);
  });
});

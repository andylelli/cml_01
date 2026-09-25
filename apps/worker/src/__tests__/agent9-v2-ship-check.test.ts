/**
 * 17-hitting-90 P0.3 — the ship-check runs on v2's manuscript. Known-positive first: a probe that
 * has never fired is a claim about the probe.
 */
import { describe, expect, it } from "vitest";

import { v2ShipCheckLines } from "../jobs/agents/agent9-v2/ship-check.js";

const chapter = (paragraphs: string[]) => ({ title: "t", paragraphs });

describe("the v2 ship-check", () => {
  it("KNOWN-POSITIVE: a repeated six-word span and a scaffold signature are both reported", () => {
    const repeated = "the seven feet above the rocky shore";
    const lines = v2ShipCheckLines([
      chapter([`He measured ${repeated} twice.`, `She had already counted ${repeated} herself.`, `Nobody doubted ${repeated} now.`]),
      chapter(["Nobody in the room could unsee what had just happened."]),
    ]);
    expect(lines.some((l) => /SHIP-CHECK: repetition — /.test(l))).toBe(true);
    expect(lines.some((l) => /scaffold residual \[A2b:could_unsee\] in ch2/.test(l))).toBe(true);
    expect(lines.some((l) => /in ch1/.test(l))).toBe(false);
  });

  it("a clean book reports its repetition figure and no scaffold line", () => {
    const lines = v2ShipCheckLines([chapter(["The morning came in grey off the water, and the hotel woke slowly."])]);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/repetition/);
  });

  it("no chapters, no lines", () => {
    expect(v2ShipCheckLines([])).toEqual([]);
  });
});

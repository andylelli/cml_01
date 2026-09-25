/**
 * 17-hitting-90 P2.5 — the saved manuscript keeps its dashes.
 *
 * MEASURED 2026-09-25: pair 1's drafts carried 15–45 em-dashes each and the saved manuscript 0,
 * because the story normalisers folded `–` and `—` to a bare `-` since 2026-07-04. The reader reads
 * the saved file, so WP-001's em-dash operation was being performed and then deleted.
 */
import { describe, expect, it } from "vitest";

import { normalizeStoryText } from "../jobs/story-output.js";

describe("the story normaliser", () => {
  it("KNOWN-POSITIVE: an em-dash and an en-dash survive; quotes and the ellipsis still fold", () => {
    const out = normalizeStoryText("She paused — then went on… “Yes,” he said, ‘if you like’ – for now.");
    expect(out).toContain("paused — then");
    expect(out).toContain("– for now");
    expect(out).toContain('"Yes," he said');
    expect(out).toContain("'if you like'");
    expect(out).toContain("went on...");
  });

  it("a dash between words is never fused into a compound", () => {
    expect(normalizeStoryText("the door—locked")).not.toMatch(/door-locked/);
  });
});

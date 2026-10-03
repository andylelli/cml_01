import { afterEach, describe, expect, it } from "vitest";
import { noveltyMaxTokens } from "../agent8-novelty.js";

/** A1X-D03 follow-up: with real seed summaries the audit's reply outgrew the 2,500-token cap (run mystery-1790895750302). */
afterEach(() => { delete process.env.CML_VERIFIED_FIXES; });

describe("Agent 8's output cap", () => {
  it("OFF: the configured cap", () => {
    expect(noveltyMaxTokens(2500)).toBe(2500);
  });
  it("ON: at least 8,000 (a larger configured value is kept)", () => {
    process.env.CML_VERIFIED_FIXES = "1";
    expect(noveltyMaxTokens(2500)).toBe(8000);
    expect(noveltyMaxTokens(12000)).toBe(12000);
  });
});

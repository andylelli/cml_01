import { afterEach, describe, expect, it } from "vitest";
import { buildBookContract } from "../book-contract.js";
import { completeProjects } from "./fixtures.js";

/**
 * A_110 step 3 levers in the brief. N8 (PROSE_V2_TOUCH_ONCE): the touch rule once a chapter, not in every paragraph —
 * MEASURED: asked of every paragraph it raised the three gesture words it names by 1.6–2.4 z (WP-007 §4.2).
 */
afterEach(() => {
  delete process.env.PROSE_V2_TOUCH_ONCE;
  delete process.env.PROSE_V2_OPENING;
});

describe("N8 the touch rule", () => {
  const p = completeProjects()[0]!;
  it("OFF: every paragraph, as before; ON: one paragraph in each chapter", () => {
    expect(buildBookContract(p.input).brief.text).toMatch(/Every paragraph has a thing in it somebody could touch/);
    process.env.PROSE_V2_TOUCH_ONCE = "1";
    const on = buildBookContract(p.input).brief.text;
    expect(on).toMatch(/One paragraph in each chapter has a thing in it somebody could touch/);
    expect(on).not.toMatch(/Every paragraph[^.]*somebody could touch/);
  });

  it("ON wins over the opening's every-paragraph wording", () => {
    process.env.PROSE_V2_OPENING = "1";
    expect(buildBookContract(p.input).brief.text).toMatch(/Every paragraph, apart from the two that open the book/);
    process.env.PROSE_V2_TOUCH_ONCE = "1";
    expect(buildBookContract(p.input).brief.text).toMatch(/One paragraph in each chapter has a thing/);
  });

  it("OFF: the brief is byte-identical to a flag-less build", () => {
    const a = buildBookContract(p.input).brief.text;
    process.env.PROSE_V2_TOUCH_ONCE = "0";
    expect(buildBookContract(p.input).brief.text).toBe(a);
  });
});

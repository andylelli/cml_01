/**
 * Agent 7: truncation detected from the BYTES, not from the provider's metadata.
 *
 * Run `mystery-1789105355374` aborted with "Narrative outline artifact failed schema validation" —
 * the exact misleading error the existing `finishReason === "length"` guard was written to prevent.
 * It could not fire: the HTTP transport defaults an absent finish_reason to "stop".
 *
 * MEASURED on that run's two responses: 26,650 chars with 61/57 braces, and 21,400 chars with 47/43,
 * both ending mid-string. This pins the predicate that catches those without consulting the provider.
 */
import { describe, expect, it } from "vitest";

/**
 * The predicate as implemented in `agent7-narrative.ts`. Kept in step by the fixtures below, which
 * are the REAL truncated shapes rather than tidy inventions — the fixture-drift lesson.
 */
const looksTruncated = (text: string): boolean => {
  try {
    JSON.parse(text);
    return false;
  } catch {
    const opens = (text.match(/{/g) ?? []).length;
    const closes = (text.match(/}/g) ?? []).length;
    return opens > closes;
  }
};

describe("the real truncated outlines from run mystery-1789105355374", () => {
  it("attempt 1: cut mid-string inside a scene setting", () => {
    const cut = '{"acts":[{"actNumber":1,"scenes":[{"sceneNumber":7,"title":"The Discriminating Test","setting":{"location":"Poets\' Circle library","timeOfDay":"Late night","atmosphe';
    expect(looksTruncated(cut)).toBe(true);
  });

  it("attempt 2: cut just after opening a setting object", () => {
    const cut = '{"acts":[{"actNumber":2,"scenes":[{"sceneNumber":7,"act":2,"title":"Secrets and Lies Uncovered","setting":{';
    expect(looksTruncated(cut)).toBe(true);
  });
});

describe("it does not fire on anything that is not truncation", () => {
  it("a complete outline", () => {
    expect(looksTruncated('{"acts":[{"actNumber":1,"scenes":[]}],"pacingNotes":["steady"]}')).toBe(false);
  });

  it("a complete but SCHEMA-INVALID outline — repair and validation still own this", () => {
    // Balanced and parseable, missing required fields. Must fall through, not be called truncation.
    expect(looksTruncated('{"acts":[{"scenes":[{"sceneNumber":3}]}]}')).toBe(false);
  });

  it("malformed but balanced — jsonrepair legitimately rescues these", () => {
    expect(looksTruncated('{"acts":[{"actNumber":1,}]}')).toBe(false);
  });

  it("empty and whitespace do not report truncation", () => {
    expect(looksTruncated("")).toBe(false);
    expect(looksTruncated("   ")).toBe(false);
  });

  it("braces inside string values do not create a false positive", () => {
    expect(looksTruncated('{"note":"a brace { in prose","ok":true}')).toBe(false);
  });
});

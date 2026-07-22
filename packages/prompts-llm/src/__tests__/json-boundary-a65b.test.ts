import { describe, expect, it } from "vitest";
import { looksTruncatedJson, guardedJsonrepairParse } from "../shared/json-boundary.js";

// A_65b Ph8 — the JSON-boundary kit. The contract: a merely-sloppy payload still ends with its
// closing brace and may be repaired; a completion-limit TRUNCATED payload does not, and must be
// REFUSED (jsonrepair would close it into a phantom structure — the a3c2973f class, where
// `{"id": "clue_` became a phantom clue that hard-stopped the gate 15 minutes later).

describe("looksTruncatedJson", () => {
  it("flags the a3c2973f shape — a payload cut mid-token", () => {
    expect(looksTruncatedJson('{"clues": [{"id": "clue_')).toBe(true);
  });
  it("does not flag a sloppy-but-complete payload (trailing comma, still closed)", () => {
    expect(looksTruncatedJson('{"clues": [1, 2,], }')).toBe(false);
  });
  it("does not flag fenced-but-complete payloads", () => {
    expect(looksTruncatedJson('```json\n{"a": 1}\n```')).toBe(false);
  });
  it("flags empty payloads", () => {
    expect(looksTruncatedJson("")).toBe(true);
  });
});

describe("guardedJsonrepairParse", () => {
  it("strict-parses clean JSON without repair", () => {
    const r = guardedJsonrepairParse('{"a": 1}');
    expect(r).toEqual({ data: { a: 1 }, repaired: false, truncated: false });
  });
  it("repairs a sloppy-but-complete payload", () => {
    const r = guardedJsonrepairParse('{"a": 1,}');
    expect(r.data).toEqual({ a: 1 });
    expect(r.repaired).toBe(true);
    expect(r.truncated).toBe(false);
  });
  it("REFUSES a truncated payload — data undefined, never a phantom", () => {
    const r = guardedJsonrepairParse('{"clues": [{"id": "clue_');
    expect(r.data).toBeUndefined();
    expect(r.truncated).toBe(true);
  });
});

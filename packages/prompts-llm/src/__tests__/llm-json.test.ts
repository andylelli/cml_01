import { describe, expect, it } from "vitest";
import { jsonrepair } from "jsonrepair";
import { looksTruncatedJson } from "../shared/json-boundary.js";
import { parseLlmJson } from "../shared/llm-json.js";

/**
 * CR-20 — parseLlmJson against VERBATIM copies of the ten ladders it replaced, over a corpus of payloads
 * an LLM returns: valid, sloppy, fenced, wrapped in prose, truncated, empty, not JSON. For each boundary
 * the old ladder and the adapter now at the call site must agree on the value, and on the exact error
 * text where one is thrown or recorded (several reach a retry prompt).
 */
const CORPUS: Record<string, string> = {
  valid: '{"a": 1, "b": [1, 2], "c": {"d": "x"}}',
  "valid array": "[1, 2, 3]",
  "valid null": "null",
  "valid, padded": '  \n{"a": 1}\n  ',
  "trailing comma": '{"a": 1, "b": [1, 2,],}',
  "unquoted key": "{a: 1, b: 'two'}",
  fenced: '```json\n{"a": 1}\n```',
  "fenced, sloppy": '```json\n{"a": 1,}\n```',
  "prose-wrapped": 'Here is the JSON you asked for: {"a": 1} Hope it helps.',
  "prose-wrapped, sloppy": 'Result: {"a": 1, "b": 2,} done',
  "prose-wrapped, fenced tail": 'Sure.\n{"a": {"b": 1}}\n```',
  "truncated object": '{"a": 1, "b": [1, 2',
  "truncated string": '{"clues": [{"id": "clue_',
  "truncated after prose": 'Here: {"a": 1, "b": {"c": 2',
  "two objects": '{"a": 1} {"b": 2}',
  empty: "",
  whitespace: "   ",
  "not json": "not json at all",
  yaml: "a: 1\nb:\n  - x\n  - y",
  "braces, garbage inside": "{ this is not json }",
  "nested braces text": 'text {"a": "}"} more }',
};

type Outcome = { value?: unknown; error?: string; recorded?: string; flag?: boolean };
const run = (fn: () => Outcome): Outcome => {
  try { return fn(); } catch (e) { return { error: String((e as Error).message) }; }
};

// ── Ladder (a): Agent 3 (guarded) and Agent 4 (unguarded) — record the last parse error, return undefined.
const oldA = (raw: string, guard: boolean): Outcome => {
  let jsonParseError: Error | undefined;
  const tryParseJson = (raw: string): any => {
    try { return JSON.parse(raw); } catch (error) { jsonParseError = error as Error; }
    if (guard && looksTruncatedJson(raw)) {
      jsonParseError = new Error("TRUNCATED");
      return undefined;
    }
    try { return JSON.parse(jsonrepair(raw)); } catch { /* ignore */ }
    const trimmed = raw.trim();
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start !== -1 && end > start) {
      const candidate = trimmed.slice(start, end + 1);
      try { return JSON.parse(candidate); } catch (error) { jsonParseError = error as Error; }
      try { return JSON.parse(jsonrepair(candidate)); } catch { /* ignore */ }
    }
    return undefined;
  };
  const value = tryParseJson(raw);
  return { value, recorded: jsonParseError?.message };
};
const newA = (raw: string, guard: boolean): Outcome => {
  let jsonParseError: Error | undefined;
  const parsed = parseLlmJson(raw, { guard, extract: "strict+repair" });
  if (parsed.truncated) jsonParseError = new Error("TRUNCATED");
  else if (parsed.parseError) jsonParseError = parsed.parseError;
  return { value: parsed.data, recorded: jsonParseError?.message };
};

// ── Agent 6: guarded ladder (a) that throws.
const old6 = (raw: string): Outcome => {
  try { return { value: JSON.parse(raw) }; } catch { /* */ }
  if (looksTruncatedJson(raw)) throw new Error("TRUNCATED");
  try { return { value: JSON.parse(jsonrepair(raw)) }; } catch { /* */ }
  const trimmed = raw.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start !== -1 && end > start) {
    const candidate = trimmed.slice(start, end + 1);
    try { return { value: JSON.parse(candidate) }; } catch { /* */ }
    try { return { value: JSON.parse(jsonrepair(candidate)) }; } catch { /* */ }
  }
  throw new Error(`FAILED ${raw.slice(0, 280).replace(/\s+/g, " ")}`);
};
const new6 = (raw: string): Outcome => {
  const parsed = parseLlmJson(raw, { guard: true, extract: "strict+repair" });
  if (parsed.truncated) throw new Error("TRUNCATED");
  if (parsed.data !== undefined) return { value: parsed.data };
  throw new Error(`FAILED ${raw.slice(0, 280).replace(/\s+/g, " ")}`);
};

// ── Ladder (b): 2d, 2e (guarded) and 2b, 2c (unguarded) — jsonrepair's own error propagates.
const oldB = (raw: string, guard: boolean): Outcome => {
  let v: unknown;
  try { v = JSON.parse(raw); } catch {
    if (guard && looksTruncatedJson(raw)) throw new Error("TRUNCATED");
    v = JSON.parse(jsonrepair(raw));
  }
  return { value: v };
};
const newB = (raw: string, guard: boolean): Outcome => {
  const parsed = parseLlmJson(raw, { guard });
  if (parsed.truncated) throw new Error("TRUNCATED");
  if (parsed.data === undefined) throw parsed.repairError;
  return { value: parsed.data };
};

// ── Agent 6.5: guard only when the payload is truncation-shaped AND non-empty; repair otherwise.
const old65 = (content: string): Outcome => {
  let parsed: unknown;
  if (content && looksTruncatedJson(content)) {
    try { parsed = JSON.parse(content); } catch { throw new Error("TRUNCATED"); }
  } else {
    parsed = JSON.parse(jsonrepair(content));
  }
  return { value: parsed };
};
const new65 = (content: string): Outcome => {
  const parsed = parseLlmJson(content, { guard: Boolean(content) });
  if (parsed.truncated) throw new Error("TRUNCATED");
  if (parsed.data === undefined) throw parsed.repairError;
  return { value: parsed.data };
};

// ── Agent 7: strict → repair → the span, strict only; unguarded (it refuses on finishReason earlier).
const old7 = (content: string): Outcome => {
  let outlineData: unknown;
  try { outlineData = JSON.parse(content); } catch (error) {
    try { outlineData = JSON.parse(jsonrepair(content)); } catch {
      const trimmed = content.trim();
      const start = trimmed.indexOf("{");
      const end = trimmed.lastIndexOf("}");
      if (start !== -1 && end > start) {
        const candidate = trimmed.slice(start, end + 1);
        try { outlineData = JSON.parse(candidate); } catch (candidateError) {
          throw new Error(`Failed to parse narrative outline JSON: ${candidateError}`);
        }
      } else {
        throw new Error(`Failed to parse narrative outline JSON: ${error}`);
      }
    }
  }
  return { value: outlineData };
};
const new7 = (content: string): Outcome => {
  const parsed = parseLlmJson(content, { guard: false, extract: "strict" });
  if (parsed.data === undefined) throw new Error(`Failed to parse narrative outline JSON: ${parsed.parseError}`);
  return { value: parsed.data };
};

// ── Agent 5: strict → repair (its error propagates); flags a repaired payload not ending in "}".
const old5 = (content: string): Outcome => {
  let clueData: unknown; let repaired = false;
  try { clueData = JSON.parse(content); } catch { clueData = JSON.parse(jsonrepair(content)); repaired = true; }
  return { value: clueData, flag: repaired && !content.trim().endsWith("}") };
};
const new5 = (content: string): Outcome => {
  const parsed = parseLlmJson(content, { guard: false });
  if (parsed.data === undefined) throw parsed.repairError;
  return { value: parsed.data, flag: parsed.repaired && !content.trim().endsWith("}") };
};

const PAIRS: Array<[string, (raw: string) => Outcome, (raw: string) => Outcome]> = [
  ["Agent 3 (a, guarded)", (r) => oldA(r, true), (r) => newA(r, true)],
  ["Agent 4 (a, unguarded)", (r) => oldA(r, false), (r) => newA(r, false)],
  ["Agent 6 (a, guarded, throws)", old6, new6],
  ["2d / 2e (b, guarded)", (r) => oldB(r, true), (r) => newB(r, true)],
  ["2b / 2c (b, unguarded)", (r) => oldB(r, false), (r) => newB(r, false)],
  ["Agent 6.5", old65, new65],
  ["Agent 7", old7, new7],
  ["Agent 5", old5, new5],
];

describe("parseLlmJson reproduces every ladder it replaced (CR-20)", () => {
  for (const [label, oldFn, newFn] of PAIRS) {
    it(label, () => {
      for (const [name, raw] of Object.entries(CORPUS)) {
        expect({ name, ...run(() => newFn(raw)) }).toEqual({ name, ...run(() => oldFn(raw)) });
      }
    });
  }

  it("the corpus exercises every outcome (known positives)", () => {
    const guarded = Object.values(CORPUS).map((raw) => parseLlmJson(raw, { guard: true, extract: "strict+repair" }));
    expect(guarded.some((o) => o.truncated)).toBe(true);
    expect(guarded.some((o) => o.repaired && !o.extracted)).toBe(true);
    expect(guarded.some((o) => o.data === undefined && !o.truncated)).toBe(true);
    // Under the guard a prose-wrapped payload is refused (its tail is not a brace), so the span is
    // reached only unguarded — where Agent 4 uses it.
    const unguarded = Object.values(CORPUS).map((raw) => parseLlmJson(raw, { guard: false, extract: "strict+repair" }));
    expect(unguarded.some((o) => o.extracted && !o.repaired)).toBe(true);
    expect(unguarded.some((o) => o.extracted && o.repaired)).toBe(true);
  });

  /**
   * MEASURED while building this: unguarded, jsonrepair "repairs" text that is not JSON at all into a
   * value — prose into a string, YAML into an array. At 2b, 2c, 4, 5 and 7 that value reaches the
   * structural checks, which then reject it with a shape error rather than a parse error. The guard
   * refuses both. Recorded for ORC-Q03, not changed here.
   */
  it("unguarded, jsonrepair turns non-JSON into a value (ORC-Q03 evidence)", () => {
    expect(parseLlmJson("not json at all", { guard: false }).data).toBe("not json at all");
    expect(Array.isArray(parseLlmJson("a: 1\nb:\n  - x", { guard: false }).data)).toBe(true);
    expect(parseLlmJson("not json at all", { guard: true }).truncated).toBe(true);
  });
});

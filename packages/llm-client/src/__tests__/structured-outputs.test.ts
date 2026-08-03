import { describe, expect, it } from "vitest";
import { resolveResponseFormat, StructuredOutputError } from "../client.js";

/**
 * R3 (architecture/REVIEW_01.md) — structured outputs on the Azure client.
 *
 * These pin the wiring, not the model. The failure mode this task exists to remove is a schema that
 * looks configured but never reaches the API — so the assertions are about what gets SENT.
 */

const SCHEMA = {
  type: "object",
  properties: { title: { type: "string" } },
  required: ["title"],
  additionalProperties: false,
};

describe("resolveResponseFormat", () => {
  it("sends nothing when neither mode is requested", () => {
    expect(resolveResponseFormat({})).toBeUndefined();
  });

  it("sends json_object for the legacy jsonMode path", () => {
    expect(resolveResponseFormat({ jsonMode: true })).toEqual({ type: "json_object" });
  });

  it("forwards the schema verbatim under json_schema", () => {
    const format = resolveResponseFormat({ jsonSchema: { name: "outline", schema: SCHEMA } });

    expect(format).toEqual({
      type: "json_schema",
      json_schema: { name: "outline", schema: SCHEMA, strict: true },
    });
  });

  it("defaults strict to TRUE — an unconstrained 'structured' call is the bug, not the feature", () => {
    const format = resolveResponseFormat({ jsonSchema: { name: "outline", schema: SCHEMA } }) as {
      json_schema: { strict: boolean };
    };
    expect(format.json_schema.strict).toBe(true);
  });

  it("honours an explicit strict:false", () => {
    const format = resolveResponseFormat({
      jsonSchema: { name: "outline", schema: SCHEMA, strict: false },
    }) as { json_schema: { strict: boolean } };
    expect(format.json_schema.strict).toBe(false);
  });

  it("THROWS when both modes are passed rather than silently picking one", () => {
    // Silently preferring one would produce output that looks fine but was never schema-constrained.
    expect(() => resolveResponseFormat({ jsonMode: true, jsonSchema: { name: "outline", schema: SCHEMA } }))
      .toThrow(/mutually exclusive/);
  });

  it("names the offending schema in the error, so the caller is identifiable", () => {
    expect(() =>
      resolveResponseFormat({ jsonMode: true, jsonSchema: { name: "narrative_outline", schema: SCHEMA } }),
    ).toThrow(/narrative_outline/);
  });
});

describe("StructuredOutputError", () => {
  it("distinguishes truncation from filtering", () => {
    expect(new StructuredOutputError("truncated", "outline", "length").reason).toBe("truncated");
    expect(new StructuredOutputError("filtered", "outline", "content_filter").reason).toBe("filtered");
  });

  it("points a truncated call at maxTokens rather than at the schema", () => {
    // The whole point: a truncated schema call must not read as a schema bug.
    expect(new StructuredOutputError("truncated", "outline", "length").message).toMatch(/maxTokens/);
  });

  it("carries the schema name and finish reason for triage", () => {
    const err = new StructuredOutputError("filtered", "cast_design", "content_filter");
    expect(err.message).toContain("cast_design");
    expect(err.finishReason).toBe("content_filter");
    expect(err.name).toBe("StructuredOutputError");
  });
});

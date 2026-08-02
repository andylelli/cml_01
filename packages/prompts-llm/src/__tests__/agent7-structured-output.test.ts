import { describe, expect, it } from "vitest";
import {
  NARRATIVE_OUTLINE_SCHEMA,
  NARRATIVE_OUTLINE_SCHEMA_NAME,
  isAgent7StructuredOutputEnabled,
} from "../agent7-narrative-schema.js";
import { GOLDEN_AGE_BEATS } from "../constants/golden-age-beats.js";

/**
 * R4 (architecture/REVIEW.md) — Agent 7 structured outputs.
 *
 * The schema's job is to make specific historical defects UNREPRESENTABLE. These tests assert the
 * structural properties that do that, not the field list — a field list test would just restate the
 * schema and pass forever.
 */

type Obj = Record<string, any>;

/** Walk every object node in the schema so the invariants are checked everywhere, not just at root. */
const objectNodes = (node: any, path = "$", acc: Array<{ path: string; node: Obj }> = []) => {
  if (!node || typeof node !== "object") return acc;
  const isObjectSchema =
    node.type === "object" || (Array.isArray(node.type) && node.type.includes("object"));
  if (isObjectSchema && node.properties) acc.push({ path, node });
  for (const [k, v] of Object.entries(node)) {
    if (v && typeof v === "object") objectNodes(v, `${path}.${k}`, acc);
  }
  return acc;
};

describe("NARRATIVE_OUTLINE_SCHEMA — Azure strict-mode conformance", () => {
  const nodes = objectNodes(NARRATIVE_OUTLINE_SCHEMA);

  it("finds every object node (guards the walker itself)", () => {
    expect(nodes.length).toBeGreaterThanOrEqual(5);
  });

  it("sets additionalProperties:false on EVERY object", () => {
    const offenders = nodes.filter((n) => n.node.additionalProperties !== false).map((n) => n.path);
    expect(offenders).toEqual([]);
  });

  it("lists EVERY property in required — Azure rejects optional-by-omission", () => {
    const offenders = nodes
      .filter((n) => {
        const props = Object.keys(n.node.properties ?? {});
        const req = new Set(n.node.required ?? []);
        return props.some((p) => !req.has(p));
      })
      .map((n) => n.path);
    expect(offenders).toEqual([]);
  });

  it("expresses optionality as a nullable type, not omission", () => {
    const scene = (NARRATIVE_OUTLINE_SCHEMA as Obj).properties.acts.items.properties.scenes.items;
    // `beat` is optional on the TS interface; here it must be present-but-nullable.
    expect(scene.required).toContain("beat");
    expect(scene.properties.beat.type).toEqual(["string", "null"]);
  });

  it("uses no recursive $ref", () => {
    expect(JSON.stringify(NARRATIVE_OUTLINE_SCHEMA)).not.toContain("$ref");
  });

  it("carries no unsupported constraint keywords", () => {
    // Check schema KEYS, not the serialised string. Substring-matching the JSON gives a false
    // positive here because "pattern" is a legitimate Golden Age beat NAME inside the enum — the
    // same value-vs-key confusion that has produced real defects in this codebase.
    const keywords = new Set(["minLength", "maxLength", "minimum", "maximum", "pattern", "minItems"]);
    const found: string[] = [];
    const walkKeys = (node: any, path: string) => {
      if (!node || typeof node !== "object") return;
      if (Array.isArray(node)) return; // enum members are values, never keywords
      for (const [k, v] of Object.entries(node)) {
        if (keywords.has(k)) found.push(`${path}.${k}`);
        walkKeys(v, `${path}.${k}`);
      }
    };
    walkKeys(NARRATIVE_OUTLINE_SCHEMA, "$");
    expect(found).toEqual([]);
  });

  it("proves the keyword check inspects keys, not values", () => {
    // Guards the guard: "pattern" IS present as an enum value and must not trip the check above.
    expect(GOLDEN_AGE_BEATS).toContain("pattern");
  });
});

describe("the defects this schema makes unrepresentable", () => {
  const scene = (NARRATIVE_OUTLINE_SCHEMA as Obj).properties.acts.items.properties.scenes.items;

  it("KILLS the hoist bug — setting cannot absorb scene fields", () => {
    // A_67 / run a9c1e346: the model nested purpose, summary and characters INSIDE `setting`,
    // which hard-aborted the run at the completeness gate. additionalProperties:false on setting
    // means the model cannot emit that shape at all.
    const setting = scene.properties.setting;
    expect(setting.additionalProperties).toBe(false);
    expect(Object.keys(setting.properties)).toEqual(["location", "timeOfDay", "atmosphere"]);
    for (const leaked of ["purpose", "summary", "characters"]) {
      expect(setting.properties[leaked]).toBeUndefined();
      expect(scene.properties[leaked]).toBeDefined(); // ...and lives at scene level, where it belongs
    }
  });

  it("KILLS free-text beats — the enum is the full canonical arc plus null", () => {
    expect(scene.properties.beat.enum).toEqual([...GOLDEN_AGE_BEATS, null]);
  });

  it("constrains act and mechanism_stage to their real ranges", () => {
    expect(scene.properties.act.enum).toEqual([1, 2, 3]);
    expect(scene.properties.mechanism_stage.enum).toEqual([1, 2, 3, 4, null]);
  });
});

describe("isAgent7StructuredOutputEnabled", () => {
  it("defaults OFF — corpus regime", () => {
    expect(isAgent7StructuredOutputEnabled({})).toBe(false);
  });

  it("accepts the two documented truthy spellings", () => {
    expect(isAgent7StructuredOutputEnabled({ AGENT7_STRUCTURED_OUTPUT: "true" })).toBe(true);
    expect(isAgent7StructuredOutputEnabled({ AGENT7_STRUCTURED_OUTPUT: "1" })).toBe(true);
  });

  it("stays OFF for anything else, so a typo cannot silently enable it", () => {
    for (const v of ["yes", "on", "TRUE", "", "false", "0"]) {
      expect(isAgent7StructuredOutputEnabled({ AGENT7_STRUCTURED_OUTPUT: v })).toBe(false);
    }
  });

  it("reads env at call time, not module load", () => {
    // module-const-flags-frozen-before-dotenv: a module const would freeze before dotenv runs.
    const before = isAgent7StructuredOutputEnabled({});
    const after = isAgent7StructuredOutputEnabled({ AGENT7_STRUCTURED_OUTPUT: "true" });
    expect([before, after]).toEqual([false, true]);
  });
});

describe("schema identity", () => {
  it("has a stable name — it appears in StructuredOutputError messages", () => {
    expect(NARRATIVE_OUTLINE_SCHEMA_NAME).toBe("narrative_outline");
  });
});

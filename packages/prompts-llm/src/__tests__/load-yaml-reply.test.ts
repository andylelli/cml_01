import { readFileSync } from "node:fs";
import { join } from "node:path";
import jsYaml from "js-yaml";
import { parse as parseYaml, stringify as stringifyYaml } from "yaml";
import { describe, expect, it } from "vitest";
import { loadYamlReply, sanitizeYaml } from "../shared/llm-json.js";

/**
 * Owner decision 3 (2026-09-30) made Agent 4's YAML fallback reachable; it then turned out to corrupt every
 * wrapped string, because sanitizeYaml comments out colon-less lines. loadYamlReply parses as written first.
 */
const WORK = join(__dirname, "..", "..", "..", "..", "library", "works", "a_jury_of_her_peers", "case.cml2.yaml");
const caseObj = jsYaml.load(readFileSync(WORK, "utf8")) as Record<string, unknown>;

describe("loadYamlReply", () => {
  it("round-trips a library case written by js-yaml (Agent 4's parser)", () => {
    const reply = loadYamlReply(jsYaml.dump(caseObj), (t) => jsYaml.load(t));
    expect(reply.sanitized).toBe(false);
    expect(reply.value).toEqual(caseObj);
  });

  it("round-trips a library case written by yaml (Agent 3's parser)", () => {
    const reply = loadYamlReply(stringifyYaml(caseObj), (t) => parseYaml(t));
    expect(reply.sanitized).toBe(false);
    expect(reply.value).toEqual(caseObj);
  });

  it("known positive: sanitising first corrupts the same case", () => {
    expect(jsYaml.load(sanitizeYaml(jsYaml.dump(caseObj)))).not.toEqual(caseObj);
  });

  it("still sanitises when the reply is not YAML as written", () => {
    const raw = "CASE:\n  title: \"Thin\" trailing words\n  steps: 3";
    expect(() => jsYaml.load(raw)).toThrow();
    const reply = loadYamlReply(raw, (t) => jsYaml.load(t));
    expect(reply.sanitized).toBe(true);
    expect(reply.value).toEqual({ CASE: { title: "Thin", steps: 3 } });
  });

  it("does not accept a bare string or list as the reply", () => {
    expect(loadYamlReply("just a sentence of prose", (t) => jsYaml.load(t)).sanitized).toBe(true);
    expect(loadYamlReply("- a\n- b", (t) => jsYaml.load(t)).sanitized).toBe(true);
  });
});

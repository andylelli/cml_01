/**
 * X3 (architecture/REVIEW_05.md §12.3) — the logging switches accept what the rest of the pipeline
 * accepts.
 *
 * Three of the four parsers that used to exist read only the literal string `"true"`, so
 * `LOG_FULL_PROMPTS_TO_FILE=1` silently disabled full-prompt logging. `logs/llm-prompts-full.jsonl`
 * is the only cost surface this project trusts, and a run with it switched off is indistinguishable
 * from a run that was never made — after the money has been spent.
 */

import { describe, expect, it } from "vitest";
import { parseEnvBool } from "../jobs/cli-runtime.js";

describe("parseEnvBool (X3)", () => {
  it("accepts every truthy form the pipeline's own flags accept", () => {
    for (const truthy of ["1", "true", "TRUE", "True", "yes", "YES", "on", "ON"]) {
      expect(parseEnvBool(truthy, false), truthy).toBe(true);
    }
  });

  it("rejects the falsy forms rather than treating anything non-empty as set", () => {
    for (const falsy of ["0", "false", "FALSE", "no", "off", "nope", "2"]) {
      expect(parseEnvBool(falsy, true), falsy).toBe(false);
    }
  });

  /**
   * `LOG_TO_FILE=` in a dotenv file is a key someone left blank, not an instruction to stop
   * logging. Reading it as false would switch off an evidence surface on the strength of a typo.
   */
  it("takes the default for undefined and for empty", () => {
    expect(parseEnvBool(undefined, true)).toBe(true);
    expect(parseEnvBool(undefined, false)).toBe(false);
    expect(parseEnvBool("", true)).toBe(true);
    expect(parseEnvBool("", false)).toBe(false);
  });
});

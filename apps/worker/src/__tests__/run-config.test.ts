import { describe, expect, it } from "vitest";

import { captureRunEnvironment } from "../jobs/run-config.js";
import { RUN_ENV_NAMES } from "../jobs/run-env-names.generated.js";

/**
 * CR-22 (ORC-05) — a run records the raw flag environment it saw. The names are generated from what the
 * code reads (flags:check keeps the file current); these pin what the record contains.
 */
describe("captureRunEnvironment", () => {
  it("records every read flag that is set, raw, and nothing else", () => {
    const record = captureRunEnvironment({ ENABLE_SCORING: "1", PROSE_ENGINE: "v2", NOT_A_FLAG: "x", AGENT2_CAST_CHECK: "" });
    expect(record.set).toEqual({ ENABLE_SCORING: "1", PROSE_ENGINE: "v2", AGENT2_CAST_CHECK: "" });
    expect(record.names_checked).toBe(RUN_ENV_NAMES.length);
  });

  it("the generated names are the pipeline's levers and carry no credential or endpoint", () => {
    for (const name of ["ENABLE_SCORING", "PROSE_ENGINE", "AGENT_PRE9_ENABLE_LLM_RETRIES", "HONEST_SCORERS"]) {
      expect(RUN_ENV_NAMES).toContain(name);
    }
    expect(RUN_ENV_NAMES.filter((n) => /KEY|SECRET|TOKEN|PASSWORD|CONNECTION|ENDPOINT|^AZURE_/i.test(n))).toEqual([]);
  });
});

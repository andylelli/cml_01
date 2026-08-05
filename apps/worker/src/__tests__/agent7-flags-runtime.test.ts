/**
 * REVIEW_05 §24 — Agent 7's flags must be readable AFTER dotenv runs.
 *
 * The defect these pin: static `import` statements are hoisted and evaluated before any top-level
 * statement in the importing file, and both the worker entry and every canary harness call dotenv's
 * `config()` after their imports. A module-level `const X = process.env.FLAG` therefore froze to its
 * default before `.env.local` was read — and `AGENT7_SCHEDULER_AUTHORITATIVE` is precisely the lever
 * N6 promotes across four paid runs.
 *
 * A test that only checked "returns true when the env var is set" would have passed against the
 * BROKEN version too, because vitest sets the variable before importing the module. So each case
 * below mutates `process.env` **after** the import above has already been evaluated — which is the
 * real load order, and the only arrangement that can tell a getter from a frozen const.
 */

import { afterEach, describe, expect, it } from "vitest";

import {
  isAgent7ClueJobAuthorityEnabled,
  isAgent7MechanismGateEnabled,
  isAgent7SchedulerAuthoritative,
  isAgent7SchedulerShadowEnabled,
} from "../jobs/agents/agent7-run.js";

const KEYS = [
  "AGENT7_SCHEDULER_SHADOW",
  "AGENT7_SCHEDULER_AUTHORITATIVE",
  "AGENT7_CLUE_JOB_AUTHORITY",
  "AGENT7_MECHANISM_GATE",
] as const;

afterEach(() => {
  for (const key of KEYS) delete process.env[key];
});

describe("agent 7 flags are read at call time, not at import time", () => {
  it("N6's lever flips when the environment is populated after import", () => {
    expect(isAgent7SchedulerAuthoritative()).toBe(false);
    process.env.AGENT7_SCHEDULER_AUTHORITATIVE = "1"; // as `.env.local` would, post-import
    expect(isAgent7SchedulerAuthoritative()).toBe(true);
  });

  it("the clue-job half flips independently of the pacing half", () => {
    process.env.AGENT7_SCHEDULER_AUTHORITATIVE = "1";
    expect(isAgent7ClueJobAuthorityEnabled()).toBe(false);
    process.env.AGENT7_CLUE_JOB_AUTHORITY = "on";
    expect(isAgent7ClueJobAuthorityEnabled()).toBe(true);
  });

  it("the default-ON flags can still be turned OFF from a file loaded after import", () => {
    // The mirror-image failure: a default-ON flag frozen at import cannot be silenced either.
    expect(isAgent7SchedulerShadowEnabled()).toBe(true);
    process.env.AGENT7_SCHEDULER_SHADOW = "0";
    expect(isAgent7SchedulerShadowEnabled()).toBe(false);

    expect(isAgent7MechanismGateEnabled()).toBe(true);
    process.env.AGENT7_MECHANISM_GATE = "off";
    expect(isAgent7MechanismGateEnabled()).toBe(false);
  });

  it("accepts the truthy set the rest of the pipeline accepts", () => {
    for (const value of ["1", "true", "yes", "on", "ON", "True"]) {
      process.env.AGENT7_SCHEDULER_AUTHORITATIVE = value;
      expect(isAgent7SchedulerAuthoritative()).toBe(true);
    }
    for (const value of ["0", "false", "no", "off"]) {
      process.env.AGENT7_SCHEDULER_AUTHORITATIVE = value;
      expect(isAgent7SchedulerAuthoritative()).toBe(false);
    }
  });
});

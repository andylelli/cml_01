/**
 * REVIEW_02 §4.2 — the t=0 capability guard.
 *
 * Both directions matter here, and the negative direction matters more: a guard that throws on a
 * valid configuration would abort every run, and a guard that silently downgrades an invalid one
 * would let a probe report "flag ON" while running the control arm.
 */

import { describe, expect, it } from "vitest";

import { FlagCapabilityError, assertFlagCapabilities } from "../jobs/flag-preflight.js";

const env = (overrides: Record<string, string>): NodeJS.ProcessEnv =>
  ({ ...overrides }) as unknown as NodeJS.ProcessEnv;

describe("assertFlagCapabilities — structured outputs", () => {
  it("THROWS when the flag is on and the transport cannot carry a schema", () => {
    expect(() => assertFlagCapabilities(env({ AGENT7_STRUCTURED_OUTPUT: "true" }))).toThrow(FlagCapabilityError);
    expect(() => assertFlagCapabilities(env({ AGENT7_STRUCTURED_OUTPUT: "true" }))).toThrow(
      /LLM_HTTP_TRANSPORT=true/,
    );
  });

  it("THROWS on the exact configuration that shipped — http transport, api-version too old", () => {
    expect(() =>
      assertFlagCapabilities(
        env({
          AGENT7_STRUCTURED_OUTPUT: "true",
          LLM_HTTP_TRANSPORT: "true",
          AZURE_OPENAI_API_VERSION: "2024-02-15-preview",
        }),
      ),
    ).toThrow(/2024-08-01-preview or later/);
  });

  it("PASSES when both conditions are met", () => {
    expect(() =>
      assertFlagCapabilities(
        env({
          AGENT7_STRUCTURED_OUTPUT: "true",
          LLM_HTTP_TRANSPORT: "true",
          AZURE_OPENAI_API_VERSION: "2024-10-21",
        }),
      ),
    ).not.toThrow();
  });

  it("says NOTHING when the flag is off — the default path must stay silent and fast", () => {
    expect(assertFlagCapabilities(env({ AZURE_OPENAI_API_VERSION: "2024-02-15-preview" }))).toEqual([]);
  });

  it("does not fire on an explicitly disabled flag", () => {
    expect(() => assertFlagCapabilities(env({ AGENT7_STRUCTURED_OUTPUT: "false" }))).not.toThrow();
  });
});

describe("assertFlagCapabilities — warnings", () => {
  it("records the non-standard transport on the run rather than throwing", () => {
    const warnings = assertFlagCapabilities(env({ LLM_HTTP_TRANSPORT: "true" }));
    expect(warnings.join(" ")).toMatch(/LLM_HTTP_TRANSPORT=true/);
  });

  it("warns that an over-limit batch size will be clamped", () => {
    const warnings = assertFlagCapabilities(env({ AGENT9_PROSE_BATCH_SIZE: "4" }));
    expect(warnings.join(" ")).toMatch(/clamped to 2/);
  });

  it("does not warn at the documented limit or below", () => {
    expect(assertFlagCapabilities(env({ AGENT9_PROSE_BATCH_SIZE: "2" }))).toEqual([]);
    expect(assertFlagCapabilities(env({ AGENT9_PROSE_BATCH_SIZE: "1" }))).toEqual([]);
  });
});

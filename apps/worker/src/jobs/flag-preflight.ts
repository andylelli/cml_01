/**
 * REVIEW_02 §4.2 — flag/capability preflight, run at t=0.
 *
 * THE PROBLEM IT REMOVES. `AGENT7_STRUCTURED_OUTPUT` was shipped with a probe instruction ("one run
 * per arm") against a transport that silently dropped the schema. Flipping it on would have sent a
 * malformed request at pipeline stage 13 — a non-retryable 400 after roughly £1.40 of a ~£1.50 run,
 * and the failure would have read as a schema bug rather than a config one.
 *
 * WHY IT THROWS RATHER THAN FALLING BACK. Silently degrading to `jsonMode` would let a probe report
 * "ran with the flag ON" while it actually ran the control arm. That is the exact defect class this
 * codebase has paid most for — a lever that reads as enabled and does nothing (A_70 §8.2's
 * `AGENT9_FULLSTORY_POLISH`, `AGENT9_MODEL_REGEN`, and the SDK strip itself). A misconfiguration
 * must not be able to masquerade as a measured arm. Aborting before the first LLM call costs
 * nothing; the never-abort rule protects a SHIPPABLE STORY at the release gate, not a config typo.
 *
 * WHERE IT RUNS. The top of `generateMystery`, before any agent — the one path every full run takes.
 * `AzureOpenAIClient.chat` carries the same refusal as a backstop for the direct-to-agent harnesses.
 */

import { isHttpTransportEnabled, supportsJsonSchema, MIN_JSON_SCHEMA_API_VERSION } from "@cml/llm-client";

export class FlagCapabilityError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FlagCapabilityError";
  }
}

const isOn = (value: string | undefined): boolean => value === "true" || value === "1";

/**
 * Throws on a configuration that cannot do what it claims. Returns warnings for configurations that
 * are merely surprising — a warning is for "this will work but you may not have meant it", never for
 * "this will fail later".
 */
export function assertFlagCapabilities(env: NodeJS.ProcessEnv = process.env): string[] {
  const warnings: string[] = [];

  if (isOn(env.AGENT7_STRUCTURED_OUTPUT)) {
    const apiVersion = env.AZURE_OPENAI_API_VERSION;
    if (!isHttpTransportEnabled(env)) {
      throw new FlagCapabilityError(
        "AGENT7_STRUCTURED_OUTPUT=true requires LLM_HTTP_TRANSPORT=true. The @azure/openai SDK " +
          "rebuilds response_format as {type} only, so the json_schema payload never reaches the " +
          "API and Agent 7 would take a non-retryable 400 at stage 13. Set LLM_HTTP_TRANSPORT=true " +
          "or unset AGENT7_STRUCTURED_OUTPUT. See architecture/REVIEW_02.md §2.1.",
      );
    }
    if (!supportsJsonSchema(apiVersion)) {
      throw new FlagCapabilityError(
        `AGENT7_STRUCTURED_OUTPUT=true requires AZURE_OPENAI_API_VERSION ${MIN_JSON_SCHEMA_API_VERSION} ` +
          `or later; it is currently ${apiVersion ? `"${apiVersion}"` : "unset"}. Structured outputs ` +
          "did not exist on older api-versions and the endpoint will reject the request.",
      );
    }
  }

  // Not fatal: the transport works for every call shape. But it changes error surfaces for the whole
  // pipeline, so a run must say on the record that it was not the standard path.
  if (isHttpTransportEnabled(env)) {
    warnings.push(
      "[REVIEW_02] LLM_HTTP_TRANSPORT=true — chat calls bypass the @azure/openai SDK (direct POST). " +
        "Schema-capable and reports cached prompt tokens; treat A/B comparisons against SDK-transport " +
        "runs as cross-transport.",
    );
  }

  // Owner decision 1 (2026-09-30): the AGENT9_PROSE_BATCH_SIZE clamp and the three AGENT9_GEOMETRY_* /
  // AGENT9_REGEN_AFTERMATH_REPEAT dependency checks guarded levers only the deleted v1 engine read.

  return warnings;
}

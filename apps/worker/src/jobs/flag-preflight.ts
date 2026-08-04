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

  // FLAG-AUDIT documents a hard limit of 2 (a chapter is ~1,913 completion tokens against a 4,000
  // maxTokens). The generator clamps; say so rather than silently honouring a different number than
  // the operator typed.
  const batch = Number(env.AGENT9_PROSE_BATCH_SIZE);
  if (Number.isFinite(batch) && batch > 2) {
    warnings.push(
      `[REVIEW_02] AGENT9_PROSE_BATCH_SIZE=${env.AGENT9_PROSE_BATCH_SIZE} exceeds the documented ` +
        "hard limit of 2 and will be clamped to 2 — a larger batch truncates mid-chapter against the " +
        "4,000-token reply ceiling.",
    );
  }

  // ── Agent 7.5 geometry (architecture/GEOMETRY-AGENT-DESIGN.md) ─────────────
  // Three levers with a dependency the flag names do not show. Each of these combinations produces a
  // run that READS as an enabled arm and silently executes the control — the precise defect class
  // this preflight exists for, and the reason it throws rather than degrading.
  const geometryStage = String(env.AGENT75_GEOMETRY ?? "").trim().toLowerCase();
  const geometryStageOff = ["off", "0", "false", "no"].includes(geometryStage);
  const acceptance = String(env.AGENT9_GEOMETRY_ACCEPTANCE ?? "").trim().toLowerCase();

  if (geometryStageOff && isOn(env.AGENT9_GEOMETRY_CONTRACT)) {
    throw new FlagCapabilityError(
      "AGENT9_GEOMETRY_CONTRACT=true requires AGENT75_GEOMETRY to be on (shadow or gate). With the " +
        "stage off there is no contract on ctx, so the prose prompt would silently omit every " +
        "geometry block and the run would report as the treatment arm while executing the control.",
    );
  }

  if (geometryStageOff && acceptance === "apply") {
    throw new FlagCapabilityError(
      "AGENT9_GEOMETRY_ACCEPTANCE=apply requires AGENT75_GEOMETRY to be on (shadow or gate). Without " +
        "a derived contract there is nothing to accept against, and the repair ladder would never fire.",
    );
  }

  if (isOn(env.AGENT9_REGEN_AFTERMATH_REPEAT) && acceptance !== "apply") {
    throw new FlagCapabilityError(
      "AGENT9_REGEN_AFTERMATH_REPEAT=true requires AGENT9_GEOMETRY_ACCEPTANCE=apply. The pass is " +
        "driven by the acceptance test's paragraph indices; in shadow the violation is recorded and " +
        "no repair is attempted, so the flag would gate a branch that cannot be reached.",
    );
  }

  return warnings;
}

/**
 * CR-20 (A1X-03) — the shell Agents 2b, 2c, 2d and 2e each wrote out: withValidationRetry around one JSON
 * chat call, the parse ladder, a structural check that throws (a retryable error), the label's running cost,
 * then the validation warnings/errors logged. What differs is passed in; nothing else does.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import { validateArtifact } from "@cml/cml";
import { parseLlmJson } from "./llm-json.js";
import { withValidationRetry } from "../utils/validation-retry-wrapper.js";

type ArtifactName = Parameters<typeof validateArtifact>[0];
type ChatMessages = Parameters<AzureOpenAIClient["chat"]>[0]["messages"];

export interface JsonArtifactSpec<T> {
  /** withValidationRetry's name, e.g. "Agent 2d (Temporal Context)". */
  agentName: string;
  /** The cost-tracker and log label, e.g. "Agent2d-TemporalContext". */
  label: string;
  /** Prefix of the two console lines after the loop, e.g. "[Agent 2d] Temporal context". */
  logName: string;
  schema: ArtifactName;
  /** 2b, 2c and 2d validate with `cost` and `durationMs` defaulted onto the payload; 2e validates it bare. */
  withRunMeta: boolean;
  maxAttempts: number;
  model: { temperature: number; max_tokens: number };
  runId?: string;
  projectId?: string;
  /** The truncation guard (parseLlmJson). ON at every generator since owner decision 3 (ORC-Q03). */
  guard: boolean;
  buildMessages: (previousErrors?: string[]) => ChatMessages;
  /** Throws a retryable error when the parsed value lacks what the generator needs. */
  structuralCheck: (value: T) => void;
}

export async function generateJsonArtifact<T>(
  client: AzureOpenAIClient,
  spec: JsonArtifactSpec<T>,
): Promise<{ result: T; cost: number; durationMs: number; attempts: number }> {
  const start = Date.now();
  const retryResult = await withValidationRetry({
    maxAttempts: spec.maxAttempts,
    agentName: spec.agentName,
    validationFn: (data) => {
      const payload = spec.withRunMeta
        ? {
            ...(data as Record<string, unknown>),
            cost: typeof (data as any)?.cost === "number" ? (data as any).cost : 0,
            durationMs: typeof (data as any)?.durationMs === "number" ? (data as any).durationMs : 0,
          }
        : data;
      const validation = validateArtifact(spec.schema, payload);
      return { valid: validation.valid, errors: validation.errors, warnings: validation.warnings };
    },
    generateFn: async (attempt, previousErrors) => {
      const response = await client.chat({
        messages: spec.buildMessages(previousErrors),
        temperature: spec.model.temperature,
        maxTokens: spec.model.max_tokens,
        jsonMode: true,
        logContext: {
          runId: spec.runId ?? "",
          projectId: spec.projectId ?? "",
          agent: spec.label,
          retryAttempt: attempt,
        },
      });
      const parsed = parseLlmJson<T>(response.content, { guard: spec.guard });
      if (parsed.truncated) {
        // A_65b Ph8 — truncation guard before repair (phantom-structure risk, the a3c2973f class)
        throw new Error("LLM payload looks completion-limit truncated (no closing brace) — refusing jsonrepair");
      }
      if (parsed.data === undefined) throw parsed.repairError;
      spec.structuralCheck(parsed.data);
      const cost = client.getCostTracker().getSummary().byAgent[spec.label] || 0;
      return { result: parsed.data, cost };
    },
  });

  if (retryResult.validationResult.warnings && retryResult.validationResult.warnings.length > 0) {
    console.warn(
      `${spec.logName} validation warnings:\n` +
      retryResult.validationResult.warnings.map((w) => `- ${w}`).join("\n")
    );
  }
  if (!retryResult.validationResult.valid) {
    console.error(
      `${spec.logName} failed validation after ${spec.maxAttempts} attempts:\n` +
      retryResult.validationResult.errors.map((e) => `- ${e}`).join("\n")
    );
  }
  return {
    result: retryResult.result as T,
    cost: retryResult.totalCost,
    durationMs: Date.now() - start,
    attempts: retryResult.attempts,
  };
}

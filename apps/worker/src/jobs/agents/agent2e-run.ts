/**
 * Agent 2e: Background Context Generator
 *
 * Extracted from mystery-orchestrator.ts. Runs generateBackgroundContext(),
 * handles scoring-path retry and schema validation, and writes ctx.backgroundContext.
 */

import { readModeFlag } from "./mode-flag.js";
import { scoreBackgroundPhase } from "./phase-scoring.js";
import {
  generateBackgroundContext,
  deriveBackgroundContext,
  BACKDROP_SUMMARY_STUB,
  type DeriveBackgroundContextInputs,
  type BackgroundContextArtifact,
} from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import {
  type OrchestratorContext,
  runStage,
  appendRetryFeedback,
  appendRetryFeedbackOptional,
} from "./shared.js";

export async function runAgent2e(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("background-context", "Generating background context...", 25);

  const setting = ctx.setting!;
  const cast = ctx.cast!;

  let backgroundContextResult: Awaited<ReturnType<typeof generateBackgroundContext>>;

  backgroundContextResult = await runStage(ctx, {
    agentId: "agent2e_background_context",
    phaseName: "Background Context",
    generate: async (retryFeedback?: string) => {
      const bgResult = await generateBackgroundContext(ctx.client, {
        settingRefinement: setting.setting,
        cast: cast.cast,
        theme: appendRetryFeedbackOptional(ctx.inputs.theme, retryFeedback),
        tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", retryFeedback),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      return { result: bgResult, cost: bgResult.cost };
    },
    score: async (bgResult) => scoreBackgroundPhase(bgResult.backgroundContext, setting.setting, cast.cast, ctx.warnings),
  });

  ctx.backgroundContext = backgroundContextResult.backgroundContext;

  const backgroundContextValidation = validateArtifact("background_context", ctx.backgroundContext);
  if (!backgroundContextValidation.valid) {
    backgroundContextValidation.errors.forEach((error) =>
      ctx.errors.push(`Background context schema failure: ${error}`)
    );
    throw new Error("Background context artifact failed schema validation");
  }
  backgroundContextValidation.warnings.forEach((warning) =>
    ctx.warnings.push(`Background context schema warning: ${warning}`)
  );

  // Shadow comparison: prove the deterministic deriveBackgroundContext reproduces the live
  // Agent 2e artifact's COPIED/DERIVED fields (everything except backdropSummary) from the
  // upstream setting (Agent 1) + cast (Agent 2) artifacts. This is the "stage is deletable"
  // evidence (documentation/12_system_redesign/06_agent_2e_background_context.md §4, §9).
  // Default OFF; when AGENT2E_DERIVE_BACKGROUND is set (on) it LOGS a field-match summary into
  // warnings WITHOUT changing behavior. try/catch so it can never break the run.
  const deriveMode = readModeFlag(process.env.AGENT2E_DERIVE_BACKGROUND);
  if (deriveMode) {
    try {
      const live = ctx.backgroundContext;
      const deriveInputs: DeriveBackgroundContextInputs = {
        setting: setting.setting,
        cast: cast.cast,
        // Pass the live creative sentence so backdropSummary lines up; if absent, the stub.
        backdropSummary: live.backdropSummary || BACKDROP_SUMMARY_STUB,
        ...(ctx.inputs.theme ? { theme: ctx.inputs.theme } : {}),
      };
      const derived = deriveBackgroundContext(deriveInputs);

      // Compare only the DETERMINISTIC fields (backdropSummary is the lone creative field and
      // is intentionally excluded from the match count).
      const deterministicFields: Array<keyof BackgroundContextArtifact> = [
        "status",
        "era",
        "setting",
        "castAnchors",
        "theme",
      ];
      const mismatches: Array<keyof BackgroundContextArtifact> = [];
      let matched = 0;
      for (const field of deterministicFields) {
        if (JSON.stringify(derived[field]) === JSON.stringify(live[field])) {
          matched += 1;
        } else {
          mismatches.push(field);
        }
      }
      const total = deterministicFields.length;

      ctx.warnings.push(
        // A1X-D12: this said "only backdropSummary differs" whatever the count; it names the mismatches now.
        `[agent2e-derive][shadow] deterministic fields matched: ${matched}/${total}` +
          (mismatches.length ? `; mismatched: ${mismatches.join(", ")}` : "") +
          "; backdropSummary (creative) is not compared"
      );
      for (const field of mismatches) {
        ctx.warnings.push(
          `[agent2e-derive][shadow] mismatch in "${String(field)}": derived=${JSON.stringify(derived[field])} live=${JSON.stringify(live[field])}`
        );
      }
    } catch (err) {
      ctx.warnings.push(`[agent2e-derive][shadow] derive error: ${(err as Error).message}`);
    }
  }

  ctx.reportProgress("background-context", "Background context generated", 28);
}

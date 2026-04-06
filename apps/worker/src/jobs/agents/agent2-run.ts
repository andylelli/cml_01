/**
 * Agent 2: Cast & Motive Designer
 *
 * Extracted from mystery-orchestrator.ts. Runs designCast(), handles
 * scoring-path retry and schema-repair retry, and writes ctx.cast.
 */

import {
  designCast,
  generateCastNames,
  type NameGeneratorContext,
} from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { CastDesignScorer } from "@cml/story-validation";
import { adaptCastForScoring } from "../scoring-adapters/index.js";
import {
  type OrchestratorContext,
  executeAgentWithRetry,
  appendRetryFeedback,
} from "./shared.js";

/**
 * Normalise common LLM field-name variants in a raw cast artifact.
 * Handles snake_case crimeDynamics keys, missing required array fields,
 * and relationships returned as a bare array instead of { pairs: [...] }.
 * Mutates the object in place — call before validateArtifact.
 */
function normaliseCastOutput(castRaw: Record<string, unknown>): void {
  // --- crimeDynamics: snake_case → camelCase ---
  const cd = ((castRaw.crimeDynamics ?? {}) as Record<string, unknown>);
  if (!cd.possibleCulprits && cd.possible_culprits)         { cd.possibleCulprits = cd.possible_culprits; }
  if (!cd.redHerrings && cd.red_herrings)                   { cd.redHerrings = cd.red_herrings; }
  if (!cd.victimCandidates && cd.victim_candidates)         { cd.victimCandidates = cd.victim_candidates; }
  if (!cd.detectiveCandidates && cd.detective_candidates)   { cd.detectiveCandidates = cd.detective_candidates; }

  // --- crimeDynamics: ensure all required arrays are present, deriving from characters if needed ---
  const characters = Array.isArray(castRaw.characters)
    ? (castRaw.characters as Array<Record<string, unknown>>)
    : [];
  const nonDetectiveNames = characters
    .filter((c) => String(c.roleArchetype ?? "").toLowerCase() !== "detective" && c.name)
    .map((c) => String(c.name));
  const detectiveNames = characters
    .filter((c) => String(c.roleArchetype ?? "").toLowerCase() === "detective" && c.name)
    .map((c) => String(c.name));
  if (!Array.isArray(cd.possibleCulprits) || (cd.possibleCulprits as unknown[]).length === 0) {
    cd.possibleCulprits = nonDetectiveNames.slice(0, Math.min(3, nonDetectiveNames.length));
  }
  if (!Array.isArray(cd.redHerrings)) {
    cd.redHerrings = [];
  }
  if (!Array.isArray(cd.victimCandidates) || (cd.victimCandidates as unknown[]).length === 0) {
    cd.victimCandidates = nonDetectiveNames.slice(0, 1);
  }
  if (!Array.isArray(cd.detectiveCandidates) || (cd.detectiveCandidates as unknown[]).length === 0) {
    cd.detectiveCandidates = detectiveNames.length > 0 ? detectiveNames : nonDetectiveNames.slice(0, 1);
  }
  castRaw.crimeDynamics = cd;

  // --- relationships: normalise to { pairs: [...] } if LLM returned a bare array ---
  const rels = castRaw.relationships;
  if (Array.isArray(rels)) {
    castRaw.relationships = { pairs: rels };
  } else if (rels !== null && typeof rels === "object") {
    const relObj = rels as Record<string, unknown>;
    if (!Array.isArray(relObj.pairs) && Array.isArray((relObj as any).characters)) {
      relObj.pairs = (relObj as any).characters;
    } else if (!Array.isArray(relObj.pairs)) {
      relObj.pairs = [];
    }
  }
}

export async function runAgent2(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("cast", "Designing cast and motives...", 12);

  const setting = ctx.setting!;
  const totalCastSize = ctx.inputs.castNames?.length || (ctx.inputs.castSize || 6) + 1;
  const nameContext: NameGeneratorContext = {
    decade: parseInt(String(setting.setting.era.decade), 10) || undefined,
    locationType: setting.setting.location.type,
    locationDescription: setting.setting.location.description,
    socialContext: setting.setting.era.socialNorms.join(", "),
  };
  const effectiveCastNames = ctx.inputs.castNames ?? generateCastNames(ctx.runId, totalCastSize, nameContext);

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent2_cast",
      "Cast Design",
      async (retryFeedback?: string) => {
        const castResult = await designCast(ctx.client, {
          characterNames: effectiveCastNames,
          castSize: totalCastSize,
          setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
          crimeType: "Murder",
          tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", retryFeedback),
          socialContext: setting.setting.era.socialNorms.join(", "),
          detectiveType: ctx.inputs.detectiveType,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        return { result: castResult, cost: castResult.cost };
      },
      async (castResult) => {
        const scorer = new CastDesignScorer();
        const adapted = adaptCastForScoring(castResult.cast);
        const scorerInput = {
          cast_size: ctx.inputs.castNames?.length || (ctx.inputs.castSize || 6) + 1,
        };
        const score = await scorer.score(scorerInput, adapted, {
          previous_phases: { agent1_setting: setting.setting },
          cml: undefined as any,
          threshold_config: { mode: "standard" },
        });
        return { adapted, score };
      },
      ctx.retryManager,
      ctx.scoreAggregator,
      ctx.scoringLogger,
      ctx.runId,
      ctx.projectId || "",
      ctx.warnings,
      ctx.savePartialReport,
    );
    ctx.cast = result;
    ctx.agentCosts["agent2_cast"] = cost;
    ctx.agentDurations["agent2_cast"] = duration;
  } else {
    const castStart = Date.now();
    ctx.cast = await designCast(ctx.client, {
      characterNames: effectiveCastNames,
      castSize: totalCastSize,
      setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
      crimeType: "Murder",
      tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
      socialContext: setting.setting.era.socialNorms.join(", "),
      detectiveType: ctx.inputs.detectiveType,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.agentCosts["agent2_cast"] = ctx.cast.cost;
    ctx.agentDurations["agent2_cast"] = Date.now() - castStart;
  }

  const cast = ctx.cast!;

  // Normalise field-name variants (snake_case → camelCase, missing arrays, relationships shape)
  // before schema validation so cosmetic LLM formatting differences don't abort the pipeline.
  normaliseCastOutput((cast.cast as unknown) as Record<string, unknown>);

  if (cast.cast.diversity.stereotypeCheck.length > 0) {
    ctx.errors.push(...cast.cast.diversity.stereotypeCheck.map((w: string) => `Agent 2: ${w}`));
    throw new Error("Cast design failed stereotype guardrails");
  }

  const castValidationPayload = {
    ...((cast.cast as unknown) as Record<string, unknown>),
    cost: cast.cost,
    latencyMs: cast.latencyMs,
  };
  let castSchemaValidation = validateArtifact("cast_design", castValidationPayload);
  if (!castSchemaValidation.valid) {
    ctx.warnings.push("Cast design failed schema validation on first attempt; retrying cast generation with schema repair guardrails");
    const schemaRepairGuardrails = [
      "Return a valid cast_design artifact that strictly matches required schema fields and types.",
      ...castSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
    ];
    const castSchemaRetryStart = Date.now();
    const retriedCast = await designCast(ctx.client, {
      characterNames: effectiveCastNames,
      castSize: totalCastSize,
      setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
      crimeType: "Murder",
      tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
      socialContext: setting.setting.era.socialNorms.join(", "),
      detectiveType: ctx.inputs.detectiveType,
      qualityGuardrails: schemaRepairGuardrails,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.agentCosts["agent2_cast"] = (ctx.agentCosts["agent2_cast"] || 0) + retriedCast.cost;
    ctx.agentDurations["agent2_cast"] = (ctx.agentDurations["agent2_cast"] || 0) + (Date.now() - castSchemaRetryStart);
    normaliseCastOutput((retriedCast.cast as unknown) as Record<string, unknown>);
    const retriedPayload = {
      ...((retriedCast.cast as unknown) as Record<string, unknown>),
      cost: retriedCast.cost,
      latencyMs: retriedCast.latencyMs,
    };
    const retryValidation = validateArtifact("cast_design", retriedPayload);
    if (!retryValidation.valid) {
      retryValidation.errors.forEach((error) => ctx.errors.push(`Cast schema failure: ${error}`));
      const errorSummary = retryValidation.errors.slice(0, 3).join("; ");
      throw new Error(`Cast artifact failed schema validation: ${errorSummary}`);
    }
    ctx.cast = retriedCast;
    castSchemaValidation = retryValidation;
    ctx.warnings.push("Cast design schema-repair retry succeeded");
  }
  castSchemaValidation.warnings.forEach((warning) => ctx.warnings.push(`Cast schema warning: ${warning}`));

  ctx.reportProgress("cast", `Cast designed (${ctx.cast!.cast.characters.length} characters)`, 25);
}

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
  preAgent9LlmRetriesEnabled,
  preAgent9ContractRecoveryEnabled,
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

  // --- characters: coerce enum-like fields to valid schema values ---
  // Prevent deterministic-mode schema aborts for near-miss enum values.
  const normaliseMotiveStrength = (value: unknown): "weak" | "moderate" | "strong" | "compelling" => {
    const raw = String(value ?? "").trim().toLowerCase();
    if (raw === "weak" || raw === "moderate" || raw === "strong" || raw === "compelling") {
      return raw;
    }
    if (/compell|overwhelm|extreme|decisive|certain/.test(raw)) return "compelling";
    if (/strong|high|powerful|major|serious/.test(raw)) return "strong";
    if (/moderate|medium|mixed|balanced/.test(raw)) return "moderate";
    if (/weak|low|minor|slight|none|n\/a|na|unknown|unclear/.test(raw)) return "weak";
    return "moderate";
  };

  const normaliseAccessPlausibility = (value: unknown): "impossible" | "unlikely" | "possible" | "easy" => {
    const raw = String(value ?? "").trim().toLowerCase();
    if (raw === "impossible" || raw === "unlikely" || raw === "possible" || raw === "easy") {
      return raw;
    }
    if (/certain|definite|guarant|easy|high|sure/.test(raw)) return "easy";
    if (/like|probable|often|common|frequent/.test(raw)) return "possible";
    if (/unlike|improbab|rare|seldom|difficult|hard/.test(raw)) return "unlikely";
    if (/impossible|never|no.access|barred/.test(raw)) return "impossible";
    return "possible";
  };

  const normaliseGender = (value: unknown): "male" | "female" | "non-binary" | undefined => {
    const raw = String(value ?? "").trim().toLowerCase();
    if (!raw) return undefined;
    if (raw === "male" || raw === "female" || raw === "non-binary") return raw;
    if (/^m(ale)?$|^man$|^boy$/.test(raw)) return "male";
    if (/^f(emale)?$|^woman$|^girl$/.test(raw)) return "female";
    if (/non[-\s]?binary|\benby\b|^nb$/.test(raw)) return "non-binary";
    return undefined;
  };

  const normaliseRelationshipTension = (value: unknown): "none" | "low" | "moderate" | "high" => {
    const raw = String(value ?? "").trim().toLowerCase();
    if (raw === "none" || raw === "low" || raw === "moderate" || raw === "high") {
      return raw;
    }
    if (/none|no\s*tension|neutral|calm/.test(raw)) return "none";
    if (/low|mild|minor|slight/.test(raw)) return "low";
    if (/moderate|medium|mixed/.test(raw)) return "moderate";
    if (/high|severe|intense|strong/.test(raw)) return "high";
    return "moderate";
  };

  for (const character of characters) {
    if (character.motiveStrength === undefined && character.motive_strength !== undefined) {
      character.motiveStrength = character.motive_strength;
    }
    if (character.accessPlausibility === undefined && character.access_plausibility !== undefined) {
      character.accessPlausibility = character.access_plausibility;
    }
    character.motiveStrength = normaliseMotiveStrength(character.motiveStrength);
    character.accessPlausibility = normaliseAccessPlausibility(character.accessPlausibility);
    if (character.gender !== undefined) {
      const normalisedGender = normaliseGender(character.gender);
      if (normalisedGender) {
        character.gender = normalisedGender;
      } else {
        delete character.gender;
      }
    }
  }

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

  const castNames = characters
    .map((c) => String(c.name ?? "").trim())
    .filter((name) => name.length > 0);

  const relationshipContainer =
    castRaw.relationships !== null && typeof castRaw.relationships === "object"
      ? (castRaw.relationships as Record<string, unknown>)
      : ((castRaw.relationships = {}) as Record<string, unknown>);

  const existingPairs = Array.isArray(relationshipContainer.pairs)
    ? (relationshipContainer.pairs as Array<Record<string, unknown>>)
    : [];

  for (const pair of existingPairs) {
    if (pair && typeof pair === "object") {
      pair.tension = normaliseRelationshipTension(pair.tension);
    }
  }

  const hasCastReferencedRelationship = existingPairs.some((pair) => {
    const c1 = String(pair.character1 ?? "").trim();
    const c2 = String(pair.character2 ?? "").trim();
    return castNames.includes(c1) && castNames.includes(c2) && c1 !== c2;
  });

  if (castNames.length >= 2 && (!hasCastReferencedRelationship || existingPairs.length === 0)) {
    const fallbackPairs: Array<{
      character1: string;
      character2: string;
      relationship: string;
      tension: "none" | "low" | "moderate" | "high";
      sharedHistory: string;
    }> = [];

    // Ring topology guarantees each character gets at least two references when cast size >= 3.
    for (let i = 0; i < castNames.length; i += 1) {
      const character1 = castNames[i];
      const character2 = castNames[(i + 1) % castNames.length];
      if (character1 === character2) continue;
      fallbackPairs.push({
        character1,
        character2,
        relationship: "social acquaintance",
        tension: "moderate",
        sharedHistory: "They have ongoing social friction connected to the case environment.",
      });
    }

    // For two-character edge cases, add reverse edge so density is >= 2 per character.
    if (castNames.length === 2) {
      fallbackPairs.push({
        character1: castNames[1],
        character2: castNames[0],
        relationship: "social acquaintance",
        tension: "moderate",
        sharedHistory: "They have ongoing social friction connected to the case environment.",
      });
    }

    relationshipContainer.pairs = fallbackPairs;
  }

  // --- diversity: coerce string fields to string[] ---
  // gpt-4.1-mini returns a single string for recommendations/stereotypeCheck when
  // it has one unified thought. The schema requires string[]; wrap rather than abort.
  const div = castRaw.diversity;
  if (div !== null && typeof div === 'object') {
    const divObj = div as Record<string, unknown>;
    if (typeof divObj.recommendations === 'string') {
      divObj.recommendations = divObj.recommendations ? [divObj.recommendations] : [];
    } else if (!Array.isArray(divObj.recommendations)) {
      divObj.recommendations = [];
    }
    if (typeof divObj.stereotypeCheck === 'string') {
      divObj.stereotypeCheck = divObj.stereotypeCheck ? [divObj.stereotypeCheck] : [];
    } else if (!Array.isArray(divObj.stereotypeCheck)) {
      divObj.stereotypeCheck = [];
    }
  }
}

export async function runAgent2(ctx: OrchestratorContext): Promise<void> {
  const retriesEnabled = preAgent9LlmRetriesEnabled();
  const contractRecoveryEnabled = preAgent9ContractRecoveryEnabled();
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
          characterGenders: ctx.inputs.castGenders,
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
      characterGenders: ctx.inputs.castGenders,
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
    if (!contractRecoveryEnabled) {
      castSchemaValidation.errors.forEach((error) => ctx.errors.push(`Cast schema failure: ${error}`));
      const errorSummary = castSchemaValidation.errors.slice(0, 3).join("; ");
      throw new Error(`Cast artifact failed schema validation (contract recovery disabled): ${errorSummary}`);
    }
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

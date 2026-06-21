/**
 * Agent 2c: Location Profiles
 *
 * Extracted from mystery-orchestrator.ts. Runs generateLocationProfiles()
 * via executeAgentWithRetry when scoring is enabled, validates against schema,
 * and writes ctx.locationProfiles.
 */

import { generateLocationProfiles, compileSensoryAtoms, extractLocationSpine, checkLocationSpine } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { LocationProfilesScorer } from "@cml/story-validation";
import {
  type OrchestratorContext,
  appendRetryFeedback,
  executeAgentWithRetry,
} from "./shared.js";
import { adaptLocationsForScoring } from "../scoring-adapters/index.js";

const CONJUGATED_VERB_RE = /\b(is|are|was|were|has|have|had|set|ran|stood|made|gave|filled|hung|crackled|ticked|gleamed|drifted|carried|rose|fell|swept|lay|sat|pooled|cast|played|echoed)\b/i;

const DEFAULT_SENSORY_FALLBACKS: Record<"sights" | "sounds" | "smells" | "tactile", string[]> = {
  sights: ["dim gaslight pooling on polished wood", "narrow shadows along the corridor"] ,
  sounds: ["muffled footsteps in the passage", "the faint tick of a mantel clock"],
  smells: ["coal smoke and furniture polish", "damp wool and old paper"],
  tactile: ["cold brass on the banister", "draft-cool air near the doorway"],
};

const normalizeSensoryPhrase = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const normalized = value
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/g, "")
    .trim();
  if (normalized.length === 0) return "";
  if (CONJUGATED_VERB_RE.test(normalized) && normalized.split(/\s+/).length > 4) {
    return "";
  }
  return normalized;
};

const buildLocationFallback = (locationName: string, field: "sights" | "sounds" | "smells" | "tactile"): string => {
  const lowerName = locationName.trim().toLowerCase() || "the room";
  switch (field) {
    case "sights":
      return `shadowed corners in ${lowerName}`;
    case "sounds":
      return `subdued noise carrying through ${lowerName}`;
    case "smells":
      return `stale air lingering in ${lowerName}`;
    case "tactile":
      return `cold surfaces at ${lowerName}`;
  }
};

const enforceLocationSensoryFallbacks = (locationProfiles: any, warnings: string[]): any => {
  if (!locationProfiles || typeof locationProfiles !== "object") return locationProfiles;
  const keyLocations = Array.isArray(locationProfiles.keyLocations) ? locationProfiles.keyLocations : [];
  let fallbackInsertions = 0;

  for (const location of keyLocations) {
    if (!location || typeof location !== "object") continue;
    const locationName = String((location as any).name ?? (location as any).id ?? "the room");
    const sensoryDetails = ((location as any).sensoryDetails ??= {});

    for (const field of ["sights", "sounds", "smells", "tactile"] as const) {
      const existing = Array.isArray(sensoryDetails[field]) ? sensoryDetails[field] : [];
      const normalized = Array.from(new Set(existing.map(normalizeSensoryPhrase).filter(Boolean)));
      while (normalized.length < 2) {
        const fallbackPool = DEFAULT_SENSORY_FALLBACKS[field];
        const fallback = fallbackPool[normalized.length] ?? buildLocationFallback(locationName, field);
        normalized.push(fallback);
        fallbackInsertions += 1;
      }
      sensoryDetails[field] = normalized;
    }

    const sensoryVariants = Array.isArray((location as any).sensoryVariants)
      ? (location as any).sensoryVariants
      : [];
    for (const variant of sensoryVariants) {
      if (!variant || typeof variant !== "object") continue;
      for (const field of ["sights", "sounds", "smells"] as const) {
        const variantEntries = Array.isArray((variant as any)[field]) ? (variant as any)[field] : [];
        const normalizedVariant = Array.from(new Set(variantEntries.map(normalizeSensoryPhrase).filter(Boolean)));
        if (normalizedVariant.length === 0) {
          normalizedVariant.push((sensoryDetails[field] ?? [])[0] ?? buildLocationFallback(locationName, field));
          fallbackInsertions += 1;
        }
        (variant as any)[field] = normalizedVariant;
      }
    }
  }

  if (fallbackInsertions > 0) {
    warnings.push(
      `Agent 2c: inserted ${fallbackInsertions} deterministic sensory fallback phrase(s) for location profile grounding.`,
    );
  }

  return locationProfiles;
};

export async function runAgent2c(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("location-profiles", "Generating location profiles...", 89);

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent2c_location_profiles",
      "Location Profiles",
      async (retryFeedback?: string) => {
        const locResult = await generateLocationProfiles(ctx.client, {
          settingRefinement: ctx.setting!.setting,
          caseData: ctx.cml!,
          narrative: ctx.narrative,
          tone: appendRetryFeedback(ctx.inputs.tone || "Classic", retryFeedback),
          targetWordCount: 1000,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        return { result: locResult, cost: locResult.cost };
      },
      async (locResult) => {
        const scorer = new LocationProfilesScorer();
        const adapted = adaptLocationsForScoring(locResult);
        const score = await scorer.score({}, adapted, {
          previous_phases: {
            agent1_setting: ctx.setting!.setting,
            agent2e_background_context: ctx.backgroundContext!,
          },
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
      ctx.savePartialReport
    );
    ctx.locationProfiles = compileSensoryAtoms(result);
    ctx.agentCosts["agent2c_location_profiles"] = cost;
    ctx.agentDurations["agent2c_location_profiles"] = duration;
  } else {
    const locationProfilesStart = Date.now();
    const rawProfiles = await generateLocationProfiles(ctx.client, {
      settingRefinement: ctx.setting!.setting,
      caseData: ctx.cml!,
      narrative: ctx.narrative!,
      tone: ctx.inputs.tone || "Classic",
      targetWordCount: 1000,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.locationProfiles = compileSensoryAtoms(rawProfiles);
    ctx.agentCosts["agent2c_location_profiles"] = rawProfiles.cost;
    ctx.agentDurations["agent2c_location_profiles"] = Date.now() - locationProfilesStart;
  }

  ctx.locationProfiles = enforceLocationSensoryFallbacks(ctx.locationProfiles, ctx.warnings);

  const validation = validateArtifact("location_profiles", ctx.locationProfiles);
  if (!validation.valid) {
    ctx.warnings.push("Agent 2c: Location profiles validation warnings:");
    validation.errors.forEach((e) => ctx.warnings.push(`  - ${e}`));
  }
  validation.warnings.forEach((w) => ctx.warnings.push(`  - Schema warning: ${w}`));

  // F5b: Warn if any sensoryDetails entry contains a conjugated verb — indicates the model
  // wrote a full sentence instead of a noun phrase, which bleeds into Agent 9 as prose.
  const sensoryBleedWarnings: string[] = [];
  for (const loc of (ctx.locationProfiles?.keyLocations ?? [])) {
    const details = (loc as any).sensoryDetails ?? {};
    for (const field of ['sights', 'sounds', 'smells', 'tactile'] as const) {
      for (const entry of (details[field] ?? []) as string[]) {
        if (CONJUGATED_VERB_RE.test(entry)) {
          sensoryBleedWarnings.push(`  - [${loc.id ?? 'unknown'}].sensoryDetails.${field}: "${entry}" (contains verb — should be noun phrase)`);
        }
      }
    }
    for (const variant of (loc as any).sensoryVariants ?? []) {
      for (const field of ['sights', 'sounds', 'smells'] as const) {
        for (const entry of (variant[field] ?? []) as string[]) {
          if (CONJUGATED_VERB_RE.test(entry)) {
            sensoryBleedWarnings.push(`  - [${loc.id ?? 'unknown'}].sensoryVariants[${variant.id ?? '?'}].${field}: "${entry}" (contains verb)`);
          }
        }
      }
    }
  }
  if (sensoryBleedWarnings.length > 0) {
    console.warn('[Agent 2c] F5b: sensoryDetails full-sentence bleed detected — these will be copied verbatim by Agent 9:');
    sensoryBleedWarnings.forEach((w) => { console.warn(w); ctx.warnings.push(w); });
  }

  // Phase-1 shadow: project the eager location "spine" and run its deterministic sanity check
  // for telemetry only. Default OFF; when AGENT2C_SPINE_CHECK is set (shadow/on) it LOGS findings
  // (missing purpose/accessControl, empty baseline palette, duplicate ids) into warnings WITHOUT
  // changing behavior — the deterministic foundation for the Agent 2c redesign
  // (documentation/12_system_redesign/04_agent_2c_location_profiles.md §4, §9). The enforcement
  // path (carrying the spine eagerly + lazy per-scene texture) waits on later phases.
  const spineCheckMode = (process.env.AGENT2C_SPINE_CHECK ?? "").trim().toLowerCase();
  if (spineCheckMode && spineCheckMode !== "off" && spineCheckMode !== "false" && spineCheckMode !== "0") {
    try {
      const spine = extractLocationSpine(ctx.locationProfiles!);
      const check = checkLocationSpine(spine);
      ctx.warnings.push(
        `[agent2c-spine-check][shadow] ${spine.places.length} place(s), ${check.issues.length} issue(s), ok=${check.ok}`,
      );
      for (const issue of check.issues) {
        ctx.warnings.push(`[agent2c-spine-check][shadow] ${issue}`);
      }
    } catch (err) {
      ctx.warnings.push(`[agent2c-spine-check][shadow] checker error: ${(err as Error).message}`);
    }
  }

  ctx.reportProgress(
    "location-profiles",
    `Location profiles generated (${ctx.locationProfiles?.keyLocations.length ?? 0} locations)`,
    89
  );
}

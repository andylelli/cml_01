/**
 * Agent 2c: Location Profiles
 *
 * Extracted from mystery-orchestrator.ts. Runs generateLocationProfiles()
 * via executeAgentWithRetry when scoring is enabled, validates against schema,
 * and writes ctx.locationProfiles.
 */

import {
  generateLocationProfiles,
  compileSensoryAtoms,
  extractLocationSpine,
  checkLocationSpine,
  parseSceneGateMode,
  checkLocationDistinctness,
  checkCrimeSceneProfiled,
  buildSceneGateFeedback,
} from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { LocationProfilesScorer, scoreRealLocations } from "@cml/story-validation";
import {
  type OrchestratorContext,
  appendRetryFeedback,
  executeAgentWithRetry,
  applyHonestScorer,
} from "./shared.js";
import { adaptLocationsForScoring } from "../scoring-adapters/index.js";

const CONJUGATED_VERB_RE = /\b(is|are|was|were|has|have|had|set|ran|stood|made|gave|filled|hung|crackled|ticked|gleamed|drifted|carried|rose|fell|swept|lay|sat|pooled|cast|played|echoed)\b/i;

// A_58 #6: a sensory entry is full-SENTENCE bleed only when it carries a finite verb AND is long enough
// to be a clause rather than a noun phrase. The length guard kills homograph false positives — several
// verbs above double as common sensory NOUNS/adjectives ("rose" the flower vs past-tense of rise, "cast",
// "lay", "set"), so a short noun phrase like "rain-speckled rose petals" must not be flagged as bleed.
// (Threshold mirrors the existing normalizeSensoryPhrase guard.)
export const isFullSentenceBleed = (entry: string): boolean =>
  CONJUGATED_VERB_RE.test(entry) && String(entry ?? "").trim().split(/\s+/).length > 4;

/**
 * Era- and setting-neutral sensory fallbacks, derived from the location itself.
 *
 * FOUND BY REVIEW, 2026-08-20. The pool these replace was a fixed list of Victorian English interior
 * details — "dim gaslight pooling on polished wood", "the faint tick of a mantel clock", "coal smoke
 * and furniture polish", "cold brass on the banister" — and the first TWO fallbacks for every field
 * came from it, so the generic per-location builder below was only ever reached from the third.
 *
 * That is a fix for one story's setting sitting on the path of a generator whose era, location and
 * institution are all parameters. On the canary's own 1950s configuration, gaslight and coal smoke
 * are anachronisms; on a liner, a theatre or anywhere outside a British house, a mantel clock and a
 * banister are furniture the story does not have. These reach Agent 9 as location profiles and are
 * written into prose — into ATMOSPHERE, one of the three categories that has never moved.
 *
 * MEASURED: 0 of 22 archived location_profiles contain any of the eight phrases, so the model has
 * always supplied its own and this never fired. Latent, not live — and removed rather than kept,
 * because a fallback that is wrong for most settings is worse than one that is merely plain.
 *
 * Every replacement names the location and nothing else, so it is true of any room in any era.
 */
const SENSORY_FALLBACK_VARIANTS: Record<"sights" | "sounds" | "smells" | "tactile", ReadonlyArray<(place: string) => string>> = {
  sights: [(p) => `shadowed corners in ${p}`, (p) => `uneven light across ${p}`],
  sounds: [(p) => `subdued noise carrying through ${p}`, (p) => `a faint sound somewhere beyond ${p}`],
  smells: [(p) => `stale air lingering in ${p}`, (p) => `a dry trace of dust in ${p}`],
  tactile: [(p) => `cold surfaces at ${p}`, (p) => `a draught moving through ${p}`],
};

/**
 * The invariant half of each fallback, for the distinctness gate to ignore.
 *
 * Derived from the templates rather than restated, so the two can never drift — the defect this
 * codebase has paid for more than any other. Each variant now NAMES the location, so two sparse
 * rooms no longer receive identical text at all; excluding the shared stem keeps the gate honest
 * about what it is not counting.
 */
const SENSORY_FALLBACK_ATOMS: string[] = ([
  ...SENSORY_FALLBACK_VARIANTS.sights,
  ...SENSORY_FALLBACK_VARIANTS.sounds,
  ...SENSORY_FALLBACK_VARIANTS.smells,
  ...SENSORY_FALLBACK_VARIANTS.tactile,
] as ReadonlyArray<(place: string) => string>).map((make) => make("").replace(/s+/g, " ").trim());

const normalizeSensoryPhrase = (value: unknown): string => {
  if (typeof value !== "string") return "";
  const normalized = value
    .replace(/\s+/g, " ")
    .replace(/[.!?]+$/g, "")
    .trim();
  if (normalized.length === 0) return "";
  if (isFullSentenceBleed(normalized)) {
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
    // Same normalisation buildLocationFallback uses, so both paths name the place identically.
    const lowerLocationName = locationName.trim().toLowerCase() || "the room";
    const sensoryDetails = ((location as any).sensoryDetails ??= {});

    for (const field of ["sights", "sounds", "smells", "tactile"] as const) {
      const existing = Array.isArray(sensoryDetails[field]) ? sensoryDetails[field] : [];
      const normalized = Array.from(new Set(existing.map(normalizeSensoryPhrase).filter(Boolean)));
      while (normalized.length < 2) {
        const variants = SENSORY_FALLBACK_VARIANTS[field];
        const variant = variants[normalized.length];
        const fallback = variant ? variant(lowerLocationName) : buildLocationFallback(locationName, field);
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
        return { adapted, score: applyHonestScorer(score, () => scoreRealLocations(locResult), ctx.warnings, "agent2c-location") };
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
      // R2 (architecture/REVIEW_01.md) — `narrative` is ALWAYS undefined here, by design.
      // ctx.narrative is assigned only in agent7-run, and Agent 7 runs long after 2c because
      // Agent 7 consumes these location profiles. The order cannot reverse without a cycle.
      // generateLocationProfiles declares the field optional and degrades cleanly (it derives
      // scene locations only when acts are present). This used to carry a `!` assertion, which
      // was a no-op at runtime but told every reader the value was available. It is not.
      narrative: ctx.narrative,
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
        if (isFullSentenceBleed(entry)) {
          sensoryBleedWarnings.push(`  - [${loc.id ?? 'unknown'}].sensoryDetails.${field}: "${entry}" (full-sentence bleed — should be noun phrase)`);
        }
      }
    }
    for (const variant of (loc as any).sensoryVariants ?? []) {
      for (const field of ['sights', 'sounds', 'smells'] as const) {
        for (const entry of (variant[field] ?? []) as string[]) {
          if (isFullSentenceBleed(entry)) {
            sensoryBleedWarnings.push(`  - [${loc.id ?? 'unknown'}].sensoryVariants[${variant.id ?? '?'}].${field}: "${entry}" (full-sentence bleed)`);
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

  // ── P2.3: Crime-scene profiling (T2.7) + cross-location distinctness gate (T2.8) ──
  // Default OFF (AGENT2C_SCENE_GATE unset) ⇒ skipped, byte-identical. shadow ⇒ surface findings as
  // warnings only. enforce ⇒ bounded regenerate-with-feedback while a gate fails, accept the best
  // candidate (fewest issues), re-validate schema each time, never throw. Runs on the raw
  // KeyLocation.sensoryDetails arrays (before any lossy scoring adaptation).
  const sceneGateMode = parseSceneGateMode(process.env.AGENT2C_SCENE_GATE);
  if (sceneGateMode !== "off" && ctx.locationProfiles) {
    // Exclude the deterministic fallback atoms from the distinctness comparison — they are injected
    // identically into every sparse room, so counting them would make distinct rooms collide.
    const distinctnessOpts = { ignoreAtoms: SENSORY_FALLBACK_ATOMS };
    // NOTE: the outline (and thus the actual murder room) is not known at 2c time, and CASE.meta
    // .setting.location is the broad setting, not a room — so we do NOT pass it as a crime-scene
    // hint (it would mismatch every room and force needless retries). The gate only verifies that a
    // crime-scene-purposed location exists; the room-accuracy fix needs the deferred 2c-after-7 reorder.
    const countIssues = (profiles: typeof ctx.locationProfiles): number => {
      const d = checkLocationDistinctness(profiles, distinctnessOpts);
      const c = checkCrimeSceneProfiled(profiles);
      return d.issues.length + (c.ok ? 0 : 1);
    };

    const boundedRetries =
      sceneGateMode === "enforce"
        ? Math.min(2, Math.max(0, Math.trunc(Number(process.env.AGENT2C_SCENE_GATE_MAX_RETRIES ?? 1)) || 0))
        : 0;

    let bestProfiles = ctx.locationProfiles;
    let bestIssues = countIssues(bestProfiles);
    let attempt = 0;
    while (sceneGateMode === "enforce" && bestIssues > 0 && attempt < boundedRetries) {
      attempt += 1;
      const feedback = buildSceneGateFeedback(
        checkLocationDistinctness(bestProfiles, distinctnessOpts),
        checkCrimeSceneProfiled(bestProfiles),
      );
      ctx.warnings.push(
        `[agent2c-scene-gate][enforce] ${bestIssues} issue(s) (attempt ${attempt}/${boundedRetries}); regenerating with distinctness/crime-scene feedback.`,
      );
      const regenStart = Date.now();
      // True marginal cost via byAgent delta — the generator's returned .cost is a cumulative total.
      const costLabel = "Agent2c-LocationProfiles";
      const costBefore = ctx.client.getCostTracker().getSummary().byAgent[costLabel] || 0;
      let regenerated: Awaited<ReturnType<typeof generateLocationProfiles>>;
      try {
        regenerated = await generateLocationProfiles(ctx.client, {
          settingRefinement: ctx.setting!.setting,
          caseData: ctx.cml!,
          narrative: ctx.narrative,
          tone: appendRetryFeedback(ctx.inputs.tone || "Classic", feedback),
          targetWordCount: 1000,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
      } catch (err) {
        // A gate must never kill a run: a regeneration failure keeps the best-so-far.
        ctx.warnings.push(`[agent2c-scene-gate][enforce] regeneration error: ${(err as Error).message}; keeping previous best.`);
        break;
      }
      const costAfter = ctx.client.getCostTracker().getSummary().byAgent[costLabel] || 0;
      ctx.agentCosts["agent2c_location_profiles"] =
        (ctx.agentCosts["agent2c_location_profiles"] || 0) + Math.max(0, costAfter - costBefore);
      ctx.agentDurations["agent2c_location_profiles"] =
        (ctx.agentDurations["agent2c_location_profiles"] || 0) + (Date.now() - regenStart);

      const candidate = enforceLocationSensoryFallbacks(compileSensoryAtoms(regenerated), ctx.warnings);
      const candidateValidation = validateArtifact("location_profiles", candidate);
      if (!candidateValidation.valid) {
        ctx.warnings.push(
          "[agent2c-scene-gate][enforce] regenerated candidate failed schema validation; keeping previous best.",
        );
        continue;
      }
      const candidateIssues = countIssues(candidate);
      if (candidateIssues < bestIssues) {
        bestProfiles = candidate;
        bestIssues = candidateIssues;
      }
    }
    ctx.locationProfiles = bestProfiles;

    // Surface the final findings (shadow always; enforce after exhaustion).
    const finalDistinct = checkLocationDistinctness(bestProfiles, distinctnessOpts);
    const finalCrimeScene = checkCrimeSceneProfiled(bestProfiles);
    const gateState =
      sceneGateMode === "enforce" ? (bestIssues === 0 ? "pass" : `accept-after-${attempt}`) : "shadow";
    ctx.warnings.push(
      `[agent2c-scene-gate][${sceneGateMode}] gate=${gateState} crimeScene=${finalCrimeScene.ok} ` +
        `distinctnessIssues=${finalDistinct.issues.length}`,
    );
    if (!finalCrimeScene.ok && finalCrimeScene.issue) {
      ctx.warnings.push(`[agent2c-scene-gate][${sceneGateMode}] ${finalCrimeScene.issue}`);
    }
    for (const issue of finalDistinct.issues) {
      ctx.warnings.push(
        `[agent2c-scene-gate][${sceneGateMode}] ${issue.a} ↔ ${issue.b}: ${issue.detail}`,
      );
    }
  }

  ctx.reportProgress(
    "location-profiles",
    `Location profiles generated (${ctx.locationProfiles?.keyLocations.length ?? 0} locations)`,
    89
  );
}

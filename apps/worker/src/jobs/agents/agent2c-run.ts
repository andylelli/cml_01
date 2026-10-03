/**
 * Agent 2c: Location Profiles
 *
 * Extracted from mystery-orchestrator.ts. Runs generateLocationProfiles()
 * via runUnscoredStage, validates against schema, scores the shipped profiles (A1X-Q02),
 * and writes ctx.locationProfiles.
 */

import { runBoundedGate } from "./quality-gate.js";
import { readModeFlag } from "./mode-flag.js";
import { recordShippedPhaseScore, runUnscoredStage, scoreLocationsPhase } from "./phase-scoring.js";
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
import {
  type OrchestratorContext,
  appendRetryFeedback,
} from "./shared.js";

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
] as ReadonlyArray<(place: string) => string>).map((make) => make("").replace(/\s+/g, " ").trim()); // A1X-D02: was /s+/g (the letter s)

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

export const enforceLocationSensoryFallbacks = (locationProfiles: any, warnings: string[]): any => {
  if (!locationProfiles || typeof locationProfiles !== "object") return locationProfiles;
  const keyLocations = Array.isArray(locationProfiles.keyLocations) ? locationProfiles.keyLocations : [];
  let fallbackInsertions = 0;

  for (const location of keyLocations) {
    if (!location || typeof location !== "object") continue;
    const locationName = String((location as any).name ?? (location as any).id ?? "the room");
    // A1X-07: the one place-name normalisation every fallback uses.
    const lowerLocationName = locationName.trim().toLowerCase() || "the room";
    const sensoryDetails = ((location as any).sensoryDetails ??= {});

    for (const field of ["sights", "sounds", "smells", "tactile"] as const) {
      const existing = Array.isArray(sensoryDetails[field]) ? sensoryDetails[field] : [];
      const normalized = Array.from(new Set(existing.map(normalizeSensoryPhrase).filter(Boolean)));
      while (normalized.length < 2) {
        // A1X-07: every table holds two variants and this loop runs at length 0 or 1, so the index is
        // always defined (the old `buildLocationFallback` branch was unreachable and restated variant 0).
        normalized.push(SENSORY_FALLBACK_VARIANTS[field][normalized.length](lowerLocationName));
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
          // A1X-07: sensoryDetails[field] was padded to >= 2 non-empty entries just above, so [0] is defined.
          normalizedVariant.push(sensoryDetails[field][0]);
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

  // CR-21 (ORC-02): the one generateLocationProfiles input — the scored attempt and the scene-gate regen.
  const locationInputs = (feedback?: string): Parameters<typeof generateLocationProfiles>[1] => ({
    settingRefinement: ctx.setting!.setting,
    caseData: ctx.cml!,
    tone: appendRetryFeedback(ctx.inputs.tone || "Classic", feedback),
    targetWordCount: 1000,
    runId: ctx.runId,
    projectId: ctx.projectId || "",
  });

  // A1X-Q02: generate here; the phase is scored below, on the profiles that ship (atoms compiled, fallbacks
  // enforced, after the scene gate).
  ctx.locationProfiles = compileSensoryAtoms(await runUnscoredStage(ctx, {
    agentId: "agent2c_location_profiles",
    phaseName: "Location Profiles",
    generate: async () => {
      const locResult = await generateLocationProfiles(ctx.client, locationInputs());
      return { result: locResult, cost: locResult.cost };
    },
  }));

  ctx.locationProfiles = enforceLocationSensoryFallbacks(ctx.locationProfiles, ctx.warnings);

  const validation = validateArtifact("location_profiles", ctx.locationProfiles);
  if (!validation.valid) {
    ctx.warnings.push("Agent 2c: Location profiles validation warnings:");
    validation.errors.forEach((e) => ctx.warnings.push(`  - ${e}`));
  }
  validation.warnings.forEach((w) => ctx.warnings.push(`  - Schema warning: ${w}`));

  // Phase-1 shadow: project the eager location "spine" and run its deterministic sanity check
  // for telemetry only. Default OFF; when AGENT2C_SPINE_CHECK is set (shadow/on) it LOGS findings
  // (missing purpose/accessControl, empty baseline palette, duplicate ids) into warnings WITHOUT
  // changing behavior — the deterministic foundation for the Agent 2c redesign
  // (documentation/12_system_redesign/04_agent_2c_location_profiles.md §4, §9). The enforcement
  // path (carrying the spine eagerly + lazy per-scene texture) waits on later phases.
  const spineCheckMode = readModeFlag(process.env.AGENT2C_SPINE_CHECK);
  if (spineCheckMode) {
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

    const { best: bestProfiles, verdict: bestIssues, attempts: attempt } = await runBoundedGate(ctx, {
      label: "agent2c-scene-gate",
      enforce: sceneGateMode === "enforce",
      maxRetries: boundedRetries,
      initial: ctx.locationProfiles,
      evaluate: countIssues,
      needsRetry: (issues) => issues > 0,
      feedback: (best) => buildSceneGateFeedback(
        checkLocationDistinctness(best, distinctnessOpts),
        checkCrimeSceneProfiled(best),
      ),
      retryWarning: (issues, n, max) =>
        `[agent2c-scene-gate][enforce] ${issues} issue(s) (attempt ${n}/${max}); regenerating with distinctness/crime-scene feedback.`,
      regenerate: (feedback) => generateLocationProfiles(ctx.client, locationInputs(feedback)),
      costLabel: "Agent2c-LocationProfiles",
      costKey: "agent2c_location_profiles",
      prepare: (raw) => enforceLocationSensoryFallbacks(compileSensoryAtoms(raw), ctx.warnings),
      validate: (candidate) => validateArtifact("location_profiles", candidate).valid,
      isBetter: (cand, cur) => cand.verdict < cur.verdict,
    });
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

  // A1X-Q02 (owner decision, 2026-10-02): the report scores the location profiles that ship, not the raw LLM output.
  await recordShippedPhaseScore(ctx, "agent2c_location_profiles", "Location Profiles", () =>
    scoreLocationsPhase(ctx.locationProfiles, ctx.setting!.setting, ctx.backgroundContext!, ctx.warnings));

  ctx.reportProgress(
    "location-profiles",
    `Location profiles generated (${ctx.locationProfiles?.keyLocations.length ?? 0} locations)`,
    89
  );
}

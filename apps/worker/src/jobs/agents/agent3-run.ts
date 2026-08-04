/**
 * Agent 3: CML Generator (+ Agent 4 auto-revision, + Agent 8 Novelty Auditor)
 *
 * Extracted from mystery-orchestrator.ts. Runs generateCML(), handles the
 * built-in Agent 4 auto-revision, records CML scoring, then runs the novelty
 * audit (Agent 8) with one retry on failure, and writes ctx.cml + ctx.noveltyAudit.
 */

import { generateCML, auditNovelty, findUnplantedDiscriminatingClues } from "@cml/prompts-llm";
import { createSkeletonExtractor, judgeNovelty, loadReferenceCorpus } from "@cml/novelty";
import { parseClockTime, validateCml } from "@cml/cml";
import type { PhaseScore, TestResult } from "@cml/story-validation";
import { scoreRealCml, getGenerationParams } from "@cml/story-validation";
import { type OrchestratorContext, preAgent9ContractRecoveryEnabled, preAgent9LlmRetriesEnabled, applyHonestScorer } from "./shared.js";
import { effectiveNoveltyThreshold, resolveNoveltyMode } from "../novelty-ledger.js";

function buildEvidenceFallback(step: any, stepIndex: number): string {
  const observation = String(step?.observation ?? "").trim();
  const correction = String(step?.correction ?? "").trim();
  const effect = String(step?.effect ?? "").trim();
  const source = observation || correction || effect;
  if (source.length > 0) {
    return `Corroborating evidence for step ${stepIndex}: ${source.slice(0, 140)}`;
  }
  return `Corroborating evidence for inference step ${stepIndex}.`;
}

function repairInferenceRequiredEvidence(cml: any): number {
  const caseBlock = cml?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps;
  if (!Array.isArray(steps)) {
    return 0;
  }

  let repairedCount = 0;
  for (let i = 0; i < steps.length; i += 1) {
    const step = steps[i];
    if (!step || typeof step !== "object") continue;
    if (Array.isArray(step.required_evidence) && step.required_evidence.length > 0) continue;

    step.required_evidence = [buildEvidenceFallback(step, i + 1)];
    repairedCount += 1;
  }

  return repairedCount;
}

function applyCmlRepairAndRevalidate(
  cmlResult: Awaited<ReturnType<typeof generateCML>>,
  ctx: OrchestratorContext,
  phase: string,
): Awaited<ReturnType<typeof generateCML>> {
  // A_53 P6 (inference-required-evidence-not-repaired-on-valid-path): repair empty required_evidence
  // UNCONDITIONALLY — a schema-VALID CML can still ship steps with required_evidence:[] (Agent 5
  // depends on it), so the prior early return on validity caused silent fair-play data loss. Only the
  // re-validation outcome is gated.
  const wasValid = cmlResult.validation.valid;
  const repairedCount = repairInferenceRequiredEvidence(cmlResult.cml as any);
  if (repairedCount === 0) {
    return cmlResult;
  }

  const repairedValidation = validateCml(cmlResult.cml as any);
  if (!repairedValidation.valid) {
    // Repair didn't yield a valid document — preserve the prior result/validation.
    return cmlResult;
  }

  ctx.warnings.push(
    `Agent 3: Auto-repaired required_evidence for ${repairedCount} inference step(s) during ${phase}` +
      (wasValid ? "." : " and recovered schema validity."),
  );
  return {
    ...cmlResult,
    validation: repairedValidation,
  };
}

/**
 * Do the case's temporal anchors agree with the times the story will actually print?
 *
 * FOUND 2026-08-04, on the first live geometry run. Two agents invent times from non-overlapping
 * inputs and nothing reconciles them:
 *
 *   Agent 3b designs the hard-logic device and locks its facts — `false_time_displayed`,
 *   `resumption_time`. Those are INJECTED into the prose, so they are what a reader sees.
 *   Agent 3 authors `hidden_model.mechanism.{apparent,actual}_time_of_death`, and its prompt
 *   receives only the device's mechanism FAMILY, never its locked times.
 *
 * On the 08-04 run the case said 8:15 / 7:15 and the manuscript said 3:45 / 4:10 — the case's two
 * anchors appeared **zero times in the finished story**, five and six times respectively for the
 * device's. Everything reading the mechanism (the geometry contract, `checkCaseTimelineDeception`,
 * the rubric) was measuring a timeline the book does not have.
 *
 * WHY THIS REPORTS AND DOES NOT REPAIR. Exactly one mapping is unambiguous:
 * `false_time_displayed` ("clock time shown during the freeze") IS the apparent time of death.
 * `resumption_time` is when the mechanism restarted — NOT when anyone died — and `freeze_duration`
 * is a duration. Writing `actual_time_of_death` from either would fabricate a coherence claim the
 * case never made, which is the failure `timeline-deception.ts` documents in its own header. So the
 * divergence is surfaced and left to the owner: the root fix is upstream, giving Agent 3 the
 * device's locked times, and that is a prompt change under the corpus regime.
 */
export function checkLockedFactTimeAlignment(ctx: OrchestratorContext): string[] {
  const findings: string[] = [];
  const registry = ctx.lockedFactRegistry ?? [];
  if (registry.length === 0) return findings;

  const mechanism = ((ctx.cml as any)?.CASE ?? ctx.cml as any)?.hidden_model?.mechanism ?? {};
  const apparent = String(mechanism.apparent_time_of_death ?? "").trim();
  const actual = String(mechanism.actual_time_of_death ?? "").trim();

  const clockFacts = registry
    .map((f) => ({ ...f, minutes: parseClockTime(f.value) }))
    .filter((f) => f.minutes !== null);
  if (clockFacts.length === 0) return findings;

  // The one safe correspondence. Matched on the locked fact's OWN id/description, never on position.
  const staged = clockFacts.find(
    (f) => /false_time|displayed|staged|apparent/i.test(`${f.id} ${f.description}`),
  );
  // Only a STATED time can disagree with anything. An absent one means the case does not model a
  // false-time trick, and reporting a split there would manufacture a finding from missing input —
  // the same rule `timeline-deception.ts` holds itself to ("a generator that omits the fields is
  // never blocked by this").
  if (staged && apparent) {
    const apparentMinutes = parseClockTime(apparent);
    if (apparentMinutes === null) {
      findings.push(
        `the case states apparent_time_of_death "${apparent}", which does not parse as a clock time, ` +
          `while the locked fact ${staged.id} fixes the staged time at "${staged.value}"`,
      );
    } else if (apparentMinutes !== staged.minutes) {
      findings.push(
        `the case stages the death at "${apparent}" but locked fact ${staged.id} puts the displayed ` +
          `clock time at "${staged.value}" — the prose will print the locked value, so every check ` +
          `reading the mechanism is measuring a timeline the manuscript does not have`,
      );
    }
  }

  // The residual, reported because it cannot be safely derived: no locked fact means "time of death".
  if (actual && !clockFacts.some((f) => /actual|true[_ ]time|time_of_death/i.test(`${f.id} ${f.description}`))) {
    findings.push(
      `the case states actual_time_of_death "${actual}", and no locked fact corresponds to it — ` +
        `nothing binds the true time of death to anything the prose is contractually required to print`,
    );
  }
  return findings;
}

function buildCmlGenerationRequest(ctx: OrchestratorContext, noveltyConstraints: any) {
  const setting = ctx.setting!;
  const cast = ctx.cast!;
  const backgroundContext = ctx.backgroundContext!;
  const hardLogicDevices = ctx.hardLogicDevices!;
  const hardLogicDirectives = ctx.hardLogicDirectives!;

  return {
    decade: setting.setting.era.decade,
    location: setting.setting.location.description,
    institution: setting.setting.location.type,
    tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
    weather: setting.setting.atmosphere.weather,
    socialStructure: setting.setting.era.socialNorms.join(", "),
    theme:
      ctx.inputs.theme && ctx.inputs.theme.trim().length > 0
        ? `${ctx.inputs.theme} | hard-logic modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`
        : `Hard-logic mystery | modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`,
    castSize: cast.cast.characters.length,
    castNames: cast.cast.characters.map((c: any) => c.name),
    castGenders: Object.fromEntries(cast.cast.characters.filter((c: any) => c.gender).map((c: any) => [c.name, c.gender])),
    detectiveType: cast.cast.crimeDynamics.detectiveCandidates[0] || "Detective",
    victimArchetype: cast.cast.crimeDynamics.victimCandidates[0] || "Victim",
    complexityLevel: hardLogicDirectives.complexityLevel,
    mechanismFamilies: hardLogicDirectives.mechanismFamilies,
    primaryAxis: ctx.primaryAxis,
    hardLogicModes: hardLogicDirectives.hardLogicModes,
    difficultyMode: hardLogicDirectives.difficultyMode,
    hardLogicDevices: hardLogicDevices.devices,
    // REVIEW_04 §11.2 B1 — the device's locked times, so Agent 3 does not author a second clock.
    // Self-gating: `buildCMLPrompt` ignores them unless AGENT3_DEVICE_TIME_BINDING is on, and the
    // registry is empty unless `enableLockedFactRegistry` populated it.
    lockedFacts: ctx.lockedFactRegistry,
    backgroundContext,
    noveltyConstraints,
    runId: ctx.runId,
    projectId: ctx.projectId || "",
  };
}

/**
 * F1b: Validate that no culprit in culpability.culprits[] has role="victim" in the cast.
 * When the CML generator incorrectly assigns the victim as the culprit, Agent 9's
 * enforceCulpritEvidencePresence will inject an accusation for a dead character — producing
 * a story where the victim is simultaneously dead in Ch1 and accused in the final chapter.
 * Returns a list of collision messages (empty = clean).
 */
function checkVictimCulpritCollision(cml: any): string[] {
  const culprits: string[] = Array.isArray(cml?.CASE?.culpability?.culprits)
    ? cml.CASE.culpability.culprits.map((n: any) => String(n ?? '').trim()).filter(Boolean)
    : [];
  if (culprits.length === 0) return [];

  const victimNames = new Set<string>(
    ((cml?.CASE?.cast ?? []) as any[])
      .filter((c: any) => {
        // Generated CML uses role_archetype ("victim", "the victim").
        // Example YAMLs may use the legacy `role` field — check both.
        // A_53 P4 (Pattern D): exact-match the controlled vocabulary, never substring — otherwise
        // "victim's confidant"/"victim advocate" false-positive as the victim.
        const ra = String(c.role_archetype ?? '').trim().toLowerCase().replace(/^the\s+/, '');
        const roleField = String(c.role ?? '').trim().toLowerCase();
        return ra === 'victim' || roleField === 'victim';
      })
      .map((c: any) => String(c.name ?? '').trim().toLowerCase())
  );

  return culprits
    .filter((name) => victimNames.has(name.toLowerCase()))
    .map((name) => `CML victim/culprit collision: "${name}" is listed as both a victim (role=victim in cast) and a culprit (culpability.culprits). This will cause an impossible story — accusation injected for a dead character.`);
}

export async function runAgent3(ctx: OrchestratorContext): Promise<void> {
  const retriesEnabled = preAgent9LlmRetriesEnabled();
  const contractRecoveryEnabled = preAgent9ContractRecoveryEnabled();
  ctx.reportProgress("cml", "Generating mystery structure (CML) grounded in novel devices...", 31);

  // ── Agent 3: CML generation ────────────────────────────────────────────────
  const cmlStart = Date.now();
  let cmlResult = await generateCML(
    ctx.client,
    buildCmlGenerationRequest(ctx, ctx.noveltyConstraints),
    ctx.examplesRoot,
  );

  cmlResult = applyCmlRepairAndRevalidate(cmlResult, ctx, "initial CML generation");

  ctx.agentCosts["agent3_cml"] = cmlResult.cost;
  ctx.agentDurations["agent3_cml"] = Date.now() - cmlStart;

  for (const finding of checkLockedFactTimeAlignment(ctx)) {
    ctx.warnings.push(`Agent 3 time-model split: ${finding}.`);
  }

  // What normalization had to INVENT because the model did not supply it. The culprit is the one
  // that matters: on run 20260802-1654 the model returned `culprits: []`, normalization filled it
  // positionally with the falsely-accused suspect, and the run shipped, scored 80, and had the
  // resulting defect attributed to the prose. A fabricated answer must never read like a decided one.
  for (const note of cmlResult.normalizationNotes ?? []) {
    ctx.warnings.push(`Agent 3 normalization: ${note}`);
  }

  if (!cmlResult.validation.valid) {
    if (cmlResult.degraded) {
      // Phase 0 graceful-degrade (AGENT4_GRACEFUL_DEGRADE): revision ran out of budget but returned
      // a best-so-far CML. Carry the unresolved warnings and PROCEED rather than killing the run.
      const unresolved = cmlResult.unresolvedLogicWarnings ?? cmlResult.validation.errors;
      ctx.warnings.push(
        `Agent 4: CML degraded — proceeding with ${unresolved.length} unresolved validation warning(s) (ran out of revision budget).`,
        ...unresolved.slice(0, 10).map((e) => `Agent 4 unresolved: ${e}`),
      );
      ctx.revisedByAgent4 = true;
      ctx.revisionAttempts = cmlResult.revisionDetails?.attempts;
    } else {
      ctx.errors.push("Agent 3: Generated invalid CML after all attempts");
      throw new Error("CML generation failed validation");
    }
  }

  if (cmlResult.revisedByAgent4) {
    ctx.revisedByAgent4 = true;
    ctx.revisionAttempts = cmlResult.revisionDetails?.attempts;
    ctx.warnings.push(
      `Agent 4: Auto-revision triggered after ${cmlResult.attempt} attempts (${ctx.revisionAttempts} revisions)`
    );
  }

  ctx.cml = cmlResult.cml as any;

  // F1b: Victim/culprit collision check — retry once with explicit exclusions before failing.
  const initialCollisions = checkVictimCulpritCollision(ctx.cml);
  if (initialCollisions.length > 0) {
    if (!contractRecoveryEnabled) {
      initialCollisions.forEach((msg) => ctx.errors.push(`Agent 3: ${msg}`));
      throw new Error("CML generation produced a victim/culprit collision (contract recovery disabled)");
    }
    const victimNames: string[] = ((ctx.cast as any)?.cast?.crimeDynamics?.victimCandidates ?? []).map(String).filter(Boolean);
    const detectiveNames: string[] = ((ctx.cast as any)?.cast?.crimeDynamics?.detectiveCandidates ?? []).map(String).filter(Boolean);
    const exclusionNames = [...new Set([...victimNames, ...detectiveNames])];
    const collisionMsg = initialCollisions.map(m => `Agent 3: ${m}`).join('; ');
    ctx.warnings.push(`${collisionMsg} — retrying with explicit culprit exclusions: ${exclusionNames.join(', ')}`);
    const retryStart = Date.now();
    const retryResult = applyCmlRepairAndRevalidate(
      await generateCML(
        ctx.client,
        { ...buildCmlGenerationRequest(ctx, ctx.noveltyConstraints), culpritExclusionNames: exclusionNames },
        ctx.examplesRoot,
      ),
      ctx,
      "collision-repair retry",
    );
    // A_53 P3 (collision-retry-cost-double-count): retryResult.cost is the CUMULATIVE byAgent total,
    // so accumulating double-counts the first generation — assign, like the novelty-retry path below.
    ctx.agentCosts["agent3_cml"] = retryResult.cost;
    ctx.agentDurations["agent3_cml"] = (ctx.agentDurations["agent3_cml"] ?? 0) + (Date.now() - retryStart);
    const retryCollisions = checkVictimCulpritCollision(retryResult.cml);
    if (!retryResult.validation.valid || retryCollisions.length > 0) {
      const finalMsgs = retryCollisions.length > 0 ? retryCollisions : initialCollisions;
      finalMsgs.forEach((msg) => ctx.errors.push(`Agent 3: ${msg}`));
      throw new Error("CML generation produced a victim/culprit collision — cannot proceed");
    }
    ctx.cml = retryResult.cml as any;
    cmlResult = retryResult;
  }

  ctx.reportProgress("cml", "Mystery structure generated and validated", 50);

  // ── CML quality score ─────────────────────────────────────────────────────
  if (ctx.enableScoring && ctx.scoreAggregator) {
    const cmlRevisedByAgent4 = cmlResult.revisedByAgent4 ?? false;
    const cmlDegraded = cmlResult.degraded ?? false;
    const cmlAttemptCount = cmlResult.attempt ?? 1;
    const cmlRepairCount = cmlResult.revisionDetails?.attempts ?? (cmlRevisedByAgent4 ? 1 : 0);
    // GRADED quality (redesign §6/§9.2): replace the binary 60-vs-100 penalty with a score derived
    // from how much repair was actually needed — each targeted patch/revision costs points (floored),
    // and a degraded CML (shipped with unresolved validation warnings) takes an honest deeper cut.
    let cmlQualityScore = 100;
    if (cmlRevisedByAgent4) {
      cmlQualityScore = Math.max(55, 100 - Math.min(40, Math.max(1, cmlRepairCount) * 12));
    }
    if (cmlDegraded) {
      cmlQualityScore = Math.min(cmlQualityScore, 45);
    }
    const cmlTotal = Math.round(100 * 0.5 + cmlQualityScore * 0.3 + 100 * 0.2);
    // T3.5: the vanity score hardcodes validation/completeness/consistency = 100 and derives quality
    // only from the Agent-4 repair COUNT. applyHonestScorer swaps in scoreRealCml (content assertions
    // on the CASE block) when HONEST_SCORERS=enforce; default OFF keeps this byte-identical.
    const vanityCmlScore: PhaseScore = {
      agent: "agent3-cml-generation",
      validation_score: 100,
      quality_score: cmlQualityScore,
      completeness_score: 100,
      consistency_score: 100,
      total: cmlTotal,
      grade: (cmlTotal >= 90 ? "A" : cmlTotal >= 80 ? "B" : cmlTotal >= 70 ? "C" : cmlTotal >= 60 ? "D" : "F") as PhaseScore["grade"],
      passed: true,
      tests: [
        {
          name: "Schema validation",
          category: "validation" as const,
          passed: true,
          score: 100,
          weight: 2,
          message: `Valid after ${cmlAttemptCount} attempt(s)`,
        },
        {
          name: "Structural revision (Agent 4)",
          category: "quality" as const,
          passed: !cmlRevisedByAgent4 && !cmlDegraded,
          score: cmlQualityScore,
          weight: 1,
          message: cmlDegraded
            ? `Shipped with ${cmlResult.unresolvedLogicWarnings?.length ?? 0} unresolved validation warning(s) after ${cmlRepairCount} repair(s)`
            : cmlRevisedByAgent4
            ? `Required ${cmlRepairCount} targeted repair(s)/revision(s)`
            : "No structural revision needed",
        },
      ],
    };
    const cmlScore = applyHonestScorer(vanityCmlScore, () => scoreRealCml(ctx.cml), ctx.warnings, "agent3-cml");
    ctx.scoreAggregator.upsertPhaseScore(
      "agent3_cml",
      "CML Generation",
      cmlScore,
      ctx.agentDurations["agent3_cml"] ?? 0,
      ctx.agentCosts["agent3_cml"] ?? 0,
    );
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  }

  // ── Agent 8: Novelty Audit ─────────────────────────────────────────────────
  // A_53 P6 (novelty-audit-is-NOT-disabled-live): resolve the default threshold from the SINGLE
  // source of truth (getGenerationParams, already clamped [0,1]) instead of a hardcoded 0.9 that
  // silently diverged from the YAML. Explicit ctx.inputs / env still override.
  const noveltyThresholdDefault =
    getGenerationParams().agent8_novelty.params.thresholds.similarity_threshold_default;
  const baseSimilarityThreshold =
    typeof ctx.inputs.similarityThreshold === "number"
      ? ctx.inputs.similarityThreshold
      : Number(process.env.NOVELTY_SIMILARITY_THRESHOLD || noveltyThresholdDefault);
  // T1.6: when NOVELTY_CROSS_RUN is on, cap the threshold so the audit actually fires (the static
  // default ≥1.0 deliberately skips it). Default-OFF ⇒ threshold and skip behaviour are unchanged.
  const similarityThreshold = effectiveNoveltyThreshold(baseSimilarityThreshold);
  // A_53 P7: NOVELTY_MODE=off skips the audit entirely (single source for on/off/active).
  const noveltyMode = resolveNoveltyMode();
  const shouldSkipNovelty =
    Boolean(ctx.inputs.skipNoveltyCheck) || similarityThreshold >= 1 || noveltyMode === "off";

  // A_56 8-A — deterministic-corpus novelty judge via the LLM skeleton-extractor (SHADOW). This is the
  // only path that can produce the hand-authored `false_assumption_pattern` / `inference_shape` labels
  // the structural judge gates on (a deterministic skeleton scores `distinct` for everything). It LOGS
  // the structural verdict next to the LLM audit and NEVER blocks/skips — gated by NOVELTY_SKELETON_JUDGE
  // (off|shadow, default shadow). Fully guarded: any error is swallowed so it can't break a run, and it
  // shares the seed corpus with the LLM audit. Promote to gating only after the shadow telemetry shows it
  // tracks the LLM auditor (see the novelty-judge-needs-skeleton-extractor memory).
  const skeletonJudgeMode = (process.env.NOVELTY_SKELETON_JUDGE ?? "shadow").toLowerCase();
  if (skeletonJudgeMode !== "off" && noveltyMode !== "off") {
    try {
      const sjStart = Date.now();
      const extract = createSkeletonExtractor(
        (chatArgs) =>
          ctx.client.chat({
            ...chatArgs,
            model: chatArgs.model ?? process.env.NOVELTY_SKELETON_MODEL,
            logContext: { agent: "NoveltySkeletonJudge", runId: ctx.runId, projectId: ctx.projectId || "unknown" },
          } as any),
        { model: process.env.NOVELTY_SKELETON_MODEL },
      );
      const skeleton = await extract(ctx.cml, ctx.runId);
      const verdict = judgeNovelty(skeleton, loadReferenceCorpus());
      ctx.agentDurations["agent8_skeleton_judge"] = Date.now() - sjStart;
      console.info(
        `[Novelty skeleton-judge SHADOW] ${verdict.verdict} — ` +
          (verdict.nearest
            ? `nearest ${verdict.nearest.corpus}:${verdict.nearest.id} (${verdict.nearest.relation})`
            : "no corpus") +
          `; skeleton=${JSON.stringify(skeleton)}; ${verdict.divergence_directive}`,
      );
      ctx.scoreAggregator?.upsertDiagnostic(
        "novelty_skeleton_judge",
        "NoveltySkeletonJudge",
        "Novelty (skeleton, shadow)",
        verdict.verdict,
        { skeleton, verdict },
      );
      if (verdict.verdict !== "distinct") {
        ctx.warnings.push(
          `[Novelty skeleton-judge SHADOW] ${verdict.verdict} vs ${verdict.nearest?.id ?? "?"}: ${verdict.divergence_directive}`,
        );
      }
    } catch (e) {
      console.warn(`[Novelty skeleton-judge SHADOW] skipped: ${(e as Error).message}`);
    }
  }

  if (!shouldSkipNovelty) {
    ctx.reportProgress("novelty", "Checking novelty vs seed patterns...", 52);

    const runNoveltyAudit = async (candidate: any) => {
      const noveltyStart = Date.now();
      const result = await auditNovelty(ctx.client, {
        generatedCML: candidate,
        seedCMLs: ctx.seedEntries.map((s: any) => s.cml),
        similarityThreshold,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent8_novelty"] = result.cost;
      ctx.agentDurations["agent8_novelty"] = Date.now() - noveltyStart;
      return result;
    };

    ctx.noveltyAudit = await runNoveltyAudit(ctx.cml);

    if (ctx.noveltyAudit!.status === "fail" && retriesEnabled) {
      ctx.warnings.push("Agent 8: Novelty audit failed; regenerating CML with stronger divergence constraints");
      ctx.noveltyAudit!.violations.forEach((v: string) => ctx.warnings.push(`  - ${v}`));

      const strongerConstraints = {
        ...ctx.noveltyConstraints,
        areas: Array.from(
          new Set([
            ...ctx.noveltyConstraints.areas,
            "culprit identity and motive structure",
            "constraint-space shape and contradictions",
            "discriminating test trigger conditions",
          ])
        ),
        avoidancePatterns: Array.from(
          new Set([
            ...ctx.noveltyConstraints.avoidancePatterns,
            ...ctx.noveltyAudit!.violations,
            ...ctx.noveltyAudit!.warnings,
            ...ctx.noveltyAudit!.recommendations,
            `Most similar seed: ${ctx.noveltyAudit!.mostSimilarSeed}`,
          ])
        ).slice(0, 16),
      };

      ctx.reportProgress("cml", "Regenerating CML with stronger novelty constraints...", 54);
      const cmlRetryStart = Date.now();
      cmlResult = await generateCML(
        ctx.client,
        buildCmlGenerationRequest(ctx, strongerConstraints),
        ctx.examplesRoot,
      );

      cmlResult = applyCmlRepairAndRevalidate(cmlResult, ctx, "novelty retry CML generation");

      ctx.agentCosts["agent3_cml"] = cmlResult.cost;
      ctx.agentDurations["agent3_cml"] += Date.now() - cmlRetryStart;

      if (!cmlResult.validation.valid) {
        ctx.errors.push("Agent 3: Generated invalid CML after novelty retry");
        throw new Error("CML generation failed validation after novelty retry");
      }

      ctx.cml = cmlResult.cml as any;

      // F1b: Repeat collision check after novelty retry.
      const retryCollisions = checkVictimCulpritCollision(ctx.cml);
      if (retryCollisions.length > 0) {
        retryCollisions.forEach((msg) => ctx.errors.push(`Agent 3: ${msg}`));
        throw new Error("CML novelty retry produced a victim/culprit collision — cannot proceed");
      }

      ctx.noveltyAudit = await runNoveltyAudit(ctx.cml);
    } else if (ctx.noveltyAudit!.status === "fail") {
      ctx.warnings.push(
        "Agent 8: Novelty audit failed (deterministic mode: novelty retry disabled); applying warning/hard-fail policy to current output"
      );
    }

    if (ctx.noveltyAudit!.status === "fail") {
      // A_53 P7 (audit-runs-but-is-toothless-warning-only): NOVELTY_MODE governs the verdict.
      // active = a confirmed clone blocks (sets `blocking` for the orchestrator binding gate AND
      // throws, unless forceWarnings overrides); shadow (default) = downgrade to a warning.
      if (noveltyMode === "active") {
        ctx.noveltyAudit = { ...ctx.noveltyAudit!, blocking: true };
        if (!ctx.inputs.forceWarnings) {
          ctx.errors.push("Agent 8: Novelty audit FAILED (NOVELTY_MODE=active) - too similar to seed patterns");
          ctx.noveltyAudit.violations.forEach((v: string) => ctx.errors.push(`  - ${v}`));
          throw new Error("Novelty audit failed (NOVELTY_MODE=active)");
        }
        ctx.warnings.push("Agent 8: Novelty audit failed (NOVELTY_MODE=active) but forceWarnings override is set; continuing.");
        ctx.noveltyAudit = { ...ctx.noveltyAudit!, status: "warning", blocking: true };
      } else {
        ctx.warnings.push(`Agent 8: Novelty audit failed (NOVELTY_MODE=${noveltyMode}); continuing with warning`);
        ctx.noveltyAudit!.violations.forEach((v: string) => ctx.warnings.push(`  - ${v}`));
        ctx.noveltyAudit = { ...ctx.noveltyAudit!, status: "warning" };
      }
    } else if (ctx.noveltyAudit!.status === "warning") {
      ctx.warnings.push("Agent 8: Moderate similarity detected");
      ctx.noveltyAudit!.warnings.forEach((w: string) => ctx.warnings.push(`  - ${w}`));
    }

    // Pillar 3 (Unit 3.3): flag blocking when gate is active and status is warning.
    // Covers both native-warning and fail-downgraded-to-warning paths above.
    if (ctx.inputs.enableBindingGates && ctx.noveltyAudit!.status === "warning") {
      ctx.noveltyAudit = { ...ctx.noveltyAudit!, blocking: true };
    }

    ctx.reportProgress(
      "novelty_math" as any,
      `Novelty math: weights plot 0.30, character 0.25, setting 0.15, solution 0.25, structural 0.05 | threshold ${similarityThreshold.toFixed(2)} | most similar ${ctx.noveltyAudit!.mostSimilarSeed} (${ctx.noveltyAudit!.highestSimilarity.toFixed(2)})`,
      57
    );
    ctx.reportProgress("novelty", `Novelty check: ${ctx.noveltyAudit!.status}`, 58);
  } else {
    ctx.reportProgress(
      "novelty",
      similarityThreshold >= 1 ? "Novelty check skipped (threshold >= 1.0)" : "Novelty check skipped",
      58
    );
  }

  // ── Novelty phase score ───────────────────────────────────────────────────
  if (ctx.enableScoring && ctx.scoreAggregator) {
    if (ctx.noveltyAudit) {
      const highestSim = ctx.noveltyAudit.highestSimilarity ?? 0;
      const noveltyStatus = ctx.noveltyAudit.status;
      const noveltyTotal = noveltyStatus === "pass"
        ? Math.max(80, Math.round((1 - highestSim) * 100))
        : noveltyStatus === "warning" ? 70 : 45;
      const noveltyViolationTests: TestResult[] = ctx.noveltyAudit.violations.map((v: string) => ({
        name: "Novelty violation",
        category: "quality" as const,
        passed: false,
        score: 0,
        weight: 0.5,
        message: v,
      }));
      ctx.scoreAggregator.upsertPhaseScore(
        "agent8_novelty",
        "Novelty Audit",
        {
          agent: "agent8-novelty-audit",
          // Floor validation_score at 60 when the novelty check passes so it
          // satisfies COMPONENT_MINIMUMS.validation_score (= 60).  A failing
          // story (highestSim ≥ 0.90) already produces a raw score of ≤ 10,
          // which correctly fails the component minimum without the floor.
          validation_score: noveltyStatus !== "fail"
            ? Math.max(60, Math.round((1 - highestSim) * 100))
            : Math.round((1 - highestSim) * 100),
          quality_score: ctx.noveltyAudit.violations.length === 0 ? 100 : Math.max(0, 100 - ctx.noveltyAudit.violations.length * 20),
          completeness_score: 100,
          consistency_score: 100,
          total: noveltyTotal,
          grade: (noveltyTotal >= 90 ? "A" : noveltyTotal >= 80 ? "B" : noveltyTotal >= 70 ? "C" : noveltyTotal >= 60 ? "D" : "F") as PhaseScore["grade"],
          passed: noveltyStatus !== "fail",
          failure_reason: noveltyStatus === "fail"
            ? `Too similar to seed patterns (${Math.round(highestSim * 100)}% match with "${ctx.noveltyAudit.mostSimilarSeed}")`
            : undefined,
          tests: [
            {
              name: "Similarity below threshold",
              category: "validation" as const,
              passed: noveltyStatus !== "fail",
              score: Math.round((1 - highestSim) * 100),
              weight: 2,
              message: `${Math.round(highestSim * 100)}% similar to "${ctx.noveltyAudit.mostSimilarSeed}" — ${noveltyStatus}`,
            },
            ...noveltyViolationTests,
          ],
        },
        ctx.agentDurations["agent8_novelty"] ?? 0,
        ctx.agentCosts["agent8_novelty"] ?? 0,
      );
    } else {
      // Novelty check skipped
      ctx.scoreAggregator.upsertPhaseScore(
        "agent8_novelty",
        "Novelty Audit",
        {
          agent: "agent8-novelty-audit",
          validation_score: 100,
          quality_score: 100,
          completeness_score: 100,
          consistency_score: 100,
          total: 100,
          grade: "A" as PhaseScore["grade"],
          passed: true,
          tests: [
            {
              name: "Novelty check",
              category: "validation" as const,
              passed: true,
              score: 100,
              weight: 1,
              message: "Skipped (threshold ≥ 1.0 or skipNoveltyCheck set)",
            },
          ],
        },
        0,
        0,
      );
    }
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  }

  // A_50 §9.3 fix #2 — observability: flag discriminating-test evidence that is NOT planted before
  // the reveal scene (the probe's "reveal uses evidence not planted earlier"). Non-fatal — surfaces
  // the gap for fair-play/repair without aborting; the contract fix lives in the Agent 3 prompt.
  try {
    const { unplanted, unmapped } = findUnplantedDiscriminatingClues(ctx.cml);
    if (unplanted.length > 0) {
      ctx.warnings.push(
        `[agent3-discriminating-planting] (pre-repair snapshot; Agent 6 reschedules) ${unplanted.length} discriminating clue(s) not planted before the reveal scene` +
          `${unmapped.length ? ` (${unmapped.length} absent from clue_to_scene_mapping)` : ""}: ${unplanted.join(", ")} — ` +
          `reveal may rely on unplanted evidence (fair-play risk).`,
      );
    }
  } catch { /* best-effort observability */ }
}

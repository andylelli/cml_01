/**
 * Agent 8 — the novelty audit run inside Agent 3's stage: the deterministic-corpus skeleton judge (shadow),
 * the audit, the CML regeneration retry, the NOVELTY_MODE blocking policy, and the novelty phase score.
 * Moved from agent3-run.ts (code review A34-04 / CR-24), where it was ~300 of its lines.
 */
import { calculateGrade } from "@cml/story-validation";
import { generateCML, auditNovelty, type CMLGenerationResult } from "@cml/prompts-llm";
import { createSkeletonExtractor, judgeNovelty, loadReferenceCorpus } from "@cml/novelty";
import type { TestResult } from "@cml/story-validation";
import { getGenerationParams } from "@cml/story-validation";
import { type OrchestratorContext } from "./shared.js";
import fs from "fs/promises";
import path from "path";
import { effectiveNoveltyThreshold, resolveNoveltyMode, loadNoveltyLedger } from "../novelty-ledger.js";
import { priorRunFingerprints, cellRepeatDepth } from "../prior-run-fingerprints.js";
import { resolveWorkspaceRoot } from "../novelty-ledger.js";
import {
  applyCmlRepairAndRevalidate,
  reportNormalizationNotes,
  buildCmlGenerationRequest,
  checkVictimCulpritCollision,
} from "./agent3/cml-acceptance.js";

export async function runNoveltyPhase(ctx: OrchestratorContext, retriesEnabled: boolean, cmlResult: CMLGenerationResult) {
  const noveltyThresholdDefault = getGenerationParams().agent8_novelty.params.thresholds.similarity_threshold_default;
  const baseSimilarityThreshold = typeof ctx.inputs.similarityThreshold === "number"
    ? ctx.inputs.similarityThreshold
    : Number(process.env.NOVELTY_SIMILARITY_THRESHOLD || noveltyThresholdDefault);
  // T1.6: when NOVELTY_CROSS_RUN is on, cap the threshold so the audit actually fires (the static
  // default ≥1.0 deliberately skips it). Default-OFF ⇒ threshold and skip behaviour are unchanged.
  const similarityThreshold = effectiveNoveltyThreshold(baseSimilarityThreshold);
  // A_53 P7: NOVELTY_MODE=off skips the audit entirely (single source for on/off/active).
  const noveltyMode = resolveNoveltyMode();
  const shouldSkipNovelty = Boolean(ctx.inputs.skipNoveltyCheck) || similarityThreshold >= 1 || noveltyMode === "off";

  // A_56 8-A — deterministic-corpus novelty judge via the LLM skeleton-extractor (SHADOW). This is the
  // only path that can produce the hand-authored `false_assumption_pattern` / `inference_shape` labels
  // the structural judge gates on (a deterministic skeleton scores `distinct` for everything). It LOGS
  // the structural verdict next to the LLM audit and NEVER blocks/skips — gated by NOVELTY_SKELETON_JUDGE
  // (off|shadow, default shadow). Fully guarded: any error is swallowed so it can't break a run, and it
  // shares the seed corpus with the LLM audit. Promote to gating only after the shadow telemetry shows it
  // tracks the LLM auditor (see the novelty-judge-needs-skeleton-extractor memory).
  /**
   * A_86 item 49 — shadow, and it has never gated a run.
   *
   * Left at `shadow` rather than flipped to `off`: unlike the rubric scorer this one is CHEAP and it
   * is the only thing that would catch a structural clone, which the deterministic skeleton cannot
   * (it reports "distinct" every time, because the corpus's belief/inference labels are hand
   * authored). Turning it off to save ~0.3% would remove the only real novelty check. `=off` is
   * available when credits are short, and its spend is now in the run summary's shadow line.
   */
  const skeletonJudgeMode = (process.env.NOVELTY_SKELETON_JUDGE ?? "shadow").toLowerCase();
  if (skeletonJudgeMode !== "off" && noveltyMode !== "off") {
    try {
      const sjStart = Date.now();
      const extract = createSkeletonExtractor(
        (chatArgs) => ctx.client.chat({
          ...chatArgs,
          model: chatArgs.model ?? process.env.NOVELTY_SKELETON_MODEL,
          logContext: { agent: "NoveltySkeletonJudge", runId: ctx.runId, projectId: ctx.projectId || "unknown" },
        } as any),
        { model: process.env.NOVELTY_SKELETON_MODEL }
      );
      const skeleton = await extract(ctx.cml, ctx.runId);
      // A_74 §8 DE3 — the judge finally sees this pipeline's own history, not just seeds + cliches.
      const priorRecords = await loadNoveltyLedger();
      const priors = priorRunFingerprints(priorRecords);
      const verdict = judgeNovelty(skeleton, loadReferenceCorpus(priors));
      const cell = cellRepeatDepth(priorRecords, skeleton.axis, skeleton.mechanism_family);
      ctx.agentDurations["agent8_skeleton_judge"] = Date.now() - sjStart;
      /**
       * A_74 §8 DE3 — REPEAT DEPTH, printed next to the verdict on purpose.
       *
       * `severity` scores a candidate that shares BOTH axis and mechanism_family with a prior run as
       * `distinct` (sharesBelief false, trickShared 1 — it falls through both branches). So a run can
       * be the ninth consecutive time-of-death trick and still be pronounced distinct. Printing the
       * depth beside the verdict is what makes that visible; the threshold itself is left alone while
       * the judge is in shadow.
       */
      console.warn(
        `[DE3 cell] axis=${cell.axis} family=${cell.family} — this cell has been shipped ` +
        `${cell.depth}/${cell.window} recent run(s)` +
        (cell.sinceLastUse === null ? " (NEVER used before)" : `, last used ${cell.sinceLastUse} run(s) ago`) +
        (cell.depth >= 3 ? " — REPEAT: the verdict below is not measuring this." : "")
      );
      console.info(
        `[Novelty skeleton-judge SHADOW] ${verdict.verdict} — ` +
        (verdict.nearest
          ? `nearest ${verdict.nearest.corpus}:${verdict.nearest.id} (${verdict.nearest.relation})`
          : "no corpus") +
        `; skeleton=${JSON.stringify(skeleton)}; ${verdict.divergence_directive}`
      );
      /**
       * A_74 §8 DE3 / §8.1.5 — PERSIST IT. The judge has run in shadow by default for a long time,
       * printing `skeleton={...}` to a console nobody kept and calling `upsertDiagnostic`, and the
       * surviving run report contains no occurrence of `skeleton`, `false_assumption_pattern` or
       * `inference_shape`. A shadow deployment that produces no retrievable dataset is paying for
       * calls and buying nothing. This writes one small file per run, next to the other run artefacts.
       */
      try {
        // Same anchoring as the ledger: walk from this module, never from cwd (A_73 §12.1).
        const logsDir = path.join(resolveWorkspaceRoot(), "apps", "worker", "logs");
        await fs.mkdir(logsDir, { recursive: true });
        await fs.writeFile(
          path.join(logsDir, `novelty-skeleton-${ctx.runId}.json`),
          JSON.stringify({ runId: ctx.runId, recordedAt: new Date().toISOString(), skeleton, verdict, cell, priorCorpusSize: priors.length }, null, 2),
          "utf-8"
        );
      } catch (e) {
        console.warn(`[DE3] skeleton not persisted: ${(e as Error).message}`);
      }
      ctx.scoreAggregator?.upsertDiagnostic(
        "novelty_skeleton_judge",
        "NoveltySkeletonJudge",
        "Novelty (skeleton, shadow)",
        verdict.verdict,
        { skeleton, verdict }
      );
      if (verdict.verdict !== "distinct") {
        ctx.warnings.push(
          `[Novelty skeleton-judge SHADOW] ${verdict.verdict} vs ${verdict.nearest?.id ?? "?"}: ${verdict.divergence_directive}`
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
      // A1X-D12: a re-audit after the novelty retry ADDS its time; it overwrote the first audit's.
      ctx.agentDurations["agent8_novelty"] = (ctx.agentDurations["agent8_novelty"] ?? 0) + (Date.now() - noveltyStart);
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
        ctx.examplesRoot
      );

      cmlResult = applyCmlRepairAndRevalidate(cmlResult, ctx, "novelty retry CML generation");
      reportNormalizationNotes(ctx, cmlResult, "novelty retry"); // A34-D06

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
  return cmlResult;
}

export async function scoreNoveltyPhase(ctx: OrchestratorContext) {
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
          grade: calculateGrade(noveltyTotal),
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
        ctx.agentCosts["agent8_novelty"] ?? 0
      );
    } else {
      // SCO-D12 (owner decision, 2026-10-02): a skipped audit is N/A, not A. It used to be recorded as 100/A and
      // averaged into overall_score — a check that did not run raising the headline. It is still recorded (so the
      // report says it was skipped), marked not_applicable: graded 'N/A', excluded from the mean and the counts.
      ctx.scoreAggregator.upsertPhaseScore(
        "agent8_novelty",
        "Novelty Audit",
        {
          agent: "agent8-novelty-audit",
          validation_score: 0,
          quality_score: 0,
          completeness_score: 0,
          consistency_score: 0,
          total: 0,
          grade: "N/A",
          passed: true,
          not_applicable: true,
          tests: [
            {
              name: "Novelty check",
              category: "validation" as const,
              passed: true,
              score: 0,
              weight: 0,
              message: "Skipped (threshold ≥ 1.0 or skipNoveltyCheck set) — N/A, not part of the overall score",
            },
          ],
        },
        0,
        0
      );
    }
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  }
}

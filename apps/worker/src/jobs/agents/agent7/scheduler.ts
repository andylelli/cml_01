/**
 * The deterministic beat-scheduler grid: shadow logging, scheduler authority and clue-job authority.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import type { NarrativeOutline } from "@cml/prompts-llm";
import { distributeChapterWordBudget, applyGridClueJobs } from "@cml/story-validation";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  buildSceneGrid,
  collectObligations,
  checkComplete,
  checkOrdered,
  checkCoverage,
  SchedulerInfeasibleError,
} from "@cml/beat-scheduler";
import {
  isAgent7ClueJobAuthorityEnabled,
  isAgent7SchedulerAuthoritative,
  isAgent7SchedulerShadowEnabled,
} from "./flags.js";
import {
  flattenNarrativeScenes,
} from "./scene-refs.js";

/** A_53 P10 (scheduler-grid-rebuilt-twice-per-run): the scheduler shadow and the clue-job authority
 * both build `buildSceneGrid`+`collectObligations` from the same ctx-derived inputs. This memoizing
 * cache builds each (grid, obligations) pair once per scene-count and lets both call sites share it,
 * so when shadow+authority are both enabled the grid is built once instead of twice. Pure perf — the
 * inputs (caseData/clues/redHerrings) don't change between these end-of-run calls. */
type Agent7GridCache = {
  caseData: any;
  clues: Array<{ id: any; placement: any; criticality: any; supportsInferenceStep: any }>;
  redHerrings: Array<{ id?: string }>;
  get(sceneCount: number): { grid: ReturnType<typeof buildSceneGrid>; obligations: ReturnType<typeof collectObligations>["obligations"] };
};

export function makeAgent7GridCache(ctx: OrchestratorContext): Agent7GridCache {
  const caseData = (ctx.cml as any)?.CASE ?? ctx.cml;
  const clues = ((ctx.clues?.clues ?? []) as any[]).map((c) => ({
    id: c.id,
    placement: c.placement,
    criticality: c.criticality,
    supportsInferenceStep: c.supportsInferenceStep,
  }));
  const redHerrings = (ctx.clues?.redHerrings ?? []) as Array<{ id?: string }>;
  const memo = new Map<number, { grid: ReturnType<typeof buildSceneGrid>; obligations: ReturnType<typeof collectObligations>["obligations"] }>();
  return {
    caseData,
    clues,
    redHerrings,
    get(sceneCount: number) {
      const cached = memo.get(sceneCount);
      if (cached) return cached;
      const grid = buildSceneGrid({ cml: caseData, clues, redHerrings }, sceneCount);
      const obligations = collectObligations(caseData, clues, redHerrings).obligations;
      const built = { grid, obligations };
      memo.set(sceneCount, built);
      return built;
    },
  };
}

/** Build + invariant-check the deterministic grid for the produced outline, logging the comparison. */
export function runAgent7SchedulerShadow(ctx: OrchestratorContext, narrative: NarrativeOutline, gridCache: Agent7GridCache): void {
  if (!isAgent7SchedulerShadowEnabled()) return;
  try {
    const liveScenes =
      (narrative as any).totalScenes ??
      (narrative.acts ?? []).reduce((n: number, a: any) => n + (Array.isArray(a.scenes) ? a.scenes.length : 0), 0);
    const sceneCount = liveScenes && liveScenes >= 4 ? liveScenes : 10;

    // A_53 P10 (scheduler-grid-rebuilt-twice-per-run): shared memoized grid (see makeAgent7GridCache).
    const { grid, obligations } = gridCache.get(sceneCount);
    const complete = checkComplete(grid, obligations);
    const ordered = checkOrdered(grid);
    const coverage = checkCoverage(grid);
    // X17 — the shadow reaches the report too, so a run's record states which arm it was even when
    // the authority path did not fire. A probe needs the negative recorded as much as the positive.
    const shadowLine =
      `[Agent 7 scheduler shadow] grid @${grid.sceneCount} (${grid.actCounts.act1}/${grid.actCounts.act2}/${grid.actCounts.act3}) ` +
      `from ${obligations.length} obligations: complete=${complete.ok} ordered=${ordered.ok} ` +
      `coverage=${Math.round(coverage.ratio * 100)}% (ratioOk=${coverage.ratioOk}) | live outline scenes=${liveScenes} | ` +
      `AGENT7_SCHEDULER_AUTHORITATIVE=${isAgent7SchedulerAuthoritative() ? "ON" : "off"}`;
    console.info(shadowLine);
    ctx.warnings.push(shadowLine);
    if (!ordered.ok) console.info(`[Agent 7 scheduler shadow] ordering note: ${ordered.violations[0]}`);
  } catch (e) {
    if (e instanceof SchedulerInfeasibleError) {
      console.info(`[Agent 7 scheduler shadow] INFEASIBLE: ${e.unmet} — a real upstream signal (the LLM outline may be padded vs the clue density).`);
    } else {
      console.warn(`[Agent 7 scheduler shadow] error: ${(e as Error).message}`);
    }
  }
}

/** P1.3: when the scheduler is authoritative, stamp a pacing-shaped per-scene word budget onto the
 * outline so Agent 9 produces varied chapter lengths (climax fuller, setup leaner). No-op by default. */
export function applyAgent7SchedulerAuthority(ctx: OrchestratorContext, narrative: NarrativeOutline, gridCache: Agent7GridCache): void {
  if (!isAgent7SchedulerAuthoritative()) return;
  const sceneRefs = flattenNarrativeScenes(narrative);
  if (sceneRefs.length === 0) return;

  const budgets = distributeChapterWordBudget(sceneRefs.length, ctx.inputs.targetLength);
  sceneRefs.forEach((ref, i) => {
    const budget = budgets[i];
    if (typeof budget === "number" && Number.isFinite(budget)) {
      ref.scene.estimatedWordCount = budget;
    }
  });

  // Keep act-level totals consistent with the new per-scene budgets.
  (narrative.acts ?? []).forEach((actBlock: any) => {
    const scenes = Array.isArray(actBlock?.scenes) ? actBlock.scenes : [];
    actBlock.estimatedWordCount = scenes.reduce(
      (sum: number, s: any) => sum + (typeof s.estimatedWordCount === "number" ? s.estimatedWordCount : 0),
      0,
    );
  });

  /**
   * X17 (REVIEW_05 §31.1) — this reaches the REPORT, not just the terminal.
   *
   * It used to be `console.info` alone. On the N6 pair I read the treatment arm as "the lever did not
   * fire" because my terminal capture was truncated, and only the committed outline settled it. A
   * probe whose treatment arm cannot be identified from its durable record is unattributable by
   * construction — which is [ADR-0010] exactly: the terminal is a convenience, never the record.
   */
  const stamp =
    `[Agent 7 scheduler authority] stamped pacing-shaped budgets on ${sceneRefs.length} scenes ` +
    `(${budgets[0]}…${budgets[budgets.length - 1]} words). AGENT7_SCHEDULER_AUTHORITATIVE=ON.`;
  console.info(stamp);
  ctx.warnings.push(stamp);

  // A_53 P8 (scheduler-authority-dark-no-safe-enable-path): the destructive clue-job half is now a
  // SEPARATE opt-in (AGENT7_CLUE_JOB_AUTHORITY) so the word budgets above can ship on their own.
  applyAgent7ClueJobAuthority(ctx, narrative, sceneRefs, gridCache);
}

/** A_53 P8: the once-per-clue grid clue-job stamp — now additive + (act, act-scene-number)-aligned +
 * coverage-re-validated. Gated behind AGENT7_CLUE_JOB_AUTHORITY (default OFF). */
function applyAgent7ClueJobAuthority(
  ctx: OrchestratorContext,
  narrative: NarrativeOutline,
  sceneRefs: ReturnType<typeof flattenNarrativeScenes>,
  gridCache: Agent7GridCache,
): void {
  if (!isAgent7ClueJobAuthorityEnabled()) return;
  // Job authority (T1.2): the grid assigns every reveal obligation to exactly one slot, so a clue is
  // dramatized in a single chapter instead of being re-revealed across adjacent ones. Guarded: an
  // infeasible grid (or per-act count mismatch) keeps the existing LLM distribution untouched.
  try {
    // A_53 P10 (scheduler-grid-rebuilt-twice-per-run): shared memoized grid (see makeAgent7GridCache).
    const { grid } = gridCache.get(sceneRefs.length);
    // Pass act + scene-number so the stamp aligns by (act, act-scene-number), not raw index.
    const sceneCells = sceneRefs.map((r) => {
      const cell = r.scene as any;
      cell.act = r.act;
      if (typeof cell.sceneNumber !== "number") cell.sceneNumber = r.sceneNumber;
      return cell;
    });
    const { stamped, dedupRemoved, fellBack } = applyGridClueJobs(sceneCells, grid.slots);
    if (fellBack) {
      ctx.warnings.push(
        "[Agent 7 clue-job authority] per-act counts differ between grid and outline — kept the LLM clue distribution (no stamp).",
      );
    } else {
      // A_53 P8 (re-run the coverage gate after stamping): the additive union can't drop a clue to
      // zero scenes, but re-evaluate to force-assign any genuinely-unanchored clue id deterministically.
      reassertClueCoverage(ctx, narrative);
      console.info(
        `[Agent 7 clue-job authority] reconciled grid clue jobs on ${stamped} scenes ` +
          `(one reveal per clue; ${dedupRemoved} duplicate re-reveals removed).`,
      );
    }
  } catch (e) {
    if (e instanceof SchedulerInfeasibleError) {
      console.info(
        `[Agent 7 clue-job authority] grid INFEASIBLE — keeping the LLM clue distribution: ${e.unmet}`,
      );
    } else {
      console.warn(`[Agent 7 clue-job authority] clue-job stamp skipped: ${(e as Error).message}`);
    }
  }
}

/** A_53 P8: after the clue-job stamp, ensure every distribution clue id is still anchored in ≥1 scene;
 * force-assign any unanchored id to the least-loaded scene in its target act (mirrors the main
 * clue-coverage gate) so the additive stamp can never leave a clue in zero scenes. */
function reassertClueCoverage(ctx: OrchestratorContext, narrative: NarrativeOutline): void {
  const allScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes ?? []);
  const covered = new Set<string>(
    allScenes
      .flatMap((s: any) => (Array.isArray(s.cluesRevealed) ? s.cluesRevealed : []))
      .map(String)
      .filter(Boolean),
  );
  const allIds = (ctx.clues?.clues ?? []).map((c: any) => String(c.id ?? "")).filter(Boolean);
  const uncovered = allIds.filter((id) => !covered.has(id));
  if (uncovered.length === 0) return;
  for (const clueId of uncovered) {
    const clueEntry = (ctx.clues!.clues as any[]).find((c) => c.id === clueId);
    const placement: string = clueEntry?.placement ?? "mid";
    const targetAct = placement === "early" ? 1 : placement === "late" ? 3 : 2;
    const actScenes = allScenes.filter((s: any) => s.act === targetAct);
    const candidates = actScenes.length > 0 ? actScenes : allScenes;
    const target = [...candidates].sort(
      (a: any, b: any) => (a.cluesRevealed?.length ?? 0) - (b.cluesRevealed?.length ?? 0),
    )[0];
    if (target) {
      if (!Array.isArray(target.cluesRevealed)) target.cluesRevealed = [];
      if (!target.cluesRevealed.includes(clueId)) target.cluesRevealed.push(clueId);
    }
  }
  ctx.warnings.push(
    `[Agent 7 clue-job authority] re-ran coverage gate: force-assigned ${uncovered.length} unanchored clue id(s) after stamping.`,
  );
}

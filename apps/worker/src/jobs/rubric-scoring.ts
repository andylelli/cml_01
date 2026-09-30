/**
 * Final-story rubric scoring, moved verbatim out of `mystery-orchestrator.ts` (code review ORC-07).
 *
 * One body: the orchestrator calls it; `agent9-replay.ts` still carries its own `runRubric`, which
 * ignores RUBRIC_JUDGE_MODEL and skips the structural verifiers — moving the replay onto this one
 * changes that replay's scores, so it is the owner's call (ledger ORC-Q02).
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
// X37 — a refused judge is a measurement that did not happen, and must say so (REVIEW_09 §4).
import { isContentFilterRefusal } from "@cml/llm-client";
import { assembleScoringChapterTexts } from "@cml/prompts-llm";
// LLM critic + deterministic cap engine.
import { createLLMRubricJudge, scoreStory } from "@cml/rubric-score";
import type { ScoreAggregator } from "@cml/story-validation";

import { describeError } from "./agents/index.js";
// ============================================================================
// Final-story rubric scoring (aligning-the-scoring-system.md)
// ============================================================================
// An LLM critic scores the finished prose across the 10-category /100 rubric; a deterministic cap
// engine then enforces the rubric's hard caps. Runs in SHADOW: the score is logged and attached to
// the report as a diagnostic, but does NOT (yet) replace the headline overall_score. Wrapped so it
// can NEVER break a run. Set RUBRIC_SCORING_MODE=off to skip.

/** Assemble each chapter into its own string (title + body), in order. */
function assembleChapters(prose: any): string[] {
  // A_64 §2 (the 7.2 rewire) — DELEGATED to the shared assembly so the dual-value lever's ship-scope
  // detector and this scoring text provably read the same string (the split-brain that let the cap
  // fire while the enabled lever stayed silent on every 7.2 arm).
  return assembleScoringChapterTexts(Array.isArray(prose?.chapters) ? prose.chapters : []);
}

export async function runRubricScoring(args: {
  prose: unknown;
  cml: unknown;
  client: AzureOpenAIClient;
  aggregator?: ScoreAggregator;
  warnings: string[];
  runId: string;
  projectId?: string;
  /** A_57 D2 — the world-state ledger's canonical staged/true pair (for the dual-value-without-contrast cap). */
  discriminatingPair?: { values: [string, string] } | null;
}): Promise<void> {
  /**
   * REVIEW_05 §13 (M1) — hand the judge a deterministic verdict on whether the reveal disclosed.
   *
   * Read off the geometry acceptance test that already ran on the committed chapters. This is the one
   * place geometry pays for itself immediately: the judge's `noResolution` fact had no extractor, and
   * the story it got wrong is the story that drags calibration from 86% to 50%.
   *
   * `null` when geometry did not run or bound no reveal chapter — never `false`, because "not
   * measured" must not read as "the reveal disclosed".
   */
  const geometryAcceptance = (args.prose as any)?.validationDetails?.storyGeometry;
  // `met_by_injection` counts as a resolution for the JUDGE: the culprit IS named on the page, badly.
  // The story that broke calibration (2026-08-02-1936) had no such sentence at all — it ends on "the
  // truth poised to emerge" — so `unmet` is the state that must cap the ending. Treating an injected
  // disclosure as `noResolution` would cap every run the floor fires on, which is a scoring change
  // made on n=1. It is counted separately instead (REVIEW_05 §10.1).
  //
  // FOUND ON REVIEW 2026-08-06 — AND IT MUST BE THE STORY-LEVEL VERDICT, NOT THE BOUND CHAPTER'S.
  //
  // This read `reveal_culprit_not_named`, which asks whether the chapter the CONTRACT BOUND discloses.
  // That is the right question for a repair pass and the wrong one for scoring. On the 08-04 run the
  // contract bound chapter 8 while the disclosure landed in chapter 10 (§14.3), so the check returned
  // `unmet` about a manuscript that names its culprit on the page — inverting the decision §14.4 had
  // just made, on a fact the detector WINS with, so nothing downstream could correct it. N4 measures
  // that misbinding on 2 of 3 archived outlines (§15.1): the common case, not the edge.
  //
  // `manuscriptDisclosure` scans every chapter, which is what `noResolution` has always meant. It also
  // keeps M1's original catch: story 1936 discloses NOWHERE, so it still reads `unmet` — where merely
  // withholding the verdict on an uncertain binding would have thrown away the one story the whole
  // diagnosis was built from.
  const disclosure = geometryAcceptance?.manuscript_disclosure;
  const noResolutionVerdict: boolean | null = disclosure?.verdict ? disclosure.verdict === "unmet" : null;
  /**
   * A_86 items 46-48 — this is a SHADOW call. It gates nothing, it is ~2% of run spend, and on run
   * 24901 it failed with an Azure HTTP 400 (a content-filter refusal on the finished manuscript) and
   * produced nothing at all — paid for, and wasted.
   *
   * Three things change here, none of which touch the manuscript:
   *   • `off` already existed and is the right setting when credits are short (item 47) — the score
   *     is a health signal only, since no judge separates an 86 from an 81 (n=8).
   *   • `read-only` (item 48) runs it only for a run that will actually be read externally, which
   *     is what the number is FOR. Set `RUBRIC_SCORING_MODE=read-only` and export
   *     `CML_RUN_WILL_BE_READ=1` on the pre-registered runs.
   *   • a refusal is now reported as a refusal (item 46) rather than swallowed into silence, so the
   *     run summary's shadow-spend line can be read against something.
   */
  const mode = (process.env.RUBRIC_SCORING_MODE ?? "shadow").toLowerCase();
  if (mode === "off") return;
  if (mode === "read-only" && process.env.CML_RUN_WILL_BE_READ !== "1") {
    console.info(
      "[RubricScorer][A_86 item 48] skipped — RUBRIC_SCORING_MODE=read-only and this run is not " +
        "marked for an external read (CML_RUN_WILL_BE_READ=1). The score gates nothing.",
    );
    return;
  }
  try {
    const chapters = assembleChapters(args.prose);
    const proseText = chapters.join("\n\n");
    if (proseText.length < 200) return; // nothing meaningful to score
    // K2 §3: the final judge model is independently configurable so it can point at a STRONGER deployment
    // than the per-agent scorers. RUBRIC_JUDGE_MODEL wins; falls back to the run's default deployment.
    const model = process.env.RUBRIC_JUDGE_MODEL || process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    const judge = createLLMRubricJudge(
      (chatArgs) =>
        args.client.chat({
          ...chatArgs,
          model: chatArgs.model ?? model,
          logContext: { agent: "RubricScorer", runId: args.runId, projectId: args.projectId ?? "unknown" },
        } as any),
      { model, temperature: 0.2, maxTokens: 4000 },
    );
    // K2 §1: the true chapter boundaries (the planting check is rubric-score's own import since CR-16 / A34-10)
    // so the structural verifiers can veto/confirm the judge's checkable flags.
    const r = await scoreStory({
      prose: proseText,
      cml: args.cml,
      judge,
      chapters,
      discriminatingPair: args.discriminatingPair,
      noResolutionVerdict,
    });
    const vetoes = [
      r.structural?.unplantedEvidenceVetoed && "unplanted-evidence vetoed",
      r.structural?.mechanismTimingVetoed && "mechanism-timing vetoed",
      r.structural?.citationsDropped?.length && `citations dropped: ${r.structural.citationsDropped.join(",")}`,
    ].filter(Boolean);
    console.info(
      `[Rubric] ${r.final}/100 (${r.band}); raw ${r.rawTotal}` +
        (r.capsApplied.length ? `; caps: ${r.capsApplied.join("; ")}` : "") +
        (vetoes.length ? `; structural: ${vetoes.join("; ")}` : ""),
    );
    args.warnings.push(`Final-story rubric (shadow): ${r.final}/100 — ${r.band}`);
    if (noResolutionVerdict !== null) {
      args.warnings.push(
        `Final-story rubric: noResolution supplied deterministically by geometry = ${noResolutionVerdict} ` +
          `(judge's own view: ${r.facts?.noResolution === noResolutionVerdict ? "agreed" : "OVERRIDDEN"}).`,
      );
    } else {
      // Written down for the same reason the counters are: a run where the deterministic verdict was
      // UNAVAILABLE must be distinguishable from one where it was never wired. M1b reads this to know
      // which archived scores rest on the judge's own opinion of the ending.
      args.warnings.push(
        `Final-story rubric: noResolution NOT supplied — geometry produced no manuscript-level ` +
          `disclosure verdict this run (acceptance off, or the case names no culprit). The judge's own ` +
          `view of the ending stands unchallenged.`,
      );
    }
    args.aggregator?.upsertDiagnostic("rubric_score", "scoring", "Final-Story Rubric", "rubric_score", {
      final: r.final,
      band: r.band,
      raw_total: r.rawTotal,
      categories: r.categories,
      caps_applied: r.capsApplied,
      structural: r.structural,
      overall_view: r.rubric.overall_view,
      main_problems: r.rubric.main_problems,
      fastest_fixes: r.rubric.fastest_fixes,
      // A_71 (A_70 §6) — attribute the score to the model that produced it.
      //
      // A_70 measured the judge running on `gpt-4o-mini`, the cheapest deployed model, and filed it
      // under A_67 §3.2's open "internal-judge sensitivity unproven". The lever to fix that
      // (`RUBRIC_JUDGE_MODEL`) has existed since K2 §3 — but while it is unset the judge silently
      // inherits `AZURE_OPENAI_DEPLOYMENT_NAME`, so changing the BASE model retunes the scale that
      // gates and caps the whole pipeline, with nothing on the artifact to say it moved. Every
      // cross-run rubric comparison in the ledger assumes a fixed judge; this records whether it was.
      judge_model: model,
      judge_model_explicit: Boolean(process.env.RUBRIC_JUDGE_MODEL),
      judge_model_source: process.env.RUBRIC_JUDGE_MODEL
        ? "RUBRIC_JUDGE_MODEL"
        : "AZURE_OPENAI_DEPLOYMENT_NAME (inherited)",
    });
    if (!process.env.RUBRIC_JUDGE_MODEL) {
      args.warnings.push(
        `Final-story rubric: judge model "${model}" inherited from AZURE_OPENAI_DEPLOYMENT_NAME — ` +
          `set RUBRIC_JUDGE_MODEL to pin the scale that gates and caps the pipeline`,
      );
    }
  } catch (e) {
    /**
     * X37 (REVIEW_09 §4) — A REFUSED SCORER MUST BE LOUD, AND MUST LEAVE A MARK ON THE REPORT.
     *
     * On the 08-15 run Azure's content filter refused the RubricScorer prompt — the judge would not
     * read the manuscript the pipeline had just written — and the whole of that fact was one line
     * reading `Rubric scoring skipped: {\` with the raw error blob truncated after two characters.
     * No `rubric_score` diagnostic was emitted at all, so the report carried nothing where the score
     * belongs, and "the judge refused this story" looked exactly like "scoring was switched off".
     *
     * That is the A_70/A_71 rule this project keeps re-learning: a number that is never written is
     * indistinguishable from a check that never ran. So the class is named, the consequence is
     * stated, and the diagnostic is emitted anyway — carrying `not_measured` instead of a score.
     */
    const refused = isContentFilterRefusal(e);
    args.warnings.push(
      refused
        ? `Final-story rubric NOT MEASURED — Azure's content filter refused the judge's prompt, which ` +
            `carries the manuscript this run just wrote. There is no internal score for this story, so ` +
            `no internal-to-external comparison can be made from it. (A_71 content-filter class; the ` +
            `run is otherwise unaffected.)`
        : `Final-story rubric NOT MEASURED — the judge failed: ${describeError(e)}`,
    );
    try {
      args.aggregator?.upsertDiagnostic("rubric_score", "scoring", "Final-Story Rubric", "rubric_score", {
        not_measured: true,
        reason: refused ? "content_filter_refusal" : "judge_error",
        detail: describeError(e).slice(0, 300),
      });
    } catch {
      // Telemetry must never turn a missing score into a failed run.
    }
  }
}

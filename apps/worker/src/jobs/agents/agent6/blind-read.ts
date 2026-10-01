/**
 * Agent 6 phase: the primary blind-reader read (and its refusal retry). Moved from agent6-run.ts
 * (code review A6-01 / CR-25).
 */
import { caseOf } from "@cml/cml";
import { envOn } from "../../env-flags.js";
import {
  blindReaderSimulation,
} from "@cml/prompts-llm";
import type { BlindReaderResult } from "@cml/prompts-llm";
import { isContentFilterRefusal } from "@cml/llm-client";
import {
  type OrchestratorContext,
} from "../shared.js";

/** X33 continued — one analysis-framed retry when the content filter refuses the blind read. */
const isBlindReaderRefusalRetryEnabled = () =>
  envOn("AGENT6_BLIND_READER_REFUSAL_RETRY");

export async function runPrimaryBlindReadPhase(ctx: OrchestratorContext, blindReadEligible: boolean, primaryBlindRead: BlindReaderResult | null, runPrimaryBlindRead: () => Promise<BlindReaderResult>, falseAssumptionStatement: string, castNamesForBlind: string[]) {
  if (blindReadEligible) {
    ctx.reportProgress("fairplay", "Running blind reader simulation...", 73);
    try {
      primaryBlindRead = await runPrimaryBlindRead();
    } catch (err) {
      if (!isContentFilterRefusal(err)) throw err;
      /**
       * X33 continued, 2026-09-07 — ONE RETRY, because "not retryable" is not supported.
       *
       * MEASURED over the 26 post-X70 runs: this refusal fires on **20 of 26 (77%)**, so the only
       * check that asks whether a cold reader can solve the case from the clues alone does not run
       * on three books in four — and its remediation loop does not run either.
       *
       * The docblock above says the refusal "is not retryable (the same prompt earns the same
       * refusal)". PROBED against the real endpoint on three stored cases whose runs each recorded a
       * refusal (2026-08-17, 2026-08-18, and one earlier): **the UNCHANGED prompt passed on 3 of 3.**
       * So the probe FAILED TO REPRODUCE ITS OWN KNOWN-POSITIVE — which means the refusal is not a
       * stable property of the prompt, and the claim this branch was built on does not hold. Whether
       * that is filter non-determinism or an Azure policy change since August cannot be told apart
       * from here, and both make a retry worth one call.
       *
       * WHAT IS AND IS NOT CLAIMED. The retry's efficacy is UNPROVEN: with no reproducible refusal
       * there was nothing to fix and then re-measure. What is certain is the bound — today a refusal
       * SKIPS the gate, so a second attempt either recovers a measurement worth having or lands
       * exactly where the run already was, for about $0.001. The second attempt reframes the system
       * prompt as literary analysis and leaves the clue text untouched, because neutralising the
       * evidence would raise the pass rate by measuring a different book.
       */
      if (isBlindReaderRefusalRetryEnabled()) {
        try {
          primaryBlindRead = await blindReaderSimulation(
            ctx.client,
            ctx.clues!,
            falseAssumptionStatement,
            castNamesForBlind,
            { runId: ctx.runId, projectId: ctx.projectId || "", analysisFraming: true, caseCast: caseOf(ctx.cml)?.cast }
          );
          ctx.warnings.push(
            `[Agent 6] blind reader RECOVERED on retry — the first prompt was refused by the content ` +
            `filter, the analysis-framed retry was not. The gate ran; its verdict is below.`
          );
        } catch (retryErr) {
          if (!isContentFilterRefusal(retryErr)) throw retryErr;
          // Both framings refused. Fall through to the unchanged NOT MEASURED outcome below.
        }
      }
    }
    if (blindReadEligible && !primaryBlindRead) {
      ctx.warnings.push(
        `[Agent 6] blind reader NOT MEASURED — Azure refused the prompt (content filter; the case's ` +
        `death method is in it). The gate is SKIPPED, not passed, and its remediation loop does not ` +
        `run. Counted in the run's content-filter telemetry (A_71).`
      );
    }
  }
  return primaryBlindRead;
}

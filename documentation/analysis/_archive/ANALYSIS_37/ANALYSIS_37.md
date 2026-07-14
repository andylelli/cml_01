# ANALYSIS 37

## Scope

Audited run: `run_d3cf0c3f-048e-46f1-b840-a17f801b614d`

Project: `proj_6e502e7d-ce5e-4cff-9f8d-9ded9f2105dc`

Prompt folder: `documentation/prompts/actual/run_20260614-1014_d3cf0c3f`

Report file: `apps/api/data/reports/proj_6e502e7d-ce5e-4cff-9f8d-9ded9f2105dc/run_d3cf0c3f-048e-46f1-b840-a17f801b614d.json`

This analysis reviews the latest post-clear run and checks whether the recent Agent 9 retry changes are improving run success and scoring/report truthfulness.

## Executive Summary

The run did not complete. It aborted during Agent 9 after eight chapters were generated, while attempting Chapter 9.

The main failure was:

`Generation-exception fallback for chapter 9 failed validation: Stage-mode outcome failed (suspect_pressure): chapter must include at least one new pressure reveal (fear, motive, lie, loyalty conflict, or secret).`

The recent retry changes are not yet producing the intended behavior. The runtime still allowed Chapter 9 to consume six attempts, and the final report preserved an inflated score and a misleading phase summary even though the run was aborted.

## Run Outcome

Observed report values:

- `passed: false`
- `run_outcome: aborted`
- `overall_score: 97.71`
- `overall_grade: A`
- `release_gate_outcome.status: unknown`
- `summary.phases_passed: 14`
- `summary.phases_failed: 0`
- `summary.retry_stats.total_retries: 0`
- `agent9_prose_post_generation_summary.component_failures: ["prose_generation_aborted"]`
- `agent9_prose_post_generation_summary.aborted_after_chapter: 8`
- `agent9_prose_post_generation_summary.batches_with_retries: 6`

This is internally contradictory: the run correctly marks `passed: false` and `run_outcome: aborted`, but the score, grade, phase counts, normalized display status, and retry stats still make the run look successful.

## Prompt Log Findings

The prompt archive shows Agent 9 Chapter 9 entered repeated retry attempts:

- `33_Agent9-ProseGenerator-Ch9_request.md`
- `34_Agent9-ProseGenerator-Ch9_retry1_request.md`
- `35_Agent9-ProseGenerator-Ch9_retry2_request.md`
- `36_Agent9-ProseGenerator-Ch9_retry3_request.md`
- `37_Agent9-ProseGenerator-Ch9_retry4_request.md`
- `38_Agent9-ProseGenerator-Ch9_retry4_request.md`

The last two prompt files both use `retry4`, even though `.actual-run-state.json` records retry attempts 5 and 6. This means the prompt archive is collapsing attempt labels above retry 4.

The run-state integrity block also recorded:

- `missing_request_count: 1`
- `missing_response_count: 0`
- `empty_response_body_count: 0`

So the prompt archive is mostly usable, but not clean enough to be treated as an exact attempt ledger.

## Retry Behavior

The recent split/retry protocol is partially present in prompts, but the actual execution did not behave like a strict two-retry attempt limit.

Evidence:

- Chapter 9 ran six total attempts.
- Retry prompt text showed attempt contexts up to `6/6`.
- The retry packet text was off by one relative to outer attempt context; for example, the final Chapter 9 retry request showed `Attempt context: 6/6` while the packet showed `ATTEMPT: 5/6`.
- The final two archived attempts both used the same `retry4` suffix.

The source-level reason is that `shouldContinueRetry()` can mark a non-template repeated failure as non-convergent, but Agent 9's default completion-first mode continues anyway unless `preferCompletionOnFailure` is false.

Relevant behavior:

- `packages/prompts-llm/src/retry-protocol.ts` stops non-template repeated failures before the full retry budget.
- `packages/prompts-llm/src/agent9-prose/generate.ts` logs the non-convergence but continues when `preferCompletionOnFailure` is enabled.
- `apps/worker/config/generation-params.yaml` still sets `agent9_prose.generation.default_max_attempts: 6`.

Conclusion: the intended "split into 2 retries each attempt" behavior is not yet enforced in the Agent 9 runtime path used by this run.

## Scoring/Reporting Findings

The scoring/reporting layer still overstates success for partial prose aborts.

The report says the run aborted, but still reports:

- `overall_score: 97.71`
- `overall_grade: A`
- `summary.phases_passed: 14`
- `summary.phases_failed: 0`
- `summary.pass_rate: 100`
- `diagnostics.normalized_run_status.details.display_status: passed`

The partial-abort diagnostic correctly records `prose_generation_aborted`, but the prose phase score from the last partial checkpoint is not converted into a failed terminal Agent 9 phase for mid-story aborts. There is a zero-chapter abort path that inserts a failed prose phase, but the eight-chapter abort path only logs diagnostics.

This means the report can be terminally aborted while still presenting a high score and all phases passing.

## Primary Issues

### 1. Chapter 9 stage-mode failure remained unresolved

The terminal failure was not a parser-only or infrastructure-only issue. The deterministic fallback itself failed validation because Chapter 9 did not satisfy suspect-pressure stage requirements.

This suggests the fallback builder needs to be stage-mode aware enough to generate at least one valid new pressure reveal for `suspect_pressure` chapters.

### 2. Retry control does not enforce non-convergence stop

The retry protocol classifies repeated failures and can decide not to continue, but completion-first mode overrides that stop and continues to the full configured attempt budget.

This makes the retry protocol's non-convergence signal advisory rather than controlling.

### 3. Attempt accounting is confusing

There are three different attempt labels in play:

- outer attempt context
- retry packet `ATTEMPT`
- archived filename suffix

They do not line up cleanly. This makes post-run diagnosis slower and risks hiding whether retry changes are actually working.

### 4. Report summary does not reflect abort severity

An aborted run should not keep a 97.71/A headline score with 100 percent phase pass rate. Even if partial chapter quality was high, terminal scoring should clearly communicate that the publishable run failed.

### 5. Retry stats do not include batch retries

`summary.retry_stats.total_retries` remained zero while Agent 9 diagnostics reported six batches with retries. This makes the dashboard under-report instability.

## What Improved

Some recent changes are directionally useful:

- Retry packets now classify stage-mode and reveal failures more specifically.
- The prompts contain targeted retry feedback rather than generic repair instructions.
- The scoring adapter now has reader-trust signals for control-plane leakage, lifecycle collapse, and fallback use.
- Completed prose can now be capped by trust-signal penalties.

These are useful building blocks, but this run shows they are not yet sufficient to improve end-to-end success.

## Recommended Fixes

1. Make non-convergence authoritative for non-template failures, or explicitly separate "completion-first keep going" from "strict success mode".

2. Set the runtime retry budget to match the intended policy. If the goal is two retries per chapter attempt, the configured budget and prompt language should reflect that consistently.

3. Fix prompt archive attempt naming so attempts above retry 4 do not collapse into duplicate `retry4` files.

4. On any mid-story Agent 9 abort, upsert a failed `agent9_prose` phase score before saving the terminal report.

5. Ensure `normalized_run_status` is computed after aborted metadata is applied, or derive it directly from final `run_outcome`.

6. Include Agent 9 batch retries in report retry statistics, or expose a separate `batch_retry_stats` field in the summary.

7. Make deterministic fallback generation stage-mode aware for `suspect_pressure`, especially requiring a concrete new fear, motive, lie, loyalty conflict, or secret reveal.

## Verdict

The recent changes do not yet demonstrably improve run success or scoring reliability. They add better retry vocabulary and useful scoring caps, but the latest run still aborted in Agent 9, continued through six attempts, and produced a misleading high-score aborted report.

The next fixes should focus less on adding more retry text and more on enforcing retry control, making fallback chapters satisfy the same stage-mode validators, and making terminal reports accurately represent aborted runs.

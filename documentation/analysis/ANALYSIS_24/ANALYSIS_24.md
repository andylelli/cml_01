# ANALYSIS_24 - Review of 3 failed runs under documentation/prompts/actual

Date: 2026-05-27

## Scope

This document reviews the three failed runs captured under:
- documentation/prompts/actual/run_20260524-0958_mystery
- documentation/prompts/actual/run_20260526-1744_mystery
- documentation/prompts/actual/run_20260526-1849_mystery

Primary sources used:
- prompt capture indexes in each run folder (INDEX.md and .actual-run-state.json)
- run reports in apps/api/data/reports/<runId>/<runId>.json

Run IDs:
- mystery-1779616726317
- mystery-1779817497233
- mystery-1779821356623

---

## Executive Summary

All three runs are marked failed, but they are not equivalent failures.

1. Runs mystery-1779616726317 and mystery-1779817497233 are report-level failures driven by a Novelty Audit pass/fail contradiction.
2. Run mystery-1779821356623 has the same Novelty contradiction and a real hard failure in Agent9 Prose Generation (Chapter 6 retry exhaustion).
3. Prompt-capture integrity is incomplete in all three folders (missing_request_count > 0), and both 2026-05-26 runs include a pending Agent9 Ch6 response entry.
4. Before Agent9, retries occurred in all three runs and were concentrated in Agent5-ClueExtraction.

The highest-leverage issue is the Novelty scoring contract inconsistency because it produces hard failed outcomes even when the novelty test itself reports pass.

---

## Per-Run Comparison

| Run Folder | Run ID | Report Outcome | Overall | Failed Phases | Distinct Hard Failure |
|---|---|---|---|---|---|
| run_20260524-0958_mystery | mystery-1779616726317 | failed | 74 (C) | agent8_novelty | No prose abort in report reason |
| run_20260526-1744_mystery | mystery-1779817497233 | failed | 74 (C) | agent8_novelty | No prose abort in report reason |
| run_20260526-1849_mystery | mystery-1779821356623 | aborted | 74 (C) | agent8_novelty, agent9_prose | Ch6 failed after 6 attempts (n-gram overlap + audit-note leakage) |

---

## Pre-Agent9 Retry Occurrences

Retry occurrences before Agent9 were extracted from each run's .actual-run-state.json using retryAttempt > 1 and agent not starting with Agent9.

| Run Folder | Run ID | Pre-Agent9 Calls | Pre-Agent9 Retry Calls | Retry Agents |
|---|---|---:|---:|---|
| run_20260524-0958_mystery | mystery-1779616726317 | 17 | 2 | Agent5-ClueExtraction (attempts 2, 3) |
| run_20260526-1744_mystery | mystery-1779817497233 | 19 | 2 | Agent5-ClueExtraction (attempts 2, 3) |
| run_20260526-1849_mystery | mystery-1779821356623 | 16 | 1 | Agent5-ClueExtraction (attempt 2) |

Detailed occurrences:
- run_20260524-0958_mystery: seq 8 (attempt 2), seq 9 (attempt 3) in Agent5-ClueExtraction
- run_20260526-1744_mystery: seq 8 (attempt 2), seq 9 (attempt 3) in Agent5-ClueExtraction
- run_20260526-1849_mystery: seq 8 (attempt 2) in Agent5-ClueExtraction

Interpretation:
- Pre-Agent9 retries are not widely distributed across upstream agents in these three runs.
- The repeat retry hotspot is Agent5-ClueExtraction, indicating clue-coverage/gating pressure before prose generation.

---

## Key Findings

### F1. Novelty phase contract is internally contradictory across all 3 runs

Observed in each report for agent8_novelty:
- phase threshold = 75
- phase total = 80
- test message says pass (similarity below threshold)
- but phase passed = false and score.passed = false

This contradiction appears in:
- mystery-1779616726317 (test message: 78% similar ... pass)
- mystery-1779817497233 (test message: 65% similar ... pass)
- mystery-1779821356623 (test message: 75% similar ... pass)

Impact:
- Runs are marked failed even when the novelty test outcome text is pass.
- This undermines trust in run_outcome and blocks valid runs from being classified clean.

### F2. Real prose instability exists in the newest run (mystery-1779821356623)

Run outcome reason explicitly states Chapter 6 failed after 6 attempts due:
- Template linter high n-gram overlap (0.65 >= 0.65)
- Internal audit note leakage into prose

Impact:
- This is a genuine content-generation failure path (independent of the novelty scoring bug).
- It causes hard aborts and should be treated as a separate reliability track.

### F3. Prompt-capture completeness is degraded in all three folders

From each INDEX.md:
- run_20260524-0958_mystery: missing_request_count = 3
- run_20260526-1744_mystery: missing_request_count = 3, missing_response_count = 1, pending Agent9 Ch6 response
- run_20260526-1849_mystery: missing_request_count = 2, missing_response_count = 1, pending Agent9 Ch6 response

Impact:
- Postmortems and prompt-forensics are less deterministic.
- Missing or pending artifacts can mask true retry flow and failure context.

---

## Root-Cause Hypotheses (Ranked)

1. Novelty scoring pass computation mismatch (highest confidence)
- Likely divergence between computed total/threshold and boolean pass assignment for agent8_novelty.
- The boolean appears to ignore or override numeric threshold logic.

2. Agent9 Chapter 6 anti-template controls are not converging under retry pressure
- Retry prompts still permit high overlap and occasional metadata leakage into narrative text.
- Current repair loop can exhaust retries without escaping the failure manifold.

3. Prompt capture/indexing races or truncation in artifact writer
- Pending responses and missing request counts suggest write-order or flush timing gaps in capture pipeline.

---

## Recommended Fix Plan

### P1. Fix Novelty pass/fail contract first (blocker)

Goal:
- Eliminate false run failures caused by novelty contradiction.

Required invariants:
- If total >= threshold, phase passed must be true.
- If test says pass and no blocking violation exists, phase passed cannot be false.
- score.passed and phase passed must be identical or derivable by one explicit rule.

Validation:
- Add unit tests for novelty scoring truth table:
  - pass message + total >= threshold => passed true
  - fail message + total < threshold => passed false
  - blocking violation => passed false regardless of numeric score
- Re-run one canary and verify run_outcome is no longer failed solely due novelty contradiction.

### P2. Harden Agent9 Chapter 6 failure mode (prevention-oriented)

Goal:
- Prevent retry exhaustion by constraining failure modes before generation.

Required controls:
- Strengthen anti-template instruction as a strict precondition at request build time.
- Add deterministic preflight sanitizer that strips/blocks internal audit phrasing before validation.
- Escalate to structured rewrite mode after first n-gram fail instead of repeating same freeform retry.

Validation:
- Targeted regression around Chapter 6 retry loop.
- Verify no audit-note leakage and reduced n-gram overlap across retries.

### P3. Repair prompt-capture integrity

Goal:
- Ensure prompt/response artifact sets are complete for every run.

Required controls:
- Atomic write-and-index updates for request/response pairs.
- End-of-run integrity reconciliation that backfills pending responses when present in source logs.

Validation:
- For subsequent runs, missing_request_count == 0 and missing_response_count == 0.

---

## Deep Dive: Pre-Agent9 Retry Elimination Plan

### Retry Trigger Map (what was causing upstream retries)

In Agent5 run flow, pre-Agent9 retries were primarily triggered by four LLM regeneration branches:
- Guardrail/source-path regeneration branch
- Inference coverage regeneration branch
- Suspect coverage regeneration branch
- Red-herring overlap regeneration branch

In the three reviewed runs, the observed pre-Agent9 retries were concentrated in Agent5 and aligned with these branches.

### Prevention-First Design (implemented)

Goal:
- Make pre-Agent9 retries exceptional by default, replacing most LLM regeneration loops with deterministic remediation.

Implemented behavior:
1. New default mode: deterministic remediation first
- Agent5 now defaults to no LLM retry loops unless explicitly enabled.
- Opt-in switch for legacy behavior: AGENT5_ENABLE_LLM_RETRIES=true.

2. Deterministic suspect-coverage backstop (new)
- Added deterministic synthesis for uncovered/weak-elimination suspects.
- Generates essential mid elimination clues with legal source paths and explicit elimination pointsTo text.
- Eliminates the need for the prior suspect-coverage LLM retry in the default path.

3. Deterministic red-herring remediation path
- When overlap is detected, Agent5 now sanitizes overlap terms and prunes persistent severe overlaps directly in deterministic mode.
- LLM regeneration for red herrings only occurs in explicit retry-enabled mode.

4. Deterministic-first handling for coverage and source-path criticals
- In default mode, Agent5 no longer immediately regenerates via LLM for these issues.
- It proceeds into deterministic contract/backstop enforcement and synthesis pipeline.

5. Retry accounting corrected
- Retry penalty now reflects actual retry invocation flags, not just issue presence.
- This prevents inflated retry diagnostics when deterministic remediation resolves issues without LLM retries.

### Code Changes

Primary implementation file:
- apps/worker/src/jobs/agents/agent5-run.ts

Key additions/changes:
- agent5LlmRetriesEnabled() with prevention-first default (LLM retries disabled unless opted in)
- synthesizeSuspectCoverageBackstopClues(...)
- runAgent5 branch gating so retry loops execute only when AGENT5_ENABLE_LLM_RETRIES is enabled
- deterministic red-herring overlap remediation in default mode
- accurate retry penalty booleans: performedCoverageRetry, performedSuspectRetry, performedRedHerringRetry

### Validation Completed

Targeted test suite passed after changes:
- npm run -w @cml/worker test -- src/__tests__/agent5-run.test.ts
- Result: 34 passed, 0 failed

### Expected Outcome

For runs like the three analyzed here:
- Pre-Agent9 retries should drop materially because Agent5 now resolves most upstream defects via deterministic synthesis/sanitization first.
- Remaining retries should be limited to explicit opt-in mode or catastrophic malformed payload paths.

### Canary Confirmation Criteria

On the next canary run, confirm:
- Agent5 has no pre-Agent9 regeneration loop calls in prompt artifacts unless AGENT5_ENABLE_LLM_RETRIES is explicitly set.
- Agent5 warnings show deterministic synthesis/sanitizer actions rather than retry-loop messages.
- Run quality and downstream phase stability remain at or above current baseline.

---

## Evidence Pointers

Prompt capture indexes:
- documentation/prompts/actual/run_20260524-0958_mystery/INDEX.md
- documentation/prompts/actual/run_20260526-1744_mystery/INDEX.md
- documentation/prompts/actual/run_20260526-1849_mystery/INDEX.md

Run reports:
- apps/api/data/reports/mystery-1779616726317/mystery-1779616726317.json
- apps/api/data/reports/mystery-1779817497233/mystery-1779817497233.json
- apps/api/data/reports/mystery-1779821356623/mystery-1779821356623.json

Critical abort reason location:
- apps/api/data/reports/mystery-1779821356623/mystery-1779821356623.json (run_outcome_reason)

---

## Suggested Next Step

Execute P1 first and rerun a single canary with the same input family.

Success criterion for immediate confirmation:
- novelty test pass + novelty total above threshold + phase passed true + run_outcome not failed for novelty alone.

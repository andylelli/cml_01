# ANALYSIS_55 - Run 34d713c0 Error and Warning Report

**Date:** 2026-04-14
**Source run log:** `apps/worker/logs/run_20260414_34d713c0.json`
**Run ID:** `run_34d713c0-f866-4cdc-a122-9e14fa4f5636`
**Project ID:** `proj_287b137e-b0a0-44a6-b775-cf023a7c6a09`
**Scope:** Canonical capture of all warnings and errors emitted in this failed run.

---

## 0. Overview

This run failed in Agent 5 after clue-regeneration retries. The pipeline stopped before fair-play, profile generation, narrative, and prose stages.

- `status`: `failed`
- `durationMs`: `124752`
- `completedAt`: `2026-04-14T19:07:25.609Z`
- `wordCounts.total`: `0`

---

## 1. Stage Progress Snapshot

Completed stages before failure:

1. `setting` - Era and setting refined
2. `cast` - Cast designed (5 characters)
3. `background-context` - Background context generated
4. `hard_logic_devices` - Generated 5 novel hard-logic devices
5. `cml` - Mystery structure generated and validated
6. `novelty` - Novelty check skipped (threshold >= 1.0)
7. `clues` - Regenerating clues to address suspect coverage gaps...

Failure occurred during stage 7 (`clues`).

---

## 2. Warning Inventory (Verbatim)

### 2.1 System and scoring context

1. `Scoring system enabled - tracking quality metrics and retries`

### 2.2 Inference coverage warnings

1. `Inference coverage: [warning] 2 red herring(s) may accidentally support the true solution (rh_1, rh_2)`
2. `Inference coverage: [critical] Discriminating test evidence_clues reference missing clue id(s): clock shows ten minutes past eleven, witnesses heard the clock chime at 7:55 PM, clock has a noticeable scratch`
3. `Inference coverage: [critical] Discriminating test references no evidence found in the clue set`
4. `Inference coverage: [warning] 3 suspect(s) (Mabel Atkinson, Edgar Kendall, Nora Stratton) are never referenced in any clue`

### 2.3 Clue regeneration and gate warnings

1. `Inference coverage gate: critical gaps found; regenerating clues with coverage feedback`
2. `Agent 5 (retry 1): 2 suspect(s) are named but lack elimination/alibi evidence; regenerating targeted clues`
3. `  - 2 suspect(s) (Mabel Atkinson, Edgar Kendall) are referenced but lack elimination/alibi evidence`
4. `  - Mabel Atkinson: referenced clue IDs: clue_9; elimination clues: (none); alibi clues: (none)`
5. `  - Edgar Kendall: referenced clue IDs: clue_10; elimination clues: (none); alibi clues: (none)`

---

## 3. Error Inventory (Verbatim)

1. `Pipeline failure: Agent 5 suspect-coverage gate failed after retry. Weak elimination/alibi evidence: Edgar Kendall, Nora Stratton`

---

## 4. Classification and Impact

### 4.1 Fatal error classification

- Class: Agent 5 hard gate failure (weak elimination/alibi suspect evidence after retry)
- Impact: Pipeline abort before fair-play and prose; no downstream artifacts generated
- Retry behavior: Regeneration was attempted but still failed suspect evidence requirements

### 4.2 Warning severity snapshot

- Critical-warning count: 2 (both discriminating-test evidence linkage warnings)
- Coverage-risk warning count: 2 (red-herring overlap risk, suspect non-reference warning)
- Stage abort trigger: weak elimination/alibi evidence after retry

---

## 5. Root-Cause Highlights from This Run

1. **Discriminating-test evidence IDs were unresolved:** referenced `evidence_clues` values did not map to actual clue IDs.
2. **Discriminating-test evidence chain was effectively empty:** a second critical warning confirms no discriminating evidence resolved in the clue set.
3. **Suspect evidence quality was insufficient after retry:** weak elimination/alibi coverage remained for named suspects.
4. **Red-herring overlap risk remained active:** two red herrings were still flagged as potentially supporting the true solution.

---

## 6. Direct Follow-up Targets

1. Enforce strict clue-ID schema for discriminating-test `evidence_clues` (IDs only, no prose fragments).
2. Keep Agent 5 pre-exit gate hard-failing whenever discriminating-test evidence cannot resolve to clue objects.
3. Require elimination/alibi evidence minimums for all non-culprit suspects after bounded retry.
4. Preserve and monitor overlap diagnostics (`red_herring_id -> inference step indexes and correction words`) to confirm red-herring cleanup.
5. Re-run and confirm progression beyond clues stage into fair-play and prose (`wordCounts.total > 0`).

---

## 7. Notes

- This report records warnings and errors as emitted by the run log.
- This document continues numbering sequence as `ANALYSIS_55`.

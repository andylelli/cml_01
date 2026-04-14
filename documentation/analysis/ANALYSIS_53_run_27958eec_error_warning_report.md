# ANALYSIS_53 - Run 27958eec Error and Warning Report

**Date:** 2026-04-14
**Source run log:** `apps/worker/logs/run_20260414_27958eec.json`
**Run ID:** `run_27958eec-17d3-4343-8907-de1130ee833d`
**Project ID:** `proj_9ce79bff-500f-4159-b76e-f5c109f2a882`
**Scope:** Canonical capture of all warnings and errors emitted in this failed run.

---

## 0. Overview

This run failed before prose chapter generation due to a CML integrity contradiction detected in Agent 9 preflight checks.
Upstream stages (setting through narrative) completed; prose generation was started but aborted before chapter output.

- `status`: `failed`
- `durationMs`: `355126`
- `completedAt`: `2026-04-14T17:50:44.597Z`
- `wordCounts.total`: `0`

---

## 1. Stage Progress Snapshot

Completed stages before fatal abort:

1. `setting` - Era and setting refined
2. `cast` - Cast designed (5 characters)
3. `background-context` - Background context generated
4. `hard_logic_devices` - Generated 5 novel hard-logic devices
5. `cml` - Mystery structure generated and validated
6. `novelty` - Novelty check skipped (threshold >= 1.0)
7. `clues` - Regenerating clues based on blind reader feedback...
8. `fairplay` - Running blind reader simulation...
9. `profiles` - Character profiles generated (5)
10. `location-profiles` - Location profiles generated (4 locations)
11. `temporal-context` - Temporal context generated (October 1941)
12. `world-builder` - World Document complete
13. `narrative` - Deterministic clue anchoring applied: 12/19 scenes have clues
14. `prose` - Generating prose chapter by chapter with per-chapter validation...

Failure occurred at stage 14 pre-prose integrity gating.

---

## 2. Warning Inventory (Verbatim)

### 2.1 System and scoring context

1. `Scoring system enabled - tracking quality metrics and retries`

### 2.2 Inference coverage and suspect-coverage warnings

1. `Inference coverage: [warning] 1 suspect(s) (Elliot Holman) are never referenced in any clue`
2. `Agent 5: 1 suspect(s) have zero clue coverage; regenerating with targeted suspect feedback`
3. `  - 1 suspect(s) (Elliot Holman) are never referenced in any clue`

### 2.3 Blind-reader warning cluster

1. `Blind reader simulation: reader suspected "Elliot Holman" (confidence: likely), actual culprit is "Miriam Sawyer"`
2. `Blind reader missing info: Details about the other suspects' alibis and their whereabouts during the time of the murder.; Any physical evidence linking Elliot Holman to the crime scene.; Witness statements regarding Elliot's behavior or actions around the time of the murder.`
3. `CRITICAL: Blind reader cannot identify culprit. The clue set does not contain enough evidence for deduction.`

### 2.4 Gate and deterministic-repair warnings

1. `CML gate: back-filled evidence_clues with 8 essential clue(s)`
2. `Outline clue pacing below threshold: 4/19 scenes carry clues (minimum 12). Applying deterministic clue pre-assignment.`
3. `Deterministic clue pre-assignment satisfied pacing without retry: 12/19 scenes now carry clues (mapping 0, essential 1, gap-fill 2, threshold-fill 5).`
4. `World-First enrichment applied: emotionalRegister, humourGuidance, eraTextureNote, locationRegisterNote, dominantCharacterNote set on all 19 scenes.`

### 2.5 CML integrity contradiction warning (fatal-risk)

1. `[CML integrity] Locked fact "The exact time shown on the stopped clock face" (canonical: "ten minutes past eleven") conflicts with clue "clue_3" which states a different time ("11:20 PM"). This will cause locked_fact_missing_value on every chapter referencing this fact. Fix the CML before re-running.`

---

## 3. Error Inventory (Verbatim)

1. `[CML integrity] Locked fact "The exact time shown on the stopped clock face" (canonical: "ten minutes past eleven") conflicts with clue "clue_3" which states a different time ("11:20 PM"). This will cause locked_fact_missing_value on every chapter referencing this fact. Fix the CML before re-running.`
2. `Pipeline failure: Agent 9 aborted before prose generation due to 1 CML integrity contradiction(s).`

---

## 4. Classification and Impact

### 4.1 Fatal error classification

- Class: Pre-prose CML integrity gate abort (Agent 9 fail-fast)
- Impact: Hard stop before chapter generation; no prose produced
- Retry behavior: Not eligible for prose-chapter retry loop (aborted before entering chapter generation)

### 4.2 Warning severity snapshot

- Critical-warning count: 1 (`Blind reader cannot identify culprit`)
- Fatal-risk integrity contradiction count: 1 (locked-fact vs clue time contradiction)
- Deterministic in-run mitigations executed: suspect-targeted clue regeneration, CML evidence-clue backfill, clue pacing pre-assignment, world-first enrichment

---

## 5. Root-Cause Highlights from This Run

1. **Integrity contradiction at source content layer:** Locked fact canonical time (`ten minutes past eleven`) and clue-stated time (`11:20 PM`) diverge; this is sufficient to poison downstream locked-fact validation and now correctly trips fail-fast.
2. **Clue evidence quality remained weak despite regen:** blind reader still selected the wrong suspect and reported missing alibi/physical evidence/witness behavior support.
3. **Narrative clue pacing deficit was severe pre-repair:** 4/19 scenes with clues before deterministic assignment indicates substantial upstream outline under-allocation of clue beats.

---

## 6. Direct Follow-up Targets

1. Correct CML contradiction so locked-fact canonical value and clue-stated time are reconciled before rerun.
2. Strengthen suspect-specific clue evidence for all non-culprit suspects, especially explicit alibi and physical-link elimination support.
3. Re-run and confirm prose starts and commits (`wordCounts.total > 0`) and no pre-prose integrity abort occurs.

---

## 7. Notes

- This report records warnings and errors exactly as emitted by the run log.
- This document continues numbering sequence as `ANALYSIS_53`.

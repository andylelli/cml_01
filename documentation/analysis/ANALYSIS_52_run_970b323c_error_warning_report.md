# ANALYSIS_52 - Run 970b323c Error and Warning Report

**Date:** 2026-04-14
**Source run log:** `apps/worker/logs/run_run_970b323c-77e5-444d-b75a-361f341748ea.json`
**Run ID:** `run_970b323c-77e5-444d-b75a-361f341748ea`
**Project ID:** `proj_316d59f6-77d5-4cd8-a1cf-3efd1fe92bbb`
**Scope:** Canonical capture of all warnings and errors emitted in this failed run.

---

## 0. Overview

This run failed in Agent 9 prose generation at chapter 1 after four attempts.
Upstream pipeline stages (setting through narrative) completed, and no chapter prose was committed.

- `status`: `failed`
- `durationMs`: `398611`
- `completedAt`: `2026-04-13T20:58:56.683Z`
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
7. `clues` - Regenerating clues to address coverage gaps...
8. `fairplay` - Blind reader simulation: PASS
9. `profiles` - Character profiles generated (5)
10. `location-profiles` - Location profiles generated (3 locations)
11. `temporal-context` - Temporal context generated (January 1941)
12. `world-builder` - World Document complete
13. `narrative` - Deterministic clue anchoring applied: 12/19 scenes have clues
14. `prose` - Generating chapter 1/19...

Failure occurred during stage 14.

---

## 2. Warning Inventory (Verbatim)

### 2.1 System and scoring context

1. `Scoring system enabled - tracking quality metrics and retries`

### 2.2 Inference coverage and clue-quality warnings

1. `Inference coverage: [warning] Inference step 1 has no contradiction clue`
2. `Inference coverage: [warning] Inference step 3 has no contradiction clue`
3. `Inference coverage: [warning] Inference step 1 ("The clock in the drawing room shows 8:15 PM when found.") has only 1 mapped clue(s)`
4. `Inference coverage: [warning] 2 red herring(s) may accidentally support the true solution`
5. `Inference coverage: [critical] Discriminating test references no evidence found in the clue set`
6. `Inference coverage gate: critical gaps found; regenerating clues with coverage feedback`

### 2.3 Gate and auto-repair warnings

1. `CML gate: back-filled evidence_clues with 8 essential clue(s)`
2. `Outline clue pacing below threshold: 7/19 scenes carry clues (minimum 12). Applying deterministic clue pre-assignment.`
3. `Deterministic clue pre-assignment satisfied pacing without retry: 12/19 scenes now carry clues (mapping 0, essential 2, gap-fill 3, threshold-fill 2).`
4. `World-First enrichment applied: emotionalRegister, humourGuidance, eraTextureNote, locationRegisterNote, dominantCharacterNote set on all 19 scenes.`

### 2.4 CML integrity warning (high risk)

1. `[CML integrity] Locked fact "The exact time shown on the stopped clock face" (canonical: "ten minutes past eleven") conflicts with clue "clue_1" which states a different time ("8:15 PM"). This will cause locked_fact_missing_value on every chapter referencing this fact. Fix the CML before re-running.`

---

## 3. Error Inventory (Verbatim)

1. `Pipeline failure: Chapter 1 generation failed after 4 attempts: Cannot read properties of undefined (reading 'characters')`

---

## 4. Classification and Impact

### 4.1 Fatal error classification

- Class: Runtime TypeError during prose generation input handling
- Impact: Hard stop; no prose chapters produced
- Retry behavior: Non-recoverable by retry loop (same exception repeated 4 times)

### 4.2 Warning severity snapshot

- Critical-warning count: 1 (`discriminating test references no evidence`)
- High-risk integrity warning count: 1 (locked-fact vs clue time contradiction)
- Non-fatal remedied warnings: clue pacing and enrichment warnings were mitigated in-run via deterministic assignment/enrichment

---

## 5. Direct Follow-up Targets

1. Add hard input-shape guard before prose generation to prevent `undefined.characters` crashes.
2. Resolve CML time contradiction between locked fact and clue before rerun.
3. Re-run after fixes and confirm chapter 1 commits (`wordCounts.total > 0`).

---

## 6. Notes

- This report intentionally records warnings and errors exactly as emitted by the run log.
- A_01-A_50 archival status acknowledged; this document continues the numbered analysis sequence as `ANALYSIS_52`.

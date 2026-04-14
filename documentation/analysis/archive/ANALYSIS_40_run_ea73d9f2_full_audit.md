# ANALYSIS_40 — Run `run_ea73d9f2` Full Issue Audit

**Date:** 2026-04-04
**Run:** `run_ea73d9f2-5b2c-478f-9994-e633eabe46bd`
**Project:** `proj_c9bf4b84-1767-4401-beb9-8a9ee21804d5`
**Outcome:** ABORTED — "Chapter 2 generation failed after 4 attempts: pronoun errors (Dennis Curnow / Ailla Luke)"
**Prose chapters generated:** 1 / 18

> **Context:** Third run of the same session (2026-04-04). Two prior same-session runs also failed in prose with pronoun errors (run before this aborted at ch3 on Tristan Courtenay). This run is the second run of this story configuration; the earlier same-session run of this story aborted at ch3 with 4 attempt failures. The pronoun repair module is active (pre-validation and post-expansion passes confirmed in logs). No story-validation gate was reached — prose aborted before completion. World Builder `consistency_score = 100` in this run (contrast with A_38 where it was 0 — see §4.B).

---

## 1. Outcome Summary

| Metric | Value |
|--------|-------|
| Status | run_failed / aborted |
| Abort reason | Chapter 2 failed validation after 4 attempts — pronoun errors |
| Phases passed | 13 / 14 |
| Phase pass rate | 92.9% |
| Overall score | 99.29 / 100 (A) |
| Overall passed threshold | false |
| Weakest phase | Prose Generation |
| Strongest phase | Narrative Outline |
| Prose chapters generated | 1 / 18 (outline produced 18) |
| Total prose words | unknown (only ch1 generated) |
| Prose batches with retries | 1 (ch2: all 4 attempts failed) |
| Run start | 2026-04-04T13:22:33Z |
| Run end | 2026-04-04T13:30:42Z |
| Total duration | ~8 min 9 sec |
| Total cost | $0.0276 |

The pipeline passed all 13 pre-prose phases cleanly (including agent7 which needed one retry for scene count). Prose generation completed chapter 1, then exhausted all 4 attempts on chapter 2 due to persistent pronoun errors. The run aborted at chapter 1 boundary — no story validation gate was reached.

**Headline finding:** The pronoun repair module is running on every attempt (confirmed by pre-validation and post-expansion repair logs), but is failing to resolve the errors. Two female characters (Jennifer Carew, Ailla Luke) are both misgendered as "he" across attempts 1–3. On attempt 4, the error set shifts: Jennifer Carew is no longer flagged, but Dennis Curnow (male, he/him) is now found using "her" and Ailla Luke remains wrong. The shift demonstrates that the retry feedback itself is destabilising the model — fixing some characters while breaking others.

---

## 2. Phase Score Summary

| Phase | Agent | Score | Grade | Thres | Passed | Duration | Cost |
|-------|-------|-------|-------|-------|--------|----------|------|
| Setting Refinement | agent1_setting | 100 | A | 75 | ✅ | 13.8s | $0.0005 |
| Cast Design | agent2_cast | 100 | A | 75 | ✅ | 18.9s | $0 |
| Background Context | agent2e_background_context | 98 | A | 70 | ✅ | 9.1s | $0.0002 |
| Hard Logic Devices | agent3b_hard_logic_devices | 100 | A | 85 | ✅ | 11.8s | $0.0009 |
| CML Generation | agent3_cml | 100 | A | 75 | ✅ | 25.2s | $0.0024 |
| Novelty Audit | agent8_novelty | 100 | A | 75 | ✅ | 0s | $0 |
| Clue Distribution | agent5_clues | 100 | A | 75 | ✅ | 11.5s | $0.0009 |
| Fair-play Audit | agent6_fairplay | 100 | A | 75 | ✅ | 15.4s | $0.0019 |
| Character Profiles | agent2b_profiles | 100 | A | 75 | ✅ | 33.4s | $0.0022 |
| **Location Profiles** | agent2c_location_profiles | **100** | A | 75 | ✅ | 82.7s | $0.0079 |
| Temporal Context | agent2d_temporal_context | 100 | A | 70 | ✅ | 15.7s | $0.0011 |
| World Builder | agent65_world_builder | 100 | A | 75 | ✅ | 30.6s | $0.0040 |
| Narrative Outline | agent7_narrative | 100 | A | 75 | ✅ | 35.0s | $0.0056 |
| **Prose Generation** | agent9_prose | **92** | A | 80 | **❌** | 25.4s | $0 |

### 2a. Sub-scores — Prose Generation (agent9_prose)

> Note: Score computed over **1 chapter only** (ch1). Character name consistency and setting fidelity scores reflect single-chapter coverage, not story-level coverage — these numbers are not comparable to completed-run scores.

| Sub-score | Value | Notes |
|-----------|-------|-------|
| validation_score | 100 | ch1 passed validation |
| quality_score | 100 | 95% average |
| completeness_score | 85 | 10/11 clues — minor |
| consistency_score | 45.4 | scoring artifact of 1-chapter abort (see §4.C) |
| total | 92 | |
| component_failures | consistency | abort-induced; not a real consistency failure |

### 2b. Agent 7 Retry

| Attempt | Scene count | Result |
|---------|-------------|--------|
| 1 | 17 | ❌ — deviation 3 exceeds ±2 tolerance |
| 2 | 18 | ✅ — within tolerance (18 ≥ 18) |

The retry mechanism worked. Count 18 is within the `±2` window. Score 100.

### 2c. Agent 2c Location Profiles Retry

| Attempt | Errors | Result |
|---------|--------|--------|
| 1 | 4 errors — `keyLocations[2].sensoryVariants[2].smells`, `.mood`, `keyLocations[2].paragraphs`, `atmosphere` | ❌ |
| 2 | 0 errors | ✅ — passed |

Same `keyLocations[2]` third-location truncation pattern as in the prior same-session run (which failed both attempts with 1→8 errors, a degradation). Here the retry recovered successfully. The pattern remains inconsistent: the first attempt hits the same token-ceiling truncation on the third location, but the retry can either recover or degrade. See §4.B for analysis.

---

## 3. Story — Cast and Setting

| Element | Value |
|---------|-------|
| Cast size | 5 |
| Characters | Geraint Penrose, Caroline Bolitho, Dennis Curnow (he/him), Jennifer Carew (she/her), Ailla Luke (she/her) |
| Locations | The Library, The Drawing Room, The Servants' Hall (3 locations) |
| Hard logic devices | 5 |
| Chapter count | 18 (outline via retry; prose: 1 generated before abort) |

---

## 4. Errors and Root Cause Analysis

### ERROR-1 (Critical): Ch2 Pronoun Failure — 4 Attempts, All Failed

**Abort trigger:** Chapter 2 exhausted all 4 permitted attempts. The abort message:
> *"Chapter 2 failed validation after 4 attempts. Issues: Character 'Dennis Curnow' has incorrect pronouns. Should use he/him/his but found: her; Character 'Ailla Luke' has incorrect pronouns. Should use she/her/her but found: he"*

**Per-attempt failure detail:**

| Attempt | Pre-repair | Post-expansion repair | Validation errors |
|---------|------------|-----------------------|-------------------|
| 1 | 3 replacements | **10 replacements** | Jennifer Carew (she/her) → he; Ailla Luke (she/her) → he |
| 2 | 3 replacements | 5 replacements | Jennifer Carew (she/her) → he; Ailla Luke (she/her) → he |
| 3 | 3 replacements | 6 replacements | Jennifer Carew (she/her) → he; Ailla Luke (she/her) → he |
| 4 | 7 replacements | 8 replacements | **Dennis Curnow (he/him) → her**; Ailla Luke (she/her) → he |

Three distinct failure patterns visible across the 4 attempts:

**Pattern A — Double female-to-male misgendering (attempts 1–3):**
Both Jennifer Carew and Ailla Luke are female characters with she/her pronouns. They are misgendered as "he" on every attempt for 3 consecutive passes. The pre-validation repair applies 3 replacements each time but leaves the validator-detected error intact, suggesting the repair is fixing *some* "he" occurrences but not all — specifically those that are cross-paragraph, or where the preceding named character is ambiguous.

The post-expansion repair applies 10 replacements on attempt 1 — the highest single-pass count seen across any run logged. This indicates the expansion model (`UnderflowExpansion-Ch2`) generated a chapter heavily populated with wrong-gender pronouns for Jennifer and Ailla. The repair runs afterwards and corrects many, but the validator still catches at least one unresolved instance. The count decreases to 5 and 6 on attempts 2 and 3, suggesting the expansion model is generating slightly less wrong output under retry pressure, but the residual count is still non-zero.

**Pattern B — Attempt 4 error set shift:**
On attempt 4 the retry feedback injected the names Jennifer Carew and Ailla Luke explicitly. The model partially complied — Jennifer Carew's error disappears. But the feedback pressure caused a new error: Dennis Curnow (a male character, he/him) is now found with "her". Simultaneously Ailla Luke's error persists. The pre-validation repair rose to 7 replacements (the highest pre-repair count across all 4 attempts), suggesting the model generated more wrong-pronoun instances overall on attempt 4 under the combined pressure of accumulated feedback. Post-expansion repair was 8 replacements.

This is the "retry instability" pattern: the retry feedback is locally focused on the named failing characters, causing the model to over-correct in their vicinity while losing control of another character's pronouns in an unrelated sentence.

**Root cause (direct):**
The `UnderflowExpansion` pass generates new prose *after* the pre-validation repair runs. The expansion model has a strong prior for "he" as default pronoun, particularly when:
1. Multiple female characters appear in the same chapter
2. The expansion model has less context than the original generation (it receives the underflowing chapter plus an obligation block, but not the full pronoun constraint block that the original prose generator received — this needs verification in `buildExpansionPrompt()`)

The post-expansion repair then runs, but the paragraph-boundary reset in the repair algorithm leaves cross-paragraph "he" occurrences unresolved when the nearest preceding named character per that paragraph is a male (or absent).

**Root cause (structural — documented):**
ANALYSIS_33 §7 documents this gap precisely. The four-layer defence model has Layer 2 (repair) running, but the expansion invocation path may not inject the same pronoun-guard constraints as the original generation path. This has not been verified at code level and remains an open action.

**Prior occurrence in same session:**
The run immediately preceding this one (same session, different story: Tristan Courtenay he/him/his, ch3) showed the identical mechanism: repair running but not resolving, all 4 attempts failing, same cross-paragraph residual pattern. This is the second consecutive abort from the same structural cause in a single session.

---

### §4.B — World Builder `consistency_score` Status Change

**Observed in this run:** World Builder scored `total: 100`, `consistency_score: 100`, `passed: true`. All 13 tests passed at 100.

**Contrast with A_38 (run_a3393886, 2026-04-03):** World Builder scored `total: 90`, `consistency_score: 0`, `passed: false`, triggering a retry that also produced `consistency_score: 0`.

The test list in this run (`validationConfirmations.*`, `characterPortraits`, `voiceSketch`, `humourPlacementMap`, `arcDescription`, `arcTurningPoints`, `breakMoment`, `storyTheme`) contains no test with `category: "consistency"` — identical to A_38. Yet `consistency_score = 100` here vs `0` in A_38.

**Inference:** The scoring algorithm's treatment of an empty `consistency` category changed between A_38 (yesterday) and this run (today). Likely fix: empty categories now default to 100 (trivially pass) rather than 0. This resolves the persistent false-failure bug documented in A_38 §ERROR-2. **However**, the root issue warning from A_38 still applies: the World Builder has no real consistency tests — the 100 score is a default, not a meaningful measurement. A proper consistency test (e.g., confirming no new character facts were introduced vs. the cast, cross-checking locked facts preservation across the full world document) should be added to give this score real signal.

**Status:** Bug resolved (no longer causing pipeline failures). Underlying gap (no real consistency tests) remains open.

---

### §4.C — Prose Scoring Artifact: consistency_score = 45.4 on 1-Chapter Abort

**Observed:** Prose phase reports `consistency_score: 45.4`, `component_failures: ["consistency"]`, with:
- Character name consistency: 40/100 (major) — "2/5 characters referenced"
- Setting fidelity: 33/100 — "1/3 locations referenced"

**Root cause:** These tests measure coverage across *all generated chapters*. When prose aborts after chapter 1, the scorer evaluates whether all 5 cast members and all 3 locations appeared in that single chapter. Chapter 1 referenced 2 of 5 characters and 1 of 3 locations. This is normal for an opening chapter — not every character appears in chapter 1. The "major" severity flag is misleading in this context.

**This is a scoring system design gap:** The character name consistency and setting fidelity tests are meaningful for a complete story, but produce noisy and misleading results when prose aborts early. The component_failure flag incorrectly marks the abort as a consistency-quality failure when the real failure is the pronoun abort.

**Note:** The `prose_generation_aborted` flag in `component_failures` of the diagnostic `post_generation_summary` correctly captures the abort cause. The top-level phase `component_failures: ["consistency"]` is the misleading one.

---

### WARN-1: Agent 7 Chapter Count Still at 18 (Recurring)

Agent 7's *first* attempt produced 17 chapters, which a retry corrected to 18. The retry mechanism is working. However, the resulting outline has 18 chapters, not 20 — the same shortfall seen in A_38 (18), A_37 (19), A_34 (19).

| Run | Expected | Attempt 1 | Final | Retry needed |
|-----|----------|-----------|-------|--------------|
| R34 | 20 | — | 19 | — |
| R37 | 20 | — | 19 | — |
| R38 | 20 | — | 18 | — |
| R40 | 20 | 17 | 18 | Yes (1 retry) |

The retry fired here because 17 was 3 outside the `±2` tolerance. The retry hit 18, which is at the boundary of the tolerance window (20 − 2 = 18). This run is the first where a retry was triggered and logged; prior runs reached 18–19 without retry. The underlying tendency to generate fewer than 20 chapters persists. The tolerance window masks it.

---

### WARN-2: Agent 2c Third-Location Truncation — Intermittent

Attempt 1 produced the same `keyLocations[2]` errors seen in the prior same-session run. The retry recovered this time (0 errors on attempt 2). This makes the error probabilistic rather than deterministic for this story config.

Prior same-session run: attempt 1 = 1 error → attempt 2 = 8 errors (degraded, failed).
This run: attempt 1 = 4 errors → attempt 2 = 0 errors (recovered, passed).

The difference may relate to the specific story's third location (`The Servants' Hall` here vs the third location in the prior run). The `Servants' Hall` is semantically simpler than typical country-house locations, potentially requiring fewer token-budget words to fully describe. The pattern remains: the third location in a 3-location story is the one consistently truncated on the first attempt, because it is the last generated and most exposed to token-budget pressure.

---

## 5. Comparison to Prior Runs

| Issue | R40 (this run) | R38 | R37 | Root cause doc |
|-------|----------------|-----|-----|----------------|
| Prose abort — pronoun failure all 4 attempts | ✅ ch2 | ❌ completed | ❌ completed | ANALYSIS_33 |
| Agent 2c location truncation attempt 1 | ✅ (4 errors) | ❌ (passed) | ⚠️ (failed both) | ANALYSIS_10 |
| Agent 2c retry recover | ✅ (retry passed) | ❌ N/A | ❌ (retry failed) | ANALYSIS_10 |
| World Builder consistency_score=0 | ❌ fixed (=100) | ✅ bug present | ✅ bug present | A_38 §ERROR-2 |
| Locked fact exact-phrase violations | ❌ (run aborted before gate) | ✅ 45 issues | ✅ 25 issues | A_38 §ERROR-1 |
| Agent 7 scene count retry triggered | ✅ (17→18 scenes) | ❌ no retry | ❌ no retry | — |
| Chapter count shortfall vs target 20 | ✅ 18 (recurring) | ✅ 18 | ✅ 19 | A_38 WARN-2 |
| Retry instability (error shift on attempt 4) | ✅ Jennifer→Dennis | ✅ ch1 leakage shift | — | ANALYSIS_33 §7 |
| Prose scoring artifact on early abort | ✅ consistency=45.4 | ❌ N/A | — | New — §4.C |

---

## 6. Required Actions

**BLOCKER (must fix before next run):**

| ID | Issue | Fix direction | Prior doc |
|----|-------|---------------|-----------|
| FIX-P1 | `UnderflowExpansion` pronoun constraint missing | Audit `buildExpansionPrompt()` — confirm pronouns block is injected with the same strength and per-character rules as `buildProsePrompt()`; if absent, add it | ANALYSIS_33 §11 |
| FIX-P2 | Cross-paragraph pronoun repair gap | Harden repair algorithm: track "active subject" across paragraph boundaries when the paragraph opens with a pronoun (no leading name reset) | ANALYSIS_33 §7 |
| FIX-P3 | Retry feedback instability (attempt 4 error shift) | Inject all cast pronouns in the retry feedback block, not only the failing characters; prevents fixing one character while breaking another | ANALYSIS_27 |

**HIGH (fix soon):**

| ID | Issue | Fix direction | Prior doc |
|----|-------|---------------|-----------|
| FIX-C1 | Agent 7 recurring chapter count below 20 | Tighten tolerance to 0 (require exactly 20), or force the first attempt to produce 20 by injecting explicit act-breakdown counts before the LLM call | A_38 WARN-2 |
| FIX-C2 | Agent 2c third-location truncation intermittent | Generate location profiles per-location in separate calls, or inject location name into retry feedback (replace array index `keyLocations[2]` with the actual location name) | ANALYSIS_10 |

**INFORMATIONAL:**

| ID | Issue | Status |
|----|-------|--------|
| INF-1 | World Builder consistency score: now 100 by default (no real tests) | Bug resolved; gap remains — add at least one real consistency test | 
| INF-2 | Prose scoring artifacts on early abort | Document; consider gating character/setting coverage tests on `chapters_generated ≥ N` before assigning component failure |

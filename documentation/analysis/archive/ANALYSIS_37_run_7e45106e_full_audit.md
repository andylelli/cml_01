# ANALYSIS_37 — Run `run_7e45106e` Full Issue Audit

**Date:** 2026-04-03  
**Run:** `run_7e45106e-657a-4e53-8f83-30999a20404b`  
**Project:** `proj_524bd4fb-1e8f-46c4-a5e3-e56e3832e3ab` (Project 03)  
**Outcome:** FAILED — "Story validation failed: 0 critical, 25 major issues"  
**Prose cumulative score:** 94/100 (all 19 chapters generated)

> **Context:** Second post-S2–S5 run. R35 (run_1851f370) applied S2–S5 but aborted at chapter 11 (S7 behavioural-clue issue, never reached the validation gate). R37 is the first post-S2–S5 run to complete all chapters and reach the story validation gate. S6–S13 (proposed in ANALYSIS_36) are **not yet applied**. No quality report JSON was saved to disk; phase scores for pre-prose agents are not available. Data sources: pipeline event log (store.json) + full console log from the worker process (provided by user post-run).

---

## 1. Outcome Summary

| Metric | Value |
|--------|-------|
| Status | run_failed |
| Phases completed | All 14 |
| Prose chapters generated | 19 / 19 |
| Prose cumulative score | 94 / 100 |
| Story validation issues | 0 critical, **25 major** |
| Run start | 2026-04-03T13:56:36Z |
| Run end | 2026-04-03T14:12:48Z |
| Total duration | ~16.2 min |
| Total cost | Not available (no quality report saved) |
| Temporal context | October 1941 |
| Setting | CountryHouse, 1940s, Classic tone |
| Cast | 5 characters (spec: castSize 4) |
| Locations | 3 |

The pipeline completed all 19 prose chapters with a cumulative score of 94/100 — identical to R34. It then failed the post-generation story validation gate with 25 major issues (down from R34's 27), blocking output release. This is the second run to fail at the validation gate (R34 and R37); R35 aborted in prose before reaching it.

**Headline finding:** S2–S5 are holding with no regressions and produced a −2 reduction in validation issues. However, the validation gate remains a hard block. The root cause is structural (19 chapters not 20, era/character consistency) and is not solved by any fix currently applied.

---

## 2. Phase Score Summary

> **Data limitation:** No quality report JSON file was saved for this run. Phase scores for agents 1–agent65 and agent7 are not available from the event log alone. Each phase entry below reflects the event log status only ("✅ event" = completion event received, no failure event observed). Prose chapter scores are fully available.

| Phase | Agent | Score | Grade | Passed | Event log observation |
|-------|-------|-------|-------|--------|----------------------|
| Setting Refinement | agent1_setting | — | — | ✅ event | "Era and setting refined" |
| Cast Design | agent2_cast | — | — | ✅ event | "Cast designed (5 characters)" |
| Background Context | agent2e_background_context | — | — | ✅ event | "Background context generated" |
| Hard Logic Devices | agent3b_hard_logic_devices | — | — | ✅ event | "Generated 5 novel hard-logic devices" |
| CML Generation | agent3_cml | — | — | ✅ event | "Mystery structure generated and validated" |
| Novelty Audit | agent8_novelty | — | — | ✅ event | "Novelty check skipped (threshold ≥ 1.0)" |
| Clue Distribution | agent5_clues | — | — | ✅ event | "8 clues distributed" + regeneration pass |
| Fair-play Audit | agent6_fairplay | — | — | ✅ event | "Fair play audit: pass; Blind reader simulation: PASS" |
| Character Profiles | agent2b_profiles | — | — | ✅ event | "Character profiles generated (5)" |
| **Location Profiles** | agent2c_location_profiles | — | — | ⚠️ partial | 3 locations produced but **validation failed after 2 attempts** (`atmosphere is required`) |
| Temporal Context | agent2d_temporal_context | — | — | ✅ event | "Temporal context generated (October 1941)"; passed attempt 1/2 |
| **World Builder** | agent65_world_builder | — | — | ⚠️ unclear | 2 LLM calls made; `"No retry config found for agent: agent65_world_builder"` logged; no score data |
| Narrative Outline | agent7_narrative | — | — | ✅ event | "20 scenes structured (30000 words)" |
| **Prose Generation** | agent9_prose | **94** | **A** | ✅ | 19 chapters, 1 retry (see §2a) |

### 2a. Prose Chapter Scores (agent9_prose)

| Chapter | Score | Cumulative | Notes |
|---------|-------|------------|-------|
| 1 | 90 | 90 | |
| 2 | 92 | 92 | |
| 3 | 92 | 92 | |
| 4 | 85 | 92 | |
| 5 | 90 | 93 | |
| 6 | 84 | 93 | |
| 7 | 83 | 93 | |
| **8** | **87** | **94** | ⚠ Retry: clue absent attempt 1, succeeded attempt 2 |
| 9 | 83 | 94 | |
| 10 | 82 | 94 | |
| 11 | 82 | 94 | |
| 12 | 89 | 94 | |
| 13 | 89 | 94 | |
| 14 | 88 | 94 | |
| 15 | 86 | 94 | |
| 16 | 87 | 94 | |
| 17 | 90 | 94 | |
| 18 | 85 | 94 | |
| 19 | 85 | 94 | |

**Chapter score statistics:** mean 86.8, median 87, min 82 (ch10 and ch11), max 92 (ch2 and ch3). Chapters 10–11 form a slight mid-story quality dip; scores recover from chapter 12 onward.

The cumulative stabilises at 94 from chapter 8 onward and holds through the final chapter — identical final score to R34.

### 2b. Pronoun Repair Activity (agent9 pre-commit)

The pronoun repair pass (applied pre-validation and post-expansion) ran on every chapter. Replacement counts from the console log:

| Chapter | Pre-validation | Post-expansion | Total | Note |
|---------|---------------|----------------|-------|------|
| 1 | 4 | 2 | 6 | |
| 2 | 3 | 2 | 5 | |
| 3 | 3 | 4 | 7 | |
| 4 | 1 | 0 | 1 | |
| 5 | 4 | 1 | 5 | |
| 6 | 4 | 0 | 4 | |
| 7 | 10 | 5 | **15** | |
| 8 | 1+1 | 1 | 3 | two passes (retry) |
| 9 | 0 | 0 | 0 | clean |
| 10 | 14 | 13 | **27** | very high — pronoun-heavy scene |
| 11 | 0 | 0 | 0 | clean |
| 12 | 4 | 4 | 8 | |
| 13 | 2 | 4 | 6 | |
| 14 | 0 | 1 | 1 | |
| 15 | 2 | 3 | 5 | |
| 16 | 0 | 0 | 0 | clean |
| 17 | 10 | 10 | **20** | high |
| 18 | 17 | 25 | **42** | highest in run — interrogation scene? |
| 19 | 5 | 3 | 8 | |
| **Total** | **85** | **78** | **163** | |

**163 pronoun replacements across 19 chapters.** This is the mechanical repair working at scale — but it catches per-chapter errors deterministically. The story `CharacterConsistencyValidator` inspects cross-chapter patterns and can still fire on inconsistencies the per-chapter repair does not catch (e.g. pronoun use during dialogue attribution, indirect reference chains).

### 2c. AtmosphereRepair Pass

After all 19 chapters completed, an `AtmosphereRepair` LLM pass ran against each chapter (ch1–ch8 confirmed in log, likely ch1–ch19). This is a post-generation polish pass — per-chapter improvements to atmosphere/setting texture.

---

## 3. Hard Errors

### ERROR-1 (ABORT CAUSE): Story Validation Gate — 25 Major Issues; Root Cause **Locked Fact Violations**

| Field | Value |
|-------|-------|
| Phase | Post-generation story validation |
| Validator | `StoryValidationPipeline` |
| Critical issues | 0 |
| Major issues | **25** |
| Result | ABORT — pipeline failed |
| Error message | `"Pipeline failed: Mystery generation failed: Story validation failed: 0 critical, 25 major issues"` |

**The 25 issues are now identified from the console log.** The `ValidationPipeline` logged each failure individually. The dominant source is **locked fact consistency violations** — the central hard logic device (a stopped clock) has two canonical fact values that the prose repeatedly described without using the exact canonical strings.

#### Locked fact: "The exact time shown on the stopped clock face" → canonical `"ten minutes past eleven"`

Fired in chapters: **1, 2, 5, 6, 10, 16** — 6 issues

```
ERROR: Locked fact "The exact time shown on the stopped clock face" is described in chapter 1 without its canonical value "ten minutes past eleven".
ERROR: Locked fact "The exact time shown on the stopped clock face" is described in chapter 2 without its canonical value "ten minutes past eleven".
ERROR: Locked fact "The exact time shown on the stopped clock face" is described in chapter 5 without its canonical value "ten minutes past eleven".
ERROR: Locked fact "The exact time shown on the stopped clock face" is described in chapter 6 without its canonical value "ten minutes past eleven".
ERROR: Locked fact "The exact time shown on the stopped clock face" is described in chapter 10 without its canonical value "ten minutes past eleven".
ERROR: Locked fact "The exact time shown on the stopped clock face" is described in chapter 16 without its canonical value "ten minutes past eleven".
```

#### Locked fact: "The exact amount the clock was wound back" → canonical `"forty minutes"`

Fired in chapters: **1, 2, 3, 4** confirmed in console log (cut off — likely more)

```
ERROR: Locked fact "The exact amount the clock was wound back" is described in chapter 1 without its canonical value "forty minutes".
ERROR: Locked fact "The exact amount the clock was wound back" is described in chapter 2 without its canonical value "forty minutes".
ERROR: Locked fact "The exact amount the clock was wound back" is described in chapter 3 without its canonical value "forty minutes".
ERROR: Locked fact "The exact amount the clock was wound back" is described in chapter 4 without its canonical value "forty minutes".
```

**Confirmed from log: 10 issues from these two locked facts alone.** The remaining 15 issues likely come from further chapters where these same facts appear, plus potentially locked facts on the other hard logic devices (5 total were generated).

#### What is a locked fact?

A locked fact is a specific exact value defined in the CML's hard logic device spec (e.g., clue 6 type `physical_evidence`: `"The exact time shown on the stopped clock face"` with value `"ten minutes past eleven"`). The `PhysicalPlausibilityValidator` or `LockedFactValidator` checks that whenever the story prose _references_ the concept associated with a locked fact, the canonical value string appears verbatim. The model is mentioning the stopped clock's time and the wound-back amount throughout the story but using natural language variations (`"about eleven o'clock"`, `"wound back somewhat"`, etc.) rather than the exact canonical strings.

#### Why are locked facts not being reproduced exactly?

The prose agent does not appear to receive the locked fact canonical values in a form it reliably reproduces verbatim. The hard logic device values are defined in the CML and flow into the world document and NSD. However, without an explicit instruction — e.g. _"When the stopped clock is mentioned, ALWAYS state it reads 'ten minutes past eleven' — this is a locked fact and must be exact"_ — the model writes natural prose variants. With 8 chapters referencing the clock time and another 4+ referencing the wound-back amount, the validator fires repeatedly.

#### DiscriminatingTestValidator semantic fallback

The `DiscriminatingTestValidator` encountered a case where its regex-based validation failed and it fell back to an LLM semantic check:

```
[DiscriminatingTestValidator] Regex validation failed; trying semantic fallback...
[DiscriminatingTestValidator] Scene 3 validated semantically: Sheila's inquiry into the timeline...
```

This is working as designed. However, the semantic fallback adds 3 LLM calls (3 `Agent9-Validation` chat requests/responses observed) and adds ~4s latency. The final result was a pass — no issue here, but worth monitoring if semantic fallback fires on every run.

### ERROR-2: Agent2c (Location Profiles) — Validation Failed After 2 Attempts

| Field | Value |
|-------|-------|
| Phase | Location Profiles |
| Attempt 1 errors | `keyLocations[2].sensoryVariants[2].mood is required`, `keyLocations[2].paragraphs is required`, `atmosphere is required` |
| Attempt 2 errors | `atmosphere is required` |
| Final state | **Returned with 1 schema error** (`atmosphere` field missing at top level) |

Agent2c produced 3 location profiles (meeting the S5 minimum-3 count) but the third location profile is schema-incomplete: it is missing the top-level `atmosphere` field. The validator retried once, the model fixed the first two errors but not `atmosphere`. The runner accepted the result and continued rather than aborting.

**Impact on validation gate:** The missing `atmosphere` field in the third location profile propagates into the world document and narrative context. The `PhysicalPlausibilityValidator` or prose setting fidelity check may have fired additional issues because the third location (the one with an incomplete profile) lacks atmosphere descriptors. This is a contributing factor to the 25 major issues beyond the locked fact violations.

**Why R34/R35 didn't show this:** R34's agent2c produced 2 locations (pre-S5 fix). R35's agent2c produced 3 locations after S5. This is the first run where the third location has a schema validation failure. The `atmosphere` field is required by the location profiles schema but the model consistently fails to populate it for the third location under the current prompt.

### ERROR-3: Agent65 (World Builder) — No Retry Configuration

| Field | Value |
|-------|-------|
| Phase | World Builder |
| LLM calls made | 2 |
| Log message | `"No retry config found for agent: agent65_world_builder"` |

Agent65 makes two LLM calls in its normal flow (the second is not a retry — likely a two-pass generation). When a scoring failure is detected, there is **no retry configuration registered** for `agent65_world_builder`. This means World Builder cannot recover from a below-threshold score. In R34 and R35 it had a single retry (score 0→passing for consistency), but somehow that retry config is no longer present or the config lookup is failing.

**Risk:** If the world builder produces a sub-threshold score in this run (as it did in R34 at 83/B and R35 at 84/B), the phase will fail and there is no recovery path. The score for this run is unknown (no quality report), but the missing retry config is a regression from prior behaviour.

---

## 4. Warnings

### WARN-1: Agent2c `atmosphere` Field Missing — Third Location Schema Gap

See ERROR-2 above. The location profiles agent consumed both its retry attempts and returned a result with `atmosphere is required` on the third location. The three locations are structurally present (satisfying S5) but the third has an incomplete schema. This is a new failure mode introduced by S5 (more locations = more schema surface to fail on).

---

### WARN-2: Chapter 8 — Physical Clue Retry (Succeeded)

| Field | Value |
|-------|-------|
| Chapter | 8 |
| Attempts | 2 (failed attempt 1 / validated attempt 2) |
| Clue evidence | `"Indicates the tampering was done recently, implying premeditation."` |
| Clue reveals | `"Suggests premeditated actions by the murderer."` |
| Clue type | Physical evidence / action (tampering — concrete vocabulary) |
| Post-retry score | 87 / 100 |

Chapter 8 failed its first validation attempt and succeeded on the second. The clue vocabulary is concrete (`tampering`, `recently`, `premeditation`) — well-suited to the S4 0.60 token-match threshold. Retry succeeded as expected for physical evidence clues.

**Contrast with R35:** R35's chapter 11 abort was caused by a *behavioural* clue (`"Robert Crane displays signs of nervousness when questioned about the timeline."`) with abstract synonym-rich vocabulary (7 tokens, 5 required at 0.60 threshold). Four attempts all failed. R37's chapter 8 used a physical clue and succeeded on attempt 2 — this is the correct S4 behaviour. The S7 issue (behavioural clue threshold) was not triggered in R37's specific clue set, but remains a latent risk in future runs.

---

### WARN-3: Narrative — "20 Scenes" Announced, 19 Chapters Generated (Recurring — 3rd run)

| Observation | Value |
|-------------|-------|
| Narrative event | `"20 scenes structured (30000 words)"` |
| Clue anchoring event | `"Deterministic clue anchoring applied: 12/19 scenes have clues"` |
| Prose chapters generated | 19 |

For the third consecutive run (R34, R35, R37), agent7 announces "20 scenes" but produces a 19-chapter prose output. The clue anchoring message references "12/19 scenes" — 19 eligible scenes (the 20th denouement scene has no clue obligations). The prose then generates exactly 19 chapters.

This confirms the S11 issue from ANALYSIS_36 is real and recurring. Agent7 is generating a 19-element chapter array instead of 20. The "20 scenes structured" message appears to reflect the planning-level target rather than the actual array produced.

**Downstream cascade:** The compressed denouement has likely contributed to `SuspectClosureValidator` and `NarrativeContinuityValidator` failures in both R34 (27 issues) and R37 (25 issues). No fix for this is in the current S2–S5 set. S11 (ANALYSIS_36) targets it directly.

---

### WARN-4: Cast Size Discrepancy — 5 Characters Generated (Spec: 4, Recurring)

All three runs (R34, R35, R37) used `castSize: 4` but produced 5 characters. This is consistent with the cast agent treating `castSize` as the number of suspects while always adding the amateur detective as a separate fifth character. This is likely by design. Noted here because more characters = more character-consistency validation surface = potential minor contribution to major issue count.

---

### WARN-5: Clue Distribution — Coverage Gap Triggered Regeneration Pass

The event log sequence:
1. `"8 clues distributed"` — initial distribution complete
2. `"Regenerating clues to address coverage gaps..."` — post-distribution quality check triggered a re-pass

This regeneration is expected agent5 behaviour (coverage gate). The final placement assigned clues to 12 of 19 eligible scenes. The regeneration pass does not prevent all gap-derived validation issues but demonstrates the quality gate fired and acted.

---

## 5. Post-Fix Assessment: S2–S5 Impact on R37

| Fix | Expected effect | R37 observation |
|-----|-----------------|-----------------|
| S2 — Prompt leakage wrapper | No instruction echo in prose; reduced character consistency violations | ✅ No leakage events; validation issues −2 vs R34 (smaller-than-expected reduction) |
| S3 — arcDescription word count enforcement | arcDescription ≥200 words | ✅ Likely effective — world builder event: "complete" with no failure/retry; R34 and R35 both showed world builder failures, R37 does not |
| S4 — Clue threshold 0.4→0.6 | Prevent false-positive clue passes on concrete clues | ✅ Ch8 physical-clue retry succeeded correctly at attempt 2/4 |
| S5 — Location profiles min-3 gate | Location profiles ≥3 generated | ✅ 3 locations generated; pipeline no longer penalised for 2-location output |
| S6 (not applied) | Fix "low" label for above-ceiling word count | N/A |

**S2:** Holding and no regressions. Marginal improvement in validation (−2). Likely resolved a small number of leakage-caused consistency issues; the dominant issue source is structural, not leakage.

**S3:** Most likely effective in R37. Both R34 (83/B world builder) and R35 (84/B world builder) showed explicit world builder failures in their quality reports; R37 shows "World document complete" with no failure event in the pipeline log. If confirmed by a quality report, this would be the first run where world builder passes — a meaningful step forward. S8 (ANALYSIS_36) remains a safety net to enforce this via post-parse retry.

**S4:** Correctly calibrated for physical evidence clues. Chapter 8 retry succeeded. The S7 fix (differentiated threshold for behavioural vs physical clues) was not needed in R37 because the clue set happened to avoid abstract-vocabulary behavioural clues in retry-trigger positions. This is a run-dependent coincidence, not a resolution of the S7 risk.

**S5:** Confirmed effective again. 3 locations — consistent with R35.

---

## 6. Root Cause Analysis

### Primary cause of 25 major issues: Locked fact violations (≥10 confirmed)

The console log reveals the actual dominant source: the story's central hard logic device (a stopped clock) has two locked fact values — `"ten minutes past eleven"` (time shown) and `"forty minutes"` (amount wound back). These exact strings must appear verbatim whenever the story references those concepts. The model consistently paraphrases them.

**Why paraphrasing happens:** The prose agent receives the CML structure (which contains the hard logic device definitions) and the NSD. However, there is no explicit locked-fact injection into the per-chapter prose prompt that says _"when you mention the clock's time, you MUST write the exact string 'ten minutes past eleven'."_ The model writes natural, varied prose — `"the clock had stopped just before eleven"`, `"the hands pointed close to the hour"`, `"wound back nearly an hour"` — all of which the validator rejects because the exact canonical string is absent.

**Scale of impact:** The clock facts appear in at least 10 chapter references (6 for clock time + 4+ for wound amount). Each reference is one major issue. With 5 hard logic devices defined for this story, additional locked facts may account for the remaining ~15 issues (not shown in the truncated log).

**Why this wasn't identified in R34:** ANALYSIS_34 §5 attributed the 27 issues to prompt leakage (chapters 2, 13, 15) + structural gap (chapter 20 missing). That was an inference — the quality report for R34 was never retrieved before the store was overwritten. R37 is the first run where the console log was captured, revealing the locked fact violations as the actual dominant mechanism. The same locked fact mechanism almost certainly drove a large portion of R34's 27 issues too.

### Secondary cause: Agent2c schema gap

The third location profile is missing the `atmosphere` field. This produces a structurally incomplete profile that is injected into the world document. Any validator that checks location consistency or scene-setting completeness will register failures for chapters set in or referencing that third location.

### Agent65 retry absence

The `"No retry config found for agent: agent65_world_builder"` message indicates the world builder has no score-based retry mechanism available. In R34/R35 it retried once. If the world builder produced a below-threshold score in R37, the run proceeded with a failing world document. Without quality scores we cannot confirm, but the absent retry config is a latent risk.

### Why S2–S5 cannot address locked fact violations

None of S2–S5 touch the locked fact injection path. S2 wraps the provisional feedback block; S3 adds a word-count minimum to arcDescription; S4 tightens clue token matching; S5 enforces location count. The locked facts — which are the biggest single source of issues — are not included in any prose prompt instructions explicitly. This is a new fix category not previously identified.

---

## 7. Recommended Actions

> IMPORTANT: S7–S13 are already specified in ANALYSIS_36. New fixes identified by R37 are designated S14 onwards.

### R1 (P0) — **S14 (NEW)**: Inject locked fact canonical values into per-chapter prose prompt

**Problem:** The dominant source of the 25 major issues is the prose not reproducing locked fact canonical values verbatim. The model mentions the stopped clock in chapters 1, 2, 3, 4, 5, 6, 10, 16 but uses natural paraphrases instead of `"ten minutes past eleven"` and `"forty minutes"`.

**Solution:** In the per-chapter prose prompt construction, extract the hard logic device locked facts from the CML/NSD and inject them as a mandatory verbatim reference block:
```
LOCKED FACTS — REPRODUCE THESE EXACT STRINGS WHEN REFERENCING THESE CONCEPTS:
- Stopped clock face shows: "ten minutes past eleven" (use this exact phrase — never paraphrase)
- Clock was wound back by: "forty minutes" (use this exact phrase — never paraphrase)
```
This block should appear in every chapter prompt, not just the chapter that introduces the clue — the fact can be referenced in multiple chapters and must be exact in all of them.

**Impact:** If locked facts account for ≥10 of 25 issues, this single fix may reduce the validation gate count below threshold.

### R2 (P0) — **S15 (NEW)**: Fix `atmosphere` field population in agent2c for all generated locations

**Problem:** Agent2c failed schema validation after 2 attempts — the third location is missing the required `atmosphere` field. The retry fixed structural fields but not `atmosphere`. This is a new failure mode introduced by S5 (3-location requirement).

**Solution:** Add to the agent2c system prompt: `"Each location profile MUST include an 'atmosphere' field at the top level — a one-paragraph evocative description of the location's mood and sensory character. Without this field the output will be rejected."` Also add to the retry feedback: `"Missing required field: atmosphere — add a paragraph-length atmosphere description to the failing location."`

### R3 (P0) — **S16 (NEW)**: Restore (or add) agent65 retry configuration

**Problem:** `"No retry config found for agent: agent65_world_builder"` — the world builder has no score-based retry. In R34/R35 it ran one retry. If the S3 arcDescription instruction is not sufficient, the world builder will fail with no recovery.

**Solution:** Verify/restore the retry config for `agent65_world_builder` in the runner/orchestrator. If lost, add it back with maxRetries: 1 (consistent with prior behaviour).

### R4 (P1) — S11: Enforce 20-chapter narrative count

**Evidence from R37:** Third consecutive run with 19 chapters. Fixes `SuspectClosureValidator` structural issues. First priority from ANALYSIS_36.

### R5 (P1) — S7: Behavioural clue threshold

**Evidence from R37:** Not triggered (physical-evidence clue set), but remains a latent abort risk for any run with abstract behavioural clue vocabulary. Apply before R38.

### R6 (P1) — Add quality report persistence to pipeline

**Problem:** Two runs hit the validation gate (R34, R37) with no report saved. Now that we have console log data from R37, we know the dominant issue type, but systematic analysis requires the report.

**Solution:** After `StoryValidationPipeline.run()`, write the full result to `validation/quality-report-run_{runId}.json` unconditionally.

### R7 (P2) — S9: CONCLUSION_RE + Act I exemption

**Evidence from R37:** Fair play timing violations suspected but unconfirmed (no quality report). Apply per ANALYSIS_36 plan.

### R8 (P2) — S8: arcDescription word count gate / S3 follow-up

S3 status unknown in R37 (no quality report, no retry config). S8 provides the post-parse retry that the absent retry config would also give — apply S8 to cover the gap.

### R9 (P3) — S12, S13

No new evidence. Remain P3 per ANALYSIS_36.

---

## 8. Issue Priority Matrix

| Priority | Issue | Phase | Type | Fix | Status |
|----------|-------|-------|------|-----|--------|
| **P0** | Locked fact violations: prose paraphrases canonical values (≥10 of 25 issues) | Prose Generation | New — prose prompt | **S14** | ❌ New |
| **P0** | Agent2c `atmosphere` field missing on third location | Location Profiles | New — agent2c prompt | **S15** | ❌ New |
| **P0** | Agent65 retry config missing (`No retry config found`) | World Builder | New — runner config | **S16** | ❌ New |
| **P0** | Quality report not saved on validation failure | Post-generation | Infrastructure | **R6** | ❌ Not yet |
| **P1** | Story validation gate: 25 major issues (3 runs blocked) | Post-generation | Story content | **S11+S14** | ❌ |
| **P1** | Narrative chapter count: 19 not 20 (3rd consecutive run) | Narrative Outline | Prompt enforcement | **S11** | ❌ |
| **P1** | Behavioural clue threshold: latent abort risk | Prose Generation | S4 regression | **S7** | ❌ |
| **P2** | Fair play timing violations / CONCLUSION_RE (fair play score unknown) | Prose scoring | Scoring logic | **S9** | ❌ |
| **P2** | arcDescription gate: S3 + agent65 retry config absent | World Builder | Prompt + runner | **S8 + S16** | ❌ |
| **P3** | consistency_score = 0; word count label | Scorer | Bug | **S12, S13** | ❌ |
| **P4** | Background Context: constraints 50% | Background Context | Output quality | — | Recurring |

---

## 9. New Fix Catalogue (S14–S16 — identified from R37)

| Fix | Priority | Issue | Target file |
|-----|----------|-------|-------------|
| S14 | P0 | Inject locked fact canonical values into per-chapter prose prompt | `agent9-prose.ts` — chapter prompt builder |
| S15 | P0 | Enforce `atmosphere` field in agent2c for all location profiles | `agent2c-location-profiles.ts` prompt + retry feedback |
| S16 | P0 | Restore agent65 retry configuration in runner/orchestrator | `mystery-orchestrator.ts` or runner retry map |

---

## 10. Comparison: R37 vs. R35 vs. R34

| Metric | R34 (`run_65341f80`) | R35 (`run_1851f370`) | **R37 (`run_7e45106e`)** | Notes |
|--------|---------------------|---------------------|--------------------------|-------|
| Outcome | run_failed (validation gate) | run_failed (ch11 abort) | **run_failed (validation gate)** | R37 pattern = R34 |
| Fixes applied | None (baseline) | S2–S5 | **S2–S5** | R37 ≡ R35 in code |
| Chapters generated | 19 | 10 (aborted ch11) | **19** | First complete run since R34 |
| Prose cumulative | 94 / 100 | 92 / 100 (10ch) | **94 / 100** | R37 matches R34 |
| Story validation issues | 27 major | N/A (aborted before gate) | **25 major** | −2 from baseline |
| Primary validation cause | Unknown (inferred: leakage+structure) | N/A | **Locked fact violations (clock: ≥10 issues confirmed)** | NEW: root cause now known |
| Chapter retry abort | None | Ch11: 4/4 fail (behavioural) | **Ch8: 1/4 fail (physical, OK)** | S4 correct for physical |
| S7 risk triggered? | N/A | ✅ Yes (ch11 abort) | ❌ Not triggered (different clue set) | Latent risk remains |
| Agent2c location schema | 2 locations (pre-S5) | 3 locations (pass) | **3 locations; 3rd missing `atmosphere`** | New failure mode |
| Agent65 retry config | 1 retry available | 1 retry available | **"No retry config found"** | Regression |
| Pronoun repair | Not tracked | Not tracked | **163 replacements (85 pre + 78 post)** | First full data |
| AtmosphereRepair pass | Unknown | Unknown | **✅ ch1–ch8+ confirmed** | Post-generation polish |
| World builder | 83 / B (failed) | 84 / B (failed) | **? (2 calls; no retry config)** | Unknown |
| Prompt leakage | ch2, 13, 15 | None observed | **None observed** | S2 holding |
| Location count | 2 | 3 | **3** | S5 count holds |
| Narrative "19 vs 20" issue | ✅ (recurring) | ✅ (recurring) | **✅ (recurring)** | S11 needed |
| Duration | 21.2 min | 9.3 min (abort) | **~16.2 min** | — |
| Temporal context | (1940s) | (1940s) | **October 1941** | — |
| Story artifacts saved | None (validation fail) | None (abort) | **None (validation fail)** | — |
| Total cost | $0.0758 | $0.0222 | **Not available** | — |

---

## 11. Summary

**The critical new finding:** The 25 story validation issues are primarily **locked fact violations** — the prose describes the central hard logic device (a stopped clock) without using the exact canonical strings `"ten minutes past eleven"` and `"forty minutes"`. At least 10 issues confirmed from the console log. This was not previously known; ANALYSIS_34/35 speculated about prompt leakage and structural gaps as the dominant cause. S14 (locked fact injection into the prose prompt) is now the highest-priority single fix.

**What this run confirmed:**
- S2 (prompt leakage) is holding — no leakage events, −2 improvement in validation issues
- S4 (clue token threshold) is correct for physical-evidence clues — ch8 retry succeeded at attempt 2
- S5 (location min-3) produces 3 locations, but a new failure mode emerged (third location schema gap — S15)
- The pipeline completes all 19 chapters without aborting
- 163 pronoun replacements applied; mechanical repair is working at scale

**New regressions identified:**
- Agent2c third location missing `atmosphere` field — schema error returned to pipeline (S15)
- Agent65 retry config absent — `"No retry config found for agent: agent65_world_builder"` (S16)

**What remains blocked:**
- Story validation gate: dominated by locked fact violations (S14 needed) and 19-chapter structure (S11)
- S7 (behavioural clue threshold) is a latent abort risk
- Quality report still not saved to disk

**Recommended next steps (in priority order):**
1. Apply **S14** — inject locked fact canonical values into per-chapter prose prompt
2. Apply **S15** — fix agent2c `atmosphere` field enforcement 
3. Apply **S16** — restore agent65 retry config
4. Apply **S11** — enforce 20-chapter narrative count
5. Apply **S7** — behavioural clue threshold differentiation
6. Save quality report unconditionally
7. Run R38 and count validation issues with S14+S15+S16+S11 applied

**Hypothesis for R38:** S14 alone (locked fact injection) should reduce issues by ≥10. S11 (20-chapter denouement) should reduce by 3–5. Together with S15/S16, the validation gate should be within reach of passing or near-passing.

---

## 12. Complete Fix Implementation List

> This section supersedes §9 and the per-fix sections of ANALYSIS_36. It is the single authoritative list of every fix that must be implemented, based on direct source inspection of the codebase as of R37. Items are ordered by run-blocking risk.
>
> Two significant new findings from source inspection are incorporated here and were not in the previous analysis:
> - **S17** — `RetryManager` key-convention mismatch: every agent in the pipeline has silently had zero retries since the retry system was first built (see ANALYSIS_22). S16 was a symptom of this; the root cause is a naming divergence between the YAML config and the code call sites.
> - **S18** — Locked fact validator false-positive trigger: the `checkLockedFacts` `some()`-based keyword trigger fires on incidental word matches (e.g. a chapter mentioning "clock" in passing triggers the constraint for any locked fact whose description contains "clock"), inflating the major issue count with false positives (see ANALYSIS_28). This was the primary driver of the 25-issue count in R37, not genuine verbatim failures alone.
>
> Additionally, **S14** and **S16** as described in §9 require revised scope: S14's injection infrastructure already exists in code; the fix is to strengthen the prompt wording and extend it to all hard logic devices (not just `devices[0]`). S16 is fully subsumed by S17.

---

### Quick reference

| Fix | Priority | Status | Target file(s) | Run evidence |
|-----|----------|--------|----------------|--------------|
| **S17** | P0 | ❌ Not implemented | `retry-manager.ts`, `retry-limits.yaml` | R37 log; every run since retry system was built |
| **S18** | P0 | ❌ Not implemented | `prose-consistency-validator.ts` | R37: 25 issues (majority false positives) |
| **S11** | P0 | ❌ Not implemented | `agent7-narrative.ts` | R34, R35, R37: three consecutive 19-chapter runs |
| **S14** | P0 | ⚠️ Partial (infrastructure only) | `agent9-prose.ts`, `agent9-run.ts` | R37: 25 issues despite injection block present |
| **S7**  | P1 | ❌ Not implemented | `agent9-prose.ts` | R35: ch11 abort; latent risk every run |
| **S15** | P1 | ❌ Not implemented | `agent2c-location-profiles.ts` | R37 ERROR-2: atmosphere field missing after 2 attempts |
| **S12** | P1 | ❌ Not implemented | `agent65-world-builder-scorer.ts` | Every run: world builder silently -10% on consistency |
| **S8**  | P2 | ❌ Not implemented | `agent65-world-builder.ts` | R35: 84/B world builder; R37 score unknown |
| **S9**  | P2 | ❌ Not implemented | `agent9-scoring-adapter.ts` | R35: fair play timing false positives in Act I |
| **S10** | P2 | ❌ Not implemented | `agent65-world-builder.ts` | R35: storyTheme 19 words (1 below scorer threshold) |
| **S6/S13** | P3 | ❌ Not implemented | `agent9-prose-scorer.ts` | Every run: above-ceiling word count labelled "low" |
| **S16** | — | Superseded by S17 | — | Root cause is S17 |

---

### S17 — RetryManager Key Convention Mismatch (All Agents)

**Source:** ANALYSIS_22. **Severity: P0.**

**Problem:** The retry config file (`apps/worker/config/retry-limits.yaml`) uses **hyphen-separated** keys (e.g. `agent65-world-builder`, `agent7-narrative`). All code call sites pass **underscore-separated** agent IDs to `executeAgentWithRetry` (e.g. `"agent65_world_builder"`, `"agent7_narrative"`). `RetryManager.canRetry()` performs an exact string property lookup with no normalisation. When the lookup fails, it logs `"No retry config found for agent: …"` and returns `false` — treating the agent as having exhausted its retry budget with zero retries allowed.

**Impact:** No agent in the pipeline has ever had a score-based retry applied. `agent4-hard-logic` (configured max 4), `agent2-cast` (max 3), `agent65-world-builder` (max 1) — all receive 0 retries on scoring failure. This makes the entire retry quality-gate infrastructure inert.

**Fix (option A — preferred):** Rename all keys in `apps/worker/config/retry-limits.yaml` to match the underscore convention used in code:

| Current YAML key | Must become |
|-----------------|-------------|
| `agent1-background` | `agent1_setting` |
| `agent2-cast` | `agent2_cast` |
| `agent3-character-profiles` | `agent2b_profiles` |
| `agent4-hard-logic` | `agent3b_hard_logic_devices` |
| `agent5-location-profiles` | `agent2c_location_profiles` |
| `agent6-temporal-context` | `agent2d_temporal_context` |
| `agent7-narrative` | `agent7_narrative` |
| `agent65-world-builder` | `agent65_world_builder` |
| `agent8-setting-refinement` | `agent8_novelty` |
| `agent9-prose` | `agent9_prose` |

Also update the hardcoded default config in `RetryManager.getDefaultConfig()` (same key normalisation required there).

**Fix (option B — defensive):** In `RetryManager.canRetry()`, normalise the incoming `agent` string before the lookup:
```typescript
canRetry(agent: string): boolean {
  const normalisedKey = agent.replace(/_/g, '-');   // code uses underscore, YAML uses hyphen
  const agentConfig = this.config.retry_limits[normalisedKey] ?? this.config.retry_limits[agent];
```

Option A is cleaner; option B provides a safety net if other call sites exist.

---

### S18 — Locked Fact Validator: Over-Broad Keyword Trigger

**Source:** ANALYSIS_28. **Severity: P0.**

**Problem:** `ProseConsistencyValidator.checkLockedFacts()` in `packages/story-validation/src/prose-consistency-validator.ts` extracts keywords from the locked fact description and uses `Array.some()` (1-of-N) to decide whether a scene is "referencing" that fact. For a locked fact described as `"The exact amount the clock was wound back"`, the keywords include `clock`, `wound`, `back`, `exact`, `amount`. These words appear in virtually every chapter of a mystery story about a tampered clock. Any chapter mentioning a clock in passing fires the constraint, even if the chapter has nothing to do with the wound-back evidence.

The result is a false-positive explosion: the 25 issues in R37 are predominantly (likely ≥15) false-positive triggers on incidental keyword matches, not genuine prose failures to reproduce the canonical value.

**Fix (option A — majority threshold):** Change `some()` to require a majority of keywords before triggering the locked-fact check:

In `prose-consistency-validator.ts`, replace the trigger condition:

```typescript
// Before
const mentionsFact = keywords.some(kw => text.includes(kw));
```

```typescript
// After — require at least half the keywords (minimum: 2) to match before checking the value
const matchedKeywords = keywords.filter(kw => text.includes(kw));
const requiredMatches = Math.max(2, Math.ceil(keywords.length * 0.5));
const mentionsFact = matchedKeywords.length >= requiredMatches;
```

**Fix (option B — `appearsInChapters` gate):** Populate `appearsInChapters` in `agent3b-hard-logic-devices.ts` for each locked fact and use it in the validator to restrict which chapters are checked. This is the architecturally correct solution (it is the intended use of the field per the schema) but requires the LLM to reliably populate the list. Option A is defensive-by-default and does not depend on LLM output.

Both options can be combined: use option A as the keyword gate, and additionally skip chapters not listed in `appearsInChapters` when the field is populated.

---

### S14 — Locked Fact Prose Compliance: Strengthen Instruction + All Devices

**Source:** ANALYSIS_37. **Severity: P0. Infrastructure exists; fix is in two parts.**

**Part 1 — devices[0]-only limitation (`agent9-run.ts` line 605):**

```typescript
// Current — only the primary hard logic device's locked facts reach the prose prompt
const proseLockedFacts = hardLogicDevices.devices[0]?.lockedFacts;
```

With 5 hard logic devices generated for R37, locked facts on devices 1–4 are silently dropped. If any of those devices had locked facts of their own (the agent3b prompt says "other devices may include lockedFacts if appropriate"), those values are never injected and never enforced. Fix: aggregate locked facts from all devices:

```typescript
// After — collect locked facts from all devices
const proseLockedFacts = (hardLogicDevices.devices ?? [])
  .flatMap((d: any) => Array.isArray(d.lockedFacts) ? d.lockedFacts : []);
```

**Part 2 — Instruction strength (`agent9-prose.ts`, `lockedFactsBlock` construction ~line 1888):**

The current instruction block says: `"it MUST use the exact phrase shown — verbatim, not paraphrased. Any chapter that contradicts these values … will fail validation"`. Despite this and despite the block being at `'critical'` priority, R37 shows the model complied in zero of the referenced chapters. The instruction needs repetition and tighter phrasing:

```typescript
lockedFactsBlock = `\n\nNON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES:\n` +
  `The following physical evidence values are GROUND TRUTH. Every time this chapter describes, mentions, or alludes to the relevant evidence, you MUST reproduce the exact phrase below — character for character, including capitalisation. There is NO paraphrase, NO approximation, NO synonym. If you write "nearly eleven" instead of "ten minutes past eleven", the chapter will fail validation and be regenerated:\n` +
  `${factLines}\n` +
  `- If a locked fact has no relevance to this chapter's events, omit it entirely.\n` +
  `- If you reference it, even briefly, the canonical phrase must appear verbatim.`;
```

---

### S11 — Narrative Chapter Count: Post-Parse Assertion

**Source:** ANALYSIS_36. **Severity: P0 (third consecutive run).**

**Problem:** Agent7 has `"CRITICAL — Scene count is FIXED: EXACTLY 20 scenes"` in its user prompt but produces 19 on every run. There is no post-parse gate that throws on the wrong count.

**Fix:** In `packages/prompts-llm/src/agent7-narrative.ts`, in the `formatNarrative` function, after the acts/scenes are parsed, add:

```typescript
const allScenes = (outlineData.acts ?? []).flatMap((act: any) =>
  Array.isArray(act.scenes) ? act.scenes : []
);
const expectedScenes = getSceneTarget(inputs.targetLength ?? 'medium');
if (allScenes.length !== expectedScenes) {
  throw new Error(
    `Narrative outline has ${allScenes.length} scenes but EXACTLY ${expectedScenes} are required. ` +
    `Act counts: ${(outlineData.acts ?? []).map((a: any, i: number) =>
      `Act ${i + 1}: ${Array.isArray(a.scenes) ? a.scenes.length : 0}`
    ).join(', ')}.`
  );
}
```

Also add an arithmetic reminder inline in the user prompt (per ANALYSIS_36 S11 full spec).

---

### S7 — Behavioural Clue Token Threshold (S4 Regression)

**Source:** ANALYSIS_36. **Severity: P1 (triggered R35 abort; latent in all runs).**

**Problem:** S4 raised the clue match threshold uniformly to 0.60. Behavioural/emotional clue descriptions use synonym-rich vocabulary that natural prose replaces with equivalents. A 0.60 threshold requires 5 of 7 tokens to match; synonymous paraphrase that is narratively correct cannot satisfy this.

**Fix:** Add `isBehaviouralClue()` helper and `BEHAVIOURAL_MARKERS` set to `agent9-prose.ts`. Apply threshold `0.45` (instead of `0.60`) in both `chapterMentionsRequiredClue` and the `validateChapterPreCommitObligations` ctx fallback when `isBehaviouralClue(description)` returns true. See ANALYSIS_36 §S7 for full code spec.

---

### S15 — Agent2c Location Profiles: Atmosphere Field Retry Enforcement

**Source:** ANALYSIS_37 ERROR-2. **Severity: P1.**

**Problem:** The agent2c prompt and schema both include `atmosphere` but the retry feedback message on schema failure does not call it out explicitly. R37 shows the model corrected other schema errors on attempt 2 but left `atmosphere` missing. The schema validator fires `atmosphere is required` and the pipeline continues with an incomplete third location.

**Fix:** In `packages/prompts-llm/src/agent2c-location-profiles.ts`, in the retry/validation-feedback construction, add an explicit mention of the `atmosphere` field:

In the schema requirements block (developer prompt), after the existing CRITICAL FIELD REQUIREMENTS section, add:
```
- The top-level `atmosphere` object is REQUIRED and must have: era, weather, timeFlow, mood, eraMarkers, sensoryPalette, paragraphs. Missing the atmosphere object entirely will fail validation.
```

In the retry feedback injected on attempt 2, detect `atmosphere is required` in the error message and inject the specific correction prompt: `"The third location (or any location) is missing its top-level 'atmosphere' object. Add a complete atmosphere object with all required sub-fields."`.

---

### S12 — World Builder consistency_score = 0 on Clean Runs

**Source:** ANALYSIS_36. **Severity: P1 (silently deducts 10% from every run's world builder score).**

**Problem:** `calculateCategoryScore(tests, 'consistency')` returns 0 when no humour-position violations are present (empty test array). No violations = score 0 instead of 100.

**Fix:** In `packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts` line ~74:

```typescript
// Before
const consistency_score = calculateCategoryScore(tests, 'consistency');

// After
const consistencyTestsExist = tests.some((t) => t.category === 'consistency');
const consistency_score = consistencyTestsExist
  ? calculateCategoryScore(tests, 'consistency')
  : 100;
```

---

### S8 — arcDescription Word Count Gate at Generation Time

**Source:** ANALYSIS_36. **Severity: P2.**

**Problem:** The `agent65-world-builder.ts` retry loop has no runtime word count check for `storyEmotionalArc.arcDescription`. S3 added an advisory instruction (MINIMUM 200 words) but there is no gate that forces a retry when the count is short.

**Fix:** In `packages/prompts-llm/src/agent65-world-builder.ts`, in the retry loop immediately before the `return parsed` line, add the arcDescription word count check and `lastError + continue` per ANALYSIS_36 §S8 full code spec.

---

### S9 — Fair Play Timing: CONCLUSION_RE False Positives + Act I Exemption

**Source:** ANALYSIS_36. **Severity: P2.**

**Problem:** `CONCLUSION_RE` in `apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts` includes three patterns (`"the truth is"`, `"it follows that"`, `"this confirms"`) that appear routinely in Act I narrative prose and are not deduction language. Act I chapters are also not exempted from the timing check.

**Fix (two parts):** (1) Remove the three false-positive patterns from `CONCLUSION_RE`. (2) Add `actIExemptionEnd = Math.ceil(chapters.length * 0.25)` and add `!inActI &&` guard before the `isDeductionChapter` classification. See ANALYSIS_36 §S9 for full code spec.

---

### S10 — storyTheme MINIMUM in MANDATORY FIELD LENGTHS Block

**Source:** ANALYSIS_36. **Severity: P2.**

**Problem:** `storyTheme` is absent from the `MANDATORY FIELD LENGTHS:` block in `packages/prompts-llm/src/agent65-world-builder.ts` line 96. The scorer requires ≥20 words; R35 produced 19. There is no word-count instruction for this field.

**Fix:** After the `revealImplications: MINIMUM 90 words...` line in the MANDATORY FIELD LENGTHS block, add:
```
- storyTheme: MINIMUM 20 words. Write a complete sentence with a subject, main clause, and a nuanced qualifier. Not a title, a fragment, or a noun phrase.
```

---

### S6 / S13 — Word Count Scorer: `"high"` Label for Above-Ceiling Counts

**Source:** ANALYSIS_34 (S6), ANALYSIS_36 (S13). **Severity: P3.**

**Problem:** In `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts` line 392, `wordStatus` has type `"pass" | "low" | "major_underflow"`. The branch condition `!(wordCount >= targetMin && wordCount <= targetMax)` fires for both below-floor AND above-ceiling. Above-ceiling counts are labelled `"low"` — semantically wrong.

**Fix (three parts):** (1) Add `"high"` to the `wordStatus` type union. (2) Replace the single `if (!(…))` branch with separate `if (wordCount > targetMax)` / `else if (wordCount < targetMin)` branches. (3) Update the `tests.push` message to use `"high"` for above-ceiling counts. See ANALYSIS_36 §S13 for full code spec.

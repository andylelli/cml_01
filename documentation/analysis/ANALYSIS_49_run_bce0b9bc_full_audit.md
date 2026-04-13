# ANALYSIS_49 — Run `run_bce0b9bc` Full Issue Audit

**Date:** 2026-04-07  
**Run:** `run_bce0b9bc-9265-4e2a-9cbd-31fb06a793e2`  
**Project:** `proj_ecff8713-c292-4bd5-88db-6758f6103b96`  
**Started:** 2026-04-07T18:32:21.575Z  
**Completed:** 2026-04-07T18:44:37.744Z  
**Duration:** 12 min 16 sec (736,169 ms)  
**Outcome:** FAILED — `"Story validation failed: 0 critical, 6 major issues"`  
**Scoring:** A / 99.86 (all pipeline phases pass; abort by post-generation validation gate)  
**Cost:** $0.066  
**Source files:**
- `apps/worker/logs/run_run_bce0b9bc-9265-4e2a-9cbd-31fb06a793e2.json`
- `apps/api/data/reports/proj_ecff8713-c292-4bd5-88db-6758f6103b96/run_bce0b9bc-9265-4e2a-9cbd-31fb06a793e2.json`  
**Prior refs:** ANALYSIS_48 (run_53ca3465 — identical CML structure, expansion disabled there too), ANALYSIS_47 (run_43a28c8d)

---

## 0. Experiment Context — Underflow Expansion Disabled

This run was executed with `agent9_prose.underflow_expansion.enabled: false` in `generation-params.yaml` (user toggle added in the previous session). This is a **control run** to observe generation quality and issue patterns without the expansion LLM call. Its findings are meaningfully compared against runs with expansion enabled.

---

## 1. Outcome Summary

| Metric | Value |
|--------|-------|
| Status | failed (aborted) |
| Validation gate | **0 critical, 6 major**, moderate + minor (≥29 total) |
| Chapters generated | 19 (all completed) |
| Total words (chapter-level log) | 16,844 |
| Total words (prose scorer) | 18,487 |
| Total cost | $0.066 |
| Era | March 1943 |
| Cast size | 5 characters |
| Abort cause | Post-generation validation gate: major (6) > threshold |

---

## 2. Pipeline Stage Summary

All 14 pipeline stages completed. The abort occurred only at the final post-generation validation gate.

| Stage | Outcome | Notable |
|-------|---------|---------|
| Setting | ✅ | March 1943, 4 locations |
| Cast | ✅ | 5 characters |
| Background context | ✅ | — |
| Hard logic devices | ✅ | 5 devices |
| CML | ✅ | — |
| Novelty | ⏭ skipped | threshold ≥ 1.0 |
| Clues | ⚠ regen | Critical coverage gap → regen triggered |
| Fair play | ✅ | Blind reader: PASS |
| Character profiles | ✅ | 4 profiles |
| Location profiles | ✅ | 3 locations |
| Temporal context | ✅ | March 1943 |
| World builder | ✅ | — |
| Narrative | ⚠ fixed | Clue pacing: 6/19 → 12/19 via deterministic pre-assignment |
| Prose | ⚠ retries | 3/19 batches required retry |
| Validation | ❌ fail | 0 critical, 6 major → abort |

---

## 3. Story Configuration

| Property | Value |
|----------|-------|
| **Era** | March 1943 |
| **Cast** | Catherine Nolan (female), Christopher Regan, Barry Lynch (male), Patricia Shaughnessy, Nora Clancy |
| **Locations** | 4 |
| **Scenes / chapters** | 19 |
| **Clue count in scenes** | 12/19 (after deterministic pre-assignment) |
| **Hard logic device** | Stopped clock — locked facts: clock face reading → `"ten minutes past eleven"`, clock tamper amount → `"forty minutes"` |
| **Word policy** | short (preferred: 1,300 words; hard floor: max(floor(1300 × 0.4), 600) = **600 words**) |
| **Expansion** | **DISABLED** (`enabled: false`) |

---

## 4. Pre-Prose Pipeline Issues

### 4.1 Clue inference coverage — critical gap (triggered regen)

Four coverage warnings fired:

1. `[warning]` — inference step 2 has no contradiction clue
2. `[warning]` — inference step 3 has no contradiction clue
3. `[warning]` — inference step 2 has clues but no contradiction/elimination evidence
4. `[warning]` — 1 red herring may accidentally support the true solution
5. `[critical]` — **Discriminating test references no evidence found in the clue set**

The critical gap triggered automatic clue regeneration. The second pass resolved enough to proceed, but the CML gate back-filled **8 essential clues** programmatically — meaning most of the clue set is mechanically assigned. This is the same fragility documented in ANALYSIS_48 §4.1.

### 4.2 Outline clue pacing — deterministic pre-assignment

`"Outline clue pacing below threshold: 6/19 scenes carry clues (minimum 12). Applying deterministic clue pre-assignment."`

Resolved to 12/19 without LLM retry. Mechanically pre-assigned scenes have no LLM-authored setup context, increasing the risk of first-attempt clue-absent failures during prose generation (see §5).

### 4.3 FIX-B alert: CML logical inconsistency detected

```
[CML integrity] Locked fact "The exact time shown on the stopped clock face" (canonical: "ten minutes past eleven")
conflicts with clue "clue_1" which states a different time ("11:10 PM").
This will cause locked_fact_missing_value on every chapter referencing this fact.
```

FIX-B fires correctly. The **root cause** is that:
- `parseWordFormTime("ten minutes past eleven")` → `{hour: 11, minute: 10}` → 11.167 (no AM/PM)
- `extractDigitFormHour("... 11:10 PM ...")` → 23.167 (explicitly PM)
- Difference: 12.0 ≥ 1.0 → mismatch flagged

**Important nuance:** This is an AM/PM ambiguity in FIX-B. The canonical "ten minutes past eleven" does not specify AM or PM. If the stopped clock (an early-morning murder, or an 11 PM event) was intended to read 11:10 PM, then "11:10 PM" in the clue would be **logically consistent** with the locked fact. FIX-B conservatively treats the word form as AM, producing a 12-hour false positive.

**However**, the final `locked_fact_missing_value` on chapter 10 confirms a **real prose failure** exists for this fact — the prose model is writing the wrong form regardless of AM/PM ambiguity. Whether the FIX-B warning correctly identified the root cause or coincidentally pointed at a real failure via a different path is unclear.

**Follow-up needed:** Determine whether the canonical "ten minutes past eleven" is intended as AM or PM. If it is PM, the CML should be written as "ten minutes past eleven at night" or the clue should use "11:10 AM" consistently.

---

## 5. Prose Generation — Batch Retry Log

| Chapter | Attempts | Failure reason | Resolved |
|---------|----------|----------------|---------|
| 7 | 2 | Fingerprints clue absent | ✅ attempt 2 |
| 10 | **4** | Fingerprints clue absent (3 consecutive identical failures) | ❌ max retries hit |
| 12 | **4** | Barry Lynch pronoun drift: she/her found (3 consecutive) | ❌ max retries hit |

Total: 3/19 batches with retries, 7 failure events.

### Chapter 10 — clue exhaustion

Clue: `"Fingerprints found on the clock face belong to Barry Lynch."`

All three retry attempts produced the identical diagnosis: the clue is absent. This is the same "local attractor" pattern documented in ANALYSIS_47 §5.3 and ANALYSIS_48 §5. The scene context for chapter 10 apparently never organically accommodated this clue. The clue was likely mechanically pre-assigned (§4.2) with no narrative setup.

Note: The clock-reading locked fact (`"ten minutes past eleven"`) also fails in chapter 10. This is NOT the cause of the batch retry — but chapter 10 is doing double damage at final validation.

### Chapter 12 — Barry Lynch pronoun drift (male character, female pronouns)

Three consecutive attempts all produced: `Character "Barry Lynch" has incorrect pronouns. Should use he/him/his but found: she, her`.

The deterministic pronoun repair should catch this at generation time. Why it fails to resolve:
- If the repair finds and fixes `she/her` → `he/him`, but the LLM re-introduces the wrong pronouns on every regeneration, the repair is running correctly but the LLM's underlying behaviour is unchanged
- The generated chapter context (probably a scene with multiple female characters present) keeps pulling the LLM toward female pronouns for Barry Lynch

After 3 retries the chapter commits with the pronouns unresolved, contributing to the final failure. Note: the `locked_fact_missing_value` for `"forty minutes"` also affects chapter 12 — this chapter has two simultaneous unresolved issues.

---

## 6. Underflow Expansion — Control Run Results

| Metric | run_53ca3465 (prev, expansion disabled late) | run_bce0b9bc (this, expansion disabled at start) |
|--------|---------------------------------------------|--------------------------------------------------|
| Hard floor | 600 words | 600 words |
| Hard floor misses | 0 | 0 |
| Preferred-target misses | 25 | 24 |
| Preferred-target miss chapters | all | 18/19 (ch8 at 1435 passes short preferred) |
| Expansion attempts | **0** | **0** |
| Chapter word range | 647–1244 | 634–1435 |
| Total words (log) | ~16,255 | 16,844 |

### Why hard floor misses = 0 despite sub-1000-word chapters

The hard floor is configured as:

```yaml
hard_floor_relaxation_ratio: 0.4
min_hard_floor_words: 600
```

For short policy (preferred = 1,300): `hard_floor = max(floor(1300 × 0.4), 600) = max(520, 600) = **600 words**`

The lowest chapter this run is 634 words (ch3) — just above the floor. All 19 chapters clear the 600-word hard floor. With `enabled: false`, the expansion gate is never reached for preferred-target misses. The generation loop never sets `hardErrors` for word count, so no word-count retries fire.

**Effect:** Without expansion, all retry budget was available for genuine quality issues (clue placement, pronouns). Because word count never consumed retries, the retry log is clean — only 3 batches retried, all for real quality defects.

### Qualitative word count impact

Average word count per chapter: 886 words (vs typical 970–1100 words with expansion active across recent runs). Story is noticeably shorter but structurally complete. The prose scorer marks 18,487 words total as passing its 15,000–25,000 word range gate.

---

## 7. Major Validation Issues (6 total → abort)

All 6 are `locked_fact_missing_value`.

| # | Locked fact | Canonical value | Chapters |
|---|-------------|-----------------|---------|
| 1 | Clock face reading | `"ten minutes past eleven"` | 10 |
| 2 | Clock tamper amount | `"forty minutes"` | 1, 6, 12, 17 |

### 7.1 Clock face reading — chapter 10 (1 major)

Chapter 10 committed after 3 failed clue-placement retries (§5). Those retries burned the full attempt budget on the fingerprints clue. The prose model never separately addressed the clock-reading value format. The CML integrity warning (§4.3) provides a plausible explanation: the model was given a clue description containing "11:10 PM" and naturally wrote that rather than the canonical "ten minutes past eleven". The `repairWordFormLockedFacts` pass (FIX-C) should catch "11:10 PM" → "ten minutes past eleven" via the digit pattern (`\b11[:\.]10...`), but it appears this chapter escaped repair. Whether repair ran on the committed chapter (after max retries) is unclear.

### 7.2 Clock tamper amount — chapters 1, 6, 12, 17 (4 major + 1 overlap)

`"forty minutes"` is the canonical value. FIX-C should handle:
- `"40 minutes"` (digit form) → repaired by `parseWordFormQuantity` digit pattern
- `"forty-minute"` (adjective form) → accepted by `checkValueVariants`

The fact fails in 4 chapters, suggesting either:
- The LLM is writing `"forty minutes"` correctly but the keyword gate is firing on chapters where the clock device is mentioned without the exact tamper amount (false positive from broad keyword matching)
- OR the LLM is writing `"40 minutes"` and repair is not running, or running after the validator checks

The broad spread (ch1, 6, 12, 17 — Acts I, II, and III) suggests the issue is structural: the fact's keywords ("wound back", "clock") appear frequently throughout a clock-stopping mystery, triggering the validator's fact-presence check in chapters where the tamper amount wasn't specifically stated. This is the **false-positive keyword trigger** documented in ANALYSIS_28.

**Distinction from clock-reading failure:** The clock-reading failure is likely a genuine prose error (wrong numeric format). The tamper-amount failures may be false positives from keyword over-triggering, given the ubiquity of clock vocabulary in this story type.

---

## 8. Moderate / Minor Issues

### 8.1 Pronoun drift — Catherine Nolan (multiple chapters)

| Character | Gender | Chapters |
|-----------|--------|---------|
| Catherine Nolan | female (she/her) | 9, 10, 11, 12, 13, + more |

FIX-E (expanded competitor guard to all name parts ≥3 chars) is deployed. Barry Lynch has parts `["Barry", "Lynch"]` — both ≥3 chars, so both are included in the competitor name list. If Barry Lynch's name appears in the 200-char window, the error should be suppressed.

The fact that the error IS being reported means either:
1. Barry Lynch is not named near the male pronoun occurrence in those windows, and the pronoun drift is genuine (the model mis-pronounted Catherine as "he")
2. The error is a legitimate false positive from another male character (Christopher Regan? Nora Clancy's name has ≥3 chars but she is female)

This is a recurring cross-run issue. Five or more consecutive chapter failures for Catherine Nolan suggests the scenes in Acts II–III feature Catherine alongside male characters and the LLM is occasionally slipping in "he" for her.

### 8.2 Unfixed Barry Lynch pronoun drift (from §5)

Chapter 12's unresolved Barry Lynch drift (he → she/her) contributes additional moderate errors to the final count alongside the committed chapter's remaining unresolved pronoun usages.

---

## 9. Comparison: Expansion On vs Expansion Off

| | Expansion ON (run_43a28c8d) | Expansion OFF (this run) |
|-|-----------------------------|--------------------------|
| Total words | ~19,000 | 16,844 |
| Avg words/chapter | ~1,000 | 886 |
| Major issues | 5 | **6** |
| Clue failures | same pattern | same pattern |
| Pronoun failures | same pattern | same pattern |
| Expansion LLM calls | 18 | 0 |
| Cost | ~$0.07 | **$0.066** (cheaper) |
| Duration | ~15 min | **12.3 min** (faster) |

**Conclusion:** Disabling expansion saves ~2–3 minutes and ~$0.004 per run, at the cost of shorter chapters (avg 886 vs ~1,000 words). It does NOT improve major issue count in this run — the root causes of the 6 majors are clue placement failure and locked-fact value format, both independent of expansion. The run remains FAILED.

---

## 10. New Issues Identified This Run

### I1 — FIX-B false positive on 12-hour AM/PM ambiguity (medium priority)

**Problem:** `parseWordFormTime("ten minutes past eleven")` returns hour=11, treating the word form as implicitly 11 AM. `extractDigitFormHour` of "11:10 PM" returns 23. The difference is 12.0, triggering the mismatch warning regardless of whether the CML intended 11 AM or 11 PM.

**Impact:** Any locked fact using a word-form time that the clue describes in PM notation (or vice versa) will fire FIX-B spuriously. This is a systematic false positive for stories set in the evening.

**Proposed fix:** When FIX-B sees `Math.abs(factHour - clueHour) === 12.0`, emit the warning at a lower severity (note-level, not warning) or add an AM/PM annotation hint to the locked fact parsing.

### I2 — "Forty minutes" fails in 4/19 chapters — likely keyword over-trigger (medium priority)

**Problem:** The tamper-amount locked fact ("forty minutes") fires in chapters 1, 6, 12, 17 — all of which likely mention the clock device but without the exact tamper amount. The keyword match triggers the validation check, then "forty minutes" is absent from those paragraphs.

**Root cause:** The appearsInChapters annotation restricts the validation scope to chapters where the clue is formally introduced. But the annotation is populated based on keyword overlap with clue descriptions. In a clock-stopping mystery, clock-related keywords appear pervasively and the tamper-amount clue overlaps with many scenes.

**This is the ANALYSIS_28 pattern recurrence.** The fix applied in ANALYSIS_28 (appearsInChapters scoping) should be restricting chapter scope — but it only works when the clue distribution system correctly assigns clue chapters. If the back-fill of 8 essential clues (§4.1) resulted in the tamper-amount clue being referenced in scattered chapters, the scoping will be too broad.

### I3 — Clue pre-assignment produces persistent per-chapter failures (low priority, known)

Chapter 10's fingerprint clue required 3 failed retries before being committed without the clue. This is the third consecutive run showing the same pattern (ANALYSIS_47, ANALYSIS_48). Mechanically pre-assigned clues with no narrative setup context are systematically more likely to exhaust retry budget than LLM-authored clue placements.

---

## 11. Score Summary

| Phase | Score | Grade | Passed |
|-------|-------|-------|--------|
| Setting Refinement | 100 | A | ✅ |
| Cast Design | 100 | A | ✅ |
| Background Context | 100 | A | ✅ |
| Hard Logic Devices | 100 | A | ✅ |
| CML Generation | 100 | A | ✅ |
| Novelty Audit | 100 | A | ✅ |
| Clue Distribution | 100 | A | ✅ |
| Fair-play Audit | 100 | A | ✅ |
| Character Profiles | 100 | A | ✅ |
| Location Profiles | 100 | A | ✅ |
| Temporal Context | 100 | A | ✅ |
| World Builder | 100 | A | ✅ |
| Narrative Outline | 100 | A | ✅ |
| Prose Generation | 100 | A | ✅ |
| **Overall** | **99.86** | **A** | ❌ (gate) |

---

## 12. Summary of Findings

| Finding | Category | Priority |
|---------|----------|----------|
| Expansion disabled — 0 expansion attempts confirmed; 18/19 chapters below preferred but all above 600-word hard floor | Experiment observation | — |
| FIX-B fires correctly for clock-reading CML inconsistency | FIX-B working | — |
| FIX-B 12-hour AM/PM false positive: word-form times treated as AM, digit-form PM clues → always 12h mismatch | Bug in FIX-B | Medium |
| "Forty minutes" fails in 4 chapters likely due to keyword over-trigger (ANALYSIS_28 recurrence) | Known issue | Medium |
| Chapter 10 fingerprint clue exhausts 3 retries — same pattern as ANALYSIS_47/48 | Known pattern | Low |
| Barry Lynch pronoun drift (ch12) unresolved after 3 retries | Known pattern | Low |
| Catherine Nolan pronoun drift in 5+ chapters — FIX-E not fully suppressing it | FIX-E gap | Low |
| Disabling expansion saves ~2–3 min and ~$0.004 per run but does not reduce major issue count | Experiment result | — |

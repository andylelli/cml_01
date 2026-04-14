# ANALYSIS_43 — Fix Verification: Post-run_ea73d9f2 Outcome

**Date:** 2026-04-05  
**Source runs:**
- `run_ea73d9f2-5b2c-478f-9994-e633eabe46bd` — ABORTED (quality report attached; previously documented in ANALYSIS_40 and ANALYSIS_42)
- Post-fix run (log captured 2026-04-04 ~19:57–20:09 BST) — COMPLETED (all 18 chapters)

**Prior refs:** ANALYSIS_40 (initial ea73d9f2 audit), ANALYSIS_41 (code audit), ANALYSIS_42 (root-cause and fix specification)

---

## 1. Context

ANALYSIS_42 isolated three root causes in run_ea73d9f2's abort at chapter 2:

| Fix ID | Root cause | Location |
|--------|-----------|----------|
| FIX-P1 | `findIncorrectPronouns()` Guard 1 backward window only ±4 sentences — misses male antecedent named ≥5 sentences before female character's sentence → false-positive pronoun mismatch | `character-validator.ts` lines 270–271 |
| FIX-C1 | Early-observation prompt said "first 25%" (relative); model placed clue at paragraph 4 on 3 consecutive attempts; validator's threshold `ceil(N * 0.25)` sometimes excludes paragraph 4 | `agent9-prose.ts` lines 1292–1319, 478–503 |
| FIX-C2 | `batches_with_retries` computed post-loop; throw-before-aggregation meant aborted runs always reported 0 | `agent9-prose.ts` lines 3844–3858; `mystery-orchestrator.ts` |

All three fixes were implemented and unit-tested. This document confirms outcomes against live run output.

Additionally, during quality review of the three fixes, two secondary bugs were identified and fixed in the same session:

| Fix ID | Root cause |
|--------|-----------|
| BUG-QA1 | FIX-C1's retry message said `"paragraphs 1-${quarterEndForMsg}"` then `"first 2 paragraphs"` in the same string — internally contradictory for chapters with `quarterEndForMsg ≠ 2` |
| BUG-QA2 | Outer catch block (parse/network failures) threw a bare `new Error(...)` without attaching `.retriedBatches`, silently zeroing the metric for any run that aborted via parse failure |

---

## 2. Quality Report — run_ea73d9f2 (Pre-Fix Baseline)

### 2.1 Run outcome

```
run_outcome: aborted
abort_reason: "Chapter 2 generation failed after 4 attempts: Chapter 2 failed
              validation after 4 attempts. Issues: Character \"Dennis Curnow\"
              has incorrect pronouns. Should use he/him/his but found: her;
              Character \"Ailla Luke\" has incorrect pronouns. Should use
              she/her/her but found: he"
chapters_generated: 1
aborted_after_chapter: 1
batches_with_retries: 0   ← pre-FIX-C2 accounting gap (4 retry events occurred)
```

### 2.2 Phase scores

| Phase | Score | Passed | Notes |
|-------|-------|--------|-------|
| Setting Refinement | 100 | ✅ | |
| Cast Design | 100 | ✅ | |
| Background Context | 98 | ✅ | Constraints completeness 50% |
| Hard Logic Devices | 100 | ✅ | |
| CML Generation | 100 | ✅ | Schema valid on attempt 1 |
| Novelty Audit | 100 | ✅ | Skipped (threshold ≥ 1.0) |
| Clue Distribution | 100 | ✅ | 11 clues distributed |
| Fair-play Audit | 100 | ✅ | |
| Character Profiles | 100 | ✅ | |
| Location Profiles | 100 | ✅ | |
| Temporal Context | 100 | ✅ | |
| World Builder | 100 | ✅ | |
| Narrative Outline | 100 | ✅ | Retry: 17→18 scenes |
| **Prose Generation** | **92** | **❌** | ch1 only; abort at ch2 |

Overall score 99.29 (A) is an artifact of perfect pre-prose scores weighted against a single-chapter prose evaluation. The prose score of 92 breaks down: `consistency_score: 45.4` from character coverage (`2/5`) and setting fidelity (`1/3`) — both single-chapter-abort artifacts documented in ANALYSIS_40 §4.C and ANALYSIS_42 INF-2.

### 2.3 Cast (confirmed from report)

| Name | Gender | Role |
|------|--------|------|
| Geraint Penrose | — | — |
| Caroline Bolitho | — | — |
| Dennis Curnow | male | culprit-eligible |
| Jennifer Carew | — | — |
| Ailla Luke | female | culprit-eligible |

Dennis Curnow (male) and Ailla Luke (female) were the characters driving the false-positive pronoun mismatch chain. Same cast as documented in ANALYSIS_42 §6.

---

## 3. Fix Verification Run — All 18 Chapters Completed

### 3.1 Chapter generation summary

| Chapter | Attempts | Retry reason | Pre-repair | Post-expansion repair |
|---------|----------|-------------|------------|----------------------|
| 1 | 1 | — | 6 | 10 |
| 2 | 1 | — | 2 | 5 |
| 3 | 1 | — | 6 | 6 |
| 4 | **2** | Weak sensory grounding (1 marker found) | 8 | 7 |
| 5 | 1 | — | 12 | 12 |
| 6 | 1 | — | 8 | 4 |
| 7 | **4** | Weak atmosphere/time grounding (3×) | 4 | — |
| 8 | 1 | — | 18 | 17 |
| 9 | 1 | — | 14 | 13 |
| 10 | 1 | — | — | — |
| 11 | 1 | — | 11 | 17 |
| 12 | 1 | — | 2 | 5 |
| 13 | 1 | — | 6 | 3 |
| 14 | 1 | — | 7 | 7 |
| 15 | 1 | — | 13 | 16 |
| 16 | **2** | Weak sensory grounding (1 marker found) | 9 | 3 |
| 17 | **2** | Missing discriminating test scene | 13/17 | — |
| 18 | **2** | Missing discriminating test scene | 19/22 | — |

`—` = not logged (no repair needed, or no expansion triggered).  
Ch17/ch18 pre-repair shows attempt 1 / attempt 2 counts (model produced more correct pronouns on the retry).

**Net totals:** 5 batches with retries (ch4, ch7, ch16, ch17, ch18); 7 batch-failure events.  
**Final logged:** `"Prose generation: 5/18 batch(es) required retry due to validation issues"` — matches FIX-C2 counting.

Atmosphere repair ran on 6 chapters after generation: ch1, ch3, ch14, ch16, ch17, ch18.

### 3.2 FIX-P1 outcome — pronoun abort eliminated

**Verdict: ✅ Confirmed fixed.**

In run_ea73d9f2, ch2 exhausted all 4 attempts with Dennis Curnow / Ailla Luke pronoun cross-contamination. In the verification run, ch2 passed on attempt 1 with 2 pre-validation repairs and 5 post-expansion repairs. No chapter in the 18-chapter run aborted due to pronoun issues.

Notable: pronoun repair volume remains high across the run — ch8 has 18 pre-validation and 17 post-expansion repairs (35 total corrections to a single chapter). This indicates the LLM continues to produce a large number of wrong-gender pronouns in base generation; the repair system is resolving them before validation. The widened Guard 1 window (−10/+3) prevents the validator from then re-flagging correctly-repaired sentences or valid pronouns that reference a distant antecedent.

**Watch:** The repair volume is not escalating with chapter number, but ch8/ch9/ch11/ch15 all exceed 10 repairs on a single pass. If prompt or model changes shift base generation toward fewer pronoun errors, these counts should drop. If they remain stable at 15–20+ per chapter, this points to a structural LLM tendency to inherit pronouns from the preceding speaker regardless of gender — a pattern the repair system is absorbing rather than eliminating.

### 3.3 FIX-C1 outcome — early-observation prompt tightened

**Verdict: ✅ No ch1 clue-position retry loop observed in verification run.**

In run_ea73d9f2, ch1 required 4 attempts (3 failures) to place the early-observation clue before the validator's threshold. In the verification run, ch1 passes on attempt 1. The prompt change from relative "first 25%" to absolute "paragraphs 1 or 2" produced the expected behaviour: ch1's audit tail confirms `early_observation_present: present`.

### 3.4 FIX-C2 outcome — `batches_with_retries` now accurate on abort

**Verdict: ✅ Metric correctly populated.**

The verification run (which completed successfully) reports `5/18 batch(es) required retry` in the log — matching the observed retry events (ch4, ch7, ch16, ch17, ch18). Had the run aborted, the eagerly-maintained `retriedBatches` Set would have attached the count to the thrown error before mystery-orchestrator captured it, and both abort paths (`aborted_partial`, `aborted_zero_chapters`) now read `(error as any).retriedBatches ?? 0`.

The run_ea73d9f2 quality report confirms the pre-fix state: `batches_with_retries: 0` despite ch1 having 3 retry events and ch2 having 4, totalling 7 batch-failure events that were invisible.

### 3.5 BUG-QA1 outcome — retry feedback message consistent

**Verdict: ✅ Fixed.** Message now reads `"paragraphs 1-${quarterEndForMsg} — move the observation beat to paragraph 1 or 2."` The second clause is no longer a contradictory restatement of a different threshold.

### 3.6 BUG-QA2 outcome — outer catch attaches `.retriedBatches`

**Verdict: ✅ Fixed.** The outer catch block now creates a named `abortErr`, attaches `.retriedBatches = retriedBatches.size`, then throws — matching the inner validation-fail abort path.

---

## 4. Retry Pattern Analysis — Verification Run

### 4.1 Chapter 7 — 3 consecutive atmosphere failures

Ch7 failed identically on attempts 1, 2, and 3 for the same reason — `"weak atmosphere/time grounding"` (no weather/time/atmosphere marker in the opening block). The word count across attempts was near-identical (1,163 / 1,177 / 1,174). This closely mirrors run_ea73d9f2's ch1 behaviour: the model is locked in a local minimum and not responding to retry feedback.

Attempt 4 triggered `UnderflowExpansion` (word count below preferred target on the passing attempt), which also happened to inject atmospheric language. The chapter passed validation via expansion rather than via direct compliance with the retry instruction.

This is the same **feedback-deaf local-minimum pattern** documented in ANALYSIS_42 §3.3 for ch1's clue-position failures. The model ignores repeated positional/atmospheric directives in retry feedback; it corrects only when a structural change (expansion, different temperature, random seed shift on the final attempt) happens to produce compliant output.

**Implication:** The opening-atmosphere validation rule (`≥1 weather/time/atmosphere marker in the opening block`) should be injected into the generation prompt for every chapter (not just via retry feedback). This converts a feedback-dependent correction into a generation-time requirement.

### 4.2 Chapters 17 and 18 — discriminating test scene absent on attempt 1

Both ch17 and ch18 failed on attempt 1 with `"Chapter N may be missing the discriminating test scene"`. Both passed on attempt 2. The scene description used in the retry:

> *"Set up a controlled reenactment of the evening's events, forcing Caroline to explain the clock's tam..."* (truncated in log)

The model placed the discriminating test on attempt 2 in both cases. This is standard retry behaviour for content-level omissions where the model responds correctly once the specific scene description is surfaced in feedback.

### 4.3 Retry types — structural summary

| Retry type | Chapters | Attempts to pass | Responds to feedback? |
|-----------|----------|----------------|----------------------|
| Sensory grounding (opening block) | 4, 16 | 2 | ✅ Direct |
| Atmosphere/time grounding (opening block) | 7 | 4 | ❌ Feedback-deaf; fixed by expansion |
| Discriminating test absent | 17, 18 | 2 | ✅ Direct |
| Pronoun mismatch (abort in run_ea73d9f2) | — | N/A (fixed) | N/A (validator suppressed by FIX-P1) |

---

## 5. Post-Fix Issue Register

### FIXED

| ID | Description | Resolution |
|----|-------------|-----------|
| ERROR-1 (ANALYSIS_42) | Ch2 pronoun abort — false-positive `pronoun_gender_mismatch` from Guard 1 window ±4 | FIX-P1: window widened to −10/+3 ✅ |
| ERROR-2 (ANALYSIS_42) | Ch1 early-observation retry loop — model unresponsive to "first 25%" feedback | FIX-C1: prompt changed to "paragraphs 1 or 2" ✅ |
| WARN-1 (ANALYSIS_42) | `batches_with_retries: 0` on aborted runs | FIX-C2 + BUG-QA2 ✅ |
| BUG-QA1 | Inconsistent retry message ("1-N" vs "first 2") | Fixed in same session ✅ |

### NEW — OPEN

| ID | Severity | Description | Suggested fix |
|----|----------|-------------|--------------|
| WARN-1 | Medium | Ch7 atmosphere/time retry — 3 consecutive identical failures; model unresponsive to retry feedback on opening-block atmospherics | Inject opening-block atmosphere requirement into generation prompt, not only in retry feedback. Pattern identical to resolved FIX-C1 clue-position issue. |
| WARN-2 | Low | Pronoun repair volume elevated (ch8: 35 total repairs, ch5/ch9/ch11/ch15: 20+) | LLM has a structural tendency to use wrong-gender pronouns in multi-character scenes. Repair system absorbs it correctly. Monitor — if volume grows with cast size or chapter length, consider prompt-level gender-reminder injection. |
| INF-1 | Informational | `detectNameSwitches()` fallback hardcodes "detective" label — cast with inspector/amateur sleuth labels would silently activate a placeholder list | Low priority; add role-label normalisation if non-detective-labelled detective roles are introduced |
| INF-2 (recurring) | Informational | Narrative Outline chapter count 18 vs target 20 — one retry to reach 18 | Persistent across all runs. Scene count tolerance is masking deeper planning shortfall. |

### CONFIRMED CLOSED (ANALYSIS_42 finding, code already correct)

| ID | Description |
|----|-------------|
| ~~FIX-P2~~ | `flaggedNames` not passed to `repairPronouns()` — code was already correct; ANALYSIS_41 diagnosis was wrong |
| ~~BUG C2~~ | `checkPronounDrift()` has no competing-entity guard — `competitorInWindow` guard was already present |

---

## 6. `batches_with_retries` Telemetry — Pre/Post Comparison

| Run | Actual retry events | Reported `batches_with_retries` | Accurate? |
|-----|--------------------|---------------------------------|-----------|
| run_ea73d9f2 (pre-fix, aborted at ch2) | Ch1: 3, Ch2: 4 = 7 events in 2 batches | 0 | ❌ |
| Verification run (post-fix, completed) | Ch4: 1, Ch7: 3, Ch16: 1, Ch17: 1, Ch18: 1 = 7 events in 5 batches | 5 | ✅ |

---

## 7. Summary

All five issues identified through the ANALYSIS_40 → ANALYSIS_42 → code-audit pipeline have been resolved:

1. **Pronoun abort eliminated** — FIX-P1 (widened Guard 1 window) prevents `findIncorrectPronouns()` from flagging valid cross-character pronoun references where the antecedent was named more than 4 sentences earlier. Verified: ch2 passes on attempt 1 in the post-fix run; run completes all 18 chapters.

2. **Early-observation retry loop eliminated** — FIX-C1 (absolute "paragraphs 1 or 2" in prompt) produces first-attempt compliance in post-fix run ch1.

3. **`batches_with_retries` metric corrected** — FIX-C2 + BUG-QA2 ensure the counter is maintained eagerly and attached to any thrown abort error regardless of abort path. Post-fix run shows correct count of 5.

4. **Retry message consistency fixed** — BUG-QA1: present-but-late clue feedback message no longer contains contradictory paragraph references.

One new concern: ch7's 3-attempt atmosphere failure demonstrates the same feedback-deaf retry pattern that FIX-C1 resolved for clue positioning. The opening-block atmosphere requirement (`≥1 weather/time/atmosphere marker`) is currently enforced only via retry feedback — the same structural gap that caused the clue-position 3-failure run in run_ea73d9f2. This should be addressed with the same fix pattern: inject the constraint as a generation-time directive.

---

## 8. Follow-on Analysis — run_bbf9e661 (2026-04-05)

**Run:** `run_bbf9e661-22fa-4f2b-9866-a8d3e5ca9286`  
**Project:** `proj_6362cdcc-99c3-44f2-bf82-6559ffe592b5`  
**Generated:** 2026-04-04T20:09:51.515Z  
**Outcome:** Aborted — story validation gate fired post-generation  
**Abort reason:** `"Story validation failed: 0 critical, 11 major issues"`

This run illustrates a new failure mode introduced by the fixes from ANALYSIS_42/43: prose generation is now reliable (all 18 chapters completed, prose score 100/A, 24,412 words), but the post-generation story-validation gate over-triggers on a combination of false positives and real prompt-level gaps, producing 11 major issues against a `major > 5` abort threshold.

### 8.1 Run context

| Property | Value |
|----------|-------|
| Cast | Edgar Wingate (victim/male), Caroline Merton (female), Ernest Denison (male), Herbert Hewitt (male), Christine Holt (detective/female) |
| Locations | Drawing Room, Library, Kitchen, Garden Pathway |
| Hard logic device | Stopped clock showing `"ten minutes past eleven"`, wound back `"forty minutes"` |
| Chapters | 18, all completed |
| Prose score | 100 / A |
| Story validation | 0 critical, **11 major** → `needs_revision` → abort |

### 8.2 The 11 major issues — categorisation

| Type | Count | Root cause category |
|------|-------|---------------------|
| `missing_case_transition_bridge` | 2 | A — `BRIDGE_TERMS` regex too narrow |
| `case_transition_missing` | 1 | A — same regex in second validator |
| `weather_incompatible_evidence` | 2 | B — chapter-level boolean detection |
| `locked_fact_missing_value` | 5 | C — prompt permits digit conversion of word-phrased values |
| `chapter_title_inconsistency` | 1 | D — no title format requirement in output schema |

### 8.3 Root cause A — `BRIDGE_TERMS` too narrow

**Files:** `narrative-continuity-validator.ts` (line 11), `case-transition-validator.ts` (line 10)

Both validators check, during disappearance-to-murder scene transitions, that a "bridge" phrase confirming the reclassification appears in the connecting scene. The old regex accepted only 5 exact phrases:

```
body was found | confirmed dead | turned up dead |
missing person case became a murder | identified the body
```

Natural mystery prose uses `"had been murdered"`, `"found dead"`, `"discovered dead"` — none of which matched, producing 3 spurious major issues on a well-formed story.

The `case-transition-validator.ts` copy had an even shorter set (4 phrases; `turned up dead` was missing).

**Fix (`FIX-A`):** Expanded both `BRIDGE_TERMS` constants to include `found\s+dead`, `discovered\s+dead`, `was\s+found\s+dead`, `had\s+been\s+(?:murdered|killed|slain)`, `no\s+longer\s+missing`.

Existing test `"flags missing bridge when transitioning from disappearance to murder"` was using `"He had been murdered, clearly."` as the *no-bridge* fixture — now correctly a match. Fixture updated to `"The inspector examined the corpse in the library."` which contains `DEATH_TERMS` but no bridge phrase.

### 8.4 Root cause B — `validateWeatherEvidence` chapter-level booleans

**File:** `physical-validator.ts` lines 177–196

The validator fired when `storm|tempest|gale`, `dust|paper|footprint|fiber`, and `deck|outside|exterior` each appeared *anywhere* in a chapter — three independent chapter-level boolean checks. A manor mystery chapter that opens "the storm had passed" (para 1), references "the scattered papers" (para 5), and has a character "glance outside" (para 9) triggers this rule despite no causal connection between the three phrases.

Fired on chapters 4 and 17 — expected for a country-house story with stormy weather, a Garden Pathway location, and documents as evidence.

**Fix (`FIX-B`):** Replaced the three chapter-level booleans with a sentence-level loop. The chapter text is split on sentence boundaries; the validator only fires when all three elements co-occur in the **same sentence**. One error emitted per scene (`break` after first match). The outdoor pattern was tightened from the generic `exterior` to explicit outdoor constructions to reduce further false positives. 

### 8.5 Root cause C — locked facts prompt does not forbid digit conversion

**File:** `agent9-prose.ts` — `lockedFactsBlock` construction

The locked-facts prompt already instructs verbatim reproduction and names paraphrase, approximation, and rounding as prohibited. However, the LLM consistently converts word-phrased time and quantity values to digit notation:

| Canonical (locked) | LLM output | Chapter(s) |
|-------------------|-----------|------------|
| `"ten minutes past eleven"` | `"11:10 PM"` | 2, 16 |
| `"forty minutes"` | `"40 minutes"` / `"almost an hour"` | 8, 12, 14 |

This accounts for 5 of the 11 major issues. The existing `FAILURE EXAMPLE` in the prompt (`"at 11:47 PM"` vs `"just before midnight"`) demonstrates a paraphrase failure but inadvertently signals to the model that canonical values are in digit/clock format — a mixed signal when the locked value is actually written in words.

**Fix (`FIX-C`):** Added a `CRITICAL — WORD-PHRASED VALUES` paragraph to the `lockedFactsBlock` with an explicit correct/wrong example:

> *"Correct: 'ten minutes past eleven'. WRONG: '11:10', '11:10 PM', 'twenty-three eleven'."*

### 8.6 Root cause D — no chapter title format in output schema

**File:** `agent9-prose.ts` — `developer` string, Requirements list

The output schema shows `"title": "Chapter title"` as an unformatted placeholder. In the absence of a format directive, the model produces mixed patterns: some chapters use `"Chapter N: [Title]"`, others use title-only (`"The Drawing Room"`), and others use number-only (`"Chapter 7"`). The `chapter_title_inconsistency` validator fires when multiple distinct title patterns are detected across the chapter set.

**Fix (`FIX-D`):** Added a format requirement to the Requirements list in the `developer` output schema block:

> *"Chapter title format: EVERY chapter title MUST follow exactly 'Chapter N: [Descriptive title]' (e.g. 'Chapter 1: The Frozen Clock'). Do NOT use number-only or title-only formats — mixed formats are a validation error."*

### 8.8 WARN-1 — Opening-block atmosphere/sensory vocabulary not specified at generation time

**File:** `agent9-prose.ts` — `buildSceneGroundingChecklist` + `developer` NOVEL-QUALITY PROSE REQUIREMENTS

**Root cause:** The `chapter-validator.ts` `checkSceneGrounding` validator checks for specific vocabulary tokens in `atmosphereMarkers` (`rain`, `wind`, `fog`, `storm`, `mist`, `thunder`, `evening`, `morning`, `night`, `dawn`, `dusk`, `season`) and `sensoryMarkers` (`smell`, `scent`, `sound`, `echo`, etc.). The generation-time prompt said only _"include 2+ sensory cues and 1+ atmosphere marker"_ — vague enough that the model wrote prose like _"the grey gloom of the afternoon"_ which passed its own judgement but contained none of the expected tokens, triggering a retry.

This is structurally identical to FIX-C1 (clue-position issue): the model ignores abstract positional/qualitative directives in retry feedback but complies when given exact, concrete vocabulary at generation time.

**Fix applied (`WARN-1-FIX`):**

1. `buildSceneGroundingChecklist` per-chapter checklist line updated to:
   > `"HARD REQUIREMENT for the first 2 paragraphs: (a) include 2+ sensory words — choose from smell/scent/sound/echo/silence/creak/whisper/cold/warm/damp/rough/smooth/glow/shadow/flicker/dim — and (b) include 1+ atmosphere/time word — choose from rain/wind/fog/storm/mist/thunder/evening/morning/night/dawn/dusk/season. These are validated requirements, not style suggestions; missing them triggers a retry."`

2. NOVEL-QUALITY PROSE REQUIREMENTS §1 `SCENE-SETTING` rewritten as a mandatory opening-block checklist with the same vocabulary lists, labelled a VALIDATION REQUIREMENT.

Both changes mirror the vocabulary actually checked by `atmosphereMarkers` and `sensoryMarkers` in `chapter-validator.ts`, eliminating the vocabulary gap between what the validator tests and what the model is instructed to produce.

**Test result:** 368 tests pass, exit 0.

All fixes were applied in a single `multi_replace_string_in_file` pass across 4 files. Unit tests:

```
Test Files  31 passed | 1 skipped (32)
      Tests  368 passed | 7 skipped (375)
Exit code: 0
```

The one pre-existing test failure (caused by the `BRIDGE_TERMS` expansion correctly matching the old fixture's bridge phrase) was resolved by updating the fixture to a genuine no-bridge scenario.

### 8.9 Issue register update

| ID | Type | Severity | Status | Fix location |
|----|------|----------|--------|--------------|
| FIX-A | `BRIDGE_TERMS` too narrow | Major×3 | ✅ Fixed | `narrative-continuity-validator.ts` + `case-transition-validator.ts` |
| FIX-B | `validateWeatherEvidence` chapter-level FP | Major×2 | ✅ Fixed | `physical-validator.ts` |
| FIX-C | Locked-facts prompt: word→digit conversion | Major×5 | ✅ Fixed | `agent9-prose.ts` (`lockedFactsBlock`) |
| FIX-D | Chapter title format unspecified | Major×1 | ✅ Fixed | `agent9-prose.ts` (`developer` schema) |
| WARN-1 (carried forward) | Ch7 atmosphere retry feedback-deaf | Medium | ✅ Fixed | See §8.8 — vocabulary explicit in `buildSceneGroundingChecklist` + SCENE-SETTING requirement |

# ANALYSIS_44 — Run `run_bbf9e661` Full Issue Audit

**Date:** 2026-04-05  
**Run:** `run_bbf9e661-22fa-4f2b-9866-a8d3e5ca9286`  
**Project:** `proj_6362cdcc-99c3-44f2-bf82-6559ffe592b5`  
**Generated:** 2026-04-04T20:09:51.515Z  
**Outcome:** ABORTED — `"Story validation failed: 0 critical, 11 major issues"`  
**Overall score:** 99.21 / A (scoring passed; story-validation gate caused abort)  
**Prior refs:** ANALYSIS_43 §8 (initial summary of this run's issues); ANALYSIS_41 (code audit); ANALYSIS_40 (prior run baseline)

---

## 1. Outcome Summary

| Metric | Value |
|--------|-------|
| Status | aborted |
| Passed | false |
| Phases scored | 14 |
| Phases passed | 14 (100%) |
| Phases failed | 0 |
| Overall score | 99.21 / A |
| Story validation | 0 critical, **11 major**, 13 moderate, 8 minor |
| Chapters generated | 18 (all completed) |
| Total words | 24,412 |
| Total duration | 12.5 min |
| Total cost | $0.0644 |
| Abort cause | Post-generation story-validation gate: `major (11) > 5` threshold → `needs_revision` |

This run represents a qualitative shift from prior aborts: prose generation now completes reliably (18 chapters, prose score 100/A), but the post-generation story-validation gate fires enough major issues to abort. The 11 major issues cluster into four root-cause categories (A–D), all stemming from prompt-level gaps or validator regex under-breadth rather than generation instability.

---

## 2. Phase Score Summary

| Phase | Agent | Score | Grade | Passed |
|-------|-------|-------|-------|--------|
| Setting Refinement | agent1_setting | 100 | A | ✅ |
| Cast Design | agent2_cast | 100 | A | ✅ |
| Background Context | agent2e_background_context | 98 | A | ✅ |
| Hard Logic Devices | agent3b_hard_logic_devices | 96 | A | ✅ |
| CML Generation | agent3_cml | 100 | A | ✅ |
| Novelty Audit | agent8_novelty | 100 | A | ✅ (skipped) |
| Clue Distribution | agent5_clues | 100 | A | ✅ |
| Fair-play Audit | agent6_fairplay | 100 | A | ✅ |
| Character Profiles | agent2b_profiles | 100 | A | ✅ |
| Location Profiles | agent2c_location_profiles | 100 | A | ✅ |
| Temporal Context | agent2d_temporal_context | 100 | A | ✅ |
| World Builder | agent65_world_builder | 100 | A | ✅ |
| Narrative Outline | agent7_narrative | 95 | A | ✅ |
| **Prose Generation** | agent9_prose | **100** | **A** | **✅** |

**Notable sub-score drops (non-fatal):**

- **Background Context 98:** `Constraints defined` = 50% (half the expected constraint fields populated). Persistent across all runs; not blocking.
- **Hard Logic Devices 96:** `Device type diversity` = 40 (only 2 device types across 5 devices). Minor quality gap; not blocking.
- **Narrative Outline 95:** `Clue pacing` = 50 (5/18 chapters have scheduled clues). Agent 7 does not spread clue assignments evenly; most chapters get no dedicated clue. Not directly blocking but means Agent 9 must do more implicit embedding work.
- **Prose Generation — Fair play compliance 85/100:** Timing violation in chapter 10 (minor severity, did not prevent prose phase pass).

---

## 3. Story Configuration

| Property | Value |
|----------|-------|
| **Victim** | Edgar Wingate (male) |
| **Culprit** | Caroline Merton (female) |
| **Detective** | Christine Holt (female) |
| **Other suspects** | Ernest Denison (male), Herbert Hewitt (male) |
| **Locations** | Drawing Room, Library, Kitchen, Garden Pathway |
| **Hard logic device** | Stopped clock; face reads `"ten minutes past eleven"`; wound back `"forty minutes"` |
| **Setting type** | Country house, winter |

---

## 4. Runtime Log Analysis

### 4.1 Chapter retry history

| Chapter | Attempts | Failure reason | Notes |
|---------|----------|---------------|-------|
| 4 | 2 | Weak sensory grounding (1 marker found) | Passed on retry |
| 7 | 3 | Clue evidence absent ("Douglas Wyatt claims he was in the study") | Passed on attempt 3 — see §4.3 |
| 8 | 2 | Clue evidence absent ("Philip Chalcott has a visible passion for justice") | Passed on attempt 2 after underflow expansion |
| 9 | **4 (all fail)** | Clue evidence absent × 3, then prompt leakage + clue absent on attempt 4 | Last attempt used despite failures — see §4.4 |
| 16 | 2 | Weak sensory grounding (1 marker found) | Passed on retry |
| 17 | 2 | Missing discriminating test scene | Passed on attempt 2 |
| 18 | 2 | Missing discriminating test scene | Passed on attempt 2 |

**Totals:** 7 batch-failure events across 7 batches; 5 batches with at least one retry.

### 4.2 Pronoun repair volumes

The deterministic repair system (pre- and post-expansion passes) made a large number of corrections per chapter:

| Chapter | Pre-validation repairs | Post-expansion repairs | Total |
|---------|----------------------|----------------------|-------|
| 1 | 3 | 2 | 5 |
| 2 | 0 | 4 | 4 |
| 3 | 4 | 5 | 9 |
| 4 | 7 | 2 | 9 |
| 5 | 12 | 19 | **31** |
| 6 | 14 | 4 | 18 |
| 7 | 2 | — | 2+ |
| 8 | 17 | 17 | **34** |
| 9 | 1 + (4 + 4 + 4 + 5) → attempt 4 only | — | — |

The repair system is correctly resolving most pronoun errors before they reach story-validation. However the post-generation story-level validator still found 7 `pronoun_drift` moderate issues (§6.2), which indicates either: (a) sentence structures the repair regex does not handle, or (b) pronoun drift introduced between sentences in a way the repair's forward-only scan misses.

### 4.3 Chapter 7 — clue validation referencing out-of-cast character

Ch7 failed attempts 1 and 2 with:

> `Chapter 7: clue evidence "Douglas Wyatt claims he was in the study." is absent.`

The character **Douglas Wyatt** does not appear in the 5-person cast (Edgar Wingate, Caroline Merton, Ernest Denison, Herbert Hewitt, Christine Holt). Ch8 and ch9 failed similarly with:

> `Chapter 8/9: clue evidence "Philip Chalcott has a visible passion for justice." is absent.`

**Philip Chalcott** also does not appear in the cast. These character names come from the clue descriptions generated during the Agent 5 clue distribution phase. The CML for this story may have embedded secondary or reference characters in clue descriptions that are never introduced in the prose. Agent 9's self-evaluation JSON checks for the textual clue description in the chapter — if the description names a character who was never established in the prose, the check fails reliably even when the underlying evidence is present under a different framing.

Three scenarios possible:
1. Agent 5 produced clue descriptions that reference characters not in the cast — a clue distribution consistency gap  
2. The narrative outline assigned a clue with an out-of-cast character reference to a chapter where that character was not introduced
3. These are aliases or generic suspect placeholders that the model replaced with canonical names during prose generation, but the description text still references the alias

Regardless, the chapter-level self-evaluation check is matching the **raw description text** rather than the underlying logical clue content. This creates an unfulfillable requirement when the description names non-prose characters.

**Note:** The scoring-level clue visibility check (NSD tracker) shows `8/8 clues confirmed` — the underlying clue evidence *is* present. Only the text-match validation fails. The prose scoring passed all clue checks.

### 4.4 Chapter 9 — all retries exhausted; prompt leakage on final attempt

Ch9 failed all 4 attempts:
- Attempts 1–3: clue evidence absent ("Philip Chalcott has a visible passion for justice")
- Attempt 4: prompt leakage **AND** clue evidence still absent

> `[Agent 9] Batch ch9 validation failed (attempt 4/4):`  
> `- Chapter 9: Chapter 9 contains instruction-shaped prose (prompt leakage)`  
> `- Chapter 9: clue evidence "Philip Chalcott has a visible passion for justice." is absent.`

Attempt 4's `raw_response_chars` was 5,844 — the shortest of the 4 attempts (attempts 1–3 were 6,403 / 6,934 / 7,443). The model produced a shorter, more mechanical response on the final attempt and the output contained instruction-shaped prose (imperative directives that read like prompt text rather than narrative). This is a known degradation: as retry count increases using the same seed/temperature, responses collapse toward mechanical or leaking text.

The final attempt's output was used as the chapter 9 prose despite failing validation. Prompt leakage visible in a chapter is a severe prose quality defect, yet the scoring-level checker passed prose phase at 100/A — this is because the scoring checks `prose quality 94%` and `readability 92%` are weighted averages across all chapters; a single degraded chapter does not move the aggregate below threshold.

**Consequence:** The story as generated almost certainly has degraded chapter 9 prose with visible instruction text. This was not caught by any blocking gate.

---

## 5. Major Issue Detail (11 issues → abort)

### 5.1 Category A — `BRIDGE_TERMS` regex too narrow (3 major issues)

| Error type | Chapter(s) | Detail |
|-----------|-----------|--------|
| `missing_case_transition_bridge` | 9 | Scene 9 shifts from disappearance → murder without bridge |
| `missing_case_transition_bridge` | 15 | Scene 15 same |
| `case_transition_missing` | — (story-level) | Full story lacks explicit hinge scene |

**Validators:** `narrative-continuity-validator.ts` (checkes per-chapter pairs), `case-transition-validator.ts` (checks full concatenated story).

**Root cause:** Both validators tested whether the prose transition from disappearance language to murder language included a "bridge" phrase confirming the reclassification. The pre-fix `BRIDGE_TERMS` regex covered only five exact constructions:

```
body was found | confirmed dead | turned up dead |
missing person case became a murder | identified the body
```

Natural prose uses constructions like `"had been murdered"`, `"was found dead"`, `"discovered the body"` that are semantically equivalent bridges but lexically absent from the regex. A well-written transition that used any of these phrases would still produce a false-positive major issue.

The `case_transition_missing` story-level issue is redundant with the scene-level errors in this case; all three fire because the prose does not use any of the five matching phrases.

**Fix applied (FIX-A):** `BRIDGE_TERMS` expanded in both validators to include `found\s+dead`, `discovered\s+dead`, `was\s+found\s+dead`, `had\s+been\s+(?:murdered|killed|slain)`, `no\s+longer\s+missing`.

**Post-fix bug found and corrected:** `found\s+dead` and `discovered\s+dead` match only when `found`/`discovered` is directly adjacent to `dead` — the common construction `"found Edgar dead"` / `"discovered her dead"` (with a name or pronoun between verb and adjective) does not match. Added `found\s+\w+\s+dead` and `discovered\s+\w+\s+dead` to both validators.

### 5.2 Category B — `validateWeatherEvidence` chapter-level boolean detection (2 major issues)

| Error type | Chapter(s) | Detail |
|-----------|-----------|--------|
| `weather_incompatible_evidence` | 4 | Light trace evidence in outdoor storm conditions |
| `weather_incompatible_evidence` | 17 | Same |

**Validator:** `physical-validator.ts` — `validateWeatherEvidence()`.

**Root cause:** The validator applied three independent chapter-level boolean tests:
1. Does this chapter contain `storm|tempest|gale` anywhere?
2. Does it contain `dust|paper|footprint|fiber` anywhere?
3. Does it contain `deck|outside|exterior` anywhere?

All three firing simultaneously triggered the error. In a country-house story with stormy winter weather and a Garden Pathway location, this triple conjunction will occur naturally across unrelated sentences — e.g., the chapter opens with storm atmosphere (para 1), a character references scattered papers (para 6), and a character steps outside (para 9) — yet there is no physical contradiction because the three elements appear in different scenes or moments.

Chapters 4 and 17 in this run are both near-certain false positives: the Garden Pathway is an outdoor location that legitimately appears in both chapters, and winter storm references pervade the atmospheric language throughout the story.

**Fix applied (FIX-B):** Replaced the three chapter-level boolean checks with a sentence-level loop. The chapter text is split on sentence boundaries (`/(?<=[.!?])\s+/`); the error fires only when all three signals co-occur in the **same sentence**.

**Post-fix bugs found and corrected:**
- `isOutdoor` was over-constrained after the fix (`outside\s+(?:in|on)`, `in\s+the\s+garden`, `garden\s+path` but not `garden pathway`) — excluded most real outdoor sentences. Relaxed to: `\b(?:deck|outside|outdoors?|exterior|garden|yard|grounds|lawn)\b`
- `hasTraceEvidence` had missing closing word boundaries: `\bfootprint` (matches `footprinting`) and `\bfiber` (matches `fiberoptic`). Fixed to: `\bfootprints?\b|\bfibers?\b`

### 5.3 Category C — locked facts prompt: digit conversion of word-phrased values (5 major issues)

| Error type | Chapter(s) | Locked fact | Canonical value | Likely LLM output |
|-----------|-----------|-------------|----------------|----------|
| `locked_fact_missing_value` | 2 | `clock_reading` | `"ten minutes past eleven"` | `"11:10 PM"` |
| `locked_fact_missing_value` | 16 | `clock_reading` | `"ten minutes past eleven"` | digit form |
| `locked_fact_missing_value` | 8 | `tamper_amount` | `"forty minutes"` | `"40 minutes"` |
| `locked_fact_missing_value` | 12 | `tamper_amount` | `"forty minutes"` | digit/approximate form |
| `locked_fact_missing_value` | 14 | `tamper_amount` | `"forty minutes"` | digit/approximate form |

These are the single largest category: 5 of the 11 major issues.

**Validator:** `physical-validator.ts` — `checkLockedFacts()`. Checks that each locked fact's canonical value string appears verbatim in the relevant chapter's text.

**Root cause:** The locked-facts prompt instructed verbatim reproduction and named paraphrase, approximation, and rounding as prohibited. However, it did not address the specific failure mode of **format conversion**: converting a word-phrased canonical value (`"ten minutes past eleven"`) to its digit equivalent (`"11:10 PM"`). The LLM treats this as a lossless representation, not as paraphrase, because the numerical meaning is identical. The existing `FAILURE EXAMPLE` used a digit-format canonical (`"at 11:47 PM"`) which inadvertently reinforced the notion that time values are typically expressed in digit format.

The `clock_reading` and `tamper_amount` locked facts are both word-phrased. Industry-period mystery prose (1920s country house) would naturally use written-out forms (`"ten minutes past eleven"`, `"forty minutes"`) — but the LLM converts to digit form in later chapters after initially writing the word form (ch1 passes, placing the clock correctly as `"ten minutes past eleven"` in para 2).

This is a persistent failure: identical conversion appears in ch2, ch8, ch12, ch14, ch16 — 5 of 18 chapters. The LLM does not consistently apply the format in later-chapter references.

**Fix applied (FIX-C):** Added `CRITICAL — WORD-PHRASED VALUES` block to the `lockedFactsBlock` system prompt section:

> *"If the canonical value is written out in words (e.g. a time like 'ten minutes past eleven', or an amount like 'forty minutes'), reproduce those exact words. DO NOT convert to digits, 24-hour format, or any other numeric form."*

**Post-fix bug found and corrected:** The existing `FAILURE EXAMPLE` only showed a digit-paraphrase failure (`"11:47 PM"` → `"just before midnight"`), still leaving a mixed signal. Updated the example to also demonstrate the word→digit failure case:

> *"…Equally, if the locked value is 'ten minutes past eleven' and you write '11:10 PM' or '11:10' — that is also a HARD FAIL. Words stay as words; digits stay as digits."*

### 5.4 Category D — no chapter title format requirement in output schema (1 major issue)

| Error type | Detail |
|-----------|--------|
| `chapter_title_inconsistency` | Mixed formats: `title-only`, `number-only` |

**Validator:** `chapter-validator.ts` — `checkTitleConsistency()`. Fires when the set of title format patterns across all chapters has `size > 1`.

**Root cause:** The `developer` output schema outputs chapters as `"title": "Chapter title"` — a format-free placeholder string. In the absence of an explicit format directive, the model uses inconsistent patterns: some chapters produce `"The Frozen Clock"` (title-only), others produce `"Chapter 7"` (number-only), others produce `"Chapter 3: The Library"` (the required format). Having more than one pattern across the 18 chapters fires one major validation error.

**Fix applied (FIX-D):** Added explicit format requirement to the Requirements section of the `developer` schema block:

> *"Chapter title format: EVERY chapter title MUST follow exactly 'Chapter N: [Descriptive title]'. Do NOT use number-only or title-only formats — mixed formats are a validation error."*

---

## 6. Moderate Issues (13 total)

### 6.1 `pronoun_drift` (7 instances)

| Character | Gender | Found in chapters |
|-----------|--------|------------------|
| Edgar Wingate | male | 6, 18 |
| Caroline Merton | female | 12 |
| Ernest Denison | male | 15 |
| Herbert Hewitt | male | 14, 18 |
| Christine Holt | female | 6, 10 |

Seven `pronoun_drift` issues. The pronoun repair system made extensive corrections pre-validation (see §4.2), but a subset escaped. The story-level `pronoun_drift` check uses a proximity-window scan different from the chapter-level repair, and some chapter-boundary or dialogue-nested cases are not covered by the regex repair.

Notable: Christine Holt (the POV/detective character) has drift errors in ch6 and ch10 — the character writing from whose perspective prose is narrated. This suggests either: (a) a secondary male character nearby is triggering the drift window, or (b) Christine is referenced in a reflexive or indirect construction the repair misses.

**No fix applied in current session.** The repair system is absorbing most errors; these 7 moderate issues (moderate severity, not major) are below the abort threshold independently.

### 6.2 `opening_style_repetition` (1 instance)

> `"Opening style 'general-descriptive' used in 16/18 chapters (89%) — exceeds 50% threshold."`

The model opens nearly every chapter with a general atmospheric description rather than varying between dialogue-open, time-anchor, character-action, noun-phrase-atmosphere, or other structural templates.

WARN-1 fix added explicit vocabulary lists to the generation prompt (forcing specific sensory/atmosphere words), which helps the opening-block content pass validation but does not enforce **structural** variety. Style diversity requires prompt-level instructions that name the alternative styles and assign some of them to specific chapters.

**Partial fix applied (WARN-1).** Opening-block vocabulary is now specified; structural style variety is not yet enforced.

### 6.3 `location_name_variant` (4 instances)

| Chapter | Found | Expected |
|---------|-------|---------|
| 8 | `library` | `Library` |
| 10 | `kitchen` | `Kitchen` |
| 11 | `drawing room` | `Drawing Room` |
| 12 | `kitchen` | `Kitchen` |

The LLM uses lowercase location names in the chapter `location` field rather than the canonical title-case names from the CML (`Drawing Room`, `Library`, `Kitchen`, `Garden Pathway`).

**No fix applied.** These are moderate severity; the location names are correct apart from capitalisation. Root cause is that the model does not quote-match against the canonical name list when filling the `location` field — it infers from context. A fix would add an explicit list of canonical location names to the chapter output schema requirements and/or the per-chapter `scene_grounding` checklist.

### 6.4 `fair_play_compliance` timing violation in chapter 10

Scored 85/100 (minor severity; did not prevent prose phase pass). A clue or reveal in chapter 10 occurs before the reader has been given sufficient setup. No fix applied; minor severity.

---

## 7. Minor Issues (8 total)

### 7.1 `context_leakage_suspected` (8 instances)

| Chapter | Sentence length | Pattern |
|---------|----------------|---------|
| 2 | 64 words | Room + country/estate + sensory enumeration |
| 7 | 59 words | Same pattern |
| 7 | 91 words | Same pattern |
| 9 | 91 words | Same pattern |
| 14 | 87 words | Same pattern |
| 17 | 67 words | Same pattern |
| 17 | 78 words | Same pattern |
| 18 | 69 words | Same pattern |

The validator identifies long sentences whose structure matches a location profile template — multi-clause sensory enumerations anchored to `[room name] in [estate/country house]`. These are suspected to be near-verbatim copies of location profile context text injected into the prose output.

This pattern appears in 7 of 18 chapters and is consistent with a model behaviour: when a chapter is set in a new location or opens a strongly location-grounded scene, the model anchors to the location profile verbatim rather than paraphrasing. The `context_leakage_suspected` validator fires on a length+structure heuristic and these individual cases may or may not be true copies (the validator explicitly notes they require manual verification).

**No fix applied.** Minor severity; not contributing to the abort.

---

## 8. Open Anomalies (Not in story-validation errors, but observed in runtime log)

### 8.1 Chapter 9 — prompt leakage on final attempt, used as-is

When ch9 exhausted all 4 attempts, the chapter's attempt-4 output was used as the final chapter prose. Attempt 4 was flagged for **both** prompt leakage (instruction-shaped prose) and a failed clue check. There is no blocking gate that prevents a prompt-leakage chapter from being used when retries are exhausted.

The story-validation gate that runs post-generation does not separately check for ch9 leakage — `context_leakage_suspected` fires at sentence length/structure heuristic level, but ch9's leakage was flagged during per-chapter generation validation (a different system). Story validation found ch9 clean. Either the attempt-4 text was partially cleaned before storage, or the retry loop's clue-validation is operating on slightly different text than story validation sees.

**Risk:** If the attempt-4 leakage text was persisted in the story output, the final prose has an inline instruction sentence in chapter 9 that would be visible to the reader.

### 8.2 `clue_early_1` present in expected set but not extracted

```
"clue_visibility_expected_ids": [  "clue_early_1", "clue_1", ... "clue_8" ]  →  9 expected
"clue_visibility_extracted_ids": [  "clue_1", "clue_2", ... "clue_8" ]           →  8 extracted
```

Agent 5 generated `clue_early_1` as part of the clue set (included in `clue_visibility_expected_ids`). The NSD clue tracker never confirmed it as visible in any chapter. The prose scoring counts this as `8/8 clues` (the expected count is recalculated to 8 after deducting `clue_early_1` from the denominator), so the scoring system passes. But `clue_early_1` was never placed by any chapter.

This suggests `clue_early_1` was either: (a) an early-observation redundancy clue with no assigned chapter in the narrative outline, or (b) embedded too subtly to be extracted by the NSD tracker. The clue distribution phase reported `8 clues distributed` (not 9), suggesting `clue_early_1` was designated as an implicit ambient clue rather than a scheduled chapter assignment.

### 8.3 Out-of-cast character names in chapter-level clue descriptions

The chapter-level self-evaluation JSON references `"Douglas Wyatt"` (ch7) and `"Philip Chalcott"` (ch8, ch9) in `required_clues_present` — characters who do not appear in the 5-person cast. This caused ch7 to fail twice and ch9 to fail all 4 attempts despite the underlying clue evidence being present in the prose (confirmed by the NSD tracker).

Root cause candidates:
- Agent 5 clue distribution produced clue descriptions that reference secondary or contextual characters not in the main cast
- The narrative outline assigned chapter-specific clue descriptions referencing non-main-cast names that the prose never introduced
- The clue description is a natural-language passage containing names that were plausible at planning time but were not used in prose generation

The NSD tracker confirms the logical clue is present; only the text-match check on the description string fails. This is a mismatch between how Agent 5 writes clue descriptions (referencing planner-phase character names) and how the prose actually manifests the evidence.

---

## 9. Fix Status Register

### Applied in current session

| Fix ID | Category | Issues addressed | Files changed |
|--------|---------|-----------------|--------------|
| **FIX-A** | A — BRIDGE_TERMS | `missing_case_transition_bridge` ×2, `case_transition_missing` ×1 | `narrative-continuity-validator.ts`, `case-transition-validator.ts` |
| **FIX-B** | B — Weather evidence | `weather_incompatible_evidence` ×2 | `physical-validator.ts` |
| **FIX-C** | C — Locked facts | `locked_fact_missing_value` ×5 | `agent9-prose.ts` |
| **FIX-D** | D — Chapter titles | `chapter_title_inconsistency` ×1 | `agent9-prose.ts` |
| **WARN-1** | — | Opening-block sensory/atmosphere vocabulary | `agent9-prose.ts` |
| **BUG-1** | FIX-B follow-up | `isOutdoor` over-constrained; validator may never fire true positives | `physical-validator.ts` |
| **BUG-2** | FIX-C follow-up | FAILURE EXAMPLE missing word→digit case | `agent9-prose.ts` |
| **BUG-3** | FIX-B follow-up | `hasTraceEvidence` missing `\b` after `footprint` and `fiber` | `physical-validator.ts` |
| **Bug (FIX-A)** | FIX-A follow-up | `found/discovered\s+dead` misses `found [name] dead` | `narrative-continuity-validator.ts`, `case-transition-validator.ts` |

All applied and verified: **368 tests pass, exit 0**.

### Open — not yet addressed

| ID | Severity | Issue | Root cause |
|----|----------|-------|-----------|
| **OPEN-1** | Moderate | `pronoun_drift` ×7 | Repair system absorbs most errors; story-level scanner catches remaining edge cases (dialogue proximity, cross-sentence boundary). Would require expansion of the repair patterns or a post-prose pass. |
| **OPEN-2** | Moderate | `opening_style_repetition` (16/18 chapters same style) | Vocabulary is now forced (WARN-1); structural style variety (dialogue-open, time-anchor, etc.) not yet enforced at generation time. Needs chapter-type assignment in the checklist alongside vocabulary. |
| **OPEN-3** | Moderate | `location_name_variant` ×4 | LLM infers location names without matching against canonical list. Fix: add canonical location names to per-chapter schema output requirement. |
| **OPEN-4** | Minor | `context_leakage_suspected` ×8 | LLM copies location profile template sentences verbatim rather than paraphrasing. Heuristic detection; root sentence structure when location-grounding occurs. |
| **OPEN-5** | Anomaly | Ch9 prompt leakage on final failed attempt used as chapter prose | No blocking gate prevents leakage text from persisting when retries exhausted. Would require: (a) force-blank failed-retry outputs, or (b) add a post-generation leakage scan before story storage. |
| **OPEN-6** | Anomaly | Out-of-cast character names in clue descriptions cause unfulfillable chapter validation | Agent 5 may produce clue descriptions referencing planner-phase character names not in prose. Fix: ensure clue description text uses only cast-listed names, or match on semantic clue ID rather than description text in chapter self-evaluation. |
| **OPEN-7** | Informational | `clue_early_1` never surfaced in NSD tracker | Ambient/implicit clue not assigned to any chapter; invisible to extraction. Assert expected clue IDs against distributed clue IDs in Agent 5 output, or remove `clue_early_1` from the expected set if it has no chapter assignment. |

---

## 10. Projected Major-Issue Count Post-Fix

| Category | Pre-fix majors | Expected post-fix |
|----------|---------------|-------------------|
| A — Bridge terms | 3 | 0 (regex now covers natural bridge phrases including `found [name] dead`) |
| B — Weather evidence | 2 | 0 (sentence-level check eliminates cross-paragraph false positives) |
| C — Locked facts | 5 | Reduced; word-form canonical now explicitly protected. Recurrence possible if LLM ignores instruction — monitor |
| D — Chapter titles | 1 | 0 (explicit format directive added) |
| **Total** | **11** | **~1–2** (residual C risk only) |

With 11 majors eliminated to ≤2, the `major > 5` abort threshold would no longer fire. The remaining risk is in Category C (word-form locked facts) if the LLM continues to convert formats despite the updated prompt.

---

## 11. Phased Implementation Plan (Open Items)

This section defines the sequenced implementation plan for all items still open after the current session's fixes (FIX-A through BUG-3). Items are grouped into three phases by urgency and abort-risk. The session fixes (§9 "Applied") are complete and are not re-listed here.

---

### Phase 1 — Abort-risk elimination (implement before next run)

These items carry direct risk of causing the next run to abort or producing corrupted story output visible to readers.

#### 1a — OPEN-6: Out-of-cast character names in clue description validation

**Issue:** Agent 5 produces clue descriptions that reference character names (e.g. `"Douglas Wyatt"`, `"Philip Chalcott"`) that do not exist in the main cast. The chapter-level self-evaluation JSON in the prose generation loop checks for the description string verbatim in the chapter text. Because those names never appear in the prose, every check fails — causing repeated retries that exhaust the retry budget and, as in ch9 of this run, ultimately produce prompt leakage.

**Acceptance criteria:** Chapter-level clue self-evaluation passes when the logical clue evidence is present in prose, even if the clue description text contains non-prose character names. No chapter should exhaust its retry budget on a description-string mismatch alone.

**Owner area:** `apps/worker` (chapter self-evaluation / clue-presence check), `packages/prompts-llm` (Agent 5 clue distribution prompt)

**Approach options (choose one before implementation):**
1. **Preferred — ID-based matching:** Replace the raw description-string match in the chapter self-evaluation with a semantic clue ID match. If the NSD tracker has confirmed `clue_X` is present, treat self-evaluation as passed for that clue ID regardless of description text.
2. **Alternative — Cast-name constraint on Agent 5:** Add an explicit constraint to the Agent 5 prompt: *"All character names appearing in clue descriptions must be drawn exclusively from the main cast list provided. Do not reference secondary, contextual, or planner-phase-only characters."* Weakens if LLM ignores; more fragile than option 1.

**Estimated complexity:** Medium (option 1: modify self-eval lookup logic and NSD reconciliation); Low (option 2: prompt-only)

---

#### 1b — OPEN-5: Chapter with prompt leakage on exhausted retries used as final output

**Issue:** When a chapter batch exhausts all retries, the last attempt is used as the final chapter prose even if it was flagged for prompt leakage (instruction-shaped text visible in the narrative). No blocking gate prevents this. Ch9 in this run was persisted with a known leakage failure; story-level validation did not catch it because the story-level `context_leakage_suspected` check uses a length+structure heuristic that differs from the chapter-generation leakage detector.

**Acceptance criteria:** No chapter that has been positively flagged for prompt leakage during per-chapter generation validation is ever written to the story store. On retry exhaustion, the chapter must be either: (a) force-blanked and the run marked `needs_revision` with `prompt_leakage_persisted` in the abort reason, or (b) subjected to a final post-generation leakage scan before the story is written.

**Owner area:** `apps/worker` (retry exhaustion handler, story assembly path)

**Approach:** Add a post-retry-exhaustion guard: if the accepted attempt's `validation_flags` includes `prompt_leakage`, set `chapterLeakageDetected = true` before writing. In the story assembly loop, if any chapter has `chapterLeakageDetected`, abort with `prompt_leakage_persisted` abort reason and do not persist the story.

**Estimated complexity:** Low–Medium (add one flag-check in the retry-exhaustion path and one pre-persist check in the assembly loop)

---

#### 1c — Category C residual: Word-form locked fact conversion not blockable by prompt alone

**Issue:** FIX-C added a prompt instruction to prevent digit conversion of word-phrased locked values. Prompt instructions are advisory; the LLM converted the same `clock_reading` value across 5 of 18 chapters in this run despite an existing verbatim-reproduction directive. If the LLM ignores the new instruction, Category C will still produce multiple major issues in subsequent runs.

**Acceptance criteria:** Post-generation story-validation `locked_fact_missing_value` major count for word-phrased locked facts is 0. If any word-phrased locked fact has been converted to digit/numeric form in a chapter, it is caught and either repaired or flagged before the story-validation gate is run.

**Owner area:** `packages/story-validation` or `apps/worker` (post-prose, pre-validation repair pass)

**Approach:** Implement a deterministic post-prose repair for locked facts with word-phrased canonical values:
1. After prose generation completes, iterate all locked facts whose canonical value is a word-phrased time (e.g. `"ten minutes past eleven"`) or a word-form quantity — i.e. a recognised number-word followed by any unit word (e.g. `"forty minutes"`, `"seven inches"`, `"three shots"`).
2. For each such fact, scan relevant chapters for the digit-form equivalent and replace with the canonical word form.
3. If replacement count exceeds a threshold (>3 per chapter), emit a warning to the diagnostics log.

This is deterministic, fully data-driven on the actual run's locked-fact values, requires no LLM call, and cannot be ignored. No hardcoded story-specific strings are used — the repair patterns are built at runtime from each story's `fact.value`.

**Estimated complexity:** Medium (parser-based post-prose pass; requires the locked-fact canonical values to be accessible in the assembly path)

**Status: IMPLEMENTED**
- `WORD_TO_NUM` extended to cover forty through sixty and all compound forms.
- `parseWordFormQuantity` added (replaces the earlier narrower `parseWordFormDuration`): recognises `"[word-number] [any-unit]"` patterns — minutes, hours, seconds, feet, inches, yards, shots, pounds, and any other single-word unit. No hardcoded unit whitelist.
- Unit pattern building updated: regular plurals (e.g. `"minutes"` → `minutes?`) match both singular and plural digit forms; irregular plurals (e.g. `"feet"`) use exact-word match to avoid invalid stems.
- `repairWordFormLockedFacts` extended: builds digit-form patterns for any word-phrased quantity alongside the existing time-of-day patterns; per-chapter `console.warn` emitted when chapter replacement count > 3.
- 19 tests in `apps/worker/src/__tests__/agent9-locked-facts.test.ts` covering time repair (regression), quantity repair (duration, distance, count, weight), chapter scoping, per-chapter warning threshold, and edge cases. All 66 worker tests pass, clean build.

---

### Phase 2 — Moderate quality fixes (implement within 1–3 runs)

These items produce moderate-severity story-validation issues that do not individually trigger the abort threshold, but accumulate toward it and degrade story quality.

#### 2a — OPEN-1: Pronoun drift surviving the repair system (7 moderate issues)

**Status: IMPLEMENTED**

**Root cause identified:** The proximity-window scanner in `prose-consistency-validator.ts` was matching wrong-gender pronouns that appeared *inside quoted dialogue* (e.g. a female character saying `"He was rude to me"` near her own name, triggering a false `pronoun_drift` for her). The competitor guard was also open to dialogue suppression — a competitor's name quoted in another character's speech could suppress a real drift detection.

**Fix applied:** Added `stripDialogueFromWindow()` helper in `prose-consistency-validator.ts` that strips balanced straight (`"..."`) and curly (`“...”`) quote pairs from the window text before the wrong-pronoun regex test. Applied identically to the competitor-guard window so competitor names inside dialogue cannot suppress genuine narrative drift.

**Files changed:**
- `packages/story-validation/src/prose-consistency-validator.ts` — `stripDialogueFromWindow()` helper + two call sites in `checkPronounDrift()`
- `packages/story-validation/src/__tests__/pronoun-repair.test.ts` — 4 new `ProseConsistencyValidator` pronoun-drift tests (false-positive suppression + true-positive retention)

**Known limitation (documented):** Cross-paragraph-boundary pronoun inheritance is a separate gap not addressed here. The repair system's forward-only regex cannot track an antecedent established in the last sentence of the previous paragraph. This is out of scope for this fix to avoid over-aggressive repair.

**Issue:** The per-chapter deterministic repair system corrects most pronoun errors pre-validation, but 7 `pronoun_drift` moderate issues were found by the post-generation story-level scanner in this run. The story-level scanner uses a proximity-window scan that differs from the chapter-level repair's forward-only regex. Edge cases include: pronoun drift nested in dialogue, pronoun drift across sentence boundaries, and reflexive/indirect constructions involving the detective POV character.

**Acceptance criteria:** Post-generation story-validation `pronoun_drift` moderate count ≤ 1 for a well-formed cast.

**Owner area:** `apps/worker` (pronoun repair patterns), `packages/story-validation` (pronoun drift validator)

---

#### 2b — OPEN-2: Opening style repetition (16/18 chapters same structural template)

**Status: IMPLEMENTED**

**Fix applied:** Added `OPENING_STYLE_ROTATION` constant (6 entries) at module level in `packages/prompts-llm/src/agent9-prose.ts` and rewrote `buildSceneGroundingChecklist()` to inject a per-chapter opening-style directive into the `SCENE GROUNDING CHECKLIST` prompt block. The style index is `(chapterNumber - 1) % 6`, keyed on the absolute chapter number so multi-batch generation gets stable, non-repeating assignments.

The 6 styles are: `character-action`, `dialogue-open`, `time-anchor`, `noun-phrase-atmosphere`, `temporal-subordinate`, `general-descriptive`. For an 18-chapter story, each style appears exactly 3 times (17% each), well under the 50% validator threshold.

All directives are labelled `OPENING STYLE (HARD)` so they are treated as schema-enforced requirements alongside the existing checklist items.

**Files changed:**
- `packages/prompts-llm/src/agent9-prose.ts` — `OPENING_STYLE_ROTATION` const + rewritten `buildSceneGroundingChecklist()`

**Issue:** WARN-1 hardened the vocabulary used in opening blocks (forcing specific sensory/atmosphere terms) but did not address structural variety. 89% of chapters use the `general-descriptive` opening structure, which exceeds the 50% threshold and fires a moderate `opening_style_repetition` validation issue.

**Acceptance criteria:** Post-generation story-validation `opening_style_repetition` count = 0; no single opening style accounts for more than 50% of chapters.

**Owner area:** `packages/prompts-llm` (Agent 9 prose generation prompt, per-chapter checklist)

---

#### 2c — OPEN-3: Location name capitalisation variants (4 moderate issues)

**Status: IMPLEMENTED**

**Fix applied:** Added a `locationCapitalisationBlock` section to `buildSceneGroundingChecklist()` in `packages/prompts-llm/src/agent9-prose.ts`. When the CML has location profiles, the block is injected between the known-location line and the per-chapter checklist entries. It lists all canonical location names from `cml.locationProfiles` and labels the requirement `HARD REQUIREMENT — validated`.

Example injected text:
```
LOCATION NAME CAPITALISATION (HARD REQUIREMENT — validated):
All named locations in your prose MUST use the EXACT capitalisation from the CML profiles.
Canonical forms: "Drawing Room", "Billiard Room", "East Wing"
Writing a location in lowercase (e.g. "drawing room" instead of "Drawing Room") is a validated error.
Every time you mention a named location, copy its capitalisation from the list above.
```

The block is absent (empty string) when no location profiles are present, so prompt size is not affected for stories without explicit locations.

**Files changed:**
- `packages/prompts-llm/src/agent9-prose.ts` — `locationCapitalisationBlock` in `buildSceneGroundingChecklist()`

**Issue:** The LLM infers location names in the chapter `location` field from narrative context rather than quoting against a canonical list. This produces lowercase variants (`library`, `kitchen`, `drawing room`) that fail the `location_name_variant` validator.

**Acceptance criteria:** Post-generation story-validation `location_name_variant` count = 0; all chapter `location` field values exactly match one entry in the CML canonical location name list.

**Owner area:** `packages/prompts-llm` (Agent 9 prose output schema requirements block)

---

### Phase 3 — Hardening and polish (implement opportunistically)

These items have minor severity or informational status and do not affect the abort gate in current runs. Implement alongside other Phase 2 work or as standalone hardening passes.

#### 3a — OPEN-4: Context leakage suspected (8 minor instances)

**Issue:** 7 of 18 chapters contain long sentences (59–91 words) whose structure matches location profile template text (multi-clause sensory enumerations anchored to `[room] in [estate]`). The validator flags these as suspected verbatim copies of location profile context injected into prose. True-positive rate is unknown; manual verification is required for each instance.

**Acceptance criteria:** `context_leakage_suspected` minor count ≤ 2 per run; confirmed true positives = 0.

**Owner area:** `packages/prompts-llm` (Agent 9 location-grounding instruction), `packages/story-validation` (leakage heuristic threshold)

**Approach (two-pronged):**
1. Add an Agent 9 instruction: *"When opening a scene in a new location, paraphrase the location description in fresh language. Do not reproduce the exact phrasing from the location profile. Sensory details should feel observed by the POV character, not stated as fact."*
2. Tighten the `context_leakage_suspected` heuristic: require both length threshold AND a structural match against the actual location profile strings (literal substring match against injected context), rather than the current length+pattern heuristic alone.

**Estimated complexity:** Low (prompt instruction); Medium (substring-match heuristic update)

**Status: IMPLEMENTED**
- `packages/prompts-llm/src/agent9-prose.ts` (`sensoryGuidance` block): reworded instruction to clarify paraphrasing is desired but sentence structure must not be reproduced; added explicit POV-observation scene-opening rule.
- `packages/prompts-llm/src/agent9-prose.ts` (USAGE GUIDELINES, guideline 1): rewrote to align with the new rule — "Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities." (The original text "Use full sensory description from profiles" contradicted the new SCENE OPENING RULE.)
- `packages/story-validation/src/prose-consistency-validator.ts` (Pattern 2): raised word threshold from 40 to 55; three independent signals required: (1) room noun, (2) sensory-category noun, (3) structural template marker `"the [smell|scent|...] of <word>"` OR country/estate noun. The structural marker directly targets the multi-clause enumeration pattern of profile paragraphs and does not fire on natural character-POV prose.
- Tests: 4 new tests in `pronoun-repair.test.ts` covering true-positive (template structure; country+estate) and false-positive (long atmospheric prose without room/template signals; under-threshold sentence). 201/201 story-validation tests passing.

---

#### 3b — OPEN-7: `clue_early_1` unassigned in NSD tracker

**Issue:** `clue_early_1` appeared in `clue_visibility_expected_ids` but was never confirmed by the NSD tracker and was not included in the Agent 5 distributed clue count (8 distributed, not 9). The scoring system compensates by recalculating the expected set to exclude it, but the expected-vs-distributed mismatch is a latent consistency gap.

**Acceptance criteria:** No clue ID appears in `clue_visibility_expected_ids` that is not present in the Agent 5 `distributed_clue_ids` output. Any ambient/implicit clue designated without a chapter assignment must be excluded from the expected set at source.

**Owner area:** `apps/worker` (clue expected-set construction), `packages/prompts-llm` (Agent 5 clue distribution output schema)

**Approach:** After Agent 5 completes, assert: `clue_visibility_expected_ids ⊆ distributed_clue_ids`. Any ID in expected but not in distributed should be removed from the expected set with a diagnostics warning. If the intent is that `clue_early_1`-style ambient clues are always excluded from chapter distribution, update Agent 5's output schema to place them in a separate `ambient_clue_ids` field that is never added to the expected visibility set.

**Estimated complexity:** Low (assertion + field rename in Agent 5 output schema)

**Status: IMPLEMENTED**
- `apps/worker/src/jobs/agents/agent9-run.ts` (`getExpectedClueIdsForVisibility`): When `clueDistribution` is present and non-empty, the function returns `distributionIds ∪ discriminatingIds`. Any registry or mapping ID not in `distributionIds` is logged via `console.warn` but excluded. When `clueDistribution` is absent or empty (called before Agent 5 has run), the function falls back to the full `mappingIds ∪ discriminatingIds ∪ registryIds` union to avoid dropping the expected set in pre-distribution contexts. `discriminatingIds` are always kept (fair-play requirement).
- Tests: 5 new tests in `agent9-locked-facts.test.ts` covering: ambient IDs excluded, discriminating IDs always kept, empty inputs, fallback when distribution is absent, deduplication. 70/70 worker tests passing.

---

#### Post-implementation bug review — Phase 3

Four bugs found and corrected after initial Phase 3 implementation:

**Bug B3-1 (3b — redundant intermediate variables):** The initial implementation built `reconciledMappingIds` and `reconciledRegistryIds` by filtering `mappingIds`/`registryIds` to only IDs present in `distributedSet`, then unioned them with `distributionIds`. Because both are strict subsets of `distributionIds` by construction, adding them to the union added no new IDs — the variables were dead code. Corrected by removing the filter variables and returning `Set([...distributionIds, ...discriminatingIds])` directly, making the logic explicit and readable.

**Bug B3-2 (3b — fallback regression when distribution absent):** No guard was placed on the reconciliation path. When `clueDistribution` is `undefined` or its `clues` array is empty (e.g., when called before Agent 5 has run, or in validation-only pipelines), `distributionIds.length === 0` would cause all `mappingIds` and `registryIds` to be silently excluded, leaving only `discriminatingIds` in the expected set — a hard regression from pre-fix behaviour. Corrected by adding an explicit guard: `if (distributionIds.length === 0) return full union`. A dedicated test covers this path.

**Bug B3-3 (3a — inaccurate validator comment):** The Pattern 2 block comment stated "Four signals required" but the actual condition checks three: `hasLocationRoom`, `hasSensoryEnum`, and `(hasTemplateStructure || hasCountryOrEstate)`. When `hasTemplateStructure` alone fires, `hasSensoryEnum` is always simultaneously satisfied (the template marker regex contains a sensory word), reducing it to two decisions on that branch. Corrected the comment to accurately describe the three-signal gate.

**Bug B3-4 (3a — prompt internal contradiction):** USAGE GUIDELINE 1 in the `locationProfilesContext` block still read "First mention of location: Use full sensory description from profiles" — directly contradicting the new SCENE OPENING RULE added immediately after, which requires POV-character-observed detail rather than profile text reproduction. The LLM received conflicting instructions in the same prompt. Corrected by rewriting GUIDELINE 1 to align: "Ground the scene using sensory details drawn from the profiles — paraphrase these into what the POV character directly observes and experiences, not a summary of the room's general qualities."

---

### Phase summary

| Phase | Items | Abort risk addressed | Complexity | Priority |
|-------|-------|---------------------|------------|----------|
| **1** | OPEN-6, OPEN-5, C-residual | Direct (retry exhaustion → leakage; word-form conversion → majors) | Low–Medium | **Before next run** |
| **2** | OPEN-1, OPEN-2, OPEN-3 | Indirect (moderate accumulation) | Low–Medium | Within 1–3 runs |
| **3** | OPEN-4, OPEN-7 | None (minor/informational) | Low–Medium | Opportunistic |

# ANALYSIS_48 — Run `run_53ca3465` Full Issue Audit

**Date:** 2026-04-07  
**Run:** `run_53ca3465-cd5a-4543-b078-db8f49fcda01`  
**Project:** `proj_ad40f0ae-8fc6-414e-98c0-f1eb148f869e` ("Project 09")  
**Started:** 2026-04-06T20:26:56.177Z  
**Completed:** 2026-04-06T20:38:02.759Z  
**Duration:** 11 min 6 sec (666,582 ms)  
**Outcome:** FAILED — `"Story validation failed: 0 critical, 8 major issues"`  
**Scoring:** A / 99.86 (pipeline phases all pass, aborted by post-generation validation gate)  
**Cost:** $0.065  
**Source files:**
- `apps/worker/logs/run_run_53ca3465-cd5a-4543-b078-db8f49fcda01.json`  
- `apps/api/data/reports/proj_ad40f0ae-8fc6-414e-98c0-f1eb148f869e/run_53ca3465-cd5a-4543-b078-db8f49fcda01.json`  
**Prior refs:** ANALYSIS_47 (run_43a28c8d — same locked-fact pattern), ANALYSIS_44 (run_bbf9e661)

---

## 1. Outcome Summary

| Metric | Value |
|--------|-------|
| Status | failed (aborted) |
| Validation gate | **0 critical, 8 major**, 21 moderate, 14 minor (43 total) |
| Chapters generated | 19 (all completed) |
| Total words (chapter-level) | 16,255 |
| Total words (post-atmosphere-repair, prose score) | 18,012 |
| Total cost | $0.065 |
| Era | November 1944 |
| Cast size | 5 characters (3 eligible suspects) |
| Abort cause | Post-generation validation gate: major (8) > threshold |

---

## 2. Pipeline Stage Summary

All 14 pipeline stages completed. The abort occurred only at the final post-generation validation gate.

| Stage | Outcome | Notable |
|-------|---------|---------|
| Setting | ✅ | 4 locations, November 1944 |
| Cast | ✅ | 5 characters, 3 suspects |
| Background context | ✅ (98/A) | Weakest scoring phase |
| Hard logic devices | ✅ | 5 devices, 4 unique types |
| CML | ✅ | Retry on attempt 1 (0 inference_path steps) |
| Novelty | ⏭ skipped | threshold ≥ 1.0 |
| Clues | ⚠ regen | Coverage-gap regen triggered (see §4.1) |
| Fair play | ✅ | Blind reader: PASS |
| Character profiles | ✅ | 5 profiles |
| Location profiles | ✅ | 3 locations |
| Temporal context | ✅ | November 1944 |
| World builder | ✅ | 2 LLM passes |
| Narrative | ⚠ fixed | Clue pacing: 5/19 → deterministic pre-assignment → 12/19 |
| Prose | ⚠ retries | 4/19 batches required retry |
| Validation | ❌ fail | 0 critical, 8 major → abort |

---

## 3. Story Configuration

| Property | Value |
|----------|-------|
| **Era** | November 1944 (WWII-era) |
| **Cast size** | 5 characters |
| **Eligible suspects** | 3 |
| **Locations** | 4 |
| **Scenes / chapters** | 19 |
| **Clue count in scenes** | 12/19 (after deterministic pre-assignment) |
| **Hard logic device** | Clock wound back; key locked facts: clock face → `"ten minutes past eleven"`, tamper amount → `"forty minutes"`, witness noise time → `"eleven o'clock"`, tea temperature → `"98 degrees Fahrenheit"` |
| **Characters named in validation errors** | Maurice Woodbridge (male), Frederick Jevons (male), Sarah Wingate (female), Edith Fairfax (female) |

---

## 4. Pre-Prose Pipeline Issues

### 4.1 Clue inference coverage — critical gap (triggered regen)

Three coverage warnings fired during Agent 5/6:

1. `[warning]` — 2 red herrings may accidentally support the true solution
2. `[critical]` — **Discriminating test references no evidence found in the clue set**
3. (Implicit) Back-fill recovery: CML gate filled 8 essential clues programmatically

The critical gap triggered automatic clue regeneration. The second pass resolved enough to proceed but the back-fill of 8 clues means much of the clue set is mechanically assigned rather than LLM-authored. This increases the risk of loose narrative grounding for those clues in prose.

### 4.2 CML generation — first attempt produced 0 inference_path steps

```
ERROR: CML generation produced 0 inference_path steps (minimum 3 required).
The LLM must produce concrete inference steps — placeholder injection is no longer supported.
```

Attempt 2 succeeded. This is a recurring fragility in Agent 3 and was also noted in ANALYSIS_44 §2. The LLM occasionally produces a structural skeleton without populating `inference_path`. The retry guard catches this correctly.

### 4.3 Outline clue pacing — deterministic pre-assignment

`"Outlined clue pacing below threshold: 5/19 scenes carry clues (minimum 12). Applying deterministic clue pre-assignment."`

Agent 7 scheduled clues in only 5/19 scenes (26%). Deterministic pre-assignment brought this to 12/19 without needing an LLM retry (using 3 gap-fill + 2 threshold-fill mappings). Mechanically assigned scenes carry the same risk documented in ANALYSIS_47 §4.3: no LLM-authored setup for the clue means the prose model must invent a context, which increases clue-absent chapter failures on first attempt.

---

## 5. Prose Generation — Batch Retry Log

| Chapter | Attempts | Failure reason | Resolved |
|---------|----------|----------------|---------|
| 1 | **4** | Clue evidence "heard a loud noise at 8:30 PM" must appear in paragraphs 1–2 (3 consecutive failures) | ✅ attempt 4 |
| 3 | 2 | Same clue, paragraph placement | ✅ attempt 2 |
| 7 | 2 | "The watch indicates death occurred around this time…" absent | ✅ attempt 2 |
| 16 | 2 | Same watch clue absent | ✅ attempt 2 |

### Chapter 1 — 3 consecutive paragraph-placement failures

All three failures produced identical diagnostics: word count 903, not truncated, but the clue evidence appeared in paragraph 3 (not paragraphs 1–2 as required). The fourth attempt resolved it (with only 1 pronoun replacement vs 5 on attempts 1–3, suggesting meaningfully different output).

Three consecutive identical failures for a paragraph-placement constraint is the same pattern seen in ANALYSIS_47 §5.3 (ch17 atmosphere grounding: 3 consecutive failures). In both cases the model is stuck in a local attractor where it places the target content just outside the acceptable window.

### Chapters 7, 16 — watch-clue absence (two separate occasions)

The same clue ("The watch indicates death occurred around this time, prior to the clock's reading") was absent in both chapters 7 and 16. This clue was presumably assigned to multiple scenes by the deterministic pre-assigner (§4.3). Each case resolved on attempt 2. The repeated failure across two chapters suggests the scene context for these two chapters did not organically accommodate this clue, consistent with mechanical pre-assignment.

---

## 6. CRITICAL FINDING — CML Logical Inconsistency: Witness Time

**This is the root cause of all 3 `witness_time` locked-fact major failures.**

The CML contains a contradictory definition of the witness-time clue:

| Source | Value |
|--------|-------|
| Clue description (as given to Agent 9 prose) | `"Witness states they heard a loud noise at **8:30 PM**."` |
| Locked fact canonical value (`witness_time`) | `"eleven o'clock"` |

These two values are mutually exclusive. The prose generator writes `"8:30 PM"` (from the clue description it was given), but the validator checks for the locked-fact canonical value `"eleven o'clock"`. The prose can never simultaneously satisfy both.

**Consequence:**
- Every chapter that contains the witness-time clue will fail `locked_fact_missing_value` regardless of how well the LLM writes it.
- In this run: chapters 1, 3, and 5 all trigger this major failure.
- The chapter 1 retry debacle (4 attempts over paragraph placement) is compounding noise — the underlying clue is already inconsistently defined.

**Origin:** Agent 3 (CML Generator) or the post-processing back-fill (§4.1) produced a locked fact whose canonical value does not match the provided clue description. This is either:
  - (a) The LLM wrote a clue description with "8:30 PM" and separately defined the locked fact as "eleven o'clock" without cross-checking them, or
  - (b) A back-filled clue overrode or mismatched an existing locked fact.

**This is a pipeline correctness bug, not an LLM prose problem.** A gate should verify that all locked fact canonical values appear verbatim (or as word-forms) in at least one clue description field before prose generation begins.

---

## 7. Major Validation Issues (8 total → abort)

All 8 majors are `locked_fact_missing_value`. No other severity category.

| # | Locked fact | CML reference | Canonical value | Chapters affected |
|---|------------|---------------|-----------------|------------------|
| 1 | Clock face reading | `lockedFacts[clock_reading]` | `"ten minutes past eleven"` | 5 |
| 2 | Clock tamper amount | `lockedFacts[tamper_amount]` | `"forty minutes"` | 4, 7, 13 |
| 3 | Tea temperature | `lockedFacts[beverage_temperature]` | `"98 degrees Fahrenheit"` | 9 |
| 4 | Witness noise time | `lockedFacts[witness_time]` | `"eleven o'clock"` | 1, 3, 5 |

**Note on `witness_time`:** See §6 — this is a CML logical inconsistency, not a prose failure.

**Note on `tamper_amount` and `clock_reading`:** These are the same failures seen in ANALYSIS_44 and ANALYSIS_47. The LLM writes `"40 minutes"` or `"10:11"` (digit form) instead of the canonical word-phase value. FIX-C from ANALYSIS_44 (word-phrased value preservation in locked-facts prompt) is either not yet in effect or has not fully suppressed the digit-conversion behaviour.

---

## 8. Full Issue Set

| Severity | Count | Breakdown |
|----------|-------|-----------|
| Critical | 0 | — |
| **Major** | **8** | `locked_fact_missing_value` ×8 |
| Moderate | 21 | `pronoun_drift` ×8, `location_name_variant` ×12, `opening_style_repetition` ×1 |
| Minor | 14 | `context_leakage_suspected` ×14 (all chapters) |
| **Total** | **43** | |

### 8.1 Pronoun drift (8 moderate)

| Character | Gender | Chapters |
|-----------|--------|----------|
| Maurice Woodbridge | male (he/him) | 4 |
| Frederick Jevons | male (he/him) | 2, 5 |
| Sarah Wingate | female (she/her) | 12, 14 |
| Edith Fairfax | female (she/her) | 2, 10, 12 |

Edith Fairfax and Frederick Jevons are co-present in ch2. Maurice Woodbridge and another character are co-present in ch4. Cross-character pronoun proximity in the same chapter is a consistent trigger across multiple runs (ANALYSIS_47 §6.2).

### 8.2 Location name variants (12 moderate)

Two locations are affected: **The Cellar** and **The Drawing Room**. In every case the prose writes a lowercase article-form (`"the cellar"`, `"the drawing room"`, `"the Drawing Room"`). The canonical forms require capitalisation. Location normaliser (FIX-G) targets exact-match registry lookups — if the prose produces `"the Drawing Room"` (mid-article lowercase T, capitalised D), this may not match the normaliser's entry.

| Location | Non-canonical form(s) | Chapters |
|----------|-----------------------|---------|
| The Cellar | `"the cellar"` | 3, 5, 6, 9, 12, 15, 17 |
| The Drawing Room | `"the drawing room"`, `"the Drawing Room"` | 4, 7, 9, 15, 16 |

**12 instances across 11 chapters**. This is the highest volume moderate-issue category. The normaliser fix (FIX-G, single-pass combined regex) should catch these — but the location_name_variant validator fires regardless of whether normalisation was applied. Either normalisation is not running in this path, or the validator runs before normalisation.

### 8.3 Opening style repetition (1 moderate)

`"general-descriptive"` used in 11/19 chapters (58%) — chapters 1, 4, 5, 7, 9, 10, 11, 12, 16, 18, 19. Previous runs show the same pattern. The LLM defaults to general descriptive openings when scene context does not strongly imply an alternative.

### 8.4 Context leakage suspected (14 minor)

Suspected context leakage in chapters 1, 2, 3, 4, 6, 7, 9, 12, 13, 14, 15, 16, 17, 18 — all flagging a 61–98-word sentence matching "room + sensory enumeration" patterns from the location profile template. This is a near-universal signal across all runs. The sentences may be legitimate atmospheric description, but the validator flags them correctly as needing manual verification.

---

## 9. Underflow Expansion — New Behaviour

| Metric | run_43a28c8d (prev) | run_53ca3465 (this) |
|--------|--------------------|--------------------|
| Preferred-miss misses | 22 | 25 |
| Hard-floor misses | 0 | 0 |
| Expansion attempts | **18** | **0** |
| Chapter word range | 978–1534 | 647–1244 |

Expansion fired 0 times despite all 19 chapters falling below the preferred word target (1,600 for medium). This is consistent with the `preferred_miss_expansion_ratio: 0.85` fix being active: the threshold is `1600 × 0.85 = 1360 words`. Yet the highest chapter in this run is 1,244 words — still below 1,360 — which would normally still trigger expansion under the new threshold.

**Open question:** Why did expansion not fire? Possible explanations:
- The fix code path gated expansion via `obligationPreferredWords > 0` check, and the ledger entry was somehow absent for these chapters.
- Expansion was already disabled in a config override between the two runs.
- The app was running a different compiled version.

This behaviour should be confirmed by inspecting the per-chapter evaluation logs. The short chapter word counts (647, 687, 705 words) suggest these chapters would have benefited from expansion, so if expansion is now permanently suppressed this is a regression.

---

## 10. Score Summary — All Phases Passed

Despite the abort, the pipeline scoring gave every phase 100/A except Background Context (98/A).

| Phase | Score | Grade | Passed |
|-------|-------|-------|--------|
| Setting Refinement | 100 | A | ✅ |
| Cast Design | 100 | A | ✅ |
| Background Context | 98 | A | ✅ |
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

The 99.86 score with a failed outcome is correct: the scoring system evaluates structural quality of each phase output, while the validation gate enforces a hard stop on locked-fact and major-issue counts. The two systems are orthogonal.

---

## 11. Issue Classification and Remediation

### §11.1 [NEW] CML locked-fact / clue-description mismatch gate

**Root cause:** Agent 3 (or back-fill) produces CMLs where a locked fact's `canonicalValue` and the associated clue's `description` specify different values for the same physical fact.

**Proposed fix:** Add a post-CML validation gate that cross-checks every locked fact's `canonicalValue` against the clue descriptions for related clues. If the canonical value (or its word-form equivalent) does not appear in any related clue description, fail the CML stage and request a retry with explicit correction feedback.

**Files:** `apps/worker/src/jobs/agents/agent3-run.ts` (CML validation gate), `packages/story-validation/src/` (new validator)

**Priority:** S1 High — this directly caused 3 of the 8 majors in this run (the `witness_time` failures) and the 3-attempt ch1 prose deadlock.

### §11.2 [REGRESSION CANDIDATE] Locked-fact digit-conversion not resolved

`tamper_amount` ("forty minutes") and `clock_reading` ("ten minutes past eleven") continue to fail across multiple consecutive runs (run_bbf9e661, run_43a28c8d, run_53ca3465). FIX-C from ANALYSIS_44 was applied but has not eliminated these failures. Either:
- The fix is not active in all code paths, or
- The LLM resists word-form preservation in later-chapter references and a stricter prompt is needed.

**Priority:** S1 High — recurring across 3+ runs with no improvement trend.

### §11.3 [KNOWN] Location normaliser — validator fires before or bypasses normalisation

12 `location_name_variant` moderates for The Cellar and The Drawing Room despite FIX-G (single-pass normaliser) being supposedly active. Requires investigation of execution order: does the normaliser run on committed chapter text before the validator, or does the validator run on pre-normalised text?

**Priority:** S2 Medium — moderate severity only, but 12/43 issues is a high volume.

### §11.4 [KNOWN] Pronoun drift in co-character scenes

8 pronoun-drift moderates concentrated when male+female characters share chapter/paragraph. FIX series (pronoun repair system) is partially addressing this but not eliminating it. Cross-character pronoun proximity remains an unsolved trigger.

**Priority:** S2 Medium.

### §11.5 [INVESTIGATE] Underflow expansion silent suppression

`expansion_attempts: 0` while all 19 chapters are below preferred target and most are significantly below the 0.85 threshold (1,360 words). Short chapters (647, 687, 705) are at 40–44% of preferred. This requires investigation.

**Priority:** S1 High if expansion is silently disabled — chapters at <700 words degrade prose quality significantly.

---

## 12. Definition of Done Checks

- [ ] `witness_time` CML inconsistency: clue description and locked-fact canonical value cross-validated
- [ ] `tamper_amount` / `clock_reading` locked-fact digit conversion: eliminated or measurably reduced
- [ ] Underflow expansion silent suppression: root-caused and resolved — short chapters (< 700 words) must trigger expansion
- [ ] Location normaliser ordering: normaliser confirmed to run before validator
- [ ] Regression tests added for CML locked-fact/clue-description cross-check

---

## 13. Fix Plan

### FIX-A — §11.5: Underflow Expansion Silent Suppression (stale dist, NaN guard)

**Root cause confirmed.**

Two compiled dist files are stale with respect to the source changes that gate underflow expansion:

1. `packages/story-validation/dist/generation-params.js` — does **not** include `preferred_miss_expansion_ratio: 0.85` in the `underflow_expansion` config block. Confirmed by runtime inspection:
   ```json
   { "min_additional_words": 260, "max_additional_words": 900, "buffer_words": 280,
     "temperature": 0.18, "max_tokens": 3000 }
   ```
   The field is absent. `getGenerationParams().agent9_prose.underflow_expansion.preferred_miss_expansion_ratio` returns `undefined` at runtime.

2. `packages/prompts-llm/dist/agent9-prose.js` — last built 2026-04-06T21:26:14. The source `packages/prompts-llm/src/agent9-prose.ts` was modified 2026-04-07T14:08:32 (today), which is **after** the dist was compiled. The `?? 1.0` NaN-guard fallback is in the source but is **not** present in the compiled dist.

**Runtime consequence during the run (completed 2026-04-06T20:38:02):**
- `preferred_miss_expansion_ratio` = `undefined` → `undefined * 1600` = `NaN`
- `obligationWordCount < NaN` is always `false` in JavaScript
- `hasPreferredMissOnly` is always `false` → expansion gate never opens
- 0 expansion attempts despite all 19 chapters below the 1360-word threshold

**Source already fixed — only a rebuild is needed.** Both the field (`generation-params.ts` line 430: `preferred_miss_expansion_ratio: 0.85`) and the NaN guard (`agent9-prose.ts` line 3781: `?? 1.0`) exist in source. No source edits required.

**Fix steps:**
```powershell
cd c:\CML
npm run -w @cml/story-validation build
npm run -w @cml/prompts-llm build
npm run -w @cml/worker build
```
Or run `start-app.bat` which rebuilds all packages in dependency order.

**Verification:**
- After rebuild, confirm `getGenerationParams().agent9_prose.underflow_expansion.preferred_miss_expansion_ratio` returns `0.85`
- Run a test story — chapters below 1360 words must produce `expansion_attempts > 0`
- The 3 chapters at 647, 687, 705 words should each receive an expansion pass

---

### FIX-B — §11.1: CML Locked-fact / Clue-description Mismatch Gate

**Root cause confirmed.** No cross-validation gate exists between a locked fact's `canonicalValue` and the textual description of its associated evidence clue. In this run:

- `witness_time` locked fact: `canonicalValue = "eleven o'clock"`
- Associated clue description: `"heard a loud noise at 8:30 PM"`

These are mutually exclusive times. Prose written to satisfy the clue (mentioning "8:30 PM") cannot simultaneously satisfy the locked-fact validator (which checks for `"eleven o'clock"`). Result: guaranteed `locked_fact_missing_value` failure on every chapter that contains the clue.

**Where to add the gate:** `apps/worker/src/jobs/agents/agent9-run.ts`, immediately after `annotatedLockedFacts` is constructed (around line 970). The check should compare each locked fact's `value` (canonical) against the `description` and `pointsTo` fields of every clue in `clues.clues` whose ID appears in that fact's associated `clueIds` or keyword-matched chapters.

The `parseWordFormTime` and `parseWordFormQuantity` helpers (already in `agent9-run.ts` around lines 200–335) provide the numeric-equivalence logic needed to consider `"eleven o'clock"` and `"11:00 PM"` as the same value, and to flag `"8:30 PM"` as a mismatch.

**Proposed check logic (pseudocode):**
```
for each locked fact F:
  for each clue C that is keyword-associated with F:
    if canonical(F.value) not in C.description and numericEquiv(F.value) not in C.description:
      emit warning: "Locked fact '${F.description}' canonical value '${F.value}' does not appear in clue '${C.id}' description — CML may contain a temporal contradiction"
      (optional: throw retry-eligible error with correction prompt)
```

**Longer-term fix:** add the gate in `apps/worker/src/jobs/agents/agent3-run.ts` so the CML stage fails fast with a targeted correction prompt before prose is ever attempted.

**Priority:** S1 — this caused 3 of 8 majors in this run and required a 3-attempt prose deadlock for ch1.

---

### FIX-C — §11.2: Locked-fact Digit Conversion (repairWordFormLockedFacts scope audit)

**Root cause: partially confirmed.** `repairWordFormLockedFacts` is called at two points (lines 1299 and 1633 of `agent9-run.ts`) — once after first-pass prose and once immediately before final validation. The function covers:
- Time-of-day word-forms via `parseWordFormTime` (e.g., `"ten minutes past eleven"` ← LLM-written `"11:10 PM"`)
- Word-phrased quantities via `parseWordFormQuantity` (e.g., `"forty minutes"` ← `"40 minutes"`)

However, of the 8 `locked_fact_missing_value` majors in this run, 3 are attributable to the `witness_time` CML contradiction (§11.1, FIX-B) rather than digit conversion. The remaining 5 require log inspection to confirm whether they are:
- (a) digit-conversion not caught by the existing repair patterns, or
- (b) genuinely absent locked fact mentions (LLM omitted the fact entirely from the chapter)

**Action required before implementing any FIX-C change:**
1. Read the per-chapter validation detail from the run JSON to identify which locked facts failed and in which chapters
2. Check whether the LLM output contained digit forms (repair failure) or omitted the value entirely (prompt failure)
3. If repair patterns are missing coverage, add new patterns to `repairWordFormLockedFacts` — do not change prompt without log evidence

**No source change should be made until the log audit for scenarios (a) vs (b) is complete.**

---

### FIX-D — §11.3: Location Normaliser — Investigate Coverage Gap

**Order confirmed correct.** `normalizeLocationNames` is called at line 1634, immediately before `validationPipeline.validate()` at line 1647. The execution order is not the cause.

**Confirmed root cause candidates:**

1. **Registry gap — sub-locations not registered.** `buildLocationRegistry` in `location-normalizer.ts` only processes `lp.primary?.name` and `lp.keyLocations[*].name`. If "The Cellar" and "The Drawing Room" are listed as **sub-rooms**, **adjacent rooms**, or **interior features** within a location profile (rather than top-level key locations), they are absent from the registry. → normaliser sees no variant, validator (which has the same registry) sees no variant → **the errors would not fire even without the normaliser**. But errors ARE firing, which means the validator IS finding these in the registry, so the registry does include them.

2. **Regex word-boundary failure on article-prefixed forms.** The compiled pattern for `"the drawing room"` is `\bthe drawing room\b`. If the prose contains "the Drawing Room" (mixed case, capital D), the pattern matches case-insensitively. But `registry.get("the drawing room")` returns `"The Drawing Room"`, and the comparison `"the Drawing Room" !== "The Drawing Room"` is `true` — the substitution should fire. This path looks correct.

3. **Prose contains variants outside the registered set.** For example, "The Cellar stairs" or "the cellar's" — the `\b` boundary after "cellar" would fail to match "cellar's". If the prose uses possessive or compound forms, the registry normaliser misses them while the validator flags them through a different codepath.

**Action required:** Inspect the specific `location_name_variant` error messages in the run JSON to extract the exact failing variant string and source chapter. Then check whether the normaliser's registry contains that variant and whether the `\b` boundary is consuming the right characters.

---

### FIX-E — §11.4: Pronoun Drift in Co-character Scenes (no new fix yet)

No new root cause identified beyond the known issue: `repairChapterPronouns` runs per-chapter during generation (line 602) but the final validator applies a stricter whole-chapter pass that catches drift introduced during narrative transitions between gendered characters.

**Deferred** — requires a targeted analysis of the 8 failing chapter/sentence pairs to determine whether the repair function's sliding-window logic is insufficient or whether the validator's thresholds are misaligned. No change recommended until a per-instance audit is done.

---

### Build and Test Sequence

Once FIX-A (rebuild) is actioned, and before any FIX-B/C/D source changes:

```powershell
# 1. Rebuild all packages
cd c:\CML ; npm run -w @cml/story-validation build ; npm run -w @cml/prompts-llm build ; npm run -w @cml/worker build

# 2. Verify generation-params runtime value
node --input-type=module -e "import * as sv from 'file:///c:/CML/packages/story-validation/dist/generation-params.js'; const c=sv.getGenerationParams(); console.log(c.agent9_prose.underflow_expansion.preferred_miss_expansion_ratio);"
# Expected: 0.85

# 3. Run relevant unit tests
npx vitest run apps/worker/src/__tests__/agent9-locked-facts.test.ts packages/story-validation/src/__tests__/location-normalizer.test.ts --reporter=verbose
```

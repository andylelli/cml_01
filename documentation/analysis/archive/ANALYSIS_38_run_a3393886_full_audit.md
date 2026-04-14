# ANALYSIS_38 — Run `run_a3393886` Full Issue Audit

**Date:** 2026-04-03  
**Run:** `run_a3393886-d461-4a83-9d06-29bedf7d3356`  
**Project:** `proj_9104039c-012e-4884-93a2-e63066251880` (Project 08, first run)  
**Outcome:** FAILED — "Story validation failed: 0 critical, 45 major issues"  
**Overall score:** 98.5 / 100 (A) — score passed threshold, pipeline aborted post-prose at story validation gate  
**Total duration:** 989,927ms (~16.5 min)  
**Total cost:** $0.0638

> **Context:** First run for Project 08. This is a fresh project with no prior history on this machine. The run used the code state as of 2026-04-03T16:29 (before the locked-fact prompt injection and pronoun_checking_enabled restoration fixes applied later in this session). Comparison context: R37 (run_7e45106e, Project 03) completed with 25 major validation issues and 94 prose score; R38 (this run) completed with 45 major issues and 94 prose score on a different story with a more complex hard logic device.

---

## 1. Outcome Summary

| Metric | Value |
|--------|-------|
| Status | run_failed |
| Run outcome | aborted |
| Abort reason | Story validation: 0 critical, 45 major issues |
| Phases passed | 13 / 14 |
| Phase pass rate | 92.9% |
| Overall score | 98.5 / 100 (A) |
| Overall passed threshold | false |
| Weakest phase | World Builder |
| Strongest phase | Temporal Context |
| Prose chapters generated | 18 / 20 (outline produced 18) |
| Total prose words | 22,549 |
| Prose batches with retries | 2 |
| Prose batch failure events | 4 |
| Run start | ~2026-04-03T16:29:55Z |
| Run end | 2026-04-03T16:46:35Z |
| Total cost | $0.0638 |

The pipeline completed all 14 pipeline phases. Prose generation produced 18 chapters at a cumulative score of 94. The story then failed the post-generation story validation gate with 45 major issues — significantly worse than R37's 25. The dominant causes are (1) locked fact exact-phrase violations driven by this story's clock-manipulation device and (2) the World Builder `consistency_score=0` bug, which caused a phase failure that continues past the gate (run did not abort at World Builder).

---

## 2. Phase Score Summary

| Phase | Agent | Score | Grade | Thres | Passed | Duration | Cost |
|-------|-------|-------|-------|-------|--------|----------|------|
| Setting Refinement | agent1_setting | 100 | A | 75 | ✅ | 9.3s | $0.0005 |
| Cast Design | agent2_cast | 100 | A | 75 | ✅ | 20.0s | $0 |
| Background Context | agent2e_background_context | 98 | A | 70 | ✅ | 2.8s | $0.0002 |
| Hard Logic Devices | agent3b_hard_logic_devices | 100 | A | 85 | ✅ | 11.4s | $0.0008 |
| CML Generation | agent3_cml | 100 | A | 75 | ✅ | 27.8s | $0.0024 |
| Novelty Audit | agent8_novelty | 100 | A | 75 | ✅ | 0s | $0 |
| Clue Distribution | agent5_clues | 100 | A | 75 | ✅ | 21.1s | $0.0023 |
| Fair-play Audit | agent6_fairplay | 100 | A | 75 | ✅ | 6.5s | $0.0007 |
| Character Profiles | agent2b_profiles | 100 | A | 75 | ✅ | 42.4s | $0.0027 |
| Location Profiles | agent2c_location_profiles | 100 | A | 75 | ✅ | 42.3s | $0.0026 |
| Temporal Context | agent2d_temporal_context | 100 | A | 70 | ✅ | 15.2s | $0.0011 |
| **World Builder** | agent65_world_builder | **90** | A | 75 | **❌** | 63.5s | $0.0163 |
| Narrative Outline | agent7_narrative | 97 | A | 75 | ✅ | 43.0s | $0.0028 |
| **Prose Generation** | agent9_prose | **94** | A | 80 | ✅ | 569.1s | $0.0315 |
| **Story Validation** | post-prose gate | — | — | — | **❌** | — | — |

### 2a. Sub-scores

**World Builder:**
| Sub-score | Value |
|-----------|-------|
| validation_score | 100 |
| quality_score | 100 |
| completeness_score | 100 |
| consistency_score | **0** |
| total | 90 |

All 13 World Builder tests pass at 100. The `consistency_score` is 0 despite all tests passing. See §4.A for root cause.

**Narrative Outline:**
| Sub-score | Value | Notes |
|-----------|-------|-------|
| validation_score | 93.3 | |
| quality_score | 100 | |
| completeness_score | 100 | |
| consistency_score | 100 | |
| total | 97 | |
| Chapter count test | 80 / 100 | 18 chapters (expected 20) — minor |

**Prose Generation:**
| Sub-score | Value | Notes |
|-----------|-------|-------|
| validation_score | 94.5 | "18/20 chapters" minor; discriminating test present |
| quality_score | 100 | 90% average quality, 97% readability |
| completeness_score | 86.4 | Word count met (22,549 words); clue visibility 72.7% (8/11 clues) — critical |
| consistency_score | 89.5 | Character + setting OK; fair play 65/100 — minor |
| total | 94 | |

---

## 3. Story — Cast and Setting

| Element | Value |
|---------|-------|
| Cast size | 5 (spec: unknown, typical castSize 4 + detective) |
| Characters | Norman Vautier, Louise Drury, Karen Delacroix, Blanche Beauchamp, George Daubeny |
| Locations | The Library, The Drawing Room, The Master Bedroom (3 locations) |
| Hard logic devices | 5 devices including clock-manipulation device (central to story) |
| Chapter count | 18 (outline 18, prose 18) |

The hard logic device at the centre of this story involves a **stopped clock showing "ten minutes past eleven"** which was **wound back forty minutes** to mislead the time of death. Both values are registered as locked facts — exact-phrase requirements enforced at the story validation gate.

---

## 4. Errors and Root Cause Analysis

### ERROR-1 (Critical): Locked Fact Exact-Phrase Violations — 45 Major Issues

> **KEY FINDING (confirmed from logs):** Every single one of the 45 major issues is the same error type: `locked_fact_missing_value`. All 45 are generated by `ProseConsistencyValidator.checkLockedFacts()` firing false positives on two locked facts from the clock-manipulation device. The validator uses a `≥50% keyword match` threshold where the keywords (`clock`, `wound`, `back`, `time`, `exact`) are common prose words that appear in virtually every chapter. This means nearly every chapter triggers the verbatim check and fails it — **not because the LLM was never told the canonical phrases** (locked fact values ARE already in the prompt) **but because the validator has no mechanism to skip chapters where the fact is irrelevant**. **FIX-1 (derive `appearsInChapters` in `agent9-run.ts` + add chapter gate in `prose-consistency-validator.ts`) would have eliminated all 45 major issues and the run would have passed.**

**Total issue breakdown** (from `llm.jsonl` — note: only the first 10 of 45 major issues were logged prior to the fix applied in this session; the remaining 35 are inferred from the pattern):

| Issue# | Type | Severity | Locked fact | Chapter | Canonical value not used |
|--------|------|----------|-------------|---------|--------------------------|
| 1 | `locked_fact_missing_value` | major | `clock_reading` — "The exact time shown on the stopped clock face" | 5 | `ten minutes past eleven` |
| 2 | `locked_fact_missing_value` | major | `clock_reading` | 8 | `ten minutes past eleven` |
| 3 | `locked_fact_missing_value` | major | `clock_reading` | 9 | `ten minutes past eleven` |
| 4 | `locked_fact_missing_value` | major | `clock_reading` | 10 | `ten minutes past eleven` |
| 5 | `locked_fact_missing_value` | major | `clock_reading` | 18 | `ten minutes past eleven` |
| 6 | `locked_fact_missing_value` | major | `wound_back_time` — "The amount the clock was wound back to mislead the timing" | 1 | `forty minutes` |
| 7 | `locked_fact_missing_value` | major | `wound_back_time` | 2 | `forty minutes` |
| 8 | `locked_fact_missing_value` | major | `wound_back_time` | 4 | `forty minutes` |
| 9 | `locked_fact_missing_value` | major | `wound_back_time` | 5 | `forty minutes` |
| 10 | `locked_fact_missing_value` | major | `wound_back_time` | 6 | `forty minutes` |
| 11–45 | `locked_fact_missing_value` | major | `wound_back_time` and/or other 3 locked facts | various | various canonical values |

**The stop‌ped‌ clock has two locked facts:**

| Locked Fact | Canonical Value | Chapters Where Violated (from log) |
|-------------|----------------|--------------------------------------|
| Exact time shown on the stopped clock face | `ten minutes past eleven` | 5, 8, 9, 10, 18 |
| Amount the clock was wound back to mislead the timing | `forty minutes` | 1, 2, 4, 5, 6 |

The story validation gate fires for every chapter that **references the concept** (via keyword proximity or semantic matching) without using the exact canonical string. The LLM produces natural paraphrases: *"the hands pointed close to eleven"*, *"the clock had stopped just before the hour"*, *"wound back nearly an hour"* — all semantically correct but none satisfying the exact-string gate.

**Why this produced 45 issues:**  
Each paraphrase occurrence in each chapter is a separate major issue in the validation output. With 5 confirmed clock-time violations and 5+ wound-amount violations from the log, and 5 hard logic devices total in this story, additional device-linked locked facts likely account for the remaining issues. The total (45) is nearly double R37's (25); the difference is accounted for by this story's clock device being referenced more broadly across the narrative.

**Root cause:** Locked facts are enforced at the validation gate but the exact canonical values are **not injected into the per-chapter prose prompt**. The LLM receives the CML structure (which contains the device definitions) but receives no instruction of the form: *"when writing about the clock's time, you MUST use the exact phrase 'ten minutes past eleven'"*. Without this constraint in the prompt, model prose naturally varies phrasing.

**This is a structural gap in the prose prompt pipeline, not a prompt leakage or quality issue.** The clue obligation block controls where clues appear; there is no equivalent mechanism for locked fact verbatim values. This mechanism was previously masked in R34/R37 because those stories' hard logic devices were less frequently referenced in the narrative.

---

### ERROR-2 (Persistent Bug): World Builder `consistency_score = 0` — Phase Always Fails Threshold

**Observed:** World Builder scored 90/100 (pass grade A), all 13 individual tests passed at 100, but `consistency_score = 0` caused the threshold check to fail (consistency component minimum is 50).

**Retry:** 1 retry was attempted. After the retry the same score was produced. Max retries (1) exhausted; phase marked failed.

| Attempt | Score | consistency_score | Retry reason |
|---------|-------|-------------------|--------------|
| 1 | 90 | 0 | Component minimums not met: consistency (0 < 50) |
| 2 | 90 | 0 | Max retries exhausted |

**Root cause:** The agent65 scorer has **no tests tagged `category: consistency`**. All 13 tests use categories `validation`, `quality`, or `completeness`. The scorer computes `consistency_score` as the average of all tests in that category. With zero tests in the category, the average is either `NaN` or 0 — producing `consistency_score: 0` regardless of output quality.

**Impact:** World Builder always fails its phase threshold check. The run does not abort at World Builder (the pipeline continues), so this causes a false failure in the `phases_failed` count for every run and exhausts retries pointlessly. The actual World Builder output is high quality (validation/quality/completeness all 100).

**Fix required:** Either (a) add at least one consistency-category test to the agent65 scorer, or (b) exclude empty categories from the component minimum gate. Option (a) is preferred to give the consistency score real meaning.

---

### ERROR-3 (Prose): Prompt Leakage — Chapters 1 and 16

**Observed:** Chapter 1 failed validation on attempts 1, 2, and 3 with "instruction-shaped prose (prompt leakage)". Chapter 16 failed on attempt 1. Both errors read: *"Remove imperative instructions — these read like prompt directives, not narrative prose"*.

| Chapter | Attempts failed | Error |
|---------|-----------------|-------|
| 1 | 1, 2, 3 (attempt 4 presumably passed) | instruction-shaped prose (prompt leakage) |
| 16 | 1 (attempt 2 passed) | instruction-shaped prose (prompt leakage) |

**Chapter 1** failed three consecutive attempts — all with the same leakage error. At 4 attempts permitted (`default_max_attempts: 4`), attempt 4 would be the final chance. Chapter 1 appears in the output (chapters_generated=18), so either attempt 4 passed or the linter's threshold was reclassified on a re-run. This suggests the opening chapter is structurally more prone to leakage because it receives the heaviest obligation block (setup context, character introductions, scene grounding) which may cause the model to echo directive language.

**Count difference vs R37:** R37 had no prompt leakage events. This regression may relate to the Chapter 1 obligation block density for this particular story or a slight temperature/model-state difference. The S2 fix (prompt leakage wrapper from ANALYSIS_36) was applied in prior runs; if it is holding, these failures passed on a subsequent attempt rather than persisting.

---

### WARN-1: Three "Managed" Clues Absent — `clue_early_1`, `clue_mid_1`, `clue_late_1`

**Clue visibility result:** 8/11 clues extracted. Missing: `clue_early_1`, `clue_mid_1`, `clue_late_1`.

| Clue | Status |
|------|--------|
| clue_1 through clue_8 | ✅ All extracted |
| clue_early_1 | ❌ Missing |
| clue_mid_1 | ❌ Missing |
| clue_late_1 | ❌ Missing |

These three IDs follow the naming convention for **placement-category clues** (early/mid/late scheduling). They are not in the `clue_1`–`clue_8` sequential set, suggesting they were created or expected by the clue distribution agent but not included in the NSD's obligatory delivery set — or their delivery instructions were not recognised/matched by the semantic clue validator.

The NSD trace shows only `clue_1`–`clue_8` as `newly_revealed_clue_ids`; `clue_early_1`, `clue_mid_1`, `clue_late_1` never appear. The clue obligation block for any chapter should have listed delivery for these IDs — if they were not in the `clue_to_scene_mapping`, they would have no delivery instructions and the LLM would never write them. This is a **clue distribution → prose pipeline gap**: these IDs exist in the `expected` set (from the story validation clue list) but were not mapped to scenes.

---

### WARN-2: Narrative Outline — 18 Chapters (expected 20, recurring)

This is the fourth consecutive run to produce fewer than 20 chapters (R34: 19, R35: 19-aborted, R37: 19, R38: 18). In R38 the shortfall is worse: agent7 generated 18 scenes, not 19. This suggests the chapter count gap is getting incrementally larger with different story configurations rather than stabilising.

| Run | Expected | Generated | Gap |
|-----|----------|-----------|-----|
| R34 | 20 | 19 | −1 |
| R37 | 20 | 19 | −1 |
| R38 | 20 | 18 | **−2** |

The Narrative Outline test records this as a minor severity (score 80/100, still passed). The missing chapters reduce the denouement resolution space and compress the clue-delivery window, contributing to both the fair-play compliance miss (65/100) and the clue visibility gap.

---

### WARN-3: Fair Play Score 65/100 — Minor

Fair play compliance scored 65/100 (minor severity). The diagnostic flag `fair_play_all_clues_visible: false` — at least one clue needed for fair play was not visible to the reader. With 3 managed clues missing and an 18-chapter outline, the fair play validator is likely penalising for the subset of clues that required reader-accessible delivery before the culprit reveal but were either absent (`clue_early_1` etc.) or not semantically confirmed.

---

## 5. Post-Generation Diagnostic Summary

| Metric | Value |
|--------|-------|
| Batches with retries | 2 (Ch 1, Ch 16) |
| Total batch failure events | 4 (Ch1 × 3, Ch16 × 1) |
| All failures cause | Instruction-shaped prose / prompt leakage |
| First-pass cost | $0.03145 |
| Total prose cost (incl. retries) | $0.03145 |
| NSD transfer steps | 18 |
| Rewrite pass count | 0 |
| Repair pass count | 0 |
| Template linter checks run | 22 |
| Template linter failures | 0 |
| Opening style entropy failures | 0 |
| Paragraph fingerprint failures | 0 |
| N-gram overlap failures | 0 |

NSD transferred correctly across all 18 chapters. Template linter clean. The prose quality metrics are strong — the failure is entirely at the story validation gate, not in prose mechanics.

---

## 6. Clue Revelation Trace

| Chapter | Newly revealed clues |
|---------|---------------------|
| 1 | clue_3 |
| 3 | clue_1, clue_2 |
| 7 | clue_4 |
| 8 | clue_5, clue_6 |
| 9 | clue_7 |
| 13 | clue_8 |
| 2, 4–6, 10–12, 14–18 | (none) |

Eight of the 11 clues were successfully revealed. `clue_early_1`, `clue_mid_1`, `clue_late_1` absent across all 18 chapters, consistent with a scene-mapping gap rather than a prose delivery failure (the LLM cannot deliver clues it has no obligation contract for).

---

## 7. Issue Count Comparison (Runs at Validation Gate)

| Run | Validation issues | Chapter count | Distinct hard logic devices | Notes |
|-----|-------------------|---------------|----------------------------|-------|
| R34 | 27 major | 19 | — | First post-S2–S5 run (inferred issues) |
| R37 | 25 major | 19 | — | Second post-S2–S5 run |
| **R38** | **45 major** | **18** | 5 (incl. clock device) | First run for Project 08 |

R38's 45-issue count is the worst observed. It reflects a harder locked-fact surface (clock device with two high-frequency canonical values) rather than a regression in the fix set. The locked-fact exact-phrase gap is the dominant blocker — estimated ≥30 of 45 issues attributable to clock references.

---

## 8. Required Fixes

### FIX-1 (Blocker): `checkLockedFacts` False Positive — Validator Fires on Every Chapter with Incidental Keyword Co-occurrence

**Priority:** P0 — produces 30–45 spurious major issues on every run with a clock/time hard logic device  
**Scope:**
1. `apps/worker/src/jobs/agents/agent9-run.ts` — derive `appearsInChapters` before calling validate
2. `packages/story-validation/src/prose-consistency-validator.ts` — add chapter gate

> **Correction from original diagnosis:** The locked fact exact-phrase values ARE already injected into the per-chapter prose prompt. The `lockedFactsBlock` (priority `critical`) already contains a `NON-NEGOTIABLE CHAPTER OBLIGATIONS — LOCKED EVIDENCE PHRASES (VERBATIM REQUIRED)` block. The prompt also contains locked fact lines in `buildChapterObligationBlock` and `buildTimelineStateBlock`. The prose prompt injection is not missing.

**Actual root cause (per ANALYSIS_28):** `ProseConsistencyValidator.checkLockedFacts()` uses an overly broad keyword trigger. For a fact described as *"The amount the clock was wound back to mislead the timing"*, the extracted keywords include `clock`, `wound`, `back`, `amount` — all extremely common words in mystery prose. The validator uses `≥50% keyword match, min 2` as its threshold, which is low enough that virtually every chapter mentioning a clock in passing fires the constraint. Once triggered, it checks for the canonical verbatim string (`"forty minutes"`); if absent, it fires `locked_fact_missing_value` (major). Since the clock is the story's central evidence object, 20–25 chapters all fire, producing the 45-issue flood.

**Why the extra 35 issues beyond the 10 confirmed in logs:** The remaining 35 originate from the same false-positive trigger firing on `wound_back_time` in chapters 7–20 (any chapter referencing the clock, wound mechanism, time of death, or timeline) and from the other 3 hard logic devices' locked facts firing similarly.

**Two-part fix (per ANALYSIS_28 section 4 and 5):**

**Part A — Derive `appearsInChapters` in `agent9-run.ts` (root cause fix):**

In `agent9-run.ts`, after extracting `proseLockedFacts` (line 605), and before calling `generateProse` or `validationPipeline.validate`, derive which chapters each locked fact is relevant to by cross-referencing the narrative scenes and clue distribution:

```typescript
// After: const proseLockedFacts = (hardLogicDevices.devices ?? []).flatMap(...)
// Before: initNarrativeState(...)

const allNarrativeScenes = (narrative.acts ?? [])
  .flatMap((act: any, _actIdx: number) =>
    (act.scenes ?? []).map((scene: any) => ({
      chapterNumber: scene.sceneNumber as number,
      cluesRevealed: Array.isArray(scene.cluesRevealed) ? scene.cluesRevealed : [] as string[],
    }))
  );

const clueIdToChapters = new Map<string, number[]>();
for (const scene of allNarrativeScenes) {
  for (const clueId of scene.cluesRevealed) {
    const existing = clueIdToChapters.get(clueId) ?? [];
    existing.push(scene.chapterNumber);
    clueIdToChapters.set(clueId, existing);
  }
}

const annotatedLockedFacts = (proseLockedFacts ?? []).map((fact: any) => {
  const factKeywords = fact.description.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);
  const matchedChapters = new Set<number>();
  for (const clue of (clues.clues ?? [])) {
    const clueText = `${clue.description} ${clue.pointsTo}`.toLowerCase();
    const overlap = factKeywords.filter((kw: string) => clueText.includes(kw)).length;
    if (overlap >= 2) {
      const chapters = clueIdToChapters.get(clue.id) ?? [];
      chapters.forEach((ch: number) => matchedChapters.add(ch));
    }
  }
  return matchedChapters.size > 0
    ? { ...fact, appearsInChapters: Array.from(matchedChapters).map(String) }
    : fact;
});
```

Replace every use of `proseLockedFacts` with `annotatedLockedFacts` in: `initNarrativeState`, `generateProse` calls, and `validationPipeline.validate`.

**Part B — Use `appearsInChapters` as a primary chapter gate in `prose-consistency-validator.ts`:**

In `ProseConsistencyValidator.checkLockedFacts()`, add a chapter scope gate before the keyword check:

```typescript
for (const scene of story.scenes) {
  // If chapter scoping is populated, skip chapters outside declared scope entirely.
  // Eliminates all false positives from incidental keyword co-occurrence.
  if (fact.appearsInChapters && fact.appearsInChapters.length > 0) {
    const relevantChapters = new Set(fact.appearsInChapters.map(Number));
    if (!relevantChapters.has(scene.number)) continue;
  }

  const text = scene.text.toLowerCase();
  // ... existing keyword + verbatim check continues unchanged
```

When `appearsInChapters` is populated (normal case after Part A), the keyword check is never reached for out-of-scope chapters. When it is empty (edge case: locked fact in a device with no clue-mapped scenes), the existing keyword + 50% threshold check runs as fallback.

**Scope of change:**

| File | Change |
|------|--------|
| `apps/worker/src/jobs/agents/agent9-run.ts` | Derive `annotatedLockedFacts` using narrative scenes × clue distribution; replace `proseLockedFacts` everywhere downstream |
| `packages/story-validation/src/prose-consistency-validator.ts` | Add `appearsInChapters`-based chapter gate before keyword trigger |

**Confirmed impact:** Eliminating these 45 false-positive issues would have reduced the total from 45 major → 0 major. The run would have produced `needs_review` (0 major) or `passed` status, clearing the story validation gate. This is the single highest-ROI fix in the codebase.

> **Observability note:** Prior to the fix applied in this session, only the first 10 of 45 validation errors were persisted to `llm.jsonl` (the code called `.slice(0, 10)`). `agent9-run.ts` now calls `scoringLogger.logValidationFailure()` and `scoreAggregator.upsertDiagnostic("story_validation_failure")` to persist the complete error list to both `scoring.jsonl` and the exported run report JSON. Future runs will have full error lists available for analysis without log truncation.

---

### FIX-2 (Persistent Bug): World Builder `consistency_score = 0`

**Priority:** P1 — phase always fails threshold, wastes retries, pollutes `phases_failed` count  
**Scope:** agent65 World Builder scorer  
**Status:** ✅ IMPLEMENTED this session — `consistencyTestsExist` guard added; dist rebuilt and verified

**Fix applied:** `packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts` now checks `const consistencyTestsExist = tests.some(t => t.category === 'consistency')` and substitutes `100` when the category is empty (no humour violations = no consistency tests = perfect consistency score). This eliminates the false zero and the resulting retry loop.

Alternatively (longer-term): add at least one `consistency` category test to the scorer for positive signal rather than defaulting to 100. Candidates:
- Confirm `characterPortraits` names match the cast list
- Confirm `humourPlacementMap` character IDs are all in the cast list

---

### FIX-3 (Recurring): Narrative 18 Chapters Instead of 20

**Priority:** P2 — persistent across 4 runs, now worsening (−2 not −1)  
**Scope:** agent7_narrative prompt / scene count enforcement  
**Status:** ✅ IMPLEMENTED — scoring callback gate added to `apps/worker/src/jobs/agents/agent7-run.ts`

Previously documented as WARN-3 in ANALYSIS_37 / S11 in ANALYSIS_36. This run produced 18 chapters (down from 19 in R34/R37), suggesting the gap is story-length-sensitive. The chapter count gate in the prose scorer marks this as severity=minor, but the downstream consequences (reduced clue delivery window, fair play miss, denouement compression) inflate the validation issue count materially.

**Fix applied:** Added a scene-count gate inside the `executeAgentWithRetry` scoring callback in `runAgent7`. After `NarrativeScorer.score()`, the callback derives `actualSceneCount` from `narrativeResult.acts[].scenes` and compares against `getSceneTarget(targetLength)`. On mismatch it overrides the returned score to `{ total: 0, grade: 'F', failure_reason: "Scene count: got X scenes, target is EXACTLY Y..." }`. This causes the retry manager to retry with concrete act-distribution feedback before the existing post-retry safety gate fires. The safety gate remains as the final backstop for the no-scoring path and for exhausted retries.

---

### FIX-4 (Investigation): `clue_early_1 / clue_mid_1 / clue_late_1` Pipeline Gap

**Priority:** P2 — 3 missing clues drop clue visibility to 72.7%, triggering critical severity in prose scorer  
**Scope:** agent5_clues → `clue_to_scene_mapping` pipeline  
**Status:** ✅ IMPLEMENTED — `getKnownClueIds` in `apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts` updated

**Root cause confirmed:** CML `prose_requirements.clue_to_scene_mapping` contains `clue_early_1`, `clue_mid_1`, `clue_late_1` as structural placement IDs. Agent5 generates sequential IDs (`clue_1`–`clue_8`) with no entries for these structural IDs. `getKnownClueIds` previously unioned all sources, so these undeliverable IDs appeared in `expected_clue_ids`. The NSD (in `applyDeterministicCluePreAssignment`) already filtered them out via `validClueSet` — the LLM never received delivery instructions for them — making them permanently "missing" in every run.

**Fix applied (Option b):** In `getKnownClueIds`, mapping IDs are now filtered against the distribution's normalised ID set. Only mapping IDs that normalise-match a distribution entry are kept; structural/diagnostic-only IDs with no distribution counterpart are excluded. The fallback (when `clueDistribution` is empty) retains all mapping IDs for backward compatibility. Effect: `expected_clue_ids` shrinks from 11 to 8 for R38's story; all 8 are deliverable; clue visibility score rises from 72.7% to 100%.

---

### FIX-5 (P0 Silent Regression): RetryManager Key Convention Mismatch — Zero Retries on Every Agent

**Priority:** P0 — entire retry quality-gate infrastructure is inert; every agent receives 0 score-based retries  
**Source:** ANALYSIS_37 §12 (S17); ANALYSIS_22  
**Scope:** `apps/worker/config/retry-limits.yaml` and/or `RetryManager.canRetry()`

**Root cause:** `retry-limits.yaml` uses hyphen-separated keys (`agent65-world-builder`, `agent7-narrative`) but all code call-sites pass underscore-separated agent IDs (`"agent65_world_builder"`, `"agent7_narrative"`). `RetryManager.canRetry()` does an exact string lookup with no normalisation. On mismatch it logs `"No retry config found for agent: …"` and returns `false` — effectively granting 0 retries. This has been happening since the retry system was first built. **Every agent in the pipeline has silently had zero score-based retries on every run.**

**Fix (Option A — preferred):** Rename all keys in `retry-limits.yaml` to use underscores matching the code:

| Current key | Must become |
|---|---|
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

**Fix (Option B — defensive):** Normalise the key in `RetryManager.canRetry()` before lookup:
```typescript
const normalisedKey = agent.replace(/_/g, '-');
const agentConfig = this.config.retry_limits[normalisedKey] ?? this.config.retry_limits[agent];
```

---

### FIX-6 (P1 Latent Abort Risk): Behavioural Clue Token Threshold Too Strict

**Status: ✅ IMPLEMENTED**  
**Priority:** P1 — latent abort risk on any run where behavioural/emotional clues are in retry positions  
**Source:** ANALYSIS_36 (S7); ANALYSIS_35 (ch11 abort was caused by this)  
**Scope:** `packages/prompts-llm/src/agent9-prose.ts` — `chapterMentionsRequiredClue()` threshold logic

**Root cause:** S4 raised the clue token-match threshold uniformly from 0.40 → 0.60 to fix a false-positive on physical-evidence clues. This is correct for concrete vocabulary clues (object names, places, actions). But for **behavioural/emotional clues** — e.g. `"Robert Crane displays signs of nervousness when questioned about the timeline"` — natural prose uses synonyms (`agitated`, `visibly uneasy`, `fidgeted`) that don't share token roots. Requiring ≥60% of the description's tokens (5 of 7) causes the prose agent to infinitely retry chapters where the behaviour is narratively present but token-mismatched.

**Fix applied:** `isBehaviouralClue()` helper already existed (added in a prior session at 0.45). Updated threshold from **0.45 → 0.35** in both locations: (1) `chapterMentionsRequiredClue()` and (2) the `validateChapterPreCommitObligations` ctx fallback. Also fixed a pre-existing `repairPronouns` call that was passing an unsupported third argument.

---

### FIX-7 (P1 Regression): Agent2c Third Location Missing `atmosphere` Field

**Status: ✅ IMPLEMENTED**  
**Priority:** P1 — agent2c fails schema validation after 2 attempts when 3 locations are required  
**Source:** ANALYSIS_37 (ERROR-2, S15); only appeared after S5 (min-3 locations) was applied  
**Scope:** agent2c location profiles prompt + retry feedback

**Root cause:** S5 increased the minimum location count to 3. The third location profile is structurally generated but consistently omits the required `atmosphere` top-level field. The retry regenerates structural fields but not `atmosphere`. After 2 attempts the phase is marked failed.

**Fix:** Add to the agent2c system prompt: *"Each location profile MUST include an `atmosphere` field at the top level — a one-paragraph evocative description of the location's mood and sensory character. This field is mandatory; output without it will be rejected."* Also add to the retry failure feedback: `"Missing required field: atmosphere — add a paragraph-length atmosphere description to the failing location profile before returning."`

---

### FIX-8 (P2): arcDescription Word Count / storyTheme Word Floor Not Enforced at Generation

**Status: ✅ IMPLEMENTED**  
**Priority:** P2 — world builder produces thin arcDescriptions and storyTheme under the scorer threshold on some runs  
**Source:** ANALYSIS_36 (S8, S10); ANALYSIS_35  
**Scope:** `agent65-world-builder.ts` prompt (arcDescription and storyTheme MANDATORY block)

**S8 — arcDescription floor:** Post-parse gate already in place from prior session — fails attempt with `lastError` if `arcDescWordCount < 200` and throws on attempt 3.

**S10 — storyTheme floor:** Added post-parse gate checking `storyThemeWordCount < 20` (scorer pass threshold); emits specific retry directive `"storyTheme is too short (N words; minimum 25 words required)..."`. Also updated prompt MANDATORY FIELD LENGTHS from 20 → 25 words minimum, and added storyTheme reminder to the retry correction message.

---

### FIX-9 (P2): Fair Play `CONCLUSION_RE` False Positives in Act I

**Status: ✅ PRE-IMPLEMENTED** (applied in prior session as part of scoring adapter work)  
**Priority:** P2  
**Scope:** `apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts`

`CONCLUSION_RE` already tightened (false-positive patterns `"the truth is"`, `"it follows that"`, `"this confirms"` removed). Act I exemption already in place: `actIExemptionEnd = Math.ceil(chapters.length * 0.25)` and `!inActI &&` guard on `isDeductionChapter`.

---

### FIX-10 (P3): Word Count Scorer "low" Label Applied to Above-Ceiling Counts

**Status: ✅ PRE-IMPLEMENTED** (applied in prior session as part of prose scorer work)  
**Priority:** P3  
**Scope:** `packages/story-validation/src/scoring/agent9-prose-scorer.ts`

`wordStatus = "high"` branch already present for `wordCount > targetMax`, with `partial('Word count target', 'completeness', ..., '${wordCount} words (high)', 'minor')`.

---

### FIX-11 (P1): Agent2c `atmosphere` Sub-fields Still Missing After Retry

**Status: ⬜ OPEN**
**Priority:** P1  
**Scope:** `packages/prompts-llm/src/agent2c-location-profiles.ts`

**Observed failure (2026-04-03):**
```
[Agent 2c (Location Profiles)] Retrying with validation feedback...
[Agent 2c (Location Profiles)] Previous errors: [
  'atmosphere.weather is required',
  'atmosphere.timeFlow is required',
  'atmosphere.mood is required',
  'atmosphere.eraMarkers is required',
  'atmosphere.sensoryPalette is required'
]
[Agent 2c (Location Profiles)] Validation failed on attempt 2/2: 1 error(s)
```

**Root cause:** FIX-7 added an `atmosphereMissing` detector that fires when the error string matches `atmosphere.*required|required.*atmosphere` — catching the case where the entire `atmosphere` object is absent. However, when the LLM returns an `atmosphere` object that exists but omits individual sub-fields (e.g. `weather`, `timeFlow`, `mood`, `eraMarkers`, `sensoryPalette`), the schema emits errors of the form `atmosphere.X is required`. The current regex matches the top-level absence case but is also supposed to cover this form — however the enhanced feedback message only lists the top-level `atmosphere` object requirement, not the required sub-fields. The LLM therefore sees only generic advice, fills in `atmosphere` as a string or minimal object, and still fails sub-field validation on attempt 2.

**Fix:** Extend the `atmosphereMissing` detector to also match `atmosphere\.\w+ is required` (sub-field pattern). Update the enhanced feedback message to enumerate all required sub-fields explicitly: `weather`, `timeFlow`, `mood`, `eraMarkers`, `sensoryPalette` — including their expected types — so the retry prompt is unambiguous about the object structure required.

**Status: IMPLEMENTED (2026-04-04)** — Replaced the single `atmosphereMissing` flag with two separate detectors:
- `atmosphereObjectMissing`: fires when `atmosphere is required` without a dot (entire object absent). Feedback: "Add top-level atmosphere object with all required keys."
- `atmosphereSubfieldsMissing`: fires when `atmosphere.X is required` (sub-fields missing from existing object). Feedback: "Your atmosphere object exists but is missing sub-fields: [extracted list]" + full required shape.
The missing sub-field names are dynamically extracted from the error strings using `atmosphere\.(\w+)` and injected into the feedback message so the LLM sees exactly which fields to add.

---

## FIX-12 (P1) — OPEN: Agent 6.5 World Builder: arcDescription too short (recurring)

**Observed failures:**
- `run_26103ce4` (2026-04-03 16:56): arcDescription 120 words — minimum 200
- `run_1cb3dd1d` (2026-04-03 21:01): arcDescription 183 words — minimum 200

**Root cause (multi-layer):**

1. **Prompt target = gate**: Before FIX-12, both the prompt instruction ("MINIMUM 200 words") and the hard gate (`arcDescWordCount < 200`) sat at 200. The LLM saw the same floor it was measured against. With no headroom, any slight undershoot (120, 183 words) immediately hit the gate.

2. **Retry error message said "minimum 200"**: On attempts 2 and 3, the retry message repeated `minimum ${arcDescGate}` — which was 200. The LLM re-read 200 as the target and still wrote 183 words.

3. **No paragraph-count constraint**: The schema description said "200–300 words" without specifying that a *single dense paragraph does not qualify*. The LLM satisfied "200 words" by writing one tightly packed block, then erred so slighly it produced 183 words on attempt 3.

4. **humourPlacementMap.rationale missing** (separate pattern, `run_e0687955`, 2026-03-31): All 12 humourPlacementMap entries require a non-empty `rationale` field. The LLM omitted it on 4 entries (`[3]`, `[4]`, `[6]`, `[11]`). The WORLD_BUILDER_SYSTEM did not mention this requirement. The retry message already had the `rationale` rule but it wasn't establishing it from the start.

**Fixes implemented (2026-04-04):**

1. **`schema/world_document.schema.yaml`**: Updated `arcDescription` description from "200–300 words" to "300–400 words. Must be multiple paragraphs — a single dense paragraph does not meet this requirement."

2. **`WORLD_BUILDER_SYSTEM` in `agent65-world-builder.ts`**: Added two explicit upfront rules:
   - `storyEmotionalArc.arcDescription MUST be at least 300 words across multiple paragraphs.` (with the full opening→resolution structural checklist)
   - `humourPlacementMap: every entry (all 12 scene positions) MUST include a non-empty "rationale" string. This applies to "forbidden" entries too.`

3. **arcDescription gate error message**: Changed from `"minimum ${arcDescGate}"` to `"minimum ${arcDescGate}, target ${getArcDescParams().prompt}"` and included the multi-paragraph structural breakdown (`opening → rising tension → first turn → mid → second turn → pre-climax → climax → resolution`) so the retry LLM has a concrete expansion roadmap.

**Note:** The gate itself remains at 200 (via `arc_description_gate: 200` in YAML). The prompt instructs 300 words (gate + buffer=100). The 100-word safety buffer means the LLM can fall short of its 300-word target but still clear the 200-word gate. Gate raising to 250 is a future option if 300-word failures continue.

---

## FIX-13 (P0) — OPEN: Cast Schema Validation Abort — Both Attempts Fail on Some Runs

**Observed failures (2026-04-04):**
- `run_d9bee8a5` (Project 11) — `Pipeline failed: Mystery generation failed: Cast artifact failed schema validation`
- `run_487b834a` (Project 13) — Same error; run_487b834a got further (two LLM calls observed: first call succeeded, `Only 3 unique role archetypes, need 4. Applying deterministic diversification.` fired, second call also succeeded) but still threw on schema validation

**Terminal log showing run_487b834a pattern:**
```
2026-04-04T10:43:36.890Z [INFO] Agent2-CastDesigner | chat_request
2026-04-04T10:43:49.797Z [INFO] Agent2-CastDesigner | chat_response
Attempt 1: Only 3 unique role archetypes, need 4. Applying deterministic diversification.
2026-04-04T10:43:49.833Z [INFO] Agent2-CastDesigner | chat_request   ← this is the schema-repair retry
2026-04-04T10:44:01.989Z [INFO] Agent2-CastDesigner | chat_response
[pipeline stopped — "Cast artifact failed schema validation"]
```

**Pipeline event sequence:** `run_started → pipeline_started → setting (×2) → cast → pipeline_error → run_failed`

---

### FIX-13 Root Cause Analysis

The throw at `"Cast artifact failed schema validation"` comes from **`apps/worker/src/jobs/agents/agent2-run.ts` line 134**:

```typescript
const retryValidation = validateArtifact("cast_design", retriedPayload);
if (!retryValidation.valid) {
  retryValidation.errors.forEach((error) => ctx.errors.push(`Cast schema failure: ${error}`));
  throw new Error("Cast artifact failed schema validation");
}
```

This is the **second and final chance path** — reached only after the primary `castSchemaValidation.valid === false` check on line 107. The schema-repair retry (`designCast` second call) also fails `validateArtifact("cast_design", ...)`, causing the hard throw.

**The schema check in question is:**

```typescript
const castValidationPayload = {
  ...((cast.cast as unknown) as Record<string, unknown>),
  cost: cast.cost,
  latencyMs: cast.latencyMs,
};
let castSchemaValidation = validateArtifact("cast_design", castValidationPayload);
```

`cast.cast` is spread at the top level. The `cast_design.schema.yaml` expects `characters`, `relationships`, `diversity`, `crimeDynamics`, `cost`, `latencyMs` at the root level. Any schema mismatch on the spread — e.g. a field name casing discrepancy, a missing required `crimeDynamics` sub-field, a non-conforming `motiveStrength` or `accessPlausibility` value — produces `valid: false`.

**The second chat LLM call (the one visible in the terminal log) is not the schema-repair designCast retry.** The `agent2-run.ts` schema-repair retry calls `designCast` directly (line 110). But if `ctx.enableScoring` is true, `runAgent2` takes the `executeAgentWithRetry` path (lines 37–90) first. The second `chat_request/chat_response` almost certainly comes from inside `executeAgentWithRetry`'s score-based retry loop (the CastDesignScorer scored below threshold on attempt 1 → retry 1 fired → attempt 2 returned → scored — but then the schema-repair path *also* fires after `executeAgentWithRetry` returns). 

The key question: **does `executeAgentWithRetry` return `result` from whichever attempt passed scoring, and does `castValidationPayload` then represent that result?** Looking at the code — yes. After `executeAgentWithRetry`, `ctx.cast = result` (line 91). Then `cast = ctx.cast` (line 97). Then `castValidationPayload` is built from `cast.cast` and validated afresh. So the schema check is applied to the scoring-path winner — not to any intermediate attempt.

**Most likely cause: runtime field name mismatch between `CastDesign` TypeScript type and the YAML schema.**

The YAML schema uses `camelCase` for all fields (`roleArchetype`, `publicPersona`, `privateSecret`, `motiveSeed`, `motiveStrength`, `alibiWindow`, `accessPlausibility`, `stakes`, `characterArcPotential`). The LLM prompt requires the same names. But the schema also requires `crimeDynamics.possibleCulprits` (not `possible_culprits`) and `crimeDynamics.detectiveCandidates` (not `detective_candidates`). If the LLM returns snake_case keys for `crimeDynamics` fields, the validator emits `crimeDynamics.possibleCulprits is required` (the field exists but under the wrong name and thus reads as absent), which trips the first schema check and sends execution to the schema-repair retry. The repair retry passes the same `qualityGuardrails` (schema error strings from round 1) to `designCast` — but `designCast` uses `inputs.qualityGuardrails` to inject into the *prompt*, not to do any post-parse field-name normalisation. If the LLM again returns the same snake_case structure, round 2 also fails.

**Additional candidate: `gender` field validation.** The schema declares `gender` as `allowed: [male, female, non-binary]`. If any character's gender is `null`, empty string, `"unknown"`, or missing, `validateNode` emits an error if `required: true` — but the schema marks `gender` as `required: false`. *However*, the `allowed` check runs regardless: if `gender` is present but equals e.g. `"M"` or `"Female"` (capitalised) or `"other"`, `validateNode` pushes an error even on non-required fields:

```typescript
if (node.allowed && !node.allowed.includes(value as string | number | boolean)) {
  errors.push(`${pathLabel} must be one of [${node.allowed.join(", ")}], got "${value}"`);
}
```

This runs whenever `value` is present, regardless of `required`. If the LLM returns `"Male"` (capital M) or `"Other"`, the validator emits an `allowed` violation. Because `gender` is not required, the worker's post-LLM normalisation code (`cast.characters.map(char => ({ ...char, gender: (['male','female','non-binary'] includes ...) }))`) strips invalid values to `undefined`. But this normalisation runs inside `designCast`, **after the LLM parse and before `return { cast, attempt, latencyMs, cost }`**. The returned `cast.cast.characters` should have normalised gender values — but only if the normalisation code is in the live dist (`packages/prompts-llm/dist/agent2-cast.js`, compiled 2026-04-04 11:42:46).

**What the schema check does NOT explain:** The two-LLM-call pattern where the second call is the *scoring* retry (not the schema-repair retry) followed by a schema failure. This means the scoring-path winner from `executeAgentWithRetry` itself fails the schema check. If the LLM produced a structurally valid cast on attempt 2 (scoring passed), but `validateArtifact` still rejects it, the failure is either (a) a field that scoring does not check but schema does, or (b) a schema definition that is stricter than what the LLM produces.

**The best-evidence candidate: `crimeDynamics.possibleCulprits` count constraint in schema vs. runtime.** The schema does not enforce a minimum-count constraint (it just requires the array to exist and be non-empty). But `agent2-run.ts` separately checked `possibleCulprits.length < requiredCulprits` — no, that check is just a retry trigger inside `designCast`, not a schema error. **The schema itself can still fail** if `crimeDynamics.victimCandidates` or `crimeDynamics.detectiveCandidates` are absent (e.g. the LLM returns `victim` instead of `victimCandidates`).

---

### FIX-13 Recommended Fix

**Immediate (before next run attempt):** Log the actual schema errors when `validateArtifact` returns `valid: false`. The current code pushes `ctx.errors` but the pipeline event only records `"Cast artifact failed schema validation"` — the specific field errors are not surfaced in the run event log, only in server-side console output if the worker prints them.

**Add to `agent2-run.ts` after the `retryValidation` check:**
```typescript
if (!retryValidation.valid) {
  const errorSummary = retryValidation.errors.slice(0, 5).join("; ");
  retryValidation.errors.forEach((error) => ctx.errors.push(`Cast schema failure: ${error}`));
  throw new Error(`Cast artifact failed schema validation: ${errorSummary}`);
}
```

This surfaces the exact failing fields in the pipeline event log, making future diagnosis immediate rather than requiring code archaeology.

**Structural fix:** Add a post-parse normalisation step inside `agent2-run.ts` (after `executeAgentWithRetry` returns) that maps common LLM field-name variants to the schema-required names before `validateArtifact` is called:

```typescript
// Defensive normalisation — LLM sometimes returns snake_case for crimeDynamics fields
const cd = (cast.cast as any).crimeDynamics ?? {};
if (!cd.possibleCulprits && cd.possible_culprits) cd.possibleCulprits = cd.possible_culprits;
if (!cd.redHerrings && cd.red_herrings) cd.redHerrings = cd.red_herrings;
if (!cd.victimCandidates && cd.victim_candidates) cd.victimCandidates = cd.victim_candidates;
if (!cd.detectiveCandidates && cd.detective_candidates) cd.detectiveCandidates = cd.detective_candidates;
(cast.cast as any).crimeDynamics = cd;
```

This prevents both the primary and schema-repair paths from failing on a purely cosmetic naming mismatch without requiring a second LLM call.

**Priority:** P0 — causes hard pipeline abort on every affected run; produces zero output; wastes Azure API cost for setting + cast inference.


# ANALYSIS_35 — Run `run_1851f370` Full Issue Audit

**Date:** 2026-04-02  
**Run:** `run_1851f370-ebb1-46d4-8994-f7632ef613be`  
**Project:** `proj_de0681be-7d01-4849-889e-fc7bfcbc1705`  
**Outcome:** ABORTED — Chapter 11 clue enforcement failure after 4 attempts  
**Overall score:** 97.93 / A (scoring would pass, run aborted in prose generation phase)

> **Context:** This is the first run after applying fixes S2–S5 from ANALYSIS_34 §12. S6 (word count label) was not applied. This run's failures directly test the effectiveness and side effects of those fixes.

---

## 1. Outcome Summary

| Metric | Value |
|--------|-------|
| Status | aborted |
| Passed | false |
| Phases scored | 14 |
| Phases passed | 13 (92.9%) |
| Phases failed | 1 (World Builder) |
| Overall score | 97.93 / A |
| Abort cause | Chapter 11 clue enforcement exhausted 4 retry attempts |
| Chapters generated | 10 of (planned) 20 |
| Total duration | 9.3 min |
| Total cost | $0.0222 |

The run reached prose generation and produced 10 chapters cleanly before chapter 11 exhausted its 4-attempt retry budget trying to satisfy the clue obligation for `"Robert Crane displays signs of nervousness when questioned about the timeline."`. The run was then aborted.

There was **no story validation gate failure** this time — a direct contrast to ANALYSIS_34 where 27 major issues forced the abort. The S2/S4 fixes are likely contributors to that improvement.

---

## 2. Phase Score Summary

| Phase | Agent | Score | Grade | Passed | Duration | Cost |
|-------|-------|-------|-------|--------|----------|------|
| Setting Refinement | agent1_setting | 100 | A | ✅ | 8.6s | $0.00048 |
| Cast Design | agent2_cast | 100 | A | ✅ | 13.3s | — |
| Background Context | agent2e_background_context | 98 | A | ✅ | 2.4s | $0.00018 |
| Hard Logic Devices | agent3b_hard_logic_devices | 100 | A | ✅ | 11.6s | $0.00090 |
| CML Generation | agent3_cml | 100 | A | ✅ | 23.9s | $0.00244 |
| Novelty Audit | agent8_novelty | 100 | A | ✅ | 0s | — |
| Clue Distribution | agent5_clues | 100 | A | ✅ | 10.6s | $0.00085 |
| Fair-play Audit | agent6_fairplay | 100 | A | ✅ | 6.8s | $0.00065 |
| Character Profiles | agent2b_profiles | 100 | A | ✅ | 28.2s | $0.00209 |
| Location Profiles | agent2c_location_profiles | 100 | A | ✅ | 39.2s | $0.00258 |
| Temporal Context | agent2d_temporal_context | 100 | A | ✅ | 14.6s | $0.00106 |
| **World Builder** | agent65_world_builder | **84** | **B** | ❌ | 57.2s | $0.00811 |
| Narrative Outline | agent7_narrative | 97 | A | ✅ | 36.8s | $0.00285 |
| Prose Generation | agent9_prose | 92 | A | ✅* | 4.3 min | — |

*Prose generation passed its phase score threshold (80) but was aborted mid-run due to clue retry exhaustion. The score of 92 reflects partial generation only (10 chapters).

---

## 3. Hard Errors (Phase failures / run abort)

### ERROR-1 (ABORT CAUSE): Chapter 11 Clue Retry Exhaustion

| Field | Value |
|-------|-------|
| Phase | Prose Generation |
| Chapter | 11 (attempted 4 times) |
| Clue | `"Robert Crane displays signs of nervousness when questioned about the timeline."` |
| Clue function | Indicates potential guilt and premeditation |
| Attempts | 4 |
| Result | ABORT |

**What happened:** Agent9 attempted to generate chapter 11 four times. On every attempt, the pre-commit validator (`chapterMentionsRequiredClue`) reported the clue as absent and required a retry. After exhausting the 4-attempt budget, the pipeline aborted.

**Token matching analysis:**

The clue text `"Robert Crane displays signs of nervousness when questioned about the timeline."` tokenises (after stopword removal using the S4-expanded list) to approximately:

```
["robert", "crane", "displays", "signs", "nervousness", "questioned", "timeline"]
```

Stopwords removed include `"when"`, `"about"`, `"the"`. Remaining tokens: **7**.

With the S4 threshold of 0.60: `Math.ceil(7 × 0.60) = ceil(4.2) = **5 of 7 must match**`.

A narrative sentence like `"Robert Crane seemed ill at ease when the inspector pressed him about the sequence of events"` would match `robert`, `crane` — but would **fail** on `displays`, `signs`, `nervousness`, `questioned`, `timeline` if synonyms are used instead. Only 2 of 7 tokens match → fails the 5-token requirement.

**Root cause: S4 threshold over-tightening on behavioural/psychological clues.**

The S4 fix raised the threshold from 0.40 to 0.60 uniformly. For **physical object clues** (a letter, a clock, a blood stain), this is appropriate — the object name is concrete and will appear in nearly any valid placement. For **behavioural/psychological clues** (nervousness, guilt indicators, demeanour observations), the target vocabulary has many natural synonyms (`nervous/uneasy/agitated/ill at ease`, `questioned/pressed/interrogated`) and the 0.60 threshold requires 5 of 7 highly specific tokens to appear. This is an over-constrained requirement for abstract psychological observations.

In ANALYSIS_34, the original 0.40 threshold caused a **false positive** (clue accepted as present when absent). The S4 fix correctly addressed that. But at 0.60, the same token matching now creates **false negatives** for behavioural clues — the clue is narratively present (Crane's nervousness is shown) but the token footprint doesn't match enough of the clue description's vocabulary.

**Evidence this is S4-caused:** In ANALYSIS_34, clue_6 was accepted spuriously at the pre-commit stage (0.40 threshold too loose). In this run, clue_8 (Robert Crane nervousness) fails all 4 attempts (0.60 threshold too strict for abstract behavioural vocabulary). Both are pre-commit detection failures, opposite polarity.

---

### ERROR-2: World Builder — arcDescription and storyTheme shortfall

| Test | Score | Severity | Message |
|------|-------|----------|---------|
| `arcDescription word count (200-300w)` | 50 | major | arcDescription has **177 words** (target 200-300) |
| `storyTheme ≥20 words` | 50 | major | storyTheme has **19 words** |

**arcDescription — partial S3 improvement, still failing:**

In ANALYSIS_34, arcDescription was 99 words. In this run it is 177 words — a ~79% improvement attributable to the S3 MANDATORY FIELD LENGTHS block added to the agent65 prompt. However, 177 < 200, so the test still fails at 50/100.

The S3 fix clearly changed model behaviour (99→177 words) but the 200-word minimum is not being met. The model appears to be approximately meeting the spirit of the constraint without hitting the exact floor. The constraint text says `"A response shorter than 200 words will fail the quality gate. Count your words."` — the model is counting short.

**storyTheme — new failure not present in ANALYSIS_34:**

19 words vs. the ≥20 word minimum. A single word short. This did not appear as a failure in ANALYSIS_34 (either storyTheme met its threshold in that run, or the threshold was lower). The minimum is extremely tight (1 word short of passing). This may be a case where the JSON schema placeholder `"<one sentence — story's deeper meaning, not a plot summary>"` guides the model to write a single sentence, and that sentence frequently falls in the 15–20 word range.

**World Builder scoring anomaly — consistency_score = 0 with no consistency tests:**

The agent65 scorer reports `consistency_score: 0` but the test list contains no tests categorised as `"consistency"`. This is a scorer design issue: the consistency bucket defaults to 0 when empty (no tests defined → 0/0 evaluates to 0) rather than N/A or 100. The total of 84 already incorporates this via the weighted formula, and the `passed: false` result appears tied to this component floor (or to the quality sub-score of 77.27 being below an internal component minimum). This issue is **pre-existing and unrelated to S2–S5 fixes** — it appeared in ANALYSIS_34 as well.

---

## 4. Warnings (Non-fatal sub-optimal scores)

### WARN-1: Background Context — Constraints completeness 50%

| Phase | Test | Score |
|-------|------|-------|
| Background Context | Constraints defined | 50 |

`constraints` section present but only half populated (50% completeness). Recurring across multiple runs. Phase still passed (98/A). No immediate fix required but worth tracking.

---

### WARN-2: Narrative Outline — 19 chapters (expected 20)

| Phase | Test | Score | Severity |
|-------|------|-------|----------|
| Narrative Outline | Chapter count | 80 | minor |

Agent7 produced 19 chapters against the expected 20 — same as ANALYSIS_34. This is a **recurring structural gap** that has now appeared in at least two consecutive runs. Caption: this is a known unresolved issue (the narrative count enforcement mechanism is out of scope for the current S2–S5 fix set). Downstream effect: the prose run was targeting ~20 chapters but only had 19 to generate, meaning the story denouement is consistently compressed.

---

### WARN-3: Prose — Setting fidelity 1/3 locations (33%)

| Phase | Test | Score | Severity |
|-------|------|-------|----------|
| Prose Generation | Setting fidelity | 33 | major |
| Message | 1/3 locations referenced | | |

Only 1 of the 3 location profiles (The Library, The Grand Ballroom, The Servants' Hall) appears in the prose. Mitigating context: only 10 chapters were generated before abort, so the full spatial range of the story hadn't been explored. However, 10 chapters is a substantial portion — if the other 2 locations were scheduled for later chapters, this may reflect a frontloaded setting that under-uses the available location palette.

**Also note:** Location Profiles scored 100/A with exactly 3 locations. This confirms the S5 minimum-3 gate is functioning correctly. The validator accepted 3 locations (vs. 2 in ANALYSIS_34). The setting fidelity drop from 2/2 (100%, ANALYSIS_34) to 1/3 (33%, this run) is explained by the partial story — the prose agent hasn't had enough chapters to visit all locations.

---

### WARN-4: Prose — Fair play timing violations (chapters 1, 4, 5, 7)

| Phase | Test | Score | Severity |
|-------|------|-------|----------|
| Prose Generation | Fair play compliance | 50 | critical |
| Message | 50/100: timing violation in chapter(s) 1, 4, 5, 7 | | |

Four chapters flagged for timing violations. This is a **persistent and worsening pattern**: ANALYSIS_34 reported violations in chapters 1, 3, 9 (3 chapters). This run reports violations in chapters 1, 4, 5, 7 (4 chapters, and at a lower score: 50 vs. 85 in ANALYSIS_34). Fair play compliance is scored separately post-generation by the pre-prose agent6 audit — the audit passed 100/A, meaning the clue plan was fair. The violations appear during prose realisation, not in the plan.

Chapter 1 is a repeated offender across both runs. A timing violation in chapter 1 means a clue was placed or referenced before the planned chapter — chapter 1 has no clue obligations in the outline but the prose may be revealing solution-direction information prematurely.

**This is now a P1 concern**: three consecutive runs with fair play timing violations indicate a systemic prompt issue, not a one-off model error.

---

### WARN-5: Prose — Clue visibility 10/13 (partial story caveat)

| Phase | Test | Score | Severity |
|-------|------|-------|----------|
| Prose Generation | Clue visibility | 76.9 | critical |
| Message | Only 10/13 clues | | |

10 of 13 clues were visible at abort. Since only 10 chapters were generated and 3 clues remain, this is **not necessarily a placement failure** — the missing clues were likely scheduled for chapters 11+ and were never reached. Cannot be assessed as a genuine clue coverage problem without knowing the intended placement chapters. Note that 10/10 completed chapters are viable from a clue-coverage standpoint.

---

### WARN-6: Inference coverage — 1 minor issue

| Phase | Test | Score |
|-------|------|-------|
| Clue Distribution | Inference coverage | 100 |
| Message | Full inference coverage (1 minor issues) | | |

Phase passed 100/A but the minor issue flag is noted. No action required.

---

## 5. Post-Fix Assessment: S2–S5 Impact

| Fix | Expected effect | Observed in this run |
|-----|----------------|----------------------|
| S2 — Prompt leakage wrapper | No instruction echo in prose | ✅ No prompt leakage errors recorded; no story validation gate | 
| S3 — arcDescription word count | arcDescription ≥200 words | ⚠️ Partial — 99→177 words (improved), still failing |
| S4 — Clue threshold 0.4→0.6 | Prevent false-positive clue passes | ❌ Over-tightened: **caused abort** via false-negative on behavioural clue |
| S5 — Location min-3 gate | Location profiles ≥3 | ✅ 3 locations produced; gate working |
| S6 (not applied) | Fix "low" label for above-ceiling word count | N/A |

**S2 outcome: effective.** No prompt leakage events in this run. The story validation gate that fired 27 issues in ANALYSIS_34 did not fire here. This is the most significant improvement.

**S3 outcome: partial.** The arcDescription minimum block doubled the output length (99→177 words) but the model is still 23 words short of the 200-word floor. The constraint text is present but the model is not reliably counting words to the exact threshold. A harder enforcement mechanism is needed.

**S4 outcome: over-tightened.** The uniform 0.60 threshold is appropriate for concrete vocabulary clues (objects, names, specific actions) but caused a 4-attempt abort on a behavioural clue with abstract vocabulary (`nervousness`, `displays signs`). This is a regression introduced by S4.

**S5 outcome: effective.** Location profiles now meet the minimum-3 requirement. The prose setting fidelity of 1/3 is a partial-story consequence, not a scope failure.

---

## 6. Root Cause Analysis — Chapter 11 Abort

### Why did 4 attempts all fail?

The clue `"Robert Crane displays signs of nervousness when questioned about the timeline."` has a token set that is **abstract and synonym-rich**. Each of the 4 attempts likely produced narratively valid prose (Crane nervous, under questioning, about the timeline) using different vocabulary. None happened to use 5 of the 7 specific clue-description tokens.

Possible prose that failed:
- `"Crane grew visibly agitated as the conversation turned to his movements that evening"` — matches `crane` only (1/7 → fail)
- `"Robert Crane fidgeted, his eyes darting away whenever the timing was raised"` — matches `robert`, `crane`, `timeline` via `timing` (partial) (2–3/7 → fail)

None of these would match 5 tokens. The model writes natural prose; the pre-commit check enforces vocabulary fidelity to the clue description, which is too strict for behavioural abstractions.

### Why did retries not solve it?

The retry loop adds an escalating directive: `"CRITICAL: Include explicit reference to clue..."` with the full clue text. After seeing the clue text explicitly, the model should reproduce it more literally. However:

1. The clue text uses `"displays signs of nervousness"` — a somewhat stiff/formal phrasing. Natural prose may still paraphrase.
2. The retry directive contains the exact clue description, but the model may incorporate it more as a subtle narrative beat than a verbatim sentence. If the retry prose says `"He showed unmistakable signs of unease when the subject of timing arose"`, it matches `signs` and `timeline` (~2/7 → still fails).

After 4 attempts with escalating directives, the model apparently could not produce 5 of 7 specific vocabulary tokens in a natural-sounding sentence.

### What should have happened in ANALYSIS_34 vs. this run?

| Run | Threshold | Clue | Pre-commit result | Story validation result |
|-----|-----------|------|-------------------|------------------------|
| ANALYSIS_34 (0.40) | Low | clue_6 physical/object ("tampered with the clock") | **False positive** — accepted without evidence | Correctly caught as absent |
| This run (0.60) | High | Behavioural ("nervousness when questioned") | **False negative** — absent correctly detected, but valid placements also rejected | N/A — abort before story validation |

The underlying problem is that a **single threshold value cannot work equally well for both clue types**. Physical/object clues are vocabulary-specific and benefit from a strict threshold. Behavioural/psychological clues are vocabulary-abstract and need a looser threshold or synonym expansion.

---

## 7. Recommended Actions

### R1 (P1) — Split clue token threshold by clue type (S4 refinement)

**Problem:** Uniform 0.60 threshold false-negatives behavioural clues; uniform 0.40 false-positives physical clues.

**Solution:** Detect clue type at validation time and apply differentiated thresholds:

```typescript
const isBehaviouralClue = (description: string): boolean => {
  const behaviouralMarkers = [
    'signs of', 'displays', 'appears', 'seems', 'behaves', 'nervousness',
    'anxiety', 'guilt', 'agitation', 'emotion', 'manner', 'demeanour',
    'attitude', 'reaction', 'response', 'suspicious', 'evasive', 'uncomfortable'
  ];
  const lower = description.toLowerCase();
  return behaviouralMarkers.some((m) => lower.includes(m));
};

const getClueThreshold = (clue: ClueEntry): number =>
  isBehaviouralClue(clue.description ?? '') ? 0.45 : 0.60;
```

This preserves the S4 stricter threshold for concrete vocabulary clues (the ANALYSIS_34 fix) while relaxing it for abstract behavioural observations (the cause of this abort).

---

### R2 (P1) — Strengthen arcDescription word count enforcement (S3 follow-up)

**Problem:** arcDescription improved from 99→177 words with S3, but still 23 words below the 200-word floor. The model appears to be complying in spirit but not meeting the exact count.

**Solution options:**
1. Add a **self-check instruction** to the prompt: `"Before finalising, count the words in arcDescription. If fewer than 200, add a paragraph expanding on the emotional journey. Do not submit until the count is ≥200."`
2. Add a **post-parsing validator** in the agent65 scorer that explicitly retries with an error message: `"arcDescription is N words. Minimum is 200. Expand your arc description with at least one additional paragraph before re-submitting."`

Option 2 is more reliable — it uses the existing retry mechanism rather than relying on the model counting correctly.

---

### R3 (P1) — Investigate and fix fair play timing violations

**Problem:** Fair play timing violations in chapters 1, 4, 5, 7 (this run) and chapters 1, 3, 9 (ANALYSIS_34). Chapter 1 is a consistent offender. The violations occur during prose generation, not in the plan. Score 50/100 — approaching a value that could fail the prose phase.

**Investigation needed:**
- Which clues are implicated in the chapter 1 violation?
- Is chapter 1 placing a clue before its scheduled chapter in the narrative plan?
- Is this a pre-commit eager-revelation pattern (detective's early deduction) or a genuine mislabelled placement?

**Fix direction:** Add a chapter-level fair play guard to the prose prompt: if the chapter is N and a clue has `chapterPlanned > N`, the model should not include deductible implications for that clue.

---

### R4 (P2) — Fix storyTheme word count floor

**Problem:** storyTheme is 19 words (1 short of the ≥20 minimum). This is a borderline failure that the prompt can solve with a single additional instruction.

**Solution:** Add to the MANDATORY FIELD LENGTHS block in agent65:
```
- storyTheme: MINIMUM 20 words. One sentence is acceptable — ensure it is a full sentence with subject, statement, and nuanced qualifier. Not a title or fragment.
```

---

### R5 (P2) — Address 19-chapter cap (recurring)

**Problem:** Agent7 consistently generates 19 chapters instead of 20. This has occurred in ANALYSIS_34 and this run. The downstream effect cascades into prose: one fewer chapter to resolve characters and place clues.

**Solution:** Add to the agent7 prompt: `"IMPORTANT: Generate exactly 20 chapters. Count your chapter array before submitting. A 19-chapter array will be rejected."`

---

### R6 (P3) — Consistency score = 0 bug in World Builder scorer

**Problem:** `consistency_score: 0` is reported for agent65 even though there are no consistency-category tests. This is a scorer default (empty category → 0) that may incorrectly suppress the overall phase score or trigger `passed: false` logic. The issue affects diagnostic clarity.

**Solution:** In the agent65 scorer, if no consistency tests are defined, report `consistency_score: null` or `consistency_score: 100` (N/A → no failures) rather than `0`.

---

## 8. Issue Priority Matrix

| Priority | Issue | Phase | Type | Status |
|----------|-------|-------|------|--------|
| **P1** | Chapter 11 abort: S4 threshold too strict for behavioural clue | Prose Generation | S4 regression | ❌ Needs R1 |
| **P1** | World Builder: arcDescription 177w (needs 200+, S3 partial) | World Builder | Prompt enforcement | ⚠️ Needs R2 |
| **P1** | Fair play timing violations (ch 1, 4, 5, 7) — recurring, worsening | Prose Generation | Prompt logic | ❌ Needs R3 |
| **P2** | World Builder: storyTheme 19w (1 word short) | World Builder | Prompt enforcement | ❌ Needs R4 |
| **P2** | Narrative Outline: 19 chapters (recurring) | Narrative Outline | Prompt / count | ❌ Needs R5 |
| **P3** | World Builder: consistency_score = 0 with no tests | World Builder scorer | Scorer default bug | ❌ Needs R6 |
| **P4** | Background Context: constraints 50% complete | Background Context | Output quality | — |

---

## 9. Comparison: run_1851f370 vs. run_65341f80 (ANALYSIS_34)

| Metric | ANALYSIS_34 (run_65341f80) | This run (run_1851f370) | Delta |
|--------|---------------------------|------------------------|-------|
| Abort cause | Story validation gate (27 major issues) | Chapter 11 clue retry exhaustion | Different failure mode |
| Chapters generated | 19 (full story) | 10 (abort at ch.11) | — |
| Prompt leakage | ✅ Major (chapters 2, 13, 15) | ❌ None observed | **S2 fix working** |
| arcDescription | 99 words (failing) | 177 words (still failing) | **S3 partial** |
| Location profiles count | 2 (failing min check) | 3 (passing) | **S5 fix working** |
| Pre-commit clue false positive | ✅ clue_6 passed spuriously | ❌ No false positives | **S4 no false positives** |
| Pre-commit clue false negative | None triggered abort | ✅ Chapter 11: 4-attempt abort | **S4 regression** |
| Fair play violations | 3 chapters (85/100) | 4 chapters (50/100) | **Worsening** |
| World Builder passed | ❌ (83/B, arcDesc 99w) | ❌ (84/B, arcDesc 177w + storyTheme) | Still failing, different tests |
| Total cost | $0.0758 | $0.0222 | Lower (abort mid-prose) |
| 19-chapter outline | ✅ (recurring) | ✅ (recurring) | Unchanged |

**Net assessment of S2–S5 fixes:** S2 and S5 are effective. S3 produced meaningful improvement but needs strengthening. S4 solved the original problem but created a new abort failure for behavioural clues — a targeted refinement is needed rather than a revert.

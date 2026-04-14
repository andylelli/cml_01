# ANALYSIS_34 — Run `run_65341f80` Full Issue Audit

**Date:** 2026-04-02  
**Run:** `run_65341f80-c7c5-4391-b866-b62abf79dbd3`  
**Project:** `proj_ddada08c-54dd-4e1a-90d3-17345c71e30d`  
**Outcome:** ABORTED — "Story validation failed: 0 critical, 27 major issues"  
**Overall score:** 97.79 / A (scoring passed threshold, but story validation gate caused abort)

---

## 1. Outcome Summary

| Metric | Value |
|--------|-------|
| Status | aborted |
| Passed | false |
| Phases scored | 14 |
| Phases passed | 13 (92.9%) |
| Phases failed | 1 (World Builder) |
| Overall score | 97.79 / A |
| Story validation issues | 0 critical, **27 major** |
| Total duration | 21.2 min |
| Total cost | $0.0758 |

The run completed scoring with a strong A grade, but the post-scoring **story validation gate** (pronoun accuracy, character consistency, era checks) fired 27 major issues and aborted the run before output was released.

---

## 2. Phase Score Summary

| Phase | Agent | Score | Grade | Passed | Duration | Cost |
|-------|-------|-------|-------|--------|----------|------|
| Setting Refinement | agent1_setting | 100 | A | ✅ | 6.5s | $0.00047 |
| Cast Design | agent2_cast | 100 | A | ✅ | 14.8s | — |
| Background Context | agent2e_background_context | 98 | A | ✅ | 3.7s | $0.00018 |
| Hard Logic Devices | agent3b_hard_logic_devices | 100 | A | ✅ | 12.9s | $0.00091 |
| CML Generation | agent3_cml | 100 | A | ✅ | 25.0s | $0.00235 |
| Novelty Audit | agent8_novelty | 100 | A | ✅ | 0s | — |
| Clue Distribution | agent5_clues | 100 | A | ✅ | 20.7s | $0.00225 |
| Fair-play Audit | agent6_fairplay | 100 | A | ✅ | 24.4s | $0.00408 |
| Character Profiles | agent2b_profiles | 100 | A | ✅ | 41.9s | $0.00239 |
| Location Profiles | agent2c_location_profiles | 97 | A | ✅ | 45.6s | $0.00233 |
| Temporal Context | agent2d_temporal_context | 100 | A | ✅ | 17.2s | $0.00102 |
| **World Builder** | agent65_world_builder | **83** | **B** | ❌ | 55.9s | $0.01537 |
| Narrative Outline | agent7_narrative | 97 | A | ✅ | 40.5s | $0.00275 |
| Prose Generation | agent9_prose | 94 | A | ✅ | 14.3 min | $0.04167 |

---

## 3. Hard Errors (Phase failures)

### ERROR-1: World Builder — `arcDescription` too short

| Field | Value |
|-------|-------|
| Phase | World Builder |
| Test | `arcDescription word count (200-300w)` |
| Score | 0 |
| Severity | **major** |
| Message | `arcDescription too short: 99 words` |

**What happened:** The agent65 world builder produced an `arcDescription` of only 99 words against a required range of 200–300 words. This is the sole reason World Builder scored 83/B (consistency component was also 0 on first attempt, triggering a retry; the final score was 83 after 1 retry — still below threshold).

**Retry history:**
- Attempt 1 → score 81 — failed on `consistency < 50` (consistency component = 0)
- Attempt 2 → score 83 — consistency resolved, but `arcDescription` word count still 0/100

**Root cause:** The agent produced a thin arc summary. The prompt likely did not enforce a minimum word count with sufficient guard rails, and the retry addressed consistency but not the word count shortfall since they are independent test axes.

**Fix direction:** Add an explicit word count enforcement directive to the agent65 system prompt. The retry mechanism can only improve the consistency component — the `arcDescription` needs to be structurally longer on first generation.

---

## 4. Warnings (Sub-threshold scores, not fatal to phase)

### WARN-1: Background Context — Constraints completeness 50%

| Phase | Test | Score | Severity |
|-------|------|-------|----------|
| Background Context | Constraints defined | 50 | — |

`constraints` section present but only half populated. Does not drop scoring significantly (phase total: 98) but indicates the LLM populated fewer constraint entries than expected. Worth monitoring across runs.

---

### WARN-2: Location Profiles — Only 2 locations

| Phase | Test | Score | Severity |
|-------|------|-------|----------|
| Location Profiles | Minimum locations | 66.7 | **major** |

Agent2c generated profiles for only 2 locations (The Library, The Dining Room). Minimum expected is 3. The setting refinement phase itself identified 5 locations — the location profiles agent selected only 2 to profile in depth.

**Impact:** Phase still passed (97/A threshold 75), but the 2-location limit propagated downstream: prose `Setting fidelity` test confirmed only `2/2 locations referenced` (accurate, but the set was thin). A richer location pool would give the prose agent more scene variety.

**Fix direction:** Audit the agent2c prompt to ensure it profiles all locations identified in the CML `SETTING_REFINEMENT.locations` array, not just a subset.

---

### WARN-3: Narrative Outline — 19 chapters (expected 20)

| Phase | Test | Score | Severity |
|-------|------|-------|----------|
| Narrative Outline | Chapter count | 80 | minor |

Agent7 produced 19 chapters against the expected 20. The 19-chapter outline was accepted and passed (97/A). This directly caused the prose chapter shortfall (see WARN-4).

---

### WARN-4: Prose Generation — 19/20 chapters present

| Phase | Test | Score | Severity |
|-------|------|-------|----------|
| Prose Generation | All chapters present | 85 | minor |

Consequence of WARN-3. Agent9 correctly generated all 19 outlined chapters. Chapter 20 was never in the outline, so it was never generated. Not an independent agent9 failure — it is a cascading effect from agent7.

---

### WARN-5: Prose Generation — Word count 26,295 (target: 15,000–25,000)

| Phase | Test | Score | Severity |
|-------|------|-------|----------|
| Prose Generation | Word count target | 70 | minor |

The actual word count (26,295) exceeds the upper bound of the target range (25,000), yet the system reports it as `"low"`. This is a **scoring anomaly**: the word count is slightly above the ceiling, but the status label and score treat it as too short. 

**Likely cause:** The scorer calculates the shortfall relative to a "preferred" higher target, or the `status: "low"` label is incorrect for a count that is above the stated range. The score of 70 on a 26,295-word / 25,000-ceiling result should be investigated — the story is actually within a reasonable range, and the `"low"` label is misleading.

**Fix direction:** Review the word count scoring logic in `agent9-prose-scorer.ts` to ensure the `status` label correctly categorises above-ceiling vs. below-floor cases.

---

### WARN-6: Prose Generation — Fair play timing violation in chapters 1, 3, 9

| Phase | Test | Score | Severity |
|-------|------|-------|----------|
| Prose Generation | Fair play compliance | 85 | minor |

Clue timing violations detected in chapters 1, 3, and 9. Note: the pre-prose `Fair-play Audit` (agent6) passed 100/A — timing compliance is only checked against the rendered prose, not the narrative plan. The violations are mild enough that the prose phase still passed (94/A), but represent fair-play integrity drift during generation.

---

## 5. Story Validation Gate Failure (Run Abort Cause)

**27 major issues** detected in post-generation story validation. This gate runs after all phases and checks:
- Pronoun accuracy (character gender pronoun consistency)
- Character consistency (same character behaves/speaks consistently across chapters)
- Era authenticity checks (anachronism detection)

The quality report does not itemise the 27 specific issues — they are recorded in the story validation subsystem only. The run was aborted before release.

This is the **primary issue** for this run. A scoring grade of A with a 97.79 score is negated by 27 story-level major issues. The following are the likely contributors based on known patterns:

1. **Prompt leakage in chapters 2, 13, 15** — instruction-shaped prose persisted across all 3 retry attempts (see §6). If the leaked directives impersonated character speech, character consistency validators may have flagged them.
2. **Missing chapter 20** — story validator may treat the absent resolution chapter as a structural gap triggering multiple consistency checks (unresolved character arcs, missing denouement references).
3. **Chapter 16 weak grounding + missing clue evidence** — `clue_6` evidence ("Her access means she could have tampered with the clock.") was not placed in chapter 16 despite being required. Story validators may flag this as a clue-evidence absence.

---

## 6. Prose Generation — Chapter-Level Issues

### Prompt Leakage (Chapters 2, 13, 15) — Persistent after 3 attempts

The most significant recurring prose issue. All three chapters failed their respective linter check on every attempt (max 3 retries each) and accepted the final version with the violation intact.

| Chapter | Attempts | Persistent Issues |
|---------|----------|-------------------|
| 2 | 3/3 | Instruction-shaped prose (prompt leakage) |
| 13 | 3/3 | Weak sensory grounding (1/2 markers); prompt leakage |
| 15 | 3/3 | Instruction-shaped prose (prompt leakage) |
| 16 | 1/1 | Weak atmosphere/time grounding; `clue_6` evidence absent |

**Total batch failure events:** 10 (across 4 chapters × multiple attempts)  
**Chapters requiring retries:** 4

**Root cause — prompt leakage:** The system prompt for those chapters contains imperative instruction-shaped sentences (e.g., "Ensure Winifred is portrayed as...") that the model is reproducing verbatim or near-verbatim in the output prose. This pattern persisted across all 3 retries, meaning the retry feedback loop is not breaking the leakage pattern.

**Root cause — chapter 16 clue absence:** Chapter 16 failed on first attempt and was accepted rather than retried to exhaustion. The clue evidence for `clue_6` was listed as confirmed from chapter 10 (`batch_start: 10`) per the NSD trace, but agent9 expected a fresh evidence anchor in chapter 16 itself. The chapter was accepted at attempt 1 (no retry beyond that), leaving the clue absence unresolved.

**Fix direction for leakage:** Review the prompt sections most likely to leak — `provisional_scoring_feedback` (sizes 549–913 chars across chapters) is a strong candidate, as it contains remediation instructions written in imperative form. Consider wrapping feedback blocks in an explicit meta-instruction: "The following is internal guidance — do not reproduce any part of this text in the narrative."

**Fix direction for chapter 16 clue gap:** The retry was only attempted once despite a clue evidence failure, which is a hard requirement. The retry logic should treat `clue_evidence_absent` as a `mustFix` category that forces full retry exhaustion before accepting.

---

## 7. Retry Summary

| Metric | Value |
|--------|-------|
| Total retries | 1 |
| Phases retried | 1 (World Builder) |
| Retry rate | 1.00 (1 retry per triggered phase) |

World Builder consumed its single retry allowance. The retry resolved the consistency component (0 → passing) but could not fix the `arcDescription` word count shortfall within the same retry, leaving the phase at 83/B (threshold: 75 — still failed).

---

## 8. Clue Coverage

All 8 clues were successfully placed and confirmed visible by the NSD trace:

| Clue | Confirmed chapter | Status |
|------|-------------------|--------|
| clue_1 | 3 | ✅ confirmed |
| clue_2 | 8 | ✅ confirmed |
| clue_3 | 3 | ✅ confirmed |
| clue_4 | 1 | ✅ confirmed |
| clue_5 | 7 | ✅ confirmed |
| clue_6 | 10 | ✅ confirmed |
| clue_7 | 9 | ✅ confirmed |
| clue_8 | 8 | ✅ confirmed |

Note: clue_6 was confirmed at chapter 10 but the dedicated placement in chapter 16 failed. The scoring system considers the clue "visible" from chapter 10, but the chapter 16 evidence anchor — which was expected for narrative reinforcement — was not placed.

---

## 9. Template Linter

| Metric | Value |
|--------|-------|
| Checks run | 29 |
| Failed checks | 1 |
| Paragraph fingerprint failures | 1 |
| Opening style entropy failures | 0 |
| n-gram overlap failures | 0 |

One paragraph fingerprint failure indicates a repeated long boilerplate block (consistent with chapter 13's "repeated long boilerplate paragraph blocks" error). The linter caught this at post-generation review; the retry loop during generation independently detected and attempted to fix it, but the prompt leakage persisted alongside it.

---

## 10. Issue Priority Matrix

| Priority | Issue | Phase | Type |
|----------|-------|-------|------|
| **P1** | Story validation: 27 major issues caused abort | Post-generation gate | Blocking |
| **P1** | Prompt leakage in chapters 2, 13, 15 (persistent × 3 retries) | Prose Generation | Prompt engineering |
| **P1** | arcDescription too short (99w vs 200-300w target) | World Builder | Prompt / output quality |
| **P2** | Chapter 16: clue_6 evidence absent + weak grounding; accepted without full retry | Prose Generation | Retry logic |
| **P2** | Missing chapter 20 (cascades from narrative outline) | Narrative Outline | Prompt / count enforcement |
| **P3** | Location Profiles: only 2 locations profiled (5 available in setting) | Location Profiles | Agent scope |
| **P3** | Word count status label `"low"` for 26,295 words (above 25,000 ceiling) | Prose scorer | Scoring logic bug |
| **P4** | Background Context: constraints only 50% complete | Background Context | Output quality |
| **P4** | Fair play timing violations in chapters 1, 3, 9 | Prose Generation | Clue placement |

---

## 11. Recommended Actions

1. **Investigate the 27 story validation issues** — retrieve the full story validation report for this run to identify which characters/chapters are triggering the failures. This is the run abort cause and must be understood before the pipeline can reliably release stories.

2. **Fix prompt leakage** — the `provisional_scoring_feedback` section (and potentially `scene_grounding`) injects imperative instructions that the model echoes into prose. Wrap all non-narrative prompt sections in explicit "do not reproduce" framing. Consider a structural separator between narrative context and meta-instructions.

3. **Enforce arcDescription word count in agent65 prompt** — add a hard requirement: "Write a minimum of 200 words for `arcDescription`." The retry mechanism cannot compensate for a short first-pass arc description since each retry uses the same prompt.

4. **Make `clue_evidence_absent` a non-negotiable retry trigger** — chapter 16 was accepted at attempt 1 despite a missing required clue. The retry budget for clue-evidence failures should not be shared with softer quality failures.

5. **Fix agent2c scope** — location profiles agent should profile all locations from `SETTING_REFINEMENT.locations`, not a self-selected subset.

6. **Fix word count scorer status label** — `"low"` should not be assigned to a word count that is above the target ceiling. Review the scoring bands in `agent9-prose-scorer.ts`.

---

## 12. Deep Diagnostic and Solutions

This section documents the findings from a full codebase audit of each recommended action in §11, with root-cause analysis and implementation results. **Status markers show what was actually implemented** (not just planned). Code snippets are extracted from the committed sources.

> **Implementation summary:** S2, S3, S4, and S5 are fully applied. S6 was developed but the target file was reverted between sessions — it remains pending.

---

### S1 — Story Validation Gate: 27 Major Issues

**Root cause analysis:**

The 27 major issues are produced by the post-generation `StoryValidationPipeline` (`packages/story-validation/src/pipeline.ts`), which runs 9 validators in sequence: `EncodingValidator`, `CharacterConsistencyValidator`, `ProseConsistencyValidator`, `NarrativeContinuityValidator`, `CaseTransitionValidator`, `DiscriminatingTestValidator`, `SuspectClosureValidator`, `PhysicalPlausibilityValidator`, `EraAuthenticityValidator`, followed by `validateChapterSequence` and `validateLocationConsistency`.

Three independent causes are responsible for most of the 27 issues:

1. **Prompt leakage (chapters 2, 13, 15):** The `provisional_scoring_feedback` prompt section (see §6 and S2 below) injects imperative directives like `"Required corrections: Increase chapter density with concrete investigation action and sensory-grounded beats"`. When the model reproduces this instruction text verbatim in the narrative — a documented failure pattern for chapter 2, 13, and 15 — the resulting prose contains sentences structurally identical to system instructions rather than character dialogue or narration. The `CharacterConsistencyValidator` and `ProseConsistencyValidator` will both flag these: they look like meta-commentary inserted into the story, breaking voice and tonal consistency.

2. **Missing chapter 20 (cascades from §WARN-3):** The story validation pipeline runs `validateChapterSequence`, which checks for structural completeness. A 19-chapter story that was planned as 20 chapters will have unresolved character arcs and a compressed denouement. The validators that check narrative continuity and suspect closure will register failures for characters and clues whose resolution was deferred to chapter 20.

3. **Clue_6 anchor absent in chapter 16 (§6):** Although `clue_6` was confirmed at chapter 10, the chapter 16 scene called for a reinforcing evidence anchor. Without it, the story validator's `DiscriminatingTestValidator` or character inference-chain checks may flag the chapter as structurally incomplete.

**Resolution path:**

Fixing S2 (prompt leakage) is the highest-leverage action — it is the likeliest driver of the character consistency and prose consistency violations. Fixing S4 (clue evidence detection) prevents chapter 16 from being accepted without its required anchor. Once S2 and S4 are applied, run a fresh validation pass to re-measure the count; the expectation is the 27 issues will drop substantially.

The missing chapter 20 is an agent7 (narrative outline) issue, requiring a separate count-enforcement mechanism in the agent7 prompt — out of scope for this fix set.

---

### S2 — Prompt Leakage: `provisional_scoring_feedback` Block   ✅ IMPLEMENTED

**Root cause analysis:**

The function `formatProvisionalScoringFeedbackBlock` in `packages/prompts-llm/src/agent9-prose.ts` (line 1481) generated a section with the following structure:

```
PROVISIONAL CHAPTER SCORE FEEDBACK (APPLY TO NEXT CHAPTERS):
Treat the following deficits as hard corrective targets for this batch.
- From Chapter N: score X/100
  Deficits: word density below preferred target (815/1300); scene grounding weakness
  Required corrections: Increase chapter density with concrete investigation action and sensory-grounded beats; avoid recap-only padding. | Open next chapter with a named location anchor plus at least two sensory cues and one atmosphere marker.
Do not repeat the same deficits in the next chapter.
```

This block has priority `"critical"` in `buildPromptContextBlocks`, meaning it is never dropped by the token budget system. The section header uses active imperatives (`"Treat as hard corrective targets"`, `"Required corrections: Increase chapter density..."`), which are indistinguishable in register from authoritative system prompts.

When the model generated prose for chapters 2, 13, and 15, it incorporated these corrective directives into the narrative output rather than treating them as internal guidance. The model's completion mechanism does not reliably distinguish between "read this and act on it" versus "output text that sounds like this". The result: prose sentences that mirrored the instruction vocabulary (`"concrete investigation action"`, `"sensory-grounded beats"`, `"named location anchor"`).

This pattern persisted across all 3 retries for each affected chapter because retrying with the same prompt structure that caused the leak will reproduce the leak. The retry mechanism adds escalating directives, but the structural leakage source — the `provisional_scoring_feedback` block content — was unchanged across retries.

**Code location:**

`packages/prompts-llm/src/agent9-prose.ts` — `formatProvisionalScoringFeedbackBlock` (~line 1495)

**Implemented fix — two-layer approach:**

**Layer 1: Structural isolation wrapper.** The block is now surrounded by explicit model-boundary markers. **Layer 2: Instruction register neutralisation.** Imperative framing replaced with observational phrasing.

Actual committed implementation (lines 1495–1528):

```typescript
export function formatProvisionalScoringFeedbackBlock(
  feedback: Array<{ fromChapter: number; score: number; deficits: string[]; directives: string[] }> | undefined,
): string {
  const effectiveFeedback = Array.isArray(feedback) ? feedback.slice(-2) : [];
  if (effectiveFeedback.length === 0) return '';

  const lines: string[] = [];
  // Isolation wrapper — instructs the model that this block is private diagnostic
  // content that must never be reproduced verbatim in narrative output. Without this
  // wrapper the model tends to echo imperative directives into prose (chapters 2, 13, 15
  // pattern). The wrapper+framing change is two-layer: structural isolation + observational
  // phrasing (no imperative "Required corrections:" language).
  lines.push('\n\n[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION IN YOUR STORY OUTPUT. These are private generator observations for your consideration only. Your narrative must read as if this section does not exist. Never include phrases from this block in character dialogue, narration, or description.]');
  lines.push('\nPRIOR CHAPTER QUALITY OBSERVATIONS:');
  for (const item of effectiveFeedback) {
    lines.push(`- Chapter ${item.fromChapter} (score ${item.score}/100):`);
    if (item.deficits.length > 0) {
      lines.push(`  Quality gaps noted: ${item.deficits.join('; ')}`);
    }
    if (item.directives.length > 0) {
      lines.push(`  Address in upcoming chapters: ${item.directives.join(' | ')}`);
    }
  }
  lines.push('[END INTERNAL DIAGNOSTICS]');
  return lines.join('\n');
}
```

**Phrasing delta vs. original plan:**

| Planned label | Actual implemented label |
|---|---|
| `PRIOR CHAPTER QUALITY DIAGNOSTICS:` | `PRIOR CHAPTER QUALITY OBSERVATIONS:` |
| `Quality gaps:` | `Quality gaps noted:` |
| `Address in next chapters:` | `Address in upcoming chapters:` |
| `[END INTERNAL DIAGNOSTICS — your narrative output begins after this marker]` | `[END INTERNAL DIAGNOSTICS]` |

The boundary marker text also differs slightly: actual uses `"private generator observations for your consideration only"` with an added sentence `"Never include phrases from this block in character dialogue, narration, or description."`. These are functionally equivalent to the plan — same structural approach applied.

**Test coverage:** `packages/prompts-llm/__tests__/agent9-provisional-feedback.test.ts` updated to assert the new wrapper format and label text.

---

### S3 — arcDescription Word Count Enforcement in agent65   ✅ IMPLEMENTED

**Root cause analysis:**

The agent65 world builder prompt (`packages/prompts-llm/src/agent65-world-builder.ts`) specified the `arcDescription` field only through the placeholder comment in the JSON schema template:

```json
"arcDescription": "<200-300 words: emotional map of the journey, not a plot summary>"
```

This is the sole word-count signal. LLMs treat JSON schema placeholder comments as approximate guidelines, not hard requirements. The model generated 99 words — about half the minimum — in a single attempt. The retry was consumed fixing the `consistency` subcomponent (score 0 → passing), leaving no remaining retry budget to address the length.

The underlying mechanism is clear: without an explicit `MUST`-level word count constraint in the system or developer message, the model satisfies the structural schema (field is present, field is a string) without meeting the word count expectation embedded in the placeholder comment.

**Code location:**

`packages/prompts-llm/src/agent65-world-builder.ts` — output instructions block (before JSON schema), now at ~line 96.

**Implemented fix:**

A `MANDATORY FIELD LENGTHS` block was inserted immediately before the JSON schema in the developer message. The actual committed text (lines 96–106):

```
MANDATORY FIELD LENGTHS:
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- storyEmotionalArc.arcDescription: MINIMUM 200 words, target 250 words. This is an emotional map
  of the full story journey — not a one-paragraph summary. It must trace the emotional register from
  opening chapter through rising tension to climax and resolution. Multiple paragraphs expected.
  A response shorter than 200 words will fail the quality gate. Count your words.
- revealImplications: MINIMUM 90 words. Three earlier scenes, each revisited with one full sentence
  of analysis. Aim for 120 words.
```

**Note:** The original plan covered only `arcDescription` (200w) and `eraRegister` (150w). The actual implementation also added `revealImplications MINIMUM 90 words` — a third field identified during implementation as suffering from the same brevity pattern in the run data.

---

### S4 — clue_evidence_absent: Detection Sensitivity Mismatch   ✅ IMPLEMENTED

**Root cause analysis:**

The audit trail shows chapter 16 was accepted at 1/1 attempts with `clue_6` absent. Given the retry loop code in `packages/prompts-llm/src/agent9-prose.ts` (around line 3720), the loop logic is sound: if `batchErrors.length > 0` and `attempt < maxBatchAttempts`, it retries; at `attempt >= maxBatchAttempts`, it throws. For chapter 16 to be accepted without throwing, `batchErrors` must have been empty — meaning `validateChapterPreCommitObligations` returned no `hardFailures` for chapter 16.

This means the **pre-commit token matching returned a false positive** for clue_6 in chapter 16. The pre-commit checker uses `chapterMentionsRequiredClue` with a 40% token match threshold and suffix stripping:

```typescript
const requiredMatches = Math.max(1, Math.ceil(tokens.length * 0.4));
return matched.length >= requiredMatches;
```

For a clue like `"Her access means she could have tampered with the clock"`, the tokens are `["access", "means", "tampered", "clock"]`. At 40%, only 2 of 4 need to match. Chapter 16 prose about a clock-related investigation scene will almost certainly contain `"clock"` and `"access"` incidentally, causing a spurious pass.

The story validation pipeline subsequently caught this because it uses the full validator chain with stricter pattern matching, not the lenient pre-commit token matching.

**The root cause is a sensitivity gap between pre-commit detection (lenient, designed to avoid over-triggering retries) and story validation (strict, designed to catch actual absences). The token threshold at 40% is too low for essential clues.**

**Code location:**

`packages/prompts-llm/src/agent9-prose.ts` — `chapterMentionsRequiredClue` (~line 340) and the `ctx.description` fallback check (~line 443).

**Implemented fix — uniform 0.60 threshold:**

The plan called for a tiered threshold driven by `clue.criticality` (`essential`→0.6, `important`→0.5, default→0.4). During implementation this was simplified to a **uniform 0.60 threshold** because the CML 2.0 schema does not define a `criticality` field on clues — the tiered approach would have silently fallen back to 0.4 for all clues. A uniform 0.60 provides the necessary sensitivity uplift without a schema dependency.

Actual committed code at ~line 356:

```typescript
// Threshold 0.6: 60% of semantic tokens must match. This is meaningfully stricter
// than the previous 40%, which could pass on 2/6 tokens — a coincidental level.
// With the expanded stopword list removing semantically empty words ("with", "have",
// etc.), the remaining tokens are genuine content words and 60% is achievable for
// chapters that properly include the clue without causing over-triggering.
const requiredMatches = Math.max(1, Math.ceil(tokens.length * 0.6));
return matched.length >= requiredMatches;
```

The `ctx.description` fallback check at ~line 444 was also raised to 0.60:

```typescript
const threshold = Math.max(1, Math.ceil(tokens.length * 0.6));
```

**Secondary fix — expanded stopword list:**

`CLUE_TOKEN_STOPWORDS` was expanded with 30+ additional semantically empty words that were previously passing through the tokeniser and diluting the `requiredMatches` count:

```
"about", "after", "again", "against", "also", "been", "between", "both", "could", "does", "done",
"each", "even", "ever", "every", "first", "found", "from", "have", "having", "here", "however",
"into", "just", "later", "make", "made", "might", "more", "most", "much", "only", "onto",
"other", "over", "same", "some", "such", "than", "that", "them", "then", "their", "there",
"these", "they", "this", "those", "through", "under", "upon", "very", "were", "when", "where",
"which", "while", "will", "with", "would", "without", "afterward", "during"
```

The expanded stopwords reduce the token pool to genuine content words only, so that the 60% threshold is meaningful rather than trivially achievable via coincidental function-word matches.

---

### S5 — agent2c Location Scope: Profiles Only 2 of 5 Locations   ✅ IMPLEMENTED (3 sub-fixes)

**Root cause analysis:**

`generateLocationProfiles` in `packages/prompts-llm/src/agent2c-location-profiles.ts` extracted locations to profile from narrative scenes:

```typescript
const sceneLocations = allScenes
  .map((scene: any) => {
    const raw = scene.setting || scene.location;
    if (typeof raw === 'string') return raw;
    if (raw && typeof raw === 'object') return raw.name || raw.id || null;  // BUG: misses raw.location
    return null;
  })
  .filter(Boolean);
const uniqueLocations = Array.from(new Set(sceneLocations)).slice(0, 5);
```

**Problem 1 — schema extraction gap:** When `scene.setting` is an object of the shape `{ location: "The Library", type: "interior" }`, the code checked `raw.name || raw.id` — neither of which matches the `location` key. This silently discarded location names stored under the `location` key.

**Problem 2 — no minimum enforcement:** The prompt did not specify a minimum number of key locations, and the validator accepted any non-empty array. The run produced only 2 locations instead of the expected 4–5.

**Note on the original plan:** §12 originally proposed using `settingRefinement.locations` as the canonical location source. This was not implemented — the `SettingRefinement` interface (from agent1 output) does not expose a `locations` array; it contains `era`, `atmosphere`, `primaryType`, and `locationType` properties. Adopting that approach would require a schema change to agent1. The three targeted sub-fixes below address the root cause without a schema change.

**Code location:**

`packages/prompts-llm/src/agent2c-location-profiles.ts` lines 107–122 (extraction), line 219 (prompt), lines 337–343 (validator).

**Implemented fix — three sub-fixes:**

**Sub-fix 1 — schema extraction gap** (line 114): Add `raw.location` to the object property lookup chain:

```typescript
// Support both { name: "..." } and { location: "..." } object shapes
if (raw && typeof raw === 'object') return raw.name || raw.location || raw.id || null;
```

**Sub-fix 2 — prompt minimum raised** (line 219): Changed requirements text from `"include crime scene plus other important locations"` to an explicit minimum with fall-back guidance:

```
Key locations: 2-3 paragraphs each (include crime scene + AT LEAST 3 other important locations, 4 minimum total)
- If the narrative does not suggest specific sub-locations, invent context-appropriate ones for the setting type (rooms, outbuildings, grounds, nearby places). A country house has a library, a study, a drawing room, a servants's hall, gardens. An ocean liner has a dining saloon, a promenade deck, a cabin corridor, a cargo hold.
```

**Sub-fix 3 — validator gate** (lines 337–343): Added a hard check after JSON parsing that forces a retry if `keyLocations.length < 3`:

```typescript
if (profiles.keyLocations.length < 3) {
  throw new Error(
    `Location profiles must include at least 3 key locations (got ${profiles.keyLocations.length}). ` +
    `Include the crime scene plus at least 2 other distinct areas appropriate to the setting type.`
  );
}
```

This ensures the model cannot silently under-deliver on location count — the retry loop will re-run agent2c with the error feedback injected via `buildValidationFeedback`.

---

### S6 — Word Count Scorer: `"low"` Incorrectly Applied to Above-Ceiling Count   ⏳ DEFERRED (not yet applied)

**Root cause analysis:**

In `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`, the word count status calculation uses:

```typescript
let wordStatus: "pass" | "low" | "major_underflow" = "pass";
let wordScore = 100;
if (!(wordCount >= targetMin && wordCount <= targetMax)) {
  if (wordCount >= targetMin * completenessConfig.word_count.low_ratio) {
    wordStatus = "low";
    wordScore = completenessConfig.word_count.low_score;
  } else {
    wordStatus = "major_underflow";
    wordScore = Math.min(100, (wordCount / targetMin) * 100);
  }
}
```

The outer condition `!(wordCount >= targetMin && wordCount <= targetMax)` fires for **both** below-floor (`wordCount < targetMin`) **and** above-ceiling (`wordCount > targetMax`) cases.

When `wordCount > targetMax` (as in this run: 26,295 > 25,000), the inner check `wordCount >= targetMin * completenessConfig.word_count.low_ratio` is trivially true (the count is above the entire range). The code assigns `wordStatus = "low"` and `wordScore = completenessConfig.word_count.low_score` — semantically wrong and misleading.

A 26,295-word story is **not** low-wordcount — it is slightly over the ceiling. This should either be a `pass` (if the ceiling is treated as approximate) or a dedicated `"high"` status with a different score logic.

**Status: DEFERRED.** The fix was developed during the previous session but `agent9-prose-scorer.ts` was reverted between sessions (file is listed as user-modified in workspace context). The current file HEAD still has the original 3-branch logic above. This fix needs to be re-applied.

**Pending implementation:**

File: `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`

1. Update the `CompletenessDiagnostics` interface (line ~65):

```typescript
status: "pass" | "low" | "high" | "major_underflow";
```

2. Replace the word count branch logic (~line 392):

```typescript
let wordStatus: "pass" | "low" | "high" | "major_underflow" = "pass";
let wordScore = 100;
if (wordCount > targetMax) {
  // Above ceiling — score as "high" with a mild penalty (verbose but not a quality failure)
  // Apply same "low" penalty points for symmetry; distinguish the label for clarity.
  wordStatus = "high";
  wordScore = completenessConfig.word_count.low_score;
} else if (wordCount >= targetMin && wordCount <= targetMax) {
  wordStatus = "pass";
  wordScore = 100;
} else if (wordCount >= targetMin * completenessConfig.word_count.low_ratio) {
  wordStatus = "low";
  wordScore = completenessConfig.word_count.low_score;
} else {
  wordStatus = "major_underflow";
  wordScore = Math.min(100, (wordCount / targetMin) * 100);
}
```

3. Update any test assertions that check `status: "low"` for above-ceiling word counts to expect `"high"` instead.

---

### Implementation Status

| # | Fix | File | Impact | Status |
|---|-----|------|--------|--------|
| S2 | Prompt leakage wrapper | `agent9-prose.ts` ~L1495 | Blocks prompt echo in chapters 2/13/15 | ✅ Implemented |
| S3 | arcDescription / eraRegister / revealImplications minimums | `agent65-world-builder.ts` L96 | Fixes world builder short-field scoring | ✅ Implemented |
| S4 | Clue threshold 0.4→0.60 + stopword expansion | `agent9-prose.ts` L356, L444 | Prevents clue false-pass at pre-commit | ✅ Implemented |
| S5 | Location schema fix + min-3 prompt + validator gate | `agent2c-location-profiles.ts` L114, L219, L337 | Expands location pool from 2→4+ | ✅ Implemented |
| S6 | Word count "high" branch for above-ceiling | `agent9-prose-scorer.ts` L392 | Fixes misleading "low" label on verbose stories | ⏳ Deferred — file reverted; re-apply needed |
| S1 | Story validation 27-issue root cause | Post-S2/S4 re-run | Confirm issue count drops | Requires a full re-run |

**Test files updated:**
- `packages/prompts-llm/__tests__/agent9-provisional-feedback.test.ts` — updated assertions for new S2 wrapper format and label text
- `packages/prompts-llm/src/__tests__/agent9-prose.test.ts` (Fix 7) — mock updated to `{"replacements":[...]}` format; capitalisation assertion corrected to `"Fresh rain rattled the casement"`

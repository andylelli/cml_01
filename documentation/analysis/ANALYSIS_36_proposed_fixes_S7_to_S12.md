# ANALYSIS_36 — Proposed Fixes for run_1851f370 Issues (S7–S12)

**Date:** 2026-04-02  
**Supersedes:** ANALYSIS_35 §10 (proposed fixes section — written as a standalone document)  
**Source run:** `run_1851f370-ebb1-46d4-8994-f7632ef613be`  
**Based on:** ANALYSIS_35 full audit + direct source reads

> These 6 fixes address issues R1–R6 identified in ANALYSIS_35. They continue the fix series from ANALYSIS_34 §12 (S1–S6). **S7 is the only P1 abort blocker.** S8 is a recurring phase failure. S9–S12 are quality improvements.

---

## Fix Summary

| Fix | Priority | Maps to | Issue | File |
|-----|----------|---------|-------|------|
| S7  | **P1** | R1 | Behavioural clue threshold regression — S4 over-tightened | `agent9-prose.ts` |
| S8  | **P1** | R2 | arcDescription word count never enforced at generation time | `agent65-world-builder.ts` |
| S9  | P1 | R3 | Fair play timing: `CONCLUSION_RE` false positives in Act I prose | `agent9-scoring-adapter.ts` |
| S10 | P2 | R4 | storyTheme minimum not in MANDATORY block — silent undershoot | `agent65-world-builder.ts` |
| S11 | P2 | R5 | Chapter count: 19 instead of 20 — prompt already strong, needs post-parse gate | `agent7-narrative.ts` |
| S12 | P3 | R6 | `consistency_score` = 0 when no humour violations — empty-array bug | `agent65-world-builder-scorer.ts` |
| S13 | P3 | A34-S6 | Word count `"low"` label incorrectly applied to above-ceiling counts | `agent9-prose-scorer.ts` |

---

## S7 — Behavioural Clue Token Threshold (S4 Regression Fix)   ⏳ PROPOSED

### Root cause

S4 raised the clue-token match threshold uniformly from 0.40 → 0.60. This correctly prevents false-positive passes on concrete vocabulary clues (objects, names, physical actions). It was wrong to apply the same strictness to **behavioural/emotional clues** — descriptions like `"Robert Crane displays signs of nervousness when questioned about the timeline."` use abstract vocabulary (`nervousness`, `displays signs`) that natural prose invariably rewrites with synonyms (`agitated`, `visibly uneasy`, `fidgeted`). Requiring 60% token match (5 of 7 tokens) for these descriptions cannot be satisfied by synonymous paraphrase that is narratively correct.

This caused chapter 11 to exhaust its 4-attempt retry budget and abort the run.

### Source state

`packages/prompts-llm/src/agent9-prose.ts`

```
chapterMentionsRequiredClue (line ~4002):
  const requiredMatches = Math.max(1, Math.ceil(tokens.length * 0.6));

validateChapterPreCommitObligations ctx.description fallback (~line 4090):
  // Use the same 0.6 threshold as chapterMentionsRequiredClue for consistency
  const threshold = Math.max(1, Math.ceil(tokens.length * 0.6));
  isPresent = matched.length >= threshold;
```

### Change 1 — Add `isBehaviouralClue` helper (insert before `chapterMentionsRequiredClue`)

```typescript
/**
 * Returns true when the clue description primarily describes a character's
 * emotional state, demeanour, or behavioural signal rather than a concrete
 * physical observation (object, location, explicit physical action).
 * Behavioural clues use abstract vocabulary that natural prose replaces with
 * synonyms, so they use a lower token-match threshold (0.45 vs 0.60).
 */
const BEHAVIOURAL_MARKERS = new Set([
  'signs', 'displays', 'appears', 'seems', 'behaves', 'nervousness', 'anxiety',
  'guilt', 'agitation', 'emotion', 'manner', 'demeanour', 'attitude', 'reaction',
  'response', 'suspicious', 'evasive', 'uncomfortable', 'uneasy', 'distressed',
  'flustered', 'hesitant', 'fidgets', 'fidgeting', 'avoids', 'deflects', 'reluctant',
]);

const isBehaviouralClue = (description: string | null | undefined): boolean => {
  if (!description) return false;
  const lower = description.toLowerCase();
  return [...BEHAVIOURAL_MARKERS].some((marker) => lower.includes(marker));
};
```

### Change 2 — Type-aware threshold in `chapterMentionsRequiredClue`

**Before:**
```typescript
  const requiredMatches = Math.max(1, Math.ceil(tokens.length * 0.6));
  return matched.length >= requiredMatches;
```

**After:**
```typescript
  // Behavioural/emotional clues use synonym-rich vocabulary; 0.45 accommodates natural
  // paraphrase while still requiring substantial semantic coverage (e.g. 3 of 7 tokens).
  const matchThreshold = isBehaviouralClue(clue?.description) ? 0.45 : 0.60;
  const requiredMatches = Math.max(1, Math.ceil(tokens.length * matchThreshold));
  return matched.length >= requiredMatches;
```

### Change 3 — Type-aware threshold in `validateChapterPreCommitObligations` ctx fallback

**Before:**
```typescript
          // Use the same 0.6 threshold as chapterMentionsRequiredClue for consistency
          const threshold = Math.max(1, Math.ceil(tokens.length * 0.6));
          isPresent = matched.length >= threshold;
```

**After:**
```typescript
          const ctxMatchThreshold = isBehaviouralClue(ctx.description) ? 0.45 : 0.60;
          const threshold = Math.max(1, Math.ceil(tokens.length * ctxMatchThreshold));
          isPresent = matched.length >= threshold;
```

### Lines NOT changed

| Location | Threshold | Reason |
|----------|-----------|--------|
| `chapterClueAppearsEarly` (0.25) | 25% | Paragraph-window early detection — different semantic requirement |
| Early-placement ctx fallback (~line 4122, 0.4) | 40% | ±1 token tolerance for early-window check |
| NSD visibility fallback (~line 5845, 0.4) | 40% | Narrative state tracking — different function |

### Expected outcome

The aborted clue `"Robert Crane displays signs of nervousness when questioned about the timeline."` tokenises to 7 content words. With 0.45 threshold: `ceil(7 × 0.45) = 4` required matches instead of `ceil(7 × 0.60) = 5`. Prose like `"Crane grew visibly agitated as the conversation turned to his movements that evening"` matching `crane`, `signs` (root), `nervousness` (via `agitation`), `questioned` (via `conversation`) — 4 matches — will pass. The chapter 11 abort should not recur.

---

## S8 — arcDescription Post-Parse Word Count Gate + Retry   ⏳ PROPOSED

### Root cause

S3 added the `storyEmotionalArc.arcDescription: MINIMUM 200 words` directive to the agent65 system prompt. This improved output from 99 → 177 words. But the enforcement is advisory only — there is no runtime check in the retry loop. The model is not penalised for undershoot, so it produces 177 words instead of 200 without triggering a retry with an explicit correction demand.

The retry loop in `agent65-world-builder.ts` already handles JSON parse failure, schema validation failure, cast coverage failure, and validationConfirmations failure with `lastError + continue`. The `lastError.message` is injected into the next attempt as a user message, which is an effective correction mechanism. The arcDescription shortfall just needs to be hooked into this same machinery.

### Source state

`packages/prompts-llm/src/agent65-world-builder.ts`

The retry loop runs attempts 1 and 2 (2 total). After all existing checks, it executes:
```typescript
    inputs.onProgress?.('world-builder', 'World document complete');
    return parsed;
```

There is no word count check before `return parsed`.

### Change — Insert arcDescription word count check before `return parsed`

Insert the following block immediately after the `validationConfirmations` gate and before the `return parsed` line:

```typescript
    // arcDescription word count enforcement — at-generation gate so the retry
    // loop can surface the exact shortfall in the correction prompt.
    const arcDesc = parsed.storyEmotionalArc?.arcDescription ?? '';
    const arcWordCount = arcDesc.trim().split(/\s+/).filter(Boolean).length;
    if (arcWordCount < 200) {
      lastError = new Error(
        `arcDescription is ${arcWordCount} words — MINIMUM is 200 words, target 250 words. ` +
        `Your arc description is too short. Expand it with at least one additional paragraph ` +
        `that traces the emotional register across all three acts. Do not truncate any section.`
      );
      if (attempt === 2) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }
```

### Why this works

The retry message at attempt 2 includes:
```
The previous response failed validation with this error:
arcDescription is 177 words — MINIMUM is 200 words, target 250 words. ...
```

This is concrete, specific, and actionable. The model can comply on a single retry by expanding one paragraph.

### Expected outcome

- Attempt 1 produces 177-word arcDescription → gate fires → retry with explicit shortfall message
- Attempt 2 produces ≥200-word arcDescription → gate passes → `return parsed`
- World Builder phase passes threshold (≥70) with arcDescription at full score

---

## S9 — Fair Play Timing: `CONCLUSION_RE` False Positives in Act I   ⏳ PROPOSED

### Root cause

The D7 timing check in `adaptProseForScoring` identifies "deduction chapters" using `CONCLUSION_RE`:
```javascript
/\b(that proves|which proves|therefore...|the only explanation|conclusively shows|
   i accuse|i name|you are the|the murderer is|it follows that|this confirms|
   the truth is)\b/i
```

Chapters 1, 4, 5, and 7 were flagged as timing violators in run_1851f370. Chapter 1 is always the crime-discovery chapter — "the truth is", "it follows that", and "this confirms" are common narrator/character voice constructions that appear routinely in opening and investigation prose. They are not detective deduction language. When these patterns match in early chapters where clues are first being revealed, the adapter registers spurious violations.

The same issue was present (less severely) in ANALYSIS_34 (chapters 1, 3, 9) — chapter 1 is a consistent false-positive across all runs.

### Two-part fix

`apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts`

#### Part A — Tighten `CONCLUSION_RE`

Remove the three patterns that generate false positives while keeping those that only appear in genuine deduction/accusation passages:

**Before:**
```javascript
const CONCLUSION_RE =
  /\b(that proves|which proves|therefore[^.!?]{0,60}(?:culprit|guilty|murderer)|the only explanation|conclusively shows|i accuse|i name|you are the|the murderer is|it follows that|this confirms|the truth is)\b/i;
```

**After:**
```javascript
// D7: Only match language that is directly accusatory or uniquely deductive.
// Removed: "the truth is", "it follows that", "this confirms" — these appear
// routinely in narrative prose and generate false-positive timing violations
// in Act I chapters where clues are first being established.
const CONCLUSION_RE =
  /\b(that proves|which proves|therefore[^.!?]{0,60}(?:culprit|guilty|murderer)|the only explanation|conclusively shows|i accuse|i name|you are the|the murderer is)\b/i;
```

#### Part B — Add early-chapter exemption

Even after tightening, Act I chapters should never trigger timing violations: the detective hasn't formed conclusions yet, and any rhetorical language that survives the tightened pattern is still likely narrative voice. Add a guard before the `isDeductionChapter` classification:

**Before:**
```javascript
  const fairPlayTimingViolations: Array<{ clue_id: string; chapter: number }> = [];
  for (const chapter of chapters) {
    const isDeductionChapter =
      chapter.discriminating_test_present || CONCLUSION_RE.test(chapter.prose);
```

**After:**
```javascript
  const fairPlayTimingViolations: Array<{ clue_id: string; chapter: number }> = [];
  // Act I chapters (first ~25% of story) cannot be deduction chapters by definition:
  // the detective is establishing context, not drawing conclusions. This exemption
  // prevents CONCLUSION_RE false positives in setup and early investigation chapters.
  const actIExemptionEnd = Math.ceil(chapters.length * 0.25);
  for (const chapter of chapters) {
    const inActI = chapter.chapter_number <= actIExemptionEnd;
    const isDeductionChapter =
      !inActI && (chapter.discriminating_test_present || CONCLUSION_RE.test(chapter.prose));
```

### Expected outcome

Chapters 1, 4, 5 (Act I of a 10-chapter partial story, where 25% = ch 1–3 are fully exempt, and the tightened CONCLUSION_RE eliminates "the truth is" / "it follows that" false positives for chapters 4–5) should cease triggering. Chapter 7 should also clear if its violation was driven by the removed patterns. The fair play timing component should improve from 0/15 → 15/15 on a run with proper clue sequencing.

---

## S10 — storyTheme Minimum Word Count in MANDATORY Block   ⏳ PROPOSED

### Root cause

The agent65 prompt's `MANDATORY FIELD LENGTHS` block lists explicit minimums for `historicalMoment.eraRegister`, `storyEmotionalArc.arcDescription`, and `revealImplications`. `storyTheme` is absent from this block. The schema placeholder (`"<one sentence — story's deeper meaning, not a plot summary>"`) gives guidance on content but sets no word count floor. The model produced 19 words (1 short of the scorer's ≥20 threshold) in run_1851f370 — a silent undershoot.

The scorer (`agent65-world-builder-scorer.ts`) tests: ≥20 words → pass, ≥10 words → partial (50/100), <10 words → fail.

### Source state

`packages/prompts-llm/src/agent65-world-builder.ts`

Current MANDATORY FIELD LENGTHS block (line ~96):
```
MANDATORY FIELD LENGTHS:
- historicalMoment.eraRegister: MINIMUM 150 words. ...
- storyEmotionalArc.arcDescription: MINIMUM 200 words, target 250 words. ...
- revealImplications: MINIMUM 90 words. ...
```

`storyTheme` is NOT listed.

### Change — Add `storyTheme` entry to MANDATORY FIELD LENGTHS block

**Insert after the `revealImplications` line:**

```
- storyTheme: MINIMUM 20 words. Write a complete sentence with a subject, main
  clause, and a nuanced qualifier. Not a title, a fragment, or a noun phrase.
  Example: "The story explores how grief can masquerade as virtue, and how the
  most dangerous lies are the ones we tell ourselves to justify love."
```

### Expected outcome

The model will count words before submitting. 19-word themes will be extended to meet the 20-word minimum. Combined with S8, both World Builder quality tests (arcDescription and storyTheme) should pass in a single attempt.

---

## S11 — Chapter Count: Post-Parse Enforcement Gate   ⏳ PROPOSED

### Root cause

Agent7's `buildUserRequest` already contains the instruction:
> **CRITICAL — Scene count is FIXED:** You MUST produce EXACTLY **${totalSceneCount} scenes** total: **${actIScenes} in Act I**, **${actIIScenes} in Act II**, **${actIIIScenes} in Act III**. No more, no fewer. Count your scenes before submitting.

Despite this, every run produces 19 chapters instead of 20. The model appears to consistently compute act-scene splits that sum to 19 (e.g. 5+9+5=19 instead of 5+9+6=20 for medium length). There is no post-parse validation that throws on a wrong count — the pipeline accepts whatever the model returns.

### Source state

`packages/prompts-llm/src/agent7-narrative.ts`

`formatNarrative` parses the JSON, validates `acts` array exists, then directly returns. The `totalScenes` and `allScenes.length` are computed but only used for completion of missing fields — not as a hard gate.

### Change — Add post-parse scene count assertion

**Insert after the existing `outlineData.totalScenes` / `outlineData.estimatedTotalWords` completion block:**

```typescript
  // Hard gate: the LLM must produce exactly the requested number of scenes.
  // The CRITICAL instruction in the user prompt has not been sufficient alone.
  // Throwing here forces the pipeline to handle the failure explicitly rather than
  // silently accepting a 19-chapter story planned as 20.
  const allScenes = (outlineData.acts ?? []).flatMap((act: any) =>
    Array.isArray(act.scenes) ? act.scenes : []
  );
  const expectedScenes = getSceneTarget(inputs.targetLength ?? 'medium');
  if (allScenes.length !== expectedScenes) {
    throw new Error(
      `Narrative outline has ${allScenes.length} scenes but EXACTLY ${expectedScenes} are required. ` +
      `Check act scene counts: ${(outlineData.acts ?? []).map((a: any, i: number) =>
        `Act ${i + 1}: ${Array.isArray(a.scenes) ? a.scenes.length : 0}`
      ).join(', ')}.`
    );
  }
```

### Additional prompt reinforcement

**In `buildUserRequest`, strengthen the count directive (after the current CRITICAL line):**

```
**CRITICAL — Scene count is FIXED:** You MUST produce EXACTLY **${totalSceneCount} scenes** total: **${actIScenes} in Act I**, **${actIIScenes} in Act II**, **${actIIIScenes} in Act III**. No more, no fewer. Count your scenes before submitting.

VALIDATION REMINDER: ${actIScenes} + ${actIIScenes} + ${actIIIScenes} = ${totalSceneCount}. If your act totals do not sum to ${totalSceneCount}, adjust Act III before submitting. Submitting ${totalSceneCount - 1} scenes will fail validation and cause the full run to abort.
```

### Expected outcome

A 19-scene outline will throw before the pipeline accepts it. The pipeline's error handling will surface the count mismatch clearly. When combined with the stronger prompt arithmetic reminder, the model should produce the correct count on first attempt for most runs.

---

## S12 — `consistency_score` = 0 on Passes (Empty Test Array Bug)   ⏳ PROPOSED

### Root cause

In `agent65-world-builder-scorer.ts`, the consistency score is computed with:
```typescript
const consistency_score = calculateCategoryScore(tests, 'consistency');
```

The only tests placed in the `'consistency'` category are the three humour-position checks inside `scoreHumourPlacementMap` (for `body_discovery`, `discriminating_test`, `revelation` — positions where humour is forbidden). When none of those positions are violated, the three tests all pass and are placed in non-consistency categories. The `calculateCategoryScore` call receives an empty array of consistency tests and returns 0 — indicating a failure state, when in fact 100 is correct (no violations).

The total formula:
```typescript
const total = validation_score * 0.4 + quality_score * 0.25 + completeness_score * 0.25 + consistency_score * 0.1;
```

With `consistency_score = 0`, this silently deducts 10% from every World Builder phase score, even on runs with no consistency issues. In run_1851f370, World Builder scored 84 instead of ~91 partly due to this.

### Source state

`packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts`

```typescript
// line ~74
const consistency_score = calculateCategoryScore(tests, 'consistency');
```

No guard for empty category.

### Change

**Before:**
```typescript
    const consistency_score = calculateCategoryScore(tests, 'consistency');
```

**After:**
```typescript
    // Guard: if no consistency tests were generated (no humour position violations to check),
    // default to 100 — absence of violations is a pass, not a score of 0.
    const consistencyTestsExist = tests.some((t) => t.category === 'consistency');
    const consistency_score = consistencyTestsExist
      ? calculateCategoryScore(tests, 'consistency')
      : 100;
```

### Expected outcome

World Builder runs with clean humour placement (no forbidden-position violations) will have `consistency_score = 100`, contributing 10 points to the total from 0. The total formula will compute correctly. A run equivalent to run_1851f370 would score ~91/B rather than ~84/B on the World Builder phase, and may clear the 75 threshold without triggering a retry.

Note: this also fixes ANALYSIS_34's World Builder score retroactively — both runs were penalised by this bug.

---

---

## S13 — Word Count Scorer: `"low"` Label on Above-Ceiling Count   ⏳ PROPOSED

### Root cause

Originally ANALYSIS_34 S6 — deferred when `agent9-prose-scorer.ts` was reverted and never re-applied.

In `agent9-prose-scorer.ts`, the word count status logic uses a single outer condition:
```typescript
if (!(wordCount >= targetMin && wordCount <= targetMax)) {
```
This fires for **both** below-floor AND above-ceiling. The inner branch then assigns `wordStatus = "low"` for above-ceiling counts because `wordCount >= targetMin * low_ratio` is trivially true when wordCount is already above `targetMax`. A 26,295-word story (above the 25,000 ceiling) is labelled `"low"` — semantically wrong and misleading in diagnostics and structured reports.

### Source state

`packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`

**Interface (line 65):**
```typescript
    status: "pass" | "low" | "major_underflow";
```

**Branch logic (lines 392–400):**
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

### Change 1 — Update interface

**Before:**
```typescript
    status: "pass" | "low" | "major_underflow";
```

**After:**
```typescript
    status: "pass" | "low" | "high" | "major_underflow";
```

### Change 2 — Fix branch logic

**Before:**
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

**After:**
```typescript
      let wordStatus: "pass" | "low" | "high" | "major_underflow" = "pass";
      let wordScore = 100;
      if (wordCount > targetMax) {
        // Above ceiling — verbose but not a structural failure; mild symmetric penalty.
        wordStatus = "high";
        wordScore = completenessConfig.word_count.low_score;
      } else if (wordCount < targetMin) {
        if (wordCount >= targetMin * completenessConfig.word_count.low_ratio) {
          wordStatus = "low";
          wordScore = completenessConfig.word_count.low_score;
        } else {
          wordStatus = "major_underflow";
          wordScore = Math.min(100, (wordCount / targetMin) * 100);
        }
      }
```

### Change 3 — Update `tests.push` message for above-ceiling

The `tests.push` block immediately after the branch also needs a dedicated above-ceiling arm. The current middle branch `wordCount >= targetMin * completenessConfig.word_count.low_ratio` will no longer fire for above-ceiling counts, but the test message should reflect the "high" state:

**Before (the `tests.push` call, lines ~417–423):**
```typescript
      tests.push(
        wordCount >= targetMin && wordCount <= targetMax
          ? pass('Word count target', 'completeness', 1.5, `${wordCount.toLocaleString()} words`)
          : wordCount >= targetMin * completenessConfig.word_count.low_ratio
          ? partial('Word count target', 'completeness', completenessConfig.word_count.low_score, 1.5, `${wordCount.toLocaleString()} words (low)`, 'minor')
          : partial('Word count target', 'completeness', Math.min(100, (wordCount / targetMin) * 100), 1.5, `Only ${wordCount.toLocaleString()} words`, 'major')
      );
```

**After:**
```typescript
      tests.push(
        wordCount >= targetMin && wordCount <= targetMax
          ? pass('Word count target', 'completeness', 1.5, `${wordCount.toLocaleString()} words`)
          : wordCount > targetMax
          ? partial('Word count target', 'completeness', completenessConfig.word_count.low_score, 1.5, `${wordCount.toLocaleString()} words (above ceiling ${targetMax.toLocaleString()})`, 'minor')
          : wordCount >= targetMin * completenessConfig.word_count.low_ratio
          ? partial('Word count target', 'completeness', completenessConfig.word_count.low_score, 1.5, `${wordCount.toLocaleString()} words (low)`, 'minor')
          : partial('Word count target', 'completeness', Math.min(100, (wordCount / targetMin) * 100), 1.5, `Only ${wordCount.toLocaleString()} words`, 'major')
      );
```

### Expected outcome

A story of 26,295 words (above the 25,000 ceiling) is labelled `"high"` rather than `"low"` in the diagnostic output. Scoring penalty is symmetric (same `low_score` applies). No test that checks for `status: "low"` on an above-ceiling count will pass without updating the assertion — any such tests must be updated to expect `"high"`.

---

## Implementation Order

Apply in this sequence to minimise interference:

1. **S7** — Isolate the abort blocker before adding any other changes
2. **S8 + S10** — Both target `agent65-world-builder.ts` — apply in one pass to avoid re-opening the file
3. **S12** — Single-line scorer fix — apply after S8/S10 since scorer tests depend on generator output
4. **S9** — Adapter fix — independent of all others, apply separately
5. **S11** — Adds a throw path to agent7 — test that the narrative scorer and pipeline handle it gracefully before committing
6. **S13** — Scorer interface + branch logic — isolated to `agent9-prose-scorer.ts`, update any test asserting `status: "low"` for above-ceiling counts

## Verification criteria

| Fix | Verification |
|-----|-------------|
| S7 | Behavioural clue runs to completion; chapter 11 does not abort; 4 test tokens match in prose |
| S8 | arcDescription ≥200 words in World Builder output on first or second attempt |
| S9 | Fair play timing violations in chapters 1–3 no longer fire; chapter count for violation drops to 0 or 1 on normal runs |
| S10 | storyTheme ≥20 words on first attempt |
| S11 | A run with 19-chapter outline throws with a clear count error rather than silently proceeding |
| S12 | World Builder scorer `consistency_score` = 100 when no humour position violations; total score improves by ~7 points |
| S13 | Above-ceiling word count reports `status: "high"` not `"low"` in scorer diagnostics |

# ANALYSIS_45 — Underflow Prose Generator: Root Cause Analysis (Always Triggers)

**Date:** 2026-04-06
**Prior references:** ANALYSIS_44 §4.1, run_log.md entries for all 28 runs, scoring.jsonl lines 67–78
**Status:** ROOT CAUSE ESTABLISHED — fix options below

---

## 1. Symptom

Agent 9's underflow expansion LLM call fires on **every single chapter in every single run**. The `underflow_expansion_attempts` telemetry equals total chapter count across all observed completed runs:

| Run                   | Chapters | Expansion attempts | Hard-floor misses | Preferred-miss (unique chs) | Floor ratio  |
|-----------------------|----------|--------------------|-------------------|------------------------------|--------------|
| run_73cef345 (short)  | 18       | ≥18                | 11 (first pass)   | 18                           | 0.88 (old)   |
| run_bbf9e661 (short)  | 18       | 18                 | 11                | 18                           | 0.88 (old)   |

Scoring field name: `word_underflow_preferred_target_misses`.  
Note: this field is a **cumulative event counter**, not a unique-chapter counter — batch retries increment it multiple times for the same chapter. The unique chapter lists are in `chapters_with_preferred_target_miss`.

---

## 2. Evidence

### 2.1 Scoring counters

From `scoring.jsonl` (run_73cef345, first-pass snapshot):

```json
"chapter_words_hard_floor":704,
"chapter_words_preferred_target":1300,
"chapter_words_hard_floor_miss_count":11,
"chapter_words_preferred_target_miss_count":22,
"chapters_with_hard_floor_miss":[2,3,4,6,8,11,13,14,15,16,17],
"chapters_with_preferred_target_miss":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18],
"word_underflow_hard_floor_misses":11,
"word_underflow_preferred_target_misses":22
```

Key observation: **all 18 chapters appear in `chapters_with_preferred_target_miss`** even though only 11 are in `chapters_with_hard_floor_miss`. The 7 chapters not in the hard-floor miss list are above the floor (704 words) but still below the preferred target (1300 words). They trigger expansion via a separate code path (`hasPreferredMissOnly`).

The `preferred_target_miss_count: 22` vs. 18 unique chapters: the count increments on every re-evaluation, including retries. Four batch retries (ch7 overlong, ch9 atmosphere, ch13 floor, ch14 season) caused 4 extra evaluation events → 18 + 4 = 22.

### 2.2 Batch failure evidence from run_73cef345

```
ch13: "word count below hard floor (694/704)"   → hasHardFloorUnderflow
ch5:  "word count below hard floor (626/704)"   → hasHardFloorUnderflow
ch11: "word count below hard floor (700/704)"   → hasHardFloorUnderflow (twice)
ch15: "word count below hard floor (684/704)"   → hasHardFloorUnderflow
```

These are hard-floor misses. All other chapters (those NOT in `chapters_with_hard_floor_miss`) are above floor but below preferred, and trigger via the preferred-only path.

### 2.3 ANALYSIS_44 confirmation

ANALYSIS_44 §4.1 documents ch8 of run_bbf9e661: "Passed on attempt 2 after underflow expansion." This confirms the expansion fires within the chapter generation loop.

---

## 3. Code Trace — Trigger Logic

**File:** `packages/prompts-llm/src/agent9-prose.ts`

### 3.1 The `evaluateCandidate` closure (lines 3711–3789)

Called once per chapter attempt with `trackUnderflow = true` on the FIRST evaluation:

```typescript
const evaluateCandidate = (candidate: ProseChapter, trackUnderflow = true) => {
  // ... hard validation errors ...
  const obligations = ledgerEntry
    ? validateChapterPreCommitObligations(...)
    : undefined;
  if (obligations) {
    hardErrors.push(...obligations.hardFailures);
    if (trackUnderflow) {
      if (obligations.wordTarget.isBelowHardFloor) {      // word count < hardFloorWords
        hardFloorMissCount += 1;
        hardFloorMissChapters.add(chapterNumber);
      } else if (obligations.wordTarget.isBelowPreferred) { // above floor, below preferred
        preferredTargetMissCount += 1;
        preferredTargetMissChapters.add(chapterNumber);
      }
    }
  }

  const hasOnlyHardFloorUnderflow = hardErrors.every(e => /word count below hard floor/i.test(e));
  const hasHardFloorUnderflow     = hardErrors.some(e => /word count below hard floor/i.test(e));
  const hasPreferredMissOnly      = hardErrors.length === 0 && preferredMisses.length > 0;
  return { hardErrors, hasHardFloorUnderflow, hasPreferredMissOnly, ... };
};
```

### 3.2 The expansion trigger (lines 3792–3830)

```typescript
if ((evaluation.hasHardFloorUnderflow || evaluation.hasPreferredMissOnly) && ledgerEntry) {
  underflowExpansionAttempts += 1;
  const expanded = await attemptUnderflowExpansion(...);
  ...
  evaluation = evaluateCandidate(chapter, false); // false = don't re-count
  if (evaluation.hasOnlyHardFloorUnderflow || evaluation.hardErrors.length > 0) {
    underflowExpansionFailed += 1;
  } else {
    underflowExpansionRecovered += 1;
  }
}
```

**Two trigger paths:**
1. `hasHardFloorUnderflow` — fires when word count < hard floor (hard error, batch is retried if expansion fails)
2. `hasPreferredMissOnly` — fires when ALL hard checks pass but word count < preferred target

### 3.3 Word target computation (lines 192–204)

```typescript
const getChapterWordTargets = (targetLength: "short" | "medium" | "long") => {
  const config = getGenerationParams().agent9_prose.word_policy;
  return {
    hardFloorWords: Math.max(
      config.min_hard_floor_words,         // 600
      Math.floor(config.preferred_chapter_words[targetLength] * config.hard_floor_relaxation_ratio),
    ),
    preferredWords: config.preferred_chapter_words[targetLength],
  };
};
```

### 3.4 Current config values (`apps/worker/config/generation-params.yaml`)

```yaml
agent9_prose:
  word_policy:
    hard_floor_relaxation_ratio: 0.4        # comment: "0.77 gives short:1001/medium:1232/long:1848"
    min_hard_floor_words: 600
    preferred_chapter_words:
      short: 1300
      medium: 1600
      long: 2400
```

**Computed hard floors at ratio = 0.4:**

| Length | Preferred | floor(pref × 0.4) | max(600, above) | Gap (pref − floor) |
|--------|-----------|-------------------|-----------------|---------------------|
| short  | 1300      | 520               | **600**         | 700 words           |
| medium | 1600      | 640               | **640**         | 960 words           |
| long   | 2400      | 960               | **960**         | 1440 words          |

---

## 4. Root Causes

### RC-1 (PRIMARY): `hasPreferredMissOnly` fires for any chapter shorter than preferred

The `hasPreferredMissOnly` path fires whenever `hardErrors.length === 0` AND the chapter is below `preferredWords`. With the hard floor at 600–640 words for short/medium stories, any chapter the model generates naturally (700–1100 words) clears the floor and triggers `hasPreferredMissOnly`. Since the preferred target (1300–1600) significantly exceeds the LLM's natural chapter output, this fires on **every chapter** with no exceptions.

**This converts expansion from an emergency fallback to a mandatory second pass.**

### RC-2 (SECONDARY): hard_floor_relaxation_ratio lowered from 0.77 to 0.4

**How the hard floor is computed:**

```typescript
hardFloorWords = Math.max(
  config.min_hard_floor_words,          // 600 — safety clamp only
  Math.floor(preferred × ratio),        // the intended formula
);
```

The ratio is the **primary mechanism** for setting the floor. `min_hard_floor_words: 600` is a safety clamp that prevents the formula from returning an absurdly low value — it is not the intended floor.

At ratio = 0.4:
- short:  `max(600, floor(1300 × 0.4))` = `max(600, 520)` → **600** (safety clamp fires — ratio is irrelevant for short)
- medium: `max(600, floor(1600 × 0.4))` = `max(600, 640)` → **640** (barely above clamp)
- long:   `max(600, floor(2400 × 0.4))` = `max(600, 960)` → **960**

For short stories the ratio is completely overridden by the safety clamp, meaning `hard_floor_relaxation_ratio` has zero effect on the expansion gate. The floor sits at 600 regardless of what the ratio is set to (as long as it is ≤ ~0.46).

The YAML comment says `"0.77 gives short:1001/medium:1232/long:1848"` — those were the correct, intended floors. Lowering the ratio to 0.4 forced the safety clamp to take over for short stories and produced near-useless floors for all lengths.

The total expansion rate did not improve; it just shifted which code path triggers expansion and bypassed the intended ratio calculation entirely for short stories.

**History of hard floor evolution:**
| Era                 | Formula                            | Short floor | Medium floor |
|---------------------|------------------------------------|-------------|--------------|
| Ancient (pre-Mar)   | floor(chapter_ideal × 0.88)       | 704 (from 800 base) | ~1056 |
| Mid (config 0.77)   | floor(preferred × 0.77)           | 1001        | 1232         |
| Current (config 0.4)| floor(preferred × 0.4) → clamp    | 600 (clamp) | 640          |

### RC-3: LLM natural chapter output falls below preferred target

The main generation prompt instructs the LLM:
> "MINIMUM 600 words; TARGET ≥ 1300 words"

The model interprets MINIMUM as the floor it must clear (easy at 600) and treats TARGET as aspirational. Observed LLM output across completed runs: **700–1100 words for short/medium stories**. This is always below preferred (1300/1600), so 100% of chapters miss the preferred target.

Evidence: `chapters_with_preferred_target_miss: [1,2,...,18]` — all 18 chapters in every run.

### RC-4: Prompt section inflating "MINIMUM" vs "TARGET" confusion

The chapter guidance in the main prompt (line 2110–2112) presents the hard floor as a minimum count and the preferred as a target:
> "5-10 substantial paragraphs (each 120–180 words) — MINIMUM 600 words; TARGET ≥ 1300 words — do not stop early"

With the minimum set at 600 and paragraphs asked to be 120–180 words each, 5 paragraphs × 150 words = 750 words clears the MINIMUM and the model treats 750 as "done." The model is not penalized for undershooting TARGET.

---

## 5. Consequence Analysis

### 5.1 Cost and latency

Each chapter requires **2 LLM calls** instead of 1:
- Main generation call: 4500 tokens (short/medium), temperature 0.42
- Expansion call: 3000 tokens, temperature 0.18

For a 20-chapter story: 40 LLM calls instead of 20. Observed prose cost for run_73cef345: $0.0267 (first pass) + $0.0524 (repair pass) = $0.079. Without expansion: ~$0.027.

### 5.2 Prompt leakage risk

When expansion fails (`evaluateCandidate(chapter, false)` returns hard errors), `underflowExpansionFailed` increments but the chapter **is committed anyway** if it clears the retry threshold. ANALYSIS_44 §4.1 documented a specific case (ch9, run_bbf9e661) where expansion failure produced scaffold text leaking into the committed chapter ("Chapter 9 is below the preferred target... Expand by...").

### 5.3 False metric inflation

`word_underflow_preferred_target_misses` in scoring.jsonl is a cumulative event count (includes retries), not a unique-chapter count. The true unique miss count is in `chapters_with_preferred_target_miss`. Comparing a 22-miss count to an 18-chapter story is misleading — the 4-chapter discrepancy comes from retries, not 22 unique failures.

---

## 6. Fix Options

### FIX-45A (RECOMMENDED): Remove `hasPreferredMissOnly` expansion trigger

**Change:** In `evaluateCandidate` at line ~3792, remove the `evaluation.hasPreferredMissOnly` branch. Expansion fires only for `hasHardFloorUnderflow`.

```typescript
// BEFORE:
if ((evaluation.hasHardFloorUnderflow || evaluation.hasPreferredMissOnly) && ledgerEntry) {

// AFTER:
if (evaluation.hasHardFloorUnderflow && ledgerEntry) {
```

**Effect:**
- Chapters that clear the hard floor but miss preferred target are committed as-is
- Expansion fires only for truly deficient chapters (below hard floor)
- LLM call count cut by ~50% for typical runs

**Risk:** Story word counts may dip if many chapters land at 700–1000 words. Mitigated by FIX-45B.

---

### FIX-45B (COMPANION): Raise hard_floor_relaxation_ratio from 0.4 to 0.65

**Change:** In `apps/worker/config/generation-params.yaml`:

```yaml
agent9_prose:
  word_policy:
    # Hard floor = max(min_hard_floor_words, floor(preferred * ratio))
    # min_hard_floor_words: 600 is a safety clamp only — it fires when ratio * preferred < 600.
    # At 0.65: short:845 / medium:1040 / long:1560  (all above 600 — ratio in full control)
    # At 0.77: short:1001 / medium:1232 / long:1848  (old value, also above clamp)
    # At 0.4:  short:600(CLAMP) / medium:640 / long:960  (clamp overrides for short)
    hard_floor_relaxation_ratio: 0.65    # was 0.4
```

**Computed floors at 0.65 — safety clamp not needed for any length:**

| Length | Preferred | floor(pref × 0.65) | max(600, above) | Clamp active? |
|--------|-----------|---------------------|-----------------|---------------|
| short  | 1300      | 845                 | **845**         | No            |
| medium | 1600      | 1040                | **1040**        | No            |
| long   | 2400      | 1560                | **1560**        | No            |

At 0.65 the ratio is doing its intended job for all story lengths — the 600 clamp is never reached. This is the correct state: the clamp should only intervene for pathological configurations, not routine operation.

**Effect:** Any chapter below ~65% of preferred triggers expansion. Expansion rate drops from 100% to the fraction of chapters genuinely below this threshold (expected ~5–25% per run). Short-story floors are restored to meaningful levels (845 vs 600) and the safety clamp is no longer silently overriding the ratio.

---

### FIX-45C (OPTIONAL): Add COUNT directive to main generation prompt

**Change:** In `buildProsePrompt`, make the preferred word count a hard gate in the instructions rather than a soft target:

> "Each chapter MUST have at least X words of narrative prose. Treat this as a mandatory minimum, not a suggestion."

**Effect:** Reduces the gap between main-call output and preferred target, further reducing expansion rate.

---

## 7. Recommended Action Plan

**Priority order:** FIX-45A → FIX-45B → optionally FIX-45C

1. Remove `hasPreferredMissOnly` from expansion trigger (FIX-45A) — this fixes the primary cause.
2. Raise hard_floor_relaxation_ratio to 0.65 (FIX-45B) — ensures the hard floor is meaningful, expansion fires only for genuinely thin chapters (~5–25% of chapters vs 100%).
3. Optionally improve main prompt word count forcing (FIX-45C) — long-term improvement to LLM output density.
4. Update YAML comment to describe new ratio (0.65 gives short:845 / medium:1040 / long:1560).

---

## 8. Acceptance Criteria

After applying FIX-45A + FIX-45B:

| Criterion                                        | Target                              |
|--------------------------------------------------|-------------------------------------|
| `underflow_expansion_attempts` per run           | < 25% of total chapters             |
| `underflow_expansion_failed` per run             | 0 (or 1 at most)                    |
| Expansion-failure prompt leakage events          | 0 per run                           |
| Story word count (short 20-ch)                   | ≥ 15,000 words (within story_length_policy bounds) |
| Run grade                                        | ≥ B (baseline was 99.21/A in ANALYSIS_44) |
| `chapters_with_hard_floor_miss` unique count     | < 25% of chapter count              |
| `chapters_with_preferred_target_miss` unique count | < 25% of chapter count            |

---

## 9. Files Affected

| File | Change |
|------|--------|
| `packages/prompts-llm/src/agent9-prose.ts` | Remove `hasPreferredMissOnly` from expansion trigger condition (line ~3792) |
| `apps/worker/config/generation-params.yaml` | `hard_floor_relaxation_ratio: 0.65` (was `0.4`); update comment |
| `documentation/prose-generation.md` | Document that expansion fires only for hard-floor underflow, not preferred-miss |

---

---

## 10. What the LLM Is Told About Chapter Sizes

The main generation call assembles word count guidance from **four separate instruction blocks** inserted into the prompt at different levels. All code references are `packages/prompts-llm/src/agent9-prose.ts`.

### 10.1 Schema / Requirements block — `chapterGuidance` (line ~2113)

Dynamically computed per story length, placed in the `developer` role message inside the output schema requirements:

```
Each chapter has <N_MIN>-<N_MAX> substantial paragraphs (each <PW_MIN>–<PW_MAX> words)
  — MINIMUM <hardFloorWords> words; TARGET ≥ <preferredWords> words — do not stop early
```

**Formula:**
```typescript
min_paras = Math.ceil(hardFloorWords / perParaMin)
max_paras = Math.ceil((preferredWords + 200) / perParaMax) + 1
```

**Resolved values at current config (ratio = 0.4):**

| Length | Hard floor | Preferred | Per-para range | Result string                                                              |
|--------|------------|-----------|----------------|----------------------------------------------------------------------------|
| short  | 600        | 1300      | 120–180 words  | `5-10 substantial paragraphs — MINIMUM 600 words; TARGET ≥ 1300 words`    |
| medium | 640        | 1600      | 150–220 words  | `5-10 substantial paragraphs — MINIMUM 640 words; TARGET ≥ 1600 words`    |
| long   | 960        | 2400      | 180–250 words  | `6-11 substantial paragraphs — MINIMUM 960 words; TARGET ≥ 2400 words`    |

### 10.2 Word Count Contract block — `wordCountContract` (line ~2119)

Injected immediately before `NOVEL-QUALITY PROSE REQUIREMENTS`:

```
WORD COUNT CONTRACT (NON-NEGOTIABLE):
- Target: AT LEAST <chapterTargetWords> words per chapter. Do not stop before reaching this threshold.
- Overshoot rather than undershoot. When in doubt, write one more paragraph.
- Expand with concrete action beats, clue-linked dialogue, and sensory detail.
- Never pad with recap, repeated atmosphere, or generic filler.
```

`chapterTargetWords = preferredWords + 200`:

| Length | chapterTargetWords |
|--------|-------------------|
| short  | 1500              |
| medium | 1800              |
| long   | 2600              |

### 10.3 Per-chapter obligation block — `buildChapterObligationBlock` (line ~1327)

Applied as a per-chapter line inside the `CHAPTER OBLIGATION CONTRACT (MUST SATISFY)` block:

```
- Chapter N:
  - Word count: Target AT LEAST <chapterTargetWords> words. Do not cut this chapter short.
```

Same `preferredWords + 200` values as section 10.2.

### 10.4 Summary of word count messages received by the LLM

For a **medium** story the LLM receives three different figures in the same prompt:

| Source                     | Value told to LLM | What validator checks |
|----------------------------|-------------------|-----------------------|
| `chapterGuidance` (MINIMUM)| 640 words         | `hardFloorWords = 640` ✓ aligned |
| `chapterGuidance` (TARGET) | 1600 words        | `preferredWords = 1600` ✓ aligned |
| `wordCountContract`        | **1800 words**    | not checked directly |
| `chapterObligationBlock`   | **1800 words**    | not checked directly |

The contract and obligation blocks promise 1800, but the validator gates at 1600. The LLM therefore receives **two conflicting "true minimum" signals** (1600 vs 1800), with no mechanical enforcement of either. This is a contributing factor to RC-3: the model treats all figures as aspirational since none are enforced at the prompt level.

### 10.5 Expansion call messages (line ~3308)

The `attemptUnderflowExpansion` user message tells the LLM:

- **When below hard floor:**
  ```
  Chapter N is below the hard floor (<currentWords>/<hardFloorWords>).
  Expand by roughly <expansionHint> words so the chapter reaches at least <hardFloorWords> words
  and preferably <preferredWords + 200> words. Overshoot rather than undershoot.
  Do not stop at the first threshold crossing. Continue until the chapter feels fully developed and complete.
  ```

- **When below preferred target (the `hasPreferredMissOnly` path):**
  ```
  Chapter N is below the preferred target (<currentWords>/<preferredWords>).
  Expand by roughly <expansionHint> words so the chapter reaches at least <preferredWords> words
  and preferably <preferredWords + 200> words. Overshoot rather than undershoot.
  ```

`expansionHint = clamp(missingWords + bufferWords, minAdditional=260, maxAdditional=900)`.  
For a 900-word chapter missing the 1600 preferred target: `missingWords = 700`, `hint = clamp(700 + 280, 260, 900) = 900`.

*ANALYSIS_45 authored by root cause investigation, 2026-04-06. See also: ANALYSIS_44, run_log.md.*

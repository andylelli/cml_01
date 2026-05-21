# Canary Iteration Review — Opening-Style Entropy & N-gram Overlap

**Date started**: 2026-05-20  
**Goal**: Achieve two consecutive clean canary passes by fixing root-cause failures, not masking them.

---

## Baseline Failure Profile (pre-fix)

Chapter 3 fails after 6 attempts on every run tested:

```
Template linter: opening-style entropy too low (0.00 < 0.62). Vary chapter openings and avoid repeated style buckets.
Template linter: high n-gram overlap detected (0.72 >= 0.65). Rephrase this passage to avoid template leakage.
```

---

## Root Cause Analysis

### Issue A — Classifier bug: `classifyOpeningStyle()` drops multi-word names to 'general-descriptive'

**File**: `packages/prompts-llm/src/types/narrative-state.ts` (and mirror in `packages/story-validation/src/prose-consistency-validator.ts`)

**Bug**: The `character-action` regex only matches `^[a-z]+ (verb)` — one word before the verb. But all four characters in the canary story have two-part names (Eleanor Voss, Beatrice Quill, Captain Ivor Hale, Dr. Mallory Finch). When the LLM writes "Eleanor Voss examined the clock…", the classifier sees "eleanor" + "voss" (not a verb) and falls through to `'general-descriptive'`.

**Effect**: If Ch1 and Ch2 both open with a full-name character action, both get classified as `'general-descriptive'`. Ch3 also gets `'general-descriptive'`. Shannon entropy of `[general-descriptive, general-descriptive, general-descriptive]` = **0.00** — even though the model correctly followed the opening-style directive for each chapter.

**Fix**: Extend the character-action check to handle 2-word ("Beatrice Quill stepped") and 3-word ("Captain Ivor Hale crossed", "Dr. Mallory Finch examined") name prefixes, with a negative lookahead blocking articles/pronouns from being mistaken for names.

---

### Issue B — No temperature escalation on n-gram retries

**File**: `packages/prompts-llm/src/agent9-prose.ts`, call site around `temperature: proseModelConfig.temperature`

**Bug**: All 6 attempts use the same base temperature (0.42). When n-gram overlap persists across retries, the model is stuck in a low-diversity generation mode. Without temperature escalation, later retry attempts produce near-identical text to earlier ones.

**Fix**: On attempt ≥ 3, if the last-batch errors include n-gram overlap or fingerprint match, raise temperature by +0.10 (capped at 0.75) to force more lexical variety while preserving clue-ID fidelity.

---

## Iteration Log

| # | Changes | Canary 1 | Canary 2 | Outcome | Notes |
|---|---------|----------|----------|---------|-------|
| 1 | Fix `classifyOpeningStyle` multi-word names + temp escalation | — | — | — | — |
| 2 | TBD | — | — | — | — |
| 3 | TBD | — | — | — | — |
| 4 | TBD | — | — | — | — |
| 5 | TBD | — | — | — | — |
| 6 | TBD | — | — | — | — |
| 7 | TBD | — | — | — | — |
| 8 | TBD | — | — | — | — |
| 9 | TBD | — | — | — | — |
| 10 | TBD | — | — | — | — |
| 11 | TBD | — | — | — | — |
| 12 | TBD | — | — | — | — |
| 13 | TBD | — | — | — | — |
| 14 | TBD | — | — | — | — |
| 15 | TBD | — | — | — | — |
| 16 | TBD | — | — | — | — |
| 17 | TBD | — | — | — | — |
| 18 | TBD | — | — | — | — |
| 19 | TBD | — | — | — | — |
| 20 | TBD | — | — | — | — |

---

## Change Tracking

### Changes active at each iteration start
Populated as iterations progress.

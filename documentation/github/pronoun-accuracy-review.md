# Pronoun Accuracy Review

> Analysis of weaknesses in the CML pipeline's pronoun handling and concrete recommendations for improvement.
> All file references are relative to the repository root.

---

## Overview

The pipeline has four distinct weakness layers, each at a different stage of the prose-generation process:

1. **Agent 2 — Cast generation** allows `"non-binary"` as a gender value
2. **Deterministic repair** nulls context on mixed-gender sentences, breaking follow-up repair
3. **CharacterConsistencyValidator Guard 2** suppresses real errors via an over-wide window check
4. **Retry feedback loop** inherits all suppressions from layer 3 and de-prioritises pronoun errors

---

## Weakness 1 — Agent 2 can emit `"non-binary"` gender

**Files:**
- `packages/prompts-llm/src/agent2-cast.ts` — lines 44, 253, 385, 569, 631–632

**What goes wrong:**

`"non-binary"` is a first-class allowed value in the TypeScript interface, the cast-generation prompt instruction (rule 11), the validation whitelist, and the normalisation logic. For a Golden Age whodunnit generator this should never be output — all characters are expected to be unambiguously gendered. When the LLM does select `"non-binary"` (often for an ambiguous first name), the downstream repair and validator code paths branch into separate, less-tested logic, and the `buildPronounAccuracyBlock` emits a weaker `they/them` warning rather than a binary assignment.

**Recommended fix:**

1. Narrow the TypeScript union on line 44 from `'male' | 'female' | 'non-binary'` to `'male' | 'female'`.
2. Update rule 11 in the prompt (line 385) to: *`gender` must be `"male"` or `"female"` only — no other values are permitted.*
3. Change the validation whitelist (lines 569 and 631) from `['male', 'female', 'non-binary']` to `['male', 'female']`. Any other value should normalise to `undefined`, which the validator already handles gracefully by skipping the character.

---

## Weakness 2 — Deterministic repair nulls `lastSingleCharacter` on mixed-gender sentences

**File:**
- `packages/story-validation/src/pronoun-repair.ts` — lines 277–290

**What goes wrong:**

When `mentioned.length >= 2` and the two mentioned characters have different genders, the code executes:

```ts
lastSingleCharacter = null;
return segment;
```

This is the most common real-world failure mode. The LLM writes:

> *"Eleanor watched him cross the room. She said nothing."* — correctly attributed  
> *"He turned and faced her."* — no character named; should inherit Eleanor as subject, but `lastSingleCharacter` is now `null`

Because the subject context was nulled, the follow-up sentence receives no repair even if `He` is clearly wrong for Eleanor.

**Recommended fixes (in order of risk):**

1. **Do not null `lastSingleCharacter` on a mixed-gender skip.** Keep the prior single-character value so that purely pronoun-containing follow-up sentences still have a subject to inherit. This is safe because the follow-up sentence has no competing name in it.

   Change line 289 from:
   ```ts
   lastSingleCharacter = null;
   ```
   to preserve the existing value:
   ```ts
   // lastSingleCharacter intentionally preserved — follow-up sentences inherit prior subject
   ```

2. **Optional deeper fix:** For mixed-gender sentences, attempt repair of pronouns where the grammatical subject is unambiguously attributable to one character (e.g. the sentence opens with that character's name). This catches the highest-frequency mismatch without touching ambiguous mid-sentence references.

---

## Weakness 3 — CharacterConsistencyValidator Guard 2 uses an over-wide window

**File:**
- `packages/story-validation/src/character-validator.ts` — lines 281–292

**What goes wrong:**

Guard 2 (lines 281–292) suppresses a potential pronoun error whenever the character's *correct* pronouns appear anywhere in the same multi-sentence context window. The intention is to avoid flagging `"he told her"` as a mismatch for a female character when `her` is correct. However, the window spans up to ±10 sentences (Guard 1 extension) plus a forward extension. This means:

> Chapter correctly uses `she/her` for Helen in sentence 3, then incorrectly uses `he/him` for Helen in sentence 8.

Both pronouns appear in the same extended window, so Guard 2 fires and suppresses the sentence-8 mismatch. The error is silently dropped.

**Recommended fix:**

Restrict Guard 2 to the character's **own sentence** (`sentences[i]`) rather than the full extended context window. A correct pronoun in the same sentence strongly implies the wrong-gender pronoun belongs to a different character. A correct pronoun only in an adjacent sentence does not carry that implication.

```ts
// Before (line 292 area):
const correctPronounInContext = new RegExp(
  `\\b(${Array.from(correctPronounSet).join('|')})\\b`, 'i'
).test(context);  // ← uses the wide multi-sentence window

// After:
const correctPronounInContext = new RegExp(
  `\\b(${Array.from(correctPronounSet).join('|')})\\b`, 'i'
).test(sentences[i]);  // ← restrict to the character's own sentence only
```

---

## Weakness 4 — Retry feedback inherits all suppressions and de-prioritises pronoun rank

**Files:**
- `packages/prompts-llm/src/agent9-prose.ts` — lines 4452–4479 (`buildEnhancedRetryFeedback`)
- `packages/prompts-llm/src/retry-protocol.ts` — lines 32 and 44

**What goes wrong:**

**Part A — Suppressed errors never reach the feedback block.**  
The targeted `⚠️ NAME is FEMALE — use "she/her"` block in `buildEnhancedRetryFeedback` (lines 4452–4479) is populated entirely from `pronounErrors`, which is itself populated only by errors emitted by `CharacterConsistencyValidator`. If Guard 2 (Weakness 3 above) suppressed a real mismatch, no error is emitted, no entry appears in `pronounErrors`, and the retry feedback never names the character. The LLM has no instruction to fix it and the mismatch persists in the committed chapter.

**Part B — Pronoun/continuity rank loses to completeness errors.**  
In `retry-protocol.ts` the failure class ranking is:

| Class | Rank |
|---|---|
| `fair_play` | 100 |
| `clue_timing` | 95 |
| `completeness` | 90 |
| `structure` | 88 |
| `continuity` *(includes pronouns)* | **80** |

When a batch has both a `completeness` failure (word-count short) and a `pronoun_gender_mismatch`, `classifyFailure` picks `completeness` as the headline class. The retry prompt leads with word-count guidance; the pronoun block appears further down and tends to receive less corrective attention from the model.

**Recommended fixes:**

1. **Fix Weakness 3 first** — fewer suppressed errors means the feedback loop fires correctly for the majority of real failures.

2. **Raise `continuity` rank to 85** (between `structure` at 88 and `completeness` at 90) so that verified pronoun errors are not silently deprioritised by a word-count shortfall.

   ```ts
   // retry-protocol.ts line 44
   continuity: 85,  // raised from 80 — pronoun mismatches are deterministically verifiable
   ```

3. **Escalate to a full cast pronoun table on repeated failure.** In `buildEnhancedRetryFeedback`, when `attempt >= 2` and a prior attempt also emitted pronoun errors, emit the full canonical pronoun table for all characters (not just the failing ones). Targeted one-line directives alone have not fixed the problem at that point; a full reference table gives the model a lookup it cannot miss.

---

## Summary

| # | Layer | File | Root cause | Fix |
|---|---|---|---|---|
| 1 | Agent 2 cast generation | `agent2-cast.ts` | `"non-binary"` is a permitted gender value | Remove from enum, prompt rule 11, and validation whitelist |
| 2 | Deterministic pronoun repair | `pronoun-repair.ts:289` | `lastSingleCharacter` nulled on mixed-gender sentence; follow-up sentences lose repair subject | Preserve prior context value on mixed-gender skip |
| 3 | CharacterConsistencyValidator Guard 2 | `character-validator.ts:281–292` | Correct pronoun anywhere in wide multi-sentence window suppresses a real mismatch | Restrict Guard 2 check to `sentences[i]` only |
| 4 | Retry feedback loop | `agent9-prose.ts:4452`, `retry-protocol.ts:44` | Suppressed validator errors never reach targeted feedback; pronoun class rank loses to completeness | Fix Weakness 3; raise `continuity` rank to 85; escalate to full cast table on second+ pronoun failure |

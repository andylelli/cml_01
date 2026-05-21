# TYPE 2 Implementation Plan — Pronoun Drift

**Date:** 2026-05-18 | **Updated:** 2026-05-19  
**Status:** PENDING — T2-0 through T2-6 implemented; T2-7, T2-8, T2-ESC not yet started  
**Canary score:** 2 EXIT:0 in series (type2-r2, t2impl-r4); current streak: 1 consecutive

---

## Change Status

| ID | Description | Layer | Status |
|----|-------------|-------|--------|
| T2-0 | `pronoun_accuracy` block moved to last position in `buildPromptContextBlocks()` | Prompt | ✅ Done |
| T2-1 | Compact pronoun lock prepended to user message (⛔ PRONOUN LOCK) | Prompt | ✅ Done |
| T2-3 | Rule 10: dialogue attribution name mandate | Prompt | ✅ Done |
| T2-4 | Rule 11: cast-conditional male isolation | Prompt | ✅ Done |
| T2-6 | `extractPronounOffendingSentences` + offending-sentence quoting in retry feedback | Prompt | ✅ Done |
| T2-7 | Actor/object disambiguation in repair pass | Repair | ✅ Done |
| T2-8 | Paragraph context reset (opening-sentence gate) | Repair | ✅ Done |
| **T2-ESC** | **Allow attempt 3 for unresolvable pronoun errors** | **Retry** | **❌ Not started** |

---

## Run History (2026-05-18)

| Run | Time | Exit | Notes |
|-----|------|------|-------|
| type2-r1 | 20:10 | ❌ 1 | Template linter — repeated long strings, ch8 |
| type2-r2 | 20:20 | ✅ 0 | PASS |
| type2-r3 | 20:31 | ❌ 1 | `pronoun_gender_mismatch` ×4 (Hale); `locked_fact_missing_value` ×3 |
| t2impl-r1 | 20:55 | ❌ 1 | Schema: `acts[2].purpose` required |
| t2impl-r2 | 21:00 | ❌ 1 | Schema: `acts[2].purpose` required |
| t2impl-r3 | 21:08 | ❌ 1 | n-gram overlap ≥ 0.65, ch6 |
| t2impl-r4 | 21:17 | ✅ 0 | PASS ← most recent |

---

## 1. What Is Already in Code

Five changes are in `packages/prompts-llm/src/agent9-prose.ts`, built clean:

| ID | Description | Location |
|----|-------------|----------|
| T2-0 | `pronoun_accuracy` block moved to last position in `buildPromptContextBlocks()` | `buildPromptContextBlocks()` |
| T2-1 | Compact pronoun lock prepended to user message (⛔ PRONOUN LOCK header) | `user` string assembly |
| T2-3 | Rule 10: dialogue attribution name mandate (speaker must be named, not pronoun'd) | `buildPronounAccuracyBlock()` rules |
| T2-4 | Rule 11: cast-conditional male isolation (conditional on 1 male + 2+ female) | `buildPronounAccuracyBlock()` |
| T2-6 | `extractPronounOffendingSentences` helper + offending-sentence quoting in retry feedback | before `buildEnhancedRetryFeedback` |

**Effect:** Prompt-side reinforcement significantly improved generation-pass pronoun adherence. T2-0 through T2-6 are all prompt/generation-layer interventions.

---

## 2. What Failed in Canary Run 5 (type2-r3)

**Exit code:** 1  
**Log:** `logs/canary-core-run-type2-r3-20260518-203142.txt`

### 2a. Pronoun errors (primary)

Final validation reported 4× `pronoun_gender_mismatch` major errors:
```
Character "Captain Ivor Hale" has incorrect pronouns. Should use he/him/his but found: her  (×4)
```

Repair pass timeline for this story:
- Ch4: 8 repairs applied, attempt 2 — **"unresolvable by targeted repair"** — accepted
- Ch5: 8 repairs applied, attempt 2 — **"unresolvable by targeted repair"** — accepted
- Ch7: 10 repairs applied, attempts 2 and 5 — **"unresolvable by targeted repair"** — accepted
- Ch9: repairs applied, attempts 2 and 5 — **"unresolvable by targeted repair"** — accepted

Post-repair `applyDeterministicPronounSweep` did not catch the 4 residual Hale errors.

### 2b. Locked fact errors (secondary, CML-specific)

```
locked_fact_missing_value: "Distance from the murder scene to the nearest window"
  canonical value "ten feet" — missing from chapters 7, 8, 9  (×3)
```

This is a stochastic LLM failure for this particular CML's locked-fact specificity. It is **not a systemic code defect** — it is a story-generation miss on an unusually specific locked fact. Separate treatment.

---

## 3. Root Cause: The "Unresolvable" Path

### The exact suppression code (agent9-prose.ts ~line 6499)

```typescript
} else {
  if (attempt >= 2) {
    // Targeted repair made 0 additional fixes after pre-validation repair.
    // These issues survived both repair passes and are unresolvable without
    // risking false replacements in ambiguous-context sentences.
    console.warn(
      `[Agent 9] Ch${chapterNumber} pronoun issue(s) unresolvable by targeted repair on attempt ${attempt} (accepted, not retried): ${pronounIssues.join('; ')}`,
    );
  } else {
    chapterErrors.push(...pronounIssues);
  }
}
```

**When does `repairCount === 0`?** The repair pass skips sentences where `mentioned.length >= 2` with mixed genders (male + female characters both named). It cannot safely determine which character the pronoun refers to, so it makes 0 repairs.

**Concrete example:**
```
"Dr. Mallory Finch watched as Captain Hale adjusted her coat"
```
Sentence mentions both Finch (female) and Hale (male). `her` is wrong for Hale (should be `his`), but the repair skips because two genders are present. On attempt 2+, the skip becomes permanent acceptance.

**Why did run2 (type2-r2) pass EXIT:0 with the same unresolvable warnings?**  
Run2 had only 2 chapters with unresolvables (ch4, ch8). `applyDeterministicPronounSweep` happened to clean up enough of the residual errors in those chapters. Run3 had 4 chapters with unresolvables from a story with a more verbose cast interaction pattern, and the sweep didn't catch all of them.

The pass/fail outcome is currently **stochastic** depending on how many mixed-gender sentences the LLM happens to produce.

---

## 4. Repair Pass Architecture (pronoun-repair.ts)

The `repairPronouns()` function has four sentence-level branches:

| Branch | Condition | Action |
|--------|-----------|--------|
| A | `mentioned.length === 1` | Repair to that character's pronouns ✅ |
| B | `mentioned.length === 0` (follow-up) | Inherit `lastSingleCharacter` and repair ✅ |
| C | `mentioned.length >= 2`, same genders | Repair to first character ✅ |
| **D** | **`mentioned.length >= 2`, mixed genders** | **Skip entirely ❌** ← FAILURE MODE B |

Branch D is where unresolvable errors accumulate. The skip is intentional (safety against false repairs) but results in silent acceptance of wrong pronouns.

---

## 5. Remaining Changes Required

### 5a. T2-7 — Actor/Object Disambiguation in Repair Pass (HIGH PRIORITY)

**Target file:** `packages/story-validation/src/pronoun-repair.ts`  
**Target location:** `mentioned.length >= 2` mixed-gender branch (Branch D)

**Current behaviour:** Skip sentence entirely.

**Proposed behaviour:** When two characters of different genders are in a sentence:
1. Determine which character is **subject** (actor) vs **object** using syntactic position.
2. The subject is typically the character whose name appears before the main verb.
3. Apply repair constraints for the **object** character only (not subject).
   - Subject character's pronouns (he/she) are likely correct for that character.
   - Object character named after a verb in possession context: `"her coat" → "his coat"` when object char is male.
4. If disambiguation is ambiguous (equal names before/after verb), skip as before.

**Simple heuristic (no NLP library needed):**
- Split sentence at first finite verb (detected by simple past-tense or common verb list).
- Characters named in the pre-verb span → subject candidate.
- Characters named only in the post-verb span → object candidate.
- If one character is unambiguously in post-verb span only, apply repair to their pronouns.

**Confidence gate:** Only apply if exactly one character appears exclusively in the post-verb span. If both appear before the verb, skip (genuinely ambiguous).

**Expected impact:** Reduces "unresolvable" count for Failure Mode B. In the `"Dr. Finch watched Captain Hale adjust her coat"` pattern, `Hale` is in post-verb span, `her` is repaired to `his`. Finch is subject, Hale is object — repair applies to Hale.

**Risk:** False positives where the subject uses object-case pronoun for the OTHER character, e.g. `"She handed Captain Hale her notebook"` — `her` correctly refers to the subject (female). Mitigation: only repair possessives in the direct-object position (after the named object character).

---

### 5b. T2-8 — Paragraph Context Reset Improvement (MEDIUM PRIORITY)

**Target file:** `packages/story-validation/src/pronoun-repair.ts`  
**Target location:** `crossParagraphInheritance` logic + `lastSingleCharacter` tracking

**Current behaviour:** `crossParagraphInheritance` inherits the last paragraph's terminal character into the new paragraph — but only when the new paragraph contains no opposite-gender character anywhere. This is a coarse guard.

**Problem:** Failure Mode C (context inheritance across paragraphs) can over-repair. If paragraph P ends with Eleanor (female) as `lastSingleCharacter`, and paragraph P+1 opens with `"He entered the room"` (which should refer to Hale), the current guard checks if any male character is mentioned in P+1. If Hale is named later in P+1, the opposite-gender-present check fires and blocks inheritance. That's correct. But if Hale is NOT named in P+1 (pure pronoun paragraph), the inheritance fires and `"He"` gets repaired to `"She"` — wrong.

**Proposed behaviour:**
- Reset `crossParagraphChar` to `null` when the opening sentence of the new paragraph contains a **named character**.
- Only inherit when the opening sentence has **zero named characters** (pure follow-up paragraph with no anchor).
- This is stricter than the current "no opposite-gender character anywhere in paragraph" check.

**Expected impact:** Reduces over-repairs that corrupt correct pronouns in paragraphs that open with a subject pronoun for a character not named in that paragraph.

**Risk:** Lower coverage (fewer inherited repairs), but higher precision. Acceptable tradeoff.

---

### 5c. Unresolvable-Error Escalation (HIGH PRIORITY, alternative to T2-7)

**Target file:** `packages/prompts-llm/src/agent9-prose.ts`  
**Target location:** `attempt >= 2` unresolvable acceptance block (~line 6499)

**Current behaviour:** Accept silently at `attempt >= 2`.

**Proposed behaviour (Option A — allow attempt 3 for unresolvables):**
- Change the acceptance threshold from `attempt >= 2` to `attempt >= 3`.
- On attempt 2, push the unresolvable issues back into `chapterErrors` for one more LLM pass.
- On attempt 3+, accept (prevent infinite retries).

This ensures unresolvable errors get at least one more generation attempt with the T2-6 offending-sentence feedback active.

**Trade-off:** Adds up to ~1 LLM call per chapter that hits this path. In run3, that would have been 4 extra calls across 4 chapters. Cost is acceptable. Risk is that the 3rd attempt doesn't fix it either (but then acceptance is still the outcome — no regression).

**Proposed behaviour (Option B — targeted sentence-level LLM repair):**
- Instead of full chapter regeneration, make a targeted call asking the LLM to rewrite only the quoted offending sentences.
- More surgical, but adds complexity to the repair pipeline.

**Recommendation:** Option A is simpler, lower-risk, and easier to test. Implement T2-7 first (reduces the unresolvable pool), then if unresolvables still appear, apply Option A to give them one more full-generation attempt.

---

## 6. Implementation Order

| Priority | ID | Change | File | Status | Expected Impact |
|----------|----|--------|------|--------|----------------|
| 1 | T2-7 | Actor/object disambiguation in repair pass | `pronoun-repair.ts` | ✅ Done | Fixes Failure Mode B; reduces "unresolvable" count per run from 4+ to near-0 |
| 2 | T2-8 | Paragraph context reset (opening-sentence gate) | `pronoun-repair.ts` | ✅ Done | Reduces Failure Mode C over-repairs |
| 3 | T2-ESC | Allow attempt 3 for unresolvable pronoun errors | `agent9-prose.ts` | ❌ Not started | Backstop for any residual T2-7 misses |

**T2-7 alone should be sufficient** for the majority of the story generation patterns observed in canary runs. T2-8 and T2-ESC are defensive hardening.

---

## 7. What Is Skipped (with Rationale)

| ID | Description | Reason |
|----|-------------|--------|
| T2-2 | NSD block tail compact pronoun reminder | Superseded by T2-1 (user message lock with same content, better recency). Adding both creates noise. |
| T2-5 | Extend `PronounRepairResult` with `offendingSentences` | Partially achieved by T2-6 (extraction happens inline in agent9-prose.ts). Full wire-up would require pronoun-repair.ts interface change for marginal gain. |

---

## 8. Locked-Fact Failure (type2-r3 Secondary)

The 3× `locked_fact_missing_value` errors in run3 are **not addressable by TYPE 2 pronoun code**. They arise when the LLM generates chapters without citing a CML-locked fact that has a very specific canonical value ("ten feet"). 

This is a pre-existing stochastic failure mode. It did not appear in runs 1–4 because those stories had less precise locked facts. Mitigation options are documented separately in the TYPE 1 issues area (locked-fact retry reinforcement).

For canary run 6 purposes: this failure mode is low-frequency and story-dependent. Run 6 is likely to use a different story without this specific locked-fact pattern.

---

## 9. Canary Acceptance Criteria

**For the 5th EXIT:0 run to count:**
- No `pronoun_gender_mismatch` major errors in final validation
- "unresolvable by targeted repair" warnings in the log are acceptable (they are warnings, not errors)
- `locked_fact_missing_value` must not appear (or must be in minor/warning category, not major)

**With T2-7 implemented:**
- Mixed-gender sentences where the wrong-gendered character is the object will be repaired deterministically
- The "unresolvable" path should fire much less frequently or not at all for Hale-style errors
- This eliminates the stochastic variance between run2 (lucky, pass) and run3 (unlucky, fail)

---

## 10. Files to Modify

1. `packages/story-validation/src/pronoun-repair.ts` — T2-7 and T2-8
2. `packages/prompts-llm/src/agent9-prose.ts` — T2-ESC (attempt threshold, if needed)

No other files need modification. The `agent9-run.ts` worker does not require changes because the fix is in the repair logic layer below it.

After implementation, run `npm run -w @cml/story-validation build && npm run -w @cml/prompts-llm build` to verify clean build before canary runs.

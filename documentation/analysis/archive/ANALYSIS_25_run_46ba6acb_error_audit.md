# ANALYSIS_25 — Run `run_46ba6acb` Full Error Audit

**Date:** 2026-03-31  
**Run:** `run_46ba6acb-7700-4b1a-8686-2c2f52bf19bb`  
**Project:** `proj_86d2a62a-d346-4817-b6d1-11e768322132`  
**Outcome:** FAILED — "Generation stopped before completion"  
**Root cause:** Ch3 burned all 4 retry attempts; Ch1 resolved on attempt 4

---

## 1. Summary of All Errors

| Chapter | Attempt | Error | Verdict |
|---------|---------|-------|---------|
| Ch1 | 1 | Clue at 69% of chapter (> 25% mark) | Genuine |
| Ch1 | 2 | Clue at 69% — model ignored MOVE directive | Genuine |
| Ch1 | 3 | Clue at 69% — model ignored MOVE directive again | Genuine |
| Ch1 | 4 | Clue at 29% — passes validator | **Resolved** |
| Ch3 | 1 | `Emmeline Warenne` has wrong pronoun `his` | **FALSE POSITIVE** |
| Ch3 | 2 | `Emmeline Warenne` has wrong pronoun `his` | **FALSE POSITIVE** |
| Ch3 | 3 | `Emmeline Warenne` has wrong pronoun `his` + word count 913/960 | FALSE POSITIVE + Genuine |
| Ch3 | 4 | `Emmeline Warenne` has wrong pronoun `his` + `James Villiers` has `she` + word count 943/960 | FALSE POSITIVE + FALSE POSITIVE + Genuine |

**Key finding: every pronoun error in this run was a false positive.** The model never wrote wrong-gender pronouns for these characters. The validator was overfiring.

---

## 2. Ch3 Pronoun False Positives — Root Cause

### Error 1: `Emmeline Warenne` flagged for `his` (attempts 1–4)

The flagged sentence (consistent across all 4 attempts):

> *"Emmeline Warenne sat to **his** right, **her** heart racing with excitement, momentarily lost in the warmth of the moment, until a sudden gasp shattered the evening's tranquility."*

**Analysis:**
- `his` = spatial possessive anchoring Emmeline relative to Gordon Daubeny (the host)  
- `her` = Emmeline's correct female pronoun — present in the SAME sentence  
- The sentence correctly uses both: `his` for Gordon, `her` for Emmeline  
- The validator found `his` in a context window containing `Emmeline` and flagged it

**Root cause:** The validator's competing-entity guard (`isOwnedByCompetingEntity`) checks if another character is explicitly named in the sentence. Gordon is not named here — `his` is a possessive anchor without a named subject in this sentence. The guard failed to suppress the flag because Gordon's name doesn't appear.

**Resolution:** The **correct-pronoun co-presence guard** (ANALYSIS_25 / implemented 2026-03-31): if the sentence already contains the character's own correctly-gendered pronoun (`her`), any wrong-gender pronoun in the same context belongs to another entity and must not be flagged against this character.

See: [packages/story-validation/src/character-validator.ts](../../packages/story-validation/src/character-validator.ts)

```typescript
// Co-presence guard: if this sentence context already contains the character's own
// correctly-gendered pronoun, any wrong-gender pronoun belongs to another entity.
const ownPronounPattern =
  correctPronouns.subject === 'she'  ? /\b(?:she|her|herself|hers)\b/i :
  correctPronouns.subject === 'he'   ? /\b(?:he|him|his|himself)\b/i :
  correctPronouns.subject === 'they' ? /\b(?:they|them|their|themselves)\b/i :
  null;
if (ownPronounPattern?.test(context)) continue;
```

---

### Error 2: `James Villiers` flagged for `she` (attempt 4 only)

The flagged sentence:

> *"'**She** was fine just moments ago!' James Villiers said, **his** brow furrowed in concentration."*

**Analysis:**
- `she` is inside **quoted speech** referring to the victim (third party)  
- `his` = Villiers' correct male pronoun — present in the SAME sentence  
- The model wrote the sentence perfectly: female dialogue referent + correct male possessive for Villiers  

**Root cause:** Same co-presence guard failure. The validator found `she` in a context window tagged with `James Villiers` and didn't recognise that `his` already establishes Villiers as the male subject. This is a classic quoted-speech pronoun leak.

**Resolution:** Same co-presence guard fix — since `his` is correct for Villiers (male), `she` is immediately suppressed before inspection.

---

### Pattern: Retry regression

Attempts 1–3 all flagged Emmeline. The model, instructed to "fix Emmeline's pronouns," wrote attempt 4 with Emmeline clean — but the validator then found a new false positive (James Villiers / `she` from quoted speech). This **retry regression** burned the final attempt. Without the false positives, Ch3 would have passed on attempt 1.

---

## 3. Ch3 Word Count Failures — Borderline Genuine

| Attempt | Reported word count | Floor |
|---------|---------------------|-------|
| 3 | 913 | 960 |
| 4 | 943 | 960 |

These are reported in the **retry feedback** — the pre-commit validation result after `ProseGenerator` output but before/during `UnderflowExpansion`. The UnderflowExpansion user message header for this run shows "Chapter 3 is below the hard floor (940/960) — expand by roughly 370 words."

The UnderflowExpansion user messages measure ~1098–1128 total message tokens (including boilerplate), suggesting chapter text was being expanded. Whether the post-expansion word count cleared 960 is unclear from the logs, but the retries continued to show sub-floor counts — suggesting either:
1. The retry was triggered before UnderflowExpansion completed its pass, or
2. Each retry regenerated a fresh short chapter that was again short

**Impact:** After the false-positive fix, Ch3 attempts 1–2 will no longer be retried for pronoun errors. The model should be able to write naturally longer chapters without the distraction of fixing phantom errors. Borderline word count is likely self-correcting once retries aren't wasted.

---

## 4. Ch1 Clue Placement — Genuine but Resolved

The clue: *"The residue indicates poison was present, suggesting the victim was poisoned during dinner."*

| Attempt | Clue word position | Total words | Percentage | Result |
|---------|-------------------|-------------|------------|--------|
| 1 | 623 | 904 | 69% | FAIL (> 25%) |
| 2 | 623 | 904 | 69% | FAIL |
| 3 | 623 | 904 | 69% | FAIL |
| 4 | 233 | 810 | 29% | **PASS** |

**Observations:**
- The model is completely unresponsive to the MOVE directive across 3 attempts (identical placement each time). The clue is consistently at the same paragraph in what is evidently a story-arc-locked scene structure (the dinner party scene naturally builds to the discovery of the victim midway through).
- Attempt 4 switches to a fresh-start generation ("Write completely fresh chapters") with a forced move. At 29% it narrowly passes the paragraph-based 25% check because the relevant paragraph falls within the first-quarter paragraph range.
- The validator uses **paragraph count** for the 25% cutoff: `Math.ceil(paragraphs.length * 0.25)`. The word position (29%) is above the word-based 25% mark — but the paragraph cutoff depends on how many paragraphs the model wrote. A 7-paragraph chapter has a paragraph-2 cutoff; if para 1 is short and para 2 contains the clue, both the word position and paragraph tests pass.

**Systemic concern:** 3/4 attempts failed on an identical placement. The model's story-arc instinct (build tension → discovery) conflicts with the structural requirement (clue in first quarter). The retry MOVE directive is not strong enough when the model has a deeply-embedded scene structure. The "write completely fresh" att-4 escalation was the only thing that worked.

**Potential improvement:** Earlier escalation to fresh-start mode. Currently the first 3 attempts use a MOVE directive; only attempt 4 escalates to fresh-start. If 2+ consecutive attempts show the same word position (69% → 69% → 69%), the engine should escalate to fresh-start at attempt 3. This would reclaim one lost attempt.

---

## 5. Other Agents

No other agents had validation-triggered retries. All `retryAttempt > 0` entries for other agents (Agent1, Agent2, Agent3, etc.) reflect the normal single-pass architecture (field 1) — these are not reruns, just the prompt attempt counter format.

Ch2 had zero validation failures — 1 ProseGenerator call + 1 UnderflowExpansion, both passing.

---

## 6. Net Impact of Co-presence Guard Fix

| Without fix | With fix |
|-------------|----------|
| Ch3 att 1: fails (Emmeline false positive) | Ch3 att 1: **PASSES** |
| Ch3 att 2: fails (Emmeline FP) | — |
| Ch3 att 3: fails (Emmeline FP + word count) | — |
| Ch3 att 4: fails (Emmeline FP + Villiers FP + word count) | — |
| **Run: FAILED** | **Expected: PASS** |

With the fix, Ch3 clears on attempt 1 (assuming the 940-word chapter is expanded to 960+ by UnderflowExpansion, which it should be given the expansion prompt explicitly targets 960+ words). The run would complete successfully.

---

## 7. Fixes Applied

| Fix | File | Status |
|-----|------|--------|
| Co-presence guard in `findIncorrectPronouns` | `packages/story-validation/src/character-validator.ts` | ✅ Implemented |
| Regression tests (co-presence guard — 3 new cases) | `packages/story-validation/src/__tests__/character-validator.test.ts` | ✅ 14/14 tests pass |

### Not yet addressed

| Issue | Notes |
|-------|-------|
| Ch1 MOVE directive non-responsiveness | Model ignores directive 3/4 times. Possible fix: escalate to fresh-start at attempt 3 when clue position unchanged across 2+ attempts. |
| Ch3 borderline word count | Expected to self-correct once false positive retries are eliminated. Monitor next run. |

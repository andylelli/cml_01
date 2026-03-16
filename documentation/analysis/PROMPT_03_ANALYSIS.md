# PROMPT_03_ANALYSIS.md
## Per-Attempt Prompt Analysis — run_76473638, 2026-03-15
### "The Timekeeper's Deceit" | Chapter 6 | Agent9-ProseGenerator-Ch6

Source data: `PROMPT_03.md` (4 attempts, route: A1=buildProsePrompt, A2-A4=buildLeanRevisionMessages)

---

## ATTEMPT 1 — 2026-03-15T17:43:54 — Initial Generation

### What the prompt did

Route: `buildProsePrompt` (full). Three messages: a large system prompt (~21,496 chars) with the full CML snapshot, CHARACTER MAP, SCENE GROUNDING CHECKLIST (post-fix wording), IMMUTABLE PRONOUN MAP, TEMPORAL CONTEXT block (June 1943 / summer), locked facts, prose requirements; a user message with the scene outline JSON; a third user message containing the pre-submission checklist.

The pre-submission checklist (user message 3) includes:
> *"No season word (spring/summer/autumn/winter) contradicts the month 'June' in any paragraph. Replace any conflicting season word with 'summer'."*

The SCENE GROUNDING CHECKLIST in the system prompt (post-fix wording):
> *"Chapter 6: anchor opening in 'the study of Waverly Court'; include 2+ sensory cues and at least one of these accepted time/weather words: morning, afternoon, evening, night, midnight, dawn, dusk, twilight, rain, mist, fog, wind, storm — before major dialogue. Mood phrases like 'uneasy silence' do NOT count."*

The IMMUTABLE PRONOUN MAP was present at the end of the system message:
- Henri Waldegrave: he/him/his
- Philip Beaumont: he/him/his
- (he/him/his)×2 plus three she/her/her characters

### Errors produced

1. **Philip Beaumont: incorrect pronoun `she`** (should be he/him/his)

### Prompt weaknesses

**Weakness 1 — Full chapter regeneration: no in-place pronoun guardrail**

The model writes a ~1,600-word chapter about Sharon Tregothnan (she/her), who is the sole character in the scene. The dominant pronoun in the chapter is `she/her`. Philip Beaumont appears likely in a brief reference (mentioned character, not present in the scene). The model's prior tokens are heavily biased toward `she/her` by the time it reaches Philip's reference, causing associative pronoun drift ("she/her" bleeds into the Philip reference).

The IMMUTABLE PRONOUN MAP is present at the bottom of a 21,496-char system message, separated from the pronoun drift occurrence by ~1,600 tokens of generated prose. The map is a preventive instruction, not a mechanism the model checks character-by-character during generation.

**Weakness 2 — Pre-submission checklist is message 3, generated after the chapter**

The pre-submission checklist (user message 3: "run this checklist before submitting") is intended to prompt the model to self-review. However, for the GPT-4o-mini model at high output lengths, multi-pass self-review is unreliable — the model generates the chapter in a single forward pass and the checklist reminder comes after. The checklist would need to appear inline within the generation instruction (user message 2) to have greater effect.

---

## ATTEMPT 2 — 2026-03-15T17:44:03 — Lean Revision (retry 1)

### What this attempt inherited

Attempt 1 failed validation on Philip Beaumont's pronoun. The pipeline switched to `buildLeanRevisionMessages`. Messages:
- **System**: 1,851-char lean context with CHARACTER MAP + word targets
- **User 1**: error list — Philip Beaumont: `she` → fix to `he/him/his`; MICRO-PROMPT [pronoun_consistency]; STABILITY ANCHOR
- **User 2**: "Regeneration mode: write corrected chapter"

The lean revision system message does **not** include:
- TEMPORAL CONTEXT (June 1943 / summer / season lock)
- LOCKED FACTS (clock times)
- SCENE GROUNDING CHECKLIST (with the post-fix explicit word list)
- Pre-submission season/month checklist

### Errors produced

1. **Henri Waldegrave: incorrect pronouns `she`, `her`** (should be he/him/his)
2. **Atmosphere grounding: weak** (no explicit time/weather word in opening)

### Prompt weaknesses

**Weakness 1 — Full chapter regeneration replaces one problem with another**

The lean revision route asks the model to write a **completely fresh chapter** that fixes the listed pronoun. It does not ask the model to patch the original text in-place. Each full regeneration is a new inference starting from a short (<2,000 char) system prompt. The model successfully avoided the `she` for Philip Beaumont — but introduced `she/her` for Henri Waldegrave instead.

This is a structural failure: correcting one character's pronoun in one regeneration introduces a different character's pronoun regression in the next. The alternating pattern will continue as long as the repair mechanism is full-chapter regeneration.

**Weakness 2 — Lean revision system message has no explicit gender reminder for masculine characters**

The A2-A4 system message includes the CHARACTER MAP:
```
- Henri Waldegrave: he/him/his
- Philip Beaumont: he/him/his
```

But with a Sharon-POV chapter (all she/her focus), `he/him/his` references to Henri and Philip occur rarely and briefly. The model's generation momentum remains she/her dominant. The CHARACTER MAP is 5 lines in a 1,851-char system — a small fraction of the context. A stronger declarative ("IMPORTANT: Henri Waldegrave IS MALE — never write she/her for him") is not present.

**Weakness 3 — Atmosphere grounding regression: no SCENE GROUNDING CHECKLIST in lean revision**

The lean revision system message does not include the SCENE GROUNDING CHECKLIST. The new post-fix wording (explicit word list) only appears in the lean revision USER message as a MICRO-PROMPT starting from attempt 3 (when grounding first fails). Attempt 2 does not yet have the grounding MICRO-PROMPT because the atmosphere error wasn't reported until A2's output was validated.

---

## ATTEMPT 3 — 2026-03-15T17:44:13 — Lean Revision (retry 2)

### What this attempt inherited

Attempt 2 failed with Henri Waldegrave pronoun + weak atmosphere grounding. User 1 now lists TWO errors and includes TWO MICRO-PROMPTS:
- MICRO-PROMPT [scene_grounding]: explicit keyword list + "mood phrases do NOT satisfy"
- MICRO-PROMPT [pronoun_consistency]: immutable map

### Errors produced

1. **Atmosphere grounding: weak** (still no explicit time/weather word in opening)

Henri Waldegrave pronouns: **CORRECT** in this attempt.

### Prompt analysis

**What worked:** The MICRO-PROMPT [pronoun_consistency] in user message 1 successfully corrected Henri Waldegrave's pronouns. The model read the explicit error (`Henri Waldegrave found: she, her`) and fixed it.

**What didn't work:** The MICRO-PROMPT [scene_grounding] (with explicit word list) did not fix the atmosphere grounding failure in A3. This was unexpected — A4 subsequently did fix it, so the MICRO-PROMPT wording was correct but the model needed one more exposure.

**Pattern observation:** A3 fixed the pronoun (from A2's error) but failed grounding. A4 then fixed grounding but introduced a pronoun regression again. This confirms the alternating failure pattern — each regeneration "forgets" prior attempts' successes.

---

## ATTEMPT 4 — 2026-03-15T17:44:20 — Lean Revision (retry 3 / final)

### What this attempt inherited

Attempt 3 failed atmosphere grounding only (pronouns passed). User 1 lists ONE error:
- Chapter 6: weak atmosphere/time grounding
- MICRO-PROMPT [scene_grounding]: same explicit word list

### Errors produced

1. **Henri Waldegrave: incorrect pronoun `she`** — regression from A3's correction
2. **June vs autumn contradiction** — "autumn" used in a chapter set in June 1943 (summer)

Atmosphere grounding: **PASSED** in this attempt. The explicit-words MICRO-PROMPT worked.

### Why the atmosphere grounding fix worked in A4

The MICRO-PROMPT [scene_grounding] includes:
> *"Mood phrases like 'uneasy silence' or 'charged atmosphere' do NOT satisfy this check — use an explicit time-of-day or physical weather word."*

This negative example was the critical addition. Previous iterations of the MICRO-PROMPT said "atmosphere marker" which the model satisfied with mood language. The negative exclusion forced the model to use one of the listed time/weather words.

### Why Henri Waldegrave's pronoun regressed in A4

A4's regeneration was triggered by atmosphere grounding only. The error message did NOT include Henri Waldegrave's pronoun (because A3 had correct pronouns). The STABILITY ANCHOR section is absent from A4's user message (final attempt — format change). Without an explicit pronoun error in A4's error list, the model's fresh regeneration reverted to the Sharon-POV bias and reintroduced `she` for Henri.

**Root observation:** The pronoun fix is ephemeral — it only holds when the pronoun is reported as an error in the CURRENT attempt's error list. When that report is absent, the model regresses. This confirms post-processing (pronoun-repair.ts) is the correct long-term solution, not prompt-based retry.

### Root cause of june vs autumn contradiction

**Root cause A — `enforceMonthSeasonLockOnChapter` regex gap:**

The post-processor uses:
```typescript
conflictingSeasonPatterns.summer = [/\b(spring|vernal|autumn|winter|wintry)\b/gi]
```

The temporal-consistency validator (`temporal-consistency.ts`) uses:
```typescript
{ season: 'autumn', pattern: /\b(autumn|autumnal|fall)\b/i }
```

**The gap:** `\bautumn\b` matches the noun "autumn" but not the adjective "autumnal". If the model wrote "autumnal" (very common in atmosphere prose), the post-processor's `conflictingSeasonPatterns.summer` regex does NOT replace it. The validator's `SEASON_PATTERNS` DOES detect it. This is the enforcer-validator mismatch.

**Root cause B — lean revision has no TEMPORAL CONTEXT:**

The lean revision system message (A2–A4) is a stripped 1,851-char context. It does not include:
- `This story takes place in June 1943 during summer.`
- `Avoid incompatible seasonal labels (spring, autumn, winter) in the same chapter.`
- `Season lock (hard): This timeline is anchored to June (summer).`

When A4 generated a fresh chapter, the model had no knowledge of the June/summer temporal anchor. Without this constraint, "autumnal" or "autumn" are natural atmosphere choices for a mystery set in Waverly Court — they evoke the classic English country-house tone.

The pre-submission checklist (A1's user message 3) warns about June/season contradiction, but this checklist is NOT present in the lean revision user messages (A2–A4).

**Effect of Root Cause B:** Even if the enforcer's regex were fixed (Root Cause A), the model would still try to write "autumnal/autumn" and rely on post-processing to catch it. Root Cause B is the prompt gap that causes the problem to appear. Root Cause A is a code gap that allows it to survive.

---

## Cross-Attempt Pattern Analysis

### Failure Pattern 1 — Pronoun Alternation

| Attempt | Route | Philip Beaumont | Henri Waldegrave | Atmosphere |
|---------|-------|-----------------|------------------|------------|
| A1 | buildProsePrompt | ❌ `she` | ✅ correct | ✅ passes |
| A2 | buildLeanRevisionMessages | ✅ fixed | ❌ `she/her` | ❌ fails |
| A3 | buildLeanRevisionMessages | ✅ correct | ✅ fixed | ❌ fails |
| A4 | buildLeanRevisionMessages | ✅ correct | ❌ `she` regression | ✅ FIXED |

The alternating pattern: each lean revision attempt writes a FULLY NEW CHAPTER. Each new chapter is an independent LLM inference from a context dominated by Sharon (she/her). The model's prior successful corrections are invisible to it — it has no memory of what A2 or A3 wrote. Every fresh generation risks reintroducing a pronoun error for one of the two male characters.

**Why pronoun-repair.ts doesn't catch this:**

`pronoun-repair.ts` uses a conservative algorithm: it only replaces a wrong-gender pronoun when exactly ONE character is named in the sentence. In a Sharon-POV chapter, a typical sentence reads: *"Henri watched from across the room, and she [Sharon] moved toward the window."* — both Henri AND Sharon are referenced (Henri explicitly, Sharon implicitly by "she"). `repairPronouns()` finds `mentioned.length === 1` (only Henri is named), but `she` refers to Sharon, not Henri. An aggressive repair would wrongly change Sharon's pronoun.

The deeper issue: the validator (`character-validator.ts`) uses a proximity window — it finds `she` near "Henri" and flags it. The pronoun-repair algorithm correctly doesn't touch this (it would be wrong to do so). There is a fundamental asymmetry: the **validator is more aggressive than the repair**, producing errors that repair cannot safely fix.

**Structural fix required:** Either (a) the validator's proximity window needs to be more conservative (same-sentence same-subject only), or (b) the pronoun-repair algorithm needs to handle "follow-up reference" detection more accurately using NLP-style coreference.

---

### Failure Pattern 2 — Lean Revision Context Stripping

The lean revision system message (1,851 chars) is used for ALL retries after A1:

| Context Block | A1 buildProsePrompt | A2-A4 buildLeanRevisionMessages |
|---------------|--------------------|---------------------------------|
| Full fiction framing | ✅ | ✅ (updated wording) |
| CHARACTER MAP | ✅ | ✅ (5 lines) |
| TEMPORAL CONTEXT (June/summer/season lock) | ✅ | ❌ MISSING |
| LOCKED FACTS (clock times) | ✅ | ❌ MISSING |
| SCENE GROUNDING CHECKLIST | ✅ | ❌ MISSING |
| Pre-submission season checklist | ✅ (user msg 3) | ❌ MISSING |
| IMMUTABLE PRONOUN MAP (extended) | ✅ | ❌ MISSING |
| Word target | ✅ | ✅ (floor + preferred) |

Every retry writes a full chapter but with ~12× less context than the initial generation. The model is essentially writing blind — no knowledge of what season/month it is, what physical facts are locked, or where the scene is supposed to be grounded.

---

### What Worked

- **Atmosphere grounding fix**: The new explicit-word MICRO-PROMPT with negative exclusion (*"mood phrases like 'uneasy silence' do NOT satisfy this check"*) worked in A4. A4's opening passed the atmosphere validator for the first time across the 4-attempt cycle. This confirms the fix to `agent9-prose.ts` (lines 2258+, 2609) is effective.

- **Pronoun correction (attempt-by-attempt)**: When a pronoun is explicitly listed as an error in the current attempt's message, the model fixes it. The fix is reliable for the attempt in question — the problem is that the fix doesn't persist into the next regeneration.

---

## Consolidated Fix Recommendations

### Fix 1 — Align enforcer and validator season regex coverage

**Root cause:** `conflictingSeasonPatterns.summer` in `agent9-prose.ts` uses `\bautumn\b` but the validator's `SEASON_PATTERNS` in `temporal-consistency.ts` uses `\b(autumn|autumnal|fall)\b`. "Autumnal" escapes the enforcer but triggers the validator.

**File:** `c:\CML\packages\prompts-llm\src\agent9-prose.ts`  
**Location:** `conflictingSeasonPatterns` definition (~line 681)

**Current:**
```typescript
const conflictingSeasonPatterns: Record<CanonicalSeason, RegExp[]> = {
  spring: [/\b(summer|midsummer|autumn|winter|wintry)\b/gi],
  summer: [/\b(spring|vernal|autumn|winter|wintry)\b/gi],
  autumn: [/\b(spring|vernal|summer|midsummer|winter|wintry)\b/gi],
  winter: [/\b(spring|vernal|summer|midsummer|autumn)\b/gi],
};
```

**Replace with** (aligned to `SEASON_PATTERNS` in temporal-consistency.ts):
```typescript
const conflictingSeasonPatterns: Record<CanonicalSeason, RegExp[]> = {
  spring: [/\b(summer|midsummer|summery|autumn|autumnal|fall|winter|wintertime|wintry)\b/gi],
  summer: [/\b(spring|springtime|vernal|autumn|autumnal|fall|winter|wintertime|wintry)\b/gi],
  autumn: [/\b(spring|springtime|vernal|summer|midsummer|summery|winter|wintertime|wintry)\b/gi],
  winter: [/\b(spring|springtime|vernal|summer|midsummer|summery|autumn|autumnal|fall)\b/gi],
};
```

**Rationale:** The enforcer and validator must detect the same set of season words. If the validator flags "autumnal" and "fall", the enforcer must replace them too.

---

### Fix 2 — Add TEMPORAL CONTEXT to lean revision system message

**Root cause:** The lean revision system message (~1,851 chars) lacks the month/season lock. The model writes "autumn/autumnal" because it has no knowledge of the June/summer temporal anchor.

**File:** `c:\CML\packages\prompts-llm\src\agent9-prose.ts`  
**Location:** `buildLeanRevisionMessages` system message construction (~line 1890)

**Add** a compact temporal context block to the lean revision system message:
```typescript
if (temporalMonth && temporalSeason) {
  systemLines.push(
    `TEMPORAL LOCK: This story is set in ${temporalMonth} (${temporalSeason}). Do NOT use any of these season words: ` +
    `${incompatibleSeasons.join(', ')} — replace them with "${temporalSeason}" if they appear in your prose.`
  );
}
```

Where `incompatibleSeasons` is derived from `MONTH_TO_FORBIDDEN_SEASONS[temporalMonth]`.

**Alternative (simpler):** Inject the temporal lock into the user message whenever the validation error is a season-month contradiction. When `checkTemporalConsistency` returns conflicts, the lean revision user message should include:
```
SEASON LOCK: This story is set in {month} ({season}). Do NOT use: {forbidden_season_words}.
```

This is lower-risk than changing the system message structure.

---

### Fix 3 — Inject season-lock MICRO-PROMPT when temporal contradiction is detected

**Root cause:** The retry micro-prompt system generates a `MICRO-PROMPT [scene_grounding]` for atmosphere failures but has no equivalent for temporal season contradictions.

**File:** `c:\CML\packages\prompts-llm\src\agent9-prose.ts`  
**Location:** `buildRetryMicroPromptDirectives` function (~line 2590)

**Add** a new micro-prompt case for temporal contradiction errors:
```typescript
if (errorMessages.some(e => /season.*month|month.*season|temporal.*contradiction|june.*autumn|autumn.*june/i.test(e))) {
  directives.push(
    `MICRO-PROMPT [temporal_consistency]: This story is set in June (summer). Do NOT use the words autumn, autumnal, fall, winter, wintry, spring, or springtime. ` +
    `If you wrote any of these in a previous version, replace them with "summer" or a neutral phrasing.`
  );
}
```

---

### Fix 4 — Pre-submission season/month checklist in lean revision messages

**Root cause:** The pre-submission checklist (user message 3 in `buildProsePrompt`) includes a season-month check, but this checklist does not appear in lean revision user messages.

**File:** `c:\CML\packages\prompts-llm\src\agent9-prose.ts`  
**Location:** `buildLeanRevisionMessages` user message 3 construction

**Add** the season/month constraint to the lean revision "regeneration mode" user message tail when temporal month is known:
```typescript
if (temporalMonth) {
  user2Lines.push(
    `⚠️ SEASON LOCK: Do NOT use autumn, autumnal, fall, winter, spring — this story is set in ${temporalMonth} (${temporalSeason}). ` +
    `Use "summer" or time-neutral phrasing instead.`
  );
}
```

---

### Fix 5 — Pronoun alternation: extend CHARACTER MAP in lean revision system

**Root cause:** The lean revision system message includes a minimal CHARACTER MAP (5 lines). For a Sharon-POV chapter where `she/her` dominates, male characters' he/him/his entries are easily overridden by generation momentum.

**File:** `c:\CML\packages\prompts-llm\src\agent9-prose.ts`  
**Location:** lean revision system message CHARACTER MAP section

**Add** a supplementary block immediately after the CHARACTER MAP for characters whose canonical pronouns appear to be "at risk" in the current scene (i.e., the POV character has different gender from other cast members):
```
⚠️ MALE CHARACTER ALERT: Henri Waldegrave and Philip Beaumont are MALE. 
Never write "she/her" for them. Every "she/her" in this chapter belongs to 
Sharon Tregothnan, Yvette Beauchamp, or Sarah Playfair only.
```

This is a simpler, more targeted version of Fix 5; the logic to detect which characters need the alert:
- If the scene `characters` array contains only female characters + the referenced male characters appear elsewhere (as mentioned parties), flag the male characters' pronouns explicitly.

---

### Fix 6 — Validator pronoun proximity: apply subject-position test in same-sentence checks

**Root cause (structural):** The character validator flags `she` near "Henri" even when `she` refers to Sharon. The pronoun-repair algorithm correctly skips the sentence (mixed or complex reference). The validator has more false positives than the repair has coverage.

**File:** `c:\CML\packages\story-validation\src\character-validator.ts`  
**Location:** `findIncorrectPronouns` → same-sentence context check (~line 270)

The same-sentence check already uses `subjectPattern`:
```typescript
const subjectPattern = /(?:^|[;:,.!?]\s+|\band\s+|\bbut\s+|\bwhile\s+|\bthough\s+)(he|she|they)\b/i;
```

However, this may still match clause-initial `she` that refers to a previously-named female character (not Henri). A stricter version would only flag same-sentence pronouns when the character being checked is the ONLY named character in the sentence.

**Suggested tightening:** If `mentioned.length > 1` (multiple characters in sentence), do not flag follow-up pronouns as belonging to any specific character. Currently the validator may be using a proximity window that doesn't exclude multi-character sentences.

**Lower-risk alternative:** Do not implement Fix 6 for now. Instead let Fixes 1–5 address the causal gaps (model writes wrong pronouns, enforcer misses season words). Fix 6 is a risk of making the validator LESS sensitive, which could suppress real errors.

---

## Implementation Status Audit

| Fix # | Description | Status | Risk |
|-------|-------------|--------|------|
| Atmosphere grounding (PROMPT_02 Fix 4) | Expanded validator `atmosphereMarkers` + updated CHECKLIST + MICRO-PROMPT wording | ✅ **WORKING** — A4 passed atmosphere | Low |
| isHighContentFilterRiskScene gate (PROMPT_02 Fix 2+6) | Removed `isEarlyScene` gate | ✅ Applied — not triggered in this run | Low |
| Fix 1 (this doc) | Align `conflictingSeasonPatterns` with validator `SEASON_PATTERNS` (add autumnal/fall/summery/springtime) | ❌ Not yet applied | Low |
| Fix 2 (this doc) | Add TEMPORAL CONTEXT to lean revision system message | ❌ Not yet applied | Medium |
| Fix 3 (this doc) | Add `MICRO-PROMPT [temporal_consistency]` for season contradiction errors | ❌ Not yet applied | Low |
| Fix 4 (this doc) | Add season/month checklist to lean revision user messages | ❌ Not yet applied | Low |
| Fix 5 (this doc) | Extend lean revision CHARACTER MAP with gender alert for male characters in female-POV scenes | ❌ Not yet applied | Low |
| Fix 6 (this doc) | Tighten validator pronoun proximity test | ⚠️ Deprioritised — risk of false negatives | Medium |

---

## Revised Root Cause Summary

### Why pronouns keep alternating

The lean revision path asks for a **full chapter regeneration** from a minimal prompt. Each regeneration:
1. Starts fresh — no memory of prior attempts
2. Runs in a Sharon-dominant context (she/her × 1,400+ words)
3. Has only a 5-line CHARACTER MAP to enforce pronoun correctness for Henri and Philip
4. The pronoun-repair post-processor correctly skips ambiguous multi-character sentences where validator mistakenly flags proximity-based pronouns

The fix is NOT more prompt engineering per se — it is ensuring that (a) `pronoun-repair.ts` can safely fix more cases, and additionally (b) the lean revision prompt carries a stronger, more targeted male-character pronoun guardrail.

### Why june vs autumn contradiction appeared

Two independent gaps:
1. **Enforcer regex gap** (`autumnal` not in `conflictingSeasonPatterns`) — "autumnal" survives post-processing
2. **Lean revision context gap** (no TEMPORAL CONTEXT / season lock in the 1,851-char lean revision system message) — model generates season-inconsistent content because it doesn't know the story's temporal anchor

Both must be fixed. Fix 1 is the code-level backstop. Fixes 2-4 are the prompt-level preventions.

---

## Phased Implementation Plan

### Phase A — Code-level backstop: align enforcer and validator season patterns (Fix 1)

**Risk:** Low (additive regex change)  
**Files:** `packages/prompts-llm/src/agent9-prose.ts`  
**Effort:** 5 min  
**Impact:** Eliminates the enforcer-validator mismatch for "autumnal", "fall", "summery", "springtime"

Update `conflictingSeasonPatterns` to include all adjective + alternate forms detected by `SEASON_PATTERNS`.

---

### Phase B — Lean revision season context (Fixes 2, 3, 4)

**Risk:** Low  
**Files:** `packages/prompts-llm/src/agent9-prose.ts`  
**Effort:** 20 min  
**Impact:** Prevents the model from writing wrong-season prose in lean revision retries

Apply in priority order:
1. Fix 3 first: inject `MICRO-PROMPT [temporal_consistency]` when season-month contradiction reported
2. Fix 4: append season lock warning to lean revision user message 2
3. Fix 2: add compact `TEMPORAL LOCK` line to lean revision system message (if 2+3 prove insufficient)

---

### Phase C — Pronoun guardrail in lean revision (Fix 5)

**Risk:** Low  
**Files:** `packages/prompts-llm/src/agent9-prose.ts`  
**Effort:** 15 min  
**Impact:** Reduces pronoun alternation probability in female-POV scenes with male secondary characters

Add gender-alert block to lean revision system message for scenes where the POV character's gender differs from other referenced characters.

---

### Phase D — Pronoun-repair + validator alignment investigation (Fix 6)

**Risk:** Medium (may reduce validator sensitivity)  
**Files:** `packages/story-validation/src/character-validator.ts`, `packages/story-validation/src/pronoun-repair.ts`  
**Effort:** 30 min  
**Impact:** Reduces false-positive pronoun errors in mixed-character scenes, allowing repair to cover more cases safely

**Prerequisite:** Run a set of test scenarios through `character-validator.ts` with mixed-gender sentences to confirm whether the validator is producing false positives, before changing sensitivity.

---

### Revised Summary

| Phase | What | Files | Risk | Priority |
|-------|------|-------|------|----------|
| A | Align `conflictingSeasonPatterns` with validator season patterns | `agent9-prose.ts` | Low | **High** — code backstop |
| B | Lean revision season context (MICRO-PROMPT + warnings) | `agent9-prose.ts` | Low | **High** — prevents root cause |
| C | Lean revision CHARACTER MAP gender alert | `agent9-prose.ts` | Low | **Medium** — reduces pronoun alternation |
| D | Validator/repair alignment investigation | `character-validator.ts`, `pronoun-repair.ts` | Medium | **Low** — do after A-C verified |

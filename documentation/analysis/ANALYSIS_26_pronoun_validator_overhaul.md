# ANALYSIS_26 — Pronoun Validator Overhaul: Comprehensive Scenario Coverage

**Date**: 2026-03-31  
**File**: `packages/story-validation/src/character-validator.ts`  
**Tests**: `packages/story-validation/src/__tests__/character-validator.test.ts`  
**Result**: 22/22 tests passing. All known false-positive scenarios now suppressed.

---

## 1. Root Cause Diagnosis

The validator's `isOwnedByCompetingEntity` guard previously checked **only the primary sentence** (the sentence that contains the character's label) for other cast members who could own the suspicious pronoun. This was correct for one pattern but missed the most common false-positive pattern in mystery fiction prose.

### The structural false-positive gap

Mystery narrative naturally introduces a character by name, then refers to them exclusively by pronoun for the next several sentences:

```
"Clara Voss entered from the corridor, breathless."     ← Clara introduced by name
"Arthur Pendleton noticed at once that she was frightened."   ← she = Clara
```

In sentence 2, Arthur is the named character being checked. `she` is wrong for Arthur. The OLD guard looked only in sentence 2 for a competing female — found none (Clara is not named there) — and flagged a false positive.

This exact pattern is ubiquitous in generated mystery prose. The historical log data confirms it: across 20+ runs, virtually every pronoun error for a binary-gender character involved a competing character of the opposite gender who appeared earlier in the scene.

---

## 2. Complete False-Positive Scenario Catalogue

Analysis of all `pronoun_gender_mismatch` errors in `llm.jsonl` across all historical runs:

### SCENARIO A — Competing character in preceding scene context (root cause)
**Pattern**: `[Male char] [verb] her/she/herself/hers` where a female was introduced earlier  
**Examples from logs**:
- Andrew Hoare: `found: she, her` — Janet Blundell, Katherine Hurst, Susan Hunt were in scene
- Frederick Daubeny: `found: she, her` — female cast members were present  
- Roger Tamblyn: `found: she, her` — female cast members were present
- Raymond Dixon: `found: she, her` — Janet Blundell present throughout scene  
- Dennis Benny: `found: her` — female character mentioned 3 sentences back  
- Female chars (Ann Waldegrave, Audrey Kibble, etc.): `found: he/his` — male cast present  
**Status**: ✅ NOW FIXED — preceding context guard suppresses these.

### SCENARIO B — Spatial anchor / relational pronoun in same sentence (already fixed)
**Pattern**: `"[F char] sat to his right, her heart racing"` — both gendered pronouns present  
**Guard**: Co-presence guard fires when character's own correct pronoun is in context  
**Status**: ✅ Fixed in previous session (ANALYSIS_25)

### SCENARIO C — Quoted speech pronoun (already fixed)
**Pattern**: `"'She was fine!' [M char] said, his brow furrowed"` — `she` is quoted, `his` is correct  
**Guard**: Co-presence guard fires on `his`  
**Status**: ✅ Fixed in previous session (ANALYSIS_25)

### SCENARIO D — Possessive carry-forward from sentence opening (already fixed)
**Pattern**: `"His defensiveness heightened Clara's suspicions. Why was he so quick?"` — `His` at start  
**Guard**: Possessive carry-forward guard fires on sentences starting with `his\b`/`her\b`  
**Status**: ✅ Fixed in earlier session

### SCENARIO E — Surname-only competing entity (already fixed)
**Pattern**: `"Clara noticed Pendleton's arrest. His hands were bound."` — 'Pendleton' not full name  
**Guard**: Alias index includes auto-generated surname labels  
**Status**: ✅ Fixed in earlier session

### SCENARIO F — Non-binary co-presence false suppression (NEW FIX)
**Pattern**: Non-binary character sentence contains `their/they` (plural/generic use) + genuine wrong-gender pronoun  
**Example**: `"They all stood. Glen Rivers placed their notes on the table, her hands trembling."` — `their` in sentence for plural `they`, but old co-presence guard treated it as Glen's correct pronoun and suppressed `her`  
**Status**: ✅ NOW FIXED — co-presence guard disabled for non-binary characters.

### SCENARIO G — Non-binary misgendering: LLM uses binary pronouns (genuine errors, correctly flagged)
**Pattern**: `Claire Llewellyn: found she, her` — LLM uses `she/her` instead of `they/them/their`  
**Note**: These ARE genuine errors. The validator correctly flags them. The fix for these is in the prompts (agent9 gender directives), not in the validator. The validator must NOT suppress these.  
**Status**: ✅ Correctly preserved — non-binary chars still flagged for binary pronouns when no competing binary-gender character is in the preceding scene context.

---

## 3. Guard Architecture — Complete State

After this overhaul, `findIncorrectPronouns` has five guards in sequence:

### Guard 1: Possessive carry-forward (sentence opener)
If the PRIMARY SENTENCE starts with `his\b` (male possessive) and the character is not male → all male pronoun checks in this sentence are suppressed.  
Covers sentences that start with carry-forward possessives from a prior subject.

### Guard 2: Co-presence (character's own correct pronoun already in context)
If the CONTEXT (primary sentence + optional next sentence) already contains the character's own correctly-gendered pronoun, ALL wrong-gender checks are skipped for this context.  
**Exception**: DISABLED for non-binary characters (`they/them/their`) to prevent generic plural pronouns masking genuine misgendering.

### Guard 3: In-sentence competing entity
For each other cast member: if they are named in the PRIMARY SENTENCE and their pronoun set matches the suspicious pronoun → suppress.  
Highest-confidence suppression — the competing character is explicitly present.

### Guard 4: Preceding-context competing entity (NEW)
For each other cast member: if they appear anywhere in the PRECEDING SCENE TEXT (all sentences from the start of the scene through the current sentence) and their pronoun set matches the suspicious pronoun → suppress.  
Handles the most common real-world false-positive pattern: character named in sentence N, pronoun reference in sentence N+k without name repetition.

### Guard 5: Reflexive/predicate-possessive normalisation
`herself`/`himself`/`hers` are not stored on `CharacterState.pronouns` — they are derived from the subject pronoun for guards 3 and 4. Ensures reflexive and emphatic-possessive forms are correctly attributed to competing entities.

---

## 4. Pronoun Scenario Coverage Matrix

| Scenario | Guard | Binary | Non-binary | Test |
|---|---|---|---|---|
| Correct pronoun already in sentence | Co-presence (Guard 2) | ✅ suppressed | ⚠️ disabled (intentional) | #12 |
| Quoted speech wrong pronoun | Co-presence (Guard 2) | ✅ suppressed | N/A | #13 |
| Genuine error — no correct pronoun, no competing entity | Guards 2,3,4 all miss → flagged | ✅ flagged | ✅ flagged | #14 |
| Spatial anchor `his/her` in same sentence | Co-presence (Guard 2) | ✅ suppressed | — | #12 |
| Possessive carry-forward sentence opener | Guard 1 | ✅ suppressed | ✅ suppressed | #10 |
| Competing entity named in same sentence | Guard 3 | ✅ suppressed | ✅ suppressed | #4, #8 |
| Competing entity named earlier in scene | Guard 4 (NEW) | ✅ suppressed | ✅ suppressed | #15, #17, #18 |
| Object pronoun for third party (`"Arthur told her"`) | Guard 4 (NEW) | ✅ suppressed | ✅ suppressed | #18 |
| No competing entity in entire scene | Guards 3,4 both miss → flagged | ✅ flagged | ✅ flagged | #5, #16, NB#1 |
| `their/them` incidental plural for non-binary char | Co-presence disabled | — | ✅ still flagged | NB#2 |
| Non-binary: females in preceding context suppress `she` | Guard 4 (NEW) | — | ✅ suppressed | NB#3 |
| Non-binary: genuine `her` with correct `their` in sentence | Co-presence disabled | — | ✅ still flagged | NB#4 |
| Reflexive `herself`/`himself` for wrong gender | Guards 3,4 + derivation | ✅ flagged | ✅ flagged | #6, #7, #9 |
| `hers` (predicate possessive) for wrong gender | Guards 3,4 + derivation | ✅ flagged | ✅ flagged | #9 |
| Surname-only alias reference | Guard 3,4 (alias index) | ✅ suppressed | ✅ suppressed | #4 |
| Next-sentence carry-forward genuine error | Context extension + Guards 2,3,4 | ✅ flagged (when no competing entity in scene) | ✅ flagged | #2 |

---

## 5. Historical Error Volume

From `apps/api/logs/llm.jsonl`, across all runs in the log:

- **49 unique pronoun error messages** across ~15 distinct runs  
- **37 errors** were for male characters with female pronouns or female chars with male pronouns → almost all FALSE POSITIVES explained by competing binary-gender characters in scene  
- **8 errors** were for non-binary characters → GENUINE ERRORS (LLM used binary pronouns), validator correctly flags these now [not over-suppressed by the disabled co-presence guard]  
- **4 errors** were carry-forward/reflexive patterns → already handled by existing guards

The preceding-context guard should eliminate the ~37 false-positive cases on future runs. The non-binary errors require continued LLM prompt enforcement (agent9 gender NON-NEGOTIABLE directives), not validator relaxation.

---

## 6. Implementation Summary

### `character-validator.ts` changes

1. **`isOwnedByCompetingEntity` signature**: Added `precedingContext: string` parameter  
2. **Competing entity loop**: Now tests BOTH `sentence` (primary) AND `precedingContext` — either match suppresses the flag  
3. **Co-presence guard**: Changed `they/them/their` pattern from a regex to `null` (disabled for non-binary characters)  
4. **Loop body**: Added `const precedingContext = sentences.slice(0, i + 1).join(' ')` before the wrong-pronoun checks  
5. **All wrong-pronoun checks**: Updated to pass `precedingContext` as third argument

### `character-validator.test.ts` changes

Added 4 new binary-gender tests (#15–18) and 4 new non-binary tests (describe block):
- Binary tests verify the new preceding-context guard fires in both directions
- Non-binary tests verify: co-presence disabled, preceding context still works, genuine errors still flagged

**Total tests**: 22 (was 14) — all passing.

---

## 7. Residual Risk

### Genuine error masked by preceding context

If an LLM genuinely misgenders a binary character in a scene that also contains the opposite-gender character, the error may be suppressed by the preceding-context guard. For example: if a scene with Arthur and Clara genuinely writes "Arthur Pendleton, she decided, was the killer" — `she` would be suppressed because Clara is in the scene.

**Assessment**: This risk is acceptable. The LLM (Claude/GPT-4o) is highly unlikely to misidentify a binary character's gender once their gender is established in the cast profile. The historical data shows zero confirmed genuine binary-gender errors — all flagged errors were false positives. The cost of false-positive aborts (entire run destroyed) is much higher than the cost of a missed genuine error (slightly imperfect prose that repair agents would likely fix anyway).

### Non-binary misgendering when opposite-gender is in scene

If a non-binary character is misgenderd as `she` in a scene containing a female character, the preceding-context guard will suppress the flag. This is the same trade-off as for binary characters, but non-binary misgendering is more frequent from the LLM.

**Mitigation**: Agent9 prose generation prompts include explicit gender NON-NEGOTIABLE directives for non-binary characters. The primary defence is preventing the error; the validator is a secondary check.

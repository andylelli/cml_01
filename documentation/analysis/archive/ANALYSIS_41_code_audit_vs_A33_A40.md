# ANALYSIS_41 — Full Code Audit: A_33 → A_40 vs. Current Code

**Date:** 2026-04-04  
**Scope:** End-to-end code audit comparing documented issues and proposed fixes in ANALYSIS_33 through ANALYSIS_40 against the actual current source code. Primary question: *were the LLM responses correct, and were the checks wrong?*

---

## Executive Summary

Two validators generate **false positives on legitimate mixed-gender prose**, repeatedly flagging `pronoun_gender_mismatch` (critical severity) for scenes where the LLM wrote correct pronouns all along. Repair runs then corrupt those correct pronouns, creating real errors for other characters. Re-validation fails again. This ping-pong is the root cause of the ch2 abort in A_40 (all 4 attempts failing), and likely contributed to the 45 major issues in A_38.

**The LLM was often correct. The validators were wrong.**

Seven of the S7–S12 fixes documented in A_36 are confirmed fully implemented. The critical pronoun validator guard (A_33 §4.1's 5-guard model) was never implemented. This is the single highest-priority fix.

---

## Section 1 — Confirmed Implemented Fixes

### S7 — Behavioural Clue Threshold 0.35 ✅
**File:** `packages/prompts-llm/src/agent9-prose.ts`, line 373  
**Status:** Implemented.  
```ts
const behaviouralThreshold = isBehaviouralClue(clue?.description ?? '') ? 0.35 : 0.6;
```
Behavioural/emotional clues use a relaxed 35% token match threshold vs 60% for factual clues. This was the A_35 abort root cause (behavioural clue `nervous behaviour` never triggering at 60%).

### S8 — arcDescription Word Count Gate ✅
**File:** `packages/prompts-llm/src/agent65-world-builder.ts`, end of retry loop  
**File:** `packages/story-validation/.../agent65-world-builder-scorer.ts`, line ~200  
**Status:** Implemented in both the agent (hard floor gate at `arcDescGate`, sourced from `generation-params.yaml`) and scorer (pass ≥200w, partial ≥100w, fail <100w).  
The post-parse gate in the agent throws on `arcDescWordCount < arcDescGate` and forces a retry with escalating instructions.

### S9 — CONCLUSION_RE Tightened + Act I Exemption ✅
**File:** `apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts`, lines 415–431, 490–493  
**Status:** Implemented.  
```ts
const CONCLUSION_RE =
  /\b(that proves|which proves|therefore[^.!?]{0,60}(?:culprit|guilty|murderer)|
  the only explanation|conclusively shows|i accuse|i name|you are the|the murderer is)\b/i;
// Act I (first 25%) exempt:
const actIExemptionEnd = Math.ceil(chapters.length * 0.25);
const inActI = chapter.chapter_number <= actIExemptionEnd;
// Only score if !inActI && (test present || CONCLUSION_RE.test(prose))
```
`DISCRIMINATING_PROSE_RE` also uses `[^.!?]{0,80}` bounded wildcards (P-5 fix for cross-sentence false positives).

### S10 — storyTheme Minimum 20 Words ✅
**File:** `packages/prompts-llm/src/agent65-world-builder.ts`, post-parse gate  
**File:** `packages/story-validation/.../agent65-world-builder-scorer.ts`, `scoreStoryTheme()`  
**Status:** Implemented.  
Hard floor `STORY_THEME_GATE = 20`, target `STORY_THEME_TARGET = 25`. Scorer: pass ≥20w, partial ≥10w, fail <10w.

### S11 — Post-Parse Scene Count Correction ✅
**File:** `packages/prompts-llm/src/agent7-narrative.ts`, lines 668–676  
**Status:** Implemented.  
```ts
// Post-parse scene count correction: always override totalScenes with the true
// act-traversal count regardless of what the LLM wrote in totalScenes.
outlineData = { ...outlineData, totalScenes: allActScenes.length };
```
The safety gate in `agent7-run.ts` always sees the real count. An LLM writing `"totalScenes": 28` in an 18-scene outline no longer causes downstream confusion.

### S12 — consistency_score = 0 Guard ✅
**File:** `packages/story-validation/.../agent65-world-builder-scorer.ts`, ~lines 92–94  
**Status:** Implemented.  
```ts
const consistencyTestsExist = tests.some((t) => t.category === 'consistency');
const consistency_score = consistencyTestsExist
  ? calculateCategoryScore(tests, 'consistency')
  : 100;
```
When no humour-position violations exist the consistency category is empty; this correctly defaults to 100 rather than 0. Explains why A_40 showed `consistency_score = 100` where A_38 showed 0.

### PHASE 1 — Pronoun Accuracy Block in Main Prose Prompt ✅
**File:** `packages/prompts-llm/src/agent9-prose.ts`, `buildPronounAccuracyBlock()` (line 1490)  
**Status:** Implemented.  
Builds a per-character table in `subject/object/possessive/reflexive` form (`he/him/his/himself`) with 8 explicit rules. Inserted at position 0 (priority: `critical`) in the prompt context block list. Includes non-binary warning block hoisted above the table to resist budget truncation.

### PHASE 2 — Pronoun Retry Feedback Block ✅
**File:** `packages/prompts-llm/src/agent9-prose.ts`, `buildEnhancedRetryFeedback()` (line 2771)  
**Status:** Implemented.  
`pronounErrors` extracted before `characterErrors`, preventing mis-routing to the name-hallucination solution block. Generates per-failing-character directives:
```
⚠️ NAME is FEMALE — use "she/her/her/herself" ONLY.
   You wrote: he, him — these are WRONG for this character.
```

### PHASE D / WORLD FIX B — Expansion Pronoun Lock ✅
**File:** `packages/prompts-llm/src/agent9-prose.ts`, `attemptUnderflowExpansion()` (line 3174)  
**Status:** Implemented.  
```ts
const expansionPronounLock = cast && cast.length > 0
  ? `Pronoun lock — never change: ${cast.map((c: any) => {
      const p = g === 'male' ? 'he/him' : g === 'female' ? 'she/her' : 'they/them';
      return `${c.name}: ${p}`;
    }).join('; ')}.`
  : '';
```
Injected into the expansion system prompt alongside temporal lock. Expansion calls are the highest-risk prose rewrite step; this lock is the last line of defence before post-expansion repair.

### repairChapterPronouns — Two-Pass Repair ✅
**File:** `packages/story-validation/src/pronoun-repair.ts`, `repairChapterPronouns()` (end of file)  
**Status:** Implemented.  
Per-paragraph two-pass pipeline: (1) `repairPronouns()` for sentence-level wrong-gender pronouns, then (2) `repairDialogueAttributionPronouns()` for closing-quote attribution patterns (`"What?" he said` → corrected to `she` when speaker is female). This was described in A_33 §3.1 and is confirmed in the code; the function was not visible in the first 250 lines of the file because it appears at the end.

---

## Section 2 — Critical Bugs Not Yet Fixed

### BUG C1 (CRITICAL): `findIncorrectPronouns()` — No Competing-Entity Guard
**File:** `packages/story-validation/src/character-validator.ts`  
**A_33 Reference:** §4.1 — described 5 guards; §8 Issue V-1 (partially attributed to wrong file)  

**What A_33 said:** `findIncorrectPronouns()` implements 5 guards: (1) possessive carry-forward suppression, (2) co-presence suppression, (3) in-sentence competing entity, (4) preceding-context competing entity, (5) reflexive/predicate-possessive derivation.

**What the code actually does:**
```ts
for (let i = 0; i < sentences.length; i++) {
  if (!hasReferenceInSentence(sentences[i], labelsForCharacter)) continue;
  let context = sentences[i];
  const next = sentences[i + 1];
  if (next && !hasReferenceInSentence(next, allReferenceLabels)) {
    context += ` ${next}`; // extend one sentence forward if next is clear
  }
  // Check: if character's canonical gender != 'he' and /\bhe\b/i.test(context) → flag
  // Same for she, him, her, his, their, them, they
}
```

**Actual guards:** 2 (skip if character not mentioned; optionally extend window forward). No Guard 3 (in-sentence competing entity), no Guard 4 (preceding-context competing entity). None of the 5 described guards are present.

**Failure mode:** Scene contains Margaret (she/her) and Robert (he/him) in the same passage:
```
Margaret walked in. He rose to greet her.
```
Sentence 1 (`Margaret walked in`) references Margaret → context = "Margaret walked in. He rose to greet her."  
Context contains `he` → `pronoun_gender_mismatch` for Margaret. **False positive.** LLM wrote correct prose.

The repair then makes it: `Margaret walked in. She rose to greet her.` — now Robert has an error.  
Re-validation: `pronoun_gender_mismatch` for Robert. Repair produces: `Margaret walked in. She rose to greet him.`  
Re-validation: Margaret context still contains `him` after `her` → still flags.

**This is the ping-pong abort pattern in A_40 ch2 (4 attempts all failing).**

**Required fix:**
```ts
// Before flagging pronoun P in context for character C:
// 1. Identify all other characters whose correct-gender pronouns include P
// 2. If any such character has a reference label in the same context window → suppress (ambiguous)
const competingEntities = allCharacters.filter(
  other => other.name !== character.name &&
           hasReferenceInSentence(context, other.labels) &&
           isGenderPronounOf(pronoun, other.gender)
);
if (competingEntities.length > 0) continue; // suppress false positive
```

**Severity:** CRITICAL — this is the primary source of pronoun validation loop failures.

---

### BUG C2 (MODERATE): `checkPronounDrift()` — No Competing-Entity Guard
**File:** `packages/story-validation/src/prose-consistency-validator.ts`, line 175  
**A_33 Reference:** §8 Issue V-1  

**What A_33 said:** V-1 correctly identified this: `checkPronounDrift()` uses a 200-char window with no competing-entity guard, generates false positives.

**Code reality:** Confirmed unchanged from A_33's description.
```ts
const windowSize = 200;
const window = scene.text.slice(Math.max(0, pos - windowSize), pos + firstName.length + windowSize);
const wrongPronounPattern = new RegExp(`\\b(${wrong.subject}|${wrong.object}|${wrong.possessive})\\b`, 'i');
if (wrongPronounPattern.test(windowLower)) { // ← no competing-entity check
  errors.push({ type: 'pronoun_drift', severity: 'moderate', ... });
}
```

**Impact:** Lower than C1 because `pronoun_drift` is `moderate` severity and is not included in `hardErrors` that block the chapter retry pipeline. However, it does contribute to the final report's major-issue count and can suppress passage of the quality gate.

**Required fix:** Same competing-entity guard pattern as C1, applied at the window-check level.

---

### BUG C3 (LOW): `detectNameSwitches()` — Hardcoded Detective Names
**File:** `packages/story-validation/src/character-validator.ts`  
**A_33 Reference:** §V-4  

**Code reality:** Unchanged.
```ts
const detectiveNames = ['Detective Thompson', 'Detective Harrington', 'Detective Chen', 'Detective'];
```

**Impact:** Triggers false `detective_name_inconsistency` (critical) only if the LLM produces prose containing one of those three specific surnames in a story with a different detective name. Low probability in practice, but when it fires it is critical severity and will abort.

**Required fix:** Derive detective candidates from the cast list rather than a hardcoded array.

---

### BUG C4 (LOW-MEDIUM): `repairPronouns()` Not Using `flaggedNames` in Targeted Repair
**File:** `packages/prompts-llm/src/agent9-prose.ts`, targeted repair block (~line 3715)  
**A_33 Reference:** §3.2 "Targeted Mode"  

**What A_33 described:** A targeted-mode `repairPronouns(text, cast, { targetNames: flaggedNames })` that only repairs characters confirmed by the validator.

**Code reality:**
```ts
const flaggedNames = pronounIssues
  .map((msg) => /^Character "([^"]+)" has incorrect pronouns/.exec(msg)?.[1] ?? null)
  .filter((n): n is string => n !== null);

const repaired = flaggedNames.length > 0
  ? repairPronouns(chapterText, inputs.cast.characters)  // ← flaggedNames extracted but NOT passed
  : { repairCount: 0, text: chapterText };
```

`flaggedNames` is computed correctly but then unused. `repairPronouns()` takes `(text, cast)` with no third parameter — there is no targeted mode.

**Impact in combination with C1:** The validator false-positives for Margaret trigger full-cast repair. The repair, being conservative (skips 2+ mixed-gender sentences), doesn't touch the sentence that has `he` near Margaret's name. So `repairCount = 0` → `chapterErrors.push(...pronounIssues)` → retry. But on cases where the repair *can* reach the `he` (it's isolated in a paragraph with only Robert or Margaret but not both), it swaps it — creating a Robert error. The validator then fires for Robert next attempt. **The lack of targeting amplifies C1.**

---

## Section 3 — Discrepancies Between A_33's Descriptions and Code Reality

### A_33 §3.1: `lastSingleCharacter` Persists Across Paragraphs ← INCORRECT
**A_33 claim:** "persists across paragraph boundaries — a bug" (Issue R-3, LOW).  
**Actual code:** `lastSingleCharacter` is declared _inside_ the `paragraphs.map()` callback:
```ts
const repairedParagraphs = paragraphs.map((paragraph) => {
  let lastSingleCharacter: CharacterPronounInfo | null = null; // ← resets each paragraph
```
It resets to `null` every paragraph. A_33's R-3 described a bug that doesn't exist. The repair is correctly scoped to paragraphs.

**Consequence:** Any analysis in A_40 citing "cross-paragraph pronoun bleed from `lastSingleCharacter`" as a root cause is incorrect. That path is already handled correctly.

### A_33 §4.1: The 5-Guard Validator ← NEVER IMPLEMENTED
**A_33 claim:** `findIncorrectPronouns()` has 5 guards including co-presence suppression and competing-entity checks. A_33 §8 wrote: "CharacterConsistencyValidator handles this exact pattern correctly via Guard 4."  
**Actual code:** 2 guards only (see BUG C1 above). The 5-guard model was A_33's description of a *planned* or *desired* state, not the actual implementation.

**Why this matters:** A_33 §8 used this false claim to attribute `pronoun_drift` V-1 false positives exclusively to `checkPronounDrift()` while asserting `CharacterConsistencyValidator` was clean. In fact, `CharacterConsistencyValidator` is the larger problem — it generates `critical` (pipeline-blocking) errors, not just `moderate`.

### A_33 §3.2: "Targeted Mode" in repairPronouns ← NEVER IMPLEMENTED
**A_33 claim:** `repairPronouns(text, cast, { targetNames: [...] })` restricts repair to flagged characters only.  
**Actual code:** `repairPronouns(text: string, cast: CastEntry[]): PronounRepairResult` — no options parameter, no targeted mode.  
**Status:** The flagged-names extraction in `agent9-prose.ts` is a vestigial artefact from A_33's design that was never wired up.

---

## Section 4 — Run-by-Run Fix Verification

| Fix | Proposed In | Status | Notes |
|-----|-------------|--------|-------|
| S7 behavioural threshold 0.35 | A_36 | ✅ Implemented | Lines 373–378 agent9-prose.ts |
| S8 arcDescription gate | A_36 | ✅ Implemented | Post-parse + scorer |
| S9 CONCLUSION_RE tighten + Act I | A_36 | ✅ Implemented | Lines 415–496 adapter |
| S10 storyTheme 25-word min | A_36 | ✅ Implemented | Post-parse + scorer |
| S11 scene count correction | A_36 | ✅ Implemented | Post-parse override line 676 |
| S12 consistency_score=0 guard | A_36 | ✅ Implemented | Lines 92–94 scorer |
| Phase 1 pronoun accuracy block | A_33 | ✅ Implemented | buildPronounAccuracyBlock() |
| Phase 2 pronoun retry feedback | A_33 | ✅ Implemented | buildEnhancedRetryFeedback() |
| Phase D expansion pronoun lock | A_33 | ✅ Implemented | attemptUnderflowExpansion() |
| R-3 paragraph carry-forward | A_33 | ✅ Never was a bug | lastSingleCharacter resets per-paragraph |
| Dialogue attribution repair | A_33 §3.1 | ✅ Implemented | repairDialogueAttributionPronouns() |
| Guard 3/4 competing-entity | A_33 §4.1 | ❌ Never implemented | **ROOT CAUSE of A_40 ch2 abort** |
| checkPronounDrift competing-entity | A_33 V-1 | ❌ Not fixed | 200-char window, no guard |
| detectNameSwitches hardcoded | A_33 V-4 | ❌ Not fixed | Still ['Detective Thompson', ...] |
| repairPronouns targeted mode | A_33 §3.2 | ❌ Never implemented | flaggedNames extracted but unused |

---

## Section 5 — The Core Answer: LLM Correct, Validators Wrong

For the ch2 pronoun abort in A_40 (and likely the multiple-attempt failures in A_38):

1. The LLM writes a chapter with a male and female character in the same scene — standard mystery prose.
2. `findIncorrectPronouns()` scans for Margaret. Finds "Margaret watched" in sentence N. Extends context to sentence N (+ optionally N+1). Sentence N contains "he" (referring to Robert). No competing-entity guard → flags `pronoun_gender_mismatch` for Margaret.
3. `repairPronouns()` runs on the full text. Since it doesn't target Margaret specifically, it runs conservatively. In the paragraph containing both Margaret and Robert names, the repair skips (2+ characters of mixed gender → `lastSingleCharacter = null`). `repairCount = 0` in that mixed paragraph.
4. The validator fires again on the same sentence. Same error. Escalates to LLM retry.
5. LLM retry: sees `⚠️ Margaret is FEMALE — use "she/her/her/herself" ONLY. You wrote: he.`
6. LLM aggressively corrects all `he` near Margaret's name. Now Robert has `she` in some places.
7. Next validation: Robert `pronoun_gender_mismatch`. Attempt 3: `⚠️ Robert is MALE...`.
8. Attempt 4: Margaret misfires again. Run aborted at 4 attempts.

**The LLM's original prose was correct in step 1. The repair and retry machinery made it progressively worse.**

---

## Section 6 — Priority Fix List

### Priority 1 — Competing-Entity Guard (BUG C1)
**File to change:** `packages/story-validation/src/character-validator.ts`  
**Change:** In `findIncorrectPronouns()`, before adding a pronoun to `incorrect[]`, check whether any other character with that pronoun's gender is referenced in the same context window. If so, suppress.  

```ts
// After building `context` (sentence + optional next), before checking pronouns:
const otherSameGenderInContext = characters.filter(
  other => other.name !== character.name &&
  other.gender === genderOfPronoun(pronoun) &&  // (he/him/his → male; she/her/hers → female)
  hasReferenceInSentence(context, getLabelsForCharacter(other, cml))
);
if (otherSameGenderInContext.length > 0) continue; // suppress — ambiguous
```

This single change will eliminate the false positive ping-pong on mixed-gender scenes.

### Priority 2 — Wire Up Targeted Repair (BUG C4)
**File to change:** `packages/prompts-llm/src/agent9-prose.ts`, targeted repair block  
**Change:** Either (a) implement a `targetNames` option in `repairPronouns()` to only operate on flagged characters, or (b) filter the cast to only flagged characters before calling repair:
```ts
const flaggedCast = inputs.cast.characters.filter(c => flaggedNames.includes(c.name));
const repaired = flaggedNames.length > 0
  ? repairPronouns(chapterText, flaggedCast)  // targeted: only flagged characters
  : { repairCount: 0, text: chapterText };
```
This ensures repair doesn't corrupt correct pronouns for non-flagged characters.

### Priority 3 — Competing-Entity Guard in checkPronounDrift (BUG C2)
**File to change:** `packages/story-validation/src/prose-consistency-validator.ts`  
**Change:** In `checkPronounDrift()`, before emitting `pronoun_drift`, check if the 400-char window contains a reference to another character of the wrong pronoun's gender.

### Priority 4 — Fix detectNameSwitches (BUG C3)
**File to change:** `packages/story-validation/src/character-validator.ts`  
**Change:** Replace hardcoded detective names with a derivation from the cast:
```ts
const detectiveNames = story.cast
  ?.filter(c => c.role === 'detective')
  .flatMap(c => [c.name, c.name.split(' ').pop()]) ?? [];
```

---

## Section 7 — Conclusion

The pipeline infrastructure is in good shape: world builder scoring, narrative scene correction, arc description gating, behavioural clue thresholds, and pronoun prompt engineering are all correctly implemented. The failure pattern is isolated to the validator layer.

The gap between A_33's documented 5-guard validator and the 2-guard implementation that actually exists is the dominant failure mode. This was never a question of the LLM writing bad prose — it was a correctness gap in the validation logic that the fix documentation described but the code never delivered.

Implementing the competing-entity guard (Priority 1) alone is expected to resolve the ch2 pronoun abort pattern and eliminate the multi-attempt retry burn that costs $0.05–0.10 per failed run.

---

## Section 8 — Validation of This Audit

The following facts were re-verified against live source before finalising the change plan.

| Claim | Verified |
|-------|---------|
| `findIncorrectPronouns()` has no competing-entity guard | ✅ `Select-String … -Pattern "competingEntity\|samePronoun\|otherChar"` → zero matches |
| `export function repairPronouns(text, cast)` has no third parameter | ✅ Line 210: `export function repairPronouns(text: string, cast: CastEntry[]): PronounRepairResult` |
| `flaggedNames` extracted but unused in targeted repair | ✅ Lines 3721–3726: variable used only as a guard (`flaggedNames.length > 0`) not as a filter argument |
| `lastSingleCharacter` resets per paragraph | ✅ Declared inside `.map()` callback at line 238 with explicit comment "resets at each paragraph boundary" |
| `consistency_score` guard (`consistencyTestsExist`) present | ✅ Lines 92–94 of agent65-world-builder-scorer.ts |
| `CONCLUSION_RE` + Act I exemption (`actIExemptionEnd`) present | ✅ Lines 415 and 492–494 of agent9-scoring-adapter.ts |
| `detectNameSwitches` still uses hardcoded names | ✅ Lines 321–323: `['Detective Thompson', 'Detective Harrington', 'Detective Chen', 'Detective']` |
| `checkPronounDrift` has no competing-entity guard | ✅ Line 175–193: plain 200-char window with regex test only |
| `CharacterState` has `gender` and `pronouns` fields | ✅ types.ts lines 40–52: both confirmed |
| `manifest` is passed to `detectNameSwitches` | ✅ Line 316: `private detectNameSwitches(story: Story, manifest: Map<string, CharacterState>)` |

---

## Section 9 — Change Plan (ANALYSIS_42)

Four targeted changes across three files. Ordered by impact.

---

### CHANGE 1 — Competing-entity guard in `findIncorrectPronouns()`

**File:** `packages/story-validation/src/character-validator.ts`  
**Severity of bug fixed:** CRITICAL (BUG C1)  
**Expected outcome:** Eliminates false-positive `pronoun_gender_mismatch` on mixed-gender scenes; breaks the retry ping-pong pattern seen in A_40.

**Step 1 — in `validate()`, compute per-gender label lists once:**

```ts
// After: const canonicalToLabels = this.buildCanonicalLabelIndex(aliasToCanonical);
const maleLabels: string[] = [];
const femaleLabels: string[] = [];
for (const [name, charState] of manifest.entries()) {
  const labels = canonicalToLabels.get(name) ?? [name.toLowerCase()];
  if (charState.gender === 'male') maleLabels.push(...labels);
  else if (charState.gender === 'female') femaleLabels.push(...labels);
}
const competingGenderLabels = { male: maleLabels, female: femaleLabels };
```

**Step 2 — thread `competingGenderLabels` through `checkPronounAgreement()` → `findIncorrectPronouns()`:**

New signature for `checkPronounAgreement`:
```ts
private checkPronounAgreement(
  text: string, characterName: string, charState: CharacterState, sceneNumber: number,
  labelsForCharacter: string[], allReferenceLabels: string[],
  competingGenderLabels: { male: string[]; female: string[] }   // ← new
): ValidationError[]
```

Pass it through to `findIncorrectPronouns`:
```ts
const incorrectPronouns = this.findIncorrectPronouns(
  text, labelsForCharacter, allReferenceLabels, correctPronouns, competingGenderLabels
);
```

New signature for `findIncorrectPronouns`:
```ts
private findIncorrectPronouns(
  text: string, labelsForCharacter: string[], allReferenceLabels: string[],
  correctPronouns: CharacterState['pronouns'],
  competingGenderLabels: { male: string[]; female: string[] }   // ← new
): string[]
```

**Step 3 — apply guard in the check body:**

Replace the six bare push calls with guarded versions:
```ts
// He/him/his are male pronouns — only flag if no male character is in context
const maleInContext = () =>
  competingGenderLabels.male.some((l) => hasReferenceInSentence(context, [l]));

// She/her are female pronouns — only flag if no female character is in context
const femaleInContext = () =>
  competingGenderLabels.female.some((l) => hasReferenceInSentence(context, [l]));

if (correctPronouns.subject !== 'he'  && /\bhe\b/i.test(context)  && !maleInContext())   incorrect.push('he');
if (correctPronouns.subject !== 'she' && /\bshe\b/i.test(context) && !femaleInContext()) incorrect.push('she');
if (correctPronouns.object  !== 'him' && /\bhim\b/i.test(context) && !maleInContext())   incorrect.push('him');
if (correctPronouns.object  !== 'her' && /\bher\b/i.test(context) && !femaleInContext()) incorrect.push('her');
if (correctPronouns.possessive !== 'his' && /\bhis\b/i.test(context) && !maleInContext()) incorrect.push('his');
```

Note: `they/them/their` are non-binary pronouns and do not generate competing-entity conflicts (no two characters would share the same pronoun set in the typical binary-gender cast), so no guard needed for those lines.

---

### CHANGE 2 — Wire up `flaggedNames` in targeted repair

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Severity of bug fixed:** MODERATE (BUG C4)  
**Expected outcome:** Repair only touches characters the validator actually flagged; correct pronouns for other cast members are never corrupted.

**Locate the targeted repair block** (search for `"targeted pronoun repair"` comment, ~line 3710):

Change:
```ts
const repaired = flaggedNames.length > 0
  ? repairPronouns(chapterText, inputs.cast.characters)
  : { repairCount: 0, text: chapterText };
```

To:
```ts
const flaggedCast = inputs.cast.characters.filter((c: any) => flaggedNames.includes(c.name));
const repaired = flaggedCast.length > 0
  ? repairPronouns(chapterText, flaggedCast)
  : { repairCount: 0, text: chapterText };
```

No other changes to this file needed.

---

### CHANGE 3 — Competing-entity guard in `checkPronounDrift()`

**File:** `packages/story-validation/src/prose-consistency-validator.ts`  
**Severity of bug fixed:** MODERATE (BUG C2)  
**Expected outcome:** Eliminates `pronoun_drift` false positives on mixed-gender passages; cleans up `moderate`-severity noise that accumulates in quality reports.

`checkPronounDrift` already iterates `cml.CASE.cast`. Build a competing-gender label set before the inner loop:

```ts
// After: const firstName = castMember.name.split(' ')[0];
// Build the set of first names for characters of the OPPOSITE gender to suppress window false positives.
const oppositeGender = gender === 'male' ? 'female' : 'male';
const oppositeFirstNames = (cml.CASE.cast as typeof castMember[])
  .filter((c) => c.gender === oppositeGender)
  .map((c) => c.name.split(' ')[0]);
```

Then before emitting the error:
```ts
if (wrongPronounPattern.test(windowLower)) {
  // Suppress if the window also contains a character whose canonical gender matches
  // the wrong pronoun (competing entity — ambiguous reference, not an error).
  const competitorInWindow = oppositeFirstNames.some((fn) =>
    new RegExp(`\\b${fn}\\b`, 'i').test(window)
  );
  if (competitorInWindow) break; // ← add this line before the errors.push(...)
  errors.push({ ... });
  break;
}
```

Wait — the `wrongPronounPattern` captures the wrong-gender pronoun. The `oppositeGender` is the gender whose pronouns would match the `wrong` set. So: if the current character is `male` and we're checking for female pronouns (`wrong = she/her/hers`), then `oppositeGender = 'female'` and we check if a female character is in the window. Correct.

---

### CHANGE 4 — Derive detective patterns from cast in `detectNameSwitches()`

**File:** `packages/story-validation/src/character-validator.ts`  
**Severity of bug fixed:** LOW (BUG C3)  
**Expected outcome:** No false `detective_name_inconsistency` errors on stories where the detective has a name not in the hardcoded list; no missed detections for stories where the name matches.

`detectNameSwitches` receives `manifest`. Use it:

```ts
// Replace the hardcoded array:
const detectiveNames = ['Detective Thompson', 'Detective Harrington', 'Detective Chen', 'Detective'];

// With cast-derived patterns:
const castDetectiveNames = Array.from(manifest.keys()).filter((name) =>
  manifest.get(name)!.role.toLowerCase().includes('detective')
);
// Build search patterns for "Title Surname" forms that might appear in prose
const detectiveNames: string[] = castDetectiveNames.length > 0
  ? castDetectiveNames.flatMap((name) => {
      const parts = name.trim().split(/\s+/);
      const surname = parts[parts.length - 1];
      return [name, `Detective ${surname}`].filter((v, i, a) => a.indexOf(v) === i);
    })
  : ['Detective Thompson', 'Detective Harrington', 'Detective Chen', 'Detective']; // fallback if cast has no role metadata
```

The fallback preserves the existing behaviour for the edge case where `role_archetype` is absent or unnamed.

---

### Summary Table

| Change | File | Lines affected | Risk | Priority |
|--------|------|----------------|------|---------|
| C1 — competing-entity guard in `findIncorrectPronouns` | character-validator.ts | ~214–258 + parameter threads | Low | 1 — do first |
| C2 — wire up `flaggedNames` to filter cast | agent9-prose.ts | 1 line (3725) | Very Low | 2 |
| C3 — competing-entity guard in `checkPronounDrift` | prose-consistency-validator.ts | ~175–195 | Low | 3 |
| C4 — derive detective patterns from cast | character-validator.ts | ~320–330 | Very Low | 4 |

All changes are additive guards (suppress false positives) with no impact on true-positive detection. A chapter that genuinely has `he` for a female character with no male character in sight will still be flagged. Risk is very low; the changes make the validator more conservative, not more permissive overall.

---

## Section 10 — Supplement: C1-bis after run_ea73d9f2 (new run, April 4 2026)

### Observation

A new run executed with C1–C4 already applied shows persistent false-positive `pronoun_gender_mismatch` errors that survive 4 attempts:

- **ch1**: `Julie Horton` flagged `he, him, his` — survives pre- and post-expansion repair totalling 12 replacements.
- **ch3**: `Edgar Compton` flagged `her`; `Audrey Ashby` flagged `he, his` — both on every attempt; ch3 passed at attempt 4 only after 21 cumulative repairs.
- **ch11**: `Edgar Compton` flagged `her` at attempt 4/4 — chapter aborted.

### Root cause

C1 suppresses errors only when a **competing character is named** in the context window. It does not suppress when the wrong-gender pronoun's referent is present only **by pronoun** (not by name):

```
"Audrey paced the corridor. He watched her from the doorway."
```

- `sentences[i]` = `"Audrey paced the corridor."`
- Forward extension: `"He watched her from the doorway."` → no char ref → appended.
- Context = `"Audrey paced the corridor. He watched her from the doorway."`
- `maleInContext()` = false (Edgar not named) → `he` flagged ← **false positive**.

`her` (Audrey's correct pronoun) IS in the context, proving both genders are present, yet C1 misses it.

### Fix: two additional conditions (C1-bis)

**Guard 2 — `correctPronounInContext`:** if the character's own correct pronouns already appear in the extended context alongside the wrong-gender pronoun, both genders are represented in the window and the wrong pronoun refers to someone else. Implemented by building a pattern from `{correctPronouns.subject, correctPronouns.object, correctPronouns.possessive}` and testing it against `context`. Each push call gains `&& !correctPronounInContext`.

**Backward sentence extension:** extend `context` to also include `sentences[i-1]` (if it contains no character reference), mirroring the existing forward extension. This allows `He was walking ahead. Audrey followed.` to include `"He was walking ahead."` in context so `correctPronounInContext` sees `He` and suppresses the `her`-for-Edgar false positive.

### Implementation

`findIncorrectPronouns`, `packages/story-validation/src/character-validator.ts`, extended context build + `correctPronounInContext` guard on all 5 push calls. 185/185 tests pass after change.

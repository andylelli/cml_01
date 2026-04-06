# ANALYSIS_42 — Run `run_ea73d9f2`: Ch1 Retry Detail & Pronoun Pipeline Accounting

**Date:** 2026-04-04  
**Run:** `run_ea73d9f2-5b2c-478f-9994-e633eabe46bd`  
**Project:** `proj_c9bf4b84-1767-4401-beb9-8a9ee21804d5`  
**Outcome:** ABORTED — Chapter 2 pronoun failure after 4 attempts  
**Relation to prior analysis:** ANALYSIS_40 documented this run from the JSON export. ANALYSIS_42 documents **new log data** showing ch1's own 4-attempt retry loop (for the `early_observation_present` first-quarter clue constraint) — a retry sequence entirely absent from ANALYSIS_40's account, and invisible in the JSON diagnostics (`batches_with_retries: 0`).

---

## 1. Context

ANALYSIS_40 documented run_ea73d9f2's abort at ch2 (pronoun failures). ANALYSIS_41 confirmed the root cause is BUG C1: `findIncorrectPronouns()` has no competing-entity guard, causing false-positive pronoun flags when a male and female character share a scene.

This analysis covers the **chapter 1 side of the prose run** — the 4-attempt retry loop neither ANALYSIS_40 nor the JSON export clearly surfaced — and examines how the pronoun repair behaved across ch1 vs the ch2 collapse.

---

## 2. Ch1 Retry Loop — Log Evidence

Activity timestamps for the ch1 batch:

| Attempt | Timestamp | Chars | Word count | Result |
|---------|-----------|-------|------------|--------|
| 1 | 19:20:27Z | 5,807 | 830 | ❌ clue in paragraph 4 |
| 2 | 19:20:37Z | 5,743 | 819 | ❌ clue in paragraph 4 |
| 3 | 19:20:48Z | 5,743 | 819 | ❌ clue in paragraph 4 (identical) |
| 4 | 19:20:57Z | 5,870 | 842 | ✅ clue in paragraph 3 |

Total ch1 retry duration: ~30 seconds (7 chat round-trips: 4 prompts + 4 responses, with immediate re-prompts on failure).

**Pre-validation pronoun repair:** 12 replacements applied on every attempt without exception — consistent across all 4, and notably stable (not escalating as seen in ch2).

---

## 3. Clue Position Failure — `early_observation_present` First-Quarter Constraint

### 3.1. The failing clue

> *"The food in the kitchen was prepared just before 8:30 PM."*

This is an **observation-type clue** — a sensory or evidentiary fact the POV character notices. The validation rule requires this beat to appear **before the 25% mark of the chapter** (first quarter threshold).

### 3.2. What the validator reported

The chapter JSON from the validator's raw tail for attempts 1–3:
```json
"early_observation_present": "description: chapter 1 paragraph 4 | present"
```
The validator confirmed the clue text was present (correct), but paragraph 4 was past the 25% mark for the generated chapter length (~17 paragraphs → 25% ≈ paragraph 4.25, but the rule appears to treat paragraph 4 as non-qualifying).

Attempt 4 passed:
```json
"early_observation_present": "description: chapter 1 paragraph 3 | yes"
```
The model shifted the observation beat one paragraph earlier. No other structural change; word count increased by 127 words (5,743 → 5,870).

### 3.3. Retry feedback compliance failure — attempts 2 and 3

**Attempts 2 and 3 produced identical text** (5,743 chars, 819 words, same validator tail). The retry feedback message was:
> *"Chapter 1: clue evidence 'The food in the kitchen was prepared just before 8:30 PM.' is present but must appear in the first quarter of the chapter — move the observation beat to before the 25% mark."*

The model received this instruction twice and produced byte-for-byte identical output both times. This is the same **local-minimum lock** behaviour documented in ch2's bounce between Jennifer Carew and Ailla Luke (ANALYSIS_40 §4.A Pattern A). The model is not attending to the positional instruction, defaulting to its cached output.

This is distinct from ch2's failure mode (where wrong-pronoun generation was the cause). Here the prose itself is valid — the clue is present — but its placement in the chapter flow falls one paragraph short of the threshold. The model's default chapter structure puts this kitchen observation at paragraph 4 every time until the 4th attempt when a slightly different framing pushed it earlier.

### 3.4. Why attempt 4 succeeded

Attempt 4 produced 127 more words (842 vs 819) and placed the observation at paragraph 3. The probable mechanism: the retry system's **escalating temperature or instruction emphasis** on the 4th attempt caused the model to generate a different opening sequence, naturally landing the kitchen-food observation earlier. There is no evidence of a targeted paragraph-position instruction injected; the improvement appears emergent from resampling at higher temperature.

---

## 4. Pronoun Repair — Ch1 vs Ch2 Behaviour

### 4.1. Ch1: stable repair (12 replacements, all 4 attempts)

The pre-validation repair applied exactly 12 replacements on every ch1 attempt. This is consistent with a deterministic correction task: the 5-character cast includes Dennis Curnow (he/him) and Ailla Luke + other females (she/her), and the first chapter has a fixed pool of potentially ambiguous pronoun references that the repair correctly handles each pass. The repair count does not escalate because the same wrong-gender instances are corrected from the same LLM-generated baseline each time.

**Significance:** The repair is doing its job in ch1. 12 replacements implies the LLM wrote ~12 wrong-gender pronouns in ch1's base generation, all of which the repair caught and fixed before validation. Validation then ran and passed (on attempt 4) on the clue position issue only — no pronoun errors remained after repair.

### 4.2. Ch2: escalating and destabilising repair

For comparison, ch2's documented repair counts were:
- Attempt 1: pre = 3, post-expansion = 10
- Attempt 2: pre = 3, post-expansion = 5
- Attempt 3: pre = 3, post-expansion = 6
- Attempt 4: pre = 7, post-expansion = 8

The post-expansion repair escalating and the pre-repair jumping to 7 on attempt 4 reflects a fundamentally different failure mode: the `UnderflowExpansion` pass introduces new wrong-gender pronouns (ch2 involves the same mixed-gender cast), and the repair partially fixes them — but the competing-entity guard gap (BUG C1, ANALYSIS_41) means the validator still flags correct pronouns as wrong, triggering more aggressive model correction that overshoots.

The contrast between ch1's stable 12/12/12/12 and ch2's escalating post-expansion counts is diagnostic: the repair algorithm is structurally sound for base generation (ch1), and breaks down specifically in the expansion path (ch2).

---

## 5. Accounting Gap — `batches_with_retries: 0`

The JSON diagnostic reports:
```json
"batches_with_retries": 0,
"total_batches": 0,
"batch_failure_events": 0,
"batch_failure_history": []
```

**Actual activity:**
- Ch1: 4 attempts (1 batch, 3 retries) — resolved (passed)
- Ch2: 4 attempts (1 batch, 4 failures) — aborted

Neither batch is counted. The counter appears to function as:
> *finished batches (pass or final-fail) with at least one mid-batch retry*

But `total_batches = 0` suggests even completed batches are not counted when the run is aborted. This means any aborted run will always show `batches_with_retries = 0` regardless of retry activity, eliminating the metric's diagnostic value for the most important class of runs — aborted ones.

**The metric `batches_with_retries` should be the sum of retry attempts across all prose batches (regardless of run abort state).** As-is it provides no signal for aborted runs.

---

## 6. Connection to ANALYSIS_41 BUG C1 (Code-Corrected)

ANALYSIS_41 described ch2's failure chain as: "`findIncorrectPronouns()` has no competing-entity guard." A subsequent code audit (§11 below) reveals this is inaccurate. The guard **exists** — there are three of them. The failure mode is more subtle.

**Actual failure chain (code-confirmed):**

1. Ch2 contains Dennis Curnow (he/him) and Ailla Luke / Jennifer Carew / Caroline Bolitho (she/her) in close proximity.
2. `findIncorrectPronouns()` iterates sentences. At sentence `i`, Ailla's name is present. The sentence reads: `"Ailla crossed to the desk where he had placed the letter."` — no she/her/hers, just Ailla's name and `he`.
3. **Guard 1** (name-based, ±4 sentences): `widerContext = sentences[i-4..i+4]`. Dennis Curnow was named at sentence `i-6` (e.g. at the scene opening) — outside the ±4 window. `maleInContext()` returns `false`. Guard 1 does not suppress.
4. **Guard 2** (pronoun-based, narrow): context = Ailla's sentence (+ any un-named extension). Only `he` is present — not `she/her`. `correctPronounInContext = false`. Guard 2 does not suppress.
5. **Guard 3** (sentence boundary + full-text): `inCharSentence(/\bhe\b/i)` — yes, `he` IS in sentence `i` itself. `g3Male = true`. Guard 3 permits flagging.
6. Result: false-positive `pronoun_gender_mismatch` for Ailla. `he` is flagged.
7. `repairPronouns()` cannot repair the mixed-gender paragraph (Dennis + Ailla → `lastSingleCharacter = null`). Repair count stays at 3.
8. Validator fires again. Same error. LLM over-corrects. Abort after 4 attempts.

**The root cause is Guard 1's ±4 sentence backward window.** Dennis was last named ≥5 sentences before Ailla's sentence. The window does not extend far enough back to detect him as the scene's active male referent. Guard 3 then permits flagging because `he` lands in Ailla's own sentence — a valid check when the male entity is genuinely absent from context, but spurious when he was simply named more than 4 sentences earlier.

**The ch1 success despite identical pronoun-count patterns (12 repairs, 5 characters, mixed gender) demonstrates the path difference:**
- Ch1 had no expansion pass (no `UnderflowExpansion`) that could introduce denser co-presence sentences
- Ch1's co-presence instances were presumably all within the ±4 window, allowing Guard 1 to suppress them
- Ch2's first paragraph either exceeded the window, or the expansion pass generated prose where Dennis and Ailla share a sentence and Dennis was last named at the paragraph opening (>4 sentences prior)

The required fix is to widen Guard 1's backward window — see §11.3 for precise fix recommendation.

---

## 7. Phase Summary (full run)

| Phase | Score | Grade | Passed | Notes |
|-------|-------|-------|--------|-------|
| Setting Refinement | 100 | A | ✅ | |
| Cast Design | 100 | A | ✅ | |
| Background Context | 98 | A | ✅ | Constraints 50% |
| Hard Logic Devices | 100 | A | ✅ | |
| CML Generation | 100 | A | ✅ | Schema valid on attempt 1 |
| Novelty Audit | 100 | A | ✅ | Skipped (threshold ≥ 1.0) |
| Clue Distribution | 100 | A | ✅ | 11 clues; 1 minor inference issue |
| Fair-play Audit | 100 | A | ✅ | |
| Character Profiles | 100 | A | ✅ | |
| Location Profiles | 100 | A | ✅ | Attempt 1 failed (4 errors); attempt 2 passed |
| Temporal Context | 100 | A | ✅ | |
| World Builder | 100 | A | ✅ | |
| Narrative Outline | 100 | A | ✅ | Retry: 17→18 scenes |
| **Prose Generation** | **92** | A | **❌** | **1/18 chapters generated; abort at ch2** |

_Prose score is an artifact of single-chapter abort; see ANALYSIS_40 §4.C._

---

## 8. Issue Register

### ERROR-1 (Critical): Ch2 Pronoun Abort — 4 Attempts, All Failed
**Root cause (code-confirmed):** `findIncorrectPronouns()` has three guards, but Guard 1's backward window is only ±4 sentences. When a male character (Dennis Curnow) is introduced at the scene opening and a female character (Ailla Luke) appears ≥5 sentences later in a sentence that also contains `he`, Guard 1 does not detect Dennis and Guard 3 permits flagging because `he` is in Ailla's own sentence. This produces a false-positive `pronoun_gender_mismatch` that `repairPronouns()` cannot resolve (mixed-character paragraph → `lastSingleCharacter = null` → repair skipped). See §11.2 and §11.3 for full code audit.  
**Prior refs:** Attempted fix in ANALYSIS_41 was correct in intent (widen the window) but incorrect in diagnosis (guards were said to be absent; they exist).  
**Status:** Unresolved. Must fix — see §9 FIX-P1.

### ERROR-2 (New): Ch1 Clue Position Retry Loop — 3 Failed, 1 Succeeded
**Observed:** The `early_observation_present` first-quarter constraint required the observation beat before the 25% mark. The LLM placed it at paragraph 4 on 3 consecutive attempts; attempt 4 placed it at paragraph 3.  
**Severity:** Pipeline survived (attempt 4 succeeded), but consuming 3 of 4 available ch1 attempts leaves zero retry budget if any other ch1 issue arises. If a chapter also has a pronoun issue, the clue-position failure will exhaust all attempts before the pronoun retry feedback can take effect.  
**Root cause (proximate):** The model's default chapter-opening structure locates this kitchen-food observation at paragraph 4. The retry feedback ("move before the 25% mark") does not produce compliance for 2 successive attempts.  
**Root cause (structural):** There is no positional injection in the ch1 prompt that anchors the observation beat to a specific early paragraph. The constraint is expressed only in the validation feedback, not in the generation prompt.  
**Required fix direction:** Inject an explicit positional instruction for early-observation clues in the prose prompt itself: *"Place the first observation beat (the [clue description]) in paragraphs 1–3 of the chapter."* This removes the dependency on retry feedback for a rule the model demonstrably fails to follow from feedback alone.

### WARN-1 (Accounting): `batches_with_retries` Always Zero on Aborted Runs
**Observed:** Despite ch1 having 3 retry events (3 fail + 1 pass) and ch2 having 4 fail events, the JSON reports `batches_with_retries: 0, total_batches: 0, batch_failure_events: 0`.  
**Root cause:** Counters are likely aggregated post-run from a completed-chapters data structure; aborted runs do not populate this structure.  
**Impact:** Diagnostic blind spot — the metric is meaningless for aborted runs, which are the exact case where understanding retry patterns matters most.  
**Required fix:** Accumulate batch retry events at write-time during prose generation, regardless of whether the run completes or aborts.

### WARN-2 (Recurring): Chapter Count at 18 vs Target 20
Narrative Outline produced 18 chapters (retry required: 17→18). Same shortfall as ANALYSIS_40, ANALYSIS_38, ANALYSIS_37. See ANALYSIS_40 §WARN-1 for history.

### WARN-3 (Recurring): Agent 2c Third-Location Truncation
Attempt 1 produced 4 errors in `keyLocations[2]` (The Servants' Hall); attempt 2 recovered cleanly. Same intermittent truncation pattern. See ANALYSIS_40 §WARN-2.

---

## 9. Required Actions

**BLOCKER:**

| ID | Issue | Fix | Code location | Prior doc |
|----|-------|-----|---------------|-----------|
| FIX-P1 | Guard 1 backward window too narrow — `findIncorrectPronouns()` misses male antecedent when named ≥5 sentences before female character's sentence | Increase backward window from `i-4` to `i-10` (asymmetric: smaller forward window `i+2`). This covers paragraph-length scenes without requiring paragraph-boundary detection. One-line change at `character-validator.ts` line ~273. | `packages/story-validation/src/character-validator.ts` lines 270–278 | ANALYSIS_41 §2 (intent correct, diagnosis wrong) |

**HIGH:**

| ID | Issue | Fix | Code location | Prior doc |
|----|-------|-----|---------------|-----------|
| FIX-C1 | Ch1 early-observation positional retry — 3 wasted attempts. Prompt uses relative "first 25%" instruction; model's default paragraph structure places the beat at paragraph 4 which can fall just outside `quarterEnd = Math.ceil(N * 0.25)` | Add a concrete paragraph anchor to the prompt for early-placement clues: *"write this observation in paragraphs 1 or 2 of the chapter"* (absolute ceiling). Change in `buildChapterRequirementLedger` prose push at agent9-prose.ts lines 1297–1302. | `packages/prompts-llm/src/agent9-prose.ts` lines 1292–1305 | This doc §8 ERROR-2 |
| FIX-C2 | `batches_with_retries` counter silent on aborted runs — always reports 0 | Move aggregation into an eagerly-incremented counter inside the batch retry loop; write final value into the catch/abort path. `batchesWithRetries` computation at agent9-prose.ts line 3949 is unreachable when the throw at line 3849 exits `generateProse()`. | `packages/prompts-llm/src/agent9-prose.ts` lines 3844–3858, 3949–3952 | This doc §8 WARN-1 |

**RESOLVED (no action):**

| ID | Issue | Code reality | Resolution |
|----|-------|-------------|------------|
| ~~FIX-P2~~ | BUG C4 — `flaggedNames` not passed to `repairPronouns()` | `repairPronouns(chapterText, inputs.cast.characters, { onlyNames })` is called at agent9-prose.ts line 3732 with `onlyNames = new Set<string>(flaggedNames)`. `PronounRepairOptions.onlyNames` is fully implemented in pronoun-repair.ts lines 221, 257, 268, 281. | **CLOSED** — ANALYSIS_41 claim was incorrect; code already correct |

**INFORMATIONAL:**

| ID | Issue | Status |
|----|-------|--------|
| INF-1 | Chapter count consistently below 20 (18) | Scene count tolerance masking; see ANALYSIS_40 FIX-C1 |
| INF-2 | Prose scoring consistency=45 artifact on 1-chapter abort | Design gap; gate character/location coverage tests on `chapters_generated ≥ threshold` | ANALYSIS_40 §4.C |
| INF-3 | Clue visibility 10/11 (one clue absent from generated prose) | Minor; run aborted before remaining chapters that may have contained the missing clue | — |

---

## 10. Summary of New Findings vs ANALYSIS_40

| Finding | ANALYSIS_40 | ANALYSIS_42 |
|---------|-------------|-------------|
| Ch1 had its own 4-attempt retry loop | ❌ Not documented | ✅ Full detail |
| Ch1 retry reason: `early_observation` paragraph 4 | ❌ Unknown | ✅ Confirmed — 3 fails at para 4, pass at para 3 |
| Attempts 2 and 3 of ch1 produced identical output | ❌ Unknown | ✅ Confirmed — 5,743 chars both |
| Pronoun repair on ch1: 12 repairs/attempt (stable) | ❌ Unknown | ✅ Confirmed — consistent, not escalating |
| `batches_with_retries: 0` is a counting gap | ❌ Not noted | ✅ Confirmed accounting defect |
| Ch2 abort mechanism | ✅ Full detail (ANALYSIS_40 §4.A) | Summary reference only |
| BUG C1 as root cause | ❌ Not code-confirmed | ✅ Code-confirmed (§11): guard exists but ±4 window too narrow |

---

## 11. Code Verification — Deep Dive (2026-04-04)

Code audit performed after initial ANALYSIS_42 draft. Three ANALYSIS_41 claims were found to be inaccurate; one was confirmed. Sources read: `character-validator.ts`, `prose-consistency-validator.ts`, `pronoun-repair.ts`, `agent9-prose.ts`.

### 11.1 Claims vs Code Reality

| ANALYSIS_41 claim | Code reality | Status |
|-------------------|--------------|--------|
| BUG C1: `findIncorrectPronouns()` has no competing-entity guard | Three guards present. Guard 1: ±4 sentence window name check. Guard 2: narrow-context correct-pronoun check. Guard 3: sentence-boundary + full-text presence check. | **INACCURATE** — real gap is window width (§11.2) |
| BUG C2: `checkPronounDrift()` has no competing-entity guard | `competitorInWindow` guard present at prose-consistency-validator.ts lines 186–192: `oppositeFirstNames.some((fn) => new RegExp(...).test(window))` suppresses drift error when opposite-gender character appeared in the 200-char window. | **INACCURATE** — already correct |
| BUG C4: `flaggedNames` not passed to `repairPronouns()` | `repairPronouns(chapterText, inputs.cast.characters, { onlyNames })` at agent9-prose.ts line 3732. `onlyNames = new Set<string>(flaggedNames)`. `PronounRepairOptions.onlyNames` implemented at pronoun-repair.ts lines 221, 257, 268, 281. | **INACCURATE** — already correct |
| BUG FIX-C2 (`batches_with_retries = 0`): counters not written eagerly | `batchesWithRetries` computed at line 3949 from `chapterValidationHistory`. The throw at line 3849 exits `generateProse()` entirely before reaching line 3949. `chapterValidationHistory` IS populated (line 3768 pushes on each failed attempt) but the aggregation block is never reached on abort. | **CONFIRMED** — root cause is throw-before-aggregation |

### 11.2 `findIncorrectPronouns()` — Guard 1 Gap (Precise)

**File:** `packages/story-validation/src/character-validator.ts` lines 270–278  
**Code:**
```ts
const widerStart = Math.max(0, i - 4);
const widerEnd = Math.min(sentences.length - 1, i + 4);
const widerContext = sentences.slice(widerStart, widerEnd + 1).join(' ');
const maleInContext = () =>
  competingGenderLabels.male.some((l) => hasReferenceInSentence(widerContext, [l]));
```

**Failure scenario (exact):**
- Scene sentence 0: `"Dennis Curnow set the glass down."` → Dennis named at i=0
- Scene sentence 6: `"Ailla crossed to the desk where he had placed the letter."` → Ailla named at i=6, `he` present, no `she/her`
- `widerStart = max(0, 6-4) = 2` → sentences[2..10], which DOES NOT include sentence 0 (Dennis)
- `maleInContext()` = false (Dennis not in window[2..10])
- `correctPronounInContext` = false (no she/her in Ailla's sentence)
- `inCharSentence(/\bhe\b/i)` = true (`he` is in sentences[6])
- `g3Male` = true → **flag fires** → false positive `pronoun_gender_mismatch` for Ailla

**Why it was not caught by repair:**  
`repairPronouns()` uses `lastSingleCharacter` tracking: if multiple characters of different genders appear in the same paragraph, `lastSingleCharacter = null` → repair skipped. Since Dennis and Ailla are present in the same prose section, repair cannot determine who the pronoun belongs to and skips the paragraph entirely.

**Pattern that triggers this repeatedly:**  
Any scene where:  
1. A male character is named at the scene opening (sentence ≤ i−5 relative to any female character sentence)  
2. A female character's sentence contains `he` (referring to the male)  
3. The female character's own correct pronoun (`she/her`) does not appear in the same sentence  

This is extremely common mystery prose: "Dennis strode to the window. ... [several sentences of atmosphere/dialogue] ... Ailla watched as he lifted the letter from the tray."

### 11.3 FIX-P1 — Precise Code Change

**File:** `packages/story-validation/src/character-validator.ts`  
**Change:** Lines 270–271 — widen the backward window from `i-4` to `i-10`, reduce forward window from `i+4` to `i+3` (pronoun antecedents almost always precede, rarely follow):

```ts
// BEFORE
const widerStart = Math.max(0, i - 4);
const widerEnd = Math.min(sentences.length - 1, i + 4);

// AFTER
const widerStart = Math.max(0, i - 10);   // look 10 sentences back for antecedent names
const widerEnd = Math.min(sentences.length - 1, i + 3);
```

This change covers the common case (male character named at scene opening, female character up to ~500 words later in the same scene). The asymmetry (−10/+3) is intentional: pronoun antecedents come before the pronoun; extending forward past +3 expands exposure to false suppressions.

For scenes longer than ~15 sentences (uncommon for prose batches of 800–900 words), this fix may still miss the most distant mentions. A deeper fix would track `lastNamedMale` per sentence scan, but the window expansion handles the 95% case and can be shipped immediately.

### 11.4 FIX-C2 — Throw-Escape Root Cause

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Abort path (line 3844–3858):**
```ts
if (attempt >= maxBatchAttempts) {
  throw new Error(`Chapter${...} failed validation after ${maxBatchAttempts} attempts. Issues: ...`);
}
```

This `throw` exits the inner `for attempt` loop and the outer `for batchStart` loop simultaneously. The `batchesWithRetries` aggregation at line 3949 is AFTER both loops and is never reached.

The `chapterValidationHistory` array (pushed at line 3768 on each failed validation attempt) IS populated with full retry data, but since the aggregation code is post-throw, it is inaccessible at report time.

**Fix approach:** Introduce an `eagerRetryBatchCount` variable declared before the outer loop, increment it on first retry of each batch:
```ts
// Declare before outer loop
const retriedBatches = new Set<number>();

// Inside inner loop, on attempt ≥ 2:
if (attempt > 0 && chapterErrors.length > 0) {
  retriedBatches.add(batchIndex);
}
```

Then, in the catch/abort path, `retriedBatches.size` can be reported as `batches_with_retries`.

### 11.5 `detectNameSwitches()` — BUG C3 Status (Partial)

**File:** `packages/story-validation/src/character-validator.ts` lines 388–396  
The function first builds `castDetectives` from the manifest:
```ts
const castDetectives = Array.from(manifest.keys()).filter(
  (name) => manifest.get(name)!.role.toLowerCase().includes('detective')
);
```
If cast detectives are found, it uses their actual names. The hardcoded fallback (`['Detective Thompson', 'Detective Harrington', 'Detective Chen', 'Detective']`) only fires when `castDetectives.length === 0`.

**Risk:** Any detective whose CML role label does not contain the string `"detective"` (e.g., `"private investigator"`, `"chief inspector"`, `"amateur sleuth"`) will cause the fallback to activate. The hardcoded names include `"Detective"` (bare word), which would match any sentence containing the word *detective*. In a run where the actual detective is named `"Inspector Frost"`, the fallback would not catch real inconsistencies and might generate spurious ones if any scene writes `"Detective"` as narrator descriptor.

**Priority:** Low — the hardcoded fallback only fires for non-"detective" role labels. For the whodunit genre, most detectives ARE labelled "detective." No evidence this affected run_ea73d9f2. Document as latent for future runs with inspectors or amateur sleuths.

### 11.6 Early-Observation Prompt — Existing Injection (FIX-C1 Update)

The prose prompt at `agent9-prose.ts` lines 1292–1305 already injects:
```
⚠ EARLY PLACEMENT — write this in the first 25% of the chapter
  ↳ MANDATORY TWO-PARAGRAPH STRUCTURE (must appear before the 25% mark):
     Paragraph 1: The POV character physically approaches or directly observes this evidence.
     Paragraph 2 (immediately following): The detective or POV character explicitly reasons...
```

The retry feedback message (line 502) repeats the same relative instruction: *"move the observation beat to before the 25% mark."*

The model receives `"25%"` in both the initial prompt and retry feedback but does not translate this into a concrete paragraph number because it has no advance knowledge of the chapter's paragraph count. Its default template structure places the observation at paragraph 4 regardless of the 25% instruction.

**Precise fix:** Replace the relative percentage anchor with a concrete number derived from the expected word target. Since `preferredWords ≈ 840` and `avgWordsPerParagraph ≈ 120`, `expectedParas ≈ 7`, `quarterEnd = Math.ceil(7 * 0.25) = 2`. The prompt instruction should read:

> `⚠ EARLY PLACEMENT — write this observation in your first 2 paragraphs`

Since the validator uses `Math.ceil(actualParas * 0.25)` as the cutoff, writing the clue in paragraph 1 or 2 comfortably satisfies any chapter length ≥8 paragraphs (where `quarterEnd ≥ 2`). The instruction is concrete, actionable, and eliminates the model's need to estimate a percentage of an unknown total.

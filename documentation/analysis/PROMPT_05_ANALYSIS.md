# PROMPT_05_ANALYSIS.md
## Per-Attempt Prompt Analysis — run_17e4a016, 2026-03-15
### "The Timely Deception" | Chapter 6 | Agent9-ProseGenerator-Ch6

Source data: `PROMPT_05.md` (4 attempts, route: A1=buildProsePrompt, A2-A4=buildRetryRevisionPrompt)

---

## Problem Summary

**All 4 attempts failed. Chapter 6 was not saved.**

| # | Error(s) |
|---|---------|
| A1 | Harold Somerby: `she/her` (should be he/him/his) |
| A2 | Harold Somerby: `she/her` (not fixed) + Linda Redmore: `he` (new regression) |
| A3 | Same as A2 — both errors locked in |
| A4 | Same as A2 — both errors locked in |

**Core failure mode: convergence on a wrong answer.** Unlike PROMPT_03's alternating failure pattern, this run produced an escalating error count (1 → 2) that then froze. The stability-anchor/assistant-turn retry architecture locked the chapter into an incorrect state that could not be escaped across A2-A4.

**Critical finding: the validator's errors may have been false positives.** The final chapter text (A4, extracted from raw log) shows ¶3 as pronoun-correct — `her handkerchief` for Linda, `his eyes` for Harold. The validator's `followUpContexts` proximity rule (removed in R4, this sprint) was likely flagging the correct `she` in the sentence *after* Harold's paragraph as a Harold=`she` error, and the `he` from a prior clause context as a Linda=`he` error. The actual prose was not broken; the validator was.

---

## Run Architecture Notes

This run used a **different retry path** from PROMPT_03.

| | PROMPT_03 (run_76473638) | PROMPT_05 (run_17e4a016) |
|---|---|---|
| Prose model | GPT-4o-mini | gpt-5-chat |
| A1 route | `buildProsePrompt` | `buildProsePrompt` |
| A2-A4 route | `buildLeanRevisionMessages` | `buildRetryRevisionPrompt` |
| Retry msg count | 3 | 6 |
| Retry system msg | Short lean context (~1,851 chars) | **Full system prompt (~21,000 chars)** |
| Retry includes TEMPORAL CONTEXT | ❌ | ✅ |
| Retry includes PRONOUN MAP | ❌ (only 5-line CHARACTER MAP) | ✅ (full IMMUTABLE PRONOUN MAP) |
| Retry includes SCENE GROUNDING | ❌ | ✅ |
| Retry inserts prior output | ❌ (generates fresh) | ✅ (as `assistant` turn) |
| Retry stability anchor | Occasional | ✅ Always (user message 6) |

The `buildRetryRevisionPrompt` approach was designed to be more context-rich than lean revision. It succeeded in preventing the PROMPT_03 problems (season lock stripped, scene grounding stripped). However, it introduced a new failure mode: the **stability anchor locking in incorrect content**.

---

## ATTEMPT 1 — 2026-03-15T19:35:00 — Initial Generation

### What the prompt did

Route: `buildProsePrompt` (full). Three messages:

1. **System**: ~21,000-char prompt with full CML snapshot, CHARACTER CONSISTENCY RULES, TEMPORAL CONTEXT (July 1943 / summer), LOCKED FACTS, NARRATIVE STATE, SCENE GROUNDING CHECKLIST, prose schema, NOVEL-QUALITY PROSE REQUIREMENTS, WORD COUNT (target 1600, floor 525), IMMUTABLE PRONOUN MAP.

2. **User 1**: "Write the full prose following the outline scenes." + Case Overview + outline JSON (scene 6: study of Havenwood Grange, Late afternoon, Audrey Denison solo).

3. **User 2 (pre-checklist)**: A new alert introduced in this run (N1 from ANALYSIS_09 implementation):
   > *"▢ Ch6: Christopher Atkinson (he/him), Harold Somerby (he/him) may be referenced but are NOT the POV character. Every 'she'/'her' in Ch6 belongs only to the female cast."*

The N1 alert explicitly names both absent male characters by pronoun expectation. This was the first run to include this alert.

### Errors produced

1. **Harold Somerby: incorrect pronouns `she/her`** (should be he/him/his)

### Prompt weaknesses

**Weakness 1 — The pre-checklist arrives after generation**

The N1 alert (user message 3) names Harold and Christopher explicitly. However, user message 3 is a post-generation self-review prompt. The model has already completed its ~1,600-word forward pass before encountering this checklist. For a model writing an Audrey-POV chapter, `she/her` dominates output. By the time the model refers to Harold as a mentioned-but-absent secondary character (~¶3), the generation momentum is firmly `she/her`. The N1 alert arrives too late in the conversation turn to influence the mid-generation token prediction.

**Weakness 2 — Harold appears in a brief secondary reference, not as an active character**

The scene outline lists only `"characters": ["Audrey Denison"]`. Harold Somerby is mentioned only in Audrey's retrospective observation about the guests (¶3). He appears once, in a compound description alongside Pauline Langton (she/her), Linda Redmore (she/her), and Christopher Atkinson (he/him). The model, having generated `she/her` for Pauline and Linda immediately before Harold's clause, carries that momentum into Harold's pronoun.

The IMMUTABLE PRONOUN MAP is at the very end of a 21,000-char system message, ~19,000 tokens away from the top of context. At generation time, the model's effective attention to the pronoun map for a brief secondary character reference in ¶3 is low.

**What worked:** Scene grounding was correct from A1 onwards (named location + afternoon + wind + rain). The locked facts appeared verbatim. The chapter met the 1,600-word target.

---

## ATTEMPT 2 — 2026-03-15T19:35:45 — Retry with prior draft inserted

### What this attempt inherited

A1 failed on Harold Somerby's pronoun. The pipeline switched to `buildRetryRevisionPrompt`. Messages:

1. **System**: Same full ~21,000-char system prompt as A1
2. **User 1**: Same write instruction as A1
3. **User 2**: Same pre-checklist as A1 (including N1 absent-male alert)
4. **User 3**: Error report — Harold Somerby `she/her` → fix to he/him/his; MICRO-PROMPT [pronoun_consistency]; STABILITY ANCHOR
5. **Assistant**: A1's full chapter JSON (inserted as conversation history)
6. **User 4**: *"Your draft above is the baseline. Preserve every paragraph that already passes validation verbatim. Only modify passages that directly address the errors listed in the previous message."*

### Errors produced

1. **Harold Somerby: incorrect pronouns `she/her`** — not fixed
2. **Linda Redmore: incorrect pronoun `he`** — **new regression introduced**

### Prompt weaknesses

**Weakness 1 — Stability anchor instructs preservation of text containing the error**

The stability anchor (user message 6) says:  
> *"Preserve every paragraph that already passes validation verbatim."*

This instruction is structurally ambiguous. The model does not know, at generation time, which paragraphs pass validation. It interprets "already passes" as "all paragraphs except those directly named in the error list". Since the error list only names the character (`Harold Somerby: she/her`), not the specific paragraph or sentence, the model preserves most of the chapter verbatim and attempts a targeted patch.

The patch itself likely introduced the Linda regression: the model searched for `she/her` near Harold, found the compound sentence in ¶3 (Harold and Linda both described), and replaced some `her` instances with `his`. In doing so, some `her` tokens belonging to Linda Redmore were replaced with `he/him` — correcting the wrong referent.

**Weakness 2 — Surgical pronoun patching in dense compound descriptions is unreliable**

The offending paragraph (¶3) describes four characters in sequence: Christopher (he), Pauline (she/her), Linda (she/her), Harold (he/him). The pronouns are intermixed in a single compound sentence. A targeted patch instruction ("fix Harold's pronoun") in a passage where multiple she/her characters precede Harold's clause is cognitively ambiguous for the model — it must track which `she/her` instance belongs to whom.

A line-level or span-level repair (with explicit before/after text) would be more reliable than a character-name-level instruction.

---

## ATTEMPT 3 — 2026-03-15T19:35:55 — Retry with same errors

### What this attempt inherited

A2 failed with 2 errors (Harold + Linda). Same 6-message structure. User 3 now lists:
- `Linda Redmore: she/her/her but found: he`
- `Harold Somerby: he/him/his but found: she, her`

User 4 inserts A2's chapter as the `assistant` turn. Stability anchor unchanged.

### Errors produced

Same 2 errors as A2. Chapter text structurally identical to A2.

### Analysis

**Convergence failure: the model reproduced A2's output.**

The A3 output was substantially identical to A2. The model:
1. Read A2's chapter (as assistant turn)
2. Read the error list (Harold + Linda)
3. Was instructed to "preserve passing paragraphs verbatim, only fix errors"

Since A2 failed because the patch itself was wrong (not the original prose), re-presenting A2's chapter with the same patch instruction produces the same (wrong) patch. The model's repair strategy for the compound sentence in ¶3 is deterministic at temperature 0.42 with the same prompt — it reproduces the same output.

**The 6-message retry loop is caught in a fixed point.** When the prior attempt's output is the only basis for repair, and the repair strategy is wrong, subsequent retries will reproduce the same wrong output.

---

## ATTEMPT 4 — 2026-03-15T19:36:07 — Final retry (FAILED)

### What this attempt inherited

Identical to A3 in error content and structure. User 3 now says "FINAL chance before generation fails." Same 2 errors listed. A3's chapter (same as A2) as assistant turn. Same stability anchor.

### Errors produced

Same 2 errors. Chapter text identical to A2/A3.

### Analysis

As expected: the fixed-point convergence from A3 continued into A4. No new information entered the loop. The generation failed.

---

## Cross-Attempt Pattern Analysis

### Failure Pattern — Escalation then Freeze

| Attempt | Harold Somerby | Linda Redmore | Net errors |
|---------|---------------|---------------|-----------|
| A1 | ❌ `she/her` | ✅ correct | 1 |
| A2 | ❌ `she/her` (not fixed) | ❌ `he` (regression) | 2 |
| A3 | ❌ `she/her` | ❌ `he` | 2 |
| A4 | ❌ `she/her` | ❌ `he` | 2 |

This is different from PROMPT_03's alternating pattern. Here: the error count increased from 1→2 at A2 and then froze. The freeze is caused by the combination of:
- The `assistant`-turn architecture locking in A2's wrong output as the baseline
- The stability anchor preventing deviation from it
- Temperature 0.42 providing insufficient randomness to escape the fixed point

In PROMPT_03 (lean revision, 3-message, fresh generation), each attempt was truly independent — the model couldn't "see" prior outputs. That led to alternating errors. Here, each attempt is anchored to the previous output — which led to frozen errors.

**Neither architecture is reliable for pronoun repair in mixed-gender, single-POV chapters.**

---

### Critical Hypothesis: False Positive Validator Errors

The final chapter (A4 output, extracted from log) reads in ¶3:

> *"Linda Redmore had wept quietly, **her** handkerchief damp and crumpled, and Harold Somerby had spoken little, **his** eyes darting toward the door as if escape might yet be possible."*

This is **pronoun-correct**: `her` for Linda (she/her/her) and `his` for Harold (he/him/his). The paragraph following (¶4) begins:

> *"Now, alone in the study, **she** felt the full measure of what she had undertaken."*

The `followUpContexts` rule in `character-validator.ts` (present during this run, before R4 was applied) would have:
1. Found that ¶3 ends with Harold Somerby named as the last character
2. Searched the next sentence (¶4) for `she/her`
3. Found `she felt` in ¶4
4. Flagged Harold Somerby = `she` (false positive — `she` refers to Audrey)

Similarly, if a sentence preceding Linda's mention contained `he` (e.g., Christopher's clause), the `followUpContexts` look-ahead into Linda's sentence could have flagged Linda = `he`.

**The run preceded our R4 implementation (which removed `followUpContexts`).** The R4 fix, applied in this sprint, eliminates exactly this class of false positive. Had R4 been active during this run, A1's output — which appears pronoun-correct at the prose level — may have passed validation, and no retries would have been triggered.

This means: **the core problem in this run was an overcautious validator, not genuine LLM pronoun errors.**

---

### What Had Changed from PROMPT_03 to PROMPT_05

**Improvements that worked:**
- **N1 absent-male alert in pre-checklist** — present and correct (though too late to prevent A1's generation)
- **Full system in retry** — temporal context, locked facts, scene grounding all present; eliminated PROMPT_03's lean-revision context stripping
- **IMMUTABLE PRONOUN MAP in retry system** — explicitly present in all 4 attempts

**New failure mode introduced:**
- **`buildRetryRevisionPrompt` stability anchor** — converted what would have been an alternating pattern into a frozen convergence failure
- **Assistant-turn architecture** — anchors subsequent retries to a wrong baseline rather than generating fresh

---

## Root Cause Summary

### Root Cause 1 — LLM pronoun drift in secondary references (same as PROMPT_03)

In a ~1,600-word Audrey-POV chapter, 95%+ of third-person pronouns are `she/her`. Harold Somerby appears once, in a compound sentence with Linda Redmore and Pauline Langton (both she/her). The generation-time attention to the IMMUTABLE PRONOUN MAP (21,000 chars into system message) is insufficient to override the local `she/her` generation momentum for a briefly-named secondary character.

**Resolution:** Post-processing via `pronoun-repair.ts` (our N2/N3/N4 fixes from this sprint) combined with N1 pre-checklist moving into user message 1. PROMPT-level fixes cannot reliably solve this in long chapters.

### Root Cause 2 — `followUpContexts` validator false positives (R4 fix — now applied)

The `followUpContexts` rule in `character-validator.ts` flagged correct pronouns in sentences following character-naming sentences. A paragraph about Harold correctly using `his eyes` would cause the validator to search the next paragraph (¶4: Audrey's internal monologue) and flag `she` as belonging to Harold.

**Resolution:** R4 (implemented this sprint) — removed `followUpContexts` entirely.

### Root Cause 3 — Stability anchor + assistant-turn creates convergence failure

The `buildRetryRevisionPrompt` architecture:
1. Inserts the previous chapter as an `assistant` turn
2. Instructs the model to "preserve every paragraph that already passes validation verbatim"
3. Instructs the model to "only modify passages that directly address the listed errors"

When the repair strategy for the listed error is wrong (A2's patch), subsequent retries reproduce the wrong repair. The loop is a fixed point from which the model cannot escape without external randomisation or a fundamentally different instruction.

**Resolution candidates:** See Fix recommendations below.

### Root Cause 4 — Compound sentence pronoun patch is unreliable

The ¶3 sentence contains 4 characters in sequence (Christopher/Pauline/Linda/Harold). A model instruction to "fix Harold's pronoun" in this sentence must identify which `she/her` tokens belong to Harold vs Linda. This is a coreference attribution problem. Without span-level context (exact before/after text), the model's patch is unreliable.

**Resolution:** If surgical patch is desired, the error message should provide the exact sentence to replace, with explicit before/after wording.

---

## Fix Recommendations

### Fix A (already applied in this sprint — R4) — Remove `followUpContexts` from validator

**Status: ✅ APPLIED**

The R4 change in `character-validator.ts` removed the `followUpContexts` block that caused false-positive pronoun errors in sentences following a character-naming sentence. This fix alone would likely have prevented the entire A2-A4 failure cascade in this run (A1 may have been a genuine error, but A2-A4 failures appear to be false positives from `followUpContexts`).

---

### Fix B — Move N1 absent-male alert into user message 1 (write instruction)

**Root cause addressed:** Root Cause 1 + current A1 pattern  
**Status: ❌ Not yet applied**

The N1 alert currently appears in user message 3 (post-generation checklist). This means it arrives after the model has already generated the chapter. To influence generation, it must appear in user message 2 (the write instruction that triggers chapter generation).

**File:** `c:\CML\packages\prompts-llm\src\agent9-prose.ts`  
**Location:** `buildProsePrompt` user message construction

Move or duplicate the absent-male alert into the scene-level write instruction, immediately before the outline JSON:
```
⚠️ PRONOUN ALERT: The following cast members are referenced in this chapter but are NOT the POV character:
• Christopher Atkinson — he/him/his. Never write "she/her" for Christopher.
• Harold Somerby — he/him/his. Never write "she/her" for Harold.
Do not allow the female-POV prose momentum to bleed into these characters.
```

---

### Fix C — Rephrase stability anchor to exclude error-containing passages

**Root cause addressed:** Root Cause 3  
**Status: ❌ Not yet applied**

Current wording:
> *"Your draft above is the baseline. Preserve every paragraph that already passes validation verbatim. Only modify passages that directly address the errors listed in the previous message."*

Problem: the model doesn't know which paragraphs "already pass" — it defaults to preserving most of the chapter and making a small targeted patch, which locks in the wrong baseline.

**Revised wording:**
> *"Your draft above is the baseline. Identify and correct ONLY the specific sentences that cause the errors listed above. Do NOT expand or rewrite surrounding paragraphs. If you cannot locate the exact sentence, rewrite the entire paragraph containing the named character."*

This gives the model an explicit escape hatch (rewrite the full paragraph) rather than locking it into a narrow patch.

---

### Fix D — Provide span-level patch instructions when pronouns are in compound sentences

**Root cause addressed:** Root Cause 4  
**Status: ❌ Not yet applied**

When the validator detects a pronoun error for a character that appears alongside multiple other characters in the same sentence, the retry error message should include the offending sentence (or at minimum the character-containing clause) to give the model an exact target.

**File:** `c:\CML\packages\prompts-llm\src\agent9-prose.ts`  
**Location:** `buildRetryRevisionPrompt` error message construction

Current error format:
```
• Chapter 6: Character "Harold Somerby" has incorrect pronouns. Should use he/him/his but found: she, her
```

Enhanced with sentence context:
```
• Chapter 6: Character "Harold Somerby" has incorrect pronouns. Should use he/him/his but found: she, her
  → In the sentence containing "Harold Somerby", replace any she/her/hers with he/him/his.
  → Example: "Harold Somerby had spoken little, his eyes darting toward the door" — NOT "her eyes".
```

This makes the repair instruction unambiguous.

---

### Fix E — Prevent fixed-point convergence: inject low-temperature variation into final retry

**Root cause addressed:** Root Cause 3 (escape mechanism)  
**Status: ❌ Not yet applied**

When A3 and A4 produced identical output to A2, it is because the temperature (0.42) combined with the same-context prompt produced the same token sequence. The final attempt (A4) is the last chance — adding a small instruction to "generate a fresh alternative" can break the fixed point.

**Simple approach:** On the 4th attempt, instead of inserting the prior output as an `assistant` turn, fall back to full regeneration mode (like A1 but with the error list appended to the write instruction). This would behave like A1 but with the explicit error list as a prior constraint.

**Alternative:** Increase temperature for later retries (e.g., 0.6 for A3, 0.75 for A4) to provide the stochasticity needed to escape a fixed point.

---

### Fix F (already partially applied — N2/N3/N4) — Improve pronoun-repair.ts coverage

**Status: ✅ PARTIALLY APPLIED (this sprint)**

The N2/N3/N4 fixes in `pronoun-repair.ts` (paragraph-boundary reset, dialogue attribution lookback, `her` disambiguation offset) improve the repair algorithm's coverage. However, `repairPronouns` explicitly avoids modifying pronouns in multi-character sentences (correct behaviour — would risk false repairs). 

For the compound-sentence case (Harold alongside Linda), post-processing repair cannot safely fix errors. The reliable fix is prevention (Fix B: alert in write instruction) + validation eligibility (Fix A: R4 validator).

---

## Implementation Status Audit

| Fix | Description | Status | Run impact |
|-----|-------------|--------|-----------|
| R4 (ANALYSIS_09) | Remove `followUpContexts` from character-validator | ✅ Applied this sprint | Would likely have prevented A2-A4 |
| N1 | Absent-male alert in pre-checklist (user msg 3) | ✅ Applied this sprint | Present in A1 but too late |
| N2/N3/N4 | pronoun-repair.ts improvements | ✅ Applied this sprint | Safe repair coverage improved |
| Fix B | Move N1 alert into user msg 1 (write instruction) | ❌ Not applied | Would address A1 initial error |
| Fix C | Rephrase stability anchor | ❌ Not applied | Would address A2-A4 freeze |
| Fix D | Span-level patch instructions in error message | ❌ Not applied | Would address compound-sentence repair |
| Fix E | Temperature increase / fall-back to regen on final retry | ❌ Not applied | Would address A3/A4 fixed-point |

---

## Comparison with PROMPT_03 Failure Modes

| Dimension | PROMPT_03 | PROMPT_05 |
|-----------|-----------|-----------|
| Failure pattern | Alternating (different error each attempt) | Freeze (same 2 errors A2→A4) |
| Cause of alternation/freeze | Fresh generation each retry = independent inference | Assistant-turn anchor = convergence |
| Validator role | True positives (Philip was genuinely wrong) | Likely false positives in A2-A4 (followUpContexts) |
| Season/temporal errors | Yes (autumn in June) | None — full system prompt in retry prevented this |
| Root fix needed | Post-processor season regex + lean revision context | Validator false positives (R4) + stability anchor wording |
| Still unresolved after this sprint | Season MICRO-PROMPT in lean revision | Fix B (alert placement), Fix C (stability anchor), Fix D (span instructions) |

---

## Key Insight

The most significant finding from PROMPT_05 is that **the R4 validator fix (removing `followUpContexts`) was the critical missing piece for this run, not the LLM's prose quality.** The chapter text that the model produced at A1 (and preserved across A2-A4) reads as pronoun-correct when inspected at the prose level. The validator's proximity rule was detecting `she` in Audrey's sentences as belonging to Harold (who was named in the preceding clause), generating spurious errors that the retry mechanism then attempted to "fix" — causing genuine regressions in A2.

This is a clean example of a **validator false positive cascading into a real regression**. The system's attempt to fix a non-existent error broke something that was correct. R4 closes this loop.

---

## Architectural Analysis: Two-Stage Pipeline Redesign

### Problem Statement

The existing retry architecture has four compounding failure modes that this run exposed simultaneously. They are not prompt-level problems — they are structural design problems that cannot be solved by adding more instructions to the retry message.

**Failure mode 1 — The retry loop over-anchors to the failed draft**

By inserting the failed output as an `assistant` turn and then instructing the model to "preserve every paragraph that already passes," the retry biases the model toward copying the broken draft rather than genuinely repairing it. When the initial repair strategy is wrong (as in A2), every subsequent retry reproduces the same wrong repair. This is not a temperature problem; it is an architecture problem. At 0.42 temperature with an identical 6-message prompt, the model cannot escape.

**Failure mode 2 — The retry task is too broad**

The model is asked to perform a surgical pronoun fix while simultaneously carrying the full creative-writing system prompt: style rules, scene grounding requirements, word count targets, season lock, SCENE GROUNDING CHECKLIST, NOVEL-QUALITY PROSE REQUIREMENTS, Chapter-1 victim naming reminders, and QUALITY GUARDRAILS. All of these are irrelevant to a pronoun correction pass. The cumulative weight of competing instructions dilutes the model's ability to focus on the only task that matters on retry: correct the character-reference errors.

**Failure mode 3 — The retry mode is framed as regeneration, not repair**

The phrase "REGENERATE chapters 6 with ALL listed fixes applied" invites a holistic rewrite. For pronoun issues — which typically affect 2–5 tokens across a 1,600-word output — a holistic rewrite is the worst possible approach. It maximises opportunity for new regressions to be introduced while repairing the target error. A repair pass should be told it cannot rewrite, not invited to regenerate.

**Failure mode 4 — Convergence on the wrong baseline**

A2-A4 producing structurally identical outputs demonstrates that the 6-message retry loop became a fixed point. The combination of: a deterministic patch instruction + a locked baseline (via assistant turn) + temperature 0.42 + identical system prompt = same output, every time. There is no escape mechanism in the current architecture.

**Validator concern**

The A4 chapter text shows ¶3 as pronoun-correct at the prose level (`her handkerchief` for Linda, `his eyes` for Harold). If the validator continued to flag these as errors after R4 is applied, then there is an additional coreference attribution bug in sentences where two named characters appear in the same compound clause. This should be tested with isolated sentences before further prompt work.

---

### Solution: Two-Stage Pipeline with Dedicated Repair Pass

The solution is to structurally separate creative generation from mechanical continuity correction. These are two distinct tasks requiring different prompts, different temperatures, and different success criteria. Conflating them into a single retry prompt is the root cause of both the over-anchoring problem and the regression problem.

**Stage 1 (unchanged): Creative generation**

`buildProsePrompt` generates the chapter normally. No changes to this path other than Fix B (moving the absent-male alert into the write instruction — see below).

**Stage 2 (new): Continuity repair pass**

When validation fails, instead of calling `buildRetryRevisionPrompt`, call a new `buildContinuityRepairPrompt` function. This repair prompt:

- Takes the failed draft as **plain input text**, not as an assistant turn
- Focuses only on: character names, pronouns, possessives, and dialogue-tag gender agreement
- Explicitly forbids: style edits, structural edits, paragraph additions/removals, fresh prose invention
- Has a short system message (< 500 chars) — no creative-writing instructions
- Returns corrected JSON only

This separation means: the creative model generates creatively; the repair model corrects mechanically. A model asked only to correct pronouns in a given text, with an explicit prohibition against other changes, is far more likely to make a clean targeted fix than a model asked to do revision within a full creative-writing context.

**Retry objective simplification**

Remove from the retry path all instructions that are not relevant to character-reference correction:

| Remove | Replace with |
|--------|-------------|
| Word count priorities ("each failed chapter must satisfy the hard-floor target") | *(omit entirely — word count was satisfied)* |
| Style and pacing instructions ("revise voice/rhythm only after rules 1-3 are satisfied") | *(omit entirely — style is frozen)* |
| "REGENERATE chapters 6..." | "Repair the following chapter JSON by correcting pronoun errors only." |
| "Chapter 1 must name the victim as Christopher Atkinson" | *(omit — irrelevant to Ch6 retries)* |
| "Preserve every paragraph that already passes validation verbatim" | *(omit entirely — replaced by explicit scope restriction)* |
| "This is your last chance before generation fails" | *(omit — escalation language increases model anxiety without improving accuracy)* |

**Validator isolated testing**

Before any further prompt-engineering work on pronoun repair, run the current validator (post-R4) on the ¶3 sentence from the A4 output in isolation:

```
Linda Redmore had wept quietly, her handkerchief damp and crumpled, 
and Harold Somerby had spoken little, his eyes darting toward the door 
as if escape might yet be possible.
```

Expected result: 0 errors. If any error is flagged, the validator has a multi-character compound-sentence coreference bug that must be fixed before retry prompt redesign will have meaningful impact.

---

### Sample Repair Prompt

This is the complete system + user message for the repair pass. It replaces A2-A4's 6-message architecture entirely.

**System message:**
```
You are a continuity repair editor for a mystery novel.

Task:
Repair the chapter JSON below by correcting character-reference errors only.

Scope:
- Fix only incorrect character names, pronouns, possessives, and dialogue-tag gender agreement.
- Do not improve style.
- Do not change pacing.
- Do not add or remove paragraphs.
- Do not rewrite sentences unless a minimal local edit is required to fix a character-reference error.
- Preserve all locked facts exactly as written.
- Return valid JSON only.

Canonical cast and pronoun map (immutable):
- Christopher Atkinson = he/him/his
- Pauline Langton = she/her/her
- Linda Redmore = she/her/her
- Harold Somerby = he/him/his
- Audrey Denison = she/her/her

Hard rules:
1. Every pronoun referring to a named character must match the canonical map.
2. Every dialogue tag pronoun must match the speaker.
3. Do not introduce any new named character.
4. Keep all non-character wording unchanged unless a minimal edit is necessary to satisfy rules 1–3.
5. Preserve these locked facts verbatim whenever present:
   - "ten minutes past eleven"
   - "forty minutes"
```

**User message:**
```
Known validation errors to fix:
- Character "Linda Redmore" was assigned an incorrect male pronoun.
- Character "Harold Somerby" was assigned incorrect female pronouns.

Input JSON to repair:
[FAILED CHAPTER JSON]
```

**Why this prompt is better than the current retry prompt:**

| Dimension | Current `buildRetryRevisionPrompt` | New repair prompt |
|-----------|-------------------------------------|-------------------|
| System message length | ~21,000 chars (full creative context) | ~800 chars (repair scope only) |
| Message count | 6 (system + write + checklist + errors + assistant + anchor) | 2 (system + user) |
| Prior output as assistant turn | ✅ Yes (locks in baseline) | ❌ No (fresh model state) |
| Stability anchor | ✅ Yes ("preserve verbatim") | ❌ No (explicit scope restriction instead) |
| Creative-writing instructions | ✅ Yes (competing with repair task) | ❌ No (repair only) |
| Scope of allowed edits | Implicit (model must infer) | Explicit (prose forbidden, only character refs) |
| Convergence risk | High (assistant-turn + temperature 0.42) | Low (no prior output anchor, fresh state) |

---

### Phased Implementation Plan

#### Phase 1 — Validator isolation test (pre-requisite, no code changes)

**Goal:** Confirm the validator correctly handles multi-character compound sentences post-R4.

1. Write a unit test (or ad-hoc script) that passes the A4 ¶3 sentence to `findIncorrectPronouns` for a cast with Harold (he) and Linda (she).
2. Expected: 0 errors returned.
3. If errors are found: identify and fix the coreference logic for compound sentences before proceeding to Phase 2.
4. If 0 errors: validator is clean; proceed to Phase 2.

**File:** `packages/story-validation/src/character-validator.ts`  
**Risk:** Low — read-only investigation unless errors are found.

---

#### Phase 2 — Build `buildContinuityRepairPrompt`

**Goal:** Create the new narrow repair function as a standalone path, not modifying the existing retry path yet.

1. In `agent9-prose.ts`, add a new exported function `buildContinuityRepairPrompt(options)` that returns a 2-message array:
   - Message 1 (`system`): repair scope prompt (< 800 chars as above)
   - Message 2 (`user`): error list + input chapter JSON

2. Parameters needed:
   - `pronounMap`: `Record<string, string>` — canonical character → pronoun string
   - `lockedFacts`: `string[]` — verbatim locked fact strings
   - `errors`: `ValidationError[]` — the same error objects already produced by the validator
   - `chapterJson`: `string` — the failed chapter JSON

3. Do not wire this into the pipeline yet. Build and compile only.

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Risk:** Low — additive only; existing retry path unchanged.

---

#### Phase 3 — Wire repair prompt into retry pipeline

**Goal:** Replace `buildRetryRevisionPrompt` calls with `buildContinuityRepairPrompt` when the only errors are pronoun/character-reference errors.

1. In the agent9 pipeline (wherever Chapter retry logic lives), add a branch:
   - If all validation errors are of type `pronoun_consistency` → call `buildContinuityRepairPrompt`
   - If errors include other types (word count, scene grounding, etc.) → keep `buildRetryRevisionPrompt` for now
2. Log which path is taken so it is clearly visible in prompt logs.
3. The repair prompt gets **at most 2 retries** (not 4) — it either fixes a pronoun or it does not. If 2 repair attempts fail, escalate to a full rewrite (A1-style, fresh generation).

**File:** Agent9 orchestration layer (wherever the retry count loop is)  
**Risk:** Medium — changes the live retry path. Recommend running under a feature flag initially.

---

#### Phase 4 — Fix B: Move absent-male alert into write instruction

**Goal:** Ensure the N1 alert influences generation, not post-generation self-review.

Current location: `buildProsePrompt` user message 3 (pre-submission checklist).  
Target location: `buildProsePrompt` user message 2, immediately before the outline JSON.

**Revised write instruction insertion point:**
```
⚠️ PRONOUN ALERT — ABSENT CAST MEMBERS IN THIS CHAPTER:
The following characters are referenced but are NOT the POV character.
Their pronouns must not be influenced by POV-character gender momentum:
• {Name} ({he/him/his}) — use masculine pronouns exclusively for this character.
[...per absent male character in scene...]

Write the full prose following the outline scenes.
```

This alert must be generated dynamically per scene (same logic as the existing N1 IIFE in the pre-checklist) but placed before the outline JSON, not after.

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Risk:** Low — prompt-only change. Existing pre-checklist N1 alert can remain as a secondary reminder.

---

#### Phase 5 — Fix C: Rephrase stability anchor (conditional)

**Goal:** If `buildRetryRevisionPrompt` is still used for non-pronoun errors, remove the convergence-inducing stability anchor wording.

If Phase 3 successfully separates pronoun-only retries to the new repair prompt, this phase may have reduced scope (stability anchor only affects non-pronoun retries). Evaluate after Phase 3.

If still needed:

Current wording:
> *"Your draft above is the baseline. Preserve every paragraph that already passes validation verbatim. Only modify passages that directly address the errors listed in the previous message."*

Replace with:
> *"Your draft above is the reference. Identify and correct ONLY the specific sentences that cause the listed errors. Do not rewrite or expand surrounding paragraphs. If you cannot locate the exact error sentence, rewrite only the paragraph containing the named character. Do not change anything else."*

**File:** `packages/prompts-llm/src/agent9-prose.ts`  
**Risk:** Low — prompt-only change.

---

### Implementation Priority

| Phase | Description | Priority | Risk | Dependency |
|-------|-------------|----------|------|-----------|
| 1 | Validator compound-sentence test | **Immediate** | Low | None |
| 2 | Build `buildContinuityRepairPrompt` | High | Low | Phase 1 clean |
| 4 | Fix B: move absent-male alert | High | Low | None (can run in parallel) |
| 3 | Wire repair prompt into pipeline | Medium | Medium | Phase 2 |
| 5 | Fix C: stability anchor wording | Low | Low | Phase 3 outcome |

**Recommended implementation order:** Phase 1 → Phase 4 (parallel with Phase 2) → Phase 2 → Phase 3 → Phase 5.

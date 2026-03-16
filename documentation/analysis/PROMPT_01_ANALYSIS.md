# PROMPT_01_ANALYSIS.md
## Per-Attempt Prompt Analysis — run_9f50b70b, 2026-03-15
### "The Clockwork Conundrum" | Chapter 1 | Agent9-ProseGenerator-Ch1

Source data: `PROMPT_01.txt` (4 attempts, hashes bbc137d0f41bad3c → 161e88fa528d869c → 631b34c002e32ad5 → 0f0080d61b81fa6c)

---

## ATTEMPT 1 — bbc137d0f41bad3c — Initial Generation

### What the prompt did

Route: `buildProsePrompt` (full). Two messages: a large system prompt carrying the full CML snapshot, character profiles, quality guardrails, pronoun map (stated three separate times), locked facts, and prose requirements; a user message with the scene outline JSON.

### Errors produced

1. **Helen Jevons: incorrect pronoun `his`** — should be `she/her/her`
2. **Anonymous victim** — prose described "the body of an unknown victim" despite the cast list naming Alastair Langton as the victim

### Prompt weaknesses

**Weakness 1 — Pronoun map present but no dialogue-tag rule**
The system prompt states the pronoun map three times (`CRITICAL CHARACTER CONSISTENCY RULES`, `NARRATIVE STATE`, `IMMUTABLE PRONOUN MAP`). However, none of these locations explains *dialogue attribution* — i.e. that the pronoun in `"DIALOGUE," she said` must match the *speaker*, not any character named *inside* the quoted speech. The LLM wrote `"'What happened here, Stephen?' he asked"` for Helen, treating `he` as correct because Stephen (male) appears in the quoted dialogue. The pronoun map as written gives no signal that this is wrong.

**Weakness 2 — Scene outline summary contradicts the victim rule**
The scene outline field `summary` (passed verbatim in the user message) reads: *"Guests rush to the library to find Stephen Norwood standing over the lifeless body of an unknown victim."* This directly seeds the anonymous-victim failure. The system prompt says to name the victim; the user message says "an unknown victim". The LLM resolved the contradiction in favour of the user message, which is more local and specific.

**Weakness 3 — Pronoun map is buried inside a token-heavy system prompt**
The pronoun map appears after thousands of tokens of CML snapshot, quality guardrails, era authenticity rules, and physical plausibility rules. By the time the model processes the pronoun map, the attention window is under pressure. Repeating the map helps but does not substitute for having it at the *top* of the system message or last before the task instruction (most-memorable positions).

**Weakness 4 — No explicit victim-naming directive tied to the outline**
The victim-naming rule appears inside `CHAPTER 1 VICTIM-NAMING RULE (NON-NEGOTIABLE)` in the system prompt but the outline user message still contains the anonymous framing. There is no field-level override that says "replace the word 'unknown victim' in the outline summary with the victim's actual name when surfacing it to the model."

**Weakness 5 — No pre-write checklist instruction**
The model is given ≥8 quality requirement sections but no instruction to perform a mechanical self-check before finalising (e.g. "Before you submit: confirm every dialogue tag pronoun matches the speaker's gender, confirm the victim is named by their full name in paragraph 1 or 2").

### How to improve this prompt

| # | Change | Why |
|---|--------|-----|
| 1 | Add a **DIALOGUE TAG RULE** immediately after the pronoun map: *"In `'DIALOGUE,' he/she said` constructions, the pronoun matches the SPEAKER's gender, not any character named inside the quoted speech."* | Directly prevents the dialogue-attribution failure mode |
| 2 | **Sanitise the outline summary** before passing it to the model — replace references to "unknown victim" with the victim's actual name at the code level | Removes the contradictory instruction at source |
| 3 | Move the pronoun map to the **last section of the system message**, immediately before the schema definition | Highest recency weight; model is less likely to drift |
| 4 | Add a **PRE-SUBMIT CHECKLIST** as the final user message line: *"Before returning JSON: (a) every dialogue-tag pronoun matches the speaker, (b) victim named as Alastair Langton in Chapter 1, (c) no season term contradicts the stated month."* | Mechanical final gate forces model to re-examine common failure modes |

### What to carry forward to Attempt 2

| Signal | Why it matters |
|--------|----------------|
| `Helen Jevons: incorrect pronoun found 'his'` — explicit character + wrong token | Tells the retry exactly which character and which pronoun token to hunt |
| `Anonymous victim: 'body of an unknown person'` | Tells the retry to add Alastair Langton's name to paragraph 1–2 and remove the anonymous framing |
| The **produced prose** from Attempt 1 (as context) | Gives the retry its working material so it can surgically correct rather than regenerate from scratch |
| The **clue marker** `[[CLUE_ID:clue_3]]` was successfully placed — preserve it | The retry must not remove this on surgical revision |

---

## ATTEMPT 2 — 161e88fa528d869c — Lean Revision (buildLeanRevisionMessages)

### What this attempt inherited

Attempt 1 produced: Helen pronoun `his`, anonymous victim. The pipeline took the lean-revision route and sent:
- **System**: lean CHARACTER MAP + word targets
- **User**: structured error feedback (2 errors clearly stated, pronoun map, victim-naming solution)
- **Assistant**: the full Attempt 1 prose JSON (murder-discovery scene verbatim)
- **User**: surgical fix instructions

### Error produced

**CONTENT FILTER** — Azure content management policy blocked the response.

The pipeline had no prior error state, so `lastBatchErrors` was `["[object Object]"]` (from an earlier exception that was never caught properly). `suppressRevision` was not set, so the lean-revision path was entered freely. The assistant-role message contained the murder-discovery prose from Attempt 1, which included: *"the lifeless body of an unknown victim sprawled on the floor"*, *"the crimson stain that spread from the wound"*. This violence density triggered the content filter.

### Prompt weaknesses

**Weakness 1 — Prior murder-discovery prose in the conversation window**
The assistant-role message is the Attempt 1 Chapter 1 output, which is a body-discovery scene. Azure content filter evaluates all messages in the conversation regardless of role. Placing murder-scene prose in `assistant` role was Phase 3's mitigation, but it is insufficient when the prose itself is graphically violent (blood, body, crime scene). The filter scores the window holistically; the role assignment does not reduce the violence score.

**Weakness 2 — Lean system message gives the model no scene context to regenerate**
The system prompt is only 6 lines: CHARACTER MAP + word targets. If the content filter were not present, the model would be asked to surgically revise prose it can see in the conversation, which is fine — but if it cannot see the prose (filter blocks the call before output), there is no fallback context to regenerate from. No scene outline, no purpose, no setting anchors.

**Weakness 3 — No content-filter pre-screening of the assembled conversation**
The pipeline has no step that estimates violence/harm density of the conversation before sending it. If it detected that the assembled messages contained body-discovery prose above a threshold, it could strip that content and substitute a scene-summary anchor instead.

**Weakness 4 — Error state entering this attempt was corrupt**
`lastBatchErrors` held `["[object Object]"]` due to Bug #1 (non-Error exception not properly stringified). This meant the feedback section for attempt 2 was built on a poisoned error list. Even a successful response here would have been working from the wrong error signal.

### How to improve this attempt

| # | Change | Why |
|---|--------|-----|
| 1 | **Never include prior prose in the conversation window** for Ch1 body-discovery scenes — replace with a compact scene anchor: chapter title, setting, 1-sentence purpose, required clue IDs | Removes the violence-density trigger entirely |
| 2 | **Fix Bug #1 first**: extract error messages robustly (check `e.message`, `e.error.message`, `JSON.stringify(e)` before `String(e)`) so `lastBatchErrors` is never `["[object Object]"]` | Ensures downstream feedback is built on real error text |
| 3 | **Set `suppressRevision = true` on any content-filter hit** from a lean-revision attempt, and **clear the prior prose from `lastFailedBatchChapters`** — don't carry poison prose into subsequent attempts | Breaks the cycle of re-submitting the triggering material |
| 4 | Include a **scene context block** in the lean system message (scene summary, location, purpose, required clues) so the model can regenerate without needing to see prior prose | Makes the lean path viable even without prior prose in context |

### What to carry forward to Attempt 3

| Signal | Why it matters |
|--------|----------------|
| `suppressRevision = true` | Attempt 3 must NOT use the lean-revision path again with prior prose |
| Original error list: Helen pronoun `his`, anonymous victim | These were never fixed — Attempt 3 must treat them as live errors |
| **No prior prose** | Since the filter fired, there is no valid prose to pass forward. Attempt 3 must regenerate from the full prompt, not revise |
| `lastFailedBatchChapters = null` | Correct: there is no trusted prose base. Attempt 3 must treat this as a fresh generation |

---

## ATTEMPT 3 — 631b34c002e32ad5 — Full buildProsePrompt (suppressRevision active)

### What this attempt inherited

Attempt 2 was content-filtered. `suppressRevision = true`. `lastBatchErrors = ["[object Object]"]` (Bug #1 — the real errors from Attempt 1 were lost when the exception was swallowed). Attempt 3 took the full `buildProsePrompt` path, appending a feedback user message.

Three messages:
- **System**: full CML + pronoun map (×3) + quality rules
- **User**: scene outline (still contains "unknown victim" in summary)
- **User**: retry feedback — *"⚠️ CRITICAL: Attempt 3/4 had 1 validation error(s) — OTHER ERRORS (1): • [object Object]"*

### Errors produced

1. **Helen Jevons: incorrect pronouns `he`, `him`, `his`** — dialogue attribution failure
2. **Month/season contradiction: december vs spring**

### Prompt weaknesses

**Weakness 1 — Feedback message is completely unreadable**
The retry feedback user message shows `• [object Object]` as the sole error. This is Bug #1 in action: the real error from Attempt 1 (`Helen Jevons: incorrect pronoun 'his'`) was replaced by the string `"[object Object]"` when the pipeline's exception handler called `String(e)` on a plain JS object. The model received a valid-looking feedback structure but with zero actionable content in the error body.

**Weakness 2 — MANDATORY FIX ORDER lists pronouns (rule 3) but the error section gives no pronoun error**
The system feedback block says "fix pronoun map" as rule 3 of MANDATORY FIX ORDER, but this is boilerplate — it is always shown regardless of whether a pronoun error actually occurred. Because the error section (`OTHER ERRORS`) is empty/unreadable, the model has no signal that pronouns are the *actual* problem. The boilerplate is not alarming enough on its own to override the model's tendency to mirror its last generation.

**Weakness 3 — Outline summary still seeds "unknown victim"**
The user outline message still contains `"summary": "...lifeless body of an unknown victim..."`. Even after two attempts that produced valid victim naming, this text is still present. On a fresh regeneration with suppressRevision active, the model is reading the raw outline again, and the anonymous framing is still in it.

**Weakness 4 — Dialogue-tag rule still absent**
The pronoun map is restated (×3) but the dialogue-attribution DIALOGUE TAG RULE is still not present. The model generates `"'What happened here, Stephen?' he asked"` for Helen — exactly the same failure mode as Attempt 1, because the same missing instruction leads to the same failure.

**Weakness 5 — Season/month contradiction has no prior-attempt history**
The december/spring contradiction is a new error — not seen in Attempt 1 or 2's validation. It appears to have been introduced by the model in this regeneration, probably because the outline scene summary says "Midnight" which the model associated with winter, while another part of the prose used spring-adjacent atmospheric language. There is no month-lock instruction in the outline or feedback.

**Weakness 6 — No model self-check instruction on dialogue attribution**
The `TEMPORAL CONSISTENCY` rule in the system prompt covers month/season. The `IMMUTABLE PRONOUN MAP` covers pronoun assignment. But there is no instruction that says "scan every sentence containing dialogue for the pattern `'...?' he/she said` and verify the pronoun matches the speaker identity." The model cannot be expected to catch this without explicit instruction.

### How to improve this attempt

| # | Change | Why |
|---|--------|-----|
| 1 | **Fix Bug #1** (errorMsg extraction) so that `[object Object]` can never appear in feedback | Makes the feedback readable; the model would have received the real pronoun error |
| 2 | **Add DIALOGUE TAG RULE** to the pronoun map section (all three occurrences) | Directly targets the dialogue-attribution failure mode |
| 3 | **Sanitise outline summary** before passing — strip "unknown victim" phrasing at code level | Removes contradictory seed text |
| 4 | **Add a month-lock** to the feedback when a month is established: *"Month anchor: December. All seasonal references must be winter-compatible. Replace any spring/summer/autumn language."* | Prevents the december/spring contradiction |
| 5 | **Add PRE-SUBMIT CHECKLIST** as final user message line | Gives model a mechanical final-check prompt for common failure modes |
| 6 | When `lastBatchErrors` is `["[object Object]"]`, **preserve the previous known errors** rather than using the poisoned list | Means the real errors (Helen pronoun, anon victim) survive into attempt 3's feedback |

### What to carry forward to Attempt 4

| Signal | Why it matters |
|--------|----------------|
| `Helen Jevons: incorrect pronouns — he, him, his found` | Explicit character name + specific wrong tokens |
| `december vs spring contradiction` | Specific temporal error — which month and which conflicting season |
| The **produced prose** from Attempt 3 — BUT with a filter risk warning | The prose has wrong pronouns and a season error but is otherwise valid and structured. Attempt 4 needs it as a revision base — risk is that it will trigger the content filter if passed in full |
| The specific **offending sentences** rather than the whole prose | Passing only the 2-3 sentences containing errors, rather than the full chapter, would substantially reduce violence density in the conversation window |
| `clue_3 marker confirmed present` — do not remove | Surgical revision must not strip the `[[CLUE_ID:clue_3]]` marker |

---

## ATTEMPT 4 — 0f0080d61b81fa6c — Lean Revision (buildLeanRevisionMessages)

### What this attempt inherited

Attempt 3 produced: Helen pronoun `he/him/his`, december/spring contradiction. The pipeline now had real errors in `lastBatchErrors` (2 structured validation strings) and the Attempt 3 prose in `lastFailedBatchChapters`. It took the lean-revision path. Four messages:

- **System**: lean CHARACTER MAP + word targets
- **User**: error feedback — 2 errors clearly listed (pronoun, temporal) with correct micro-prompts
- **Assistant**: full Attempt 3 prose JSON — murder-discovery scene verbatim (*"the lifeless body of Alastair Langton"*, *"motionless on the floor"*, *"loomed over"*, *"crimson stain"*)
- **User**: surgical fix instructions

### Error produced

**CONTENT FILTER** — Attempt 4 failed. Generation exhausted (4/4 attempts). Story failed.

### Prompt weaknesses

**Weakness 1 — Prior prose in the conversation window again**
The assistant-role message is the full Attempt 3 Chapter 1 output, which is the same murder-discovery scene prose that caused Attempt 2 to be filtered. The Phase 3 mitigation (moving prose to `assistant` role) was re-applied but had already failed in Attempt 2 for the same scene. The pipeline did not account for the fact that a content-filter hit in Attempt 2 on similar content was predictive of another hit in Attempt 4 on nearly identical content.

**Weakness 2 — The lean system message has no fiction framing beyond one line**
The system message says: *"CONTEXT: You are editing chapters of a mystery fiction manuscript in the tradition of Agatha Christie and Arthur Conan Doyle."* Compared to the full system prompt (which opens with a 3-paragraph fiction-framing context and 4 explicit references to "fictional narrative", "genre elements", "no real people"), the lean system message gives the content classifier much less fiction-framing signal to offset the violence content in the assistant message.

**Weakness 3 — Error feedback is good but arrives too late in conversation position**
The error feedback (message 2, user role) correctly lists both errors with micro-prompts. However, it appears *before* the murder-scene prose (message 3, assistant role). The filter scores the conversation holistically; the fiction framing in message 1 is thin, and the prose in message 3 is graphically violent. The filter fires before the model produces any output, so the quality of messages 2 and 4 is irrelevant — the assembled conversation itself is the problem.

**Weakness 4 — suppressRevision flag should have prevented this path**
`suppressRevision` was set to `true` after Attempt 2's content-filter hit. However, Attempt 3 set `lastFailedBatchChapters` (because it produced prose). The code logic re-enabled the lean-revision path because `lastFailedBatchChapters` was non-null and `suppressRevision` was not re-checked at the lean-revision branch entry point after new prose was generated. Attempt 4 should have remained on the full `buildProsePrompt` path with Attempt 3's errors in the feedback, not the lean-revision path with prose in the window.

**Weakness 5 — No filtering of the prior prose to remove violence density**
Even if the lean-revision path is correct, there is no step that removes or summarises the most violent passages before inserting the prose into the conversation. The murder-scene paragraphs ("lifeless body", "crimson stain", "motionless on the floor", "loomed over") are the smallest subset causing the filter hit. If only the 2 offending sentences (Helen's dialogue line, the spring atmospheric passage) were passed instead of all 6 paragraphs, the violence density would be much lower.

**Weakness 6 — Final attempt with no escalation strategy**
Attempt 4 is attempt 4/4. If it fails, the story fails. Yet the prompt is structurally identical to Attempt 2 which already failed with a content-filter hit on the same scene. There is no escalation strategy: no attempt to strip the violence-dense prose, no fallback to scene-anchor regeneration, no attempt to increase fiction framing density in the lean system message.

### How to improve this attempt

| # | Change | Why |
|---|--------|-----|
| 1 | **Do not include prior prose** from a chapter that previously caused a content-filter hit — ever | Directly removes the trigger material |
| 2 | **Replace the prior prose** with a compact scene anchor: title, setting, purpose, required clue IDs, a 2-sentence non-violent summary of what was previously correct | Gives model enough context to regenerate without the violence density |
| 3 | **Expand the lean system fiction framing** to match the density of the full system prompt's opening | Increases the fiction-context signal to offset genre content |
| 4 | **Re-check `suppressRevision`** logic: if a content-filter hit occurred on *any* prior attempt for this batch and the current scene is a body-discovery scene, force the full `buildProsePrompt` path regardless of whether `lastFailedBatchChapters` is set | Prevents re-entering the lean path with murder-scene prose |
| 5 | **On the final attempt**, escalate: strip all prose from the conversation, use a pure regeneration prompt with maximally expanded fiction framing and only the essential error list | Last-chance strategy; a failed content-policy call wastes the attempt entirely |
| 6 | **Pass only the offending sentences**, not the whole chapter, if any prior prose must be included | Minimises violence density while preserving editorial context |

### What carry-forward would have helped (retrospective)

Since this was the final attempt, "carry-forward" is retrospective — but if a 5th attempt were available:

| Signal | Action |
|--------|--------|
| Two content-filter hits on Ch1 body-discovery prose | Mark this scene as `contentFilterRisk: high`; force pure-regeneration path on all future retries |
| Helen pronoun error persists across attempts 1 and 3 | Elevate pronoun rule to first item in system message (not third in MANDATORY FIX ORDER); add explicit dialogue-attribution check |
| december/spring contradiction | Inject a temporal lock into the scene outline: add `"monthAnchor": "December"` field and inject into both system and user messages |
| `suppressRevision` state not propagated through Attempt 3 | Fix the state machine: a content-filter hit should permanently suppress lean-revision for the affected batch, regardless of subsequent successful generation |

---

## Cross-Attempt Summary

### Failure pattern map

| Attempt | Route | Root failure | Proximate cause |
|---------|-------|-------------|-----------------|
| 1 | Full generation | Dialogue-attribution pronoun error; anonymous victim in outline | Dialogue-tag rule absent; outline summary seeds wrong text |
| 2 | Lean revision + prior prose | Content filter | Murder-discovery prose in conversation window; corrupt error state (Bug #1) |
| 3 | Full generation + unreadable feedback | Pronoun + season errors | Feedback showed `[object Object]`; dialogue-tag rule still absent; outline still seeds anon victim |
| 4 | Lean revision + prior prose | Content filter | Same murder-scene prose re-introduced; `suppressRevision` logic bypassed by new `lastFailedBatchChapters` |

### Systemic weaknesses across all attempts

1. **Dialogue attribution rule is absent in all 4 prompts.** Every attempt that produced prose failed on Helen's pronoun in a dialogue tag. This is the single highest-ROI prompt change.

2. **The scene outline summary is never sanitised.** The field containing "lifeless body of an unknown victim" is passed verbatim in every full-generation attempt, providing a contradictory seed.

3. **The error extraction bug (Bug #1) poisoned Attempt 3's feedback completely.** A single un-caught exception at the start of the pipeline cascaded through 4 attempts. Robust error extraction is a precondition for any retry strategy.

4. **The lean-revision content-filter risk is not tracked across attempts.** The pipeline had all the information it needed after Attempt 2 to know that lean revision with Ch1 prose is unsafe. It re-entered that path in Attempt 4 anyway.

5. **The lean system message fiction framing is too thin.** Compared to the full system prompt (which dedicates 3 paragraphs to fiction context), the lean system has 1 line. This matters more when the conversation contains violent genre content.

### Highest-impact improvements (ranked)

| Rank | Change | Prevents |
|------|--------|---------|
| 1 | Add DIALOGUE TAG RULE to pronoun map in all prompt paths | Helen pronoun failures in attempts 1, 3 (and would have in 4) |
| 2 | Fix Bug #1 (errorMsg extraction) | Unreadable `[object Object]` feedback in attempt 3 |
| 3 | Sanitise outline summary — remove anonymous-victim seeding at code level | Anon victim error in attempt 1; the model reading contradictory instructions |
| 4 | Never include prior Ch1 murder-discovery prose in the conversation window | Content filter in attempts 2 and 4 |
| 5 | Permanently flag content-filter hits as lean-revision suppressors for the batch | Attempt 4 re-entering the unsafe path |
| 6 | Expand lean system fiction framing | Reduces filter risk on any lean-revision attempt |
| 7 | Add month-anchor lock to feedback when temporal error detected | December/spring contradiction in attempt 3 |
| 8 | Add PRE-SUBMIT CHECKLIST as final user message | Final mechanical check on common failure modes |

---

## SOLUTIONS: Phased Improvement Plan

### Code survey

Before designing solutions the following areas of `packages/prompts-llm/src/agent9-prose.ts` were reviewed:

| Area | Key findings |
|------|-------------|
| `sanitizeScenesCharacters()` (line 893) | Already strips phantom cast names from summary/title/purpose/dramaticElements. Does **not** replace "unknown victim" phrasing — it only calls `anonymizeUnknownTitledNames`, which targets `Title Surname` patterns, not generic noun phrases. |
| `buildProsePrompt()` system message (line 1348) | `VICTIM IDENTITY` rule is present: names the victim and forbids "unknown victim" / "body of a stranger". However the **user message** (line 1699) passes the raw outline JSON via `sanitizeScenesCharacters`, and the scene `summary` field still contains "body of an unknown victim" verbatim. System says one thing; user message seeds the opposite. |
| `buildPronounLockLines()` + `immutablePronounBlock` (line 1687) | Pronoun map stated ×3 in system. No dialogue-attribution rule was present before Phase 5 fix. Phase 5 added the DIALOGUE TAG RULE. Still missing: a **pre-submit self-check** instruction. |
| `deriveTemporalSeasonLock()` / `enforceMonthSeasonLockOnChapter()` (lines 669–720) | Post-generation deterministic season repair exists and runs after each LLM call. `temporalContextBlock` in the system prompt carries `Month-season lock` instructions. However this block is in the **dropped** section for Attempt 1 (PROMPT BUDGET SUMMARY: `dropped=[..., temporal_context]`). The temporal fix runs post-generation but only if the month appears in the text; it does not catch prose that uses no month name but uses incompatible seasonal language. |
| `buildLeanRevisionMessages()` (line 1796) | Already refactored (Phase 5): no prior prose in any role; carries scene context in system. Fiction framing still thin (2 sentences). |
| `buildEnhancedRetryFeedback()` (line 2411+) | Pronouns third in MANDATORY FIX ORDER. MICRO-PROMPT for pronouns added. DIALOGUE TAG RULE appended (Phase 5). Month-season lock directive present in `buildRetryMicroPromptDirectives`. |
| `suppressRevision` state machine (lines 3185–3813) | `suppressRevision = true` on content-filter hit. However: after Attempt 2 (content filter), Attempt 3 generates prose and sets `lastFailedBatchChapters`. For Attempt 4, `useRevisionRetry` re-evaluates from scratch: `attempt > 1 && !suppressRevision && lastBatchErrors.length > 0 && lastFailedBatchChapters !== null`. Because `suppressRevision` was set in Attempt 2 it is still `true` entering Attempt 4 — so `useRevisionRetry` should be `false`. **The state machine is actually correct for Attempt 4.** The Attempt 4 prompt log shows the lean revision was used, which contradicts the code. This needs investigation — may be a sequence issue where `suppressRevision` was reset, or the prompt log's route label is misleading. |
| Error catch block (line 3771+) | Fixed in Phase 5 with multi-shape error extraction. |
| `buildContextSummary()` (line 720+) | Resolves victim name from cast and includes it in the user message header. But the outline JSON `scenes[].summary` field is passed raw and can still contain "unknown victim". |

### Solution space exploration

#### Option A — Patch the scene summary at the `sanitizeScenesCharacters` level

Replace any occurrence of `"unknown victim"`, `"body of a stranger"`, `"unidentified body"` etc. in scene summary/purpose fields with the victim's actual name. This is deterministic, cheap, and cannot be overridden by the LLM.

**Pros:** Fixes the root cause at data-preparation time. Works for all prompt paths (full and lean). Zero LLM token cost.  
**Cons:** Requires knowing the victim name at sanitization time (currently `sanitizeScenesCharacters` does not take a victim name param). Regex matching on natural language is fragile if the outline LLM uses novel phrasing. Doesn't address the underlying cause: the outline LLM should not write anonymous victim phrasing in the first place.

#### Option B — Add a victim-name injection step after `sanitizeScenesCharacters`

After sanitization, if the scene is a discovery/chapter-1 scene and the summary contains no victim name, inject a sentence: `"The victim is {victimName}."` prepended to the summary.

**Pros:** Additive rather than substitutional — preserves the original outline text while adding missing information. Simpler regex surface (just check: does the string contain the victim name?).  
**Cons:** Can result in awkward concatenated summaries. Doesn't remove the anonymous framing.

#### Option C — Rewrite anonymous-victim phrases deterministically in the summary

Use the existing `resolveVictimName()` function (already available in scope) and extend `sanitizeScenesCharacters` to accept `victimName`. Replace `"an unknown victim"`, `"unknown person"`, `"stranger"`, `"unidentified"` in summary/purpose fields with the victim's name where a victim role is established.

**Pros:** Clean, targeted, uses existing infrastructure. Removes the contradiction at source.  
**Cons:** Still regex on natural language; may miss unusual phrasings by the outline LLM.

#### Option D — Outline LLM prompt fix (upstream source)

Fix the outline generation prompt to forbid "unknown victim" phrasing when the victim is named in the CML. This is the cleanest root-cause fix.

**Pros:** Stops the problem from entering the pipeline. Reduces downstream patch complexity.  
**Cons:** Different agent, different file (`agent8` or equivalent), longer feedback loop. Does not retroactively fix existing stored outlines.

#### Option E — Pre-submit model self-check message

Add a final user message to all prompt paths (full and lean): a short numbered checklist the model must verify before returning JSON.

**Pros:** The model can catch failures the deterministic layer misses (e.g. novel seasonal phrasing, dialogue attribution in complex sentences). Zero code complexity.  
**Cons:** Adds tokens. The model may comply superficially without actually re-reading. Not a hard gate — just instruction.

#### Option F — Post-generation deterministic attribution scan (pronoun repair extension)

Extend `repairChapterPronouns` in `packages/story-validation/src/pronoun-repair.ts` with a dialogue-attribution pass: match the pattern `"[^"]*", (he|she|they) (said|asked|murmured|replied|whispered|continued|cried|called)` and verify the pronoun matches the last named female/male character *before* the opening quote.

**Pros:** Deterministic backstop. Does not rely on LLM compliance. Catches failures that survive the prompt fix.  
**Cons:** The "last named character before the quote" heuristic fails for long paragraphs with many named characters. Requires careful implementation and test coverage.

#### Option G — Content-filter risk scoring per scene

Before assembling any retry prompt, compute a `contentFilterRisk` score for the scene based on scene number, act, scene purpose keywords ("discovery", "body", "murder", "death"), and known safe/unsafe history for this batch. If risk is `high`, always use the no-prose regeneration path and never include prior prose.

**Pros:** Prevents the content-filter–suppress–re-enter cycle structurally. Does not rely on catching the filter after it fires.  
**Cons:** Heuristic scoring may have false positives (avoid lean revision on scenes that would actually be fine). Adds complexity to the routing logic.

#### Option H — Permanently suppress lean revision after any content-filter hit, regardless of subsequent prose state

Currently `suppressRevision` is set on filter hit but `useRevisionRetry` re-evaluates all conditions freshly each iteration. If `lastFailedBatchChapters` becomes non-null after a later successful generation, the flag still gates the path correctly — but the risk is that state interactions and future code changes could re-enable it. Making `suppressRevision` a one-way latch that can never be reset within a batch removes this fragility.

**Pros:** Simple state-machine fix. Eliminates the risk of re-entering lean revision with murder-scene prose.  
**Cons:** May be over-aggressive if a different chapter batch in the same run would be fine with lean revision (but `suppressRevision` is already per-batch, so this is not a concern).

---

### Recommended phased approach

The solutions above are not mutually exclusive. The phases below sequence them by impact, risk, and implementation effort, from lowest-risk/highest-impact to higher-complexity improvements.

---

#### Phase A — Data-layer fixes (no LLM changes, no prompt token cost)

**Goal:** Remove contradictory data from the outline before it reaches any prompt.

**A1 — Extend `sanitizeScenesCharacters` to replace anonymous-victim phrasing (Option C)**

Add `victimName?: string` parameter. For every scene summary and purpose field, if the text contains any of `["unknown victim", "body of a stranger", "body of an unknown", "unidentified victim", "unidentified body"]`, replace the matched phrase with the victim's full name (or `"the victim"` as a fallback if no name is available). Call site in `buildProsePrompt` user message already passes `cast` — extend to pass `resolveVictimName(inputs.cast)`.

- File: `packages/prompts-llm/src/agent9-prose.ts`
- Function: `sanitizeScenesCharacters()`
- Call site: line 1699 (user message in `buildProsePrompt`)
- Risk: Low. Deterministic string replacement. Easy to unit test.

**A2 — Temporal context block budget protection**

The PROMPT BUDGET SUMMARY for Attempt 1 shows `dropped=[..., temporal_context]`. The temporal context block carries the month-season lock instruction (rule 8: "Month-season lock"). When this block is dropped the model has no explicit month-season anchor. The `temporalContextBlock` should be in the `fixed` allocation, not the `context` (droppable) allocation.

- File: `packages/prompts-llm/src/agent9-prose.ts`
- Function: `buildPromptContextBlocks()` or equivalent budget allocator
- Risk: Medium. Increases fixed token cost; may require reducing other blocks.

---

#### Phase B — State-machine hardening (no prompt changes)

**Goal:** Prevent the retry router from re-entering unsafe paths.

**B1 — Make `suppressRevision` a one-way latch (Option H)**

Once set to `true` for a batch, `suppressRevision` must never be reset. Add a comment and remove any code path that could reset it. Confirm `useRevisionRetry` correctly gates on `!suppressRevision` (it currently does — verify).

- File: `packages/prompts-llm/src/agent9-prose.ts`
- Location: `suppressRevision` declaration and catch block (~line 3185 and ~line 3797)
- Risk: Very low. One-line comment + read-through verification.

**B2 — Content-filter risk classification per scene (Option G, simplified)**

Add a lightweight function `isHighContentFilterRiskScene(scenes: SceneBatch): boolean`. Return `true` if any scene in the batch has `sceneNumber === 1` and `act === 1` and the scene purpose or summary contains any of `["discovery", "body", "murder", "dead", "victim"]`. If `true`, set `suppressRevision = true` preemptively at the start of the batch loop — before any attempt. This prevents even the first lean-revision try from including murder-scene prose.

- File: `packages/prompts-llm/src/agent9-prose.ts`
- Location: batch loop initialisation (~line 3185)
- Risk: Low. Conservative — only affects Act 1 Scene 1 type scenes.

---

#### Phase C — Prompt instruction hardening

**Goal:** Add missing instructions that directly caused failures in Attempts 1, 3, and 4.

**C1 — Pre-submit self-check message (Option E)**

In `buildProsePrompt`, append a final user-role message after the outline scene JSON:

```
BEFORE SUBMITTING: Run this checklist:
□ Every dialogue tag ('he said' / 'she asked') — pronoun matches SPEAKER, not addressee.
□ Chapter 1 names the victim as [victimName] in the first two paragraphs.
□ No season word (spring/summer/autumn/winter) contradicts the month [month] in any paragraph.
□ Every character name used appears in the cast list.
Return JSON only after completing this check.
```

This is parameterised: victim name and month are injected from `resolveVictimName()` and `deriveTemporalSeasonLock()`.

- File: `packages/prompts-llm/src/agent9-prose.ts`
- Function: `buildProsePrompt()` — add to message array after user outline message
- Risk: Low. Adds ~60 tokens. Must be `user` role for the model to treat it as an instruction to act on, not information to absorb.

**C2 — Lean system message fiction framing expansion**

The current lean system is 6 lines. Expand the fiction-framing opening to match the density of the full system (3–4 explicit genre-fiction signals, not 1). This improves Azure's scorer context even if prior prose is absent.

- File: `packages/prompts-llm/src/agent9-prose.ts`
- Function: `buildLeanRevisionMessages()` system block
- Risk: Very low. Adds ~40 tokens.

---

#### Phase D — Deterministic post-generation repair (no prompt changes)

**Goal:** Catch failures that survive all prompt instructions.

**D1 — Dialogue-attribution pronoun repair (Option F)**

Extend `repairChapterPronouns` in `packages/story-validation/src/pronoun-repair.ts` with a dialogue-attribution pass using the following algorithm:

1. Match all occurrences of `/"[^"]*",?\s+(he|she|they)\s+(said|asked|murmured|replied|whispered|continued|cried|called)/gi`
2. For each match, scan backwards in the paragraph text to the nearest named character (from cast) before the opening quote
3. If that character's canonical gender does not match the pronoun, replace the pronoun

This runs after the existing sentence-level repair. It is conservative: only acts on the exact dialogue-attribution pattern. Ambiguous cases (multiple named characters before the quote) are left unchanged.

- File: `packages/story-validation/src/pronoun-repair.ts`
- New function: `repairDialogueAttributionPronouns(text, castPronouns): string`
- Called from: `repairChapterPronouns` after existing sentence-level pass
- Risk: Medium. Requires careful test coverage including: addressee-inside-quote cases, multi-character paragraphs, action-beat tags (he said, getting up), nested quotes.

---

#### Phase E — Upstream outline prompt fix

**Goal:** Prevent anonymous-victim phrasing from being generated at all.

**E1 — Forbid anonymous-victim phrasing in outline generation prompt**

In whatever agent generates the narrative outline (Agent 8 or equivalent), add a rule: "If the victim's name is known from the CML, use it in scene summaries. Never write 'unknown victim', 'a stranger', or 'body of an unknown person'."

- File: TBD — outline generation prompt (not in `agent9-prose.ts`)
- Risk: Low. Text instruction only. Has no effect on existing stored outlines.

---

### Phase summary and sequencing

| Phase | Changes | Impact | Risk | Effort |
|-------|---------|--------|------|--------|
| A — Data layer | Sanitise anonymous-victim in scenes; protect temporal block budget | Prevents victim-naming error and season contradiction upstream | Low | Low |
| B — State machine | One-way `suppressRevision` latch; preemptive filter-risk classification | Prevents lean-revision re-entry with murder-scene prose | Very low | Low |
| C — Prompt instructions | Pre-submit checklist; lean system framing expansion | Gives model a final mechanical gate on common failure modes | Low | Low |
| D — Deterministic repair | Dialogue-attribution pronoun pass in `pronoun-repair.ts` | Catches pronoun failures that survive prompt changes | Medium | Medium |
| E — Upstream outline | Forbid anonymous-victim in outline prompt | Stops the problem at source | Low | Low |

**Recommended implementation order:** A → B → D → C → E

- Phases A and B are low-risk data-layer and state-machine fixes that eliminate the content-filter chain and anonymous-victim error.
- Phase D (dialogue-attribution repair) is promoted ahead of C because the Helen pronoun failure occurred 3 times despite full prompt instrumentation — a deterministic repair is more reliable than an additional instruction.
- Phases C and E add prompt-level improvements and upstream prevention.
- Phases A and B together would have prevented 3 of the 4 failures in the run. Phase D would have caught the Helen pronoun failure. Phase C's checklist adds a final soft gate.

**What would have prevented all 4 failures:**

| Failure | Prevented by |
|---------|-------------|
| Attempt 1: Helen pronoun (dialogue attribution) | Phase C1 (checklist) + Phase D1 (repair) |
| Attempt 1: Anonymous victim | Phase A1 (scene sanitisation) |
| Attempt 2: Content filter | Phase B2 (preemptive suppression for Act 1 Scene 1) |
| Attempt 3: Helen pronoun again | Phase C1 + D1 |
| Attempt 3: December/spring contradiction | Phase A2 (temporal block in fixed budget) + Phase C1 |
| Attempt 4: Content filter again | Phase B1 (one-way latch) + B2 (preemptive suppression) |

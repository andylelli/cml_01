# PROMPT_02_ANALYSIS.md
## Per-Attempt Prompt Analysis — run_71449e98, 2026-03-15
### "Time's Deception" | Chapter 5 | Agent9-ProseGenerator-Ch5

Source data: `PROMPT_02.md` (4 attempts, hashes 70a9534e → 179b78c1 → 55b4494d → 69b4091f)

---

## ATTEMPT 1 — 70a9534e — Initial Generation

### What the prompt did

Route: `buildProsePrompt` (full). Two messages: a large system prompt with the full CML snapshot, character profiles, quality guardrails, pronoun map, locked facts, SCENE GROUNDING CHECKLIST, and prose requirements; a user message with the scene outline JSON.

The scene outline specified:
- `"timeOfDay": "Later that afternoon"`
- `"atmosphere": "Whispers of a recent conflict fill the air."`
- `"location": "the hallway outside the dining room"`

The SCENE GROUNDING CHECKLIST in the system prompt stated:
> *"Chapter 5: anchor opening in 'the hallway outside the dining room'; include 2+ sensory cues and 1+ atmosphere marker before major dialogue."*

### Errors produced

1. **Chapter 5 opening block has weak atmosphere/time grounding** — validator rejected the opening as lacking at least one weather/time/atmosphere marker.

### Prompt weaknesses

**Weakness 1 — SCENE GROUNDING CHECKLIST instruction is ambiguous about what satisfies "atmosphere marker"**

The SCENE GROUNDING CHECKLIST says "include 2+ sensory cues and 1+ atmosphere marker". The model opened with *"Later that afternoon, the hallway outside the dining room at Hawthorne Hall was steeped in an uneasy silence..."* — this begins with a time-of-day reference (`"Later that afternoon"`) and a mood description (`"uneasy silence"`). The model appears to read this as satisfying the checklist. The validator, however, requires something more explicit: a named weather condition, a direct statement of light quality, or a concrete sensory atmospheric anchor (e.g. *"A grey January drizzle tapped against the tall windows"*). Neither the checklist wording nor the prose output instruction explain this distinction.

**Weakness 2 — The scene outline `atmosphere` field is not forcing weather into the prose**

The outline field `"atmosphere": "Whispers of a recent conflict fill the air."` is a mood description, not a meteorological or temporal anchor. The model faithfully described social tension rather than physical setting conditions. If the validator is checking for weather or light-quality language, then the `atmosphere` field needs to contain or reference it — or the system prompt needs to separately require "include one weather or lighting condition in the opening sentence."

**Weakness 3 — No weather/season data in the temporal_context block (dropped from prompt budget)**

The PROMPT BUDGET SUMMARY notes: `dropped=[humour_guide, craft_guide, location_profiles, temporal_context]`. The `temporal_context` block is the natural place to carry season, time of year, and weather defaults for the story. When it is dropped to fit the token budget, the model has no grounding data to write weather-specific prose — it can only fall back on generic phrases like "uneasy silence" or "later that afternoon".

**Weakness 4 — SCENE-SETTING example template reinforces the failure pattern**

The prose requirements include this example:
> *"Example structure: 'The `<MONTH>` `<TIME>` brought `<WEATHER>` to `<LOCATION>`.'"*

But this template appears after the SCENE GROUNDING CHECKLIST and is preceded by hundreds of tokens of other rules. The model's opening for Attempt 1 suggests it followed the checklist instruction loosely but did not apply the SCENE-SETTING template. Placing the template example inside the SCENE GROUNDING CHECKLIST section (immediately after the requirement) would tighten the connection.

### How to improve this prompt

| # | Change | Why |
|---|--------|-----|
| 1 | Replace the vague SCENE GROUNDING CHECKLIST instruction *"include 1+ atmosphere marker"* with *"include 1+ explicit weather or light condition (e.g. 'A pale winter dusk', 'Thin rain traced the window glass')"* | Removes the ambiguity between mood-atmosphere and physical-atmosphere |
| 2 | Add a mandatory `weather` or `lighting` sub-field to the scene outline `setting` object, populated from `temporal_context` at code level | Ensures the model always has an explicit physical anchor to work from, even when `temporal_context` is dropped due to budget |
| 3 | Move the SCENE-SETTING template example inside the SCENE GROUNDING CHECKLIST section | Model sees the template immediately after the requirement rather than hundreds of tokens later |
| 4 | Add `temporal_context` to the fixed-cost section of the prompt budget, or extract only the season/weather fields to a minimal block that cannot be dropped | The model cannot write grounded atmospheric openings without knowing what season, time, and weather the story exists in |

---

## ATTEMPT 2 — 179b78c1 — Lean Revision (buildLeanRevisionMessages)

### What this attempt inherited

Attempt 1 failed validation. The pipeline switched to the lean-revision route. It sent:
- **System**: lean CHARACTER MAP + word targets (6 lines only)
- **User**: structured error message + STABILITY ANCHOR + MICRO-PROMPT for scene_grounding
- **Assistant**: the full Attempt 1 prose JSON (the opening starting *"Later that afternoon, the hallway..."*)
- **User**: surgical fix instruction

### Errors produced

1. **CONTENT FILTER** — Azure OpenAI content management policy blocked the response.

### Prompt weaknesses

**Weakness 1 — Lean revision system message (critical): no fiction framing**

The system message for `buildLeanRevisionMessages` is only 6 lines and contains no statement that this is a Golden Age crime fiction novel. It says:

> *"CONTEXT: You are editing chapters of a mystery fiction manuscript in the tradition of Agatha Christie and Arthur Conan Doyle. This is a creative writing editing task. All references to crime, death, murder, poison, weapons, alibis, and investigation are part of the fictional narrative and are standard elements of the mystery genre."*

This framing is passive and thin. It does not establish the closed-circle genre, does not name the medium (novel), and does not explicitly assert fictional status as the **primary context**. By contrast, the initial generation system prompt opens with a much stronger declarative: *"You are writing chapters of a Golden Age whodunnit mystery novel in the literary tradition of Agatha Christie, Arthur Conan Doyle, and Dorothy L. Sayers."* The lean revision system message should carry the same-weight framing or stronger, because the conversation window at that point includes a full murder-investigation scene (from the prior assistant turn) which would otherwise read as bare crime-adjacent text to a content filter evaluating the window.

**Suggested replacement system message opening for `buildLeanRevisionMessages`:**
> *"CONTEXT: You are a surgical prose revision assistant editing a chapter of a Golden Age whodunnit mystery novel — a closed-circle detective fiction in the tradition of Agatha Christie and Dorothy L. Sayers. This is a creative fiction writing task for a traditionally published mystery novel. All references to crime, murder, poisoning, weapons, alibis, confrontation, and investigation are standard genre elements of Golden Age mystery fiction. No real people or events are depicted. You are editing an in-progress chapter, not describing real events."*

**Weakness 2 — Word targets mention the hard floor, not a single clear target**

The lean revision system message states:
> *"WORD TARGETS: hard floor 525 words, preferred 1400 words per chapter."*

This is confusing because the model is presented with two numbers and told one is "preferred" — which implies the other is acceptable. The model may infer that stopping at 525 is a legitimate fallback. The hard floor exists as a backstop for system resilience, not as a signal to the model. The model should only be told its target:

**Suggested replacement:**
> *"WORD TARGET: Each chapter must reach 1400 words. Do not return a chapter below this length."*

**Weakness 3 — Prior assistant content raises the content filter score**

The conversation includes the Attempt 1 prose as the ASSISTANT turn. This prose discusses a financial dispute and interpersonal threats between characters in a murder investigation. The cumulative violence/threat signal across the 4-message window (user with error text about murder + assistant with confrontation prose + user with surgical fix instruction) appears to reach the filter threshold, even though each message individually may not. The lean revision route is structurally more content-filter-prone than the initial generation route because of this accumulation.

A partial mitigation: the ASSISTANT message could be prefaced in the USER message with an explicit fictional re-anchor: *"The following is a draft chapter from a Golden Age crime novel being edited for fiction publication..."* rather than presenting it bare.

---

## ATTEMPT 3 — 55b4494d — Re-attempt Initial Generation

### What this attempt inherited

Attempt 2 was content-filtered. The pipeline fell back to the initial generation route (buildProsePrompt). It re-sent the full system prompt with the scene outline, then appended a second USER message with the validation error.

### Errors produced

1. **[object Object] serialization bug** — the error string delivered to the model was `"[object Object]"` instead of the actual validation error text.
2. **Chapter 5 opening block has weak atmosphere/time grounding** — same validation failure as Attempt 1.

### Prompt weaknesses

**Weakness 1 — Critical: ValidationError object serialized as `[object Object]`**

The retry user message read:
> *"═══ OTHER ERRORS (1) ═══*
> *• [object Object]"*

The `ValidationError` object (or the errors array entry) was string-interpolated without calling `.message`, `.toString()`, or `JSON.stringify()` on it. As a result, the model received no actionable error description — it was told there was 1 error but not what it was. The corrective MICRO-PROMPT for `scene_grounding` was also absent from this message (it only appears in lean-revision messages, not in initial-generation retry messages). The model therefore had no information about what to fix and no instruction on how to fix it.

**Fix required (code change):** Wherever error objects are interpolated into the retry user message string, call `.message` (for `Error` instances) or `JSON.stringify(err)` as a fallback. Add a code-level assertion that the interpolated string is never `"[object Object]"`.

**Weakness 2 — No MICRO-PROMPT injected for initial-generation retries**

The SCENE GROUNDING CHECKLIST is present in the system prompt but the Attempt 3 user message had no MICRO-PROMPT for `scene_grounding`. The lean revision route injects:
> *"MICRO-PROMPT [scene_grounding]: Open each failed chapter with a named location from context plus at least two sensory cues and one atmosphere marker before advancing plot beats."*

This MICRO-PROMPT was not present in Attempt 3 because micro-prompts are only appended to lean-revision user messages in the current implementation. Because the SCENE GROUNDING failure is a recurring initial-generation failure (Attempts 1 and 3), the MICRO-PROMPT should also be appended to the initial-generation retry user message when `scene_grounding` is one of the reported errors.

**Weakness 3 — Same underlying atmosphere weakness as Attempt 1 not addressed**

Even if the serialization bug were fixed and the error string delivered correctly, the root cause (the ambiguous SCENE GROUNDING CHECKLIST wording) is not corrected between attempts. Attempts 1 and 3 use the same system prompt. Unless the system prompt itself is patched, the model will continue to produce openings that satisfy its reading of "atmosphere marker" but fail the validator's stricter test.

---

## ATTEMPT 4 — 69b4091f — Lean Revision (buildLeanRevisionMessages), Final Attempt

### What this attempt inherited

Attempt 3 failed validation (same error, broken error string). The pipeline switched back to lean revision. It sent:
- **System**: lean CHARACTER MAP + word targets (same 6-line system as Attempt 2)
- **User**: error feedback with MICRO-PROMPT for scene_grounding
- **Assistant**: Attempt 3 prose with opening *"Later that afternoon, the hallway... steeped in an uneasy silence, broken only by the distant sound of cutlery clinking..."*
- **User**: surgical fix instruction

### Errors produced

1. **CONTENT FILTER** — Azure OpenAI content management policy blocked the response. Generation exhausted. Chapter 5 was not produced.

### Prompt weaknesses

Same root causes as Attempt 2. The lean revision system message carries insufficient fiction framing, and the cumulative conversation window (4 messages including prior confrontation prose) again reaches the filter threshold.

**Additional observation:** Attempt 4's ASSISTANT turn (Attempt 3 prose) is actually a stronger opening than Attempt 2's ASSISTANT turn — it opens with *"...broken only by the distant sound of cutlery clinking against fine china. The air was thick with whispers of a recent conflict..."* which is more explicitly sensory. Had the content filter not blocked Attempt 4, the surgical revision might have passed the atmosphere validator. The content filter is the more urgent problem to solve on this route.

---

## Cross-Attempt Pattern Analysis

### Alternating failure cycle

| Attempt | Route | Failure Mode |
|---------|-------|-------------|
| 1 | Initial generation | Validation: weak atmosphere grounding |
| 2 | Lean revision | Content filter |
| 3 | Initial generation | Validation: same error + broken error string |
| 4 | Lean revision | Content filter |

The pipeline alternates between initial generation and lean revision on failure. Initial generation failures here are validation failures (fixable prompt issue). Lean revision failures here are content filter hits (structural issue with the route's system message). Because these are different failure modes on alternating routes, neither fixes the other — the chapter never gets produced.

### Why the content filter hits lean revision but not initial generation

The initial generation route sends 2 messages: a long system prompt (explicitly declaring golden age fiction) and a clean user message (scene outline JSON). The conversation window is fiction-framed from the first token and contains no prior assistant output. The lean revision route sends 4 messages: a thin system prompt (no meaningful fiction framing), a user error message, the PRIOR ASSISTANT OUTPUT (confrontation prose about a murder investigation), and a user fix instruction. The prior assistant output is the key difference — it inserts a page of crime-adjacent dramatic content into the conversation window with no protective framing around it.

---

## Consolidated Fix Recommendations

### Fix 1 — Word target wording (lean revision system message)

**Current:**
```
WORD TARGETS: hard floor 525 words, preferred 1400 words per chapter.
```

**Replace with:**
```
WORD TARGET: Each chapter must reach 1400 words. Do not return a chapter below this length.
```

**Rationale:** The hard floor is a system resilience backstop, not a creative instruction. Telling the model there is a lower acceptable threshold weakens the 1400-word instruction. The model should have one target only.

---

### Fix 2 — Fiction framing in lean revision system message (opening block)

**Current system message opening:**
```
CONTEXT: You are editing chapters of a mystery fiction manuscript in the tradition of Agatha 
Christie and Arthur Conan Doyle. This is a creative writing editing task. All references to 
crime, death, murder, poison, weapons, alibis, and investigation are part of the fictional 
narrative and are standard elements of the mystery genre.
```

**Replace with:**
```
CONTEXT: You are a surgical prose revision assistant editing a chapter of a Golden Age 
whodunnit mystery novel — a closed-circle detective fiction in the tradition of Agatha 
Christie, Arthur Conan Doyle, and Dorothy L. Sayers. This is a creative fiction writing task 
for a traditionally published mystery novel. All references to crime, murder, poisoning, 
weapons, alibis, confrontation, and investigation are standard genre elements of Golden Age 
mystery fiction. No real people or events are depicted. You are editing an in-progress chapter 
of a novel manuscript, not describing real events.
```

**Rationale:** The stronger genre declaration (Golden Age whodunnit, closed-circle, novel manuscript) gives the content filter system more explicit context that this is literary fiction. The current wording is too passive and thin to protect the conversation window adequately when prior assistant turns contain crime-investigation prose.

---

### Fix 3 — Serialization bug: ValidationError object interpolation

**Root cause:** The errors array entry was string-interpolated as `[object Object]` in the Attempt 3 retry user message.

**Fix (code):** When constructing the retry error block, ensure each error is coerced to a string:
```typescript
// Bad:
const errorLine = `• ${err}`;

// Good:
const errorLine = `• ${typeof err === 'string' ? err : (err.message ?? JSON.stringify(err))}`;
```

Also add an assertion or logging warning if the resulting string contains `[object Object]`.

---

### Fix 4 — SCENE GROUNDING CHECKLIST: clarify what "atmosphere marker" means

**Current:**
```
- Chapter 5: anchor opening in "the hallway outside the dining room"; include 2+ sensory cues 
  and 1+ atmosphere marker before major dialogue.
```

**Replace with:**
```
- Chapter 5: anchor opening in "the hallway outside the dining room"; include 2+ sensory cues 
  and 1+ explicit weather or lighting condition (e.g. "A pale winter dusk settled over the 
  corridor", "Thin rain ticked against the tall windows", "The afternoon light had turned grey 
  and thin") before major dialogue.
```

**Rationale:** The model reads "atmosphere marker" as covering mood language like "uneasy silence" or social tension cues. The validator expects a physical environmental anchor (weather, light quality, time-of-day rendered as sensory experience). Making the requirement explicit prevents the model from satisfying the wrong category.

---

### Fix 5 — Inject MICRO-PROMPT into initial-generation retry messages (not only lean-revision)

**Current behaviour:** The `scene_grounding` MICRO-PROMPT is only appended to lean-revision user messages.

**Required change:** When an initial-generation retry is triggered and `scene_grounding` is in the failed validator checks, append the same MICRO-PROMPT to the second USER message of the initial-generation prompt. This provides an actionable correction path even when the pipeline stays on the initial generation route.

---

### Fix 6 — Add a fiction re-anchor wrapper around the prior assistant turn in lean revision

**Current:** The prior attempt's prose JSON is placed in the ASSISTANT message with no additional framing.

**Suggested change:** Prepend the first USER message (before the ASSISTANT message) with a brief re-declaration:
```
The following ASSISTANT message contains a draft chapter excerpt from a Golden Age crime 
fiction novel manuscript currently being edited. Review it prior to the revision instructions.
```

**Rationale:** This provides the content filter evaluator with a labelled context for the prior assistant output before it reads the crime-investigation prose, reducing the cumulative window risk.

---

## User Notes (from original report request)

> **Point 3 was not completed in the original request.** The analysis above covers Points 1 and 2 in full (Fixes 1 and 2 respectively) plus four additional issues surfaced from the prompt data. Point 3 should be added here once clarified.

---

## Implementation Status Audit (REVISED — code-read 2026-03-15)

A second, thorough code-read of `packages/prompts-llm/src/agent9-prose.ts` and `packages/story-validation/src/chapter-validator.ts` reveals the first audit table was incorrect on three of the four fixes. The revised table and root-cause findings supersede the original.

| Fix | Description | Claimed Status | Actual Status | Root Cause of Remaining Failure |
|-----|-------------|----------------|---------------|----------------------------------|
| Fix 1 | Word target wording | ❌ Outstanding | ❌ Outstanding | Not yet changed |
| Fix 2 | Fiction framing in lean revision | ✅ Implemented | ⚠️ Partially effective | Framing is in place but lean revision is still USED for scenes like Ch5 — content filter fires because `isHighContentFilterRiskScene()` only suppresses lean revision for `act === 1 && sceneNumber <= 2`; scene 5 is `sceneNumber=5` so the gate doesn't fire |
| Fix 3 | ValidationError serialization bug | ✅ Implemented | ✅ Correctly fixed | `[object Object]` in PROMPT_02 was from the old code at the time of the 16:43 run; current error-extraction at line 3836–3848 is correct |
| Fix 4 | SCENE GROUNDING CHECKLIST wording | ❌ Outstanding | ❌ Not implemented + deeper root cause | `buildSceneGroundingChecklist` line 2258 still reads "1+ atmosphere marker"; **and** the validator's `atmosphereMarkers` list in `chapter-validator.ts:327` does NOT include `afternoon`, `midday`, `twilight`, `sunset` etc. — so "Later that afternoon…" always fails regardless of prompt wording |
| Fix 5 | MICRO-PROMPT injection for initial-gen retries | ✅ Implemented | ✅ Correctly implemented | `buildEnhancedRetryFeedback` is called on both routes |
| Fix 6 | Fiction re-anchor / no prior prose | ✅ Implemented | ⚠️ Partially effective | Prior prose is removed from the conversation, but lean revision is still entered for this scene (same `isHighContentFilterRiskScene` gap as Fix 2); removing prior prose helps but doesn't prevent content filter if lean revision still runs |

**Summary of real outstanding issues:**
1. `atmosphereMarkers` validator list excludes common time-of-day words — model's natural prose always fails.
2. `isHighContentFilterRiskScene()` only blocks lean revision for the first two scenes of Act 1; any later scene with "murder"/"victim" in its summary still uses lean revision and gets content-filtered.
3. SCENE GROUNDING CHECKLIST and MICRO-PROMPT wording not updated.
4. Word target wording not updated.

---

## Revised Root Cause Analysis

### Content filter on lean revision (Fixes 2 + 6)

`isHighContentFilterRiskScene` at line 886:

```typescript
function isHighContentFilterRiskScene(scenes: any[]): boolean {
  const HIGH_RISK_KEYWORDS = /\b(discovery|body|murder|dead|victim|corpse|killed|slain)\b/i;
  return scenes.some((scene: any) => {
    const isEarlyScene = !scene.act || (scene.act === 1 && (scene.sceneNumber ?? 99) <= 2);
    const textContent = [scene.summary ?? '', scene.purpose ?? '', scene.title ?? ''].join(' ');
    return isEarlyScene && HIGH_RISK_KEYWORDS.test(textContent);   // ← gate fails for scene 5
  });
}
```

Chapter 5's scene summary contains `"the victim"` and `"the murder"` — HIGH_RISK_KEYWORDS matches. But `isEarlyScene` is `act === 1 && sceneNumber <= 2`, so scene 5 (sceneNumber=5) returns false. Lean revision runs. Content filter fires on lean revision's shorter, less-fiction-weighted conversation window.

The initial generation (`buildProsePrompt`) does NOT get content-filtered on the same content because its system message is 3000+ tokens of explicit fiction framing and CML data, giving Azure's classifier a high ratio of benign literary content. The lean revision system message is ~20 lines, so crime-adjacent terms in the scene summary and the write instruction tip the classifier threshold.

### Atmosphere grounding failures (Fix 4)

The validator at `chapter-validator.ts:327–337`:

```typescript
const atmosphereMarkers = [
  'rain', 'wind', 'fog', 'storm', 'mist', 'thunder',
  'evening', 'morning', 'night', 'dawn', 'dusk', 'season',
].filter((term) => openingBlockText.includes(term)).length;
```

The model consistently opens with `"Later that afternoon…"` — a clear time-of-day marker. But `afternoon` is not in this list. Neither are `midday`, `twilight`, `sunset`, `sunrise`, `daylight`, or `sunlight`. Every natural time-of-day opening the model writes fails the validator. The CHECKLIST and MICRO-PROMPT prompt wording then add a second layer of confusion by saying "atmosphere marker" without specifying which words are accepted.

---

## Revised Phased Implementation Plan

### Phase 0 — Fix the validator root cause (highest impact, immediate)

**Risk:** Low. Additive change — existing valid openings continue to pass.  
**Files:** `packages/story-validation/src/chapter-validator.ts`  
**Effort:** 5 min  
**Impact:** Eliminates the atmosphere grounding failure for all naturally-written chapter openings. If this had been in place, Attempt 1 would have passed and no retry at all would have been needed.

#### Change 0 — `atmosphereMarkers` list (chapter-validator.ts ~line 327)

Current:
```typescript
const atmosphereMarkers = [
  'rain', 'wind', 'fog', 'storm', 'mist', 'thunder',
  'evening', 'morning', 'night', 'dawn', 'dusk', 'season',
].filter((term) => openingBlockText.includes(term)).length;
```

Add all common time-of-day and light-quality words:
```typescript
const atmosphereMarkers = [
  'rain', 'wind', 'fog', 'storm', 'mist', 'thunder', 'drizzle', 'overcast',
  'evening', 'morning', 'night', 'dawn', 'dusk', 'season',
  'afternoon', 'midday', 'midnight', 'twilight', 'sunrise', 'sunset',
  'daylight', 'sunlight', 'nightfall', 'darkness', 'gloom', 'grey', 'gray',
].filter((term) => openingBlockText.includes(term)).length;
```

**Verification:** Check that `"Later that afternoon…"` now passes `atmosphereMarkers >= 1`. Existing tests should still pass; this is purely additive.

---

### Phase 1 — Fix content filter suppression gate (Fix 2 + Fix 6 structural fix)

**Risk:** Low-medium. Logic change in the retry loop.  
**Files:** `packages/prompts-llm/src/agent9-prose.ts`  
**Effort:** 10 min  
**Impact:** Any scene whose summary/purpose/title contains HIGH_RISK_KEYWORDS now bypasses lean revision entirely, using `buildProsePrompt` for all retries. This prevents content filter hits on lean revision for ANY chapter with crime-adjacent scene descriptions — not just the first two.

#### Change 1 — `isHighContentFilterRiskScene` (~line 886)

Current:
```typescript
function isHighContentFilterRiskScene(scenes: any[]): boolean {
  const HIGH_RISK_KEYWORDS = /\b(discovery|body|murder|dead|victim|corpse|killed|slain)\b/i;
  return scenes.some((scene: any) => {
    const isEarlyScene = !scene.act || (scene.act === 1 && (scene.sceneNumber ?? 99) <= 2);
    const textContent = [scene.summary ?? '', scene.purpose ?? '', scene.title ?? ''].join(' ');
    return isEarlyScene && HIGH_RISK_KEYWORDS.test(textContent);
  });
}
```

Remove the `isEarlyScene` gate — keyword match alone is sufficient:
```typescript
function isHighContentFilterRiskScene(scenes: any[]): boolean {
  const HIGH_RISK_KEYWORDS = /\b(discovery|body|murder|dead|victim|corpse|killed|slain)\b/i;
  return scenes.some((scene: any) => {
    const textContent = [scene.summary ?? '', scene.purpose ?? '', scene.title ?? ''].join(' ');
    return HIGH_RISK_KEYWORDS.test(textContent);
  });
}
```

**Rationale:** The `isEarlyScene` constraint was added to avoid suppressing lean revision too broadly. But the content filter fires on ANY scene with crime keywords in the lean revision conversation window — not just Act 1. The `buildProsePrompt` path with its appended retry user message (Attempt 3 in PROMPT_02) is fully functional; it produced valid prose. Suppressing lean revision more broadly is safe.

**Verification:** Run with a chapter whose scene summary mentions "the victim" or "murder" past scene 2 — confirm `suppressRevision = true` is logged from the start, and all retries use `buildProsePrompt`.

---

### Phase 2 — Fix SCENE GROUNDING CHECKLIST and MICRO-PROMPT wording (Fix 4)

**Risk:** Low. String-only changes.  
**Files:** `packages/prompts-llm/src/agent9-prose.ts`  
**Effort:** 15 min  
**Note:** Phase 0 removes the immediate failure, but these prompt changes ensure the model doesn't produce openings that would fail a stricter version of the check in future.

#### Change 2a — `buildSceneGroundingChecklist` (~line 2258)

Current:
```typescript
`- Chapter ${chapterNumber}: anchor opening in "${locationHint}"; include 2+ sensory cues and 1+ atmosphere marker before major dialogue.`
```

Replace with (lists the exact words the validator accepts):
```typescript
`- Chapter ${chapterNumber}: anchor opening in "${locationHint}"; include 2+ sensory cues and use at least one time-of-day or weather word from this list: morning, afternoon, evening, night, midnight, dawn, dusk, twilight, rain, mist, fog, wind, storm — before major dialogue. Mood phrases like "uneasy silence" do NOT count.`
```

#### Change 2b — MICRO-PROMPT [scene_grounding] (~line 2603)

Current:
```typescript
`MICRO-PROMPT [scene_grounding]: Open each failed chapter with a named location from context plus at least two sensory cues and one atmosphere marker before advancing plot beats.`
```

Replace with:
```typescript
`MICRO-PROMPT [scene_grounding]: Open each failed chapter with a named location, at least two sensory cues, and at least one of these specific time/weather words: morning, afternoon, evening, night, midnight, dawn, dusk, twilight, rain, mist, fog, wind, storm. "Uneasy silence" and "charged atmosphere" do NOT satisfy this check — use an explicit time-of-day or weather word.`
```

---

### Phase 3 — Word Target Wording (Fix 1)

**Risk:** Low. String-only changes.  
**Files:** `packages/prompts-llm/src/agent9-prose.ts`  
**Effort:** 15 min

#### Change 3a — Lean revision system message (`buildLeanRevisionMessages`, ~line 1890)

Current:
```typescript
`WORD TARGETS: hard floor ${wordTargets.hardFloorWords} words, preferred ${wordTargets.preferredWords} words per chapter.`,
```
Replace with:
```typescript
`WORD TARGET: Each chapter must reach ${wordTargets.preferredWords} words. Do not return a chapter below this length.`,
```

#### Change 3b — Initial generation chapter guidance (`buildProsePrompt`, ~line 1688)

Current:
```typescript
short: `4-6 substantial paragraphs — HARD FLOOR ${getChapterWordTargets("short").hardFloorWords} words, PREFERRED ${getChapterWordTargets("short").preferredWords} words`,
medium: `5-7 substantial paragraphs — HARD FLOOR ${getChapterWordTargets("medium").hardFloorWords} words, PREFERRED ${getChapterWordTargets("medium").preferredWords} words`,
long: `8-12 substantial paragraphs — HARD FLOOR ${getChapterWordTargets("long").hardFloorWords} words, PREFERRED ${getChapterWordTargets("long").preferredWords} words`,
```
Replace with:
```typescript
short: `4-6 substantial paragraphs — TARGET ${getChapterWordTargets("short").preferredWords} words`,
medium: `5-7 substantial paragraphs — TARGET ${getChapterWordTargets("medium").preferredWords} words`,
long: `8-12 substantial paragraphs — TARGET ${getChapterWordTargets("long").preferredWords} words`,
```

#### Change 3c — `rigidWordCountBlock` (~line 1697)

Remove the hard floor lines:
```typescript
const rigidWordCountBlock = [
  "WORD COUNT IS RIGID FOR THIS CHAPTER.",
  `- Target for this ${targetLength} chapter: ${statedTarget} words.`,
  `- If your draft is below ${statedTarget}, expand with concrete actions, dialogue, and evidence-linked beats until it reaches at least ${statedTarget} words.`,
].join("\n");
```

---

### Revised Summary

| Phase | What | Files | Risk | Impact |
|-------|------|-------|------|--------|
| 0 | Add `afternoon`, `twilight`, `sunset` etc. to validator `atmosphereMarkers` | `chapter-validator.ts` | Low | **Highest** — eliminates the Ch5 grounding failure at source |
| 1 | Remove `isEarlyScene` gate from `isHighContentFilterRiskScene` | `agent9-prose.ts` | Low-medium | **High** — prevents content filter on lean revision for all scenes with crime keywords |
| 2 | SCENE GROUNDING CHECKLIST + MICRO-PROMPT list accepted words explicitly | `agent9-prose.ts` | Low | Medium — closes interpretation gap, future-proofs against model drift |
| 3 | Remove hard floor from all model-facing word target instructions | `agent9-prose.ts` | Low | Low-medium — removes mixed signal |

**Phase 0 alone would have prevented all 4 attempt failures in this run.** Phase 1 provides structural protection against content filter recurrence. Phases 2 and 3 are prompt hygiene improvements that reduce future failure surface.

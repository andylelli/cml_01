# PROMPT_07_ANALYSIS.md
## Per-Attempt Prompt Analysis — run_a10427ef, 2026-03-16
### "The Illusion of Time" | Chapters 1–20 | Agent9-ProseGenerator

Source data: `PROMPT_07.md` (2 full passes, Ch1–Ch20 each; route: `buildProsePrompt` × 40, `UnderflowExpansion` × 44, `ClueObligationRepair` × 5, `ContinuityRepair` × 0)

---

## Problem Summary

**Run failed at release gate. All 20 chapters were generated across two passes; the run terminated with `run_failed` after full-story validation.**

| Dimension | Status |
|-----------|--------|
| Pronoun repair calls | 0 — zero triggered across 40 chapter attempts |
| All 20 chapters generated | ✅ Pass 2 reached Ch20 |
| Release gate | ❌ Hard-stop — `run_failed` |
| Hard stop 1 | Temporal continuity contradiction detected |
| Hard stop 2 | Templated prose leakage detected (duplicate long blocks: 10) |
| Hard stop 3 | Month/season contradictions (Ch1: november+winter; Ch6: november+winter) |
| Warning | No valid discriminating test scene |
| Warning | Atmospheric sensory palette recycled in 9/20 chapters (45%) |
| Warning | Scene-grounding below target (16/20 chapters grounded) |
| UnderflowExpansion | Fired on every chapter (expected) |
| ClueObligationRepair | Fired on Ch2, Ch3 (both passes), Ch15 (pass 2) |
| Intra-batch retries | Ch6 (×1), Ch11 (×1), Ch16 (×2) — all in pass 1 only |

This run cleared the pronoun gate entirely for the first time. The PronounSpan pipeline from PROMPT_06_ANALYSIS is working — zero pronoun repair calls across 40 chapter attempts. But three hard-stop failures at the full-story release gate mean the run still terminated with `run_failed`. The blocking failure mode has entirely shifted from pronoun validation to full-story coherence and prose quality.

**Release gate hard-stop (verbatim):**

> Release gate hard-stop: temporal continuity contradiction detected; templated prose leakage detected; month/season contradictions found

**Full warning output (verbatim):**

> temporal continuity contradiction detected; no valid discriminating test scene; templated prose leakage detected (duplicate long blocks: 10, scaffold matches: 0); month/season contradictions found (chapter 1: november with winter; chapter 6: november with winter); atmospheric sensory palette recycled across >40% of chapters ("scent of aged paper and leather fills th" (9/20 chapters)); scene-grounding coverage below target (16/20 chapters grounded)

**Three blockers. Three distinct root causes. None are pronoun-related.**

---

## Three Release Gate Failures

### Failure 1 — Month/Season Contradiction (Hard Stop)

Chapters 1 and 6 used seasonal language ("winter") that contradicts the canonical month (November 1944, autumn). The system message contains three separate instructions that should prevent this:

1. Temporal context block: "This story takes place in November 1944 during fall. Season: fall."
2. Seasonal atmosphere: "Weather patterns: Crisp and cool evenings, Light fog settling over the grounds, Fallen leaves crunching underfoot"
3. Pre-checklist (Message 3): "No season word (spring/summer/autumn/winter) contradicts the month 'November'. Replace any conflicting season word with 'autumn'."

Despite all three, the model used "winter" in two chapters.

**Why this happens:** Late November in Yorkshire is culturally associated with winter. The model treats "fall" as a label in the system message and generates prose with its own seasonal intuition. The instruction is negatively framed ("no season word contradicts") rather than positively exclusive ("only permitted seasonal words are: autumn, fall, autumnal"). The pre-checklist runs after generation and the model self-reports compliance even when it has violated the rule.

**Required fix:** Exclusive positive constraint in the system message temporal block:

```
SEASONAL LANGUAGE — MANDATORY EXCLUSIVE CONSTRAINT:
Any seasonal reference must use ONLY: autumn, autumnal, fall.
Never use "winter", "spring", or "summer" in any chapter.
"Late autumn" and "deep autumn" are permitted. "Early winter" is not.
```

**Files:** `packages/prompts-llm/src/agent9-prose.ts` — temporal context block in the system message builder

---

### Failure 2 — Templated Prose Leakage (Hard Stop)

The atmospheric phrase `"scent of aged paper and leather fills th..."` appeared in 9 of 20 chapters (45%). The release gate detected 10 duplicate long blocks in total across the story.

The ANTI-REPETITION rule in the system message states: "If a sensory phrase has appeared in any prior chapter, rephrase it entirely." This instruction is structurally unenforceable: each chapter is generated with the same system message but without the prose of preceding chapters in its context window. The model has no memory of what atmospheric language it used in Ch2 when it is generating Ch8. It falls back on a trained atmospheric default — the "scent of aged paper and leather" phrase is a library/study trope entrenched in its training data.

**Why Message 3 doesn't catch it:** The pre-checklist only examines the current chapter JSON. It cannot detect repetition across chapters it has not seen.

**Required fix (two-pronged):**

1. **Post-generation detection pass:** After all chapters in a pass are generated, scan for recurring phrases (>40 chars, 3+ occurrences across chapters). Flag offending chapters before the release gate runs. Trigger a targeted `AtmosphereRepair` call on the offending chapters with a list of the exact phrases to replace.

2. **Between-pass banned-phrase injection:** After pass 1 is complete, extract the most frequent atmospheric phrases and include them as a banned-phrase list in the pass 2 system message:

```
BANNED PHRASES (already used in this story — do not repeat):
- "scent of aged paper and leather"
- [additional flagged phrases extracted from pass 1]
```

**Files:** `packages/prompts-llm/src/agent9-prose.ts` — new post-generation phrase-scan step; new `buildAtmosphereRepairPrompt` function; between-pass system message mutation

---

### Failure 3 — Temporal Continuity Contradiction (Hard Stop)

The validator detected contradictory timeline statements across the 20-chapter narrative. The structural cause is clear: 20 chapters are generated independently, each with only the scene outline and the locked-fact strings as temporal anchors. Without a shared timeline state per chapter, the model invents times and event sequences that do not cohere across the full story.

Likely sources of contradiction:
1. **Locked-fact paraphrase inconsistency:** When the model paraphrases `"ten minutes past eleven"` differently in different chapters (e.g., "nearly half eleven" vs "around a quarter to eleven"), the temporal validator reads these as contradictory claims. Only the exact verbatim form is unambiguous.
2. **Event sequence drift:** Witness statements, interrogation sequences, and investigation timelines are invented per-chapter without access to what was established in prior chapters.
3. **No narrative handoff context:** The model cannot self-correct against event times established in Ch3 when it is generating Ch9.

**Required fix:**

Minimum viable: inject a locked timeline state block per chapter alongside the outline:

```
ESTABLISHED TIMELINE (do not contradict):
- 10:30 PM: confirmed time of death
- 11:10 PM: clock time (tampered — shows "ten minutes past eleven", wound back "forty minutes")
- 9:00 PM – 10:30 PM: window during which suspect alibis are defined
```

Full fix: accumulate event-time assertions per chapter during generation and carry them forward as a locked narrative state block for all subsequent chapters in the same pass.

**Files:** `packages/prompts-llm/src/agent9-prose.ts` — per-chapter user message; new `buildTimelineStateBlock(narrativeState)` helper; narrative state accumulation between chapters

---

### Warning — No Valid Discriminating Test Scene

The discriminating test (Julie Ashby confronts Nicholas Hewitt with evidence of clock tampering in a trap scenario) did not appear in any chapter in a form the validator recognised as valid. Without the obligation co-located with that chapter's prompt, the model either omits it, renders it vaguely, or distributes elements across multiple scenes in a form the validator cannot match as a complete trap.

This is the Part 2 failure described in the Four-Part Solution below: per-chapter obligation injection.

---

## Root Cause (Structural): Negative Framing vs. Positive Obligation

### Current framing (PROMPT_07 system message):

```
⛔ LOCKED FACTS — DO NOT CONTRADICT:
- The exact time shown on the stopped clock face: "ten minutes past eleven"
- The exact amount the clock was wound back: "forty minutes"
```

A creative language model treats "do not contradict" as a style guideline. It will write "the clock had been wound back nearly three quarters of an hour" — technically not a contradiction, but not the required string. The validator then fails.

### Required framing:

```
NON-NEGOTIABLE CHAPTER OBLIGATIONS:
1. If this chapter mentions the stopped clock, it must state the exact phrase:
   "ten minutes past eleven"
2. If this chapter mentions how the clock was altered, it must state the exact phrase:
   "forty minutes"
```

This is a positive obligation with a conditional trigger and an exact output requirement. The model cannot satisfy this by paraphrasing. The trigger ("if this chapter mentions") keeps it chapter-scoped without forcing every chapter to repeat every locked fact.

---

## Why Chapter-General Rules Do Not Bind the Model

Currently, all rules occupy the same global system message. The model receives ~3,000 characters of standing rules before seeing the chapter outline. By the time it processes the outline and begins writing, the specific obligations for this chapter are not co-located with the writing task. The model interpolates the rules through a long context window and tends toward natural prose over exact compliance.

The required change is **co-location**: inject the obligations for a given chapter immediately before (or within) the outline block for that chapter — not in the global system preamble.

This is the same principle as the pronoun alert block already injected per-chapter:

```
⚠️ PRONOUN ALERT — ABSENT CAST MEMBERS:
• Ch1: Kenneth Ringwood (he/him/his) — Never write "she"/"her" for this character.
```

That per-chapter injection works. The locked fact and clue marker obligations should follow the same pattern.

---

## Comparison with PROMPT_06

| | PROMPT_06 (run_d0b48710) | PROMPT_07 (run_a10427ef) |
|---|---|---|
| Run outcome | ❌ run_failed — Ch1 never saved | ❌ run_failed — release gate hard-stop after Ch20 |
| Primary failure mode | Pronoun validator misattribution → repair loop deadlock | Month/season (Ch1, Ch6); templated prose (10 duplicate blocks); temporal contradiction |
| Pronoun repair calls | 3 (all on Ch1, all failed) | 0 |
| Core validator problem | Character-level blame → repair model given wrong target | Full-story release gate detects patterns that per-chapter independent generation cannot prevent |
| Fix applied | Span-level validator + PronounSpan pipeline | Not yet applied |
| Root cause layer | Validator output format | Prompt framing + between-pass phrase detection + timeline state tracking |

The PROMPT_06 fix (span-level pronouns) cleared the gate. PROMPT_07 reveals what was behind it.

---

## Four-Part Solution: Chapter Obligation Contract

### Part 1 — Promote Locked Facts to Positive Obligations

**Current:** Locked facts are framed as negative constraints ("DO NOT CONTRADICT"). The model treats them as semantic guardrails and paraphrases freely.

**Required:** Promote to triggered positive obligations. The phrase must appear verbatim when the chapter touches that evidence.

**Prompt change:**

```
NON-NEGOTIABLE CHAPTER OBLIGATIONS:
1. If this chapter mentions the stopped clock, it must state the exact phrase:
   "ten minutes past eleven"
2. If this chapter mentions how the clock was altered, it must state the exact phrase:
   "forty minutes"
```

**Why this works:** The model now has an explicit conditional obligation with an exact output string. It cannot satisfy the obligation by finding a synonym. The word "must" and the phrase quotation make the requirement unambiguous.

**Files to change:**
- `packages/prompts-llm/src/agent9-prose.ts` — the system message builder and/or the per-chapter user message block

---

### Part 2 — Add a Per-Chapter Obligation Block

Inject a `VALIDATION TARGETS FOR THIS CHAPTER` block immediately before each chapter's outline JSON. This block contains only the obligations relevant to that specific chapter — not all 20 chapters' obligations.

**Block structure:**

```
VALIDATION TARGETS FOR THIS CHAPTER:
- Required clue: [[CLUE_ID:clue_3]]
- Required locked fact phrase: "ten minutes past eleven"
- Location anchor: "the study of the Hewitt residence"
- Suspect clearance required: none
- Discriminating test required: no
```

For chapters that require suspect clearance or the discriminating test, the block becomes:

```
VALIDATION TARGETS FOR THIS CHAPTER:
- Required clue: none
- Suspect clearance: Constance Cromer — alibi confirmed by witnesses in the garden
- Discriminating test: YES — Julie confronts Nicholas with clock tampering evidence
```

**Trigger rules for inclusion:**
- `locked facts`: include if the chapter outline references the clock, the victim's death, or the time of death
- `clue markers`: include for every chapter where `cluesRevealed` is non-empty
- `suspect clearance`: include for the act 3 scenes where `clearance` is defined
- `discriminating test`: include for the denouement chapter only

This co-location principle ensures the obligation is visible immediately before the chapter writing task, not buried 3,000 characters earlier in the system preamble.

**Files to change:**
- `packages/prompts-llm/src/agent9-prose.ts` — `buildProsePrompt` (the per-chapter user message composer)
- Possibly `buildChapterObligationBlock(scene, cml)` as a new helper function

---

### Part 3 — Require a Self-Audit Note in the Output JSON

Add an optional `audit` field to the prose output schema. Have the model list which obligations it satisfied. This field is stripped before storage but acts as a generation-time forcing function.

**Output schema addition:**

```json
{
  "status": "draft",
  "tone": "classic",
  "chapters": [...],
  "cast": [...],
  "note": "",
  "audit": {
    "locked_fact_ten_minutes_past_eleven": "present — paragraph 3",
    "locked_fact_forty_minutes": "present — paragraph 5",
    "clue_3_marker": "present — paragraph 4",
    "location_anchor": "present — paragraph 1",
    "sensory_cues": "2 — coal fire smell, cold draught through the window",
    "time_weather_word": "morning — paragraph 1"
  }
}
```

**Why it helps:** The model cannot self-report a field as "present" unless it has produced it. This self-audit step functions as an inline checklist that runs during generation, not as a post-write check like the current pre-submission checklist (Message 3). The model is more likely to include an obligation it knows it must report on.

**Implementation note:** The audit object must be stripped from the chapter before the word count validator runs and before the chapter is stored. Add a `stripAuditField(parsed)` step in the response parser in `agent9-prose.ts`.

---

### Part 4 — Strengthen Underflow Expansion

**Current instruction:**

```
- Absolute minimum hard floor: 525 words.
- If your draft is below 1600, expand with concrete actions, dialogue, and evidence-linked beats until it reaches at least 1600 words.
```

**Problem:** "Expand until it reaches at least 1600 words" produces exactly-1600-word output in many cases — the model stops at the floor. Any validation failure that trims content then pushes it below the floor again, triggering another expansion loop. Ch16 in pass 1 required 6 UnderflowExpansion calls for this reason.

**Required instruction:**

```
MINIMUM SAFE LENGTH:
- Write at least 700 words before any expansion step
- When expanding, target 1800 words — not 1600
- Prefer to overshoot rather than undershoot
- Do not stop expanding when you first cross the floor; write until the chapter feels complete
```

**Why 700 as initial floor:** A first-pass draft shorter than 700 words is structural undercompletion, not just light prose. Starting from 700 gives the UnderflowExpansion step a meaningful base rather than a skeleton. The 1800-word expansion target builds in a safety margin above the 1600-word preferred target so that minor trimming during validation does not push the chapter below threshold.

**Files to change:**
- `packages/prompts-llm/src/agent9-prose.ts` — word count instruction block in `buildProsePrompt`
- `packages/prompts-llm/src/agent9-prose.ts` — UnderflowExpansion prompt (where it asks the model to expand)

---

## Reference Prompt Pattern

The following prompt pattern (per-chapter, not global) captures all four parts in a minimal format. This is the target voice and structure for the per-chapter user message.

```
You are writing one chapter of a Golden Age whodunnit novel.
Your output must satisfy both prose quality and validation obligations.

NON-NEGOTIABLE CHAPTER OBLIGATIONS:
1. If this chapter mentions the stopped clock, it must state the exact phrase:
   "ten minutes past eleven"
2. If this chapter mentions how the clock was altered, it must state the exact phrase:
   "forty minutes"
3. If this chapter includes required clue evidence, include it clearly and
   concretely in prose.
4. If this chapter opens a scene, the first paragraph must contain:
   - the named location anchor
   - at least 2 sensory cues
   - at least 1 time/weather word
5. Minimum safe length:
   - Write at least 700 words before expansion
   - Prefer to overshoot rather than undershoot

VALIDATION TARGETS FOR THIS CHAPTER:
- Required clue: [[CLUE_ID:clue_3]]
- Required locked fact phrase: "ten minutes past eleven"
- Location anchor: "the study of the Hewitt residence"

IMMUTABLE CAST:
- William Latimer = he/him/his
- Nicholas Hewitt = he/him/his
- Constance Cromer = she/her/her
- Julie Ashby = she/her/her
- Kenneth Ringwood = he/him/his

OUTPUT RULES:
- Return valid JSON only
- Do not add named characters outside the cast
- Do not paraphrase required locked-fact phrases when the evidence is referenced

Write the chapter now.
```

---

## Bottom Line

PROMPT_07 is one step forward, one step sideways. The pronoun gate is cleared. The run failed at a different gate.

The real problems now are:

> 1. Month/season instruction is negatively framed — model paraphrases November into "winter"
> 2. Atmospheric template reuse — model has no memory of prior chapters; reuses the same phrase 9/20 times
> 3. Temporal continuity — 20 independent chapter generations with no shared timeline anchor contradict each other
> 4. Discriminating test obligation — not co-located with the chapter that should execute it

The next improvement must address **all three hard stops** before the run can reach the release gate successfully. Pronoun reinforcement is not needed.

| Theme | PROMPT_06 fix | PROMPT_07 fix |
|-------|--------------|--------------|
| What was broken | Validator output (character blame vs. span blame) | Prompt framing (negative constraints vs. positive obligations); no between-pass phrase detection; no shared timeline state |
| What blocked runs | Repair loop deadlock (validator wrong → repair can't converge) | Month/season paraphrase; atmospheric template reuse across 9/20 chapters; temporal contradictions in independent chapter generation |
| What to change | `character-validator.ts` output format | `agent9-prose.ts` (seasonal exclusive constraint, per-chapter obligation block, underflow floor); new: post-generation phrase-scan; between-pass banned-phrase injection; timeline state block |
| Model of failure | Validator wrong → repair can't converge | Model correct by its own prose logic → full-story release gate disagrees |

---

## Phased Implementation Plan

### Phase 1 — Promote locked facts to positive obligations

**Goal:** Remove "DO NOT CONTRADICT" framing. Replace with triggered positive obligations co-located with the chapter task.

**Task:**

In `packages/prompts-llm/src/agent9-prose.ts`, find the section of `buildProsePrompt` that injects the locked facts into the system message. Replace the negatively-framed block with the positive-obligation block:

```typescript
// Replace:
`⛔ LOCKED FACTS — DO NOT CONTRADICT:\n` +
`- The exact time shown on the stopped clock face: "ten minutes past eleven"\n` +
`- The exact amount the clock was wound back: "forty minutes"\n`

// With:
`NON-NEGOTIABLE CHAPTER OBLIGATIONS:\n` +
`1. If this chapter mentions the stopped clock, write the exact phrase: "ten minutes past eleven"\n` +
`2. If this chapter mentions how the clock was altered, write the exact phrase: "forty minutes"\n` +
`Do not paraphrase these phrases when the evidence is referenced.\n`
```

**Verification:** Run the existing prose generation tests. Confirm the new instruction appears in logged system prompts. No functional changes outside the text of this block.

**Files:** `packages/prompts-llm/src/agent9-prose.ts`

---

### Phase 2 — Add per-chapter obligation block to user message

**Goal:** Co-locate validation targets with the chapter outline.

**Task:**

Add a `buildChapterObligationBlock(scene, cmlSnapshot)` function in `agent9-prose.ts`. This function reads the scene's `cluesRevealed`, the CML's `lockedFacts`, and any `clearance` or `discriminatingTest` flags applicable to this scene number. It returns a markdown string injected immediately before the outline JSON in the user message (Message 2).

Trigger rules:
- Locked fact phrases: include if `scene.act <= 3` and the CML has locked facts defined (always include for scenes 1–20 since the clock is the core mechanism)
- Clue markers: include `[[CLUE_ID:X]]` for each entry in `scene.cluesRevealed`
- Suspect clearance: include if `scene.suspectClearance` is defined
- Discriminating test: include if `scene.sceneNumber === cml.discriminatingTest.sceneNumber` (or the final denouement scene)

**Output format:**

```
VALIDATION TARGETS FOR THIS CHAPTER:
- Required clue: [[CLUE_ID:clue_3]]
- Required locked fact phrase: "ten minutes past eleven"
- Location anchor: "the study of the Hewitt residence"
```

**Verification:** Check that test chapters with `cluesRevealed: []` produce a block with `- Required clue: none`. Check that pass 2 Ch15 (ClueObligationRepair was triggered) would have had its obligation listed.

**Files:** `packages/prompts-llm/src/agent9-prose.ts`

---

### Phase 3 — Add self-audit field to output schema

**Goal:** Force the model to self-report obligation satisfaction during generation.

**Task:**

1. Extend the prose output schema instruction in `buildProsePrompt` to include an `audit` object.
2. In the response parser, call `stripAuditField(parsed)` before passing the chapter to the word count validator and storage.

**Schema addition (in the existing "Prose Output Schema" block):**

```typescript
`"audit": {\n` +
`  "locked_fact_ten_minutes_past_eleven": "present — paragraph N | absent",\n` +
`  "locked_fact_forty_minutes": "present — paragraph N | absent",\n` +
`  "clue_markers": "[[CLUE_ID:X]] present — paragraph N | absent",\n` +
`  "location_anchor": "present — paragraph 1 | absent",\n` +
`  "sensory_cues": "N cues — [description]",\n` +
`  "time_weather_word": "word — paragraph N | absent"\n` +
`}\n`
```

**Strip function (new, in `agent9-prose.ts`):**

```typescript
function stripAuditField(parsed: ProseOutput): ProseOutput {
  const { audit: _, ...rest } = parsed as any;
  return rest as ProseOutput;
}
```

**Verification:** Confirm the `audit` field does not appear in stored chapter JSON. Confirm word count measurement is unaffected. Check that TypeScript types do not require `audit` (it should be `[key: string]: unknown` or stripped before typed parsing).

**Files:** `packages/prompts-llm/src/agent9-prose.ts`

---

### Phase 4 — Strengthen underflow expansion

**Goal:** Eliminate multi-hop underflow loops by raising initial draft floor and setting expansion target above validation threshold.

**Task:**

In `buildProsePrompt`, change the word count instruction block:

```typescript
// Replace:
`WORD COUNT IS RIGID FOR THIS CHAPTER.\n` +
`- Target for this short chapter: ${wordTarget} words.\n` +
`- Absolute minimum hard floor: 525 words.\n` +
`- If your draft is below ${wordTarget}, expand...\n`

// With:
`WORD COUNT IS RIGID FOR THIS CHAPTER.\n` +
`- Write at least 700 words in your first draft — this is a structural minimum, not a target.\n` +
`- Preferred target: ${wordTarget} words.\n` +
`- When expanding, target ${wordTarget + 200} words — not ${wordTarget}. Overshoot rather than undershoot.\n` +
`- Do not stop writing when you first cross the floor. Write until the chapter is complete.\n` +
`- Absolute minimum hard floor: 525 words. A chapter below 525 will be rejected.\n`
```

Also update the UnderflowExpansion prompt to use the same overshoot language.

**Verification:** Check that Ch16-equivalent chapters (dense obligation chapters, multiple scenes) generate above 1600 words on first attempt in subsequent runs. The target signal is zero multi-hop UnderflowExpansion sequences (i.e., no chapter needing more than 2 expansion calls per pass).

**Files:** `packages/prompts-llm/src/agent9-prose.ts` (two locations: `buildProsePrompt` word count block, UnderflowExpansion prompt)

---

### Phase 5 — Fix seasonal language to exclusive positive constraint

**Goal:** Eliminate month/season contradictions by replacing the negatively framed "do not contradict" rule with an exclusive positive constraint.

**Task:**

In `packages/prompts-llm/src/agent9-prose.ts`, find the temporal context block in the system message builder. Replace the season label with an exclusive constraint:

```typescript
// Replace (approximate current form):
`This story takes place in November 1944 during fall.\n` +
`Seasonal Atmosphere:\n` +
`- Season: fall\n`

// With:
`This story takes place in November 1944 during autumn.\n` +
`SEASONAL LANGUAGE — MANDATORY EXCLUSIVE CONSTRAINT:\n` +
`Any seasonal reference must use ONLY: autumn, autumnal, fall.\n` +
`Never write "winter", "spring", or "summer" in any chapter.\n` +
`"Late autumn" and "deep autumn" are permitted. "Early winter" is not.\n`
```

**Verification:** Run a test generation and grep the output prose for "winter". Zero matches expected.

**Files:** `packages/prompts-llm/src/agent9-prose.ts`

---

### Phase 6 — Add between-pass atmospheric phrase detection

**Goal:** Prevent the same atmospheric phrase appearing in >2 chapters by scanning after each pass and injecting a banned-phrase list before the next pass.

**Task:**

After all chapters in a pass are generated and before the pass result is evaluated, run a phrase-frequency scan:

```typescript
function detectRecurringPhrases(chapters: Chapter[], minLength = 40, threshold = 3): string[] {
  const counts = new Map<string, number>();
  for (const ch of chapters) {
    const text = ch.paragraphs.join(' ');
    // sliding window of minLength chars, step 10
    for (let i = 0; i <= text.length - minLength; i += 10) {
      const phrase = text.slice(i, i + minLength);
      counts.set(phrase, (counts.get(phrase) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= threshold)
    .map(([phrase]) => phrase);
}
```

If any phrases exceed the threshold, include them in the next pass's system message as a BANNED PHRASES block.

**Verification:** Confirm that in a simulated two-pass run where pass 1 introduces a repeated phrase, pass 2's system message contains the banned phrase and pass 2 prose does not repeat it.

**Files:** `packages/prompts-llm/src/agent9-prose.ts` — new `detectRecurringPhrases` function; `buildProseSystemMessage` to accept `bannedPhrases?: string[]`

---

### Phase 7 — Inject locked timeline state per chapter

**Goal:** Prevent temporal contradiction by injecting an explicit, frozen timeline alongside each chapter's outline.

**Task:**

Define a `TimelineState` object in `agent9-prose.ts` that is populated once (from the CML) and injected into every chapter's user message:

```typescript
interface TimelineState {
  timeOfDeath: string;          // e.g. "10:30 PM"
  clockFaceTime: string;        // "ten minutes past eleven"
  clockWindback: string;        // "forty minutes"
  suspectWindowStart: string;   // "9:00 PM"
  suspectWindowEnd: string;     // "10:30 PM"
}

function buildTimelineStateBlock(state: TimelineState): string {
  return [
    `ESTABLISHED TIMELINE (do not contradict):`,
    `- Time of death: ${state.timeOfDeath}`,
    `- Clock face reads: "${state.clockFaceTime}" (tampered — wound back "${state.clockWindback}")`,
    `- Suspect alibi window: ${state.suspectWindowStart} to ${state.suspectWindowEnd}`,
  ].join('\n');
}
```

Inject the block into every chapter's user message (Message 2) immediately before the outline JSON.

**Verification:** Confirm the timeline block appears in all 20 chapter prompts in the logged output. Run the temporal continuity validator against a test generation to confirm zero contradictions.

**Files:** `packages/prompts-llm/src/agent9-prose.ts`

---

## Recommended Fix Plan (Refined)

The following supersedes the earlier phased plan with a priority-ordered, implementation-ready sequence. The central principle is: **move exact obligations into a short, chapter-local contract and add cross-chapter controls outside the model.** This is not primarily a prompt-text problem; it is a prompt-structure problem.

### Priority Order

Implement in this order to attack actual release blockers first:

1. Per-chapter obligation block
2. Positive locked-fact phrasing (contract wording everywhere)
3. Timeline state block (frozen, per chapter)
4. Exclusive season allow-list (global + local)
5. Discriminating-test chapter obligation
6. Cross-chapter repetition detection + banned phrases for pass 2
7. Targeted AtmosphereRepair step
8. Stronger UnderflowExpansion
9. Self-audit field (optional support layer)

---

### Fix 1 — Per-Chapter Obligation Block (highest priority)

**The most important structural fix.**

Right now the model receives a large static rulebook, then a chapter outline. Chapter-local obligations are buried in the system preamble. By the time the model writes prose, those obligations are far from the writing task. Co-location is the fix.

**System prompt keeps:** global style, cast, era, safety rules.

**Per-chapter user block injects immediately before the outline:**
- locked fact exact phrases (only the ones relevant to this chapter)
- required clue markers
- location anchor
- discriminating-test obligation (if applicable to this chapter)
- suspect-clearance obligation (if applicable)
- exclusive season vocabulary
- timeline state

**Implementation:** New `buildChapterObligationBlock(scene, cml, narrativeState)` function in `agent9-prose.ts`. Returns a deterministic markdown block. Called once per chapter and prepended to the outline JSON in Message 2.

**Example output:**

```
VALIDATION TARGETS FOR THIS CHAPTER:
- Required clue: [[CLUE_ID:clue_3]]
- Required locked fact phrase: "ten minutes past eleven"
- Required locked fact phrase: "forty minutes"
- Location anchor: "the study of the Hewitt residence"
- Season vocabulary allowed: autumn, autumnal, fall
- Discriminating test required: no
- Suspect clearance required: none
```

Only include rows that are non-null for this chapter. A chapter with no clues, no clearance, and no discriminating test emits only the locked facts, anchor, and season rule.

**Files:** `packages/prompts-llm/src/agent9-prose.ts`

---

### Fix 2 — Positive Locked-Fact Phrasing

**Replace all negative/constraint wording with conditional positive obligations.**

Pattern to use everywhere the validator expects exact compliance:

| Replace | With |
|---------|------|
| "Do not contradict the locked fact 'ten minutes past eleven'" | "If this chapter mentions the stopped clock, write exactly: 'ten minutes past eleven'" |
| "⛔ LOCKED FACTS — DO NOT CONTRADICT" | "NON-NEGOTIABLE CHAPTER OBLIGATIONS" |
| "No season word contradicts November" | "Forbidden seasonal words: winter, spring, summer" |
| "Preserve the discriminating test as specified" | explicit scene-beat contract (see Fix 5) |

Apply this pattern in the system message builder and in every per-chapter block. "Do not contradict" gives the model a paraphrase license. "Write exactly" does not.

**Files:** `packages/prompts-llm/src/agent9-prose.ts` — system message builder; `buildChapterObligationBlock`

---

### Fix 3 — Frozen Timeline State Block

**Every chapter must see the same immutable timeline.**

Independent chapter generation without a shared timeline anchor produces contradictory event times across the 20-chapter story. The locked facts must also be linked explicitly to their required output phrases.

**Block to inject per chapter:**

```
ESTABLISHED TIMELINE (DO NOT ALTER):
- Confirmed time of death: 10:30 PM
- Stopped clock face: "ten minutes past eleven"
- Clock was wound back: "forty minutes"
- Suspect alibi window: 9:00 PM to 10:30 PM
- If this chapter references these facts, use the exact phrases above.
```

The final line (`If this chapter references these facts, use the exact phrases above`) matters: it ties the timeline state to output wording, not just semantic knowledge.

**Implementation:** `buildTimelineStateBlock(state: TimelineState): string` — injected into every chapter's Message 2 alongside the obligation block.

**Files:** `packages/prompts-llm/src/agent9-prose.ts`

---

### Fix 4 — Exclusive Season Allow-List

**This is a hard-stop failure. Justified duplication: add this in both the system prompt and the per-chapter obligation block.**

**System message (global):**

```
SEASONAL LANGUAGE FOR THIS STORY:
Allowed seasonal words: autumn, autumnal, fall.
Forbidden seasonal words: winter, spring, summer.
Do not use forbidden seasonal words even metaphorically.
```

**Per-chapter obligation block (local, as a row in VALIDATION TARGETS):**

```
- Season vocabulary allowed: autumn, autumnal, fall
```

The redundancy is intentional — month/season contradiction is a hard stop. Two exposures during generation are better than one.

Remove the current negatively-framed check from Message 3 pre-checklist and replace it with the allow-list wording if the pre-checklist is retained.

**Files:** `packages/prompts-llm/src/agent9-prose.ts` — system message temporal block; `buildChapterObligationBlock`

---

### Fix 5 — Discriminating-Test Chapter Obligation

**Inject the discriminating test as a mandatory scene contract into the specific chapter where it must occur.**

The test must not live only in the CML snapshot. It needs to be co-located with the chapter prompt that is responsible for executing it.

**Block to inject only in the discriminating-test chapter:**

```
DISCRIMINATING TEST — REQUIRED IN THIS CHAPTER:
Julie Ashby confronts Nicholas Hewitt with evidence of clock tampering.
The scene must show:
- Julie states the clock was tampered with
- Nicholas is asked to explain his whereabouts
- Nicholas gives an inconsistent or visibly nervous response
- This moment functions as the trap that reveals guilt
Do not imply this vaguely. Render it as a concrete scene beat.
```

**Implementation:** `buildChapterObligationBlock` checks whether the current scene number matches the CML's `discriminatingTest` scene. If yes, appends the full scene-beat contract. This is deterministic — no model inference required.

**Files:** `packages/prompts-llm/src/agent9-prose.ts` — `buildChapterObligationBlock`

---

### Fix 6 — Cross-Chapter Repetition Detection + Pass-2 Banned Phrases

**This must be handled as a pipeline feature, not just a prompt feature.** The model cannot avoid repeating phrases across chapters it cannot see. The fix belongs in the orchestration layer.

**Implementation (two layers):**

**Layer A — post-pass phrase detection:**

After all chapters in a pass are generated, run phrase-frequency detection across the full chapter set. Do not use a raw sliding-character window — that produces noisy fragments. Use this approach instead:

1. Split each chapter's paragraphs into normalized 5–12 word n-grams
2. Count n-gram frequency across all chapters
3. Also detect high-similarity sentence openings and repeated sensory phrases
4. Collect the top offenders as human-readable phrases

```typescript
function detectRecurringPhrases(chapters: Chapter[]): string[] {
  // n-gram based detection: 5–12 words, frequency >= 3 chapters
  // return clean, human-readable phrases (not character fragments)
}
```

**Layer B — banned-phrase injection into pass 2:**

Feed the detected phrases as a `BANNED PHRASES` block in the pass 2 system message:

```
BANNED PHRASES ALREADY USED IN THIS STORY:
- "the scent of aged paper and leather"
- "candles flickered against the dark paneling"
- "the hush of the room seemed to listen"
Do not reuse these phrases or near-paraphrases.
```

This is more effective than the abstract ANTI-REPETITION rule because it names exactly what to avoid.

**Files:** `packages/prompts-llm/src/agent9-prose.ts` — new `detectRecurringPhrases(chapters)` function; `buildProseSystemMessage` to accept optional `bannedPhrases: string[]`

---

### Fix 7 — Targeted AtmosphereRepair Step

**Run only when repetition detection finds specific offenders. Repair only affected chapters, not the full story.**

When Fix 6 detects phrases that exceed the repetition threshold before the release gate runs, trigger `AtmosphereRepair` on the offending chapters only.

**Repair prompt shape:**

```
Task: Rewrite only the atmospheric phrasing in the listed paragraphs.
Do not change plot, clues, names, timeline, or dialogue logic.
Replace these repeated phrases with fresh alternatives:
- "the scent of aged paper and leather"
- "candles flickered against the walls"
Return corrected JSON only.
```

This is safer than regenerating entire chapters. The chapter logic, clues, and timeline remain intact; only the atmospheric wording is replaced.

**Trigger condition:** One or more phrases detected by Fix 6 appear in ≥3 chapters and the pass has completed. Run before release gate evaluation, not after.

**Files:** `packages/prompts-llm/src/agent9-prose.ts` — new `buildAtmosphereRepairPrompt(offendingChapters, bannedPhrases)` function; `runAtmosphereRepairIfNeeded(chapters)` orchestration step

---

### Fix 8 — Strengthen UnderflowExpansion

**The real problem is not that the first draft is under 700 words; it is that the expansion target is too close to the floor.** Do not make 700 words a universal hard minimum — it may distort shorter chapters. Instead, shift the expansion target above the preferred threshold.

**Updated word count instruction:**

```
WORD COUNT:
- Preferred target: 1600 words
- Safe expansion target: 1800 words
- If expanding, add concrete action, dialogue, observation, and evidence-linked beats
- Do not stop at the first threshold crossing; overshoot safely
- Never pad with summary or repeated atmosphere
```

**Also update the UnderflowExpansion prompt** to use the same overshoot language and explicitly forbid atmospheric padding.

**Files:** `packages/prompts-llm/src/agent9-prose.ts` — `buildProsePrompt` word count block; UnderflowExpansion prompt

---

### Fix 9 — Self-Audit Field (Optional Support Layer)

**Use as a secondary forcing device and debug tool. Do not rely on it in place of Fixes 1–5.**

Models can hallucinate audit compliance. The self-audit field is most useful for:
- Development debugging: seeing which obligations the model believed it satisfied
- Internal scoring: comparing audit claims against validator results
- Prompt iteration: identifying which obligations are systematically under-reported

**Implementation:**
- Extend prose output schema with an optional `audit` object (schema already in earlier phases)
- Strip before storage: `function stripAuditField(parsed): ProseOutput`
- Do not gate on audit content — use validator results as ground truth

**Files:** `packages/prompts-llm/src/agent9-prose.ts`

---

### Refined Per-Chapter Prompt Pattern

This is the target structure for the per-chapter user message (Message 2), incorporating all nine fixes:

```
Write one chapter of a Golden Age whodunnit novel.

This chapter must satisfy the following validation obligations exactly.

VALIDATION TARGETS FOR THIS CHAPTER:
- Required clue: [[CLUE_ID:clue_3]]
- Required locked fact phrase: "ten minutes past eleven"
- Required locked fact phrase: "forty minutes"
- Location anchor: "the study of the Hewitt residence"
- Discriminating test required: no
- Suspect clearance required: none

ESTABLISHED TIMELINE (DO NOT ALTER):
- Confirmed time of death: 10:30 PM
- Stopped clock face: "ten minutes past eleven"
- Clock was wound back: "forty minutes"
- Suspect alibi window: 9:00 PM to 10:30 PM
- If this chapter references these facts, use the exact phrases above.

SEASONAL LANGUAGE FOR THIS STORY:
- Allowed: autumn, autumnal, fall
- Forbidden: winter, spring, summer

NON-NEGOTIABLE RULES:
1. If the chapter mentions the stopped clock, write exactly: "ten minutes past eleven"
2. If the chapter mentions how the clock was altered, write exactly: "forty minutes"
3. Do not paraphrase required locked-fact phrases
4. First paragraph must include:
   - the location anchor
   - at least 2 sensory cues
   - at least 1 time/weather word
5. Do not introduce named characters outside the cast

WORD COUNT:
- Preferred target: 1600 words
- Safe expansion target: 1800 words
- Overshoot rather than undershoot

IMMUTABLE CAST:
- William Latimer = he/him/his
- Nicholas Hewitt = he/him/his
- Constance Cromer = she/her/her
- Julie Ashby = she/her/her
- Kenneth Ringwood = he/him/his

OUTPUT:
- Return valid JSON only
- Include an optional audit field reporting which obligations were satisfied

Outline:
[CHAPTER OUTLINE JSON]
```

---

### Summary

| Fix | Release blocker addressed | Files |
|-----|--------------------------|-------|
| 1. Per-chapter obligation block | All three hard stops (structural root) | `agent9-prose.ts` |
| 2. Positive locked-fact phrasing | Temporal contradiction; locked-fact paraphrase | `agent9-prose.ts` |
| 3. Frozen timeline state block | Temporal contradiction | `agent9-prose.ts` |
| 4. Exclusive season allow-list | Month/season hard stop | `agent9-prose.ts` |
| 5. Discriminating-test chapter obligation | No valid discriminating-test scene (warning) | `agent9-prose.ts` |
| 6. Cross-chapter repetition detection | Templated prose hard stop | `agent9-prose.ts` |
| 7. Targeted AtmosphereRepair | Templated prose hard stop (repair) | `agent9-prose.ts` |
| 8. Stronger UnderflowExpansion | Underflow loops (Ch16 pattern) | `agent9-prose.ts` |
| 9. Self-audit field | Debug/scoring support only | `agent9-prose.ts` |

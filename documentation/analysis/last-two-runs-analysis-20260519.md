# Last Two Canary Runs — Failure Analysis
**Date:** 19 May 2026  
**Runs analysed:** story_20260519-2028 (mystery-1779218398660) and story_20260519-2114 (mystery-1779221009725)

---

## Run Summary

| | Run A (2028) | Run B (2114) |
|---|---|---|
| Run ID | mystery-1779218398660 | mystery-1779221009725 |
| Exit code | **1 (FAILED)** | 0 (passed pipeline) |
| Chapters generated | **9 of 10** | 10 of 10 |
| Retry batches | 4 | 6 |
| ChatGPT score | **50 / 100** | **57 / 100** |
| Story complete? | **No — Chapter 10 absent** | Structurally yes, qualitatively no |

Neither story finished in a meaningful sense. Run A aborted before Chapter 10 could be committed. Run B passed all pipeline gates but produced a deeply inconsistent story that a human reader cannot follow.

---

## Run A — story_20260519-2028

### What happened

The pipeline generated chapters 1–9, then exhausted all 6 retry attempts on the final chapter. The story file was written with whatever prose had been committed, stopping at Chapter 9 ("The Culprit Revealed"). Chapter 10 never appeared.

The session log indicates the critical trigger was **4 missing clue obligations in the prose** that could not be satisfied within the retry budget. Each attempt repaired one problem (pronoun drift, repeated sentence, n-gram overlap) but reintroduced the clue failures, so the constraints oscillated without converging.

### Story quality issues (ChatGPT review: 50/100)

**Character identity — critical**
- Eleanor Voss is simultaneously the victim and a live character who speaks, gestures, and offers theories across all 9 chapters. The story never resolves this contradiction.
- Example (Chapter 9): Eleanor stands in the study anxiously awaiting Dr. Finch, while the investigation is nominally about Eleanor's death.

**Clock time inconsistency — critical**
- The clock is said to show "ten minutes past eleven" in Chapters 1, 3, 4, 5, 6, and 9.
- The same clock shows "a quarter after eleven" in Chapter 1 (later paragraph) and Chapter 7.
- The discriminating test chapter (7) states the clock was "wound back forty minutes," but then says the true time of death is "ten minutes past eleven, not when the clock indicated" — even though the clock also indicated ten minutes past eleven.

**Pronoun drift — major**
- Captain Ivor Hale (male) is referred to as "she" and "her" in Chapters 4 and 8. The drift is persistent across chapters, not isolated slips.

**Structural repetition — major**
- Chapters 4, 5, and 6 each re-stage the same interrogation: Beatrice questions Dr. Finch about her parlor alibi and her departure time, gets the same vague "just after ten" answer, and reaches no new conclusion.
- Chapter 5 is nearly a paragraph-for-paragraph duplicate of Chapter 4.

**Generated location boilerplate — moderate**
- Multiple chapter openings contain verbatim location-profile template sentences. Examples:
  - "The Library in Little Middleton, England held a tense weight to it; pages turning in the stillness…"
  - "Entering The Formal Gardens in Little Middleton, England, birds chirping in the trees was the first thing one noticed…"
  - These appear even in chapters set in the study, often listing two or three wrong rooms before the scene starts.

**Report-like embedded notes — moderate**
- "The time was recorded as a ten minutes past eleven."
- "The clock's display could be inaccurate due to tampering."
- These read as notes from Agent 7's planning output that were never transformed into prose.

**Truncated ending — structural**
- Final committed sentence: "Voss was thoroughly cleared by the evidence; the alibi confirmed they could not have committed the crime." This is a summary bullet point, not a story ending.

---

## Run B — story_20260519-2114

### What happened

All 10 chapters were generated (6 batches required retry). The pipeline returned exit code 0. However, the story is broken at a fundamental level: the murder victim (Dr. Mallory Finch) is alive, speaking, and conducting investigation throughout the story, while simultaneously being dead. The qualitative failure is as severe as Run A's structural failure.

### Story quality issues (ChatGPT review: 57/100)

**Victim alive/dead confusion — critical**
- Dr. Finch is established as the murder victim, but she appears as a live character in Chapters 1, 2, 3, 5, 6, and 7 — speaking dialogue, reacting to clues, and discussing the investigation.
- Example (Chapter 6): Eleanor summons Dr. Finch to examine the dust patterns on the clock. Dr. Finch is supposed to be dead at this point.
- Chapter 10 contains the line: "Dr. Finch's alibi was confirmed because she was found dead." This is logically incoherent — a victim does not need an alibi.

**Pronoun drift for Eleanor — critical**
- Eleanor Voss (female) is referred to as "he," "him," and "his" in Chapters 2, 3, 4, 5, 7, and 8.
- Selected examples:
  - Ch. 2: "he declared, his voice steady"
  - Ch. 4: "he said, his voice steady but laced with urgency"; "he countered"; "he urged"
  - Ch. 8: "As he prepared to question him further…"
- This is the dominant prose quality failure and makes the story confusing to read.

**Hallucinated character — major**
- "Dr. Sparrow" appears in Chapters 4 and 8 in sentences like "Witnesses claim to have seen Dr. Sparrow chirping well past the declared hour of death."
- This character does not exist in the CML schema. The name (and "chirping") look like a generation artefact where a bird was confused with a character name.

**Clock state contradiction — moderate**
- The clock is described as ticking ("each tick of the clock") in several chapters, while also being "frozen at 10:11" / "stopped." The story cannot decide whether it is running or stopped.
- Clock time again oscillates: most chapters say 11:10, but Chapter 9 reverts to "a quarter past eleven."

**Structural repetition — moderate**
- Chapters 4, 7, and 8 all stage the same confrontation between Eleanor and Captain Hale: clock evidence, garden alibi, the note, Dr. Sparrow/Finch witness claim. Chapter 8 is described by the ChatGPT reviewer as "almost a repeat of Chapter 7."
- Chapter 4 opens with the Servants' Hall location block duplicated verbatim on consecutive lines, then shifts to Drawing Room, then Library — three rooms before the scene begins.

**Report-like embedded notes — moderate**
- "The time was recorded as a ten minutes past eleven." (appears in multiple chapters)
- "The interval — the exact amount the clock was wound back — came to forty minutes." (Chapter 3, reads like a planning note)

**Captain Hale pronoun instability — minor**
- Hale shifts between "he/him/his" and "she/her" within single chapters. In Chapter 8 the shift happens within the same paragraph.

**Confession logic broken — moderate**
- Chapter 10: Hale confesses but says "I never meant for it to lead to his death." The victim is Dr. Finch, who is female. The referred pronoun is wrong, and the sentence also implies the culprit may not have intended murder, which contradicts the clock-tampering mechanism.

---

## Common Failure Patterns Across Both Runs

These issues appeared in both runs and point to systemic root causes rather than stochastic variation:

### 1. Pronoun drift (BOTH runs)
All female characters — Eleanor (victim/investigator), Beatrice (detective), Dr. Finch — acquire male pronouns in narration. This persists across chapters and through retries. BUG-5 improved retry *feedback* for pronoun drift, but the base generation still produces drift at high frequency. The `buildPronounAccuracyBlock` content may not be assertive enough in the initial generation prompt.

### 2. Victim/alive confusion (BOTH runs)
The murder victim appears alive and speaks in the same chapter that references their death. This is the most severe reader-facing failure. The prose prompt does not appear to have a hard gate that prevents the victim's name from appearing as a subject of active verbs (spoke, said, entered, examined, etc.) after their death is established.

### 3. Clock time oscillation (BOTH runs)
The clock's stated time drifts between "ten minutes past eleven" and "a quarter past eleven" across chapters. This is an anchor fact that should be locked from Chapter 1 and enforced in `buildContinuityContext`. The oscillation suggests the continuity context is either missing this anchor or the LLM is regenerating it from the scenario description rather than reading it from context.

### 4. Location boilerplate paste (BOTH runs)
Chapter openings contain verbatim location-profile template content — often naming 2–3 rooms that are irrelevant to the scene. This is context leakage: the location profiles block is being reproduced literally rather than used as background for original description.

### 5. Repeated interrogation loops (BOTH runs)
Both stories have 3+ chapters that stage an interrogation of the same suspect with the same questions and the same non-answer. This suggests the chapter obligation scheduler is assigning overlapping tasks to adjacent chapters without requiring differentiation.

### 6. Embedded plan/note sentences (BOTH runs)
Sentences like "The time was recorded as a ten minutes past eleven" and "The mechanism relies on the clock's timing to expose the false timing" read as planning notes from Agent 7 that survived into the final prose unchanged. The prose linter should be flagging these patterns.

---

## Pipeline Failure Note — Most Recent Run

The most recent run (canary-core-last.log, the run killed in this session) failed at **Agent 5**, not at prose generation. The error was:

> `Pipeline failure: Agent 5 strict step coverage gate failed with 1 critical issue(s).`

The specific issue: the discriminating test referenced clue IDs (`clue_1`, `clue_2`) that were absent from the inference chain. This is an upstream failure — no prose was ever generated for this run. The failure mode is separate from the two story-quality issues above.

Warnings from that run also noted:
- 2 red herrings overlapping true-solution inference signals
- Inference step 1 had no contradiction clue
- Agent 5 required a targeted ID-contract retry but the gap could not be resolved

---

## Root Cause Summary

| Issue | Likely root cause | Affected agent |
|---|---|---|
| Victim appearing alive | No hard constraint preventing victim name as active verb subject | Agent 9 (prose) |
| Pronoun drift in base generation | `buildPronounAccuracyBlock` not assertive enough in system prompt | Agent 9 |
| Clock time oscillation | Continuity anchor not locked in `buildContinuityContext` | Agent 9 |
| Location boilerplate paste | Location profiles block copied literally into prose | Agent 9 |
| Repeated interrogation chapters | Chapter obligation scheduler allows duplicate chapter tasks | Agent 7 |
| Embedded note sentences | Note-like phrasing not caught by `lintBatchProse` | Agent 9 linter |
| Missing Chapter 10 (Run A) | Clue obligation overload — 4 unresolvable clues assigned to final chapter | Agent 7 / Agent 9 retry budget |
| Agent 5 inference gap (latest run) | Discriminating test references clue IDs not present in coverage map | Agent 5 |

---

## Recommended Next Fixes (Priority Order)

1. **Victim alive/dead hard gate** — In `buildProseRequirements` or `lintBatchProse`, add a check that rejects any chapter where the victim's name appears as the grammatical subject of a speaking or action verb. This is the single most destructive reader-facing failure.

2. **Lock clock time anchor** — In `buildContinuityContext`, extract the clock time from Chapter 1 prose and propagate it as a locked constant ("The clock showed `X` — do not vary this value") into all subsequent chapter prompts.

3. **Pronoun enforcement in base prompt** — Add an explicit, bolded pronoun reference table directly in the `buildPronounAccuracyBlock` output (e.g., `Eleanor Voss → she/her/her`) and add a pre-generation instruction: "Verify every pronoun against this table before finalising each paragraph." Do not rely on retry feedback alone.

4. **Location boilerplate detection** — Extend the `context_leakage_suspected` linter check (which already exists in the validation pipeline) to reject chapters that open with the location-profile template structure, and force a retry with a directive to write an original opening sentence.

5. **Chapter obligation deduplication** — In `buildChapterObligationBlock`, prevent the same clue interrogation task from appearing in more than two consecutive chapters. If a task recurs, mark it as "resolved: prior chapter" and assign a differentiated obligation.

6. **Agent 5 clue ID contract robustness** — The discriminating test clue IDs must be validated against the inference coverage map before Agent 5 commits. If the IDs are missing, the targeted retry should regenerate the discriminating test itself, not just the clues.

# Review Error → Sub-Agent Map

> Derived from `chatgpt-review.txt` files in:
> - `stories/_archive/story_20260520-2018/` (score 60/100)
> - `stories/_archive/story_20260520-2339/` (score 48/100)
>
> Purpose: map each recurring review error to the sub-agent(s) responsible so fixes
> can be targeted at the right stage of the pipeline.

---

## Quick-reference table

| # | Error | Both stories? | Primary agent | Secondary agent |
|---|-------|:---:|---|---|
| E1 | Pronoun drift on named characters (she→he, he→her) | ✅ | Agent 9 | — |
| E2 | Ledger/arithmetic exposition ("interval came to forty minutes") | ✅ | Agent 9 | — |
| E3 | Template boilerplate / atmosphere preamble lines | ✅ | Agent 9 | — |
| E4 | Repeated chapter beats — same confrontation replayed | ✅ | Agent 9 | Agent 7 |
| E5 | Mystery mechanism stated bluntly in Ch 1 (no discovery) | ✅ | Agent 9 | Agent 7 |
| E6 | Discriminating-test chapter has no new observable fact | ✅ | Agent 9 | — |
| E7 | Evidence access chain incomplete at reveal | ✅ | Agent 9 | Agent 5 |
| E8 | Culprit motive never stated explicitly | ✅ | Agent 9 | Agent 7 |
| E9 | Victim given alibi analysis (victim has no alibi) | ✅ | Agent 9 | Chapter Validator |
| E10 | Culprit alibi contradicts itself across chapters | ✅ | Agent 9 | Agent 7 |
| E11 | Timeline / distance math inconsistent | ✅ | Agent 9 | Agent 7 |
| E12 | Character name inconsistency (surname vs. forename) | ✅ | Agent 2 | Agent 9 |
| E13 | Character role contradiction (victim also culprit) | story_2339 | Agent 2 | Agent 7 |
| E14 | Investigator / victim identity confusion (Dr. Finch / Mallory) | story_2339 | Agent 2 | — |
| E15 | Supporting characters unnamed ("the neighbor") | story_2339 | Agent 7 | Agent 9 |
| E16 | Wrong clock used as central evidence (bar clock vs. study clock) | story_2339 | Agent 9 | Agent 5 |

---

## Per-agent breakdown

### Agent 2 — Cast Design

Responsible for: generating the cast (names, roles, gender, relationships).

| Error | Evidence from reviews |
|---|---|
| E12 — Name inconsistency | story_2018: "Captain Hale" vs. "he" — Hale referred to inconsistently. story_2339: "Dr. Finch" and "Mallory" used interchangeably, not introduced as "Dr. Mallory Finch." |
| E13 — Role contradiction | story_2339: Beatrice Quill is introduced as the victim (Ch 1: "Beatrice lay lifeless") but accused as culprit in Ch 9. A victim cannot be a culprit unless the death is staged — and no such reveal is set up. |
| E14 — Investigator identity confusion | story_2339: The investigator is called "Dr. Finch" early, then "Mallory," with no canonical full-name introduction. |

**Root cause:** Agent 2 emits a cast record but does not enforce a canonical `full_name` field that every downstream agent must use verbatim. Role labels (victim / investigator / culprit / false suspect) must be locked before Agent 7 or Agent 9 can reference them.

**Affected code:** `agent2-cast.ts`, cast schema in `@cml/cml`.

---

### Agent 5 — Clue Distribution

Responsible for: assigning clues to specific scenes/chapters, setting delivery method and placement timing.

| Error | Evidence from reviews |
|---|---|
| E7 — Access chain incomplete | story_2018: The sleeping-draught bottle is planted in Ch 3, but no chapter establishes who had access to the draught or that Hale knew about it. The chain "draught exists → Hale accessed it → drugged Finch" is never closed. story_2339: Fingerprints on the clock casing are mentioned in Ch 8 but never attributed to the culprit. |
| E16 — Wrong object becomes evidence | story_2339: The bar clock's stopping is treated as equivalent to the study clock tampering, diluting the central clue. |

**Root cause:** Agent 5 distributes clue IDs to chapters, but does not verify that the full logical chain (existence → access → opportunity → conclusion) is covered across the chapter assignments. Each clue entry needs a `requires_access_established_by` back-link.

**Affected code:** `agent5-clues.ts`, `agent9-prose/clue-validation.ts`.

---

### Agent 7 — Narrative Outline

Responsible for: chapter-level scene planning, arc position, character placement per chapter.

| Error | Evidence from reviews |
|---|---|
| E4 — Repeated beats | story_2018: Chapters 4, 6, and 7 all feature Eleanor confronting Hale about the clock alibi with no new information. Agent 7 is assigning the same scene type to three consecutive chapters. |
| E5 — Mechanism stated in Ch 1 | story_2018: The outline places "clock reveal" at Ch 1 (opening arc), which forces Agent 9 to state the mechanism immediately. The reveal should be staged across the clue-stage arc. |
| E8 — Motive absent | story_2018 and story_2339: The culprit's motive is not in the outline's solution block, so Agent 9 has nothing to draw on. The `solution.motive` field in the CML schema is either absent or too vague. |
| E10 — Alibi contradiction | story_2018: Agent 7 places Hale at the Library in the Ch 4 scene and at the tavern in the Ch 5 scene without flagging the contradiction. |
| E11 — Timeline math | story_2018: Clock strikes eleven as Beatrice and Eleanor leave the tavern, they return at 11:10. The distance between tavern and manor is never set in the outline. |
| E15 — Unnamed supporting characters | story_2339: The neighbor witness has no name in the outline, so Agent 9 writes "the neighbor." |

**Root cause:** Agent 7 produces a chapter outline but does not cross-check (a) scene-type uniqueness across the arc window, (b) character location consistency, (c) that `solution.motive` is non-empty, or (d) that witness characters in the cast list are named.

**Affected code:** `agent7-narrative.ts`, narrative outline schema.

---

### Agent 9 — Prose Generation

Responsible for: writing the actual chapter text from outline + obligations.

This agent owns the majority of errors because it is the final writing stage — problems upstream propagate here, and Agent 9 also introduces its own generation errors.

#### E1 — Pronoun drift
**Evidence:** story_2018: Eleanor → "he" in Ch 2, 4, 6, 7. Hale → "her" in Ch 2, 6. story_2339: Mallory → "him/his/he" throughout. Eleanor → "his words trailed off."

**Where in Agent 9:** `agent9-prose/prompt-blocks.ts → buildPronounAccuracyBlock`, `agent9-prose/obligation-block.ts`.

The pronoun accuracy block exists (Phase 1, ANALYSIS_16) but errors persist — likely the block is being dropped by token budgeting or the model is ignoring it after many chapters.

---

#### E2 — Ledger/arithmetic exposition
**Evidence:** Both stories produce lines such as "The interval… came to forty minutes," "The time was recorded as ten minutes past eleven," "twenty degrees Fahrenheit."

**Where in Agent 9:** `agent9-prose/lint.ts → lintBatchProse`, `agent9-prose/prompt-builder.ts → buildProseRequirements`.

Needs a lint rule that matches `[number] (minutes|degrees|interval|recorded as)` in prose text and flags/retries.

---

#### E3 — Template boilerplate
**Evidence:** Both stories have atmosphere preamble phrases ("The rain fell," "The study was still") that read as generated filler.

**Where in Agent 9:** `agent9-prose/lint.ts → lintBatchProse` (template_bleed lint already exists — may need forbidden-phrase list extension).

---

#### E4 — Repeated beats
**Evidence:** story_2018 Chs 4, 6, 7 replay the Hale clock alibi confrontation. story_2339 repeats the scratch-on-winding-key clue three times nearly verbatim.

**Where in Agent 9:** `agent9-prose/phrase-analysis.ts → extractBeatFingerprints`, `detectRecurringPhrases`, `agent9-prose/prompt-builder.ts → buildNSDBlock`.

The beat-fingerprinting system exists. It may not be blocking repeats aggressively enough, or the retry feedback is not forcing a different scene type.

---

#### E5 — Mechanism stated in Ch 1
**Evidence:** Both stories explain the clock tampering mechanism explicitly in the opening chapter instead of letting Eleanor/Mallory discover it gradually.

**Where in Agent 9:** `agent9-prose/prompt-builder.ts → buildProseRequirements`, `agent9-prose/clue-validation.ts → buildChapterRequirementLedger`.

A clue-stage embargo (see FIX-M3 in review-analysis-20260520-story2018.md) should prevent explicit mechanism statements before Stage 4 chapters.

---

#### E6 — Discriminating-test chapter has no new fact
**Evidence:** Both stories label a chapter "The Discriminating Test" but the content is another interrogation of the same suspect with no new physical or testimonial evidence.

**Where in Agent 9:** `agent9-prose/discriminating.ts → buildDiscriminatingTestChecklist`.

The checklist builder exists but apparently the model is not following its output. The retry validator should check that at least one `supporting_clues[]` term appears for the first time in the DT chapter.

---

#### E7 — Access chain incomplete (Agent 9 side)
**Evidence:** story_2018: sleeping draught → Hale access path not established. story_2339: fingerprints never attributed.

**Where in Agent 9:** `agent9-prose/clue-validation.ts → buildChapterRequirementLedger`, `agent9-prose/obligation-block.ts → buildChapterObligationBlock`.

Each clue's obligation block should carry the chain segments (existence / access / opportunity / conclusion) and mark which are still outstanding.

---

#### E8 — Motive absent (Agent 9 side)
**Evidence:** Motive is absent from the confession chapter in both stories.

**Where in Agent 9:** `agent9-prose/prompt-builder.ts → buildProseRequirements` for the reveal chapter — needs a hard requirement: "State [culprit]'s motive in one sentence."

---

#### E9 — Victim alibi gate
**Evidence:** story_2018 Ch 9: "Dr. Finch's alibi holds because she was found dead."

**Where in Agent 9 / Validator:** `agent9-prose/lint.ts → lintBatchProse` (new lint rule: flag `[victim_name]` + alibi-verb). Also `@cml/story-validation → ChapterValidator`.

---

#### E10 — Alibi consistency (Agent 9 side)
**Evidence:** Hale placed at Library (Ch 4) and tavern (Ch 5) without resolution.

**Where in Agent 9:** `agent9-prose/obligation-block.ts` — the culprit's canonical alibi location from `solution.opportunity.location` should be locked and injected into every chapter that mentions the culprit.

---

#### E11 — Timeline math (Agent 9 side)
**Evidence:** story_2018: 11:00 clock strike at tavern, return at 11:10, body discovered — distances not set.

**Where in Agent 9:** `agent9-prose/prompt-builder.ts → buildTimelineStateBlock` — the timeline block should carry locked timestamps for the crime window.

---

### Chapter Validator — `@cml/story-validation`

Post-generation gate applied after prose is written.

| Error | Validator rule needed |
|---|---|
| E9 — Victim alibi | Rule: `victim_alibi_error` — any sentence attributing an alibi to the victim name. |
| E1 — Pronoun drift | Rule: cross-chapter pronoun consistency check (already partially exists via `CharacterConsistencyValidator`). |
| E4 — Repeated beats | Rule: flag if current chapter's beat fingerprint matches any of the prior 3 chapters above the Jaccard threshold. |
| E6 — DT chapter empty | Rule: DT-tagged chapter must contain at least one `supporting_clues[]` term not seen in the previous two chapters. |

**Affected code:** `packages/cml/src/chapter-validator.ts` (or equivalent in `@cml/story-validation`).

---

## Issue frequency summary

| Sub-agent | Errors owned | Errors shared |
|---|---|---|
| Agent 9 — Prose Generation | E1, E2, E3, E6, E11 (partial) | E4, E5, E7, E8, E9, E10, E16 |
| Agent 7 — Narrative Outline | — | E4, E5, E8, E10, E11, E15 |
| Agent 2 — Cast Design | E13, E14 | E12 |
| Agent 5 — Clue Distribution | — | E7, E16 |
| Chapter Validator | — | E1, E4, E6, E9 |

Agent 9 is the dominant failure surface. However, E13 (victim = culprit) is a pure Agent 2 failure that no amount of Agent 9 improvement can fix — the cast must be correct before prose generation begins.

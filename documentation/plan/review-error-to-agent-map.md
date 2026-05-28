# Review Error → Sub-Agent Map

> Derived from `chatgpt-review.txt` files in:
> - `stories/_archive/story_20260520-2018/` (score 60/100)
> - `stories/_archive/story_20260520-2339/` (score 48/100)
>
> Purpose: map each recurring review error to the sub-agent(s) responsible so fixes
> can be targeted at the right stage of the pipeline.

---

## Quick-reference table

| # | Error | Both stories? | Primary agent | Agent 9 file |
|---|-------|:---:|---|---|
| E1 | Pronoun drift on named characters (she→he, he→her) | ✅ | Agent 9 | `prompt-blocks.ts`, `obligation-block.ts` |
| E2 | Ledger/arithmetic exposition ("interval came to forty minutes") | ✅ | Agent 9 | `lint.ts`, `prompt-builder.ts` |
| E3 | Template boilerplate / atmosphere preamble lines | ✅ | Agent 9 | `lint.ts` |
| E4 | Repeated chapter beats — same confrontation replayed | ✅ | Agent 9 + Agent 7 | `phrase-analysis.ts`, `prompt-builder.ts`, `generate.ts` |
| E5 | Mystery mechanism stated bluntly in Ch 1 (no discovery) | ✅ | Agent 9 + Agent 7 | `clue-validation.ts`, `prompt-builder.ts` |
| E6 | Discriminating-test chapter has no new observable fact | ✅ | Agent 9 | `discriminating.ts`, `generate.ts` |
| E7 | Evidence access chain incomplete at reveal | ✅ | Agent 9 + Agent 5 | `clue-validation.ts`, `obligation-block.ts` |
| E8 | Culprit motive never stated explicitly | ✅ | Agent 9 + Agent 7 | `prompt-builder.ts` |
| E9 | Victim given alibi analysis (victim has no alibi) | ✅ | Agent 9 + Validator | `lint.ts` |
| E10 | Culprit alibi contradicts itself across chapters | ✅ | Agent 9 + Agent 7 | `obligation-block.ts` |
| E11 | Timeline / distance math inconsistent | ✅ | Agent 9 + Agent 7 | `prompt-builder.ts` |
| E12 | Character name inconsistency (surname vs. forename) | ✅ | Agent 2 | `prompt-blocks.ts` |
| E13 | Character role contradiction (victim also culprit) | story_2339 | Agent 2 + Agent 7 | — |
| E14 | Investigator / victim identity confusion (Dr. Finch / Mallory) | story_2339 | Agent 2 | — |
| E15 | Supporting characters unnamed ("the neighbor") | story_2339 | Agent 7 | `obligation-block.ts` |
| E16 | Wrong clock used as central evidence (bar clock vs. study clock) | story_2339 | Agent 9 + Agent 5 | `clue-validation.ts` |

---

## Per-agent breakdown

### Agent 2 — Cast Design

Responsible for: generating the cast (names, roles, gender, relationships).

| Error | Evidence from reviews |
|---|---|
| E12 — Name inconsistency | story_2018: "Captain Hale" vs. "he" — inconsistent across chapters. story_2339: "Dr. Finch" and "Mallory" used interchangeably without a canonical introduction. |
| E13 — Role contradiction | story_2339: Beatrice is introduced as the victim ("Beatrice lay lifeless") but accused as culprit in Ch 9. Victim cannot be culprit unless the death is staged — no such reveal is set up. |
| E14 — Investigator identity confusion | story_2339: The investigator is "Dr. Finch" early, then "Mallory," with no canonical introduction. |

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

The section below is organised **by code file** within `packages/prompts-llm/src/agent9-prose/`.

---

#### `clue-validation.ts`
Functions: `buildChapterRequirementLedger`, `getRequiredClueIdsForScene`, token/clue-matching utilities.

| Error | Function | Gap |
|---|---|---|
| E5 — Mechanism stated in Ch 1 | `buildChapterRequirementLedger` | The ledger builds per-chapter clue obligations but carries no `clue_stage` field. Without a stage, Agent 9 is free to state the mechanism in any chapter. Need a stage-1 embargo that forbids mechanism statements in opening chapters. |
| E7 — Access chain incomplete | `buildChapterRequirementLedger` | Each ledger entry lists required clue IDs but not the logical chain segments (existence / access / opportunity / conclusion). Outstanding chain segments are never injected into the prompt, so the model never knows what is still missing. |

---

#### `lint.ts`
Functions: `lintBatchProse`, `normalizeParagraphForFingerprint`, entropy/n-gram checks.

| Error | Function | Gap |
|---|---|---|
| E2 — Ledger/arithmetic exposition | `lintBatchProse` | No rule matches numeric/arithmetic phrasing ("interval came to forty minutes," "recorded as ten minutes past eleven"). Need a regex lint rule: `\b\d+\s*(minutes?|degrees?|interval)\b` flagged as `debug_note_bleed`. |
| E3 — Template boilerplate | `lintBatchProse` | `template_bleed` type exists but the forbidden-phrase list does not cover all atmosphere preambles seen in these stories ("The rain fell," "The study was still"). Extend the list. |
| E9 — Victim alibi gate | `lintBatchProse` | No rule for `[victim_name] + alibi-verb`. Sentence containing the victim's name followed by "alibi," "establish," "account for" should be flagged as `victim_alibi_error`. |

---

#### `obligation-block.ts`
Functions: `buildChapterObligationBlock` — injects clue, NSD, and cast context into every prose prompt.

| Error | Function | Gap |
|---|---|---|
| E1 — Pronoun drift (obligation side) | `buildChapterObligationBlock` | The obligation block does not emit a per-character pronoun table. When the pronoun accuracy block is dropped by token budgeting, there is no fallback pronoun signal in the obligation block itself. Add a compact `PRONOUNS:` line derived from `cast[].gender`. |
| E7 — Access chain (obligation side) | `buildChapterObligationBlock` | Outstanding chain segments (from the ledger gap above) should be injected as explicit obligations: "STILL REQUIRED: establish that [culprit] had access to the sleeping draught." |
| E10 — Alibi contradiction | `buildChapterObligationBlock` | The culprit's canonical alibi location from `solution.opportunity.location` is never locked in the obligation block. Any chapter that mentions the culprit should carry: "CANONICAL ALIBI: [location]. Do not place [culprit] elsewhere." |

---

#### `phrase-analysis.ts`
Functions: `extractBeatFingerprints`, `detectRecurringPhrases`, `formatProvisionalScoringFeedbackBlock`.

| Error | Function | Gap |
|---|---|---|
| E4 — Repeated beats | `extractBeatFingerprints`, `detectRecurringPhrases` | Beat fingerprinting exists but the Jaccard threshold may be too high, allowing near-paraphrase confrontations to pass. story_2018 Chs 4, 6, 7 are structurally identical (Eleanor confronts Hale about clock alibi) yet all committed. Lower threshold or add a scene-type label to fingerprints so that two `interrogation` beats in adjacent chapters are blocked regardless of surface phrasing. |

---

#### `prompt-blocks.ts`
Functions: `buildPronounAccuracyBlock`, `buildCharacterContractsBlock`, `buildFairPlayContractBlock`, `stripLocationParagraphs`.

| Error | Function | Gap |
|---|---|---|
| E1 — Pronoun drift (block side) | `buildPronounAccuracyBlock` | The block is built (Phase 1 / ANALYSIS_16) but is subject to token-budget pruning. Its `priority` is `critical` but it sits at position 0 — investigate whether `applyPromptBudgeting` is dropping it in long chapters. If so, it must be immune to budget pruning. |
| E12 — Name inconsistency (block side) | `buildCharacterContractsBlock` | Character contracts use whatever name is in `cast[].name`. If Agent 2 emits an inconsistent name, the block propagates it. The block should assert the canonical full name once per character ("Always refer to this character as [full_name] — never by forename alone"). |

---

#### `prompt-builder.ts`
Functions: `buildProseRequirements`, `buildNSDBlock`, `buildClueDescriptionBlock`, `buildTimelineStateBlock`, `applyPromptBudgeting`, `buildProsePrompt`.

| Error | Function | Gap |
|---|---|---|
| E2 — Ledger exposition (prompt side) | `buildProseRequirements` | The requirements block should include: "FORBIDDEN: sentences that state times, intervals, or measurements as raw numbers outside dialogue." |
| E4 — Repeated beats (NSD side) | `buildNSDBlock` | NSD block carries the narrative state but the FORBIDDEN REPEATS list may be truncated to 8 recent chapters. If the same confrontation recurs beyond that window, it is no longer blocked. Ensure the scene-type label (not just the text fingerprint) is carried forward indefinitely. |
| E5 — Mechanism stated in Ch 1 | `buildProseRequirements` | For stage-1 chapters, inject: "Do NOT state the tampering mechanism or the timeline arithmetic. Describe only what the character observes." This is the prose-side companion to the ledger-side stage embargo. |
| E8 — Motive absent | `buildProseRequirements` | For the reveal/confession chapter, inject as a hard requirement: "The confession MUST include one sentence naming [culprit]'s motive. It MUST name the act (killed / murdered) not only the cover-up." |
| E11 — Timeline math | `buildTimelineStateBlock` | The timeline state block carries `continuityTail` but not a locked crime-window table (time of death, alibi windows, character locations). Add a `LOCKED TIMELINE` section derived from `solution.timeline` in the CML schema. |

---

#### `discriminating.ts`
Functions: `buildDiscriminatingTestChecklist`, `validateChecklistRequirements`.

| Error | Function | Gap |
|---|---|---|
| E6 — DT chapter has no new fact | `buildDiscriminatingTestChecklist` | The checklist is built and injected, but `validateChecklistRequirements` does not verify at commit time that a new `supporting_clues[]` term first appears in this chapter. Add a post-generation gate: if no clue term appears for the first time in the DT chapter, treat it as a hard fail and retry with explicit instruction to introduce the new physical fact. |

---

#### `generate.ts`
Functions: `generateProse` (orchestrator), `buildEnhancedRetryFeedback`, `buildProvisionalChapterScore`.

| Error | Function | Gap |
|---|---|---|
| E4 — Repeated beats (retry side) | `buildEnhancedRetryFeedback` | When a beat-fingerprint fail fires, the retry feedback tells the model to "rewrite from scratch" but does not force a different scene type. Add a scene-type constraint to the retry message: "The previous attempt was an interrogation scene. The next attempt must NOT be an interrogation. Choose a different scene type (observation / discovery / alibi check / …)." |
| E6 — DT empty (retry side) | `buildEnhancedRetryFeedback` | DT chapter failures are not given their own retry instruction. When the DT checklist post-gate fails, the retry message should name the missing fact explicitly: "This chapter MUST introduce [discriminating_test.method] as a new observable fact." |

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

---

## Code review — what already exists

Before describing fixes, a code review of the actual source files shows that a large portion of the originally proposed work is already implemented. Implementing it again would add a second layer doing the same job.

| Proposed fix | Reality |
|---|---|
| S1 lint-side (arithmetic sentences) | **Already exists** — `lint.ts` `lintBatchProse` has a "debug-note bleed" category that already matches arithmetic/ledger sentences and interval phrasing. |
| S1 schema-side (`reasoning_only` marker) | Does not exist. But Agent 7 Pillar 1 (`lockedFacts`) already injects canonical values as a `CANONICAL LOCKED FACTS — Honour Verbatim` block. The gap is smaller than proposed. |
| S2 `scene_type` enum | **Partially exists** — Agent 7 already tracks action types (R/I/A/C) per scene and has a repeated-I→I→I-on-same-suspect hard rejection rule. Adding a parallel `scene_type` enum creates two systems for the same thing. |
| S2 `new_evidence_id` per scene | Partially exists — DT chapter has `discriminatingTest.evidence_clues` and `discriminating.ts` validates them before injection. Not wired per-scene for non-DT chapters. |
| S2 scene action uniqueness | **Already exists** — Agent 7 has an explicit uniqueness rule in its quality bar. |
| S3 pronoun lock | **Already exists** — Agent 2 emits a `⛔ GENDER ASSIGNMENTS — NON-NEGOTIABLE` block derived from `characterGenders`. This is already in the developer prompt and was explicitly called out as non-negotiable. |
| S4 `VICTIM_ROLE_GATE` | **Already exists** — `lint.ts` FIX-C2 already checks victim name co-occurring with alibi-reasoning verbs and flags as `victim_alibi_error`. |
| S4 hard commit gate (general) | **Already exists** — `validateChapterPreCommitObligations` in `clue-validation.ts` is a hard pre-commit gate. Seven named batch gates (`ALL_BATCH_GATES`) with lifecycle tracking, failure counts, and escalation already exist. |
| B1 murder contract (as new system) | **Already exists as `story-contract.ts`** — explicitly called the "StoryContract Precompiler." Consolidates victim identity (with source provenance), locked facts, sensory atoms, and macro arc plan into an immutable record before `generateProse` is called. |
| B5 dual-track world model | **Partially exists** — `obligation-block.ts` already does victim exclusion, culprit alibi window tracking (FIX-C3), and recently-interrogated-suspects detection from `beatHistory`. `BatchCommitRecord` tracks cumulative clue sets per chapter. Adding a formal dual-track would create a third overlapping system. |

---

## What is genuinely missing

These are the gaps that do not already have an implementation:

### G1 — `mechanism_stage` per scene in Agent 7

**Errors addressed:** E5

Agent 7 has no concept of how much of the crime mechanism may be revealed per scene. A `mechanism_stage: 1–4` field (1 = observable only, 4 = mechanism stated explicitly) added to each `Scene` object, with a monotonic-increase validation rule before Agent 9 runs, would prevent E5 by construction. This is the only S2 item with no existing equivalent.

**Code validation:** Confirmed — the `Scene` interface (`agent7-narrative.ts`) has `pivotElement`, `factEstablished`, `permittedBehavioursByAct`, `redHerringPlacement`, but no stage tracking field. Grep of the full workspace returns zero matches for `mechanism_stage`.

**Where to add:** `Scene` interface in `agent7-narrative.ts` + post-parse validation in the same file before `generateProse` is called.

---

### G2 — Role lock + pre-pipeline gate in Agent 2

**Errors addressed:** E13, E14

Agent 2 validates character count, field presence, and pronoun assignment — but it does not validate roles. `CastDesign.crimeDynamics` has `possibleCulprits`, `victimCandidates`, and `detectiveCandidates` arrays but these are candidate lists, not locked assignments. There is no gate that checks victim ≠ culprit before the pipeline continues.

**Code validation:** Confirmed — `CastDesign` has candidate arrays, not locked role fields. The locked culprit list lives in `CASE.culpability.culprits[]` in the CML, generated later by Agent 3. The gap is that Agent 2 outputs candidates and Agent 3 picks from them with no cross-validation that the chosen culprit does not appear in `victimCandidates`. The validation step sits between Agent 3 output and Agent 7 input, not at Agent 2.

**What to add:** A post-Agent-3 check that intersects `culpability.culprits[]` with `crimeDynamics.victimCandidates[]` and aborts if there is overlap. Pure logic, no LLM call.

---

### G3 — Access chain segments in clue schema

**Errors addressed:** E7

`clue-validation.ts` checks whether required clue tokens appear in the prose, but a clue's logical chain (existence / access / opportunity / conclusion) is not modelled as discrete schema segments. Without chain segments, there is no way to detect "access established, but opportunity never stated."

**Code validation:** Confirmed — `Clue` has no `logical_chain` field (zero workspace matches). However, `CASE.inference_path.steps[]` already encodes a deduction chain: each step has `observation`, `correction`, `effect`, `required_evidence[]`, and `reader_observable: boolean`. `Clue.supportsInferenceStep` links each clue to a step. The chain segments are already implicit in `inference_path.steps[]` — the gap is that `validateChapterPreCommitObligations` never reads them.

**What to add:** Rather than new schema fields, extend `validateChapterPreCommitObligations` to check that for each committed chapter, all `inference_path.steps[]` whose `required_evidence[]` clues are first revealed here are also accompanied by the step's `observation` token. No schema change required — only a new validation pass against existing data.

---

### G4 — DT chapter post-generation token check

**Errors addressed:** E6

`discriminating.ts` validates and injects the DT checklist before generation. It does not verify after generation that the required evidence clue appeared in the committed prose for the first time.

**Code validation:** Confirmed. `BatchCommitRecord` already has both `newClueIdsRevealed: string[]` (clues first revealed this batch) and `cumulativeClueSet: string[]` (all revealed up to this batch). These are populated before the commit record is pushed (step 9 in the post-batch sequence). The DT evidence clues are in `CASE.discriminating_test` / `prose_requirements.discriminating_test_scene`. The check is: does `newClueIdsRevealed` for the DT chapter batch contain at least one clue from `discriminatingTest.evidence_clues`? If not, hard retry.

**Where to add:** The existing `validateChapterPreCommitObligations` call in the `generate.ts` batch loop, after clue presence is confirmed — add one check using the batch's running `cumulativeClueSet` snapshot from the prior batch. Estimated: ~15 lines.

---

### G5 — Extend StoryContract and actually use it

**Errors addressed:** E10, E11, E16

`story-contract.ts` already consolidates victim identity and locked facts. But a code review of `agent9-run.ts` reveals a critical finding: `precompileStoryContract()` is called, and then **the result is only used to push a warning log line** — it is never passed into `generateProse()`. The StoryContract is built and immediately discarded.

**Code validation:** Confirmed — `agent9-run.ts` line 2014 calls `precompileStoryContract()`, stores the result in `storyContract`, appends one `ctx.warnings` entry, and never passes it to `generateProse()` or any validation step. All the schema data it would provide (victim identity, locked facts, sensory atoms, macro arc) is independently re-derived inside `generateProse` from the raw inputs.

**What to add — two steps:**
1. Extend `StoryContract` with: `culpritNames: string[]` (from `CASE.culpability.culprits`), `culpritAlibiWindows: Record<name, string>` (from `CASE.cast[].alibi_window`), `crimeTimeAnchors` (from `CASE.constraint_space.time.anchors`), `inferenceChain` (from `CASE.inference_path.steps[]`). Source fields all exist in the schema.
2. Pass `storyContract` into `generateProse()` and into the post-generation validation pipeline so it can be used as the oracle it was designed to be.

---

### G6 — Read-back comprehension gate (post-generation)

**Errors addressed:** Review scores as a whole

After all chapters are committed, run one additional LLM call with only the prose and a fixed question set derived from the StoryContract:
- Who is the culprit and what was their motive?
- What physical evidence establishes access to the means?
- What was the culprit's alibi and how was it broken?
- What is the victim's name and cause of death?

Answers are graded against the StoryContract fields. Any question the LLM cannot answer correctly from the prose alone is a prose failure.

**Code validation:** The worker pipeline in `agent9-run.ts` runs `StoryValidationPipeline` and `ProseScorer` after `generateProse` returns, but neither asks whether a naive reader can reconstruct the solution. There is already a second `generateProse` call at line 2577 triggered on hard validation failure — the read-back gate fits naturally as a trigger condition for that second run. The answers also directly diagnose which G1–G5 to prioritise: a reader who cannot name the culprit's alibi points to G5; one who cannot identify how the DT test worked points to G4.

**Where to add:** `agent9-run.ts` between `StoryValidationPipeline` and `ProseScorer`, using `storyContract` (once G5 wires it in) as the answer key. Cost: one LLM call per story.

---

## What to drop or not build

| Idea | Reason to drop |
|---|---|
| S1 `reasoning_only` schema marker | Lint pattern already exists. Agent 7 Pillar 1 already handles the injection side. Marginal gain vs. schema churn. |
| S2 `scene_type` enum | Duplicates existing Agent 7 action type system. Extend the existing system; do not add a parallel one. |
| S3 `CastRecord.display_name` | Pronoun lock already exists. The prose-name consistency issue is better addressed by a post-commit lint check against `cast[i].name` variants, not a new schema field. |
| S4 `VICTIM_ROLE_GATE` | Already exists as FIX-C2 in `lint.ts`. |
| B2 adversarial reader probe | High cost, mid-pipeline branching, significant orchestration complexity. G6 (read-back gate) achieves the same signal at the end of the run with one LLM call. |
| B4 lookahead sketch | Adds LLM calls per chapter. Structural dead-ends are better prevented by G1 (`mechanism_stage`) and G3 (chain segments) at outline time, not during prose generation. |
| B5 dual-track world model | Three overlapping tracking systems would exist. G5 (extend StoryContract) plus the existing `obligation-block.ts` alibi tracking covers the actual gap at far lower complexity. |

Start with G6. It costs one extra LLM call and gives immediate signal on whether the story communicates what it should. The answers also diagnose which of G1–G5 to prioritise next.

---

## Breakthrough ideas — genuinely new

These have no equivalent anywhere in the codebase. Each one attacks a root cause that no amount of prompt tuning or gate tightening addresses.

---

### B1 — Generate the reveal chapter first

**Target: E5, E7, E8 — structural integrity across the whole story**

The current pipeline is purely sequential: Ch 1 → Ch 2 → … → Ch N. The reveal chapter is generated last, forced to reconcile all accumulated inconsistencies. The reveal chapter's content is almost entirely determined by the schema — it must name the culprit, state the motive, explain the mechanism, and resolve every clue.

**Idea:** Generate the reveal chapter before any other prose, using schema-derived context only (obligation block, StoryContract, locked facts) without continuity context. Lock it. Every earlier chapter is then generated in service of making that specific reveal land correctly.

**Code validation:** The loop in `generate.ts` is a flat `for (batchStart = 0; batchStart < scenes.length; batchStart += batchSize)` — strictly sequential, no skip or out-of-order mechanism. The reveal chapter currently uses `buildStoryToDateBlock` which returns verbatim prior chapter text; if generated first, `NarrativeState` is empty and that call returns "No previous chapter text exists yet." This is workable — the reveal does not need prior prose context because its content is fully schema-determined. The implementation would: (1) find the last scene (archetype = RESOLUTION), (2) generate it in isolation with `continuityMode: 'schema-only'`, (3) lock the result into a `precommittedReveal` field, (4) restart the main loop from Ch 1, rejecting any batch whose committed text contradicts a token from the locked reveal.

**Nothing like this exists.** The greedy-sequential loop has no pre-commitment mechanism of any kind.

---

### B2 — Per-chapter clue clarity probe

**Target: E6, E7 — clue landing quality, not just clue token presence**

`clue-validation.ts` checks whether required clue *tokens* appear in a chapter. It cannot check whether the clue is *actually communicated to the reader* — a clue buried in a subordinate clause passes the token check but does not land.

**Idea:** After each chapter is committed, run a single short LLM call with only that chapter's prose: "What new facts does a reader now know that they did not know before this chapter?" Compare against what the schema says the chapter should establish. If the LLM reader's answer omits a required fact, the chapter retries.

**Code validation:** The `onBatchComplete` callback in `agent9-run.ts` already runs after each batch and has access to the committed chapter text. `collectClueEvidenceFromProse()` is already called here — it uses regex to extract evidence anchor phrases. The clarity probe extends this with an LLM call instead of a regex. The `Clue.supportsInferenceStep` field links each clue to its `inference_path.steps[]` entry, which has a `reader_observable: boolean` — only observable steps need the clarity check. This narrows the scope to clues where `reader_observable: true` and `criticality: 'essential'`.

**Insertion point:** Inside the `onBatchComplete` callback in `agent9-run.ts`, after `collectClueEvidenceFromProse()`, for batches containing scenes where `cluesRevealed` includes an essential, reader-observable clue. The result feeds back into the retry loop via the existing `RetryPacket` mechanism.

**Nothing like this exists.** `collectClueEvidenceFromProse` is regex-based presence detection, not comprehension checking.

---

### B3 — Mystery grammar: event-ordering DAG

**Target: E5, E7 — plant before payoff, establish before deny**

Every mystery has a structural grammar: a clue must be planted before it can be used as evidence; an alibi must be established before it can be broken. Two chapters can each individually pass all existing gates and together produce a logical impossibility (alibi broken in Ch 3, alibi established in Ch 6).

**Idea:** Derive a directed acyclic graph of event-ordering dependencies from the schema before generation begins. After each chapter is committed, check no committed event violates the DAG.

**Code validation:** The DAG is already implicit in the schema — it does not need to be invented. `CASE.inference_path.steps[]` is an ordered deduction chain where each step has `required_evidence[]`. Step N cannot be satisfied before all clues in `required_evidence[]` for steps 1..N-1 have been committed. `CASE.constraint_space.time.anchors[]` and `contradictions[]` provide the timeline ordering constraints. `Clue.supportsInferenceStep` links each clue to its step. The full ordering dependency graph can be derived from these three fields with no new schema data.

**What to add:** A pre-generation DAG compiler that reads `inference_path.steps[]` + `clue.supportsInferenceStep` + `constraint_space.time` and emits an ordered list of `(clue_id, must_precede_clue_id)` pairs. After each batch commit, check the batch's `newClueIdsRevealed` against this list. Any clue appearing before its prerequisite is a hard retry.

**Nothing like this exists.** The batch gates are stateless per chapter — no cross-chapter ordering check runs today.

---

### B4 — Epistemic state tracking per character

**Target: E10, E11 — knowledge-horizon violations**

Characters act on knowledge they do not yet have, or ignore knowledge they were present for. The culprit denies knowing about the mechanism in Ch 4 then references it casually in Ch 6. The investigator re-discovers in Ch 7 a fact witnessed in Ch 2.

**Idea:** After each chapter, update a per-character knowledge ledger: what each character has been explicitly exposed to in the prose. Inject it as a hard constraint for the next chapter: "Hale knows: [list]. Hale does not yet know: [list]."

**Code validation:** `NarrativeState` tracks `cluesRevealedToReader[]` (reader-level), `characterPronouns`, `beatHistory`, `deployedAssets` — but zero per-character knowledge tracking (confirmed, no function in the codebase models this). `ChapterSummary.charactersPresent[]` tracks who was in a scene but not what they learned. `buildContinuityContext` aggregates character names into a prose prompt block but not a structured ledger.

The inference_path already models what the *reader* should know step-by-step via `reader_observable: boolean`. The character-level gap is the inverse: what each *character* knows, not what the reader knows. These are different and the second is currently untracked.

**Implementation note:** Updating the ledger from committed prose requires either: (a) a lightweight LLM call per batch ("who was present and what did they learn?") or (b) token co-occurrence — if character name and clue token appear in the same paragraph, the character has been exposed to it. Option (b) uses the `tokenizeForClueObligation` infrastructure already in `clue-validation.ts` and requires no new LLM calls.

**Nothing like this exists.** The system tracks what the reader knows; it does not track what individual characters know.

---

### B5 — Pacing entropy from existing BatchCommitRecord data

**Target: E4 — information-empty chapters; overall quality**

`BatchCommitRecord` already tracks `newClueIdsRevealed` per chapter. A mystery with clumped clue delivery (six clues in Ch 1–3, none in Ch 4–8) produces E4: the model generates repeated beats because there is no new information to deliver.

**Idea:** After all chapters are committed, compute the information-delivery distribution as a histogram. If the coefficient of variation exceeds a threshold, flag as pacing failure and trigger an Agent 7 re-run with an explicit pacing constraint derived from the histogram.

**Code validation:** `BatchCommitRecord.newClueIdsRevealed[]` is populated per batch and collected in `ProseGenerationResult.validationDetails.batchCommitRecords[]`. This is available in `agent9-run.ts` after `generateProse` returns. The analysis itself is ~15 lines of TypeScript with no new infrastructure.

However: the worker pipeline has a second `generateProse` call at line 2577 (triggered on hard validation failure) but **no Agent 7 re-run path**. Feeding pacing data back to Agent 7 requires either: (a) a full pipeline re-run from Agent 7 forward, or (b) injecting pacing constraints as `qualityGuardrails` into a second Agent 7 call without full pipeline restart. Option (b) exists — `qualityGuardrails` is already a parameter of `NarrativeFormattingInputs`. The pacing histogram findings would become additional guardrail strings injected on re-run.

**Nothing like this exists.** `batchCommitRecords` is collected but the pacing distribution is never analysed.

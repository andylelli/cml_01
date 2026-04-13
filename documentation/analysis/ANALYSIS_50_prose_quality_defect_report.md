# ANALYSIS_50 — Prose Quality Defect Report: Systemic Generation Failures

**Date:** 2026-04-11
**Derived from:** External prose quality review of a generated story draft (related run: `run_bce0b9bc` / similar generation profile)
**Prior refs:** ANALYSIS_49 (run_bce0b9bc full audit), ANALYSIS_47/48 (earlier same-pattern runs)

---

## 0. Overview

This analysis maps every issue category from the external prose quality review to the
specific codebase agents and decisions responsible. For each issue the analysis classifies
the root cause as one of:

- **LLM/prompt** — the system or user prompt inadequately constrains the model behaviour
- **Deterministic** — a coding bug or architectural gap in the pipeline that is fixable without model changes
- **Structural** — a pipeline architecture choice that produces the symptom by design

The purpose is not to propose solutions (see follow-up analyses for that) but to
establish precise ownership per issue.

---

## 1. Issue Map

### A. Narrative Continuity and State Management

---

#### A1 — Timeline contradiction
**Severity:** Critical  
**Agents involved:** Agent 3b (hard logic devices), Agent 9 (prose generation — `buildProsePrompt`)  
**Type:** LLM/prompt gap + deterministic repair miss

**Root cause:**

Hard logic devices (clocks, times of death, wound-back amounts) produce _multiple_ time
values: the face-value reading (`"ten minutes past eleven"`), the true time implied by
the wound-back amount, the last sighting, and the discovery time. Agent 3b generates
these as separate `locked_facts` entries.

In agent9-prose.ts `buildTimelineStateBlock()` (line ~2032), locked facts that contain
time-related keywords are extracted and injected into the prose prompt as:

```
If referenced, use exact time phrase: "ten minutes past eleven" (The exact time shown on the stopped clock face)
```

However, this block is a **low-priority context section** — it sits below the world
document, character voices, and location registers in the token budget stack
(`buildPromptContextBlocks`, ordered sections). Under token pressure the timeline block
can be partially or fully truncated by the budget allocator. When that happens the LLM
has no anchor for the time values at all and invents internally consistent-but-wrong
numbers chapter by chapter.

Additionally, neither `buildTimelineStateBlock` nor `buildChapterObligationBlock` cross-
validates that all time-locked facts are mutually consistent before injecting them. If
agent 3b generates `"ten minutes past eleven"` as the clock face but `11:10 PM` in a clue
description (the AM/PM mismatch documented in ANALYSIS_49 §4.3), both values are injected
into separate sections of the prompt with no reconciliation — the model sees two
contradictory times and arbitrarily resolves the ambiguity per-chapter.

The `repairWordFormLockedFacts` pass in agent9-run.ts (FIX-C) only handles digit→word-form
substitution. It does not detect or correct cases where the model generates a plausible
but **wrong** time that passes the digit pattern check (e.g. "half past eleven" vs "ten
minutes past eleven").

---

#### A2 — Victim status contradiction
**Severity:** Critical  
**Agents involved:** Agent 7 (narrative outline — `buildNarrativeFormattingContext`), Agent 9 (prose — `buildContextSummary`, `buildNSDBlock`)  
**Type:** LLM/prompt gap

**Root cause:**

Agent 7's narrative outline prompt establishes the victim name (`${victim}`) and crime
once at the top of the formatting context block. However, the scene-by-scene outline the
LLM produces does not carry a mandatory victim-status invariant per scene. There is no
system-level constraint of the form: "Once the victim is established as dead, no later
scene may describe them as alive, speaking, or present."

In agent9-prose.ts `buildContextSummary()` the victim name is included in the case
overview block that every prose prompt receives. `buildNSDBlock()` carries locked facts
but only those in the CML `lockedFacts` array — victim confirmed-dead status is not a
`lockedFact`, it is assumed common knowledge.

The NarrativeState (`NarrativeState` type, `buildNSDBlock`) tracks `cluesRevealedToReader`
and `lockedFacts` but has **no victim state or victim timeline anchor**. The prose LLM
can therefore regenerate this state independently per batch, and in multi-female-character
scenes with overlapping roles (e.g. victim is female, suspect is female, narrator is male)
the model occasionally misassigns the victim role to an alive character.

This is a **structural gap**: there is a dedicated state document (`NarrativeState`) that
is supposed to carry invariants, but victim-confirmed-dead state is not tracked in it.

---

#### A3 — Location continuity drift
**Severity:** High  
**Agents involved:** Agent 7 (narrative outline), Agent 65 (world builder), Agent 9 (prose — `buildSceneGroundingChecklist`, `applyDeterministicProsePostProcessing`)  
**Type:** LLM/prompt gap + partial deterministic mitigation

**Root cause:**

Each chapter prompt includes a `sceneGroundingChecklist` built by
`buildSceneGroundingChecklist()` in agent9-prose.ts (line 2605). This injects the scene's
canonical location anchor extracted from the narrative outline. The opening-grounding
check in `applyDeterministicProsePostProcessing` (agent9-run.ts line 658) then
deterministically injects a grounding lead paragraph if the opening lacks an anchor, a
sensory signal, and atmosphere.

The problem is that agent 7's narrative outline is generated as a **single LLM call** for
all 19 scenes. The LLM frequently drifts room names mid-outline — a scene titled
"Servants' Hall" may have a summary describing the study. The injected grounding lead
uses `locationProfiles.primary.name` generically (the whole property), not the room
specified in the specific scene's outline. So the grounding lead may say "Thornfield
Manor" while the outline summary says "study" and the scene action takes place in the
"drawing room".

Agent 65 (World Builder) generates `locationRegisters` keyed by location name, providing
emotional register and camera angle guides per room. These are injected into prose prompts
via `buildWorldBriefBlock` but only up to `locationRegisters.length` entries — the prose
LLM is not prevented from mixing registers, and there is no deterministic register-to-
scene lock.

---

#### A4 — Investigation-state inconsistency (re-discovery of clues)
**Severity:** High  
**Agents involved:** Agent 9 (prose — `buildNSDBlock`, `NarrativeState`)  
**Type:** LLM/prompt structural gap

**Root cause:**

`buildNSDBlock()` injects `cluesRevealedToReader` as a simple ID list:

```
CLUES ALREADY REVEALED TO READER: clue_1, clue_5, clue_9 — do not reveal these as new information.
```

This is a **raw ID list** without prose descriptions. The LLM has no way to know that
`clue_5` is "the oil smell on the clock mechanism" without separately cross-referencing
the clue distribution block. Token-budget truncation of lower-priority blocks means the
clue distribution block may not always be fully present when `buildNSDBlock` is.

The result is that when the LLM sees `clue_5` in the revealed list without the full
description, it does not suppress re-discovery because it cannot match IDs to prose. The
investigation advances forward on paper (via the `cluesRevealedToReader` array growing)
but the prose re-surfaces the same sensory observations.

Additionally, the NarrativeState carries no field for the **investigation progress stage**
(e.g. "clue observed → clue examined → clue corroborated → suspect implicated"). Stage-
level tracking does not exist anywhere in the pipeline.

---

### B. Character and Entity Integrity

---

#### B1 — Pronoun drift
**Severity:** Critical  
**Agents involved:** Agent 9 (prose — `buildPronounAccuracyBlock`, `repairChapterPronouns`), `pronoun-repair.ts`, `prose-consistency-validator.ts`  
**Type:** LLM/prompt gap + deterministic repair coverage gap

**Root cause — three independent failure paths:**

**Path 1: Multi-character scenes exceed repair coverage.**
`repairPronouns()` in pronoun-repair.ts operates at sentence level. Its key constraint is:
_"If TWO+ characters of different genders are mentioned, skip (ambiguous)."_
In scenes with 3+ named characters (e.g. Catherine Nolan, Barry Lynch, Christopher Regan
all present), almost every sentence contains 2+ characters. The repair function skips
nearly every sentence. The LLM's underlying pronoun assignment error goes uncorrected.

**Path 2: Retry loop does not converge for this failure mode.**
Chapter 12 Barry Lynch pronoun drift (female pronouns for a male character) survived 3
retry attempts unchanged. The retry directive re-sends the complete chapter prompt with
the same `buildPronounAccuracyBlock` content. If the LLM's generation bias in that scene
context (multiple female characters present, Barry Lynch frequently referenced) is stronger
than the prompt constraint, each attempt produces the same error. There is no escalation
logic — attempt 4 is identical to attempt 1 in terms of prompt content.

**Path 3: Competitor guard in `checkPronounDrift` suppresses detectable errors.**
`checkPronounDrift` in prose-consistency-validator.ts searches the full paragraph for a
competitor name before flagging. In a scene with Catherine Nolan (female) and Barry Lynch
(male), a genuine Barry Lynch pronoun error ("she left the room" referring to Barry) will
be suppressed if Catherine Nolan's first name appears anywhere in that paragraph. The
validator correctly doesn't flag this as a hard error — but neither does the repair
function fix it (Path 1 above). The chapter can commit with the error present, unrepaired
and un-flagged.

---

#### B2 — Speaker attribution instability
**Severity:** High  
**Agents involved:** Agent 9 (prose — `repairDialogueAttributionPronouns`, `buildPronounAccuracyBlock`)  
**Type:** LLM/prompt gap + limited deterministic coverage

**Root cause:**

`repairDialogueAttributionPronouns()` in pronoun-repair.ts repairs the specific pattern
where the attribution pronoun matches the _addressee_ inside the quoted speech rather than
the speaker. This covers one attribution failure mode.

It does not cover:
- Tag structure implying wrong speaker when the nearest prior name is a different character
- Anonymous role phrases ("a woman said") used where a named character exists
- Multi-sentence dialogue blocks where attribution is established once and then drifts

Rule 6 of `buildPronounAccuracyBlock` covers the attribution contract in the prompt:
_"In dialogue attribution ('he said', 'she replied'), the attribution pronoun must agree
with the SPEAKER's gender — not the last character named inside the quoted speech."_

This rule exists in the prompt but is one of 9 rules, all carrying equal visual weight.
There is no deterministic enforcement of who the speaker is in any given dialogue
exchange — the pipeline does not track a canonical speaker sequence state per chapter.

---

#### B3 — Character role flattening / voice homogenisation
**Severity:** Medium-High  
**Agents involved:** Agent 2b (character profiles), Agent 65 (world builder — `characterVoiceSketches`), Agent 9 (prose — `buildWorldBriefBlock`)  
**Type:** LLM/prompt gap

**Root cause:**

Agent 2b generates character profiles with personality traits and speaking styles.
Agent 65 uses these to build `characterVoiceSketches` containing a `voiceDescription` and
up to 3 `fragments` per register (comfortable, evasive, stressed, formal, humorous).

`buildWorldBriefBlock()` injects up to 3 fragments per character. But fragments are
written by agent 65's LLM in the same generation context — if agent 65 does not
sufficiently differentiate voice parameters per character, all fragments end up in a
similar register. There is **no diversity-enforcement gate** between agent 65's voice
output and what gets injected into the prose prompt.

The prose agent (agent 9) must then generate 4–5 distinct-sounding characters using
voice sketches that may already be homogenous. The `buildPronounAccuracyBlock` rule 2
addresses pronoun ambiguity but nothing in the prompt enforces lexical, rhythmic, or
sociological distinctness per character voice.

---

### C. Plot and Deduction Architecture

---

#### C1 — Weak causal chain (clue→solution)
**Severity:** Critical  
**Agents involved:** Agent 5 (clue distribution), Agent 6 (fair play audit), Agent 7 (narrative outline — `buildProseRequirements`), Agent 3 (CML — inference path)  
**Type:** Structural + LLM/prompt gap

**Root cause:**

The CML `inference_path` defines logical steps for the detective. Agent 6 audits clue
coverage of those steps via `checkInferencePathCoverage()`, which verifies that at least
40% of the keywords from each step's `observation` text appear in some clue's description.
This is a **keyword overlap check**, not a **logical proof** check.

A step that says "The oil smell implicates Francis" passes coverage if any clue contains
"oil" and "Francis." Whether the _logical chain_ ("oil smell → specific tool → unique
access → Francis only") is fully staged across the narrative outline is never verified.

Agent 7 produces `buildProseRequirements()` which injects `suspect_clearance_scenes` and
`culprit_revelation_scene` into the outline — but the `revelation_method` field is a free-
text string such as "detective explanation." There is no schema enforcement of proof chain
structure (contradiction trap, involuntary knowledge reveal, physical-only argument).

By the time agent 9 generates prose, the chapter obligation contract
(`buildChapterObligationBlock`) only enforces clue presence — not that the clue is
_actively reasoned about_ in the prose. The `pointsTo` string is injected once:

```
Points to: Direct contact with the clock confirms Barry's involvement.
```

But whether the POV character reasons through that inference in prose is not validated.
The early-placement two-paragraph structure requirement exists only for `placement: 'early'`
clues and only enforces that the observation _and_ an inference paragraph both appear — not
their logical quality.

---

#### C2 — Premature suspect convergence
**Severity:** High  
**Agents involved:** Agent 3 (CML structure — `culpability`), Agent 7 (narrative outline), Agent 9 (prose — NarrativeState, `chapterSummaries`)  
**Type:** LLM/prompt gap

**Root cause:**

The CML openly names the culprit in `culpability.culprits[]`. This value is injected
verbatim into:
- `buildNarrativeFormattingContext()` in agent7-narrative.ts: `**Culprit**: ${culpritName}`
- `buildContextSummary()` in agent9-prose.ts: `Culprit: ${culprit}`

Every prose prompt and the entire narrative outline receive the culprit's identity upfront.
The `prose_requirements.identity_rules[]` field can restrict how the culprit is named
before a certain act — but this only governs _naming_, not the tone, narrative emphasis,
or physical descriptions given to that character.

The LLM, knowing who the culprit is, naturally front-loads suspicious signals on them in
atmosphere and framing. There is no constraint on **suspicion budget distribution** (e.g.
"by chapter 8 all suspects must have received equal tonal emphasis"). The narrative outline
is generated in a single pass, and the outline LLM also has full culprit knowledge —
meaning scene-by-scene framing decisions are made with complete solution knowledge.

---

#### C3 — Confession-dependent resolution
**Severity:** High  
**Agents involved:** Agent 3 (CML — `prose_requirements.culprit_revelation_scene`), Agent 7 (narrative outline)  
**Type:** LLM/prompt gap

**Root cause:**

`culprit_revelation_scene.revelation_method` is unconstrained free text generated by the
CML LLM (agent 3). Common outputs include "detective confronts culprit" or "culprit
confesses under pressure." These are accepted by schema validation — there is no allowed-
value list that enforces evidence-based revelation methods.

Agent 7 receives this revelation method as-is and builds a scene summary around it. If the
CML says "confession," agent 7 writes a confrontation scene, and agent 9 generates a
confession chapter. No stage in the pipeline rejects or escalates a confession-based
resolution in favour of a stronger proof mechanism.

---

#### C4 — Motive underdevelopment
**Severity:** Medium-High  
**Agents involved:** Agent 2b (character profiles), Agent 3 (CML — `culpability.motive`), Agent 9 (prose)  
**Type:** LLM/prompt gap

**Root cause:**

The CML stores a single `culpability.motive` string. Agent 2b generates a more detailed
psychological profile per character, including motivation texture. However, neither input
enforces **motive coherence** — that all stated motive variations (rivalry, jealousy,
protection, etc.) are subordinated under one dominant psychological arc.

In agent 9's chapter obligation contract, motive is not tracked as a per-scene obligation.
There is no gate that asks "does this chapter's culprit behaviour remain consistent with
the locked motive?" The prose LLM generates motive texture freely per scene, producing
oscillation across the 19-chapter run.

---

### D. Style and Prose Generation Quality

---

#### D1 — Repetitive atmospheric templating
**Severity:** High  
**Agents involved:** Agent 9 (prose — `lintBatchProse`, `detectRecurringPhrases`)  
**Type:** Deterministic partial mitigation insufficient

**Root cause:**

The pipeline has three anti-repetition mechanisms:

1. **Opening-style entropy check** (`lintBatchProse`) — classifies each chapter's opening
   sentence into one of 7 style buckets and fires if Shannon entropy falls below threshold.
   This catches structural repetition of opening **style** but not atmospheric phrase
   repetition within chapter bodies.

2. **Paragraph fingerprint deduplication** — exact-match post-processing deduplication.
   Catches verbatim repeated paragraphs but not paraphrased repetition.

3. **N-gram overlap check** — Jaccard similarity of 7-gram sequences across chapter
   bodies. With a configurable `overlap_threshold`, near-duplicate paragraphs are caught.

None of these mechanisms target **intra-chapter atmospheric phrase repetition** at the
sub-paragraph level — a 3-word phrase like "chill air" or "heavy curtains" can appear in
17 of 19 chapters without triggering any check, because each occurrence is in a different
paragraph with different surrounding tokens.

`detectRecurringPhrases()` exists and is called but its output is **not wired into retry
or scoring logic** — it is purely diagnostic. Recurring phrases identified by this function
do not generate a hard or soft failure that would cause a chapter retry.

---

#### D2 — Telling instead of dramatising
**Severity:** Medium-High  
**Agents involved:** Agent 9 (prose — `buildProsePrompt`, craft guide block)  
**Type:** LLM/prompt gap

**Root cause:**

The prose prompt includes a `craftGuideBlock` with style guidance. Inspection of the
prompt structure shows this block has `priority: "medium"` in the context block stack
and is subject to token-budget truncation. When context pressure is high (long narrative
outline, large world document, multiple locked facts), the craft guide is the first to be
shrunk.

There is no **validator that scores show-vs-tell ratio** — the ProseScorer has no
semantic analysis mechanism for detecting declarative emotional summary ("the tension was
palpable") vs behavioural dramatisation. The prose LLM defaults to declarative
summarisation under token pressure because it is more token-efficient per unit of
narrative function.

---

#### D3 — Redundant internal monologue
**Severity:** Medium  
**Agents involved:** Agent 9 (prose — chapter obligation contract, NarrativeState)  
**Type:** LLM/prompt gap

**Root cause:**

The chapter obligation contract (`buildChapterObligationBlock`) specifies clue obligations
and location anchors per scene, but does not specify **what the detective must _not_
repeat** from prior internal summaries. The NarrativeState records clues revealed and
locked facts but carries no representation of "internal monologue beats already expressed."

Per chapter, the LLM has no context for whether the detective has already reflected on
time slipping away or the weight of responsibility — it generates these beats fresh in
each batch. Since batches are processed 1–3 chapters at a time, chapter-to-chapter
internal monologue repetition is structurally unconstrained.

---

#### D4 — Tonal over-insistence
**Severity:** Medium  
**Agents involved:** Agent 65 (world builder — `storyEmotionalArc`, `humourPlacementMap`), Agent 9 (prose — `buildWorldBriefBlock`)  
**Type:** LLM/prompt gap

**Root cause:**

Agent 65 generates a `storyEmotionalArc` with `turningPoints` per story position
(opening, early, first_turn, mid, second_turn, pre_climax, climax, resolution) and a
`humourPlacementMap` that specifies when humour is permitted.

`buildWorldBriefBlock()` injects the humour entry for the current position, including
`humourPermission`, `permittedCharacters`, `permittedForms`, and a `condition`. This is
the only tonal modulation mechanism.

However, the emotional-arc turning point description is injected as a **prose description**
(e.g. "darkening tension, a sense of inevitability"), not as a constraint. The LLM
amplifies rather than modulates: given a "heightening dread" turning point, it produces
maximum dread in every sentence rather than alternating dread with the contrasting beats
(wit, domestic detail, clipped exchange) that a human editor would intercut.

There is no tonal floor constraint ("this chapter must contain at least one non-tense
exchange"), only tonal ceiling guidance from turning points.

---

### E. Structure and Pacing

---

#### E1 — Scene redundancy (circular investigation)
**Severity:** High  
**Agents involved:** Agent 7 (narrative outline), Agent 9 (prose)  
**Type:** LLM/prompt gap

**Root cause:**

Agent 7's outline prompt specifies:
- exact scene count (e.g. 19 scenes: 5 Act I, 9 Act II, 5 Act III)
- location lock
- detective type entry rule
- prose requirements (clue mappings, clearance scenes, revelation)

But it does not enforce **cross-scene uniqueness** — i.e. that no two scenes serve the
identical investigative function. The outline LLM fills Act II (9 scenes) with interview-
and-clock-re-examination scenes because clock evidence is the only consistently available
story material. There is no gate that checks "how many scenes already have [interview
suspect X]" before allowing another.

The `chapterSummaries` mechanism in agent 9 provides chapter-to-chapter context, but these
are post-prose summaries passed forward to subsequent batches. They are not used to gate
the outline generation (which happens in agent 7, before prose). By the time redundant
scenes are apparent in prose, 3-4 chapters have already been generated.

---

#### E2 — Chapter segmentation without escalation
**Severity:** Medium-High  
**Agents involved:** Agent 7 (narrative outline — pacing), Agent 9 (prose + NarrativeState)  
**Type:** LLM/prompt gap / structural

**Root cause:**

Agent 7's scene construction guidelines include a `minClueScenes` constraint (e.g. at
least 12/19 scenes carry clues) and act-based distribution ratios. These ensure clue
pacing coverage but do not enforce **narrative escalation** — that each scene must advance
the investigation to a new milestone (new contradiction revealed, new suspect eliminated,
trap set, etc.).

The outline LLM is not forbidden from placing structurally identical scene types
(character interviews without escalation) in consecutive Act II scenes, as long as clue
counts are satisfied. After the outline is committed, neither agent 9 nor any validator
checks whether the 19 generated chapters collectively form a progressive sequence.

---

#### E3 — Word-count inflation
**Severity:** Medium-High  
**Agents involved:** Agent 9 (prose — word policy, expansion, `buildChapterObligationBlock`)  
**Type:** Structural

**Root cause:**

The chapter obligation contract injects:
```
Word count: Target ${wordTarget.targetWords} words. Do not cut this chapter short.
```

The policy deliberately targets a "preferred" word count (e.g. 1,300 for short stories)
with a hard floor (600). The instruction "do not cut this chapter short" is correct
behaviour — it prevents under-length chapters. But the LLM achieves the target through
the path of least resistance: atmospheric padding and internal monologue expansion rather
than plot or clue density expansion. There is no minimum plot-event-per-word-count
constraint.

---

### F. Fair-Play and Reader Experience

---

#### F1 — Unreliable clue presentation (broken fair-play contract)
**Severity:** Critical  
**Agents involved:** Agent 5 (clue distribution), Agent 3b (hard logic devices), Agent 6 (fair play audit), Agent 9 (prose repairWordFormLockedFacts)  
**Type:** Structural + deterministic repair miss

**Root cause:**

This is the combinatorial failure of several upstream issues:

1. Agent 5 back-fills 8 essential clues mechanically (§4.1, ANALYSIS_49). Mechanically
   assigned clues have no narrative setup context. Their `description` is generated
   independently of the scene they are placed in.

2. Agent 3b locked facts may contain AM/PM ambiguity (the I1 false positive).
   Even after I1's AM/PM guard fix, the underlying LLM-facing clue description may still
   say "11:10 PM" while the locked fact says "ten minutes past eleven." The LLM generates
   both values in different chapters, producing unstable evidence.

3. `repairWordFormLockedFacts` (FIX-C) can substitute digit-form times/quantities for
   word-form canonical values. But it cannot repair chapters where the locked fact value
   was written in a _different word form_ (e.g. "nearly ten past eleven" vs "ten minutes
   past eleven") — these pass the digit-form check, escape repair, and are flagged by the
   validator post-commit.

4. The fair-play audit (agent 6) runs **before prose generation**. It validates that the
   clue set covers the inference path at the structural level. It has no mechanism to
   verify that the clue, once injected into prose, will be expressed in the canonical form
   required to satisfy the locked-fact validator.

---

#### F2 — Accidental ambiguity (confusion vs mystery)
**Severity:** High  
**Agents involved:** Agent 9 (prose — all), Agent 3 (CML — `false_assumption`)  
**Type:** LLM/prompt gap

**Root cause:**

This issue is the aggregate manifestation of A1–A4, B1–B2, and F1. Every factual
inconsistency (time, victim status, pronoun, location) that escapes repair and validation
creates _unintended_ reader confusion that mimics mystery ambiguity.

There is no post-prose audit that classifies each ambiguity as:
- **intentional** (protected by CML false assumption or red herring designation)
- **accidental** (arising from generation inconsistency)

The `ProseScorer` and `StoryValidationPipeline` check for locked-fact presence,
consistency violations, and structural completeness — but they do not attempt to
distinguish deliberate withholding from accidental contradiction.

---

## 2. Root Cause Taxonomy

### RC-1: Absent canonical story state for victim and investigation progress
**Issues:** A2, A4, F1, F2  
**Architecture layer:** NarrativeState (`packages/prompts-llm/src/types/narrative-state.ts`)

`NarrativeState` tracks locked facts, character pronouns, revealed clue IDs, and opening
styles. It does **not** track:
- victim confirmed-dead (boolean + chapter number)
- clue investigation lifecycle stage per clue (observed → examined → corroborated → used)
- internal monologue beats already expressed
- investigation milestone checkpoints per act

This is a deterministic code gap — the type definition and update logic would need
extension. The absence is by original design: the state object was built for style and
fact consistency, not narrative progression tracking.

---

### RC-2: Token-budget truncation silently drops high-value context
**Issues:** A1, D2, B1 (prompt path)  
**Architecture layer:** `buildPromptContextBlocks()` priority ordering in agent9-prose.ts

The priority stack places `nsd_block` and `world_document` at critical/high priorities.
`craft_guide`, `temporal_context_block`, and `locked_facts` are at medium or lower. Under
token pressure (long narrative outline, complex cast) these are truncated. The model then
generates without the timeline anchor or the prose craft contract, defaulting to atmospheric
padding and approximate time references.

The truncation is silent — no log entry records that the locked-facts block was cut.
The chapter is generated and only fails at post-generation validation. The retry prompt
may also be truncated in the same way.

---

### RC-3: Pronoun repair is neutralised in multi-character scenes
**Issues:** B1, B2  
**Architecture layer:** `repairPronouns()` in `packages/story-validation/src/pronoun-repair.ts`

The repair's core invariant — "skip if 2+ characters are mentioned" — is correct for
single-character disambiguation but creates a systematic gap: any scene with 3+ named
characters is effectively unrepaired. The sentence-level repair and the dialogue-
attribution repair both use the same `findMentionedCharacters()` function, which counts
names without distinguishing subject-role vs. conversational-mention. A character named
in passing in a sentence ("Jennifer asked Barry") causes the repair to treat the sentence
as ambiguous even when the pronoun clearly refers to one of them.

---

### RC-4: Fair-play audit validates structure but not prose expression
**Issues:** C1, F1  
**Architecture layer:** Agent 6 (`checkInferencePathCoverage`) and Agent 9 chapter obligations

Agent 6 verifies that the inference path has covering clues. Agent 9 verifies that those
clues are **present** in prose. Neither verifies that the reasoning connecting clue to
inference step is **expressed** in prose. The `pointsTo` field is injected as obligation
context but is not validated for presence.

---

### RC-5: Outline LLM has full culprit knowledge with no suspicion-budget constraint
**Issues:** C2, D4  
**Architecture layer:** Agent 7 prompt (`buildNarrativeFormattingContext`) and Agent 9 context (`buildContextSummary`)

Both agents receive `Culprit: ${culpritName}` as a plain-text declaration early in the
prompt. The LLM's generation bias then foregrounds the culprit. There is no counterweight
(suspicion budget distribution rule, suspect airtime tracking, etc.) in the prompt or in
deterministic post-processing.

---

### RC-6: No schema constraint on `revelation_method` or `culprit_revelation_scene`
**Issues:** C3  
**Architecture layer:** CML schema (`schema/cml_2_0.schema.yaml`) and Agent 3 prompt

The `culprit_revelation_scene.revelation_method` is a free-text string. Weak revelation
methods (confession, "detective explains") pass schema validation identically to strong
ones (contradiction trap, involuntary knowledge reveal). No downstream agent escalates or
rejects weak revelation methods.

---

### RC-7: Atmospheric phrase repetition not gated in retry or scoring
**Issues:** D1, D3, E3  
**Architecture layer:** `detectRecurringPhrases()` in agent9-prose.ts, ProseScorer

`detectRecurringPhrases()` computes 7-gram phrase recurrence across all chapters and
returns a top-15 list. This list is computed but **not connected to any retry trigger,
validation error, or scoring penalty**. It is purely diagnostic output. Atmospheric
phrase recurrence therefore accumulates freely through all 19 chapters.

---

### RC-8: Scene uniqueness not enforced in narrative outline
**Issues:** E1, E2  
**Architecture layer:** Agent 7 prompt

The outline prompt specifies scene counts and clue distribution requirements but
has no constraint of the form "each scene must contribute a unique investigative
advancement not already present in any prior scene." Scene-function uniqueness is
assumed to be a property the LLM produces by default — in practice it does not in
long Act IIs with limited available clues.

---

## 3. Severity Matrix

| Issue | Root Causes | Agent(s) | Type |
|-------|------------|----------|------|
| A1 Timeline contradiction | RC-2, RC-1 | Agent 3b, Agent 9 | LLM/prompt + repair miss |
| A2 Victim status contradiction | RC-1 | Agent 7, Agent 9 | Structural gap |
| A3 Location continuity drift | — | Agent 7, Agent 65, Agent 9 | LLM/prompt gap |
| A4 Investigation-state inconsistency | RC-1 | Agent 9 | Structural gap |
| B1 Pronoun drift | RC-3, RC-2 | Agent 9, pronoun-repair.ts | Deterministic coverage + LLM |
| B2 Speaker attribution instability | RC-3 | Agent 9, pronoun-repair.ts | Deterministic coverage |
| B3 Character role flattening | — | Agent 2b, Agent 65, Agent 9 | LLM/prompt gap |
| C1 Weak causal chain | RC-4 | Agent 3, 5, 6, 7 | Structural gap |
| C2 Premature suspect convergence | RC-5 | Agent 7, Agent 9 | LLM/prompt gap |
| C3 Confession-dependent resolution | RC-6 | Agent 3, Agent 7 | Schema + LLM gap |
| C4 Motive underdevelopment | — | Agent 2b, Agent 3, Agent 9 | LLM/prompt gap |
| D1 Repetitive atmospheric templating | RC-7 | Agent 9 | Deterministic not connected |
| D2 Telling instead of dramatising | RC-2 | Agent 9 | Token-budget truncation |
| D3 Redundant internal monologue | RC-1 | Agent 9 | Structural gap |
| D4 Tonal over-insistence | RC-5 | Agent 65, Agent 9 | LLM/prompt gap |
| E1 Scene redundancy | RC-8 | Agent 7, Agent 9 | LLM/prompt gap |
| E2 No escalation between chapters | RC-8, RC-1 | Agent 7, Agent 9 | Structural gap |
| E3 Word-count inflation | — | Agent 9 | Structural (policy) |
| F1 Unreliable clue presentation | RC-4, RC-2 | Agent 3b, 5, 6, 9 | Structural + repair miss |
| F2 Accidental ambiguity | RC-1 through RC-7 | All | Aggregate |

---

## 4. Issue Count by Agent

| Agent | Issues involved |
|-------|----------------|
| Agent 9 (prose generation + repair) | A1, A2, A3, A4, B1, B2, B3, C2, D1, D2, D3, D4, E1, E2, E3, F1, F2 |
| Agent 7 (narrative outline) | A2, A3, C1, C2, C3, E1, E2 |
| Agent 5 (clue distribution) | C1, F1 |
| Agent 65 (world builder) | A3, B3, D4 |
| Agent 3b (hard logic devices) | A1, F1 |
| Agent 6 (fair play audit) | C1, F1 |
| Agent 3 (CML generation) | C2, C3, C4, F2 |
| Agent 2b (character profiles) | B3, C4 |
| `pronoun-repair.ts` | B1, B2 |
| `NarrativeState` (shared type) | A2, A4, D3, E2 |

---

## 5. Issues Not Yet Addressed by Any Existing Fix

The following issues have **no current mitigation** in the codebase and have never been
addressed by a previous fix (as of this analysis):

| Issue | Status |
|-------|--------|
| A3 Location continuity drift | ❌ Not addressed |
| A4 Investigation lifecycle tracking | ❌ Not addressed |
| B3 Voice homogenisation | ❌ Not addressed |
| C1 Proof-chain validation | ❌ Not addressed |
| C2 Suspicion budget distribution | ❌ Not addressed |
| C3 Confession-only resolution | ❌ Not addressed |
| E1 Scene uniqueness enforcement | ❌ Not addressed |
| E2 Escalation enforcement | ❌ Not addressed |
| RC-6 revelation_method schema constraint | ❌ Not addressed |

## 6. Issues Partially or Fully Addressed

| Issue | Fix applied | Status |
|-------|------------|--------|
| B1 Pronoun drift — competitor window | Expanded to full paragraph scope | ✅ Partial (multi-char scenes still gap) |
| B1 Pronoun drift — break→continue | Fixed in prose-consistency-validator.ts | ✅ Applied |
| A1 AM/PM false positive (FIX-B) | `Math.round(diff * 60) !== 720` guard | ✅ Applied |
| F1 `appearsInChapters` over-broad scoping | First-chapter-only annotation (this session) | ✅ Applied |
| A1 Word-form quantities / imperial units | Agent 3b prompt updated | ✅ Applied |
| D1 Recurring phrase repair | `detectRecurringPhrases` → `runAtmosphereRepairIfNeeded` wired | ✅ Applied (post-hoc repair only) |
| A1 Fix 1 — temporal_context priority | Raised `temporal_context` from `medium` → `high` in `buildPromptContextBlocks` | ✅ Applied |
| D2 — craft_guide priority | Raised `craft_guide` from `optional` → `high` in `buildPromptContextBlocks` | ✅ Applied |
| A2 — victimConfirmedDeadChapter | Type field + NSD injection added; orchestrator setter (`agent9-run.ts:onBatchComplete`) not yet wired — feature is latent | ⚠ Partial |
| C4 — Motive lock | `buildContextSummary` injects MOTIVE LOCK from culprit's `motive_seed` character field | ✅ Applied |
| D4 — Tonal contrast beat | Per-chapter contrast instruction in `buildChapterObligationBlock`; suppressed on discriminating test chapters; generic (no story-level label) | ✅ Applied |
| E3 — Word-count quality instruction | Extended word count instruction requiring concrete events per 200-word segment | ✅ Applied |

---

## 7. Fix Strategy — Guiding Principles

These principles must hold for every fix to avoid going backwards:

1. **Pure additions beat modifications.** Adding a new field, rule, or block does not
   break anything that currently passes. Changing an existing check thresholds or
   removing a guard does.

2. **Prompt additions before code additions.** A new sentence in an agent prompt can
   be verified in a single run. A new state field requires updating the type, the
   initializer, the updater, the formatter, and all tests. Do prompt-only fixes first,
   then strengthen with code once the signal is verified.

3. **Never tighten a validator without increasing the fix floor.** Making a validator
   stricter creates new failures. Only do so alongside (or after) a repair or generation
   improvement that makes the failure recoverable.

4. **NarrativeState additions must be backward-compatible.** Any new field added to
   `NarrativeState` must have a defined default so that `initNarrativeState` and
   `updateNSD` continue to work without callers changing. Use `?:` optional fields or
   initialise with empty/false defaults.

5. **Token budget changes must be verified.** Moving a block from `optional` to `high`
   or `critical` displaces another block under pressure. Always confirm what gets
   de-prioritised when a priority level is raised.

6. **No new retry loops.** The existing retry mechanism (max 3 per chapter) is
   well-bounded. Adding a new inner retry loop for a different concern risks timeout
   and cost explosion. Fixes that need retry must hook into the existing loop.

7. **Agent 7 is upstream — fix outline quality first.** Prose quality problems that
   originate in the narrative outline (E1, E2, C2) cannot be fixed in agent 9 prose
   because the batch-level context is already wrong. Fixing agent 7 prompt first,
   then verifying the outline quality, then checking prose output.

---

## 8. Fix Catalogue

### Fix A1 — Timeline contradiction

**Target:** `packages/prompts-llm/src/agent9-prose.ts`  
**Correction to analysis:** `locked_facts` is already `critical` priority (line 1660) and
is NOT truncated under budget pressure. The `temporal_context` block is `medium` (line
1659) and IS vulnerable to truncation. That is the actual truncation risk for A1.

**Fix 1 — Promote temporal_context priority:**
Raise `temporal_context` from `'medium'` to `'high'` in `buildPromptContextBlocks`.
This ensures the temporal context (day/time anchors from `temporalContext` artifact) is
present in all prose prompts regardless of token pressure.

_Risk:_ displaces `location_profiles` (currently `medium`) under extreme pressure. This
is acceptable — location registers are also injected implicitly through the world document
block which is `high`.

**Fix 2 — Pre-commit time-consistency check:**
In `validateChapterPreCommitObligations`, after passing the clue-presence and word-count
checks, scan the generated prose text for any time-expression pattern (regex:
`/\b(\d{1,2}[:.]\d{2}|\b(half|quarter|ten|five|twenty)\s+(past|to)\s+(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve))/gi`)
and verify that each matched expression is consistent with the locked fact canonical time
value. A mismatch → chapter retry.

_Risk:_ Could add false-positive retry cycles if the regex is too broad (e.g. "five past
seven" in a time context that is legitimately about a different clock). Scope the check
to chapters where a `timeRelated: true` locked fact is in `appearsInChapters` for that
chapter number only.

**Do NOT:**
- Change the `locked_facts` priority (already `critical`)
- Add a new timeline-enforcement retry independent of the existing `validateChapterPreCommitObligations` path

---

### Fix A2 — Victim status contradiction

**Target:** `packages/prompts-llm/src/types/narrative-state.ts`, `agent9-prose.ts` — `buildNSDBlock`

**Fix:**
Add an optional field to `NarrativeState`:

```typescript
/** Chapter in which the victim's death was established. Undefined until confirmed. */
victimConfirmedDeadChapter?: number;
```

In `initNarrativeState`, set this to `1` (the crime pre-dates the story), or to the
discovery chapter number if identifiable from the CML. In `buildNSDBlock`, when this
field is set, inject:

```
VICTIM STATE: ${victimName} is DEAD. This is a fixed narrative fact. 
Do not write them as alive, present, speaking, or approaching anyone in any chapter.
Their death was established in chapter ${victimConfirmedDeadChapter}.
```

This sits inside the existing NSD block, rendered as a locked fact.

_Risk:_ Low. It is a nullable optional field. Existing `updateNSD` uses `...current` spread,
so this field is automatically preserved across batches without any updater change.

**Do NOT:**
- Modify the LockedFact array type to accommodate victim state — victim state is
  narrative fact, not physical evidence, and must not be subject to the
  `repairWordFormLockedFacts` pass or the locked-fact validator.

---

### Fix A3 — Location continuity drift

**Target:** `packages/prompts-llm/src/agent9-prose.ts` — `validateChapterPreCommitObligations`  
**Target:** `packages/prompts-llm/src/agent7-narrative.ts` — `buildUserRequest`

**Fix 1 — Agent 7 scene-function uniqueness (also addresses E1):**
Add to `buildUserRequest` a constraint requiring that each scene's `purpose` field must
contain a **unique investigative advancement** not duplicated in any prior scene summary.
Example injection:

```
SCENE UNIQUENESS RULE: Each scene's `purpose` field must describe a distinct investigative
milestone. Forbidden: two consecutive scenes whose purposes are both "interview suspect X"
or "re-examine clock evidence". Every Act II scene must move the investigation to a new
logical state (new suspect implicated, prior suspect cleared, new evidence relationship
established, false assumption strengthened, or trap set).
```

**Fix 2 — Location presence pre-commit check:**
In `validateChapterPreCommitObligations`, after the grounding-lead injection already runs,
add a soft check: if the scene's `setting.location` canonical string does not appear in
the first 400 words of the prose, log a warning and add the location name to the retry
directive. Do not hard-fail — grounding lead injection already provides a fallback.

_Risk:_ Low. Both are additive. The agent 7 prompt change may affect outline structure —
run a test generation to verify outlines don't degrade.

---

### Fix A4 — Investigation-state inconsistency (re-discovery)

**Target:** `packages/prompts-llm/src/agent9-prose.ts` — `buildNSDBlock`

**Fix:**
In `buildNSDBlock`, replace the bare clue-ID line:

```
CLUES ALREADY REVEALED TO READER: clue_1, clue_5, clue_9 — do not reveal these as new information.
```

with a richer injection that includes the clue's `description` field (1 sentence each):

```
CLUES ALREADY REVEALED TO READER — treat these as known facts, not new discoveries:
• [clue_1] The stopped clock showing ten minutes past eleven — already observed in chapter 2.
• [clue_5] The oil smell on the clock mechanism — already examined in chapter 4.
```

The `NarrativeState.cluesRevealedToReader` is an ID array. To include descriptions, the
`buildNSDBlock` caller must pass the full clue distribution alongside (it is already
available in `ProseGenerationInputs.clueDistribution`). Join on `clue.id` at format time.

_Risk:_ Minor token increase (approximately 20–30 tokens per revealed clue). With a
12-clue story and 8 revealed by chapter 10, this is ~300 extra tokens in the critical-
priority NSD block. Acceptable. The token budget allocator already handles critical-block
overflow by truncating `optional` blocks first.

**Do NOT:**
- Add a `clueDescriptions: Record<string, string>` field to `NarrativeState` itself — the
  descriptions are already available from `clueDistribution` at format time and should not
  be duplicated in the state object.

---

### Fix B1 — Pronoun drift (multi-character scenes)

**Target:** `packages/story-validation/src/pronoun-repair.ts` — `repairPronouns`  
**Target:** `apps/worker/src/jobs/agents/agent9-run.ts` — retry directive

**Fix 1 — Extend repair to "speaker-verb-said" pattern in multi-character sentences:**
In `repairPronouns`, within the `mentioned.length >= 2` branch (currently skipped), add a
narrow additional repair: if the sentence matches `/(he|she) (said|asked|replied|answered|
murmured|whispered|shouted)/i` and exactly one character in `mentioned` has that gender
while the sentence also contains `"${otherCharacterName} said"` pointing to a different
character, treat the pronoun as unambiguous and repair it.

This is a surgical extension to the existing conservative logic. It only fires when the
speaker-verb pattern is unambiguously attributable — exactly the case where the current
code's skip-if-2+ rule produces false negatives.

_Risk:_ The repair is still gated on a clean attribution pattern. No wider heuristic
changes. Sentences where attribution is genuinely ambiguous are still skipped.

**Fix 2 — Retry directive escalation for persistent pronoun failures:**
In agent9-run.ts, in the retry-loop chapter-generation block, if on attempt 2 or 3 the
pronoun drift error is for the same character as the previous attempt, augment the retry
system directive with a targeted instruction:

```
CRITICAL OVERRIDE FOR THIS RETRY: ${characterName} uses ${pronounSet} pronouns exclusively.
The previous ${n} attempts all used wrong pronouns for this character in this chapter.
Write every reference to ${characterName} in this chapter and verify the pronoun before
final output.
```

This uses the existing retry loop without adding any new retry dimension — it only
enriches the retry context on repeat failures.

_Risk:_ Low. The escalation is additive text in an existing prompt pathway. The outer
max-retry bound (3) is unchanged.

**Do NOT:**
- Lower the "skip if 2+ characters" threshold globally — this would introduce false
  repairs in legitimate "She looked at him" constructions.
- Add a fourth retry attempt — the existing 3 is the correct bound.

---

### Fix B2 — Speaker attribution instability

**Covered by Fix B1 Fix 1 above** (the speaker-verb-said pattern repair). No additional
changes needed beyond B1. The `repairDialogueAttributionPronouns` function already handles
the primary misattribution pattern and should not be widened further without targeted
evidence of new failure modes.

---

### Fix B3 — Character voice homogenisation

**Target:** `packages/prompts-llm/src/agent65-world-builder.ts` — system prompt

**Fix:**
Add a constraint to agent 65's system or developer prompt requiring that each character's
`voiceDescription` and `fragments` must be demonstrably distinct from every other character's.
Example:

```
VOICE DIVERSITY REQUIREMENT: Each character's voice must be distinctly different from
all others. Before outputting voice sketches, verify:
- At least one character uses short, clipped sentences (≤8 words average)
- At least one character uses complex subordinate clauses or formal register
- No two characters share the same opening word pattern in their fragments
Similarity between voice sketches is a generation failure.
```

_Risk:_ Prompt-only change. Agent 65 output schema is unchanged. The constraint only
affects LLM text generation within the existing structure.

---

### Fix C1 — Weak causal chain

**Target:** `packages/prompts-llm/src/agent9-prose.ts` — `buildChapterObligationBlock`

**Fix:**
For chapters where a clue obligation includes a `pointsTo` value (the "Points to:"
inference step), extend the obligation checklist item to require an explicit reasoning
paragraph, not just clue placement:

```
□ Chapter N: Place "[clue description]" in the first 25% of the chapter.
□ Chapter N (MANDATORY FOLLOW-THROUGH): Immediately after the clue is observed, 
  the detective/narrator must reason through: why this observation matters and what 
  it implies. The reasoning must connect the observation to: "${clue.pointsTo}".
  This is not optional atmospheric text — it is a logical deduction paragraph.
```

This is an extension of the existing obligation checklist, not a new mechanism.

_Risk:_ Increases chapter instruction density. If token budget for the obligation block is
tight, the extra lines could truncate a later clue's obligation. The obligation block is
`critical` priority and should not be truncated — but verify this holds for long
multi-clue chapters.

---

### Fix C2 — Premature suspect convergence

**Target:** `packages/prompts-llm/src/agent7-narrative.ts` — `buildUserRequest`

**Fix:**
Add a suspicion-balance rule to the agent 7 outline prompt:

```
SUSPICION BALANCE (Act I and Act II): Every named suspect must receive roughly equal
atmospheric weight before chapter ${culpritRevealChapter - 2}. Forbidden: singling out
one suspect for negative framing, ominous asides, or suspicious behaviour references 
in more than 30% of Act II scenes. The culprit should not stand out as the most-
referenced character in any single act.
```

_Risk:_ Prompt-only. May make outlines slightly more conservative in atmospheric signaling.
This is the correct trade-off — under-atmospheric is recoverable in prose; over-signaled
culprit identity is not.

---

### Fix C3 — Confession-dependent resolution

**Target:** `packages/prompts-llm/src/agent3-cml.ts` (or whichever CML generation prompt drives agent 3)  
**Target:** `schema/cml_2_0.schema.yaml`

**Fix 1 — Schema enum constraint:**
Change `revelation_method` from `type: string` to an enum:

```yaml
revelation_method:
  type: string
  enum:
    - contradiction_trap
    - involuntary_knowledge_reveal
    - physical_evidence_only
    - alibi_collapse
    - detective_reconstruction
    - confession_under_evidence
  required: true
```

`confession_under_evidence` is the weakest permitted value but requires that evidence
was presented before the confession. A bare `confession` value is no longer valid.

**Fix 2 — Agent 3 CML prompt steering:**
In the agent 3 prompt, add:

```
The `revelation_method` must be evidence-driven. Prefer: contradiction_trap,
involuntary_knowledge_reveal, or alibi_collapse. "Confession" alone is not
permitted — a confession must be triggered by prior evidence confrontation.
```

_Risk for Fix 1:_ Schema change will cause validation failures on any CML generated by
an old agent 3 that used free-text revelation methods. This is intentional — the schema
is a correctness gate. Ensure agent 3 is updated before the schema validation is run.
Always deploy the prompt fix (Fix 2) before or simultaneously with the schema fix (Fix 1).

**Do NOT:**
- Apply the schema change without simultaneously updating agent 3 — this would cause
  all new generations to fail schema validation until the prompt is updated.

---

### Fix C4 — Motive underdevelopment

**Target:** `packages/prompts-llm/src/agent9-prose.ts` — `buildContextSummary` or `buildNSDBlock`

**Fix:**
Extract the culprit's `motive` from the CML and inject it alongside the victim identity
rule in the context summary as a locked narrative fact:

```
MOTIVE LOCK: The culprit's motive is: "${motive}". Every scene involving the culprit
must remain consistent with this motive. Do not introduce alternative motivations
(jealousy becomes ambition, protection becomes revenge). One dominant motive arc.
```

The motive is already available in `inputs.caseData.culpability.motive`.

_Risk:_ Low. Additive text injection. Does not change any validation gate.

---

### Fix D1 — Repetitive atmospheric templating

**Correction to analysis:** `detectRecurringPhrases` IS connected to
`runAtmosphereRepairIfNeeded` in agent9-run.ts (line 4081). Post-hoc repair of
recurring phrases is already implemented. The gap is that this runs only once, after all
chapters are complete — it cannot prevent phrase accumulation during generation, only
repair after.

**Fix — Forward injection of used phrases into next batch:**
Extend `updateNSD` to accept an `atmosphericPhrases` parameter — a short list (≤8) of
sensory phrases extracted from completed chapters using `extractSensoryPhrases()` (which
already exists in narrative-state.ts). Inject these into `buildNSDBlock` as:

```
AVOID REUSING THESE ATMOSPHERIC PHRASES (already used):
"chill air", "heavy curtains", "palpable silence" — find fresh expressions instead.
```

The `NarrativeState` already had a `usedSensoryPhrases` field in earlier versions (per
the `.d.ts` declaration). The current `.ts` source simplified this out, but the
infrastructure is understood. Re-adding `usedSensoryPhrases?: string[]` as optional is
backward compatible.

_Risk:_ The post-hoc `runAtmosphereRepairIfNeeded` remains as-is — this fix adds
proactive prevention, not a replacement. The two mechanisms stack safely.

---

### Fix D2 — Telling instead of dramatising

**Target:** `packages/prompts-llm/src/agent9-prose.ts` — `buildPromptContextBlocks`

**Fix:**
Change `craft_guide` priority from `'optional'` to `'high'`:

```typescript
{ key: 'craft_guide', content: sections.craftGuideBlock, priority: 'high' },
```

The `craft_guide` block is currently the first to be truncated under token pressure
(it is `'optional'`). This makes show-vs-tell guidance disappear on the chapters where
token pressure is highest — which are typically the most complex scenes. Promoting it
to `high` ensures it survives the token allocator.

_Risk:_ Under extreme token pressure, this displaces `location_profiles` (`medium`)
and `temporal_context` (`medium`) instead. Verify that the temporal_context promotion
fix (Fix A1 Fix 1) takes precedence — if temporal_context is raised to `high` at the
same time, both survive together and `location_profiles` is the only `medium` remaining.
These two fixes (A1 + D2) should be applied together.

**Do NOT:**
- Promote craft_guide to `critical` — it must not compete with clue obligations and NSD
  state, which are the actual correctness constraints.

---

### Fix D3 — Redundant internal monologue

**Target:** `packages/prompts-llm/src/types/narrative-state.ts`, `buildNSDBlock`

**Fix:**
Add to `NarrativeState`:

```typescript
/** Key internal reflection phrases already expressed by the detective — 
 *  used to prevent repeating the same introspective beat across chapters. */
usedMonologueBeats?: string[];
```

After each chapter, in `updateNSD`, extract 2–3 dominant internal reflection phrases
from the completed chapter text (simple pattern: sentences starting with "I" in
first-person, or containing "wondered", "weighed", "considered", "reminded
myself" in third). Append to `usedMonologueBeats`, keeping the last 10.

In `buildNSDBlock`, inject as:

```
INTERNAL MONOLOGUE VARIETY: These reflection beats have already been expressed —
do not repeat them as new insight:
• "the weight of unspoken accusations"
• "time was slipping away from me"
```

_Risk:_ Optional field — backward-compatible addition. The extraction heuristic should
be conservative (short multi-word phrase, not full sentence) to avoid false positives.

---

### Fix D4 — Tonal over-insistence

**Target:** `packages/prompts-llm/src/agent65-world-builder.ts` — emotional arc  
**Target:** `packages/prompts-llm/src/agent9-prose.ts` — `buildChapterObligationBlock`

**Fix:**
For each chapter, in addition to the emotional arc `toneDescription` (which is already
injected), add a mandatory **contrast beat** to the obligation contract:

```
TONAL CONTRAST REQUIREMENT: This chapter's dominant tone is "${toneDescription}".
However, it must contain at least one beat of contrast — a brief exchange, physical
detail, or interior observation that provides relief or ironic counterpoint to the
dominant register. Do not sustain maximum tension for every paragraph.
```

_Risk:_ Low. This is an instruction-only addition to the obligation contract. It does
not add a validation gate — only a generation constraint.

---

### Fix E1 — Scene redundancy

**Covered by Fix A3 Fix 1** (scene uniqueness rule in agent 7 `buildUserRequest`). No
separate fix required. The same constraint that prevents location drift by requiring
distinct scene purposes also prevents investigative function duplication.

---

### Fix E2 — Chapter segmentation without escalation

**Target:** `packages/prompts-llm/src/agent7-narrative.ts` — `buildUserRequest`

**Fix:**
Add a per-act escalation ladder to the outline request:

```
ACT II ESCALATION LADDER: The 9 Act II scenes must progress through these milestones
in order (not necessarily one per scene, but each milestone must appear before the next):
1. Initial suspect pool established (all suspects identified)
2. First suspect partially cleared (one alibi element confirmed)
3. False assumption strengthened (misleading evidence planted)
4. Clock/time evidence central scene (the hard logic device first examined)
5. Second suspect partially cleared or implicated more deeply
6. A contradiction observed (two pieces of evidence cannot both be true)
7. False assumption begins to crack (something inconsistent noticed)
8. Trap set or confrontation prepared
9. Act II close: investigator in a worse or more dangerous position than Act II open
No two consecutive scenes may leave the investigation at the same logical state.
```

_Risk:_ This is a strong structural constraint on agent 7. Run it against a test
generation to verify the outline LLM can satisfy the ladder reliably. If it produces
degenerate outlines (skips milestones, repeats them), soften to 5 mandatory milestones
rather than 9.

---

### Fix E3 — Word-count inflation

**Target:** `packages/prompts-llm/src/agent9-prose.ts` — `buildChapterObligationBlock`

**Fix:**
Extend the word count instruction from:

```
Word count: Target ${wordTarget.targetWords} words. Do not cut this chapter short.
```

to:

```
Word count: Target ${wordTarget.targetWords} words. Achieve this through plot events,
dialogue exchanges, and physical investigation — not through atmospheric repetition or
extended internal reflection. Each 200-word segment should contain at minimum one 
concrete story event (a discovery, a conversation exchange, a physical action or 
movement). Padding with atmosphere alone is not acceptable.
```

_Risk:_ The "do not cut this chapter short" instruction is preserved. The addition only
specifies _how_ to reach the word count, not a different target. No regression risk.

---

### Fix F1 — Unreliable clue presentation

**Downstream fix:** F1 is addressed by the combination of:
- Fix A1 (time value consistency pre-commit check)
- Fix A4 (richer clue-revealed injection with descriptions)
- The existing `appearsInChapters` first-chapter scoping (already applied this session)

No additional standalone fix is required beyond the upstream fixes.

---

### Fix F2 — Accidental ambiguity

**Downstream fix:** F2 is the aggregate symptom of A1–A4, B1, B2, and F1. It has no
standalone fix. As upstream fixes land, the residual accidental ambiguity rate will drop.
The metric for progress is a reduction in `ProseScorer` ambiguity flags and a reduction
in `checkLockedFacts` moderate violations per run.

---

## 9. Implementation Order

The fixes form a dependency graph. Apply in this order to guarantee progress without
regression:

### Wave 1 — Safe, pure additions (no regression risk) ✅ IMPLEMENTED

All 6 Wave 1 fixes implemented and verified. **497 tests pass, 0 failures.**

| Fix | Change type | File | Status |
|-----|------------|------|--------|
| D2 craft_guide → high | 1-line priority change | agent9-prose.ts | ✅ Done |
| A1 temporal_context → high | 1-line priority change | agent9-prose.ts | ✅ Done |
| A2 victimConfirmedDeadChapter field | Optional type extension + NSD injection | narrative-state.ts, agent9-prose.ts | ✅ Done (see Bug A2 below) |
| C4 Motive lock injection | Additive text in buildContextSummary | agent9-prose.ts | ✅ Done (see Bug C4 below) |
| D4 Tonal contrast beat | Additive obligation instruction | agent9-prose.ts | ✅ Done (see Bugs D4a/D4b below) |
| E3 Word-count quality instruction | Additive instruction extension | agent9-prose.ts | ✅ Done |

#### Wave 1 post-implementation bugs found and fixed

**Bug C4 — Motive path was dead code (both fallback paths wrong for CML 2.0)**
Original code: `cmlCase.culpability?.motive ?? (caseData as any)?.solution?.culprit?.motive ?? ''`
- `culpability.motive` does not exist — `culpability` section only has `culprit_count` and `culprits`
- `solution.culprit.motive` does not exist — CML 2.0 has no `solution` key (legacy format)
- Actual location: culprit character's `motive_seed` field at `CASE.cast.characters[n].motive_seed`
Fixed: look up culprit by name via `culpability.culprits` set, then read `character.motive_seed`.

**Bug D4a — Tonal contrast fired unconditionally including on discriminating test chapters**
`isDiscriminatingTestChapter` was in scope but not used as a guard. Instructing "include a beat of
relief" on a revelation/confrontation chapter directly contradicts its required maximum tension.
Fixed: guarded with `if (!isDiscriminatingTestChapter)`.

**Bug D4b — `dominantRegister` was story-level, not per-chapter (same label on all 12 chapters)**
`storyEmotionalArc.dominantRegister` is the single story-wide register (e.g. "brooding melancholy").
Threading it into every chapter obligation produced identical labels regardless of arc position.
Per-chapter register is already correctly injected by `buildWorldBriefBlock` via `turningPoints`.
Fixed: removed `dominantRegister` parameter from `buildChapterObligationBlock` and call site.
Contrast instruction is now generic: "include at least one beat of relief or ironic counterpoint."

**Minor: Bug A2 — `victimConfirmedDeadChapter` is never SET (feature is latent dead code)**
The type definition and NSD injection are correctly implemented. However no caller of `updateNSD`
currently sets the field. The feature will silently never fire until the mystery-orchestrator
(`agent9-run.ts:onBatchComplete`) is wired to detect victim-death confirmation and set the field.
This is left as a Wave 3 item — the code is correct, only the setter is missing.

**Ordering fix: tonal contrast moved after clue obligations**
Previously sat between word count and location anchor (two structural constraints). Moved to after
clue obligations, where it sits as a soft quality nudge after all structural requirements.

### Wave 2 — Prompt additions to upstream agents

| Fix | Change type | File |
|-----|------------|------|
| A3 / E1 Scene uniqueness rule | Additive agent 7 prompt rule | agent7-narrative.ts |
| C2 Suspicion balance rule | Additive agent 7 prompt rule | agent7-narrative.ts |
| E2 Act II escalation ladder | Additive agent 7 prompt rule | agent7-narrative.ts |
| B3 Voice diversity requirement | Additive agent 65 prompt rule | agent65-world-builder.ts |
| C3 Fix 2 — CML prompt steering | Additive agent 3 prompt rule | agent3-cml.ts |

### Wave 3 — Code additions to runtime and state

| Fix | Change type | File |
|-----|------------|------|
| A4 Rich clue-revealed injection | NSD formatter enhancement | agent9-prose.ts |
| D1 usedSensoryPhrases re-add | Optional NSD field + updateNSD | narrative-state.ts, agent9-prose.ts |
| D3 usedMonologueBeats | Optional NSD field + updateNSD | narrative-state.ts, agent9-prose.ts |
| C1 Inference deduction paragraph | Obligation checklist extension | agent9-prose.ts |
| B1 Fix 2 Retry escalation | Additive retry context | agent9-run.ts |

### Wave 4 — Code changes with regression verification required

| Fix | Change type | Verification needed |
|-----|------------|---------------------|
| B1 Fix 1 Speaker-verb repair | New repair branch in repairPronouns | Unit tests for new and existing repair paths |
| A1 Fix 2 Pre-commit time check | New validator in validateChapterPreCommitObligations | Verify scope-gate logic prevents false positives |
| A3 Fix 2 Location presence check | New soft check in validateChapterPreCommitObligations | Verify doesn't fire for valid openings |

### Wave 5 — Schema changes (highest revision gate)

| Fix | Change type | Deployment constraint |
|-----|------------|----------------------|
| C3 Fix 1 revelation_method enum | Schema YAML + validator update | Must deploy agent 3 prompt (C3 Fix 2) first |

**Do NOT apply Wave 5 before Wave 2 C3 Fix 2 is verified to produce valid enum values.**

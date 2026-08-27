# Story Review Analysis — story_20260520-2018

> Populated from `stories/story_20260520-2018/chatgpt-review.txt`
> Template: [REVIEW-ANALYSIS-TEMPLATE.md](./REVIEW-ANALYSIS-TEMPLATE.md)

---

## Progress Table

| # | Category | Issue Cluster | Strategic Fix | Status | Code Location |
|---|----------|--------------|---------------|--------|--------------|
| P1 | Prose / polish | Pronoun drift — Eleanor (she→he), Hale (he→her) | FIX-C1: Cast pronoun lock in chapter prompt | � Done (PHASE 1 `buildPronounAccuracyBlock`) | `agent9-prose.ts → buildChapterObligationBlock` |
| P2 | Prose / polish | Ledger-style exposition ("interval came to forty minutes") | FIX-PR1: Forbid arithmetic sentences in prose | 🟢 Done (DEBUG_NOTE_PATTERNS) | `agent9-prose.ts → lintBatchProse` |
| P3 | Prose / polish | Template opening phrases / atmosphere boilerplate | FIX-PR2: Extend template_bleed forbidden-phrase list | 🟢 Done (Groups A+B+C added) | `agent9-prose.ts → lintBatchProse` |
| P4 | Plot structure | Chapters 4, 6, 7 repeat same Hale confrontation | FIX-P1: Chapter-beat uniqueness gate | 🟢 Done (USED_BEATS from beatHistory) | `agent9-prose.ts → buildChapterObligationBlock` |
| P5 | Opening hook | Ch1 states clock mechanism directly (no discovery) | FIX-S1 / FIX-M3: Clue-stage embargo | 🟢 Done (clueStageForRun injection) | `agent9-prose.ts → buildChapterObligationBlock` |
| P6 | Mystery clues | DT chapter (Ch7) has no new observable fact | FIX-M1: DT chapter new-fact requirement | 🟢 Done (NEW OBSERVABLE FACT REQUIRED) | `agent9-prose.ts → buildChapterObligationBlock` |
| P7 | Mystery clues | Draught → Hale access chain never closed | FIX-M2: Reveal completeness checklist | 🟢 Done (EVIDENCE CHAIN REQUIRED) | `agent9-prose.ts → buildChapterObligationBlock` |
| P8 | Ending / reveal | Motive never stated; confession covers tampering only | FIX-E1: Motive + act sentence required in confession | 🟢 Done (KILL STATEMENT REQUIRED) | `agent9-prose.ts → buildChapterObligationBlock` |
| P9 | Ending / reveal | "him" in confession is unresolved ("protect him") | FIX-E1 (covers) | 🟢 Done (PRONOUN RESOLUTION requirement) | `agent9-prose.ts → buildChapterObligationBlock` |
| P10 | Pacing | "time is of the essence" repeated in Ch8 | FIX-P2: Cross-chapter phrase frequency lint | 🟢 Done (Group C stock-phrase lint) | `agent9-prose.ts → lintBatchProse` |
| P11 | Pacing | Timeline math between tavern / body discovery inconsistent | FIX-C3: Timeline lock in obligation block | 🟢 Done (culpritAlibiLock per chapter) | `agent9-prose.ts → buildChapterObligationBlock` |
| P12 | Character clarity | Victim (Finch) given alibi analysis in Ch9 | FIX-C2: Role-sanity gate — victim alibi forbidden | 🟢 Done (victim_alibi_error lint gate) | `agent9-prose.ts → lintBatchProse` |
| P13 | Character clarity | Culprit alibi changes (library vs. tavern) | FIX-C3: Alibi consistency lock | 🟢 Done (covered by culpritAlibiLock) | `agent9-prose.ts → buildChapterObligationBlock` |
| P14 | Mystery clues | Clue logic vague (ticking ≠ tampering) | FIX-M3: Clue-stage enforcement | 🟢 Done (covered by clueStageForRun) | `agent9-prose.ts → buildChapterObligationBlock` |
| P15 | Dialogue | Clues stated directly in dialogue (Ch1, Ch2) | FIX-D1: Clue-disclosure embargo in chapter system prompt | 🟢 Done (covered by clueStageForRun) | `agent9-prose.ts → buildChapterObligationBlock` |
| P16 | Dialogue | Confrontation loop with no new outcome (Ch4, Ch6, Ch7) | FIX-D2: Confrontation escalation rule in obligation block | 🟢 Done (CONFRONTATION ESCALATION REQUIRED) | `agent9-prose.ts → buildChapterObligationBlock` |

**Status key:** 🔴 Not started · 🟡 In progress · 🟢 Done · ⬛ Deferred

---

## Step 1 — Source Review

**Source story:** `stories/story_20260520-2018/`
**Review file:** `stories/story_20260520-2018/chatgpt-review.txt`
**Review date:** 2026-05-20
**Score: 60 / 100**

Cast:
- Victim: Dr. Mallory Finch (female)
- Investigator: Eleanor Voss (female)
- Cleared suspect: Beatrice Quill (female)
- Culprit: Captain Ivor Hale (male)

Key clues: clock wound back forty minutes, empty sleeping-draught bottle, clock still ticking, Beatrice's tavern alibi.

---

## Step 2 — Issue Triage by Scoring Category

### 2.1 Premise / concept (score: 7/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Strong concept (false clock timeline + sleeping draught) — no systemic issue | — | Yes |

### 2.2 Opening hook (score: 6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Clock mechanism stated outright instead of revealed gradually | Ch1 | **No — generic** |
| Lines read as case-notes not prose ("The time was recorded as…") | Ch1 | **No — generic** |

### 2.3 Plot structure (score: 6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Same confrontation beat recycled (Hale + clock alibi) | Ch4, Ch6, Ch7 | **No — generic** |
| Discovery → accusation transition abrupt | Ch3→Ch4 | No — generic |
| Ch6 could be merged with Ch4 (no new content added) | Ch6 | **No — generic** |

### 2.4 Character clarity (score: 5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Eleanor referred to as "he" | Ch2, Ch4, Ch6, Ch7 | **No — generic** |
| Hale shifts between "he", "she", "her" | Ch2, Ch6 | **No — generic** |
| Victim Finch given alibi analysis ("alibi holds because she was found dead") | Ch9 | **No — generic** |
| Culprit alibi changes: library (Ch4) vs. tavern (Ch5) | Ch4, Ch5 | **No — generic** |

### 2.5 Dialogue (score: 5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Dialogue too direct — states clue rather than implying it | Ch1, Ch2 | No — generic |
| Repeated accusation/defence exchanges with no new content | Ch4, Ch6, Ch7 | **No — generic** |
| Awkward grammar in dialogue tags ("convene the entire team for a briefing what happened") | Ch4 | Partially |

### 2.6 Atmosphere / setting (score: 6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Generated atmosphere preamble lines | Ch1, Ch6 | **No — generic** |
| Location continuity: study vs. victim's room inconsistent | Ch1, Ch3 | Partially |

### 2.7 Mystery clues / evidence logic (score: 6/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Sleeping-draught → Hale access chain not established | Ch3, Ch9 | **No — generic** |
| DT chapter (Ch7) introduces no new fact, only repeats prior clues | Ch7 | **No — generic** |
| Clock ticking cited as proof of tampering — logic gap | Ch4 | **No — generic** |
| Culprit's motive not linked to evidence chain | Ch9 | **No — generic** |

### 2.8 Pacing (score: 5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Clock alibi explanation repeated three times | Ch1, Ch2, Ch6 | **No — generic** |
| Alibi-clearing chapter (Ch8) too long for new information delivered | Ch8 | **No — generic** |
| "time is of the essence" repeated multiple times | Ch8 | **No — generic** |
| Tavern alibi timing (11:00 strike → 11:10 return) needs distance explanation | Ch5 | Partially |

### 2.9 Ending / reveal (score: 5/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Culprit motive never stated explicitly | Ch9 | **No — generic** |
| Confession covers clock-tampering only, not the killing itself | Ch9 | **No — generic** |
| Unresolved pronoun in confession: "protect him" (who?) | Ch9 | Partially |
| Evidence chain not summarised before confession | Ch9 | **No — generic** |

### 2.10 Prose / polish (score: 4/10)

| Issue | Chapters | Story-specific? |
|-------|----------|-----------------|
| Ledger arithmetic in prose ("interval came to forty minutes") | Ch1 | **No — generic** |
| Repeated phrase "during here last night" (typo persists) | Ch1, Ch3 | Partially |
| Pronoun errors lower readability throughout | Multiple | **No — generic** |

---

## Step 3 — Strategic Fixes (Story-Agnostic)

> Full fix specifications are in [REVIEW-ANALYSIS-TEMPLATE.md](./REVIEW-ANALYSIS-TEMPLATE.md).
> This section maps the fixes to this story's specific failure evidence.

### CAT-4 — Character Clarity

#### FIX-C1: Pronoun Lock
**Evidence from this review:** Eleanor → "he" in Ch2, Ch4, Ch6, Ch7. Hale → "her" in Ch2,
Ch6. Three-character female cast makes this a persistent failure mode.

**Mechanism:** The `buildChapterObligationBlock` already injects cast names. Extend it with
a PRONOUNS block derived from `cast[].gender`:

```
PRONOUNS — never deviate:
  Eleanor Voss     → she / her
  Dr. Mallory Finch → she / her  [deceased — use past-tense contexts]
  Captain Ivor Hale → he / him
  Beatrice Quill   → she / her
```

This is fully story-agnostic: gender comes from CML `cast[].gender`, name from
`cast[].name`. No plot knowledge required.

---

#### FIX-C2: Victim Alibi Gate
**Evidence:** Ch9 — "Dr. Finch's alibi holds because she was found dead."
A victim needs no alibi; any sentence reasoning about one is a logic error.

**Alibi-verb cluster** — regex applied per sentence containing the victim's name:
```
/\b(alibi|was seen|could not have been|account for (her|his|their) time|whereabouts|where was (she|he)|her movements|his movements)\b/i
```
Flag as `victim_alibi_error`. Return the offending sentence in the error payload.

**Code location:** `agent9-prose.ts → lintBatchProse`, after the existing
`template_bleed` check. Pipeline hard-blocks on this error; preferred repair
path is MICRO-REGEN (replace only the flagged sentence, not the full chapter).

---

#### FIX-C3: Alibi Consistency Lock
**Evidence:** Hale placed in the Library (Ch4) then connected to the tavern (Ch5).
Lock `culprit_alibi_location` from CML `solution.opportunity.location` in the obligation
block. Any chapter that places the culprit elsewhere triggers a retry.

---

### CAT-5 — Dialogue (score: 5/10)

#### FIX-D1: Indirect Clue Disclosure Rule
**Evidence:** Ch1, Ch2 — characters state clues outright in dialogue ("The clock was wound
back forty minutes") rather than discovering them through action and reaction. Reader has
nothing left to discover.

**Fix:** Add to chapter system prompt for clue stages 1–3 (Ch1–Ch7):
```
CLUE DISCLOSURE — do not state clue mechanisms directly in dialogue.
Characters may observe, react to, and wonder about what they see or hear.
A character may NOT explain the mechanical reason for a clue until stage 4 (Ch8–9).

  WRONG: "The clock was wound back," Hale said. "Forty minutes."
  RIGHT: Eleanor stared at the clock. The minute hand was wrong — she was certain
         of it. She had checked the time from the hallway. It had not been eight
         minutes past when she looked.
```

**Code location:** `agent9-prose.ts → buildChapterSystemPrompt`, injected per
`clue_stage` value (stages 1–2 = strict embargo; stage 3 = inference only;
stage 4 = unrestricted).

---

#### FIX-D2: Confrontation-Loop Break
**Evidence:** Ch4, Ch6, Ch7 — Eleanor accuses Hale; Hale denies; no new outcome.
Three chapters sharing identical dramatic shape.

**Fix:** For any chapter whose beat is `confrontation` after a confrontation is
already logged in `USED_BEATS`, inject into the obligation block:
```
CONFRONTATION ESCALATION RULE:
A confrontation with this suspect has already occurred. This exchange MUST end
differently. Exactly one of the following is required:
  (a) New physical evidence is produced or discovered during the exchange.
  (b) The suspect reveals a detail not previously stated anywhere in the story.
  (c) The investigator revises her theory as a direct result of this encounter.
Do not write a confrontation that ends without new information.
```

**Code location:** `agent9-prose.ts → buildChapterObligationBlock`, keyed to
`beat === 'confrontation' && USED_BEATS.includes('confrontation')`.

---

### CAT-7 — Mystery Clues / Evidence Logic

#### FIX-M1: DT Chapter New-Fact Gate
**Evidence:** Ch7 title "The Discriminating Test" but content is a third Hale interrogation.
Inject into DT chapter prompt: "Introduce exactly one new physical or testimonial fact not
present in any prior chapter. Reference `discriminating_test.method`."
Chapter validator checks that at least one `supporting_clues[]` term appears for the first
time in this chapter.

---

#### FIX-M2: Reveal Completeness Checklist
**Evidence:** Ch9 missing (a) draught access path, (b) motive sentence, (c) explicit kill
statement.
Checklist injected into reveal prompt — see template FIX-M2.

---

#### FIX-M3: Clue-Stage Embargo
**Evidence:** Ch1 states clock mechanism directly. Reader has nothing to discover.
Chapter obligation block carries a `clue_stage` value (1–4) keyed to chapter index:

| Stage | Chapters | Permitted clue content |
|-------|----------|----------------------|
| 1 | 1–2 | Observe anomaly only (clock shows wrong time, bottle found empty) |
| 2 | 3–5 | Establish access + opportunity |
| 3 | 6–7 | Draw inference from evidence |
| 4 | 8–9 | State mechanism, close chain, confess |

---

### CAT-8 — Pacing

#### FIX-P1: Chapter-Beat Uniqueness Gate
**Evidence:** Clock alibi explained in Ch1, Ch2, Ch6 identically. Hale confronted in Ch4,
Ch6, Ch7 without new outcomes.

**Beat taxonomy** — mutually exclusive labels for the primary purpose of a chapter:

| Beat label | Description | Uniqueness rule |
|-----------|-------------|------------------|
| `discovery` | Body or primary crime scene found | Once only (Ch1) |
| `first_examination` | Initial physical evidence collected | Once only |
| `witness_interview` | A named character questioned for the first time | Once per character |
| `confrontation` | Culprit/suspect directly challenged with an accusation | Once per accusation angle |
| `alibi_check` | Alibi of a character established or tested | Once per character |
| `deduction` | Investigator draws an explicit inference from evidence | Once per inference |
| `clearing_innocent` | A suspect formally eliminated | Once per character |
| `discriminating_test` | New physical/testimonial fact surfaces for the first time | Must introduce new fact |
| `revelation` | Culprit named and evidence chain stated | Once only |
| `resolution` | Aftermath; confession confirmed; case closed | Once only |

**Beat extraction** (run after each chapter is accepted — one lightweight call, ~50 tokens):
```
Which ONE beat label from this list best describes the primary purpose of this chapter?
[beat_taxonomy_list]
Output the label only. One word.
Chapter excerpt: [FIRST_150_WORDS_OF_CHAPTER]
```

**USED_BEATS injection** (prepended to next chapter's obligation block):
```
BEATS ALREADY PLAYED — do not repeat:
  Ch1: discovery
  Ch2: first_examination
  Ch4: confrontation (Hale / clock alibi)
  ...
If this chapter would use a beat already listed, shift focus to the next
logical beat that has NOT yet been played.
```

**Retry trigger:** If the extracted beat matches a `USED_BEATS` entry (and is not
a structurally required beat like `revelation`), inject into the retry prompt:
```
RETRY REASON: Beat '[BEAT]' was already used in Ch[N]. This chapter must
advance the story differently — introduce new evidence, a new witness
statement, or a change in Eleanor's theory.
```

**Code location:** `agent9-prose.ts → buildChapterObligationBlock`. Beat log stored
in run context alongside existing `lockedFacts` registry.

---

#### FIX-P2: Repeated-Phrase Lint
**Evidence:** "time is of the essence" ×3 in Ch8. Other repeated weather/atmosphere lines.
Cross-chapter phrase frequency scan in `lintBatchProse`. 5-word n-gram, flag at ≥3
occurrences across different chapters.

---

### CAT-9 — Ending / Reveal

#### FIX-E1: Motive + Act Sentence in Confession
**Evidence:** Ch9 confession = "I was merely trying to protect him" — no kill statement,
no motive, unresolved pronoun.

Required confession shape:
```
"I [killed / poisoned / struck] [victim_name] because [concrete motive]."
```

CML provides `solution.motive` — inject it as a locked field that the confession must
reference. Chapter validator checks for first-person + past-tense kill-verb within
5 sentences of culprit's name.

---

### CAT-10 — Prose / Polish

#### FIX-PR1: Forbid Arithmetic Sentences
**Evidence:** "The interval between the positions came to forty minutes."
Forbidden-pattern list in chapter system prompt — see template FIX-PR1.

#### FIX-PR2: Extend Template-Bleed Lint
**Status:** Partially done (R2 gate covers room-list preamble). Extend with three
forbidden phrase groups.

**Group A — Weather/atmosphere openers** (check: first sentence of each chapter):
```
"The rain fell"  "The wind howled"  "The fog lay"  "The mist hung"
"Outside, the"   "The night was"    "The storm"    "The darkness"
"The silence"    "The air was thick"
```
Block = hard (trigger full chapter retry).

**Group B — Ledger-style exposition** (check: any sentence in the chapter):
```
"was recorded as"      "was noted to be"      "was found to show"
"had been established" "came to X minutes"    "a difference of"
"a total of"           "an interval of"       "It was now known"
"It had been determined"
```
Block = hard for the offending sentence; MICRO-REGEN preferred over full retry.

**Group C — Repeated stock phrases** (check: cross-chapter, flag if phrase appears
in ≥ 2 different chapters):
```
"time is of the essence"  "pressed for time"       "no time to lose"
"the investigation continues"  "wasted no time"     "not a moment to spare"
"every moment counts"     "the clock was ticking"
```
Block = soft; trigger MICRO-REGEN to replace the duplicate instance.

**Code location:** `agent9-prose.ts → lintBatchProse`. Groups A/B extend the
existing `FORBIDDEN_OPENING_PATTERNS` constant. Group C adds a new
`crossChapterPhraseCheck()` helper that runs after all chapters are accepted.

---

## Step 4 — Implementation Plan

| Wave | Fix IDs | Score gain target | Effort | Acceptance criteria |
|------|---------|-------------------|--------|---------------------|
| Wave 1 | FIX-C1 (pronouns), FIX-PR2 (bleed) | +5–7 | Low | `lintBatchProse` pronoun violations = 0 across all 9 chapters; Groups A/B template-bleed hits = 0 |
| Wave 2 | FIX-E1 (confession), FIX-M2 (reveal chain) | +4–5 | Medium | Ch9 validator: kill-verb present AND `victim_name` present AND `solution.motive` term detected within 5 sentences of culprit name; evidence chain items (a)–(d) all pass |
| Wave 3 | FIX-M1 (DT new fact), FIX-M3 (clue stage), FIX-D1 (clue disclosure), FIX-D2 (confrontation loop) | +4–6 | Medium | DT chapter (Ch7): ≥1 `supporting_clues[]` term appears for first time; clue-stage gate: Ch1–2 contain no mechanism statement; confrontation-outcome gate: each confrontation ends with item (a), (b), or (c) |
| Wave 4 | FIX-P1 (beat uniqueness), FIX-P2 (phrase freq) | +2–3 | Medium | USED_BEATS log: no duplicate beat label in Ch3–Ch8; Group C cross-chapter count ≤1 per phrase |
| Wave 5 | FIX-C2 (victim alibi), FIX-C3 (alibi lock), FIX-PR1 (arithmetic) | +1–2 | Low | `victim_alibi_error` = 0; culprit location matches `solution.opportunity.location`; Group B arithmetic = 0 |

**Target:** 60 → 78+ after Waves 1–3 (Dialogue +2 added to Wave 3 estimate).
**Retry budget per chapter:** 5 attempts before escalating to REFLEXION loop.
**Canary pass definition:** Pipeline exit 0 on 3 consecutive fresh runs.

---

## Step 5 — Progress

| Wave | Fixes shipped | Canary score | Delta |
|------|--------------|-------------|-------|
| Baseline | — | 60/100 | — |
| Wave 1 | | | |
| Wave 2 | | | |
| Wave 3 | | | |
| Wave 4 | | | |
| Wave 5 | | | |

---

## Step 6 — Proposed Fixes: Full Technique Taxonomy

> Steps 3–5 cover *what* to fix (prompt constraints and gates).
> This step thinks more broadly about *how* to fix it, drawing from established
> prompt-engineering patterns (CoT, Reflexion, Self-Consistency, Prompt Chaining,
> Few-Shot, LLM-as-judge) and architectural approaches.
> All proposals are story-agnostic; this section shows how they apply to
> the specific failures in the 60/100 run.

### 6.0 — Technique Reference

| Type | Description | Effort | Best for |
|------|-------------|--------|---------|
| **CONSTRAINT** | Explicit forbidden/required text injected into the system prompt | Low | Prose polish, character clarity |
| **STATE** | Running cross-chapter facts block injected into every chapter prompt | Low–Med | Consistency, pacing |
| **SCHEMA** | Extend the CML data model to carry pre-computed constraints | Med | Any consistency issue |
| **GATE** | Post-generation validator that blocks + retries on failure | Med | Any detectable error |
| **COT** | Require the model to reason step-by-step before writing prose | Med | Logic, clue chains, pacing |
| **FEW-SHOT** | Add a concrete good/bad example pair to the prompt | Low | Prose quality, dialogue, openings |
| **CHAIN** | Split one prompt into two sequential LLM calls: plan → prose | Med–High | Structure, clue ordering |
| **REFLEXION** | Model critiques its own draft, then rewrites it | Med | Repetition, weak logic |
| **SELF-CONSISTENCY** | Generate N drafts, validate all, accept best | High | Hard constraint satisfaction |
| **MICRO-REGEN** | Regenerate only the failing sentence, not the whole chapter | Med | Isolated prose errors |
| **LLM-JUDGE** | Separate LLM call scores the chapter before final acceptance | Med–High | Holistic quality, semantics |
| **ARCHITECTURE** | Change when/how chapters are generated | High | Structural and pacing issues |

---

### 6.1 — Character Clarity (score 5/10 — biggest single drag)

**Issues:** Eleanor → "he" (Ch2, Ch4, Ch6, Ch7); Hale → "her" (Ch2, Ch6);
Finch given alibi analysis (Ch9); Hale alibi contradicts itself (Ch4 vs. Ch5).

#### CONSTRAINT — Cast Pronoun Block
Add to every chapter system prompt (derived from `cast[].gender`):
```
PRONOUNS — never deviate:
  Eleanor Voss      → she / her
  Dr. Mallory Finch → she / her  (deceased; refer to past actions)
  Captain Ivor Hale → he / him
  Beatrice Quill    → she / her
```
**Why this fails without it:** LLM infers gender from honorifics and plot cues.
"Captain" primes masculine inference; a mostly-female cast creates
cross-character substitution when character names are close together in context.

#### SELF-CONSISTENCY — Pronoun-Safe Chapter Selection
Generate 3 chapter drafts (temperature 0.7). Run `lintBatchProse` pronoun check on
each. Accept the draft with zero violations. If all three fail, switch to the
Reflexion loop.

*Rationale (Wang et al., 2022):* Self-consistency outperforms single-generation
on tasks requiring constraint satisfaction because it samples the output space
rather than relying on greedy decoding.

**Token cost table — this run:**

| Scenario | LLM calls | Approx tokens | Applies to |
|----------|-----------|--------------|------------|
| Normal (CONSTRAINT only) | 1 | ~800 | Ch1, Ch3, Ch5, Ch8, Ch9 |
| Self-consistency (3 drafts) | 3 | ~2,400 | Ch2, Ch4, Ch6, Ch7 (Eleanor + Hale both present) |
| Self-consistency → Reflexion fallback | 4 | ~2,700 | All 3 SC drafts fail pronoun check |
| Reflexion only (beat duplicate) | 3 | ~2,000 | Any chapter whose beat matches USED_BEATS |

**Budget gate:** `reflexion_budget = 2` (max Reflexion activations per story run).
If budget is exhausted, fall back to standard retry with an explicit pronoun
CoT preamble instead of sampling three drafts.

#### SCHEMA — Add `pronouns` to Cast Schema
Add to CML `cast[]`:
```yaml
pronouns:
  subject: she    # he / she / they
  object: her     # him / her / them
  possessive: her # his / her / their
```
These become the authoritative source for the CONSTRAINT block above, removing
any ambiguity in derivation from `gender` string values.

#### GATE — Alibi Consistency Validator
Lock `culprit_alibi_location` from `solution.opportunity.location`. After each
chapter is accepted, scan for the culprit's name within a 20-word window of any
location noun. If a new location appears, trigger a targeted retry with feedback:
```
RETRY REASON: [CULPRIT_NAME] was placed at [NEW_LOCATION] in this chapter.
The established alibi location is [LOCKED_LOCATION]. Remove or correct this.
```

---

### 6.2 — Mystery Clues / Evidence Logic (score 6/10)

**Issues:** DT chapter (Ch7) has no new fact; draught→Hale chain not closed;
"clock ticking = tampering" is not logically sufficient; motive not in evidence chain.

#### COT — Chapter-Level Novelty Reasoning
Before generating each chapter's prose, add a reasoning preamble to the prompt
(based on Wei et al., 2022 Chain-of-Thought):
```
Before writing this chapter, answer these three questions in 1–2 sentences each.
Do not include the answers in the prose — they are for your internal reasoning only.

1. What single new fact (physical object, location, or testimony) does this chapter
   add that was absent from all previous chapters?
2. How does this fact advance the chain from anomaly → access → mechanism → culprit?
3. What one question does this chapter leave open for the reader?

Now write the chapter.
```
**Effect on this story:** Forcing the model to name the new fact before writing
prevents "interrogation loop" chapters that re-ask the same questions.

#### CHAIN — Plan-Then-Prose for DT and Reveal Chapters
For chapters flagged as `discriminating_test` or `reveal` (the two chapters most
prone to structural failure):

**Call 1 — Plan (JSON):**
```
Generate a chapter plan as JSON. Do not write prose yet.
{
  "chapter_number": 7,
  "beat": "discriminating_test",
  "new_observable_fact": "[one sentence describing the new physical fact]",
  "how_it_implicates_culprit": "[one sentence logical link]",
  "prior_clues_not_repeated": ["clock anomaly", "bottle location"]
}
```
**Call 2 — Prose:** Pass the validated JSON plan. "Write the chapter from this plan."

**Effect:** The plan is cheap to validate (schema + logic check). If it's missing a
`new_observable_fact`, retry the plan before spending tokens on prose.

#### SCHEMA — Add `clue_introduction_chapter` to Clues
```yaml
clues:
  - id: clock_tamper
    description: "Clock hands wound back forty minutes"
    introduction_chapter: 1   # first chapter allowed to OBSERVE this anomaly
    inference_chapter: 6      # first chapter allowed to STATE the implication
    confirmation_chapter: 9   # chapter that closes the chain
```
The obligation block emits a `CLUE STAGE` rule per chapter keyed to these values.
No guess-work about what the model "should" know at each stage.

---

### 6.3 — Plot Structure / Pacing (scores 6/10 and 5/10)

**Issues:** Ch4, Ch6, Ch7 repeat same Hale confrontation; clock alibi explained ×3;
"time is of the essence" repeated in Ch8.

#### REFLEXION — Repetition Removal Loop
**Trigger condition:** After each chapter is accepted, run beat extraction (see
FIX-P1). If the extracted `beat_label` matches any value already logged in
`USED_BEATS`, activate the Reflexion loop *before* adding the chapter to the
story. This catches chapters that pass individual lint checks but duplicate a
prior chapter's narrative purpose at the story level.

When triggered:

**Call 1 (Critique):**
```
System: You are a mystery story editor. Read this chapter and the chapter
summaries below. List every sentence or exchange that repeats content already
established. Quote each repeated element exactly.

[CHAPTER TEXT]

Prior chapter summaries:
[CHAPTER_1_SUMMARY] ... [CHAPTER_N_SUMMARY]
```

**Call 2 (Revise):**
```
Rewrite this chapter. Remove or replace every repeated element the editor
identified. Keep everything new. Do not introduce new characters or clues
not already established.
```

*Based on Shinn et al. (2023) Reflexion:* Self-evaluation and verbal reinforcement
consistently outperforms single-pass generation on tasks requiring constraint
maintenance across long contexts.

#### ARCHITECTURE — Beat-First Story Arc Planning
Before any chapter prose is generated, run a single "story arc" planning call:
```
Generate a 9-chapter beat plan as a JSON array. Each beat must be unique.
No two chapters may share the same primary confrontation or clue explanation.

Output:
[
  { "ch": 1, "beat": "discovery",         "new_clue": "clock anomaly",   "opens": "who accessed the clock?" },
  { "ch": 2, "beat": "first_examination", "new_clue": "draught bottle",  "opens": "who had the draught?" },
  { "ch": 3, "beat": "access_inquiry",    "new_clue": "Hale key access", "opens": "was Hale alone?" },
  ...
]
```
Validate: no duplicate `beat` values, no duplicate `new_clue` values.
Each chapter prompt is then given its beat record as a locked constraint.

**Effect:** The pipeline can detect structural repetition *before* generating prose,
saving the cost of N full chapter retries.

**Pipeline integration:**
```typescript
// apps/worker/src/jobs/agents/agent9-run.ts (or canary-core equivalent)
// After cmlCase is loaded and validated, before the chapter generation loop.
const storyArc = await buildStoryArc(cmlCase, llmClient);
// buildStoryArc() is a new function in agent9-prose.ts (~200-token planning call)
validateStoryArc(storyArc);  // assert: no duplicate beat, no duplicate new_clue
context.storyArc = storyArc;

// In buildChapterObligationBlock():
const beatRecord = context.storyArc[chapterIndex];
// Inject beatRecord.beat, beatRecord.new_clue, beatRecord.opens into obligation block.
```
`validateStoryArc` fails-fast if any two chapters share the same `beat` or `new_clue`;
retry `buildStoryArc` up to 3 times before aborting the run.

#### STATE — Used-Beats Injection
After each chapter is accepted, append to a `USED_BEATS` state block:
```
BEATS ALREADY PLAYED — do not repeat any of these in this chapter:
  Ch1: discovery of body, clock observed
  Ch2: draught bottle found
  Ch4: Hale questioned about alibi (library claim)
  ...
```
This is the cheapest intervention. No extra LLM calls. Injected into the
chapter system prompt alongside the existing obligation block.

---

### 6.4 — Dialogue (score 5/10)

**Issues:** Clues stated directly in dialogue (Ch1, Ch2); confrontation loop with
no escalation (Ch4, Ch6, Ch7).

#### CONSTRAINT — Clue-Disclosure Embargo
Add to system prompt for clue stages 1–3 (see FIX-D1 above).
The constraint text carries a good/bad inline example (see FEW-SHOT below).
No extra LLM calls; enforced entirely through prompt engineering.

#### FEW-SHOT — Good/Bad Dialogue Examples
Add to the chapter system prompt alongside the clue-disclosure constraint:
```
EXAMPLE — WRONG (do not write this):
  "The clock was wound back," Hale said. "Forty minutes. Enough to put me at
  supper when she died."
[WRONG: culprit explains the mechanism directly; reader has nothing to discover]

EXAMPLE — CORRECT:
  Eleanor stared at the clock. She had noted the time from the hallway two
  minutes ago. The minute hand had not moved far enough. Someone had been in
  this room.
[CORRECT: observation only; inference left to the reader]
```

#### STATE — Confrontation-Outcome Log
After each chapter with beat `confrontation` is accepted, append to state:
```
CONFRONTATIONS PLAYED:
  Ch4: Hale questioned re clock alibi — outcome: denied, no new evidence
```
Next confrontation chapter receives the log and the CONFRONTATION ESCALATION
RULE from FIX-D2. Cheapest fix: no additional LLM calls, only a state injection.

#### GATE — Confrontation-Outcome Validator
After a confrontation chapter is accepted, run a lightweight extraction call:
```
Did this confrontation end with (a) new physical evidence, (b) a new suspect
admission, or (c) a revision to the investigator’s theory?
Answer: yes/no and which of (a), (b), (c).
[CHAPTER_TEXT_FIRST_200_WORDS]
```
If `no`, trigger a targeted retry using the CONFRONTATION ESCALATION RULE.

---

### 6.5 — Ending / Reveal (score 5/10)

**Issues:** Motive never stated; confession covers tampering only; "protect him"
unresolved pronoun; evidence chain not summarised before confession.

#### FEW-SHOT — Good/Bad Confession Examples
Add to the reveal chapter system prompt (Brown et al., 2020 — few-shot format
adherence far outperforms zero-shot rules alone):

```
EXAMPLE — CORRECT confession (use this pattern):
"I gave Dr. Finch the sleeping draught," Hale said at last. "Mixed it into her
evening tea. I killed her because she had found the ledger discrepancy — my
name on every altered entry. I moved the clock back forty minutes to put myself
at supper when anyone asked."
[CORRECT: names the act, names the victim, states specific motive, links the clue]

EXAMPLE — WRONG (do not write this):
"I was merely trying to protect him. The clock — it was part of the arrangement."
[WRONG: no kill verb, no victim name, motive vague, unresolved pronoun 'him']
```

#### LLM-JUDGE — Post-Story Quality Gate
After all chapters pass lint and structural gates, run a final evaluation call:

```
System: You are a strict mystery story editor. Score this story on the rubric
below. For any category scoring below 7, output a structured failure reason.

[PASTE FULL STORY]

Rubric: Premise(10), Opening(10), Structure(10), Character(10), Dialogue(10),
Atmosphere(10), Clues(10), Pacing(10), Reveal(10), Prose(10)

Output format:
{ "scores": { ... }, "failures": [ { "category": "...", "reason": "..." } ] }
```

Parse `failures`. Block final story acceptance if:
- Any single category scores ≤ 5 (hard fail), OR
- Three or more categories score ≤ 6 (soft fail — story too weak overall)

**Retry action on judge failure:**
1. Extract `failures[].reason` for each failing category.
2. Map failing category → responsible chapter(s) using the Step 2 triage table.
3. Regenerate only those chapters with the judge’s `reason` injected as a
   `RETRY REASON` block in the obligation prompt.
4. Re-run the full judge call after repair. Max **2 judge-retry cycles**.
   If score does not clear after 2 cycles, log `judge_gate_warn` and accept
   with warning (soft gate in v1; hard block in v2).

**Token cost:** ~1,500 tokens for the judge call (9 chapters × ~150 tokens each
in compressed form). Negligible relative to the per-chapter generation cost.

**Code location:** New `runStoryJudge()` function in `canary-core.ts` (or the
equivalent pipeline entry point), called after the full-story `StoryValidator`
passes and before the story is written to `store.json`.

**Advantage over lint rules:** Catches semantic failures that regex cannot detect
— a confession naming an act without linking it to evidence would score 4/10 on
Reveal even if it passes all keyword gates.

---

### 6.6 — Prose / Polish (score 4/10 — lowest category)

**Issues:** Ledger arithmetic ("interval came to forty minutes"); pronoun drift;
repeated phrase "during here last night" (likely typo); template atmosphere openers.

#### MICRO-REGEN — Sentence-Level Surgical Repair
When `lintBatchProse` flags a specific sentence (arithmetic, template bleed, victim
alibi), extract and repair it rather than retrying the full chapter:

```
Rewrite this one sentence from a mystery novel. Do not change the surrounding
scene context. Specific problem to fix: [PROBLEM_DESCRIPTION].

Original: "The interval between the clock positions came to forty minutes."
Fix required: Rewrite as dramatised observation, not arithmetic note.

Output: [rewritten sentence only]
```

Replace the flagged sentence in the accepted chapter text. One micro-regen call
costs ~50 tokens versus ~800 for a full chapter retry.

#### FEW-SHOT — Good/Bad Opening Paragraph Examples
```
EXAMPLE — CORRECT chapter opening:
"The study clock read ten past eleven when Eleanor stepped inside. She stopped.
The hands were wrong — she was certain of it. The last time she had glanced
at the face, from the hallway, it had shown the quarter-hour."
[CORRECT: specific detail, uncertainty introduced, reader drawn in]

EXAMPLE — WRONG (do not write this):
"The rain fell steadily outside the manor. Eleanor stood in the study. The
atmosphere was tense and full of foreboding as the investigation continued."
[WRONG: weather preamble, vague atmosphere, no concrete observation]
```

#### CONSTRAINT — Forbidden Sentence Patterns
Add to chapter system prompt:
```
FORBIDDEN sentence structures — never write:
  × Any sentence performing arithmetic ("came to X minutes", "a difference of X")
  × Passive recording ("was recorded as", "was noted to be", "was found to show")
  × Weather/atmosphere openers for chapters 2–9
    ("The rain fell", "The wind howled", "The fog lay")
  × Tense summaries of prior chapters
    ("As Eleanor had already established", "It was now known that")
```

---

### 6.7 — Technique × Category Coverage Matrix

| Category (current score) | CONSTRAINT | STATE | SCHEMA | GATE | COT | FEW-SHOT | CHAIN | REFLEXION | SELF-CONS | MICRO-REGEN | LLM-JUDGE | ARCH |
|--------------------------|-----------|-------|--------|------|-----|----------|-------|-----------|-----------|------------|-----------|------|
| Premise / concept (7) | | | | | ✓ | | ✓ | | | | ✓ | |
| Opening hook (6) | ✓ | | | ✓ | | **✓** | | | | | | |
| Plot structure (6) | | **✓** | **✓** | ✓ | ✓ | | ✓ | ✓ | | | | **✓** |
| Character clarity (5) | **✓** | **✓** | **✓** | **✓** | | | | | **✓** | | | |
| Dialogue (5) | **✓** | **✓** | | **✓** | | **✓** | | ✓ | | **✓** | | |
| Atmosphere / setting (6) | **✓** | | | ✓ | | **✓** | | | | ✓ | | |
| Mystery clues (6) | | **✓** | **✓** | **✓** | **✓** | | **✓** | | | | ✓ | |
| Pacing (5) | | **✓** | | ✓ | ✓ | | | **✓** | | | | **✓** |
| Ending / reveal (5) | ✓ | ✓ | | ✓ | | **✓** | | | | | **✓** | |
| Prose / polish (4) | **✓** | | | **✓** | | **✓** | | ✓ | **✓** | **✓** | | |

**Bold** = proposed fix targets an issue found in this run.
Plain ✓ = technique applicable but not a primary fix for this run's issues.

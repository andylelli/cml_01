## Solution Ideas — TYPE 1: Victim Identity Continuity

**Date:** 2026-05-18 | **Updated:** 2026-05-19  
**Status:** IDEAS ONLY — no implementation plan created yet  
**Blocker:** TYPE 1 test runs blocked by Agent 5 inference-coverage gate failure (separate issue — not victim-identity layer)

---

## Progress

### Idea Status

| # | Idea | Status |
|---|------|--------|
| 1 | Two-Cast Architecture (`activeCast` / `deceasedRegistry`) | 📋 Documented |
| 2 | Character Lifecycle State Machine | 📋 Documented |
| 3 | Ghost Protocol — recency placement of dead-character block | 📋 Documented |
| 4 | Negative Examples embedded in constraint | 📋 Documented |
| 5 | Post-generation victim-alive detector (deterministic, TypeScript) | 📋 Documented |
| 6 | LLM-as-Judge reviewer call | 📋 Documented |
| 7 | Mandatory victim memorial mention per chapter | 📋 Documented |
| 8 | Cast profile transformation at chapter build time | 📋 Documented |
| 9 | Self-consistency sampling | 📋 Documented |
| 10 | Structural separation: Dead vs. Alive narrative modes | 📋 Documented |
| — | Layered recommended approach (Ideas 1+3+4+5+7+8) | ❌ No implementation plan |

### Run History (2026-05-18)

| Run | Time | Exit | Notes |
|-----|------|------|-------|
| type1-r1 | 19:02 | ❌ 1 | Agent 5: inference coverage critical — `clue_1`, `clue_2` missing |
| type1-r2 | 19:12 | ❌ 1 | Agent 5: inference coverage critical — `clue_1`, `clue_2` missing |
| type1-r3 | 19:22 | ❌ 1 | Agent 5: continuity issue + inference coverage critical |

> Note: all three runs failed at Agent 5 (clue coverage gate), not at the victim-identity layer. The victim-identity fix has not yet been tested end-to-end.

---

*This section explores concepts for eliminating the "victim alive" defect. It is intentionally wide-ranging — blue sky thinking first, implementation specifics second.*

---

### Root Cause Diagnosis

The problem is an **inversion of causality in the state model**. The current architecture tries to *detect* that the victim is dead by scanning generated prose for co-occurrence of the victim name + death-language pattern (`victimConfirmedDeadChapter`). Only after detection does it inject the `⛔ DEAD CHARACTER` guardrail block.

This is architecturally backwards. The victim is always dead from before chapter 1 — this is a structural story fact set by the outline, not something to infer from generated text. The system should *assert* the invariant upfront, not *observe* it afterward. In software terms, it is like writing a nullable database field and then trying to enforce non-null by scanning query results rather than setting a `NOT NULL` constraint at the schema level.

A secondary problem is **prompt distance**. In a long chapter prompt, the `⛔ DEAD CHARACTER` block is buried somewhere in the middle of many kilobytes of context. Research on LLM attention (see "Lost in the Middle", Liu et al. 2023) shows that instructions placed far from the generation instruction carry less weight. The victim constraint is fighting against the recency bias of the model's attention window.

A third problem is **cast-list contamination**. The victim's profile appears in the CAST section alongside living characters. The LLM is trained on millions of stories where characters in the cast list participate in scenes. Simply labelling the victim as dead in a distant block doesn't override this deeply trained prior — the model sees a name in the cast list and reaches for them as a participant.

---

### Idea 1 — The Two-Cast Architecture (Prevention-first)

Split the cast into two structurally distinct lists before any chapter prompt is built:

- `activeCast` — characters who are alive, can speak, enter rooms, react
- `deceasedRegistry` — characters who are dead, referenced only in past tense

The victim is placed in `deceasedRegistry` at cast-design time (Agent 2 / Agent 3), not at detection time. Chapter prompts from chapter 2 onward pass **only** `activeCast` in the CAST section. The `deceasedRegistry` is rendered as a completely separate `DECEASED PERSONS` section with a different visual separator and a different tone — reading more like a police file entry than a character profile.

The practical effect: the LLM's cast-section prior only sees living characters. The victim's name in the cast list no longer acts as an implicit "this character participates."

---

### Idea 2 — Character Lifecycle State Machine

Model every character's existence as a formal state machine with defined states and allowed actions per state:

```
States:  PRE_STORY | ALIVE | DECEASED | OFF_PAGE
Allowed actions per state:
  ALIVE:    speak, enter, react, gesture, confirm, argue
  DECEASED: reference_past_tense, memorial_mention, flashback_only
  OFF_PAGE: reference_only (may or may not be dead)
```

The victim is initialised at `DECEASED` from story-start (defined in CML, not inferred from prose). The chapter prompt builder queries this state machine to construct the cast section. If a character is `DECEASED`, their entry is not a character profile — it is a constrained reference template:

> `Eleanor Voss — DECEASED. Refer to in past tense only. Permitted: "had said", "was known to", "her belongings", "the victim's effects". FORBIDDEN: any present-tense action verb.`

This makes the constraint structural rather than advisory.

---

### Idea 3 — Recency Placement / Ghost Protocol

LLM attention decays across long contexts. Constraints placed last, just before the generation instruction, get the most attention weight. The current architecture places the `⛔ DEAD CHARACTER` block somewhere in the middle of the NSD block.

The "Ghost Protocol" moves the victim constraint to the **very last position** before "Now write chapter N:":

```
...
[all other context blocks]

══ DEAD CHARACTER REGISTRY (MANDATORY — READ IMMEDIATELY BEFORE WRITING) ══
Eleanor Voss — MURDERED BEFORE THE STORY BEGINS. She is dead in every chapter.
• NEVER: Eleanor entered / Eleanor said / Eleanor nodded / Eleanor confirmed
• NEVER: any present-tense verb with Eleanor as subject
• ALWAYS: "Eleanor had..." / "the victim's..." / "her effects showed..."
══════════════════════════════════════════════════════════════════════════════

Now write Chapter 3...
```

The all-caps header and box borders are deliberate. Research on prompt salience (Schulman et al., InstructGPT) shows formatting cues like capitalisation and visual boundaries improve instruction adherence for hard constraints. The constraint is also kept short — a long block of text is more likely to be glossed over than a tight, scannable list.

---

### Idea 4 — Negative Examples Embedded in the Constraint

Instead of only stating what the LLM must not do, show it a wrong/right pair immediately before generation. Research on few-shot prompting (Brown et al., GPT-3) demonstrates that a single concrete correct/wrong example often outperforms paragraphs of abstract rules.

```
⛔ VICTIM REFERENCE — REQUIRED PATTERN
Eleanor Voss is dead. She cannot speak, react, or appear in any scene.

WRONG — Do not write:
  "Eleanor stepped forward and confirmed the alibi."
  "Eleanor nodded. 'I remember that evening,' she said."

RIGHT — Write like this instead:
  "Beatrice recalled how Eleanor had often lingered in this doorway."
  "The victim's diary lay open on the writing table."
  "Eleanor had confided in Beatrice once, years before any of this."
```

This technique exploits the LLM's in-context learning capability. The examples ground the abstract constraint in the specific vocabulary and pattern the model should produce.

---

### Idea 5 — Post-Generation Victim-Alive Detector (Deterministic)

A purely code-side guard that runs after each chapter is generated, before the chapter is accepted into the story. It does not rely on the LLM to self-enforce.

Algorithm:
1. Tokenise the generated chapter into sentences.
2. For each sentence containing the victim's name (case-insensitive):
   a. Check whether the sentence contains a present-tense active verb (is, says, says, enters, sits, walks, looks, nods, turns, adds, confirms, gestures, agrees, etc.) — a controlled verb list.
   b. Check whether the victim name precedes the verb (i.e., is the grammatical subject).
3. If any sentence passes both checks, the chapter is flagged as `victim_alive_violation`.
4. The chapter prompt is re-issued with the flagged sentence(s) reproduced and marked:

> `REPAIR NEEDED: The following sentence(s) write the victim as alive. Rewrite each one in past tense only:`  
> `[sentence 1]`  
> `[sentence 2]`

This is not an LLM call — it is a regex/heuristic post-pass running in TypeScript. It catches the most common form of the error (victim as grammatical subject with present-tense verb) without requiring semantic understanding.

---

### Idea 6 — LLM-as-Judge Reviewer Call

After each chapter is generated, make a single low-cost LLM call (system + one-turn) to a smaller/faster model (can be the same model with a low token budget):

> *"Does the following text portray the character named Eleanor Voss as alive and actively participating in scenes? Answer YES or NO only, then briefly quote any offending sentence."*

If the judge answers YES, discard the chapter and retry. This is the "chain of thought verification" pattern used in self-consistency prompting (Wang et al. 2022) applied as a post-generation gate.

The advantage over the deterministic detector (Idea 5) is that it catches semantically subtle forms of the error — e.g., "The room felt different with Eleanor present" — that don't trigger a verb-subject regex. The disadvantage is it adds a second API call per chapter. A practical trade-off: run the deterministic check first; only fall back to the LLM judge if the chapter is close to the line.

---

### Idea 7 — Mandatory Victim Memorial Mention per Chapter

A counterintuitive idea: instead of just forbidding the victim from appearing, *require* the victim to be mentioned in every chapter — but only as a deceased person. This serves two purposes:

1. It forces the LLM to actively process the victim-is-dead constraint during generation (active constraint, not passive avoidance)
2. It produces better mystery prose — the victim's memory haunting the story is a classic Golden Age device

The chapter requirement ledger (already in `buildChapterRequirementLedger`) adds a mandatory beat:
> `"Include at least one memorial reference to Eleanor Voss (past tense, as the victim, not as a living participant)."`

Post-generation validation checks that this beat is present. If the victim appears alive AND the memorial mention is missing, the chapter fails two checks simultaneously — creating a stronger retry signal.

---

### Idea 8 — Cast Profile Transformation at Chapter Build Time

Currently the same cast profile JSON (name, description, motive, personality) is passed to every chapter. The proposal: at `buildPromptContextBlocks()` time, run a `transformCastForChapter(castEntry, chapterIndex, victimName)` function that:

- For living characters at the current chapter: returns the full profile
- For the victim at chapter ≥ 2: returns a *stripped and transformed* profile:
  - Removes personality/motivation fields (no longer relevant)
  - Replaces `role` with `DECEASED VICTIM`
  - Rewrites the description in past tense: "Eleanor Voss was known for…" not "Eleanor Voss is…"
  - Adds a `participation_mode: "past_reference_only"` field rendered explicitly in the prompt

This transformation happens in code before the prompt is constructed, not as an instruction layer on top of unchanged data. The LLM sees a fundamentally different kind of entry for the victim — one that structurally signals "this person is not here."

---

### Idea 9 — Self-Consistency Sampling

Borrowed from Wang et al. (2022) self-consistency research: generate the chapter 2–3 times with slight temperature variation, then select the generation where the victim does not appear as alive. If all generations contain the error, take the one with the fewest violations and apply the targeted repair pass.

This is expensive (2–3× generation cost) but can be limited to chapters known to be high-risk: those where the victim name appears heavily in the plot outline or clue manifest. The chapter-type contract already identifies high-risk chapters (WITNESS, ALIBI-CHECK, CONFRONTATION) — those are the ones most likely to inadvertently involve the victim.

---

### Idea 10 — Structural Separation: Dead vs. Alive Narrative Modes

The most conceptually clean approach, drawing from narrative theory. Every mystery story has two parallel narrative modes:

- **Active mode**: what happens now, in the story's present, among the living characters
- **Retroactive mode**: what we learn happened before or involving the deceased

The victim exists entirely in retroactive mode. The system should encode this at the chapter-prompt-building level: add a `narrative_mode_charter` field to the chapter context that declares which characters belong to which mode, and add a chapter-prompt rule: "Characters in RETROACTIVE_MODE may only appear in memories, testimony, past-tense description, or flashback. Never in real-time scene action."

This is a generalisation of the victim-dead problem — it would also correctly handle other off-page characters (e.g., a suspect who has left the house, a character mentioned only in testimony).

---

### Recommended Approach

Not one idea alone — a layered defence, combining prevention (schema-level) with detection (code-level) and constraint placement (prompt-level):

| Layer | Mechanism | Idea # |
|-------|-----------|--------|
| Schema (earliest) | Victim placed in `deceasedRegistry` at Agent 3 time — never in `activeCast` | 1 |
| Prompt structure | Cast entry transformed to past-tense-only "crime record" at chapter build time | 8 |
| Prompt placement | Dead character block placed last, immediately before generation instruction | 3 |
| Prompt content | Wrong/right example pair embedded directly before the generation instruction | 4 |
| Post-generation | Deterministic victim-alive detector (verb-subject regex sweep) — retry on hit | 5 |
| Post-generation | Mandatory victim memorial mention required per chapter from ch 2 onward | 7 |

The LLM judge (Idea 6) can be held in reserve and only triggered if the deterministic detector fires more than once in a retry loop, indicating the simpler pass cannot resolve it.

---

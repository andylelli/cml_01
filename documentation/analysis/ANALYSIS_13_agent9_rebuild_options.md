# ANALYSIS_13: Agent 9 — Full Rebuild Options

**Date:** 2026-03-19  
**Status:** Strategy / Options — No code has been written yet  
**Context:** Agent 9 has accumulated ~7 weeks of incremental patches, repair loops, and guardrails on top of a generation strategy that is fundamentally misaligned with the CML-first philosophy. This document proposes a clean-sheet rethink. No code from the existing `agent9-run.ts` or `agent9-prose.ts` should be ported unless explicitly chosen.

---

## 1. Why a Rebuild, Not Another Patch

### The core problem

The existing Agent 9 works like this:

1. Receive outline + a bundle of context blocks
2. Send a large system prompt (15 blocks, up to 6,200 tokens)
3. Generate all chapters chapter-by-chapter
4. Detect failures
5. Patch, repair, retry

After many rounds this has produced:

- A prompt that is simultaneously too long to fit everything important and too full of negative constraints ("never do X", "do not Y") that actively degrade generation quality
- A repair architecture that tries to fix bad prose *after* the fact — but prose quality problems are often baked in from the first pass, not incidental
- Era/setting/character context that is **injected as structured data** (JSON blocks, token-capped objects) rather than being *synthesised into a coherent world model* before writing begins
- No coherent narrative voice — each chapter is generated without memory of how previous chapters sounded
- A `NarrativeState` diffing system that tracks what has been *mentioned* but cannot model what it *means* to the characters
- An era model that is thin: "decade = 1930s" plus a temporal context object, with no deep reasoning about what living in that specific moment actually felt like for these specific people

### The philosophical misalignment

CML is the source of truth. CML contains:
- Characters with private secrets, motive seeds, behavioral tells, stakes
- A false assumption that underpins the entire story
- An inference path (the logical chain the detective walks)
- A discriminating test (the climactic proof)
- Hard-logic devices with *locked facts* (exact times, distances, quantities)

None of this is deeply embedded into prose generation today. The current system treats CML as a *constraint list* — things to check against after generation. The new approach should treat CML as a *story blueprint* — the thing the prose realises, moment by moment.

---

## 2. Critical Missing Context in the Current System

Before proposing options, these are the context dimensions that are either absent or badly handled today:

### 2.1 Era — It's a Label, Not a World

`meta.era.decade` is currently used to:
- Block anachronistic technology
- Provide a temporal context object with fashion/prices/cultural touchstones

What it does **not** do is give the LLM — or the outline builder — a coherent answer to the question: *What is it like to live in this specific moment in time?*

**Examples of missing era depth:**

| Era | What this means for characters and story |
|-----|------------------------------------------|
| September 1939 | Britain just declared war on Germany. Blackouts have started. Men of military age are already being conscripted or volunteering. The mood is not fear exactly — it is a strange, suspended dread. Petrol rationing begins in two weeks. |
| 1940–1941 | The Blitz. London burning. Leave cancelled. Strange class mixing in shelters. |
| 1942–1944 | Full wartime economy. Women in factories, forces, intelligence. Men absent. The "wrong" men are at home: old, infirm, exempt. Every character with a hidden reason to avoid service carries shame. American forces arrive 1942 — new tensions, new money. |
| 1945 (VE Day, August) | Euphoria mixed with exhaustion. Men coming home changed — or not coming home at all. The violence has stopped but the trauma has not. |
| 1946–1948 | Rationing continues. The welfare state is being built. The certainties of before-the-war have dissolved. Characters who were one thing before the war are now something else. |
| 1950s | The world that the war made. Class hierarchy shakier. New technologies (TV, car ownership). Cold War anxiety replaces wartime solidarity. |

None of this contextual density is available to Agent 9 today, or to Agent 7 when building the outline. It must be synthesised and injected as *narrative weight*, not a bullet list.

### 2.2 Characters — Profiles Are Not Voice

Agent 2b generates character profiles that include `humourStyle`, `humourLevel`, and `speechMannerisms`. These are currently injected as structured data blocks into the prose prompt. The LLM is expected to translate JSON fields into authentic human voices.

This works poorly because:
- The mapping from JSON attributes to speech patterns is implicit
- The LLM has no memory of how a character sounded two chapters ago
- Characters with `humourStyle: "dry_wit"` still sound the same as characters with `humourStyle: "deadpan"` when the prompt is crowded

What is missing: **a pre-prose character voice synthesis step** that translates character profiles into lightly dramatised voice sketches — two or three short example exchanges per character, in their actual voice, at their actual moment in history. These become the LLM's tonal anchor for that character throughout the story.

### 2.3 Humour — Present as Rules, Absent as Practice

The humour guide is injected as an optional block (lowest priority, first to be dropped). It reads as principles. The LLM cannot reliably convert abstract principles to concrete instances in the middle of generating prose.

What is missing: **humour anchoring per character** — a short paragraph showing exactly what this character's wit looks like in this specific story, given what they know, what they are hiding, and what year it is.

### 2.4 Location — Sensory Palettes Are Not Place

Agent 2c generates location profiles with sights/sounds/smells/tactile details. These are injected with their paragraph blocks stripped (to prevent verbatim lifting). The LLM is given a list of sensory attributes.

This works poorly because sensory palettes are *lists*, and lists produce *lists in prose*. Good place-writing is about *camera angle*, *emotional register*, and *what the point-of-view character notices given what they know*.

What is missing: **location × character × emotional state** situational context. The study at Thornmore Hall smells different to a grieving son than it does to a detective who suspects him.

### 2.5 The Outline Is Placed Too Early

The narrative outline (Agent 7) currently runs before character profiles, location profiles, and temporal context are fully integrated. By the time Agent 9 runs, the outline is already locked. Agent 9 must fit into an outline that was written without knowledge of how the characters actually sound, what the era actually feels like at this moment, or what the location atmosphere is.

A consequence: the outline is abstract and functional. It describes *what happens* in each scene. It cannot describe *how it feels*. Agent 9 has no structural basis for pacing, emotional rhythm, or era texture.

---

## 3. The New Strategic Principle

> **CML is the blueprint. The narrative builder is the architect's translation. Agent 9 is the builder. The era, locations, and characters are the materials.**

This means:

1. The narrative builder (currently Agent 7) must run **immediately before Agent 9**, after all enrichment phases (character profiles, location profiles, temporal context, hard logic) are complete
2. The narrative builder must synthesise all available information into a scene-level world model before any prose is generated
3. Agent 9 must write prose *against that world model*, not against a JSON constraint list
4. Era must be treated as a lived context, not a constraint label — with concrete implications for every character's situation, emotional state, and backstory

---

## 4. High-Level Option Space

### Option A: CML-Native Narrative Builder (Recommended Starting Point)

**Concept:** Replace the current Agent 7 outline + Agent 9 prose with a two-stage process:

**Stage A1 — World Synthesis (new, runs after all enrichment)**

Before any scene is outlined or written, a new synthesis step produces a *World Document* — a ~1,500 word prose-ready brief that captures:

- **Era reality check**: Given the specific month and year (from temporal context), what is the lived experience for each character? Who is at war, who is exempt and ashamed of it, who has lost someone, who arrived from somewhere else because of the war, who is now doing a job they would never have had before?
- **Character-in-era portraits**: For each cast member: one paragraph describing their current emotional state, what they want, what they fear, and what their voice sounds like — grounded in their CML profile *and* the specific historical moment
- **Location emotional register**: For each key location: what does this place mean to the people in this story? Not just sensory details — the *feeling* of being there, calibrated to the story's tone
- **Story rhythm sketch**: A paragraph-by-paragraph mapping of the story's emotional arc — when should it breathe, when should it accelerate, where does humour belong, where would humour be wrong
- **Humour placement map**: Which characters carry which kind of wit, at which points in the story is wit appropriate, and — critically — which moments must be played straight

This World Document is **not** a prose draft. It is a *synthesis brief* that the outline and prose generation both consume.

**Stage A2 — Scene-Level Outline (enhanced Agent 7, uses World Document)**

The narrative outline is generated against the World Document, not against raw CML. It can now include:
- Scene-level emotional register (e.g., "this scene should feel like the eye of the storm")
- Voice notes per scene (which character dominates, what their register is)
- Era texture directions (e.g., "the blackout is enforced tonight; this shapes how people move and speak")
- Specific humour permissions per scene

**Agent 9 — Prose Generation (uses World Document + enhanced outline)**

Agent 9 no longer receives 15 JSON blocks. It receives:
1. The World Document (narrative brief, not structured data)
2. The enhanced outline scene (enhanced, with emotional register and voice notes)
3. The locked facts (critical — never changes)
4. Character voice sketches (short example exchanges per character, generated in Stage A1)
5. The CML inference path coverage requirement for this scene

The prompt structure becomes dramatically simpler. The LLM is writing into a *world that has already been described*, not assembling a world from attributes.

**Pros:**
- Directly addresses era depth problem — World Document forces reasoning about the historical moment
- Directly addresses character voice problem — voice sketches anchor tone before generation
- Directly addresses humour problem — humour is placed structurally, not left to chance
- Simplifies Agent 9 prompt dramatically
- Aligns with CML-first philosophy — CML → World → Outline → Prose, each stage synthesising from the last

**Cons:**
- Adds a new LLM call (Stage A1 World Synthesis) — ~$0.10–0.20 per run
- World Document must be validated against CML to prevent new facts being introduced
- Outline timing changes cascade to all pipeline orchestration

---

### Option B: Scene Dossiers

**Concept:** Instead of a single world document, generate a *per-scene dossier* immediately before each chapter is written.

Each dossier (~300 words) contains:
- Who is in this scene, what they know, what they want, what they are hiding
- What the location feels like right now (time of day, weather, emotional register from preceding events)
- What this scene must accomplish (from the outline: clues to reveal, inference steps to advance)
- Any era-specific context for this scene (is it wartime? is there a blackout? has something just happened in the news?)
- One or two voice lines showing how the dominant character sounds today

Agent 9 generates each chapter against its dossier, not against a shared global context block.

**Pros:**
- Each chapter is self-contained — no sprawling global prompt
- Era context is scene-specific (the dossier says "it is 3 November 1940; the Blitz is ongoing; last night's bombing was close" — not "era: 1940s")
- Can be parallelised in principle
- Failure in one chapter doesn't corrupt the global context for subsequent chapters

**Cons:**
- Per-scene dossier generation requires N LLM calls (one per scene) — can be expensive for long stories
- Cross-chapter narrative coherence must still be maintained externally (NSD equivalent)
- Characters may drift in voice between dossiers unless a character voice document is threaded through all of them

---

### Option C: Pre-Written Character Voices

**Concept:** A dedicated voice synthesis step — before any outline or prose — generates a short *voice portfolio* for each character.

For each character in the cast, the voice portfolio contains:
- A paragraph capturing their speech rhythm, vocabulary register, and era-appropriate idiom
- Two to three short dialogue fragments in their voice (3–5 lines, no attribution needed)
- A note on how their voice changes under stress, when lying, when surprised
- A note on their specific humour style expressed as example sentence patterns, not abstract labels

The voice portfolio is injected into every prose generation call and into the outline scene notes. It does not replace character profiles — it is the *prose-ready surface* of the profile.

**Pros:**
- Addresses the core problem that `humourStyle: "dry_wit"` produces no guidance
- Cheap additional step (~$0.05 per run for a cast of 5–8)
- Voice portfolios can be shown to the user (interesting side product)
- Can be generated in parallel for all characters

**Cons:**
- Does not address era depth or location emotional register
- Still requires a good outline to place characters in scenes correctly
- Voice portfolios age poorly if the story changes (regeneration dependency)

---

### Option D: Full Narrative Brief (Single LLM, Pre-Prose)

**Concept:** A single large synthesis call, running after all enrichment is complete and immediately before the outline, that produces a complete *Narrative Brief Document* covering all dimensions:

- Era lived experience per character
- Character voice sketches (2–3 exchanges each)
- Location emotional register per key location
- Story emotional arc (chapter-count agnostic — rise/fall/pause/climax rhythm)
- Humour placement map
- Era-specific constraints that go beyond the temporal context object (e.g., if September 1939: blackout begins, who has registered for service, what has just changed)

This brief is then used by Agent 7 (outline) and Agent 9 (prose) as their primary context document — both structured and narrative blocks together.

**Pros:**
- One LLM call covers all context synthesis
- Narrative brief is human-readable — can be surfaced to the user as a "story concept document"
- Forces holistic reasoning about the story before any scene is structured
- Cheaper than Option B (no per-scene calls)

**Cons:**
- Single large call is a single point of failure
- Brief may introduce new facts that contradict CML; requires careful validation
- 1,500–2,000 word brief may still overflow or be deprioritised in Agent 9's context window when added to other critical blocks

---

### Option E: CML → Chapter Contracts

**Concept:** Before any prose generation, the CML is expanded into per-chapter *contracts* — explicit, structured commitments about what each chapter must contain, who says what (at a role level), what clue is revealed and how, and what the emotional note is.

This expands the existing `prose_requirements.clue_to_scene_mapping` concept to cover:
- Emotional register target
- Dominant character voice
- One or two lines of required dialogue (not exact text — thematic instruction: "character X must say something that reveals they were in the study the previous evening without admitting it")
- Required inference step advancement
- Required physical action or observation

Agent 9 then fills in the prose to satisfy the contract, not to interpret a scene summary.

**Pros:**
- Tightest alignment between CML logic and prose output
- Easiest to validate (chapter either satisfies contract or it doesn't)
- Removes ambiguity from Agent 9 — it knows exactly what it needs to deliver
- Can be partially generated deterministically (clue obligations are already known from CML)

**Cons:**
- Contract generation requires a sophisticated LLM call that reasons across CML, characters, outline, and era simultaneously
- Too many constraints may produce mechanical prose
- Dialogue hints may be too prescriptive — risk producing dialogue that sounds like a summary rather than a story
- Does not solve the era depth / character voice problem at source

---

## 5. Recommended Approach

The options above are not mutually exclusive. The recommended rebuild combines the core insight from each:

### The "World First" Architecture

```
Phase 1 — All enrichment runs as today
  Agent 1 (Setting)
  Agent 2 (Cast)
  Agent 2b (Character Profiles)
  Agent 2c (Location Profiles)
  Agent 2d (Temporal Context)  ← era month/year here
  Agent 3 (CML)
  Agent 5 (Clues)

Phase 2 — NEW: World Synthesis
  Agent 6.5: World Builder
    Input: all Phase 1 outputs
    Output: World Document (~1,200–1,500 words)
      - Era reality (specific to this month and year)
      - Character-in-era portraits (one paragraph each)
      - Character voice sketches (3–4 dialogue fragments each)
      - Location emotional register (one paragraph per key location)
      - Story emotional arc (rise/breathe/accelerate/climax shape)
      - Humour placement map (character × scene-type → appropriate vs wrong)

Phase 3 — Narrative Outline (Agent 7, moved here)
  Input: CML + clues + World Document
  Output: Scene-level outline WITH emotional register, voice notes, era texture

Phase 4 — Prose Generation (Agent 9 rebuilt)
  Input: World Document + per-scene outline + locked facts + clue obligations
  Prompt structure: ~4 blocks instead of 15
  No repair architecture — quality is built in at World Document level
```

### Era Handling in the World Builder

The World Builder must do real era reasoning, not surface labelling. The prompt should be designed to answer:

- What has just happened in the world at this specific date?
- Who in this cast is directly affected by current events (war, rationing, social change)?
- What does each character think about what is happening?
- How does the historical moment change what characters are willing to say, willing to hide, and willing to risk?
- What physical constraints does the era place on this specific story (blackout, rationing, petrol, postal delays, telephone exchange)?

For WWII-era stories specifically, the World Builder must classify each character against service/non-service status, and derive the social texture from that classification — because in 1940 Britain, a healthy man in civilian clothes was a social fact that required explanation.

### Humour in the World Builder

The humour placement map must be *situational*, not personality-based. The World Builder looks at:
- Which characters have `humourStyle ≠ none` (from character profiles)
- Which scenes in the story's emotional arc are tonal breathing spaces
- Which scenes involve those characters as dominant voices
- The specific form of humour (understatement, observational, dry wit) that matches the era and the character's current emotional state

The output is a simple scene-indexed map: `scene 3 → character X → understatement appropriate`, `scene 7 → no humour (death just discovered)`, `scene 11 → character Y → dry observational`.

This map is consumed by Agent 7 (in scene emotional register notes) and Agent 9 (in scene obligations).

---

## 6. What This Does to Agent 9

If the World First architecture is adopted, Agent 9 becomes dramatically simpler:

**Input per chapter:**
1. World Document (prose-ready narrative brief — consumed fully, not token-capped)
2. This scene's outline entry (with emotional register, voice note, era texture note)
3. Locked facts (verbatim physical evidence — never changes)
4. Clue IDs and descriptions for this scene
5. Brief continuity note: last 200 words of prior chapter, any clues already revealed to reader

**No more:**
- 15-block context assembly with token budgeting
- Repair loops for character voice drift (voice is anchored in World Document)
- Season/month enforcement pass (settled in World Document)
- Template linting (variety is structurally determined, not checked after the fact)
- Phantom name sanitization (the World Document doesn't have phantom names)

**What the prose validator still needs to check:**
- Clue obligations satisfied
- Locked facts not contradicted
- Word count floor met
- No new facts introduced (still required)

The result is an Agent 9 that does one thing well: write a chapter of a novel, given a thorough brief and a clear contract. Not one that generates, patches, repairs, and sanitises its own output in a loop.

---

## 7. Open Questions

Before implementation begins, the following must be decided:

1. **Where exactly does Agent 7 (outline) move?** After World Builder but before Agent 9 — this requires Agents 6 (Fair Play Audit) to still run before the World Builder, since the audit validates CML+clues are structurally sound. *(Fair play gate must not move.)*

2. **Does Agent 6 (Fair Play) need to change?** No, it runs on CML + clues which are produced by Phase 1. It can still gate to Phase 2.

3. **Validation of World Document.** The World Builder LLM may introduce new character facts or contradict CML. A validation step must check: no cast member is given new secrets, no setting is changed, all era facts are compatible with `realism_constraints`.

4. **Cost impact.** World Builder adds one LLM call (~$0.10–0.20). Agent 7 is moved, not added. Agent 9 simplification should reduce repair call frequency, potentially saving more than the World Builder costs.

5. **What happens to the NarrativeState (NSD)?** The NSD tracks used openings, sensory phrases, and revealed clues. This is still needed in the rebuilt Agent 9, but it becomes much simpler — the NSD only needs to track clues revealed (for fair-play) and the last chapter tail (for continuity). The elaborate sensory phrase avoidance system becomes unnecessary if the World Document provides varied scene-level emotional registers.

6. **How detailed should character voice sketches be?** Short (3–4 dialogue fragments) should be sufficient to anchor the LLM. Longer risks token budget.

7. **Can the World Builder be surfaced to the user?** Yes — as a "Story Concept" or "Author's Brief" view. This could be a compelling UI moment. *Deferred to a future design decision.*

---

## 8. Document Status

See the full implementation status table at the end of the document (after Section 11.12).

| Component | Status |
|-----------|--------|
| World Builder (Agent 6.5): functional spec | **Fully specified** — Section 9.3 |
| World Builder (Agent 6.5): prompt spec | **Fully specified** — Section 11.8 |
| Enhanced Agent 7 (consumes World Doc) | **Fully specified and implemented** — Sections 9.4, 11.2 |
| Rebuilt Agent 9: functional spec | **Fully specified and implemented** — Section 9.5 |
| Rebuilt Agent 9: prompt changes | **Fully specified and implemented** — Section 11.11 |
| Rebuilt Agent 9: repair removal | **Fully specified and implemented** — Section 11.10 |
| Era lived-context prompt design | **Fully specified** — Section 11.8.2 |
| Character voice sketch generation | **Fully specified** — Section 11.8.2 |
| Humour placement map generation | **Fully specified** — Section 11.8.2 |
| NarrativeState simplification | **Fully specified and implemented** — Section 11.9 |
| Pipeline orchestration changes | **Fully specified and implemented** — Sections 11.1, 11.2 |
| Schema files | **Implemented** — see Section 8 full table |

**Current status:** Full specification and full implementation complete as of 2026-03-28. All items implemented. No outstanding work remains.

---

## 9. Full Functional Specification — Option A: World First Architecture

This section is the complete functional specification for replacing the current Agent 7 + Agent 9 system with the World First architecture. It is organised as a description of what each component **does**, **accepts**, **produces**, and **must guarantee**. No code or implementation details are included here.

---

### 9.1 Design Principles

These principles govern every decision below. When anything is unclear, defer to these.

1. **Quality is designed in, not patched in.** Every failure mode that currently requires a repair pass must be prevented by design — by giving the LLM the right information at the right time in the right form, not by checking output and fixing it afterwards.

2. **CML is the contract.** Every fact in the story — every clue, every character secret, every piece of physical evidence — is defined in CML. Nothing new is introduced downstream. The prose realises the CML; it does not extend it.

3. **The LLM writes one thing at a time.** The World Builder thinks about the world. The outline builder thinks about structure. The prose generator writes. Each component has a single, well-defined job.

4. **Era is lived, not labelled.** Every character exists in a specific historical moment with specific personal consequences. The system must reason about what that moment means for each person in the story, not just attach a decade label and a list of forbidden technologies.

5. **Voice is concrete, not attributed.** Characters do not have `humourStyle: dry_wit` labels. They have voice sketches — small samples of how they actually speak in this story. All character voice guidance is expressed as demonstration, not description.

6. **Humour is structural.** Wit is not randomly distributed to funny characters. It is placed in specific scenes by design, calibrated to the emotional register of the surrounding narrative, and tied to the character's current situation in the story.

7. **Failure modes are handled upstream.** Phantom names, season contradictions, template repetition, and opening-style stagnation are symptoms of a prompt that does not give the LLM enough to work with. Fix the brief, not the output.

---

### 9.2 Pipeline Position

The new pipeline sequence for the generation phase is:

```
[existing, unchanged]
  Agent 1   — Era & Setting
  Agent 2   — Cast design
  Agent 2b  — Character profiles
  Agent 2c  — Location profiles
  Agent 2d  — Temporal context
  Agent 2e  — Background context
  Agent 3b  — Hard logic ideation
  Agent 3   — CML generation
  Agent 4   — CML validation / repair
  Agent 5   — Clue generation
  Agent 6   — Fair play audit     ← GATE: must pass before anything below runs
  Agent 8   — Novelty audit           *(implemented as `agent8-run.ts`; not currently wired in the pipeline orchestrator)*

[new / moved]
  Agent 6.5 — World Builder       ← NEW
  Agent 7   — Narrative Outline   ← MOVED (was before Agent 9; now after Agent 6.5)
  Agent 9   — Prose Generation    ← REBUILT
```

**Why the fair play gate must stay above Agent 6.5:** The World Builder synthesises a narrative brief that is consumed by the outline and prose. If the underlying CML + clue structure has fair play failures, the World Builder brief will be built on a broken foundation. Fix the structure first; then describe the world.

**Why Agent 7 moves below Agent 6.5:** The outline must know the emotional register of each scene, the humour placement, and the era texture before it can produce scene notes that Agent 9 can actually use. An outline written without the World Document can only describe what happens; an outline written with it can describe how it feels.

---

### 9.3 Agent 6.5 — The World Builder

#### Purpose

The World Builder synthesises all upstream information into a single coherent narrative brief — the **World Document** — that serves as the shared foundation for both the outline (Agent 7) and the prose (Agent 9). It does not generate prose. It does not generate plot. It translates structured data into a rich, humanised description of the story's world, people, and emotional shape.

#### Inputs

The World Builder receives all of the following, in full:

| Input | Source | Used for |
|-------|--------|----------|
| CML (`CASE` block) | Agent 3/4 | Character facts, secrets, motives, culprit, inference path, locked facts |
| Cast design | Agent 2 | Names, roles, relationships, archetypes |
| Character profiles | Agent 2b | humourStyle, humourLevel, speechMannerisms, personality, private secrets, voice hints |
| Location profiles | Agent 2c | Key locations, sensory palettes, atmospheric context |
| Temporal context | Agent 2d | Specific month + year, season, fashion, cultural touchstones, current affairs |
| Background context | Agent 2e | Era anchor, setting anchor, cast anchors, theme |
| Hard logic devices | Agent 3b | Locked facts (exact evidence values — times, distances, quantities) |
| Clue distribution | Agent 5 | All clues with descriptions, criticality, placement timeline |

#### What the World Builder Produces — The World Document

The World Document is freeform structured prose of approximately 1,500–2,000 words, organised into six sections. It is written in a tone suitable for reading by an author before sitting down to write — not dry and technical, but clear and purposeful.

---

##### Section 1: The Historical Moment

One focused paragraph (200–300 words) describing what it is like to live through this specific moment in time for people in this setting.

This is not a general description of the decade. It reasons from the specific date given in the temporal context and asks: what has just happened, what is happening now, what does everyone know is coming?

**For any date between September 1939 and August 1945**, the World Builder must:
- Establish the war's current state at the specific date (not just "WWII is happening")
- Name at least one concrete current event (a campaign, a rationing measure, a political development) that people in this setting would know about and feel
- Address the specific texture of civilian life at this date: blackout, billeting, evacuation, rationing, changed employment, changed social mixing, communication constraints
- Establish the emotional register of the moment (dread, exhaustion, grim determination, strange normality, euphoria, grief)

**For 1945–1950** the World Builder must:
- Distinguish pre- and post-VE Day (May 1945) and VJ Day (August 1945) if relevant
- Address the texture of aftermath: relief mixed with grief, men returning changed, rationing continuing, the welfare state forming, broken pre-war certainties
- Acknowledge that the war is over but its consequences are not

**For all other periods**, the World Builder must still identify what is in the air — the cultural moment, the social anxieties, the things people talk about and the things they avoid.

**This section must not be generic.** A story set in November 1940 must read differently from one set in July 1943. A system-level reviewer should be able to identify the approximate date from Section 1 alone.

---

##### Section 2: Character-in-Era Portraits

One paragraph per cast member (80–120 words each).

Each portrait answers: given this character's background, role, and private situation, what is their specific relationship to this historical moment? How has the era shaped or constrained them? What do they want right now? What are they afraid of?

**For WWII-era stories**, each male character of service age (broadly 18–41) must be accounted for: are they in service, and if so where and in what role? Are they a civilian, and if so why — reserved occupation, medical exemption, conscientious objection, influential connections? This is not background — it is character. A healthy man in civilian clothes in 1941 is a social statement that every person in the room notices.

**Requirements for every portrait:**
- Must reference at least one specific fact from the character's CML profile (motive seed, private secret, or behavioral tell)
- Must say something about how the historical moment intersects with the character's private situation
- Must not introduce new facts about the character beyond what is in CML or the character profile
- Must not reveal secrets that are not known to other characters (the brief is for the author, not the characters)

---

##### Section 3: Character Voice Sketches

Three to four short dialogue fragments per cast member. Each fragment is 2–4 lines and is not attributed to a scene — it simply demonstrates how this character speaks.

Voice sketches must show:
- Vocabulary register (formal, casual, clipped, expansive)
- Era-appropriate idiom (not anachronistic, not a parody of the period)
- The character's specific humour style if they have one — expressed through the fragment itself, not described
- How they sound when comfortable vs when evasive (two fragments covering each register is ideal)

**Requirements:**
- Dialogue fragments must be consistent with speechMannerisms and humourStyle from character profiles
- Fragments must feel like speech from this specific character, not generic period dialogue
- A character with `humourStyle: none` must not produce accidental wit
- The detective's voice must be distinct from all other characters — and must not use humour as a primary register (the detective may be wry but must primarily project intelligence and observation)
- Fragments must not contain plot information (no clue references, no secret reveals)

---

##### Section 4: Location Emotional Register

One paragraph per key location (60–100 words each) describing what it feels like to *be* in that location given the story's specific circumstances.

This goes beyond the sensory palette generated by Agent 2c. It answers: given what has happened here (the crime, the investigation, the people who inhabit it), what is the atmosphere of this place at this point in the story?

The language must be concrete and imagistic — the kind of description that helps a writer hear the silence in a room before they describe it.

**Requirements:**
- Must reference at least one sensory detail from the location profile
- Must incorporate the era's physical constraints where relevant (blackout, restricted access, wartime requisitioning)
- Must not introduce locations not present in CML or location profiles
- Each location must feel distinctly different from the others (same technique, different character)

---

##### Section 5: The Story's Emotional Arc

A single flowing paragraph (200–300 words) describing the shape of the story's emotional journey from opening to close.

This is not a scene-by-scene outline. It is a description of the emotional rhythm: where the story breathes, where it accelerates, where it pauses for character, where the tension becomes unbearable, where the resolution lands and what emotional register it carries.

The arc is derived from the CML's narrative structure (three-act form implied by inference path → discriminating test → culpability) but expressed in emotional terms that a writer can feel into, not a structural checklist.

**Requirements:**
- Must identify the story's dominant emotional register (is this a cold intellectual puzzle with moments of warmth? A deeply human tragedy with fair-play logic underneath? A social comedy that turns dark?)
- Must name the emotional turning points, not just structural ones
- Must describe the ending note — does the reader feel satisfied, disturbed, elegiac, relieved? What should linger?
- Must not mention specific clue IDs or mechanism details

---

##### Section 6: The Humour Placement Map

A structured list mapping scene position to humour guidance. This is the only section allowed to be list-based rather than prose.

Format: a series of scene-position entries (early/mid/late story markers, not specific scene numbers yet) with the following per entry:
- Scene position marker (e.g., "Opening scene", "First investigation scene", "Immediately after the body is discovered", "Long investigation middle", "Pre-climax", "Revelation scene", "Resolution")
- Whether humour is appropriate, inappropriate, or conditional
- If appropriate: which character(s) may carry it and in what form
- If conditional: what the condition is (e.g., "only if scene ends before the confrontation")

**Requirements:**
- Must cover all major scene-type positions (discovery, investigation, interview, domestic scene, tension scene, revelation, resolution)
- Must name specific characters by name, not by role
- Must respect the principle that humour is never present in scenes involving direct violence or immediate grief
- Must respect that the detective's wit is used sparingly and precisely — never as warmth or social lubricant, only as intelligence
- Characters with `humourLevel > 0.6` may carry wit in middle-register scenes; characters with `humourLevel < 0.3` should not produce humour even if their style is technically witty
- The humour map must show contrast across the cast — not all scenes with multiple present characters produce wit

---

#### World Builder Quality Guarantee

Before the World Document is accepted, a validation check must confirm:

1. **No new character facts.** The portraits and voice sketches may not give any character a new secret, a new relationship, a new piece of backstory not present in CML or character profiles. The check is not automated — it is a prompt-level instruction that the World Builder explicitly confirms at the end of the document: "All character facts above are derived from the provided CML and character profile inputs. No new character information has been introduced."

2. **No new plot facts.** The story arc section may not name a specific culprit, reveal the mechanism, or describe any clue by its specific content. It must describe emotional beats only.

3. **No anachronisms.** The historical moment section must not reference events, technologies, or social conditions that contradict the `realism_constraints` listed in `meta.era`. The World Builder receives the realism constraints explicitly and must not violate them.

4. **Cast completeness.** Every cast member must appear in both the Character-in-Era Portraits and the Character Voice Sketches sections. A World Document that omits any cast member is incomplete and must be regenerated.

5. **Era specificity threshold.** The historical moment section must contain at least one dateable specific detail (a specific event, a specific measure, a specific cultural touchstone) that could not apply to any other year in the decade. Vague decade-level description fails this check.

If the World Builder fails validation, it retries once with the specific failures listed. If it fails again, the pipeline aborts with a clear error identifying which validation checks failed.

---

### 9.4 Agent 7 — The Narrative Outline (Enhanced, Repositioned)

#### Changes from the Current Design

Agent 7 currently runs before character profiles, location profiles, and temporal context are fully synthesised and before any narrative brief exists. It receives raw CML and produces a functional scene-by-scene structure.

In the new architecture, Agent 7 runs after the World Builder and receives the World Document as its primary creative input. This changes Agent 7's output from a functional structure to a *writer's brief* — a scene plan that captures not just what happens but how each scene should feel, who speaks and how, and what era texture should be present.

**Agent 7 continues to handle:**
- Act structure (three acts, scene allocation)
- Clue placement per scene (the deterministic clue pre-assignment logic remains)
- Discriminating test scene placement
- Suspect closure coverage
- Scene count locking
- Fair play sequencing rules (clues revealed before used)

**Agent 7 now additionally produces per scene:**
- Emotional register note (drawn from the Story Arc section of the World Document)
- Dominant character and their voice register for this scene (drawn from Voice Sketches)
- Humour permission and form for this scene (drawn from the Humour Placement Map)
- Era texture note for this scene (drawn from the Historical Moment section, calibrated to the specific events of the story so far)
- Location emotional register note for this scene (drawn from Location Emotional Register section)
- Subtext note for this scene (synthesised by Agent 7's LLM from the scene's surface purpose, the characters present and their evasive/stressed registers, and the story arc position — what this scene is really about beneath its surface function)

These additions are short annotations — one sentence each — not paragraph-level descriptions. Their purpose is to give Agent 9 a sensory and emotional direction that it would otherwise have to invent.

#### What Agent 7 Must Guarantee

The scene-level guarantees from the current system are preserved in full:

- Every essential clue appears in a scene before the discriminating test scene
- The discriminating test is in late Act II or Act III
- Each non-culprit suspect has an elimination scene
- No scene is clue-only (scenes serve multiple purposes)
- Scene count is locked (no shrinkage on retry)

The new guarantees added:

- Every scene has an emotional register note (no scene is emotionally blank)
- Every scene has a subtext note — a one-sentence account of what the scene is really about beneath its surface purpose (generated by Agent 7's LLM, not deterministically post-processed)
- The humour placement map is fully consumed — no scene is left without a humour guidance note
- The Voice Sketches are cited by character name in at least one scene per character (confirming that every character appears in the outline at least once)

---

### 9.5 Agent 9 — Prose Generation (Rebuilt)

#### Core Design Principle

Agent 9 writes chapters. It does not assemble context, enforce constraints, repair failures, or sanitise output. Those jobs belong upstream. If the World Document and the enhanced outline are correct, the prose should be correct on first generation.

The measure of success is: **zero repair passes on a well-prepared story.** Repair remains available as a last resort, not as a designed path.

#### Per-Chapter Input Package

For each chapter, Agent 9 receives exactly the following — nothing more, nothing less:

**1. World Document (full)**
The complete World Document from Agent 6.5. This is the tonal and factual foundation. Agent 9 is told: this document describes the world you are writing in. The people, the place, the historical moment, the emotional arc, and the permitted humour are all here. Trust it.

**2. Scene Brief (from Agent 7's enhanced outline)**
The single scene entry for this chapter, including:
- Scene number, act, title, purpose
- Location and time of day
- Characters present
- Clues to be revealed (IDs and descriptions)
- Inference step to be advanced (from CML inference path)
- Emotional register note
- Dominant character and voice register
- Humour guidance (permitted / conditional / not permitted; character and form if permitted)
- Era texture note
- Location emotional register note

**3. Locked Facts**
The verbatim physical evidence values from the hard logic devices (times, distances, quantities). These are the only things that must appear in the prose exactly as specified. Agent 9 is told: these facts are non-negotiable. Use them verbatim when relevant to this scene.

**4. Continuity Tail**
The last 150 words of the previous chapter (empty for Chapter 1). This provides narrative continuity without requiring Agent 9 to hold a global story state. Agent 9 is told: your chapter must begin as a continuation of this — same world, same register, unbroken narrative time unless the scene break specifies otherwise.

**5. Clue Obligation Statement**
A plain-language statement of what this chapter must deliver — drawn from the scene's `cluesRevealed` list and the inference step assignment. Written as a delivery contract: "This chapter must surface [clue description] in a way the reader can notice. It must advance [inference step summary] — the reader should be able to see [observable element] by the end of this chapter."

This is not a checklist of IDs. It is a human-readable description of what the chapter must accomplish for the reader.

#### What Agent 9 Must Not Receive

The following are explicitly excluded from Agent 9's input. Their purposes are already served:

| Excluded item | Why it is excluded | Where it is now handled |
|---------------|-------------------|------------------------|
| Raw character profile JSON blocks | Voice is in the World Document as voice sketches | World Builder § Section 3 |
| Raw location profile JSON blocks | Location register is in the World Document | World Builder § Section 4 |
| Raw temporal context JSON object | Era is in the World Document | World Builder § Section 1 |
| Season/month enforcement rules | Seasonal register is in the Historical Moment section | World Builder § Section 1 |
| 15-block prompt assembly with token budgeting | Replaced by 5 structured inputs | New input package above |
| Negative constraint lists ("never use X", "do not invent Y") | Replaced by positive creative brief | World Document + Scene Brief |
| Anti-template linting prompts | Variety is produced structurally, not enforced retrospectively | World Doc + enhanced outline |

#### Quality Requirements

Agent 9 is given positive quality requirements, not prohibitions. The requirements are:

1. **Scene grounding.** Every chapter opens within the location described in the Scene Brief. The opening paragraph must establish where we are and what it feels like to be there. The World Document's Location Emotional Register for this location is the reference.

2. **Voice fidelity.** Every character who speaks in this chapter must sound like their voice sketch. The voice sketch is in the World Document. If a character's sketch shows clipped, formal speech, their dialogue is clipped and formal. If it shows dry wit delivered as understatement, one moment of understatement is sufficient — it should not be constant.

3. **Clue delivery.** The clue obligation statement describes what must be visible to the reader. The clue must be present on the page in a way the reader could notice. It must not be in dialogue only; it must exist as a physical or observable fact in the scene. The reader does not need to understand its significance — but they must be able to remember it later.

4. **Inference step advancement.** The observable element from the clue obligation statement must appear in the chapter. This is not detective narration — it is a fact on the page that a careful reader could use.

5. **Emotional register.** The chapter's dominant emotional register must match the Scene Brief's register note, drawn from the Story Arc. If the note says "eye of the storm — surface calm with subterranean dread", the prose must not be buoyant and warm.

6. **Humour permission.** Humour appears only when the scene brief permits it, in the form specified, from the character specified. When humour is not permitted, none is produced. When it is conditional, the condition is evaluated against the chapter's narrative position.

7. **Era texture.** The historical moment must be sensed in the chapter — not announced, but felt. People are dressed as the era dresses. They travel as the era travels. They avoid certain conversations because the era avoids them. One or two specific period details per chapter is sufficient.

8. **Continuity.** The chapter must begin from the Continuity Tail. No unexplained time jumps. No new characters introduced without establishment. No change in a character's physical location without narrative transition.

9. **Word count.** The chapter meets the minimum word floor for the selected story length (short / medium / long). The floor is the hard minimum. The preferred target is the creative aim.

10. **Ending quality.** The chapter ends on a note that is either a narrative pull-forward (reader wants to know what comes next), a character revelation, or an emotional rest. It does not end mid-sentence, on a summary, or with a placeholder.

#### What Triggers Regeneration

A regeneration is triggered if and only if:

| Failure | Response |
|---------|----------|
| Chapter falls below word count hard floor | Regenerate chapter with explicit word count direction |
| A locked fact is contradicted (wrong time, distance, quantity) | Regenerate chapter with locked fact prominently called out |
| A clue obligation is not met (clue ID not found in prose) | Regenerate chapter with clue delivery instruction |
| A character not in the cast is named | Regenerate chapter with cast list |
| The discriminating test scene (when reached) does not contain the test | Regenerate scene with explicit test delivery requirement |
| A non-culprit suspect has no closure by Act III | Regenerate the relevant chapter with explicit closure instruction |

**What no longer triggers regeneration:**
- Opening style repetition (the enhanced outline provides varied emotional registers per scene)
- Season/month contradiction (the World Document settles the season in Section 1)
- Character voice drift (the voice sketches are in the World Document and present in every call)
- Template or atmospheric phrase repetition (the varied emotional registers prevent convergence)
- Identity alias drift post-reveal (the clue obligation statement specifies how to reference the culprit after revelation)

#### Chapter Sequencing and Batch Size

Chapters are generated one at a time (batch size = 1). Each chapter is validated before the next begins. The Continuity Tail for each chapter is drawn from the accepted previous chapter.

There is no global-state prose repair pass. If a chapter fails both its initial generation and one retry, the pipeline aborts with a precise error message identifying which obligation was not met and which chapter it applies to. The error must be specific enough that a developer can read it and identify the likely cause.

---

### 9.6 Validation — What Remains and What Changes

#### Validation that remains unchanged

- CML schema validation (Agent 4) — unchanged
- Fair play audit (Agent 6) — unchanged
- Novelty audit (Agent 8) — unchanged
- Hard-floor word count check per chapter — unchanged
- Locked fact presence check per chapter — unchanged
- Clue ID presence check per chapter — unchanged
- No-new-facts check (prose must not introduce character information not in CML) — unchanged
- Final story validation pipeline (discriminating test scene, suspect closure, culprit evidence chain) — unchanged

#### Validation that is removed

| Removed check | Why |
|---------------|-----|
| Anti-template linter (opening entropy, paragraph fingerprinting, n-gram overlap) | The enhanced outline with per-scene emotional registers prevents template convergence structurally. If identical registers are being generated, the outline is failing, not the prose. |
| Season/month normalisation pass | The World Document Section 1 establishes the season and era register definitively. If the prose contradicts it, that is a regeneration trigger (locked fact contradiction), not a normalisation task. |
| Mojibake repair table | Still required at output persistence layer — encoding cleanup is an output hygiene measure that belongs at the persistence boundary, not in the generation loop. |
| Phantom name sanitisation pass | The Voice Sketches do not contain titled surnames. The cast list in the Scene Brief is complete. If a phantom name appears, it is a generation failure addressed by regeneration, not silent stripping. |
| Identity alias repair (targeted + full regeneration fallback) | The Clue Obligation Statement for the reveal chapter and all subsequent chapters specifies how to reference the culprit. Address any failure at generation time, not in a post-generation repair pass. |
| Schema repair retry | The simplified 5-block input package removes most schema failure causes. Any schema failure in the new architecture is a structural problem requiring investigation, not a routine repair pass. |
| Full story validation repair pass | Full story repair was needed because first-pass prose was reliably incomplete. If the specification is followed and the World Document is good, this should not occur. The final validation still runs; it now gates release rather than triggering regeneration. |

#### New validation at the World Builder stage

| Check | What it verifies |
|-------|-----------------|
| No new character facts | Voice sketches and portraits contain only information derivable from CML + character profiles |
| No new plot facts | Story arc section does not name the culprit or reveal mechanism details |
| Cast completeness | All cast members have portraits and voice sketches |
| Era specificity | Historical moment section contains at least one dateable specific event or detail |
| Humour map completeness | All major scene-type positions are covered |
| Locked fact preservation | Hard logic locked facts are present in the World Document and are not contradicted |

---

### 9.7 Failure Modes from the Current System — How Each is Prevented

This table maps the most costly recurring failures in the current system to the architectural feature in the new system that prevents them.

| Current failure | Root cause | Prevention in new system |
|----------------|------------|--------------------------|
| Template prose / repetitive chapter openings | 15-block prompt crowds out creative direction; LLM defaults to patterns | Enhanced outline gives each chapter a unique emotional register note; scene variety is specified, not left to chance |
| Season contradiction (e.g., winter story with summer prose) | Month/season enforcement was a post-generation patch, not a generation input | World Document Section 1 establishes season definitively as a narrative fact; prose is written into that world |
| Character voice homogenisation | Character profiles are JSON; voice translation is implicit | Character Voice Sketches in World Document show actual speech fragments; the LLM imitates, not translates |
| Phantom character names (e.g., "Detective Harlow") | Large prompt with limited character anchoring; genre priors fire | Scene Brief includes exact cast list for the scene; no character not on this list speaks |
| Missing clue delivery | Clue obligation was a constraint list; LLM treated it as advisory | Clue Obligation Statement is a positive delivery contract, not a prohibition; chapter is rejected if obligation not met |
| Humour leaking into solemn scenes | Humour guide was optional block (first dropped); no placement map | Humour Placement Map specifies forbidden and permitted scenes explicitly; outline carries this into scene notes |
| Humour characters sounding generic | humourStyle was a label; no demonstration | Voice Sketches show humour in action; LLM imitates the fragment, not the label |
| Identity alias drift post-reveal | Post-generation repair pass was detection-and-fix, not prevention | Clue Obligation Statement for reveal + post-reveal chapters specifies reference convention explicitly |
| Missing discriminating test scene | Outline could be ambiguous about which scene delivers the test | Scene Brief for the test scene carries explicit test delivery instruction in Clue Obligation Statement |
| Era anachronisms | realism_constraints were a list in a deprioritised block | World Document Section 1 embeds era constraints as narrative reality; agent writes inside that reality |
| Wartime era stories feeling generic | "decade: 1940s" with fashion/prices context | World Builder must produce dateable, specific Historical Moment content with wartime service status for each character |
| Thin suspect closure | Repair was triggered after full-story validation failure | Suspect closure obligations are part of per-chapter Clue Obligation Statements for Act III scenes; checked per chapter |
| Word count underflow | Expansion pass was an afterthought; target was aspirational | Word count minimum is in the per-chapter quality requirements; regeneration trigger activates immediately |
| NarrativeState complexity accumulating errors | NSD tracked many signals; over time signals drifted or became stale | NSD is reduced to two signals only: clues already revealed (for fair play) and last chapter tail (for continuity) |
| Repair loops consuming 2–4x cost of first pass | Repair architecture was designed-in, not exceptional | Repair is now exceptional (last resort); primary prevention is through World Builder and enhanced outline quality |

---

### 9.8 What Success Looks Like

The rebuilt system succeeds when:

1. A story completes in a single generation pass, with at most one chapter-level retry
2. Every chapter is distinct in emotional register and opening style — no two chapters open the same way
3. Characters sound like themselves — a reader who reads two chapters could identify the speaker without attribution
4. The era is felt without being announced — period details are woven in naturally, not reported
5. Humour appears when it should and is absent when it should not be — the wit/gravity balance feels authored, not accidental
6. The discriminating test is clear and satisfying — the reader can follow the logic without having it explained
7. All suspects are accounted for — no character simply disappears without their guilt or innocence being established for the reader
8. WWII-era stories feel like WWII-era stories — the war is in the room even when nobody mentions it

---

### 9.9 Open Questions — Resolved

These were the open questions listed in Section 7. They are resolved here.

| Question | Resolution |
|----------|------------|
| Where does Agent 7 move? | After Agent 6.5 (World Builder), before Agent 9 |
| Does Agent 6 (Fair Play) need to change? | No. It runs on CML + clues, gates Phase 2. |
| Validation of World Document? | Yes — six checks defined in § 9.3. Retry once on failure; abort on second failure. |
| Cost impact? | World Builder adds ~$0.10–0.20. Elimination of repair loops saves $0.50–2.00 per run. Net saving expected. |
| What happens to NSD? | Reduced to two signals: clues-revealed and last-chapter tail. All other NSD signals removed. |
| How detailed are voice sketches? | 3–4 fragments, 2–4 lines each, per character. Character-in-era portrait is separate (80–120 words). |
| Can World Builder be surfaced to the user? | Yes. The World Document is human-readable and interesting. Surface as "Story World" view (Advanced mode). Deferred to UX decision. |

---

### 9.10 Implementation Boundaries

The following is a clear boundary statement for what is in scope for this rebuild and what is not.

**In scope:**
- Agent 6.5 (World Builder) — new component, new schema, new validation
- Agent 7 — repositioned in pipeline; enhanced output with per-scene emotional register, voice, humour, era notes
- Agent 9 — completely rewritten; new simplified input package; new generation loop; reduced validation
- NarrativeState — simplified to two signals
- Pipeline orchestration — Agent 7 and Agent 9 move; dependencies updated
- World Document schema (for validation and persistence)

**Out of scope for this rebuild:**
- Agents 1–6 and Agent 8 — unchanged
- CML schema — unchanged
- Clue generation — unchanged
- Fair play audit — unchanged
- Scoring system — unchanged; may need calibration after rebuild but that is a separate task
- PDF export — unchanged
- API and UI layers — unchanged (World Document may be surfaced later but that is a deferred UX decision)
- Story validation package (packages/story-validation) — unchanged; the final validation pipeline still runs; it just runs against cleaner input

**Document status after this specification:**

| Component | Status |
|-----------|--------|
| World Builder (Agent 6.5) | Fully specified — ready for development |
| Enhanced Agent 7 | Fully specified — ready for development |
| Rebuilt Agent 9 | Fully specified — ready for development |
| World Document validation | Fully specified — ready for development |
| NarrativeState simplification | Fully specified — ready for development |
| Pipeline orchestration changes | Fully specified — ready for development |
| Era lived-context prompt design | Specified at functional level — prompt wording is implementation detail |
| Character voice sketch generation | Specified at functional level — prompt wording is implementation detail |
| Humour placement map generation | Specified at functional level — prompt wording is implementation detail |

---

## 10. Schema Alignment — CML as Full Source of Truth

### 10.1 Principle

Every piece of information that any agent needs to generate prose must be stored in the CML file. Not in separate runtime artifacts, not in context variables, not in memory — in the CML. This makes the CML the single inspectable, exportable, repeatable record of everything that went into a story.

The CML is structured in two layers:

| Layer | What it contains | When populated |
|-------|-----------------|----------------|
| **Core (`CASE`)** | The mystery logic: characters, culprit, false assumption, inference path, discriminating test, clues, fair play, quality controls | Agents 3–4 (CML generation and validation) |
| **Composite sections** | All enrichment and synthesis: setting, character profiles, location profiles, temporal context, world document, narrative outline | Agents 1–2d, 6.5, 7 (each appends their section) |

The Full CML = `CASE` + all composite sections. Agent 9 consumes the Full CML.

---

### 10.2 Schema Map — What Changed and Why

#### `cml_2_0.schema.yaml` — updated

**`CASE.meta.era` — enriched:**

| New field | Type | Purpose |
|-----------|------|---------|
| `specific_year` | number | Year (e.g. 1941). Required for wartime stories. Previously only `decade` existed. |
| `specific_month` | string | Month name (e.g. November). Required for wartime stories. |
| `wartime` | boolean | Flags September 1939 – August 1945 for wartime-specific World Builder reasoning. |
| `era_atmosphere` | string | One sentence. The dominant emotional register of this historical moment. Seeded early; refined by World Builder. |

**Why:** `decade: "1940s"` is not enough information to write a WWII-era story that feels like a specific moment. `specific_year` + `specific_month` + `wartime` gives the World Builder enough to reason about whether the Blitz is happening, whether rationing has started, who is in service.

**New composite top-level sections:**

| Section | Populated by | $ref schema |
|---------|-------------|-------------|
| `SETTING_REFINEMENT` | Agent 1 | `setting_refinement.schema.yaml` |
| `CHARACTER_PROFILES` | Agent 2b | `character_profiles.schema.yaml` |
| `LOCATION_PROFILES` | Agent 2c | `location_profiles.schema.yaml` |
| `TEMPORAL_CONTEXT` | Agent 2d | `temporal_context.schema.yaml` |
| `WORLD_DOCUMENT` | Agent 6.5 | `world_document.schema.yaml` (new) |
| `NARRATIVE_OUTLINE` | Agent 7 | `narrative_outline.schema.yaml` (enhanced) |

All sections are `required: false` because they are written progressively by the pipeline. A valid Full CML requires all sections to be present. A CML without composite sections is a valid Core CML (for logic/fair-play purposes) but not a valid prose input.

---

#### `world_document.schema.yaml` — new file

Full schema for the Agent 6.5 World Builder output. Six sections:

| Section | Key field(s) | Role in prose generation |
|---------|-------------|--------------------------|
| `historicalMoment` | `eraRegister`, `currentTensions`, `physicalConstraints`, `emotionalRegister`, `wartimeServiceContext` | The era block Agent 9 writes into. No more decade labels. |
| `characterPortraits` | `portrait` (80–120 words each), `eraIntersection` | Situates every character in the historical moment. |
| `characterVoiceSketches` | `voiceDescription`, `fragments[]` (register + text), `humourNote` | Concrete speech samples for each character. Agent 9 imitates, not translates. |
| `locationRegisters` | `emotionalRegister`, `cameraAngle`, `eraNote` | Emotional stance for writing each location. Not a sensory list. |
| `storyEmotionalArc` | `dominantRegister`, `arcDescription`, `turningPoints[]`, `endingNote` | The shape of the story so Agent 9 knows when to breathe and when to accelerate. |
| `humourPlacementMap` | Per `scenePosition`: `humourPermission`, `permittedCharacters`, `permittedForms` | Structural humour placement. Agent 7 turns this into per-scene notes. Agent 9 obeys them. |
| `storyTheme` | string | One sentence — the story's deeper meaning beneath its plot. Agent 9 uses it to ensure prose accumulates meaning, not just incident. |
| `breakMoment` | object (`character`, `scenePosition`, `form`, `narrativeFunction`) | The pre-identified scene where someone loses emotional control. Grounds the procedural in human experience. |
| `revealImplications` | string (90–150 words) | Names 2–3 earlier moments that the revelation will retroactively recolour. Agent 9 seeds those moments with the right texture. |

The schema also requires `validationConfirmations` — a set of boolean flags (`noNewCharacterFacts`, `noNewPlotFacts`, `castComplete`, `eraSpecific`, `lockedFactsPreserved`, `humourMapComplete`) that the World Builder LLM explicitly sets. These are the machine-checkable equivalent of the validation guarantees in § 9.3.

**The `fragments[].register` enum:** `comfortable | evasive | stressed | humorous | formal` — ensures voice sketches cover multiple emotional states, not just the character's default register.

**The `humourPlacementMap` `scenePosition` enum** covers all major scene types in a three-act mystery:
`opening_scene | first_investigation | body_discovery | first_interview | domestic_scene | mid_investigation | second_interview | tension_scene | pre_climax | discriminating_test | revelation | resolution`

This is not scene-number based — it is scene-type based, which means Agent 7 can apply the map to any outline regardless of total scene count.

---

#### `narrative_outline.schema.yaml` — enhanced

Six new optional fields added to every scene entry:

| Field | Type | Populated from |
|-------|------|---------------|
| `emotionalRegister` | string | `WORLD_DOCUMENT.storyEmotionalArc.turningPoints` — the emotional tone for this scene position |
| `dominantCharacterNote` | object (`name`, `voiceRegister`) | `WORLD_DOCUMENT.characterVoiceSketches` for the scene's dominant character |
| `humourGuidance` | object (`permission`, `character`, `form`, `condition`) | `WORLD_DOCUMENT.humourPlacementMap` for this scene's type |
| `eraTextureNote` | string | `WORLD_DOCUMENT.historicalMoment.physicalConstraints` — era-specific detail for this scene |
| `locationRegisterNote` | string | `WORLD_DOCUMENT.locationRegisters` for this scene's location |
| `subtextNote` | string | Generated by Agent 7's LLM during outline generation — what this scene is really about beneath its surface purpose |

All fields are `required: false` for backwards compatibility with existing outlines. When the `WORLD_DOCUMENT` is present in the CML, Agent 7 must populate all six fields.

Agent 9 receives these fields as part of the Scene Brief (§ 9.5) and must honour the `emotionalRegister` and `humourGuidance` as binding — not advisory.

---

### 10.3 Data Flow Through the Full CML

The following shows how each piece of information travels from generation to prose:

```
Agent 1           →  SETTING_REFINEMENT.era (technology, forensics, socialNorms, policing)
                     SETTING_REFINEMENT.atmosphere
                     SETTING_REFINEMENT.realism.anachronisms

Agent 2b          →  CHARACTER_PROFILES.profiles[]
                       .humourStyle, .humourLevel, .speechMannerisms
                       .physicalMannerisms, .privateLonging
                       .internalConflict, .personalStakeInCase, .gender

Agent 2c          →  LOCATION_PROFILES.primary, .keyLocations[]
                       .sensoryDetails (sights/sounds/smells/tactile)
                       .sensoryVariants

Agent 2d          →  TEMPORAL_CONTEXT
                       .specificDate.year, .specificDate.month
                       .seasonal (season, weather, daylight)
                       .fashion, .currentAffairs, .cultural

Agent 3            →  CASE.meta.era.specific_year, .specific_month, .wartime
                     CASE.cast[] (names, secrets, motives, behavioral_tells, gender)
                     CASE.false_assumption, .inference_path, .discriminating_test
                     CASE.prose_requirements (clue-to-scene mapping, test/clearance scenes)
                     
Agent 3b           →  (stored in hard_logic_devices artifact)
                     CASE.prose_requirements ← locked facts flow into clue_to_scene_mapping

Agent 6.5         →  WORLD_DOCUMENT
                       Section 1: .historicalMoment  ← reasons across TEMPORAL_CONTEXT + CASE.meta.era
                       Section 2: .characterPortraits ← reasons across CHARACTER_PROFILES + CASE.cast
                       Section 3: .characterVoiceSketches ← derives from .characterPortraits + profiles
                       Section 4: .locationRegisters ← reasons across LOCATION_PROFILES + CASE.meta.setting
                       Section 5: .storyEmotionalArc ← derives from CASE inference_path + discriminating_test
                       Section 6: .humourPlacementMap ← derives from CHARACTER_PROFILES humour fields + arc
                       .storyTheme         ← synthesised from CASE.meta.theme + arc + cast situation
                       .breakMoment        ← selects character + scene position for emotional break
                       .revealImplications ← names 2–3 earlier moments the reveal recontextualizes

Agent 7            →  NARRATIVE_OUTLINE.acts[].scenes[]
                       .emotionalRegister ← from WORLD_DOCUMENT.storyEmotionalArc.turningPoints
                       .dominantCharacterNote ← from WORLD_DOCUMENT.characterVoiceSketches
                       .humourGuidance ← from WORLD_DOCUMENT.humourPlacementMap
                       .eraTextureNote ← from WORLD_DOCUMENT.historicalMoment.physicalConstraints
                       .locationRegisterNote ← from WORLD_DOCUMENT.locationRegisters
                       .subtextNote ← synthesised by Agent 7 LLM from scene purpose + character registers + arc position

Agent 9 input per chapter:
   WORLD_DOCUMENT (full)                         ← era, voices, locations, arc, humour map
   NARRATIVE_OUTLINE.acts[N].scenes[S] (one)     ← scene brief with all enrichment notes
   CASE.prose_requirements.clue_to_scene_mapping ← clue obligation for this scene
   hard_logic_devices.lockedFacts                ← verbatim evidence values
   previous chapter tail (150 words)             ← continuity
```

Every input to Agent 9 traces to a field in the Full CML. Nothing is injected at runtime from outside the CML file.

---

### 10.4 Modular Sub-Schemas

The existing sub-schema files remain authoritative for their own validation:

| Sub-schema file | Owned by | Used for |
|-----------------|----------|---------|
| `setting_refinement.schema.yaml` | Agent 1 | Validates Agent 1 output before embedding in CML |
| `character_profiles.schema.yaml` | Agent 2b | Validates Agent 2b output before embedding |
| `location_profiles.schema.yaml` | Agent 2c | Validates Agent 2c output before embedding |
| `temporal_context.schema.yaml` | Agent 2d | Validates Agent 2d output before embedding |
| `background_context.schema.yaml` | Agent 2e | Validates Agent 2e output (not embedded — used as input to Agent 6.5) |
| `hard_logic_devices.schema.yaml` | Agent 3b | Validates hard logic output (not embedded — locked facts flow into `prose_requirements`) |
| `world_document.schema.yaml` | Agent 6.5 | Validates World Document before embedding in CML |
| `narrative_outline.schema.yaml` | Agent 7 | Validates enhanced outline before embedding in CML |
| `cml_2_0.schema.yaml` | Agents 3–4 and all | Validates Full CML including all composite sections |

The relationship is:
- Sub-schemas validate each artifact in isolation (fast, per-agent validation at generation time)
- `cml_2_0.schema.yaml` validates the assembled Full CML (run before Agent 9 starts, and again at release gate)

A Full CML is valid when all of the following are true:
1. `CASE` validates against `cml_2_0.schema.yaml` core section
2. Each composite section validates against its own sub-schema
3. `WORLD_DOCUMENT.validationConfirmations` has all boolean flags set to `true`
4. All `characterPortraits[].name` values match a name in `CASE.cast`
5. All `characterVoiceSketches[].name` values match a name in `CASE.cast`
6. All `locationRegisters[].locationId` values match an `id` in `LOCATION_PROFILES.keyLocations`
7. `NARRATIVE_OUTLINE` contains all six World-First scene fields for every scene

---

### 10.5 Backwards Compatibility

The composite sections are all `required: false` at the top level of `cml_2_0.schema.yaml`. This means:

- Existing Core CMLs (seed files in `examples/`) remain valid — they have no composite sections
- The existing validation pipeline (Agents 3–8) continues to work against Core CMLs
- The new World First pipeline requires a Full CML — if any composite section is missing, the pipeline raises a clear error naming the missing section and the agent that should have populated it
- The Full CML concept is additive, not breaking

The `CASE.meta.era` enrichment fields (`specific_year`, `specific_month`, `wartime`, `era_atmosphere`) are all `required: false`, so existing seed CMLs continue to validate. New generated CMLs are expected to populate them.

---

## Section 11 — Technical Specification

This section translates the World First functional specification (Sections 6–10) into concrete code-level changes. It covers every file that must be created or modified, the exact interfaces involved, and the sequencing of the new pipeline.

---

### 11.1 New Pipeline Sequence

**Current pipeline** (comment in `mystery-orchestrator.ts`):
```
Agent1 → Agent2 → Agent2e → Agent3b → Agent3 → Agent5 → Agent6 → Agent7
  → Agent2b → Agent2c → Agent2d → [CML Validation Gate] → Agent9
```

**New World First pipeline**:
```
Agent1 → Agent2 → Agent2e → Agent3b → Agent3 → Agent5 → Agent6
  → Agent2b → Agent2c → Agent2d
  → [Full CML Gate: all composite sections present + valid]
  → Agent6.5 (World Builder)
  → Agent7 (Enhanced: World-First scene enrichment)
  → [World Gate: WORLD_DOCUMENT.validationConfirmations all true + all scene fields set]
  → Agent9 (Rebuilt: world_brief replaces assembled blocks)
```

The key architectural shift: Agent 7 (Narrative Outline) moves to **after** Agent 6.5 so that every scene entry can be enriched with world-derived notes before prose generation begins.

---

### 11.2 Files to Modify

#### `apps/worker/src/jobs/agents/shared.ts`

**Change 1 — Add `worldDocument` to `OrchestratorContext`:**

After the `temporalContext` field, add:

```typescript
// After: temporalContext?: TemporalContextResult;
worldDocument?: WorldDocumentResult;
```

Import `WorldDocumentResult` from `@cml/prompts-llm`.

**Change 2 — Add `'world-builder'` to the pipeline stage union:**

The `MysteryGenerationProgress.stage` type (defined in `mystery-orchestrator.ts`) needs `'world-builder'` added as an option. Change string union:

```typescript
// Existing:
stage: 'setting' | 'cast' | ... | 'prose' | 'complete' | 'failed';

// New (add between narrative and prose):
stage: 'setting' | 'cast' | ... | 'narrative' | 'world-builder' | 'prose' | 'complete' | 'failed';
```

---

#### `apps/worker/src/jobs/mystery-orchestrator.ts`

**Change 1 — Import:**
```typescript
import { runAgent65 } from './agents/agent65-run.js';
```

**Change 2 — Pipeline comment and sequence:**

Replace the current pipeline comment block and the sequence of `await runAgentN(ctx)` calls:

```typescript
// Pipeline:
// Agent1 (Setting) → Agent2 (Cast) → Agent2e (Background Context)
// → Agent3b (Hard Logic Devices) → Agent3 (CML + Agent4 auto-revision)
// → Agent5 (Clue Distribution) → Agent6 (Fair Play + clue loop)
// → Agent2b (Character Profiles) → Agent2c (Location Profiles) → Agent2d (Temporal Context)
// → [Full CML Gate] → Agent6.5 (World Builder)
// → Agent7 (Enhanced Narrative Outline)
// → [World Gate] → Agent9 (Prose + Release Gate)
```

Execution order in `generateMystery()`:

```typescript
await runAgent1(ctx);
await runAgent2(ctx);
await runAgent2e(ctx);
await runAgent3b(ctx);
await runAgent3(ctx);
await runAgent5(ctx);
await runAgent6(ctx);
await runAgent2b(ctx);
await runAgent2c(ctx);
await runAgent2d(ctx);
assertFullCmlGate(ctx);          // throws if any composite section is missing
await runAgent65(ctx);
await runAgent7(ctx);
assertWorldGate(ctx);             // throws if world doc confirmations or scene fields incomplete
await runAgent9(ctx);
```

**Change 3 — `assertFullCmlGate(ctx)` helper (inline, before export):**

```typescript
function assertFullCmlGate(ctx: OrchestratorContext): void {
  const required: Array<[keyof OrchestratorContext, string]> = [
    ['characterProfiles', 'Agent2b'],
    ['locationProfiles',  'Agent2c'],
    ['temporalContext',   'Agent2d'],
    ['backgroundContext', 'Agent2e'],
  ];
  for (const [field, agent] of required) {
    if (!ctx[field]) {
      throw new Error(
        `Full CML Gate: missing ${String(field)} — ${agent} must complete successfully before Agent6.5`
      );
    }
  }
}
```

**Change 4 — `assertWorldGate(ctx)` helper:**

```typescript
function assertWorldGate(ctx: OrchestratorContext): void {
  if (!ctx.worldDocument) {
    throw new Error('World Gate: ctx.worldDocument is absent — Agent6.5 must complete before Agent7');
  }
  const conf = ctx.worldDocument.validationConfirmations;
  const failed = Object.entries(conf)
    .filter(([, v]) => v === false)
    .map(([k]) => k);
  if (failed.length > 0) {
    throw new Error(`World Gate: validationConfirmations failed: ${failed.join(', ')}`);
  }
  if (!ctx.narrative) {
    throw new Error('World Gate: ctx.narrative is absent — Agent7 must complete before this gate is checked');
  }
  // Scene field completeness check
  const sceneFields = [
    'emotionalRegister', 'dominantCharacterNote',
    'humourGuidance', 'eraTextureNote', 'locationRegisterNote', 'subtextNote',
  ] as const;
  for (const act of ctx.narrative.acts) {
    for (const scene of act.scenes) {
      for (const field of sceneFields) {
        if (!(scene as any)[field]) {
          throw new Error(
            `World Gate: scene "${scene.title}" missing World-First field "${field}"`
          );
        }
      }
    }
  }
}
```

**Change 5 — `worldDocument` in `MysteryGenerationResult`:**

```typescript
// Add to MysteryGenerationResult interface:
worldDocument?: WorldDocumentResult;

// Populate in generateMystery() return value:
worldDocument: ctx.worldDocument,
```

---

#### `apps/worker/src/jobs/agents/agent7-run.ts`

Agent 7's job expands: after `formatNarrative()` returns and the outline passes its quality gate, a second pass enriches every scene with world-derived notes from `ctx.worldDocument`.

**Change 1 — Pass worldDocument into formatNarrative() call:**

```typescript
// Current call site (approximate):
const narrative = await executeAgentWithRetry(/* ... */, async () => {
  return await formatNarrative({
    caseData: ctx.cml!,
    cast: ctx.cast!,
    // ...other inputs
  });
});

// New:
const narrative = await executeAgentWithRetry(/* ... */, async () => {
  return await formatNarrative({
    caseData: ctx.cml!,
    cast: ctx.cast!,
    worldDocument: ctx.worldDocument,   // NEW — undefined when not yet present
    // ...other inputs
  });
});
```

**Change 2 — World-First scene enrichment pass (after quality gate, before saving):**

```typescript
if (ctx.worldDocument) {
  applyWorldFirstSceneEnrichment(narrative, ctx.worldDocument);
}
ctx.narrative = narrative;
```

**New function `applyWorldFirstSceneEnrichment`** (in `agent7-run.ts` or extracted to `shared.ts`):

```typescript
function applyWorldFirstSceneEnrichment(
  narrative: NarrativeOutline,
  world: WorldDocumentResult
): void {
  const totalScenes = narrative.acts.reduce((n, a) => n + a.scenes.length, 0);
  let sceneIndex = 0;

  for (const act of narrative.acts) {
    for (const scene of act.scenes) {
      const position = sceneIndex / Math.max(totalScenes - 1, 1); // 0.0 – 1.0

      // emotionalRegister — find nearest arc turning point by enum position key
      const arcPos = toArcPosition(position);
      const tp = world.storyEmotionalArc.turningPoints.find(t => t.position === arcPos)
        ?? world.storyEmotionalArc.turningPoints[
             Math.min(
               Math.floor(position * world.storyEmotionalArc.turningPoints.length),
               world.storyEmotionalArc.turningPoints.length - 1
             )
           ];
      (scene as any).emotionalRegister = tp?.emotionalDescription
        ?? world.storyEmotionalArc.dominantRegister;

      // dominantCharacterNote — object { name, voiceRegister } from voice sketches
      const sceneChars: string[] = (scene as any).characters ?? [];
      const voice = world.characterVoiceSketches.find(
        (v) => sceneChars.some((c) => c.toLowerCase().includes(v.name.toLowerCase()))
      );
      (scene as any).dominantCharacterNote = voice
        ? { name: voice.name, voiceRegister: voice.voiceDescription }
        : undefined;

      // humourGuidance — object { permission, character?, form?, condition? }
      // Maps scene position to sceneType enum for humourPlacementMap lookup.
      const sceneType = toSceneType(ref.act, ref.actSceneNumber ?? ref.sceneNumber);
      const humourEntry = world.humourPlacementMap.find(h => h.scenePosition === sceneType);
      (scene as any).humourGuidance = humourEntry
        ? {
            permission: humourEntry.humourPermission,
            character: humourEntry.permittedCharacters?.[0] ?? undefined,
            form: humourEntry.permittedForms?.[0] ?? undefined,
            condition: humourEntry.condition ?? undefined,
          }
        : { permission: 'permitted' };

      // eraTextureNote — physical constraints from historical moment
      (scene as any).eraTextureNote = world.historicalMoment.physicalConstraints.join('; ');

      // locationRegisterNote — from location registers
      const locationId: string = (scene as any).locationId ?? '';
      const locReg = world.locationRegisters.find((l) => l.locationId === locationId);
      (scene as any).locationRegisterNote = locReg
        ? `${locReg.emotionalRegister} — ${locReg.cameraAngle}`
        : '';

      // subtextNote is NOT set here — it requires creative LLM reasoning about what the scene
      // is really about beneath its surface purpose. It is generated by Agent 7's LLM during
      // the formatNarrative() call and should already be present in the Agent 7 output.

      sceneIndex++;
    }
  }
}

/**
 * Maps a normalised scene position (0.0–1.0) to the nearest storyEmotionalArc
 * turningPoints.position enum value.
 * Enum values: opening | early | first_turn | mid | second_turn | pre_climax | climax | resolution
 */
function toArcPosition(pos: number): string {
  if (pos < 0.12) return 'opening';
  if (pos < 0.25) return 'early';
  if (pos < 0.38) return 'first_turn';
  if (pos < 0.55) return 'mid';
  if (pos < 0.68) return 'second_turn';
  if (pos < 0.82) return 'pre_climax';
  if (pos < 0.93) return 'climax';
  return 'resolution';
}

/**
 * Maps act number + scene-in-act to a humourPlacementMap scenePosition enum value.
 * Best-effort deterministic mapping; Agent 7's LLM may produce a more precise type
 * derived from the scene's purpose field.
 */
function toSceneType(act: number, sceneInAct: number): string {
  if (act === 1 && sceneInAct === 1) return 'opening_scene';
  if (act === 1 && sceneInAct === 2) return 'first_investigation';
  if (act === 1) return 'first_interview';
  if (act === 2 && sceneInAct <= 2) return 'mid_investigation';
  if (act === 2 && sceneInAct <= 3) return 'tension_scene';
  if (act === 2) return 'pre_climax';
  if (act === 3 && sceneInAct === 1) return 'discriminating_test';
  if (act === 3 && sceneInAct === 2) return 'revelation';
  return 'resolution';
}
```

---

#### `apps/worker/src/jobs/agents/agent9-run.ts`

**Change 1 — Pass worldDocument to generateProse():**

```typescript
// Current call:
const result = await generateProse({
  caseData: ctx.cml!,
  outline: ctx.narrative!,
  cast: ctx.cast!,
  characterProfiles: ctx.characterProfiles,
  locationProfiles: ctx.locationProfiles,
  temporalContext: ctx.temporalContext,
  // ...
});

// New:
const result = await generateProse({
  caseData: ctx.cml!,
  outline: ctx.narrative!,
  cast: ctx.cast!,
  worldDocument: ctx.worldDocument,          // NEW
  characterProfiles: ctx.characterProfiles,  // kept for fallback
  locationProfiles: ctx.locationProfiles,    // kept for fallback
  temporalContext: ctx.temporalContext,       // kept for fallback
  // ...
});
```

When `worldDocument` is present, the prompt assembly in `agent9-prose.ts` uses the `world_brief` block and demotes the individual profile blocks to `medium` priority. When absent, behaviour is unchanged — full backwards compatibility.

---

#### `packages/prompts-llm/src/agent9-prose.ts`

**Change 1 — Add `worldDocument` to `ProseGenerationInputs`:**

```typescript
import type { WorldDocumentResult } from './types/world-document.js';

// In ProseGenerationInputs interface, add after temporalContext:
worldDocument?: WorldDocumentResult;
```

**Change 2 — New `world_brief` prompt block:**

The existing prompt assembly has ~15 context blocks with priority budgeting. Add a new block:

```typescript
const worldBriefBlock = inputs.worldDocument
  ? buildWorldBriefBlock(inputs.worldDocument, sceneIndex)
  : null;
```

Where `buildWorldBriefBlock` returns a string containing:
- **Historical moment** — `specificDate`, `eraRegister`, `currentTensions`, `physicalConstraints`, `emotionalRegister`, and (if wartime) `wartimeServiceContext`
- **Character voice sketches** — for each character in the current scene: `voiceDescription` + all `fragments` grouped by register; `humourNote` if present
- **Location register** — `emotionalRegister`, `cameraAngle`, `eraNote` for the scene's location
- **Emotional arc note** — nearest turning point's `emotionalDescription`
- **Humour guidance** — `humourPermission`, `condition`, `permittedCharacters`, `permittedForms` for this position
- **Break moment** — if `world.breakMoment.scenePosition` matches current scene, instruct: "this is the break moment — `character` should `form`"
- **Reveal implications** — if this is the reveal scene (act 3, final third of scene count), include `revealImplications`

Priority: `critical` when `worldDocument` present (same tier as `clue_obligations`).
Token budget: ≤ 800 tokens per chapter call (the `world_brief` block replaces the three blocks it supersedes, so net budget impact is neutral).

**Change 3 — Demote superseded blocks when `worldDocument` present:**

```typescript
// In priority budget logic:
const characterPersonalityPriority = inputs.worldDocument ? 'medium' : 'high';
const eraAuthenticityPriority      = inputs.worldDocument ? 'medium' : 'high';
```

**Change 4 — Victim resolution fix:**

Replace the brittle substring search for victim name with role-based lookup:

```typescript
// Old (fragile):
const victim = caseData.cast.find(c => c.name?.toLowerCase().includes('victim'));

// New:
const victim = caseData.cast.find(c => c.role === 'victim');
```

---

### 11.3 New Files to Create

#### `packages/prompts-llm/src/types/world-document.ts`

```typescript
export interface WorldDocumentHistoricalMoment {
  specificDate: string;
  eraRegister: string;
  currentTensions: string[];
  physicalConstraints: string[];
  emotionalRegister: string;
  wartimeServiceContext?: {
    percentage: number;
    branch: string;
    implication: string;
  };
}

export interface WorldDocumentCharacterPortrait {
  name: string;
  portrait: string;
  eraIntersection: string;
}

export interface WorldDocumentVoiceFragment {
  register: 'comfortable' | 'evasive' | 'stressed' | 'humorous' | 'formal';
  text: string;
}

export interface WorldDocumentCharacterVoiceSketch {
  name: string;
  voiceDescription: string;
  fragments: WorldDocumentVoiceFragment[];
  humourNote?: string;
}

export interface WorldDocumentLocationRegister {
  locationId: string;
  name: string;
  emotionalRegister: string;
  eraNote?: string;
  cameraAngle: string;
}

export interface WorldDocumentArcTurningPoint {
  position: string;   // decimal string e.g. "0.30"
  emotionalDescription: string;
}

export interface WorldDocumentEmotionalArc {
  dominantRegister: string;
  arcDescription: string;
  turningPoints: WorldDocumentArcTurningPoint[];
  endingNote: string;
}

export interface WorldDocumentHumourEntry {
  scenePosition: string;
  humourPermission: 'permitted' | 'conditional' | 'forbidden';
  condition?: string;
  permittedCharacters?: string[];
  permittedForms?: string[];
  rationale: string;
}

export interface WorldDocumentBreakMoment {
  character: string;
  scenePosition: string;
  form: string;
  narrativeFunction: string;
}

export interface WorldDocumentValidationConfirmations {
  noNewCharacterFacts: boolean;
  noNewPlotFacts: boolean;
  castComplete: boolean;
  eraSpecific: boolean;
  lockedFactsPreserved: boolean;
  humourMapComplete: boolean;
}

export interface WorldDocumentResult {
  status: 'draft' | 'final';
  storyTheme: string;
  historicalMoment: WorldDocumentHistoricalMoment;
  characterPortraits: WorldDocumentCharacterPortrait[];
  characterVoiceSketches: WorldDocumentCharacterVoiceSketch[];
  locationRegisters: WorldDocumentLocationRegister[];
  storyEmotionalArc: WorldDocumentEmotionalArc;
  humourPlacementMap: WorldDocumentHumourEntry[];
  breakMoment: WorldDocumentBreakMoment;
  revealImplications: string;
  validationConfirmations: WorldDocumentValidationConfirmations;
  cost: number;
  durationMs: number;
}
```

---

#### `packages/prompts-llm/src/agent65-world-builder.ts`

Public signature:

```typescript
export async function generateWorldDocument(
  inputs: WorldBuilderInputs,
  client: AzureOpenAIClient
): Promise<WorldDocumentResult>
```

**`WorldBuilderInputs` interface:**

```typescript
export interface WorldBuilderInputs {
  caseData: CaseData;
  characterProfiles: any;   // CharacterProfilesResult
  locationProfiles: any;    // LocationProfilesResult
  temporalContext: any;     // TemporalContextResult
  backgroundContext: any;   // BackgroundContextArtifact
  hardLogicDevices: any;    // HardLogicDeviceResult — supplies lockedFacts
  model?: string;
  onProgress?: (phase: string, message: string) => void;
}
```

**Prompt structure — single LLM call:**

*System message:*
> You are the World Builder for a mystery story. Your sole job is to synthesise the factual case record into a living document that the prose writer will read as their entire context. You must not invent any new character facts, plot facts, or clues. You reason from what exists; you add texture, voice, and emotional register. Every locked fact must be preserved verbatim.

*User message — JSON payload of inputs:*
```
CASE: <CASE section of CML>
CHARACTER_PROFILES: <full profiles>
LOCATION_PROFILES: <full profiles>
TEMPORAL_CONTEXT: <full temporal context>
BACKGROUND_CONTEXT: <summary and key context>
LOCKED_FACTS: <hard logic locked facts array>
```

*Instructions:*
Produce a single JSON object conforming to `WorldDocumentResult`. Populate all six sections (historicalMoment, characterPortraits, characterVoiceSketches, locationRegisters, storyEmotionalArc, humourPlacementMap) plus `storyTheme`, `breakMoment`, `revealImplications`. Set `validationConfirmations` by self-checking each boolean criterion honestly. Set `status: "final"`.

*Retry policy:* One retry on JSON parse failure or validation failure. Second failure → throw `AgentError` with full validation report.

**Validation:**
- Parse JSON with `jsonrepair` fallback
- Validate against `world_document.schema.yaml` using `validateArtifact()`
- Verify `characterPortraits.length === caseData.cast.length`
- Verify `characterVoiceSketches.length === caseData.cast.length`
- Verify `validationConfirmations` all `true` (throw if any `false`)

---

#### `apps/worker/src/jobs/agents/agent65-run.ts`

```typescript
import type { OrchestratorContext } from './shared.js';
import { generateWorldDocument } from '@cml/prompts-llm';
import { executeAgentWithRetry } from './shared.js';

export async function runAgent65(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress?.('world-builder', 'Generating World Document', 0);

  await executeAgentWithRetry(
    ctx,
    'agent65_world_builder',
    async () => {
      ctx.worldDocument = await generateWorldDocument(
        {
          caseData: ctx.cml!,
          characterProfiles: ctx.characterProfiles!,
          locationProfiles: ctx.locationProfiles!,
          temporalContext: ctx.temporalContext!,
          backgroundContext: ctx.backgroundContext!,
          hardLogicDevices: ctx.hardLogicDevices!,
          clueDistribution: ctx.clues!,
          onProgress: (phase, msg) =>
            ctx.reportProgress?.('world-builder', `${phase}: ${msg}`, 50),
        },
        ctx.client
      );
    }
  );

  ctx.reportProgress?.('world-builder', 'World Document complete', 100);
}
```

---

#### `packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts`

**Phase key:** `'agent65_world_builder'`

**Scoring rubric:**

| Check | Type | Criterion | Score contribution |
|-------|------|-----------|-------------------|
| `validationConfirmations` | Gate | All 6 booleans `true` | Pass/fail — fail aborts pipeline |
| `characterPortraits` coverage | Scored | All `CASE.cast` members covered | 0–20 pts |
| `characterVoiceSketches` fragment count | Scored | Each sketch has ≥ 3 fragments across ≥ 2 registers | 0–20 pts |
| `humourPlacementMap` coverage | Scored | Entries for all 12 scene positions (early/mid/late × 4) | 0–20 pts |
| `storyEmotionalArc.arcDescription` | Scored | 200–300 words | 0–20 pts |
| `breakMoment` populated | Scored | All 4 fields non-empty | 0–10 pts |
| `storyTheme` populated | Scored | ≥ 20 words | 0–10 pts |

**Maximum score:** 100. **Pass threshold:** 70 (gate always checked independently of score).

---

### 11.4 Export wiring

**`packages/prompts-llm/src/index.ts`** — add:
```typescript
export { generateWorldDocument } from './agent65-world-builder.js';
export type { WorldBuilderInputs } from './agent65-world-builder.js';
export type { WorldDocumentResult } from './types/world-document.js';
// ... individual sub-types if needed by agent7-run.ts
```

**`packages/story-validation/src/scoring/index.ts` (or equivalent)** — add:
```typescript
export { Agent65WorldBuilderScorer } from './phase-scorers/agent65-world-builder-scorer.js';
```

---

### 11.5 Narrative Outline schema additions

The `narrative_outline.schema.yaml` scene entry needs six optional fields (already added in Section 10):

```yaml
emotionalRegister:
  type: string
  required: false
  description: "Emotional tone of this scene from World Document arc"
dominantCharacterNote:
  type: object
  required: false
  fields:
    name:
      type: string
      required: true
      description: "Character whose voice and perspective dominates this scene"
    voiceRegister:
      type: string
      required: true
      description: "How this character sounds in this scene, from World Document voice sketches"
humourGuidance:
  type: object
  required: false
  fields:
    permission:
      type: string
      required: true
      allowed: [permitted, conditional, forbidden]
    character:
      type: string
      required: false
    form:
      type: string
      required: false
    condition:
      type: string
      required: false
eraTextureNote:
  type: string
  required: false
  description: "Physical era constraints applicable to this scene"
locationRegisterNote:
  type: string
  required: false
  description: "Location emotional register and camera angle from World Document"
subtextNote:
  type: string
  required: false
  description: "What this scene is really about beneath its surface purpose — generated by Agent 7 LLM"
```

These are all `required: false`. Validation gate (`assertWorldGate`) checks all six fields at runtime after Agent 7 runs.

---

### 11.6 Implementation order

Execute in this sequence to avoid forward-dependency build failures:

1. **`packages/prompts-llm/src/types/world-document.ts`** — type definitions only, no deps
2. **`schema/world_document.schema.yaml`** — already complete (Section 10 work)
3. **`packages/prompts-llm/src/agent65-world-builder.ts`** — depends on step 1
4. **`packages/prompts-llm/src/index.ts`** — add exports (step 3 must exist first)
5. **`packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts`** — depends on step 1
6. **`apps/worker/src/jobs/agents/shared.ts`** — add `worldDocument` field (depends on step 1 export from step 4)
7. **`apps/worker/src/jobs/agents/agent65-run.ts`** — depends on steps 3, 4, 6
8. **`apps/worker/src/jobs/agents/agent7-run.ts`** — add enrichment pass (depends on step 6)
9. **`apps/worker/src/jobs/agents/agent9-run.ts`** — add worldDocument pass-through (depends on step 6)
10. **`packages/prompts-llm/src/agent9-prose.ts`** — add worldDocument to inputs + prompt block (depends on step 1)
11. **`apps/worker/src/jobs/mystery-orchestrator.ts`** — pipeline resequencing and gate helpers (depends on steps 6, 7)

Each step can be verified in isolation: steps 1–5 are pure package work with no pipeline impact; steps 6–10 add fields behind `?` so existing tests remain green; step 11 is the activation step that wires everything into the live pipeline.

---

### 11.7 Test surface

| Scope | What to test |
|-------|-------------|
| `agent65-world-builder.ts` unit | Given valid inputs, returns `WorldDocumentResult` with all sections; `validationConfirmations` all true; portrait count equals cast count |
| `agent65-world-builder.ts` retry | On first JSON parse failure, retries once; second failure throws `AgentError` |
| `applyWorldFirstSceneEnrichment` unit | All 5 fields set on every scene; `humourGuidance` respects position; no crash when `locationId` absent |
| `assertFullCmlGate` unit | Throws with correct field name when any composite section is absent; passes when all present |
| `assertWorldGate` unit | Throws when `validationConfirmations` has false entry; throws when scene field missing; passes when all valid |
| Agent65 scorer unit | Gate fails when any confirmation false; score 100 with perfect input; partial score on incomplete humour map |
| `agent9-prose.ts` unit | `buildWorldBriefBlock` returns non-empty string with voice fragments; break moment included only at matching scene; reveal implications included only in act 3 late scenes |
| Pipeline integration | Full run with worldDocument present yields outline with all 5 scene fields; prose chapters reference voice sketches not raw profile text |

---

### 11.8 Agent 6.5: Complete Prompt Specification

This section is the implementation-ready prompt for `generateWorldDocument()` in `agent65-world-builder.ts`. Writing the exact system message and user message template here resolves the three items previously flagged as "specified at functional level only": era lived-context reasoning, character voice sketch generation, and humour placement map generation.

---

#### 11.8.1 System Message

```
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
  - You must not invent any new character secrets, new relationships, or new backstory beyond
    what is in the provided inputs.
  - You must not name the culprit identity or describe any clue in specific forensic detail.
  - Every locked fact (exact times, distances, quantities, measurements) must appear in this
    document exactly as given — not paraphrased, not rounded, not changed.
  - Character voice sketches must be consistent with the speechMannerisms and humourStyle
    from the character profiles. A character with humourStyle: "none" must not produce wit.
  - The historical moment section must reason from the specific year and month provided.
    It must not be a general description of the decade. A reviewer should be able to
    identify the approximate date from the historicalMoment section alone.
  - All text fields must be written as if addressed to a novelist about to write this story:
    purposeful, not bureaucratic; specific, not generic.

You will produce a single JSON object. Return only the JSON. No preamble, no commentary.
```

---

#### 11.8.2 User Message Template

The user message is constructed by `generateWorldDocument()` by injecting all inputs into a fixed template. Variable injection points are shown as `{VARIABLE_NAME}`.

```
## INPUTS

### CASE
{CASE_JSON}

### CHARACTER_PROFILES
{CHARACTER_PROFILES_JSON}

### LOCATION_PROFILES
{LOCATION_PROFILES_JSON}

### TEMPORAL_CONTEXT
{TEMPORAL_CONTEXT_JSON}

### BACKGROUND_CONTEXT
{BACKGROUND_CONTEXT_JSON}

### LOCKED_FACTS
{LOCKED_FACTS_JSON}

### CLUE_DISTRIBUTION
{CLUE_DISTRIBUTION_JSON}

---

## OUTPUT INSTRUCTIONS

Produce a JSON object with the following fields. All fields are required unless marked optional.

---

### storyTheme

One sentence. The story's deeper meaning beneath its plot. Not a plot summary — what is this
story really about as a human experience? Examples of the level expected:
  - "The story is about how a community's desire to protect its own can become indistinguishable from the act it claims to oppose."
  - "A story about the costs of certainty — how the need to be right about one person blinds every character to something they already know."

---

### historicalMoment

An object with these fields:

**specificDate** (string)
Repeat the year and month from TEMPORAL_CONTEXT exactly (e.g. "November 1940").

**eraRegister** (string, 200–300 words)
What is it like to live through this specific moment? Reason from the exact year and month.
What has just happened? What is everyone aware of? What is the dominant texture of daily life?

Era reasoning rules:
  - For any date September 1939 – August 1945:
      Establish the war's current state at the specific date (not just "WWII is happening").
      Name at least one specific current event — a campaign, a policy change, a rationing
      measure, a piece of news — that people in this setting know about and feel.
      Describe civilian life texture at this date: blackout, billeting, rationing, changed
      employment, changed social mixing, communication constraints, the presence of service
      people on leave.
      Establish the dominant emotional register: dread, exhausted normality, grim
      determination, strange social freedoms, grief.
  - For 1945–1950:
      Distinguish pre/post-VE Day (May 8 1945) and VJ Day (August 15 1945).
      Address the texture of aftermath: relief mixed with grief, men returning changed,
      rationing continuing, the welfare state forming, broken pre-war certainties.
  - For all other periods:
      Name what is in the cultural air at this specific year and month — the social
      anxieties, the conversations people are having and avoiding, the technology
      or politics that has recently changed daily life.

This section must not be generic. A story set in November 1940 must read differently from
one set in July 1943.

**currentTensions** (array of 3–5 strings)
Specific current-event pressures people in this setting would feel at this date. Each item
is a concrete fact, not a generalisation. Examples of the level expected:
  - "The Blitz has been running for six weeks. Last Tuesday's raid hit the city centre."
  - "Conscription notices arrived last month for men born 1918–1920."
  - NOT ACCEPTABLE: "There was a war on."

**physicalConstraints** (array of 3–6 strings)
Era-specific physical constraints on how people move, communicate, and behave in this story.
Examples:
  - "Blackout curtains required after 6 PM — no light visible from outside"
  - "Telephone calls routed through the exchange operator; delay of 10–40 minutes"
  - "Private cars: 4-gallon monthly petrol ration. Most journeys are by bicycle or foot."
  - "Letters may take 2–4 days to arrive; telegrams are associated with bad news"

**emotionalRegister** (string, one sentence)
The dominant collective emotional state of civilians in this setting at this date.
Examples:
  - "Grim determined normality with an undertow of dread none of them will name."
  - "Relieved but not yet able to believe it — the body still braced for the next blow."

**wartimeServiceContext** (object — required if meta.era.wartime === true, else omit)
An object with:
  - serviceStatus (string): For each male cast member of service age (broadly 18–41),
    state their service status. Use one of these categories:
      IN_SERVICE      — Serving in a named branch (Army, Royal Navy, Royal Air Force,
                        Merchant Navy, Home Guard, ARP, civil defence, fire service,
                        police war reserve, Women's Auxiliary services for female cast)
      RESERVED        — Civilian in a reserved occupation (doctor, clergyman, farmer,
                        miner, key industrial worker, scientist, civil servant in
                        critical role, minister of religion)
      EXEMPT          — Formally exempt: medical grounds, conscientious objector,
                        aged out of call-up window at the outbreak date, invalided out
      DEFERRED        — Awaiting call-up; class or quota not yet reached at this date
      UNACCOUNTED     — Status not explained; the social absence of an explanation is
                        itself a fact every character in the room notices
    For any UNACCOUNTED male of service age: note explicitly that this status requires
    social explanation in the prose and that other characters will notice it.
  - socialTexture (string): What does it mean in this setting at this date for a man of
    service age to be in civilian clothes? What do the other characters register when they
    see him? What is the etiquette of not asking?
  - absenceEffect (string, optional): If any cast member is absent due to war service
    or recently returned, how does this affect the social dynamic?

---

### characterPortraits

An array with one entry per cast member, in the same order as CASE.cast.

For each cast member:

**name** (string): Must exactly match the name in CASE.cast.

**portrait** (string, 80–120 words)
This character's specific relationship to the historical moment. Answer:
  - How has the era shaped or constrained this person?
  - What do they want right now, in this specific month of this year?
  - What are they afraid of — and how much of that fear is about the case vs the world?
For WWII stories: state this character's service status from the serviceStatus classification.

Requirements:
  - Must reference at least one specific fact from the character's CML entry (motive,
    secret, or behavioral tell)
  - Must not introduce new facts not in CML or character profiles
  - Must not reveal secrets the character hides from others

**eraIntersection** (string, one sentence)
How this character's private situation (their CML secret or motive) intersects with the
historical moment. Pin this to the specific date, not to the decade.

---

### characterVoiceSketches

An array with one entry per cast member, in the same order as CASE.cast.

For each cast member:

**name** (string): Must exactly match the name in CASE.cast.

**voiceDescription** (string, one sentence)
How this character sounds and speaks. Functional and concrete — no labels. Do not write
"dry wit" or "formal register": write what they actually do.
Examples:
  - "Speaks in complete, well-formed sentences that end before the full thought is out, as if she decided against saying the last part."
  - "Answers questions with another question unless he's certain. Then he is very certain."

**fragments** (array of 3–4 objects)
Each fragment has:
  - register: one of "comfortable", "evasive", "stressed", "humorous", "formal"
    Must cover "comfortable" and "evasive" as a minimum.
    Use "humorous" only if humourLevel > 0.3 in character profiles.
  - text: 2–4 lines of actual speech in this character's voice. No attribution.
    No stage directions. No clue references.

Voice sketch rules:
  - Fragments must be consistent with speechMannerisms and humourStyle from
    CHARACTER_PROFILES. A character described as "clipped" must speak in clipped
    fragments. A character with humourStyle: "none" must not produce accidental wit.
  - Era-appropriate idiom is required. No anachronistic phrasing.
  - The detective's "comfortable" register must project intelligence and observation.
    Any wit in the detective's voice is rare and precise — never warmth or social ease.
  - No two characters' fragment sets should be interchangeable. If you read two
    characters' fragments without names, you should be able to tell them apart.
  - For characters with humourStyle != "none": the "humorous" fragment must demonstrate
    the specific form (understatement, dry wit, observational) not just a light remark.
    The humour must feel in-character, not generically "witty."

**humourNote** (string, optional — include only if humourLevel > 0 in character profiles)
One sentence. What specifically does their wit look like in practice? Expressed as what
they do, not what their style is labelled.
Example: "Takes a beat before answering a pointed question — long enough that the pause
becomes the joke — then says the most obvious true thing, which lands because no one
expected honesty."

---

### locationRegisters

An array with one entry per key location in LOCATION_PROFILES.

For each location:

**locationId** (string): Must match a keyLocation id from LOCATION_PROFILES.
**name** (string): Location name.

**emotionalRegister** (string, 60–100 words)
What it feels like to be in this location given the story's specific circumstances.
Not generic atmosphere — the atmosphere of this place in this story, at this moment
when a crime has happened or is about to be investigated. Concrete and imagistic.
Must reference at least one sensory detail from the location profile.

**cameraAngle** (string, one sentence)
Not a photography metaphor — an emotional stance. Where does a writer stand, and what
do they notice first, to capture this location most truly?
Example: "Start at the doorway looking in — the room always feels smaller than it should
be, as if it holds something that takes up space without being visible."

**eraNote** (string, optional)
If the era imposes a specific physical constraint on this location — blackout, wartime
requisitioning, restricted access — note it here in one sentence.

Each location must feel distinct from the others.

---

### storyEmotionalArc

An object with:

**dominantRegister** (string, one sentence)
The story's overall emotional character. Examples:
  - "Cold intellectual rigor with two or three moments of genuine human warmth that make the ending land harder."
  - "A social comedy that turns dark without ever raising its voice."

**arcDescription** (string, 200–300 words)
The emotional shape of the story from opening to close. Not a plot summary — an emotional
map. Where does the story breathe? Where does it accelerate? Where is the tension
unbearable? What is the register of the ending and what should linger?
This must be derivable from the CML's inference path (rising uncertainty) and discriminating
test (the moment certainty is achieved) — expressed in emotional terms, not structural ones.
Must not mention specific clue IDs, mechanism details, or name the culprit.

**turningPoints** (array of 8 objects, one per arc position)
Must cover all 8 position values in order: "opening", "early", "first_turn", "mid",
"second_turn", "pre_climax", "climax", "resolution".
Each entry:
  - position: one of the 8 values above
  - emotionalDescription: one sentence describing the dominant emotional register at
    this story position. This is what Agent 7 uses for scene-level emotional register notes.

**endingNote** (string, one sentence)
What emotional register does the ending carry? What should a reader feel when they close
the book — not about the plot, but about the experience?

---

### humourPlacementMap

An array of 12 objects, one per scene position. All 12 positions are required with no
omissions. The 12 positions are:
  "opening_scene", "first_investigation", "body_discovery", "first_interview",
  "domestic_scene", "mid_investigation", "second_interview", "tension_scene",
  "pre_climax", "discriminating_test", "revelation", "resolution"

For each entry:

**scenePosition** (string): One of the 12 values above.

**humourPermission** (string): "permitted", "conditional", or "forbidden".

Placement rules — these are binding, not advisory:
  - "body_discovery", "discriminating_test", "revelation": ALWAYS "forbidden".
    No exceptions. The discovery of the crime and the revelation of guilt are solemn.
  - "tension_scene", "pre_climax": "forbidden" unless the scene contains a character
    with humourLevel > 0.7 AND the scene does not involve direct threat or violence.
    In that case "conditional" is allowed with an explicit condition.
  - Characters with humourLevel < 0.3 must not appear in permittedCharacters even if
    their humourStyle is non-none.
  - Characters with humourLevel > 0.6 should appear in permittedCharacters wherever
    humourPermission is "permitted".
  - The detective (role: "detective") may appear in permittedCharacters only for
    "domestic_scene" and "resolution", and only with "understatement" or "dry_wit"
    as the permitted form. Never "observational" or "self_deprecating".
  - No scene position should have ALL cast members as permitted. There must always be
    at least one present character from whom humour would be inappropriate.

**condition** (string, required if humourPermission === "conditional")
The specific condition under which humour is allowed. Must be a concrete narrative
condition, not a vague qualifier.
Example: "Only if the scene closes before the confrontation — cut away while it still
feels social, not threatening."

**permittedCharacters** (array of strings, required unless humourPermission === "forbidden")
Character names (exact match with CASE.cast) who may carry humour in this scene type.

**permittedForms** (array of strings, required unless humourPermission === "forbidden")
One or more of: "understatement", "dry_wit", "observational", "self_deprecating",
"sardonic", "deadpan"

**rationale** (string, one sentence)
Why humour is or is not appropriate here — grounded in the story's emotional moment,
not in an abstract principle.

---

### breakMoment

An object specifying the one scene in this story where a non-detective, non-culprit
character loses emotional control.

**character** (string): Name of a non-culprit, non-detective cast member with significant
personal stake in the case or the era. Must have a plausible reason for breaking.

**scenePosition** (string): One of the 12 humourPlacementMap positions. Best placed at
"tension_scene" or "pre_climax".

**form** (string): How loss of control manifests. Specific, not abstract.
Examples:
  - "sudden controlled fury at a question they interpret as an accusation"
  - "a pause that is too long, followed by a factual statement that is technically true
    and obviously a deflection"
  - "tears that arrive before they can stop them, which they immediately and thoroughly
    deny having had"

**narrativeFunction** (string, one sentence)
Why this moment matters — what it gives the reader about this character and this story.

---

### revealImplications

A string (90–150 words). Name 2–3 earlier story moments that the final revelation will
retroactively recolour. Written as an author's note to the prose writer.

For each moment: describe what the reader will remember and why it will feel different
once the truth is known. Give enough specific texture that the prose writer knows what
to plant.

Example of the level required:
"When we first see [character] in the library, there should be something slightly wrong
about how quickly she answers the detective's question about the time — not a lie, but
an answer she had ready. Most readers will miss it. Some won't. After the revelation,
everyone will remember it. Plant a small physical tell: a stillness that comes just
before the words, not the hesitation after."

Do not name the culprit explicitly. Do not describe mechanism details.

---

### validationConfirmations

An object with these six boolean fields. Self-check each criterion honestly before setting
the value. If a check fails, set the value to a descriptive string explaining the failure
(not false — a string, so the retry logic can extract the reason), e.g.:
"noNewCharacterFacts": "FAIL — portrait for Eleanor Hartley introduces new backstory
about her brother not present in CASE.cast or CHARACTER_PROFILES"

  - **noNewCharacterFacts**: true if every fact about every character in this document
    is derivable from CASE.cast or CHARACTER_PROFILES inputs. No new secrets,
    relationships, or backstory.
  - **noNewPlotFacts**: true if the arcDescription, turningPoints, and revealImplications
    describe emotional beats only — no culprit named, no mechanism described, no clue
    content quoted.
  - **castComplete**: true if every person named in CASE.cast appears in BOTH
    characterPortraits AND characterVoiceSketches.
  - **eraSpecific**: true if historicalMoment.eraRegister contains at least one dateable
    specific event, measure, or detail that could not apply to any other year in the decade.
  - **lockedFactsPreserved**: true if every value in LOCKED_FACTS appears in this document
    exactly as provided (not paraphrased, not rounded).
  - **humourMapComplete**: true if humourPlacementMap contains exactly 12 entries covering
    all 12 required scene positions.

Return the JSON object. No preamble. No commentary.
```

---

#### 11.8.3 Retry User Message Prefix

When `generateWorldDocument()` retries due to validation or confirmation failures, the retry call prepends this block to the original user message:

```
## PREVIOUS ATTEMPT FAILURES — YOU MUST FIX ALL OF THESE

{FAILURE_LIST}

Each item above is a specific failure in your previous output. Address each one explicitly
before producing the corrected JSON. Do not omit any section or add new information to fix
a previous failure — correct only what is listed.

---

{ORIGINAL_USER_MESSAGE}
```

Where `{FAILURE_LIST}` is the list of failures formatted as:
```
- noNewCharacterFacts: FAIL — portrait for Eleanor Hartley introduces new backstory not in inputs
- castComplete: FAIL — Margaret Treverton appears in CASE.cast but has no entry in characterVoiceSketches
```

---

### 11.9 NarrativeState Simplification

`packages/prompts-llm/src/types/narrative-state.ts` is simplified from 7 fields and 4 helper functions to 3 fields and 1 simplified helper.

#### Interface: before → after

**Remove from `NarrativeState` interface:**

| Field removed | Why |
|--------------|-----|
| `usedOpeningStyles: string[]` | Prevented by per-scene `emotionalRegister` notes in enhanced outline; structural variety, not post-hoc tracking |
| `usedSensoryPhrases: string[]` | Prevented by per-location emotional register in World Document; structural anchoring, not phrase avoidance |
| `chapterSummaries: Array<{chapterNumber: number; summary: string}>` | Replaced by `continuityTail` passed directly per chapter call; no rolling summary accumulation |

**Add to `NarrativeState` interface:**

```typescript
/**
 * Last 150 words of the most recently accepted chapter.
 * Populated by the orchestrator after each accepted chapter.
 * Empty string for first chapter.
 */
continuityTail: string;
```

**Resulting simplified interface:**

```typescript
export interface NarrativeState {
  version: 1;
  lockedFacts: LockedFact[];
  characterPronouns: Record<string, string>;
  cluesRevealedToReader: string[];
  continuityTail: string;
}
```

#### Functions: before → after

**Remove entirely:**

| Function | Reason |
|----------|--------|
| `classifyOpeningStyle(openingSentence)` | Tracking opening styles no longer needed; World-First outline provides per-scene emotional register |
| `extractSensoryPhrases(text, limit)` | Tracking sensory phrases for avoidance no longer needed |

**Simplify `initNarrativeState()`:**

Remove `usedOpeningStyles: []`, `usedSensoryPhrases: []`, `chapterSummaries: []` from the returned object. Add `continuityTail: ''`.

**Simplify `updateNSD()`:**

The function signature changes:

```typescript
// Before:
export function updateNSD(
  current: NarrativeState,
  completedChapters: Array<{ title?: string; summary?: string; paragraphs?: string[] }>,
  startChapterNumber: number,
): NarrativeState

// After:
export function updateNSD(
  current: NarrativeState,
  lastChapter: { paragraphs?: string[]; cluesRevealedIds?: string[] },
): NarrativeState
```

The new implementation:
1. Extracts last 150 words from `lastChapter.paragraphs` → sets `continuityTail`
2. Appends any new clue IDs from `lastChapter.cluesRevealedIds` to `cluesRevealedToReader`
3. Returns new state (does not mutate)
4. Removes all opening style and sensory phrase extraction logic

**Call sites to update in `mystery-orchestrator.ts`:**

Every `updateNSD(state, batchChapters, batchStart)` call becomes `updateNSD(state, lastChapterInBatch)`. The `batchStart` parameter is removed.

**NSD block in `agent9-prose.ts` (`buildNSDBlock()`):**

Remove from the NSD prompt block:
- `Used opening styles (avoid repeating): [...]`
- `Sensory phrases used (avoid): [...]`
- `Chapter summaries: [...]`

Retain in the NSD prompt block:
- `Locked facts (must appear verbatim when relevant): [...]`
- `Character pronouns: [...]`
- `Clues already revealed to reader: [...]`
- `Continuity: begin where this left off: [last 150 words]`

---

### 11.10 Agent 9 Repair Architecture Removal

This section specifies exactly which repair passes are removed from `agent9-run.ts` and what replaces them. The World-First architecture prevents these failures at source rather than detecting and repairing them after the fact.

#### Functions to remove entirely

| Function / constant | Location (approx. line) | Replacement |
|--------------------|-----------------------|------------|
| `evaluateTemplateLeakage()` | ~line 579 | None needed — the enhanced outline's per-scene emotional registers prevent template convergence structurally |
| `evaluateSensoryVariety()` | ~line 607 | None needed — per-location emotional registers in World Document anchor sensory variety by design |
| `evaluateTemporalConsistency()` | ~line 657 | None needed — World Document §1 settles season/month definitively; contradiction is now a generation failure addressed by chapter regeneration trigger, not a post-hoc scan |
| `detectIdentityAliasBreaks()` | ~line 352 | None needed — Clue Obligation Statement for reveal and post-reveal chapters specifies reference convention at generation time |
| `templateLeakageScaffoldPattern` const | ~line 242 | None needed — remove `evaluateTemplateLeakage` above |
| `placeholderRoleSurnamePattern` const | ~line 703 | Partially retained — see placeholder handling below |
| `placeholderNamedStandalonePattern` const | ~line 704 | Retained for per-chapter check |
| `placeholderGenericRolePattern` const | ~line 705 | Retained for per-chapter check |
| `evaluatePlaceholderLeakage()` full function | ~line 706 | Retained but transformed — see below |
| `IdentityAliasIssue` type | ~line 41 | Remove with `detectIdentityAliasBreaks` |

#### Schema validation repair pass — transform

**Current behaviour:** If prose schema validation fails on first attempt, a full second `generateProse()` call is triggered. `proseRepairPassCount += 1`.

**New behaviour:** One retry is still allowed. The retry call includes the same schema repair guardrails as today. If the second attempt also fails schema validation, **abort with a clear error** — do not attempt a third pass.

```typescript
// Existing retry logic: keep as-is
// New: after retriedProse validation:
if (!retryValidation.valid) {
  throw new Error(
    `Agent 9 schema validation failed after retry. Failures: ${retryValidation.errors.slice(0, 5).join('; ')}`
  );
  // Do NOT trigger another repair pass.
}
```

#### Full story validation repair pass — transform to release gate

**Current behaviour:** If the story validation pipeline returns `status !== 'passed'`, a full second `generateProse()` call is triggered with targeted guardrails (`repairGuardrails`). `proseRepairPassCount += 1`.

**New behaviour:** The story validation pipeline still runs and still produces its full report. But the repair pass is **removed**. If validation fails:
- All validation errors are surfaced in `ctx.errors` and `ctx.warnings` as before
- `ctx.latestValidationReport = validationReport` is set
- The pipeline **throws** with a clear structured error message identifying which checks failed and which chapters are implicated
- No `generateProse()` repair call is made

```typescript
// Replace the repair pass block with:
if (validationReport.status !== 'passed' && validationReport.status !== 'needs_review') {
  const criticalErrors = validationReport.errors
    .filter((e: any) => e.severity === 'critical')
    .map((e: any) => `[${e.type}] ${e.message}`)
    .slice(0, 10);
  throw new Error(
    `Story validation failed. Critical failures:\n${criticalErrors.join('\n')}\n` +
    `If the World Document and enhanced outline are correct, investigate why these ` +
    `obligations were not met in generation rather than running a repair pass.`
  );
}
// needs_review: surface as warnings, do not abort
```

**Why this is safe:** The World-First architecture prevents the failures that the repair pass was designed to fix (template convergence, season contradiction, character voice drift). If validation is still failing in the new architecture, the root cause is in the World Document or outline — repairing the prose output will mask the real failure.

#### Placeholder leakage — transform from silent repair to explicit regeneration trigger

**Current behaviour:** `evaluatePlaceholderLeakage()` detects phantom names / generic role constructions in the full prose output and adds the detection to repair guardrails for the repair pass.

**New behaviour:** Check each chapter's text immediately after it is accepted (in the chapter generation loop, before updating NarrativeState). If a chapter contains `placeholderRoleSurnamePattern` or `placeholderNamedStandalonePattern` matches:
- Reject that chapter immediately (do not add it to the accepted batch)
- Regenerate the chapter with the cast list explicitly prepended to the scene brief
- If the regeneration also has placeholder leakage, abort with a clear chapter-level error

```typescript
// Add immediately after chapter acceptance, before NarrativeState update:
const placeholderCheck = checkChapterForPlaceholders(chapterText, castMemberNames);
if (placeholderCheck.hasPlaceholders) {
  if (attempt < 1) {
    // Regenerate this chapter with explicit cast list
    return regenerateWithCastList(chapterInput, placeholderCheck.examples);
  }
  throw new AgentError(
    'agent9_prose',
    `Chapter "${chapterTitle}" contains phantom names after retry: ${placeholderCheck.examples.join(', ')}`
  );
}
```

`checkChapterForPlaceholders()` uses `placeholderRoleSurnamePattern` and `placeholderNamedStandalonePattern` — these two constants are retained. `placeholderGenericRolePattern` (which detected generic role use) is removed, as `"a gentleman"` etc. is acceptable prose.

---

### 11.11 `buildWorldBriefBlock` Implementation Spec

This function is added to `packages/prompts-llm/src/agent9-prose.ts`. It replaces three existing high-priority context blocks with a single `world_brief` block when `inputs.worldDocument` is present.

#### Function signature

```typescript
function buildWorldBriefBlock(
  world: WorldDocumentResult,
  scene: NarrativeOutlineScene,          // the current scene's outline entry
  castInScene: string[],                 // character names present in this scene
  sceneIndex: number,                    // 0-based position in full chapter sequence
  totalScenes: number,                   // total chapter count
  isRevealScene: boolean,               // true if Act III and in final third of scene count
): string
```

#### Content and format

The function returns a single formatted string block. The block is structured as follows:

**Block header:**
```
=== WORLD BRIEF ===
This document is your complete creative context. Trust it. Do not add information not present here.
```

**Subsection 1 — Historical Moment:**
```
ERA: {world.historicalMoment.specificDate}
{world.historicalMoment.eraRegister}

Physical constraints for this story:
{world.historicalMoment.physicalConstraints.map(c => `- ${c}`).join('\n')}
```
If `world.historicalMoment.wartimeServiceContext` is present, append:
```
Wartime service context: {wartimeServiceContext.serviceStatus}
Social note: {wartimeServiceContext.socialTexture}
```

**Subsection 2 — Characters in this scene** (only characters from `castInScene`):
```
CHARACTERS IN THIS SCENE:
```
For each character name in `castInScene`, find their entry in `world.characterVoiceSketches`:
```
{name}: {voiceDescription}
  Voice when comfortable: "{comfortable_fragment_text}"
  Voice when evasive: "{evasive_fragment_text}"
  {if humourNote present}: Humour: {humourNote}
```
If a character in `castInScene` has no voice sketch entry, skip them without error.

**Subsection 3 — Location:**
Find the location register whose `locationId` matches `scene.setting.location` (case-insensitive partial match acceptable). If found:
```
LOCATION — {locationRegister.name}:
{locationRegister.emotionalRegister}
Approach: {locationRegister.cameraAngle}
{if eraNote present}: Era note: {locationRegister.eraNote}
```
If not found: omit this subsection.

**Subsection 4 — Emotional register and humour guidance:**
```
SCENE REGISTER: {scene.emotionalRegister ?? 'No specific register — use story dominant register'}
SUBTEXT: {scene.subtextNote ?? ''}
```
If `scene.humourGuidance` is present:
```
HUMOUR: {humourGuidance.permission}
{if permitted}:  Permitted characters: {permittedCharacters.join(', ')}
                  Form: {permittedForms.join(' or ')}
{if conditional}: Condition: {humourGuidance.condition}
{if forbidden}:   No humour in this scene.
```

**Subsection 5 — Break moment** (conditional):
If `world.breakMoment.character` is in `castInScene` AND `world.breakMoment.scenePosition` matches the humour map scene type for this scene position:
```
BREAK MOMENT: {breakMoment.character} breaks in this scene.
Form: {breakMoment.form}
Why it matters: {breakMoment.narrativeFunction}
```

**Subsection 6 — Reveal implications** (conditional: `isRevealScene === true`):
```
REVEAL IMPLICATIONS:
{world.revealImplications}
Plant the texture that will recolour these moments. The reader will remember them.
```

**Block footer:**
```
=== END WORLD BRIEF ===
```

#### Priority and token budget

The `world_brief` block is assigned priority `'critical'` in the prompt assembly budget — the same tier as `clue_obligations` and `locked_facts`.

Estimated token cost: 350–600 tokens per chapter call (varies by cast size and whether break moment / reveal implications are included). This replaces three blocks previously at `'high'` priority: character personality/profiles, era authenticity, and location profiles. Net prompt length is neutral to slightly shorter.

#### Fallback when `worldDocument` is absent

When `inputs.worldDocument` is `undefined`, `buildWorldBriefBlock` is not called. All existing context blocks remain at their current priorities. The system is fully backwards-compatible.

---

### 11.12 Configuration Entries

Two config files require entries for Agent 6.5.

#### `apps/worker/config/retry-limits.yaml`

Add after the `agent7_narrative` entry:

```yaml
agent65_world_builder:
  max_retries: 1
  backoff_seconds: 5
  # One retry only. Second failure aborts with full validation report.
  # World Builder failures are structural (bad inputs or bad prompt) — retrying
  # more than once will produce the same failure. Fix the inputs instead.
```

#### `apps/worker/config/generation-params.yaml`

Add a new agent section:

```yaml
agent65_world_builder:
  temperature: 0.7
  max_tokens: 3000
  # 3000 tokens produces ~1,800–2,200 words of output, sufficient for all 6 sections
  # plus storyTheme, breakMoment, revealImplications, and validationConfirmations.
  # Temperature 0.7 balances creative richness (voice sketches, emotional arc) with
  # factual accuracy (locked facts, no new character facts).
  # Uses the prose deployment (AZURE_OPENAI_DEPLOYMENT_NAME_PROSE):
  # World Builder needs the same model quality as Agent 9 — it is producing
  # creative synthesis, not structured JSON extraction.
  deployment: prose
```

---

## 8. Document Status (updated)

| Component | Status |
|-----------|--------|
| World Builder (Agent 6.5): functional spec | **Fully specified** — Section 9.3 |
| World Builder (Agent 6.5): prompt spec | **Fully specified** — Section 11.8 |
| World Builder (Agent 6.5): TypeScript types | **Fully specified** — Section 11.3 (`world-document.ts` interfaces) |
| World Builder (Agent 6.5): implementation | **Fully specified** — Sections 11.3, 11.8 |
| World Builder (Agent 6.5): scorer | **Fully specified** — Section 11.3 (rubric table) |
| Enhanced Agent 7 (consumes World Doc) | **Fully specified** — Sections 9.4, 11.2 |
| Rebuilt Agent 9: functional spec | **Fully specified** — Section 9.5 |
| Rebuilt Agent 9: prompt changes | **Fully specified** — Section 11.11 (`buildWorldBriefBlock`) |
| Rebuilt Agent 9: repair removal | **Fully specified** — Section 11.10 |
| Validation of World Document: functional | **Fully specified** — Sections 9.3, 9.6 |
| Validation of World Document: code | **Fully specified** — Section 11.3 (retry/validation logic) |
| Era lived-context prompt design | **Fully specified** — Section 11.8.2 (era reasoning rules + WWII classification table) |
| Character voice sketch generation | **Fully specified** — Section 11.8.2 (voice sketch rules + fragment requirements) |
| Humour placement map generation | **Fully specified** — Section 11.8.2 (12-position map + placement rules) |
| NarrativeState simplification | **Fully specified** — Section 11.9 |
| Pipeline orchestration changes | **Fully specified** — Sections 11.1, 11.2 |
| `schema/world_document.schema.yaml` | **Implemented** — file exists at `schema/world_document.schema.yaml` (403 lines) |
| `schema/narrative_outline.schema.yaml` additions | **Implemented** — all 6 World-First scene fields present |
| `schema/cml_2_0.schema.yaml` additions | **Implemented** — `specific_year`/`specific_month`/`wartime`/`era_atmosphere` and `WORLD_DOCUMENT` ref present |
| Configuration entries (Agent 6.5) | **Fully specified** — Section 11.12 |

**All implementation items complete as of 2026-03-28:**

| Component | Status |
|-----------|--------|
| `packages/prompts-llm/src/types/world-document.ts` | **Implemented** |
| `packages/prompts-llm/src/agent65-world-builder.ts` | **Implemented** |
| `apps/worker/src/jobs/agents/agent65-run.ts` | **Implemented** |
| `packages/story-validation/src/scoring/phase-scorers/agent65-world-builder-scorer.ts` | **Implemented** |
| `apps/worker/src/jobs/agents/shared.ts` — `worldDocument` field | **Implemented** |
| `apps/worker/src/jobs/mystery-orchestrator.ts` — pipeline resequencing + gate helpers | **Implemented** |
| `apps/worker/src/jobs/agents/agent7-run.ts` — World enrichment pass | **Implemented** — `applyWorldFirstSceneEnrichment()` + `toArcPosition()` + `toSceneType()` added; called before `ctx.narrative` is set when `ctx.worldDocument` is present |
| `apps/worker/src/jobs/agents/agent9-run.ts` — `worldDocument` pass-through | **Implemented** — `worldDocument: ctx.worldDocument` added to both `generateProse()` call sites (first-pass and schema-repair retry) |
| `apps/worker/src/jobs/agents/agent9-run.ts` — repair architecture removal | **Implemented** — `evaluateTemplateLeakage`, `evaluateSensoryVariety`, `evaluateTemporalConsistency`, `detectIdentityAliasBreaks`, and the full-story validation repair pass are removed; story validation failure now throws directly |
| `packages/prompts-llm/src/agent9-prose.ts` — `buildWorldBriefBlock` + victim role fix | **Implemented** |
| `packages/prompts-llm/src/types/narrative-state.ts` — `continuityTail` simplification | **Implemented** |
| `apps/worker/config/retry-limits.yaml` — `agent65_world_builder` entry | **Implemented** |
| `apps/worker/config/generation-params.yaml` — `agent65_world_builder` entry | **Implemented** |

**Current status:** Full functional and technical specification complete. All implementation items complete. No outstanding work remains for the World First architecture rebuild.

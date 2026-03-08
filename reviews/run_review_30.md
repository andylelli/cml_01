# Run Review: project_30 "The Timed Deceit"

**Run ID:** run_a999b9a4-db22-4d4e-8747-d5b97818d60f  
**Date:** 2026-03-07  
**Project:** project_30  
**Story file:** stories/project_30.txt  
**Quality report:** validation/quality-report-run_a999b9a4-db22-4d4e-8747-d5b97818d60f.json  
**Reviewer:** Copilot session review  
**Overall assessment:** `PASS` (98.15 / A — but with prose-level defects that require strategic remediation)

---

## Phase scores summary

| Phase | Agent | Score | Grade |
|---|---|---|---|
| Setting Refinement | agent1_setting | 100 | A |
| Cast Design | agent2_cast | 98 | A |
| Background Context | agent2e_background_context | 98 | A |
| Hard Logic Devices | agent3b_hard_logic_devices | 96 | A |
| CML Generation | agent3_cml | 100 | A |
| Novelty Audit | agent8_novelty | 100 | A |
| Clue Distribution | agent5_clues | 100 | A |
| Fair-play Audit | agent6_fairplay | 100 | A |
| Narrative Outline | agent7_narrative | 97 | A |
| Character Profiles | agent2b_profiles | 100 | A |
| Location Profiles | agent2c_location_profiles | 100 | A |
| Temporal Context | agent2d_temporal_context | 91 | A |
| Prose Generation | agent9_prose | 96 | A |

**Prose sub-scores:** validation 94.5 / quality 100 / completeness 100 / consistency **78.1**  
The consistency score is the signal — pronoun drift and factual contradictions are the source of that drop.

---

## Observed defects

### [S0 Critical] Raw location context template injected verbatim into prose
**Evidence:** "Initial Interviews" chapter opens with unprocessed location scaffold data:
> "At The Drawing Room in Haworth, England, the smell of The air is infused with the scent of freshly brewed tea, mingling with the floral notes of the garden that waft in through the open windows, creating a deceptive sense of calm. A faint trace of polish from the furniture adds a layer of warmth, yet it struggles to mask the underlying tension that lingers in the air mixed with Laughter often rings through the drawing room..."

Identifiers: capital "L" mid-sentence on "Laughter", dangling "and" joining a new clause, double period at end, active/passive tense oscillation, "At The Drawing Room in Haworth" header format. This is `location_profiles` or `setting_refinement` raw context data transcribed verbatim by the prose agent rather than absorbed and rewritten.  
**Impact:** Chapter is partially corrupted with unreadable synthetic artifact. Visible generation failure; reader immersion destroyed.  
**Root-cause hypothesis:** The prose agent received location data in its context without a clear "do not transcribe — reference only" instruction. At a chapter boundary the agent appears to have fulfilled a "describe the setting" instruction by copying the nearest available setting block rather than generating fresh prose. The "Initial Interviews" chapter opens with a location switch (Drawing Room, then back to Library) which may have triggered a context re-injection at that boundary.

---

### [S1 High] Pronoun instability across characters (consistency score: 78.1)
**Evidence:** All three living characters alternate between gendered and gender-neutral pronouns with no pattern or in-universe logic:

| Character | Early chapters | Later chapters |
|---|---|---|
| Reginald Sudbury | he/his (ch.1–2, Alibi Check) | they/their (Gathering Suspicions, Initial Interviews) |
| Katherine Turnbull | she/her (ch.1–4) | they/their (Gathering Suspicions, Katherine's Alibi) |
| Caroline Somerby | she/her (ch.1–5) | they/their (Gathering Suspicions onwards) |

Note: Caroline is the POV detective — the pronoun shift here is especially disorienting.  
**Impact:** Reader trust and character continuity degraded. Inconsistent pronoun use signals broken cross-chapter state rather than intentional non-binary characterisation.  
**Root-cause hypothesis:** Pronouns are not explicitly defined in character profiles or in the context passed to each prose chapter call. Each chapter generation is independent; the LLM defaulted to `they/them` for some calls (perhaps reflecting a different temperature draw or system prompt variant). There is no pronoun ledger persisted between chapters.

---

### [S2 Medium] Factual contradictions in the clock timeline
**Evidence:** Specific clock state varies across chapters with no in-story explanation:

| Chapter | Clock fact stated |
|---|---|
| Discovery | Clock frozen at **half past eight** |
| Gordon's Watch | Watch stopped at **8:55 pm** (five to nine) |
| Initial Interviews | Clock face frozen at **four** |
| The Discriminating Test | Chime delayed by "nearly **fifteen minutes**"; strikes **midnight** |
| The Culprit Revealed | Mechanism "forced backward **twenty minutes**" |

The clock is the central physical clue. Its face-value time and the degree of tampering must be consistent.  
**Impact:** A close reader will notice contradictions; a puzzle-minded reader will find the mystery unsolvable because the physical evidence keeps changing.  
**Root-cause hypothesis:** Each chapter generates the clock's specific state independently. There is no "established facts" ledger carried from chapter to chapter. The prose agent correctly understands the clock was tampered with but invents a new specific value each time.

---

### [S2 Medium] Repetitive chapter opening descriptions (14 of 17 chapters)
**Evidence:** The following phrases recur near-verbatim across chapters in the same location (library):
- "The library of Hawthorn Manor lay steeped in [adjective] light"
- "Dust motes drifted lazily in the [still/dim] air"
- "The scent of aged paper and leather [hung/mingled]"
- "The faint ticking of the [tarnished/mantel] clock"
- "October [rain/clouds/morning]"

Prose sub-score `All chapters present: 85` (17/12) and `Setting fidelity: 67` suggest the prose agent defaulted to known patterns under pressure of generating additional chapters.  
**Impact:** Atmosphere becomes wallpaper by chapter four. Repetition signals synthetic generation.  
**Root-cause hypothesis:** The prose agent receives location profiles fresh for each chapter. Without a "descriptions already used" state, it repeatedly draws from the same sensory palette. Anti-repetition prompt instructions help at the local level but do not solve the structural problem of stateless chapter generation.

---

### [S3 Low] Mantel/mantle spelling inconsistency
**Evidence:** Both spellings appear across chapters. "Mantel" (architectural shelf above fireplace) is correct; "mantle" (a cloak) appears in several chapter instances.  
**Impact:** Minor polish defect; visible to attentive readers.  
**Root-cause hypothesis:** No spell-normalisation pass; LLM freely chooses between spellings.

---

### [S3 Low] Chapter count overrun — 17 generated vs 12 target
**Evidence:** Quality report narrative score docked for chapter count (75 score; "17 chapters (expected 12)"). "Clearing Reginald" and "Clearing Katherine" substantially repeat content from "Alibi Check" and "Piecing It Together."  
**Impact:** Structural redundancy; story feels padded in its third act.  
**Root-cause hypothesis:** Narrative outline agent or orchestrator did not enforce chapter count ceiling; extra chapters generated to "complete" clearing beats that were already implicit.

---

### [S3 Low] Fair-play clue visibility partially off-page
**Evidence:** Quality report: `Fair play compliance: 60 / 100`. Specific physical evidence (dust smear pattern on clock glass, winding key residue) is mentioned but the inference step sometimes occurs off-page — Caroline knows before the reader sees how she knows.  
**Impact:** Reader cannot independently solve the mystery at those steps.  
**Root-cause hypothesis:** Per-chapter generation cannot enforce "show the clue to the reader before the detective uses it" sequencing without cross-chapter state.

---

## Phased remediation plan (current run)

### P0 Containment (same day)
- **Action:** Flag this run as `PASS-WITH-WARNINGS`. No PDF release until location context injection is confirmed absent in final export.
- **Owner area:** Export pipeline
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** PDF export reviewed; garbled "Initial Interviews" opening either corrected or run withheld from release.

### P1 Structural fixes (1–3 days)
- **Action:** Explicit pronoun field in character profiles; pronoun ledger injected into each prose chapter call.
- **Owner area:** `schema/character_profiles.schema.yaml` + `packages/prompts-llm` (prose agent)
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** Character pronouns are stable across all chapters in next run.

- **Action:** Narrative facts state object (see Strategic Analysis below) carrying established clock/timing facts from chapter to chapter.
- **Owner area:** `apps/worker` orchestrator + `packages/prompts-llm`
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** Clock time and tampering degree consistent across all chapters in next run.

### P2 Hardening and regression (3–7 days)
- **Action:** Full strategic implementation per Part II below.
- **Owner area:** Multiple — see Strategic Analysis.
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** 2 consecutive clean runs with consistency score ≥ 90; no location context leakage; pronoun stability; factual consistency in all physical clues.

---

## Validation and verification
- **Required tests:** Cross-chapter pronoun consistency validator; physical clue consistency validator; location context leakage detector (regex on "At The [Location] in [City], England")
- **Required full-run checks:** 1 medium run (10–12 chapters) + 1 long run (15+ chapters)
- **Export checks:** PDF export free of raw context artifacts; no white-on-white text rendering issues
- **Gate outcome:** Pending P1/P2 implementation

---

## Definition of done
- [ ] No raw context data appearing verbatim in prose output
- [ ] Pronoun consistency per character (100% stable across all chapters)
- [ ] Physical clue facts (times, specific evidence) consistent across all chapters
- [ ] Sensory palette varied (no repeated opening phrase in >40% of chapters)
- [ ] Chapter count within ±2 of CML target
- [ ] Fair-play compliance ≥ 70/100
- [ ] Prose consistency sub-score ≥ 90
- [ ] Regression tests added for all defect classes identified here

---

## Soul audit (per "What Makes a Good Whodunnit" criteria)

**1. The Murder Must Mean Something:** ✅ PASS  
Gordon Woodbridge is named, present in the opening scene, and has established relationships. His death has weight.

**2. Give Every Suspect a Wound:** ⚠️ PARTIAL PASS  
Ethel's wound (unseen loyalty, resentment of invisibility) is rich. Reginald's embezzlement guilt adds depth. Katherine is thinner — her cynicism is surface-level.

**3. The Detective Needs a Personal Stake:** ⚠️ PARTIAL PASS  
Caroline's stake is professional and ethical rather than personal. She is effective but not haunted.

**4. Add Moments That Don't Advance the Plot:** ✅ PASS  
Several pauses exist — Caroline touching the clock, reflecting in the window, the photograph on the mantel.

**5. Let Emotion Leak Into Dialogue:** ✅ PASS  
Ethel's fabric-twisting, Katherine's dropped cigarette, Reginald's cufflink-adjusting — good physical tells.

**6. Raise Moral Complexity:** ✅ PASS  
Ethel's motive (mercy killing / protecting Reginald) creates genuine moral ambiguity. "It was not malice, but despair."

**7. Add Sensory Atmosphere:** ⚠️ PARTIAL PASS  
Strong early chapters; becomes repetitive through the middle act.

**8. Let Someone Break:** ✅ PASS  
Ethel's midnight confession under clock chime is the story's best scene.

**9. Make the Reveal Hurt:** ✅ PASS  
"I only ask that you tell them he wasn't a bad man — only frightened." Genuinely affecting.

**Soul audit result: 6 pass / 3 partial / 0 fail** — Significant improvement over prior runs.

---

---

# Part II — Strategic Analysis: Preventing Recurring Prose Quality Failures

## Framing

The defects in project_30 are not unique to this story. They represent three structural failure classes that have appeared (in different forms) across multiple runs:

| Failure class | project_30 instance | Prior run instances |
|---|---|---|
| **Context leakage** | Raw location data transcribed into prose | "At The Drawing Room" scaffold blocks in projects 24, proj_344e |
| **Stateless chapter generation** | Pronoun drift, clock contradiction | Character name drift (proj_acf895e1), timeline contradicts (project_20) |
| **Palette exhaustion / repetition** | 14/17 chapters open identically | Scaffold repetition across all prior reviewed runs |

Tactical fixes (patch the prompt, add a validator rule, tweak the anti-duplication threshold) have been applied and have reduced severity. But the same failure classes keep appearing in new forms. This is the signal that the architecture itself needs to change.

---

## Root cause: stateless chapter generation

The core structural problem is that **each prose chapter is generated as an independent LLM call** with only static context: the CML, the character profiles, the chapter outline, and the location profiles. Nothing carries forward from prior chapters about what has already been written.

This means:
- Each call re-invents specific facts (the clock showed X, the meeting was at Y time)
- Each call draws from the same context palettes (aged leather, October rain, faint ticking)
- Each call picks its own pronoun convention because none was declared
- Raw context data can be transcribed if the "describe the setting" instruction fires against context rather than imagination

The strategic fix is to add a **persistent cross-chapter narrative state** to the generation pipeline.

---

## Strategic Option A: Extended CML

### What CML currently carries
The CML is rich in structural facts: characters, motives, alibis, timeline, clue distribution. It does not carry:
- Pronoun declarations per character
- Specific physical evidence values (what exact time the clock showed, what the watch actually read)
- Sensory palette variants (which descriptions are "reserved" for variety)
- Established micro-facts locked down before prose generation begins

### Proposed CML extensions

#### A1. Character pronoun field
Add `pronouns: subject/object/possessive` to each character entry in the CML and in `character_profiles.schema.yaml`. This is a one-line addition to the schema but eliminates pronoun drift entirely.

```yaml
# In CML character block
- name: Reginald Sudbury
  pronouns: he/him/his
  role_archetype: Red Herring Suspect
  ...
```

The pronouns field should be:
- Generated by agent2_cast (it knows the characters)
- Validated by a schema rule (must be `he/him/his`, `she/her/hers`, `they/them/their`, or `it/it/its`)
- Injected into every prose agent call, not just the first chapter

**Impact:** Eliminates pronoun drift across all future stories at negligible cost.

#### A2. Physical evidence lock register
Add a `locked_facts` section to the CML, populated by agent3b (Hard Logic Devices) and any agent that establishes a physical clue value. These facts are then **read-only truth** for all prose agent calls.

```yaml
locked_facts:
  - id: clock_face_time
    value: "ten minutes past eleven"
    established_by: hard_logic_devices
    appears_in_chapters: [discovery, clock_tampering, culprit_revealed]
  - id: clock_tampering_delta
    value: "forty minutes"
    established_by: hard_logic_devices
  - id: watch_stopped_at
    value: "eight fifty-five"
    established_by: hard_logic_devices
```

The prose agent is explicitly told: "Do not invent values for locked facts. Use the values in `locked_facts` exactly as written."

**Impact:** Eliminates factual contradictions in physical clues. The clock will show the same time in every chapter because the time was fixed before prose generation began.

#### A3. Sensory palette register
Add a `sensory_palettes` section to location profiles, with 4–6 distinct variants per major location. Agent2c generates the variants; the prose orchestrator rotates through them by chapter index.

```yaml
sensory_palettes:
  library:
    - id: palette_morning_rain
      atmosphere: "pale morning light struggles through heavy drapes; dust motes catch the grey glow"
      scent: "cold ash and damp paper"
      sound: "rain against panes; the clock's phantom tick"
    - id: palette_late_afternoon
      atmosphere: "tarnished October sun elongates shadow across the shelves"
      scent: "leather and cigar smoke, long extinguished"
      sound: "wind in the chimney; a distant village bell"
    ...
```

The prose agent is told which palette to use by chapter index. It may elaborate but must use the palette as its anchor rather than inventing fresh from scratch each time.

**Impact:** Eliminates repetitive openings. Variety is structural, not prompt-level.

---

## Strategic Option B: Chapter-to-Chapter Narrative State Object

This is the most impactful single architectural change. Introduce a **Narrative State Document** (NSD) — a structured JSON/YAML object that is:
1. Initialised before chapter one with locked facts from CML
2. Updated after each chapter is generated
3. Passed to the next chapter's prose agent call as explicit context

### NSD schema (proposed)

```yaml
narrative_state:
  version: 1
  chapter_index: 5
  
  # Facts established in prose — locked for remaining chapters
  established_facts:
    - id: clock_shown_time
      value: "ten past eleven"
      chapter_first_stated: 1
    - id: watch_shown_time  
      value: "eight fifty-five"
      chapter_first_stated: 5
    - id: clock_tampering_method
      value: "hands wound back forty minutes"
      chapter_first_stated: 3
  
  # Character state per chapter
  character_states:
    - name: Ethel Colton
      pronouns: she/her/hers
      emotional_state: "defensive; guilt surfacing"
      knowledge_revealed_to_caroline: ["found the body", "wound the clock"]
      knowledge_still_concealed: ["was in the corridor at time of death", "adjusted the hands"]
      last_seen_chapter: 4
    - name: Reginald Sudbury
      pronouns: he/him/his
      emotional_state: "wary; protecting financial secret"
      ...
  
  # Sensory descriptions already used (for anti-repetition)
  used_sensory:
    - chapter: 1
      palette_id: palette_morning_rain
      opening_phrase: "The morning light filtered weakly through the heavy drapes"
    - chapter: 2
      palette_id: palette_late_october_grey
      opening_phrase: "The library lay steeped in a dim, uncertain light"
    ...
  
  # Clues revealed to reader so far
  clues_revealed:
    - id: stopped_clock
      chapter_revealed: 1
      summary: "clock frozen at ten past eleven; glass cracked, pendulum still"
    - id: clock_scratches
      chapter_revealed: 3
      summary: "fresh scratches on brass latch; faint groove near hinge"
  
  # Chapter opening style registry (to enforce variety)
  opening_styles_used:
    - chapter: 1
      style: "weather-light filtering in"
    - chapter: 2
      style: "character entering the room"
```

### How the NSD is used

**Before each prose chapter call:**
1. Orchestrator injects the current NSD into the prose agent's system context
2. Agent is instructed: "Do not contradict established_facts. Use character pronouns exactly as declared. Do not use an opening style already listed in opening_styles_used. Do not describe a setting using any phrase from used_sensory."
3. Agent generates the chapter

**After each prose chapter call:**
1. A lightweight extraction pass (could be a small LLM call or regex) updates the NSD:
   - Adds any new facts stated in the chapter to `established_facts`
   - Updates `character_states` (emotional state, knowledge revealed)
   - Logs the opening phrase and palette used
   - Logs any new clues revealed

This extraction pass does not need to be precise — it is a best-effort accumulator. The hard facts (clock time, watch time) were already locked in from the CML; the NSD merely tracks them as confirmed-used.

### What the NSD solves

| Defect class | How NSD solves it |
|---|---|
| Pronoun drift | Pronouns declared once in NSD, injected every chapter |
| Physical fact contradictions | `established_facts` block locks values on first use |
| Repetitive openings | `opening_styles_used` and `used_sensory` prevent reuse |
| Context leakage | NSD provides a "what you need to know" summary, reducing pressure on the prose agent to transcribe raw context |
| Knowledge continuity ("what does each character know?") | `character_states.knowledge_revealed` tracks the detective's accumulation of evidence |

### What the NSD does NOT solve (and requires complementary fixes)

| Problem | Complementary fix |
|---|---|
| Raw context data injected verbatim | Input pipeline hygiene (Option C1 below) |
| Chapter count overrun | Hard cap in orchestrator |
| Fair-play clue sequencing | CML `locked_facts` with chapter assignments |

---

## Strategic Option C: Input Pipeline Hygiene

### C1. Context formatting discipline

The location context injection failure (raw location data appearing in prose) is an input hygiene problem. The prose agent received unformatted location profile data in its context. When it hit a "describe the setting" instruction, it found the nearest available text block and transcribed it.

**Fix:** All context injected into the prose agent must be formatted as one of:
- **Locked fact:** "The library clock stopped at ten past eleven. Do not change this value."
- **Reference background (do not transcribe):** "BACKGROUND ONLY — DO NOT USE VERBATIM: [location data]"
- **Permitted prose seed:** "You may use this as inspiration but must rewrite substantially: [...]"

Raw location profile objects should never enter the prose agent's context directly. They must be mediated by a formatting wrapper that marks them as reference-only.

**Implementation:** A `formatContextForProse()` utility in `apps/worker` that wraps all context blocks with appropriate instruction tags before injecting them into the prose system prompt.

### C2. Context injection validator

Before each prose chapter call, a pre-flight check should scan the assembled system prompt for:
- Patterns matching raw location schema formats: `"At The [A-Z].*in.*England"`, `"the smell of"` followed by location-schema-style enumeration
- Patterns matching character profile field names appearing verbatim in prose context: `"role_archetype:"`, `"private_secret:"` etc.

If any are detected, the orchestrator should reject the context assembly and log a `CONTEXT_INJECTION_VIOLATION` error rather than proceeding.

---

## Strategic Option D: Cross-Chapter Consistency Validator (post-generation)

In addition to preventing problems, a post-generation consistency check should verify the complete prose output before release gate sign-off.

### D1. Pronoun consistency checker
- Parses all chapters for gendered/neutral pronouns associated with each named character
- Flags any character whose pronoun varies across chapters
- Severity: S1 if detective or culprit affected; S2 otherwise

### D2. Physical clue consistency checker
- Extracts all time references associated with the central evidence object (clock, watch etc.)
- Flags contradictions: same object, different values stated
- Can be seeded with `locked_facts` from the CML as ground truth

### D3. Opening paragraph diversity checker
- Already partially implemented (`evaluateSensoryVariety()`)
- Extend to check chapter opening *style* (not just vocabulary): weather-entry, character-entry, interior-description, action-opening etc.
- Flag if >50% of chapters share the same opening style class

### D4. Context leakage detector
- Scan prose output for known context template signatures
- Flags: `"At The [Location] in"`, `"the smell of"` followed by list enumeration, any line with `mixed with` connecting unrelated clauses (a scanner pattern for the specific mangled grammar of raw location template transcription)

---

## Integrated recommendation: what to build next

Ranked by impact-to-effort ratio:

| Priority | Change | Impact | Effort | Owner area |
|---|---|---|---|---|
| 1 | **Character pronoun field in CML + schema** | Eliminates pronoun drift permanently | Low | schema + agent2_cast prompt |
| 2 | **Physical clue locked_facts in CML** | Eliminates timeline/value contradictions | Low-Medium | schema + agent3b prompt |
| 3 | **Context injection hygiene wrapper** | Eliminates template leakage class | Medium | apps/worker context assembly |
| 4 | **Narrative State Document (NSD) — v1** | Addresses opening repetition, knowledge continuity | High | apps/worker orchestrator |
| 5 | **Sensory palette register in location profiles** | Eliminates repetitive atmospheric openings | Medium | schema + agent2c prompt |
| 6 | **Cross-chapter consistency validators** | Catches residual issues post-generation | Medium | packages/story-validation |
| 7 | **NSD knowledge state tracking** | Enables detective knowledge arc validation | High | apps/worker + prose prompt |

### Recommended build sequence

**Sprint 1 (quick wins — 1 day):**  
Character pronouns in schema + CML + prose injection. Context injection hygiene wrapper. Physical `locked_facts` section in CML.

**Sprint 2 (NSD v1 — 3 days):**  
Implement NSD as a flat JSON object. Populate from CML `locked_facts` before chapter 1. Inject as read-only block into prose calls. After each chapter, run extraction pass to log opening style and add any new facts. Wire into orchestrator.

**Sprint 3 (palette register + validators — 3 days):**  
Sensory palette variants in location profile schema + agent2c generation. Orchestrator rotation. Post-generation consistency validators D1–D4.

---

## Notes on scope discipline

These are **structural changes, not prompt patches**. The distinction matters:
- A prompt patch says "don't repeat the opening phrase you just used." It works once, locally.
- A structural change says "here is a register of all opening phrases used so far in this story; here are the palette variants available; here are the character pronouns; here are the locked physical facts." It works across all stories, for all time.

The goal of all changes above is that **no future prose generation call needs to invent anything that was already decided**. Character identity, physical evidence values, and sensory variety are all pre-decided and handed to the prose agent as constraints, not left to stochastic generation to hopefully reproduce consistently.

---

## Cross-reference to prior remediation history

| This run's defect | Closest prior defect | Prior fix applied | Why it recurred |
|---|---|---|---|
| Location context transcribed verbatim | project_24/proj_344e scaffold blocks | Anti-duplication validator + threshold tightening | This is a different failure mode — not duplication of generated text, but transcription of raw context. The validator catches repetition within prose, not context→prose leakage. |
| Pronoun drift | Character name drift (proj_acf895e1) | Entity binding fix for names | Names were fixed; pronouns were not added to the entity binding system. |
| Clock contradiction | Timeline contradiction (project_20) | Temporal contradiction validator at chapter level | The validator checks month/season contradictions; it does not track specific physical evidence values. |
| Repetitive openings | Scaffold repetition (all prior runs) | Anti-duplication threshold decreased | Improved but not structural; palette exhaustion recurs in a new form (same natural language, not template copy). |

Each prior fix was correct and necessary. The pattern shows that tactical validators address the specific form of the defect seen, but the underlying structural cause (stateless isolated chapter generation receiving shared context) keeps producing new surface forms of the same class of problem.

---

## Status

- Run review: `COMPLETE`
- Strategic analysis: `COMPLETE`
- Implementation planning: `COMPLETE`
- Sprint 1 implementation: `COMPLETE` — gender chain (schema→agent2→agent3→prose), lockedFacts chain (schema→agent3b→orchestrator→prose), context hygiene (stripLocationParagraphs). Zero TS errors across all 9 modified files.
- Sprint 2 (NSD v1): `COMPLETE` — NarrativeState type + utilities (`packages/prompts-llm/src/types/narrative-state.ts`), exported from `@cml/prompts-llm`, wired into `agent9-prose.ts` (buildNSDBlock, system prompt injection) and `mystery-orchestrator.ts` (initNarrativeState before prose, updateNSD in onBatchComplete, narrativeState passed to all 5 prose calls). Zero TS errors.
- Sprint 3 (palette + validators): `COMPLETE` — sensoryVariants schema field, agent2c variant prompt, `selectSensoryPaletteForChapter` helper, chapter palette injection in buildProsePrompt, `ProseConsistencyValidator` (locked-facts + pronoun-drift checks) wired into StoryValidationPipeline, lockedFacts forwarded to both validation calls. Zero TS errors.
- Post-sprint audit gaps: `COMPLETE` — Four gaps identified after plan audit and subsequently fixed:
  - Gap 1: `sensoryVariants` upgraded from `string[]` to full object array (`{id, timeOfDay, weather, sights, sounds, smells, mood}`) across schema, agent2c interface + prompt, `selectSensoryPaletteForChapter` (timeOfDay/weather matching), and agent9-prose palette injection (multi-line Sights/Sounds/Smells display).
  - Gap 2: `checkOpeningStyles()` added to `ProseConsistencyValidator` — classifies opening sentence of each chapter into 7 style buckets, flags any style used in >50% of chapters at `moderate` severity.
  - Gap 3: `checkContextLeakage()` added to `ProseConsistencyValidator` — detects verbatim "At The [Capitalised] in [Capitalised]" template phrases (`major`) and >40-word sentences with room+country+sensory hallmarks (`minor`).
  - Gap 4: `ProseConsistencyReport` interface added to `types.ts`; `consistencyReport?: ProseConsistencyReport` added to `ValidationReport` in `pipeline.ts`; `buildConsistencyReport()` populates it after each pipeline run. Zero TS errors.
- Re-run verification: `PENDING` (all 3 sprints + gap fixes implemented; ready for a generation run)

---

---

# Part III — Reinforced Implementation Plan: Full Dependency Chains & Downstream Checks

## What the code audit revealed

Before writing code, a read-through of the actual sources confirmed several important facts that change the implementation approach:

### Finding 1: The pronoun system is already wired — but broken at the source

`agent9-prose.ts` line 319 already reads `c.gender?.toLowerCase()` to derive pronouns for `characterConsistencyRules`. The logic is correct. The problem is that `CharacterProfile` (the TypeScript interface in `agent2-cast.ts`) has **no `gender` field**. So `c.gender` is always `undefined`, and every character always resolves to `they/them`.

The same break exists in the validator: `character-validator.ts` has `getPronounsForGender()` but calls `if (charState.gender === 'unknown') { return errors; // Skip }` — meaning pronoun validation is silently skipped for every character because gender is never populated.

This is a broken chain, not a missing chain. The fix is to add `gender` at the source (schema → agent2 interface → agent2 prompt → CML schema → agent3 prompt) and the downstream systems already handle it correctly.

### Finding 2: Location context leakage is a stripping omission

`buildProsePrompt` assembles `locationProfilesContext` by picking specific fields from the location profiles object (name, summary, keyLocations purpose, sensoryDetails arrays, atmosphere). It already adds `"⚠️ DO NOT COPY"` warnings. But the raw location profile object passed as `inputs.locationProfiles` is the full `LocationProfilesResult` — including `paragraphs` arrays containing fully-formed narrative prose. When the system prompt is assembled under pressure (more chapters than expected, context window approaching limit), the LLM reaches for the nearest complete prose block and transcribes it. The fix is to strip `paragraphs` from the location object before it enters the prose context.

### Finding 3: No `locked_facts` mechanism exists anywhere

Neither the CML schema, nor the orchestrator, nor any agent currently carries a structured list of "ground truth" physical evidence values. This must be built from scratch but it is a small, well-bounded addition.

### Finding 4: Sensory palette register is partially there

`location_profiles.schema.yaml` has `atmosphere.sensoryPalette` with `dominant` and `secondary` fields — but these are single strings, not variant arrays. The existing palette data is available; it just needs to be extended to multiple alternatives and then rotated by the orchestrator.

---

## Dependency chain maps

Each change below maps the full chain: schema → TypeScript interface → agent prompt → orchestrator → validator. Changes that are **not wired through the full chain risk being silently ignored**.

---

### Chain A: Gender → Pronouns

**Goal:** Every character has a declared gender/pronoun that propagates consistently through all downstream systems.

```
schema/cast_design.schema.yaml          ADD: gender field (string, required: false,
                                              allowed: [male, female, non-binary])
        ↓
schema/cml_2_0.schema.yaml              ADD: gender field to cast[] items
        ↓
packages/prompts-llm/src/agent2-cast.ts ADD: gender to CharacterProfile interface
                                        ADD: instruction in agent2 prompt:
                                             "Include a 'gender' field for each character:
                                              male, female, or non-binary."
        ↓
packages/prompts-llm/src/agent3-cml.ts  VERIFY: CML generation prompt propagates
                                        gender from cast design into CASE.cast[] items.
                                        ADD instruction if missing.
        ↓
packages/prompts-llm/src/agent9-prose.ts  ALREADY READS c.gender (line 319) — no change
                                          needed once gender is populated upstream.
        ↓
packages/story-validation/src/          ALREADY has parseGender() + getPronounsForGender()
character-validator.ts                  + pronoun consistency check. Currently skips when
                                        gender === 'unknown'. Will activate automatically
                                        once gender field is populated.
        ↓
packages/story-validation/src/types.ts  CharacterState.gender already typed as
                                        'male'|'female'|'non-binary'|'unknown' — no change.
```

**Downstream risk:** Agent 2 is an LLM call — adding `gender` to the prompt does not guarantee it will always emit gender. The normalizer/repair pass in agent2 must be checked to ensure it doesn't strip unknown fields. Add a post-processing default: if `gender` is absent after normalisation, set it to `non-binary` (safe neutral fallback) rather than leaving it as `undefined` which causes silent `they/them` collapse.

**Checks after implementation:**
- [ ] `CharacterProfile` interface has `gender?: 'male' | 'female' | 'non-binary'`
- [ ] `cast_design.schema.yaml` has `gender` field
- [ ] `cml_2_0.schema.yaml` cast items have `gender` field
- [ ] Agent 2 prompt includes gender instruction
- [ ] Agent 3 CML prompt propagates gender to `CASE.cast[].gender`
- [ ] After a test run: inspect raw cast JSON output for presence of `gender` on every character
- [ ] Prose `characterConsistencyRules` emits correct pronoun lines (not all `they/them`)
- [ ] Validator no longer skips pronoun checks (confirm by checking test run validation output)
- [ ] No regression in cast design score (currently 98 — gender is lightweight; should not drop)

---

### Chain B: Locked Facts

**Goal:** Physical evidence values (what time the clock showed, the degree of tampering, the watch reading) are fixed once by agent3b and injected read-only into every subsequent agent call.

```
schema/hard_logic_devices.schema.yaml   ADD: lockedFacts array to devices[]
                                        items:
                                          - id: string (required)
                                          - value: string (required)
                                          - description: string (required)
                                          - appearsInChapters: string[] (optional)

        ↓
packages/prompts-llm/src/              ADD: lockedFacts generation instruction to
agent3b-hard-logic.ts                  agent3b prompt:
                                       "For the primary device, populate lockedFacts[]
                                        with 2-5 specific physical values the prose
                                        must use verbatim — clock face time, tampering
                                        magnitude, watch reading etc."
        ↓
packages/prompts-llm/src/              ADD: HardLogicDeviceIdea interface field
agent3b-hard-logic.ts (interface)        lockedFacts?: Array<{id, value, description,
                                           appearsInChapters?}>
        ↓
apps/worker/src/jobs/                  EXTRACT: lockedFacts from agent3b output after
mystery-orchestrator.ts                generation. Format as read-only block:
                                       "LOCKED FACTS — DO NOT CONTRADICT:
                                        - Clock face time: ten minutes past eleven
                                        - Tampering magnitude: forty minutes wound back
                                        Use these values verbatim in every chapter."
        ↓
packages/prompts-llm/src/agent9-prose.ts  ADD: lockedFactsBlock parameter to
                                          ProseGenerationInputs interface.
                                          Inject into system prompt above
                                          qualityGuardrailBlock.
        ↓
packages/story-validation/src/         ADD: LockedFactsValidator
                                       - Accepts lockedFacts[] from report
                                       - Scans prose for all occurrences of each
                                         fact's id-related terms
                                       - Flags if different values appear for same fact
                                       Severity: S1
```

**Downstream risk:** Agent 3b is already scored (96/A) — adding `lockedFacts` as an optional array should not break existing schema validation. But the normalizer in agent3b must be checked to ensure it doesn't drop array fields it doesn't recognise. The `adaptHardLogicForScoring()` adapter in `scoring-adapters.ts` must also be checked — if it maps device fields and `lockedFacts` is not mapped, it will be silently discarded before reaching the orchestrator.

**Checks after implementation:**
- [ ] `hard_logic_devices.schema.yaml` `lockedFacts` field is `required: false` (preserve backward compat)
- [ ] `HardLogicDeviceIdea` interface updated in TypeScript
- [ ] `adaptHardLogicForScoring()` in `scoring-adapters.ts` passes `lockedFacts` through (check line by line)
- [ ] Orchestrator extracts `lockedFacts` and passes to `generateProse()` call
- [ ] `ProseGenerationInputs` has `lockedFacts` field
- [ ] System prompt includes locked facts block when present
- [ ] After test run: verify clock time consistent across all chapters
- [ ] Validator correctly flags a deliberately-introduced contradiction in a test story

---

### Chain C: Context Injection Hygiene (Location Profile Paragraphs)

**Goal:** Raw prose paragraphs from location profiles never reach the prose agent's context.

```
packages/prompts-llm/src/agent9-prose.ts
        buildProsePrompt()
        ↓
        locationProfilesContext builder currently receives full
        inputs.locationProfiles object.
        ↓
ADD: stripLocationParagraphs(locationProfiles) utility that deep-clones
     the profile and deletes all .paragraphs arrays before the object
     is used in context assembly. The stripping must happen before
     any field is read — not after the context string is built.

        ALSO ADD: formatAsReferenceOnly() wrapper for any remaining
        long-form text in the assembled context string.
        Prefix with: "⛔ REFERENCE DATA — DO NOT TRANSCRIBE VERBATIM:"
        and check the assembled system prompt length. If it exceeds
        12,000 tokens before the scene JSON is appended, truncate location
        context to name + atmosphere + 3 sensory cues per location only.
```

**No schema changes required.** This is purely an input pipeline change in `agent9-prose.ts`.

**Downstream risk:** Stripping `paragraphs` from location profiles means those prose blocks are no longer available to the agent even as inspiration. This may slightly reduce the richness of setting descriptions, but removes the leakage risk entirely. The sensory arrays (`sights`, `sounds`, `smells`, `tactile`) remain available and provide abundant detail.

**Checks after implementation:**
- [ ] `stripLocationParagraphs()` utility is unit-tested: input with paragraphs → output without
- [ ] Assembled `locationProfilesContext` string does not contain any sentence longer than 40 words from the location profile raw data
- [ ] Run a test generation: search output for "At The [Location] in [City]" pattern — must be absent
- [ ] Setting fidelity score does not regress (currently 67/100 — watch this metric)
- [ ] Location Profiles phase score does not change (it scores the artifact, not prose use of it)

---

### Chain D: Narrative State Document (NSD) v1

**Goal:** A structured state object carries established facts and used styles chapter-to-chapter, preventing per-chapter re-invention.

The existing `chapterSummaries` / `continuityBlock` system in `agent9-prose.ts` is the correct insertion point. It already tracks character names and setting terms across chapters. The NSD extends this rather than replacing it.

```
apps/worker/src/jobs/mystery-orchestrator.ts
        ↓
INITIALISE NSD before prose generation:
  const nsd: NarrativeState = {
    version: 1,
    lockedFacts: extractedLockedFacts,       // from agent3b
    characterPronouns: derivedPronounMap,    // from populated gender fields
    usedOpeningStyles: [],                   // populated after each chapter
    usedSensoryPhrases: [],                  // populated after each chapter
    cluesRevealedToReader: [],               // populated after each chapter
    chapterSummaries: [],                    // existing system
  };

        ↓
packages/prompts-llm/src/agent9-prose.ts
ADD: narrativeState?: NarrativeState to ProseGenerationInputs

        ↓
buildProsePrompt():
ADD: buildNSDBlock(narrativeState) that injects:
  "═══ NARRATIVE STATE (read-only — do not contradict) ═══
   LOCKED FACTS: [lockedFacts list]
   CHARACTER PRONOUNS: [pronounMap]
   DO NOT OPEN WITH: [usedOpeningStyles — last 5 used]
   DO NOT REUSE PHRASES: [usedSensoryPhrases — last 10 used]
   CLUES ALREADY REVEALED TO READER: [cluesSoFar]"

        ↓
AFTER each chapter batch completes:
ADD: updateNSD(nsd, generatedChapters) — lightweight extraction:
  - Regex opening sentence → log to usedOpeningStyles
  - Extract sensory phrases (adjective + noun combos) → log to usedSensoryPhrases
  - Match clueIds from outline scene → log to cluesRevealedToReader

        ↓
PASS updated NSD into next batch's generateProse() call.
```

**New type required:** `NarrativeState` interface in `apps/worker/src/jobs/mystery-orchestrator.ts` (or a new file `packages/prompts-llm/src/types/narrative-state.ts`).

**Downstream risk:** The NSD adds context tokens to every prose call. Monitor total system prompt length — if it exceeds the model's context window on long runs (17+ chapters), truncate `usedSensoryPhrases` to the last 15 entries and `usedOpeningStyles` to the last 8. The existing chapter summaries continuity block already adds tokens and has been stable; the NSD additions are comparable in size.

**Checks after implementation:**
- [ ] `NarrativeState` type is defined and exported
- [ ] NSD is initialised in orchestrator before first prose call
- [ ] NSD is passed through `ProseGenerationInputs`
- [ ] `buildNSDBlock()` emits correct section and is included in system prompt
- [ ] `updateNSD()` runs after each batch and the next batch receives the updated state
- [ ] After test run: confirm opening sentence of chapters 1–5 are all different styles
- [ ] After test run: confirm no sensory phrase repeats verbatim across adjacent chapters
- [ ] System prompt token count logged — confirm not exceeding 80% of context window
- [ ] Prose consistency sub-score improves from 78.1

---

### Chain E: Sensory Palette Variants

**Goal:** Each key location has 4–6 distinct sensory palettes that the orchestrator rotates by chapter, so variety is structural not prompt-instructed.

```
schema/location_profiles.schema.yaml
        ADD: sensoryVariants array to keyLocations[] items:
          sensoryVariants:
            type: array
            required: false
            items:
              type: object
              fields:
                id: string
                timeOfDay: string
                weather: string
                sights: array of string
                sounds: array of string
                smells: array of string
                mood: string

        ↓
packages/prompts-llm/src/agent2c-location-profiles.ts
        ADD: instruction to generate 3-4 sensoryVariants per key location
             "covering morning rain, afternoon grey, night stillness, 
              post-storm calm as distinct objects"

        ↓
apps/worker/src/jobs/mystery-orchestrator.ts
        ADD: selectSensoryPaletteForChapter(locationProfiles, chapterIndex)
             Returns the sensoryVariant whose timeOfDay + weather best matches
             the scene's outline setting.timeOfDay and atmosphere.
             Falls back to rotating through variants by chapter index if no match.

        ↓
packages/prompts-llm/src/agent9-prose.ts
        REPLACE: current sensoryExamples block in locationProfilesContext
        WITH: "CHAPTER PALETTE (use these senses as your opening anchor — do not reuse
               from previous chapters):
               Sights: [variant.sights]
               Sounds: [variant.sounds]
               Smells: [variant.smells]
               Mood: [variant.mood]"
```

**Downstream risk:** This is an additive schema change — `sensoryVariants` is `required: false`, so existing stored location profiles without it will not fail validation. The Location Profiles scorer must not penalise missing `sensoryVariants` (add to scorer as optional bonus, not required check). The `adaptLocationsForScoring()` adapter in `scoring-adapters.ts` must be reviewed to confirm it doesn't break on the new field.

**Checks after implementation:**
- [ ] `sensoryVariants` field marked `required: false` in schema — backward compatible
- [ ] Location Profiles scorer does not penalise absence of `sensoryVariants`
- [ ] `adaptLocationsForScoring()` handles `sensoryVariants` gracefully (no crash on undefined)
- [ ] Agent 2c prompt generates at least 3 variants per key location
- [ ] `selectSensoryPaletteForChapter()` tested: different chapters → different palettes
- [ ] After test run: 0 of 17 chapter openings share the exact same sensory trio

---

### Chain F: Cross-Chapter Consistency Validators

**Goal:** Post-generation safety net that catches anything not prevented upstream.

All four validators (pronoun, physical facts, opening style, context leakage) are additions to `packages/story-validation/src/`. The integration point is `StoryValidationPipeline`.

```
packages/story-validation/src/
        ADD: ProseConsistencyValidator class
             Methods:
               validatePronounConsistency(chapters, characterManifest)
                 — already partially in character-validator.ts; extend to full-run scan
               validateLockedFacts(chapters, lockedFacts)
                 — scan for all numeric/time mentions near each clue keyword;
                   flag if different values appear
               validateOpeningStyles(chapters)
                 — classify each opening sentence by style;
                   flag if same style class >50% of chapters
               validateContextLeakage(chapters)
                 — regex scan for "At The [A-Z].*in.*England" pattern
                 — flag any sentence >40 words that appears near-verbatim
                   in any known context template format

        ↓
packages/story-validation/src/pipeline.ts
        ADD: ProseConsistencyValidator to pipeline run
        ADD: consistency sub-score report field with validator results
        WIRE: lockedFacts from GenerationReport into validator call
              (orchestrator must pass them through to the report)

        ↓
packages/story-validation/src/types.ts
        ADD: ProseConsistencyReport interface
        ADD: consistencyReport?: ProseConsistencyReport to ValidationReport

        ↓
apps/worker/src/jobs/mystery-orchestrator.ts
        PASS: lockedFacts[] into StoryValidationPipeline call
              (currently the pipeline receives prose + CML; add lockedFacts)
```

**Downstream risk:** Adding validators to the pipeline increases validation time per run. Each validator should be O(n × m) where n = chapters, m = characters/facts. On a 17-chapter story this is fast (<1 second total). Ensure the pipeline does not abort on validator exceptions — wrap each validator in try/catch and log failures as warnings rather than hard stops.

**Checks after implementation:**
- [ ] Each validator has unit tests with known pass/fail stories
- [ ] Pipeline does not abort on validator exception (graceful degradation)
- [ ] `ProseConsistencyReport` appears in GenerationReport output
- [ ] Consistency sub-score exposed in quality report JSON (currently implicit in prose total)
- [ ] Context leakage detector correctly flags the "At The Drawing Room in Haworth" paragraph from project_30
- [ ] Locked facts validator correctly flags the five different clock times in project_30

---

## Full implementation checklist (ordered)

### Sprint 1 — Source fixes (1 day, low risk)

| # | File | Change | Risk |
|---|---|---|---|
| S1-1 | `schema/cast_design.schema.yaml` | Add `gender` field (optional, enum) | Low |
| S1-2 | `schema/cml_2_0.schema.yaml` | Add `gender` to cast[] items | Low |
| S1-3 | `packages/prompts-llm/src/agent2-cast.ts` | Add `gender` to `CharacterProfile` interface; update prompt | Low |
| S1-4 | `packages/prompts-llm/src/agent3-cml.ts` | Verify/add gender propagation instruction | Low |
| S1-5 | `packages/prompts-llm/src/agent9-prose.ts` | Add `stripLocationParagraphs()` before context assembly | Low |
| S1-6 | `packages/prompts-llm/src/agent9-prose.ts` | Add `lockedFactsBlock` injection point | Low |
| S1-7 | `schema/hard_logic_devices.schema.yaml` | Add `lockedFacts` array (optional) | Low |
| S1-8 | `packages/prompts-llm/src/agent3b-hard-logic.ts` | Add `lockedFacts` to interface + prompt | Low |
| S1-9 | `apps/worker/src/jobs/scoring-adapters.ts` | Verify `adaptHardLogicForScoring` passes `lockedFacts` through | Low |
| S1-10 | `apps/worker/src/jobs/mystery-orchestrator.ts` | Extract `lockedFacts` + pass to `generateProse()` | Low |

**Sprint 1 verification run:** Generate one story. Confirm:
- Gender present on all characters in cast JSON output
- `characterConsistencyRules` shows correct he/she/they per character
- No "At The [Location] in [City]" artifacts in prose output
- Clock-related locked fact appears consistently across chapters

---

### Sprint 2 — NSD (3 days, medium risk)

| # | File | Change | Risk |
|---|---|---|---|
| S2-1 | New: `packages/prompts-llm/src/types/narrative-state.ts` | `NarrativeState` interface | Low |
| S2-2 | `apps/worker/src/jobs/mystery-orchestrator.ts` | NSD initialisation from locked facts + gender | Medium |
| S2-3 | `packages/prompts-llm/src/agent9-prose.ts` | Add `narrativeState` to `ProseGenerationInputs` | Low |
| S2-4 | `packages/prompts-llm/src/agent9-prose.ts` | `buildNSDBlock()` and injection into system prompt | Medium |
| S2-5 | `apps/worker/src/jobs/mystery-orchestrator.ts` | `updateNSD()` after each batch; pass updated NSD to next batch | Medium |
| S2-6 | Token budget audit | Measure system prompt length before+after NSD; confirm < 80% context window | Low |

**Sprint 2 verification run:** Generate one long-format story (15+ chapters). Confirm:
- Opening sentences of all chapters are stylistically distinct
- No sensory phrase appears in more than 2 adjacent chapters
- Physical evidence values consistent throughout
- System prompt token count logged and within budget

---

### Sprint 3 — Palette variants + validators (3 days, medium risk)

| # | File | Change | Risk |
|---|---|---|---|
| S3-1 | `schema/location_profiles.schema.yaml` | Add `sensoryVariants` array (optional) | Low |
| S3-2 | `packages/prompts-llm/src/agent2c-location-profiles.ts` | Add variant generation instruction | Low |
| S3-3 | `apps/worker/src/jobs/mystery-orchestrator.ts` | `selectSensoryPaletteForChapter()` | Medium |
| S3-4 | `packages/prompts-llm/src/agent9-prose.ts` | Replace sensory examples with chapter palette injection | Medium |
| S3-5 | New: `packages/story-validation/src/prose-consistency-validator.ts` | All 4 validators | Medium |
| S3-6 | `packages/story-validation/src/pipeline.ts` | Wire `ProseConsistencyValidator` | Medium |
| S3-7 | `packages/story-validation/src/types.ts` | `ProseConsistencyReport` type | Low |
| S3-8 | `apps/worker/src/jobs/mystery-orchestrator.ts` | Pass `lockedFacts` into validation pipeline | Low |
| S3-9 | `apps/worker/src/jobs/scoring-adapters.ts` | `adaptLocationsForScoring` handles `sensoryVariants` gracefully | Low |

**Sprint 3 verification run:** Re-run project_30 equivalent. Confirm:
- Prose consistency sub-score ≥ 90 (was 78.1)
- Validator report present in quality JSON output
- Context leakage detector flags known bad patterns (regression test)
- All 4 validator unit test suites green

---

## Regression gate (applies to all sprints)

Before marking any sprint `DONE`, these baseline scores must not regress from project_30 levels:

| Phase | Baseline | Minimum acceptable |
|---|---|---|
| Cast Design | 98 | 95 |
| Hard Logic Devices | 96 | 93 |
| Location Profiles | 100 | 97 |
| Narrative Outline | 97 | 94 |
| Prose Generation | 96 | 95 |
| Overall | 98.15 | 96 |
| Prose consistency sub-score | 78.1 | **90** (target, not floor) |

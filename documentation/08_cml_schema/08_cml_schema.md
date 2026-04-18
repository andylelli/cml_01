# CML Schema Reference — v2.0

**File:** `schema/cml_2_0.schema.yaml` (master)  
**Sub-schemas:** `schema/*.schema.yaml` (delegated via `$ref`)

The CML (Case Markup Language) is the single source of truth for every generated mystery. It starts as a seed (CASE section only) and grows across the pipeline as each agent appends its artifact section. The final Full CML drives prose generation via Agent 9.

---

## Contents

1. [Pipeline Overview](#1-pipeline-overview)
2. [Master Document — CASE](#2-master-document--case)
   - [meta](#21-meta)
   - [cast](#22-cast)
   - [culpability](#23-culpability)
   - [surface\_model](#24-surface_model)
   - [hidden\_model](#25-hidden_model)
   - [false\_assumption](#26-false_assumption)
   - [constraint\_space](#27-constraint_space)
   - [inference\_path](#28-inference_path)
   - [discriminating\_test](#29-discriminating_test)
   - [fair\_play](#210-fair_play)
   - [quality\_controls](#211-quality_controls)
   - [prose\_requirements](#212-prose_requirements)
3. [Agent 1 — Setting Refinement](#3-agent-1--setting-refinement)
4. [Agent 2 — Cast Design](#4-agent-2--cast-design)
5. [Agent 2b — Character Profiles](#5-agent-2b--character-profiles)
6. [Agent 2c — Location Profiles](#6-agent-2c--location-profiles)
7. [Agent 2d — Temporal Context](#7-agent-2d--temporal-context)
8. [Agent 3b — Hard Logic Devices](#8-agent-3b--hard-logic-devices)
9. [Background Context](#9-background-context)
10. [Agent 6.5 — World Document](#10-agent-65--world-document)
11. [Agent 7 — Narrative Outline](#11-agent-7--narrative-outline)
12. [Agent 9 — Prose](#12-agent-9--prose)
13. [Composite CML Structure](#13-composite-cml-structure)
14. [Cross-Schema Field Relationships](#14-cross-schema-field-relationships)

---

## 1. Pipeline Overview

The CML is assembled incrementally. The CASE nucleus is always generated first (from a seed CML or the grabber). Each downstream agent appends a top-level section:

| Stage | Agent | CML Section Added | Sub-schema |
|-------|-------|-------------------|------------|
| Seed  | —     | `CASE`            | `cml_2_0.schema.yaml` |
| 1     | Agent 1   | `SETTING_REFINEMENT`  | `setting_refinement.schema.yaml` |
| 2     | Agent 2   | *(standalone artifact)* | `cast_design.schema.yaml` |
| 2b    | Agent 2b  | `CHARACTER_PROFILES`  | `character_profiles.schema.yaml` |
| 2c    | Agent 2c  | `LOCATION_PROFILES`   | `location_profiles.schema.yaml` |
| 2d    | Agent 2d  | `TEMPORAL_CONTEXT`    | `temporal_context.schema.yaml` |
| 3b    | Agent 3b  | *(standalone artifact)* | `hard_logic_devices.schema.yaml` |
| 6.5   | Agent 6.5 | `WORLD_DOCUMENT`      | `world_document.schema.yaml` |
| 7     | Agent 7   | `NARRATIVE_OUTLINE`   | `narrative_outline.schema.yaml` |
| 9     | Agent 9   | *(standalone artifact)* | `prose.schema.yaml` |

CML sections marked `required: false` are not present in the seed; they are added as the pipeline runs. The `CASE` section is the only block required at all stages. The rest are required before Agent 9 runs.

> **Telemetry fields:** Every agent artifact schema (except `background_context` and `setting_refinement`) includes `cost: number` (LLM API cost in USD) and `durationMs: number` or `latencyMs: number` (elapsed generation time). These are pipeline operational metadata and are not documented in the per-schema sections below.

---

## 2. Master Document — CASE

**Source:** `schema/cml_2_0.schema.yaml`

Top-level fields:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `CML_VERSION` | number | yes | Must be `2.0` |
| `CASE` | object | yes | The mystery nucleus |

### 2.1 meta

Immutable identity of the story. Never overwritten by downstream agents.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Story title |
| `author` | string | yes | Author attribution |
| `license` | string | yes | License string |
| `era` | object | yes | See below |
| `setting` | object | yes | See below |
| `crime_class` | object | yes | See below |
| `theme` | string | no | The story's deeper subject — one sentence. Not the plot summary. E.g. *"The cost of protecting a secret"*. Used by Agent 6.5 to anchor the World Document and by Agent 9 to give prose soul. |

**era**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `decade` | string | yes | E.g. `"1940s"` |
| `specific_year` | number | no | Required for wartime; strongly recommended for all |
| `specific_month` | string | no | Month name. Required for wartime stories. |
| `wartime` | boolean | no | `true` = September 1939 – August 1945 |
| `realism_constraints` | string[] | no | Historical constraints the story must respect |
| `era_atmosphere` | string | no | One sentence. Dominant emotional register of this moment for civilians. |

**setting**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `location` | string | yes | Named location (house, village, estate, etc.) |
| `place` | string | no | Town/city/village |
| `country` | string | no | Country name |
| `institution` | string | yes | Institution type (country house, hotel, hospital, etc.) |

**crime_class**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `category` | string | yes | `murder` \| `theft` \| `disappearance` \| `fraud` |
| `subtype` | string | yes | Specific subtype, e.g. *"poisoning disguised as natural causes"* |

---

### 2.2 cast

Array of characters. Every named character in the story must have an entry here.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | yes | Canonical full name |
| `age_range` | string | yes | E.g. `"30s"`, `"late 40s"` |
| `role_archetype` | string | yes | Prose-friendly description of role type, e.g. *"the dutiful secretary"* |
| `relationships` | string[] | no | Relationships to other cast members by name |
| `public_persona` | string | yes | How this character presents publicly |
| `private_secret` | string | yes | Their concealed truth — the core of their dramatic function |
| `motive_seed` | string | yes | Underlying motivation (applies to all suspects, not only the culprit) |
| `motive_strength` | string | yes | How powerful the motive is |
| `alibi_window` | string | yes | Time window and claimed location during the crime |
| `access_plausibility` | string | yes | How plausible their physical/social access to the crime scene is |
| `opportunity_channels` | string[] | no | Specific routes by which they could have committed the crime |
| `behavioral_tells` | string[] | no | Observable micro-behaviours that betray concealed emotion — used for prose texture |
| `stakes` | string | yes | What this character stands to gain or lose from the outcome |
| `evidence_sensitivity` | string[] | no | Which pieces of evidence implicate or exonerate them |
| `culprit_eligibility` | string | no | `eligible` \| `ineligible` \| `locked` |
| `culpability` | string | no | `guilty` \| `innocent` \| `unknown` |
| `gender` | string | no | `male` \| `female` \| `non-binary` |
| `role` | string | no | `detective` \| `victim` \| `culprit` \| `suspect` \| `witness` \| `bystander`. Machine-readable complement to `role_archetype`. `victim` is the canonical signal used by prose agents to identify the murder victim. |
| `moral_complexity` | string | no | One sentence. Why this character is not simply good or bad. Especially required for victim and culprit. |

---

### 2.3 culpability

The authoritative record of who did it. Kept separate from `cast` to allow multi-culprit stories.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `culprit_count` | number | yes | `1` or `2` |
| `culprits` | string[] | yes | Names matching entries in `CASE.cast` |

---

### 2.4 surface\_model

What the world believes happened at the start of the story.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `narrative.summary` | string | yes | The accepted account of events |
| `accepted_facts` | string[] | yes | Specific facts treated as settled by all parties |
| `inferred_conclusions` | string[] | yes | Conclusions the characters have drawn (may be wrong) |

---

### 2.5 hidden\_model

The truth behind the accepted account.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `mechanism.description` | string | yes | Full description of how the crime was actually committed |
| `mechanism.delivery_path` | object[] | yes | Ordered steps of the crime mechanism. Each step: `{ step: string }` |
| `outcome.result` | string | yes | What the crime actually produced |

---

### 2.6 false\_assumption

The single core misconception that drives the mystery. When the reader accepts this assumption, they cannot solve the case. When the detective breaks it, the solution becomes clear.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `statement` | string | yes | The assumption stated plainly |
| `type` | string | yes | `temporal` \| `spatial` \| `identity` \| `behavioral` \| `authority` |
| `why_it_seems_reasonable` | string | yes | Why any rational person would accept this assumption |
| `what_it_hides` | string | yes | What truth the assumption conceals |

---

### 2.7 constraint\_space

The logical envelope of the mystery — the facts that define who could have done what, when, and how.

**time**

| Field | Type | Notes |
|-------|------|-------|
| `anchors` | string[] | Fixed time points (e.g. *"victim last seen alive at 9:40pm"*) |
| `windows` | string[] | Time windows during which key events occurred |
| `contradictions` | string[] | Apparent contradictions in the timeline |

**access**

| Field | Type | Notes |
|-------|------|-------|
| `actors` | string[] | Who had physical access |
| `objects` | string[] | Which objects were accessible to whom |
| `permissions` | string[] | Social or institutional permissions governing access |

**physical**

| Field | Type | Notes |
|-------|------|-------|
| `laws` | string[] | Physical facts that constrain what is possible (e.g. poison requires contact) |
| `traces` | string[] | Physical traces that must exist if a given mechanism is true |

**social**

| Field | Type | Notes |
|-------|------|-------|
| `trust_channels` | string[] | Relationships of trust that enabled deception |
| `authority_sources` | string[] | Sources of institutional authority relevant to the case |

---

### 2.8 inference\_path

The chain of logical steps that leads from observable clues to the solution. Minimum 3 steps.

Each step in `steps[]`:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `observation` | string | yes | What the detective observes |
| `correction` | string | yes | How this observation corrects a prior assumption |
| `effect` | string | yes | What this correction implies |
| `required_evidence` | string[] | no | Evidence IDs that must be in play for this step to be valid |
| `reader_observable` | boolean | no | Whether the reader has the information to make this inference themselves |

---

### 2.9 discriminating\_test

The scene or device that irrefutably separates the culprit from all suspects. Must be present in the narrative outline.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `method` | string | yes | `reenactment` \| `trap` \| `constraint_proof` \| `administrative_pressure` |
| `design` | string | yes | How the test works in the story |
| `knowledge_revealed` | string | yes | What the culprit reveals by their response |
| `pass_condition` | string | yes | What constitutes a pass (culprit exposed) |

---

### 2.10 fair\_play

Confirming the story satisfies the fair-play principle: the reader has all the information needed to solve the mystery before the revelation.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `all_clues_visible` | boolean | yes | All essential clues are shown to the reader before the revelation |
| `no_special_knowledge_required` | boolean | yes | Solution requires no knowledge unavailable to the reader |
| `no_late_information` | boolean | yes | No decisive clue appears only in the revelation scene |
| `reader_can_solve` | boolean | yes | A careful reader could solve it |
| `explanation` | string | yes | Prose justification of the fair-play claim |

---

### 2.11 quality\_controls

Numeric constraints that the pipeline validates the generated outline against.

**inference\_path\_requirements**

| Field | Notes |
|-------|-------|
| `min_steps` | Minimum steps in `inference_path` |
| `max_steps` | Maximum steps |
| `require_observation_correction_effect` | All steps must have all three fields |

**clue\_visibility\_requirements**

| Field | Notes |
|-------|-------|
| `essential_clues_min` | Minimum number of essential clues |
| `essential_clues_before_test` | All essential clues must appear before the discriminating test |
| `early_clues_min` | Clues set in Act 1 |
| `mid_clues_min` | Clues set in Act 2 |
| `late_clues_min` | Clues set in Act 3 |

**discriminating\_test\_requirements**

| Field | Notes |
|-------|-------|
| `timing` | `late_act2` \| `early_act3` \| `mid_act3` |
| `must_reference_inference_step` | Test must correspond to at least one `inference_path` step |

---

### 2.12 prose\_requirements

Optional explicit scene mapping consumed by Agent 9 to ensure structural correctness. Present when the story's complexity requires precise scene-to-function assignment.

| Section | Purpose |
|---------|---------|
| `discriminating_test_scene` | Act/scene number where the test occurs, plus required scene elements |
| `suspect_clearance_scenes[]` | Per-suspect records of act/scene where they are eliminated with the method used |
| `culprit_revelation_scene` | Act/scene number and revelation method |
| `identity_rules[]` | How to refer to a character before and after their identity is revealed |
| `clue_to_scene_mapping[]` | Explicit clue ID → act/scene assignment with delivery method |

---

## 3. Agent 1 — Setting Refinement

**Source:** `schema/setting_refinement.schema.yaml`  
**CML key:** `SETTING_REFINEMENT`  
**Purpose:** Translates the abstract CML era and setting into concrete period-accurate constraints: what technology existed, how policing worked, what social norms shaped behaviour.

### era

| Field | Type | Notes |
|-------|------|-------|
| `decade` | string | The era label |
| `technology` | string[] | Available technology (e.g. *"no mobile phones"*, *"telegram for urgency"*) |
| `forensics` | string[] | Forensic capability of the period |
| `transportation` | string[] | Available transport modes and their constraints |
| `communication` | string[] | Communication methods — speed, privacy, reliability |
| `socialNorms` | string[] | Class rules, gender expectations, deference structures |
| `policing` | string[] | How police operated and what they could lawfully do |

### location

| Field | Type | Notes |
|-------|------|-------|
| `type` | string | Type of location |
| `description` | string | Physical description |
| `physicalConstraints` | string[] | What the location makes difficult or impossible |
| `geographicIsolation` | string | Degree/type of isolation (relevant to closed-circle stories) |
| `accessControl` | string[] | Who controls movement into and through the location |

### atmosphere

| Field | Type | Notes |
|-------|------|-------|
| `weather` | string | Prevailing weather |
| `timeOfDay` | string | Time of day at story opening |
| `mood` | string | Opening emotional register |
| `visualDescription` | string | Establishing visual |

### realism

| Field | Type | Notes |
|-------|------|-------|
| `anachronisms` | string[] | Anachronisms detected in the seed CML |
| `implausibilities` | string[] | Implausible elements flagged for correction |
| `recommendations` | string[] | Suggested adjustments to the CML |

---

## 4. Agent 2 — Cast Design

**Source:** `schema/cast_design.schema.yaml`  
**CML key:** Standalone artifact (not embedded in the full CML tree)  
**Purpose:** Enriches the seed characters with full structural role assignments, calculates relational tension between pairs, audits for diversity, and identifies which characters serve as culprit, victim, detective, or red herring candidates.

### characters[]

Mirrors `CASE.cast` with enriched fields:

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Must match CASE.cast |
| `ageRange` | string | |
| `occupation` | string | |
| `roleArchetype` | string | |
| `publicPersona` | string | |
| `privateSecret` | string | |
| `motiveSeed` | string | |
| `motiveStrength` | string | `weak` \| `moderate` \| `strong` \| `compelling` |
| `alibiWindow` | string | |
| `accessPlausibility` | string | `impossible` \| `unlikely` \| `possible` \| `easy` |
| `stakes` | string | |
| `characterArcPotential` | string | How this character might change across the story |
| `gender` | string | |

### relationships.pairs[]

One entry per character relationship:

| Field | Type | Notes |
|-------|------|-------|
| `character1` | string | Name |
| `character2` | string | Name |
| `relationship` | string | Relationship type (sibling, employer, former lover, etc.) |
| `tension` | string | `none` \| `low` \| `moderate` \| `high` |
| `sharedHistory` | string | Specific shared history relevant to the mystery |

### diversity

| Field | Type | Notes |
|-------|------|-------|
| `stereotypeCheck` | string[] | Potential stereotypes flagged in the cast |
| `recommendations` | string[] | Suggestions to deepen or vary representation |

### crimeDynamics

| Field | Type | Notes |
|-------|------|-------|
| `possibleCulprits` | string[] | Characters with motive + means + opportunity |
| `redHerrings` | string[] | Characters whose suspicion diverts attention |
| `victimCandidates` | string[] | Characters who could plausibly be the victim |
| `detectiveCandidates` | string[] | Characters who could plausibly be the detective |

---

## 5. Agent 2b — Character Profiles

**Source:** `schema/character_profiles.schema.yaml`  
**CML key:** `CHARACTER_PROFILES`  
**Purpose:** Deep psychological profiles for each cast member. The primary source of voice, mannerism, and interiority for Agent 9's prose.

Top-level fields:

| Field | Type | Notes |
|-------|------|-------|
| `status` | string | `draft` \| `final` |
| `tone` | string | Overall tonal guidance (e.g. *"dry, restrained, period-accurate"*) |
| `targetWordCount` | number | Target word budget for prose generated from these profiles |
| `note` | string | Optional agent commentary |

### profiles[]

One profile per cast member. All fields below are per-character:

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Must match `CASE.cast` |
| `summary` | string | One paragraph. The character's essential nature. |
| `publicPersona` | string | How they present publicly (echoes CASE.cast but expanded) |
| `privateSecret` | string | Their concealed truth |
| `motiveSeed` | string | Core motivation |
| `motiveStrength` | string | |
| `alibiWindow` | string | |
| `accessPlausibility` | string | |
| `stakes` | string | |
| `humourStyle` | string | `understatement` \| `dry_wit` \| `polite_savagery` \| `self_deprecating` \| `observational` \| `deadpan` \| `sardonic` \| `blunt` \| `none` |
| `humourLevel` | number | 0–10 scale. 0 = never witty. Used by Agent 6.5 to gate humour permissions. |
| `speechMannerisms` | string | How this character speaks — concrete and functional. E.g. *"Short sentences, avoids subordinate clauses, uses silence as punctuation."* |
| `physicalMannerisms` | string | Micro-tells for prose. E.g. *"Adjusts collar when lying. Goes very still when frightened."* |
| `internalConflict` | string | The psychological tension inside this character that the mystery exacerbates |
| `personalStakeInCase` | string | Why this character specifically cares about this crime beyond general interest |
| `privateLonging` | string | What this character wants that has nothing to do with the case. Humanises them. |
| `gender` | string | |
| `paragraphs` | string[] | Full free-prose paragraphs expanding on the profile. Consumed by Agent 9. |
| `order` | number | Rendering order in the profile document |

---

## 6. Agent 2c — Location Profiles

**Source:** `schema/location_profiles.schema.yaml`  
**CML key:** `LOCATION_PROFILES`  
**Purpose:** Sensory and emotional profiles for the primary location and all key sub-locations. Provides prose agents with concrete atmospheric material to avoid generic description.

Top-level fields:

| Field | Type | Notes |
|-------|------|-------|
| `status` | string | `draft` \| `final` |
| `tone` | string | Overall tonal framing |
| `note` | string | Optional agent commentary |

### primary

The story's main location (e.g. the house, the hotel, the estate).

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Location name |
| `type` | string | Type (manor, cottage, village hall, etc.) |
| `place` | string | Town/city/village |
| `country` | string | Country |
| `summary` | string | One-paragraph description |
| `visualDescription` | string | Visual establishing description |
| `atmosphere` | string | Emotional atmosphere |
| `paragraphs` | string[] | Full free-prose location description |

### keyLocations[]

One entry per distinct interior or exterior space used in the story.

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | Unique identifier (referenced in `NARRATIVE_OUTLINE.scenes[]`) |
| `name` | string | Location name |
| `type` | string | `interior` \| `exterior` \| `transitional` |
| `purpose` | string | Narrative function of this space |
| `visualDetails` | string | Physical appearance |
| `sensoryDetails` | object | `sights[]`, `sounds[]`, `smells[]`, `tactile[]` |
| `accessControl` | string | Who can enter and under what conditions |
| `sensoryVariants[]` | object[] | 3–4 time-of-day and weather variants so Agent 9 can vary atmospheric texture across chapters. Each variant: `{ id, timeOfDay: morning\|afternoon\|evening\|night, weather, sights[], sounds[], smells[], mood }` |
| `paragraphs` | string[] | Full free-prose location description |

### atmosphere

Story-wide atmospheric constants.

| Field | Type | Notes |
|-------|------|-------|
| `era` | string | Era label |
| `weather` | string | Prevailing weather |
| `timeFlow` | string | How time passes in this story (rapid, languid, etc.) |
| `mood` | string | Dominant mood |
| `eraMarkers` | string[] | Period-specific physical details that must appear in prose |
| `sensoryPalette.dominant` | string | Primary sensory register |
| `sensoryPalette.secondary` | string[] | Secondary sensory registers |
| `paragraphs` | string[] | Atmospheric prose |

---

## 7. Agent 2d — Temporal Context

**Source:** `schema/temporal_context.schema.yaml`  
**CML key:** `TEMPORAL_CONTEXT`  
**Purpose:** Establishes the precise cultural moment of the story — date, season, fashion, current affairs, and social attitudes. Provides Agent 9 with historically accurate texture.

### specificDate

| Field | Type | Notes |
|-------|------|-------|
| `year` | number | |
| `month` | string | Month name |
| `day` | number | Optional |
| `era` | string | Era label |

> **Note:** `TEMPORAL_CONTEXT.seasonal.season` must be consistent with `specificDate.month`. The prose validator enforces month–season agreement. See `MONTH_TO_SEASON` mapping in the validation layer.

### seasonal

| Field | Type | Notes |
|-------|------|-------|
| `season` | string | `spring` \| `summer` \| `fall` \| `winter` |
| `month` | string | |
| `weather` | string[] | Expected weather conditions |
| `daylight` | string | Hours of daylight |
| `holidays` | string[] | Relevant holidays or observances |
| `seasonalActivities` | string[] | Period-appropriate activities for the season |
| `time_of_day_of_crime` | string | Optional. Time of day the crime occurred. |

### fashion

Period-accurate clothing. Consumed by Agent 9 for descriptive detail.

| Section | Fields |
|---------|--------|
| `mensWear` | `formal[]`, `casual[]`, `accessories[]` |
| `womensWear` | `formal[]`, `casual[]`, `accessories[]` |
| `trendsOfTheMoment` | string[] — current fashion movements |
| `socialExpectations` | string[] — dress code norms |

### currentAffairs

| Field | Type | Notes |
|-------|------|-------|
| `majorEvents` | string[] | Events any person of the era would know |
| `politicalClimate` | string | One sentence |
| `economicConditions` | string | One sentence |
| `socialIssues` | string[] | Active social debates or pressures |
| `internationalNews` | string[] | International events relevant to this setting |

### cultural

| Section | Fields |
|---------|--------|
| `entertainment` | `popularMusic[]`, `films[]`, `theater[]`, `radio[]` |
| `literature` | `recentPublications[]`, `popularGenres[]` |
| `technology` | `recentInventions[]`, `commonDevices[]`, `emergingTrends[]` |
| `dailyLife` | `typicalPrices[]`, `commonActivities[]`, `socialRituals[]` |

### socialAttitudes

| Field | Type | Notes |
|-------|------|-------|
| `class` | string[] | Class structure, mobility, and tensions |
| `gender` | string[] | Gender expectations and constraints |
| `race` | string[] | Racial attitudes and social context |
| `generalNorms` | string[] | General social behaviour norms |

### Other

| Field | Notes |
|-------|-------|
| `atmosphericDetails` | string[] — additional period texture not captured above |
| `paragraphs` | string[] — synthesised prose description of the temporal context |
| `note` | string — optional agent commentary |

---

## 8. Agent 3b — Hard Logic Devices

**Source:** `schema/hard_logic_devices.schema.yaml`  
**CML key:** Standalone artifact  
**Purpose:** Proposes illusionist mechanisms for the crime — devices that exploit a physical law, mathematical principle, cognitive bias, or social logic to create an apparently impossible situation. The selected device informs the `CASE.hidden_model` and the `discriminating_test`.

Top-level fields:

| Field | Type | Notes |
|-------|------|-------|
| `overview` | string | Summary of the ideation output |
| `status` | string | `ok` |

### devices[]

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Device name |
| `corePrinciple` | string | The underlying mechanism |
| `principleType` | string | `physical_law` \| `mathematical_principle` \| `cognitive_bias` \| `social_logic` |
| `surfaceIllusion` | string | What it looks like to witnesses |
| `underlyingReality` | string | What actually happened |
| `fairPlayClues` | string[] | Clue types that would give a careful reader a fair chance to spot the device |
| `whyNotTrope` | string | Why this device avoids being a tired cliché |
| `variationEscalation` | string | How the device could be escalated or varied |
| `mechanismFamilyHints` | string[] | Related mechanisms that could reinforce or contrast this device |
| `modeTags` | string[] | Optional classification tags |
| `moralAmbiguity` | string | The grey area that makes the crime morally complex — why the reader might feel sympathy for the culprit or discomfort at the verdict |
| `lockedFacts[]` | object[] | Ground-truth physical evidence values that **must appear verbatim in prose** and must never be contradicted across chapters. Each: `{ id, value, description, appearsInChapters[] }` |

> **Locked facts** are an integrity mechanism. Any value declared as a locked fact is propagated to prose validators, which will fail any chapter where the value contradicts the declared ground truth.

---

## 9. Background Context

**Source:** `schema/background_context.schema.yaml`  
**CML key:** Standalone artifact (pre-pipeline context snapshot)  
**Purpose:** A compact canonical backdrop used as a consistency reference across the pipeline. Derived from the seed CML before enrichment begins.

| Field | Type | Notes |
|-------|------|-------|
| `status` | string | `ok` |
| `backdropSummary` | string | One paragraph. Canonical framing of era + setting + cast anchor. |
| `era.decade` | string | |
| `era.socialStructure` | string | Optional. Class/power structure relevant to this story. |
| `setting.location` | string | |
| `setting.institution` | string | |
| `setting.weather` | string | Optional |
| `castAnchors` | string[] | Character names with brief role descriptors used to lock cast identity |
| `theme` | string | Optional. Echoes `CASE.meta.theme`. |

---

## 10. Agent 6.5 — World Document

**Source:** `schema/world_document.schema.yaml`  
**CML key:** `WORLD_DOCUMENT`  
**Purpose:** The narrative synthesis brief. Translates all structured CML and enrichment data into humanised story material. The World Document is the primary creative input for Agent 7 (outline) and Agent 9 (prose). It does not introduce any new facts — everything in it must be derivable from CML + enrichment artifacts.

Top-level fields:

| Field | Type | Notes |
|-------|------|-------|
| `status` | string | `draft` \| `final` |
| `storyTheme` | string | One sentence. The governing synthesis statement — what this story is really about beneath the plot mechanics. Must connect to `CASE.meta.theme`. Governs the entire document — emotional arc, character portraits, humour map should all be inflected by this. |

### historicalMoment

The lived experience of this specific historical moment, not generic decade description.

| Field | Type | Notes |
|-------|------|-------|
| `specificDate` | string | Human-readable date, e.g. *"November 1940"* |
| `eraRegister` | string | One focused paragraph (200–300 words). Dateable — a reader should identify the approximate year from this text alone. Must not be generic. |
| `currentTensions` | string[] | 2–4 specific current events any person in this setting would feel. Each is a concrete fact, not a generalisation. E.g. *"Petrol rationing came into force three weeks ago"* not *"There was rationing."* |
| `physicalConstraints` | string[] | Era-specific constraints on movement, communication, and behaviour |
| `emotionalRegister` | string | One sentence. The dominant emotional atmosphere. E.g. *"Grim determined normality with an undertow of dread."* |
| `wartimeServiceContext` | object | Present only for wartime stories (1939–1945). Fields: `serviceStatus` (who is serving, who is reserved, why), `socialTexture` (what a man of service age in civilian clothes means socially), `absenceEffect` (impact of absent cast members on social dynamic). |

### characterPortraits[]

One entry per cast member. Grounds each character in the historical moment.

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Must match `CASE.cast` |
| `portrait` | string | 80–120 words. Character's specific relationship to the historical moment. References at least one CML fact. States what they want and what they fear. |
| `eraIntersection` | string | One sentence. How the historical moment intersects with this character's private situation. |

### characterVoiceSketches[]

Concrete dialogue fragments — not abstractions. Consumed by Agent 9 to write differentiated character voices.

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Must match `CASE.cast` |
| `voiceDescription` | string | One sentence describing speech pattern without using abstract humour labels. E.g. *"Speaks in short complete sentences, rarely finishes a thought aloud, lets pauses do the work."* |
| `fragments[]` | object[] | At least 3 fragments covering at least 2 different registers. Each: `{ register: comfortable\|evasive\|stressed\|humorous\|formal, text }`. Text is 2–4 lines of actual dialogue or interior monologue, no attribution or stage directions. |
| `humourNote` | string | Present only for characters with `humourLevel > 0`. One sentence describing what form their wit takes in practice. |

### locationRegisters[]

Emotional stance for each key location in this specific story. Keyed to `LOCATION_PROFILES.keyLocations[].id`.

| Field | Type | Notes |
|-------|------|-------|
| `locationId` | string | Must match a `keyLocation.id` in `LOCATION_PROFILES` |
| `name` | string | |
| `emotionalRegister` | string | 60–100 words. What it feels like to be in this location given the story's specific circumstances. Concrete and imagistic. References at least one sensory detail from the location profile. |
| `eraNote` | string | Optional. If the era imposes a specific constraint on this location. |
| `cameraAngle` | string | One sentence describing the emotional stance for entering and writing this location. |

### storyEmotionalArc

| Field | Type | Notes |
|-------|------|-------|
| `dominantRegister` | string | One sentence. The story's overall emotional character. |
| `arcDescription` | string | 200–300 words describing the emotional journey from opening to close. Does not mention clue IDs, mechanism details, or the culprit's name. |
| `turningPoints[]` | object[] | Emotional shifts at key positions. Each: `{ position: opening\|early\|first_turn\|mid\|second_turn\|pre_climax\|climax\|resolution, emotionalDescription }` |
| `endingNote` | string | What should linger with the reader after the final page. One sentence. |

### humourPlacementMap[]

Governs where and how wit is permitted. Consumed by Agent 7 when writing per-scene emotional notes and by Agent 9 when generating prose.

| Field | Type | Notes |
|-------|------|-------|
| `scenePosition` | string | `opening_scene` \| `first_investigation` \| `body_discovery` \| `first_interview` \| `domestic_scene` \| `mid_investigation` \| `second_interview` \| `tension_scene` \| `pre_climax` \| `discriminating_test` \| `revelation` \| `resolution` |
| `humourPermission` | string | `permitted` \| `conditional` \| `forbidden` |
| `condition` | string | Present when `conditional`. The condition under which humour is allowed. |
| `permittedCharacters` | string[] | Characters who may carry wit in this scene type |
| `permittedForms` | string[] | Allowed humour styles: `understatement`, `dry_wit`, `polite_savagery`, `self_deprecating`, `observational`, `deadpan` |
| `rationale` | string | One sentence explaining this permission decision |

### breakMoment

The pre-identified scene where a character loses emotional control. Every story has exactly one.

| Field | Type | Notes |
|-------|------|-------|
| `character` | string | Must match `CASE.cast` |
| `scenePosition` | string | Approximate story position (from a subset of `humourPlacementMap` positions) |
| `form` | string | How they break — concrete. E.g. *"Begins weeping unexpectedly when asked about the garden."* |
| `narrativeFunction` | string | One sentence. What this moment does for the story beyond destabilising the procedural tone. |

### revealImplications

| Field | Type | Notes |
|-------|------|-------|
| `revealImplications` | string | 90–150 words. Names 2–3 specific earlier moments that will feel entirely different once the reader knows the truth. Used by Agent 9 to seed those earlier moments with the right texture so the recontextualisation is earnable. |

### validationConfirmations

Boolean guarantees the World Builder LLM confirms before finalisation:

| Field | Guarantee |
|-------|-----------|
| `noNewCharacterFacts` | All character information derived from CML + character profiles only |
| `noNewPlotFacts` | Arc section does not name the culprit or reveal mechanism specifics |
| `castComplete` | All cast members appear in `characterPortraits` and `characterVoiceSketches` |
| `eraSpecific` | `historicalMoment.currentTensions` contains at least one specific dateable event — not generic decade description |
| `lockedFactsPreserved` | Hard logic locked facts not contradicted anywhere in this document |
| `humourMapComplete` | `humourPlacementMap` covers all required scene position values |

---

## 11. Agent 7 — Narrative Outline

**Source:** `schema/narrative_outline.schema.yaml`  
**CML key:** `NARRATIVE_OUTLINE`  
**Purpose:** Scene-by-scene three-act outline. The structural bridge between the World Document and Agent 9's prose. Every scene carries purpose, clue assignments, and (when `WORLD_DOCUMENT` is present) emotional register, voice, and humour guidance.

Top-level fields:

| Field | Type | Notes |
|-------|------|-------|
| `totalScenes` | number | |
| `estimatedTotalWords` | number | |
| `pacingNotes` | string[] | Global pacing observations |

### acts[]

| Field | Type | Notes |
|-------|------|-------|
| `actNumber` | number | `1`, `2`, or `3` |
| `title` | string | Act title |
| `purpose` | string | Structural function of this act |
| `estimatedWordCount` | number | |
| `scenes[]` | object[] | See below |

### scenes[]

Each scene is the basic narrative unit.

**Structural fields** (always present):

| Field | Type | Notes |
|-------|------|-------|
| `sceneNumber` | number | Global scene number |
| `act` | number | `1`, `2`, or `3` |
| `title` | string | Scene title |
| `setting.location` | string | Must reference a `keyLocation.id` or `primary` from `LOCATION_PROFILES` |
| `setting.timeOfDay` | string | |
| `setting.atmosphere` | string | |
| `characters` | string[] | Character names present |
| `purpose` | string | Why this scene exists in the story |
| `cluesRevealed` | string[] | Clue IDs shown to the reader in this scene |
| `dramaticElements` | object | `conflict`, `tension`, `revelation`, `misdirection` (all optional strings), `microMomentBeats[]` — non-plot emotional pause beats (grief, relief, memory, dread). At least 1 per 5 scenes. |
| `summary` | string | 2–3 sentence scene description |
| `estimatedWordCount` | number | |

**World-First enrichment fields** (present when `WORLD_DOCUMENT` is available):

| Field | Type | Notes |
|-------|------|-------|
| `emotionalRegister` | string | One sentence. The emotional tone this scene should carry, drawn from `storyEmotionalArc`. Agent 9 must honour this register. |
| `dominantCharacterNote` | object | `{ name, voiceRegister }`. The character whose perspective dominates, and how they sound, drawn from `characterVoiceSketches`. |
| `humourGuidance` | object | `{ permission: permitted\|conditional\|forbidden, character, form, condition }`. Drawn from `humourPlacementMap`. |
| `eraTextureNote` | string | One sentence. Era-specific physical or social constraint felt in this scene, drawn from `historicalMoment`. |
| `locationRegisterNote` | string | One sentence. Emotional stance for entering this location in this scene, drawn from `locationRegisters`. |
| `subtextNote` | string | One sentence. What this scene is really about beneath its surface purpose. E.g. *"Surface: taking statements. Real: two people who suspect each other pretending they don't."* Agent 9 uses this to write scenes with tension beyond their plot function. |

---

## 12. Agent 9 — Prose

**Source:** `schema/prose.schema.yaml`  
**CML key:** Standalone artifact (the final output)  
**Purpose:** The complete narrative prose. One chapter per outline scene.

| Field | Type | Notes |
|-------|------|-------|
| `status` | string | `draft` \| `final` |
| `tone` | string | Optional tonal note |
| `cast` | string[] | Character names appearing in the prose |
| `note` | string | Optional generation commentary |
| `chapters[]` | object[] | See below |

### chapters[]

| Field | Type | Notes |
|-------|------|-------|
| `title` | string | Chapter title |
| `summary` | string | 1–2 sentence chapter summary |
| `paragraphs` | string[] | Full paragraph text |

---

## 13. Composite CML Structure

The full CML at the point of prose generation has all sections populated. The `cml_2_0.schema.yaml` defines these as `$ref` delegations — the sub-schema is the single source of truth:

```yaml
CASE:                   # always present from seed
  ...

SETTING_REFINEMENT:     # $ref: setting_refinement.schema.yaml  (Agent 1)
CHARACTER_PROFILES:     # $ref: character_profiles.schema.yaml  (Agent 2b)
LOCATION_PROFILES:      # $ref: location_profiles.schema.yaml   (Agent 2c)
TEMPORAL_CONTEXT:       # $ref: temporal_context.schema.yaml    (Agent 2d)
WORLD_DOCUMENT:         # $ref: world_document.schema.yaml      (Agent 6.5)
NARRATIVE_OUTLINE:      # $ref: narrative_outline.schema.yaml   (Agent 7)
```

Standalone artifacts (Cast Design, Hard Logic Devices, Prose, Background Context) are stored separately — not embedded in the full CML — but are referenced by the pipeline at their respective stages.

---

## 14. Cross-Schema Field Relationships

Key propagation chains that must remain consistent across all sections:

| Field | Origin | Consumers | Constraint |
|-------|--------|-----------|------------|
| `CASE.cast[].name` | Seed CML | All agents | Canonical identifier. Must be identical in `CHARACTER_PROFILES`, `WORLD_DOCUMENT.characterPortraits`, `characterVoiceSketches`, and `NARRATIVE_OUTLINE.scenes[].characters` |
| `CASE.meta.theme` | Seed CML | Agent 6.5, Agent 9 | `WORLD_DOCUMENT.storyTheme` must connect to this |
| `CASE.meta.era.specific_month` | Seed CML | Agent 2d, Agent 9 | `TEMPORAL_CONTEXT.seasonal.season` must match (validated by prose validators) |
| `LOCATION_PROFILES.keyLocations[].id` | Agent 2c | Agent 6.5, Agent 7, Agent 9 | `WORLD_DOCUMENT.locationRegisters[].locationId` and `NARRATIVE_OUTLINE.scenes[].setting.location` must reference valid IDs |
| `hard_logic_devices.devices[].lockedFacts[].value` | Agent 3b | Agent 9, validators | Must appear verbatim in prose and must never be contradicted across chapters |
| `CASE.culpability.culprits[]` | Seed CML | Agent 9, validators | Culprit names must appear in `CASE.cast` and `CHARACTER_PROFILES` |
| `CHARACTER_PROFILES.profiles[].humourLevel` | Agent 2b | Agent 6.5 | Characters with `humourLevel > 0` appear in `WORLD_DOCUMENT.humourPlacementMap.permittedCharacters` |
| `WORLD_DOCUMENT.humourPlacementMap` | Agent 6.5 | Agent 7 | Each scene's `humourGuidance` in the outline is derived from the map entry for that scene's position |
| `inference_path.steps[]` | Seed CML | Agent 7, Agent 9 | Each step must be traceable to a scene in `NARRATIVE_OUTLINE` via `clue_to_scene_mapping` or `cluesRevealed` |
| `discriminating_test` | Seed CML | Agent 7, Agent 9 | Must correspond to a specific scene in `NARRATIVE_OUTLINE` documented in `prose_requirements.discriminating_test_scene` |

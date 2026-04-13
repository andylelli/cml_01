# 09 — Prose Generation: From Pre-Story Intelligence to Golden Age Fiction

> **Guiding ambition:** Every piece of background intelligence we generate before the
> first word of prose must be able to surface in the story at the right moment, in the
> right form, exactly once — and together they should make the story read as though a
> skilled human author held every detail in their head before they wrote Chapter One.

---

## 0. Purpose of This Document

This document specifies the full prose generation process: what happens between the
completion of the pre-prose pipeline and the delivery of finished chapters. It describes:

- Which agent produces which intelligence and in what form
- How that intelligence is decomposed into addressable atoms
- How atoms are selected, budgeted, and injected per chapter
- How deployment is tracked across the full story
- How the chapter prompt is assembled to maximise Golden Age quality
- What the validation and feedback loop looks like
- What "good" looks like — the Christie standard

This is the authoritative specification for Agent 9 (prose generation) and all
supporting structures (`NarrativeState`, `AssetLibrary`, chapter obligation contracts).

**Related documents:**
- `documentation/analysis/ANALYSIS_51_pre_prose_enrichment_strategy.md` — analysis and
  design rationale for the Asset Library model and chapter-specific context assembly
- `documentation/04_llm_ai.md` — per-agent prompt design and LLM integration
- `documentation/02_cml_and_agents.md` — CML schema and agent roles
- `notes/WHAT_MAKES_A_GOOD_WHODUNNIT.md` — narrative craft principles
- `notes/DEFINITIVE_GUIDE_TO_HUMOUR.md` — humour style guide

---

## 1. The Pre-Prose Intelligence Pipeline

Before Agent 9 runs, every other agent in the pipeline has produced structured
intelligence that bears on the quality of the prose. This section catalogues what each
agent contributes and which fields are most creatively significant.

### 1.1 Agent 1 — Setting Refinement

_Produces:_ the era and location constraint bible. Consumed by downstream agents
(Agent 3 CML generation, Agent 2d, etc.); not directly injected into Agent 9. Its
substance reaches prose via the World Document synthesis.

**Artifact:** `setting_refinement`

**Most prose-relevant fields:**
- `era.decade` — canonical era anchor propagated to all downstream agents
- `era.technology[]`, `era.communication[]`, `era.transportation[]` — what
  exists and what doesn't; the foundation of anachronism prevention
- `era.socialNorms[]`, `era.policing[]` — behavioural and procedural constraints
- `location.physicalConstraints[]` — movement restrictions for this setting
- `location.geographicIsolation` — why suspects cannot simply leave
- `atmosphere.weather`, `atmosphere.timeOfDay`, `atmosphere.mood` — tone baseline

### 1.2 Agent 2d — Temporal Context

_Produces:_ rich period-specific cultural data: fashion, entertainments, social
attitudes, current affairs. These fields are the raw source of era texture; by the time
prose runs they have been synthesised into the World Document, but they are the
ultimate origin of every period-specific detail.

**Artifact:** `temporal_context`

**Most prose-relevant fields:**
- `specificDate` — year/month/day anchor for season lock and era references
- `seasonal.season`, `seasonal.weather[]`, `seasonal.daylight`
- `seasonal.holidays[]`, `seasonal.seasonalActivities[]`
- `fashion.mensWear` / `fashion.womensWear` — formal/casual/accessories arrays
- `cultural.entertainment.music[]`, `.films[]`, `.theater[]`, `.radio[]`
- `cultural.literature.recentPublications[]`, `.popularGenres[]`
- `cultural.technology.recentInventions[]`, `.commonDevices[]`
- `cultural.dailyLife.typicalPrices[]`, `.commonActivities[]`, `.socialRituals[]`
- `socialAttitudes.class[]`, `.gender[]`, `.generalNorms[]`
- `atmosphericDetails[]` — free-form sensory/atmospheric fragments
- `paragraphs[]` — synthesised prose description of the era

### 1.3 Agent 2b — Character Profiles

_Produces:_ per-character psychological depth and voice signature.

**Most prose-relevant fields:**
- `publicPersona`, `privateSecret` — the social mask and the truth beneath it
- `motiveSeed`, `motiveStrength` — what drives them and how intensely
- `humourStyle`, `humourLevel` — voice register and wit frequency
- `speechMannerisms` — verbal tics, rhythm, formality
- `physicalMannerisms` — micro-tells under stress; limited deployment
- `internalConflict` — psychological tension; multiple deployment facets
- `privateLonging` — non-case personal desire; humanity signal
- `personalStakeInCase` — why this case matters to them specifically
- `stakes` — what they stand to lose or gain

### 1.4 Agent 2c — Location Profiles

_Produces:_ per-location sensory and atmospheric data with time-of-day variants.

**Most prose-relevant fields:**
- `keyLocations[n].sensoryDetails` — sights/sounds/smells/tactile arrays
- `keyLocations[n].sensoryVariants[]` — 3–4 condition-specific palettes per location
  keyed by `timeOfDay + weather`; the anti-repetition engine
- `keyLocations[n].accessControl` — movement constraints for physical plausibility
- `atmosphere.eraMarkers` — era-specific cultural/sensory anchors
- `atmosphere.sensoryPalette` — dominant and secondary palette descriptors
- `atmosphere.mood`, `atmosphere.weather`

### 1.5 Agent 3 — CML (Case Model Language)

_Produces:_ the complete logical skeleton of the mystery.

**Note:** Agent 3 also consumes the `background_context` artifact (Agent 2e), which
provides a backdrop summary, era/setting context, cast anchors, and theme. This
artifact seeds CML generation and is not directly injected into prose.

**Most prose-relevant fields:**
- `culpability.culprits[]`, `culpability.motive` — ground truth the prose must not betray
- `inference_path[]` — the logical steps the detective must travel
- `false_assumption` — the deliberate misdirection
- `discriminating_test` — the proof mechanism
- `prose_requirements` — identity rules, clue framing rules, revelation method

### 1.6 Agent 3b — Hard Logic Devices

_Produces:_ the physical mechanism at the heart of the crime.

**Most prose-relevant fields:**
- `lockedFacts[]` — verbatim phrases that must appear unchanged in prose whenever the
  evidence is referenced (time values, measurements, descriptions)

### 1.7 Agent 5 — Clue Distribution

_Produces:_ per-scene clue assignments with descriptions, reveal timing, and
`pointsTo` inference links.

**Most prose-relevant fields:**
- Per-clue `description`, `placement`, `pointsTo`, `isEssential`
- Clue-to-scene mapping driving the chapter obligation contract

### 1.8 Agent 6 — Fair Play Audit

_Produces:_ validation that the inference path has sufficient clue coverage.

**Prose impact:** determines which clues are structurally essential and must appear
before the discriminating test. These become hard obligations in the chapter prompt.

### 1.9 Agent 7 — Narrative Outline

_Produces:_ scene-by-scene structure with setting, cast, and purpose per scene.
Scene schema: `acts[n].scenes[n]` — scenes are nested inside three acts.

**Most prose-relevant fields:**
- Per-scene `sceneNumber` (unique across all acts), `title`
- Per-scene `setting.location`, `setting.timeOfDay`, `setting.atmosphere`
- Per-scene `characters[]` — primary key for character-scoped atom queries
- Per-scene `purpose` and `cluesRevealed[]` — drives the chapter obligation contract
- Per-scene `dramaticElements.conflict`, `.tension`, `.revelation`, `.misdirection`
- Per-scene `dramaticElements.microMomentBeats[]` — non-plot emotional pause beats
- Per-scene `summary` — 2–3 sentence scene description
- Per-scene enrichment fields (populated when World Document present):
  - `emotionalRegister` — tonal instruction drawn from the emotional arc
  - `dominantCharacterNote.name` + `.voiceRegister` — whose voice leads this scene
  - `humourGuidance.permission` + `.character` + `.form` — scene-level humour gate
  - `eraTextureNote` — era constraint or social note specific to this scene
- Act metadata: `acts[n].actNumber`, `acts[n].title`, `acts[n].purpose`

This is the primary selection key for chapter-specific context assembly.

### 1.10 Agent 6.5 — World Document (Synthesis)

_Produces:_ a creative synthesis of all prior intelligence, reframed as prose-writing
guidance. This is the primary creative brief for Agent 9.

**Artifact:** `world_document`

**Most prose-relevant fields:**
- `storyTheme` — one sentence: what this story is really about
- `historicalMoment.eraRegister` — 200–300 word emotional portrait of the era
- `historicalMoment.emotionalRegister` — one sentence: the dominant emotional
  atmosphere of this historical moment as felt by civilians
- `historicalMoment.currentTensions[]` — dateable background facts for texture
- `historicalMoment.physicalConstraints[]` — era movement/communication limits
- `historicalMoment.wartimeServiceContext` (optional; September 1939–August 1945 only):
  - `.serviceStatus` — who is in service, reserved occupations, civilian war work
  - `.socialTexture` — social meaning of a man of service age in civilian clothes
  - `.absenceEffect` — effect on cast dynamic of absent or recently returned members
- `storyEmotionalArc.dominantRegister` — the story's overall emotional character
- `storyEmotionalArc.arcDescription` — 300–400 word emotional blueprint for the story
- `storyEmotionalArc.turningPoints[]` — per arc-position emotional beat
- `storyEmotionalArc.endingNote` — final register guidance
- `characterPortraits[n].portrait` — 80–120 word physical + manner portrait
- `characterPortraits[n].eraIntersection` — how the historical moment intersects with
  this character's private situation (one sentence; deploy once)
- `characterVoiceSketches[n].voiceDescription` — definitive voice summary
- `characterVoiceSketches[n].fragments[]` — dialogue samples per register
- `characterVoiceSketches[n].humourNote` — character-specific wit description
- `locationRegisters[n].emotionalRegister` — 60–100 word emotional stance
- `locationRegisters[n].cameraAngle` — POV entry instruction per location
- `locationRegisters[n].eraNote` — era/wartime constraint on this location
- `humourPlacementMap[]` — scene-position-gated humour permission
- `breakMoment` — pre-identified emotional break: character, form, narrative function
- `revealImplications` — 90–150 words naming earlier moments that recolour on reveal

---

## 2. The Asset Library

The Asset Library is the mechanism that turns the pipeline's pre-story intelligence into
individually addressable, trackable units that can be selected and deployed per chapter.

### 2.1 Why atoms, not fields

The current pipeline injects pre-prose intelligence as monolithic context blocks: the
full character portrait for every character every chapter, the full `eraRegister` every
chapter, all location registers for all locations every chapter. This approach has two
compounding costs.

**Token cost.** A 9-character, 10-location story injects approximately 2,500–3,000 tokens
of portrait, voice, and register data per chapter prompt. In a 19-chapter story that is
47,000–57,000 tokens of context for content that is not present in those chapters. That
budget is spent whether the content surfaces in the prose or not.

**Attention dilution.** The LLM attends equally to all injected content. A voice sketch
for a character not appearing in this chapter competes for attention with the sketch for
characters who are present. Long blocks (200-word portrait, 300-word era register) are
read entirely even when only one sentence from them is relevant. When all voice sketches
are present without prioritisation, the LLM falls back on its training distribution and
averages the voices.

Additionally, schema annotations on several fields indicate intentional deployment
limits — `physicalMannerisms` is annotated "deploy at most one per scene", `privateLonging`
is "let it leak into one or two moments." Without state tracking, the same content
arrives identically in every chapter prompt, leaving the LLM to either overuse (repeat each
chapter) or never use (defer indefinitely).

The atom model solves both problems: each unit of injectable content is addressed
individually, carries its deployment budget, and is suppressed once that budget is
exhausted. Chapters receive only atoms relevant to their characters, locations, and
emotional register — and the LLM's attention is concentrated on what matters for this
chapter rather than spread across all content in the story.

**Reference:** ANALYSIS_51 §3 (The Four Core Problems with Current Injection) for the
full problem analysis; §4 (The Asset Library Model) for the design.

---

### 2.2 Atom types and chunking rules

Atoms are created at story initialisation — after all pre-prose agents complete, before
Agent 9 runs. For array fields the chunking is trivial (each element is one atom). For
prose fields a lightweight decomposition splits the text at its natural conceptual seams.

**Location sensory details**

`sensoryDetails.sights[]`, `sounds[]`, `smells[]`, `tactile[]` are already arrays — each
element is one atom (a short phrase). A location may yield 20+ atoms from
`sensoryDetails` alone.

`sensoryVariants[]`: each variant object (keyed by `timeOfDay` + `weather`) is one
atom with scope `location`. Used at most once per chapter visit.

**Character portrait (80–120 words)**

Chunk into four atoms:
- *First-impression* — the one thing a stranger notices before anything else. Deploy on
  the character's introduction chapter. Budget: 1.
- *Physical appearance* — build, colouring, clothing style (1–2 sentences)
- *Manner and bearing* — how they hold themselves, move through a room
- *Distinctive telling detail* — the irreplaceable feature that makes them themselves

After the first-impression atom deploys, the remaining three distribute across the next
3–4 appearances. After full deployment, physical presence is carried by `chapterSummaries`
and portrait atoms retire.

**`historicalMoment.eraRegister` (200–300 words)**

Chunk into five atoms:
- *Social context*: who holds power, who has lost it
- *Economic texture*: what money feels like, what is scarce
- *Emotional weather*: the prevailing mood people carry in this year
- *Defining era constraint*: the one thing this era demands or forbids
- *Concrete era anchor*: one dateable sensory or cultural detail rooted in `currentTensions`

Maximum 1–2 era atoms per chapter. Rotate so no two successive chapters draw from the
same register dimension.

**`internalConflict` (free-text, 1–3 sentences)**

Split into up to three atoms:
- *Core tension* — the defining moral or psychological struggle. Deploys in most scenes
  where the character is present and emotional. Budget: unlimited.
- *External manifestation* — the physical or behavioural tell it produces under pressure.
  Budget varies by story length; never deployed consecutively.
- *Resolution condition* — what would end the conflict. Surfaced only as sub-text in
  late-story scenes.

**`speechMannerisms` (free-text)**

Each distinct behaviour is one atom: "Clipped sentences, avoids contractions, long pause
before answering difficult questions" → three atoms, deployed in different chapters to
build the voice signature progressively rather than asserting it all at once.

**Voice sketch `fragments[]` per register**

Each fragment (comfortable / evasive / stressed / humorous / formal) is one atom, tagged
with its register. Register tag determines chapter-level priority (see §3.3).

**`eraIntersection` per character (one sentence)**

Single atom. Budget: 1. Deploy on the character's first or second appearance; retire
after deployment.

**`physicalMannerisms` per character**

Single atom per distinct mannerism. Budget by story length; never deployed in consecutive
chapters.

**`privateLonging` per character**

Single atom. Budget: 1–2 across the full story.

**`revealImplications` (90–150 words)**

Contains 2–3 specific earlier-moment references. Each reference is one atom with its own
injection window (see §3.4 for seeding-window rules).

**`characterVoiceSketches[n].humourNote`**

Single atom. Deploy only in chapters where the humour placement map permits this character
to express wit.

---

### 2.3 Atom data structure

```typescript
interface Asset {
  id: string;         // e.g. "char.Cavendish.internalConflict.external"
  source: string;     // schema field this chunk originated from
  scope: 'character' | 'location' | 'era' | 'arc' | 'story';
  scopeKey?: string;  // character name, location id, or absent for story-wide
  register?: string;  // voice fragments: comfortable | evasive | stressed | humorous | formal
  content: string;    // the text chunk itself
  budget: number;     // max total deployments across the full story
  used: number[];     // chapter numbers where this atom was deployed
  priority: 'obligation' | 'texture';
}
```

At chapter assembly, the pipeline queries the library for all atoms where:
1. `scope` matches the active characters/locations for this chapter
2. `used.length < budget`
3. For register-tagged atoms: `register` matches or is compatible with this chapter's
   dominant arc tone

Obligation-class atoms are injected into the scene obligation contract. Texture-class
atoms are injected as an optional enrichment pool.

---

### 2.4 Obligation-class vs texture-class atoms

**Obligation-class atoms** (`priority: 'obligation'`) are required deployments when the
scoped character or location is active in the chapter. They are injected directly into
the chapter's obligation contract — the explicit list of requirements the prose must
satisfy. Examples:

- First-impression portrait atom (character introduction chapter only)
- `internalConflict.core` (whenever that character is present and emotional)
- Chapter-appropriate sensory variant for the primary scene location
- `cluesRevealed[]` items that must surface in this chapter (from narrative outline)
- `breakMoment` atom (in its designated window, §3.5)

**Texture-class atoms** (`priority: 'texture'`) are optional enrichment drawn from the
pool. The LLM selects from them as needed to reach target word count, add period
specificity, or deepen a moment. Examples:

- Secondary portrait atoms after introduction
- Additional sensory dimension atoms
- Era register atoms beyond the currently obligated one
- Cultural touchstones from `temporalContext`
- `privateLonging`, `physicalMannerisms` (after obligation window closes)
- Secondary voice fragments for characters present

Texture atoms are offered in the prompt as a clearly-labelled optional pool. The LLM is
not required to use them but is encouraged to: "draw on these to add period texture and
character depth as opportunities arise."

---

### 2.5 Story-length budget table

The asset library always contains more atoms than any story can use. Story length
determines how deep into each category's pool the chapter assembly reaches.

Story length is set by `generation-params.yaml` (`targets.short = 20`,
`targets.medium = 30`, `targets.long = 42` chapters).

| Atom type | Short (20 ch) | Medium (30 ch) | Long (42 ch) | Notes |
|---|---|---|---|---|
| First-impression portrait | 1 | 1 | 1 | Event-based; you only meet someone once |
| Physical appearance detail | 2 | 2 | 3 | Needs two deployments to register across 20+ ch |
| Manner/bearing | 2 | 2 | 3 | |
| Distinctive telling detail | 2 | 3 | 4 | |
| `physicalMannerisms` atom | 2 | 3 | 4 | Schema: "at most one per scene" — spread wide |
| `privateLonging` atom | 1 | 2 | 2 | Schema: "1–2 moments" total |
| `internalConflict.core` | unlimited | unlimited | unlimited | Every emotional scene; never stale |
| `internalConflict.external` | 4 | 6 | 8 | ~20% of chapters; at 2/3/4 it would be invisible |
| `internalConflict.resolution` | 0–1 (late only) | 1 | 2 | Late-story signal only |
| Voice fragment per register | 3 | 4 | 5 | 5–6 scenes per register type in a 20-ch story |
| `eraIntersection` | 1 | 1 | 1 | Once-only character grounding |
| Sensory atom (sight/sound/smell) | 1 per visit | 1–2 per visit | 2 per visit | |
| Era register atom | 1 | 1 | 2 | Per chapter; rotate dimension |
| `currentTensions` item | 4 total | 6 total | 8 total | Surface every 4–5 chapters across the story |

Character atoms drawn per chapter: Short = 2–3; Medium = 3–4; Long = 4–5.

In a short story only the highest-priority atoms surface at the right moment. In a long
story the library provides depth: across 42 chapters a character can draw on atoms that
have never been used before, keeping characterisation fresh without the writer having to
invent new detail.

---

## 3. Asset Selection per Chapter

### 3.1 Selection keys from the scene outline

At chapter assembly time, the pipeline reads the scene outline entry for this chapter and
fires six selection queries against the asset library:

**`scenes[n].characters[]`** → character-scoped atom selection  
All atoms whose `scopeKey` matches a character present in this chapter's scenes are
candidates. Obligation-class atoms for those characters are automatically included;
texture-class atoms are ranked by `used.length / budget` (furthest from budget exhausted
= highest priority) and drawn to fill the per-chapter character atom quota (§2.5).

Characters not appearing in this chapter's scenes produce zero atoms. This is the primary
mechanism for eliminating the attention-dilution problem described in §2.1.

**`scenes[n].setting.location`** → location-scoped atom selection  
Sensory atoms and location register atoms for the active location are candidates. Location
register (emotionalRegister, cameraAngle, eraNote) is always obligation-class for the
primary scene location. Secondary locations in any same-chapter scenes are texture-class.

**`scenes[n].setting.timeOfDay` + `scenes[n].setting.atmosphere`** → sensory variant
selection  
Used to select the specific `sensoryVariants[]` entry for the primary location (see §3.2).

**`scenes[n].arcPosition`** (derived) → register-tagged fragment prioritisation and humour gating  
Arc position is **not a scene field**. It is calculated at runtime in `buildWorldBriefBlock()`
from `chapterIndex / totalChapters`, mapped as follows:
- chapters 0–1: `opening`
- ≤25%: `early`
- ≤40%: `first_turn`
- ≤55%: `mid`
- ≤70%: `second_turn`
- ≤80%: `pre_climax`
- final chapter: `resolution`
- otherwise: `climax`

This derived arc position maps to a dominant emotional register (see §3.3) which drives voice
fragment selection. It also keys the `humourPlacementMap` lookup — only fragments tagged with
compatible registers are elevated when the humour placement permission is `allowed` or
`encouraged`; `humourNote` atoms are suppressed when permission is `forbidden`.

**`chapterNumber`** → reveal seeding window, break moment gating, tonal contrast  
Chapter number as a fraction of total chapters determines which time-gated atoms are
active: the sanitised reveal seed window (§3.4), the break moment approach and trigger
windows (§3.5). `storyEmotionalArc.arcDescription` (§1.10) is a planned injection at the
start of each batch but is **not yet live** — `buildWorldBriefBlock()` does not currently
inject it (see §5.4).

> **Scene structure note:** The narrative outline nests scenes under acts:
> `acts[n].scenes[n].X`. Throughout §3, `scene.X` refers to fields on the individual
> scene object at that nested path.

**`scenes[n].cluesRevealed[]`** → chapter obligation contract  
Each clue ID in `cluesRevealed` generates an obligation atom: the clue must be surfaced
in this chapter via the scene's context. These are always obligation-class, never
texture-class, and are injected explicitly into the chapter prompt's obligation contract.

---

### 3.2 Sensory variant selection

Each key location has 3–4 `sensoryVariants[]` entries, each keyed by `timeOfDay` +
`weather`, each containing distinct `sights[]`, `sounds[]`, `smells[]`, and a `mood`.
The explicit purpose of this array is to give the prose LLM a different sensory palette
on every visit to the same location under different conditions.

**Selection logic:**
1. Filter `sensoryVariants[]` where `variant.timeOfDay` matches `scene.setting.timeOfDay`
   and `variant.weather` is compatible with `scene.setting.atmosphere`.
2. If a match exists, use it.
3. If no direct match, fall back to the variant matching only `timeOfDay`.
4. If no `timeOfDay` match, fall back to cycling by chapter number modulo variant count.

**Obligation injection:**  
The selected variant is elevated from guidance to **scene obligation**. The scene opening
is required to draw from the variant's sights, sounds, and smells. The prompt framing is:
"This chapter's visit to [location] falls under the [timeOfDay/weather] variant. Your
opening observation paragraph must draw from these specific senses."

**Variation enforcement:**  
The ID of the last-used variant per location is recorded in `NarrativeState` (as an
extension to the tracked state). At selection time, if only one variant candidate exists
and it matches the previous visit's variant, the selection step widens the filter to
include adjacent `timeOfDay` values so the same palette is never used on consecutive
visits to the same location.

**Current implementation status:** Injected as guidance text, not obligation. The
elevation to obligation-class is planned as part of the Asset Library implementation.

---

### 3.3 Register matching for voice fragments

Each character's voice sketch contains fragments tagged by register:
`comfortable | evasive | stressed | humorous | formal`. The active chapter's dominant
emotional register (derived from the arc position's `turningPoint.emotionalDescription`
and the `humourPlacementMap` permission) determines which fragment to prioritise.

**Arc position → dominant register mapping:**

| Arc position | Dominant register | Primary fragment tag |
|---|---|---|
| `opening` | comfortable | comfortable |
| `early` | comfortable / formal | comfortable, formal |
| `first_turn` | evasive | evasive |
| `mid` | evasive / stressed | evasive |
| `second_turn` | stressed | stressed |
| `pre_climax` | stressed | stressed |
| `climax` | stressed | stressed |
| `resolution` | comfortable / formal | comfortable |
| Any position (humour permitted) | humorous | humorous |

**Selection priority order** for each character present in this chapter:
1. Fragment whose register matches the dominant register — inject first
2. Fragment tagged `stressed` or `evasive` — inject as secondary (always useful)
3. Fragment tagged `neutral` or `comfortable` — inject as fallback

Where `humourPlacementMap.find(e => e.scenePosition === arcPosition)` resolves a matching
entry and that entry's `humourPermission` is `allowed` or `encouraged`, the `humorous`
fragment is elevated to first position and the `humourNote` atom is treated as
obligation-class for that character in that chapter.

Where the resolved entry's `humourPermission` is `forbidden`, `humourNote` atoms for all
characters are suppressed regardless of remaining budget.

> **Known implementation issue:** `humourPlacementMap` entries use the `scenePosition`
> enum (`opening_scene`, `first_investigation`, `body_discovery`, ...) while
> `arcPosForHumour` is derived using the `turningPoints` enum (`opening`, `early`,
> `first_turn`, ...). Only `pre_climax` and `resolution` appear in both enumerations.
> The `find()` therefore returns `undefined` for approximately 75% of story chapters —
> humour guidance is silently absent for most of the story. Resolving this mismatch is
> part of the Asset Library implementation work.

---

### 3.4 Reveal seeding: sanitised plant guide

`revealImplications` (world document) names 2–3 specific earlier moments that must
be planted in the story so the reveal lands with retrospective weight. In the current
implementation it is only injected in the final 25% of chapters. This is too late: the
seeding moments it references occur in chapters 3–15 of a 20-chapter story, but the
instructions to plant them only arrive after chapter 15.

**Two-phase injection:**

**Phase 1 — Sanitised plant guide (chapters 3 → 75% of total):**  
At chapter-library-build time, `revealImplications` is decomposed into one atom per
named moment. Each atom's `content` is rewritten as a forward-facing planting instruction,
not a reveal explanation:

> Original: "The moment Mrs. Cavendish stops herself mid-sentence when asked about the
> previous evening will recolour completely on the reveal — she knows more than she said."  
> Sanitised: "If Mrs. Cavendish is present in a pre-investigation scene, allow a moment
> of visible self-interruption or redirected thought — do not explain it."

The sanitised version tells the prose LLM what to plant without exposing why it matters.
Each moment-seeding atom becomes active at chapter 3 and expires at 75% through the story.

**Phase 2 — Full reveal framing (chapters 75%+ of total):**  
The full `revealImplications` text is injected directly, now framed retrospectively:
"The following earlier moments should now feel weighted — in late chapters the detective
or another character may begin to notice their significance."

**Why the split is necessary:**  
If the full `revealImplications` text is shown in early chapters, the prose LLM knows the
culprit's significance before it has been earned. The sanitised version plants the moment
without contaminating the chapter with reveal knowledge.

---

### 3.5 Break moment: approach and trigger

`breakMoment` (world document) pre-identifies a single emotional break: a character,
a scene position, a form (free text — e.g. tears / anger / revelation / collapse), and a
narrative function (the moment that justifies the reader's emotional investment).

**Three-phase injection:**

**No signal (chapters 1 → 40% of total):**  
`breakMoment` content is not injected. The story builds without telegraphing it.

**Approach signal (chapters 40% → 60%):**  
A compressed signal is injected as texture: "The story is building toward a significant
emotional break involving [character]. In these chapters, allow pressure on that character
to accumulate visibly — their composure should be noticeably maintained, not absent."
This creates sub-textual tension without triggering the break prematurely.

**Full obligation (chapters 60% → 85%):**  
The full `breakMoment` content is injected as an obligation atom: character, form, and
narrative function specified. The prose must include the break in this window. The scene
position field from `breakMoment` is used to select the right chapter within the window
if the arc positions align.

**After 85%:**  
`breakMoment` atoms are retired. The break has either occurred (budget 1, now exhausted)
or is noted in the post-generation diagnostic as an undeployed obligation.

---

### 3.6 Tonal contrast logic

Unrelenting tension across consecutive chapters produces reader fatigue and degrades the
impact of the genuine high-tension moments. The `humourPlacementMap` and the chapter
`dominantRegister` history together enforce rhythmic variation.

**Rule:** If the immediately preceding chapter's dominant emotional register was
`high-tension` or `pre_climax` or `climax`, the current chapter's obligation block must
include a required tonal floor:

> "At least one exchange or domestic moment in this chapter must be non-tense before the
> investigation resumes. This chapter's opening register is [derived from arcPosition] —
> do not open in the same tonal key as the previous chapter."

The tonal floor instruction is generated by comparing the preceding chapter's registered
arc position against the current chapter's arc position. If both are `pre_climax` or
both are `mid`, the contrast instruction fires. If the current chapter is `resolution` or
`early`, the instruction is suppressed (those arc positions already imply lower tension).

**Humour as the relief valve:**  
When the `humourPlacementMap` entry for the current arc position resolves (see §3.3)
and its `humourPermission` is `allowed` or `encouraged`, the contrast instruction is
replaced with the specific humour framing from `permittedCharacters` and `permittedForms`. This is more precise than a generic tonal
note — it tells the prose LLM exactly which character may provide the relief and what form
it should take (dry observation, procedural absurdity, polite savagery, etc.).

**Current implementation status:** The preceding chapter's dominant register is not yet
tracked in `NarrativeState`. The `humourPlacementMap` is already injected per arc
position. Full tonal-contrast enforcement is planned as part of the Asset Library
implementation.

---

## 4. Asset Tracking

Asset tracking answers a single question at every chapter assembly point: which atoms
are still eligible for deployment? This keeps obligation atoms from being re-issued after
they have been satisfied, and keeps texture atoms within their per-chapter budget ceilings.

> **Implementation status:** The live obligation system (`validateChapterPreCommitObligations`,
> `ChapterRequirementLedgerEntry`, `updateNSD`) already tracks clue delivery and pronoun
> continuity. The full `deployedAssets` ledger described in §4.1–§4.5 is **not yet
> implemented** — it is the design specification for the Asset Library build.

### 4.1 NarrativeState.deployedAssets

A new field is required in `NarrativeState`:

```typescript
deployedAssets: Record<string, number[]>;
// Map from atom ID → list of chapter numbers where the atom was delivered.
// Example: { "era_social_001": [3, 11], "sensory_sound_003": [7] }
```

At chapter assembly the selector queries this map to enforce two rules:

| Rule | Applies to | Logic |
|---|---|---|
| **Single-use suppression** | obligation atoms | if `deployedAssets[id].length >= 1` → exclude from this chapter's candidate set |
| **Budget suppression** | texture atoms | if `deployedAssets[id].length >= atom.budget` → exclude from candidate set |

`budget` is defined on each atom at library-build time (see §2.3 `Asset.budget`). It
defaults to 1 for obligation atoms and to the type-level budget ceiling for texture atoms.

### 4.2 Obligation tracking (deterministic)

Obligation-class atoms (clue seedings, break moment, season vocabulary anchors, first
character impression) do not require prose scanning to confirm delivery. Their
presence is enforced by `validateChapterPreCommitObligations()` — a chapter only
advances past the validation gate when all hard obligations for that chapter number pass.

Therefore: when a chapter clears its gate, every obligation atom assigned to that chapter
number is stamped as delivered by adding the chapter number to `deployedAssets[id]`.
No LLM introspection is needed and there are no false negatives.

`NarrativeState` has a `cluesRevealedToReader[]` slot and `buildNSDBlock()` injects it
into each chapter's prompt when populated. However, the `CLUES ALREADY REVEALED` line
in NSD prompts stays empty at runtime — it is an **unfed slot**, not a live tracker.
The reason is architectural: `generateProse()` builds NSD prompts from `liveNarrativeState`
(an internal deep copy), and the `liveNarrativeState` update after each committed batch
calls `updateNSD({ paragraphs })` only. The orchestrator's `onBatchComplete` does pass
`cluesRevealedIds` to `updateNSD()` — but to the orchestrator's separate copy of
`narrativeState`, not to `liveNarrativeState`. The two copies are never synchronised
within a single `generateProse()` call (see §6.1). Closing this gap is part of the
Asset Library integration: once `deployedAssets` is live, `cluesRevealedIds` will also
be fed into `liveNarrativeState` at batch commit, enabling the duplicate-reveal guard in
`buildNSDBlock()` to fire correctly.

### 4.3 LLM self-report for texture atoms

Texture atoms are advisory — the LLM may or may not weave them into the prose in a
recognisable form. There is no reliable way to determine deployment by scanning for token
presence alone (many atoms express as mood or rhythm rather than explicit vocabulary).

The tracking mechanism is an LLM self-report instruction appended at the end of each
chapter prompt:

```
After writing the chapter, on a new line output exactly:
<used_assets>ATOM_ID_1,ATOM_ID_2,...</used_assets>
List only the optional texture atom IDs you drew from in writing this chapter.
Obligation atom IDs (clue seedings, break moment, etc.) are tracked automatically —
do NOT list them here.
```

The pipeline layer:
1. Parses the `<used_assets>…</used_assets>` tag from the raw LLM response.
2. Strips the tag before storing the chapter prose (it must never appear in the output).
3. For each reported ID, appends the chapter number to `deployedAssets[id]`.

**Fallback rule:** only the `<used_assets>` tag from the committed (passing) generation
is recorded. Self-reports from failed retry attempts are discarded along with the rest of
the failed response. If the committed response's tag is missing or empty, no texture atoms
are stamped as deployed for that chapter — they remain in the pool for future chapters.
This is consistent with the commit-on-success pattern described in §4.5 and requires no
separate fallback accounting.

Self-report accuracy for texture atoms is acknowledged as imperfect. Minor over-counting
or under-counting at the texture level is acceptable — texture atoms are enrichment, not
correctness gates.

### 4.4 Asset library diagnostics

After story completion, the pipeline emits a per-story asset diagnostic report:

**Never-deployed atoms**  
`deployedAssets[id]` is empty for these atoms. This indicates the story consumed fewer
atoms of that type than expected. Signals:
- Review the per-type budget ceiling — may be set too high relative to chapter count
- Review generation density for that atom type — too many atoms from the source agent
  may dilute quality (e.g. 20 era-register fragments where 8 would be richer)

**Overdeployed atoms**  
`deployedAssets[id].length > atom.budget`. This indicates the LLM deployed an atom
more times than prescribed, or self-report over-counted. Signals:
- Check whether the atom has a clear `budget` set in the library definition
- Check whether the selector is correctly suppressing at-budget atoms before injection
- For chronic overdeployment of a specific atom, inspect whether the LLM is genuinely
  repeating content or whether the self-report tag is being generated for every chapter

**Per-type breakdown**  
The diagnostic report groups findings by atom type (era_social, sensory_sound, voice_fragment,
etc.) so systemic imbalances are visible: e.g. all era_social atoms underdeployed suggests
the word budget is not large enough to consistently absorb atmospheric enrichment alongside
obligations.

### 4.5 Retry and resume durability

The Asset Library (atom definitions) is entirely deterministic from pre-prose inputs. Given
the same outputs from Agents 2–6.5, the same library will be reconstructed. It is never
stored in `NarrativeState` and never written to the database — it is always re-derived.

Only `deployedAssets` is mutable across the chapter run. This has two practical benefits:

**Retry protocol** — `deployedAssets` (like the existing `liveNarrativeState`) is written
only after a batch passes all validation gates. Failed retry attempts `continue` the inner
loop without touching state, so no explicit rollback is required: the batch either never
committed, or the commit path has not been reached. Obligation atoms assigned to chapter N
naturally remain available for the retry because the ledger has not advanced. This is the
same "commit on success only" pattern already used for `continuityTail`.

**Resume from checkpoint** — if a run is interrupted mid-story, the orchestrator reloads
`NarrativeState` (including `deployedAssets`) from the last saved checkpoint and continues
from the correct chapter. Because the atom definitions can be rebuilt deterministically,
only the NarrativeState checkpoint needs to be stored to resume correctly.

---

## 5. Chapter Prompt Assembly

Each chapter batch is driven by a three-message prompt (`system` / `user` / `user`
checklist) assembled in `buildProsePrompt()`. This section documents what goes in each
message and how token budget pressure resolves conflicts between blocks.

### 5.1 Context block priority stack

The system message (`composedSystem`) is assembled by `applyPromptBudgeting()` as:

```
baseSystem  +  [token-budgeted context blocks]  +  PROMPT BUDGET SUMMARY  +  developerWithContracts
```

`baseSystem` is the fixed role statement, cast name rules, and base prose rules.
`developerWithContracts` is the LLM instruction block: JSON output schema, word count
contract, novel-quality prose requirements, quality guardrails, and CML prose
requirements. These two poles never change size; everything between them is subject to
the **6,200 token total budget**. The fixed tokens (base + developer + user message) are
computed first; the remainder is the available window for context blocks.

Blocks are defined in `buildPromptContextBlocks()` in the order shown below, which is
also the order they are concatenated into the system message. The drop logic
(`optional → medium → high`) is independent of this sequence — within a priority tier,
blocks are retained from the top of this list downward.

| # | Block | Priority | Per-block cap | Content summary |
|---|---|---|---|---|
| 1 | `pronoun_accuracy` | critical | 700 tok | 9-rule pronoun contract + canonical table |
| 2 | `character_consistency` | critical | — | Name authenticity + invented-name forbidden rules |
| 3 | `world_document` | high | — | Full World Document brief (see §5.4) |
| 4 | `character_personality` | high¹ | 1,400 tok | Character psychology, voice sketches, motives |
| 5 | `physical_plausibility` | high | — | Era physics and movement constraints |
| 6 | `era_authenticity` | high | — | Era authenticity rules |
| 7 | `location_profiles` | medium | 1,000 tok | Location data (prose paragraphs stripped) |
| 8 | `temporal_context` | high | 850 tok | Season, fashion, cultural touchstones |
| 9 | `locked_facts` | critical | — | Verbatim evidence phrase table |
| 10 | `clue_descriptions` | critical | — | Full clue objects for this chapter's scenes |
| 11 | `narrative_state` | critical | — | NSD block: locked facts, pronouns, clues revealed, victim state |
| 12 | `continuity_context` | medium | 500 tok | Rolling chapter summaries (chapter 2+) |
| 13 | `discriminating_test` | critical | — | Discriminating test checklist (chapter ≥70% only) |
| 14 | `humour_guide` | optional | 850 tok | Humour style guide (first to be dropped) |
| 15 | `craft_guide` | high | 850 tok | Whodunnit craft guide (emotional depth principles) |
| 16 | `scene_grounding` | critical | — | Scene grounding checklist |
| 17 | `provisional_scoring_feedback` | critical | — | Internal quality diagnostics from prior batches |

¹ `character_personality` is elevated to `critical` when any cast member uses they/them pronouns.

**Craft guide history:** The craft guide was at `optional` priority (RC-2 in ANALYSIS_50)
and was regularly dropped on large casts. Fix D2 promoted it to `high`. It is therefore
never dropped except as a last resort before critical blocks are threatened.

Between the context block section and the developer instructions, `applyPromptBudgeting()`
inserts a `PROMPT BUDGET SUMMARY` line reporting total budget, fixed tokens consumed,
block tokens used, and which blocks were dropped or truncated. The LLM therefore sees,
immediately before its instructions, exactly which context it received and what was
omitted — intentional signalling about completeness.

### 5.2 The obligation contract

The first user message carries three components: the chapter obligation contract, the
timeline state block, and the context summary.

**Chapter obligation contract** (`buildChapterObligationBlock`) — per chapter in the batch:

- **Word count target** — the precise word target for this chapter (based on
  `targetLength`), with an explicit 200-word-per-concrete-event requirement to prevent
  atmospheric padding.
- **Location anchor** — the canonical scene location must appear in the opening
  paragraph.
- **Clue obligations** — each clue ID in `scene.cluesRevealed[]` produces a mandatory
  prose element. For `placement: 'early'` clues the contract specifies a mandatory
  two-paragraph structure: (1) the POV character physically observes the evidence; (2) an
  immediately following paragraph in which the detective explicitly reasons from it. Both
  paragraphs must appear in the first 25% of the chapter.
- **Tonal contrast** — at least one beat of relief or ironic counterpoint required,
  unless the chapter is the discriminating test chapter.
- **Suspect clearance** — when `cmlCase.prose_requirements.suspect_clearance_scenes`
  assigns a clearance to this act/scene, the named method must be dramatised.
- **Discriminating test flag** — when this chapter's act+scene matches the discriminating
  test scene, an explicit "dramatise, do not summarise" instruction is injected.
- **Locked fact phrases** — up to 8 locked facts are listed; if referenced, verbatim
  phrase required.
- **Seasonal vocabulary** — the derived season's allow-list and the three forbidden
  season words.

> **Asset Library integration (planned):** The obligation contract will also carry first-impression portrait obligations and break moment obligations (§3.5 window). These are currently planned, not yet injected from this function.

**Timeline state block** (`buildTimelineStateBlock`) — appended to the user message:

- Season + month anchor  
- Up to 5 established timeline facts from `constraint_space.time.anchors`  
- Time-sensitive locked fact phrases (filtered to time/clock/hour-related facts)

**Context summary** (`buildContextSummary`) — third component of the user message:

- Title, era, setting, crime class, culprit identity, victim name
- Full cast with inline pronoun annotation `(she/her)` / `(he/him)` / `(they/them)`
- Non-binary cast reminder injected again at this position (proximal to generation)
- Setting lock (no drift to a different location type)
- Motive lock (culprit's `motive_seed` value, must remain consistent)

**Outline scenes JSON** — appended directly to the `user` string after `buildContextSummary()`
returns, under the heading `Outline scenes:`. The scenes array is first passed through
`sanitizeScenesCharacters()` (strips any non-cast character names from `characters[]`,
`summary`, `title`, `purpose`, and `dramaticElements` fields) and `estimatedWordCount`
is clamped to `chapterTargetWords` via `Math.max()` before serialisation.

### 5.3 The texture pool

The "texture pool" concept from §2.4 — optional enrichment drawn from as needed — is
currently realised by two medium-priority and one optional block in the system message:

**`location_profiles` (medium)** — full location data with sensory details, atmosphere,
and era markers, minus pre-written prose paragraphs (stripped to prevent verbatim
transcription). The LLM can draw from sensory arrays when reaching word count via
non-plot content.

**`temporal_context` (high)** — season, fashion, cultural entertainments, social
attitudes, prices. The primary source for period-specific texture when no specific era
atom is assigned to the chapter.

**`humour_guide` (optional)** — the humour style guide with all approved forms,
forbidden contexts, and the detective voice rules. First block dropped under token
pressure. When dropped, the humour placement map entry (in `world_document`) still
constrains permission and form.

The `character_personality` block carries voice sketches, fragments, and psychological
profiles for the full cast — effectively acting as the character atom pool before
per-chapter scoping is implemented. At `high` priority (1,400 token cap) it is almost
always present; the cap can truncate lower-priority characters' entries if the cast is
large.

> **Asset Library integration (planned):** Once the Asset Library is live, the texture
> pool becomes chapter-scoped (only active characters and locations injected), per-atom
> budgeted, and self-reported via `<used_assets>` tags (§4.3). The current implementation
> injects all profiles at full width every chapter.

### 5.4 The standing arc frame

`buildWorldBriefBlock()` composes the `world_document` context block. This is the largest
single block in the prompt and the primary creative brief. It contains, in order:

1. **Era register** — heading `## Era: {historicalMoment.specificDate}` + `historicalMoment.eraRegister` body (200–300 words)
2. **Emotional register of the era** — `historicalMoment.emotionalRegister` (one sentence)
3. **Physical constraints** — `historicalMoment.physicalConstraints[]` (up to 4; inline)
4. **Current tensions** — `historicalMoment.currentTensions[]` (up to 3; with "weave into background texture" instruction)
5. **Wartime service context** — `historicalMoment.wartimeServiceContext` (when present)
6. **Season Lock** — `## Season Lock (mandatory — derived from {specificDate})`; derives canonical season from the month name in `specificDate`; injects season name, vocabulary allow-list, and forbidden seasonal words with an absolute prohibition on off-season terms. This is `[WORLD FIX A]` — the canonical temporal contract. It lives inside the `world_document` block at `high` priority and cannot be independently dropped.
7. **Story theme** — `storyTheme` one-sentence anchor
8. **Story emotional arc** — `storyEmotionalArc.dominantRegister` label
9. **Chapter arc register** — the `turningPoints[]` entry matching the derived arc position (see §3.1); provides `tp.emotionalDescription` for this specific chapter
10. **Ending note** — `storyEmotionalArc.endingNote` (only at chapter ≥75%)
11. **Character portraits** — physical portrait + `eraIntersection` per character
12. **Character voices** — `voiceDescription` + up to 3 `fragments[]` across registers + `humourNote`; heading carries inline pronoun annotation `(he/him)` / `(she/her)` / `(they/them)` via `characterPronouns` parameter
13. **Location registers** — `emotionalRegister` + `cameraAngle` + `eraNote` per location
14. **Humour placement map** — single entry for the current arc position (see §3.3)
15. **Break moment** — when chapter is in the 60–85% story-position window (see §3.5)
16. **Reveal implications** — only at chapter ≥75% (see §3.4)

All of this arrives as one `high`-priority block, capped by the overall 6,200 token
budget rather than a per-block ceiling. The story emotional arc (`storyEmotionalArc.dominantRegister`)
and the per-chapter turning point (`tp.emotionalDescription`) are the emotional blueprint
the LLM draws on for every chapter. The Season Lock (item 6 above) is the canonical
temporal contract — co-located here so it cannot be dropped independently of the world context.

> **Known gap:** `storyEmotionalArc.arcDescription` (§1.10 — 300–400 word emotional blueprint
> for the story) is defined in the World Document schema and generated by Agent 6.5, but
> `buildWorldBriefBlock()` does not inject it. Only `dominantRegister` (a short label) and
> the per-chapter `tp.emotionalDescription` reach the LLM. Injecting `arcDescription` as a
> persistent high-priority beat inside `world_document` is planned as part of the Asset Library
> build (see §3.1 `chapterNumber` bullet).

### 5.5 Suspicion budget instruction (early chapters)

**Not yet implemented.**

The intended design: through chapter N (derived from `castSize`), no single suspect may
receive more than `(1/castSize + 10%)` of total suspicion signals. This counteracts
culprit-knowledge bias — because the LLM knows the culprit from `buildContextSummary`,
it naturally concentrates suspicion on them in early chapters.

The suspect clearance mechanism (`suspect_clearance_scenes` in `cmlCase.prose_requirements`)
provides a partial offset for specific scenes, but there is no general early-chapter
suspicion-spreading instruction. Adding one is planned as part of the chapter obligation
contract.

### 5.6 Continuity context (chapter 2+)

After each batch commits, `extractChapterSummary()` builds a `ChapterSummary` object
from the completed chapter:

```typescript
interface ChapterSummary {
  chapterNumber: number;
  title: string;
  charactersPresent: string[];
  settingTerms: string[];
  keyEvents: string[];
}
```

These accumulate in `chapterSummaries[]` across the run. From chapter 2 onward, the
full array is passed to `buildProsePrompt()` and injected as the `continuity_context`
block at medium priority (500 token cap). The block gives the prose LLM a rolling
précis of what has happened, who has appeared, and what setting terms have been used,
so it can maintain naming and location consistency without relying on long-term
inference across the full prior prose text.

**Token cap:** The 500 token cap means approximately 4–6 chapter summaries fit in full.
On longer stories the oldest chapters are truncated from the beginning of the string when
the budget fires. This is intentional — recent chapters matter more for continuity than
chapters from 10 batches ago.

**Checklist message** — after the user JSON message, a third message carries a structured
pre-output checklist the LLM must self-verify before generating:
- Word count hard floor check (per chapter)
- Locked fact verbatim check
- Seasonal vocabulary check
- Early clue placement checks (one item per early-placement clue in this batch)
- Pronoun audit table (per character with canonical vs draft column; fill-in format)
- "Return valid JSON only."

The checklist is stripped from outputs by the parser and never stored.

---

## 6. NarrativeState — The Mutable Story Record

NarrativeState threads through all chapter batches, carrying invariants that must not
be re-derived per chapter. It is the only run-scoped mutable object; everything else
(atom definitions, validation rules, prompts) is stateless or reconstructible.

**Lifecycle:**
1. Initialised in the mystery orchestrator (`agent9-run.ts`) before the first prose call
   via `initNarrativeState(lockedFacts, characterGenders)`
2. Injected into `ProseGenerationInputs` as `narrativeState`
3. `buildNSDBlock()` formats `liveNarrativeState` (the internal copy — see below) into
   the system prompt for every chapter batch (as the `narrative_state` critical-priority
   context block — #11 in §5.1)
4. After each committed batch: `updateNSD()` advances `liveNarrativeState.continuityTail`
   inside `generateProse()`; the orchestrator's `onBatchComplete` independently advances
   the orchestrator's `narrativeState.cluesRevealedToReader` (the two copies are not
   synchronised within a single `generateProse()` call — see §6.1)

On entry to `generateProse()`, the caller's `narrativeState` is deep-copied into
`liveNarrativeState` (each array and record re-spread explicitly), insulating the
caller's copy from any within-call mutations.

### 6.1 Current fields

The live `NarrativeState` interface (`packages/prompts-llm/src/types/narrative-state.ts`):

```typescript
interface NarrativeState {
  version: 1;
  lockedFacts: LockedFact[];              // verbatim physical evidence values
  characterPronouns: Record<string, string>; // name → "he/him/his" | "she/her/her" | "they/them/their"
  cluesRevealedToReader: string[];        // clue IDs already surfaced to reader
  continuityTail: string;                 // last paragraph of most recent chapter (opening hook)
  victimConfirmedDeadChapter?: number;    // chapter where victim death confirmed on-page
}

interface LockedFact {
  id: string;
  value: string;       // verbatim physical evidence phrase
  description: string; // human-readable label
  appearsInChapters?: string[];
}
```

**`updateNSD()` — what advances at batch commit:**

```typescript
updateNSD(current, { paragraphs, cluesRevealedIds })
```

`updateNSD()` is called at two separate sites with different arguments:

- **Internal to `generateProse()`** (`agent9-prose.ts` line 4039): called after each
  committed batch with only `{ paragraphs }`. Advances `continuityTail` to the last
  paragraph of the batch's final chapter. `cluesRevealedIds` is not passed.
- **Orchestrator `onBatchComplete`** (`agent9-run.ts`): called after each committed batch
  with both `paragraphs` and `cluesRevealedIds` (sourced from
  `outline.scenes[n].cluesRevealed[]` for the batch's scene range). Updates the
  orchestrator's `narrativeState` copy.

The NSD injection for chapter prompts uses `liveNarrativeState` — an internal deep copy
made once at the start of `generateProse()`. Because `generateProse()` is called as a
single unit for the entire prose phase, the orchestrator's `cluesRevealedToReader`
updates from `onBatchComplete` never feed back into `liveNarrativeState`. As a result,
the `CLUES ALREADY REVEALED` line in the NSD injection is always empty during the main
prose pass. See §4.2 (unfed slot).

`lockedFacts`, `characterPronouns`, and `victimConfirmedDeadChapter` are never mutated
by `updateNSD()`. They are set at initialisation (locked facts, pronouns) or by a
separate setter (victim chapter — see §6.3).

**`buildNSDBlock()` — injection format:**

```
═══ NARRATIVE STATE (read-only — do not contradict) ═══

LOCKED FACTS — use verbatim whenever this evidence is described:
  • {fact.description}: "{fact.value}"

CHARACTER PRONOUNS — never deviate from these:
  • {name}: {pronouns}

CLUES ALREADY REVEALED TO READER: clue_id_1, clue_id_2 — do not reveal these as new information.

VICTIM STATE: The victim's death was confirmed on-page in Chapter N.
Do not treat the victim as alive or ambiguous in any subsequent chapter.
═══════════════════════════════════════════════════════
```

`CLUES ALREADY REVEALED` and `VICTIM STATE` lines are conditional — omitted when the
respective arrays/field are empty or unset.

### 6.2 New fields (Asset Library integration)

Three new fields are required for the Asset Library build. None are currently in the
`NarrativeState` interface — they are the design specification:

```typescript
// Planned additions — not yet implemented
deployedAssets: Record<string, number[]>;
// Map from atom ID → list of chapter numbers where the atom was delivered.
// Initialised to {} at generation start; advanced at batch commit.
// Fully specified in §4.1.

lastUsedSensoryVariantPerLocation: Record<string, string>;
// Map from location ID → variant ID used on the most recent visit.
// Prevents identical sensory palettes on consecutive visits to the same location.
// Read by §3.2 selection step; written at batch commit for each location that had
// a primary scene in that batch.

dominantRegisterHistory: string[];
// Arc position label for each committed chapter, index 0 = chapter 1.
// e.g. ["opening", "early", "early", "first_turn", ...]
// Read by §3.6 tonal contrast logic to compare the preceding chapter's
// register against the current chapter's; written at batch commit.
```

`internalMonologueBeatsUsed` (in the §6.2 TODO comment in earlier doc drafts) is
superseded by `deployedAssets` — character internal-conflict atoms are tracked by their
atom IDs in the same ledger and do not need a separate field.

### 6.3 Victim state lock

**Status: partially implemented — guard live, setter latent.**

The injection path is complete: `buildNSDBlock()` emits:

> `VICTIM STATE: The victim's death was confirmed on-page in Chapter N. Do not treat the
> victim as alive or ambiguous in any subsequent chapter.`

when `victimConfirmedDeadChapter !== undefined` (line 1526 of `agent9-prose.ts`).

However, `victimConfirmedDeadChapter` is **never assigned**. `updateNSD()` does not set
it, and `onBatchComplete` in `agent9-run.ts` does not detect the victim confirmation
chapter and write it to `narrativeState`. The feature is latent dead code
(ANALYSIS_50 § "Bug A2").

**To make it live:** in `onBatchComplete`, after `updateNSD()` runs, scan each committed
chapter's paragraph text for victim-death confirmation signals (body discovery, confirmed
death statement), detect the first chapter where this occurs, and set
`narrativeState.victimConfirmedDeadChapter = chapterNumber` if not already set.

The victim name is available from `resolveVictimName(cast)` (already used at line 2112 of
`agent9-prose.ts`). The confirmation scan can match on the victim's name within 2–3
sentences of a death-confirmation verb (`was found dead`, `had been killed`, `confirmed
dead`, `murder of`, `body of`).

### 6.4 Investigation milestone tracking

**Not yet implemented.**

The planned design (ANALYSIS_50 §A4) tracks the lifecycle stage of each clue across the
investigation:

```
observed → examined → corroborated → used
```

- **Observed:** detective or POV character notices the evidence item (the clue is
  surfaced)
- **Examined:** a chapter of deliberate inspection or discussion of the evidence occurs
- **Corroborated:** a second piece of evidence or witness testimony validates it
- **Used:** the clue is drawn upon in the discriminating test or resolution chapter

Without milestone tracking, the detective can re-discover the same piece of evidence in
each chapter and the generation system has no way to detect or prevent it. This produces
the "re-discovery loop" defect: a footprint or stained glove is noticed fresh in chapters
3, 7, and 14 with no acknowledgement that it had been seen before.

**Implementation path:**

A `clueLifecycle` field in `NarrativeState` is the natural home:

```typescript
clueLifecycle: Record<string, 'observed' | 'examined' | 'corroborated' | 'used'>;
// Map from clue ID → highest stage reached.
```

Stage transitions would be written at batch commit by analysing committed chapter prose
against known clue IDs and keywords. `buildNSDBlock()` would then inject the current
stage for each active clue, replacing or augmenting the existing `cluesRevealedToReader`
injection with richer state:

```
CLUE STATUS:
  • clue_id_001 (stained glove): observed in chapter 3 — do not re-discover; treat as
    established evidence.
  • clue_id_002 (torn letter): examined in chapter 7.
```

This gates promotion-to-obligation in the discriminating test: only clues that have
reached `examined` or above are eligible to drive the logical-deduction sequence.

---

## 7. The Golden Age Quality Standard

This section defines what "good" looks like and how the pipeline architecture is
designed to produce it.

### 7.1 The Christie benchmark

A Golden Age mystery of the Christie quality has these characteristics, which map
directly to the mechanisms in this pipeline:

| Quality | What produces it |
|---|---|
| Every character feels like a person, not a function | `privateLonging`, `internalConflict`, `eraIntersection`, `physicalMannerisms` deployed at the right moment |
| The setting is specific and changes | `sensoryVariants[]` rotated per visit, `eraMarkers` injected as location texture |
| You can hear each character's voice | Register-matched voice fragments, `speechMannerisms` atoms deployed across chapters |
| The era is a presence, not a backdrop | `eraRegister` atoms rotated, `currentTensions`, `wartimeServiceContext` woven as background texture |
| The emotional register rises, dips, rides | `arcDescription` as standing frame; `turningPoints` as per-chapter beat; `breakMoment` as pre-planned human low |
| The humour emerges from character, not performance | `humourPlacementMap` gates; character `humourStyle` + `humourLevel`; wit as character revelation |
| The reveal feels earned, not arbitrary | `revealImplications` seeds planted in early chapters; `inference_path` clues surfaced at correct moments |
| You can re-read and see what you missed | `false_assumption` woven through early character framing; `revealImplications` seeding in plain sight |
| The story is about something, not just someone | `storyTheme` as a standing one-sentence anchor in the world brief (§5.4 item 7) |

### 7.2 Show-don't-tell at the prompt level

Generic emotional declaration ("Cavendish was nervous") produces flat prose regardless
of how good the outline is. The prompt architecture replaces declaration with three
layers of behavioural instruction.

**Layer 1 — Physical tells from character profiles:**  
`physicalMannerisms` (Agent 2b profile field) is injected as:

```
Physical tells (deploy one per scene, not all at once): {text}
```

The "one per scene" instruction prevents the LLM from listing traits rather than weaving
them. The field describes a character's habitual body language under stress — small
actions that make the emotional state visible without naming it.

**Layer 2 — Era intersection from world portraits:**  
`eraIntersection` (Agent 6.5 world document, `characterPortraits[]`) is injected
alongside the character's physical portrait in the world brief block:

```
Era intersection: {text}
```

It anchors internal conflict in period-specific social constraint — the detail that makes
a character's nervousness feel like *their* nervousness in *this* world, not a generic
emotional signal. Where `physicalMannerisms` gives the action, `eraIntersection` gives
the context that makes the action meaningful.

**Layer 3 — Developer rules:**  
The `developer` block carries a hard `SHOW, DON'T TELL` rule with verbatim examples:

```
❌ "She was nervous."
✓  "Her fingers twisted the hem of her glove, the silk threatening to tear.
    A bead of perspiration traced down her temple despite the cool morning air."
```

This rule fires for every chapter prompt. It is reinforced by the craft guide block
(injected from `WHAT_MAKES_A_GOOD_WHODUNNIT.md` when `writingGuides.craft` is loaded),
which ties the principle to emotional depth: "Add micro-moments that create texture —
a suspect making tea too slowly, a trembling hand lighting a cigarette."

The net effect: the LLM has a positive-example model in the developer rule, a character
body-language vocabulary in `physicalMannerisms`, and a period specificity anchor in
`eraIntersection`. Three distinct vectors pushing away from emotional summary.

---

### 7.3 Humour as structure

Golden Age humour is not decoration. Every humorous moment must serve at least one of:
hide information, reveal character, control pacing, provide tonal contrast, expose
social truth, or sharpen the final reveal. If it does none of these, it is cut.

The pipeline enforces this through two independent systems that work together.

**System 1 — The humour guide block (story-level):**  
`buildProsePrompt()` injects a `HUMOUR & WIT GUIDELINES` block when
`inputs.writingGuides.humour` is loaded. This block contains the five approved styles
with real examples:

| Style | Mechanism | Prompt example |
|---|---|---|
| Understatement | Increases seriousness by pretending not to | *"The evening deteriorated somewhat after the stabbing."* |
| Dry observational wit | Humour from human behaviour | *"Everyone preferred harmony. This required extensive dishonesty."* |
| Polite savagery | Civility + verbal incision | *"He was devoted to principle." "His own."* |
| Character-driven contrast | Friction between worldviews | Literal detective vs dramatic aristocrat — never farce |
| Precision cruelty | Short, exact, devastating | *"He had the moral backbone of warm custard."* Used rarely |

Five advanced techniques are also injected:
- **Puzzle camouflage** — humour lowers analytical guard; hide clues in jokes
- **Social X-ray** — expose class blindness, moral hypocrisy, respectability theatre
- **Detective voice** — rarely laughs, almost never banters; one devastatingly mild
  remark per major scene
- **Running gags as structure** — introduce casually, repeat, make central to the
  solution; reader reaction: Amusement → Recognition → Admiration
- **Emotional humour** — humour masking vulnerability; "He disliked arguments. They
  implied things might change."

Hard forbids in the same block: humour at the moment of corpse discovery, in physical
description of the dead, during genuine grief, in the core logical explanation.

**System 2 — Per-character humour specification (character-level):**  
`buildCharacterPersonalityBlock()` translates `humourStyle` and `humourLevel` (Agent 2b
profile fields) into per-character injection at exact frequency:

- `humourLevel >= 0.7` → "frequently witty"
- `humourLevel >= 0.4` → "occasionally witty"
- `humourLevel < 0.4` → "rarely witty"

Nine style descriptors are mapped (`understatement`, `dry_wit`, `polite_savagery`,
`self_deprecating`, `observational`, `deadpan`, `sardonic`, `blunt`, `none`), each with
a compact prose description of what that style produces in dialogue. Characters with
`humourStyle: none` receive the inverse instruction: "Play it straight. Their seriousness
provides contrast for wittier characters." The contrast gap is what generates the best
comedy.

**Arc gating via `humourPlacementMap`:**  
The world document (Agent 6.5) contains a `humourPlacementMap[]` keyed by arc position.
`buildWorldBriefBlock()` looks up the current chapter's arc position and injects the
matching entry, including `humourPermission` (`allowed` / `encouraged` / `discouraged`)
and `permittedCharacters`. This is intended to gate story-level rhythmic placement — the
two per-character systems above govern *how*, the map governs *when*. In practice the
lookup silently fails for approximately 75% of chapters due to an enum mismatch between
`humourPlacementMap` (uses `scenePosition` values) and `arcPosForHumour` (uses
`turningPoints` values); see §3.3 known implementation issue.

---

### 7.4 Tonal rhythm

Unrelenting tension across fourteen chapters flattens reader response. The pipeline uses
four interlocking mechanisms to enforce rhythmic variation.

**Mechanism 1 — `arcDescription` as the standing emotional frame:**  
`storyEmotionalArc.arcDescription` from the world document sets the overall emotional
shape of the story (see §5.4 — Known gap). It is planned but not yet
injected by `buildWorldBriefBlock()`.

**Mechanism 2 — `breakMoment` as the planned human low:**  
The `breakMoment` obligation atom (§3.5) is a manually authored scene instruction
delivered as a scene obligation between the 60% and 85% arc mark. It is not a tonal
suggestion — it is a hard obligation that fires when the chapter number falls in the
window. The instruction explicitly names participants and the form of relief. This is
the pre-planned breath in the architecture.

**Mechanism 3 — Humour rhythm injection:**  
The humour guide block (§7.3) carries a proportional rhythm rule injected into every
chapter prompt:

```
RHYTHM: Tension → Dry remark → Silence → Investigation resumes.
Never stack jokes. Never let humour dominate a scene.
Small, controlled, regular infusions.
BALANCE: For every 3 pages of investigation, insert 1 understated observation.
If readers would laugh loudly, it is too much. Aim for the quiet exhale through the nose.
```

This operates at the chapter level — every chapter regardless of arc position gets the
same proportional instruction.

**Mechanism 4 — Tonal contrast via `dominantRegisterHistory` (planned):**  
When `NarrativeState.dominantRegisterHistory` is implemented (§3.6, §6.2), the
orchestrator will compare the preceding chapter's arc position register against the
current chapter's. If both are `high_tension`, `pre_climax`, or share the same register
bucket, a tonal floor instruction fires:

> "At least one exchange or domestic moment must be non-tense before the investigation
> resumes. Do not open in the same tonal key as the previous chapter."

When the `humourPlacementMap` entry for the arc position is `allowed` or `encouraged`,
the tonal floor is replaced with the specific humour framing from that entry — a named
character and form of relief, not a generic instruction. Currently not implemented.

Together the four mechanisms enforce a rhythm that is architecturally planned at story
design time (arc, break moment, placement map) and imposed as a live rule at chapter
write time (humour rhythm injection, tonal contrast gate).

---

### 7.5 Voice differentiation

Voice differentiation is the compound result of three layers, each operationally
independent, all present in every character prompt block.

**Layer 1 — World document voice sketches (Agent 6.5):**  
`buildWorldBriefBlock()` injects `worldDoc.characterVoiceSketches[]` under `## Character
Voices`. Each sketch contains:
- `voiceDescription` — a prose paragraph characterising the character's overall speech
  register and manner
- `fragments[]` — up to 3 fragments shown (first 3 by array position); Agent 6.5 authors
  them to span registers (`comfortable`, `evasive`, `stressed`, `humorous`, `formal`) so
  the LLM can see range, not just the default mode
- `humourNote` — a per-character humour instruction, usually cross-referencing the style
  from Agent 2b

Each character heading in this block carries a pronoun annotation `(he/him)` /
`(she/her)` / `(they/them)` sourced from `NarrativeState.characterPronouns`, so voice
and pronouns are co-presented (Phase 1 change).

Register-matched fragment selection (§3.3 — planned) will restrict which fragments are
shown based on the chapter's dominant emotional register, so the voice skeleton presented
to the LLM is the right register for the scene, not the full multi-register set.

**Layer 2 — Character profile block (Agent 2b):**  
`buildCharacterPersonalityBlock()` injects each character's profile fields:

| Field | Instruction framing |
|---|---|
| `speechMannerisms` | "Voice & Mannerisms: {text}" |
| `humourStyle` + `humourLevel` | Style description + frequency label (§7.3) |
| `internalConflict` | "Internal Conflict: {text}" |
| `physicalMannerisms` | "Physical tells (deploy one per scene, not all at once): {text}" |
| `privateLonging` | "Private longing (let surface in 1–2 moments, never central): {text}" |
| `personalStakeInCase` | "Personal Stake in Case: {text}" (reference at least twice) |
| `motiveSeed` + `motiveStrength` | "Motive seed: {text} ({strength})" |
| `publicPersona` / `privateSecret` / `stakes` | Public/Hidden/Stakes framing |

The writing guidance in this block explicitly instructs:
- Each character should sound different — `speechMannerisms` shapes *how*, `humourLevel`
  shapes *how often*
- High-`humourLevel` characters deliver wit frequently; zero-humour characters play it
  straight; the **contrast** between them is the source of comedy
- A character's humour style reveals their psychology — `self_deprecating` masks
  insecurity, `polite_savagery` masks aggression, `deadpan` masks emotion

**Layer 3 — Active character filtering (planned):**  
The §9 status table marks "Active character/location filtering of portraits and voice
sketches" as not yet implemented. When live, this will restrict which characters' voice
information is injected per chapter to those actually present in the chapter's scenes,
reducing token consumption and sharpening focus.

---

## 8. Validation, Scoring, and Quality Feedback

### 8.1 Post-generation validation gates

After each chapter batch is received from the LLM, the orchestrator runs a sequence of
deterministic checks before committing any chapter. All gates must pass for the batch to
be accepted; any hard failure sends the batch back for a retry (§8.5).

**Gate 1 — Pronoun repair (pre-validation):**  
`repairChapterPronouns()` runs immediately after JSON parse. It corrects unambiguous
pronoun mismatches by applying a regex replacement over the chapter text using the cast's
canonical gender. This is a cheap deterministic pass that reduces the number of LLM
retries consumed on pronoun drift. It runs again after underflow expansion (§8.5) since
expansion is a full LLM rewrite.

**Gate 2 — Chapter structure check:**  
Raw structural validation: `chapter.title` must be a non-empty string; `chapter.paragraphs`
must be a non-empty array of strings. Triggered before content evaluation.

**Gate 3 — Content validation (`chapterValidator.validateChapter()`):**  
A suite of semantic and temporal consistency checks. Issues at `critical` or `major`
severity are hard failures. Includes:
- Scene-opening grounding (named location anchor + 2 sensory words + atmosphere marker)
- Season/month contradiction detection (off-season vocabulary against the canonical season
  lock from `specificDate`)
- Temporal consistency (era-specific anachronism detection)

**Gate 4 — Obligation pre-commit (`validateChapterPreCommitObligations()`):**  
Checks two hard requirements against the chapter text:
- **Word count floor** — computed against `hardFloorWords` from the chapter requirement
  ledger; a miss below the hard floor is a hard failure (below preferred but above floor
  is a preferred miss only, reported but not a retry trigger)
- **Required clue presence** — for each `requiredClueIds` entry in the ledger, checks
  that at least the tokenized key terms appear in the chapter text; for clues marked
  `placement: 'early'`, also checks that the content appears in the first 25% of
  paragraphs

**Gate 5 — Targeted pronoun check (post-evaluation):**  
After Gates 2–4 complete and after any underflow expansion (§8.5),
`pronounValidator.validate()` checks all sentences carrying pronouns against the cast's
canonical gender table. If `pronoun_gender_mismatch` issues are found, a second targeted
`repairPronouns()` call fires with `onlyNames` set to the flagged characters. A final
re-validation then runs; any residuals that survive both repair passes are unresolvable
and escalate as hard errors to the retry loop.

**Gate 6 — Anti-template linter (`lintBatchProse()`):**  
Runs after all per-chapter gates. Three checks:

| Check | Mechanism | Hard failure? |
|---|---|---|
| Opening style entropy | Shannon entropy across last N chapter opening sentences; if below adaptive threshold → fail | Yes (with bypass at final attempt — see §8.5) |
| Paragraph fingerprint | Exact normalized-paragraph deduplication against prior chapters | Yes |
| N-gram overlap | Jaccard similarity of 6-grams (configurable) against a bounded prior paragraph window; if ≥ configurable threshold → fail | Yes |

The entropy threshold adapts to story length: ≤6 chapters (0.62 lenient), ≤10 (0.70
moderate), >10 (0.70 strict).

---

### 8.2 Provisional chapter scoring

On every successfully parsed batch, each chapter receives a provisional quality score
(0–100) built from four components:

| Component | Weight | What it measures |
|---|---|---|
| Word density | 35% | `wordCount / preferredWords × 100`, capped at 100 |
| Paragraph structure | 20% | Paragraph count: ≥6 → 100, ≥5 → 93, ≥4 → 86, ≥3 → 76, <3 → 65 |
| Clue coverage | 25% | `matchedClues / requiredClues × 100` (100 when no clues required) |
| Content issue penalty | 20% | −18 per critical/major issue, −8 per minor, −5 per other; floored at 0 |

If any component falls below its ideal, `buildProvisionalChapterScore()` generates a
**deficit** label and a **directive** instruction. For example: a word count miss produces
"word density below preferred target (N/M)" with the directive "Increase chapter density
with concrete investigation action and sensory-grounded beats."

After each committed batch, deficits from scored chapters accumulate in
`rollingProvisionalFeedback` (capped at 4 entries). `formatProvisionalScoringFeedbackBlock()`
then renders the last 2 entries from that accumulator into the `provisional_scoring_feedback`
context block (priority: `critical`) for the next chapter's prompt. This means two
batches of quality signal are always visible ahead of the cursor, while the accumulator
retains a slightly wider window for the format function to draw from.

The block is wrapped with an isolation header:

```
[⚠ INTERNAL QUALITY DIAGNOSTICS — DO NOT REPRODUCE ANY PART OF THIS SECTION
IN YOUR STORY OUTPUT. These are private generator observations …]
```

— which prevents the LLM from echoing directive language into prose. The intended
effect: quality gaps in chapter N are named in chapter N+1's prompt so the model
compensates forward without explicit human intervention.

The provisional scoring block is diagnostic and advisory. It does not gate commit; only
the hard validators in §8.1 determine whether a chapter is accepted.

---

### 8.3 detectRecurringPhrases — from diagnostic to gate

`detectRecurringPhrases()` scans all committed chapters for 7-gram phrases (sequences
of 7 words) that appear in 3 or more distinct chapters. Content-word filtering (words
must be >3 characters and not in a stopword list; at least 3 content words per gram)
prevents stopword-dominated grams from triggering false positives. The function returns
up to 15 phrases sorted by chapter spread.

**Current status:** `detectRecurringPhrases()` is diagnostic only. Its output is
included in the end-of-run result (`provisionalChapterScores`) but does not feed into
the retry trigger or the provisional scoring penalty. Recurring phrases therefore persist
silently across the generated novel rather than triggering a corrective retry.

**Intended state:** The recurring phrase list should be fed as a banned-phrase addendum
into the next batch's prompt when any phrase crosses the 3-chapter threshold during the
generation run. This would function as a rolling anti-repetition gate analogous to the
paragraph fingerprint check (§8.1 Gate 6) but operating at the 7-gram level across the
whole story rather than the paragraph level across adjacent batches.

This integration is not yet implemented. The §9 status table records this as
"`detectRecurringPhrases` wired to retry/scoring: ❌ Not yet implemented."

---

### 8.4 Asset usage reporting

The Asset Library (§4.4) is not yet implemented, so end-of-run asset coverage reporting
is also not yet implemented. The intended design matches the three diagnostics described
in §4.4:

**Never-deployed atoms** — `deployedAssets[id]` empty after story completion. These
represent pre-story intelligence that never reached prose. A high count signals that the
per-type budget ceiling is too high or that the atom pool for that type is oversaturated.

**Overdeployed atoms** — `deployedAssets[id].length > atom.budget`. Indicates the LLM
used the atom more times than prescribed, or self-report accumulated false positives.
Signals a calibration problem in the budget field or the at-budget suppression logic.

**Per-type breakdown** — findings grouped by atom type (era_social, sensory_sound,
voice_fragment, etc.) so systemic imbalances are visible. For example: all era_social
atoms underdeployed suggests the word budget is not large enough to absorb atmospheric
enrichment alongside hard obligations.

Until the Asset Library is implemented, none of these diagnostics exist. The §9 status
table records this as "Asset usage end-of-run report: ❌ Not yet implemented."

---

### 8.5 Chapter retry logic

When a batch fails any hard gate in §8.1, the orchestrator re-runs the LLM call with
augmented retry feedback. The maximum attempt count is configurable
(`resolvedMaxAttempts`); the default is 4.

**Underflow expansion (pre-retry):**  
Before escalating to a full retry, if any hard failure is a word count below the hard
floor (even alongside other hard errors), or the chapter cleared all hard checks but is
still below the preferred word target, the orchestrator fires `attemptUnderflowExpansion()`
— a targeted single-call expansion prompt for that chapter only. The expansion prompt
carries clue placement obligations so it can simultaneously fix word density and
surfacing failures. If expansion resolves all remaining hard errors, the retry budget is
not consumed.

**Retry escalation:**  

| Attempt | What changes in the prompt |
|---|---|
| Attempt 1 | Base prompt (no retry context) |
| Attempts 2 to N−1 | `buildEnhancedRetryFeedback()` appended as a new `user` turn; the previous raw LLM response added as a prior `assistant` turn so the model edits rather than rewrites |
| Final attempt (N) | `buildEnhancedRetryFeedback()` appended as a new `user` turn; **no prior assistant turn** — the model rebuilds from scratch with a `REBUILD` directive |

`buildEnhancedRetryFeedback()` categorises the batch errors into typed buckets (clue
validation, pronoun, character/name, setting, discriminating test, word count, quality,
other) and generates targeted micro-prompt directives per bucket. For example:
- Missing clue → "Include an on-page observation of "{description}" in the first 2
  paragraphs … followed immediately by an explicit inference paragraph."
- Pronoun mismatch → character-specific pronoun reminder with canonical table
- Entropy failure → "Vary chapter openings; do not reuse the same structural opening pattern"

**Entropy-only bypass:**  
If the only remaining failure after all attempts is an opening-style entropy issue, the
final batch is accepted with a warning rather than aborting. This prevents a low-entropy
false positive from stopping a story that has passed all substantive content checks.

**Hard abort:**  
If a batch exhausts all attempts and still carries hard failures (excluding the
entropy-only exception above), the orchestrator throws with a structured error message
listing the first 5 failures and the total count. The error carries `retriedBatches` as
a property so the caller can report how many chapter batches required at least one retry.

---

## 9. Implementation Status

| Mechanism | Status |
|---|---|
| World document injection (`buildWorldBriefBlock`) | ✅ Implemented |
| Character personality block (`buildCharacterPersonalityBlock`) | ✅ Implemented |
| Location profiles with sensory variants as palette hints | ✅ Implemented |
| Season lock from `specificDate` | ✅ Implemented |
| `storyTheme` injection | ✅ Implemented |
| `arcDescription` injection | ❌ Not yet implemented |
| `eraMarkers` injection | ❌ Not yet implemented |
| Asset Library (atomic chunking) | ❌ Not yet implemented |
| `NarrativeState.deployedAssets` | ❌ Not yet implemented |
| Obligation-class asset tracking | ❌ Not yet implemented |
| LLM self-report for texture atoms | ❌ Not yet implemented |
| Active character/location filtering of portraits and voice sketches | ❌ Not yet implemented |
| Register-matched voice fragment selection | ❌ Not yet implemented |
| Sensory variant as scene obligation (vs hint) | ❌ Not yet implemented |
| Reveal implication seeding from chapter 3 (sanitised) | ❌ Not yet implemented |
| Pre-break signal injection (40–60% window) | ❌ Not yet implemented |
| Tonal contrast (preceding chapter register) | ❌ Not yet implemented |
| Victim state lock (`victimConfirmedDeadChapter` field + NSD injection) | ⚠️ Partially implemented — orchestrator setter not yet wired |
| `detectRecurringPhrases` wired to retry/scoring | ❌ Not yet implemented |
| Asset usage end-of-run report | ❌ Not yet implemented |

---

## Appendix A — Definitive Pre-Prose Field Reference

This appendix is the **exhaustive, structured reference** for every field that feeds
into prose generation. It is the lookup table for implementation and audit.

§1 explains *what each agent contributes and why*. This appendix answers a different
question: *for any given field, what is its source, how is it atomised, what priority
class does it belong to, which section of this document governs its use, and is it
currently injected?*

### How to read the table

| Column | Meaning |
|---|---|
| **Field** | Dot-path from the root of the source artifact (e.g. `historicalMoment.eraRegister`). `[n]` = array element. |
| **Agent** | Producing pre-prose agent number |
| **Atom class** | `standing-frame` = injected every chapter as background; `obligation` = required when scoped entity is active; `texture` = optional enrichment pool; `logic` = structural/constraint; `window` = gated by chapter position |
| **Chunking** | How many atoms this field produces (e.g. `4 atoms`, `1 per element`, `single`) |
| **Priority** | `critical` / `high` / `medium` / `lower` / `lowest` — position in the §5.1 context block priority stack |
| **Governs** | Cross-reference to the section(s) in this document that specify use |
| **Status** | ✅ injected / ⚠️ partial / ❌ not yet injected |

---

### A.1 World Document fields (Agent 6.5)

All fields below land in the `world_document` system-prompt block (§5.1 position 3, priority `high`). Arc position labels used for window-class fields: `opening` (ch ≤ 1), `early` (≤ 25%), `first_turn` (≤ 40%), `mid` (≤ 55%), `second_turn` (≤ 70%), `pre_climax` (≤ 80%), `resolution` (final ch), `climax` (otherwise). `relativePos = chapterIndex / totalChapters`.

| Field | Agent | Atom class | Chunking | Priority | Governs | Status |
|---|---|---|---|---|---|---|
| `historicalMoment.specificDate` | 6.5 | standing-frame | single | high | §§5.4, 3.1 | ✅ era heading label `## Era: {text}`; also derives Season Lock |
| `historicalMoment.eraRegister` | 6.5 | standing-frame | single | high | §5.4 | ✅ body text under `## Era` heading |
| `historicalMoment.emotionalRegister` | 6.5 | standing-frame | single | high | §5.4 | ✅ `Emotional register: {text}` |
| `historicalMoment.physicalConstraints[]` | 6.5 | obligation | up to 4 | high | §5.4 | ✅ pipe-separated list |
| `historicalMoment.currentTensions[]` | 6.5 | texture | up to 3 | high | §5.4 | ✅ "weave into background texture" label |
| `historicalMoment.wartimeServiceContext.serviceStatus` | 6.5 | standing-frame | single (conditional) | high | §5.4 | ✅ `Wartime context — {serviceStatus}: {socialTexture}` — conditional on field presence |
| `historicalMoment.wartimeServiceContext.socialTexture` | 6.5 | standing-frame | single (conditional) | high | §5.4 | ✅ same line as `serviceStatus` |
| `historicalMoment.wartimeServiceContext.absenceEffect` | 6.5 | texture | single (conditional) | high | §5.4 | ✅ ` Absence effect: {text}` appended when present |
| Season Lock (derived from `historicalMoment.specificDate`) | 6.5 | obligation | single | high | §§5.4, 3.1 | ✅ `## Season Lock` block — season name, allow-word list, 3 forbidden words. `[WORLD FIX A]` tag; cannot be dropped |
| `storyTheme` | 6.5 | standing-frame | single | high | §§5.4, 7.1 | ✅ `## Story Theme\n{text}` |
| `storyEmotionalArc.dominantRegister` | 6.5 | standing-frame | single | high | §5.4 | ✅ `## Story Emotional Register\nDominant: {text}` |
| `storyEmotionalArc.arcDescription` | 6.5 | standing-frame | single | high | §5.4 | ❌ not injected — known gap (§9 table) |
| `storyEmotionalArc.turningPoints[n].position` | 6.5 | logic | 1 per entry | high | §5.4 | ✅ arc-position lookup key; not rendered as content |
| `storyEmotionalArc.turningPoints[n].emotionalDescription` | 6.5 | window | position-matched single | high | §5.4 | ✅ `## Emotional register at this point in the story` — one position-matched entry per chapter |
| `storyEmotionalArc.endingNote` | 6.5 | window | single | high | §§5.4, 3.4 | ✅ `## Ending note` — only when `chapterIndex ≥ floor(totalChapters × 0.75)` |
| `characterPortraits[n].name` | 6.5 | obligation | 1 per character | high | §§5.4, 7.2 | ✅ `### {name}` section heading under `## Character Portraits` |
| `characterPortraits[n].portrait` | 6.5 | obligation | 1 per character | high | §§5.4, 7.2 | ✅ 80–120 word portrait body text |
| `characterPortraits[n].eraIntersection` | 6.5 | obligation | 1 per character | high | §§5.4, 2.5 | ✅ `Era intersection: {text}` |
| `characterVoiceSketches[n].name` | 6.5 | obligation | 1 per character | high | §§5.4, 7.5 | ✅ `### {name}` heading with pronoun annotation `({he/him})` from `NarrativeState.characterPronouns` |
| `characterVoiceSketches[n].voiceDescription` | 6.5 | obligation | 1 per character | high | §§5.4, 7.5 | ✅ full voice description block |
| `characterVoiceSketches[n].fragments[0..2]` | 6.5 | texture | first 3 (by array position) | high | §§5.4, 3.3 | ⚠️ first 3 shown; register-matching not yet implemented (§9) |
| `characterVoiceSketches[n].humourNote` | 6.5 | obligation | 1 per character | high | §§5.4, 7.3 | ✅ `Humour: {text}` |
| `locationRegisters[n].locationId` | 6.5 | logic | N/A | high | §5.4 | ❌ not injected — internal ID; `.name` used for output instead |
| `locationRegisters[n].name` | 6.5 | obligation | 1 per location | high | §5.4 | ✅ inline location name label |
| `locationRegisters[n].emotionalRegister` | 6.5 | obligation | 1 per location | high | §5.4 | ✅ `{name}: {emotionalRegister}. Camera angle: {cameraAngle}.` |
| `locationRegisters[n].cameraAngle` | 6.5 | obligation | 1 per location | high | §5.4 | ✅ same line as `emotionalRegister` |
| `locationRegisters[n].eraNote` | 6.5 | texture | 1 per location (conditional) | high | §5.4 | ✅ ` Era: {text}` appended when present |
| `humourPlacementMap[n].scenePosition` | 6.5 | logic | 1 per entry | high | §§5.4, 3.3 | ✅ arc-position lookup key; not rendered as content |
| `humourPlacementMap[n].humourPermission` | 6.5 | window | position-matched single | high | §§5.4, 7.3 | ✅ `Permission: {text}` under `## Humour guidance for this story position` |
| `humourPlacementMap[n].condition` | 6.5 | window | conditional single | high | §§5.4, 7.3 | ✅ `— condition: {text}` appended when present |
| `humourPlacementMap[n].permittedCharacters[]` | 6.5 | window | position-matched list | high | §§5.4, 7.3 | ✅ `Characters who may be funny: {list}` |
| `humourPlacementMap[n].permittedForms[]` | 6.5 | window | position-matched list | high | §§5.4, 7.3 | ✅ `Permitted forms: {list}` |
| `humourPlacementMap[n].rationale` | 6.5 | window | position-matched single | high | §§5.4, 7.3 | ✅ `Rationale: {text}` |
| `breakMoment.scenePosition` | 6.5 | logic | N/A | high | §§5.4, 3.5 | ✅ not rendered; window condition: `relativePos ∈ [0.60, 0.85]` computed from `chapterIndex / totalChapters` |
| `breakMoment.character` | 6.5 | window | single | high | §§5.4, 3.5, 7.4 | ✅ `## Character Break Moment` block — 60–85% relative-position window |
| `breakMoment.form` | 6.5 | window | single | high | §§5.4, 3.5, 7.4 | ✅ same window |
| `breakMoment.narrativeFunction` | 6.5 | window | single | high | §§5.4, 3.5, 7.4 | ✅ same window |
| `revealImplications` | 6.5 | window | single | high | §§5.4, 3.4 | ✅ `## Reveal Implications` — only when `chapterIndex ≥ floor(totalChapters × 0.75)` |

### A.2 Character Profile fields (Agent 2b)

All fields below land in the `character_personality` system-prompt block (§5.1 position 4). Block priority is `high` for binary-gender casts; elevates to `critical` when any cast member uses they/them pronouns. Block has a 1,400-token cap. The `paragraphs[]` output from the profiling step is never read — only the structured fields below are used.

| Field | Agent | Atom class | Chunking | Priority | Governs | Status |
|---|---|---|---|---|---|---|
| `publicPersona` | 2b | standing-frame | 1 per character | high¹ | §7.5 | ✅ `Public: {text}` |
| `privateSecret` | 2b | standing-frame | 1 per character | high¹ | §7.5 | ✅ `Hidden: {text}` |
| `stakes` | 2b | standing-frame | 1 per character | high¹ | §7.5 | ✅ `Stakes: {text}` |
| `motiveSeed` | 2b | logic | 1 per character | high¹ | §§7.5, 5.1 | ✅ `Motive seed: {text}`; culprit's entry also injected as `MOTIVE LOCK` in context summary |
| `motiveStrength` | 2b | standing-frame | 1 per character (conditional) | high¹ | §7.5 | ✅ appended to `motiveSeed` as `({strength})` when present |
| `humourStyle` | 2b | obligation | 1 per character | high¹ | §§7.3, 7.5 | ✅ style label + descriptive sentence in `Humour: {style} (level {level} — {frequency} witty). {desc}` |
| `humourLevel` | 2b | obligation | 1 per character | high¹ | §§7.3, 7.5 | ✅ derives frequency word: `frequently` (≥ 0.7), `occasionally` (≥ 0.4), `rarely` (< 0.4) |
| `speechMannerisms` | 2b | obligation | 1 per character | high¹ | §7.5 | ✅ `Voice & Mannerisms: {text}` |
| `physicalMannerisms` | 2b | texture | 1 per character | high¹ | §7.5 | ✅ `Physical tells (deploy one per scene, not all at once): {text}` |
| `internalConflict` | 2b | standing-frame | 1 per character | high¹ | §7.5 | ✅ `Internal Conflict: {text}` |
| `privateLonging` | 2b | texture | 1 per character | high¹ | §7.5 | ✅ `Private longing (let surface in 1-2 moments, never central): {text}` |
| `personalStakeInCase` | 2b | obligation | 1 per character (conditional) | high¹ | §7.5 | ✅ `Personal Stake in Case: {text}` when present |
| `paragraphs[]` | 2b | standing-frame | multiple | high¹ | §1.4 | ❌ not injected — raw prose paragraphs from profiling step; structured fields above are used instead |

¹ Block priority elevates to `critical` when any cast member uses they/them pronouns.

### A.3 Location Profile fields (Agent 2c)

All fields below land in the `location_profiles` system-prompt block (§5.1 position 7, priority `medium`, 1,000-token cap). `keyLocations[n].paragraphs[]` entries are explicitly stripped by `stripLocationParagraphs()` before injection to prevent context leakage of raw prose into generated output. Only the first 3 key locations feed the sensory palette per chapter.

| Field | Agent | Atom class | Chunking | Priority | Governs | Status |
|---|---|---|---|---|---|---|
| `primary.name` | 2c | standing-frame | single | medium | §§5.3, 3.2 | ✅ `Primary Location: {name}` heading |
| `primary.place` | 2c | standing-frame | single | medium | §5.3 | ✅ geographic context `{place}, {country}` |
| `primary.country` | 2c | standing-frame | single | medium | §5.3 | ✅ same line as `primary.place` |
| `primary.summary` | 2c | standing-frame | single | medium | §§5.3, 3.2 | ✅ body text under primary location heading (paragraphs stripped) |
| `keyLocations[n].name` | 2c | obligation | 1 per location | medium | §§5.3, 3.2 | ✅ in Key Locations list |
| `keyLocations[n].type` | 2c | obligation | 1 per location | medium | §5.3 | ✅ same list line as `name` |
| `keyLocations[n].purpose` | 2c | obligation | 1 per location | medium | §5.3 | ✅ same list line as `name` |
| `keyLocations[n].sensoryDetails.sights[]` | 2c | texture | up to 3 per location | medium | §§5.3, 3.2 | ✅ `Visual: {list}` in sensory palette |
| `keyLocations[n].sensoryDetails.sounds[]` | 2c | texture | up to 3 per location | medium | §§5.3, 3.2 | ✅ `Sounds: {list}` |
| `keyLocations[n].sensoryDetails.smells[]` | 2c | texture | up to 3 per location | medium | §§5.3, 3.2 | ✅ `Scents: {list}` |
| `keyLocations[n].sensoryDetails.tactile[]` | 2c | texture | up to 2 per location | medium | §§5.3, 3.2 | ✅ `Touch: {list}` |
| `keyLocations[n].sensoryVariants[]` | 2c | obligation (planned) | 1 matched per scene | medium | §§3.2, 9 | ⚠️ injected as chapter-specific palette hint; scene-matched obligation not yet implemented (§9) |
| `keyLocations[n].accessControl` | 2c | logic | 1 per location | medium | §3.2 | ❌ not injected |
| `keyLocations[n].paragraphs[]` | 2c | standing-frame | multiple | medium | §1.3 | ❌ not injected — explicitly stripped by `stripLocationParagraphs()` |
| `atmosphere.mood` | 2c | standing-frame | single | medium | §5.3 | ✅ `Atmosphere: {mood}` |
| `atmosphere.weather` | 2c | standing-frame | single | medium | §5.3 | ✅ `Weather: {weather}` |
| `atmosphere.eraMarkers` | 2c | texture | single | medium | §§1.3, 9 | ❌ not injected — planned (§9 table) |
| `atmosphere.sensoryPalette.dominant` | 2c | texture | single | medium | §3.2 | ❌ not injected |
| `atmosphere.sensoryPalette.secondary[]` | 2c | texture | multiple | medium | §3.2 | ❌ not injected |

### A.4a Agent 1 — Setting Refinement fields

No Agent 1 field is directly read by `agent9-prose.ts`. All setting-refinement substance reaches prose via Agent 6.5's world-document synthesis, where it is expressed as `historicalMoment.*`, `locationRegisters[n].*`, and `storyTheme` entries (see A.1). The `era_authenticity` system-prompt block (§5.1 position 6, priority `high`) draws from the CML's `meta.era.decade` field independently — it does not read this artifact.

| Field | Agent | Atom class | Priority | Governs | Injection path |
|---|---|---|---|---|---|
| `era.decade` | 1 | logic | — | §1.1 | ❌ indirect — CML `meta.era.decade` feeds `era_authenticity` block separately; setting_refinement is not read |
| `era.technology[]` | 1 | logic | — | §1.1 | ❌ indirect — synthesised into `historicalMoment.eraRegister` by Agent 6.5 |
| `era.communication[]` | 1 | logic | — | §1.1 | ❌ indirect |
| `era.transportation[]` | 1 | logic | — | §1.1 | ❌ indirect |
| `era.socialNorms[]` | 1 | texture | — | §1.1 | ❌ indirect |
| `era.policing[]` | 1 | logic | — | §1.1 | ❌ indirect |
| `era.forensics[]` | 1 | logic | — | §1.1 | ❌ indirect |
| `location.physicalConstraints[]` | 1 | logic | — | §1.1 | ❌ indirect — expressed via `historicalMoment.physicalConstraints[]` in world_document |
| `location.geographicIsolation` | 1 | logic | — | §1.1 | ❌ indirect |
| `location.accessControl[]` | 1 | logic | — | §1.1 | ❌ indirect |
| `atmosphere.weather` | 1 | texture | — | §1.1 | ❌ indirect — synthesised into `locationRegisters[n]` by Agent 6.5 |
| `atmosphere.timeOfDay` | 1 | texture | — | §1.1 | ❌ indirect |
| `atmosphere.mood` | 1 | texture | — | §1.1 | ❌ indirect |
| `atmosphere.visualDescription` | 1 | texture | — | §1.1 | ❌ indirect |
| `realism.anachronisms` | 1 | logic | — | §1.1 | ❌ indirect — anachronism constraints expressed via `era_authenticity` block using CML `meta.era.decade`, not this artifact |

### A.4b Agent 2d — Temporal Context fields

Fields below land in the `temporal_context` system-prompt block (§5.1 position 8, priority `high` — promoted from `medium` in Fix A1, 850-token cap). `specificDate.month` also drives Season Lock derivation inside `buildWorldBriefBlock` via `deriveTemporalSeasonLock()`. The `paragraphs[]` field is never read; Agent 6.5 synthesises temporal paragraph content into `historicalMoment.eraRegister`.

| Field | Agent | Atom class | Chunking | Priority | Governs | Status |
|---|---|---|---|---|---|---|
| `specificDate.month` | 2d | standing-frame | single | high | §§3.1, 5.2 | ✅ `{month} {year}` in TEMPORAL CONTEXT header; also drives Season Lock via `deriveTemporalSeasonLock()` |
| `specificDate.year` | 2d | standing-frame | single | high | §3.1 | ✅ same line as `specificDate.month` |
| `specificDate.day` | 2d | logic | single | high | §3.1 | ❌ not extracted — only month + year used |
| `specificDate.era` | 2d | logic | single | high | §3.1 | ❌ not extracted — era flows via CML `meta.era.decade` separately |
| `seasonal.season` | 2d | standing-frame | single | high | §§3.1, 5.2 | ✅ season label in header; determines forbidden seasonal words |
| `seasonal.weather[]` | 2d | texture | up to 3 | high | §3.1 | ✅ `Weather patterns: {list}` |
| `seasonal.daylight` | 2d | texture | single | high | §3.1 | ❌ not injected |
| `seasonal.holidays[]` | 2d | texture | multiple | high | §3.1 | ❌ not injected |
| `seasonal.seasonalActivities[]` | 2d | texture | multiple | high | §3.1 | ❌ not injected |
| `fashion.mensWear.formal[]` | 2d | obligation | up to 4 | high | §§3.1, 5.2 | ✅ `Men formal: {list}` |
| `fashion.mensWear.casual[]` | 2d | obligation | up to 3 | high | §3.1 | ✅ `Men casual: {list}` |
| `fashion.mensWear.accessories[]` | 2d | obligation | up to 3 | high | §3.1 | ✅ `Men accessories: {list}` |
| `fashion.womensWear.formal[]` | 2d | obligation | up to 4 | high | §3.1 | ✅ `Women formal: {list}` |
| `fashion.womensWear.casual[]` | 2d | obligation | up to 3 | high | §3.1 | ✅ `Women casual: {list}` |
| `fashion.womensWear.accessories[]` | 2d | obligation | up to 3 | high | §3.1 | ✅ `Women accessories: {list}` |
| `cultural.entertainment.popularMusic[]` | 2d | texture | up to 3 | high | §3.1 | ✅ `Music/entertainment: {list}` |
| `cultural.entertainment.films[]` | 2d | texture | up to 2 | high | §3.1 | ✅ `; Films: {list}` appended |
| `cultural.entertainment.theater[]` | 2d | texture | multiple | high | §3.1 | ❌ not injected |
| `cultural.entertainment.radio[]` | 2d | texture | multiple | high | §3.1 | ❌ not injected |
| `cultural.literature.*` | 2d | texture | multiple | high | §3.1 | ❌ not injected |
| `cultural.technology.*` | 2d | texture | multiple | high | §3.1 | ❌ not injected |
| `cultural.dailyLife.typicalPrices[]` | 2d | texture | up to 4 | high | §3.1 | ✅ `Typical prices: {list}` |
| `cultural.dailyLife.commonActivities[]` | 2d | texture | multiple | high | §3.1 | ❌ not injected |
| `cultural.dailyLife.socialRituals[]` | 2d | texture | multiple | high | §3.1 | ❌ not injected |
| `currentAffairs.majorEvents[]` | 2d | texture | up to 2 | high | §3.1 | ✅ `Current events: {list}` when present |
| `atmosphericDetails[]` | 2d | texture | up to 4 | high | §3.1 | ✅ atmospheric texture lines |
| `socialAttitudes.*` | 2d | logic | multiple | high | §3.1 | ❌ not injected |
| `paragraphs[]` | 2d | standing-frame | multiple | high | §1.2 | ❌ not injected — Agent 6.5 synthesises paragraph content into `historicalMoment.eraRegister` |

### A.5 CML and Logic fields (Agent 3 / 3b / 5 / 6)

Fields span four system-prompt blocks plus the user message. "Context summary" fields land in the **user message** (always included — not subject to budget dropping). `NarrativeState` fields (Agent 6) land in the `narrative_state` block (`critical`). Clue distribution fields (Agent 5) land in the `clue_descriptions` + obligation contract (`critical`). `prose_requirements` fields (Agent 3b) drive the obligation contract and `buildProseRequirements`.

| Field | Agent | Atom class | Chunking | Priority | Governs | Status |
|---|---|---|---|---|---|---|
| `meta.title` | 3 | logic | single | critical | §§1.5, 5.1 | ✅ `Title: {text}` in Case Overview (user message) |
| `meta.era.decade` | 3 | logic | single | critical / high | §§1.5, 5.1 | ✅ `Era: {text}` in Case Overview; also drives `era_authenticity` block (high) |
| `meta.setting.location` | 3 | logic | single | critical | §§1.5, 5.1 | ✅ `Setting: {text}` + `Setting Lock` instruction |
| `meta.crime_class.category` | 3 | logic | single | critical | §§1.5, 5.1 | ✅ `Crime: {category} ({subtype})` in Case Overview |
| `meta.crime_class.subtype` | 3 | logic | single | critical | §§1.5, 5.1 | ✅ same line as `category` |
| `culpability.culprits[]` | 3 | logic | single | critical | §§1.5, 5.1 | ✅ `Culprit: {name(s)}` in Case Overview |
| `culpability` + `cast.characters[culprit].motive_seed` | 3 + 2b | logic | single | critical | §§1.5, 7.5 | ✅ `MOTIVE LOCK: The culprit's motive is: "{motive}"` |
| `false_assumption.statement` | 3 | logic | single | critical | §§1.5, 5.1 | ✅ `False assumption: {text}` in Case Overview |
| `cast.characters[n].name` + `.gender` | 3 | obligation | 1 per character | critical | §§1.5, 5.1 | ✅ cast list with pronoun annotations; `⚠ PRONOUN REMINDER` block when non-binary present |
| `constraint_space.time.anchors[]` | 3 | logic | up to 5 | high | §§3.1, 7.6 | ✅ `Established timeline fact: {anchor}` in FROZEN TIMELINE STATE block |
| `NarrativeState.lockedFacts[n].description` + `.value` | 6 | obligation | 1 per fact | critical | §§5.1, 6.3, 7.6 | ✅ `LOCKED FACTS — use verbatim` in `narrative_state` block; also injected in `locked_facts` block and obligation contract |
| `NarrativeState.characterPronouns` | 6 | obligation | 1 per character | critical | §§5.1, 6.3 | ✅ `CHARACTER PRONOUNS — never deviate` in `narrative_state` block |
| `NarrativeState.cluesRevealedToReader[]` | 6 | logic | multiple | critical | §§5.1, 6.3 | ✅ `CLUES ALREADY REVEALED TO READER` in `narrative_state` block |
| `NarrativeState.victimConfirmedDeadChapter` | 6 | logic | single | critical | §§5.1, 6.3, 9 | ⚠️ `narrative_state` block injection implemented; orchestrator setter not yet wired (§9) |
| `clues[n].description` | 5 | obligation | 1 per clue | critical | §§5.2, 6.1 | ✅ clue bullet in `clue_descriptions` block + obligation contract |
| `clues[n].pointsTo` | 5 | obligation | 1 per clue | critical | §§5.2, 6.1 | ✅ `Points to: {text}` per clue bullet |
| `clues[n].placement` | 5 | logic | 1 per clue | critical | §§5.2, 6.1 | ✅ drives early-placement two-paragraph structure requirement |
| `clues[n].criticality` | 5 | logic | 1 per clue | critical | §§5.2, 6.1 | ✅ shown in `clue_descriptions` block |
| `clues[n].category` | 5 | logic | 1 per clue | critical | §§5.2, 6.1 | ✅ shown in `clue_descriptions` block |
| `clues[n].supportsInferenceStep` | 5 | logic | conditional single | critical | §§5.2, 6.1 | ✅ `Supports inference step {N}` when present |
| `prose_requirements.discriminating_test_scene.act_number` + `.scene_number` | 3b | logic | single | critical | §§1.5, 5.2 | ✅ activates discriminating test obligation and tonal-contrast suppression |
| `prose_requirements.culprit_revelation_scene.act_number` + `.scene_number` | 3b | logic | single | critical | §1.5 | ✅ `Culprit Revelation Scene` scene targeting |
| `prose_requirements.culprit_revelation_scene.revelation_method` | 3b | obligation | single | critical | §1.5 | ✅ `Method: {text}` |
| `prose_requirements.identity_rules[n].*` | 3b | obligation | 1 per rule | critical | §1.5 | ✅ `Identity Protection Rules` — `before_reveal_reference` / `after_reveal_reference` / `revealed_in_act` |
| `prose_requirements.suspect_clearance_scenes[n].*` | 3b | obligation | 1 per scene | critical | §1.5 | ✅ `Suspect clearance required: {name} via {method}` in obligation chapter |
| `prose_requirements.clue_to_scene_mapping[n].clue_id` + `.delivery_method` | 3b | obligation | 1 per mapping | critical | §§1.5, 5.2 | ✅ fallback delivery obligation when no full Agent 5 Clue object is available |

### A.6 Narrative Outline fields (Agent 7)

Outline fields are serialised as `JSON.stringify(scenes, null, 2)` in the **user message** (see §5.2 user-message assembly). The `applyPromptBudgeting` system does not manage the user message, so all these fields reach the model at full fidelity — the Priority column is therefore `user-message` throughout. Scenes are flattened from `outline.acts[n].scenes[n]` before serialisation; act-level fields (`title`, `purpose`) are not copied to scene objects and do not appear in the output JSON.

| Field | Agent | Atom class | Chunking | Priority | Governs | Status |
|---|---|---|---|---|---|---|
| `acts[n].actNumber` (as `scene.act`) | 7 | logic | 1 per scene | user-message | §§1.9, 5.2 | ✅ on each scene object after flatMap; used for discriminating-test and clearance-scene matching |
| `acts[n].title` | 7 | standing-frame | 1 per act | user-message | §1.9 | ❌ not serialised — act-level field; not copied to scene objects |
| `acts[n].purpose` | 7 | standing-frame | 1 per act | user-message | §1.9 | ❌ not serialised — act-level field |
| `acts[n].scenes[n].sceneNumber` | 7 | logic | 1 per scene | user-message | §§1.9, 5.2 | ✅ serialised; used for obligation contract chapter numbering |
| `acts[n].scenes[n].title` | 7 | standing-frame | 1 per scene | user-message | §1.9 | ✅ serialised (phantom names sanitized) |
| `acts[n].scenes[n].setting.location` | 7 | obligation | 1 per scene | user-message | §§1.9, 5.2, 3.2 | ✅ `Location anchor` in obligation contract; sensory-variant selection key for location profiles |
| `acts[n].scenes[n].setting.timeOfDay` | 7 | obligation | 1 per scene | user-message | §§1.9, 3.2 | ✅ sensory-variant selection key; serialised |
| `acts[n].scenes[n].setting.atmosphere` | 7 | texture | 1 per scene | user-message | §1.9 | ✅ serialised |
| `acts[n].scenes[n].characters[]` | 7 | obligation | 1 per scene | user-message | §§1.9, 5.2 | ✅ serialised (phantom names sanitized by `sanitizeScenesCharacters`) |
| `acts[n].scenes[n].purpose` | 7 | standing-frame | 1 per scene | user-message | §1.9 | ✅ serialised (phantom names sanitized) |
| `acts[n].scenes[n].summary` | 7 | standing-frame | 1 per scene | user-message | §1.9 | ✅ serialised (phantom names sanitized) |
| `acts[n].scenes[n].cluesRevealed[]` | 7 | obligation | 1 per scene | user-message | §§1.9, 5.2 | ✅ drives clue obligation contract bullets |
| `acts[n].scenes[n].dramaticElements.conflict` | 7 | texture | 1 per scene | user-message | §1.9 | ✅ serialised (phantom names sanitized) |
| `acts[n].scenes[n].dramaticElements.tension` | 7 | texture | 1 per scene | user-message | §1.9 | ✅ serialised |
| `acts[n].scenes[n].dramaticElements.revelation` | 7 | texture | 1 per scene | user-message | §1.9 | ✅ serialised |
| `acts[n].scenes[n].dramaticElements.misdirection` | 7 | texture | 1 per scene | user-message | §1.9 | ✅ serialised |
| `acts[n].scenes[n].dramaticElements.microMomentBeats[]` | 7 | texture | 1 per scene | user-message | §1.9 | ✅ serialised |
| `acts[n].scenes[n].estimatedWordCount` | 7 | obligation | 1 per scene | user-message | §1.9 | ✅ clamped to valid range; drives word-count target in obligation contract |
| `acts[n].scenes[n].emotionalRegister` | 7 | window | conditional single | user-message | §§1.9, 3.3 | ✅ serialised when present (World Document enrichment field) |
| `acts[n].scenes[n].dominantCharacterNote.name` | 7 | window | conditional single | user-message | §§1.9, 3.3 | ✅ serialised when present |
| `acts[n].scenes[n].dominantCharacterNote.voiceRegister` | 7 | window | conditional single | user-message | §§1.9, 3.3 | ✅ serialised when present |
| `acts[n].scenes[n].humourGuidance.permission` | 7 | window | conditional single | user-message | §§1.9, 7.3 | ✅ serialised when present |
| `acts[n].scenes[n].humourGuidance.character` | 7 | window | conditional single | user-message | §§1.9, 7.3 | ✅ serialised when present |
| `acts[n].scenes[n].humourGuidance.form` | 7 | window | conditional single | user-message | §§1.9, 7.3 | ✅ serialised when present |
| `acts[n].scenes[n].humourGuidance.condition` | 7 | window | conditional single | user-message | §§1.9, 7.3 | ✅ serialised when present |
| `acts[n].scenes[n].eraTextureNote` | 7 | texture | conditional single | user-message | §§1.9, 3.1 | ✅ serialised when present |

---

### A.7 Notes on completeness

- Fields marked as `logic` constraints (A.5) shape *what the LLM must not do* rather than
  what it should put on the page. They are injected as constraint rules, not creative
  texture, and are not candidates for asset library atomisation.
- Agent 1 (setting_refinement) fields are entirely indirect — none are read by
  `agent9-prose.ts`. Season Lock is derived from `temporalContext.specificDate.month`
  (Agent 2d), not from `seasonal.season` directly. These injection paths are confirmed
  in A.4a and A.4b above.
- Narrative outline fields (A.6) travel via the user message, not the system-prompt
  context block priority stack. They always arrive at full fidelity; the budget manager
  cannot drop them.
- This appendix should be regenerated as a code comment or companion JSON file when the
  Asset Library is implemented, so the code and the spec stay in sync.

---

*This document is the authoritative specification for prose generation quality
architecture. Implementation proposals are sequenced in ANALYSIS_51 §9 and tracked
against the Wave 2 / Wave 3 implementation plan.*

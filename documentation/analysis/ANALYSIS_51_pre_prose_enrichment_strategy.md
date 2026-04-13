# ANALYSIS_51 — Pre-Prose Data Leverage: Making the Story Sound Like a Human Wrote It

**Date:** 2026-04-12  
**Refs:** ANALYSIS_50 (prose quality defect report), Wave 1 implementation record  
**Scope:** All pre-prose pipeline artifacts and their relationship to prose quality

---

## 0. Purpose

Before a single word of prose is written, this pipeline generates an extraordinary amount
of narrative intelligence: location sensory profiles with time-of-day variants, per-
character psychological portraits with era context, an emotional arc mapped across 19
scene positions, voice sketches with dialogue fragments per register, a story theme, a
pre-identified emotional break moment, and reveal-connection instructions.

The question this document answers is:

> How much of that intelligence actually reaches the prose LLM in a form it can use, and
> what would the story sound like if we used it fully?

This is not a bug report. It is an architecture audit of the pipeline's creative leverage
— with concrete, ordered proposals for closing the gap between the data we generate and
the prose quality we receive.

---

## 1. The Pre-Prose Data Inventory

The following artifacts are produced before Agent 9 (prose generation) runs.

### 1.1 Character Profiles (Agent 2b)

Per character:

| Field | Purpose |
|---|---|
| `publicPersona` | Social mask — what the world sees |
| `privateSecret` | Hidden dimension — what they are hiding |
| `motiveSeed` | What drives their behaviour in this case |
| `motiveStrength` | How strongly that drive shapes their actions |
| `stakes` | What they stand to lose or gain |
| `humourStyle` | Enum: understatement / dry_wit / polite_savagery / self_deprecating / observational / deadpan / sardonic / blunt / none |
| `humourLevel` | 0.0–1.0 — frequency of wit |
| `speechMannerisms` | Free-text: verbal tics, rhythm, formality level |
| `physicalMannerisms` | Micro-tells under stress — "deploy at most one per scene" (schema note) |
| `internalConflict` | Psychological tension or moral struggle |
| `personalStakeInCase` | Why this specific case matters personally |
| `privateLonging` | Non-case personal desire or grief — "let it leak into one or two moments" (schema note) |

These are the richest character-texture assets in the pipeline. Combined, they allow the
prose LLM to write a character who feels like a person rather than a function.

### 1.2 Location Profiles (Agent 2c)

Per location:

| Field | Purpose |
|---|---|
| `sensoryDetails.sights/sounds/smells/tactile` | Static sensory arrays for the location |
| `sensoryVariants[]` | 3–4 variants keyed by `timeOfDay + weather` — explicitly designed for chapter-by-chapter cycling to prevent atmospheric repetition |
| `accessControl` | Who can enter, when, via what route |
| `atmosphere.eraMarkers` | Era-specific cultural/sensory anchors (not generic period atmosphere) |
| `atmosphere.sensoryPalette` | Dominant + secondary palette descriptors |

The `sensoryVariants` array is the most powerful anti-repetition asset in the whole
pipeline. It was specifically designed to give the prose LLM a different sensory palette
every time it visits the same location under different conditions.

### 1.3 World Document (Agent 65)

The World Document is a synthesis artifact that distils and reframes all prior pipeline
data into creative writing guidance. Its fields include:

| Field | Purpose |
|---|---|
| `historicalMoment.eraRegister` | 200–300 word prose on the emotional mood of the era |
| `historicalMoment.currentTensions` | 2–4 specific dateable facts civilians would feel |
| `historicalMoment.physicalConstraints` | Era-specific movement/communication constraints |
| `historicalMoment.wartimeServiceContext` | War context (service status, social texture, absence effect) |
| `storyTheme` | One sentence: what this story is really about |
| `storyEmotionalArc.arcDescription` | **300–400 word** prose description of the full emotional journey |
| `storyEmotionalArc.dominantRegister` | Single label: the story's dominant tone |
| `storyEmotionalArc.turningPoints[]` | Per arc-position emotional beat description |
| `storyEmotionalArc.endingNote` | Final register guidance for the denouement |
| `characterPortraits[n].portrait` | 80–120 word character portrait |
| `characterPortraits[n].eraIntersection` | One sentence: how the historical moment intersects with this character's private situation |
| `characterVoiceSketches[n].voiceDescription` | Definitive voice summary |
| `characterVoiceSketches[n].fragments[]` | Dialogue samples per register (comfortable/evasive/stressed/humorous/formal) |
| `characterVoiceSketches[n].humourNote` | Character-specific wit description |
| `locationRegisters[n].emotionalRegister` | 60–100 word emotional stance for this location |
| `locationRegisters[n].cameraAngle` | POV entry instruction: "Enter from outside, feel the warmth as contrast, then notice what is wrong" |
| `locationRegisters[n].eraNote` | Wartime/era constraint on this location |
| `humourPlacementMap[]` | Per scene-position: permission/condition/permittedCharacters/permittedForms/rationale |
| `breakMoment` | Pre-identified emotional break: character + scenePosition + form + narrativeFunction |
| `revealImplications` | 90–150 word description of earlier moments that must recolour on the reveal |

### 1.4 Temporal Context (Agent 1)

Fashion by gender and formality, cultural entertainment (music, films), current affairs,
atmospheric details — all tied to the specific month/year of the story.

### 1.5 Narrative Outline (Agent 7)

Per scene: title, setting (location + timeOfDay + atmosphere), characters present, scene
purpose, clue obligations. This is the scaffold.

---

## 2. Injection Audit — What Currently Reaches Agent 9

This audit is based on code inspection of `buildWorldBriefBlock()` and
`buildCharacterPersonalityBlock()` in `packages/prompts-llm/src/agent9-prose.ts`.

### 2.1 World Document injection (`buildWorldBriefBlock`)

| Field | Status |
|---|---|
| `historicalMoment.eraRegister` | ✅ Injected |
| `historicalMoment.emotionalRegister` | ✅ Injected |
| `historicalMoment.physicalConstraints` | ✅ Injected (up to 4) |
| `historicalMoment.currentTensions` | ✅ Injected (up to 3, with "weave into background texture" instruction) |
| `historicalMoment.wartimeServiceContext` | ✅ Injected |
| Season lock derived from specificDate | ✅ Injected as hard constraint |
| `storyTheme` | ✅ Injected |
| `storyEmotionalArc.dominantRegister` | ✅ Injected |
| `storyEmotionalArc.arcDescription` | ❌ **NOT injected** |
| `storyEmotionalArc.turningPoints[arcPosition].emotionalDescription` | ✅ Injected (per-chapter position) |
| `storyEmotionalArc.endingNote` | ✅ Injected (final 25% only) |
| `characterPortraits[n].portrait` | ✅ Injected (all characters, every chapter) |
| `characterPortraits[n].eraIntersection` | ✅ Injected (all characters, every chapter) |
| `characterVoiceSketches[n].voiceDescription` | ✅ Injected (all characters, every chapter) |
| `characterVoiceSketches[n].fragments[]` | ✅ Injected (up to 3 per character, all registers, all characters, every chapter) |
| `characterVoiceSketches[n].humourNote` | ✅ Injected |
| `locationRegisters[n].emotionalRegister` | ✅ Injected (all locations, every chapter) |
| `locationRegisters[n].cameraAngle` | ✅ Injected (all locations, every chapter) |
| `locationRegisters[n].eraNote` | ✅ Injected (all locations, every chapter) |
| `humourPlacementMap[arcPosition]` | ✅ Injected (current arc position only) |
| `breakMoment` | ✅ Injected (chapters 60–85% of story only) |
| `revealImplications` | ✅ Injected (final 25% of chapters only) |

### 2.2 Character Profiles injection (`buildCharacterPersonalityBlock`)

| Field | Status |
|---|---|
| `publicPersona`, `privateSecret`, `stakes` | ✅ Injected |
| `humourStyle`, `humourLevel` | ✅ Injected |
| `speechMannerisms` | ✅ Injected |
| `internalConflict` | ✅ Injected |
| `physicalMannerisms` | ✅ Injected (with "deploy one per scene" note) |
| `privateLonging` | ✅ Injected (with "let surface in 1–2 moments" note) |
| `motiveSeed`, `motiveStrength` | ✅ Injected |
| `personalStakeInCase` | ✅ Injected |

### 2.3 Location Profiles injection (`buildLocationProfilesContext`)

| Field | Status |
|---|---|
| `primary.summary` | ✅ Injected |
| `keyLocations[n].name, type, purpose` | ✅ Injected |
| `keyLocations[n].sensoryDetails.*` | ✅ Injected (first 3 locations, 3 senses each) |
| `keyLocations[n].sensoryVariants[]` | ✅ Injected as chapter-specific "palette hints" (if scenesOverride provided) |
| `atmosphere.mood, weather` | ✅ Injected |
| `atmosphere.eraMarkers` | ❌ **NOT injected** |
| `atmosphere.sensoryPalette` | ❌ **NOT injected** separately |
| `keyLocations[n].accessControl` | ❌ **NOT injected** |

### 2.4 Summary: What's missing or misdirected

Only two fields are genuinely absent:

1. `storyEmotionalArc.arcDescription` — the 300–400 word emotional journey prose
2. `atmosphere.eraMarkers` — era-specific cultural/sensory anchors

But absence is not the main problem. The main problem is how what IS injected is
structured and applied. That is what the next section addresses.

---

## 3. The Four Core Problems with Current Injection

Almost every field is injected — but the prose quality issues in ANALYSIS_50 persist.
That means the problem is not primarily what is included, but **how** it is deployed.

### 3.1 Problem: Chapter-agnostic data dump

Every chapter receives the same block: all character portraits, all voice sketches for all
7–9 characters, all location registers for all 8–12 locations. Chapter 3 and Chapter 17
receive identical character portrait and location register content, regardless of which
2–3 characters appear in each chapter's scenes or which single location is active.

This has two consequences:

**Token cost**: A 9-character, 10-location story injects approximately 2,500–3,000 tokens
of portrait/voice/register data per chapter prompt. In a 19-chapter story that is 47,000–
57,000 tokens of context for characters and locations that are not present in that chapter.

**Attention dilution**: The LLM attends equally to all injected content. A voice sketch
for a character not present in a chapter competes equally for attention with the sketch of
characters who ARE present. When all voice sketches are present, the LLM has no signal
that Character X is more relevant to this chapter than Character Y — so it falls back on
its training distribution and averages the voices.

**The fix**: Filter portraits, voice sketches, and location registers to include only the
characters and locations that appear in this chapter's scenes. The scene outline provides
`characters` and `setting.location` per scene — this is the selection key.

### 3.2 Problem: No deployment tracking for one-shot assets

`physicalMannerisms` and `privateLonging` are explicitly annotated in the schema as one-
shot or limited-deployment assets:

- `physicalMannerisms`: _"deploy at most one per scene, not as a list"_
- `privateLonging`: _"let it leak into one or two moments"_

These annotations exist in the character profiles schema and are reflected in the prose
prompt's guidance text. But there is **no tracking of whether they have been deployed**.
The same physicalMannerism description is included in Chapter 3's prompt, Chapter 7's
prompt, Chapter 12's prompt, and Chapter 17's prompt — identically.

The LLM can only do one of two things with this: deploy the mannerism every chapter (over-
use), or deploy it nowhere and save it "for later" (never use). Neither is the intended
behaviour. The intended behaviour is "deploy once or twice, then stop" — which requires
state.

The same problem applies to `eraIntersection` (a per-character one-time grounding detail
that is most valuable in the character's first 1–2 appearances) and `personalStakeInCase`
(the obligation is to reference it "at least twice across the story through internal
monologue" — but there's no record of whether those two deployments have occurred).

**The fix**: Extend `NarrativeState` to track deployed asset usage — a per-character,
per-location record of which content atoms have been used and in which chapters. Inject
this tracking state into chapter prompts so the LLM knows "physicalMannerisms for
Cavendish: deployed in chapter 4 — do not deploy again before chapter 12." But this
tracking is only as useful as the granularity of what is being tracked. If
`physicalMannerisms` is a single 30-word description, tracking tells us whether it has
been used or not. If it is four distinct atoms — the resting-hand position, the jaw-set
under stress, the glance toward the door, the habit of turning an object over — tracking
tells us which facets have been used and which are still available. The full architecture
for chunking, tracking, and scaling by story length is covered in §4.

### 3.3 Problem: Voice fragments are register-agnostic per chapter

Each character's voice sketch includes fragments tagged by register: `comfortable`,
`evasive`, `stressed`, `humorous`, `formal`. Up to 3 fragments are injected per character
regardless of which register this chapter's scenes call for.

A chapter that features a tense interrogation (evasive register) and a chapter that
features a social dinner (comfortable register) receive the same 3 fragments per character.
The interrogation chapter might get the `comfortable` fragment as the primary example, and
the dinner chapter might get the `evasive` fragment. The most useful fragment — the one
matching this scene's emotional register — may not even be in the 3 injected.

The scene outline's `setting.atmosphere` and the narrative outline's scene purpose provide
the register signal. But `buildWorldBriefBlock` has no scene-context parameter — it
produces the same voice fragment selection for all chapters.

**The fix**: Accept the current chapter's dominant scene tone (derived from the turning
point's emotional register and humour permission) as an additional parameter to
`buildWorldBriefBlock`. Prioritise fragments whose register matches the dominant scene
tone. Include the matching-register fragment first, the stressed/evasive fragments second,
and the neutral fragment last.

### 3.4 Problem: The most valuable atmospheric data arrives too late or not at all

Two fields are gated in ways that prevent their full creative use:

**`breakMoment`** is only injected for chapters 60–85% through the story — correctly
timed to place the emotional break in the right position. But the prose LLM has no prior
knowledge that this break is coming. There is no "approaching break" signal in earlier
chapters that could create narrative tension around it ("something is gathering; this
character is being stretched toward a moment of collapse").

**`revealImplications`** is only injected in the final 25%. But the explicit purpose of
`revealImplications` is to identify earlier moments that must be seeded to make the reveal
land — "name 2–3 specific earlier moments that recolour on final reveal." If this
description is only shown to the LLM generating chapter 15 onward, the seeding in chapters
3–10 (where those moments occur) was never guided. The reveal implication instructions
arrive after the seeding window has closed.

**`arcDescription`** is never injected. This 300–400 word emotional prose — the full
shape of the story's emotional journey from opening through breaking to resolution — is the
document most analogous to a human writer's "feel for the whole." It is produced by
Agent 65 but never consumed by Agent 9.

---

## 4. The Asset Library Model: Chunking and Tracking Pre-Prose Data

### 4.0 Concept

The current pipeline treats all pre-prose data as monolithic context blocks. Each field
— whether it is a 300-word `eraRegister` or a single `speechMannerisms` string — is
either fully injected or not injected in a given chapter. There is no granularity below
field level.

This creates two compounding problems:

- A long block (200-word portrait, 300-word era register) consumes the same tokens
  whether a chapter needs one sentence from it or all of it.
- The LLM cannot make meaningful deployment choices when all content arrives at once —
  it either overdeploys (repetition) or underdeploys (the content is there but never
  surfaces).

The Asset Library model treats all pre-prose data as a collection of individually
addressable, trackable units — **atoms**. Each atom has a deployment budget (how many
times it may appear across the story). The pipeline selects atoms per chapter based on
relevance and remaining headroom. After each chapter is generated, used atoms are
recorded and their counts updated. Longer stories draw from a wider depth of the pool;
shorter stories use only the highest-priority atoms from each source.

### 4.1 Chunking Long-Form Fields

Long-form text fields should be pre-chunked into atoms at story initialisation — after
all pre-prose agents complete but before Agent 9 runs. For array fields the chunking is
trivial (each element is one atom). For prose fields a lightweight decomposition step
splits the text at its natural conceptual seams.

**Location sensory details**

`sensoryDetails.sights[]`, `sounds[]`, `smells[]`, `tactile[]` are already arrays —
each element is one atom, typically a short phrase. A location with 8 sights, 6 sounds,
5 smells, and 4 tactile entries yields 23 atoms from `sensoryDetails` alone, plus one
atom per `sensoryVariant`. For a short story (8 chapters), 2–3 sensory atoms per
location visit is sufficient. A 24-chapter story can draw 5–6 different atoms on each
visit and work through most of the library, ensuring every chapter in the same room
feels observationally distinct.

**Character portrait (80–120 words)**

Chunk into four atoms:
- *Physical appearance* — build, colouring, clothing style (1–2 sentences)
- *Manner and bearing* — how they hold themselves, move through a room (1 sentence)
- *First-impression quality* — the one thing a stranger notices before anything else
  (1 sentence)
- *Distinctive telling detail* — the irreplaceable feature that makes them themselves
  (1 sentence)

The first-impression atom deploys on the character's introduction chapter. The remaining
three distribute across the next 3–4 appearances. After that, the physical presence
exists in `chapterSummaries` and portrait atoms retire from rotation.

**`historicalMoment.eraRegister` (200–300 words)**

Currently injected verbatim every chapter. Chunk into five atoms:
- *Social context*: who holds power, who has lost it
- *Economic texture*: what money feels like, what is scarce
- *Emotional weather*: the prevailing mood people carry in this year
- *Defining era constraint*: the one thing this era demands or forbids
- *Concrete era anchor*: one dateable sensory or cultural detail rooted in `currentTensions`

Maximum 1–2 era atoms per chapter; rotate through them so no two successive chapters
draw from the same register dimension. The combined effect across 10 chapters is a
fully realised era built from distinct, complementary angles rather than a repeated
general impression.

**`internalConflict` (free-text, 1–3 sentences)**

Split into up to three atoms:
- *Core tension* — the defining moral or psychological struggle (deploys in most scenes
  where this character is present and emotional)
- *External manifestation* — the physical or behavioural tell it produces under pressure
  (deploy 3–4 times across the story, never consecutively)
- *Resolution condition* — what would end the conflict, surfaced only as sub-text in
  late-story scenes

**`speechMannerisms` (free-text)**

Often describes multiple distinct mannerisms in a single string. Treat each distinct
behaviour as one atom. "Clipped sentences, avoids contractions, long pause before
answering difficult questions" is three atoms. Each deploys in different chapters,
together building the voice signature across the story rather than asserting it once
and hoping it sticks.

**`revealImplications` (90–150 words)**

Contains references to 2–3 specific earlier moments. Each moment reference is one atom
with its own injection window — see §6.2 for the seeding-window approach.

**`characterPortraits[n].eraIntersection` (one sentence)**

This is naturally a single atom with a budget of 1 — deploy once, on the character's
first or second appearance. After that it exists in the chapter summary record and does
not need re-injection.

**Voice sketch `fragments[]` per register**

Each fragment (comfortable / evasive / stressed / humorous / formal) is one atom, tagged
by register. An atom with a `stressed` register tag has higher priority in chapters where
the arc position is `pre_climax` or `climax`. An atom with a `comfortable` register tag
has higher priority in chapters tagged as social or investigatively non-threatening. The
atom-selection step uses arc position to choose which register fragment to surface,
rather than always slicing the first 3.

### 4.2 The Asset Library Data Structure

At story initialisation the pipeline constructs an `AssetLibrary` from all available
pre-prose data:

```
Asset {
  id: string              // e.g. "char.Cavendish.internalConflict.external"
  source: string          // which schema field this chunk came from
  scope: 'character' | 'location' | 'era' | 'arc' | 'story'
  scopeKey?: string       // character name, location id, or absent
  register?: string       // for voice fragments: comfortable/evasive/stressed/etc.
  content: string         // the text chunk itself
  budget: number          // max total deployments across the full story
  used: number[]          // chapter numbers where this atom was deployed
  priority: 'obligation' | 'texture'
                          // obligation = required when character/location is active
                          // texture = optional enrichment, drawn from pool
}
```

`budget` is derived from story length and atom priority class (see §4.3). At chapter
assembly, the pipeline queries the library for all atoms where:
1. `scope` matches the active characters/locations for this chapter
2. `used.length < budget`
3. For register-tagged atoms: `register` matches or is compatible with this chapter's
   dominant arc tone

Obligation-class atoms are injected into the scene obligation contract. Texture-class
atoms are injected as an optional enrichment pool from which the LLM draws as needed.

### 4.3 Story Length Scaling

The asset library provides more atoms than any story needs. Story length determines how
deep into the pool the chapter assembly reaches.

| Story length | Chapters | Character atoms drawn per chapter | Sensory atoms per location visit |
|---|---|---|---|
| Short | ≤8 | 2–3 (first-impression atom + core voice + key physical tell) | 2–3 senses |
| Medium | 9–15 | 3–4 (+ secondary portrait detail, eraIntersection) | 3–4 senses |
| Long | ≥16 | 4–5 (+ texture pool items, secondary conflict facets, additional voice fragments) | 4–5 senses |

In a short story the asset library surfaces only the most distinctive atoms — ensuring
each one appears at the right moment and nothing is squandered on characters not in the
scene. In a long story the library provides depth: the 16th appearance of a character
can draw on atoms never used before, keeping the characterisation fresh across a large
canvas without the writer having to invent new detail.

The budget for each atom type by story length:

| Atom type | Short (≤8 ch) | Medium (9–15 ch) | Long (≥16 ch) |
|---|---|---|---|
| First-impression portrait | 1 | 1 | 1 |
| Physical appearance detail | 1 | 2 | 2 |
| Manner/bearing | 1 | 1 | 2 |
| Distinctive telling detail | 1 | 2 | 3 |
| `physicalMannerisms` atom | 1 | 2 | 3 |
| `privateLonging` atom | 1 | 2 | 2 |
| `internalConflict.core` | unlimited | unlimited | unlimited |
| `internalConflict.external` | 2 | 3 | 4 |
| `internalConflict.resolution` | 0–1 (late only) | 1 | 2 |
| Voice fragment per register | 1 | 2 | 3 |
| `eraIntersection` | 1 | 1 | 1 |
| Sensory atom (sight/sound/smell) | 1 | 1–2 | 2 |
| Era register atom | 1 | 1 | 2 |
| `currentTensions` item | 2 | 3 | 4 |

### 4.4 Marking Assets as Used — Two Mechanisms

**Obligation tracking (deterministic)**: When an atom is injected into a chapter's
obligation contract as a required deployment, the pipeline marks it used upon chapter
validation passing — no prose-scanning needed. The obligation was set; the chapter
passed the validation gate; the atom is recorded as deployed in that chapter.

**Self-report (LLM)**: For atoms injected as optional texture (sensory atoms, era
register fragments, cultural touchstones), the chapter prompt includes a closing
instruction:

> "If you drew on any items from the optional texture pool, list their IDs in a
> `<used_assets>` tag at the very end of your response."

The pipeline strips the tag before saving prose and updates asset usage. This is less
reliable than obligation tracking but avoids a separate verification LLM pass.

**Fallback rule**: Assets injected as obligation → assumed used if chapter passes
validation. Assets injected as optional texture and not confirmed via self-report within
2 batch cycles → treated as not deployed, returned to the available pool.

### 4.5 Relationship to `NarrativeState`

`AssetLibrary` is a pre-prose artefact — constructed once from the static pre-prose data
and passed into the prose run. `NarrativeState` is the per-chapter mutable record. Their
relationship:

- `NarrativeState` gains a new `deployedAssets` field: a map from asset ID to the
  chapter numbers where it was deployed — `{ [assetId: string]: number[] }`.
- At chapter assembly: read `NarrativeState.deployedAssets` to compute remaining budget
  per atom and determine which atoms have headroom.
- After chapter validation: write confirmed deployments back to
  `NarrativeState.deployedAssets`.

This separation means the `AssetLibrary` can always be reconstructed from the pre-prose
data (it is deterministic given the same inputs). Only the consumption record lives in
`NarrativeState`. If a run must retry from chapter 8, only `deployedAssets` needs to
roll back to chapter-7 state — the atom definitions are unchanged.

The asset library also provides a useful diagnostic: after the story completes, the
pipeline can report which atoms were never deployed (unused pre-prose intelligence) and
which were overdeployed (exceeded budget through self-report drift). Both are signals
for improving atom budgets or Agent 65's generation density in future runs.

---

## 5. Issue-by-Issue Leverage Analysis

Mapping each ANALYSIS_50 issue to the pre-prose data that directly addresses it.

### D1 — Repetitive atmospheric templating

**Root cause (from A_50 RC-7):** `detectRecurringPhrases()` is diagnostic only. Atmospheric
phrase repetition accumulates freely across 19 chapters.

**Pre-prose data that helps:**

`sensoryVariants[]` per location is the primary countermeasure. Each location has 3–4
variants keyed by `timeOfDay` and `weather`, each with distinct sights/sounds/smells and a
mood word. The variants are specifically designed so that successive visits to the same
location under different conditions don't re-use the same sensory palette.

Currently these are injected as chapter-specific "palette hints" when `scenesOverride` is
provided — but as guidance text, not obligation. The LLM can ignore them.

**Proposed leverage:** Elevate sensory variant selection from guidance to **scene
obligation**. When a chapter's scene visits a location that has a variant matching the
scene's `timeOfDay` + `atmosphere`, inject the variant's sights/sounds/smells as the
canonical sensory palette for that scene's opening. Frame it as: "This chapter's visit to
[location] falls under the [timeOfDay/weather] variant. Your opening observation paragraph
must draw from these specific senses — do not use the default palette." Additionally, feed
the **last-used palette** per location into the `NarrativeState` so the LLM also knows
which senses were used in the previous visit and can actively vary them.

### D3 — Redundant internal monologue

**Root cause (from A_50 RC-1):** No tracking of internal monologue beats already expressed.
Each batch generates detective reflection fresh.

**Pre-prose data that helps:**

`privateLonging` and `internalConflict` per character (character profiles) are precisely
the raw material for varied internal monologue. Instead of generic "the weight of this
case," the detective's internal voice should be drawn from their specific private longing
(a grief, a career failure, a person they still think about). Monologue drawn from
concrete private longing is inherently varied because each visit to that longing need not
repeat the same words — it can approach the same wound from a new direction.

`personalStakeInCase` adds a second distinct monologue register: the detective's professional/
personal reason to care about _this_ case specifically.

But without deployment tracking, the LLM either overdraws on these details (same wound
referenced every chapter) or ignores them (defaults to generic reflection).

**Proposed leverage:** Add `internalMonologueBeatsUsed[]` to `NarrativeState` — a running
log of the specific private-longing dimensions and internal-conflict facets that have been
expressed. Before each chapter generation, inject a "remaining monologue register" — the
dimensions not yet used — so the LLM draws from fresh material rather than re-expressing
the same beat.

### B3 — Character role flattening / voice homogenisation

**Root cause (from A_50):** All voice sketches injected identically regardless of which
characters appear. No diversity enforcement gate on voice fragment output from Agent 65.

**Pre-prose data that helps:**

`characterVoiceSketches[n].fragments[]` contains register-differentiated dialogue samples.
`characterPortraits[n].eraIntersection` establishes each character's distinct historical
position. `character_profiles.speechMannerisms` provides verbal rhythm and formality
descriptors.

The data is rich enough to differentiate all characters. The problem is presentation:
when all sketches are dumped in the same format in the same priority position, the LLM
treats them as equivalently weighted context and averages across them.

**Proposed leverage:** 
For chapters where a character appears, inject their voice sketch **inside the scene
obligation for that character** rather than in a global character voices block. Framing
the voice sketch as "For this character in this scene, their voice should draw from these
fragments" creates a per-scene, per-character constraint rather than a global background
note. Additionally: inject the `eraIntersection` as a first-chapter obligation per
character — "On [character]'s first appearance, their era context must surface in either
action or dialogue: [eraIntersection]." This differentiates each character's relationship
to their world from the opening.

### C4 — Motive underdevelopment

**Root cause (from A_50):** Motive not tracked as per-scene obligation. No coherence gate.

**Pre-prose data that helps:**

`motiveSeed` + `motiveStrength` from character profiles. The `motiveStrength` field is
particularly underused — it is injected into the personality block but not made to modulate
how much or how early the culprit's motive should surface in observable behaviour.

`revealImplications` (world document) names the specific earlier moments that should
recolour on the reveal. These are exactly the motive-seeding moments.

**Proposed leverage:** For the culprit character, generate a motive deployment schedule at
the chapter-batch level: given `motiveStrength` and total chapters, calculate when motive
texture should first appear (obliquely), intensify, and become identifiable in retrospect.
Inject this schedule as a per-chapter obligation note: "This chapter is in the [early/mid/
late] phase of [culprit]'s motive arc; their behaviour should be [latent/surfacing/
pressurised]." 

For `revealImplications`, provide a sanitised "seeds to plant" version from chapter 3
onward (see §6 discussion on `revealImplications` timing below).

### A3 — Location continuity drift

**Root cause (from A_50):** Location register and camera angle are injected for all
locations every chapter; no per-scene lock to a specific register.

**Pre-prose data that helps:**

`locationRegisters[n].cameraAngle` is the most operationally useful field for preventing
location drift. The camera angle instruction ("Enter from outside, feel warmth as contrast,
then notice what is wrong") tells the prose LLM exactly how to open a scene in that
location — it is an entry script. When the scene obligation contract specifies both the
location AND the camera angle for that location, the opening is anchored.

`atmosphere.eraMarkers` from location profiles (currently not injected) provides specific
era-appropriate sensory anchors that distinguish this location in this time period from a
generic manor house. "The smell of coke fumes from the basement boiler. The faint sound
of a wireless in the kitchen." These are not generic — they are specific to this location
in this era.

**Proposed leverage:** For each chapter, extract only the location register(s) matching the
scenes in that chapter. Inject the camera angle as a **mandatory opening instruction** in
the scene obligation: "Scene opens in [location]. Your POV character enters this space.
Deploy this camera angle: [cameraAngle]." Also inject `eraMarkers` (currently absent)
alongside the location register as a supplementary sensory palette.

### D4 — Tonal over-insistence

**Root cause (from A_50):** Turning-point emotional description injected as prose; LLM
amplifies rather than modulates. No floor constraint.

**Pre-prose data that helps:**

`humourPlacementMap` per scene position provides the relief valve — it specifies exactly
when and from whom a light moment is permitted. `breakMoment` pre-identifies the single
most important emotional break, which means all other chapters should not claim break-level
emotional intensity.

`storyEmotionalArc.arcDescription` (currently uninjected) describes the full emotional
journey in prose. If it is well-written, it communicates the *shape* of intensity — the
valleys as well as the peaks. A chapter at arc-position "early" should feel nothing like
arc-position "pre_climax" even if both receive the raw instruction "heightening tension."

**Proposed leverage:** Inject `arcDescription` once at the top of each batch prompt as
the overarching emotional frame. Then use the per-chapter `turningPoint.emotionalDescription`
as a refinement within that frame. The arc description provides the ceiling reference; the
chapter position guides how far along the escalation curve this specific chapter sits. Also:
inject a tonal contrast instruction keyed to the preceding chapter's dominant register —
if chapter N was high-tension, chapter N+1's obligation block should specify "at least one
non-tense exchange or domestic moment is required before the investigation resumes."

### C2/D4 — Premature suspect convergence / culprit front-loading

**Root cause (from A_50 RC-5):** Culprit named in every prompt; LLM front-loads suspicion
on that character.

**Pre-prose data that helps:**

`characterPortraits[]` and `characterVoiceSketches[]` for the full suspect cast, used
symmetrically, provide the counterweight. If every character receives equal portrait depth
in the prompt — with equal voice sample coverage, equal eraIntersection placement, equal
physicalManifestation instructions — the LLM is less likely to single out the culprit
via atmospheric emphasis.

`motiveStrength` for non-culprit characters can be used to create credible false suspicion:
suspects with `high` motiveStrength should receive scenes early in the story where their
private motivation is observable, creating genuine alternative inference paths.

**Proposed leverage:** Add a "suspicion budget" instruction to early-chapter prompts:
"Through chapter [N], no one suspect should have received more than [1/castSize + 10%] of
total narrative suspicion signals. Distribute atmosphere, hesitation, and evasion across
all [N] primary suspects." This is a prompted word-budget constraint rather than a
structural fix, but it directly counteracts the LLM's culprit-knowledge bias.

### E3 — Word-count inflation through padding

**Root cause (from A_50):** LLM achieves word count target via atmospheric padding rather
than plot or clue content.

**Pre-prose data that helps:**

`historicalMoment.currentTensions` (injected) and `atmosphere.eraMarkers` (not injected)
are pools of specific, dateable background texture that can replace generic padding. A
sentence like "outside, the newspaper hoardings were still carrying last week's evacuation
notices" is rooted in `currentTensions`. It is not padding — it is world-building —  
and it fills exactly the same word-count role as "the shadows lengthened across the floor."

`culturalTouchstones` from the temporal context (music, films, prices) serve the same
function: a character glancing at the evening newspaper or price-checking a cab is period-
specific texture rather than atmospheric repetition.

**Proposed leverage:** Add a "texture pool" instruction to the chapter obligation block:
"If you must reach the word target through non-plot content, draw from this texture pool
rather than repeating atmospheric descriptions: [currentTensions] | [eraMarkers] |
[culturalTouchstones]. One period-specific detail per additional 100 words of texture is
the required ratio." This makes the filler earn its existence.

### D2 — Telling instead of dramatising

**Root cause (from A_50 RC-2):** Craft guide is token-budget truncated. No show-vs-tell
validator.

**Pre-prose data that helps:**

`eraIntersection` per character (world document) is the primary tool for converting
declarative emotional summary into concrete scene moment. Instead of "Cavendish was
nervous about his position" (telling), the suggestion is: "Let [eraIntersection] surface
through action." If Cavendish's eraIntersection is "His brother's VC ribbon sits in a
drawer he never opens; every military reference is a managed performance," then the
instruction becomes concrete: "This chapter contains a military reference — Cavendish's
response must be physical and evasive, not stated."

`physicalMannerisms` serves the same function — a physical action replaces an emotional
declaration.

**Proposed leverage:** When a high-priority scene involves a character with an unused
`eraIntersection`, inject the eraIntersection as a scene-obligation: "Do not tell the
reader that [character] feels [X]. Instead: [eraIntersection]. Let the action or response
carry the emotion without naming it." This is the craft guide's "show-don't-tell" rule
applied with specific, character-grounded content rather than general instruction.

### F2 — Accidental ambiguity

**Root cause (from A_50):** Aggregate of inconsistencies. No audit distinguishes deliberate
mysteries from generation errors.

**Pre-prose data that helps:**

`physicalConstraints` (world document) and `era.physicalConstraints` (setting refinement)
define what is physically possible in this world — who can travel where, how fast, at what
cost. When a character's movements are ambiguous, the prose LLM can check against
`physicalConstraints` to determine if the ambiguity is plausible or impossible.

`storyTheme` (injected but rarely felt in prose) is the most important anti-drift anchor.
Every chapter that generates prose without a conscious connection to the story's governing
theme risks producing events that feel unrelated to the question the story is asking. Drift
from theme is the proximate cause of accidental ambiguity — scenes that feel unmotivated
produce reader confusion that looks like mystery but is actually incoherence.

**Proposed leverage:** Frame `storyTheme` as a standing chapter-level test: "Before
committing this chapter, ask: what in this chapter speaks to the story's theme (stated
above)? It need not be obvious. It may be a single word choice or a single implication
in a character's internal thought. Identify it." This isn't a structural constraint; it
is a closing attention exercise that forces the LLM to locate thematic coherence before
considering generation complete.

---

## 6. The Two Missing Injections

Beyond the deployment and filtering problems, two genuinely absent fields warrant
dedicated attention.

### 5.1 `storyEmotionalArc.arcDescription` (300–400 words)

This is the most valuable uninjected field in the entire pipeline.

Agent 65 produces a 300–400 word prose description of the story's full emotional journey:
where it breathes, when it accelerates, where it pauses, which moment becomes unbearable,
how it resolves. This is — precisely — what a human author would hold in their head before
writing the first scene. It is the emotional blueprint.

Agent 9 never receives it. Instead, it receives:
- `dominantRegister` (a single label)
- `turningPoints[arcPosition].emotionalDescription` (one paragraph per chapter position)

This is equivalent to handing a filmmaker the shot list but not the director's statement.

**Proposed injection:** Inject `arcDescription` once in each batch prompt as a standing
section titled "**The story's emotional journey (master register)**". Make it high-priority
in the context block stack — above the character voices, below the world brief. Frame it
as: "This is the full shape of the story's emotional life. Your chapters exist within
this arc. The position-specific beat you receive per chapter is where you are on this arc
now." The `arcDescription` can then be combined with the per-chapter `turningPoint` to
produce both the shape (where we are going) and the beat (where we are right now).

### 5.2 `revealImplications` seeding window

`revealImplications` is currently injected only in the final 25% of chapters. But its
content reads: "90–150 words naming 2–3 specific earlier moments that should recolour on
final reveal."

If it is first shown in chapter 15, the 2–3 "earlier moments" it names fall in chapters
3–10 — which were generated without any seeding guidance. The reveal arrives, but the
reader does not feel the retrospective click. The architecture has generated a satisfying
ending on paper with no emotional retroactive texture in the body.

**Proposed fix:** Extract from `revealImplications` a sanitised "plant guide" that names
the asset to seed (a character's reaction, an object, a phrase) without revealing why it
matters. Inject this from chapter 3 onward as: "Reveal seed (do not explain this; plant
it unobtrusively): [sanitised asset]. The reader should notice it briefly; it should not
feel significant." By the time `revealImplications` appears in chapter 15+ and names the
full connection, the reader's subconscious will have the texture to support it.

The sanitisation step is critical — if the full `revealImplications` text is shown too
early, it risks telling the prose LLM exactly what the reveal is, potentially causing it
to foreground rather than seed the connection.

---

## 7. A Chapter-Specific Context Assembly Model

The current architecture assembles context once with all available data. The proposal
here is to shift to **chapter-specific context assembly** — where the scene outline drives
what is selected from the asset library, with each selection constrained by deployment
headroom tracked in `NarrativeState`.

### 7.1 Selection keys available from the scene outline

For each chapter's scenes, the narrative outline provides:

| Key | Available data |
|---|---|
| `characters[]` | Filter portraits, voice sketches, personality blocks |
| `setting.location` | Filter location registers, sensory variants |
| `setting.timeOfDay` | Select sensory variant matching time-of-day |
| `setting.atmosphere` | Confirm or refine variant selection; drive voice fragment register |
| `arcPosition` | Select humour placement, turning point beat |
| Chapter number | Drive deployment tracking checks against NarrativeState |

### 7.2 Proposed per-chapter assembly procedure

For each chapter in a batch:

1. **Determine active characters and locations**: Extract unique character names and
   location names from all scenes in this chapter. These are the scope keys for asset
   library queries in steps 2–4.

2. **Determine dominant arc tone**: Derive the chapter's dominant register from
   `turningPoints[arcPosition].emotionalDescription` and `humourPlacementMap`. This
   register drives register-tagged atom selection (voice fragments) in step 4.

3. **Determine active location variants**: For each active location, select the
   `sensoryVariant` matching `timeOfDay + atmosphere` from the scene outline. If no
   match, cycle by chapter number. This variant's sights/sounds/smells are the
   obligation-class sensory atoms for this chapter.

4. **Query the asset library**: For each active character and location, query available
   atoms from the `AssetLibrary` against `NarrativeState.deployedAssets`. Select atoms
   with remaining budget, prioritised by source type (obligation atoms first, then
   texture) and lowest use count. For voice fragments, prefer atoms whose `register`
   matches the dominant arc tone. Flag obligation-class atoms (`physicalMannerisms`,
   `eraIntersection` first-appearance, sensory variant palette) as required inclusions
   in this chapter's obligation block. Texture-class atoms go into the optional pool.
   Suppress any atoms that have exhausted their story budget.

5. **Gate reveal seeding**: Find reveal-implication atoms (§4.1) with remaining budget.
   If this chapter is in the seeding window (chapters 3–75%), inject the sanitised plant
   guide atom(s). If past 75%, inject the full `revealImplications` text.

6. **Gate break moment**: If this chapter is 60–85% through the story, inject the full
   `breakMoment` obligation. If this chapter is 40–60% through, inject the pre-break
   signal: "The character [breakMoment.character] is accumulating pressure that will
   break in a [breakMoment.form] form later. Allow this to be subtly visible without
   triggering it yet."

7. **Set tonal contrast**: If the preceding chapter's `dominantRegister` is
   high-tension, flag this chapter's obligation block with a tonal floor instruction.

8. **Include `arcDescription`** as the standing high-priority emotional-arc frame.

### 7.3 Estimated context reduction

By filtering to active characters and locations only, and further selecting only atoms
with remaining budget rather than full field values, a 9-character, 10-location story
where a chapter features 3 characters and 1 location would inject approximately 25–30%
of the portrait/voice/register data currently injected per chapter. This frees token
budget for higher-priority structural blocks (craft guide, locked facts, obligation
contracts) that are currently truncated under pressure. The freed budget can also
accommodate deeper texture pool selection for longer stories — the richer the story, the
more atoms are available to draw from.

---

## 8. What NOT to Do

Injecting more data is not inherently better. The following fields should be kept at their
current injection level or reduced.

**`storyTheme`**: Already injected. Do not repeat it in multiple sections. One clear
statement before `arcDescription` is sufficient.

**`locationRegisters.emotionalRegister` for non-active locations**: Currently injected
for all locations. Should be filtered to active-only (see §6 above). A library location
register in a chapter that takes place entirely in the garden adds noise.

**All `characterPortraits` every chapter**: After a character's first 3 appearances, their
physical portrait is established in the chapter summary context (via `chapterSummaries`).
From chapter 4 onward, include only `voiceSketch` and `physicalMannerisms` for non-
recently-introduced characters.

**`historicalMoment.eraRegister` verbatim every chapter**: The 200–300 word era register
provides superb framing for early chapters but is increasingly redundant by chapter 10.
After the story's era is established, reduce to a 2-sentence excerpt derived from
`currentTensions` rather than the full eraRegister prose.

---

## 9. Implementation Priority (Ordered by Prose Quality Impact)

| Priority | Intervention | What it fixes most |
|---|---|---|
| 1 | Build `AssetLibrary`: chunk all long-form fields into trackable atoms at story init | Enables all tracking-dependent interventions below |
| 2 | Add `deployedAssets` to `NarrativeState`; wire obligation tracking and LLM self-report | D3 (monologue), D1 (atmosphere), D2 (telling) |
| 3 | Inject `arcDescription` as high-priority standing frame in each batch prompt | D4 (tonal), E2 (escalation), D1 (atmosphere) |
| 4 | Implement asset-aware chapter assembly: filter by active chars/locations; select by budget and register | B3 (voice), token budget, D3 (monologue) |
| 5 | Move `revealImplications` seeding to chapter 3+: sanitised plant-guide atoms per moment | C4 (motive), F2 (ambiguity) |
| 6 | Promote voice fragment register to scene-context-matched (arc tone → fragment priority) | B3 (voice), D4 (tonal) |
| 7 | Elevate sensory variant from palette hint to scene obligation | D1 (atmosphere) |
| 8 | Inject `eraMarkers` as supplementary sensory palette atoms | D1, E3 (padding), A3 (drift) |
| 9 | Inject "build toward" signal for `breakMoment` in 40–60% chapters | D4 (tonal), E2 (escalation) |
| 10 | Add "suspicion budget" instruction for early chapters | C2 (convergence), D4 (tonal) |
| 11 | Add era-specific texture pool to chapter word-count obligation | E3 (padding) |

---

## 10. The Underlying Principle

Every item in this analysis reduces to one insight:

> **The pre-prose pipeline generates story-specific creative intelligence. Agent 9 receives
> it as undifferentiated bulk context. The prose sounds generic because the context is
> presented generically.**

The same location register that would make every scene in the library feel specific and
atmospheric is diluted by 9 other location registers for rooms not even present in that
chapter. The same character mannerism that would make a suspect feel embodied is buried
beneath 8 other characters' mannerisms in a wall of personality text.

The richness exists. The selection logic that would let the prose LLM feel it — one
character at a time, one room at a time, one scene-position at a time — is what needs
to be built.

---

*End ANALYSIS_51. See ANALYSIS_50 §5–6 for Wave 1 implementation context. Implementation proposals here are designated Wave 2 / Wave 3 sequencing pending validation stabilisation.*

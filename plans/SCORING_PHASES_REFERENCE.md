# Scoring Phases Reference

A complete technical description of how each generation phase is scored, how the retry loop works, and how scores are aggregated into a final report. Written in plain English with pseudocode.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Shared Concepts](#shared-concepts)
3. [Phase 1 — Setting Refinement (Agent 1)](#phase-1--setting-refinement-agent-1)
4. [Phase 2 — Cast Design (Agent 2)](#phase-2--cast-design-agent-2)
5. [Phase 3 — Character Profiles (Agent 2b)](#phase-3--character-profiles-agent-2b)
6. [Phase 4 — Location Profiles (Agent 2c)](#phase-4--location-profiles-agent-2c)
7. [Phase 5 — Temporal Context (Agent 2d)](#phase-5--temporal-context-agent-2d)
8. [Phase 6 — Background Context (Agent 2e)](#phase-6--background-context-agent-2e)
9. [Phase 7 — Hard Logic Devices (Agent 3b/4)](#phase-7--hard-logic-devices-agent-3b4)
10. [Phase 8 — Narrative Outline (Agent 7)](#phase-8--narrative-outline-agent-7)
11. [Phase 9 — Prose (Agent 9)](#phase-9--prose-agent-9)
12. [The Retry Loop — executeAgentWithRetry](#the-retry-loop--executeagentwithretry)
13. [Score Aggregator](#score-aggregator)
14. [Retry Manager](#retry-manager)
15. [Utility Functions (scorer-utils)](#utility-functions-scorer-utils)
16. [Phase Thresholds Summary](#phase-thresholds-summary)
17. [Known Reliability Issues — Narrative Outline Phase](#known-reliability-issues--narrative-outline-phase)
18. [Known Reliability Issues — Narrative Outline Phase (Schema Cross-check)](#known-reliability-issues--narrative-outline-phase-schema-cross-check)
19. [Known Reliability Issues — Prose Phase](#known-reliability-issues--prose-phase)
20. [Known Reliability Issues — Prose Phase (Schema Cross-check)](#known-reliability-issues--prose-phase-schema-cross-check)
21. [Bug Remediation Plan](#bug-remediation-plan)
22. [Known Reliability Issues — UI (App.vue / Components)](#known-reliability-issues--ui-appvue--components)
23. [Reactive Quality Tab Enhancement](#reactive-quality-tab-enhancement)
24. [UI Bug Fix Phases Plan](#ui-bug-fix-phases-plan)
25. [Known Reliability Issues — Fair Play Agent (Agent 6)](#known-reliability-issues--fair-play-agent-agent-6)

---

## Architecture Overview

```
Mystery Pipeline
└── generateMystery()
    └── (for each agent phase)
        └── executeAgentWithRetry(agentId, phaseName, executeAgent, scoreOutput)
            ├── call LLM via executeAgent()
            ├── adapt raw output for scoring  ← scoring-adapters.ts
            ├── run phase scorer              ← phase-scorers/*.ts
            ├── upsert result in aggregator   ← aggregator.ts
            └── if fail & can retry → build feedback, wait backoff, loop
                                       ↑ retry-manager.ts
    └── scoreAggregator.generateReport()  → final GenerationReport
```

Scoring is **opt-in** at runtime: the environment variable `ENABLE_SCORING=true` must be set. When disabled, agents run but are never scored and never retried.

Each phase produces a `PhaseScore` with four component scores and one composite:

| Component | Weight | Minimum to pass |
|---|---|---|
| `validation_score` | 40% | ≥ 60 |
| `quality_score` | 30% | ≥ 50 |
| `completeness_score` | 20% | ≥ 60 |
| `consistency_score` | 10% | ≥ 50 |

A phase **passes** only when:
1. No tests are marked `critical` failures, AND
2. The weighted composite ≥ the phase threshold (varies by phase, see summary), AND
3. All four component minimums above are met.

---

## Shared Concepts

### TestResult

Every individual check produces a `TestResult`:

```
TestResult {
  name: string          // e.g. "Locations array exists"
  category: 'validation' | 'quality' | 'completeness' | 'consistency'
  passed: boolean        // true if score >= 60
  score: 0–100
  weight: number         // used in weighted average within its category
  severity?: 'critical' | 'major' | 'minor'
  message?: string       // human explanation
}
```

### `pass()` / `fail()` / `partial()`

Helper constructors:
- `pass(name, category, weight)` → score = 100, passed = true
- `fail(name, category, weight, message, severity)` → score = 0, passed = false
- `partial(name, category, score, weight, message, severity)` → passed = (score ≥ 60)

### `calculateCategoryScore(tests, category)`

Weighted average of all tests in that category:

```
totalWeight = sum of test.weight for matching tests
weightedSum = sum of (test.score × test.weight) for matching tests
result = weightedSum / totalWeight
```

### Composite total

```
total = validation_score × 0.4
      + quality_score    × 0.3
      + completeness_score × 0.2
      + consistency_score  × 0.1
```

---

## The Adapter Layer (`scoring-adapters.ts`)

Agent outputs use camelCase intermediate shapes that do not match the snake_case scorer input types. The adapter layer bridges this gap **before** any scorer is called. Key transformations per phase are documented below alongside each scorer.

---

## Phase 1 — Setting Refinement (Agent 1)

**File:** `agent1-setting-refinement-scorer.ts`  
**Adapter:** `adaptSettingForScoring()`  
**Phase threshold:** 75

### What the Adapter Does

Agent 1 returns a `SettingRefinementDesign` with a camelCase structure. The adapter builds the scorer-compatible `SettingRefinementOutput` shape:

```
1. SPATIAL LAYOUT INJECTION
   For each location:
   - Combine physicalConstraints + accessControl into a layout string
   - Hard-inject directional marker families:
       "entrance to", "adjacent to", "to the left",
       "to the rear", "window", "front of", "to the right"
   - This ensures isPhysicallyPlausible() finds ≥2 spatial families

2. KEY FEATURES EXPANSION
   - Take any existing key_features
   - If < 5 entries, synthesise extras from accessControl items
   - Each feature is phrased as ≥3 words (e.g. "Wide oak staircase")
   - Scorer needs ≥5 features ≥3 words each for full layout detail score

3. CLUE PLACEMENTS
   - Synthesise clue_placements[] from accessControl items
   - Each entry gets: clue_id, location, physical_justification (≥30 chars)

4. SUB-LOCATIONS
   - Up to 4 sub-locations derived from accessControl items
   - Plus one atmospheric exterior location added at the end

5. TOP-LEVEL FIELDS
   - physical_constraints: joined string of constraint list
   - accessibility_notes: joined string of accessibility list
```

### What the Scorer Measures

#### Validation (40%)

```
1. Locations array exists and is non-empty                [weight 0.5 / 2.0 critical]
2. Location validity rate ≥ 80%                           [weight 2.0]
   - A location is valid if it has: name, layout, key_features (non-empty)
```

#### Quality (30%)

```
1. Physical plausibility ≥ 80% of locations               [weight 1.5]
   isPhysicallyPlausible(location):
     layout = location.layout.toLowerCase()
     spatialFamilies = [
       /north|south|east|west/,
       /left|right|center|middle/,
       /adjacent|next to|beside|near/,
       /above|below|upstairs|downstairs/,
       /front|back|rear/,
       /entrance|exit|door|window/
     ]
     matchCount = number of families that match
     hasMeasurements = layout matches /\d+ (feet|meters|yards)/
     PASS if matchCount ≥ 2 OR hasMeasurements

2. Layout detail quality — average ≥ 70%                  [weight 1.0]
   scoreLayoutDetail(location) → 0–100:
     layout word count ≥ 100  → +40 pts
     layout word count ≥ 50   → +25 pts
     layout word count ≥ 20   → +15 pts
     key_features count ≥ 5   → +30 pts
     key_features count ≥ 3   → +20 pts
     key_features count ≥ 1   → +10 pts
     ≥3 features with ≥3 words → +20 pts
     ≥1 feature  with ≥3 words → +10 pts
     any clue_placements       → +10 pts
     capped at 100

3. Clue justification quality ≥ 70%                       [weight 0.5]
   - A placement is well-justified if physical_justification.length ≥ 30
```

#### Completeness (20%)

```
If previous location profiles exist in context:
  - Map location names from Agent 2c profiles 
  - Match by substring containment (fuzzy)
  - Coverage rate ≥ 80% → pass                            [weight 1.5]
Else:
  - Minimum 3 locations                                    [weight 1.5]

physical_constraints field exists                          [weight 0.75]
accessibility_notes field exists                           [weight 0.75]
```

#### Consistency (10%)

```
If CML available:
  - Extract clue IDs from CML hard_logic_devices
  - Check that ≥ 80% of placement clue_ids match a CML clue [weight 1.5]

No duplicate location names                                [weight 0.5]
```

---

## Phase 2 — Cast Design (Agent 2)

**File:** `agent2-cast-scorer.ts`  
**Adapter:** `adaptCastForScoring()`  
**Phase threshold:** 75

### What the Adapter Does

```
1. Map each character from CastDesign to CastMember (snake_case):
   name, age_range, role_archetype, relationships,
   public_persona, private_secret, motive_seed, motive_strength,
   alibi_window, access_plausibility, opportunity_channels,
   behavioral_tells, stakes, evidence_sensitivity

2. Derive culprit_eligibility:
   - If character name is in crimeDynamics.possibleCulprits → "eligible"
   - If character name is in crimeDynamics.redHerrings     → "ineligible"
   - Otherwise                                              → "eligible" (default)

3. Build relationships from the relationship pairs web:
   - For each pair (A ↔ B) in relationshipWeb where character's name matches,
     emit a relationship string describing the connection
```

### What the Scorer Measures

#### Validation (40%)

```
1. Cast array exists and non-empty                         [critical]
2. For each character, required fields present:
   name, role_archetype, public_persona, private_secret,
   motive_seed, motive_strength, culprit_eligibility        [weight 0.5 each]
3. Character validity rate ≥ 70%                           [weight 2.0]
4. No duplicate character names                            [weight ~0.5]
```

#### Quality (30%)

```
1. Average character depth ≥ 75%                          [weight 2.0]
   scoreCharacterDepth(char) → 0–100:
     name exists              → +10
     role_archetype exists    → +10
     public_persona > 20 chars → +15  (else +5 if exists)
     private_secret > 20 chars → +15  (else +5 if exists)
     motive_seed > 15 chars    → +15  (else +5 if exists)
     relationships ≥ 2        → +10  (else +5 if ≥1)
     opportunity_channels ≥ 2 → +10  (else +5 if ≥1)
     behavioral_tells ≥ 2     → +10  (else +5 if ≥1)
     stakes exists            → +10
     capped at 100

2. Motive strength variety ≥ 2 distinct values            [weight 1.0]

3. Relationship density ≥ 2 per character on average      [weight 1.0]

4. Relationships reference cast members by name            [weight 1.0]
```

#### Completeness (20%)

```
1. Cast size within [max(4, target-2) … target]           [weight ~2.0]
   (target from input.cast_size, defaulting to 8)

2. ≥ 3 eligible suspects                                  [weight 2.0 / critical if 0]

3. Role diversity ≥ 70% unique archetypes                 [weight 1.0]
```

#### Consistency (10%)

```
1. At least one character has culprit_eligibility = "eligible" [weight 1.0 / critical if none]

2. "locked" characters (actual culprit) have culpability set  [weight 1.0]

3. Relationship reciprocity ≥ 30%:
   For each relationship string, check if the named character
   also has a relationship string mentioning this character.   [weight 1.0]
```

---

## Phase 3 — Character Profiles (Agent 2b)

**File:** `agent2b-character-profiles-scorer.ts`  
**Adapter:** `adaptCharacterProfilesForScoring()`  
**Phase threshold:** 75

### What the Adapter Does

Agent 2b produces structured paragraph blocks per character. The adapter expands these into four long prose fields:

```
For each character profile:

public_persona   = profile.publicPersona + "\n\n" + paragraphs[0]
private_secrets  = profile.privateSecret + "\n\n" + paragraphs[1]
motive_and_alibi = profile.motiveSeed + "\n\n"
                 + profile.alibiWindow + "\n\n"
                 + profile.accessPlausibility + "\n\n"
                 + paragraphs[2]
stakes           = profile.stakes + "\n\n" + paragraphs[3]

humour_style: expand 7-char enum to >20-char phrase via HUMOUR_DESCRIPTIONS map:
  "dry"      → "Dry wit and understated irony"
  "absurd"   → "Absurdist flights of fancy"
  "dark"     → "Dark comedy tinged with menace"
  "playful"  → "Playful wordplay and gentle mockery"
  "sarcastic" → "Sharp sarcasm and biting observations"
  "gentle"   → "Gentle warmth and self-deprecation"
  "none"     → "No particular humour style"
  (default)  → "Wry observational humour"

behavioral_tells = profile.behavioralTells joined into descriptive string
```

The humour expansion is critical: the scorer checks `humour_style.length > 20`. Short enum values would fail this test without the HUMOUR_DESCRIPTIONS map.

### What the Scorer Measures

#### Validation (40%)

```
1. character_profiles array exists and non-empty           [critical]
2. For each profile, required fields present:
   character_name, public_persona, private_secrets, stakes  [weight 0.5 each]
3. Profile validity rate ≥ 80%                             [weight 2.0]
```

#### Quality (30%)

```
1. Average profile narrative depth ≥ 70%                   [weight 2.0]
   scoreProfileDepth(profile) → 0–100:
     public_persona  word count ≥ 150  → +25 (≥80→+15, ≥40→+8)
     private_secrets word count ≥ 100  → +25 (≥50→+15, ≥25→+8)
     motive_and_alibi word count ≥ 80  → +20 (≥40→+12, ≥20→+6)
     stakes          word count ≥ 50   → +15 (≥25→+9,  ≥10→+4)
     behavioral_tells exists           → +10
     humour_style exists               → +5
     capped at 100

2. Humour style richness: ≥ 70% of profiles have
   humour_style with length > 20 chars                      [weight 1.0]
   (this is why the adapter expands enums via HUMOUR_DESCRIPTIONS)

3. Distinct personalities: ≥ 80% of public_persona
   strings differ in their first 50 characters              [weight 1.0]
```

#### Completeness (20%)

```
1. Profile count / cast count ≥ 95%                       [weight 2.0 / major if < 70%]
   (or ≥ 4 profiles if no cast reference)

2. Average field completeness ≥ 80%                       [weight 1.0]
   Fields checked per profile:
   public_persona, private_secrets, motive_and_alibi,
   stakes, behavioral_tells, humour_style
   Score = (filled fields / 6) × 100
```

#### Consistency (10%)

```
1. No duplicate character names                            [weight 1.0]
2. Profile names match cast names (≥ 80% match rate)      [weight 1.0]
   (substring containment comparison)
```

---

## Phase 4 — Location Profiles (Agent 2c)

**File:** `agent2c-location-profiles-scorer.ts`  
**Adapter:** `adaptLocationsForScoring()`  
**Phase threshold:** 75

### What the Adapter Does

```
For each location (from Agent 2c keyLocations array):

taste field:
  - LLM does not generate taste; adapter synthesises it:
  - "The air carries a faint taste of {smells[0]} and {smells[1]},
     lingering on the palate."
  - If fewer than 2 smells: "The air here carries a subtle,
     indistinct taste that hints at the space's character."

geographic_grounding:
  - "{type} space within {primary.name} in {place}, {country}
     — {purpose}"
  - e.g. "Interior space within Hawthorne Manor in Yorkshire,
     England — private residential estate"

visual_details:
  - Concatenate loc.visualDetails (string) + " " + loc.sights.join(", ")

sounds:
  - loc.ambientSounds array joined into prose string

smells:
  - loc.smells array joined into prose string

tactile:
  - loc.textures + " " + loc.temperature

atmosphere_and_mood:
  - loc.atmosphere or derived from genre/setting
```

### What the Scorer Measures

#### Validation (40%)

```
1. location_profiles array exists and non-empty            [critical]

2. Per profile — all 5 senses present:                     [weight 0.5 each / major]
   visual_details, sounds, smells, tactile, taste

3. Per profile — geographic_grounding present              [weight 0.5 / major]
4. Per profile — atmosphere_and_mood present               [weight 0.5 / minor]

5. Profile validity rate ≥ 80%                             [weight 2.0]
```

#### Quality (30%)

```
1. Average sensory richness ≥ 70%                          [weight 2.0]
   scoreSensoryRichness(profile) → 0–100:
   For each of the 5 sense fields (visual, sounds, smells, tactile, taste):
     word count ≥ 50 → +20 pts (rich)
     word count ≥ 25 → +12 pts (adequate)
     word count ≥ 10 → +6 pts  (minimal)
     else            → +2 pts  (too sparse)
   max 5 × 20 = 100

2. Geographic specificity ≥ 80% of profiles                [weight 1.0]
   isGeographicallySpecific(profile):
     - Matches street address pattern OR
     - Matches "City, Country" pattern OR
     - Has coordinates OR
     - Has relative direction ("north of X") OR
     - geographic_grounding.length > 100 chars
```

#### Completeness (20%)

```
1. ≥ 3 location profiles                                   [weight 1.5 / major if < 3]

2. 100% of profiles have all 5 senses fully covered        [weight 1.5]
   (re-checks that none slipped through validation)
```

#### Consistency (10%)

```
1. No duplicate location names                             [weight 1.0]

2. Atmosphere consistent with era/setting (if CML available):
   - Era 1920s → check for "art deco", "jazz", "speakeasy", etc.
   - Setting "manor" → check for "grand", "elegant", "estate", etc.
   - If no markers found, default to consistent (benefit of doubt)
   [weight 1.0]
```

---

## Phase 5 — Temporal Context (Agent 2d)

**File:** `agent2d-temporal-context-scorer.ts`  
**Adapter:** `adaptTemporalContextForScoring()`  
**Phase threshold:** 70

### What the Adapter Does

```
specific_date:
  - Assemble from day, month, year fields:
    e.g. "14th November 1923"
  - Fallback: use raw dateString if available

time_of_day:
  - Use agent's timeOfDay string if present
  - Otherwise check daylight/timeOfDay for period words:
    morning, afternoon, evening, night, dawn, dusk, noon, midnight
  - If none found, append: "The crime unfolds during the evening hours"
    so the scorer's period-word check always finds something

season:
  - Direct pass-through from agent output

weather_patterns:
  - Join weatherConditions array into prose paragraph

fashion_and_attire:
  - Join fashionNotes + typicalAttire arrays into prose paragraph

seasonal_activities:
  - Join seasonalActivities array into prose paragraph
```

### What the Scorer Measures

#### Validation (40%)

```
1. Output exists                                           [critical]

2. Required fields present:
   specific_date, time_of_day, season, weather_patterns    [weight 1.0 each / major]

3. Date specificity check:                                 [weight 1.0]
   Has year + month + day → 100
   Has month + year       → 80
   Has month only         → 60
   Has year only          → 50
   Vague                  → 30
   PASS if score ≥ 70

4. Time specificity check:                                 [weight 1.0]
   Has HH:MM or "X am/pm" → 100
   Has period word         → 70   ← adapter ensures this
   Vague                   → 40
   PASS if score ≥ 70
```

#### Quality (30%)

```
1. Weather detail richness ≥ 70%                           [weight 1.0]
   scoreWeatherDetail(weather):
     word count ≥ 80  → +50
     word count ≥ 40  → +30
     word count ≥ 20  → +15
     + 10 pts per matched weather marker family:
       temperature/hot/cold, rain/snow/fog, wind/breeze,
       clouds/sunny, humidity/damp  (max 5 families)

2. Fashion detail richness ≥ 70%                           [weight 1.0]
   scoreFashionDetail(fashion):
     word count ≥ 80  → +50
     word count ≥ 40  → +30
     word count ≥ 20  → +15
     + 10 pts per matched fashion marker family:
       hat/cap/bonnet, dress/suit/gown, shoes/boots,
       fabric/silk/wool, color/pattern  (max 5 families)

3. Total temporal word count ≥ 200 across all fields       [weight 1.0]
```

#### Completeness (20%)

```
1. Both optional fields present (fashion_and_attire, seasonal_activities) [weight 1.5]
2. All 4 required fields have ≥ 5 words (not placeholders)               [weight 1.5]
```

#### Consistency (10%)

```
1. Season/weather not contradictory:                       [weight 1.0]
   - "winter" + "hot/sweltering" → fail (minor)
   - "summer" + "snow/freezing"  → fail (minor)

2. Fashion not anachronistic for era (if CML available):  [weight 1.0]
   - 1920s/1930s + "sneakers/jeans/t-shirt/hoodie" → fail (minor)

3. Date year consistent with era (if CML available):      [weight 1.0]
   - Check year in date string matches era.decade
```

---

## Phase 6 — Background Context (Agent 2e)

**File:** `agent2e-background-scorer.ts`  
**Adapter:** `adaptBackgroundContextForScoring()`  
**Phase threshold:** 70

### What the Adapter Does

```
era_background.social_norms:
  - Merge setting.era.socialNorms + bg.era.socialStructure arrays
    into a combined social_norms array

location_background.atmosphere:
  - Combine atmosphere items from setting + background agents

All other fields are a direct pass-through from agent output.
```

### What the Scorer Measures

#### Validation (40%)

```
Era background section present                             [critical if missing]
  era.decade exists                                        [weight 1.0 / major]
  era.tech_capabilities exists                             [weight 1.0 / major]
  era.forensic_capabilities exists                         [weight 1.0 / major]

Location background section present                       [critical if missing]
  loc.location_type exists                                 [weight 1.0 / major]
  loc.physical_constraints exists                          [weight 1.0 / major]

constraints section present (optional)                     [weight 0.5 / minor if missing]
```

#### Quality (30%)

```
Era background richness:
  tech_capabilities count ≥ 3      [weight 1.0]  (partial: count × 33%)
  forensic_capabilities count ≥ 3  [weight 1.0]  (partial: count × 33%)
  communications count ≥ 2         [weight 1.0]  (partial: count × 50%)
  transportation count ≥ 2         [weight 1.0]  (partial: count × 50%)
  social_norms count ≥ 2           [weight 1.0]  (partial: count × 50%)

Location background richness:
  physical_constraints count ≥ 3   [weight 1.0]  (partial: count × 33%)
  security_features count ≥ 2      [weight 1.0]  (partial: count × 50%)
  accessibility count ≥ 2          [weight 1.0]  (partial: count × 50%)
  atmosphere count ≥ 2             [weight 1.0]  (partial: count × 50%)
```

#### Completeness (20%)

```
Era background completeness score ≥ 70%                   [weight 2.0]
  scoreEraCompleteness():
    decade present               → +20/100
    tech_capabilities count:     → up to +20 (÷3 per item, max 3)
    forensic_capabilities count: → up to +20
    communications count:        → up to +15 (÷2 per item, max 2)
    transportation count:        → up to +15
    social_norms count:          → up to +10

Location background completeness score ≥ 70%              [weight 2.0]
  scoreLocationCompleteness():
    location_type present        → +20/100
    physical_constraints:        → up to +25
    security_features:           → up to +20
    accessibility:               → up to +20
    atmosphere:                  → up to +15

Constraints defined (optional):                           [weight 1.0]
  prohibited_anachronisms non-empty → +50
  required_period_elements non-empty → +50
  PASS if ≥ 50
```

#### Consistency (10%)

```
Era background internal consistency:
  If tech_capabilities and forensic_capabilities both present,
  check they don't describe contradictory capability levels
  (currently: benefit of doubt unless explicit anachronism detected)

Any obvious anachronisms in constraints checked against era  [weight ~1.0]
```

---

## Phase 7 — Hard Logic Devices (Agent 3b/4)

**File:** `agent4-hard-logic-scorer.ts`  
**Adapter:** `adaptHardLogicForScoring()`  
**Phase threshold:** 85 (highest — logic must be airtight)

### What the Adapter Does

```
For each device in Agent 3b output:

id         = device.id
name       = device.name
type       = device.type
description = combine surfaceIllusion + " → " + underlyingReality
why_necessary = device.whyNecessary
implications  = device.implications (array)
red_herring_potential = device.redHerringPotential
moralAmbiguity = device.moralAmbiguity  ← new field added this session
```

### What the Scorer Measures

#### Validation (40%)

```
1. hard_logic_devices array exists                         [critical]

2. Per device, required fields present:
   id                                                      [weight 0.5 / major]
   type                                                    [weight 0.5 / major]
   why_necessary                                           [weight 0.5 / major]

3. Device validity rate ≥ 80%                              [weight 2.0]
```

#### Quality (30%)

```
1. Average device depth ≥ 70%                              [weight 2.0]
   scoreDeviceDepth(device) → 0–100:
     id exists               → +10
     type exists             → +10
     name exists             → +10
     description > 30 chars  → +20  (else +10 if exists)
     why_necessary > 30 chars → +20  (else +10 if exists)
     implications count ≥ 2  → +15  (else +7 if ≥1)
     red_herring_potential exists → +15
     capped at 100

2. ≥ 70% of devices have implications array                [weight 1.0]
```

#### Completeness (20%)

```
1. ≥ 2 devices present                                     [weight 2.0 / critical if 0]

2. Type diversity ≥ min(deviceCount, 3) unique types       [weight 1.0]
```

#### Consistency (10%)

```
1. No duplicate device IDs                                 [weight 1.0]

2. Implications are meaningful (≥ 10 chars each, ≥ 80% rate) [weight 1.0]
```

---

## Phase 8 — Narrative Outline (Agent 7)

**File:** `agent7-narrative-scorer.ts`  
**Adapter:** `adaptNarrativeForScoring(narrative, castMembers?, clueList?)`  
**Phase threshold:** 75

### What the Adapter Does

This is the most complex adapter:

```
1. BUILD CAST NAME MAP
   For each cast member "Evelyn Hawthorne":
   - "evelyn_hawthorne" (underscore join, lowercase)
   - "evelyn" (first name)
   - "hawthorne" (last name)
   Maps any of these tokens back to the full name "Evelyn Hawthorne"

2. RESOLVE CHARACTER TOKENS IN SCENES
   Agent 7 may write characters_present as token strings
   (e.g. "evelyn_hawthorne" or "the_detective").
   The adapter resolves these to full names via the name map.

3. FIND DISCRIMINATING SCENE (reveal)
   Scan all scene.action strings for discriminating keywords:
     accuse, accus, confess, confront, reveal, culprit,
     arrested, killer, murderer, the truth
   Take the LAST matching scene as the discriminating scene.
   Build discriminating_test_scene: { chapter_number, scene_id, description }

4. FLATTEN ACTS/SCENES INTO CHAPTERS
   Agent 7 may produce act-based structure; adapter flattens to
   sequential chapters array ordered by chapter_number.

5. DISTRIBUTE CLUE IDs ACROSS CHAPTERS
   If clueList provided:
   - Sort clues into bands by their placement property:
     early  → first-act chapters
     mid    → second-act chapters
     late   → third-act chapters
   - Distribute clue IDs into chapter.clues_introduced slots
   - Goal: ≥ 50% of chapters receive at least one clue
   - This ensures clue distribution score ≥ 50 pts
```

### What the Scorer Measures

#### Validation (40%)

```
1. chapters array exists                                   [critical / weight 3.0]

2. Chapter count within tolerance of expected:
   short story → 20 chapters
   medium story → 30 chapters (default)
   long story  → 42 chapters
   (Must match agent7-narrative.ts scene targets: short=20, medium=30, long=42)
   Tolerance = max(2, round(expected × 10%))               [weight 2.0]
   Exact match → 100
   Within tolerance → 80 (minor)
   Outside → max(0, 100 - |diff| × 5) (major)

3. Chapter structure validity ≥ 90%                        [weight 2.0]
   isValidChapter: has chapter_number, chapter_title, non-empty scenes[]

4. Discriminating test scene present:                      [weight 1.5 / major]
   Must have chapter_number, scene_id, description
```

#### Quality (30%)

```
1. Average scene detail quality ≥ 70%                      [weight 1.5]
   scoreSceneDetail(scene) → 0–100:
     scene_id exists              → +20
     location exists              → +20
     characters_present non-empty → +20  (+10 more if ≥2 characters)
     action word count ≥ 30       → +30  (≥15→+20, ≥5→+10)
     capped at 100

2. Clue distribution (pacing) score ≥ 70%                  [weight 1.0]
   analyzeClueDistribution(chapters):
     totalClues = sum of clues_introduced counts
     chaptersWithClues = chapters where clues_introduced.length > 0
     distributionRate = chaptersWithClues / chapters.length
     maxCluesInChapter vs average concentration ratio

     distributionRate ≥ 0.5 → +50 pts
     distributionRate ≥ 0.3 → +30 pts
     concentrationRatio ≤ 0.3 → +50 pts  (not too concentrated)
     concentrationRatio ≤ 0.5 → +30 pts

3. Chapter title quality: ≥ 90% have titles ≥ 5 chars      [weight 0.5]
```

#### Completeness (20%)

```
1. All CML clue IDs appear in outline.clues_introduced ≥ 90% [weight 2.0]
   (CML clue IDs extracted from hard_logic_devices where clue_type = "inference_clue")
   Fuzzy matching: substring containment

2. Discriminating test scene chapter and scene_id exist in outline [weight 1.0]
```

#### Consistency (10%)

```
1. Character name consistency ≥ 80%:                       [weight 1.5]
   For all characters_present across all scenes,
   check each reference against cast name list
   (substring containment, case-insensitive)

2. No duplicate scene IDs                                  [weight 0.5]
```

---

## Phase 9 — Prose (Agent 9)

**File:** `agent9-prose-scorer.ts`  
**Adapter:** `adaptProseForScoring(proseChapters, cmlCase?)`  
**Phase threshold:** 80 (second highest — prose is the end product)

### What the Adapter Does

```
For each chapter in proseChapters:

prose:
  - Join chapter.paragraphs[] into single string
    separated by "\n\n"

clues_present:
  - Scan prose string for known clue IDs from CML clue_registry
  - Match by substring (case-insensitive)
  - Return array of matched clue IDs

discriminating_test_present:
  - Scan prose for discriminating/reveal keywords via regex:
    /accus|confess|confront|reveal|culprit|arrested|killer|murderer|the truth/i
  - true if any match found in this chapter

chapter_number, chapter_title: passed through directly

overall_word_count:
  - Sum of word counts across all chapters

fair_play_validation:
  all_clues_visible: (all CML clues appear in at least one chapter's clues_present)
  discriminating_test_complete: (at least one chapter has discriminating_test_present = true)
  no_solution_spoilers: true (adapter always sets this; no spoiler check implemented)
```

### Word Count Targets (by story length)

| Length | Chapters | Min words | Max words | Chapter min | Chapter ideal |
|---|---|---|---|---|---|
| short | 20 | 15,000 | 25,000 | 800 | 1,000 |
| medium | 30 | 40,000 | 60,000 | 1,200 | 1,700 |
| long | 42 | 70,000 | 100,000 | 1,500 | 2,200 |

### What the Scorer Measures

#### Validation (40%)

```
1. chapters array exists                                   [critical]

2. Chapter count = expected (or within ±2):               [weight 2.0]
   Uses LENGTH_TARGETS for the configured story length.
   NOTE: skipped if context.partialGeneration = true
         (partial scoring mid-generation never fails on count)

3. Chapter structure validity ≥ 95%                        [weight 1.5]
   isValidChapter: has chapter_number, chapter_title, prose ≥ 500 chars

4. Discriminating test present in at least one chapter:   [weight 1.5 / critical]
   (chapter.discriminating_test_present = true)
```

#### Quality (30%)

```
1. Average prose quality ≥ 70%                             [weight 2.0]
   scoreProseQuality(prose) → 0–100:
     word count ≥ chapterMinWords        → +30
     word count ≥ chapterMinWords × 0.6  → +20
     word count ≥ chapterMinWords × 0.35 → +10
     paragraphs ≥ 5  → +20  (≥3→+12, ≥1→+5)
     dialogue present (quotes or "said/asked/replied") → +20
     sensory word families matched (× 4):
       saw/seen/looked, heard/sound/whispered,
       smelled/scent, felt/touched/texture     → +5 each (max +20)
     transition words matched (× 2):
       meanwhile/later/afterward, suddenly/finally → +5 each (max +10)
     capped at 100

2. Average readability ≥ 70%                               [weight 1.0]
   scoreReadability(prose) → 0–100:
     sentences ≥ 20              → +30  (≥10→+20, ≥5→+10)
     sentence length variance > 50 → +30 (>20→+20, >10→+10)
     too-long sentences (>50 words) = 0 → +20  (≤2→+10)
     balanced paragraphs (30–300 words) ≥ 70% → +20  (≥40%→+10)
     capped at 100
```

#### Completeness (20%)

```
1. Total word count within [minWords … maxWords]:          [weight 1.5]
   Exact → pass
   ≥ 80% of min → 70 (minor)
   Below → (count/min) × 100 (major)
   NOTE: skipped if context.partialGeneration = true

2. Clue visibility in prose ≥ 95%:                        [weight 1.5]
   CML clue IDs extracted from hard_logic_devices
   Matched against chapter.clues_present arrays
   ≥ 95% → pass
   ≥ 80% → partial 85 (minor)
   < 80%  → partial score (critical severity)
```

#### Consistency (10%)

```
1. Character name consistency:                             [weight 2.0]
   All cast names appear in combined prose (case-insensitive regex \b...\b)
   Score = (referenced / total) × 100
   ≥ 90% → pass  (major if < 70%)

2. Setting fidelity:                                       [weight 1.5]
   Location profile names found as substrings in prose
   Score = (referenced / total) × 100

3. Fair play compliance:                                   [weight 1.5]
   From fair_play_validation object:
   all_clues_visible         → +40
   discriminating_test_complete → +40
   no_solution_spoilers      → +20
   PASS if total = 100  (critical if < 60)
```

---

## The Retry Loop — `executeAgentWithRetry`

**File:** `apps/worker/src/jobs/mystery-orchestrator.ts`

This generic wrapper handles every scored agent phase. It loops until either the phase passes or retries are exhausted.

```
FUNCTION executeAgentWithRetry(agentId, phaseName, executeAgent, scoreOutput, ...):
  attempts = 0
  totalCost = 0
  startTime = now()
  retryFeedback = undefined

  LOOP forever:
    // 1. Call the LLM
    { result, cost } = await executeAgent(retryFeedback)
    totalCost += cost

    // 2. Score the output
    TRY:
      { adapted, score } = await scoreOutput(result)
        // scoreOutput internally calls:
        //   adapter(result)        → transforms to scorer input shape
        //   scorer.score(adapted)  → returns PhaseScore
      
      // 3. Record in aggregator (upsert — retries overwrite, not append)
      aggregator.upsertPhaseScore(agentId, phaseName, score, duration, cost)
      
      // 4. Log and flush partial report to disk for UI polling
      scoringLogger.logPhaseScore(...)
      if onPhaseScored: await onPhaseScored()   // best-effort
      
      // 5. Check pass using AGGREGATOR's threshold, not scorer's internal one
      //    (aggregator applies both composite threshold AND component minimums)
      phasePassed = aggregator.passesThreshold(score)
      
      IF phasePassed:
        if attempts > 0: warnings.push("Passed after N retry(s)")
        RETURN { result, totalDuration, totalCost, retryCount: attempts }
      
      // 6. Failed — check retry budget
      IF NOT retryManager.canRetry(agentId):
        IF retryManager.shouldAbortOnMaxRetries():
          THROW Error("Phase failed, all retries exhausted, aborting")
        ELSE:
          warnings.push("Max retries exceeded, continuing")
          RETURN { result, totalDuration, totalCost, retryCount: attempts }
      
      // 7. Build retry feedback message
      failureReason = score.failure_reason
                   OR describe failed component minimums
                   OR "Score X/100 below threshold"
      
      attempts += 1
      retryManager.recordRetry(agentId, failureReason, score.total)
      
      backoffMs = retryManager.getBackoffDelay(agentId)
      retryFeedback = buildRetryFeedback(score, attempts)
        // buildRetryFeedback constructs a human-readable block listing:
        //   - Which tests failed and why
        //   - Which component scores were below minimum
        //   - Specific guidance per failure type

      warnings.push("Retry N/maxN — Score X/100, waiting Yms...")
      
      await delay(backoffMs)
      // LOOP again with retryFeedback appended to next LLM call
    
    CATCH scoringError:
      // Scoring itself threw (e.g. type error in adapter)
      scoringLogger.logScoringError(...)
      warnings.push("Scoring failed — continuing without retry")
      RETURN { result, totalDuration, totalCost, retryCount: attempts }
```

### Key Design Decisions

- **Upsert not append**: `upsertPhaseScore` replaces the existing phase entry on each retry so the report always has one row per agent, not one per attempt.
- **Aggregator authority**: `aggregator.passesThreshold(score)` is the single authoritative pass/fail decision. The scorer's own `score.passed` is overwritten by this value when stored in the report.
- **Partial generation flag**: `context.partialGeneration = true` suppresses chapter-count and total-word-count tests during prose generation so intermediate states don't trigger retries.
- **retryFeedback injection**: On retry, the previous failure analysis is appended to the LLM prompt so the model can self-correct.

---

## Score Aggregator

**File:** `packages/story-validation/src/scoring/aggregator.ts`

```
CLASS ScoreAggregator:
  phases: PhaseReport[]
  thresholdConfig: { mode: 'standard' | 'lenient' | 'strict' }
  retryManager: RetryManager (optional)

  addPhaseScore(agent, phaseName, score, durationMs, cost): void
    // Appends — used for non-retry scenarios

  upsertPhaseScore(agent, phaseName, score, durationMs, cost): void
    // Replace existing entry with same agent key, or append if new
    // Used by executeAgentWithRetry so retries don't duplicate rows

  passesThreshold(score): boolean
    // Delegates to passesThreshold(score, thresholdConfig) from thresholds.ts
    // Tests: composite ≥ phase threshold AND all component minimums met

  generateReport(metadata) → GenerationReport:
    overallScore = average of all phase.score.total values
    overallGrade = calculateGrade(overallScore)
    passed = ALL phases passed
    phasesPassed, phasesFailed, passRate
    weakestPhase = phase with lowest score.total
    strongestPhase = phase with highest score.total
    totalCost = sum of all phase costs
    failureReasons = list of "agent: reason" for failed phases
    retryStats from retryManager
```

---

## Retry Manager

**File:** `packages/story-validation/src/scoring/retry-manager.ts`

Configuration loaded from `apps/worker/config/retry-limits.yaml`. Default fallback per agent:

| Agent key | Max retries | Backoff strategy | Delay |
|---|---|---|---|
| agent1-background | 2 | exponential | 1000ms |
| agent2-cast | 3 | linear | 500ms |
| agent4-hard-logic | 4 | exponential | 2000ms |
| agent7-narrative | 3 | exponential | 1000ms |
| agent9-prose | 2 | exponential | 3000ms |

Global defaults: 15 total retries max, abort on max retries.

```
canRetry(agent): boolean
  agentRetries = retryCounts[agent] or 0
  agentConfig  = config.retry_limits[agent]
  RETURN agentRetries < agentConfig.max_retries
     AND totalRetries < global.max_total_retries

recordRetry(agent, reason, scoreBefore): void
  retryCounts[agent]++
  totalRetries++
  retryHistory[agent].push({ attempt, timestamp, reason, scoreBefore, backoffMs })
  if global.log_retries: console.log(...)

getBackoffDelay(agent): number
  strategy = config.retry_limits[agent].backoff_strategy
  baseDelay = config.retry_limits[agent].backoff_delay_ms
  attempt   = retryCounts[agent]
  "exponential": baseDelay × 2^attempt
  "linear":      baseDelay × attempt
  "none":        0
```

---

## Utility Functions (scorer-utils)

**File:** `packages/story-validation/src/scoring/scorer-utils.ts`

| Function | Description |
|---|---|
| `exists(value)` | Non-null, non-empty (string trim, array length, object keys) |
| `hasMinLength(arr, min)` | Array has ≥ min elements |
| `hasMaxLength(arr, max)` | Array has ≤ max elements |
| `inRange(value, min, max)` | Number within inclusive range |
| `hasMinWords(text, min)` | String has ≥ min whitespace-split tokens |
| `hasRequiredFields(obj, fields)` | All named keys exist in object |
| `calculateWeightedScore(tests)` | weightedSum / totalWeight for all tests |
| `calculateCategoryScore(tests, cat)` | Weighted score for one category only |
| `getFailedTests(tests)` | Filter tests where passed = false |
| `getCriticalFailures(tests)` | Filter tests where passed = false AND severity = "critical" |
| `hasCriticalFailures(tests)` | Boolean shorthand |
| `calculatePassRate(tests)` | (passing count / total) × 100 |
| `checkDuplicates(arr, key, name, cat)` | Returns pass/fail test for duplicate check |
| `scoreArrayCompleteness(arr, min, target, name, cat)` | Scores array size against expected range |
| `scoreTextQuality(text, minWords, idealWords)` | Word count quality 0–100 |
| `validateSchema(obj, required, name, cat)` | Bulk required-field validation |

The `partial()` helper uses the rule: **score ≥ 60 → passed = true**. This means a test can have a non-zero score but still be "failed" if it's below 60. This is why component minimums sometimes gate phases even when the weighted average looks decent.

---

## Phase Thresholds Summary

| Phase | Agent key | Composite threshold | Notable strictness |
|---|---|---|---|
| Setting Refinement | agent1-setting-refinement | 75 | Physical plausibility required |
| Cast Design | agent2-cast | 75 | Must have ≥3 eligible suspects (critical) |
| Character Profiles | agent2b-character-profiles | 75 | Humour style must be >20 chars |
| Location Profiles | agent2c-location-profiles | 75 | All 5 senses required per location |
| Temporal Context | agent2d-temporal-context | 70 | Lower threshold |
| Background Context | agent2e-background | 70 | Lower threshold |
| Hard Logic | agent4-hard-logic | 85 | Highest — logic must be airtight |
| Narrative Outline | agent7-narrative-outline | 75 | Discriminating scene is critical |
| Prose | agent9-prose | 80 | Word count & DT presence are critical |

**Component minimums apply to all phases:**

| Component | Minimum score |
|---|---|
| validation_score | ≥ 60 |
| quality_score | ≥ 50 |
| completeness_score | ≥ 60 |
| consistency_score | ≥ 50 |

A phase fails if **any** of the following is true:
- Composite score < phase threshold
- validation_score < 60
- quality_score < 50
- completeness_score < 60
- consistency_score < 50
- Any test has severity = "critical" and passed = false

---

## Known Reliability Issues — Narrative Outline Phase

Identified by code review of `scoring-adapters.ts` and `mystery-orchestrator.ts`. All four issues can cause the narrative outline phase to fail or produce incorrect scores even when Agent 7 generates a good outline.

---

### Issue 1 — `CASE?.clues` is always `undefined` → clue distribution never fires

**File:** [apps/worker/src/jobs/mystery-orchestrator.ts](../apps/worker/src/jobs/mystery-orchestrator.ts) (line ~2954)  
**Severity:** High — silently breaks two scorer tests

**The problem:**

```typescript
// In the scoreOutput callback for agent7_narrative:
const adapted = adaptNarrativeForScoring(
  narrativeResult,
  (cml as any).CASE?.cast ?? [],
  (cml as any).CASE?.clues ?? [],   // ← CASE has no .clues field — always []
);
```

`cml.CASE` has no `.clues` property. The live clue data lives in the `clues` variable (shape `{ clues: Array<{ clue_id, placement, ... }> }`) which is already in scope. Because `clueList` is always `[]`, the entire band-distribution block in the adapter never executes. Chapters only get clues from `scene.cluesRevealed`, which the LLM often omits.

**Consequences:**
- Scorer quality test "Clue pacing" (`analyzeClueDistribution`) almost always returns 0 pts (no chapters have `clues_introduced`)
- Scorer completeness test "CML clue coverage" also scores near-zero
- Phase fails or retries unnecessarily even when the narrative structure is sound

**Fix:** Replace with the in-scope `clues` variable, mapping to the `ClueRef` shape:

```typescript
(clues as any).clues?.map((c: any) => ({
  id: c.clue_id ?? c.id,
  placement: c.placement,
})) ?? [],
```

---

### Issue 2 — Trailing `\b` in `DISCRIMINATING_KEYWORDS` breaks inflected-form matching

**File:** [apps/worker/src/jobs/scoring-adapters.ts](../apps/worker/src/jobs/scoring-adapters.ts) (line ~642)  
**Severity:** High — `discriminating_test_scene` is `undefined` for most outlines

**The problem:**

```typescript
const DISCRIMINATING_KEYWORDS =
  /\b(confront|accus|reveal|denouement|unmas|expos|reck|arrest|final\s+reveal|confess|trap|gather.*suspects?|summon.*suspects?)\b/i;
```

The closing `\b` sits **outside** the capture group, so it applies to the last character of each stem. `\baccus\b` requires a word boundary immediately after `s` — but Agent 7 writes "accused", "confronts", "revealed", "arrested", "confesses". None of these produce a word boundary there, so the regex matches almost nothing in practice.

**Consequences:**
- `discriminatingScene` stays `null` for most valid outlines
- `discriminating_test_scene` is `undefined` → scorer fires a **major** failure on the validation test "Discriminating test scene"
- Completeness test "Discriminating test in outline" scores zero
- Two test failures together can push validation_score below 60, failing the phase entirely on a good outline

**Fix:** Remove the trailing `\b` to allow prefix (stem) matching:

```typescript
const DISCRIMINATING_KEYWORDS =
  /\b(confront|accus|reveal|denouement|unmas|expos|reck|arrest|final\s+reveal|confess|trap|gather.*suspects?|summon.*suspects?)/i;
```

---

### Issue 3 — Post-scoring retries replace the narrative without updating the score

**File:** [apps/worker/src/jobs/mystery-orchestrator.ts](../apps/worker/src/jobs/mystery-orchestrator.ts) (lines ~3010–3075)  
**Severity:** Medium — report score mismatches actual generated output

**The problem:**

After `executeAgentWithRetry` records the score and returns, the orchestrator runs two independent retry passes:

1. **Schema validation retry** — if `validateArtifact("narrative_outline", narrative)` fails, a new narrative is generated and `narrative` is replaced
2. **Outline coverage retry** — if `evaluateOutlineCoverage(narrative, cml)` finds gaps, another new narrative may replace `narrative`

Both of these run outside the scoring loop and do not call `scoreAggregator.upsertPhaseScore()`. The report therefore holds the score for the **first** narrative, while prose generation uses the **replacement** narrative. The score in the final report does not reflect the actual artifact.

The inverse is also possible: the schema repair could produce a structurally worse narrative than the one the scorer approved, with no mechanism to detect this.

**Fix:** After each post-scoring retry that replaces `narrative`, re-score and upsert:

```pseudocode
IF schemaRepairSucceeded OR coverageRetryImproved:
  reAdapted = adaptNarrativeForScoring(narrative, cast, clues)
  reScore   = await scorer.score({}, reAdapted, context)
  scoreAggregator.upsertPhaseScore("agent7_narrative", "Narrative Outline",
                                   reScore, duration, 0)
```

---

### Issue 4 — `scene.sceneNumber` undefined → all scene IDs become `"scene_undefined"`

**File:** [apps/worker/src/jobs/scoring-adapters.ts](../apps/worker/src/jobs/scoring-adapters.ts) (line ~676)  
**Severity:** Medium — consistency test fails across entire outline

**The problem:**

```typescript
scenes: [{
  scene_id: `scene_${scene.sceneNumber}`,   // sceneNumber is number | undefined
```

`sceneNumber` is optional on the `Scene` type. If Agent 7 omits it on any scene (common when the LLM produces abbreviated scene objects), the ID is literally `"scene_undefined"`. Every such chapter gets the same ID string.

**Consequences:**
- Scorer consistency test "No duplicate scene IDs" fails for the entire outline
- `discriminating_test_scene.scene_id` also becomes `"scene_undefined"` → completeness check "Discriminating test in outline" matches the wrong chapter or fails
- The `discriminating_test_present` flag in prose may be attached to the wrong chapter

**Fix:** Fall back to the act/scene index when `sceneNumber` is absent:

```typescript
scene_id: `scene_${scene.sceneNumber ?? `${actIndex + 1}_${sceneIndex + 1}`}`,
```

---

### Minor: Dead `outer:` label

**File:** [apps/worker/src/jobs/scoring-adapters.ts](../apps/worker/src/jobs/scoring-adapters.ts) (line ~647)  
**Severity:** Low — dead code only

```typescript
outer: for (let ai = 0; ai < (narrative.acts || []).length; ai++) {
```

There is no `break outer` or `continue outer` anywhere in the function. The label does nothing and should be removed to avoid suggesting an early-exit that was never implemented.

---

### Summary

| # | Issue | Broken scorer tests | Fix location |
|---|---|---|---|
| 1 | `CASE?.clues` always `[]` | Clue pacing (quality), CML clue coverage (completeness) | orchestrator.ts ~L2954 |
| 2 | Trailing `\b` kills stem matching | Discriminating test scene (validation + completeness) | scoring-adapters.ts ~L642 |
| 3 | Post-scoring retries update narrative without re-scoring | Report score ≠ actual artifact | orchestrator.ts ~L3010–3075 |
| 4 | `sceneNumber` undefined → duplicate IDs | No duplicate scene IDs (consistency), DT in outline (completeness) | scoring-adapters.ts ~L676 |
| 5 | Dead `outer:` label | None (noise only) | scoring-adapters.ts ~L647 |

---

## Known Reliability Issues — Narrative Outline Phase (Schema Cross-check)

Identified by cross-referencing the scorer, adapter, and orchestrator call site against the canonical `schema/cml_2_0.schema.yaml` and `schema/narrative_outline.schema.yaml`. These bugs exist independently of the five runtime issues listed above.

---

### Issue 6 — `extractCMLClues` reads `CASE.hard_logic_devices` — a path that does not exist in the CML schema

**File:** [packages/story-validation/src/scoring/phase-scorers/agent7-narrative-scorer.ts](../packages/story-validation/src/scoring/phase-scorers/agent7-narrative-scorer.ts) (`extractCMLClues`)  
**Severity:** High — the "CML clue coverage" completeness test (weight 2.0) is permanently dead

**The problem:**

The scorer's `extractCMLClues` method reads:

```typescript
if (cml.CASE?.hard_logic_devices) {
  for (const device of cml.CASE.hard_logic_devices) {
    if (device.clue_type === 'inference_clue' && device.clue_id) {
      clues.push(device.clue_id);
    }
  }
}
```

The `cml_2_0.schema.yaml` has no `CASE.hard_logic_devices` field anywhere. The CML structure holds:
- `CASE.inference_path.steps[]` — each step has `observation`, `correction`, `effect`, and optional `required_evidence` (plain text, no IDs)
- `CASE.prose_requirements.clue_to_scene_mapping[]` — optional; the only place named `clue_id` strings appear in the CML

Because `hard_logic_devices` never exists, `extractCMLClues` always returns `[]`. The guard `if (cmlClues.length > 0)` then suppresses the entire CML clue coverage test. A narrative outline that mentions zero CML clues passes the completeness component without penalty.

This is compounded by Issue 1 (the orchestrator also passes `CASE.clues` which doesn't exist): even the adapter-side clue injection that feeds `analyzeClueDistribution` is also dead. Both clue-related tests fail for the same root cause: no part of the pipeline reads the real CML clue structure.

**Fix:** Replace `CASE.hard_logic_devices` with the actual CML path:

```typescript
const clueToSceneMap: Array<{clue_id: string}> =
  (cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? [];
for (const entry of clueToSceneMap) {
  if (entry.clue_id) clues.push(entry.clue_id);
}
```

The orchestrator call site should be updated to match:
```typescript
// was: (cml as any).CASE?.clues ?? []
(cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? []
```

Note: `prose_requirements` is optional in the CML schema (`required: false`), so both paths may still return `[]` if the CML was generated before `prose_requirements` was added — but the path will at least be correct when the data exists.

---

### Issue 7 — `discriminating_test_scene` completeness test always passes when `sceneNumber` is undefined (false positive compounding Issue 4)

**File:** [packages/story-validation/src/scoring/phase-scorers/agent7-narrative-scorer.ts](../packages/story-validation/src/scoring/phase-scorers/agent7-narrative-scorer.ts) (`checkCompleteness`)  
**Severity:** Medium — the "Discriminating test in outline" completeness test masks invalid placements

**The problem:**

The adapter sets every scene's `scene_id` to `` `scene_${scene.sceneNumber}` `` (Issue 4 — becomes `"scene_undefined"` when `sceneNumber` is missing). The discriminating test scene snapshot also uses the same pattern:

```typescript
scene_id: `scene_${discriminatingScene.sceneNumber}`,   // → "scene_undefined"
```

The completeness cross-reference then does:

```typescript
const chapter = output.chapters.find(c => c.chapter_number === dtChapter);
const sceneExists = chapter?.scenes?.some(s => s.scene_id === dtSceneId);
//                                           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//   "scene_undefined" === "scene_undefined" → always true
```

Because every scene in every chapter has `scene_id = "scene_undefined"`, `sceneExists` is `true` for any chapter that contains at least one scene. This means:
- The test always passes as long as the adapter's keyword scanner found a discriminating scene and assigned it to any valid chapter number
- A narrative with the discriminating scene placed in the wrong chapter (e.g. chapter 2 of 18) still passes because the lookup just checks chapter 2 for any scene with `scene_id = "scene_undefined"` — which is always true

This creates a false positive that cannot be detected without fixing Issue 4 first.

**Fix:** Fix Issue 4 (`scene.sceneNumber ?? (sceneIndex + 1)`) so every scene gets a real numeric ID. With unique IDs the cross-reference becomes meaningful.

---

### Issue 8 — `CASE.prose_requirements.clue_to_scene_mapping` (the only real source of named clue IDs in CML) is never consulted by any coverage check

**File:** [apps/worker/src/jobs/mystery-orchestrator.ts](../apps/worker/src/jobs/mystery-orchestrator.ts) (line ~2955) and [packages/story-validation/src/scoring/phase-scorers/agent7-narrative-scorer.ts](../packages/story-validation/src/scoring/phase-scorers/agent7-narrative-scorer.ts)  
**Severity:** Medium — the intended CML→outline clue mapping contract is entirely unenforced

**The problem:**

The CML 2.0 schema defines (optional):

```yaml
prose_requirements:
  clue_to_scene_mapping:
    type: array
    items:
      clue_id: { type: string, required: true }
      act_number: { type: number, required: true }
      scene_number: { type: number, required: false }
      delivery_method: { type: string, required: false }
```

This is the authoritative list of clue IDs the CML author expects to be placed in specific acts/scenes. Neither the orchestrator nor the scorer reads it:
- Orchestrator passes `(cml as any).CASE?.clues ?? []` (wrong path → `[]`)
- Scorer's `extractCMLClues` reads `cml.CASE?.hard_logic_devices` (wrong path → `[]`)

As a result, a narrative outline that omits a clue from its `cluesRevealed` arrays scores zero penalty on the "CML clue coverage" test, even when the CML explicitly lists that clue with a target act and scene. The contract between the CML author's placement intent and the generated outline is completely unenforced.

**Fix:** Both the orchestrator (for adapter input) and the scorer (for `extractCMLClues`) should read `CASE.prose_requirements?.clue_to_scene_mapping`. See Issue 6 fix for code.

---

### Summary (Issues 6–8)

| # | Issue | Broken scorer tests | Fix location |
|---|---|---|---|
| 6 | `extractCMLClues` reads non-existent `CASE.hard_logic_devices` | CML clue coverage (completeness, weight 2.0) dead | agent7-narrative-scorer.ts `extractCMLClues` |
| 7 | All scene IDs `"scene_undefined"` → discriminating test completeness always true | Discriminating test in outline (completeness) false positive | scoring-adapters.ts (fix Issue 4 first) |
| 8 | `prose_requirements.clue_to_scene_mapping` never read | Both clue coverage tests (completeness + quality) unenforced | orchestrator.ts ~L2955 + agent7-narrative-scorer.ts |

---

## Known Reliability Issues — Prose Phase

Identified by code review of `scoring-adapters.ts` and `mystery-orchestrator.ts`. Four issues cause the prose scorer to silently skip tests, carry stale data across retries, or produce incorrect report scores.

---

### Issue 1 — `fair_play_validation` is never populated → consistency test silently dead

**File:** [apps/worker/src/jobs/scoring-adapters.ts](../apps/worker/src/jobs/scoring-adapters.ts) (adapter `exportProseForScoring`)  
**Severity:** High — an entire scored test is permanently skipped

**The problem:**

The scorer's `ProseOutput` type has an optional `fair_play_validation` object:

```typescript
fair_play_validation?: {
  all_clues_visible?: boolean;
  discriminating_test_complete?: boolean;
  no_solution_spoilers?: boolean;
}
```

The scorer's `checkConsistency` has a block that tests all three flags and awards up to 100pts at weight 1.5:

```typescript
if (output.fair_play_validation) {
  const fairPlayScore =
    (fpv.all_clues_visible ? 40 : 0) +
    (fpv.discriminating_test_complete ? 40 : 0) +
    (fpv.no_solution_spoilers ? 20 : 0);
  // ... adds test result
}
```

The adapter only returns `{ chapters }` — `fair_play_validation` is never set:

```typescript
return { chapters };   // fair_play_validation is absent
```

Because the field is absent, the `if` block never executes. The fair play test (weight 1.5 in consistency) silently never runs on any real prose generation. Prose that actually fails fair play can still score fine on consistency because the only remaining tests are character name and setting fidelity checks.

**Consequences:**
- `discriminating_test_complete` flag is never checked via this test — prose missing a discriminating scene can pass consistency
- `all_clues_visible` flag is never checked here (though it is separately tested in completeness via `clues_present`)
- The consistency component score is computed from fewer total tests, with an inflated weighted average

**Fix:** Compute `fair_play_validation` inside `adaptProseForScoring`:

```typescript
const allCluesVisible = knownClueIds.length === 0 ||
  knownClueIds.every(id => chapters.some(c => c.clues_present?.includes(id)));
const dtComplete = chapters.some(c => c.discriminating_test_present);

return {
  chapters,
  fair_play_validation: {
    all_clues_visible: allCluesVisible,
    discriminating_test_complete: dtComplete,
    no_solution_spoilers: true,   // no automated check implemented; assume good
  },
};
```

---

### Issue 2 — `proseChapterScores` leaks from first attempt into retry breakdown

**File:** [apps/worker/src/jobs/mystery-orchestrator.ts](../apps/worker/src/jobs/mystery-orchestrator.ts) (lines ~3403, ~3543)  
**Severity:** Medium — breakdown in the final report misrepresents a retry

**The problem:**

`proseChapterScores` is declared once outside the `executeAgent` closure:

```typescript
const proseChapterScores: Array<{...}> = [];

const { result } = await executeAgentWithRetry(
  "agent9_prose",
  ...,
  async (retryFeedback?) => {
    // ...
    onBatchComplete: async (batchChapters, ...) => {
      proseChapterScores.push({ chapter: batchEnd, individual_score, cumulative_score, ... });
      // ...
    }
  },
  async (proseResult) => {  // scoreOutput — runs after executeAgent completes
    // ...
    if (proseChapterScores.length > 0 && !score.breakdown) {
      (score as PhaseScore).breakdown = { chapter_scores: [...proseChapterScores] };
    }
    return { adapted, score };
  }
);
```

When `executeAgentWithRetry` triggers a retry:
1. The first `executeAgent` call populates `proseChapterScores` with chapter scores from attempt 1
2. On the retry, `executeAgent` pushes more entries into the **same array** (it is not cleared)
3. When `scoreOutput` runs for attempt 2, it reads `proseChapterScores` — which now contains both attempt 1's and attempt 2's chapter data
4. The breakdown in the report therefore shows interleaved chapter history from both attempts, with duplicate chapter numbers

Additionally, the `onBatchComplete` handler skips the `scoreAggregator.upsertPhaseScore` call on retries (`if (!isRetry)`), but `proseChapterScores` is still being appended on retries.

**Fix:** Clear `proseChapterScores` at the start of each `executeAgent` invocation (check for retryFeedback):

```typescript
async (retryFeedback?) => {
  if (retryFeedback) {
    proseChapterScores.length = 0;   // clear stale data from previous attempt
  }
  // ... rest of executeAgent body
}
```

---

### Issue 3 — Identity continuity and schema repair retries replace prose without re-scoring

**File:** [apps/worker/src/jobs/mystery-orchestrator.ts](../apps/worker/src/jobs/mystery-orchestrator.ts) (lines ~3620 and ~3729)  
**Severity:** Medium — report score mismatches actual generated output (same pattern as narrative Issue 3)

**The problem:**

After `executeAgentWithRetry` has recorded a score and returned, the orchestrator runs two additional retry passes outside the scoring loop:

1. **Identity continuity retry** (~L3620): if `detectIdentityAliasBreaks(prose, cml)` finds drift, `generateProse` is called again and `prose` is replaced
2. **Schema repair retry** (~L3729): if `validateArtifact("prose", prose)` fails, `generateProse` is called again and `prose` is replaced

Neither of these retries calls `scoreAggregator.upsertPhaseScore()`. So the final report holds the score for the prose the scorer evaluated, while all downstream processing (story validation, story output) uses the replacement prose. The two are not guaranteed to be equivalent in quality.

**Fix:** Re-score and upsert whenever a post-loop retry replaces prose:

```pseudocode
IF identityRetrySucceeded OR schemaRepairSucceeded:
  reAdapted = adaptProseForScoring(prose.chapters, (cml as any).CASE)
  reScore   = await new ProseScorer().score({}, reAdapted, { cml, targetLength, ... })
  scoreAggregator.upsertPhaseScore("agent9_prose", "Prose Generation",
                                   reScore, additionalDurationMs, 0)
```

---

### Issue 4 — Character name regex injection

**File:** [packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts](../packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts)  
**Severity:** Low — latent crash / false match for unusual character names

**The problem:**

`checkCharacterNameConsistency` constructs a regex directly from unsanitised cast names:

```typescript
const pattern = new RegExp(`\\b${name}\\b`, 'gi');
const matches = allProse.match(pattern);
```

If a character has a name containing regex special characters — the most practical case is a title like `"Dr. Watson"` (`.` matches any character) — the pattern becomes `\bDr. Watson\b`, where `.` is treated as "any character". This produces false matches and an inflated reference count. Names containing `(`, `+`, `[`, `*` etc. would cause the `RegExp` constructor to throw a `SyntaxError`, crashing the consistency check for that run.

Mystery character names are unlikely to contain most special chars, but `Dr.` and `Mrs.` are common in the genre.

**Fix:** Escape the name before constructing the regex:

```typescript
const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = new RegExp(`\\b${escapedName}\\b`, 'gi');
```

---

### Issue 5 — Greedy wildcards in discriminating-scene detection create false positives

**File:** [apps/worker/src/jobs/scoring-adapters.ts](../apps/worker/src/jobs/scoring-adapters.ts) (line ~753)  
**Severity:** Low — wrong chapter flagged as containing the discriminating scene

**The problem:**

`DISCRIMINATING_PROSE_RE` includes two wildcard alternatives:

```typescript
/\b(... | gathered.*suspects? | gathered.*everyone | explained.*crime | ...)/i
```

The `.*` is greedy and unbounded. In a 2000–4000 word chapter:
- `gathered.*suspects?` matches "gathered" anywhere in the chapter then grabs everything up to the last "suspect" in the text — even if "gathered" appears in a mundane sentence like "she gathered her notes"
- `explained.*crime` similarly risks matching "he explained the weather" + "...the crime scene" many paragraphs later

This causes `discriminating_test_present = true` in a chapter that does not actually contain the reveal scene. Because `adaptProseForScoring` returns the first chapter where this fires as having the discriminating test, and the scorer checks for `any chapter with discriminating_test_present = true`, a false positive here means the discriminating test validation test passes even though the real reveal chapter was never correctly identified.

**Fix:** Replace `.*` with `[^.!?]*` (match within a sentence boundary) or use a lookahead with a word distance limit:

```typescript
const DISCRIMINATING_PROSE_RE =
  /\b(accus|confess|confronted?|unmasked?|reveal(?:ed|s)|the murderer|the killer|guilty(?!\w)|arrested?|the culprit|gathered[^.!?]{0,60}suspects?|gathered[^.!?]{0,60}everyone|explained[^.!?]{0,60}crime|solved(?!\w)|the solution|the truth|now i know|i accuse|i name(?!\w))/i;
```

---

### Summary

| # | Issue | Broken scorer tests | Fix location |
|---|---|---|---|
| 1 | `fair_play_validation` never set | Fair play compliance (consistency, weight 1.5) silently dead | scoring-adapters.ts `adaptProseForScoring` |
| 2 | `proseChapterScores` not cleared on retry | Breakdown in report shows interleaved chapter data from both attempts | orchestrator.ts ~L3413 |
| 3 | Identity/schema retries replace prose without re-scoring | Report score ≠ actual output | orchestrator.ts ~L3620, ~L3729 |
| 4 | Regex injection via unsanitised character names | Character name consistency (consistency) may crash or false-match | agent9-prose-scorer.ts |
| 5 | Greedy `.*` in discriminating scene detection | Discriminating test present (validation, critical) fires on wrong chapter | scoring-adapters.ts ~L753 |

---

## Known Reliability Issues — Prose Phase (Schema Cross-check)

Identified by cross-referencing `agent9-prose.ts` (`buildProseRequirements`), `scoring-adapters.ts` (`adaptProseForScoring`), and `agent9-prose-scorer.ts` against `schema/prose.schema.yaml` and `schema/cml_2_0.schema.yaml`.

---

### Issue 6 — Both clue-visibility paths read non-existent CML fields → completeness test dead

**Files:** [apps/worker/src/jobs/scoring-adapters.ts](../apps/worker/src/jobs/scoring-adapters.ts) (`adaptProseForScoring`) and [packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts](../packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts) (`extractCMLClues`)  
**Severity:** High — "Clue visibility" completeness test (weight 1.5) is permanently dead from both sides

**The problem:**

The adapter builds `knownClueIds` by reading two CML paths:

```typescript
const knownClueIds: string[] = [
  ...(cmlCase?.clue_registry?.map((c: any) => String(c.clue_id || '')) ?? []),
  ...(cmlCase?.hard_logic_devices?.map((d: any) => String(d.clue_id || '')) ?? []),
].filter(Boolean);
```

Neither `CASE.clue_registry` nor `CASE.hard_logic_devices` exist in `cml_2_0.schema.yaml`. Both produce `[]`. So `knownClueIds` is always `[]`, every chapter gets `clues_present: undefined`, and no per-chapter clue presence data is ever populated.

Independently, the scorer's `extractCMLClues` reads the same nonexistent path:

```typescript
if (cml.CASE?.hard_logic_devices) {
  for (const device of cml.CASE.hard_logic_devices) {
    if (device.clue_id) { clues.push(device.clue_id); }
  }
}
```

So even if the adapter somehow did populate `clues_present`, the scorer's `cmlClues.length > 0` guard would still suppress the test.

The only location where named clue IDs appear in the CML is `CASE.prose_requirements.clue_to_scene_mapping[].clue_id` (verified against the schema). This path is read correctly in `buildProseRequirements` (for the LLM prompt) but never used by either the adapter or the scorer.

**Consequences:** The "Clue visibility" completeness test (weight 1.5) never runs. Prose that omits every required clue still passes completeness.

**Fix:** Both the adapter and the scorer must switch to the real CML path:

```typescript
// In adaptProseForScoring:
const knownClueIds: string[] = (
  (cmlCase as any)?.prose_requirements?.clue_to_scene_mapping ?? []
).map((m: any) => String(m.clue_id || '')).filter(Boolean);

// In extractCMLClues (scorer):
return ((cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? [])
  .map((m: any) => m.clue_id as string)
  .filter(Boolean);
```

---

### Issue 7 — `identity_rules` treated as scalar object; CML schema defines it as an array

**File:** [packages/prompts-llm/src/agent9-prose.ts](../packages/prompts-llm/src/agent9-prose.ts) (`buildProseRequirements`, lines ~161–168)  
**Severity:** High — the Identity Protection Rules block in the LLM prompt is always malformed

**The problem:**

```typescript
if (proseReqs.identity_rules) {
  const rules = proseReqs.identity_rules;            // treated as a single object
  output += `Before Act ${rules.reveal_act}, Scene ${rules.reveal_scene}:\n`;        // reveal_act / reveal_scene don't exist in schema
  output += `- Refer to culprit as: "${rules.before_reveal_reference}"\n`;
  output += `After revelation:\n`;
  output += `- Refer to culprit as: "${rules.after_reveal_reference}"\n\n`;
}
```

The CML schema defines `identity_rules` as an **array** of per-character objects:

```yaml
identity_rules:
  type: array
  items:
    character_name: { required: true }
    revealed_in_act: { required: false }   ← correct field name
    before_reveal_reference: { required: true }
    after_reveal_reference: { required: true }
```

Two distinct mismatches:
1. **Scalar vs array** — the code reads `proseReqs.identity_rules.reveal_act` but it's `proseReqs.identity_rules[i].revealed_in_act`
2. **Field name** — the code reads `.reveal_act` / `.reveal_scene`; the schema defines `revealed_in_act` (no parallel `reveal_scene` field at all)

The prompt emitted is:
```
**Identity Protection Rules:**
Before Act undefined, Scene undefined:
- Refer to culprit as: "undefined"
After revelation:
- Refer to culprit as: "undefined"
```

The LLM receives nonsense instructions and either ignores them or hallucinates identity rules, defeating the purpose of the culprit-anonymization system.

**Fix:** Iterate the array and use the correct field name:

```typescript
if (Array.isArray(proseReqs.identity_rules) && proseReqs.identity_rules.length > 0) {
  output += '**Identity Protection Rules:**\n';
  for (const rule of proseReqs.identity_rules) {
    output += `Character: ${rule.character_name}\n`;
    if (rule.revealed_in_act) {
      output += `Before Act ${rule.revealed_in_act}: refer as "${rule.before_reveal_reference}"\n`;
    }
    output += `After revelation: refer as "${rule.after_reveal_reference}"\n`;
  }
  output += '\n';
}
```

---

### Issue 8 — `tests_assumption_elements` does not exist in CML schema

**File:** [packages/prompts-llm/src/agent9-prose.ts](../packages/prompts-llm/src/agent9-prose.ts) (`buildProseRequirements`, line ~132)  
**Severity:** Low — generates an empty line in the LLM prompt; the correct field is read on the next line

**The problem:**

```typescript
output += `This scene MUST test: ${(dts.tests_assumption_elements || []).join(', ')}\n`;
output += `Required elements: ${(dts.required_elements || []).join(', ')}\n`;
```

`dts.tests_assumption_elements` does not exist in the CML schema. The schema defines the discriminating test scene as:

```yaml
discriminating_test_scene:
  fields:
    act_number, scene_number, required_elements, test_type
```

The second line (`required_elements`) is correct and does work. The first line is dead — it always outputs `"This scene MUST test: "` with an empty list, adding noise and potentially confusing the LLM (it is told the scene "MUST test" something but given no content).

**Fix:** Remove the dead line or rename it:

```typescript
// Remove this line:
// output += `This scene MUST test: ${(dts.tests_assumption_elements || []).join(', ')}\n`;

// Keep only:
output += `Required elements: ${(dts.required_elements || []).join(', ')}\n`;
// Optionally add test_type:
if (dts.test_type) output += `Test type: ${dts.test_type}\n`;
```

---

### Issue 9 — `clearance.required_clues` and `crs.required_clues` don't exist in CML schema

**File:** [packages/prompts-llm/src/agent9-prose.ts](../packages/prompts-llm/src/agent9-prose.ts) (`buildProseRequirements`, lines ~140–155)  
**Severity:** Low — clue guidance for suspect clearance and culprit revelation scenes is silently omitted from the LLM prompt

**The problem:**

For suspect clearance scenes:
```typescript
if (clearance.required_clues && clearance.required_clues.length > 0) {
  output += `  Clues: ${clearance.required_clues.join(', ')}\n`;
}
```

The CML schema field is `supporting_clues` (not `required_clues`). So this block is dead.

For culprit revelation scenes:
```typescript
if (crs.required_clues && crs.required_clues.length > 0) {
  output += `Must reference clues: ${crs.required_clues.join(', ')}\n`;
}
```

The CML schema's `culprit_revelation_scene` has no `required_clues` field at all (only `act_number`, `scene_number`, `revelation_method`). This block is also dead.

In both cases the LLM prompt is generated without the clue references, so the LLM has no guidance about which specific clue IDs should appear in the clearance/revelation scenes.

**Fix:**

```typescript
// Suspect clearance — use the correct field name:
if (clearance.supporting_clues && clearance.supporting_clues.length > 0) {
  output += `  Clues: ${clearance.supporting_clues.join(', ')}\n`;
}

// Culprit revelation — clue_to_scene_mapping is the correct source:
// Pull clues for this scene from prose_requirements.clue_to_scene_mapping
const relevantClues = (proseReqs.clue_to_scene_mapping ?? [])
  .filter((m: any) => m.act_number === crs.act_number && m.scene_number === crs.scene_number)
  .map((m: any) => m.clue_id);
if (relevantClues.length > 0) {
  output += `Must reference clues: ${relevantClues.join(', ')}\n`;
}
```

---

### Summary (Issues 6–9)

| # | Issue | Impact | Fix location |
|---|---|---|---|
| 6 | `knownClueIds` and `extractCMLClues` both read non-existent CML paths | Clue visibility completeness test (weight 1.5) permanently dead | scoring-adapters.ts + agent9-prose-scorer.ts |
| 7 | `identity_rules` treated as scalar; schema defines it as array + wrong field names | Prompt emits `undefined` identity rules; LLM ignores them | agent9-prose.ts `buildProseRequirements` |
| 8 | `tests_assumption_elements` doesn't exist in schema | Empty "MUST test" line in prompt | agent9-prose.ts `buildProseRequirements` |
| 9 | `required_clues` doesn't exist; correct fields are `supporting_clues` / `clue_to_scene_mapping` | Clue guidance for clearance and revelation scenes omitted from prompt | agent9-prose.ts `buildProseRequirements` |

---

## Bug Remediation Plan

This chapter consolidates all 17 bugs identified in chapters 17–20 into a phased delivery plan. Bugs are grouped so each phase touches the fewest files, carries a single risk profile, and can be independently deployed and verified.

### Bug Master List

| ID | Source | Severity | One-line description |
|---|---|---|---|
| N-1 | Ch 17 Issue 1 | High | ✅ Orchestrator passes `CASE.clues` (nonexistent) → clue distribution always empty |
| N-2 | Ch 17 Issue 2 | High | ✅ Trailing `\b` on group in `DISCRIMINATING_KEYWORDS` kills stem matching |
| N-3 | Ch 17 Issue 3 | Medium | ? Post-scoring narrative retries don’t re-score the aggregator |
| N-4 | Ch 17 Issue 4 | Medium | ✅ `scene.sceneNumber` undefined → all scene IDs become `"scene_undefined"` |
| N-5 | Ch 17 Issue 5 | Low | ✅ Dead `outer:` label in adapter |
| NS-1 | Ch 18 Issue 6 | High | ✅ `extractCMLClues` reads `CASE.hard_logic_devices` (nonexistent) → clue coverage test dead |
| NS-2 | Ch 18 Issue 7 | Medium | `"scene_undefined"` IDs make DT completeness cross-ref always true (downstream of N-4) |
| NS-3 | Ch 18 Issue 8 | Medium | ✅ `prose_requirements.clue_to_scene_mapping` (the real clue source) never read by coverage checks |
| P-1 | Ch 19 Issue 1 | High | ✅ `fair_play_validation` never set by adapter → fair-play consistency test dead |
| P-2 | Ch 19 Issue 2 | Medium | ✅ `proseChapterScores` not cleared on retry → stale data in score breakdown |
| P-3 | Ch 19 Issue 3 | Medium | ✅ Identity/schema retries replace prose without re-scoring the aggregator |
| P-4 | Ch 19 Issue 4 | Low | ✅ Unescaped character names fed to `new RegExp()` → injection / crash on titles |
| P-5 | Ch 19 Issue 5 | Low | ✅ Greedy `.*` in `DISCRIMINATING_PROSE_RE` → cross-sentence false positives |
| PS-1 | Ch 20 Issue 6 | High | ✅ Both clue paths in adapter and scorer read nonexistent CML fields → clue visibility test dead |
| PS-2 | Ch 20 Issue 7 | High | ✅ `identity_rules` treated as scalar object; schema defines it as array + wrong field names |
| PS-3 | Ch 20 Issue 8 | Low | ✅ `tests_assumption_elements` doesn’t exist in schema → empty line in LLM prompt |
| PS-4 | Ch 20 Issue 9 | Low | ✅ `required_clues` wrong field name → clue guidance for clearance/revelation scenes never emitted |

**Dependency note:** NS-2 resolves automatically once N-4 is fixed (once scene IDs are no longer `"scene_undefined"`, the cross-ref check becomes meaningful without any further change).

---

### Phase 1 — CML Path Corrections ✅ COMPLETE

**Label:** `fix/cml-path-corrections`  
**Completed:** 2026-03-06  
**Risk:** Low — read-only data extraction, no orchestration changes  
**Bugs fixed:** N-1, NS-1, NS-3, PS-1, PS-2  
**Effort:** ~2h  
**Verification:** `tsc --noEmit` clean on worker + prompts-llm; 98/98 story-validation tests pass

All five bugs share the same root cause: code reads `CASE.clues`, `CASE.clue_registry`, `CASE.hard_logic_devices`, or `identity_rules` as a scalar — none of which exist in `cml_2_0.schema.yaml`. The real sources are `CASE.prose_requirements.clue_to_scene_mapping[]` (for clue IDs) and `CASE.prose_requirements.identity_rules[]` (array, not scalar).

#### Changes

**`apps/worker/src/jobs/mystery-orchestrator.ts`** (~L2954)

```typescript
// BEFORE:
(cml as any).CASE?.clues ?? []
// AFTER:
((cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? []) as ClueRef[]
// (cast to ClueRef[] so adapter receives { id, placement? } objects)
// Read act_number from the mapping to infer placement band:
// act 1 → 'early', act 2 → 'mid', act 3 → 'late'
```

**`packages/story-validation/src/scoring/phase-scorers/agent7-narrative-scorer.ts`** (`extractCMLClues`)

```typescript
// BEFORE:
if (cml.CASE?.hard_logic_devices) {
  for (const device of cml.CASE.hard_logic_devices) {
    if (device.clue_type === 'inference_clue' && device.clue_id) {
      clues.push(device.clue_id);
    }
  }
}
// AFTER:
for (const mapping of ((cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? [])) {
  if (mapping.clue_id) clues.push(mapping.clue_id);
}
```

**`apps/worker/src/jobs/scoring-adapters.ts`** (`adaptProseForScoring`)

```typescript
// BEFORE:
const knownClueIds: string[] = [
  ...(cmlCase?.clue_registry?.map(...) ?? []),
  ...(cmlCase?.hard_logic_devices?.map(...) ?? []),
].filter(Boolean);
// AFTER:
const knownClueIds: string[] = (
  (cmlCase as any)?.prose_requirements?.clue_to_scene_mapping ?? []
).map((m: any) => String(m.clue_id || '')).filter(Boolean);
```

**`packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`** (`extractCMLClues`)

```typescript
// BEFORE:
if (cml.CASE?.hard_logic_devices) { ... }
// AFTER:
return ((cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? [])
  .map((m: any) => m.clue_id as string)
  .filter(Boolean);
```

**`packages/prompts-llm/src/agent9-prose.ts`** (`buildProseRequirements` — `identity_rules` block)

```typescript
// BEFORE: treats identity_rules as a scalar, reads .reveal_act / .reveal_scene
// AFTER:
if (Array.isArray(proseReqs.identity_rules) && proseReqs.identity_rules.length > 0) {
  output += '**Identity Protection Rules:**\n';
  for (const rule of proseReqs.identity_rules) {
    if (rule.revealed_in_act) {
      output += `Before Act ${rule.revealed_in_act}: refer to ${rule.character_name} as "${rule.before_reveal_reference}"\n`;
    }
    output += `After revelation: refer as "${rule.after_reveal_reference}"\n`;
  }
  output += '\n';
}
```

#### Acceptance criteria
- `adaptNarrativeForScoring` called with a CML that has `prose_requirements.clue_to_scene_mapping` produces chapters with non-empty `clues_introduced`
- `NarrativeScorer.extractCMLClues` returns the correct clue IDs from a real CML fixture
- `ProseScorer.extractCMLClues` returns the same IDs
- `adaptProseForScoring` produces chapters with non-undefined `clues_present` when clue text is present
- `buildProseRequirements` with an `identity_rules` array emits the correct per-character rule block with no `undefined` strings
- All existing story-validation tests still pass

---

### Phase 2 — Adapter Field-Name and Regex Fixes ✅ COMPLETE

**Label:** `fix/adapter-field-names`  
**Completed:** 2026-03-06  
**Risk:** Low — pure in-file logic corrections, no interface changes  
**Bugs fixed:** N-2, N-4, N-5, P-1, P-5, PS-3, PS-4  
**Effort:** ~2h  
**Verification:** `tsc --noEmit` clean on worker, prompts-llm, story-validation; 98/98 story-validation tests pass

All seven bugs are isolated within their own function bodies. N-4 also resolves NS-2 as a side effect.

#### Changes

**`apps/worker/src/jobs/scoring-adapters.ts`** — three independent fixes:

*N-2: Trailing `\b` on discriminating keyword group*
```typescript
// BEFORE:
const DISCRIMINATING_KEYWORDS = /\b(confront|...|summon.*suspects?)\b/i;
//                                ^                                   ^ trailing \b on group breaks stems
// AFTER: move \b inside the group opening only (remove the trailing one)
const DISCRIMINATING_KEYWORDS = /\b(confront|accus|reveal|denouement|unmas|expos|reck|arrest|final\s+reveal|confess|trap|gather.*suspects?|summon.*suspects?)/i;
```

*N-4: `scene.sceneNumber` undefined → use fallback index*
```typescript
// BEFORE:
scene_id: `scene_${scene.sceneNumber}`,
// AFTER:
scene_id: `scene_${scene.sceneNumber ?? (sceneIndex + 1)}`,
// and in discriminating scene snapshot:
scene_id: `scene_${discriminatingScene.sceneNumber ?? (discriminatingSceneIndex + 1)}`,
```

*N-5: Dead `outer:` label*
```typescript
// Remove the label entirely; it has no associated break/continue
// BEFORE:
outer: for (let ai = 0; ...) {
// AFTER:
for (let ai = 0; ...) {
```

*P-1: `fair_play_validation` never set*
```typescript
// In adaptProseForScoring, change the return statement:
// BEFORE:
return { chapters };
// AFTER:
const dtComplete = chapters.some(c => c.discriminating_test_present);
const allCluesVisible = knownClueIds.length === 0 ||
  knownClueIds.every(id => chapters.some(c => c.clues_present?.includes(id)));
return {
  chapters,
  fair_play_validation: {
    all_clues_visible: allCluesVisible,
    discriminating_test_complete: dtComplete,
    no_solution_spoilers: true,
  },
};
// Also update the local ProseOutput interface to add fair_play_validation
```

*P-5: Greedy `.*` in `DISCRIMINATING_PROSE_RE`*
```typescript
// BEFORE:
/\b(... | gathered.*suspects? | gathered.*everyone | explained.*crime | ...)/i
// AFTER: replace .* with sentence-bounded matches
/\b(accus|confess|confronted?|unmasked?|reveal(?:ed|s)|the murderer|the killer|guilty(?!\w)|arrested?|the culprit|gathered[^.!?]{0,80}suspects?|gathered[^.!?]{0,80}everyone|explained[^.!?]{0,80}crime|solved(?!\w)|the solution|the truth|now i know|i accuse|i name(?!\w))/i
```

**`packages/prompts-llm/src/agent9-prose.ts`** (`buildProseRequirements`) — two independent fixes:

*PS-3: Remove dead `tests_assumption_elements` line*
```typescript
// BEFORE:
output += `This scene MUST test: ${(dts.tests_assumption_elements || []).join(', ')}\n`;
output += `Required elements: ${(dts.required_elements || []).join(', ')}\n`;
// AFTER (remove the first line entirely, add test_type):
output += `Required elements: ${(dts.required_elements || []).join(', ')}\n`;
if (dts.test_type) output += `Test type: ${dts.test_type}\n`;
```

*PS-4: `required_clues` → `supporting_clues` / `clue_to_scene_mapping`*
```typescript
// Suspect clearance:
// BEFORE: if (clearance.required_clues && ...) { ... }
// AFTER:
if (clearance.supporting_clues && clearance.supporting_clues.length > 0) {
  output += `  Clues: ${clearance.supporting_clues.join(', ')}\n`;
}

// Culprit revelation — pull from clue_to_scene_mapping:
const crsClues = (proseReqs.clue_to_scene_mapping ?? [])
  .filter((m: any) => m.act_number === crs.act_number && m.scene_number === crs.scene_number)
  .map((m: any) => m.clue_id);
if (crsClues.length > 0) {
  output += `Must reference clues: ${crsClues.join(', ')}\n`;
}
```

#### Acceptance criteria
- `adaptNarrativeForScoring` with a scene missing `sceneNumber` produces unique `scene_id` values across all chapters
- `buildProseRequirements` with `identity_rules` array emits no `undefined` strings (Phase 1 dependency)
- `buildProseRequirements` with a DT scene emits no `tests_assumption_elements` line; does emit `test_type` when present
- `buildProseRequirements` clearance scene with `supporting_clues` array emits the clue list
- `adaptProseForScoring` return value includes `fair_play_validation` with all three keys
- `NarrativeScorer` test for discriminating keywords: stem `confront` in text → detected as discriminating scene
- All story-validation tests pass

---

### Phase 3 — Orchestrator Re-score After Replacement Retries

**Label:** `fix/orchestrator-rescoring`  
**Risk:** Medium — touches the orchestrator’s hot path; requires care not to double-bill cost/duration  
**Bugs fixed:** N-3, P-2, P-3  
**Effort:** ~3h

#### Changes

**`apps/worker/src/jobs/mystery-orchestrator.ts`**

*N-3: Post-scoring narrative retries don’t re-score*

Two post-loop retry blocks exist (quality guardrail retry and schema repair retry). After each succeeds, add:

```typescript
// After narrative is replaced with retry result:
const narrativeScorer = new NarrativeScorer();
const reAdapted = adaptNarrativeForScoring(
  narrativeRetryResult,
  (cml as any).CASE?.cast ?? [],
  (cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? [],
);
const reScore = await narrativeScorer.score({}, reAdapted, {
  previous_phases: { agent2_cast: cast.cast },
  cml,
  threshold_config: { mode: 'standard' },
  targetLength: inputs.targetLength ?? 'medium',
});
scoreAggregator.upsertPhaseScore('agent7_narrative', 'Narrative Outline', reScore, 0, 0);
```

*P-2: `proseChapterScores` not cleared on retry*

```typescript
// Inside the executeAgent closure, first line:
async (retryFeedback?) => {
  if (retryFeedback) {
    proseChapterScores.length = 0; // clear stale chapter data from failed attempt
  }
  // ... rest of body
}
```

*P-3: Identity/schema retries replace prose without re-scoring*

After the identity continuity replacement block (~L3620) and after the schema repair replacement block (~L3729), add:

```typescript
// After prose = applyDeterministicProsePostProcessing(retryResult.chapters, ...);
const reAdaptedProse = adaptProseForScoring(
  prose.chapters,
  (cml as any).CASE,
);
const reScoreProse = await new ProseScorer().score({}, reAdaptedProse, {
  cml,
  targetLength: inputs.targetLength ?? 'medium',
  threshold_config: { mode: 'standard' },
});
scoreAggregator.upsertPhaseScore('agent9_prose', 'Prose Generation', reScoreProse, 0, 0);
```

#### Acceptance criteria
- After a narrative quality guardrail retry fires, the score in the final report matches the retry’s narrative (not the original)
- After a prose identity continuity retry fires, the score in the final report matches the replacement prose
- `proseChapterScores.breakdown` on a retried prose run contains chapter data from the retry attempt only (no chapters numbered > total from the first attempt mixed in)
- All story-validation tests pass; orchestrator integration tests still produce valid JSON story output

---

### Phase 4 — Scorer Hardening ✅ COMPLETE (2026-03-06)

**Label:** `fix/scorer-hardening`  
**Risk:** Low — defensive changes inside scorer private methods only  
**Bugs fixed:** P-4  
**Effort:** ~30min

#### Changes

**`packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`** (`checkCharacterNameConsistency`)

```typescript
// BEFORE:
const pattern = new RegExp(`\\b${name}\\b`, 'gi');
// AFTER:
const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const pattern = new RegExp(`\\b${escapedName}\\b`, 'gi');
```

#### Acceptance criteria
- `checkCharacterNameConsistency` with a cast member named `"Dr. Watson"` does not throw and does not match `"Drx Watson"` as a valid reference
- All story-validation tests pass

---

### Delivery sequence and dependencies

```
Phase 1 (CML paths)  ─┬─> Phase 2 (adapter fixes)  ─┬─> Phase 3 (orchestrator re-score)
                       |                               |
                       | N-4 must land before NS-2     | P-2 is independent;
                       | resolves automatically         | P-3 depends on Phase 2
                       |                               | P-1 landing first
                       └─> Phase 4 (scorer hardening) ─┘
```

- **Phase 1** can be developed and merged first; it is entirely self-contained and unblocks scorer unit tests
- **Phase 2** should follow Phase 1 (so `fair_play_validation` is populated with correct clue data from the corrected paths)
- **Phase 4** is completely independent; it can land in any order alongside Phase 1 or 2
- **Phase 3** should land last; it depends on `adaptProseForScoring` returning `fair_play_validation` (Phase 2, P-1) so the re-score after identity/schema retry reflects the correct data

---

### Test coverage additions

Each phase should add or update unit tests in `packages/story-validation/src/scoring/phase-scorers/`:

| Phase | Test file | New test cases |
|---|---|---|
| 1 | `agent7-narrative-scorer.test.ts` | `extractCMLClues` returns IDs from `prose_requirements.clue_to_scene_mapping`; returns `[]` when field absent |
| 1 | `agent9-prose-scorer.test.ts` | `extractCMLClues` same; clue visibility test fires when `cmlClues.length > 0` |
| 1 | (new) `buildProseRequirements.test.ts` | `identity_rules` array → correct multi-character block; `identity_rules` absent → no block |
| 2 | `scoring-adapters.test.ts` | Scene with undefined `sceneNumber` gets fallback ID; DT keyword stem `confront` detected; `fair_play_validation` present on output; `DISCRIMINATING_PROSE_RE` no cross-sentence false positive on 3000-word text |
| 3 | (orchestrator integration) | Mock re-score path: verify `upsertPhaseScore` called with retry score after identity retry |
| 4 | `agent9-prose-scorer.test.ts` | `checkCharacterNameConsistency` with `"Dr. Watson"` in cast does not throw; `"Dr. Watson"` present in prose is counted correctly |

---

### Total bug closure by phase

| Phase | Bugs closed | High-severity bugs closed | Tests to add |
|---|---|---|---|
| 1 | N-1, NS-1, NS-3, PS-1, PS-2 | 4 (N-1, NS-1, PS-1, PS-2) | ~8 |
| 2 | N-2, N-4, N-5, P-1, P-5, PS-3, PS-4 | 1 (P-1) | ~10 |
| 3 | N-3, P-2, P-3 | 0 | ~3 |
| 4 | P-4 | 0 | ~2 |
| **Total** | **17** | **5** | **~23** |

---

## Known Reliability Issues — UI (App.vue / Components)

Audit date: 2026-03-06. Files reviewed: `apps/web/src/App.vue` (3136 lines), `apps/web/src/stores/projectStore.ts`, `apps/web/src/services/api.ts`, `apps/web/src/services/sse.ts`, `apps/web/src/components/ProseReader.vue`, `apps/web/src/components/RunHistory.vue`, `apps/web/src/components/ScoreCard.vue`.

### Master UI bug list

| ID | Severity | Description |
|---|---|---|
| U-1 | High | Export tab navigation loop — clicking Export tab immediately redirects to Project tab |
| U-2 | High | CML not fetched when Advanced mode first enabled — CML Viewer always blank |
| U-3 | Medium | `ProseReader` chapter index not reset after prose reload — stale/null chapter |
| U-4 | Medium | "Export all versions" has no loading state or concurrency guard |
| U-5 | Medium | `selectedProseLength` mismatch when only one prose version exists |
| U-6 | Low | SSE "Reconnecting…" status never cleared after connection recovers |
| U-7 | Low | `RunHistory` `:run-id` passes `null`, rendering "Run ID: null" |
| U-8 | Low | `ScoreCard.exportJson` — anchor not appended to DOM before `.click()` |
| U-9 | Low | `fixSuggestions` — generic per-key message appended unconditionally, duplicating specific advice |
| U-10 | Low | `RunHistory` `v-for` keyed by array index |

---

### U-1 — Export tab navigation loop

**File:** `apps/web/src/App.vue`
**Severity:** High — the Export tab is completely non-functional; clicking it immediately switches to Project tab

**Root cause:** The `watch(activeMainTab)` handler maps `'export'` → `setView('dashboard')`. That assignment to `currentView` triggers the `watch(currentView)` handler, which maps `'dashboard'` → `activeMainTab.value = 'project'`. The reactive chain completes in the same tick, leaving `activeMainTab = 'project'` and the Export `TabPanel` (which renders when `activeMainTab === 'export'`) never visible.

```typescript
// watch(activeMainTab) — App.vue ~L860
case "export":
  setView("dashboard");   // ← triggers watch(currentView)
  break;

// watch(currentView) — App.vue ~L905
case "dashboard":
  activeMainTab.value = "project";  // ← loop complete; Export never shown
  break;
```

**Fix:** Break the loop by not calling `setView` for the Export tab (it has no matching `View` enum value and no sub-views to sync). Either add `export` to the `View` type and remove the `'export' → 'dashboard'` mapping, or guard the `currentView` watcher so it doesn't fire when triggered from `activeMainTab`.

---

### U-2 — CML not fetched when Advanced mode first enabled

**File:** `apps/web/src/App.vue`, `apps/web/src/stores/projectStore.ts`
**Severity:** High — CML Viewer shows "CML will appear after generation" even though CML exists

**Root cause:** `loadArtifacts()` is called with `includeCml: isAdvanced.value`. On initial mount/project load, `isAdvanced` is false (user mode), so CML is skipped. The `watch([projectId, isAdvanced])` watcher only updates `tabStatuses`; it never re-calls `loadArtifacts`. When the user enables Advanced mode, `isAdvanced` becomes true but `cmlArtifact` remains `null` and no fetch is triggered.

```typescript
// watch([projectId, isAdvanced]) — App.vue ~L820
watch([projectId, isAdvanced], () => {
  if (projectId.value) { tabStatuses.value.project = "complete"; }
  if (isAdvanced.value) { tabStatuses.value.advanced = "available"; }
  // ← no loadArtifacts() call here
});
```

**Fix:** In the watcher, re-call `loadArtifacts()` when `isAdvanced` transitions to `true` and a project is loaded:

```typescript
watch([projectId, isAdvanced], ([nextId, nextAdvanced], [, prevAdvanced]) => {
  if (nextId) tabStatuses.value.project = "complete";
  if (nextAdvanced) {
    tabStatuses.value.advanced = "available";
    if (!prevAdvanced) loadArtifacts();   // ← re-fetch with CML now included
  } else {
    tabStatuses.value.advanced = "locked";
  }
});
```

---

### U-3 — ProseReader chapter index not reset after prose reload

**File:** `apps/web/src/components/ProseReader.vue`
**Severity:** Medium — after prose is regenerated or a new project is loaded, the reader shows a blank chapter or the wrong chapter

**Root cause:** `currentChapterIndex` is a plain `ref(0)` that never resets. If the old prose had 12 chapters and the user was on chapter 10, and the new prose has only 8, `currentChapterIndex.value = 9` (stale). `currentChapter` computed returns `null` (index out of bounds), and the reader body is empty.

```typescript
// ProseReader.vue ~L12
const currentChapterIndex = ref(0);
// No watcher on props.prose to reset this
```

**Fix:** Add a watcher that resets the index when the `prose` prop changes:

```typescript
import { watch } from "vue";
watch(() => props.prose, () => {
  currentChapterIndex.value = 0;
});
```

---

### U-4 — "Export all versions" has no loading state or concurrency guard

**File:** `apps/web/src/App.vue`
**Severity:** Medium — multiple overlapping download loops can be triggered; no spinner shown

**Root cause:** `handleDownloadAllProseVersions` is an `async` function but touches no loading flag. `isDownloadingStoryPdf` is only set in `handleDownloadStoryPdf`. The template disables the "Export all versions" button only when `:disabled="!proseData || !projectId"` — not when a download is already in progress.

**Fix:** Introduce `isDownloadingAllVersions = ref(false)`, set it to `true` at the start of `handleDownloadAllProseVersions`, and clear it in `finally`. Bind `:disabled` to include `isDownloadingAllVersions`.

---

### U-5 — `selectedProseLength` mismatch with single available prose version

**File:** `apps/web/src/App.vue`
**Severity:** Medium — PDF download silently requests the wrong (non-existent) version

**Root cause:** `loadProseVersions` only updates `selectedProseLength` when `!selectedProseLength.value`. On page hydration `spec.value.targetLength` (e.g., `'short'`) is restored from localStorage and immediately assigned to `selectedProseLength` via a watcher with `{ immediate: true }`. If the project only ever generated a `'medium'` prose artifact, `selectedProseLength` stays `'short'`, and the PDF download requests `/prose/pdf?length=short` which returns 404.

```typescript
// watch spec.targetLength — App.vue ~L710
watch(() => spec.value.targetLength, (length) => {
  if (length) selectedProseLength.value = length;  // ← overwrites before loadProseVersions runs
}, { immediate: true });

// loadProseVersions
if (availableProseVersions.value.length > 0 && !selectedProseLength.value) {  // ← condition never true
  selectedProseLength.value = ...;
}
```

**Fix:** Unconditionally set `selectedProseLength` in `loadProseVersions` to the best matching available version, regardless of current value:

```typescript
const available = Object.keys(versions).filter(k => k !== 'legacy');
availableProseVersions.value = available;
if (available.length > 0) {
  selectedProseLength.value = available.includes(spec.value.targetLength)
    ? spec.value.targetLength
    : available.includes('medium') ? 'medium' : available[0];
}
```

---

### U-6 — SSE "Reconnecting…" status never cleared after connection recovers

**File:** `apps/web/src/services/sse.ts`, `apps/web/src/App.vue`
**Severity:** Low — stale "Reconnecting…" status displayed after SSE auto-recovers

**Root cause:** `subscribeToRunEvents` calls `onError` (which sets `runStatus = "Reconnecting..."`) on any SSE error. `EventSource` auto-reconnects internally. When it does, the `ping` handler resumes, but there's no success path to reset `runStatus`. The status is only cleared on a running→idle status transition from the server.

**Fix:** In `subscribeToRunEvents`, expose a `connected` callback or add an `open` event listener:

```typescript
source.addEventListener("open", () => {
  // Clear "Reconnecting..." if not actively running
  if (lastProjectStatus.value !== "running") {
    runStatus.value = "Ready to generate";
  }
});
```

---

### U-7 — `RunHistory` `:run-id` passes `null`

**File:** `apps/web/src/App.vue`, `apps/web/src/components/RunHistory.vue`
**Severity:** Low — "Run ID: null" appears when no run has occurred

**Root cause:** `latestRunId` is `ref<string | null>(null)`. Passed as `:run-id="latestRunId"`. `RunHistory.vue` displays it with `{{ runId }}` which renders the string `"null"`.

**Fix:** Pass `:run-id="latestRunId ?? undefined"` so the prop is `undefined` (omitted) rather than the string `"null"`.

---

### U-8 — `ScoreCard.exportJson` anchor not appended to DOM

**File:** `apps/web/src/components/ScoreCard.vue`
**Severity:** Low — JSON download may silently fail or ignore filename in Firefox

**Root cause:**

```typescript
const exportJson = () => {
  const a = document.createElement("a");
  a.href = url;
  a.download = `quality-report-...json`;
  a.click();              // ← no document.body.appendChild(a)
  URL.revokeObjectURL(url);
};
```

Firefox requires the anchor to be in the DOM for the `download` attribute to be honoured. Chromium browsers are more permissive.

**Fix:** Append before click, remove after:

```typescript
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
```

---

### U-9 — `fixSuggestions` produces redundant generic advice

**File:** `apps/web/src/App.vue`
**Severity:** Low — users see both specific and generic advice for the same issue

**Root cause:** After pattern-matched specific suggestions, the loop always continues to a per-key `if/else if` block and unconditionally appends the generic message ("Review roles and relationships, then update the cast if needed."). This runs regardless of whether a more specific suggestion was already added.

**Fix:** Change the per-key fallback block to only fire when no specific suggestion was added for that key:

```typescript
const hadSpecific = suggestions.length > countBeforeSpecific;
if (!hadSpecific) {
  if (key === "cast") addSuggestion("Review roles ...");
  // ...
}
```

---

### U-10 — `RunHistory` keyed by array index

**File:** `apps/web/src/components/RunHistory.vue`
**Severity:** Low — unnecessary full re-render of all event rows when list grows

**Root cause:** `v-for="(event, idx) in events" :key="idx"` — index keys are invalidated whenever elements are prepended or removed before the current position.

**Fix:** Key by a stable property. Since events have both `step` and `message`, a composite key works:

```html
:key="`${event.step}-${idx}`"
```

Or add an `id` field to `RunEvent` from the API.

---

### Summary

| ID | Severity | File | Fix effort |
|---|---|---|---|
| U-1 | High | App.vue — `watch(activeMainTab)` | ~15 min |
| U-2 | High | App.vue — `watch([projectId, isAdvanced])` | ~10 min |
| U-3 | Medium | ProseReader.vue — `currentChapterIndex` | ~5 min |
| U-4 | Medium | App.vue — `handleDownloadAllProseVersions` | ~10 min |
| U-5 | Medium | App.vue — `loadProseVersions` / `selectedProseLength` | ~10 min |
| U-6 | Low | sse.ts / App.vue — SSE open event | ~10 min |
| U-7 | Low | App.vue — `:run-id` binding | ~2 min |
| U-8 | Low | ScoreCard.vue — `exportJson` | ~2 min |
| U-9 | Low | App.vue — `fixSuggestions` | ~10 min |
| U-10 | Low | RunHistory.vue — `v-for :key` | ~2 min |

---

## Chapter 23 — Reactive Quality Tab Enhancement

### Problem

The Quality tab used a dedicated `setInterval` (`scoringPollInterval`, 5-second cadence) to
periodically call `loadScoringReport()` while a run was active. This was redundant
because the existing `runEventsInterval` already polled the run-events endpoint
every 3 seconds and stored results in the reactive ref `runEventsData`. The
duplicate timer added network traffic, was harder to reason about, and was not
true Vue reactivity — it was imperative time-based side-effecting code.

### Solution

Removed the `scoringPollInterval` variable, `startScoringPoll`, and `stopScoringPoll`
entirely. Replaced them with two Vue `watch` calls:

```typescript
// Reactively refresh the scoring report whenever run events update (already
// polled every 3 s while a run is active — no separate timer needed).
watch(runEventsData, async () => {
  if (!projectId.value || !latestRunId.value) return;
  if (isRunning.value || isStartingRun.value) {
    await loadScoringReport();
  }
});

// Refresh report + history whenever a new run is identified.
watch(latestRunId, async (newRunId) => {
  if (!newRunId || !projectId.value) return;
  await loadScoringReport();
  await loadScoringHistory();
});
```

### Call sites removed

| Location | Removed call |
|---|---|
| SSE handler — `status === "running"` branch | `startScoringPoll()` |
| SSE handler — `previous === "running" && status === "idle"` branch | `stopScoringPoll()` |

The two explicit calls retained at run-completion (`loadScoringReport()` +
`loadScoringHistory()` after `stopRunEventsPolling`) and the tab-switch watcher
(`activeAdvancedTab === "quality"`) remain unchanged.

### How it works

1. **During a run** — `runEventsData` is reactively updated every 3 s by the
   existing `runEventsInterval`. The first `watch` detects any change in the ref
   and calls `loadScoringReport()` when `isRunning` or `isStartingRun` is true.
   This means the Quality tab's report re-fetches at the same cadence as run
   events, with no extra timer.

2. **On new run or project switch** — `latestRunId` changes whenever the user
   selects a different project or a new run is started. The second `watch`
   immediately loads both the latest report and the full scoring history for
   that run ID.

3. **On tab open** — The existing `watch(activeAdvancedTab)` already calls
   `loadScoringReport()` + `loadScoringHistory()` when the user opens the
   Quality tab, so the tab always shows fresh data as soon as it becomes
   visible.

4. **On run completion** — The SSE handler already calls `loadScoringReport()`
   and `loadScoringHistory()` after confirming a successful run, providing the
   definitive final snapshot.

### Trade-offs

| Before | After |
|---|---|
| Separate 5 s interval for scoring | Piggybacks on existing 3 s run-events interval |
| 2 imperative start/stop functions | 2 declarative `watch` calls |
| Score updates lagged by up to 5 s | Score updates lag by at most 3 s (run-events cadence) |
| Possible over-fetch after run ends (interval not always cancelled promptly) | Guard `isRunning \|\| isStartingRun` prevents post-run over-fetch |

### Files changed

- `apps/web/src/App.vue` — removed `scoringPollInterval` variable, `startScoringPoll`,
  `stopScoringPoll`; removed their two call sites in the SSE handler; added two
  `watch` calls near the existing tab-navigation watchers.

---

## Chapter 24 — UI Bug Fix Phases Plan

This chapter is the implementation plan for the ten UI bugs documented in
Chapter 22. Bugs are grouped into three phases by severity and risk:

| Phase | Bugs | Severity | Estimated time |
|---|---|---|---|
| 1 | U-1, U-2 | High — blocking UX | ~25 min |
| 2 | U-3, U-4, U-5 | Medium — data / usability | ~25 min |
| 3 | U-6, U-7, U-8, U-9, U-10 | Low — polish | ~26 min |

---

### Phase 1 — High-severity blockers (U-1, U-2) ✅ COMPLETE

**Goal:** Restore the Export tab so it renders, and ensure CML is fetched when
Advanced mode is toggled on for a loaded project.

#### U-1 — Export tab navigation loop ✅ COMPLETE

**Implemented:** Removed `case "export": setView("dashboard"); break;` from `watch(activeMainTab)`. Replaced with a comment. The `watch(currentView)` reverse-mapping has no `'export'` case so no further change was needed.

#### U-2 — CML not fetched when Advanced mode first enabled ✅ COMPLETE

**Implemented:** Rewrote `watch([projectId, isAdvanced])` to accept old values as a second destructured argument. When `nextAdvanced` is `true` and `prevAdvanced` was `false` (and a project is loaded), calls `void loadArtifacts()`. `loadArtifacts` already reads `isAdvanced.value` internally so no argument changes were needed.

**Phase 1 verification:** `npx tsc --noEmit` — 0 errors. ✅

---

### Phase 2 — Medium-severity usability issues (U-3, U-4, U-5) ✅ COMPLETE

**Goal:** Fix the ProseReader blank-chapter edge-case, guard the bulk-export
button against double-firing, and ensure the PDF download always requests an
available prose version.

#### U-3 — ProseReader chapter index not reset ✅ COMPLETE

**Implemented:** Added `watch` to imports in ProseReader.vue. Added `watch(() => props.prose, () => { currentChapterIndex.value = 0; })` immediately after the `currentChapterIndex` ref declaration.

#### U-4 — Export all versions has no loading state ✅ COMPLETE

**Implemented:** Added `isDownloadingAllVersions = ref(false)` adjacent to `isDownloadingStoryPdf`. Added `if (isDownloadingAllVersions.value) return;` guard at the top of `handleDownloadAllProseVersions`. Wrapped the download loop body in `try/finally` setting the flag. Updated the template `:disabled` binding to include `|| isDownloadingAllVersions`.

#### U-5 — `selectedProseLength` mismatch with available versions ✅ COMPLETE

**Implemented:** In `loadProseVersions`, removed the `!selectedProseLength.value` guard and replaced the assignment with a preference-order selection: spec `targetLength` if available, else `'medium'` if available, else `availableProseVersions[0]`. This always resolves to an actually-available version regardless of any stale localStorage value.

**Phase 2 verification:** `npx tsc --noEmit` — 0 errors. ✅

---

### Phase 3 — Low-severity polish (U-6, U-7, U-8, U-9, U-10) ✅ COMPLETE

**Goal:** Fix five small correctness and presentation issues. These are all
isolated single-file changes with no cross-cutting concerns.

#### U-6 — SSE “Reconnecting…” never cleared ✅ COMPLETE

**Implemented:** Added optional `onOpen?: () => void` parameter to `subscribeToRunEvents` in `sse.ts`. Wired it to `source.addEventListener("open", ...)`. In App.vue, passed a fourth callback that resets `runStatus` to `"Ready to generate"` when `lastProjectStatus !== "running"`.

#### U-7 — `RunHistory` `:run-id` passes `null` ✅ COMPLETE

**Implemented:** Changed `:run-id="latestRunId"` to `:run-id="latestRunId ?? undefined"` in App.vue template.

#### U-8 — `ScoreCard.exportJson` anchor not appended to DOM ✅ COMPLETE

**Implemented:** Added `document.body.appendChild(a)` before `a.click()` and `document.body.removeChild(a)` after in `ScoreCard.vue`.

#### U-9 — `fixSuggestions` redundant generic advice ✅ COMPLETE

**Implemented:** Captured `const countBefore = suggestions.length` before all pattern-match `if` blocks inside the per-key loop. Replaced the unconditional `if (key === "cast") ...` fallback with `if (suggestions.length === countBefore) { if (key === "cast") ... }`. Generic advice now only fires when no specific suggestion was produced for that key.

#### U-10 — `RunHistory` keyed by array index ✅ COMPLETE

**Implemented:** Changed `:key="idx"` to `:key="\`${event.step}-${idx}\`"` in RunHistory.vue. `RunEvent` has no `timestamp` field so `step+idx` composite is used.

**Phase 3 verification:** `npx tsc --noEmit` — 0 errors. ✅

---

### Implementation order within each phase

Within Phase 1, fix U-1 before U-2 so the Export tab regression is resolved
before touching the Advanced mode watcher (they share `watch` infrastructure).

Within Phase 2, fix U-5 first (one function, no template changes), then U-3
(single component), then U-4 (ref + template).

Phase 3 bugs are all independent and can be applied in any order or in a single
commit.

### Regression safety

After each phase:
```
cd c:\CML\apps\web ; npx tsc --noEmit
cd c:\CML ; npm test
```

No new TypeScript errors should appear. Existing tests (98/98 passing) cover the
scoring pipeline; the UI bugs are regression-tested manually via the smoke-test
steps above since there are no Vitest UI component tests in this project.

---

## Chapter 25 — Known Reliability Issues — Fair Play Agent (Agent 6)

This chapter documents bugs found in the Agent 6 fair-play audit subsystem
through code review and analysis of run
`run_5ba072b7-a696-42c0-ad90-374dbb8afe83`, which failed with an abort for
"Clue Visibility, Logical Deducibility" while the quality report showed
"Information Parity" and "No Withholding" — a mismatch that exposed the
stale-score problem documented below.

Files in scope:
- `apps/worker/src/jobs/mystery-orchestrator.ts` — main orchestration, scoring, abort gate
- `packages/prompts-llm/src/agent6-fairplay.ts` — prompt builder and LLM caller

---

### FP-1 — `upsertPhaseScore` not called after CML revision or blind-reader re-audit (High)

**Files:** `mystery-orchestrator.ts`
**Severity:** High — quality report shows violations from the wrong audit pass

**Root cause:**

The execution flow for Agent 6 can invoke `auditFairPlay` up to three times:

1. **Initial audit** + clue-retry (the `while (fairPlayAttempt < 2)` loop)
2. **CML revision re-audit** (inside the WP6B `failureClass` block, ~L2843)
3. **Blind-reader re-clue** regeneration (no re-audit, but `fairPlayAudit` is stale)

`upsertPhaseScore` is called exactly once — after loop exit (audit #1/#2),
before the CML revision and blind-reader steps. If the WP6B CML revision runs a
third `auditFairPlay`, the `fairPlayAudit` variable is updated but
`upsertPhaseScore` is never called again.

**Evidence in this run:**
Quality report test names: "Information Parity", "No Withholding"
Abort reason: "Clue Visibility, Logical Deducibility"
These don't match — they come from different audit passes of the same run.

**Fix:** Add a helper function `recordFairPlayScore(audit)` that encapsulates
the `upsertPhaseScore` call. Call it at every point where `fairPlayAudit` is
reassigned (after the initial loop, after CML revision re-audit). Guard with
`if (enableScoring && scoreAggregator)`.

---

### FP-2 — `hasCriticalFairPlayFailure` is stale after CML revision (High)

**File:** `mystery-orchestrator.ts`
**Severity:** High — WP6B retry gating uses pre-revision violation set

**Root cause:**

```typescript
// Computed once after clue-retry audit:
const hasCriticalFairPlayFailure = fairPlayAudit.violations.some(
  (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule),
);

// ...hundreds of lines later, WP6B retry is gated on this:
if (fairPlayAudit!.overallStatus === "fail" && hasCriticalFairPlayFailure) {
  // CML revision runs, fairPlayAudit is reassigned...
  fairPlayAudit = await auditFairPlay(...);
  // hasCriticalFairPlayFailure is now stale
}
```

After WP6B CML revision, `fairPlayAudit` is updated but
`hasCriticalFairPlayFailure` still reflects the violations from before revision.
Any subsequent logic that reads `hasCriticalFairPlayFailure` acts on outdated
data.

**Fix:** Recompute `hasCriticalFairPlayFailure` immediately after every
`fairPlayAudit` reassignment, or make it a function call rather than a captured
`const`.

---

### FP-3 — `fpStatus` / `fpValidation` declared twice — outer pair dead (Medium)

**File:** `mystery-orchestrator.ts`
**Severity:** Medium — misleading dead code, potential future maintenance error

**Root cause:**

```typescript
// Outer declarations (never used):
const fpStatus = fairPlayAudit.overallStatus;
const fpValidation = fpStatus === "pass" ? 100 : fpStatus === "needs-revision" ? 70 : 45;

// ... warning logging blocks reference fairPlayAudit.overallStatus directly ...

if (enableScoring && scoreAggregator && fairPlayAudit) {
  const fpStatus = fairPlayAudit.overallStatus;    // shadows outer — used here
  const fpValidation = fpStatus === "pass" ? 100 : fpStatus === "needs-revision" ? 70 : 45;
  scoreAggregator.upsertPhaseScore(...);
}
```

The outer `fpStatus` and `fpValidation` are computed and then immediately
shadowed by identical declarations inside the `enableScoring` block. TypeScript
does not warn about this because the outer ones appear to be used by name in
scope.

**Fix:** Remove the two outer declarations. The `enableScoring` block already
has its own correct copies. If `fpValidation` is ever needed outside the scoring
block (e.g. for logging), move the `if` block's declarations to the outer scope.

---

### FP-4 — `hasZeroScoreViolation` computed but never read (Medium)

**File:** `mystery-orchestrator.ts`
**Severity:** Medium — dead code; was likely intended to gate behavior that was
never wired up

**Root cause:**

```typescript
const hasZeroScoreViolation = fairPlayAudit.checks?.some(
  (check) => check.status === "fail"
) ?? false;
```

This variable is declared but referenced nowhere else in the file.
It was probably intended to be used in the `upsertPhaseScore` call (e.g. to set
`passed: false` when any check fails, regardless of overall status), but that
use was never implemented.

**Fix:** Either remove the declaration, or wire it into the `passed` logic in
`upsertPhaseScore` as was presumably intended (see FP-5).

---

### FP-5 — `needs-revision` hardcoded as `passed: true` despite being below threshold (Medium)

**File:** `mystery-orchestrator.ts`
**Severity:** Medium — `needs-revision` runs produce a passing phase score at 70 when the threshold is 75

**Root cause:**

```typescript
passed: fpStatus === "pass" || fpStatus === "needs-revision",
```

`needs-revision` is assigned a score of 70. The threshold for `agent6_fairplay`
is 75 (as confirmed in all quality reports). `70 < 75` → the phase should fail
the threshold, but `passed` is hardcoded `true`.

The `ScoreAggregator.upsertPhaseScore` method uses the caller-supplied `passed`
field directly and does not compare `total` against `threshold` on its own. So
the hardcoded `true` bypasses the threshold check entirely.

**Fix:** Apply the threshold check explicitly:

```typescript
const FAIR_PLAY_THRESHOLD = 75;
passed: fpValidation >= FAIR_PLAY_THRESHOLD,
```

---

### FP-6 — Violations double-logged when `overallStatus === "fail"` and `hasCriticalFairPlayFailure` (Low)

**File:** `mystery-orchestrator.ts`
**Severity:** Low — noisy warnings log; duplicated entries in run logs

**Root cause:**

```typescript
if (fairPlayAudit.overallStatus === "fail") {
  if (hasCriticalFairPlayFailure) {
    warnings.push("...critical rules...");
    fairPlayAudit.violations.forEach((v) =>
      warnings.push(`  - [${v.severity}] ${v.rule}: ${v.description}`)   // ← first log
    );
  } else {
    warnings.push("...FAILED...");
  }
  // This forEach runs regardless of hasCriticalFairPlayFailure:
  fairPlayAudit.violations.forEach((v) => {
    warnings.push(`  - [${v.severity}] ${v.description}`);               // ← second log
  });
}
```

When `hasCriticalFairPlayFailure` is true, each violation is appended twice —
once with `${v.rule}: ${v.description}` and once with just `${v.description}`.

**Fix:** Move the outer `forEach` inside the `else` branch, or eliminate it in
favour of a single format used by both branches.

---

### FP-7 — Blind-reader retry regenerates clues without re-auditing fair play (Medium)

**File:** `mystery-orchestrator.ts`
**Severity:** Medium — the abort gate and WP6B entry check use a stale
`fairPlayAudit` after blind-reader-driven clue regeneration

**Root cause:**

When the blind reader fails (`!readerGotItRight || confidenceLevel === "impossible"`),
the code regenerates clues and calls `applyClueGuardrails`, but does **not**
call `auditFairPlay` again:

```typescript
clues = await extractClues(client, { ..., fairPlayFeedback: { ... } });
agentCosts["agent5_clues"] = (agentCosts["agent5_clues"] || 0) + clues.cost;
agentDurations["agent5_clues"] = (agentDurations["agent5_clues"] || 0) + ...;
applyClueGuardrails(cml, clues);
// ← no auditFairPlay() here
```

The subsequent CML abort gate (which checks `fairPlayAudit.violations`) and the
WP6B CML retry (gated on `hasCriticalFairPlayFailure`) both run against a
`fairPlayAudit` object that doesn't reflect the newly generated clues.

**Fix:** After the blind-reader clue regeneration, run a lightweight re-audit:

```typescript
fairPlayAudit = await auditFairPlay(client, { caseData: cml, clues, runId, projectId });
agentCosts["agent6_fairplay"] = (agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
// Also recompute hasCriticalFairPlayFailure here (see FP-2)
```

---

### FP-8 — `step.observation || step.observation` duplicate expression in prompt builder (Low)

**File:** `packages/prompts-llm/src/agent6-fairplay.ts`, line 109
**Severity:** Low — the second path is dead; may silently drop step descriptions

**Root cause:**

```typescript
const observation = step.observation || step.observation || step.type || "Observation";
//                                       ^^^^^^^^^^^^^^^^ identical to first operand
```

The second `step.observation` is a copy-paste error. It is always identical to
the first, so it never provides a fallback. The intention was likely
`step.description` (the CML 2.0 field storing the human-readable step text),
which means steps without an `observation` field fall through to `step.type`
(a technical enum value) and produce low-quality audit context.

**Fix:**

```typescript
const observation =
  step.observation || step.description || step.type || "Observation";
```

---

### FP-9 — `criticalFairPlayRules` / `structurallyBlockingRules` asymmetry (Medium)

**File:** `mystery-orchestrator.ts`
**Severity:** Medium — "Information Parity" triggers a full CML revision retry
but is not treated as a structural blocker for prose, creating an expensive
and confusing path that often cannot be fixed by CML alone

**Root cause:**

```typescript
// Controls WP6B CML retry gating:
const criticalFairPlayRules = new Set([
  "Clue Visibility", "Information Parity", "No Withholding", "Logical Deducibility"
]);

// Controls prose abort gate (different set, "Information Parity" absent):
const structurallyBlockingRules = new Set([
  'Clue Visibility', 'Logical Deducibility', 'No Withholding'
]);
```

"Information Parity" violations — as seen in the failing run — are treated as
critical enough to invoke the full CML revision path (WP6B), which re-runs
Agents 4, 5, and 6 at high cost (~0.15 budget). But the prose abort gate
deliberately excludes "Information Parity" and lets prose proceed.

This asymmetry means:
1. A run with only an "Information Parity" violation burns a CML revision retry
2. Even if that retry fails, prose is generated anyway
3. The CML revision prompts focus on `inference_path` and `constraint_space` —
   structural elements that don't fix "Information Parity", which is a clue
   phrasing/specificity problem

**Fix:** Remove "Information Parity" from `criticalFairPlayRules` (or rename the
set to reflect its actual meaning). "Information Parity" violations should be
handled by clue regeneration only (Agent 5 retry), not CML revision (Agent 4
retry), consistent with the rationale stated in the abort gate comment.

---

### Summary

| ID | Severity | File | Root cause |
|---|---|---|---|
| FP-1 | High | orchestrator | `upsertPhaseScore` never called after CML revision re-audit — report shows wrong violations |
| FP-2 | High | orchestrator | `hasCriticalFairPlayFailure` stale after CML revision re-audit |
| FP-3 | Medium | orchestrator | `fpStatus` / `fpValidation` declared twice; outer pair unused |
| FP-4 | Medium | orchestrator | `hasZeroScoreViolation` computed but never read |
| FP-5 | Medium | orchestrator | `needs-revision` hardcoded `passed: true` despite score 70 < threshold 75 |
| FP-6 | Low | orchestrator | Violations double-logged when fail + critical |
| FP-7 | Medium | orchestrator | Blind-reader clue retry skips re-audit; abort gate uses stale `fairPlayAudit` |
| FP-8 | Low | agent6-fairplay.ts | `step.observation \|\| step.observation` — duplicate expression, drops `step.description` |
| FP-9 | Medium | orchestrator | "Information Parity" in `criticalFairPlayRules` triggers costly CML retry but not prose abort |

---

## Chapter 26 — Fair Play Agent Bug Fix Phases (FP-1 through FP-9)

**Source:** Chapter 25 audit of `apps/worker/src/jobs/mystery-orchestrator.ts` and `packages/prompts-llm/src/agent6-fairplay.ts`.

**Status:** IN PROGRESS

---

### Phase 1 — High-severity: stale score + stale critical flag (FP-1, FP-2)

#### P26-1: Extract `recordFairPlayScore` helper (FP-1)

The initial `upsertPhaseScore` call is the only one ever made; all subsequent `fairPlayAudit` reassignments (CML revision re-audit, clue_only final re-audit, blind-reader re-audit) silently leave the quality report showing the stale first-pass violations.

**Fix:** Convert the `if (enableScoring && scoreAggregator && fairPlayAudit)` block to an arrow function `const recordFairPlayScore = async () => { ... }` that reads `fairPlayAudit` from closure. Call it immediately after its definition (preserving current behavior) and after every `fairPlayAudit` reassignment.

**Files:** `apps/worker/src/jobs/mystery-orchestrator.ts`

#### P26-2: Recompute `hasCriticalFairPlayFailure` after each re-audit (FP-2)

`hasCriticalFairPlayFailure` is a `const` evaluated once; WP6B gating reads a stale value after re-audits.

**Fix:** Change `const hasCriticalFairPlayFailure` to `let` and add a recompute after each `fairPlayAudit` reassignment.

**Files:** `apps/worker/src/jobs/mystery-orchestrator.ts`

---

### Phase 2 — Medium-severity: threshold, blind-reader, dead code, criticalRules (FP-3, FP-4, FP-5, FP-7, FP-9)

#### P26-3: Remove outer `fpStatus` / `fpValidation` (FP-3)

Outer pair declared but shadowed by inner copies inside `recordFairPlayScore`. Dead code removal.

#### P26-4: Remove `hasZeroScoreViolation` (FP-4)

Computed but never read. Dead code removal.

#### P26-5: Fix `passed` threshold in `upsertPhaseScore` (FP-5)

`passed: fpStatus === "pass" || fpStatus === "needs-revision"` treats score 70 as passing; threshold is 75.

**Fix:** `passed: fpValidation >= 75`

#### P26-6: Add re-audit after blind-reader clue retry (FP-7)

WP5B blind-reader regenerates clues but never re-runs `auditFairPlay`. WP6B gating sees stale violations.

**Fix:** After `applyClueGuardrails`, run `auditFairPlay`, recompute `hasCriticalFairPlayFailure`, call `recordFairPlayScore()`.

#### P26-7: Remove "Information Parity" from `criticalFairPlayRules` (FP-9)

"Information Parity" is a clue-phrasing issue; CML revision cannot fix it; it burns retry budget and blocks prose.

**Fix:** Remove from set; handled by Agent 5 clue regeneration only.

---

### Phase 3 — Low-severity: double-logging, duplicate expression (FP-6, FP-8)

#### P26-8: Fix violation double-logging (FP-6)

Outer `violations.forEach` runs unconditionally in the `fail` branch, doubling logs when `hasCriticalFairPlayFailure` is true.

**Fix:** Move `forEach` inside the `else` branch only.

#### P26-9: Fix duplicate expression in `blindReaderSimulation` (FP-8)

`step.observation || step.observation` — second operand should be `step.description`.

**Fix:** `step.observation || step.description || step.type || "Observation"`

---

### Implementation status

| Fix | Phase | Status |
|---|---|---|
| FP-1 `recordFairPlayScore` helper | 1 | COMPLETE |
| FP-2 `hasCriticalFairPlayFailure` recomputed | 1 | COMPLETE |
| FP-3 remove outer `fpStatus`/`fpValidation` | 2 | COMPLETE |
| FP-4 remove `hasZeroScoreViolation` | 2 | COMPLETE |
| FP-5 fix `passed` threshold | 2 | COMPLETE |
| FP-7 blind-reader re-audit | 2 | COMPLETE |
| FP-9 remove "Information Parity" from criticalRules | 2 | COMPLETE |
| FP-6 fix double-logging | 3 | COMPLETE |
| FP-8 fix duplicate expression | 3 | COMPLETE |

---

## Chapter 26 — Fair Play Agent Bug Fix Phases (FP-1 through FP-9)

**Source:** Chapter 25 audit of `apps/worker/src/jobs/mystery-orchestrator.ts` and `packages/prompts-llm/src/agent6-fairplay.ts`.

**Status:** IN PROGRESS

---

### Phase 1 — High-severity: stale score + stale critical flag (FP-1, FP-2)

#### P26-1: Extract `recordFairPlayScore` helper (FP-1)

The initial `upsertPhaseScore` call is the only one ever made; all subsequent `fairPlayAudit` reassignments (CML revision re-audit, clue_only final re-audit, blind-reader re-audit) silently leave the quality report showing the stale first-pass violations.

**Fix:** Convert the `if (enableScoring && scoreAggregator && fairPlayAudit)` block to an arrow function `const recordFairPlayScore = async () => { ... }` that reads `fairPlayAudit` from closure. Call it immediately after its definition (preserving current behavior) and after every `fairPlayAudit` reassignment.

**Files:** `apps/worker/src/jobs/mystery-orchestrator.ts`

#### P26-2: Recompute `hasCriticalFairPlayFailure` after each re-audit (FP-2)

`hasCriticalFairPlayFailure` is a `const` evaluated once; WP6B gating reads a stale value after re-audits.

**Fix:** Change `const hasCriticalFairPlayFailure` to `let` and add a recompute after each `fairPlayAudit` reassignment.

**Files:** `apps/worker/src/jobs/mystery-orchestrator.ts`

---

### Phase 2 — Medium-severity: threshold, blind-reader, dead code, criticalRules (FP-3, FP-4, FP-5, FP-7, FP-9)

#### P26-3: Remove outer `fpStatus` / `fpValidation` (FP-3)

Outer pair declared but shadowed by inner copies inside `recordFairPlayScore`. Dead code removal.

#### P26-4: Remove `hasZeroScoreViolation` (FP-4)

Computed but never read. Dead code removal.

#### P26-5: Fix `passed` threshold in `upsertPhaseScore` (FP-5)

`passed: fpStatus === "pass" || fpStatus === "needs-revision"` treats score 70 as passing; threshold is 75.

**Fix:** `passed: fpValidation >= 75`

#### P26-6: Add re-audit after blind-reader clue retry (FP-7)

WP5B blind-reader regenerates clues but never re-runs `auditFairPlay`. WP6B gating sees stale violations.

**Fix:** After `applyClueGuardrails`, run `auditFairPlay`, recompute `hasCriticalFairPlayFailure`, call `recordFairPlayScore()`.

#### P26-7: Remove "Information Parity" from `criticalFairPlayRules` (FP-9)

"Information Parity" is a clue-phrasing issue; CML revision cannot fix it; it burns retry budget and blocks prose.

**Fix:** Remove from set; handled by Agent 5 clue regeneration only.

---

### Phase 3 — Low-severity: double-logging, duplicate expression (FP-6, FP-8)

#### P26-8: Fix violation double-logging (FP-6)

Outer `violations.forEach` runs unconditionally in the `fail` branch, doubling logs when `hasCriticalFairPlayFailure` is true.

**Fix:** Move `forEach` inside the `else` branch only.

#### P26-9: Fix duplicate expression in `blindReaderSimulation` (FP-8)

`step.observation || step.observation` — second operand should be `step.description`.

**Fix:** `step.observation || step.description || step.type || "Observation"`

---

### Implementation status

| Fix | Phase | Status |
|---|---|---|
| FP-1 `recordFairPlayScore` helper | 1 | COMPLETE |
| FP-2 `hasCriticalFairPlayFailure` recomputed | 1 | COMPLETE |
| FP-3 remove outer `fpStatus`/`fpValidation` | 2 | COMPLETE |
| FP-4 remove `hasZeroScoreViolation` | 2 | COMPLETE |
| FP-5 fix `passed` threshold | 2 | COMPLETE |
| FP-7 blind-reader re-audit | 2 | COMPLETE |
| FP-9 remove "Information Parity" from criticalRules | 2 | COMPLETE |
| FP-6 fix double-logging | 3 | COMPLETE |
| FP-8 fix duplicate expression | 3 | COMPLETE |

---

## Chapter 27 — Agent 6 Fair Play: CML Schema Alignment Audit

**Files audited:**
- `packages/prompts-llm/src/agent6-fairplay.ts` (`buildDeveloperContext`)
- `schema/cml_2_0.schema.yaml`
- `packages/prompts-llm/src/agent5-clues.ts` (ClueDistributionResult / Clue types)
- Example CMLs in `examples/`

**Method:** Cross-reference every field access in `buildDeveloperContext` against the CML 2.0 schema; identify missing schema sections that are relevant to fair play auditing.

---

### Section A — Wrong or non-schema field names (field mismatches)

#### FA-1: `step.reasoning` fallback is not a CML 2.0 schema field (L111)

```typescript
const correction = step.correction || step.reasoning || "Correction";
```

The CML 2.0 `inference_path.steps` schema defines three required fields: `observation`, `correction`, `effect`. There is no `reasoning` field. This is a legacy fallback from an older schema version that no longer exists. For any CML 2.0 file, `step.reasoning` resolves to `undefined` and the fallback `"Correction"` is silently inserted for steps that do have a valid `step.correction` value (which would be a very unusual edge case, but the schema field ordering makes `step.correction` take priority, so in practice no real harm — but the dead fallback is misleading).

**Schema fields:** `observation` (required), `correction` (required), `effect` (required), `required_evidence` (optional array of strings), `reader_observable` (optional boolean)

#### FA-2: FP-8 fix target `step.description` is also not a CML 2.0 schema field (L109)

Chapter 25 / FP-8 proposes fixing L109:
```typescript
const observation = step.observation || step.observation || step.type || "Observation";
// fix: change second step.observation → step.description
```

But `step.description` is likewise not a field in the schema. The correct fix is simply to remove the duplicate operand entirely:
```typescript
const observation = step.observation || "Observation";
```
`step.type` is also not a schema field (schema has `observation`, `correction`, `effect`). All three fallbacks after the first `step.observation` are wrong.

#### FA-3: `legacy.setup?.crime?.victim` — no victim field in CML 2.0 schema (L100)

```typescript
const victim = legacy.setup?.crime?.victim || "Unknown";
```

The CML 2.0 schema has no `setup` top-level key and no `crime.victim` field. Victim identity would need to be inferred from the cast (character with `culpability: innocent` who is the target) or from `hidden_model.outcome.result`. Every CML 2.0 file produces `victim = "Unknown"`. The LLM audit prompt then says `**Victim**: Unknown` — degrading the context the auditor uses.

#### FA-4: `evidence_sensitivity` items mapped as objects, schema defines them as strings (L135-140)

```typescript
const evidence = c.evidence_sensitivity!.map((e: any) => `${e.evidence_type ?? e}: ${e.vulnerability ?? ""}`)
```

The CML 2.0 schema: `evidence_sensitivity: { type: array, items: string }`. Items are plain strings. The access pattern `e.evidence_type` and `e.vulnerability` will both be `undefined` for a proper CML 2.0 file, causing the output to be "string_value: " (correct text but with spurious trailing `: `), or just the raw string with a colon appended. Two wrongs nearly cancel, but the intent is wrong.

#### FA-5: `meta.primary_axis` is not a CML 2.0 schema field (L96)

```typescript
const primaryAxis = meta?.primary_axis || cmlCase.false_assumption?.type || "unknown";
```

The schema `meta` object has: `title`, `author`, `license`, `era`, `setting`, `crime_class`. No `primary_axis`. The fallback to `false_assumption.type` is correct and always fires for CML 2.0 files. Low severity — falls through safely.

---

### Section B — Missing CML data in the audit context (omissions)

These schema sections exist in CML 2.0 and are directly relevant to fair play auditing, but are completely absent from the developer context sent to the LLM.

#### FB-1: `surface_model` not included (HIGH)

The `surface_model` defines what the reader is meant to believe:
- `surface_model.narrative.summary` — the false narrative
- `surface_model.accepted_facts[]` — facts the surface model presents as given
- `surface_model.inferred_conclusions[]` — conclusions the reader is expected to draw

The fair play auditor must know the false surface narrative to verify:
- Red herrings reinforce the right false conclusions
- The clues that undercut the surface model appear early enough
- "No Withholding" — nothing known by the detective that contradicts the surface model is hidden from the reader

Without this, the LLM auditor operates without the core of what it is supposed to audit.

#### FB-2: `hidden_model` not included (HIGH)

The `hidden_model` defines what is actually true:
- `hidden_model.mechanism.description` — the actual crime mechanism
- `hidden_model.mechanism.delivery_path[].step` — how the mechanism was executed
- `hidden_model.outcome.result` — the actual result

The auditor needs this to verify whether the clue set is sufficient to bring a reader from the `surface_model` to the `hidden_model`. Without it the LLM only sees inference steps (the logical arguments) but not the underlying facts those steps are meant to reveal.

#### FB-3: `false_assumption.why_it_seems_reasonable` and `false_assumption.what_it_hides` not extracted (HIGH)

```typescript
const falseAssumption = cmlCase.false_assumption?.statement || ...
```

Only the `statement` is extracted. The schema also defines:
- `why_it_seems_reasonable` — why the false assumption is believable
- `what_it_hides` — what the false assumption conceals

These are essential for the LLM to audit whether red herrings and early clues sufficiently support the false assumption, and whether the clue set adequately exposes `what_it_hides`. The audit checklist item "False Assumption Support" is checking exactly this, but the LLM lacks the data.

#### FB-4: `inference_path.steps[].required_evidence` not surfaced per step (HIGH)

The schema has `required_evidence: { type: array, items: string }` on each inference step. This field explicitly lists what evidence must be present for the step to be derivable. It is the most direct signal for "Logical Deducibility" and "Clue Visibility" audit checks — if a step has `required_evidence: ["X", "Y"]` but none of the clues provide X or Y, that is a fair play violation. The agent currently shows only the step's `observation`/`correction`/`effect` text without the required evidence list.

#### FB-5: `constraint_space.social` not extracted (MEDIUM)

```typescript
const timeConstraints = formatConstraintList(constraintSpace.time, ["anchors", "windows", "contradictions"]);
const accessConstraints = formatConstraintList(constraintSpace.access, ["actors", "objects", "permissions"]);
const physicalConstraints = formatConstraintList(constraintSpace.physical, ["laws", "traces"]);
// social is never extracted
```

The schema has a fourth `constraint_space.social` object with `trust_channels` and `authority_sources`. The Moonstone example shows this is populated in real CMLs. The "Constraint Consistency" audit check cannot fully verify social constraints that define who the reader is meant to trust.

#### FB-6: `fair_play` block not included in context (MEDIUM)

The CML has a self-asserted `fair_play` block:
```yaml
fair_play:
  all_clues_visible: true
  no_special_knowledge_required: true
  no_late_information: true
  reader_can_solve: true
  explanation: "..."
```

These are the CML author's own assertions about fair play compliance. The agent never includes them in the audit context, meaning the LLM cannot cross-check whether the author's self-declarations are borne out by the actual clue set. The `explanation` field is particularly useful context.

#### FB-7: `quality_controls` block not included (MEDIUM)

The schema has a required `quality_controls` object:
- `clue_visibility_requirements.essential_clues_min` — minimum essential clue count
- `clue_visibility_requirements.essential_clues_before_test` — must be true
- `clue_visibility_requirements.early/mid/late_clues_min` — minimum per act
- `discriminating_test_requirements.timing` — `late_act2 | early_act3 | mid_act3`
- `discriminating_test_requirements.must_reference_inference_step` — boolean

The audit prompt asks the LLM to check discriminating test timing, but the LLM is never told what timing value the CML itself mandates. The LLM checks against "late Act II or early Act III" in the prompt text, but the CML specifies which one applies. Without `quality_controls`, the LLM cannot report whether the constraints the CML sets for itself are satisfied.

#### FB-8: `clue.supportsInferenceStep` and `clue.evidenceType` not shown in clue listing (MEDIUM)

The `Clue` interface (from agent5-clues) has:
- `supportsInferenceStep?: number` — which 1-indexed inference step this clue enables
- `evidenceType?: "observation" | "contradiction" | "elimination"` — the role it plays

The audit context lists clues in act buckets but strips these fields. This means the LLM cannot verify step-by-step coverage: for each inference step, are there enough clues of the right evidence type? This is the core mechanism for auditing "Logical Deducibility" and "Information Parity."

#### FB-9: `inference_path.steps[].reader_observable` flag not surfaced (LOW)

Boolean field on each step indicating whether the inference step itself is visible to the reader (as opposed to only visible to the detective). If a step is `reader_observable: false`, the reader cannot follow that deduction — a potential fair play concern. The agent ignores this field.

#### FB-10: `prose_requirements.clue_to_scene_mapping` not included (LOW)

When present, `prose_requirements.clue_to_scene_mapping[]` maps clue IDs to specific acts/scenes. This is the authoritative record of when each clue appears in the story. The fair play timing checks ("are all essential clues before the discriminating test?") could use this mapping but the agent does not include it.

---

### Section C — Audit prompt vs. available data gaps

#### FC-1: Audit checklist references discriminating test timing without CML's timing value

The user request prompt says: *"Does the discriminating test scene appear at the right moment (late Act II or early Act III)"*. But `quality_controls.discriminating_test_requirements.timing` in the CML specifies `late_act2 | early_act3 | mid_act3` — the correct moment varies per mystery. The LLM uses a hardcoded assumption rather than the CML's actual timing gate.

#### FC-2: Cast alibi and access data not in context for "No Withholding" check

The audit checklist includes "No Withholding: Are there any facts the detective knows but the reader doesn't?" The detective's reasoning is grounded in each cast member's `alibi_window`, `access_plausibility`, and `opportunity_channels`. These are not in the audit context, so the LLM cannot verify whether the clues collectively reveal the same information the detective uses.

---

### Summary table

| ID | Severity | Type | Description |
|---|---|---|---|
| FA-1 | Low | Wrong field | `step.reasoning` — not in CML 2.0 schema; should be removed |
| FA-2 | Low | Wrong field | FP-8 fix should remove duplicate + `step.type`, not substitute `step.description` (also not in schema) |
| FA-3 | Medium | Wrong field | `legacy.setup?.crime?.victim` — always "Unknown" for CML 2.0; victim unextractable without schema redesign |
| FA-4 | Low | Wrong field | `evidence_sensitivity` items mapped as objects; schema defines them as strings |
| FA-5 | Low | Wrong field | `meta.primary_axis` — not in schema; fallback to `false_assumption.type` fires correctly |
| FB-1 | High | Missing data | `surface_model` (false narrative, accepted facts, inferred conclusions) absent from audit context |
| FB-2 | High | Missing data | `hidden_model` (crime mechanism, delivery path, outcome) absent from audit context |
| FB-3 | High | Missing data | `false_assumption.why_it_seems_reasonable` and `what_it_hides` not extracted — "False Assumption Support" check is blind |
| FB-4 | High | Missing data | `inference_path.steps[].required_evidence` not surfaced — "Logical Deducibility" check cannot verify per-step evidence coverage |
| FB-5 | Medium | Missing data | `constraint_space.social` (trust_channels, authority_sources) not extracted |
| FB-6 | Medium | Missing data | `fair_play` self-assertion block not included — LLM cannot cross-check author declarations |
| FB-7 | Medium | Missing data | `quality_controls` block not included — discriminating test timing value and clue count gates invisible to LLM |
| FB-8 | Medium | Missing data | `clue.supportsInferenceStep` and `clue.evidenceType` stripped from clue listing |
| FB-9 | Low | Missing data | `inference_path.steps[].reader_observable` not surfaced |
| FB-10 | Low | Missing data | `prose_requirements.clue_to_scene_mapping` not included |
| FC-1 | Medium | Prompt gap | Audit prompt hardcodes "late Act II or early Act III" rather than reading `quality_controls.discriminating_test_requirements.timing` |
| FC-2 | Medium | Prompt gap | Cast alibi/access fields absent; "No Withholding" and "Discriminating Test Timing" checks cannot verify detective reasoning |

---

## Chapter 28 — Agent 6 Fair Play: Schema Alignment Fix Phases (FA-1 through FC-2)

**Source:** Chapter 27 alignment audit of `packages/prompts-llm/src/agent6-fairplay.ts` against `schema/cml_2_0.schema.yaml` and example CMLs.

**Status:** IN PROGRESS

---

### Phase 1 — High: fill the four blind spots that break core audit checks (FB-1, FB-2, FB-3, FB-4)

The LLM fair play auditor currently lacks: the false narrative the reader is meant to believe (`surface_model`), the actual crime mechanism (`hidden_model`), the purpose of the false assumption (`why_it_seems_reasonable` / `what_it_hides`), and the per-step required evidence list (`required_evidence[]`). These four omissions mean the "Logical Deducibility", "False Assumption Support", "No Withholding", and "Information Parity" checks are all operating blind.

**Changes:**
- Extract `surface_model.narrative.summary`, `accepted_facts[]`, `inferred_conclusions[]` and add as a new section (FB-1)
- Extract `hidden_model.mechanism.description`, `delivery_path[]`, `outcome.result` and add as a new section (FB-2)
- Extract `false_assumption.why_it_seems_reasonable` and `what_it_hides` alongside `statement` (FB-3)
- Surface `required_evidence[]` per inference step in the step text (FB-4)
- Simultaneously fix FA-1 (`step.reasoning` non-schema fallback), FA-2 (duplicate / non-schema fallbacks in step.observation), FA-3 (`legacy.setup?.crime?.victim` always "Unknown" in CML 2.0), FA-5 (field ordering)

**Files:** `packages/prompts-llm/src/agent6-fairplay.ts`

---

### Phase 2 — Medium: fill remaining missing context + fix clue display + fix prompt (FA-4, FB-5, FB-6, FB-7, FB-8, FC-1, FC-2)

**Changes:**
- FA-4: Fix `evidence_sensitivity` item mapping — schema defines as strings, not objects
- FB-5: Extract and display `constraint_space.social` (trust_channels, authority_sources)
- FB-6: Include the CML's own `fair_play` self-assertion block in the audit context
- FB-7: Extract `quality_controls` (discriminating test timing, clue count gates) and add section
- FB-8: Add `supportsInferenceStep` and `evidenceType` to each clue line in the context
- FC-1: Fix audit checklist item 5 to read discriminating test timing from Quality Controls rather than hardcoding "late Act II or early Act III"
- FC-2: Expand cast section to include `alibi_window`, `access_plausibility`, `opportunity_channels` per member (currently only `evidence_sensitivity` is shown)

**Files:** `packages/prompts-llm/src/agent6-fairplay.ts`

---

### Phase 3 — Low: minor omissions (FB-9, FB-10)

- FB-9: Surface `reader_observable: false` per inference step as a note
- FB-10: Include `prose_requirements.clue_to_scene_mapping` when present

**Note:** FB-9 will be folded into the Phase 1 inference-step rewrite as it is in the same code block.

---

### Implementation status

| Fix | Phase | Status |
|---|---|---|
| FA-1 remove `step.reasoning` fallback | 1 | COMPLETE |
| FA-2 remove duplicate/non-schema step fallbacks | 1 | COMPLETE |
| FA-3 fix victim "Unknown" | 1 | COMPLETE |
| FA-5 fix field ordering | 1 | COMPLETE |
| FB-1 add `surface_model` section | 1 | COMPLETE |
| FB-2 add `hidden_model` section | 1 | COMPLETE |
| FB-3 expand false_assumption fields | 1 | COMPLETE |
| FB-4 surface `required_evidence[]` per step | 1 | COMPLETE |
| FB-9 surface `reader_observable` per step | 1 | COMPLETE |
| FA-4 fix `evidence_sensitivity` mapping | 2 | COMPLETE |
| FB-5 add `constraint_space.social` | 2 | COMPLETE |
| FB-6 include `fair_play` block | 2 | COMPLETE |
| FB-7 include `quality_controls` | 2 | COMPLETE |
| FB-8 add `supportsInferenceStep`/`evidenceType` to clues | 2 | COMPLETE |
| FC-1 fix hardcoded discriminating test timing | 2 | COMPLETE |
| FC-2 expand cast to alibi/access/opportunities | 2 | COMPLETE |
| FB-10 add `clue_to_scene_mapping` | 3 | COMPLETE |

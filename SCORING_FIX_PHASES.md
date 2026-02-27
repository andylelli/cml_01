# Scoring Fix Phases

Current state from quality report `run_84eb2d6e`. Overall: **83.63/B — FAIL** (4/8 phases pass).

| Phase | Score | Status | Failing tests |
|---|---|---|---|
| Setting Refinement | 74/C | ❌ FAIL | Physical plausibility 0/5; Layout detail 33% |
| Cast Design | 93/A | ✅ PASS | — |
| Background Context | 98/A | ✅ PASS | — |
| Hard Logic Devices | 100/A | ✅ PASS | — |
| Narrative Outline | 87/B | ❌ FAIL | Character name consistency 24%; Clue pacing 5/22 |
| Character Profiles | 84/B | ❌ FAIL | Profile narrative depth 46%; Humour style richness 0/4 |
| Location Profiles | 44/F | ❌ FAIL | Taste 0/3; Geographic specificity 0/3; All senses 0/3 |
| Temporal Context | 89/B | ✅ PASS | — |
| Pipeline abort | — | ✅ FIXED | evidence_clues back-fill applied |

A phase passes when composite ≥75 **and** component minimums met: quality ≥50, consistency ≥50, validation ≥60, completeness ≥60.

---

## Phase 1 — Character Profiles (84/B → pass)

**File:** `apps/worker/src/jobs/scoring-adapters.ts`  
**Function:** `adaptCharacterProfilesForScoring`

### 1a. Humour style richness — 0/4 profiles passing

Scorer: `exists(p.humour_style) && p.humour_style.length > 20`

LLM outputs an enum like `"dry_wit"` (7 chars) — fails the >20 char gate.

**Fix:** Add a `HUMOUR_DESCRIPTIONS` map at top of function and expand the enum:

```
"dry_wit"         → "Dry wit: sardonic observations delivered with studied indifference"
"understatement"  → "Understatement: deflects tension through deliberate litotes and restraint"
"polite_savagery" → "Polite savagery: devastating critiques dressed in impeccable manners"
"self_deprecating"→ "Self-deprecating: disarms opponents through humorous self-diminishment"
"observational"   → "Observational: finds comedy in the contradictions of everyday behaviour"
"deadpan"         → "Deadpan: delivers the most absurd statements with a perfectly straight face"
"sardonic"        → "Sardonic: bitter, world-weary amusement at the folly of those around them"
"blunt"           → "Blunt: tactless honesty that accidentally produces moments of dark comedy"
"none"            → omit field entirely
```

### 1b. Profile narrative depth — 46% (needs ≥70%)

Scorer word-count thresholds (from `scoreProfileDepth()`):

| Field | ≥words → pts | Current source | Current words | Max pts achievable |
|---|---|---|---|---|
| `public_persona` | 150→25, 80→15, 40→8 | `publicPersona \|\| summary` | ~80–120 | ~15 |
| `private_secrets` | 100→25, 50→15, 25→8 | `p.privateSecret` | ~20–30 | 8 |
| `motive_and_alibi` | 80→20, 40→12, 20→6 | `` `${motiveSeed} / ${alibiWindow}` `` | ~10–20 | 6 |
| `stakes` | 50→15, 25→9, 10→4 | `p.stakes` | ~10–20 | 4 |

The LLM generates a `paragraphs: string[]` array per character (4–6 rich paragraphs) that is currently never used.

**Fix:** Pull `paragraphs[]` content into each field:

- `public_persona`: `publicPersona + ' ' + (paragraphs[0] || '')`
- `private_secrets`: `privateSecret + ' ' + (paragraphs[1] || '')`
- `motive_and_alibi`: `motiveSeed + '. ' + alibiWindow + '. Access: ' + accessPlausibility + '. Motive strength: ' + motiveStrength + '. ' + (paragraphs[2] || '')`
- `stakes`: `stakes + ' ' + (paragraphs[3] || '')`

---

## Phase 2 — Setting Refinement (74/C → ≥75)

**File:** `apps/worker/src/jobs/scoring-adapters.ts`  
**Function:** `adaptSettingForScoring`

Only 1 point short of the pass threshold. Two quality tests are failing.

### 2a. Physical plausibility — 0/5

Scorer (`isPhysicallyPlausible()`): passes if ≥2 of these regex families match in `location.layout`, OR the text contains a measurement (`/\d+\s*(feet|foot|ft|meters)/`):

- `/north|south|east|west/i`
- `/left|right|center|middle/i`
- `/adjacent|next to|beside|near/i`
- `/above|below|upstairs|downstairs/i`
- `/front|back|rear/i`
- `/entrance|exit|door|window/i`

Current adapter derives `layout` from `accessControl[i]` strings like `"Servants' wing — no guests permitted"` — no spatial language.

### 2b. Layout detail — 33%

Scorer (`scoreLayoutDetail()`):
- layout word count ≥100 → +40 pts; ≥50 → +25; ≥20 → +15
- `key_features` count ≥5 → +30; ≥3 → +20; ≥1 → +10
- ≥3 features with ≥3 words each → +20; ≥1 → +10
- `clue_placements` present → +10

Current: layouts 3–8 words; 1 key_feature per sub-location.

**Fix:** For each location:

- **`layout`**: Compose a spatial paragraph from `description` + `physicalConstraints[]` joined as sentences, plus injected directional connector phrases ("The entrance opens to the left...", "Adjacent to the north wall..."). Target ≥100 words and ≥2 spatial marker families.
- **`key_features`**: Expand `physicalConstraints[]` + `accessControl[]` items into ≥3-word phrases. Target ≥5 entries total. E.g. `"locked oak cabinet"`, `"narrow window overlooking courtyard"`.
- **`clue_placements`**: Synthesise 1–2 placeholder entries from `accessControl` items so the +10 existence score fires.

---

## Phase 3 — Narrative Outline (87/B → pass)

**Files:** `apps/worker/src/jobs/scoring-adapters.ts` + `apps/worker/src/jobs/mystery-orchestrator.ts`  
**Function:** `adaptNarrativeForScoring`

Score is 87 but `passed: false` — the **consistency component is 42.9**, below the 50-point minimum.

### 3a. Character name consistency — 24% match

Scorer (`checkConsistency()`): checks `scene.characters_present[]` against CML cast names via lowercase partial match.

The LLM populates `scene.characters[]` with identifier tokens (`"evelyn_h"`, `"the detective"`) not full names (`"Evelyn Hawthorne"`). The adapter copies them as-is → 24% match.

**Fix:** Extend `adaptNarrativeForScoring` to accept cast data and build a normalisation map:

```typescript
export function adaptNarrativeForScoring(
  narrative: NarrativeOutline,
  castMembers?: Array<{ name: string }>,
  clueList?: Array<{ id: string; placement: 'early' | 'mid' | 'late' }>
)
```

Build map: for each cast member name, generate keys for each part and the underscored whole:
- `"Evelyn Hawthorne"` → keys `"evelyn_hawthorne"`, `"evelyn"`, `"hawthorne"`

For each `scene.characters[]` entry, look up in the map; fall back to original if no match.

### 3b. Clue pacing — 5/22 chapters (23%)

Scorer (`analyzeClueDistribution()`): needs `chaptersWithClues / total ≥ 0.5` for +50 pts; ≥0.3 for +30 pts. Currently 23% → 0 pts → partial score.

**Fix:** Use the `clueList` parameter (by placement band) to distribute clue IDs across chapter slots:
- `"early"` clues → first-act chapter indices (0–7)
- `"mid"` clues → second-act chapter indices (8–14)  
- `"late"` clues → third-act chapter indices (15+)

Round-robin within each band, 1 clue per chapter, supplementing any existing `scene.cluesRevealed` entries. Target ≥50% of chapters with at least one clue.

**Orchestrator call site** (`mystery-orchestrator.ts` ~line 2144) — update to pass cast and clues:

```typescript
const adapted = adaptNarrativeForScoring(
  narrativeResult,
  (cml as any).CASE?.cast,    // character name normalisation
  (cml as any).CASE?.clues    // clue distribution by placement band
);
```

---

## Phase 4 — Location Profiles (44/F → ≥75)

**File:** `apps/worker/src/jobs/scoring-adapters.ts`  
**Function:** `adaptLocationProfilesForScoring`

Fixes already applied this session but not yet verified in a new run:

1. **Taste field (was missing → validity rate 0%):** Synthesised from `smells[]` — e.g. `"The air carries a faint taste of tobacco and aged wood, lingering on the palate."` — so all 5 senses pass `exists()` and the validity rate rises above 0%.

2. **Geographic grounding (was too short → geographic specificity 0/3):** Now builds `"Interior space within {name} in {place}, {country} — {purpose}"` which matches the scorer's `/\w+,\s+\w+/i` pattern and exceeds 100 chars.

3. **Visual richness:** `sight` now combines `visualDetails` + `sensoryDetails.sights[]`.

**Residual risk after re-run:** Sensory richness requires ≥50 words per sense field. If LLM outputs sparse arrays (2–3 word items), feed `loc.paragraphs[]` into the sparse fields.

---

## Build & verify

After all adapter and orchestrator changes:

```powershell
cd c:\CML\apps\worker
npx tsc -p tsconfig.json
echo "EXIT:$LASTEXITCODE"

cd c:\CML
npm test --workspace=packages/story-validation
echo "EXIT:$LASTEXITCODE"
```

Then trigger a full pipeline run and check the quality report for all 8 phases ≥75.

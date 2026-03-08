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

## Phase 5 — Story readability hardening (implemented)

**Goal:** Remove dense wall-of-text output and enforce consistent whitespace in generated story text.

**Issues observed in `stories/project_2.txt`:**
- weak paragraph separation in plain-text output
- long dense blocks that read as unbroken prose
- residual mojibake sequences in punctuation
- illegal/garbled character artifacts from encoding drift

**Implementation targets:**

- **API formatter:** `apps/api/src/server.ts`
  - Harden `buildReadableStoryText()` with stricter paragraph normalization:
    - preserve one blank line between paragraphs
    - preserve one blank line between chapter heading, summary, and body
    - split overlong paragraph blocks (sentence-boundary chunking) when a single paragraph exceeds readability thresholds
  - Add defensive normalization for common mojibake punctuation beyond current map.

- **Worker-side prose sanitation:** `apps/worker/src/jobs/mystery-orchestrator.ts`
  - Expand `sanitizeProseText()` replacement map for common CP-1252 artifacts that still leak through.
  - Add a post-generation pass that converts accidental hard-wrapped lines into coherent paragraph blocks before persistence.

- **Encoding contract (UTF-8 + multibyte safe):** `apps/worker/src/jobs/mystery-orchestrator.ts`, `apps/api/src/server.ts`, `packages/story-validation/src/encoding-validator.ts`
  - Standardize all prose persistence/export to UTF-8.
  - Preserve valid multibyte Unicode characters (e.g., em dash, ellipsis, accented names, CJK) rather than stripping them.
  - Strip/reject illegal control characters (except `\n`, `\r`, `\t`) and invalid Unicode replacement artifacts.
  - Normalize text to NFC before validation and file writes.
  - Add explicit detection for common mojibake byte-sequence patterns and fail the chapter/readability gate when found.

- **Validation guardrail:** `packages/story-validation/src/chapter-validator.ts`
  - Add a readability check that flags:
    - chapters with fewer than 3 meaningful paragraphs
    - chapters with single ultra-long paragraph blocks
    - extreme paragraph length imbalance
  - Mark severe readability failures as `major` so retry logic can repair before final persistence.

**Acceptance criteria:**
1. New `stories/project_*.txt` files show stable chapter/summary/body spacing with visible paragraph breaks.
2. Zero mojibake punctuation artifacts in saved prose files.
3. Chapter-level readability checks trigger retries for dense block output.
4. UTF-8 output is stable and valid multibyte Unicode characters are preserved.
5. Illegal control characters are absent from persisted prose/story files.

---

## Phase 6 — Scene-setting enforcement from location profiles (implemented)

**Goal:** Ensure every chapter is scene-grounded using generated location profile data (not generic mansion filler language).

**Implementation targets:**

- **Prompt contract:** `packages/prompts-llm/src/agent9-prose.ts`
  - Add explicit chapter-level grounding contract:
    - each chapter must anchor to a named location from `locationProfiles.keyLocations` or primary location
    - opening paragraph must include at least 2 sensory cues from that location profile
    - chapter must include one physical/layout constraint relevant to movement or access
  - Add anti-generic rule: reject repetitive boilerplate openings that do not reference profile-specific details.

- **Orchestrator context plumbing:** `apps/worker/src/jobs/mystery-orchestrator.ts`
  - Build a per-scene location grounding checklist from outline scene locations + `locationProfiles`.
  - Pass checklist into prose quality guardrails (initial and retry prompts).

- **Validation coverage:** `packages/story-validation/src/chapter-validator.ts`
  - Add a `checkSceneGrounding()` stage that verifies each chapter includes:
    - one explicit location anchor term
    - at least two sensory markers
    - at least one atmosphere/weather marker aligned with profile context
  - Escalate repeated grounding misses to `major` severity.

**Acceptance criteria:**
1. Early chapters consistently establish scene/place using location profile details.
2. At least 90% of chapters pass scene-grounding checks on first generation attempt.
3. Prose scorer setting-fidelity/scene-grounding consistency reaches passing thresholds.

---

## Phase 7 — Repetition and pacing cleanup (implemented)

**Goal:** Reduce chapter-to-chapter repetition and improve narrative progression.

**Implementation targets:**

- **Prompt anti-repetition rules:** `packages/prompts-llm/src/agent9-prose.ts`
  - Add n-gram and motif repetition constraints for adjacent chapter openings.
  - Require chapter-purpose differentiation (new clue, conflict shift, suspect movement, or test progression).

- **Validation pass:** `packages/story-validation/src/chapter-validator.ts`
  - Add repeated-opening and repeated-atmosphere phrase checks across neighboring chapters.
  - Flag over-reused scaffolding patterns (e.g., repeated “storm + chandelier + tension” openings).

**Acceptance criteria:**
1. Adjacent chapter opening similarity drops below configured threshold.
2. Narrative progression checks confirm each chapter advances at least one plot state.

---

## Phase 8 — End-to-end verification and release gate update (in progress)

**Goal:** Prove fixes with fresh runs and make failures visible before release.

**Verification workflow:**
1. Run worker build and story-validation tests.
2. Execute at least 2 fresh full pipeline runs.
3. Inspect generated `stories/project_*.txt` files for whitespace, encoding, and scene grounding.
4. Review scoring report and release-gate warnings for regressions.

**Release-gate additions (implemented):**
- Warn when readability density threshold is exceeded.
- Warn when scene-grounding coverage falls below target.
- Warn when mojibake artifacts remain after sanitation.
- Warn when illegal character checks fail (invalid control chars / encoding corruption).
- Record UTF-8 + multibyte character validation status in run warnings/report.

---

## Build & verify

After all adapter, prose, and validation changes:

```powershell
cd c:\CML\apps\worker
npx tsc -p tsconfig.json
echo "EXIT:$LASTEXITCODE"

cd c:\CML\apps\api
npx tsc -p tsconfig.json
echo "EXIT:$LASTEXITCODE"

cd c:\CML
npm test --workspace=packages/story-validation
echo "EXIT:$LASTEXITCODE"
```

Then trigger at least 2 full pipeline runs and check:
- quality report phases meet thresholds
- no mojibake in saved story files
- chapter scene-setting uses location profile details consistently
- plain-text spacing is readable without manual edits

---

## Project 20 Incident Plan — Deep phased remediation (2026-02-28)

Latest run review of [stories/project_20.txt](stories/project_20.txt) indicates quality-gate failure conditions despite partial continuity improvements.

### Incident snapshot (observed defects)

1. **Encoding corruption / mojibake in dialogue punctuation**
  - Examples include `â`, `â`, and malformed apostrophes/quotes across many chapters.
2. **Prompt-template leakage and repeated atmospheric scaffold blocks**
  - Repeated location/sensory boilerplate appears nearly verbatim in multiple sections.
3. **Timeline/environment contradictions**
  - "May evening" narration coexists with "english autumn" weather framing in the same narrative stream.
4. **Role/identity drift in investigator framing**
  - Narration alternates between "amateur investigator" framing and suspect-led investigative authority in ways that reduce coherence.
5. **Chapter progression / closure incompleteness**
  - Late-stage suspect-clearing passages appear, but final reveal/denouement quality is inconsistent and reads as unresolved.

### Primary root-cause hypothesis

- **H1 (encoding):** corrupted text enters before final sanitation pass or survives replacement-map normalization.
- **H2 (repetition):** prose generation receives over-prescriptive scaffold text and lacks strong anti-duplication constraints and post-check repair.
- **H3 (continuity):** chapter-level validators are active but do not yet enforce strict contradiction checks on season/month consistency.
- **H4 (role drift):** identity/role consistency checks currently emphasize character-name integrity more than narrative-role stability.
- **H5 (closure):** release gate warns on unresolved structure but currently allows completion, leaving visibly incomplete story arcs.

---

## Phase 9 — Hot containment (P0, same-day)

**Goal:** Prevent publishing clearly corrupted prose while preserving pipeline throughput.

### 9.1 Tighten blocking criteria for encoding corruption
- Escalate persistent mojibake findings from warning to blocking failure when replacement pass cannot clean them.
- Add explicit fail patterns for known corrupted quote/apostrophe byte sequences.

### 9.2 Repetition safety cutoff
- Add deterministic duplicate-block detector over chapter openings and boilerplate atmosphere spans.
- If duplicate span similarity exceeds threshold after one repair retry, fail prose stage and mark run `needs_review`.

### 9.3 Run-status signaling
- Add a clear run event that classifies output as **degraded** when prose completes with unresolved critical readability/coherence defects.

**Acceptance criteria:**
1. Any run with remaining mojibake in persisted prose is flagged and blocked from final "healthy" status.
2. Verbatim duplicate atmospheric blocks are no longer present in persisted `stories/project_*.txt`.
3. UI/run history clearly distinguishes "completed" vs "completed with degraded prose".

---

## Phase 10 — Prompt contract hardening (P1)

**Goal:** Reduce generation of repetitive scaffold and temporal contradictions at source.

### 10.1 Anti-template prose contract
- Update prose prompt requirements to prohibit reusing full location-scaffold sentences across chapters.
- Require chapter openings to include unique, chapter-specific physical detail from location profile arrays.

### 10.2 Temporal consistency contract
- Add mandatory temporal anchor tuple per chapter (`month/season/weather`) and explicit "no contradictory season language" instruction.
- If month is explicitly set, season terms must be compatible with configured region climate frame.

### 10.3 Investigator-role consistency contract
- Add role ledger in prompt context (who is detective/investigator/narrative driver).
- Prohibit reassignment without explicit transition scene.

**Acceptance criteria:**
1. Adjacent chapter opening similarity remains below configured threshold.
2. No month/season contradictions are detected in validation runs.
3. Investigator role remains stable unless transition is explicitly narrated.

---

## Phase 11 — Validator expansion (P1)

**Goal:** Convert current soft quality issues into deterministic, testable checks.

### 11.1 Temporal contradiction validator
- Add validator rule that cross-checks date/month mentions against season/weather language.
- Emit structured violations with chapter references and contradiction type.

### 11.2 Narrative role continuity validator
- Track investigator role mentions chapter by chapter.
- Flag unannounced role swaps and contradictory authority statements.

### 11.3 Boilerplate duplication validator
- Add rolling n-gram + sentence fingerprint checks across chapter intros and scene-setting paragraphs.
- Flag repeated high-overlap spans above threshold.

**Acceptance criteria:**
1. Validators return stable machine-readable violations suitable for retry prompts.
2. New checks integrate into prose retry loop before persistence.
3. Quality report includes explicit counters for temporal, role, and duplication defects.

---

## Phase 12 — Repair loop and selective regeneration (P2)

**Goal:** Repair only broken segments to reduce cost and prevent full-story drift.

### 12.1 Chapter-targeted repair prompts
- When validators fail, regenerate only affected chapters with explicit defect list.
- Preserve unaffected chapters and maintain clue/reveal continuity markers.

### 12.2 Canonical text sanitation pipeline
- Reorder sanitation sequence to: normalize → strip invalid controls → mojibake remap → quote normalization → whitespace reflow.
- Add before/after diagnostics counters written to run logs.

### 12.3 Deterministic post-repair check
- Re-run all prose validators after repair; block persistence if critical defects remain.

**Acceptance criteria:**
1. Repair retries target only failing chapters in >90% of cases.
2. Post-repair persisted story text passes encoding + duplication + continuity checks.
3. Retry cost remains within configured budget envelope.

---

## Phase 13 — Release gate policy update (P2)

**Goal:** Align release semantics with actual reader quality expectations.

### 13.1 Promote critical prose defects to hard-stop
- Hard-stop conditions:
  - unresolved mojibake/encoding corruption,
  - unresolved duplicate boilerplate spans,
  - unresolved temporal contradiction,
  - unresolved missing denouement/reveal closure.

### 13.2 Degraded output channel
- If hard-stop override is explicitly enabled for debugging, persist artifacts under a degraded tag and prevent default UI "healthy" badge.

### 13.3 Export protection
- Disable/annotate PDF export for degraded prose unless user explicitly opts in.

**Acceptance criteria:**
1. Critical prose failures cannot silently pass as healthy completion.
2. Degraded artifacts are clearly marked in API/UI/export flows.
3. Default user experience does not surface corrupted text as final output.

---

## Phase 14 — Regression guardrails and verification (P2)

**Goal:** Prevent recurrence via automated tests and runbook checks.

### 14.1 Automated regression tests
- Add tests for:
  - mojibake detection/remediation,
  - duplicate scene-setting block detection,
  - temporal contradiction classification,
  - investigator-role continuity drift.

### 14.2 Golden-file quality fixtures
- Add small prose fixtures representing known failure patterns from project 20.
- Ensure validators and repair loop produce deterministic outcomes.

### 14.3 Verification runbook
- Require 2+ fresh full runs and one stress run (long format).
- Compare defect counters across runs and confirm zero critical prose defects.

**Acceptance criteria:**
1. New regression tests are green in CI.
2. Two consecutive full runs produce no critical prose violations.
3. Long-format run completes without duplicated template scaffolds.

---

## Execution order and ownership

1. **P0 containment first:** Phase 9
2. **Source-quality hardening:** Phases 10–11
3. **Repair and policy:** Phases 12–13
4. **Regression lock-in:** Phase 14

Recommended ownership:
- Prompt contract and retry messaging: `packages/prompts-llm`
- Deterministic validators and tests: `packages/story-validation`
- Orchestration, gating, and status semantics: `apps/worker`
- Output persistence/export behavior: `apps/api`

---

## Definition of done for this incident

This incident is considered resolved when all are true:
1. No mojibake or illegal encoding artifacts in persisted prose/text exports.
2. No repeated atmospheric template blocks above threshold.
3. No unresolved month/season contradiction findings.
4. Investigator role continuity passes deterministic validation.
5. Final chapters include explicit reveal + closure quality signals.
6. Release gate marks output healthy only when critical prose checks pass.

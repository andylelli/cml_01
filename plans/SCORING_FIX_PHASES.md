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

## Phase 5 — Story whitespace/paragraph formatting (implemented)

**Goal:** Ensure generated prose artifacts are readable by default (clear paragraph breaks, chapter spacing, and summary/body separation) so users do not need to manually reformat `stories/project_*.txt`.

**Why this is needed:** Current prose exports can contain dense blocks with insufficient whitespace and wrapped lines that reduce readability in plain-text story files.

**Implementation location:**

- **Primary location:** `apps/api/src/server.ts`
  - Added prose readability formatting helper functions and story-text persistence in the pipeline save path.
  - Story files now write to `stories/project_*.txt` by default.
  - Formatting normalizes:
    - one blank line before each chapter heading
    - one blank line between `Summary:` and body paragraph
    - one blank line between body paragraphs
    - collapsed accidental hard-wraps inside a paragraph block

**Acceptance criteria:**

1. Newly generated `stories/project_*.txt` files show consistent blank-line spacing across all chapters.
2. Existing prose wording/content is preserved (formatting-only transformation).
3. No regressions in prose validation/scoring pipeline.

**Verification:**

- Generate fresh runs and inspect saved story text files for spacing consistency.
- Confirm TypeScript checks still pass for API and worker/story-validation packages.

---

## Phase 6 — Schema and agent-flow remediation (in progress)

**Goal:** Align schema contracts with real runtime payloads and remove recurring flow inconsistencies.

### 6.1 P0 — Eliminate false schema failures in Agent 2b/2c/2d ✅ completed

**Files:**
- `packages/prompts-llm/src/utils/validation-retry-wrapper.ts`
- `packages/prompts-llm/src/agent2b-character-profiles.ts`
- `packages/prompts-llm/src/agent2c-location-profiles.ts`
- `packages/prompts-llm/src/agent2d-temporal-context.ts`

**Remediation:**
- Validate the same object shape that is persisted (including telemetry fields), or consistently validate payload-only and attach telemetry after validation.
- Remove the extra regeneration call after retries are exhausted and return the actual last attempted result.
- Verify logs no longer include:
  - `cost is required`
  - `durationMs is required`

### 6.2 P0 — Fix CWD-dependent path resolution ✅ completed

**File:** `apps/worker/src/jobs/mystery-orchestrator.ts`

**Remediation:**
- Replace `process.cwd()` path derivations for retry config/logs/examples with workspace-root resolution from module path (`import.meta.url`).
- Ensure API-launched runs resolve:
  - `apps/worker/config/retry-limits.yaml`
  - `apps/worker/logs`
  - `examples`

### 6.3 P1 — Align cast schema to runtime model ✅ completed

**Files:**
- `packages/prompts-llm/src/agent2-cast.ts`
- `schema/cast_design.schema.yaml`

**Remediation:**
- Unify `crimeDynamics` fields between schema and runtime output:
  - runtime currently emits `possibleCulprits`, `redHerrings`, `victimCandidates`, `detectiveCandidates`
  - schema currently expects `suspectPool`, `culpritViability`
- Standardize timing field naming (`durationMs` vs `latencyMs`) across cast artifact contracts.

### 6.4 P1 — Remove legacy CML cast field assumptions downstream ✅ completed

**Files:**
- `packages/prompts-llm/src/agent7-narrative.ts`
- `packages/prompts-llm/src/agent6-fairplay.ts`
- `packages/prompts-llm/src/agent8-novelty.ts`

**Remediation:**
- Replace references to legacy cast fields (`role`, `character_id`) with canonical CML 2.0-compatible fields (`role_archetype`, name-based references).
- Keep explicit fallback behavior only where needed, with warnings for fallback usage.

### 6.5 P2 — Enforce schema validation coverage for all key artifacts ✅ completed

**File:** `apps/worker/src/jobs/mystery-orchestrator.ts`

**Remediation:**
- Add runtime schema validation (pre-persist) for artifacts not currently validated uniformly:
  - `setting_refinement`
  - `cast_design`
  - `narrative_outline`
  - `prose`
- Keep unexpected-field warnings surfaced in run warnings/history.

### 6.6 P2 — Add regression guardrails for contract drift ✅ completed

**Files:** test suites under `packages/prompts-llm`, `packages/story-validation`, and worker integration tests.

**Remediation:**
- Added retry-wrapper regression tests in `packages/prompts-llm/__tests__/validation-retry-wrapper.test.ts`.
- Added contract-drift schema tests in `packages/story-validation/src/__tests__/artifact-contract-drift.test.ts` for renamed cast keys and latency fields.
- Added worker runtime path resolution regression tests in `apps/worker/src/__tests__/runtime-paths.test.ts` to guard against CWD-dependent ENOENT failures.

### Exit criteria for Phase 6

1. No Agent 2b/2c/2d validation errors for missing `cost`/`durationMs`.
2. No retry-config ENOENT path failures in API-launched runs.
3. Cast schema and Agent 2 runtime payload shape are identical.
4. Narrative/fair-play/novelty prompt contexts avoid legacy cast fields by default.
5. All schema-backed artifacts are validated before persistence.

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

---

## Run Audit (Markdown): run_f29dda13-2286-413f-97e0-7945243aa16d

Date: 2026-03-09

### Scope reviewed
- `validation/quality-report-run_f29dda13-2286-413f-97e0-7945243aa16d.json`
- `apps/worker/logs/scoring.jsonl`
- `apps/api/logs/llm.jsonl`
- `apps/api/logs/activity.jsonl`

### A) Inconsistencies

1. Overall grade/score vs run outcome conflict
- Evidence:
  - Report shows `overall_score: 97.77`, `overall_grade: A`, but `passed: false` in `validation/quality-report-run_f29dda13-2286-413f-97e0-7945243aa16d.json:9`.
  - Report shows `aborted: true`, `abort_reason: Release gate hard-stop: templated prose leakage detected` in `validation/quality-report-run_f29dda13-2286-413f-97e0-7945243aa16d.json:5158`.
- Why inconsistent:
  - Score headline implies success while release gate determines terminal failure.

2. Validation issue count mismatch by stage (11 critical vs 7 critical)
- Evidence:
  - `ValidationPipeline final_validation` reports `11 critical` in `apps/api/logs/llm.jsonl:6151`.
  - Release gate diagnostic reports `7 critical` in `apps/worker/logs/scoring.jsonl:187`.
- Why inconsistent:
  - Two official summaries exist without explicit stage attribution/reconciliation.

3. Prose duration/cost mismatch between phase and diagnostic
- Evidence:
  - Prose phase: `duration_ms: 375441`, `cost: 0.10107690945` in `validation/quality-report-run_f29dda13-2286-413f-97e0-7945243aa16d.json:3331`.
  - Post-generation summary: `prose_duration_ms: 180791`, `prose_cost: 0.0330716199` in `validation/quality-report-run_f29dda13-2286-413f-97e0-7945243aa16d.json:3405`.
- Why inconsistent:
  - Field naming does not reveal scope (first pass vs total lifecycle).

4. Clue visibility failure conflicts with NSD reveal trace
- Evidence:
  - Prose test fails: `Clue visibility: Only 0/1 clues` in `validation/quality-report-run_f29dda13-2286-413f-97e0-7945243aa16d.json:3015`.
  - NSD trace shows multiple clues revealed (`clue_1`, `clue_2`, `clue_5`, `clue_6`, `clue_7`, `clue_3`, `clue_4`) in `validation/quality-report-run_f29dda13-2286-413f-97e0-7945243aa16d.json:3467`.
- Why inconsistent:
  - Visibility scorer and NSD reveal tracker are using non-aligned definitions.

5. Transient report endpoint instability during live run
- Evidence:
  - Repeated report `404` during in-progress polling in `apps/api/logs/activity.jsonl:101853`.
  - Mid-run report `500` followed by recovery to `200` in `apps/api/logs/activity.jsonl:101930`.
- Why inconsistent:
  - Report endpoint behavior is unstable under normal polling conditions.

### B) Weaknesses

1. Completeness gating can fail under high aggregate score
- Evidence: Prose `84/B` but failed due to completeness `35` and critical clue visibility failure.
- Risk: Operators relying on top-line score can misread true run readiness.

2. Style entropy drift indicates templating pressure
- Evidence: NSD opening styles are overwhelmingly `general-descriptive`.
- Risk: Elevated chance of duplicate structural prose and hard-stop leakage flags.

3. Scene grounding below target despite fair-play pass
- Evidence: `17/19` grounded chapters, with release warning.
- Risk: Quality dimensions can pass while release policy still blocks publication.

4. Temporal consistency remains fragile
- Evidence: Retry events for chapters 12 and 13 due to month/season contradiction.
- Risk: Retry costs and latent contradiction leakage into rewritten chapters.

### C) Direct Failures

1. Prose generation phase failed threshold
- Evidence: `agent9_prose` failed with `component_failures: [completeness]`.

2. Release gate hard-stop
- Evidence: Hard-stop due to `templated prose leakage detected`.

3. Run outcome failed/aborted
- Evidence: Top-level `passed: false` and `aborted: true`.

### D) Deep Dive: Concrete Solutions

#### Issue 1: Score headline conflicts with final outcome
Root-cause hypothesis:
- Score and gate are parallel outputs without explicit precedence.

Concrete fix:
1. Add explicit top-level outcome contract:
- `run_outcome`: `passed | failed | aborted`
- `run_outcome_reason`
- `scoring_outcome` block
- `release_gate_outcome` block
2. Enforce precedence:
- Hard-stop or aborted flag always wins.

Acceptance criteria:
- No report can present an ambiguous final state.
- UI/export show `run_outcome` first.

#### Issue 2: 11 vs 7 critical mismatch
Root-cause hypothesis:
- Counts are from different lifecycle snapshots (pre-repair vs release gate).

Concrete fix:
1. Add stage snapshots:
- `validation_snapshots.pre_repair`
- `validation_snapshots.post_repair`
- `validation_snapshots.release_gate`
2. Add deterministic `issue_key` lineage and delta reconciliation.

Acceptance criteria:
- Every shown count maps to one stage.
- Any difference is explicitly represented as resolved/new delta.

#### Issue 3: Prose duration/cost ambiguity
Root-cause hypothesis:
- First-pass and total lifecycle metrics are conflated.

Concrete fix:
1. Replace ambiguous names with scoped metrics:
- `prose_duration_ms_first_pass`, `prose_duration_ms_total`
- `prose_cost_first_pass`, `prose_cost_total`
2. Add `rewrite_pass_count`, `repair_pass_count`, and per-pass token/costs.

Acceptance criteria:
- Metric scope is explicit and arithmetic invariants hold.

#### Issue 4: Clue visibility vs NSD mismatch
Root-cause hypothesis:
- NSD transitions and visibility scoring use different clue evidence standards.

Concrete fix:
1. Introduce unified clue evidence model:
- `introduced | hinted | explicit | confirmed`
2. Require NSD reveal events to include text evidence anchors.
3. Rework visibility scorer to consume the same clue-state model.
4. Add divergence telemetry (`nsd_visibility_divergence`).

Acceptance criteria:
- Visibility and NSD traces are reconciled by the same evidence table.

#### Issue 5: Report endpoint instability under polling
Root-cause hypothesis:
- Non-atomic writer/reader lifecycle and parse races.

Concrete fix:
1. Atomic file write pattern: temp-write -> fsync -> rename.
2. Stable in-progress contract: return `202` for active run report materialization.
3. Fallback read path: return last good snapshot with `stale=true` instead of 500.
4. Endpoint telemetry for read state transitions.

Acceptance criteria:
- No report `500` for active known runs under polling load.
- `404` reserved for truly unknown run IDs.

#### Issue 6: Style repetition and template leakage
Root-cause hypothesis:
- Prompt guidance is advisory; no online diversity gate before acceptance.

Concrete fix:
1. Add per-batch prose linter:
- opening-style entropy threshold
- paragraph fingerprint duplication check
- high-overlap n-gram detector
2. On linter fail, rewrite chapter before commit.

Acceptance criteria:
- Template leakage incidents trend down across fixed-seed regression set.

#### Issue 7: Month/season contradictions causing retries
Root-cause hypothesis:
- Temporal checks are mostly post-generation.

Concrete fix:
1. Build chapter-local temporal constraint packet from temporal context.
2. Inject hard temporal rules into generation prompt.
3. Run deterministic contradiction preflight before chapter acceptance.

Acceptance criteria:
- Contradiction retries approach zero in sampled runs.

### E) Implementation Order

1. Reporting truth model (Issues 1-3)
2. Endpoint stability under polling (Issue 5)
3. Clue evidence unification (Issue 4)
4. Prose robustness (Issues 6-7)
5. Regression gate with fixed-seed scenario set

### F) Engineering Checklist (Concrete)

1. Schema/contract updates
- `packages/story-validation/src/scoring/types.ts`
- `packages/story-validation/src/scoring/aggregator.ts`

2. Worker diagnostic emission updates
- `apps/worker/src/jobs/mystery-orchestrator.ts`
- `apps/worker/src/jobs/scoring-logger.ts`

3. API report stability and lifecycle states
- `apps/api/src/server.ts`

4. Scorer and clue-state reconciliation
- `packages/story-validation/src/scoring/*`
- NSD trace extraction and evidence hooks in worker prose pipeline

5. Tests
- `apps/api/src/__tests__/server.test.ts`
- `packages/story-validation/src/__tests__/*`
- worker integration tests for report lifecycle and temporal contradictions

### G) Overlap Audit Against Existing Fixes

This section de-duplicates the new run audit against prior remediation work so we do not repeat already-closed tasks.

#### Summary

- We have already closed a large volume of fixes across prior plans (CML path bugs, scorer defects, retry/re-score issues, schema drift, path resolution, UI reliability).
- The current run (`run_f29dda13...`) exposes a mostly different class of issues: report truth-model semantics, stage-count reconciliation, endpoint polling stability, and NSD-vs-visibility alignment.

#### De-dup Matrix

| Deep-dive issue | Prior fix overlap | Status now | Action |
|---|---|---|---|
| 1. Score headline vs run outcome conflict | Minimal overlap | **NEW** | Implement run outcome precedence contract |
| 2. 11 vs 7 critical mismatch | Minimal overlap | **NEW** | Add stage snapshots + reconciliation deltas |
| 3. Prose cost/duration ambiguity | Minimal overlap | **NEW** | Introduce scoped first-pass vs total metrics |
| 4. Clue visibility vs NSD mismatch | **Partial overlap**: earlier clue-path bugs fixed | **PARTIAL/NEW** | Keep prior clue-path fix; add unified clue evidence model |
| 5. Report endpoint polling instability | Minimal overlap | **NEW** | Atomic report write + 202 in-progress + stale fallback |
| 6. Style repetition/template leakage | **Partial overlap**: atmospheric warning and release gate exist | **PARTIAL/NEW** | Add online entropy/fingerprint lint + rewrite-before-commit |
| 7. Month/season contradiction retries | **Partial overlap**: retry-time validation exists | **PARTIAL/NEW** | Add pre-generation temporal constraints + deterministic preflight |

#### Already-Closed Areas (Do Not Re-open)

- CML clue path and identity rules schema mismatches from prior scorer phases are already marked complete.
- Identity/prose replacement re-score issues (orchestrator) are already marked complete.
- Agent 2b/2c/2d schema false failures and CWD path resolution fixes are already marked complete.
- Contract drift test guardrails from prior phases are already in place.

#### Practical rule for future edits

Before implementing any new remediation item, map it to one of these buckets:

1. **Closed bug class**: do not re-implement; only regression-test.
2. **Partial overlap**: extend existing mechanism, do not replace it.
3. **Net-new bug class**: implement fully with explicit acceptance criteria.

#### Note on duplicated plan files

- There are two similarly named plan files in the repo root and `plans/`:
  - `SCORING_FIX_PHASES.md`
  - `plans/SCORING_FIX_PHASES.md`
- Treat `plans/SCORING_FIX_PHASES.md` as the canonical working plan to avoid drift.

---

## Definitive Bad Prose Resolution Document (Open Fixes Only)

This is the single actionable list of remaining fixes required to resolve bad prose outcomes.
Completed items are intentionally excluded unless needed as dependencies.

### Goal

Ship prose runs that consistently pass release gate and quality checks without hidden contradictions between scoring, diagnostics, and exported evidence.

### Definition of done (hard)

1. No release hard-stop on templated prose leakage in 10 consecutive seeded runs.
2. No unresolved clue visibility/NSD divergence in 10 consecutive seeded runs.
3. Month/season contradiction retries reduced to zero (or explicitly justified) in 10 seeded runs.
4. Report polling endpoint produces no `500` during active-run polling load tests.
5. Final report state is never ambiguous (`run_outcome` deterministically set).

### P0 — Must Fix Immediately

#### P0-1: Canonical run outcome truth model
Problem:
- Reports can show `A` grade while run still fails/aborts, causing operator confusion.

Required fix:
1. Add top-level fields:
- `run_outcome: passed | failed | aborted`
- `run_outcome_reason`
- `scoring_outcome` (informational)
- `release_gate_outcome` (informational)
2. Enforce precedence in report builder and API response:
- hard-stop/abort always overrides score headline.

Primary files:
- `packages/story-validation/src/scoring/types.ts`
- `packages/story-validation/src/scoring/aggregator.ts`
- `apps/api/src/server.ts`

Acceptance:
- Any run with hard-stop must serialize `run_outcome="aborted"` regardless of score.

#### P0-2: Validation count reconciliation by stage
Problem:
- Conflicting critical counts (for same run) without stage labeling.

Required fix:
1. Add staged snapshots:
- `validation_snapshots.pre_repair`
- `validation_snapshots.post_repair`
- `validation_snapshots.release_gate`
2. Add `validation_reconciliation` block with resolved/new deltas.
3. Add deterministic `issue_key` for issue lineage.

Primary files:
- `packages/story-validation/src/scoring/types.ts`
- `apps/worker/src/jobs/mystery-orchestrator.ts`
- `apps/api/src/server.ts`

Acceptance:
- Every displayed issue count maps to one explicit stage and can be reconciled.

#### P0-3: Report endpoint stability under live polling
Problem:
- Mid-run report route can emit transient `404/500`.

Required fix:
1. Atomic report write path (temp write -> fsync -> rename).
2. Return `202` in-progress contract for known active run report materialization.
3. Fallback to last valid report snapshot with `stale=true` instead of `500`.

Primary files:
- `apps/api/src/server.ts`
- `packages/story-validation/src/scoring/report-repository.ts` (or repository implementation)

Acceptance:
- Polling test at 250ms interval returns only `202/200` for active known runs.

### P1 — Prose Quality Signal Alignment

#### P1-1: Clue visibility and NSD must share one evidence model
Problem:
- Prose visibility can fail while NSD trace claims clues revealed.

Required fix:
1. Introduce `clue_state` lifecycle per clue:
- `introduced`, `hinted`, `explicit`, `confirmed`
2. NSD reveal transitions must carry evidence anchors:
- `evidence_quote`
- `evidence_offset` (chapter/paragraph/sentence)
3. Clue-visibility scorer must consume same model.
4. Emit `nsd_visibility_divergence` when evidence is missing.

Primary files:
- `apps/worker/src/jobs/mystery-orchestrator.ts`
- `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`
- `apps/api/src/server.ts` (export shape)

Acceptance:
- No run can report clue reveal without corresponding text evidence.

#### P1-2: Scoped prose duration/cost metrics
Problem:
- First-pass and total lifecycle metrics are currently ambiguous.

Required fix:
1. Replace ambiguous fields with explicit scoped fields:
- `prose_duration_ms_first_pass`, `prose_duration_ms_total`
- `prose_cost_first_pass`, `prose_cost_total`
2. Add pass counters and per-pass accounting.

Primary files:
- `apps/worker/src/jobs/mystery-orchestrator.ts`
- `packages/story-validation/src/scoring/types.ts`

Acceptance:
- Metric scope ambiguity removed from report and export payloads.

### P2 — Prose Generation Robustness

#### P2-1: Anti-template online linter before commit
Status: implemented (2026-03-09).

Problem:
- Leakage is detected late at release gate, not prevented early.

Required fix:
1. Add per-batch linter checks:
- opening-style entropy threshold
- repeated paragraph fingerprint check
- high-overlap n-gram check
2. On failure, rewrite chapter/batch before commit.

Primary files:
- `packages/prompts-llm/src/agent9-prose.ts`
- `apps/worker/src/jobs/mystery-orchestrator.ts`

Acceptance:
- Duplicated long-block leakage trend drops and remains below threshold.

#### P2-2: Temporal consistency preflight (month/season)
Problem:
- Contradictions still appear and trigger retries.

Required fix:
1. Build temporal constraint packet per chapter from temporal context.
2. Inject hard constraints into prose prompt.
3. Run deterministic contradiction preflight before chapter acceptance.
4. Auto-rewrite only offending sentences when possible.

Primary files:
- `packages/prompts-llm/src/agent9-prose.ts`
- `packages/story-validation/src/chapter-validator.ts`

Acceptance:
- Month/season contradiction retry events reach zero on seeded regression set.

#### P2-3: Promote partially implemented prose gates
Problem:
- Some prose checks are warnings/prompts only and not enforced.

Required fix:
1. Promote victim identity from prompt+check to enforced release criterion after calibration.
2. Promote atmospheric variety from warning to gate once false-positive rate validated.
3. Add runtime validators for detective stake and emotional beat presence.

Primary files:
- `packages/story-validation/src/chapter-validator.ts`
- `apps/worker/src/jobs/mystery-orchestrator.ts`
- `packages/prompts-llm/src/agent9-prose.ts`

Acceptance:
- These criteria are visible in report tests and influence pass/fail deterministically.

### Execution order (strict)

1. P0-1 run outcome truth model
2. P0-2 validation reconciliation
3. P0-3 report polling stability
4. P1-1 clue/NSD evidence unification
5. P1-2 scoped prose metrics
6. P2-1 anti-template online linter
7. P2-2 temporal preflight
8. P2-3 promotion of partial prose gates

### Regression suite required before closure

1. Seeded run set: minimum 10 fixed seeds, same config, captured baseline.
2. Contract tests:
- report schema includes new outcome and reconciliation blocks.
3. Endpoint tests:
- active-run polling returns `202/200`, no `500`.
4. Quality tests:
- no unresolved clue/NSD divergence,
- no month/season contradictions,
- no template leakage hard-stop.

### Ownership map

- Worker orchestration and diagnostics: `apps/worker`
- Prompt and generation behavior: `packages/prompts-llm`
- Scoring schema and reconciliations: `packages/story-validation`
- API report contract and export behavior: `apps/api`

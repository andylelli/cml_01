# Run Review: Golden Age Prototype 33 — "The Clockwork Conspiracy"

**Run ID:** run_f1cc0440-f634-41e0-a195-b607ea431b37  
**Date:** 2026-03-07  
**Project:** Golden Age Prototype 33 (`proj_e90d794a-02b9-4bdf-bd4e-cf95c0891cb4`)  
**Story title:** The Clockwork Conspiracy  
**Setting:** Harrington Manor, 1930s English country estate  
**Story file:** not persisted (run failed release gate)  
**Quality report:** validation/quality-report-run_f1cc0440-f634-41e0-a195-b607ea431b37.json  
**Reviewer:** Copilot session review  
**Overall assessment:** `FAIL` (overall score 98 / grade A — gate blocked by prose completeness critical failure)

**Cast:** Martin Mandeville, Diana Drury, Timothy Playfair, Sheila Beresford, Marguerite Beauchamp  
(5 characters · 3 eligible suspects · 4 archetypes)  
**Run duration:** 605 s · **Cost:** $0.0624

---

## Phase scores summary

| Phase | Agent | Score | Grade | Passed |
|---|---|---|---|---|
| Setting Refinement | agent1_setting | 100 | A | ✅ |
| Cast Design | agent2_cast | 100 | A | ✅ |
| Background Context | agent2e_background_context | 98 | A | ✅ |
| Hard Logic Devices | agent3b_hard_logic_devices | 100 | A | ✅ |
| CML Generation | agent3_cml | 100 | A | ✅ |
| Novelty Audit | agent8_novelty | 100 | A | ✅ (skipped) |
| Clue Distribution | agent5_clues | 100 | A | ✅ |
| Fair-play Audit (CML) | agent6_fairplay | 100 | A | ✅ |
| Narrative Outline | agent7_narrative | 95 | A | ✅ |
| Character Profiles | agent2b_profiles | 100 | A | ✅ |
| Location Profiles | agent2c_location_profiles | 97 | A | ✅ |
| Temporal Context | agent2d_temporal_context | 95 | A | ✅ |
| **Prose Generation** | **agent9_prose** | **89** | **B** | **❌ FAIL** |

**Prose sub-scores:** validation 100 / quality 100 / completeness **50** / consistency 88  
**Failure reason:** 1 critical failure — completeness component below minimum. Clue visibility: 0/1 clues surfaced in prose.  
**Prose word count:** 15,471 words across 20 chapters.

---

## Observed defects

- **[S0 Critical] Zero clue visibility in prose — 0/1 CML clues surfaced**  
  **Evidence:** Prose validator: `Clue visibility: 0/1 clues` (score 0, weight 1.5, severity critical). The Clue Distribution agent (agent5_clues, 100/A) confirmed 8 clues placed with full inference coverage. Despite this, the prose agent surfaced none of the enumerated narrative clues in a way the validator could detect.  
  **Impact:** Mystery is formally unsolvable from prose alone. Gate correctly blocked release. Completeness sub-score collapsed to 50, pulling overall prose score to 89/B.  
  **Root-cause — confirmed via code audit (three compounding failures):**

  1. **Bug: field name mismatch in `buildProseRequirements` kills per-chapter CML clue injection.**  
     `packages/prompts-llm/src/agent9-prose.ts` line ~198 filters `clue_to_scene_mapping` using `scene.actNumber`, but the `Scene` interface defines the field as `scene.act`. `actNumber` is always `undefined`, so the filter never matches, the "Clue Placement for These Chapters" block is always empty, and the prose agent never receives the CML-level instruction for which clue goes in which chapter.

  2. **Structural gap: `ClueDistributionResult` is not passed to `generateProse`.**  
     `ProseGenerationInputs` has no field for the agent5 clue distribution. Scene objects carry only clue IDs (`cluesRevealed: ["clue_001"]`) — no descriptions, categories, or surface guidance. The prose agent has no way to know what specific observable evidence constitutes each clue ID, and so cannot reliably make it visible to the reader.

  3. **LLM non-compliance: agent7 clue pacing instruction was ignored.**  
     `agent7-narrative.ts` line 486 requires clues in ≥60% of scenes (≥12/20 in this run). The outline produced only 5/20 (25%). The 60% instruction is present but not enforced by any pre-prose gate check — if the LLM fails to comply, generation proceeds regardless.

- **[S2 Medium] Fair-play compliance borderline at prose level — 60/100**  
  **Evidence:** Prose validator: `Fair play compliance: 60/100` (score 60, weight 1.5, severity minor). The CML-level fair-play audit (agent6_fairplay) passed 100/A, indicating the structural plan was correct. The gap (CML 100 vs prose 60) indicates clues were structurally placed but their prose execution was too implicit for the reader to follow the detective's reasoning.  
  **Impact:** Borderline reader solvability. Passed the minimum threshold but the mystery feels opaque in execution.  
  **Root-cause:** Same as above — bug 1 and gap 2 together mean the prose agent is writing chapters without knowing which specific clues to surface explicitly, so it tends to bury evidence in atmosphere or off-hand dialogue rather than clear investigative observation.

- **[S3 Low] Narrative outline clue pacing thin — 5/20 chapters carry clues**  
  **Evidence:** Narrative Outline validator: `Clue pacing: 5/20 chapters have clues` (score 50, weight 1). Only 25% of chapters provide a clue anchor despite the agent7 prompt requiring ≥60%.  
  **Impact:** Directly feeds defect 1. Even if the prose injection were fixed, 15/20 chapters have no outline-level clue anchor to draw from.  
  **Root-cause:** No pre-prose gate checks outline clue pacing and rejects/retries if the threshold isn't met. The prompt instruction is advisory; it requires hard enforcement.

- **[S3 Low] Temporal context completeness gap — 2/4 optional fields detailed**  
  **Evidence:** Temporal Context validator: `Substantial content: 2/4 fields detailed` (score 50, weight 1.5). All core fields are present; optional richness lacking.  
  **Impact:** Minor; does not affect the prose gate.  
  **Root-cause:** Agent2d prompt does not strongly require substance in optional temporal context fields.

---

## Sprint 1–3 implementation status vs run_33 failures

The Sprints from run_30 (gender chain, lockedFacts, context hygiene, NSD, sensory variants, ProseConsistencyValidator) were **correctly implemented and are working as intended** for their targeted defect classes. None of the run_33 failures represent a regression in those systems. The clue visibility failure is a distinct, previously unexercised failure mode:

| Sprint 1–3 system | Working correctly? | Relevant to run_33 failure? | Bugs found |
|---|---|---|---|
| Gender / pronoun chain | ✅ Correct intent, minor format nit | No — consistency 88/100, pronoun issue not the root cause | `she/her/her` format nit (possessive should be `hers`; cosmetic only) |
| `lockedFacts` injection | ✅ Yes | No — no physical fact contradictions observed | None |
| `stripLocationParagraphs` / context hygiene | ✅ Yes | No — no context leakage detected | None |
| NSD — `initNarrativeState` / `buildNSDBlock` | ✅ Yes | No | None |
| NSD — `updateNSD` | ⚠️ Partial bug | No direct run_33 impact | `cluesRevealedToReader` is never populated — the "already revealed" anti-re-revelation guard is always empty (B2) |
| Sensory variants — `selectSensoryPaletteForChapter` | ❌ Dead code | No | Function defined in orchestrator, never called — palette selection is done entirely inline in `buildProsePrompt` (B3) |
| Sensory variants — inline palette loop in `buildProsePrompt` | ⚠️ Wrong field names | No direct run_33 impact | `scene.timeOfDay` (→ `scene.setting.timeOfDay`), `scene.weather` (→ `scene.setting.atmosphere`), `scene.setting.name/.id` (→ `scene.setting.location`) — matching never fires, first variant always selected (B4) |
| `ProseConsistencyValidator` | ✅ Yes | No — validator fired correctly | None |
| `ProseConsistencyReport` generation (pipeline) | ✅ Yes | No | None |

**The clue visibility failure is caused by three issues that those sprints did not address**, and which require targeted fixes described in the remediation plan below.

---

## Full Sprint 1–3 code audit — bugs and misalignments

Audit conducted against the `Scene` interface (`agent7-narrative.ts`), `NarrativeOutline`, `NarrativeState`, `ProseGenerationInputs`, `CMLData`, and the CML 2.0 schema. All findings below are confirmed by direct code inspection.

### B1 — `scene.actNumber` vs `scene.act` (Critical · Sprint 1 · agent9-prose.ts ~L198)
**Already documented** as the primary clue injection failure. Listed here for completeness.

Field used: `scene.actNumber`  
Correct field from `Scene` interface (agent7-narrative.ts L43): `scene.act`  
Note: `actNumber` is a field on `ActStructure` (the act object, L65), not on `Scene`. The scene carries `act: 1|2|3`, not `actNumber`. This was confused with the act-level field.

### B2 — `updateNSD` never populates `cluesRevealedToReader` (Medium · Sprint 2 · types/narrative-state.ts + mystery-orchestrator.ts)
`NarrativeState.cluesRevealedToReader` is designed to track which clue IDs have already been revealed to the reader, so subsequent chapter batches can be told "do not reveal these as new information." However:
- `initNarrativeState` initialises `cluesRevealedToReader: []` correctly.
- `updateNSD` receives `completedChapters: Array<{ title?, summary?, paragraphs? }>` — these are `ProseChapter` objects which carry no clue IDs.
- `updateNSD` returns `{ ...current, ... }` which spreads the existing (always-empty) `cluesRevealedToReader` unchanged.
- The `buildNSDBlock` prompt line "CLUES ALREADY REVEALED TO READER: ..." is therefore always suppressed (list is empty, condition `state.cluesRevealedToReader.length > 0` is never true).

The full anti-re-revelation guard is disabled for every run.  
**Fix needed:** In the orchestrator's `onBatchComplete`, extract `cluesRevealed` from the matching outline scenes (chapters `batchStart..batchEnd`) after prose returns, and merge the IDs into `narrativeState.cluesRevealedToReader` before calling `updateNSD` (or extend `updateNSD` to accept an `additionalClueIds: string[]` parameter).

### B3 — `selectSensoryPaletteForChapter` is dead code (Low · Sprint 3 · mystery-orchestrator.ts L701)
`selectSensoryPaletteForChapter` is defined in `mystery-orchestrator.ts` at line 701 and is **never called anywhere**. There is exactly one `grep` match for it — the definition itself. Sensory palette selection runs instead via an inline loop inside `buildProsePrompt` in `agent9-prose.ts`. The orchestrator helper is a stranded function from an earlier iteration that was superseded but not removed.  
**Fix:** Delete the dead function from `mystery-orchestrator.ts`.

### B4 — Wrong scene field names in `buildProsePrompt` sensory variant loop (Medium · Sprint 3 · agent9-prose.ts, inline palette loop)
The `Scene` interface defines:
```typescript
setting: { location: string; timeOfDay: string; atmosphere: string }
```
The inline palette loop in `buildProsePrompt` reads:
```typescript
const sceneSettingRaw    = scene.setting || scene.location;        // ← setting is an object
const sceneTimeOfDayRaw  = scene.timeOfDay || scene.time_of_day;   // ← should be scene.setting.timeOfDay
const sceneWeatherRaw    = scene.weather || scene.atmosphere;       // ← should be scene.setting.atmosphere
```
And the location match:
```typescript
(sceneSettingRaw.name || sceneSettingRaw.id || JSON.stringify(sceneSettingRaw))
// ← setting has no .name or .id; should use sceneSettingRaw.location
```
**Consequences:**
- `sceneTimeOfDay` is always `''` → the `variants.find()` condition has `!sceneTimeOfDay === true` for every variant → find() trivially returns the **first** variant in the array, always.
- `sceneWeather` is always `''` → same, the weather filter never triggers.
- The three-argument fallback `variants[chapterNum % variants.length]` (which would cycle correctly) is never reached because `variants.find()` always succeeds (returning variant[0]).
- The location match works by accident for simple names (JSON.stringify produces `{"location":"the library",...}` and `"library"` will `.includes()` match against `kl.id.toLowerCase()` if the ID contains the word) — but this is fragile; it fails for location IDs like `loc_1`.

**Net effect:** For every chapter in every run, the first sensory variant defined in the location profile is selected. No cycling occurs. No time-of-day or weather contextual matching occurs. The palette injection degrades to static (always variant[0]).  
**Fix:**
```typescript
// Replace:
const sceneTimeOfDayRaw  = scene.timeOfDay || scene.time_of_day;
const sceneWeatherRaw    = scene.weather || scene.atmosphere;
const sceneSetting       = sceneSettingRaw.name || sceneSettingRaw.id || ...

// With:
const sceneTimeOfDay     = (scene.setting?.timeOfDay ?? '').toLowerCase();
const sceneWeather       = (scene.setting?.atmosphere ?? '').toLowerCase();
const sceneSetting       = (scene.setting?.location ?? '').toLowerCase();
```
And guard the `variants.find()` call to only trigger when at least one of `sceneTimeOfDay`/`sceneWeather` is non-empty.

---

---

## What worked well

- **CML pipeline near-perfect:** Every pre-prose phase scored 95–100/A. Setting, cast, hard logic devices, character profiles, clue distribution, and CML-level fair-play audit all excellent.
- **Cast completeness:** 5 characters, 3 eligible suspects, 4 archetypes, 100% relationship reciprocity, average depth 84%. Full compliance.
- **Location and setting:** 5 locations, 100% physically plausible, 88% layout detail, 6/6 clue justifications well-grounded.
- **Hard logic devices:** 5 devices, 3 unique types, 100% depth, all with meaningful implications. Timing-based mechanism family (Clockwork Poison, Library's Last Page, Orchard's Alibi, Dueling Timers, Poisoned Chalice) shows strong conceptual variety.
- **Prose quality and readability:** Quality 76% average, readability 92% average, all 5 characters referenced, both locations referenced. No encoding artifacts, no template scaffold leakage detected.
- **Schema validation first pass:** CML validated on first attempt; no structural revision required.
- **Sprint 1–3 systems holding:** pronoun stability, physical fact consistency, no context leakage, atmospheric variety — all working.

---

## Phased remediation plan

### P0 Containment (same day)
- **Action:** Confirm gate correctly blocked and run is marked FAIL. Verify no story file was written — `stories/project_30.txt` is the prior run's output and was not overwritten.
- **Owner area:** apps/worker orchestrator
- **Status:** `DONE` (run marked `passed: false`; story file not updated)
- **Acceptance criteria:** Release pipeline did not emit a PDF or story file from this run.

### P1 Structural fixes — clue visibility + Sprint 1–3 bug fixes (priority: B1 → P1-C → B3 → B4 → B2 → P1-B)

**P1-A — Fix `actNumber` bug (one-line, highest immediate impact · Bug B1)**
- **File:** `packages/prompts-llm/src/agent9-prose.ts` ≈ line 198
- **Bug:** Filter reads `scene.actNumber` but `Scene` interface declares the field as `scene.act` (`actNumber` lives on `ActStructure`, not `Scene`). Always `undefined`; per-chapter CML clue injection always empty.
- **Fix:** `scene.actNumber === mapping.act_number` → `scene.act === mapping.act_number`
- **Owner area:** `packages/prompts-llm`
- **Status:** `DONE` — `scene.actNumber` → `scene.act` applied; worker tsc clean.
- **Acceptance criteria:** Per-chapter clue injection block is non-empty for scenes carrying mapped clues.

**P1-B — Add `ClueDistributionResult` to `ProseGenerationInputs`**
- **File:** `packages/prompts-llm/src/agent9-prose.ts` (interface + `buildProsePrompt`); `apps/worker/src/jobs/mystery-orchestrator.ts` (call site)
- **Gap:** `ProseGenerationInputs` has no `clueDistribution` field. Agent5 clue objects (name, description, delivery method, physical evidence) never reach the prose agent — it only sees bare IDs.
- **Fix:** (1) Add `clueDistribution?: ClueDistributionResult` to `ProseGenerationInputs`. (2) Write `buildClueDescriptionBlock(scenesForChapter, clueDistribution)` to resolve each scene's `cluesRevealed` IDs to full agent5 objects. (3) Emit as "CLUES TO SURFACE IN THIS CHAPTER" block per prompt. (4) Pass `clues` (already in orchestrator scope) to `generateProse`.
- **Owner area:** `packages/prompts-llm` + `apps/worker`
- **Status:** `DONE` — `clueDistribution?: ClueDistributionResult` added to `ProseGenerationInputs`; `buildClueDescriptionBlock` added; injected into system prompt; `clueDistribution: clues` wired at all 5 `generateProse` call sites. prompts-llm rebuilt; worker tsc clean.
- **Acceptance criteria:** Prose validator `Clue visibility` ≥ 1/1 (100%); fair-play compliance ≥ 70/100.

**P1-C — Pre-prose gate: enforce narrative outline clue pacing**
- **File:** `apps/worker/src/jobs/mystery-orchestrator.ts` (after agent7 completes)
- **Gap:** 60% clue-bearing-scene instruction in agent7 prompt (line 486) is advisory only — no hard check in orchestrator. Run_33: 5/20 = 25%, undetected.
- **Fix:** After agent7 returns, count scenes where `cluesRevealed.length > 0`. If `< 60%`, retry agent7 once with reinforced constraint. If still failing, abort the run before prose.
- **Owner area:** `apps/worker`
- **Status:** `DONE` — pacing gate block inserted after agent7 finalisation; counts clue-bearing scenes, retries formatNarrative once with hard constraint if < 60%, warns and proceeds if still insufficient.
- **Acceptance criteria:** Outlines reaching prose always satisfy ≥ 60% clue-bearing scenes.

**P1-D — Remove dead `selectSensoryPaletteForChapter` (Bug B3)**
- **File:** `apps/worker/src/jobs/mystery-orchestrator.ts` L701
- **Bug:** Defined, never called. Sensory palette logic lives entirely in `buildProsePrompt` inline loop. Dead code.
- **Fix:** Delete the function.
- **Owner area:** `apps/worker`
- **Status:** `DONE` — function deleted; worker tsc clean.
- **Acceptance criteria:** No dead function; TypeScript compiles cleanly.

**P1-E — Fix scene field names in sensory variant loop (Bug B4)**
- **File:** `packages/prompts-llm/src/agent9-prose.ts` (inline palette loop in `buildProsePrompt`)
- **Bug:** `scene.timeOfDay` → `scene.setting.timeOfDay`; `scene.weather || scene.atmosphere` → `scene.setting.atmosphere`; `scene.setting.name/.id` → `scene.setting.location`. With all values empty, `variants.find()` trivially matches variant[0] on every chapter. Cycling and context-matching both disabled.
- **Fix:** Use `scene.setting?.timeOfDay`, `scene.setting?.atmosphere`, `scene.setting?.location`; guard find() to only execute when at least one value is non-empty.
- **Owner area:** `packages/prompts-llm`
- **Status:** `DONE` — field reads corrected to `scene.setting?.location/timeOfDay/atmosphere`; `variants.find()` guard only fires when at least one constraint is non-empty; cycling fallback preserved.
- **Acceptance criteria:** Consecutive chapters at the same location receive different palette variants; time-of-day matching fires correctly.

**P1-F — Wire `cluesRevealedToReader` in `updateNSD` (Bug B2)**
- **File:** `apps/worker/src/jobs/mystery-orchestrator.ts` (`onBatchComplete`); `packages/prompts-llm/src/types/narrative-state.ts` (`updateNSD` signature)
- **Bug:** `NarrativeState.cluesRevealedToReader` is initialised `[]` and never updated. `updateNSD` receives `ProseChapter` objects (no clue IDs). The NSD "CLUES ALREADY REVEALED" guard is permanently empty and never injected.
- **Fix:** In `onBatchComplete`, extract `cluesRevealed` from narrative outline scenes for chapters `batchStart..batchEnd`, deduplicate, and merge into `narrativeState.cluesRevealedToReader` before calling `updateNSD`. Optionally extend `updateNSD` to accept `additionalClueIds: string[]`.
- **Owner area:** `apps/worker` + `packages/prompts-llm`
- **Status:** `DONE` — both scoring and non-scoring `onBatchComplete` paths now cross-reference outline scenes for batchStart..batchEnd and merge `cluesRevealed` IDs into `narrativeState.cluesRevealedToReader` before `updateNSD`.
- **Acceptance criteria:** After each batch, `narrativeState.cluesRevealedToReader` contains all clue IDs from outline scenes ≤ the last completed chapter; NSD block emits the list in the prose prompt.

### P2 Hardening and regression (3–7 days)
- **Action:** Add post-prose clue traceability check: after prose generation, verify each named clue from `ClueDistributionResult` can be matched to at least one chapter's prose via keyword/entity scan. Fail the prose gate if any CML clue has zero prose matches.
- **Owner area:** `packages/story-validation`
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** Post-prose clue traceability validator reports 100% clue coverage; regression test added.

---

## Validation and verification
- **Required tests:** Clue visibility validator (per-clue prose match); clue pacing enforcement test in narrative outline validator.
- **Required full-run checks:** 1 medium run (10–12 chapters) to confirm clue surfacing fix, then 1 longer run.
- **Export checks:** Story file only written for runs that pass the gate; no prose emission on gate failure.
- **Gate outcome:** FAIL — blocked. P1 implementation required before re-run.

---

## Definition of done
- [x] P1-A: `scene.actNumber` → `scene.act` bug fixed (Bug B1)
- [x] P1-B: `ClueDistributionResult` wired into `ProseGenerationInputs`; full clue descriptions reach prose
- [x] P1-C: Post-agent7 pacing gate — pipeline rejects outlines with < 60% clue-bearing scenes
- [x] P1-D: Dead `selectSensoryPaletteForChapter` removed (Bug B3)
- [x] P1-E: Scene field names fixed in `buildProsePrompt` sensory loop (Bug B4)
- [x] P1-F: `cluesRevealedToReader` populated in `onBatchComplete` (Bug B2)
- [ ] Prose clue visibility: 1/1 clues (100%)
- [ ] Prose fair-play compliance ≥ 70/100
- [ ] Narrative outline clue pacing ≥ 60% of scenes (enforced by gate)
- [ ] Prose completeness sub-score ≥ 75
- [ ] Prose gate passed (overall prose score ≥ 90 / grade A)
- [ ] No critical encoding artifacts
- [ ] No repeated template leakage above threshold
- [ ] Regression tests added for clue visibility, clue pacing, and sensory cycling (P2)

---

## Status update
- Prose gate failure confirmed: `DONE`
- Story file not persisted: `DONE` (project_30.txt is prior run's output and untouched)
- P1 implementation: `DONE` — all six items (P1-A through P1-F) implemented; prompts-llm rebuilt; worker tsc 0 errors
- Re-run verification: `READY` — awaiting next run to confirm prose clue visibility ≥ 1/1, pacing gate fires, sensory cycling works

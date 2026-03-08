# Run Review: Golden Age Prototype 34

**Run ID:** run_eebf98f8-30e7-403a-961b-afbaa04095a1  
**Date:** 2026-03-08  
**Project:** Golden Age Prototype 34 (`proj_76c80c2e-f04e-4669-bf5e-2f3ba6da6817`)  
**Story title:** Unknown (artifact not persisted — run failed release gate hard-stop)  
**Setting:** 1940s Country House, February 1943 · amateur detective · short · behavioral  
**Story file:** not persisted (run failed release gate)  
**Quality report:** validation/quality-report-run_eebf98f8-30e7-403a-961b-afbaa04095a1.json  
**Reviewer:** Copilot session review  
**Overall assessment:** `FAIL` — dual failure: quality gate blocked by prose clue visibility (0/1 critical); release gate hard-stop for templated prose leakage + month/season contradiction

**Cast:** Enid Lister, Sharon Lockwood, Jonas Haworth, Claire Broadbent (victim), Enoch Garlick  
(5 characters · 3 eligible suspects · 3 archetypes)  
**Run duration:** 556 s (~9.3 min) · **Cost:** $0.0472

**Significance:** First run with P1-A through P1-F (Sprint 1–3 bug fixes) applied. All structural fixes are active; the pacing gate (P1-C) fired and retried but the retry also failed — the LLM produced only 4-5 clue-bearing scenes out of 18, far below the 60% minimum. Prose ran twice (first pass + full repair retry) and both produced 0/1 clue visibility. Two new release gate failures unrelated to P1 fixes emerged.

---

## Phase scores summary

| Phase | Agent | Score | Grade | Passed | Duration |
|---|---|---|---|---|---|
| Setting Refinement | agent1_setting | 100 | A | ✅ | 8,652ms |
| Cast Design | agent2_cast | 98 | A | ✅ | 13,485ms |
| Background Context | agent2e_background_context | 98 | A | ✅ | 2,032ms |
| Hard Logic Devices | agent3b_hard_logic_devices | 100 | A | ✅ | 12,684ms |
| CML Generation | agent3_cml | 100 | A | ✅ | 22,263ms |
| Novelty Audit | agent8_novelty | 100 | A | ✅ (skipped) | 0ms |
| Clue Distribution | agent5_clues | 100 | A | ✅ | 18,942ms |
| Fair-play Audit (CML) | agent6_fairplay | 100 | A | ✅ | 4,250ms |
| Narrative Outline | agent7_narrative | 92 | A | ✅ | 34,734ms |
| Character Profiles | agent2b_profiles | 100 | A | ✅ | 34,612ms |
| Location Profiles | agent2c_location_profiles | 97 | A | ✅ | 31,206ms |
| Temporal Context | agent2d_temporal_context | 91 | A | ✅ | 12,604ms |
| **Prose Generation** | **agent9_prose** | **84** | **B** | **❌ FAIL** | 154,234ms |

**Prose sub-scores:** validation 85 (18/20 chapters) / quality 100 / completeness **50** / consistency 87  
**Failure reason:** 1 critical failure — clue visibility 0/1. Release gate additionally hard-stopped for templated prose leakage + month/season contradiction.  
**Prose word count:** 13,214 words across 18 chapters (low for target; expected 20 chapters / ~24,000 words).

**Note:** Prose ran twice — first pass (18 chapters) followed by full repair retry (18 chapters). Both passes produced 0/1 clue visibility. The quality report captures only the final pass.

---

## Pipeline event sequence

| Event | Description |
|---|---|
| setting | Era and setting refined |
| cast | Cast designed (5 characters) |
| background-context | Background context generated |
| hard_logic_devices | Generated 5 novel hard-logic devices |
| cml | Mystery structure generated and validated |
| novelty | Novelty check skipped (threshold ≥ 1.0) |
| clues | **8 clues distributed** → coverage gaps → regenerated (no final count reported) |
| fairplay | Fair play audit: pass; blind reader simulation: PASS |
| narrative | **20 scenes structured (24,000 words)** → pre-prose quality gate retry → 18 scenes |
| narrative | **Pacing gate fired: 4/18 scenes have clues (≥11 required)** → retry still failed → kept 18-scene outline |
| profiles | Character profiles generated (5) |
| location-profiles | Location profiles generated (2 locations) |
| temporal-context | Temporal context generated (February 1943) |
| prose (pass 1) | Chapters 1–18 · ch.1 retry (victim name) · ch.16 retry (paragraph count) |
| validation | **Story validation failed; attempting prose repair retry** |
| prose (pass 2) | All 18 chapters regenerated [Repair] · ch.1 retry · ch.2 retry |
| validation | Prose repair: validation still failed |
| validation | **Release gate hard-stop: templated prose leakage; month/season contradictions** |
| pipeline_error | Pipeline failed |

---

## Observed defects

### [S0 Critical] Zero clue visibility — 0/1 CML clues surfaced in prose

**Evidence:** Prose scorer: `Clue visibility: 0 — Only 0/1 clues` (score 0, weight 1.5, severity critical). Quality gate blocked.

**Root-cause chain:**
1. The pre-prose outline quality gate retry reduced the outline from 20 → 18 scenes.
2. The pacing gate (P1-C) measured 4/18 scenes with clue anchors (≥11 required for 60%). It retried `formatNarrative` with a hard pacing constraint but the retry also produced only 4-5 clue-bearing scenes → gated outline kept; pacing gate ineffective.
3. With only 4-5 clue-bearing scenes, `buildClueDescriptionBlock` (P1-B) could only inject clue descriptions into those specific chapters. The critical inference-path clue was not anchored in any of the clue-bearing scenes — so it received no injection and was not surfaced.
4. The repair retry (second prose pass) regenerated all 18 chapters with targeted guardrails but still produced 0/1 clue visibility — confirming the root failure is at the outline level, not the prose level.

**Impact:** Mystery formally unsolvable from prose alone. Completeness sub-score collapsed to 50, pulling overall prose to 84/B. Gate blocked release.

**P1 status vs this failure:** P1-A (actNumber → act field fix) and P1-B (clue description injection) are both correctly active. The failure is upstream — the pacing gate's retry is ineffective because the LLM ignores the count constraint. Even correct clue injection cannot surface clues that have no outline anchor.

---

### [S0 Critical] Release gate hard-stop — templated prose leakage + month/season contradiction

**Evidence:**  
- `Release gate hard-stop: templated prose leakage detected (duplicate long blocks: 2, scaffold matches: 0)`  
- `month/season contradictions found (chapter 5: february with autumn)`

**Root-cause — leakage:** The prose repair retry regenerated all 18 chapters under guardrails that may have caused the LLM to reuse boilerplate structural blocks. "Duplicate long blocks: 2" means the release gate detected 2 long passages that appear verbatim (or near-verbatim) more than once across chapters. This is a new failure mode not seen in run_33.

**Root-cause — season contradiction:** The temporal context (correctly generated as "February 1943") was not enforced in the prose prompt. Chapter 5 referenced "autumn" despite the story being set in February — a season–month mismatch. The `month/season contradictions` check in the release gate is a hard-stop.

**Impact:** Pipeline terminated before any story file was written.

---

### [S2 Medium] Pacing gate retry threshold bug — B5 (new bug, fixed this session)

**Evidence:** Pacing gate fires on 18-scene outline (from quality gate retry). In the pre-fix code, when the pacing retry returns a different scene count, `minClueScenes` is still computed from the original outline's scene count — creating an inconsistent threshold. For a retry returning 16 scenes, the check would require `ceil(18 × 0.6) = 11` clue-bearing scenes in a 16-scene outline — impossible.

**Fix applied:** `mystery-orchestrator.ts` pacing gate — recompute `minClueScenes` from `retriedOutlineScenes.length` before the success comparison, so the threshold always matches the retry outline's actual scene count.

---

### [S2 Medium] Fair-play compliance borderline — 60/100 prose

**Evidence:** Prose scorer: `Fair play compliance: 60/100` (score 60, weight 1.5, severity minor). CML-level fair-play audit (100/A) passed.

**Root-cause:** Same pattern as run_33 — with only 4-5 out of 18 chapters carrying clue anchors and no clue descriptions injected into the other 13 chapters, the prose agent buries evidence or omits it entirely. The gap between the CML's structural validity and the prose execution remains while the pacing problem persists.

---

### [S3 Low] Narrative outline — 18 chapters vs expected 20; 5/18 with clues

**Evidence:** Narrative scorer (quality gate passes 92/A despite sub-failures):
- `Clue pacing: 50 — 5/18 chapters have clues` (weight 1, score 50, FAIL)
- `Chapter count: 80 — 18 chapters (expected 20)` (weight 2, score 80)

**Root-cause — chapter count:** The pre-prose outline quality gate retry (coverage gaps) produced 18 scenes instead of the expected 20. The pacing gate also did not restore the count. The prose therefore generated 18 chapters, not 20 — contributing to the low word count (13,214 vs target ~24,000).

**Root-cause — clue pacing 5/18:** The pacing gate fired on 4/18 clue-bearing scenes and retried, but the retry failed to improve. The final outline used was the 18-scene outline with only 4-5 scenes carrying clue anchors (the quality scorer reports 5/18 because it measures the actual outline used for prose).

---

### [S3 Low] Clue distribution — double run with unclear final count

**Evidence:** History tab shows `"8 clues distributed"` followed by `"Regenerating clues to address coverage gaps..."`. No final clue count event after the second generation.

**Root-cause:** The clue regeneration event completes silently after the coverage-gap retry; a "N clues distributed (regenerated)" confirmation message is missing, leaving the History tab showing the intermediate "8 clues" count with no final confirmation.

**Impact:** Informational only — the Clue Distribution phase scored 100/A, confirming the final clue set is correct. The Coverage Gap flag and missing end-event are UI/logging gaps.

---

### [S3 Low] Temporal context — 2/4 fields detailed; fashion 60% richness

**Evidence:** Temporal scorer (fails but grade is A at 91/100):
- `Substantial content: 50 — 2/4 fields detailed` (weight 1.5, score 50, FAIL)
- `Fashion detail: 60 — 60% richness` (weight 1, score 60)

**Root-cause:** Agent2d prompt does not strongly require substance in all four optional temporal context fields. Two of four fields delivered minimal detail.

---

### [S3 Low] Location profiles — only 2 locations (short target, but below 3-location minimum)

**Evidence:** Location scorer: `Minimum locations: 66.7 — Only 2 locations` (weight 1.5, score 67, severity major). Score still 97/A because other tests pass well.

**Root-cause:** Spec set `targetLength: "short"` and `locationPreset: "CountryHouse"`. A country house setting with a short target naturally yields 2 locations (house + grounds/external). The "minimum locations" test grades this down but passes the overall phase.

---

### [S3 Low] Cast — role diversity 60 (3 archetypes for 5 characters)

**Evidence:** Cast scorer: `Role diversity: 60 — only 3 archetypes for 5 characters` (weight 1, score 60, completeness). Cast phase still 98/A.

**Root-cause:** With 5 characters and a behavioral axis, the LLM reused archetypes across suspects. The cast scorer expects at least 4 distinct archetypes for a 5-character cast.

---

## P1 retrospective — first run with all fixes active

| Fix | Active? | Did it help? |
|---|---|---|
| P1-A: `actNumber` → `act` (clue injection field fix) | ✅ Yes | Yes — field resolution now correct; clue injection loop executes. But zero scenes had clue anchors for the critical clue. |
| P1-B: Clue descriptions injected into prose prompt | ✅ Yes | Partial — descriptions are injected for the 4-5 clue-bearing scenes. No anchor = no injection for the critical clue. |
| P1-C: Pacing gate (≥60% clue-bearing scenes) | ✅ Yes | Gate fired and retried. But the retry did not improve pacing (LLM ignored count constraint). Root failure still upstream. |
| P1-D: Dead `selectSensoryPaletteForChapter` removed | ✅ Yes | No measurable impact this run. |
| P1-E: Sensory variant loop field names fixed | ✅ Yes | Sensory cycling now active. Quality 74% avg (no regression). |
| P1-F: `cluesRevealedToReader` wired in `onBatchComplete` | ✅ Yes | Anti-re-revelation guard now active. No measurable impact since clue visibility still 0. |

**Conclusion:** P1 fixes are correctly active and structurally sound. The remaining failure lives above the prose layer — the narrative outline does not distribute clues to enough scenes for any downstream injection to reach them. The pacing gate retry is not effective because the LLM ignores the explicit count constraint.

---

## Remediation plan

### P2-A — Fix pacing gate minClueScenes threshold (Bug B5)
- **File:** `apps/worker/src/jobs/mystery-orchestrator.ts`
- **Bug:** `minClueScenes` is derived from the original outline's scene count. When the pacing retry returns a different count (18 → e.g., 16 or 20), the success comparison threshold is wrong.
- **Fix:** Re-derive `retriedMinClueScenes = Math.ceil(retriedOutlineScenes.length * 0.6)` and use it for the retry comparison instead of `minClueScenes`.
- **Status:** `DONE` — fixed in this session.
- **Acceptance criteria:** Threshold always matches the retry outline's actual scene count.

### P2-B — Quality tab reactivity (Issue 4)
- **File:** `apps/web/src/App.vue`
- **Gap:** `scoringReport` is only refreshed via `pollScoringReport` (called once at `idle`) and `watch(activeAdvancedTab)`. The History tab uses a 3s poll cycle; the Quality tab did not.
- **Fix:** Add `void loadScoringReport()` inside `loadRunEventsForProject()` so the quality report is fetched on the same 3s interval as run events. During the run it silently 404s; once the report is written, the next cycle picks it up.
- **Status:** `DONE` — fixed in this session.
- **Acceptance criteria:** Quality tab populates without requiring a tab switch after run completion.

### P2-C — Pacing gate: enforce clue count with pre-assignment pass (NEW · priority HIGH)
- **File:** `apps/worker/src/jobs/mystery-orchestrator.ts` + `apps/worker/src/jobs/agent7-narrative.ts`
- **Problem:** Even with the reinforced guardrail, the LLM consistently produces only 4-5 clue-bearing scenes out of 18 (22–28% coverage). A retry with a count constraint is not enough — the LLM cannot reliably distribute IDs across specific scenes without structure.
- **Proposed fix:** After the outline is generated, if pacing fails, use a deterministic pre-assignment pass: distribute clue IDs across scenes mathematically (e.g., spread evenly across acts) rather than relying on LLM output to fill `cluesRevealed` arrays. Optionally follow with a single LLM "integration pass" to incorporate the assigned clue IDs into the scene narrative summaries.
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** ≥60% of scenes have ≥1 clue anchor before prose begins; test always passes the pacing gate.

### P2-D — Add month/season guardrail in prose prompt (NEW · priority HIGH)
- **File:** `packages/prompts-llm/src/agent9-prose.ts`
- **Problem:** The temporal context specifies "February 1943" but prose chapter 5 wrote "autumn." The prose agent has the temporal context in its NSD block, but no explicit season-from-month constraint appears in the system prompt.
- **Proposed fix:** Derive the season from the month in the temporal context (or from the setting data), and inject a hard constraint: `"The story is set in [month] — the season is [season]. Never write seasonal descriptors inconsistent with [month] (e.g., no 'autumn leaves' in February, no 'summer heat' in December)."` into the system prompt.
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** Prose validator's month/season contradiction check passes; no release gate season contradiction.

### P2-E — Prevent templated prose leakage in repair retry (NEW · priority MEDIUM)
- **File:** `apps/worker/src/jobs/mystery-orchestrator.ts` (prose repair retry path)
- **Problem:** The full repair retry regenerated 18 chapters and produced 2 "duplicate long blocks." The high-temperature constraint / repetitive guardrail structure may cause the LLM to reuse boilerplate opening/closing patterns.
- **Proposed fix:** (1) Investigate what the duplicate blocks are — add a debug log of the matched duplicate text to the validation output. (2) Add a prose guardrail for the repair retry: "Each chapter must open and close with different phrasing — never reuse sentences, transitions, or descriptive blocks from other chapters."
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** Release gate prose leakage check passes; no duplicate long block alerts.

### P2-F — Show repair retry chapter scores in Quality tab (Issue 5 · priority LOW)
- **File:** `apps/worker/src/jobs/mystery-orchestrator.ts` (prose repair scoring); `apps/web/src/App.vue` + `apps/web/src/components/` (Quality tab render)
- **Problem:** When prose runs twice (first pass + repair retry), the Quality tab only shows one set of chapter quality scores. The repair retry's per-chapter scores are not captured or displayed.
- **Proposed fix:** Tag the repair retry's scoring results as a separate data set (e.g., `proseRepairChapterScores`) in the GenerationReport, and render a second "Chapter Quality Scores (Repair Run)" card in the Quality tab.
- **Status:** `NOT-STARTED`
- **Acceptance criteria:** Quality tab shows both first-pass and repair-pass chapter scores when a prose repair retry occurred.

---

## What worked well

- **CML pipeline near-perfect:** Every pre-prose phase 91–100/A. All 8 structured fixed-logic checks pass.
- **Pacing gate (P1-C) fired correctly:** The gate detected the pacing failure and retried. The infrastructure is correct — the LLM's response to the constraint is the remaining gap.
- **Clue injection (P1-B) active:** `buildClueDescriptionBlock` correctly resolves scene clue IDs to descriptions and injects them into the prose prompt for scenes that have anchors.
- **Prose quality strong:** Prose quality 74% average, readability 93%, 5/5 characters referenced, 2/2 locations referenced. No encoding artifacts in the base generation.
- **Sensory cycling (P1-E) now active:** Consecutive chapters at the same location are now cycling palette variants instead of always using variant[0].
- **Anti-re-revelation guard (P1-F) now active:** `cluesRevealedToReader` is populated after each batch for all subsequent chapter generations.
- **Release gate caught new failures correctly:** The hard-stop for prose leakage and season contradictions is working as designed.

---

## Validation and verification
- **Required next step:** Implement P2-C (deterministic clue pre-assignment) before re-running — without it, pacing will continue to fail and downstream clue visibility will remain 0.
- **Required next step:** Implement P2-D (month/season guardrail) before re-running — the season contradiction is a release gate hard-stop.
- **Required full-run check:** 1 run after P2-C + P2-D to confirm outline clue pacing ≥60%, clue visibility ≥1/1, and no season/leakage failures.
- **Gate outcome:** FAIL — quality gate (clue visibility 0/1) + release gate hard-stop (prose leakage + season). Story not persisted.

---

## Definition of done

- [x] P2-A: Pacing gate threshold fixed to use retry outline's scene count (B5)
- [x] P2-B: Quality tab uses same 3s refresh cycle as History tab
- [ ] P2-C: Deterministic clue pre-assignment pass — pacing gate always passes
- [ ] P2-D: Month/season guardrail in prose prompt — no season contradictions
- [ ] P2-E: Prose repair retry leakage prevention
- [ ] P2-F: Repair retry chapter scores shown in Quality tab
- [ ] Prose clue visibility: 1/1 clues (100%)
- [ ] Prose fair-play compliance ≥ 70/100
- [ ] Narrative outline clue pacing ≥ 60% of scenes (enforced by gate)
- [ ] No release gate hard-stop (leakage, season contradiction)
- [ ] Prose gate passed (overall prose score ≥ 90 / grade A)
- [ ] Regression tests for pacing gate + month/season + prose leakage

---

## Status update
- Prose + release gate failure confirmed: `DONE`
- Story file not persisted: `DONE` (no artifact written)
- P2-A (pacing gate threshold): `DONE` — fixed in this session
- P2-B (Quality tab reactivity): `DONE` — fixed in this session
- Re-run verification: `BLOCKED` — P2-C and P2-D required before next run

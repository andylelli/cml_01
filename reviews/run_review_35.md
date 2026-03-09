# Run Review: Golden Age Prototype 35

**Run ID:** run_2c17609e-fd30-45f5-9e34-1430bf9baa0c  
**Date:** 2026-03-08  
**Project:** Golden Age Prototype 35 (`proj_a9702c02-8b60-443b-b94b-d24f0e918eb5`)  
**Story title:** Unknown (artifact not persisted — release gate hard-stop)  
**Setting:** 1940s Country House, April 1947 · amateur detective · short · behavioral  
**Story file:** not persisted (run aborted at release gate)  
**Quality report:** validation/quality-report-run_2c17609e-fd30-45f5-9e34-1430bf9baa0c.json  
**Reviewer:** Copilot session review  
**Overall assessment:** `FAIL` — quality gate blocked by prose completeness (clue visibility 0/3 critical); aborted at release gate hard-stop for suspect elimination coverage incomplete

**Cast:** Gweniver Tresidder, Karen Petherick, Norman Nicholls, Paul Gluyas, Sandra Gendall  
(5 characters · 3 eligible suspects · 3 archetypes)  
**Run duration:** 662 s (~11 min) · **Cost:** $0.1829

**Significance:** Second run with P1-A through P1-F and P2-A/P2-B active. P2-F (repair chapter scores) also active for the first time. Three full prose passes ran: initial (16 ch), identity-fix regeneration (16 ch), and repair retry (16 ch). Season contradiction repeat from run_34 emerged again (P2-D still not implemented). New release gate failure: suspect elimination coverage incomplete. Pacing gate fired correctly with B5 fix (6/16 → ≥10 required) but clue visibility remains 0/3 — P2-C (deterministic clue pre-assignment) is the blocking fix.

---

## Phase scores summary

| Phase | Agent | Score | Grade | Passed | Duration | Cost |
|---|---|---|---|---|---|---|
| Setting Refinement | agent1_setting | 100 | A | ✅ | 8,221ms | $0.000513 |
| Cast Design | agent2_cast | 98 | A | ✅ | 13,276ms | $0 |
| Background Context | agent2e_background_context | 98 | A | ✅ | 2,120ms | $0.000184 |
| Hard Logic Devices | agent3b_hard_logic_devices | 100 | A | ✅ | 10,866ms | $0.000888 |
| CML Generation | agent3_cml | 100 | A | ✅ | 22,840ms | $0.002378 |
| Novelty Audit | agent8_novelty | 100 | A | ✅ (skipped) | 0ms | $0 |
| Clue Distribution | agent5_clues | 100 | A | ✅ | 18,632ms | $0.002257 |
| Fair-play Audit (CML) | agent6_fairplay | 100 | A | ✅ | 5,079ms | $0.000624 |
| Narrative Outline | agent7_narrative | 97 | A | ✅ | 34,793ms | $0.002453 |
| Character Profiles | agent2b_profiles | 100 | A | ✅ | 30,462ms | $0.002259 |
| Location Profiles | agent2c_location_profiles | 97 | A | ✅ | 29,414ms | $0.001953 |
| Temporal Context | agent2d_temporal_context | 95 | A | ✅ | 16,349ms | $0.001258 |
| **Prose Generation** | **agent9_prose** | **83** | **B** | **❌ FAIL** | 410,689ms | $0.168119 |

**Prose sub-scores:** validation 93 / quality 100 / completeness **36** / consistency 88  
**Failure reason:** 1 critical failure — clue visibility 0/3 (completeness component below minimum).  
**Prose word count:** 10,811 words across 16 chapters (short target; expected 20 chapters / ~24,000 words).  
**Chapter quality:** pass 1 first-pass scores range 55–77 (weakest ch.3=55, ch.11=64, ch.15=63); repair pass scores range 45–77 (ch.16=45 notably weak).  
**Cost note:** Prose phase consumed $0.168 / 91.9% of total cost due to three full prose passes.

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
| clues | **8 clues distributed** → coverage gaps → regenerated |
| fairplay | Fair play audit: pass; blind reader simulation: PASS |
| narrative | **20 scenes structured (24,000 words)** → pre-prose coverage gate retry → 16-scene outline |
| narrative | **Pacing gate (B5 fix active): 6/16 scenes have clues (≥10 required)** → retry fired |
| profiles | Character profiles generated (5) |
| location-profiles | Location profiles generated (2 locations) |
| temporal-context | Temporal context generated (April 1947) |
| prose (pass 1) | Chapters 1–16 · ch.2 retry (april vs autumn) · ch.9 retry (may vs autumn) · ch.15 retry (2 paragraphs + overlong block) |
| prose | **Identity drift detected — "Regenerating all prose due to identity drift..."** |
| prose (pass 2: identity fix) | All 16 chapters regenerated [Identity fix] · ch.15 retry |
| validation | **Story validation failed; attempting prose repair retry** |
| prose (pass 3: repair) | All 16 chapters regenerated [Repair] · ch.2 retry |
| validation | Prose repair: validation still needs_revision |
| validation | **Release gate hard-stop: suspect elimination coverage incomplete** |
| pipeline_error / abort | Run aborted |

---

## Observed defects

### [S0 Critical] Zero clue visibility — 0/3 CML clues surfaced in prose

**Evidence:** Prose scorer: `Clue visibility: 0 — Only 0/3 clues` (score 0, weight 1.5, severity critical). This run required 3 clues visible vs 1 in run_34; the failure is worse in absolute terms.

**Root-cause chain (same as run_34, compounded):**
1. The pre-prose outline coverage gate retry reduced the outline from 20 → 16 scenes.
2. The pacing gate (P1-C, B5 fix active) measured 6/16 scenes with clue anchors — correctly applying ≥10 threshold (= ceil(16 × 0.6)). Retried with reinforced constraint but result still insufficient: the final outline used for prose had too few clue-bearing scenes.
3. With only ~6 scenes carrying `cluesRevealed` arrays, `buildClueDescriptionBlock` (P1-B) injected descriptions only into those low-clue chapters. The 3 inference-critical clues had no scene anchors, so the prose agent never received explicit instructions to surface them.
4. Three full prose passes (pass 1 → identity fix → repair) all produced 0/3 clue visibility. The root failure is at the outline level, not in the prose agent, confirming that P2-C is the required fix.

**P1/P2-A status:** All P1 fixes and P2-A (threshold correction) are active. The pacing gate's retry mechanism is structurally correct but ineffective — the LLM consistently under-distributes clues in `cluesRevealed` arrays regardless of the explicit count constraint.

---

### [S0 Critical] Release gate hard-stop — suspect elimination coverage incomplete

**Evidence:** `Release gate hard-stop: suspect elimination coverage incomplete`. Validation status after repair: `needs_revision`. Pre-release warning also noted: `critical continuity issue detected`.

**Root-cause:** The story validation pipeline checks that every non-culprit suspect is explicitly cleared with evidence or confirmed alibi in the prose. With only 10,811 words across 16 chapters and 0/3 clue visibility, the prose agent wrote a structurally incomplete story where Act III suspect-clearing scenes are absent or under-developed. The repair retry `guardrail` includes a suspect-elimination requirement but failed to resolve it.

**Impact:** Pipeline aborted before any auto-fix or story file write. This is the same class of failure as the "culprit evidence chain" and "discriminating test" failures in earlier runs, just targeted at a different structural requirement.

---

### [S1 High] Month/season contradictions in prose — P2-D not yet implemented

**Evidence:** 
- Ch. 2: `Chapter 2 has month/season contradiction (april vs autumn)` — required retry (succeeded)
- Ch. 9: `Chapter 9 has month/season contradiction (may vs autumn)` — required retry (succeeded)

**Root-cause:** The temporal context specified "April 1947" but the prose agent wrote "autumn" in chapters 2 and 9. P2-D (month/season guardrail in the prose system prompt) was identified in run_34 as required but has not been implemented. The per-chapter validation retries caught these before they reached the release gate, but:
- They add latency (extra LLM calls per affected chapter).
- The same pattern across both pass 1 and repair pass (ch.2 in repair also retried) suggests the root issue persists in all three prose passes.
- The release gate's month/season check (which caused a hard-stop in run_34) did not fire this time — possibly because the retries corrected the chapter text. However the phrasing `critical continuity issue detected` in the warnings may be related to residual season language after chapter-level corrections.

---

### [S1 High] Identity drift — full prose regeneration triggered

**Evidence:** `prose: Regenerating all prose due to identity drift...` — entire 16-chapter prose pass abandoned and restarted.

**Root-cause:** The identity continuity check in the orchestrator (post-pass-1) detected systematic role-alias drift — a character was referred to by a generic role label ("the detective", "the victim") instead of their canonical name across multiple chapters. This triggers a full prose regeneration with identity guardrails. The corrected identity-fix pass completed successfully (ch.15 needed one retry) but then immediately failed story validation, triggering the repair retry.

**Impact on cost:** With three full prose passes, prose cost $0.168 — 91.9% of the $0.1829 total. The identity fix pass alone added ~132 chapters' worth of LLM calls. This is expected behaviour (the identity guard is working correctly), but the root issue (LLM drifting to role labels) may be addressable by strengthening the character name anchoring in the prose system prompt.

---

### [S2 Medium] Narrative outline — 16 chapters (expected 20); pacing gate fired

**Evidence:** Narrative scorer: `Chapter count: 80 — 16 chapters (expected 20)` (weight 2, score 80, major). Quality scorer also confirms 16/20 chapters in prose.

**Root-cause:** The pre-prose outline coverage gate retry (evaluating CML coverage gaps) returned a 16-scene outline instead of the expected 20. From that revised 16-scene outline, the pacing gate correctly measured 6/16 clue-bearing scenes and triggered a retry with a hard count constraint. The reduced scene count contributes directly to the low word count (10,811 vs ~24,000 target) and missing chapters in prose.

**Note — B5 fix confirmed working:** The pacing gate threshold is now correctly `ceil(16 × 0.6) = 10` rather than `ceil(20 × 0.6) = 12`. The gate retried with the correct threshold for the actual 16-scene outline.

---

### [S3 Low] Prose chapter quality — variable; ch.3 (55), ch.11 (64), ch.15/16 (63/66); repair ch.16 collapses to 45

**Evidence (from chapter score breakdown):**
- Pass 1: ch.3=55, ch.9=65, ch.11=64, ch.15=63, ch.16=66 (all below 70)
- Repair pass: ch.3=55, ch.8=61, ch.13=57, ch.16=45 (repair degraded ch.16 significantly)

**Root-cause:** Low individual chapter scores are consistent with the clue injection gap — chapters with no clue anchors produce lower-quality, atmospherically vague content. Chapter 16 in the repair pass (45/100) is particularly weak; the final chapter under repair guardrails may have been forced to address too many structural requirements simultaneously (suspect elimination, culprit reveal, clue surface).

---

### [S3 Low] Temporal context — 2/4 fields detailed (same as run_34)

**Evidence:** Temporal Context scorer: `Substantial content: 50 — 2/4 fields detailed` (weight 1.5, score 50). Still an A at 95.

**Root-cause:** Agent2d prompt does not strongly require substance in all four optional temporal context fields. Recurring issue across runs 33-35.

---

### [S3 Low] Cast — role diversity 60 (3 archetypes for 5 characters); same as run_34

**Evidence:** Cast scorer: `Role diversity: 60 — only 3 archetypes for 5 characters` (weight 1, score 60). Cast still 98/A.

**Root-cause:** Recurring with 5-character/behavioral-axis/short spec combination. LLM reuses archetypes at this cast size.

---

### [S3 Low] Background context — constraints completeness 50%

**Evidence:** Background context scorer: `Constraints defined: 50 — Constraints completeness: 50%` (score 50, weight not blocking). Phase still 98/A.

**Root-cause:** Agent2e generated constraints at 50% completeness. Not affecting prose quality measurably at this stage; flagged for awareness.

---

## P1 / P2 retrospective — third run with P1 fixes; second run with P2-A/B

| Fix | Active? | Run 35 outcome |
|---|---|---|
| P1-A: `actNumber` → `act` clue injection | ✅ | Active — clue injection loop fires for clue-bearing scenes. Root failure upstream. |
| P1-B: Clue descriptions in prose prompt | ✅ | Active — injecting for the 6 clue-bearing scenes. 3 critical clues not in those scenes. |
| P1-C: Pacing gate ≥60% | ✅ | Gate fired correctly: 6/16 scenes, retry triggered. LLM ignored count constraint. |
| P1-D: Dead function removed | ✅ | No impact. |
| P1-E: Sensory variant field names fixed | ✅ | Sensory cycling active. |
| P1-F: `cluesRevealedToReader` wired | ✅ | Anti-re-revelation guard active. |
| P2-A: Pacing gate B5 threshold fix | ✅ | Threshold correctly `ceil(16×0.6)=10` for 16-scene retry outline. |
| P2-B: Quality tab 3s refresh | ✅ | No regression. |
| P2-C: Deterministic clue pre-assignment | ❌ NOT-STARTED | **Blocking** — prose still 0/3 clues; pacing gate retry ineffective. |
| P2-D: Month/season prose guardrail | ❌ NOT-STARTED | Season contradictions in ch.2 and ch.9 again; chapter-level retries mitiate but root issue remains. |
| P2-E: Prose leakage prevention | ❌ NOT-STARTED | Release gate leakage check not triggered this run. |
| P2-F: Repair chapter scores in Quality tab | ✅ NEW | `repair_chapter_scores` present in quality report; UI renders repair pass. Confirmed working. |

**Conclusion:** Three consecutive gate failures (run_33, run_34, run_35) at the clue visibility test. P1-B and P1-C changes are structurally sound but cannot compensate for the upstream outline distribution problem. P2-C is the highest priority blocking fix. P2-D (season guardrails) is the second priority to eliminate the ch.2/ch.9 season retry overhead.

---

## New issues identified this run

### B6 — Identity drift / full prose regeneration adds significant cost

The identity continuity check is working correctly by design. However when identity drift is detected, a full prose regeneration (16 chapters = $0.06 estimated) is triggered before story validation. This is the third prose pass this run. A lighter-weight option would be to re-generate only the drifted chapters (targeted identity fix) rather than all chapters.

**Severity:** Medium — working as designed but expensive. Document as candidate for future optimisation.

### B7 — Suspect elimination coverage not included in prose repair guardrails

The repair retry path builds guardrails from validation error types (`missing_discriminating_test`, `suspect_closure_missing`, `culprit_evidence_chain_missing`). The `suspect_elimination_coverage_incomplete` error type (which caused the release gate abort) maps to `suspect_closure_missing` — but the validation pipeline may use a different error key at the release gate layer vs the story validation layer. If the repair guardrail set misses this error type, the repair pass cannot target the structural gap.

**Fix needed:** Audit the validation error type produced by `suspect elimination coverage incomplete` at the release gate. Confirm it maps to a guardrail rule in the repair path, or add a matching rule.

---

## Remediation plan

### P2-C — Deterministic clue pre-assignment (BLOCKING · highest priority)
- **Status:** `NOT-STARTED`
- See run_review_34.md §Remediation for full description.
- **Run_35 evidence:** Three prose passes, all producing 0/3 clue visibility. The retry constraint on `formatNarrative` is definitively insufficient. Deterministic pre-assignment of clue IDs to scenes is required before this changes.

### P2-D — Month/season guardrail in prose prompt (HIGH priority)
- **Status:** `NOT-STARTED`
- See run_review_34.md §Remediation for full description.
- **Run_35 evidence:** ch.2 (april vs autumn) and ch.9 (may vs autumn) — same failure pattern as run_34, now across two chapters per run. Each triggers an extra chapter-level LLM call. P2-D must be implemented before the next run.

### P2-E — Prose leakage prevention in repair retry
- **Status:** `NOT-STARTED`
- Not triggered this run.

### P2-F — Repair chapter scores in Quality tab
- **Status:** `DONE` (implemented this session, confirmed working)
- `repair_chapter_scores` array present in quality report for this run. Quality tab renders second table.

### P3-A — Suspect elimination guardrail alignment (NEW · B7)
- **File:** `apps/worker/src/jobs/mystery-orchestrator.ts` (prose repair retry path)
- **Problem:** The release gate aborts on `suspect elimination coverage incomplete` but the repair retry may not include a targeted guardrail for this error type if the validation error key differs from `suspect_closure_missing`.
- **Fix:** Audit error type mapping; add `suspect_elimination` case to the repair guardrail switch in the repair retry block.
- **Status:** `NOT-STARTED`

### P3-B — Targeted identity fix (chapter-level, not full regeneration) (NEW · B6)
- **File:** `apps/worker/src/jobs/mystery-orchestrator.ts` (identity drift detection path)
- **Problem:** When identity drift is detected, all 16 chapters are regenerated. A targeted fix regenerating only the drifted chapters (identified by the identity continuity checker) would cut the extra prose pass cost by ~80%.
- **Status:** `NOT-STARTED` (future optimisation; working correctly, just expensive)

---

## What worked well

- **CML pipeline near-perfect:** Every pre-prose phase 95–100/A.
- **Pacing gate B5 fix confirmed:** Correctly computed `ceil(16×0.6)=10` for the 16-scene retry outline. The gate fires and retries with the right threshold.
- **Identity continuity guard working:** Correctly detected role-alias drift and triggered regeneration, producing validated chapter text.
- **P2-F: Repair chapter scores captured and displayed:** Both the identity-fix pass and the repair pass have chapter score breakdowns available in the quality report. The Quality tab will now show both passes when they run.
- **Release gate catches new failures correctly:** `suspect elimination coverage incomplete` and `critical continuity issue detected` both caught before any story file emit.
- **All chapter-level validation retries succeeded:** Season contradictions in ch.2 and ch.9 (and later in the repair ch.2) all resolved by chapter retry — the per-chapter validation safety net is working.

---

## Validation and verification
- **Required before next run:** P2-C (deterministic clue pre-assignment) — without this, the 4th run will also produce 0/N clue visibility.
- **Required before next run:** P2-D (month/season guardrail in prose system prompt) — will prevent the per-chapter season retries and eliminate the risk of residual season language reaching the release gate.
- **Recommended before next run:** P3-A (suspect elimination guardrail alignment) — to prevent the repair retry from failing the same release gate check.
- **Gate outcome:** FAIL — quality gate (clue visibility 0/3) + release gate hard-stop (suspect elimination coverage). Story not persisted.

---

## Definition of done

- [x] P2-A: Pacing gate threshold uses retry outline's actual scene count (B5)
- [x] P2-B: Quality tab uses same 3s refresh as History tab
- [x] P2-F: Repair retry chapter scores captured and shown in Quality tab
- [ ] P2-C: Deterministic clue pre-assignment — pacing gate always passes; clue visibility ≥ N/N
- [ ] P2-D: Month/season guardrail in prose prompt — no season contradictions
- [ ] P2-E: Prose repair retry leakage prevention
- [ ] P3-A: Suspect elimination guardrail alignment in repair retry
- [ ] P3-B: Targeted identity fix (chapter-level, not full regen) — cost optimisation
- [ ] Prose clue visibility: N/N clues (100%)
- [ ] Prose fair-play compliance ≥ 70/100
- [ ] No identity drift triggering full regeneration
- [ ] No release gate hard-stop (suspect elimination, season, leakage)
- [ ] Prose gate passed (overall prose score ≥ 90 / grade A)
- [ ] Regression tests for pacing gate + month/season + suspect elimination guardrail

---

## Status update
- Prose + release gate failure confirmed: `DONE`
- Story file not persisted: `DONE` (pipeline aborted before any file write)
- P2-C (deterministic clue pre-assignment): `BLOCKED — NOT-STARTED` (highest priority)
- P2-D (month/season guardrail): `NOT-STARTED` (must implement before next run)
- P3-A (suspect elimination guardrail): `NOT-STARTED`
- Re-run verification: `BLOCKED` — P2-C and P2-D required before next run

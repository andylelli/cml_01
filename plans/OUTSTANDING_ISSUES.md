# Outstanding Issues — Persisting Failures

**Compiled:** 2026-03-11  
**Updated:** Phase C audit (post run_36)  
**Runs covered:** project_20 → run_36 (run_9b2fcacd)  
**Source of truth:** reviews/cross_run_report.md, run_review_33.md through run_review_36.md, SCORING_FIX_PHASES.md, PROSE_QUALITY_100_MASTER_PLAN.txt

Every issue in this document was unresolved as of the most recent run (run_36). Phase C audit confirmed the majority are now implemented in code (see status fields below). Only ISSUE-2 (report state contradiction) requires empirical verification in the next run.

---

## Severity key

| Code | Meaning |
|---|---|
| **S0** | Gate-blocking critical failure — run cannot release |
| **S1** | High — major quality degradation, reader-trust failure |
| **S2** | Medium — noticeable defect, story still usable |
| **S3** | Low — polish / scoring shortfall, does not block gate |

---

## S0 Critical — Gate blockers (run cannot release)

---

### ISSUE-1 · Clue visibility zero in every run — 0/N clues surfaced in prose

**Runs affected:** run_33 · run_34 · run_35 · run_36 (four consecutive)  
**Planned fix code:** P2-C  
**Status:** ✅ IMPLEMENTED (Phase C)  
**Fix owner area:** `apps/worker/src/jobs/agents/agent7-run.ts`

**Pattern:**

| Run | Required | Surfaced | Prose gate |
|---|---|---|---|
| run_33 | 1 | 0 | ❌ FAIL |
| run_34 | 1 | 0 | ❌ FAIL |
| run_35 | 3 | 0 | ❌ FAIL |
| run_36 | 3 | 0 | ❌ FAIL |

**Root cause (confirmed):**

The narrative outline consistently places explicit clue anchors (`cluesRevealed[]`) in only 25–38% of scenes (5/20, 4/18, 6/16). The pacing gate (P1-C) detects this and retries `formatNarrative`, but the LLM ignores the count constraint in every single retry. With no scene anchor, `buildClueDescriptionBlock` (P1-B) cannot inject a clue description; the prose agent receives no instruction for that clue and never surfaces it. Running the prose pass multiple times (identity-fix regeneration + repair retry) does not help because the failure is upstream in the outline, not in the prose agent.

**What has been tried and confirmed working — but insufficient:**
- P1-A: `scene.actNumber → scene.act` field name bug corrected ✅
- P1-B: clue descriptions wired into prose system prompt ✅ (only helps chapters that already have outline anchors)
- P1-C: pacing gate + LLM retry ✅ (gate fires correctly; LLM retry never succeeds)
- P2-A: retry threshold arithmetic corrected ✅

**What was implemented:** `applyDeterministicCluePreAssignment` in `agent7-run.ts` — algorithmically assigns clue IDs to scene slots using `ClueDistributionResult` placement bands (early/mid/late). Called first on the current outline; if pacing still fails, called again on the LLM retry result. Scene-count lock enforced via `checkNarrativeSceneCountFloor` on every retry.

---

### ISSUE-2 · Report state contradiction — high score + `passed: false` + `aborted: true` simultaneously

**Runs affected:** run_36  
**Planned fix code:** P0 (immediate containment)  
**Status:** IMPLEMENTED in worker — NOT VERIFIED in a subsequent run  
**Fix owner area:** `apps/worker` + `packages/story-validation` report assembly path

**Pattern:** run_36 produced `overall_score: 97.77, overall_grade: "A"` while simultaneously showing `passed: false` and `aborted: true`. The score summary and terminal outcome are emitted from non-unified state paths.

**Secondary contradiction:** `abort_reason` cited Chapter 1 + template-linter entropy failure, but diagnostics showed `template_linter_failed_checks: 0`, and `batch_failure_history` only contained Chapter 3. The abort-reason text originates from a stale or earlier exception path while report diagnostics reflect the finalized pass.

**Required action:** Verify the P0 fix holds in the next run. The unified state path must be confirmed empirically before closing.

---

### ISSUE-3 · Suspect elimination coverage — release gate hard-stop

**Runs affected:** run_35  
**Planned fix code:** P3-A  
**Status:** ✅ IMPLEMENTED (Phase C)  
**Fix owner area:** `apps/worker/src/jobs/agents/agent9-run.ts` prose repair retry guardrails

**Pattern:** Release gate hard-stopped with `suspect_elimination_coverage_incomplete`. The repair retry's guardrail case map does not include the `suspect_elimination_coverage_incomplete` error type, so the retry does not know to inject a suspect-clearing guardrail.

**Compounding factor:** With only 16 chapters instead of 20 (Issue 5) and 0/3 clue visibility (Issue 1), Act III is structurally compressed and the space for suspect-clearing scenes collapses.

**Resolution:** `SUSPECT_CLOSURE_ALIAS_KEYS` in `agent9-run.ts` includes `suspect_elimination_coverage_incomplete` and `suspect_elimination_missing`. `isSuspectClosureCoverageError()` matches these and triggers the explicit suspect-clearing guardrail in the repair retry set.

---

### ISSUE-4 · Template/scaffold leakage in repair retry

**Runs affected:** project_20 · proj_7aa0771d · run_30 · run_34  
**Planned fix code:** P2-E  
**Status:** ✅ IMPLEMENTED (Phase C)  
**Fix owner area:** `apps/worker/src/jobs/agents/agent9-run.ts` prose repair retry guardrails

**Pattern:** The repair retry regenerates all chapters under a constrained guardrail prompt. Without a cross-chapter "already used" state, the LLM repeats structural opening/closing blocks across chapters. run_34 produced "2 duplicate long blocks" at the release gate level; earlier runs produced near-verbatim scaffold boilerplate across 4+ chapters.

**What was fixed:** `stripLocationParagraphs` / context hygiene (Sprint 2) eliminated raw template injection. No regression in runs 33–36.

**What persists:** Structural block duplication across chapters during repair retry — no diversity constraint is injected and no cross-chapter block cache is maintained.

**Resolution:** `repairGuardrailSet` in `agent9-run.ts` now includes: "Each chapter must open and close with distinct phrasing — never reuse sentences, transitions, or descriptive blocks from another chapter in this run." Template linter is also set to `mode: "repair"` during the repair prose pass, enforcing paragraph fingerprint checks.

---

## S1 High — Major quality failures

---

### ISSUE-5 · Month/season contradiction repeats across runs

**Runs affected:** project_20 · run_34 · run_35 (near-miss); run_34 caused a release gate hard-stop  
**Planned fix code:** P2-D  
**Status:** ✅ IMPLEMENTED (Phase C)  
**Fix owner area:** `packages/prompts-llm/src/agent9-prose.ts` prose system prompt builder

**Pattern:**

| Run | Month | Season written by LLM | Gate impact |
|---|---|---|---|
| project_20 | May | "english autumn" | Flagged |
| run_34 | February | "autumn" (Ch.5) | Release gate hard-stop |
| run_35 | April | "autumn" (Ch.2, Ch.9) | Chapter retries; near-miss |

**Root cause:** The temporal context agent correctly outputs the story month. The prose system prompt exposes that month in the NSD block. But no explicit season is derived and injected as a hard constraint. The LLM defaults to "autumn" because it is the genre default for Golden Age country-house mysteries.

**Resolution:** `deriveTemporalSeasonLock()` in `agent9-prose.ts` derives season from month using the mapping above. The temporal context block injected into every chapter's system prompt includes: season lock (hard), a list of forbidden seasons, and the explicit sentence: "This timeline is anchored to [MONTH] ([SEASON]). Avoid incompatible seasonal labels ([forbidden]) in the same chapter."

---

### ISSUE-6 · Narrative outline scene count shrinks on every quality-gate retry

**Runs affected:** run_33 · run_34 · run_35  
**Status:** ✅ IMPLEMENTED (Phase C)  
**Fix owner area:** `apps/worker/src/jobs/agents/agent7-run.ts`

**Pattern:**

| Run | Target | Final generated | Reduction |
|---|---|---|---|
| run_33 | 20 | 20 | 0 |
| run_34 | 20 | 18 | −2 |
| run_35 | 20 | 16 | −4 |

**Root cause:** The pre-prose quality gate re-runs `formatNarrative` to fix CML coverage gaps. Each retry may return fewer scenes. The pacing gate also re-runs `formatNarrative` and may further reduce the count. No `targetScenes` constraint is passed in retry prompts; no scene-count floor is enforced on the retry result.

**Impact:** Fewer scenes = fewer clue anchor slots = harder for the pacing gate to succeed = further chapter shortfall in prose. Run_35's 16-chapter prose (vs 20-scene outline target) was directly caused by this.

**Resolution:** `captureNarrativeSceneCountSnapshot()` captures per-act scene counts before any retry. `buildNarrativeSceneCountGuardrails()` injects explicit per-act count constraints into the retry prompt. `checkNarrativeSceneCountFloor()` validates the retry result; if scene counts changed, the retry is rejected and the original outline (with deterministic clue assignments already applied) is kept.

---

### ISSUE-7 · Character identity and role drift — triggers full prose regeneration

**Runs affected:** project_20 · proj_60cfc60c · run_30 · run_35  
**Planned fix codes:** P3-B (targeted regeneration), root prompt strengthening  
**Status:** ✅ IMPLEMENTED (Phase C)  
**Fix owner area:** `apps/worker/src/jobs/agents/agent9-run.ts`

**Pattern:**

| Run | Form | Cost |
|---|---|---|
| project_20 | Investigator role drift (amateur ↔ authority) | Coherence degraded |
| proj_60cfc60c | Role-token leakage: "an inspector", "a gentleman" | Immersion broken |
| run_30 | Pronoun instability across 3 characters | Consistency score 78.1 |
| run_35 | Role-alias drift: canonical names → generic roles | Full 16-chapter regeneration at $0.06 extra |

**Root cause:** The LLM defaults to generic role labels when under context pressure. The identity continuity checker correctly detects the drift and triggers a full prose regeneration — unnecessary for the non-drifted chapters.

**Fixes implemented:** Sprint 1 pronoun chain; `lockedFacts` / NSD identity anchors. These reduced frequency but did not eliminate the failure.

**Resolution (P3-B):** `detectIdentityAliasBreaks()` returns per-chapter drift issues. If drift affects ≤40% of chapters, only those chapters are regenerated via `buildNarrativeSubsetForChapterIndexes()` (targeted repair). Full regeneration is used only as fallback when the targeted repair chapter count or chapter mismatch warrants it.

---

### ISSUE-8 · Fair-play compliance borderline (downstream of Issue 1)

**Runs affected:** run_30 · run_33 · run_34  
**Status:** DEPENDENT on Issue 1 fix — no independent fix required  
**Fix owner area:** N/A until P2-C is implemented

**Pattern:** Prose fair-play compliance consistently scores 60/100. CML-level fair-play audit scores 100/A. The gap exists because clues are structurally present in the plan but not surfaced in prose: the detective infers from off-page evidence, which the scorer penalises as "fair-play violation."

**This issue will resolve itself once Issue 1 (P2-C) is implemented.** No independent fix is required.

---

## S2 Medium — Noticeable defects

---

### ISSUE-9 · NSD `cluesRevealedToReader` always empty — anti-re-revelation guard disabled

**Bug code:** B2  
**Runs affected:** All runs since NSD was introduced  
**Status:** ✅ IMPLEMENTED (Phase C)  
**Fix owner area:** `apps/worker/src/jobs/agents/agent9-run.ts` `onBatchComplete` handler

**Root cause:** `updateNSD` receives `ProseChapter` objects which carry no clue IDs. It spreads the existing (always-empty) `cluesRevealedToReader[]` unchanged.

**Resolution:** `onBatchComplete` now extracts `cluesRevealed[]` IDs from outline scenes whose `sceneNumber` falls within `batchStart..batchEnd`, then merges them into `narrativeState.cluesRevealedToReader` after calling `updateNSD`. `clueEvidenceAnchors` are collected via `collectClueEvidenceFromProse()` and attached to the NSD transfer trace entry. A warning is emitted when a newly-revealed clue has an empty evidence anchor list (ISSUE-11 partial).

---

### ISSUE-10 · Sensory variant field names wrong — palette selection always uses first variant

**Bug code:** B4  
**Runs affected:** All runs since sensory variants were introduced  
**Status:** ✅ IMPLEMENTED (Phase C)  
**Fix owner area:** `packages/prompts-llm/src/agent9-prose.ts` inline palette selection loop

**Resolution:** The inline palette loop correctly reads `sceneSettingObj.location`, `sceneSettingObj.timeOfDay`, and `sceneSettingObj.atmosphere` (where `sceneSettingObj = scene.setting`). Variant matching uses `v.timeOfDay` and `v.weather` for lookup, with a cycle-by-chapter-number fallback when no match is found.

---

### ISSUE-11 · NSD clue reveal trace lacks supporting evidence anchors

**Runs affected:** run_36  
**Status:** ✅ IMPLEMENTED (Phase C — partial)  
**Fix owner area:** `apps/worker/src/jobs/agents/agent9-run.ts` NSD reveal propagation

**Resolution:** `collectClueEvidenceFromProse()` is called on each batch and `clue_evidence_anchors` (per newly-revealed clue) are attached to the NSD trace entry. A `ctx.warnings` entry is emitted when any newly-revealed clue has an empty evidence anchor list. Full hard-failure when anchors are missing is not enforced (warning-only) to avoid blocking otherwise-clean runs.

---

## S3 Low — Scoring shortfalls (do not block gate)

---

### ISSUE-12 · Temporal context optional field completeness — persistent thin scoring

**Runs affected:** run_33 · run_34 · run_35 (all pass the gate at 91–95/A)  
**Status:** NOT FIXED (low priority — passes threshold)  
**Pattern:** `Substantial content: 50 — 2/4 fields detailed` in every run. Agent2d provides core fields but leaves optional richness fields thin.  
**Required action (low priority):** Strengthen agent2d prompt to substantiate optional temporal richness fields. Can be bundled with P2-D (month/season guardrail) since it targets the same agent.

---

### ISSUE-13 · Cast archetype diversity thin for 5-character casts

**Runs affected:** run_34 · run_35  
**Status:** NOT FIXED (low priority — cast phase passes at 98/A)  
**Pattern:** `Role diversity: 60 — only 3 archetypes for 5 characters` in both runs. The cast agent reuses archetypes when `behavioral` axis is used with a `short` target.  
**Required action (low priority):** Add to agent2_cast prompt: "For a cast of 5 or more, generate at least 4 distinct archetypes. Never reuse an archetype across two suspects."

---

## Ordered implementation priority

The following order is recommended to unblock consecutive runs as fast as possible:

| Priority | Issue | Code | Status |
|---|---|---|---|
| 1 | Deterministic clue pre-assignment | P2-C | ✅ Done |
| 2 | Month/season guardrail in prose prompt | P2-D | ✅ Done |
| 3 | Scene count floor on `formatNarrative` retries | — | ✅ Done |
| 4 | Suspect elimination guardrail alignment | P3-A | ✅ Done |
| 5 | Repair retry leakage prevention | P2-E | ✅ Done |
| 6 | NSD clue ID extraction in `onBatchComplete` | B2 | ✅ Done |
| 7 | Sensory variant field name corrections | B4 | ✅ Done |
| 8 | Targeted identity-drift regeneration | P3-B | ✅ Done |
| 9 | NSD evidence anchors in reveal trace | — | ✅ Done (warning-only) |
| 10 | Temporal richness / archetype diversity | — | 🔲 Not started (S3, low priority) |

**All gate-blocking (S0) and high-impact (S1/S2) issues are now implemented.** The next run is the first that should clear the release gate without a code-fix step. ISSUE-2 (report state contradiction) still requires empirical verification — it was fixed in worker but not confirmed in a subsequent run.

---

## What has been confirmed fixed and is NOT regressing

| Fix | Status |
|---|---|
| `scene.actNumber → scene.act` field name bug (B1) | ✅ Fixed and active |
| Clue descriptions wired into prose prompt (P1-B) | ✅ Fixed and active |
| Pacing gate detection + retry (P1-C) | ✅ Gate fires correctly; LLM retry still fails |
| Pacing gate retry threshold arithmetic (P2-A) | ✅ Fixed and active |
| Raw location context stripping (`stripLocationParagraphs`) | ✅ Fixed; no raw injection in runs 33–36 |
| Per-chapter prose progress events (`onBatchComplete`) | ✅ Working |
| Pronoun chain in character profiles | ✅ Working |
| `lockedFacts` injection | ✅ Working |
| `evidence_clues` back-fill (pipeline abort fix) | ✅ Fixed |
| Pacing gate threshold recomputed on retry | ✅ Fixed (B5 fix) |

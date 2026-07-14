# ANALYSIS_28 — Chapter Gate Failures & Post-Generation Validator Errors: Detailed Error Breakdown
*Date: 2026-05-28 | Runs: mystery-1779993526746 (primary) + mystery-1779988420525 (reference) | Model: gpt-4.1-mini-2025-04-14*

---

## 1. Context

This document is a **focused error analysis** complementing ANALYSIS_27. Where ANALYSIS_27 provided a pipeline + prose quality overview, ANALYSIS_28 drills into the specific gate failures and post-generation validation errors encountered across the two most recent canary runs.

**Runs covered:**

| Run ID | Ref | Exit code | CANARY_STATUS | Report grade | Issues |
|--------|-----|-----------|---------------|--------------|--------|
| mystery-1779993526746 | ANALYSIS_27 | 0 | warning | A (96.4) | 4 major, 18 moderate |
| mystery-1779988420525 | ANALYSIS_26 | 1 | needs_revision | C | Cast Design abort |

**Validation error types present in mystery-1779993526746 (post-repair):**
- `pronoun_gender_mismatch` — 18 moderate issues
- `locked_fact_missing_value` — contributes to major count
- `pronoun_drift` — contributes to major count
- `character_name_consistency` — 2/4 characters referenced (major, score 50)
- `G6-Q1 fair-play false positive` — culprit exact-name gate mismatch (major)

---

## 2. Chapter-Level Gate Failures (mystery-1779993526746)

### 2.1 Summary

3 of 10 chapters required a retry pass. All retries succeeded on attempt 2.

| Chapter | Attempt 1 gate(s) failed | Resolved on attempt |
|---------|--------------------------|---------------------|
| Ch5 | `template_leakage` | 2 |
| Ch7 | `completeness_structure`, `template_leakage` | 2 |
| Ch10 | `completeness_structure`, `clue_placement_timing` | 2 |

Chapters 1–4, 6, 8, 9 all passed on first attempt.

### 2.2 `template_leakage` — Ch5 and Ch7

**What it catches:** Prompt template scaffolding text or instruction fragments leaking into the generated prose (e.g., placeholder text, meta-instruction sentences, slot markers).

**Ch5 AtmosphereRepair log (same-chapter, concurrent repair pass):**
```
"the clock tower at quarter past three"  → "the steeple chimed fifteen minutes past three"
"near the clock tower at quarter past"   → "close to the tower striking fifteen"
"showed quarter past three when the body" → "revealed 3:15 as the corpse"
"the pressures upon this household are many" → "this home bears a weight of troubles"
```

**Ch7 AtmosphereRepair log:**
```
"the clock tower at quarter past three"  → "the chimes echoed just after three-fifteen"
"near the clock tower at quarter past"   → "by the clock tower shortly after quarter past"
"lips pressed into a thin line"          → "s lips tightened in quiet resolve"
"the household runs smoothly when every cog" → "the estate hums along as each part"
"in the formal gardens during the murder"   → "amidst the manicured hedges at the time of the killing"
```

**Pattern:** The phrase `"clock tower at quarter past three"` appeared in both Ch5 and Ch7, suggesting a shared narrative scene template leaked the precise clock reading into the prose verbatim. The phrase `"in the formal gardens during the murder"` also suggests a scene-description template with a bare noun (`"the murder"`) rather than contextualised prose.

**Root cause hypothesis:** The narrative outline for Ch5/Ch7 included over-literal scene descriptions that the LLM reproduced without paraphrase. The `template_leakage` gate correctly flagged these.

### 2.3 `completeness_structure` — Ch7 and Ch10

**What it catches:** Chapter body is missing a required structural element — typically the prose doesn't contain the minimum required number of paragraphs, or a mandatory section (e.g., clue reveal block, conclusion paragraph) is absent.

**Ch7:** Failed alongside `template_leakage`. The dual failure means the regenerated chapter also lacked structural completeness, not just template text.

**Ch10:** Failed `completeness_structure` alongside `clue_placement_timing`. Ch10 is the denouement chapter — the highest structural obligation in the pipeline (must include suspect elimination, discriminating test, and culprit reveal). A completeness failure here means the first-attempt response omitted one of these mandatory blocks.

**Implication:** Ch10 completeness failures are the most dangerous — they risk the story ending without a proper resolution. The retry succeeded, confirming the obligation block is effective but not always obeyed on the first attempt.

### 2.4 `clue_placement_timing` — Ch10

**What it catches:** A clue is revealed in a chapter where it is not yet permitted per the narrative sequence, or a clue due in an earlier chapter is still absent by the chapter's deadline.

**Ch10 context:** Ch10 is the final chapter. Any clue due before Ch10 that was not placed becomes a timing violation. The gate caught a late-placement issue in the first-attempt Ch10 prose.

**After retry:** All 18 expected clues were extracted successfully from the final story (`clue_visibility_missing_expected_ids: []`), confirming the retry resolved all timing violations.

---

## 3. AtmosphereRepair: Era Phrase Interventions

AtmosphereRepair ran across all 10 chapters post-generation. It fixed era-anachronistic phrases and a structural cliché recurring across the run.

### 3.1 Recurring cross-chapter phrase: `"clock tower at quarter past three"`

Fixed in Ch5, Ch6, Ch7, Ch8. This exact phrase appeared in 4 chapters — strongly suggesting it propagated from the narrative outline's temporal anchor (`3:15 pm`) into the scene templates verbatim.

| Chapter | Replacement used |
|---------|-----------------|
| Ch5 | "the steeple chimed fifteen minutes past three" |
| Ch6 | "the chimes echoed just after three-fifteen" |
| Ch7 | "by the clock tower shortly after quarter past" |
| Ch8 | "the old bell striking three fifteen" |

**Fix required:** The narrative outline temporal anchor should emit natural prose variants rather than a single canonical string. This is a prompt contract issue in the narrative agent, not in AtmosphereRepair.

### 3.2 Structural cliché: `"lips pressed into a thin line"` / `"household runs smoothly when every cog"`

These appeared in multiple chapters (Ch4, Ch7, confirmed) and were flagged by AtmosphereRepair's paragraph-fingerprint overlap detector. Both are model-preferred stock phrases that the LLM defaults to when not given explicit variety constraints.

| Phrase | Replacement |
|--------|-------------|
| `"lips pressed into a thin line"` | "lips tightened in quiet resolve" |
| `"household runs smoothly when every cog"` | "the estate hums along as each part" |
| `"in the formal gardens during the murder"` | "amidst the manicured hedges at the time of the killing" |

**Fix required:** Add these to the chapter obligation block's banned-phrase list or add a paragraph-fingerprint pre-check gate.

---

## 4. Post-Generation Validation Errors

After all 10 chapters were committed and AtmosphereRepair ran, the story-level validators produced the following:

### 4.1 Validation snapshot

| Stage | Critical | Major | Moderate | Minor | Total |
|-------|----------|-------|----------|-------|-------|
| Pre-repair | 0 | 5 | 18 | 0 | 23 |
| Post-repair | 0 | **4** | 18 | 0 | 22 |
| Release gate | 0 | **4** | 18 | 0 | 22 |

One major issue was resolved by the repair pass. 18 moderate issues and 3 major issues persisted to the release gate.

**Release gate decision:** `passed` (0 hard stops, 0 warnings). The release gate threshold does not block on major/moderate counts unless they exceed critical thresholds.

### 4.2 Character name consistency — MAJOR (score 50, failed)

**Test:** "Character name consistency" in the Prose Generation phase.
**Result:** 2/4 characters referenced (score 50/100, weight 2, severity major).

**Root cause:** Two characters (Dr. Mallory Finch and Beatrice Quill, or Eleanor Voss and one other) were not referenced by full name with sufficient frequency across the chapter set. The validator likely checks that each character appears by name in a minimum proportion of chapters.

**Note:** This is distinct from the G6-Q1 culprit-name false positive (see §4.4). This is a prose-level consistency metric, not a fair-play gate.

### 4.3 `pronoun_gender_mismatch` — 18 MODERATE issues

**Validator:** `CharacterConsistencyValidator` (or equivalent pronoun sweep).
**Volume:** 18 moderate issues surviving post-repair.

**`pronoun_validation_enabled: false`** was active — the pronoun validator was suppressed from blocking. The 18 issues are counted but do not trigger a hard stop. The deterministic pronoun sweep (34 repairs confirmed in ANALYSIS_27 terminal output) ran and fixed what it could; these 18 remaining issues are cases where the sweep did not match or was not triggered.

**Key character at risk:** Captain Ivor Hale (M) — the ChatGPT review in ANALYSIS_27 noted female pronouns assigned in several passages. These would be the primary source of `pronoun_gender_mismatch` moderate flags.

**Fix required:** Re-enable `pronoun_validation_enabled` once the false-positive rate is confirmed safe, and/or expand the deterministic sweep patterns to catch more pronoun drift cases.

### 4.4 `locked_fact_missing_value` — MAJOR

**Validator:** `LockedFactGate`.
**What it checks:** Every locked fact established in the CML (e.g., `clock_reading: "ten minutes past eleven"`) must appear verbatim (or in its canonical word-form) in the prose.

**This run:** 2 locked facts were registered (`clock_reading`, `tamper_amount`). The `enforceLockedFactValuePresence` post-generation pass injected 3 canonical value mentions. At least one locked fact value was still absent post-injection for one or more chapters, triggering the major issue.

**Comparison with ANALYSIS_26:** ANALYSIS_26 had 4 locked facts (`clock_reading`, `tamper_amount`, `pendulum_length`, `room_temperature`), and 8 locked_fact_missing_value errors. ANALYSIS_27 reduced to 2 locked facts and still has at least 1 such error. The injection pass does not guarantee full coverage.

**Fix required:** The `enforceLockedFactValuePresence` injection should be verified chapter-by-chapter and should fail-fast if a chapter has no natural anchoring point for a locked value, rather than silently injecting a forced mention.

### 4.5 `pronoun_drift` — MAJOR

**What it catches:** A character's pronouns are consistent within a chapter but drift across chapters (e.g., consistently "she" in Ch1–3, then mixed in Ch7–9).

**Distinction from `pronoun_gender_mismatch`:** Mismatch = wrong pronoun used for a character's registered gender in a single instance. Drift = pronoun used correctly in some chapters but incorrectly in others.

**Captain Ivor Hale** (M, culprit) is the most likely source, given the ChatGPT review evidence of female pronoun assignment. Pronoun drift at the culprit is a significant fair-play risk — it can obscure the culprit's identity and confuse the reader.

---

## 5. ANALYSIS_26 Run: Cast Design Abort (mystery-1779988420525)

**Failure:** `Cast Design` phase scored 85, below the passing threshold.

**Failed tests:**
- `Relationship density` — the cast's inter-character relationships were insufficiently dense
- `Relationships reference cast` — some relationship entries referenced character names not present in the cast roster

**Consequence:** The report was finalised at 13/14 phases (Prose Generation did not appear in the report, though the scoring log records prose running). Run_outcome = `failed`, grade = `C`.

**Comparison with mystery-1779993526746:** Cast Design scored 88 (passed) vs 85 (failed). The threshold appears to be in the 85–88 range. The improvement of +3 points was insufficient to push reliably above the threshold.

**Fix required:** Strengthen the Cast Design prompt to mandate explicit relationship matrix coverage (each character must reference at least 2 others) and validate that every relationship entry names cast members that exist in the `cast[]` array.

---

## 6. Root Cause Classification

| Error | Source layer | Frequency | Severity |
|-------|-------------|-----------|----------|
| `template_leakage` (clock phrase) | Narrative outline → prose | 4 chapters | Major |
| `completeness_structure` | LLM non-compliance on first attempt | 2 chapters | Major |
| `clue_placement_timing` | Ch10 denouement timing | 1 chapter | Major |
| `pronoun_gender_mismatch` | Pronoun sweep coverage gap | 18 instances | Moderate |
| `locked_fact_missing_value` | Injection pass incomplete | 1+ instances | Major |
| `pronoun_drift` | Culprit pronoun inconsistency cross-chapter | Unknown count | Major |
| `character_name_consistency` | LLM under-references 2/4 characters | Run-wide | Major |
| `Cast Design` threshold fail | Relationship density / cast reference | Run-level | Critical (abort) |

---

## 7. Priority Fixes

### P0 — Fix recurring `"clock tower at quarter past three"` phrase injection

**Target:** `packages/prompts-llm/src/agent7-narrative/` — wherever the temporal anchor `3:15 pm` is formatted into scene descriptions.
**Action:** Replace the single canonical string with a randomised/paraphrased variant set, or instruct the narrative agent to vary clock-time descriptions across scenes.

### P0 — Cast Design relationship density

**Target:** Agent 2 (cast design) prompt contract.
**Action:** Add explicit requirement: each character must list ≥2 named relationship entries, all names must be in the `cast[]` array. Verify with a validation pre-check before proceeding.

### P1 — Expand pronoun sweep to cover `pronoun_drift`

**Target:** `packages/story-validation/src/` — pronoun sweep or a new cross-chapter drift detector.
**Action:** After the chapter-by-chapter sweep, add a cross-chapter consistency pass that verifies each character's pronoun set is identical across all chapters.

### P1 — `locked_fact_missing_value` injection verification

**Target:** `apps/worker/` — `enforceLockedFactValuePresence` function.
**Action:** After injecting canonical value mentions, run a per-chapter verification scan to confirm each locked fact value is present. Fail with a recoverable error if any chapter is still missing a required value.

### P2 — Banned phrase list for structural clichés

**Target:** `packages/prompts-llm/src/agent9-prose/obligation-block.ts`
**Action:** Append the detected stock phrases (`"lips pressed into a thin line"`, `"household runs smoothly when every cog"`, etc.) to the forbidden-phrase preamble so they are blocked pre-generation rather than repaired post-generation.

---

## 8. Comparison: mystery-1779993526746 vs mystery-1779988420525

| Metric | ANALYSIS_26 (mystery-1779988420525) | ANALYSIS_28 (mystery-1779993526746) | Delta |
|--------|--------------------------------------|--------------------------------------|-------|
| Exit code | 1 | 0 | ✅ |
| Report grade | C | A | ✅ +2 grades |
| Phases completed | 13/14 | 14/14 | ✅ |
| Cast Design score | 85 (failed) | 88 (passed) | ✅ +3 |
| Chapters needing retry | unknown | 3/10 | — |
| Major issues post-repair | 10 | 4 | ✅ −6 |
| Moderate issues | 13 | 18 | ⚠️ +5 |
| Total cost | $0.069 | $0.204 | − (prose ran) |
| template_leakage errors | unknown | 2 chapters | tracked |
| pronoun_gender_mismatch | 13 moderate (suppressed) | 18 moderate (suppressed) | ⚠️ +5 |

**Key regression:** Moderate issues increased by 5 despite the run otherwise improving. The additional 5 moderate issues are `pronoun_gender_mismatch` instances — likely because ANALYSIS_27 had more completed prose chapters to evaluate.

---

## 9. Banned Phrases: Exhaustive Options + Scored Likelihood (Three Quality Passes)

Goal: eliminate recurring banned phrases (especially the clock-tower phrase family and stock cliches) with prevention-first controls, not only post-generation cleanup.

### 9.1 Pass 1 (Coverage Pass): Every Practical Approach In This Pipeline

Scoring scale: likelihood to resolve banned-phrase issue in canary runs (0-100).

| ID | Approach | Layer | Likelihood | Notes |
|----|----------|-------|------------|-------|
| A1 | Keep current dynamic phrase feed into AtmosphereRepair (`detectRecurringPhrases` -> `runAtmosphereRepairIfNeeded`) | Post-gen repair | 55 | Already active and partially effective; does not prevent first-pass leakage |
| A2 | Add a static banned-phrase catalog merged into AtmosphereRepair input | Post-gen repair | 78 | Guaranteed targeting for known phrases even if recurrence detector misses timing |
| A3 | Add banned stock-phrase rules to chapter obligation contract (same pattern as `ERA_FORBIDDEN`) | Pre-generation contract | 84 | Prevention layer; blocks phrase emission earlier |
| A4 | Inject per-batch phrase lock in retry prompt (explicit "do not use X" list from failed attempt) | Retry orchestration | 72 | Strong in retries; limited on first attempt |
| A5 | Fix temporal-anchor phrasing at narrative source (Agent 7 scene language for 3:15 anchor) | Upstream root cause | 91 | Highest leverage for clock phrase family; removes source propagation |
| A6 | Deterministic post-processing replacements (string map in deterministic prose post-processing) | Deterministic sanitizer | 76 | Reliable for exact strings; risks awkward context if replacement not nuanced |
| A7 | Expand scaffold/template regex to include explicit banned phrase families | Hard gate | 48 | Catches output but increases retries/cost; wrong layer for root cause |
| A8 | Add explicit linter rule type (e.g., banned_phrase_reuse) with chapter fail + targeted feedback | Linter/gate | 81 | Precise and explainable, but needs implementation and tuning |
| A9 | Add narrative-outline normalization step that rewrites canonical boilerplate before prose generation | Inter-agent handoff | 86 | Strong prevention if done before Agent 9 prompt assembly |
| A10 | Raise ngram/fingerprint strictness only for known phrase classes | Linter tuning | 57 | Can help, but indirect and noisy vs phrase-specific controls |
| A11 | Add regression tests for banned phrases (unit + canary assertions) | Verification | 69 | Does not prevent by itself, but prevents regressions once fixed |
| A12 | Monitor-only (no code change) | Operational | 5 | Confirms failures but does not solve them |

### 9.2 Pass 2 (Quality Challenge Pass): Re-score For Composition, False Positives, and Cost

Adjustments after challenge:

1. A2 upgraded (78 -> 82): Because the current AtmosphereRepair code only repairs phrases present in the chapter, a static+dynamic merged list is low-risk and immediately actionable.
2. A3 upgraded (84 -> 87): Existing contract style already supports strict forbidden lists; this is low-friction prevention.
3. A6 downgraded (76 -> 70): Deterministic replacement can degrade tone unless each phrase has curated context-aware alternatives.
4. A7 downgraded (48 -> 40): Gate expansion alone drives retry churn and cost while still allowing first-attempt generation failures.
5. A8 upgraded (81 -> 85): Phrase-specific linter errors improve retry directives and avoid overloading generic overlap gates.
6. A9 upgraded (86 -> 88): Handoff normalization prevents polluted phrasing from ever entering Agent 9 generation context.

Re-scored priority view (highest to lowest):

| Rank | ID | Re-scored likelihood |
|------|----|----------------------|
| 1 | A5 | 91 |
| 2 | A9 | 88 |
| 3 | A3 | 87 |
| 4 | A8 | 85 |
| 5 | A2 | 82 |
| 6 | A4 | 72 |
| 7 | A6 | 70 |
| 8 | A11 | 69 |
| 9 | A10 | 57 |
| 10 | A1 | 55 |
| 11 | A7 | 40 |
| 12 | A12 | 5 |

### 9.3 Pass 3 (Decision Pass): Recommended Fix Stack (Prevention > Cure)

Recommended implementation stack for highest probability of durable resolution:

1. **P0 Root Fix: A5 + A9 together**
	- Remove canonical clock-anchor prose at source and normalize narrative-outline wording before Agent 9 prompt assembly.
	- Expected impact: eliminate most cross-chapter propagation of the exact phrase family.

2. **P0 Prevention Contract: A3**
	- Add explicit banned stock-phrase list to chapter obligation contract (parallel to era forbidden terms).
	- Expected impact: reduce first-pass phrase emission and lower repair load.

3. **P1 Safety Net: A2 + A8**
	- Merge static banned catalog into AtmosphereRepair input.
	- Add phrase-specific linter issue class for precise retry feedback when prevention fails.
	- Expected impact: catch residual leaks deterministically with cleaner retry behavior.

4. **P2 Verification: A11**
	- Add phrase-focused regression tests to lock in the fix and prevent reintroduction.

### 9.4 What To Avoid As Primary Strategy

- A7 (regex gate expansion only) and A10 (generic overlap tightening only) should not be primary fixes.
- They mainly increase retries and cost, and they do not remove upstream phrase propagation.

### 9.5 Final Recommendation

Do **not** treat banned-phrase remediation as a single tactical patch.

Minimum strategic baseline (required): **A5 + A9 + A3 together**.

- A5 removes the upstream source phrasing pattern.
- A9 normalizes handoff language before prose generation.
- A3 enforces prevention at chapter generation time.

Then add **A2 + A8** as resilience controls, and **A11** as regression lock.

### 9.6 Strategic Completeness Check (Holistic vs Tactical)

Use this as a go/no-go screen before declaring the issue solved:

| Dimension | Tactical-only pattern (reject) | Strategic pattern (required) |
|-----------|--------------------------------|-------------------------------|
| Root cause | Patch output phrasing only | Remove source phrase propagation in upstream narrative generation (A5/A9) |
| Prevention | Retry-only or sanitizer-only | Pre-generation contract enforcement (A3) plus upstream normalization |
| Detection | Generic overlap gate only | Phrase-specific detection/retry feedback path (A8) |
| Recovery | Ad hoc manual edits | Deterministic + LLM safety net with explicit phrase catalog (A2) |
| Verification | One successful run | Regression tests + canary trend guardrails (A11) |
| Operability | No ownership/metrics | Named owner, rollout stages, KPI thresholds, rollback trigger |

If any strategic-pattern column is missing, the fix remains tactical and is likely to regress.

### 9.7 Implementation Program (Recommended)

1. **Wave 1: Root-cause containment (A5 + A9 + A3)**
	- Objective: stop phrase propagation before generation.
	- Exit criteria: banned phrase family frequency reduced by >=80% across three consecutive canary runs.

2. **Wave 2: Resilience hardening (A2 + A8)**
	- Objective: catch residual leak paths with targeted repair and explicit linter feedback.
	- Exit criteria: template-leakage retries for phrase-family errors reduced to near-zero while cost delta remains bounded.

3. **Wave 3: Regression lock (A11)**
	- Objective: prevent silent reintroduction.
	- Exit criteria: automated tests fail on reintroduced banned phrases in both unit and canary checks.

### 9.8 Success Metrics (Must Hold)

- Phrase-family recurrence: sustained near-zero for targeted phrases across recent canary windows.
- Retry burden: no compensating rise in retries from stricter gates.
- Quality side effects: no increase in pronoun drift or locked-fact misses due to rewritten prompts.
- Cost discipline: no disproportionate token/cost increase per successful run.

### 9.9 Stage 9 Stress Test: Why Fixes Could Still Fail

Even with A5/A9/A3, there are residual failure paths that can keep recurrence alive:

1. **Detection blind spot (exact n-gram dependence):** `detectRecurringPhrases` currently relies on exact 7-gram overlap and threshold >=3 chapters. Near-variants and 2-chapter echoes can evade this.
2. **Repair coverage cap:** `runAtmosphereRepairIfNeeded` currently limits targets with `.slice(0, 8)`. If >8 chapters carry the phrase family, some chapters remain untreated.
3. **Single end-of-run repair pass:** repair runs after chapter generation is complete, so repeated phrasing can propagate through later chapters before cleanup.
4. **Static ban-list drift risk:** if banned phrase catalogs are not refreshed from live canary telemetry, they become stale and miss emerging templates.
5. **Prompt dilution risk:** adding many forbidden phrases to obligations can reduce compliance if not structured by severity and compressed.

### 9.10 High-Probability Fine Tuning (Immediate, Non-Disruptive)

These are precision upgrades intended to increase likelihood without destabilizing the pipeline.

| Upgrade | Current behavior | Fine-tuned behavior | Likelihood uplift |
|---------|------------------|---------------------|-------------------|
| F1 Phrase-family detector | Exact 7-gram only | Add normalized phrase-family matching (lemma/stem + stopword-insensitive windows + edit-distance guard) | High |
| F2 Repair coverage | Repairs first 8 matching chapters | Repair all matching chapters, or rank by severity and continue until zero unresolved matches | High |
| F3 Repair timing | One terminal pass | Add lightweight per-batch phrase check before commit + final global pass | High |
| F4 Ban-list quality | Flat phrase list | Tiered list: hard-ban (must fail), soft-ban (warn/rewrite), watchlist (telemetry only) | Medium-High |
| F5 Retry specificity | Generic overlap retry guidance | Phrase-specific retry packet with banned family + required alternative phrasing templates | Medium-High |
| F6 Drift control | Manual list updates | Auto-refresh phrase catalog from last N canaries with approval gate | Medium |

### 9.11 Blue-Sky Options (Use Selectively)

These are higher-innovation ideas that can yield outsized gains if validated.

1. **Negative Style Memory Bank**
	- Maintain a compact "do-not-echo" memory from recent successful/failed canaries.
	- Feed only top-risk phrase families by era/setting into each run.
	- Benefit: model sees dynamic anti-pattern memory, not a static frozen list.

2. **Adversarial Phrase Fuzzer**
	- Generate paraphrase variants of known banned phrases (time-anchor variants, syntactic swaps, lexical substitutions) and test detector catch rate.
	- Benefit: hardens detection against near-miss variants before production runs.

3. **Dual-Model Phrase Referee**
	- Use a cheap secondary classifier pass to score banned-phrase risk per chapter before commit.
	- Benefit: independent signal reduces single-model blind spots.

4. **Style Diversity Budgeting**
	- Allocate a per-chapter "phrase novelty budget" and fail if chapter openings or key beats exceed similarity envelope.
	- Benefit: proactive control over template convergence, not only post-failure reaction.

5. **Constrained Alternative Generator**
	- Pre-generate approved replacement pools per era/location register for high-risk phrase families.
	- Benefit: deterministic high-quality substitutions with lower tone risk than freeform replacement.

### 9.12 Updated Likelihood-Of-Success Model (Post-Enhancement)

Strategic stack confidence increases when the fine-tuning set is added:

| Stack | Estimated likelihood of durable resolution |
|-------|--------------------------------------------|
| Baseline strategic stack (A5+A9+A3+A2+A8+A11) | 0.78 |
| + Fine-tuning set (F1+F2+F3+F4+F5) | 0.90 |
| + One validated blue-sky option (best-fit from 9.11) | 0.93 |

Notes:
- These are directional planning estimates, not statistical guarantees.
- Treat any drop in quality/cost metrics as a rollback trigger even if recurrence improves.

### 9.13 Experiment Design: Max Learning Per Canary

Run a short, high-information experiment ladder instead of ad hoc edits:

1. **E1 (Control):** current strategic baseline only.
2. **E2:** baseline + F1/F2/F3.
3. **E3:** E2 + F4/F5.
4. **E4:** E3 + one blue-sky candidate (choose by implementation feasibility).

Capture per-run:
- phrase-family incidence (by chapter and family)
- retry count and gate-failure taxonomy
- total cost and cost per accepted chapter
- side-effect deltas (pronoun, locked fact, clue timing)

Decision rule:
- Promote only if recurrence improves and no material regression appears in side-effect or cost metrics.
- Roll back immediately if side effects breach thresholds, even with phrase gains.

### 9.14 Final "Give-It-Everything" Recommendation

For highest real-world success probability, run Stage 9 as a **program**, not a patch:

1. Implement baseline strategic bundle (A5+A9+A3) as mandatory root prevention.
2. Add resilience (A2+A8) and verification lock (A11).
3. Immediately apply fine-tuning boosters (F1-F5), especially detector robustness and repair coverage/timing.
4. Pilot one blue-sky option with strict guardrails and measurable promotion criteria.

This is the strongest path to avoid tactical "pass this run" behavior and achieve durable, repeatable suppression of banned-phrase failure modes.

### 9.15 Full Implementation Plan

This section translates Stage 9 into an execution-ready delivery plan with scoped code changes, controls, and release gates.

#### 9.15.1 Program Objectives

Primary objective:
- Reduce banned-phrase recurrence to near-zero without shifting failures into other quality gates.

Secondary objectives:
- Keep retry volume and cost bounded.
- Preserve or improve pronoun, locked-fact, and clue-placement performance.
- Make phrase controls observable, testable, and reversible.

Non-goals:
- Do not increase generic gate aggressiveness as the primary mechanism.
- Do not depend on one-shot prompt edits without telemetry and validation.

#### 9.15.2 Delivery Workstreams

Status update (2026-05-28, post-implementation pass):

| Workstream | Scope | Priority | Status | Next action |
|------------|-------|----------|--------|-------------|
| WS1 Upstream root-cause controls | A5 + A9 source/handoff phrase normalization | P0 | Completed | Monitor canary recurrence and tune normalization mappings only if new phrase families emerge |
| WS2 Pre-generation prevention | A3 chapter obligation banned-phrase contract | P0 | Completed | Monitor canary adherence; tune hard/soft/watch phrase tiers only if false positives appear |
| WS3 Detection and repair hardening | F1/F2/F3 + A2 + A8 | P1 | In progress | Advanced semantic family matching (deep F1) remains; baseline detection + precommit/linter/repair toggles are now flag-controlled |
| WS4 Verification and tests | A11 + experiment harness from 9.13 | P1 | In progress | Run structured E1-E3 canary ladder and capture side-effect/cost deltas |
| WS5 Operability | metrics, dashboards, ownership, rollback triggers | P1 | Completed (phase telemetry path) | Dashboard wiring and threshold automation next; worker run diagnostics now emit phrase telemetry + rollout-flag state |
| WS6 Blue-sky pilot | one candidate from 9.11 behind flag | P2 | In progress (flag ready) | Select pilot candidate and run gated E4 trial after E1-E3 is stable |

#### 9.15.3 Code Change Map (File-Level)

| ID | Change | Primary files | Notes |
|----|--------|---------------|-------|
| C1 | Narrative temporal-anchor normalization (A5) | `packages/prompts-llm/src/agent7-narrative/**` | Remove canonical time-anchor wording; introduce varied phrasing policy |
| C2 | Inter-agent handoff normalization (A9) | `packages/prompts-llm/src/agent9-prose/generate.ts`, context/prompt builders under `packages/prompts-llm/src/agent9-prose/**` | Rewrite or sanitize high-risk boilerplate before prompt assembly |
| C3 | Obligation contract banned list (A3) | `packages/prompts-llm/src/agent9-prose/obligation-block.ts` | Add tiered phrase policy (hard-ban/soft-ban/watchlist) |
| C4 | Detection robustness (F1) | `packages/prompts-llm/src/agent9-prose/phrase-analysis.ts` | Extend beyond exact 7-gram recurrence to phrase-family matching |
| C5 | Repair coverage cap removal (F2) | `packages/prompts-llm/src/agent9-prose/repair.ts` | Replace fixed `.slice(0, 8)` strategy with full/priority processing |
| C6 | Per-batch phrase guard (F3) | `packages/prompts-llm/src/agent9-prose/generate.ts` | Add lightweight pre-commit phrase check per batch |
| C7 | Static phrase catalog merge (A2) | `packages/prompts-llm/src/agent9-prose/generate.ts`, new config file under `packages/prompts-llm/src/agent9-prose/` or generation params | Merge dynamic and static phrase sources |
| C8 | Phrase-specific linter issue class (A8) | `packages/prompts-llm/src/agent9-prose/lint.ts` and/or linter path used in batch validation | Add explicit banned-phrase issue type and targeted retry messaging |
| C9 | Tests and fixtures (A11) | `packages/prompts-llm/src/__tests__/agent9-prose.test.ts`, related validator/linter tests | Add regression fixtures for exact and near-variant phrase families |
| C10 | Telemetry + report surfacing | `apps/worker/src/jobs/agents/agent9-run.ts`, run report serialization paths | Emit phrase-family metrics, unresolved counts, and repair actions |

#### 9.15.4 Feature Flags and Safety Switches

Add explicit toggles so each change can be promoted independently.

Implementation status: these flags now exist in runtime config at `agent9_prose.rollout_flags` (generation params) and are consumed by prose generation/obligation/linter paths.

| Flag | Default | Purpose |
|------|---------|---------|
| `phrase_family_detection_enabled` | true | Enables configured phrase-family detection and telemetry path |
| `uncapped_repair_targets_enabled` | true | Controls F2 cap removal behavior |
| `precommit_phrase_gate_enabled` | true | Enables F3 per-batch phrase blocking on linter failures |
| `tiered_phrase_contract_enabled` | true | Enables hard/soft/watch phrase policy in obligations |
| `phrase_specific_linter_enabled` | true | Enables A8 dedicated banned-phrase linter check |
| `blue_sky_mode_enabled` | false | Activates selected blue-sky prompt mode when promoted |

Promotion rule:
- Promote one flag family at a time unless paired by design (F1+F2+F3).
- Hold for at least three canary runs per promotion stage.

#### 9.15.5 Implementation Sequence (Two-Week Program)

Week 1:
1. Build WS1 and WS2 (C1, C2, C3) with unit tests.
2. Build WS3 core mechanics (C4, C5, C6) behind flags.
3. Add telemetry scaffolding (C10) for phrase incidence and repair outcomes.

Week 2:
1. Add static catalog + linter class (C7, C8).
2. Complete regression suites and canary harness assertions (C9).
3. Run E1-E3 experiment ladder from 9.13.
4. If stable, run one blue-sky pilot (E4) behind `agent9_bluesky_mode`.

#### 9.15.6 Acceptance Criteria by Workstream

WS1/WS2 (Root prevention):
- Canonical clock-anchor phrase family does not appear in generated prompts or committed chapters across three consecutive canaries.

WS3 (Detection/repair hardening):
- Near-variant phrase families are detected and acted on.
- No unresolved high-risk phrase family remains after final pass.

WS4 (Verification):
- Regression tests fail when banned phrases are reintroduced.
- Canary report includes phrase-family incidence trend and unresolved count.

WS5 (Operability):
- Dashboard shows recurrence, retries, cost, and side-effect deltas for each run.
- Rollback trigger is machine-checkable from run metrics.

WS6 (Blue-sky pilot):
- Pilot outperforms E3 baseline without breaching side-effect or cost guardrails.

#### 9.15.7 Test Plan

Unit tests:
- Phrase-family detector catches exact, tense-shifted, and synonym-near variants.
- Repair target logic handles >8 affected chapters.
- Obligation contract includes and formats tiered phrase controls correctly.

Integration tests:
- Batch generation path blocks or repairs banned phrase families pre-commit.
- Linter emits dedicated banned-phrase issue type and retry directives.

Canary assertions:
- Per-run phrase-family histogram is emitted.
- No positive drift in pronoun, locked-fact, or clue-timing failures.
- Cost per accepted chapter remains within agreed envelope.

#### 9.15.8 Observability Schema

Add run-level fields:
- `phrase_family_incidence_by_chapter`
- `phrase_family_unresolved_after_repair`
- `phrase_repair_actions_count`
- `phrase_precommit_blocks_count`
- `phrase_linter_failures_count`

Add trend fields:
- 7-run rolling recurrence for top phrase families
- retry-per-chapter trend under phrase controls
- side-effect delta bundle (pronoun, locked_fact, clue_timing)

#### 9.15.9 Rollback and Contingency Plan

Immediate rollback triggers:
- >15% increase in major+moderate side-effect issues over 3-run baseline.
- >20% increase in cost per accepted chapter without proportional recurrence reduction.
- Repeated false positives causing material retry escalation.

Rollback actions:
1. Disable newest promoted phrase flag first.
2. Preserve telemetry collection while control logic is disabled.
3. Re-run E1 control to re-baseline.
4. Re-introduce changes one flag family at a time.

#### 9.15.10 Ownership and Operating Cadence

Recommended ownership:
- Prompt/contract owner: WS1/WS2
- Prose runtime owner: WS3/WS5
- Validation owner: WS4
- Canary operations owner: WS5/WS6

Cadence:
- Daily canary triage during rollout.
- Twice-weekly Stage 9 review against 9.8 metrics and 9.13 decision rule.
- Promotion/rollback decision logged per run window.

#### 9.15.11 Definition of Done

Stage 9 is complete only when all conditions hold:
1. Strategic baseline and resilience stack are live (A5+A9+A3+A2+A8+A11).
2. Fine-tuning controls F1-F5 are implemented and validated.
3. Recurrence remains near-zero across two consecutive run windows.
4. No material regression in side-effect quality metrics.
5. Run-cost envelope remains stable.
6. All controls are observable, test-covered, and rollback-safe.

---

## 10. Prose Integrity and Entity Fidelity: Exhaustive Options + Scored Likelihood (Three Quality Passes)

Goal: eliminate semantic corruption introduced by deterministic safety transforms and preserve narrative integrity (mechanical terms, quotes, character identity, and validator-gate alignment) without regressing season-lock or fair-play controls.

Observed trigger pattern in latest canary output:
- Mechanical term collision: `spring` in mechanism context rewritten to `autumn` (example: "pendulum suspension autumn").
- Boundary degradation: quote and sentence fragments (`clock'paused`, dangling quote segments) reduce readability and downstream validator precision.
- Entity fidelity drift: incorrect pronoun assignments and inconsistent titled-name casing (`the doctor Finch`, `the captain Hale`) in key scenes.
- Gate mismatch risk: culprit-mention expectations can fail when prose uses title/alias forms rather than strict full-name string matches.

### 10.1 Pass 1 (Coverage Pass): Every Practical Approach In This Pipeline

Scoring scale: likelihood to resolve integrity defects durably in canary runs (0-100).

| ID | Approach | Layer | Likelihood | Notes |
|----|----------|-------|------------|-------|
| B1 | Keep current global season lock replacement behavior | Deterministic post-process | 20 | Preserves season consistency but demonstrably causes lexical collisions in technical contexts |
| B2 | Make season lock context-aware (atmosphere/weather windows only) | Deterministic post-process | 90 | Highest leverage against `spring`/mechanical collisions while retaining temporal guardrails |
| B3 | Add protected collocation lexicon (`suspension spring`, `mainspring`, `coil spring`, `spring tension`) | Deterministic post-process | 88 | Strong prevention for known failure family; low implementation risk |
| B4 | Add POS/role-aware rewriting (season noun/adjective only) | Deterministic NLP layer | 79 | Robust but more complex than regex+collocation protections |
| B5 | Add boundary-integrity gate (dangling quotes, broken contractions, unbalanced punctuation) | Pre-commit lint/gate | 85 | Stops malformed prose before commit; likely reduces retry waste downstream |
| B6 | Add deterministic quote/apostrophe repair pass before validation | Deterministic sanitizer | 74 | Useful safety net; can hide upstream generation defects if overused |
| B7 | Add semantic-diff guard around deterministic rewrites (block if protected token class changed) | Deterministic safety framework | 84 | Prevents high-cost meaning flips from "fix" logic itself |
| B8 | Add cross-chapter entity/pronoun canonicality gate | Story-level validation | 82 | Addresses persistent pronoun drift and improves character coherence |
| B9 | Culprit mention gate: alias-aware matching (title/surname/full-name mapping) | Release gate alignment | 81 | Reduces false negatives while preserving fair-play intent |
| B10 | Add targeted retry packet for entity drift + malformed boundary hints | Retry orchestration | 76 | Improves corrective retries; does not protect first attempt alone |
| B11 | Regression harness with corruption fixtures + canary assertions | Verification | 73 | Prevents reintroduction; does not prevent first occurrence by itself |
| B12 | Monitor-only (no code change) | Operational | 5 | Confirms defects but cannot remove root cause |

### 10.2 Pass 2 (Quality Challenge Pass): Re-score For Composition, False Positives, and Cost

Adjustments after challenge:

1. B2 upgraded (90 -> 92): Matches failure geometry directly with minimal collateral behavior change.
2. B3 upgraded (88 -> 90): Protected-collocation table is deterministic and testable, ideal for prevention-over-cure.
3. B5 upgraded (85 -> 87): Boundary failures are cheap to detect and expensive to ignore.
4. B6 downgraded (74 -> 68): Blind text surgery can distort tone/voice; better as fallback than primary.
5. B8 upgraded (82 -> 84): Entity/pronoun drift has run-wide quality impact and fair-play side effects.
6. B9 upgraded (81 -> 85): Gate alignment prevents noisy canary warnings without weakening the culprit-mention requirement.

Second pass (delivery-confidence re-score):

1. B2 upgraded again (92 -> 93): context-scoped rewrite plus sentence-window targeting makes this highly deterministic and safe to stage.
2. B3 upgraded again (90 -> 92): protected-collocation catalogs are simple to verify with fixture tests and low-cost to maintain.
3. B5 upgraded (87 -> 88): boundary gate catches a broad set of malformed outputs before commit with strong precision.
4. B7 upgraded (84 -> 87): semantic-diff guard materially lowers risk of deterministic self-corruption.
5. B8 upgraded (84 -> 86): cross-chapter canonicality creates measurable run-level quality uplift.
6. B9 upgraded (85 -> 87): alias-aware culprit matching removes warning noise while preserving fair-play strictness.
7. B10 upgraded (76 -> 80): targeted retry packets gain effectiveness when fed B5/B7 diagnostics.
8. B11 upgraded (73 -> 78): regression harness value increases once collision and boundary fixtures are added to canary assertions.
9. B4 upgraded (79 -> 81): POS/role-aware rewrite becomes practical as a second-stage precision layer after B2/B3.
10. B6 downgraded further (68 -> 66): deterministic punctuation surgery remains useful only as a constrained fallback.

Re-scored priority view (highest to lowest):

| Rank | ID | Re-scored likelihood |
|------|----|----------------------|
| 1 | B2 | 93 |
| 2 | B3 | 92 |
| 3 | B5 | 88 |
| 4 | B7 | 87 |
| 5 | B9 | 87 |
| 6 | B8 | 86 |
| 7 | B4 | 81 |
| 8 | B10 | 80 |
| 9 | B11 | 78 |
| 10 | B6 | 66 |
| 11 | B1 | 20 |
| 12 | B12 | 5 |

### 10.3 Pass 3 (Decision Pass): Recommended Fix Stack (Prevention > Cure)

Recommended implementation stack for highest probability of durable resolution:

1. **P0 Root Fix: B2 + B3 together**
	- Replace global season-token substitution with context-aware replacement and protected mechanical collocations.
	- Expected impact: eliminate semantic corruption such as `suspension spring -> suspension autumn`.

2. **P0 Integrity Prevention: B5 + B7**
	- Add boundary-integrity gate and semantic-diff safety checks around deterministic rewrites.
	- Expected impact: prevent malformed prose commits and self-inflicted meaning changes.

3. **P1 Alignment and Coherence: B8 + B9 + B10**
	- Add stronger entity consistency checks and alias-aware culprit gate semantics, with targeted retry packets.
	- Expected impact: reduce pronoun/entity drift and gate false alarms.

4. **P2 Regression Lock: B11**
	- Add fixtures and canary assertions for protected collocations and boundary integrity.

### 10.4 What To Avoid As Primary Strategy

- B1 (keep global replacement) should not remain the primary strategy; it is the direct source of semantic collisions.
- B6 (deterministic quote surgery alone) should not be primary; it can cosmetically hide deeper generation defects.
- B10 (retry messaging only) is not sufficient without first-pass prevention controls.

### 10.5 Final Recommendation

Do **not** treat this as a single regex patch.

Minimum strategic baseline (required): **B2 + B3 + B5 + B7 together**.

- B2 controls where season rewrites are legally allowed.
- B3 protects mechanism lexicon and other high-risk domain collocations.
- B5 blocks malformed boundary output at commit time.
- B7 prevents deterministic fixers from introducing semantic drift.

Then add **B8 + B9 + B10** for entity/gate quality and **B11** as a regression lock.

### 10.6 Strategic Completeness Check (Holistic vs Tactical)

Use this as a go/no-go screen before declaring Section 10 solved:

| Dimension | Tactical-only pattern (reject) | Strategic pattern (required) |
|-----------|--------------------------------|-------------------------------|
| Root cause | Patch one bad token only | Constrain rewrite scope + protect semantic collocations (B2/B3) |
| Prevention | Repair after commit | Pre-commit boundary and semantic guards (B5/B7) |
| Detection | Generic linter only | Dedicated entity/boundary/collision issue classes |
| Recovery | Manual run-specific edits | Targeted retry packets with explicit drift guidance (B10) |
| Verification | One green canary | Fixture-backed regression + canary trend assertions (B11) |
| Operability | No rollback toggles | Flagged rollout + metric thresholds + rollback playbook |

If any strategic-pattern column is missing, the fix remains tactical and likely to regress.

### 10.7 Implementation Program (Recommended)

1. **Wave 1: Collision containment (B2 + B3)**
	- Objective: stop deterministic season rewrites from mutating mechanism terms.
	- Exit criteria: zero protected-collocation rewrites across three consecutive canaries.

2. **Wave 2: Commit integrity hardening (B5 + B7)**
	- Objective: block malformed quotes/sentence boundaries and semantic-drift rewrites before commit.
	- Exit criteria: boundary-integrity and semantic-diff failures near-zero after retry.

3. **Wave 3: Entity/gate quality (B8 + B9 + B10)**
	- Objective: align entity fidelity and culprit mention semantics with fair-play expectations.
	- Exit criteria: sustained drop in pronoun/entity drift and elimination of culprit-name false positives.

4. **Wave 4: Regression lock (B11)**
	- Objective: prevent reintroduction during future safety or prompt changes.

### 10.8 Success Metrics (Must Hold)

- `mechanical_term_collision_count` remains 0 for protected collocations.
- `boundary_integrity_failures_count` trends to near-zero without retry explosion.
- `entity_pronoun_drift_count` decreases run-over-run.
- `culprit_gate_false_positive_count` remains 0 while true positives remain detectable.
- Cost per accepted chapter remains within established envelope.

### 10.9 Stage 10 Stress Test: Why Fixes Could Still Fail

Residual failure paths even after B2/B3/B5/B7:

1. **Coverage drift in protected lexicon:** new mechanism terms may appear and evade collocation guard.
2. **Context classifier ambiguity:** atmosphere vs mechanism usage can blur in mixed sentences.
3. **Boundary guard false positives:** strict punctuation checks can over-trigger on stylistic dialogue.
4. **Alias-map incompleteness:** culprit mention gate can still misclassify if title/surname maps are stale.
5. **Retry dilution:** broad retry prompts can fix one defect while reintroducing another.

### 10.10 High-Probability Fine Tuning (Immediate, Non-Disruptive)

| Upgrade | Current behavior | Fine-tuned behavior | Likelihood uplift |
|---------|------------------|---------------------|-------------------|
| G1 Scope-aware season lock | Global token substitution | Restrict rewrites to weather/atmosphere sentence windows | High |
| G2 Protected collocations | No lexical immunity | Do-not-rewrite list for mechanism and idiom collocations | High |
| G3 Boundary lint class | Generic text lint only | Dedicated `boundary_integrity` issue with precise retry hints | High |
| G4 Semantic rewrite diff | No post-rewrite semantic check | Block commit when protected tokens mutate class/meaning | High |
| G5 Entity canonical map | Ad hoc name handling | Character alias/title/surname canonicality map in validators | Medium-High |
| G6 Gate-aligned culprit matcher | Exact full-name dependence | Full-name + alias-aware evidence matching with strict floor | Medium-High |

### 10.11 Blue-Sky Options (Use Selectively)

1. **Lexical Role Tagger Before Rewrite**
	- Lightweight classifier tags candidate tokens as season/weather/mechanism before replacement.

2. **Dual-Pass Boundary Referee**
	- Second pass checks quote/contracted-token balance and only accepts if both passes agree.

3. **Entity Graph Consistency Check**
	- Build per-chapter entity-pronoun graph and reject outlier edges before commit.

4. **Semantic Diff Budgeting**
	- Quantify maximum allowable deterministic-change distance per chapter.

5. **Adaptive Protected Lexicon Miner**
	- Mine top collision candidates from last N canaries and propose protected terms with human approval.

### 10.12 Updated Likelihood-Of-Success Model (Post-Enhancement)

| Stack | Estimated likelihood of durable resolution |
|-------|--------------------------------------------|
| Baseline strategic stack (B2+B3+B5+B7+B8+B9+B10+B11) | 0.86 |
| + Fine-tuning set (G1+G2+G3+G4+G5+G6) | 0.94 |
| + One validated blue-sky option (best-fit from 10.11) | 0.96 |

Notes:
- Estimates are directional planning values.
- Any material quality or cost regression is an automatic rollback trigger.

### 10.13 Experiment Design: Max Learning Per Canary

Run a focused ladder:

1. **E10-1 (Control):** current behavior (flags off).
2. **E10-2:** B2 + B3 only.
3. **E10-3:** E10-2 + B5 + B7.
4. **E10-4:** E10-3 + B8 + B9 + B10.
5. **E10-5:** E10-4 + one blue-sky candidate.

Capture per run:
- collision count by protected term family
- boundary failure taxonomy and retry count
- pronoun/entity drift deltas
- culprit-gate true/false positive rates
- cost per accepted chapter and total retry burden

Decision rule:
- Promote only if collisions fall to zero and side-effect metrics do not regress.
- Roll back immediately on sustained false-positive or cost spikes.

### 10.14 Final "Give-It-Everything" Recommendation

For highest real-world success probability, run Stage 10 as a **program**:

1. Ship root containment (B2+B3).
2. Add integrity guards (B5+B7).
3. Align entity/gate behavior (B8+B9+B10).
4. Lock with regression and telemetry (B11).
5. Pilot one blue-sky enhancement only after E10-4 stability.

This path prioritizes prevention-first controls and avoids replacing one class of failure with another.

### 10.15 Full Implementation Plan

This section translates Stage 10 into an execution-ready delivery plan with scoped code changes, controls, and release gates.

#### 10.15.1 Program Objectives

Primary objective:
- Eliminate deterministic semantic corruption and boundary degradation while preserving season-lock benefits.

Secondary objectives:
- Reduce entity/pronoun drift.
- Align culprit mention gates with narrative alias usage.
- Keep retries and cost bounded.
- Ensure full observability and rollback safety.

Non-goals:
- Do not weaken fair-play requirements to silence warnings.
- Do not rely on post-hoc manual story edits as a quality mechanism.

#### 10.15.2 Delivery Workstreams

| Workstream | Scope | Priority | Status | Next action |
|------------|-------|----------|--------|-------------|
| WS10-1 Collision containment | B2 + B3 context/protected rewrites | P0 | Completed | Monitor canary stories for residual mechanical-term collisions and tune protected-collocation list if needed |
| WS10-2 Commit integrity | B5 + B7 boundary and semantic diff guards | P0 | Completed | Expand boundary fixture coverage for additional apostrophe/quote edge cases |
| WS10-3 Entity coherence | B8 pronoun/entity canonicality | P1 | Completed | Monitor run-level `entity_pronoun_drift_count` and tighten thresholds only if drift plateaus |
| WS10-4 Gate alignment | B9 alias-aware culprit matching | P1 | Completed | Evaluate false-positive/false-negative rate from live runs and refine alias normalization rules |
| WS10-5 Retry quality | B10 targeted retry packets | P1 | Completed | Add a small capped matrix test for integrity-specific retry directives by error class |
| WS10-6 Verification | B11 fixture and canary assertions | P1 | Completed | Keep assertions active and review first two post-change run windows for stability |
| WS10-7 Operability | metrics + rollback automation | P1 | Completed | Operationalize alert routing for rollback triggers in canary triage cadence |
| WS10-8 Blue-sky pilot | one option from 10.11 behind flag | P2 | Not started | Keep disabled until WS10-3 and WS10-6 exit criteria are met |

#### 10.15.3 Code Change Map (File-Level)

| ID | Change | Primary files | Notes |
|----|--------|---------------|-------|
| D1 | Context-aware season rewrite scope | `packages/prompts-llm/src/agent9-prose/lint.ts` | Restrict replacement to atmosphere/weather contexts |
| D2 | Protected collocation lexicon | `packages/prompts-llm/src/agent9-prose/lint.ts` or new helper under `packages/prompts-llm/src/agent9-prose/` | Block rewrites for mechanism phrases |
| D3 | Boundary-integrity linter class | `packages/prompts-llm/src/agent9-prose/lint.ts` | Add dangling-quote/apostrophe/sentence-fragment checks |
| D4 | Semantic diff safety guard | `packages/prompts-llm/src/agent9-prose/generate.ts`, `packages/prompts-llm/src/agent9-prose/lint.ts` | Reject deterministic rewrite outputs that mutate protected terms |
| D5 | Entity/pronoun cross-chapter consistency | `packages/story-validation/src/**` (pronoun/entity validators) | Extend drift detection and chapter-level diagnostics |
| D6 | Alias-aware culprit matcher | `packages/story-validation/src/**` (fair-play/culprit validators) | Match full name + title/surname aliases with strict evidence floor |
| D7 | Retry packet specificity | `packages/prompts-llm/src/agent9-prose/generate.ts` | Defect-specific retry directives |
| D8 | Runtime flags and config | `packages/story-validation/src/generation-params.ts`, `apps/worker/config/generation-params.yaml` | Feature toggles for staged rollout |
| D9 | Telemetry surfacing | `apps/worker/src/jobs/agents/agent9-run.ts` | Emit collision/boundary/entity metrics |
| D10 | Unit/integration tests | `packages/prompts-llm/src/__tests__/**`, `packages/story-validation/src/**/__tests__/**` | Add protected-collocation and boundary fixtures |
| D11 | Canary harness assertions | `scripts/**` and/or canary report checks | Assert zero protected-collision regressions |

#### 10.15.4 Feature Flags and Safety Switches

Add explicit toggles so each change can be promoted independently.

| Flag | Default | Purpose |
|------|---------|---------|
| `season_lock_context_aware_enabled` | false | Enables context-scoped season rewrites |
| `season_lock_protected_collocations_enabled` | false | Enables protected mechanism collocation list |
| `boundary_integrity_gate_enabled` | false | Enables boundary-integrity pre-commit linting |
| `semantic_rewrite_diff_guard_enabled` | false | Blocks semantic mutations from deterministic rewrites |
| `entity_fidelity_gate_enabled` | false | Enables stricter cross-chapter entity/pronoun checks |
| `culprit_alias_gate_enabled` | false | Enables alias-aware culprit mention gate |
| `integrity_retry_packet_enabled` | false | Enables defect-specific retry directives |
| `integrity_blue_sky_mode_enabled` | false | Activates selected blue-sky option |

Promotion rule:
- Promote one flag family at a time.
- Hold for at least three canaries before advancing.

#### 10.15.5 Implementation Sequence (Two-Week Program)

Week 1:
1. Build WS10-1 and WS10-2 (D1, D2, D3, D4) behind flags.
2. Add telemetry scaffolding (D9) for collision and boundary metrics.
3. Add first regression fixtures (D10) for protected collocations.

Week 2:
1. Build WS10-3 and WS10-4 (D5, D6).
2. Add retry specificity (D7) and config toggles (D8).
3. Complete canary assertions (D11).
4. Run E10-1 through E10-4 ladder; consider E10-5 only if stable.

#### 10.15.6 Acceptance Criteria by Workstream

WS10-1 (Collision containment):
- No protected collocation is rewritten across three consecutive canaries.

WS10-2 (Commit integrity):
- Boundary-integrity failures are corrected before commit without retry explosion.

WS10-3 (Entity coherence):
- Pronoun/entity drift issues drop run-over-run and remain below agreed threshold.

WS10-4 (Gate alignment):
- Culprit mention checks pass when equivalent alias/title evidence is present and fail when evidence is absent.

WS10-5/WS10-6 (Retry + verification):
- Regression tests fail on reintroduced corruption patterns.
- Canary report emits integrity metrics for every run.

#### 10.15.7 Test Plan

Unit tests:
- Season lock does not rewrite mechanism collocations.
- Season lock still rewrites true atmospheric contradictions.
- Boundary-integrity detector catches dangling quotes/contractions.
- Alias-aware culprit matcher maps full-name/title/surname correctly.

Integration tests:
- Chapter generation path blocks malformed boundary output pre-commit.
- Entity drift triggers targeted retry packet and resolves on retry.

Canary assertions:
- `mechanical_term_collision_count == 0`
- `boundary_integrity_failures_count` non-increasing trend.
- No increase in fair-play false positives from culprit gate alignment.

#### 10.15.8 Observability Schema

Add run-level fields:
- `season_lock_replacements_total`
- `season_lock_protected_collisions_blocked`
- `mechanical_term_collision_count`
- `boundary_integrity_failures_count`
- `semantic_rewrite_diff_blocks_count`
- `entity_pronoun_drift_count`
- `culprit_gate_alias_matches_count`
- `culprit_gate_false_positive_count`

Add trend fields:
- 7-run rolling collision rate for protected terms
- retry-per-chapter trend for integrity-related failures
- side-effect bundle deltas (pronoun, locked_fact, clue_timing, culprit_gate)

#### 10.15.9 Rollback and Contingency Plan

Immediate rollback triggers:
- Any reappearance of protected-collocation mutation in production canary output.
- >15% increase in total retry count without measurable integrity gain.
- >20% increase in cost per accepted chapter due to integrity controls.
- Sustained false positives in culprit gate after alias-aware rollout.

Rollback actions:
1. Disable newest integrity flag family first.
2. Preserve telemetry while control logic is disabled.
3. Re-run E10-1 control to re-baseline.
4. Reintroduce one flag family at a time.

#### 10.15.10 Ownership and Operating Cadence

Recommended ownership:
- Prose runtime owner: WS10-1/WS10-2/WS10-5
- Validation owner: WS10-3/WS10-4/WS10-6
- Canary operations owner: WS10-7/WS10-8

Cadence:
- Daily canary triage during rollout.
- Twice-weekly Stage 10 review against 10.8 metrics and 10.13 decision rule.
- Promotion/rollback decisions logged per run window.

#### 10.15.11 Definition of Done

Stage 10 is complete only when all conditions hold:
1. Collision containment and boundary guards are live (B2+B3+B5+B7).
2. Entity/gate alignment controls are implemented and validated (B8+B9+B10).
3. Regression suite locks corruption patterns and fails on reintroduction (B11).
4. Protected-collocation mutation remains zero across two consecutive run windows.
5. No material regression in pronoun, locked-fact, clue-timing, or cost metrics.
6. All controls are observable, test-covered, and rollback-safe.

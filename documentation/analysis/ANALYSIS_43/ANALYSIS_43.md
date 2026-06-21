# ANALYSIS_43 - Run `1d55f7c7` (story_20260618-0424) Issue Assessment, Grouped by Type and Agent

Status: **assessment + fixes landed (Agent 9 / post-processing / validation); follow-up run `5411ba7f` reviewed (§9); upstream + new lifecycle/pronoun-gate recommendations open**
Run (baseline): `run_1d55f7c7-8bf4-43b7-bbaa-e35e0f01fda2` → `stories/story_20260618-0424/generated_in_scene_batches_10_batch_es_required_.md`
Run (follow-up): `run_5411ba7f-0bb3-40f5-933b-f6839322e1ef` (2026-06-18T21:00) — **aborted**, overall 74/C, prose 60/D — full log review in **§9**.
Source of issues: `stories/story_20260618-0424/chatgpt-review.txt` (52/100) + Agent 9 trace `documentation/prompts/actual/run_20260617-2207_1d55f7c7/`; follow-up run report `apps/api/data/reports/proj_e7702376…/run_5411ba7f….json` + trace `documentation/prompts/actual/run_20260618-2042_5411ba7f/`.

---

## 0. Status Board

| Layer | Issue type | Agent(s) | Status | Where |
|-------|------------|----------|--------|-------|
| A | Schema/clue/test-field verbatim leakage (cause: prompt feeds analytical sentences as "mandatory prose") | 9, 5, 6 | ✅ Fixed (prompt reframing) | `obligation-block.ts`, `prompt-blocks.ts`, `discriminating.ts`, `prompt-builder.ts` |
| B | Premature reveal / dead progressive-disclosure embargo | 9, 5, 7 | ✅ Fixed (embargo re-key + reveal-clue deferral) | `obligation-block.ts` |
| C | Pronoun corruption + setting-metadata leak from deterministic post-processing | 9 (worker), 2, 2c | ✅ Fixed (guards + monotonic sweep + grounding-lead sanitize + name trim) | `agent9-run.ts`, `pronoun-repair.ts`, `sanitization.ts` |
| D | Acceptance gate blind to content leakage / self-downgrading | 9 | ✅ Fixed (verbatim-echo gate + reasoning-leak patterns + honest best-effort) | `control-plane-leakage.ts`, `chapter-validator.ts`, `generate.ts` |
| E | Structural quality: motive depth, proof-chain dramatization, cross-chapter repetition, dialogue voice | 5, 7, 9 | ⏳ Open (recommendations) | upstream agents |
| F | Upstream data hygiene root causes (analytical clue text, malformed location fields, trailing-space names, reveal clue tagged early) | 2, 2c, 5, 6 | ⏳ Open (recommendations) | upstream agents |
| G | (run 5411ba7f) T8 victim-lifecycle/identity slip — dead victim active + victim-name confusion, caught only at terminal abort | 9, 2 | ✅ Fixed (Phase 2: canonical-victim recollection rescue + validator exclusion) | `agent9-run.ts`, `character-lifecycle-validator.ts` |
| H | (run 5411ba7f) Pronoun-gate coverage gap — per-chapter gate missed an LLM-authored male→female mismatch the final validator caught | 9 | ✅ Fixed (Phase 1: re-validate + targeted re-repair after victim/alias mutations) | `agent9-run.ts` |
| I | (run 5411ba7f) Terminal abort on repairable defects — single localizable victim/pronoun issues abort the run instead of targeted repair | 9 | ✅ Fixed (Phase 3: bounded repair cycle → needs_review softening) | `agent9-run.ts` |

KPI: baseline ChatGPT review **52/100** (run 1d55f7c7). Follow-up run **5411ba7f** = overall **74/C / aborted**, prose **60/D**, blocked by 1 critical (victim-alive) + 1 major (pronoun) — but the 1d55f7c7 review-killers (verbatim leakage, setting dump, premature reveal) did **not** recur (§9.3). Closing G/H/I converts 5411ba7f from aborted to a completed corrected story; Layer E/F structural work then lifts toward 80.

> NOTE ON CAST NAMES: the ChatGPT review names "Inspector Harold Finch / Bellingham Manor / Pennington / Clara"; the shipped story is "Inspector Gerald Fox / Wynthorpe Manor / Sir Lionel / Lady Beatrice / Charles / Margaret / Edward Hargrave". ChatGPT renamed the cast. Every failure **mechanism** it describes is genuinely present in the shipped file; ignore the proper-noun mismatch.

---

## 1. Scope

This report assesses the human-visible defects in run `1d55f7c7` and maps each to the exact code that produces it, grouped two ways: by **type of issue** (§3) and by **agent** (§4). It records the fixes already implemented (§5), the upstream-agent fixes still recommended (§6), and the verification status (§7).

The central, non-obvious finding (which an earlier triage missed) is in §2: the two most visible defects — the setting-metadata leak and the pronoun corruption — are **not** produced by the prompt or the LLM. They are produced by **deterministic post-processing in the worker that runs after the model and after validation, with nothing re-validating its output.**

---

## 2. Executive Summary

The review's complaints decompose into four mechanically distinct failure layers plus a structural-quality layer:

1. **Fed-by-prompt leakage (Agent 9 ← Agent 5/6 data).** The prose prompt injects `clue.description`, `clue.pointsTo`, and `discriminating_test.design` as **"mandatory prose elements to surface"**. Those fields are authored as analytical conclusions ("A controlled reenactment demonstrates the grandfather clock's spring tension and hand positions under normal winding versus tampered winding conditions…"; "Eliminates X because… narrowing the solution toward Y"). The model copies them **verbatim** into the prose. The Ch9 prompt fed the controlled-reenactment sentence **5×**; shipped Ch9/Ch10 contain it word-for-word. Worse, the obligation token-matcher **rewards** the copy (100% token match), so leaking was the surest way to *pass* the gate.

2. **Dead progressive-disclosure embargo (Agent 9 ← Agent 5/7).** The per-chapter "CLUE DISCLOSURE RULE" embargo keyed off `currentArcPosition`, whose vocabulary (`opening/early/mid/pre_climax/resolution`) never intersected the `STAGE*_ARC` sets (`investigation/suspect_pressure/testing`), so the embargo silently evaluated to "no embargo" for **every** chapter. Combined with a reveal clue that Agent 5 tagged `placement:'early'`, the full culprit + method + magnitude were forced into Chapter 3 and then re-stated across 8 chapters.

3. **Deterministic post-processing corruption (Agent 9 worker).** `buildDeterministicGroundingLead` interpolated raw, malformed location fields into a sentence template and prepended it after all retries (the Ch2 "…Wynthorpe Manor - Library in Wynthorpe Village, Northumberland, England; … a quiet tension underlies the cozy setting cast" leak). Separately, `applyDeterministicPronounSweep`'s cross-paragraph inheritance rewrote already-correct female pronouns to male on a split paragraph. Neither output was re-validated.

4. **Acceptance-gate blindness (Agent 9).** No validator compared prose against the strings that were fed, and the control-plane leakage detector matched only harness *vocabulary*, not leaked schema *content* or outline-reasoning. The best-effort path silently downgraded residual critical/major issues to warnings — so all of the above shipped under a header that admits "10 batch(es) required retry for validation".

5. **Structural quality (Agent 5/7/9).** Mechanism over-disclosed in Ch1; abrupt confession; under-developed motive; suspects under-differentiated; cross-chapter re-description of the same clue. Largely design/prompt work, partly enabled by clue distribution.

Layers 1–4 are fixed in this session (§5). Layer 5 and the upstream data-hygiene root causes (§6) are recommendations.

---

## 3. Findings Grouped by Type of Issue

### T1 — Control-plane / schema-field verbatim leakage — P0
- **Symptom:** analytical schema sentences appear as narration. Shipped Ch9: *"…A controlled reenactment demonstrates the grandfather clock's spring tension and hand positions under normal winding versus tampered winding conditions, using the found winding key and clock mechanism…"*. Shipped Ch8: *"Eliminates Charles Wynthorpe because stable logs… narrowing the solution toward Lady Beatrice Wynthorpe."*, *"The direct evidence links Lady Beatrice Wynthorpe to the mechanism access point before the discriminating test and excludes competing suspect timelines."*
- **Mechanism:** fed-by-prompt (confirmed in `35_..Ch9_request.md`). `obligation-block.ts` emits `clue.description`/`pointsTo` under "mandatory prose elements"; `discriminating_test.design` injected at 3 sites with no "do not copy" framing; the NSD investigation log re-feeds the descriptions a third time.
- **Gate gap:** no verbatim-echo validator existed; `detectControlPlaneLeakage` matched only `validator/retry/fallback/Setting:`; obligation token-matcher rewards the copy.
- **Fix:** Layer A (reframe) + Layer D1/D2 (echo gate + reasoning-leak patterns). ✅

### T2 — Setting / location metadata leakage — P0
- **Symptom (Ch2):** *"The overcast with intermittent drizzle typical of english countryside had settled over Wynthorpe Manor - Library in Wynthorpe Village, Northumberland, England; soft page rustling, and smooth oak desk surface gave the room a quiet tension underlies the cozy setting cast that refused to lift."*
- **Mechanism:** **code-built**, not LLM. `buildDeterministicGroundingLead` (worker `agent9-run.ts`) interpolated raw `atmosphere.mood`/`weather` (multi-clause, verb-bearing) and the full `Name - Sublocation in Place, Region, Country` chain into a template, prepended by `applyDeterministicProsePostProcessing` **after** all LLM retries — never seen by any lint/leakage check.
- **Fix:** Layer C4 (field sanitization + malformed-output fallback). ✅

### T3 — Pronoun drift / gender corruption — P0
- **Symptom:** Lady Beatrice → "He/his"; Margaret → "his uniform / his apron / asked his to recount his movements"; Fox → "She turned to Lady Beatrice"; dialogue about a male victim → "I brought her her tea… She wished".
- **Mechanism:** the LLM output was largely **correct**; the corruption is post-generation. (a) `applyDeterministicPronounSweep` cross-paragraph inheritance flipped a correct female run to male on a split paragraph; (b) the single-named-character heuristic flips a leading subject pronoun when the named character is the *object* ("He turned to Lady Beatrice") or the perceived object ("Fox saw her fingers"); (c) a trailing space in the cast name `"Margaret "` (from Agent 2 / store.json) made her unmatchable so her sentences inherited the prior male subject.
- **Fix:** Layer C1/C2/C3 (monotonic sweep, name trim, referent-safety guards, dialogue masking). ✅

### T4 — Premature reveal / progressive-disclosure failure — P0
- **Symptom:** culprit + mechanism + "forty minutes" forced into Ch3 paragraphs 1–2 and repeated through the climax; Ch1 already over-discloses the tampering.
- **Mechanism:** dead embargo (keyed off the wrong vocabulary) + reveal clue tagged `placement:'early'` force-pinned with a "Paragraph 2: reason about who it implicates" directive + spoiler ban hardcoded to `chapterNumber<=2`.
- **Fix:** Layer B1/B2/B3 (embargo re-keyed off `currentStageMode`; reveal-class clues embargoed in pre-reveal chapters; spoiler ban driven off the embargo stage). ✅

### T5 — Late-chapter collapse / degraded fallback acceptance — P1
- **Symptom:** Ch8–9 degrade into summary/outline + repeated location fragments; header admits "10 batches required retry" yet ships.
- **Mechanism:** best-attempt/completion-first path re-validates then **downgrades** residual critical/major issues to warnings (`generate.ts`), so a leaky/degraded late chapter is committed.
- **Fix:** Layer D3 (design-echo runs inside the validator so the fallback re-check catches it; best-effort leakage residuals now logged distinctly as `BEST-EFFORT COMMIT WITH UNRESOLVED LEAKAGE` instead of silently buried). Partial — see §6 (E) for the durable severity-partition follow-up. ⏳

### T6 — Acceptance-gate blindness — P1
- **Symptom:** defective prose passes despite retries.
- **Mechanism:** no content-aware leakage check; vocabulary-only detector; token-matcher rewards verbatim copy.
- **Fix:** Layer D1/D2 (name-agnostic ≥12-consecutive-word echo gate wired to `hardErrors` retry path; schema-reasoning patterns at `major` severity). ✅

### T7 — Structural quality (motive, proof-chain, repetition, dialogue voice) — P2
- **Symptom:** abrupt confession; weak/under-dramatized proof chain; under-developed financial/legal motive; suspects sound alike; Ch2 re-describes Ch1's clock; placeholder detective dialogue ("Your alibi must hold up under scrutiny").
- **Mechanism:** design-level — clue distribution, outline weighting, and prompt craft, not a single code defect. No cross-chapter semantic-dedup validator (only exact-paragraph + n-gram).
- **Fix:** open — see §6 (E). ⏳

---

## 4. Findings Grouped by Agent

### Agent 9 — Prose Generator + worker post-processing (primary)
The bulk of the defects originate or surface here.
- **Prompt layer** (`packages/prompts-llm/src/agent9-prose/`): T1 (clue/design injection framing), T4 (dead embargo, reveal-clue early-pin), T6 (no echo gate). Fixed: A1–A3, B1–B3, D1–D2.
- **Worker post-processing** (`apps/worker/src/jobs/agents/agent9-run.ts`): T2 (grounding-lead field dump), T3 (pronoun sweep corruption). Fixed: C1, C3, C4.
- **Acceptance gate** (`generate.ts`): T5/T6 (downgrade-on-exhaustion, vocabulary-only leakage). Fixed: D1/D3; durable severity-partition follow-up open.

### Agent 2 — Cast Designer (data hygiene → T3)
- `store.json` persists a cast name with a trailing space (`"Margaret "`), which defeats name matching in pronoun repair and character-consistency validation.
- **Recommended:** trim character names at emission (Agent 2) so the defect cannot re-enter the pipeline. Defensive ingestion trim already added downstream (C2), but the source should also be fixed.

### Agent 2c — Location Profiles (data hygiene → T2)
- Emits multi-clause, verb-bearing `atmosphere.mood`/`weather` values (e.g. "quiet tension underlies the cozy setting"; "overcast with intermittent drizzle typical of english countryside") that are unsafe to interpolate into prose templates.
- **Recommended:** constrain mood/weather to short adjective phrases (no finite verbs, single clause) at Agent 2c. C4 now sanitizes defensively at the injector, but clean source data removes the need for the fallback.

### Agent 5 — Clue Extraction (root cause of T1 + T4)
- Authors `clue.description`/`pointsTo` as **analytical conclusions** ("Eliminates X because…", "Direct evidence links… excludes competing suspect timelines") rather than observable evidence — the text Agent 9 transcribed.
- Tags the culprit+mechanism reveal clue with `placement:'early'`, force-distributing the full solution into an early chapter.
- **Recommended:** (a) author clue descriptions as on-page *observations*, keeping the inference in a separate non-prose `pointsTo`; (b) never tag a culprit-naming / full-mechanism clue `placement:'early'`. A1/A2 + B2 now contain the blast radius at the prompt/validator boundary regardless.

### Agent 6 — Fair-Play (root cause of T1)
- `discriminating_test.design` is authored as a single analytical sentence intended to be "rendered", which the model copies verbatim.
- **Recommended:** store the design as discrete beats (setup / action / observable result) rather than one quotable sentence. A1 now frames it as paraphrase-only at every injection site.

### Agent 7 — Narrative Outline (contributes to T4/T5/T7)
- Chapter weighting lets late chapters (8–9) carry disproportionate unsatisfiable load; reveal pacing is not explicitly staged before the discriminating-test scene.
- **Recommended:** stage-aware chapter obligations and an explicit pre-reveal/reveal boundary in the outline so the embargo (B1) and reveal-clue deferral (B2) have an authoritative coordinate rather than a 70%-of-story heuristic.

---

## 5. Fixes Implemented This Session

All changes typecheck clean and are covered by regression tests built from the shipped story's exact strings.

**Layer C — deterministic post-processing (worker + story-validation)**
- C1 — `applyDeterministicPronounSweep` made monotonic: reverts any chapter whose sweep increases gender mismatches (`agent9-run.ts`, `countChapterPronounMismatches`).
- C2 — trailing-space cast names trimmed in `buildCharacterInfo` (`pronoun-repair.ts`) + `normalizeProseCastOrThrow` (`sanitization.ts`).
- C3 — referent-safety guards in `pronoun-repair.ts`: object-referent ("He turned to <Name>"), perception ("Fox saw her fingers"), mixed-gender, dialogue-span masking, and a self-consistent opposite-gender-run guard for cross-paragraph inheritance.
- C4 — `buildDeterministicGroundingLead` sanitizes mood/weather/location fields and falls back to a field-free safe lead if the assembled line is still malformed (`agent9-run.ts`).

**Layer D — acceptance gate (story-validation + prompts-llm)**
- D1 — `detectVerbatimFieldEcho` (name-agnostic ≥12-consecutive-word match vs fed `clue.description`/`pointsTo`/`discriminating_test.design`) wired into the per-chapter `hardErrors` retry path (`control-plane-leakage.ts`, `generate.ts`).
- D2 — schema/outline-reasoning leakage patterns (`reasoning_leak_*`) at `contextual`/`major` so they force a retry without a hard mid-generation abort (`control-plane-leakage.ts`).
- D3 — design-echo check inside `ChapterValidator` (covers the best-effort fallback path); best-effort commits surface leakage residuals distinctly (`chapter-validator.ts`, `generate.ts`).

**Layer A — prompt reframing (prompts-llm)**
- A1 — shared `describeDtMechanismForPrompt` ("paraphrase, do NOT copy — verbatim FAILS validation") at all 3 design-injection sites (`discriminating.ts`, `obligation-block.ts`, `prompt-blocks.ts`).
- A2 — clue-obligation header reframed to "dramatize in YOUR OWN WORDS; copying a description FAILS validation" (`obligation-block.ts`).
- A3 — NSD investigation log feeds short reference topics, labeled "reference only — do NOT restate or quote" (`prompt-builder.ts`).

**Layer B — progressive disclosure (prompts-llm, `obligation-block.ts`)**
- B1 — embargo re-keyed off `currentStageMode` (`STAGE_MODE_EMBARGO_TIER`), unknown modes default to the restrictive tier; reveal modes mapped to no-embargo.
- B2 — reveal-class clues (`isRevealClue`) embargoed in pre-reveal chapters: observation stays early (validator `isEarlyEnough` still passes — no infinite-retry), the "who it implicates" reasoning + spoiler `pointsTo` are suppressed.
- B3 — mechanism spoiler ban driven off the embargo stage (`clueStageForRun <= 2`) instead of hardcoded `chapterNumber<=2`.

**Test coverage added:** `pronoun-repair.test.ts` (+7 guards), `control-plane-leakage.test.ts` (+7 echo/patterns), `agent9-deterministic-postprocess.test.ts` (+3 worker post-process), `agent9-prose.test.ts` (+5 A/B). Suites green: story-validation 232, prompts-llm 307, worker 168.

---

## 6. Recommended (Not Yet Implemented)

**(E) Acceptance-gate durable hardening (Agent 9)** — partition best-effort residuals into hard (leakage/echo/stage-mode/victim-alive) vs cosmetic; run one bounded targeted scrub on hard residuals before commit; propagate an honest "committed with N unrepaired hard issues" flag into the story header rather than the misleading "10 batches required retry". (Deliberately *not* a hard abort — that risks "ships nothing".)

**(E) Cross-chapter semantic de-duplication (Agent 9 / story-validation)** — a clue/fact ledger that flags re-anchoring the same beat as a standalone descriptive opener in 3+ later chapters, with callback/recap exemptions, warn-only first.

**(F) Upstream data hygiene** — Agent 2 (trim names at emission), Agent 2c (short adjective mood/weather), Agent 5 (observational clue descriptions; never tag culprit/mechanism clues `placement:'early'`), Agent 6 (design as discrete beats), Agent 7 (explicit reveal-boundary coordinate). These remove the *cause*; A/B/C/D currently contain the *blast radius*.

**(E) Structural style (Agent 7/9)** — motive depth (financial/legal), step-by-step proof-chain dramatization in the reveal, suspect voice differentiation, sharper detective dialogue. Tracks ANALYSIS_42 §9 "road to 80/100".

---

## 7. Verification Plan / Status

- ✅ Unit + regression suites green (story-validation 232, prompts-llm 307, worker 168); both packages `tsc --noEmit` clean; dist rebuilt (story-validation, prompts-llm, worker).
- ⏳ **Pending: one end-to-end run.** Confirm on the next run: (1) no ≥12-word verbatim clue/test echo in any chapter; (2) no `Eliminates…/narrowing the solution/mechanism access point` outline sentences; (3) no malformed setting opener; (4) correct pronouns for all female characters; (5) early chapters read as "two sources disagree" with no named culprit/method/magnitude before the reveal. Watch logs for `applyDeterministicPronounSweep: reverted N chapter(s)` and `BEST-EFFORT COMMIT WITH UNRESOLVED LEAKAGE`.

---

## 8. Decision Summary

- The leakage and pronoun defects had two root locations the earlier triage conflated: the **prompt** (analytical fields fed as prose) and the **post-LLM deterministic processing** (grounding-lead + pronoun sweep). Both are now addressed, plus a content-aware acceptance gate so regressions are caught automatically.
- The premature-reveal defect was a **dead-code embargo** keyed off the wrong vocabulary; re-keying it off the controlled stage mode revives progressive disclosure, and reveal-class clues are deferred without breaking the early-placement validator.
- Remaining work is upstream data hygiene (Agents 2/2c/5/6/7) to remove the causes, plus structural-style improvements to move the ChatGPT review from ~65–70 toward 80.

---

## 9. Follow-up Run `5411ba7f` (2026-06-18T21:00) — Full Log Review

Reviewed: report JSON `apps/api/data/reports/proj_e7702376…/run_5411ba7f….json` (250 KB) and the full prompt/response trace `documentation/prompts/actual/run_20260618-2042_5411ba7f/` (99 files).

**Outcome:** `aborted` — "Story validation failed: 1 critical, 1 major issues". Overall **74/C** (`passed:false`). 13/14 phases passed; the failing phase is **Prose Generation 60/D**. Cost $0.39, duration ~18 min.

> CAVEAT: this run was generated at 21:00, overlapping the Layer A–D dist rebuilds; with Node module caching the worker most likely used the dist as of process start, so this run is **not a clean validation** of the fixes. The leakage/reveal *absence* below is suggestive, not confirmed — re-run after a clean rebuild + worker restart to confirm.

### 9.1 Blocking issues (caused the abort) — both Agent 9

| # | Severity | Type | Agent | Scene | Detail |
|---|----------|------|-------|-------|--------|
| R1 | critical | **T8 character-lifecycle / victim continuity** (NEW) | 9 | Ch3 | `victim_reappears_alive`: canonical victim **Eleanor Shaw** (dead/established by Ch1) is given active dialogue/action in Ch3. Compounded by a **victim-identity confusion** — the cast carries both `Eleanor Shaw` (victim) and `Edward Langford`, and the prose narrates "Edward Langford's stabbing", i.e. the prose is unstable about who the victim is. Not covered by Layers A–D. |
| R2 | major | **T3 pronoun (male→female)** | 9 | Ch5 | `pronoun_gender_mismatch`: **Thomas Bennett** (male) written with `she, her`. Note the *direction*: this is male→female, distinct from the female→male deterministic-sweep corruption fixed in C3. The per-chapter gate (`entity_pronoun_drift_count: 0`) **missed** it; only the final `ProseConsistencyValidator` caught it → a per-chapter pronoun-gate coverage gap. |

### 9.2 Quality / process signals

- **Prose 60/D, below threshold** → phase failed (`failure_reasons: ["agent9-prose: Score below threshold"]`).
- **Convergence churn:** all 10 batches retried; `batch_failure_events: 14`. Gates are firing (good), but the model did not converge on R1/R2 within the retry budget, and the run reached terminal validation with them unresolved.
- **Template linter:** `template_linter_failed_checks: 22 / 28 run`. Category breakdown is mostly clean (opening_style_entropy 0, paragraph_fingerprint 0, ngram_overlap **1**, boundary_integrity 0), so the 22 are non-fingerprint checks (clearance/structure). **`phrase_telemetry_recurring_phrase_count: 15`** → T7 repetition persists.
- **Underflow:** `underflow_preferred_target_misses: 5`; `rewrite_pass_count: 0`, `repair_pass_count: 0`, `underflow_expansion_attempts: 0` — no rewrite/repair/expansion passes ran.
- **Upstream phase scores (F — data hygiene):** Cast Design **88/B** and Location Profiles **90/A** are the lowest non-prose phases — consistent with §4's Agent 2 / Agent 2c findings.
- **Agent 3 CML (proof traceability):** diagnostic `evidence_clue_backfill` injected 3 clues (`clue_mechanism_visibility_core`, `clue_pendulum_angle`, `clue_10`) because `discriminating_test.evidence_clues` was **missing essential clue IDs**. Agent 3/3b should emit a complete evidence_clues set so the backfill is not needed.

### 9.3 Regression check — classes that did NOT recur (suggestive, see caveat)

- **T1 verbatim schema/clue/test leakage: 0** matches across all prose responses (the controlled-reenactment / "Eliminates X…/narrowing the solution/mechanism access point/excludes competing timelines" sentences). The 1d55f7c7 run had the design sentence verbatim 5×.
- **T2 setting-metadata dump: not in prose** — the `… - … in …, …, England;` / "underlies the cozy setting" markers appear only in upstream agent metadata (Agent 1/2c/65 source fields), not in the generated chapters.
- **T4 premature reveal:** `fair_play_no_solution_spoilers: true`, `fair_play_component_score: 100`; `clue_visibility_missing_expected_ids: []` (29/29 visible). No premature-reveal spoiler flagged.

### 9.4 New / updated recommendations from this run

- **(G) Per-chapter victim-lifecycle + victim-identity gate (Agent 9).** `victim_reappears_alive` is only caught at final validation (terminal abort), not during per-chapter generation/repair. Add a per-chapter victim-alive + victim-name-lock check into the obligation/gate path so it triggers a targeted retry/repair instead of aborting the whole run. Separately investigate the Eleanor Shaw vs Edward Langford victim confusion (Agent 2 cast role clarity + Agent 9 victim-identity lock).
- **(H) Align the per-chapter pronoun gate with the final validator.** The per-chapter `entity_pronoun_drift` gate missed a male→female mismatch the final `ProseConsistencyValidator` caught. Run the same detector at the per-chapter commit point so mismatches are repaired/retried before commit rather than surfacing as a terminal abort. (Complements C1–C3, which protect the female→male *deterministic* path; R2 is an *LLM-authored* male→female miss that survived repair.)
- **(I) Reduce terminal aborts on repairable issues.** R1 and R2 are both single, localizable, deterministically-repairable defects (victim role alias, one character's pronouns). Wire them into the targeted-repair path (like the existing victim/pronoun sweeps) so the run completes a corrected story instead of aborting at 74/C.
- **(F, reaffirmed) Agent 3/3b** should emit complete `discriminating_test.evidence_clues`; **Agent 2** cast should not carry two near-victim identities without a clear single victim role.

### 9.5 Net assessment

The dominant 1d55f7c7 defects (verbatim leakage, setting dump, premature reveal) did not appear in this run's logs. The two issues that aborted it are a **different, narrower class** — a victim-lifecycle/identity slip (R1) and a single male→female pronoun miss (R2) — both deterministically repairable and currently routed to a terminal abort rather than a targeted repair. Closing recommendations (G)/(H)/(I) would convert this exact run from `aborted 74/C` to a completed, corrected story, and (F) attacks the upstream cause.

---

## 10. Phased Deployment Plan (G / H / I, then F / E)

### 10.0 Grounding — why R1/R2 abort today (exact code)

The worker already runs a post-generation validate→repair→re-validate sequence (`apps/worker/src/jobs/agents/agent9-run.ts:4101–4195`) and then a single status gate (`:4327–4444`). The gaps:

- **R1 (canonical victim alive) is structurally unrepairable.** `applyVictimReappearanceRescue` (`agent9-run.ts:1555`) repairs only *non-victim* death-attributions and **explicitly skips canonical victim names** (`:4178`). A *canonical* victim given active dialogue/action is detected (`victim_reappears_alive`) but never repaired → survives as critical → abort.
- **R2 (pronoun) reveals a validator-parity + ordering gap.** The per-chapter generation gate reported `entity_pronoun_drift_count: 0`, but the final `StoryValidationPipeline` reported the mismatch. The targeted pronoun sweep (`:4145`) runs *before* the victim-rescue (`:4162`) and role-alias substitution (`:4138`) mutate the prose, and pronouns are **not re-validated/re-repaired after** those mutations.
- **The abort is one branch.** `:4327` `status==="passed"` → pass; `"needs_review"` → warn + save; `else` (any critical) → `throw` (`:4442`). There is no "the only residuals are deterministically repairable → repair instead of abort" path.

### 10.1 Deployment mechanics (every phase)

1. Implement behind a `rollout_flags` entry (the repo already uses `agent9_prose.rollout_flags`, `integrity_rollout_*`, `phrase_rollout_*`). **Default = warn-only/telemetry.**
2. Build in dependency order: `story-validation` → `prompts-llm` → `worker` (`tsc` each).
3. **Restart the worker process.** Node caches `require`d dist modules — a running worker will not pick up rebuilt packages (this is why run 5411ba7f overlapping the build was not a clean test).
4. Manual run; compare the phase-specific report diagnostics.
5. Promote the flag warn-only → enforce once the run confirms a low false-positive rate.
6. **Rollback = flip the flag off** (no logic redeploy).

### 10.2 Phase 0 — Pre-flight & instrumentation (no behavior change; ~0.5 day)

- Add three flags (default warn/off): `victim_alive_repair_enabled`, `pronoun_gate_parity_enabled`, `repairable_abort_softening_enabled`.
- Telemetry: per run, record (a) which final validation issues are in the deterministically-repairable set vs not; (b) the per-chapter-gate-vs-final-validator pronoun delta (the 0-vs-1 disagreement).
- Files: `generation-params.yaml` (rollout flags), `agent9-run.ts` (telemetry upserts).
- Verify: run; confirm telemetry populates. **Risk: none.**

### 10.3 Phase 1 — H: pronoun-gate parity + repair coverage (addresses R2; ~1–1.5 days, low risk)

- **1a Detection parity** — run the final `ProseConsistencyValidator` pronoun-drift detector at the per-chapter commit point in `packages/prompts-llm/src/agent9-prose/generate.ts`, so a mismatch is caught during generation (full retry budget) instead of only at the terminal gate. Warn-only via `pronoun_gate_parity_enabled`, then feed into the existing per-chapter pronoun feedback.
- **1b Repair ordering** — in `agent9-run.ts`, add a final pronoun re-validate + targeted sweep **after** victim-rescue (`:4162`) and role-alias substitution (`:4138`), not only before.
- **1c Deterministic-fail backstop** — when targeted repair leaves a residual `pronoun_gender_mismatch`, issue a bounded single-sentence LLM micro-repair for the flagged scene (flag-gated; cost-bounded).
- Files: `prompts-llm/generate.ts`, `story-validation/pronoun-repair.ts` + `prose-consistency-validator.ts`, `worker/agent9-run.ts`.
- Verify: unit test the parity detector + reorder; run; confirm per-chapter and final pronoun counts agree and an R2-style mismatch is repaired (not aborted).
- **Risk: low** (1c adds cost/nondeterminism → single sentence, flag-gated).

### 10.4 Phase 2 — G: canonical-victim-alive repair + identity lock (addresses R1; ~1.5–2 days, medium risk)

- **2a Canonical-victim repair (new)** — add `repairVictimActiveAppearance` for `victim_reappears_alive` on the *canonical* victim: neutralize the victim's active dialogue/action (reattribute to recollection/flashback framing, or strip the active beat). This is the missing counterpart to `applyVictimReappearanceRescue` (non-victim only). Wire into the `:4162` repair path. Warn-only telemetry first, then enforce via `victim_alive_repair_enabled`.
- **2b Victim-identity lock** — typed check for victim-name drift (Eleanor Shaw vs Edward Langford) in `character-lifecycle-validator.ts`, plus a victim-name lock in `obligation-block.ts`; route drift to repair, not abort.
- **2c Upstream (Agent 2)** — cast-design guard so exactly one character carries the victim role and there are no two near-victim identities (`agent2-run.ts`).
- Files: `worker/agent9-run.ts`, `story-validation/character-lifecycle-validator.ts`, `prompts-llm/obligation-block.ts`, `worker/agent2-run.ts`.
- Verify: unit test the repair on a synthetic "dead victim speaks" chapter; run; confirm R1-class repaired with no false reattribution of legitimate victim flashbacks.
- **Risk: medium** (false positives on a legitimate memory of the victim) → conservative detection + warn-only first.

### 10.5 Phase 3 — I: convert repairable aborts to completed-with-repair (depends on 1+2; ~1 day, medium-high risk)

- Intervention at `agent9-run.ts:4327–4444`. Before the `else`-throw, classify residual critical/major: if **all** are in the deterministically-repairable allowlist (`victim_reappears_alive`, `pronoun_*`, `locked_fact_*`, `suspect_closure_missing`, `culprit_evidence_chain_missing`) **and** a repair pass already ran, execute **one** more bounded targeted-repair cycle → re-validate → if clean continue; if a residual repairable issue remains, downgrade to `needs_review` (output saved) with an honest telemetry flag. **Keep the hard abort** for genuinely non-repairable criticals (CML integrity, encoding corruption, structural completeness, fair-play).
- Flag `repairable_abort_softening_enabled`; warn-only first ("would have softened") to confirm the allowlist is safe, then enable.
- Files: `worker/agent9-run.ts` (status decision + final repair cycle).
- Verify: run R1/R2-style cases → complete instead of abort; inject a genuine non-repairable critical → still aborts.
- **Risk: medium-high** (could ship an imperfect story). Mitigations: strict repairable-type allowlist, require a prior repair attempt, honest telemetry, keep hard abort for non-repairable.

### 10.6 Phase 4 — F: upstream data hygiene (parallel with 1–3; low risk each; ~0.5 day per agent)

- **Agent 2** (`agent2-run.ts`): trim names at emission; victim-role uniqueness (overlaps 2c). Removes the trailing-space root cause C2 patches defensively.
- **Agent 2c** (`agent2c-run.ts`): constrain `atmosphere.mood`/`weather` to short adjective phrases (no finite verbs / multi-clause). Removes the need for C4's defensive fallback.
- **Agent 5** (`agent5-run.ts` / prompts): author `clue.description` as on-page observations (keep inference in `pointsTo`); never tag a culprit/mechanism clue `placement:'early'`. Removes the condition that makes B2's deferral fire.
- **Agent 6**: store `discriminating_test.design` as discrete beats (reinforces A1).
- **Agent 3/3b**: emit a complete `discriminating_test.evidence_clues` set (removes the `evidence_clue_backfill` diagnostic).
- Verify each via its phase score (Cast 88→, Location 90→) and the disappearance of the corresponding diagnostic. **Independent of 1–3; ship piecemeal.**

### 10.7 Phase 5 — E: structural quality + durable gate (last; prompt/scoring work)

- Cross-chapter semantic-dedup validator (warn-only first) — targets the 15 recurring phrases / repeated-beat problem.
- Acceptance-gate severity-partition (the deferred D follow-up from §6).
- Motive depth (financial/legal), step-by-step proof-chain dramatization, suspect/detective voice differentiation — prompt + outline work (Agents 7/9). Tracks ANALYSIS_42 §9 "road to 80/100".

### 10.8 Sequencing & dependency graph

```
Phase 0 (instrumentation)
   |- Phase 1 (H pronoun)  -\
   |- Phase 2 (G victim)   --+-> Phase 3 (I abort-softening)
   \- Phase 4 (F upstream) -- independent, parallel --> (reduces load on 1-3)
                                                         Phase 5 (E structural) -- last
```

- 1 and 2 are independent (pronoun vs victim) and can proceed in parallel.
- 3 strictly depends on 1+2 (it invokes their repairs).
- 4 is independent of 1–3 and attacks the upstream causes; parallel running lowers how often 1–3 must fire.
- 5 is deferred until the run reliably completes.

### 10.9 Definition of done

- Re-running the 5411ba7f scenario completes (no terminal abort) with 0 residual `victim_reappears_alive` and 0 residual `pronoun_gender_mismatch`; a genuine non-repairable critical still aborts (Phase 3 guardrail intact).
- Per-chapter pronoun gate and final pipeline agree (no 0-vs-1 disagreement).
- Upstream phase scores rise (Cast > 88, Location > 90) and the `evidence_clue_backfill` diagnostic disappears (Phase 4).
- All package suites green after each phase; each phase independently rollback-able via its flag.

### 10.10 Implementation status

**Landed (Phases 0–3 — the run-unblockers; all suites green, all packages built):**

- **Phase 0** — three rollout flags plumbed (`pronoun_gate_parity_enabled`, `victim_alive_repair_enabled`, `repairable_abort_softening_enabled`), default enabled, in `generation-params.ts` (type + default + merge) and `generation-params.yaml`.
- **Phase 1 (H)** — `agent9-run.ts`: a final pronoun re-validate + targeted re-repair now runs **after** the victim-rescue and role-alias mutations (gated by `pronoun_gate_parity_enabled`), closing the ordering gap that left R2 unrepaired.
- **Phase 2 (G)** — new `applyCanonicalVictimRescue` (`agent9-run.ts`) reframes a canonical victim's active sentences in post-death chapters as recollection (`"In a remembered moment, …"`); the lifecycle validator (`character-lifecycle-validator.ts`) now excludes start-anchored recollection frames (`RECOLLECTION_FRAME_RE`) so the reframed sentence clears `victim_reappears_alive`. Wired into the post-gen repair path behind `victim_alive_repair_enabled`.
- **Phase 3 (I)** — `agent9-run.ts`: before the hard-abort throw, when **every** residual critical/major issue is in the repairable allowlist, run one more bounded repair cycle; if a repairable residual remains, downgrade `failed → needs_review` (output saved, `story_validation_softened` diagnostic) instead of aborting. Genuinely non-repairable criticals still abort. Behind `repairable_abort_softening_enabled`.
- **Tests:** `agent9-locked-facts.test.ts` (+ canonical-victim rescue, incl. end-to-end validator clearing) and the validator exclusion; suites green — story-validation 232, worker 167, prompts-llm 307.

**Deferred (Phases 4–5):**

- **Phase 4 (F upstream hygiene)** — not yet implemented. Rationale: these are independent per-agent changes, and the issues are already *defensively contained* downstream (B2 defers reveal clues even if Agent 5 tags them `early`; C2 trims names; C4 sanitizes mood/weather). Agent 5's clue-placement demotion in particular needs the always-run finalization path mapped before mutating distribution (the conditional `rebuildClueTimelineFromPlacements` is not it). Lower risk to land separately than to mutate clue distribution half-understood.
- **Phase 5 (E structural)** — deferred as planned (prompt/scoring work) until runs reliably complete.

**Deployment note:** all three dist packages rebuilt (story-validation, prompts-llm, worker). A run must restart the worker process to pick up the new dist (module caching).

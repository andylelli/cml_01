# ANALYSIS_56 — Agents 1–8: the consolidated "what's left" register + implementation line

Status: **planning / source-of-truth for the upstream (1–8) cleanup.** This doc reconciles the entire backlog scattered across A_47 (ROADMAP_TO_80/90), A_50, A_51, A_52, A_53, A_54, A_55 against the **current code**, and draws the line on what we implement next. It supersedes the per-doc "open items" lists for tracking agents 1–8.

> **Method (provenance).** Built from a 19-agent verification workflow (`wpfelvx8x` / `wf_6f48114a-d88`): 10 parallel extractors pulled **240 candidate items** from the six analysis docs + both roadmaps + a code-marker scan; then one verifier per agent (1–8 + cross-cutting) **checked each candidate against the live code** (Grep/Read), classifying it `done-but-undocumented` / `open` / `partial` / `stale`. Only `open` and `partial` items survive into this register.

---

## 0. Headline

**The docs badly lag the code.** Of 240 candidate items, the large majority verified as **already implemented** (the A_53 P-fixes, A_50/51 K1/K2 keystones, most Pillars 1–4 wiring). Agents **1–6 are in good shape** — their per-agent *defect* work is essentially done. The genuinely-remaining surface is small and clusters into **four themes**:

1. **Flip the gates that are built-but-OFF** (largest cluster of cheap wins — code exists, tested, behind a default-OFF flag; needs a *measured* enable, not new code).
2. **Agent 8 (novelty) is the one agent with real unfinished feature work** — the deterministic judge is built but never wired.
3. **Agent 7 beat-scheduler authority + the G4 scheduler root** — the big pacing lever (a design decision) plus the invariant contradiction A_55 §2.5 found.
4. **Cross-cutting hygiene + the craft ceiling** — matcher rollout, repair-or-warn consolidation, mutation→re-validate; plus the strategic ceiling (stronger generator, real critique→rewrite, judge re-calibration) which is Agent-9/research-tier and **out of scope for 1–8**.

### Already closed by A_55 (today) — correct the older docs
Three items the scoped verifiers still listed as open/partial are **already done** by today's A_55 prose-gate work (they live in `packages/prompts-llm/src/agent9-prose/generate.ts`, outside the agent-1–8 file scopes the verifiers searched):

| A_55 item | Was listed open under | Now |
|---|---|---|
| #2 mechanism-leak **enforced** at pre-commit (mirrors rubric `resolveMechanismExplainedChapter`, gated to pre-test stage modes) | Agent 7 ("gate advisory-only") | **DONE** |
| #4 completion-first best-attempt **severity-aware** (structural×1000 + total) | Agent 3 ("count-only") | **DONE** |
| #3b victim active-after-death **pre-commit gate functional** (past-tense verb fix in `detectVictimAlive`) | Agent 2 ("post-hoc only") | **DONE** |
| #5 G4 outline guarantee (`ensureDiscriminatingTestEvidencePresent`) | Agent 7 ("G4 gap") | **outline half DONE**; scheduler root still open (see 7-G4) |
| #1 rubric parser false-zero + #3a culprit-near-death FP | scoring / Agent 2 | **DONE (A_55/A_54)** |

---

## 1. Per-agent register (genuinely open / partial only)

Priority = impact on the K2 final-story rubric. Effort = S/M/L. Evidence = current-code citation from the verification pass.

### Agent 1 — Era & Setting Refiner  *(state: ✅ solid)*
| # | Item | Pri | Eff | Next action | Evidence |
|---|---|---|---|---|---|
| 1-A | **Atmosphere never reaches Agent 9.** `ctx.setting.atmosphere` is generated but never piped into the prose prompt; 2c's atmosphere wins (autumn→summer flip). | High | M | Thread `ctx.setting.atmosphere` → orchestrator → Agent 9 atmospheric-context block (time+weather+mood). | `agent1-run.ts:60`; `agent9-run.ts` never reads it |
| 1-B | **No Agent1↔2d season/time contract.** Scorer grades a fabricated adapter; timeOfDay can contradict 2d's month-derived season. | Med | S | Deterministic contract enforcer after 2d locks season from month; fail loudly on contradiction. | `ANALYSIS_50.md:69`; 2d-run season lock |
| 1-C | **Victim-unnamed guard only fires when `role:victim` exists.** Non-role-victim (M2 promotion) paths are unguarded. | Med | S | Fire the prose-side victim-name check whenever a victim name resolves (CASE or promotion), not gated on the role field. | `clue-validation.ts:935-950`; `rubric-score/facts.ts:102` |

### Agent 2 — Cast + 2b/2c/2d/2e  *(state: ✅ well-engineered)*
| # | Item | Pri | Eff | Next action | Evidence |
|---|---|---|---|---|---|
| 2-A | **Built-but-OFF deterministic gates** (telemetry/shadow): `AGENT2_CAST_CHECK`, `AGENT2B_VOICE_CHECK=enforce`, `AGENT2C_SPINE_CHECK`, `AGENT2C_SCENE_GATE=enforce`, `AGENT2E_DERIVE_BACKGROUND`, `AGENT2_CONSTRAINED_CAST`. | High | M | **Theme 1** — exercise each in shadow, then A/B before flipping default. Code is done. | `agent2-run.ts:840-858`; `agent2b-run.ts:92-141`; `agent2c-run.ts:208-327`; `agent2e-run.ts:115-165` |
| 2-B | **Final culprit-count minimum not enforced** (only `Math.min(3,…)` cap; checker warns only). | Low | S | After the retry loop, top-up `possibleCulprits ≥ min(3, count-1)`. | `agent2-run.ts:202,521` |
| 2-C | **Named-victim promotion (M2)** reverted (surname collision); promotion code absent. | Med | M | Promote one victim candidate to fully-profiled named victim with collision-safe surname; wire `CASE.premise{named_victim,…}`. | `ROADMAP_TO_80.md` M2 |
| 2-D | **2e scoring adapter may grade Agent-1 back-filled fields**, not the one creative field (`backdropSummary`). | Med | M | Audit `adaptBackgroundContextForScoring`; grade only the 2e-specific output. | `agent2e-run.ts:51` |
| 2-E | **2b/2c retries still serial**; 2c-after-7 reorder deferred. | Med | L | Concurrency + reorder are larger; defer reorder (research), consider concurrent gate execution. | `ANALYSIS_53.md` P5/P6 |

### Agent 3 / 3b — CML + Hard-Logic Devices  *(state: ✅ mostly)*
| # | Item | Pri | Eff | Next action | Evidence |
|---|---|---|---|---|---|
| 3-A | **Synthetic mechanism-family fallback** misses off-menu themes (only 8 families; stopword gate returns `[]` for e.g. "grafting"/botanical). | High | M | Lower the bar for shared theme↔mechanism tokens / widen stopwords so novel themes still engage theme-lock. | `agent3b-hard-logic-devices.ts:64-142` |
| 3-B | **Motive validator** — no gate banning generic passion/jealousy/desperation or requiring a victim-relationship anchor. | Med | M | Add `BANNED_MOTIVE_LIST` check in `normalizeCml()`; require motive to reference `victim_relationship`. | `ANALYSIS_51.md:80` |
| 3-C | **Device-complexity depth scorer** still length-based (prompt half only). | Med | M | Replace length scorer with `scoreDeviceDepth` (claim richness + clue availability + locked-fact concreteness). | `ANALYSIS_51.md:82`; `deviceQualitySignal` 226-231 |
| 3-D | **`CML_REPAIR_MODE`** default `rewrite`; `patch` gated pending A/B. | High | S | **Theme 1** — A/B patch vs rewrite (validation, agent4 repair count, final score); flip if patch wins. | `agent3-cml.ts:1360-1369` |
| 3-E | **`death_method` (L1) cap-clearing unverified** — confirm `hard-caps.ts` ending scorer actually references `death_method`. | High | M | Verify the weak-method cap is conditional on `death_method`; if not, L1 is incomplete. | `agent3-cml.ts:39-60`; `hard-caps.ts` |
| 3-F | **Triad "reveal-evidence planting" half** — mechanism-withholding is now enforced (A_55 #2); the "reveal clues unplanted" half still doesn't always land in prose. | High | L | Audit why reveal clues aren't planted early; pairs with Agent 5 / Agent 7 clue-job authority. | `ANALYSIS_51.md:161` |

### Agent 4 — CML Revision  *(state: ✅ substantially complete)*
| # | Item | Pri | Eff | Next action | Evidence |
|---|---|---|---|---|---|
| 4-A | **Post-CML LLM audit runs every revision attempt** — no judge-gating. | High | M | Gate the LLM audit to run only on validation-passing variation/clone near-neighbours. | `agent4-revision.ts:1190-1198` |
| 4-B | **`missing_case_transition_bridge`** critical-continuity warning (disappearance→death). | High | L | Needs a live failing run; implement bridge-transition repair + validator gate. | `ANALYSIS_52.md §5` |
| 4-C | **Temporal-contradiction validator** month false-positives (partly fixed: "*May I?*"). | Med | M | Require explicit calendar context (date/season/year) before flagging a month. | `ANALYSIS_52.md §5` |
| 4-D | **Revision non-convergence** after fair-play escalation (contract drift, weak audit trace). | Med | L | Needs a live non-converging run + deep audit logging to diagnose. | `ANALYSIS_50.md:152-155` |

### Agent 5 — Clue Distribution  *(state: ✅ solid)*
| # | Item | Pri | Eff | Next action | Evidence |
|---|---|---|---|---|---|
| 5-A | **`checkPointsToDistinctness` is advisory-only** — one-insight/one-clearance distinctness is computed but not enforced. | High | S | Promote to a blocking gate inside `applyClueGuardrails` (repair-not-abort: warn→repair). | `agent5-clues.ts:142-160` |
| 5-B | **Upstream clue dedupe** before injection (near-duplicate collapse is Agent-9 side only). | High | M | Replay-invisible dedup before clue injection; coordinate with the clue-job stamp. | `ROADMAP_TO_80.md` M4 |
| 5-C | **Structured clue fields** (`observable`/`inference`/`first_full_reveal_chapter`) landed but inert pending LLM adoption + chapter-matching consumption. | Med | S | Verify `deriveClueObservable` is used for chapter matching in Agent 9. | `agent5-clues.ts:98-125` |

### Agent 6 / 6.5 — Fair-Play Auditor + World-Builder  *(state: ✅ core done)*
| # | Item | Pri | Eff | Next action | Evidence |
|---|---|---|---|---|---|
| 6-A | **Reveal gate T2.1–T2.3 built, default OFF** (`AGENT6_REVEAL_GATE`): fooled-then-convinced, herring-points-at-culprit, death-method deducibility. | High | S | **Theme 1** — run `=shadow` then `=enforce`; verify all three fire; A/B then default. | `agent6-run.ts:2318-2378`; `agent6-reveal-gate.ts` |
| 6-B | **Elimination min-fraction hardcoded 0.5**, advisory-only. | Low | S | Parameterise `AGENT6_MIN_ELIMINATED_FRACTION`; allow escalation to blocking. | `agent6-run.ts:795-809` |
| 6-G4 | **G4 DT-scene scheduler invariant** (root) — see 7-G4. | High | M | Beat-scheduler fix (the outline mitigation already shipped A_55 #5). | `ANALYSIS_55.md §2.5` |
| 6-T3 | **Research-tier (DEFER):** premise-diversity rotation, cross-run novelty store, mechanism-plausibility gate, two-pass blind-read judge. | Med | L | Defer until K1-cast + K2-honesty land; documented as buffers, not banked points. | `ROADMAP_TO_90.md §T3` |

### Agent 7 — Narrative / Beat-Scheduler  *(state: 🟡 infra landed, levers OFF)*
| # | Item | Pri | Eff | Next action | Evidence |
|---|---|---|---|---|---|
| 7-G4 | **G4 scheduler invariant contradiction** — DT `evidence_clues` are forced to first-reveal **before** `testIdx`, leaving the DT slot with zero fresh `cluesRevealed`; `isClueBearing` masks it. | High | M | Relax the essential-before-test invariant for **exactly** the DT-evidence reveals, or add a `reveal_clue` obligation at `slots[testIdx]`. | `beat-scheduler/schedule.ts:122`, `invariants.ts:92-93,144`; `collect.ts:38-92` |
| 7-A | **Opening-hook contract not enforced** — Scene 1 leading with body/discovery is documented in the prompt only. | Med | M | Pre-commit validator: Scene 1 summary/purpose must mention body/discovery before scene-setting. | `agent7-narrative.ts:737` |
| 7-B | **`missing-bridge` false-positive** on body-discovery collocations. | High | M | Add discovery-of-body collocations ("found at", "discovered near", "body at foot of") to `BRIDGE_TERMS`. | `case-transition-validator.ts` |
| 7-C | **`mar` month-abbrev collides** with "mar" (verb). | Med | S | Require trailing period / punctuation context to disambiguate. | month-abbrev regex (story-validation) |
| 7-D | **Fair-play clue-sequencing not enforced** — "no information not yet shown" is prompt-only. | Med | M | Post-prose/Agent-9 pre-commit validator: deductions must reference only clues in earlier scenes' `cluesRevealed`. | `agent7-narrative.ts:768-780` |
| 7-E | **Per-chapter word budget from pacing curve (T1.3)** built, default OFF — the *safe* half of scheduler authority. | Med | M | **Theme 1** — enable `AGENT7_SCHEDULER_AUTHORITATIVE` (word budgets), A/B chapter-length variance + K2. | `agent7-run.ts:139-154` |
| 7-F | **Beat-scheduler authority (T1.2/M4)** — grid is shadow-only; the dominant pacing lever. | High | L | **DEFER (design decision):** grid-as-input vs grid-replaces-outline; prototype on a small run first. | `agent7-run.ts:47,55`; `ROADMAP_TO_80.md` M4 |

### Agent 8 — Novelty Auditor  *(state: 🟠 most unfinished)*
| # | Item | Pri | Eff | Next action | Evidence |
|---|---|---|---|---|---|
| 8-A | **Deterministic judge built but NEVER wired.** `@cml/novelty judgeNovelty` is tested but never called; only the expensive LLM auditor runs every pass. | High | L | Build a `cmlToSkeleton` extractor; gate `judgeNovelty` (Skeleton) **in front of** `auditNovelty` — only call the LLM auditor on `variation`/`clone` verdicts. | `novelty/src/index.ts:12`; `agent8-novelty.ts` (only caller) |
| 8-B | **Seed-clichÃ© fingerprint duplicates** — 4/8 "clichés" duplicate seed fingerprints. | Med | M | Dedup `seed-fingerprints.yaml` ∪ `cliche-ledger.yaml` on (axis, mechanism_family, false_assumption, DT-shape, inference-shape) at load. | `ANALYSIS_53.md:381` |
| 8-C | **Cross-run novelty default SHADOW**; threshold-flip to 0.7 deferred. | Med | S | **Theme 1** — `NOVELTY_CROSS_RUN=on` A/B (already powered-A/B'd inconclusive in A_54; needs ≥4×4 matched). | `novelty-ledger.ts:78-99` |
| 8-T3 | **Originality engine (DEFER)** — manufacture fresh premises, not just avoid plagiarism. | Med | L | Post-90 research. | `ROADMAP_TO_90.md §5` |

### Cross-cutting / orchestration
| # | Item | Pri | Eff | Next action | Evidence |
|---|---|---|---|---|---|
| X-A | **Word-boundary name/role matcher not universally applied** — agents 2/3/5/7 still use `String.includes()`. | High | M | Replace with `identity-match.ts` (`namesMatch`/`nameAppearsAsWord`/`roleArchetypeIncludesWord`); unit tests per file. | `identity-match.ts`; legacy `.includes` sites |
| X-B | **No consolidated repair-or-warn helper** — abort-softening logic is inline per file. | High | M | `repairOrWarn(condition, repairFn, warning)` in `shared.ts`; backport to agent2/6/9 throw sites. | `agent9-run.ts:4481-4699` |
| X-C | **Mutation→re-normalize→re-validate** only on the agent3 patch path. | High | M | Reusable post-mutation re-ground/re-validate pass after *any* CML mutation (agent3/4/9) + the agent7 grid stamp. | `agent3-cml.ts:1406-1413` |
| X-D | **Per-call cost deltas** — only cumulative tracking; no snapshot-before/after. | Med | M | `costTracker.snapshot(agent)` → delta; replace cumulative `+=` at call sites. | `mystery-orchestrator.ts:670-671` |
| X-E | **Config single-source assertion** — no check that `DEFAULT_CONFIG ≡ parsed YAML`. | Med | S | Assert merge equality in `generation-params.ts`; test per source. | `generation-params.ts:369` |
| X-F | **Scene-grounding coverage** at 0.8, gate wants 0.9 (one short chapter). | High | M | Run `evaluateSceneGroundingCoverage` on the shortfall chapter; enforce location anchor in first 2 paragraphs. | `ROADMAP_TO_80.md §5` |

---

## 2. The line — what we implement next (deterministic code, holistic, repair-not-abort)

Everything below is **codeable now** with no measurement dependency. Ordered by leverage × low-risk. (The standing constraint holds: **no story/character/plot-specific hardcoding** — all parameter-driven; every violation → warning → deterministic repair, never a hard throw.)

**Wave A — clean, high-confidence wins**
1. **5-A** — `checkPointsToDistinctness` → blocking guardrail (warn→repair).
2. **7-G4** — beat-scheduler invariant relaxation: reserve ≥1 DT-evidence clue to first-reveal at `testIdx` (+ unit test). Closes the scheduler root behind A_55 #5.
3. **7-B / 7-C** — `BRIDGE_TERMS` body-discovery collocations; `mar` month-abbrev disambiguation.
4. **2-B** — final culprit-count top-up.
5. **1-C** — victim-unnamed guard fires on any resolved victim name.
6. **6-B** — parameterise `AGENT6_MIN_ELIMINATED_FRACTION`.

**Wave B — feature work**
7. **8-A** — `cmlToSkeleton` extractor + wire `judgeNovelty` as the cheap pre-gate to `auditNovelty` (the single biggest "real feature" left). **8-B** seed-clichÃ© dedup at load.
8. **1-A / 1-B** — atmosphere → Agent 9 prompt + Agent1↔2d season/time contract.
9. **3-A** — synthetic mechanism-family fallback for off-menu themes. **3-B** motive validator. **3-C** `scoreDeviceDepth`.
10. **7-A / 7-D** — opening-hook Scene-1 validator + fair-play clue-sequencing validator.

**Wave C — cross-cutting hygiene**
11. **X-A** word-boundary matcher rollout; **X-B** `repairOrWarn` helper + backport; **X-C** reusable mutation→re-validate pass; **X-D** per-call cost deltas; **X-E** config single-source assertion.
12. **3-E** verify/complete `death_method` cap-clearing; **2-D** 2e scoring-adapter audit; **5-C** structured-clue-field consumption check; **4-A** audit gating; **4-C** temporal validator hardening.

**Verification for every wave:** rebuild affected dists → full typecheck → per-package vitest → add a regression test per behaviour change.

## 3. Separate tracks (NOT in the "implement the rest of the code" line)

- **Theme 1 — flag-flips needing measurement** (2-A, 3-D, 6-A, 7-E, 8-C): the code is done; flipping a score-sensitive default requires a **powered N≥4×4 A/B matched on chapter count** (single-run K2 is confounded). Run after Wave A–C land, one flag per matched replay.
- **Research / model-tier (DEFER, mostly Agent 9):** 7-F beat-scheduler full authority (design decision); 2-E 2c-after-7 reorder; 4-B/4-D live-run-dependent diagnoses; 6-T3 / 8-T3 (cross-run novelty store, mechanism-plausibility gate, two-pass blind-read, originality engine, premise-diversity); judge re-calibration at 70–80, real critique→rewrite at creative temp, stronger generator model.

## 4. Definition of done for "agents 1–8 as good as we can get them"
- Waves A–C implemented, tested, dists rebuilt, full sweep green.
- All built-but-OFF gates wired & shadow-validated (enable decision = Theme-1 A/B, tracked separately).
- A_56 register items 1-*…X-* either ✅ or explicitly moved to the DEFER track with a reason.
- The remaining ceiling (craft, model tier, scheduler authority) is Agent-9 / research and explicitly **out of upstream scope**.

---

## 5. Verified disposition (what we actually changed)

Per the directive *"don't implement because the docs say so — verify each change is a real problem AND a net-positive, regression-safe fix."* A second skeptical workflow (`wdbrjtarb`) read the **live code** for each candidate. Outcome: of ~26 candidates, **5 were genuine, safe, positive changes** (implemented + tested); the rest were already-done, not-real, low-value, risky, or rest on a false premise. This is the honest result — most of the "backlog" was already handled or not worth doing.

### ✅ Implemented (5) — all parameter-driven, repair-not-abort, with regression tests
| Item | Change | Files | Test |
|---|---|---|---|
| **X-E** | **Real latent bug.** `DEFAULT_CONFIG` (the YAML-load-failure fallback) had drifted *below* the YAML for truncation-critical model params — agent2b/2c `max_tokens` 4000/4500 vs **8000**, agent3b 2600 vs **6000** (the YAML was deliberately raised to stop JSON truncation). A YAML read error would silently reintroduce truncation. Reconciled + added a DEFAULT-vs-YAML parity test. | `generation-params.ts` | parity test (2) |
| **5-A** | `checkPointsToDistinctness` → **enforced** in `applyClueGuardrails`: when a collision group has >1 essential clue sharing a `points to` implication, keep one anchor and demote the extras to supporting (never delete; never drop below the essential minimum). | `shared.ts` | distinctness test (2) |
| **2-B** | Final culprit-count **top-up** in `enforceVictimRoleInvariant`: steps 3/5 could leave an undersized pool; top up to `min(3, eligible)` from non-victim/non-detective cast. | `agent2-run.ts` | top-up test (2) |
| **1-C** | Victim-unnamed cap now resolves a victim promoted via `culpability.victim` (not only `role:victim`), matching the prose-side `stageContractCheck`. | `rubric-score/facts.ts` | facts test (3) |
| **7-C** | `mar` month-abbrev no longer collides with the verb "mar" (require `mar\.`, mirroring `temporal-consistency.ts`), removing a temporal-scoring false positive. | `agent2d-temporal-context-scorer.ts` | existing scorer tests |

### ⊘ Skipped — verified NOT a real problem / not net-positive
- **X-A (word-boundary matchers):** all 5 sites are `.includes('detective'/'victim'/'suspect')` on controlled-vocab role archetypes — those terms never appear as substrings of other legitimate roles, so there is **no real collision**, and `\bsuspect\b` would *introduce* false-negatives on inflected roles like "suspected accomplice". Net-negative.
- **7-G4, 7-B, 8-B, 4-A, 6-B, X-B, X-D, 7-A, 7-D, 3-B (verifier skips):** already covered (7-G4 by A_55 #5; 7-B by `NarrativeContinuityValidator`; 8-B by `loader.ts` dedup; 4-A already validation-gated), or low-value / risky / wrong-layer.
- **3-E (death_method cap):** **verified already correct** — `death_method → resolveDeathMethodTokens → weakMurderMethod → cap`, with a proper fallback to the outcome heuristic when `death_method` is absent. No change.

### ⏸ Deferred — real but needs bigger/coupled work (documented for a focused pass)
- **8-A (wire the deterministic novelty judge):** the verifier's spec rested on a **false premise** — live CMLs do **not** carry `mechanism_family` / `discriminating_test_shape` / `inference_shape` as structured fields (only the novelty seed fingerprints + schema do). A correct `cmlToSkeleton` needs the **LLM skeleton-extractor** A_50/A_53 deliberately deferred; a deterministic keyword classifier is only safe as **shadow telemetry** (gating on a mis-derived "clone" would block a genuinely novel story). Next step: shadow-only heuristic wiring OR the skeleton-extractor — not the "quick deterministic win" implied.
- **1-A / 1-B (atmosphere → prose + season contract):** **coupled.** The prose prompt already handles atmosphere/weather/season via scene settings + season-lock; piping Agent-1's atmosphere risks a season **contradiction** (the known 2c autumn→summer flip). The Agent1↔2d season contract (1-B) should land first. Defer as a paired pass.
- **3-A (off-menu mechanism family), 3-C (`scoreDeviceDepth`):** scoring/theme-internal enhancements (not defects); need careful keyword/scorer tuning + their own A/B.
- **2-D (2e vanity-scorer honesty):** real backdoor, but **safe to defer** — the honest path (`scoreRealBackground`) already grades only 2e fields, the vanity adapter is legacy/deprecated, and patching it shifts a baseline for marginal gain. Rely on HONEST_SCORERS instead.
- **4-C (temporal validator residual FPs):** no concrete residual evidence; the `mar` class is now fixed by 7-C.

### 🔁 Flag-flips — classified, deliberately NOT flipped
The built-but-OFF gates stay flag-gated (the correct posture). The score-sensitive ones (`AGENT2B_VOICE_CHECK=enforce`, `AGENT2C_SCENE_GATE=enforce`, `AGENT7_SCHEDULER_AUTHORITATIVE`, `AGENT3B_PLAUSIBILITY_JUDGE=enforce`, `NOVELTY_CROSS_RUN`) **require a powered A/B** before any default flip (single-run K2 confounded). The deterministic-telemetry ones (`AGENT2_CAST_CHECK`, `AGENT2C_SPINE_CHECK`, `AGENT2E_DERIVE_BACKGROUND`) are zero-risk-to-enable but add observability nobody currently consumes — left as designed; enable per-run when the telemetry is wanted. **`CML_REPAIR_MODE` is not a live env var** (verifier finding) — the patch/rewrite selection is internal.

### Verification
Dists rebuilt (`rubric-score`, `story-validation`); worker typecheck clean. Full sweep green: **rubric-score 52** (+3), **story-validation 303** (+2), **worker 249** (+4, incl. an `agent6-run-flow` mock updated for the new `shared.ts` import). No regressions.

---

## 6. What's LEFT to make Agents 1–8 run well

After the §5 work, agents 1–8 are **structurally sound and problem-free for normal runs** — the defect/robustness backlog is cleared, the pipeline completes, and the known correctness traps (victim lifecycle, mechanism leak, parser zero, config-fallback truncation, undersized culprit pool, redundant clues) are closed. What remains is **not bug-fixing** — it is (a) one genuine feature, (b) a few quality enhancements that need their own care, and (c) a measurement campaign to *activate* machinery that's already built. None of it blocks a clean run; all of it is about running *better*.

### Tier 1 — genuine remaining code work (upstream, in-scope)
Ordered by value. Each is a discrete, self-contained pass.

| # | Item | Why it matters for "running well" | Effort | Concrete next step / acceptance |
|---|---|---|---|---|
| 1 | **8-A — wire the deterministic novelty judge (SHADOW first)** | The only built-but-unwired component. Closes the "every run pays for the expensive LLM novelty audit" gap and gives premise-repetition signal. | L | Build a best-effort `cmlToSkeleton` (axis via `mapToNoveltyAxis`; `mechanism_family`/`discriminating_test_shape` via keyword classifier with a *never-confidently-wrong* fallback); call `judgeNovelty` vs `loadReferenceCorpus()` and **log the verdict only** (never block/skip). Accept when shadow telemetry shows the deterministic verdict tracks the LLM auditor on ≥20 runs — *then* consider gating. **Do not gate on a deterministic mapping** (false "clone" would block a novel story). See `novelty-judge-needs-skeleton-extractor` memory. |
| 2 | **1-B then 1-A — season contract, then atmosphere → prose** | Atmosphere is generated by Agent 1 but never reaches Agent 9, and Agent 1's `timeOfDay`/season can contradict Agent 2d's month-derived season (the autumn→summer flip). Lifts the `atmosphere` rubric category and kills season contradictions. | M | (1-B first) Add a deterministic enforcer after 2d locks season-from-month: if Agent 1 `timeOfDay`/weather contradicts, repair to 2d's value + warn. (1-A) Only after the contract holds, thread `ctx.setting.atmosphere` into the Agent 9 atmospheric-context block. Accept: no season-contradiction warnings + atmosphere signal present in prose. |
| 3 | **3-A — synthetic mechanism-family fallback for off-menu themes** | Themes outside the 8 hard-coded families (e.g. botanical/grafting) return `[]`, so theme-lock silently disengages → less theme-coherent devices. | M | In `agent3b-hard-logic-devices.ts`, lower the shared theme↔mechanism token bar / widen `SYNTHETIC_FAMILY_STOPWORDS` so a novel theme still engages a synthesized family. Accept: a unit test on a botanical/grafting theme returns a non-empty family + the reorder fires. |
| 4 | **3-C — `scoreDeviceDepth` replaces the length-based device scorer** | Device "complexity" is currently graded by length, not substance → rewards padding. | M | Replace the length scorer with one keyed off claim richness + clue availability + locked-fact concreteness (`deviceQualitySignal` already grades these). Accept: a verbose-but-shallow device scores below a terse-but-rich one. |
| 5 | **4-C — temporal-validator residual false-positives** | Low priority; the `mar`/verb class is now fixed (7-C). Any *remaining* month false-positives still cost honest temporal scoring. | S | Only if a live run surfaces one: require explicit calendar context (date/season/year anchor) before flagging a month. No action without concrete evidence. |

> **Deliberately NOT here:** **2-D** (vanity-scorer honesty — the honest path already grades 2e correctly; rely on `HONEST_SCORERS`, don't patch the deprecated adapter). **X-A** (word-boundary matchers — net-negative, see §5).

### Tier 2 — activate built machinery via a powered A/B (measurement, not code)
The code exists and is correct; the remaining work is **deciding the default**, which needs a powered **N≥4×4 A/B matched on chapter count** (single-run K2 is confounded — see the `canary-k2-single-run-confounded` memory). Run one flag per matched campaign; flip the default only if K2 holds or improves.

- `AGENT7_SCHEDULER_AUTHORITATIVE` (per-chapter word budgets — the *safe* half; the clue-job-authority half is paired and higher-risk)
- `AGENT2B_VOICE_CHECK=enforce` (voice distinctness)
- `AGENT2C_SCENE_GATE=enforce` (crime-scene profiling / location distinctness)
- `AGENT3B_PLAUSIBILITY_JUDGE=enforce` (mechanism plausibility — note: shadow already adds an LLM call/cost)
- `NOVELTY_CROSS_RUN=on` (cross-run novelty threshold cap)
- patch-mode CML repair (currently internal default `rewrite`; A/B patch vs rewrite on validation + repair-count + score)

*Zero-risk-but-optional:* the deterministic-telemetry gates (`AGENT2_CAST_CHECK`, `AGENT2C_SPINE_CHECK`, `AGENT2E_DERIVE_BACKGROUND`) can be enabled any time observability is wanted — they only log.

### Tier 3 — out of upstream scope (Agent-9 / research / model-tier)
Tracked for completeness; these do **not** belong to "agents 1–8 run well" and should not be undertaken as part of this line:
- **Beat-scheduler full authority (7-F / M4)** — a design decision (grid-as-input vs grid-replaces-outline), prototype on a small run first.
- **Agent 2c-after-7 reorder (2-E)** — large orchestration change.
- **Live-run-dependent diagnoses (4-B `missing_case_transition_bridge`, 4-D revision non-convergence)** — need a captured failing run to diagnose.
- **The craft ceiling** — real critique→rewrite at creative temperature, judge re-calibration at the 70–80 band, stronger generator model (the four "frozen" categories are a model-ceiling signature, not an upstream defect).
- **Originality / novelty research (6-T3 / 8-T3)** — cross-run novelty store, mechanism-plausibility gate, two-pass blind-read judge, premise-diversity engine.

### Bottom line
**To "run well" for normal generation, agents 1–8 are already there** (§5). The highest-leverage *remaining* upstream move is **Tier 1 #1 (novelty judge, shadow)** and **#2 (season contract + atmosphere)**; everything else is either an enhancement with its own A/B (Tier 2) or out of scope (Tier 3). The score ceiling beyond this is an **Agent-9 / model-tier** story, not an agents-1–8 story.

---

## 7. Tier-1 implementation pass — outcome (each traced to live code)

Same discipline as §5: each Tier-1 item was traced to the live code before any edit. Outcome — **1 implemented, 4 found blocked / not-net-positive.** The "what's left" was smaller and harder than the §6 framing assumed.

### ✅ Implemented
- **3-A — off-menu mechanism family (inflection-robust corroboration).** The off-menu fallback already existed (theme∩hints shared-noun → synthetic family); the real gap was that the intersection was **exact-token**, so "grafting" (theme) vs "graft" (hint) failed to corroborate. Made it **stem/prefix-matched** and canonicalised to the shorter stem (so device-realization matching also covers inflections). Stays conservative — still requires both theme and hints to name the method, so open themes remain open. `agent3b-hard-logic-devices.ts` + 2 regression tests (prompts-llm **537**, +2). **The risky "theme-tokens-alone" version the §6 hint implied was NOT done** — it would over-lock open themes and cost novelty.

### ✅ 8-A (novelty judge) — implemented as the LLM skeleton-extractor, SHADOW
First proven that a **deterministic** skeleton returns `"distinct"` for every input — worse than useless: `compare.ts` gates the verdict on `false_assumption_pattern` (`sharesBelief`) and `TRICK_FIELDS = [mechanism_family, inference_shape]` (`TRICK_SHARED_FOR_VARIATION = 2`, `CLONE_MIN_SHARED = 4`), and the corpus stores those two fields as **hand-authored snake_case labels** (`"time_of_symptom=time_of_act"`) that keyword classification cannot reproduce → always `distinct` (false "all novel" telemetry). So the deterministic version was *not* shipped.

Instead, on the user's go-ahead, built the **LLM skeleton-extractor** (the §9.1-spike-2 the seed file flagged as the gated next phase) — the only path that produces the belief/inference labels in the corpus's space:
- **`@cml/novelty/extractor.ts`** (pure, no LLM dep — `ChatFn` seam mirroring `@cml/rubric-score`): `buildSkeletonExtractionMessages` (enum-constrained prompt + real corpus few-shot), `parseSkeletonResponse` (clamps the 3 enums to safe fallbacks, snake-cases the 2 labels so the judge's `norm()` can match), `createSkeletonExtractor(chat)`.
- **SHADOW wiring** in `agent3-run.ts`, gated by `NOVELTY_SKELETON_JUDGE` (`off|shadow`, **default shadow**): extracts a skeleton from `ctx.cml`, runs `judgeNovelty` vs `loadReferenceCorpus()`, and **logs** the verdict (+ a `novelty_skeleton_judge` diagnostic; a warning only when not `distinct`). It **never blocks/skips** and is fully `try/catch`-guarded, so it can't break a run. Added `@cml/novelty` to the worker deps (+ symlink).
- **Tests:** 6 new (`extractor.test.ts`) incl. an end-to-end stub-`ChatFn` proof that a corpus-matching skeleton is **not** judged `distinct` (the labels are now in the comparison space) while a novel one is. novelty **18** pass, worker **249** (no regressions), worker typecheck clean.
- **Cost:** one extra (cheap, ~600-token, temp 0.1) LLM call per run while in shadow. Set `NOVELTY_SKELETON_JUDGE=off` to disable; `NOVELTY_SKELETON_MODEL` to pin a cheaper deployment. **Promote to gating only after** the shadow telemetry shows it tracks the existing LLM auditor.

### ⏸ 1-A / 1-B (atmosphere + season) — deferred, coupled & fuzzy
Agent 1 has **no season field** — only free-text `atmosphere.weather` ("Stormy night"). Agent 2d is already the authority (`deriveSeasonFromMonth`, re-pinned, fed to the Agent 9 season-lock). A deterministic "weather↔season contradiction" check (1-B) would be fuzzy and false-fire-prone (most weather is season-neutral). And 1-B only *matters* if 1-A is also done (atmosphere piped to prose) — otherwise Agent 1's weather never reaches the prose, so the contradiction is invisible. Together they're multi-file plumbing + a fuzzy check for a marginal atmosphere-score gain over an already-locked season. Deferred as a coupled pair; revisit only if Agent 1 gains a structured season field.

### ⏸ 3-C (`scoreDeviceDepth`) — deferred, not a real defect
The method is already named `scoreDeviceDepth` and grades **field-presence thresholds + implication counts** (reasonable substance proxies), not raw-length reward — the "length-based" premise is only nominally true. It's a **vanity** scorer; the honest `agent3b-device-real-scorer` is the path forward (same disposition as 2-D). Tweaking it shifts a baseline for marginal gain.

### Net
Agents 1–8 gain **3-A** (a real, safe robustness improvement) and **8-A** (the LLM skeleton-extractor, shadow — the deterministic version was proven valueless and *not* shipped). **1-A/1-B/3-C remain deferred** with concrete reasons (coupled/fuzzy, or vanity-scorer baseline-shift). Upstream agents are now at "as good as we can get them": the novelty judge is wired in shadow to gather the validation telemetry, and the only remaining decision is whether/when to promote it from shadow to gating once that telemetry confirms it tracks the LLM auditor.

# ANALYSIS_54 — A_53 end-to-end validation: two full canary runs + collated findings

Status: **complete.** Purpose: validate the full A_53-modified pipeline (Phases 1–11) end-to-end and isolate whether A_53 introduced any quality/score regression vs the A_52 baseline. Method: three full `canary:core` runs (2 A_53-default + 1 baseline) analysed per-run (4-agent workflow + adversarial verification) and collated. **Headline: A_53 reliability validated (3/3 runs complete, no abort); no demonstrable score regression (the K2 spread is confounded); the score ceiling is held by pre-existing structural/heuristic issues, top of which is the culprit-near-death false positive.**

> Lineage: A_53 (see ANALYSIS_53) landed ~98/103 items across 11 phases — the repair-not-abort sweep, cost-delta accounting, identity-matching (Pattern D), validator false-positive fixes, mutation re-validation + config single-source, novelty `NOVELTY_MODE`/cross-run-shadow, and the Agent-7 scheduler-authority split + an efficiency/robustness pass (workflow: 38 agents). A first smoke canary (`mystery-1782677370766`) ran clean end-to-end (exit 0) but scored K2 60 with a scene-grounding 0/9 release-gate warning — this doc isolates whether that is a regression or variance.

---

## 0. Baseline & hypotheses

**A_52 baseline (the bar to beat / not regress):** `mystery-1782647685448` — **K2 70 (raw, `caps_applied: []`)**, scene-grounding **8/10**, gate status `warning` (the temporal + bridge false-positives, both since FIXED in A_53). Default clock-tampering theme. **Cross-run novelty was OFF** (the A_52 default).

**Key A_53 default change under test:** A_53 flipped `NOVELTY_CROSS_RUN` to **shadow** (records the ledger + feeds prior-run avoidance into Agent 3). This diverges the *premise* from recent runs — which can change how the prose opens and therefore how the (unchanged) `hasAnchor` scene-grounding heuristic scores.

**Hypotheses:**
- **H1 (cross-run novelty → grounding):** the grounding drop (8/10 → 0/9) is caused by cross-run-novelty premise divergence, not an evaluator regression. → Run B (`NOVELTY_CROSS_RUN=off`, like A_52) should recover grounding.
- **H2 (scene-grounding evaluator false-negative):** the `evaluateSceneGroundingCoverage` `hasAnchor` check (location *proper noun* in the first 2 paragraphs) is fragile and under-counts richly-grounded prose. (Confirmed by inspection of `mystery-1782677370766`.)
- **H3 (reliability):** the repair-not-abort sweep holds — both runs complete end-to-end with no hard abort, even on edge cases.

---

## 1. Run A — A_53 defaults (cross-run novelty = shadow)

`NODE_OPTIONS=--use-system-ca npm run canary:core` — current A_53 defaults (`CML_REPAIR_MODE=rewrite` after the integration revert; `NOVELTY_CROSS_RUN` unset → shadow).

| Field | Value |
|---|---|
| Run ID | `mystery-1782679627737` (`stories/story_20260628-2157/`) |
| Exit / abort | **exit 0, no abort** — full 9-chapter story produced |
| K2 rubric | **63/100** (raw 63) — "structural: unplanted-evidence vetoed" (no false cap) |
| caps_applied | none (the structural verifier vetoed an unplanted-evidence flag → K2 reads accurately) |
| Scene-grounding | **passed** (no grounding warning — vs the first smoke run's 0/9; the heuristic is variable, not broken) |
| Release-gate status / warnings | `warning` — single warning: "critical continuity issue detected" |
| Culprit/victim integrity | victim = Dr. Mallory Finch (auto-repaired from possibleCulprits); culprit = **Captain Ivor Hale** → `enforceCulpritEvidencePresence` **warn+skip** ("name near death marker in Ch1; CML culprit assignment likely invalid") — graceful, no crash |
| Per-chapter prose | 91–99/100 (excellent) … but **cumulative collapses 98 → 60 at Chapter 4** and stays — a mid-story continuity break |
| Notable warnings | 30 total; "Cross-run novelty: diverging from 6 recent run(s)"; most-similar seed "The Second Key" @ 0.81 (< 0.90, passes); cast deterministic-mode (cast score 85/B) |

_Findings:_ **Reliability holds (H3 ✓):** completes end-to-end, the culprit-near-death edge case is warn+skip not a crash. **Grounding passed here** but failed (0/9) in the first smoke run on the *same theme* → confirms **H2** (the `hasAnchor` heuristic is fragile/variable, not an A_53 regression). The real quality drag is a **continuity break at Ch4** (cumulative 98→60) — a cross-chapter consistency failure the per-chapter scorer (91–99) doesn't catch. The **culprit appearing at the victim's death scene in Ch1 recurs across runs** (Hugo Vane in run 0, Captain Ivor Hale here) — a systematic CML/prose pattern, not random.

---

## 2. Run B — controlled baseline (`NOVELTY_CROSS_RUN=off`)

`NODE_OPTIONS=--use-system-ca NOVELTY_CROSS_RUN=off node scripts/canary-core.mjs` — matches the A_52 cross-run-off condition to isolate the cross-run-novelty effect.

| Field | Value |
|---|---|
| Run ID | `mystery-1782680316507` (`stories/story_20260628-2212/`, **10 chapters / 14,255 words**) |
| Exit / abort | **exit 0, no abort** |
| K2 rubric | **70/100 ("Solid draft")** (raw 70, no clamp) — matches the A_52 baseline of 70 |
| caps_applied | none (raw == final) |
| Scene-grounding | **3/10** (gate warning) — better than run0's 0/9; OFF opened "**The Grand Seaside Hotel**" (location proper noun → hits) |
| Release-gate status / warnings | `CANARY_STATUS failure` (gated by the 3/10 grounding warning, **despite the 70 "Solid draft" rubric**) |
| Culprit/victim integrity | victim = Sylvia Trent (final, after a schema-repair retry first tried Dr. Mallory Finch + stripped her from possibleCulprits — **Phase-4/6 exclusivity working**); **no `enforceCulpritEvidencePresence` skip** this run (clean culprit path) |
| Per-chapter prose | 85–97/100 … but **cumulative collapses 94 → 60 at Chapter 3** and stays (same pattern as Run A) |
| Notable warnings | 33 total; **`Cast design schema-repair retry succeeded`** (A_53 cast-schema-repair fix exercised + worked); `repairWordFormLockedFacts: 2 replacements`; `applyLifecycleContinuityGuard: rewrote 1 ambiguous death-attribution sentence`; novelty audit live (most-similar "The Second Key" @ 0.83, pass) |

_Findings:_ Recovered the **A_52 baseline (K2 70)** with cross-run novelty OFF — but the adversarial analysis (§3) shows this is **confounded** (10 chapters vs 9; proper-noun opening). The same **cumulative→60 continuity collapse** appears here (94→60 at Ch3) — **condition-independent**. Multiple A_53 fixes visibly exercised and working: cast-schema-repair retry, victim/culprit exclusivity, word-form locked-fact repair, lifecycle continuity guard.

---

## 3. Collated findings

### 3.1 Cross-run comparison (3 A_53 runs + A_52 baseline)

| | A_52 baseline | run0-smoke | Run A | Run B |
|---|---|---|---|---|
| Cross-run novelty | **off** | shadow (on) | shadow (on) | **off** |
| K2 | **70** | 60 | 63 | **70** |
| Grade band | Solid draft | Promising | Promising | Solid draft |
| Chapters / words | — | 9 / 12,540 | 9 / 13,336 | **10 / 14,255** |
| Scene-grounding | 8/10 | 0/9 | none surfaced | 3/10 |
| Ch1 opening | (named) | "the dining room of the hotel" | "the Hotel Lobby" | "**The Grand Seaside Hotel**" |
| Cumulative continuity | — | 98 (held) | **98→60 @Ch4** | **94→60 @Ch3** |
| Culprit-near-death SKIP | — | ✗ (Hugo Vane ×2) | ✗ (Capt. Hale ×2) | clean |
| Caps / structural | `[]` | none | unplanted-evidence veto (G4 gap) | none |
| Exit / abort | — | **none** | **none** | **none** |

### 3.2 Adversarial verdict on H1 (cross-run novelty → K2): **INCONCLUSIVE / confounded**

The raw spread (ON: 60, 63 · OFF: 70) is directionally consistent with H1, but a high-effort adversarial pass (which read the saved stories to verify) found the K2 gap is **not attributable to cross-run novelty** — it is fully explained by confounds:
- **Chapter-count** (verified): OFF = 10 chapters / 14k words; both ON = 9 chapters. More chapters → more rubric-rewarded coverage, independent of novelty.
- **Grounding-naming variance** (verified in Ch1 text): OFF opened with the location *proper noun* ("The Grand Seaside Hotel" → 3/10); ON opened generically ("the hotel" → 0/9). The `hasAnchor` heuristic is unchanged by A_53.
- **runA's −7** = the **unplanted-evidence structural veto** from the **G4 DT-scene scheduling gap** (a scheduler/outline defect), not novelty.
- **run0's 60** = the **culprit-near-death SKIP + 0/9 grounding**.
- The **cumulative→60 continuity collapse** appears in BOTH an ON run and the OFF run → **condition-independent**.
- n is fatally small (2 ON, 1 OFF); grade-band quantization (60/63 "Promising" vs 70 "Solid") exaggerates a few points of ordinary variance.

**Decision: keep `NOVELTY_CROSS_RUN=shadow` as default.** Shadow only emits a divergence *warning* and never blocked any run, so it carries no proven hard cost; reverting on n=1-OFF would be unjustified. (A proper test needs ≥4 ON and ≥4 OFF, matched on chapter count.) `CML_REPAIR_MODE` remains reverted to `rewrite` (independent, score-safety) — it was never exercised in any of these runs (CML valid first-pass each time).

### 3.3 What A_53 validated in production (positive)

All three runs **completed end-to-end with no hard abort** — the repair-not-abort sweep holds. Concretely exercised + working: **cast-schema-repair retry** (Run B: "schema-repair retry succeeded", zero extra full regen on the deterministic path), **victim/culprit exclusivity** (all runs auto-repair the victim out of `possibleCulprits`), **word-form locked-fact repair** (Phase 6, Runs A/B), **lifecycle continuity guard**, **novelty audit live** (fires every run, not dark — Phase 6 fix confirmed), **mechanism reveal-gate** (withholds the HOW until the discriminating test), and the **unplanted-evidence structural veto** (Run A — K2 reads structure accurately, no false cap).

### 3.4 Top condition-independent issues (the real quality drags — A_54 backlog)

1. **Culprit-near-death false positive (HIGH).** `enforceCulpritEvidencePresence` (agent9-run.ts) skips the culprit-evidence injection whenever the culprit's surname appears within ±250 chars of a Ch1 death word — but in a Golden-Age mystery every suspect (incl. the culprit) is present when the body is found, so this fires almost every run (run0: Hugo Vane ×2; Run A: Capt. Hale ×2), declares "CML culprit assignment likely invalid", and **gates the run to failure**. Pre-existing (untouched by A_53). → **Fix:** require the culprit to be the grammatical *subject* of the death (adjacent, e.g. "Hale lay dead"/"Hale's body") rather than merely co-present in a 500-char window; or cross-check against the named victim before declaring the culprit invalid.
2. **Scene-grounding scorer false-negative (HIGH).** `evaluateSceneGroundingCoverage` requires a location *proper noun* in the first 2 paragraphs; richly-grounded prose that says "the hotel" scores 0. Proximate cause of 2/3 canary failures. Unchanged by A_53. → **Fix:** have Agent 9 lead chapter openings with the location proper noun (the grounding-lead, currently default-off), OR relax `hasAnchor` to accept established setting nouns ("hotel", "dining room") when sensory+atmosphere are present.
3. **Cumulative-continuity collapse to a 60 floor (MED).** Hits at Ch3–Ch4 in both conditions, never recovers, despite per-chapter 85–99. Decoupled from prose quality AND from the final rubric — likely the death-attribution / victim-reappearance lifecycle meter. → **Investigate** why the cumulative meter pins at 60.
4. **G4 DT-scene scheduling gap (MED — verified NOT an A_53 regression).** In run0 + Run A the discriminating-test scene had **no fresh DT-evidence clue scheduled in the outline** (Agent 7), the structural root of the unplanted-evidence veto — masked by the clue-spec shadow's "100% slots mapped". **Verification:** the G4 detector lives in `agent9-prose/generate.ts` (unchanged by A_53); the A_53 timing-gate promotion (`promoteLateGateCluesToMid`) **never fired** in any of the 3 runs (no "promoted late clue" log line); and the gap is **intermittent** (absent in Run B). → Pre-existing, intermittent Agent-7 outline-scheduling tension (the theme's "reveal mechanism clues by mid-story" vs G4's "fresh DT evidence *at* the DT scene"), not an A_53 regression. Still worth a future fix: guarantee ≥1 DT-evidence clue is revealed *at* the DT scene even when the rest are early/mid.
5. **Final-chapter resolution fragility (MED).** Run A's Ch9 failed validation on attempts 1 AND 2 ("no resolution event detected"), emitted ~130 lines of whitespace padding, and only "passed" via `injectResolutionIfAbsent` + downgrade-to-warning; `preferCompletionOnFailure=true` masked it as success. → Track injected-resolution as a quality signal, not a silent pass.
6. **Pronoun sweep runs despite `pronoun_policy=off` (LOW — investigated, NOT a bug).** The "17/8/11 repairs" came from the **parity-gated** cycle path (`if (pronounRepairEnabled || pronounGateParityEnabled)`), which is **intentionally independent** of `pronoun_policy` (parity ≠ pronoun-repair policy), is **monotonic-guarded** (`applyDeterministicPronounSweep` reverts any chapter where it increases mismatches), AND **is re-validated** immediately after (`validateCurrentProse`). The two main sweep sites (post-processing + rescue) ARE gated on `pronounRepairEnabled`. → No functional fix needed; only a **telemetry-clarity** nit (the "pronoun repair DISABLED" log co-existing with a "17 repairs" line is confusing — the DISABLED log refers only to the broad policy path).
7. **Telemetry gaps (LOW).** `WARNINGS_COUNT` is 23/30/33 but only 6 representative warnings are serialized (the structural/continuity ones that drive the gate are hidden); `CANARY_RED_HERRING_COUNT=0` in Run A despite 2 derived red-herring slots; and `CANARY_STATUS=failure` co-exists with a "Solid draft" 70 rubric — the headline number misleads.

## 4. Conclusions & recommendations

**Conclusion.** A_53's headline goal — *reliability* (repair-not-abort, no spurious aborts) — is **validated in production**: three full pipeline runs completed end-to-end, gracefully handling edge cases (invalid-looking culprit, schema near-miss, template-linter, retry exhaustion) by warn+repair, never a crash. **No A_53 score regression is demonstrable**: the K2 spread is confounded (chapter count, opening naming, a scheduler gap, a condition-independent continuity meter), and the one OFF run matched the A_52 70 baseline. The score ceiling is held back by **pre-existing** structural/heuristic issues (culprit-near-death FP, grounding scorer FP, the continuity meter), **not** by A_53.

**Default decisions (made):** keep `NOVELTY_CROSS_RUN=shadow` (no proven cost, preserves divergence telemetry); keep `CML_REPAIR_MODE=rewrite` (score-safety, unexercised here).

**Recommended next actions (priority order):**
1. **Fix the culprit-near-death heuristic** (#1) — biggest reliability/score lever; it gates clean runs to failure and suppresses culprit evidence. Holistic: subject-of-death proximity, not co-presence.
2. **Verify the G4 DT-scene scheduling gap is not an A_53 agent7 regression** (#4) — read the outline-coverage/scheduler diffs; if A_53 caused it, fix; else file as pre-existing.
3. **Address scene-grounding** (#2) — enable the location-proper-noun grounding lead or relax `hasAnchor`; recover the 8/10-class grounding the scorer is meant to reward.
4. **Run a powered A/B** (≥4×4, matched chapter count) before any cross-run-novelty default decision.
5. Backlog: continuity-60 meter (#3), resolution-fragility signal (#5), pronoun-sweep gating (#6), telemetry (#7).

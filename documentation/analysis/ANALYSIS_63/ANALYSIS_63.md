# ANALYSIS_63 — What is left on the road to 80

**Written:** 2026-07-19 (mid-P5.1, tide_on in flight) · **Supersedes:** A_62 "THE ROAD TO 80" section and the A_62 tracker as the statement of the remaining path. The [TARGET_80_LEDGER](../../plan/target_80/TARGET_80_LEDGER.md) stays the numeric authority; derive, never hand-extend.

**The one-sentence status:** the floor is proven, the cap regime is broken (leakage 49%→0, scaffold residual, reveal/mechanism silent), two fresh abort classes were found and killed same-day — and what stands between here and 80 is **raw craft in four categories no current lever targets well**, plus one over-bar cap (dual-value), one lever verdict landing today, and the M3 measurement machinery.

---

## 0. Where the campaign stands (facts, 2026-07-19)

| Milestone | State |
|---|---|
| **M1 — Floor** | ✅ CLOSED 2026-07-17 (8/8, zero aborts; 10 attempts, 11 aborts, 9 classes — all fixed same-day) |
| **P3 — Lever verdicts** | ✅ CLOSED: scaffold VALIDATED n=7 (−85%) → default ON `6d44f800` · leakage NO-FLIP, cap **source-fixed** `3cfdc7af` · dual-value INCONCLUSIVE → deferred to live data |
| **P4 — Gate** | ✅ SAT 2026-07-19: no new default flips; injector deletion DEFERRED (its evidence gate wasn't met); buy-back chose reveal — **weakened same day by M2 (reveal 0/4)**, re-read before funding |
| **M2 — Check batch** | ✅ RUN 2026-07-19 (4/4 shipped, £0.98): **caps criterion 3-of-4 met** — leakage **19/39 → 0/4** (source fix validated live), report-style 0/4, scaffold 1/4 (≤1 bar), reveal 0/4, mechanism 0/4; **`dualValueNoContrast` 2/4 = the only cap over the bar**. **Median 64 vs ≥73 — NOT met; the residual is RAW CRAFT** (the outcome A_62 §3 pre-committed to). |
| **P5.1 — Critique-rewrite A/B** | ✅ CLOSED same day: **FAIL** — 4/4 pairs, targets flat-to-negative (opening_hook −0.50, dialogue 0.00, pacing 0.00), prose **−1.00**, total −2.0. Lever OFF in env AND code (they now agree). §2.1's FAIL branch taken: the cost is banked, and opening_hook/pacing return to the unowned list — the §1 portfolio gap now spans clues, plot_structure, opening_hook, pacing. |
| **Abort classes #9/#10** | ✅ Both found in today's fresh-run era, fixed same-day, validated on the aborting theme+arm. #9: time comparator did absolute-minutes diff across asymmetric meridiem (50 real minutes read as 670). #10: `role.includes("victim")` substring predicate at ~30 sites — **poisoned generation itself** ("Friend of the victim" prompted as DECEASED); replaced by `isVictimArchetype` (head-noun semantics) in `@cml/cml`, all sites swept, 1507 tests green. |

**M2 category floor (the craft ledger, 4 runs):** clues **5.25** · plot_structure **5.50** · character_clarity **5.75** · pacing **5.75** · opening_hook **6.00** · ending **6.25** · prose **6.25** · premise 7.00 · dialogue 7.00 · atmosphere 7.50 — target 8.0 across the board.

---

## 1. The honest arithmetic

- Internal median is **64**. The only external calibration we own (S0, 2026-07-13) read externals **+9.5 above internal** (73.25 vs 63.75). If that offset holds, today's craft externally reads ≈ **73–74** — so the true remaining distance to the M3 bar (external mean ≥ 80) is ≈ **6–7 external points**, not 16 internal ones. This is an extrapolation from n=4 capped-era reads; M3 re-measures before anything is concluded (Item 10 recalibration happens THERE, after caps are gone).
- Those points live in the four lowest categories: **clues 5.25, plot_structure 5.50, character_clarity 5.75, pacing 5.75**. Lifting all four to ~7 is worth roughly 6 internal points on the total — approximately the whole remaining gap.
- **The lever-portfolio gap, stated plainly:** P5.1 (critique-rewrite) targets opening_hook/dialogue/pacing. P5.2 (voice) targets dialogue/tics. The pronoun candidate targets character_clarity. **Nothing in the current portfolio targets `clues` (the lowest category) or `plot_structure` directly.** Dual-value regen removes the `clues ≤6` *cap*, but M2's clues marks were 5-5-5-6 — mostly *uncapped* lowness. If P5.1/P5.2 verdicts land small, the road to 80 runs through a clues/plot-structure lever that does not exist yet — flag this now, decide after the P5 verdicts, not before (§8 one-lever discipline).
- A quiet tailwind, not yet measured: class #10 poisoned generation on any cast carrying a relational victim role ("Friend of the victim" → a living character written as deceased). Some historical runs carried this tax. Post-fix baselines may drift up on their own; do not attribute that drift to whichever lever happens to be under A/B when it appears — matched pairs on the same dist are the only safe read.

---

## 2. The remaining path (in order, with gates)

### 2.1 P5.1 verdict — critique-rewrite ✅ RESOLVED 2026-07-19: FAIL, lever OFF
Ran as planned (4/4 pairs, raw marks): targets opening_hook −0.50 / dialogue 0.00 / pacing 0.00; prose −1.00; rubric total −2.0 (63.3→61.3); treatment lost or tied 3 of 4 pairs. The FAIL branch below was taken same-day: `AGENT9_CRITIQUE_REWRITE=false` in `.env.local` (code default already false — they now agree), cost banked, opening_hook/pacing recorded as unowned. *(Original decision rule kept for the record: PASS → flip code default ON · FAIL/flat → off everywhere, bank the cost.)*

### 2.2 Dual-value decision — the only over-bar cap (~£1.6, one sitting)
M2 delivered the live data the P3 deferral asked for: **2/4 with the lever OFF**. The replay harness is structurally unable to measure this lever (hydrated world-state yields a null pair). Fund the **fresh-run ×4 pair A/B** (`AGENT9_REGEN_DUAL_VALUE` off/on, same chain script pattern, per-flag metrics `1d6a4bc4`); flip on cap-frequency movement without `completeness_structure`/pronoun regressions. This is the last cap standing between the batch and the M2 caps criterion.

### 2.3 P5.2 — voice A/B (~£1.8)
`AGENT9_VOICE_ENFORCE=enforce` ×4 pairs. Must measure **dialogue-mark movement AND tic frequency** (Item 14: 3/4 externals read the tics as artificial) — a dialogue gain bought with tic inflation is a fail. Same acceptance shape as P5.1.

### 2.4 Decision points that ride on 2.1–2.3 (no runs of their own)
- **Reveal buy-back (P4's pick):** trigger was M1v10's 4/7 acceleration; M2 read 0/4 on the new dist. Rule: fund the ×4 A/B **only if** reveal fires ≥2 in the ~16 P5-era shipped runs; otherwise the £1.20 stays in reserve. (Mechanism: same rule, currently 0/4.)
- **Pronoun-clarity candidate (Item 13):** decision-gated on what P5.1/P5.2 leave in the budget and whether character_clarity is still <6.5 after them.
- **Injector deletion (LLD P7):** still the least-reversible act. Re-pose only after the P5-era batches show the leakage/scaffold cap families at ~0 with injectors present; goes last, alone, with a smoke run.

### 2.5 M2 re-derive on the P5-era config (≈ free)
The P5 A/B arms **are** fresh runs on the flipped defaults — derive the M2 criteria over the treatment-config shipped runs (≥4 matched) rather than funding a separate batch. If dual-value flipped in 2.2, one dedicated ≥4 confirmation batch (~£1) with the full final flag set. Bars unchanged: top-4 caps ≤1, median ≥73. **If median lands <73 with all levers on, do not spend on reliability — the residual is the §1 portfolio gap; design the clues/plot-structure lever then.**

### 2.6 M3 — the final gate (~£1 + manual reads)
ONE ≥4×4 matched batch, all levers at final defaults:
- mean external (ChatGPT) **≥ 80** — one manual read per run
- |internal − external| **≤ 3** — recalibrate the rubric HERE and only if the cap-free gap still exceeds 3 (the −9.5 was measured on capped runs)
- ship rate 100% · reliability rows 0 · top-4 caps 0 · category floor mean ≥ 8.0

### 2.7 Close-out debts (after the last batch)
Restore `standby-timeout-ac` to 2700 · novelty skeleton-judge stays SHADOW until telemetry disagrees · commit the working tree (today's work is uncommitted: P4 gate row, M2 rows, classes #9/#10 fixes + sweeps, both chain scripts, this doc) · decide the deleted `mystery-*` report dirs (history is safe in `8b2a3e8e`; the deletions are unstaged).

---

## 3. Budget

£15 campaign reserve; ledger-recorded spend through M1/P3 left ≈ £5–6. Today: M2 £0.98 + P5.1 ~11 runs ≈ £2.4 → **≈ £2–2.5 remains** (estimate — derive from run reports before funding anything). Committed above: dual-value A/B ~£1.6 + voice A/B ~£1.8 already exceeds it. **The reserve arithmetic no longer closes** — either the reveal/pronoun/confirmation lines stay unfunded, or the reserve is topped up (~£5 covers everything in §2). Decision belongs to the owner; the path above is ordered so the highest-information runs come first.

---

## 4. Risks, stated before they bite

1. **The abort-class pool is not exhausted.** Two new classes in ~11 fresh runs today (#9, #10) — the fresh-run era exercises paths replays never took, at roughly one new class per 5-6 runs. Every remaining RUN step above should budget same-day-fix time; the machinery (halt-on-abort chains, resumable done-files, fixture-first fixes, validate-on-the-aborting-theme) is proven and stays mandatory.
2. **Detector precision is still the frontier.** Classes #5–#10 share one signature: a single false or fabricated signal crossing a hard threshold. The next FP is likelier in the least-exercised detectors (reader-trust caps, walk-on/lifecycle family). When a gate fails, suspect the detector before the story — but prove it with the artifact, never assume it.
3. **The −9.5 internal/external offset is the plan's biggest unverified number.** §1's arithmetic leans on n=4 reads from the capped era. If the true offset is smaller, the remaining gap is larger than it looks. M3's per-run external reads answer this; nothing before M3 does.
4. **`.env.local` vs code-default drift.** Today's P5.1 control arms are valid only because the chain forces the flag off per-process. Any future A/B must do the same — dotenv does not override pre-set process env, which is the ONLY reason this works. Verify via agent labels in `llm-prompts-full.jsonl`, per the standing rule.
5. **The K2 confound rides along.** Chapter count and opening-naming dominate single-run comparisons. Every verdict above is matched-pairs ≥4 on raw marks; no n=1 conclusion survives contact with this list.

---

## 5. The do-NOT-do list (carried forward, plus today's lessons)

- Do not re-litigate M1. An abort in a P5/M3 batch gets same-day-fix + rerun; the floor is proven.
- Do not hand-extend derived tables — `derive-ledger-panels.mjs` or nothing.
- Do not read any verdict below 4 complete pairs, on grade bands, or across mismatched dists.
- Do not key ship-detection on `CANARY_STATUS` — it reads `failure` on shipped runs; `CANARY_RELEASE_GATE` (P0.2) is the only ship signal. (Cost one false halt today before the chain scripts were fixed.)
- Do not fix a watched-but-silent detector sibling mid-batch (no speculative dist changes while a count runs).
- Do not delete the injector layer on a hunch — it holds the floor until the regen family's live record says otherwise.
- Do not start the clues/plot-structure lever before the P5 verdicts are in (§8 one-lever-at-a-time), and do not pretend the existing portfolio covers them (§1).

---

## 6. Acceptance (unchanged)

All four, on the same ≥4×4 matched batch: external mean ≥ 80 · |internal−external| ≤ 3 · ship rate 100% with zero reliability rows and zero top-4 caps · category floor mean ≥ 8.0. When that batch exists, the campaign is over.

---

## 7. Task board — expected durations

Basis for the estimates: today's observed run times (12–17 min per fresh run, sequential; an 8-arm A/B ≈ 2h wall), verdict derivation ~15–30 min, and the observed abort-class rate (**~1 new class per 5–6 fresh runs, each costing ~1–2h fix-test-rebuild + the rerun**). "Wall" is elapsed time with the chain unattended; "attended" is the human/agent time actually spent deciding, fixing, or reading.

| # | Task | Depends on | Runs / cost | Wall clock | Attended | Notes |
|---|---|---|---|---|---|---|
| ~~7.1~~ | ~~P5.1 critique-rewrite A/B + verdict~~ | — | ~~8 runs / ~£2~~ | ~~2h~~ | ~~1h~~ | ✅ DONE 2026-07-19 (actual: ~2.5h wall incl. 2 abort-class fixes; verdict FAIL, lever off) |
| 7.2 | Dual-value fresh A/B ×4 pairs + verdict + flip decision | reserve go-ahead (§3) | 8 runs / ~£1.6 | **~2h** (+1–2h if a new abort class fires) | ~45 min | Chain script pattern proven; per-flag metrics already wired (`1d6a4bc4`); verdict on its own detector |
| 7.3 | Voice A/B ×4 pairs (`AGENT9_VOICE_ENFORCE=enforce`) + verdict | 7.2 done (one lever at a time) | 8 runs / ~£1.8 | **~2–2.5h** (same abort contingency) | ~1–1.5h | Attended time is higher: tic-frequency counting needs a small counter script (~30–45 min to write) on top of the mark deltas |
| 7.4 | Decision sitting: reveal/mechanism buy-back re-read · pronoun-clarity go/no-go · injector-deletion re-pose | 7.2 + 7.3 verdicts | 0 runs / £0 | — | **~45–60 min** | Pure reads of the derived panels against the pre-committed rules in §2.4; mechanism's trigger is already ≥2/13, reveal's is not (1/13) |
| 7.5 | M2 re-derive on the final flag set | 7.2 (and 7.3 if voice flips) | 0 runs / £0 — or 4 runs / ~£1 if a clean matched set doesn't exist | 15 min — or ~1.5h | ~30 min | Today's pool mixes configs (CR on/off arms, two dists); a dedicated ≥4 confirmation batch is the likely branch |
| 7.6 | **Conditional: clues/plot_structure lever — design, build, A/B** | Triggered if 7.5 median <73 (§1 says likely; P5.1's FAIL made it more so) | 8 runs / ~£1.8 for its A/B | **~1–2 working days total** (design 2–4h · build+fixtures 4–8h · A/B 2h) | most of it | The single largest unknown on the board. No existing lever owns the two lowest categories; treat its scope as a fresh A_64-style design decision, not a quick fix |
| 7.7 | M3 final batch ≥4×4 + external reads | everything above at final defaults | 4+ runs / ~£1 | ~1.5h wall | **~1.5–2h** — externals are manual, one ChatGPT read per run (~15–20 min each) | The only step where attended time necessarily exceeds wall time |
| 7.8 | Item-10 recalibration (only if cap-free gap > 3) | 7.7 reads | 0 runs / £0 | — | ~1–2h | Rubric prompt surgery + re-score of the M3 batch; skipped entirely if the gap closes on its own |
| 7.9 | Close-out: commit the tree · restore `standby-timeout-ac` 2700 · report-dir decision · memory notes | last batch landed | 0 runs / £0 | — | ~30–45 min | The tree currently carries ~2 days of uncommitted work — do not let this ride to the end; commit at each verdict boundary |

**Reading the board:** the *funded* path (7.2 → 7.5) is ≈ **one working day** — ~5h wall, ~3h attended, ~£3.5 — and lands the final answer on whether caps and levers alone reach the median bar. The *likely* path adds 7.6 and becomes ≈ **2–3 working days**, gated on one design decision. M3 itself (7.7–7.8) is a half-day whenever the batch before it is clean. Contingency to hold in reserve mentally: **2–3 more abort classes** across the ~28 remaining runs at the observed rate — the machinery absorbs them at ~1–2h each without restarting anything.

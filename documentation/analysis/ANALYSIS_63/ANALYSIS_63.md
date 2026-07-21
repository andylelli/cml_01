# ANALYSIS_63 — What is left on the road to 80

**Written:** 2026-07-19 · **Fully revised:** 2026-07-20 (mid-7.2-final-arm) · **Supersedes:** A_62 "THE ROAD TO 80" and the A_62 tracker as the statement of the remaining path. The [TARGET_80_LEDGER](../../plan/target_80/TARGET_80_LEDGER.md) stays the numeric authority; derive, never hand-extend.

**The one-sentence status:** the floor is proven and the cap regime is broken; the P5 lever verdicts are landing (critique-rewrite FAILED and is off everywhere; dual-value's verdict derives today); four new abort classes (#9–#12) were found and killed same-day in two days of fresh-run batches; the cost instrument was found to under-report ~7× and the owner has bounded the campaign — **finish §7's board, then the batch era ends and future work runs off the preserved corpus with singular LLM runs only (§2.8)**.

---

## 0. Where the campaign stands (facts, 2026-07-20 evening)

| Milestone | State |
|---|---|
| **M1 — Floor** | ✅ CLOSED 2026-07-17 (8/8, zero aborts across the closing batch) |
| **P3 — Lever verdicts** | ✅ CLOSED: scaffold VALIDATED n=7 (−85%) → default ON `6d44f800` · leakage NO-FLIP, cap **source-fixed** `3cfdc7af` · dual-value INCONCLUSIVE → deferred to live data |
| **P4 — Gate** | ✅ SAT 2026-07-19: no new default flips; injector deletion DEFERRED (evidence gate unmet); buy-back chose reveal — weakened same day by M2 (reveal 0/4); re-read at 7.4 |
| **M2 — Check batch** | ✅ RUN 2026-07-19 (4/4 shipped): caps criterion 3-of-4 met — leakage **19/39 → 0/4** (source fix validated live), report-style 0/4, scaffold 1/4, reveal 0/4, mechanism 0/4; **`dualValueNoContrast` 2/4 = the only cap over the bar**. **Median 64 vs ≥73 — NOT met; residual is RAW CRAFT.** |
| **P5.1 — Critique-rewrite A/B** | ✅ CLOSED 2026-07-19: **FAIL** — 4/4 fresh pairs, targets flat-to-negative (opening_hook −0.50, dialogue 0.00, pacing 0.00), **prose −1.00**, rubric total −2.0. Lever OFF in env AND code. The lever billed as "the 74→80+ craft lever" had run ON in every recent live run; its first clean measurement showed it *costing* quality. |
| **P5.2 — Dual-value A/B (§7.2)** | ✅ CLOSED 2026-07-20: **NO FLIP — wiring finding.** 4/4 complete pairs; the lever was enabled and **silent on every treatment arm** while tide_on **fired the cap anyway** — the detector derives a contradiction pair that `worldState.contradiction` (the lever's input) doesn't carry. The P3 "null pair" was a live split-brain, not replay infidelity. Lever stays OFF; fix is data-plumbing (feed the regen the detector's own pair — the class-#5 lesson applied to RC-2.2), validated later per §2.8 with a singular probe. Cap counts 2/4→1/4 and treatment-side dips are story variance (arms the lever never touched carry no causal signal). |
| **Abort classes #9–#12** | ✅ All four found in the two fresh-run days, fixed same-day, fixture-pinned: **#9** time comparator did absolute-minutes diff across asymmetric meridiem (50 min read as 670) · **#10** `role.includes("victim")` substring predicate at ~30 sites poisoned GENERATION ("Friend of the victim" prompted as DECEASED) → `isVictimArchetype` head-noun predicate in `@cml/cml`, all sites swept · **#11** Agent 3 gave TWO cast members the Victim archetype (class #3's victim-side sibling) → duplicate-victim arm in `repairCaseSoundness` · **#12** the NSD-anchor repair's accepted plant was DESTROYED by the post-processing chain (class #8's inverse) → two plant→hygiene→re-collect rounds, round 2 impersonally phrased. #9/#10/#11 validated live on their aborting theme+arm; #12's validation rides on the current chain. |
| **Cost instrument** | ❌→✅ **The reports' `total_cost` under-reports ~7×** (owner-reported ~£100/week; token-audit-confirmed). True cost ≈ £1.3–1.7/fresh-run. All budget arithmetic rewritten (§3); no batch launches without owner go-ahead; §2.8 regime bounds the campaign. |
| **Data preservation** | ✅ `documentation/campaign_data/`: full LLM request log (message bodies — the authoritative spend record), response log, activity log, and the 78-story prose corpus, compressed and tracked, with refresh procedure. |

**M2 category floor (the craft ledger, 4 runs):** clues **5.25** · plot_structure **5.50** · character_clarity **5.75** · pacing **5.75** · opening_hook **6.00** · ending **6.25** · prose **6.25** · premise 7.00 · dialogue 7.00 · atmosphere 7.50 — target 8.0.

---

## 1. The honest arithmetic

- Internal median is **64**. The only external calibration we own (S0, 2026-07-13) read externals **+9.5 above internal** (73.25 vs 63.75). If that offset holds, today's craft externally reads ≈ **73–74** — the true remaining distance to the M3 bar (external mean ≥ 80) is ≈ **6–7 external points**. This extrapolates from n=4 capped-era reads; M3 re-measures before anything is concluded (Item 10 recalibration happens THERE).
- Those points live in the lowest categories, and **P5.1's FAIL widened the unowned set to four: clues 5.25, plot_structure 5.50, opening_hook 6.00, pacing 5.75** (character_clarity 5.75 has the pronoun-clarity candidate; dialogue has voice). Dual-value regen removes the `clues ≤6` *cap*, but M2's clues marks were 5-5-5-6 mostly *uncapped* — the deep deficit is raw craft.
- **The lever-portfolio gap, stated plainly:** if 7.2's and 7.3's verdicts land small, the road to 80 runs through a clues/plot_structure/opening_hook lever that does not exist yet (§7.6) — and under the §2.8 regime its validation must come from the corpus + singular probes, not batches.
- A quiet tailwind, not yet measured: class #10 taxed any historical run whose cast carried a relational victim role (a living character written as deceased); classes #11/#12 taxed others. Post-fix baselines may drift up on their own. Attribute nothing to a lever without matched pairs on one dist.

---

## 2. The remaining path (in order, with gates)

### 2.1 P5.1 verdict — critique-rewrite ✅ RESOLVED 2026-07-19: FAIL, lever OFF
4/4 pairs, raw marks: targets −0.50/0.00/0.00; prose −1.00; total −2.0; treatment lost or tied 3 of 4 pairs. FAIL branch taken same-day: `AGENT9_CRITIQUE_REWRITE=false` in `.env.local` (code default already false), cost banked, opening_hook/pacing recorded as unowned.

### 2.2 Dual-value fresh A/B ✅ RESOLVED 2026-07-20: NO FLIP — the wiring branch fired
Exactly the pre-committed "wiring, not flip" outcome: lever enabled + silent on 4/4 treatment arms, cap fired on a silent arm (tide_on) → the detector's pair derivation and `worldState.contradiction` are split-brained on LIVE runs. Lever stays OFF. Follow-up (corpus era, free): trace where the detector's pair comes from vs what populates `worldState.contradiction`, rewire the regen pass to consume the detector's pair (class-#5 doctrine: repairs consume the gate's own signal), fixture it, and validate with ONE probe run when a cap-firing story is next generated. The `dualValueNoContrast` corpus question (which stories fire it, and whether the clue text or the world-state is the deficient side) is answerable from the 70-run dataset without any spend.

### 2.3 Voice A/B ✅ RESOLVED 2026-07-20: FAIL / NO-OP — and Item 14's autopsy
Dialogue Δ 0.00 (bar +1); nothing regressed; but the decisive fact is that **leakage was 0 on all eight arms, so enforce's only active behavior never fired** — the A/B measured a lever with an empty enforcement surface. The real finding: **tic coverage 0/– on every run** — designed signature tics never reach attributed dialogue anywhere; the occasional appearances are unattributed narration echoes (the exact "artificial" read from Item 14's externals). The voice system needs a *generation-side* redesign (tics into character speech at drafting time), not enforcement — that design belongs to the corpus era (§2.8), informed by the 8 runs' telemetry, validated by a singular probe. `AGENT9_VOICE_ENFORCE` stays off. The P5 lever era closes 0-for-3: critique-rewrite harmful, dual-value unwired, voice enforcement surface empty — **every craft category in §1 is now unowned, and the road to 80 runs through corpus-driven design work, not flag flips.**

### 2.4 Decision sitting (§7.4, free) — buy-backs · pronoun candidate · injector deletion
- **Reveal buy-back:** was 1/13 on the first post-fix day (trigger ≥2 unmet). Re-count over all P5-era shipped runs at the sitting. Under §2.8 a funded buy-back A/B is no longer available — if the trigger ever fires, the response is corpus analysis + at most a singular probe run.
- **Mechanism:** kept firing with its lever ON (both clock arms of 7.2, M1-era 6/39). The sitting's question is now "is `AGENT9_REGEN_MECHANISM` doing anything at all" — answerable from the corpus (compare firing rates across the flag's ON-history) before any spend.
- **Pronoun-clarity candidate:** decision-gated on 7.3's outcome and character_clarity's post-P5 mean.
- **Injector deletion:** still last, alone, with a smoke run — and under §2.8 that smoke run is the period's singular run, not an add-on.

### 2.5 M2 re-derive on the final flag set (§7.5, free)
Derive the M2 criteria over the final-config shipped runs (7.2's control arms + any voice arms on the final defaults; ≥4 matched on one dist). If dual-value flips in 2.2, note the config split honestly rather than mixing. **If median <73 with all levers settled, the residual is §1's portfolio gap — no more reliability spend.**

### 2.6 M3 — the final gate (§7.7, ~£6 + manual reads)
ONE ≥4×4 matched batch at final defaults — the campaign's last batch, full stop:
- mean external (ChatGPT) **≥ 80** — one manual read per run (owner)
- |internal − external| **≤ 3** — recalibrate ONLY if the cap-free gap still exceeds 3 (§7.8)
- ship rate 100% · reliability rows 0 · top-4 caps 0 · category floor mean ≥ 8.0

### 2.7 Close-out debts (§7.9)
Restore `standby-timeout-ac` 2700 · novelty skeleton-judge stays SHADOW until telemetry disagrees · final commits (fixes #11/#12, docs, artifacts, campaign-data archive) · refresh the campaign-data snapshots to include the final batches · decide the deleted `mystery-*` report dirs (history safe in `8b2a3e8e`).

### 2.8 THE REGIME AFTER 7.9 (owner decision, 2026-07-20)
When §7's board closes, the batch era ends. **All campaign data is preserved** (`documentation/campaign_data/` + per-run report/prompt archives) and **future work runs off the existing corpus** — analysis, detector work, lever design, calibration all derive from the ~70-run dataset already paid for. LLM spend is limited to **singular runs, periodically** (a smoke run to validate a fix, one probe of a new lever) — **no multi-run batches, no fresh-run A/Bs**. Anything that seems to need a batch instead needs a better use of the corpus, or an explicit new owner decision.

---

## 3. Budget — REWRITTEN 2026-07-20: the cost instrument was wrong by ~7×

**The finding (owner-reported ~£100/week, audit-confirmed):** every £ figure in this campaign was derived from the reports' `total_cost` field, which the ledger had ALREADY flagged as suspect (M1-3, 2026-07-14) and which a token-level audit of `llm-prompts-full.jsonl` + `llm.jsonl` (chars/4 × Azure list prices) shows **under-reports by ~7×**. True cost ≈ **$1.6–2.2 (£1.3–1.7) per fresh run**. The 29 runs since Jul 17 ≈ £30; the full week (M1 attempts, P3 replay firings, S0) ≈ £100 — the owner's number is fully explained. RC-1's lesson relearned on the budget axis: an unverified number propagated into every estimate.

**Standing rules:** derive spend from the token logs, never `total_cost` (tracker fix is backlog) · one fresh run ≈ **£1.5** · an 8-arm A/B ≈ **£12** · derives are free · M3 ≈ £6 + manual reads · **every RUN step requires explicit owner go-ahead** — given for the §7 board on 2026-07-20, bounded by §2.8 thereafter.

---

## 4. Risks, stated before they bite

1. **The abort-class pool is still producing.** Four new classes (#9–#12) in ~25 fresh runs across two days — one per ~6 runs, exactly the §4 rate as originally written. Every remaining batch budgets same-day-fix time; the machinery (halt-on-abort, resumable done-files, fixture-first fixes, validate-on-the-aborting-theme, matched-dist re-queues) is proven and mandatory. Expect ~1–2 more classes before the board closes.
2. **Detector precision and repair/hygiene ORDERING are the frontier.** #9/#10 were precision FPs; #12 was two correct subsystems (repair, hygiene) destroying each other's work in sequence. When a gate fails, suspect the detector or the pipeline's self-interference before the story — then prove it with the artifact.
3. **Infra now has two observed failure modes:** the Azure DNS flap can kill the RubricScorer *after* the gate passes (shipped-but-unscored — chains must require shipped-AND-scored), and host sleep suspends-then-resumes a run across days (content unaffected; duration stats garbage; RC-5 stamps protect the reports).
4. **The −9.5 internal/external offset is the plan's biggest unverified number.** M3's reads answer it; nothing before M3 does.
5. **`.env.local` vs code-default drift.** A/B control arms are valid only because chains force flags per-process (dotenv never overrides pre-set env). Verify via agent labels in the prompt log, every batch.
6. **The K2 confound rides along.** Matched pairs ≥4 on one dist, raw marks only; no n=1 conclusion.

---

## 5. The do-NOT-do list

- Do not budget from `total_cost` — token logs only (§3).
- Do not launch a batch without an explicit owner go-ahead; after 7.9, do not launch batches at all (§2.8).
- Do not re-litigate M1. An abort in a remaining batch gets same-day-fix + rerun.
- Do not hand-extend derived tables — `derive-ledger-panels.mjs` or nothing.
- Do not read any verdict below 4 complete scored pairs, on grade bands, or across mismatched dists; a shipped-but-unscored arm is not a datapoint.
- Do not key ship-detection on `CANARY_STATUS`; `CANARY_RELEASE_GATE` + a `[Rubric]` line is the shipped-AND-scored signal.
- Do not fix a watched-but-silent detector sibling mid-batch; do not make ANY dist change mid-batch except a same-day abort-class fix, and re-queue arms for matching when the fix touches generation.
- Do not delete the injector layer on a hunch — last, alone, smoke-run-validated.
- Do not start the clues/plot_structure lever before 7.2/7.3 verdicts are in; do not pretend the current portfolio covers §1's four unowned categories.

---

## 6. Acceptance (unchanged)

All four, on the same ≥4×4 matched batch: external mean ≥ 80 · |internal−external| ≤ 3 · ship rate 100% with zero reliability rows and zero top-4 caps · category floor mean ≥ 8.0. When that batch exists, the campaign is over.

---

## 7. Task board — expected durations (costs at TRUE prices, §3)

**Board status as of 2026-07-21: 7.1–7.5 CLOSED · 7.6 is the live item · 7.7–7.9 pending.**

Basis: observed run times (12–17 min/run; an 8-arm A/B ≈ 2h wall at best), verdict derivation ~15–30 min, abort-class rate ~1 per 6 fresh runs at ~1–2h fix + rerun each. Observed reality check: 7.2's "2h" batch took ~2 days wall — one DNS-killed arm, one overnight host sleep, two abort classes, two matched-dist re-queues; 7.3 by contrast ran and closed same-day with one abort class (#14). "Wall" assumes none of that; plan for some of it. **Post-hoc: the class rate held — #13 and #14 landed after this doc was written, making it six classes (#9–#14) across the 7.x batches, still ~1 per 6 fresh runs.**

| # | Task | Depends on | Runs / true cost | Wall | Attended | Status / notes |
|---|---|---|---|---|---|---|
| 7.1 | P5.1 critique-rewrite A/B + verdict | — | 10 runs / ~£16 | 2.5h actual | ~1.5h actual | ✅ DONE 2026-07-19 — FAIL, lever off everywhere; found classes #9/#10 |
| 7.2 | Dual-value A/B + verdict + flip decision | — | ~14 runs incl. reruns / ~£20 | ~2 days actual | ~3h actual | ✅ DONE 2026-07-20 (`c194a2d4`) — **NO FLIP**, wiring finding; lever stays OFF, rewire deferred to the corpus era (§2.2); found classes #11/#12 |
| 7.3 | Voice A/B (shadow vs enforce) + verdict | 7.2 verdict read | 8 runs / ~£12 | same-day actual | ~1–1.5h | ✅ DONE 2026-07-20 (`8e7f3b2c`) — **FAIL / NO-OP**: enforcement surface empty (leakage 0 on all 8 arms), tic coverage 0 everywhere → voice is a generation-side problem (§2.3). Found class #14; fixed the WARNINGS truncation that had been hiding Agent-9 telemetry. **The campaign's last A/B batch — done.** |
| 7.4 | Decision sitting: buy-backs · pronoun · injector deletion | 7.2 + 7.3 | 0 / £0 | — | ~45–60 min | ✅ DONE 2026-07-20 — reveal buy-back **CLOSED-UNFUNDED** (0/16) · mechanism lever **LEFT ON, unresolved** (no OFF baseline exists — corpus question) · pronoun-clarity candidate **LIVE** (character_clarity 6.19 < 6.5) · injector deletion **STAYS DEFERRED** (rule wanted scaffold ≈0; it is 50%) |
| 7.5 | M2 re-derive on final flag set | 7.2 (+7.3 flip if any) | 0 / £0 | 15 min | ~30 min | ✅ DONE 2026-07-20 — n=16 final-config: **median 61 (mean 62.8, 57–74) vs ≥73 — NOT met.** Caps: scaffold **8/16** (the P3 "−85% / residual 3/20" estimate **does not hold** at fresh-run n=16) · dualValue 5/16 · mechanism 2/16 · reportStyle 1/16 · leakage **0/16** (source fix holding) · reveal 0/16. Residual = raw craft, per §1 |
| 7.6 | **Conditional:** clues/plot_structure/opening_hook lever — DESIGN ONLY | 7.5 median <73 | 0 / £0 (design) + 1 probe run ~£1.5 | — | 2–4h design | 🟡 **TRIGGER FIRED 2026-07-20 — THIS IS THE NEXT WORK ITEM.** Scope now includes the **scaffold-residual autopsy** (why 50% at n=16 when P3 read 15%). Corpus-driven design, ONE probe run, no A/B batch (§2.8) |
| 7.7 | M3 final batch ≥4 + external reads | all above at final defaults | 4+ runs / **~£6–8** | ~1.5h + fix time | **~1.5–2h** (manual reads, owner) | ⬜ PENDING — the campaign's final batch, full stop. Gated on 7.6 landing something worth measuring |
| 7.8 | Item-10 recalibration (only if gap > 3) | 7.7 reads | 0 / £0 | — | ~1–2h | ⬜ PENDING / conditional — skipped if the cap-free gap closes |
| 7.9 | Close-out: commits · standby 2700 · data snapshot refresh · regime handoff | last batch | 0 / £0 | — | ~30–45 min | ⬜ PENDING — **open debts:** restore `standby-timeout-ac` 2700 · refresh campaign-data snapshots to include 7.2/7.3 batches · decide the 56 unstaged `mystery-*` report-dir deletions (history safe in `8b2a3e8e`) · novelty skeleton-judge stays SHADOW. Ends the batch era; §2.8 takes effect |

**Reading the board (updated 2026-07-21):** 7.1–7.5 are CLOSED; the P5 lever era finished **0-for-3** and every category in §1 is unowned. Remaining spend ≈ **£8–10** (7.6 probe ~£1.5, M3 ~£6–8) — 7.3's ~£12 is spent and no further A/B money is budgeted. Remaining wall: 7.6 is attended design work off the corpus (no batch); M3 whenever 7.6 has produced something worth measuring and the owner has reading time; then 7.9 and the corpus era begins.

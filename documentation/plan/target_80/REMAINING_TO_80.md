# WHAT'S LEFT TO REACH 80 — the remaining-work list

**Date:** 2026-07-14 · **Branch:** `redesign/agent-blue-sky`
**Companions:** [ROADMAP_TO_80.md](ROADMAP_TO_80.md) (the full grounded plan, §10 = the phased steps) · [TARGET_80_LEDGER.md](TARGET_80_LEDGER.md) (the standing three-panel scoreboard — the numbers)
**What this is:** the short, execution-ready list of everything still between us and a *validated* 80. The roadmap is the reasoning; the ledger is the scoreboard; **this file is the to-do list.** If a line here conflicts with the ledger, the ledger wins (update this file).

---

## 0. Where we are right now (one paragraph)

**Every CODE and CONFIG step in the roadmap is done.** The initiative is in its measurement phase. The **S0 baseline batch is complete** (4/4 shipped, 0 hard stops) and carried the **first external reads: mean ChatGPT 73.25 (75/69/73/76)** — only **6.75 points off 80**, much closer than the internal rubric suggested. What remains is almost entirely **runs and reads**, plus a handful of small candidate fixes surfaced by those first external reads. The two things still pinning the score: the **scaffold/report-style cap** (fired on 2/5 shipped runs, the lever wins only ~half the time) and the **craft floor** (category mean 6.5; even cap-free runs top out at ~70 internal).

**Acceptance bar for "80" (unchanged):** mean ChatGPT ≥ 80 · internal−external gap ≤ 3 · ship rate 100% · over a ≥4×4 matched batch.

---

## 1. The remaining path at a glance

```
[S0 baseline ✅ done]
   → P-fixes  small pre-batch fixes (Items 9/11/12)      ← optional, do the cheap ones first
   → P2  M1 gate: 8/8 consecutive scored runs, 0 aborts  ← RUN ×8
   → P3  M2 gate: caps ≤1 across ≥4, median ≥73          ← VERIFY (+RUN ×4 if fixes needed)
   → P4  the powered A/B: ≥16 arms, one flag per replay   ← RUN, then flip defaults + delete injectors
   → P5  craft lift A/B + final ≥4×4 validation + reads   ← RUN + SCORE
   → 80 ✅
```

**Only three milestones remain: M1 (floor), M2 (ceiling), M3 (target).** All are gated on runs, not code.

---

## 2. Still-open candidate fixes (from the first external reads)

These were found on S0 and are the only *code* candidates left before the batches. None is confirmed necessary — decide each with a quick check, fix only if it earns it. Do the cheap, high-signal ones (11, 12) first; they may lift the opening_hook / plot_structure floor before we spend batch budget.

| # | Item | Signal strength | What to check first | Kind if it earns a fix |
|---|---|---|---|---|
| **11** | **Ch9/Ch10 duplicated reveal** — "Ch10 should be aftermath only" | **Flagged by ALL FOUR external reads** — the single strongest signal | **ROOT-CAUSED (2026-07-14), NOT yet fixed.** *Not* a regen pass (ruled out empirically — zero `missing_resolution`/`culprit_unlinked` regen calls in any run; those passes correctly no-op because Ch9 resolves). Cause = **stage-mode misclassification**: the aftermath guard at `obligation-block.ts:744` only fires when Ch10 is `aftermath_consequence`, but `getCulpritRevealChapter` (`clue-validation.ts:171-180`) falls back to the **last** chapter when the CML `culprit_revelation_scene` ref is unresolvable → Ch10 gets the full "MANDATORY RESOLUTION" mandate, so Ch9 (final_trap) + Ch10 both fully reveal. **FIXED 2026-07-14 (beat-aware classifier).** `resolveStageModeKey` (`clue-validation.ts`) now returns `aftermath_consequence` for the final chapter when the outline authored a `revelation` final beat after an earlier `final_trap` — honoring the authored arc *before* the culprit-reveal-chapter fallback can bind the reveal to the last chapter. So Ch10 now gets the AFTERMATH CONTRACT ("do not re-stage") instead of MANDATORY RESOLUTION. Only fires when a genuine earlier `final_trap` exists (never suppresses a legitimately-late reveal); no-op on non-Golden-Age (beatless) outlines. New both-directions suite `stage-mode-item11-aftermath.test.ts` (5 tests, +13 existing ITEM 11 tests); full prompts-llm suite 737 green. `build:all` + dist verified live 2026-07-14. | ✅ done + live · confirm absent on M1 |
| **12** | **Ch1 opens with reveal-like exposition, then "restarts" with the discovery** (poison + tide) | 2/4 reads; also depresses the measured opening_hook floor (6.2) | **RESOLVED (2026-07-14).** Root cause = the deterministic clue-materialization repair (`buildDeterministicClueParagraphs` / `applyDeterministicCluePatch`, `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts`), **not** the grounding-lead pass — it prepended two templated clue paragraphs at index 0, pushing the real generated opener to para 3. Fixed in source at commit `4826eb80` (`earlyInsertAt = max(1,…)`, never opens the chapter) with a regression test; S0 predates the fix. **Was stale in the worker's built dist → `build:all` rebuilt + dist verified live 2026-07-14.** | ✅ done + live · confirm absent on M1 |
| **9** | **`dualValueNoContrast` REOPENED** (acoustic) — central clue stated as two flat values, not one contradiction → clues ≤6 | 1/5 shipped | Compare the acoustic central-clue phrasing against the A_57 D2 detector — is it a regression or a sub-shape the D2 fix missed? | `CODE` (small, targeted) |

**Guardrail:** any fix here ships with a both-directions test + `npm run build:all` (worker consumes dist), and must not reintroduce a cleared defect class — the P4.2 rewrite-acceptance validator already guards that, keep it green.

---

## 3. P2 — M1 gate: prove the floor (RUN ×8)

**Goal:** 8/8 consecutive post-change runs reach a scored release gate (`passed` or `warning`/needs-review), **zero aborts**. S0 and smoke runs do **not** count toward the 8.

- [ ] **P2.1** — `RUN` — two sequential 4-run batches: `node scripts/canary-core.mjs`, diverse `CANARY_THEME` per run.
- [ ] **P2.2** — `CODE` (conditional) — any abort → root-cause (report diagnostics → `failure_lineage` → walk `documentation/prompts/actual/run_*/` in numeric order to bound where the artifact was created) → fix → **restart the 8-count**.
- [ ] Per run: update the ledger's §1 Run Log + tick any §2 Reliability occurrence. Every fired cap must have a matching regen label in `logs/llm-prompts-full.jsonl` — absent label = S6 wiring bug, fix before proceeding.

**Exit M1:** 8/8 consecutive scored, all §2 Reliability rows at 0.
**Watch:** Item 7 (victim-timeline `vanished` FP) was fixed *after* S0-3/4 launched — those two may still show the warn-level FP; the fix is now in, so the M1 batch must read clean.

---

## 4. P3 — M2 gate: extinguish the caps (VERIFY, +RUN ×4 if needed)

**Goal:** top-4 Cap-Ledger rows at ≤1 occurrence across ≥4 runs; median shipped rubric ≥ 73.

- [ ] **P3.1** — `VERIFY` — on the M1 batches, confirm every cap that appears in any report has a corresponding `Agent9-Regen-*` label. Absent label = wiring bug → `CODE` fix.
- [ ] **P3.2** — `RUN` ×4 — re-batch only if P3.1 required fixes; else the M1 batches double as the M2 sample.

**The known M2 risk (Open Item 8):** the **scaffold / report-style regen fires on every capped run but wins only ~half the time** (won on the clean `identity` run; lost on `acoustic`/`tide`). This is a *lever-effectiveness* question, not a wiring one. **By design it is answered in the P4 A/B, not patched blind** — if the A/B shows the lever doesn't move cap frequency, strengthen the pass (prompt / attempts / align the deterministic clear-check with the rubric LLM's broader reading of "report-style"). Do not touch it before P4.

**Exit M2:** top-4 caps ≤1 across ≥4 runs; median shipped ≥ 73.

---

## 5. P4 — the powered A/B: PROVE (RUN, ≥16 arms) — *the move deferred since A_54*

**Goal:** every lever gets a powered verdict; code defaults match the evidence.

- [ ] **P4.1** — `VERIFY` — assemble the pool: ≥4 shipped runs from P1–P3, diverse on era/setting/cast/crime/mechanism, chapter-count known. No `SYNTHESIZING_CODE 7` on replay.
- [x] **P4.2** — `CODE` — rewrite-acceptance validator (transition + mechanism predicates) — **DONE** (`a408451b`). Keep the suite green; it's the guard that lets rewrite levers be A/B'd safely.
- [ ] **P4.3** — `RUN` (≥16 arms) — `scripts/exp-regen-clue-ab.mjs --flag <NAME>`, **one flag per replay** (`--agents 6,9` for the Agent-6 lever; `--treatmentValue enforce --controlValue shadow` for the plausibility judge). Read **raw scores + cap frequencies, never the grade band** (60/63/70 quantization exaggerates). Accept a lever only if its target category/cap moved and nothing regressed.
- [ ] **P4.4** — `CODE` — flip code defaults for winners; **delete the injector layer** (LLD P7) once every RC-1 regen is validated-on. Empty-`.env.local` run must then behave like the validated config.

**Levers with a pending verdict:** `AGENT9_REGEN_SCAFFOLD` (the big one — Item 8), `AGENT9_REGEN_CLUE`, `AGENT9_REGEN_MECHANISM`, `AGENT9_REGEN_RESOLUTION`, `AGENT9_REGEN_CULPRIT_EVIDENCE`, `AGENT6_DT_EVIDENCE_COMPLETENESS`, `AGENT3B_PLAUSIBILITY_JUDGE` (shadow→enforce).

**Exit P4:** per-lever accept/reject table with deltas appended to the ledger; defaults flipped.

---

## 6. P5 — the craft lift + final validation (RUN + SCORE) — *the last 74→80 push*

**Goal:** lift the category floor to 8s and pass the full acceptance bar.

The S0 Category Floor (mean **6.5**, no category at target) names the targets — attack the lowest first:

| Category | S0 mean | Lever / route |
|---|---|---|
| **pacing** | 5.8 | critique-rewrite targeting; scene-grounding (Item 5) |
| **prose** | 5.8 (cap-dragged) | recovers when the scaffold cap is extinguished (P4) |
| **plot_structure** | 6.0 | Ch10 double-reveal fix (Item 11); outline |
| **opening_hook** | 6.2 | Ch1 "restart" fix (Item 12); critique-rewrite |
| **clues** | 6.2 | `dualValueNoContrast` fix (Item 9) |

- [ ] **P5.1** — `RUN` A/B — A/B the craft levers in isolation: `AGENT9_CRITIQUE_REWRITE` aimed at opening_hook/dialogue/pacing, `AGENT9_VOICE_ENFORCE=enforce` (RC5.3 repair is built, untested live), model tiering. Each lever must move its target category ≥+1 with nothing regressed.
- [ ] **P5.2** — `RUN` + `SCORE` — final validation batch: **≥4×4 matched, one external ChatGPT read per run.**
- [ ] **P5.3** — `VERIFY` — watch Open Items 4–5 (agent2-cast phase threshold, scene grounding) at batch scale; recalibrate only if they persist.

**Also fold in the softer external-read signals here** (craft/tuning, not blockers):
- **Item 14** — signature tics read as "artificial repeated catchphrases" (3/4 reads). The voice A/B must measure *dialogue-mark movement*, not just leakage; consider a tic-frequency cap / variation.
- **Item 15** — sub-threshold prompt-leakage lines externally visible ("The hour stood at…", "The investigation had entered a new phase…"). Collect the quoted lines as linter fixtures.
- **Item 13** — pronoun drift seen by all four reads while the internal `pronounsUnstable` cap stayed silent. Run the pronoun validator standalone on the S0 stories; if it reads clean, feed it the externals' examples.

---

## 7. The honesty criterion — recalibrate the gap (DECISION, after caps clear)

**Open Item 10.** The internal rubric now **underscores by ~9.5** (S0 per-run gaps −16/−3/−13/−6; internal 63.75 vs external 73.25). This is the **safe direction** (no false-80 risk) but it **fails the M3 gap ≤ 3 criterion**.

- Do **not** recalibrate yet. The biggest single-category divergences are on the **capped** runs (tide/acoustic) — extinguishing the scaffold family (P4) is expected to close much of the gap on its own.
- **After P4**, re-measure the gap on cap-free runs. If it's still > 3, recalibrate the internal rubric against the external reads (the reads score plot/pacing/ending 1–2 marks higher than internal on the same stories) — this is a rubric-tuning task, not a pipeline change.

---

## 8. Budget & definition of done

**Remaining run budget — £15, at real cost.** The roadmap's £35–55 used a stale **£1–1.50/run** estimate. The ledger's *actual* costs are **£0.20–0.29 per full run** (S0: £0.21 / £0.23 / £0.21 / £0.20) and **~£0.30 per A/B replay-pair** (a replay runs Agent 9 twice — control + treatment — over hydrated upstream artifacts, skipping agents 1–8). So **£15 ≈ ~60 run-equivalents** — *more* than the whole plan strictly needs. The extra headroom is spent on **statistical power and reach**, not more coverage, and the last third is held as a **decision-gated reserve** so it lands where the data says it's needed.

| Tranche | What | Est. cost |
|---|---|---|
| **Committed (~£10.40)** | M1 floor 8/8 (£2.00) · P4 A/B on the levers that can show a delta — **scaffold ×8 matched pairs** + 2 levers ×4 (£4.80) · P5 craft A/B incl. **model-tiering**, 3 levers ×4 (£3.60) | ~£10.40 |
| **Decision-gated reserve (~£4.60)** | Read the A/B + craft deltas at the gate, flip winners, **then** spend: if projecting **≥ 78** → an 8-run final validation + external reads; if **< 76** → a second craft iteration / the Item-11 fix A/B, re-measure, then validate | ~£4.60 |

*The budget is still the plan — but the binding discipline is now **N, not £**.* Never A/B or validate below **4 matched pairs** (run-to-run SD is ~5–8 points; fewer pairs certify noise — the exact A_54 trap). Put any surplus into **A/B power and the final-batch N**, never into the reliability count (8/8 already saturates it — reliability runs earn least at the margin). Scope the A/B to levers whose caps actually fired in the baseline; a lever that never fired can't show movement, so A/B'ing it burns runs for no signal.

**Done — all four must hold on the same ≥4×4 matched batch:**
- [ ] Mean external (ChatGPT) score **≥ 80**
- [ ] Internal − external gap **≤ 3** (in absolute value)
- [ ] Ship rate **100%** (every run reaches a scored gate, zero aborts)
- [ ] Every Reliability row **0**, every top-4 Cap row **0**, Category Floor mean **≥ 8.0**

When all four hold: flip the remaining defaults, archive the ledger's final state, and stop.

---

## 9. Do-next order (if you only read this section)

1. **Quick checks on Items 11 & 12** (Ch10 double-reveal, Ch1 restart) — cheap, highest external signal, may lift two floor categories before spending batch budget. Fix if earned.
2. **Run the M1 gate (P2): two 4-run batches, 0 aborts** → this is the single biggest remaining gate and unblocks everything after it.
3. Roll M1 into the **M2 verify (P3)**; only re-batch if wiring fixes were needed.
4. **Run the powered A/B (P4)** — settle the scaffold lever (Item 8) and flip defaults.
5. **Craft-lift A/B + final ≥4×4 with external reads (P5)**, recalibrate the gap (Item 10), and check the four done-criteria.

*Golden rules stand: one lever per measured replay · never conclude from n=1 · verify a lever fired by its agent label in `logs/llm-prompts-full.jsonl` · deterministic code may VERIFY, never WRITE.*

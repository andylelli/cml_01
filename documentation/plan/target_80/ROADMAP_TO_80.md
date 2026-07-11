# ROADMAP TO 80

**Date:** 2026-07-11 · **Branch:** `redesign/agent-blue-sky` · **Owner:** Agent-9 / pipeline
**Companion:** the *Road to 80* dashboard (standing scoreboard) · **Supersedes for planning:** the scattered "still blocks 80" tails of A_57–A_61 (those remain as history + detail).
**Grounded in:** A_50→A_61, `packages/rubric-score/src/{score,hard-caps,facts,types,bands}.ts`, and runs `mystery-1783069748150` / `-1783162628179` / `-1783163491931`.

---

## 0. TL;DR — the thesis in one paragraph

**The prose is already good enough.** Per-chapter craft scores **88–98**; one run (`run_33ecb4ad`) scored **94 uncapped**. What pins the *final* rubric at **60–74** is two finite, nameable things — and neither is craft:

1. **A short list of CAPS** clamps an otherwise-shippable draft (mechanism-too-early → plot/pacing ≤6; report-clearance → prose ≤6; role-collision → ceil 55–60; leakage/scaffold → ceil 65).
2. **~50% of runs HARD-FAIL** at validation *before they can be scored at all* (invented walk-ons, cleared-culprit, unbridged transitions, validator FPs).

The machinery to fix both is **built, tested, and `default-off`** — waiting on a powered **N≥4 matched A/B** that, per A_54, we have *never actually run*. So the plan is not "write more code" and not "write better prose." It is: **Floor (ship-rate → 100%) → Ceiling (extinguish the caps) → Prove (run the A/B, then flip defaults).**

---

## 1. Where we want to be — the acceptance bar for "80"

"80" is not a single run reading. Define it precisely and hold the line:

| Criterion | Target | Why |
|---|---|---|
| **Mean external score (ChatGPT/human)** | **≥ 80** | The A_57 bar; the human-facing number is the real one. |
| **Internal − external gap** | **≤ 3** | Proves the internal rubric is *honest*, not blind-spotting (the A_57 lesson; already ~0 at A_59). |
| **Ship rate** | **100%** | A run that aborts can never score 80. Currently the bigger loss. |
| **Batch** | **≥ 4×4 matched**, diverse era/setting/cast/crime/mechanism | Single-run K2 is confounded (A_54); one reading is directional only. |

**How the score is built (the mechanics that define the bar):** ten equal categories, each `/10`, summed to `/100` (`types.ts`). To reach 80 you need **an average mark of 8.0 AND no overall ceiling below 80 may fire** (`hard-caps.ts`). The ceilings are the killers: role collision → **55–60**, material leakage/scaffold → **65**, pronoun instability → **69**, victim unnamed → **72**, weak murder method → **75**. Any *one* of these clamps the whole `/100` below 80 regardless of category marks.

---

## 2. Where we are — the two axes, not one number

- **Best honest score:** 74 (A_59, the run where internal = ChatGPT). Internal touched 80 once (A_57) but ChatGPT said 70 — a judge blind-spot, now closed.
- **This week:** re-measure 64, **run 1 hard-failed (7 majors)**, run 2 shipped **67**.
- **The ceiling is caps, not craft:** run 2's prose scored 88–98 per chapter, then the rubric returned 67 — "mechanism explained too early" clamped plot & pacing to ≤6.
- **The floor is reliability:** run 1 died on 5 invented walk-ons + cleared-culprit + an unbridged transition. Never scored.

**Reframe:** stop tracking a rolling average. Track **ceiling** (best score when it ships) and **floor** (does it ship) separately. The dashboard does exactly this.

---

## 3. The tracking system — the "80 Ledger" (replaces the analysis-doc diary)

The A_50→A_61 cadence is a **linear diary**: one single-run post-mortem per iteration, which is why the same three lessons (confounded score, whack-a-mole, false gates) get re-derived every time. Replace it with a **standing scoreboard over a rolling batch of ≥4 matched runs**, three panels:

1. **Reliability Ledger** — the enumerable hard-fail majors, each mapped to its repair lever + state (§6). Target: every row → 0 occurrences.
2. **Cap Ledger** — every ceiling/clamp that fires on a *shipped* draft, ranked by impact × frequency, each mapped to a lever + state (§5). Target: every row → 0 frequency.
3. **Category Floor** — the ten rubric marks vs the 8.0 each needs; surfaces the 4 craft-limited categories (prose 5, dialogue 6, character 6, clues 7) as the *last* lift.

**Operational rule:** after every batch, update the three ledgers from the run reports (`apps/api/data/reports/*/`), not prose. "Reach 80" is done when all Reliability rows are 0, all Cap rows are 0, and the Category Floor averages ≥ 8 — a checklist, not a vibe.

> The dashboard's data arrays live in one block at the top of the HTML; re-point them at a real ≥4-run batch and it becomes the live scoreboard.

---

## 4. The plan — three moves, in strict order

### MOVE 1 — FLOOR: ship rate → 100%  *(cheapest, highest leverage, nobody's tracking it)*

A run that aborts scores nothing, so reliability dominates today. The failures are a known list; most already have built levers that are simply off.

- [ ] **Enable `AGENT9_REGEN_TRANSITION`** (RC3.3, built this session) — auto-inserts a body-discovery bridge instead of failing `missing_case_transition_bridge`. Verify it fires: grep `Agent9-Regen-Ch*` in the prompt log.
- [ ] **Land the case-soundness repair-then-promote** (RC2.5) — `repairCaseSoundness` (built, runs unconditionally) fixes culprit=victim / unknown-gender at source; then enable `AGENT9_BIBLE_GATES_BLOCKING` so residual unsound cases are repaired-not-aborted. Confirm the gate never aborts a sound case.
- [ ] **Fix `illegal_named_walk_on` (LIVE GAP — needs new code).** The LLM invents out-of-cast names (Mrs Green, Mr Bayless…) → 5 majors in run 1. Options, cheapest first: (a) a generation obligation forbidding named non-cast walk-ons; (b) a deterministic *repair* that anonymises an out-of-cast named walk-on to a role noun ("the maid") rather than aborting. **This is the single biggest reliability blocker and has no lever yet.**
- [ ] **Fix `cleared_culprit_conflict` (LIVE GAP — needs new code).** The culprit is also "cleared" in the reveal. Root: the clearance path can clear the culprit. Add a construction/validation guard: the culprit is never a clearance target (extend `computeLiveCulprits` / the clearance obligation).

**Acceptance (M1):** 8 consecutive canary runs, 0 hard-aborts, each reaches a scored release-gate (`passed` or `needs_review`, never `aborted`/`failure`).

### MOVE 2 — CEILING: extinguish the top caps  *(lift the shipped score from ~67 toward the mid-70s)*

Each cap maps to a built lever. Enabling a flag makes the machinery *active* — but note a gate/embargo alone does not fix a cap; the **inject→regen** passes are what actually remove the offending prose. Work top of the Cap Ledger (§5) down.

- [ ] **Inject→regen family (RC-1):** confirm `AGENT9_REGEN_CLUE` + `AGENT9_REGEN_SCAFFOLD` (already on) actually fire and clear `deductive-scaffold` / `report-style clearance`; enable `AGENT9_REGEN_RESOLUTION` + `AGENT9_REGEN_CULPRIT_EVIDENCE`. Verify via `Agent9-Regen-*` labels + falling cap frequency.
- [ ] **Mechanism-too-early (the cap that fired in run 2):** `AGENT9_BIBLE_AUTHORITATIVE` makes the embargo boundary Bible-derived, but the LLM still explained early → **the gap is a missing regen**. Either (a) add a "mechanism-reveal" defect + regen that de-explains the pre-test chapter, or (b) strengthen the embargo obligation and re-check. *This cap has a gate but no repair — highest-value ceiling item.*
- [ ] **Unplanted-evidence (ending ≤5):** enable `AGENT6_DT_EVIDENCE_COMPLETENESS` (RC3.4) so every discriminating-test clue is mapped strictly before its reveal scene.

**Acceptance (M2):** on the M1 batch, Cap Ledger shows the top-4 caps at ≤1 occurrence across ≥4 runs; median shipped score ≥ 73.

### MOVE 3 — PROVE: run the N≥4 matched A/B — *finally*  *(the move deferred since A_54)*

- [ ] **Build the matched batch** with the staged harness (`scripts/exp-regen-clue-*`, `canary-k2-single-run-confounded`): ≥4 runs per arm, matched on chapter count, diverse on era/setting/cast/crime/mechanism. Flip **one flag per replay** — never two retry-bearing gates at once.
- [ ] **Read the deltas honestly:** accept a lever only if its target category/cap moved and nothing regressed. Grade-band quantization (60/63/70) exaggerates a few points — use the raw score + cap frequencies, not the band.
- [ ] **Flip defaults** for every lever that wins; **delete the injector layer** (LLD P7) once every RC-1 pass is validated-on.
- [ ] **Then, and only then, the craft lift (RC-5):** enable `AGENT9_CRITIQUE_REWRITE` (temp 0.7–0.9) + model tiering + `AGENT9_VOICE_ENFORCE`. This is the last 74→80 push and only reads true once caps are off and measurement is powered. The category floor (prose 5, dialogue 6, character 6, clues 7) is the target here.

**Acceptance (M3 = target 80):** mean ChatGPT ≥ 80, internal−external gap ≤ 3, ship rate 100%, over ≥4×4 matched.

---

## 5. The Cap Ledger  *(the finite ceiling list — each row must reach 0 frequency)*

| Cap (`facts` trigger) | Clamps | Impact | Fix / lever | State |
|---|---|---|---|---|
| `mechanismExplainedTooEarly` | plot_structure ≤6, pacing ≤6 | high (fired run 2) | RC2.4 embargo **+ new regen** | gate on · **no repair** |
| `scaffoldHits` (deductive-scaffold) | prose ≤4, ceil 65 (≥2) | high | RC1.1/1.3 · `AGENT9_REGEN_SCAFFOLD` | on · verify it fires |
| `reportStyleClearance` | prose ≤6, ending ≤7 | med-high | RC1.2 · clearance→regen | pass built · wire/enable |
| `revealUsesUnplantedEvidence` | ending ≤5 | med | RC3.4 · `AGENT6_DT_EVIDENCE_COMPLETENESS` | built · off |
| `templateLeakageHits` | prose ≤4, ceil 65 (≥2) | high | RC1.x · inject→regen | on · verify |
| `culpritIsVictim` / `deadVictimIsCulprit` | **ceil 55–60** (killer) | catastrophic when it fires | RC2.5 · `repairCaseSoundness` + gate | repair built · promote |
| `pronounsUnstable` | ceil 69, prose ≤5 | med | RC2.2 · Bible pronoun-lock | on (`BIBLE_AUTHORITATIVE`) · verify |
| `malformedEvidenceSurfacing` | prose ≤5, ceil 70 (≥3) | med | A_57 D1 (landed) | fixed |
| `victimUnnamed` | ceil 72 | med | RC4.4 alias matcher (landed) | **fixed** |
| `dualValueNoContrast` | clues ≤6 | med | A_57 D2 (landed) | fixed |
| `weakMurderMethod` | ending ≤6, ceil 75 | med | RC3.5 death-method tell | tell built · off |

---

## 6. The Reliability Ledger  *(the hard-fails that abort before scoring — each must reach 0)*

| Hard-fail major | Seen (recent) | Fix / lever | State |
|---|---|---|---|
| `illegal_named_walk_on` | 5× (run 1) | **Generation obligation + deterministic anonymise-repair** | **LIVE GAP — no lever** |
| `cleared_culprit_conflict` | 1× | Culprit-never-cleared construction guard | **LIVE GAP — no lever** |
| `missing_case_transition_bridge` | 2× | RC3.3 · `AGENT9_REGEN_TRANSITION` | built · **off → enable (M1)** |
| season/mechanism FP (`august vs spring`) | 1× (A_60) | RC2.3/RC4.1 case-derived vocab | **fixed · live** |
| Agent-5 coverage abort | (A_61) | RC3.1 repair-not-abort | fixed |
| reveal never converges | (A_58) | RC1.3 resolution→regen | built · off |

---

## 7. Milestones

- **M1 — Floor:** ship rate 100% (8/8 runs reach a score). *Enables scoring on the ~50% currently lost.*
- **M2 — Ceiling:** top-4 caps ≤1 occurrence across the batch; median shipped ≥ 73.
- **M3 — Target:** validated 80 (mean ChatGPT ≥80, gap ≤3, ship 100%) on ≥4×4 matched. Flip defaults; delete injector layer; ship craft lift.

---

## 8. Guardrails — the five mistakes, do NOT repeat them

1. **Never conclude from n=1 or n=2.** Every A/B is ≥4×4 matched on chapter count. (A_54, confirmed again this week.)
2. **Stop building; start flipping-and-measuring.** The machinery is code-complete and off. The bottleneck is a **measurement debt**, not a code debt. New code only where §6 marks a genuine LIVE GAP.
3. **Track reliability as a first-class axis.** A 67 that ships and a run that aborts are both "not 80" for opposite reasons; the averaged score hides the abort rate.
4. **Caps ≠ craft.** Four runs in a row died on validator false-negatives on 94%-quality prose. Check the Cap/Reliability ledgers before ever concluding "the prose needs work."
5. **Keep the scoreboard, not the diary.** Update the three ledgers per batch. A new `ANALYSIS_NN` is for a genuinely new finding — not a routine run post-mortem.

**And the standing law (A_59/A_61):** *deterministic code may VERIFY and GUARANTEE; it must never WRITE. Validators/repairers dereference the frozen Bible fact — never re-derive it from prose.* No new per-mechanism regex, no per-template reword, no new deterministic prose injector.

---

## 9. Genuine remaining build work (not just flips)

Everything else is a flip-and-validate. These need new code:

- **`illegal_named_walk_on` repair** (M1) — the top reliability blocker, no lever today.
- **`cleared_culprit_conflict` guard** (M1) — construction-side.
- **Mechanism-too-early regen** (M2) — the cap with a gate but no repair pass.
- **RC3.2 Agent-3b plausibility** — magnitude clause landed; the judge is shadow-only, needs the enforce path + N≥4.
- **RC5.3 regen-on-leakage** — the voice gate logs in shadow; the enforce-with-repair half is deferred.

---

## 10. Step-by-step implementation plan

Ordered, dependency-sequenced, PR-sized steps. Work top to bottom. Each step tags its **kind** — `CONFIG` (flag in `.env.local`, no build), `CODE` (build + both-directions test + dist rebuild), `RUN` (canary batch, ~£1–1.5 each) — and a **verify** you can check before moving on. Flags live in `.env.local` (git-ignored, worker-loaded); code-default flips wait for Move 3.

> Golden rules baked in: change **one lever per measured replay**; every `CODE` step ships with a both-directions test and a `npm run build:all` (worker consumes dist); confirm a lever actually fires by grepping its agent label in `logs/llm-prompts-full.jsonl` — never assume a flag took.

### Phase A — FLOOR (→ M1: ship rate 100%)

**S0 · Baseline the ledgers** · `RUN`
Run a 4-run canary batch on the current flags (`node scripts/canary-core.mjs` ×4, sequential). Parse each `apps/api/data/reports/<runId>/*.json` into the three ledgers (§3). This is the starting scoreboard and proves the tracking loop works.
*Verify:* 4 reports on disk; ship-rate, cap-frequency, category-floor recorded. *Exit:* baseline row in the dashboard.

**S1 · Enable the transition-bridge regen** · `CONFIG`
Set `AGENT9_REGEN_TRANSITION=true`. (RC3.3, built.)
*Verify:* on a disappearance→murder run, `grep "Agent9-Regen-Ch.*transition" logs/llm-prompts-full.jsonl` returns a hit and `missing_case_transition_bridge` disappears from the report.

**S2 · Build the `illegal_named_walk_on` repair** · `CODE` · *biggest reliability blocker, no lever today*
The detector already lists the offending names (`character-validator.ts` → `illegal_named_walk_on`, names in the message). Two parts:
  1. **Obligation** (prevention): in `packages/prompts-llm/src/agent9-prose/prompt-blocks.ts` / `obligation-block.ts`, add a binding line — "Every named person must be one of the cast; refer to incidental figures by role only (the maid, a porter), never a new proper name."
  2. **Deterministic repair** (backstop): a post-processing pass in `apps/worker/src/jobs/agents/agent9-run.ts` that, given the out-of-cast named entities the validator finds, rewrites each to a role noun in place (never abort). Gate behind `AGENT9_WALKON_REPAIR` (default-off until validated).
*Verify:* both-directions test (a named walk-on → anonymised; a real cast name → untouched); the 5-walk-on run 1 fixture now reaches a score.

**S3 · Build the `cleared_culprit_conflict` guard** · `CODE` · *construction-side, no lever today*
Root: the clearance path can clear the culprit. In the clearance obligation + `enforceSuspectEliminationPresence` (agent9-run.ts), exclude every `computeLiveCulprits` name from the clearance-target set; add a validation-side assertion that the culprit is never cleared.
*Verify:* both-directions test (culprit never appears in a clearance sentence; a genuine suspect still gets cleared); `cleared_culprit_conflict` gone from the report.

**S4 · Confirm the soundness repair runs — but keep blocking OFF** · `CONFIG`(none) · *corrected 2026-07-11*
The repair hook (`repairCaseSoundness`) already runs **unconditionally** — it fixes culprit=victim, unknown-gender, missing/eliminated culprit at source, which is the reliability win. **Do NOT enable `AGENT9_BIBLE_GATES_BLOCKING` in this phase:** blocking makes a residual (unrepairable) unsound case *abort*, which is the opposite of the ship-rate goal. Blocking is a Move-3 **quality** decision (an unsound case shouldn't *ship* at 80), gated on the N≥4 A/B — not a floor lever.
*Verify:* the repair fires (`[Agent 9] case-soundness:` in warnings) and no run aborts on the soundness gate (it stays warn-level).

**S5 · M1 gate** · `RUN`
Re-run the 4-run batch. **Exit M1:** 8/8 consecutive runs reach a scored release-gate (0 `aborted`/`failure`). Update the Reliability Ledger — all rows should read 0.

### Phase B — CEILING (→ M2: caps ≤1, median shipped ≥73)

**S6 · Confirm the on-levers actually fire** · `RUN`(reuse S5) + `CODE`(if broken)
On the M1 batch, grep `Agent9-Regen-*` labels. `AGENT9_REGEN_CLUE`/`_SCAFFOLD` are on — confirm they fire and clear `deductive-scaffold`/`report-style clearance`. If a label is absent on a run whose report shows the cap, the wiring is broken → fix (this is the flag-load-order class; read at runtime).
*Verify:* every fired cap in a report has a corresponding regen attempt in the prompt log.

**S7 · Enable resolution + culprit-evidence regen** · `CONFIG`
Set `AGENT9_REGEN_RESOLUTION=true`, `AGENT9_REGEN_CULPRIT_EVIDENCE=true` (RC1.4, built).
*Verify:* `Agent9-Regen-Ch*-missing_resolution` / `-culprit_unlinked` labels appear; the "It was me… I confess" / "beyond all reasonable doubt" templates no longer ship.

**S8 · Build the mechanism-too-early regen** · `CODE` · *the cap with a gate but no repair — highest-value ceiling item*
`AGENT9_BIBLE_AUTHORITATIVE` gives the embargo boundary but the LLM still explains early. Add a `mechanism_revealed_early` defect + a regen pass (mirror `runScaffoldRegenPass`) that de-explains the flagged pre-test paragraph, keyed off `chapterFullyExplainsMechanism` (`generate.ts`) + the Bible `discriminatingTestChapter`. Gate `AGENT9_REGEN_MECHANISM`.
*Verify:* both-directions test (a pre-test chapter that explains → regenned to withhold; the DT chapter that explains → untouched); `mechanismExplainedTooEarly` cap gone.

**S9 · Enable DT-evidence completeness** · `CONFIG`
Set `AGENT6_DT_EVIDENCE_COMPLETENESS=true` (RC3.4). Clears `revealUsesUnplantedEvidence`.
*Verify:* `findUnplantedDiscriminatingClues` reports empty post-Agent-6; the `ending ≤5` cap gone.

**S10 · M2 gate** · `RUN`
Re-run the batch. **Exit M2:** top-4 Cap-Ledger rows at ≤1 occurrence across ≥4 runs; median shipped score ≥ 73.

### Phase C — PROVE (→ M3: validated 80)

**S11 · Build the matched A/B matrix** · `CODE`(harness config)
Configure `scripts/exp-regen-clue-*` for ≥4 runs per arm, **matched on chapter count**, diverse on era/setting/cast/crime/mechanism (rotate `CANARY_THEME`). One flag toggled per arm.
*Verify:* the harness emits paired, chapter-count-matched run sets.

**S12 · Run the A/B and decide flips** · `RUN`(the big one)
One flag per replay. Read raw scores + cap frequencies (not the grade band). Accept a lever only if its target moved and nothing regressed.
*Verify:* a per-lever accept/reject table with deltas.

**S13 · Flip defaults + delete the injector layer** · `CODE`
For each winning lever, flip its code default (the module getter's fallback) from `false`→`true`. Once every RC-1 regen is validated-on, delete the deterministic injectors it replaced (LLD P7); keep only guarded normalizers + the logged emergency floor.
*Verify:* full suite green; a run with an empty `.env.local` behaves like the validated config.

**S14 · Craft lift + final validation** · `CONFIG` + `RUN`
Enable `AGENT9_CRITIQUE_REWRITE`, `AGENT9_MODEL_*`, `AGENT9_VOICE_ENFORCE=enforce`; A/B each. Target the category floor (prose 5, dialogue 6, character 6, clues 7 → 8s).
**Exit M3 (target 80):** mean ChatGPT ≥ 80, internal−external gap ≤ 3, ship rate 100%, over ≥4×4 matched.

### Sequencing at a glance

```
Phase A  FLOOR     S0 baseline → S1 transition(cfg) → S2 walk-on(code) → S3 cleared-culprit(code) → S4 soundness-gate → S5 ✅ ship 100%
Phase B  CEILING   S6 verify-fires → S7 resolution/culprit(cfg) → S8 mechanism-regen(code) → S9 DT-evidence(cfg) → S10 ✅ caps≤1, median≥73
Phase C  PROVE     S11 matrix → S12 A/B → S13 flip defaults + delete injectors → S14 craft lift → M3 ✅ validated 80
```

**Critical path / dependencies:** S2 + S3 are the only genuine new-code blockers to ship-rate (do first). S8 is the only new-code blocker to the ceiling. Everything else is a flag flip gated on measurement. Do **not** start Phase C before Phase A's ship-rate is 100% — an aborting run pollutes every A/B cell.

---

*Prev roadmaps: `documentation/analysis/_archive/ANALYSIS_47/ROADMAP_TO_80.md`. Root-cause detail: `documentation/analysis/ANALYSIS_61/ANALYSIS_61.md`. First-principles design: `documentation/plan/agent9-first-principles-LLD.md`.*

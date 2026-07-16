# WHAT'S LEFT TO REACH 80 — the remaining-work list

> **⚠️ A_62 AMENDMENT (2026-07-16) — read before acting on §4/§5.** A from-source recomputation of all
> shipped runs ([ANALYSIS_62](../../analysis/ANALYSIS_62/ANALYSIS_62.md)) falsified two premises this
> file still argues from: **(1)** the §5 rescope's "template-leakage 1/11" is wrong — the true M1-era
> figure is **7/15, the most frequent single cap on current code**, and on 4/15 runs it fires with no
> scaffold-family cap at all, so **P4 as scoped cannot deliver M2 alone**; **(2)** "identity is the
> cap-free theme" is dead — M1v2-5 (identity) fired 7 caps, the most of any run. Both leverless caps
> now HAVE levers (A_62 RC-2.1/RC-2.2, built 2026-07-16, default-OFF pending the P3 A/B): the Item 17
> lever existed all along and was merely unwired. Also: the M1 count restarted at `941fc94e` (A_62
> RC-6 — every LLM request was unbounded; a hang is now a retry). Inline `[A_62 …]` notes below mark
> the corrected claims; the ledger remains the authority on all numbers — **derive, never hand-tally**
> (`scripts/derive-ledger-panels.mjs`).

**Date:** 2026-07-15 (amended 2026-07-16) · **Branch:** `redesign/agent-blue-sky`
**Companions:** [ROADMAP_TO_80.md](ROADMAP_TO_80.md) (the full grounded plan, §10 = the phased steps) · [TARGET_80_LEDGER.md](TARGET_80_LEDGER.md) (the standing three-panel scoreboard — the numbers)
**What this is:** the short, execution-ready list of everything still between us and a *validated* 80. The roadmap is the reasoning; the ledger is the scoreboard; **this file is the to-do list.** If a line here conflicts with the ledger, the ledger wins (update this file).

---

## 0. Where we are right now (one paragraph)

**Every CODE and CONFIG step in the roadmap is done.** The initiative is in its measurement phase. The **S0 baseline batch is complete** (4/4 shipped, 0 hard stops) and carried the **first external reads: mean ChatGPT 73.25 (75/69/73/76)** — only **6.75 points off 80**, much closer than the internal rubric suggested. The **M1 gate's first attempt reached 6/8 shipped, 0 aborts**, then run 7's re-run surfaced a new abort class (Agent 6.5 victim voice-sketch) — fixed same-day (`257f7855`) and the **count restarted 2026-07-15; a fresh 8-run batch is in flight**. What remains is almost entirely **runs and reads**, plus a handful of small candidate fixes surfaced by those first external reads. The two things still pinning the score: the **scaffold/report-style cap** (fired on 2/5 shipped runs, the lever wins only ~half the time) and the **craft floor** (category mean 6.5; even cap-free runs top out at ~70 internal).

**Acceptance bar for "80" (unchanged):** mean ChatGPT ≥ 80 · internal−external gap ≤ 3 · ship rate 100% · over a ≥4×4 matched batch.

---

## 1. The remaining path at a glance

```
[S0 baseline ✅ done]
   → P-fixes  small pre-batch fixes (Items 9/11/12)      ← optional, do the cheap ones first
   → P2  M1 gate: 8/8 consecutive scored runs, 0 aborts  ← RUN ×8
   → P3  M2 gate: caps ≤1 across ≥4, median ≥73          ← VERIFY (+RUN ×4 if fixes needed)
   → P4  the powered A/B: scaffold ×8 matched pairs       ← RUN, then flip defaults + delete injectors
   → P5  craft lift A/B (2 levers) + final ≥4×4 + reads   ← RUN + SCORE
   → 80 ✅
```

**Only three milestones remain: M1 (floor), M2 (ceiling), M3 (target).** All are gated on runs, not code.

---

## 2. Still-open candidate fixes (from the first external reads)

These were found on S0 and are the only *code* candidates left before the batches. None is confirmed necessary — decide each with a quick check, fix only if it earns it. Do the cheap, high-signal ones (11, 12) first; they may lift the opening_hook / plot_structure floor before we spend batch budget.

| # | Item | Signal strength | What to check first | Kind if it earns a fix |
|---|---|---|---|---|
| **11** | **Ch9/Ch10 duplicated reveal** — "Ch10 should be aftermath only" | **Flagged by ALL FOUR external reads** — the single strongest signal | **ROOT-CAUSED (2026-07-14), NOT yet fixed.** *Not* a regen pass (ruled out empirically — zero `missing_resolution`/`culprit_unlinked` regen calls in any run; those passes correctly no-op because Ch9 resolves). Cause = **stage-mode misclassification**: the aftermath guard at `obligation-block.ts:744` only fires when Ch10 is `aftermath_consequence`, but `getCulpritRevealChapter` (`clue-validation.ts:171-180`) falls back to the **last** chapter when the CML `culprit_revelation_scene` ref is unresolvable → Ch10 gets the full "MANDATORY RESOLUTION" mandate, so Ch9 (final_trap) + Ch10 both fully reveal. **FIXED 2026-07-14 (beat-aware classifier).** `resolveStageModeKey` (`clue-validation.ts`) now returns `aftermath_consequence` for the final chapter when the outline authored a `revelation` final beat after an earlier `final_trap` — honoring the authored arc *before* the culprit-reveal-chapter fallback can bind the reveal to the last chapter. So Ch10 now gets the AFTERMATH CONTRACT ("do not re-stage") instead of MANDATORY RESOLUTION. Only fires when a genuine earlier `final_trap` exists (never suppresses a legitimately-late reveal); no-op on non-Golden-Age (beatless) outlines. New both-directions suite `stage-mode-item11-aftermath.test.ts` (5 tests, +13 existing ITEM 11 tests); full prompts-llm suite 737 green. `build:all` + dist verified live 2026-07-14. | ✅ **CONFIRMED LIVE** on run `mystery-1784057933768` (10-ch): stage mode = `aftermath_consequence`, Ch10 no longer re-stages accusation/confession/arrest. Residual: some suspect-clearance recitation persists in Ch10 → **new Item 16**. |
| **12** | **Ch1 opens with reveal-like exposition, then "restarts" with the discovery** (poison + tide) | 2/4 reads; also depresses the measured opening_hook floor (6.2) | **RESOLVED (2026-07-14).** Root cause = the deterministic clue-materialization repair (`buildDeterministicClueParagraphs` / `applyDeterministicCluePatch`, `packages/prompts-llm/src/agent9-prose/deterministic-repair.ts`), **not** the grounding-lead pass — it prepended two templated clue paragraphs at index 0, pushing the real generated opener to para 3. Fixed in source at commit `4826eb80` (`earlyInsertAt = max(1,…)`, never opens the chapter) with a regression test; S0 predates the fix. **Was stale in the worker's built dist → `build:all` rebuilt + dist verified live 2026-07-14.** | ✅ **CONFIRMED LIVE** on run `mystery-1784057933768`: Ch1 opens with the generated scene, no templated clue paragraphs. |
| **9** | **`dualValueNoContrast` REOPENED** (acoustic) — central clue stated as two flat values, not one contradiction → clues ≤6 | **2/11 shipped** (S0-acoustic + M1-poison) | Compare the acoustic central-clue phrasing against the A_57 D2 detector — is it a regression or a sub-shape the D2 fix missed? **Recurred on M1 run 2 (poison) — now 2/11 shipped**, alongside a first cap-level template-leakage hit (Item 15 family). | `CODE` (small, targeted) |
| **16** | **Ch10 aftermath still recites suspect clearances** (found on run `mystery-1784057933768`) — with Item 11's stage-mode fix live, Ch10 no longer re-stages the accusation/confession, but it still recites per-suspect clearances ("Dr. Finch was innocent…", "Captain Hale could not have been the killer"), incl. an injection artifact ("the **Confirmed** alibi by hotel staff…"). Milder than the old full duplicate, but the aftermath contract is meant to suppress clearance recitation. | new — found during M1 | Likely a deterministic suspect-clearance INJECTION that runs regardless of stage mode (the capitalized "Confirmed" is the tell). Candidate for the injector-layer deletion (P4.4 / LLD P7). `CODE`, low priority — not blocking. |

**Guardrail:** any fix here ships with a both-directions test + `npm run build:all` (worker consumes dist), and must not reintroduce a cleared defect class — the P4.2 rewrite-acceptance validator already guards that, keep it green.

### Reliability fixes found during the M1 batch (each: abort → root-cause → fix → restart the count)

| Abort class | Root cause | Fix | State |
|---|---|---|---|
| **`clue visibility incomplete` hard-stop** (run `mystery-1784055526685`, optics, 9-ch) | An **optional**-criticality NSD-revealed clue (`clue_late_optional_slot_1`, a strict-mapping-contract filler Agent 5 is *required* to synthesize) that the prose didn't anchor landed in the *enforceable* hard-stop set. Optional texture clues are not fair-play-load-bearing → can never be a fair-play failure. | `partitionNsdRevealedCluesForReleaseGate` routes optional-criticality clues to a new `optionalDowngraded` bucket (advisory warning), never the hard-stop; essential/supporting stay enforced. 4 new tests, worker suite 301 green. Commit `dd2190f6`. | ✅ **FIXED + validated** — re-run `mystery-1784057933768` ships (was hard-abort). |
| **Dual-detective archetype → `detective_name_inconsistency` critical** (run `mystery-1784144041323`, clock, 2026-07-15) | Agent 3's CML assigned `role_archetype: "Detective"` to **two** cast members (Agent 2's design: one detective, one suspect). The validator derived both full names as "detective names", found both in prose — as any story would — and hard-aborted despite **zero** titled "Detective X" forms. Two defects: upstream metadata drift + a bare-name detector that converts it into a guaranteed critical. | Two layers (`6dff6933`): `repairCaseSoundness` demotes duplicate detective archetypes using Agent 2's cast design as authority (the P1-7 precedence), before suspect-pool derivation; `detectNameSwitches` now requires **titled evidence** (two distinct "Detective <Surname>" forms; rank words skip to the next word). 10 both-directions tests; both suites green (1 pre-existing pronoun-test failure on HEAD, unrelated); `build:all` + junction-resolved dists verified. | ✅ **FIXED** — validation = run 1 of attempt 3 (clock). **Count restarts.** |
| **Agent 6.5 voice-sketch cast-coverage hard-fail** (run `mystery-1784133922125`, poison, 2026-07-15) | The model **refuses to voice-sketch the victim** (dead character) — `characterVoiceSketches` came back 5/6 with the victim absent on **all 3 attempts** (retry feedback fixed the portraits, never the sketches); the count gate treated any shortfall as fatal. But every downstream consumer (agent7 `dominantCharacterNote`, agent9 prompt-builder, orchestrator voiceFragments) looks sketches up by name and tolerates absence — the gate was stricter than the pipeline needs. | `enforceCastCoverage` (extracted + exported): an array missing **only the victim** is accepted on the spot (no retry burn, no fabricated victim dialogue — that would feed the template-leakage class); any other gap (missing suspect, unknown/duplicate name) keeps retry/abort. Subset-aware reorder supersedes the A_53 P2 reorder. 10 both-directions tests, prompts-llm 747 green, `build:all` + dist verified. Commit `257f7855`. | ✅ **FIXED** — validation = run 1 of the restarted batch (poison). **M1 count restarted.** |

---

## 3. P2 — M1 gate: prove the floor (RUN ×8)

**Goal:** 8/8 consecutive post-change runs reach a scored release gate (`passed` or `warning`/needs-review), **zero aborts**. S0 and smoke runs do **not** count toward the 8.

- [ ] **P2.1** — `RUN` — two sequential 4-run batches: `node scripts/canary-core.mjs`, diverse `CANARY_THEME` per run.
- [ ] **P2.2** — `CODE` (conditional) — any abort → root-cause (report diagnostics → `failure_lineage` → walk `documentation/prompts/actual/run_*/` in numeric order to bound where the artifact was created) → fix → **restart the 8-count**.
- [ ] Per run: update the ledger's §1 Run Log + tick any §2 Reliability occurrence. Every fired cap must have a matching regen label in `logs/llm-prompts-full.jsonl` — absent label = S6 wiring bug, fix before proceeding.

**Exit M1:** 8/8 consecutive scored, all §2 Reliability rows at 0.
**Watch:** Item 7 (victim-timeline `vanished` FP) was fixed *after* S0-3/4 launched — those two may still show the warn-level FP; the fix is now in, so the M1 batch must read clean.

### M1 progress — attempt 1 (2026-07-14, count from `dd2190f6`) — **SUPERSEDED: count restarted 2026-07-15 at `257f7855`** (Agent 6.5 voice-sketch abort on the poison re-run; the 6 shipped runs below still feed the cap ledger / P4 pool as shipped runs, they just no longer count toward the 8)

| # | Theme | Run ID | Chapters | Outcome | Notes |
|---|---|---|---|---|---|
| — | optics | `mystery-1784055526685` | 9 | **ABORTED** (pre-fix) | Clue-visibility hard-stop → root-caused + fixed (`dd2190f6`). Does **not** count. |
| 1 | optics | `mystery-1784057933768` | 10 | ✅ **SHIPPED** (warning/needs-review) | First post-fix run. Items 11+12 confirmed fixed live. Only warn: scene-grounding 4/10. |
| 2 | poison | `mystery-1784059393094` | 9 | ✅ **SHIPPED** (warning) | 37 warns |
| 3 | tide | `mystery-1784060164809` | 9 | ✅ **SHIPPED** (warning) | 35 warns |
| 4 | acoustic | `mystery-1784061663248` | 9 | ✅ **SHIPPED** (warning) | 36 warns |
| 5 | identity | `mystery-1784063124632` | 10 | ✅ **SHIPPED** (warning) | Rubric 63 **uncapped** — the craft floor again (cf. S0-poison's 59). |
| 6 | clock | `mystery-1784064257736` | 10 | ✅ **SHIPPED** (**passed**) | First outright `passed` of the batch — while carrying 3 caps (scaffold + report-style ×2; rubric 60, raw 63). Duration outlier: 72 min. |
| 7 | poison | `mystery-1784068590753` | — | ⚠️ **INTERRUPTED** | Process died mid-Agent-7 (~04:52 2026-07-15; machine stop, not an abort). The re-run then hard-aborted on the **new Agent 6.5 voice-sketch class** (`mystery-1784133922125`) → fix `257f7855` → **count restarted**. |
| 8 | tide | — | — | — | Never started (fail-fast chain stopped at run 7). |

### M1 progress — attempt 2 (live — 2026-07-15; count from `257f7855`, the victim-exempt coverage fix)

| # | Theme | Run ID | Chapters | Outcome | Notes |
|---|---|---|---|---|---|
| — | poison | `mystery-1784133922125` | — (aborted at Agent 6.5) | **ABORTED** (pre-fix) | Voice-sketch cast-coverage hard-fail → root-caused + fixed (`257f7855`). Does **not** count. |
| 1 | poison | `mystery-1784135454932` | 10 | ✅ **SHIPPED** (warning) | Sailed through Agent 6.5 first-attempt (fix's exempt path not needed this time). Rubric 56 (raw 59) — caps: **`revealUsesUnplantedEvidence` → ending ≤5 and `mechanismExplainedTooEarly` ×2 — first-ever occurrences of both** (were 0/11; now 1/13 each). Watch for the rescope's observational-verdict premise. |
| 2 | tide | `mystery-1784137570721` | 10 | ✅ **SHIPPED** (warning) | Rubric 64 (raw 66) — caps: **template-leakage (Item 17 RECURS — now 2/13)** + scaffold ×2. The chain then stopped on a **harness bug**: `result.status` (phase-threshold) read `failure` on this shipped run — Open Item 2's shape in the canary exit code. Fixed `64e5f49e` (exit follows `release_gate_outcome`); **harness-only, generation code untouched → count does NOT restart.** |
| 3 | optics | `mystery-1784139037942` | — | ✅ **SHIPPED** (warning) | Rubric 67, 1 cap: `dualValueNoContrast` (Item 9, 3rd occurrence). |
| 4 | acoustic | `mystery-1784140602570` | — | ✅ **SHIPPED** (**passed**) | Rubric 64 (raw 66), 1 cap: template-leakage (Item 17, 3rd). `CANARY_STATUS` read `failure` while the gate `passed` — the `64e5f49e` exit fix proven live (old logic would have killed the chain here again). |
| 5 | identity | `mystery-1784142200392` | — | ✅ **SHIPPED** (warning) | Rubric 64 (raw 66), caps: **`mechanismExplainedTooEarly` ×2 — 2nd run of this batch** (with M1v2-1 poison) → **reserve buy-back trigger for `AGENT9_REGEN_MECHANISM` is MET** (§8, decide at the P4 gate). Identity is no longer the cap-free theme. |
| 6 | clock | `mystery-1784144041323` | — (aborted at story validation) | ❌ **ABORTED — NEW CLASS #3 → count restarts at `6dff6933`** | `detective_name_inconsistency` critical: Agent 3's CML gave **two** cast members the Detective archetype (Agent 2 designed one); the validator read both bare names in prose as "the detective renamed" and killed a story with **zero** titled "Detective X" forms. Fixed `6dff6933` (source repair + titled-evidence detector — see §2). |

### M1 progress — attempt 3 (live — 2026-07-15; count from `6dff6933`, the dual-detective fix)

| # | Theme | Run ID | Outcome | Notes |
|---|---|---|---|---|
| 1–8 | clock, poison, tide, optics, acoustic, identity, poison, tide | — | ⏳ launched 2026-07-15 | Chained fail-fast, clock first to validate the fix on the aborting theme. |

**Tally on the attempt-3 count: 0/8 — in flight.** Cumulative reliability picture: 13 shipped runs and 3 aborts across the M1 campaign, every abort a **distinct novel class**, each root-caused and fixed same-day (`dd2190f6` optional-clue, `257f7855` victim voice-sketch, `6dff6933` dual-detective). The floor gate is doing exactly its job — it is *finding* the abort classes; the question it must eventually answer is whether the class pool is finite. Housekeeping: `pronoun-verify-policy.test.ts` has one pre-existing failure on HEAD (Item 13 family) — not introduced by any of today's fixes; fix when Item 13 is worked.

**Cap watch for the P3 gate (restarted batch):** template-leakage has now fired on 2 of the last 3 scored runs (Item 17's decision trigger is met — the P3 gate must choose between adding the leakage regen kind (+ count restart) or the Item 15 linter route); and run 1 broke the "never fires" record of two caps the rescope demoted to observational verdicts — if either recurs across this batch, the reserve buys that lever back per §8.

**M2 preview from the M1 batch (feeds P3/P4):** caps fired on **5/6 shipped runs** — report-style 3/6, scaffold 2/6, template-leakage 1/6, `dualValueNoContrast` 1/6 (Item 9 recurs, now 2/11 shipped). The only uncapped run was **identity — the same theme as S0's cap-free run**; treat theme as a confound when reading cap frequency. Median shipped rubric **63** (59/60/63/63/65/68) vs the M2 bar ≥73 — the scaffold-family A/B (P4, Item 8) is carrying even more load than S0 suggested.

**Note (Item 11 coverage):** chapter count varies per run (optics gave 9 then 10). My Item 11 fix only fires on the **10-beat Golden-Age arc**; the 9-chapter arc has no beats and takes the unchanged fallback. So Item 11 is only *exercised* on 10-chapter runs — the batch/validation must include those (run 1 was 10-ch and confirmed it).

---

## 4. P3 — M2 gate: extinguish the caps (VERIFY, +RUN ×4 if needed)

**Goal:** top-4 Cap-Ledger rows at ≤1 occurrence across ≥4 runs; median shipped rubric ≥ 73.

- [x] **P3.1 (attempt-1 runs)** — `VERIFY` — label audit run 2026-07-15: **the scaffold family is cleanly wired** — every scaffold/report-style cap on every capped run has matching `Agent9-Regen-*-scaffold_not_prose` labels (fired-and-lost = Item 8, effectiveness not wiring). Two leverless caps found: `templateLeakageHits` (in-loop batch gate only → **new Item 17**, ~~decision deferred to the P3 gate — 1/11 doesn't justify a mid-count code change~~ **[A_62: the deferral rested on two wrong numbers at once — the true rate was 7/15, and the "new regen kind" was already built and merely unwired. Lever wired 2026-07-16 (`AGENT9_REGEN_LEAKAGE`, default-OFF, count-safe); A/B at P4.]**) and `dualValueNoContrast` (Item 9's route — **[A_62: detector promoted to prose-guard, lever built (`AGENT9_REGEN_DUAL_VALUE`, default-OFF); 6/21 and accelerating.]**). Re-run the audit on the restarted batch.
- [ ] **P3.2** — `RUN` ×4 — re-batch only if P3.1 required fixes; else the M1 batches double as the M2 sample.

**The known M2 risk (Open Item 8):** the **scaffold / report-style regen fires on every capped run but wins only ~half the time** (won on the clean `identity` run; lost on `acoustic`/`tide`). This is a *lever-effectiveness* question, not a wiring one. **By design it is answered in the P4 A/B, not patched blind** — if the A/B shows the lever doesn't move cap frequency, strengthen the pass (prompt / attempts / align the deterministic clear-check with the rubric LLM's broader reading of "report-style"). Do not touch it before P4.

**Exit M2:** top-4 caps ≤1 across ≥4 runs; median shipped ≥ 73.

---

## 5. P4 — the powered A/B: PROVE (RUN, scaffold ×8 matched pairs) — *the move deferred since A_54*

**Goal (rescoped 2026-07-15, −25% cut):** the one lever with live cap signal gets the powered verdict; the rest get observational verdicts. ~~Rationale: across all 11 shipped runs, only the scaffold/report-style family fires at measurable frequency (report-style 5/11, scaffold 4/11) — `mechanismExplainedTooEarly` 0/11, `revealUsesUnplantedEvidence` 0/11, `templateLeakageHits` 1/11.~~ **[A_62: this rationale is FALSIFIED — the figures were hand-tallied and wrong. Derived truth: template-leakage 7/15 M1-era (the most frequent single cap on current code, rising 1/6→3/5→2/4), `dualValueNoContrast` 6/21 and accelerating, `mechanism`/`reveal` 2/20 each (both §8 buy-back triggers MET). The P4 A/B must cover `AGENT9_REGEN_LEAKAGE` alongside `AGENT9_REGEN_SCAFFOLD` — the two caps co-fire on only 3/15 runs, so the scaffold verdict alone cannot clear prose. Both new levers are built (A_62 RC-2.1/RC-2.2), default-OFF, awaiting this gate.]** The plan's own rule still applies: **a lever whose cap never fired can't show movement; A/B'ing it burns runs for no signal** — the correction is to what the numbers actually are, not to the rule.

- [x] **P4.1** — `VERIFY` — **POOL ASSEMBLED 2026-07-16 (A_62):** every candidate verified hydratable (`.actual-run-state.json` + Agent-7 response present in its `documentation/prompts/actual/run_*/` folder), chapter count read from the per-chapter Agent-9 files, **balanced on chapter count per A_62 RC-3** (the confound that survives; theme-matching is dead). Caps listed are the run's historical `caps_applied` — every pool member's target cap actually fired on it. `SYNTHESIZING_CODE 7` is still asserted per arm at replay (the harness records `synthesizedAgent7` and the analyzer invalidates the pair).

  **Scaffold ×8 (powered — the M2-critical verdict, committed £2.40):**
  | runId | run | theme | ch | scaffold-family caps |
  |---|---|---|---|---|
  | `mystery-1784057933768` | M1-1 | optics | 10 | report-style ×2 |
  | `mystery-1784060164809` | M1-3 | tide | 9 | report-style ×2 |
  | `mystery-1784061663248` | M1-4 | acoustic | 9 | scaffold + ceil-65 |
  | `mystery-1784064257736` | M1-6 | clock | 10 | scaffold + report-style ×2 |
  | `mystery-1784137570721` | M1v2-2 | tide | 10 | scaffold + ceil-65 |
  | `mystery-1784142200392` | M1v2-5 | identity | 10 | scaffold + ceil-65 + report-style ×2 |
  | `mystery-1784147217332` | M1v3-2 | poison | 10 | scaffold |
  | `mystery-1784235178238` | M1v4-2 | clock | 9 | scaffold |

  **Leakage ×4 (`AGENT9_REGEN_LEAKAGE`, reserve buy-back per §8 — cap 7/15 M1-era and rising):** `mystery-1784059393094` (M1-2 poison, 9ch) · `mystery-1784148466901` (M1v3-3 tide, 9ch) · `mystery-1784146189809` (M1v3-1 clock, 10ch) · `mystery-1784142200392` (M1v2-5 identity, 10ch) — 2×9/2×10, four distinct themes.

  **Dual-value ×4 (`AGENT9_REGEN_DUAL_VALUE`, reserve buy-back — cap 7/23, 4 of the last 7):** `mystery-1784059393094` (M1-2 poison, 9ch) · `mystery-1784235178238` (M1v4-2 clock, 9ch) · `mystery-1784139037942` (M1v2-3 optics, 10ch) · `mystery-1784230510658` (M1v3-5 acoustic, 10ch) — 2×9/2×10, four distinct themes.

  **Commands (after the post-batch `build:all` + dist verify, one flag per invocation):**
  ```
  node scripts/exp-regen-clue-ab.mjs --flag AGENT9_REGEN_SCAFFOLD --runIds mystery-1784057933768,mystery-1784060164809,mystery-1784061663248,mystery-1784064257736,mystery-1784137570721,mystery-1784142200392,mystery-1784147217332,mystery-1784235178238
  node scripts/exp-regen-clue-ab.mjs --flag AGENT9_REGEN_LEAKAGE --runIds mystery-1784059393094,mystery-1784148466901,mystery-1784146189809,mystery-1784142200392
  node scripts/exp-regen-clue-ab.mjs --flag AGENT9_REGEN_DUAL_VALUE --runIds mystery-1784059393094,mystery-1784235178238,mystery-1784139037942,mystery-1784230510658
  ```
  Est. ~£4.80 total (16 pairs × ~£0.30): scaffold from the committed tranche, the two ×4s from the decision-gated reserve — both caps have live, rising signal, exactly what §8 reserves the buy-back for.
- [x] **P4.2** — `CODE` — rewrite-acceptance validator (transition + mechanism predicates) — **DONE** (`a408451b`). Keep the suite green; it's the guard that lets rewrite levers be A/B'd safely.
- [ ] **P4.3** — `RUN` (×8 matched pairs) — `scripts/exp-regen-clue-ab.mjs --flag AGENT9_REGEN_SCAFFOLD`, **one flag per replay**, pool theme-matched ~~(identity is a known cap-free confound — balance it across arms or exclude it)~~ **[A_62: the identity-confound claim is DEAD — M1v2-5 (identity) fired 7 caps, the most of any run; every theme has now capped. Balance the pool on CHAPTER COUNT instead — the confound that survives (9-ch vs 10-ch arcs take different code paths, e.g. Item 11 only fires on 10-beat Golden-Age arcs).]** Read **raw scores + cap frequencies, never the grade band** (60/63/70 quantization exaggerates). Accept only if the scaffold/report-style cap frequency moved and nothing regressed. **[A_62: run the `AGENT9_REGEN_LEAKAGE` A/B in the same batch — same pool, one flag per replay.]**
- [ ] **P4.4** — `CODE` — flip the scaffold default per the verdict; **delete the injector layer** (LLD P7). Empty-`.env.local` run must then behave like the validated config.

**Powered verdict:** `AGENT9_REGEN_SCAFFOLD` only (Item 8 — the M2 gate rides on it).
**Observational verdicts (rescope 2026-07-15):** `AGENT9_REGEN_CLUE`, `AGENT9_REGEN_MECHANISM`, `AGENT9_REGEN_RESOLUTION`, `AGENT9_REGEN_CULPRIT_EVIDENCE`, `AGENT6_DT_EVIDENCE_COMPLETENESS` stay ON on observational grounds — their target caps read 0–1 across 11 shipped runs, so a powered A/B has nothing to measure. `AGENT3B_PLAUSIBILITY_JUDGE` stays shadow (promote only if its shadow telemetry ever disagrees with outcomes). **Accepted tradeoff:** the injector-layer deletion (P4.4) now rests on zero-cap observational evidence for the non-scaffold regens, not powered proof — a deliberate lowering of the evidence bar. The reserve can buy any single lever ×4 pairs back if the post-P4 projection lands in the 76–78 gray zone.

**Exit P4:** the scaffold accept/reject verdict with deltas appended to the ledger; defaults flipped; injectors deleted.

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

- [ ] **P5.1** — `RUN` A/B — A/B **two** craft levers in isolation (rescope 2026-07-15): `AGENT9_CRITIQUE_REWRITE` aimed at opening_hook/dialogue/pacing, and `AGENT9_VOICE_ENFORCE=enforce` (RC5.3 repair is built, untested live; must measure dialogue-mark movement per Item 14, not just leakage). Each must move its target category ≥+1 with nothing regressed. **Model tiering moves to the decision-gated reserve** — buy it only if the projection sits in the 76–78 gray zone after these two.
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
| **Committed (~£6.80)** *(rescoped 2026-07-15, −25%: secondary P4 levers cut — caps 0–1/11, no signal to measure; model tiering moved to reserve)* | M1 floor 8/8 (£2.00) · P4 **scaffold ×8 matched pairs only** (£2.40) · P5 craft A/B **2 levers** ×4 (£2.40) | ~£6.80 |
| **Decision-gated reserve (~£8.20 headroom, spend ≤ half)** | Read the scaffold + craft deltas at the gate, flip winners, **then**: if projecting **≥ 78** → the 8-run final validation + external reads (£2.00); if **76–78** → first buy back ONE lever ×4 pairs (model tiering or a craft lever, £1.20), re-measure, then validate; if **< 76** → a second craft iteration, re-measure, then validate. Abort-class restarts of M1 also draw from here (£2.00 per restart). | ~£2.00–£5.20 |

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

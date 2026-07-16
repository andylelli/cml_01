# ANALYSIS_62 — The measurement was wrong, and the missing lever isn't missing

**Date:** 2026-07-16 · **Branch:** `redesign/agent-blue-sky` · **Trigger:** the M1v3 batch + a from-source recomputation of the cap ledger
**Companions:** [TARGET_80_LEDGER.md](../../plan/target_80/TARGET_80_LEDGER.md) (the scoreboard — now report-derived) · [REMAINING_TO_80.md](../../plan/target_80/REMAINING_TO_80.md) (the to-do list this doc amends) · [ANALYSIS_61](../ANALYSIS_61/ANALYSIS_61.md) (the RC register this continues)

**Purpose.** Two findings from 2026-07-16 invalidate part of the standing plan, and one of them makes the biggest remaining blocker much cheaper than budgeted. Organised **by root cause, not by instance** (the A_59 §B lesson), each action tagged **Structural** (dissolves a class) or **Tactical** (unblock-only).

**The two headlines:**

1. **The cap ledger was hand-tallied and materially wrong.** M1v2-1 was logged as "3 caps" (actually **5**), M1v2-5 as "2 caps" (actually **7**). Every downstream number — and the **−25% P4 rescope that was justified by those numbers** — inherits the error.
2. **Item 17's "missing" regen lever is already built.** The detector, a ready-made validator, the `"leakage"` defect kind and its regen instruction **all exist in shipped code**. Nothing emits the defect. The gap is ~10–30 lines of wiring, not a new lever plus an M1 count restart.

**Status of the M1 gate at time of writing:** attempt 3 at 4/8 shipped, 0 aborts, runs 5–8 in flight. Reliability is *not* the problem addressed here. The ceiling is.

---

## 0. Landed already (do not re-open)

| Item | Where | Proof |
|---|---|---|
| Three abort classes, each root-caused + fixed same-day | `dd2190f6` optional-clue · `257f7855` victim voice-sketch · `6dff6933` dual-detective | 15 shipped M1 runs, 3 aborts, **zero repeat classes**; M1v3-1 (clock) shipped on the very theme that aborted |
| Canary exit follows the pinned SHIPPED definition | `canary-core.mjs` (`64e5f49e`) | M1v2-4 shipped with `CANARY_STATUS=failure`; old logic would have killed the chain |
| Items 11 + 12 (Ch10 double-reveal, Ch1 restart) | `clue-validation.ts` `resolveStageModeKey` · `deterministic-repair.ts` | confirmed live on `mystery-1784057933768` |
| Cap ledger rebuilt from report JSONs | `TARGET_80_LEDGER.md` §3 | 20 runs re-derived from `caps_applied` 2026-07-16 |

---

## 1. The guardrail (read before adding any fix)

The standing lesson is that fixing symptoms one at a time *is* the whack-a-mole. A_62 adds a second, sharper one:

> **A number you did not derive is a number you do not have.**

The rescope decision (−25%, cutting four levers) was correct *reasoning* applied to *fabricated inputs*. Nobody lied; the run-log prose was written by reading a subset of `caps_applied` and summarising. The summary drifted; the plan trusted the summary. **Never hand-tally the panels again — derive them (RC-1).**

Corollary: this doc's own numbers are derived from `apps/api/data/reports/*/mystery-*.json` `diagnostics[key=rubric_score].details.caps_applied`, by run, counting **runs on which a cap fired** (not cap instances — the two differ, and conflating them is how "3 caps" happened).

---

## 2. Register by root cause

### RC-1 — The scoreboard is hand-derived → plans rest on wrong numbers → **derive the panels** · **Structural**

**Evidence.** Recomputing all 20 rubric-scored shipped runs from the reports:

| Cap | Ledger claimed | Actual |
|---|---|---|
| M1v2-1 (`…5454932`) | 3 caps | **5** — also `templateLeakageHits`, `scaffoldHits` |
| M1v2-5 (`…2200392`) | 2 caps | **7** — also `scaffoldHits`, ceil-65, `reportStyleClearance` ×2 |
| `templateLeakageHits` freq | `1/11` | **7/20** — and **7/15 in the M1 era** |
| "13 shipped runs" | a run count | a **stale `/13` cap denominator** frozen at M1v2-2; true count 20 (5 + 15) |

**Blast radius.** The `1/11` figure is the explicit premise of the §5 rescope ("a lever whose cap never fired can't show movement"). It is wrong by 7×. See RC-3.

**Fix.** `scripts/derive-ledger-panels.mjs` — read every report, emit §1/§2/§3/§4 panel rows as markdown. Run it as the P2 per-run step instead of hand-editing. Cheap (~1h), and it retro-validates every future claim.

**Do not** "just be more careful". The failure mode is structural: prose summaries of JSON drift silently and there is no test that catches it.

---

### RC-2 — Cap detectors are **scoring-time observers with no feedback path into generation** → the leverless-cap class · **Structural**

This is the load-bearing finding. It explains *exactly* which caps have levers and which don't, with no exceptions.

**The architecture as built:**

```
@cml/prose-guard   ── detectScaffoldNotProse ──┬──> rubric-score/facts.ts   → the CAP
   (shared)                                    └──> agent9 regen validator  → the LEVER   ✅ levered
                   ── detectTemplateLeakage ───┬──> rubric-score/facts.ts   → the CAP
                      noTemplateLeakageValidator│
                                               └──> (nothing)                            ❌ leverless
@cml/rubric-score  ── detectDualValueNoContrast ──> rubric-score/facts.ts   → the CAP
   (scoring-only)                                   (detector never leaves the package)  ❌ leverless
```

**The rule, stated once:** *a cap has a lever iff its detector is reachable from the generation loop.* `prompts-llm` does not depend on `@cml/rubric-score` at all — three files hand-mirror its logic in comments (`agent3-cml.ts:41`, `clue-validation.ts:941`, `generate.ts:332` — *"Mirrors @cml/rubric-score… so that what we PREVENT at prose-time is exactly what the rubric would HARD-CAP"*). That mirroring is the workaround; `prose-guard` is the sanctioned fix, and `scaffold.ts:144` says so outright: *"Single source of truth: `@cml/rubric-score` imports this so the regen validator and the score cap [agree]."*

**So the fix pattern is already precedented and proven — it is what was done for scaffold.** Apply it to the rest.

#### RC-2.1 — `templateLeakageHits` (**Item 17**) — the lever is BUILT, just not plugged in · **Structural · do this first**

Every part exists in shipped code:

| Part | Where | State |
|---|---|---|
| Detector, returns the exact leaked fragments | `prose-guard/src/fidelity.ts:155` `detectTemplateLeakage` | ✅ shared package |
| Ready-made validator, `violations: ["template_leakage:<hit>"]` | `prose-guard/src/fidelity.ts:165` `noTemplateLeakageValidator` | ✅ exported from `index.ts:48` |
| Defect kind | `regen-repair.ts:35` `\| "leakage"` | ✅ in the union — **and nothing emits it** |
| Regen instruction | `regen-integration.ts:109` `case "leakage":` → *"Remove the premature reveal / leaked material, keeping the scene intact."* | ✅ written |
| Regen pass + retry/accept machinery | shared with `scaffold_not_prose` | ✅ proven live |

**Missing:** the mapping `noTemplateLeakageValidator` violations → `ProseDefect{kind:"leakage", chapter, detail}` and its registration in the Agent-9 chapter-validator chain. That is it.

> **This overturns the REMAINING_TO_80 §3/§4 framing.** The plan deferred Item 17 because it read as "add a new regen kind (+ count restart)" — too expensive to do mid-count on a `1/11` cap. Reality: a `7/15` cap whose lever needs wiring. **It was deferred on two wrong numbers at once.**

**Guardrail.** The instruction says "remove the leaked material". Removal shortens the chapter → risks tripping `completeness_structure` (word floors). The regen must **rewrite in-scene, not delete** — assert both directions in the test, and watch the `completeness_structure` batch gate on validation.

#### RC-2.2 — `dualValueNoContrast` (**Item 9**, 5/20) — promote the detector, add the kind · **Structural**

`detectDualValueNoContrast` lives **only** in `rubric-score` and takes `opts.discriminatingPair` (not just prose), so it is a genuine promotion, not a wiring job: move to `prose-guard`, thread the pair, add a `dual_value_no_contrast` defect kind + instruction (*"state the central clue as ONE contradiction a character observes, not two flat values"*). Larger than RC-2.1; do it second.

#### RC-2.3 — the general sweep · **Structural, after 2.1/2.2 prove the pattern**

Audit every `facts.*` producer in `rubric-score/src/facts.ts` against the rule above and promote the rest (`detectMalformedSurfacing`, `revealUsesUnplantedEvidence`, `mechanismExplainedTooEarly` — the last two now have **§8 buy-back triggers MET**, 2/20 each). Do **not** do this speculatively before 2.1 lands and measures.

---

### RC-3 — Plan premises derived from the bad numbers → **re-read the rescope** · **Tactical (decision, not code)**

Three standing premises are now falsified:

| Premise | Where | Verdict |
|---|---|---|
| "only the scaffold family fires at measurable frequency; template-leakage 1/11" | REMAINING §5 rescope | **FALSE** — 7/15 M1-era, the most frequent single cap on current code |
| "identity is the cap-free theme — treat theme as a confound" | LEDGER §0/§3, P4 pool design | **FALSE** — M1v2-5 (identity) fired **7 caps**, the most of any run. Every theme now caps. |
| "P4's scaffold verdict is the biggest lever on the board" | LEDGER §0, REMAINING §4 | **INSUFFICIENT** — on **4/15** runs template-leakage fires with **no scaffold-family cap at all**. A perfect P4 leaves those prose-capped at ≤4. |

**Consequence.** **P4 as scoped cannot deliver M2.** Item 17 is co-equal with Item 8. Since RC-2.1 is nearly free, the sequencing answer is not "re-open the rescope debate" but "wire the lever, then let P4 measure both".

---

### RC-4 — Detectors silent where readers see defects (the FN class) · **Tactical → needs evidence first**

- **Item 13 — `pronounsUnstable` reads 0/20 while all four external reads saw pronoun drift.** RC-2's fix does nothing here: feeding a silent detector back into regen changes nothing. This is a **detector-sensitivity** problem (the RC-4 family of A_61, inverted). Action: run the pronoun validator standalone over the S0 stories; if clean, feed it the externals' quoted examples as fixtures. **Evidence before code.**
- **Item 10 — the internal rubric underscores by ~9.5** (internal 63.75 vs external 73.25). Safe direction, but fails the M3 gap ≤3 criterion. Unchanged guidance: **do not recalibrate until the caps clear** — the largest divergences are on capped runs, and RC-2 is expected to close much of it. Re-measure on cap-free runs after P4.

---

### RC-5 — The batch harness loses runs to the machine · **Tactical**

**2 of 17 attempted runs died to host power, not the pipeline** (M1-7 ~04:52; M1v3-5 confirmed: unplugged 22:39 → Modern Standby 22:41:53 mid-Ch7 → 4h28m on battery → "Critical Battery Trigger Met" 03:10:11 → death mid-Ch8). Each costs a partial run and, worse, *looks* like an abort until diagnosed.

- **Done:** `standby-timeout-ac` 2700→0 for the batch (restore after).
- **Structural option (cheap, worth it):** the chain is fail-fast and stateless — a killed chain loses its place. Make `m1v3-runs-5-8.sh`-style chains **resumable** (write a completed-runs file; skip on restart), and have the runner mark `in_progress: true` reports as `INTERRUPTED` rather than leaving them ambiguous.
- **Guardrail:** an interrupted run must **never** restart the M1 count — it is not an abort class. Both instances were correctly classified only after manual event-log forensics; encode it instead.

---

## 3. What the numbers actually say (derived 2026-07-16, 15 M1 shipped runs)

| Metric | Value | Bar |
|---|---|---|
| Runs firing ≥1 cap | **14/15** | 0 |
| **`prose` capped at ≤4** | **10/15** | — |
| **`prose` mark, mean** | **4.80** | 8.0 |
| Median shipped rubric | **64** (56–68) | ≥73 (M2) |
| Median by batch | **63 → 64 → 62** | — |
| Template-leakage fires with **no** scaffold cap | **4/15** | — |

**The single most actionable line: `prose` averages 4.80/8 and is cap-pinned on 10/15 runs.** It is the largest category gap on the board and it is **not a craft problem** — it is two deterministic caps, one of which (RC-2.1) is a wiring fix. Three batches have not moved the median (63/64/62) because **every fix so far was an abort-class repair: they bought reliability, not ceiling.** That is not a failure of the plan; it is the plan finishing M1 and arriving at M2.

---

## 4. Priority

1. **RC-1** derive-the-panels script — *everything else is unverifiable without it* (~1h)
2. **RC-2.1** wire `noTemplateLeakageValidator` → `kind:"leakage"` — highest value/effort ratio on the board; targets the most frequent M1-era cap with parts that already exist
3. **RC-5** resumable chain + `INTERRUPTED` classification — protects the runs the rest of the plan spends
4. **RC-2.2** promote `detectDualValueNoContrast` (Item 9, 5/20)
5. **RC-3** re-read the rescope *with the corrected numbers* at the P4 gate — decide Item 8 and Item 17 together
6. **RC-4** Item 13 evidence pass; Item 10 stays deferred until caps clear
7. **RC-2.3** the general detector sweep — only after 2.1 measures

---

## 5. Phased plan (test-runnable after each; one structural lever per phase; N≥4-gated)

### Phase 1 — Trust the instrument *(no runs; no generation code)*
- **1a** `scripts/derive-ledger-panels.mjs` → panels from reports; reconcile against the 2026-07-16 hand-recompute (must match exactly).
- **1b** Amend REMAINING_TO_80 §5 to strike the `1/11` premise and the identity-theme-confound claim; link RC-3.
- **Exit:** panels regenerate byte-identically from reports; no hand-tallied number survives anywhere.
- **Gate:** none — docs/tooling only. **Does not touch the M1 count.**

### Phase 2 — Wire the built lever *(the RC-2.1 fix)*
- **2a** Map `noTemplateLeakageValidator` violations → `ProseDefect{kind:"leakage", chapter, detail:<hit>}`; register in the Agent-9 chapter-validator chain behind `AGENT9_REGEN_LEAKAGE` (**default OFF** — it must be A/B-able; a new default-on lever mid-campaign is exactly the A_54 trap).
- **2b** Both-directions tests: a chapter with a known leaked fragment → defect emitted, regen invoked, fragment gone, **word count still above the floor**; a clean chapter → no defect, no regen call (no cost burn).
- **2c** `npm run build:all` + verify dist (worker consumes dist — the standing trap).
- **2d** Verify the lever fires by its **agent label** in `logs/llm-prompts-full.jsonl` (`Agent9-Regen-Ch*-leakage`) — absent label = wiring bug, exactly as the P3.1 audit caught for the scaffold family.
- **Exit:** suites green; label proven on one run.
- **Gate:** code-only, flag default OFF → **M1 count stands** (the `64e5f49e` precedent: harness/inert changes don't restart).

### Phase 3 — Measure it *(the powered A/B, folded into P4)*
- **3a** A/B `AGENT9_REGEN_LEAKAGE` ×4 matched replay pairs (~£1.20), **one flag per replay**, pool theme-matched — but note the identity-confound rationale is dead (RC-3), so balance on *chapter count*, the confound that survives.
- **3b** Read **raw scores + cap frequency**, never the grade band. Accept iff `templateLeakageHits` frequency drops and `completeness_structure` does not rise.
- **3c** Run the scaffold A/B (Item 8) in the same batch — the two caps co-fire on 3/15 runs, so read them together.
- **Exit:** accept/reject with deltas appended to the ledger; flip winners' defaults.

### Phase 4 — Item 9 + the sweep
- **4a** RC-2.2 promote `detectDualValueNoContrast` → `prose-guard`, thread `discriminatingPair`, add kind + instruction, flag default OFF.
- **4b** A/B ×4 pairs. **4c** RC-2.3 audit the remaining `facts.*` producers; the two met buy-back triggers (`mechanism`, `reveal`) are decided here with real numbers.
- **Exit:** top-4 caps ≤1 across ≥4 runs → **M2**.

### Sequencing at a glance
```
P1 derive panels ──> P2 wire leakage lever (OFF) ──> P3 A/B leakage + scaffold ──> P4 Item 9 + sweep ──> M2 ──> P5 craft ──> M3
   (no runs)           (no runs, count safe)          (~£2.40)                      (~£1.20)
```

---

## 6. The do-NOT-do list (moles)

- **Do NOT** hand-edit the cap panel again (RC-1 exists precisely to stop this).
- **Do NOT** ship `AGENT9_REGEN_LEAKAGE` default-ON. An unmeasured default-on lever is the A_54 trap; it also silently confounds the P4 scaffold read.
- **Do NOT** let the leakage regen **delete** text to satisfy the detector — that trades a prose cap for a `completeness_structure` failure. Rewrite in-scene.
- **Do NOT** treat an `in_progress: true` report as an abort (RC-5). It does not restart the count.
- **Do NOT** recalibrate the rubric (Item 10) before the caps clear — the gap is largest exactly where the caps fire.
- **Do NOT** re-open the −25% rescope as a debate. Wire RC-2.1 (nearly free), then let P3 measure. Evidence settles it, not argument.
- **Do NOT** use the identity theme as a "clean baseline" — that fact died with M1v2-5.

---

## 7. Acceptance (unchanged — all four on the same ≥4×4 matched batch)

- [ ] Mean external (ChatGPT) ≥ **80**
- [ ] |internal − external| ≤ **3**
- [ ] Ship rate **100%**
- [ ] Every Reliability row **0**, every top-4 Cap row **0**, Category Floor mean **≥ 8.0**

**The line this doc adds:** `prose` at **4.80/8**, cap-pinned on **10/15** runs, is the largest single gap between here and that bar — and the most frequent cap pinning it has a lever that was **already written and never plugged in**.

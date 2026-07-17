# ANALYSIS_62 — The measurement was wrong, and the missing lever isn't missing

**Date:** 2026-07-16 · **Branch:** `redesign/agent-blue-sky` · **Trigger:** the M1v3 batch + a from-source recomputation of the cap ledger
**Companions:** [TARGET_80_LEDGER.md](../../plan/target_80/TARGET_80_LEDGER.md) (the scoreboard — now report-derived) · [REMAINING_TO_80.md](../../plan/target_80/REMAINING_TO_80.md) (the to-do list this doc amends) · [ANALYSIS_61](../ANALYSIS_61/ANALYSIS_61.md) (the RC register this continues)

**Purpose.** Two findings from 2026-07-16 invalidate part of the standing plan, and one of them makes the biggest remaining blocker much cheaper than budgeted. Organised **by root cause, not by instance** (the A_59 §B lesson), each action tagged **Structural** (dissolves a class) or **Tactical** (unblock-only).

**The three headlines:**

1. **The cap ledger was hand-tallied and materially wrong.** M1v2-1 was logged as "3 caps" (actually **5**), M1v2-5 as "2 caps" (actually **7**). Every downstream number — and the **−25% P4 rescope that was justified by those numbers** — inherits the error.
2. **Item 17's "missing" regen lever is already built.** The detector, a ready-made validator, the `"leakage"` defect kind and its regen instruction **all exist in shipped code**. Nothing emits the defect. The gap is ~10–30 lines of wiring, not a new lever plus an M1 count restart.
3. **(added mid-doc, 2026-07-16) Every LLM request was unbounded.** No `abortSignal`, no timeout → a stalled socket hung a run forever. **4 runs lost to this.** The retry config had listed `"timeout"` as retryable all along; that path was simply unreachable. → **RC-6**, fixed `941fc94e`.

---

## TRACKER — state as of 2026-07-17 02:40

**M1 floor gate: attempt 9, 3/8 and counting** (count from `b1b3b5c7`, the class-#7 era-polysemy fix). The night's arc: attempts 4→9, each abort a distinct new class, each fixed same-day, each next attempt validating all prior fixes on the aborting theme first.

### The abort-class ledger (campaign totals: 8 distinct classes, 10 aborts, one repeat-via-dead-fix)

| # | Class (one line) | Fix | Status |
|---|---|---|---|
| 1 | optional-criticality NSD clue hard-stopped the gate | `dd2190f6` partition | ✅ 0 since |
| 2 | Agent 6.5 victim omitted from portraits/sketches → count gate fatal | `257f7855` — **dead code** (`role` vs `role_archetype`; tests fixtured the same wrong field) → **recurred** → re-fixed `b5d822a8` | ✅ re-fixtured to production shape; **the only repeat** |
| 3 | dual-detective archetype → name-switch critical | `6dff6933` source repair + titled evidence | ✅ 0 since |
| 4 | transport error bypassed retry (23 call sites) → content-burn → resolution-less fallback abort | `79c60ed0` retry at the choke point + exception-path backstop (RC-6.2) | ✅ **validated live twice** (deadline fired, retried, runs continued) |
| 5 | gate-only clue matcher; repair layers blind to it (split-brain) | `3b1b1de4` gate-matcher-keyed repair edge (RC-2.4) | ✅ armed, test-pinned |
| 6 | injector template glued cast name + death-adjacent key-terms → lifecycle "death" → critical avalanche | `1e677246` template restructure + cross-package interaction test | ✅ validated on aborting theme |
| 7 | "tablet"-as-pill convicted as computing anachronism ×8 chapters → majors>5 abort | `b1b3b5c7` polysemy guard, fixture-driven | ✅ validated on aborting theme |

**The pattern (classes #5–#7): a single false or fabricated signal, amplified per chapter, crossing a count threshold.** Generation is no longer the reliability frontier — **detector precision is**, exactly as the RC-4 evidence pass predicted. Watched siblings of #7, deliberately NOT fixed mid-batch (no speculative dist changes while a count runs): bare `mobile` and `digital` in the same `forbiddenTerms` lists — if either fires it is a one-line guard entry; otherwise they get fixture-driven guards in the P3 build window.

**RC-6/6.2 live validation:** two hung LLM calls on two different runs hit the 240s deadline, normalized retryable, backed off, retried, succeeded — runs continued and later failed (or shipped) on their REAL merits. Monday's identical signature was a 4.5-hour overnight hang. The hang class is closed *and its masking effect is gone* — which is precisely why the abort-class discovery rate jumped this week: runs now live long enough to reach their actual bugs.

| # | Root cause | Tag | State | Evidence / next action |
|---|---|---|---|---|
| **RC-1** | Scoreboard hand-derived → plans rest on wrong numbers | Structural | ✅ **DONE** | `scripts/derive-ledger-panels.mjs` (`941fc94e`). Earned itself immediately: caught 2 bugs in its own first classifier (aborts misfiled as interruptions — they differ on whether the count restarts) and found the reports dir holds **28** reports, not the 20 a truncated `ls` had shown. Has `--expect-caps` assertion mode. |
| **RC-2.1** | `templateLeakageHits` (Item 17) — lever built, not plugged in | Structural | ✅ **SOURCE-COMPLETE** (2026-07-16) | `runTemplateLeakageRegenPass` + `AGENT9_REGEN_LEAKAGE` call site, **default-OFF**. Guards: locked facts preserved; **chapter length preserved** (deletion would trade a prose cap for a `completeness_structure` run-killer); **post-processing re-injection logged as data** (the injector layer can re-dirty a cleaned chapter — without the log the P3 A/B would misread "lever ineffective"). 6 both-directions tests; prompts-llm 765 green; tsc clean. ⏳ `build:all` + label check (`Agent9-Regen-Ch*-leakage`) **after run 8 only**. |
| **RC-2.2** | `dualValueNoContrast` (Item 9) — detector was rubric-only | Structural | ✅ **SOURCE-COMPLETE** (2026-07-16) | Detector promoted verbatim to `prose-guard/dual-value.ts`; rubric-score imports it back — cap and lever share ONE function. **Surgical prose-guard dist rebuild, diff-verified additions-only** (3 new files + 2 export lines; every pre-existing compiled file byte-identical → count-safe, nothing loads the new symbol until `build:all`). `runDualValueContrastRegenPass` + `AGENT9_REGEN_DUAL_VALUE` (default-OFF); pair from `worldState.contradiction` — the same ledger value the rubric consumes. **False-win guard:** a rewrite deleting either canonical value is rejected even though the detector reads clean. 7 tests; rubric-score 76 green through the re-export. Item 9 now **7/23 — 4 of the last 7 runs** (M1v4-2 fired it again mid-implementation). |
| **RC-2.3** | The general detector sweep | Structural | ⬜ blocked **by design** | Gated on RC-2.1/2.2 measuring at P3/P4 first. Not backlog — a deliberate no-speculative-fixes gate. |
| **RC-3** | Plan premises derived from the bad numbers | Tactical | ✅ **DONE** | REMAINING_TO_80 amended 2026-07-16: header banner + inline `[A_62 …]` strikes on the `1/11` rescope premise (§5), the identity-confound claim (P4.3 — balance the pool on **chapter count** instead), and the Item 17 deferral rationale (P3.1). Ledger stays the numeric authority. |
| **RC-4** | Detectors silent where readers see defects (Items 13/10) | Tactical | 🟡 **EVIDENCE COMPLETE — blocked on external notes** | `scripts/pronoun-audit.mjs` over S0 (real shipped detector, designed casts, temporal pairing): the framing **inverts** — see the RC-4 register section. S0-era rubric never ran the scan (version skew); on current code the cap WOULD fire on S0-2 tide **on two false positives**; zero events elsewhere. **Do NOT harden the detector** — blocked on the externals' quoted examples (`47fe3c20` recorded none). Item 10 deferred until caps clear — by design. |
| **RC-5** | Batch harness loses runs to the host | Tactical | ✅ **DONE** | `standby-timeout-ac` 2700→0 (**restore after the batch**); chain resumable (`m1v4-runs.sh`); `scripts/mark-interrupted-reports.mjs` stamps dead `in_progress` reports (`interrupted: true` + reason; 30-min mtime guard protects live runs) — ran 2026-07-16: **4 stamped, live run correctly skipped**; the derive script prefers the stamp. Interrupted-vs-aborted is now data, not forensics. |
| **RC-6** | **Unbounded LLM requests → indefinite hang** | Structural | ✅ **DONE** | `941fc94e`. 30 tests green, `tsc` clean, `build:all` + **worker-resolved dist verified to export a live 240s deadline** (not merely green tests — the standing dist trap). |

### Phase progress

| Phase | State | Notes |
|---|---|---|
| **P1 — Trust the instrument** | ✅ **DONE** | 1a derive script; 1b REMAINING_TO_80 amended (RC-3). No runs; count-safe. |
| **P2 — Wire the built lever** | 🟡 **source-complete** | **BOTH** levers (RC-2.1 leakage + RC-2.2 dual-value) written, tested, default-OFF. ⏳ remaining: `build:all` + worker-dist verify + one label-check run — **after run 8 only**. Worker typecheck deliberately deferred with it (checks against prompts-llm dist, which lacks the new exports until then). |
| **P3 — Measure it** | ⬜ blocked on P2 build | A/B leakage + scaffold **together** (co-fire on only 3/15 — the scaffold verdict alone cannot clear prose) + dual-value in the same batch; one flag per replay; pool balanced on **chapter count** (the confound that survives). ~£3.60 at ~£0.30/pair for three levers ×4. |
| **P4 — Item 9 + sweep** | ⬜ blocked on P3 | Decide `mechanism`/`reveal` buy-backs (both triggers MET) with P3's numbers → M2. |

### Correction log (this doc's own errors, kept visible on purpose)

RC-1 exists because unverified numbers propagate. That applies to this document too:

| Claim | Correction |
|---|---|
| "template-leakage is the most frequent single cap" | True for the **M1 era only** (7/15 vs scaffold 6/15). **False across all 20** — scaffold edges it 8–7. Leakage is the one *rising* (1/6 → 3/5 → 2/4), which is what makes it the priority. |
| "Item 17 → 5/17, Item 9 → 5/17" (first report) | Both wrong — carried the bad hand-tally **and** a wrong denominator. Verified: **7/20** and **5/20** (Item 9 now 6/21). |
| "M1v3-5 died of machine sleep" | **Incomplete.** Standby was the trigger; the *mechanism* was RC-6's missing deadline — that is why a severed socket became a 4h28m wait instead of a retry, and why the same signature recurred on a fully awake machine. |
| "15 M1 shipped runs" (§3 below) | Now **18** (M1v3-5 re-run + M1v4-1/2). §3's ratios are as-of the recompute; re-derive with the script rather than adjusting by hand. |
| RC-6: "normalized … so withRetry's existing backoff takes over" | **Overstated when written.** True only for agents 1/3/3b — the other 23 call sites bypassed `withRetry` entirely, so the normalization had no consumer on the prose path until RC-6.2 moved retry inside `chat()`. The mechanism was right; the edge was missing. |
| Tracker (22:15): "M1 attempt 4, 2/8 … run 3 in flight" | Run 3 became **abort class #4** (DNS outage → RC-6.2). Attempt 4 superseded → **attempt 5**, count from the RC-6.2 fix, poison first. |
| "abort class #4 … the class pool question keeps answering 'not yet'" | Confirmed again same-day: attempt 5 run 1 = **abort class #5** (RC-2.4, split-brain matchers). Attempt 6 launched from that fix. Five classes, zero repeats — the floor gate is *finding* them, which is its job; each new attempt validates all prior fixes plus one more. |
| "five abort classes … **zero repeats**" (this log, one row up) | **Dead within 3 hours.** M1v6-4 = class #2 RECURRING: the `257f7855` fix read `m.role` but production writes `role_archetype` — **dead code from day one, and its 10 tests fixtured the same wrong field.** The deepest instance yet of the A_62 shape: not machinery-unwired this time, but *a fix whose verification encoded the fix's own wrong assumption*. Green tests ≠ correct wiring — now proven at the test-fixture level. Re-fixed 2026-07-17 (`role_archetype ?? role`; suite re-fixtured to production shape; named regression that fails on pre-fix code). Corollary for every future fix: **fixture from a REAL artifact, never from the fix author's assumption.** |
| RC-6/RC-6.2 "watch on attempt 4/6: a firing deadline followed by a shipped run is the win condition" | **Observed live, M1v6-4** (the same run that aborted on class #2): Agent-5 request hung → deadline fired at 240,019ms with the exact normalized retryable message → 1.8s backoff → retry succeeded → pipeline continued. Monday's identical signature was a 4.5-hour overnight hang. RC-6 + RC-6.2 are validated in production. |

---

## 0. Landed already (do not re-open)

| Item | Where | Proof |
|---|---|---|
| Three abort classes, each root-caused + fixed same-day | `dd2190f6` optional-clue · `257f7855` victim voice-sketch · `6dff6933` dual-detective | 15 shipped M1 runs, 3 aborts, **zero repeat classes**; M1v3-1 (clock) shipped on the very theme that aborted |
| Canary exit follows the pinned SHIPPED definition | `canary-core.mjs` (`64e5f49e`) | M1v2-4 shipped with `CANARY_STATUS=failure`; old logic would have killed the chain |
| Items 11 + 12 (Ch10 double-reveal, Ch1 restart) | `clue-validation.ts` `resolveStageModeKey` · `deterministic-repair.ts` | confirmed live on `mystery-1784057933768` |
| Cap ledger rebuilt from report JSONs | `TARGET_80_LEDGER.md` §3 | 20 runs re-derived from `caps_applied` 2026-07-16 |
| **RC-1** panels derived, never hand-counted | `scripts/derive-ledger-panels.mjs` (`941fc94e`) | reconciles with the hand-recompute; `--expect-caps` fails loudly on a stale claim |
| **RC-6** every LLM request bounded (240s) + deadline normalized to retryable | `llm-client/src/client.ts` (`941fc94e`) | 30 tests green; worker-resolved **dist verified** to export a live deadline |

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

### RC-4 — Detectors silent where readers see defects (the FN class) · **Tactical → EVIDENCE PASS RUN 2026-07-16, and it inverts the framing**

- **Item 13 — audited** (`scripts/pronoun-audit.mjs`: the real shipped `detectPronounDriftEvents` over the saved S0 stories, casts recovered from each run's Agent-2 response — designed genders, never inferred; stories paired to runs temporally, since name-overlap alone mispairs — the model reuses cast names across runs almost totally, itself a novelty red flag). **Three findings:**
  1. **The S0-era rubric never ran the pronoun scan.** S0 reports carry neither `pronounsUnstable` nor `pronounInstabilityEvents` — the facts-level scan postdates S0. The "0/20 while externals saw drift" history is **partly version skew**, not pure detector blindness.
  2. **On current code the cap WOULD fire on S0-2 (tide)** — 2 events across 2 chapters meets the ≥2/≥2 threshold — **and both events are false positives**: "As Eleanor spoke, the night porter stepped forward, clearing his throat" (the porter is male but *unnamed*, so the cast-whitelist suppression at `prose-consistency-validator.ts:295-298` can't see him) and "Eleanor noted his jaw tightening" (referent named in the *previous* paragraph; the check is paragraph-local). Eleanor is confirmed female in that story's own prose (80 she/her vs 18 he/his near her name) — not a pairing artifact.
  3. **The drift the externals actually saw yields zero events on the other four stories** — the recall gap is real too.

  **Verdict: the detector has BOTH a precision gap and a recall gap. Hardening or promoting it now would ADD false caps** — the exact A_61 RC-4 mole this register exists to prevent. **Blocked on:** the externals' quoted pronoun examples, which were never recorded in the repo (`47fe3c20` summarized the reads without quotes) — recover them from the ChatGPT conversations, then fixture-drive both gaps (unnamed-role suppression for precision; the externals' shapes for recall).
- **Item 10 — the internal rubric underscores by ~9.5** (internal 63.75 vs external 73.25). Safe direction, but fails the M3 gap ≤3 criterion. Unchanged guidance: **do not recalibrate until the caps clear** — the largest divergences are on capped runs, and RC-2 is expected to close much of it. Re-measure on cap-free runs after P4.

---

### RC-5 — The batch harness loses runs to the machine · **Tactical**

**2 of 17 attempted runs died to host power, not the pipeline** (M1-7 ~04:52; M1v3-5 confirmed: unplugged 22:39 → Modern Standby 22:41:53 mid-Ch7 → 4h28m on battery → "Critical Battery Trigger Met" 03:10:11 → death mid-Ch8). Each costs a partial run and, worse, *looks* like an abort until diagnosed.

- **Done:** `standby-timeout-ac` 2700→0 for the batch (restore after).
- **Structural option (cheap, worth it):** the chain is fail-fast and stateless — a killed chain loses its place. Make `m1v3-runs-5-8.sh`-style chains **resumable** (write a completed-runs file; skip on restart) — ✅ **done** in `m1v4-runs.sh` — and have the runner mark `in_progress: true` reports as `INTERRUPTED` rather than leaving them ambiguous (⬜ still open).
- **Guardrail:** an interrupted run must **never** restart the M1 count — it is not an abort class. Both instances were correctly classified only after manual event-log forensics; encode it instead.
- **Superseded in part by RC-6:** power was the *trigger*, not the *mechanism*. See below.

---

### RC-6 — **Every LLM request was unbounded → one stalled socket hangs the run forever** · **Structural · FIXED `941fc94e`**

*Found 2026-07-16 while diagnosing an M1v3 run-6 hang; it reframes RC-5 and closes the "interrupted" class.*

**The defect.** `client.ts:108` called `getChatCompletions(model, messages, {temperature, maxTokens, responseFormat})`. The SDK's `GetChatCompletionsOptions extends OperationOptions`, which carries `abortSignal` and `requestOptions.timeout`. **We passed neither.** A response that never arrives blocks the run indefinitely.

**Evidence — two instances, identical signature:**

| Run | Observation |
|---|---|
| `mystery-1784231640128` (2026-07-16) | `Agent9-Regen-Ch7` request logged 20:11:20.761Z, **no response for 15 min** (healthy call ≈30s). **CPU delta 0 over 8s** — not computing. **TCP to Azure `51.12.73.214:443` still `ESTABLISHED`.** Killed by hand. |
| `mystery-1784150843898` (2026-07-15) | Ch7 hung **4h28m** across a machine standby — then **completed on wake**. Proof the client will wait on a dead socket indefinitely rather than fail fast and retry. |

**Cost:** 4 lost runs, each requiring hand forensics to separate *interrupted* (count-safe) from *aborted* (restarts the count).

**The irony.** `defaultRetryConfig.retryableErrors` has listed `"timeout"`, `"ETIMEDOUT"`, `"connection_error"` since it was written. **That path was unreachable** — nothing ever timed out. The fix does not add retry behaviour; it makes behaviour that was always intended actually reachable.

**The trap (why this was not a one-liner).** `isRetryableError` substring-matches `error.message`, and **neither abort path says "timeout"**: `AbortSignal.timeout` raises `DOMException{name:"TimeoutError"}`; the Azure pipeline surfaces `AbortError{message:"The operation was aborted."}`. Left raw, a deadline converts a **count-safe hang** into a **count-restarting abort** — *strictly worse than the bug*. The catch normalizes our own deadline into a retryable `"timeout: …"` error. `request-timeout.test.ts` pins it both ways, including a test that **proves the trap is real** (a raw abort is not retryable) and one that proves a normalized deadline is retried and can then succeed.

**Chosen default 240s** — ~8× the slowest healthy Agent-9 call (~30s); the slowest whole run (M1-6 clock, 72 min) spans ~100 calls, so this never truncates legitimate work. `LLM_REQUEST_TIMEOUT_MS` overrides; `off`/`0` restores the old hang; garbage falls back to the default (a typo must never silently reinstate an infinite wait).

**Why this restarted the M1 count.** A deadline turns a hang into a retry, and a retry may then ship. That changes run outcomes, so unlike the `64e5f49e` canary-exit fix it is **not** inert and attempt-3's shipped runs cannot carry over.

**Watch on attempt 4:** the chain logs `deadline_fired=N` per run. A firing deadline followed by a shipped run is the win condition. A deadline firing on *every* run would mean 240s is too tight — no evidence of that (healthy calls are ~30s), but it is the thing to check.

### RC-6.2 — the retry layer was BYPASSED by 23 call sites → abort class #4 · **Structural · FIXED 2026-07-16**

*Found via M1v4 run 3 (`mystery-1784236058900`, poison): a ~30s DNS outage (`getaddrinfo ENOTFOUND`, three hits 16s/6s/6s apart) at Agent-9 Ch9 aborted the run.*

**The tell was 18 milliseconds.** Error at `:36.983`, next request at `:37.001`. `withRetry`'s delays (1.5s base, 3s DNS floor) never ran — those three "retries" were the **chapter loop's three CONTENT attempts**, each burning instantly on a transport error. Enumerating the pipeline: **23 call sites call `chat()` directly** (agents 2, 2b–2e, 3b-judge, 4, 5, 6, 6.5, 7, 8, and all seven Agent-9 prose paths); only agents 1/3/3b ever used `chatWithRetry`. Consequences:

1. `defaultRetryConfig.retryableErrors` was **dead code on ~90% of the pipeline** — every transport blip fell through to agents' content-retry loops.
2. **RC-6's own normalization was unreachable on those sites too** — "so withRetry's backoff takes over" was only true for 1/3/3b (correction logged below).
3. With all content attempts dead before any draft, the **generation-exception fallback** built a from-scratch final chapter with **no resolution event** — and the last-batch obligations made the abort *certain*. The retry-exhaustion path has had a deterministic resolution backstop since A_44; the exception path never got it.

**The fix (two layers):**
- **Transport retry moved INSIDE `chat()`** (`chat = withRetry(chatOnce)`) — the invariant lives at the choke point; all 23 sites inherit it with zero call-site churn. `chatWithRetry` demoted to breaker-only (`breaker.execute(() => chat())`) — nested retry would have multiplied to 16 worst-case attempts; a test pins "always-dead transport = exactly 4 SDK calls". Per-attempt logging stays in `chatOnce` — the diagnostic contract (one `chat_request`/`chat_error` per real network attempt) is what made this forensics possible. New `ChatOptions.retryConfig` seam for ops/test budgets.
- **Exception-path resolution backstop** (generate.ts): mirrors the A_44 pattern with the same `.every()` resolution-only semantics — mixed failures still abort (genuine), an already-resolving fallback is never double-injected (Item 16's lesson).

4 new tests (incl. the exact run-3 shape: DNS dies twice, third succeeds); llm-client 34 green; prompts-llm 765 green; worker tsc clean; all five changes (this + RC-2 levers) verified in worker-resolved dist. **Count restarts → attempt 5, poison first.**

**The pattern worth naming:** RC-6 bounded the request; RC-6.2 made the bound *reachable*. Both are instances of the same defect shape as RC-2 — *machinery built but not wired into the path that needs it* (regen kinds nothing emitted; retryable errors nothing retried). When a system has a correct-looking mechanism that never fires, look for the missing edge, not a missing mechanism.

### RC-2.4 — the gate enforces a matcher the repair layers never consult → abort class #5 · **Structural · FIXED 2026-07-16**

*Found via M1v5 run 1 (`mystery-1784238677818`, poison): release-gate hard-stop `clue visibility incomplete` on `clue_core_contradiction_chain` — an **essential** clue — with `corrective_attempts: 0`.*

**The prose was fine.** Ch1–3 are saturated with the clue's content ("Poison, she thought", "confirming the residue of poison", "poison … had found its way into the victim"). The gate's matcher (`collectClueEvidenceFromProse`, scoring-adapter) demands **≥3 signature tokens co-occurring in a single paragraph** (min 2, ratio 0.28 over an ~8-token signature); the best paragraph had 2. Good prose disperses an idea across sentences — the matcher penalizes exactly what craft rewards.

**The split brain.** The generation/repair side satisfies its obligations via `chapterMentionsRequiredClue` (clue-validation) — which passed. So no `missing_clue` regen ever fired, and the run carried a defect only the gate could see, into a gate that only knows how to kill. Worse: **the batch loop detected the exact gap at Ch3** (`cluesWithNoAnchor`) and papered over it with *synthetic trace anchors* — telemetry parity, prose untouched — before sailing on to the certain hard-stop. This is the RC-2 rule ("a cap has a lever iff its detector is reachable from the generation loop") violated **between the gate and the lever**, the third instance of the built-but-not-wired shape (RC-2.1 regen kinds, RC-6.2 retryable errors, now gate matchers).

**The fix** — `repairUnanchoredNsdCluesBeforeGate` (agent9-run.ts, exported for tests): before the hard-stop fires, plant each unanchored enforceable clue via the **existing** `missing_clue` insertion regen into the chapter whose NSD step claimed the reveal, with the acceptance validator being **the gate's own matcher** (injected). Re-collect, hard-stop only what remains. Insertion-only (originals preserved); unflagged — reliability repair per the `dd2190f6`/`257f7855`/`6dff6933` category. **Honest residual:** this mutates prose after story-validation (the standing agent9 trap) — the plant is validated by the insertion pass + hygiene chain + the gate's re-collection, but not the full story-validation suite; a warning is logged on every repair so it is never silent. 4 both-directions tests; worker 305 green; dist verified.

**Deliberately NOT done:** loosening the gate matcher itself (paragraph-window/token tuning). That's detector recalibration — the RC-4 lesson applies (the pronoun audit showed what blind hardening/loosening does). If the A/B era shows the matcher's strictness costs more runs, tune it *with fixtures* then.

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

1. ~~**RC-1** derive-the-panels script~~ — ✅ **DONE** `941fc94e`. *Everything else was unverifiable without it.*
2. ~~**RC-6** bound every LLM request~~ — ✅ **DONE** `941fc94e` + validated live (M1v4 runs 1–2 shipped through the bounded client).
3. ~~**RC-2.1** wire `noTemplateLeakageValidator` → `kind:"leakage"`~~ — ✅ **SOURCE-COMPLETE** 2026-07-16 (default-OFF; build deferred to post-batch).
4. ~~**RC-5** remaining half: stamp `in_progress` reports `INTERRUPTED`~~ — ✅ **DONE** (`mark-interrupted-reports.mjs`; 4 stamped).
5. ~~**RC-2.2** promote `detectDualValueNoContrast`~~ — ✅ **SOURCE-COMPLETE** 2026-07-16 (Item 9 now **7/23**; diff-verified surgical prose-guard rebuild).
6. ~~**RC-3** strike the falsified premises from REMAINING_TO_80~~ — ✅ **DONE** 2026-07-16 (banner + inline `[A_62 …]` strikes). The P4-gate re-read of the rescope *with these numbers* remains part of P3/P4.
7. ~~**RC-4** Item 13 evidence pass~~ — 🟡 **EVIDENCE COMPLETE**; detector has both precision and recall gaps; **blocked on the externals' quoted examples** (never recorded in-repo). Item 10 stays deferred until caps clear.
8. **RC-2.3** the general detector sweep — ⬜ only after 2.1/2.2 measure at P3. **The deliberate stopping point.**
9. **NEXT ACTION (post-batch):** `build:all` → worker-dist verify → one label-check run per lever → the P3 A/B (three levers ×4 pairs, ~£3.60).

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

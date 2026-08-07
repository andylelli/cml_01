# Architecture Review 05 — the probe passed, and the run underneath it did not

**Written:** 2026-08-04 · **Type:** an assessment with proposed fixes, following [REVIEW_04](REVIEW_04.md). It exists because the `AGENT3_DEVICE_TIME_BINDING` probe returned a clean PASS on a run whose finished manuscript never names its murderer in a sentence a human wrote.

**Companion documents:** [REVIEW_04](REVIEW_04.md) is the state of the geometry work · [THINK_01](THINK_01.md) is the diagnosis this all descends from · [GEOMETRY-AGENT-DESIGN](GEOMETRY-AGENT-DESIGN.md) §10 is the build record.

**§10 is the geometry fix plan. §11 assesses the whole outstanding backlog from REVIEW_01/03 and THINK_01 against it and merges both into one order — including three items recommended AGAINST.**

**Method marking:** **MEASURED** · **INFERRED** · **UNVERIFIABLE**.

---

## Status — 2026-08-06

**Every free item on this board is closed.** What is left costs money or needs a person.

| | |
|---|---|
| **Done** | 22 items ✅ — N1–N5 (the free instrument fixes), X2–X7, X9–X16, CS2, ENV, M1/M1b |
| **Open, free, unblocked** | **none** |
| **Open, needs a run** | X8 · S7 · M3 · R5 — all ride-alongs on N6, none needing spend of their own |
| **Open, needs money** | N6 ~£6 · N7/N8 ~£3 each · CS1 ~£3 · M6 ~£3 · R6 £4–8 · M1c ~£0.04 |
| **Open, needs you** | R10 (sign the ratification brief, ~15 min) · D2 (after N6) · X4 Option 1 (after N7) · M1d (find five manuscripts) |

**The board changed shape twice since it was written, both times for the same reason.**

1. **Reviewing this session's own commits found six more defects** ([§27](#27-reviewing-this-documents-own-work--six-defects-all-fixed)),
   four of them in *instruments* rather than the pipeline. §6 said *"a detector that has never been
   run against real prose is a hypothesis"*; that rule had not been applied to the detectors this
   session shipped. All six are fixed.
2. **M1b came back negative** ([§28](#28-m1b--the-answer-is-no-and-the-corpus-is-the-bigger-finding)).
   The deterministic `noResolution` verdict is wired correctly, fires exactly as designed, and moves
   the score by **zero** — a pre-existing cap already bound the ending. More seriously, the ledger
   internals that §13's whole diagnosis reasons from **do not reproduce** (1936: 73 → 64), and five of
   the seven calibration pairs name manuscripts that are not on disk.

**So the measurement track is in worse shape than §11 assumed, not better.** §11.1 held R6 and M6 back
*"until Move 1 lands"*; Move 1 has landed and it did not repair the judge. The cheapest next question
is no longer M1b but **M1c** — score one story three times and find out whether a single rubric number
is stable at all, for about four pence. Every paid item below is judged by that instrument, N6 included.

**Recommended next:** M1c (~£0.04, offline) → then N6 (~£6) with its four ride-alongs. R10 needs
fifteen minutes of yours whenever convenient and blocks nothing.

---

## Progress tracker

Everything outstanding, in one place. `☐` not started · `◑` partial · `✅` done · `👤` owner's call · `⛔` recommended against, with reasons.

**Free work first. Nothing below is blocked on code except where marked.**

> ⚠️ **MAINTENANCE RULE — owner instruction, 2026-08-04.** This table is updated **as work happens**,
> in the **same commit** as the change, never in a batch afterwards. A tracker that lags reads as
> authoritative while being wrong — the same defect as a zero that is never written. New outstanding
> work gets a row **and** a §12 section; nothing is deleted, only moved to *recommended against* with
> its reason.

| ID | Item | Cost | Status | § |
|---|---|---|---|---|
| **A. Measurement — gates every quality claim** ||||
| M1 | ~~Rewrite the judge as the external rubric~~ → **diagnosed**, then **tested**: the deterministic `noResolution` is wired correctly and moves no score (§28). The blind-spot hypothesis is not supported, and §13.1's numbers rest on internals that no longer reproduce | ~1 day | ✅ | [§13](#13-m1--what-the-judge-diagnosis-actually-found) · [§28](#28-m1b--the-answer-is-no-and-the-corpus-is-the-bigger-finding) |
| M1b | Re-scored 2026-08-06, $0.0122. **Wiring correct; effect ZERO** — the new cap is redundant with one already firing. Hypothesis not supported, and the ledger's internals do not reproduce (1936: 73 → 64) | ~£1 | ✅ | [§28](#28-m1b--the-answer-is-no-and-the-corpus-is-the-bigger-finding) |
| M1c | **No.** 8 scorings of one story, caps off: **66–72, spread 6 marks, sd ~2.4.** Any rubric delta under ~6 is noise — including the −2.0 that justified deleting `AGENT9_CRITIQUE_REWRITE` | £0.04 | ✅ | [§30](#30-m1c--one-score-is-worth-3-marks-and-that-invalidates-a-deletion) |
| M1d | ~~The calibration corpus is 2 of 7~~ → **all five found by grep** (paths had elided IDs). Re-scored on one basis: **ranking agreement 42.9% → 84.2%**, and the geometry verdict contributed zero. The judge was never the problem | free | ✅ | [§29](#29-the-judge-was-not-the-problem--the-corpus-was) |
| R10 | Ratify the 12 ADRs — **signed 2026-08-06.** 11 Accepted, ADR-0012 stays `Proposed` with its probe owed; ADR-0004's rule is now enforced by a lint, not stated | ~15 min | ✅ | [§25](#25-r10--the-ratification-brief) |
| **B. Free instrument fixes — geometry can't be trusted to read a probe until these land** ||||
| N1 | Record an injected disclosure as `met_by_injection`, not as satisfied | free | ✅ | [§14](#14-n1--done-and-what-it-revealed-about-the-ordering) |
| N2 | `unaccounted_time` instead of `third_time` (locked-fact times are accounted) | free | ✅ | [§10.2](#102-n2--unaccounted-time-instead-of-third-time-free) |
| N3 | Normalise once at the checking boundary | free | ✅ | [§10.3](#103-n3--normalise-once-at-the-checking-boundary-free) |
| N4 | Warn when a beat label and its chapter disagree — **also gates reading N1's count** (§14.3) | free | ✅ | [§10.4](#104-n4--warn-when-the-beat-label-and-the-chapter-disagree-free) · [§15](#15-n4--done-and-the-control-that-nearly-passed-silently) |
| N5 | Hydrate replays from committed artifacts, not the prompt log | free | ✅ | [§10.5](#105-n5--hydrate-replays-from-committed-artifacts-free-unchanged-from-review_04-113) · [§16](#16-n5--done-and-the-two-runs-that-were-replaying-the-wrong-story) |
| N5b | *Fallback if N5 slips:* record the committed candidate in `.actual-run-state.json` | free | ⛔ | Superseded — N5 landed; see [§16.4](#164-why-n5b-is-now-recommended-against) |
| **C. Newly found, not yet planned** ||||
| X1 | `false_solution_absent` — the false-solution chapter never accuses the accused | free to detect | ◑ | [§12.1](#121-x1--the-false-solution-chapter-does-not-accuse-anyone) · [§17](#17-x1--free-half-done-the-repair-partition-is-now-total) |
| X2 | ~~Mechanism regen `score 200` — detector and validator disagree~~ → **no disagreement; the message was unreadable.** Fixed | free | ✅ | [§12.2](#122-x2--a-regen-pass-that-cannot-succeed) · [§18](#18-x2--the-diagnosis-was-wrong-and-the-message-is-why) |
| X3 | `parseEnvBool` silently disables logging when a flag is set to `1` instead of `true` — **four parsers, three wrong** | free | ✅ | [§12.3](#123-x3--a-flag-parser-that-reads-1-as-false) · [§19](#19-x3--one-parser-one-logger-eight-registered-keys) · [FLAG-AUDIT Addendum 9](FLAG-AUDIT.md) |
| X4 | Injector output is not subject to the linters that bind the model — **Option 2 shipped: recorded, counted, never refused.** Option 1 stays the owner's call after N7 | free to record | ◑ 👤 | [§10.6](#106-the-injector-vs-linter-class-free-to-detect-a-decision-to-fix) · [§22](#22-x4--the-injectors-now-report-themselves) |
| X5 | `Agent4-Revision` is a required upstream that has never run in 13 archived runs — every replay reports it missing | free | ✅ | [§16.5](#165-x5--a-required-upstream-that-has-never-run) · [§21](#21-x5--conditional-is-not-the-same-as-legacy) |
| X6 | A_71's red-herring floor was gated on default-OFF `AGENT5_ENABLE_LLM_RETRIES` — a detector wearing the name of a floor. Now governs its own repair. **Landed, never probed** | free | ✅ | [§20](#20-x6-and-x7--two-fixes-that-lived-only-in-the-working-tree) · [FLAG-AUDIT](FLAG-AUDIT.md) |
| X7 | `.env.local` did not override `.env` in the two `dotenv` loaders — the register was reading the losing file | free | ✅ | [§20](#20-x6-and-x7--two-fixes-that-lived-only-in-the-working-tree) · [FLAG-AUDIT](FLAG-AUDIT.md) |
| X10 | `npm test` ran 8 of 17 workspaces — **`beat-scheduler` (N6's own package) and `rubric-score` (M1b's) were both outside it**, and a mid-chain failure could not change the exit code | free | ✅ | [§24.4](#244-x10--npm-test-ran-8-of-17-workspaces) |
| X9 | **N6's lever could not be set.** Agent 7's four flags were module-consts, frozen before dotenv — `AGENT7_SCHEDULER_AUTHORITATIVE` from `.env.local` read `false`. Now runtime getters | free | ✅ | [§24](#24-the-pre-spend-audit--n6s-lever-could-not-be-set) |
| X11 | **M1's deterministic `noResolution` read the BOUND CHAPTER, not the manuscript** — inverting §14.4 on every run whose disclosure lands outside the contract. Now a story-level `manuscriptDisclosure` verdict | free | ✅ | [§27.1](#271-x11--m1-was-reading-the-wrong-question) |
| X12 | **`geometry-backtest.mjs` could not exercise N1 or N2** — no `injectionTemplates`, no `lockedFacts` — and its summary line read a field N1 deleted, so it printed `0/11 satisfied` on every run | free | ✅ | [§27.2](#272-x12--the-corpus-probe-was-blind-to-the-two-fixes-it-was-meant-to-check) |
| X13 | The injection registry had no totality test against `SCAFFOLD_EXHAUSTION_FLOORS` — §10.1 recorded one as shipped. Built, and verified to go red on an unregistered floor | free | ✅ | [§27.3](#273-x13-x14-x15--found-and-fixed) |
| X14 | **Eleven** `gpt-4o-mini` fallbacks, not the three first reported — including both production entry points. One resolver, no silent default | free | ✅ | [§27.3](#273-x13-x14-x15--found-and-fixed) |
| X15 | One `accept.ts` call site bypassed N3's folding boundary (unreachable today) | free | ✅ | [§27.3](#273-x13-x14-x15--found-and-fixed) |
| X16 | **`npm test` could not catch a type error** — vitest compiles from `src`. Now gated by `pretest`, verified to fail the suite on a planted error. X10's neighbour | free | ✅ | [§27.5](#275-x16--the-suite-that-could-not-catch-a-type-error) |
| X17 | **The N6 lever's confirmation goes to `console.info`, not the report** — so a probe's treatment arm cannot be identified from its durable record. Found by briefly mis-reading N6 as not having fired | free | ☐ | [§31.1](#311-the-lever-fired--verified-in-the-artifact-not-the-terminal) |
| X8 | **Read on N6's control arm:** 21 calls `gpt-4.1-mini`, 25 `gpt-4.1`, 5 `claude-sonnet-5`, **zero `gpt-4o-mini`**. X7 confirmed in production; X6's floor fired (2 herrings sanitised) | free | ✅ | [§31.2](#312-what-the-pair-settles) |
| **D. Paid probes, in dependency order** ||||
| N6 | **Pair run 2026-08-06/07, ~£3.** Lever fired (verified in the artifact). Budgets honoured (+8% vs −33%) — but the reveal misbinding survives BOTH arms, which was the argument for promoting it | ~£3 | ✅ | [§31](#31-n6--the-pair-ran-and-the-scheduler-does-not-fix-what-it-was-promoted-to-fix) |
| D2 | **DECISION:** after N6, are geometry phases 2–4 still worth their cost? N6's input is in §31.4 — the scheduler works mechanically but does not deliver the structural claim it was promoted on, so N8 is the only untried mechanism aimed at the misbinding | free | 👤 | [§31.4](#314-d1--what-this-gives-the-decision) |
| N7 | Culprit-evidence regen on the edit-list channel | ~£3 | ☐ | [§10.7](#107-the-paid-items--what-ready-means) |
| N8 | Phase-2 geometry contract probe (`AGENT9_GEOMETRY_CONTRACT`) | ~£3 | ☐ | [§10.7](#107-the-paid-items--what-ready-means) |
| R6 | `eval:baseline` — **after M1, not before** | £4–8 | ☐ | [§11.2](#112-the-two-assessments-that-changed-my-mind-while-writing-this) |
| M6 | Give Agent 9 the real rubric — only readable after M1 | ~£3 | ☐ | [§11.1](#111-the-assessment) |
| **E. Ride-alongs — need runs, not runs of their own. Attach to N6.** ||||
| S7 | Retire dead coercion sites — 4 runs at `firings=0`. **N6's pair added two more zeros** | free | ◑ 3 of 4 | [§31.2](#312-what-the-pair-settles) |
| M3 | Whole-manuscript revision — **emitted on both N6 runs** (control: 5 findings, 4 anchored, 1 discarded). Whether `apply` is worth it still needs the anchoring rate across more runs | free | ◑ | [§31.2](#312-what-the-pair-settles) |
| R5 | Live kill-and-resume drill | free | ☐ | [§11.3](#113-ride-alongs--things-that-need-runs-but-not-runs-of-their-own) |
| **F. Deferred — real value, wrong time** ||||
| P4 | Geometry phase 4: retire `applyPlantBeforeReveal`, the aftermath classifier, `enforceSuspectEliminationPresence` | free | ☐ | [§12.4](#124-p4--m5--retiring-the-band-aids) |
| M5 | Delete the deterministic injectors | free | ☐ | [§12.4](#124-p4--m5--retiring-the-band-aids) |
| CS1 | Promote `@cml/clue-spec` out of shadow | ~£3 | ☐ | [§12.5](#125-the-smaller-carried-over-items) |
| CS2 | Add a clincher slot type to `clue-spec` — **shipped**, plus geometry preferring a declared clincher over scoring. Inert until CS1 promotes clue-spec | free | ✅ | [§12.5](#125-the-smaller-carried-over-items) · [§23](#23-cs2--the-clincher-stops-being-whatever-scored-highest) |
| ENV | Delete the duplicated `.env` keys `flags:check` has reported for three sessions — **and six loaders X7 had missed** | 2 min | ✅ | [§12.5](#125-the-smaller-carried-over-items) · [§20.4](#204-env--and-the-six-loaders-x7-did-not-reach) |
| **G. Recommended against** ||||
| M2 | Write the reveal first | days | ⛔ | N8 tests the same hypothesis for £3 |
| R4 | Structured outputs on Agent 7 | ~£3 | ⛔ | Coercion `firings=0` — it fixes a problem that is not occurring |
| R9 | Parallelise 2b/2c/2d | ~£3 | ⛔ | Latency work on a quality-constrained pipeline |
| S4/S6 | Split `agent9-run.ts` / extract `agent9-prose` | days | ⛔ *for now* | Refactoring while the central question is unanswered |
| GF | `geometry_feedback` prompt block | — | ⛔ | No reachable producer; §8.9 forbids the placement it would need |

**Done this session, for context:** the geometry stage and its acceptance test · culprit-integrity and false-time validators · the warning channel (which unblocked S7 and made the rest of this visible) · `AGENT3_DEVICE_TIME_BINDING` (built, probed, PASS) · the canary collision assertion · five instrument defects.

---

## 0. The position, in one paragraph

> The probe I designed answered its question correctly and told me almost nothing about the run. `AGENT3_DEVICE_TIME_BINDING` works — the case's temporal anchors went from appearing **0× and 0×** in the manuscript to **43× and 13×** — and while that was being measured, the same run shipped a story in which **no chapter names the culprit in authored prose**. The only disclosure is a deterministic injector template bolted to the final paragraph: *"Captain Ivor Hale was responsible; the evidence allowed no other reading."* The LLM never said it; a regen pass tried to make it say so and failed; the injector wrote it instead. **Geometry's acceptance test could not see this**, because its guilt vocabulary does not contain the injector's own template word — so the one check built to catch "the story never names its culprit" is structurally blind to the mechanism that most often produces it. Five issues follow, and the ordering of REVIEW_04 §11 needs one change.

---

## 1. What the run measured, separated from what it revealed

**The probe result stands.** MEASURED, and I am not walking it back:

| | control `…662362` | treatment `…981757` |
|---|---|---|
| `apparent_time_of_death` in the manuscript | **0×** | **43×** |
| `actual_time_of_death` in the manuscript | **0×** | **13×** |
| staged time, case vs device | SPLIT | aligned |
| geometry `third_time` | 2 extra | 2 extra |

Two riders also confirmed: the corrected canary collision assertion passes (`CANARY_INTEGRITY_ASSERTIONS {"status":"pass"}`), and **`[Agent 9]` warnings reached the report for the first time** — 12 of them, plus 1 `[Agent 7.5]`. The warning-channel fix works live, and it is how everything in §2 became visible.

**What the probe is not.** It reads two strings and a detector. It was designed that way on purpose, and it did its job. But a green probe next to a story that never names its murderer is worth stating plainly: **a passing narrow instrument is not evidence of a healthy run**, and I nearly reported the run as a success on the strength of it.

---

## 2. Issue A — the story's only disclosure is machine-written

**MEASURED.** Across all ten chapters, zero sentences name either `Hale` or `Vane` alongside a guilt verb. The final paragraph of chapter 10 ends:

> *"In the hush that followed, the survivors were left to measure what had been lost, and what, if anything, might yet be restored. **Captain Ivor Hale was responsible; the evidence allowed no other reading.**"*

That second sentence is not prose. **Three machine layers wrote it, and they disagree with each other:**

```
lint.ts:708          FORBIDS this shape in a resolution chapter:
                     /^[A-Z][a-z][\w\s]+ was responsible/  ·  /placed the matter beyond/
                     — "a resolution chapter must close with an in-scene moment, not a narrator
                        pronouncement that wraps up the case like an end-of-report summary"

agent9-run.ts:2216   INJECTS exactly that shape when the model did not name the culprit:
                     `${culprit} was responsible, and the evidence placed the matter beyond all
                      reasonable doubt.`

regen-integration.ts:510  LAUNDERS it — the B5 scaffold floor matches the injector's phrasing and
                     rewrites it to "was responsible; the evidence allowed no other reading",
                     which the scaffold detector no longer recognises
```

**The linter's rule binds the model and not the injector.** The floor then rewrites the injector's
output until the detector stops seeing it, and the story ends on the exact sentence shape the linter
calls forbidden. The run's own log records the last step: *"scaffold SHIP-CHECK floored
[B5:beyond_reasonable_doubt] in ch10 — template re-introduced after the regen pass"*.

That is a class, not an incident: **the deterministic floors are not subject to the quality gates
that constrain the model.** §10.1 and §10.6 both turn on it.

The causal chain, from the run's own newly-visible warnings:

1. Agent 9 generated ten chapters. **None named the culprit.**
2. `runCulpritEvidenceRegenPass` fired and **failed**: *"regen introduced: modified_or_dropped_original_paragraph:1 (injector floor applies)"*. The rewrite tried to modify an existing paragraph, the insertion-only guard rejected it, and the pass gave up.
3. `enforceCulpritEvidencePresence` — the deterministic floor — appended the template.
4. The release gate saw the obligation satisfied. The story shipped.

This is the disease [GEOMETRY-AGENT-DESIGN §1](GEOMETRY-AGENT-DESIGN.md) names: *"the one integration mechanism that IS wired satisfies obligations by injecting text — which is external complaint #1 in every review."* Here it is, on a fresh run, producing the single most important sentence in the book.

**One nuance that matters for the fix.** The regen pass did not fail because the model refused. It failed because the *only* way to name the culprit in a finished chapter is usually to **modify** a paragraph, and the culprit-evidence pass runs on the insertion-only channel, which forbids exactly that. The guard is correct — a free rewrite once re-gendered shipped prose — but it makes this particular repair nearly impossible to land. **The pass is set up to fail and fall through to the injector.**

### Fixes considered

**A1. Route the culprit-evidence pass through the edit-list channel.** `AGENT9_REGEN_EDIT_LIST` returns only changed paragraphs and splices the rest verbatim, so a paragraph *can* be modified without the collateral risk the insertion guard exists to stop.
*For:* it removes the structural reason the pass fails, and this is the flag's second compelling use case after `aftermath_repeat`.
*Against:* it is an unprobed channel; enabling it for a pass that touches the reveal is the highest-stakes place to debut it.
*Verdict:* **do it, but behind its own flag and after `aftermath_repeat` has exercised the channel once.**

**A2. Make the reveal chapter's obligation a generation-time contract rather than a post-hoc repair.** This is exactly what `AGENT9_GEOMETRY_CONTRACT` does — the reveal chapter's `mustContain` already says "the culprit named outright".
*For:* prevention over repair is the whole thesis of the geometry work; a chapter told what it owes is cheaper than a chapter repaired afterwards.
*Against:* **unproven.** Phase 2 has never run. Betting the fix on it is betting on the hypothesis rather than testing it.
*Verdict:* this is the *right* long-run answer and the reason to run the phase-2 probe — but it is not a fix I can claim today.

**A3. Delete the injector.** [THINK_01 Move 5](THINK_01.md) argues for this, gated on the floor's firing rate reaching zero.
*For:* the injected sentence is worse than no sentence — it is the thing reviewers name.
*Against:* **premature and unsafe.** The firing rate is not near zero; it fired on this very run. Deleting it today converts a bad sentence into a missing disclosure, which is worse, and ADR-0003 forbids exactly that trade.
*Verdict:* **no.** Correct destination, wrong time. Sequence it after A1 and A2 have measurably driven the rate down.

**A4. Make the injector's output visibly a defect rather than a satisfaction.** Whatever else happens, an injected disclosure should be recorded as a *failure that was floored*, not as an obligation met.
*For:* free, immediate, and it makes A3's exit condition measurable — you cannot retire the injector on a firing rate nobody records per-obligation.
*Against:* it fixes no prose.
*Verdict:* **do it first.** It is the precondition for judging A1 and A3 at all.

**Recommendation: A4 now, A1 next behind a flag, A2 as the phase-2 probe, A3 last and only on measured evidence.**

---

## 3. Issue B — geometry is blind to the injector, which is the thing it most needs to see

**MEASURED.** `GUILT_MARKER` in `accept.ts` matches *killed, murdered, strangled, poisoned, stabbed, shot, confessed, guilty, arrested*… and **not "responsible"** — the injector's own template word. Consequences, in both directions:

- **False negative:** if the contract had bound chapter 10, geometry would have called the injected sentence *absent* and driven a regen for an obligation already (badly) met.
- **Worse, the inverse:** as the vocabulary grows, geometry will eventually match the injector's template and mark the chapter **satisfied** — certifying template text as disclosure. The check would then be actively defending the defect it was built to expose.

This is not a word-list bug. It is a category error: **the acceptance test has no concept of "satisfied, but by machine".**

### Fixes considered

**B1. Add "responsible" to the guilt vocabulary.** *For:* one line. *Against:* it chooses the *wrong* one of the two failure modes above — it converts a false negative into a false certification. **Rejected on its own.**

**B2. Give the acceptance test a third verdict.** Not `satisfied | violated`, but `satisfied | satisfied_by_injection | violated`. Detect injector templates explicitly — they are our own literal strings, a bounded set, exactly the shape `run-warnings.ts` already uses for banding — and report a distinct `disclosure_by_injection` finding.
*For:* it makes the defect visible without pretending the obligation is unmet; it gives A3 its exit metric; and it cannot drift, because the templates are ours.
*Against:* a third state complicates every consumer of `GeometryCheck`.
*Verdict:* **do it.** The complication is the point — "met by a machine sentence" is genuinely a different state from both alternatives, and collapsing it into either is what produced this blindness.

**B3. Have geometry ignore injector-authored text entirely** — strip known templates before checking, so an injected sentence cannot satisfy anything.
*For:* the purest reading of "the acceptance test judges the manuscript a reader receives"… except a reader *does* receive it.
*Against:* it would report the chapter as violated with no indication that a floor fired, losing the information B2 keeps.
*Verdict:* **rejected**, but its instinct — that injected text should never count as satisfaction — is preserved inside B2.

**Recommendation: B2, with the template set imported from the injector rather than re-typed.** A second copy of those strings is the two-bodies trap, and this document has now recorded five instances of it.

---

## 4. Issue C — "exactly two times" is the wrong rule

**MEASURED.** `third_time` flagged `"half past two"` in chapter 9. That value is `kitchen_timer_setting`, **a locked fact of the device** — a legitimately fixed clock value the injector prints 7 times. Geometry called the story incoherent for stating a time the case itself declared.

The rule in [STORY-GEOMETRY §5](STORY-GEOMETRY.md) — *"the manuscript may contain no third time"* — is a correct intuition stated too strongly. A mystery may contain any number of clock readings; what it may not contain is a clock reading that **nothing accounts for**. A timer setting, a chime time, a train departure are all accounted for.

### Fixes considered

**C1. Widen the allowed set to every clock-valued locked fact.** *For:* small, exactly matches the failure, and uses data already on `ctx`. *Against:* it lets a *wrong* device time pass unnoticed — but that is `checkLockedFactTimeAlignment`'s job, not this check's.

**C2. Drop `third_time` to a warning.** *For:* avoids false positives entirely. *Against:* throws away the check that caught story 1936's headline defect, to fix a bounded false-positive class. **Rejected** — that is over-correcting from one bad reading.

**C3. Reframe as "unaccounted time".** Allowed = the two anchors ∪ every clock-valued locked fact; violated = a parseable time outside that union. Rename the code so the report says what it means.
*Verdict:* **C3.** It is C1 plus honesty in the label, and it keeps the detection that matters. Both control-run extras (`ten minutes past eleven`, `five to eight`) remain violations under it, so the 1936-class signal survives.

---

## 5. Issue D — the contract bound the wrong chapter, for the third run running

**MEASURED.** The outline's `final_trap` beat sat at chapter 8, so geometry bound `reveal → 8` and `aftermath → 9`, leaving **chapter 10 — the actual ending — unbound**. Chapter 8 is titled *"The Discriminating Test"*.

Three runs, three misbindings: 1936 (`final_trap` at 7 of 9, reveal at 9), 08-04 control (bound 8 of 10, correct), 08-04 treatment (bound 8 of 10, disclosure at 10). **The beat label is not a reliable indicator of what a chapter does.**

### Fixes considered

**D1. Bind the reveal to the last chapter instead.** *Against:* 1810's reveal genuinely was `final_trap` at 9 of 10 with a separate aftermath. This trades one misbinding for another. **Rejected.**

**D2. Cross-check the beat against the chapter's own title/summary and warn on disagreement.** *For:* cheap, and it makes the misbinding visible rather than silent. *Against:* warns without resolving.

**D3. Promote `beat-scheduler` so the beats are authoritative by construction.** This is §8bis's proposal and REVIEW_04 §11.4 D1.
*For:* it attacks the cause. If the grid assigns beats, the label and the content agree by construction.
*Against:* unproven, ~£6, and it may not change what the *prose* does with the chapter it is given.
*Verdict:* **D2 now (free, honest), D3 as already planned.** But this is the third datapoint, and it strengthens the case for doing D1-the-probe before the geometry probes — which REVIEW_04 §11 already says.

---

## 6. Issue E — the instruments keep being wrong in one specific way

Five defects in my own detectors, all found by real data and none by unit tests:

| # | Defect | The shape |
|---|---|---|
| 1 | reveal check was paragraph-scoped | conjunction at the wrong granularity |
| 2 | chapter lookup was positional | index assumed to be identity |
| 3 | clearance budget required evidence in-sentence | conjunction at the wrong granularity |
| 4 | typography unfolded | needle and haystack disagree on a character |
| 5 | typography folded on one side only | **the fix for 4 made it worse** |

Every one is the same underlying error: **the instrument and the text disagreed about what counts as a match**, and the disagreement was invisible against tidy fixtures. Number 5 is the sharpest — a partial fix that made the check accuse the manuscript of inventing the very hour the case declared.

### Fixes considered

**E1. Write more unit tests.** *Against:* all five passed unit tests. More of the same catches none of them. **Rejected.**

**E2. Make every new detector run against the corpus before it ships.** `geometry-backtest.mjs` and `validator-corpus-check.mjs` already do this for two families; the pattern generalises: no detector is trusted until it has been run over every archived manuscript and its firings eyeballed once.
*For:* it is precisely how all five were found.
*Against:* the corpus is 12 runs and stylistically narrow; it will not surface everything.
*Verdict:* **adopt as a rule** — cheap, offline, and empirically the only thing that has worked.

**E3. Normalise once, at the boundary.** Fold typography, case and whitespace when the manuscript enters the checking layer, so no individual check can get it half-right.
*For:* removes the class rather than the instances; defect 5 was possible *only* because folding was per-call-site.
*Against:* a normalised copy diverges from what ships, so paragraph indices used for regen targeting must be taken from the original.
*Verdict:* **do it**, with the index caveat explicit in the type.

**Recommendation: E3 structurally, E2 as process.** And a rule this document should state plainly: **a detector that has never been run against real prose is not a detector, it is a hypothesis.**

---

## 7. Does REVIEW_04 §11 still hold?

Mostly. One change and one addition.

- **§11.4 D1 (promote `beat-scheduler`) gets stronger.** Issue D is its third datapoint.
- **§11.2 B is done and it worked** — but this run shows a passing coherence probe says nothing about the endgame, so B's success must not be read as license to skip D2's re-justification.
- **NEW, and it goes before everything paid:** Issue A4 + B2. Until an injected disclosure is recorded as a floored failure, **there is no exit metric for the injector**, and THINK_01 Move 5 stays permanently un-runnable. This is the cheapest high-value item on the board and nothing depends on it.

The re-ordered head of the plan:

| # | Item | Cost | Why here |
|---|---|---|---|
| **N1** | A4 + B2 — injected disclosure recorded as `satisfied_by_injection` | free | Creates the metric every later injector decision needs |
| **N2** | C3 — "unaccounted time" instead of "third time" | free | Removes a live false-positive class |
| **N3** | E3 — normalise at the checking boundary | free | Kills the defect family in §6 |
| **N4** | D2 — warn when beat and chapter content disagree | free | Makes the misbinding visible pending D3 |
| N5 | C1 — hydration from committed artifacts | free | unchanged, blocks D1 |
| N6 | D1 — promote `beat-scheduler`, ≥4 runs | ~£6 | unchanged, now with three datapoints behind it |
| N7 | A1 — culprit-evidence pass on the edit-list channel | ~£3 | after `aftermath_repeat` has exercised the channel |
| N8 | D3/A2 — phase-2 geometry contract probe | ~£3 | unchanged |

**Everything new is free and offline.**

---

## 8. What would change my mind

- **If A4/B2 shows the injector fires on most runs**, then the endgame problem is not a geometry problem at all — it is that Agent 9 cannot write a reveal, and the fix is Move 4 (frontier model for generation), not more contracts.
- **If promoting `beat-scheduler` fixes the misbindings and the endgame failures**, geometry's remaining scope is the craft ceiling, and phases 2–4 should be re-justified before more money goes near them. REVIEW_04 §11.4 D2 already reserves that decision; Issue D makes it likelier to bite.
- **If the phase-2 contract probe moves nothing**, the thesis that under-specification causes the endgame failures is wrong, and the honest response is to stop at shadow — the design's own exit condition.
- **If a sixth instrument defect appears after E3 lands**, then normalising at the boundary was not the class, and the problem is that these detectors are regex over prose at all — which would argue for the LLM-judged acceptance test the design deliberately avoided.

---

## 9. The uncomfortable summary

The geometry work has now found, in order: a culprit chosen by array position who was the falsely accused suspect; a false-time deception backwards in both directions; a warning channel that discarded everything Agent 9 ever said; two contradictory time models; and a story whose only disclosure is a machine-written sentence. **Five real defects, none of them geometry's, all found by building a checker and pointing it at real output.**

Against that: **no probe has yet shown geometry improving a story**, and this run is the first evidence that the acceptance test can be silently blind to the exact failure it was designed to catch. Both things are true at once, and the second is the reason §11 now starts with three free instrument fixes rather than a paid probe.

---

## 10. The fix implementation plan

**How to read this.** One subsection per item, in execution order. Each states the **files**, the
**change**, the **proof it worked**, the **risk**, and the **rollback**. Items N1–N4 are free and
offline; N5 onward cost money and inherit REVIEW_04 §11's dependency structure unchanged.

**Three rules that apply to every item below**, learned from §6's five instrument defects:

1. **No detector ships without a corpus run.** `probe:geometry-backtest` and `probe:validators` over
   every archived manuscript, firings eyeballed once. A detector that has never met real prose is a
   hypothesis.
2. **One body per concept, and the needle comes from the producer.** Template strings, beat lists and
   parsers are imported, never re-typed. Five of the defects recorded across REVIEW_04 and this
   document are second copies drifting from firsts.
3. **Nothing here is batched with anything else in a probe run.** Each behaviour-changing flag is
   settled alone, or attribution is lost.

---

### 10.1 N1 — record an injected disclosure as a floored failure *(free)*

**The problem.** §2: the obligation reads as met, the sentence is machine-written, and no artifact
distinguishes the two. Without that distinction there is no exit metric for the injector, so
[THINK_01](THINK_01.md) Move 5 can never be run.

**Files.**

| File | Change |
|---|---|
| `apps/worker/src/jobs/agents/agent9-run.ts` | Export the injector's own template builders as a `PROSE_INJECTION_TEMPLATES` registry — the literal at `:2216` and its siblings, as regexes derived from the same functions that write them |
| `packages/prompts-llm/src/agent9-prose/regen-integration.ts` | Export `SCAFFOLD_EXHAUSTION_FLOORS`' `replacement` strings as part of that registry — **the laundered forms, not just the originals** |
| `packages/story-geometry/src/types.ts` | `GeometryCheck.satisfied: boolean` → `verdict: "met" \| "met_by_injection" \| "unmet"` |
| `packages/story-geometry/src/accept.ts` | Accept `injectionTemplates` in `GeometryAcceptanceOptions` (the `parseClockTime` injection pattern — a leaf cannot import upward). A check whose evidence sentence matches one returns `met_by_injection` |
| `apps/worker/src/jobs/agents/agent9-run.ts` | Pass the registry; count `met_by_injection` on the acceptance diagnostic |

**The subtlety that decides the design.** The shipped sentence is the **laundered** form, not the
injected one — the B5 floor rewrote it. A registry containing only `agent9-run.ts:2216` would match
nothing. It must contain both sides of every floor that rewrites an injector's output, and both must
be imported from where they are defined.

**Proof.** Recompute the 08-04 treatment run's acceptance offline: chapter 10's disclosure must come
back `met_by_injection`, not `unmet` and not `met`. That is a decisive one-shot check against a
manuscript already on disk.

**Risk.** A third verdict touches every consumer of `GeometryCheck`. Contained: two call sites and
the tests. **The real risk is under-matching** — a floor rewrite nobody registered leaves the
sentence looking authored. Mitigated by deriving the registry from the floor table rather than a
hand-list, and asserted by a test that every `SCAFFOLD_EXHAUSTION_FLOORS` entry appears in it.

**Rollback.** Type-only; revert the commit.

**Explicitly NOT in scope.** `met_by_injection` must **not** trigger a regen yet. The pass that would
repair it is the one that already failed (§2), so regenerating on this signal would spend money to
re-fail. It becomes actionable when N7 lands.

---

### 10.2 N2 — "unaccounted time" instead of "third time" *(free)*

**The problem.** §4: `half past two` was flagged as a third time. It is `kitchen_timer_setting`, a
locked fact of the device, printed 7 times because the injector prints locked facts.

**Files.**

| File | Change |
|---|---|
| `packages/story-geometry/src/types.ts` | `TimeModel` gains `accountedTimes: string[]` — clock-valued locked facts that are legitimately fixed but are not times of death |
| `packages/story-geometry/src/derive.ts` | Populate it from a new `lockedFacts` input, keeping only values that parse as clock times |
| `packages/story-geometry/src/accept.ts` | Allowed set = both anchors ∪ `accountedTimes`. Rename `third_time` → `unaccounted_time` |
| `apps/worker/src/jobs/agents/agent75-run.ts` | Pass `ctx.lockedFactRegistry` |
| `scripts/geometry-backtest.mjs`, tests, REVIEW_04 §10.2 | Follow the rename |

**Proof.** The backtest must still flag both 08-02 stories — the 1936 extras (`ten minutes past
eleven`, `a quarter past ten`, `five to eight`) are unaccounted by any locked fact and must survive.
The 08-04 treatment run must drop from 2 extras to 1, losing only `half past two`.

> ⚠️ **CORRECTED 2026-08-06 — this proof was never run, and it is wrong.** The backtest did not pass
> `lockedFacts` at all, so `accountedTimes` was empty on every case and the script was reporting the
> OLD rule's verdicts ([§27.2](#272-x12--the-corpus-probe-was-blind-to-the-two-fixes-it-was-meant-to-check)).
> With the locked facts actually supplied, **two of the three 1936 extras named above — `ten minutes
> past eleven` and `a quarter past ten` — ARE locked facts of the device** and are correctly no longer
> flagged. 1936 drops from 5 unaccounted times to 3, and the §10 criterion still passes. The verdict
> survives; the stated proof did not, and it could not have, because the instrument was not running
> the rule.

**Risk.** Widening an allowed set weakens a detector. Bounded: only clock-valued *locked facts*
widen it, and a wrong device time is `checkLockedFactTimeAlignment`'s job, not this check's.

**Rollback.** Revert; the rename is mechanical.

**Angle considered and rejected.** Allowing *any* CML-mentioned time. Too wide — the CML mentions
alibi windows, and admitting those would let a genuine third time hide behind an alibi.

---

### 10.3 N3 — normalise once, at the checking boundary *(free)*

**The problem.** §6: five defects, all "needle and haystack disagree about a match". Defect 5 existed
*only* because folding was per-call-site — a fix applied to one side.

**Files.** `packages/story-geometry/src/accept.ts`.

**Change.** At entry to `checkManuscriptGeometry`, build one normalised view — typography folded,
whitespace collapsed — and have every check read it. Fold every needle at the same boundary. Delete
the scattered per-comparison `foldTypography` calls.

**The caveat that must be in the type, not a comment.** `paragraphIndices` on a violation feed scoped
regeneration, so they must index the **original** paragraphs. The normalised view must therefore be
positionally identical to the original, and the type should carry both rather than substituting one
for the other.

**Proof.** Every existing test passes unchanged, plus a test that a check cannot be constructed
against unfolded text. The backtest verdict must be unchanged.

**Risk.** Low, and the highest-value structural item here: it removes the family rather than the
instances.

**Angle considered and rejected.** Normalising in `agent9-run` before calling. That puts the
guarantee outside the package that depends on it — the next caller would have to remember.

---

### 10.4 N4 — warn when the beat label and the chapter disagree *(free)*

**The problem.** §5: three runs, and the beat label has now twice pointed the reveal contract at a
chapter that does not disclose.

**Files.** `packages/story-geometry/src/derive.ts`, `closure.ts`.

**Change.** After resolving the reveal chapter, compare its beat against its own title/summary. When
a chapter labelled `final_trap` is titled *"The Discriminating Test"*, or a later chapter's signal
looks more like disclosure, record a `closure.notes` entry naming both.

**Proof.** The 08-04 treatment outline must produce the note (beat `final_trap` @8 vs title "The
Discriminating Test"); the 1810 outline must not (beat `final_trap` @9, title "The Final Trap").
Both are on disk.

**Risk.** A note, not a violation — it cannot break a run. The risk is noise if the heuristic is
loose; keep it to an explicit disagreement, not a similarity score.

**Deliberately not doing.** Re-binding the contract on the strength of the title. Titles are as
model-authored as beats, and preferring one guess over another is not a fix — N6 is.

---

### 10.5 N5 — hydrate replays from committed artifacts *(free, unchanged from REVIEW_04 §11.3)*

Carried forward as written. Acceptance is still the single assertion: replaying `run_20260802-1654`
hydrates the **10-beat** outline (attempt 18), not the 9-scene one (attempt 20).

---

### 10.6 The injector-vs-linter class *(free to detect, a decision to fix)*

§2 exposed something wider than one sentence: **`lint.ts` forbids the model from writing a
summary-verdict closing line, and the injector writes one anyway, and a floor then launders it past
the scaffold detector.** Deterministic floors are not subject to the gates that bind the model.

Two options, and I do not think this is my call to make alone:

**Option 1 — subject injector output to the same linters.** After every deterministic injection,
re-run the chapter linter; if the injected sentence violates a rule the model would have been held
to, record it and refuse the injection.
*For:* it is the consistent position — one standard for machine and model.
*Against:* refusing the injection means shipping without the obligation, which ADR-0003 forbids for a
repairable defect. It converts a bad sentence into a missing one.

**Option 2 — keep the injection, record the contradiction.** Do not refuse; log that an injected
sentence violates a rule the model is held to, with the rule named.
*For:* safe, free, and it produces the firing-rate evidence A3 (retire the injector) needs.
*Against:* the bad sentence still ships.

**Recommendation: Option 2 now, Option 1 only once N7 has shown the repair path can actually land.**
Option 1 without a working repair is just a different way to fail.

---

### 10.7 The paid items — what "ready" means

Unchanged from REVIEW_04 §11.4, with entry conditions made explicit so none is started early.

| # | Item | Cost | Ready when |
|---|---|---|---|
| N6 | Promote `beat-scheduler`, ≥4 runs | ~£6 | N5 done, canary status clean (already fixed), N4's note giving a per-run signal to compare against |
| N7 | Culprit-evidence pass on the edit-list channel | ~£3 | `aftermath_repeat` has exercised `AGENT9_REGEN_EDIT_LIST` once, so the channel is not debuting on the reveal |
| N8 | Phase-2 geometry contract probe | ~£3 | N6 decided (REVIEW_04 §11.4 D2), N1–N3 landed so the acceptance test can be trusted to read the result |

---

### 10.8 Sequencing constraints

- **N1 before N7.** Repairing an injected disclosure requires being able to see one.
- **N3 before N8.** A phase-2 probe read through detectors with a known matching defect is not evidence.
- **N5 before N6.** A probe hydrated from the wrong outline attempt is not evidence either.
- **N2 independent.** Nothing depends on it; do it whenever.
- **Never batch two behaviour flags in one run.** `AGENT3_DEVICE_TIME_BINDING` was settled alone, and
  that is why its result is readable.

---

### 10.9 Definition of done for this plan

The plan is complete when all four hold:

1. An injected disclosure appears on the report as `met_by_injection`, with a per-run count — so the
   injector's firing rate is a number rather than an impression.
2. `unaccounted_time` fires on both 08-02 stories and not on a locked-fact timer setting.
3. Every geometry check reads one normalised view, and a sixth instrument defect of the §6 family
   would be a surprise rather than the pattern.
4. REVIEW_04 §11.4 D2 has an answer on the record: after the scheduler probe, are geometry phases 2–4
   still worth their cost?

**Point 4 is the one that matters.** Everything else is maintenance on an instrument whose value is
still unproven — and this plan should not be read as assuming the answer is yes.

---

## 11. The wider backlog — what is worth doing, and what is not

§10 planned the geometry work in isolation. This section assesses everything still open from
[REVIEW_01](REVIEW_01.md), [REVIEW_03](REVIEW_03.md) and [THINK_01](THINK_01.md) against it, and
merges the two into one order. **Three items are recommended against**, and saying so is the point of
the exercise — a backlog that only ever grows is not a plan.

### 11.0 One item closed by this session

REVIEW_03 §0k marked **S7** *"blocked on a defect, not a run"*: the R4 coercion counters did not emit
on a run that demonstrably reached their call site, and the board could not explain why.

**It was the warning-channel severing (§4.3 of [REVIEW_04](REVIEW_04.md)).** `recordAgent7Coercion`
pushes to `ctx.warnings`; Agent 7 runs after Agent 6; Agent 6 replaced the array. MEASURED across the
two 08-04 runs:

```
control    (pre-fix)    19 warnings,   0 × [R4]
treatment  (post-fix)  100 warnings,   1 × [R4]   firings=0
```

S7's exit condition — the counters reading zero across real runs — now has its first reading, and it
is **zero**. The blocker is gone; what remains is runs, and it needs none of its own (§11.3).

*Correction to §0k while it is open:* it cited "no `agent7_coercion` diagnostic on the report" as one
of four proofs. That diagnostic is present on **both** runs — it travels via `scoreAggregator`, not
the warning channel — so that limb of the evidence does not reproduce.

### 11.1 The assessment

| Item | Cost | Verdict | Reasoning |
|---|---|---|---|
| **THINK_01 Move 1 — rewrite the judge** | ~1 day, ~£1 | **DO FIRST** | At 42.9% ranking agreement, no quality claim in any document is checkable. It needs no new run — the external prompt is in the review files and seven internal/external pairs are on disk. Everything else in this table that reads quality is worth less until it lands |
| §10 N1–N4 — the free instrument fixes | free | **DO** | Independent of the judge; unblocks the geometry probes |
| N5 — hydration from committed artifacts | free | **DO** | Blocks every matched-pair probe |
| **N6 — promote `beat-scheduler`, ≥4 runs** | ~£6 | **DO** | §8bis's discriminating test, now with three misbinding datapoints (§5). May cut the value of geometry phases 2–4, which is exactly why it goes before them |
| **Move 3 — whole-manuscript revision** | ~£0 to start | **DO, as a ride-along** | `AGENT9_FULLSTORY_DIAGNOSTIC=shadow` costs one call per run and produces findings on runs that are happening anyway. A_70 found the polish lever had *never executed*; shadow is how that stops being true |
| S7 — retire dead coercion sites | free | **DO, as a ride-along** | Unblocked (§11.0), reading zero. Needs runs, not dedicated ones |
| R5 — live kill-and-resume drill | free | **DO, as a ride-along** | Kill one probe run mid-flight and resume it. No extra spend |
| N7 — culprit-evidence on the edit-list channel | ~£3 | **DO, after N1** | §2's defect has no other repair path |
| N8 — phase-2 geometry contract | ~£3 | **DO, after N6** | And see Move 2 below — this is its cheap proxy |
| **R6 — `eval:baseline`** | £4–8 | **HOLD — and re-sequence** | Held at your instruction, and there is now a *reason*: it routes through the 42.9% judge. Baselining with an instrument that ranks at chance buys noise at £4–8. **After Move 1, not before** |
| **Move 2 — write the reveal first** | days + probe | **DON'T BUILD YET** | It is the heavyweight version of the hypothesis N8 tests cheaply: "specify the endgame before writing it". If a prompt-level contract moves first-pass success, that is evidence for building the real thing; if it does not, Move 2 would have been a large bet on a falsified premise |
| **R4 — structured outputs on Agent 7** | ~£3 | **DON'T** | Its purpose is to remove Agent-7 coercion. Coercion `firings=0` on the run just measured — **it fixes a problem that is not occurring.** The same evidence promotes S7 (delete the sites) over R4 (make them unnecessary) |
| **R9 — parallelise 2b/2c/2d** | ~£3 | **DON'T** | Latency optimisation on a pipeline whose constraint is quality. Correct to have built; not worth a probe slot now |
| **S4 / S6 — split `agent9-run.ts` / extract `agent9-prose`** | days | **DON'T, yet** | Real maintainability value — several defects this session hid in a 6,814-line file. But refactoring while the central quality question is unanswered is displacement. Revisit once Move 1 and N6 have produced a direction |
| Move 6 — give Agent 9 the rubric | ~£3 | **DEFER** | Cheap and plausible, but its effect is only readable through the judge. After Move 1 |
| R10 — ratify the ADRs | ~1 h | **OWNER** | Not blocking anything technical. An agent can reconstruct what was decided; it cannot ratify |
| The other 20 DEFER flags | — | **LEAVE** | Two matter and are already scheduled: `AGENT9_REGEN_EDIT_LIST` (N7) and `AGENT9_FULLSTORY_DIAGNOSTIC` (Move 3). The rest have no pending question |

### 11.2 The two assessments that changed my mind while writing this

**R4 is dead on the evidence, and it takes S7 with it — in the opposite direction.** R4 exists to make
Agent 7's ~55 coercion sites unnecessary by constraining the model's output shape. But the counters
now say `firings=0`: the coercion sites are not firing. Probing R4 would spend £3 to prevent
something that is not happening, while S7 — *delete the sites* — becomes the cheaper move on the same
evidence. **The unblocking of S7 is what demotes R4**, and neither board could see that because the
counters were being discarded.

**R6 is not merely "held", it is mis-sequenced.** REVIEW_03 lists it as the last money item awaiting
your say-so. It should not be run at all until Move 1 lands: a baseline is only as good as the
instrument that measures it, and this one ranks at chance. Spending £4–8 now would produce numbers
that cannot be compared against anything later.

### 11.3 Ride-alongs — things that need runs but not runs of their own

Three items need live execution and no dedicated spend. Attach them to N6's four scheduler runs:

| Ride-along | How | Reads |
|---|---|---|
| S7 | nothing to enable | `[R4] … firings=` on each run; four zeros retires the sites |
| Move 3 | `AGENT9_FULLSTORY_DIAGNOSTIC=shadow` | finding count and class distribution; the anchoring-discard rate decides whether `apply` is ever worth it |
| R5 | kill run 3 mid-flight, resume it | 0 LLM calls for the restored stages; artifacts not overwritten |

**One caution.** `AGENT9_FULLSTORY_DIAGNOSTIC=shadow` is read-only, so it does not violate the
one-lever-per-run rule that keeps N6's result attributable. S7 and R5 change nothing at all. **Do not
add anything that alters prose to those runs.**

### 11.4 The merged order

Free work first, then paid, with the two independent tracks marked — Move 1 does not block the
instrument fixes and should proceed in parallel.

```
TRACK A (judgement)                    TRACK B (geometry + instruments)
─────────────────────────────          ────────────────────────────────
1. Move 1 — rewrite the judge          1. N1  injected disclosure recorded   free
   ~1 day, ~£1, no new run             2. N2  unaccounted time               free
   Re-score the 7 existing pairs       3. N3  normalise at the boundary      free
   Re-run eval:calibrate               4. N4  beat/content disagreement      free
                                       5. N5  hydration from artifacts       free
   ↓ gates everything below
                                                    ↓
        ┌───────────────────────────────────────────┘
        ▼
6. N6 — promote beat-scheduler, ≥4 runs                              ~£6
   + ride-alongs: S7 counters · Move 3 shadow · R5 kill-resume
        ▼
7. D2 — DECISION: are geometry phases 2–4 still worth their cost?    free
        ▼
8. N7 culprit-evidence on edit-list  ·  N8 phase-2 contract          ~£6
        ▼
9. R6 eval:baseline  ·  Move 6 rubric-in-prompt                      £4–8
   (both only meaningful once Move 1 has landed)
        ▼
10. Move 2 / Move 5 / S4 / S6 — revisit on evidence, not on backlog age
```

**Total paid: ~£12 before any decision point, plus £4–8 for a baseline that should wait for Move 1.**
Everything in Track B's first five items, and Track A's only item, is free or near-free.

### 11.5 What this ordering is betting

That **measurement precedes construction**. Move 1 and N1–N5 build nothing a reader would notice;
they make it possible to tell whether anything else worked. On a project whose own board says months
of disciplined optimisation were *"a random walk with excellent documentation"*, that is the bet worth
making — and if Move 1 lands and the judge still ranks at chance, [THINK_01 §8](THINK_01.md) is right
that the whole measurement strategy needs rethinking rather than repairing, and this order should be
torn up rather than continued.

---

## 12. Items with no home in §10 or §11

The tracker must not point at sections that do not exist. These are the outstanding items that
surfaced too late for §10, or that carried over from [REVIEW_04](REVIEW_04.md) §11.5 and needed
restating rather than dropping.

### 12.1 X1 — the false-solution chapter does not accuse anyone

**MEASURED**, treatment run `…981757`: `false_solution_absent (ch6): Chapter 6 carries the false
solution but never puts Hugo Vane in the frame.* The contract is
`{accused: "Hugo Vane", proposedChapter: 6, collapseChapter: 8}` and chapter 6 never names him as a
suspect.

This is the mirror of Issue A. The reveal chapter does not disclose; the false-solution chapter does
not misdirect. **Both endgame obligations were missed on the same run**, and only geometry saw it —
no existing gate covers "the false solution must actually accuse the falsely accused".

*Why it is listed separately rather than folded into A:* the repair paths differ. A has a regen pass
that failed for a structural reason (§2). This has **no pass at all** — `false_solution_absent` maps
to nothing in the regen registry, so `apply` mode would detect it and have nowhere to send it.

**Fix.** Two steps, in order:
1. *Free:* leave it detected and reported. It is already on the report; the gap is that nothing acts.
2. *When N8 runs:* the reveal chapter's `mustContain` already carries the disclosure obligation; the
   false-solution chapter's contract carries "a solution that accuses X, argued well enough to
   convince". If the phase-2 probe moves the reveal, the same mechanism should move this — **test
   both from the one probe** rather than building a second repair path first.

**Angle rejected.** Adding a `false_solution` regen pass now. That is a fourteenth pass built before
the thirteenth (`aftermath_repeat`) has ever fired, for a defect seen once.

### 12.2 X2 — a regen pass that cannot succeed

**MEASURED**, same run: `[Agent 9] regen-mechanism UNRESOLVED ch6: regen did not improve the targeted
property (score 200)`.

> **CORRECTED 2026-08-04 — the diagnosis below is wrong; see [§18](#18-x2--the-diagnosis-was-wrong-and-the-message-is-why). The pass is honest. Kept as written because the reasoning that produced the wrong answer is the point of the item.**

`200` is the **maximum** its composed validator can return — two checks at 100 each. `acceptanceReason`
only reports "did not improve" when the candidate failed to beat the prior score, so the pass judged
the chapter already clean while its own detector
(`chapterFullyExplainsMechanism`) had judged it defective enough to fire.

**Detector and validator disagree about the same chapter.** That is the family in §6 again — two
bodies answering "is this wrong?" and reaching different answers — and the cost is concrete: the pass
spends up to two LLM calls per firing and can never register progress.

**Fix.** Diagnose before changing anything. The likely cause is a representation mismatch between the
detector's text (`text`, joined one way) and the validator's (`chapterText(c)`, joined another), which
would make a phrase spanning a paragraph boundary visible to one and not the other — the exact shape
of §6 defect 1. **Do not "fix" it by loosening the acceptance rule**: a pass that reports success
without improving anything is worse than one that reports UNRESOLVED honestly.

### 12.3 X3 — a flag parser that reads `1` as false

`canary-core.mjs` resolves its logging switches through `parseEnvBool`, which accepts only the literal
string `"true"`. Setting `LOG_FULL_PROMPTS_TO_FILE=1` — the form every other flag in this codebase
accepts — **silently disables full-prompt logging**.

Not currently biting: both keys are unset, so the `true` defaults apply, and full logging was verified
live during the 08-04 probe. But it is a trap of exactly the shape FLAG-AUDIT exists to catalogue, and
the failure mode is losing the evidence for a run you have already paid for.

**Fix.** Make `parseEnvBool` accept the same truthy set as the rest of the pipeline (`1|true|yes|on`),
and register the logging keys in FLAG-AUDIT so `flags:check` can see them.

### 12.4 P4 / M5 — retiring the band-aids

Two retirements, gated on the same kind of evidence and repeatedly confused with each other:

- **P4 (geometry phase 4):** delete `applyPlantBeforeReveal`, the aftermath stage classifier, and
  `enforceSuspectEliminationPresence` once each has fired zero times across ≥4 runs.
- **M5 ([THINK_01](THINK_01.md) Move 5):** delete the deterministic prose injectors.

**Neither is startable today**, and the reason is worth keeping visible: the injector fired on the
08-04 run and produced the story's only disclosure (§2). Deleting it now converts a bad sentence into
a missing one, which [ADR-0003](decisions/0003-never-abort-release-gate.md) forbids.

**N1 is the precondition for both.** Until an injected obligation is recorded as
`met_by_injection`, the firing rate is an impression rather than a number, and neither retirement has
an exit condition it can meet.

### 12.5 The smaller carried-over items

| Item | What | Why it is still here |
|---|---|---|
| **N5b** | If N5 slips, at least record which candidate a run committed in `.actual-run-state.json` | It does not recover the 12 ambiguous archived runs, but it stops the corpus growing more of them |
| **CS1** | Promote `@cml/clue-spec` out of shadow | REVIEW_04 §11 paired it with `beat-scheduler` in Phase 0. N6 promotes the scheduler alone — deliberately, since two levers in one probe cost attribution. CS1 is the second probe, not a rider on the first |
| **CS2** | Add a clincher slot type to `clue-spec` | §5's `closure.notes` fires on every run measured: the clincher rests on a clue the set marks `optional`, so no stage but geometry is obliged to place it. The note makes it visible; the slot type would make it false by construction |
| **ENV** | Delete the duplicated `.env` copies of `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_DEPLOYMENT_NAME` | `flags:check` has reported them for three sessions. Two sources for one key is how the `gpt-4o-mini` shadowing survived for months |

### 12.6 What is deliberately not on the tracker

- **The 20 remaining DEFER flags.** Two matter and are scheduled (`AGENT9_REGEN_EDIT_LIST` → N7,
  `AGENT9_FULLSTORY_DIAGNOSTIC` → M3). The rest have no pending question, and listing them as work
  would make the backlog look larger than it is.
- **Move 7 (the five 2/2 complaints).** Not a task — it is the *symptom set* the rest of this plan
  addresses. Geometry now detects four of the five; N7, N8 and M3 are the candidate fixes. Tracking it
  separately would double-count.
- ~~**The five files modified before this session** (`llm-connectivity-harness.ts`, `index.ts`,
  `agent5-run.ts`, `flag-register-check.mjs`, a prompt-records README). Not mine, uncommitted,
  untouched.~~
  > ⚠️ **CORRECTED 2026-08-05 — this was the wrong call, and [§20](#20-x6-and-x7--two-fixes-that-lived-only-in-the-working-tree)
  > says why.** Three of those files were not stray edits: they carried two behaviour fixes that
  > [FLAG-AUDIT](FLAG-AUDIT.md) already records as **FIXED 2026-08-03**. Leaving them untracked
  > because they were "not mine" left the repository asserting a fix it did not contain. They are
  > now X6/X7, committed, with the unprobed consequence tracked as X8.

---

## 13. M1 — what the judge diagnosis actually found

**Started 2026-08-04. The recommendation in §11.1 was based on [THINK_01](THINK_01.md) Move 1's framing, and the data does not support that framing.** What follows is the diagnosis, done before writing any judge, and the small fix it pointed at instead.

### 13.1 Three findings that killed the planned fix

**1. The rubric already IS the external rubric.** Move 1 says *"ours is a different rubric"*. It is not: `prompt.ts` scores ten categories — premise, opening_hook, plot_structure, character_clarity, dialogue, atmosphere, clues, pacing, ending, prose — against the external reader's ten (Premise/concept, Opening hook, Plot structure, Character clarity, Dialogue, Atmosphere/setting, Mystery clues, Pacing, Ending/reveal, Prose/polish). Same ten, same scale, plus `main_problems` and `fastest_fixes`. **Rewriting it would change nothing.**

**2. The hard caps are not the distortion — removing them makes it worse.** MEASURED over the 7 pairs:

```
CAPPED (what ships)                9/21 orderable pairs agree = 42.9%
RAW (LLM marks, caps not applied)  7/18                       = 38.9%
```

Move 1's "structural caps that fire hard" hypothesis is falsified. They are a small net positive.

**3. The judge is not randomly bad. It has one blind spot.** Agreement by how far apart the external reader placed the two stories:

| external gap | pairs | agreement |
|---|---|---|
| ≥1 | 21 | 43% |
| ≥5 | 12 | 50% |
| ≥8 | 5 | 40% |

All three misses at ≥8 involve **the same story** — `2026-08-02-1936`, the one whose reveal names nobody. Exclude it:

```
                        all 7      excluding 1936
gap >= 1                 43%   ->    60%
gap >= 5                 50%   ->    86%   <- the published calibration target
```

**MEASURED. n = 7, and excluding the worst-fitting point is exactly how people fool themselves — so this is a hypothesis with a cheap test, not a result.** But it is a *specific* hypothesis: the judge orders stories acceptably except when a story fails to disclose.

### 13.2 Why it is blind there, precisely

On that story the judge scored `ending: 6/10` — *"The culprit is identified by process of elimination and circumstantial…"* — about a manuscript whose reveal names nobody. The external reader gave it **4/10**: *"No completed culprit exposure; Chapter 9 only points toward Hugo."*

The cap that would have caught it exists (`noResolution` caps `ending` at 5). It never fired, and the reason is one line in `facts.ts`:

```ts
noResolution: fromJudge.noResolution ?? deterministic.noResolution,
```

**`deterministic.noResolution` is never set.** It has no extractor — `noResolution` is the only structural fact that is purely the judge's opinion, unchecked by anything. The judge believed the reveal disclosed, so the flag stayed false and the cap never ran.

Meanwhile geometry's `reveal_culprit_not_named` — which requires the culprit's name and a guilt marker **in one sentence** — got the same story right.

### 13.3 The fix, and what it deliberately does not do

`scoreStory` accepts `noResolutionVerdict`; the orchestrator reads it off the geometry acceptance test that has already run on the committed chapters; `mergeFacts` reverses the precedence so **the detector wins**, as `pronounsUnstable` and the A_68 verifiers already do. `null` when geometry did not run — never `false`, because "not measured" must not read as "the reveal disclosed". The run warnings now record whether the deterministic verdict *agreed with or overrode* the judge.

**What it does not do: tune the caps.** Simulating the existing cap on that story moves its internal from 73 to 72, and ranking agreement does not change — it would still outscore five stories the reader placed above it. Choosing a cap severity that fits 7 data points is overfitting with extra steps. **The wiring is the defensible part; the severity needs more pairs.**

### 13.4 What this changes upstream

- **§11.1's M1 row was wrong as written.** "Rewrite the internal judge as the external rubric, ~1 day" describes work that would not have helped. The tracker now reads `◑` with the real finding, and M1b carries the remaining test.
- **It is the first time geometry has paid for itself in another system.** Its value here is not that it improves a story — it is that it supplies a fact the scoring instrument could not compute for itself.
- **The next step is cheap and falsifiable:** re-score the archived stories with the deterministic verdict wired in and re-run `eval:calibrate`. If agreement moves toward 60/86%, the hypothesis holds and cap severity becomes worth tuning on a larger corpus. If it does not, the judge's problem is broader than one blind spot and [THINK_01 §8](THINK_01.md)'s harder question applies.

> ⚠️ **RUN 2026-08-06, and the answer is the second one — see [§28](#28-m1b--the-answer-is-no-and-the-corpus-is-the-bigger-finding).**
> The verdict is wired correctly, fires on 1936 exactly as designed, and **moves the score by zero**:
> a pre-existing cap already bound the ending. §13.3's simulation said 73 → 72 and missed the cap
> *interaction*. Worse for this section: the ledger internals it reasons from **do not reproduce** —
> 1936 scores **64** today against the 73 recorded here, inverting its gap from +5 to −4. The 42.9%,
> the ≥8-gap misses and the 1936 outlier are all computed from numbers the current scorer does not
> produce, so §13.1's diagnosis is not falsified so much as **unfooted**. M1c and M1d carry what is
> needed to put it back on a footing.

---

## 14. N1 — done, and what it revealed about the ordering

**Completed 2026-08-04.** `GeometryCheck.satisfied: boolean` is now `verdict: "met" | "met_by_injection" | "unmet"`, and the acceptance test can tell the pipeline's own sentences from prose.

### 14.1 What shipped

- **`injection-templates.ts`** — one registry, in `@cml/prompts-llm`, holding both the injector builders and the patterns that recognise them. `agent9-run.ts` now *calls* those builders instead of holding its own copies of the strings, so the checker cannot drift from the writer. It carries the **laundered** forms too: the B5 scaffold floor rewrites what `enforceCulpritEvidencePresence` injects, and a registry holding only the injector's phrasing would have matched nothing on the run that motivated this.
- **`met_by_injection` raises no violation.** The obligation is on the page, badly. Regenerating it would re-run the pass that already failed into the floor — money spent to re-fail.
- **`met_by_injection_count`** is now on the acceptance diagnostic. That is the number [THINK_01](THINK_01.md) Move 5 and §12.4 need; it has never been counted before.

Verified against the sentence that actually shipped:

```
"Captain Ivor Hale was responsible; the evidence allowed no other reading."
   isInjectedSentence                     -> true
   verdict (reveal contract on that chapter) -> met_by_injection
   raises a violation                     -> false
```

### 14.2 The ordering mattered, and it was the reverse of the obvious one

The laundered sentence first read `unmet`, because `GUILT_MARKER` did not contain "responsible" — the injector's own template word (§3, Issue B).

The obvious fix is to add it. **Doing that first would have been the wrong move**: with only two states, a wider vocabulary converts a false negative into a false *certification* — geometry marking a chapter satisfied on the strength of machine text. Adding it is safe **only because the third verdict landed first**, which turns the match into `met_by_injection` rather than acceptance.

That is B2-before-B1 as §3 argued, and it is the kind of ordering that is invisible until the two changes are attempted in the wrong sequence. The regex now carries a note saying so, and `was responsible` is deliberately narrower than bare `responsible` — a character can be responsible for the arrangements.

### 14.3 The coupling nobody planned for: N1's reach depends on N4

On the run that motivated all of this, the acceptance test still reports the reveal as **`unmet`**, not `met_by_injection`. It is right to: the contract binds the reveal to **chapter 8**, and chapter 8 discloses nothing. The injected sentence is in **chapter 10**, which the contract does not bind at all (§5, Issue D).

**So the injection detector only ever sees chapters the contract binds.** Two consequences worth stating before the firing-rate data is trusted:

1. **`met_by_injection_count` will under-report** while the beat labels misbind the reveal. A zero is not yet evidence that the injector did not fire — it may mean the injected sentence landed in an unbound chapter.
2. **N4 is therefore a precondition for reading N1's number**, not merely a nice-to-have. §12.4 says the injector retirements are gated on N1; they are gated on N1 *and* N4.

### 14.4 One judge decision recorded

`met_by_injection` counts as a resolution **for the judge** — `noResolution` is set only by `unmet`. The culprit *is* named on the page, badly; the story that broke calibration (`2026-08-02-1936`) had no such sentence at all and ends on *"the truth poised to emerge in the hours ahead"*.

Treating an injected disclosure as `noResolution` would cap the ending on every run the floor fires on — a scoring change made on n=1. It is counted separately instead, and the decision can be revisited when the firing rate is a number rather than an impression.

---

## 15. N4 — done, and the control that nearly passed silently

**Completed 2026-08-04.** `checkRevealBinding` (in `derive.ts`, called at the end of
`deriveStoryGeometry`) records a `closure.notes` entry when the beat label binds the reveal contract
to a chapter that reads as the discriminating test while a **later** chapter reads as the actual
disclosure. It reports; it does not re-bind (§10.4, *deliberately not doing*).

The note reaches the run report through `ctx.warnings` — the channel repaired earlier this session,
without which this whole item would have shipped into a severed alias and produced nothing.

### 15.1 Verified against all three archived outlines

| run | reveal bound to | note |
| --- | --- | --- |
| 08-02 **1654** | ch 8 `final_trap` "The Final Trap" | **clean** — beat and chapter agree |
| 08-02 **1818** | ch 7 `final_trap` "The Discriminating Test" | **fires** — ch 9 "The Culprit Revealed" is the disclosure |
| 08-04 **1916** | ch 8 `final_trap` "The Discriminating Test" | **fires** — ch 10 "Confrontation and Culprit's Unveiling" is the disclosure |

That is exactly the split §10.4 asked for before the code existed: the two runs whose contract is
misbound are flagged, and the one whose contract is sound is not.

### 15.2 Three false-positive traps, in the order they were hit

**1. The beat label was in the text being matched.** `sceneSignal()` concatenates beat + title +
purpose + summary, so the canonical aftermath beat `revelation` matched the disclosure pattern and
**every well-formed outline** reported a disagreement. The check now reads title/purpose/summary
only: the question is whether the label agrees with the chapter, and feeding the label back in makes
it agree with itself.

**2. `revelation` was in the pattern as well.** Removed for the same reason — it is the Golden-Age
name for the aftermath beat, not a disclosure verb.

**3. The aftermath restates the culprit by design.** Run 1654's chapter 9 says *"Hale's exposure as
the murderer"*, and its chapter 8's purpose is literally *"Execute the discriminating test"* — so a
check keyed on "test-shaped bound chapter **or** later chapter naming the murderer" reported a
defect on the one outline of the three that is correctly bound. Two changes fixed it: an
`AFTERMATH_LIKE` guard (*aftermath, epilogue, reflects, days later*) disqualifies a
looking-back chapter from being the disclosure, and the two halves are now **`and`**, not `or`.

### 15.3 What could not be used as the discriminator, and why

The obvious tightening — *suppress the note when the bound chapter itself claims to disclose* —
would have suppressed the 08-04 run, the single most important case. That outline's chapter 8
purpose reads *"Execute the constraint_proof test to expose pendulum suspension and reveal
culprit"*, while the manuscript's only naming sentence landed in chapter 10 (§14.3). **An outline's
claim about a chapter is not evidence about that chapter**; the only usable signal is the relative
one — where the story puts its disclosure scene compared with where the beat puts the contract.

### 15.4 What this unblocks

§14.3 recorded that `met_by_injection_count` under-reports while the beat labels misbind the reveal,
because the injection detector only sees chapters the contract binds. That is now **visible** rather
than silent: a run whose count is zero and whose report carries this note has not demonstrated that
the injector did not fire. It is still not *fixed* — fixing it is N6 (promote `beat-scheduler`), and
this note is the per-run signal N6's outcome is compared against.

---

## 16. N5 — done, and the two runs that were replaying the wrong story

**Completed 2026-08-04.** Replay hydration now resolves each agent's payload from what the run
**committed**, in three descending strengths of evidence, and says which one answered.

| | source | evidence | applies to |
| --- | --- | --- | --- |
| 1 | `committed_artifact` | `data/store.json` — the payload `onArtifact` wrote as the stage completed | any run with a `projectId` (7 of 13) |
| 2 | `committed_manuscript_shape` | Agent 9's checkpoint: the chapters that were actually written, matched against each candidate outline | runs predating artifact persistence (6 of 13) |
| 3 | `highest_sequence_guess` | the old rule, reported as a guess | nothing, on the current corpus |

### 16.1 The acceptance assertion, and two more that were not asked for

§10.5's single test passes: **run 08-02 1654 now hydrates the 10-beat outline (attempt 18), not
the 9-scene attempt 20.** The manuscript that shipped has ten chapters, so an outline with nine
cannot be the one it was written from — the wrong count is excluded on fact, and title agreement
(8 of 10) then picks between the two remaining candidates.

Running the probe across all thirteen archived runs found **a second corrupted replay nobody knew
about**:

```
run_20260731-1817   old guess: attempt 19   titles agreeing with the manuscript: 0 of 9
                    now:       attempt 18   titles agreeing with the manuscript: 7 of 9
```

Both candidates have nine chapters, so this one was invisible to any chapter-count check. Attempt
18 also carries a **duplicated `final_trap` beat** — which is exactly the duplicate-chapter defect
that run's manuscript exhibits, so the flawed outline really is the one that shipped. Every replay
of 1817 to date has been reading a different story.

Across the seven runs that have store rows, resolution 1 agrees with the old guess every time. So
this is not a behaviour change dressed as a fix: it changes 1654-class runs and leaves modern ones
exactly where they were.

### 16.2 The defect this fix nearly introduced

The hydration **bundle** — the object the run report prints — resolved its own "latest" file
independently of `readLatestAgentJson`. Left alone, N5 would have made the report name attempt 20
while the replay read attempt 18: a measurement layer describing a path the data never travelled,
which is the defect class the previous commit existed to remove, introduced *by* a fix for
mis-hydration.

Both now consume one `committedSelection` map, resolved once in `resolveArtifacts` where the run
folder and workspace root are already in hand. Each bundle entry carries its `source`, so a report
that says `committed_manuscript_shape` is making a checkable claim.

### 16.3 Three smaller things it took to get there

- **`response-body.mjs`** — `canary-agent-boundary.mjs` and `canary-agent3.mjs` each carried a
  byte-identical private `extractResponseJson`, two files along the same call path whose shared
  resolver's own comment warns about exactly this. N5 needed a third caller, so three copies became
  one body.
- **Agent 7.5 hydrates from the store.** It is deterministic and makes no LLM call, so it appears
  nowhere in the prompt log and a record-driven loop reported its artifact as missing on the one run
  that persisted it. The 08-04 run's missing-upstream list drops from two entries to one.
- **`setting` and `cast` are stored wrapped** (`{setting: {...}, cost, latencyMs}`) and consumed
  bare. Verified key-by-key against the 08-04 run; every other type is a superset of its response
  body and passes through untouched.

### 16.4 Why N5b is now recommended against

N5b was the fallback: *if N5 slips, at least record the committed candidate in
`.actual-run-state.json` going forward*. It was explicitly the lesser option — it fixes nothing
already on disk, and REVIEW_04 §11.3 C2 says so.

N5 landed, and it covers the existing corpus as well as future runs. Adding a second recording of
the same fact would create a third place the answer lives, which can disagree with the other two.
Marked ⛔.

### 16.5 X5 — a required upstream that has never run

Found while verifying the bundle: **`Agent4-Revision` has no records in any of the thirteen
archived runs.** It is a conditional revision stage that has never fired, yet it sits in
`PIPELINE_AGENT_ORDER` as a required upstream, so `buildHydrationBundle` reports it missing on
*every* run.

It is not blocking — `canSelfHydrateBoundary` downgrades the error to a warning when the canary
command resolves boundary context itself — which is precisely why it has gone unnoticed. It is the
same shape as the `CANARY_STATUS failure` item already in this document: a warning that fires
always, for a known reason, trains people to read past warnings. The fix is to treat "4" the way
`2b/2c/2d` are already treated — legacy-optional when the run has no records for it — and it is
free. Tracker row **X5**.

---

## 17. X1 — free half done: the repair partition is now total

**Completed 2026-08-04 (step 1 of 2).** `false_solution_absent` still has no repair path, which is
the decision §12.1 argued for. What changed is that the state is now **visible and enumerable**
instead of implicit.

The problem with the 08-04 report was not that nothing acted on the violation — it was that a code
with nowhere to go read exactly like a code that had been routed to a pass and failed. Three things
close that:

- **`GEOMETRY_VIOLATION_CODES`** in `@cml/story-geometry` — all twelve codes, in the package that
  owns them rather than next to the mapping, because a partition kept beside the mapping can only
  check itself.
- **`GEOMETRY_CODES_WITHOUT_PROSE_REPAIR`** — the five codes nothing acts on, each with its reason.
  The reasons matter: three of the five are not prose defects at all (`contract_chapter_missing` is
  an Agent 7 defect, `time_model_unparseable` an Agent 3 one, `clearance_over_budget` a negative
  constraint), so treating them as one class would argue for building four passes where the evidence
  supports considering one.
- **A totality test** (`apps/worker/src/__tests__/geometry-repair-partition.test.ts`) asserting that
  every code is routed, has its own pass, or is excused with a reason — and that the list matches the
  codes `accept.ts` actually emits. A new code cannot join the silent bucket without failing a test.

The Agent 9 warning now carries the reason: `geometry false_solution_absent (ch6): … — NO REPAIR
PATH: X1 — … nothing in the regen registry expresses "argue a wrong solution convincingly".`

**Step 2 is unchanged and still gated on N8**: if the phase-2 probe moves the reveal obligation, the
same mechanism should move this one. Building a fourteenth regen pass before the thirteenth has ever
fired remains the wrong order.

---

## 18. X2 — the diagnosis was wrong, and the message is why

**Completed 2026-08-04.** §12.2 said the mechanism regen pass "cannot succeed" because its detector
and its validator disagree about the same chapter. **They do not.** Both read
`(chapter.paragraphs ?? []).join(" ")` — the detector's `text` and the validator's `chapterText` are
the same expression, twelve lines apart. There is no representation mismatch, and the §6 family this
was filed under does not apply.

### 18.1 What `score 200` actually means

`composeChapterValidator` **silently prepends `noScaffoldValidator`** to whatever checks it is given:

```ts
const all = [(c) => noScaffoldValidator((c.paragraphs ?? []).join(" ")), ...checks];
```

So the mechanism pass composes **three** checks, not two, and scores out of 300. `200` is
100 (scaffold clean) + **0 (the mechanism is still explained)** + 100 (no locked fact dropped) — the
candidate came back still explaining the mechanism, twice, and the pass reported an honest
UNRESOLVED. It is a *model* failure, correctly recorded, not a broken pass.

### 18.2 What was actually wrong

The message. `regen did not improve the targeted property (score 200)` states a bare sum with **no
denominator and no failing check**, so the only reading available is "200 sounds like a maximum" —
which is the reading it got, in a document that then proposed investigating a defect that does not
exist. §12.2's own instruction, *"do not fix it by loosening the acceptance rule"*, would have been
the natural next step from the wrong premise, and it would have made a pass that reports failure
honestly start reporting success.

It now reads:

```
regen did not improve the targeted property (score 200, was 200; still failing: mechanism_explained_too_early)
```

`was 200` is the diagnostic that settles it in one glance: the score did not move, so nothing about
a ceiling is involved. Two tests pin both halves — the named failing check, and silence when there
is none.

### 18.3 The general point, which is worth more than the fix

A validator that composes checks **its callers did not pass it** produces scores its callers cannot
interpret. Every message keyed on `score` from `composeChapterValidator` inherits the same ambiguity;
this one was noticed because it happened to land on a round number that looked like a maximum. The
cheap general guard is what shipped: never report a score without either its denominator or the
names of what failed.

---

## 19. X3 — one parser, one logger, eight registered keys

**Completed 2026-08-04.** §12.3 described one parser in `canary-core.mjs`. There were **four** —
`canary-core.mjs`, `canary-agent-boundary.mjs`, `apps/api/src/server.ts` and the worker's
`cli-runtime.ts` — all resolving the same five logging keys, and only the worker's accepted anything
but the literal string `"true"`.

### 19.1 Why four copies is the more serious half

Three of them carried a comment saying they matched the API's version *"exactly"*. A correspondence
maintained by hand is not maintained, and these had already drifted twice:

- the agent-loop copy once omitted the full-prompt and actual-doc options **entirely**, so an
  agent-loop run wrote `llm.jsonl` and nothing else, silently, for every agent;
- it still defaulted `logFilePath` to a *relative* `apps/api/logs/llm.jsonl` where the other three
  resolve against the workspace root.

Neither drift was caught by anything. Both are the same shape as the defect §12.3 named, and fixing
only the parser would have left the shape in place. All four now call `parseEnvBool` and
`buildLlmLogger` from `@cml/worker` (`jobs/cli-runtime.js`, newly added to the package's exports).

### 19.2 The register could not see these keys at all

`flags:check`'s pattern covers `AGENT*_`, `RUBRIC_*`, `NOVELTY_*` and `LLM_HTTP_TRANSPORT`. The
`LOG_*` keys were outside its scope, which is how a four-parser divergence on the pipeline's evidence
surface survived a flag audit.

The eight keys are now named **individually** in the pattern rather than caught by a `LOG_*`
wildcard — a wildcard would sweep in every LOG-prefixed local and telemetry label in the tree, and
the checker's own comments already record what happens when it reports phantoms. FLAG-AUDIT
Addendum 9 registers all eight as `CONFIG`: they select where evidence is written, not what the
pipeline does, so the promote/delete lifecycle does not apply — but a change to one is now visible.

**Two of the eight are default-ON and unset** (`LOG_FULL_PROMPTS_TO_FILE`,
`LOG_ACTUAL_PROMPT_DOCS_TO_FILE`), which is exactly the class Addendum 1's correction was about: the
run's real behaviour is not reconstructable from `.env.local` alone. They stay unset — a default-on
evidence surface is the right default — but they are written down now.

---

## 20. X6 and X7 — two fixes that lived only in the working tree

**MEASURED, 2026-08-05.** [FLAG-AUDIT](FLAG-AUDIT.md) carries two entries marked
**✅ FIXED 2026-08-03**. Both claims were committed. **Neither fix was.** They sat as uncommitted
edits to three files, and [§12.6](#126-what-is-deliberately-not-on-the-tracker) had explicitly ruled
them out of scope as *"not mine, uncommitted, untouched"*.

That is a worse failure than either underlying defect. A defect is a thing the code does; this was
**the repository asserting a repair it did not contain** — the same shape as X2's unreadable message
and N1's injected disclosure counted as satisfied. A reader checking whether `.env.local` wins would
have found the answer written down, in the document whose job is to be authoritative about flags, and
been wrong.

### 20.1 X6 — the floor that only ever detected

`AGENT5_RED_HERRING_FLOOR`'s bounded regeneration was gated on `if (llmRetriesEnabled)`, and
`AGENT5_ENABLE_LLM_RETRIES` is **default-OFF** ("deterministic remediation mode active"). A_71 §4 had
given the pass its own off-switch precisely so it would work at default config; deferring to the
global retry flag defeated that. On run `mystery-1785694688534` the floor detected the shortfall,
logged *"0 red herring(s) against a budget of 2"*, attempted nothing, and the story shipped with no
misdirection. The earlier run's 2 red herrings were the model's own output, not a repair — **the floor
has never repaired anything.**

Now gated on `redHerringFloor.enabled`. Still one bounded attempt, still no abort path (ADR-0003),
still no deterministic synthesis — a fabricated red herring is the template-injection class A_67/A_68
spent two boards removing.

*One redundancy left in place deliberately:* `assessRedHerringFloor` already returns
`needsRepair = enabled && count < floor`, so the inner `enabled` check inside the `needsRepair` branch
is always true. It is kept because the two conditions answer different questions and the compound one
is the tested unit ([`agent5-red-herring-floor.test.ts`](../apps/worker/src/__tests__/agent5-red-herring-floor.test.ts), 7 tests). Recorded so it is not
later mistaken for a live gate.

### 20.2 X7 — the loaders that read the losing file

`dotenv` does not overwrite a key that is already set, and both worker entry points loaded `.env`
**before** `.env.local`. `.env` therefore won every conflict — while every "SET" state in FLAG-AUDIT
had been read from `.env.local` alone. Both now pass `{ override: true }`.

The other two production loaders were already correct and are unchanged:
[`cli-runtime.ts`](../apps/worker/src/jobs/cli-runtime.ts) reads `.env.local` first under
first-wins semantics, and [`apps/api/src/index.ts`](../apps/api/src/index.ts) reads only
`.env.local`. FLAG-AUDIT's "every production loader" now holds across all four.

### 20.3 What neither fix has had

**A run.** X7 is a real behaviour change on every non-prose agent — `AZURE_OPENAI_DEPLOYMENT_NAME`
resolves to `gpt-4.1-mini` where it resolved to `gpt-4o-mini` — and X6 arms a repair path that has
never fired in production. Tracked as **X8**, a ride-along on N6 rather than a probe of its own: N6
already buys ≥4 runs, and both effects are visible in artifacts N6 collects anyway (the deployment
name in the prompt log, a `restored N red herring(s) after regeneration` warning if the floor fires).

**The probe-validity rule applies with force here** ([§16.3](#163-three-smaller-things-it-took-to-get-there)):
the worker consumes this code via `dist`, so a run started before the rebuild measures neither fix.

### 20.4 ENV — and the six loaders X7 did not reach

Deleting the duplicated `.env` keys should have been the two-minute item it is billed as. It was not,
because **"every production loader" was four files, and there are ten.** Deleting the keys first
would have taken the credentials out from under six of them.

| Loader | Was | Now |
|---|---|---|
| `canary-agent3.mjs` · `canary-agent9.mjs` · `canary-agent-loop.mjs` · `canary-agent-boundary.mjs` | loaded `.env.local` **without** `override` → `.env` won | `{ override: true }` |
| `agent6-blind-reader-variance.mjs` · `rubric-score-spike.mjs` | hand-rolled loaders reading **`.env` only** | `.env.local` first, then `.env`, first-wins |
| `canary-core.mjs` · `cli-runtime.ts` · `agent5-direct-llm-check-harness.ts` · `apps/api` | already correct | unchanged |

**Why this one matters more than its size.** Four of the six are the canary harnesses — *the scripts
that will run N6*. Until this commit the pipeline resolved `gpt-4.1-mini` and its own probe harnesses
resolved `gpt-4o-mini`. A £6 four-run probe would have measured a model the product does not use, and
nothing in the report would have said so. That is the §1 defect of this whole review — the probe
passing while the run underneath it does not — reproduced in the instrument.

The stale half of it was in `flag-register-check.mjs` itself: its header comment still asserted
*"`.env` WINS"* while its own output said the opposite. The checker was right and its documentation
was wrong, which is the X6/X7 shape one more time.

**Then** the keys went. `AZURE_OPENAI_ENDPOINT` and `AZURE_OPENAI_DEPLOYMENT_NAME` are gone from
`.env`, with a comment where they were saying why they must not come back.

```
[flags] code reads 90 · config sets 32 (.env + .env.local) · register documents 93
[flags] clean — every configured flag is read, and every read flag is registered.
```

First clean run in three sessions. Resolved config verified through a loader afterwards:
`gpt-4.1-mini`, `…openai.azure.com`, api-version `2024-12-01-preview`, key present.

*Not committable, and worth saying:* `.env` and `.env.local` are both git-ignored, so the deletion
above exists only on this machine. The tracker row and this section are the only durable record —
which is precisely the argument for it having one.

---

## 21. X5 — "conditional" is not the same as "legacy"

**MEASURED, 2026-08-05:** zero `Agent4-Revision` records across all thirteen archived runs, re-verified
by grep over `documentation/prompts/actual/run_*/` after the two 08-04 runs were added. So
`buildHydrationBundle` reported a missing required upstream on **every replay of every run**, for a
reason that was never a defect.

The obvious fix was to add `"4"` to `LEGACY_OPTIONAL_UPSTREAM_CODES` beside `2b/2c/2d`. That would
have worked and been wrong, because the two absences mean different things:

| | `2b/2c/2d` | `Agent4-Revision` |
|---|---|---|
| Why it can be absent | the branch post-dates the run | the stage was **not needed** |
| The question the rule asks | "is this an old run?" | "did this stage happen?" |
| Depends on the start boundary | yes — only downstream of `2d` | **no** |
| What its absence makes the bundle | `partial` | **complete** |

Agent 4 is the revision pass Agent 3 invokes only when its CML fails validation, after the
targeted-patch path fails to resolve ([`agent3-cml.ts:1575`](../packages/prompts-llm/src/agent3-cml.ts#L1575)).
A run with no Agent-4 records is a run whose CML validated. There is nothing to hydrate and nothing
degraded, so `CONDITIONAL_UPSTREAM_CODES` is its own rule with its own message — *"did not run in the
source run"* — and it does **not** set `integrity.partial`.

**The distinction that keeps it honest.** *No records at all* → the stage did not fire. *Records but
no artifact* → it fired and the artifact is genuinely missing, which stays a hard error: the CML
every downstream agent needs is then the revised one, and hydrating the pre-revision copy would
replay a story the run did not tell. Both directions are pinned by tests
([`sprint5-resume-hydration.test.mjs`](../scripts/canary-loop/__tests__/sprint5-resume-hydration.test.mjs), 81/81 green).

**One thing the old test was quietly telling us.** The pre-existing legacy-downgrade test had to put
an `Agent4-Revision` record in its fixture to pass — a shape no real run has ever produced. A fixture
that has to invent a record to get green is a defect report nobody filed.

---

## 22. X4 — the injectors now report themselves

§10.6 left this as a decision with a recommendation: **Option 2 now** (record the contradiction),
Option 1 (refuse the injection) only once N7 has shown the repair path can land. Option 2 is built.

### 22.1 One registry, checked in both directions

FIX-E2's five verdict-closer regexes were a local `const` inside `lintBatchProse`. That is why the
standard could only ever be applied to prose the model wrote: there was no way to ask the question
about anything else. They are now `RESOLUTION_VERDICT_CLOSER_RULES` in
[`lint.ts`](../packages/prompts-llm/src/agent9-prose/lint.ts) — the same regexes, each with a stable
id — and the linter consumes the registry rather than a copy of it. A second copy would have been the
two-bodies defect §6 is entirely about.

`findModelBoundRuleViolations(sentence)` applies them to **one sentence**, which is the whole trick:
an injected sentence is appended to the end of a final paragraph, so a paragraph-scoped check reads
it as mid-paragraph text and the `^`-anchored rule never fires. The linter would have caught the
shape had a model written it as the closer; now so does this.

### 22.2 What it found, as a test rather than an anecdote

```
findModelBoundRuleViolations(buildCulpritEvidenceSentence("Captain Ivor Hale"))
  → verdict_closer.beyond            ← the injector's own output, forbidden to the model
findModelBoundRuleViolations("Captain Ivor Hale was responsible; the evidence allowed no other reading.")
  → verdict_closer.was_responsible   ← the LAUNDERED form, which is what actually shipped
```

Both are pinned in [`x4-injector-vs-lint.test.ts`](../apps/worker/src/__tests__/x4-injector-vs-lint.test.ts).
The second matters more than the first: the sentence that shipped was the B5 floor's rewrite, so a
check that knew only the injector's phrasing would have found nothing on the very run that produced
this review.

### 22.3 Records, never refuses — and counts what it does not object to

All four injection sites route through one recorder: the three floors at the main call site, plus the
deterministic **repair** path at `hasDeterministicRepairableFailures`, which injects too and was
never measured. `injectResolutionIfAbsent` appends a whole paragraph rather than routing through the
shared helper, so it reports itself at its own site.

The counters are `injections` and `violations`, not just violations. A floor firing constantly while
writing acceptable prose is a different decision from one writing forbidden prose, and Move 5 /
[§12.4](#124-p4--m5--retiring-the-band-aids) needs to tell those apart. `byRule` keys are
`${injector}:${ruleId}`, so an A/B analyser reads a number instead of grepping prose.

`emitAgent9InjectorLintTelemetry` runs once per run **even when everything is zero**, for the reason
N4 and §16 keep re-teaching: a zero that is never written cannot be told apart from a check that
never ran. If the floors fire zero times across N6's four runs, that zero is the retirement evidence
P4 and M5 have been waiting for — and it only counts if it is written down.

### 22.4 What is deliberately not done

The injection still ships. Refusing it converts a bad sentence into a missing one, which
[ADR-0003](decisions/0003-never-abort-release-gate.md) forbids for a repairable defect, and Option 1
without a working repair path is just a different way to fail. **This changes no prose.** It is an
instrument, and it is now one of the reads N6 gets for free.

---

## 23. CS2 — the clincher stops being whatever scored highest

§5 recorded the shape and §12.5 kept it alive: geometry has to name the one object tying the culprit
to the act, and bind a plant-before-payoff obligation to it. Nothing in the clue set says which clue
that is, so `selectClincherClue` scores the available clues and takes the winner — and across three
measured runs **the winner was a clue the set marks `optional`.** Geometry recorded the mismatch
faithfully in `clincher.sourceCriticality` and a closure note, which is honest and does not fix it: a
load-bearing obligation still hangs on a clue every other stage is free to drop.

### 23.1 The slot

`@cml/clue-spec` now derives `slot_clincher` with `role: "clincher"`, `criticality: "essential"`, and
`category: "physical"`. Essential **by construction** — that is the entire item. The mismatch geometry
records cannot arise from a slot that is essential where it is defined.

Source order, and the boundary that matters more than either:

1. the culprit's own `cast[i].evidence_sensitivity[0]` — the evidence *that specific person* is
   vulnerable to, which is what "unique to the culprit" means in CML terms;
2. `discriminating_test.knowledge_revealed` — what the test proves, and therefore what the clincher
   must show;
3. **neither → no slot.** Deriving a clincher from nothing is inventing a clue, which is the one
   thing Stage A must never do ([§3](#3-issue-b--geometry-is-blind-to-the-injector-which-is-the-thing-it-most-needs-to-see)
   and the `clincherTrace` defect of 08-03 are both this rule being broken). An absent slot is the
   honest answer; geometry's scoring fallback still applies.

`suggestedPlacement: "early"` because geometry plants the clincher by chapter 3 at the latest. The
obligation existed; it was only ever expressed downstream, where Agent 5 does not read it.

### 23.2 The half that makes it do something

A slot nothing consumes is a comment. `selectClincherClue` now scores a declared `role: "clincher"`
at **+32** — larger than every other signal combined, on purpose. Scoring is not a tie-breaker
against a declaration; it is the fallback for clue sets that do not carry one. Pinned three ways
(declared beats the scoring favourite, order-independently; scoring unchanged when nothing is
declared; a declaration beats even the `isDeathMethodTell` −6 penalty).

The clincher and the method tell stay separate obligations — geometry already scores the method tell
*down* when picking a clincher, and CS2 derives them from different CML paths, so a case where one
clue could serve both still produces two slots.

### 23.3 What this is worth today: nothing, and that is fine

`@cml/clue-spec` is in shadow. Until **CS1** promotes it, no clue reaches geometry carrying a `role`,
every run takes the scoring fallback, and behaviour is byte-identical. This is a change that pays out
on promotion, and CS1 is the probe that collects it — which is also the argument for having built it
now rather than as part of CS1: promoting a package and changing what it derives in the same run
would leave the result unattributable, the one-lever rule N6 rests on.

---

## 24. The pre-spend audit — N6's lever could not be set

Before spending £6 on N6, one question: **do the instruments N6 is supposed to read actually emit,
and does its lever actually move?** Four of the five answers were yes. The fifth was the expensive one.

### 24.1 X9 — the lever was frozen shut

All four `AGENT7_*` flags were module-level `const`s:

```ts
const AGENT7_SCHEDULER_AUTHORITATIVE = /^(1|true|yes|on)$/i.test(process.env.AGENT7_SCHEDULER_AUTHORITATIVE ?? "");
```

Static `import` statements are hoisted and evaluated **before any top-level statement** in the
importing file, and the worker entry ([`index.ts`](../apps/worker/src/index.ts)) and every canary
harness call dotenv's `config()` *after* their imports. So the const froze to its default before
`.env` or `.env.local` was read. **MEASURED**, reproducing the real load order:

```
module-const (frozen at import): false      ← what the run would have used
runtime getter (read at call)  : true       ← what the env file actually said
```

`AGENT7_SCHEDULER_AUTHORITATIVE` is exactly the lever N6 promotes across four paid runs. Set in
`.env.local` — the documented way to record a lever choice — it would have read `false` on all four.
**N6 would have measured the control arm four times, at full price, and reported a promotion.** The
mirror-image failure is just as real: the two default-ON flags could not have been turned *off*
either, so a run trying to isolate the mechanism gate would have silently kept it on.

This is `module-const-flags-frozen-before-dotenv` — the rule
[`agent9/flags.ts`](../apps/worker/src/jobs/agents/agent9/flags.ts) exists to state, applied
everywhere except the module holding N6's lever. It went unnoticed because a flag exported in the
*shell* works fine, which is how these were presumably last exercised.

All four are now getters. The test that pins it mutates `process.env` **after** the import has been
evaluated — a test that merely set the variable first would have passed against the broken version
too, which is how a frozen flag survives a test suite.

### 24.2 The four that were already sound

| Ride-along | Read | Verdict |
|---|---|---|
| **S7** — coercion counters | `emitAgent7CoercionTelemetry(ctx)` at [`agent7-run.ts:2378`](../apps/worker/src/jobs/agents/agent7-run.ts#L2378), in the run path, emitting even at zero | ready |
| **M3** — full-story diagnostic | `resolveFullStoryDiagnosticMode()` is already a runtime getter, so `AGENT9_FULLSTORY_DIAGNOSTIC=shadow` in `.env.local` will take. Currently unset (`off`) — **add the line when N6 runs** | ready, one line |
| **R5** — kill-and-resume | hydration no longer reports a phantom missing upstream on every replay ([§21](#21-x5--conditional-is-not-the-same-as-legacy)), so a real failure is now legible | ready |
| **X8** — which model answered | `llm-prompts-full.jsonl` records `model` per call; the last line already reads `gpt-4.1-mini` | ready |

### 24.3 Two conditions on N6 that are now cheap to state

1. **Rebuild before launching.** The worker consumes `@cml/*` through `dist`, and Node caches modules
   at process start ([§16.3](#163-three-smaller-things-it-took-to-get-there)). Everything in
   §20–§24 reaches a run only after a build that precedes it. A mid-run rebuild reaches nothing.
2. **Set the lever where a getter can see it.** Either `.env.local` or the shell now works. Before
   X9, only the shell did — and nothing said so.

### 24.4 X10 — `npm test` ran 8 of 17 workspaces

The sweep that closed this session found the suite itself was partial. The root `test` script named
eight workspaces by hand. Seventeen have tests.

**The nine that never ran** — 367 passing tests nobody was running — include the two packages the
next two board items turn on:

| Package | Tests | Why it matters here |
|---|---|---|
| **`@cml/beat-scheduler`** | 17 | **N6 promotes this package.** Its tests were outside the suite |
| **`@cml/rubric-score`** | 87 | **M1b re-scores through this.** Also outside |
| `@cml/clue-spec` | 22 | CS1/CS2 |
| `cml-core` · `period-kb` · `prose-guard` · `device-library` · `novelty` · `style-contract` | 241 | — |

All nine were green, so this bought no bug — it removed the possibility of a silent one in the two
packages about to carry a paid probe.

**The second half is worse than the first.** The eight were chained with `;`, so the script's exit
code was whatever the *last* one returned: any failure before `@cml/cml` left `npm test` exiting 0.
A green suite that cannot go red is the same defect as a zero that is never written — the shape §16
and [§22.3](#223-records-never-refuses--and-counts-what-it-does-not-object-to) keep circling.

Now `npm run test --workspaces --if-present`: **2,684 tests across 17 workspaces**, and the exit code
propagates — verified against a throwaway workspace pair, one passing and one failing, which exits 1.
The hand-maintained list is gone rather than kept as a second body; a new package with a `test` script
is now in the suite by existing.

---

## 25. R10 — the ratification brief

**Prepared 2026-08-06.** R10 has sat at 👤 since REVIEW_05 opened, costed at *~1 h*, which is what it
takes to **read** twelve records. Ratifying them is a different act, and it needs one thing an agent
can produce and cannot perform: for each decision, whether anything measured since it was written
disturbs it. That is below. **The signature is still yours** — [§11.1](#111-the-assessment) is right
that an agent can reconstruct what was decided and cannot ratify it.

Read the *Disturbed by* column. Where it says **no**, ratification is a formality. Three say
something else, and those three are the meeting.

| ADR | The decision, in a line | Disturbed by this session's evidence? |
|---|---|---|
| **0001** CML is the single source of truth | Structure is frozen before prose; every check asks "does the prose render the CML?" | **Pressure, not contradiction** — see 25.1 |
| **0002** Sequential chaining, not an autonomous agent | The stage list is a property of the genre; we can still write it down in advance | no |
| **0003** Never abort; deterministic floor underneath | Ship with an injected sentence rather than ship nothing, *and log the firing as a floor* | **Its second clause only became true this session** — see 25.2 |
| **0004** Flag-gated, default-OFF, promoted on N≥4 | Runtime-read, never a module const; matched pairs; N≥4 per arm | **X9 is a fresh violation of its own load-bearing detail** — see 25.3 |
| **0005** Freeze the Story Bible | Derive once; every consumer dereferences, nobody re-derives | no |
| **0006** `run_outcome` from the release gate | The gate's verdict is the outcome; phase scores inform it | no — and §2 pointed at its stated reversal condition without meeting it (25.4) |
| **0007** Repair ladder: retry → regen → injection | Quality order, stop at first success, the deterministic rung always exists | no — §2 is a defect *in* a rung, not in the ordering |
| **0008** Azure primary, Anthropic for polish | Two orthogonal axes: `AGENT9_MODEL_POLISH` and `AGENT9_POLISH_PROVIDER` | no — its A/B is still owed, and the ADR says so |
| **0009** File-backed store, no database | JSON on disk; forensics is the dominant read pattern | no — N5 leaned on `data/store.json` as its *strongest* evidence class ([§16](#16-n5--done-and-the-two-runs-that-were-replaying-the-wrong-story)) |
| **0010** The report is the durable record | Anything needed to explain a run reaches the report; the terminal is a convenience | no — reinforced four times over ([§22.3](#223-records-never-refuses--and-counts-what-it-does-not-object-to), [§20.4](#204-env--and-the-six-loaders-x7-did-not-reach)) |
| **0011** Measurement before promotion — *including deletions* | A deletion needs the same evidence as an activation | no — it is what holds P4 and M5 shut |
| **0012** Own the HTTP call to the provider | Hand-rolled POST behind `LLM_HTTP_TRANSPORT`, default-OFF | **Cannot be ratified to Accepted** — see 25.5 |

### 25.1 ADR-0001 is where this review applies pressure

Its second reversal condition is *"if the rendering gap proved unclosable — if prose generated from a
frozen structure has a quality ceiling free generation does not."* Every headline defect in this
document is a **rendering-gap** defect: the CML named its culprit and the prose did not
([§2](#2-issue-a--the-storys-only-disclosure-is-machine-written)); the contract named a false accusation
and the prose never made it ([§12.1](#121-x1--the-false-solution-chapter-does-not-accuse-anyone)).
The structure was sound in both cases and the rendering lost it.

That is **not** the reversal condition being met — the ADR requires a demonstrated *ceiling*, and what
we have is a gap nobody has yet tried to close with the two mechanisms already designed for it (N7,
N8). But it is the first time the condition has had live evidence pointed at it, and the honest
ratification is *"accepted, and N8 is the test of its second clause"* rather than *"accepted, nothing
to see."*

### 25.2 ADR-0003 described the system only as of this session

The decision reads: *"when it does [fire] it is **logged as a floor firing** rather than as a
success."* Until [N1](#14-n1--done-and-what-it-revealed-about-the-ordering) and
[X4](#22-x4--the-injectors-now-report-themselves) landed, that sentence was **aspirational**. The
08-04 run recorded the injected disclosure as an obligation *met*, which is precisely what the ADR
says does not happen.

Ratify it — the decision was always right, and it is now also true. But note that an ADR asserting a
property the code did not have is the X6/X7 shape ([§20](#20-x6-and-x7--two-fixes-that-lived-only-in-the-working-tree))
in a different folder: **a document being authoritative about a repair the repository did not
contain.** The lesson generalises past this record — a *Consequences* clause is a claim, and claims in
this project are supposed to carry their measurement.

### 25.3 ADR-0004's fine print was violated in the module holding N6's lever

The ADR names *"runtime-read, never a module const"* as load-bearing and adds *"this has actually
happened."* [X9](#241-x9--the-lever-was-frozen-shut) is it happening again, after the record was
written, in `agent7-run.ts` — the one module holding the lever of the next £6 probe.

This **strengthens** the ADR rather than weakening it: the rule was right, the codebase had an
exception, and the exception was caught by a pre-spend audit that the ADR's own N≥4 discipline
motivated. The note worth attaching at ratification is that the rule needs an **enforcement** and not
just a statement — a lint or a register check that fails on `const X = process.env.Y` at module
scope. A rule that has now been broken *after* being written down, in the module that mattered most,
is not being held by the writing down.

### 25.4 ADR-0006's reversal condition was pointed at, and held

Its first reversal: *"if the release gate were shown to pass stories that a reader would reject
outright, the gate would need strengthening — but the fix would be a stronger gate, not a switch to
phase thresholds."*

[§2](#2-issue-a--the-storys-only-disclosure-is-machine-written) is exactly that case: the gate passed
a story whose only disclosure was machine-written. And the response taken was the one the ADR
prescribes — N1 strengthened the gate's inputs (`met_by_injection`), and nobody proposed switching to
phase thresholds. **The record predicted our own behaviour under a case it had not seen.** That is the
strongest ratification evidence in the set.

### 25.5 ADR-0012 must not be ratified to Accepted

It is the only record still marked **Proposed**, and it has to stay there. Its own decision text says
the SDK path *"remains and stays the default until the transport has a probed run behind it
([0004](decisions/0004-flag-gated-default-off.md))"*, and its reversal condition names the probe
precisely: *one run per arm on a fixed premise, artifacts equivalent, no new error classes.*

**MEASURED 2026-08-06:** `LLM_HTTP_TRANSPORT` is commented out in `.env.local` and unset. The probe
has never run. Promoting the record to Accepted would be promoting an unprobed lever **by
documentation** — the exact act ADR-0004 and ADR-0011 forbid, performed on the ADR that cites them.

**Ratify it as `Proposed`, with the probe recorded as owed.** That is not a deferral; it is the
correct terminal state for a decision whose evidence has not been collected. The cheap route to
Accepted is a ride-along rather than a probe of its own — the transport arm is settled by *artifact
equivalence*, not by prose quality, so it can share a premise with a future run instead of buying one.
It cannot share a *run*: a transport change and a behaviour lever in one run is the batching
[§10.8](#108-sequencing-constraints) forbids.

### 25.6 What this brief deliberately does not do

Change any `Status:` line. Eleven ratifications and one Proposed-with-probe-owed are the *recommended*
outcome of a meeting that has not happened. An agent editing twelve records to read "Accepted" on its
own recommendation would be manufacturing the ratification rather than preparing it — and R10 exists
because settled questions get re-litigated by people who cannot tell a decision from a rationalisation.

---

## 26. The free board, closed out

**2026-08-06.** Everything on the tracker costing £0 and not blocked on a run is now done. This
section is the durable record for the two parts that live in git-ignored files
([ADR-0010](decisions/0010-report-is-the-durable-record.md); the same argument as
[§20.4](#204-env--and-the-six-loaders-x7-did-not-reach)).

### 26.1 The verification sweep at HEAD

Free, offline, and the continuation of [§24](#24-the-pre-spend-audit--n6s-lever-could-not-be-set). All
five green on `07ab0f23`, working tree clean:

| Check | Result |
|---|---|
| `npm test` | **2,684 tests across 17 workspaces, exit 0**, zero failures — the number [§24.4](#244-x10--npm-test-ran-8-of-17-workspaces) promised, now confirmed on a clean tree rather than at the moment of the fix |
| `npm run flags:check` | `code reads 90 · config sets 33 · register documents 93` — **clean**, and still clean after the config change below |
| `npm run probe:geometry-backtest` | **PASS** — all three named defects flagged, and signal separation holds (3 violations unique to the 68-scoring story, 2 unique to the 80) |
| `npm run probe:validators` | 13 runs; a new error would reach Agent 4 on **2 (15%)** — a minority, so §11.1's demotion trigger is not met and the timeline invariant stays an error |
| `npm run build:all` | 16 packages, 56 s, exit 0 |

The build is not housekeeping. [§24.3](#243-two-conditions-on-n6-that-are-now-cheap-to-state) makes it
a **precondition of N6**: the worker consumes `@cml/*` through `dist`, Node caches modules at process
start, and a run launched before this build would have measured none of §20–§24. Verified in the
**built output** rather than the source, because grepping the module you just edited proves nothing
about what the run loads:

```
apps/worker/dist/jobs/agents/agent7-run.js:47    export const isAgent7SchedulerAuthoritative = () => ...   <- X9, a getter
apps/worker/dist/index.js:9                      config({ path: ... ".env.local", override: true })        <- X7
apps/worker/dist/jobs/agents/agent5-run.js:3136  if (redHerringFloor.enabled)                              <- X6
```

**This build goes stale the moment anything is committed.** It is a precondition, not a completed
item: rebuild again immediately before launching N6.

### 26.2 The two config lines, and why one of them is deliberately not set

`.env.local` is git-ignored, so this table is the only durable record that these exist.

| Key | State | Why |
|---|---|---|
| `AGENT9_FULLSTORY_DIAGNOSTIC` | **`shadow` — set** | M3's ride-along ([§11.3](#113-ride-alongs--things-that-need-runs-but-not-runs-of-their-own)). Read-only: one extra call per run, no prose change, so it does not spend N6's one-lever budget. Set now rather than at launch because *"the line nobody remembered to add"* is the X9 failure class one layer up |
| `AGENT7_SCHEDULER_AUTHORITATIVE` | **present, commented, unset** | N6's lever, and it **alternates by arm**. A fixed value here would run four treatment arms and no control — the mirror of the failure X9 prevented, reached from the opposite direction. The block records both arm values instead |

Verified the way [X9](#241-x9--the-lever-was-frozen-shut) says to verify — through a loader, after
dotenv, at the resolver rather than at `process.env`:

```
resolveFullStoryDiagnosticMode()   ->  shadow
AZURE_OPENAI_DEPLOYMENT_NAME       ->  gpt-4.1-mini      (X7's effect, still resolving correctly)
AGENT7_SCHEDULER_AUTHORITATIVE     ->  unset             (as intended)
```

`flags:check` moved from 32 configured keys to 33 and stayed clean, so the new key is registered
rather than invisible — which is the whole point of the register.

### 26.3 What is left, and what it costs

> ⚠️ **SUPERSEDED 2026-08-06 by [§27](#27-reviewing-this-documents-own-work--six-defects-all-fixed).**
> "Nothing free and unblocked remains" was true of the *board* and false of the *code*: reviewing this
> session's own commits found six defects, all free, and all six are now fixed. The two moves below
> are still the two moves — but M1b must not run before X11, which repaired what its verdict reads.

Nothing free and unblocked remains. The board is now exactly two moves wide:

- **M1b — ~£1, offline, no pipeline run.** Re-score the archived stories with the deterministic
  `noResolution` verdict wired ([facts.ts](../packages/rubric-score/src/facts.ts):
  `deterministic.noResolution ?? fromJudge.noResolution`, detector-wins as
  [§13.3](#133-the-fix-and-what-it-deliberately-does-not-do) specified) and re-run `eval:calibrate`.
  It tests [§13.1](#131-three-findings-that-killed-the-planned-fix)'s 43% → 60/86% hypothesis, and
  **R6 and M6 are both meaningless until it lands.** Cheapest information on the board by a wide
  margin.
- **N6 — ~£6, four runs.** Now fully instrumented: S7's counters emit at zero, M3 is set, R5 needs
  nothing enabled, X8 reads the model name off the prompt log, X4's injector telemetry writes even
  when every count is zero — and the lever can finally be moved at all. Its four ride-alongs cost
  nothing extra, and P4, M5, D2, X8 and S7 all unblock on its output.

Everything else on the tracker is downstream of one of those two.

---

## 27. Reviewing this document's own work — six defects, all fixed

**2026-08-06.** The sixteen code commits behind §13–§24 were read against the current source, with the
empirical claims re-run rather than taken on trust. Five defects, then a sixth found by making it.
**All six are fixed**, and all six were free.

Two of them (X11, X12) were done first because they sit directly under M1b, the next action on the
board. The rest followed, and two turned out to be larger than the findings that named them: X14 was
eleven call sites rather than three, and X16 was found only because the X11 fix tripped over it.

The shape is worth naming before the details: **four of the five are instruments, not the pipeline.**
§6 said *"a detector that has never been run against real prose is not a detector, it is a
hypothesis"*, and this session's own instruments were shipped without that check being applied to
them. §9's summary — "five real defects, none of them geometry's, all found by building a checker and
pointing it at real output" — now has a second half: point the checker at the checkers.

### 27.1 X11 — M1 was reading the wrong question

`runRubricScoring` derived its deterministic `noResolution` from `reveal_culprit_not_named`. That
check asks **whether the chapter the contract BOUND discloses** — the right question for a repair
pass, which must name the chapter it would regenerate. `noResolution` asks **whether the reader ever
gets an answer.** While the beat labels misbind the reveal those are different questions, and
[§15.1](#151-verified-against-all-three-archived-outlines) measures the misbinding on **2 of the 3**
archived outlines.

On the 08-04 run they gave opposite answers. The contract bound chapter 8; the disclosure landed in
chapter 10; the check returned `unmet` about a manuscript that names its murderer on the page.
[§14.3](#143-the-coupling-nobody-planned-for-n1s-reach-depends-on-n4) recorded that mechanism —
and [§14.4](#144-one-judge-decision-recorded) had, twelve lines later, decided that such a disclosure
**counts as a resolution**. The wiring inverted the decision it was written to implement, on a fact
that WINS over the judge by design, so nothing downstream could correct it: `ending` caps at 5 on a
story that resolves.

**The fix is a new story-level verdict, not a suppression.** `findManuscriptDisclosure` scans every
chapter for a sentence naming the culprit as guilty, and reports which chapter and — via N1's
registry — who wrote it. Both verdicts are now reported and neither is derived from the other, because
they answer different questions and a repair pass still needs the bound-chapter one.

**The obvious fix would have been wrong, and the corpus said so.** The first version withheld the
verdict (`null`) whenever N4 reported the binding uncertain. That is defensible in the abstract and
destroys M1: N4's note fires on run 1818 — **story 1936, the one story the entire §13 diagnosis was
built from.** Withholding there would have thrown away the single data point that motivated the work,
to fix a problem on the other two.

**And the corrected instrument immediately caught a defect in the fix.** The 80-scoring story's CML has
an **empty `culprits` array** — the `culprits_empty` class `probe:validators` measures on 3 of 13 runs
— so there is no name to search for, and the first implementation returned `unmet`: *"this story never
resolves"*, about the best story in the corpus, because the question could not be asked. It returns
`null` now. That is [§13.3](#133-the-fix-and-what-it-deliberately-does-not-do)'s rule in a third
direction — *not measured* must read as neither yes nor no — and it took under a minute to find once
the probe could see the field. Which is the argument for 27.2.

**Verified** on both archived runs: 1810 → `UNANSWERABLE` (no culprit named in the case) → the judge's
view stands; 1936 → `NOWHERE` → `noResolution` fires, M1's original catch intact. Five tests pin the
out-of-contract, injected, absent, authored-beats-injected and unanswerable cases.

### 27.2 X12 — the corpus probe was blind to the two fixes it was meant to check

`scripts/geometry-backtest.mjs` is the instrument [§10](#10-the-fix-implementation-plan)'s Rule 1
makes mandatory: *"No detector ships without a corpus run."* It had three defects, and together they
meant the rule was not being enforced on N1 or N2 at all.

| | What | Consequence |
|---|---|---|
| 1 | Never passed `lockedFacts` to `deriveStoryGeometry` | `accountedTimes` empty on every case — `unaccounted_time` was running the **old `third_time` rule** and reporting its verdicts under the new name |
| 2 | Never passed `injectionTemplates` to `checkManuscriptGeometry` | Per `types.ts`, no check can then return `met_by_injection` — the probe was **structurally incapable** of seeing N1's third verdict |
| 3 | Summary line counted `c.satisfied`, the field N1 **replaced** with `verdict` | Printed `0/11 checks satisfied` next to 6 violations, on every run since N1 landed |

Defect 3 is the sharpest, and it was on screen the whole time: a summary that says *zero of eleven*
beside a list of six failures is arithmetically impossible, and it was read past — by me, hours before
this review, when I reported the probe's PASS. **A number that cannot go above zero is the same defect
as a zero that is never written**, which is the shape [§16](#16-n5--done-and-the-two-runs-that-were-replaying-the-wrong-story),
[§22.3](#223-records-never-refuses--and-counts-what-it-does-not-object-to) and
[§24.4](#244-x10--npm-test-ran-8-of-17-workspaces) keep circling. This is its fourth appearance in one
document.

What the corrected probe reports, immediately:

- **1936 drops from 5 unaccounted times to 3.** Two of the three extras §10.2 named as proof — `ten
  minutes past eleven` and `a quarter past ten` — are locked facts of the device. §10.2's stated proof
  is now corrected in place; the §10 verdict still passes.
- **`unaccounted_time` becomes unique to the 68-scoring story.** It had been firing on both, which is
  precisely the noise §10's own acceptance note warns would ship the moment acceptance moves to
  `apply`.
- The accounted set and the manuscript-disclosure verdict are now **printed**. An empty accounted set
  is how this defect stayed invisible for two days, and it is one line to show.

### 27.3 X13, X14, X15 — found, and fixed

First recorded as "left open — each is a decision rather than a typo". All three are now closed, and
two of them were larger than the finding that named them.

**X13 — the injection registry now has its totality test.** `INJECTED_SENTENCE_PATTERNS` is a
hand-typed list, and nothing asserted that every `SCAFFOLD_EXHAUSTION_FLOORS` replacement appears in
it — although [§10.1](#101-n1--record-an-injected-disclosure-as-a-floored-failure-free) recorded the
test as shipped. Both current floors *were* covered, so nothing was broken; what was missing is the
thing that keeps them covered. A third floor would have laundered an injected sentence past the
detector in silence, and `met_by_injection_count` — the exit metric THINK_01 Move 5 and
[§12.4](#124-p4--m5--retiring-the-band-aids) both depend on — would have under-reported with nothing
saying so.

`SCAFFOLD_EXHAUSTION_FLOORS` is now exported *for the test and not for use*, and
[`injection-registry-totality.test.ts`](../packages/prompts-llm/src/__tests__/injection-registry-totality.test.ts)
asserts the correspondence in both directions: every floor's **output** is recognised as machine text,
and every injector's **own** sentence is too, since a floor only fires when its pattern matches and on
a run where none does the original phrasing is what ships. Two guards come with it — authored prose
about responsibility must NOT match (the constraint that keeps §3's widening safe), and no pattern may
contain a character name.

It asserts the **correspondence**, not the wording: floors may say what they like so long as what they
produce is recognisable. And it was checked against a hypothetical unregistered floor before being
believed — `false`, as required. A totality test that cannot go red is the defect it exists to prevent.

> §10.1 also promised the registry would be *"derived from the floor table rather than a hand-list"*.
> It is not, and should not be: a floor's `replacement` is a `String.replace` template carrying `$1`,
> so a regex cannot be generated from it without inventing the bounds on what may sit between the
> fixed words — which is where the false-positive risk lives. The test does the job the derivation was
> meant to do, and the hand-list stays legible.

**X14 — eleven silent model defaults, not three.**

> ⚠️ **The finding that named this item under-counted by eight.** It reported three
> `?? "gpt-4o-mini"` fallbacks; a full sweep found **eleven**, including
> [`apps/api/src/server.ts`](../apps/api/src/server.ts) and
> [`apps/worker/src/jobs/index.ts`](../apps/worker/src/jobs/index.ts) — **the production pipeline's own
> clients**, not just the probe harnesses. This is X3's shape precisely (*"§12.3 described one parser.
> There were four"*) and it is now the second time in this document that a defect was described from
> the call sites that happened to be in hand rather than from a sweep. Grep for the *class*, not for
> the *instance*.

[§20.4](#204-env--and-the-six-loaders-x7-did-not-reach) found the harnesses resolving `gpt-4o-mini`
while the pipeline resolved `gpt-4.1-mini` — *"a £6 four-run probe would have measured a model the
product does not use, and nothing in the report would have said so"* — fixed the loader precedence,
then deleted the key from `.env` so it lives only in a git-ignored file.
[§12.5](#125-the-smaller-carried-over-items) records that two sources for this one key is *"how the
`gpt-4o-mini` shadowing survived for months"*. Every silent default was one missing key away from
restoring that, undetectably, and two of them would have restored it **for the product**, not the
probe.

Eleven copies of a default is the two-bodies trap at scale, so the fix is one function rather than
eleven edits — the correspondence between them was never going to be maintained by hand.
`resolveAzureDeployment()` and `requireAzureDeployment()` live in
[`cli-runtime.ts`](../apps/worker/src/jobs/cli-runtime.ts) beside X3's logger, for the same reason.
Callers that must not start without it **throw with the reason stated**; callers that legitimately
degrade (the API's optional client, the worker's `null` path) treat an absent deployment exactly as
they already treat an absent key. The canary harnesses print `CANARY_SKIPPED_MISSING_AZURE_ENV` and
say which variable is missing, because a probe that skips loudly is cheaper than one that runs wrong.

`rubric-score-spike.mjs` is called out on its own: **M1b re-scores through it**, and a calibration run
on a different model than the runs it scores is the one thing a calibration must never do.

**X15 — the one call site that bypassed N3's folding boundary.** `accept.ts`'s `reveal_method_absent`
held a raw key term against the folded page where the three checks around it use `needle(term)`.
Unreachable today — method key terms are a hardcoded ASCII list — and fixed anyway, because it is the
single exception in the file whose header states that *every* value crossing from the case model to
the page goes through the boundary. Half-applied folding is
[§6](#6-issue-e--the-instruments-keep-being-wrong-in-one-specific-way)'s defect 5 exactly, and a
boundary with one exception is a boundary that grows more.

*Also noted, not tracked:* N5's title matcher strips a `Chapter N:` prefix from manuscript titles and
not from outline titles before comparing them with exact equality. Observed agreement is 8/10 and 7/9,
so it is not biting; it would degrade silently to the highest-sequence guess if outline titles ever
carried the prefix.

### 27.4 What was checked and found sound

Recorded because a review that lists only what it found reads as a survey of everything: X9's four
getters, with **no module-const env flag left anywhere** in `apps/worker/src` or `packages/*/src`;
X3's logger consolidation; X4's registry — no `g` flags, so no `lastIndex` state bug, and the
telemetry emitter is unconditional in the run path with `ctx.scoreAggregator` genuinely populated;
X1's partition test; N2's `lockedFactRegistry` wiring (Agent 3b, before Agent 7.5); CS2's clincher
slot, with no camelCase/snake_case trap; N1's third verdict raising no violation; X10's exit code.

One suspected defect was **chased and dropped**: hydrating agent code `3` from the store returns the
post-revision CML, but there is only one `cml` artifact write, after Agent 4 runs inside `runAgent3`
— so that is what the run committed, and `committed.mjs` honours its stated contract.

### 27.5 X16 — the suite that could not catch a type error

Found by making the mistake. The X11 fix changed `manuscriptDisclosure` to be nullable and one new
test still read `.verdict` off it directly. **`npm test` passed — 2,689 tests, exit 0 — while
`npm run build:all` failed on that exact line.** The first commit of §27 therefore shipped a state
whose `tsc` does not compile, and the suite said nothing.

The cause is the one already on record: **vitest transpiles from `src` and does not typecheck**, which
is `worker-consumes-cml-packages-via-dist` seen from the other end. Every type error in the tree is
invisible to the command whose name promises otherwise.

This is [X10](#244-x10--npm-test-ran-8-of-17-workspaces)'s neighbour and the same sentence applies:
*a green suite that cannot go red is the same defect as a zero that is never written.* X10 fixed the
suite's **breadth** — 8 workspaces to 17 — and left its **depth** untouched. The class it cannot fail
on is not a corner: it is every type error in a TypeScript monorepo.

**Fixed with one line: `pretest`.** npm runs it automatically before `test` and aborts the suite if
it fails, so `npm test` now compiles the tree first and vitest never starts on code that does not
build. It reuses `build:all` rather than adding a second `tsc --noEmit` invocation — a separate
typecheck command would be a second body of "does this compile", which is the trap this document
spends most of its length on.

The cost is real and worth stating rather than hiding: `npm test` goes from ~90 s to ~150 s. That is
the argument that had this recorded as a decision, and it loses to the alternative on the evidence of
this very session — the suite was green on a commit whose `tsc` failed, and the commit shipped.

**It emits `dist` as a side effect, and that is a second reason to prefer it.** The worker consumes
`@cml/*` through `dist` and Node caches modules at process start
([§16.3](#163-three-smaller-things-it-took-to-get-there)), so a stale `dist` is how a probe measures
code that is not in the tree. Running the suite now refreshes it. That does **not** retire
[§24.3](#243-two-conditions-on-n6-that-are-now-cheap-to-state)'s rebuild-before-N6 condition — a build
still has to happen after the last commit and before the run starts — but it removes one way of
forgetting.

**Verified against a planted error rather than assumed.** A file with `const x: number = "not a
number"` was added to `packages/story-geometry/src`, `npm test` exited **1** with `TS2322`, and vitest
did not run at all. The file was then removed. A gate that has never been seen to fail is
[§6](#6-issue-e--the-instruments-keep-being-wrong-in-one-specific-way)'s rule with the subject changed:
a guard that has never met a real failure is a hypothesis.

---

## 28. M1b — the answer is no, and the corpus is the bigger finding

**Run 2026-08-06, cost $0.0122.** [§13.4](#134-what-this-changes-upstream) set the test: *"re-score the
archived stories with the deterministic verdict wired in and re-run `eval:calibrate`. If agreement
moves toward 60/86%, the hypothesis holds. If it does not, the judge's problem is broader than one
blind spot."*

It does not. And getting to that answer turned up something that matters more.

### 28.1 M1b had no instrument, so one was built

Nothing on disk performed M1b. `rubric-score-spike.mjs` scores three **synthetic** mysteries to
demonstrate the cap engine; `eval-golden.mjs` **replays Agent 9** at £4–8 a pass. Neither re-scores an
archived manuscript and neither passes `noResolutionVerdict` — so running either would have produced a
number that does not contain the change M1b exists to measure. That is [X12](#272-x12--the-corpus-probe-was-blind-to-the-two-fixes-it-was-meant-to-check)'s
defect one directory over, and it is now the third time in this document that the instrument for a
measurement did not measure the thing.

[`eval-rescore.mjs`](../scripts/eval-rescore.mjs) does it, with `--dry` for the free wiring check that
should precede any paid re-score. Its four artifact readers come from the new
[`corpus-artifacts.mjs`](../scripts/corpus-artifacts.mjs), which `geometry-backtest.mjs` now imports
rather than defining — a second copy of `shippedOutline` would have been the defect that script exists
to report on.

**One judge call per story, scored twice.** The obvious shape — score once with the verdict, compare
against the ledger — is unattributable: the ledger's number came from a different call on a different
day, so the delta mixes the cap with the judge's own variance. Memoising the judge makes both scorings
read the SAME marks, so what separates them is the deterministic cap and nothing else. It is
[ADR-0004](decisions/0004-flag-gated-default-off.md)'s one-lever rule applied to a scoring run.

### 28.2 The verdict is correctly wired, fires as designed, and is worth nothing

| | ledger | judge unchallenged | + geometry verdict | external |
|---|---|---|---|---|
| 1810 `the_clockwork_deceit` | 68 | **67** | **67** | 80 |
| 1936 `the_clock_s_deception` | 73 | **64** | **64** | 68 |

On 1936 — the story the whole of §13 was built from — geometry reports the culprit named **nowhere**,
supplies `noResolution = true`, and the cap fires exactly as designed:

```
+ geometry verdict   caps: no confession / exposure / arrest / consequence → ending ≤ 5;
                           weak murder method (concealment explained, death not) → ending ≤ 6;
                           weak murder method → overall ≤ 75
```

**And the final does not move.** A pre-existing cap already held `ending ≤ 6`, and the total was bound
by `overall ≤ 75` regardless. The new cap is redundant with one already there.

[§13.3](#133-the-fix-and-what-it-deliberately-does-not-do) simulated this and got 73 → 72. The real
answer is **zero**, and the reason the simulation missed it is cap *interaction* — it modelled the new
cap alone rather than against the caps already firing. A simulation of one rule in a system of rules
is a hypothesis about the rule, not about the system.

On 1810 the verdict is `null` — the case names no culprit, so the question is unanswerable — and the
score is untouched. That is [X11](#271-x11--m1-was-reading-the-wrong-question)'s null path working on
real data, and it is the half of M1 that was worth building: without it this story would have been
capped for failing to disclose a culprit it never had.

### 28.3 The finding that outranks the answer: the ledger's internals are not reproducible

**1936 scores 64 today against a ledger value of 73.** 1810 scores 67 against 68. The 1936 gap to the
external reader inverts, +5 to −4: the story §13 diagnosed as **over**-scored is now **under**-scored.

Every number in [§13.1](#131-three-findings-that-killed-the-planned-fix) — the 42.9%, the ≥8-gap
misses, the 1936 outlier that the whole diagnosis rests on — comes from `internalFinal` values the
current scorer does not produce. Three candidate causes, none checked yet: the judge model has moved
(the ledger predates the `gpt-4.1-mini` pin), caps have been added since (A_68's structural family),
or the judge is simply this variable. **Any of the three makes the calibration corpus stale**, and the
third would be the most serious, because it would mean single-scoring anything is unsound.

*Illustration, not a result:* patching the two fresh scores into the manifest and leaving the other
five at ledger values gives **61.9%** against the standing 42.9%. That is a nineteen-point move, and
it would be very easy to report as M1b succeeding. It is not. **The verdict contributed zero to it** —
that is what the double-scoring proves — so the entire move comes from re-scoring 1936 at all. The
manifest was deliberately **not** written: five stale internals beside two fresh ones is a corpus that
can produce a number and cannot support a conclusion.

### 28.4 What M1b actually established, and what it costs to finish

- **The wiring is correct and end-to-end.** Verified on real manuscripts through the real path, twice,
  with the effect isolated. That part of M1 is done and needs nothing further.
- **The blind-spot hypothesis is not supported.** The deterministic verdict does not move the score on
  the one story it fires on. §13.4's own words apply: *"the judge's problem is broader than one blind
  spot"*, and [THINK_01 §8](THINK_01.md)'s harder question is now the live one.
- **The corpus is 2 of 7.** Five of the seven manifest entries name paths that do not exist
  (`corpus/mystery-…1161277` and four like it — transcribed from TARGET_80_LEDGER, never files). No
  re-scoring can include them, so no honest recalibration is available at any price until those
  manuscripts are found or the pairs are rebuilt.
- **And the manifest is git-ignored** (`.gitignore:65`, `results/`), which is almost certainly *why*.
  The definition of the calibration corpus — the ground truth every quality claim is checked against
  — lives outside version control, on one machine, with no history. The five dead paths are what that
  looks like after a few months. `runFolder` was added to the two live entries as part of this work
  and it, too, exists only here; this section is its record, exactly as
  [§26.2](#262-the-two-config-lines-and-why-one-of-them-is-deliberately-not-set) is `.env.local`'s.
  **Tracking `eval/results/external-read/manifest.json` is free and is the first half of M1d** — it
  holds seven scores and no secrets. **Done in this commit** (`git add -f`, since the `results/` rule
  is otherwise right: everything else under it is regenerated output). The corpus definition now has
  a history; recovering the five manuscripts is the half that needs a human.

**The next question is not M1b's, and it is nearly free:** score one story three times through the
same judge and see how far the total moves. If judge variance alone spans several marks, then every
single-scored number in this project — including the ledger, including the 42.9% — has an error bar
nobody has drawn, and R6's `--repeats` flag exists precisely because someone suspected this. That is
one story, three calls, about four pence. Tracked as **M1c**.

---

## 29. The judge was not the problem — the corpus was

**2026-08-06, $0.0458, seven judge calls.** [§28](#28-m1b--the-answer-is-no-and-the-corpus-is-the-bigger-finding)
ended with the corpus at 2 of 7 and called finding the other five a job for a human. It took a grep.
All five manuscripts were on disk the whole time; the manifest recorded them with their IDs elided
(`corpus/mystery-…1161277`), so nothing resolved and nobody had checked.

With the paths repaired and **all seven re-scored through today's judge on the same basis**:

```
                       BEFORE            AFTER
ranking agreement      42.9%             84.2%      (target 85%)
bias sd                7.11              4.08
```

**Forty-two to eighty-four, and the deterministic verdict contributed zero to every one of the seven.**
The double-scoring says so directly: each story was scored with the verdict and without it, off one
memoised judge call, and the two totals are identical in all seven cases.

### 29.1 What this means, and it is not a small correction

[§13.1](#131-three-findings-that-killed-the-planned-fix) diagnosed a judge with **one blind spot** — an
undisclosed reveal — and built M1 to close it. That diagnosis is now dead. The judge does not have a
blind spot worth 42 points; **it was being compared against internals it did not produce.** The ledger
numbers came from a mix of dates, models and cap generations, and re-scoring on one basis moved
agreement to within **0.8 points of the published 85% target** without changing a single line of
scoring logic.

The instrument was never as broken as the board believed. The *record* of what it had said was.

That is the same defect this entire document keeps finding, at one more level up: X6/X7 were a
repository asserting a fix it did not contain, X2 was a message nobody could read, X12 was a probe
that could not see the thing it checked — and this is a calibration computed against numbers that no
longer existed. **Four instances, one shape: the record and the reality drifting apart with nothing
that would notice.**

### 29.2 What it does not license

- **Five of the seven were scored prose-only.** Their CML is gone (no run artifacts before 2026-07-24,
  nothing in the store), so `cml: {}` — prose-derived facts still fire, CML-derived caps cannot. Their
  totals are therefore *not* produced exactly as a live run would produce them. Recorded per row in
  the manifest rather than averaged away.
- **84.2% is not 85%**, and the verdict line still reads NOT CALIBRATED. It is one pair from passing,
  which is a different situation from being at chance, but it is not passing.
- **sd 4.08 is still too wide for a constant offset**, so the harness cannot yet be corrected by
  subtracting a bias.
- **Every number here is single-scored.** [M1c](#284-what-m1b-actually-established-and-what-it-costs-to-finish)
  now matters MORE, not less: if one story scored three times spans several marks, an 84.2% built from
  one scoring each has an error bar wide enough to contain both the old answer and the new one. Four
  pence.

### 29.3 What changes on the board

- **R6 (`eval:baseline`, £4–8) is no longer held on the judge.** [§11.2](#112-the-two-assessments-that-changed-my-mind-while-writing-this)
  held it because *"a baseline is only as good as the instrument that measures it, and this one ranks
  at chance"*. It does not rank at chance. It is held on M1c instead — establish the error bar first,
  then baseline.
- **M6 (rubric-in-prompt) becomes readable.** Its effect was only ever visible through the judge.
- **M1's own row is unchanged in substance**: the wiring is correct and its effect is zero. What has
  changed is that the *problem it was built for* turns out not to have been there.

The honest summary of the whole M1 line: **a real defect was found, a correct fix was built for it,
and the defect was not what was causing the symptom.** The fix stays — a reveal that discloses nowhere
should cap the ending, and X11's null path is load-bearing — but it earned none of the 42 points.

---

## 30. M1c — one score is worth ±3 marks, and that invalidates a deletion

**2026-08-06, $0.0504, eight scorings of one story.** `2026-08-02-1810`, chosen because its caps do
not fire — a cap clamps the total and would suppress the very variance being measured.

```
5×  70, 66, 69, 69, 72      mean 69.20  sd 1.94  spread 6
3×  72, 66, 66              mean 68.00  sd 2.83  spread 6
                            ── all eight: 66–72, spread 6 marks ──
```

Identical prose, identical CML, identical judge, `caps: none` every time. **A single rubric score
carries roughly ±3 marks.** Six categories each wobble by ±1 — `plot_structure`, `dialogue`,
`atmosphere`, `clues`, `pacing`, `ending` — and they compound.

### 30.1 What this retrospectively breaks

**[ADR-0007](decisions/0007-repair-ladder-ordering.md)'s deletion precedent is inside the noise.**
`AGENT9_CRITIQUE_REWRITE` was probed, recorded as *"prose −1.00, rubric −2.0"*, and its **247 lines
were deleted on that evidence** — cited in [§11.1](#111-the-assessment) and again in ADR-0007's own
*What would change our mind* as the model of a well-evidenced removal. A −2.0 rubric delta is a third
of the spread a single scoring produces on unchanged input. **That verdict was not distinguishable
from noise**, and neither is any other delta this project has drawn from single scorings.

This does not mean the deletion was wrong — it means it was never measured. The distinction matters
because ADR-0011 says a deletion needs the same evidence as an activation, and this one had less than
it appeared to.

**And it puts an error bar on [§29](#29-the-judge-was-not-the-problem--the-corpus-was)'s own result.**
The 84.2% is built from one scoring per story. Each internal could move ±3, which is enough to reorder
adjacent pairs. 84.2% is the best estimate available, not a measurement — and saying so is the whole
point of having run this.

### 30.2 The rule this forces

**No rubric comparison from a single scoring, ever again.** Any delta smaller than ~6 marks needs
repeats and a mean, and `eval-golden.mjs` already carries the `--repeats` flag for exactly this — it
was built by someone who suspected this and never confirmed it.

Concretely, for the board:

- **N6's two runs cannot be read on rubric total.** Their honest output was always a mechanism verdict
  ([REVIEW_06 §2](REVIEW_06.md)); this closes the door on reading anything else into them.
- **R6 (`eval:baseline`) must run `--repeats 3` minimum**, which triples its cost. That is the real
  price of a trustworthy baseline and it should be decided with the number in hand.
- **P4 and M5's retirement evidence is unaffected** — they are gated on *firing counts*, which are
  integers a run either produces or does not. Counts do not wobble.

### 30.3 The defect found in the measuring, again

The first run of this printed **`categories that moved: none`** beside totals that had moved by six.
`categories` is a `CategoryMark[]`, not a map; treating it as one made every spread `NaN`, and the
`> 0` filter silently dropped them all.

A vacuous zero, printed reassuringly, in the reporting of the run whose entire purpose was to find out
whether numbers can be trusted. It is [§16](#16-n5--done-and-the-two-runs-that-were-replaying-the-wrong-story),
[§22.3](#223-records-never-refuses--and-counts-what-it-does-not-object-to),
[§24.4](#244-x10--npm-test-ran-8-of-17-workspaces) and [§27.2](#272-x12--the-corpus-probe-was-blind-to-the-two-fixes-it-was-meant-to-check)
for the fifth time in one document. Fixed, and the re-run produced the per-category breakdown above.

---

## 31. N6 — the pair ran, and the scheduler does not fix what it was promoted to fix

**2026-08-06/07, two runs, same premise, ~£3.** `mystery-1786050720246` (control) and
`mystery-1786052056540` (treatment, `AGENT7_SCHEDULER_AUTHORITATIVE=true`).

### 31.1 The lever fired — verified in the artifact, not the terminal

`distributeChapterWordBudget` stamps a pacing-shaped budget on every scene when the scheduler is
authoritative. The two committed outlines:

```
control     estimatedWordCount  [1800, 1500, 2000, 1800, 2000, 1700, 1900, 2200, 1800, 2100]
treatment                       [ 900,  900,  900, 1000, 1000, 1000, 1000, 1200, 1200, 1000]
```

Irregular LLM guesses against a smooth curve — leaner setup, fuller climax. **This is the first time
in this project's history that `AGENT7_SCHEDULER_AUTHORITATIVE` has demonstrably taken effect**, and
X9 is why: before 2026-08-05 the flag was a module const and could not be set at all.

**I briefly concluded the opposite, and the mistake is worth recording.** The lever's own confirmation
(`[Agent 7 scheduler authority] stamped pacing-shaped budgets…`) goes to `console.info`, and I had
captured both runs through `| tail -N`. Agent 7 finishes long before the end of a run, so the line was
truncated away, and its absence read as "the lever did not fire". The durable artifact settled it in
one query. That is [ADR-0010](decisions/0010-report-is-the-durable-record.md) demonstrated by
violating it — *the terminal is a convenience, never the record* — and it is also the second time in
two days that a `| tail` of my own has produced a false reading (the other cost §27.2's `npm test`).

**Worth fixing:** the lever's confirmation should reach `ctx.warnings`, not just the terminal. A probe
whose treatment arm cannot be identified from the report is unattributable by construction. Tracked as
**X17**.

### 31.2 What the pair settles

**1. The scheduler's budgets are honoured; the LLM's own estimates are not.**

| | planned | shipped | error |
|---|---|---|---|
| control | 18,900 | 12,584 | **−33%** |
| treatment | 10,000 | 10,763 | **+8%** |

This is a *plan-versus-actual* claim inside each run, not a quality delta between them, so one pair
carries it honestly. The outline's own word estimates are decorative — Agent 9 misses them by a third.
The scheduler's are followed. If predictable pacing is the goal, that is the lever working.

It also means **promoting the scheduler nearly halves the book** at `targetLength: short`. Whether
10,763 or 12,584 words is the right answer for "short" is a product decision nobody has recorded, and
it should be made deliberately rather than inherited from whichever component happens to be
authoritative.

**2. The scheduler does NOT fix the reveal misbinding — and that was the argument for promoting it.**

[§5](#5-issue-d--the-contract-bound-the-wrong-chapter-for-the-third-run-running) proposed D3 —
*"promote `beat-scheduler` so the beats are authoritative by construction… if the grid assigns beats,
the label and the content agree by construction"* — and [§11.1](#111-the-assessment) called N6 "the
§8bis discriminating test" partly on that basis.

```
control     reveal bound to ch8   revealBindingUncertain: TRUE
treatment   reveal bound to ch9   revealBindingUncertain: TRUE
```

Both arms misbind. These are the **third and fourth consecutive runs** where the beat label points the
reveal contract at a chapter that does not disclose, and the scheduler being authoritative changed
nothing about it — because the scheduler assigns *word budgets and clue jobs*, not the semantic
question of which chapter actually discloses. The construction argument does not hold.

**3. Every instrument built in this document executed live, first time.**

| | control | treatment |
|---|---|---|
| **X8** model per call | 21 `gpt-4.1-mini` · 25 `gpt-4.1` · 5 `claude-sonnet-5` · **0 `gpt-4o-mini`** | same shape |
| **X4** injector-vs-lint | `injections=1 violations=2` — caught `enforceCulpritEvidencePresence` breaking two model-bound rules in ch10 | emitted |
| **X11** story-level disclosure | culprit found in ch10 → `noResolution=false`, judge agreed | **no disclosure anywhere → cap fired, `ending ≤ 5`** |
| **N4** binding note | fired | fired |
| **N2** unaccounted_time | 4 times, against a 3-fact locked registry | fired |
| **S7** `[R4] firings=` | **0** | 0 — two of the four zeros S7 needs |
| **M3** full-story diagnostic | 5 findings, 4 anchored | emitted |
| **X6** red-herring floor | 2 overlapping herrings sanitised | fired |

**X11 earned its place on the control arm.** The bound chapter (8) reported `reveal_culprit_not_named`
while the manuscript disclosed in chapter 10. Under the pre-X11 wiring that would have supplied
`noResolution = true` and capped the ending on a story that resolves — the exact inversion
[§27.1](#271-x11--m1-was-reading-the-wrong-question) was written to prevent, reproduced live within a
day of the fix. On the treatment arm the same code correctly supplied `true`, because that manuscript
names its culprit nowhere at all.

### 31.3 What the pair does NOT settle

**The rubric totals.** 74 (control) against 70 (treatment) is inside
[M1c](#30-m1c--one-score-is-worth-3-marks-and-that-invalidates-a-deletion)'s ±3 band before you even
account for the two runs being *different stories from the same premise*. Nothing about story quality
is readable here, exactly as [REVIEW_06 §2](REVIEW_06.md) said in advance.

The same applies to every count that depends on the prose rather than the machinery — pronoun drift
(23 vs 15), warning totals (105 vs 95), clue counts (21 vs 17). Those are single samples of a
stochastic generator, not lever effects.

### 31.4 D1 — what this gives the decision

REVIEW_04 §11.4 D2 / [REVIEW_06](REVIEW_06.md) D1 asks whether geometry phases 2–4 are still worth
their cost. The pair's honest input:

- **The scheduler works mechanically and is safe to run.** Budgets land, no aborts, gate at warning on
  both arms, integrity assertions pass.
- **It does not deliver the structural argument it was promoted on.** The reveal misbinding survives
  it, so N8's phase-2 contract — *tell the chapter what it owes* — is now the only untried mechanism
  aimed at that defect. §5's D1-vs-D3 framing resolves toward D3 having been the weaker bet.
- **Promotion is therefore a pacing decision, not a structural one**, and should be argued on whether
  10,763 words is the right length for "short" — a question this pair can answer and the board has
  never asked.

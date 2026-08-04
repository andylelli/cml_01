# Architecture Review 05 — the probe passed, and the run underneath it did not

**Written:** 2026-08-04 · **Type:** an assessment with proposed fixes, following [REVIEW_04](REVIEW_04.md). It exists because the `AGENT3_DEVICE_TIME_BINDING` probe returned a clean PASS on a run whose finished manuscript never names its murderer in a sentence a human wrote.

**Companion documents:** [REVIEW_04](REVIEW_04.md) is the state of the geometry work · [THINK_01](THINK_01.md) is the diagnosis this all descends from · [GEOMETRY-AGENT-DESIGN](GEOMETRY-AGENT-DESIGN.md) §10 is the build record.

**§10 is the geometry fix plan. §11 assesses the whole outstanding backlog from REVIEW_01/03 and THINK_01 against it and merges both into one order — including three items recommended AGAINST.**

**Method marking:** **MEASURED** · **INFERRED** · **UNVERIFIABLE**.

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
| M1 | ~~Rewrite the judge as the external rubric~~ → **diagnosed:** rubric already matches the external ten; caps are not the distortion; one blind spot (an undisclosed reveal) drags 86% → 50%. Deterministic `noResolution` now wired from geometry | ~1 day | ◑ | [§13](#13-m1--what-the-judge-diagnosis-actually-found) |
| M1b | Re-score the archived stories with the verdict wired in; re-run `eval:calibrate` | ~£1 | ☐ | [§13.4](#134-what-this-changes-upstream) |
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
| X3 | `parseEnvBool` silently disables logging when a flag is set to `1` instead of `true` | free | ☐ | [§12.3](#123-x3--a-flag-parser-that-reads-1-as-false) |
| X4 | Injector output is not subject to the linters that bind the model | free to record | 👤 | [§10.6](#106-the-injector-vs-linter-class-free-to-detect-a-decision-to-fix) |
| X5 | `Agent4-Revision` is a required upstream that has never run in 13 archived runs — every replay reports it missing | free | ☐ | [§16.5](#165-x5--a-required-upstream-that-has-never-run) |
| **D. Paid probes, in dependency order** ||||
| N6 | Promote `beat-scheduler`, ≥4 runs — the §8bis discriminating test | ~£6 | ☐ | [§11.4](#114-the-merged-order) |
| D2 | **DECISION:** after N6, are geometry phases 2–4 still worth their cost? | free | 👤 | [§11.4](#114-the-merged-order) |
| N7 | Culprit-evidence regen on the edit-list channel | ~£3 | ☐ | [§10.7](#107-the-paid-items--what-ready-means) |
| N8 | Phase-2 geometry contract probe (`AGENT9_GEOMETRY_CONTRACT`) | ~£3 | ☐ | [§10.7](#107-the-paid-items--what-ready-means) |
| R6 | `eval:baseline` — **after M1, not before** | £4–8 | ☐ | [§11.2](#112-the-two-assessments-that-changed-my-mind-while-writing-this) |
| M6 | Give Agent 9 the real rubric — only readable after M1 | ~£3 | ☐ | [§11.1](#111-the-assessment) |
| **E. Ride-alongs — need runs, not runs of their own. Attach to N6.** ||||
| S7 | Retire dead coercion sites — 4 runs at `firings=0` | free | ◑ 1 of 4 | [§11.3](#113-ride-alongs--things-that-need-runs-but-not-runs-of-their-own) |
| M3 | Whole-manuscript revision: `AGENT9_FULLSTORY_DIAGNOSTIC=shadow` | free | ☐ | [§11.3](#113-ride-alongs--things-that-need-runs-but-not-runs-of-their-own) |
| R5 | Live kill-and-resume drill | free | ☐ | [§11.3](#113-ride-alongs--things-that-need-runs-but-not-runs-of-their-own) |
| **F. Deferred — real value, wrong time** ||||
| P4 | Geometry phase 4: retire `applyPlantBeforeReveal`, the aftermath classifier, `enforceSuspectEliminationPresence` | free | ☐ | [§12.4](#124-p4--m5--retiring-the-band-aids) |
| M5 | Delete the deterministic injectors | free | ☐ | [§12.4](#124-p4--m5--retiring-the-band-aids) |
| CS1 | Promote `@cml/clue-spec` out of shadow | ~£3 | ☐ | [§12.5](#125-the-smaller-carried-over-items) |
| CS2 | Add a clincher slot type to `clue-spec` | free | ☐ | [§12.5](#125-the-smaller-carried-over-items) |
| ENV | Delete the duplicated `.env` keys `flags:check` has reported for three sessions | 2 min | ☐ | [§12.5](#125-the-smaller-carried-over-items) |
| R10 | Ratify the 12 ADRs | ~1 h | 👤 | [§11.1](#111-the-assessment) |
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
- **The five files modified before this session** (`llm-connectivity-harness.ts`, `index.ts`,
  `agent5-run.ts`, `flag-register-check.mjs`, a prompt-records README). Not mine, uncommitted,
  untouched.

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

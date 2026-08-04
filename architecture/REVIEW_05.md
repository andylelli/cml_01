# Architecture Review 05 — the probe passed, and the run underneath it did not

**Written:** 2026-08-04 · **Type:** an assessment with proposed fixes, following [REVIEW_04](REVIEW_04.md). It exists because the `AGENT3_DEVICE_TIME_BINDING` probe returned a clean PASS on a run whose finished manuscript never names its murderer in a sentence a human wrote.

**Companion documents:** [REVIEW_04](REVIEW_04.md) is the state of the geometry work · [THINK_01](THINK_01.md) is the diagnosis this all descends from · [GEOMETRY-AGENT-DESIGN](GEOMETRY-AGENT-DESIGN.md) §10 is the build record.

**Method marking:** **MEASURED** · **INFERRED** · **UNVERIFIABLE**.

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

That second sentence is not prose. It is `regen-integration.ts:511`:

```ts
replacement: "was responsible; the evidence allowed no other reading",
```

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

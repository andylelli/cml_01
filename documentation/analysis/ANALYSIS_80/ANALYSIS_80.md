# ANALYSIS_80 — a three-word regex broke the mystery

**Deep dive on run `mystery-1788202899854` (2026-08-31) and the external read that scored it 74/100.**

Companion to A_79 (the corpus integration). This document is about a different thing: **the run
diagnosed almost every one of its own defects, in its own log, and shipped anyway.**

---

## §0 The one-paragraph version

The case was built correctly. Agent 3 produced two timepieces five minutes apart, the locked-fact
registry recorded them correctly, and Agent 9's prose prompt stated both correctly. Chapter 8's first
draft then said the arithmetic out loud, correctly. A control-plane-leakage rule matched the ordinary
English phrase **"required to"**, flagged the chapter `major`, and forced a regeneration. The
regenerated chapter says the murderer set the clock **"from twenty-five minutes past ten to twenty-five
minutes past ten"**, and the external reviewer marked clue logic 4/10 and ending 5/10 for exactly that.

Nothing downstream could catch it, because the guard that protects locked facts checks that a value is
*present*, not that it is *used where it matters*.

---

## §1 What the external read actually says

| Area | Mark | | Area | Mark |
| --- | --- | --- | --- | --- |
| Premise / concept | 7 | | Mystery clues / evidence logic | **4** |
| Opening hook | 7 | | Pacing | 7 |
| Plot structure | 7 | | Ending / reveal | **5** |
| Character clarity | 7 | | Prose / polish | 6 |
| Dialogue | 7 | | Character life / richness | 7 |
| Atmosphere / setting | 8 | | **Overall** | **74** |

**Read the shape, not the total.** Eight of eleven categories sit at 7–8. Two are outliers, and both
are the *same defect*: clue logic 4 and ending 5 are both "the clock contradiction contradicts itself".
Prose 6 is the third, and it matches the internal rubric's own caps exactly (`prose ≤ 6`,
`ending ≤ 7`, both for report-style clearance).

So this is not ten quality problems. It is **one arithmetic failure costing about six marks**, plus a
known prose-register cap. That matters for what to fix: A_76's arithmetic says 90 needs marks nobody
has yet given, and a category sitting at 4 that should sit at 7–8 is the cheapest six marks on the board.

The reviewer also confirms a real gain — Chapter 10 aftermath is "much more human-focused", the fix
A_68/A_75 were aiming at. That is not in dispute here and is not re-litigated.

---

## §2 THE HEADLINE — a lint rule fired on English and the retry destroyed the answer

### 2.1 The before and after, verbatim

Chapter 8, **first attempt** (recovered from the run's own warning payload):

> "I invite each of you to attempt to wind the clock backward by five minutes, as was **required to**
> set the hands **from half past ten to twenty-five minutes past ten**."

That is arithmetically correct and is precisely the sentence the external reviewer says the chapter
*should* contain. The run rejected it with:

> `Chapter 8 contains control-plane leakage (instruction_shape): "I invite each of you to attempt to
> wind the clock backward by five minutes…" (Remove prompt, validation, retry, or scaffold terminology
> from reader-facing prose)`

Chapter 8, **shipped**:

> "…to wind the clock backward by exactly five minutes and set the hands **from twenty-five minutes
> past ten to twenty-five minutes past ten**…"

The regeneration kept the sentence's shape and lost its arithmetic. **MEASURED.**

### 2.2 The rule

`packages/story-validation/src/control-plane-leakage.ts:39`

```js
{ code: 'instruction_shape', pattern: /\b(?:must include|required to|ensure that)\b/i,
  confidence: 'contextual', severity: 'major' }
```

`required to` is not prompt terminology. It is English.

### 2.3 The false-positive measurement

All 19 rules run over two populations that are clean by construction — our 204 archived manuscripts,
and the 12 real Golden Age novels in `library/texts/` (Doyle, Collins, Zangwill, Leroux, Freeman,
Orczy, Chesterton, Glaspell, Wallace, Green). A rule that fires on Wilkie Collins cannot distinguish
prompt leakage from prose. **MEASURED, `scripts/leakage-falsepositive.mjs`:**

| rule | severity | fires on canon | fires on our manuscripts | example match |
| --- | --- | --- | --- | --- |
| **`instruction_shape`** | major | **2 / 12 (16.7%)** | 9 / 205 (4.4%) | `required to` |
| `obligation_term` | major | 1 / 12 (8.3%) | 9 / 205 (4.4%) | `obligation` |
| `retry_term` | **critical** | 0 / 12 | **41 / 205 (20.0%)** | `Retry` |
| `dt_validation_proved_theory` | major | 0 / 12 | 30 / 205 (14.6%) | `proved one theory and ruled out…` |
| `dt_validation_behaved_tested` | major | 0 / 12 | 30 / 205 (14.6%) | `the evidence failed it under direct…` |
| the other 14 rules | — | 0 / 12 | ≤ 4.9% | — |

Two findings, and the second is the more useful one:

1. **`instruction_shape` is the single worst rule in the set against real prose.** It is also the one
   that broke this book. `obligation_term` matching the plain noun "obligation" is the same class.
2. **Seventeen of nineteen rules are clean against canon.** This is not a broken detector family — it
   is a mostly well-built one with two rules that reach for ordinary words. The fix is narrow, not a
   rewrite. That distinction is worth stating because the temptation after a failure like this is to
   distrust the whole component.

`retry_term` firing at **critical** on 20% of our own manuscripts is a separate, unexamined problem:
by CLAUDE.md's B1 rule ("a check that fires on most runs is an off switch with extra steps"), a
critical rule with a 1-in-5 hit rate on shipped work is either mis-specified or being routinely
waived. It did not fire on this run, so it is logged here as a lead, not a finding.

### 2.4 Why nothing noticed the regression

The retry path has no **before/after correctness comparison**. A regeneration is accepted if it clears
the property that triggered it; nothing asks whether it dropped a locked-fact value, a clue, or an
arithmetic relation that the original had. The A_73 paragraph-preservation guard exists for exactly
this shape of risk and *did* fire twice elsewhere in this run —

> `regen REJECTED by paragraph-preservation guard: 1 original paragraph(s) modified or dropped`

— but it protects *paragraph identity*, not *fact content*, and it does not cover the batch-retry path
that regenerated chapter 8.

### 2.5 Fixes

**F1 — narrow the two ordinary-English patterns.** `instruction_shape` should require prompt-shaped
context, not a bare phrase: match `must include` / `ensure that` only in imperative or list position,
and drop `required to` outright. `obligation_term` should require the pipeline's own compound forms
(`obligation ref`, `obligation block`), not the English noun. *Cheap, deterministic, and the false-
positive population above becomes the regression test.* Risk: narrowing loses true positives — mitigate
by keeping the broad pattern at `confidence: 'contextual'` and **advisory only**, which is what F2 does.

**F2 — a `contextual` confidence must not drive a `major` retry.** The rule already declares itself
`contextual`. Let contextual rules annotate and let only `explicit` rules gate. This is the general
form of the lesson and it costs nothing.

**F3 — a retry must not lose what the original had.** Before accepting a regenerated chapter, diff it
against the original for: locked-fact values present, clue IDs referenced, and stated clock times. If
the retry drops any, reject the retry and keep the original *with* its lint hit — a chapter with an
awkward phrase beats a chapter with broken arithmetic. This is the single highest-value fix in this
document because it is failure-class-general: it would have caught this defect without anyone
knowing `instruction_shape` existed.

**F4 — prefer a post-pass to a regeneration.** CLAUDE.md already measured that a gate driving retries
costs +2.43 register points on the retried chapter. This run shows the cost is not only register: a
targeted sentence-level edit that removes the offending phrase cannot lose the arithmetic, because it
never rewrites the clause.

---

## §3 The locked-fact guard checks presence, not correctness

### 3.1 The measurement

The manuscript says **`twenty-five minutes past ten` 40 times** and **`half past ten` twice**. The
whole mystery rests on those two values differing. **MEASURED.**

`enforceLockedFactValuePresence` (`apps/worker/src/jobs/agents/agent9-run.ts:2009`) injects a canonical
value only when it is **absent**. `half past ten` appears in one paragraph, so the guard is satisfied
and does nothing. A 40:2 collapse passes a presence check by definition.

The prose prompt was correct — Chapter 1's prompt carries:

```
LOCKED FACTS — use verbatim whenever this evidence is described:
  • clock time seen: "twenty-five minutes past ten"
  • reception watch time: "half past ten"
  • clock shift interval: "five minutes"
```

and mentions `half past ten` 11 times against `twenty-five minutes past ten` 12 times. **So this is
not a prompt-content bug.** The model was told correctly and wrote it wrong, and the guard was not
built to notice.

### 3.2 Fix — F5, atomic-fact distinctness

For locked facts that share a type (two `time` values) and declare an interval between them:

1. both values must appear in the manuscript;
2. neither may dominate the other beyond a ratio (40:2 is 20:1; a threshold near 4:1 is defensible and
   should be **baselined over the 204 manuscripts before shipping**, exactly as A_79 §12 baselined the
   anti-copy gate — the mistake to avoid is picking the number first);
3. where the case declares an interval (`clock_shift_interval = five minutes`), at least one passage
   must state both values close enough together to make the subtraction available to the reader.

**Where it fires matters more than that it fires.** This must be a *preflight/contract* obligation
that reaches the prose prompt as an operation — "state both times in the same passage, related to each
other" — not a post-hoc injector. An injector that rewrites prose to fix this is the §4 defect class.
And per CLAUDE.md, this model complies with countable operations: "state both clock readings in one
sentence" is countable; "keep the times distinct" is not.

Risk: on cases with only one time this must be inert, and it must not fire when a *deliberate*
misdirection wants one value suppressed — hence gate on the declared interval, which only exists when
the case intends a contradiction.

---

## §4 The injector duplicated sentences it had already been given

The manuscript contains two exact adjacent duplicate sentences (**MEASURED**, and the external
reviewer flagged both):

> "By then it was twenty-five minutes past ten. By then it was twenty-five minutes past ten."
> "The clocks put it at twenty-five minutes past ten. The clocks put it at twenty-five minutes past ten."

The run logged `enforceLockedFactValuePresence: injected canonical locked-fact value mention(s): 2` —
the count matches exactly.

The mechanism: the function seeds its idempotency counter by counting occurrences of its **own
template variants** in the existing text, then permits up to `MAX_INJECTIONS_PER_FACT = 2` *including*
what it found. When the model has already written a sentence that renders identically to a template
variant, the seed counts 1 and the cap still allows a second — which is appended next to the identical
sentence already there.

**Fix F6:** the cap is the wrong instrument. Before appending, check whether the *canonical value* is
already present in the target paragraph; if it is, do not inject regardless of the counter. A value
already stated does not need stating again in the same breath. **MEASURE first** how many of the 204
archived manuscripts contain adjacent duplicates — this run has 2, and the prior run
(`story_20260830-1850`) has **0**, so the reach is currently unknown and the fix should not ship on a
sample of one.

---

## §5 The reveal was bound to the wrong chapter

The run logged, and then confirmed, its own defect:

> `[Agent 7.5] reveal bound to chapter 8 by its beat "final_trap" but that chapter reads as the
> discriminating test … so every reveal check … is reading a chapter that does not disclose.`
> `[Agent 7.5] reveal-binding worry CONFIRMED: the contract bound chapter 8 but the manuscript
> discloses in chapter 6. Every reveal check read the wrong chapter.`

**The two messages disagree with each other** — the first says the disclosure is in chapter 10, the
second says chapter 6. At least one of them is wrong, which means the detector that found the problem
cannot locate it. That is worth more attention than the binding bug itself: a locator that reports two
different answers in one run will mislocate a future repair.

Consequences: every reveal-time check, and the injected-disclosure count, read chapter 8. The external
reviewer independently reports chapter 8 as overstuffed with a "bolted on" late clearance of Hugo —
consistent with the reveal machinery piling obligations into a chapter that was not the reveal.
*Consistent with*, not proven by: **INFERRED**, and the falsification is in §10.

**Fix F7:** bind the reveal contract by disclosure *content* (the chapter that first names the culprit
as the culprit) rather than by beat label, and make the two log messages share one locator so they
cannot disagree.

---

## §6 The case disagrees with itself about what time it is

Two CML integrity warnings, both comparing a locked fact against the **same** anchor:

> Locked fact "…grandfather clock…" (canonical `twenty-five minutes past ten`) differs from Agent3-CML
> time anchor **`fifty-five to ten`** [mismatch] at `CASE.constraint_space.time.windows[1]`
> Locked fact "…receptionist's pocket watch…" (canonical `half past ten`) differs from the same anchor.

So the device layer (Agent 3b) holds two times five minutes apart, the CML layer (Agent 3) holds a
third unrelated time, and the check only **warns**. This is the X38/X51 family — the locked-fact
registry is device-scoped while the CML carries its own anchors, and the two are never reconciled.

**Reach, MEASURED** across six recent run reports: CML-integrity warning counts of **4, 0, 10, 4, 0, 0**.
Intermittent and pre-existing; one earlier run carried more than this one. This is *not* a regression.

Related, and logged by the run itself:

> `geometry unaccounted_time: The manuscript states 3 time(s) that nothing in the case accounts for —
> neither anchor, nor any locked fact: "five to ten" (ch1), "ten o'clock" (ch5), "ten to ten" (ch6). …
> NO REPAIR PATH`

A mystery whose entire mechanism is clock readings shipped with three unaccounted clock readings, and
the check that found them declared itself unable to act.

**Fix F8, at the cheap end** (X60's lesson — "degrade waives what preflight aborts"): derive the CML
time anchors *from* the device locked facts rather than letting two layers invent times independently,
and make an unreconciled time mismatch a **preflight failure before Agent 9 spends money**. Agent 9 was
the most expensive stage in this run; discovering the case disagrees with itself after it has run is
the worst possible time to find out.

---

### 6.1 The only hard abort cannot read the times this pipeline writes

The CML-integrity block in `agent9-run.ts` has exactly **one** hard abort — everything else pushes a
warning. That abort is driven by `detectLockedFactClueTimeMismatch`, and it parses times with two
patterns and no others (`agent9-run.ts:564,572`):

```js
/\b(\d{1,2}):(\d{2})\s*(am|pm)\b/     // "10:30 pm"
/\b(\d{1,2})\s*(am|pm)\b/            // "10 pm"
```

Both require **digits and a meridiem**. This case's times are `twenty-five minutes past ten` and
`half past ten`. They cannot be parsed, so they cannot be compared, so the abort cannot fire.

It is worse than an accident of formatting. `repairWordFormLockedFacts` (`agent9-run.ts:892`)
deliberately converts digit-form times **into** word-form, and warns when the model resists —
*"LLM may be persistently ignoring the locked-fact format constraint"*. It ran three times in this
run. **The pipeline mandates the one time format its only hard abort is blind to.** MEASURED.

This is the exact shape recorded on 2026-08-19: *a silent time gate may mean unparseable, not clean*.
The gate's silence across archived runs is not evidence of clean output; it is evidence the gate has
never been given input it can read.

### 6.2 The alignment check runs before the data it checks exists

`checkLockedFactTimeAlignment` (`agent3-run.ts:109`) reads

```js
const mechanism = ((ctx.cml as any)?.CASE ?? ctx.cml as any)?.hidden_model?.mechanism ?? {};
const apparent = String(mechanism.apparent_time_of_death ?? "").trim();
const actual   = String(mechanism.actual_time_of_death ?? "").trim();
```

It is **called at line 247**. `ctx.cml` is **first assigned at line 318**. MEASURED: there is no
assignment to `ctx.cml` anywhere before the call site.

So `apparent` and `actual` are always `""`, and the function returns without findings — and its own
comment rationalises the silence:

> *"An absent one means the case does not model a false-time trick, and reporting a split there would
> manufacture a finding from missing input."*

That reasoning is sound and is being applied to data that is missing for the wrong reason. The CML is
not absent because the case has no false-time trick; it is absent because it has not been built yet.
**A correct guard against manufacturing findings is silently converting a dead check into a clean bill
of health.**

### 6.3 What §6.1 and §6.2 mean together

This run's central defect — two locked times collapsing into one — had **two** guards positioned to
catch it. One could not parse the times. The other ran before the times existed. Neither reported
anything, and both silences are indistinguishable from success in the run log.

That is the strongest argument in this document for a rule the project already half-holds: **a check
that has never fired must prove it can fire.** A known-positive fixture for every temporal gate costs
nothing per run and would have surfaced both of these before a paid run did.

**Fix F12:** route every temporal comparison through one parser that accepts the word-form times this
pipeline actually produces (`parseClockTime` already does — the abort simply does not use it), and add
a known-positive fixture asserting the abort fires on a word-form mismatch.

**Fix F13:** move the `checkLockedFactTimeAlignment` call after `ctx.cml` is assigned, and give it a
fixture proving it returns a finding on a mismatched case. Then measure its reach across archived runs
before deciding whether it should warn or block — it has never run, so its firing rate is unknown.

*(§6.1–§6.3 were surfaced by a multi-agent investigation that was stopped early on cost grounds; these
two findings were recovered from its working files and re-verified by hand before being recorded here.)*

---

## §7 Gates that logged a problem, failed to fix it, and shipped

Four repair passes reported the *same score before and after* and gave up:

| pass | chapter | score before → after | still failing |
| --- | --- | --- | --- |
| regen-scaffold | ch9 | 200 → 200 | `report_style_clearance` |
| regen-suspect-elimination | Beatrice Quill | 300 → 300 | 3 missing clearances |
| geometry reveal-repair | ch8 | 500 → 500 | — |
| aftermath-repeat regen | ch9 | 325 → 325 | 3 paragraphs |

Plus `scene-grounding coverage below target (0/10 chapters grounded)` and — importantly —

> `[Agent 6] blind reader NOT MEASURED — Azure refused the prompt (content filter…). The gate is
> SKIPPED, not passed`

Release gate: `warning`, `hard_stop_count: 0`, `shipped: true`. Rubric caps `prose ≤ 6` and
`ending ≤ 7` applied — and the external reviewer independently gave prose 6 and ending 5. **The
internal caps and the external read agree.** The scoring is not the problem; the shipping decision is.

**Fixes.** F9: an unresolved regen budget — a pass that does not improve its own score on attempt *n*
should stop, not retry, and the wasted LLM calls should be counted (this run made ~6 `aftermath_repeat`
regen calls at ch9 for zero score change). F10: a skipped gate must not read as a passed gate anywhere
downstream; a content-filter refusal should surface as `unmeasured` in the release decision, not be
absent from it.

---

## §8 The run was excluded from its own ledger because a warning was written to an errors array

> `[DE1 ledger] NOT recorded: run status is "failure" (2 error(s)). The corpus therefore holds only
> clean runs — a biased sample, and the next run will diverge from a history this one is missing from.`

Both "errors" carry `"severity":"warning"` in their own payload — they are the §6 CML integrity
warnings, written into an `errors` array. Meanwhile the run report says `run_outcome: "passed"`,
`passed: true`. **Two subsystems disagree about whether this run succeeded.**

The cost is not cosmetic. The novelty ledger is what cross-run divergence is computed *against*, so
systematically excluding troubled runs means the pipeline never learns to diverge from its own worst
output — the ledger's own log says so, and it is right.

**Fix F11:** a record's severity must determine which array it lands in; run status must be derived
from severities, not from array membership. And the ledger should record *what shipped*, since a
shipped book is part of the history whether or not it was clean.

---

## §9 Attribution — none of this is the A_79 corpus work

The obvious suspicion is the corpus integration that landed hours earlier. It was tested, and it does
not hold. **MEASURED:**

| A_79 change | Could it have caused these defects? |
| --- | --- |
| **A1** device library corpus | **No.** §14 proved it never reached a prompt in this run — the block rendered curated patterns only. |
| **B** Agent 3 exemplars | **No.** It changed Agent 3's prompt, and Agent 3's output was *correct*: two times, five minutes apart, correctly recorded. |
| **C** cell scheduler corpus | **No.** `shadow` — it logs a cell and changes no input. |
| **D** anti-copy gate | **No.** Read-only, appended after the final re-validation; it throws or does nothing. Found 0 spans. |

The only edit to `agent9-run.ts` across all three A_79 commits is D. The prose-injection and retry
paths are untouched. And the CML-integrity warning count (4) is unremarkable against 0/4/10 in
neighbouring runs.

**One open question, honestly unresolved.** Phase B put a *worked example* of a real novel into Agent
3's prompt for the first time, and the exemplar delivered was *The Clue of the Twisted Candle* — a
clock-and-candle timing case. The run then produced a clock-backshift timing case, and the shadow
novelty judge logged `variation vs the_clue_of_the_twisted_candle … drop the locked_room_timing
mechanism`. Against that: the canary input is frozen, the immediately prior run was *also* a clock
case, and 44 of 102 shipped runs are already `temporal × locked_room_timing`. **INFERRED, not
measurable at n=1.** The mechanism worth worrying about is structural rather than anecdotal: exemplar
selection is axis-driven, so a same-axis exemplar reinforcing the same axis is a feedback loop by
construction. §10 gives the falsification.

---

## §10 The fixes, ranked

Ranked by marks-recoverable per unit of risk, not by how interesting they are.

| # | Fix | Cost | Recovers | Confidence |
| --- | --- | --- | --- | --- |
| **F3** | a retry may not lose a locked-fact value / clue / stated time the original had | small | the 6 marks in §1 | **high** — failure-class-general, catches this without knowing the rule existed |
| **F1** | drop `required to`, narrow `must include`/`ensure that`/`obligation` | tiny | same 6 marks, at source | **high** — 16.7%-of-canon measurement is the regression test |
| **F2** | `contextual` confidence annotates; only `explicit` gates | tiny | prevents the whole class | high |
| **F5** | atomic-fact distinctness as a prompt OPERATION, baselined first | medium | the 40:2 collapse | medium — must be baselined before shipping |
| **F12** | one time parser for every temporal gate + a known-positive fixture | small | unblinds the only hard abort | **high** — the gate is provably blind today |
| **F13** | call the alignment check after `ctx.cml` exists; fixture it | tiny | resurrects a dead check | **high** — line 247 vs 318 |
| **F8** | derive CML anchors from device facts; mismatch fails preflight | medium | wasted Agent 9 spend | medium |
| **F11** | severity decides the array; status derives from severity | small | ledger bias | high |
| **F7** | bind the reveal by disclosure content; one shared locator | medium | ch8 overstuffing | medium — §5 is INFERRED |
| **F9/F10** | unresolved-regen budget; a skipped gate is not a passed gate | small | wasted calls, honest gating | high |
| **F6** | do not inject a value already present in the paragraph | small | 2 duplicate sentences | low reach — measure first |

**Do F1+F2+F3 together.** They are small, they are independent of everything else in this document,
and between them they close the defect that cost the most marks.

**Do not** ship F5 or F6 on the strength of this single run. Both need the 204-manuscript baseline that
A_79 §12 established as the standard — the 6-gram anti-copy index looked obviously right and fired on
92.2% of our own books.

---

## §11 Falsifications, stated first

- **F1/F2 are wrong** if `instruction_shape` has ever caught a real prompt leak that no other rule
  caught. Check the archived runs for `instruction_shape` hits that were genuine leakage; if it has a
  real catch record, narrow it rather than drop it.
- **§2 is wrong** if the shipped chapter-8 sentence was not produced by the retry — i.e. if the first
  attempt also contained the collapsed form somewhere. The run's warning payload preserves the first
  attempt's sentence; re-read it before acting.
- **§5 is wrong** if chapter 8's overstuffing is present in runs with correct reveal binding. Compare
  against the neighbouring runs' reports.
- **§9's open question resolves** only with a matched pair: `RESUME_REDO=prose` is not enough because
  the divergence is at Agent 3. Run *N ≥ 4* pairs with `SEED_CORPUS_FROM_LIBRARY` on and off against
  the same frozen input, and compare the mechanism-family distribution. A single run cannot settle it
  and must not be reported as if it had.

---

## §12 What the run cost, and what it bought

£0.98, 24.1 minutes, 60 calls, 5 of 10 prose batches retried, 125 warnings, `passed`, shipped.

It bought a defect list that the run had already written down. Of the eight findings above, **six were
logged by the pipeline's own telemetry** — the reveal-binding mismatch, the unresolved regens, the
unaccounted times, the CML mismatches, the scene-grounding shortfall, the skipped blind reader. The
external reader found the *consequences* of defects the system had already named.

That is the real finding of this document, and it is a control-plane problem rather than a generation
problem: **the pipeline's diagnosis is better than its shipping decision.** Every one of those
warnings was advisory. `hard_stop_count` was 0. A book whose central mechanism contradicts itself 40
times to 2 is not a warning-grade outcome, and nothing in the release gate was empowered to say so.

---

## §15 Implementation record — and four places this document was wrong

Implemented 2026-08-31, commit `8a1a18a7` onward. 2,880 tests green across seven packages;
`flags:check` and `flags:runtime` clean.

| Fix | Status | Note |
| --- | --- | --- |
| **F1** narrow the two ordinary-English rules | **DONE** | canon false positives 2/12 → **0/12**; all 19 rules now clean against real Golden Age prose, and all five known-positives still fire |
| **F2** the confidence tier decides gating | **DONE** | `watch` findings now report at `moderate` and cannot force a regeneration |
| **F3** a retry may not lose what the original had | **DONE**, flag `AGENT9_RETRY_REGRESSION_GUARD` | new `prose-guard/retry-regression.ts`; catches the real ch8 regression, 0 false positives on three legitimate rewrites |
| **F5** atomic-fact dominance | **DONE as a MEASURE**, threshold corrected | see 15.1 |
| **F6** do not inject a value already present | **NOT DONE** — mechanism unconfirmed | see 15.2 |
| **F9** unresolved-regen budget | **ALREADY EXISTED** | see 15.3 |
| **F10** a skipped gate is not a passed gate | **ALREADY CORRECT** | see 15.4 |
| **F11** severity decides the array | **DONE** | warning payload no longer written to `ctx.errors` |
| **F12** one time parser for the hard abort | **DONE**, flag `AGENT9_CLUE_TIME_WORDFORM` | with a known-positive fixture |
| **F13** call the alignment check after its data exists | **DONE** | with a known-positive fixture |
| **F7** bind the reveal by disclosure content | **not started** | §5 is INFERRED; wants its own measurement first |
| **F8** derive CML anchors; mismatch fails preflight | **not started** | see 15.5 |

### 15.1 F5's proposed threshold was wrong by an order of magnitude

§3.2 suggested "a threshold near 4:1 is defensible". `scripts/a80-baseline-f5-f6.mjs`, over 205
archived manuscripts:

| dominance | manuscripts firing |
| --- | --- |
| ≥ 2:1 | 59.2% |
| ≥ 3:1 | 43.7% |
| **≥ 4:1** | **31.0%** |
| ≥ 6:1 | 17.8% |
| ≥ 10:1 | 11.5% |
| **≥ 20:1** | **1.1%** |

Median natural dominance is **2.30:1**. A 4:1 gate would have fired on nearly a third of everything
we have shipped — an off switch with extra steps, proposed in the same document that names that
failure mode twice. The failing run sat at exactly 20:1. Shipped at **12:1 as a ship-check MEASURE**,
above the natural spread and below the observed failure, and as a warning rather than a gate because
a deliberately lopsided case is a legitimate design and the real repair is an upstream instruction to
state both readings in one passage.

### 15.2 F6's mechanism was asserted and does not reproduce

§4 stated that `enforceLockedFactValuePresence`'s cap "counts pre-existing matches and so appended a
sentence identical to one already there". Driving the built function directly — chapter already
containing the value, chapter lacking it, and the function run twice over the same prose, which is
what the post-processing chain does — produced **no duplicate in any case**. There is a chapter-level
presence check ahead of the injection that the §4 account did not reckon with.

So the duplicates are real and measured (**8.8%** of 205 manuscripts, 31 occurrences, and every
example is a clock-time sentence) but the **cause is not identified**. Implementing a fix against an
unreproduced mechanism is the "plausible narrative over a correlation" failure this document's own
verification standard exists to catch, so F6 is not implemented. Note also that the probe returning
"no duplicate" is itself a claim about the probe — it does not establish the injector is innocent,
only that the stated mechanism was not demonstrated.

### 15.3 F9 was already built

`AGENT9_REGEN_CONVERGENCE_STOP` (default OFF, per-kind failure tracking, configurable limit) already
implements the unresolved-regen budget §7 asked for, with its own measurement attached: on the
2026-08-27 arm-A run, regen was the largest single consumer at 33 calls and 40% of wall-clock, and
chapter 3 took 20 of them with every one failing. The recommendation is therefore **a flag flip, not
code**. This was found the hard way: the first attempt here added an unflagged duplicate that broke
the existing feature's own "flag OFF is byte-identical" test.

### 15.4 F10 was already correct

The blind-reader skip pushes "The gate is SKIPPED, not passed", leaves `primaryBlindRead` undefined,
and the entire pass/fail block is guarded on that value — so nothing downstream reads a skipped gate
as a passed one. §7 overstated it. What remains true is narrower: the skip does not surface in
`release_gate_outcome`, only in the warning list.

### 15.5 Why F8 is not shipped

F8 would make an unreconciled device/CML time mismatch a preflight failure. §6 measured that signal at
**4, 0, 10, 4, 0, 0** across six runs — so a run carrying ten of them exists, and turning this into an
abort would have failed it. Shipping a new abort on a signal whose distribution is that wide, without
first measuring what fraction of those mismatches are genuine rather than intended misdirection, is
the mistake F12 is deliberately flag-gated to avoid. The derive-anchors-from-device-facts half is
sound and remains the right fix; it is a change to Agent 3's contract and wants its own increment.

### 15.6 What ships ON and what ships OFF

`F1`, `F2`, `F11`, `F13` and F5's measure are **on** — they are corrections restoring behaviour the
surrounding code already documents as intended, and gating a bug fix behind a flag leaves the bug on
by default. `F3` and `F12` are **off**: one changes which draft ships, the other can abort a run, and
both need their firing rate observed before they decide anything.

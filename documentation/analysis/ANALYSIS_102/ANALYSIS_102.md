# ANALYSIS_102 — The cases prove presence, not the act

**2026-09-23. Cost: £0.** Measured over every archived case on disk. This is a finding about the CASE
(Agent 3), not about the prose, and it is why the lowest-scoring category in the project has stayed
lowest through every prose change ever made to it.

---

## §0 THE FINDING

**Of 61 archived cases that have a death method, a discriminating test and clues: 52 — 85% — never
connect the culprit to the act of killing. 53 of 61 — 87% — contain no clue naming both the culprit
and the murder weapon.**

The mystery proves the *alibi was false*. Nobody ever proves *who struck the blow*. **MEASURED**
(`proves-what.mjs`: a case counts as proving the act if the discriminating test's design, knowledge or
pass-condition mentions a noun of its own `death_method`, or if any clue names both the culprit and
such a noun).

Seed 50862, stated in its own words — `discriminating_test.pass_condition`:

> *"The test conclusively shows the compass bearing was inaccurate and ledger entries were altered,
> invalidating Nora's alibi and **confirming her presence at the crime scene**."*

Presence. And `hidden_model` — the case's account of what really happened — **never mentions the
killing at all**. The victim was struck with a heavy paperweight; the case is about a compass.

The shape is the same everywhere:

| the victim was | and the case proves |
|---|---|
| stabbed with a ceremonial dagger | "the measured pendulum swing confirms the clock's accelerated timing" |
| struck with a heavy antique paperweight | "the hourglass at low temperature shows delayed sand flow" |
| strangled | "if the clock shows a different time than Dr. Finch's watch, it proves tampering" |
| stabbed with a hotel letter opener | "the observed clock and timer states … prove the pendulum" |
| stabbed with a letter opener | "the clock pendulum stops and the hands freeze upon door hinge movement" |

---

## §1 THIS IS THE COMPLAINT THE READER HAS MADE EVERY TIME

Four external reads of v2 books, four different cases, **four statements of the same thing** — each
one the read's own headline issue:

| read | the reader's words |
|---|---|
| A, 80 | *"the compass trick still does not fully lock to the murder method and timing"* |
| B, 84 | *"make the mechanism more physical"* — one physical tampering detail |
| C, 80 | *"the time logic needs one clean explanation"*; an alibi that contradicts the true death time |
| A′, 82 | *"the compass/ledger trick is interesting, yet it still does not fully prove the murder in a satisfying, physical way"* |

And its price is visible in the marks. **`clues` is the lowest-scoring category the project has**:
September mean **6.38**, against 7.19–8.19 for every other category. It is also the category v2 moved
most (+0.96) by fixing clue *ownership and placement* — and it still sits at 7, one below its
neighbours, because ownership was never the ceiling.

**INFERRED, and the strongest inference available at n=4:** the remaining gap between v2's 80–84 and
the reader's own stated ceiling of 86–91 is mostly this.

---

## §2 WHY THE PIPELINE PRODUCES IT

Nothing is broken. Every stage does what it is told:

- **Agent 3** authors `hidden_model.mechanism` as the CONCEALMENT — the trick that hides the truth —
  and `discriminating_test` as the thing that breaks the concealment. Both are about the alibi. There
  is no requirement anywhere that the case connect the culprit to the act, and `death_method` is used
  only for the body-discovery tell (A_61 RC3.5).
- **Agent 5** surfaces what the case contains. A_101 §15 measured what happens when it is asked for a
  weapon link the case lacks: three runs, three fabricated fingerprints, each citing a `sourceInCML`
  that says something else, all passing the guardrails. **The clue layer cannot fix this; asking it to
  produces fair-play defects wearing citations.**
- **Agent 9** writes what the contract gives it. v2's reveal now names the culprit and states the act
  in 21 of 21 drafts — a sentence the case's own evidence does not support.

So the defect is a MISSING REQUIREMENT at the one stage that could carry it, and every downstream
stage faithfully propagates the gap.

---

## §3 WHAT THE FIX IS, AND WHAT IT IS NOT

**Not** a new clue slot in Agent 5 — measured and withdrawn (A_101 §15).

**Not** a prose instruction — Agent 9 already asserts the act; asserting it harder is what the reader
called *"under-supported"*.

**The requirement belongs in Agent 3**, and it is one sentence of contract: *the case must contain at
least one fact that connects the culprit to the means of death and does not follow from presence
alone* — an object of theirs that touched it, a mark it left on them, a thing only its handler would
know, an access to where it was kept that no other suspect had. Then `constraint_space.physical.traces`
carries it, Agent 5's existing culprit-direct slot surfaces it, the discriminating test can rest on it,
and the reveal has something to stand on.

**Two design constraints, both learned the expensive way:**

1. **It must not close the case.** A fingerprint on the weapon ends the mystery at chapter 5 and makes
   the discriminating test pointless (A_101 §15). The fact must be one the culprit can explain
   innocently until the rest of the case corners them.
2. **It must be authored, not asked for.** A_101 §15: asking any agent for evidence its input does not
   contain yields invention with a false citation, not an honest absence.

---

## §4 HOW TO BUILD IT WITHOUT PAYING FOR A BOOK

`harness:agent5:direct` cost pennies and overturned a fix a £1.15 run would have shipped. **Agent 3
has no such harness**, and it is the stage with the most expensive failures.

| step | cost |
|---|---|
| 1. build `harness:agent3:direct` — one CML from one set of inputs, no pipeline | **DONE — §6**, £0.008 a case |
| 2. iterate the requirement against it until the case connects the culprit to the act **and** the test still needs the discriminating step | pennies |
| 3. re-measure `proves-what.mjs` over the generated cases: the 15% should move | £0 |
| 4. **then** a full paid run on a fresh seed, and a read | ~£1.15 + a read |

**Step 4 is the "random full run" worth paying for, and it is worth paying for only after step 3
moves.** A full run today would produce another case that proves presence, another book whose reveal
asserts what its evidence does not support, and another read saying so — at 4× the price of the
resume that already said it.

---

## §5 WHAT THIS DOES NOT CLAIM

- **That fixing it reaches 86–91.** That is the reader's estimate of its own suggestions, not a
  measurement. `rubric-cannot-rank-two-books` applies.
- **That 85% is a defect rate for the genre.** Golden Age mysteries do sometimes convict on
  opportunity and knowledge alone. The claim is narrower and evidenced: **this reader, on four
  consecutive books, asked for the physical link every time and marked `clues` lowest every time.**
- **That the 15% that do connect scored better. TESTED, and it settles nothing.** Pairing the read
  ledger to the cases on disk gives 22 books whose case can be classified: **21 prove presence only,
  and exactly ONE proves the act.** That one read **87 — the highest mark this project has ever
  received** — against a mean of 77.7 for the other 21, a difference of 9.3 marks.

  **At n=1 that is an anecdote, not evidence, and it must not be quoted as support.** One book cannot
  separate "the case proved the act" from everything else about that book. What the check DID do is
  fail to falsify: had the connecting cases read at or below the rest, §1's inference would be dead,
  and it is not.

  It also shows why the corpus cannot answer this question: the pipeline produces so few cases that
  prove the act that there is no comparison group. **The only way to test it is to make the case
  connect the culprit to the act and read the result** — which is §4's plan, and this is now its
  strongest justification.

---

## §6 THE AGENT 3 HARNESS — BUILT, AND IT REPRODUCES THE DEFECT ON FRESH CASES

`npm run -w @cml/worker harness:agent3:direct -- --project <projectId>` generates ONE case from a
project's real persisted `setting`, `cast`, `background_context` and `hard_logic_devices`, with no
pipeline around it.

**It reuses production rather than copying it.** The request comes from `buildCmlGenerationRequest`,
the same function `agent3-run` calls, now exported; `generateCML` does the call, the normalisation and
the validation. A harness with its own input builder would test a prompt nobody runs —
[[restated-facts-must-be-generated-and-checked]], which this repo has paid for four times.

**It reports A_102's classification of the case it just made**, so the number a fix has to move is
printed by the instrument that makes the change, not by a separate script that can drift.

### §6.1 THE BASELINE

Three runs against seed 50862's upstream, **$0.011 / $0.011 / $0.010 — about £0.008 a case**, ~50s each:

| run | culprit it chose | death method it chose | classification |
|---|---|---|---|
| 1 | Harriet Kestrel | stabbed with a dagger | **PRESENCE ONLY** |
| 2 | Harriet Kestrel | stabbed with a dagger | **PRESENCE ONLY** |
| 3 | Theodora Lachlan | stabbed with a stiletto knife | **PRESENCE ONLY** |

**3 of 3 — MEASURED, on cases generated today.** §0's 85% was computed over an archive that could in
principle have been produced by older prompts; this is the current prompt, run three times, producing
the same defect each time. Each case's discriminating test proves the compass can be tilted; none
connects the person holding the knife to the knife.

It also shows Agent 3's variance from identical inputs: same setting, same cast, three runs, two
different culprits and two different murder weapons. Any A/B on this stage needs several cases per
arm, and at £0.008 each that is affordable.

### §6.2 WHAT THIS CHANGES ABOUT THE PLAN

§4's step 1 is done. Steps 2 and 3 are now a loop costing **under a penny per iteration** against a
stage whose failures previously cost £1.15 to observe. The requirement in §3 can be drafted, run ten
times, measured, and redrafted, before any book is written.

**The rate to beat is 0 of 3.**

---

## §7 THE REQUIREMENT, DRAFTED AND ITERATED — 0 of 3 TO 6 of 8, FOR £0.12

Fourteen harness cases, `$0.155` — **about 12 pence** — against a stage whose failures previously cost
£1.15 each to observe. Four drafts, and the thing that moved the number was not the argument. It was
the **shape**.

### §7.1 THE ARMS

Every arm is the same upstream (`canary_1789577884303`, seed 50862) and the same classifier, which was
corrected four times during the work (§7.3) and every arm re-scored with the final one.

| arm | what changed | links the culprit to the act | of those, by a PRINT |
|---|---|---|---|
| baseline | — | **0 of 3** | — |
| draft 1 | one trace, with a route list and "Do NOT make it a fingerprint" | 2 of 3 | **1** |
| draft 2 | prints reassigned to an innocent as a red herring | 2 of 3 | **1** |
| draft 3 | every slot given a literal string shape | **3 of 4** | **0** |
| draft 4 | the culprit moved INTO the reach-list shape | **3 of 4** | **0** |

**6 of 8 on the final wording, 0 of 8 resting on a print. MEASURED.**

### §7.2 WHAT THE FOUR DRAFTS SETTLED

**1. A prohibition does not steer this model, and this is now the fourth time it has been paid for.**
A_101 §15 spent three Agent 5 wordings on "not a fingerprint" and got three fingerprints. Draft 1 said
it again at Agent 3 — *"Do NOT make it a fingerprint, a blood group, or any reading taken off a body:
those are laboratory verdicts"* — and got a fingerprint in 3 of 3. Draft 2 stopped forbidding it and
**assigned it a job**: prints on the implement belong to an innocent and become one of the two
red_herrings the case already owes. That was obeyed 3 of 3 immediately, because it lands in an
existing counted structure with named fields.

**2. A shape is obeyed; the same request in prose is not.** This is the cleanest measurement of the
compliance law the project has. Drafts 2 and 3 asked for the *same three facts*. Draft 2 asked in
sentences; draft 3 gave each a literal string shape:

| slot | draft 2, asked in prose | draft 3, asked as a shape |
|---|---|---|
| whose the implement was | **0 of 3** | **4 of 4** |
| who could reach where it was kept | **1 of 3** | **4 of 4** |

Nothing else changed. **MEASURED**, and it is the operational form of
[[prompts-move-operations-not-statistics]]: a slot inside a shape is filled, a requirement beside the
shape is dropped.

**3. A qualifier is dropped even when it is the point.** Draft 3 wrote the shape for the reach list and
then added *"The culprit is one of the reachable names"* as the next sentence. In 1 of 4 cases the
reach list named two suspects and the culprit was not among them — the requirement's whole purpose,
lost to its position. Draft 4 changed nothing but moved the culprit **into the shape** as a slot, and
it held in 3 of 4.

**4. The case-closing constraint was satisfied by construction, not by instruction.** A_102 §3 required
that the link must not end the mystery at chapter 5. No draft ever says so. The place-slot does it: a
trace written as `"<what was found> in <a room this case names> — <culprit>"` cannot be a print on the
weapon, because the implement is not a room. What the cases produced instead is ordinary Golden Age
evidence — *"Displaced dagger sheath in proprietor's office — Nora Quayle"*, *"Scratches on letter
opener box in proprietor's office — Nora Quayle"*, *"Sand and blood stains on Gwendolyn Vance's
clothing"*. Every inference step using them NARROWS the pool; none names the culprit.

### §7.3 FOUR DEFECTS IN THE INSTRUMENT, ALL FOUND BY READING THE CASES IT SCORED

The classifier was wrong four times, in both directions, and every one was found by reading the cases
rather than by reading the code. **This is the session's most transferable finding.**

| # | defect | it reported | truth |
|---|---|---|---|
| 1 | matched the culprit by full name or SURNAME only | *"traces to Gwendolyn"* names nobody | it names the culprit |
| 2 | took the FIRST trace mentioning the weapon and stopped | a case's fingerprint | the same case also carried *"sheath with Gwendolyn Vance's initials"* |
| 3 | required the weapon noun in the trace | *"blood stains on Gwendolyn Vance's clothing"* is PRESENCE ONLY | it is the required link exactly |
| 4 | matched the killing VERB | *"reveals Nora's presence when Gaunt was **stabbed**"* PROVES THE ACT | it says **presence** in as many words |

Defects 1–3 understated the fix. Defect 4 **overstated** it, and awarded the instrument's strongest
verdict to a sentence stating the very thing the instrument exists to detect. Had the arms been scored
once and believed, draft 4 would have read 3 of 4 on a case that proves nothing.

Defects 2 and 4 are fixed by **construction**: score every matching trace rather than the first, and
take the instrument from what follows `" with "` rather than keeping every long word. Defect 3 is not
fixed by growing a vocabulary of act-nouns — [[closed-vocabulary-deciding-a-pass]], three prior
occurrences — so the verdict stays conservative and the classifier now **surfaces** culprit-naming
traces it cannot settle, for a person to adjudicate.

### §7.4 §0 RE-MEASURED, AND IT HOLDS

All four corrections were applied to the archive script and it was re-run. **48 of 56 cases — 86% —
prove presence only**, against §0's 85% of 61. The n falls because five cases name no instrument
("strangled"), which the corrected rule declines to score rather than guessing. **The headline of this
document survives every correction to the instrument that produced it.**

One figure sharpens: **0 of 56 archived cases ever linked the culprit to the act by a physical trace.**
All eight that link do so through the discriminating test or a clue. The trace route the requirement
uses has never once fired in this pipeline's history, which is why the fix had to be authored at
Agent 3 rather than asked for downstream.

### §7.5 WHAT IS NOT SETTLED

- **That any of this reaches a book.** Eight cases are not a run. Agent 3 sits above nine stages, and
  whether Agent 5 surfaces the new trace, the outline places it and Agent 9 uses it in the reveal is
  **untested**. §4's step 4 is now due: a full paid run on a fresh seed, and a read.
- **That it moves a mark.** [[rubric-cannot-rank-two-books]] — any A/B under ~7 marks is unmeasured,
  and the reader's 86–91 is their estimate of their own suggestion, not a measurement.
- **2 of 8 still author no link at all.** Both misses put the shape in the wrong slot or omitted the
  disturbance trace. A fifth draft is affordable at £0.011 a case; it was not attempted, because the
  remaining question is whether the link survives nine downstream stages, and no number of harness
  cases can answer that.


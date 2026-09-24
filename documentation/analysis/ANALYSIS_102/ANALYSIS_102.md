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

> **CORRECTION (A_103 B68/B69, 2026-09-23).** Every harness run below was built on `primaryAxis:
> temporal` with NO theme. The harness read `meta.primary_axis` and `meta.theme`, fields no persisted
> CML carries (MEASURED 0 of 64 in the store), and defaulted. The project it ran against
> (`canary_1789577884303`, seed 50862) is an `authority` case with a 60-word theme naming the
> concealment and a story angle. So §6's reproduction and §7's 0 of 3 → 6 of 8 measured the
> requirement under a different axis, mechanism-family set, hard-logic modes and tone from the run
> that fed §8. The numbers stand as what they are - the requirement's effect on a temporal, bare-theme
> prompt - and are NOT evidence about the production prompt until re-run with the canonical axis
> (`false_assumption.type`, now what the harness reads) and `--theme` (now required). Nothing here is
> deleted; this note is the finding.

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

---

## §8 THE PAID RUN — SEED 61062. ALL THREE TESTABLE PREDICTIONS FAILED, AND THE REASON IS DIAGNOSABLE

| | |
|---|---|
| run id | `mystery-1790200611969` |
| project id | `canary_1790200611967` |
| seed | 61062 · temporal · Liner 1920s · private detective · classic · 6 cast · angle "a brewery dynasty" |
| cost | **$0.955** (upper bound; cache hits billed at full input rate) |
| status | **failure**, 2 errors |
| release gate | **warning** — `geometry unaccounted_time` |
| rubric (shadow) | **65/100**, capped: *"central clue stated as two flat values, not one contradiction → clues ≤ 6"* |
| ship-check | repetition **75.2 per 10k against a corpus median of 17.3 — 4.3× — WORTH A LOOK BEFORE READING** |

**The book is not going to a reader.** CLAUDE.md, and A_94 before it: a book at 29.8× the repetition
median went to a reader, cost 7 marks and settled nothing. This one is at 4.3× with the instrument
saying so.

### §8.1 EVERY PREDICTION, INCLUDING THE FAILURES

| # | prediction | result |
|---|---|---|
| 1 | the case links the culprit to the act | **FAILED** — `TRACE ONLY` |
| 2 | Agent 5 turns that trace into a clue | **NOT REACHED** — there was no trace to surface |
| 3 | the reveal names a physical fact tying culprit to means of death | **FAILED** — the reveal rests on clock tampering and a confession |
| 4 | the read stops naming the complaint | **UNTESTABLE** — the book must not be read |

### §8.2 THE SHAPES WERE OBEYED. THEY WERE FILLED IN ABOUT THE WRONG OBJECT.

`death_method` is *"stabbed with a ceremonial letter opener"*. The concealment is a tampered lounge
clock. **The block's four shapes bound themselves to the CLOCK.**

```
traces: "Smudged fingerprints on clock face near hour hand — Neville Underhill"
        "Clock hour hand showing ninety degrees displacement — measurable physical misalignment"
        "Missing smudge on letter opener handle — indicates careful handling"
        "Displaced clock casing screws — by Katherine Bellamy"
access.permissions: "First-class lounge — reachable by Katherine Bellamy, Ferdinand Jardine,
                     Neville Underhill; not reachable by Edmund Carrick during key hours"
```

Two traces carry the `(c)` shape exactly, with the em-dash and a name. Both are about the clock. The
reach list in the `(b)` shape names the lounge, which is where the clock is, not where the letter
opener was kept. **The one trace touching the murder weapon names nobody and records an ABSENCE** —
*"Missing smudge … indicates careful handling"* — which is the `(d)` instinct applied to the slot that
was supposed to carry the link.

This is [[axis-reaches-reasoning-not-device]] in a new place: **the case's centre of gravity is the
concealment, and a requirement that says "the implement named in death_method" gets bound to the
mechanism device anyway.** The harness never showed it because seed 50862's mechanism was a compass
and its weapon a dagger — two unlike objects, and the shapes bound to the dagger 6 times in 8. Here
the mechanism is a clock, the weapon a letter opener, and the clock won. **n=1 for this failure mode.**

### §8.3 AND THE NAME IN THE SLOT IS NEVER CHECKED AGAINST THE CULPRIT

The run log carries a line no harness case ever produced:

> *"Agent 3 returned no usable culprit (culprits=[Katherine Bellamy]); normalization assigned
> 'Ferdinand Jardine' from the cast. The case did not decide its own answer."*

Agent 3 contradicted itself. It listed **Katherine Bellamy** in `culpability.culprits` while marking
her `culprit_eligibility: ineligible` and `culpability: innocent` in its own cast, and marking
**Ferdinand Jardine** `eligible` and `guilty`. Normalization recovered correctly by preferring the
cast's `guilty`.

But the means-link trace had already been written as **`"Displaced clock casing screws — by Katherine
Bellamy"`** — the `(c)` shape, filled with the name of a suspect the same case marks innocent.

**Nothing verifies that the name in the means-link slots is the culprit.** The harness classifier does
exactly that check and is not wired into the pipeline. **MEASURED**, and it is the cheapest of the
three fixes below.

### §8.4 WHAT THIS COSTS AND WHAT IT BOUGHT

£0.76 for a book nobody can read. It bought two failure modes that eight harness cases could not
surface, because both need a full case with a mechanism device and a normalization pass:

1. **The shapes bind to the concealment device, not to `death_method`.** Fixable in the prompt by
   naming the object rather than referring to it: the block should restate the weapon, and should say
   in its own words that the mechanism device is not it.
2. **The culprit named in the slots is never checked.** Fixable deterministically after normalization,
   using the check the harness already contains.
3. **A case can name a culprit its own cast marks innocent.** Pre-existing, recorded here because it
   is what orphaned the link.

**This does not settle whether the means-link helps a book.** It settles that the requirement as
written does not survive a case whose mechanism is a distinct object from its weapon. A second paid
run should not be bought until 1 and 2 are built and the harness is re-run **on an upstream whose
mechanism and weapon differ**, which seed 50862's does not sufficiently.

### §8.5 UNRELATED, AND ON THE RECORD

- **Agent 6's blind-reader gate did not run.** Azure refused the prompt twice on content filtering,
  because the case's death method is in it. The gate is **SKIPPED, not passed**, and its remediation
  loop did not run. Pre-existing (A_71), and it means this run had one fewer check than it appears to.
- **The run was not recorded in the DE1 ledger**, because its status is failure. The corpus therefore
  holds only clean runs, which is a biased sample and is [[archived-data-encodes-the-bug]] in its
  cheapest form.



---

## §9 THE FIX, MEASURED ON A FIXTURE THAT CAN FAIL — 0 of 4 TO 4 of 8, £0.11

**2026-09-24.** Two corrections to the instrument before any number: A_103 B68/B69 found the harness
had built every §6/§7 request on `temporal` with no theme, against an `authority` project; it now
reads the CML's `false_assumption.type` and REQUIRES `--theme`. And §8.2's failure needs a fixture
where the concealment device and the weapon are different objects, which seed 50862's compass-and-
dagger upstream is not. Seed 61062's upstream would have been ideal and is gone from both stores
(the A_103 session rewrote `data/store.json` at 23:46; the run report holds no payloads).

**Fixture:** `canary_1789232316543`, seed 81042 — temporal, a chiming clock made to strike at the
wrong hour, theme copied from its run-params. Every case Agent 3 wrote against it chose a blade.

### §9.1 THE BASELINE REPRODUCES §8.2 — 0 of 4

Draft 4 prompt, four cases. **Every one filled the (c) shape with the clock**: *"Faint scratch on
manor clock striking lever — Percival Thorne"*, *"Displaced clock detent lever in clock room —
Josephine Rutherford"*. The weapon trace, where there was one, named an innocent. **0 of 4 link the
culprit to the weapon. MEASURED.** So the fixture can show the failure, which is the property a
fixture has to have before a fix measured on it means anything.

### §9.2 DRAFT 5 — NAME BOTH OBJECTS, WEAPON FIRST IN EVERY SLOT — 4 of 8

§8.2's diagnosis was that *"the implement named in death_method"* is a reference the model binds to
the object the case is about. Draft 5 names both objects, gives the device's evidence its existing
home (hidden_model, rule 9h), and puts the weapon's name in the FIRST slot of every shape.

| case | weapon | verdict | the (c)-shaped trace |
|---|---|---|---|
| 1 | kitchen carving knife | **PROVES THE ACT** | *"Kitchen carving knife: blood smudge found in manor sitting room — Percival Thorne"* |
| 2 | silver letter opener | TRACE ONLY | weapon → Josephine (innocent); *"Clock striking lever: faint scratch… — Percival Thorne"* |
| 3 | small dagger | TRACE ONLY | weapon → Josephine; *"Manor clock striking lever: … — Percival Thorne"* |
| 4 | letter opener | TRACE ONLY | weapon → Josephine, and "prints wiped clean"; clock → Percival |
| 5 | silver letter opener | **PROVES THE ACT** | *"Silver letter opener: faint smudges of mud found on handle in manor study — Percival Thorne"* |
| 6 | antique dagger | **PROVES THE ACT** (weak) | *"Antique dagger: faint smudge of Josephine Rutherford's glove on handle… — Percival Thorne"* |
| 7 | kitchen carving knife | TRACE ONLY | *"Mark of knife taken from kitchen noted in kitchen storage"* — no name, no place |
| 8 | silver letter opener | **PROVES THE ACT** | *"Silver letter opener: faint smudge of estate dust found in Percival Thorne's office"* |

**4 of 8 by the classifier; 3 of 8 unambiguous. MEASURED.** Case 6 is the (d) red herring with the
culprit's name appended to satisfy the shape; its content points at the innocent. Counted by the
instrument, not by me.

**What draft 5 fixed:** the weapon's name now opens the trace in 7 of 8 (the reference is gone). **What
it did not fix:** in cases 2, 3 and 4 the clock still takes the (c) slot — the model writes the shape
twice, once for the weapon with the innocent's name and once for the clock with the culprit's. The
sentence *"fills none of these four entries"* is a prohibition and behaved like one
([[a-prohibition-does-not-steer-this-model]]).

### §9.3 THE RESIDUAL FAILURE IS A COLLISION BETWEEN (c) AND (d)

Both (c) and (d) produce an entry of the form *"<weapon>: <mark> … — <name>"*. (d) says the print on
the weapon belongs to an innocent; (c) says the disturbance names the culprit. When the model writes
ONE weapon entry it gives it to the innocent — obeying (d) — and then needs somewhere to put the
culprit, and the clock is there. The fix is a COUNT, which this model obeys: exactly one trace begins
with the weapon's name and its last slot is the culprit; the (d) print is not a trace at all and lives
only in `red_herrings`, which already has the fields for it. **Draft 6, below.**

### §9.4 THE PIPELINE NOW RUNS THE CHECK

`provesTheAct` moved to `packages/prompts-llm/src/agent3-means-link.ts`; the harness imports it and
normalization runs it after `constraint_space` is settled, pushing `[A_102 means-link] <verdict>` into
the notes that reach the run log. **Every one of the 8 cases shows the line. MEASURED.** When
normalization reassigns the culprit, `orphanedMeansLinkTraces` reports any shape-filled trace still
naming the model's original — the exact §8.3 defect, pinned in `agent3-means-link-check.test.ts` with
the seed 61062 traces. Note only: no retry, no abort (B1).

| | |
|---|---|
| baseline, 4 cases | $0.044 |
| draft 5, 8 cases (one took two attempts) | $0.098 |
| **total** | **$0.142, about £0.11** |

### §9.5 DRAFT 6 — A COUNT WITH A QUALIFIER ON IT — 5 of 8, AND THE COLLISION DID NOT MOVE

Draft 6 added one sentence to (c): *"This is the ONLY entry in constraint_space.physical.traces that
begins with the murder weapon's name, and its last slot is the culprit."* Eight cases, same fixture.
The batch was cut in half by a Windows restart at 04:21 (three restarts in six minutes, from the
System log; the harness's third request was in flight and its log simply stops) and completed later.

| case | verdict | the weapon-first trace(s) |
|---|---|---|
| 1 | **PROVES** | scratch marks in manor study — Percival Thorne |
| 2 | TRACE ONLY | weapon → Frances Orme; clock striking lever → Percival Thorne |
| 3 | **PROVES** | *"missing from desk and found in lock-keeper's cottage drawer — Percival Thorne"* |
| 4 | **PROVES** | scratch on handle found in garden shed — Percival Thorne |
| 5 | **PROVES** (weak) | *"clean cut marks on victim's body — Josephine Rutherford"* — a mark on the body, culprit's name appended |
| 6 | TRACE ONLY | two weapon traces, both innocents; clock → Percival |
| 7 | TRACE ONLY | weapon → Josephine; clock → Percival |
| 8 | **PROVES** | scratch on blade handle in servants' quarters — Percival Thorne |

**5 of 8 by the classifier, 4 unambiguous; the collision is 3 of 8, exactly as in draft 5. MEASURED.**
5 of 8 against 4 of 8 is one case at n=8 and is not an effect.

**What it settled:** the count was obeyed and the qualifier on it was dropped. In every miss there is
ONE weapon-first trace, as asked — and it ends with the innocent. *"Its last slot is the culprit"* rode
on the counted thing and went the way [[prompts-move-operations-not-statistics]] says it goes. The
sentence sending (d) to `red_herrings` was also ignored in 2 of 8, which wrote the innocent's print
into `traces` anyway.

**Draft 7 therefore stops fighting the habit.** The model wants to write the innocent's mark on the
weapon as a trace; let it, and make the culprit's disturbance a SECOND weapon-first trace in a fixed
order: *"exactly TWO entries begin with the murder weapon's name — first the innocent's handling mark,
last the culprit's disturbance."* A count of two simple things with fixed positions is the form that
has been obeyed every time it was tried. The classifier already scores every weapon trace, so two is
fine.

Draft 6 cost $0.088 for eight completed cases; the interrupted request may have been billed.

### §9.6 DRAFT 7 — TWO WEAPON-FIRST TRACES IN A FIXED ORDER — 8 of 8, AND THE CONTENT THINNED

Draft 7: *"constraint_space.physical.traces carries exactly TWO entries that begin with the murder
weapon's name, in this order: FIRST the innocent's handling mark from (d), LAST this disturbance with
the culprit's full name in its final slot"*, and (d) given its own shape,
`"<weapon>: <print, smudge or handling mark> — <innocent>"`. Eight cases, same fixture.

**8 of 8 PROVES THE ACT. The collision is 0 of 8. MEASURED.** Every case carries both traces in the
stated order, and no case puts the culprit on the clock. A count of two simple things with fixed
positions was obeyed eight times out of eight, which is the strongest compliance this block has had.

**And the thing the number stands for got worse.** Read, not scored:

| case | the culprit's trace | place slot | kind |
|---|---|---|---|
| 1 | *"fresh blood and handling mark — Percival Thorne"* | none | assertion |
| 2 | *"deep scratch and blood traces — Percival Thorne"* | none | assertion |
| 3 | *"fresh fingerprints and smudge matching Percival Thorne in servant's quarters"* | yes | **the culprit's fingerprints on the weapon** — the case-closing kind (§3) |
| 4 | *"fresh handling marks indicating disturbance — Percival Thorne"* | none | assertion |
| 5 | *"fresh handling marks inconsistent with Percival's pattern — Frances Orme"* | none | assertion |
| 6 | *"smudge and fresh blood stains in manor room — Percival Thorne"* | yes | disturbance |
| 7 | *"fresh scratch marks and repositioned detent lever in manor clock — Percival Thorne"* | wrong | **the clock, inside the weapon's trace** |
| 8 | *"fresh handling scratch and repositioning marks — Percival Thorne"* | none | assertion |

Drafts 5 and 6 produced *"missing from desk and found in lock-keeper's cottage drawer"*, *"displaced
sheath in proprietor's office"*, *"scratch on handle found in garden shed"* — a disturbance, in a
place. Draft 7 produced *"fresh handling marks"* six times. **The place slot survived in 2 of 8.**

**The mechanism is visible:** the (d) shape sits immediately above (c) and has no place slot. The
model wrote (c) in the same form as (d) — parallel construction — and the place went with it. Two
adjacent shapes converge on the simpler one. *"Print"* in (d)'s slot also licensed fingerprints on the
weapon, and case 3 gave the culprit's.

**This is Goodhart on the instrument.** The classifier asks whether a weapon trace names the culprit
and cannot tell *"fresh handling marks — Percival"* from *"found in the cottage drawer — Percival"*.
8 of 8 is the number; the case is not 8 of 8 better. **Recorded so that the number is not cited alone.**

**Draft 8, the last in this loop:** give (d) the same place slot as (c), so the parallel construction
keeps the place; and take *"print"* out of its slot. Then stop iterating, whatever the number — the
next question is a book, and the harness cannot answer it.

Draft 7 cost $0.088.

### §9.7 DRAFT 8 — (d) CARRIES THE PLACE SLOT — 8 of 8, PLACE 8 of 8, AND THE LOOP STOPS HERE

Two changes to (d): the same place slot as (c), and no *"print"* in its slot. Eight cases, same fixture.

| case | the culprit's trace | place | kind |
|---|---|---|---|
| 1 | *"fresh handling disturbance found in servants' quarters — Percival Thorne"* | yes | generic |
| 2 | *"fresh scratch marks found on handle in gardener's shed — Percival Thorne"* | yes | **concrete** |
| 3 | *"handling disturbance found in billiard room — Percival Thorne"* | yes | generic |
| 4 | *"fresh handling marks found in manor kitchen — Percival Thorne"* | yes | generic |
| 5 | *"fresh handling marks and blood smudge found in kitchen drawer — Percival Thorne"* | yes | **concrete** |
| 6 | *"disturbance found in lock-keeper's cottage — Percival Thorne"* | yes | generic |
| 7 | *"fresh handling marks found on desk drawer in manor study — Percival Thorne"* | yes | **concrete** |
| 8 | *"fresh handling disturbance found in lock-keeper's cottage — Percival Thorne"* | yes | generic |

**8 of 8 PROVES THE ACT; collision 0 of 8; place slot 8 of 8; culprit's prints on the weapon 0 of 8;
the clock inside a weapon trace 0 of 8; every innocent's mark a glove smudge with a place. MEASURED.**
The parallel-construction mechanism from §9.6 ran in reverse: once (d) carried a place, (c) kept its
own. **Not fixed, and not attempted further:** 5 of 8 culprit traces say *"handling marks"* or
*"disturbance"* — the shape is filled with the vaguest mark that satisfies it. The two-slot form
guarantees a place and a name; it does not guarantee a scratch on a handle. That is prose quality,
and the harness cannot score it.

### §9.8 THE LOOP, END TO END

| arm | change | links | collision | place | notes |
|---|---|---|---|---|---|
| baseline (draft 4) | — | **0 of 4** | 4 of 4 | — | every shape filled with the clock |
| draft 5 | name both objects, weapon first | 4 of 8 | 3 of 8 | 4 of 5 | 3 unambiguous |
| draft 6 | "only one, ending with the culprit" | 5 of 8 | 3 of 8 | 4 of 5 | count kept, qualifier dropped |
| draft 7 | exactly two, innocent first, culprit last | **8 of 8** | **0 of 8** | 2 of 8 | content thinned; one culprit print |
| draft 8 | (d) carries the place slot, no "print" | **8 of 8** | **0 of 8** | **8 of 8** | 5 of 8 generic wording |

**36 harness cases, about $0.41 — roughly £0.32 — against a stage whose failures cost £1.15 each to
observe.** Four findings that transfer:

1. **Name the object; a reference binds to whatever the case is about** (§8.2, §9.1–§9.2).
2. **A count of simple things with fixed positions is obeyed; a qualifier on a counted thing is
   dropped** (§9.5), even when the qualifier is the point.
3. **Adjacent shapes converge on the simpler one** (§9.6–§9.7). Two templates side by side must carry
   the same slots, or the richer one loses its extra slot.
4. **The instrument is satisfied by the thinnest content that fits it** (§9.6). 8 of 8 is a number about
   the shape. Read the cases.

**What is NOT settled, and the only thing worth paying for next:** whether the trace survives nine
stages into a book — Agent 5 surfacing it, the outline placing it, the reveal resting on it — and
whether a reader then stops saying the trick *"does not fully prove the murder in a satisfying,
physical way"*. That is a full run (~£1.15) and a read. With the block at 8 of 8 on a fixture that can
fail, and the pipeline now logging `[A_102 means-link]` on every case so the run's own log will say
whether the case linked before a word of prose is written, it is the right next spend.


---

## §10 THE SECOND PAID RUN — SEED 6325. THE CASE LINKED; THE LINK DIED ONE STAGE DOWN

| | |
|---|---|
| run id | `mystery-1790236126588` |
| project id | `canary_1790236126586` |
| seed | 6325, humour pinned to classic (`--seed 6325 --axis temporal --humour classic --force`; the original sharp-humour draw is preserved beside it) |
| parameters | temporal · chiming clock struck at the wrong hour · Village 1920s classic · amateur detective · **modern narrative (drawn three times, not pinnable)** · 5 cast · angle: a pawnbroker's shop and its pledge book |
| cost | **$1.165** |
| status | warning |
| release gate | warning — `geometry unaccounted_time`, two clock readings nothing in the case accounts for |
| rubric (shadow) | **70/100**, against 65 on seed 61062 |
| ship-check | repetition **151.7 per 10k against a median of 17.3 — 8.8× — WORTH A LOOK**; chapter 2 fell to a completion fallback after three attempts |

**The book is not going to a reader**, on two rules at once: a fallback chapter, and a ship-check that
says so. Both are recorded below because they are findings of their own.

### §10.1 EVERY PREDICTION

| # | prediction | result |
|---|---|---|
| 1 | the run log carries a means-link verdict of PROVES THE ACT at Agent 3 | **PASSED** — *"heavy iron poker: disturbed dust and repositioned tool found in Julian Carrick's forge — Julian Carrick"*, with the glove smudge assigned to Lavinia Yardley. The case obeyed all four shapes, including a keeper for the poker and a reach list naming the culprit |
| 2 | Agent 5 turns the trace into a clue | **PARTIAL** — `clue_culprit_direct_julian_carrick` carries the forge dust and repositioned tools, mid-placed and essential, with the glove mark as a red herring and its innocent explanation two clues later. **The weapon is gone from it**: *"Dust disturbance and repositioned tools… indicating recent tampering"* |
| 3 | the reveal names a physical fact tying the culprit to the means of death | **FAILED** — the reveal's ninth point: *"the disturbed dust and repositioned tools established Julian Carrick's unique access and involvement in tampering with the clock."* The poker reaches the culprit in one sentence in chapters 8–10, and it is the confession |
| 4 | the read stops naming the complaint | **UNTESTABLE** |

### §10.2 WHERE THE POKER BECAME THE CLOCK — TWO STAGES, BOTH NAMED

**At Agent 3, the trace was authored and never used.** The block's last sentence — *"ONE inference step
lists (b) and (c) in its required_evidence"* — sits beside the four shapes, in prose, and behaved like
every sentence beside a shape has behaved in this document: no step's observation is the trace, and
the discriminating test is the clock and the alibi. §9's harness measured the trace and never
measured its use. **MEASURED** from the persisted CML.

**At Agent 5, the clue was sourced from the wrong field.** `clue_culprit_direct_julian_carrick` cites
`CASE.cast[2].evidence_sensitivity[0]`, which holds the bare noun *"forge tools"*, not the trace path.
The culprit-direct slot derives from the cast entry, and the weapon binding — which lives only in the
trace's first slot — never entered the clue layer. From there Agent 7 used the forge as an alibi
location (*"forge attendance from seven ten to seven forty five"*) and Agent 9 finished the drift.

So §4's step 4 answered the question it was bought to answer, and the answer is that **the link
survives to Agent 5 as a fact and loses its object there**, and that Agent 3's own inference path
does not carry it either. Neither was visible from the harness, which scores the trace.

### §10.3 THE TWO FIXES THIS BUYS, BOTH CHEAP AND BOTH TESTABLE WITHOUT A BOOK

1. **Agent 3: the inference step gets a shape, not a sentence.** One step whose `observation` IS the
   (c) trace, verbatim, with an `effect` in the narrowing form. Testable on `harness:agent3:direct`
   by comparing a step's observation to the trace — a check the harness does not yet make.
2. **Agent 5: the culprit-direct slot sources from the (c) trace when one exists.** The trace is
   identifiable by shape — weapon-first, culprit-last, in `constraint_space.physical.traces` — and
   the slot should cite that path and keep its first slot. Testable on `harness:agent5:direct`
   against this run's frozen CML by checking that the culprit-direct clue names the weapon.

### §10.4 TWO FINDINGS THAT ARE NOT ABOUT THE MEANS-LINK

- **The repetition is the locked-fact phrase.** *"at half past seven at night"* appears **ten times across
  six chapters**; the locked-fact gate warns *"Agent 9 will enforce via prose generation"*, and it did,
  verbatim. That is 8.8× the median on its own and it is book-wide, so a chapter-2 resume would not
  clear the read block. Locked-fact enforcement needs to accept a paraphrase of a clock time.
- **Agent 6's blind-reader gate was skipped again** on content filtering — the second run in a row
  with one fewer check than its summary shows.

### §10.5 WHAT IS AND IS NOT SETTLED

Settled: the block reaches production, the case links, the log says so at minute five, and the link
is lost at Agent 5 and unused by Agent 3's inference path. Not settled: whether a book whose reveal
rests on the trace reads better — that needs §10.3 built and a third run, and no run before then.


---

## §11 THE TWO FIXES FROM §10.3, BUILT AND MEASURED — AND A THIRD HOLE IN AN INSTRUMENT

**2026-09-24, £0.10.** Both fixes are shape-and-source changes; both were measured on the same
artefacts that showed the failure.

### §11.1 AGENT 3 — THE STEP THAT USES THE TRACE IS A SHAPE NOW

The block's closing sentence (*"ONE inference step lists (b) and (c) in its required_evidence…"*)
became entry (e), a YAML-shaped step whose `observation` is the (c) trace word for word and whose
`effect` is *"Narrows the pool to <the reachable names from (b)>"*. The classifier learned to score
USE: `usedInInferencePath` is true when a linking trace appears, normalised, in some step's
observation or required_evidence, and the verdict line says `[used by inference step N]` or
`[NOT USED by any inference step]` — in the harness and in the run log alike.

| | linked | used by a step |
|---|---|---|
| draft 8, re-scored offline (8 cases) | 8 of 8 | **0 of 8** |
| seed 6325, the paid run | 1 of 1 | 0 of 1 |
| draft 8 + step shape (4 cases) | 4 of 4 | **4 of 4** — steps 3, 3, 4, 4 |

**MEASURED.** The paid run's failure reproduces on the fixture at 0 of 8 and the shape moves it to
4 of 4. The three tests pinning it use seed 6325's own traces.

### §11.2 AGENT 5 — THE CULPRIT-DIRECT SLOT SOURCES FROM THE WEAPON-FIRST TRACE

`buildStrictDirectCulpritClue` now runs `provesTheAct` on the case; when a weapon-first trace names
the culprit, that trace's path is the FIRST allowed source, the weapon phrase (*"heavy iron poker"*)
is a required phrase, and the prompt shows the trace as the observable to write. The five restated
inline types became one `StrictDirectCulpritClue`.

**And the phrasing repair no longer overwrites.** It used to replace the whole clue with *"Direct
evidence ties X to the mechanism access point…"* whenever any required phrase was missing — on seed
61062 that erased a clue that had named the weapon. It now overwrites only when the culprit's name is
absent, and then restates the trace; a missing phrase is appended to `pointsTo`.

| | cites | names the weapon |
|---|---|---|
| seed 6325, the paid run | `cast[2].evidence_sensitivity[0]` ("forge tools") | no |
| harness, contract rebuilt from the same CML, run 1 | `constraint_space.physical.traces[1]` | **yes** — *"At Julian Carrick's forge, the heavy iron poker is found with disturbed dust and repositioned among tools"* |
| harness, run 2 | `constraint_space.physical.traces[1]` | **yes** |

**2 of 2 against 0 of 1. MEASURED**, on the frozen case, £0.02.

### §11.3 THE HARNESS HAD NEVER SENT THE CONTRACT

The first two harness runs produced **no culprit-direct clue at all**, and the reason is an instrument
defect of the A_103 B68/B69 family: production passes the strict structural contract to the prompt as
`strictContract` (`agent5-run.ts:3642`); the harness passed only `fairPlayFeedback`. The block that
carries the culprit-direct slot, the required ID→source mappings and the late slot **never reached
the model from the harness** — including in A_101 §15's three runs, which therefore measured the
retry-feedback path, not the first-attempt contract. The harness now builds the contract with
production's own exported `buildStrictPromptFeedback`; `--noStrict` opts out.

Third time in this document that "same as production" held for the inputs that were easy to see and
not for the one that shapes the prompt most. **When a harness claims to run production's prompt,
diff the two prompts once.**

### §11.4 STATE

Agent 3 links and uses; Agent 5 carries the weapon into the clue layer. Agents 7 and 9 have not been
re-measured and the reveal has not been re-read; a third run is what measures them. The read block
is unchanged: locked-fact enforcement puts the verbatim clock phrase in every chapter prompt
(A_104 §1), and that has to move before a reader sees any of this.


---

## §12 THE THIRD PAID RUN — SEED 18179. ALL THREE TESTABLE PREDICTIONS PASSED

| | |
|---|---|
| run id | `mystery-1790251239840` (second launch; the first, `mystery-1790250322380`, died at the novelty gate — A_104 §5) |
| project id | `canary_1790251239837` |
| seed | 18179 · temporal · mechanical clock tampering · Village 1920s dark · amateur detective · **classic** narrative · humour classic · 7 cast · angle: an ornithologist's bird sanctuary |
| cost | **$1.198**, plus roughly a tenth of a book for the lost first launch |
| status | warning |
| release gate | warning — `geometry unaccounted_time`, four clock readings nothing in the case accounts for |
| rubric (shadow) | **71 / 100**, raw 75 — the highest since 18 September; capped for *"mechanism explained too early"* |
| ship-check | repetition **22.8 per 10k — Normal** (median 17.3); chapter 1 fell to a completion fallback on unbalanced quotation marks; premature disclosure flagged in chapter 2 |
| words | 13,150 |

### §12.1 EVERY PREDICTION

| # | prediction | result |
|---|---|---|
| 1 | the log says PROVES THE ACT and names the step that uses the trace | **PASSED** — *"birdwatcher's knife: fresh handling marks and smudges found in barn — Gerald Thorne"*, `[used by inference step 4]`; the innocent's glove smudge in the garden shed, as designed |
| 2 | the culprit-direct clue names the weapon and cites the trace path | **PASSED** — cites `constraint_space.physical.traces[1]`; observable *"Fresh handling marks and smudges on the birdwatcher's knife in the barn match Gerald Thorne"*; the repair **appended** its two phrases to `pointsTo` instead of overwriting |
| 3 | the reveal rests on a physical fact tying culprit to weapon | **PASSED** — planted in chapter 5, *"Knife and Barn Evidence"*, and the reveal's eighth point: *"the birdwatcher's knife: last disturbed in the barn, bearing fresh handling marks that match Gerald Thorne's grip"*. No confession line carries the act |
| 4 | repetition below the resumed book's 5.9× | **PASSED on the instrument** — 22.8, normal; see §12.2 for what the instrument cannot see |

**The chain A_102 was written for runs end to end for the first time: Agent 3 authors the link and
uses it, Agent 5 carries it with its weapon, the outline plants it mid-book, the reveal rests on it.**
MEASURED on one book. Whether a reader then stops saying the trick does not prove the murder
physically is still the read, and this book cannot go to a reader yet: chapter 1 is a fallback chapter.

### §12.2 WHAT THE REPETITION INSTRUMENT CANNOT SEE

The ship-check counts repeated **six-word** spans. This run's locked values are three words —
*"quarter past ten"*, *"twenty minutes past nine"* — and they appear **15 and 13 times**, three
chapters carrying three each. The locked-once block asked for one statement per chapter where the
fact is evidence; that was not achieved here, and the instrument said Normal because the phrases are
short. Seed 6325's *"at half past seven at night"* was six words and registered. **So 22.8 is a true
number about six-word spans and not evidence that the once-per-chapter instruction held.** The honest
comparison is the phrase count: 10 on 6325, 7 on its resume, 13–15 here on a book a third longer.

### §12.3 WHAT NOW STANDS BETWEEN THIS BOOK AND A READER

- **Chapter 1 is a fallback**, on a boundary-integrity failure (unbalanced quotation marks) after three
  attempts. No chapter-level redo exists: `RESUME_REDO=prose` re-runs all ten chapters, and the
  checkpoint path keeps completed chapters, fallback included. A one-chapter redo is the cheapest
  instrument this project does not have.
- Chapter 2 names the culprit's guilt early (ship-check, measure only), and four clock readings are
  unaccounted for by the case (release-gate warning).
- Agent 6's blind-reader gate was skipped on content filtering for the third run running.


---

## §13 THE ONE-CHAPTER REDO — BUILT, AND THE SEED 18179 BOOK IS FIT TO READ

**2026-09-24.** Every book this month that was fit to read in every other respect was held back by one
fallback chapter, and the only instrument rewrote all ten. `RESUME_REDO=prose AGENT9_REDO_CHAPTER=N`
now rewrites one.

**How it works.** The prompt layer's resume model is a prefix: the checkpoint's chapters stand as 1..k
and generation continues from k+1. A redo of N is that model with three edits: the resume script hands
the project's Agent 9 checkpoint to the run (a resumed prose stage had never received one, so it always
started from scratch); the checkpoint loader accepts the original run's checkpoint under the redo env
(a resume has a new run id); and `generate.ts` keeps 1..N−1 as the prefix, caps the loop at N, and
splices N+1..end back in before the post-passes and ship-checks, which then see the whole book.
`planChapterRedo` is pure and pinned by three tests.

### §13.1 FIRST USE — CHAPTER 1 OF SEED 18179

| | original run | after the redo |
|---|---|---|
| chapter 1 | completion fallback after 3 attempts (unbalanced quotation marks) | **written in one attempt**, 11 paragraphs, every quotation balanced |
| chapters 3, 4, 5 | — | **byte-identical** |
| chapters 2, 6, 7, 8, 9, 10 | — | edited by the post-passes, 0–11 words apart |
| repetition | 22.8 per 10k | 23.5 per 10k, normal |
| shadow rubric | 71 | 72 |
| words | 13,150 | 12,678 |
| means-link | untouched: the case, the clue and the reveal are the same artefacts |

**Fit to read by this project's rules for the first time since the v2 reads:** no fallback chapter,
no WORTH A LOOK. The release gate still warns on four unaccounted clock readings; that is a warning,
not a block. Cost: one chapter's generation and the post-passes over ten — under £0.15, not itemised.

**The prediction that failed:** *"chapters 2 to 10 come back byte-identical."* Three did; six carry
small post-pass edits, because the atmosphere repair and polish run over the rejoined manuscript, as
designed. For a read that is nothing. For a strict matched pair on one chapter it is a confound, and a
`AGENT9_REDO_POSTPASS=kept-only` option would remove it. Not built; not needed for this read.

### §13.2 THE READ

Manuscript: `stories/story_20260924-1445/resumed_resume_1790257434755.md`. The read is the standard
external one: the manuscript pasted to the reader with the usual rubric, the reply saved as
`chatgpt-review.txt` beside the manuscript, and `node scripts/external-read-ledger.mjs --write` to
ingest it. **The prediction to check, stated four times by the reader before any of this work:** the
review does not say the trick fails to prove the murder in a satisfying, physical way. Secondary: the
`clues` mark, the project's lowest category at a September mean of 6.38, moves.


---

## §14 THE READ — 86, AND THE COMPLAINT THIS DOCUMENT WAS WRITTEN FOR IS GONE

**2026-09-24.** Seed 18179, chapter 1 redone (§13), read externally. **86 / 100** — the second-highest
September read and one under the project's best ever (87). Ledger row `story_20260924-1445`.

| category | mark | | category | mark |
|---|---|---|---|---|
| premise | 8 | | mystery clues / evidence logic | **8** |
| opening hook | 8 | | pacing | 8 |
| plot structure | 8 | | ending / reveal | 8 |
| character clarity | 8 | | prose / polish | 7 |
| dialogue | 8 | | character life / relationships | 8 |
| atmosphere / setting | **9** | | humour / wit | 8 |

### §14.1 THE PREDICTION, AND THE CATEGORY

**The reader does not say the trick fails to prove the murder physically.** Four consecutive earlier
reads did. This one says the opposite: *"The clock clue is also physically stronger than in several
earlier drafts,"* and lists *"knife smudges matching Gerald's handling"* among the key clues. The one
clock note left is which of two clock ideas explains the shift — a 55-minute rewind or a six-second
chime delay — and asks for *"one cleaner sentence"*, not for physical proof. **Prediction passed.**

**`clues` scored 8**, against a September mean of 6.38 and a v2 ceiling of 7 (§1). It is the category
this document said was capped by presence-not-act, and it moved by the amount the reader's own
ceiling estimate implied.

The shadow rubric said 72; the read said 86; the offset is 14, inside A_104's measured band of 7–17.

### §14.2 THE INJECTOR AUDIT — 5 OF 10 NAMED LINES ARE OURS, AND THE AUDIT IS NOT OVER

CLAUDE.md: until a read names no injector, a read is an injector audit. This one names ten scaffold
lines; the code was grepped for each:

| line the reader quoted | where it lives |
|---|---|
| *"set out one competing theory against the other"* | `agent9-prose/deterministic-repair.ts:497` — the DT residue injector |
| *"Nobody in the room could unsee what had just happened"* | `deterministic-repair.ts:512–513`, same injector |
| *"However the moment was turned over"* | same |
| *"answer as brief as the fading light"* | `obligation-block.ts:352` — quoted in PROMPT TEXT as a past failure |
| *"the evidence was mounting"* | `prompt-builder.ts:2376` — quoted as a NEGATIVE EXAMPLE in rule 10 |
| *"walk the evidence"*, *"room held its breath"*, *"weight of truth settling"*, *"pattern remained elusive"*, *"final connection remained just out of reach"* | not in the code — the model's own |

**MEASURED.** Two fix classes, both known: the discriminating-test residue injector's paragraphs are
being quoted back for the THIRD read (A_81 §13, A_82 §14.3, now) — the wording was rewritten once and
it still reads as machine text, so the fix is to stop shipping a deterministic paragraph and insert it
by LLM regen the way locked facts now are; and **a phrase quoted in a prompt as something not to
write is written** ([[a-prohibition-does-not-steer-this-model]], A_67) — both quoted examples should
go, the rule stated without them. Neither is built.

### §14.3 THE READER'S FASTEST FIXES, MAPPED

| the reader asks for | the lever |
|---|---|
| one clean sentence relating the 55-minute shift to the 6-second chime | A_82 §14.4's three-or-more-same-dimension clarity, which fires only at 3+ values; this case has two of different dimensions |
| cut chapter 9's *"First, second, third…"* proof list after chapter 8's confession | the reveal contract's enumerated proof — the same list §12.1 used as evidence that the link reached the reveal; it did, and the reader wants it once |
| seed Gerald's motive earlier with a personal scene | craft; the motive plant lands on scene 7 by the motive-plant-before-reveal rule |
| remove the scaffold phrases | §14.2 |
| a missing closing quotation mark in chapter 9 | present in the original run too — a boundary-integrity slip in a kept chapter, not the redo's |

*"With Chapter 9 trimmed, the clock logic clarified, and Gerald's motive seeded earlier, this could
reach 90–92."* That is the reader's estimate of their own suggestions, as it was at 86–91 in §5, and
it settles nothing about the mark ([[rubric-cannot-rank-two-books]]). What is settled is the thing
this document set out to settle: **the case now proves the act, and the reader saw it.**

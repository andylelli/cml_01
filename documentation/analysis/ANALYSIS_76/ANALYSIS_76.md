# ANALYSIS_76 — the five things between us and 90, and what to actually build

**Written:** 2026-08-29 · **Trigger:** owner's request — *"tell me what the big 5 issues are in preventing us
from getting to 90"*, then *"write analysis 76 to discuss how we can implement fixes for these that will
improve the score"*.

**Type:** an IMPLEMENTATION PLAN. [A_75](../ANALYSIS_75/ANALYSIS_75.md) found the defects; this decides what
to build for each, what it costs, and — the part that matters most — **how we would know it worked**.

**Method note, carried from A_71:** every claim is **MEASURED**, **INFERRED** or **ASSUMED**, and labelled.
The rule this project has paid to learn: *a negative result from a probe you just wrote is a claim about the
probe.* On 2026-08-29 four separate "the flag is broken" findings all turned out to be the harness.

---

## 0. The through-line, stated first

> **Four of the five issues are downstream of one: we cannot measure whether a change worked.**
> The rubric cannot rank two books, a single read is ±3 marks, and book-level A/B is priced between £502
> and £18,582. Ten flags are built and unrun for exactly this reason. **Everything in this document is
> ordered so that the measurement fix comes first**, because without it the other four fixes are
> hypotheses that will still be hypotheses in a month.

---

## 1. The arithmetic — how far away 90 actually is

**MEASURED**, n=43 reads with all ten categories.

```
best single-book category sum ever :  83
best-ever-everywhere (max of each  :  85
offset (headline - sum)            :  mean 4.0, best 8, top five 8,7,7,6,6

to reach 90 you need sum + offset >= 90
   at offset 4  ->  sum 86      (never achieved; best 83)
   at offset 6  ->  sum 84      (one mark above the best ever)
   at offset 8  ->  sum 82      (already achieved — twice)
```

**This is closer than "you need a record" suggests.** A book that scored 83 with an offset of 7 lands on 90,
and offsets of 7 and 8 have both happened. The realistic target is **sum 84–85 with a good offset** — one to
two marks above the best book we have ever produced.

Where can those marks come from? Only from a category that can give a 9:

```
how often each category reaches 9        (n=43)
  premise            26%  (11)      opening_hook        0%
  atmosphere          9%  (4)       prose               0%
  clues / ending      5%  (2)       dialogue            0%
  plot_structure      2%  (1)       pacing              0%
                                    character_clarity   0%
```

**Five categories are 0-for-43.** They are not weak marks, they are a ceiling. The top book already holds
four 9s (premise, plot_structure, clues, ending) and still sums to 83.

---

## 2. ISSUE 1 — we are optimising the category that cannot pay

**MEASURED.** `prose` receives the effort because it has the lowest mean (5.8). But it is 0-for-43 at a 9,
and its only axis is the one prompting cannot move (§4). `atmosphere` has the **highest top-8 of any
category (8.5)**, reaches 9 in 9% of books, and carries **no reader complaint at all**. Our best book scored
8 there.

**Lowest mean is not the same as easiest marginal mark.**

So: what separates the four atmosphere-9 books from the thirteen that scored ≤7?

```
                    atmos 9 (n=4)   atmos <=7 (n=13)   diff
  register rate         10.29%          17.00%        -6.70
  total words           12,942           8,592        +4,350
  colour words /1k        2.17            0.88         +1.29
  dialogue share         15.41%          14.12%        +1.29
  sensory verbs /1k      10.42           10.90         -0.48
```

**Two findings, and the second is the more useful.**

1. Atmosphere runs on the SAME axis as prose — abstraction, −6.70 points. That is not a disappointment: it
   means the abstraction work already planned pays off in a category that *can* return a 9, which prose
   cannot.
2. **Sensory-word density does not distinguish them at all** (10.42 vs 10.90). This is the fix any craft
   intuition reaches for first — *"add more smells and textures"* — and it is **falsified**. Do not build it.
   The colour-word gap is real but n=4 and is offered as a hypothesis, not a finding.

### FIX 1 — retarget at atmosphere, and say so out loud

- **Build:** nothing new. Redirect the abstraction work (§5) and read the result against `atmosphere` as well
  as `prose`.
- **Cost:** £0. It is a change of what we look at.
- **Falsifier:** abstraction drops and `atmosphere` does not move. That is a real possibility at n=4 and it
  would tell us the −6.70 is a confound of length.
- **Caveat, stated plainly:** the length gap (+4,350 words) is very likely confounded — short books are
  probably truncated or failed runs, not deliberate choices. Do NOT read this as "write longer books"; §5.3
  found longer *chapters* are MORE abstract, and the two must not be conflated.

---

## 3. ISSUE 2 — we cannot tell whether a change worked. **Fix this first.**

**MEASURED.** No judge separates our 86 from our 81 (spread 7–8). A single external read carries ±3 marks.
And every effect we have measured is chapter-level, so it dilutes across a book:

```
flag                        chapter effect   share of book   book effect   pairs   cost
AGENT9_AFTERMATH_GROUNDING       6.2 pts       1 ch in 10        0.62        251    £502
AGENT9_LENGTH_COUNTERPRESSURE    2.0           25% of chs        0.50        386    £772
AGENT9_RECAP_STRIP_INJECTED      1.6           6% of chs         0.10       9291    £18,582
```

Book-level A/B is not merely expensive, it is **impossible at this budget**. That is why ten flags are built
and unrun, and it is the single biggest thing standing between us and knowing anything.

### FIX 2a — measure on the affected chapters, not the book (the 10× win)

The same effects, measured where they happen and paired on the same chapter:

```
AGENT9_AFTERMATH_GROUNDING     4 books   ~£8    <- affordable and powered
AGENT9_LENGTH_COUNTERPRESSURE 11 books   ~£22   borderline
AGENT9_RECAP_STRIP_INJECTED   52 books   ~£104  not affordable
```

- **Build:** a chapter-level matched-pair harness. `RESUME_REDO=prose` already re-runs prose against
  byte-identical upstream; what is missing is regenerating **one chapter** two ways and comparing. Agent 9 is
  94% of run cost, so a single-chapter redo should be ~1/10 of that.
- **Cost:** free to build, ~£0.10 per chapter-pair to run.
- **Evidence standard it buys:** a paired within-chapter comparison on the register rate — no between-book
  variance, no confound from chapter position or clue load.
- **Falsifier:** the harness cannot hold upstream constant, so pairs differ for reasons other than the flag.
  Check by running a pair with the flag OFF on both arms; a non-zero delta there is the noise floor.

### FIX 2b — stop buying cheap instruments; buy one forced-choice read

**MEASURED (A_75 §M1.2):** the pairwise/ordinal judge beat the cardinal judge decisively (p=0.003) and is
still a coin flip on 5-mark gaps. The lesson was *stop buying cheap instruments, read a matched pair.*

- **Build:** a one-question read protocol. Not the ten-category rubric — a forced choice on ONE dimension:
  *"which of these two endings repeats itself more?"* A forced choice between two texts is far more sensitive
  than two independent 1–10 scores, because it removes the scale-calibration noise that makes ±3 marks.
- **Cost:** the owner's time, ~10 minutes per pair. No money.
- **Why it beats everything else here:** it is the only instrument that can attribute a change to a *reader
  experience* rather than to a proxy. **Four of A_75's five findings rest on the proxy.**

### FIX 2c — write the noise floor down

- **Build:** run the register probe over the 43 read books and record the SD of the residual after
  controlling for the mark. Any future A/B delta smaller than that is unmeasured, and should be reported as
  unmeasured rather than as a small effect.
- **Cost:** £0.
- **Why:** we have repeatedly been one confident sentence away from claiming a null as a win.

---

## 4. ISSUE 3 — there is one axis, and prompting cannot move it

**MEASURED.** A 16-statistic sweep against the human marks found exactly one independent predictor:

```
register rate @3   -0.471 vs prose   -0.638 vs HEADLINE   (crit 0.299)
```

Both apparent rivals dissolved under partial correlation controlling for it. Dialogue share, mean sentence
length and sensory-verb density have **no relationship to the mark at all**.

And the obvious lever is **falsified**. `AGENT9_VOICE_SPEC` reached every chapter prompt asking for 22.0
words per sentence:

```
committed spec 22.0   ->   book delivered 15.86   ->   0/10 chapters met the bar
decay: ch1 19.7 -> ch6 13.6 -> ch10 17.7      corpus mean 15.6
```

**This model complies with OPERATIONS and ignores STATISTICS.** Settled within one run, no control needed:
the prompt asked for a number and the book returned the corpus mean.

### FIX 3 — convert the statistic into operations

This is the central design move of this document, and it follows directly from the VoiceSpec result. We
cannot ask for a *rate*. We can ask for *things done*. The register score is four features; each has an
operational form:

| the statistic (ignored) | the operation (complied with) |
|---|---|
| "write less abstractly" | "every scene contains one object a character physically handles" |
| "avoid propositional subjects" | "no paragraph may END on a sentence whose subject is an abstract noun" |
| "fewer stative verbs" | "each chapter contains at least three sentences whose verb is a physical action by a named character" |
| "be concrete" | "name the object before naming what it means" |

- **Build:** replace the rate-based steer with a small set of countable obligations in the chapter contract,
  each one checkable by a deterministic validator so the regen loop can enforce it. Flag-gated,
  `AGENT9_CONCRETE_OPERATIONS`.
- **Cost:** free to build; measured with FIX 2a at ~£0.10/chapter-pair.
- **Evidence it already has:** **INFERRED, and this is the weakest link in the document.** We know operations
  are complied with (semicolons moved 5→13 when asked) and statistics are not (VoiceSpec). We do NOT know
  that these particular operations lower the register rate.
- **Falsifier, and it is a real risk:** the operations are satisfied *mechanically* — the model appends a
  concrete clause to an otherwise abstract sentence and the rate does not move, or moves while the prose gets
  worse. **Check the delivered sentences, not just the count.** This is exactly how the injection machinery
  became a defect (§5).

---

## 5. ISSUE 4 — the pipeline manufactures the defect it is marked down for

**MEASURED**, five separate mechanisms:

| mechanism | evidence | state |
|---|---|---|
| **The retry loop.** The final attempt discarded the draft and rewrote from a constraint list. Prose written from a list of constraints reads like one. | rho 0.183 over 323 chapters; dose-response 10.35 / 11.10 / **13.74**% at 1/2/3 attempts, peaking where the branch fires; back half +2.43 pts, t=2.97 | **FIXED** behind `AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT` |
| **Our own injections.** | +2.49 pts raw; **+1.58 after removing the injected sentences themselves**, t=2.80 | `AGENT9_RECAP_STRIP_INJECTED` built, unrun |
| **A one-way length ratchet.** `wordScore` is 35% of the provisional score and rolls forward 4 chapters. | rho 0.121, n=1,831, survives every control | `AGENT9_LENGTH_COUNTERPRESSURE` built, FIRED in the 08-29 run |
| **A finale with nothing to deliver.** | 6.2 pts more abstract with no clue obligation, t=4.47 | `AGENT9_AFTERMATH_GROUNDING` built, FIRED in the 08-29 run |
| **The clearance register.** Both final chapters argue the case in 61% of books — 6% before we built it. | 195 books by month: 6 / 76 / 87 / 61% | two fixes ON; trim blocked, see below |

### FIX 4a — turn on what is already built and verified

All five prompt-visible flags were verified to fire, for £0, by driving each at its own gate. Three then
fired in a real run. **The work is done; what is missing is the decision to run with them on** and the
instrument from FIX 2 to read the result.

### FIX 4b — the clearance trim is gated on the wrong quantity

**MEASURED.** `trimRedundantClearances` acts only when a chapter EXCEEDS a volume budget
(`overBy = located.length - maxSentences`). The offending Ch10 of `story_20260829-1041` carries 4 clearance
sentences against a budget of 5, so it ships untouched — while chapter 9 already cleared all three suspects
and chapter 10 re-clears two of them.

The reader's complaint is not volume, it is redundancy: *"still unnecessary after Chapter 8."*

```
today, gated on volume      : 2 sentences removed across 22 books
gated on redundancy instead : 2 sentences — both in the final chapter, both correct
```

**CORRECTED 2026-08-29 (same day).** This section first claimed **9** sentences. That figure was
measured before the role filter and counted the DETECTIVE as a cleared suspect: it would have deleted
narrative lines such as *"Eleanor let the silence linger, the air thick with the knowledge that order
had..."*, which is not a clearance at all — it merely names her near clearance language. Two of the
four removals in the first corrected measurement were this. With victim and detective excluded (via
`roleTextsOf`, covering the X50 camelCase trap) the true figure is **2**, and both are genuine
re-clearances of Beatrice Quill in chapter 10.

**So the honest size of this fix is small.** It removes the right sentences instead of the wrong ones,
and it no longer risks deleting detective prose — but it does not on its own repair the ending. Three
of the four repetitive sentences in that chapter name nobody (*"You're cleared, Captain."*, *"Cleared
by the timeline..."*) and can never be PROVEN redundant, so a deletion-based fix cannot reach them.

- **Build:** apply the budget to the REDUNDANT clearances rather than to all clearances. The safety argument
  is unchanged and already in the docstring: a suspect's FIRST clearance is never removable, so **coverage
  cannot be lost by construction**.
- **Cost:** small change, £0 to verify (deterministic, runs on stored prose).
- **Note:** a related detector bug was fixed on 2026-08-29 — `namesIn` matched surnames only, so only
  **30 of 174 (17.2%)** clearance sentences could be attributed to a suspect at all, and Golden Age prose
  names women by their given name almost exclusively.
- **Falsifier:** removing 9 sentences across 27 books does not change any reader's view of the ending — which
  is entirely possible, and is what FIX 2b exists to determine.

### FIX 4c — do not add a sixth mechanism

**ASSUMED, but strongly.** Every item in the table above was built to fix something and became a defect of
its own. The clearance register is the clearest case: it took both-chapters-argue-the-case from 6% to 87%.
**Any new deterministic injection should be treated as a probable future entry in this table** and needs a
falsifier written before it is built, not after.

---

## 6. ISSUE 5 — five categories have never reached 9, and no detector has ever moved them

**MEASURED.** `opening_hook`, `prose`, `dialogue`, `pacing`, `character_clarity`: 0-for-43. Three of them
(hook, character, pacing) have **no reader complaint attached** — they are marked 8 by a reader who is not
objecting to anything. There is nothing to detect and therefore nothing a detector can fix.

### FIX 5 — stop trying to fix them, and route around

- **Do not build** hook/pacing/character detectors. A category the reader does not complain about cannot be
  raised by removing a defect; A_75 §1 established that this reader's marks respond to absence-of-defect only
  up to 8, and the ladder stops there.
- **Do** take the marks from `atmosphere` (§2), which is one mark from a 9, has a 9% base rate, and responds
  to the axis we are already working on.
- **INFERRED:** the 8-ceiling on the five silent categories is a property of *this reader's scale*, not of the
  manuscripts. If so it is unfixable from inside the pipeline, and the only route to 90 is the five
  categories that DO give 9s. This is the single most important open question in the document and FIX 2b is
  the only thing that can answer it.

---

## 7. The order, and what it costs

| # | do this | cost | answers |
|---|---|---|---|
| 1 | **FIX 2a** — chapter-level matched-pair harness | free to build, £0.10/pair | makes every other fix measurable |
| 2 | **FIX 4b** — regate the clearance trim on redundancy | free | a named reader complaint |
| 3 | **FIX 2c** — write down the noise floor | free | stops us claiming nulls as wins |
| 4 | **FIX 3** — concrete operations instead of a rate | free to build | the only untested lever class left |
| 5 | **FIX 4a** — run with the built flags on | ~£1/run | five measured mechanisms |
| 6 | **FIX 2b** — one forced-choice matched-pair read | owner's time | whether ANY of it moves a reader |
| 7 | **FIX 1** — read the result against atmosphere too | free | whether the marks are reachable |

**Total money: about £1 plus a handful of £0.10 chapter pairs.** The expensive item is not money, it is the
owner's reading time in FIX 2b — and it is the only item that can convert a proxy result into a score result.

---

## 8. What would falsify this whole document

1. **The register rate stops predicting the mark** as n grows past 43. It is one instrument carrying almost
   the entire argument, at rho −0.638. Re-run `scripts/prose-feature-sweep.mjs` after every new read.
2. **Concrete operations are satisfied mechanically** (§4) and the rate does not move — which would leave the
   project with no lever on its only axis.
3. **The 8-ceiling is the reader's scale** (§6), in which case atmosphere will not give a 9 either and 90 is
   not reachable with this rubric and this reader.
4. **The offset turns out not to be independent** of the category sum. Every projection here assumes a book
   with sum 84–85 can draw an offset of 5–7; if high sums systematically draw low offsets, the arithmetic in
   §1 is wrong and 90 is further away than it looks.

**The honest summary:** we have one validated instrument, one axis, one falsified lever class, five
self-inflicted mechanisms of which one is now fixed, and no affordable way to read a result. Fix the reading
problem first. Everything else in this document is a hypothesis until then.

---

## 9. PRE-REGISTRATION for the two paid runs · written 2026-08-29 BEFORE spending

Written before the money is spent, so the conclusion cannot be fitted to the result.

### 9.1 The noise floor, measured — and it changes the design

**MEASURED** on the existing 08-27 matched pair (`story_20260827-2005` vs `-2019`), which shares
byte-identical upstream and differs only in the prose stage:

```
per-chapter paired differences:  -9.94  -6.35  +5.69  +10.11  +3.06  -0.19  -6.90  +6.42  -8.04
paired mean difference : -0.68 points
sd of differences      :  7.35     n=9
minimum detectable effect at 80% power: 6.86 points
```

**A ten-chapter matched pair can only resolve a ~7-point register change.** The abstraction flags are
worth 1–2. Chapter-to-chapter model variance swamps them: chapter 4 swung 2.86 → 12.96 with no flag
touching it.

**So the register proxy CANNOT adjudicate this pair, and FIX 2a as originally written is wrong.**
Pairing removes between-book variance but not the model's own chapter-to-chapter variance, which is
the larger term. This is exactly the kind of claim §0 warned would otherwise be made on a proxy.

### 9.2 What the two runs are therefore FOR

Not a measurement. **A forced-choice read** (FIX 2b) — the instrument A_76 already argued was the only
one that attributes a change to a reader rather than a proxy.

- **Design:** one project, `canary_1787994697592`, prose regenerated twice from byte-identical
  upstream. Arm A = today's flags. Arm B = arm A + `AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT`,
  `AGENT9_CLEARANCE_TRIM`, `AGENT9_RECAP_STRIP_INJECTED`.
- **Cost:** ~£1 per arm.
- **Primary instrument:** the owner reads both endings and answers ONE question —
  *"which of these two endings repeats itself more?"* — without being told which arm is which.
- **Secondary, descriptive only:** the per-chapter register table. **It is not a test.** Any delta
  below 6.86 points is reported as UNMEASURED.

### 9.3 What each outcome will mean — decided now

| forced-choice result | conclusion | next |
|---|---|---|
| B's ending reads less repetitive | the deterministic trim + draft retention do something a reader notices | keep both on; spend the next pair on the concrete-operations lever (§4) |
| no perceptible difference | the fixes are real but sub-threshold for a reader | stop spending on ending repetition; it is solved enough |
| B reads WORSE | most likely `FINAL_ATTEMPT_KEEPS_DRAFT` anchoring the model to its own failed draft — the falsifier named in A_75 §16 | revert that flag, re-pair with only the trim |

**Committed in advance:** a null on the register table will NOT be reported as evidence for or against
anything, because §9.1 establishes it could not have detected the expected effect.

### 9.4 Free work completed before spending

1. **Pair mechanism dry-verified** — `agent9-replay` reaches prose generation with the arm-B flags set,
   against a recording stub, £0.
2. **`AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT` rehearsed — AND IT WAS A NO-OP.** The batch path attached the
   prior draft only when `attempt < maxBatchAttempts`, which is false on exactly the attempt the flag
   targets. The boolean flipped and nothing reached the model. **Both arms would have been identical
   and the £2 would have bought a guaranteed null.** Fixed: the strategy is now the only authority.
3. **Pre-registration** — this section.
4. **Noise floor** — §9.1, and it redirected the entire design.
5. **Clearance trim regated** — and caught deleting the DETECTIVE's narrative lines; now suspects-only.
6. **Paired reader built** — `scripts/read-matched-pair.mjs`, which reports its own minimum detectable
   effect so a null cannot be misread as an absence.

**Two of the six free items changed the plan rather than supporting it.** That is the argument for
doing free work first.


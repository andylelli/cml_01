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

> ### ⚠ CORRECTED 2026-08-29, LATER THE SAME DAY — read this before the table above
>
> **The −6.70 is inflated, and finding 1 below does not survive.** Seven of the thirteen books in the
> `atmosphere ≤7` group are TRUNCATED (under 8,000 words — mean 8,592 against the atmosphere-9 group's
> 12,942). Truncated books score badly on everything, so they manufacture a register gap that is really
> a length gap.
>
> Excluding them the group difference does survive — **−5.10 points, Welch t = −3.77** — but at n=4
> versus n=6. And the test that matters more, a rank correlation across every read:
>
> ```
> register rate vs atmosphere :  0.006   (all 43)      -0.004  (36 non-truncated)   NOT SIGNIFICANT
> register rate vs headline   : -0.593                 -0.697                       SIGNIFICANT
> register rate vs prose      : -0.417                 -0.444                       SIGNIFICANT
> ```
>
> **Register does not predict atmosphere.** It predicts the headline and `prose`, and removing the
> truncated books makes BOTH of those stronger — so the instrument itself is sound and was never a
> truncation artifact. But the mechanism claimed in finding 1 is not established.
>
> **What survives of FIX 1:** the *arithmetic* case only. `atmosphere` reaches 9 in 9% of books and
> `prose` never has in 43 reads, so a marginal mark is likelier there. What does NOT survive is the
> claim that the abstraction work will deliver it. Retarget if you like the odds; do not expect the
> register lever to be what moves it.

**Two findings, and the second is the more useful.**

1. ~~Atmosphere runs on the SAME axis as prose — abstraction, −6.70 points.~~ **WITHDRAWN — see the
   correction above.** The gap is half truncation artifact, and the correlation across all reads is
   0.006.
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

---

## 10. THE TRUNCATION CONFOUND — solved in the pipeline, still live in the analysis

**MEASURED 2026-08-29.** Eight of the 43 read manuscripts are under 8,000 words (3k, 5k, 7k, 8k, 6k,
2k, 7k, 6k). They score catastrophically and uniformly badly:

```
                 truncated  normal   diff          headline  59.4 vs 76.4   = -17.1
  character_clarity   4.4     7.1    -2.7
  ending              4.8     7.3    -2.5
  prose               4.1     6.1    -2.0
  pacing              5.5     7.5    -2.0
  atmosphere          6.0     7.9    -1.9
  ...every category down, none by less than 0.8
```

**The pipeline problem is FIXED and was fixed a while ago:**

```
books under 8k words, by month (all 197 stored manuscripts)
  202605   9/19   47%
  202606  11/42   26%
  202607   0/105   0%
  202608   0/31    0%
```

**The ANALYSIS problem is not.** Those eight books sit in every correlation this project computes
against the ledger, and because they are short AND bad they manufacture a relationship between the
mark and anything that tracks length. Two claims made today were affected:

| claim | with truncated books | without | verdict |
|---|---|---|---|
| pacing improves with book length | rho **+0.487** | rho **+0.085** | **artifact — withdrawn** |
| atmosphere runs on the abstraction axis | −6.70 points | −5.10 (n=4 v 6), rank rho **0.006** | **weakened to arithmetic-only, §2** |
| register predicts the headline | −0.593 | **−0.697** | **survives, and strengthens** |
| register predicts prose | −0.417 | **−0.444** | **survives, and strengthens** |

**The rule this establishes:** every correlation against the external-read ledger must be recomputed
with `words >= 8000`, or it is measuring May and June's failed runs. The register instrument is
vindicated by that test rather than damaged by it — which is exactly why the test was worth running on
the project's own favourite finding first.

### 10.1 What this does NOT mean

It does not mean "write longer books". Among the 35 non-truncated manuscripts, length predicts pacing
at 0.085 — nothing. The truncated books are failed runs, not deliberate short ones, and A_75 §13.5
found longer *chapters* are MORE abstract. Length is a symptom of failure at the low end and not a
lever anywhere.


---

## 11. PLAN — fully resolving the chapter 9/10 defect

**Trigger:** owner, after the third external read making the same complaint —
*"Chapter 10 does not reveal the culprit. It re-clears Beatrice, Sylvia, and Hugo almost line by
line."*

### 11.1 The chain, end to end

**MEASURED.** Six links, and only the last two have been touched:

```
1. GOLDEN_AGE_BEATS has no `aftermath`         beat-scheduler/src/schedule.ts:25
     gathering, crime, first_enquiries, motives, alibis,
     false_solution, secrets, pattern, final_trap, revelation
   Ten beats, ten chapters, and the last is ALWAYS `revelation`.
   There is no vocabulary in which a chapter can BE an aftermath.

2. The scheduler is SHADOW-ONLY — it computes a clean positional grid and logs it;
   the LLM's beats are what ship. `AGENT7_SCHEDULER_AUTHORITATIVE` is default OFF.

3. So Agent 7 assigns beats freely, and duplicates them: 43% of outlines end on two
   consecutive identical beats. story_20260830-1850 had ch8 AND ch9 both `final_trap`.

4. The reveal actually lands earlier than the outline says — the confession was ch8.

5. Agent 9's aftermath contract fires on ch10 and forbids re-revealing, while the
   outline hands the same chapter a scene titled "The Culprit Revealed".
   Told to reveal and not to reveal, the model does the one thing neither forbade.

6. The title the model returns is printed verbatim as the chapter heading.
```

**Links 5 and 6 are patched (§11.2). Links 1–4 are untouched, and they regenerate the
contradiction on every run.**

### 11.2 Phase 0 — DONE, and it is mitigation not repair

Agent 9 prompt prohibitions: no re-clearing (banned sentence shapes named), no roll-call
(requirement 4 narrowed so it stops inviting the tour), scene title superseded, and a ban on
reveal-promising titles in the returned `title` field. Plus `scripts/check-ending-repetition.mjs`,
a detector — never a gate, because a lint issue drives a retry and retried chapters run +2.43
register points more abstract.

**What Phase 0 cannot do:** it instructs the writer to resolve a contradiction we are still
creating. Compliance is likely, not guaranteed, and nothing upstream changed.

### 11.3 Phase 1 — give the vocabulary an aftermath beat · FREE

- **Change:** add `aftermath` to `GOLDEN_AGE_BEATS`. Eleven beats do not fit ten chapters
  positionally, so `pattern` is dropped — **it is already the beat the LLM skips**
  (story_20260830-1850 used every other beat and no `pattern`), which makes it the cheapest
  casualty and is evidence rather than preference.
- **Also:** `beat: N === 10 ? GOLDEN_AGE_BEATS[i] : undefined` means **any book that is not exactly
  ten chapters gets NO beats at all.** Fix in the same change or defer explicitly.
- **Risk:** the beat enum is validated downstream; a new value must reach every coercion map or
  Agent 7 retries burn on it — the A_67 beat-enum lesson, *coerce before validating, or one bad
  field costs the whole call.*
- **Verify:** free. Re-run the scheduler over stored cases; confirm ch10 draws `aftermath` and no
  consecutive duplicates appear.

### 11.4 Phase 2 — stop the duplicate beat · FREE

- **Change:** reject consecutive identical beats in Agent 7's COERCION step, mapping the second to
  the next unused beat rather than failing the outline. 43% of books need this.
- **Why coercion, not validation:** a validation failure costs an Agent 7 retry; a coercion costs
  nothing.
- **Verify:** free, over the 28 stored outlines.

### 11.5 Phase 3 — derive the contract from the beat · FREE

- **Change:** the aftermath contract requires `currentStageMode === 'aftermath_consequence'`, a
  value computed elsewhere. Once a chapter's beat IS `aftermath`, derive the stage mode from it so
  the two cannot disagree.
- **Then:** the outline stops promising a reveal in the chapter the contract governs, and §11.2's
  "the title is superseded" line becomes redundant rather than load-bearing. **Leave it in** — a
  redundant guard costs nothing and this defect has recurred three times.

### 11.6 Phase 4 — the honest verification

The detector's baseline is already recorded, and it is uncomfortable:

```
last 10 books    suspects cleared in BOTH final chapters : 9 of 10 have 3+
                 reveal-promising final title            : 8 of 10
                 clearance sentences in the final chapter:
                     0  1  2  2  2  3  3  3  3  5
```

**The 85-scoring book is in that list**, with the same ch9 "Clearing the Innocent" / ch10 "The
Culprit Revealed" pairing. So this is not a defect that separates a bad book from a good one — it is
near-universal, and the complained-about book simply had MORE of it (5 against a median of 2–3).

**Success criterion, fixed in advance:** the final chapter carries **zero** clearance sentences and a
title matching none of the banned words, on two consecutive runs. Not "fewer" — the point of a
structural fix is that the state becomes unreachable rather than rarer.

**What would falsify the plan:** the beat changes land, the contract fires from the beat, and the
model still walks the suspects — which would mean the roll-call comes from something other than the
contradiction, most likely requirement 4 or the reveal chapter's own gravity.

### 11.7 Order and cost

| phase | what | cost |
|---|---|---|
| 0 | Agent 9 prohibitions + detector | done, £0 |
| 1 | `aftermath` in the beat vocabulary | £0 to build and verify |
| 2 | no consecutive duplicate beats | £0 |
| 3 | derive stage mode from the beat | £0 |
| 4 | one run, read the detector | ~£1 |

**Everything before the run is free.** That matters more than usual here: three of today's fixes
turned out to be no-ops, and the only reason we know is that they were driven at their own gates for
nothing before any money was spent.

---

## 12. THE CH9/10 PLAN, REVISED — two of my own hypotheses died first

**Trigger:** owner — *"think harder about how we can fix it properly. Think of everything inside and
outside the box."* Good instruction: §11 was written from one theory and I had not tested it against
the alternatives. Two of them are now dead, and one of the dead ones was the obvious fix.

### 12.1 What I tested, and what died

**HYPOTHESIS A — the finale is asked for words it has no material for, so it pads with the only
thing available: the suspects.** It fit §13.4 (chapters with no clue obligation are 6.2 points more
abstract) and it felt right.

**FALSIFIED.** Over 27 books joined to their outlines:

```
final chapter with ZERO clues to reveal (n=15): 2.93 clearance sentences
final chapter WITH clues                (n=12): 2.75
difference 0.18, Welch t = 0.18 — nothing
```

And the reason it is wrong is visible in the same data. Final chapters are targeted at **2,247 words
and deliver 1,022** — under half. **The model is not padding to fill a space; it under-writes and
stops.** Any fix premised on "it has too much room" is aimed at a thing that is not happening.

**HYPOTHESIS B — a dedicated "Clearing the Innocent" chapter before the finale is the problem, so
fold the clearances into the reveal.** This is the obvious structural fix and it is what
`AGENT9_FOLD_SUSPECT_CLEARANCES` (currently ON) exists to do.

**FALSIFIED, AND INVERTED:**

```
penultimate chapter IS a clearing chapter (n=24): 2.29 clearance sentences in the FINALE
penultimate chapter is NOT                (n= 3): 7.33
difference -5.04, Welch t = -2.79   SIGNIFICANT
```

**A dedicated clearing chapter HELPS.** When ch9 clears properly, ch10 does it three times less.
Remove it and the finale inherits the whole job. The obvious fix makes the defect worse, and a flag
we currently have ON is steering toward the worse arm. (n=3 on the good side is thin, and the
direction is what matters.)

### 12.2 What that leaves

The roll-call is **not** caused by an empty finale, and **not** caused by having a clearing chapter.
Two candidates remain, and they are not exclusive:

1. **The contradiction** — the outline titles ch10 a revelation while the contract forbids
   re-revealing (§11.1). Untested, cheap to remove.
2. **Nothing rewrites what survives.** Every repair this project owns either DELETES (the clearance
   trim, which cannot touch sentences that carry other content) or REGENERATES (the retry loop,
   which costs +2.43 register points). Neither can take a sentence that half-works and fix it.

### 12.3 The change that follows — a polish pass scoped to the finale

`polishPassingChapter` (post-pass-polish.ts) is a validator-gated LLM line-edit with rollback that
runs on chapters which have ALREADY PASSED. It is the only mechanism in the pipeline that can
**rewrite** rather than delete or regenerate, and it does not enter the retry loop — so it carries
none of the abstraction cost that made a lint gate unusable here.

- **Change:** run it on the final chapter with one instruction — remove clearance, alibi and
  corroboration language, keeping everything else. Rollback on any validator regression, as today.
- **Why this and not the trim:** the offending sentences are not redundant clearances that can be
  deleted. *"Vane, your suite log and the staff statement from the girl who brought your tea confirm
  your isolation"* carries staging and character. It needs rewriting, which is exactly what deletion
  cannot do and what this pass is for.
- **Cost:** one extra LLM call per run (~£0.02), only on the final chapter.
- **Falsifier:** the polish rewrites the sentences and the reader still sees a roll-call — which
  would mean the repetition is structural (who appears, in what order) rather than lexical, and only
  the beat work in §11 can reach it.

### 12.4 Re-score the fold flag

`AGENT9_FOLD_SUSPECT_CLEARANCES` is ON and its premise is contradicted by §12.1. **Caveat, stated
because it matters:** the measurement is about the OUTLINE's penultimate chapter, while the flag
steers Agent 9's PROSE. They are not the same lever, so this is a reason to re-score it, not proof it
is harmful. It should not stay ON unexamined.

### 12.5 Revised order

| # | change | cost | evidence |
|---|---|---|---|
| 1 | polish pass on the final chapter (§12.3) | ~£0.02/run | targets the exact sentences the reader quoted |
| 2 | `aftermath` beat + no duplicate beats (§11.3–11.5) | £0 | removes a real contradiction; effect untested |
| 3 | re-score `FOLD_SUSPECT_CLEARANCES` | £0 | its premise is contradicted |
| ~~4~~ | ~~fold clearances into the reveal~~ | — | **DO NOT — inverted, t = −2.79** |
| ~~5~~ | ~~cut the finale word target~~ | — | **DO NOT — finales already under-write by half** |

**The two items I would have built first this morning are the two struck through.** That is the
argument for testing a hypothesis before building on it, and it cost nothing to find out.

---

## 13. THE ROOT CAUSE WAS NOT FOUND — three hypotheses, three nulls

**Owner's question:** *"Did you find the root cause and come up with a 100% solution?"* No, and this
section says so plainly rather than dressing up a mitigation as a cure.

### 13.1 Every structural explanation tested, and none survived

```
hypothesis                                        result                       verdict
the finale has no material and pads with suspects  0.18 sentences, t = 0.18     DEAD
a dedicated clearing chapter causes the overlap   -5.04 sentences, t = -2.79    INVERTED (it HELPS)
the outline title promises a reveal it must not    0.67 sentences, t = 0.77     NOT SIGNIFICANT
```

n=27 books joined to their outlines for all three.

**The third one matters most, because §11 was built on it.** The whole beat-vocabulary plan assumed
the outline/contract contradiction produced the roll-call. Books whose final outline title promises a
reveal carry 3.00 clearance sentences; books whose title does not carry 2.33. That difference is
noise. **Removing the contradiction is unlikely to remove the defect.**

### 13.2 What the pattern actually looks like

- Present in **9 of the last 10 books**, including the 85-scoring one.
- Correlates with **no structural feature tested** — not clue load, not chapter shape, not beat, not
  title.
- The complained-about book had 5 clearance sentences against a median of 2–3.

A defect that is everywhere and correlates with nothing structural is usually not a defect in the
structure. **The most likely explanation left is that this is the genre default:** a Golden Age
finale, written by a model that has read thousands of them, ends by settling what happened to
everyone. It is doing what the form does. Our outline did not cause it and our contract did not cause
it.

**If that is right, the implications are specific:**

- No upstream change removes it. §11 phases 1–3 remain worth doing for their own sake — a duplicate
  beat and a missing `aftermath` are real defects — but they should not be sold as this fix.
- The only lever is **explicit suppression**, which is what the §11.2 prohibitions are, and their
  effectiveness is untested.
- The reader complains when it crosses a threshold, not when it is present. One read mentioned it;
  the 85 did not, and had it.

### 13.3 What is actually in hand

| | |
|---|---|
| root cause | **not identified** — three candidates eliminated |
| solution | **not 100%** — a prompt prohibition, compliance unverified |
| detector | works, baselined, and would catch a relapse |
| eliminated | three structural theories, one of which was the obvious fix and would have made it worse |

**The honest position:** three wrong answers have been removed at zero cost, one mitigation is in
place and unverified, and the most probable remaining explanation cannot be fixed structurally at
all. The next useful step is not another theory — it is one run, read through the detector, to find
out whether suppression works. If it does, the problem is managed rather than solved, and that is the
truthful description of it.

# Architecture Review 13 — the open board, and what 90 actually costs

**Written:** 2026-08-19 · **Type:** the state of every open item, and the arithmetic of the target.
**Extended the same day by [REVIEW_14](REVIEW_14.md)**, which keeps §1's arithmetic and answers §2.3:
the flat three are reachable through the prompt's CONTRACTS, though not through detectors.
Supersedes [REVIEW_11](REVIEW_11.md) §1's route to 90. [REVIEW_12](REVIEW_12.md) holds the retry
diagnosis. [REVIEW_05](REVIEW_05.md) remains the tracker.

Two reads now sit at 86, the best on record, and they got there by different routes. Everything free
that either reader named has been built. So the question REVIEW_13 exists to answer is not "what is
broken" — it is **what is 90 made of, and is any of it on the board.**

> **Measured over 32 external reads with a complete category table: the best-ever mark in each of the
> ten categories sums to 84. Across the seven reads scoring 80+, the headline runs 2 to 6 marks above
> that sum, mean 3.0.**
>
> **[SUPERSEDED 2026-08-19 — see [REVIEW_15 §1](REVIEW_15.md). The 08-19-2047 read returned 81 against
> a category sum of 74: an offset of +7, which is the condition §7 below named as falsifying. The
> series is now +2..+7, mean 3.5, n=8, and best-ever-everywhere projects to 87.5 with 91 inside the
> observed range.]**
>
> **So a manuscript that hits best-ever in EVERY category at once projects to 87 — and reaches 90 only
> at the very top of the observed offset. REVIEW_11 §1 said the shortest path was "the 86 run again
> plus two named repairs". That is a 2-mark plan for a 4-mark gap.**
>
> **90 requires two to three category marks that no read has ever given.**

---

## 1. The arithmetic, done properly

| category | best-ever | achieved on | notes from the reader at 8 |
|---|---:|---|---|
| premise | **9** | 08-06, 08-17 | — |
| plot structure | **9** | 08-06 | — |
| mystery clues | **9** | 08-06 | *"time mechanics still need one cleaner line"* |
| ending / reveal | **9** | 08-06, 08-17 | — |
| dialogue | 8 | 08-17 only | *"dry wit works well; clearer voices"* |
| opening hook | 8 | never higher | *"strong hook"* |
| character clarity | 8 | never higher | *"stable"* |
| atmosphere | 8 | never higher | *"all fit"* |
| pacing | 8 | never higher | *"Chapter 9 repeats clearances"* |
| prose / polish | 8 | never higher | *"a few generated phrases remain"* |
| **sum of best-ever** | **84** | | |

**The offset, measured only on reads that scored 80+** — because it is not constant, and the low-scoring
reads are not evidence about the top:

```
08-06   sum 83  →  86   (+3)
08-17   sum 82  →  86   (+4)
08-14   sum 78  →  84   (+6)
07-24   sum 79  →  81   (+2)
07-24   sum 79  →  81   (+2)
07-23   sum 78  →  80   (+2)
08-02   sum 78  →  80   (+2)

n=7  min +2  max +6  mean +3.0
```

**84 + 3 = 87.** To land 90 with any confidence the sum has to reach roughly 86–87, and there is no
combination of already-demonstrated marks that gets there.

**And the four nines have never co-occurred with the new dialogue 8.** The 08-06 run took all four
(premise, plot, clues, ending) and dialogue 7. The 08-17 run took two nines and dialogue 8. Holding
both at once is worth exactly one mark — sum 84 — and is still 3 short.

---

## 2. The ten categories split three ways, and only one way is buildable

### 2.1 The four that reach 9 but do not hold it — a reliability problem

`premise`, `plot structure`, `mystery clues`, `ending`. Each has hit 9. Only once have all four done
so together. This is [REVIEW_09](REVIEW_09.md)'s "volatile four" and it is the half of the board that
detectors genuinely serve: the machinery to hold them is built, and what it lacks is repetition.

**What moves them:** X38-at-source (clues), and reproducing the 08-06 shape. Both are paid.

### 2.2 The two 8s with a named defect — buildable, and both are blocked on a decision

**`pacing` — *"Chapter 9 repeats clearances after they are already resolved."*** Named in three reads.
[REVIEW_12](REVIEW_12.md) §5 traced it to a contract clash: Agent 7's scene purpose is *"Clear suspects
through alibis and witness verification"* and the `aftermath_consequence` validator forbids exactly
that. The retry loop arbitrates and loses. `AGENT9_FOLD_SUSPECT_CLEARANCES` is the built fix and has
been default-OFF since 2026-07-24.

**`prose / polish` — *"a few generated phrases remain"*, *"fewer obvious artifacts"*.** X43's guard did
not lower the leak rate; [REVIEW_12](REVIEW_12.md) §8.3 gave the probe a conspicuousness term that
separates the reads 0/17/28/39/44% against dialogue 8/7/7/6/6. **That instrument now exists and has
never been read on a fresh run.**

### 2.3 The three 8s with NO named defect — and this is the finding

`opening hook`, `character clarity`, `atmosphere`. Across both 86-scoring reads the notes are:

> *"Body, clock contradiction, weapon, logbook, foggy hotel — strong hook."*
> *"Investigator, victim, culprit, and false suspects are stable."*
> *"Seacliff Hotel, fog, bell tower, blackout curtains, private study all fit."*

**Three positive sentences and not one complaint.** These are not 8 because something is broken. They
are 8 because the writing is correct and unremarkable — every required element present, none of them
memorable. **No detector can move a category whose reader has nothing to report**, and no repair pass
can either: there is nothing to repair.

That is the honest boundary of everything this project has built. Fifty-odd checks, and the three
categories with no defects are the three that have never moved.

---

## 3. The open board, mapped to what it can move

| item | cost | can it move a category? |
|---|---|---|
| **X38-at-source** — the device's own arithmetic, fixed where it is authored | paid ~£1.5 | **clues 8→9.** Detector, internal cap and external reader all agree. ~~Intermittent: fired 08-17, not 08-19~~ **NOT intermittent — see §8. 3 of 3 runs carry it; the detector was blind on 08-19, and that half is now fixed free (X61)** |
| **`AGENT9_FOLD_SUSPECT_CLEARANCES`** — built 07-24, default OFF | decision + a run | **pacing 8→9.** The only named pacing defect, in three reads |
| **D1** — promote the scheduler | decision + a run | pacing/plot. Chapters are near-uniform in length (884–1,348 words) with the reveal at 8 of 10, so 1,853 words have no job |
| **M6 re-read** (`AGENT9_RUBRIC_IN_PROMPT`) | paid ~£1.5 | unknown — the one lever aimed at §2.3's three, and its only run was budget-truncated |
| **X47 craft floor** — built, default OFF | decision | first evidence is AGAINST: it tripled the ch9/ch10 overshoot and retries went UP ([REVIEW_12](REVIEW_12.md) §2) |
| **X46** — `time_model_unparseable` mis-scoped | free | clues. Small; declines when anchors are unreadable but a locked fact parses |
| **X34 / X35** — confession disclosure, reveal repair method | free | ending. Both partly superseded by X49/X59 work |
| **X32** — a third clearance writer unbounded by chapter role | free to detect | pacing. Same family as the fold decision |
| **CS1** — promote `@cml/clue-spec` | paid ~£3 | clues |
| **N8** — phase-2 geometry contract | paid ~£3 | plot/ending. Escalation withdrawn in [REVIEW_11](REVIEW_11.md) §6.1; the 08-19 run showed the binding CAN be wrong, so it is live again but not urgent |
| **R6** — `eval:baseline --repeats 3` | paid £12–24 | nothing directly. It measures the internal judge, not the book |
| **P4 / M5 / S7 / R5 / X31** | free | nothing. Cleanup and hygiene |

**Nothing on this board is aimed at §2.3's three categories except M6**, and M6 has had one truncated
run.

---

## 4. What the last two weeks actually bought

Worth stating plainly, because it is not the score.

**Thirteen defects found and fixed** (X48–X60), of which **four were regressions introduced by the fix
for the previous one**, and **three were false certifications** — machinery reporting that the book was
sound when it was not, or unsound when it was fine. The single most expensive was the `shot` idiom,
which took three separate reviews to find in its three English word orders and, in the last one, was
certifying a manuscript as disclosing its culprit eight chapters early.

**The reader's six complaints from 08-17:** three fixed (weapon, cloth clue, alibi locations), one
needs a decision (ch9 clearances), one needs paid work (time math), one is D1 (ending length).

**And 37% of prose spend was going on retries**, of which the largest single measured cause was the
case's own murder device being read as a season.

None of that is a mark. All of it is the difference between a pipeline whose output you can reason
about and one you cannot.

---

## 5. The order, and what it is honestly worth

```
DECISIONS — yours, and both are one flag flip plus one run
 1  AGENT9_FOLD_SUSPECT_CLEARANCES = on     pacing's only named defect, in 3 reads     §2.2
 2  X47 craft floor: keep or revert          first evidence is against it              §3

PAID — in the order that buys the most per pound
 3  X38-at-source (build free, verify paid)  clues 8→9, the one triple-confirmed defect §3
 4  one cold read of the CURRENT build       nothing since 08-17 has been read at all   §6
 5  M6 re-read, after X47 is settled         the only lever aimed at the flat three     §3

NOT ON THE PATH — stated so it stops being proposed
 -  more detectors on plot, clues, endings — §2.1 is a reliability problem, not a detection one
 -  R6 — it measures the judge, not the book
 -  any single read of any story, as evidence of anything
```

---

## 6. The thing that is missing, and it is cheap

**Nothing built since 2026-08-17 has been read by the external reader.** The 08-19 manuscript exists,
shipped, and has no cold read. Thirteen fixes, one flag, and a retry regime have landed since the last
number, and the board is reasoning from a manuscript that predates all of them.

That is one cold read of `stories/story_20260819-0147`, and it is the cheapest item on this document
by a wide margin. It would say whether the weapon still wobbles, whether the alibi locations hold,
whether the clearances still repeat, and whether the three categories in §2.3 moved when nobody was
aiming at them.

---

## 7. What would falsify this document

- **FIRED 2026-08-19.** ~~**§1's arithmetic is wrong if** a read returns a headline more than 6 above its category sum at the
  80+ level. n=7 is thin, and the whole projection rests on it. A single +8 read would put
  best-ever-everywhere at 92 and change the entire plan.~~ **The 08-19-2047 read came in at +7. See
  [REVIEW_15 §1](REVIEW_15.md): the projection moves to 87.5 mean / 91 at the top of the range.**
- **§2.3 is wrong if** hook, character clarity or atmosphere reaches 9 on a run where nothing was aimed
  at it. That would mean the "no complaint, no lever" reading is wrong and those categories move with
  general quality rather than targeted work.
- ~~**§3's X38 row is wrong if** the next two runs both produce coherent device arithmetic. It fired on
  08-17 and not on 08-19; two clean runs would make it rare rather than systemic, and demote it below
  the fold decision.~~ **ANSWERED 2026-08-19, and the row was wrong in the other direction — §8.** The
  08-19 device is 89 minutes apart while declaring forty-five. It did not fire because the detector
  could not see it, and one clean-looking run was never evidence of a clean run.
- **§5's ordering is wrong if** the fold flag moves pacing but costs plot or ending — the aftermath
  chapters are where the reveal machinery also lives, and [REVIEW_08](REVIEW_08.md) §7 records X29
  pulling ch9 in two directions once already.
- **What this document does not claim:** that 90 is reachable with the current generation model. §2.3
  is the argument that it may not be, and Move 4 remains untested precisely because M6 — its
  prerequisite measurement — has never had a clean run.

---

## 8. What the cold read of 08-19 actually returned

§6 asked for one cold read of `stories/story_20260819-0147` on the grounds that it was the cheapest
item on the board. It was, and it moved three rows.

This is **not** an external read — no score, no category table. It is the deterministic half: the
named defects of §2.2 and §3, checked against the manuscript and against the run's own artifacts.

### 8.1 X38 is systemic, and §3 had it backwards

The case's own numbers, from the run's checkpoint and Agent 3 prompt log:

```
locked  false_display_time       "a quarter to three"           2:45
locked  disengagement_duration   "forty-five minutes"             45
mech    actual_time_of_death     "fourteen minutes past four"   4:14      ← 89 minutes, not 45
```

Three runs, three devices, three failures of the same arithmetic: 08-15 (10 against 14), 08-17 (25
against 20), 08-19 (89 against 45). §3 read the detector's silence on 08-19 as the device being
sound. It was the detector being blind — twice over, and the second reason was invisible to reading:
**`parseClockTime("fourteen minutes past four")` returned `null`**, because the minute vocabulary was
a closed list of six values. The case's false time parsed. Its true time did not. Every temporal gate
in the pipeline is built on that function.

So the true time never got locked, never reached the page (**zero occurrences** in the manuscript),
and the prose invented one: *"Eight fifty-six"*, against alibis running eight to nine and a clock
frozen at a quarter to three. **Three times, no two of which agree.**

The free half of "X38-at-source" is now built (X61, [REVIEW_05 §12.7](REVIEW_05.md)). The paid half —
authoring a device whose arithmetic is right in the first place — is unchanged and still item 3.

### 8.2 The pacing defect is worse than three reads said, and it settles decision 1

The clearances are not repeated once. They are written **three times**, in full, by name:

| ch | title | what it does |
|---|---|---|
| 6 | *Clearing the Others* | clears Quill, Hale and Trent on the logs; closes *"Only Hugo Vane's name remained outside the web of signatures"* |
| 9 | *The Discriminating Test* | clears all three again, individually, on the same logs — then reveals, accuses, and takes the confession |
| 10 | *Clearances and Culprit Revealed* | clears all three **again**, individually, on the same logs, **after** the confession |

Chapter 6 resolves them. Chapter 10 re-resolves them 2,300 words after the culprit has confessed, and
reuses chapter 6's own joke to do it (*"grateful for all the paperwork"* → *"paperwork has its uses
after all"*). This is [REVIEW_05](REVIEW_05.md)'s **X32**, and it is not the third writer that row
suspected: Agent 7 allocates the job to two scenes in its PRIMARY outline, unprompted, and its own
notes admit *"Suspect clearance scenes concentrated in Act 3, Scene 5"*.

**And the flag aimed at it could never have fired.** `AGENT9_FOLD_SUSPECT_CLEARANCES` lives inside the
repair guardrail raised by `missing_suspect_closure_scene` — the issue for an outline with NO closure
language anywhere. An outline that repeats clearances satisfies that check by definition, so the
trigger is unreachable in precisely the case the instruction addresses. **Folding cannot repair an
absence.** Across the entire prompt log the fold text was emitted **zero** times.

Underneath it, both wordlists shipped a stem killed by a trailing ``: `(...|eliminat|...)`
cannot match *eliminating*, and `alibi` cannot match *alibis*. Measured over 32 archived outlines
the closure floor fired on **17 of 32** before the fix and **8 of 32** after — and that false alarm
drives a retry, a guardrail, a deterministic patch that appends clearance text, and a blocking abort.
**The wordlist that could not read the outline was manufacturing the duplication.**

Both are fixed free (X32/X62, [REVIEW_05 §12.8](REVIEW_05.md)): the clearance job is now counted PER
SCENE and reported on every run, and the fold guardrail hangs off that count instead of its opposite.
**§5's decision 1 is therefore answered: the flag stays OFF, and no run is owed to it** — a paid A/B
would have returned a null result that read as "the fix does not work" when the fix had never been
executed. What the flag now has, for the first time, is a trigger that can fire.

### 8.3 Two more, unclaimed by any board row

- **The reveal is in chapter 9, not chapter 8.** Chapter 8 is titled *The Clock's Secret Revealed* and
  reveals nothing; chapter 9 carries the test, the accusation and the confession. So the last 1,031
  words have no job but the third clearance pass — which is **D1's** case made on the page rather than
  from the word-count table.
- **The test is run twice inside chapter 9**, the second time narrated as *"Run again in front of them
  all, the test came out the same way twice"*. That sentence, and *"That left Hugo Vane as the only
  person whose story still needed the discredited theory to be true"*, read as deterministic
  injections rather than prose — §2.2's *"a few generated phrases remain"*, with a source.

### 8.4 What this does NOT settle

§1's arithmetic and §2.3's three flat categories are untouched: both need an external reader, and
nothing here substitutes for one. The 08-19 manuscript still has no cold read in the sense §6 meant,
and §5's items 4 and 5 stand exactly as written.

### 8.5 The first named mechanism on §2.3's flat three

§2.3 is this document's strongest claim: hook, character clarity and atmosphere are 8 with **no reader
complaint**, so no detector can move them and no repair pass can either. That argument is about
DETECTORS, and it is still right about detectors. It is not an argument that the pipeline is doing
everything it could — and the owner found a place where it was not, by reading an Agent 7 response
and noticing that every character in a scene carries the same `permittedBehavioursByAct` string.

`permittedBehavioursByAct` is the only per-character behavioural steering that reaches Agent 9, which
prints it verbatim as *"Act N behaviour contract"*. Its comment said *"derived from motive seed +
role"*. It read no role, because `CharacterProfilesResult` has none. On 08-19:

- the **detective** was told she *"May show unease, evasion, or mild defensiveness when questioned.
  One behavioural tell is permitted"* — the signal this project's guilt detectors exist to keep off
  the innocent, handed to the investigator;
- the **victim**, dead in scene 1, got a live three-act contract ending in *"confrontation,
  confession, or vindication"*;
- and **Act III was byte-identical for all six characters**, on this run and every run before it,
  because that branch read nothing from the profile at all.

Fixed free (X63, [REVIEW_05 §12.9](REVIEW_05.md)), with culprit/innocent uniformity deliberately
preserved — a distinct contract for the culprit is early disclosure by construction.

**This does not falsify §2.3, and it is not claimed to.** It is a mechanism that would plausibly
produce characters who are *"stable"* and unmemorable — which is precisely what the reader said — and
it is the first such mechanism anyone has named. Whether it is worth a mark is a question only the
external read in §5 item 4 can answer. What has changed is that character clarity is no longer a
category with nothing to try.

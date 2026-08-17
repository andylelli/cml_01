# Architecture Review 10 — the board, by agent, and the run that already scored 90's shape

**Written:** 2026-08-17 · **Type:** the per-agent state of the pipeline and what each owes on the path to 90.
Supersedes [REVIEW_09](REVIEW_09.md)'s ordering. [REVIEW_05](REVIEW_05.md) remains the deep record.

REVIEW_09 split the problem in two — a **reliability** half (four categories that swing three and four
marks) and a **ceiling** half (six that have never moved) — and said no detector reaches the ceiling.
Three days of measurement say that framing is right about the halves and wrong about the arithmetic:

> **The 08-06 run already scored the best-ever mark in all ten categories at once. Its headline was 86,
> and its reader named exactly two things standing between it and 90–92. One of them we built after
> that run and have never run. The other we have never built.**
>
> **90 is not "move two categories". It is that run again, plus two named repairs — and it is the only
> route on the board that does not require a category to go somewhere it has never been.**

Everything below is organised by the agent that owns it, because that is the question that was asked
and because three of this review's four findings are invisible from the category table.

---

## 1. The arithmetic, restated — because REVIEW_09 §1 got it wrong in a way that matters

REVIEW_09 §1 read: *"Six points from the best-ever 86 means: hold the volatile four at 9 every time,
and move dialogue and prose one mark each."* That is not what the table says.

| category | 84 | 86 | 76 | 84 | 78 | best-ever | did the 86 hit best? |
|---|---|---|---|---|---|---|---|
| premise | 9 | **9** | 8 | 8 | 8 | 9 | ✅ |
| plot structure | 8 | **9** | 6 | 8 | 7 | 9 | ✅ |
| mystery clues | 8 | **9** | 7 | 8 | 6 | 9 | ✅ |
| ending / reveal | 8 | **9** | 5 | 8 | 7 | 9 | ✅ |
| opening hook | 8 | **8** | 8 | 8 | 8 | 8 | ✅ |
| atmosphere | 8 | **8** | 8 | 8 | 8 | 8 | ✅ |
| character clarity | 8 | **8** | 7 | 8 | 8 | 8 | ✅ |
| pacing | 8 | **8** | 7 | 8 | 7 | 8 | ✅ |
| prose / polish | 7 | **8** | 6 | 7 | 7 | 8 | ✅ |
| dialogue | 7 | **7** | 6 | 7 | 6 | 7 | ✅ |
| **sum of marks** | 78 | **83** | 68 | 78 | 72 | **83** | **10 of 10** |
| **headline** | 84 | **86** | 76 | 84 | 78 | | |

Two facts fall out, and neither is in REVIEW_09.

**First: the headline is not the sum of its own categories, and the gap drifts.** 83→86, 68→76, 78→84,
72→78. Offsets of **+3, +8, +6, +6**. The reader is scoring holistically and the table is a
rationalisation after the fact. So "90" means 90 on a number that carries ±2.5 of slack *on top of*
M1c's ±3 on the internal judge. **We are chasing a target we cannot resolve to better than about five
marks, and R6 does not fix that — R6 fixes the internal instrument, not the external one.**

**Second, and this is the finding: the 86 run hit best-ever in all ten categories simultaneously.**
There is no category on that row with room left that any other read has demonstrated. The
"hold the four at 9 and move two by one" plan describes a manuscript that would sum to 85 and land
somewhere near 90 — but it asks dialogue and prose to go where they have never been, when a cheaper
route exists and its reader wrote it down:

> *"With Chapter 10 tightened and the corrected time stated more sharply, this could reach 90–92/100."*
> — the 08-06 cold read, [stories/_archive/story_20260806-2255](../stories/_archive/story_20260806-2255/chatgpt-review.txt)

Those two items are §4's X44 and the aftermath pass. **One is built and has never been run since it was
fixed; the other has never been built.** That is the shortest honest path to 90 on the board.

---

## 2. The board, one row per agent

Ordered by the pipeline, not by priority. "Owns" is the rubric categories that agent can move.

| agent | owns | state | what it owes for 90 |
|---|---|---|---|
| **1 — Setting** | atmosphere | flat 8×5, zero variance. Era/location are fixed by the canary brief and correctly so | nothing detector-shaped. M6 / Move 4 territory |
| **2 — Cast & Motive** | character clarity | 7,8,8,8,8. No read has complained except the 76's *"Hale's guilt arrives abruptly"*. Its cast is pinned by the canary brief, so `generateCastNames` never runs | nothing — the name recurrence is a control, not a defect (§5.1) |
| **2b — Character Profiles** | dialogue (the tic) | **working.** The `signatureTic` guard is the model: 1 occurrence in the whole 78 manuscript | nothing. 2b is the precedent 6.5 lacks |
| **2c — Location Profiles** | atmosphere | sensory atoms feed 6.5 and 9. Unmeasured, no complaint in five reads | nothing on evidence |
| **2d — Temporal Context** | — | feeds the time model. Not implicated in either temporal defect | nothing |
| **2e — Background Context** | — | no signal in any read | nothing |
| **3b — Hard-Logic Devices** | premise, clues | authored the 78's **largest single complaint** (§3). X38 now checks its own arithmetic at the £0.03 end | **run it.** Built 08-15, never executed against a live device |
| **3 — CML (+4, +8)** | premise, clues, ending | owns `hidden_model.mechanism` — the second temporal spine that reached the page zero times. X39 detects | ~~X45~~ ✅ **DONE (§9.3)** — the feed kept its four OLDEST runs and dropped every seed pattern. Unmeasurable on the canary |
| **5 — Clue Distribution** | mystery clues | 6→9, spread 3. Clue *sets* are praised in every read (*"a strong fair-play collection"*) | **CS1** — promote `@cml/clue-spec` out of shadow, ~£1.5 |
| **6 — Fair Play + blind reader** | clues, ending | X33 now guards all four `blindReaderSimulation` call sites (REVIEW_09 §9.2). **No read has ever called the mystery unfair** | nothing. This agent is arguably finished |
| **6.5 — World Builder** | **dialogue** | **this review's headline.** Authors the 18 voice fragments Agent 9 is told to match — 28–50% came back verbatim (§4) | ~~X43~~ ✅ **DONE (§9.1)** — guarded, with `probe:voice-fragment-leak` as the instrument. **Needs a paid run to know if it worked** |
| **7 — Narrative Outline** | plot, pacing | 6→9 and 7→8. The ch9/ch10 repeat is an outline shape: a reveal at ch8 of 10 leaves two chapters nothing to do | **D1** (promote the scheduler) · **N8** (phase-2 contract, confirmed misbinding) |
| **7.5 — Geometry** | plot, ending | contract compiler. X23 binds every post-reveal chapter; X38/X39 second call site | ~~X44~~ ✅ **DONE (§9.2)** — 3 of 7 manuscripts fire, all three reader-confirmed; backtest separation improved. **X46** open (§9.4) |
| **9 — Prose** | prose, ending, dialogue | repair ladder complete (N7). X36/X40/X41 shipped 08-15 | **M6** — the prompt still does not carry the rubric it is judged by. **M5** — the injector decision |
| **rubric-score** | the measurement | X37 emits `not_measured` on refusal. M1c: one score is ±3 | **R6** — and §1 says it is necessary but not sufficient |

**Health, after the §9 free block:** `npm test` green across all 16 packages, 0 failures · geometry
backtest **PASS** with separation improved (X44 is unique to the 68). Nothing in §4 or §5 was a
regression; all of it was pre-existing and newly measured.

---

## 3. Where the points actually went, per agent, across five reads

Sorting the readers' complaints by the agent that authored them, rather than by the category they landed in:

| complaint, in the reader's words | reads | author |
|---|---|---|
| *"generated catchphrases"* / *"several lines are malformed/generated"* | **5 of 5** | **Agent 6.5** (§4) |
| *"Chapters 9–10 repeat"* / *"Chapter 10 repeats Chapter 9"* | 3 of 5 | Agent 7 shape, Agent 9 repair |
| *"validation/report artifacts"*, *"The detective's understanding updated:"* | 4 of 5 | Agent 9 — X40 shipped |
| *"the timing math does not work"* | 2 of 5 | **Agent 3b** — X38 shipped, unrun |
| *"the final proof is too abrupt"* / confession arrives without a case | 2 of 5 | Agent 9 — X41 shipped, unrun |
| the corrected time is never stated in one line | 1 of 5 (**the 86**) | **Agent 7.5 — unbuilt (X44)** |

**The top row is the story.** It is the only complaint in all five reads, it is the only category that
has never once exceeded 7, and until this week nothing in the pipeline had looked at where those lines
come from. They do not come from Agent 9's imagination. They are handed to it.

---

## 4. X43 — the voice fragments are being copied, not matched

**Agent 6.5 → Agent 9. Free. MEASURED.**

Agent 6.5 writes `characterVoiceSketches[].fragments`. The orchestrator lifts three per character into
the character bundle ([mystery-orchestrator.ts:533](../apps/worker/src/jobs/mystery-orchestrator.ts#L533)),
and Agent 9's per-chapter prompt prints the first two under this instruction
([prompt-blocks.ts:180](../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts#L180)):

```
Sample voice fragments (match this register and rhythm):
  [comfortable] "Well, that's the way the biscuit crumbles, isn't it? One does what one can in trying times."
```

**The asymmetry is the defect.** Two lines above it in the same block, the `signatureTic` carries a
guard that took A_61 RC5.3 and an eight-of-ten-chapters over-repetition to earn:

> *"use sparingly … at most once in this chapter … prefer a varied paraphrase over the verbatim
> phrase; most chapters should omit it entirely"*

That guard **works** — the tic appears once in the entire 78 manuscript. The fragments beside it get
the opposite instruction and no guard at all. So does nothing else in the prompt: the atmosphere field
one block away already says *"do NOT reproduce this phrase verbatim in prose; translate into
scene-specific, character-observed sensory language"*. The fragments are the one voice input in the
whole prompt that is handed over bare.

**Measured, on the four runs that have both a character bundle and a cold read** — the longest verbatim
≥5-word span of each fragment, searched against the shipped manuscript:

| external | dialogue mark | fragments | leaked verbatim | rate |
|---|---|---|---|---|
| 86 | 7 | 18 | 6 | **33%** |
| 84 | 7 | 18 | 5 | **28%** |
| 78 | 6 | 18 | 7 | **39%** |
| 76 | 6 | 18 | 9 | **50%** |

**It separates the corpus in the direction the marks go, and it separates the pair X30 could not.**
REVIEW_09 §9.8 records X30's standing verdict — *"still does not separate two 84s (0.8 vs 6.0 per 100
lines, same reader mark)"*. This does: dialogue-7 sits at 28–33%, dialogue-6 at 39–50%, with no overlap.

**INFERRED, and flagged as such:** n=4, two mark levels, one reader. That is a lead, not a law. What
makes it worth acting on before more data is that the *causal* story is not inferential — the prompt
tells the model to match these lines, and here is the model matching them, in the 78:

```
fragment  "One must mind the details, lest chaos reign. Order is the only refuge here."
ch1       "Every detail demands attention or shadows gather reign. Order is the only refuge here."
ch5       "Order is the only refuge here, and I would sooner lose sleep than see the hotel's name
           dragged through it."
```

Both failure modes in one character. The second half is copied verbatim into two chapters; the first
half is remixed into *"shadows gather reign"*, which is not English. **That is the exact pair of
complaints five readers have been making** — *"generated catchphrases"* and *"malformed lines"* — and
they have one source.

Seven of eighteen fragments leaked in that run, across all five characters:

```
Dr. Mallory Finch   "often tells the largest story we must look beyond the obvious"       11 words
Captain Ivor Hale   "well that s the way the biscuit crumbles isn t it one"               12 words
Captain Ivor Hale   "i can t rightly say where i was at every moment the"                 12 words
Beatrice Quill      "reign order is the only refuge here"                                  7 words
Sylvia Trent        "well isn t that the juicy bit"                                        7 words
Sylvia Trent        "though some might read too much into"                                 7 words
Hugo Vane           "as one might expect the hotel runs on precise schedules and well"    12 words
```

**The fix is the guard that already exists, applied to the field beside it** — the fragments are a
register sample, not a script; forbid the verbatim span the way the tic and the atmosphere line already
do. **The instrument is free too, and it is better than X30**: the source strings are on disk in
`apps/worker/logs/character-bundle-*.json` for every run, so this is a provenance check against a known
answer rather than intra-manuscript duplicate-hunting against a guess.

**Why this is the highest-value free item on the board:** dialogue is the only category with no
demonstrated 8, §1 shows every other category is already at its ceiling in one manuscript, and this is
the only free lever pointed at it.

---

## 5. X44 and X45 — the other two, both free

### X44 — the reveal never states the two times side by side

**Agent 7.5. Free. The 86's second named gap, and the only one still unbuilt.**

The geometry `TimeModel` carries `trueTime` and `apparentTime`. X39 checks whether they appear
*anywhere* on the page. The reveal contract
([derive.ts:389](../packages/story-geometry/src/derive.ts#L389)) requires the culprit named, how it was
done, why, and the decisive trace — **and says nothing about the clock.** So a manuscript can satisfy
every disclosure obligation while leaving the reader to do the subtraction, which is what the 86's
reader objected to:

> *"the true murder window could be stated in one crisp line: 'The clock showed 10:45, but the true
> time was 10:55.'"*

One entry in `mustContain`, bound to the reveal chapter, checked by the disclosure test that already
runs. It is the same shape as X41 and costs the same.

### X45 — the divergence lever cuts from the wrong end of the list

**Agent 8 / the cross-run ledger. Free. MEASURED over all 80 shipped runs in `data/novelty-ledger.json`.**

> **CORRECTED 2026-08-17, before building.** The first version of this section is retained at §5.1
> because the correction is the more useful finding. It read the ledger's convergence — one era, one
> location, four names, `trap` 73/80 — as a generative collapse, and named Agent 2 and a missing cast
> field as the mechanism. **That is wrong.** `scripts/canary-core-inputs.yaml` pins `castNames`,
> `eraPreference`, `locationPreset`, `primaryAxis: temporal` **and** a `theme` reading *"driven by a
> mechanical clock-tampering method"*. Nearly every axis I measured as collapsed is a deliberate
> control. And `generateCastNames` is not failing: seeded with the four real run IDs it returns four
> entirely distinct casts — the canary simply never calls it.

**What survived the correction is a live defect in the lever itself**, and it is the reason the
divergence pressure has never been felt. `mergePriorRunsIntoConstraints` folds the last 20 shipped runs
into Agent 3's avoidance constraints. Simulated against the real ledger:

```
window of 20 runs  →  100 avoidance patterns emitted  →  slice(0, 20) kept 20
the MOST RECENT run was not represented at all
0 of 3 seed-derived patterns survived
```

Two defects in one line. `records` is append-ordered, so `slice(-20)` runs **oldest→newest**, and each
run emits up to five strings — so the cap keeps the first twenty, which is the **four oldest runs in
the window**. The three most recent runs, which is the entire meaning of *"diverge from recent runs"*,
were cut every time. The module's own header says prior patterns are placed *"FIRST (most actionable)"*;
the code did place them first, and first in a chronological array is the least actionable end of it.

And a hundred prior patterns front-loading the merge displaced **every** seed-derived pattern. This
module is documented as folding recency in *alongside* the seeds. It was replacing them — so on a run
where the ledger is populated, the original novelty signal reached Agent 3 not at all.

**Fixed:** newest-first among priors, and a reserved floor for the seed patterns that gives its unused
room back rather than spending prompt on nothing.

### 5.1 What the first version of X45 claimed, and why the correction matters more

It claimed the cast had collapsed to four names across 80 runs (Eleanor Voss 34, Mallory Finch 30,
Hugo Vane 21), with six consecutive runs filling investigator/victim/culprit from that pool. **The
counts are accurate and the conclusion was wrong** — they are pinned in a YAML file, with a comment
saying why (*"Gender lock: prevents per-run ambiguity for names the LLM may misread"*).

Two things follow, and both outlive the error.

**The canary is more controlled than REVIEW_09 §7 credits.** §7 warns *"no comparison across premises"*
and calls the five reads five different stories. They are five different **cases** on a brief that pins
era, location, cast, gender, axis and device family — much closer to replicates than §7 assumed. That
makes §1's reliability reading **stronger**, not weaker, and makes R6 less of a departure from what we
already have than its price suggests.

**And it means the ledger has never been measured on a run that could move.** Every one of its 80
records is a canary run whose axis and device were pinned before Agent 3 saw a constraint, so the
avoidance patterns had nothing they were permitted to change. The bug above went unnoticed for exactly
that reason: the lever was broken *and* held down. Neither fact is visible from the ledger alone, and
reading convergence off a controlled corpus is how the first version of this section went wrong.

---

## 6. What is built and has never been run

This is its own category because it is where the risk sits. Four repairs shipped on 08-15 and were
gated by tests and the backtest; **none has met a live run.**

| item | agent | built | status |
|---|---|---|---|
| `aftermath_repeat` post-X36 | 9 | 08-15 | **the 86's FIRST named gap.** The pass fired live once, lost twice on the unpinned channel, and the channel was fixed the same evening. Zero live evidence since |
| X38 locked-time arithmetic | 3b | 08-15 | fires on the archived 08-15 case; never met a fresh device |
| X39 anchors absent | 7.5 | 08-15 | fires on 2 of 3 manuscripts; never met a fresh case |
| X41 reveal build-up | 9 | 08-15 | REVIEW_09 §9.8 flags it as the fourth clause on that instruction — **first suspect if the next reveal repair regresses** |

**The next paid run is therefore worth more than its ticket price** — it retires four unknowns, and one
of them is half the distance from 86 to 90.

---

## 7. The order

```
FREE — all three are new to this review, all three are measured   ✅ ALL THREE DONE 2026-08-17 (§9)
 1  X43   guard the voice fragments the way the tic is guarded      Agent 6.5/9  ← the only lever at dialogue
 2  X44   bind the two times to the reveal, together                Agent 7.5    ← the 86's second named gap
 3  X45   the avoidance feed keeps its NEWEST runs, and the seeds   Agent 8      ← rescoped on measurement (§5)

PAID — cheapest decisive first
 4  M6    the rubric in Agent 9's prompt              ~£1.5   the probe aimed at the flat six
 5  N8    phase-2 geometry contract                   ~£1.5   confirmed misbinding, ch8 vs ch10
 6  CS1   promote @cml/clue-spec                      ~£1.5
 7  R6    eval:baseline --repeats 3                   £12-24  the internal measurement — see §1's caveat

DECISIONS (yours)
 8  M5    retire the deterministic injectors — X34 removed the reason to keep them
 9  D1    promote the scheduler (pacing)
10  X4    Option 1 — refuse an injection that breaks a model-bound rule
11  Move 4  a frontier model for generation, if the flat six survive M6
```

**Steps 1–3 are free, small, and each has a named manuscript behind it.** Steps 4–6 are three runs at
about £4.50, and every one of them also retires a §6 unknown as a ride-along. R6 stays last and stays
honest about what it can and cannot settle.

---

## 8. What would falsify this document

- **X43 is wrong if** the leak rate does not drop when the guard lands, or if it drops and the dialogue
  mark does not move. n=4 is a lead. The instrument is free, so the first paid run after the guard
  settles it either way — and if the rate drops to zero and dialogue stays at 7, the ceiling reading in
  REVIEW_09 §1 is right after all and Move 4 becomes the honest next step.
- **§1's thesis is wrong if** a category exceeds its best-ever mark before the 86 shape is reproduced.
  That would mean the ceiling was never a ceiling and the flat six were waiting on something upstream.
- **X45 cannot be falsified on the canary at all**, and that is the point of §5.1. The brief pins the
  axis and the device family, so a repaired avoidance feed has nothing it is permitted to change. It
  needs one run on an unpinned brief to say anything — and until then the honest claim is only that the
  lever now does what its own header says, not that divergence improves.
- **What will not get to 90:** more detectors on plot, clues and endings; another regex widening on the
  aftermath family (X22, decided); and any single read, of any story, at any score.

**And the rule from REVIEW_09 §7 stands, hardened by §1:** no quality claim from a single scoring, no
comparison across premises — and now, no treating the headline /100 as if it were the sum of the
category marks. It has never once been.

---

## 9. The free block, as built (2026-08-17)

All three shipped the day REVIEW_10 was written. **One of them was rescoped mid-build because the
measurement behind it was wrong**, and that correction is recorded in §5 rather than quietly absorbed —
it is the more useful half of the finding.

**Gates:** `npm test` green (1038 + 490 + 430 + … across 16 packages, 0 failures) · geometry backtest
**PASS**, all three §10 criteria flagged, separation preserved and improved.

### 9.1 X43 — the same guard, on the field beside the one that had it

`buildCharacterContractsBlock` now hands the voice fragments over as a **register sample** with an
explicit prohibition on verbatim reuse, cross-chapter reuse, and remixing — the three shapes measured
in the manuscripts. The fragments themselves are still shown: they are evidence about how a person
sounds, and deleting them is not the fix.

`probe:voice-fragment-leak` ships with it, and reproduces the four baseline numbers exactly:

```
86 · dialogue 7 ·  6/18 · 33%
84 · dialogue 7 ·  5/18 · 28%
78 · dialogue 6 ·  7/18 · 39%
76 · dialogue 6 ·  9/18 · 50%
```

Its floor is five words, and that is the one number worth defending: below it the check reports
ordinary English (*"I was in the"* is in every mystery ever written) and a detector that fires on the
manuscripts readers liked is noise. Five content-bearing words in sequence is a quotation.

**This is the only item of the three whose effect cannot be seen without a paid run.** The guard is a
prompt change; the probe reads manuscripts. Nothing offline can tell us whether the model obeys it.

### 9.2 X44 — and the corpus answered better than the fixture did

`reveal_times_not_stated`, bound to the reveal chapter, mapped to `missing_resolution` — the same
repair family as the three reveal obligations beside it, and deliberately **not** excused from prose
repair the way X39 is. X39 asks a case question and its repair is to the case; this asks whether the
chapter that discloses put the two hours together, and that is a prose defect with a prose repair.

Three design decisions, each with a failure it prevents:

- **Both anchors or neither**, in the contract *and* the check. X39's rule, for X39's reason: with
  fewer than two parseable anchors there is no two-time deception. An obligation the model is given
  must be one the test can score, so they gate on the same condition or they disagree in production.
- **Gated on X39.** If neither anchor reaches the page at all, X39 owns the finding and this declines.
  Without that, one defect is reported twice and a repair pass is aimed at a chapter that cannot be
  rewritten into coherence.
- **Matched by parsed minutes, never by string.** The case writes *"a quarter to nine"* and the prose
  writes *"8:45"* about as often as not.

**Measured across all seven corpus manuscripts** — the §9.7 precision question, asked before shipping:

| external | X44 | why |
|---|---|---|
| 80 | silent | X39 owns it — the gate works |
| 68 | **fires** | the backtest case; unique to the 68, so separation improved |
| 84 *secret_chime* | **fires** | reader: *"State true time vs false clock time clearly."* |
| 86 | declines | both anchors unparseable (§9.4) |
| 76 | silent | — |
| 84 *frozen_hour* | **fires** | reader: *"State the solution timeline in one clean paragraph: 9:45 false, 10:10 true."* |
| 78 | silent | X39 owns it — the gate works |

**Three fires, three confirmed by the reader in their own words, none unconfirmed.** Two of the three
are 84s, which is exactly the 84→9 gap §1 says the volatile four have to close. And the backtest lists
it as *unique to the 68*, so the one number that matters — separation between the 68 and the 80 — went
up rather than down.

### 9.3 X45 — rescoped by measurement, then fixed

The section as first written is at §5.1. What shipped is the defect that survived checking:
`mergePriorRunsIntoConstraints` kept the **oldest** four runs of its twenty-run window and dropped
every seed-derived pattern. Now newest-first, with a reserved floor for the seeds that gives its unused
room back rather than spending prompt on nothing, and a run's own fields stay adjacent so the model
reads one prior case instead of a shuffled heap.

**And it is honestly unmeasurable here.** Every one of the ledger's 80 records is a canary run whose
axis and device family were pinned by the brief before Agent 3 saw a constraint. The lever was broken
*and* held down; fixing it changes nothing until a run is allowed to diverge.

### 9.4 X46 — found while building X44, and deliberately not built

`time_model_unparseable` says *"Neither temporal anchor parses as a clock time"*. Its condition is
`allowed.size === 0`, and `allowed` is the anchors **plus every clock-valued locked fact**. So a case
whose two anchors are both unreadable stays silent as long as one locked fact parses.

That is not hypothetical. On the 86 — the run that motivated X44 — the anchors are `"nine ten"` and
`"nine twenty"`, both of which parse to `null`, and the report said nothing. X44 therefore declines on
the one manuscript whose reader asked for it by name.

**Not built, on purpose.** It changes an existing code's firing condition across the whole corpus, and
this project's rule is that such a change gets its own increment and its own backtest reading rather
than riding along inside three others. It has a tracker row and this paragraph.

### 9.5 What the day cost, and what it did not buy

Nothing here needed a run, and nothing here proves a score moved. X44 is the only one of the three
with corpus evidence that it fires where a reader complained and nowhere else. X43 has a measured
cause and an unmeasured cure. X45 is a repaired lever with no way to observe it.

**§1's claim is unchanged and untested:** the shortest route to 90 is the 86 run again, plus the two
things its reader named. One of those two is now built (X44). The other — the ch9/ch10 repeat — has
been built since 08-15 and **still has not met a live run.**

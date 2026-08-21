# Plan to 90

**Written:** 2026-08-21 · **Type:** a plan, not an assessment.
Descends from [REVIEW_13](REVIEW_13.md) §1 (the arithmetic), [REVIEW_14](REVIEW_14.md) §6 and
[REVIEW_15](REVIEW_15.md) §6 (the two most recent orderings), and from the twelve-row code review in
[REVIEW_05](REVIEW_05.md) §12.13–§12.15. [REVIEW_05](REVIEW_05.md) remains the tracker.

**This document exists because the previous three orderings were all drawn through instruments that
have since been measured, and found blind.** Nine of the twelve defects fixed on 2026-08-20 were
gates skipping their own inputs. Any plan written before that was reasoning about a pipeline whose
signals it could not see.

---

## 1. The bar, stated precisely

The instruction is **90+ every run**. That is not the same target as 90, and the difference is the
whole problem.

```
best external read ever recorded          86      (08-06 and 08-17, by different routes)
most recent external read                 81      (08-19-2047)
worst recent external read                78      (the N7 run)

"90 once"       asks the CEILING to rise by 4
"90 every run"  asks the FLOOR   to rise by 12 — and to end above the best run ever produced
```

**The worst future run must beat the best past run by four marks.** Every sentence below is written
against that bar, because a plan aimed at the ceiling would be a different and much easier plan.

### 1.1 The arithmetic, carried forward

From [REVIEW_13 §1](REVIEW_13.md) as amended by [REVIEW_15 §1](REVIEW_15.md):

```
best-ever mark in each of the ten categories, summed        84    (never co-occurred)
headline-minus-sum offset, n=8:   +2 +2 +2 +2 +3 +4 +6 +7   mean 3.5

84 + mean 3.5 = 87.5          84 + max 7 = 91
```

90 sits inside the observed range only by stacking two things that have never happened together:
every category simultaneously at its best-ever mark, **and** the largest reader offset ever recorded
— which came from the *lowest*-scoring of the recent reads, on n=1.

For "every run", the same table has to hold on the bad days too. Nothing in eight reads suggests it
does.

---

## 2. Why the current instruments cannot steer there

This is the finding that reorders everything, and it is measured rather than argued.

**Three internal numbers exist. On the only two runs with external reads to compare against, all
three rank them backwards.**

| run | headline | prose phase | shadow rubric | external |
|---|---:|---:|---:|---:|
| 08-17 | 96.71 | 99 | 70 | **86** |
| 08-19 | 97.29 | 100 | 76 | **81** |

- The **headline** was the unweighted mean of fourteen phases, thirteen of which score upstream
  artifacts that sit near 100 by construction. All 15 archived reports graded **A**, in a band of
  93.4–97.4, while the prose phase underneath ranged 60 to 100. Four were graded A with the prose
  phase failing at 60/D. *Capped at the deliverable phase on 08-20 ([X72](REVIEW_05.md)); it can no
  longer oversell, but it still cannot rank two books.*
- The **prose phase** gave 99 and 100 to the two runs. No discrimination.
- The **shadow rubric** — the LLM critic on finished prose — gave the 81 a *higher* score than the 86.
  [M1c](REVIEW_05.md) already measured one rubric score at ±3 with a spread of 6, so a 6-point gap is
  inside its own noise.

**Conclusion, and it is the spine of this plan: there is currently no instrument in this project that
can tell an 86 from an 81.** Every decision about what moves the score therefore routes through paid
external reads, which is exactly why the board has been stuck on "needs a run" for three documents.

> **You cannot drive a floor to 90 with a gauge that cannot resolve five marks.**

---

## 3. What 2026-08-20 changed, and what it did not

Twelve tracker rows ([X70–X81](REVIEW_05.md)), fifteen distinct fixes. **Not one of them is a quality
improvement.** They fall into three groups, and the distinction matters for what to expect next:

**Instruments that were blind (nine of the fifteen).** A fair-play time check skipping 58% of its
inputs (X75). A discriminating-test gate blind to 12% of all outline scenes ever authored (X74). A
retry router that could not classify 31% of real failures (X80). A release-gate hard stop reading a
shorter mojibake list than the validator (X79). A parser blind to the very time format the prompt
tells the model to write (X76). These did not lower the score — they meant nobody could see what was
lowering it.

**Genericity failures (four).** Three of five story axes silently coerced to `temporal` (X70) — the
cause of a corpus that is 23/23 temporal and 24/24 clock-family. A false `locked_time_arithmetic` on
any midnight-straddling device (X71). A whole subsystem keyed to one story's clock, which had never
once fired usefully in 22 outlines and could only corrupt (X77). Victorian interiors as universal
sensory fallbacks (X78b).

**One prevention (X73).** The Act III contract, aimed at the single dominant retry cause.

**What none of it changed: the score.** No external read has been taken since 08-19. Two manuscripts
sit unread. Every claim in §4 below is a hypothesis until a reader marks a page.

---

## 4. The plan

Four phases. Phase 0 is the precondition for the other three being anything but guesswork.

### Phase 0 — Make the gauge work · free + ~£2 · **do this first**

Nothing below Phase 0 is verifiable without it.

| # | action | cost | why |
|---|---|---|---|
| 0.1 | **Read `story_20260819-2302`.** It is on disk, complete, 9,739 words, and appears in no review. It is also the first manuscript carrying X64/X65, and it demonstrably contains **no statement that anyone killed anyone** — the strings "killed" and "murdered" do not occur in it. | a reader | The cheapest datapoint available, and a sharp test: if a book with no named murderer scores above 75, the offset model in §1.1 is wrong. |
| 0.2 | **One run per axis — five runs.** [X70](REVIEW_05.md) made `identity`, `behavioral` and `authority` reachable for the first time. | ~£2 total at Agent 3 depth | Four of the five will be the first of their kind. Five of the fifteen geometry codes are temporal-only, so these runs are also the only way to learn what a third of geometry does when it has nothing to read. |
| 0.3 | **Give the rubric an error bar.** M1c measured ±3 on one story; re-run it on two more so the spread is known across cases, not just within one. | ~£0.10 | A gauge without an error bar cannot support "every run". This is the cheapest item on the board and it has never been done. |
| 0.4 | **Decide what the headline IS.** [X72](REVIEW_05.md) capped it; it still cannot discriminate. Either promote the shadow rubric to the headline (and accept ±3), or state plainly that the internal number is a *health* signal and external reads are the *only* quality measure. | free, a decision | Today the project has three numbers and no answer to "did that change help?". |

**Exit condition:** a stated, error-barred quality measure, and five manuscripts across five axes.

### Phase 0b — The model question, asked early because it is cheap to ask · ~£0.50

§3's disclaimer — *"does not claim 90 is reachable with the current generation model"* — was doing too
much work. The model is nameable, and the cost of finding out is smaller than assumed.

**The prose is written by `gpt-4.1`.** Retries use the same tier; the ten scoped micro-regens use
`gpt-4.1-mini`; the rubric judge uses `gpt-4.1-mini`.

#### The case that the model IS the ceiling

The three stuck categories sit at 8 in every read **with no complaint attached**. That is not a
detector gap — there is nothing to detect and nothing to repair. It is the signature of a writer's
ceiling, and craft is what a generation model determines.

#### The case for not concluding it yet — and it is stronger than it looks

**This pipeline has never run its own craft levers.** Measured, not assumed:

- **Full-story polish has never executed.** `fullStoryPolishEnabled: false` and
  `fullStoryPolishEditedChapters: []` on **all 15** archived reports. `AGENT9_POLISH_PROVIDER=anthropic`
  is set, the key is configured, `claude-sonnet-5` is the default — and the pass has never run once.
  The model-tiering module argues for exactly this: routing only the polish passes to a stronger model
  *"buys frontier sentence-craft at a fraction of the bill"*.
- **M6** — the only lever ever aimed at the flat three — has one budget-truncated run.
- **The craft ratio** is 12.6% of the prompt and is shed FIRST under budget pressure.

Declaring the model the ceiling now would be diagnosing a writer who has been handed 12.6% of the
brief and never once line-edited.

#### What it costs — measured, not estimated

`scripts/cost-model-swap.mjs` derives the token volume from the 13 archived full runs and prices it.
The finding that matters is the **shape** of the workload:

```
mean run                 GBP 1.02   (USD 1.29)
mean Agent 9 (prose)     GBP 0.80   (USD 1.02)  — 78% of the bill
implied Agent 9 volume   ~378,000 input / ~32,000 output
prompt : completion      11.7 : 1   ← an INPUT-priced job
```

Because it is input-priced, **output rates barely move the total** — which is why the naive
assumption that frontier models are unaffordable here is wrong:

| model | $/run, Agent 9 | vs now | with prompt caching | vs now |
|---|---:|---:|---:|---:|
| gpt-4.1 *(current)* | $1.02 | — | — | — |
| Haiku 4.5 | $0.54 | −47% | $0.34 | −66% |
| **Sonnet 5** *(intro, to 2026-08-31)* | **$1.08** | **+6%** | $0.69 | −32% |
| Sonnet 5 *(standard, from 09-01)* | $1.62 | +60% | **$1.03** | **+2%** |
| Sonnet 4.6 | $1.62 | +60% | $1.03 | +2% |
| Opus 5 | $2.70 | +166% | $1.72 | +70% |
| Fable 5 | $5.40 | +432% | $3.44 | +239% |

Two conclusions, and the second is the important one:

1. **Sonnet 5 at intro pricing costs +6% per run.** Its input rate is identical to gpt-4.1's; on an
   11.7:1 workload the output premium is nearly invisible. **That pricing ends 2026-08-31 — ten days
   from this document.**
2. **Prompt caching pays for the upgrade.** The orchestrator already records that roughly two thirds
   of each chapter prompt is identical across chapters (bible, cast, era rules, physics, craft guides,
   schema). Cached, **Sonnet 5 at standard pricing costs what gpt-4.1 costs today.** The cache
   multipliers used are Anthropic's (reads ~0.1×, writes ~1.25× at 5-minute TTL), so the Claude rows
   are priced correctly; the gpt-4.1 cached figure is indicative only and should not be quoted.

#### The cheapest experiment, and it needs no code

`generateProse` is typed to `AzureOpenAIClient`, so swapping GENERATION is an interface change, not a
config change. **Polish is not** — that path already reaches the Anthropic client.

| polish 3 chapters on | added $/run | vs now |
|---|---:|---:|
| Sonnet 5 *(intro)* | +$0.21 | +21% |
| Opus 5 | +$0.53 | +52% |
| Fable 5 | +$1.05 | +103% |

**So the first model experiment is: turn on the pass that is already configured, point it at a
frontier model, and read the result.** One run, roughly +£0.40, no code. It targets exactly the three
categories that have never moved, and it is the only craft lever that can be pulled today.

#### Which model, and where — the writer is not the cheapest place to change one

**Haiku 4.5 is the wrong direction for the writer.** It is the small/fast tier; `gpt-4.1` is larger.
The defect is that the prose is *correct and unmemorable* — a capability ceiling — and a smaller model
moves that the wrong way. The −47% is real, but it buys cheaper runs of a book that is already stuck
on craft. Context is **not** the reason to rule it out: the largest archived manuscript is ~14,863
tokens, so its 200K window has 13× headroom.

**The cheapest high-value model change is the JUDGE, not the writer.** The rubric judge runs on
`gpt-4.1-mini` and reads one finished manuscript — **one small call over ~15K tokens**, against the
writer's ten calls over 378K. And §2 has already established that the judge is what this plan is
blocked on: all three internal numbers rank an 81 above an 86, and M1c measured the rubric at ±3 with
a spread of 6 on a single story.

| rubric judge on | $/run | vs now | as % of a run |
|---|---:|---:|---:|
| `gpt-4.1-mini` *(current)* | $0.008 | — | 0.8% |
| Haiku 4.5 | $0.023 | +$0.014 | 2.2% |
| Sonnet 5 *(intro)* | $0.045 | +$0.037 | 4.4% |
| **Opus 5** | **$0.113** | **+$0.104** | 11.1% |
| Fable 5 | $0.225 | +$0.217 | 22.2% |

**Opus 5 on the judge costs about nine pence a run.** Opus 5 on the writer costs +166%. Same model,
two orders of magnitude apart in price, because one is a single call over a finished book and the
other is ten calls carrying the full bible each time.

This reorders 0.3. Giving the rubric an error bar on a judge that cannot resolve five marks measures
the noise of the wrong instrument. **Upgrade the judge first, then measure its error bar** — if a
stronger judge separates the archived 86 from the 81, Phase 0 is solved for pennies and every later
phase becomes iterable without a paying reader. That is the single highest-leverage change in this
document, and nobody has tried it because the judge was never the thing under discussion.

**Stated honestly:** this is reasoning from model tier and task shape, not from a benchmark of Golden
Age mystery prose. The judge experiment is cheap enough (~£0.09) that it should settle its own case.

#### Order

| # | action | cost |
|---|---|---|
| 0b.0 | **Put the rubric judge on Opus 5**, then re-score the archived 86 and 81. If it separates them, Phase 0 is solved. | ~£0.09/run |
| 0b.1 | **Enable full-story polish on Opus 5**, one run, read it. | ~+£0.40 |
| 0b.2 | **Implement prompt caching on the chapter prefix.** Free to build; cuts the bill ~40% *and* is the precondition that makes any frontier model affordable. | free |
| 0b.3 | Only then decide about generation. If 0b.1 moves the flat three, the model matters and 0b.2 has already paid for the swap. If it does not, that is real evidence toward the ceiling being elsewhere. | — |

**Falsification:** 0b is wrong if polish on a frontier model moves none of the flat three AND M6 also
moves none of them. At that point prompts, detectors and models have all been tried on those three
categories, and [REVIEW_10 §8](REVIEW_10.md)'s conclusion arrives with nothing left to attribute it to
but the generation model itself — at which point the swap is no longer speculative, and 0b.2 has
already made it affordable.

### Phase 1 — The reliability half · free build, ~£3 verify

[REVIEW_13 §2.1](REVIEW_13.md)'s **volatile four** — premise, plot structure, mystery clues, ending —
have each reached 9, and only once together. This is a reliability problem, and it is the half of the
board detectors genuinely serve. Most of the machinery now exists; what it lacks is repetition.

| # | action | cost | status |
|---|---|---|---|
| 1.1 | **X38-at-source, the flag half.** `buildDeviceArithmeticRule` is written and inert behind `AGENT3_DEVICE_TIME_BINDING` (default OFF). Four of the ten broken archived devices are only reachable this way. | one run, one flag | Prediction to falsify: `[X38]` absent at Agent 3b **and** Agent 7.5. |
| 1.2 | **Confirm X73.** The Act III contract is prevention, unflagged, and unmeasured. | rides along | Prediction: `aftermath_consequence` retries drop from ~2.3/run toward 0. It is 21 of 54 archived chapter retries and appears in **all nine** runs that retried anything. |
| 1.3 | **`derivedFrom` uptake.** X38's repair now acts only on a declared dependency, and no archived device declares one. | rides along | If Agent 3b does not populate it, the repair stays correctly inert and the prompt needs work — not the repair. |
| 1.4 | **X69 — the motive's concrete noun.** The reader's third named fix, still unbuilt. | free to design | Belongs at Agent 3's authoring, like X38-at-source. |

**Exit condition:** two consecutive runs with zero geometry violations in the volatile four.

### Phase 2 — The decisions · free, but they are yours

Three items are blocked on judgement, not code. Each has been carried unresolved across two or more
boards, which is itself the finding.

| # | decision | the honest cost |
|---|---|---|
| 2.1 | **Should geometry be able to stop a run?** ([X68](REVIEW_05.md)) Seven hard stops; three are text hygiene. Mojibake aborts a run, *"chapter 8 is the reveal and no paragraph names the culprit"* does not. | Blocking today converts ships into aborts: the repair passes fail on exactly these codes (400→400, 375→375, 700→700). **The prerequisite is a repair that works, not a stricter gate on a broken one.** Cheap test first: replay geometry over the archived manuscripts and ask whether the 86-scoring runs would have shipped. |
| 2.2 | **X73's validator half.** An outline-time check would catch the clash before any prose. | Any outline issue drives an outline *retry*. It trades ~3 chapter regenerations for 1 outline call — probably a good trade, but not a measured one. |
| 2.3 | **`AGENT9_FOLD_SUSPECT_CLEARANCES`.** Built 07-24, default OFF, trigger rewired by X32/X62 so it is reachable for the first time. | Pacing's only named defect, in three reads. One flag, one run. |

### Phase 3 — The actual ceiling · unsolved

`opening hook`, `character clarity`, `atmosphere`. Each sits at **8 in every read, with no complaint
attached.** The readers' notes are positive sentences. They are 8 because the writing is correct and
unmemorable.

**No detector can move a category whose reader has nothing to report, and no repair pass can either
— there is nothing to repair.** That is roughly three of the four marks between 86 and 90, and
nothing in Phases 0–2 touches it.

What exists:

- **M6** (`AGENT9_RUBRIC_IN_PROMPT`) — the only lever ever aimed at these three, with one
  budget-truncated run to its name. Its prerequisite (X47) is now settled, so it is readable for the
  first time. ~£1.5.
- **The craft ratio** ([REVIEW_14 §3](REVIEW_14.md)) — 12.6% of the prompt, shed first under budget,
  against four craft-scored categories. Free to measure.
- **The contract audit** ([REVIEW_14 §5](REVIEW_14.md)) — twenty-three prompt blocks, ten never
  examined. Reading one of them found X63, a defect present since it was written. Free.
- **[X81(b)](REVIEW_05.md)** — the continuity tail strips five named atmosphere phrases and lets the
  joint-most-frequent one through. One of the very few mechanisms in the pipeline that touches
  atmosphere at all, and it is an arbitrary list. The right rule is *repetition*, which needs no
  vocabulary.

---

## 5. The order, and what it costs

```
 0.1   read story_20260819-2302                        a reader        <- start here
 0b.2  prompt caching on the chapter prefix            free            <- and this, in parallel
 0b.0  rubric judge -> Opus 5, re-score the 86 and 81  ~GBP 0.09  <- highest leverage
 0.3   rubric error bar, n=3 cases (on the NEW judge)  ~GBP 0.10
 0.4   decide what the headline is                     free
 0b.1  full-story polish ON, frontier model, one run   ~GBP 0.40
 0.2   five runs, one per axis                         ~GBP 2
 ---- gauge exists, and the craft lever has been pulled once ---------
 1.1   X38-at-source flag half, + 1.2/1.3 ride along   ~GBP 1.5
 2.1   the gate-authority decision                     free + a replay
 2.3   fold-clearances flag                            ~GBP 1.5
 ---- reliability half settled or falsified -------------------------
 3.x   M6 re-read, craft ratio, contract audit         ~GBP 1.5 + free
 0b.3  decide about the generation model               a decision
 1.4   X69 motive noun                                 free to design
```

**0b.2 is free and comes first for a reason that is not the score:** the pipeline is an 11.7:1
input-priced workload, so prompt caching cuts the bill by roughly 40% *and* is the thing that makes
every frontier option affordable. Cached, Sonnet 5 at standard pricing costs what gpt-4.1 costs
today. Uncached, the same swap is +60%. It is the highest-leverage free item on this plan.

**One dated item:** Sonnet 5 intro pricing (+6% per run uncached) ends **2026-08-31**. That is not a
reason to rush a decision — it is a reason to have run 0b.1 before deciding, which costs ~GBP 0.40.

Everything above Phase 3 totals **under £6**. Phase 3 is where the money and the uncertainty are.

---

## 6. What is not the path

Carried from [REVIEW_14 §7](REVIEW_14.md) and [REVIEW_15 §7](REVIEW_15.md), with two additions this
review earned.

- **More detectors on plot, clues and endings.** [REVIEW_15](REVIEW_15.md) is the proof: the
  detectors for the reader's two largest complaints already existed, already fired, and already named
  the right clue.
- **R6** (`eval:baseline --repeats 3`, £12–24). It measures the internal judge, not the book — and
  §2 has just established that the internal judge cannot rank two books.
- **Any single read of any story, as evidence of anything.**
- **Treating a warning count as a quality signal.** The 117-warning run shipped at 81; the 08-17 run
  shipped at 86. *Which* warnings are unrepaired is the measure.
- **NEW — widening a wordlist to fix a wordlist.** Seven two-body vocabularies were found in one
  review. Each had been "fixed" before by aligning two lists. The durable fix is one list; the
  durable *check* is the sweep, not the patch.
- **NEW — trusting a check that has never been run against production strings.** X80's router had
  tests and was 31% blind to real messages. §6 of REVIEW_05 said this about detectors and prose in
  August; it applies equally to code that reads other code's output.

---

## 7. What would falsify this plan

- **§2 is wrong if** the shadow rubric, given an error bar in 0.3, separates the 86 from the 81
  outside its own noise. Then a cheap internal gauge exists, Phase 0 collapses, and everything after
  it can be iterated without a reader.
- **§1's bar is wrong if** 0.1 returns a read above 85 for a manuscript that never states who killed
  anyone. That would mean the categories are not measuring what this project assumes they measure,
  and the whole offset model needs rebuilding before any of Phase 1 is worth spending on.
- **Phase 1 is wrong if** two clean runs in the volatile four do not move `mystery clues` or `ending`
  off 8. Then reliability was never the constraint, [§2.1](REVIEW_13.md)'s framing is wrong, and the
  ceiling is entirely in Phase 3.
- **Phase 3 is wrong if** M6's re-read moves none of the flat three. That is
  [REVIEW_10 §8](REVIEW_10.md)'s falsification arriving: detectors and prompts would both have been
  tried against those categories and failed, and a frontier generation model becomes the honest next
  step rather than a speculative one.
- **The whole plan is wrong if** the five axis runs in 0.2 produce manuscripts that score no
  differently. The monoculture would then have been a curiosity rather than a constraint, and
  [X70](REVIEW_05.md) bought nothing but correctness.

**What this document does not claim:** that 90 is reachable with the current generation model; that
any Phase 0 item raises a score; or that the twelve fixes of 2026-08-20 will show up in a read. It
claims one thing — **that until Phase 0 exists, no one here can tell whether anything is working.**

# Plan to 90

**Written:** 2026-08-21 · **Type:** a plan, not an assessment.
Descends from [REVIEW_13](REVIEW_13.md) §1 (the arithmetic), [REVIEW_14](REVIEW_14.md) §6 and
[REVIEW_15](REVIEW_15.md) §6 (the two most recent orderings), and from the twelve-row code review in
[REVIEW_05](REVIEW_05.md) §12.13–§12.15. [REVIEW_05](REVIEW_05.md) remains the tracker.

**§8 (2026-08-23) is the live order; §7 is the plan it executes, and both supersede §5.** It adds the £1/run constraint, the
measured cost of a run, and the one instrument question that has never been asked — ordinal rather
than cardinal judging.

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

### Phase 0a — Free work that must happen BEFORE any paid run · £0

Found 2026-08-21 while auditing what was free. Every item is a flag or a comment, and two of them
unblock the highest-value lever in
[15_llm_model_and_cost](../documentation/15_llm_model_and_cost/01_llm_cost_and_performance_levers.md).

| # | action | why it must be first |
|---|---|---|
| 0a.1 | **`LLM_HTTP_TRANSPORT=true`** — currently commented out in `.env.local` | Cached prompt tokens are readable only on the HTTP transport. **110 of 1,503 logged calls carry the field; 93% of the pipeline is blind to its own cache behaviour.** No caching claim can be verified without this, and it changes no prompt. |
| 0a.2 | **`AGENT9_PROMPT_PREFIX_ORDER=true`** — built, default OFF, marked DEFER | This IS the prompt repartition. Its stated probe is *"cached prompt tokens rising from chapter 2"*, which 0a.1 makes observable for the first time. It was not deferred because it is hard; it was deferred because it could not be measured. |
| 0a.3 | **Teach the cost tracker about cached tokens** | It prices cached input at the full rate. On the two runs with telemetry, 30–31% of input was cache-served, so **every cost figure in this repo is an upper bound** — including the ones in this plan. Third defect of this shape in that one file. |
| 0a.4 | **Correct the "two thirds" comment** in `agent9-run.ts` *(done)* | It is a CONTENT claim being read as a CACHING estimate. The real cross-chapter prefix is 5%. It misled this analysis once already. |

**Measured, and it reframes Lever B:** Azure telemetry shows **6–12% cache hits on a first attempt and
88–97% on a retry of the same chapter**. Retries are far cheaper than their raw token count suggests,
so the regeneration saving is smaller than stated — and caching is worth *more* on a bad run than a
good one, which is the opposite of the usual shape.

**The pattern, again.** 0a.1 and 0a.2 are a chain: a built lever sat deferred for want of a
measurement, and the measurement sat off for want of a flag. Neither was hard; neither was connected
to the other by anyone. That is the same shape as X70 (three axes coerced in silence) and X79 (the
hard stop reading the shorter list) — **the defect is rarely the code, it is that two true things were
never put beside each other.**

**Exit condition:** one run with cache telemetry on every call, and a cost figure that means what it says.

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
implied Agent 9 volume   ~263,000 input / ~61,000 output   (at the measured ratio)
prompt : completion      4.3 : 1    ← MEASURED per-call, whole run: 465,750 in / 107,494 out
```

~~Because it is input-priced, **output rates barely move the total**~~ — **that was computed at
11.7:1, a stale per-chapter figure from `mystery-1785521869768`.** Read per-call from the most recent
run, the whole-run ratio is **4.3:1**, so output rates matter roughly three times more than this
section assumed, and every Claude option carries a bigger premium on output than on input. The
corrected table, with the baseline priced on the same cached terms as the alternatives
(`cost-model-swap.mjs` was pricing gpt-4.1 uncached against cached rivals and reporting it as
*"-12% vs now"* — cheaper than itself):

| model | $/run, Agent 9 | vs now | cached at the 29% ceiling | vs now |
|---|---:|---:|---:|---:|
| gpt-4.1 *(current)* | $1.02 | — | $0.90 | — |
| Haiku 4.5 | $0.57 | −44% | $0.51 | −43% |
| **Sonnet 5** *(intro, to 2026-08-31)* | **$1.14** | **+12%** | $1.02 | +14% |
| Sonnet 5 *(standard, from 09-01)* | $1.71 | **+68%** | $1.53 | **+70%** |
| Sonnet 4.6 | $1.71 | +68% | $1.53 | +70% |
| Opus 5 | $2.84 | +180% | $2.54 | +184% |
| Fable 5 | $5.69 | +460% | $5.09 | +468% |

**Read the last two columns together: caching moves every premium the WRONG way.** It is a discount on
the prompt, which every model shares, so it lowers the absolute bill (~9% of a run) and leaves the
relative premium alone — and slightly worsens it, because removing input shifts weight onto output.
Re-derive with `node scripts/cost-model-swap.mjs --ratio 4.3 --cache-hit 0.29`.

Two conclusions, and the second is the important one:

1. ~~**Sonnet 5 at intro pricing costs +6% per run.**~~ **+12% on Agent 9** — the +6% was computed at
   an 11.7:1 prompt:completion ratio, and the measured whole-run ratio is **4.3:1**
   (`mystery-1787167692140`, 465,750 in / 107,494 out, read per-call). A lower ratio weighs OUTPUT
   more heavily, and every Claude option carries a bigger premium on output than on input, so the
   stale ratio made every swap look cheaper than it is. **That pricing ends 2026-08-31.**
2. ~~**Prompt caching pays for the upgrade.**~~ **IT DOES NOT, and the arithmetic that said so was
   wrong twice over.**

   *First*, the premise: "roughly two thirds of each chapter prompt is identical across chapters" is
   the `agent9-run.ts` comment that 0a.4 corrected — a CONTENT claim being read as a caching estimate.
   The measured cross-chapter shared prefix is **5%**, against a **29% ceiling** if the prompt is
   repartitioned stable-first (~8,455 tokens per chapter call).

   *Second*, the comparison: `cost-model-swap.mjs` priced the gpt-4.1 baseline **uncached** while
   pricing every alternative **cached**, so it reported gpt-4.1 as *"-12% vs now"* — cheaper than
   itself — and flattered every Claude row by the same 12%. Fixed 2026-08-21.

   **A stable prefix is a property of the prompt, not of the model.** Every row gets the same
   proportional discount, so caching cannot change a relative premium. Priced correctly, at the full
   29% ceiling:

   | Agent 9 on… | uncached | cached at the 29% ceiling |
   |---|---:|---:|
   | gpt-4.1 *(today)* | — | — |
   | Haiku 4.5 | −44% | −43% |
   | Sonnet 5 *(intro, ends 08-31)* | +12% | +14% |
   | Sonnet 5 *(standard)* | **+68%** | **+70%** |
   | Opus 5 | +180% | +184% |

   Caching moves the standard-pricing swap from +68% to **+70%** — marginally *worse*, because
   removing input shifts the weight onto output where the premium is larger. What caching is actually
   worth is an absolute saving: Agent 9 $1.02 → $0.90, about **9% off the run**. Real, and worth
   having; not a funding source. The cache multipliers are Anthropic's (reads ~0.1×, writes ~1.25× at
   5-minute TTL), so the Claude rows are right and the gpt-4.1 cached figure is indicative only.

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
| 0b.2 | **Repartition the chapter prompt stable-first** (`AGENT9_PROMPT_PREFIX_ORDER`, already built — see 0a.2). Free. ~~cuts the bill ~40% and makes any frontier model affordable~~ — **corrected:** worth **~9% off the run** (5% shared prefix today against a 29% ceiling), and it does **not** make a swap affordable, because caching discounts every model equally. Take it for the money, not as a precondition. | free |
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
| 1.4 | **X69 — the motive's concrete noun.** ~~The reader's third named fix, still unbuilt.~~ | **DONE 08-21** | The diagnosis was wrong: the check already existed, scoped `(culprit only)` in a prompt that forbids Agent 2 from naming a culprit. Rescoped to `possibleCulprits`; `privateSecret` now bound to the same named thing. Fourth instance of *rule-without-a-subject* (X70/X73/X80). No detector — a heuristic flagged 6 of 18 and missed every worst case. [REVIEW_05 §12.16](REVIEW_05.md#1216-x69--a-rule-addressed-to-a-subject-that-did-not-exist-yet) |

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

## 4a. RESULTS — the paid runs of 2026-08-21

Phases 0b.0, 0.3 and 0b.1 executed. **Both headline hypotheses were falsified, and the plan's own
premise (§2) came out stronger rather than fixed.** Spend: ~£4.9.

### 0b.0 — the judge upgrade does NOT solve Phase 0

`scripts/judge-ab.mjs` (new), 8 repeats per story per judge on the two manuscripts §2 argues from —
`story_20260817-2209` (external **86**) and `story_20260819-2047` (external **81**).

| judge | 86 → mean | spread | 81 → mean | spread | gap | verdict |
|---|---:|---:|---:|---:|---:|---|
| `gpt-4.1-mini` *(current)* | 70.4 | 7 | 69.3 | 5 | **+1.1** | does not separate |
| `claude-opus-5` | 52.3 | 8 | **54.6** | 6 | **−2.3** | does not separate, **and ranks the 81 higher** |

Opus fails in the same direction the shadow rubric did, with a **wider** spread than the model it was
supposed to replace. *"Opus 5 on the judge costs about nine pence a run"* was true and irrelevant: the
cheapness was never the obstacle. **§2 stands, and no instrument tested can resolve five marks.**

Two things had to be built before this could run at all, both recorded in [REVIEW_05](REVIEW_05.md):
`eval-rescore.mjs` threw `Assignment to constant variable` on its first entry and could not execute;
and the judge is constructed from the run's **Azure** client at both call sites, so `RUBRIC_JUDGE_MODEL`
could only ever name an Azure deployment — `createLLMRubricJudge` wraps any chat function, so the
package was always provider-agnostic and only the callers were not.

### 0.3 — the error bar, answered as a byproduct, and it is worse than recorded

M1c's **±3 with a spread of 6** was measured on one story at low n. At n=8 the spread is **7 on
`gpt-4.1-mini` and 8 on `claude-opus-5`** — wider than the 5-mark external gap the rubric is being
asked to resolve. **A single rubric score cannot rank two books, on any model tested.**

> **METHOD NOTE, and it cost a wrong answer before it was caught.** At n=3 the current judge looked
> like it separated them cleanly: 73.0 vs 69.3, gap **+3.7** against a spread of 3 — "SEPARATES". At
> n=8 the same judge on the same two files gave +1.1 against a spread of 7. **The n=3 result was
> noise.** Every A/B delta in every board on this project is a single scoring; against a ±7 instrument,
> a lever moving fewer than ~7 marks has not been measured at all.

### 0b.1 — frontier polish did not move craft, and the pass it was aimed at was inert

**As written, 0b.1 was not executable.** `runFullStoryRepetitionPolish` took the run's Azure client and
never called `resolvePolishProvider()` — the seam its sibling `polishPassingChapter` has had all along
— so `AGENT9_POLISH_PROVIDER=anthropic` and `AGENT9_POLISH_ANTHROPIC_MODEL` silently did nothing there.
One capability, two call sites, one of them wired: the recurring shape in this codebase.

**And the pass is inert.** Measured over the whole of `logs/llm.jsonl`, the full-story polish has made
**two LLM calls in its entire history** (Ch4 and Ch10, 2026-07-25), both returned usable prose, and
**both were rolled back by its own regression guard**. Every treatment arm in
`results/ab-agent9_fullstory_polish` shows `editedChapters: []`, one of them with 15 recurring phrases
available to work on. The guard did `continue; // roll back` and recorded nothing, so *"rejected every
time"* and *"had nothing to do"* wrote byte-identical telemetry. Both fixed: a provider seam, and a
reason string naming the failing check.

**What did run, and what it showed.** Per-chapter polish executed on **`claude-opus-5`** across 6
chapters (~13K output tokens of frontier line-editing) — the archive runs this on `claude-sonnet-5`.
Result, against the 11 previous scored runs:

| | premise | opening | plot | character | dialogue | atmosphere | clues | pacing | ending | prose | final |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| historical range (n=11) | 7–7 | 6–7 | 6–8 | 7–8 | 6–7 | 8–9 | 6–8 | 5–8 | 5–8 | 7–8 | 68–76 |
| **Opus-polished run** | 7 | 7 | 6 | 7 | **6** | **8** | 8 | 5 | 7 | **7** | **68** |

Every craft category landed at **the bottom of its historical range**. `dialogue` 6, `prose` 7,
`atmosphere` 8 — no movement, on n=1 against a ±7 instrument, so this is not evidence *against* the
model hypothesis either. It is simply not evidence *for* it, which is what 0b.1 was run to find.

> **§3's "three stuck categories sit at 8 in every read" is factually wrong.** Across 12 scored runs
> nothing sits at 8 in every read: `atmosphere` is 8–9, `prose` 7–8, `clues` 6–8. The genuinely frozen
> category is **`premise`, which is 7 in all twelve** — and it is 7, not 8. A lever aimed at "the flat
> three at 8" was aimed at a set that does not exist.

### 0.2 — the first run found the axis was still broken

Requested `identity`. **Agent 3 received `authority`**, and nothing in any artifact said so. Cause is
[X88](REVIEW_05.md#1218-x88-the-coercion-that-survived-its-own-fix): a *reverse* alias map in
`canary-input-overrides.mjs` rewrote the canonical five into the retired spellings on the way in, so
[X70](REVIEW_05.md)'s fix removed the downstream default and left the upstream translation intact.

| the yaml says | the loader emitted | the agent received | |
|---|---|---|---|
| `identity` | `social` | **`authority`** | a different kind of mystery, silently |
| `behavioral` | `psychological` | `behavioral` | correct only by coincidence |
| `authority` | `mechanical` | **THROWS** | X70 made it fatal — the run dies at init |

**One of the three axes X70 was supposed to unlock actually worked**, and §3's *"[X70] made `identity`,
`behavioral` and `authority` reachable for the first time"* was wrong when written. It also settles
where 23-of-23-temporal came from: before X70 the downstream default swallowed every spelling this map
produced.

Fixed, with 9 tests spanning **both** hops — each end was correct in isolation, which is why nothing
caught it, and an existing test actively asserted the re-spelling. A third instance was found in
`theme-library.mjs` ([X89](REVIEW_05.md)), where `CANARY_THEME=acoustic` emitted the now-fatal
`mechanical` and the entry named `identity` emitted `social`.

#### What the run itself showed — the first non-temporal case in the project's history

It shipped. `story_20260821-2120/the_authority_s_shadow_on_the_promenade.md`, 10 chapters, 22.6 min,
**£1.03**, `false_assumption.type: authority`, release gate `warning` (0 hard stops), rubric **68**.
Against 23 archived temporal cases scoring 68–76, an authority case lands **inside the same band**. On
n=1 against a ±7 rubric that is not a quality claim — but "a non-temporal axis runs end to end and
ships" is now established rather than assumed.

**The geometry question got a different answer than the one §0.2 predicted.** The plan expected to learn
*"what a third of geometry does when it has nothing to read"*. It had plenty to read: Agent 3 populated
`trueTime: "8:45"` / `apparentTime: "8:30"` on an authority case, so the temporal contract engaged
normally and `reveal_times_not_stated` fired on ch8 with the message *"the disclosure of a **temporal
deception** owes the reader both hours"*.

Measured, and worth separating from the above: **`packages/story-geometry` contains no reference to
`primaryAxis` or `axis` anywhere.** All 15 codes apply identically to all five axes, keyed on what the
case contains rather than what kind of case it is. Here that was harmless-to-useful, because the case
genuinely had a claimed-vs-actual time (`high_tide_time`, `murder_claimed_time`). It is not established
that it is harmless for an axis whose case populates no temporal fields — no such case exists yet.

**The sharper question this raises, unanswered on n=1:** the locked facts of this "authority" case are
`high_tide_time`, `murder_claimed_time`, `promenade_length`, `wet_sand_mark_length` — a tide-and-distance
mechanism with a two-time deception at its core. Setting `primaryAxis: authority` changed the label and
the title; whether it changed the *kind* of mystery underneath is exactly what four more runs would
show, and what a single run cannot.

**Consequence for this phase:** the ~£1 bought a defect AND a first — X88, and the first non-temporal manuscript this project has produced. The manuscript it
produced is an **authority** story — genuinely one of the never-run axes, so it is not wasted, but it is
not the `identity` run that was asked for. All five axes now verify end to end; a clean sweep would
cost ~£5 and is unstarted.

### 0.2 — COMPLETE. Five axes, five manuscripts, 2026-08-22

Re-run in full after [X88/X90/X91/X92](REVIEW_05.md#1219-x90x91x92--the-axis-had-three-ways-to-fail-and-none-to-succeed).
All five arms are from the same build; the 08-21 authority run is **excluded** — it predates the fixes,
and comparing four fresh arms against a stale fifth is the error class this phase kept finding.

| requested | produced | rubric | shipped | cost | minutes |
|---|---|---:|---|---:|---:|
| temporal | **temporal** | 68 | yes | £0.76 | 17.8 |
| spatial | **spatial** | 71 | yes | £0.80 | 18.4 |
| identity | **identity** | 68 | yes | £1.97 | 22.2 |
| behavioral | **behavioral** | 69 | yes | £1.71 | 15.2 |
| authority | **authority** | 68 | yes | £0.92 | 16.0 |

**5/5 requested = produced. 5/5 shipped.** Total £6.18. Phase 0's exit condition — *"five manuscripts
across five axes"* — is met for the first time.

#### The axis now decides the mystery, not the label

The test that matters is not the `type` field, which X88 could have satisfied on its own. It is whether
the reader's error differs:

| axis | the false assumption the case builds |
|---|---|
| temporal | "the victim's death time corresponds exactly to when the poison was delivered and opened" |
| spatial | "the locked staff-only stairwell door was inaccessible without a key, and the shadows on the landing prove no one passed after dusk" |
| identity | "Captain Ivor Hale's presence in the laundry basement at the time of the murder is confirmed by trolley sightings and staff testimony" |
| behavioral | "Hugo Vane's gruff and straightforward nature means he would never engage in deceptive tampering or complex premeditation" |
| authority | "the hotel's official delivery logs and staff testimonies are accurate and authoritative" |

Five different reader errors — WHEN, WHERE, WHO, HOW SOMEONE WOULD ACT, WHO MAY BE BELIEVED — each
matching its [X92](REVIEW_05.md) gloss. Against 23 archived cases that were all temporal, and against
the 08-21 authority run whose locked facts were `high_tide_time` and `murder_claimed_time`, this is the
first evidence that the axis parameter does what it claims.

Both fixes verified in the shipped prompts: every run carried its axis definition, and
`timetable dependency` appears in the mechanism families of the **temporal** run only.

#### What the mechanisms show, stated carefully

Three of five still rest on a time or tide value, and that is **not** the X90 defect returning. The
setting is a seaside hotel for all five, and a tide is a real feature of one; what changed is that the
tide is now the mechanism *underneath* an authority deception rather than the deception itself. The
reader's error is the axis; the physics is the setting. That is correct Golden Age construction.

One piece of residual drift, benign today and recorded before it is not: Agent 3b returns the MODE
string `transit or seaside topology` inside `mechanismFamilyHints`, and `mergeHardLogicDirectives` adds
hints without the axis guard that `deriveHardLogicDirectives` now applies. A mode is not a family. It
introduces no foreign axis today because mode strings are not in `FAMILY_AXIS` — but it is a guard at
one call site and none at the next, which is this repo's most-repeated shape.

#### Geometry off-axis — the question §0.2 posed, answered

The prediction was that the 5 temporal-only codes would have *"nothing to read"*. They had plenty:

| axis | codes raised |
|---|---|
| temporal | time_anchors_absent, unaccounted_time, reveal_culprit_not_named, clearance_over_budget |
| spatial | time_anchors_absent, unaccounted_time, clearance_over_budget |
| identity | unaccounted_time, clincher_not_planted, reveal_culprit_not_named, reveal_times_not_stated, clearance_over_budget |
| behavioral | reveal_culprit_not_named, aftermath_repeat, clearance_over_budget |
| authority | unaccounted_time, clincher_absent_at_payoff, clearance_over_budget |

Every case carries clock values whatever its axis, so the temporal codes stay live — `unaccounted_time`
on four of five. Geometry gating on **what the case contains** rather than on its label is therefore the
right design and needs no axis awareness, which settles that question.

**The finding geometry did surface is axis-independent: `clearance_over_budget` fires on 5 of 5.** A
violation that every run raises regardless of axis is not telling us about the story; it is telling us
the budget is set wrong. That is [2.3](#) on the board, and it now has five runs of evidence.

#### And the rubric still cannot rank them

68, 71, 68, 69, 68 — a spread of 3 across five structurally different books, against a measured error
bar of ±7. Exactly what [0.4](#) predicted. The sweep can tell you the five axes WORK; it cannot tell
you which produced the better mystery, and no internal number will until the scoring METHOD changes.

### The axis parameter — what was actually wrong, and what is left

The stated target is a generator that produces a mystery on **any** of the five axes as a parameter
choice. After 0.2's single run, four defects stood between the pipeline and that. Three are fixed.

| | defect | status |
|---|---|---|
| [X88](REVIEW_05.md#1218-x88-the-coercion-that-survived-its-own-fix) | a reverse alias map collapsed the axis LABEL — `identity` → `authority`, `authority` → throw | fixed, 9 tests |
| [X90](REVIEW_05.md) | the LOCATION injected a temporal mechanism family into every axis; `SeasideHotel` is the default | fixed, 35 tests |
| [X91](REVIEW_05.md) | the 13 seed exemplars reached **no** prompt, on any run, for any axis | fixed, temporal 2 / spatial 2 / identity 3 now reach it |
| [X92](REVIEW_05.md) | the axis was passed to Agent 3 as a bare word with no definition | fixed, 12 tests |
| — | **no `behavioral` or `authority` seed case exists** | **open — content, not code** |

Read together, the three new ones explain the corpus better than X88 alone did: Agent 3 was told the
word "authority", shown no exemplar of it (because no exemplar of anything reached it), and handed a
mechanism family list containing `timetable dependency`. **The only concrete steer it received pointed
at a clock.** 23-of-23-temporal is what that produces.

**The one open item is a writing task.** `selectRelevantPatterns` matches the axis exactly, so a
`behavioral` or `authority` run gets a definition and correct families but no worked case to pattern
against. Loosening the match would hand an authority run an identity exemplar — the X70
`mechanical → identity` mistake in a new place.

Audited, all 13 seeds, now that the axis is actually read:

| axis | seeds |
|---|---|
| identity | Moonstone, The Second Key, Sign of the Four, Valley of Fear (4) |
| temporal | A Study in Scarlet, Mysterious Affair at Styles (2) |
| spatial | The Leavenworth Case, Mystery of the Yellow Room (2) |
| behavioral | **none** |
| authority | **none** |
| unusable | The Big Bow Mystery (`timing_error / witness_suggestion` — a compound, matches nothing) plus 4 with no `false_assumption.type` at all: The Clue of the Twisted Candle, The Leak, The Secret Adversary, Trent's Last Case |

So **5 of 13 contribute to no axis**, and no retired spelling is hiding a behavioral or authority case
— checked, not assumed. Both gaps are editorial calls about real published novels, which is why
neither is fixed here: assigning an axis to Trent's Last Case, or inventing two exemplars to fill the
empty rows, would put fabricated patterns into a corpus whose whole value is that its 13 entries are
real books. Two seed CMLs and five `type` fields, decided by someone who has read them.

**What this changes about 0.2.** The four remaining runs are now worth doing and were not before: run
against the pipeline as it stood this morning they would have measured X90 and X91 rather than the
axis, and reported five successes. That is the same trap X70 fell into once already.

### The two decisions this phase was blocked on — taken 2026-08-22

**0.4 — what the headline IS.** *Decision: the internal number is a HEALTH signal. External reads are
the only quality measure.* Forced rather than chosen: 0b.0 measured the rubric's error bar at **±7–8 at
n=8**, against a 5-mark external gap, on both models tested. A number that cannot rank two books cannot
be a quality headline, and promoting the shadow rubric would have promoted an instrument whose noise
exceeds the difference it is being asked to resolve. Nothing here needs new code — it needs the project
to stop quoting the internal number as if it graded the book. **Consequence: every "did that change
help?" question routes through a paying reader until a different scoring METHOD exists.** Note "method",
not "model": 0b.0 falsified the model route specifically.

**0b.3 — the generation model.** *Decision: not yet, and the question is not close.* 0b.1 pulled the
craft lever exactly once, at n=1, through the ±7 instrument above — and the one thing it did establish
is that the pass 0b.1 was aimed at had never changed a word of output ([X84](REVIEW_05.md)/[X85](REVIEW_05.md)).
Declaring a capability ceiling on that evidence would repeat §3's own warning about *"diagnosing a writer
who has been handed 12.6% of the brief and never once line-edited"*. The cost work is also settled
against it: caching cannot fund a swap (it discounts every model equally), so Sonnet 5 at standard
pricing is **+68% uncached and +70% cached**. Revisit when there is an instrument that can tell whether
the swap helped — which is 0.4's problem, not this one's.

### What this does to the plan

- **0b.3 (decide about generation) can now be asked**, and the honest answer is *not yet*: the craft
  lever has been pulled once, at n=1, through an instrument that cannot resolve the difference.
- **0.4 (decide what the headline is) is now forced.** The internal number is a health signal. With a
  ±7 rubric and no separating judge, external reads remain the only quality measure.
- **The cheap-instrument route is closed.** Phase 0's exit condition cannot be met by upgrading a
  model; it needs either a different scoring method or a paying reader.

## 5. The order, and what it costs

```
 0a.1  LLM_HTTP_TRANSPORT=true                         free       <- start here
 0a.2  AGENT9_PROMPT_PREFIX_ORDER=true (already built) free
 0a.3  cost tracker: account for cached tokens         free
 0.1   read story_20260819-2302                        a reader
 0b.2  chapter prompt stable-first (~9%, not 40%)      free            <- and this, in parallel
 0b.0  rubric judge -> Opus 5                          DONE 08-21  FALSIFIED: does not separate
 0.3   rubric error bar                                DONE 08-21  +/-7, not +/-3
 0.4   decide what the headline is                     DECIDED 08-22  health signal only
 0b.1  frontier polish, one run                        DONE 08-21  no craft movement (n=1)
 0.2   one run per axis                                DONE 08-22  5/5, requested==produced
 ---- gauge exists, and the craft lever has been pulled once ---------
 1.1   X38-at-source flag half, + 1.2/1.3 ride along   ~GBP 1.5
 2.1   the gate-authority decision                     free + a replay
 2.3   fold-clearances flag                            ~GBP 1.5
 ---- reliability half settled or falsified -------------------------
 3.x   M6 re-read, craft ratio, contract audit         ~GBP 1.5 + free
 0b.3  decide about the generation model               DECIDED 08-22  not yet
 1.4   X69 motive noun                                 DONE 08-21
```

**0b.2 is free, and it is worth ~9% of the run — not 40%, and not a precondition for anything.**
The workload is 4.3:1, not 11.7:1; the cross-chapter shared prefix is 5% against a 29% ceiling, not
two thirds; and a stable prefix is a property of the PROMPT, not the model, so caching discounts every
candidate equally and leaves the premium where it was. Sonnet 5 at standard pricing is **+68% uncached
and +70% cached** — caching makes the swap marginally worse, because removing input shifts the weight
onto output where the premium is larger. See section 3 for the corrected table. Take 0b.2 because it
is free money, and decide the model on 0b.1s evidence rather than on an affordability argument that
does not hold.

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

---

## 7. The plan from here — written 2026-08-23, against a £1/run budget

§§4a and 5 close every Phase 0 item and leave the project with a working pipeline, a genuine new
capability (five axes), and **no gauge**. This section is the route out, and it carries a second
constraint the earlier sections did not: **each run must come in at £1.**

### 7.1 What a run actually costs — measured from `logs/llm.jsonl`, not from a report

Five sweep runs of 2026-08-22, every `chat_response` record priced at Azure list with cached input at
half rate. Reproduce with **`node scripts/run-cost-audit.mjs`**:

| axis | first-pass | repeat calls | total | vs `report.total_cost` |
|---|---:|---:|---:|---|
| temporal | $1.04 | $0.22 | $1.26 (**£0.99**) | 0.7636 |
| spatial | $1.32 | $0.17 | $1.49 (**£1.18**) | 0.8030 |
| identity | $1.14 | $0.42 | $1.56 (**£1.23**) | 1.9741 |
| behavioral | $1.03 | $0.12 | $1.16 (**£0.91**) | 1.7101 |
| authority | $1.07 | $0.23 | $1.31 (**£1.03**) | 0.9248 |
| **mean** | **$1.12** | **$0.23** | **$1.36 (£1.07)** | — |

**The budget is already met on average and missed on the tail.** Mean £1.07, range £0.91–£1.23. That
is the same shape as the score itself: the mean is fine, the *floor* is the problem.

**And the number this document has been quoting is not that number.** §4a's table (£0.76 … £1.97) came
from `report.total_cost`, which disagrees with the call log by up to **+47%**, is unlabelled as to
currency, and **ranks the runs wrongly** — it calls `behavioral` the second most expensive run when it
is the cheapest one measured. Third disagreeing cost source in this repo.

Where the money goes, mean per run:

```
Agent 9 prose, first pass    $0.84   62%   10 chapters x ~30K in / 4.5K out
per-chapter polish           $0.25   18%   claude-sonnet-5, 4-8 chapters
scoped regen                 $0.11    8%
everything else (25 agents)  $0.16   12%
--------------------------------------------
repeat calls, of the above   $0.23   17%   zero-repeat floor: £0.89/run
```

**The thing that blows the budget is the thing that lowers the score.** Repeat calls are £0.18/run on
a good run and £0.33 on a bad one — and they are retries, which is Phase 1's subject. **Phase 1 pays
twice**, and that reorders it above everything except the gauge.

### 7.2 Move 1 — the gauge, and it is a METHOD change this time · ~£2

0.4 was decided honestly and its consequence is unaffordable: every "did that change help?" through a
paying reader means roughly one decision per day.

**What has been tried, on both models, is CARDINAL scoring — put an absolute mark on one manuscript.**
That is the hardest question anyone can ask a judge, and it failed exactly that way: spread 7–8 against
a 5-mark difference.

**What has never been tried is ORDINAL. `packages/rubric-score` contains no pairwise anything.** The
question the project actually needs answered is not *"what is this book worth"* but *"is this one
better than that one"* — and forced choice between two texts is a far easier task than absolute
calibration, with no scale to drift on.

The calibration set already exists and nobody has assembled it:

| source | manuscripts | external marks |
|---|---:|---|
| `eval/results/external-read/manifest.json` | 9 | 68, 69, 73, 75, 76, 78, 80, 84, 86 |
| unregistered, on disk with the raw read beside them | 2 | `story_20260817-2209` **86**, `story_20260819-2047` **81** |

Eleven human-marked manuscripts, all present on disk, spanning 68–86 → **55 human-ordered pairs**,
including the 86-vs-81 pair that both cardinal judges got wrong.

| # | action | cost |
|---|---|---|
| M1.1 | Repair the ledger: register the 08-17 and 08-19 reads, repoint the 5 `storyPath`s that moved into `stories/_archive`. It is the project's only ground truth and it is 5/9 broken. | free |
| M1.2 | Build the pairwise judge — two manuscripts, forced choice, brief reason. Every pair **both ways round** (position bias is the known failure mode), n=3. | ~£2 for all 55 pairs on `gpt-4.1-mini` |
| M1.3 | **Gate:** ≥80% agreement with the human ordering on pairs ≥5 marks apart, and no worse than chance on ties. | free, a decision |

**If it passes**, the project has an iteration gauge for the first time and every later phase becomes
measurable without a reader. **If it fails**, cheap instruments are dead on both methods and the plan
becomes "one reader per milestone, never per change" — which is a real answer too, and changes how the
remaining money is spent. Either way this is the last cheap question left, and it costs £2.

### 7.3 Move 2 — hold £1 by capping the tail, not by shrinking the mean · free

| # | action | worth |
|---|---|---|
| M2.1 | **One cost number.** Make `report.total_cost` the sum of the call log, in a named currency, or delete it. Budgeting against a figure that mis-ranks its own runs is how §4a got two runs backwards. | free |
| M2.2 | **A per-run governor.** The run knows its own spend; make prose retries past attempt N take the scoped repair path instead of a full regeneration. Caps the tail at source. | free, ~£0.15 on a bad run |
| M2.3 | **Phase 1, for the money as well as the marks** — see 7.4. Repeat calls are 17% of the bill. | ~£0.18/run |
| M2.4 | **Take the prefix-order saving.** 0a.2/0b.2 are enabled; the sweep measures 18–36% cached against a 29% ceiling. | ~9% |
| M2.5 | **Do NOT cut the polish pass** at £0.20/run, despite 0b.1. It is the only craft lever that exists and 0b.1 measured it once, at n=1, through a broken gauge. It should be the **first A/B the pairwise judge runs** — polish on/off, six pairs. | — |

Target: **£1.00/run, £1.15 hard ceiling.** On today's numbers that is M2.2 plus one retry class.

### 7.4 Move 3 — spend the quality budget in evidence order

1. **Phase 1, reliability** (~£1.5, pays twice). X38-at-source behind `AGENT3_DEVICE_TIME_BINDING`;
   confirm X73's Act III contract (21 of 54 archived chapter retries, present in all nine runs that
   retried anything); `derivedFrom` uptake. All three ride one run.
2. **Phase 2, the two decisions** (free + ~£1.5). 2.1 first as a **free replay** of geometry over the
   archived manuscripts — would the 86-scoring runs have shipped under a blocking gate? The repairs
   must work before the gate is allowed to stop anything. Then 2.3,
   `AGENT9_FOLD_SUSPECT_CLEARANCES`: pacing's only named defect across three reads, now reachable.
3. **Phase 3, craft.** M6 re-read (X47 settled, so it is readable for the first time); the craft
   ratio; the **ten prompt contracts nobody has ever read** — free, and reading one of them found X63.
4. **The content gap.** Two seed cases, `behavioral` and `authority`, plus five missing
   `false_assumption.type` fields. Editorial, not code, and the last thing between the axis parameter
   and a genuinely general generator.

### 7.5 The target the arithmetic actually points at, and it is not prose

§4a's correction deserves to be the headline it buried: **`premise` is 7 in all twelve scored runs.**
It is the only genuinely frozen category, and unlike hook/atmosphere it has a clear upstream owner —
the premise is Agent 3's case design, not Agent 9's sentences.

**And the axis work just changed what Agent 3 can build.** Five reader-error shapes instead of one;
seed exemplars reaching a prompt for the first time in the project's history (X91). Whether that moves
`premise` off 7 is **unread** — five manuscripts sit on disk and no human has looked at any of them.

> **The cheapest remaining action on the board is to read one of the five axis manuscripts.** It costs
> a reader, it tests the one frozen category against the one lever that has just changed underneath
> it, and it adds a twelfth entry to the calibration set in 7.2.

### 7.6 The order

```
M1.1  repair the external-read ledger                 free
M1.3  read ONE axis manuscript (premise test)         a reader     <- start here, both of these
M1.2  pairwise judge + 55-pair calibration            ~GBP 2
M2.1  one cost number, named currency                 free
M2.2  per-run cost governor                           free
---- a gauge that ranks, and a bill that is legible ---------------
P1    X38-at-source + X73 confirm + derivedFrom       ~GBP 1.5 (one run, at GBP 1)
2.1   geometry replay over the archive, then decide   free
2.3   fold-clearances flag                            ~GBP 1.5
---- reliability settled; retries and money fall together ---------
P3    M6 re-read, craft ratio, 10 unread contracts    ~GBP 1.5 + free
      polish on/off, judged pairwise                  ~GBP 2
      two seed cases (behavioral, authority)          editorial
```

Under £10 of compute, one reader now and one per milestone. **What it does not promise is 90 every
run:** the measured arithmetic still projects best-ever-everywhere to 87.5, and nothing above changes
that projection — it changes whether the project can *tell* when it has moved.

---

## 8. The free half, built 2026-08-23 — and what the data changed

§7 asked for four free things before any paid run. All four are built, and one of them changed the
target.

### 8.1 The ledger — M1.1, and it was thirty-five, not eleven

`npm run ledger:external-read`. §7.2 costed the calibration set at **11 manuscripts**. On disk, beside
the manuscripts, were **35 external reads — 34 with a full ten-category table.** Ten human marks per
story, in plain text, machine-readable nowhere.

Re-derived at n=34 rather than n=8 by hand:

| | the boards said | the data says |
|---|---:|---:|
| best-ever in each category, summed | 84 | **85** |
| headline-minus-sum offset | +2..+7, mean 3.5 | **0..+8, mean 3.9** |
| best-ever-everywhere projects to | 87.5 | **88.9** |

### 8.2 The finding that reorders Phase 3

**Five of the ten categories have never been given a 9, in 34 reads.**

| never 9 | mean, best 8 | to 9 | the reader's own words |
|---|---:|---:|---|
| prose | 7.0 | 2.0 | *"a few generated phrases remain"* |
| dialogue | 7.1 | 1.9 | *"some catchphrases are still awkward"* |
| character_clarity | 7.9 | 1.1 | *"roles are stable"* — a floor property, not a character one |
| pacing | 7.9 | 1.1 | *"Chapter 9 repeats clearances after they are already resolved"* |
| opening_hook | 8.0 | 1.0 | *"Body, clock, weapon, logbook — strong hook"* |

The other five have reached 9: premise ×6, atmosphere ×2, ending ×2, plot ×1, clues ×1.

**This kills the "stack the existing bests" plan arithmetically.** 85 + 3.9 = 88.9. Reaching 90 requires
at least one of those five to break a record no manuscript has ever set — so the work has to be aimed
at that list and nowhere else. §7.5's *"premise is the frozen one"* was reading the INTERNAL rubric
(7 in all twelve runs); the external reader gives premise 7–9 and has awarded it 9 six times. **The two
instruments disagree about which category is stuck, which is one more reading of §2.**

### 8.3 The two levers built against that list

Both aim at categories from the table above. Both are free, deterministic, and flag-gated.

**[X93](REVIEW_05.md#1220-x93--the-fold-that-was-built-as-a-retry-and-the-ledger-that-made-it-worth-building-now) — pacing.**
The one category of the five with a named, repairable defect, in four of the top eight reads. X32 built
the detection and wired it to an outline ISSUE, which drives an outline RETRY — and 11 of 32 archived
outlines allocate the clearance job more than once, so the flag asked a third of all runs to re-roll
their outline to fix a defect a re-roll may reproduce. **That is the whole reason
`AGENT9_FOLD_SUSPECT_CLEARANCES` has been off since 2026-07-24.** It now folds instead: the scene that
OWNS the clearance job is marked, every other chapter is told not to re-argue it, no retry and no LLM
call. *Falsification: if the suppressed chapter comes back thin rather than repurposed, the outline
half was the one needed.*

**[X94](REVIEW_05.md#1221-x94--every-book-this-project-has-written-opens-the-same-way-and-it-is-one-line-of-arithmetic) — opening hook.**
`const styleIdx = (chapterNumber - 1) % OPENING_STYLE_ROTATION.length`. Chapter 1 takes index 0 on
every run of every case, forever, and chapter 1 is the only chapter `opening_hook` reads. Measured
across the 35 manuscripts: `pressed` 26%, `chill` 26%, `stepped` 23%, `gloved` 23% of first sentences.
The rotation prevents repetition WITHIN a book and the entropy linter confirms it; nothing checks
across books, and nothing could, because each run is scored alone. Now offset once per story by a hash
of the case title — deterministic, so a replay reproduces its openings.

**[X95](REVIEW_05.md#1222-x95--one-grounding-vocabulary-and-the-closed-list-that-shapes-every-opening) —
atmosphere and prose.** The other half of the same defect, and it turned out to be the two-body problem
for the eighth time: the sensory and atmosphere wordlists that gate every chapter opening lived in
**six** places and had drifted in both directions. They now render from one module. The closed list is
itself the defect — the same 18 sensory and 39 atmosphere words, identically, on every chapter of every
run, validator-enforced, which is why `chill` opens 26% of the archived manuscripts and `damp` 23%. The
prompt now leads with a rotating subset per chapter per story while the validator keeps accepting the
whole list, so **it cannot add a retry class**.

> **And the direction of that fix was the hard part.** The first version added the divergent word
> (`weather`) to the validator, reasoning that a gate accepting more can never cause a new retry. The
> suite disagreed, and the failing test was right: `chapter-validator.test.ts` grounds its NEGATIVE
> fixture on *"No one commented on the room or the weather"*, using the abstract noun to show what does
> not count as atmosphere. The gate was correct and the prompt was wrong. **Closing a two-body
> divergence still means deciding which body was right** — the union instinct was right for X79's
> mojibake list and wrong here.

### 8.4 The ordinal judge — M1.2, built, not yet run

`packages/rubric-score/src/pairwise-judge.ts`, 19 tests. `npm run judge:pairwise -- --dry` costs nothing.

0b.0 falsified the model route for CARDINAL judging on two models. Nothing had tried the ordinal
question. The harness is built around the two ways it could flatter itself:

- **Every pair is judged BOTH ways round.** A judge that prefers whichever manuscript is labelled A is
  right on half the pairs; a one-orientation harness reports that as 50% and calls it noise. A pair
  counts only when both orientations name the same book, and the flip rate is reported separately.
- **Pairs are bucketed by how far apart the humans put them, and agreement is reported per bucket.** A
  judge that only gets the 18-mark gaps right is useless for A/B work. Sampling is deterministic, and
  within a bucket the HARDEST pairs are drawn first.

**Cost, corrected:** §7.2's *"~£2 for all 55 pairs"* was costed against 11 manuscripts. 35 make 447
pairs at a 5-mark gap — 894 calls, ~$12. The default samples 40 pairs across the three buckets: **80
calls, $1.05 (~£0.83)**, inside the £1 budget.

Gate unchanged: ≥80% agreement on pairs the humans separated by ≥5 marks, with `n` printed beside it.

### 8.5 The order now

```
DONE   M1.1  ledger repaired + 34 reads parsed             free
DONE   X93   clearance fold, deterministic                 free   <- pacing
DONE   X94   per-story opening rotation                    free   <- opening_hook
DONE   M1.2  pairwise judge + calibration harness          free to build
DONE   X95   one grounding vocabulary + rotating palette   free   <- atmosphere, prose
DONE   M2.1  one cost number (scripts/run-cost-audit.mjs)  free
---- paid from here ------------------------------------------------
 next  M1.2  run the calibration                           ~£0.83
 next  M1.3  read ONE axis manuscript                      a reader
       P1    X38-at-source + X73 + the two new flags on    ~£1 (one run)
       2.1   geometry replay over the archive              free + a decision
       X95   the closed sensory vocabulary, one list       free build
```

**Four flags now wait on one run**, and between them they touch four of the five categories that have
never reached 9:

| flag | category | what a failure would look like |
|---|---|---|
| `AGENT9_FOLD_SUSPECT_CLEARANCES` | pacing | the suppressed chapter comes back thin rather than repurposed |
| `AGENT9_OPENING_STYLE_PER_STORY` | opening_hook | a new opening-grounding or sensory retry class appears |
| `AGENT9_SENSORY_PALETTE_ROTATION` | atmosphere, prose | `sensory_grounding` retries rise (it should be impossible) |
| `AGENT3_DEVICE_TIME_BINDING` | clues | `[X38]` still present at Agent 3b and Agent 7.5 |

None costs anything extra to carry, so they should ride the same £1 run — with the ordinal judge,
freshly calibrated, as the thing that reads the result. **Each is separately attributable**, which is
why they are four flags and not one.

---

## 9. RESULT — M1.2, the ordinal judge · 2026-08-23 · ~£0.85

**The gate is not met, and the interesting number is not the headline one.**

`node scripts/judge-pairwise.mjs --pairs 40` — 40 pairs drawn round-robin from the three gap buckets,
hardest-first within each, every pair judged both ways round on `gpt-4.1-mini`. 80 calls.

| bucket | pairs | consistent | agreement | 95% CI | vs a coin flip |
|---|---:|---:|---:|---|---|
| close (5–9 marks) | 14 | 69% | **67%** (6/9) | 35–88% | **p = 0.25 — not distinguishable** |
| mid (10–14) | 13 | 77% | 80% (8/10) | 49–94% | p = 0.055 |
| wide (15+) | 13 | 85% | 82% (9/11) | 52–95% | p = 0.033 |
| **overall** | **40** | **77%** | **77%** (23/30) | 59–88% | p = 0.003 |

*(Consistency corrected for one failed call — see §9.3. The script printed 75% and 64% by counting the
failure against the denominator.)*

### 9.1 What it means, stated as carefully as the numbers allow

**The method change is a real improvement and it is still not a gauge.**

- **Better than cardinal, decisively.** 0b.0's cardinal judge separated the 86 from the 81 by **+1.1
  against a spread of 7** — no signal whatever, on either model. Ordinal judging reproduces the human
  ordering on 23 of 30 rankable pairs, which is p = 0.003 against chance. **Asking a different question
  of the same model turned an instrument with no signal into one with a measurable resolution.**
- **And its resolution is not fine enough.** Agreement rises monotonically with the size of the human
  gap — 67% → 80% → 82%. That is the signature of an instrument reading near its limit: it sees large
  differences and cannot see small ones. **On the close pairs — the only bucket that resembles an A/B
  between two versions of this pipeline — 6 of 9 is not distinguishable from a coin toss (p = 0.25).**

So the honest statement is a resolution estimate rather than a pass/fail: **the ordinal judge resolves
differences of roughly ten marks and above, and cannot resolve five.** A lever worth one or two marks
remains unmeasurable, which is what every lever on this board is worth.

**§7.2's second branch is therefore the live one: one reader per milestone, never per change.** Note
what is NOT concluded — this does not say the pipeline cannot be measured, it says two methods on one
model family cannot measure it. What has actually been eliminated is *cheap* measurement.

### 9.2 What would settle it, and what it would cost

At n=9 the close bucket's CI runs 35–88%; it is compatible with a useful instrument and with a useless
one. Distinguishing 67% from 50% at p < 0.05 needs roughly **60–80 close pairs**, which is
`--pairs 200 --min-gap 5` at about **£4**, or a targeted close-bucket run at about £2.

**That is worth doing only if the answer changes a decision.** It does not: even at a true 67%, an
instrument that is wrong on a third of close comparisons cannot arbitrate a one-mark lever. The
cheap-instrument route is closed on the evidence already in hand, and £4 buys a more precise
description of a closed door.

### 9.3 Two defects the run found in its own harness

Both were found by running it, which is the only place either could have been found.

**A failed call was being reported as position bias.** One pair tripped Azure's content filter
(`violence: medium, filtered: true`) and `foldOrientations` folded the missing orientation in as
`inconsistent`, printing FLIP. **The harness built to stop "no data" becoming a finding was doing
exactly that.** Failures are now their own bucket, excluded from the consistency denominator.

Worth separating from the fix: **a pairwise prompt carries TWO murder mysteries, so it doubles the
violent content per call.** Cardinal judging never reached that filter because it only ever showed one
book. That is an operating cost of the ordinal method, not a fluke — 1 in 80 calls here.

**The Azure client ignored an injected cost tracker.** `AnthropicClient` has honoured
`config.costTracker` since it was written — the Agent 9 polish provider depends on it — and
`AzureOpenAIClient` silently dropped it, because the field was absent from its config type. So this run
reported `totalCost: 0`, and so did **0b.0's spend line**, which was never real. One capability, two
clients, one wired: [X84](REVIEW_05.md)'s shape exactly. Fixed; nothing in the pipeline passes a tracker
to that client, so no run behaviour changes.

---

## 10. RESULT — the four-flag run · 2026-08-23 · £1.10

`CANARY_CORE_INPUTS_YAML=scratchpad/axis-sweep/inputs.temporal.yaml` — the **same inputs as the 08-22
temporal sweep arm**, so the four flags are the only variable. Control:
`story_20260822-1028/the_tidal_hour_at_seabreeze_hotel.md`, run `mystery-1787389850329`, £0.99.

`mystery-1787500681233` → `story_20260823-1715/the_rising_tide_at_cliffhaven.md`. Shipped, release gate
`warning`, clue status `pass`, 10 chapters, 12,185 words, 22 min, **£1.10** (`node
scripts/run-cost-audit.mjs --run mystery-1787500681233`).

**All four predictions confirmed, no falsification fired, and the run found a defect in one of the
fixes.**

### 10.1 X94 — the first non-`character-action` opening this project has produced

| | chapter 1's first sentence |
|---|---|
| control | *"Eleanor Voss pressed her gloved palm against the cool brass handle and entered the Seabreeze Hotel lounge…"* |
| four-flag | ***"Is that—?"** The question faltered in the cold haze as Eleanor Voss stepped onto the rough shingle…* |

The shipped prompt carries it: `Chapter 1: OPENING STYLE (HARD): Start the VERY FIRST SENTENCE with
spoken dialogue`. Against 35 archived manuscripts that all opened on a named character performing a
physical action, this is the first one that does not.

### 10.2 X93 — the fold fired harder than expected, and the thin-chapter falsification did NOT

```
[X32] Outline gives a suspect-clearance job to 4 scenes: Conflicting Timings;
      The Weapon and Wounds; Discrepancies and Doubts; Clearing the Innocents.
[X32] Suspect-clearance fold: 4 scenes carry the clearance job; kept in scene 8 (act 3),
      suppressed in 3.
```

**Four scenes, not two.** The archived estimate was "11 of 32 outlines allocate more than one"; this
one allocated four. Verified chapter by chapter in the shipped prose prompts:

| chapter | block |
|---|---|
| 2, 3, 6 | `SUSPECT CLEARANCE (already settled)` |
| 8 | `SUSPECT CLEARANCE (settle it here, once)` |
| 1, 4, 5, 7, 9, 10 | none — no clearance job, so no block |

**The falsification was that a suppressed chapter comes back thin.** It did not:

```
control    ch9 "Clearing the Innocents"   779 words   <- shortest chapter, the defect the readers named
four-flag  ch2  983 · ch3 1104 · ch6 1393              <- the three suppressed chapters
four-flag  ch8 "Clearing the Innocents"  1138 words   <- the keeper
```

The shortest chapter in the new book is 983 words against the control's 779, and the clearance chapter
gained 359. On n=1 that is not proof the pacing complaint is gone — only a reader settles that — but
the specific way this fix could have failed did not happen.

### 10.3 X95 — safe, as predicted, and the run caught it being slightly wrong

Zero `sensory_grounding` or `atmosphere_grounding` retries; **13 repeat calls against the control's
15**, and no new retry class. The prediction was that this *cannot* add one — the validator still
accepts the full list — and nothing contradicted it.

The palettes are visibly rotating in the shipped prompt:

```
ch1 sensory  shadow/rough/cold/silence/fragrance/smell
ch2 sensory  echo/odor/dim/glow/damp/creak
ch1 atmos    haze/evening/midnight/grey/damp/mist/midday/cloudy/chill/fog/season/sunlight
```

**Six words, where eight were asked for.** `groundingPaletteFor` strode by an odd number, which is not
the same as coprime: with `n = 18` a stride of 3, 9 or 15 visits only `18 / gcd` distinct indices, so
the walk exhausted at six. Harmless — six words is ample and nothing failed — but a function silently
returning less than it was asked for is the class of defect this project keeps paying for, and the
original test used one seed on the 39-item list and never saw it. Fixed (stride advanced to
coprimality) with a test across six seeds × ten chapters × both lists.

**It was found by reading the prompt the run actually shipped.** Not by a test, not by the score.

### 10.4 X38-at-source — and `derivedFrom`, which Phase 1 listed as an open question

```
[X38] device arithmetic repaired at source: time_delay_interval declares itself derived from
      high_tide_time and weapon_release_time, which are 5 minutes apart …
```

Exactly **one** `[X38]` in the whole run — the at-source repair — and none at Agent 3b or Agent 7.5
downstream. That is [1.1](#)'s prediction met.

It also answers [1.3](#) in the same line. *"X38's repair now acts only on a declared dependency, and no
archived device declares one — if Agent 3b does not populate it, the repair stays correctly inert and
the prompt needs work."* **Agent 3b populated it.** The device declared its own derivation, for the
first time in the project's history, and the repair acted on it.

### 10.5 What this run does NOT tell us

The internal report grades both runs **B, 100, pass_rate 100, retry_stats all zero** — indistinguishable,
which is [0.4](#)'s decision arriving on schedule rather than a surprise. And [§9](#9-result--m12-the-ordinal-judge--2026-08-23--085)
has just established that the ordinal judge resolves ten marks and not five, so it cannot arbitrate
this either.

**Four mechanisms are confirmed to work. Whether the book is better is unmeasured, and on this
project's own evidence only a reader can measure it.** That is the whole of §7.2's second branch, and
it is now the binding constraint on everything that follows.

> **The cheapest next action remains one external read** — and it is now worth more than it was
> yesterday, because there is a matched control (`story_20260822-1028`, same inputs, flags off) to read
> it against. Two reads of a matched pair is the only instrument this project has that can resolve
> five marks.

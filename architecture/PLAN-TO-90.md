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

---

## 11. THE READ — four flags, externally scored · 81/100 · 2026-08-23

`story_20260823-1715/the_rising_tide_at_cliffhaven.md`, cold read. **81/100**, category sum 79, offset
**+2** — the lowest offset in the series, so the reader was slightly *less* generous than usual relative
to the categories. Joint-4th of the 35 reads on file.

| | premise | hook | plot | char | dial | atmos | clues | pace | end | prose |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| **this read** | **9** | 8 | 8 | 8 | 7 | **9** | 8 | 8 | 8 | **6** |
| best ever (n=35) | 9 | 8 | 9 | 8 | 8 | 9 | 9 | 8 | 9 | 8 |
| top-8 mean | 8.8 | 8.0 | 8.0 | 8.0 | 7.1 | 8.4 | 8.0 | 7.9 | 8.1 | 6.9 |

### 11.1 What the four flags did, one at a time

**X93 (pacing) — the defect is gone; the mark is not.** Every previous read of a top manuscript said
some version of *"Chapters 9–10 repeat the reveal/clearances"* — four of the top eight. This one says:

> *"Good build and a real test chapter; **Chapter 10 mostly works as aftermath**."*

**That complaint has not been absent from a read before.** The mark stayed at 8, and the fastest-fixes
list still contains *"Keep Chapter 10 as aftermath-only"* — but as a note about the first line being
report-like, not about the chapter re-proving the case. **The fold did what it was built to do, and
pacing did not move.** Which means pacing at 8 was never held down by that complaint alone.

**X94 (opening hook) — landed, and moved nothing.** Chapter 1 opened on dialogue for the first time in
the project's history. The mark is 8, and the reader's note is the same inventory of props as always:
*"Body at tide line, harbormaster time, pipe, blood, scrape marks — very good."* On n=1 against a reader
whose own reproducibility we measured at ±1 (§11.3), **this is evidence against the ch1 opening style
being the lever for `opening_hook`.** The hook is not held down by how the first sentence is shaped.

**X95 (atmosphere, prose) — atmosphere took a 9; prose took a 6, for reasons the palette cannot touch.**
`atmosphere` 9 is only the **third in 35 reads**, and the note is unusually specific: *"Cliffhaven,
shingle, tide, mist, seaweed, hotel lounge — excellent setting-mechanism fit."* Not attributable to the
palette on n=1 — a tide mechanism in a seaside setting is a genuinely good match — but it is the
category the palette aimed at, and it hit its ceiling.

`prose` at **6** is the drag on the whole score, and the reader named the cause precisely. See §11.2.

**X38-at-source (clues) — 8, with the timing complaint intact.** *"Stronger than previous tide drafts,
though the exact timing needs one cleaner sentence."* The device arithmetic is now repaired where it is
authored, and the reader still wants the true/false pair stated in one line — which is
`reveal_times_not_stated`, a geometry code that already exists.

### 11.2 The prose mark, and the two defects behind it

Both trace to **one block in the prose prompt**, and both are deterministic.

**A — a locked-fact value carrying an indefinite article.** The registry holds:

```
high_tide_time        "ten minutes past eleven"
weapon_release_time   "a quarter past eleven"      <- the article is INSIDE the value
```

Both are handed to the writer under a HARD verbatim contract — *"reproduce those exact words"*. The two
are not parallel, so the model regularises them, and the book contains **"a ten minutes past eleven"
about ten times**, including the line the reader quoted:

> *"By then it was a ten minutes past eleven. It had taken fifteen minutes in all. By then it was a ten
> minutes past eleven."*

That sentence also appears **twice**, as do four others: the paragraph-fingerprint linter dedupes
paragraphs, not sentences.

**B — the locked-fact DESCRIPTION reaching the page.** The prompt renders each fact as
`description: "value"`:

```
- The official high tide time on the murder day as per hotel tide charts: "ten minutes past eleven"
```

The description is internal metadata. It surfaced in the prose, paraphrased under anti-repetition
pressure into something worse than itself:

> *"The **certified wave crest hour** atop the murder day **as per innkeeper's tide charts** was clear."*

`as per … tide charts` and `the murder day` are lifted from the description; `official high tide time`
became `certified wave crest hour` and `hotel` became `innkeeper's` because the writer is under
instruction not to repeat a phrase. **This is the mechanism behind *"generated validation language"* —
the complaint attached to `prose` in read after read.** It is not a vocabulary problem and no wordlist
reaches it.

**The reader's own forecast:** *"With the timing phrased cleanly and the generated lines removed, this
could reach 86–89/100."* Both defects are detectable in code.

### 11.3 A byproduct: the external reader's own error bar, measured for the first time

The read that arrived before this one was of a different book — `the_pendulum_s_secret_chime`, the
2026-08-06 wire-hinge draft. That turned out to be worth having, because
`story_20260807-1112/PROVENANCE.txt` records it as a deliberate single-variable experiment: the 84-scoring
manuscript with **two paragraphs of chapter 10 rewritten** by the aftermath-repeat regen pass, created
specifically so *"a second cold read isolates that one complaint completely"*. It had never been read.

| | 08-06 source | 08-07, two paragraphs repaired |
|---|---:|---:|
| headline | 84 | **85** |
| prose | 7 | **8** |
| **pacing** | **8** | **8** |
| the other eight categories | — | **identical** |

**Nine of ten categories identical across two reads.** Two things follow:

1. **The external reader is stable to about ±1** — against the LLM judge's measured spread of 7–8
   ([§9](#9-result--m12-the-ordinal-judge--2026-08-23--085)). This is the first direct measurement of
   the only instrument this project trusts, and it justifies the trust.
2. **A two-paragraph repair did not move pacing**, and the reader restated the same complaint:
   *"Chapter 10 then repeats the clearances and re-demonstrates the mechanism."* The defect was
   structural, not two bad paragraphs — **which is precisely the argument X93's fold makes over
   paragraph-level repair**, arriving independently and before the fold was read.

### 11.4 Where this leaves 90

```
this read            81   (sum 79, offset +2)
prose at its ceiling +2   -> 83     the two defects in §11.2 are worth about this
best-ever-everywhere 85   + offset 3.9 = 88.9
```

Nothing here changes §8.2's arithmetic: **five categories have never reached 9**, and this read added a
35th confirmation for four of them. What it changes is the ORDER — `prose` is now the largest single gap
on the best manuscripts (top-8 mean 6.9 against a ceiling of 8), it is the category this read scored
worst, and for the first time its cause is named down to two specific mechanisms rather than described
as *"generated phrases remain"*.

---

## 12. WHERE THE BOARD STANDS · 2026-08-29

Six days of work (A_75) sat outside this board. This section folds it in. The headline: **the best run
yet scored 85**, the ledger reached 44 reads, and `prose` — which §11.4 named as the largest single
gap — now has an *instrument* and *five named defects* rather than a description.

### 12.1 The arithmetic, refreshed at n=43

```
category            mean   max   top-8   gap to 9
  premise            8.1    9     9.0       0
  atmosphere         7.6    9     8.5       0
  opening_hook       7.3    8     8.0       1   <- never 9
  plot_structure     7.3    9     8.1       0
  pacing             7.2    8     8.0       1   <- never 9
  clues              6.9    9     8.3       0
  ending             6.8    9     8.3       0
  character_clarity  6.6    8     8.0       1   <- never 9
  dialogue           6.4    8     7.1       1   <- never 9
  prose              5.8    8     7.3       1   <- never 9, LOWEST mean AND lowest top-8

offset (headline - sum): 0..8, mean 4.0      best-ever-everywhere: 85 + 4.0 = 89.0
```

**Best-ever-everywhere still lands at 89.0.** §8.2's finding survives another nine reads: 90 needs a
mark no manuscript has ever earned. And `prose` is the weakest category on both measures — lowest mean
(5.8) *and* lowest top-8 (7.3). §11.4 ordered it first; that ordering holds.

### 12.2 What A_75 added: an instrument, then one axis

The machine-register **rate** is now measured against all 44 reads:

```
rate @3 vs prose  -0.471        rate @3 vs HEADLINE  -0.638        (crit 0.299)
```

It predicts the *headline* better than it predicts `prose`. **It is the strongest predictor of book
quality this project owns.**

A 16-statistic sweep then asked whether anything else predicts the mark. Two rivals appeared and both
**dissolved** under a partial correlation controlling for register — questions/1k (−0.312 → −0.263)
and mean paragraph words (+0.261 → +0.171), against a 0.302 threshold. Dialogue share, sentence length
and sensory-verb density showed **no relationship at all**.

So there is one axis and it is abstraction. That is worth more than the defect list below, because it
says what *not* to build: the three levers a craft intuition reaches for first are all dead ends.

### 12.3 Five defects, ranked by evidence — not by size

| # | defect | evidence | state |
|---|---|---|---|
| 1 | X38 repair never reached the page — registry corrected, device kept the stale value, the writer reads the device | causal, verified on the artifact, the reader's #1 issue on the 85 | **FIXED**, unconditional, shipped |
| 2 | The finale has no concrete deliverable | Welch t=4.47, n=248 (position-controlled t=1.73) | `AGENT9_AFTERMATH_GROUNDING` |
| 3 | Length ratchet with no pawl — `wordScore` is 35% of the score, one-way, rolls forward 4 chapters | rho 0.121, n=1,831, survives all controls | `AGENT9_LENGTH_COUNTERPRESSURE` |
| 4 | Our injections land on the worst chapters — strip the pasted sentences and 1.58 of the 2.49 points remain | t 4.59 raw → 2.80 controlled | `AGENT9_RECAP_STRIP_INJECTED` |
| 5 | The best instrument owned is not a lever | n=44 | not built |

They are one defect: **the pipeline pushes prose toward abstraction and has no counter-force.**

### 12.4 The debt this board is carrying

**Ten flags are built, tested, registered and have never executed:**

```
AGENT9_AFTERMATH_GROUNDING     AGENT9_LENGTH_COUNTERPRESSURE   AGENT9_RECAP_STRIP_INJECTED
AGENT9_VOICE_SPEC              AGENT9_CLUE_LIST_GRAMMAR        AGENT9_REGEN_CONVERGENCE_STOP
AGENT9_CROSS_CHAPTER_ECHO      AGENT9_CLEARANCE_TRIM           AGENT3B_ARITHMETIC_REGEN
AGENT2B_OBSERVABLE_DETAIL
```

§6 of REVIEW_05 is the rule that applies: *a detector that has never been run against real prose is a
hypothesis*. Ten of them are hypotheses.

**The cheapest honest next step** is one matched pair (~£2) with the three abstraction flags on
(2, 3, 4 above), read on the register rate rather than on a judge — because [[the rubric cannot rank
two books]] and the register can. That measures the axis directly, on the instrument that predicts the
headline at −0.638, without buying another unrankable score.

**What it cannot do** is prove a mark moved. Nothing short of an external read does that, and a single
read carries ±3 marks of noise (§30).

---

## 13. THE A_82 FOLLOW-UP BATCH · 2026-09-03 · £0

Free work only. **Nothing here has been run**: every item is T1/T2 (unit tests and archive replay)
under [A_81 §1](../documentation/analysis/ANALYSIS_81/ANALYSIS_81.md)'s tiers, and that document's
load-bearing claim — that the tiers do not substitute for each other — applies to all of it.

### 13.1 The batch started from a stale list, and that is the first finding

A review of "what free work remains" produced eight items from A_82 §12.15 and §14. **Five were
already built and committed** (`4197461d`..`c9075535`): P4, P5, P10, the P2 ceiling remainder
(`AGENT9_PROMPT_TOKEN_CEILING=40000`) and the forbidden-time-form ship-check. §12.15's own header
still reads *"nothing applied"*, which was true when written and false by the time it was read.

**A board that records a plan and not its execution will buy the same work twice.** The rows below
carry their commit, and §12.15's header is left as-is deliberately — it is accurate as of its date,
and rewriting history to look tidier is how a ledger stops being trustworthy.

### 13.2 A shipped fix that did not catch its own defect — MEASURED

`4ba9acf6`'s forbidden-time-form ship-check was verified against the **real artifact** rather than
its fixture. On the real inputs it emitted **18 warnings across 9 chapters and not one named
"half past nine"** — the defect it was written for. Two bugs, which concealed each other exactly in
the fixture and exactly not in production:

| | bug | consequence |
|---|---|---|
| 1 | the cross-fact filter normalised hyphens but not the leading **article**, so the case's own locked `"a quarter past nine"` did not match the generated `"quarter past nine"` | the case contradicted itself — **16 of the 18 warnings** |
| 2 | `.find()` returned the FIRST forbidden phrase present, and the false positive sorts before the real defect in the one chapter carrying both | the true defect was **masked in the only chapter that had it** |

**The fixture is what let both through**: it hand-wrote the value as `"quarter past nine"`, dropping
the article the real artifact has, so bug 1 could not fire and bug 2 never had two candidates to
choose between. Fixed: article-insensitive comparison, `.filter()` not `.find()`, hits classified as
`VALUE DIFFERS` vs `same value, different form` with the fidelity ones sorted first, and one line per
chapter per phrase instead of one per contradicted fact. **The same real inputs now give 2 messages,
led by ch8's "half past nine".** Fixtures re-derived from the artifact.

*(It is chapter **8**, not the "ch6" carried by A_82 §14.4 and two files downstream of it. The
reviewer's own text says Chapter 8. A documentation error that propagated, not a code defect.)*

### 13.3 The pronoun slip had no repair channel at all — MEASURED

A_82 §14.6: the gate reported *"2 pronoun issue(s) remain"* and the book shipped
*"the blood spread wide beneath him"* for a female victim. **Making that gate a hard stop is the
wrong repair** — §2.1 of this document is explicit that blocking on a defect whose repair does not
work converts ships into aborts. The question is why nothing repaired it.

Run against the real manuscript with the real cast (6/6 names matched, both known-positive controls
firing), `detectAttributionFlips` and `detectImpossibleSelfReferences` **both return 0** on that
chapter. They are the only producers for the A_66 P3 LLM regen channel, so there was nothing to
repair with. Detector (a) needs a dialogue tag; detector (b) needs a reflexive or a possessive over
the sentence subject's own body. "beneath him" is neither.

`detectVictimBodyPronounMismatch` is detector (c), feeding the same channel behind
`AGENT9_VICTIM_BODY_PRONOUN_GUARD`. **Baselined before wiring** (this file's own B1 rule, and the
6-gram precedent): projectId-scoped over 34 archived runs carrying both a `cml` and a `prose`
artifact, **1 fires, 1 event — the true positive, zero false positives.** An earlier revision fired
on 2; the extra was *"He cleared his throat"*, a live male speaker, now suppressed. On 33 of 34 runs
it does nothing at all.

**Two probe bugs were caught in the process, both returning confident wrong answers rather than
errors, both the same family — pairing a manuscript to the wrong artifact.** The second pushed a
name-matched cast whose declared victim was "Sylvia Trent" and came within one step of being
reported as a finding that the prose kills a character the case lists as a suspect. It does not:
this run's own `cml` artifact declares Dr. Mallory Finch the victim. **Pair by projectId, never by
name** — A_82 §13.0's scoping error in a second shape.

### 13.4 Why 375 to 375, answered — and it was not the flag

A_82 §13.6 left open whether the ch9 `aftermath_repeat` pass reads `AGENT9_REGEN_EDIT_LIST`. **It
does not, and cannot**: the pass is handed `rewriteChannelRegen`, built with `editList: true`
unconditionally since N7/X36. The flag is irrelevant to it, and the register row claiming otherwise
is corrected.

The real mechanism, measured from the run's own response log: **nothing was broken in the
application path.** The responses parsed, the edits spliced, the paragraph changed between attempts.
The model rewrote the wrong half — it deleted the sentences a human would call "the restatement" and
kept the two the detector keys on. Leave-one-out isolates *"I did it to protect you, yes."* and
*"Justice by deception."*; removing either clears the flag.

The cause is upstream of the model: `detectAftermathRepeatParagraphs` returns `number[]`, discarding
its own evidence, so the regen instruction named a paragraph INDEX and five possible offences and
let the writer guess which words were radioactive. It guessed wrong twice, at about a cent a guess,
on a byte-identical prompt both times. `explainAftermathRepeatParagraph` recovers the evidence by
leave-one-out over the SAME predicate body (one implementation, called by both — the header on that
function is explicit that a second body is the trap this file keeps paying for), and the instruction
now quotes the sentences. Fail-safe: no explanation means the previous generic wording.

**The general lesson, and it is bigger than this pass:** a defect the acceptance validator cannot
see can never be repaired, only re-attempted for ever — and "rewrote it and it still fails" prints
the same string as "never touched it". Detector (c) above is counted on BOTH sides for exactly this
reason.

### 13.5 What landed

| item | state | evidence |
|---|---|---|
| `AGENT7_MOTIVE_PLANT_BEFORE_REVEAL` **ON** | the only lever built for A_82 §14.7, the one genuinely new reader ask | `motiveBeatCulprit` has two readers and no validator, lint or retry class — the same no-new-retry-surface test used for `AGENT9_REVEAL_CITES_PLANTS` |
| `AGENT9_VICTIM_BODY_PRONOUN_GUARD` **ON** | detector (c) feeding the existing A_66 P3 repair channel | baselined 1/34, zero false positives; 13 tests |
| forbidden-time-form check **repaired** | 18 warnings to 2, led by the real ch8 defect | verified against the real artifact; 9 tests, both bugs pinned |
| `aftermath_repeat` instruction **cites its evidence** | unflagged, fail-safe, same precedent as `418af985` | reproduces the leave-one-out finding on the real paragraph; 6 tests |

**What none of this is.** Not a score claim. Four of the five categories that have never reached a 9
are untouched by it, §12.1's arithmetic is unchanged, and best-ever-everywhere still lands at 89.0.
Three of the four rows are repairs to machinery that was already supposed to be working — which is
§3's "instruments that were blind" category, not a quality improvement. The honest expectation is
that a reader notices nothing, and the value is that the next run's telemetry means what it says.

---

## 14. A_85 — THE SENTENCE THREE READERS DELETED · 2026-09-08 · £0

The eleven September reviews were read against the code that produced them. Three categories sit a
full point below the rest and have never reached a 9: `ending` 6.36, `prose` 6.36, `clues` 6.45
(means, n=11). Each traced to a mechanism; one of them to a single sentence.

### 14.1 The ending — MEASURED

The reads of 2026-09-04 (83), 2026-09-04 (82) and 2026-09-05 (85) each quote the SAME closing sentence
and ask for it to be deleted: *"Kenneth has already confessed. Delete that."* It is
`buildCulpritEvidenceSentenceInScene`, the culprit-evidence floor's own text, and it is in the unread
2026-09-07 book too. `ending` was the only category that moved between consecutive books.

With the sentence stripped out, the REAL predicate (`culpritEvidenceLinkInText`, replayed from dist
over all four manuscripts) is false for every chapter of every book, and the failing term is the
culprit-term: **none of culprit / killer / murderer / responsible / "did it" appears anywhere in any of
the four books.** They confess with "confessed", "killed", "I did", "it was I" — while the verdict-closer
rules forbid the model the one word the list knows. The seven September books that escaped the floor
did so on a single stray "did it". A predicate that passes on one stray word is a coin flip; a floor
that fires on 4 of 4 is a template with extra steps (B1).

A second defect rides on the same sentence: after injection a later pass curls the quotes and adds a
space (`"You did it. ”` in `data/store.json`), and the registry pattern required `."`. So
`isInjectedSentence` returned false on the floor's own text in 4 of 4 books — the scaffold regen, the
clearance-trim scrub and the geometry acceptance were all blind to it.

### 14.2 What landed

| item | state | evidence |
|---|---|---|
| `AGENT9_CULPRIT_TERMS_WIDE` **ON** (`.env.local`, default OFF) | widens the culprit-term vocabulary to the words a confession is written in | replayed over the four books from dist: OFF fires 4/4, ON links each at its reveal chapter (7, 8, 8, 9) and stands down 4/4; a suspect named beside "because" still does not link; 10 tests |
| registry pattern for the in-scene sentence | tolerates the curly quote and space the shipped form carries; `isInjectedSentence` folds typography | dist: `isInjectedSentence(shipped)` false → true, raw array likewise (the geometry consumer bypasses the function); 130 registry/predicate tests green |

### 14.3 What was NOT touched, and why

- **prose** — the quoted "generator lines" are the locked-fact floor's four templates (6–8 of 13
  books). A_84 F1 fixed the scope split on 09-07 and the 09-07 book carries zero of the eight lines.
  That is n=1; the next read settles it. Nothing to add.
- **clues** — the 09-05 read's "timing wobbles" is a staged time outside the culprit's own alibi
  window. The alibi-span work in `packages/cml` (uncommitted, other session) cites that exact run and
  structures the window at birth. Not duplicated here.
- **dialogue** — 7 in 11 of 11 reads with no quoted defect beyond "distinct enough". No detector will
  move it; see the voice-fragment finding (X53).

**Prediction for the next run:** `enforceCulpritEvidencePresence` injects 0 sentences where a
confession is on the page, and the closing paragraph of chapter 10 carries no "You did it".
**Falsifier:** a read that says the culprit was never tied to the evidence.

### 14.4 The 78 read, traced — and four fixes built · 2026-09-08

Run 24901 (authority · seaside hotel · angle "an industrial chemist's laboratory") read 78/100. Its
three lowest marks — clues 5, prose 5, ending 6 — were traced to mechanisms the run itself logged.

| reviewer's words | what the run logged, BEFORE the reviewer | mechanism | fix |
|---|---|---|---|
| "two timing tricks compete" (clues 5) | X39 at Agent 7.5: *"The case keeps time twice and the two do not meet"* — device clocks 4:15/4:05 vs mechanism anchors 6:30/3:15 — plus four cross-artifact mismatch warnings saying "verify this is intended misdirection". Nothing verified. | 3b's off-axis tide clock (A_83); warn-only | **F4** `AGENT75_DROP_FOREIGN_CLOCK_FACTS` — X39 now names the facts; 7.5 drops them from the registry AND the devices artifact Agent 9 reads |
| "It had taken ten minutes in all", "The clocks put it at …" (prose 5) | locked-fact floor injected the tide values in ch4/ch5 — the model never wrote the tide clock, so the values were absent from the whole book and F1's book-scope stood aside correctly | the same tide clock | F4 (no values, no injection) |
| "Ch. 7–9 repeat the ledger proof" (pacing 7) | ch9 attempt 1 rejected for a clearance roll-call; attempt 2, roll-call removed, rejected: *"may be missing the discriminating test scene"* — after the run's own DT-scene check accepted the test in ch8; the message fires on ch9 AND ch10 in every logged run; replayed from dist, attempt 2 fails OFF and passes ON | `checkDiscriminatingTest` is chapter-scoped for a book-scoped obligation (the A_84 F1 shape) | **F1** `AGENT9_DT_CHECK_BOOK_SCOPE` — committed chapters passed in; stands down when the test is on the page |
| "Chapter 10 recaps" (ending 6) | ch10 rejected on both completed attempts: *"stages a fresh accusation / fresh confession"* — then HTTP 429, and the exception path shipped the best REJECTED draft verbatim | gate works, fallback undoes it | **F2** `AGENT9_FALLBACK_STAGE_MODE_REGEN` — one targeted aftermath regen on the flagged paragraphs before a rejected aftermath draft ships |
| "The cost of truth, he burden …", "Neville Ingram burden …" (prose 5) | atmosphere repair returned `original: "thought was never borne by one alone"` — the comma missing — and the A_71 tolerant matcher swallowed it, deleting "thought," | edit applied across a clause boundary, no re-validation | **F3** `AGENT9_PHRASE_EDIT_CLAUSE_GUARD` — a span with clause punctuation the original lacks is refused; both real edits refused (test) |

Also settled by this read: the "You did it" closing sentence (§14.1) did not appear for the first time
since 09-04 — the culprit floor injected 0. Verbatim overlap across ch7–10 is under 2% by 7-gram, so
the repetition the reviewer names is semantic and mandated, not copied; no similarity detector can see it.

**What is NOT fixed:** the model still cannot write an aftermath without re-staging (0/2 here, 0/22 in
A_84) — F2 repairs the draft, it does not teach the model; and 3b still authors a clock device off-axis —
F4 stops its numbers reaching the page, it does not stop the device. Both remain on the board.

18 new tests; 86 green across the touched suites; both flag audits clean. F2 is verified by build only —
its falsifier is the `[A_85 F2]` log line on the next fallback.

### 14.5 Two more from the 78 read, and three things measured dead · 2026-09-09

**F5 — `AGENT9_CLUE_PRESENCE_OBSERVABLE_POOL`.** Three of the seven "generator lines" the reviewer
quoted were in chapter 1, from the deterministic clue floor. The chapter-1 clue regen HAD run (it fell
off an earlier top-12 label list) and had written the observation correctly — "the entry's handwriting
was oddly heavy, the pressure uneven compared to the lighter, more practiced strokes". The presence
pool is the observable plus `pointsTo` ("pressure, discrepancy, suggests"): ten tokens, 55% required,
five matched. The five missed — forged, discrepancy, suggests, normal, style — are the inference. A
chapter-1 observation must not say "forged". So the correct prose was judged absent and the floor
pasted the label: "Pressure discrepancy suggests entry forged genuine", the inference, in chapter 1,
as machine text. ON: an early clue is present when its observation alone passes (union with the old
pool, never stricter). Replayed from dist on the real regen output: OFF false, ON true. Corpus reach on
the built predicate is small — 8 of 2,444 verdicts, 2 clues, 0 regressions — and is a LOWER bound,
because the stored books are shipped books whose chapters already carry the pastes the old pool then
matches on. (A token-pool-only estimate said 127; it ignored the semantic-family fallback. The built
figure is the one recorded.)

**F6 — `AGENT2_SHARED_HISTORY_EVENT`.** The reviewer's character note asked for exactly one thing —
"Add one specific history". MEASURED: the relationship web reaches every prose prompt (16/16 chapter
prompts carry the `sharedHistory` sentences verbatim), so the channel is live; over 705 stored pairs
9% name an event and 21% are a standing attitude and nothing else. ON: Agent 2's relationship schema
demands ONE specific past event per pair, with a FAILS/PASSES pair — an operation, not a rate. Prompt
capture from dist: absent OFF, present ON. `sharedHistoryNamesEvent` is the detector, for telemetry.

**Measured, not built:**

- **3b's off-axis clock device cannot be re-ranked.** Over 50 stored cases, 17 of 17 non-temporal
  cases have a clock-locking primary device, and 0 of 17 hold any device without clock facts among
  their five. Every device 3b writes locks a clock. X39 fires on 5 of 15 non-temporal cases (F4's
  reach); in the other 10 the CML adopted the device's clock — the story IS a clock story on a
  non-temporal axis. That is A_83's residue and needs 3b's schema, not a filter.
- **Locked-fact regen vs floor gate split** (the floor injected the tide facts with no regen label):
  INFERRED as a target-selection difference; not measured, and F4 removes the case that showed it.
- **Relationship reach is not the problem** — see F6.

Predictions for the next run: `[A_73] deterministic CLUE paste` on chapter 1 = 0 where the observation
is on the page; cast `sharedHistory` event rate above the 9% baseline (detector). Falsifiers: a read
that says an early clue was never planted; a cast whose histories name events and a read that still
calls them generic.


## 15. A_87 — THE JOIN THAT NEVER RESOLVED · 2026-09-11 · £0

The read of run 3252 (84/100, the first spatial book) complained that chapter 8 re-proves after the
confession and chapter 9 repeats chapter 8. The cause was not prose. That run's **64 Agent-9 prompts
carried zero `CULPRIT REVELATION REQUIRED`** — the reveal chapter was never told to name the culprit,
walk the deduction or state the kill.

Agent 3 names the reveal scene `act_number: 3 / scene_number: 6` in **45 of 45 archived runs**,
because that pair is the worked example in its own prompt. It resolves **0/45**. Chapter contracts in
Agent 9 have therefore been assigned by a keyword fallback for the life of the project.

| lever | flag | measured, offline, over all 45 archived (cml, outline) pairs |
|---|---|---|
| reveal-contract arbitration | `AGENT9_SCENE_REF_ARBITRATION` **ON** | exactly one reveal chapter: **28/45 → 45/45**; two chapters: 6 → 0; none: 11 → 0 |
| ref reconciliation | `AGENT7_SCENE_REF_RECONCILE` held | reveal refs resolve **0/45 → 45/45** |
| prompt placeholder | `AGENT3_SCENE_REF_PLACEHOLDER` held | removes the one constant copied 45/45; OFF byte-identical |
| global-scene reading | `AGENT9_SCENE_REF_RESOLUTION` | **RECOMMENDED AGAINST** — resolves 45/45 and lands on the `false_solution` beat in 43 of them |

**Three dead branches, one cause.** The reveal contract (fixed), the suspect-clearance coordinates
(fixed for clearances alone in A_76 §14, twelve days earlier, without anyone asking whether the other
consumers shared the defect), and `isPostRevealChapter`, which is false for every chapter of all 45
runs and which reconciliation does **not** fix — it compares a global index and a per-act index
against the same field, so for a final-act reveal the conjunction is unsatisfiable. Left unrepaired:
fixing it would newly activate a never-run naming constraint on every run.

**What this does NOT claim.** No score effect. The ch8/ch9 repetition is a plausible consequence of
the missing contract and nothing more. Everything above is a prompt-side measurement made offline
against archived artifacts; whether it moves `ending` or `pacing` needs a run and an external read.

Detail, including the two wrong intermediate numbers this work produced and how the fixture caught
them, in `documentation/analysis/ANALYSIS_87/ANALYSIS_87.md` §8.


## 16. A_89 — THE READER'S 79/100, GROUPED BY CAUSE · 2026-09-12 · £0

`read-20260911-2112`, the first behavioural book. Ten complaints reduce to FOUR causes, and three of
them are one shape: **a value that exists, is correct, and is discarded or contradicted downstream by
a rule nobody measured.**

| group | reader's mark | measurement |
|---|---|---|
| A · the case's arithmetic does not close | `clues` **5/10** | **15 of 21 cases (71%)** place the death outside every window the case itself states |
| B · the repetition is instructed | `plot`/`pacing`/`ending` 7 | **41%** median clue re-mandate rate over 47 runs; reveal + aftermath contracts collide in **37 of 39** runs |
| C · machine register | `prose` **6/10** | this book is **25th worst of 212** for repeated 6-word spans (118.8 per 10k vs median 17.3). The 8 lines the reader quoted are the MODEL'S, not our injectors |
| D · the motive never reaches the page | `character life` 7/10 | a 40-character label cap discards **747 of 752 (99%)** `relationship` strings before Agent 9 |

**A_87 made B2 universal and that is on this work.** The reveal contract now lands on the last
revelation beat, which is the final scene in 44 of 45 outlines — the aftermath chapter. The defect
moved rather than closing: run 3252 lost the reveal contract and the reader said chapter 8 repeats;
run 88651 put it on the aftermath chapter and the reader said chapter 10 recaps.

**No score claim.** Different axis from the previous read, one book, and the rubric cannot resolve
under ~7 marks.

Fix plan ranked in `documentation/analysis/ANALYSIS_89/ANALYSIS_89.md` §7 — cheapest and
reader-named first (casing restore; the 40-char cap), then contract exclusivity, then the temporal
closure gate.

## 17. A_90 — THE MATHS, FIXED WHERE IT IS AUTHORED · 2026-09-12 · £0

Two reads of one case (79, then 82 on the prose-only matched pair) both marked `clues` down for
arithmetic. A_90 asked why five months of temporal work had not moved it. MEASURED against all 53
archived cases:

| finding | number |
|---|---|
| the deception's own invariant (staged time inside the culprit's alibi, real time outside) fails | **13 of 48** decidable cases (27%) |
| …every one detected by the production-flag validator | **15 of 15** (incl. 2 unreadable windows) |
| …shipped with one since the 2026-09-05 flags | **0 of 4** — "detected and not enforced" was WRONG; every shipped violator predates the abort or the flags |
| clock values that anchor to no event of the case | 19 of 760 (3%), in 6 of 53 cases |
| the 82/100 case's device | 1 clock + 3 durations, none anchored → the arithmetic rule self-gated to nothing → "intermission starting at four o'clock", ending at twenty past, seven minutes long |
| who authors the 448 alibi clock values | **Agent 3**, rewriting Agent 2's window in 311 of 321 (97%) — not Agent 2 as A_90 §3 said |

Built, all flag-gated (`architecture/FLAG-AUDIT.md`), measured before wiring:

- **Move 2 — `AGENT3_ALIBI_PLAN`.** The culprit's alibi window is COMPUTED from the two death times:
  printed into the Agent 3 prompt per apparent/actual assignment, rendered after the call only when
  the emitted one breaks an invariant or cannot be read (location kept). Clears 15/15 archived
  violators, touches 0/38 clean cases, holds both invariants on 20,590/20,592 dial pairs. The abort
  on a timeline code becomes a repair.
- **Move 3 — `AGENT3_CHRONOLOGY` + `AGENT3B_DURATION_ANCHORS`.** The 3b prompt asks each non-derived
  duration for `anchor: {at, edge}`; the solver turns clocks + anchored durations into events and
  event-pair intervals and prints THE CLOCK into the Agent 3 prompt. On the 82/100 device it prints
  the line the reader wrote by hand: silent intermission thirteen minutes past four to twenty minutes
  past four (seven minutes).
- **Move 1 — same flag.** Every other clock value is declared in `constraint_space.time.anchors`
  first; `[A_90 chronology]` telemetry at Agents 3, 3b, 5 and 7 counts what leaks and where.
- **Move 0 — the pin.** `a90-archive-timeline.test.ts`: all 15 archived violators detected with the
  recorded codes, all 15 rendered clean.
- **Held OFF:** `AGENT3_CHRONOLOGY_ERRORS` — coherence findings as validation errors inside
  `generateCML`'s loop — until one run shows the rate (B1).

**Not built, with the reason** (`ANALYSIS_90` §10.4): free-text rewriting of windows in a post-pass
(it manufactures the contradiction it removes), anchoring as a gate (the reader's "4:20" WAS
anchored — to the wrong event), and THE CLOCK in the Agent 7/9 prompts (measure the leakage first).

**What the next run settles** (`ANALYSIS_90` §10.6, predictions written before the run): whether 3b
supplies the anchor, whether THE CLOCK survives into the case, whether the culprit copies the printed
window, and where clock values leak downstream.

**RESULT — run 81042 · 2026-09-12 · £1.29 · release gate warning, no fallback chapter, 9,404 words.**
Predictions: 1 not determinable (the device locked no free duration), 2 half FAILED (apparent "four
o'clock" on no locked value), 3 vacuous (the plan never printed — three locked clocks and both rules
self-gate), 4 HELD (17/17, 12/12, 12/12 anchored — the Move 1 operation was followed first time),
5 HELD — the read scored **87/100** with `clues` **8/10** (5 and 6 on the two previous reads) and no
"numbers do not line up" complaint; one read, so no score claim. One false positive caught by
telemetry with the gate OFF. The read's one time glitch ("froze at three past midnight past three")
was the atmosphere pass paraphrasing a locked value that the n-gram window had cut in half — refused
at nomination and at application under `AGENT9_PHRASE_LOCKED_BOUNDARY`. Built from it, pinned on
the run's own device: `AGENT3_DECEPTION_PAIR` (the interval's `derivedFrom` names the deception's two
clocks), repair-before-retry inside `generateCML`, a validator message that no longer says to move a
locked value, and the `statedLength` lookahead. Detail: `ANALYSIS_90` §11.

**THE 87 READ'S RECOMMENDATIONS, TRACED AND FIXED · 2026-09-12 · £0** (`ANALYSIS_90` §12). Seven
items; five built, each pinned on the run's own material: the reveal's three-step arithmetic
rendered from the numbers (`AGENT9_REVEAL_ARITHMETIC`); clue ownership by the PAGE, after 11 of 14
obligations in chapters 3–6 re-mandated evidence already on earlier pages and chapter 4 copied 24 of
its 57 sentences from chapters 2–3 (`AGENT9_CLUE_OWNERSHIP_BY_PAGE`); the outline label rendered as a
place phrase (`AGENT9_LOCATION_LABEL_PROSE`); the victim rescue reframing only what the validator
flags (`AGENT9_VICTIM_RESCUE_EXACT_PREDICATE`); and the atmosphere pass skipped, having authored 5
of the last 20 reader-flagged lines (`AGENT9_SKIP_ATMOSPHERE_REPAIR`). Two recorded, not built:
profile lines copied via STORY TO DATE, and one canonical location per scene at Agent 7. Next
instrument: the matched pair on run 81042's upstream.

**MATCHED PAIR ON THE §12 FIXES · 2026-09-12 · £0.45 · one lever WITHDRAWN** (`ANALYSIS_90` §13).
Three of five confirmed on the page: the victim-rescue frames, the time glitch and the atmosphere
pass's artifacts are all gone, and skipping that pass LOWERED repeated-span density (675 → 612 per
10k), which refutes the argument it existed on. Chapter 4's copying fell 24 → 1. But
`AGENT9_CLUE_OWNERSHIP_BY_PAGE` retired 16 of 31 obligations **including the reveal's own
culprit-direct clue**, and arm B came back with two rubric caps arm A did not have plus a geometry
warning that the reveal never named the culprit — **withdrawn, flag OFF**, with the finding that the
obvious guard ("never retire an essential clue") would be inert because 93% of archived clues are
essential. Two fixes fired without working, for the same reason in both cases: I changed one of
several places the value is printed (the location label reaches the prompt 4 times; the reveal
arithmetic is aimed by a CML coordinate that does not exist). Both upstream items recorded.

**RUN 10845 — THE FIRST SPATIAL BOOK · 2026-09-12 · £1.2 + £0.45 resume** (`ANALYSIS_90` §14). The
fresh run wrote 13,205 words and hard-stopped at the release gate over ONE clue: the deterministic
floor plants a clue's `observable` while the gate's matcher requires tokens from `description` and
`pointsTo`, and on this clue those are different sentences. Fixed at the floor (plant what the matcher
reads, accept only what it then sees) and pinned against the real matcher; the resume shipped 11,701
words, gate warning, no fallback chapter. **Predictions: a spatial case still fakes a time** (apparent
half past ten, actual twenty past); **anchoring held** (case 9/9, clues 7/7, outline 6/6); **repetition
was normal for the first time in this sequence** (14.4 per 10k against a median of 17.3); and **copying
did not return with the withdrawn lever off** (0 copies of 596 sentences), so run 81042's 29 were
case-specific. One defect found in the shipped book and fixed: the victim named as the object of a
kill verb was read as a live speaker by the validator's own predicate. **The first spatial read is
ready.**

**RUN 94118 — THE IDENTITY BOOK · 2026-09-12 · £0.75 + £0.45 resume** (`ANALYSIS_90` §15). The fresh
run died at chapter 7 under Azure rate limiting (six 429s, token quota −6,467 of 50,000); the resume
shipped 9,196 words, gate warning, no fallback. **An identity case still fakes a time** — four axes
of four. Four runs in, `AGENT3B_DURATION_ANCHORS` and `AGENT3_DECEPTION_PAIR` remain untested,
because no device has locked a free duration or a third clock. The book carries the FOURTH
consecutive rescue-frame artifact, on its third distinct surface (reported speech), and the cause
under all three is one divergence: `detectVictimAlive` has excluded reported context since A_58 and
`hasActiveUse` — the predicate the rescue mirrors — never did. Closed on both. One change was
withdrawn mid-build by its own test: moving the frame after a leading conjunction reads better and
would have risked aborts, because `RECOLLECTION_FRAME_RE` is anchored at the sentence start.
**Identity's third read is ready**, which completes the board's target for that axis.

**BUG CHECK OF THE WEEK'S CODE · 2026-09-17 · £0** (`ANALYSIS_96` §5.7). Every change since 2026-09-10
read, and every suspect RUN against the archive. Six defects fixed and pinned, the largest in A_96
F2: the beat dedupe kept the first occurrence, and `revelation` is the one beat whose duplicate is
the final scene — **23 of 65 stored outlines** would have lost their aftermath chapter to a `pattern`
label, with the flag ON. The two clearance strippers also dropped the confrontation clause of a
reveal scene whenever it mentioned the culprit's broken alibi (45 of 120 dropped clauses carried
reveal language) and are now one body. Neither would have been visible to a reader as anything but
"chapter 10 recaps". Three latent shapes recorded, not built. Suites green (3,169), flags clean.

## 18. A_97 — THE CORPUS, AND THE INSTRUMENTS THAT MOVED WITH IT · 2026-09-17 · £2.80

The reference library was 14 works and 719,552 words, and A_77 §15's 39-title list had been built by
opening a Gutenberg search page one title at a time. Enumerating the catalogue instead — one 21 MB
CSV, 79,381 English text rows — and filtering by the §8.1 clearance rule gives **517 rows**, of which
**431 are GREEN** in both jurisdictions.

| | before | after |
|---|---|---|
| works | 14 | **166** |
| words | 719,552 | **12,299,319** |
| encoded cases | 12 | **30** |
| novelty ledger | 14 | **28** (15 evidence-backed) |

**The point for this board is not the acquisition. It is that three instruments changed without any
code changing**, because all three were estimates taken from a 12-book sample:

1. **The canon's own register numbers.** `meanSentenceWords` canon 16.09 → **14.88**, and ours is
   14.88 — **the mean gap is now exactly 0.00**. `emDashesPer1000Words` 6.52 → **8.65**, so that gap
   is −7.64 rather than −5.51 and is now the largest countable operation gap on the board.
   `semicolonsPer1000Words` 4.82 → **3.66** — the old target was **32% too high**, and A_75 measured
   a semicolon instruction actually moving the count 5 → 13, so it is a target that gets acted on.
2. **The anti-copy threshold.** `DEFAULT_N` 10 → **11**. Same detector, same 229 known negatives: at
   12 works n=8 fired on 2.9% of them, at 165 it fires on **45.9%**, and n=10 went 0.0% → 0.9%. **A
   corpus change is a reason to re-baseline exactly as a code change is.**
3. **Coverage against A_77 §9.** `identity` 2 → **13** and `behavioral` 4 → **7** now meet their
   targets; `authority` 0 → 1 has an entry for the first time; the mechanism-family gap is 36 → 27.
   §9.1's hand-counted table had said `behavioral` was 0 since before the first re-encode.

The anti-copy index had to be rebuilt to survive this at all: a `Set<string>` of 10-grams costs 170
bytes each and would be 1.8 GB here. A sorted `Float64Array` of 53-bit fingerprints is 8 bytes each,
83 MB, with a computable collision rate of 4.4e-12 per queried n-gram.

**Five defects, four of them invisible to reading.** Three were in filters I wrote — an illustrator
counted as a co-author (which silently dropped four of the five reachable Van Dine novels), a
pseudonym mismatch whose first fix *still* lost *The Greene Murder Case*, and a `Math.min` that
accepted an Open Library record dating *The Moonstone* to 1800. Two were pre-existing: four scripts
defaulting at a closed session's scratchpad, and `corpus-derive` silently overwriting
`corpus-classify`'s judgements in the file they share. The one check that read like a validation —
"38 of 39 curated ids recovered" — never ran the function that was broken.

**NOT SETTLED: whether any of this makes a better book.** It is all input-side. The harness's accept
rate on newly acquired text is 18 of 24 against 8 of 8 on the August books it was tuned against, and
that is the thing to look at before the next batch is bought. 349 GREEN works remain unacquired, and
`library/candidates.json` is committed, so the next batch is a script invocation.

## 19. A_98 — ONE CORPUS, ONE HOME · 2026-09-18 · £0

A_97 grew the library to 166 works and the owner could still only see 14, because `/api/samples` read
`examples/` and the generator read `library/works/`. **Nine of the fourteen files in `examples/` were
byte-identical copies** of `library/works/<slug>/case.legacy.yaml` — git recorded every migration as
`R100`. A_77 §10.7 had specified the consolidation and nobody had done it.

`examples/` is deleted. Three AMBER works migrated in as `structural_only` with a per-work reason in
git; two entries that were never novels moved to `library/retired/`. `SEED_CORPUS_FROM_LIBRARY` and
`CORPUS_JURISDICTION` are both retired — the first because with one home its OFF position empties the
seed corpus, the second because one env var admitting every amber work at once is the blunt switch B1
argues against.

**The rule the board should carry forward, now paid for three times:** anything that restates a fact
must be generated from that fact and checkable against it.

| | two files, one fact, no derivation | cost |
|---|---|---|
| A_77 §4.3 | `seed-fingerprints.yaml` claimed to be derived, was hand-authored | wrong in **11 of 14** entries |
| A_97 §9.1 | `corpus-derive` and `corpus-classify` share `fingerprint.yaml` | a bare derive replaced **12 of 12** LLM families with regex guesses |
| A_98 | `examples/` and `library/works/` held the same cases | the UI showed **14** works while the corpus held **166** |

`library/manifest.json` is the index A_77 §10.2 asked for, generated with `--check` wired into
`npm run corpus:check`.

**Nothing here moves a score.** It is plumbing, and it is on the board because the next person to add
an index needs to know which side of that rule they are on. The state it leaves: 169 works, 30
verified encodings, 4 legacy, 135 awaiting encode, 24 seed cases reaching Agent 3, one directory.
*The Moonstone* — the genre's founding text — is still unencoded; it was the longest book in A_97's
batch, sorted last, and did not complete. ~£0.30 and one command.

## 20. A_99 — HOW TO GET TO 90 · 2026-09-18 · £0

**The board's arithmetic, re-run at n=61, gives the same answer it gave in §12.1: best-ever-everywhere
stacks to 89.** And two months of levers on the prose stage — sixty of them, measured, most working —
moved the mean from 80.5 (August, 20 reads) to 80.3 (September, 16 reads). `ANALYSIS_99` argues the
plateau is structural: five properties of the v1 prose engine, each MEASURED (it writes sentences the
model did not write; the unit is the chapter with prior chapters handed over to copy; a 31-block
compliance prompt; instruments that only point down; one draft, no selection), and that 90
consistently needs an engine without them. It supersedes the ORDER in §8.5 and in A_95 §5 with a
bounded rebuild — **Prose Engine v2**, alongside v1 behind one switch — in three phases: the floor
(delete the writers and the aborts), the engine (the book as the unit; contract + brief; best-of-three
by instrument; an anchored critic), and the writer (the frontier-draft experiment never run, then the
positive operations). Acceptance is defined before the first v2 read: three reads per book, median,
five consecutive books ≥ 90 and none below 88. ~£25 of runs, ~33 reads. The honest limit is in its
§8: no book has had a prose or dialogue 9, and the writer is the one lever never pulled.

## 21. PROSE ENGINE v2 — BUILT · 2026-09-18 · £0

`ANALYSIS_99` §10's design, implemented: `packages/prose-engine` (pure, no LLM client, 107 tests
replayed over all 53 archived projects), `apps/worker/src/jobs/agents/agent9-v2/`, and one switch at
the top of `runAgent9`. `PROSE_ENGINE` unset leaves v1 untouched. **Seven environment variables for a
whole engine, against v1's ~90.** M1–M5 and M8 are built; M6 is wired and needs a paid run; M7 waits
on three upstream fields.

Four defects were found by measurement during the build, each before a run could pay for it:

1. **The role table's first cut agreed with v1 on 19 of 53 outlines.** It read A_96 F10 — *the prose
   confesses at the earliest trap* — as the general rule, when the dominant arc is trap-then-
   revelation and the revelation names. Corrected to 51 of 53, both remaining disagreements being v1
   putting the kill statement on a chapter whose purpose is *"Officially clear all innocent
   suspects"*. A chapter between the reveal and the aftermath is now a CLOSURE chapter.
2. **The segmentation plan was sized from Agent 7's `estimatedWordCount`**, which over the 48 books
   with both an outline and a manuscript estimates 19,915 words against 10,870 delivered — a ratio of
   0.56 on every one of them. It put 41 of 53 books into act-sized segments for nothing; from the
   policy's target, 52 of 53 fit ONE call.
3. **An unrecognised writer model fell back to a blind 16,384-token cap**, silently re-segmenting a
   book that fits one call. Found by the dry run.
4. **THE LEDGER TOOK THE FIRST READ IN A FILE.** `story_20260912-1815/chatgpt-review.txt` holds three
   reads of one book — 79, 82 and **87** — and the 87 is the highest external mark this project has
   ever received. It was invisible to the ledger, to A_99's own arithmetic and to the selector's
   calibration.

> **CORRECTION, 2026-09-23 (A_101 §10).** The file holds three reads of **two** books, not three reads
> of one. 79 and 82 are reads of a ballet-intermission book whose drafts live in `story_20260911-2112`
> and `story_20260912-1507`; **87 is an as-written read of the Lockwood book in this folder**
> (`canary_1789232316543` — the manuscript's mtime equals its generation time, so not "after
> repairs"). The 87 is real and belongs to this book, so the arithmetic below stands; and taking the
> FIRST read had paired the Lockwood manuscript with the ballet book's 79, so W1 corrected a
> MISPAIRING — which strengthens the rho change rather than weakening it. `story_20260724-1747` has
> the same shape. The ledger is right on both by the owner's habit of pasting the newest read last,
> not by a check (A_101 §9, recommendation 5).

**§12.1's arithmetic is superseded by A_99 §9.1.** Best-ever-in-every-category is **87, not 85**;
opening hook and character clarity have each had a 9 (both on that book); the categories never given
a 9 are **three, not five** — prose, dialogue, pacing. Best-everywhere plus the reader's offset now
projects to **92–93 rather than 89**. The rebuild's case is unchanged and its target is nearer than
every document on this board recorded.

The same correction lifted every instrument's measured agreement with the reader: register −0.454 →
**−0.502**, dialogue-open +0.291 → **+0.337**, long sentences +0.241 → **+0.293**, wit +0.187 →
**+0.250**, and the selector's composite 0.524 → **0.571**, which clears the bar A_99 §10.6 set and
the first calibration missed.

**The next item is a paid one:** `RESUME_REDO=prose PROSE_ENGINE=v2` on a read project, ~£0.45, which
is the v1-versus-v2 matched pair against byte-identical upstream.

---

## 22. THE MATCHED PAIR, AND WHAT PREPARING IT FOUND · 2026-09-18

Two defects stood between the approved £0.45 and a valid measurement. Both would have let the run
complete and report success, which is the expensive kind.

### §22.1 A PROJECT'S SPEC WAS NOT ITS OWN — `f65dcd50`

`loadProjectSpec` fell back to `specs[specs.length - 1]` when a project had no spec of its own, and
its docblock said so as if it were a convenience. Canary projects persist artifacts but NO spec —
`makeJsonArtifactPersister` writes `artifacts` only — so **every canary project reached that
fallback**.

MEASURED: `canary_1789577884303` is SeasideHotel / Dark / private / **authority** / sharp. It
resolved to `proj_ae78f68a`'s spec: CountryHouse / Classic / amateur / **temporal**, angle *"a
retired general writing his memoirs"*. The pair would have run with a different book's parameters
and reported a clean result.

- a project with no spec now resolves `source: "none"`, and resume REFUSES rather than inventing one
- `stories/*/run-params.json` is consulted by the projectId **it** names, with the theme lifted from
  the generated seed file that run was launched from — provenance, not a guess
- `specToInputs` maps the store's `decade` onto `eraPreference`, which the API has always done
  (`apps/api/src/server.ts:698`) and **resume never did**: every resumed run since resume existed
  silently fell to Agent 1's `|| "1930s"` default, so a resumed 1890s book was re-dated

This is the shape recorded as *"fixture drift certifies the bug"* and *"parameters wired but never
sent"*, met again at the point where a measurement is paid for.

### §22.2 AN EMPTY ARTIFACT LANDED ON A FULL ONE — `dbba11c7`

Every reader takes the LAST row for a project and type, so an appended empty row is a silent delete.

MEASURED: two `PROSE_V2_DRY=1` dry runs — no LLM call, documented as costing nothing — appended two
0-chapter `prose` rows over seed 50862's 10-chapter book, and the store then reported that project
as having no prose. **No flag is needed to reach it:** a run that dies inside Agent 9 persists what
it has, which is nothing.

The guard is on the DATA, not on the flag that exposed it: an empty payload is refused only when a
non-empty one of the same type already exists for that project. A first empty artifact still writes.
The one writer every out-of-API path shares (`canary-core.mjs`, `resume-run.ts`) had **no tests**; it
has ten, including the row spellings the API writes — a guard that understood only its own camelCase
would have waved the erasure through on any store the API had touched, which is every real one.

### §22.3 TWO API SERVERS OWN `data/store.json` WHILE A RUN WRITES TO IT

Found while explaining why the two empty rows disappeared before they could be cleaned up: PIDs for
`apps/api/dist/index.js` and `apps/api/src/server.ts` were both live against this workspace. The API
rewrites the whole store from its in-memory copy, which was loaded at startup, so **a run's
write-back can be reverted by a server that never saw it**.

INFERRED, not measured — the disappearance is consistent with it and nothing else in the session
touched those rows, but no probe was run against a known-positive. The paid run works around it
rather than relying on the inference: `CML_JSON_DB_PATH` points reader and writer at a private copy,
so neither direction can disturb the other. **A_86 item 5's write-back is not safe against a running
API server, and that should be settled with a probe before it is depended on.**

### §22.4 THE FIRST PAID v2 RUN — `resume-1789750237998`, £0.14, AND IT REFUTED §10.4

Seed 50862 · `canary_1789577884303` · authority · 1930s · SeasideHotel · Dark · short · private ·
atmospheric · sharp · cast 6 · angle *"a record-attempt speed trial on the sands"*. Thirteen upstream
artifacts restored byte-identical; `PROSE_ENGINE=v2` the only change. 12 calls, 0 repeats, 1.2 min.

**The result: a 2-chapter book. 1,964 words against the v1 arm's 8,965.**

azure:gpt-4.1 was handed all ten chapter contracts and a 32,768-token cap, wrote CHAPTER 1 — about
1,300 tokens, 4% of the cap, not truncated — and stopped. The continuation was an `if`, so it ran
once, bought chapter 2, and the book shipped.

| prediction | verdict |
|---|---|
| `deterministic writes: 0` | **HELD** — the telemetry's first line, on a real run |
| the book written in ONE call per draft | **FAILED** — one CHAPTER per call, and §10.4's premise with it |
| 3 drafts, selector picks by composite | **HELD** — 3 drafts, scored, chosen |
| register rate below the corpus mean | **VOID** — 0.0132 against v1's 0.0552, but on 2 chapters |
| gate stops only for the two fair-play conditions | **HELD** — both fired, correctly, on a 2-chapter book |
| no deterministic fallback | **HELD** — no chapter fell back |

**§10.4's measurement was right and its inference was wrong.** 52 of 53 archived books fit inside one
writer response: they fit the CAP. They do not fit the model's idea of a turn. The fix is the
continuation loop, which keeps M2's actual goal — one contract, one voice, the whole book in context
— while letting the transport take as many calls as the model wants.

### §22.5 THE INSTRUMENTS PREFERRED THE BROKEN BOOK

Scored against the v1 arm, the 2-chapter manuscript won on **every instrument the selector measures**:
register 0.0552 → 0.0132, repetition 96.0 → 0.0, speech-open 0.174 → 0.232, long sentences 0.028 →
0.138, wit 15.6 → 76.4 per 10k.

None of that is an effect. Two chapters of careful prose beat ten of ordinary prose on every RATE,
because a rate has no opinion about a book that stopped. **The composite has no length term and the
selector compares drafts of the same contract, so it was never wrong — but a report that reads the
instruments without reading `chapters: 2 of 10` first would have called this a triumph.** The v2
telemetry names the missing chapters; the comparison script now prints the chapter count beside every
rate, and `agent9-v2-continuation.test.ts` fails the engine rather than the reader noticing.

### §22.6 TWO DEFECTS THAT MADE THE FAILURE PERMANENT AND INVISIBLE

**The checkpoint recorded the 2-of-10 segment as done** (`chosen: 1, stored: 2, expected: 10`), so
every later run on that project would have restored it and never called the writer. A truncated book,
made permanent, announced as *"restored from the checkpoint"*.

**The v2 telemetry never printed.** It is pushed to `ctx.warnings`, which the canary path prints as a
`WARNINGS` line and the RESUME path does not print at all — so the engine's whole instrument panel
was invisible on the one path the design names for matched pairs. The numbers above were recovered
from the prompt ledger and the artifact. Not yet fixed; it is the next item.

**Both v2 test files were skipping.** They derived the repo root from `process.cwd()`, which is right
only when vitest runs from `apps/worker`; from the repo root it resolved to `C:/`, the store was not
found and every test skipped. That is the *"3 skipped"* the worker suite has reported all along. 981
passing and 0 skipped now, up from 866 and 3.

### §22.7 THE SECOND v2 RUN — `resume-1789805865810`, £0.21 — THE FIRST HONEST PAIR

Same seed, same thirteen restored artifacts, `PROSE_V2_DRAFTS=1`. The continuation loop, the
checkpoint rule, the delivered-numbers fix and the telemetry print were all in. **10 chapters, 8,182
words, 23 calls, 0 repeats, 3.2 min, £0.21** — against the v1 arm's 10 chapters and 8,965 words.

| prediction | verdict |
|---|---|
| all 10 chapters arrive | **HELD** — 10 of 10, in 1 + 2 calls |
| 7,500–12,500 words | **HELD** — 8,182 |
| the telemetry prints | **HELD** — the block, ending `manuscript: 10 chapter(s), 8182 words` |
| register measured on a full book | **HELD** — see below |
| cost ≈ £0.34 | **BEAT** — £0.21; the model delivered several chapters per continuation, not one |
| gate stops only for fair play | **HELD in form, FALSE in fact** — one stop, and it was wrong (§22.8) |

**The matched pair, both arms 10 chapters:**

| instrument | v1 | v2 | z vs corpus |
|---|---|---|---|
| words | 8,965 | 8,182 | — |
| **machine-register rate** | 0.0552 | **0.0328** | −2.62 |
| repetition / 10k | 96.0 | **9.4** | −0.47 |
| speech-open share | 0.1739 | **0.1322** | −0.03 |
| long-sentence share | 0.0276 | **0.0613** | +1.57 |
| wit / 10k | 15.6 | **25.7** | +2.44 |

**Register — the only validated instrument — falls 41%, on comparable books.** Repetition falls 90%.
Long sentences and wit rise. **Speech-open share falls and that is the one regression**, from 0.174
to 0.132 against a corpus mean of 0.134: v1 was above the mean here and v2 sits on it, while the
brief asks for six speech-opening paragraphs a chapter. Wit reaches 25.7 against the sharp band's
target of 41, so the humour operation is landing at about 60%.

**Nothing here is a mark.** These are the instruments, not a reader, and the rubric cannot rank two
books. The pair says the prose moved in the direction every instrument agrees with; only a read says
whether it moved a mark.

### §22.8 THE STOP WAS WRONG, AND THE GATE HAD NO TESTS — `4a999116`

The run was recorded `status: failure` on one stop: *"the reveal chapter (9) never names Nora Quayle
as the murderer."* Chapter 9 says:

> *"Nora Quayle engineered the murder, exploited the authority of the judge, and doctored the records
> to conceal the truth."*

The verb list was `killed|murdered|poisoned|strangled|struck`. The prose used **`engineered`**, with
**`murder` as a noun**, so nothing matched. Re-running the fixed gate over that same manuscript and
its own artifacts: **SHIP true, no stops.** The book was compliant the whole time.

**This is the third time this project has paid for a closed vocabulary deciding a pass** — the guilt
marker with no blunt-force verb, the domain nouns colliding with a validator wordlist, and now this.
So the fix covers the CONSTRUCTION — agent plus guilt noun, a deed attributed to a name, a confession
— rather than adding one more verb to a list that will be missing the next word the prose uses.

The predicate runs in BOTH directions: the reveal must satisfy it and every earlier chapter must not.
Widening it too far would stop every book at chapter 1 instead, so four known-negatives pin it —
suspicion, speculation, exclusive knowledge and a counterfactual all still fail to count as an
accusation.

**The gate had no tests at all.** That is how a stop that fires on a compliant book shipped inside a
design whose whole argument is that only two things should ever stop a run. It has 9 now, including
the verbatim sentence.

### §22.9 WHERE v2 STANDS

Built, switched off by default, and now measured once against v1 on byte-identical upstream. What is
settled: the engine writes a whole book, writes no deterministic prose, reports itself, and moves
every instrument but one in the right direction, for £0.21 a run.

What is NOT settled, and should not be claimed:

- **whether it is worth a mark.** No read. The instruments are not the reader, and A_94's rule stands.
- **whether best-of-three helps.** This run used one draft, so the selector chose nothing.
- **speech-open share**, the one instrument that went the wrong way.
- **the 26 unresolved findings and 12 rolled-back edits** the telemetry reports — the editor applied
  37 and reverted 12, ten of them on `clockValuesIntact`, which is worth its own look.

**The next thing to spend is a read, not a run** — and the book to read is this one, because it is
the first v2 manuscript that is a whole book and its ship-check now passes.

---

## 23. v2 DEFECT REVIEW · 2026-09-19 · £0

Read of `packages/prose-engine` and `apps/worker/.../agent9-v2` (4,052 lines), with every finding
probed against the manuscript v2 actually produced (`resume-1789805865810`) rather than argued from
the source. **No code changed in this pass.** Six defects, ordered by what they cost.

### §23.1 THE FINDINGS PIPELINE SPENDS MOST OF ITS EFFORT ON FALSE OR UNFIXABLE WORK

On the real book the checkers produce **31 findings**, of which:

| class | n | verdict |
|---|---|---|
| `clock_off_table` | 11 | mostly FALSE, and 11 of 11 UNFIXABLE |
| `clue_missing` | 10 | 9 are obligations that cannot be satisfied (§23.2) |
| `clue_early` | 5 | not examined |
| `register_sentence` | 3 | genuine |
| `scaffold_token` | 1 | FALSE (§23.3) |
| `reveal_residue_in_aftermath` | 1 | not examined |

**D1 — `clock_off_table` compares only the chronology's `value`, and does not normalise apostrophes.**
`findings.ts:177` builds `tableValues` from `rows.map(r => r.value)`. Two consequences, both MEASURED:

- the table holds `nine o'clock` with a STRAIGHT apostrophe and the prose writes `nine o’clock` with a
  typographic one, so **five of the eleven findings are the same true time reported as off-table**;
- the numeric forms the prose uses — `eight fifty`, `nine fifteen`, `nine forty-five` — live in the
  row's `label` (*"eight fifty to nine fifteen — Harriet cleaning rooms"*), which is never compared.

**D2 — and no `clock_off_table` finding can ever be repaired.** The finding asks the editor to change
a clock value; `clockValuesIntact` (`edits.ts:212`) reverts any edit that changes the chapter's set of
clock dials. Measured by replaying the obvious repair for each of the eleven findings through
`applyEditList`: **11 attempted, 11 reverted, 11 of them by `clockValuesIntact`.** The run's own
telemetry says the same thing from the other side — `rolled back 12 [clockValuesIntact 10, ...]`.

This is the B1 shape twice over: a check that fires on most runs, whose repair the engine forbids.
**Fix D1 before D2** — most of the class disappears, and what remains needs a repair the guard permits
(re-word around the time, never restate it) or it should be a WARNING that no editor is asked to fix.

### §23.2 NINE OF TWENTY-THREE CLUE OBLIGATIONS CANNOT BE SATISFIED BY ANY PROSE

MEASURED: the contract carries 23 `mustSurface` obligations. **Only 14 have an id the clues artifact
knows.** The other nine come from the OUTLINE's `cluesRevealed` and exist nowhere else:

`time_of_death`, `time_anchor_nine_thirty`, `time_anchor_eight_fifty`, `time_anchor_nine_fifteen`,
`judge_compass_testimony`, `compass_casing_wear`, `witness_harriet_cleaning`, `ledger_ink_variations`,
`clerk_ledger_testimony`.

Each has **no observable and no key terms**, so:

- `checkHardGates` reports `clue_missing` for it on every run, unconditionally — there is nothing to
  look for, so nothing can be found;
- the editor's prompt prints `the reader can use: ` and stops, asking the model to preserve a blank;
- `clueCoverageNotWorse` counts zero terms for it, so the guard protecting it protects nothing.

This is [[cml-outline-scene-join-never-resolved]] alive in v2. **The gate is unaffected** — its one
decisive clue resolves and carries 8 key terms — so this costs editor calls and a misleading finding
count, not fair play. The fix belongs upstream (the outline should name clue ids the clues artifact
holds) with a contract-side guard that reports an unresolvable obligation as a CONTRACT defect rather
than as a defect in the prose.

### §23.3 `CASE\b` UNDER `/i` FLAGS THE COMMONEST NOUN IN THE GENRE

`selector.ts:170` lists `CASE\b` among the scaffold tokens and applies the regex with the `i` flag, so
it matches the ordinary word *case*. MEASURED on this book: chapter 5, *"She retrieved her cigarette
**case**, fingers tapping out"*, reported as generator scaffolding.

The token meant is the CML `{CASE:` marker. `/i` destroys the only thing that distinguished it. In a
DETECTIVE NOVEL this is [[domain-nouns-collide-with-validator-wordlists]] on the most predictable noun
available. Only one fires per chapter because `SCAFFOLD_RE.exec` takes the first match, which hides
how often it is wrong.

### §23.4 AN EDIT THAT CHANGES NOTHING IS COUNTED AS APPLIED

`edits.ts:192` checks `find` occurs once in the body — paragraphs joined with `\n\n`. `edits.ts:199`
then applies it **per paragraph**. A `find` that SPANS a paragraph break satisfies the uniqueness
check and matches no single paragraph, so the mutation is a no-op, the validator sees no fall, and the
edit is recorded as applied.

MEASURED: `applied: 1, skipped: 0, rolledBack: {}, unresolved: 0`, text unchanged.

So `applied 37` in the run is an upper bound and `unresolved 26` is an under-count, and any finding
addressed by such an edit is reported resolved while standing. **The engine's own success metric is
not sound.** Fix: require the `find` to occur exactly once in exactly one paragraph, and skip it
otherwise.

### §23.5 A MISSING CHAPTER SILENTLY MIS-FILES EVERY CHAPTER AFTER IT

Six sites map chapter numbers to prose **positionally** — `written[index]` for the index-th expected
chapter (`findings.ts:155`, `findings.ts:342`, `gate.ts:93`, `selector.ts:180`, `run.ts:124`,
`run.ts:448`). That holds only when no chapter is missing.

MEASURED on the real book: drop chapter 3 and the gate reads `written[8]` as chapter 9. `written[8]`
is now *"Confrontation and Aftermath"* — chapter 10. **The fair-play reveal check reads the aftermath
and says nothing.** In this instance it still shipped, because chapter 10 also names the culprit;
that is luck, and the silence is the defect.

The trigger is not hypothetical: it is exactly what the continuation loop's no-progress guard leaves
behind, and the first paid v2 run took that path. `writtenNumbers` (`run.ts:408`) already computes the
delivered numbers correctly for the continuation prompt — **the same value should be threaded into
every one of the six sites** instead of each recomputing a position.

### §23.6 SMALLER — WORTH FIXING, NOTHING MEASURED AGAINST THEM

- **the editor's `cannot` is parsed and discarded.** `edits.ts:285` reads it; nothing else in the
  package or the worker ever reads it back. The model's stated reason for declining a repair — the
  one place it tells us a finding is wrong — is thrown away. It should reach the run report.
- **the critic gets 2,000 output tokens for a whole book** (`run.ts:435`) while the editor gets 4,000
  for one chapter. Four critic findings failed to anchor in this run; truncation is one candidate
  cause that has not been separated from bad quoting.
- **`repeat_passage` flags one side of a repetition** (`findings.ts:248` breaks after the first
  chapter carrying the span), so the editor repairs one copy and the other stands.
- **`reveal_residue_in_aftermath` keys on `because`** (`findings.ts:256`), an ordinary English word an
  aftermath chapter will use for reasons that are not argument.
- **`measureGuards` is not re-exported** from the package index, so the rollback detail is unavailable
  to anything outside the package — including any future probe of exactly the guard conflict in §23.1.

### §23.7 RECOMMENDED ORDER

1. **§23.5** — silent and wrong beats loud and wrong; thread the delivered chapter numbers through.
2. **§23.4** — until it is fixed, every other number in this review is measured with a broken ruler.
3. **§23.1 D1** then **D2** — the largest finding class, mostly false, entirely unfixable.
4. **§23.3** — one character (`/i`), one word, a reader-visible false positive.
5. **§23.2** — the real fix is upstream; the contract-side guard is the cheap half.
6. **§23.6** as they come.

None of these threatens the §22.7 measurement: the pair compared two manuscripts with instruments
that live outside this pipeline. They mean v2's **repair** stage is doing markedly less than its
telemetry claims — which makes the §22.7 result a FLOOR for what the engine can do, not a ceiling.

### §23.8 STATUS — ALL SIX FIXED, `12b29a1d`

| # | defect | state | measured after |
|---|---|---|---|
| §23.5 | chapters mapped by position | **FIXED** — the number travels with the prose (`chapter-index.ts`) | with a gap, chapter 9 maps to chapter 9 and chapter 3 reports ABSENT |
| §23.4 | a no-op edit counted as applied | **FIXED** — one paragraph, and a byte-identical result is skipped | the spanning edit now reports `applied 0, skipped 1`, finding unresolved |
| §23.1 D1 | clock check read half the table | **FIXED** — value AND label, both normalised | **11 findings → 0**, all of them false |
| §23.1 D2 | its repair is one the guards revert | **FIXED** — the class is `report`, no editor is asked | 11 attempted / 11 reverted is now 0 attempted |
| §23.3 | `CASE` under `/i` | **FIXED** — markers case-sensitive, jargon still folded | **1 → 0**; "cigarette case" clears, `CASE` and "discriminating test" still fire |
| §23.2 | obligations no prose could satisfy | **FIXED** — excluded, named once in `contract.notes` | **23 obligations → 14, and 14/14 resolve** |
| §23.6 | five smaller | **FIXED** — `cannot` surfaced, both sides of a repetition, "because" dropped, critic 2,000 → 6,000, `measureGuards` exported | — |

**Checker findings on the real book: 31 → 9.** The nine that remain — 5 `clue_early`,
3 `register_sentence`, 1 `clue_missing` — are real work, and the gate still ships the book.

### §23.9 THE SEVENTH, FOUND WHILE FIXING THE THIRD

`gate.ts` carried the comment *"the same predicate the selector uses, so the gate and the selector
cannot disagree (L6)"*. There were **two copies of `namesAsCulprit`**, and they had drifted in both
directions:

- `gate.ts`'s was widened on 2026-09-19 to recognise *"engineered the murder"*, the sentence that had
  cost a run. `selector.ts`'s was not — so after that fix the reveal gate and the early-naming gate
  genuinely disagreed about what counts as an accusation, and nothing said so.
- `selector.ts`'s carried a clause `gate.ts` never had: a bare `\bI (killed|murdered|…)\b` **with no
  name in it**. In the early-naming direction that fires on any first-person admission by anybody — a
  red herring's false confession, a witness quoting the victim — and it fires for EVERY culprit at
  once, because nothing in it refers to the person being tested.

One body in `culprit.ts` now. The first-person clause is not reinstated, with its reason written
down: it names nobody, so it cannot answer the question the function is asked, and a reveal carried
entirely by an unattributed *"I killed him"* genuinely does not name its culprit.

**This is WF-002's divergence rule meeting the case it warns about** — two components computing one
set, where one copy is the sole input to a WRITE. Feeding a prompt it would have been absorbed; here
it stops a run and spends an editor call. Worth a sweep for other pairs.

### §23.10 WHAT THIS DOES NOT CHANGE

The §22.7 pair stands: it compared two manuscripts with instruments that live outside this pipeline,
and none of them moved. What changed is that v2's repair stage now spends its calls on the nine
findings that are real instead of the thirty-one it used to report — so **the next v2 run is the
first one whose `applied` and `unresolved` numbers mean what they say**, and §22.7's register figure
remains a floor.

Nothing here has been run against a paid LLM. Every number above is from replaying the fixed code
over the manuscript `resume-1789805865810` already produced, at £0.

---

## 24. v2's JUDGEMENT REPLAYED OVER 51 SHIPPED v1 BOOKS · 2026-09-19 · £0

v2's contract, checkers, hard gates, release gate and instruments are pure — no LLM — so they run
over every archived project for nothing. 51 projects hold every artifact v2 needs **plus v1's own
prose**, which makes this the test §23 could not be: the fixes measured at corpus scale rather than
on the one book that found them.

**Read the confound first.** These books were written to v1's plan, not to v2's contract. Where v2
says "the reveal is chapter 9" and the book resolves in chapter 10, the book is not wrong — it was
never told. Anything below that compares the BOOK to the CONTRACT is a mismatch and is labelled as
one; only what compares the book to itself is a defect.

### §24.1 THE GATE STOPPED 44 OF 51 BOOKS v1 SHIPPED

MEASURED, before any change: **44 of 51**, every one of them for *"the culprit is never named as the
murderer in the reveal chapter"*. A hard fair-play guarantee that fires on 86% of shipped books is
B1's off switch wearing a guarantee's authority.

The diagnosis split cleanly, and only one half was the gate's business:

| | books | cause |
|---|---|---|
| named in the reveal chapter | 7 | fine |
| named SOMEWHERE ELSE | 18 | **16 of them exactly one chapter later** — the contract mismatch above, not a breach |
| named NOWHERE, by any construction | 26 | either the predicate is blind, or the book never says it |

**Both halves were real.** Harvesting what those 26 books actually say, rather than guessing a third
time at verbs:

- **8 of 26 end on an ARREST and nothing else** — a constable comes, the culprit is led away, and no
  sentence ever attributes the act;
- **3 of 26 say "X was responsible"** and nothing stronger — *"Captain Ivor Hale was responsible; the
  evidence allowed no other reading."*

Both are accusations. Both are now in `culprit.ts`, chosen from the corpus rather than imagined.

### §24.2 AND THE STOP IS NOW BOOK-LEVEL

Naming the culprit a chapter later than the contract planned is a contract mismatch; never naming
them is the breach. So the stop became *"no chapter at or after the reveal names the culprit"* and
the chapter mismatch became a WARNING — which is §10.9's own rule applied to its own gate.

**Result: 44 stops → 20. Ship 14% → 61%.**

### §24.3 WHAT THE REMAINING 20 ARE, AND WHY THEY SHOULD STOP

18 of the 20 name their culprit NOWHERE in the book by any of seven constructions; 2 name them only
BEFORE the reveal. Spot-checked, and the example is the finding:

> `canary_1785694688532`, chapter 9, **titled "The Culprit Revealed"**. Every sentence naming Hugo
> Vane in that chapter, in full — the strongest is:
>
> *"'Finding this here,' she said, 'means Hugo Vane must have been near the clock when it was set
> back to a quarter past ten.'"*

**That is placement, not attribution.** A reader finishing the chapter called "The Culprit Revealed"
has been told the culprit was *near the clock*. The book never says he killed anybody.

**MEASURED: 18 of 51 archived books — 35% — never attribute the murder to anybody in plain words.**
This is the "X22 wall" recorded in `guilt-marker-has-no-blunt-force-verb` ("Ch8's disclosure is
genuinely implicit — no sentence in it attributes the act"), and it is now a corpus figure rather
than one chapter's anecdote. It is a real fair-play defect in a third of what this pipeline has
shipped, and it is exactly what v2's brief instructs the reveal chapter to do instead: *name X, state
the act in a verb they own*.

### §24.4 EVERYTHING ELSE THE REPLAY MEASURED

| | over 51 books | reading |
|---|---|---|
| contracts built | **51 of 51, none threw** | the derivation is robust on real artifacts |
| chapter-count mismatch | **0** | the contract's chapter count matches the prose everywhere |
| orphan clue obligations | **222 excluded, across 40 of 51 books**, median 5 | §23.2 is not one book's accident — it is the norm |
| `scaffold_token` | **3 in 51 books** | was ~1 per book before the `/i` fix |
| `clock_off_table` | 4.4 per book | down from 11 on one book; what remains is v1 stating times off its own table |
| `copied_sentence` | 6.2 per book | genuine, and the repetition instrument agrees |
| `register_sentence` | **57.6 per book** | at the 8-per-chapter cap for most chapters |
| `clue_early` | **25.8 per book** | mismatch, not defect — see the confound |

**Two numbers deserve their own item.** `register_sentence` at 57.6 a book means the editor is handed
roughly sixty craft findings per run, which is more calls than the design costed; and `clue_early` at
25.8 is almost certainly the confound rather than a defect, but nothing has separated the two. Both
are cheap to settle and neither is settled here.

### §24.5 WHAT THIS DOES AND DOES NOT SETTLE

**Settled:** the contract builds on every real project; the §23 fixes hold at 51× the evidence; v2's
one hard gate now stops 20 books instead of 44, and the 20 are books that genuinely never tell the
reader who did it.

**Not settled, and not settleable this way:** whether v2 WRITES a better book. Every word of prose
here is v1's. The writer, the critic and the editor need LLM calls, so the only test of v2's prose is
a paid run — and the matched pair in §22.7 remains the only one.

---

## 25. THREE v2 ARMS AGAINST THREE EXISTING v1 STORIES · 2026-09-19 · £0.46

The last three archived stories with resolvable parameters, prose re-run under `PROSE_ENGINE=v2`,
`PROSE_V2_DRAFTS=1`, thirteen upstream artifacts restored byte-identical in each.

| | A `canary_1789577884303` | B `canary_1789497521861` | C `canary_1789232316543` |
|---|---|---|---|
| axis · era · location | authority · 1930s · SeasideHotel | authority · 1950s · CountryHouse | **temporal** · 1940s · CountryHouse |
| v1 external read | **77** | none | **87** — the best this project has |
| controlled? | **yes, 4/4 parameters** | no — humour, tone, style default | no — humour, tone, style default |
| runId | `resume-1789845235708` | `resume-1789845389564` | `resume-1789845583760` |
| cost | £0.15 | £0.17 | £0.14 |

**Every arm printed its own limits**: B and C logged `DEFAULTS: humourLevel, tone, narrativeStyle are
not recorded … NOT a controlled matched pair on those parameters`. Their prose comparison is
indicative; only A's is controlled.

### §25.1 WHAT HELD — THE ENGINE GENERALISES

**3 of 3 delivered a complete 10-chapter book, each in 1 + 2 writer calls, 0 repeats, 2.5–3.2 min.**
The continuation loop, the checkpoint rule and the telemetry were debugged on ONE book (§22–§23) and
they work on three, across two axes, three eras and two locations. That was the open question and it
is answered.

### §25.2 FOUR INSTRUMENTS IMPROVE, THE SAME ONE REGRESSES, 3 OF 3

| instrument | A | B | C | verdict |
|---|---|---|---|---|
| machine-register | 0.0552 → **0.0319** | 0.0791 → **0.0561** | 0.1031 → **0.0075** | better 3/3 |
| repetition /10k | 96.0 → **4.2** | 24.3 → **19.2** | 122.8 → **11.1** | better 3/3 |
| long-sentence share | 0.028 → **0.079** | 0.072 → **0.147** | 0.062 → **0.069** | better 3/3 |
| wit /10k | 15.6 → **37.7** | 20.6 → **31.2** | 9.7 → **26.0** | better 3/3 |
| **speech-open share** | 0.174 → **0.073** | 0.202 → **0.088** | 0.152 → **0.067** | **worse 3/3** |
| words | 8,965 → 6,893 | 11,155 → 7,054 | 10,333 → 6,925 | **23–33% shorter, 3/3** |

Register — the only validated predictor — falls on every arm, and on C it falls **93%**, from a book
that read 87. Four of five instruments move the right way every time.

### §25.3 THE TWO REGRESSIONS ARE BOTH THE COMPLIANCE LAW

**Speech-open share halves on every arm.** The brief states the operation plainly: *"6 paragraphs in
each chapter open on a line somebody speaks."* At ~690 words a chapter that is roughly half the
paragraphs. Delivered: about **one**. This is an OPERATION, countable, in the prompt, and ignored —
the shape recorded in `voice-spec-is-a-dead-lever` and `prompts-move-operations-not-statistics`, now
on v2's own brief. **It is also the one instrument in the calibration that v2 makes worse**, so it is
the first thing to fix in the brief.

**The books run short.** The brief asks for *"about 1000 words"* a chapter and a 7,500–12,500 book;
the arms delivered 690, 705 and 693 words a chapter and **all three fell below the stated floor**. A
word count is a STATISTIC, which this model does not comply with — the same law, and the same fix
shape: ask for countable things, not rates.

### §25.4 AND THE FAIR-PLAY GATE STOPPED TWO OF THREE — CORRECTLY

A and B both stopped: *no chapter at or after the reveal names the culprit as the murderer.* Both
were read before the verdict was accepted, because this predicate has now been widened twice:

> **A, chapter 9** — *"Theodora, her voice steady, offered the flat answer: 'You mean Nora Quayle.'
> Bertram nodded."* And chapter 10: *"the ink still faintly smudged from Nora Quayle's undoing."*
>
> **B, chapter 9** — *"The only person who **could** advance the manor hall clock, control the
> records, and assert the official time was Agatha Innes."*

The first is an oblique confirmation and a euphemism; the second is OPPORTUNITY. Neither says anybody
killed anybody. **The gate is right, and v2 has just reproduced the defect §24.3 found in 35% of v1's
books.** The brief tells the reveal chapter to *name X and state the act in a verb they own*; the
model named X and did not state the act.

So the reveal is not a v1 problem that v2 fixes. It is a defect of this pipeline's prose at every
version, the instrument for it now exists and fires, and the lever is the brief.

### §25.5 THE VARIANCE IS LARGE, WHICH IS THE ARGUMENT FOR THE SELECTOR

Arm A is the SAME project, the same contract and the same inputs as §22.7's run eleven hours earlier.

| | §22.7 | §25 arm A |
|---|---|---|
| words | 8,182 | 6,893 |
| reveal | *"Nora Quayle engineered the murder…"* — ships | *"You mean Nora Quayle."* — **stops** |

One draft, temperature 0.7, and the book swung 16% in length and from a clean reveal to an
unshippable one. **This is exactly the lower tail §10.6 built the selector to cut, and every run so
far has had `PROSE_V2_DRAFTS=1` and therefore no selection at all.** Best-of-three has still never
been tested; on this evidence it is the next thing worth a paid run, and the first thing that could
turn a floor into a consistent one.

### §25.6 WHAT IS AND IS NOT SETTLED

**Settled:** the engine writes complete books on projects it was not debugged on; four of five
instruments improve every time; the fair-play gate fires on a real and recurring defect.

**Not settled:** whether any of it is worth a mark — no read. And **nothing here tested the
selector**, which is v2's main claim about consistency.

**Two defects to fix before the next run, both in the brief, both £0:** the speech-open operation is
ignored 3/3, and the reveal's "state the act in a verb they own" is half-complied with 2/3.

---

## 26. THE FIRST BEST-OF-THREE RUN · 2026-09-19 · £0.32 · `resume-1789846757984`

Seed 50862, the only fully controlled project, `PROSE_V2_DRAFTS=3` and nothing else changed. Two
drafts=1 baselines existed for this exact contract: 8,182 words shipping, and 6,893 words stopping.

### §26.1 THE DRAFTS ARE FAR APART — §10.6's CENTRAL CLAIM SURVIVES

Three drafts of ONE contract, same prompt, temperature 0.7:

| draft | composite | register | repetition | speech-open | wit | words |
|---|---|---|---|---|---|---|
| 1 | 24.49 | 0.0447 | 2.7 | 10% | 29.1 | 7,225 |
| **2** | **27.19** | **0.0306** | **0.0** | **17%** | **33.9** | 6,485 |
| 3 | 20.54 | 0.0734 | 14.1 | 10% | 28.0 | 6,783 |

**Composite spread 20.5 → 27.2; register varies 2.4× between drafts of the same contract.** There is
real variance to select from, which is the assumption the whole move rests on and had never been
measured. **Prediction 1 HELD.**

**Prediction 2 HELD:** the selector chose draft 2, not draft 1 — selection by composite, not by order.

### §26.2 AND IT CHOSE A DRAFT THAT COULD NOT SHIP

**The run STOPPED:** *no chapter at or after the reveal names Nora Quayle.* **Prediction 3 FAILED.**

The checkpoint holds all three drafts, so the counterfactual is free:

> **Draft 3 NAMES THE CULPRIT. Drafts 1 and 2 do not. The selector chose draft 2.**

`applyGate` stops for a condition `checkHardGates` never checked. So the selector could not prefer a
draft that ships, and — worse — **no editor was ever asked to repair the one defect that loses the
whole run**, because it was not in the findings list either.

**Fixed (`reveal_unnamed`, a hard-gate kind and a `fairplay` finding), and verified on this run's own
three drafts at £0: the fixed selector chooses draft 3.**

| | hard failures | of which `reveal_unnamed` | composite | |
|---|---|---|---|---|
| draft 1 | 7 | 1 | 24.49 | |
| draft 2 | 4 | 1 | 27.19 | ← the run chose this |
| draft 3 | **3** | **0** | 20.54 | ← **the fixed selector chooses this** |

The lower tail the selector exists to cut was sitting in the draft set the whole time, and the
instrument that ranks drafts was blind to the only thing that stops a run.

### §26.3 THE COMPOSITE HAS NO LENGTH TERM, AND IT PICKED THE SHORTEST

Drafts ran 7,225 / 6,485 / 6,783 words. **The selector took the shortest**, and the shipped manuscript
came to 6,691 — the shortest book v2 has produced, against a contract asking 7,500–12,500.

§22.5 recorded that the composite has no length term as a reason it was never wrong. Given three
drafts that are all short, it is now a reason it makes the shortest choice available. Not yet fixed;
the honest options are a floor (reject a draft below the contract's minimum) or a length term, and
neither should be chosen without measuring which drafts a floor would have discarded.

### §26.4 THE RUN COULD NOT PRINT ITS OWN ANSWER

`segment 0 drafts:` printed, and then nothing. The per-draft rows are emitted as indented
continuations with no `[Agent 9 v2]` prefix, and §22.6's telemetry filter — added in this session —
kept only prefixed lines. **The run was bought to see the spread between drafts and the spread was
the one thing it did not print.** Every number in §26.1 was recovered from the checkpoint afterwards.
Fixed: the filter now keeps an indented row that follows a v2 line.

### §26.5 WHAT THE §23 FIXES LOOK LIKE ON A LIVE RUN

| | §22.7 (before) | this run |
|---|---|---|
| findings | `clue_missing 10, clock_off_table 11, clue_early 5, scaffold 3, register 14` | `register 9, clue_early 2, clue_missing 1` |
| edits rolled back | **12** (10 of them `clockValuesIntact`) | **1** (`lengthWithin`) |
| edits declined | not reported | **5**, with reasons |

The repair stage now spends its calls on findings that are real and can be fixed. That was §23's
claim and this is the first live run to show it.

### §26.6 STATUS

**Settled:** drafts of one contract differ enough to select between; the selector selects; and it was
selecting on the wrong criterion, which is now fixed and verified against this run's own drafts.

**Not settled:** whether best-of-three ships more often — that needs a run with the FIXED selector,
which has not happened. And no read, so still no mark.

**The next paid run is the same command again**, now that the selector can see the stop. If it ships,
that is the lower tail cut, measured end to end.

---

## 27. WHY v2 MISSED ITS OWN OPERATIONS, AND THE FIX · 2026-09-19 · £0

Four v2 books, three failures the instruments agreed on: the reveal never attributes the act, the
speech-open share halves, the books run 23–33% short. §25 called them "the compliance law". This
section measured WHICH law, per chapter, across the three drafts of `resume-1789846757984`.

### §27.1 THE BRIEF IS READ — THE FAILURES ARE THE AMBIGUOUS ASK AND THE STATISTIC

| operation | asked as | draft 1 | draft 2 | draft 3 | v1 |
|---|---|---|---|---|---|
| em-dashes | "at least three" | **6.3** | **7.9** | **8.2** | 4.2 |
| sentences past 30 words | "at least four" | 4.8 | 2.7 | 2.7 | 1.5 |
| speech-opening paragraphs | "open on a line somebody speaks" | 1.5 | 2.8 | 1.7 | 1.2 |
| words | "about 1000" | 722 | 648 | 678 | 896 |
| paragraphs | not asked | **14.5** | **16.9** | **16.2** | 6.9 |
| words per paragraph | not asked | **49** | **39** | **42** | **130** |

**Em-dashes arrived at twice the ask.** So the brief is read, and distance from the writing is not
the mechanism — the first hypothesis, refuted by the first row. What failed:

- **"open on a line somebody speaks" is ambiguous.** A paragraph that runs *Bertram turned. "You hold
  it flat," he said.* was being counted. The operation now names the first character.
- **"about 1000 words" is a statistic.** What the model delivers reliably is paragraphs — 14 to 17 a
  chapter, every draft. They were thin: 39–49 words against v1's 130. The words went there.
- **The speech-open SHARE regression is mostly this.** v2 has the same number of speech openings as
  v1 (1.5–2.8 against 1.2) and three times the paragraphs, so the share halves. Fix the paragraphs
  and the share follows.
- **"states the act in a verb they own" is an abstraction.** The model complied with "names X" and
  not with the abstraction, 3 books in 4.

### §27.2 THE FIX — SHAPES, NOT ABSTRACTIONS, AND SAID WHERE THE WRITING HAPPENS

| | was | is |
|---|---|---|
| speech openings | *open on a line somebody speaks* | *begin with a spoken line: the first character of the paragraph is the opening quotation mark* |
| length | *Each chapter runs to about 1000 words* | ***At least 12 paragraphs in each chapter run to four sentences or more.*** *That is what brings a chapter to its 1000 words* — `fullParagraphs(preferred)`, derived, one number for brief and contract |
| the reveal | *names X, states the act in a verb they own* | *carries one sentence, spoken aloud by the person who worked it out, that states as settled fact that **Nora Quayle killed Montague Gaunt**: the culprit's name and a verb of killing in the same sentence* |

The reveal and length operations are now ALSO on each chapter's own contract (`renderSceneContract`),
the text nearest a continuation that is writing chapter 9 with the brief twenty thousand tokens
behind it. Speech openings stay in the brief alone, so the next run tests the wording hypothesis
cleanly against the em-dash precedent.

**And the selector gained a length term it can defend:** ONE `book_short` hard hit when a complete
draft is under the contract minimum — not one per chapter, which would let length outrank every
instrument that predicts the score. It reaches no editor, because no edit lengthens a book.

### §27.3 THE £0 CHECKS

1. **The prompt, rebuilt for seed 50862:** chapter 9's contract now ends with the reveal sentence
   and the paragraph operation; every chapter carries the paragraph operation; the brief is 707
   tokens and passes its own law (no prohibition, no rate, no example).
2. **The selector, replayed over the three saved drafts:** still chooses draft 3. `book_short` lands
   on all three (7,225 / 6,485 / 6,783 against 7,500), so it changes nothing here, exactly as it
   should — it discriminates only once a draft clears the floor.
3. **The corpus, replayed:** 31 of 51 ship, 20 stop, 222 orphans — the judgement side is unchanged.

Tests: 1030 passed, 14 new. Every one a shape the drafts actually delivered.

### §27.4 WHAT THIS DOES NOT SETTLE

Whether the model complies with the new wording. The em-dash row is the reason to expect it; the
speech-open row is the reason to check. **One paid run, same command as §26, settles all three
operations and the selector at once — and if it ships, it is the first v2 book worth a reader.**

---

## 28. THE FIXES, VERIFIED ON FOUR PAID RUNS · 2026-09-22 · £1.39 of a £1.50 budget

Every fix from §23–§27 was in, and four runs at `PROSE_V2_DRAFTS=3` measured them. Only A is a
controlled pair; B and C printed their `DEFAULTS` line and are indicative.

| run | book | chosen → shipped words | drafts naming the culprit in ch9 | gate | speech-open per chapter, by draft | cost |
|---|---|---|---|---|---|---|
| `resume-1790097243765` | A | 7,537 → 7,854 | **3 / 3** | ship | 2.3 / 2.0 / 3.4 | £0.33 |
| `resume-1790097526900` | B | 8,493 → 8,749 | **3 / 3** | ship | 1.6 / 1.9 / 3.6 | £0.43 |
| `resume-1790097751711` | C | 6,620 → 6,665 | **3 / 3** | ship | 1.6 / 3.2 / 1.9 | £0.31 |
| `resume-1790098211785` | A, + format rules | 6,970 → 7,159 | **3 / 3** | ship | **2.9 / 4.2 / 5.3** | £0.32 |

### §28.1 THE FAIR-PLAY FIX HOLDS: 12 OF 12 DRAFTS

Before §27, three of four v2 books never attributed the act, and at §26 none of three drafts did so
in chapter 9. With the reveal asked as a shape — *name, verb of killing, victim, in one sentence, as
fact* — and stated on the chapter's own contract, **every draft of every run named the culprit in the
reveal chapter, and every run shipped.** B, which had stopped on *"the only person who could…"*,
ships. This is the one operation that was a reader-visible breach, and it is fixed on three books.

### §28.2 LENGTH: BETTER, NOT YET RELIABLE — AND THE SELECTOR WAS MAKING IT WORSE

Drafts above the 7,500 floor: A 3 of 3, B 3 of 3, C 1 of 3, A-format 2 of 3. The paragraph operation
raised words by adding paragraphs (§27), so the floor is reachable now where it was not before.

**But the selector twice chose a sub-floor draft over an above-floor one.** C: draft 1 at 7,615 with
composite 22.92 lost to draft 2 at 6,620 with 20.07. A-format: draft 3 at 7,758 lost to draft 1 at
6,970. The cause, read from the checkpoints: every hard kind counted one, and `clue_early` fired
**9–19 times on every draft** — on *manor, hall, clock, half past seven*, the book's setting recurring
in chapter 1. Thirteen vocabulary overlaps outranked a sub-floor book with a worse composite.

**Fixed, and chosen from the corpus:** the `clue_early` threshold swept over six saved drafts —
19/17/17 and 13/9/12 at the old rule, **0–2 at ≥ max(4, 90%)** — and only the kinds that stop or
spoil a book now rank drafts (`RANKING_KINDS`; `clue_early` is a `defect` finding, not a fair-play
breach). Replayed over the saved drafts at £0: **C → draft 1 (7,615), A-format → draft 3 (7,758),
B unchanged.** Both books that shipped short had a longer, cleaner draft on the table.

### §28.3 SPEECH-OPEN MOVED FOR THE FIRST TIME — AS A FORMAT RULE

Two brief wordings did nothing (1.5–3.4 across five runs). Stated as dialogue LAYOUT in the format
block — the block with 100% compliance on chapter headers — the three drafts came in at
**2.9 / 4.2 / 5.3**, mean 4.1 against 2.6 the run before. Not the 6 asked, but the only lever of
three that moved it, and under the fixed selector the 5.3 draft is the one that ships.

### §28.4 PARAGRAPH FULLNESS IS A DEAD LEVER — THREE WORDINGS

*About 1,000 words* (statistic) → 39–49 words a paragraph. *At least 12 paragraphs of four sentences*
(count with qualifier) → more paragraphs, 35–42 words each. *A paragraph of narration runs to four
sentences or more* (format rule) → 2.2–3.6 full paragraphs a chapter, from 4.2. Recorded as dead at
prompt level; the record says so with the three wordings.

### §28.5 THE LAW, SHARPENED

`prompts-move-operations-not-statistics` said operations move and statistics do not. Four runs say
more precisely: **this model obeys a COUNT of a SIMPLE thing** (em-dashes, "at least three" → 6–8)
**and it obeys FORMAT** (headers 100%; dialogue layout 2.6 → 4.1); **it drops the QUALIFIER on a
counted thing** (paragraphs ↑, four-sentence ↓; "paragraphs that begin with a quotation mark" under
two wordings) **and ignores a statistic outright.** Recorded in memory.

### §28.6 INSTRUMENTS, AND WHAT IS NOT SETTLED

The first verification run against v1, both 10 chapters: register **0.0552 → 0.0152** (the lowest any
A run has produced), repetition 96 → 13.5, long sentences 0.028 → 0.094, wit 15.6 → 34.4, speech-open
share 0.174 → 0.122 — still the one regression on the instrument, narrowing.

**Not settled:** the fixed selector has been replayed, not run live; `clockValuesIntact` rollbacks
reappear through the critic's `timing_contradiction` (C: 5 of 6) — the D2 conflict by another door,
not fixed here; and no v2 book has been read. The next spend is a read, and the book is the fixed
selector's draft 3 of `resume-1790098211785`: above the floor, names the culprit, best speech-open.

---

## 29. THE FIXED SELECTOR, LIVE · 2026-09-22 · £0.38 · `resume-1790099060243`

Seed 50862 again, everything as §28's last run, with the §28.2 ranking fix in the live path for the
first time. The checkpoint was cleared because nothing the writer sees had changed and the hash would
have restored the previous drafts.

| draft | words | speech-open /ch | culprit in ch9 | hard (ranking) | composite | |
|---|---|---|---|---|---|---|
| 1 | 7,714 | 4.7 | yes | 0 (0) | 23.56 | |
| 2 | 8,161 | **6.1** | yes | 1 (1) `clue_missing` | **26.05** | highest composite |
| 3 | 9,339 | 5.7 | yes | 0 (0) | 24.52 | **chosen** |

**The selector passed over the highest composite for the draft that satisfies the contract**, which
is the rule §28.2 wrote, and the £0 replay over the same drafts agrees. Draft 2's `clue_missing` is
one the editor can repair, so the choice is arguable — but it is the designed choice, made live.

| prediction | verdict |
|---|---|
| 0 ranking failures chosen whenever any draft has 0 | **HELD** |
| shipped book ≥ 7,500 | **HELD** — 9,551, the first v2 book longer than its v1 arm (8,965) |
| reveal names the culprit in ch9 | **HELD** — 3/3, now **15 of 15** drafts since §27 |
| the gate ships | **HELD** — no stop |
| the draft table prints `hard N ranking of M` | **HELD** |
| ≈ £0.32 | **OVER** — £0.38; the 9,339-word draft cost its extra output |

### §29.1 FIVE OF FIVE, FOR THE FIRST TIME

The shipped manuscript against the v1 arm, both 10 chapters:

| instrument | v1 | v2 live | |
|---|---|---|---|
| words | 8,965 | **9,551** | longer |
| machine-register | 0.0552 | **0.0251** | better |
| repetition /10k | 96.0 | **7.1** | better |
| **speech-open share** | 0.1739 | **0.2661** | **better — the regression of every earlier run, turned** |
| long-sentence share | 0.0276 | **0.0547** | better |
| wit /10k | 15.6 | **38.7** | better |

Speech-open crossed v1 through two levers together: the dialogue-layout FORMAT rule (§28.3) lifted
every draft, and the selector's composite — which carries speech-open share at +1.5 — then preferred
a draft that had it. Prompting got the model most of the way; selection did the rest. That is the
mechanism §28.5 predicted for a qualified property the model will not produce on demand.

Edits: 27 applied, 0 skipped, 2 rolled back, 3 declined with reasons — the repair stage spending its
calls on real work.

### §29.2 WHAT THIS SETTLES, AND THE ONE THING IT CANNOT

Settled: the engine writes a complete book that clears every structural bar the contract sets —
length, fair play, the operations the model will obey — and beats its v1 arm on every calibrated
instrument, on the only controlled project. The selector cuts the tail it was built to cut, live.

Not settled, and not settleable by any instrument this project owns: whether it is worth a mark.
**This is the book to read**: `stories/` for `resume-1790099060243`, seed 50862, against the v1 arm's
77. Session spend £1.77 across the two approvals.

---

## 30. THE LAST THREE STORIES ON THE FINAL ENGINE · 2026-09-22 · £0.59

B and C, run for the first time with BOTH the dialogue-layout format rule and the fixed selector; A's
live run of §29 stands as the third. B and C printed their `DEFAULTS` line — indicative, not
controlled.

| run | book | drafts (words) | chosen | shipped | culprit in ch9 | gate | live = replay | cost |
|---|---|---|---|---|---|---|---|---|
| `resume-1790099060243` | A | 7,714 / 8,161 / 9,339 | 3 | **9,551** | 3/3 | ship | yes | £0.38 |
| `resume-1790099653544` | B | 6,469 / 6,895 / 7,144 | 3 | 7,195 | 3/3 | ship | yes | £0.28 |
| `resume-1790099847162` | C | 7,822 / 8,331 / 6,280 | 2 | **8,413** | 3/3 | ship | yes | £0.31 |

### §30.1 PREDICTIONS

| | verdict |
|---|---|
| reveal names the culprit in all six drafts | **HELD** — **21 of 21** drafts since §27 |
| both ship | **HELD** |
| the chosen draft has 0 ranking failures whenever any does | **HELD** — C took draft 2 (8,331, 0 failures, composite 28.51); B had no draft above the floor, so all three carried `book_short` and the composite decided, which is the rule |
| both ≥ 7,500 | **C HELD** (8,413); **B FAILED** (7,195 — no draft cleared it) |
| speech-open lifts as on A | **C yes** — chosen draft 5.7 against 1.6–3.2 before; **B modest** — 2.3–3.9 against 1.6–3.6 |
| ~£0.40 each | **UNDER** — £0.28 and £0.31 |

### §30.2 THE INSTRUMENTS, THREE ARMS

| instrument | A (v1 77) | B (no read) | C (v1 **87**) | across arms |
|---|---|---|---|---|
| machine-register | 0.0552 → **0.0251** | 0.0791 → **0.0344** | 0.1031 → **0.0116** | better 3/3 |
| repetition /10k | 96.0 → **7.1** | 24.3 → **22.8** | 122.8 → **5.7** | better 3/3 |
| speech-open share | 0.174 → **0.266** | 0.202 → 0.194 | 0.152 → **0.256** | better 2/3, B at parity (−0.008) |
| long-sentence share | 0.028 → **0.055** | 0.072 → **0.110** | 0.062 → **0.085** | better 3/3 |
| wit /10k | 15.6 → **38.7** | 20.6 → **33.4** | 9.7 → **34.5** | better 3/3 |
| words | 8,965 → **9,551** | 11,155 → 7,195 | 10,333 → 8,413 | A longer; B, C shorter |

**C is the arm to notice: it is the book that read 87, and register falls 89% on it.**

### §30.3 THE ONE THING THAT DID NOT HOLD, AND WHY IT MATTERS

**B's length.** The same contract produced 8,493 / 8,644 / 9,031 words in §28 and 6,469 / 6,895 /
7,144 here — three drafts, none above the floor, and the selector can only choose among what it is
given. This is the variance §25.5 named, now at the length axis: three drafts are enough to select a
shipping reveal (21 of 21) and usually enough to select a long-enough book (A, C), and not always.
Nothing here separates two candidate causes — ordinary temperature-0.7 variance, or the new dialogue
layout shortening B's paragraphs — and both are cheap to settle with a fourth draft on B, which was
not spent.

### §30.4 STATUS

All three of the last stories now ship from the final engine, name their culprit, and beat their v1
arms on register, repetition, long sentences and wit; two of three on speech-open; A on length. The
selector agreed with its own replay on every run. **Session spend £2.36.**

Not settled, by construction: a mark. Three books are ready — `resume-1790099060243` (A, against
77), `resume-1790099847162` (C, against 87), `resume-1790099653544` (B, unread v1). The next spend is
a read, and C is the sharpest test this project can set: the highest mark it has ever received,
against a v2 arm with a tenth of its register rate.

---

## 31. A_101 — v2 AGAINST v1, THE FIRST EXTERNAL READS · 2026-09-23 · £0

The three v2 reads (A 80, B 84, C 80; mean 81.3) against v1's September mean of 80.8: **no measurable
change in the headline.** The controlled pair moved 77 → 80, gaining exactly on clues, ending, prose
and character. The uncontrolled pair (C, voice parameters defaulted) fell 87 → 80.

The finding that reorders the board: **the register calibration does not transfer to v2.** Refitted on
55 v1 reads it predicts v2's books at 88.6 / 87.6 / 90.1; they read 80 / 84 / 80. No v1 book has
register as low as v2's highest. v2 drives register down directly and the causes of the mark did not
move with it — and register is the composite's heaviest weight.

The reads are still injector audits: four named injectors were v2's own and are fixed (`461512bd`);
the one v2-specific defect still open is the reveal smeared across chapters 8–10 by v2's roles fighting
the outline's titles, the aftermath contract restating the exposure, and the reveal sentence complied
with literally. **Recommendations, in order (A_101 §9):** fix the reveal structure (£0), clamp register
in the composite at the calibrated floor (£0), then one controlled matched pair on A and a read.

**Correction on record:** §21's "three reads of one book, 87 after repairs" is wrong in description —
see the note there and A_101 §10.













---

## §32 THE CASE NOW PROVES THE ACT — A_102, built and measured, not yet in a book

**A_102's finding:** 48 of 56 archived cases (86%) prove the culprit was PRESENT and never that they
struck the blow. The external reader named exactly that in **four consecutive reads**, and `clues` is
the project's lowest-scoring category at 6.38 against 7.19–8.19 elsewhere.

**Built (29112e75):** the MEANS-LINK requirement at Agent 3, as four literal string shapes — who kept
the implement, who could reach where it was kept, what its taking disturbed, and where the obvious
evidence points. **0 of 3 → 6 of 8**, none resting on a fingerprint, over 14 harness cases at
**$0.155 total**.

**The transferable result, and the cleanest measurement of the compliance law this project has:**
drafts 2 and 3 asked for the SAME facts. Asked in prose, two slots were obeyed **0 of 3** and **1 of
3**; given a literal shape with slots, **4 of 4** and **4 of 4**. A qualifier written beside the shape
is dropped even when it is the requirement's whole point. **Give a requirement a shape, not an
argument.**

**The prohibition failed for a fourth time** (A_101 §15 was the third). "Do NOT make it a fingerprint"
produced a fingerprint 3 of 3. Assigning the fingerprint a job — it belongs to an innocent and becomes
one of the two red herrings the case already owes — was obeyed 3 of 3.

**NOT SETTLED, and it is the next thing to buy.** Agent 3 sits above nine stages. Whether Agent 5
surfaces the new trace, the outline places it, and Agent 9's reveal rests on it is **untested**, and no
number of harness cases can answer it. **Next: a full paid run on a fresh seed (~£1.15) and a read**,
which is A_102 §4's step 4 and now has its justification. The prediction to check is narrow and the
reader has stated it four times: the reveal names a physical fact connecting the culprit to the means
of death, and the read does not repeat *"does not fully prove the murder in a satisfying, physical way"*.

**§32 UPDATE — the paid run failed all three testable predictions.** Seed 61062,
`mystery-1790200611969`, **$0.955**, status failure, release gate warning, rubric 65, repetition 4.3×
the median so **the book must not be read**. The four shapes were obeyed and bound to the **clock**,
not to the ceremonial letter opener that `death_method` names; the one trace touching the weapon names
nobody. Separately, the case listed a culprit its own cast marks innocent, normalization reassigned,
and the means-link slot was left naming an innocent — **nothing checks the name in the slot against
the culprit**. Full account in A_102 §8. **Do not buy a second run** until the block names the weapon
rather than referring to it, the culprit-in-slot check is wired in, and the harness is re-run on an
upstream whose mechanism and weapon are distinct objects.

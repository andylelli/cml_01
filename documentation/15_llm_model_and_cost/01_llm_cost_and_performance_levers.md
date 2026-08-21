# 15.1 — LLM levers that are not "switch to Anthropic"

**Written:** 2026-08-21 · **Trigger:** owner's question — *"what changes can we make that are LLM based other than just changing to Anthropic? I would like the cost to be < £1 per run and for you to maximize caching and anything else that can be done to improve performance and reduce cost."*

**Companion to** [00_README.md](00_README.md), which costed the provider swap. This document is about
everything else: what the pipeline spends tokens on, and which levers change that **without** changing
provider. Every lever here is provider-neutral — they pay off on Azure and on Anthropic alike, and
most of them are the precondition that makes a provider swap affordable rather than an alternative
to it.

**Method:** every number is **MEASURED** from `logs/llm.jsonl` (per-call ground truth: agent, model,
prompt tokens, completion tokens) or `logs/llm-prompts-full.jsonl` (the full message arrays), priced
per call at its own model's rate. Two new probes make all of it re-derivable:

```bash
node scripts/probe-run-token-economics.mjs --run mystery-1787167692140
npm run probe:model-cost -- --cache-hit 0.29
```

---

## 1. Corrections to the record — read this first

Three numbers in circulation are wrong, and two of them are mine from earlier today.

### 1.1 "Roughly two thirds of the chapter prompt is identical" — true, and irrelevant to caching

`agent9-run.ts` states, as the justification for the `proseBatchSize` cost lever:

> *"roughly two thirds of that prompt (bible, cast, era rules, physics, craft/humour guides, output
> schema) is IDENTICAL for every chapter in the run"*

**Prompt caching is a PREFIX match.** Identical content scattered through a prompt caches nothing —
any byte that differs invalidates everything after it. MEASURED over the 12 chapter prompts of
`mystery-1787167692140`:

```
mean chapter prompt                     117,264 chars  (~29,316 tokens)
longest common PREFIX across all 12       5,677 chars  =  5%
```

**Five per cent, not two thirds.** Broken out by message role, the reason is visible:

| role | mean size | common prefix | identical content, order-independent |
|---|---:|---:|---:|
| `system` | 60,307 ch | 5,591 ch — **9%** | 25,929 ch — **43%** |
| `user` #1 | 50,531 ch | 1,723 ch — 3% | 6,772 ch — 13% |
| `user` #2 | 2,078 ch | 323 ch — 16% | 1,118 ch — 54% |

The system message is 60K characters and **43% of it is identical across every chapter — but only 9%
of it is a stable prefix.** Chapter-specific content is interleaved into the bible rather than
appended after it. The cacheable content is there; it is in the wrong order.

### 1.2 My own claim that caching cuts the bill ~40% — wrong

I said that earlier today from the "two thirds" figure. Corrected against the measurement:

```
cacheable as ordered today                  5%   of chapter-prompt input
cacheable ceiling if repartitioned         29%   (~8,455 tokens per chapter call)
worth, after repartitioning                ~12%  of total run cost
```

Not 40%. This also confirms [00_README §5.1](00_README.md) — *"prompt caching will not rescue this
as-is"* — which was right, and which I contradicted without checking.

### 1.3 My claim that the polish pass has never run — wrong, and the correction matters

I read `fullStoryPolishEnabled: false` on all 15 reports and concluded no polish had ever run. The
per-call log says otherwise:

```
Agent9-PostPassPolish-Ch6   4,706 in / 2,441 out   claude-sonnet-5
Agent9-PostPassPolish-Ch8   4,326 in / 2,287 out   claude-sonnet-5
Agent9-PostPassPolish-Ch7   4,119 in / 2,042 out   claude-sonnet-5
Agent9-PostPassPolish-Ch4   3,931 in / 1,923 out   claude-sonnet-5
```

**The per-chapter high-leakage polish IS running, on `claude-sonnet-5`, on 4–7 chapters per run.**
Only the *full-story* polish is disabled.

That reverses the argument I built on it. A frontier Claude model is **already line-editing about half
the book on every run**, and `atmosphere`, `opening hook` and `character clarity` are still flat at 8.
That is real evidence — weak, because line-editing is not composition, but real — **against** the
hypothesis that frontier sentence-craft alone lifts the stuck categories. It should lower the expected
return on 0b.1 in [PLAN-TO-90](../../architecture/PLAN-TO-90.md), and it strengthens the case that the
constraint is in *composition*, not *polish*.

---

## 2. Where the money actually goes

MEASURED, `mystery-1787167692140` (2026-08-19), 53 calls, **$1.27** priced per call at each model's
own rate. At 0.79 GBP/USD that is **£1.00** — the run is already sitting exactly on the budget line.

**The baseline has moved, and the old one is still quoted.** [00_README §4.2](00_README.md) advises
*"take a full run as ~$4 typical, ~$7 on a heavy-retry run"*. That was true of the July runs it
sampled. Measured across every run in `logs/llm.jsonl` with 20+ calls:

```
2026-07-24   204 calls   $6.58
2026-07-31   139 calls   $5.06
2026-08-02    57 calls   $1.38
2026-08-06    52 calls   $1.40
2026-08-14    54 calls   $1.55
2026-08-18    62 calls   $1.92
2026-08-19    53 calls   $1.27

12 August full runs:  mean $1.44   range $1.12 - $1.92
```

Call count fell from 118-204 to 43-73 and cost fell with it. **Quote $1.44, not $4.** The £1 target is
a ~30% reduction from the August mean, not a 75% one.

| band | share | detail |
|---|---:|---|
| Chapter generation (10 calls, `gpt-4.1`) | **69%** | $0.88 |
| Regeneration — extra calls to an agent that already ran | **17%** | $0.22, 12 extra calls, 96,322 input tokens re-sent |
| Post-pass polish (4 calls, `claude-sonnet-5`) | **14%** | $0.18 |
| Everything upstream (Agents 1–8, 20 calls, mostly `gpt-4.1-mini`) | **~8%** | $0.10 |

Two structural facts drive almost all of it:

**Input dominates.** 465,750 input against 107,494 output — **4.3 : 1**. Output rates barely move the
total; input rates and input *volume* are the whole game. (Note: the 11.7:1 ratio quoted in
`agent9-run.ts` and in my earlier costing came from an older run. The current ratio is 4.3–6.5:1,
which makes output rates matter more than I said — it narrows the gap between models but does not
change which lever matters.)

**Late chapters cost 2–3× early ones.** Same run, per-chapter input:

```
Ch1  21,084     Ch5  20,273     Ch8  30,866
Ch2  20,928     Ch6  22,185     Ch9  64,181   (2 calls)
Ch3  21,509     Ch7  21,898     Ch10 62,770   (2 calls)
Ch4  21,716
```

Ch9 and Ch10 are where the retries land *and* where the accumulated context is largest — the two
multiply. This is X47's finding from the other side: the fixed prefix climbs 8,472 → 23,622 tokens
across a 10-chapter book.

---

## 3. The levers, ranked by measured saving

### Lever A — Repartition the prompt so the stable half is actually a prefix · free · ~12%

**The single highest-value engineering change in this document, and it is provider-neutral.**

The system message is 60K characters, 43% of it identical across chapters, 9% of it a usable prefix.
The work is to split it into two regions and never interleave them:

```
STABLE   (cache this)   bible · cast · era rules · physics · craft guide · output schema · rubric
VOLATILE (after it)     chapter number · beat · continuity tail · per-chapter obligations · retry feedback
```

Rules that make it hold, from the caching contract:

- Render order is `tools` → `system` → `messages`. Anything volatile in `system` poisons the whole
  prefix, which is exactly today's failure.
- The prefix must be **byte-identical** across calls. No timestamps, no per-run IDs, no unsorted
  object keys, no `Date.now()`, no chapter number, in the stable region.
- Minimum cacheable prefix is ~1,024 tokens — the 8,455-token target clears it comfortably.
- **Verify with `usage.cache_read_input_tokens`.** If it is zero across repeated calls, a silent
  invalidator is present. A cache you believe in but never measured is the same failure shape as a
  flag that silently does nothing — a defect class this repo has recorded repeatedly.

Economics, at 12 chapter calls with a 5-minute TTL (reads ~0.1×, writes ~1.25×):

```
8,455 cacheable tokens × 12 calls, uncached    101,460 token-equivalents
1 write + 11 reads                              19,870 token-equivalents
saving                                          ~80% of that portion  =  ~23% of chapter input
                                                                      =  ~12% of the run
```

**This is worth doing before any provider decision, not after.** It pays on Azure, it pays on
Anthropic, and it is what makes a frontier model affordable rather than a luxury.

### Lever B — Stop paying for regeneration · free · ~17% at the ceiling

12 extra calls re-sent **96,322 input tokens** on that run — $0.22, 17%. Two fixes already exist and
neither has been measured on a run:

- **X73** — the Act III contract. `aftermath_consequence` is 21 of 54 archived chapter retries and
  appears in all nine runs that retried anything.
- **X80** — retry routing. 17 of 54 real failure messages matched no family, so the model was handed
  a patch instruction that did not say what to fix; one chapter burned three attempts on the same
  unrouted leakage failure.

A retry is the most expensive possible failure: it re-sends the entire prompt to buy one chapter.
Halving the regeneration rate is worth about as much as the whole caching change.

**Levers A and B couple, and more tightly than either states alone.** [00_README §5.1](00_README.md)
measured something this document originally missed: **retry attempts of the same chapter share 80.2%
of their prefix** (n=30 pairs). Cross-chapter sharing is 5%; retry-to-retry sharing is 80%. So a
cached prefix recovers most of a retry's cost even when the retry still happens — which means Lever A
discounts Lever B's remaining cost, and the two savings must not be added at face value. It also
means **caching is worth more on a bad run than a good one**, which is the opposite of the usual
shape and argues for building it before the retry work rather than after.

### Lever C — Flatten the late-chapter prompt · free to measure

Ch9/Ch10 carry 3× Ch1's input. Some of that is necessary (continuity), some is accumulation nobody
has audited. The craft ratio work in [REVIEW_14 §3](../../architecture/REVIEW_14.md) is the same
question from the quality side: 12.6% of the prompt is craft guidance and it is shed *first* under
budget pressure, which is exactly backwards if the flat categories are craft categories.

**Measure before cutting:** `probe-run-token-economics.mjs` gives per-chapter input; the prompt-budget
summary already reports `available` / `critical` / `futile` / `craftFloor` on every call.

### Lever D — `proseBatchSize: 2` · free · conditional

Currently 1. At 2, the shared block is sent five times instead of ten. `agent9-run.ts` states the two
real constraints honestly: `maxTokens` must rise (2 chapters × ~1,913 tokens fits 4,000, 3 does not),
and **retries are per batch** — so at a high retry rate each retry regenerates two chapters and the
saving reverses.

**Do Lever B first.** With regeneration under control, batching is a clean win; with it uncontrolled,
it is a coin flip. And note that batching and caching partly overlap — both attack the re-sent
prefix — so do not count both savings in full.

### Lever E — Model tiering, including two stages nobody has priced

The stage router already exists (`AGENT9_MODEL_GENERATE` / `REGEN` / `POLISH`). Two placements are
worth revisiting:

- **The judge is on `gpt-4.1-mini`.** It reads one finished manuscript (~15K tokens) and returns a
  rubric — one small call. Moving it to a frontier model costs **~$0.10/run**, against +166% to move
  the writer. And the judge is the instrument [PLAN-TO-90 §2](../../architecture/PLAN-TO-90.md)
  identifies as blocking everything: all three internal numbers rank an 81 above an 86.
- **Upstream agents (1–8) are ~8% of the bill** on `gpt-4.1-mini`. There is no cost case for touching
  them, and no evidence they are a quality constraint. Leave them.

### Lever F — Structured outputs on the JSON-returning agents · free

Agents 1–8 return JSON and the client sets `responseFormat: json_object`. Constrained decoding
(`output_config.format` with a schema, or `strict: true` on tools) eliminates malformed-JSON retries
entirely rather than catching them. Small, but a malformed reply costs a full re-send.

### Lever G — Batch API · **does not fit, stated so it is not re-proposed**

50% off is the largest single discount available and it is unusable here. Chapters are generated
sequentially — the continuity tail of chapter N feeds chapter N+1 — and the retry loop branches on
validation of the previous output. A batch cannot contain a loop that depends on its own results.
Upstream agents are likewise a dependency chain. **Do not spend time on this.**

### Lever H — Effort control, if and when the provider changes

`output_config.effort` (`low` … `max`) is an Anthropic-side lever with no Azure equivalent. On a
provider swap it becomes the main cost dial: `low` for the mechanical upstream agents and micro-regens,
`high` for chapter composition. It is listed here for completeness — it is not available today.

---

## 4. Assembling a run under £1

Two baselines, because one run is not a plan. £1 = **$1.266** at 0.79 GBP/USD.

| step | change | on the AUGUST MEAN | on a GOOD run |
|---|---|---:|---:|
| — | today | $1.44 | $1.27 |
| A | repartition + caching (−12%) | 1.27 | 1.12 |
| B | halve regeneration (−6% net after the A/B overlap) | 1.19 | 1.05 |
| E | judge → frontier model (+$0.10) | **1.29** | **1.15** |
| | | **£1.02** | **£0.91** |

**Stated plainly: A + B + E lands ON the £1 line, not comfortably under it.** A good run clears it at
£0.91; an average one misses by two pence. Anyone quoting "under £1" from this table should quote the
range, not the flattering half — the same discipline the rest of this folder applies to score claims.

B is discounted from −8% to −6% here because Lever A already recovers most of a retry's cost (the
80.2% retry-prefix finding above). Adding both at face value would double-count.

**To clear £1 reliably** you need one of the two conditional levers as well:

- **Lever C** (flatten the late-chapter prompt) — Ch9/Ch10 carry 3× Ch1's input on every run. Free to
  measure, unknown to fix, and the single largest untouched block of spend.
- **Lever D** (`proseBatchSize: 2`) — halves the number of times the shared block is sent, but only
  once Lever B has the retry rate down, since retries are per batch.

**The finding that matters more than the arithmetic:** caching and retry reduction do not merely save
money — together they **pay for the judge upgrade**, which is the one model change
[PLAN-TO-90](../../architecture/PLAN-TO-90.md) says everything else is blocked on. The budget question
and the quality question have the same answer.

If the provider does change afterwards, the same repartitioning is what keeps it affordable — with
caching in place, Sonnet 5 at standard pricing lands near today's cost; without it, the same swap is
substantially more.

---

### 4.1 One-off costs — the experiments, not the steady state

Separate from the per-run figures above, because these are paid once.

| item | cost | what it settles |
|---|---:|---|
| Read `story_20260819-2302` | free (a reader) | It is on disk, unread, and contains no statement that anyone killed anyone. Sharpest cheap datapoint available. |
| Rubric error bar — 3 cases x 3 scorings, frontier judge | ~$1.00 | Whether the gauge can resolve five marks. M1c measured +/-3 within one story; nobody has measured it across stories. |
| Full-story polish ON, one run | +$0.53 | Whether frontier line-editing moves the flat three. Expected return now LOWER — see §1.3. |
| Five runs, one per axis (upstream depth) | ~$0.50-2 | Four of the five would be the first of their kind. |
| **total to complete PLAN-TO-90 Phase 0 + 0b** | **~£2-3** | |

### 4.2 What to spend first

**£0 — the two fixes already in the tree.** X73 (Act III contract) and X80 (retry routing) are built,
tested, and unmeasured. They are Lever B. They cost nothing to enable because they are already
enabled; they cost one run to confirm. Read the unread manuscript in the same breath.

**~$0.10/run — the judge.** The cheapest change with the highest leverage, because every other
decision is currently made through an instrument that ranks an 81 above an 86
([PLAN-TO-90 §2](../../architecture/PLAN-TO-90.md)). It is one small call on a finished manuscript,
against +166% to move the writer.

**~one day — the prompt repartition (Lever A).** The only item here that is engineering rather than
config, and the one that pays for everything else. Without it a frontier provider swap is +60%; with
it, roughly cost-neutral. It also happens to be worth most on exactly the runs that go badly.

**Not yet — the generation-model swap.** It needs an interface change (`generateProse` is typed to
`AzureOpenAIClient`), and §1.3 has weakened the case for expecting craft gains from a better writer:
a frontier model is already line-editing half of every book and the flat three have not moved.

---

## 5. What NOT to do

- **Do not switch the writer to a smaller model to hit the budget.** The defect is that the prose is
  correct and unmemorable. Haiku 4.5 would buy cheaper runs of a book that is already stuck on craft.
- **Do not pursue the Batch API** (§3G).
- **Do not enable `proseBatchSize: 2` before regeneration is under control** (§3D).
- **Do not count the caching saving before verifying `cache_read_input_tokens` is non-zero.** A cache
  that silently never hits is indistinguishable from no cache, and this repo has a long record of
  configured levers that did nothing.
- **Do not treat the "two thirds identical" comment as a caching estimate.** Correct it in
  `agent9-run.ts` when Lever A is built — as written it will mislead the next person exactly as it
  misled me.

---

## 6. What would falsify this

- **Lever A is wrong if** the stable region cannot be made byte-identical — e.g. if the bible legitimately
  varies per chapter in ways the 43% measurement hides. The repartition should be built behind a
  measurement of `cache_read_input_tokens`, not a belief.
- **§2's cost picture is wrong if** `logs/llm.jsonl` under-records calls. It should be reconciled against
  the Azure invoice once, since [00_README §4.2](00_README.md) already found one ~6× telemetry error in
  this area and a second would invalidate every figure here.
- **§1.3's inference is wrong if** the per-chapter polish is much narrower than it looks — 4 of 10
  chapters, ~4K tokens each, may be too small a touch to move a category. That is testable by enabling
  full-story polish and comparing, which is 0b.1 in the plan.
- **§4's assembly is wrong if** the savings overlap more than assumed. A and D overlap by construction;
  A and B partially overlap (a retry re-sends a cacheable prefix, so caching already discounts some
  retry cost). The figures are deliberately conservative but have not been observed together on a run.

**What this document does not claim:** that any lever here raises the score. Levers A–D are cost only.
Lever E is the one quality change, it is nearly free, and it is aimed squarely at the measurement
problem rather than at the prose.

# ANALYSIS_74 — four reads in three days, and the first evidence about what moves a mark

**Written:** 2026-08-26 · **Trigger:** owner's request — *"tell me where we are on the path to 90 and what we can do to improve the system in general to get better scores."*

**Type:** a BOARD. Descends from [A_72](../ANALYSIS_72/ANALYSIS_72.md) (the distinctiveness thesis), [A_73](../ANALYSIS_73/ANALYSIS_73.md) (six review passes and their fixes) and [ROADMAP-FROM-82](../../../architecture/ROADMAP-FROM-82.md) (the action list).

**Method note, carried forward:** every claim is **MEASURED** (a check was run and its output quoted), **INFERRED** (follows from code or from one read), or **UNMEASURABLE HERE**.

**What is new since A_72, and it is the reason this document exists.** A_72 argued from 36 reads and a thesis. The three days since have produced **two runs, two external reads, and one falsifiable prediction that failed** — the project's first controlled evidence about which levers move which marks. That evidence is worth more than the marks themselves, and most of it says the plan needs amending.

---

## 1. Where the number is

**MEASURED** — `node scripts/external-read-ledger.mjs --best`, n=39 rows (38 with a full ten-category table).

```
best ever                86    2026-08-06 weighted pendulum (sum 83) · 08-17 reversed pendulum (sum 82)
                         85    08-23 hourglass (sum 80)
THE LAST FOUR READS      81 -> 85 -> 82 -> 80        sums 79 -> 80 -> 77 -> 76
best-ever-in-every-category sums to 85, and projects to 88.9 at the mean offset
```

**The trend across the four is down.** Two of those runs carried deliberate changes and two did not, so this is not a regression in the pipeline so much as the ordinary spread of a process whose run-to-run variance nobody has ever measured — which is itself the finding of §5.

### 1.1 The bar, unchanged and unforgiving

A floor of 90 at the **minimum** observed offset (+2, and eight of 38 reads came in at ≤2) needs a category sum of **88** — eight 9s and two 8s, on every run. Against that:

| category | mean | max | 9s in 38 reads | top-8 mean |
|---|---:|---:|---:|---:|
| premise | 8.0 | 9 | **8** | 8.8 |
| atmosphere | 7.5 | 9 | 3 | 8.3 |
| clues | 6.9 | 9 | 2 | 8.3 |
| ending | 6.7 | 9 | 2 | 8.3 |
| plot structure | 7.2 | 9 | 1 | 8.1 |
| **opening hook** | 7.2 | **8** | **0** | 8.0 |
| **character clarity** | 6.4 | **8** | **0** | 8.0 |
| **pacing** | 7.1 | **8** | **0** | 8.0 |
| **dialogue** | 6.3 | **8** | **0** | 7.1 |
| **prose** | 5.7 | **8** | **0** | 6.9 |

Five categories have **never** been given a 9 in 38 reads. A_72's arithmetic stands exactly as written: **at least three categories that have never scored a 9 must do so reliably**, and the five that can must stop being intermittent.

---

## 2. The controlled experiment, and it failed

**MEASURED.** Step 2 set four flags at once, each aimed at a different category, with a prediction recorded in advance ([ROADMAP §2c](../../../architecture/ROADMAP-FROM-82.md)):

> **prose 6→8, dialogue 7→8, sum 77→80±2.**

| category | 08-25 baseline | step 2 | predicted |
|---|---:|---:|---|
| prose | 6 | **7** | 8 — **+1, partial** |
| dialogue | 7 | **7** | 8 — **failed** |
| clues | 8 | **6** | — **regression, unrelated** |
| sum | 77 | **76** | 80±2 — **failed** |

**On the stated terms the prediction failed, and that is recorded rather than reframed.**

### 2.1 What survived

`AGENT9_FOLD_SUSPECT_CLEARANCES` + `AGENT9_CLEARANCE_AT_END` did what [A_73 §34](../ANALYSIS_73/ANALYSIS_73.md) said they would. In the 08-25 baseline the clearance injector was the reader's top prose complaint, quoted verbatim: *"that is not fiction… a generated evidence-summary fragment… this alone knocks prose/polish down hard."* In step 2 that complaint **is gone**; the reader instead noted *"Chapter 10 is much cleaner than the previous draft"* and *"less repetition than the previous draft."* The run log agrees — `clearance_over_budget` fired on ch10 of the baseline and **not at all** in step 2.

So the finding was right and the fix worked. It was worth **one mark, not two.**

### 2.2 What was falsified

**C4 (`AGENT9_LOCKED_FACT_ALIASES`) did nothing measurable, and may have hurt.** Dialogue held at 7, and the *new* prose complaint is timing leakage — *"By then it was a quarter to eleven. By then it was ten minutes past eleven."* Those are locked-fact time statements: C4's own territory. The lever meant to reduce repeated timing language coincided with repeated timing language becoming the named residual defect. At n=1 "did nothing" and "made it worse" are not separable, but **A_73 §2's inference that the verbatim contract was the dialogue tax is not supported.**

**Recommendation: C4 off** until there is a reason to think otherwise. It is the only lever on the board with no supporting evidence and a suspicious co-occurrence.

### 2.3 What the regression taught

`clues` 8→6 was **not** the flags. It was case arithmetic — the reader: *"10:10 to 10:45 is 35 minutes, not 30… if the reception clock shows an earlier time than the kitchen clock, it was set back or running slow, not advanced."* [A_73 §38](../ANALYSIS_73/ANALYSIS_73.md) root-caused it: the detector fired **twice** and the repair could not act, because detector and repair use different entry conditions for the same relation. Fixed at the prompt, and `AGENT3_DEVICE_TIME_BINDING` is now on.

**The lesson generalises beyond this bug:** a prose lever moving a category by +1 can be wiped out by an upstream authoring error costing −2 elsewhere. **Upstream correctness is worth more per unit of effort than prose polish right now**, and it is cheaper.

---

## 3. What actually changed in the system, 08-24 to 08-26

Not marks — machinery. Recorded because several of these change what future evidence is worth.

**Instruments that were lying, now fixed**

- `entity_pronoun_drift_count` reported **0** on a run whose own log said *"15 pronoun issue(s) remain"* and whose reader found a mis-gendering in chapter 1. The metric was captured from the *initial* snapshot, ~900 lines before the value was assigned, and `toNumber(undefined)` made an absence indistinguishable from a zero. Both ends fixed; it reports `null` when unmeasured.
- The **plan-to-90 arithmetic itself** was computed over manuscripts present on disk, not over the ledger. On a fresh clone it reported *sums to 78 · offset 6.0 · projects to 84.0* against the true 85 / 3.9 / 88.9 — same command, different answer, no indication. Fixed; it now reproduces A_72's numbers exactly.
- **Rework is ~30% of a run, not the 11% the audit reports.** Step 2 spent **11 repair calls against 10 first-pass calls**, $0.582 against $0.615. Every repair pass carries its own agent label, so the audit books the first call of each as fresh work. New per-pass instrumentation records whether each repair `changed` / `no_change` / `rolled_back`.

**Defects with reader-visible consequences, fixed**

- The clearance injector (§2.1), the device-arithmetic entry condition (§2.3), and a **five-site pronoun-model split** in which the pipeline assigned they/them pronouns to characters the drift detectors could not see — live on the 08-25 read, where prose contradicted a pinned `female` input and nothing flagged it. The cast is now binary end to end, matching the period.

**Cost, now measured rather than projected**

```
08-25 baseline  £1.78     repeats 21%     prose $0.91
step 2          £1.51     repeats 11%     prose $0.66
```

Azure prompt caching is **live and automatic** — a direct probe showed **99%** of a repeated prefix served from cache, and Agent 3's retries hit 99–100% in a real run. It was never off; it was invisible, because the beta SDK drops `prompt_tokens_details`. `LLM_HTTP_TRANSPORT` is now on, so the cost figures are real for the first time.

---

## 4. The thing that keeps being true

**MEASURED, across three days: twice I proposed building a capability this project already had, flag-gated and switched off.**

| proposed | reality |
|---|---|
| cache telemetry | fully built — parsed, tracked, logged; invisible only because the transport was off |
| cache-friendly prompt ordering | fully built as `AGENT9_PROMPT_PREFIX_ORDER`, registered, unset |

The standing inventory says the same. **Nine built levers are still off:**

```
AGENT9_PROMPT_PREFIX_ORDER    AGENT9_CRITICAL_BLOCK_CAPS    AGENT9_RUBRIC_IN_PROMPT
AGENT9_PROMPT_BUDGET_CRAFT_FLOOR    AGENT9_CROSS_CHAPTER_ECHO    AGENT9_OPENING_IDEATION
AGENT9_FULLSTORY_POLISH    AGENT5_RED_HERRING_FLOOR    AGENT9_GEOMETRY_ACCEPTANCE
```

> **This project's constraint has not been missing capability for some time. It is built capability that has never been switched on, and levers whose settling probe nobody has run.**

That reframes "how do we get better scores": the answer is mostly **not more engineering**. It is runs, reads, and decisions.

---

## 5. The measurement problem is now the binding constraint

**Four reads in three days, and the project still cannot say what a lever is worth.** Step 2 is the demonstration: four flags, one read, and the sum moved −1 — of which −2 came from an unrelated upstream regression. The signal from the levers was smaller than the noise from the case.

**MEASURED**: run-to-run variance has never been quantified. The last four reads span **80–85** with sums of 76–80, on a pipeline whose configuration changed between only some of them. A lever worth +1 cannot be detected against that.

**This is A_72 §10.4 D1, still unbuilt, and it is now the highest-value item on the board.** Five runs from one build, all read, is the smallest thing that can support the word *floor* — and it is also the only way to know whether any of §4's nine levers is worth turning on. At £1.51 a run that is **~£7.50 plus five reads**.

Until it exists, every single-run result — including step 2's — is one sample from an unmeasured distribution.

---

## 6. What to do, in order

### 6.1 Free, now

- [ ] **C4 off.** No supporting evidence; a suspicious co-occurrence with the residual prose complaint (§2.2).
- [ ] **Turn on `AGENT9_PROMPT_PREFIX_ORDER`.** Chapter prompts currently cache at 0–13%; the run-frozen blocks sit scattered behind a chapter-varying block at position 2. Worth ~£0.09/run, and it is *measurable now* that the transport is on. Its one risk — which block gets dropped under budget pressure — is read from `dropped=[…]` in the same run.
- [ ] **Read the repair-efficacy tally** off the next run. If polish comes back mostly `no_change`, `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` (default-ON, 7 calls, $0.54) is buying nothing.

### 6.2 The cohort — the item everything else waits on

- [ ] **D1: five runs from one build, all five read.** ~£7.50 + five reads. Produces the variance figure, the first honest floor, and the denominator every future lever comparison needs. **Nothing else on this board can be evaluated properly until it exists.**

### 6.3 Upstream correctness — better value than prose polish

§2.3's lesson. These cost marks in whole units, not fractions.

- [ ] **Verify X38 binds** on the next run — `derivedFrom` now required, binding now on.
- [ ] **Two murder weapons** — the 08-25 reader: letter opener in ch1, candlestick in ch3 and ch9. No mechanism checks weapon consistency.
- [ ] **`AGENT5_RED_HERRING_FLOOR`** — built, off, and red-herring shortfalls have recurred.
- [ ] **The gate-authority decision (B1)** — three of the 08-25 reader's six problems had already been detected and shipped as warnings. Four boards have deferred this.

### 6.4 The distinctiveness engine — the only route to a 9

Everything above defends 8s. **Nothing above can produce a 9**, and the arithmetic needs three new ones.

- [ ] **Regenerate the opening corpus** where the archive lives (`build-opening-corpus.mjs --write`). A2b refuses to run without it, by design.
- [ ] **Wire A2b** — the module is built; the plumbing is not.
- [ ] **A3 needs two edit sites**, not one — `character_pressure_contract` forbids what A3 would ask for ([A_73 §14.1](../ANALYSIS_73/ANALYSIS_73.md)).
- [ ] **CAUTION, new evidence.** The 08-25 baseline was the first run in which cross-run novelty actually worked (the ledger fix), and it produced a *less* distinctive device — `premise` 9→8, the reader: *"the mechanism is simpler."* The ledger holds seven clock-family cases, so "diverge from these" moved it to another clock trick. **Divergence from a monoculture stays inside the monoculture**, and A2b inherits that risk directly.

---

## 7. The honest position on 90

A_72 said 90-every-run needs eight 9s and two 8s against a corpus whose best composite sums 85. **Nothing in three days has changed that arithmetic**, and the four most recent reads (81, 85, 82, 80) sit five to ten marks below the bar.

What has changed is the quality of the evidence:

- One prediction was made in advance and **failed**, which is worth more than three that were never tested.
- Two levers are now **supported** (the clearance pair), one is **falsified** (C4), and one regression is **root-caused** (device arithmetic).
- The instruments that would have misled the next reader — the pronoun counter, the ledger arithmetic, the rework share — have been fixed, so future numbers mean what they say.

**The realistic near-term target is a reliable 86–88**, which is the reader's own forecast for both recent manuscripts with their named fixes applied. That would be a real achievement against a corpus whose recent floor is 78 — and it is not 90.

**Reaching 90 requires the distinctiveness engine to work**, and the single piece of evidence now available about divergence (§6.4) is a caution rather than an encouragement. The next honest step is not another prose lever. It is the cohort in §6.2, so that the next lever can be judged at all.

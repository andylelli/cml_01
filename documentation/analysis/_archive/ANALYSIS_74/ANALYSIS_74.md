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

### 6.2 The paired variance probe — two runs, and what they can and cannot settle

**Budget: two runs.** D1 as A_72 specified it — five runs, all read — is not affordable, so this is
the honest reduction rather than a smaller version of the same claim.

**What two runs CANNOT do, stated first so no later document quotes them as if they had.**

- **No floor.** A floor is a claim about the worst of N. With N=2 the "worst" is simply the lower of
  two samples and carries no information about the tail.
- **No variance estimate, and no confidence interval.** Two points give one difference, not a spread.
- **A SMALL gap proves little.** Two samples from a wide distribution can land close by luck. Only
  the large-gap outcome is conclusive.

**What they CAN do, and it is decision-relevant.** Two runs from an identical build give one
pairwise gap, and that gap is a **lower bound** on run-to-run spread. That is exactly the quantity
step 2 needed and did not have: a lever predicted to move a category by +1 cannot be read through a
process whose own noise is larger.

**The design.** Same build, same `canary-core-inputs.yaml`, both read cold. Agent 3b invents a fresh
device each run even on identical inputs (A_72 §13.5 — the same yaml produced a tide mechanism and
then an hourglass), so this measures the real end-to-end spread including case difficulty, which is
the spread that matters.

**The decision rule, written BEFORE the runs so it cannot be rationalised afterwards.** Let `gap` be
the difference in category SUM between the two reads (sum, not headline — the headline carries the
reader's offset, which this project does not control and which A_72 §1.2 measured at 0..+8):

| gap | what it means | what the board does |
|---|---|---|
| **≥ 4** | noise exceeds every lever on the board | **single-run attribution is dead.** No lever ships on one read again; §6.3 and §6.4 are re-planned around paired designs, and the levers in §4 stay off until they can be tested properly |
| **2–3** | noise is comparable to a strong lever | only levers predicted to move **≥ 3 marks** are worth a single-run test; the rest wait |
| **≤ 1** | noise is smaller than a strong lever | single-run attribution is defensible; proceed down the lever queue in §6.3 — **but treat this as provisional**, per the small-gap caveat above |

**Prerequisites, all free and all in §6.1** — do them first, so the pair measures the current best
build rather than a stale one: C4 off, `AGENT9_PROMPT_PREFIX_ORDER` on.

**What rides along for free on the same two runs.** These need no extra spend and answer four open
questions:

- **repair efficacy** — what share of a ~30%-of-spend stage changes the text at all
- **cache rate with prefix order on** — against the measured 0–13% baseline
- **X38 binding** — whether the device arithmetic is now repaired at source
- **cost** — the first figures with caching visible on both runs

**Why not spend the two runs on a lever instead.** Considered and rejected: a matched pair with a
lever on and off measures that lever *through* unknown variance, which is precisely what made step 2
uninterpretable. Bounding the noise first is what makes every later run readable. Two runs spent on
the denominator are worth more than two spent on one more numerator.

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

**Read §8 before acting on any of this.** The caution above was written as if the engine had been tried. It has not: the canary pins `primaryAxis: temporal` and names the clock in the theme string, a hard selector enforces it, and the structural judge is mathematically incapable of seeing a monoculture. §8 has the evidence and a design.

---

## 7. The honest position on 90

A_72 said 90-every-run needs eight 9s and two 8s against a corpus whose best composite sums 85. **Nothing in three days has changed that arithmetic**, and the four most recent reads (81, 85, 82, 80) sit five to ten marks below the bar.

What has changed is the quality of the evidence:

- One prediction was made in advance and **failed**, which is worth more than three that were never tested.
- Two levers are now **supported** (the clearance pair), one is **falsified** (C4), and one regression is **root-caused** (device arithmetic).
- The instruments that would have misled the next reader — the pronoun counter, the ledger arithmetic, the rework share — have been fixed, so future numbers mean what they say.

**The realistic near-term target is a reliable 86–88**, which is the reader's own forecast for both recent manuscripts with their named fixes applied. That would be a real achievement against a corpus whose recent floor is 78 — and it is not 90.

**Reaching 90 requires the distinctiveness engine to work**, and the single piece of evidence now available about divergence (§6.4) is a caution rather than an encouragement. The next honest step is not another prose lever. It is the paired probe in §6.2 — two runs, one gap — so that the next lever has any chance of being judged at all. Note what that concedes: two runs cannot establish a floor, and §0's goal is stated as a floor.

---

## 8. The distinctiveness engine — a design, from five disciplines

§6.4 says the engine is the only route to a 9 and then records a caution: the first run in which
cross-run novelty actually worked produced a *less* distinctive device. That caution was written as
if the engine had been tried and had disappointed. **It has not been tried.** This section reads the
code and the data underneath the caution, finds that the engine has never been in a position to act,
and then designs one that can — borrowing the argument from maths, logic, craft, art and
experimental method in turn, because each discipline sees a different half of the same failure.

The section is long because the finding is structural. §8.1 is evidence. §8.2–§8.6 are the five
lenses. §8.7 assembles the engine as buildable items. §8.8 says what would prove it wrong.

---

### 8.1 What the corpus actually contains

The cross-run ledger is `apps/api/data/novelty-ledger.json`. Seven shipped runs. Counted by field:

```
axis            7 / 7   temporal                      <- ONE value, the only enum field present
crimeSubtype    7 / 7   distinct strings              <- perfect variety, by construction
deathMethod     7 / 7   distinct strings              <- perfect variety, by construction
era             6 / 7   1930s
location        5 / 7   "<Name> Manor"                <- five distinct strings, one genus
titles                  Sundial Shadow · Sundial's Silent Verdict · Thermally Sealed Study ·
                        Garden Sundial Enigma · Bell Tower's Last Chime · Sundial's Frozen
                        Shadow · The Fete's Frozen Hour
```

Three of seven titles say *sundial*. The other four are a bell tower, a frozen hour, a frozen shadow
and a thermally sealed study. Every one is a time-of-death trick. The three manuscripts still on this
machine — `the_frozen_hour_at_coastview_hotel`, `the_case_of_the_rewound_lobby_clock`,
`the_thirty_minute_error_a_seaside_hotel_clockwork...` — are the same again.

**Seven of seven on one axis is not sampling variation.** Under uniform sampling from six axes,
P(all seven identical) = 6 × (1/6)⁷ ≈ 1.4 × 10⁻⁵. Whatever is producing this corpus, it is not a
process that chooses an axis. Five findings explain it, and each is checkable without a run.

#### 8.1.1 The canary pins the axis and names the mechanism in the theme string

`scripts/canary-core-inputs.yaml`:

```yaml
theme: "Golden Age country-house murder driven by a mechanical clock-tampering method. ..."
primaryAxis: temporal
locationPreset: SeasideHotel
```

`MECHANISM_FAMILY_KEYWORDS.clock` matches `clock` in that theme, so
`extractThemeMechanismFamilies` locks the theme family to `clock`; `selectThemeCoherentPrimary` then
**forces `devices[0]` to realize it**, and the 3b prompt says in terms:

> Do NOT swap in an unrelated family (e.g. tide, poison, acoustics, thermal) for the primary device
> "for novelty".

So the run's own inputs demand a clock, a hard selector enforces the demand, and the prompt forbids
the substitution by name — while `divergeFrom` politely asks for variety. **"Divergence from a
monoculture stays inside the monoculture" is not an emergent property of LLM behaviour. It is one
line of YAML and one selector.**

This is not an argument for changing the canary. The canary's job is *control* — the paired probe in
§6.2 depends on its being fixed. The defect is that one file is doing two jobs: it is the experimental
control *and* the only input the product has ever been run on. Every one of the 38 external reads is
a sample from a single cell of the design space.

#### 8.1.2 The structural judge cannot see clustering, by construction

`packages/novelty/src/compare.ts` is a **nearest-neighbour** criterion: `judgeNovelty` sorts the
corpus by severity and returns the *worst single neighbour*. That answers "am I a clone of some one
prior case?" It cannot answer "is this corpus a monoculture?", because those are different questions
and only the second one is the one being asked here.

Run the current corpus through it. Any two of the seven share `axis` and nothing else, so
`shared.length === 1`, `sharesBelief` is false, `trickShared` is 0 — **verdict `distinct`, for every
pair, in a corpus that is 100% temporal.** A minimum-pairwise-distance test is satisfied by points
spread out along a line; it has no term for the dimensions the points never leave.

#### 8.1.3 Two of the five fields are free text compared by exact equality

`FIELDS` is `[axis, mechanism_family, false_assumption_pattern, discriminating_test_shape,
inference_shape]`. Three are enums. Two — `false_assumption_pattern` and `inference_shape` — are
free-text snake_case labels invented per run by an LLM, and `sharedFields` compares them with
`norm(a) === norm(b)`.

Exact string equality between two independently-invented labels is a low-probability event. And those
two fields carry almost all the weight: `sharesBelief` gates the clone verdict, and
`TRICK_FIELDS = [mechanism_family, inference_shape]` puts one of them in the trick count. With
`CLONE_MIN_SHARED = 4` of 5 and only three fields realistically matchable, **the overlap route to
`clone` is close to unreachable and the belief route fires only on a lucky collision.** The judge's
discriminating power collapses onto `axis` — which the canary has pinned.

The extractor's own header says this out loud about the *deterministic* skeleton
(*"a keyword skeleton scores `distinct` for every input"*). The observation generalises further than
the header claims: with free-text labels on both sides, the LLM skeleton is not much better off.

#### 8.1.4 The judge is never shown a prior run

`agent3-run.ts:455` — `judgeNovelty(skeleton, loadReferenceCorpus())`. `loadReferenceCorpus()` is
`[...loadSeedFingerprints(), ...loadClicheLedger()]`. **Prior runs are not in it**, even though
`Corpus` declares `"prior_run"` as a member.

So the pipeline has two novelty organs and they are wired to different worlds:

```
the LEDGER          sees prior runs        speaks only in free-text avoidance lines to a prompt
the SKELETON JUDGE  sees a fixed corpus    speaks in a structured verdict, in shadow, to a console
```

The organ that can *measure* structure never sees the repetition. The organ that sees the repetition
can only whisper. This is the repo's signature defect class again — one concept implemented twice,
and the observable copy is the one attached to nothing.

And the seed corpus makes it sharper. Fourteen seed fingerprints: **five axes, thirteen distinct
mechanism families, only 2 of 14 temporal.** The reference corpus is genuinely diverse. The pipeline
is asked to diverge from a diverse corpus and lands, every time, in its smallest corner.

#### 8.1.5 The shadow verdict is not persisted anywhere durable

The judge has been running in shadow by default (`NOVELTY_SKELETON_JUDGE ?? "shadow"`), printing
`skeleton={...}` to the console and calling `upsertDiagnostic("novelty_skeleton_judge", ...)`. The
surviving run report `apps/worker/logs/run_20260825_mystery-.json` contains stages `novelty` and
`novelty_math` and **no occurrence of `skeleton`, `false_assumption_pattern` or `inference_shape`.**
A long shadow deployment has therefore produced no retrievable dataset. Shadow mode is only worth its
call cost if someone can read it later.

#### 8.1.6 The ledger silently skips the runs most worth recording

`mystery-orchestrator.ts:1715`:

```ts
if (isCrossRunNoveltyEnabled() && status !== "failure" && ctx.cml) {
  try { await appendNoveltyLedger(extractPriorRunRecord(ctx.cml, runId)); }
  catch { /* best-effort persistence; ignore */ }
}
```

Two silences in four lines. A run with `errors.length > 0` is never recorded, and any write failure is
swallowed without a log. The ledger file's mtime is **2026-08-24**, so neither 08-25 run appended —
and both are exactly the runs whose defects the next run should be diverging from.

This is survivorship bias in the corpus: the ledger holds only the runs that went well, so
"diverge from recent runs" is really "diverge from recent *clean* runs". Cause is not proven here —
either branch could be responsible — but **the free check is one line and it should be run before the
paired probe**, because the probe's second run is supposed to see the first one in the ledger.

#### 8.1.7 Five vocabularies for "what kind of trick is this", none of them joined

| where | name | values |
|---|---|---|
| `@cml/novelty` `types.ts` | `Axis` | 6 — includes `epistemic` |
| `@cml/device-library` `types.ts` | `CmlAxis` | 5 — **no `epistemic`** |
| `@cml/novelty` `types.ts` | `MechanismFamily` | 14 — `poison_delayed`, `recorded_presence`, … |
| `@cml/device-library` `types.ts` | `MechanismFamily` | 5 — `timing`, `spatial_routing`, … |
| `agent3b-hard-logic-devices.ts` | `MECHANISM_FAMILY_KEYWORDS` | 8 — `clock`, `tide`, `poison`, … |
| `agents/shared.ts` | `FAMILY_AXIS` | free-text — *"schedule contradiction"*, *"timing window trap"* |

Six rows, one concept. The `agent3b` classifier is used **only** to enforce theme coherence; nothing
ever classifies a *shipped* run into a mechanism family, which is why the ledger records
`deathMethod: "struck with a heavy brass choir bell clapper"` and calls it novel.

#### 8.1.8 A curated, usage-aware device library exists and is not plugged in

`packages/device-library/` — eleven schema-validated, era-annotated patterns
(`clock_rewind`, `tidal_window`, `delayed_poison`, `mirror_misdirection`, `recorded_presence`,
`concealed_passage`, `string_pulley_lock`, `substituted_identity`, `forged_document_timeline`,
`hearth_release`, `trusted_authority_lie`) across four families, with feasibility gates
(`requires` / `forbids` per era), clue archetypes, and `retrievePatterns` returning a
**`noveltyScore` that decays with `usage_log` length**. It has golden tests.

Grep for its consumers outside its own package: `scripts/build-all.mjs` (which compiles it) and a
comment in `cml-core/device-binding.ts` explaining that cml-core deliberately does *not* depend on it.
**No pipeline code imports it.** The retrieval-and-recombination architecture was designed, built,
tested, and never connected; Agent 3b invents from scratch every run instead.

---

### 8.2 Maths — the statistic is wrong, and the sampler is missing

**Separation is not dispersion.** §8.1.2 is a measurement-theory error, not a bug. The engine needs a
second statistic alongside nearest-neighbour, and the natural one is free: per-field normalised
entropy over a trailing window.

```
H_axis = -Σ p log p  /  log 6        today: 0.00   (7/7 temporal)
H_mech, H_test, H_place, H_era       same shape, same file, zero LLM cost
```

One number per field, computed from `novelty-ledger.json`, logged every run. A monoculture is then
*visible* rather than inferable. Set no threshold yet — just publish the number, because a threshold
chosen before the number is known is a guess.

**Replace i.i.d. sampling with a stratified schedule.** The addressable design space is
`axis (6) × mechanism_family (14) × discriminating_test_shape (6) = 504` skeletons before any social
layer. Seven runs have occupied one axis. Asking a model to "diverge" is Monte Carlo with a strong
prior; the deterministic alternative is a **low-discrepancy walk** — Halton/Sobol in spirit, a
round-robin in practice:

> Choose the next run's `(axis, mechanism_family, discriminating_test_shape)` as the least-recently-
> used feasible cell, subject to: it differs from the previous run in **at least two** coordinates.

Deterministic, reproducible from the ledger, zero marginal cost, and it makes repetition *impossible*
rather than *discouraged*. Low-discrepancy sequences beat random sampling precisely on the property
wanted here: they fill a space evenly at small N, which is the only N available.

**Frequency is the wrong lexical statistic; surprisal is the right one.**
`opening-freshness.ts` measures word share **in the generator's own 184 manuscripts** — `scent` 76%,
`faint` 72%, `pressed` 63% — and then hand-subtracts two categories: validator-required grounding
words, and the story's own furniture (`hotel`, `clock`). Both subtractions are correct and both are
symptoms. The generator is being compared only to itself, so the best achievable outcome is
regression to its own mean.

The principled measure is **pointwise log-odds against an external reference** — a corpus of real
1930s–50s detective fiction:

```
score(w) = log ( p_generator(w) / p_genre(w) )
```

`scent` at 76% vs a genre rate near a few percent scores enormously and is a real tic. `clock` at 36%
in a corpus of clock mysteries scores near zero and drops out **automatically** — the "story's own
furniture" exemption stops being a hand-maintained list and becomes arithmetic. This is the standard
keyness statistic from corpus linguistics, and it is the difference between "not our average" and
"distinctive".

**Choosing k of n is a volume problem, not a distance problem.** Agent 3b already generates five
devices and picks by theme-match. Where a theme is not locked, the right selector is
**farthest-point (Gonzalez / max-min)**: pick the candidate whose *minimum* distance to the already-
chosen set is greatest. Summed-distance selection can pick two near-identical outliers; max-min
cannot. Same call, same cost, better geometry — this is the cheap cousin of a determinantal point
process and it is a dozen lines.

---

### 8.3 Logic — a prohibition under-determines; an obligation does not

**"Avoid X" has an infinite satisfying set and a model will pick the nearest member of it.** That is
the whole of §6.4's caution, stated as a property of constraint satisfaction rather than a mystery
about LLMs. Told to diverge from seven sundials, the minimum-edit satisfying answer is a bell tower.
It is a *correct* answer to the constraint as posed.

The repair is not a stronger prohibition; stronger prohibition produces the same move with more
words, and this repo has already paid for that lesson — X95's closed vocabulary produced *"certified
wave crest hour"*. **The repair is to replace the prohibition with an obligation.** "Do not write
another clock story" has an infinite satisfying set. "This run is `epistemic` × `poison_delayed` ×
`chemical_timing`" has a small one, and every member of it is somewhere the pipeline has never been.

`opening-freshness.ts` already discovered this independently and says so — *"Do NOT reach for a
synonym … Open on a concrete detail that only THIS case could produce"* — a negative instruction
immediately rescued by a positive one. §8.2's scheduler is that same move applied to the case rather
than the sentence.

**When a soft instruction and a hard selector disagree, the selector wins — every time.** §8.1.1's
theme lock is enforced in code; `divergeFrom` is a line in a prompt. There is no run on record in
which the novelty engine was permitted to change the answer. Any claim that it "does not work" is
currently unfalsifiable, which is a worse position than "it failed".

**Separate the control input from the product input.** One canary file, held fixed, for measurement.
A second input set, scheduled by §8.2, for everything else. Conflating them means the experiment
constrains the art and the art contaminates the experiment.

**The space is not scarce — the addressing is.** 504 structural cells, times a social layer, against
a corpus of 38 reads. Nothing here is running out of ideas. It is running out of *coordinates*.

---

### 8.4 Craft — the reader did not say "familiar", they said "simpler"

The exact complaint on 08-25 was **"the mechanism is simpler"**, and `premise` fell 9→8. That is not
a novelty complaint and treating it as one is a category error that would send the whole engine after
the wrong quantity.

What Golden Age readers score as distinctive is **the depth and independence of the inferential
chain**, not the exoticism of the object. A second clock is not more distinctive than a first clock. A
clock whose falsity is provable **two independent ways** — one physical trace, one human behaviour
that only makes sense if the time were different — is. The genre's memorable cases are frequently
mundane in mechanism (a dinner, a letter, a train) and unforgettable in *structure*.

Three craft levers follow, and none of them needs a new agent:

- **Demand two independent proof paths for the discriminating test.** The geometry code set already
  contains `method_signature_absent` and `reveal_times_not_stated`; it has no code for *"the
  contradiction rests on a single observation"*. That is the code most worth writing, and it is a
  deterministic check over Agent 5's clue graph — count the independent paths from evidence to the
  locked fact. One path is a puzzle. Two crossing paths is a *proof*, and it reads as depth.
- **Generate the social situation first, the mechanism second.** The pipeline currently invents a
  device and then dresses it in a manor, which is why five of seven locations are `<Name> Manor` — the
  setting is upholstery. Inverting the order is exactly what A2b does for the *opening*; §8.7 proposes
  doing it for the *case*. What makes a murder invisible is usually a social fact (who is permitted
  where, whose word counts, what nobody thinks to mention), and social facts are where the six
  unused axes — `authority`, `behavioral`, `identity`, `epistemic` — actually live.
- **Let fair-play do the selecting.** Fair-play is treated as a tax on the case. It is a filter: the
  tighter the demand (every mechanism-critical clue before the midpoint, the discriminating test no
  later than early Act III), the fewer mechanisms survive, and the survivors are forced to be
  specific. A constraint that eliminates most candidates is a distinctiveness engine already.

---

### 8.5 Art — the fox with two tails

The image is the specification. A fox with two tails is not a stranger animal than a fox; it is an
animal that **makes you look twice at the same thing**. Everything in §8.2 chases *unfamiliarity*.
The 9s go to the second look.

- **The double-take is a structure the codebase half-owns already.** `false_solution_absent` is in the
  geometry code set, so the pipeline knows a false solution matters — but the false solution it
  builds is a *wrong suspect*. The two-tailed version is a **wrong mechanism that is fully, fairly
  clued and genuinely works**: the reader solves it, is right about the shape, and wrong about the
  substance. The second tail is not extra; it is the first tail seen again.
- **Defamiliarise by subtraction.** The opening-freshness block is right in spirit but additive — it
  asks for a fresher image. The stronger move is to remove the expected channel: a body discovered by
  a *sound that has stopped* rather than a scent that is present. `scent` opens 76% of the archive;
  the instruction "do not open on any smell" is more generative than any list of better smells.
- **One arbitrary hard constraint per run — the Oulipo move.** Rotate a single aesthetic rule from a
  fixed list, scheduled by the same LRU walk as the axis: *the detective never enters the room where
  the murder happened*; *no character is ever alone with the body*; *the solution turns on a remark
  made in chapter 1 by the least important person present*. Free, deterministic, schedulable, and it
  varies a coordinate the rubric can actually see — because it forces the *scene design*, not the
  vocabulary. Constraint is the cheapest known generator of invention.
- **Distinctiveness is a relation, not an object.** No device is distinctive in isolation. What is
  remembered is the fit between a mechanism and the one social situation in which it is invisible —
  the tide table and the harbourmaster, the recording and the man everyone heard. The engine should be
  scored on the *pairing*, which is another argument for §8.4's inversion of the generation order.

---

### 8.6 Science — measure the engine before spending reads on it

Two runs of budget (§6.2) and a ten-category read are the scarce resources. The single most useful
observation in this section is that **almost nothing above needs either.**

**Split the question in two.** "Is the engine producing variety?" is a property of the *output
structure* — axis, family, test shape, entropy — and is answerable from files already on disk, with
zero reads and zero LLM calls. "Does variety earn higher marks?" needs a human. Every attempt so far
has conflated them and therefore spent reads answering the first.

**The ablation ladder, cheapest rung first:**

| rung | question | cost |
|---|---|---|
| 0 | Does the ledger record every run? (§8.1.6) | free, one line |
| 1 | What is `H_axis` over the last N runs? (§8.2) | free |
| 2 | Does a scheduled cell actually change what 3b emits? | free — read the log, no human |
| 3 | Does the skeleton judge see prior runs and change its verdict? (§8.1.4) | free |
| 4 | Does a case from an unused cell read as *more* distinctive? | 1 run + 1 read |

Rungs 0–3 are structural facts. Rung 4 is the only one that needs the reader, and it must not be run
until 0–3 are green — otherwise the read is spent discovering a wiring defect.

**The negative control is the most valuable outcome available.** If a scheduled
`epistemic` × `poison_delayed` case scores the *same* as the seven clock cases, that is a genuine
result and a better one than a small rise: it says mechanism-distinctiveness is not what the reader is
scoring, and redirects the whole engine towards §8.4's craft levers. Design the experiment so that
outcome is legible rather than disappointing.

**One caution about §6.2.** Rung 4 and the paired probe both want the two available runs, and they
cannot both have them. The probe should keep them: without a spread estimate, rung 4's single read is
uninterpretable in exactly the way step 2's was. §8.7 is therefore sequenced as *free work now,
paid work after the probe reports*.

---

### 8.7 The engine, assembled

Nine items. **DE1–DE6 are free and need no run**; DE7–DE9 spend. Ordered so that each one makes the
next one measurable.

| id | item | cost | why it comes here |
|---|---|---|---|
| **DE1** | **Prove the ledger records every run.** Log both silent branches at `mystery-orchestrator.ts:1715` — the `status === "failure"` skip and the empty `catch`. | free | The corpus everything diverges from is currently missing at least the two most recent runs (§8.1.6). Nothing downstream is trustworthy until this is. |
| **DE2** | **Publish dispersion.** Per-field normalised entropy over the ledger window, one log line per run, no threshold. | free | Makes the monoculture visible instead of inferable (§8.2). Establishes the baseline `H_axis = 0` that DE7 must move. |
| **DE3** | **Show the skeleton judge the prior runs.** Add `prior_run` fingerprints to `loadReferenceCorpus()`, still in shadow, and **persist the skeleton into the run report** so the shadow deployment finally produces a dataset. | free | §8.1.4/§8.1.5. The judge currently compares against a corpus that cannot contain the repetition. |
| **DE4** | **One family vocabulary.** Pick `@cml/novelty`'s `MechanismFamily` (14 values — the most expressive) as canonical and map the other four onto it; classify each *shipped* run into it and store it in the ledger record. | free | §8.1.7. Without this, no dispersion statistic on mechanism is possible and DE7 has nothing to schedule over. |
| **DE5** | **The cell scheduler.** Least-recently-used feasible `(axis, mechanism_family, discriminating_test_shape)` from the ledger, constrained to differ from the previous run in ≥2 coordinates. Emits a *positive* directive, not an avoidance line. Flag-gated, default off. | free to build | §8.2 + §8.3. Turns an infinite prohibition into a small obligation. |
| **DE6** | **Split the inputs.** Keep `canary-core-inputs.yaml` frozen as the control. Add a second input set whose axis/theme are supplied by DE5 rather than hard-coded. | free | §8.1.1/§8.3. Until this exists, DE5 has nothing to act on and the engine stays untested. |
| **DE7** | **Rung 2–3 dry run:** build with DE5 on against the DE6 inputs and read **the log, not the manuscript** — did the axis change, did 3b emit a non-clock primary, did the judge's verdict move? | ~£1.5, **no read** | The cheapest possible falsification of the whole engine. If the axis does not change, DE5 is broken and no reader is needed to know it. |
| **DE8** | **Wire the device library.** `retrievePatterns` with era feasibility and usage-decayed `noveltyScore` as 3b's candidate seed, recombined rather than copied; log `usage_log` growth. | free to build, verified inside DE7/DE9 | §8.1.8. The architecture exists; this is plumbing, and it is the deterministic half of distinctiveness. |
| **DE9** | **Rung 4:** one scheduled case from an unused cell, read cold, compared against the probe's spread. | ~£1.5 + 1 read | **After §6.2 reports.** Its result is only interpretable against a spread estimate. |

Two craft items sit outside the table because they are not novelty work and should not be judged as
such: the **two-independent-proof-paths** geometry code (§8.4) and the **fully-clued false mechanism**
(§8.5). Both are deterministic checks over structures Agent 5 and Agent 6 already produce, and both
target `premise` and `clues` — the two categories that have actually reached 9 before, which makes
them the cheapest 9s on the board.

---

### 8.8 What would falsify §8

- **§8.1 is wrong if** the ledger's seven temporal records turn out to be a display artefact — if
  `mapToNoveltyAxis` is coercing a varied field to `temporal`. It is not: the fallback is
  `behavioral`, so `temporal` can only come from the CML. But DE1's logging should confirm it, because
  the last time this corpus looked uniform the cause was a silent coercion in the orchestrator, and
  that is exactly the kind of thing that is wrong twice.
- **§8.2 is wrong if** dispersion turns out to be high on the fields that are not `axis` — if
  `H_mech` over a proper classification is near 1 while the reader still says *"simpler"*. Then
  variety is already present, distinctiveness is not variety, and the engine should be abandoned in
  favour of §8.4 entirely. **DE2 and DE4 answer this for free and should be done first for exactly
  this reason.**
- **§8.3 is wrong if** DE7 shows the axis changing and 3b producing a clock anyway. That would mean
  the positive constraint is being overridden somewhere further down, and the finding would be a
  wiring defect rather than a design principle.
- **§8.4 is wrong if** a case with two independent proof paths reads no better than one with a single
  path. That is a genuine possibility — depth may read as *complication* rather than *rigour* — and it
  is the one claim here that no free measurement can settle.
- **§8.5 is unfalsifiable as written**, and should be treated as taste until DE9 gives it a number.
  It is included because the 9s the corpus has actually earned came from `premise` and `clues`, and
  because a section about distinctiveness that contains no aesthetic argument is not being honest
  about what the reader is scoring.
- **The whole section is wrong about 90 if** DE9's unused-cell case scores the same as the clock
  cases. As §8.6 says, that is the most useful outcome on the table — not a failure, a redirection.
  Nothing here should be built in a way that makes that answer hard to hear.

---

## 9. The engine ran. Here is what it bought, and what it did not.

**The 40th external read**, `read-20260826-1708`, `The Elevator Cage Enigma` — the first case this
pipeline has ever produced outside the temporal/clock cell. Scheduled by DE5 as
`spatial × locked_room_key × physical_trace`, generated with DE8's curated corpus on, £1.45, 40 calls,
shadow rubric 84.

**External: 79/100, category sum 75.**

### 9.1 What the numbers actually say

```
bundle              ext  sum |  prem open plot char dial atmo clue paci endi pros
read-20260817-2209   86   82  |    9    8    8    8    8    8    8    8    9    8   <- best ever
read-20260823-2038   85   80  |    9    8    8    8    7    8    9    8    8    7
read-20260825-1838   82   77  |    8    8    8    8    7    8    8    8    8    6
read-20260825-2102   80   76  |    8    8    8    8    7    8    6    8    8    7
read-20260826-1708   79   75  |    9    8    8    8    7    8    6    8    7    6   <- SCHEDULED
```

**Eight of ten categories are identical to the two runs before it.** One went up — `premise`, 8 → 9.
One went down — `ending`, 8 → 7. The sum moved 76 → 75.

That difference is **inside the noise**. §8.6's free measurement found same-build pairs less than an
hour apart with sum-gaps of 4 and 10; a gap of 1 carries no information at all. Anyone reading "79 is
lower than 82" as evidence that the scheduler hurt is reading a number smaller than this pipeline's
own measurement error.

### 9.2 The engine did the one thing it was built to do

`premise` went to **9**, and the reader named the cause without being asked:

> *"The setting and premise are fresh, though: the elevator indicator acting as a false witness is a
> nice break from clock-only mysteries."*
>
> *"Premise / concept 9/10 — Elevator indicator/bell deception is fresh and promising."*

That is DE5's falsification criterion passing on its first attempt. §8 predicted that a positive
assignment into a never-visited cell would produce a case a reader calls fresh; a reader called it
fresh, in those words, and contrasted it explicitly against the monoculture it came from.

It is one read. It is not proof. But it is the first evidence in 40 reads that bears on the question
at all, and it points the right way.

### 9.3 And the headline did not move, because the loss was somewhere else entirely

`clues` **6**, `prose` **6**, `ending` **7**. The reader's summary:

> *"This is a good concept draft with a fresh mechanism, but it needs mechanical clarity."*
>
> *"With a clean elevator explanation, one weapon, and the Chapter 10 leakage removed, this could
> reach **86–89/100**."*

So the case was good and the **execution machinery failed it**. That is a different problem from the
one §8 was written about, and it is worth separating cleanly, because the two have opposite
implications for what to do next.

### 9.4 THE FINDING: the gate saw five of the reader's seven problems and shipped

This is not a detection failure. Every one of these is a warning the run printed, in its own log,
before the manuscript was written to disk.

| # | What the reader said | What the run had already warned |
|---|---|---|
| 1 | *"the elevator mechanism is not explained clearly enough… I still do not fully know what Sylvia physically did"* — the single biggest problem | `geometry reveal_method_absent (ch9): Chapter 9 does not state how the murder was physically done.` |
| 2 | *"Weapon confusion: paperweight vs decanter… Use one weapon"* | `geometry method_signature_absent (ch1): Chapter 1 shows no physical sign of the manner of death ("struck with a heavy glass decanter")` |
| 3 | *"The final test is not quite a test… does not clearly prove one theory over another"* | `geometry clincher_absent_at_payoff (ch9): Chapter 9 produces no decisive physical trace tying the culprit to the act. The contract names one… It exists in the clue set and must be on the page here as proof.` |
| 4 | *"Chapter 9 repeats after the confession… that order weakens the reveal"* | `geometry reveal_culprit_not_named (ch9)` + `geometry aftermath_repeat (ch10): re-delivers what chapter 9 already disclosed` |
| 5 | *"Chapter 10 still has validation leakage… That is generated checklist leakage. It must be deleted."* | `[X4] injector-vs-lint: enforceCulpritEvidencePresence injected a sentence into chapter 10 … that violates verdict_closer.was_responsible — a rule the model is held to. **The injection STANDS (ADR-0003)**` |

Five for five, and the fifth is the sharpest thing found this session. The reader quoted the offending
sentences verbatim:

> *"Captain Ivor Hale had been elsewhere, and the evidence around Single shoeprint matching sylvia
> trent shoes held…"*

The pipeline **wrote that sentence on purpose**, recorded that it violated its own `verdict_closer`
rule, and shipped it because an architecture decision says injections stand. **`prose` 6 is not a
model failure. It is the direct, traceable output of a policy.** That is the cheapest 2 marks on the
board and it costs a decision, not a build.

This is [B1](../../../architecture/PLAN-TO-90.md), gate authority, now open across six documents with
a fifth and sixth data point. A_74 §3c said the gate saw three of six. It now sees five of seven, and
one of them it authored itself.

### 9.5 The second finding: the repair machinery is tuned to the cell we just left

`clues` **6** is the equal-lowest clue mark of the modern era, and the reason is structural rather
than accidental.

The reader's #1 complaint is that a *mechanism* is under-explained. For a clock case this pipeline has
a dedicated apparatus for exactly that: `X38` / `locked_time_arithmetic` checks the device's own
numbers against each other, `AGENT3_DEVICE_TIME_BINDING` binds the locked facts into the CML prompt,
`reveal_times_not_stated` demands both times in the same passage. **Five of the fifteen geometry
acceptance codes are temporal-only.** A spatial case walks into a thinner net.

The evidence that this is real and not a story: `X38` fired *on this run anyway* — the case declared
anchors thirty minutes apart against a `critical_interval_duration` of *"forty minutes"* — because the
temporal machinery is the machinery that exists, and it went looking for its own kind of defect in a
case that was not about time. Meanwhile *"what did Sylvia physically do to the elevator"* had no
equivalent check, and that is the question the reader could not answer.

So the honest statement of the trade this run measured:

> **Moving to a fresh cell raised the concept mark and exposed how much of the quality apparatus is
> cell-specific.** The engine did not make the pipeline worse. It made visible how narrow the
> pipeline's competence had become while nobody could see the walls.

### 9.6 Two more things the run surfaced

**The blind-reader gate did not run.** `Agent6-BlindReader` was refused by Azure's content filter
(violence: medium — the case's manner of death is in the prompt), so the gate was **SKIPPED, not
passed**, and its remediation loop never executed. On a run whose largest failure was fair-play
clarity, the fair-play reader was absent. Whether that caused the `clues` 6 cannot be established from
one run, but it must not be recorded as a passing gate.

**The internal rubric over-scored by 5.** Shadow rubric **84 — "Very strong"**; external **79**. The
shadow judge saw no problem with a mechanism the reader called foggy. That is the internal rubric
failing on exactly the axis it is least able to see, and it is a caution against using the shadow
number to decide anything about an unfamiliar cell.

### 9.7 What this changes

- **DE5 and DE6 are supported.** Keep them. The assignment reached the model, the model realized it,
  and the reader rewarded the result on the intended axis.
- **DE8 is unresolved.** Run 1 had the curated corpus; run 2's cell has no library coverage and
  correctly emitted no block. That is a free ablation, not a designed one, and it is worth exactly
  what an accidental N=1 comparison is worth — but it is the only DE8 evidence there will be for now.
- **The next lever is not another distinctiveness lever.** It is **gate authority**. Five detected
  complaints shipped; one of them the pipeline injected itself, knowingly. Nothing in §8 is worth as
  much as acting on that, and it needs no run to decide.
- **§8.4 gets its first support.** The section argued that distinctiveness lives in the depth of the
  inferential chain rather than the exoticism of the object. This read is that argument's evidence:
  a genuinely novel object scored 9 on concept and 6 on clues, and the reader's fix list is entirely
  about making the chain legible — *"pick one"*, *"use one weapon"*, *"make the test prove one
  specific fact"*.

### 9.8 What would falsify §9

- **9.2 is wrong if** run 2, on a different unused cell, comes back with `premise` at 8 and no comment
  about freshness. One read is one read, and the whole of §9.2 rests on a single category and a single
  sentence of a single reader.
- **9.4 is wrong if** removing the `enforceCulpritEvidencePresence` injection does not move `prose`.
  The reader quoted the injected text, so this is about as close to a settled attribution as this
  project has ever had — which is why it is worth stating as falsifiable rather than assuming it.
- **9.5 is wrong if** run 2 — also outside the temporal cell, also without the clock apparatus —
  returns a normal `clues` mark. Then the thin net is not the cause and the elevator case was simply
  under-specified.

---

## 10. Run 2 — the walk keeps walking, and the polish pass bought nothing

`The Canary's Slippers: A Seaside Hotel Identity Mystery`, `mystery-1787765404921`. Cell:
**`identity × alibi_fabrication × physical_trace`**, scheduled by DE5 from the ledger after run 1.
**£1.73, 58 calls, shadow rubric 83.** External read pending.

`identity` had never produced a story in this project. [PLAN-TO-90 §0.2](../../../architecture/PLAN-TO-90.md)
records that it was *unreachable* until [X70](../../../architecture/REVIEW_05.md) landed on 2026-08-20 —
the orchestrator silently coerced every axis it did not recognise to `temporal`. Six days later a
deterministic scheduler asked for it and got it.

### 10.1 The monoculture is measurably breaking

```
                 before    run 1     run 2
axis             H=0.00    H=0.21    H=0.38    1 -> 2 -> 3 distinct of 6
mechanismFamily  H=0.00*   H=0.34    H=0.44    1 -> 3 -> 4 distinct of 14
top family        100%      —         56%
```

\* the `0.00` is the figure the first-match-wins classifier produced; see the correction in §10.5.

Two runs is not a trend. But the direction is the one DE5 was built to produce, the mechanism is
deterministic rather than hoped-for, and the top family's share has fallen from **100% to 56%**.

**A first, worth naming.** The structural judge's nearest neighbour was, for the first time, a *seed*
rather than one of this pipeline's own runs:

```
[Novelty skeleton-judge SHADOW] distinct — nearest seed:a_study_in_scarlet
  (shares axis 'identity' + discriminating-test shape 'physical_trace')
```

The case's closest structural relative is now canonical detective fiction instead of last week's
output. That is exactly what DE3 was wired in to be able to say, and it could not have been said at
all a day earlier.

### 10.2 The Agent 6.5 fix worked

One attempt, `appears truncated: false`, no retry. The run that died here yesterday burned three
attempts and £0.58 producing nothing, because the truncation retry asked for more words (§9.6). This
is the cheapest confirmed fix of the session.

### 10.3 THE COST FINDING: four polish calls, four rollbacks, nothing kept

```
post_pass_polish   4 call(s) — changed 0, no-change 0, ROLLED BACK 4
                              (validation_regression, obligation_regression)
atmosphere_repair 10 call(s) — changed 9, no-change 1, rolled back 0
```

**Every single Opus-5 post-pass polish call on this run was discarded.** Agent9-PostPassPolish is
18–24% of a run's spend; on this run it bought literally nothing, and the run still scored 83 on the
shadow rubric without it.

This is the `repair-efficacy` instrument doing precisely the job it was built for. Its header asked
the question in advance — *"Nobody has ever measured what fraction of those calls CHANGED THE TEXT"* —
and predicted the two failure modes. This run hit the second one at 100%:

> *A pass that is mostly `rolled_back` is being reverted by a validator and needs the A_73 §32
> treatment, not a bigger budget.*

Run 1 was 4 changed / 2 rolled back, so this is not a constant. But across the two runs the polish
pass is **4 changed, 6 rolled back** — a minority of its spend survives, and the rollback reasons name
validators, not the model. Contrast `atmosphere_repair` at 9 changed of 10, which is what a working
repair pass looks like.

**This is now the strongest cost lever on the board**, and it needs no read to act on: either fix what
the validator is reverting, or gate polish on a trigger instead of running it per chapter.

### 10.4 The gate authority finding repeats, exactly

`[X4] injector-vs-lint: enforceCulpritEvidencePresence injected a sentence into chapter 10` — **twice
again**, in the same chapter, for the same reason, on a completely different case in a completely
different cell.

§9.4 established that the 08-26 reader quoted this injector's output verbatim and called it
*"generated checklist leakage. It must be deleted."* Two runs, two cells, same injector, same chapter,
same policy. It is systematic, and [B1](../../../architecture/PLAN-TO-90.md) is the lever.

The geometry codes did improve — **3 this run** (`aftermath_repeat`, `reveal_culprit_not_named`,
`unaccounted_time`) against roughly seven on run 1. `reveal_method_absent`, `method_signature_absent`
and `clincher_absent_at_payoff` — the three that mapped to the 08-26 reader's biggest complaints — did
not fire. Whether that means this manuscript is cleaner or the codes are quieter outside the temporal
cell is exactly what the external read is for.

### 10.5 Two corrections and one recurring tax

**The `mechanismFamily H=0.00` figure in §8 was wrong**, and this is the second time it needs saying.
It was an artifact of a first-match-wins classifier in which one incidental "clock" in a paragraph of
premise prose outvoted the mechanism. The load-bearing evidence for the monoculture is `axis`, which
the CML **declares** and nothing infers, plus the titles.

**The two classifiers disagree about this run.** DE1 stored `staged_scene` from the keyword scorer;
the LLM skeleton extractor said `impersonation`. For an identity/alibi case, `impersonation` is
probably the better answer. A keyword classifier is a coverage instrument, not a ground truth, and
neither of these should be quoted as if it were.

**Content filter, three refusals in two runs.** Run 1: `Agent6-BlindReader ×1`. Run 2:
`Agent9-ProseGenerator ×2`. The pipeline keeps generating content its own next call refuses, and the
affected work falls back to a deterministic backstop. On run 1 that meant the fair-play blind-reader
gate was **SKIPPED, not passed**. This is now a recurring tax with a measurable rate — roughly 1.5
refusals per run — and it is not recorded anywhere as a known operating condition.

### 10.6 Where the two runs leave DE9

- **DE7 (does the engine act?): ANSWERED, YES.** Two cells, two axes, both never used before, both
  realized by the model. No read required, exactly as §8.6's rung 2 predicted.
- **DE9 (does an unused cell read better?): ONE READ IN, ONE PENDING.** Run 1 said `premise` 9 and
  *"a nice break from clock-only mysteries"*, with the headline flat inside noise. Run 2 is unread.
- **Two runs cannot settle DE9 and were never going to.** The honest ceiling on what these two buy is
  a direction, not a measurement, and §8.6's ablation ladder said so before either of them ran.

### 10.7 What the two runs actually cost, and what they bought

```
run 1   The Elevator Cage Enigma    £1.45   40 calls   shadow 84   external 79
run 2   The Canary's Slippers       £1.73   58 calls   shadow 83   external pending
lost    identity, first attempt     £0.58   19 calls   died at Agent 6.5 (now fixed)
                                    -----
                                    £3.76
```

Bought: the axis monoculture broken and measured, `premise` 9 with the reader naming the reason, the
gate-authority finding confirmed twice, a 100%-rollback polish pass caught by an instrument built for
it, a truncation bug that had been a coin flip on every run, and a classifier bug in this section's
own machinery. **Only one of those needed a paid run at all** — which is §8.6's whole argument,
restated by the evidence rather than in advance.

---

## 11. RUN 2 READ — DE9 answered, and it is not the answer the engine was built for

`story_20260826-1753/the_canary_s_slippers…md`, the project's first `identity`-axis manuscript, cold
read on 2026-08-26. **82/100.** §10.6 left DE9 as *"one read in, one pending"*; this is the other one.

| | prem | hook | plot | char | dial | atmo | clue | pace | end | prose | sum | ext |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| identity — run 2 | **9** | 8 | 8 | 8 | 7 | 8 | 8 | 8 | 8 | **6** | 78 | **82** |

The reader's own summary of the mechanism is the part worth keeping:

> *"The right-foot / left-limp contradiction is the standout clue… it looks incriminating at first —
> Hale's slippers match — but becomes exculpatory once Eleanor thinks about gait mechanics."*
> *"Better than many of the clock variants because it is visual, fair, and character-specific."*

Forecast with three fixes: **88–90**.

### 11.1 DE9 — answered NO on the headline, YES on the category the engine actually feeds

The six most recent reads, DE-scheduled cells marked:

| story | cell | ext | premise | prose |
|---|---|---:|---:|---:|
| 08-23 2038 | temporal (unscheduled) | **85** | 9 | 7 |
| 08-25 1838 | clock family (unscheduled) | 82 | 8 | 6 |
| 08-25 2102 | clock family (unscheduled) | 80 | 8 | 7 |
| 08-26 1708 | **spatial × locked_room_timing (DE)** | 79 | 9 | 6 |
| 08-26 1753 | **identity × staged_scene (DE)** | 82 | 9 | 6 |

**The two DE cells read 79 and 82, inside — not above — the 80–85 spread of the unscheduled runs.**
The best of the six is still a temporal clock story. On n=2 that is not a claim that novel cells read
worse; it is the absence of any measurable headline gain, which is what §8.6's ablation ladder said two
runs could produce.

**`premise` is the exception, and it is the one the engine was aimed at.** 9 on both DE runs, against 8
on both unscheduled clock stories, with the reader volunteering a preference for the mechanism over the
clock variants in both cases. That is [A_72 §2.1](../ANALYSIS_72/ANALYSIS_72.md)'s finding holding: the
novelty apparatus buys `premise`, and `premise` is where this project's 9s come from.

**So the honest DE9 verdict: the engine delivers the category it was designed to deliver and does not
move the headline, because the headline is being held down somewhere else.** §10.5 and the handover's
own next-steps list both arrived at that independently — *"more novelty is not the next thing to buy"*.

### 11.2 The prose leakage, named for a third consecutive read — and a correction

The reader quotes back, verbatim, as *"generator residue"*:

> *"Eleanor Voss pressed on to the following solid point the file now held…"*
> *"That observation tilted the logic stacked against the rest…"*
> *"Hugo Vane was responsible; the evidence allowed no other reading."*

Six such lines in this manuscript, carrying raw key-term lists where noun phrases belong:

```
"…the file now held: Right footed depth footprints match captain."
"…bent the trail toward Figure impersonated captain hale wearing slippers."
"…bent the trail toward Victim struck head brass candlestick."
```

That is `buildDeterministicClueParagraphs` — the same template
[A_72 §14.2](../ANALYSIS_72/ANALYSIS_72.md#142-the-readers-prose-complaint-is-a-template-injector-and-it-is-new)
traced, now named by three consecutive readers.

**And counting it across the series corrects what A_72 claimed about it.**

```
story        injector lines   prose
08-23 1715         0            6
08-23 2038         4            7
08-25 1838         0            6
08-25 2102         0            7
08-26 1708         2            6
08-26 1753         6            6
```

**`prose` is 6 or 7 whether the injector fires or not.** Two manuscripts with zero of these lines still
scored 6; the manuscript with four scored 7. A_72 §14.2 called it *"the largest named prose defect on
the board"* and the count does not support that: it is the most VISIBLE artifact and the one a reader
reaches for first, but it is not what pins the mark.

What the six reads actually show is a **family** of leakage defects with a different member surfacing
each run — the locked-fact article and the description paraphrase in one, this injector in another,
*"prompt-artifact lines"* in a third. Remove one and the complaint changes; the mark has not.

**Consequence for planning:** an increment aimed at this injector alone should be expected to change
what the reader quotes and not the number. `prose` has never reached 9 in 41 reads and currently sits
two marks below its own ceiling of 8 — the gap is not one template.

### 11.3 What this changes

- **DE9 is closed.** Unused cells buy `premise`, not the headline. Axis coverage is a coverage metric
  and should stop being read as a quality proxy.
- **§10.7's conclusion is reinforced from a second direction.** The engine works; the execution
  machinery is what costs marks. The handover's next-steps list already ordered gate authority and the
  polish pass above further distinctiveness work, and this read supports that ordering rather than
  competing with it.
- **The injector drops from "largest prose defect" to "most-quoted symptom".** Still worth fixing —
  three readers should not have to name it — but not on the expectation that it moves `prose`.

---

## 15. B1 DECIDED — geometry does not get blocking authority

Open across six documents. Decided 2026-08-26 on the replay PLAN-TO-90 §10.2 named as its
prerequisite: *"would the 86-scoring runs have shipped under a blocking gate?"* Reproducible with
`node scripts/geometry-gate-replay.mjs`, because the answer should change as the repair passes improve.

### 15.1 The measurement

```
reports where geometry actually RAN : 21
   raised at least one finding      : 19  (90%)
   geometry-clean                   : 2

mark  manuscript                          findings a blocking gate would have stopped on
  86  The Reversed Pendulum at Seacliff   reveal_culprit_not_named
  85  The Hourglass Deception             clearance_over_budget, clincher_absent_at_payoff, reveal_culprit_not_named
  84  The Frozen Hour at Coastview        + reveal_method_absent, aftermath_repeat
  84  The Pendulum's Secret               aftermath_repeat, clearance_over_budget, clincher_absent_at_payoff
  81  The Delayed Strike at Cliffhaven    five findings
  81  The Rising Tide at Cliffhaven       three findings
```

**A blocking gate would have aborted 6 of the 6 externally-read manuscripts, including the best this
project has produced.** Ninety percent of all measured runs raise at least one finding. And the two
geometry-clean runs have never been read, so **there is no evidence at all that passing geometry
predicts a good book** — only that failing it does not predict a bad one.

> **A gate that fires on 90% of runs is not a gate. It is an off switch with extra steps.**

### 15.2 A finding I had to withdraw, and it matters more than the one I kept

The first version of this analysis reported something much more interesting: that manuscripts raising
geometry warnings scored HIGHER than clean ones (83.5 vs 74.5), which would have made the codes
actively anti-correlated with quality.

**It was an artefact.** Both "clean" runs in that comparison were from builds where geometry was not
wired — the word does not appear anywhere in their reports. Their silence meant *unmeasured*, not
*passing*. Counting a check that never ran as a check that passed is the same defect this project has
now found in `loadNoveltyLedger` (`catch { return [] }` turning "wrong directory" into "no prior runs")
and in X4's merged rollback reason. The replay script excludes unmeasured reports explicitly, and says
so in its output, so the mistake cannot be repeated silently.

### 15.3 The decision, and the reasoning

**Geometry stays a warning channel. It does not gain the authority to stop a run.** Three reasons, in
order of weight:

1. **It would abort everything.** 6 of 6 read manuscripts, 19 of 21 measured runs. There is no
   configuration of "block on the serious codes" that survives this, because the code on the 86 —
   `reveal_culprit_not_named` — is one of the serious ones.
2. **There is no evidence the clean state is the good state.** Zero read manuscripts have passed
   geometry. The proposal assumes clean ⇒ better; nothing measured supports it.
3. **It would make `prose` worse, mechanically.** `reveal_culprit_not_named` is precisely the code
   `enforceCulpritEvidencePresence` exists to satisfy. More gate pressure means more injection, and
   the injected sentence is the text three external readers have quoted back as *"generator residue"*
   ([X4](../../../architecture/FLAG-AUDIT.md)). Escalating authority pushes directly on the category
   the escalation is meant to protect.

### 15.4 What replaces it

Not "do nothing" — [A_74 §9.4](../ANALYSIS_74/ANALYSIS_74.md)'s five-of-seven mapping is real and the
gate genuinely sees what the reader complains about. The answer is the one already taken for X4:
**fix what the gate is complaining about at its source, rather than escalating the gate's authority
over it.** X4 is the worked example — the floor now writes a sentence that satisfies its obligation
AND obeys the rule, so there is nothing left to block on and nothing left to ship apologetically.

The order that follows:

| | |
|---|---|
| **Do** | make each floor's output compliant with the rules the model is held to, one at a time — X4 done, the clue-paragraph injector next |
| **Do** | keep geometry findings driving REPAIR, and rank them by what readers actually complain about |
| **Do not** | promote geometry to a hard stop, at any threshold, until a geometry-clean manuscript has been READ and scored well |
| **Revisit when** | `geometry-gate-replay.mjs` shows the abort rate falling below ~20% AND at least one clean run has an external read |

**The revisit condition is the point of shipping this as a script.** The decision is not "geometry is
warning-only forever" — it is "geometry is warning-only while nine in ten runs would abort", and that
number is now one command away.

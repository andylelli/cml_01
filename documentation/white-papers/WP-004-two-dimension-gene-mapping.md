# WP-004 — TWO-DIMENSION GENE MAPPING

**What it is, why it is the right method for this system, how it works, how it integrates, what it
buys — and a build plan a coding agent can follow without this conversation.**
2026-09-18 · every figure MEASURED from the live `dist` build, `library/index/cells.json`,
`packages/novelty/data/seed-fingerprints.yaml`, `data/novelty-ledger.json` and the source files named
in §8 · prior art in A_77 §7, A_78 §7–8, A_79 §4/§11/§14, WP-003 (superseded on method by this paper;
its correction record §9 still stands)

---

## ABSTRACT

A detective story has three layers. The prose is the author's and untouchable. The plot is specific
to one book and useless to us. Between them is the **shape of the deception** — *a natural agent
dressed as a supernatural one, so the reader disqualifies the material explanation before examining
it* — and that shape is genre grammar, not property. Chesterton, Doyle and Carr all used it and wrote
unrecognisable books.

**Gene mapping stores shapes, not books.** Each public-domain work we hold is encoded once, against
its own text, into a verified structural case and reduced to a five-field **gene**. Two of those
fields are closed vocabularies — `axis` (5 values) and `mechanism_family` (16) — and together they
address an **80-cell map**. Every gene lands in exactly one cell. Occupied cells are what the genre has
done; empty ones are what it has not; and a third overlay — our own shipped runs — says which of the
occupied cells *we* have never attempted.

**The claim.**

> **The generator should be given an obligation, not a prohibition: "go here."** A prohibition
> ("diverge from these seven sundials") has an infinite satisfying set, and this model satisfies it by
> moving the minimum distance — it writes a bell tower. An obligation names a cell. The cell is chosen
> by a rule (§4.4): reachable from an attested shape by changing exactly one dimension, anchored on
> both values, never one we have shipped, and as far from the corpus's centre of mass as the map
> allows. What crosses into the prompt is a two-word address and a worked structural example tagged
> *"STRUCTURES, not material."* No sentence of any book crosses, and the anti-copy gate — on, a hard
> fail, 0.0% measured false positives at n=11 — is the guarantee at the output.
>
> **It is correct for this system for four measured reasons.** Premise is already the strongest
> category (8.05, thirteen 9s), and Agent 3b — the corpus consumer — is where A_72 traced those 9s;
> the method feeds what works. Every prior canon→generator channel was negative (A_78 §7), and the
> project's own scheduler header says why that fails. The model complies with countable operations
> and ignores rates (A_75), and "land in cell X" is an operation. And the corpus is now large enough
> to make the map meaningful — **25 of an estimated ~65 reachable cells** — which it was not at 12
> works, when A_77 wrote the idea down and could not run it.

**What it is not.** It is not a prose lever. A morph reaches Agent 3 and stops; prose (5.92) and
dialogue (6.59) are downstream of it and untouched (§6.3). A_99's rebuild of the prose stage is a
separate program and this method does not compete with it — A_99 §7 carves the corpus stream out
explicitly.

**Stated so it can be wrong.** One run, no reader: give Agent 3 a morph obligation into
`authority · secret_will_inheritance` — tier *canon-not-us*, one family-swap from *The Strange Schemes
of Randolph Mason* — and extract the fingerprint from the CML it writes. It must land in that cell and
Agent 8 must judge it `distinct` against all 46 seeds. If it lands in `identity × impersonation`, the
corpus's centre of mass, the obligation is ignored and the lever is dead.

**The build (§8), for a coding agent.** Six steps, ordered by what each one settles. Step 1 is a
twenty-line correctness fix without which none of the others can reach a prompt: today Agent 3
receives the **alphabetically first three** exemplars on its axis, so sixteen of nineteen identity
cases have never been seen by any run.

---

## 1. WHAT IT IS

### 1.1 The gene

One encoded work produces one gene: `library/works/<slug>/fingerprint.yaml`, five fields, validated
against `schema/novelty_fingerprint.schema.yaml`. *Silver Blaze*, as encoded:

```yaml
axis:                      identity
mechanism_family:          disguised_natural_agent
false_assumption_pattern:  human_action_caused_the_death
discriminating_test_shape: reconstruction
inference_shape:           reconstruct_true_cause_of_death
```

Two of the five are **closed vocabularies** and therefore addressable:

| field | values | expressible to the generator? |
|---|---|---|
| `axis` | temporal · spatial · identity · behavioral · authority | **yes** — `primaryAxis` is already a run parameter (`CML_PRIMARY_AXES`) |
| `mechanism_family` | 16, from the schema | **yes** — the vocabulary the device library and novelty judge already share |
| `discriminating_test_shape` | 6 | **no** — see §1.3 |
| `false_assumption_pattern` | free text | no — it is what the model writes |
| `inference_shape` | free text | no — likewise |

### 1.2 The map

`axis × mechanism_family` = **5 × 16 = 80 cells**. Every gene lands in exactly one. The map is a
*view over the genes* — it is regenerated from them in under a second by `scripts/corpus-cells.mjs`
into `library/index/cells.json`, and CI fails if the committed file is stale. It holds no information
the genes do not.

MEASURED, 44 genes on the five usable axes:

| | cells |
|---|---|
| occupied | **25 of 80** |
| estimated reachable by the genre (Chao1) | **65.5**, 95% CI [37, 166] |
| occupied, as a share of reachable | **38%** |

The interval is wide because the estimator rests on **f2 = 4** doubletons; its upper bound exceeds the
80-cell space, which is the estimator saying it is straining. The *ordering* of every decision in this
paper survives the whole interval; the second decimal place does not.

### 1.3 Why two dimensions and not three

WP-003 as first written used a third dimension and reported the map as 7% occupied and unreachable.
That was an artefact, and the correction is the reason this paper exists on its own.

`discriminating_test_shape` is not an independent property of a case. It is a four-entry lookup from
the CML's own `discriminating_test.method` at `scripts/corpus-derive.mjs:57`, and `corpus-classify.mjs`
never writes it. MEASURED across all 56 encoded works, the correspondence is exact:

| CML method (4 values) | fingerprint shape (6 values) | works |
|---|---|---|
| `reenactment` | `reconstruction` | 24 |
| `constraint_proof` | `timetable_contradiction` | 21 |
| `trap` | `behavioral_tell` | 11 |
| `administrative_pressure` | `behavioral_tell` | — |

Three of the six shapes — `physical_trace`, `identity_disambiguation`, `chemical_timing` — **cannot be
emitted at all**, and the two vocabularies **share no value**, so an obligation naming one has no word
Agent 3 could write to comply. A dimension the generator has no word for is not a dimension.

> **Rule.** A dimension is a dimension only if it varies independently of the others *and* the
> generator has a vocabulary for it. Check both before counting cells in it.

### 1.4 The three tiers

The map has a second side: our own history, from `data/novelty-ledger.json` (121 shipped runs, of which
**24** record a mechanism family — the other 97 are backfillable, §8 step 3).

| tier | cells | meaning | use |
|---|---|---|---|
| both | 3 | the genre and we have both been here | avoid |
| **canon-not-us** | **22** | *a form the genre uses and we have never attempted* | **the most valuable list we own** |
| us-only | 6 | our habits | avoid — repetition-avoidance is the first duty |
| neither | 49 | unwritten, or unwritten for a reason | novel, unproven |

The 22 is a **floor**: computed against a quarter of our history, some of those cells are ones we have
visited. Backfilling the ledger turns it into a fact.

### 1.5 The morph

The operation that turns the map into an idea:

> Take an attested cell. Change exactly one of its two dimensions. Require the destination to be
> anchored (both values attested somewhere), in tier *neither* or *canon-not-us*, and as far from the
> corpus's centre of mass as possible. Hand the generator the source's worked example and the
> destination's address.

MEASURED: **57 anchored candidates**. The strongest single one, because the genre has already proved
the form carries a novel:

> **`authority · secret_will_inheritance`** — one family-swap from *The Strange Schemes of Randolph
> Mason*; occupied in the canon by *The Leavenworth Case*; never attempted by us.

---

## 2. WHY IT IS CORRECT FOR THIS SYSTEM

Not an argument from first principles — every point below is a measurement this project already made.

### 2.1 It feeds the category that works

| category | mean over 61 reads | ever a 9? |
|---|---|---|
| **Premise / concept** | **8.05** | **13 times** |
| Prose / polish | 5.92 | never |
| Dialogue | 6.59 | never |

A_72 traced the premise 9s to Agent 3b, and Agent 3b's raw material is the corpus device library
(§3). Gene mapping strengthens the input to the pipeline's best stage. It is also the cheapest
category to make *consistent*: A_99's target is every category ≥ 8 with three or four at 9, and
premise is the obvious third 9 beside the two prose and dialogue must supply.

### 2.2 Prohibitions have been measured to fail here

A_78 §7: as of August, **every** channel from the canon to the generator was negative — "diverge from
these titles", "avoid these patterns" — and the one positive block printed `Mechanism type: unknown /
0 constraints / 0 steps` for every book. The cell scheduler's own header states the mechanism of
failure: *"'Avoid X' has an INFINITE satisfying set, and a model asked to satisfy it moves the minimum
distance required… The repair is not a better prohibition. It is to replace the prohibition with an
OBLIGATION."* An address is an obligation.

### 2.3 The model obeys operations and ignores statistics

A_75, pinned in memory as `prompts-move-operations-not-statistics`: asked for 19.5-word sentences the
model produced 15.01; asked to *add semicolons* it went from 5 to 13. VoiceSpec asked for a rate in
every prompt and was ignored in 10 of 10 chapters. "Your case turns on a `secret_will_inheritance`
mechanism on the `authority` axis" is a countable operation with a checkable result — the extractor
reads the produced CML and says whether it landed.

### 2.4 Shapes cannot be copied, and the gate proves nothing leaks

Three independent guarantees, any one of which would suffice:

- **What crosses is an address and a structural summary in our words.** The exemplar block (§3.1)
  carries the reader's wrong belief, the mechanism's logic, how the gap closed and how the truth was
  forced — no name, no place, no sentence of the book — under the instruction *"do not reuse a
  mechanism, a setting or a phrase from any of them."*
- **The destination differs from the source by construction.** A morph target is a cell the source
  does not occupy.
- **The anti-copy gate** (`packages/prose-guard/src/anti-copy.ts`) indexes all 12.3M words of held
  text and aborts a run on any eleven-word verbatim run. MEASURED: 0.0% false positives over 229
  known-negative manuscripts; a 40-word synthetic lift caught at full length.

### 2.5 The corpus is now big enough to make the map mean something

A_77 wrote this method down at 14 works, of which 3 were usable, and could not run it. It is now 169
works, 60 encoded, 46 genes, 25 cells. That is the difference between a design note and a measured
map — and §6.1 shows the 109 works already on disk take it to ~52 cells for £12.

---

## 3. HOW IT WORKS — THE PIPELINE, STAGE BY STAGE

Every stage is a script in `scripts/`, deterministic unless marked, with its cost.

| stage | script | in → out | cost |
|---|---|---|---|
| SURVEY | `corpus-survey.mjs` | Gutenberg catalogue CSV + Open Library → `library/candidates.json` (clearance-verdicted) | £0 |
| ACQUIRE | `corpus-acquire.mjs` | candidates → `library/texts/<slug>.txt` + `provenance.yaml` | £0 |
| CLEAR | `corpus-clearance-check.mjs` | recomputes every verdict from the two years; text-holding works must be GREEN | £0, CI |
| ENCODE | `corpus-encode.mjs` / `-all.mjs` | whole text in one context → `case.cml2.yaml` via a flat JSON contract, `validateCml` as accept gate | **£0.1104 per usable case**; 83.9% accept |
| VERIFY | `corpus-verify.mjs` | every claim's anchor located by `String.includes` against the source → `encode-report.json` | £0 |
| DERIVE | `corpus-derive.mjs` | case → `fingerprint.yaml` + `device.draft.yaml`; **skips works that already have one** | £0 |
| CLASSIFY | `corpus-classify.mjs` | LLM judgement of `mechanism_family`, `false_assumption_pattern`, `inference_shape`, written back into the fingerprint | ~£0.003 per work |
| SYNC | `corpus-sync-fingerprints.mjs` | fingerprints → `packages/novelty/data/seed-fingerprints.yaml`, with the evidence gate (≥60% anchor coverage) and `.verification.json` | £0, `--check` |
| MAP | `corpus-cells.mjs` | ledger + runs → `library/index/cells.json`: tiers, Chao1, morph candidates | £0, `--check` |
| MANIFEST | `corpus-manifest.mjs` | provenance → `library/manifest.json` | £0, `--check` |

`npm run corpus:check` runs CLEAR, MANIFEST `--check` and MAP `--check` together.

Four things about this pipeline that a reader of the scripts would not guess:

1. **The encoder reads the whole book in one context, never chunked.** A clue in chapter 2 is only a
   clue given chapter 18 (A_77 §10.3). MEASURED: a Golden Age novel is 85k–125k tokens.
2. **VERIFY is a string match, not an LLM.** `includes()` cannot be persuaded; a model verifier can
   hallucinate agreement (A_77 §10.4). A work under 60% anchor coverage is **demoted** — kept on disk,
   excluded from the ledger. MEASURED: 30% of encodes are demoted.
3. **DERIVE must not run after CLASSIFY on the same work.** They write the same file; a bare derive
   replaced 12 of 12 LLM judgements with regex guesses before the skip was added (A_97 §9.1).
4. **Anything that restates a fact is generated from it and checked in CI.** The ledger, the map and
   the manifest all have `--check`. This project has paid three times for a second copy with no
   derivation direction (A_77 §4.3, A_97 §9.1, A_98).

### 3.1 What the generator receives today

| channel | reads | state | what the model sees |
|---|---|---|---|
| Agent 3 exemplars | `case.cml2.yaml` / `case.legacy.yaml` | **live**, unconditional | 3 worked cases on the run's axis, ~4.5k chars |
| Agent 3b device library | `device.draft.yaml` | **live** (`DEVICE_LIBRARY_INCLUDE_CORPUS=true`) | 50 patterns; 2 of the top 4 on every axis are corpus-derived |
| Agent 8 novelty judge | `seed-fingerprints.yaml` | **live**, 46 genes | a similarity verdict |
| Agent 9 anti-copy gate | `library/texts/*.txt` | **live, hard fail** | nothing; it reads the output |
| Cell scheduler | genes + run ledger | **shadow** | a logged cell; no input changed |

### 3.2 The ranking mathematics

**Remoteness.** For a candidate cell `(a, f)`, `score = freq(a) + freq(f)` over the 44 genes; lower is
more remote. MEASURED: ranking by *number of attested neighbours* instead returned ten `identity · …`
cells — the centre of mass, the least original place to land. Remoteness is the correction.

**Anchoring.** Both `a` and `f` must have at least one gene somewhere. MEASURED: without it, the four
most remote candidates were `role_invisibility` and `investigative_blind_spot` cells — families with
zero attestation, where the move is invention rather than a morph and loses genre-fluency.

**Richness.** Chao1 (bias-corrected when `f2 = 0`), analytic log-normal interval (Chao 1987), Chao et
al. (2014) extrapolation for "encodes to reach X% of reachable". A naive bootstrap of Chao1 is wrong —
resampling with replacement destroys the singleton structure — and was discarded before it reached a
table. All in `scripts/corpus-cells.mjs`.

---

## 4. HOW IT INTEGRATES

### 4.1 What already exists, and what it is missing

`apps/worker/src/jobs/cell-scheduler.ts` is most of the machinery, built by A_74 and A_79:

- `scheduleCell(records, windowN, corpus)` returns a `ScheduledCell` with `corpusOccupancy` already
  in the four tiers plus `unknown` (corpus not consulted — deliberately distinct from `neither`).
- `loadCorpusCells()` reads genes through `@cml/novelty` behind `NOVELTY_CELL_SCHEDULER_CORPUS`.
- `cellDirective(cell)` renders the obligation text.
- `scripts/schedule-run.mjs` applies it **at the input layer**: it rewrites a base config's `theme:`
  to carry the directive and `primaryAxis:` to the cell's axis, so the run that names the cell is the
  run whose config a human can read.
- `assignedFamilyFromTheme` in `agent3b-run.ts` reads the family back out of the theme by regex.
- The orchestrator calls `logScheduledCell(scheduleCell(...), mode)` at `mystery-orchestrator.ts:1123`
  in `shadow`, changing nothing.

It is missing four things, in decreasing order of importance:

1. **Agent 3 cannot use its pool.** `selectRelevantPatterns` (`seed-loader.ts:227`) is
   `filter(axis).slice(0, 3)`. MEASURED: identity has 19 encoded cases and Agent 3 has only ever seen
   *Dark Power*, *In the Onyx Lobby* and *Room 13* — alphabetical order. The best-verified encode in
   the library (*The Memoirs of Sherlock Holmes*, 19/19 anchors) has never reached a prompt. This is
   the third instance of one defect: A_79 §14.3 found and fixed it in the device library and in
   `buildNoveltyConstraints`. **A constant order in front of a fixed cut is a silent allowlist.**
2. **The scheduler's `Cell` is three-dimensional** and `cellDirective` emits a `testShape` clause the
   generator cannot honour (§1.3).
3. **No morph.** The scheduler picks the stalest feasible cell; it does not pick a *source* and hand
   Agent 3 its worked example beside the obligation.
4. **The negative control has not been run.** The scheduler's own header names it: *"if a scheduled
   `epistemic × poison_delayed` case scores the same as the clock cases, that is the most useful result
   available."* A_79 §4 asked for it before promotion past `shadow`.

### 4.2 Where the obligation travels

Two paths exist; the plan uses the one that is already wired.

**The theme path (existing).** `schedule-run.mjs` writes the directive into `theme:` and sets
`primaryAxis:`. The orchestrator passes the theme to every agent; `agent3b-run.ts` regexes the family
back out. This works today for the scheduler's own picks and needs only the `testShape` clause removed.

**The typed path (to add).** `CMLPromptInputs.noveltyConstraints` (`packages/prompts-llm/src/types.ts:65`)
is `{ divergeFrom, areas, avoidancePatterns }` — three prohibitions and no obligation. Adding an
optional `obligation?: { axis, mechanismFamily, sourceSlug, tier }` lets Agent 3's prompt builder
render the obligation *and* select the source's worked example deliberately, rather than parsing a
theme string. This is what makes the morph a morph rather than a bare assignment.

### 4.3 The trap in the cache

`agent3-cml.ts:351` memoises the seed block by `${examplesDir}::${inputs.primaryAxis}`. A selection
that depends on anything else — the obligation, the run's prior-run window, a ranking by coverage —
**must include that in the key or bypass the memo**, or every run on an axis will be served the first
run's picks. This is the same shape as the allowlist defect, one layer up.

### 4.4 The rule for choosing a cell, stated once

```
SOURCE   an attested cell (a, f) in the canon
CHANGE   exactly one of {axis, family}                -> target (a', f) or (a, f')
ANCHOR   freq(a') > 0 and freq(f') > 0               (both values attested somewhere)
TIER     target ∉ {us-only, both}                    (never repetition)
RANK     minimise freq(a') + freq(f')                (furthest from the centre of mass)
HAND     source's worked example + "same <unchanged>; <changed> is now <v>" + "STRUCTURES, not material"
CHECK    extract the fingerprint from the produced CML; it must land in the target
GUARD    the anti-copy gate, unchanged, at the output
```

---

## 5. WHAT THE BENEFIT IS

### 5.1 Measured, today

- Premise at **8.05 with thirteen 9s**, and the corpus device library is the traced source of them.
- Three corpus channels live and unconditional; the device library went **11 → 50 patterns** with
  **2 of the top 4 on every axis** corpus-derived, after the allowlist fix made loading into reaching.
- **Inspiration went 14 → 60 entries** once the UI and the generator read the same directory (A_98).
- The map exists: **22 forms the genre uses that we have never attempted**, named, with the work that
  proves each one carries a novel.

### 5.2 Predicted, with the falsifier attached

| prediction | falsified by |
|---|---|
| Fixing selection changes what Agent 3 sees on every axis with > 3 cases | the prompt log shows the same three titles |
| A morph obligation lands the produced CML in its target cell | the extractor reads `identity × impersonation` |
| Agent 8 judges the morph output `distinct` against all 46 seeds | verdict `clone` or `variation` |
| Encoding the 109 held works reaches ~52 of ~65 cells | `corpus-cells.mjs` reports < 45 after the batch |
| A better-selected exemplar block moves the *premise* mark, not the prose mark | a matched pair (`RESUME_REDO=prose` on the same upstream) moves prose |

### 5.3 What it does not buy, stated plainly

Nothing downstream of Agent 3. Prose (5.92) and dialogue (6.59) are capped by defect classes in the
prose stage — 15 of 15 reviews name scaffold lines, and A_84 traced every one to our own templates.
A_99's Prose Engine v2 is the program for that, it is serial and it is separate; this paper's plan is
built so as not to confound it (§8, steps 1 and 5).

---

## 6. IS THE CORPUS BIG ENOUGH — AND WHAT "FULL" COSTS

### 6.1 The canon side

| encodes added | cells (projected) | total cost | **£ per new cell** |
|---|---|---|---|
| +25 | 34 | £2.76 | £0.31 |
| **+109 — everything already on disk** | **52** | **£12.03** | **£0.59** |
| +178 | 58.7 | £19.65 | £1.12 |
| +458 — the entire remaining pool | 65.1 | £50.56 | **£14.98** |

The 109 are acquired, cleared, gated and queued — `corpus-encode-all.mjs` derives its queue from disk,
so it is one command. Beyond them the tail needs 349 more books, **+147 MB of text in git**, 12.3M →
38M words, and another forced anti-copy re-baseline (`DEFAULT_N` moved 10 → 11 at 17× growth, on a gate
that hard-fails live runs). **The last 13 cells cost more than the first 27.**

The yield is smaller than the attempt count: 109 attempts → ~91 cases at 83.9% → ~64 genes past the
30% demotion. Still £0.59 a cell.

### 6.2 Our side

**£0.29.** 97 of 121 runs lack a family and carry `axis`, `crimeSubtype`, `discrimMethod`,
`discrimDesign`, `falseAssumption`, `premise` — enough for `corpus-classify.mjs`'s prompt. The cheapest
item in this paper by an order of magnitude, and the one that makes the 22 a fact.

### 6.3 The space itself

Three families have zero attestation in 44 genes: `information_leak`, `role_invisibility`,
`investigative_blind_spot`. If the genre does not use them the space is 5 × 13 = 65 — and Chao1,
from a different input, says 65.5. Suggestive rather than confirmatory (they are not independent
enough to cross-validate, and the truth is probably lower still). Decidable by encoding, not argument.

### 6.4 The honest limit of "rich"

The gene has two addressable fields. At 44 genes, **25 are already indistinguishable at axis ×
family** and one pair is identical on all five. At 150 genes the novelty judge's `nearest` is a tie
most of the time. **A richer map on a two-field address gets blurrier, not sharper.** More genes need
a finer gene alongside them — reconciling the 4-value CML test enum with the 6-value fingerprint enum
(§1.3) is the obvious third field, and it is a schema decision, not a batch size.

---

## 7. WHAT NOT TO DO — WITH THE RECEIPT

- **Do not rank by neighbour count.** It returns the centre of mass. §3.2.
- **Do not morph into an unattested family.** Invention, not recombination. §3.2.
- **Do not add a dimension the generator has no word for.** §1.3 — the first WP-003 counted 480
  cells and 240 were unspeakable.
- **Do not let a constant order sit in front of a fixed cut.** Three instances now: device library,
  `buildNoveltyConstraints`, `selectRelevantPatterns`. §4.1.
- **Do not key a memo on less than the selection depends on.** §4.3.
- **Do not run DERIVE after CLASSIFY on the same work without `--force` and a reason.** §3.
- **Do not count "loaded" as "reached."** A_79 §14.3 — verify by the agent's label in
  `logs/llm-prompts-full.jsonl`, never by counting what the loader returned.
- **Do not promote the scheduler past `shadow` before the negative control.** §4.1(4).
- **Do not buy shortest-first for coverage.** Two batches, 55 encodes, `authority` 0 → 2.
- **Do not let a retired work keep voting.** `the_leak` supplied a whole cell for a day (WP-003 §9.2).
- **Do not expect any of this to move prose.** §5.3.

---

## 8. THE PLAN — FOR A CODING AGENT

Assumptions: the working directory is `C:\CML`; `npm run build:all` has been run so `dist` exists;
`.env.local` is present. Commit per step, with the measurement in the message. Nothing here needs a
reader. Steps 1–2 and 3 are independent; 4 depends on 1 and 2; 5 depends on 4; 6 depends on 5.

Conventions that apply to every step (from `CLAUDE.md` and `architecture/FLAG-AUDIT.md`): every new
flag is **default OFF**, read from `process.env` **at call time** (never a module-level const — it
freezes before dotenv, ADR-0004), and registered as a row in `architecture/FLAG-AUDIT.md` (columns:
flag | source | what it does | how to verify | verdict). Run `npm run flags:check` and `npm run
flags:runtime` after adding one. Label every number in a commit message MEASURED / INFERRED / ASSUMED.

### Step 1 — Rank the exemplar selection (£0, ~40 lines + tests)

**Why first.** Nothing downstream can reach a prompt until this is fixed.

**Files.** `packages/prompts-llm/src/utils/seed-loader.ts` (`selectRelevantPatterns`, line 227);
`packages/prompts-llm/src/agent3-cml.ts` (call at 357, memo key at 351); new test
`packages/prompts-llm/src/__tests__/seed-selection-ranked.test.ts`.

**Do.**

1. Add a flag `SEED_SELECTION_RANKED` (default off). Off ⇒ byte-identical to today's `slice(0,3)`, so
   the flag-off path is provably a no-op — write that as the first test.
2. On: build a per-pattern score from three inputs that already exist, then take the top 3 by score
   with `id` as the *final* tiebreak (never the first):
   - **anchor coverage** — read `library/works/<id>/encode-report.json`, coverage = `spans.filter(s
     => s.ok).length / spans.length` (field `ok`; MEASURED: *Memoirs* 19/19, *Red Thumb Mark* 10/18);
     absent report ⇒ 0. `pattern.id` is the work's slug (`seed-loader.ts:203`).
   - **verification state** — `library/works/.verification.json` → `works[id]`: `derived` > 
     `derived_unverified`; `failed` is already excluded by `loadLibraryWorks`.
   - **cell remoteness** — when an obligation is present (step 4), prefer patterns whose gene shares
     the *unchanged* dimension with the target; otherwise a neutral 0.
3. Expose a `seedSelectionKey(inputs)` helper and change the memo key at `agent3-cml.ts:351` to
   include it (`${examplesDir}::${primaryAxis}::${selectionKey}`), so a ranked pick that depends on
   an obligation is not served from the first run's cache (§4.3).
4. Keep `formatPatternsForPrompt` unchanged.

**Tests (pin, do not describe).** (a) flag off ⇒ same three ids as `slice(0,3)` on a synthetic pool;
(b) flag on ⇒ a pattern with 19/19 coverage outranks one with 3/20 regardless of alphabetical order;
(c) with a `failed` state the pattern is absent even if highest-coverage; (d) two patterns with equal
score resolve by `id` deterministically; (e) the memo key differs when the obligation differs.

**Verify.** `cd packages/prompts-llm && npm test`; then `SEED_SELECTION_RANKED=true node` a probe that
calls `selectRelevantPatterns` for `identity` and prints the three titles — they must no longer be
*Dark Power / In the Onyx Lobby / Room 13*. Record before/after per axis in the commit message.

### Step 2 — Make the scheduler two-dimensional (£0)

**Files.** `apps/worker/src/jobs/cell-scheduler.ts` (`Cell`, `ScheduledCell`, `cellDirective`, lines
171–196 and 377); `apps/worker/src/__tests__/distinctiveness-engine.test.ts` (describe *"DE5 — the cell
scheduler"*, 28 its); `scripts/schedule-run.mjs` (prints and writes `testShape`).

**Do.**

1. Make `testShape` optional on `Cell` and stop scoring on it. The "≥ 2 coordinates differ from the
   previous run" rule (FLAG-AUDIT row for `NOVELTY_CELL_SCHEDULER`) becomes "both coordinates differ";
   record the change in that row.
2. Remove the `discriminating test MUST take the form of…` clause from `cellDirective`. Keep the
   marker text `MECHANISM ASSIGNMENT (this run, non-negotiable)` byte-identical — `assignedFamilyFromTheme`
   in `agent3b-run.ts` regexes it.
3. Update `schedule-run.mjs`'s header comment and console line to two coordinates.

**Tests.** Existing DE5 tests must pass with `testShape` absent; add one asserting `cellDirective`
output contains no `discriminating test` clause; add one asserting the `MECHANISM ASSIGNMENT` marker
is unchanged (so the 3b regex cannot silently break).

**Verify.** `cd apps/worker && npm test`; `node scripts/schedule-run.mjs --dry` prints a 2-D cell and
writes nothing.

### Step 3 — Backfill the run ledger (~£0.29)

**Files.** New `scripts/ledger-classify.mjs`, modelled on `scripts/corpus-classify.mjs` (same model,
same `FAMILIES` list from the schema, same JSON contract); writes `mechanismFamily` onto records in
`data/novelty-ledger.json` under `shipped[]` that lack it. Budget guard as in `corpus-encode.mjs`.

**Do.** For each of the 97 records without a family, send `axis`, `crimeSubtype`, `discrimMethod`,
`discrimDesign`, `falseAssumption`, `premise`; accept only a value in `FAMILIES`; write back with
`mechanismFamilySource: "ledger-classify.mjs <date>"` so a backfilled value is distinguishable from
one the run recorded. `--dry` prints without writing. Then `node scripts/corpus-cells.mjs` and commit
the regenerated `library/index/cells.json`.

**Verify.** MEASURE and record: runs with family 24 → N; tiers before/after — expect *canon-not-us* to
**fall** (some of the 22 become *both*) and *us-only* to rise. If *canon-not-us* rises, the classifier
is inventing families; stop and inspect.

### Step 4 — Add the morph (£0, depends on 1 and 2)

**Files.** `apps/worker/src/jobs/cell-scheduler.ts` (new `morphCandidates(canon, ours)` and
`scheduleMorph(...)`, or import the ranking from a shared module used by `scripts/corpus-cells.mjs` —
do not maintain two copies of the remoteness/anchoring logic); `packages/prompts-llm/src/types.ts:65`
(`noveltyConstraints.obligation?`); `packages/prompts-llm/src/agent3-cml.ts` (render it beside the
prohibitions at line 370); `apps/worker/src/jobs/agents/shared.ts:1078` (`buildNoveltyConstraints`
accepts an optional obligation and passes it through).

**Do.**

1. `scheduleMorph(records, corpus)` implements §4.4 exactly and returns
   `{ target: {axis, family}, tier, source: {slug, axis, family}, changed: "axis"|"family", remoteness }`.
   Reuse `ScheduledCell.corpusOccupancy` for the tier.
2. Add flag `NOVELTY_CELL_MORPH` (default off). When on and `NOVELTY_CELL_SCHEDULER=on`, the
   orchestrator passes the obligation into `buildNoveltyConstraints`, which sets
   `noveltyConstraints.obligation`. The theme path (step 2) keeps working for `schedule-run.mjs`.
3. In `agent3-cml.ts`, render under the existing `**Novelty Constraints**` block:
   `**Obligation (this run):** the case must turn on a <family> mechanism on the <axis> axis. Keep the
   <unchanged dimension> of the worked example "<source title>" above; <changed dimension> is now
   <value>.` Pass `obligation` into `seedSelectionKey` (step 1) so the source's own worked example is
   guaranteed a slot.
4. Add `--morph` to `scripts/schedule-run.mjs` that writes the same config with the obligation in the
   theme, for the input-layer path.

**Tests.** In `distinctiveness-engine.test.ts`: (a) with a synthetic canon where one family is
attested nowhere, no morph targets it; (b) the returned target is never tier `us-only`/`both`; (c)
remoteness ordering matches `corpus-cells.mjs` on the same synthetic input (pin against drift between
the two); (d) with an empty corpus, `scheduleMorph` returns `null` and the scheduler's existing pick is
unchanged (flag-off no-op).

**Verify.** `npm run build:all`; both suites green; `npm run flags:check` clean with the new rows.

### Step 5 — The falsifier run (~£1.15, depends on 4)

**Do.** With `NOVELTY_CELL_SCHEDULER=on`, `NOVELTY_CELL_SCHEDULER_CORPUS=true`,
`NOVELTY_CELL_MORPH=true`, `SEED_SELECTION_RANKED=true`, generate one config via
`node scripts/schedule-run.mjs --morph` targeting `authority · secret_will_inheritance` (tier
*canon-not-us*, source *The Strange Schemes of Randolph Mason*), and run it. **State the parameters
in the report before launching**, per `CLAUDE.md`.

**Read three things and nothing else.** (1) `logs/llm-prompts-full.jsonl`: the Agent 3 prompt must
contain the obligation text and the source's worked example — if not, stop; the lever never reached
the model. (2) The produced `case.cml2.yaml` through the fingerprint extractor: `axis` and
`mechanism_family` must equal the target. (3) Agent 8's verdict must be `distinct`. Record all three
in `documentation/analysis/` as the next ANALYSIS number, with the prediction from the abstract
marked met or failed. Do not read the book; do not spend a reader (A_96, `rubric-cannot-rank-two-books`).

### Step 6 — Encode the 109 held works (~£12, independent of 4–5; do after 1)

**Do.** `node scripts/corpus-encode-all.mjs --budget=<ledger + 12.03>` — the budget is
**cumulative** over `library/.encode-ledger.json`; read `totalGbp` first. Order the queue by A_77
§15.1's *Fills* intent where one exists (Post, Freeman, Van Dine → `authority` / `temporal`) before
shortest-first; the batch runner sorts shortest-first by default, so pass `--only=` with the intent
list for the first tranche. Then, **in this order and never the reverse**: `corpus-verify.mjs --write`
→ `corpus-derive.mjs` (new works only; it skips existing) → `corpus-classify.mjs <new slugs>` →
`corpus-sync-fingerprints.mjs` → `corpus-cells.mjs` → `corpus-manifest.mjs` → `npm run corpus:check`.

**Verify.** Record: attempts, valid, demoted, cost, £/usable; cells before/after; Chao1 and its
interval before/after (f2 should rise and the interval narrow). Commit the regenerated derived
artifacts with the numbers in the message.

### What each step settles

| step | settles |
|---|---|
| 1 | whether the pool can reach the prompt at all — before this, more encodes are invisible |
| 2 | that the scheduler asks only for things the generator can produce |
| 3 | whether the 22 canon-not-us cells are real |
| 4 | that an obligation with a source can be built and rendered |
| 5 | **whether Agent 3 obeys a cell obligation — the whole method in one run** |
| 6 | whether the map reaches ~52 cells, and whether `authority` is thin in the genre or in us |

If step 5 fails — the CML lands in `identity × impersonation` regardless — the method's premise is
falsified for this model, and the right next move is A_99 M7 on the v2 engine rather than more corpus.

---

## 9. REPRODUCTION AND GLOSSARY

**Regenerate every number in this paper:** `npm run corpus:cells` (map, tiers, Chao1, candidates),
`npm run corpus:manifest`, `npm run corpus:coverage`. Channel measurements: `loadSeedCMLFiles` +
`extractStructuralPatterns` + `selectRelevantPatterns` per axis; `loadPatterns` + `retrievePatterns({
decade: 1920, primaryAxis })` with `DEVICE_LIBRARY_INCLUDE_CORPUS=true`; `loadSeedFingerprints()`.

| term | meaning |
|---|---|
| **gene** | one work's `fingerprint.yaml`: five fields, two of them addressable |
| **cell** | one `(axis, mechanism_family)` pair; 80 exist |
| **map** | `library/index/cells.json` — every cell with its tier and occupants; derived, checked |
| **tier** | who occupies a cell: both · canon-not-us · us-only · neither (· unknown, when the corpus was not consulted) |
| **morph** | an attested cell with one dimension changed, landing in an anchored, non-repeating target |
| **anchored** | both of the target's values are attested by at least one gene |
| **remoteness** | `freq(axis) + freq(family)`; lower is further from the corpus's centre of mass |
| **obligation** | "go here", handed to Agent 3 with the source's worked example; the opposite of a prohibition |
| **evidence gate** | ≥ 60% of a work's own anchors located verbatim in its own text; below it the work is demoted from the ledger |
| **Chao1** | non-parametric estimate of how many cells the genre occupies, from singletons and doubletons |

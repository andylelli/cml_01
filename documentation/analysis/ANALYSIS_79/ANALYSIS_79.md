# ANALYSIS_79 — Integrating the novel wiki: the full plan

**Date:** 2026-08-31 · **Scope:** connecting `library/works/` to story generation. · **Type:** plan.

> **The position.** Twelve public-domain works are encoded, verified and validator-clean — case,
> fingerprint and device pattern each. **Not one of them reaches any prompt.** A repo-wide grep for
> `library/works` outside the ingestion scripts returns zero hits.
>
> That is the same defect [ANALYSIS_78](../ANALYSIS_78/ANALYSIS_78.md) diagnosed in the *old* corpus,
> rebuilt one directory over. A corpus nobody reads is decoration however good it is, and this one is
> good: MEASURED, installing just the device patterns takes the raw material the idea engine draws on
> from 11 patterns to 23, and nearly doubles it on three of the five axes.
>
> **Phases A and B are free, take a day, and are where almost all the value is.** Everything after
> them is new capability rather than repair.

---

## §0 Where we actually are

| | Built today | Reaching a prompt |
|---|---|---|
| Validator-clean CML cases | **12** | 0 |
| Derived fingerprints | **12** | 0 |
| Schema-valid device patterns | **12** | 0 |

The three consumers each read a different directory, and none of them is ours:

| Consumer | Reads | Contains |
|---|---|---|
| **Agent 3b** — the idea engine | `packages/device-library/data/patterns/` | 11 hand-authored patterns |
| **Novelty judge** | `packages/novelty/data/seed-fingerprints.yaml` | 14 legacy fingerprints, [11 of which disagree with their own source](../ANALYSIS_77/ANALYSIS_77.md#43-the-fingerprint-ledger-disagrees-with-its-own-source-in-11-of-14-cases) |
| **Agent 3** — CML generator | `examples/` | the 14 legacy files, [0 of which pass `validateCml`](../ANALYSIS_77/ANALYSIS_77.md#42-no-seed-file-passes-the-projects-own-validator) |

MEASURED — retrieval for a 1931 story, now versus with our patterns installed:

| Axis | Now | Installed | |
|---|---|---|---|
| spatial | 5 | **10** | +5 |
| behavioral | 4 | **8** | +4 |
| identity | 1 | **3** | +2 |
| temporal | 6 | 7 | +1 |
| authority | 2 | 2 | — |

`authority` staying flat is the honest reading: it remains the empty axis, and no amount of wiring
fills it. That is an acquisition problem ([A_77 §8.3](../ANALYSIS_77/ANALYSIS_77.md#83-the-acquisition-list)),
not an integration one.

---

## §1 The six connection points, ranked

| # | Connection | Direction | State | Cost |
|---|---|---|---|---|
| **A1** | device patterns → **Agent 3b** | **positive** | files exist, wrong directory | **£0** |
| **A2** | fingerprints → **novelty judge** | negative | file exists, wrong directory | **£0** |
| **B** | cases → **Agent 3 exemplars** | **positive** | needs 3 dead fields repaired first | **£0** |
| **C** | fingerprints → **cell scheduler** | **obligation** | no code path exists | ~½ day |
| **D** | source texts → **anti-copy gate** | guarantee | does not exist | ~1 day |
| **E** | source texts → **calibration corpus** | **positive** | does not exist | ~1 day |

Note the *direction* column. [A_78 §7](../ANALYSIS_78/ANALYSIS_78.md#7-the-asymmetry-stated-plainly)
found that every existing link from the corpus to the generator is a **prohibition**, and that
`cell-scheduler.ts`'s own header argues prohibitions do not work. Four of the six connections above
are positive or obligation-shaped. That is the point of the exercise.

---

## §2 Phase A — the free wiring (half a day, £0)

### A1 · Install the device patterns

`loadPatterns()` reads `packages/device-library/data/patterns/` from a hard-coded path. Two options:

1. **Copy** the 12 `device.draft.yaml` files in as `<slug>.yaml`. Simplest; makes `library/` the
   authoring source and the package directory a build artifact.
2. **Add `DEVICE_LIBRARY_EXTRA_DIR`** to `loader.ts` and point it at `library/works`. One small code
   change, no duplication, and the generated corpus stays visibly generated.

**Prefer (2).** Duplication is how `examples/` and `seed-fingerprints.yaml` drifted apart in the
first place, and the whole argument of [A_77 §10.5](../ANALYSIS_77/ANALYSIS_77.md#105-derive--fingerprints-computed-not-written)
is that a derived artifact should be regenerated, never copied.

Ship behind the existing `AGENT3B_DEVICE_LIBRARY` flag, which is already `true` — so add a second,
`DEVICE_LIBRARY_INCLUDE_CORPUS`, default **off**, and turn it on deliberately.

**Before the flag flips, resolve one thing:** three of the twelve device patterns still carry a
`family` the 14-value enum cannot express — see [§7.1](#71-the-mechanism-vocabulary-gap--blocks-a1-and-c).

### A2 · Derive the fingerprint ledger instead of hand-authoring it

`seed-fingerprints.yaml` is labelled *"Derived artifact — regenerated when the seeds change"* and is
nothing of the kind: it is hand-authored, has been committed exactly once, and disagrees with its own
sources 11 times in 14.

Replace it with a generated file assembled from `library/works/*/fingerprint.yaml`, plus a test that
fails when the two diverge. The drift then becomes structurally impossible rather than merely fixed.

Keep the legacy entries for works we have not re-encoded, tagged `provenance: legacy_hand_authored`,
so the ledger says which of its rows are trustworthy.

**This also retires the synthetic placeholder.** `the_second_key` — author `"original"`, licence
CC-BY — is currently the **third most-cited nearest neighbour** across 32 archived novelty audits,
ahead of every Doyle novel. It should not be in a corpus of real fiction.

---

## §3 Phase B — repair the one positive channel that already exists (half a day, £0)

Agent 3's seed-pattern block is the only channel *designed* to carry worked structure into a prompt,
and [A_78 §3](../ANALYSIS_78/ANALYSIS_78.md#3-what-agent-3-gets-and-why-the-larger-number-is-not-better)
measured what it actually emits:

```
Pattern from a_study_in_scarlet_cml2 (temporal axis):
- Mechanism type: unknown
- Constraint space size: 0 constraints
- Inference path: 0 steps
```

Three of five fields are structurally incapable of holding a value — they read `.type` on a mechanism
that has none, `.constraints` on an object whose real keys are `.time/.access/.social`, and `.length`
on an object. **Pointing this at `library/works` without repairing it would print the same thing for
our books.** Repair first, then repoint.

Repaired, and fed our cases, each exemplar becomes a worked false assumption, a mechanism, an
inference path and a discriminating test — which is what "positive material" was supposed to mean.

Also in scope, because it is the same file: `buildNoveltyConstraints` reads titles as
`CASE.meta.title ?? meta` and truncates alphabetically at 8, which is why **`the_clue_of_the_twisted_candle_cml2.yaml`
appears as a raw filename in the live prompt.** Reading `library/works` fixes both.

---

## §4 Phase C — give the cell scheduler a genre map (½ day)

`cell-scheduler.ts` is the best-argued component in the codebase and the closest thing here to a real
idea engine. Its header is right:

> *"'Avoid X' has an INFINITE satisfying set, and a model asked to satisfy it moves the minimum
> distance required… The repair is not a better prohibition. It is to replace the prohibition with an
> OBLIGATION."*

Its signature is `scheduleCell(records: PriorRunRecord[], windowN = 20)`. **There is no corpus
parameter.** It walks a space defined only by our own 102 shipped runs, so an "unoccupied" cell means
*this pipeline has not been there* — which says nothing about whether the genre has.

The change is small: accept a second array of corpus fingerprints and distinguish three states.

| Cell state | Meaning | Value |
|---|---|---|
| occupied by us | we have shipped it | avoid |
| occupied by the canon, **not by us** | a form the genre uses and we have never attempted | **the most valuable list we could own** |
| occupied by neither | unwritten, or unwritten *for a reason* | novel, unproven |

The middle row cannot currently be computed, and it is the one a writer would most want.

**Honour the component's own negative control before promoting it past `shadow`:** *"if a scheduled
`epistemic` × `poison_delayed` case scores the same as the clock cases, that is the most useful result
available."*

**Fix its input while there:** 97 of 102 ledger records carry no `mechanismFamily`, so occupancy is
inferred by keyword rules. Today's `corpus-classify.mjs` showed what those rules are worth — it
**corrected 9 of 12** families a regex had assigned, including *A Jury of Her Peers* mis-filed as
`secret_will_inheritance` because its text contains the word *"will"* as a verb.

---

## §5 Phase D — the anti-copy gate (1 day)

**This is the missing half of "rich and varied without copying", and it is the only item that is a
guarantee rather than an improvement.**

The wiki itself is already safe by construction. De-specification is role-aware and verified clean:
no proper noun survives outside the `sources:` line, so a prompt sees *"the culprit occupies a role
whose occupant is not perceived as a person"* and never *"Welkin"*. That is the input side.

The output side does not exist. **Nothing checks a finished chapter against the source texts we now
hold on disk.** Today that risk is near zero, because no source prose reaches any prompt. It stops
being near zero the moment [Phase E](#6-phase-e--the-calibration-corpus-1-day) puts real period
sentences anywhere near the generator, and the gate must exist **before** that, not alongside it.

Build:

- a **6-gram index** over every stored snippet and every cached source text;
- a check at the ship layer, hung beside `detectTemplateLeakage` in `packages/prose-guard/src/fidelity.ts`,
  which already does this shape of work;
- **any match is a hard fail**, reporting the work and the span.

**Baseline it first** over the 189 archived manuscripts to measure the false-positive rate on
period-idiomatic phrasing, and set *n* from that. A gate whose firing rate is unknown is the
unmeasured change this project's boards argue against.

---

## §6 Phase E — the calibration corpus (1 day)

The last positive use, and the one aimed at the category that has never been praised. ANALYSIS_75
found `prose` is the lowest-scoring of the ten, has never been given a 9, and that **every prose
signal we own counts defects** — so the category has no gradient above zero.

We now hold 685,000 words of real Golden Age prose on disk. Derived measures from it, no text moved:

1. **Openings** — what the canon puts in its first sentence, as a *target* rather than a diverge-from
   list. All seventeen `opening_hook` 8s in our external reads are an inventory of props followed by a
   compliment; if the reader rewards props, measure what the canon's props are.
2. **Register** — sentence-length distribution, clause structure, dialogue density. A target drawn
   from *Father Brown* has a shape behind it; `voice-spec`'s arbitrary 22.0 words/sentence did not,
   and was ignored in 10 chapters out of 10.
3. **Period lexicon** — the open list that X95's closed one needed, and an input to `period-kb`'s
   anachronism linter.
4. **Scene inventory** — what a Golden Age mystery is *made of*, replacing the hand-written
   `GOLDEN_AGE_BEATS`.

All four are deterministic and cost nothing to compute. **Gated on Phase D shipping first.**

---

## §7 Blockers — clear these before the phases they block

### 7.1 The mechanism vocabulary gap — blocks A1 and C

Three vocabularies exist: **14** values in the fingerprint schema, **4** in the device library, **12**
in the scheduler, bridged by a `FAMILY_MAP` with five `null` entries that silently suppress the
raw-material block.

And the 14 cannot express two of our best works. `corpus-classify.mjs` filed *The Invisible Man* as
`impersonation` — but Welkin impersonates nobody; he occupies a role whose occupant is not perceived
as a person. *A Jury of Her Peers* has **no accomplice and no trick at all**: the concealment is done
by the investigation's own framing.

Add **`role_invisibility`** and **`investigative_blind_spot`**, and reconcile the three lists to one.
A wrong family is not cosmetic — [A_77 §16.9](../ANALYSIS_77/ANALYSIS_77.md#169-second-run--two-more-works-2-budget)
measured it surfacing as a wrong novelty verdict.

### 7.2 `isDetectiveArchetype` substring collision — blocks further encoding

`packages/cml/src/roles.ts:47` splits an archetype on `[,;/]` and matches the role noun anywhere in
the head, so *"detective novelist"* reads as **the detective** and `validateCml` then rejects the case
if that person is the culprit. Golden Age fiction is thick with detective novelists, ex-detectives and
detective-story readers. Cost today: one wasted gate round.

### 7.3 *The Moonstone* — 259,232 tokens against a 250,000 ceiling

The only acquired work no deployment can read in one pass. **Do not chunk it** — splitting a mystery
is what produces confidently wrong encodings. Either raise the `gpt-4.1-mini` quota, or accept an
11-work corpus and say so.

### 7.4 Uneven anchor coverage — quality debt, not a blocker

Books passed with anchor counts from 19/20 down to 3/20. The cases are structurally sound; the
*verified* evidence trail behind the thin ones is weak. Re-run `corpus-repair.mjs` on the low scorers
(≈4p each) before treating those entries as fully trustworthy.

---

## §8 Cost

| Phase | LLM | Effort | Unlocks |
|---|---|---|---|
| 7.1 vocabulary | £0 | 2 h | A1, C |
| 7.2 archetype fix | £0 | 30 min | encoding |
| **A1 · device patterns → Agent 3b** | **£0** | 2 h | **11 → 23 patterns** |
| **A2 · derived fingerprint ledger** | **£0** | 2 h | ends 11/14 drift |
| **B · repair + repoint exemplars** | **£0** | 4 h | the only positive channel |
| C · scheduler genre map | £0 | 4 h | the obligation engine |
| D · anti-copy gate | £0 | 1 day | the guarantee |
| E · calibration corpus | £0 | 1 day | first upward prose signal |
| 7.3 Moonstone | ~£0.30 | quota | 12 → 13 works |
| **Total** | **≈ £0.30** | **~4 days** | |

**The integration is essentially free.** Today's £1.71 bought the corpus; connecting it is engineering,
not tokens. That asymmetry is the finding: the expensive half is done and the cheap half is undone.

---

## §9 How we would know it worked

Stated before building, per house rule.

1. **A1 changes nothing measurable.** If 23 patterns produce the same devices as 11, the device
   library is not the lever and Phase E gets the effort instead. **Cheapest test — run it first.**
2. **The scheduler picks canon-occupied-but-unused cells and the cases are worse.** Then a form the
   genre uses and we avoid is one we avoid *for a reason*, and the middle row loses its value.
3. **The anti-copy gate fires on the existing 189 manuscripts.** Then 6-grams are too tight for period
   idiom; raise *n* and re-baseline before shipping any snippet.
4. **Register targets are ignored like VoiceSpec was.** Same fate: delete, do not defend.

Note `rubric-cannot-rank-two-books`: no internal A/B under ~7 marks is measurable here, so the honest
instrument for A1 and B is a **matched pair read externally**, which `matched-pair-is-now-executable`
makes available.

---

## §10 What not to do

- **Do not copy `library/works` into two places.** Duplication is exactly how `examples/` and
  `seed-fingerprints.yaml` drifted apart. One source, derived outputs, a test that fails on divergence.
- **Do not repoint Agent 3's exemplar block before repairing its three dead fields.** It would print
  `Mechanism type: unknown` for our books too, and look like our corpus had failed.
- **Do not fill the `FAMILY_MAP` nulls with near-matches** to close the gap. `device-library-block.ts`
  is right that a wrong retrieval is worse than none.
- **Do not promote the cell scheduler past `shadow`** until its own negative control has been run.
- **Do not put source prose anywhere near a prompt before Phase D ships.** The input side is safe by
  construction today; that property ends the moment Phase E begins.

---

## §11 Implementation record — A, B and C, 2026-08-31

All three phases are built, flag-gated default-OFF, and verified against the built code rather than by
reading it. What follows is what was measured, and one place where §7.4 above was wrong.

### 11.1 What shipped

| | Change | Flag | Measured effect |
| --- | --- | --- | --- |
| **A1** | `library/works/*/device.draft.yaml` loaded beside the curated eleven | `DEVICE_LIBRARY_INCLUDE_CORPUS` | 11 patterns → 23. Retrieval for a 1931 story: spatial 5→10, behavioral 4→8, identity 1→3 |
| **A2** | `seed-fingerprints.yaml` regenerated from the corpus by `scripts/corpus-sync-fingerprints.mjs`, with `--check` for CI | *(build step)* | The file's own claim to be "derived" is now true. `the_second_key` (synthetic, CC-BY, 3rd most-cited neighbour across 32 audits) retired |
| **B** | `loadSeedCMLFiles` reads the corpus; three structurally-dead reads repaired; the prompt block emits a worked case instead of a row of counts | `SEED_CORPUS_FROM_LIBRARY` | 18 files load, axes `{behavioral 4, spatial 5, temporal 2, identity 4, unknown 3}`. The block went from "Mechanism type: unknown / 0 constraints / 0 steps" to premise, false belief, mechanism, the inference chain and the discriminating test |
| **B (title/order)** | `buildNoveltyConstraints` reads three title shapes and orders seeds by the run's axis | *(unflagged repair)* | Five legacy seeds had been passed to Agent 3 as filenames — literally "diverge from trents_last_case_cml2.yaml" |
| **C** | `scheduleCell` takes a corpus argument and reports a three-state occupancy | `NOVELTY_CELL_SCHEDULER_CORPUS` | See 11.2 |

### 11.2 The cell space, measured

Against the 102-run ledger and the 12-work corpus, over the 5 × 14 = 70-cell grid:

| | cells |
| --- | --- |
| occupied by both | 5 |
| **occupied by canon only — proven to carry a novel, we have never been** | **5** |
| occupied by us only | 12 |
| occupied by neither | 48 |

44 of the 102 runs sit in `temporal × locked_room_timing` alone. The corpus-blind scheduler's pick that
day was `behavioral × alibi_fabrication` — drawn from the 48, a cell **no canonical work occupies**.
That is not necessarily a bad cell, but it was not a choice: the module could not tell the difference.
With the corpus passed, the pick becomes `behavioral × impersonation`, tier `canon-not-us`, evidenced
by *The Invisible Man*.

Canon-occupancy breaks ties **below** depth, never above it, so repetition-avoidance stays the first
duty; a synthetic canon marker planted on the 44-run hot cell does not pull the pick toward it. With an
empty corpus array the ranking provably collapses to the previous nested walk and the chosen cell is
unchanged — which is what makes the flag-off path a no-op rather than a claim of one.

The occupancy tier distinguishes `unknown` (corpus not consulted) from `neither` (consulted, nobody has
been there). Collapsing those two is how a blind scheduler reads as a confident one.

### 11.3 CORRECTION to §7.4 — it was not quality debt

§7.4 called uneven anchor coverage "quality debt, not a blocker" and asserted **"the cases are
structurally sound"**. That is withdrawn. It is wrong.

Wiring A2 immediately broke a load-bearing novelty invariant (`novelty.test.ts` §9.4): a deliberate
paraphrase of *The Big Bow Mystery* stopped being caught as a clone. The cause was not the test.

**And the encode had not invented anything.** That was the first diagnosis and it was too kind to the
harness. Our re-encode had the murderer entering the locked room beforehand with a key, cutting the
sleeping man's throat and faking the bolt — which is, in substance, **the book's own refuted theory of
how an innocent man did it**, argued at length in-world and published by the detective. Zangwill's
actual trick is the opposite: the killer cuts the throat **as he breaks the door down**, in front of a
witness, and only then announces a death that has not yet happened. Confirmed against the text —
Grodman's confession reads *"took my razor, and went across… As I broke open the door of the bedroom
in which Arthur Constant lay sleeping"*.

This is a worse failure mode than invention and a much easier one to miss. **A detective novel
contains a fully-argued wrong answer by design.** An encoder that grabs it produces a case that is
internally coherent, textually grounded, schema-valid, and exactly backwards. Nothing in the pipeline
was looking for it. The encoder is now told explicitly that the explanation which survives to the last
chapter is the one to encode, and that the refuted one belongs in `false_solution`.

**The evidence was already on disk and nothing was reading it.** `encode-report.json` recorded the
mechanism anchor — "Grodman had drugged Constant…" — as `ok: false`, meaning that sentence appears
nowhere in the book. The case shipped because promotion gated on `validateCml`, a **schema** check,
which a coherent wrong answer passes exactly as easily as the truth.

So promotion now gates on anchor evidence, in three states, because *we looked and it failed* and *we
never looked* are different claims:

| provenance | meaning | count |
| --- | --- | --- |
| `derived` | report describes the case on disk, ≥60% anchor coverage, no failed solution check | **4** |
| `derived_unverified` | re-encoded, but no anchor evidence persisted to disk | 5 |
| `legacy_hand_authored` | never re-encoded, **or re-encoded and demoted by the gate** | 8 |

**Four works were re-encoded against the corrected prompt (£0.43).** Big Bow went 9/20 → **15/20** and
its `delivery_path` now has the door broken down *before* the throat is cut; the classifier then
derived `locked_room_timing` and `the_body_died_before_the_room_opened` — independently reproducing
the hand-authored fingerprint that had been right all along, which is the strongest available evidence
the fix worked. Three still fail and stay on their legacy rows: `the_hound_of_the_baskervilles`
(3/20 → 7/20), `the_mystery_of_the_yellow_room` (50%, and it needed a repair round to validate at all)
and `the_leavenworth_case` (see §11.4).

One demotion was **wrong and has been withdrawn**: `the_valley_of_fear` was cut on a coverage figure
of 8/20 read from a report written *before* `corpus-repair.mjs` last changed its case. Recomputing
from the model's own anchors gives **15/20 (75%)**. `scripts/corpus-verify.mjs` now recomputes
coverage from two inputs that cannot drift — the anchors the model returned and the source text — and
it found exactly one such discrepancy across the corpus.

`a_study_in_scarlet` at 19/20 is what proves the harness works, so the low scores are a claim about
those encodes and not about the probe. One competing explanation was tested and **refuted**: Gutenberg
texts are often hard-wrapped, and the matcher collapses whitespace in the anchor but not in the
source, so an anchor crossing a line break could never match. Real bug, but latent — these texts are
stored de-wrapped at 185–283 characters a line, and normalising the source recovers **0** anchors
across all seven works. Fixed anyway, before it bites the first hard-wrapped text we cache.

Two consequences worth stating plainly:

1. **The corpus is smaller than it looked.** Twelve validator-clean cases are not twelve trustworthy
   records. Eight of them are one grade or two below what §16 of A_77 implied.
2. **The gate now reaches A1 and B**, closing the limitation this section originally recorded.
   `corpus-sync-fingerprints.mjs` publishes `library/works/.verification.json` and both loaders skip
   `failed` works — A1 drops 23 → 20 patterns, B loads 9 of 12 cases. Only `failed` is excluded:
   missing evidence is not evidence of badness, and a missing manifest skips nothing, so the gate can
   only ever remove works it has actually judged.

### 11.4 Five defects found in the tooling on the way

- **A rejected re-encode overwrote the accepted case's evidence.** `corpus-encode.mjs` writes
  `case.cml2.yaml` only when the case validates, but wrote `encode-report.json` either way. So a
  failed attempt left a report describing a case that had been thrown away, sitting beside the older
  case that was actually kept — and the gate would then judge one file by another file's anchors.
  MEASURED on `the_leavenworth_case`, whose rejected attempt scored 14/20 while the case on disk was
  a different encode measured at 9/19. Rejected attempts now go to `encode-report.rejected.json`, and
  the gate independently **fails closed** when `encode-raw.json` postdates the case beside it. That
  guard caught Leavenworth live, which is how it is known to work.
- **`false_assumption_pattern` was the first four words of a sentence.** `corpus-derive.mjs` built it
  as `tokenise(statement).slice(0, 4)`, producing `the_victim_s_death`, `the_dead_man_is` and
  `the_bloodstain_on_the` — three of which stop mid-phrase on an article. The novelty judge uses this
  field as a **similarity key**, so the derived fingerprints were strictly WEAKER than the
  hand-authored ones they replaced, and that alone re-broke the Big Bow clone test after the encode
  itself had been fixed. `corpus-classify.mjs` now classifies this field and `inference_shape` the way
  it already classified `mechanism_family` (£0.033 for the whole corpus). Independent confirmation:
  Fenchurch Street and Valley of Fear both derive `the_dead_is_who_they_appear`, and three
  locked-room works converge on `locked_room_means_no_entry`.
- **"0/0" read like a pass.** The solution-coverage check keys off each anchor's `claim` label. An
  encode that returned bare strings instead of `{claim, anchor}` objects has no labels, so the check
  silently could not fire — and it printed `solution claims 0/0` beside a PASS, on Big Bow, the one
  work whose solution was wrong. The gate now reports `solution coverage UNMEASURED` instead, and the
  encoder is told the object shape is mandatory.
- **`corpus-sync-fingerprints.mjs` read its legacy rows out of the file it overwrites**, so a work
  derived on one run and demoted on the next would have had nothing to fall back to. Legacy rows now
  come from `seed-fingerprints.legacy.yaml`, an immutable snapshot.
- **`scripts/flag-register-check.mjs` could not see `DEVICE_LIBRARY_*` or `SEED_CORPUS_*`** — its
  `FLAG_PATTERN` allow-lists prefixes, so two flags read by shipped code would never have appeared in
  the register. That is the "dead lever documented as live" failure the script exists to catch, run
  backwards: a *live* lever the register cannot police. Both prefixes added; the check now sees 122
  reads where it saw 118.

### 11.5 Not done

Phase D (anti-copy gate) and Phase E (calibration corpus) are unstarted.

Three works remain demoted. Hound is the stubborn one: at 7/20 its anchors are near-quotes that
**join words from different places** ("phosphorus, a cunning preparation of it" — both phrases are in
the book, in different sentences), which the prompt forbids and the matcher correctly rejects. Its
legacy fingerprint is right, so the cost of leaving it demoted is low. Leavenworth failed four repair
rounds on one persistent grounding error and has now consumed roughly £0.63 across five attempts; it
is the clearest candidate for a different approach rather than another reroll. *The Moonstone* (§7.3)
remains capacity-blocked.

Spend for this pass: **£0.43 re-encoding, £0.20 repair, £0.04 classification** — £2.35 cumulative
against the £5 ceiling.

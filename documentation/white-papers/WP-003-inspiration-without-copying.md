# WP-003 — INSPIRATION WITHOUT COPYING

**How the reference corpus can give the generator ideas rather than prohibitions, which of the seven
ideas on the table actually reach a prompt today, and whether 169 works is enough for any of them.**
2026-09-18 · every figure MEASURED from the live `dist` build, `library/manifest.json`,
`library/index/cells.json`, `packages/novelty/data/seed-fingerprints.yaml` and
`data/novelty-ledger.json` unless labelled otherwise · prior art in A_77 §7, A_78 §7–8, A_79 §4/§11/§14

> **REVISED 2026-09-18, same day.** The first version of this paper ran the cell map on **three**
> dimensions and reported a coverage crisis that was partly an artefact of the third one. §9 is the
> correction record: what was wrong, how it was found, and what it changed. All figures below are the
> corrected two-dimension ones.

---

## ABSTRACT

The corpus is now 169 public-domain works, 12.3M words, 60 encoded cases and 46 novelty fingerprints.
The owner's question is whether the generator can take an *idea* from it and turn that idea into
something original — without copying. This paper reviews every proposal made for that in A_77, A_78,
A_79 and this week's work, measures which ones reach a model today, and answers the second question
underneath the first: is the corpus big enough for the idea to work at all.

**The claim.**

> **The reusable asset in detective fiction is the *shape of the deception*, and a shape cannot be
> plagiarised. The right operation is not "be inspired by this book" but "take this book's shape,
> change one of its two dimensions, and land in a cell no book occupies."** That operation is an
> obligation rather than a prohibition, it is built from attested parts, it is novel by construction,
> and the only thing that crosses from the corpus into the prompt is a two-field address plus a worked
> structural example the model is told is *"STRUCTURES, not material."* The verbatim text never reaches
> a prompt, and the anti-copy gate — on, and a hard fail, at n=11 with a measured 0.0% false-positive
> rate — is the guarantee that it never leaks out the other end.
>
> **The corpus is big enough in words, and one batch short in shapes.** 165 texts is seventeen times
> the calibration sample the register work was built on. The 44 encoded fingerprints occupy **25 of 80
> cells**, and Chao1 estimates the genre reaches **~66** of them. **Encoding the 109 works already on
> disk — ~£12, no new acquisition — projects to 80% of that reachable map.** The remaining constraint
> is not volume. It is *spread*: two batches chosen shortest-first moved `authority` from 0 to 2
> encoded works, and `authority` is where every best morph candidate now sits.

Stated so it can be wrong: **one run, no reader needed.** Give Agent 3 a morph obligation into
`authority · secret_will_inheritance` — tier *canon-not-us*, one family-swap from *The Strange Schemes
of Randolph Mason* — and read the CML it produces with the fingerprint extractor. The fingerprint
should land in the assigned cell **and** Agent 8 should judge it `distinct` against all 46 seeds. If it
lands in `identity × impersonation` anyway — the corpus's centre of mass — the obligation is being
ignored and the lever is dead. That is settled at the CML stage for the cost of one Agent 3 call.

**The measurements that decide the ordering** (§2, §5):

| what the idea needs | what the corpus holds |
|---|---|
| a worked exemplar block per axis | **live**, 3 examples per axis, 4,314–4,872 chars — except `authority`, **1 example, 1,609 chars** |
| corpus-derived device patterns in Agent 3b's cut | **live**: 50 patterns, 39 from the corpus, and **2 of the top 4 on every axis** are corpus-derived (after the A_79 §14.3 allowlist fix) |
| a map of what the genre has done | **25 of 80** cells; Chao1 puts the genre at **~66** [CI 37–166] |
| cells the genre uses and we never have | **22** of 80 — A_79's "most valuable list" — computable for the first time, and a FLOOR |
| our own half of the map | **24 of 121** shipped runs carry a mechanism family; the other 97 are unclassifiable and backfillable for **£0.29** |
| a morph target built from attested parts | **57 anchored** candidates (both values attested somewhere); 14 more where the target family is attested nowhere and the move would be invention, not morphing |
| fingerprints that tell two books apart | at axis×family, **25 of 44 seeds are indistinguishable**; at full five fields, one pair is identical |
| a third dimension worth having | **there is not one.** `discriminating_test_shape` is a hardcoded relabelling of a 4-value CML field; 3 of its 6 values cannot be emitted (§9) |
| calibration texture | 12.3M words, more than enough — and **zero consumers** |

Sections 1–2 say what the corpus is for and what actually reaches a model. Section 3 reviews the seven
ideas with a verdict each. Section 4 is the operation this paper recommends. Section 5 answers "big
enough". Section 6 is what not to do, with the receipt for each. Section 7 is the plan, costed.
Section 8 is the reproduction. Section 9 is the correction record.

---

## 1. WHAT THE CORPUS IS FOR — THE THREE-LAYER ARGUMENT

A_77 §7 made the argument this paper rests on, and it has held up under everything measured since:

> A mystery novel has three layers. Its **prose** is unique to it and legally and creatively
> untouchable. Its **plot** is specific to it and useless to us — we do not want to write *The Hound of
> the Baskervilles* again. Between them sits the **shape of the deception**: *a natural agent dressed
> as a supernatural one, so that the reader disqualifies the material explanation before examining
> it.* That shape is not the property of any book. It is genre grammar.

The corpus is stored at that middle altitude on purpose. A `case.cml2.yaml` holds a false assumption,
a mechanism, an inference path, a discriminating test and a cast of roles; it holds no sentence of the
book. The `fingerprint.yaml` beside it is five fields. The 12.3M words of text are held for two jobs
only — the anti-copy index and calibration — and the rule A_77 §7.2 set is stricter than copyright:

> **The generator is never shown a passage it could paste.**

Everything in this paper is a way of moving *shape* from the corpus to the generator. Nothing in it
moves text, and §6 names the one proposal that would.

---

## 2. WHAT REACHES A MODEL TODAY — FIVE CHANNELS, MEASURED

A_78 §7 found that as of August every channel from the canon to the generator was **negative** —
"diverge from these titles", "avoid these patterns" — and the one positive block printed
`Mechanism type: unknown / 0 constraints / 0 steps` for every book. That was true then. This is now.

| channel | reads | state | what the model sees |
|---|---|---|---|
| **Agent 3 — worked examples** | `case.cml2.yaml` (or legacy) | **live**, unconditional since A_98 | 3 exemplars matching the run's axis, ~4.5k chars: surface, the reader's wrong belief, what was actually happening, how the gap closed, how the truth was forced |
| **Agent 3b — device library** | `device.draft.yaml` | **live** (`DEVICE_LIBRARY_INCLUDE_CORPUS=true`) | 50 patterns; corpus entries enter the top-4 cut on every axis |
| **Agent 8 — novelty judge** | `seed-fingerprints.yaml` | **live**, 46 fingerprints | a similarity verdict — a prohibition, not an idea |
| **Agent 9 — anti-copy gate** | `library/texts/*.txt` | **live, hard fail** (`PROSE_ANTI_COPY_GATE=true`) | nothing; it reads the output |
| **Cell scheduler** | corpus + run ledger | **shadow** (`NOVELTY_CELL_SCHEDULER=shadow`, corpus feed on) | nothing yet; it logs a cell and changes no input |
| **Calibration** | `library/calibration/*.json` | **dead — zero consumers** in `apps/` or `packages/` | nothing |

Two things in that table matter for the rest of the paper.

The first is that **the positive channels exist now.** The exemplar block A_78 found dead prints,
verbatim, for a behavioral run:

> *WORKED EXAMPLE — A Jury of Her Peers (behavioral axis) … The reader's wrong belief: Evidence will
> be found where men of standing expect to look for it. What was actually happening: the victim wrung
> the neck of his wife's canary, and she killed him in his sleep …*

followed by the instruction: *"These are STRUCTURES, not material. Build a different deception of
comparable rigour: do not reuse a mechanism, a setting or a phrase from any of them."* That is a
shape crossing the boundary with a non-reuse instruction attached, which is exactly the §7.2 rule.

The second is that the **anti-copy gate is on and throws.** Its docstring still says "default OFF" and
cites 204 manuscripts at n=10; both are stale. It indexes 12.3M words and aborts a run on any verbatim
run of eleven words. That is what makes every other idea here safe to try: the guarantee is at the
output, not in anyone's good intentions. A_97 §11 is why n is 11 and not 10 — at n=10 the measured
false-positive rate against the enlarged corpus was 0.9%, roughly one dead run in 110 for a
coincidental phrase like *"the back of a chair as if to steady himself."*

---

## 3. THE SEVEN IDEAS, REVIEWED

Every proposal for "inspiration from the corpus" made in A_77, A_78, A_79 or this week, with what it
would give the generator, what it costs, and a verdict.

### 3.1 Worked exemplars — *"here is a good one on your axis"*

**Source.** A_77 §7.1 (the "exemplar" corpus), A_78 §8.1, A_79 Phase B.
**Status.** Built, live, confirmed at the prompt level in A_79 §14.1.
**What it gives.** Depth: a structurally complete case on the run's axis, so Agent 3 has a worked
instance of the shape it is being asked to produce rather than a bare axis word.
**Limit.** Three per axis is enough only where three exist. `authority` has one, so the block is a
third the size. And an exemplar is inspiration only in the weak sense — it shows the model what
*done* looks like; it does not tell it where to go.
**Verdict.** Keep. It is the floor everything else stands on, and it is the reason §4's operation has
something to hand the model.

### 3.2 Corpus-derived device patterns — *"raw material, not a menu"*

**Source.** A_78 §8.2, A_79 Phase A1, `corpus-derive` + `corpus-classify`.
**Status.** Built, live, and — after the A_79 §14.3 fix — actually in the cut. MEASURED this week:
50 patterns loaded, 39 from the corpus; for an era-1928 query the top four are corpus-derived at
2 of 4 (temporal, spatial, behavioral), 3 of 4 (identity), 1 of 3 (authority).
**What it gives.** Agent 3b's mechanism block now carries principles that came from real books, with
a citation, instead of eleven hand-written ones with *"convention"* as their source.
**Limit.** The A_79 §14.3 finding is worth repeating because it is the shape of every "loaded but
ineffective" defect: 9 patterns loaded and changed *not one byte of any prompt*, because a constant
alphabetical tiebreak in front of a top-4 cut is a silent allowlist. Loading is not reaching.
**Verdict.** Keep, and verify by agent label in `llm-prompts-full.jsonl` on the next run, not by
counting what loaded.

### 3.3 Divergence — *"do not resemble these"*

**Source.** The original design; A_77 §6; Agent 8; `divergeFrom` and `avoidancePatterns` in Agent 3.
**Status.** Live. `NOVELTY_HARD_FAIL=false`, threshold 1.0.
**What it gives.** Nothing positive. A_78 §7 said it best: *a model told only what not to do moves the
minimum distance — told to diverge from seven sundials it writes a bell tower.* The cell scheduler's
own header: *"'Avoid X' has an INFINITE satisfying set."*
**Verdict.** Keep as a check, never as a lever. It is the wrong instrument for the owner's question,
and it is listed here so it is not re-proposed as the answer.

### 3.4 Structural cells — *"generate into a cell no book occupies"*

**Source.** A_77 §7, the organising idea of the whole plan; A_79 Phase C built the three-tier
scheduler and measured 5 canon-only cells of 70 at 12 works.
**Status.** Built to shadow. The corpus feed flag is on. Nothing is applied to any input. The map
itself is now a committed artifact, `library/index/cells.json`, generated by `scripts/corpus-cells.mjs`
with `--check` in CI.
**What it gives.** An **obligation**: not "avoid these" but "go here." A_79 §4's three tiers, computed
against 44 corpus fingerprints and the 121-run ledger on the 5 × 16 grid:

| tier | cells | meaning |
|---|---|---|
| occupied by both | 3 | done by the genre and by us |
| **canon-not-us** | **22** | *a form the genre uses and we have never attempted* |
| us only | 6 | our own habits |
| neither | 49 | unwritten, or unwritten for a reason |

(**Caveat, MEASURED:** only 24 of the 121 shipped runs record a mechanism family — A_79 §4's "97 of
102 carry no `mechanismFamily`" is still true — so the *us* side is a quarter of our history. The 22
is a **floor** on canon-not-us cells, not a ceiling.)

**Limit.** The map is 31% occupied and lopsided, and §5.4 is about the one dimension that had to be
thrown away.
**Verdict.** This is the idea. §4 is the version of it that is buildable today.

### 3.5 The morph — *"take an attested shape and change one dimension"*

**Source.** This week, as the concrete form of 3.4.
**What it gives.** The answer to "inspired by, not copying" in one sentence: *start from a real book's
shape, keep one dimension, change the other, and require the destination to be a cell nobody has
written.* MEASURED: **57 anchored candidates** — empty or canon-not-us cells, reachable by changing one
dimension of an attested cell, with both of the target's own values attested somewhere in the corpus.

The strongest single candidate, because it is tier *canon-not-us* — the genre has proved the form
carries a novel and we have never been there:

> **`authority · secret_will_inheritance`** — one family-swap from *The Strange Schemes of Randolph
> Mason*, and occupied in the canon by *The Leavenworth Case*. An authority mystery whose mechanism is
> a concealed inheritance. Attested on both dimensions; unattempted by us.

And the most remote reachable cells, all on the thinnest axis:

> **`authority · locked_room_key`**, **`authority · poison_delayed`**, **`authority · unconscious_act`**
> — each three routes from an attested cell, each in tier *neither*.

**Two ranking corrections, both found by checking the output rather than the code.** Neighbour-count
ranking returned ten cells that were all `identity · …`, the genre's most crowded region as this
corpus samples it — the least original place a morph could land; ranking by *distance from* the
centre of mass fixed it. And the four most remote candidates under that fix were families with **zero
attestation anywhere** (`role_invisibility`, `investigative_blind_spot`), where the move is inventing a
form rather than morphing an attested one — so a target must now be **anchored** on both values.
**Verdict.** Build this, as §4 specifies.

### 3.6 Calibration — *"what does period detective fiction sound like"*

**Source.** A_77 §7.1 (the third corpus), A_79 Phase E, recomputed in A_97 over 165 works.
**Status.** Computed. **Read by nothing.** `grep` for `library/calibration` in `apps/` and `packages/`
returns zero files.
**What it gives.** Texture, not ideas — and the A_97 recompute moved the targets: the mean-sentence gap
is now exactly 0.00, the em-dash gap widened to −7.64, the semicolon target was 32% too high.
**Verdict.** Not an inspiration channel; a register instrument. Out of scope here except to record
that it is dead and that this paper does not fix it.

### 3.7 Bounded snippets as register anchors — *"≤25 words, attributed, behind a flag"*

**Source.** A_77 §7.2 permitted it, conditional on the anti-copy gate shipping first.
**Status.** Not built. The precondition — the gate — now exists and is on.
**What it gives.** Real period sentences near the generator, for register. It is the only proposal in
this list that moves *text* across the boundary.
**Verdict.** Do not build it yet, and not because of copyright — the gate handles that. Because it is
a register lever, not an idea lever, and because every measured register lever in this project
(VoiceSpec, the 19.5-word sentence, rate targets) was ignored by the model. A_75's rule stands: this
model complies with operations and ignores statistics. A snippet is neither.

---

## 4. THE OPERATION THIS PAPER RECOMMENDS

### 4.1 The cell space

Two dimensions, both closed enums, both **expressible as an instruction**:

```
axis                5   temporal · spatial · identity · behavioral · authority
                        — already a run parameter (CML_PRIMARY_AXES)
mechanism_family   16   the schema vocabulary — shared by the novelty judge and the device library
                   ---
                    80  cells
```

A third dimension was tried and discarded. `discriminating_test_shape` is not an independent property
of a case: it is a hardcoded lookup from the CML's own `discriminating_test.method`, three of its six
values cannot be emitted at all, and the CML and fingerprint vocabularies share no value, so a cell
naming one could not be asked for. §9 is the full record.

The other two fingerprint fields — `false_assumption_pattern` and `inference_shape` — are free text and
are what make one book in a cell differ from another. They are not addressable and this operation does
not try to address them; they are what the model writes.

### 4.2 The morph, as an obligation

```
1. SOURCE   pick an attested cell (a, f) from the canon
2. CHANGE   change exactly one of the two dimensions -> target (a', f) or (a, f')
3. ANCHOR   BOTH of the target's values must be attested somewhere in the corpus,
            or the move is invention rather than a morph (3.5)
4. TIER     the target must be NEITHER or CANON-NOT-US — never US, because
            repetition-avoidance stays the first duty (A_79 §11.2)
5. RANK     prefer the target FURTHEST from the corpus centre of mass:
            score = freq(a') + freq(f'), lower is better
6. HAND     Agent 3 receives:  the worked example of the source (3.1, already built),
            the obligation "same <unchanged dimension>; <changed> is now <v>",
            and the existing "STRUCTURES, not material" instruction
7. CHECK    extract the fingerprint from the produced CML; it must land in the target cell
8. GUARD    the anti-copy gate, unchanged, at the output
```

Step 4's exclusion of tier *us* is what makes this an idea engine rather than a repetition engine.
Step 7 is what turns it from a hope into a measurement.

### 4.3 Why this is not copying

Three reasons, each of which would hold alone:

- **What crosses is two words and a paragraph of structure**, not a sentence of the book. The exemplar
  block is a summary of a plot's *logic*, in our words, with the instruction not to reuse a mechanism,
  setting or phrase. Plot logic is not protected expression; A_77 §8.4 records the owner's decision to
  apply the sourcing rule to the *work* anyway, which is why only cleared works are in the library.
- **The destination is, by construction, a shape no book in the corpus has.** The output cannot be a
  copy of the source; it differs from it on a dimension the source's author did not use.
- **The gate.** Eleven consecutive words from any of 165 texts kills the run. Measured 0.0% false
  positives over 229 known negatives; a 40-word synthetic lift caught at full length.

### 4.4 What it does not solve

It does not solve prose. A morph is a *premise* operation; it reaches Agent 3 and stops there. A_72
measured Agent 3b as the source of the `premise` nines, so this is aimed where the shape lives — but
the five categories that have never scored a 9 (hook, character, dialogue, pacing, prose) are
downstream of it and untouched by it. A better idea, executed in the same prose, scores the same in
prose.

---

## 5. IS THE CORPUS BIG ENOUGH?

Not one question. A_77 §7.1 said the corpus is three corpora with three sizes that matter.

### 5.1 For calibration — yes, and it is not the constraint

165 texts, 12.3M words. The register numbers were built on 12 works and 720k; A_97 recomputed them on
seventeen times the sample and several moved by 25–33%. Adding the remaining 349 GREEN works would
move them less than that recompute did. **Size is not the problem here; consumption is** — nothing
reads the file.

### 5.2 For exemplars — yes on three axes, no on two

A_77 §7.1's target is 3–5 worked cases per axis. MEASURED:

| axis | encoded | exemplar block |
|---|---|---|
| identity | 29 | 3 selected, 4,830 chars |
| behavioral | 15 | 3 selected, 4,743 chars |
| spatial | 7 | 3 selected, 4,872 chars |
| temporal | 4 | 3 selected, 4,314 chars |
| **authority** | **2** | **1 selected, 1,609 chars** |

Two batches, 55 encodes, and `authority` moved from 0 to 2. Both batches were chosen shortest-first,
which selects for length, not axis. The corpus is not short of authority *books* — A_77 §15.1 named
Post, Freeman, Van Dine and Bentley for it — it is short of authority *encodes*, and encoding does not
know a book's axis until it has read it.

### 5.3 For the cell map — one batch short, and the batch we already hold

| measure | value |
|---|---|
| cells occupied | **25 of 80 (31%)** |
| Chao1 estimate of what the genre occupies | **65.5** · 95% CI **[37, 166]** |
| singletons / doubletons | f1 = 18, f2 = 4 |
| seeds on one axis (`identity`) | 45% |
| seeds indistinguishable at axis×family | 25 of 44 |

Extrapolating the accumulation curve (Chao et al. 2014):

| encodes added | cells reached | % of reachable |
|---|---|---|
| **+109 (everything already on disk)** | **52.3** | **80%** |
| +110 | — | 80% |
| +178 | — | 90% |
| +458 (the entire remaining pool) | 65.1 | 99% |

**The efficient point is the corpus we already have.** 109 works are acquired, cleared and sitting
unencoded; at the measured £0.1104 per usable case that is **£12.03 for 130 attempts**, and it projects
to 80% of the reachable map with **no new acquisition at all**. Going to 90% costs +178 (£19.65) and
requires acquiring more books — **147 MB of additional text in git**, taking the corpus from 12.3M to
~38M words, which would also force another anti-copy re-baseline. `DEFAULT_N` moved 10 → 11 when the
corpus grew 17×, and the gate is a hard fail on live runs.

**The space is probably ~65 cells, not 80.** MEASURED: three of the sixteen families have **zero
attestation across all 44 encoded works** — `information_leak`, `role_invisibility`,
`investigative_blind_spot`. (`information_leak` reached zero when `the_leak` was retired; it was the
only occupant, §9.2.) If the genre genuinely does not use them, the reachable space is 5 × 13 = **65**,
and Chao1 — working from the frequency distribution, a different input entirely — says **65.5**. The two
are not independent enough to cross-validate each other, and the truth is probably *lower* still,
because not every family is coherent on every axis. But both routes agree the map is ~65 cells, which
puts **25 observed at 38% rather than 31%**. Whether those three families are genre-absent or merely
sampling-absent is decidable by encoding, not by argument.

**The marginal cost explodes at the tail**, which is what makes the stopping point a real decision:

| encodes | cells | total | **£ per NEW cell** |
|---|---|---|---|
| +25 | 34.0 | £2.76 | £0.31 |
| **+109 (all we hold)** | **52.0** | **£12.03** | **£0.59** |
| +178 | 58.7 | £19.65 | £1.12 |
| +250 | 62.2 | £27.60 | £2.28 |
| +458 (entire pool) | 65.1 | £50.56 | **£14.98** |

**The last 13 cells cost more than the first 27.**

**Two caveats on those numbers, and the first is serious.** Chao1 rests on a thin tail: f2 = 4, so the
estimator divides by four observations and the interval is **[37, 166]** — an upper bound that exceeds
the 80-cell space, which is the estimator saying it is out of its comfort zone. The ORDERING of the
options above is robust; the second decimal place is not. And the curve was fitted to **biased
sampling**: both batches were shortest-first, which keeps landing in `identity × impersonation`. A
spread-targeted selection would find new cells *faster* than this predicts, so +110 is a pessimistic
bound under current selection rather than a law.

### 5.4 For OUR half of the map — no, and it is the cheapest thing on this list

The three-tier map has two sides, and everything above describes the canon side. The other side is our
own history, and it is **less complete than the corpus**: MEASURED, only **24 of 121** shipped runs
carry a `mechanismFamily`. The remaining 97 carry `axis`, `crimeSubtype`, `discrimMethod`,
`discrimDesign`, `falseAssumption` and `premise` — more than enough for the same classifier
`corpus-classify.mjs` already runs over books.

**~£0.29 takes the *us* side from 24 runs to 121.** Nothing else here is close on value per pound, and
it changes an interpretation rather than just a count: the 22 canon-not-us cells are computed against a
quarter of our history, so some of them are cells we HAVE visited. The list is a floor, and backfilling
is what makes it a fact — which matters before a run is ever sent into one.

### 5.5 For the morph — yes, and the thin axis is where the candidates are

57 anchored candidates is not a shortage. But every one of the top-ranked targets is on the `authority`
axis, for the arithmetic reason that `authority` has 2 encoded works and therefore the lowest possible
remoteness score. That is either the map correctly pointing at the genre's least-explored corner from
our position, or an artefact of our own under-sampling of that axis. **Those two are not
distinguishable from inside the corpus**, and the way to tell them apart is to encode more authority
works and see whether the candidates move.

### 5.6 Verdict

| job | big enough? | the actual constraint |
|---|---|---|
| calibration | **yes** | nothing consumes it |
| exemplars | **3 of 5 axes** | selection: two batches chose by length, not axis |
| divergence | **marginal** | 46 seeds and already one exact collision; 25 of 44 alias at axis×family |
| cell map (canon side) | **one batch short** | the 109 works already on disk get to 80%; beyond that the tail costs £15/cell |
| cell map (our side) | **no — 24 of 121 runs** | not a corpus problem at all; £0.29 of classification |

**The corpus is big enough in words and one batch short in shapes, and that batch is already
acquired.** What it is genuinely short of is *spread* — and spread is a selection decision that costs
the same per book as selecting by length.

---

## 6. WHAT NOT TO DO — WITH THE RECEIPT

- **Do not rank empty cells by neighbour count.** Receipt: it returned ten `identity · …` cells, the
  centre of mass. §3.5.
- **Do not propose a morph into a family attested nowhere.** Receipt: the four most remote candidates
  under distance-ranking were `role_invisibility` and `investigative_blind_spot`, which have zero
  attestation in any cell; that is invention, not morphing, and it throws away the property that makes
  the operation genre-fluent. §3.5.
- **Do not add a dimension without checking it is independent and expressible.** Receipt: §9.
- **Do not promote the scheduler past shadow before its own negative control.** Receipt: its header —
  *"if a scheduled `epistemic × poison_delayed` case scores the same as the clock cases, that is the
  most useful result available"* — and A_79 §4 asked for it before promotion. Not yet run.
- **Do not buy another shortest-first batch for this purpose.** Receipt: two batches, 55 encodes,
  `authority` 0 → 2. Cheap-first is the right batch for entry count (A_97 batch two hit 60 entries for
  £3) and the wrong batch for coverage.
- **Do not count "loaded" as "reached."** Receipt: A_79 §14.3 — nine patterns loaded, zero bytes of
  any prompt changed, found only by a paid run.
- **Do not assume fingerprints are unique.** Receipt: the novelty invariant that broke this week
  asserted `nearest === self`; it now allows an identical twin.
- **Do not let a retired work keep voting.** Receipt: `the_leak` was moved to `library/retired/` by
  A_98 and not added to `corpus-sync-fingerprints.mjs`'s `RETIRED` set, so it was still supplying the
  ledger's only occupant of `identity | information_leak` — and the first draft of this paper counted
  that cell as a form the genre uses. §9.2.
- **Do not let the corpus supply ideas about the four things it cannot.** Receipt: §4.4 — a premise
  operation does not touch prose, dialogue, pacing or character, which are where the missing marks are.

---

## 7. THE PLAN, ORDERED AND COSTED

| # | step | cost | what it settles |
|---|---|---|---|
| 0 | **Ship the cell map** — `library/index/cells.json`, generated by `scripts/corpus-cells.mjs`, `--check` in `corpus:check`. | £0 | **DONE.** The 22 canon-not-us cells and 57 anchored morph candidates are inspectable and regenerable. |
| 1 | **Decide the test-shape vocabulary.** Either accept the two-dimension map permanently, or reconcile the CML's 4-value `discriminating_test.method` with the fingerprint's 6-value `discriminating_test_shape` so that "how the truth is forced" becomes a story parameter. | £0 to decide | Whether the map ever gets a third dimension. §9 says it cannot have one as things stand. |
| 2 | **Backfill the run ledger.** Classify the 97 shipped runs that carry no mechanism family, from fields they already hold. | **£0.29** | Takes OUR half of the map from 24 runs to 121, and turns the 22 canon-not-us cells from a floor into a fact. The cheapest item on this list by an order of magnitude. |
| 3 | **Encode the 109 works already on disk.** No acquisition, no new text in git. | **£12.03** (130 attempts) | Projects to **80% of the reachable map** (~52 of ~65 cells), fills the exemplar blocks on the thin axes, and decides whether the three zero-attestation families are genre-absent or sampling-absent. |
| 4 | **The falsifier.** One run with a §4.2 morph obligation into `authority · secret_will_inheritance`. Read the CML with the extractor; verify the obligation reached Agent 3 by its label in `llm-prompts-full.jsonl`. | ~£1.15, or pennies if the CML stage can be run alone | Whether Agent 3 obeys a cell obligation at all. If it lands in `identity × impersonation` anyway, stop. |
| 5 | **Then** a matched pair (`RESUME_REDO=prose` on the same upstream) and a read. | ~£0.45 + a reader | Whether a better premise moves a mark. Per A_96, not before step 3 has a number. |

Step 4 is the whole paper in one run. Steps 2 and 3 together are **£12.32, no new acquisition and no
repo weight**, and land both halves of the map populated for the first time — which is the point to stop
and look, rather than buying a tail that costs £15 a cell.

---

## 8. REPRODUCTION

All from the live `dist` build on 2026-09-18, after `4b53461c` (60 entries) and `f7a0ef17` (one corpus
home).

- **Cell map, tiers, richness, morph candidates:** `node scripts/corpus-cells.mjs` →
  `library/index/cells.json`. Chao1 and its analytic log-normal interval are computed in that script.
- **Channels (§2):** `loadSeedCMLFiles` + `extractStructuralPatterns` + `selectRelevantPatterns` +
  `formatPatternsForPrompt` per axis; `loadPatterns` + `retrievePatterns({decade:1920, primaryAxis})`
  with `DEVICE_LIBRARY_INCLUDE_CORPUS=true`; grep for `library/calibration`.
- **The test-shape finding (§9):** `corpus-derive.mjs:57`; `schema/cml_2_0.schema.yaml:300`;
  `schema/novelty_fingerprint.schema.yaml`; a join of every `case.cml2.yaml`'s
  `discriminating_test.method` against its own `fingerprint.yaml`'s `discriminating_test_shape`.
- **Costs:** A_97 batch two — £2.87 for 31 attempts, 26 valid, £0.1104 per usable case, 83.9% accept.

**Probe defects recorded, because they are the recurring shape.** A guessed function signature reported
zero corpus retrievals on every axis; a guessed file shape reported two ledger records instead of 121;
and a naive bootstrap of Chao1 returned a median of 26 against a point estimate of 66, because
resampling with replacement destroys the singleton structure the estimator reads. All three were claims
about the probe, and the third was discarded before it reached a table.

---

## 9. CORRECTION RECORD — THE THIRD DIMENSION

The first version of this paper, written and committed earlier the same day, ran the cell map on
`axis × mechanism_family × discriminating_test_shape` — 480 cells — and reported that the map was 7.1%
occupied, that reaching 80% of it would take **+467 encodes**, and that this *"exceeds the entire
available public-domain pool"*. It also attributed the total absence of `physical_trace` to a
classifier that had misfiled *The Red Thumb Mark*.

**Both conclusions were wrong, and the second was wrong about the cause in a way that would have sent
the next day's work in the wrong direction.**

### 9.1 The third dimension is a relabelling, not a dimension

MEASURED by joining every encoded case's `discriminating_test.method` to its own fingerprint's
`discriminating_test_shape`, across all 56 encoded works:

| CML method | fingerprint shape | works |
|---|---|---|
| `reenactment` | `reconstruction` | 24 |
| `constraint_proof` | `timetable_contradiction` | 21 |
| `trap` | `behavioral_tell` | 11 |
| `administrative_pressure` | `behavioral_tell` | — (collides with `trap`) |

The correspondence is exact, with no exceptions, because the value comes from a four-entry lookup
table at `corpus-derive.mjs:57` and **`corpus-classify.mjs` never writes that field** — it writes
`mechanism_family`, `false_assumption_pattern` and `inference_shape` and nothing else.

Three consequences:

1. **The dimension carries no information** the CML's own method field does not already carry.
2. **Three of its six values — `physical_trace`, `identity_disambiguation`, `chemical_timing` — cannot
   be emitted at all.** The 480-cell space was at most 240, and the rest was unreachable by
   construction rather than unwritten by the genre.
3. **It is not addressable.** The fingerprint vocabulary has six shapes; `schema/cml_2_0.schema.yaml`
   allows Agent 3 four methods, and the two sets **share no value**. An instruction to generate into a
   `physical_trace` cell has no word Agent 3 could write to comply. This is A_78 §5's "three mechanism
   vocabularies" one field over.

**So the `physical_trace = 0` finding was real and its cause was not the classifier.** *The Red Thumb
Mark* is filed `behavioral_tell` because its CML method is `trap` and the table sends every `trap`
there. No classifier judged it. The remedy the first draft proposed — audit the classify prompt, £0 —
would have touched nothing, because classify does not write that field.

### 9.2 A retired work was still voting

While re-running the map, `the_leak` appeared as the source of a morph route. It had been moved to
`library/retired/` by A_98 as a stub with no obtainable source text — and was never added to
`corpus-sync-fingerprints.mjs`'s `RETIRED` set, so the legacy baseline kept carrying it forward. It was
supplying the ledger's **only** occupant of `identity | information_leak`, and the first draft counted
that cell as a form the genre uses.

Fixed; the ledger is 47 → 46 fingerprints, observed cells 26 → 25, canon-not-us 23 → 22.

### 9.3 What changed, and what did not

| | first draft (3-D) | corrected (2-D) |
|---|---|---|
| space | 480 cells | **80** |
| occupied | 34 (7.1%) | **25 (31%)** |
| genre reaches (Chao1) | 244 [87, 870] | **65.5 [37, 166]** |
| encodes for 80% | +467 — *exceeds the pool* | **+110 — we hold 109** |
| headline | the map is out of reach | **the map is one batch away, and the batch is on disk** |

**The claim in the abstract did not change.** The morph operation, the three-layer argument, the
channels, and every verdict in §3 stand. What changed is the size of the problem — from "not
achievable from the public domain at any budget" to "£12 and no new acquisition."

### 9.4 How it was found, and the rule

It was found by being asked *what is the difference between 2-D and 3-D for us* — a question about
meaning, not about code — and answering it by reading the two schemas side by side instead of
restating the numbers. The first draft had computed extensively on a dimension it had never checked
was independent or expressible.

> **A dimension is not a dimension until you have checked that it varies independently and that the
> generator has a word for it.** Counting cells in a space where half the coordinates cannot be
> spoken produces a confident number about nothing, and the number was alarming enough to have
> redirected a week of work.

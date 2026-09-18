# WP-003 — INSPIRATION WITHOUT COPYING

**How the reference corpus can give the generator ideas rather than prohibitions, which of the seven
ideas on the table actually reach a prompt today, and whether 169 works is enough for any of them.**
2026-09-18 · every figure MEASURED from the live `dist` build, `library/manifest.json`,
`packages/novelty/data/seed-fingerprints.yaml` and `data/novelty-ledger.json` unless labelled
otherwise · prior art in A_77 §7, A_78 §7–8, A_79 §4/§11/§14

---

## ABSTRACT

The corpus is now 169 public-domain works, 12.3M words, 60 encoded cases and 47 novelty fingerprints.
The owner's question is whether the generator can take an *idea* from it and turn that idea into
something original — without copying. This paper reviews every proposal made for that in A_77, A_78,
A_79 and this week's work, measures which ones reach a model today, and answers the second question
underneath the first: is the corpus big enough for the idea to work at all.

**The claim.**

> **The reusable asset in detective fiction is the *shape of the deception*, and a shape cannot be
> plagiarised. The right operation is not "be inspired by this book" but "take this book's shape,
> change exactly one dimension of it, and land in a cell no book occupies."** That operation is an
> obligation rather than a prohibition, it is built from attested parts, it is novel by construction,
> and the only thing that crosses from the corpus into the prompt is a five-field abstraction plus a
> worked structural example the model is told is *"STRUCTURES, not material."* The verbatim text
> never reaches a prompt, and the anti-copy gate — on, and a hard fail, at n=11 with a measured 0.0%
> false-positive rate — is the guarantee that it never leaks out the other end.
>
> **The corpus is big enough in words and not big enough in shapes.** 165 texts is seventeen times
> the calibration sample the register work was built on. But the 44 encoded fingerprints on the five
> usable axes occupy **34 of 480 structural cells (7.1%)**, are **45% one axis and 52% one test
> shape**, and are still adding **0.67 new cells per encode and falling**. At that rate, encoding
> every work we hold reaches roughly a fifth of the map. "Empty" cannot yet mean "novel"; it mostly
> means "not encoded yet." The fix is not more volume. It is spread — and a classifier that can be
> trusted to say which cell a book is in, which today it cannot (§5.4).

Stated so it can be wrong: **one run, no reader needed.** Give Agent 3 a morph obligation into a cell
the canon occupies and we never have (§4.2, tier *canon-not-us*), and read the CML it produces with
the fingerprint extractor. The fingerprint should land in the assigned cell **and** Agent 8 should
judge it `distinct` against all 47 seeds. If it lands in `identity × impersonation` anyway — the
corpus's centre of mass — the obligation is being ignored and the lever is dead. That is settled at
the CML stage for the cost of one Agent 3 call.

**The measurements that decide the ordering** (§2, §5):

| what the idea needs | what the corpus holds |
|---|---|
| a worked exemplar block per axis | **live**, 3 examples per axis, 4,314–4,872 chars — except `authority`, **1 example, 1,609 chars** |
| corpus-derived device patterns in Agent 3b's cut | **live**: 50 patterns, 39 from the corpus, and **2 of the top 4 on every axis** are corpus-derived (after the A_79 §14.3 allowlist fix) |
| a map of what the genre has done | **34 of 480** three-dimension cells; **26 of 80** axis×family cells |
| cells the genre uses and we never have | **23** of 80 — A_79's "most valuable list" — computable for the first time |
| fingerprints that tell two books apart | at axis×family, **25 of 44 seeds are indistinguishable**; at full five fields, **one pair is identical** |
| a classifier that puts the forged-fingerprint novel in `physical_trace` | *The Red Thumb Mark* is filed `identity · alibi_fabrication · behavioral_tell` — wrong on all three against the intent it was acquired for; `physical_trace` has **zero** attestations |
| calibration texture | 12.3M words, more than enough — and **zero consumers** |

Sections 1–2 say what the corpus is for and what actually reaches a model. Section 3 reviews the seven
ideas with a verdict each. Section 4 is the operation this paper recommends, stated precisely enough to
build. Section 5 answers "big enough" per job with the numbers. Section 6 is what not to do, with the
receipt for each. Section 7 is the plan, costed.

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
| **Agent 8 — novelty judge** | `seed-fingerprints.yaml` | **live**, 47 fingerprints | a similarity verdict — a prohibition, not an idea |
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
**Status.** Built to shadow. The corpus feed flag is on. Nothing is applied to any input.
**What it gives.** An **obligation**: not "avoid these" but "go here." A_79 §4's three tiers, now
computed against 44 corpus seeds and the 121-run ledger on the 5×16 axis×family grid:

| tier | cells | meaning |
|---|---|---|
| occupied by both | 3 | done by the genre and by us |
| **canon only** | **23** | *a form the genre uses and we have never attempted* |
| us only | 8 | our own habits — 5 of 24 classifiable runs are `temporal × locked_room_timing` |
| neither | 46 | unwritten, or unwritten for a reason |

(**Caveat, MEASURED:** only 24 of the 121 shipped runs record a mechanism family — A_79 §4's "97 of
102 carry no `mechanismFamily`" is still true — so the *us* side of that table is a quarter of our
history. The 23 is a floor on canon-only cells, not a ceiling.)

**Limit.** Three, and §5 is about them: the map is 7.1% occupied, it is lopsided, and the classifier
that places a book in a cell is not yet reliable. A cell that is empty because *the classifier
missed* is not a novel cell.
**Verdict.** This is the idea. It is not ready to be switched on, for reasons that are measurable and
fixable, and §4 narrows it to the version that is.

### 3.5 The morph — *"take an attested shape and change one dimension"*

**Source.** This week, as the concrete form of 3.4.
**What it gives.** The answer to "inspired by, not copying" in one sentence: *start from a real book's
shape, keep it on two dimensions, change the third, and require the destination to be a cell nobody
has written.* MEASURED: **283 empty cells are reachable by changing exactly one dimension of an
attested work.** A worked instance:

> **`authority · secret_will_inheritance · physical_trace`** — one step from *The Leavenworth Case*.
> Same axis, same mechanism family, but the truth is forced by a physical trace instead of a
> reconstruction. Every part attested; the combination unoccupied.

And a second, which shows why the three AMBER structure-only works earn their place:

> **`temporal · poison_delayed · physical_trace`** — one step from *The Mysterious Affair at Styles*,
> whose chemical-timing test becomes a physical one. Styles contributes its shape and nothing else,
> because its shape is all we hold — which is precisely the layer that is safe.

**Limit.** The obvious ranking is backwards. Ranking empty cells by *how many attested neighbours*
they have returned ten cells that were all `identity · … · reconstruction` — the corpus's centre of
mass, the least original place to go. Ranking by *distance from* the centre of mass (sum of the
frequencies of the cell's three values) produced the two candidates above. The metric has to be
chosen for originality, not for reachability.
**Verdict.** Build this, as §4 specifies. It is 3.4 with a source, a direction, and a distance
metric.

### 3.6 Calibration — *"what does period detective fiction sound like"*

**Source.** A_77 §7.1 (the third corpus), A_79 Phase E, recomputed in A_97 over 165 works.
**Status.** Computed. **Read by nothing.** `grep` for `library/calibration` in `apps/` and `packages/`
returns zero files.
**What it gives.** Texture, not ideas — and the A_97 recompute moved the targets: the mean-sentence gap
is now exactly 0.00, the em-dash gap widened to −7.64, the semicolon target was 32% too high.
**Verdict.** Not an inspiration channel; a register instrument. Out of scope here except to record
that it is dead and that this paper does not fix it — that is WP-002/A_93 territory.

### 3.7 Bounded snippets as register anchors — *"≤25 words, attributed, behind a flag"*

**Source.** A_77 §7.2 permitted it, conditional on the anti-copy gate shipping first.
**Status.** Not built. The precondition — the gate — now exists and is on.
**What it gives.** Real period sentences near the generator, for register. It is the only proposal in
this list that moves *text* across the boundary.
**Verdict.** Do not build it yet, and not because of copyright — the gate handles that. Because it is
a register lever, not an idea lever, and because every measured register lever in this project
(VoiceSpec, the 19.5-word sentence, rate targets) was ignored by the model. A_75's rule stands: this
model complies with operations and ignores statistics. A snippet is neither. Recorded here so it is
not re-proposed as an inspiration mechanism.

---

## 4. THE OPERATION THIS PAPER RECOMMENDS

Stated precisely enough to build. It is 3.4 narrowed to 3.5, with the ranking corrected.

### 4.1 The cell space

Three of the five fingerprint fields are closed enums and define the addressable space:

```
axis                       5   temporal · spatial · identity · behavioral · authority
mechanism_family          16   the schema vocabulary (A_77 §9.2 says fourteen; it is sixteen)
discriminating_test_shape  6   physical_trace · timetable_contradiction · behavioral_tell ·
                               identity_disambiguation · reconstruction · chemical_timing
                         ---
                         480   cells
```

The other two fields — `false_assumption_pattern` and `inference_shape` — are free text and are what
make one book in a cell differ from another. They are not addressable and this operation does not
try to address them; they are what the model writes.

### 4.2 The morph, as an obligation

```
1. SOURCE   pick an attested work S at cell (a, f, t), preferring works on the thin axes
2. AXIS     choose one dimension d ∈ {axis, family, test} and a new value v for it
3. TARGET   the cell (a, f, t) with d := v must be tier NEITHER, or tier CANON-NOT-US
            (never tier US — that is repetition, and repetition-avoidance stays the first duty,
             as A_79 §11.2 built it)
4. RANK     among candidate targets, prefer the one FURTHEST from the corpus centre of mass:
            score = freq(a') + freq(f') + freq(t'), lower is better
5. HAND     Agent 3 receives:  the worked example of S (3.1, already built),
            the obligation "same shape on <the two unchanged dimensions>; <d> is now <v>",
            and the existing "STRUCTURES, not material" instruction
6. CHECK    extract the fingerprint from the produced CML; it must land in the target cell
            (this is the one-run falsifier in the abstract)
7. GUARD    the anti-copy gate, unchanged, at the output
```

Step 3's exclusion of tier *us* is what makes this an idea engine rather than a repetition engine. Step
4 is the correction from §3.5. Step 6 is what turns it from a hope into a measurement.

### 4.3 Why this is not copying

Three reasons, each of which would hold alone:

- **What crosses is five words and a paragraph of structure**, not a sentence of the book. The
  exemplar block is a summary of a plot's *logic*, in our words, with the instruction not to reuse a
  mechanism, setting or phrase. Plot logic is not protected expression; A_77 §8.4 records the owner's
  decision to apply the sourcing rule to the *work* anyway, which is why only cleared works are in the
  library at all.
- **The destination is, by construction, a shape no book in the corpus has.** The output cannot be a
  copy of S; it differs from S on a dimension S's author did not use.
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

Not one question. A_77 §7.1 said the corpus is three corpora with three sizes that matter, and the
honest answer is different for each.

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
| **authority** | **1** | **1 selected, 1,609 chars** |

Two batches, 55 encodes, and `authority` moved from 0 to 1. Both batches were chosen shortest-first,
which selects for length, not axis. The corpus is not short of authority *books* — A_77 §15.1 named
Post, Freeman, Van Dine and Bentley for it, and *Trent's Last Case* is on disk as structure — it is
short of authority *encodes*, and encoding does not know a book's axis until it has read it.

### 5.3 For the cell map — no, and volume alone will not get there

| measure | value |
|---|---|
| 3-D cells occupied | **34 of 480 (7.1%)** |
| axis×family cells occupied | 26 of 80 |
| seeds on one axis (`identity`) | 45% |
| seeds on one test shape (`reconstruction`) | 52% |
| seeds indistinguishable at axis×family | 25 of 44 |
| seeds indistinguishable at full five fields | 2 (one identical pair) |
| the most crowded 3-D cell | `identity · impersonation · timetable_contradiction`, **5 works** |

And the rate the map is growing, by rarefaction over the 44 seeds (400 random subsamples at each n):

| seeds | distinct 3-D cells | new cells per added seed |
|---|---|---|
| 10 | 9.3 | 0.88 |
| 20 | 17.2 | 0.78 |
| 30 | 24.4 | 0.70 |
| 44 | 34.0 | **0.67** |

**INFERRED from that curve:** encoding the remaining 109 works at the same skew adds roughly 60–65
cells and reaches about **95–100 of 480, a fifth of the map.** Acquiring and encoding all 349 GREEN
candidates does not change the shape of the answer, because the deceleration is a property of the
selection, not of the pool: shortest-first keeps landing in `identity · impersonation`.

So at today's occupancy an empty cell is weak evidence about the genre. It is strong evidence about
*us* — which is why §4.2 targets tier *canon-not-us* as well as *neither*. The 23 canon-only cells are
real: each holds at least one book that proves the form carries a novel, and none holds one of ours.
That list needs no more corpus to be useful. The *neither* list does.

### 5.4 For the classifier — not yet, and this is the one that blocks the others

The cell map is only as good as the function that assigns a book to a cell. Three measurements say it
is not good enough yet:

1. **`physical_trace` has zero attestations across 44 seeds.** *The Red Thumb Mark* was acquired by
   name as the physical-trace exemplar — A_77 §15.1: *"a forged fingerprint: the era's gold-standard
   proof, faked. Authority axis with a `physical_trace` test."* It is classified
   `identity · alibi_fabrication · behavioral_tell`: wrong on all three dimensions against the stated
   intent. It also failed the evidence gate at 56% anchor coverage, so it is not in the ledger at all.
2. **Re-classifying 22 unchanged cases changed 2 of them** (A_97 batch two, by accident). Same
   instrument, same input, a different family ~9% of the time.
3. **Two novels twenty-two years apart share an identical five-field fingerprint** (Orczy 1908, Hume
   1886). The vocabulary collapses distinct books at one end and mislabels distinct shapes at the
   other.

An empty cell can mean the classifier missed. Until the test-shape dimension is audited against the
dozen works acquired as named exemplars, the third axis of the map should be read as approximate.

### 5.5 Verdict

| job | big enough? | the actual constraint |
|---|---|---|
| calibration | **yes** | nothing consumes it |
| exemplars | **3 of 5 axes** | selection: two batches chose by length, not axis |
| divergence | **marginal** | 47 seeds and already one exact collision; 25 of 44 alias at axis×family |
| cell map | **no** | skew and classifier, not count; volume at current skew plateaus near 20% |

**The corpus is big enough in words and not big enough in shapes, and the shortfall is not fixed by
size.** It is fixed by (a) choosing what to encode for spread, which costs the same per book as
choosing by length, and (b) a classifier whose third dimension can be trusted, which costs an audit.

---

## 6. WHAT NOT TO DO — WITH THE RECEIPT

- **Do not rank empty cells by neighbour count.** Receipt: it returned ten `identity · … ·
  reconstruction` cells, the centre of mass. §3.5.
- **Do not read "empty" as "novel" at 7% occupancy.** Receipt: the rarefaction curve; and *Red Thumb
  Mark* sits in the wrong cell, so at least one "empty" cell is a misfiling. §5.3–5.4.
- **Do not promote the scheduler past shadow before its own negative control.** Receipt: its header
  — *"if a scheduled `epistemic × poison_delayed` case scores the same as the clock cases, that is
  the most useful result available"* — and A_79 §4 asked for it before promotion. Not yet run.
- **Do not buy another shortest-first batch for this purpose.** Receipt: two batches, 55 encodes,
  `authority` 0 → 1, `temporal` 1 → 4. Cheap-first is the right batch for entry count (A_97 batch
  two hit 60 entries for £3) and the wrong batch for coverage.
- **Do not count "loaded" as "reached."** Receipt: A_79 §14.3 — nine patterns loaded, zero bytes of
  any prompt changed, found only by a paid run. Verify by agent label in `llm-prompts-full.jsonl`.
- **Do not build snippets as an inspiration channel.** Receipt: §3.7 — it is a register lever, and
  every measured register lever was ignored. The gate makes it *safe*; nothing makes it *work*.
- **Do not assume fingerprints are unique.** Receipt: the novelty invariant that broke this week
  asserted `nearest === self` and was pinned to that assumption; it now allows an identical twin.
  More collisions will come with more encodes.
- **Do not let the corpus supply ideas about the four things it cannot.** Receipt: A_77 §7.2's rule
  and §4.4 — a premise operation does not touch prose, dialogue, pacing or character, which are where
  the missing marks are (WP-001 §1).

---

## 7. THE PLAN, ORDERED AND COSTED

Cheapest and most decisive first. Nothing below needs a reader; three of the five need no paid call.

| # | step | cost | what it settles |
|---|---|---|---|
| 0 | **Ship the cell map** as `library/index/cells.json` — the derived artifact A_77 §10.7 named and nobody built, with all three tiers and the distance-ranked morph candidates. `--check` in `corpus:check`. | £0 | The 23 canon-only cells and 283 reachable empties become inspectable and regenerable instead of living in scratch scripts. |
| 1 | **Audit test-shape assignment** against the ~12 works A_77 §15.1 acquired as named exemplars. If *Red Thumb Mark* is representative, fix the classify prompt for `discriminating_test_shape` before trusting the third dimension. | £0 to read; ~£0.05 to re-classify | Whether the cell map's third axis is real. This gates everything after it. |
| 2 | **One spread-targeted encode batch**, ~12 works chosen from §15.1's *Fills* column for `authority` and `temporal` — Post, Freeman's *Osiris* re-check, the remaining Van Dine, *Trent* if it clears on 1 Jan 2027 — not by length. | ~£1.50 | `authority` to ≥3 exemplars; the thin end of the map. |
| 3 | **The falsifier.** One run with the scheduler on and a §4.2 morph obligation into a canon-not-us cell. Read the CML with the extractor. Verify the obligation reached Agent 3 by its label in `llm-prompts-full.jsonl`. | ~£1.15 for the run; the CML stage alone is pennies if a partial run is possible | Whether Agent 3 obeys a cell obligation at all. If it lands in `identity × impersonation` anyway, stop. |
| 4 | **Then and only then** a matched pair (`RESUME_REDO=prose` on the same upstream) and a read. | ~£0.45 + a reader | Whether a better premise moves a mark. Per A_96, not before step 3 has a number. |

Step 3 is the whole paper in one run: the prediction in the abstract is its pass condition. Steps 0–2
are there so that when it runs, the cell it was sent to was chosen from a map that means something.

---

## APPENDIX — HOW THE NUMBERS WERE PRODUCED

All from the live `dist` build on 2026-09-18, after commits `4b53461c` (60 entries) and `f7a0ef17`
(one corpus home). Transient probe scripts; step 0 above makes the cell computations durable.

- **Channels (§2):** `loadSeedCMLFiles` + `extractStructuralPatterns` + `selectRelevantPatterns` +
  `formatPatternsForPrompt` per axis; `loadPatterns` + `retrievePatterns({decade:1920,
  primaryAxis})` with `DEVICE_LIBRARY_INCLUDE_CORPUS=true`; `loadSeedFingerprints`; grep for
  `library/calibration` in `apps/` and `packages/`.
- **Cell map (§5.3):** 44 seeds on the five usable axes from `seed-fingerprints.yaml`, keyed on
  `axis|mechanism_family|discriminating_test_shape`; adjacency = one-dimension change; distance = sum
  of value frequencies; rarefaction = 400 seeded random subsamples per n.
- **Three tiers (§3.4):** the same 44 against `data/novelty-ledger.json` (`shipped`, 121 records, 24
  with a mechanism family), on the 5×16 grid.
- **Classifier (§5.4):** `library/works/the_red_thumb_mark/fingerprint.yaml`;
  `library/works/.verification.json`; A_97 batch two's classify diff.
- **Costs (§7):** A_97 batch two, £2.87 for 31 attempts, 26 valid, £0.1104 per usable case.

One probe defect is recorded because it is the recurring shape: the first retrieval probe reported
**zero corpus patterns retrieved on every axis**, and the first ledger probe reported **two records**.
Both were wrong about the probe — a guessed function signature and a guessed file shape — and both
were caught only because a zero from a script one has just written is a claim about the script.

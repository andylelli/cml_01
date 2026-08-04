# Story Geometry — what the term means, and what it would do here

**Written:** 2026-08-03 · **Companion to:** [THINK_01](THINK_01.md), which identified the missing layer but did not define it. This document defines it, grounds it in the narratology it borrows from, and answers the design question: *should there be a Story Geometry agent?*

**Short answer to that question: yes — as a compiler with a gate, not as another creative writer.** The economics are in [§7](#7-does-it-pay-for-itself), and they are measured, not assumed: **53.9% of generation-side spend on the 08-02 run was repair.**

---

## 1. First, an honest disclaimer about the term

**"Story geometry" is not a term of art in narratology.** Nobody will hand you a paper on it. It is our coinage, and if we use it we should know exactly what we are borrowing.

What *does* exist is a century of formal work on the question underneath it — **how the events of a story relate to the arrangement in which they are told** — and the geometric metaphor has real precedent: Freytag's *Pyramid* (1863) is literally a diagram of dramatic structure; Vonnegut famously proposed that stories have graphable *shapes*, an idea later given empirical form by Reagan, Mitchell, Kiley, Danforth & Dodds, *The emotional arcs of stories are dominated by six basic shapes* (2016).

But those are about **emotional contour over time**. What we need is stricter and less poetic: a set of **positional and multiplicity constraints** on where things appear in a manuscript. That is closer to grammar than to geometry. We keep the word because "shape of the finished thing" is the right intuition — but the content below is formal, not metaphorical.

---

## 2. The academic lineage that actually applies

### 2.1 Fabula and syuzhet — and why detective fiction is the paradigm case

Russian Formalism (Shklovsky, Tomashevsky, Propp; 1920s) split narrative in two:

- **fabula** — the events, in chronological and causal order. What happened.
- **syuzhet** — the arrangement in which those events are presented to a reader. How it is told.

Chatman later gave the same distinction its English formulation as **story** and **discourse** (*Story and Discourse*, 1978).

**Tzvetan Todorov made the detective story the exemplary case** (*The Typology of Detective Fiction*, 1966). The whodunit, he argued, contains **two stories**: the story of *the crime*, which is absent from the page but complete and real; and the story of *the investigation*, which is present and whose entire function is to reconstruct the first.

That is our architecture, described fifty years early:

| Todorov | Us |
|---|---|
| The story of the crime (absent, complete, causal) | **the CML** — culprit, method, motive, timeline |
| The story of the investigation (present, ordered for effect) | **the manuscript** — 9–10 chapters of prose |

[ADR-0001](decisions/0001-cml-single-source-of-truth.md) already says "prose is a rendering of the model". Todorov's framing sharpens it: prose is not a rendering of the case, it is **a second story whose job is to make the first one reconstructable by the reader**. Those are different obligations, and we have been building for the first one.

### 2.2 Genette: order and frequency

Gérard Genette (*Narrative Discourse*, 1972) gave the fabula→syuzhet mapping its analytic vocabulary. Two of his categories are precisely our failure modes:

- **Order** — the relation between event sequence and narrative sequence, and the *anachronies* (analepsis, prolepsis) that deviate from it. A mystery's central deception is almost always an order deception. **Our "three clock times" defect is an order defect**: `the_clock_s_deception` put 8:50, 10:15 and 11:10 on the page with no stated relation, so the reader cannot build a single fabula from the syuzhet. The reviewer's phrasing — *"the draft cannot use 8:50, 10:15, and 11:10 without explaining how they relate"* — is a Genettian complaint verbatim.
- **Frequency** — how many times an event is narrated relative to how many times it occurred. Genette's *repeating* narration tells n times what happened once, and it needs motivation (a new perspective, new information, irony). **"Chapter 10 repeats Chapter 9" is a frequency defect in the exact technical sense**: unmotivated repeating narration of a single event.

Two of the five complaints that appear in **every** external review turn out to be named categories in a 1972 monograph. That is worth knowing before we invent our own taxonomy.

### 2.3 Barthes: the hermeneutic code

In *S/Z* (1970) Roland Barthes read a novella through five codes. One is the **hermeneutic code** — everything by which an enigma is *posed, sustained, and resolved*. He breaks it into roughly ten "morphemes", and the list reads like a mystery-writer's schedule: thematization, proposal of the enigma, formulation, promise of an answer, **snare** (deliberate false lead), equivocation, jamming, **suspended answer**, **partial answer**, **disclosure**.

Our red herrings are Barthes' *snares*. Our false solution is *equivocation*. And this is the sharpest diagnosis available of what went wrong on 08-02:

> `the_clock_s_deception` ends on **suspended answer** — *"the truth poised to emerge in the hours ahead"* — where the geometry required **disclosure**.

The chapter was titled *"The Culprit Revealed"*. It performed the wrong hermeneutic morpheme. Nothing in fourteen stages could tell the difference, because we have never written down that the final chapter owes a *disclosure* rather than a *delay*.

### 2.4 Propp and story grammars — including why they failed

Vladimir Propp (*Morphology of the Folktale*, 1928) showed a genre could be specified as a **fixed sequence of functions** filled by role-bearing characters — the first demonstration that narrative admits formal specification at all. That programme became the **story grammars** of the 1970s (Rumelhart 1975; Thorndyke 1977; Mandler & Johnson 1977): rewrite rules that generate well-formed stories the way a phrase-structure grammar generates sentences.

**And they were substantially discredited** — Black & Wilensky's *An Evaluation of Story Grammars* (1979) argued they simultaneously over-generate (they license texts nobody would call stories) and under-explain (they model neither comprehension nor quality).

**That critique is the most important thing in this document**, because it is the failure mode we would be walking into. A grammar that says "chapter 7 shall contain a discriminating test" produces something that satisfies the rule and reads like a form. **We already have direct evidence of this**: our deterministic injectors are miniature story-grammar productions, and they are complaint #1 in every external review — *"Sylvia, being the victim, obviously couldn't have been involved."*

**The lesson we take: geometry constrains *what must be true of the manuscript*, never *what sentence to write*.** It is a specification and a test, not a generator. Where a constraint is unmet the answer is regenerate-with-feedback, never paste.

### 2.5 The genre already wrote its own spec

Worth remembering that detective fiction is the one genre whose practitioners published formal constraint systems:

- **S. S. Van Dine, "Twenty Rules for Writing Detective Stories"** (1928) — the culprit must be a prominent character; the crime must be solvable by logical deduction; no accident or unaccountable intuition.
- **Ronald Knox, the "Decalogue"** (1929) — the culprit must be mentioned early; no clue may be concealed from the reader that the detective knows.

These are *machine-checkable rules*, written by hand, a century ago, and our fair-play validators already implement several. **Story geometry is not a novel idea for this genre. It is the genre's own idea, unfinished.**

---

## 3. Our definition

> **Story geometry is the constraint set governing the mapping from case model to manuscript: what must appear, where, how often, and what must never recur.**

It sits in a three-layer stack, and the middle layer is the one nothing owns:

| Layer | Formal name | Question it answers | Owned by |
|---|---|---|---|
| **Case logic** | fabula | Is the mystery sound and fair? | CML, Agents 3–6. Modelled, gated, repaired. |
| **Story geometry** | fabula → syuzhet mapping | Does the manuscript let a reader reconstruct the case, and does it deliver the enigma on schedule? | **nothing** |
| **Prose texture** | style / discourse | Do the sentences read well? | Agent 9's prompt and the polish pass. Not rule-governed, and should not be. |

The distinction that matters: **a case can be perfectly sound and the story still fail.** `the_clock_s_deception` had a sound CML, passed every binding gate, scored 73 on the internal rubric, and never named its culprit. Every one of the five complaints that appear in all external reviews lives in the middle row.

---

## 4. Read against our own two stories

The 08-02 pair, diagnosed in geometric terms:

| Defect (reviewer's words) | Formal category | Geometry constraint that would have caught it |
|---|---|---|
| *"the clock begins at ten to nine… later ten past eleven… then a quarter past ten"* | Genette, **order** | `time_model` closed at exactly two times |
| *"Chapter 9 only points toward Hugo"* / *"the truth poised to emerge"* | Barthes, **suspended answer** where **disclosure** was due | `chapter_contract`: reveal chapter must contain culprit + method + motive + proof |
| *"Chapter 10 repeats Chapter 9"* | Genette, **unmotivated repeating narration** | `chapter_contract`: aftermath must *not* contain reveal elements |
| *"the murder method disappears… the candlestick never returns"* | plant→payoff break on the method | `method_signature` planted in chapter 1, cited in reveal |
| *"add one physical match: torn fabric to Hugo's cuff"* (asked in **both** reviews) | missing **clincher** | `clincher`: one trace unique to the culprit, planted ≤ ch3, produced at disclosure |
| *"Chapter 6 accuses Hale, but Hale is guilty"* | **equivocation** aimed at the wrong target | `false_solution.accused ≠ culprit` |
| *"the clearances are logical but too mechanical"* | register leak from the injector layer | `clearance_budget` + in-scene requirement |

Seven distinct complaints across two stories. **All seven are positional or multiplicity constraints.** Not one is a sentence-quality problem.

---

## 5. The artefact

A `StoryGeometry` object, derived after the outline and **binding on prose**. Every field traces to evidence above, and every field is machine-checkable both against the outline (before spending prose tokens) and against the manuscript (after).

```
StoryGeometry {
  time_model      { true_time, apparent_time }        // the manuscript may contain no third time
  clincher        { trace, unique_to: culprit,        // the physical fact only the culprit could leave
                    plant_by_chapter, payoff_chapter }
  method_signature[ { evidence, plant_chapter: 1 } ]  // bruising for strangulation; wound-match for a candlestick
  chapter_contract[ { chapter, role, must_contain[], must_not_contain[] } ]
  false_solution  { accused ≠ culprit, proposed_chapter, collapse_chapter }
  clearance_budget{ max_sentences, in_scene: true }
}
```

**Three fields from the first draft of this list were removed on audit** (2026-08-03), and the reasons matter more than the fields:

- **`plant_schedule`** — `@cml/beat-scheduler` already owns it (`plant_clue { id, revealScene }` plus a `checkPlantBeforeReveal` invariant). Geometry **consumes** the grid; it must not re-derive it. See [GEOMETRY-AGENT-DESIGN §4.3](GEOMETRY-AGENT-DESIGN.md).
- **`hermeneutic`** — Barthes' vocabulary is the right *diagnostic* lens (§2.3) but not an independent constraint: everything enforceable in it is already expressed by `chapter_contract` plus the grid's ordering. Keeping it would have been formalism for its own sake.
- **`frequency_rule`** — subsumed by `chapter_contract.must_not_contain`, which is the *enforceable* form of "do not narrate this event again".

**And one correction to §5's framing.** `time_model` was originally justified as "the case model has no cardinality constraint". That is **wrong**: the CML already requires exactly two times (`actual_time_of_death` / `apparent_time_of_death`) and `timeline-deception.ts` already checks their direction. The real gap is that **nothing binds the manuscript to the model's two times** — the locked-fact layer enforces *presence* of a value (by injecting it) and never *exclusivity*. The constraint is therefore about the manuscript, not the case.

Two properties make this safe against the Black & Wilensky critique:

1. **It says nothing about sentences.** No template, no required phrasing, no injected text. It constrains the *contents* of a chapter, never its wording.
2. **It is falsifiable before it is expensive.** Every field can be checked against the outline for free, before a single prose token is spent.

---

## 6. We would not be building from zero

Several geometry constraints already exist — as scattered, individually-flagged, partially-implemented features:

| Existing | What it covers | Gap |
|---|---|---|
| `AGENT7_PLANT_BEFORE_REVEAL` (ON) | Stamps `cluesPlanted` on a scene ≥2 before a clue's reveal | **Clues only** — not the method, not the clincher |
| `AGENT7_DISCOVERY_TELL` (ON) | Body-discovery scene must reference a cause-of-death tell | One beat, hard-coded |
| Aftermath stage classifier (A_67) | Final chapter becomes aftermath when an earlier chapter revealed | Beat-shaped heuristic, not a contract |
| `enforceSuspectEliminationPresence` | Guarantees clearances exist | Guarantees *presence*, which is why they read as a register |
| Fair-play coverage (Agent 6) | Knox/Van Dine-style clue availability | Fabula-level; says nothing about position in the manuscript |
| `@cml/beat-scheduler` | Scene grid: obligations, ordering, **plant→payoff**, ≥60% clue-bearing — all by construction | Pure, tested, **not wired in**; shadow-only |
| `@cml/clue-spec` | The clue slots the CML *requires*, derived not policed | Pure, tested, **not wired in**; shadow-only |
| `timeline-deception.ts` | The directional invariant for false-time tricks | Pure, tested, exported, **called by nothing** |

**That last block is the real finding of this whole line of work.** Three deterministic checkers, each built in response to a real defect, each correct — and none of them connected to a run. The project's problem is not that it cannot identify the right constraints. It is that constraints get built and never wired, while the *one* integration mechanism that is wired — the locked-fact layer — discharges obligations by **injecting text**, which is external complaint #1 in every review.

**Story geometry is the unification of these into one object with one gate**, plus the fields nobody has built (`time_model`, `clincher`, `method_signature`, `chapter_contract`). Framing it as consolidation rather than invention also lowers the risk: most of the individual pieces already work.

---

## 7. Does it pay for itself?

The brief's hypothesis was that more pre-prose work would *reduce* total tokens by making prose succeed first time. **The data supports it, and more strongly than expected.**

Measured on the two 08-02 runs, from real token counts:

| | run 1810 (ext **80**) | run 1936 (ext **68**) |
|---|---|---|
| Chapters | 10 | 9 |
| Generation calls | 14 | 14 |
| **Retries** | **4** | **5** |
| Regen calls | 9 | **16** |
| First-pass success | 71% | **64%** |

**On run 1936, 53.9% of all generation-side spend was repair** — retries plus regens, not first drafts.

Two things stand out:

**The retries cluster exactly where the geometry is missing.** Per-chapter generation attempts, run 1936: `1:1 2:1 3:2 4:1 5:1 6:1 7:1 8:3 9:3`. Chapters 1–7 are near one-shot. **The endgame takes three attempts each** — and the endgame is precisely the region THINK_01 identified as unspecified. The retry distribution *is* the geometry gap, measured independently.

**More repair correlates with a worse story, not a better one.** Run 1936 consumed 16 regens to run 1810's 9, and scored **12 points lower**. Repair is a symptom, not a cure — which is what you would expect if the defects come from under-specification rather than from a weak writer.

The economics follow from where the money is:

- Upstream agents (25 calls, all 13 pre-prose stages) cost **£0.03 total** — they run on the mini deployment.
- Prose generation costs **£0.53**; regens **£0.21**.
- **A geometry stage costs roughly £0.002. The repair it targets costs roughly £0.24 per run.**

So the stage does not need to be efficient. It needs only to work occasionally. **If it removes one generation retry per run it has paid for itself twenty times over**, and the quality case is stronger than the cost case anyway.

**Stated as a hypothesis, not a result** (this project's rule): *a binding geometry contract raises first-pass chapter success from ~64% toward ~90% and reduces regen volume by half.* The probe is one matched pair on a fixed premise, reading first-pass success rate, regen count, and generation-side cost. That probe is cheap and unambiguous — unlike a quality probe, it does not route through the judge that [THINK_01 §2](THINK_01.md) showed ranks at 42.9%.

---

## 8. Should there be a Story Geometry agent?

**Yes — but it should be a compiler, not an author.** Three design commitments:

**It mostly does not call an LLM.** Most of the object is *derivable*: the plant schedule is a graph over "first mention" versus "cited in reveal"; the chapter contract falls out of the outline's beat assignment; `time_model` closure is a set-cardinality check on the CML's temporal anchors; the frequency rule is a diff between chapters. Only two fields need judgement — **choosing the clincher** and **choosing whom the false solution accuses** — and those are one small call, on the cheap deployment, against a frozen CML.

**It gates.** Its output is a hard precondition for Agent 9. A geometry that cannot be closed is an *upstream* defect: fix the outline, not the prose. This is the pattern [ADR-0002](decisions/0002-sequential-prompt-chaining.md) already defends — "because the next stage is known, a gate between stages can hard-fail before spending money downstream" — and prose is the expensive stage that gate protects.

**It never writes text.** Where a constraint is unmet at manuscript level, the remedy is regenerate-with-feedback naming the missed obligation. No injectors. This is the Black & Wilensky lesson and the reviewers' complaint #1, and they are the same lesson.

Placement — a new stage between outline and prose:

```
… → Agent 6 (fair play) → Agent 6.5 (world) → Agent 7 (outline)
                                    ↓
                    Agent 8.5 — Story Geometry Compiler
                    derive · resolve 2 creative fields · GATE
                                    ↓
                              Agent 9 (prose)
                    geometry is an input, and the acceptance test
```

**On "more pre-prose agents":** the brief's instinct is right, and the constraint is not agent count — it is that **every pre-prose stage must produce something prose is contractually obliged to use**. The failure mode to avoid is a stage that emits advice. `worldDocument` and the character profiles are already large upstream artefacts whose influence on the finished page is hard to trace. Geometry earns its place only because it ships with a test: for each field there is a check that fails a chapter which ignores it.

---

## 9. Risks, and what would change my mind

- **Formalism stiffens the prose.** The real risk, and the one Black & Wilensky named. Mitigation: geometry constrains contents, never wording; it is checked, never pasted. **Watch the prose and dialogue marks** — if they fall while structure rises, the contract is leaking into the sentences and should be demoted to outline-time-only.
- **The gate becomes a new abort class.** An unclosable geometry would stop runs, which [ADR-0003](decisions/0003-never-abort-release-gate.md) forbids for repairable defects. Mitigation: the gate binds the *outline*, where repair is cheap and re-derivation is free; it must never abort a run that has already generated prose.
- **We formalize the wrong things.** Seven constraints derived from two reviews is a thin base. Mitigation: every field above traces to a complaint that appeared in **both** reads — but the next external read should be checked against this list before the list is treated as complete.
- **The clincher becomes formulaic.** Ten stories that all end with a torn cuff would be worse than what we have. Mitigation: the clincher is *typed and positioned* by geometry, but *chosen* by the model from the case's own physical world.

**What would change my mind entirely:** if a manually-authored geometry object, hand-written for one existing premise and fed to prose, does not raise first-pass chapter success — then the retries are not caused by under-specification, and the endgame failures are a capability limit rather than a specification gap. That experiment costs one run and should precede building the agent.

---

## 10. The one-paragraph version

Todorov observed in 1966 that a detective story is two stories: the crime, which is absent and complete, and the investigation, which is present and exists to let the reader rebuild the first. We have built the first with great care and left the mapping between them unspecified — so the model invents it, plausibly and differently every run, and the endgame chapters take three attempts each while the front of the book takes one. **Story geometry is that mapping, written down: exactly two times, one clincher planted early, the method's signature in chapter one, a reveal chapter that discloses and an aftermath chapter that does not repeat it.** It is Genette's *order* and *frequency*, Barthes' *disclosure*, and Knox's decalogue, expressed as fields a compiler can check before we spend a prose token. It should be an agent — a deterministic one with a gate and no prose — and on measured numbers it costs about £0.002 against £0.24 of repair it exists to prevent.

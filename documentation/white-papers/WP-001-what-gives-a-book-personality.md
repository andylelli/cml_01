# WP-001 — WHAT GIVES A BOOK PERSONALITY

**A lesion study, and a design kit.**
2026-09-13 · internal figures MEASURED from this project's archive · external claims cited in §9

---

## ABSTRACT

Criticism cannot isolate personality, because in human writing it never varies alone. This project
can. It has built a machine that produces mysteries which are fairly clued, structurally sound,
period-accurate, grammatical, and — read by strangers thirty-four times — **have never once been
called alive**. Prose has never been given a 9. Neither has dialogue, character, pacing, or the
opening. Premise has been given a 9 six times.

Everything else about these books is held constant while one variable is missing. That makes this the
rare case where the question in the title has an empirical answer rather than a tasteful one.

**The claim.**

> **Personality is the residue of unforced choice.** A book's personality is made entirely of
> decisions nothing required it to make. It follows that a system optimising for correctness will
> destroy personality without ever committing an error, and that personality cannot be installed by
> prohibition, by template, or by asking for a rate.

**The headline result, and the reason this paper is a tool rather than an essay.** Premise is the only
category that reaches 9 repeatedly — six of the twelve nines ever awarded — and premise is the only
stage in this pipeline whose architecture *forces* an unforced choice: it generates five divergent
candidates and picks between them. Independently,
and for entirely different reasons, that structure is the published state of the art for recovering
diversity from an aligned model: **Verbalized Sampling** (Zhang et al. 2025) raises creative-writing
diversity **1.6–2.1×** by asking for a distribution of candidates instead of an answer. This project
built it in one place, by accident, four years of reads ago, **and has never applied it anywhere
else.** Sections 6.1 and 8 say where to put it and what would falsify the claim that it is what is
working.

Sections 1–3 establish the claim. Section 4 gives the system-level mechanism — three pressures, each
of which is *correct engineering*. Section 5 reports four findings that invert the received wisdom.
Section 6 is the kit. Section 7 is what not to do, with receipts. Section 8 is the two-level causal
account: a training-level cause we cannot fix and can route around, and three system-level causes
that are ours.

---

## 1. THE LESION

Thirty-four external cold reads with a full ten-category table:

| category | mean | best ever | ever a 9? |
|---|---:|---:|---|
| prose | 7.0 | 8 | never |
| dialogue | 7.1 | 8 | never |
| character clarity | 7.9 | 8 | never |
| pacing | 7.9 | 8 | never |
| opening hook | 8.0 | 8 | never |
| **premise** | — | **9** | **six times** |
| atmosphere · ending | — | 9 | twice each |
| plot · clues | — | 9 | once each |

The five that are stuck are the five that carry personality.

**The reader's own account of the lesion is the tell.** Of forty prose notes across the ledger,
**thirty-eight are about absence** (A_75 §1). Readers do not say the sentences are bad. They say
there is nothing there. A 7 for prose is what a competent, characterless page scores, and it is
remarkably stable: the machine has sat at 7.0 for thirty-four reads while dozens of defects were
fixed underneath it.

An independent description of the same condition, from outside this project: models produce fiction
that reads *"like a plot synopsis — technically coherent, emotionally inert."*

---

## 2. THE CLAIM, AND FIVE PROBES OF IT

Every element in a book is either **forced** — required by plot, fairness, continuity, grammar,
genre — or **free**. Get a forced element wrong and the book is broken. Get every forced element right
and the book is *correct*. Personality lives entirely in the complement.

The prediction that makes this testable: a system optimising for correctness will not make *bad*
unforced choices. It will make **none**. Five probes, all MEASURED.

### 2.1 The individuating field does not individuate

`signatureTic` exists for one purpose — to give each character a line only they would say. Across
**377 archived tics** (A_91 §9.2):

| opening | count | share |
|---|---:|---:|
| "One must… / One mustn't… / One might…" | 85 | **23%** |
| "Let us… / Let's not…" | 42 | 11% |
| "Well, isn't…" | 16 | 4% |
| "Darling, …" | 16 | 4% |

79 of 377 are **literal duplicates across different books**. A third of every cast's supposedly unique
catchphrase comes from two constructions.

This is the claim's sharpest evidence. Asked directly to be distinctive, the system returns the
*modal* answer — because "the most distinctive-sounding thing" is itself a category with a most likely
member, and every character reaches for it. §8 gives the training-level reason this is not a
prompting failure but a prior.

### 2.2 Depth requires a field nobody thought to build

The working definition, testable as stated:

> **not depth** — *"Percival walked with a stoop."*
> **depth** — *"Percival had walked with a stoop ever since a carting accident at nine that almost
> cost him his life. He was bitter about the world of speed being taken away so young. Office work was
> all he was good for thereafter."*

Five parts: **TRAIT · ORIGIN as a dated event · COST · STANCE toward the cost · CONSEQUENCE still
running.** Across **378 characters in 62 profile artifacts** (A_91 §9.1):

| | |
|---|---:|
| past-time marker ("ever since", "as a child") | 11 — **3%** |
| concrete incident (accident, fire, dismissal, a death) | 57 — 15% |
| emotional stance (bitter, ashamed, never forgave) | 154 — 41% |
| **all three together** | **1 of 378 — 0%** |

The cause is one line of schema. Every field the character generator is asked for points at the
murder: `motiveSeed` mentions the case **54%** of the time, `personalStakeInCase` 54%, `privateSecret`
18%. **There is no field anywhere for a life before the case.** So a trait arrives with a *category*
as its stated cause — "his years of service", "a lifelong military man" — which is the *not depth*
half of the definition, dressed formally.

An unforced choice with nowhere to be recorded does not get made.

### 2.3 Fifteen books, one voice

Mean sentence length across fifteen manuscripts (A_75 §3):

```
mean across books      : 14.65 words
BETWEEN-book std dev   :  0.80 words
WITHIN-book  std dev   :  8.16 words
→ between-book variation is 10% of within-book variation
```

Every book this pipeline has produced is drawn from effectively **one distribution of sentences**.
Style cannot distinguish one book from another because style was never chosen.

Stated stylometrically, this is a strong claim: an authorship-attribution model would assign all
fifteen to a single author with near-certainty, and would be right. The published name for the
phenomenon is **narrative flattening** — post-training compresses thematic, affective and stylistic
variation, and *"stylistic diversity across stories shrinks"* while *"post-trained endpoints converge
across domains."* The literature measures it on continuations; the figure above measures it across
fifteen complete novels, which is a cleaner instance than the literature currently holds.

### 2.4 The unrequired, unchosen middle

Of the repeated six-word spans in three recent books, the share carrying a **locked-fact contract** —
values the prose is *required* to print verbatim — is 24%, 39% and 14%. The remaining **61–86% is
authored repetition with no contract behind it** (A_91 §2).

This is the claim's negative image: material that is neither forced nor decided. Given no requirement
and no commitment, generation defaults — and a default repeated across chapters is what a reader
experiences as a book with nothing on its mind.

### 2.5 What the readers asked for, three books running

- 79/100 — *"the motive is conceptually fine, but emotionally thin… add one scene where Bertram
  actively crushes Gwendolyn's work."*
- 82/100 — *"'He was destroying everything I cared for' is understandable, but generic. Give one
  concrete wound."*
- 87/100 — *"relationships still need more lived specificity."*

Three strangers, three books, one request — and it is a request for an **unforced choice**: a scene no
plot requirement asks for, about a wound no clue depends on (A_91 §5).

---

## 3. THE POSITIVE DEFINITION

Stated so it can be used rather than admired:

> **A book has personality to the degree that it contains material which serves no structural
> function and would be missed if removed.**

Both halves are load-bearing. Material that serves a function is doing a job, and the reader credits
the job, not the book. Material that would *not* be missed is padding. Personality is the narrow band
between: unnecessary, and irreplaceable.

**The test is destructive and cheap.** Remove any paragraph. If the plot survives and the book feels
thinner, that paragraph was personality. If the plot survives and nothing is lost, it was defaulted
text. If the plot breaks, it was structure. A book made entirely of paragraphs whose removal breaks
the plot has no personality at all — a precise description of what this pipeline produces, and a
runnable audit for any manuscript.

---

## 4. THE SYSTEM-LEVEL MECHANISM — THREE CORRECT DECISIONS THAT DESTROY IT

Personality does not die from bad engineering. It dies from three good decisions. These generalise
well beyond this codebase.

### 4.1 Instrumentation is negative, so quality cannot be optimised upward

Every prose signal this project owns is a **detector for something wrong** (A_75 Tier 1.3): machine
register, repetition density, template bleed, anachronism, leakage. There is no instrument whose
needle moves when a sentence is *good*, and no instruction in the prose contract whose output is a
good line.

A category instrumented entirely negatively can be driven to zero defects and cannot be driven
upward. You arrive, exactly as this project did, at **flawless and characterless** — and the reader,
having nothing to praise, correctly reports the only thing that varies: how many artifacts they
tripped over.

> **The general form.** Any quality you can only detect the absence of, you will optimise into
> absence.

§6.2 proposes the missing instrument, and §9 supplies external evidence that it correlates with
quality.

### 4.2 Under scarcity, a system sheds exactly what it labelled inessential

The humour machinery here is elaborate and correct: a 1,900-word guide with five named styles and
worked examples, nine per-character humour styles with levels, a scene-by-scene permission map,
humorous voice fragments — all built, all wired, populated on every run.

`humour_guide` was the **only block in the entire prose prompt carrying `priority: 'optional'`**, and
the budgeter's drop order is literally `["optional", "medium", "high"]`. Not one candidate among
several — the whole first tier. MEASURED across three runs (A_91 §4.2): present in **10 of 10
chapters** on one run, **0 of 10 on each of the next two**, while the craft guide beside it survived
because an earlier fix had promoted it.

Note what the priority field was recording. Everything that makes a book *right* is `critical` or
`high`. The thing that makes it *someone's* was `optional` — and that label was not careless. It was
accurate. Nothing breaks when the humour guide is gone.

> **The general form.** Personality is always what gets labelled inessential, because by definition
> nothing breaks when it is removed. It will therefore be the first thing any resource-constrained
> system discards, the system will be right to, and the book will be dead.

**The residue is worse than the deletion.** The per-chapter instruction *survives* the budget —
`Humour: dry wit — deploy occasionally (level 0.5)` reaches 7–8 of 10 chapters on runs where the guide
reaches none. **What is lost is the how; what remains is the demand.** A character told to be funny
with no model of what that looks like produces the specific awfulness of attempted wit.

### 4.3 The template ratchet

A_84 traced every "generated line" the external readers named, line by line. **All of them were our
own injectors** — deterministic templates added to guarantee a required element appeared:

- `TIME_VARIANTS` / `DURATION_VARIANTS`: *"It had taken … in all"* in 17 of 29 books, *"The clocks put
  it at"* in 15. **95 injections, 95 of 95 with the value already present verbatim elsewhere in the
  book.**
- `buildCulpritEvidenceSentenceInScene`: *"You did it … the proof on the table said the rest"* — six
  books, and in **6 of 6 it is the last line of the novel**. In 5 of the 6 a dramatised confession was
  already on the page; it failed a keyword regex, so the template fired over the top of it.

**Three of the six reviewer-named lines were themselves fixes for earlier reviewer-named lines.**

> **The general form.** A line guaranteed to be adequate is a line that recurs, and a line that
> recurs is the next flatness complaint. Fixing flatness by adding a template converges on flatness.
> The ratchet turns one way, because each template is added in response to real evidence.

---

## 5. FOUR FINDINGS THAT INVERT THE RECEIVED WISDOM

Each contradicts a widely held belief about machine prose. Each is measured against **720,000 words of
period canon** (A_79 §13).

### 5.1 Machine prose is over-oriented, not vague

The standard diagnosis is that generated writing is unspecific. Measured on what the *first sentence
does*:

| the opening… | canon | ours |
|---|---:|---:|
| names a person | 75% | **98.5%** |
| states a place | 25% | **63.2%** |
| states a time | 16.7% | **40.2%** |

**We front-load more orientation than the canon, not less.** The machine tells you who, where and when
because those are the questions it can be certain it has answered.

This has an exact external counterpart. Measured over 28 models against professional fiction,
pointwise mutual information is *uniformly negative* (−1.44 to −2.60), which the authors read as
models **over-relying on immediate context**. Over-orientation is that tendency made visible at the
scale of a paragraph. Personality includes the confidence to leave a reader briefly lost.

### 5.2 Personality lives in the tail, not the mean

| | canon | ours | gap |
|---|---:|---:|---:|
| mean sentence words | 16.09 | 14.89 | −1.20 |
| median sentence words | 13.11 | 13.38 | **+0.27** |
| **p90 sentence words** | **31.02** | **25.63** | **−5.39** |
| sentences over 30 words | 10.37% | 3.95% | −6.42 |
| em-dashes / 1000 words | 6.52 | 1.11 | **5.9×** |
| semicolons / 1000 words | 4.82 | 1.46 | **3.3×** |

**Mean and median are already at canon.** Average behaviour is easy to match and carries no signal.
What distinguishes a voice is what it does *occasionally* — the sentence that runs long because the
thought does, the punctuation a plain style never needs.

The AI-detection literature has a name for the missing quantity: **burstiness**, the variance of
sentence length and structure, consistently lower in machine text. The measurement above locates it
precisely: our burstiness deficit is **not** in the body of the distribution, which matches, but in
the **upper tail**. That is a more actionable diagnosis than "vary your sentence length", and it is
the difference between an instruction that can be complied with and one that cannot.

### 5.3 Personality is spoken

Paragraphs opening on speech: **canon 59.7%, ours 11.5%** — the single largest gap in the entire
measurement, 5× off. In the first half of recent books, where a reader forms their opinion of a cast,
it is **14–33%** (A_91 §5).

Characters reveal themselves by talking. A narrated character is a *described* character, and
description is the author telling you what to think of someone instead of letting them prove it.

### 5.4 Personality is where the pages go

Scene-marker hits per 1000 words:

| | canon | ours |
|---|---:|---:|
| travel | 0.34 | **0.01** |
| correspondence | 0.46 | 0.18 |
| inquest | 0.27 | 0.08 |
| servants' hall | 0.41 | 0.21 |
| night watch | 0.20 | 0.07 |
| drawing-room gathering | 0.17 | **0.41** |
| confession / reveal | 0.10 | **0.22** |

Read plainly: **our mysteries happen in one room and end in a confession; the canon's move about,
correspond, and hold inquests.** A book's personality is substantially a fact about where it spends
its pages, and that choice is made long before a sentence is written.

---

## 6. THE KIT

### 6.0 The compliance law — read before writing any instruction

**This model complies with OPERATIONS and ignores STATISTICS.** The evidence is a matched pair
(A_75): asked for 19.5-word sentences it produced **15.01** — *shorter* than the unguided arm — while
the same prompt asking for semicolon-linked clauses moved semicolons from **5 to 13**.

Every instruction below is a **countable thing done**: never a rate, never a target average. "One
understated observation every three pages" is exactly the shape that does nothing. "Give this
character a formative incident with a date" is the shape that works.

The law is not a quirk of one model. It is the difference between asking for a *distribution*, which
nothing can act on locally, and asking for an *act*, which can be performed once and verified once.

### 6.1 Six operations

| # | operation | installs | falsifiable counter |
|---|---|---|---|
| **O1** | **The dated origin.** Every character carries a formative incident in five parts: trait, origin as a *dated event*, cost, stance toward the cost, consequence still running. A role is forbidden as an origin. Tying it to the murder is forbidden — *a formative incident that turns out to be a motive is not a formative incident, it is a motive.* | §2.2 | profiles with all five parts: **today 1 of 378** |
| **O2** | **One dramatised wound.** One first-half chapter places culprit and victim on the page together and *shows* the grievance. Not summarised, not recalled — staged. | §2.5 | first-half scenes containing both names: today ~0 |
| **O3** | **Grammar, not vocabulary, for individuation.** Ban the measured template openings; supply grammar the corpus does not hold — a repeated word used oddly, a profession's jargon in ordinary life, answering with a number, a refusal, a mis-remembered proverb, naming people by their jobs. | §2.1 | tics opening with a banned form: **today 34%** |
| **O4** | **Tail operations.** Ask for *N* sentences over thirty words per chapter and *N* em-dashes — counts, never averages. Never ask for a mean; the mean is already right. | §5.2 | p90 sentence words: today 25.6, canon 31.0 |
| **O5** | **One thing that isn't doing a job.** Each chapter carries one element serving no plot, clue or continuity function — registered at `high`, never `optional`, *precisely because* nothing breaks without it. | §3, §4.2 | survives the budget: the analogous block today reaches **0 of 10** |
| **O6** | **Verbalized sampling at every unforced choice.** Wherever a stage picks one valid option from many, make it emit *k* candidates with probabilities and select — the structure premise already has and no other stage does. Training-free; no retraining, no new model. | §1, §8 | stages using divergent generation: **today 1 of 15** |

**O6 is the one with external backing and the widest blast radius.** It applies to the tic field
(§2.1), the formative incident (§2.2), the per-story register spec (§2.3), the opening, and the scene
inventory (§5.4) — every place the system currently takes its first answer.

### 6.2 The instrument that is missing

Every existing prose instrument points down (§4.1). The highest-leverage infrastructure this project
does not own is **one instrument that points up**.

Two candidates, and they compose:

**(a) Per-story register conformance.** Draw a distinct register specification per story, then measure
conformance to *that* spec rather than to a global ideal. This closes §2.3 by construction: if each
story draws a different spec and conformance is measured, between-book variation stops being 10% of
within-book **by definition rather than by hope**.

**(b) Contextual predictability, which the literature has already validated against quality.** Mean
token entropy and PMI are computable on any manuscript without a judge and without a read. Human
professional fiction is **2–4× more surprising** than model fiction (median NLL ratios 2.03–3.9;
perplexity ratios 2.76–8.82×). More useful: PMI correlates **negatively** with quality in both human
and model text (ρ −0.106 and −0.076) — *high contextual predictability associates with lower quality
scores* — with a non-linear optimum around **+1.98 SD above mean uncertainty**. And the gap is worst
in exactly our domain: creative writing shows a PMI gap **25–30% wider** than essays or news.

That is the shape this project has been missing for thirty-four reads: a number, computable for £0,
that goes **up** when the writing gets better.

**Falsification, stated in advance.** If register conformance reaches ≥80% and prose does not move off
6–7 across two reads, the hypothesis is dead — register is not what the reader responds to, and the
generation model reopens as the cause.

---

## 7. WHAT NOT TO DO — EACH ONE PAID FOR

| do not | because |
|---|---|
| **Add another template to fix flatness** | §4.3 — three of six reviewer-named lines were fixes for earlier reviewer-named lines |
| **Ask for personality as a rate** | §6.0 — asked 19.5 words, got 15.01. Reaches every prompt, moves nothing |
| **Add a scrubber** | Polish is an LLM line-edit pass; strengthen the instruction rather than post-processing its output |
| **Retire repeated material by rule** | A_90 §13 retired on-page clues to cut repetition, retired the reveal's own evidence with them, and **made the book worse** — two new rubric caps |
| **Paraphrase a locked value to reduce repetition** | A_90 §11.2 exists because a repetition pass did exactly this and garbled the clock the story depended on |
| **Gate on it** | A check firing on most runs is an off switch with extra steps, and a gate driving retries costs **+2.43 register points** on the retried chapter. Detect and report; do not block |
| **Trust a probe's negative result** | The first measurement of whether tics reach the page returned **0 of 17** and was wrong — it built its needle from non-contiguous words. Re-run against a known positive: **10 of 23 (43%)**. A negative result from a probe you just wrote is a claim about the probe |

---

## 8. THE TWO-LEVEL CAUSE — AND WHY ONE LEVEL IS ROUTABLE

The internal evidence establishes *that* the system makes no unforced choices. It cannot see *why*,
because the cause is upstream of anything this repository logs. The external literature supplies it,
and the two levels together are more useful than either alone.

**Level 1 — the training-level cause. Not ours, not fixable here, and routable.**

Preference data carries **typicality bias**: annotators systematically favour familiar text, a
well-established result in cognitive psychology. Post-training therefore sharpens the model's
distribution toward a few stereotypical completions — **mode collapse**. The effect is strongest on
creative prompts, and *alignment makes it worse*: instruction-tuned and reasoning models show
significantly larger uncertainty gaps against professional fiction than base models do.

This is the missing half of §2.1. The tic field does not return "One must…" 23% of the time because
the prompt is weak. It returns it because that *is* the aligned prior for "say something
distinctive", and a prompt asking harder for distinctiveness samples the same peak. **No instruction
written in the shape we have been writing them can reach this.**

But it is routable. **Verbalized Sampling** — asking the model to emit *k* candidates *with their
probabilities* rather than one answer — recovers the pre-alignment distribution at inference time,
with no retraining, and raises creative-writing diversity **1.6–2.1×**. More capable models benefit
more.

**And this project already runs it, in exactly one place.** Agent 3b generates five divergent premise
candidates and selects (A_72 §10.1). Premise is the only category that has reached 9 more than twice,
and it has done so six times, while the fourteen stages that take their first answer have never
produced a 9 in any category they own.

> **INFERRED, and the confound stated plainly.** Premise may reach 9 because it is generated
> divergently, or because *concept* is simply the easiest dimension on which to be distinctive — a
> reader can be struck by an idea in one sentence and cannot be struck by a voice in one sentence.
> Both hypotheses predict the observed table. n = 6 nines, uncontrolled.
>
> **What breaks the tie is that the mechanism is independently established** (1.6–2.1×, causal, in
> controlled comparisons) — so the question is not whether divergent generation raises diversity, but
> whether diversity is what earned those sixes. **The experiment is cheap and this project can run
> it:** apply O6 to one non-premise stage — the tic field is the best target, being the most countable
> — and measure the template share, today 34%, without spending a read. If tics diversify and the
> dialogue mark stays at 7, divergent generation works and diversity is not what the reader is
> scoring. That is a clean result either way, and it is the single most informative £0 measurement
> available to the project.

**Level 2 — the system-level causes. All three are ours (§4).** Negative instrumentation, priority
under scarcity, and the template ratchet. Each independently pushes output toward the mode, which
means this pipeline has been **amplifying** a training-level bias with three home-grown ones.

The practical reading: the training-level cause sets a floor that no prompt rewriting will lift, and
the three system-level causes are holding the output well below even that floor. §6.1's O1–O5 address
level 2 and are worth doing on their own. **O6 is the only operation in the kit that addresses
level 1.**

---

## 9. SOURCES

**Internal — MEASURED, this project's archive**

| claim | source |
|---|---|
| category means, never-a-9 | external read ledger, n=34 · `ledger:external-read --gaps` |
| depth 1 of 378; schema field shares; tic template space | ANALYSIS_91 §9.1–9.2, commit `0c74f08e` |
| humour guide 10/10 → 0/10; drop order | ANALYSIS_91 §4.2, three runs |
| dialogue share 14–33% first half; the three reads | ANALYSIS_91 §5 |
| unmandated repetition 61–86% | ANALYSIS_91 §2 |
| between/within-book sentence variation | ANALYSIS_75 §3, 15 manuscripts |
| negative instrumentation; 38/40 notes | ANALYSIS_75 §1, Tier 1.3 |
| operations vs statistics matched pair | ANALYSIS_75 A/B |
| register table; openings; scene inventory | ANALYSIS_79 §13.2–13.3, 720k words of canon |
| injector provenance; 95/95; 6/6 last lines | ANALYSIS_84 |
| retiring clues made the book worse | ANALYSIS_90 §13 |
| gate retry cost +2.43 register points | prose-guard register measurement, B1 |

**External — cited, not measured here**

- Zhang et al., *Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity* —
  typicality bias, mode collapse, 1.6–2.1× creative diversity, training-free.
  https://arxiv.org/abs/2510.01171
- *LLMs Exhibit Significantly Lower Uncertainty in Creative Writing Than Professional Writers* —
  28 models, 2–4× surprisal gap, PMI −1.44 to −2.60, PMI↔quality correlation, +1.98 SD optimum.
  https://arxiv.org/html/2602.16162v1
- *Narrative Flattening: How Post-Training Compresses Thematic, Affective, and Stylistic Variation in
  LLM Fiction*. https://arxiv.org/abs/2605.27878
- *Creativity Has Left the Chat: The Price of Debiasing Language Models* — RLHF vs SFT diversity.
  https://arxiv.org/pdf/2406.05587
- Burstiness and perplexity as human/AI discriminators, and their limits as model scale rises.
  https://quillbot.com/blog/ai-writing-tools/burstiness-and-perplexity/
- Stylometry: function-word frequency as authorial footprint, and the recent finding that content
  words carry more authorship information than long assumed.
  https://journals.plos.org/plosone/article?id=10.1371%2Fjournal.pone.0327081

**A note on transfer.** The external work measures short-form generation and continuations. This paper
measures fifteen complete novels produced by a fourteen-stage pipeline. Where the two agree — flattening,
over-reliance on context, the uncertainty gap — the agreement is worth more than either alone, because
the failure modes are reached by different routes. Where they cannot be compared, §2.3's between-book
figure is offered as a cleaner instance of narrative flattening than the literature currently holds.

---

## 10. SUMMARY FOR SOMEONE BUILDING SOMETHING ELSE

1. **Personality is the residue of unforced choice.** Audit your pipeline for stages *required* to
   prefer one valid output over another. If you have one, that is your ceiling's location.
2. **Any quality you can only detect the absence of, you will optimise into absence.** Count your
   instruments. If they all point down, your ceiling is *flawless and characterless*, and you will
   reach it.
3. **Under scarcity a system discards exactly what it labelled inessential** — always the personality,
   and the label is always accurate. Check what your budgeter drops first; it is probably the only
   thing making the output yours.
4. **A guaranteed-adequate line recurs, and recurrence is the defect it was added to fix.** The
   template ratchet turns one way.
5. **Ask for acts, not averages.** The mean is probably already right and was never the gap.
6. **Ask for a distribution, not an answer.** The cheapest fix in this paper is also the only one
   aimed at the cause rather than the symptom, and it is a prompt change.

---

**Status of the kit.** O1 and O3 are built and ON (`AGENT2B_FORMATIVE_INCIDENT`,
`AGENT2B_TIC_TEMPLATE_BAN`, commit `0c74f08e`); the §4.2 priority promotion is built with its mechanism
pinned by test. **O2, O4, O5, O6 and the §6.2 instrument are designed and not built.** No external read
has yet scored a book produced with any of them.

# WP-007 — PRIOR ART FOR DECIDE, ESTIMATE, ALLOCATE

**The published studies behind WP-006's three jobs: what each measured, what fixed the failure it
measured, and which library implements the fix in this repository's languages.**
2026-10-03 · extends [WP-006](WP-006-decide-estimate-allocate.md) · tree `cd1577e1` · archive figures
MEASURED on the live tree unless labelled · literature checked by six research agents against arXiv, ACL
Anthology, CrossRef, PMLR, PyPI, CRAN and npm on the day ([WF-004](../workflow/WF-004-literature-verification-wp007.md))
· probes in [`WP-007-probes/`](WP-007-probes/) · **no code is changed by this paper**

---

## ABSTRACT

WP-006 sorted every function by its job — DECIDE a fact about one case, ESTIMATE a property of many
books, ALLOCATE a fixed amount — and measured what goes wrong when a theory is lent to the wrong job.
It cited the founding texts. It did not ask whether anyone had already measured our failures on larger
samples, or what fixed them there. This paper asks. More than a hundred sources were checked, and
seven measurements were taken on the archive with methods taken from them.

**The claim.**

> **Every study we found that measurably improved an LLM system did it by moving a decision out of
> the model and into a construction. A solver builds the puzzle and the model narrates it. Yes/no
> checks replace a holistic score. A designed experiment replaces a bundle of levers. An algorithm
> replaces a rotation. Where the model was instead asked to hit a target harder — a rate, a length, a
> prohibition — the studies measured the same failure we did. Each of our house rules has a published
> measurement behind it, and the published methods, run on our archive at £0, find four defects that no
> instrument here reports.**

Four labels are used. **REPORTED** is a result measured by the cited study and checked against its
text (WF-004). **MEASURED** is a figure computed on our archive today. **INFERRED** and **ASSUMED** are
as in CLAUDE.md.

**What the methods found on our archive, in seven measured facts.**

1. **Every case is over-determined.** The clue-deletion loop ZebraLogic uses to certify a unique answer
   was run against our own proof module. In **0 of 72** cases does deleting any single clue un-prove the
   culprit. The test alone proves the culprit in **72 of 72**. The median case has 6 clues pointing at
   the culprit (§2.2).
2. **The reader knows by chapter 4.** By Ely, Frankel and Kamenica's definition of surprise, applied to
   the A_109 reader model, the culprit is the favourite **by chapter 4 in 52 of 64 contracts**, and by
   chapter 6 in all 64. The test is in chapter 8 in 57 of them. With the evidence weakened (the
   implicating ratio from 4 to 1.5, the clearing ratio from 0.05 to 0.5), it is still by chapter 5 in
   56. In the median book, 71% of the chapters before the test do not move the belief at all (§5.1).
3. **Our books are one narrow author.** In Burrows's Cosine Delta over the 300 commonest words, our
   twelve newest distinct cases sit **0.31** apart from each other on average. The twelve books of a
   single canon author sit 0.68 to 0.86 apart, and books by two different canon authors 1.02. The
   signature is gesture words (*hands* z = +6.1). It predates the v2 brief, and the brief's "a thing
   somebody could touch in every paragraph" raised the three words it names (§4.2).
4. **The reader's noise is nearer ±3 than ±1.** Since `--fresh-names` began, reads of the same case
   differ by a within-case SD of **2.7 marks** (95% CI 1.6–7.8 on 4 df; an upper bound). At that noise,
   one matched pair has an 8% chance of detecting a two-mark effect, and when it does it overstates the
   effect **4.6 times** (Gelman and Carlin's retrodesign, §3.3).
5. **The reader is the writer's family, and its model is not recorded.** All 79 read files are named
   `chatgpt-*`, and none records a model. Published judges favour their own family's text, and a
   same-family model upgrade has moved essay marks by up to 13% of the scale (§3.1).
6. **The craft block slides into the middle of the prompt.** In a v2 writer call it sits at the same
   offset, characters 17,300 to 22,000, while the earlier chapters accumulate behind it. It runs from
   70–89% of the way through the prompt in chapter 1 to **19–24%** in chapter 10. The format rules stay
   last and are obeyed. Positional recall is U-shaped (Liu et al.). Our instruction count is about 35,
   where GPT-4.1 still follows 98% (IFScale). So the count is not the problem and the position may be
   (§6.1).
7. **The writer is sent a temperature and nothing else.** Our LLM client passes no presence penalty, no
   logprobs and no `n`. Presence penalty is the one sampling control with a measured effect on the
   lexical diversity of GPT-class models (§4.4).

**What it buys.** Seventeen kit items, K17–K33 (§7). Ten cost nothing to build; the other seven need
paid runs, reads or judge calls, at most eight each. Each names the WP-006 item it implements or
extends, the study it rests on, the library that does the work, and the counter that falsifies it.

**Falsifier for the whole claim.** K17, K19, K23, K26 and K27 each rest on a study that measured a
direction. Build them and run each against its counter. If two or more move their counter **opposite**
to the direction their study reported, the transfer claim is false.

---

## 1. HOW TO READ A STUDY HERE

### 1.1 What transfers, and what does not

Most of these studies used short texts (550–1,400 words), other models (GPT-3.5, GPT-4, GPT-4o,
Llama), and human raters our reads do not have. Our books are about 13,000 words written by GPT-4.1 and
read by ChatGPT. Three rules govern every citation below.

- **A study chooses a form, not a number.** "Score each category in its own call" transfers. "This
  halves halo" does not; we measure that ourselves.
- **A study predicts a direction.** Where it measured one, the kit item carries it as a counter, and the
  whole-paper falsifier is the count of directions that fail.
- **A study never enters PLAN-TO-90 as an effect size.** Only our own reads do.

### 1.2 The map — WP-006 item to method, study and library

| WP-006 | job | the method that does it exactly | the study that measured why | library (JS first) |
|---|---|---|---|---|
| K2, K3 | decide | constraint solving with a uniqueness quantifier | ZebraLogic; Smith, Butler & Popović; MuSR | `z3-solver` 5.2.0; `clingo-wasm` 0.6.0 |
| — (new) | decide | clue necessity by deletion; minimal unsatisfiable subsets | ZebraLogic; Liffiton & Sakallah (CAMUS) | own proof module; `z3-solver` `unsatCore()` |
| K4 | decide | three-valued monitoring (LTL3) | Bauer, Leucker & Schallhart 2011 | hand-written (~40 lines) |
| K6 | decide | Declare templates over finite traces (LTLf) | Pesic & van der Aalst; De Giacomo & Vardi | Declare4Py (Python); JS: write it |
| K5 | decide | mutation testing; property-based tests; dead-export scan | Just et al. 2014; Claessen & Hughes 2000 | StrykerJS 10 + vitest runner; `fast-check`; `knip` |
| K12, K13 | estimate | generalizability theory; ICC; anchor re-reads | Brennan 2001; Shrout & Fleiss; Sunkavalli 2026 | hand-rolled ICC(1) (§3.2); `pingouin` |
| — (new) | estimate | one category per judge call; yes/no checks | Stureborg et al.; Chakrabarty et al. (TTCW); CheckEval | none needed |
| K7, K8 | estimate | maxT resampling; e-BH; retrodesign | Westfall & Young; Wang & Ramdas; Gelman & Carlin | `@stdlib/stats` `padjust`; `simple-statistics` `permutationTest` |
| K1 | estimate | changepoint and anytime-valid monitoring | Johari et al.; Howard et al.; Adams & MacKay | `confseq`; `ruptures`; `river` |
| K12 | estimate | screening designs; A/A tests | Plackett & Burman; Kohavi et al. | covering arrays via `covertable` |
| K10, K11 | measure | LNRE growth curves; dispersion; syntactic templates; Delta | Baayen; Gries; Shaib et al.; Burrows; Evert et al. | `zipfR`; `diversity`; `wink-nlp`; this paper's Delta probe |
| — (new) | allocate | suspense and surprise from a belief martingale | Ely, Frankel & Kamenica 2015 | the A_109 reader model (§5.1) |
| WP-005, K14 | allocate | divisor apportionment; Hungarian; MILP; list scheduling | Balinski & Young; Kuhn; Huangfu & Hall; Graham | `munkres` 2.1.1; `highs` 1.15.3; `graphology-dag` |
| K15 | allocate | counter-based random streams; covering arrays | Salmon et al. 2011; Kuhn, Wallace & Gallo 2004 | `pure-rand`; `covertable` 3.4.0 |

---

## 2. DECIDE — what the literature built, and what it found

### 2.1 Construct the case, then narrate it — REPORTED

WP-006 §2.1 measured that the alibi the code constructs is right 25 times in 25. The alibis the model
authors leave exactly one suspect 8 times in 25. Four lines of work measured the same split with more
data.

| study | what it measured | figure |
|---|---|---|
| **ZebraLogic** (Lin et al., ICML 2025) | accuracy on 1,000 logic grids whose uniqueness a solver certifies, by search-space size | GPT-4o **80.0 / 19.6 / 2.5 / 0.5%** from small to extra-large; o1 97.2 → 42.5% |
| **True Detective** (Del & Fishel, *SEM 2023) | 191 "5 Minute Mystery" puzzles | GPT-4 38% unaided; **83% given the golden chain of reasoning**; humans 47% |
| **Logic-LM, SatLM, LINC** (2023) | the LLM translates the problem, a solver decides | +39.2% over standard prompting (Logic-LM); a 15.5B model plus a prover beats GPT-4 by 10 points on ProofWriter (LINC) |
| **MuSR** (Sprague et al., ICLR 2024) | murder mysteries generated by building the facts first and narrating them second | humans 92.1% (94.1% by majority vote), GPT-4 80.4% |

The pattern matches ours. A model given the deduction can follow it, and a model asked to produce a
consistent constraint set fails once the space is larger than a toy's. MuSR is the closest published
design to this pipeline: its gold facts are means, motive and opportunity per suspect, and its
narrative is written chapter by chapter from those facts. **MuSR's validators are keyword filters, not
a solver** (REPORTED), so even it never proves the culprit is unique.

**No peer-reviewed whodunit generator proves a unique culprit** (REPORTED, as a search result: the
agent found Barros et al. 2019 and two game papers, none of which guarantees uniqueness). The formal
statement of the property exists. Smith, Butler and Popović (FDG 2013) showed that generating a puzzle
that has a solution and admits **no undesirable solution** is Σ₂ᵖ-complete in general. Our property,
"exactly one suspect fits the timetable", is that "for all alternatives" quantifier. At our size —
five suspects, about twenty time points — it is not hard. It is one solver call per suspect asking
"can this person have done it?", and exactly one call should answer yes.

**Library.** `z3-solver` on npm is Microsoft's own TypeScript binding over WebAssembly (5.2.0, MIT,
446k downloads a month). It exposes `Solver.check(...assumptions)`, `unsatCore()` and an `Optimize`
interface. In Node it needs `killThreads()`, or the process will not exit. `clingo-wasm` (0.6.0,
Apache-2.0, clingo 5.8.1) is the answer-set alternative, the language Smith and Mateas used for
procedural generation. `logic-solver` (MiniSat in JS) has no unsat-core API and was last pushed in
2019; do not adopt it.

### 2.2 Necessity by deletion — MEASURED

ZebraLogic generates a puzzle by drawing a solution, deriving clues, and **deleting clues while the
solver still certifies a unique answer**. WP-006 §1.2 found that no function here ever tests whether a
clue is necessary. The loop runs on our own proof module (`analyseProof`, A_109 M3) at £0
(`clue-necessity.mjs`).

| over the 72 stored cases whose culprit the proof accepts | |
|---|---|
| clues per case, median | 21 |
| clues pointing at the culprit, median (range) | **6** (0–13) |
| cases where deleting any one clue un-proves the culprit | **0 of 72** |
| cases where the test alone proves the culprit (every pointing clue deleted) | **72 of 72** |
| innocents whose clearance rests on exactly one deletable clue | 0 of 223 |
| **known positive**: no test and one pointing clue left — deletion un-proves | 69 of 69 |

The probe works: on the constructed positive it fires every time. On the real cases it never fires.
Every case is over-determined. The test proves the culprit without help, and the median case adds six
more clues that each prove it alone.

Over-determination is not a fair-play defect; Golden Age fair play asks that the clues suffice, not
that each be indispensable. It becomes a defect when the redundant pointing clues reach the reader
before the test, which §5.1 measures. **INFERRED:** the proof certifies the clues' wording, not their
entailment (WP-006 §2.2), so the figures above are what the case *says*.

**The repair tool for the opposite failure.** When the timetable leaves no suspect or more than one,
the useful output is not "inconsistent" but *which windows conflict* and *the smallest edit that fixes
them*. Those are a minimal unsatisfiable subset and a minimal correction set. Liffiton and Sakallah's
CAMUS (J. Automated Reasoning 2008) enumerates both and was implemented for disjunctive temporal
problems, the family our alibi windows belong to. `z3-solver`'s `unsatCore()` gives one core per call,
which is enough for a report line. Demaine et al. (FUN 2016) show that finding the *fewest* clues that
force a unique solution is Σ₂ᵖ-complete. Testing each existing clue is n + 1 checks, as above.

### 2.3 Unknown is a monitor verdict — REPORTED

WP-006 K4 asks every check to return pass, fail or unknown. Runtime verification standardised this in
LTL3 (Bauer, Leucker and Schallhart, ACM TOSEM 2011): a monitor over a finite prefix answers
**true**, **false** or **inconclusive**, and inconclusive is never folded into either. That paper is
the citation for the rule, and its automaton construction is not needed at our size. A gate that
combines checks by Kleene's strong connectives is a monitor in this sense.

### 2.4 Order rules are Declare templates — REPORTED

WP-006 §2.5 proposed one evaluator for the chapter-order rules held in four places. Process mining
built exactly that twenty years ago: Declare (Pesic and van der Aalst 2006; Pesic, Schonenberg and van
der Aalst, EDOC 2007) is a library of LTL-on-finite-traces templates, each a rule with two slots.

| our rule | Declare template | formula |
|---|---|---|
| no clearance after the arrest | not-succession(arrest, clears) | G(arrest → ¬F clears) |
| a clue is planted before it is used | precedence(plants(c), uses(c)) | ¬uses W plants |
| the culprit is on the reveal's page | response within the same step | G(reveal → on_page(culprit)) |
| the victim is found after they are last seen alive | chain or alternate precedence | ¬found W seen_alive |
| nobody cleared is the victim | absence | G ¬clears(victim) |
| no wit beat at the body, the test or the reveal | not-coexistence per step | G ¬(wit ∧ (body ∨ test ∨ reveal)) |

All six rules fit the existing templates. **Library.** Declare4Py (Python, last pushed 2026-09-09) does
conformance checking over Declare. `ltlf2dfa` (PyPI 2.0.0) needs a separate MONA install. **There is no
mature JavaScript LTLf library** (REPORTED: `fast-check-ltl` is two weeks old with 462 downloads a
month, `ltljs` is dead). The recommendation stands: write the ~100-line evaluator, but write it **over
the Declare template catalogue**, so a rule is a template name and two predicates rather than a new
formula.

### 2.5 A check needs a witness — REPORTED

WP-006 K5 asks that every check have a fixture on which it fires. Software testing has the measured
version.

- **Mutation testing.** Just et al. (FSE 2014) seeded about 230,000 mutants into five programs with 357
  real faults. **73% of real faults were coupled to a mutant**, and mutant detection predicted
  real-fault detection independently of coverage. A guard that can never be true shows up as a
  **surviving mutant**: flip it and no test notices. That is the finding WP-006 made by hand at
  `findings.ts:346`. `@stryker-mutator/core` 10.0 with `@stryker-mutator/vitest-runner` supports
  vitest, our runner.
- **Dead exports.** `knip` (6.39, ISC) lists exported functions with no importer. That finds the v1
  validators that are exported and never called. It cannot find a guard that never fires *inside* a
  function; that takes mutation testing.
- **Known positives on demand.** `fast-check` (4.10, MIT) generates inputs from a property and shrinks
  the failing ones. A property such as "for any timetable with exactly one open suspect, the uniqueness
  check names that suspect" produces the known positives CLAUDE.md's probe rule requires.

### 2.6 Ask the solver, not a reader, for plot holes — REPORTED

Ahuja et al. (CoLM 2025, "Finding Flawed Fictions") measured plot-hole detection. LLM-written stories
showed plot-hole rates more than double those of the human originals, and LLM detectors got worse as
stories got longer. NoCha (Karpinska et al., EMNLP 2024) found GPT-4o at **55.8%** pair accuracy on true/false
claims about novels (chance 25%, humans 97.4%), and at **41.6%** on claims needing global reasoning.
Our books are about 17,000 tokens, under NoCha's shortest bucket. But the plot, clues and ending marks
require global reasoning: was the solution fairly supported? **INFERRED:** a consistency check over a
whole book should be computed from the artifacts (§2.1–§2.4), not asked of a reader.

---

## 3. ESTIMATE — what the literature measured about readers, noise and small samples

### 3.1 The reader is an LLM judge, and LLM judges have been measured — REPORTED

The external read is the only instrument that has moved this project. These studies measure that kind
of instrument directly.

| study | finding that bears on our read |
|---|---|
| **Stureborg et al.** 2024 | aspects scored in one output correlate **r = 0.979** (GPT-4, coherence with consistency) against 0.315 for human experts; scores cluster at round numbers; the later an aspect is scored in the output, the worse it agrees with experts |
| **Sunkavalli** 2026 (preprint) | judges' sub-scores correlate 0.48–0.79; scoring each dimension **in its own call** halved residual halo (median 0.31 → 0.16); a same-family model upgrade shifted scores by up to **13% of the scale**; a fixed anchor set re-scored on a schedule caught 4 of 5 shifts with 20 essays |
| **Chakrabarty et al.**, CHI 2024 (TTCW) | 14 yes/no craft tests on ~1,400-word stories; New Yorker stories pass 84.7%, GPT-4 about 30%; experts agree (Fleiss κ 0.41); **LLM judges agree with the experts at κ close to zero** |
| **CheckEval** (EMNLP 2025); **TICK** (2024) | yes/no checklist questions raise agreement between judges by **0.45 α** over Likert scoring; checklists raised judge–human agreement from 46.4% to 52.2% |
| **Chhun et al.**, TACL 2024 | LLM judges are self-consistent (ICC 0.63–0.93), agree with humans per story at τ ≈ 0.2 (humans with each other: 0.48), "cannot be relied upon to evaluate a single story", and rank *systems* better |
| **LitBench** (Fein et al. 2025) | **GPT-4.1 as judge agrees with human preference 70.2%** on short fiction; on fresh LLM-written stories the best off-the-shelf judge was at chance |
| **Panickssery et al.**, NeurIPS 2024 | GPT-4 recognises its own text 73.5% of the time, and self-recognition tracks self-preference (τ 0.41) |
| **Zheng et al.**, NeurIPS 2023 | GPT-4 gives itself about a 10% higher win rate; pairwise order-swap consistency 65% |
| **Wang et al.**, ACL 2024 | GPT-4 reverses its pairwise verdict on order swap 46% of the time on one pairing; three sampled verdicts plus scoring both orders raise κ against humans from 0.24 to 0.37 |
| **Chiang & Lee**, ACL 2023 | on stories, expert teachers agree with each other on *likability* at τ ≈ 0.1 |
| **Chhun et al.**, COLING 2022 (HANNA) | human criteria for stories inter-correlate at a mean of 40.7% (Kendall) — some co-movement is real |

Read against WP-006 §3.1, these explain the three properties of our reader.

**The single factor (57% of variance).** Ten categories are scored in one output. Stureborg measured
r = 0.979 between two aspects scored that way. **INFERRED:** most of our first principal component is
the one-call format, not the books. HANNA shows humans' criteria co-move too (mean τ 0.41), so not all
of it. The method that separates the two is to score each category in its own call on a few books, and
compare.

**The ceiling on craft categories.** Dialogue, pacing and prose have never scored 9 in 65 reads.
TTCW measured LLM judges at κ ≈ 0 against experts on yes/no craft tests. **INFERRED:** the reader may
not be able to resolve craft at all, in which case no prose lever can show up in those three marks.
This is the strongest published reason to put countable craft checks into the read, not more prose
levers into the writer.

**The family.** All 79 read files are `chatgpt-*`, and none records the model (MEASURED). The writer is
GPT-4.1. Panickssery measured self-preference tracking self-recognition, and G-Eval found GPT-4 rating
GPT summaries above human ones that humans preferred. **INFERRED:** a same-family reader is the reader
least likely to penalise the house phrases of §4, because they are its own. Sunkavalli measured
same-family upgrades moving marks by up to 13% of the scale. The regime change WP-006 §3.2 dated to
1 September therefore has a second candidate cause that no record here can exclude: a silent change of
the ChatGPT model.

### 3.2 Reliability — the measured σ, and what it caps — MEASURED

`read-icc.mjs` takes the 19 full-length reads since `--fresh-names` (2026-09-07), when one cast means one
case, and groups them by cast with complete linkage.

| | value |
|---|---|
| reads · distinct cases · cases read more than once | 19 · 15 · 3 (7 reads: 79/82/77, 88/85, 69/74) |
| within-case SD, headline (pooled, df 4) | **2.72**, 95% CI 1.6–7.8 |
| within-case SD, prose mark | 0.65 |
| ICC(1) headline | 0.66 |
| design effect (Kish) · effective n | 1.35 · 14 of 19 |

Two reads of one case differ by the reader, the writer's draw **and** any lever flipped between them.
So 2.72 is an upper bound on reader-plus-draw noise. It sits at CLAUDE.md's ±3. Its interval excludes
1, but because lever effects are inside it, it cannot rule ±1 out. It is the only figure on file taken
from more than one case. The design effect is small. WP-006 §7 warned
that effective n is lower than printed everywhere; since fresh names it is lower by about a quarter.

**What σ caps.** By Spearman's attenuation, no instrument can correlate with the read better than the
square root of the read's reliability.

| headline SD | σ = 1 | σ = 2.72 | σ = 3 |
|---|---|---|---|
| 4.6 (last 20 reads) | reliability 0.95 · ceiling r 0.98 | 0.65 · **0.81** | 0.57 · 0.76 |
| 4.2 (since 1 September) | 0.94 · 0.97 | 0.58 · **0.76** | 0.49 · 0.70 |

The ceiling is not what keeps instruments near zero. Register's slope went from −1.26 to −0.07, well
below any ceiling here. But it means a perfect instrument would show r ≈ 0.8 against today's read,
and should be judged against that, not 1.

**How to settle σ properly.** Generalizability theory (Cronbach et al. 1972; Brennan 2001) separates
variance by facet: book, draw within book, read within draw. A G-study of **3 books × 2 draws × 2
reads** costs three `RESUME_REDO=prose` A/A runs (~£1.35) and twelve reads. It returns σ_draw and
σ_read separately, and a D-study then says how many reads to average for a reliability of 0.8. The
same three books, re-read monthly, are the **anchor set** Sunkavalli used to catch silent model
changes (K22). Koo and Li's bands (poor under 0.5, good 0.75–0.9) are the reporting convention.
`pingouin.intraclass_corr` requires balanced data and drops any book with a missing read. Use the
one-way ANOVA estimator with `n₀` in `read-icc.mjs`, which handles unequal cells.

### 3.3 Small samples exaggerate — REPORTED, applied — MEASURED arithmetic

Gelman and Carlin (2014) give the two errors a significant small-sample estimate makes: the wrong sign
(Type S), and a magnitude inflated by an "exaggeration ratio" (Type M). Applied to one matched pair
of two reads at σ = 2.72 (so SE of the difference 3.85):

| true effect | power | Type S | exaggeration if significant |
|---|---|---|---|
| 1 mark | 6% | 23% | **9×** |
| 2 marks | 8% | 8% | **4.6×** |
| 3 marks | 12% | 2.5% | 3.1× |
| 5 marks | 26% | 0.2% | 2.0× |

A single pair that comes out "significant" at +9 is what a true +2 looks like. Button et al. (2013)
measured the same winner's curse across 730 neuroscience studies at a median power of 21%. Barnett,
van der Pols and Dobson (2005) add regression to the mean: a lever tried *because* a book read badly
will look better on the next read whether or not it works. At σ = 2.72 the matched-pair table of WP-006
§3.6 becomes 5 pairs for a 5-mark effect, 13 for 3, 30 for 2 and 117 for 1.

### 3.4 Designs that buy more per read — REPORTED, applied — MEASURED arithmetic

**Screening designs.** CLAUDE.md asks to bundle levers that touch different chapters, so that one
read scores several. Statistics has had the exact form of that request since 1946. A Plackett–Burman
design estimates up to N − 1 two-level factors in N runs (Plackett and Burman, Biometrika 1946). Each
lever is on in half the runs, and its effect is the mean of those runs minus the mean of the others.

| 7 prose-side levers | runs | SE per lever at σ = 2.72 |
|---|---|---|
| one matched pair per lever | 14 runs, 14 reads | 3.85 |
| **Plackett–Burman, 8 runs on one upstream** | **8 runs, 8 reads** | **1.92** |
| one-lever pairs to match that SE | 56 runs (four pairs per lever) | 1.92 |

`RESUME_REDO=prose` against one byte-identical upstream is a blocked design, so the case's variance
drops out. The cost is about £3.60 of prose stages and eight reads. The price is an assumption:
Plackett–Burman is resolution III, so a lever's estimate is aliased with two-lever interactions. A
fold-over (16 runs) removes that; a definitive screening design (Jones and Nachtsheim 2011) needs
2k + 1 runs and is unaliased by second-order terms. Box, Hunter and Hunter (2005) is the reference.

**A/A runs and covariates.** Kohavi, Tang and Xu (2020, ch. 19) make the A/A test the first check of
any experiment system. About 5% of A/A pairs should come out "significant", and a system that shows
more is broken. Deng et al. (WSDM 2013, CUPED) cut variance by about 50% by regressing out a
pre-experiment covariate. For a chapter-level instrument, the same chapter's value in the control arm
is that covariate.

**Peeking.** Reads arrive one at a time and are looked at as they arrive. A fixed-n test is invalid
under that (Johari et al., Operations Research 2022). Always-valid p-values, confidence sequences
(Howard et al., Annals of Statistics 2021) and e-values (Ramdas et al., Statistical Science 2023) stay
valid at any stopping time. e-BH (Wang and Ramdas, JRSS B 2022) controls the false discovery rate
under any dependence, which is the form K8's sweeps need.

**Spending a fixed budget.** "Which of five levers is best, with twenty runs" is fixed-budget best-arm
identification. Successive Rejects (Audibert, Bubeck and Munos, COLT 2010) needs no tuning parameter
and is near-optimal for it. Thompson sampling (Russo et al. 2018) is the alternative when the goal is
to ship good books while learning, rather than to name a winner.

### 3.5 Regimes, Goodhart and drift — REPORTED

Manheim and Garrabrant (2018) split Goodhart's law into four variants. The register instrument fits
**causal Goodhart**: levers moved a correlate of the mark that does not cause it, and the correlation
went to zero (WP-006 §3.2). §3.1 adds a rival cause, a reader change. Range restriction is not the
explanation: the rate's range widened while the slope fell. If a later instrument's range does
narrow, Hunter, Schmidt and Le (2006) show that Thorndike's correction under-corrects when the
restriction is indirect, as it is when the selector rather than the sampler narrows the range.

Detection is a solved problem. A CUSUM (Page 1954) on the instrument's residuals against the read, or
Bayesian online changepoint detection (Adams and MacKay 2007), dates a regime change as it happens.
`river.drift.ADWIN` and `ruptures` implement both in Python. K1's rolling slope is the minimum, and a
changepoint on it is the upgrade.

**The selector is not over-optimising.** Gao, Schulman and Hilton (ICML 2023) fitted the gold score
of best-of-n selection as d(α − βd), with d = √KL and KL = ln n − (n − 1)/n. For our best-of-3, KL is
**0.43 nats**, d ≈ 0.66: a very small optimisation pressure. The risk A_110 M6 found in the selector
is that its effective weights are not its written weights. That is a validity problem; more drafts
would not fix it.

### 3.6 Libraries for estimation

| need | JavaScript | Python / R |
|---|---|---|
| t, z, Wilcoxon, ANOVA, BH adjustment | `@stdlib/stats` (`ttest2`, `pcorrtest` with Fisher z and a `ci`, `padjust` with `bh`) | `scipy.stats`; `statsmodels.stats.multitest.multipletests` |
| permutation test | `simple-statistics` `permutationTest` | `scipy.stats.permutation_test` (exact when small) |
| bootstrap | none — hand-roll | `scipy.stats.bootstrap` (BCa) |
| regression with SE | `jstat` `jStat.models.ols` (undocumented; returns SE, t, p) | `statsmodels` OLS with `cov_type='cluster'` |
| ICC, mixed models | **none on npm** — hand-roll ICC(1) (`read-icc.mjs`) | `pingouin.intraclass_corr` (balanced only); `bambi`, `statsmodels.mixedlm` |
| anytime-valid inference | none | `confseq` (Howard's reference implementation); `expectation`; R `safestats` (**CRAN has flagged it for archiving on 2026-10-05**) |
| retrodesign | 15 lines (§3.3) | R `retrodesign` |
| drift and changepoints | none | `river.drift.ADWIN`; `ruptures` |

The default is the WP-006 one: shipped instruments in TypeScript with no new dependency, and offline
estimation in Python where JavaScript has no library.

---

## 4. MEASURE THE PAGE — what the literature measured about LLM prose

### 4.1 The sameness is the model's, and it is general — REPORTED

WP-006 §4.2 found that 88 of the top 100 house phrases appear in no source file. The literature
measures the same thing at scale.

| study | finding |
|---|---|
| **Sun et al.**, ICML 2025 ("Idiosyncrasies") | five chat models told apart at 97.1%; with the **word order shuffled, still 88.9%** — the signature is the choice of words |
| **Shaib et al.**, EMNLP 2024 (syntactic templates) | **76%** of part-of-speech templates in model text occur in pretraining data, against 35% for human text; RLHF does not remove them |
| **Lu et al.**, ICLR 2025 (Creativity Index) | professional authors score 66.2% higher than LLMs on how little of their text can be rebuilt from existing web text; alignment lowers an LLM's score by about 30% |
| **Kirk et al.**, ICLR 2024 | RLHF significantly reduces output diversity, within and across inputs |
| **Juzek & Ward**, COLING 2025 | the over-used words ("delve") trace to preference tuning, not to architecture or data |
| **Kobak et al.**, *Science Advances* 2025 | excess vocabulary measured against a pre-LLM projection marks at least 13.5% of 2024 PubMed abstracts |
| **Jiang et al.**, NeurIPS 2025 ("Artificial Hivemind") | open-ended output is homogeneous within a model and, more strongly, **across different models** |
| **Xu et al.**, PNAS 2025 ("Echoes in AI") | the same plot elements recur across GPT-4 and Llama-3 generations |
| **Gonen et al.**, NAACL 2025 (semantic leakage) | concepts in the prompt leak into unrelated output (GPT-4o 76.9% against a 50% baseline) |

Two consequences. A ban list attacks one surface form of a syntactic template the model will refill
with other words (Shaib). And switching the writer to another model is not a cure (Jiang). Semantic
leakage is the published name for A_110's 28% of repetition that is brief wording.

### 4.2 One narrow author — MEASURED

Burrows's Delta (LLC 2002) is the standard authorship distance. Each text becomes the z-scored
frequencies of the commonest words, and two texts are compared by cosine distance. Evert et al. (DSH
2017) found vector normalisation "the decisive factor", which is what Cosine Delta does. Function
words carry an author's habit and less of a period's vocabulary. That makes Delta the period-robust
sameness figure WP-006 §4.2 lacked. `delta-dispersion.mjs` uses the 300 commonest canon words,
z-scored on 163 canon texts, over an 8,000-token window from token 2,000. It keeps one manuscript per
distinct case, which leaves 40 cases with 10,000 or more tokens.

| set | k | mean pairwise Cosine Delta |
|---|---|---|
| Arthur Conan Doyle | 7 | 0.68 |
| Carolyn Wells | 9 | 0.70 |
| E. Phillips Oppenheim | 7 | 0.72 |
| J. S. Fletcher | 12 | 0.75 |
| Edgar Wallace | 12 | 0.79 |
| R. Austin Freeman | 9 | 0.79 |
| William Le Queux | 11 | 0.86 |
| **ours, newest 12 distinct cases** | 12 | **0.31** |
| ours, all 40 distinct cases | 40 | 0.34 |
| two canon books by different authors | — | 1.02 |

Our twelve books are less than half as far from each other as the tightest canon author's books are
from each other. Our centroid is 0.95 from Wallace, the nearest canon author — about as far as two
different canon authors are from each other.

The words that make the signature are the most interpretable result here. Our books over-use **hands
(z = +6.1), against, set, voice, hand, between, every, across, window**, the body-and-object
vocabulary of *hand resting on the*, *set against the*, *moved to the window*. They under-use **that
(−2.6), there, what, be, it, when, been, well, good**, the words of subordinate clauses and talk. The
canon reasons and converses; ours describes gesture. **INFERRED:** that is the measurable form of the
owner's "wooden", and it bears on dialogue, one of the three categories that have never reached 9.

**Part of it is ours.** The v2 brief (`brief.ts`, since 2026-09-18) asks that "every paragraph has a
thing in it somebody could touch, and a person doing something with it or to it". TWO EXCHANGES asks
for "a movement, an object handled" after each short reply. Split at that date (30 cases before, 10
from it):

| word | mean z before 2026-09-18 | from 2026-09-18 |
|---|---|---|
| hands | 4.4 | **6.0** |
| hand | 1.5 | **3.9** |
| set | 2.8 | **4.9** |
| against · voice · between | 4.7 · 4.4 · 3.3 | 4.9 · 4.3 · 3.2 |
| that · there · it | −2.1 · −1.8 · −1.6 | −2.5 · −2.4 · −2.2 |
| within-set Cosine Delta | 0.33 | 0.30 |

The signature predates the brief, so it is the model's (§4.1). The three words the touch rule names
rose by 1.6 to 2.4 z, and the ones it does not name stayed flat. **INFERRED**, because every other v2
change landed on the same day: the rule intensifies the habit it was meant to cure. That is Gonen et
al.'s semantic leakage, and A_110's 28% of repetition that is brief wording.

### 4.3 Instruments with a published form — REPORTED

| what we measure today | the published form | library |
|---|---|---|
| compressed ratio (A_110 M7) | compression ratio **plus** self-repetition of long n-grams **plus** Self-BLEU — Shaib et al. recommend reporting all three, as they correlate little | `diversity` (PyPI 0.3.1: `compression_ratio`, `self_repetition_score`, `template_rate`) |
| house-phrase load (WP-006 K11) | **syntactic template rate**: part-of-speech 4–6-grams shared across books | `diversity.template_rate`; in JS, `wink-nlp` (its README claims ~95% POS accuracy at ~650k tokens/s) |
| "in at least a third of the books" | Gries's **DP** dispersion (IJCL 2008; corrected 2012), 0 = even spread, 1 = clumped | 10 lines |
| keyness by log-likelihood | G² as the filter, **Log Ratio** (Hardie 2014) as the effect size | `quanteda.textstats::textstat_keyness` (no Log Ratio; compute it) |
| closed phrase lists | **excess vocabulary** against a baseline (Kobak et al.) — observed rate minus the rate projected from the canon | the canon is the baseline |
| Heaps β (WP-006 K10) | LNRE models that extrapolate the growth curve (Baayen 2001); every "constant" varies with length (Tweedie and Baayen 1998), so compare curves | R `zipfR` 0.6-70 |
| sameness between books | Cosine Delta (§4.2) | `delta-dispersion.mjs`; R `stylo`; PyPI `faststylometry` |
| what a text owes to existing text | Creativity Index / DJ Search (Lu et al.), here against the 12.4M-word canon | suffix array (§4.5) |

Two warnings travel with the table. EQ-Bench's longform benchmark (eight chapters of about 1,000 words)
reports repetition and a first-to-last-chapter degradation score, the shape of our problem. And a
study of four ChatGPT models found the newest diverge most from human lexical profiles on six
dimensions, while MTLD stayed high (arXiv 2508.00086, authors not confirmed). That is WP-006 §4.1's
finding seen from outside.

### 4.4 What moves it — REPORTED, with what our API allows — MEASURED

| lever | what was measured | available to us |
|---|---|---|
| **presence penalty** | Martínez et al. (ACM TIST 2024) swept every sampling control on GPT-3.5 and GPT-4: **lexical diversity rose with presence penalty**; frequency penalty barely moved it within 0–0.5 and broke the text at ≥ 1.0 | Azure supports it. **Our client never sends it** (0 matches in `packages/llm-client/src` or `apps/worker/src`); v2 sends `temperature: 0.7` (`run.ts:135`) and a token cap |
| `logit_bias` bans | in Antislop (Paech et al. 2025), token banning became **unusable at about 2,000 patterns**, and writing quality fell to 28/100 at 8,000 | supported, but a bias works on a *token*: banning `gaze` bans every honest gaze |
| backtracking sampler / FTPO fine-tune | Antislop suppressed 8,000+ patterns while keeping quality; FTPO cut slop 90% and kept 95–102% of lexical diversity | needs logits or weights — **not available** on Azure |
| min-p sampling | Nguyen et al. (ICLR 2025) claimed gains; a 2025 reanalysis disputes them | **not offered** by Azure's chat API (no `min_p`, no `top_k`) |
| an LLM edit pass | Chakrabarty, Laban and Wu (CHI 2025, LAMP): a seven-category taxonomy of LLM writing problems from 1,057 professionally edited paragraphs; experts preferred **writer-edited over LLM-edited over unedited**; LLMs found the problem spans at precision 0.46 against expert–expert agreement of 0.57 | yes — this is the polish pass; give it the taxonomy, as memory already advises |
| self-reinforcement | Holtzman et al. (ICLR 2020) and Xu et al. (NeurIPS 2022): a repeated phrase becomes likelier each time it repeats | **INFERRED:** the earlier chapters in the v2 prompt (§6.1) are a repetition source as well as a context source |

The cheapest measured lever on the list is the one we do not send. K26 plumbs it behind a flag.

### 4.5 Copy detection, for the gate that does not run — REPORTED

WP-006 §2.4 found the anti-copy gate set ON with no caller. The published machinery for exact and
near-duplicate spans is Lee et al. (ACL 2022): ExactSubstr finds repeated spans of 50 or more tokens
with a suffix array, and NearDup uses MinHash over 5-grams with 9,000 hashes and a 0.8 threshold.
Infini-gram (Liu et al., COLM 2024) is the suffix-array engine that scales to trillions of tokens. At
12.4M canon words, a suffix array built in JavaScript is a few seconds' work. For MinHash on npm,
`bloom-filters` 3.0.4 is the maintained option; `minhash` was last released in 2018. Memory records
that the index must be built asynchronously: the pipeline runs inside the API process.

---

## 5. ALLOCATE — pace, place and seed

### 5.1 Suspense and surprise are defined — REPORTED; ours measured — MEASURED

Ely, Frankel and Kamenica (*J. Political Economy* 2015) model a reader whose belief over suspects is a
martingale. **Surprise** in a chapter is how far the belief moves (Euclidean distance between
consecutive beliefs). **Suspense** is the expected size of the next move, felt before it happens.
Their optimal plot for suspense keeps suspense equal in every chapter. Uncertainty falls **linearly**
to zero, belief moves by "plot twists" that grow larger and rarer as the book goes on, and the truth
is held to the final period. With many suspects, "alive till the end" and sequential elimination are
both optimal. Wilmot and Keller (ACL 2020) computed the forward-looking measure over sentence
embeddings and matched human suspense ratings on 100 stories as well as the human annotators matched
each other (ρ .710 against .711). Frermann, Cohen and Lapata (TACL 2018) measured readers of crime
drama naming the culprit incrementally. Wagner, Keydar and Abend (arXiv 2025) formalise fair play as
surprise before the reveal and coherence after it, and find LLM stories fail to balance the two.

Our A_109 reader model already walks a posterior over suspects chapter by chapter. Its source cites
Cheong and Young. `reader-surprise.mjs` applies Ely's surprise to it across all 64 stored contracts
(ten chapters in 60; the test in chapter 8 in 57).

| | figure |
|---|---|
| culprit-pointing clues owned in chapters 1–7 | **368 of 432 (85%)** |
| first chapter the culprit is the reader's favourite (p ≥ 0.5), `reader.ts` ratios | by ch 4 in **52 of 64**; by ch 6 in **64 of 64** |
| the same with ratios weakened to 1.5 / 1.2 / 0.5 (from 4 / 1.5 / 0.05) | by ch 5 in 56 of 64; by ch 6 in 59 |
| chapters before the test that move the belief by under 0.02 | median **71%** of them; at least half in 49 of 64 books |
| changes of favourite before the test (twists) | none in 57 of 64; one in 7 |
| share of all belief movement delivered before the test | median 100% |

The optimal plot holds uncertainty until the end and spends it in late, large twists. Ours spends all
of it in one or two chapters near chapter 4, then carries a settled belief through four more chapters
to a test that confirms it. With §2.2: the case has six redundant pointing clues, and the schedule
shows them before the test. **INFERRED:** this is the mechanism of A_95's "chapters circle the same
information" and of pacing never reaching 9.

**It does not rank books, and that is expected.** Against the 34 contracts matched to a read, dead
chapters correlate 0.17 with pacing and 0.27 with plot, and twists −0.25 with pacing. All are under
the screen bar for nine tests at n = 34 (about 0.45). It is a WP-006 §2.6 result again: a logical
property of the schedule is a fact to fix, not a predictor of the mark. The probe's likelihood ratios
are ASSUMED. The ratio-free figure is the 85% of culprit-pointing clues owned before chapter 8.

**Textual measures of pace.** Toubia, Berger and Eliashberg (PNAS 2021) measured the *speed* of a
story as the embedding distance between consecutive chunks. Over 4,118 films, +1 SD of speed added
0.048 IMDb points against a rating SD of 1.01, a weak signal. Boyd, Blackburn and Pennebaker (*Science
Advances* 2020) found three function-word arcs across about 40,000 narratives: staging words high
early, plot-progression words rising, cognitive-tension words peaking near the climax. Both are
cheap. Neither has a study showing it moves a reader's pacing mark, so both are instruments only.

### 5.2 Exact allocation — REPORTED

| our problem (WP-006 §4.3) | the exact form | its guarantee | library |
|---|---|---|---|
| chapter word budgets that do not sum to the target | Webster (Sainte-Laguë) divisor rounding | the unique unbiased divisor method; no population paradox (Balinski & Young 1982) | 20 lines |
| a beat given to someone not on the page | assignment with forbidden pairs (cost ∞) | optimal, strongly polynomial (Kuhn 1955; Munkres 1957) | `munkres` 2.1.1 (MIT; rectangular, ∞ forbids) — **not** `hungarian-algorithm`, which is an npm security holding package |
| one chapter carries ten clues, four carry none | P \| prec \| C_max: minimise the largest load with plant-before-use as precedence | list scheduling is within 2 − 1/m of optimal (Graham 1966); exact at our size by MILP | `highs` 1.15.3 (HiGHS, MIT; Huangfu & Hall 2018); `graphology-dag` for the precedence graph |
| prose sections dropped in a fixed order | 0/1 knapsack on a measured value per section | exact by dynamic programming at token budgets; values from ablation (§6.3) | 20 lines |
| a seed whose pin shifts every later field | one stream per field keyed on (seed, name) | counter-based RNGs give ≥ 2⁶⁴ independent streams (Salmon et al., SC'11); SplitMix (Steele et al., OOPSLA 2014) | `pure-rand` (has `jump()`); `seedrandom` (string seeds; **never call it without `new`**, which replaces `Math.random`) |
| uniform draws covering pairs of settings slowly | a pairwise covering array | NASA database: 93% of faults need ≤ 2 factors; Mozilla 76%, Apache 70% (Kuhn, Wallace & Gallo 2004) | `covertable` 3.4.0 (constraints, fixed seed, reads PICT models) |
| when to stop encoding corpus works | coverage-based rarefaction | compare corpora at equal completeness, Ĉ from singletons and doubletons (Chao & Jost 2012) | R `iNEXT` 3.0.2 |

`glpk.js` is GPL-3.0; prefer `highs`. OR-Tools CP-SAT is the stronger solver but has no JavaScript
binding.

### 5.3 Who is on the page — REPORTED

BookNLP (Bamman; `pip install booknlp`, MIT, English only) clusters character names, resolves
coreference and attributes quotations to speakers. Entity F1 is 88–90, coreference F1 76–79, speaker
attribution 86–90. It takes about 2 to 15 minutes for a book of 100,000 tokens. Run over a finished
manuscript, it answers three of the owner's five needs as counts: whether each person is named and
described before they first speak, whether the victim is on the page before they die, and who speaks
in a chapter where the contract says they are absent.

---

## 6. THE PROMPT — what the literature measured about instructions

### 6.1 Count, kind and position — REPORTED and MEASURED

**Count.** IFScale (Jaroslawicz et al. 2025) gave twenty models up to 500 simple instructions.
**GPT-4.1** followed 98.0% at 10, 98.8% at 50, 95.4% at 100, 74.0% at 250 and 48.9% at 500, decaying
linearly. Its failures were mostly omissions, not distortions. Harada et al. (Findings of EMNLP 2025)
found prompt-level accuracy falls steadily with instruction count. `brief-sections.mjs` counts the v2
writer's brief: **32 list items and about 36 lines carrying a requirement word**, the same in chapter 1
and chapter 10 (MEASURED). On IFScale's curve that is the flat region. **INFERRED:** when the writer
ignores one of our requirements, the count is not the reason.

**Kind.** The house rules each have a published measurement.

| house rule | the study that measured it |
|---|---|
| obeys a count of a simple thing | IFEval (Zhou et al. 2023): verifiable instructions are what models follow best (GPT-4 83.6% per instruction); FollowBench (ACL 2024): GPT-4 falls from 84.7% to 61.9% as constraints stack on one request |
| ignores statistics (22.0 words per sentence asked, 15.86 given) | Yuan et al. 2024: GPT-4-Turbo broke word-limit instructions about half the time; LIFEBench (NeurIPS 2025): 26 models under-generate length targets systematically; Rooein et al.: models keep their own readability range whatever audience is asked for. **No study tests a words-per-sentence target**, so ours is the first record |
| a prohibition does not steer | Castricato et al. 2024: told to avoid a topic, GPT-4 fell from 0.33 to 0.13 mentions, and OpenHermes-7B *rose* from 0.33 to 0.36; Jang et al. 2023: negated prompts get *worse* as models scale; McKenzie et al. (TMLR 2023): "pattern match suppression" is a named inverse-scaling task |
| give a requirement a shape | Sclar et al. (ICLR 2024): formatting alone moves accuracy by up to **76 points**; Min et al. (EMNLP 2022): demonstrations transfer format and distribution, not content |
| voice fragments are copied | Min et al. as above; Ali et al. (EACL 2026 Findings): "copying bias" from in-context examples |

One counterweight. Yun et al. (2025, "The Price of Format") found the structural tokens of a template
govern output diversity and collapse it even at high temperature. A shape fixes compliance and may cost
variety. Tam et al. (EMNLP 2024) found JSON-mode output cut GPT-3.5's GSM8K score from 76% to 49%.
Shape the brief, not the prose.

**Position.** Liu et al. (TACL 2024) measured a U-shaped curve: information at the start or end of a
long context is used, information in the middle is lost. In one configuration, GPT-3.5 with the answer
in the middle of 20 documents scored *below* having no documents (53.8% against 56.1%). Levy, Jacoby
and Goldberg (ACL 2024) found reasoning accuracy falling from 0.92 to 0.68 as the same task was padded
from 250 to 3,000 tokens.

Our layout, MEASURED on run `bcc0d637`:

| part of the user message | chapter 1 call | chapter 10 call |
|---|---|---|
| the case, the people, the clock, the evidence, relationships | chars 0–17,300 | 0–17,300 |
| **craft block**: HOW THEY SPEAK, TWO EXCHANGES, THE PAGE, WHAT THIS BOOK DOES, LENGTH | **70–89%** of the prompt | **19–24%** of the prompt |
| the chapter's contract, then the chapters written so far | 3,000 chars (the contract only) | 71,000 chars |
| format rules ("Begin each one with a line of exactly this shape…") | last | last |
| total | 24,700 chars, ~6,200 tokens | 92,700 chars, ~23,200 tokens |

The format rules ride at the end, and memory records that this model obeys format. The craft block —
six speech-opening paragraphs, four sentences over thirty words, three em-dashes, a touchable thing in
every paragraph — starts near the end and ends up in the first quarter of a prompt four times longer. Memory records that v2's taper is per
*call position*, not per book length. **INFERRED:** Liu's curve is a candidate mechanism for that
taper, and moving or repeating the craft block after the chapters written so far is a one-line test
of it (K27).

### 6.2 Which sections are worth their tokens — REPORTED

ContextCite (Cohen-Wang et al., NeurIPS 2024) randomly removes parts of a context and fits a sparse
linear model of the output on which parts were present. Thirty-two ablations were enough. ProCut (Xu
et al. 2025) applies leave-one-out, Shapley and LASSO attribution to the sections of a prompt template,
and cut 78% of tokens in production with task performance kept. The v2 bible's `toBudget` drops whole
sections in a fixed order with no measure of their worth (WP-006 §4.4). These methods supply the
measure, using a counted instrument as the outcome rather than a read.

### 6.3 Plan, then write — REPORTED

Re3 (EMNLP 2022), DOC (ACL 2023) and Xie and Riedl's suspense planner (EACL 2024) each measured a
human-preference gain from an explicit plan before generation: DOC beat Re3 on plot coherence by
22.5%, and Xie and Riedl won 84.9% of suspense comparisons against ChatGPT. That supports the Agent 7
→ contract → Agent 9 design as it stands. It is not a lever.

---

## 7. THE KIT — K17 to K33, with the counter for each

Ordered by cost, then by what depends on what. "Counter" is the number that falsifies the item.

| # | function | job | implements / extends | study | library | cost | counter |
|---|---|---|---|---|---|---|---|
| **K17** | **clue budget before the test**: the deletion loop of §2.2 in the case-logic report, plus a contract rule that a culprit-pointing clue may show its *fact* before the test but its *conclusion* only at the test (A_109's `withheld`) | decide → allocate | WP-006 K6; the A_109 report | ZebraLogic; Ely et al. | `analyseProof`, `walkReader` | £0 build; one Agent 7 run to verify | on the next ten contracts the reader model's culprit stays under p = 0.5 until the test chapter − 1 in at least seven (today 0 of 64) |
| **K18** | **surprise ledger**: Ely surprise per chapter, the settle chapter and the dead-chapter share, printed in the case-logic report | allocate (measure) | §5.1 probe | Ely, Frankel & Kamenica; Wilmot & Keller | `reader-surprise.mjs` | £0 | report-only; it gates nothing and is never read as a predictor (§5.1: r ≤ 0.27, under the bar) |
| **K19** | **uniqueness by solver** once K3's schema paths exist: one call per suspect asks "can this person have done it?"; an unsat core names the conflicting windows when none can, and when more than one can, the windows that leave the extras open | decide | WP-006 K2, K3, K4 | Smith, Butler & Popović; Liffiton & Sakallah | `z3-solver` 5.2.0 | £0 | every K2/K3 case answers yes, no or a named core; `unknown` under 10% (today 65%); with K2 built, exactly one suspect in at least 8 of the next 10 cases (archive: 8 of 25) |
| **K20** | **Declare template catalogue** as the K6 evaluator: a rule is `{template, a, b}` and returns a three-valued verdict | decide | WP-006 K4, K6 | Pesic & van der Aalst; Bauer et al. | ~100 lines; `fast-check` | £0 | the six rules of §2.4 written with no new code; agrees with `checkOrdered` on all 64 contracts |
| **K21** | **mutation witnesses**: Stryker over the gate code (`prose-guard`, `story-validation`, `cml/case-logic`); a surviving mutant on a guard is a check that cannot fire; `knip` for no-caller exports | decide | WP-006 K5 | Just et al. 2014 | `@stryker-mutator/core` + `vitest-runner`; `knip` | £0 (CPU time) | the four dead checks of WP-006 §2.4 appear in the first report — `findings.ts:346` as a surviving or uncovered mutant, the anti-copy gate in `knip`; if they do not, the configuration is wrong, not the code clean |
| **K22** | **G-study and anchor set**: 3 books × 2 draws × 2 reads; the same 3 books re-read monthly, with the reader model recorded in the read file | estimate | WP-006 K12 | Brennan; Sunkavalli; Kohavi (A/A) | `read-icc.mjs`, extended to two facets | ~£1.35 + 12 reads | σ_draw and σ_read each with an interval; an anchor re-read moving more than 2σ_read flags a reader change before any lever is credited |
| **K23** | **screening design**: seven prose-side flags in a Plackett–Burman 8-run array on one upstream; fold-over to 16 when an effect matters | estimate | WP-006 K12; CLAUDE.md "bundle levers" | Plackett & Burman; Box, Hunter & Hunter | 30 lines (the 8×7 array is fixed) | ~£3.60 + 8 reads | per-lever SE printed, about σ/√2; any lever estimated beyond 2 SE is re-tested in a matched pair before it is credited |
| **K24** | **retrodesign on every claimed delta**: power, Type S and exaggeration ratio printed beside any lever effect taken from reads | estimate | WP-006 K7 | Gelman & Carlin; Button et al. | 15 lines | £0 | every lever claim in PLAN-TO-90 carries its exaggeration ratio; a one-pair claim under 5 marks is labelled "unmeasured" |
| **K25** | **anytime-valid ledger**: confidence sequences for K1's slopes and for sequential pairs; e-BH for sweeps | estimate | WP-006 K1, K8 | Howard et al.; Wang & Ramdas; Johari et al. | `confseq` offline, or a normal-mixture boundary in JS | £0 | no instrument loses or regains weight, and no lever is declared, from a fixed-n test that was peeked at |
| **K26** | **presence penalty**: add `presencePenalty` to the LLM client behind a default-OFF flag; one A/A pair and one pair at 0.3 | measure → lever | WP-006 K10, K11 | Martínez et al. 2024 | the Azure chat API accepts `presence_penalty`; the client and its HTTP transport each need the field | ~£0.90 | on the pair, Heaps β and house-phrase load (K10, K11) move beyond the A/A spread, with no format failure; if they do not move, the lever is withdrawn on one pair |
| **K27** | **craft block last**: move or repeat HOW THEY SPEAK, THE PAGE, WHAT THIS BOOK DOES and LENGTH after the chapters written so far, behind a flag | lever | §6.1 | Liu et al.; Levy et al. | prompt only | ~£0.45 (one matched pair) | THE PAGE's counts per chapter (six speech-opening paragraphs, four sentences over thirty words, three em-dashes), counted in the **draft**, since em-dashes are folded on save, taper less from S0 to S9 on the treated arm than on the control |
| **K33** | **the touch rule, measured**: "every paragraph has a thing in it somebody could touch" asked of one paragraph per chapter instead of every paragraph, behind a flag | lever | §4.2 | Gonen et al. (semantic leakage) | prompt only | ~£0.45 (one matched pair) | *hands*, *hand* and *set* fall back toward their pre-v2 z (4.4, 1.5, 2.8) on the treated arm, and THE PAGE's other counts hold |
| **K28** | **one category per judge call**, on the K22 books: ten calls per book, compared with the one-call read | estimate | WP-006 K13 | Stureborg et al.; Sunkavalli | none | 30 calls; **the owner's decision**, since it changes the instrument | the first principal component's share falls from 57%; if it does not, the single factor is in the books, not the format |
| **K29** | **checked craft read**: ten to fifteen yes/no craft tests (TTCW-style, plus the owner's five needs) answered per book, beside the mark | estimate | owner's five needs; A_110 | Chakrabarty et al. (TTCW); CheckEval | none | per read | the checks agree between two runs on one book (α ≥ 0.6) and at least one moves on a matched pair where the 1–10 mark does not |
| **K30** | **text instruments with published forms**: compression ratio, self-repetition and Self-BLEU together; POS-template rate; DP dispersion; Log Ratio; Cosine Delta dispersion; excess vocabulary against the canon | measure | WP-006 K10, K11 | Shaib et al. (both); Gries; Hardie; Evert et al.; Kobak et al. | `wink-nlp`; `delta-dispersion.mjs`; `diversity` offline | £0 | our within-set Delta rises from 0.31 toward 0.68, the tightest canon author; the over-used function words lose z |
| **K31** | **exact allocators**: Webster rounding for chapter budgets; `munkres` with forbidden pairs for beat-to-person; HiGHS for clue placement under precedence | allocate | WP-005 §4; WP-006 §4.3, K14 | Balinski & Young; Kuhn; Graham; Huangfu & Hall | `munkres`, `highs`, `graphology-dag` | £0 | budgets sum to the target exactly; 0 beats to absent people on 64 contracts (today 61% of wit beats); largest clue load ≤ ⌈clues ÷ chapters⌉ + 1 with every precedence kept |
| **K32** | **seed streams and covering design**: SplitMix-style key per (seed, field), and a `covertable` pairwise list for `scheduleCell` | allocate | WP-006 K15 | Salmon et al.; Kuhn, Wallace & Gallo | `pure-rand`, `covertable` | £0 | as K15; plus the published premise that pairs catch most interaction faults is tested here, by counting the defects first seen in a pair-new run |

K17, K19, K23, K26 and K27 carry the directions the whole-paper falsifier counts. K18, K22, K24, K25
and K28 are instruments on our instruments. K28 and K29 change the read, and the read is the one
instrument this project trusts. They are therefore proposals for the owner, with the cost of a
broken comparison stated.

---

## 8. WHAT NOT TO DO — WITH THE RECEIPT FOR EACH

| do not | receipt |
|---|---|
| ban the house phrases with `logit_bias` | it works per token, and token bans collapse at about 2,000 patterns (Antislop); the phrases are surface forms of templates the model refills (Shaib) |
| switch the writer to another model to cure sameness | homogeneity is stronger *across* models than within one (Artificial Hivemind) |
| ask the writer for a rate, a length or a reading level | Yuan et al., LIFEBench, Rooein et al.; VoiceSpec 22.0 → 15.86 |
| phrase a requirement as a prohibition | Castricato et al. (a 7B model mentions the banned topic *more*); Jang et al. (inverse scaling); four paid occurrences here |
| ask a reader to find plot holes in a whole book | NoCha: 41.6% on global-reasoning claims; Flawed Fictions: detection degrades with length |
| credit a lever from one matched pair | at σ = 2.72 a significant one-pair result overstates a 2-mark effect 4.6× (§3.3) |
| read a 1–10 craft mark as resolving craft | LLM judges against experts on craft tests: κ ≈ 0 (TTCW) |
| compare reads across a period without recording the reader | a same-family upgrade has moved marks by 13% of the scale (Sunkavalli); 79 of 79 read files have no model recorded |
| add drafts to the selector to raise quality | best-of-3 is 0.43 nats of pressure (Gao et al.); the selector's defect is its weights (A_110 M6) |
| compute ICC with `pingouin` on the ledger | it needs balanced data and drops any book missing a read; use `n₀` (`read-icc.mjs`) |
| cluster reads by book heading or by transitive cast overlap | 13 reads are headed "Resumed resume"; transitive linkage put 34 reads in one case (§9) |
| use `glpk.js`, `hungarian-algorithm` or `logic-solver` | GPL-3.0; an npm security holding package; no unsat cores and unmaintained since 2019 |
| use min-p | Azure does not offer it, and its gains are disputed |
| ask for a craft habit in *every* paragraph | the touch rule: *hands* 4.4 → 6.0, *hand* 1.5 → 3.9, *set* 2.8 → 4.9 z after it landed (§4.2) |
| read the surprise ledger (K18) as a pacing score | r ≤ 0.27 against the read on 34 contracts, under the screen bar; it is a schedule fact (WP-006 §2.6) |

---

## 9. TRANSFER, PREMISES THAT TURNED OUT FALSE, AND WHAT WAS NOT DETERMINED

**Transfer.** The logic and allocation results transfer without loss. A timetable is a temporal
network whatever genre it sits in, and an assignment problem is the same at any size. The judge studies
transfer in direction only. Their texts are a tenth of our length, their judges mostly earlier models,
and their raters human experts where we have none. The text studies transfer best where they measured
GPT-family output (Martínez, Sun, Kobak, IFScale) and least where they measured open models with
logit access (Antislop, min-p). Our canon is 1890–1935 prose, so any "over-used" figure mixes habit
with period; Delta on function words is the measure least exposed to that.

**Premises on file that the measurements contradict or weaken.**

1. **"The reader's error is ±1"** (PLAN-TO-90 §11.3) rests on one pair. The three cases read more than
   once since fresh names give a within-case SD of 2.72 (CI 1.6–7.8). That is an upper bound, since
   levers differ inside it, so it does not refute ±1. But it is the only multi-case figure, and it sits
   at CLAUDE.md's ±3.
2. **"Effective n is lower than printed everywhere"** (WP-006 §7). True, but by about a quarter since
   fresh names (design effect 1.35), not by the factor that clustering by cast name implied.
3. **"Too many instructions"** as an explanation for an ignored requirement. The brief carries about
   35, where GPT-4.1 follows 98% of simple instructions.
4. **"Bundle levers so one read scores several."** As written, the rule confounds them. The design that
   does what the rule intends is §3.4's.
5. **My own first two clusterings for §3.2** were wrong. Transitive linkage on cast names merged 34
   pre-September reads into one "case" (ICC 0.27, design effect 5.6). Clustering by book heading
   merged the 13 reads headed "Resumed resume". Both were caught by printing the clusters. The figures
   above come from complete linkage after 2026-09-07.

**Not determined.**

- Whether the single factor in the read is the one-call format or the books (K28 settles it).
- Whether the reader changed model around 1 September. No record exists. K22's anchor set prevents
  the question from recurring; it cannot answer it retrospectively.
- Whether the craft block's position causes the per-call taper (K27 tests it on one pair).
- Whether holding pointing conclusions to the test chapter reads better. The surprise ledger does not
  predict the mark, and nothing here claims it will. K17's counter is a logical one for that reason.
- Whether the reader-model ratios (ASSUMED) are anywhere near a human reader's. The ratio-free figure,
  85% of culprit-pointing clues owned before chapter 8, does not depend on them.
- Whether Delta sameness is visible to a reader. It separates us from every canon author. No read has
  been scored against it.
- Whether presence penalty helps long-form fiction. The only measurement is on chat answers.
- Which ChatGPT model produced any read.

---

## 10. SOURCES

Grouped by section. Every entry was checked on 2026-10-03 (WF-004). "Preprint" marks work with no
confirmed peer-reviewed venue.

**Decide.** Lin, Le Bras, Richardson, Sabharwal, Poovendran, Clark, Choi, "ZebraLogic", ICML 2025
(arXiv 2502.01100). Sprague, Ye, Bostrom, Chaudhuri, Durrett, "MuSR", ICLR 2024 (arXiv 2310.16049).
Del and Fishel, "True Detective", *SEM 2023. Pan, Albalak, Wang, Wang, "Logic-LM", Findings of EMNLP
2023. Ye, Chen, Dillig, Durrett, "SatLM", NeurIPS 2023. Olausson et al., "LINC", EMNLP 2023. Smith and
Mateas, "Answer Set Programming for Procedural Content Generation", IEEE TCIAIG 3(3), 2011. Smith,
Butler and Popović, "Quantifying over Play", FDG 2013. Barros, Green, Liapis, Togelius, "Who Killed
Albert Einstein?", IEEE Trans. Games 11(1), 2019. Demaine et al., "The Fewest Clues Problem", FUN 2016.
Riedl and Young, "Narrative Planning", JAIR 39, 2010. Dechter, Meiri and Pearl, "Temporal Constraint
Networks", AI 49, 1991. Dung, AI 77, 1995. Reiter, AI 32, 1987. Liffiton and Sakallah, J. Automated
Reasoning 40, 2008. Liffiton, Previti, Malik, Marques-Silva, "Fast, Flexible MUS Enumeration",
Constraints 21, 2016. Pesic and van der Aalst, BPM Workshops 2006; Pesic, Schonenberg, van der Aalst,
EDOC 2007. De Giacomo and Vardi, IJCAI 2013. Bauer, Leucker and Schallhart, ACM TOSEM 20(4), 2011.
Just et al., "Are Mutants a Valid Substitute for Real Faults?", FSE 2014. Jia and Harman, IEEE TSE 37,
2011. Papadakis et al., Advances in Computers 112, 2019. Claessen and Hughes, "QuickCheck", ICFP 2000.
Ahuja et al., "Finding Flawed Fictions", CoLM 2025 (arXiv 2504.11900). Karpinska, Thai, Lo, Goyal,
Iyyer, "One Thousand and One Pairs" (NoCha), EMNLP 2024. Kim et al., "FABLES", CoLM 2024.

**Estimate.** Stureborg, Alikaniotis, Suhara, "Large Language Models are Inconsistent and Biased
Evaluators", preprint 2024 (arXiv 2405.01724). Sunkavalli, "LLM Judges as Raters", preprint 2026 (arXiv
2608.29517). Chakrabarty, Laban, Agarwal, Muresan, Wu, "Art or Artifice?", CHI 2024. Lee et al.,
"CheckEval", EMNLP 2025. Cook et al., "TICKing All the Boxes", NeurIPS 2024 workshop (arXiv
2410.03608). Chhun, Colombo, Suchanek, Clavel, "Of Human Criteria and Automatic Metrics" (HANNA),
COLING 2022. Chhun, Suchanek, Clavel, "Do Language Models Enjoy Their Own Stories?", TACL 12, 2024.
Fein et al., "LitBench", 2025 (arXiv 2507.00769; listed for EACL 2026, venue not confirmed).
Panickssery, Bowman, Feng, "LLM Evaluators Recognize and Favor Their Own Generations", NeurIPS 2024.
Zheng et al., "Judging LLM-as-a-Judge", NeurIPS 2023 D&B. Wang et al., "Large Language Models are not
Fair Evaluators", ACL 2024. Chiang and Lee, ACL 2023. Liu et al., "G-Eval", EMNLP 2023. Schroeder and
Wood-Doughty, preprint 2024 (arXiv 2412.12509). Haldar and Hockenmaier, "Rating Roulette", Findings of
EMNLP 2025. Gao, Schulman, Hilton, "Scaling Laws for Reward Model Overoptimization", ICML 2023.
Manheim and Garrabrant, "Categorizing Variants of Goodhart's Law", preprint (arXiv 1803.04585). Shrout
and Fleiss, Psych. Bulletin 86(2), 1979. Koo and Li, J. Chiropractic Medicine 15(2), 2016. Hayes and
Krippendorff, Communication Methods and Measures 1(1), 2007. Cronbach, Gleser, Nanda, Rajaratnam,
*The Dependability of Behavioral Measurements*, Wiley 1972. Brennan, *Generalizability Theory*,
Springer 2001. Spearman, Am. J. Psych. 15, 1904. Hunter, Schmidt and Le, J. Applied Psych. 91, 2006.
Kish, *Survey Sampling*, Wiley 1965. Cameron and Miller, J. Human Resources 50(2), 2015; Cameron,
Gelbach and Miller, Rev. Econ. Stat. 90(3), 2008. Westfall and Young, *Resampling-Based Multiple
Testing*, Wiley 1993. Wang and Ramdas, "False discovery rate control with e-values", JRSS B 84(3), 2022.
Gelman and Carlin, Perspectives on Psych. Science 9(6), 2014. Button et al., "Power failure", Nature
Rev. Neuroscience 14, 2013. Barnett, van der Pols, Dobson, Int. J. Epidemiology 34(1), 2005. Plackett
and Burman, Biometrika 33(4), 1946. Box, Hunter and Hunter, *Statistics for Experimenters*, 2nd ed.,
Wiley 2005. Jones and Nachtsheim, J. Quality Technology 2011 (volume and pages not confirmed). Kohavi,
Tang and Xu, *Trustworthy Online Controlled Experiments*, CUP 2020. Deng, Xu, Kohavi, Walker, "CUPED",
WSDM 2013. Johari, Koomen, Pekelis, Walsh, Operations Research 70(3), 2022. Howard, Ramdas, McAuliffe,
Sekhon, Annals of Statistics 49(2), 2021. Ramdas, Grünwald, Vovk, Shafer, Statistical Science 38(4),
2023. Page, "Continuous Inspection Schemes", Biometrika 41, 1954. Bifet and Gavaldà, "ADWIN", SDM 2007.
Adams and MacKay, "Bayesian Online Changepoint Detection", preprint 2007. Audibert, Bubeck and Munos,
"Best Arm Identification in Multi-Armed Bandits", COLT 2010. Russo et al., "A Tutorial on Thompson
Sampling", FnT ML 11(1), 2018.

**Measure the page.** Sun, Yin, Xu, Kolter, Liu, "Idiosyncrasies in Large Language Models", ICML 2025.
Shaib, Elazar, Li, Wallace, "Detection and Measurement of Syntactic Templates in Generated Text", EMNLP
2024. Shaib et al., "Standardizing the Measurement of Text Diversity", IJCNLP-AACL 2025 System
Demonstrations (arXiv 2403.00553). Lu et al., "AI as Humanity's Salieri", ICLR 2025. Kirk et al.,
"Understanding the Effects of RLHF on LLM Generalisation and Diversity", ICLR 2024. Juzek and Ward,
COLING 2025. Kobak, González-Márquez, Horvát, Lause, *Science Advances* 11(27), 2025. Jiang et al.,
"Artificial Hivemind", NeurIPS 2025 D&B. Xu, Jojic, Rao, Brockett, Dolan, "Echoes in AI", PNAS 2025.
Gonen et al., "Semantic Leakage", NAACL 2025. Padmakumar and He, ICLR 2024. Martínez, Hernández, Conde,
Reviriego, Merino, "Beware of Words", ACM TIST 2024. Paech, Roush, Goldfeder, Shwartz-Ziv, "Antislop",
preprint 2025 (arXiv 2510.15061). Nguyen et al., "Min-p Sampling", ICLR 2025, with the reanalysis
"Min-p, Max Exaggeration", preprint 2025 (arXiv 2506.13681). Chakrabarty, Laban, Wu, "Can AI writing be
salvaged?", CHI 2025. Holtzman et al., ICLR 2020. Xu et al., "Learning to Break the Loop", NeurIPS
2022. Tweedie and Baayen, Computers and the Humanities 32(5), 1998. Baayen, *Word Frequency
Distributions*, Kluwer 2001. Evert and Baroni, "zipfR", ACL 2007 demo. Gries, IJCL 13(4), 2008, with
Lijffijt and Gries, IJCL 17(1), 2012. Hardie, "Log Ratio", CASS 2014. Kilgarriff, "Simple maths for
keywords", Corpus Linguistics 2009. Burrows, "Delta", LLC 17(3), 2002. Evert et al., "Understanding
and explaining Delta measures", DSH 32 (suppl. 2), 2017. Eder, Rybicki, Kestemont, "Stylometry with
R", R Journal 8(1), 2016. Lee et al., "Deduplicating Training Data Makes Language Models Better", ACL
2022. Broder, "On the resemblance and containment of documents", 1997. Liu et al., "Infini-gram", CoLM
2024.

**Allocate.** Ely, Frankel, Kamenica, "Suspense and Surprise", J. Political Economy 123(1), 2015.
Wilmot and Keller, ACL 2020. Frermann, Cohen, Lapata, "Whodunnit?", TACL 6, 2018. Wagner, Keydar,
Abend, "The Challenge and Reward of Fair Play in Narrative", preprint 2025 (arXiv 2507.13841). Toubia,
Berger, Eliashberg, PNAS 118(26), 2021. Boyd, Blackburn, Pennebaker, *Science Advances* 6(32), 2020.
Reagan et al., EPJ Data Science 5, 2016. Piper, So, Bamman, EMNLP 2021. Balinski and Young, *Fair
Representation*, Yale UP 1982. Kuhn, Naval Research Logistics Quarterly 2, 1955. Munkres, J. SIAM 5(1),
1957. Graham, Bell System Technical Journal 45(9), 1966; Graham, SIAM J. Applied Math 17(2), 1969;
Graham, Lawler, Lenstra, Rinnooy Kan, Annals of Discrete Math 5, 1979. Huangfu and Hall, Math.
Programming Computation 10(1), 2018. Salmon, Moraes, Dror, Shaw, SC'11. Steele, Lea, Flood, OOPSLA
2014. Kuhn, Wallace and Gallo, IEEE TSE 30(6), 2004. Cohen, Dalal, Fredman, Patton, "AETG", IEEE TSE
23(7), 1997. Hsieh, Ma, Chao, "iNEXT", Methods in Ecology and Evolution 7, 2016. Chao and Jost,
Ecology 93(12), 2012.

**The prompt.** Jaroslawicz, Whiting, Shah, Maamari, "How Many Instructions Can LLMs Follow at Once?"
(IFScale), NeurIPS 2025 workshop (arXiv 2507.11538). Harada et al., "When Instructions Multiply",
Findings of EMNLP 2025. Jiang et al., "FollowBench", ACL 2024. Zhou et al., "IFEval", preprint 2023.
Yuan et al., "Following Length Constraints in Instructions", preprint 2024. Zhang et al., "LIFEBench",
NeurIPS 2025 D&B. Rooein, Cercas Curry, Hovy, preprint 2023. Jang, Ye, Seo, PMLR 203, 2023. Truong,
Baldwin, Verspoor, Cohn, *SEM 2023. McKenzie et al., "Inverse Scaling", TMLR 2023. Castricato et al.,
"Suppressing Pink Elephants", preprint 2024. Sclar, Choi, Tsvetkov, Suhr, ICLR 2024. Tam et al., "Let
Me Speak Freely?", EMNLP 2024 Industry. Min et al., "Rethinking the Role of Demonstrations", EMNLP
2022. Ali, Wolf, Titov, Findings of EACL 2026. Yun et al., "The Price of Format", preprint 2025. Liu et
al., "Lost in the Middle", TACL 12, 2024. Levy, Jacoby, Goldberg, ACL 2024. Cohen-Wang, Shah,
Georgiev, Madry, "ContextCite", NeurIPS 2024. Xu, Li, Chen, Wang, "ProCut", preprint 2025. Jiang et al.,
"LLMLingua", EMNLP 2023. Yang et al., "Re3", EMNLP 2022; "DOC", ACL 2023. Xie and Riedl, "Creating
Suspenseful Stories", EACL 2024. Huot et al., "Agents' Room", ICLR 2025.

---

## Probes

`documentation/white-papers/WP-007-probes/` — run from the repo root after `npm run build:all`; all
read-only.

| script | produces |
|---|---|
| `clue-necessity.mjs` | §2.2 (with its known positive) |
| `reader-surprise.mjs` | §5.1, with the ratio-free and weak-ratio checks |
| `delta-dispersion.mjs [all\|read] [YYYYMMDD]` | §4.2 (run as `all` for the 40-case table, `all 20260922` for v2 only) |
| `read-icc.mjs` | §3.2 |
| `brief-sections.mjs` | §6.1 (reads the tail of `logs/llm-prompts-full.jsonl`) |

The arithmetic of §3.2–§3.5 (ceilings, retrodesign, Plackett–Burman, best-of-n KL) is in the tables
and needs no script beyond the formulas cited.

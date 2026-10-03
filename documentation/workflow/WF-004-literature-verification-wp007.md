# WF-004 — literature verification for WP-007

**Run:** six read-only research agents, launched together (Agent tool, not a Workflow script) · **Date:** 2026-10-03
**Agents:** 6 · **Subagent tokens:** 984,786 as reported at completion (156,314 + 141,339 + 191,806 + 172,396 + 141,836 + 181,095). Five agents were stopped by a session rate limit and two of those again by a session restart; each was resumed from its transcript, and the reported figures cover the final segment, so the true total is higher
**Duration:** about two hours of wall clock, including both interruptions · **Script:** none — the six briefs are summarised under "The question"
**Tree:** `cd1577e1` · **Consumer:** [WP-007](../white-papers/WP-007-prior-art-decide-estimate-allocate.md)

---

## The question

For a white paper extending WP-006 into the published literature: **for each job — decide, estimate,
allocate — which studies measured the failures this project measured, what fixed them, and which
library implements the fix?** One agent per area, each given a list of candidate citations to confirm
and asked for the key measured finding with numbers, plus up to five relevant studies it found itself.

| agent | area |
|---|---|
| 1 | logic and formal methods: neurosymbolic reasoning, mystery and puzzle generation, LTLf and Declare, MUS, mutation and property testing; z3-solver, clingo-wasm, Stryker, knip |
| 2 | LLM-as-judge: bias, reliability, halo, story and book-length evaluation, best-of-n overoptimisation, Goodhart |
| 3 | statistics: ICC, G-theory, attenuation, design effect, maxT, A/A, CUPED, anytime-valid inference, CUSUM/ADWIN, retrodesign, screening designs, bandits; JS and Python libraries |
| 4 | LLM text: homogenisation, templates, excess vocabulary, slop, decoding controls, LNRE, dispersion, keyness, Delta, deduplication; Python, R and npm libraries |
| 5 | instruction following: long context, instruction count, length constraints, negation, format, demonstrations, prompt attribution, plan-then-write |
| 6 | narrative mathematics and operations research: suspense and surprise, story shape, BookNLP, detective fiction, apportionment, assignment, scheduling, RNG streams, covering arrays, rarefaction; JS and Python libraries |

Rule in every brief: mark anything not confirmed as UNVERIFIED, and never guess a citation detail.

## Findings that SURVIVED verification

Every citation in WP-007 §10 was confirmed by at least one agent against arXiv, ACL Anthology, CrossRef,
PMLR, a publisher page, PyPI, CRAN or the npm registry. The results WP-007 leans on hardest:

| finding | source as checked |
|---|---|
| GPT-4o solves 80.0 / 19.6 / 2.5 / 0.5% of logic grids by search-space size; puzzles certified unique by deleting clues under a SAT solver | ZebraLogic, ICML 2025, arXiv 2502.01100 |
| GPT-4 38% on detective puzzles alone, 83% given the golden reasoning chain | True Detective, *SEM 2023 |
| aspects scored in one output correlate r = 0.979 (GPT-4) against 0.315 for experts | Stureborg et al., arXiv 2405.01724 |
| LLM judges against expert craft judgements: κ close to zero on 14 yes/no tests | Chakrabarty et al., CHI 2024 |
| GPT-4.1 as judge agrees with human preference 70.2% on short fiction | LitBench, arXiv 2507.00769 |
| GPT-4.1 follows 98.0 / 98.8 / 95.4 / 74.0 / 48.9% of 10 / 50 / 100 / 250 / 500 instructions | IFScale, arXiv 2507.11538 |
| lexical diversity of GPT-3.5/4 rises with presence penalty; frequency penalty breaks text at ≥ 1.0 | Martínez et al., ACM TIST 2024 |
| Azure's chat request body has no `min_p` and no `top_k` | learn.microsoft.com Azure OpenAI chat reference |
| token banning unusable at ~2,000 patterns | Antislop, arXiv 2510.15061 |
| best-of-n gold score d(α − βd), KL = ln n − (n − 1)/n | Gao, Schulman, Hilton, ICML 2023 |
| optimal-suspense plot: uncertainty falls linearly, twists late, large and rare | Ely, Frankel, Kamenica, JPE 2015 (full text) |
| 93% of NASA database faults need ≤ 2 interacting factors | Kuhn, Wallace, Gallo, IEEE TSE 2004 (via NIST's table) |
| `z3-solver` 5.2.0 exposes `unsatCore()` and `Optimize`; needs `killThreads()` in Node | npm registry and its type definitions |
| no JavaScript ICC or mixed-model package exists on npm | registry search (not exhaustive) |

## Findings REFUTED, corrected or narrowed, and why

| as briefed or first returned | correction |
|---|---|
| Audibert & Bubeck, COLT 2010 | three authors: **Audibert, Bubeck & Munos** |
| Shaib et al., "Standardizing the Measurement of Text Diversity", arXiv 2024 | published at **IJCNLP-AACL 2025 System Demonstrations**, title slightly changed |
| Harada et al., "Curse of Instructions" (ICLR 2025 submission) | OpenReview blocked; only partly confirmed. WP-007 cites the published successor, Findings of EMNLP 2025 |
| Doshi & Hauser's percentages (+8.1% novelty, 10.7% more similar) | from press releases, not the paper — **not used** |
| min-p sampling gains (ICLR 2025) | disputed by a 2025 reanalysis (arXiv 2506.13681); cited with it |
| npm `hungarian-algorithm` | an **npm security holding package**, not a library |
| PyPI `spot` | unrelated package; Spot (the LTL library) is not on PyPI |
| `logic-solver` for uniqueness cores | no unsat-core API; last pushed 2019 |
| R `safestats` | CRAN has flagged it for archiving on 2026-10-05 |
| `pingouin.intraclass_corr` for the ledger | balanced data only; drops any book missing a read |
| a summarised fetch of Wang et al.'s accuracy/kappa table | did not match the paper and was discarded by the agent; the figures WP-007 uses were re-read from the text |
| "LLM judges at book length" via Suri, StoryER, WritingBench, HelloBench | not checked; NoCha and FABLES used instead |

Details confirmed only in part, and so not leaned on: Boyd, Blackburn & Pennebaker's figures (403);
Balinski & Young's quota-violation frequency; Button et al.'s inflation percentages; Jones & Nachtsheim's
volume and pages; Koo & Li's bands (secondary sources); Agents' Room win rates; LitBench's venue; Antislop's
venue; the authors of arXiv 2508.00086 and 2506.13681; "Nine Judges, Two Effective Votes" and Xiao et al.
2023 (search snippets only); Detective ToM (arXiv 2505.03770).

## What the run could NOT determine

- **No published study tests a words-per-sentence or other stylometric target.** VoiceSpec's 22.0 →
  15.86 is, as far as the agents found, the only record.
- **No peer-reviewed whodunit generator proves a unique culprit** with SAT, ASP or CP. Hobby generators
  exist.
- **No peer-reviewed study of presence or frequency penalty on 8,000+ token creative text.** Martínez et
  al. measured chat answers.
- Whether Wagner, Keydar & Abend's fair-play framework (arXiv 2507.13841) has a venue.

## Expand / skip

**Skip a repeat.** The verified bibliography is WP-007 §10 and this file. A later paper should cite
from them rather than pay for the search again. **Expand only** on two gaps a study could close: a
stylometric-target compliance study (our VoiceSpec result is publishable as one), and a long-form
penalty study, which K26 runs on our own books.

Process note for the next literature run: brief agents to write their report to a scratch file as they
go. Four of six were cut off by the session limit, and only resumption from transcript saved the work.

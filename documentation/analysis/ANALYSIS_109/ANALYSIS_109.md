# ANALYSIS_109 — Formal methods for the faults readers keep naming

**2026-09-25 · £0 to write · nothing here is built yet.** Every recurring complaint the external readers
make is matched to an established mathematical or algorithmic method that decides it EXACTLY,
where the pipeline today asks an LLM to get it right and checks afterwards with regexes. Each section
states the fault and how often it recurs, the method and its source, where it plugs into the pipeline,
what it resolves, what it cannot, its cost, and what would falsify it.

Frequencies are keyword counts over the 71 external reviews in `stories/` before the 74. They are
**INFERRED** upper bounds: a review can mention a word while praising. Everything else is **MEASURED**
unless marked.

**The design principle, taken from WP-001 and this session:** the model complies with OPERATIONS and
ignores STATISTICS; a line available to every chapter recurs; a detector that points only down cannot
lift a mark. So every method below does one of three things: it **decides a fact before the writer
sees it** (so the writer copies a correct answer), **turns a choice into a selection among candidates**,
or **measures upward**. None of them adds a banned-phrase list.

---

## Summary

| # | fault (reviews) | method | stage | resolves | cost |
|---|---|---|---|---|---|
| M1 | timeline unclear / contradictory (22) | **Simple Temporal Network**, Floyd–Warshall | after Agent 3, before 5 | contradictions become impossible; one canonical timeline, the act as a window | £0 build, deterministic |
| M2 | culprit obvious / early (22) | **Bayesian reader model**: posterior over suspects per chapter, entropy schedule | Agent 5 placement | culprit-pointing clues moved behind the test; suspense kept measurable | £0 build; one paid harness |
| M3 | too many mechanisms; list-like reveal (5 + 3) | **Dung argumentation framework** + **minimum hitting set** | Agent 3 check; reveal contract | the smallest proof that eliminates every innocent; the reveal says exactly that | £0 |
| M4 | geography / route unclear (4) | **reachability graph**, shortest path (BFS) | Agent 2c/7.5 | a route the reader can follow, stated once as a path | £0 |
| M5 | paraphrased repetition, recaps (64 + 20) | **MinHash / Jaccard shingles**, optionally embeddings | v2 checkers + guard | restated alibis and clue logic caught, not only verbatim copies | £0 |
| M6 | catchphrases as tags; flat voices (19) | **Verbalized Sampling** + **Determinantal Point Process** selection | Agent 2b tics; any unforced choice | distinct lines chosen from a distribution, not the mode | pennies per stage |
| M7 | our instructions printed (34) | **logit bias** on the writer call, driven by our own echo list | v2 writer | the printed labels cannot be sampled | £0; a flag |
| M8 | no instrument points up (WP-001 §4.1) | **MAUVE** against the canon corpus; distinct-n; surprisal | ship-check | a number that rises when the prose improves | £0 per book |

---

## M1 — The timeline as a Simple Temporal Network

**The fault.** 22 reviews ask for "one authoritative timeline"; the 74's reader wrote it out for us
(9:00–10:00 alibis, 10:10–10:45 the act, 11:30 the ink, after 11:30 the letter). The pipeline holds times as
free-text rows (`buildChronologyTable`), and nothing checks that they can all be true together — so the
book says 10:10–10:45 in one chapter and "after half past eleven" as the time of death in another.

**The method.** A Simple Temporal Network (Dechter, Meiri & Pearl, 1991) represents events as time-points
and every statement "B happened between *l* and *u* minutes after A" as an edge pair A→B weight *u*,
B→A weight −*l*. The network is consistent **iff its distance graph has no negative cycle**; Floyd–Warshall
decides it in O(n³) and, when consistent, returns the **minimal network**: the tightest earliest/latest
bound for every event. [1][2]

**How it works here.**
1. Every timed fact in the CML — alibi windows, the act, discovery, locked clock values, delivery times,
   the false apparent time — becomes a time-point pair with bounds (an alibi 9:00–10:00 is two points).
2. Floyd–Warshall on a dozen to thirty points is instant.
3. **A negative cycle names the contradiction exactly**: the cycle's edges ARE the statements that
   cannot all hold. That is a repair instruction for Agent 3/4, not a vague "timeline unclear".
4. When consistent, the minimal network yields **the canonical timeline**: each event with its tightest
   window. It goes into the bible ONCE as THE CLOCK, and the act's window is its two bounds — which is
   exactly the "window, not an instant" readers asked for (P1.4) and the contract already renders.
5. The false timeline (what the culprit wants believed) is a second network. The discriminating test is,
   formally, a fact that makes the false network inconsistent — so the test can be CHECKED to break it.

**Resolves.** Contradictory times on the page; the "10:10 or 11:30?" confusion; a test that doesn't
actually break the alibi. **Cannot** resolve prose that misstates a correct time — the clock guard does.
**Cost:** £0; a pure function next to `deriveCaseChronology`. **Falsified if** the next ten reads still
name the timeline while the network is consistent: then the fault is presentation, not logic.

---

## M2 — A reader model: who does the reader suspect after each chapter?

**The fault.** 22 reviews say the culprit is guessable or tied to the evidence early. MEASURED this
session: in 4 of 4 golden contracts, clues whose observable names the culprit are owned by chapters
4–7, the test at 8. In the 69, "the duplicate study key was recently found with Leonard Pike" is chapter 4.

**The method.** Cheong & Young's Suspenser models suspense as a function of the reader's beliefs about
how many solutions remain, and chooses story content to manipulate it [3]. The detective-fiction form of
that is a Bayesian posterior over suspects: start uniform; each clue *c* updates
P(s | clues) ∝ P(s) · P(c | s), where P(c | s) is how well clue *c* fits suspect *s* being guilty. The
**Shannon entropy** H = −Σ P(s) log P(s) is the reader's uncertainty. A fair mystery keeps H high until the
test and collapses it at the test; a telegraphed one collapses it early.

**How it works here.**
1. Each clue gets a likelihood row over suspects. It can be derived without an LLM from what the case
   already says: `pointsTo`, `supportsInferenceStep`, and whether the observable names a suspect (the
   `clue_culprit_direct_*` ids are exactly the ones that point). Elimination clues set P(c | s) ≈ 0 for the
   cleared suspect; red herrings point at the false suspect.
2. Walk the chapters in contract order; record H after each.
3. **The schedule constraint:** H must not fall below a floor (say, 1 bit — two live suspects) before the
   test chapter, and must reach ~0 at the reveal. A clue that breaks the floor is moved to the test chapter
   or later, or paired with a red herring in the same chapter so the posterior stays split.
4. The same numbers give the false solution its due: at the midpoint, the false suspect should hold the
   largest posterior. That is checkable too.

**Resolves.** Early culprit exposure as a SCHEDULE, fixed before prose; suspense stated as a number the
contract can hold. **Cannot** judge whether the reader finds a clue subtle — the likelihoods are coarse.
**Cost:** £0 to build; one paid Agent 5 harness to confirm the moves don't break fair play (Agent 6).
**Falsified if** books with a kept floor are still called "obvious" at the same rate.

---

## M3 — The proof as an argumentation framework; the reveal as a minimum hitting set

**The fault.** "Too many mechanisms" (5) and "the reveal is a list" (3) — rare, but they cost the
plot/clue marks on the books they hit, and the 74's reader wrote the fix: three locks — letter, key, dust.

**The method.** A Dung framework is a set of arguments with an attack relation; the **grounded extension**
is the unique minimal set of arguments that defends itself, computable in polynomial time [4]. Here:
arguments are "suspect *s* is innocent" and "clue *c* shows ¬alibi(*s*)"; clues attack alibis. The case
is sound iff the grounded extension contains "culprit guilty" and every innocent's clearance.

The **minimum hitting set** over "which clues eliminate which false explanations" is the smallest set of
clues that together rule out every innocent and every false mechanism — the proof's irreducible core.
NP-hard in general, trivial at mystery scale (≤ 20 clues, brute force or greedy).

**How it works here.**
1. Build the framework from CML: suspects, alibis, clues, the false solution.
2. Compute the grounded extension. If the culprit is not in it, the case does not prove itself —
   a fair-play failure caught before prose.
3. Compute the minimum hitting set. If it has more than three or four elements, the case is "busy":
   report it to Agent 3/4 as a measured fact.
4. **The reveal contract names exactly the hitting set**, in order, each with what it breaks ("the letter
   breaks the time; the key breaks the locked room; the dust breaks Wentworth's alibi") — the shape the
   reader asked for, derived from the case rather than templated.

**Resolves.** A reveal that lands its irreducible proof rather than listing every clue; an objective
"busy case" measure. **Cannot** make a case elegant — it measures, Agent 3 still has to simplify.
**Cost:** £0. **Falsified if** hitting-set size does not relate to plot/clue marks over the next reads
(the ledger's compound-test result, 74 vs 78 at n=3, says the effect may be small).

---

## M4 — Geography as a graph

**The fault.** Four reviews, but the 74's reader spent a paragraph on it: "Why does the ladder matter to
the locked study?"

**The method.** Locations as nodes, passages as edges annotated with access rules and who can use them
(Agent 2c's `accessControl` already states them). Breadth-first search gives the shortest path from the
culprit's alibi location to the victim and back; a path that only exists through a secret edge IS the
locked-room trick.

**How it works here.** Build the graph from location profiles plus the mechanism; check the culprit's
path exists inside the act window (M1 gives the time budget per edge); render the path once in the
reveal contract as a route: "the study door → the service passage → the dig ladder". Agent 7.5
(`@cml/story-geometry`) is the natural owner.

**Resolves.** An unexplained route; a route that could not be walked in the window. **Cost:** £0.
**Falsified if** route complaints persist with a stated path.

---

## M5 — Paraphrased repetition, measured with MinHash

**The fault.** Repetition is the commonest complaint (64 of 71); clue recaps 20. This session's checkers
catch VERBATIM copies — sentences, six-word runs inside a paragraph. What they miss is the restatement:
Margot's alibi "nine o'clock to ten o'clock, sixty minutes" said in four chapters in four different
sentences.

**The method.** MinHash (Broder, 1997) estimates the Jaccard similarity of two texts' shingle sets from
short signatures; LSH buckets make it near-linear [5]. Jaccard over word 3-shingles with stop words
removed, threshold ~0.5, finds sentences that say the same thing in rearranged words.

**How it works here.**
1. Every sentence of the book is shingled; LSH finds pairs above threshold in different paragraphs.
2. Pairs that share a clue's key terms or a suspect's alibi window are **recaps**: the finding names both
   places and the chapter that owns the fact (the contract already knows who owns each clue and
   clearance), and the editor keeps the owner's version and cuts the other to a reference.
3. The same measure as a guard: an edit may not raise the book's count of near-duplicate pairs.

**Resolves.** Restated clue logic and alibis — the paraphrase half of the repetition complaint.
**Cannot** tell a deliberate callback from a recap; owned-fact matching keeps it to case facts.
**Cost:** £0, milliseconds. **Falsified if** repetition complaints do not fall with near-duplicate pairs.

---

## M6 — Voices as a selection, not a first answer

**The fault.** Catchphrases read as tags (19); WP-001 §2.1 counted 23% of 377 archived tics opening
"One must…" and 79 literal duplicates across books. Owning each tic to one chapter (§06 F9) reduced the
count; it cannot make "Let's cut to the chase" distinctive.

**The method.** **Verbalized Sampling** (Zhang et al., 2025): ask for *k* candidates with their
probabilities in one call; mode collapse comes from typicality bias in preference data, and asking for a
distribution recovers the pre-alignment spread [6]. Then choose the SET of lines (one per character)
with a **Determinantal Point Process**: DPPs select subsets that maximise the determinant of a similarity
kernel, i.e. quality times mutual difference; k-DPPs beat MMR on human-judged diversity [7].

**How it works here.**
1. Agent 2b asks for *k* = 5 tics per character, each with a probability, and forbids nothing.
2. Embed every candidate (or use character n-grams if no embedding call is wanted).
3. Drop candidates whose verbalised probability is highest (the mode) or that match the archive's tic
   census (WP-001 §2.1's 377) above a Jaccard threshold.
4. Select one per character with a greedy k-DPP over the remaining: every chosen line is as different as
   possible from the others AND from the archive.
The same pattern applies to every "unforced choice" WP-001 O6 lists: the opening, the formative
incident, the scene inventory.

**Resolves.** Tics that repeat across characters and across books; the flat, shared voice.
**Cost:** a few pence per stage (one call with *k* outputs). **Falsified if** WP-001 §8's test fails: the
tic template share falls and the dialogue mark stays at 6–7.

---

## M7 — Stopping our own labels at the sampler

**The fault.** This session found our instructions printed in four rounds ("spoke at length", "carried
nothing the plot needed", "could not have done before the arrest", "the last paragraph belonged to…").
Each fix rewrote the source and a detector caught the residue — the WP-001 §4.3 ratchet in miniature.

**The method.** The writer's endpoint (Azure OpenAI) accepts `logit_bias`: a map from token id to a bias
in −100…100 added to the logits before sampling; −100 is a ban [8]. Banning a PHRASE means banning its
distinctive tokens in their spaced and capitalised variants — whole phrases cannot be targeted, and a
common word cannot be banned without collateral [9].

**How it works here.** Only for RARE tokens that are ours and never the book's — the humour-style
labels ("savagery", "deadpan", "sardonic") and scaffold tokens ("contract", "beat"). The phrase leaks this
session found are built from common words ("at length", "the plot", "before the arrest"); banning those
words would cut legitimate prose. **So M7 suits the single-token label class, not the phrase leaks** —
recorded so it is not rediscovered as a cure-all.

**Cost:** £0; a flag on the writer call. **Falsified if** a banned label still appears (it cannot, by
construction) — the real risk is collateral on legitimate uses.

---

## M8 — An instrument that points up

**The fault.** WP-001 §4.1: every instrument we own detects a defect, so a clean book scores 7 on prose
and nothing tells us a change made it better before a read is paid for.

**The method.** **MAUVE** compares the distribution of generated text with human text in a quantized
embedding space via divergence frontiers, and tracks human judgements better than earlier metrics [10].
The project holds 720,000 words of period canon (A_79 §13) — the human distribution. Cheaper companions:
distinct-n (lexical diversity), and mean surprisal per token where the endpoint returns log-probabilities
(WP-001 §6.2b; P4.4 recorded that ours does not yet).

**How it works here.** Per book: MAUVE of the manuscript's paragraphs against a canon sample of the same
size. Recorded in the ship-check beside repetition. Calibrated against the external-read ledger (words ≥
8000, per CLAUDE.md) before anyone believes it: it earns a place only if it correlates with the headline
better than machine-register rate (−0.697).

**Resolves.** A measure that rises when prose improves, so prose-side levers can be screened for £0.
**Cost:** an embedding pass per book. **Falsified if** its correlation with reads is weaker than
register rate's.

---

## Order of work

1. **M1 (STN) and M5 (MinHash)** — £0, deterministic, hit the two most frequent complaints
   (timeline 22, repetition 64). Build first; test on the golden contracts and the 227 saved books.
2. **M2 (reader model)** — £0 to build; the schedule change needs one paid Agent 5 harness.
3. **M3 and M4** — £0; they sharpen the reveal and route, and give Agent 3 a "busy case" number.
4. **M6** — pennies; the only one that addresses WP-001's level-1 cause.
5. **M8** — needs calibration against the ledger before it steers anything.
6. **M7** — narrow; only for single-token labels.

## Sources

1. [An Efficient Incremental Simple Temporal Network Data Structure for Temporal Planning (arXiv 2212.07226)](https://arxiv.org/pdf/2212.07226) — STN definition, negative-cycle consistency.
2. [CSTNU Tool: A Java library for checking temporal networks](https://www.sciencedirect.com/science/article/pii/S2352711021001564)
3. [Cheong & Young — A Computational Model of Narrative Generation for Suspense (AAAI 2006)](https://cdn.aaai.org/AAAI/2006/AAAI06-331.pdf); [Suspenser](https://www.researchgate.net/publication/274320950_Suspenser_A_Story_Generation_System_for_Suspense)
4. [Argumentation framework — grounded extension](https://en.wikipedia.org/wiki/Argumentation_framework); [Explaining Semantics and Extension Membership in Abstract Argumentation](https://www.sciencedirect.com/science/article/pii/S2667305322000564)
5. [Near-duplicate detection with LSH and MinHash](https://yorko.github.io/2023/practical-near-dup-detection/); [Finding near-duplicates with Jaccard similarity and MinHash](https://blog.nelhage.com/post/fuzzy-dedup/)
6. [Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity (arXiv 2510.01171)](https://arxiv.org/abs/2510.01171)
7. [k-DPPs: Fixed-Size Determinantal Point Processes (Kulesza & Taskar, ICML 2011)](https://icml.cc/2011/papers/611_icmlpaper.pdf); [Determinantal Point Processes for Machine Learning](https://www.researchgate.net/publication/230568602_Determinantal_Point_Processes_for_Machine_Learning)
8. [Azure OpenAI REST API reference — logit_bias](https://learn.microsoft.com/en-us/AZURE/ai-services/openai/reference); [Using logit bias (OpenAI Help)](https://help.openai.com/en/articles/5247780-using-logit-bias-to-alter-token-probability-with-the-openai-api)
9. [How do I use logit bias to ban phrases and not just individual tokens?](https://community.openai.com/t/how-do-i-use-logit-bias-to-ban-phrases-and-not-just-individual-tokens/263856)
10. [MAUVE: Measuring the Gap Between Neural Text and Human Text (NeurIPS 2021)](https://arxiv.org/abs/2102.01454)

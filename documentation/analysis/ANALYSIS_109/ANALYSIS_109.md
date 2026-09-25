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

---
---

# PART II — HOW WE BUILD THEM

## 9. What the pipeline already holds — MEASURED on the golden cases

The methods need structured facts. Most exist; two do not.

| need | where it is today | state |
|---|---|---|
| time-points and windows | `CASE.constraint_space.time.anchors[]`, `.windows[]`, `.contradictions[]` (strings); parsed by `deriveCaseChronology` (`packages/cml/src/chronology.ts:308`) into `ChronoEvent` / `ChronoInterval` with dials | **present** — M1 reads the parse, not the strings |
| each suspect's alibi and access | `CASE.cast[].alibi_window`, `.opportunity_channels[]`, `.motive_strength` | present, free text for the window |
| the proof chain | `CASE.inference_path.steps[]` with `observation`, `correction`, `effect`, `required_evidence[]` | present |
| what each clue points at | `clues[].pointsTo`, `supportsInferenceStep`, `criticality`, ids like `clue_culprit_direct_*`, `clue_eliminate_*` | present |
| the false solution | `CASE.false_solution`, `false_assumption`, `red_herrings[]` | present |
| which chapter owns each clue | the v2 contract (`scenes[].mustSurface`) | present |
| locations, access rules | `location_profiles.keyLocations[]` with `accessControl` | present |
| **which location connects to which** | nowhere | **absent** — M4 needs an Agent 2c field |
| **embeddings, token log-probabilities** | `packages/llm-client` exposes chat only | **absent** — M5 and M6 are specified to run without them; M8 needs one embedding call |

**One shared structure.** M1–M4 all read the same facts. Build them once as a `CaseModel` in a new pure
package, `packages/case-logic`, with no LLM client, so every method is replayable over the archive for
£0 (the property `prose-engine` was built for, A_99 §10):

```ts
interface CaseModel {
  suspects: Suspect[];            // name, alibi {from,to} in minutes, channels, motive strength
  culprits: string[]; victim: string;
  events: TimePoint[];            // from deriveCaseChronology: id, label, dial (minutes), source
  windows: Interval[];            // from/to TimePoint ids, label
  clues: ClueFact[];              // id, owner chapter, pointsTo suspect(s), eliminates suspect(s), step
  steps: InferenceStep[];         // observation → correction → effect, required clue ids
  places?: Place[]; edges?: Edge[]; // M4, once Agent 2c emits them
}
```

`buildCaseModel(cml, clues, contract?)` is the only parser. Every method below is a pure function of it.

---

## 10. M1 — the STN, built

**Module.** `packages/case-logic/src/stn.ts`.

**Encoding.** A special time-point *Z* = midnight of the day. Each event with a dial gives two edges
Z→e (dial) and e→Z (−dial): it is pinned. Each window "between A and B: X happens" gives X.start, X.end
with Z→X.start ≤ B, X.start→Z ≤ −A, and X.start→X.end ≥ 0. Each alibi gives the suspect's
"away" interval. Each ordering the case states ("body discovered after the act") gives an edge of weight 0
or −1. The false timeline gets its own copy with the false assumption's anchor pinned.

**Algorithm.** Floyd–Warshall on n ≤ 40 points (64,000 steps). Consistent iff every diagonal entry
d[i][i] ≥ 0. On a negative cycle, walk the predecessor matrix to recover the cycle's edges — each edge
carries the id of the CML sentence it came from.

**Outputs.**
1. `consistent: boolean`, and on failure `conflict: { statements: string[] }` — the case's own sentences
   that cannot all be true.
2. `minimal: Map<eventId, {earliest, latest}>` — the tightest bounds.
3. `actWindow: {from, to}` — the act's minimal bounds, which replaces the regex search for an interval
   "about the act" (P3.2) with a derived one.
4. `breaksFalseTimeline(testFact)` — adds the discriminating test's result to the FALSE network and
   reports whether it becomes inconsistent. A test that does not break the false timeline is a case fault.

**Where it plugs in.**
- **After Agent 3, before Agent 5** (worker `agents/agent3-run.ts` post-validation): an inconsistent
  network is a CML validation error with the named statements, sent to Agent 4 revision as the repair
  instruction. Flag `CASE_LOGIC_STN_GATE`, default OFF, registered in `architecture/FLAG-AUDIT.md`.
  Report-only first (CLAUDE.md: a gate driving retries is costly; measure how often it fires).
- **In the v2 contract**: `buildChronologyTable` takes the minimal bounds as THE CLOCK; the reveal's
  `opportunityWindow` takes `actWindow`.

**Tests.** Known-positive: a hand CML with "last seen 10:15" and "killed between 9:50 and 10:05" → a
negative cycle naming both. Known-negative: the four golden cases → consistent (or, if not, each
conflict read by hand and recorded). Replay: run over every archived CML (`data/store.json` on the
laptop) and record the inconsistency rate — **the first number this method produces, before any change
is made.**

**Effort.** ~300 lines + tests. **Risk.** Free-text times that do not parse are unplaced; the report
must say how many facts were unplaced, so a "consistent" verdict over half the facts is not believed.

---

## 11. M5 — MinHash near-duplicates, built

**Module.** `packages/prose-engine/src/near-dup.ts` (prose-side, beside the checkers).

**Algorithm.**
1. Units: sentences (the shared `splitSentences`), narration and speech alike.
2. Shingles: stemmed content words (the `contentStemsOf` already built for F7), as word 3-shingles.
   Units under 5 content words are skipped.
3. MinHash signature of 64 hashes per unit (FNV or murmur32 with 64 seeds — no dependency needed);
   LSH with 16 bands × 4 rows gives ≈ 50% capture at Jaccard 0.5 and ≈ 99% at 0.8.
4. Candidate pairs in different paragraphs → exact Jaccard on the shingle sets → keep ≥ 0.5.
5. **Only case facts count as recaps**: a pair is reported if it shares a clue's key terms
   (`mustSurface.keyTerms`) or a suspect's alibi window. General near-duplicates are measured, not
   reported, until the corpus shows their precision.

**Outputs.**
- Finding `recap` (craft): "chapter 7 restates chapter 5's <clue/alibi>; keep the owner's version
  (chapter 5), make this a reference in one clause". The owner is the contract's chapter for that fact.
- Guard `noNewNearDuplicate`: an edit may not raise the chapter's count of pairs ≥ 0.5 with other
  chapters. Emitted as a violation per pair, the way `noNewDuplicate` is (§06 F6).
- Ship-check line: near-duplicate pairs per 10k words.

**Tests.** Known-positive: the 69's four statements of Margot's alibi (ch 2, 5, 7, 8) → 3 pairs.
Known-negative: the 88 (reads "repetition 12.0 per 10k, normal") → recorded count, and a precision read
of 20 random pairs by hand before the finding goes to the editor.

**Effort.** ~200 lines. **Risk.** Callbacks the author wants; the owned-fact restriction keeps it to
case facts, where a restatement is always a recap.

---

## 12. M2 — the reader model, built

**Module.** `packages/case-logic/src/reader.ts`.

> **As built (Part III step 5):** `packages/cml/src/case-logic/reader.ts`, and the table below was replaced
> by the case's own words: each clue's `inference`, read clause by clause, says whom it implicates and whom
> it clears (`CaseModel`, step 4), and the walk multiplies those people's odds by 4 and 0.05. The
> red-herring row has nothing to read: **no golden clue implicates the false accused** — see step 6.

**Likelihoods, without an LLM.** Each clue gets a row L[c][s] over suspects:

| clue kind (from id, `pointsTo`, observable) | L for the suspect it names | L for others |
|---|---|---|
| names the culprit (`clue_culprit_direct_*`, observable contains the name) | 0.8 | 0.2 / (n−1) each, normalised |
| eliminates *s* (`clue_eliminate_*`, alibi confirmed) | ~0 for *s* | uniform over the rest |
| red herring toward the false suspect | 0.6 for the false suspect | rest shared |
| mechanism / time clue that names nobody | uniform (no information) | uniform |

The table is deliberately coarse; its job is to catch "this clue alone points at one person", not to
simulate a reader.

**Walk.** Prior uniform over suspects (not the detective, not the victim). For chapters 1…N in contract
order, multiply in each owned clue, normalise, record the posterior and its entropy
H = −Σ p log₂ p. Also record the argmax suspect per chapter.

**Checks, reported per case.**
1. **Floor:** H ≥ 1 bit (two live suspects) for every chapter before the test.
2. **False lead:** at the midpoint, the argmax is the false solution's accused, not the culprit.
3. **Collapse:** after the test, the culprit's posterior ≥ 0.9.

**The fix, when the floor breaks.** The clue that breaks it is re-owned to the test chapter (the
contract already moves clue ownership; `mayMention` handles references), or a red herring pointing
elsewhere is moved into the same chapter. This is a **re-scheduling of existing clues**, not new text,
so it is £0 at the prose stage. It is a contract-level change in `prose-engine/contract.ts` behind flag
`PROSE_V2_SUSPENSE_FLOOR` (default OFF).

**Tests.** Known-positive: the four golden contracts — culprit clues owned by ch 4–7 (MEASURED) → the
floor breaks before ch 8. Known-negative: a hand contract with culprit clues at the test.
**Paid step.** One Agent 6 fair-play pass on a re-scheduled contract, to confirm moving a clue later does
not strand an inference step before it is needed.

**Effort.** ~250 lines. **Risk.** Over-delaying clues makes the test feel unearned; the collapse check
keeps the decisive clue at or before the test.

---

## 13. M3 — the proof core, built

**Module.** `packages/case-logic/src/proof.ts`.

**Framework.** Arguments: `innocent(s)` for each suspect, `guilty(culprit)`, and one argument per clue.
Attacks: an elimination clue attacks `guilty(s)` for the suspect it clears; a clue that breaks an alibi
attacks `innocent(s)`; the false assumption attacks the clues that contradict it until the test clue
attacks it. The grounded extension is computed by the standard fixpoint: start with unattacked arguments,
repeatedly add every argument all of whose attackers are attacked by the set, until nothing changes.

**Checks.**
1. `guilty(culprit)` ∈ grounded extension — **the case proves itself**. If not, it is a fair-play fault
   before prose (Agent 6 checks this by LLM today; this is the exact version).
2. Every false suspect's `innocent(s)` ∈ grounded extension — **everyone is cleared by something**.

**Minimum hitting set.** Universe: the false explanations (each innocent, the false assumption). Each
clue covers the explanations it defeats. Smallest cover by brute force over ≤ 20 clues (2²⁰ ≈ 1M subsets,
milliseconds with pruning) or greedy. The result is the proof core, typically 3–4 clues.

**Outputs.**
- `busy: number` = |hitting set|; reported to Agent 3/4 and the ledger (the ledger will say whether it
  predicts the plot mark — the compound-test result says it may not).
- **The reveal contract** gets `proofCore: {clue, breaks}[]`, rendered as one line per element:
  "<the thing found> breaks <the false explanation>". The v2 reveal already carries weapon, window and
  confession (P1.2–P1.5); this adds the order of the proof, which the 74's reader wrote out by hand.

**Tests.** Known-positive: a hand case where the culprit is not grounded (a clue missing) → reported.
Golden cases → grounded, hitting sets recorded. **Effort.** ~250 lines.

---

## 14. M4 — the route, built

**Schema change (Agent 2c).** `keyLocations[].connectsTo: {name, via, access}[]` — "the study connects
to the service passage via a baize door, staff only". One field on an existing agent; a prompt addition
and a harness run (pennies).

**Module.** `packages/case-logic/src/route.ts`. Places as nodes, `connectsTo` as edges, access rules as
edge labels. BFS from the culprit's alibi place to the scene of the crime and back, allowing a "secret"
edge only if the mechanism names it.

**Checks.** A path exists; its length in edges fits `actWindow` at an assumed minutes-per-edge; the
secret edge (if any) is on the path.
**Output.** The reveal contract gets `route: string[]`, rendered once: "<place> → <place> → <place>".
**Owner.** Agent 7.5 (`story-geometry`) already owns "the method's physical signature"; the route is its.
**Effort.** Schema + ~150 lines. **Paid step:** the Agent 2c harness.

---

## 15. M6 — distinct voices, built

**Where.** Agent 2b (character profiles), the `signatureTic` field first — the most countable (WP-001
§8).

**Call shape (Verbalized Sampling).** One call per cast, asking for five candidate lines per character
with a probability each, in the existing JSON profile schema extended with `ticCandidates: {line, p}[]`.
No prohibition list (WP-001 §6.0).

**Selection (no embeddings needed).**
1. Drop each character's highest-probability candidate — the mode.
2. Similarity between two lines = Jaccard over character 4-grams (cheap, deterministic). Also score each
   candidate against the archive's tic census (A_91 §9.2, 377 tics) — a candidate within 0.5 of any
   archived tic is dropped.
3. **Greedy k-DPP**: pick one line per character to maximise log det of the kernel
   K = diag(q) · S · diag(q), where S is the similarity matrix and q the candidate's verbalised
   probability rescaled to favour the tail. Greedy MAP for a DPP adds, at each step, the candidate with the
   largest marginal gain in log-determinant — a few lines of linear algebra on a 5×7 matrix.
4. The chosen line becomes `signatureTic`; the rest are kept in the artifact for audit.

**Measure (£0, before any read).** The template share (tics opening "One must/Let's/Well, isn't/Darling")
— today 34% (WP-001 §6.1 O3). Prediction: under 10%. Then WP-001 §8's falsification: if tics diversify
and dialogue stays at 6–7, diversity is not what the reader scores.

**Flag.** `AGENT2B_VERBALIZED_TICS`, default OFF. **Effort.** prompt + ~120 lines. **Cost.** one call's
extra output tokens.

---

## 16. M8 — the upward instrument, built

**Minimal version first, no embeddings:** per book, compute **distinct-2** and **distinct-3** (unique
bigrams/trigrams over total), the **p90 sentence length**, and **em-dash and semicolon rates** — the tail
measures WP-001 §5.2 says carry voice — against the canon corpus's values (A_79 §13). One score:
the mean absolute z-distance from canon across these, lower is better.

**MAUVE version:** needs an embedding endpoint added to `llm-client` (Azure OpenAI offers one); embed 500
paragraphs of the book and 500 of canon, quantise with k-means (k ≈ 50), compute the divergence frontier.
~£0.02 per book.

**Calibration before use (CLAUDE.md).** Correlate each against the external-read ledger with
`words >= 8000`. It is adopted only if |r| exceeds machine-register rate's 0.697 on the same books, and
only as a screen for prose pairs — never a gate.

---

## 17. Order, dependencies and what each step settles

| step | builds | depends on | cost | settles |
|---|---|---|---|---|
| 1 | `case-logic` package, `CaseModel` | — | £0 | the parse every method shares; how many facts are unplaced |
| 2 | M1 STN, report-only | 1 | £0 | how many archived cases are inconsistent — measured before anything changes |
| 3 | M5 MinHash recap finding + guard | shared splitter (built) | £0 | recaps per book; precision by hand on 20 pairs |
| 4 | M3 proof core → reveal contract | 1 | £0 | grounded or not; hitting-set size per case |
| 5 | M2 reader model, report-only | 1, contract ownership | £0 | how many cases break the entropy floor (golden: 4 of 4 predicted) |
| 6 | M2 re-scheduling behind flag | 5 | one Agent 6 pass | fair play survives the move |
| 7 | M6 verbalized tics behind flag | — | pence | template share 34% → < 10% |
| 8 | M4 route (schema + BFS) | 1, Agent 2c harness | pennies | a stated route per case |
| 9 | M8 minimal instrument + calibration | the ledger | £0 | whether any upward measure beats register rate |
| 10 | one read | 2–7 | a run + a read | the bundle, scored by category, on a **fresh behavioural or spatial seed** |

Steps 2, 4 and 5 are **report-only first**: each prints its verdict over the archive before it changes a
single contract, so the first thing we learn is how often the fault exists — the premise check this
project has needed after the fact too often (§06 W1).

## 18. Predictions for the read that closes step 10

Stated now, checked after (CLAUDE.md):
1. No timeline contradiction named by the reader (M1). Today: 22 of 71 reviews.
2. The reader does not call the culprit obvious (M2). Today: 22 of 71.
3. The reveal is described as landing, not listing (M3).
4. "Repetitive" or "recap" is not the reader's first complaint (M5).
5. No catchphrase named as a tag (M6).
6. Plot and clues each ≥ 8 — the two marks the case-level methods aim at; with prose held at the 74's
   level, a headline of 82–86 on a fresh case.

## 19. What would stop this programme

- **M1 finds almost no inconsistent cases** in the archive: then the timeline complaint is about how the
  prose STATES times, not about the case — move the effort to the reveal's one timeline sentence.
- **M2's floor breaks on every case and re-scheduling breaks fair play**: then clue placement is not the
  lever; the culprit-pointing clues are too strong in themselves (Agent 5's wording).
- **M6 diversifies tics and dialogue does not move**: WP-001 §8's result — diversity is not what the
  reader scores; stop spending on voice selection.

---
---

# PART III — STATUS (the build, 2026-09-25)

**Where it lives.** Not a new workspace package: `packages/cml/src/case-logic/`, exported from
`@cml/cml`. A new workspace needs `npm install` on the laptop to link it, and `start-app.bat` only
installs when `node_modules` is missing; `@cml/cml` already owns the chronology these checks read.

**How to see the archive's numbers (laptop):** `npm run build:all`, then `npm run report:case-logic`.
Telemetry in a run: `AGENT3_CASE_LOGIC=true` in `.env.local`.

| step | item | status | commit | evidence |
|---|---|---|---|---|
| 1 | `CaseModel` — one parse: suspects by identifying name tokens, clue kind (points / eliminates / neutral) by stated rules, inference steps, chronology | built | d003b882 | golden: three Langleys and two Winthropes resolved by first-name tokens |
| 2 | M1 STN (Floyd–Warshall, negative-cycle naming) + the act's derived window + **innocents' alibi coverage** — report-only | built | d003b882 | golden: consistent 4 of 4; act derivable 3 of 4 (eb1251aa states only claims); innocents covering the act **2 of 8** (5 partial, 1 none). Telemetry flag `AGENT3_CASE_LOGIC`; archive script |
| 3 | M5 recaps — Broder CONTAINMENT, not resemblance: a clue restated past its owner chapter (≥ 60% and ≥ 3 of its stemmed content words), an ALIBI window given again after the chapter that first gave it; test and reveal exempt | built | f40729d1 | the 69: Margot's 9:00–10:00 given in ch 2, 5, 7, 8 — a named person in the sentence was required first and found **0 of 4** ("I was in the kitchen…"), so the key is the window. Keyed on EVERY window it fired on 112 of 228 books and flagged pair 3's tide window 13 times — an off switch; the pipeline tracks only the case's alibi windows. **Exact**, not MinHash: a book is a few hundred sentences. **Guard not built**: the edit guard sees one chapter, a recap is defined against other chapters' facts; the six-word-run guard covers the verbatim splice. Archive line in `report:case-logic` |
| 4 | M3 — does the case prove itself: Dung grounded extension (culprit proven iff every cover — the false assumption, the culprit's alibi — is defeated by the test or an implicating clue; an innocent nothing clears is a second live suspect; a clearance aimed at the culprit is a contradiction). Report-only (`AGENT3_CASE_LOGIC`). **THE PROOF** — the case's inference path, first sentence of each step — added to the bible, and the reveal asked to walk it in N steps, one sentence each, the name last: flag `PROSE_V2_PROOF_STEPS` (off) | built | 417bb086 | golden: proven 4 of 4, every innocent cleared, no contradiction — **after** the clue reader was fixed: it first read `clue_charles_alibi_conflict` as clearing the culprit and a negated footprint match as implicating; `CaseModel` now reads each clue's own `inference` clause by clause (88 of 88 golden clues carry one) into `clears` / `implicates`. MEASURED: the v2 bible never carried the inference path. **Withdrawn:** the "busy case" count (minimum hitting set) — the case never says which evidence defeats which part of the cover, so the count would be invented. **Found on the way:** two regexes had lost their `\b` to a Python non-raw string (the CLAUDE.md heredoc warning); swept every file changed this session — only this one |
| 5 | M2 reader model, report-only: a posterior over the suspects walked through the contract's clue OWNERSHIP (the chapter each clue is first shown in) and its stated clearances; entropy per chapter; the culprit as favourite (p ≥ 0.5, strictly ahead) before the test; the false accused leading at the midpoint; resolved at the reveal (≥ 0.9). Likelihoods from `CaseModel`'s clause-read `implicates` / `clears` (×4 / ×0.05). Telemetry line under `AGENT3_CASE_LOGIC`; archive line in `report:case-logic` | built | (this commit) | golden: the culprit is the favourite from ch **4** (3 cases) or **5** (1), the test at 8 — **4 of 4, as predicted**; one live suspect from the same chapter; the false accused leads at the midpoint **0 of 4**. **Structural, not the constants'**: unchanged at each of six implicate ratios from 1.25 to 8 and at clear ratios 0.05 and 0.3 — no clue in any of the four implicates anyone but the culprit. Pinned: `a109-case-logic-reader.test.ts` (hand schedules), `fresh-read-checkers.test.ts` (golden), `agent9-v2-dry-run.test.ts` (flag) |
| 6 | M2 re-scheduling behind a flag | not started | | |
| 7 | M6 verbalized tics behind a flag | not started | | |
| 8 | M4 route | not started | | |
| 9 | M8 upward instrument + calibration | not started | | |

**New finding from step 2, before anything changed:** the golden cases' alibis mostly do not cover
their own murder windows. An alibi that ends before the act begins clears nobody, and the prose presents
it as a clearance — run 98dec72a's Margot (9:00–10:00, murder 10:10–10:45) is the same fault. This is the
first candidate for a CASE fix (Agent 3: an innocent's alibi window must contain the act window), to be
sized on the archive before it is built.

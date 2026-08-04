# THINK_01 — why 80 is a ceiling, and what would actually break it

**Written:** 2026-08-03 · **Type:** a thinking document, not a board. No task IDs, no status columns. The question is *what is actually stopping us*, and the brief was explicitly "nothing off the table."

**Filed here** rather than beside the story it came from, because it spans every run: it belongs with [REVIEW_01](REVIEW_01.md) / [REVIEW_02](REVIEW_02.md) / [REVIEW_03](REVIEW_03.md), which are about the machine. This one is about the stories.

**Evidence base:** the two external reads of 2026-08-02's runs — [`story_20260802-1810/chatgpt.txt`](../stories/story_20260802-1810/chatgpt.txt) (80/100) and [`story_20260802-1936/chatgpt-review.txt`](../stories/story_20260802-1936/chatgpt-review.txt) (68/100) — plus every prior external read in the corpus, and the first real judge-calibration run.

---

## 1. What nine external reads actually say

Every external score this project has ever collected, in order:

```
S0 batch (07-13):  75  69  73  76
probe #1 (07-19):  78
probe #3 (07-23):  76
pre-fix control:   80
08-02 run 1:       80   ← the_clockwork_deceit
08-02 run 2:       68   ← the_clock_s_deception
```

**n = 9 · mean 75.0 · best 80 · never once above 80.**

Two facts sit inside that line and they point in completely different directions.

**Fact one: the best runs already hit the number the project treats as distant.** 80 has been reached three times. The reviewers of both 08-02 stories volunteered, unprompted, that with a short list of specific fixes the same drafts would reach **85–88**. The ceiling is not the genre, the length, or the model. It is not that our best story is 20 points from great.

**Fact two: the spread is 12 points, and it is not noise around a mean — it is bimodal.**

```
68  69  73  │  75  76  76  78  80  80
   low cluster        high cluster
```

The low cluster are stories that **fail to finish being a mystery**. The high cluster are stories that finish and are merely *good*. These are different failures with different causes, and the pipeline has been treating them as one problem for months.

> **If every run performed like our best run, the mean would be 80 with no craft improvement at all.** Mean 75 → best 80. **Half the distance to target is variance, not quality.** That reframes everything below.

---

## 2. The thing that has to be said first: the judge is not calibrated

The two 08-02 runs, scored both ways:

| Story | Internal rubric | External | |
|---|---|---|---|
| `the_clockwork_deceit` (1810) | **68** | **80** | internal −12 |
| `the_clock_s_deception` (1936) | **73** | **68** | internal **+5** |

**The internal judge ranked them backwards.** It called the incomplete story — the one that never names its culprit — five points *better* than the one the external reader scored 80.

Running the calibration over all seven internal/external pairs the corpus now contains (`npm run eval:calibrate`):

```
BIAS      internal − external = -7.71   (sd 7.11, n 7)
RANKING   9/21 orderable pairs agree = 42.9%
VERDICT   NOT CALIBRATED  (42.9% vs 85% target)
OFFSET    NOT usable — sd 7.11 too wide for a constant correction
```

**42.9% ranking agreement is worse than a coin flip.** And the bias is no longer even consistently negative — the +5 on run 2 is the first positive gap ever recorded, which kills the "it under-scores by a constant, just add 9" workaround that has been informally in use since S0.

The consequence is uncomfortable and needs stating plainly:

> **Every lever verdict, every cap, every flag promotion, and every A/B on this project has been decided by an instrument that orders stories no better than chance.**

That is a candidate explanation for the whole puzzle in the brief — *why aren't we progressing past 80?* Months of careful, disciplined optimization against a gauge that cannot rank. The work wasn't wasted, but it was not hill-climbing; it was a random walk with excellent documentation.

**No proposal below can be evaluated until this is fixed.** That is why it is §2 and not §7.

---

## 3. What the reviewers actually complain about

Not paraphrased — counted. These appear in **both** 08-02 reviews, and every one of them also appears in earlier external reads:

| # | Complaint | 1810 (80/100) | 1936 (68/100) |
|---|---|---|---|
| 1 | **Generated / validation phrasing in the prose** | *"the chip etched into the gold edge the tumbler ajar"* | *"Sylvia, being the victim, obviously couldn't have been involved"* |
| 2 | **Murder method under-planted** — the reveal names a method the early chapters never physically supported | "plant strangulation evidence in Chapter 1" | "the murder method disappears… the candlestick never returns" |
| 3 | **The last chapter repeats or fails the one before it** | "Chapter 10 repeats Chapter 9" | "Chapter 9 only points toward Hugo" |
| 4 | **No single hard physical clue tying culprit to act** | "one hard physical clue would push this to the high 80s" | "add one physical match: torn fabric to Hugo's cuff" |
| 5 | **Report-style alibi clearing eats the endgame** | "the Eleanor-alibi section is validation logic, not story" | "the clearances are logical but too mechanical" |

**Five items. 2/2 each. And both reviewers independently priced the fix at 85–88.**

This is the most actionable data the project owns, and it has been sitting in `.txt` files next to the stories rather than in the loop.

Note what is *not* on the list. Nobody complains about premise (8/10 twice), atmosphere (8/10 twice), opening hook (8/10 twice), or length. **The front half of the story is already at target.** Everything that costs points is in the last third, or is an artefact the machine itself inserted.

---

## 4. The diagnosis

The CML models the **logic** of a mystery: who did it, how, which clue proves it, what test discriminates. That model is checked, gated, repaired, and — on the evidence — usually sound. `the_clock_s_deception` had a sound CML and scored 68 because it never named its culprit.

What the CML does not model is the **geometry of a story**:

| The logic model knows | The story needs, and nothing owns it |
|---|---|
| The culprit is Hale | *One physical trace only Hale could have left* — and where it is planted |
| The method is strangulation | *That chapter 1 shows bruising, pressure marks, a snagged necklace* |
| The clock shows a false time | *That there are exactly **two** times in the whole manuscript, not three* |
| Chapter 9 is the reveal | *That chapter 9 names culprit + method + motive + proof, and chapter 10 does none of it again* |
| Chapter 6 is the false solution | *That the false solution accuses somebody who is not the culprit* |

Every one of the five 2/2 complaints lives in that right-hand column. **Not one of them is a prose-quality problem.** They are all *unspecified structure* — and when structure is unspecified, a language model fills the gap plausibly and inconsistently, which is exactly what we observe: 68 one run, 80 the next, same config.

`the_clock_s_deception` makes the point better than any argument. Its chapter 9 is **titled "The Culprit Revealed"** and ends with *"the truth poised to emerge in the hours ahead."* The outline asserted the beat. The prose did not deliver it. Nothing in fourteen stages noticed, and the internal judge gave that story a 73.

---

## 5. "Do we need to make the structure more rigid?"

**Yes — but almost certainly not where the instinct points.** There are three different things "more rigid" could mean, and they have opposite signs:

**More rigid prose constraints — NO. This actively hurts.** We already do this, heavily, and it is complaint #1 in every review. *"Sylvia, being the victim, obviously couldn't have been involved"* is not a model failure; it is the deterministic injector doing precisely what it was told. Every additional obligation enforced by pasting a sentence buys a compliance tick and pays for it in the prose mark. We have been trading the score for the checklist.

**More rigid case logic — ALREADY DONE, and insufficient.** Thirteen stages, three binding gates, novelty audits, fair-play coverage. Story B passed all of it and didn't finish the mystery.

**More rigid story geometry — YES, and this is the gap.** A contract the *outline* must satisfy before a word of prose is written, machine-checkable, and expressed in the vocabulary of the finished story rather than the case file:

1. **Exactly two times.** `T_true` and `T_apparent`. Every clock, watch, note and testimony in the manuscript resolves to one of them. Story B shipped 8:50, 10:15 *and* 11:10 — the reviewer's first "main problem", and clues scored 5/10.
2. **The clincher.** Exactly one physical trace that only the culprit could have left. Named in the case model, planted by chapter ≤ 3, produced in the reveal. **Both reviewers asked for this by name, in the same words, on stories with completely different plots.** It is a genre convention we simply do not model.
3. **Method plant schedule.** The method's *physical* signature must appear in chapter 1 — bruising for strangulation, a wound matching the candlestick base. Today the method is a field in a data structure, not an obligation on a chapter.
4. **Chapter role contract, enforced on output.** Reveal chapter must contain culprit + method + motive + clincher. Aftermath chapter must contain *none* of them. Story A lost marks because ch10 re-explained; story B lost 4/10 on ending because ch9 never explained. Same missing contract, opposite symptoms.
5. **The false solution must accuse a non-culprit.** Story A's chapter 6 accused the man who actually did it. The reviewer noticed instantly.
6. **A clearance budget.** Suspect elimination happens in scene, or it happens in one sentence. Never as a register.

That is rigidity in the right place: it tells the model *exactly what the finished artefact must contain and where*, and leaves it completely free on the sentences — which is the half it is good at.

---

## 6. The moves, nothing off the table

Ranked by expected external points, with what each actually costs.

### Move 1 — Fix the instrument, or stop using it *(gates everything else)*

At 42.9% the judge cannot tell you whether any change below helped. Options, in order of preference:

- **Rewrite the internal judge to be the external review.** The external prompt is right there in the reviews: ten categories, marks out of 10, "biggest issue", "fastest fixes". Ours is a different rubric with structural caps that fire hard on some defects and miss "never named the culprit" entirely. Run it on a frontier model, re-score the seven pairs we already have, and re-run `eval:calibrate`. **This is a day's work and it is directly falsifiable.**
- **Demote the judge from ranker to gate.** It is good at "is obligation X present". Keep it for that, and stop deriving quality deltas from it.
- **Panel of three diverse judges**, take agreement rather than a mean — the published answer to single-judge unreliability.

Do not skip this. Everything below is unmeasurable without it, and the last few months are what unmeasurable optimization looks like.

### Move 2 — Write the reveal first *(the structural move)*

Today: generate chapters 1 → N in order, with the reveal last, at maximum accumulated drift. The single most important chapter is written when the model has the most rope and the least specification.

Instead: **generate the reveal chapter first, directly from the case model.** Then extract from that chapter every fact, object, trace and time it uses, and emit that list as a **plant schedule** binding chapters 1 → N−1. Then write the story forwards to satisfy it.

This kills, by construction rather than by patch:
- the method disappearing (#2) — the reveal names it, so it is in the schedule
- the missing clincher (#4) — the reveal must cite one, so it must be planted
- the unfinished reveal (#3) — the reveal exists before anything else does
- clock drift — the reveal fixes the two times before chapter 1 invents a third

It is also the honest answer to *"does the AI know exactly what it needs to do?"* — it would, because it wrote the destination first and everything else is now a constraint-satisfaction problem rather than an act of invention.

### Move 3 — A whole-manuscript revision pass *(the craft move)*

Every chapter today is validated and repaired **locally**. No stage ever reads the finished book and asks "what would a reviewer say?" That is precisely the pass a human editor performs, and it is the standard route from a competent draft to a good one. Give a frontier model the complete manuscript plus the five 2/2 complaints as a checklist, and let it revise globally with rollback.

`AGENT9_FULLSTORY_POLISH` already exists for this. It is default-OFF and, per A_70, its only probe found the lever had never executed. It has never actually been tried.

### Move 4 — Generate prose with a frontier model

`gpt-4.1` writes the prose; Sonnet 5 only polishes what already passed. Prose scores **6–7/10 in every review** — with atmosphere and premise at 8, the writing itself is the drag. A run costs £0.88 today, of which generation is £0.53. Frontier generation plausibly takes a run to £3–4.

**That is not a real constraint.** This project routinely spends £4–8 to answer a single A/B question. If frontier generation buys two points of prose and one of dialogue across every run, it is the cheapest three points on this list.

### Move 5 — Delete the deterministic injectors

They are complaint #1, in every review, forever. [ADR-0003](decisions/0003-never-abort-release-gate.md) keeps them because removing them turns a repairable defect into an aborted run — and that reasoning was correct when the alternative was nothing. With Move 2, the obligations are satisfied *by construction*, so the floor should approach never firing. Sequence it: land Move 2, measure the floor-firing rate, then remove the injectors when the rate is near zero. Do not remove them first.

### Move 6 — Give Agent 9 the actual rubric

The prose prompt contains craft guidance written by us. The score comes from a ten-category rubric written by someone else. Put the real rubric — and a worked example of what a 9 looks like in each category — in front of the model that is being graded on it.

### Move 7 — Just fix the five things

The five 2/2 complaints are small, specific, and known. None needs architecture. This is the fastest available path from 80 to ~85 and it can be done this week.

---

## 7. What I would actually do, in order

1. **Move 1 (judge).** Nothing is measurable until this lands. Re-run calibration on the seven existing pairs — no new LLM spend, no new reads.
2. **Move 7 (the five fixes)** in parallel — they are independent of the judge and independently justified by 2/2 reviewer agreement.
3. **Move 2 (reveal-first)** as the one substantial architectural change. Behind a flag, matched-pair against the current order.
4. **Move 3 + 4 together** — whole-manuscript revision on a frontier model. These are the same call site and the same spend decision.
5. **Move 5 (injectors)** last, gated on the floor-firing rate that Move 2 should drive to zero.

Moves 1, 2 and 7 attack the **low cluster** — the completion failures that cost 12 points of variance. Moves 3, 4 and 6 attack the **high cluster** — the 8s that need to be 9s. Given that half the gap to 80 is variance, the first group is worth more and is cheaper. **The first group is also almost entirely free of taste judgements**, which matters when the instrument that adjudicates taste is at 42.9%.

---

## 8. What would change my mind

Stated up front so this document can be wrong in a useful way.

- **If a recalibrated judge still ranks at chance**, the problem is not the judge — it is that the ten-category rubric does not capture what a reader responds to, and the whole measurement strategy needs rethinking rather than repairing.
- **If reveal-first generation produces stiffer, more mechanical prose** — a real risk, since it front-loads constraint — then the plant schedule should become advisory input to the outline rather than a binding contract on the prose.
- **If frontier-model generation moves prose by less than a point**, then prose quality is bounded by the *prompt*, not the model, and Move 6 becomes the priority instead of Move 4.
- **If the five 2/2 fixes land and the score does not move**, then the external reviewer's stated deductions are not what actually drives their number, and we should be asking them to score blind pairs rather than to give notes.

And the sharpest one:

- **If, after all of it, the ceiling is still 80**, the remaining explanation is that a 10-chapter procedurally-generated pastiche has a quality ceiling that competent execution cannot exceed, and the honest response is to change the target rather than keep buying reliability. **Nothing in the evidence supports that yet** — two independent reviewers looked at our own output and volunteered 85–88 as reachable from where it already stands.

---

## 9. The one-paragraph version

We are not stuck because the stories are badly written — premise, atmosphere and openings already score 8/10. We are stuck for three compounding reasons: **the endgame is under-specified**, so roughly a third of runs fail to finish being a mystery at all and drag the mean down by five points; **the machine's own compliance machinery writes visibly generated sentences into the prose**, costing marks on every single story; and **the instrument we use to decide whether anything helps ranks stories at 42.9% — worse than chance** — so months of disciplined optimization have been unable to accumulate. Fix the judge, specify the geometry of the ending as tightly as we currently specify the logic of the case, stop pasting sentences into finished prose, and let a frontier model revise the whole manuscript once. The reviewers have already told us what that is worth: 85–88.

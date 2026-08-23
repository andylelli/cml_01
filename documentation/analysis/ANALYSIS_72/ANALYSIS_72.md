# ANALYSIS_72 — the reader gives nines to distinctiveness, and this pipeline has one engine for it

**Written:** 2026-08-23 · **Trigger:** owner's request — *"discuss these changes and all the other issues that are still stopping us from hitting 90"*, after the first external read of a four-flag run returned **81/100**.

**Type:** a BOARD, written against evidence that did not exist yesterday. On 2026-08-23 the external reads stopped being prose and became data: **36 manuscripts with a cold read beside them on disk, 35 carrying a full ten-category table — 350 human marks with the reader's reason attached to each.** Every previous ordering on this project was drawn from eight of them, transcribed by hand.

**Method note, carried from [A_71](../ANALYSIS_71/ANALYSIS_71.md):** every claim is **MEASURED** (a check was run and its output quoted), **INFERRED** (follows from reading the code), or **UNBASELINED** (a number with no comparison point). It earns its keep again below: §2's central finding is measured, and §4's flag results are n=1 and are labelled so.

**The through-line, stated first.** Across 35 reads the reader awards a **9** for one thing and an **8** for another, and the two are not degrees of the same quality:

> **9 goes to what is DISTINCTIVE. 8 goes to what is CORRECT.**

The pipeline contains exactly one engine that manufactures distinctiveness — the novel-device path that feeds `premise`. **`premise` holds 7 of the 14 nines ever awarded.** The four categories with no such engine — `opening_hook`, `character_clarity`, `dialogue`, `prose` — have never received a 9 in 35 reads, and neither has `pacing`. That is not a detector gap, a wordlist gap or a model ceiling. It is a missing capability, and it is the whole of the distance to 90.

---

## 1. Where 90 sits, recomputed at n=35

**MEASURED** — `npm run ledger:external-read -- --best`, over every read on disk rather than the eight carried by hand through [REVIEW_13](../../../architecture/REVIEW_13.md), [REVIEW_15](../../../architecture/REVIEW_15.md) and [PLAN-TO-90](../../../architecture/PLAN-TO-90.md).

| | the boards said (n=8, by hand) | the data says (n=35) |
|---|---:|---:|
| best-ever mark in each category, summed | 84 | **85** |
| headline-minus-sum offset | +2..+7, mean 3.5 | **0..+8, mean 3.9** |
| best-ever-everywhere therefore projects to | 87.5 | **88.9** |

**A manuscript that hits its best-ever mark in all ten categories at once still lands short of 90.** Reaching 90 requires at least one category to set a record no manuscript has set in 35 reads. That is the arithmetic the rest of this document is written against, and it has not moved in the direction anyone hoped: the extra reads raised the projection by 1.4 marks and left the conclusion identical.

### 1.1 The ceiling, per category

**MEASURED** — `npm run ledger:external-read -- --gaps`.

| category | mean (n=35) | max | 9s | top-8 mean | distance to 9 on the best books |
|---|---:|---:|---:|---:|---:|
| premise | 8.0 | 9 | **7** | 8.8 | 0.2 |
| atmosphere | 7.5 | 9 | 3 | 8.4 | 0.6 |
| ending | 6.6 | 9 | 2 | 8.1 | 0.9 |
| plot structure | 7.1 | 9 | 1 | 8.0 | 1.0 |
| mystery clues | 6.9 | 9 | 1 | 8.0 | 1.0 |
| **opening hook** | 7.1 | **8** | **0** | 8.0 | 1.0 |
| **character clarity** | 6.3 | **8** | **0** | 8.0 | 1.0 |
| **pacing** | 7.0 | **8** | **0** | 7.9 | 1.1 |
| **dialogue** | 6.2 | **8** | **0** | 7.1 | 1.9 |
| **prose** | 5.6 | **8** | **0** | 6.9 | 2.1 |

The bottom five are the subject of this document. The top five are, on the best manuscripts, within a mark of their ceiling and have all demonstrated they can reach it.

---

### 1.2 And a FLOOR of 90 is a harder number than that — the offset must be planned at its minimum

**MEASURED.** The offset is not a constant to be added; it is a spread, and a *floor* claim has to survive its bad end. Across the ten reads scoring 80+:

```
offsets on reads >= 80 :  2  2  2  2  2  3  4  5  6  7      mean 3.5, MIN 2
```

**Five of the ten came in at +2**, including this week's 81. So the number a floor plan must clear is:

| target | at the MEAN offset (+3.5) | at the FLOOR offset (+2) |
|---|---:|---:|
| headline 90 | category sum **86.5** | category sum **88** |

And a category sum of 88 has exactly one shape:

```
  6 nines + 4 eights = 86
  7 nines + 3 eights = 87
  8 nines + 2 eights = 88   <- this one
```

> **A floor of 90 means eight categories at 9 and two at 8, on every run.**

Five categories have ever produced a 9 at all. **So a 90 floor requires at least three categories that have never scored a 9 to score one reliably** — and it requires the five that can to stop being intermittent. The best manuscript in the corpus sums 83; best-ever-everywhere sums 85.

This is the single most important line in the document, and §10 is built on it: **the target is not "four marks better than our best". It is a different distribution of marks entirely, and it cannot be reached by removing defects from a book that is already correct.**

## 2. The finding: what the reader is actually rewarding

**MEASURED.** Taking every category note in the ledger and splitting the vocabulary by the mark attached to it (14 marks of 9+, 117 marks of 8):

```
words MORE common at 9   distinctive · fits · emotionally · physical · weighted ·
                         manor · stables · kitchen · ledgers · room
words MORE common at 8   good(23) · clue(16) · body(15) · contradiction(10) ·
                         clear(9) · setup(9) · stable(9) · confession · motive · hotel · rain
```

At 9 the reader names **a specific thing and why it is unusual**. At 8 the reader names **the standard-issue furniture of the genre and pronounces it good**.

Read the actual sentences and the split is unmistakable.

**Every 9 ever awarded:**

> *"Weighted pendulum changing the clock's speed is one of the best mechanisms so far."* (premise, 86)
> *"Reversed escapement / backward-running clock is **distinctive and memorable**."* (premise, 86)
> *"Winter manor, ledgers, servants, stables, kitchen, clock room, firelight — **very strong fit**."* (atmosphere, 81)
> *"Cliffhaven, shingle, tide, mist, seaweed, hotel lounge — **excellent setting-mechanism fit**."* (atmosphere, 81)
> *"The reveal is on-page, **physical, and emotionally satisfying**."* (ending, 86)

**Every 8 in `opening_hook`, all seventeen, in one shape:**

> *"Body, letter opener, clock, scratch on pendulum arm, wrong chime — strong setup."*
> *"Body, clock contradiction, weapon, logbook, foggy hotel — strong hook."*
> *"Body beneath frozen clock, dust, wire, candlestick/letter opener — strong hook."*
> *"Body at tide line, harbormaster time, pipe, blood, scrape marks — very good."*

**That is an inventory of props followed by a compliment.** Seventeen times. The reader is not withholding a mark because the opening is weak; they are describing an opening that contains the correct objects and nothing they would remember.

[REVIEW_14 §2.3](../../../architecture/REVIEW_14.md) predicted this class — *"a defect that produces FLATNESS gets a positive sentence and an 8"* — and concluded no detector could reach it. **It was right about detectors and wrong about the cause being unreachable.** The cause is not hidden. It is that nothing in the pipeline is trying to make the opening distinctive, so it isn't.

### 2.1 The existence proof: `premise` has an engine, and it has 7 of the 14 nines

`premise` is the only category with a dedicated novelty apparatus, and **it is narrower than it looks**:

- **Agent 3b** (`agent3b-hard-logic-devices.ts`) — *"generates novel, contradiction-driven mechanism concepts before CML generation… so the final CML is grounded in explicitly generated novel devices"*. **MEASURED:** it returns *"exactly 5 devices"* per run under an explicit `noveltyConstraints: { divergeFrom, areas, avoidancePatterns }`, and a plausibility judge picks one. **Five divergent candidates, one call, then a commitment.**
- **Agent 8** (`agent8-novelty.ts`) + `@cml/novelty` — the audit half. **It cannot fire.** `.env.local` sets `NOVELTY_SIMILARITY_THRESHOLD=1.0`, so a case must be 100% similar to a seed to fail, with `NOVELTY_HARD_FAIL=false` and `NOVELTY_SKELETON_JUDGE=shadow` besides. The package's own header says it is *"pure, no LLM, NOT wired into the pipeline"*.

**So the engine that earns those 9s is the GENERATIVE half alone**, and the corpus-audit half has never contributed one. That is a better finding than the tidier version: the thing that works is *divergent generation under an explicit instruction to differ*, which is one extra design-tier call — not a subsystem. **It is cheap to transplant.**

Its category, and only its category, routinely earns 9s — and the reader's language for those 9s is exactly the language that generation optimises for: *distinctive*, *memorable*, *one of the best mechanisms so far*.

`atmosphere`'s three 9s are the same effect at one remove: all three praise **fit between setting and mechanism** — which is a property the device engine confers, not one the atmosphere prompt asks for.

**INFERRED, and it is the load-bearing inference of this document:** where the pipeline manufactures novelty, the reader awards 9s; where it manufactures correctness, the reader awards 8s and says so in the same words every time. Nothing about the four flat categories suggests a model ceiling. It suggests an absent engine.

---

## 3. `character_clarity` — a ladder with no rung above "correct"

**MEASURED.** Every distinct note in the ledger for this category, by mark:

```
8   "Investigator, victim, culprit, and false suspects are stable."
8   "Roles are stable; Hugo's guilt is easy to follow."
7   "Roles are clear, though pronoun drift still appears."
6   "Roles are clear, but pronoun errors remain: Daphne, Arthur, Edward slip between he/she."
5   "Roles are understandable, but pronouns and names slip often."
2   "Beatrice is dead, then later alive and guilty."
2   "Felix is dead in Chapter 1, then alive as suspect/culprit later."
```

**The entire scale, from 2 to 8, measures one thing: whether the reader can tell who is who.** A 2 is a resurrected corpse. An 8 is "stable". **No note in 35 reads describes a character as interesting, surprising, contradictory, or worth watching.**

This is not the reader being stingy. It is the ladder the pipeline built. Every mechanism aimed at this category — the pronoun repair passes, the identity-match module, the cast-name reference checks, the walk-on repairs, the character-lifecycle validators — is an **error suppressor**. The project has spent enormous effort climbing from 2 to 8, and every rung was a defect removed. **There is no mechanism whose output is a memorable person**, so 8 is the top of the ladder that exists.

**Implication:** `character_clarity` will not reach 9 by removing more errors, because the errors that produce a 7 are already rare. It needs the thing §2 describes — a distinctiveness engine — pointed at people.

---

## 4. What the four flags did, measured on one run

**MEASURED, n=1**, `story_20260823-1715` (£1.10), against `story_20260822-1028` (same inputs yaml, flags off, £0.99). Read: **81/100**.

| flag | category | result |
|---|---|---|
| `AGENT9_FOLD_SUSPECT_CLEARANCES` (X93) | pacing | **the named defect is gone; the mark is not** |
| `AGENT9_OPENING_STYLE_PER_STORY` (X94) | opening hook | **landed; moved nothing** |
| `AGENT9_SENSORY_PALETTE_ROTATION` (X95) | atmosphere, prose | atmosphere **9**; prose **6** |
| `AGENT3_DEVICE_TIME_BINDING` (X38) | clues | repaired at source; clues 8 |

**X93 — the clearest result on the board, and it cuts both ways.** Four of the top eight reads carry some form of *"Chapters 9–10 repeat the reveal/clearances"*. This read says *"Good build and a real test chapter; **Chapter 10 mostly works as aftermath**."* **That complaint has not been absent from a read before.** The fold did exactly what it was built to do. **Pacing stayed at 8.** Therefore pacing was never held down by that complaint alone, and the three reads that named it were describing a symptom the mark did not turn on.

Corroborated independently: `story_20260807-1112` is the 84-scoring manuscript with **two paragraphs of chapter 10 rewritten** by the aftermath-repeat regen pass, built expressly so *"a second cold read isolates that one complaint completely"*, and never read until now. Its read: **84 → 85, prose 7 → 8, pacing 8 → 8**, other eight categories identical. **A paragraph-level repair did not move pacing either.** Two different repairs, one structural and one cosmetic, both silent on the mark.

**X94 — the strongest single-mechanism result and the most disappointing.** Chapter 1 opened on dialogue (*"Is that—?"*) for the first time in the project's history, against 35 archived manuscripts that all opened on a named character performing a physical action. **The hook mark is 8, with the same props-inventory note as always.** On n=1 against a reader whose own reproducibility is ±1 (§6.2), this is evidence that **how the first sentence is shaped is not what holds `opening_hook` at 8**. §2 says what does.

**X95 — atmosphere 9, third in 35 reads**, with a note praising setting-mechanism fit. Not attributable to the palette on n=1; a tide mechanism in a tidal setting is a genuinely good match, which is §2.1's effect. **prose 6** — see §5, and note that the cause the reader named has nothing to do with vocabulary.

**X38-at-source — worked, and settled an open question in passing.** Exactly one `[X38]` in the run, the at-source repair, none downstream. It also answered [PLAN-TO-90 1.3](../../../architecture/PLAN-TO-90.md): *"no archived device declares a `derivedFrom` — if Agent 3b does not populate it, the repair stays correctly inert."* **Agent 3b populated it.**

---

## 5. The prose and dialogue tax: one contract produces both complaints

**MEASURED.** `prose` is the largest gap on the best manuscripts (top-8 mean 6.9 against a ceiling of 8) and scored **6** on this read. The reader named the cause, and tracing it lands on a single block of the prose prompt.

The locked-fact registry for this run:

```
high_tide_time        "ten minutes past eleven"
weapon_release_time   "a quarter past eleven"      <- the indefinite article is INSIDE the value
```

rendered to the writer as `description: "value"`, under a HARD contract — *"reproduce those exact words… DO NOT convert"*.

**Defect A — the article.** The two values are not parallel, so the model regularises them. **"a ten minutes past eleven" appears about ten times**, including the line the reader quoted:

> *"By then it was a ten minutes past eleven. It had taken fifteen minutes in all. By then it was a ten minutes past eleven."*

That sentence occurs **twice**, and so do four others. The paragraph-fingerprint linter dedupes paragraphs; nothing dedupes sentences.

**Defect B — the description reaches the page.** The description is internal metadata. Under the anti-repetition pressure the writer is simultaneously under, it came back paraphrased and worse than itself:

> *"The **certified wave crest hour** atop the murder day **as per innkeeper's tide charts** was clear."*

`as per … tide charts` and `the murder day` are lifted from the description; *official high tide time* became *certified wave crest hour* because repeating the phrase is forbidden. **This is the mechanism behind *"generated validation language"*, the complaint attached to `prose` in read after read.** No wordlist reaches it, and [X95](../../../architecture/REVIEW_05.md)'s vocabulary work — correct on its own terms — cannot touch it.

### 5.1 The same contract is the dialogue defect

**MEASURED** on the same manuscript, across its 89 dialogue spans:

```
x15  "ten minutes past eleven"        <- inside dialogue
x7   "a ten minutes past eleven"
x3   "cut to the chase"
x3   "I was in the manager's..."      <- the alibi, recited verbatim by the same character
```

The reader's standing complaint about dialogue is **"catchphrase-heavy"**, **"repeated catchphrases feel artificial"**, **"repetitive and too direct"** — in 35 reads, `dialogue` has reached 8 exactly **once**.

**INFERRED, and it is a designed tension rather than a bug:** the locked-fact contract exists to guarantee fair play — every character must state the critical value identically or the mystery becomes unsolvable. **The price is that fifteen lines of dialogue contain the same seven words.** Nobody has ever costed that trade. The contract is enforced with a HARD FAIL; the dialogue cost is invisible to every gate.

**This is the single highest-value unexplored area on the board**, because it is the only place where one mechanism demonstrably suppresses two of the five flat categories at once.

---

## 6. The instruments — what can and cannot see any of this

### 6.1 Both cheap routes are now closed, and the second one closed today

| instrument | question it asks | result |
|---|---|---|
| headline / prose phase | absolute | ranks an 81 above an 86; capped by [X72](../../../architecture/REVIEW_05.md), still cannot discriminate |
| rubric judge, `gpt-4.1-mini` | cardinal | 86 → 70.4, 81 → 69.3: **gap +1.1, spread 7** |
| rubric judge, `claude-opus-5` | cardinal | 86 → 52.3, 81 → 54.6: **ranks them backwards**, spread 8 |
| **pairwise judge** (new) | **ordinal** | **77% overall (23/30), p=0.003 vs chance — but 67% on close pairs (6/9), p=0.25** |

**MEASURED, 2026-08-23, 40 pairs both ways round.** Agreement rises monotonically with the size of the human gap — **67% → 80% → 82%** for 5–9, 10–14 and 15+ marks. That is an instrument reading at its resolution limit: **it resolves about ten marks and cannot resolve five.** Every lever on this board is worth one or two.

The method change was real and worth making — cardinal judging had no signal at all, on either model, and ordinal judging has a measurable one. It is simply not fine enough, and buying more of it (~£4 to make the close bucket significant) would buy a more precise description of a closed door.

### 6.2 The one instrument that works, with its error bar measured for the first time

`story_20260807-1112` versus its source `story_20260806-2230` — the same book with two paragraphs changed — read cold, weeks apart:

**Nine of ten categories identical.** Headline 84 → 85, the single move being `prose` 7 → 8, which is precisely what a two-paragraph rewrite should move.

**The external reader is stable to about ±1.** Against the LLM judge's measured spread of 7–8, that is a two-orders-of-magnitude difference in resolution, and it is the first direct measurement of the instrument this project depends on. **It justifies the dependence.** The operating rule that follows — *one reader per milestone, never per change* — is now evidence-based rather than a concession.

**And a matched pair is stronger still.** Two reads of two manuscripts differing in one lever is the only configuration this project has that can resolve a five-mark difference. `story_20260822-1028` (flags off) exists as the control for `story_20260823-1715` and has not been read.

---

## 7. Cost — the £1 target, and what actually threatens it

**MEASURED**, `node scripts/run-cost-audit.mjs`:

```
five-axis sweep (08-22)   mean £1.07, range £0.91-£1.23
four-flag run   (08-23)   £1.10   (control: £0.99)

Agent 9 prose, first pass   62%      per-chapter polish   18%
scoped regen                 8%      everything else      12%
repeat calls                17%   ->  zero-repeat floor £0.89
```

The mean is at target; the tail is not, and the tail is **repeat calls** — 13 on this run against the control's 15. Two things follow. The governor ([PLAN-TO-90 M2.2](../../../architecture/PLAN-TO-90.md)) is unbuilt and is the direct lever. And **the reliability work is also the cost work**: every retry class closed is money as well as marks.

Two cost-meter defects were fixed today and both had been reporting confidently wrong numbers: `report.total_cost` disagrees with the call log by up to +47% **and mis-ranks its own runs**, and `AzureOpenAIClient` silently ignored an injected `costTracker`, so every script's spend line — including the one in the 0b.0 experiment — read £0.

---

## 8. What is still stopping 90, ordered by evidence

**Tier 1 — the missing capability (§2). Unbuilt, and the whole gap.**

| # | item | why it is here |
|---|---|---|
| 1.1 | **A distinctiveness engine for the OPENING.** `premise` has Agent 3b's five-candidate divergent generation and holds 7 of 14 nines. The opening has a six-entry style rotation and a mandated prop checklist, and 17 identical reader notes. | §2, §4 (X94 proves the *shape* of sentence one is not it) |
| 1.2 | **A distinctiveness engine for PEOPLE.** Every character mechanism in the repo is an error suppressor; the ladder stops at *"stable"*. | §3 |
| 1.3 | **Cost the locked-fact contract.** It buys fair play and pays in `prose` and `dialogue` — 15 identical phrases inside 89 dialogue spans. Nobody has measured the trade or looked for a cheaper form of it. | §5.1 |

**Tier 2 — named, diagnosed, deterministic, free.**

| # | item | worth |
|---|---|---|
| 2.1 | **Strip leading articles from locked-fact values**, so `"a quarter past eleven"` and `"ten minutes past eleven"` are parallel under a verbatim contract | kills *"a ten minutes past eleven"* ×10 |
| 2.2 | **Keep the locked-fact DESCRIPTION out of the writer's prompt**, or mark it as not-for-prose | kills *"certified wave crest hour"*; this is *"generated validation language"* at its source |
| 2.3 | **Dedupe repeated SENTENCES**, not only paragraphs | 5 sentences repeat in the read manuscript |
| 2.4 | Reader's forecast with 2.1–2.3 done: **86–89** | — |

**Tier 3 — open from PLAN-TO-90, unchanged by today.**

- **The gate-authority decision** ([2.1](../../../architecture/PLAN-TO-90.md)) — free, and its prerequisite is a replay over the archive, not a stricter gate.
- **Two seed cases** (`behavioral`, `authority`) — editorial; five of thirteen seeds contribute to no axis.
- **The per-run cost governor** (M2.2) — free, caps the tail at §7.
- **The ten prompt contracts nobody has read** — free, and reading one found X63.
- **`clearance_over_budget` fires on 5 of 5 axes** — a violation every run raises is a budget set wrong, not a story defect.

**Tier 4 — closed, and worth not reopening.**

- **A cheaper judge.** Both methods, both model families, measured. §6.1.
- **More detectors on plot, clues and endings.** [REVIEW_15](../../../architecture/REVIEW_15.md) is the proof: the detectors for the reader's two largest complaints already existed and already fired.
- **Wordlist widening.** Eight instances found; the durable fix is one list, and X95 did it.
- **A frontier generation model.** Not on this evidence: 0b.1 pulled the craft lever once, at n=1, through an instrument that could not read it, and the categories that are flat are flat in a way §2 attributes to an absent engine rather than an absent capability.

---

## 9. The honest position on 90+ every run

**90 once** needs a manuscript at best-ever in every category *plus* an offset at the top of its observed range — 85 + 8 rather than 85 + 3.9. No manuscript has done the first half.

**90 every run** needs the floor there, and [§1.2](#12-and-a-floor-of-90-is-a-harder-number-than-that--the-offset-must-be-planned-at-its-minimum) prices that precisely: planned at the offset a floor must survive (+2, which five of the ten reads at 80+ returned), a headline of 90 needs a **category sum of 88 — eight 9s and two 8s, every run.** Five categories have ever produced a 9 at all. The measured floor across 35 reads is 48; across the eight most recent, 68.

Today's work moved four mechanisms from *believed* to *measured*, closed a second instrument route, and turned 350 human marks from prose into data. **It did not move the score, and §4 is candid that two of the four flags moved nothing measurable.** What it produced instead is the first evidence-backed statement of what the remaining distance is made of:

> The pipeline is very good at being correct and has one engine for being distinctive. The reader pays 9s for distinctiveness. Four of the five capped categories have no such engine, and building one is not a detector, a wordlist, a flag or a model swap.

That is a harder problem than any on the previous boards, and it is the first one that, if solved, has the arithmetic to reach 90. **[§10](#10-the-plan--how-to-reach-a-floor-of-90) is the plan against it.**

---

## 10. The plan — how to reach a FLOOR of 90

§9 states the position honestly and stops. This section is the answer to it: every item in §8, sequenced, with what each is worth, what it costs, and what would prove it wrong.

### 10.0 What the plan has to produce, and why that decomposes into four different problems

From [§1.2](#12-and-a-floor-of-90-is-a-harder-number-than-that--the-offset-must-be-planned-at-its-minimum): a floor of 90 means **eight categories at 9 and two at 8, on every run**. Set that against where each category actually is, on the best eight manuscripts:

| | categories | today | needed | the medicine |
|---|---|---|---|---|
| **A** | opening hook, character clarity, + one more | 8, never a 9 | **9** | a distinctiveness engine — §10.1 |
| **B** | premise, plot, clues, ending, atmosphere | 9 sometimes | **9 every run** | reliability — §10.2 |
| **C** | dialogue, prose | 7.1 and 6.9 | **8 every run** | the locked-fact tax — §10.3 |

Three different problems. **They do not share a medicine, and the project's habit has been to apply C's medicine — remove a defect — to all three.** A cannot be reached by removing defects, because there is no defect: the reader's note is a compliment. C cannot be reached by adding an engine, because the defects are real and named.

**And the fourth problem is that none of this is measurable one run at a time** (§10.4). A floor is a claim about the worst of N, and this project has never read more than one manuscript from a given build.

### 10.1 Workstream A — the distinctiveness engine, generalised from the one that works

**The shape to copy, MEASURED in §2.1:** Agent 3b makes **one** design-tier call, returns **exactly five** candidate devices under an explicit `noveltyConstraints: { divergeFrom, areas, avoidancePatterns }`, a plausibility judge picks one, and the winner is committed as a constraint every downstream agent must honour. The corpus-audit half never fires. So the working ingredient is:

> **generate five divergent candidates in one call, against an explicit list of what to differ from, then commit the winner as a downstream contract.**

That is one call, roughly $0.01–0.02 at design tier, against a £1.10 run. It is cheap enough to run three times.

**A1 — the `divergeFrom` corpus. Free, and it is the precondition.** Agent 3b's `divergeFrom` is populated from seeds. For openings and people there is no corpus at all — **and there could not have been before this week**, because nothing enumerated previous manuscripts. `scripts/external-read-ledger.mjs` now walks 36 of them. A1 is a small extractor that emits, from the archive:

- the **opening situation** of every previous manuscript (who is present, what is discovered, in what posture) — not the sentence, the situation;
- the **cast signature** of every previous manuscript (roles, the distinguishing trait attached to each name).

Deterministic, no LLM, runs over files already on disk. **Nothing in Workstream A can work without it, and it is an afternoon.**

**A2 — opening ideation.** A new design-tier step between Agent 1 and Agent 2: five candidate opening *situations*, `divergeFrom` = the last N openings from A1, judged, and the winner committed into the chapter-1 prose contract.

**It must commit a SITUATION, not a sentence shape.** [X94](../../../architecture/REVIEW_05.md) is the evidence: rotating the opening *style* per story produced the first non-`character-action` opening in the project's history and the hook mark did not move (§4). The reader's seventeen identical notes are about *what is in the scene* — body, clock, weapon, prop, prop — not about how sentence one is built. A2 changes what is in the scene.

**A3 — character signature.** A per-suspect ideation step feeding the character bible Agent 9 already consumes: for each suspect, one **contradiction** (what they do that their role would not predict), one **physical tell**, one **private want** unrelated to the murder — `divergeFrom` = previous casts from A1.

§3 is the argument for it: every existing character mechanism is an error suppressor, the ladder tops out at *"roles are stable"*, and **no note in 35 reads calls a character interesting.** A3 is the first mechanism whose output is a person rather than the absence of a mistake. It reuses the Agent 2b voice-capsule path rather than adding an agent.

**A4 — the third 9, chosen by evidence rather than now.** A and B and C together give six 9s and four 8s: sum 86, headline ~88 at floor offset. The eighth 9 has to come from `pacing`, `dialogue` or `prose`, and **the honest position is that we do not yet know which responds** — so this item is deliberately not specified. `pacing` is the front-runner: it sits 1.1 from 9, its only named defect is now repaired ([X93](../../../architecture/REVIEW_05.md), §4), and its remaining 8s read *"the investigation narrows logically"* — competence language, which is what A treats. Decide after A2/A3 report.

**Cost:** two extra design-tier calls per run (~$0.03), plus A1 free. **Falsification:** A2 and A3 ship, and `opening_hook` and `character_clarity` stay at 8 with *"body, prop, prop — strong setup"* and *"roles are stable"*. If that happens, §2's thesis is wrong, and the item Tier 4 currently forecloses — the generation model — reopens with real evidence behind it for the first time.

### 10.2 Workstream B — make the five that can reach 9 reach it every time

This is the half the project is already good at, and it is where a *floor* actually lives: `plot`, `clues` and `ending` have each hit 9 exactly once, and `ending` has also scored 2. **Variance, not ceiling.**

| item | from §8 | note |
|---|---|---|
| **B1 — the gate-authority decision** | Tier 3 | Free, and its prerequisite is a **replay of geometry over the archive** — would the 86-scoring runs have shipped under a blocking gate? Decide from that, not from principle. The repairs must work before the gate is allowed to stop anything. |
| **B2 — `clearance_over_budget` fires on 5 of 5 axes** | Tier 3 | A violation every run raises is a budget set wrong. Free, and it is noise suppression: while it fires on everything it tells us nothing about any run. |
| **B3 — the ten unread prompt contracts** | Tier 3 | Free. Reading one found X63; ten remain. This is the cheapest source of B-class defects on the board. |
| **B4 — the two missing seed cases** (`behavioral`, `authority`) | Tier 3 | Editorial, not code. Five of thirteen seeds contribute to no axis, so two of the five axes reach Agent 3 with a definition and no worked exemplar. |

**None of these is new.** They are listed because a floor plan that only builds engines will produce a book that is occasionally brilliant and occasionally 78.

### 10.3 Workstream C — the locked-fact tax, paid down

§5 is the finding: one contract produces both the `prose` complaint and the `dialogue` complaint. C1–C3 are the free, deterministic fixes; **C4 is the one that matters and nobody has attempted it.**

| item | from §8 | what it removes |
|---|---|---|
| **C1 — strip leading articles from locked values** | 2.1 | *"a ten minutes past eleven"* ×10. The registry holds `"a quarter past eleven"` beside `"ten minutes past eleven"`; under a verbatim contract the model regularises them. Normalise at registration, so the article lives in the sentence and not in the value. |
| **C2 — keep the locked-fact DESCRIPTION out of the writer's prompt** | 2.2 | *"certified wave crest hour atop the murder day as per innkeeper's tide charts"*. The writer needs the value and a neutral label; the description is internal metadata and it reaches the page paraphrased. **This is *"generated validation language"* at its source** — the complaint attached to `prose` in read after read. |
| **C3 — dedupe repeated SENTENCES** | 2.3 | Five sentences repeat verbatim in the read manuscript. The fingerprint linter dedupes paragraphs; nothing dedupes below that. |
| **C4 — cost the verbatim contract itself** | 1.3 | **15 of 89 dialogue spans contain the same seven words.** The contract exists so the mystery stays solvable; the price is that every character speaks the critical value identically, and the reader has called that *"catchphrase-heavy"* in read after read. |

**C4's design, stated so it can be argued with.** The contract is currently *"reproduce these exact words, every time"*. The fair-play requirement is weaker than that: the reader must be able to hold one canonical value. So — **a canonical form plus registered short forms**: the full value must appear verbatim at least once in each chapter that turns on it, and subsequent references in the same chapter may use a registered alias (`the tide time`, `eleven-ten`) drawn from a list generated with the fact and validated against it. **Fair play is preserved because the canonical form is still present and still checkable; the fifteen identical lines become one canonical statement and fourteen natural ones.**

This is the only item on the board that demonstrably lifts two capped categories at once, and it is the reason §8 put it in Tier 1 rather than with its cheap siblings.

### 10.4 Workstream D — measure a floor, which nobody has ever done here

**A floor is a claim about the worst of N. Every quality claim this project has made is n=1.**

**D1 — the cohort.** Five runs from one build, same inputs, all five read. That is the smallest thing that can support "the floor is X". At £1.10 a run that is **£5.50 plus five reads**, and it is the only honest way to say the word *floor*.

**D2 — matched pairs for every lever decision.** Two manuscripts from identical inputs differing in one lever, both read. §6.2 measured the external reader at **±1** — nine of ten categories identical across two reads of near-identical text — which makes a matched pair the only configuration this project owns that can resolve a five-mark difference. `story_20260822-1028` already exists as the control for `story_20260823-1715` and is unread; reading it is the cheapest evidence available today.

**D3 — the ordinal judge, demoted to what it can do.** It resolves ~10 marks, not 5 (§6.1). That makes it useless as an A/B arbiter and genuinely useful as a **regression alarm**: a change that makes a book 10+ marks worse will be caught for pennies before a reader is spent. Run it as a gate on the cohort, never as evidence for a lever.

**D4 — stop reporting the internal number as quality.** Both runs in §4 graded B/100/pass_rate 100 with `retry_stats` all zero, and one of them is an 81. That is settled policy already; D4 is only the reminder that the plan above must not be steered by it.

### 10.5 Workstream E — hold £1 while doing all of the above

Workstream A adds ~$0.03; the cohort in D1 multiplies whatever a run costs by five. Both make the tail matter more.

**E1 — the per-run cost governor** (§8 Tier 3, PLAN-TO-90 M2.2). Free. Repeat calls are 17% of the bill and the whole of the variance between a £0.91 run and a £1.23 one. Prose retries past attempt N take the scoped repair path instead of a full regeneration.

**E2 — one cost number.** `report.total_cost` disagrees with the call log by up to +47% and mis-ranks its own runs; `scripts/run-cost-audit.mjs` is now authoritative. Make the report read from the same source or delete the field.

### 10.6 Sequence, and what each step costs

```
NOW, free, in this order — nothing downstream works without A1
  A1   opening + cast-signature corpus from the 36 archived manuscripts     free
  C1   strip leading articles from locked-fact values                       free
  C2   keep locked-fact descriptions out of the writer's prompt             free
  C3   sentence-level dedupe                                                free
  E1   per-run cost governor                                               free
  E2   one cost number                                                     free
  B3   read the ten unexamined prompt contracts                            free
  B1   geometry replay over the archive, then the gate decision            free
  B2   re-set the clearance budget                                         free
---- the free half is exhausted here; everything below needs money or a reader ----
  D2   READ story_20260822-1028, the existing matched control              a reader
  C4   canonical form + registered aliases for locked facts                free build, ~£1 to verify
  A2   opening ideation, five candidates, committed as a situation         free build, ~£1 to verify
  A3   character signature per suspect                                     free build, ~£1 to verify
  B4   two seed cases                                                      editorial
---- only now is a floor claim meaningful ----
  D1   five-run cohort from one build, all five read                       ~£5.50 + 5 reads
  A4   choose the eighth 9 from what D1 shows responded                    a decision
```

**Free work: nine items.** Paid work before the cohort: about **£3 and one read**. The cohort itself is the expensive part, and it is the only part that can produce the word *floor*.

### 10.7 What would falsify this plan

Stated now, so it cannot be rationalised later:

1. **A2 and A3 land and the marks do not move** — `opening_hook` still 8 with a props inventory, `character_clarity` still 8 with *"roles are stable"*. Then §2's thesis is wrong: distinctiveness is not what the reader is paying for, or this model cannot produce it on instruction. **That is the evidence that reopens the generation-model question**, which Tier 4 currently closes for want of exactly this.
2. **C4 ships and `dialogue` does not reach 8** on the best books. Then the catchphrase complaint is not the locked-fact contract, and §5.1's inference is wrong.
3. **The D1 cohort comes back with a spread wider than 6 marks.** Then run-to-run variance dominates every lever on this board, and the work is reliability-only until it does not.
4. **B1's replay shows the 86-scoring runs would NOT have shipped under a blocking gate.** Then geometry cannot be given authority at any point in this plan, and §8 Tier 3's first item is closed rather than pending.

### 10.8 What this plan does not promise

It does not promise 90. The arithmetic in §1.2 is unforgiving: **eight 9s and two 8s on every run**, against a corpus whose best single manuscript sums 83 and whose best-ever composite sums 85. Workstream A is the only item on this board with the *shape* to add a 9 where there has never been one, and it is unproven — one measured precedent (`premise`), transplanted twice, on the argument in §2.

What it does promise is that **every remaining item is either free, falsifiable, or both**, that the free half can be finished before any further money is spent, and that for the first time the plan is aimed at what the reader is measured to reward rather than at what the pipeline finds easy to detect.

---

## 11. BUILD RECORD — the free half, 2026-08-23

Built in §10.6's order, immediately after §10 was written. Everything here is flag-gated or
deterministic; full suite green (17 packages), `npm run flags:check` clean.

| § | item | status |
|---|---|---|
| C1 | strip leading articles from locked-fact values | **BUILT** |
| C2 | keep locked-fact descriptions out of the writer's prompt | **BUILT** |
| C3 | sentence-level dedupe, both scopes | **BUILT** |
| A1 | the `divergeFrom` corpus | **BUILT** |
| A2a | the corpus-driven opening directive | **BUILT** — half of A2; see §11.5 |
| B2 | re-set the clearance budget | **INVESTIGATED — premise falsified, no change** |
| A2b, A3, C4, E1, E2, B1, B3 | — | **not built** |

### 11.1 C1 — the article was inside the value

`stripLeadingArticleFromLockedValue`, applied in the same registration seam as the existing
`wordifyLockedFactValue`, because the registry is where a value is made canonical and every consumer —
prompt, validator, artifact — reads the same string. Deliberately narrow: one leading `a`/`an`/`the` or
nothing, never reaching inside the phrase, never emptying a fact. 8 tests, most of them about what it
must NOT do.

### 11.2 C2 — a label is not a sentence

`lockedFactLabel` derives a short neutral name from the fact's `id` (`high_tide_time` → *"high tide
time"*), used at all **three** prompt sites. The description is untouched in the registry, the artifact
and every validator; this is only about what crosses into the writer's prompt. 6 tests.

The third site is the interesting one: it hands descriptions to the writer under an explicit
instruction to *"surface the MEANING, never copy the phrasing word-for-word"*. That is the pressure
that produced *"certified wave crest hour atop the murder day as per innkeeper's tide charts"* — the
prompt asked for a paraphrase of internal metadata, and got one.

### 11.3 C3 — and the comment beside it was false

Two defects, both measured over 198 archived manuscripts:

- **The threshold was too high.** `SENTENCE_DEDUP_MIN_CHARS` was 45; the sentence the reader quoted
  back normalises to **40**, so it was never checked. Lowered to 30, which raises corpus-wide
  intra-chapter detections from 76 to 111 — **0.56 per book** — and every one of the 35 it adds is a
  genuine repeat.
- **The comment claimed `paragraph_fingerprint` covered cross-chapter repeats. It does not** — that
  check matches whole PARAGRAPHS, so one sentence recurring in two chapters inside different paragraphs
  was covered by nothing. Three of the 08-23 manuscript's five repeats are exactly that.

**Cross-chapter echo is counted always and raised only behind `AGENT9_CROSS_CHAPTER_ECHO`, and the
measurement is the reason.** Cross-chapter repeats run a **median of 6 per book** against
intra-chapter's 0.56, and every lint issue becomes a `batchError` that drives a retry — so raising them
unconditionally would put a retry on nearly every chapter of every run. That is the cost that kept
`AGENT9_FOLD_SUSPECT_CLEARANCES` switched off for a month, and it is not worth paying twice.

What the always-on count reveals is worth having on its own. Sampled from the corpus, cross-chapter
repeats are catchphrases and verbatim alibi recitals:

> *"that's the only certainty we have"* · *"one mustn't jump to conclusions"* ·
> *"ambition is not a crime, Miss Voss"* · *"I was in the smoking room from eight fifty to nine thirty"*

That is, word for word, the reader's standing complaint about `dialogue` — a category that has reached
8 exactly **once** in 35 reads. **It is the first instrument pointed at why.**

### 11.4 A1 — the corpus, and what it says about the cast

`scripts/build-opening-corpus.mjs` → `data/opening-corpus.json` plus a generated TypeScript constant
(the prompt imports the constant; a package resolving a JSON path from inside `dist` is a recurring bug
here). Deterministic, no LLM, 184 manuscripts.

Share of archived openings containing the word, proper nouns excluded:

```
scent 76% · faint 72% · against 66% · morning 64% · pressed 63% · damp 60%
hush 56% · sprawled 54% · pale 51% · chill 51% · gloved 39% · brass 38%
```

**Proper nouns are excluded because the first run of the extractor put `eleanor` (76%) and `voss` (71%)
at the top**, and an avoid-list containing the detective's name is an instruction not to name the
detective. Detected structurally — a token predominantly capitalised across the corpus — so no name
list can go stale.

> **AND IT CORRECTS §10.1's A3.** The same seven characters appear in **64–77% of all 198
> manuscripts** — Eleanor Voss and Beatrice Quill in 154 books each. That is **not** a generator
> defect: `scripts/canary-core-inputs.yaml` pins `castNames`, deliberately, to keep the gender lock and
> the pronoun regression tests reproducible. A "diverge from previous casts" engine would be arguing
> with the harness. **A3 must therefore diverge on SIGNATURES, not on names** — attaching a
> contradiction, a tell and a private want to whatever cast it is handed. It also means the reader has
> met these six people 154 times, which is worth holding beside `character_clarity`'s ceiling.

### 11.5 A2a — half of A2, and the half that costs nothing

`buildOpeningFreshnessBlock`, chapter 1 only, behind `AGENT9_OPENING_FRESHNESS`. It cites the measured
share and asks for a detail only this case could produce, explicitly forbidding the synonym reach —
because a rarer word for the same image is the same image, and reaching for one is precisely how X95's
closed vocabulary produced *"certified wave crest hour"*.

**Two subtractions make it safe, and both are tested:**

1. **Words the grounding validator REQUIRES are never asked to be avoided.** Nine of the 31 overused
   words — `scent`, `damp`, `chill`, `cold`, `rain`, `silence`, `morning`, `pale`, `light` — are members
   of X95's `OPENING_SENSORY_MARKERS`/`OPENING_ATMOSPHERE_MARKERS`, which a retry-driving gate requires
   in the first two paragraphs. Asking for both would put two instructions in one prompt in direct
   contradiction, and the retry-driving one would win.
2. **The story's own furniture is not a cliché.** `hotel`, `room`, `clock`, `windows`, `floor` are
   frequent because the runs share a setting and a device. Words appearing in this run's location, title
   or mechanism are subtracted at prompt-build time.

What survives is the house **voice** rather than the house furniture — `faint`, `pressed`, `sprawled`,
`hush`, `gloved`, `tang`, `polished` — which is the layer the reader is describing when 17 notes read
alike.

**A2b — the five-candidate ideation call — is NOT built.** It is a new agent with a new failure surface
and deserves its own increment. This half is the `divergeFrom` ingredient applied at the point of
writing, for no extra call; it is not a substitute and does not claim to be.

### 11.6 B2 — investigated, and the premise was wrong

§8 Tier 3 said *"`clearance_over_budget` fires on 5 of 5 axes — a violation every run raises is a budget
set wrong."* **Measured before changing it, across the 14 externally-read manuscripts:**

```
chapters over a budget of 2 :  14% of all 139 chapters      median chapter: 0 clearance sentences
the 86-scoring manuscript   :  0 of 10 chapters over        (max 2 — it satisfies the budget exactly)
the other 86                :  2 of 10 chapters over        (max 4)
```

The check fires on **14% of chapters**, not on everything; *"5 of 5 axes"* was a run-level reading of a
chapter-level rule that trips once or twice per book by design. And the best manuscript in the corpus
is the one that satisfies it outright, which is weak evidence the budget points the right way.

**No change made.** The finding is that §8's item rested on an aggregation artefact rather than a
mis-set threshold — and a budget loosened on that reasoning would have removed a working check.

### 11.7 What is NOT built, and why it is not a rounding error

`A2b` (the ideation call), `A3` (character signatures — and §11.4 changed its design), `C4` (canonical
form plus registered aliases for locked facts), `E1` (the per-run cost governor), `E2` (one cost
number), `B1` (the geometry replay) and `B3` (reading the ten prompt contracts) are all still open.

**C4 is the one that matters most of those**, because §5.1 measured it as the only mechanism that
suppresses two capped categories at once — and it is also the one that touches the fair-play contract,
so it should not ride into a run assembled at the end of a long session.

---

## 12. B3, begun — the first-appearance contract asks for a FUNCTION, and gets one

[REVIEW_14 §5](../../../architecture/REVIEW_14.md) listed ten prompt blocks that have never appeared in
any review, 32.6% of the prompt by name. One of them — `locked_facts` — is now audited exhaustively
(§11.1–11.3 above are all its territory). This is the second, and it was chosen because it is the
largest of the remaining nine at **5.5% of the prompt** and because it is the only block in the
pipeline whose job is to introduce a person.

`buildFirstAppearanceContractsBlock` requires five things of every character's first beat:

```
1. Public identity (who they are in this household/social world)
2. Connection to the victim
3. Why they matter to the investigation now
4. Surface behaviour plus one subtle suspicious/emotional tell
5. The investigator's immediate read of that behaviour (provisional, not a verdict)
```

**Every one of the five is the character's function in the MYSTERY.** Identity, relation to the victim,
investigative relevance, a suspicion cue, and the detective's reading of the cue. Nothing asks what
this person wants, fears, or would be doing if nobody had been murdered. The per-character data the
block then supplies is the same shape throughout — `role`, `public_persona`, `access_plausibility`,
`alibi_window`, `opportunity_channels`, `behavioral_tells`, `stakes`, `motive_seed`. Case-function
fields, all of them.

And the prompt's own worked example is the tell:

> **Good pattern:** *"Captain Hale, the household steward and the victim's trusted adviser, stood
> nearest the body. His posture was disciplined, but his hand tightened around his watch chain."*

Role, relation, suspicion cue. **That is a specimen of exactly the register the reader marks 8** — it
is competent, legible, and there is nothing in it a reader would carry to the next book.

### 12.1 What this corrects in §3

§3 said *"every mechanism aimed at `character_clarity` is an error suppressor"* and listed the pronoun
repairs, the identity matcher, the lifecycle validators. **That was incomplete, and the omission
matters.** This block is not a suppressor — it is a SPECIFIER, the one place the pipeline says what a
character introduction must contain. It gets what it asks for.

So `character_clarity` topping out at *"roles are stable"* is not the model failing to do more. **The
contract asks for roles to be legible and asks for nothing else, and the prose complies.** The ceiling
is written down.

### 12.2 What it means for A3

A3 was specified in §10.1 as a new per-suspect ideation step. §11.4 already narrowed it — the cast is
pinned by the harness, so it must diverge on signatures rather than names. This narrows it again, and
cheaply: **the place to put a signature is a sixth requirement in a contract that already exists, runs
on every chapter, and is already marked `priority: critical`.** Something on the order of:

> *6. One thing about this person that the investigation does not explain — a want, a habit, or a
> contradiction that would still be true if there had been no murder.*

That is not a new agent. Whether it needs a generated per-character signature to draw on, or whether
the instruction alone is enough, is exactly the sort of thing one run can answer — and it should be
asked separately from the opening work now in flight, because a run carrying both cannot attribute
either.

**Not built.** Recorded, with the block named and the line quoted, so the next increment starts from
the source rather than from the hypothesis.

### 12.3 The eight blocks still unread

`narrative_state` (5.2%) · `fair_play_contract` (5.2%) · `pronoun_accuracy` (4.9%) ·
`scene_grounding` (2.6%) · `clue_descriptions` (2.2%) · `provisional_scoring_feedback` (1.8%) ·
`character_consistency` (1.4%) · `character_pressure_contract` (1.4%)

The hit rate on blocks anyone has opened and read line by line is now **2 for 2** — X63 in
`character_contracts`, and this. That is a small sample and a cheap one: every reading is free.

---

## 13. RESULT — the A_72 run · 2026-08-23 20:38 · £1.24

`mystery-1787512796202` → `story_20260823-2038/the_hourglass_deception_at_cliffside_bluffs.md`. Same
inputs yaml as the 81-scoring run, so the only deliberate variables are C1/C2/C3 and A2a. Shipped,
gate `warning`, clue status `pass`, 111 warnings.

**Two of the four worked, one is inert, and one is unmeasurable from this run.**

| | prediction | result |
|---|---|---|
| C1 | the malformed article disappears | **CONFIRMED** |
| C2 | the description stops reaching the page | **CONFIRMED** |
| C3 | the echo is counted | **CONFIRMED** (gate off by design, so the book still ships repeats) |
| A2a | chapter 1 stops using the house-style words | **FALSIFIED** |

### 13.1 C1 — confirmed, and the run found the half I had missed

The registry came out parallel:

```
last_seen_alive_time         "ten minutes past eleven"
suspect_claimed_start_time   "quarter to eleven"        <- was "a quarter to eleven"
```

The prose then writes *"a quarter to eleven"* **19 times, correctly**, because the article now lives in
the sentence where it belongs. No `"a ten minutes past eleven"`, no doubled articles anywhere in the
book. **The defect the external reader quoted back is gone at its source.**

**And the artifact exposed a second call site I had missed.** Four facts still carried theirs:

```
murder_weapon                 "a decorative brass statue"
alibi_location_beatrice_quill "the kitchen"
alibi_location_sylvia_trent   "the lounge"
alibi_location_hugo_vane      "the dining room"
```

Those enter through `extendLockedFactRegistryWithCaseFacts` ([X51](../../../architecture/REVIEW_05.md))
in `agent3-run.ts`, appended *after* Agent 3b builds the registry — a path C1 did not touch. Harmless on
this run, because the four are mutually parallel and the prose read correctly. Fixed anyway, because a
value with an article beside one without is the entire defect. **One capability, two call sites, one
wired — the shape this document spends §5 and §11 describing, committed by the change that documented
it.** Found by reading the run's own artifact, not by the suite.

### 13.2 C2 — confirmed

The registry's descriptions on this run are as prose-shaped as ever — *"The calibrated time it takes for
the hourglass sand to run completely from top to bottom"* — and **none of it reached the page.** No
`as per`, no `official … time`, no invented synonym for a measurement. The 81-scoring run's
*"certified wave crest hour atop the murder day as per innkeeper's tide charts"* has no counterpart
here.

### 13.3 C3 — the counter works, and it is counting the right thing

Eight always-on warnings across the run, 15 echoes in total. The gate is off by design, so the book
ships with them — 6 repeated sentences, against the previous run's 7. What they are is the point:

```
x2  "well isn't that just the way it goes"
x2  "we do so love our little rituals"
x2  "she said, her tone brittle with forced cheer"
```

**Catchphrases, verbatim, in dialogue.** That is the reader's standing complaint about `dialogue` —
*"repeated catchphrases feel artificial"* — now visible in telemetry on the run that produced it,
rather than inferred from a cold read weeks later. Intra-chapter detections were 0, consistent with the
book's repeats all being cross-chapter.

### 13.4 A2a — falsified, and cleanly

The block reached the prompt in full:

> *"Across 184 previously generated openings, these words recur at the share shown: faint (72%),
> against (66%), pressed (63%), across (56%), hush …"*

Twelve words were asked for. Chapter 1 used **five of them** — `faint`, `against`, `pressed`,
`sprawled`, `windows`.

| run | avoid-words used in the opening paragraph |
|---|---|
| control (no flags, 08-22) | **9 of 12** |
| four-flag (08-23 17:15, read 81) | **5 of 12** |
| this run, WITH the freshness block | **5 of 12** |

**The block changed nothing.** The improvement from 9 to 5 had already happened on the previous run,
without it — which attributes that drop to X95's palette rotation, not to A2a.

**It is inert rather than harmful**, and that half of the prediction held: no `sensory_grounding`, no
`atmosphere_grounding` and no `opening_style_entropy` retry appeared. The two subtractions did their
job; the instruction simply did not land.

**What it tells us about §10.1.** A2a was explicitly the cheap half of A2 — the `divergeFrom` list
without the ideation call. **The cheap half does not work on its own.** Naming what to avoid does not
produce something better to write; the engine that earns 9s generates five candidates *and chooses
between them*, and this run is evidence that the choosing is not the optional part. A2b is now the only
live form of A2.

### 13.5 Cost, and a comparison this run cannot support

£1.24 against the previous run's £1.10, with repeat calls 13 → 20. **This is not attributable to the
flags**, and the reason is worth stating: Agent 3b generates a new device every run, so the previous
run got a tide mechanism and this one an hourglass. Same inputs yaml, different case, different
difficulty. The extra retries are `missing_clue` (18), `scaffold_not_prose` (8) and `missing_resolution`
(6) — clue and resolution families, none of them touched by anything built today.

Two runs on two different cases cannot separate a lever from case difficulty. That is the same
constraint §10.4 states for quality, arriving on the cost side: **a floor claim needs a cohort, not a
pair.**

### 13.6 Where this leaves the board

- **C1 and C2 are done and confirmed on the page.** They were the reader's named `prose` defects, and
  the reader's forecast for removing them was 86–89 against an actual 81. That forecast is now testable
  by one read.
- **C3's counter is live**, and it has turned the `dialogue` complaint into a per-run number for the
  first time. Promoting it to a gate remains a separate decision with a measured cost.
- **A2a is falsified; A2b is the live form.** The distinctiveness engine needs its generate-and-choose
  half, which is what §2.1 measured in the first place.
- **What is unmeasured is still the whole question.** This book has not been read. There is now a
  matched control at 81 from the same inputs, one lever-set apart.

---

## 14. THE READ — 85/100, and `prose` moved

`story_20260823-2038`, cold read. **85/100** — joint-third of the 36 reads on file, behind two 86s.
And the reader's closing line: *"With the timing sequence corrected and the generated artifacts
removed, this could reach 90/100."*

| category | 1715 (81) | 2038 (85) | |
|---|---:|---:|---|
| premise | 9 | 9 | |
| opening_hook | 8 | 8 | |
| plot structure | 8 | 8 | |
| character clarity | 8 | 8 | |
| dialogue | 7 | 7 | |
| atmosphere | 9 | 8 | **−1** |
| mystery clues | 8 | **9** | **+1** |
| pacing | 8 | 8 | |
| ending | 8 | 8 | |
| **prose** | **6** | **7** | **+1** |
| **category sum** | **79** | **80** | **+1** |
| **headline** | **81** | **85** | **+4** |
| offset | +2 | +5 | |

### 14.1 Read the sum, not the headline

**The headline moved +4 and the category sum moved +1.** Three of those four marks are offset — the
reader's holistic bump, which §1.2 measured at 0..+8 and which nothing in this pipeline controls. A
plan that banked the +4 would be banking noise.

What is real is the **+1 on `prose`, and it is the category C1 and C2 were aimed at.** The 81-scoring
read named two mechanisms; both were fixed at source; the mark moved. On n=1 against a reader measured
at ±1 (§6.2) that is exactly one unit of evidence — not proof, but the prediction was made in advance
and it came true in the right category.

`clues` 8 → **9** is a new 9, and it belongs to Agent 3b rather than to anything built today: the
reader's reason is *"the sand-level contradiction is strong and easy to follow"*, and the hourglass is
a device the novelty generator produced. **That is §2.1's engine earning another 9, in the second
category it feeds.** `atmosphere` 9 → 8 is the same coin: a cliffside hotel read less well than a tidal
one. Both are case variance, and both argue that the engine — not the prompt layer — is what moves
these categories.

**Every one of the five never-9 categories is unchanged**: hook 8, character 8, dialogue 7, pacing 8,
prose 7. A2a's falsification (§13.4) now holds at the mark as well as in the text.

### 14.2 The reader's prose complaint is a template injector, and it is new

`prose` is 7 rather than 8, and the reader is specific about why:

> *"Some prompt artifacts remain. These lines should be removed:*
> *'Victim last seen alive minutes past.' · 'Captain ivor hale uniquely means skill.' ·*
> *'That left Captain Ivor Hale as the only person whose story still needed the discredited theory to
> be true.' · 'Captain Ivor Hale was responsible; the evidence allowed no other reading.'*
> ***Those lines are the main reason the polish score stays below 8.***"

Traced to `buildDeterministicClueParagraphs` in `deterministic-repair.ts` — the **missing-clue repair**.
It writes:

```
${lead} The record now held: ${clueList}.
Those details shifted the reasoning. Weighed against the rest, ${description} bent the trail toward ${pointsTo}.
```

`description` and `pointsTo` are **de-spoiled key-term lists**, not noun phrases, so the page gets:

```
"…the following hard fact the file currently held: Victim last seen alive minutes past."
"…bent the trail toward Temporal conflict hale alibi."
"…bent the trail toward Elimination suspects based means skill."
```

Eight such sentences in the shipped book. **This is X65's shape exactly** — a schema field wearing a
full stop — in a second injector, which is also A_71 §3's finding about the clearance prose repeating
itself in a new place.

**And it is NEW to this run.** The class appears zero times in the 81-scoring manuscript and zero times
in the 08-22 control. The difference is the retry profile: this run took **18 `missing_clue` retries**
against the previous run's handful, so the deterministic patch fired where it previously had not.

Two things follow, and they are worth separating:

1. **`prose` rose to 7 even while a new artifact family appeared.** C1 and C2 removed enough to gain a
   mark against a headwind — which strengthens their result rather than weakening it.
2. **The same retry class is the cost driver and the prose defect.** §13.5 attributed the £1.24 to
   `missing_clue` retries and declined to blame the flags. That was right, and it was half the story:
   those retries do not merely cost money, they *inject the prose the reader marks down*.

### 14.3 What this makes the next move

The reader's list for reaching 90 is five items, and they are not equally hard:

| their fix | what it is here |
|---|---|
| remove the prompt-artifact lines | **the injector above** — the largest named prose defect on the board |
| cut the repeated proof in ch8 | the aftermath/repeat family; X93's territory, still 8 |
| correct the hourglass arithmetic | a `false_time` coherence check the geometry layer could hold |
| state one timeline plainly | `reveal_times_not_stated`, a geometry code that already exists |
| give the scandal one concrete detail | **X69's motive-noun rule**, which shipped 08-21 and evidently did not bind here |

Three of the five already have machinery. **The injector has none, and is now the single most
frequently named prose defect across two consecutive reads.**

Its fix is not deletion: the patch exists because a clue is missing and a gate needs it present.
A_71 §3 settled the shape of this argument once already — **the injector is a floor, and the repair
belongs upstream of it**, at whatever is producing 18 missing-clue retries in a single run.

### 14.4 The arithmetic, honestly

```
category sum        80    (needed for a 90 FLOOR at the floor offset: 88)
this read's offset  +5    (a floor plan must survive +2)
at +2 this book     82
```

**85 is the best result this project has produced in three months and it is not close to a floor of
90.** Eight of ten categories would have to reach 9; two did. The five that have never reached 9 are
still at 8, 8, 7, 8, 7 — unmoved by everything built today, which is what §10.0 predicted would happen
until the distinctiveness engine exists in its generate-and-choose form.

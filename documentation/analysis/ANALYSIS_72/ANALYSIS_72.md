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

`premise` is the only category with a dedicated novelty apparatus:

- **Agent 3b** (`agent3b-hard-logic-devices.ts`) — *"generates novel, contradiction-driven mechanism concepts before CML generation… so the final CML is grounded in explicitly generated novel devices"*, with an explicit `noveltyConstraints` input.
- **Agent 8** (`agent8-novelty.ts`) + `@cml/novelty` — a corpus store, a skeleton extractor and a comparator that audits the finished case against everything previously generated.

**That is a whole subsystem whose only job is "do not produce the same mystery twice."** Its category, and only its category, routinely earns 9s — and the reader's language for those 9s is exactly the language the subsystem optimises for: *distinctive*, *memorable*, *one of the best mechanisms so far*.

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
| 1.1 | **A distinctiveness engine for the OPENING.** `premise` has Agent 3b + Agent 8 and holds 7 of 14 nines. The opening has a six-entry style rotation and a mandated prop checklist, and 17 identical reader notes. | §2, §4 (X94 proves the *shape* of sentence one is not it) |
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

**90 every run** needs the floor there. The measured floor across 35 reads is 48; across the eight most recent, 68.

Today's work moved four mechanisms from *believed* to *measured*, closed a second instrument route, and turned 350 human marks from prose into data. **It did not move the score, and §4 is candid that two of the four flags moved nothing measurable.** What it produced instead is the first evidence-backed statement of what the remaining distance is made of:

> The pipeline is very good at being correct and has one engine for being distinctive. The reader pays 9s for distinctiveness. Four of the five capped categories have no such engine, and building one is not a detector, a wordlist, a flag or a model swap.

That is a harder problem than any on the previous boards, and it is the first one that, if solved, has the arithmetic to reach 90.

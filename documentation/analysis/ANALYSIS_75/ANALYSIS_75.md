# ANALYSIS_75 — prose has never been praised, and the ladder it is on stops at 8

**Written:** 2026-08-26 · **Trigger:** owner's request — *"focus on getting our prose to hit 9. Review all the recent stories and come up with a list of what is stopping us."*

**Type:** a BOARD for one category. `prose` is the lowest-scoring of the ten across 41 external reads (mean 5.6), the furthest from its own ceiling on the best manuscripts (top-8 mean 6.9 against a max of 8), and one of the five that has **never been given a 9**.

**Method note, carried from [A_71](../ANALYSIS_71/ANALYSIS_71.md):** every claim is **MEASURED**, **INFERRED**, or **UNBASELINED**. The two central findings here are measured over the 40 reads carrying a prose note and the 15 manuscripts from 2026-08 onward.

**The through-line, stated first.**

> **Every prose note ever written describes an ABSENCE. Even the 8s.**
> 38 of 40 name leakage or artifacts. **2 of 40 contain a positive adjective about the writing**, and both
> are "strong … *but*". The reader has never once praised a sentence.

`prose` is on a defect-removal ladder whose top rung is *"cleaner than the weaker drafts, with fewer obvious artifacts"*. **That rung is an 8, and there is no rung above it**, because the ladder only measures what is missing. A 9 requires the reader to notice a sentence — and §3 shows there is currently nothing for them to notice, because all fifteen recent books are written in one voice.

---

## 1. The ladder, rung by rung

**MEASURED** — all 40 reads carrying a prose note, grouped by mark, quoted verbatim.

| mark | n | what the reader says |
|---|---:|---|
| **8** | 2 | *"Much cleaner than the weaker drafts, with fewer obvious artifacts."* · *"Cleaner than most previous drafts, though a few generated phrases remain."* |
| **7** | 9 | *"Cleaner than many, but several prompt-artifact lines remain."* · *"Mostly clean, but some generated validation language remains."* |
| **6** | 11 | *"Still heavily capped by validation/scaffold leakage."* · *"Chapter 10 contains major validation leakage."* |
| **5** | 10 | *"Still damaged by pronoun drift and leftover validation-style phrasing."* |
| **4** | 8 | *"Prompt leakage, malformed weather/log phrases, and pronoun slips hurt it."* |

Across all 40 notes:

```
38/40  (95%)  name leakage / artifacts / generated / note-like / scaffold
20/40  (50%)  are COMPARATIVE — "cleaner", "better", "mostly", "fewer"
18/40  (45%)  name pronoun errors
14/40  (35%)  name malformed or broken phrases
 6/40  (15%)  name repetition
 2/40  ( 5%)  contain any positive adjective — and both are "strong … but"
```

**The 4→8 progression is one axis: how many artifacts did the reader trip over.** Nothing else varies. That is why 8 is the ceiling — the scale runs out when the count reaches zero.

---

## 2. What has actually been fixed, and what has not

**MEASURED** over the 15 manuscripts from 2026-08 onward, joined to their reads.

| class | status | evidence |
|---|---|---|
| **pronoun slips** | **SOLVED — stop re-fighting it** | Named in every note at prose 4–5, and in **zero** notes at prose 6 or above. The A_66 pronoun work closed this class. |
| **malformed value phrases** | **FIXED at source, unverified by a read** | *"a ten minutes past eleven"* ×16 in `20260823-1715` (prose 6) and **0 in every later book**. C1 normalised the locked-fact article; the 08-26 run carried it and the defect did not recur. |
| **description paraphrase** | **FIXED at source, unverified by a read** | *"certified wave crest hour atop the murder day"* — C2 removed the description from the writer's prompt; no counterpart in any later manuscript. |
| **injector leakage** | **PARTIALLY understood, NOT closed** | See §2.1 — the relationship is weaker than assumed, and the registry does not know every form. |
| **repeated sentences** | **NOT a driver** | See §2.2. |

### 2.1 Injector leakage is necessary, not sufficient — and undercounted

**MEASURED**, injector-template hits per manuscript against the prose mark:

```
prose 8   20260806-2255   0        prose 6   20260825-1838    0   <- "MAJOR validation leakage"
prose 8   20260817-2209   0        prose 6   20260826-1753   10
prose 7   20260823-2038   9        prose 6   20260823-1715    0   (16 malformed instead)
prose 7   20260806-2230   1        prose 6   20260826-1708    2
```

Two things follow, and they pull in opposite directions:

1. **Both prose-8 books have zero injector lines.** No book has scored 8 while carrying them. Necessary.
2. **Zero injector lines does not produce an 8.** Three prose-6 books have 0 or 1. Not sufficient.

And the sharpest one: **`20260825-1838` scored prose 6 with the note *"Chapter 10 contains major validation leakage"* and my template probe found nothing.** Reading that chapter, there is no template match — the closing paragraphs are simply written in a summarising, valedictory register (*"The truth was out, but innocence, once lost, would not return"*). **The reader is recognising a REGISTER, and we are detecting STRINGS.** Every leakage pattern we own was derived from a template we wrote; the reader is responding to something broader, and no list of known templates will converge on it.

### 2.2 Repeated sentences do not drive the mark

**MEASURED.** Duplicate sentences (≥30 normalised chars, appearing twice or more):

```
prose 8: 12 and 5 duplicates
prose 6:  0,  0,  1,  5,  7
```

**The two best-scoring books contain MORE repeated sentences than most of the worst.** C3's detector is correct and worth having as telemetry — repetition is real — but it is not what is capping this category, and an increment aimed at it should not be expected to move the mark.

---

## 3. THE FINDING: fifteen books, one voice

**MEASURED** across the 15 recent manuscripts — every texture statistic that could plausibly distinguish good prose from adequate prose:

| | prose 8 (n=2) | prose 7 (n=7) | prose 6 (n=6) |
|---|---:|---:|---:|
| mean sentence length | 15.1 | 14.3 | 14.9 |
| within-book sd | 8.6 | 8.0 | 8.2 |
| sentences under 8 words | 20.8% | 20.9% | 18.8% |
| dialogue share | 16.3% | 21.1% | 16.8% |

**There is no signal.** Not in length, not in variance, not in the share of short sentences, not in dialogue density, not in semicolons or em-dashes. The book the reader gave a 6 and the book they gave an 8 are written the same way.

Stated as a single number:

```
mean sentence length across 15 books : 14.65 words
BETWEEN-book standard deviation      :  0.80 words
WITHIN-book standard deviation       :  8.16 words

between-book variation is 10% of within-book variation
```

**Every manuscript this pipeline has produced is drawn from effectively one distribution of sentences.** Fifteen books, one voice — the same finding [A_72 §2](../ANALYSIS_72/ANALYSIS_72.md) made about openings (17 identical reader notes) and about people (*"roles are stable"*, 154 books, same six characters), arriving now at the sentence level.

**This is why there is no 9 available.** A reader awards a 9 for prose when a sentence does something. Ours are uniformly competent, uniformly 14.65 words, uniformly the same register — and the reader, having nothing to praise, correctly reports the only thing that varies: how many artifacts they tripped over.

---

## 4. The list — what is stopping prose from hitting 9

Ordered by what the evidence supports, not by ease.

### Tier 1 — the ceiling itself (nothing here is built)

| # | item | why |
|---|---|---|
| **1.1** | **Nothing in the pipeline asks for a sentence worth noticing.** The prose contract specifies obligations (name the clue, ground the scene, hit the word count) and prohibitions (no leakage, no repetition). There is no instruction whose output is a good line, and no check that would know one. | §3: the texture is flat across all 15 books and all three marks. |
| **1.2** | **There is no per-story voice.** Between-book variation is 10% of within-book variation. Every book has the same rhythm, so style cannot distinguish one from another — the same defect X94 found in openings and A_74 §11.4 found in the cast, now at the sentence level. | §3 |
| **1.3** | **Nothing measures prose quality — only prose defects.** Every prose signal we own is a detector for something wrong. A category whose instrumentation is entirely negative cannot be optimised upward. | §1: 38/40 notes are about absence |

### Tier 2 — finishing the defect ladder (gets a reliable 8, not a 9)

| # | item | status |
|---|---|---|
| **2.1** | **Leakage is a REGISTER, not a string list.** `20260825-1838` scored 6 for leakage our template probe cannot see. Detecting "summarising valedictory register" needs a classifier, not another pattern. | open, and the most under-estimated item here |
| **2.2** | **The clue injector's operands are token bags used as sentence subjects** — *"bent the trail toward Temporal conflict hale alibi"* is ungrammatical by construction, not by accident. | diagnosed, not built |
| **2.3** | **X4's culprit floor** — the in-scene form is built and flag-gated, never run. | `AGENT9_CULPRIT_INJECTION_IN_SCENE`, off |
| **2.4** | C1 / C2 fixed at source, **unverified by a read** — the 08-26 manuscript carried both and scored prose 6 for other reasons. | needs one read to confirm |

### Tier 3 — closed, and worth not reopening

- **Pronoun work.** Solved; zero mentions at prose ≥6.
- **Sentence-level repetition as a mark driver.** §2.2 — the prose-8 books have the most.
- **More leakage patterns of the kind we already have.** §2.1 — we are enumerating our own templates while the reader responds to register.

---

## 5. What I would do, and what I would not

**I would not** build another leakage detector. Five of the seven items ever shipped for this category were detectors, `prose` has moved from 4 to 6–7 on the back of them, and §1 shows the ladder they climb ends at 8.

**I would** do 2.3 and 2.4 first, because they are built or fixed and only need a run to settle — cheap, and they are what stands between "6 for leakage" and a clean 8.

**And the real work is 1.2**, because it is the only item with the shape to produce a 9: give each story a voice the way [A_74 §8](../ANALYSIS_74/ANALYSIS_74.md)'s engine gives each story a mechanism. The precedent is exact — `premise` earns 9s because one agent generates five candidates and commits the most distinctive; nothing equivalent exists for how a book sounds. **A per-story prose register, chosen and committed like a device, is the only proposal on this board that could make a 9 possible.**

**Honest caveat.** That is a hypothesis with one supporting precedent, not a measurement. §3 establishes the uniformity and that no texture statistic tracks the mark; it does NOT establish that varying texture would raise it. The cheapest test is not a build — it is to take the 86-scoring manuscript, have a strong model rewrite three chapters with an explicit voice, and get one cold read of the result. If a deliberate register does not move `prose`, then this category is a generation-model ceiling and A_72's Tier 4 reopens with its first real evidence.

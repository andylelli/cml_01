# ANALYSIS_104 — The scores did not drop. Two instruments are being read as one.

**2026-09-24. Cost: £0.** Asked: why the last two runs show a dramatic drop in scores. Measured over
every run report on disk and every external read since 1 September.

---

## §0 THE FINDING

**The internal shadow rubric has sat between 60 and 71 for two weeks. The two runs in question scored
65 and 70; 70 is the second-highest of the last sixteen.** There is no drop in that instrument.
**MEASURED** (`apps/worker/logs/run_*.json`).

| run started | status | shadow rubric |
|---|---|---|
| 09-15 18:38 | complete | 69 |
| 09-16 19:08 | complete | 66 |
| 09-18 16:50 | complete | 60 |
| 09-18 17:10 | complete | 66 |
| 09-18 17:31 | complete | 71 |
| 09-18 17:32 | complete | 66 |
| 09-19 19:39 | complete | 65 |
| 09-22 17:57 | complete | 67 |
| 09-23 18:14 | complete | 64 |
| **09-23 21:56 (seed 61062)** | complete | **65** |
| **09-24 07:48 (seed 6325)** | complete | **70** |

The numbers that look like a drop are the external reads — 80, 84, 80, 82 in September — set beside
these. **They are different instruments with a standing offset.** Pairing each September read with
the shadow rubric of the run that produced the book:

| book | external read | shadow rubric of the same run |
|---|---|---|
| 09-01 22:41 | 82 | 69 |
| 09-02 18:46 | 84 | 77 |
| 09-04 20:35 | 82 | 67 |
| 09-11 21:12 | 79 | 72 |
| 09-22 18:57 | 84 | 67 |
| 09-22 19:00 | 80 | 67 |

**Books that read 79–84 scored 67–77 on the shadow rubric.** 65 and 70 are inside that band. If the two
recent books had been read, the offset alone predicts high 70s to low 80s. **MEASURED**, six pairs.

This is also [[rubric-cannot-rank-two-books]] from the other side: the shadow rubric never ranked the
read books either — the 84 and the 80 of 22 September share a rubric of 67.

---

## §1 WHAT DID GET WORSE, AND IS MEASURED

Neither recent book could be read, and that is not the rubric's doing.

| | seed 61062 | seed 6325 | the read books |
|---|---|---|---|
| repetition, 6-word spans per 10k | 75.2 (4.3× median) | **151.7 (8.8× median)** | median 17.3 |
| fallback chapters | 0 | 1 (chapter 2) | — |
| Agent 6 blind-reader gate | skipped, content filter | skipped, content filter | — |
| rubric cap | clues ≤ 6 (dual flat values) | none | — |

**The repetition has one cause and it is ours.** On seed 6325 the phrase *"at half past seven at night"*
appears ten times across six chapters. **All 18 Agent 9 prose prompts carry it**, under *"only the
exact phrase above is acceptable."* Ten verbatim occurrences are the locked-fact machinery doing what
it was told, in every chapter, whether or not the chapter's contract touches the fact. **MEASURED**
(`logs/llm-prompts-full.jsonl`, 18 of 18). That is 8.8× the median on its own, it is book-wide, and
no single-chapter resume clears it.

The fix belongs to locked-fact enforcement, not to prose: state the locked value verbatim in the
chapters whose contract references it, and accept a paraphrase of a clock time elsewhere. Its gate,
`parseClockTime`, has a closed vocabulary ([[x38-blind-because-parser-could-not-read-its-own-clock]]),
so the paraphrase has to be one it can read. **Designed, not built.**

---

## §2 WHAT THIS DOES NOT CLAIM

- **That the two recent books read as well as September's.** Neither was read, and the shadow rubric
  cannot tell an 84 from an 80. Their reads are unknown, not low.
- **That the means-link changes cost nothing.** Seed 6325's case linked (A_102 §10) and its shadow
  rubric is the highest since 18 September; that is one run and settles nothing about the mark.
- **That the offset is fixed.** Six pairs put it between 7 and 17 points. Predicting a read from the
  rubric is a range, not a number.

---

## §3 WHAT TO DO

1. Stop reading the shadow rubric against external reads. Compare like with like: rubric to rubric,
   read to read.
2. Fix locked-fact enforcement so a clock time may be paraphrased outside the chapters that need it
   verbatim. That is what stands between the current books and a reader.
3. Then read one, and compare it to September's reads.

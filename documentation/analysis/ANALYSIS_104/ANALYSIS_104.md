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
so the paraphrase has to be one it can read. **Built — §4.** Verbatim once where a fact is evidence, a referent elsewhere, scoped by the validator's own `appearsInChapters`; the referents carry no numeral, so the parser never meets them.

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
2. ~~Fix locked-fact enforcement~~ Built (§4): a third of the repetition. What now stands between the
   current books and a reader is clue text copied verbatim from the chapter obligation block (§4.2).
3. Then read one, and compare it to September's reads.


---

## §4 THE LOCKED-ONCE BLOCK — BUILT, AND MEASURED AS A MATCHED PAIR ON THE 6325 BOOK

**2026-09-24, about £0.27** (`RESUME_REDO=prose`, `resume-1790249201029`, byte-identical upstream).

**What changed.** The locked-values block in the chapter prompt said *"every time this chapter
describes, mentions, or alludes to one … it MUST use the exact phrase."* It now says: state each
value in its exact phrase **once**, where the evidence is given, and use a referent after that. Facts
whose `appearsInChapters` — the same scoping the validator uses — fall outside the chapter are
rendered as **background**: a referent only, the reading belongs to the chapters where it is evidence.
The contradiction and direction blocks, which restated both values verbatim in every chapter, are built
from the evidence-here facts only. A fact with no scoping is evidence everywhere (the old behaviour
minus "every time"); the discriminating-test batch is where every value is evidence.

### §4.1 THE PAIR

| | original run | prose resumed with the block |
|---|---|---|
| repetition, 6-word spans per 10k | **151.7** (8.8× median) | **102.6** (5.9× median) |
| *"at half past seven at night"* | 10, across ch 1, 2, 3, 5, 8, 9 | 7, across ch 2, 3, 4, 5, 8 |
| chapter prompts carrying the background block | 0 of 18 | **16 of 19** |
| chapter prompts carrying the once-wording | 0 of 18 | 10 of 19 |
| fallback chapters | ch 2 | ch 1, ch 2 |
| shadow rubric | 70 | 64, capped |

**A third of the repetition gone; the phrase down from ten to seven; still WORTH A LOOK. MEASURED.**

### §4.2 WHERE THE SEVEN COME FROM, AND IT IS NOT THIS BLOCK

The scoping reached the prompts — sixteen of nineteen said background — and five of the seven
surviving occurrences sit in chapters whose prompt said background. The worst-span list names the
carrier: *"seven ten to seven forty five"* ×7 (an alibi window), *"and the threat posed by outsiders"*
×7, *"the importance of the pledge book"* — **clue descriptions and thematic lines embedded in the
chapter's obligation block, copied into prose verbatim.** Chapter 1's fallback says so in its own
words: *"a clue/test description was copied verbatim into the prose (13 consecutive words from
'Witnesses report hearing the pawnbroker's clock strike the hour twice …')"*. That clue carries the
clock phrase. An existing gate rejects the copy, three retries exhaust, and the chapter falls back —
a B1 loop with a fallback at the end of it.

So the locked-fact source is fixed and the remaining repetition has a different owner: **the clue
text shown to the writer**, which is copied ([[a67…]] — an illustrative phrase in a prompt is
reproduced verbatim) and then gated. The lever is what the chapter obligation block shows for a clue —
its on-page `observable`, never its analytic description with the clock time in it — and that is the
next item, not this one.

### §4.3 ALSO ON THE RECORD

The resumed book's rubric fell to 64 with a new cap, *"reveal uses evidence not planted earlier →
ending ≤ 5"*. One prose re-run against identical upstream moved the shadow rubric six points on
prose variance alone — [[rubric-cannot-rank-two-books]], measured again, free.


---

## §5 THE NOVELTY AUDIT SCORED THE CANDIDATE AGAINST ITSELF AND BLOCKED THE RUN

**2026-09-24.** Seed 18179's first launch (`mystery-1790250322380`) died four minutes in, before any
prose: *"Binding gate: Agent 8 novelty audit is blocking (status: warning)."*

The audit's own JSON said `status: "pass"`, nearest seed *The Clue of the Twisted Candle* at 0.58,
`violations: []`. Its `similarityScores` carried four rows: three real seeds at 0.58, 0.40, 0.38 — and
**a fourth titled *The Pendulum's False Toll at Blackwater Sanctuary* at 1.00, which is the generated
mystery's own title.** The model had scored the candidate against itself and then, sensibly, ignored
that row in its verdict. The code did not: it recomputes the maximum over the whole list, found 1.00
against a 0.90 threshold, set `fail`, shadow mode downgraded it to `warning`, and the binding gate
blocked on the warning. **MEASURED**, from the response record and `agent8-novelty.ts`.

**Fix:** rows titled as the generated mystery, or naming no supplied seed when seed titles are known,
are dropped before the maximum, and each dropped title is written into the audit's warnings. The
filter is a pure exported helper, `dropSelfAndUnknownSeeds`, pinned by four tests including the
exact four rows above. Cost of the lost launch: Agents 1–3b, the skeleton judge and one audit — no
prose, so roughly a tenth of a book.

Two smaller things from the same log. Agent 3's first attempt was truncated at the completion limit
(*"no closing brace"*) and the retry succeeded; seed 61062 also needed two attempts, seed 6325 one,
so this is not new with the longer block, but it is a cost worth watching. And the prompt recorder
could not open `documentation/prompts/actual/README.md` for one second at 12:49 — two writers in the
same second; the file was writable a minute later.

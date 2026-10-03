# WP-006 — DECIDE, ESTIMATE, ALLOCATE

**How logic, statistics and mathematics improve the functions this system already has, which new
functions they justify, and which job each theory is the wrong tool for.**
2026-10-03 · figures MEASURED on the live tree at `57697b5d` unless labelled otherwise · prior art:
A_109 (formal methods, built behind `AGENT3_CASE_LOGIC`), A_110 Part III (M1–M10, probes uncommitted at
the time of writing), WP-005 §4 (apportionment), WP-003 (Chao1), A_101 §4 (register on v2), A_90
(alibi plan), PLAN-TO-90 §11.3 (the reader's error bar) · probes in
[`WP-006-probes/`](WP-006-probes/) · **no code is changed by this paper**

---

## ABSTRACT

This project already owns more formal machinery than it uses. A_109 built a temporal network solver,
an argumentation fixpoint and a reader model. WP-005 specified an apportionment rule for the beat
budget. A_110 Part III ran a contract linter, a sequential test and a keyness ranking over one book.
What is missing is a rule for **which theory a function should be built from**, and a measurement of
what happens when the wrong one is used. This paper supplies both from the archive: 78 scored reads,
72 stored cases, 233 manuscripts, 165 canon texts.

**The claim.**

> **Every function here that settles something does one of three jobs. It DECIDES a fact about one
> case. It ESTIMATES a property of our books in general. Or it ALLOCATES a fixed amount over chapters,
> people or tokens. Logic does the first exactly, statistics the second, mathematics the third — and
> each fails, measurably, when lent to another job. A logical verdict cannot rank two books. A
> statistic cannot judge one book, and holds only inside the regime it was fitted in. An allocation
> rule cannot say what the amount should be. The functions to improve are those doing a job by hand —
> a word list, a rotation, a point estimate — where the exact form exists. The functions to create are
> those that keep each theory inside its job.**

**Why this is the right rule for this system, in five measured facts.**

1. **Logic decides, and where it constructs it is perfect.** The culprit's alibi is planned by interval
   arithmetic (`alibi-plan.ts`). In **25 of 25** checkable archived cases it covers the staged time of
   death and excludes the real one. The innocents' alibis are not planned. The timetable leaves exactly
   one suspect in **8 of 25**, and the project's own solver finds every innocent covered in **4 of
   25** (§2.1, §2.2).
2. **Logic does not rank.** Cases whose timeline the solver finds *inconsistent* read **3.9 marks
   higher** than consistent ones (83.6 against 79.7, SE 1.4, n = 5 and 29) (§2.6). A case-logic verdict
   is a fact about the case. It is not evidence about the book.
3. **A statistic holds only in its regime.** The standing rule says machine-register rate correlates
   −0.697 with the headline. On all 66 full-length reads it is **−0.45 [−0.63, −0.24]**. The slope was
   −1.26 marks per percentage point of rate before 1 September and is **−0.07 ± 0.18** in the 27
   reads since (§3.2).
4. **A rule taken from one book fails as a classifier.** "Never read a book whose SHIP-CHECK says WORTH
   A LOOK" came from run 31372. Across 66 reads the flag fires on 13, flagged books read **0.8 marks
   lower (SE 1.7)**, and the rule would have withheld the book that read 87 (§3.3).
5. **The same quantity measured by the wrong form gives the opposite answer.** As a ratio (MTLD),
   **66 of our 66** books have a richer vocabulary than the median canon text. As a growth law, nine
   of our books in ten are below the canon's 10th percentile, and twelve of our books together use
   about three-quarters of the words one canon author uses across twelve of theirs (§4.1).

**What it buys.** A kit of sixteen functions (§5). Fourteen cost £0 and are settled on the archive.
Each names the existing function it replaces or extends and the counter that falsifies it.

**Falsifier for the whole claim.** Take the next ten defects that a read or the owner names. If fewer
than six are a violated invariant, an estimate outside its interval, or an infeasible allocation that
a kit function reports **from the artifacts, before the read**, the claim is false.

---

## 1. WHAT THE FUNCTIONS ARE TODAY

### 1.1 Method

Three read-only inventory agents each swept one job across `packages/`, `apps/` and `scripts/`, under
the A_103 probe rule: a search that returns nothing is a claim about the search until it finds a known
positive. Their tables were then checked where this paper leans on them, by reading the line or
running `dist`. Ten probes produced the tables below; they write nothing to the repo.

### 1.2 The inventory — MEASURED

| job | functions found | how they decide today | what is missing |
|---|---|---|---|
| **estimate** (a statistic, score, rate, threshold, ranking) | 63 | fixed thresholds and fixed calibration constants | an interval on any shipped number; a correction where many are screened; a check that a constant still holds |
| **decide** (a logical property of case, outline or manuscript) | 64 | regex and word lists; set and interval arithmetic; three real solvers | the solvers are not live; "could not read" is "pass" in 20 checks; no clue's necessity is ever tested |
| **allocate** (budget, place, select, measure distance) | 58 | rounding, rotation, greedy first-fit; 13 hand-set weighted sums that pick a winner | a total that survives rounding; feasibility checked before placement; weights on the scale they are applied at |

Four facts from the inventories shape the rest of the paper.

- **Of the 63 statistical functions, three decide anything in a live run**: the v2 draft selector
  (`selector.ts:403`), the editor's guards (`edits.ts:151`), and the release gate (`gate.ts:38`). The
  rest end in a warning line, a report or a shadow log. Improving a function that nothing consumes
  changes no book.
- **Error bars exist in three scripts and in no shipped code**: `read-matched-pair.mjs` (paired t and
  a minimum detectable effect), `corpus-cells.mjs` (Chao1 with an interval), and the A_110 probes.
  `prose-feature-sweep.mjs` tests 32 correlations against an uncorrected threshold (§3.4).
- **Three solvers exist and none can stop a run**: `solveStn` (Floyd–Warshall, `stn.ts:32`),
  `groundedExtension` (`proof.ts:42`), and `checkUniqueness` in `@cml/cml-core`, which says of itself
  that it is not wired in (`cml-core/src/index.ts:10`).
- **The v1 prose engine is deleted**, and its validators — suspect closure, character lifecycle,
  narrative continuity, the prose timeline check — are still exported and have no caller. Several
  rules this project paid for now exist only as dead code.

### 1.3 What is already designed or built

| source | what it contributes | state |
|---|---|---|
| A_109 M1–M3 | temporal network, reader posterior, proof core | built in `packages/cml/src/case-logic/`; flag OFF; telemetry |
| A_109 M4, M5 | route graph; MinHash near-duplicates | specified; neither is in the tree (WF-003) |
| `@cml/cml-core` | uniqueness, deducibility and solvability over a typed case | built; scripts only; real cases report "not machine-checkable" |
| WP-005 §4 | Webster apportionment, Bresenham placement, minimum-load rotation | designed; humour and depth hand-wired |
| A_110 M1–M2 | nine contract invariants over 64 projects; carrier choice as an assignment | probe run; not built |
| A_110 M3–M5 | sequential test; noise on identical upstream; the page list as a claim | probe run |
| A_110 M6 | the selector standardised between drafts | measured on 20 selections; not built |
| A_110 M7–M8 | compression ratio and opener entropy with canon floors; keyness on one book | probe run |
| WP-003 | Chao1 on corpus cells | built (`corpus-cells.mjs`) |

This paper does not restate those. It measures across the whole archive what they measured on one
book, tests their verdicts against the reads, and adds the functions they do not contain.

---

## 2. LOGIC — DECIDE

Logic answers a question about one case with yes, no, or *cannot tell*. Its use here is to
**construct** a fact before a model writes it, and to **lint** artifacts for contradictions. It is not
a quality score, and §2.6 shows what happens when it is read as one.

### 2.1 Construction beats checking — MEASURED

`planCulpritAlibiSpan` (`alibi-plan.ts:154`) builds the culprit's alibi window from the two times of
death, and `repairActualCovered` trims one that covers the real time. Nothing comparable exists for
the innocents: their windows are whatever Agent 3 wrote, and only a report-only function compares them
with the time of death.

| over the 25 stored cases that carry `alibi_span` and two readable death times | |
|---|---|
| culprit's window covers the staged time and excludes the real one | **25 of 25** |
| innocent suspects whose window covers the real time | 39 of 71 |
| innocent suspects with no alibi at the real time | 31 of 71 |
| **idle alibis** — a window covering neither time, which clears nobody under either theory | **14 of 71** |
| cases with an innocent whose window is identical to the culprit's | 4 |
| **cases where the timetable leaves exactly one suspect, the culprit** | **8 of 25** |
| cases by number of innocents left open | none 8 · one 8 · two 3 · three 3 · four 2 · unreadable 1 |

Source: `timetable-uniqueness.mjs`, using the project's `parseClockTime` and `dialWindowContains`.

The left half of the deception is built and holds every time. The right half is authored and holds a
third of the time. That is the general result: **a fact the code constructs is right; a fact the model
authors and the code checks is right as often as the model is.** The four identical-window cases are
the sharpest form. Any argument from the timetable that convicts the culprit convicts the twin.

An innocent need not be cleared by the clock. Access, capacity and testimony also clear people. But
then the case must say which, in a form that can be checked, and today it does not (§2.3).

### 2.2 The project's own solver, run over the archive — MEASURED

`AGENT3_CASE_LOGIC` has been registered "PROBE NEXT RUN" since 2026-09-25. Its functions are pure, so
the archive answers the question at £0 (`case-logic-archive.mjs`, 72 projects, none failed).

| check | result |
|---|---|
| true time statements jointly consistent (`solveStn`) | 64 consistent · **8 contradictory** |
| the act has a window bounded on both sides | **25 of 72** |
| innocents' alibi against the act (151 people) | covers 17 · partial 16 · none 20 · **unknown 98** |
| of the 25 bounded cases: every innocent covered | **4** |
| culprit proven (`groundedExtension`) | 69 of 69 |
| every innocent cleared | 69 of 69 |
| a culprit cleared by some clue or clearance scene | 31 of 69 |

Three readings.

**The solver is starved, not wrong.** Two-thirds of innocent alibis come back `unknown`, and two-thirds
of cases have no bounded act. The cause is representation. The schema holds `alibi_window` as a string;
the structured `alibi_span` and the two times of death are not schema paths at all (`validator.ts:92`
never checks them). `temporal-closure.ts` recorded the same thing a month ago: *there is no canonical
field for the window in which the culprit could act*. A solver decides only what is written in a form
it can read.

**Declared is not entailed.** The proof module says every innocent is cleared in 69 of 69 cases. The
arithmetic says every innocent is covered in 4 of 25. Both are correct. `groundedExtension` is sound
*relative to its attack relation*, and the attack relation is read from the wording of each clue by
regex (`model.ts:137`). So the proof certifies that the case **says** each innocent is cleared. It does
not certify that the stated facts **make** it so. A reader checks the second.

**"A culprit cleared" in 31 of 69 needs a human before anyone acts on it.** A culprit's false alibi is
meant to clear them until the test breaks it. Whether these 31 are that design or a contradiction was
not determined here.

### 2.3 Unknown is a third answer — MEASURED

Twenty checks map "could not read the input" to "nothing wrong" (logic inventory, answer 6). Five
that sit on a live path:

| check | what happens on unreadable input |
|---|---|
| `checkTimelineDeception` (`timeline-deception.ts:424`) | either death time unparseable → no violations |
| `applyGate`, the release gate (`gate.ts:76`, `:106`) | no culprits listed → no stop; a decisive clue with under three key terms → skipped |
| `checkHardGates` (`selector.ts:257`) | a clue with under four terms → `clue_early` not checked |
| `findLockedFactClueTimeConflicts` (`clue-time.ts:233`) | unparseable fact or clue → skipped |
| geometry `time_anchors_absent` (`accept.ts:1017`) | fewer than two anchors parse → **met** |

The codebase already contains the right form twice: `TemporalClosureVerdict` is
`closes | does-not-close | not-determinable`, and case-logic `Coverage` is
`covers | partial | none | unknown`. Kleene's strong three-valued logic is the rule for combining
them: `pass AND unknown = unknown`, `fail AND unknown = fail`. A gate built that way cannot report
"ship" on a book it could not read. This project has paid for the two-valued version at least three
times: the X38 time gate that was blind because its parser could not read its own clock, the novelty
audit that could not fail, and the v2 run that stopped clean with no chapters.

### 2.4 Every check needs a witness — MEASURED

A check that cannot fire is indistinguishable from a system with no defects. Four were found by
reading the conditions on the path to the check.

| check | why it cannot fire |
|---|---|
| "a passage the book has already used" (`findings.ts:346–356`) | `repetitionDensity` returns six-word spans; the next line skips any span under `MIN_QUOTE_WORDS = 8`. Confirmed on `dist`: all five worst spans are six words |
| the am/pm conflict branch (`clue-time.ts:192`) | its predicate returns `false` unless `AGENT5_MERIDIEM_CHECK` is set |
| the second branch of `decisiveClueIds` (`contract.ts:240`) | reads `fair_play.inference_path`, which is not a schema path — INFERRED from the schema, not run |
| the anti-copy gate | `.env.local:361` sets `PROSE_ANTI_COPY_GATE=true`, with a comment that A_79 §5 requires it. `detectCopiedProse` has **no caller** in `apps/worker` or `packages/prose-engine` since v1 was deleted, and the selector's `copiedSpans` is the constant `0` (`selector.ts:153`) |

The last row matters beyond this paper. WP-003 and WP-004 rest the whole "inspiration without copying"
design on that gate as the guarantee, and today it does not run.

The requirement is one of logic: a check `C` is live only if some input satisfies every guard on the
path to it. The cheap proof is a **witness** — a fixture on which it fires, kept in the test suite.
CLAUDE.md's rule for probes ("a negative result is a claim about the probe") applies to every
permanent check as well.

### 2.5 Order rules are one function, not twelve

The system holds its ordering rules in at least four places, each hand-coded: the beat scheduler's
`checkOrdered` (`invariants.ts:79`, which includes *no clearance after the reveal*), the Agent 7
stamps, the release gate, and A_110's nine contract invariants. The deleted v1 validators held more.
All have one shape: a property of a **finite sequence of chapters**.

That shape has a standard form, linear temporal logic on finite traces. Each chapter is a state with
a few true-or-false facts (`body_found`, `clears(X)`, `names_culprit`, `wit_beat`, `on_page(X)`), and
each rule is a formula with four operators: *always*, *eventually*, *until*, *next*.

| rule on file | as a formula over chapters |
|---|---|
| no clearance after the arrest (A_96) | always (arrest → always-after ¬clears) |
| a clue is planted before it is used | (¬uses(c)) until plants(c) |
| the culprit is on the reveal's page (A_110: violated in 55% of books) | always (reveal → on_page(culprit)) |
| the victim is alive, then dead, then found — one step per chapter (A_110 P3) | a three-state automaton |
| nobody cleared is the victim (A_110: 88% of books) | always ¬clears(victim) |
| no wit beat at the body, the test or the reveal | always (wit → ¬(body ∨ test ∨ reveal)) |

One evaluator of about a hundred lines, with the rules as **data**, runs unchanged over the outline,
the v2 contract and the finished manuscript. A new rule is a row. A_110's linter is the proof that
the rules pay: nine hand-written invariants found defects in up to 88% of 64 stored books.

### 2.6 Logic does not rank books — MEASURED

If case-logic verdicts measured quality they would track the reads. Thirty-four stored cases match a
read by title (`case-logic-vs-reads.mjs`, `timetable-vs-reads.mjs`).

| split | n | headline | clues | plot |
|---|---|---|---|---|
| timeline consistent | 29 | 79.7 | 6.8 | 7.4 |
| timeline **inconsistent** | 5 | **83.6** | **7.6** | 7.8 |
| act window bounded | 13 | 80.9 | 7.2 | 7.5 |
| act window not bounded | 21 | 79.8 | 6.7 | 7.4 |
| bounded, every innocent covered | 2 | 79.5 | 6.0 | 7.5 |
| bounded, some innocent open | 11 | 81.2 | 7.4 | 7.5 |

The difference between consistent and inconsistent is −3.9 marks (SE 1.4), in the wrong direction. The
book that read 87 has three innocents with no alibi at the real time. **INFERRED:** a case with many
time statements is both richer to read and more likely to contain two that conflict, so the solver's
"inconsistent" marks ambition as well as error. Five cases cannot separate those.

The consequence is a rule of use. A logic function may **construct** (§2.1), **lint to zero** (§2.5)
and **report unknown** (§2.3). It must not gate on a verdict that has not been shown to matter to a
reader, and it must never be read as a predictor of the mark. A_109 made case logic telemetry "never a
gate". This table is the measurement behind that decision.

---

## 3. STATISTICS — ESTIMATE

A statistic describes many books. Four things must travel with it: its **interval**, its **null** (what
chance alone produces), its **regime** (the population it was fitted on), and its **unit**. Each
subsection below is a number this project steers by, with one of the four missing.

### 3.1 The reader is the instrument, and it has one dial — MEASURED

`ledger-and-lexicon.mjs` and `structure-vocab-classify.mjs`, on a live walk of the story folders: 79
read files, 78 scored, **66 of at least 8,000 words**, 65 with all ten category marks.

| property | value |
|---|---|
| headline, all 66 | mean 78.3, SD 6.6, range 52–88 |
| headline, last 20 | mean 81.0, SD 4.6, range 69–88 |
| headline from the category sum | `16.5 + 0.851 × sum`, r = 0.91, residual SD 2.4 |
| the same, for sums of 74 and over (n = 34) | `25.9 + 0.728 × sum`, residual SD 1.5 |
| category sum needed for a headline of 90 | **86.4 to 87.9** |
| best category sum in any one book | 84 (the 88) |
| best-ever mark in each category, summed | 87 |
| mean correlation between two categories | 0.52 (0.67 in the last 20) |
| variance carried by the first principal component | **57%**, loadings 0.27–0.35 on all ten |
| categories at 9 or more, of 65 | premise 16 · atmosphere 12 · ending 3 · plot 2 · clues 2 · hook 1 · character 1 · dialogue 0 · pacing 0 · prose 0 |

Three consequences.

**The ten categories are mostly one number.** A single factor with near-equal loadings carries 57% of
the variance. After a book's own mean is removed, a category's SD falls to between 0.39 (premise,
pacing) and 0.83 (clues) — less than the one-mark step the reader writes in. So "bundle levers that
touch different chapters so one read scores several by category" asks the read for a resolution it
barely has. A lever's category should be scored as its **deviation from the book's mean mark**, not
as the raw mark, or a good book will credit every lever in it.

**"Best-ever in each category" is an order statistic.** The sum of the ten maxima (87) is three above
the best any book achieved (84). Each maximum is taken over 65 draws, so it carries each category's
luckiest noise. It is not a book the system has shown it can write. Planning should use the best
single-book sum.

**The reader's error has two figures on file and one measurement.** PLAN-TO-90 §11.3 measured ±1 from
one pair of near-identical manuscripts (84 and 85, nine of ten categories equal). CLAUDE.md works to
±3. The `externalEarlierReads` in the ledger are not re-reads of one book (A_101 §10). Every power
calculation in §3.6 scales with the square of this number, so the gap between the two figures is a
factor of nine in runs.

### 3.2 An instrument has a regime — MEASURED

Machine-register rate is "the only validated instrument". The figure on file differs by where one
reads it: −0.697 (CLAUDE.md, 36 reads, headline), −0.421 (`machine-register.ts:89`, 40 reads, prose
mark), 0.502 (`selector.ts:104`, 49 reads). Recomputed today on every full-length read:

| reads | n | r with headline | slope, marks per 0.01 of rate | SD of rate | SD of headline |
|---|---|---|---|---|---|
| all | 66 | **−0.45** [−0.63, −0.24] | −0.62 ± 0.15 | 0.048 | 6.6 |
| before 1 September | 39 | −0.57 [−0.75, −0.31] | **−1.26 ± 0.30** | 0.033 | 7.4 |
| from 1 September | 27 | −0.08 [−0.45, +0.31] | **−0.07 ± 0.18** | 0.048 | 4.2 |
| from 22 September (v2) | 11 | 0.00 | 0.00 ± 0.93 | 0.020 | 5.5 |

Against the prose mark it is −0.32 (n = 65). The earliest 36 full-length reads give −0.58 on this
extraction, so the standing −0.697 was not reproduced exactly. **INFERRED:** a different subset or
text extraction; the direction and rough size agree.

The slope is the figure to watch, because a correlation also falls when the range of marks narrows.
Here the range of the *rate* widened and the slope still went to zero. The two slopes differ by 1.18
with a standard error of 0.35. A_101 §4 saw this for v2 and called it Goodhart's law: the rate was
driven from 0.129 to 0.024 by levers aimed at it, and stopped carrying information about the mark.
This table adds that the relation was already gone across the 27 reads from 1 September, sixteen of
which predate the v2 engine.

What the system does about it today is good and partial. `REGISTER_FLOOR` (`selector.ts:118`) stops
the selector rewarding rates below any read book's. But the calibration constants are fixed at 49
reads from 18 September, the −3 weight stands, and nothing recomputes the relation when a read
arrives. A_110 M6 showed the weights do not mean what they say for a second reason, the scale. The
function that is missing is small: on every ledger update, recompute each instrument's slope in the
most recent 25 reads with its interval, and print the row. An instrument whose interval contains zero
loses its weight until it earns it back.

### 3.3 A rule is a classifier — MEASURED

CLAUDE.md forbids reading a book whose SHIP-CHECK says WORTH A LOOK. The flag is repetition density at
three or more times a median of 17.3 measured on 212 older manuscripts (`repetition-density.ts:38`).
Over the 66 full-length reads (`ship-check-base-rate.mjs`):

| repetition, as a multiple of the median | n | headline mean | range | prose mean |
|---|---|---|---|---|
| under 1× | 36 | 79.8 | 68–88 | 6.4 |
| 1× to 3× | 17 | 75.6 | 52–86 | 5.9 |
| 3× to 10× (flagged) | 9 | 76.6 | 69–83 | 6.0 |
| 10× and over (flagged) | 4 | 80.3 | 76–87 | 6.5 |

Flagged books (13 of 66) average 77.7 and unflagged 78.5, a difference of 0.8 with a standard error of
1.7. The correlation of repetition density with the headline is 0.01. Of the nine reads at 85 or
above, one is flagged — the 87, at 12.8×, whose worst span is its own locked clock time.

The rule was written from one book that lost seven marks. As a classifier over the ledger it does not
separate. That does not show the 29.8× book was read correctly. It shows the *threshold* carries no
information about the mark, so the rule spends reads without buying anything. The general function:
**before a rule enters CLAUDE.md, run it over the ledger and print base rate, mean difference and
standard error.** A rule that cannot be run over the ledger is a hypothesis and should be labelled as
one.

### 3.4 A screen has a null — MEASURED by simulation

`prose-feature-sweep.mjs` tests 16 features against 2 outcomes and calls a correlation significant
above `1.96 / √(n − 1)`. That threshold is right for one test. The largest of many is an extreme
value, and its null distribution is far wider.

| instruments screened at once | 95th percentile of the largest \|r\| under pure noise, n = 36 | n = 66 |
|---|---|---|
| 1 | 0.32 | 0.25 |
| 5 | 0.42 | 0.32 |
| 10 | 0.45 | 0.34 |
| 20 | 0.49 | 0.37 |
| 40 | 0.52 | 0.39 |

At 32 tests and a 5% threshold, 1.6 false discoveries are expected and at least one arrives four times
in five. Register at −0.57 over 39 reads clears even the 40-instrument bar, so it was real in its
regime. A new instrument found by a sweep at 0.35 is not. The fix is one line in each sweep: print the
simulated bar for the number of things tested, or apply Benjamini–Hochberg.

### 3.5 An extreme is an order statistic — MEASURED

Three rules of thumb in this project are statements about a maximum, and a maximum grows with the
number of draws.

**Per-chapter thresholds.** Pooled over 652 chapters of 66 books, the 90th percentile of chapter
register rate is 0.189. A book has about ten chapters, so **31 of 66 books (47%)** have at least one
chapter above it, and 18 of 66 above the 95th percentile. A per-chapter threshold set at a per-chapter
quantile fires on half of all books. That is the mechanism behind CLAUDE.md's B1, *a check that fires
on most runs is an off switch*. The correct threshold comes from the distribution of the **book's
worst chapter**. For a 5% false-fire rate over ten independent chapters the per-chapter quantile is
0.995, not 0.95; chapters within a book are correlated (intraclass correlation about 0.4 here), which is
why the observed 47% is under the 65% independence predicts. (The intraclass figure is approximate:
it uses the median within-book SD.)

**The chance of a 90.** On the last 20 reads (mean 81.0, SD 4.6) a read of 90 or more has probability
**3.2%**: one in thirty-one. A 90 from that distribution would be its upper tail. A book whose reads
centre on 90 needs the mean to move by nine, and the plan should be scored on the mean of the last ten
reads, with its interval, rather than on the record.

**Screening by the best draft.** The v2 selector takes the best of three drafts on a composite. The
expected best of three is 0.85 SD above the mean of one. A selected draft's instrument values are
therefore biased upward by construction. **INFERRED:** comparing a selected draft with an unselected
v1 book (PLAN-TO-90 §30.2) credits the engine with some of what the selection did.

### 3.6 Power — one formula, and what "250 pairs" means

For a matched pair, pairs needed at 80% power and 5% two-sided are `n = 15.7 × (σ / δ)²`, where `σ`
is the noise of one arm and `δ` the effect. A_110 M4 reached the same constant ("one SD needs 16
pairs"). CLAUDE.md's "250+ pairs" is this formula at an effect of a quarter of one SD.

| effect to detect, in marks | pairs if σ = 1 | σ = 2 | σ = 3 |
|---|---|---|---|
| 5 | 1 | 3 | 6 |
| 3 | 2 | 7 | 16 |
| 2 | 4 | 16 | 36 |
| 1 | 16 | 63 | 142 |

`σ` here is read noise **and** the writer's own variation between two draws of identical upstream.
Neither is measured in marks. A_110 M4 measured the second for six instruments, and found one pair
resolves only changes of roughly three SDs. The two missing measurements are cheap, and until they
exist no read of a matched pair has a known error bar:

- **σ of the reader**: three fresh reads each of three unchanged manuscripts. Nine reads, no runs.
- **σ of the draw**: one `RESUME_REDO=prose` on each of three books with **no lever flipped** — an
  A/A pair — and one read of each arm. About £1.35.

For a yes-or-no behaviour of the writer, a fixed sample is the wrong design. A_110 M3's sequential
rule (accept at five straight successes, reject at three straight failures) answers in six to eight
drafts on average.

### 3.7 The axis rule buys coverage, not marks — MEASURED

"Choose the next seed by axis until every axis has three reads." Of 34 reads that match a stored case:
temporal 22 (mean 80.7), authority 5 (79.0), identity 4 (78.5), spatial 2 (82.0), behavioural 1 (79.0).
The within-axis SD is 4.9 and the estimated between-axis variance is **zero** (`axis-shrinkage.mjs`).
With partial pooling every axis shrinks to the grand mean. The rule is still right as a coverage rule,
but no axis can be called strong or weak on this evidence, and the spatial "82.0" is two books.

---

## 4. MATHEMATICS — ALLOCATE, AND MEASURE GROWTH AND DISTANCE

### 4.1 A lexicon is a growth law, not a ratio — MEASURED

The owner's fifth need is "a broader lexicon, as there is often repetition" (A_110 §6). The obvious
instrument is a type–token measure. On 66 of our books and 163 canon texts, each on an 8,000-token
window:

| measure | ours, median | canon, median | reading |
|---|---|---|---|
| MTLD (length-corrected type–token) | **149.0** | 99.5 | all 66 of ours above the canon median |
| moving-average TTR, 500 tokens | **0.570** | 0.511 | all 66 of ours above the canon median |
| share of words outside the canon's 2,000 commonest | **24.5%** | 15.2% | ours uses *more* uncommon words |
| distinct words in 8,000 tokens | 1,670 | **1,806** | 59 of ours below the canon median; 13 below its 10th percentile |
| words used exactly once, per token | 0.104 | **0.133** | |
| Heaps exponent β (distinct words ∝ tokens^β) | 0.585 | **0.688** | our 90th percentile (0.625) is under the canon's 10th (0.636) |

MTLD correlates **0.00** with the prose mark (n = 65). So the ratio family says we are richer than the
canon and predicts nothing. The growth law says the opposite, and separates the two populations almost
completely.

Both are true, and together they describe the prose exactly. Within any 500 words our text avoids
repeating itself and reaches for ornate words — *gaze, lingered, scent, hush*. Over 8,000 words it
keeps returning to the same ornate words. By the fitted law, 8,000 words into a canon text the next
thousand bring about 155 new words; in ours they bring about 122. The reader's word for this is
"repetition"; the form that sees it is the rate at which new words *stop arriving*.

Across books the same law holds harder (`unique-case-sameness.mjs`, one manuscript per distinct cast):

| twelve books × 8,000 tokens | distinct words | ours as a share |
|---|---|---|
| Edgar Wallace | 8,500 | 0.72 |
| William Le Queux (11) | 7,793 | 0.76 |
| R. Austin Freeman (9) | 7,451 | 0.72 |
| Carolyn Wells (9) | 7,162 | 0.75 |
| Arthur Conan Doyle (7) | 6,640 | 0.72 |
| J. S. Fletcher | 6,557 | 0.94 |
| E. Phillips Oppenheim (7) | 6,222 | 0.77 |
| **ours** (same k each time) | 6,117 at k = 12 | |

Seven canon authors, seven comparisons, ours lower each time. Wallace was known for dictating a novel
in days, and twelve of his use 39% more words than twelve of ours.

### 4.2 Sameness is a distance between books — MEASURED

A_110 M8 ranked one book's phrases by Dunning's log-likelihood against the canon. Run **across** books
it answers a different question: which formulas belong to the system rather than to any one case.

**House-phrase load** is the share of a set's four-word sequences that occur in at least a third of
its books at twenty or more times the reference rate.

| set | load per 10,000 | distinct phrases |
|---|---|---|
| Le Queux, 11 books | 1.6 | 4 |
| Wallace, 12 drawn from 20 | 1.3–3.1 | 3–7 |
| Fletcher, 12 | 7.6 | 15 |
| Wells, 9 | 12.2 | 27 |
| Freeman, 9 | 16.2 | 37 |
| **ours, 12 newest distinct casts (v2)** | **136.9** | **195** |
| ours, counting only phrases at 200× | 94.4 | 133 |
| ours, counting only phrases the canon never uses | 52.6 | 85 |

Our reference is 1890–1935 prose, so a modern idiom counts against us whoever wrote it. **INFERRED:**
that inflates the first figure by an unknown amount. The last row is the conservative one: 85 phrases,
each in at least four of twelve books and **absent from 12.4 million words of canon**, against 4 to 37
phrases of any kind for a canon author.

The phrases, over the twelve current-engine casts: *gaze fixed on the* (12 of 12 books), *hand resting
on the* (12), *hung in the air* (11), *moved to the window* (11), *gaze lingering on the* (11; canon:
zero). Over all 52 distinct casts: *broken only by the* in 46, *hung in the air* in 48.

**Whose words they are.** Of the top 100 by keyness over the 52 casts, **88 appear in no source file**.
They are the writer's own, which agrees with A_110's 67% on one book. Twelve are verbatim in our
source and four in `packages/prompts-llm`. The prompt's own example of a correctly formatted time,
*"ten minutes past eleven"* (`agent3b-hard-logic-devices.ts:534`, `:600`), appears **1,274 times in 84
manuscripts** against once in the canon. It appears zero times in the 30 manuscripts since 22
September, so that leak has stopped; the specimen is still in the prompt.

Two functions follow, neither needing a word list: the house-phrase load as a standing cross-book
instrument, and a **specimen audit** that takes every quoted example in a prompt and reports its rate
in our output against the canon's.

### 4.3 Allocation — what exists, and the form each should take

| amount | today | exact form | source |
|---|---|---|---|
| shares of a beat budget → integer counts | hand-wired per dimension | Webster apportionment | WP-005 §4.2 |
| counts → chapters | per-dimension | Bresenham spacing with offsets | WP-005 §4.3 |
| a beat → the person who carries it | `(chapter − 1) mod n`; 61% of wit beats name someone not on the page | bipartite assignment, solved exactly at 10 × 5 | A_110 M2 |
| evidence → chapters | greedy first-fit; one chapter carried 10 pieces, four carried none | minimise the largest load subject to plant-before-use | A_110 M9 |
| drafts → the one that ships | z-scores on book-level SDs; written weight 3 pulls 2.2, weight 1 pulls 0.1 | standardise on between-draft SD, or sum weighted ranks | A_110 M6 |
| innocents → reasons they are cleared | authored free text | a typed elimination table, solved (K2) | this paper, §2.1 |

The common defect is that the allocator cannot see whether its problem is **feasible**. A rotation
assigns a wit line to someone in custody because nothing asked who was present. Each exact form
begins by building the set of permitted pairings, and reports an empty row before it allocates
anything.

### 4.4 What the allocation inventory adds — MEASURED unless marked

Fifty-eight functions allocate, place, select or measure distance. Six findings bear on the kit.

**No apportionment function exists in code.** A search for Webster, Hamilton, Bresenham and
largest-remainder finds a surname in a name pool and nothing else. WP-005's forms are designed, not
built. What stands in their place is `Math.round` on a share (`actCounts`, `computeActSceneCounts`),
round-robin (`distributeClearances`) and even spacing (`assignTexture`).
`distributeChapterWordBudget` (`story-length-targets.ts:177`) rounds each chapter to 50 and clamps it,
so the chapter budgets do not sum to the book's target. Keeping the total while rounding is the one
property an apportionment rule exists to provide.

**Clues are placed by four greedy passes, and nothing live orders them by inference step.**
`applyDeterministicCluePreAssignment` (`clue-pacing.ts:57`) fills by act and by least-loaded scene.
Plant-before-reveal is enforced. That the evidence for step *k* reaches the reader before the
deduction at step *k + 1* is checked only in `@cml/cml-core`, which is offline. This is a precedence
graph, and "is there an order that respects it" is a topological sort. It belongs in K6 as one more
row.

**Thirteen hand-set weighted sums each pick a winner.** Among them: the novelty score
(0.30 / 0.25 / 0.15 / 0.25 / 0.05), which is a binding gate in seeded runs; the draft composite; the
clincher clue (+32, +8, +4, +3, +1, −6); the evidence remap (accept at 7). None has been fitted, and
none reports how close the runner-up was. A weight matters only if changing it changes the winner.
That is measurable on the archive for every one that is a pure function of stored artifacts (K16).

**Three similarity functions disagree about nothing.** Two empty sets have Jaccard similarity **1** in
`agent2b-voice-capsule.ts:231` and **0** in `agent2c-location-distinctness.ts:53`. The structural
novelty judge compares missing fields by string equality, so two absent labels match
(`compare.ts:37`). The similarity of two empty sets is undefined. The right return is *unknown* (K4),
and a paid defect already sits in this family: the novelty audit that scored the candidate against
itself at 1.00.

**The run-parameter generator shares one random stream, so a pin moves everything after it.**
`run-params.mjs:257` creates one `mulberry32(seed)`, and each field is `arg(...) ?? pick(...)` in
order (`:429–613`). A pinned field skips its draw, and every later field then takes a different value
from the same seed. **INFERRED from the code**; it was not run, because the script writes the
provenance files CLAUDE.md forbids overwriting. "Seed 123 with the axis pinned" is therefore not seed
123 with one thing changed. The repair is a stream per field, keyed on the seed and the field's name.

**Independent draws cover the parameter space slowly** (`pairwise-coverage.mjs`). Eight fields give
24,300 settings and **365 pairs of values**. Most interaction defects in software are triggered by one
or two factors together, and a seed is a test input to this pipeline.

| after | independent draws, pairs exercised | designed covering set |
|---|---|---|
| 12 runs | 57% | 74% |
| 30 runs | 84% | **100%** |
| every pair | median **125 runs**, 90th percentile 169 | 30 runs (lower bound 25) |

The coverage-aware chooser that already exists, `scheduleCell` (`cell-scheduler.ts:247`), walks only
axis × mechanism family, and runs in shadow.

One premise in the project's memory is stale. The 24,000-token prompt ceiling that deleted craft
blocks went with the v1 engine on 2026-10-01. The v2 bible has fixed per-section budgets and a prefix
rule: `toBudget` (`bible.ts:104`) stops at the first line that would overflow, never tries a shorter
later line, and drops whole sections in a fixed order with no measure of what a section is worth.

### 4.5 Corpus coverage has a stopping rule — MEASURED

`corpus-cells.mjs` already computes Chao1. On today's 56 fingerprinted works: 26 cells seen, 17 seen
once, 4 seen twice, Chao1 62. The companion estimate is Good–Turing: the probability that the **next**
encoded work lands in a cell not yet seen is singletons over works, **17 / 56 = 0.30**. That gives the
acquisition budget a stopping rule Chao1 does not: keep encoding while the figure stays above the
chosen floor; at 0.10, one new shape costs ten encodes.

---

## 5. THE KIT — WHAT TO BUILD, IN ORDER, WITH THE COUNTER FOR EACH

Ordered by cost, then by how much else depends on it. "Counter" is the number that falsifies the item.

| # | function | job | replaces or extends | cost | counter |
|---|---|---|---|---|---|
| **K1** | `instrument-validity`: on every ledger write, each instrument's slope against the headline in the last 25 reads, with interval; printed beside the constants it would replace | estimate | the fixed `CALIBRATION` (`selector.ts:93`); the figure in CLAUDE.md; SHIP-CHECK's median | £0 | the register row prints a slope whose interval contains 0 (it does today, §3.2); any instrument with such a row has weight 0 in the selector |
| **K2** | **elimination table**: every innocent carries `eliminated_by {kind: time \| access \| capacity \| witness, facts}`; `time` rows are *constructed* from the act window as the culprit's already is | decide | free-text `alibi_window` for innocents; `planAlibiBranches` extended | £0 build; one Agent 3 run to verify | on the next ten cases: no idle alibi, no window identical to the culprit's, `unknown` coverage under 10% (today 14 of 71, 4 cases, 65%) |
| **K3** | **schema paths for what logic reads**: `alibi_span`, `act_window`, the two times of death | decide | `validator.ts:92`, which never checks them | £0 | `analyseTimeline` bounds the act in every new case (today 25 of 72) |
| **K4** | **three-valued verdicts**: every check returns pass, fail or unknown; gates combine by Kleene's rule; the run report prints the unknown count | decide | the 20 checks of §2.3 | £0 | replay over the archive: the count of checks that returned unknown is non-zero and printed; no gate reports "ship" with an unknown decisive clue |
| **K5** | **witness registry**: CI fails if a check has no fixture on which it fires, or a flag set in `.env.local` has no call site | decide | nothing — it is absent | £0 | the four dead checks of §2.4 fail CI on the day it lands, the anti-copy gate among them |
| **K6** | **trace rules**: one evaluator, rules as data, run over outline, contract and manuscript | decide | `checkOrdered`, four stamp checks, A_110's linter | £0 | each rule at 0 violations over the 64 stored contracts; a new rule is one row and no code |
| **K7** | **rule-as-classifier**: a script that takes a predicate over a manuscript and prints base rate, mean difference and SE against the ledger | estimate | rules written from one book | £0 | the SHIP-CHECK rule prints 13 of 66 and 0.8 ± 1.7; the rule is reworded or withdrawn |
| **K8** | **screen bar**: every sweep prints the simulated 95% bar for the number of things it tested | estimate | `1.96 / √(n − 1)` in four scripts | £0 | `prose-feature-sweep` at n = 66, 32 tests, prints 0.38 |
| **K9** | **book-level thresholds**: any per-chapter cut-off is derived from the distribution of a book's worst chapter | estimate | per-chapter quantiles | £0 | the chosen cut-off fires on under 10% of the 66 read books |
| **K10** | **vocabulary growth**: Heaps β and distinct words per 8,000 tokens, with canon percentiles, in the run report | allocate / measure | nothing; do **not** add MTLD | £0 | the instrument separates ours from canon (it does: our p90 < canon p10); a lever is credited only if β rises on a matched pair by more than the A/A spread |
| **K11** | **house-phrase load** and **specimen audit**, run across the newest twelve distinct casts | measure | closed banned-phrase lists; `cross-book-templates.mjs` | £0 | load falls from 136.9; the audit lists every prompt example with an output rate above 20× the canon's |
| **K12** | **reader and draw noise**: nine re-reads, three A/A pairs | estimate | the two figures for ± on file | ~£1.35 and fifteen reads | one σ in marks, with an interval, replaces both ±1 and ±3; §3.6's table gains a single column |
| **K13** | **category deviations**: the ledger prints each category minus the book's mean mark | estimate | raw category marks in lever scoring | £0 | a lever's claimed category moves in deviation, not only in level |
| **K14** | **the selector on its own scale** (A_110 M6), then K1's weights | allocate | `scoreDraft` | £0 | the term deciding chosen-against-runner-up matches the written weights over the next 20 selections |
| **K15** | **seed design**: one random stream per field, keyed on seed and field name; a `--design pairwise` list of 30 settings for `scheduleCell` to walk. Behind a flag, so every existing seed still replays | allocate | the single stream at `run-params.mjs:257`; uniform independent draws | £0 | a seed with one field pinned differs from the unpinned file in that field only; all 365 pairs exercised in 30 runs (today a median of 125) |
| **K16** | **selection margin**: every weighted pick logs winner minus runner-up, and whether moving any one weight by 20% changes the winner | allocate | 13 hand-set weighted sums | £0 on replay | per selector, the share of archived picks that flip. A weight that never flips a pick is removed; one that flips often is fitted or replaced by an ordering rule |

K1, K4, K5, K7, K8 and K16 are instruments on our instruments. They change no book directly and they
stop the next wrong decision. K2, K3 and K6 change the case and the contract. K10 and K11 are the only
two that measure the page, and they are instruments only; the levers that move them are A_110's step 3.

---

## 6. WHAT NOT TO DO — WITH THE RECEIPT FOR EACH

| do not | receipt |
|---|---|
| gate a run on a case-logic verdict | inconsistent timelines read 3.9 higher (§2.6); 98 of 151 coverages are `unknown` (§2.2) |
| add MTLD, TTR or any ratio as the lexicon instrument | all 66 of ours beat the canon median and it correlates 0.00 with the prose mark (§4.1) |
| trust "every innocent is cleared: 69 of 69" | it certifies the wording of the clues, not the arithmetic (§2.2) |
| set a per-chapter threshold from the per-chapter distribution | fires on 47% of books (§3.5) |
| plan from "best-ever in each category" | 87 summed, 84 achieved (§3.1) |
| cite a correlation without its n, interval and date | one instrument, three figures on file, a fourth today (§3.2) |
| write a rule from one book into CLAUDE.md untested | the SHIP-CHECK rule: 0.8 ± 1.7 marks, and it withholds the 87 (§3.3) |
| ask the writer for a statistic this paper measures | VoiceSpec: 22.0 asked, 15.86 delivered, 0 of 10 chapters. β and load are for the report; the writer gets counted operations |
| fit a ranking model to the pairwise judge | the judge resolves ten marks, not five; an aggregator adds no resolution the comparisons lack |
| count a phrase across manuscripts without deduplicating cases | 233 manuscripts are 52 distinct casts; the first run of §4.2 reported a case's own clock time as a house phrase |
| read a pooled statistic across engines | the "ten minutes past eleven" leak is 1,274 uses overall and zero since 22 September (§4.2) |
| pin one run parameter and call the rest "the same seed" | one shared stream: a pin shifts every later draw (§4.4) |
| return 0 or 1 for a similarity that is undefined | two empty sets score 1 in one module and 0 in another (§4.4) |
| change the run-parameter stream in place | every archived `run-params-<seed>.yaml` would stop reproducing; K15 goes behind a flag, as `--fresh-names 0` does |

---

## 7. SOURCES, AND AN HONEST NOTE ON TRANSFER

**Logic.**
Dechter, Meiri and Pearl, "Temporal constraint networks", *Artificial Intelligence* 49 (1991) — the
simple temporal problem `solveStn` implements.
Allen, "Maintaining knowledge about temporal intervals", *Communications of the ACM* 26 (1983).
Kleene, *Introduction to Metamathematics* (1952) — the strong three-valued connectives of §2.3.
De Giacomo and Vardi, "Linear temporal logic and linear dynamic logic on finite traces", IJCAI 2013 —
the form of §2.5.
Dung, "On the acceptability of arguments…", *Artificial Intelligence* 77 (1995) — the grounded
extension in `proof.ts`.
Reiter, "A theory of diagnosis from first principles", *Artificial Intelligence* 32 (1987) — minimal
hitting sets.

**Statistics.**
Fisher's z-transformation for the intervals of §3.2; Efron, "Bootstrap methods", *Annals of
Statistics* 7 (1979).
Benjamini and Hochberg, "Controlling the false discovery rate", *JRSS B* 57 (1995).
Wald, "Sequential tests of statistical hypotheses", *Annals of Mathematical Statistics* 16 (1945).
Efron and Morris, "Stein's paradox in statistics", *Scientific American* 236 (1977) — the shrinkage of
§3.7.
Goodhart (1975), and Campbell, "Assessing the impact of planned social change" (1979) — a measure
that becomes a target.
Cohen, *Statistical Power Analysis for the Behavioral Sciences* (1988).
Thorndike, "A constant error in psychological ratings", *Journal of Applied Psychology* 4 (1920) —
the halo effect, one reading of the single factor in §3.1.

**Mathematics and quantitative linguistics.**
Heaps, *Information Retrieval* (1978), and Herdan (1960) — vocabulary growth.
Dunning, "Accurate methods for the statistics of surprise and coincidence", *Computational
Linguistics* 19 (1993).
McCarthy and Jarvis, "MTLD, vocd-D, and HD-D", *Behavior Research Methods* 42 (2010).
Covington and McFall, "Cutting the Gordian knot: the moving-average type–token ratio", *Journal of
Quantitative Linguistics* 17 (2010).
Good, "The population frequencies of species…", *Biometrika* 40 (1953); Chao, *Scandinavian Journal of
Statistics* 11 (1984).
Balinski and Young, *Fair Representation* (1982) — the apportionment of WP-005.
Kuhn, Wallace and Gallo, "Software fault interactions and implications for software testing", *IEEE
Transactions on Software Engineering* 30 (2004), and Cohen, Dalal, Fredman and Patton, "The AETG
system", *IEEE TSE* 23 (1997) — pairwise coverage, §4.4.
Law and Kelton, *Simulation Modeling and Analysis* — common random numbers, the stream-per-field rule
of K15.

**Transfer.** The logic transfers without loss: a mystery's timetable is a temporal network and its
ordering rules are properties of a finite trace. The statistics transfer with one warning. The
"reader" is a language model scoring a rubric, its repeat-read noise has one measurement, and the
classical formulas assume independent observations, which 66 reads of 52 casts are not. Effective n
is lower than printed everywhere in §3. The linguistics transfers least. The canon is 1890–1935
prose by many hands, our books are one modern writer imitating it, and "over-represented against the
canon" mixes period with habit. The measures chosen for the kit are the ones that survive that:
phrases the canon never uses at all, and a growth exponent, which does not depend on which words are
used.

---

## 8. WHAT THIS PAPER COULD NOT DETERMINE, AND PREMISES THAT TURNED OUT FALSE

**Premises on file that the measurements contradict.**

1. **"Machine-register rate … −0.697 against the headline"** (CLAUDE.md). On 66 reads it is −0.45, and
   its slope is zero from 1 September. The instrument was real in its regime and is not validated in
   the current one.
2. **"Never read a book whose SHIP-CHECK says WORTH A LOOK"** (CLAUDE.md, from A_94). The flag does not
   separate reads (§3.3).
3. **"Five categories have never reached a 9."** Three have not: dialogue, pacing, prose. Opening hook
   and character clarity have one each.
4. **The external-read manifest is the ledger.** `eval/results/external-read/manifest.json` holds 72
   rows; a live walk finds 79 reads. Eight rows point at folders that have moved, seven reads from 25
   September on are absent, and `--check` reports 18 reads unparsed, 16 of them because the heading
   "Humour / Wit" is not in its list. Every figure here comes from the live walk.
5. **The anti-copy gate is on.** The flag is set and nothing calls the check (§2.4).
6. **A 24,000-token ceiling deletes craft blocks.** It was deleted with v1 on 2026-10-01 (§4.4).
7. **My own first measurement of §4.2** counted across manuscripts and reported case nouns as house
   phrases. Caught by the output (one cast's names in 11 of 30 "books"), fixed by clustering on cast.

**Not determined.**

- Whether the 31 "culprit cleared" cases are contradictions or the designed false alibi.
- Whether a case whose timetable leaves one suspect reads better. Eight matched cases show nothing,
  and nothing in §2 claims it will. K2's counter is a logical one for that reason.
- Whether the reader's noise is nearer 1 or 3. K12 exists to settle it.
- The house-phrase load's period inflation. Only the "never in the canon" row is free of it.
- Whether a higher Heaps exponent reads as a broader lexicon to the owner. It is the form that
  separates us from the canon; it has not been tested against a read.
- The cast clustering is transitive and merged 156 pre-September manuscripts that share default names
  into one cast. That is conservative for §4 and is itself a finding about the period before
  `--fresh-names`.
- Whether a pinned run parameter really shifts the later fields. It is read from the code, not run.
- Whether pairwise coverage of run parameters finds defects faster here. The 30-against-125 figure is
  arithmetic about coverage; the claim that coverage finds interaction defects is from the software
  testing literature.

---

## 9. SUMMARY FOR SOMEONE BUILDING SOMETHING ELSE

1. **Sort every function by its job before choosing its form.** Deciding a fact about one artifact is
   logic. Describing many artifacts is statistics. Dividing a fixed amount is mathematics. Most of the
   expensive mistakes here were one of these doing another's work.
2. **Construct what you can; check only what you must.** The half of our deception that code builds
   holds 25 times in 25. The half a model writes and code checks holds 8 times in 25.
3. **A solver decides only what is written in a form it can read.** Before building one, count how
   often its answer would be *unknown*. Ours is 65%.
4. **Unknown is an answer.** Two-valued checks turn "could not read" into "pass", and a system built
   from them reports health it has not observed.
5. **Give every check a witness.** A check with no input that fires it is not a check.
6. **Keep a number with its interval, its null, its regime and its date.** Recompute it when the data
   changes. A constant in a rules file is a statistic that has stopped being measured.
7. **Test a rule as a classifier before making it a rule.**
8. **The largest of many is not typical of one.** Best-ever sums, worst chapters, best-of-three drafts
   and the top row of a sweep are all extremes, and each needs the distribution of the extreme.
9. **Pick the form that can lose.** A ratio said our vocabulary beat the canon. The growth law said it
   did not, and only one of them was capable of saying so.
10. **A correctness instrument is not a quality instrument.** Ours pointed the wrong way against the
    reads. Use it to make the case true, and use the reader to find out whether the book is good.

---

## Probes

`documentation/white-papers/WP-006-probes/` — run from the repo root after `npm run build:all`; all
read-only.

| script | produces |
|---|---|
| `ledger-and-lexicon.mjs` | §3.1 category table, §3.2 by era, §3.4 null, §3.5 chapters, §4.1 MTLD/MATTR, §4.5 |
| `structure-vocab-classify.mjs` | §3.1 regression and principal component, §3.2 slopes, §3.5 chance of a 90, §4.1 growth |
| `ship-check-base-rate.mjs` | §3.3 |
| `axis-shrinkage.mjs` | §3.7 |
| `timetable-uniqueness.mjs`, `timetable-vs-reads.mjs` | §2.1, §2.6 |
| `case-logic-archive.mjs`, `case-logic-vs-reads.mjs` | §2.2, §2.6 |
| `unique-case-sameness.mjs` | §4.1 pooled vocabulary, §4.2 |
| `pairwise-coverage.mjs` | §4.4 coverage table |

The `keyness` part of the first script, and the pooled-vocabulary, house-phrase and `classify` parts of
the second, count across manuscripts rather than distinct casts. They are kept as the record of the
mistake in §8 and are superseded by `unique-case-sameness.mjs`; no figure in this paper comes from
them. The three inventories behind §1.2 are recorded in full in
[WF-003](../workflow/WF-003-function-inventory-decide-estimate-allocate.md).

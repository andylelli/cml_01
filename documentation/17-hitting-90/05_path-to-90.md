# 05 — THE PATH TO 90

## §1 The arithmetic

The headline a reader gives tracks the sum of the ten rubric categories plus an offset. Over the four
latest reads (`04` §0):

| read | premise | hook | plot | character | dialogue | atmosphere | clues | pacing | ending | prose | **sum** | **headline** | offset |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| R1 compass, v1 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 8 | 7 | 79 | 85 | +6 |
| R2 clock, v1 | 8 | 8 | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 7 | 80 | 86 | +6 |
| R3 tide, v1 | 9 | 8 | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 7 | 81 | 85 | +4 |
| R4 tide, v2 | 9 | 8 | 8 | 8 | 8 | 9 | 7 | 8 | 7 | 8 | 80 | 84 | +4 |

**MEASURED, four reads:** the offset runs +4 to +6. **MEASURED, 70 reads** (`eval/results/external-read/manifest.json`):
the offset averages +5.2 but ranges 0 to 11, and **it shrinks at the top** — the two highest category
sums in the ledger, 84 and 83, both carry +3 (the 87 read and the 86 "weighted pendulum" read).

**So a 90 needs a category sum of 84 at the recent offset, and 87 at the top-of-ledger offset.** Plan
for 86–87: six or seven categories at 9, the rest at 8.

What each category has ever reached, and the route to +1:

| category | last four reads | best ever | route to +1 | plan |
|---|---|---|---|---|
| premise | 8–9 | 9+, often | keep | — |
| atmosphere | 8–9 | 9+, often | keep | — |
| clues | 8 (v1) / 7 (v2) | 9, twice | parity, then W1 + W7 + W8 | P1, P3 |
| ending | 8 (v1) / 7 (v2) | 9, twice | parity, then W4 | P1, P2.1 |
| character | 8 | 9, once (the 87 read) | O1 + O2: the wound staged | P2 |
| plot | 8 | 9, once (weighted pendulum) | W3: no repeated proof after the reveal | P1.7, P3.4 |
| hook | 8 | 9, once (the 87 read) | not targeted by this plan | — |
| prose | 7 (v1) / 8 (v2) | 8 | keep v2's 8 | engine decision |
| dialogue | 8 | 8 | W5, and speech openings kept alive through the book | P1.1, P4 |
| pacing | 8 | 8 | W3, and chapters that stop thinning | P1.1, P3.4 |

**The 90 book this plan aims at** — **INFERRED**, a target to measure against, not a forecast:

| premise | hook | plot | character | dialogue | atmosphere | clues | pacing | ending | prose | sum | headline at +3 to +5 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 9 | 8 | **9** | **9** | 8 | 9 | **9** | 8 | **9** | 8 | **86** | **89–91** |

**Four categories have to rise to 9 from where the last four books sit: plot, character, clues and
ending.** Each has been given a 9 before; no book has had all four — the weighted pendulum had three (plot, clues, ending) and a character 8. The best
book in the ledger — the 87 — had four 9s (premise, hook, character, atmosphere). The weighted
pendulum had four (premise, plot, clues, ending). **A 90 is those two books' strengths in one book.**
Dialogue, pacing and prose do not have to reach a mark never given; they have to hold 8.

A read carries ±3 marks, so one 90 is not proof of a 90 book, and one 87 is not proof of failure.
Read the categories.

---

## §2 The phases

Every phase is measured before it is read. A read is spent only when the book has **no fallback
chapter, a ship-check that says normal, and has been read by us first** (CLAUDE.md).

### Phase 0 — switch to v2 · £0

| item | done when |
|---|---|
| P0.1 `PROSE_ENGINE=v2` in `.env.local` | the next run's log shows `Agent9v2-Writer` labels and no v1 `Agent9-` chapter labels |
| P0.2 `AGENT9_V2_FILTER_SOFTEN=true` | registered ON in FLAG-AUDIT |
| P0.3 the ship-check reads v2 manuscripts | seed 23403 arm B scored; its repetition figure printed |

### Phase 1 — v2 parity · two v2 prose pairs, about £0.50

Both pairs run on project `canary_1790272530595` (seed 23403), against byte-identical upstream, so
each compares straight to arm B and to the v1 read of the same case.

**Pair 1 — segmenting alone (P1.1).** One lever, because it changes every chapter.
Prediction, checkable: chapters 8–10 average **over 850 words** (arm B: 519); speech-opening
paragraphs in chapters 7–10 **at least 12** (arm B: 3); the book **over 10,000 words** (arm B: 8,044).
If the late chapters still taper, the one-call book was not the cause and the per-chapter brief line is
next.

**Pair 2 — the reveal package (P1.2–P1.7).** Bundled: they touch the test, reveal and aftermath
chapters only, which pair 1 does not change. Predictions, each checkable by reading chapter 8–10:
1. an innocent suspect attempts the test's physical step and fails; the culprit performs it;
2. the confrontation names the weapon, what was found on it, and the culprit, in one sentence;
3. one sentence states the mechanism; the opportunity is given with two clock values;
4. the culprit speaks at least two lines after the accusation, one naming what the victim was about to
   do, one naming what they had protected;
5. no post-reveal chapter is titled with reveal or clearing words;
6. v2's naming gate reports the culprit named.

**Then one read** of the pair-2 book, if it meets the read rule. **Prediction:** clues 8, ending 8,
prose 8 — the v1 marks and the v2 mark on one book; headline 86–88.

### Phase 2 — depth · one v2 prose pair and one fresh run

| item | how measured | cost |
|---|---|---|
| P2.3 O5, one element a chapter doing no job | prose pair on seed 23403: count one per chapter, check none is referenced by a clue | ~£0.25 |
| P2.5 where the em-dashes go (`03` §4) | count them in the arm-B checkpoint chapters | £0 |
| P2.6 O6 at the tic field | Agent 2b harness against the tic census (A_91) | pennies |
| P2.1 O2 and P2.4 one chapter off the premises | outline-stage changes: a fresh run on a **behavioural** seed (0–1 reads on that axis) | ~£1.15 |
| P2.2 O1 on the page | count each suspect's formative incident in the fresh run's book | £0 |

**Prediction for the read that closes phase 2:** character 9, or the reader names the staged wound
as a strength.

### Phase 3 — case faults, shared by both engines · harnesses, then the phase-2 run

| item | owner | how measured |
|---|---|---|
| P3.1 the fatal wound where it kills | Agent 3 `death_method` | Agent 3 harness over 5 cases: 0 fatal wounds to a limb without a named artery |
| P3.2 the opportunity as a window | Agent 3 / 2d temporal | harness: every opportunity time carries an opening and a closing value |
| P3.3 no clue spells out the plan | Agent 5 | harness: no single clue names both the access route and the weapon |
| P3.4 no post-reveal scene titled as clearing or revelation | Agent 7 | outline harness: 0 of 5 |
| P3.5 "twenty minutes past three-five" | trace the step that renders 3:25 this way (v1 book, 4 times; v2 book, 0) | a unit test pinning 3:25 |

These ride on the phase-2 fresh run, so one run tests both phases.

### Phase 4 — register · one v2 prose pair, then the programme's closing read

| item | the operation |
|---|---|
| P4.1 register lines | v2 editor: every sentence whose grammatical subject is the room, the silence, the truth or the evidence is rewritten with a person as its subject. A count on a simple thing, not a banned-phrase list (a list is a prohibition, and prohibitions do not steer) |
| P4.2 labels leaking | our own labels ("polite savagery", "unmeant joke") are given to the writer as a shape to perform, never as a phrase it can print |
| P4.3 shared catchphrases | each tic and each stock line owned by one character, as v2 already does for wit shapes (`assignOwnedShapes`) |
| P4.4 an instrument that points up | register conformance per story (WP-001 §6.2a) — PMI needs token log-probabilities, and whether the writer's endpoint returns them is **ASSUMED unknown**; check first |

---

## §3 Cost, in total

**INFERRED**, from the unit costs in CLAUDE.md and A_108:

| | runs | reads |
|---|---|---|
| phase 0 | £0 | 0 |
| phase 1 | 2 prose pairs, ~£0.50 | 1 |
| phase 2 + 3 | 1 prose pair + 1 fresh run + harnesses, ~£1.50 | 1 |
| phase 4 | 1 prose pair, ~£0.25 | 1 |
| **total** | **about £2.25 in runs** | **3 reads** |

Every paid run is announced with its full parameters before it launches (CLAUDE.md), and every
prediction above is reported afterwards, including the ones that fail.

## §4 What would stop the programme

- **Pair 1 shows segmenting does not lift the late chapters and pair 2's read loses prose 8.** Then
  v2's prose advantage came from its one-call brevity, and the decision in `01` reopens.
- **Phase 1's read scores clues and ending at 7 again with all six predictions met.** Then the reader
  is responding to something the reveal package does not reach, and W1 moves to the case (phase 3)
  before any further prose work.
- **WP-001's own falsification** (§6.2): if register conformance reaches 80% and prose does not move
  off 7–8 across two reads, register is not what the reader responds to.

# Architecture Review 09 — the machinery is finished; the instruments and the case are not

**Written:** 2026-08-15 · **Type:** what is left on the path to 90, from five external reads.
Supersedes [REVIEW_08](REVIEW_08.md)'s ordering. [REVIEW_05](REVIEW_05.md) remains the deep record.

REVIEW_08 argued that the structural work had topped out and the six capped categories were craft. Two
more cold reads and a day of building say something more specific, and more useful:

> **Nothing that cost points this week was a repair the pipeline lacked. It was a defect the pipeline
> could not SEE — three detectors that were blind, one instrument reading a third of the page, and one
> gate that could not find its corpus and said so in a line that looks like a pass.**

The repair ladder is now complete: N7 closed the last violation class that had a detector and no
working repair. What is left is upstream of prose, and it is mostly free.

---

## 1. Five reads, and the pattern is sharper than three showed

| category | 84 | 86 | 76 | 84 | 78 | best | spread |
|---|---|---|---|---|---|---|---|
| premise | 9 | 9 | 8 | 8 | 8 | **9** | 1 |
| plot structure | 8 | 9 | 6 | 8 | 7 | **9** | **3** |
| mystery clues | 8 | 9 | 7 | 8 | 6 | **9** | **3** |
| ending / reveal | 8 | 9 | 5 | 8 | 7 | **9** | **4** |
| opening hook | 8 | 8 | 8 | 8 | 8 | 8 | **0** |
| atmosphere | 8 | 8 | 8 | 8 | 8 | 8 | **0** |
| character clarity | 8 | 8 | 7 | 8 | 8 | 8 | 1 |
| pacing | 8 | 8 | 7 | 8 | 7 | 8 | 1 |
| prose / polish | 7 | 8 | 6 | 7 | 7 | 8 | 2 |
| **dialogue** | **7** | **7** | **6** | **7** | **6** | **7** | 1 |

**Read the spread column, not the marks.** The four categories the machinery targets swing by three and
four marks — that is the machinery working, in both directions. The six it does not target barely move
at all: **hook and atmosphere are 8 in five reads out of five, with zero variance**, and dialogue has
never once exceeded 7.

That is two different problems wearing one score:

- **The volatile four are a RELIABILITY problem.** They reach 9 when the case is sound and collapse to
  5–7 when it is not. Nothing about the 76 or the 78 says the pipeline cannot write an ending; it says
  the pipeline shipped a broken case and the ending was downstream of it.
- **The flat six are a CEILING problem.** Five reads at exactly 8 is not a defect distribution. No
  detector will move them, and this document does not pretend otherwise.

**90 needs both**, and they need different work. Six points from the best-ever 86 means: hold the
volatile four at 9 *every time*, and move dialogue and prose one mark each.

---

## 2. What the week actually settled

**N7 landed.** The reveal repair now runs on a channel that may modify. On 08-07 it failed three times
against `modified_or_dropped_original_paragraph`; on 08-15 it repaired
`reveal_culprit_not_named@8` in **one call**, and the confession it wrote shipped:

> *"Hugo Vane's face was ashen… \"It was me,\" he confessed… \"I stabbed Eleanor Voss with the decorative
> letter opener.\""*

Every violation class with a detector now has a repair path that has been shown to work, except the
ones deliberately excused in `GEOMETRY_CODES_WITHOUT_PROSE_REPAIR` — and each of those is excused
because **the repair belongs to the case, not the chapter**. That is §3's subject.

**And four of the day's five findings were blind instruments**, which is the reframe this document
exists for:

| what we thought | what was true |
|---|---|
| the reveal repair could not modify a paragraph | it could, once it had a channel — but the GATE could not read a confession (X34) |
| dialogue tics: two pre-voice-contract stories score ZERO | the probe read only double-quoted speech; they score 2.7 and 1.1 (X30b) |
| the 78's time logic was a prose defect | the CASE declared 14 minutes about a 10-minute gap (X38) |
| geometry's time model measures the manuscript | on 2 of 3 manuscripts neither anchor reaches the page (X39) |
| the backtest passes | it could not find its corpus and said "could not evaluate" (X42) |

Every one was free to fix. None needed a run to find — but three of them were found *by* runs, or by
readers of runs, because nothing else was looking.

---

## 3. The defects that cost points are now UPSTREAM of prose

The 78 lost its marks to *"the timing math does not work"* — the reader's words, and the largest single
complaint in either recent read. It originates three agents before prose:

```
Agent 3b's device (locked facts, injected verbatim)   displayed 7:15 · chime 7:05 · delay "fourteen"
                                                       7:15 − 7:05 = 10.  Ships as written.
Agent 3's hidden_model.mechanism                      apparent 8:15 · actual 8:45
                                                       Appears in the manuscript ZERO times.
```

Two temporal spines in one case, and the prose faithfully rendered the one geometry does not track.
Agent 9 could not have repaired this: locked facts are contractual, and rewriting a chapter to
reconcile them would contradict the registry. **X38 and X39 now detect both**, and X39 revealed the
second one is not a one-off — the 80-scoring story never states its anchors either.

**This is the reliability half of §1, and its home is a pre-prose gate.** Both checks currently run at
the acceptance boundary, which is after the money is spent. Promoting them to the locked-fact registry
would fail a contradictory case in seconds, before Agent 9 writes a word against it.

---

## 4. The board

### Free, and this is where the value is

| # | Item | Note |
|---|---|---|
| **X38/X39 → pre-prose** | Move the two case-clock checks ahead of Agent 9 | Built and shadow-reporting. A case that contradicts itself should never reach prose (§3) |
| **X40** | The scaffold detector returns clean on the pipeline narrating itself | *"The detective's understanding updated:"*, *"The revised meaning of the clues was clear:"*, lower-cased *"Dr mallory finch"* — all quoted by a reader, all `[]` from `detectScaffoldNotProse` |
| **X36** | The aftermath pass runs on the channel §36 measured as 0-of-3 | **One line.** It takes the unpinned `geometryRegen`; only the reveal pass pins its own. It failed live on 08-15 for exactly that reason |
| **X41** | The reveal repair satisfies the obligation without earning it | *"Hugo confesses, but the final proof is too abrupt"*. The evidence chain belongs in X35's instruction, before the admission |
| **X37** | A content-filter refusal took the rubric SCORE and degraded silently | X33 fixed the site that aborted; this one leaves a run with no internal number and nothing says so loudly |
| **X30** | Dialogue tics: measured honestly now, still not gated | The instrument is fixed; the signal still does not separate two stories a reader scored the same |
| X32 | The third clearance writer, bounded by act rather than chapter role | From closing X29; unmeasured |
| X22 | ⛔ decided: stop widening the aftermath regex | Unchanged |

### Paid

| # | Item | Cost | Why it is still on the list |
|---|---|---|---|
| **M6** | The rubric in Agent 9's prompt | ~£1.5 | The only cheap probe aimed at the flat six. If the ceiling is craft, this is the first thing that could move it |
| **N8** | Phase-2 geometry contract | ~£1.5 | Now has a CONFIRMED misbinding (08-14: contract bound ch8, manuscript disclosed in ch10) rather than a suspicion |
| CS1 | Promote `@cml/clue-spec` | ~£1.5 | Unchanged |
| **R6** | `eval:baseline --repeats 3` | £12–24 | **The 90 measurement.** More necessary than in REVIEW_08, not less — see §5 |

### Decisions (yours)

**M5 — retire the deterministic injectors.** The evidence is now as strong as it will get without a
decision: on 08-14 the ending a reader called *"complete and satisfying"* was carried by
`"Hugo Vane was responsible; the evidence allowed no other reading"` — the injector template, which
that same run's X4 telemetry logged as violating two lint rules the model itself is held to. **X34
changed what this costs**: before it, the only prose that could satisfy `reveal_culprit_not_named` was
that template's shape, so retiring the injector left the obligation with nothing to meet it. Now a
dramatized confession satisfies the gate, and the floor is genuinely redundant on that obligation.

**D1** promote the scheduler · **X4 Option 1** refuse an injection that breaks a model-bound rule (N7
has now shown the repair path lands, which was its precondition) · **Move 4** a frontier model for
generation.

---

## 5. What 90 requires, and what would falsify this document

**The instrument is not yet trustworthy enough to certify 90.** Two things happened this week that
say so:

1. The 08-14 run scored internal 76 → external 84, an offset of **+8** against the +11 the calibration
   assumes. One point of evidence, inside M1c's ±3, but on the low side.
2. The 08-15 run produced **no internal score at all** — the rubric call was content-filtered (X37) —
   and nothing about the run's output made that loud.

So R6 is not a formality at the end of the list. **With five reads we are now arguing about single
marks between stories whose premises differ**, which is precisely the comparison §6 forbids. R6 with
`--repeats 3` on a fixed premise is the only thing that turns any of this into a measurement.

**What would falsify the thesis here:** if M6 moves hook or atmosphere off 8. This document claims the
flat six are a craft ceiling that detectors cannot reach; the cheapest way to prove that wrong is to
give Agent 9 the rubric it is judged by and watch a flat category move. If M6 does nothing, the claim
survives and Move 4 — a better generation model — becomes the honest next step rather than a
speculative one.

**What will not get to 90:** more detectors on plot, clues and endings; another regex widening on the
aftermath family (X22, decided); and any single read, of any story, at any score.

---

## 6. The order

```
FREE — the case, and the instruments
 1  X38/X39 → pre-prose      fail a self-contradicting case before Agent 9 writes against it
 2  X36                      one line: the aftermath pass needs the channel N7 pins
 3  X40                      teach the scaffold detector the pipeline's own narration
 4  X41                      build the reveal before it lands (X35's instruction)
 5  X37                      a refused scorer must be loud, not silent

PAID — cheapest decisive first
 6  M6     the rubric in Agent 9's prompt          ~£1.5   ← the only probe aimed at the flat six
 7  N8     phase-2 contract                        ~£1.5   ← now with a confirmed misbinding
 8  CS1    clue-spec                               ~£1.5
 9  R6     eval:baseline --repeats 3               £12-24  ← the 90 measurement

DECISIONS
10  M5     retire the injectors — X34 removed the reason to keep them
11  D1     promote the scheduler (pacing)
12  Move 4 a frontier model for generation, if the flat six survive M6
```

**Steps 1–5 are free and small.** Steps 6–8 are three runs, ~£4.50. R6 is the only large number, and it
is the one that decides whether any of this reached 90 or merely looks like it did.

---

## 7. The rule, restated because it got harder

**No quality claim from a single scoring** — and now, no comparison across premises either. The two
84s in §1 are different stories: one scores 0.8 dialogue tics per 100 lines and the other 6.0, and a
reader gave both a 7. Either the metric is wrong or the reader's mark is coarse, and **five reads of
five different stories cannot tell us which**.

Everything in §1's table is the best available estimate. It is not a measurement, and it will not be
one until R6.

# Architecture Review 15 — the gate saw it, and shipped it anyway

**Written:** 2026-08-19 · **Type:** what the first external read since 08-17 returned, and the single
structural fact it exposed.
Supersedes [REVIEW_14](REVIEW_14.md) §1's account of the problem — not its measurements, which stand.
Falsifies [REVIEW_13](REVIEW_13.md) §1's arithmetic by the test §7 of that document set for itself.
[REVIEW_05](REVIEW_05.md) remains the tracker.

The read of `story_20260819-2047` came back at **81/100**. It named six problems. **Four of them had
already been detected, named and reported by the pipeline before it shipped the manuscript** — one of
them naming the exact clue the reader asked for by name.

> **The release gate hard-stops on seven conditions. Four are encoding, placeholder or heading
> artifacts — things that make the TEXT look broken. Every geometry violation, without exception, is
> warning-only: `releaseGateReasons.push(...geometryReleaseWarnings)` and never `hardStopReasons`.**
>
> **Mojibake stops a run. "Chapter 8 is the reveal, and no paragraph names the culprit" does not.**
>
> REVIEW_14 §1 concluded the instruments were blind. Half of that is now wrong. Here they saw
> correctly, attempted repair, failed, and had no authority to stop.

---

## 1. The read, and the arithmetic it breaks

| category | mark | best-ever |
|---|---:|---:|
| premise | 8 | 9 |
| opening hook | 8 | 8 |
| plot structure | 7 | 9 |
| character clarity | 8 | 8 |
| dialogue | 7 | 8 |
| atmosphere | 8 | 8 |
| mystery clues | 7 | 9 |
| pacing | 7 | 8 |
| ending / reveal | 7 | 9 |
| prose / polish | 7 | 8 |
| **sum** | **74** | **84** |

**Headline 81 against a category sum of 74 — an offset of +7.**

[REVIEW_13 §7](REVIEW_13.md) set this exact tripwire:

> *"§1's arithmetic is wrong if a read returns a headline more than 6 above its category sum at the
> 80+ level. n=7 is thin, and the whole projection rests on it."*

It did. The series is now:

```
+2  +2  +2  +2  +3  +4  +6  +7          n=8   mean +3.5   max +7

best-ever sum                    84
84 + mean 3.5                  87.5
84 + max 7                       91     <-- 90 is now INSIDE the observed range
```

**90 no longer requires an offset nobody has seen.** It still requires marks nobody has seen — the
sum must climb from 74 toward 84 — but REVIEW_13's "two to three unprecedented category marks" was
computed against a ceiling of +6, and the ceiling moved. This does not make 90 easy. It makes it
arithmetically reachable from marks that have all been achieved before, at the top of the observed
offset.

**And the reader volunteered a second number.** Unprompted, at the end:

> *"With the fabric clue moved earlier, the reveal consolidated, and Hale's secret made specific,
> this could reach **87–89/100**."*

Three named, bounded structural fixes, worth six to eight marks in the reader's own estimate.

---

## 2. Four of six, already on the run's own console

The reader's six complaints, against what the pipeline recorded **before saving the file**:

| the reader | the pipeline, pre-ship |
|---|---|
| **"The ending order is wrong."** Ch8 reveals, Ch9 pretends the case is open, Ch10 says he already confessed | `aftermath_repeat (ch9)` — *"Chapter 9 is aftermath and re-delivers what chapter 8 already disclosed"* · `reveal_culprit_not_named (ch8)` — *"no paragraph names Captain Ivor Hale as the person who did it"* |
| **"The fabric scrap should not appear after Hale has already confessed. It should be part of the trap."** — their number-one fastest fix | `clincher_not_planted (ch3)` — *"The decisive trace does not appear anywhere in chapters 1–3, so its production in the reveal is unearned"* · `clincher_absent_at_payoff (ch8)`, which **names the scrap**: *"A small scrap of fabric matching Captain Ivor Hale's uniform… caught on the bent pendulum suspension spring"* |
| **"Beatrice and Hugo are cleared too easily"** | `false_solution_absent (ch6)` — *"Chapter 6 carries the false solution but never puts Beatrice Quill in the frame"* |
| **"the delayed-chime timeline needs sharpening"** | `unaccounted_time` — *"The manuscript states 2 time(s) that nothing in the case accounts for: 'five to eight' (ch3), 'five to seven' (ch3)"* |
| *"Hale's motive is vague"* | not detected |
| *"the clock is doing too many things"* | not detected |

Two were missed. **Four were seen.** And seeing was not the end of it — the repair machinery ran:

```
[Agent 9] geometry reveal-repair UNRESOLVED in ch8: regen did not improve the targeted
          property (score 400, was 400; still failing: geometry:reveal_culprit_not_named)
[Agent 9] aftermath-repeat regen UNRESOLVED in ch9: regen did not improve the targeted
          property (score 375, was 375; still failing: aftermath_repeat:p1)
[Agent 9 geometry:apply] 14 checks, 6 violation(s), 1 repaired
CANARY_RELEASE_GATE warning
```

**Detected → repair attempted → repair failed → shipped.** Five of six violations unrepaired, and the
gate returned `warning`.

---

## 3. The taxonomy, which is the whole finding

The release gate maintains two arrays, and its own comment states the contract:

```
//   releaseGateReasons — warnings logged to ctx; generation continues; output still saved.
//   hardStopReasons    — thrown as an error; orchestrator catch block saves a partial report
```

Sixteen conditions push a warning. **Seven can stop a run:**

```
HARD STOP                                          WARNING ONLY (all geometry, among others)
  fair play audit score below threshold              clincher_not_planted
  mojibake / encoding artifact                       clincher_absent_at_payoff
  illegal character corruption                       reveal_culprit_not_named
  placeholder token leakage                          aftermath_repeat
  duplicate chapter heading artifacts                false_solution_absent
  suspect elimination coverage incomplete            unaccounted_time
  clue visibility: NSD reveal without anchor         readability density, scene grounding, …
```

Four of the seven hard stops — mojibake, illegal characters, placeholder tokens, duplicate headings —
are **textual hygiene**. They are the conditions under which the artifact does not look like a book.

`geometryReleaseWarnings` is pushed at line 7200 into `releaseGateReasons`, and appears nowhere in
`hardStopReasons`. **Not by policy decision recorded anywhere — by construction.**

> **The gate stops the run when the text looks broken, and lets it ship when the STORY does not work.**

That is the sentence this document exists to write. Every one of the reader's four detected complaints
sits in the warning-only column, and the two most consequential — the unplanted clincher and the
scrambled ending — are pure geometry.

---

## 4. What this does to REVIEW_14

**§1 is half wrong, and the better half survives.** X61, X62, X64, X65 and X67 were genuinely blind
instruments, and the run confirmed two of them were still blind after being fixed. But the headline
claim — *"the pipeline instructing it badly, or measuring it wrongly"* — does not cover this read.
Here the measurement was right and nothing was obliged to act on it. **Blindness and permissiveness
are different diseases and want different medicine.**

**§4 (the craft ratio) is not supported, and has not been fairly tested.** With the craft floor ON,
dialogue and prose came in at **7**, below their best-ever 8. That is the wrong direction. But the
reader states the cause of the prose mark outright — *"Generated artifacts remain"* — and lists them:

```
"The lobby grandfather clock came to forty feet."          <- X65, shipped broken, fixed after the run
"It had taken twenty minutes in all."                      <- X64, shipped broken, fixed after the run
"Captain Ivor Hale was responsible; the evidence allowed no other reading."
"dr mallory finch beside the secrets…"
```

Two of the four are defects this project introduced and has since repaired. **§4's prediction cannot
be evaluated against a manuscript whose prose mark the reader explicitly attributes to artifacts that
no longer exist.** It needs one clean run.

**§8.5 (X63 → character clarity) did not pay.** Character clarity held at 8, and the reader added a
character complaint that was not there before — *"Hugo… disappears as a serious suspect too quickly."*
X63 was a correct fix to a real defect and bought no mark. REVIEW_14 §3's argument survives as a
hypothesis; it has one negative data point.

---

## 5. The last sentence of the book

```
She pictured dr mallory finch beside the secrets that had outlived her… and disappeared into the
shadows, leaving the lobby to its uneasy peace. Captain Ivor Hale was responsible; the evidence
allowed no other reading.
```

The final clause is `enforceCulpritEvidencePresence` output. The run recorded it:

> *"[X4] injector-vs-lint: enforceCulpritEvidencePresence injected a sentence into chapter 10 …
> that violates verdict_closer.was_responsible — a rule the model is held to. The injection STANDS
> (ADR-0003); this is a record, not a refusal. Rule: Resolution chapter must close with an in-scene
> moment (dialogue, action, or sensation), not a summary verdict sentence."*

**The last sentence of the book is an injection the pipeline's own linter forbids the model to write**,
appended after the closing image, and the reader named it. The lowercase `dr mallory finch` beside it
is a second, undiagnosed casing defect in the same paragraph.

This is §3's taxonomy in miniature: the rule exists, the violation is detected and logged, and the
policy is to let it stand.

---

## 6. The path to 90, reordered

The reader has done the prioritisation, and their list is short, structural, and matches the
detectors that already fire.

```
 1  MAKE GEOMETRY BLOCKING — or repairable, and then blocking            free to decide
    clincher_not_planted and aftermath_repeat are the reader's #1 and #2
    complaints and the pipeline names both. Today they cannot stop a run.
    This is a DECISION about what a release means, not a detector to build.
    Note the cost honestly: the repair passes already fail on these
    (400→400, 375→375), so blocking today converts ships into aborts. The
    prerequisite is a repair that works, not a stricter gate on a broken one.

 2  THE VERDICT-CLOSER INJECTION                                          free
    The last sentence of the book, forbidden by the pipeline's own rule,
    named by the reader. ADR-0003 says injections stand; this is the case
    for a narrow exception at the resolution chapter.

 3  X38-AT-SOURCE                                                         paid ~£1.5
    Four consecutive runs, four wrong devices, three surface forms the
    parser could not read (REVIEW_14 §12.3). Unchanged, and now the
    best-evidenced item on the board.

 4  ONE CLEAN RUN, then a read                                            paid ~£1.5
    X64/X65/X67 are fixed and unmeasured. §4's craft prediction and the
    prose mark both need a manuscript without the artifacts the reader named.

 5  HALE'S SECRET — the motive noun                                       free to design
    The reader's third named fix, and the one nothing in the pipeline
    detects: "the reveal says Finch would expose 'what he'd been hiding'".
    A motive requires a concrete noun, and no gate asks for one.
```

**Items 1, 2 and 5 are the reader's own three fixes**, which they price at 87–89.

---

## 7. What is not the path

Unchanged from [REVIEW_14 §7](REVIEW_14.md), with one addition this read earned:

- More detectors on plot, clues and endings. **This read is the proof.** The detectors for the
  reader's two largest complaints already exist, already fire, and already name the right clue.
- R6; any single read as evidence of anything; flag-gating without checking the trigger fires.
- **NEW — treating a warning count as a quality signal.** This run emitted 117 warnings and shipped
  at 81. The 08-17 run shipped at 86. The number is not the measure; *which* warnings are unrepaired
  is.

---

## 8. What would falsify this document

- **§3 is wrong if** making geometry blocking produces aborts without producing better manuscripts —
  i.e. if the runs that would have been stopped are the same runs that scored 86. That is directly
  testable against the corpus: replay the geometry checks over the archived manuscripts and ask
  whether the 86-scoring runs would have shipped.
- **§2's "four of six" is overstated if** the detectors' messages, read cold, do not actually
  correspond to what the reader meant. The clincher case is unambiguous — the detector names the
  fabric scrap — but `unaccounted_time` mapping to *"the delayed-chime timeline needs sharpening"* is
  the reviewer's judgement, not the reader's word.
- **§1's new arithmetic is wrong if** the +7 is a scoring artifact rather than a real offset. n=8 is
  still thin, and one read moved the mean by half a mark. A ninth read at +2 pulls it back.
- **§4's verdict on the craft ratio is premature** and is stated as such: one confounded run.
- **What this document does not claim:** that blocking geometry raises the score; that 90 is reachable
  with the current generation model; or that this read is comparable to the 08-17 read, which was a
  different case with a different device. It claims one thing — **the pipeline knew, and shipped.**

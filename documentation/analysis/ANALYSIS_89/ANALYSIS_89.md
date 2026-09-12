# ANALYSIS_89 — The reader's 79/100, grouped by cause

**Date** 2026-09-12 · **Cost** £0 · **Subject** `read-20260911-2112`, run `mystery-1789156244434`
(behavioural axis, seed 88651, £1.27). **Method** every complaint traced to the artifact or the line
of code that produced it, then measured across the archive. Counts are MEASURED unless labelled.

---

## 0. The answer in one paragraph

The reader's ten complaints reduce to **four causes**, and three of the four are the same shape:
**a value that exists, is correct, and is discarded or contradicted downstream by a rule nobody
measured.** The case states a murder window and then places the death outside it (71% of cases). The
clue schedule mandates the same evidence in several chapters and then hands the final chapter two
contracts that forbid each other (41% re-mandate rate; the contract collision in 37 of 39 runs). The
cast carries a motive-bearing sentence for every relationship and a 40-character label cap deletes
**99% of them** before Agent 9 sees one. Only the fourth — machine register — is the model's own
doing, and even there our phrase-variety pass leaves fingerprints. None of these is fixed by editing
prose. Each is fixed by making a number, a contract or a field survive the journey it already takes.

---

## 1. What was read

`read-20260911-2112` — **79/100**, ledger row 59 of 59.

| category | mark | category | mark |
|---|---|---|---|
| premise | 8 | clues / evidence logic | **5** |
| opening hook | 7 | pacing | 7 |
| plot structure | 7 | ending / reveal | 7 |
| character clarity | 8 | prose / polish | **6** |
| dialogue | 7 | character life | 7 |
| atmosphere | 8 | | |

**This is not a matched pair with run 3252 (84/100).** Different axis, different case, n=1, and the
rubric cannot resolve differences under ~7 marks. Nothing below claims a score effect.

---

## 2. GROUP A — The arithmetic does not close · `clues 5/10`

### What the reader said

> *"silent intermission starts at 4:00 · silence lasts 7 minutes · music restarts at 4:20 · autopsy
> says death at 4:20 · murder window cannot exceed 10 minutes — these do not naturally fit together."*
> *"Chapter 6 even says the murder is 'outside the apparent four o'clock pause,' then immediately says
> Nora realizes the murder window coincided with the silent intermission. Those two ideas conflict."*

### Where it comes from — the case, not the prose

The prose rendered an incoherent case faithfully. From this run's artifacts:

| source | value |
|---|---|
| `constraint_space.time.anchors` | *"silent intermission starting at four o'clock"* |
| locked fact `silent_intermission_duration` | *"seven minutes"* — the silence is 4:00–4:07 |
| locked fact `murder_window_interval` | *"ten minutes"* — the window is 4:00–4:10 |
| `hidden_model.mechanism.actual_time_of_death` | *"a quarter past four"* — **4:15** |
| clue (temporal) | *"actual time of death … **outside** the apparent four o'clock silent intermission"* |

The mechanism requires the culprit to move **during** the silence. The death is placed **after** it.
The case states both, in different fields, and the clue text names the contradiction as if it were a
feature. The reviewer's "Chapter 6 conflicts with itself" is Chapter 6 repeating both fields.

### How general

Comparing `apparent_time_of_death` with `actual_time_of_death` against every minute-duration the case
states, over the archive:

| | |
|---|---|
| cases with both times parseable and a stated duration | 21 |
| gap fits inside the largest stated window | 6 |
| **gap EXCEEDS every stated window** | **15 (71%)** |

Examples: a 60-minute gap against a 10-minute window; 30 against 5; one case with a 705-minute gap
against a 10-minute window.

### Why it happened

The temporal model is assembled by **three agents that never compare notes**: Agent 3b writes the
durations into `lockedFacts`, Agent 3 writes the two times into `hidden_model.mechanism`, Agent 5
writes the clue describing them. Every existing time check is a **string** check — locked-fact versus
clue transposition, AM/PM specificity (dead until A_88), `parseClockTime` vocabulary. **No check does
the arithmetic.** Nothing asserts that the concealed interval can contain the event it conceals.

### The fix — deep

**A1. A temporal closure gate at the end of Agent 3, before Agent 4.** Derive the concealment interval
from the anchor time plus the stated duration and assert `actual_time_of_death` falls inside it. On
failure the repair is arithmetic and deterministic: move the actual time to the mid-point of the
window, or widen the window to cover it — whichever changes fewer locked facts — and re-render the
dependent clue text *from the number*. X60's principle, fail at the cheap end: a case repaired at
Agent 3 costs pennies; the same defect read by a human costs £1.27 and three marks.

**A2. One derived timeline, written once, read everywhere.** Durations, the two times and the alibi
windows are four independent free-text fields today. They should derive from a single `timeline`
object holding numeric minutes, with every free-text mention rendered from it. A number that exists
once cannot contradict itself.

**The sticky plaster to avoid:** adding "make sure your times are consistent" to Agent 3's prompt.
This project has measured the model complying with operations and ignoring statistics
(`prompts-move-operations-not-statistics`); a consistency *instruction* is neither.

---

## 3. GROUP B — The repetition is instructed · `plot 7 · pacing 7 · ending 7`

### What the reader said

> *"Chapters 3–6 circle the same evidence."*
> *"The reconstruction is promising, but the proof becomes a speech … memory anchoring, technical
> access, fresh winding marks, correction notes, autopsy, alibis, motive, confession all in one heavy
> block."*
> *"Chapter 10 still recaps too much evidence … Those details belong in Chapter 8. Chapter 10 should
> stay emotional."*

### B1 — The same clue is mandated in several chapters

Counting the `CLUE OBLIGATIONS` block in each chapter's prompt:

| | this run | corpus median (47 runs) |
|---|---|---|
| clue-obligations issued per book | 43 | 34 |
| distinct clues | 23 | 20 |
| **re-mandate rate** | **47%** | **41%** |
| heaviest single chapter | 14 | 10 |
| final-chapter load | **8** | 2 |

Sixteen of this book's 23 clues are mandated in more than one chapter; `clue_8` in four. The reader
called it "circling the same evidence"; the prompt asked for it.

The consequence is measurable in the prose. Six-word spans repeated three or more times **inside one
book**: this manuscript ranks **25th worst of 212** at **118.8 per 10,000 words against a corpus
median of 17.3**. The repeated spans are the evidence list itself — *"the murder window she recalled
could not exceed"* ×6, *"the choreography alignment and the music restart"* ×6, *"careful to record
the silent intermission 'seven minutes'"* ×5.

### B2 — The final chapter is given two contracts that forbid each other

Chapter 10's prompt carries both:

> `AFTERMATH REQUIRED (final chapter): after the resolution event, the fallout must land … Do NOT end
> on the arrest/confession line`
> `⚠ CULPRIT REVELATION REQUIRED (Confrontation with combined evidence …)` — plus `EVIDENCE CHAIN
> REQUIRED`, `KILL STATEMENT REQUIRED`, `THE DEDUCTION MUST BE WALKED`

One demands the full evidence chain; the other exists to stop a chapter re-litigating evidence.

**Across every run in the prompt log: the reveal contract was assigned in 39 runs, and in 37 of them
(95%) it shared a chapter with `AFTERMATH REQUIRED`.** This is long-standing and predates A_87.

**A_87 made it universal, and that is on this work.** Before, the reveal contract was assigned on
34/45 archived pairs; A_87's P4c rule ("the last `revelation`-beat scene wins") assigns it on 45/45,
and the last revelation beat **is** the final scene in 44 of 45 outlines. A_87 §8 read that 44/45 as
evidence the rule was right; it was in fact evidence that the rule systematically targets the
aftermath chapter. The defect moved rather than closing — run 3252 lost the reveal contract entirely
and the reader complained chapter 8 repeated itself; run 88651 put it on the aftermath chapter and the
reader complained chapter 10 recaps.

### Why it happened

Contracts are assigned **independently, by different rules, with no arbiter and no budget**. Clue
placement comes from Agent 7's grid plus deterministic gap-fills; the DT, reveal and aftermath
contracts come from three separate predicates in `obligation-block.ts`; nothing holds a per-chapter
total or asserts that two contracts are compatible. A_87 added arbitration *between DT and reveal* and
left aftermath outside the relation entirely.

### The fix — deep

**B1. One owning chapter per clue.** A clue is DRAMATIZED once, in the chapter that owns it. Later
chapters may REFER to it by a short callback, never re-dramatize it. That is a change to the
obligation builder, not to the prose: a second mandate becomes a *different* instruction rather than
the same one repeated.

**B2. A chapter obligation budget.** Fourteen clue obligations in one chapter cannot be dramatized and
will be recited. Cap the per-chapter count, push overflow to the owning chapter, and surface the
overflow as telemetry so a heavy schedule is visibly wrong rather than silently heavy.

**B3. Contract exclusivity, declared in one place.** Reveal, DT and aftermath must be mutually
exclusive by construction — a single resolver returning ONE contract per chapter, precedence stated
and tested, replacing three independent predicates. The reveal belongs on the last revelation-beat
scene **that is not the aftermath chapter**; when the only revelation beat is the final chapter, the
reveal moves earlier or the aftermath contract yields, and the choice is recorded.

**The sticky plaster to avoid:** telling chapter 10 "do not recap". It already says that —
`AFTERMATH REGISTER … do NOT end on a verdict sentence` — and the reveal contract beside it overrides.
Adding a third instruction to a chapter already holding two contradictory ones is how this was built.

---

## 4. GROUP C — Machine register · `prose 6/10`

### What the reader said

Eight lines named as *"generator scaffolding rather than finished prose"*, including *"Nora gaunt let
a flicker of amusement…"*, *"One must consider the alternatives, surely?"*, *"The evidence chain was
complete…"*, *"the emotional truth was explicit"*.

### The measurement that corrects a standing belief

**None of the eight exists in our source.** Searched across every `.ts` file in `packages/` and
`apps/`: all eight are the model's own words. This contradicts the assumption carried from A_84
(*"the reviewer's scaffold lines are our injectors"*), which was true of that run and is not true of
this one. **The register defect is not always an injector, and assuming it is sends the fix to the
wrong layer.**

What makes them read as machine text is **repetition** (§3): *"would not be ignored"* ×7, *"consider
the alternatives"* ×3. The model repeats itself because it is asked to re-dramatize the same evidence
chapter after chapter.

### What IS ours

`repair.ts:320-327` — the phrase-variety pass. `replacement` arrives normalised to lowercase and the
casing restore covers **only the first character**:

```ts
if (match[0] && match[0] !== match[0].toLowerCase()) {
  return replacement[0].toUpperCase() + replacement.slice(1);
}
```

So `Nora Gaunt let a flicker…` becomes `Nora gaunt let a flicker…`. Every proper noun inside a
replaced span except the first word is lowercased. Measured with each book's own cast: **4 of 42
books, 15 occurrences** — `Nora gaunt` ×7 in this book (the reader quoted two of them), `Sylvia
trent` ×4, `Beatrice quill` ×3, `Eleanor voss` ×1.

The irony is exact: the pass that exists to reduce repetition is the one leaving a visible
fingerprint, and it fires *because* §3 produced the repetition it is trying to fix.

### The fix — deep

**C1. Restore casing across the whole replacement.** `restoreSourceCasing(phrase, source)` already
exists at `clue-validation.ts:718` and maps token casing from the source. Export it and use it here.
One line, and the fingerprint is gone.

**C2. Treat the register rate as the instrument, not the anecdote.** `machine-register.ts` is the only
validated predictor this project has (−0.697 against the headline). Repeated-span density is a second
countable and tracks what readers call "generated phrasing". Both belong in the run report beside the
release gate, so a book at 7× the corpus median is visible *before* it is read.

**The sticky plaster to avoid:** adding the eight quoted sentences to a banned-phrase list. They are
the model's words for this case and will be different words next case. A banned-phrase list already
exists and this book still earned 6/10.

---

## 5. GROUP D — The motive never reaches the page · `character life 7/10`

### What the reader said

> *"We know Gwendolyn wanted creative freedom from Bertram, but we do not get enough history between
> them. Did he block her promotion? Steal her choreography? Threaten to dissolve the company? …The
> motive is conceptually fine, but emotionally thin."*

### The case already answers the question

The cast artifact holds, for the culprit–victim pair:

> `relationship`: *"Bertram Norbury pressured Gwendolyn Vance to secure profits from the ballet
> company and **threatened to cut funding if unsuccessful**"*
> `sharedHistory`: *"Bertram Norbury and Gwendolyn Vance met in his cabin to discuss funding shortfalls
> the afternoon before the murder"*

The reader asked whether he threatened the company. The case says he threatened to cut the funding.
**That sentence reached zero Agent 9 prompts.** The neutral logistical one reached 13.

### Why — a 40-character cap

`prompt-blocks.ts:316` renders `relationship` as a parenthetical *label* beside the history:

```ts
const asLabel = (rel: string, history: string): string => {
  const r = rel.replace(/\s+/g, ' ').trim().replace(/[.;]+$/, '');
  if (!r || r.length > 40) return '';     // anything longer is discarded
  ...
};
```

Agent 2 writes sentences into that field — its own prompt asks for one. Across the archive:

| | |
|---|---|
| `relationship` strings | 752 |
| **discarded by the 40-character cap** | **747 (99%)** |
| admitted | 5 |
| median length | 100 characters |

For this run, 10 of 10 `sharedHistory` strings reach a prompt and **1 of 10** `relationship` strings
does. The motive-bearing half of every relationship in the project's history has been deleted at the
prompt boundary.

The cap was added deliberately (A_81 §11.1) for a real defect — a label restating its own history with
a doubled full stop. **The fix was scoped to the rendering slot rather than to the content**, so a
formatting repair silently became a content filter.

### The fix — deep

**D1. Render `relationship` as content, not as a label.** It is a sentence; give it a line. The A_81
defect it was capped for — restatement of the history — is already handled by the substring check on
the next line, which needs no length cap to work.

**D2. Pin the culprit–victim pair into the reveal chapter's context.** The one relationship that must
carry weight is the one the confession turns on; it should be explicit rather than surviving by luck
of the active-character filter.

**The sticky plaster to avoid:** asking Agent 2 for "richer relationships". It already wrote the answer
the reader asked for. The content was never the problem; the pipe was.

---

## 6. What unites three of the four

A, B and D are one shape:

> **A value is produced correctly, travels, and is then discarded or contradicted by a downstream rule
> that nobody has measured against real data.**

- A: two correct numbers, never compared.
- B: three correct contracts, never arbitrated; one clue schedule, never budgeted.
- D: one correct sentence, dropped by a formatting cap.

It is the same family as A_87 (a reference that resolved 0/45 while every log said the join was fine)
and A_88 (a splitter that re-punctuated 46% of paragraphs, and a sibling that deleted text the moment
the first was fixed). The recurring defect is not bad logic — it is **unmeasured boundaries**.

**The general rule, for the register:** every rule that DROPS or OVERRIDES upstream content must report
its drop rate. A filter discarding 99%, a fallback firing on 98% of runs, and a join resolving 0/45 are
invisible for the same reason — they succeed silently. Where a boundary discards, it must count what it
discarded, and that count belongs in the run report.

---

## 7. The fix plan, ranked

Ranked by measured reach against build cost. All flag-gated, default OFF, registered with a probe and a
falsifier, per the repo's flag discipline.

| # | fix | reach | cost |
|---|---|---|---|
| 1 | **C1** casing restore in the phrase-variety pass | 4/42 books, reader-quoted | one line |
| 2 | **D1** stop the 40-char cap discarding `relationship` | 747/752 strings (99%) | small |
| 3 | **B3** one resolver, one contract per chapter (reveal ≠ aftermath) | 37/39 runs | medium |
| 4 | **A1** temporal closure gate at Agent 3 | 15/21 cases (71%) | medium |
| 5 | **B1/B2** one owning chapter per clue, plus a per-chapter budget | 41% median re-mandate | medium |
| 6 | **A2** one derived timeline object | structural | large |
| 7 | **C2** register + repetition density in the run report | telemetry | small |

1 and 2 are close to free and both were named by the reader. 3 repairs the regression A_87 introduced.
4 addresses the lowest mark on the sheet.

---

## 8. What this could NOT determine

- **Whether any of it moves the score.** Every number here is a prompt-side or artifact-side
  measurement. The rubric cannot resolve under ~7 marks, and this is one read.
- **Whether the behavioural axis reached the device.** The axis was *"a character whose known
  incapacity is a performance"*; the delivered mechanism is a gramophone-timing trick, and the reader's
  summary of the cover-up contains no feigned incapacity. Consistent with A_83 (*the axis reaches the
  reasoning, not the device*) but not traced for this run.
- **Whether the 71% temporal figure is exact.** The "largest stated window" is taken from locked-fact
  minute-durations, which are not always the murder window. The direction is unambiguous — gaps of 60,
  75 and 705 minutes against 10-minute windows — but individual rows may be mis-attributed.
- **Why chapter 6 received 14 clue obligations** when the corpus median heaviest chapter is 10. The
  gap-fill and threshold-fill passes are the likely source; not traced.


---

## 9. BUILD LOG — C1 and D1 (2026-09-12)

| item | state | flag | measured effect |
|---|---|---|---|
| **C1** casing restore in the phrase splice | **BUILT, unconditional** | none | 4/42 books stop lowercasing names; proof below |
| **D1** relationship rendered as content | **BUILT, flag-gated** | `AGENT9_RELATIONSHIP_CONTENT` (OFF) | **532 of 577 pairs (92%)** now reach the prompt, for **+271 tokens** on a ~24k prompt |

### C1 ships unconditional, and here is why that is safe

`restoreProperNounCasing` is a new, stricter sibling of `restoreSourceCasing`: it records a capital
only when the word appears capitalised **mid-sentence** in the source, so a sentence-initial "The"
teaches it nothing. Replayed over all **3,459 archived paragraphs**, simulating the splice by
lower-casing a span and restoring it against its own paragraph:

- spans where casing was restored: **1,796**
- letters raised to a capital: **3,247**
- changes that were anything other than a letter raised to its own uppercase: **0**

It cannot invent a capital and cannot alter a word that is absent from the source, so there is no
behaviour to gate. Same standard as A_88's splitter fix.

### The regression this nearly shipped

The first cut passed the matched span **plus** the paragraph as the casing source. That moved the
paragraph's sentence-initial capital into a mid-sentence position, so the helper learned "The" and
capitalised every later "the" — *"Fresh rain rattled The casement"*. **Three existing tests failed
and caught it.** The source is now the paragraph alone, which is sufficient because the matched span
is already a substring of it. Pinned by a regression test named for the failure.

This is the third time in three sessions that the fix's own first cut carried the defect it was
fixing — A_88 put a literal backspace into two regexes while repairing literal backspaces, and A_87's
harness disabled the arbitration it was measuring. **The pattern is that the fix is written in the
same idiom as the bug.** The defence is not care; it is a known-positive and an existing suite.

### D1 is flag-gated because it is a content change, not a repair

It adds ~1,084 characters per book to every prose prompt, and 70% of the prose bill is the prompt.
The A_81 defect the cap was built for — a label restating its own history — is still caught: the
restatement check now scans the whole history rather than its first 40 characters, and suppresses
**45 of 577** pairs. OFF is byte-identical.

**Probe:** the reveal chapter should carry a specific grievance between culprit and victim — a threat,
a blocked promotion, a humiliation — rather than a generic ambition, and the next read's
`character life` note should stop asking for history. **Falsifier:** the model recites the
relationship sentence verbatim as narration, which would make it an injector by another route.


---

## 10. BUILD LOG — B3 and A1 (2026-09-12)

| item | state | flag | measured effect |
|---|---|---|---|
| **B3** one culprit-naming chapter, never the aftermath one | **BUILT** | inside `AGENT9_SCENE_REF_ARBITRATION` | reveal-on-aftermath **31/45 → 0**; exactly-one naming chapter **3/45 → 30/45** |
| **A1** temporal closure telemetry | **BUILT** | `AGENT3_TEMPORAL_CLOSURE` (OFF) | decides 3 of 49 cases; **46 undecidable, which is the finding** |

### B3 — the fix went inside the flag that caused it

No new flag. A_87's arbitration created the universal collision, so the correction lives in the same
lever and OFF stays byte-identical. Both sides of the question now defer to one exported predicate,
`isAftermathFinalScene`, so the obligation block and the stage mode cannot disagree — and the
reconciler (`scene-ref-reconcile.ts`, which WRITES coordinates) defers to it too.

**The metric had to be corrected first.** Counting reveal contracts, B3 looked catastrophic: assignment
fell from 45/45 to 12/45. But the DT contract's required beats already include *"(5) culprit named and
case sealed"*, so in a Golden-Age arc the `final_trap` chapter IS the naming chapter and a missing
*separate* reveal contract is correct, not lost. On the right metric — chapters carrying a culprit-
NAMING mandate, either contract — the picture inverts:

| | flag OFF | flag ON |
|---|---|---|
| exactly one naming chapter | **3/45** | **30/45** |
| none | 0 | 0 |
| more than one | 42 | 15 |
| reveal on the aftermath chapter | **31/45** | **0** |

**Residual, measured and not fixed here:** 15 of 45 still carry more than one naming mandate, because
the DT contract's beat (5) duplicates a separate reveal chapter. That belongs to §7 item 5.

Two A_87 tests failed on this change and both were right to: P5's assertion encoded the old behaviour,
and P7's "the reconciler and the classifier agree" test caught them diverging the moment only one side
was fixed — the WF-002 hazard it was written for, doing its job.

### A1 — the first design was wrong and the measurement said so

The first cut asserted that the apparent/actual GAP must fit inside the longest interval the case
states. MEASURED: **46 of 49 cases (94%) "failed"** — a wrong invariant, not a broken corpus. A
tampered clock's OFFSET and the DURATION of a pause are different quantities and nothing requires one
to cover the other; run 88651 is simply the case where they coincide, because its mechanism is "move
during the silence". Shipping that would have been a check that cries wolf on 94% of runs, which is
B1's off-switch-with-extra-steps in its most expensive form.

The corrected rule returns a verdict ONLY where the case NAMES an opportunity window:

| over 58 archived cases | |
|---|---|
| checkable (both times parse) | 49 |
| **proves a violation** | **3** — including run 88651, `murder_window_interval` = 10m against a 15m gap |
| closes | 0 |
| **not determinable** | **46 — the case names no opportunity window** |

**The 46 is the deliverable.** There is no canonical field for the window in which the culprit could
act, so the one arithmetic fact a fair-play mystery rests on has never been checkable. A1 makes that
absence countable; A2 is what fixes it.

The module reuses the project's `parseClockTime` and `parseDurationMinutes` rather than writing new
ones — the first draft had two fresh parsers, which is precisely the fork A_73 §11.3 and A_88 both
recorded.


---

## 11. BUILD LOG — B1/B2 and A2 (2026-09-12)

| item | state | flag | measured effect |
|---|---|---|---|
| **B1** one owning chapter per clue | **BUILT** | `AGENT9_CLUE_OWNERSHIP` (OFF) | obligations per book **30.5 -> 24.4**; heaviest chapter **18 -> 9** |
| **B2** obligation load counted | **BUILT** | none (rides the Agent 7 telemetry) | 7 of 45 books carry an over-budget chapter |
| **A2** derived case timeline | **BUILT** | `AGENT3_CASE_TIMELINE` (OFF) | one object with provenance; names what is missing |
| **A2** ask for the window | **BUILT** | `AGENT3_OPPORTUNITY_WINDOW` (OFF) | closes A1's loop: 88651 goes `not-determinable` -> `does-not-close` |

### B1 — the clue is still accepted, only the ASK changes

A clue is dramatized in the chapter that owns it — the first scene requiring it — and later chapters
receive `ALREADY ON THE PAGE — refer, do NOT re-stage`, naming its key terms and the chapter it first
appeared in. Across the 45 archived outlines that takes the mean from 30.5 obligations per book to
24.4 and the heaviest single chapter from **18 to 9**, which is "the proof becomes a speech" at source.

`getRequiredClueIdsForScene` is untouched, so **validation still accepts the clue in the later
chapter**. Narrowing what we ASK for is a different thing from narrowing what we ACCEPT, and
conflating the two is exactly how a formatting rule became a content filter in D1. A test pins it.

### B2 — counted, not capped

Dropping an obligation drops a clue, and fair play is the one thing the pipeline may not trade away.
So B2 counts: total, distinct, re-mandate rate, heaviest chapter, and any chapter over a budget of 8,
reported once per run beside the A_87 scene-ref line.

**An honest discrepancy, stated rather than smoothed:** measured from the stored artifacts the median
re-mandate rate is **14%**, against **41%** measured from the live prompt log. Both are real and they
measure different stages — Agent 7's gap-fill and threshold-fill passes add obligations after the
artifact is written. The heaviest-chapter figure is the half that transfers, and chapter 6 is the
heaviest in book after book (13, 11, 15 in the first three archived outlines; 14 in run 88651).

### A2 — the missing number, and why it is not invented

A1 measured the blocker: **46 of 49 checkable cases name no opportunity window**, so the arithmetic
cannot be validated. A2 does two things.

`deriveCaseTimeline` exposes one object — gap, window, intervals, verdict — with **provenance on every
number** (`stated` / `absent`) and a plain list of what is missing. It **does not infer a missing
window from the gap**: that would make `gap <= window` tautologically true and convert a missing fact
into a passing one, which is the opposite of what A1's 46 undecidable cases are for.

`AGENT3_OPPORTUNITY_WINDOW` adds `constraint_space.time.opportunity_window` to Agent 3's skeleton,
with the instruction that it must be at least the gap between the two times. The schema declares it
**optional**, so no archived case fails validation and no run can abort on it, and OFF is
byte-identical (74,404 bytes before and after; ON adds 311).

**The loop closes.** With the window declared, run 88651's own case moves from `not-determinable` to
`does-not-close` — gap 15 minutes against a 10-minute window, which is precisely what its reader
worked out by hand and marked `clues` 5/10 for.

### Section 7 status

| # | fix | state |
|---|---|---|
| 1 | C1 casing restore | **done**, unconditional |
| 2 | D1 relationship as content | **done**, `AGENT9_RELATIONSHIP_CONTENT` |
| 3 | B3 contract exclusivity | **done**, inside `AGENT9_SCENE_REF_ARBITRATION` |
| 4 | A1 temporal closure | **done**, `AGENT3_TEMPORAL_CLOSURE` |
| 5 | B1/B2 ownership + budget | **done**, `AGENT9_CLUE_OWNERSHIP` |
| 6 | A2 derived timeline | **done**, `AGENT3_CASE_TIMELINE` + `AGENT3_OPPORTUNITY_WINDOW` |
| 7 | C2 register density in the run report | **not built** |

Open, measured, and deliberately left: **15 of 45 books still carry two culprit-naming mandates**,
because the DT contract's beat (5) duplicates a separate reveal chapter (section 10). And every flag
above is OFF — the fixes exist but only `AGENT9_SCENE_REF_ARBITRATION` is live, so the next run
measures one lever unless that is changed deliberately.

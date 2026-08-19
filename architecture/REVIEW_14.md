# Architecture Review 14 — the path to 90, after a day spent auditing the instruments

**Written:** 2026-08-19 · **Type:** where the remaining marks actually live, and why the last three
reviews were looking in the wrong place.
Extends [REVIEW_13](REVIEW_13.md), whose arithmetic stands unchanged and whose §2.3 this document
partly answers. [REVIEW_05](REVIEW_05.md) remains the tracker; [REVIEW_12](REVIEW_12.md) holds the
retry diagnosis.

REVIEW_13 was written on the morning of 2026-08-19 and asked the right question — *what is 90 made
of* — while assuming the pipeline does what its code says. Nine hours of auditing that assumption
found five defects. **None of them was the model writing badly. All five were the pipeline instructing
it badly, or measuring it wrongly.**

> **Of the 23 instruction blocks that compose the Agent 9 prompt, craft is 12.6% and reference is
> 48.4% — and craft is the first thing dropped when the budget binds. Ten of the 23 block names have
> never appeared in any review document.**
>
> **The three categories REVIEW_13 called unreachable are craft categories. The prompt spends nearly
> four times more on telling the model what is TRUE than on telling it how to write well.**

---

## 1. What one day of auditing found

| # | defect | class | found by |
|---|---|---|---|
| X61 | `parseClockTime` could not read the case's own `actual_time_of_death`, so X38 stayed silent on a device 89 minutes out | **blind instrument** | running the parser |
| X62 | a trailing `\b` neuters a stem: the elimination list could not match "eliminating", the evidence list could not match "alibis". The closure floor false-fired on **17 of 32** outlines | **blind instrument** | corpus sweep |
| X32 | the closure check is a floor with no ceiling — three clearance scenes satisfy it exactly as one does | **missing instrument** | reading the check |
| — | `AGENT9_FOLD_SUSPECT_CLEARANCES` hung off that floor, so it was unreachable whenever the defect was present. Emitted **zero** times, ever | **unreachable repair** | prompt-log grep |
| X63 | the per-act behaviour contract was role-blind: the detective was told to show a behavioural tell, the victim got a live three-act contract, Act III was byte-identical for everyone | **degenerate contract** | the owner, reading an outline |

**The pattern is the finding.** Not one of these is *"the model produced weak prose"*. Four are
instruments that could not see what they were built to see, and the fifth is an instruction that told
the model the wrong thing.

X62 is the sharpest, because it inverts the usual direction of harm: a wordlist that could not read
the outline was **manufacturing** the duplicate clearances three external reads complained about. Its
false alarm drives a repair patch that appends clearance language to an Act 3 scene. The instrument
built to detect the defect was a cause of it.

---

## 2. The arithmetic, unchanged

[REVIEW_13 §1](REVIEW_13.md) stands and is not re-derived here:

```
best-ever mark in each of the ten categories, summed      84
observed offset across the seven reads scoring 80+    +2..+6   (mean +3.0, n=7)
best-ever-everywhere therefore projects to                87
```

**90 still requires two to three category marks that no read has ever given.** Nothing found this week
changes that. What changes is the argument about *where those marks could come from.*

---

## 3. The reframe — a degenerate contract produces no complaint

REVIEW_13 §2 split the ten categories by **what the reader named**, and concluded that the three with
no complaint — opening hook, character clarity, atmosphere — have no lever:

> *"No detector can move a category whose reader has nothing to report."*

**That is true, and it is still true about detectors.** The hidden assumption is the second half: that
a category with no complaint is a category already doing as well as the pipeline can make it do. X63
is the counter-example.

A reader met six characters whose only per-character behavioural instruction was **identical for all
of them in Act III** — on that run and every run before it, because the branch read nothing from the
profile at all. The detective was told she *"may show unease, evasion, or mild defensiveness when
questioned"*. The victim, dead since scene 1, was handed a contract ending in *"confrontation,
confession, or vindication"*.

No reader would file that as a complaint. There is nothing to complain **about**: no error, no
contradiction, no missing element. The reader writes *"Investigator, victim, culprit and false
suspects are stable"* and gives it an 8 — which is precisely what happened, twice.

> **A defect that produces an ERROR gets named by the reader and becomes a tracker row. A defect that
> produces FLATNESS gets a positive sentence and an 8. The second kind is invisible to every
> instrument this project has built — including the external read, which is why §2.3 mistook silence
> for a ceiling.**

That is the class §2.3's three categories live in, and it is reachable. Not by detectors, which
REVIEW_13 correctly ruled out, but by reading the contracts.

---

## 4. What the prose prompt is actually made of

Measured from the 08-19 run's own `promptFingerprints.section_sizes`, averaged across all ten chapters
(`logs/agent9-checkpoint-mystery-1787090659145.json`). Mean prompt: **68,509 characters**.

| group | share | blocks (% of prompt) |
|---|---:|---|
| **REFERENCE** — what is true, what exists | **48.4%** | world_document 18.6 · temporal_context 9.9 · location_profiles 7.3 · narrative_state 5.2 · continuity_context 2.6 · scene_grounding 2.6 · clue_descriptions 2.2 |
| **COMPLIANCE** — what must not go wrong | **20.0%** | fair_play 5.2 · pronoun_accuracy 4.9 · discriminating_test 4.4 · locked_facts 2.4 · character_consistency 1.4 · physical_plausibility 1.2 · era_authenticity 0.5 |
| **CHARACTER** — who these people are | **17.1%** | character_contracts 7.7 · first_appearance 5.5 · character_personality 2.5 · character_pressure 1.4 |
| **CRAFT** — how to write it well | **12.6%** | humour_guide 4.5 · craft_guide 3.6 · judged_on 3.0 · texture_pool 1.5 |
| **FEEDBACK** | 1.8% | provisional_scoring_feedback |

*`first_appearance_contracts` is counted as CHARACTER because its content is per-character. Counting it
as COMPLIANCE moves 5.5 points between those two rows and changes nothing below.*

**The single largest block is `world_document` at 18.6% — half again the entire craft budget.**

And craft is not merely the smallest slice. [REVIEW_12 §2](REVIEW_12.md) established that when the
prompt budget binds, **the craft blocks are what get deleted** — which is why X47 exists at all. So the
smallest allocation is also the first to be dropped, in exactly the late chapters where the reader's
prose and pacing complaints land.

> **Ten categories are scored. Four of them — opening hook, dialogue, atmosphere, prose/polish — are
> almost purely craft. The prompt spends 12.6% of itself on them, and sheds that first.**

This is a correlation and is offered as one. It is also the only structural account anyone has given
of why four categories sit at 8 while the four that detectors serve reach 9.

---

## 5. The coverage gap

Of the 23 block names, **ten have never appeared in any REVIEW document**:

```
first_appearance_contracts  5.5%      scene_grounding             2.6%
narrative_state             5.2%      clue_descriptions           2.2%
fair_play_contract          5.2%      provisional_scoring_feedback 1.8%
pronoun_accuracy            4.9%      character_consistency       1.4%
locked_facts                2.4%      character_pressure_contract 1.4%
                                      ─────────────────────────────────
                                      32.6% of the prompt, by name
```

**This is a coverage signal, not proof of neglect,** and `locked_facts` is the caveat that proves it:
its *content* has been audited exhaustively under X38, X39 and X51. It has simply never been discussed
as a prompt block. Some of the other nine may be in the same position.

The reason to take it seriously anyway: **X63 was found in `character_contracts`, one of the four
best-covered blocks on the list**, and it had been wrong since the day it was written. The hit rate on
the first block anyone opened and read line by line was 1 for 1.

---

## 6. The path to 90

Ordered by return per unit of cost, and explicit about which steps are speculative.

```
 1  READ THE CURRENT BUILD                                   a reader, no compute
    Still the cheapest item on any board. Nothing built since 08-17 has an
    external number, and five defects have landed since REVIEW_13 was written
    this morning. Everything below is speculation until this exists.

 2  THE CONTRACT AUDIT                                       free
    Open each of the 23 blocks and read what it actually says to the model,
    the way X63 was read. Not "does this have a detector" but "is what it says
    true, role-aware, and worth its share of 68,509 characters of attention".
    Start with the ten never named, and with the four craft blocks.

 3  THE CRAFT RATIO                                          free to measure
    12.6%, shed first under budget, against four craft-scored categories.
    Settle X47 (REVIEW_13 §5 decision 2) on evidence rather than leaving it
    OFF, and decide whether the ratio itself is the structural cap.

 4  X38-AT-SOURCE                                            paid ~£1.5
    The free half shipped as X61. The paid half — authoring a device whose
    arithmetic is right in the first place — is unchanged, and still the one
    triple-confirmed defect with a category attached (clues 8→9).

 5  M6 RE-READ                                               paid ~£1.5
    After X47 is settled. Still the only lever ever aimed at the flat three,
    and still with one budget-truncated run to its name.
```

**Steps 2 and 3 are new to this document, and they are the two that could plausibly reach §2.3.**
Steps 1, 4 and 5 are REVIEW_13's items 4, 3 and 5 — unchanged, and still correct.

---

## 7. What is not the path

Restating [REVIEW_13 §5](REVIEW_13.md), plus one entry this week earned:

- **More detectors on plot, clues and endings.** §2.1 is a reliability problem, not a detection one.
- **R6.** It measures the internal judge, not the book.
- **Any single read of any story, as evidence of anything.**
- **NEW — offering a flag as a decision without checking that its trigger can fire.**
  `AGENT9_FOLD_SUSPECT_CLEARANCES` sat default-OFF for 26 days as the top-listed decision on two
  consecutive boards. It was dead code: its guardrail hung off the *absence* of clearances, so it was
  unreachable in every case it addressed, and its text appears **zero** times in the entire prompt
  log. A paid A/B would have returned a null result reading as *"the fix does not work"* — a false
  certification of the class [§10.1](REVIEW_05.md) exists to prevent. **Before a flag is offered as a
  decision, grep the prompt log for its output.**

---

## 8. What would falsify this document

- **§3 is wrong if** an external read of a build carrying X63 reports character clarity unchanged at 8
  **and** names no new character complaint. That would mean the degenerate contract cost nothing, and
  that flatness is the model's ceiling rather than the prompt's.
- **§4 is wrong if** craft share does not track the craft-scored categories — most directly, if X47's
  floor is switched on, craft share rises in the late chapters, and prose and pacing do not move.
  [REVIEW_12 §2](REVIEW_12.md)'s first evidence is already against X47, so this is live and cheap.
- **§5's coverage argument is wrong if** a systematic read of the ten unnamed blocks returns nothing.
  n=1 is not a hit rate; it is one hit.
- **§6's ordering is wrong if** step 1 returns a read naming a specific, repairable defect in the
  volatile four. Then §2.1 reliability work outranks the contract audit again and this document
  collapses back into REVIEW_13.
- **What this document does not claim:** that the contract audit yields marks; that 90 is reachable
  with the current generation model; or that the craft ratio is causal rather than correlated. It
  claims only that the contracts have never been read, that reading one of them found a defect that
  had been there since it was written, and that the categories they feed are the ones nothing else in
  this project can reach.

---

## 9. Step 1 executed — the internal read of `story_20260819-0147`

**This is NOT the external read.** It cannot be: it was performed with the whole board, every defect
and the arithmetic already in context, which is the definition of a contaminated reader. No mark is
offered and none should be inferred. What follows is what a careful reader would MEET on the page,
which is a different and much cheaper thing than what a cold reader would SCORE.

### 9.1 Two injected sentences, each shipped twice, verbatim

```
"It had taken forty-five minutes in all."                                      ch1, ch2
"Length of the thin control wire from Rooftop Terrace to clock mechanism
 came to twenty-five feet."                                                    ch1, ch4
```

The second is a schema field wearing a full stop. These two sentences are the whole of the locked-fact
injector's contribution to this manuscript, and both are **by construction** — see §10.

Chapter 7 handles the same fact unaided and gets it right: *"the length of the thin control wire —
twenty-five feet, she recalled, exactly as measured earlier"*. **The model can write this sentence.
The injector overwrites it with a worse one.**

### 9.2 A flat contradiction about the central clue

| ch | text |
|---|---|
| 1 | *"each timepiece displayed a time that matched the clock's face, as if in some silent conspiracy to uphold the illusion"* |
| 3 | *"She checked her own wristwatch — its time did not match the clock's frozen hour. A quick survey of the guests' watches revealed the same: none displayed the same time as the grandfather clock."* |

Chapter 1 says every watch agrees with the clock. Chapter 3 says none does, and builds the whole
investigation on it. This is the mystery's hinge, and nothing reports it: the two statements share no
parseable clock value, so [X38](REVIEW_05.md)'s family cannot see them.

### 9.3 The locked value is corrupted twice

15 × *"a quarter to three"*, 1 × *"four to three"* (ch2), 1 × *"three to three"* (ch8). The
locked-fact consistency gate pins the string and is value-agnostic; two chapters state a different
hour for the same frozen hand and nothing objects.

### 9.4 One clue introduced and never withdrawn

Chapter 4 records *"a witness note referencing Sylvia Trent's presence near the clock at the relevant
time"*. Chapters 6, 9 and 10 all clear Sylvia on the grounds that she was **never near the lobby**.
The contradicting evidence is never addressed — a fair-play defect, not a prose one.

### 9.5 One measurement, three incompatible geometries

`twenty-five feet` is the wire's length (ch1, ch4), the distance across the lobby to the terrace door
(ch3 — *"some twenty-five feet away"*), and the terrace's height above the lobby (ch9 — *"twenty-five
feet above"*). A single locked scalar, reused as three different dimensions.

**None of §9.2–9.5 is a craft defect.** They belong to plot, clues and fair play — §2.1's volatile
four — and they are the reliability class REVIEW_13 said detectors already serve. They are listed here
because nobody had read the manuscript against its own case file.

---

## 10. Step 2 begun — the contract audit, and an arms race lost a third time

The method: open a block, read what it puts in front of the model, and ask whether that is true,
role-aware, and worth its share of the prompt. The first block opened was `locked_facts` — one of the
ten never named — together with the post-processing that enforces it.

### 10.1 A rotation that could not rotate

`enforceLockedFactValuePresence` injects a locked fact into any chapter that omits it. Its comment is
unusually candid: A_47 renamed the template to dodge that era's detectors, the next era re-listed the
new phrase, and one fixed string became the campaign's most frequent cap at **21 verbatim
occurrences**. A_62 declared the arms race over by replacing the fixed string with a rotation
*"selected deterministically from the VALUE"*.

**A locked fact's value is invariant across the manuscript. That is what makes it locked.** So the
seed never changes, the same variant is chosen every time, and `MAX_INJECTIONS_PER_FACT = 2` delivers
exactly two identical sentences. The fix changed the string and not the behaviour.

The regression test pinned *"different VALUES select different variants"* — true, and irrelevant,
because one manuscript has one value per fact. **The test asserted the axis that does not vary within
a run.**

### 10.2 A schema label used as a sentence subject

The `length` and `weight` variants used the fact's `description` as their grammatical subject.
Descriptions are schema labels — *"Length of the thin control wire from rooftop terrace to clock
mechanism"* — so the output is a database row. The non-membership test missed it because its fixtures
(*"the corridor"*, *"the drop"*) are already noun phrases. **The test data was tidier than production.**

### 10.3 Fixed — X64 and X65

The variant is now chosen by the OCCURRENCE ORDINAL, so the second injection of a fact is *provably*
different from the first rather than a coin flip; the value still selects the starting variant, so
A_62's reproducibility contract holds intact. And a measurement subject is derived from the label by
stripping the measurement head and the prepositional tail:

```
BEFORE   Length of the thin control wire from Rooftop Terrace to clock mechanism came to twenty-five feet.   (x2)
         It had taken forty-five minutes in all.                                                             (x2)

AFTER    The thin control wire came to twenty-five feet.        |  It had taken forty-five minutes in all.
         Measured out, it ran to twenty-five feet.              |  Forty-five minutes had passed before it was done.
```

**One block audited, two defects, both shipped on the page, both invisible to their own tests.** That
is two hits from the first block opened. Twenty-two remain, and the method is now known to work.

---

## 11. Step 3 settled — the craft ratio, and X47

### 11.1 The decision: the craft floor goes ON

REVIEW_13 §5 held `AGENT9_PROMPT_BUDGET_CRAFT_FLOOR` OFF because *"first evidence is against it"* —
retries rose to 11 on the single run with the floor ON. Three things are wrong with leaving it there:

1. **It is n=1**, and this project's own canary rule refuses single-run conclusions about retries.
   REVIEW_12 §2 was careful enough to WITHDRAW its hypothesis on exactly this evidence; REVIEW_13 then
   hardened the same evidence into a reason to do nothing.
2. **REVIEW_12 §3 located the retry cause elsewhere** — the case's own vocabulary colliding with
   validator wordlists. Prompt size was not it.
3. **What the floor protects is the 12.6%** that maps to the four categories stuck at 8.

The measured cost is real and small: ch9 ships 35,069 tokens rather than overshooting the old ceiling
by 15%. **Set to `true`, with the reasoning recorded in `.env.local` beside it.**

### 11.2 The ratio is not the cap — the CEILING is

`AGENT9_PROMPT_TOKEN_CEILING` defaults to **24,000**. Agent 9 runs on **gpt-4.1**, whose context window
is a million tokens. The ceiling is self-imposed by three orders of magnitude, and its own comment
gives the reason:

> *"Lowering this engages the designed priority-based block dropping … which both reduces
> retry-inducing over-constraint and cost."*

**That is precisely the hypothesis REVIEW_12 §2 tested and withdrew.** More context did not produce
fewer retries, and less context is not why the back chapters fail. So the pipeline is deleting
instructions, in the chapters that retry most, to satisfy a limit imposed for a reason that no longer
holds.

**12.6% is not a design decision anyone made — it is what survived.** The craft floor is a triage rule
for a scarcity that need not exist; raising the ceiling removes the triage altogether.

It is deliberately NOT raised in the same change. One lever per run is the rule N6 and X9 exist to
protect, so `AGENT9_PROMPT_TOKEN_CEILING=40000` sits commented in `.env.local` as the next experiment
rather than as a ride-along on this one.

### 11.3 What this predicts, and how it fails

If §4's argument is right, the floor — and then the raised ceiling — should move prose, dialogue,
atmosphere or hook. **If a read with craft blocks present in every chapter returns the same four 8s,
§4 is wrong:** the craft ratio is a correlation with no causal content, and the flat three are the
model's ceiling rather than the prompt's.

That is a cheap and decisive experiment, and it is now the one worth running.

---

## 12. The run — `mystery-1787167692140`, 2026-08-19 20:47

One run, executed after §9–§11 landed. It is **not** the read: no external reader has seen the output,
and the case is a different one (victim `Dr. Mallory Finch`, culprit `Captain Ivor Hale`, a chime-delay
device), so nothing here compares manuscript to manuscript. What a run CAN settle is whether the
changes reached the pipeline and whether the mechanisms behaved. It settled that, and it found three
things reading could not.

### 12.1 What landed

| change | verdict | evidence |
|---|---|---|
| **X47** craft floor | **LANDED** | craft content present in all 4 ch9/ch10 prose calls; on 08-17 it died at ch8 |
| **X63** role-aware contract | **LANDED** | the bundle gives the detective *"evasion is NOT … is not a suspect"*, the victim `DECEASED` in all three acts, and the four suspects one shared contract with their own motives |
| **X62** wordlist | **LANDED** | the closure FLOOR did not fire; the outline's clearance language was read correctly |
| **X32** ceiling | **correctly silent** | the outline gave no more than one scene a clearance job, so there was nothing to report |
| **X65** schema label | **partly** | no `"Length of …"` label reached the page — but see §12.2 |
| **X64** injection variance | **FAILED** | see §12.2 |
| **X61** device arithmetic | **FAILED** | see §12.3 |

Two of eight failed, and both failures were invisible to 2,337 passing tests.

### 12.2 Two fixes that were wrong, one of them in the way it was written

**The seed never reached the call site.** The substitution meant to pass the occurrence ordinal into
`INJECTION_TEMPLATES` was applied **without an assertion, and silently no-opped**. Every injection
still asked for occurrence 0, so the manuscript shipped

```
"It had taken twenty minutes in all."      x2, verbatim
```

— the identical defect X64 was written to remove. The fix was correct; it simply was not in the
program. Every other edit that day was guarded by an assert that would have failed loudly. This one
was not, and no test could catch it because the templates themselves were right.

**A distance is not its endpoint.** `measurementSubject` reduced *"Distance FROM the lobby grandfather
clock TO the dining hall wall clock"* to *"The lobby grandfather clock"*, and the run shipped

```
"The lobby grandfather clock came to forty feet."      x2
```

which is no longer a schema label and is now **grammatical and false**: a clock is not forty feet long.
X65 removed one defect by introducing another — this tracker's own recurring pattern, committed by the
fix for that pattern.

Both are fixed, with the real descriptions from both runs pinned as fixtures rather than the tidy
inventions that let the original defect through.

### 12.3 X38 is wrong for the fourth consecutive run, and the parser still cannot see it

```
apparent_time_of_death   "a quarter to eight"     7:45
actual_time_of_death     "seven twenty"           7:20      ← parseClockTime returns NULL
chime_delay_duration     "twenty minutes"           20

7:45 − 7:20 = 25.  The device declares 20.
```

X61 taught this parser to read *"fourteen minutes past four"*. The very next case wrote its true time
as *"seven twenty"* — the spoken HOUR-MINUTES form, with no *past* or *to* to key on — and the parser
returned null again, so X38 said nothing.

**Four consecutive runs, four wrong devices, three distinct surface forms the parser could not read:**

```
08-15   7:15 / 7:05 / "fourteen minutes"          10 vs 14
08-17   2:45 / 2:20 / "twenty minutes"            25 vs 20
08-19a  2:45 / "fourteen minutes past four"       89 vs 45     ← unparseable
08-19b  7:45 / "seven twenty"                     25 vs 20     ← unparseable
```

Fixed as X67, with the branch accepted only as a whole segment because two bare number words are
ordinary prose. Verified against the real case: X38 now fires with *"25 minutes apart … declares
twenty minutes"*.

**What this actually says.** [REVIEW_13 §3](REVIEW_13.md) called X38 *"intermittent"*. It is not
intermittent and it is not one bug: **the case generator authors a device whose arithmetic does not
work, reliably, and each time it says so in a slightly different English.** Patching the parser once
per surface form is a losing game — the same losing game §10.1 documented for the injector. The
durable answer is X38-at-source (§6 item 4), which is still the paid item it always was, and is now
the best-evidenced item on the board.

### 12.4 What the run does not say

The rubric scored it 76 in shadow, which is not a category table and not a cold read. Retries were
2/10 batches — low against REVIEW_12's 0.50/chapter baseline — but this is one run of a different
case with seven changes in it, and [REVIEW_12 §2](REVIEW_12.md) is the standing proof that single-run
retry counts mislead. **No quality claim is made or available.** The craft floor's prediction in §11.3
remains untested, because testing it requires a reader.

### 12.5 The lesson worth keeping

Six changes were built by reading, and 2,337 tests passed. **One run found that two of them were
wrong and a third was insufficient.** The tests could not: they asserted the behaviour of functions
that were correct, in a program that was not calling them, against fixtures tidier than the data.

This is §1's pattern applied to this document's own work. The instruments were the defect there too.

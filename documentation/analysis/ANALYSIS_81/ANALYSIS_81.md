# ANALYSIS_81 — the verification debt

**What has been built and not proven, what the test for each one is, and what it costs.**

Written 2026-09-01, after a session that shipped A_79 (corpus integration, five phases) and A_80
(fifteen defect fixes). Companion to both. This document exists because those two produced a large
amount of code and a small amount of evidence, and the gap between them is now the main risk on the
project.

---

## §0 Why this document exists

A_80 §17 records the failure this is written to prevent. Five deterministic criteria were fixed in
advance, a paid run passed all five, and the external reader's complaint was unchanged — because the
criteria measured a *presence* property while the reader was marking a *consistency* property. The
work was verified against the wrong thing, confidently.

So the question "is X tested?" is not answerable yes/no on this project. It needs a tier.

---

## §1 The four tiers of evidence

Every claim in §3 is placed on this ladder. **The tiers do not substitute for each other**, and that
is the single most expensive lesson of the last two days.

| Tier | What it proves | Cost | How often it has misled us |
| --- | --- | --- | --- |
| **T1 unit** | the function does what its fixture says | £0 | often — a fixture pins a wording, not a property (A_80 §19.1) |
| **T2 archive** | the behaviour replays correctly against real stored run data | £0 | less often, but the population can be wrong (A_80 §15.7: 11 analysis docs counted as manuscripts) |
| **T3 live run** | the lever actually reaches a prompt and fires in a paid pipeline | **~£1.01** | this is where three "wired" flags were found to be no-ops (A_79 §14) |
| **T4 external read** | a reader's named complaint is gone | ~£1.01 + a read | the only tier that has ever changed our mind about quality |

**T1–T3 passing is not evidence of T4.** A_80 §16 passed all of T1–T3 and A_80 §17 is what T4 said.

Two standing constraints on T4, from A_76: a single external read carries **±3 marks**, and no judge
separates an 86 from an 81. So T4 evidence must be read as *named complaints eliminated*, never as a
score delta.

---

## §2 Where the app actually is

| | count |
| --- | --- |
| automated tests, seven packages | **2,891** passing |
| flags read by code / registered | 126 / 129, `flags:check` clean |
| corpus works, evidence-backed (`derived`) | **4** of 12 |
| corpus works, `derived_unverified` | 5 |
| corpus works demoted by the evidence gate | 3 |
| external reads ever taken of the current pipeline | **2** (74, 70) |
| spend to date this programme | £2.11 corpus encode + £3.23 runs = **£5.34** |

The last row against the second-to-last is the shape of the problem: 2,891 automated tests and
**two** reader opinions.

---

## §3 The register

Every item built and not proven, with the test that would raise its tier and what that costs.

### 3.1 Aimed at the categories currently scoring lowest

These are the items that matter. Each targets a category the reader marked down, and **none has faced
a pipeline**.

| # | Item | Claim | Tier now | The test | Cost |
| --- | --- | --- | --- | --- | --- |
| 1 | **Agent 3b arithmetic contract** | every clock time is placed on the shift, and a corrected alibi cannot precede the death | T1 | run once; read the locked-fact registry and check every clock fact is shift-consistent; then confirm `[A_80 F15]` emitted no inversion warning | £1.01 |
| 2 | **F15 coherence measure** | detects the incoherence that shipped on 09-01 | **T2** (fires on the archived registry) | same run: F15 must stay silent if item 1 worked, and fire if it did not — the two are each other's control | £0 with #1 |
| 3 | **Relationship history block** | `sharedHistory` reaches Agent 9 and shows in the prose | T1 | grep the run's prompt log for `sharedHistory` (must be > 0 — it was **0** on 09-01); then ask the reader whether characters have a shared past | £0 with #1, then T4 |
| 4 | **Page-shape operations** | five countable operations move the page toward canon | T1 | deterministic, and the strongest test on this list: run `calibration-measure.mjs` over the new manuscript and compare the five numbers to canon. Paragraphs opening on speech is the headline — **11.5% → target 59.7%** | £0 with #1 |
| 5 | **B5 floor rewrite** | the de-templating floor no longer writes a template | T1 (+ real predicate) | grep the manuscript for "allowed no other reading" (must be 0) and for the in-scene form | £0 with #1 |

### 3.2 Built, flag-gated OFF, never observed

| # | Flag | Claim | Tier | The test | Cost |
| --- | --- | --- | --- | --- | --- |
| 6 | `AGENT9_CLEARANCE_TRIM` | repairs `clearance_over_budget` — "the most frequent geometry code (74% of archived runs) and had no repair" | T1 | enable; confirm the code stops appearing in release-gate warnings and that ch10 no longer re-clears suspects | £0 with #1 |
| 7 | `AGENT9_GROUNDING_LEAD` | raises scene grounding, logged at **2/10 chapters** | T1 | enable; the grounding count in the release gate is the measure | £0 with #1 |
| 8 | `AGENT9_CULPRIT_INJECTION_IN_SCENE` | the injector writes the compliant form directly, so the B5 floor never has to fire | T1 | enable; the B5 ship-check should stop firing at all | £0 with #1 |
| 9 | `AGENT9_CLUE_TIME_WORDFORM` (F12) | unblinds the only hard abort | T1 (fixture) | **run with it ON and count aborts.** It has never fired in 44 runs and clue text is not persisted, so its reach is unmeasurable offline. High risk: it can fail a run | £1.01, and may lose the run |

### 3.3 A_79 corpus work — partly proven

| # | Item | Tier | Gap | Cost to close |
| --- | --- | --- | --- | --- |
| 10 | **A1** device patterns | **T3** — reached a prompt only after the interleave fix, never observed since | one run; confirm a corpus pattern is in the Agent 3b prompt | £0 with #1 |
| 11 | **B** worked exemplars | **T3 confirmed** (A_80 §14.1) | the open question is whether it pulls the generator *toward* the exemplar — needs N≥4 pairs on/off | **~£4**, and cannot be settled at n=1 |
| 12 | **C** cell scheduler | T3 shadow only | §10 forbids promoting past shadow until a negative control runs | £1.01 for the control |
| 13 | **D** anti-copy gate | **T3 confirmed** — 718,542 n-grams, 0 spans, twice | none. This one is done | £0 |
| 14 | **E** calibration corpus | T2 | it is a measurement, not a lever; item 4 is its first use | £0 with #1 |

### 3.4 Corpus data quality

| # | Item | State | Test | Cost |
| --- | --- | --- | --- | --- |
| 15 | 3 demoted works (Hound, Leavenworth, Yellow Room) | anchors below 60% | re-encode against the corrected prompt, then `corpus-verify.mjs` | **~£0.45** |
| 16 | 5 `derived_unverified` works | no anchor evidence on disk | re-run VERIFY only — no re-encode needed if the source texts are cached (they are) | £0 |
| 17 | `the_invisible_man` | no cached source text | re-fetch from PG 204, then verify | £0 |
| 18 | *The Moonstone* | capacity-blocked at 259k tokens | unresolved; needs a chunking decision A_77 §10.8 argued against | — |

### 3.5 Not built at all

| # | Gap | Category it costs | Why not built |
| --- | --- | --- | --- |
| 19 | **Role stability** | character clarity **5** | never diagnosed. The Eleanor/Mallory swap is most of the 4-mark fall between the two reads |
| 20 | **F7 reveal binding** | plot structure **6** | the detector's own two messages disagree about which chapter discloses (A_80 §5) |
| 21 | **F8 derive CML anchors** | wasted Agent 9 spend | would turn a 4/0/10/4/0/0 signal into an abort; needs measurement first |
| 22 | **F6 injector duplicates** | prose | mechanism could not be reproduced (A_80 §15.2); real at 9.3% of manuscripts |

---

## §4 The cheapest ordering

**Items 1–8, 10 and 14 all test in ONE run.** They touch different stages and their evidence is read
from different places in the same log. Bundling them costs £1.01 and closes ten open questions.

The bundle:

```
AGENT9_CLEARANCE_TRIM=true
AGENT9_GROUNDING_LEAD=true
AGENT9_CULPRIT_INJECTION_IN_SCENE=true
# plus what is already on
```

Leave `AGENT9_CLUE_TIME_WORDFORM` **off** — it can abort the run and would confound everything else.
Test it alone afterwards.

**Read the result in this order**, cheapest and most decisive first, all free:

1. `calibration-measure.mjs` on the new manuscript — the five page-shape numbers against canon. This
   is the only item on the whole register with a **quantitative target measured from real novels**.
2. locked-fact registry: is every clock time shift-consistent, and did F15 stay silent?
3. prompt log: does `sharedHistory` appear (it was 0), and is a corpus device pattern in Agent 3b?
4. manuscript grep: "allowed no other reading" must be absent.
5. release-gate warnings: has `clearance_over_budget` gone, and has grounding risen off 2/10?

Only then buy the external read, and score it against the reviewer's **named complaints**, not the
number.

---

## §5 What cannot be bought cheaply

- **Whether any of it makes a better book.** Two reads exist, ±3 each, on different cases. A real
  answer needs matched pairs at N≥4, which is ~£4 per arm and still cannot separate an 86 from an 81.
- **Whether the corpus exemplars cause monoculture** (item 11). Same problem: n=1 says nothing, and
  the frozen canary input already produces clock cases 44 times in 102.
- **The rubric as an instrument.** A_76: 0.4 correlation with the external read, and it read 75 on
  both a 74 and a 70. It is a health signal, not a score.

---

## §6 Standing costs, measured

| | cost |
| --- | --- |
| one full canary run | **£1.01** (49 calls; £0.98 on the prior run) |
| a run that aborts early | £0.03 |
| re-encoding one corpus work | £0.14–0.23 |
| corpus classification pass | £0.03 for all 12 |
| every deterministic baseline and probe in this document | **£0** |

The last line is the one to act on: of the 22 items above, **eleven can be advanced for nothing**, and
ten of those ride along on a single £1.01 run.

---

## §7 Traps any future test must respect

Established the hard way in the last two days; each cost real money or a wrong conclusion.

1. **A proxy that pins a wording cannot tell a rewrite from a regression** (A_80 §19.1). Assert the
   predicate, not the string.
2. **A check that has never fired must prove it can fire** (A_80 §6.3). Two guards that would have
   caught the headline defect were structurally dead and silent.
3. **Baseline a gate before wiring it.** The proposed 6-gram anti-copy index fired on 92.2% of our own
   manuscripts; the proposed 4:1 dominance threshold on 31%.
4. **A negative result from a new probe is a claim about the probe.** The `retry_term` "20% critical"
   finding was a contaminated population; the F15 rule's first version fired on 74%.
5. **Verify a lever by its agent label in the prompt log, not by grepping the module.** A1 loaded 9
   patterns and changed not one byte of any prompt.
6. **The pipeline's own telemetry is ahead of its enforcement.** Six of the ten A_80 defects were
   already in the run's warnings, and `hard_stop_count` was 0 on all three runs. Read the warnings
   before building a detector — it may already exist, and three times this session it did.

---

## §8 The bundle run — three pass, two were dead levers (2026-09-01)

Run `mystery-1788293825799`, **£1.09**, `warning`, shipped, rubric 71/100. Flags added:
`AGENT9_CLEARANCE_TRIM`, `AGENT9_GROUNDING_LEAD`, `AGENT9_CULPRIT_INJECTION_IN_SCENE`.
`AGENT9_CLUE_TIME_WORDFORM` deliberately left off.

Read in the §4 order, cheapest and most decisive first.

| # | Check | Result |
| --- | --- | --- |
| 1 | page-shape operations | **FAIL — dead lever** |
| 2 | locked-fact arithmetic + F15 | **PASS** |
| 3 | `sharedHistory` in the prompt | **FAIL — dead lever** |
| 4 | B5 template line | **PASS** |
| 5 | `clearance_over_budget`, scene grounding | **PASS** |

### 8.1 Check 2 — the case arithmetic closes, for the first time

```
clock_first_strike_time    "quarter past nine"      9:15
guest_watch_stopped_time   "ten minutes past nine"  9:10
clock_strike_delay         "five minutes"
```

9:15 − 5 = 9:10. **The pair is consistent**, F15 emitted **zero** warnings, and there is no third
unanchored time — which is precisely the defect that shipped on 09-01 and drew 4/10. The Agent 3b
arithmetic contract is the only item on this register that was aimed at the lowest-scoring category
and it did what it was built to do.

Not yet a mark: the rubric still capped `clues ≤ 6` for *"central clue stated as two flat values, not
one contradiction"*. The case is now coherent and the **prose states it flatly** — the next defect in
the same chain, and a different one from the collapse.

### 8.2 Checks 4 and 5 — the flags worked

- `allowed no other reading`: **0**. `beyond all reasonable doubt`: **0**. The B5 ship-check did not
  fire at all, so with `AGENT9_CULPRIT_INJECTION_IN_SCENE` on the injector never needed to write a
  verdict sentence. The line four external reads have quoted back is gone.
- `clearance_over_budget`: **0 occurrences**, against a firing on ch8 last run and "74% of archived
  runs" historically. The trim fired and folded two clearance scenes into one.
- `scene-grounding coverage below target`: **2 occurrences last run, 0 this run.**

Three flags, three effects, all first observations. All three had been sitting default-OFF.

### 8.3 Checks 1 and 3 — both new prompt blocks were dead levers

**Neither reached a prompt. `PAGE SHAPE` and `WHAT THESE PEOPLE ALREADY ARE` each appear ZERO times
in the entire prompt log** — not in this run, not in any run.

Check 1's numbers, measured on the manuscript against the immediately previous one:

| operation | canon | prev run | this run |
| --- | --- | --- | --- |
| paragraphs opening on speech % | 59.7 | 7.35 | 8.75 |
| semicolons / 1000 | 4.82 | 3.04 | 2.32 |
| em-dashes / 1000 | 6.52 | 0.11 | 0.09 |
| sentences over 30 words % | 10.37 | 6.35 | 5.27 |

Read alone, that is "the operations were ignored" — the VoiceSpec finding again. It is not. **The
instructions were never delivered**, and reporting the first reading without the log check would have
produced exactly the wrong conclusion: that this model ignores operations, when A_75 measured that it
follows them.

**Cause confirmed for check 3.** `buildCharacterPersonalityBlock` opens with
`if (library && deployedAssets) { … }` — the scoped asset-pool variant — and returns before reaching
the flat block my relationship section was appended to. In production the library is always present,
so the block cannot render. `CHARACTER PERSONALITIES` is likewise absent from every prompt, which
confirms the branch.

**Cause NOT identified for check 1.** The append is straight-line in `buildProsePrompt`, is present
in the compiled `dist`, and sits immediately after `appendGuideSource` — whose own output
(`THE FULL GUIDE THESE PRINCIPLES COME FROM`) **does** reach the prompt, as does the block above it
(`WHODUNNIT CRAFT GUIDELINES`). So the string is added to a variable whose earlier contents arrive
and whose later contents do not. No per-block truncation exists in the budget assembler and the
logger does not truncate (longest logged payload 173,625 chars). This is unresolved and is the first
thing to chase.

### 8.4 What this run bought

The three flags are settled: they work, they are cheap, and they should stay on. The arithmetic
contract is settled: the case closes. **And the two blocks that would have been reported as "shipped"
on the strength of their unit tests are dead levers** — which is the T1→T3 gap in §1, caught for
£1.09 rather than by an external reader.

That is the register working as intended. It is also the fourth time in this session that a lever
looked wired and was not (A_79 §14 was the first three), and the rule from §7 held again: **verify by
the agent label in the prompt log, never by the code.**

---

## §9 The external read of the bundle run — 79/100, and the categories moved exactly where the levers reached

`story_20260901-2136`, external read: **79/100**. The three reads of this pipeline, side by side:

| Category | 31 Aug | 1 Sep #1 | **1 Sep #2** | lever reached the prompt? |
| --- | --- | --- | --- | --- |
| Premise | 7 | 7 | **8** | yes — arithmetic contract |
| Opening hook | 7 | 7 | **8** | — |
| Plot structure | 7 | 6 | **8** | yes — clearance trim |
| Character clarity | 7 | 5 | **8** | — |
| Dialogue | 7 | 7 | 7 | **NO — page-shape dead** |
| Atmosphere | 8 | 8 | 8 | — |
| **Clues / evidence** | **4** | **4** | **6** | yes — arithmetic contract |
| Pacing | 7 | 7 | **8** | yes — clearance trim |
| **Ending / reveal** | **5** | **5** | **7** | yes — clearance trim, B5 |
| Prose / polish | 6 | 6 | 6 | **NO — page-shape dead** |
| Character life | 7 | 7 | 7 | **NO — relationship block dead** |
| **Overall** | 74 | 70 | **79** | |

### 9.1 The pattern is cleaner than the total

**Every category served by a lever that reached the prompt moved up. Every category served by a dead
lever stayed exactly flat.**

- clues **4 → 6** and ending **5 → 7** were the two outliers this whole investigation was about, and
  both moved for the first time across three reads.
- dialogue 7, prose 6 and character life 7 are unchanged — and they are precisely the three
  categories the page-shape operations and the relationship-history block were built to serve. §8.3
  established that neither reached a prompt.

That is as close to a natural experiment as this project has produced. It does not prove causation —
n=1, a different case each time, ±3 marks per read (A_76) — but the *pattern* is a stronger signal
than the total, and it is consistent in both directions at once.

### 9.2 The remaining clue-logic complaint is an INJECTOR defect, and it is precisely located

The reviewer's headline is that the chime time contradicts itself: *"Chapter 3 specifically says the
clock gave 'three strikes at a ten minutes past nine', which destroys the five-minute contradiction."*

The case is **correct** — §8.1 verified `clock_first_strike_time` 9:15, `guest_watch_stopped_time`
9:10, delay five minutes, F15 silent. The defect is downstream. MEASURED in the manuscript:

| | count |
| --- | --- |
| `quarter past nine` (the chime, correct) | 11 |
| `ten minutes past nine` (the watch) | 26 |
| **`strikes at a ten minutes past`** (the chime, WRONG value) | **5** |
| **`a ten minutes past nine`** — ungrammatical | **13** |

"a ten minutes past nine" is not English, and no model wrote it. It is a **template splice**: an
injection template of the form *"It was a {value} by the mantel clock"* with `{value}` =
"ten minutes past nine". Thirteen occurrences, five of them attached to the chime.

So `enforceLockedFactValuePresence` is **value-correct and context-blind**: it injects a locked value
into whatever paragraph it selects, with no model of which fact belongs to which event. The watch
value lands in sentences about the clock strike, and the five-minute contradiction the whole mystery
rests on is destroyed by the machinery meant to protect it.

This is the same family as A_80 F14 — *mentioning an event is not the same as timing it* — on the
injection side rather than the detection side. It is the next fix, it is free, and it is the last
thing standing between clues 6 and clues 8.

### 9.3 What else the reader named

- **Chapter 10 still recaps evidence.** The clearance trim removed the clearance roll-call; the
  evidence recap is a different beat and survives.
- **Repeated location template**: "Rockshore Hotel in St Ives Bay" appears **9 times**.
- **Relationship history still under-specific** — exactly as predicted, since the block never shipped.
- The reviewer's projection with the time wording fixed and chapter 10 made pure aftermath: **86–88**.

### 9.4 Status against the register

Of the twelve levers now confirmed live, four moved a category. Two dead levers held three categories
flat. The register's §1 claim — that T1 passing says nothing about T4 — is now demonstrated in both
directions in a single run: the fixes that reached the prompt were worth 5 marks, and the two that did
not were worth zero, despite passing every unit test.

---

## §10 Why the timing issues survived everything — the repair was writing them

The 79/100 read still marked clue logic **6/10**, for the chime time contradicting itself. §9.2
located it in the manuscript. This is the mechanism, reproduced from correct input with the built
function.

### 10.1 The rule

`repairWordFormLockedFacts` (`agent9-run.ts`) builds, for each locked time, a set of patterns matching
*wrong ways of writing that time* and rewrites them to the canonical form. One of them:

```js
// Phase 3: "quarter past [hour]" / "half past [hour]" as wrong substitutions when canonical differs
if (minute !== 15 && !/quarter\s+past/i.test(canonical)) {
  repairs.push({ pattern: /\bquarter\s+past\s+<hour>\b/gi, canonical });
}
```

Read on its own it is sound: if the case says 9:10 and the prose says "quarter past nine", the prose
is wrong.

### 10.2 Why it destroys a false-time mystery

**It assumes a case locks one time per hour.** A false-time mystery necessarily locks two in the same
hour, because the gap between them *is* the mechanism.

Run `mystery-1788293825799` locked `clock_first_strike_time` "quarter past nine" (9:15) and
`guest_watch_stopped_time` "ten minutes past nine" (9:10). The 9:10 fact therefore built
`/quarter past nine/gi → "ten minutes past nine"` — and rewrote **the other locked fact** wherever it
appeared:

> "three strikes at a **quarter** past nine" → "three strikes at a **ten minutes** past nine"

MEASURED in the shipped manuscript: `quarter past nine` 11, `ten minutes past nine` 26,
**`strikes at a ten minutes past` 5**, and the ungrammatical `a ten minutes past nine` **13 times**.
That stray article is the signature — no model writes "a ten minutes past nine"; it is what remains
when "quarter" is swapped out of "a quarter past nine".

### 10.3 What this explains

Every layer upstream was correct. Agent 3 built a coherent case, A_80 F15 passed it silently, the
Agent 3b contract held, and Agent 9 wrote the right times. **A deterministic repair then corrupted
the prose thirteen times, after validation.**

That is why the timing complaint survived three runs and every fix aimed at it: the fixes were all
upstream of the thing doing the damage. It is the same shape as A_80 §19.1, where the floor that
removes templates was writing one — **the machinery built to protect a property was the thing
breaking it** — and the third instance this session of a post-validation pass silently editing
shipped prose.

### 10.4 The fix

A repair may only correct a value **the case does not itself claim somewhere else**. The Phase 3
substitution patterns are now skipped when the phrase they would rewrite is another locked fact's
canonical value.

Both directions are pinned by
`apps/worker/src/__tests__/locked-fact-repair-collision-a81.test.ts`:

- two locked times in the same hour → the chime survives, both values remain, order-independent;
- one locked time → a genuine wrong substitution is **still repaired**, so the rule keeps its purpose.

732 worker tests green. Free. Untested in a live run — this is a T1 fix by §1's ladder, and the T3
check is a single grep of the next manuscript for `a ten minutes past` (expect 0).

---

## §12 The verification run — the dead lever now fires (2026-09-01)

Run `mystery-1788297847870`, **£0.91**, shipped, rubric 69. Two fixes under test: A_81 §10 (the
locked-fact repair collision) and §11 (the block appended after an early return).

| # | Check | Expected | Result |
| --- | --- | --- | --- |
| 1 | `a ten minutes past` in the manuscript | 0 (was 13) | **0** — but see 12.2 |
| 2 | the chime keeps its own time | no wrong-value strikes | n/a this case |
| 3 | `WHAT THESE PEOPLE ALREADY ARE` in the prompt log | > 0 (was 0 ever) | **26** |
| 4 | both locked times survive, F15 silent | yes | **yes** |

### 12.1 §11 is settled — the block reaches the prompt and carries real history

`WHAT THESE PEOPLE ALREADY ARE TO EACH OTHER` appears **26 times** in this run's prompt log, against
**zero across every run in the project's history**, and `sharedHistory` 68 times. What it delivered
was genuine pairwise past, not a label:

> *Captain Ivor Hale and Dr. Mallory Finch had a secret romantic affair, which Mallory threatened to
> expose.*

The lever is live. Whether a reader sees the difference is T4 and unanswered.

### 12.2 §10 is NOT settled — the case did not exercise it

The corruption signature is gone (`a ten minutes past` 0, was 13), but **this run's case had no
"quarter past" phrase at all**: it locked 9:10, 9:45 and 9:45 with a thirty-five-minute shift. The
Phase 3 collision needs a locked time at :15 or :30 alongside another in the same hour, and that did
not arise.

So check 1 passed vacuously. The fix is verified at T1 (five tests, both directions) and remains
**unverified at T3**. It will be exercised the first time a case locks a quarter- or half-past time
beside another in the same hour — which is common, but is not something this run can be credited with.

Recording it as "passed" without this note would be the A_80 §17 error again: a criterion that cannot
fail is not evidence.

### 12.3 The arithmetic holds, and the contradiction IS stated

`veranda_clock_time_seen` 9:10, `kitchen_clock_time_punched` 9:45, `clock_shift_interval` thirty-five
minutes. 9:45 − 35 = 9:10. F15 silent. Both values appear (17 and 31), and **nine sentences carry
both**, e.g.

> *"If the kitchen clock reads forty-five minutes past nine, and the veranda clock ten minutes past
> nine, then something has shifted."*

The internal rubric nonetheless capped `clues ≤ 6` for *"central clue stated as two flat values, not
one contradiction"*. On the evidence in the manuscript that cap looks wrong, and per A_76 the rubric
is a health signal with 0.4 correlation that read 75 on both a 74 and a 70. **It is not a verdict and
should not be chased.** Only a reader settles it.

### 12.4 One defect found in the new block, and fixed

The first delivery rendered:

> `(Captain Ivor Hale and Dr. Mallory Finch had a secret romantic affair, which Mallory threatened to
> expose., tension high)`

`relationship` is a LABEL slot and Agent 2 fills it with a sentence, so the label restated the history
it introduced and left a doubled full stop. The renderer now keeps the label only when it reads as one
— short, and not a restatement — and falls back to the tension alone. Verified across all three
shapes.

---

## §13 The external read — 82/100, and two of my own fixes are on the defect list

`story_20260901-2241` read at **82/100**. Four reads of this pipeline now exist:

| Category | 31 Aug | 1 Sep #1 | 1 Sep #2 | **1 Sep #3** |
| --- | --- | --- | --- | --- |
| Premise | 7 | 7 | 8 | 8 |
| Opening hook | 7 | 7 | 8 | **7** ↓ |
| Plot structure | 7 | 6 | 8 | 8 |
| Character clarity | 7 | 5 | 8 | 8 |
| Dialogue | 7 | 7 | 7 | 7 |
| Atmosphere | 8 | 8 | 8 | 8 |
| **Clues / evidence** | **4** | **4** | **6** | **7** ↑ |
| Pacing | 7 | 7 | 8 | 8 |
| Ending / reveal | 5 | 5 | 7 | 7 |
| Prose / polish | 6 | 6 | 6 | 6 |
| Character life | 7 | 7 | 7 | 7 |
| **Overall** | 74 | 70 | 79 | **82** |

**Clue logic has gone 4 → 4 → 6 → 7.** That is the category this whole investigation was about, and it
is the only one that has moved twice.

### 13.1 The relationship block fired and the mark did not move

§12.1 confirmed the block reached 26 prompts carrying real pairwise history — *"Captain Ivor Hale and
Dr. Mallory Finch had a secret romantic affair, which Mallory threatened to expose."*

**MEASURED: the word "affair" appears ZERO times in the manuscript.** Character life stayed at 7/10 and
the reviewer again asks for exactly this material.

So the lever is live and unused. The instruction asks the model to let a shared history *show without
being explained*, and nothing showed at all. That is a T4 negative for §11 despite a T3 pass, and it is
the honest result: **delivering material to a prompt is not the same as the model using it.** The next
version should ask for something countable — name a specific past event once per suspect — rather than
for an effect.

### 13.2 My B5 replacement is now on the reader's defect list

A_80 §19.1 replaced the templated verdict with `buildCulpritEvidenceSentenceInScene`, verified against
the internal predicate `culpritEvidenceLinkInText`. The reader's list of lines to delete:

> *"You did it. The words settled and nobody took them back."* — "That line reverts back into reveal
> mode and should be removed."

**Compliant with the internal predicate is not the same as invisible to a reader.** The old form was
quoted back four times; this one was quoted back on its first appearance. The injector is the problem,
not its wording — which is what `AGENT9_CULPRIT_INJECTION_IN_SCENE` and the retirement work were
always aiming at, and the right fix is for the model to name its culprit so no injection fires at all.

### 13.3 A new timing defect, and it is a direction error

> *"The veranda clock now runs fast — by exactly thirty-five minutes."*

MEASURED: `runs fast` 1, `slow` **0**. The veranda clock shows 9:10 when the true time is 9:45, so it
is thirty-five minutes **slow**. The case is coherent (§12.3) and the arithmetic is right; the prose
names the direction backwards.

This is a third distinct timing failure mode, after the collapse (A_80 §17) and the repair collision
(§10): **the value is right and the relation is inverted.** F15 checks that the gap equals the declared
interval; it does not check that the prose says which way. That is the next coherence rule and it is
free.

### 13.4 The location template is a standing defect across every run

| run | phrase | occurrences |
| --- | --- | --- |
| 1946 | — | — |
| 2136 | "Rockshore Hotel in St Ives Bay" | 4 |
| 2241 | "The Seaside Veranda Hotel in Dunrath Bay" | 3, plus "Hotel Reception Area in Dunrath Bay" ×5 |

The reviewer calls the repeated opening "especially damaging because it appears before the story has a
chance to earn the reader's trust", and opening hook fell 8 → 7 on it. Prose has been **6/10 in all
four reads** and this family is a large part of why.

### 13.5 Where that leaves it

The reviewer's projection with the fast/slow wording fixed, the confession tightened and the scaffold
lines removed: **87–89**.

Three of the four remaining named complaints are free and precisely located: the direction rule
(§13.3), the location template (§13.4), and the post-confession repetition. The fourth — making the
model *use* the relationship history (§13.1) — is a prompt-operation change of the kind A_75 showed
this model does follow, when it is asked for something countable.

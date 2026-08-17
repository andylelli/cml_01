# Architecture Review 09 — the machinery is finished; the instruments and the case are not

**Written:** 2026-08-15 · **Type:** what is left on the path to 90, from five external reads.
Supersedes [REVIEW_08](REVIEW_08.md)'s ordering. [REVIEW_05](REVIEW_05.md) remains the deep record.

> **Superseded 2026-08-17 by [REVIEW_10](REVIEW_10.md)**, which reorders the board by agent and corrects
> §1's arithmetic: the 86 run hit best-ever in **all ten** categories at once, so "hold the four at 9 and
> move dialogue and prose one mark each" describes a manuscript better than any read has produced. §1's
> table and §8/§9's build record stand as written.

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
| ~~X38/X39 → pre-prose~~ | ✅ **DONE (§8)** — `checkCaseTimeCoherence`, called at Agent 3b (the device's arithmetic) and Agent 7.5 (the two spines) | Both before Agent 9. The acceptance-side checks stay: they are the symptom, these are the cause |
| ~~X40~~ | ✅ **DONE (§8)** — four signatures, pinned both ways | *"The detective's understanding updated:"*, *"The revised meaning of the clues was clear:"*, lower-cased *"Dr mallory finch"* — all quoted by a reader, all `[]` from `detectScaffoldNotProse` |
| ~~X36~~ | ✅ **DONE (§8)** — `revealRegen` → `rewriteChannelRegen`, shared by both rewrite passes | **One line.** It takes the unpinned `geometryRegen`; only the reveal pass pins its own. It failed live on 08-15 for exactly that reason |
| ~~X41~~ | ✅ **DONE (§8)** — the case goes to the culprit before the admission | *"Hugo confesses, but the final proof is too abrupt"*. The evidence chain belongs in X35's instruction, before the admission |
| ~~X37~~ | ✅ **DONE (§8)** — names the class, and emits `not_measured` where the score belongs | X33 fixed the site that aborted; this one leaves a run with no internal number and nothing says so loudly |
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
FREE — the case, and the instruments        ✅ ALL FIVE DONE 2026-08-15 (§8)
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

**Steps 1–5 were free and small, and are done (§8).** Steps 6–8 are three runs, ~£4.50. R6 is the only large number, and it
is the one that decides whether any of this reached 90 or merely looks like it did.

---

## 7. The rule, restated because it got harder

**No quality claim from a single scoring** — and now, no comparison across premises either. The two
84s in §1 are different stories: one scores 0.8 dialogue tics per 100 lines and the other 6.0, and a
reader gave both a 7. Either the metric is wrong or the reader's mark is coarse, and **five reads of
five different stories cannot tell us which**.

Everything in §1's table is the best available estimate. It is not a measurement, and it will not be
one until R6.

---

## 8. The free block, as built (2026-08-15)

All five shipped the same evening REVIEW_09 was written. Each is small; together they close the gap
between "the pipeline detected it" and "the pipeline could have known before it spent the money".

**1. X38/X39 → pre-prose.** `checkCaseTimeCoherence` in `@cml/cml`, beside the timeline-deception
invariant that already owns case-level temporal logic and the one clock parser. Two call sites, both
before Agent 9:

- **Agent 3b**, immediately after the locked-fact registry is built — the device's own arithmetic, at
  the £0.03 end of the pipeline. Two clock-valued facts and one duration: the duration must equal the
  gap. The 08-15 device said fourteen about ten.
- **Agent 7.5**, the first stage that can see BOTH spines — the mechanism's anchors against the
  device's locked values. If they share nothing, the case keeps time twice, and the manuscript will
  print the device's pair while every geometry check reasons about the other.

The acceptance-side checks stay where they are. They are the symptom; these are the cause, and the
symptom is still worth reporting because a case can be coherent and the prose still wander.

`parseDurationMinutes` is deliberately its own parser: *"fourteen minutes"* is an offset,
*"a quarter past seven"* is a position, and the defect is those two asserted about each other. Both
checks stay silent on anything they cannot read unambiguously — three times, two durations, an
unparseable anchor.

**2. X36 — one line, and the rename says why.** `revealRegen` is now `rewriteChannelRegen`, used by the
reveal repair AND the aftermath pass. The aftermath pass had been taking the unpinned `geometryRegen`,
so with `AGENT9_REGEN_EDIT_LIST` off it ran whole-chapter — [§36](REVIEW_05.md)'s 0-of-3 arm — and on
08-15 it fired live for the first time and lost twice with exactly that signature. Both rewrite passes,
one channel.

**3. X40 — the pipeline narrating itself.** Four signatures added to the scaffold seed list, from the
three lines the cold read quoted and the detector called clean. The colon in *"The detective's
understanding updated:"* is load-bearing and required — it is the shape of a field label, and it keeps
*"her understanding of him changed"* out. Pinned by tests on both sides: the quoted lines fire, and
four ordinary sentences about understanding, clues and herrings stay clean.

**4. X41 — earn the reveal.** X35's instruction now asks for the case to be put to the culprit before
the admission — physical evidence that only fits them, then opportunity, then motive — because the
gate can only ask whether a chapter discloses, never whether the disclosure was built. The 08-15 read
made the point precisely: *"Hugo confesses, but the final proof is too abrupt."*

**5. X37 — a refused judge leaves a mark.** The rubric scorer's failure path pushed
`Rubric scoring skipped: {\` — a truncated error blob — and emitted **no diagnostic at all**, so the
report carried nothing where the score belongs and "the judge refused this story" looked exactly like
"scoring was switched off". It now names the class, states the consequence (no internal score, so no
internal-to-external comparison from that run), and emits the diagnostic anyway carrying
`not_measured` and a reason. A number that is never written is indistinguishable from a check that
never ran, and that rule now applies to the judge itself.

**Gates:** `npm test` green, geometry backtest PASS with the separation unchanged (the 68 keeps its
four unique codes; the 80's `time_anchors_absent` is the true finding from §4, not new noise).

---

## 9. The review of §8, and it found five defects — three of them in §8

**2026-08-15, immediately after the free block shipped.** An adversarial pass over everything REVIEW_08
and REVIEW_09 built. The headline is uncomfortable and worth stating first: **three of the five defects
were introduced the same evening, and two of them are the same shape as failures already recorded in
this document.**

### 9.1 A second parser, already diverged — and it would have manufactured violations

X38 shipped `parseDurationMinutes` twice: once in `@cml/cml` (the pre-prose check) and once inside
`story-geometry/accept.ts` (the ship-time mirror). They did not agree:

```
"fourteen minutes"      geometry 14   cml 14     agree
"twenty-five minutes"   geometry  5   cml 25     DIVERGE
"forty-five minutes"    geometry  5   cml 45     DIVERGE
```

The local copy tested its single-word pattern before its compound one, so it read only the last word.
A device declaring a genuine 25-minute offset would have been reported **incoherent** — a fabricated
violation, in a check written to catch fabricated arithmetic, in the class X27 calls the worst outcome
available.

`story-geometry` has zero runtime dependencies by design and injects its clock parser for exactly this
reason; the duration parser now follows the same rule. The package holds neither, and
`locked_time_arithmetic` simply does not run at acceptance when no parser is supplied — a check that
cannot read must decline rather than guess. Every caller (the worker's four call sites, the backtest,
the rescorer, the rehearsal probe) now injects the canonical one.

**This is the defect this codebase has paid for more often than any other** — X3's four flag parsers,
N5's three JSON extractors, §10 rule 2's "fix it in the body everyone imports". It took four hours to
reappear after being cited in the commit message that introduced it.

### 9.2 X33 stopped two functions short of its own class

The content-filter guard was added to the blind reader's PRIMARY read. `blindReaderSimulation` has four
call sites. Two more — the remediation loop's re-read and the deterministic-rescue re-check — were left
bare, and they are the ones that run **after the gate has already failed**, on the same prompt carrying
the same refusable case. A premise Azure refuses once it refuses every time, so the abort X33 was
written to prevent would simply have happened one branch later.

Both are guarded now, each in the shape its scope allows: the loop stops with the verdict it has; the
rescue leaves the previous verdict standing and says the re-check did not happen. Same lesson as X28,
where an idiom fix stopped one function short of the sibling comparison.

### 9.3 X39 contradicted its own documentation

The rule reads *"BOTH must be missing before this fires. One anchor absent is ordinary."* The code
compared the missing count against the parseable count, so a case with ONE parseable anchor that was
absent fired the violation — the precise case the rule exists to permit. Now it requires two parseable
anchors, because with fewer there is no two-time deception to look for.

### 9.4 X34 failed open where it should fail closed

`confessionDisclosure` located each sentence with `indexOf` to test whether the culprit was named before
the admission. On `-1` it **skipped the ordering test** and then sliced the attribution window from a
negative index, which in JavaScript counts from the end of the string. Unreachable in practice for a
trimmed split — and the wrong direction for a guard whose entire job is refusing to certify a reveal
that did not happen. It now declines.

### 9.5 X42 stopped one function short, twice

The corpus resolver fixed `readManuscript` and the backtest. It did not fix `probe:dialogue-tics`, which
does its own `existsSync` — so after the archiving it printed **"(not on disk)" for five of its six
rows** and one lonely number, with no error and no non-zero exit. And `resolveStoryPath` handled only
`stories/<story>`, not `stories/<story>/<file>.md`, so `probe:reveal-repair`'s default target was
unreachable too.

A measurement that quietly drops to n=1 is worse than one that fails. Both are fixed, all six rows are
back, and the file-path form is verified against an archived story.

### 9.6 And the tests had a defect of their own

The geometry stand-in parser omitted `"two"`, so the fixture written to prove X38 *declines* on two
durations instead proved it *fires* — the stand-in dropped one duration on the floor. A stand-in must
never be weaker than the parser it stands in for, or the test measures the stand-in.

### 9.7 What held up

- **X40's precision, measured across the whole corpus**: 3 hits on the one manuscript whose reader
  complained of *"generated/report language"*, and **0 on the other six**. That is the §10 criterion —
  a detector that also fires on the stories readers liked is noise.
- **X38/X39 still fire on the 08-15 case** after the parser change, and the backtest separation is
  unchanged (the 68 keeps its four unique codes).
- **X34's ordering guard**, probed with a duplicated-sentence paragraph designed to confuse `indexOf`:
  still refuses.
- **REVIEW_09 §1's table**, re-checked against the archived cold reads rather than memory: the 76
  column matches the file exactly.

### 9.8 Weaknesses left standing, deliberately

- **The X38 RULE is still expressed twice** — pre-prose in `@cml/cml`, ship-time in `accept.ts`. The
  parser is now single, which was the demonstrated risk; the rule is six lines and the two ask about
  different moments (cause vs symptom). Worth deleting the acceptance copy once the pre-prose one has
  run clean on four runs, and worth remembering that the parser divergence proves the risk is real.
- **The reveal-repair instruction is now four clauses long** (rewrite permission, method, placement,
  build-up). Instruction dilution is real and only a run can measure it. If the next reveal repair
  regresses, this is the first suspect.
- **X30's probe still does not separate two 84s** (0.8 vs 6.0 per 100 lines, same reader mark). Fixed
  instrument, unchanged verdict: it measures, it does not gate.

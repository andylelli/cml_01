# ANALYSIS_90 — The maths: why it fails, and the concept for fixing it

**Date** 2026-09-12 · **Cost** £0 · **Method** all 60 external reads, all 59 archived cases, and the
existing temporal machinery, measured. Counts are MEASURED unless labelled.

---

## 0. The answer in one paragraph

**The times are authored before the crime exists.** `cast.alibi_window` is the largest single source
of clock values in the project — **448 of them** — and Agent 2 writes it **five stages before the
mechanism is designed and six before the crime is given a time**. Everything downstream then
reverse-engineers a coherent timeline out of numbers invented before there was anything to be
coherent with. A case ends up exposing a median of **9 distinct clock values across 9 different field
paths** (37 paths are capable of carrying one, worst case 17 values), and **24 of 60 reads (40%)**
contain an arithmetic complaint. The project already decided how to fix this and wrote it down —
`temporal-spine.ts`: *"compute time, do not validate it … the number is authoritative and the words
are rendered from it"* — and built 704 tested lines of it. But it was pointed at locked facts, which
are **4% of the temporal surface**. The concept below is not a new idea; it is the repo's own idea,
applied at the scope where the defect actually lives.

---

## 1. What the readers actually say

All 60 reads on disk mention time. **24 of 60 (40%)** make a hard arithmetic complaint — the text
fails, as opposed to the mechanism legitimately involving a contradiction.

| complaint shape | reads |
|---|---|
| inconsistent times | 9 |
| "should be X, not Y" — the reader does the sum for us | 7 |
| time logic inconsistent / confused / muddled | 6 |
| **the reader writes out a corrected timeline** | **3** |
| cannot both be true | 1 |
| conflicts with an earlier value | 1 |

Three reads contain a numbered timeline the reader constructed on our behalf. The most recent:

> *"You need one locked timeline. Best version: 4:00 — gramophone stops. 4:00–4:03 — dancers hold
> final pose. 4:03–4:10 — silent transition continues. 4:04–4:09 — Gwendolyn slips through the crew
> corridor, kills Bertram, returns. 4:10 — gramophone resumes. Then delete 4:20 entirely."*

That is a specification. We have been given it three times, at ±3 marks a read, and the pipeline has
no object to put it in.

---

## 2. The shape of the temporal surface

Measured over 59 archived cases:

| | |
|---|---|
| median DISTINCT clock values per case | **9** |
| median field paths carrying a time | **9** |
| distinct field paths that CAN carry a time | **37** |
| worst case | 17 values across 8 fields |
| total clock values in the cases | **1,349** |
| total clock values in locked facts | **51** |

Where they live:

| field path | books | values |
|---|---|---|
| `cast.alibi_window` | 58 | **448** |
| `constraint_space.time.windows` | 51 | 171 |
| `constraint_space.time.anchors` | 47 | 110 |
| `inference_path.steps.observation` | 44 | 92 |
| `surface_model.accepted_facts` | 39 | 66 |
| `hidden_model.mechanism.apparent_time_of_death` | **35** | 35 |
| `hidden_model.mechanism.actual_time_of_death` | **29** | 29 |

Read the last two rows against the first. The two fields that name **when the murder happened** are
present in 35 and 29 of 59 cases — **under half** — while 448 clock values sit in alibi windows. The
canonical fact is the rarest one.

---

## 3. THE ROOT CAUSE — the times are authored before the crime exists

The pipeline order is:

```
1 setting → 2 cast → 2e → 2b → 2c → 2d → 3b devices → 3 CML → 4 → 5 clues → …
             ▲                            ▲             ▲
             │                            │             │
   writes alibiWindow            designs the      writes apparent/
   (448 clock values)             MECHANISM       actual time of death
```

Agent 2's own prompt shows it what to write:

> `alibiWindow: "left drawing room from twenty to nine until five past nine"`

At that moment nothing in the run knows when the victim dies, what conceals it, or how long the
culprit needs. **Five stages later a mechanism is designed around times that already exist, and one
stage after that the crime is given a time that must somehow fit them.** The deception is fitted to
the alibis rather than the alibis to the deception.

This is why the failure is so consistent and why no downstream check has fixed it. Every existing
check is asked to reconcile numbers that were never intended to reconcile. The correct question is
not *"do these numbers agree?"* but *"why is anything authoring a number here at all?"*

Agent 2d is called "temporal context" and is not a counter-example: it produces period detail — year,
season, fashion, daylight — not the crime's clock.

---

## 4. What already exists, and why it reaches 4%

This project has already diagnosed this and built the machinery. `temporal-spine.ts` (704 lines,
three test files) states the principle in its own docblock:

> **compute time, do not validate it.** Today an LLM authors times as prose in three places and every
> consumer reverse-engineers numbers back out. Here the number is authoritative and the words are
> rendered from it.

It provides what a fix needs: `parseTemporalValue` (absolute minutes + `dayOffset` + meridiem, so
"the evening prior" is arithmetic rather than a silently discarded 12 hours), `parseDurationValue`,
`renderClockWords`, `StructuredTime` with `renderStructuredTime` / `alternativeRenderings` /
`structuredTimesCollide`, and `buildTemporalSpine`.

Built on top of it and **already live**: `declared-derivations.ts` (`AGENT3B_DECLARED_DERIVATIONS`),
which checks what a device DECLARES it derived and measured that 11 of 25 declaring runs (44%) carry
a derivation that does not close; `alibi-span.ts` (T2, `AGENT3_ALIBI_SPAN_FLOOR`); and
`AGENT3B_ARITHMETIC_REGEN`, which re-authors a failing design *"for about a cent, instead of £1 of
prose rendering numbers that cannot work."*

**The machinery is on, and the 40% complaint rate is the state with it on.** The reason is scope:

| | clock values | covered by the spine |
|---|---|---|
| locked facts | 51 | yes |
| the case | 1,349 | no |
| **coverage** | | **4%** |

The spine is correct and it is pointed at the wrong 4%.

---

## 5. THE CONCEPT — a Chronology stage

**One numeric timeline, authored after the mechanism is known and before any prose-bearing time
exists; every time-bearing string in the pipeline rendered from it.**

### 5.1 Where it goes

```
… → 2 cast (no times) → … → 3b devices (mechanism) → ★ CHRONOLOGY ★ → 3 CML → 5 clues → …
```

After 3b, because a timeline cannot be designed before the deception it encodes. Before 3, because
every field Agent 3 writes that carries a time must render from it rather than invent one.

### 5.2 What it emits — numbers, not prose

```ts
interface Chronology {
  events: Array<{                 // every instant the story turns on
    id: string;                   // "crime", "apparent_death", "music_stops", "alibi_start:Harriet"
    minutes: number;              // absolute, 0..1439 — StructuredTime, not a 12-hour dial
    dayOffset: number;            // 0 = murder day; "the evening prior" is arithmetic
    kind: "crime" | "apparent" | "anchor" | "window_open" | "window_close";
  }>;
  windows: Array<{                // every interval, expressed as two events
    id: string;                   // "concealment", "alibi:Harriet", "opportunity"
    fromEventId: string;
    toEventId: string;
    owner?: string;               // a cast name, for an alibi
  }>;
}
```

Three properties make it a spine rather than another field:

1. **Integers only.** No string in this object.
2. **Intervals are pairs of events, never free durations.** A window cannot disagree with its own
   endpoints because it does not store a length — the length is `to.minutes − from.minutes`. That one
   choice deletes the entire class of defect where a seven-minute intermission runs from 4:00 to 4:20.
3. **Every downstream time is rendered.** `renderClockWords` and `renderStructuredTime` already exist
   and are tested. `alibi_window` prose becomes `renderStructuredTime(from) + " to " +
   renderStructuredTime(to) + " in " + place`.

### 5.3 The invariants, checked before a word of prose is written

All of these are arithmetic on integers, and every one of them is a defect a reader has named:

- the crime falls **inside** the concealment window
- the apparent time falls **inside** the culprit's alibi window (the deception works)
- the actual time falls **outside** it (the culprit was free)
- every window has positive length
- no two events claim the same id with different minutes
- every clock value anywhere in the case resolves to an event id

The last one is the strong condition: **a time that is not in the chronology is a defect by
construction**, which is exactly the check that does not exist today.

### 5.4 Alibi windows stop being authored

This is the part that matters most and is the biggest change. Agent 2 keeps what it is good at — who
vouches for whom, where they were, how plausible their access is — and **stops inventing when**. The
chronology assigns the times once the mechanism is known, and the alibi prose is rendered.

That single move takes 448 of 1,349 clock values (33%) out of free authorship, and it removes the
ordering absurdity at the root of §3.

### 5.5 Does it need a new agent?

**Mostly not, and that is the point.** Given the mechanism, the concealment window and the crime
time, the rest of the chronology is arithmetic. The only genuinely authorial decisions are *what hour
the story sits at* and *which anchor events exist* — one small structured call, of the order of a
cent, against a £1.27 book whose numbers cannot work.

So: a deterministic stage with one small LLM call, not a fourteenth agent. If it must have a name it
is Agent 3c, and it sits between the mechanism and the case.

---

## 6. What this replaces, and what it keeps

**Keeps, unchanged:** `temporal-spine.ts` (this is what finally uses it at scale), `alibi-span.ts`
(T2's structured span becomes a rendering of a chronology window), `checkCaseTimelineDeception` (its
invariants move to §5.3 and become checkable on integers), `AGENT3B_ARITHMETIC_REGEN` (the escape
hatch when the chronology cannot be made to close).

**Retires:** `AGENT3_TEMPORAL_CLOSURE` and `AGENT3_CASE_TIMELINE` — A_89's telemetry, which can decide
3 of 49 cases because it reads free text. Under a chronology the question is answered by construction.
`AGENT3_OPPORTUNITY_WINDOW` is already recommended-against.

**A phased path, cheapest first:**

1. **Phase A — build the chronology and CHECK ONLY.** Derive it from what cases already say, run §5.3,
   report. £0 to build, £0 per run, and it gives the first honest measurement of how many cases could
   close. This is where A_89's A1 should have started and did not.
2. **Phase B — render `alibi_window` from it.** One field, 33% of the surface, one prompt change.
3. **Phase C — render `constraint_space.time.*` and the mechanism times.** Another 21%.
4. **Phase D — the strong condition:** a clock value that resolves to no event is a violation.

Each phase is independently flag-gated, independently measurable on the 59 archived cases, and
independently abandonable.

---

## 7. Falsifiers, and what would make this the wrong idea

- **Phase A finds the cases already close.** If deriving a chronology from existing cases shows most
  of them satisfy §5.3, then the defect is in the PROSE rendering and not the case, and this whole
  concept is aimed at the wrong layer. **Phase A is cheap precisely so it can say that before Phase B
  is built.**
- **Rendered alibi prose reads worse.** `alibi-span.ts` already warns of this: *"a rendered window
  reads worse than the model's own sentence and the location phrasing is part of the story's
  texture."* If rendering flattens the prose, the answer is to render the NUMBER and let the model
  write the sentence around it — constrained, not replaced.
- **The model ignores the chronology.** The `voice-spec-is-a-dead-lever` risk, and A_89 D1 just
  demonstrated it: context reaches the prompt and is ignored. Mitigation: the chronology must be an
  OBLIGATION with countable operations, not a reference block.

---

## 8. What I am deliberately NOT proposing

- **Not another checker.** A_89 built two temporal checks. The first had a 94% false-positive rate;
  the second decides 3 of 49 cases; and the audit found the field it asked for already existed in
  `alibi_window` in 58 of 58 cases. **Three measurements and zero repairs is enough.** The next thing
  built here should change a number, not count one.
- **Not a prompt instruction.** "Keep your times consistent" is a statistic, and this model complies
  with operations and ignores statistics.
- **Not a repair that guesses.** `reconcileDeviceArithmetic`'s comment is right — it "will not guess
  which of three numbers is wrong." A chronology does not have to guess, because it is authored as one
  object; that is the difference between repairing an inconsistency and never creating one.


---

## 9. PHASE A — RUN. The concept survives, but it is not the first move.

Phase A existed to falsify §5 before anything was built. It did not falsify it, but it found
something cheaper and more urgent, and it corrected two things in this document.

### 9.1 The deception's own invariant

A case's deception works only if the apparent time is **inside** the culprit's alibi (the fake gives
cover) and the actual time is **outside** it (the culprit was free). Computed over the archive with
the project's own parsers:

| | |
|---|---|
| cases | 59 |
| decidable — both times parse and the culprit's alibi resolves to a span | **48 (81%)** |
| both invariants hold (the deception works) | **35 of 48 (73%)** |
| **at least one fails** | **13 of 48 (27%)** |

Two hand-checked failures, so the count is not a regex artifact:

- `785870981754` — apparent 2:45, actual 2:00, culprit's alibi **1:45–2:50**. Both times sit inside
  it: **the culprit is alibi'd for the real murder.**
- `787089592926` — apparent 8:45, actual 9:15, culprit's alibi **7:45–8:20**. Neither is inside it:
  **the staged time gives him no cover at all**, which is the entire purpose of staging it.

**This partially falsifies §0.** The case's core logic closes in 73% of cases; "the case is
incoherent" was too strong. The defect is a 27% minority, and it is severe when it occurs.

### 9.2 THE REAL ANSWER — it is detected and not enforced

> **CORRECTED 2026-09-12, before anything was built on it (§10.1).** The claim below is wrong. Every
> archived case that shipped with a timeline violation started BEFORE the commit or the flag that
> would have caught it, and 0 of the 4 cases generated since the 2026-09-05 flags carry one. The
> violation is detected AND enforced; what the enforcement costs is a retry or a dead run, and that
> is what Move 0 became — a repair by construction (Move 2) instead of an abort. The section is
> kept as written because the mistake is the lesson: **date the evidence against the fix before
> calling the fix bypassed.**

`checkCaseTimelineDeception` already checks exactly this invariant, is already wired, and — with the
flags that are actually set in `.env.local` — **catches all 13 and misses none.** Detection is not the
problem.

| | |
|---|---|
| cases carrying a TIMELINE validation error | 5 |
| **…that shipped a book anyway** | **4** |

The pipeline knows the arithmetic is broken, says so, and prints the book. *That* is why five months
of temporal work has not moved the reader's complaint: every layer added has been a better way of
noticing, and nothing rejects.

**Move 0, ahead of everything in §5:** route a timeline violation into the design-tier regeneration
that already exists (`AGENT3B_ARITHMETIC_REGEN` — *"the model re-authors a coherent set for about a
cent, instead of £1 of prose rendering numbers that cannot work"*). It fires on **5 of 58 cases (9%)**,
which is far below B1's off-switch threshold, so a gate is legitimate here in a way it was not for
A_89's 71%/94% checks.

### 9.3 What the chronology is still for

The other half of the defect is untouched by enforcement:

| | |
|---|---|
| clock values in cases | 1,312 |
| matching a named event or an alibi endpoint | 1,105 (84%) |
| **corresponding to nothing at all** | **207 (16%)** |

Those 207 are the free-floating numbers the prose picks up — it is how "music resumes at **4:20**"
entered run 88651 from an unrelated alibi window. Enforcement cannot reach them, because they violate
no stated invariant; they are simply unanchored. **That is what §5's strong condition is for, and it
remains the right idea.** It is now Move 1, not Move 0.

### 9.4 A PROBE-VALIDITY FAILURE, and the lesson

This section first reported that the existing validator "misses 8 of 13". **That was wrong.** The
probe ran under `node`, which does not load `.env.local`, so every flag read as OFF —
`AGENT3_ALIBI_UNREADABLE_GATE` and `AGENT3_TIMELINE_WINDOW_VOCABULARY` are both `true` in production.
With them on the validator raises 15 and misses 0.

**Any probe that reads a flag mis-measures production unless it loads `.env.local` first.** Every
`node scripts/...` and every scratch probe in this repo defaults the entire flag register to OFF. That
is the fourth probe-validity failure in this analysis sequence, and unlike the others it is
systematic rather than a one-off slip — the same mistake is available to every measurement anyone
writes here.

### 9.5 Revised order

| move | what | reach | cost |
|---|---|---|---|
| **0** | ~~enforce the timeline violation that is already detected~~ **premise false (§10.1)** — became a pin that detection covers every archived shape, and Move 2's repair-by-construction | 15 of 53 cases (28%) | small |
| **1** | chronology Phase A as a shipped check: every clock value must resolve to an event | 207 unanchored values (16%) | medium |
| **2** | render `alibi_window` from the chronology | 448 values (33%) | medium |
| **3** | render `constraint_space.time.*` and the mechanism times | ~21% | large |

Move 0 was not in the original concept because I had not measured whether detection or enforcement
was the gap. It is the cheapest thing in this document and the only one that would have changed the
last two books.

---

## 10. PHASE B — BUILT. Moves 0–3, and what the build changed in this document.

Everything in this section was measured against the archive before it was wired, and every lever is
flag-gated, default OFF, registered in `architecture/FLAG-AUDIT.md`, runtime-read.

### 10.1 Move 0 — the premise was false

The three "post-abort" shipped violators, dated against the code that would have caught them:

| run (projectId epoch, UTC) | what would have caught it | that landed at (UTC) | verdict |
|---|---|---|---|
| `787090659142` 08-18 22:04 | `UNREPAIRABLE_DEGRADE_CODES` abort, 980e933e | 08-19 20:39 | run predates the abort |
| `787167692138` 08-19 19:28 | same | 08-19 20:39 | run predates the abort by 71 minutes |
| `788607565000` 09-05 11:26 | `AGENT3_ALIBI_UNREADABLE_GATE`, 6853cfa2 + `.env.local` | 09-05 12:16 | run predates the flag |

The other eight shipped violators are detectable only with `AGENT3_TIMELINE_WINDOW_VOCABULARY`
(committed 09-04, enabled 09-05) and are all dated 08-04..09-04. Run 88651's own log shows the
enforcement working: attempt 1 raised `actual_covered` ("4:15 inside 4:00–5:00"), the retry cleared
it. **Nothing bypasses the check.** MEASURED: 4 of 4 cases since 09-05 carry no violation.

What Move 0 is now: a pin (`a90-archive-timeline.test.ts`) that the production-flag validator raises
the recorded codes on all 15 archived violators, and that Move 2 renders every one clean.

### 10.2 The ship case, at the layer it actually broke

Project `789156244431` (both reads: 79 and 82). The device locked **one clock and three durations**:

| id | value | anchored to a clock? |
|---|---|---|
| `music_restart_time` | twenty minutes past four | — (it IS the clock) |
| `silent_intermission_duration` | seven minutes | **no** |
| `last_pose_hold` | three minutes | **no** |
| `murder_window_interval` | ten minutes | derivedFrom the two above (a sum, not a place) |

`buildDeviceArithmeticRule` returns "" unless the registry holds exactly one duration, so Agent 3
received the four values and **no arithmetic at all**, and wrote `anchors[0] = "silent intermission
starting at four o'clock"`, `apparent = "four o'clock"`, `actual = "a quarter past four"`. Four
o'clock plus seven minutes is not twenty past four; the murder window is ten minutes inside a
seven-minute pause. Every downstream artifact inherited it (clues ×9, outline ×4, prose "four
o'clock" ×1 and "seven-minute" ×27). The reader did the subtraction and wrote the correct timeline
— intermission 4:13–4:20 — which is exactly what the solver now prints (§10.3, Move 3).

**§3's root cause is also corrected here.** §3 said Agent 2 authors the alibi windows five stages
early. MEASURED: Agent 3 rewrites Agent 2's window in **311 of 321** cast entries (97%), and 46% of
Agent 2's carry no clock at all. The 448 alibi clock values are authored by Agent 3, in one call,
AFTER the mechanism, under a prompt that already states the invariants. The fix therefore belongs
at Agent 3's inputs, not at Agent 2 — which is where Move 2 was built.

### 10.3 What was built

| move | lever | flag | files | MEASURED (archive, production flags) |
|---|---|---|---|---|
| 2 | culprit alibi COMPUTED: one window per apparent/actual assignment printed into the prompt; after the call a window that breaks either invariant or cannot be read is rendered from the numbers, location kept; a coherent one is left alone | `AGENT3_ALIBI_PLAN` | `packages/cml/src/alibi-plan.ts`; `buildAlibiPlanRule` in `agent3-cml.ts`; render in `applyCmlRepairAndRevalidate` (before T2) | clears **15/15** violators; touches **0/38** clean cases; planner holds both invariants on **20,590/20,592** dial pairs |
| 3 | chronology SOLVED from the device: clocks + anchored durations → events and event-pair intervals, to a fixed point; THE CLOCK printed into the Agent 3 prompt; the 3b prompt asks every non-derived duration for `anchor: {at, edge}`; one post-pass respelling (a death time at a locked minute takes the locked spelling) | `AGENT3_CHRONOLOGY`, `AGENT3B_DURATION_ANCHORS` | `packages/cml/src/chronology.ts`; `buildChronologyRule`; `isDurationAnchorsEnabled` + mapper + registry pass-through; 3b telemetry | ship device with two anchors: prints "silent_intermission_duration: thirteen minutes past four to twenty minutes past four (seven minutes)"; no archived device carries an anchor, so on every archived registry the block is empty |
| 1 | every clock value resolves to an event: the prompt rule (declare in `time.anchors` first) + `findUnanchoredClockValues` telemetry at Agents 3, 5 (clues), 7 (outline) | `AGENT3_CHRONOLOGY` | same module; `[A_90 chronology]` lines in `agent3-run`, `agent5-run`, `agent7-run` | **19 of 760** clock values (3%) unanchored, in **6 of 53** cases (11%) |
| 1+3 | coherence as validation errors inside `generateCML`'s loop (reaches retry + Agent 4, not the abort): `window_duration_mismatch`, `anchor_contradicts_solved_event` | `AGENT3_CHRONOLOGY_ERRORS` | `checkChronologyCoherence`; splice at the `validateCml` call in `generateCML` | window mismatch **0/53** today (goes live when THE CLOCK operation is followed); anchor contradiction fires on the ship case once anchored |
| 0 | the pin | — | `a90-archive-timeline.test.ts` + fixture (15 violators + the ship device/case) | all 15 detected with the recorded codes; all 15 rendered clean |

The §5 concept survives with one change of address: the chronology is not a new stage between 3b and
3. It is solved from 3b's registry at Agent 3's prompt time and re-derived from the case afterwards,
which is the same object at a cost of zero calls.

### 10.4 What was NOT built, and why

- **Free-text rewriting of windows or endpoints in a post-pass.** A single-field rewrite of "four
  o'clock" in `windows[]` leaves the same value in `anchors[]`, the mechanism description, nine clues
  and the outline; it manufactures the contradiction it meant to remove. The endpoint is fixed at
  authoring time (THE CLOCK) and reported afterwards (`anchor_contradicts_solved_event`).
- **Anchoring as a validation gate.** 11% of archived cases carry a stray value — under B1's line,
  so a gate would be defensible — but the reader's actual complaint ("music resumes at 4:20", a value
  anchored to an unrelated alibi) is a value that IS anchored, to the wrong event. A gate on
  anchoring would not have caught it. Telemetry first; the number decides.
- **THE CLOCK in the Agent 7 and Agent 9 prompts.** The outline and prose inherit the case's
  numbers; fix the case first and measure the leakage (`[A_90 chronology] outline:` / `clues:`)
  before adding a block to a 24k prompt. Recorded as the next lever if the leakage lines show it.
- **`AGENT3_CHRONOLOGY_ERRORS` on.** Rate unknown until one run; a gate at an unknown rate is an
  off switch with extra steps.

### 10.5 STATUS

| item | status | commit |
|---|---|---|
| Move 0 — bypass investigation | **withdrawn as wrong** (§10.1); pin built | @@COMMIT@@ |
| Move 2 — alibi plan + render | built, measured, tested (`a90-alibi-plan.test.ts`, archive pin) | @@COMMIT@@ |
| Move 3 — chronology solver + THE CLOCK + 3b anchor field | built, measured, tested (`a90-chronology.test.ts`, `a90-agent3-injection.test.ts`) | @@COMMIT@@ |
| Move 1 — anchoring rule + telemetry (3, 5, 7) | built, measured | @@COMMIT@@ |
| coherence errors in the loop | built, flag OFF, recommended-against until one run | @@COMMIT@@ |
| §3 root cause (Agent 2 authors windows) | **corrected**: Agent 3 authors them, 97% rewrite | @@COMMIT@@ |
| flags flipped for the next run | `AGENT3_ALIBI_PLAN`, `AGENT3_CHRONOLOGY`, `AGENT3B_DURATION_ANCHORS` = true | `.env.local` (untracked) + FLAG-AUDIT |

### 10.6 What the next run settles

1. **Does 3b supply the anchor?** `[A_90 chronology] device:` names every unplaced duration. A
   countable operation; this model complies with those. Prediction: ≥ 2 of 3 non-derived durations
   anchored on the first run.
2. **Does THE CLOCK survive into the case?** `anchor_contradicts_solved_event` count at Agent 3.
   Prediction: 0, and `apparent`/`actual` land on solved or locked events.
3. **Does the culprit copy the printed window?** `[A_90 alibi-plan]` lines count the times the
   model still wrote a broken window WITH the value in front of it. Prediction: 0 renders.
4. **Where does leakage happen?** `[A_90 chronology] clues:` and `outline:` unanchored counts.
   Prediction: clues 0, outline ≤ 2 — and if the outline leaks, THE CLOCK goes into Agent 7 next.
5. **The reader.** A_89's matched pair scored `clues` 5/10 on the arithmetic. Prediction: no
   arithmetic complaint in the next read, or the complaint names a value the log shows as unanchored.


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
| Move 0 — bypass investigation | **withdrawn as wrong** (§10.1); pin built | `fe4ba5de` |
| Move 2 — alibi plan + render | built, measured, tested (`a90-alibi-plan.test.ts`, archive pin) | `fe4ba5de` |
| Move 3 — chronology solver + THE CLOCK + 3b anchor field | built, measured, tested (`a90-chronology.test.ts`, `a90-agent3-injection.test.ts`) | `fe4ba5de` |
| Move 1 — anchoring rule + telemetry (3, 5, 7) | built, measured | `fe4ba5de` |
| coherence errors in the loop | built, flag OFF, recommended-against until one run | `fe4ba5de` |
| §3 root cause (Agent 2 authors windows) | **corrected**: Agent 3 authors them, 97% rewrite | `fe4ba5de` |
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

---

## 11. RUN 81042 — the first run with the levers on · 2026-09-12 · £1.29

**Parameters.** Seed 81042 (`node scripts/run-params.mjs --seed 81042`), temporal · 1940s ·
CountryHouse · Classic · short · police · atmospheric · cast 6 (Beatrice Whitlock, Frances Orme,
Josephine Rutherford, Percival Thorne, Ottoline Dunmore, Ambrose Halloway); theme "a chiming clock
whose strike was made to fall at the wrong hour"; angle "a canal lock-keeper's cottage"; fresh names
18 given / 18 surnames excluded. Flags flipped since the matched pair: `AGENT3_ALIBI_PLAN`,
`AGENT3_CHRONOLOGY`, `AGENT3B_DURATION_ANCHORS`. Temporal was chosen over spatial (0 reads)
deliberately: the predictions need locked durations and clocks.

**Outcome.** `mystery-1789232316546` / `canary_1789232316543`. Cost audit $1.64 list, **£1.29** true
(summary's upper bound $1.495). Release gate **warning**: chapters 2 (`mechanism_explained_too_early`,
regen unresolved) and 6 (`missing_clue`, regen hit HTTP 429) shipped with validation failures; **no
deterministic-fallback chapter** (0), so the book is readable. 9,404 words. Three Azure content
refusals (Agent 6 blind reader ×2, geometry regen ch8). DE3: cell temporal × locked_room_timing has
shipped 5 of the last 20 — a REPEAT cell. Manuscript:
`stories/story_20260912-1815/the_clock_s_false_hour_at_lockwood_estate.md`.

**The device (3b):** `clock_chime_actual_time` 3:25 · `clock_chime_displayed_time` 3:45 ·
`victim_watch_stopped_time` 3:10 · `clock_chime_advance_interval` twenty minutes, derivedFrom the
first two (X38 repaired it at source from thirty-five). **Three clocks, no free duration.**

### 11.1 The five predictions

| # | prediction | verdict | evidence |
|---|---|---|---|
| 1 | 3b anchors ≥ 2 of 3 non-derived durations | **not determinable** | the device locked no free duration; `[A_90 chronology] device: events 3 (locked 3, solved 0, case 0); intervals 1` |
| 2 | 0 `anchor_contradicts_solved_event`; apparent/actual on locked or solved events | **half FAILED** | 0 findings, but vacuously (nothing solved). Actual 3:10 = the locked watch; **apparent "four o'clock" matches no locked value.** X38 at Agent 7.5: "four o'clock and ten minutes past three are 50 minutes apart, while the interval declares twenty" |
| 3 | 0 `[A_90 alibi-plan]` renders | **vacuous** | 0 renders — but the plan never printed. Both Agent 3 calls carried THE CLOCK and neither carried "ALREADY COMPUTED" or "must BE those two values" (prompt log): with three clocks both rules self-gate. Attempt 1 staged 3:45 (the locked displayed time) outside the culprit's 4:00–4:30 → `apparent_not_covered` → the retry did what the validator's message said, "move the APPARENT time", and moved it to four o'clock |
| 4 | clues 0 unanchored, outline ≤ 2 | **held** | case 17/17, clues 12/12, outline 12/12 — the model declared five `time.anchors` and used them everywhere. **The Move 1 operation was followed on the first run** |
| 5 | the read carries no arithmetic complaint | **held, with one glitch** | **87/100** — "one of the best clock drafts so far"; `clues` **8/10** (5 and 6 on the two previous reads of the ship case). No "the numbers do not line up" complaint. Two time notes remain, both traced: (a) "the chime was advanced by twenty minutes" reads backwards — the DEVICE's own description says "advanced ahead of real time" while its numbers put the chime twenty minutes behind the face (a direction word no check compares to the arithmetic; recorded, not built); (b) "froze at three past midnight past three" in ch9 — NOT the model: the repetition detector nominated the window "s pocket watch stopped at ten minutes", which cuts the locked "ten minutes past three" under the three-word floor, the atmosphere pass paraphrased it, and the splice stranded "past three". Fixed at both ends (§11.2) |

A sixth line the run produced on its own: `coherence: window_duration_mismatch at
constraint_space.time.windows[1]` — a **false positive**. The window "ten minutes past three to
twenty-five minutes past three" was read as a twenty-five-minute length. `AGENT3_CHRONOLOGY_ERRORS`
was OFF, so it cost nothing; on, it would have sent Agent 4 to repair a correct window. The B1 order
— telemetry first, gate after — is what made this free.

### 11.2 What the run taught, and what was built from it

The failure is one shape: **a registry with three locked clocks.** The arithmetic rule declines it
("one duration or the pairing is a guess" — but here the device DECLARED the pairing), the alibi plan
declines it, the model authors the inequality unaided and gets it wrong, and the validator's retry
message then names the wrong repair for a locked value. Four fixes, all pinned on the run's own device
and attempt-1 case, and measured before wiring:

| fix | flag | measured |
|---|---|---|
| `selectDeceptionPair` — the interval's `derivedFrom` names the deception's two clocks; both rules print as for two | `AGENT3_DECEPTION_PAIR` (new, ON) | OFF: both rules ""; ON: arithmetic rule binds 3:25/3:45 and excludes the watch; plan prints 2 branches |
| repair before retry — `applyAlibiPlanBeforeRetry` inside `generateCML`, on the attempt that failed | `AGENT3_ALIBI_PLAN` | attempt-1 shape: window rendered around the locked 3:45, case valid, no retry; apparent unchanged |
| the `apparent_not_covered` message says move the WINDOW; the staged time only if it is not locked | none (message text) | pinned; no test had asserted the old wording |
| `statedLength` ignores a clock phrase's own "N minutes past" | none | the run's windows[1] now reads `statedMinutes: null`; "(seven minutes)" still reads 7 |
| the atmosphere pass may not vary a time: nomination excludes any n-gram window overlapping a locked value's token range (positional, no word-count floor), and a substitution that changes the paragraph's clock values is refused | `AGENT9_PHRASE_LOCKED_BOUNDARY` (new, ON) | OFF reproduces the shipped line from the run's own paragraph and replacement; ON leaves the paragraph untouched and the fragment un-nominated; a benign repeat is still nominated and applied |

### 11.3 STATUS (this section)

| item | status | commit |
|---|---|---|
| run 81042 launched, shipped, logged | done — release gate warning, no fallback chapter, £1.29 | `42a1794e` |
| predictions 1–4 scored | 1 not determinable · 2 half failed · 3 vacuous · 4 held | `42a1794e` |
| prediction 5 | read: **87/100**, clues 8/10; the one time glitch traced to the atmosphere pass and fixed | `42a1794e` |
| `AGENT3_DECEPTION_PAIR` + repair-before-retry + message + statedLength | built, tested, ON | `42a1794e` |
| §10.6's predictions restated for the next run | see 11.4 | `42a1794e` |

### 11.4 What the next run settles

1. A device with a free duration (a poison onset, a pause): does 3b anchor it? Not controllable; read
   `[A_90 chronology] device:` and score it when the shape appears.
2. **Both death times on locked values** when the registry holds ≥ 3 clocks — the failure this run had.
3. `[A_90 alibi-plan] before retry` count — the retry is now the fallback, not the repair. Prediction:
   Agent 3 attempts ≤ 1 on timeline codes.
4. Anchoring again (case/clues/outline): prediction 0 / 0 / ≤ 2, as before.
5. The read of the next book. This one: 87 — a single read, a different case and axis from the 82,
   and inside the rubric's noise for a *score* claim; the category the work targeted, `clues`, moved
   5 → 6 → 8, and the reader's complaint changed from "the numbers do not line up" to one wording
   and one stranded fragment. The remaining time note the run cannot fix deterministically is the
   device's direction word ("advanced" for a chime that runs behind the face) — the next thing to
   measure at 3b.

---

## 12. THE 87/100 READ'S RECOMMENDATIONS, BY CAUSE · 2026-09-12 · £0

The reader named seven things. Every one is traced below to the artifact or the pass that produced
it (`logs/llm.jsonl` holds every LLM response; the prompt log every prompt; the rest is
deterministic code). Five are fixed in this commit, flag-gated and pinned on the run's own material;
two are recorded with the reason they are not built here.

| # | the reader said | cause, MEASURED | fix | flag |
|---|---|---|---|---|
| 1 | "the chime was advanced by twenty minutes" is confusing; state the mechanism in three steps | the CASE is coherent (chime and face both twenty minutes ahead of true time; the watch and the cottage clock honest); the prose compressed three locked values into one clause that reads as "chime behind face" | the reveal obligations render the three steps from the numbers, with the direction computed: "ran 20 minutes AHEAD of the true time: when it showed a quarter to four, the true time was twenty-five past three" | `AGENT9_REVEAL_ARITHMETIC` |
| 2 | "three past midnight past three" | `AtmosphereRepair` paraphrased a locked value the n-gram window had cut in half | fixed in §11.2 | `AGENT9_PHRASE_LOCKED_BOUNDARY` |
| 3 | Chapter 4 repeats chapters 2/3; cut it by 30% | **24 of chapter 4's 57 sentences are whole-sentence copies** from chapters 2–3 (16 from chapter 3). Instructed: **11 of 14 clue obligations in chapters 3–6** were for clues already ≥70% on earlier pages, **0 marked inherited** — B1's ownership follows the CML map, the model plants early. Chapter 4's prompt carried 50 of chapters 2–3's 108 sentences verbatim under STORY TO DATE, and the model copied the ones it was told to re-stage | ownership by the page: presence decided by the validator's own test over the chapters written so far; the requirement ledger drops those clues so the ask, the validator, the regen and the floor agree | `AGENT9_CLUE_OWNERSHIP_BY_PAGE` |
| 4 | "Drawing room and manor clock room" (scaffold) | the outline's scene LABEL, printed raw into "Scene is set in:", copied with its capital; 39% of 537 archived scene labels are compound, 57% capital-lowercase | rendered as a place phrase — "the drawing room and the manor clock room" — with "never as the label" | `AGENT9_LOCATION_LABEL_PROSE` |
| 5 | "In a remembered moment, He looked…" / "Before the death, "Miss Dunmore,"…" (scaffold) | the canonical-victim rescue framed a possessive object and a death statement: its predicate was an active verb anywhere in a sentence with the name; the validator's (name FOLLOWED by a verb) flagged neither | the rescue uses the validator's exported `hasActiveUse`; a frame lowercases a pronoun/article opener | `AGENT9_VICTIM_RESCUE_EXACT_PREDICATE` |
| 6 | "questing for the secret" (scaffold) | `AtmosphereRepair-Ch5` replacement for "searching for the truth behind its". Across the last three reads the pass authored **5 of the 20** lines readers called generated; the repetition it targets was **13.5× the median after it ran** | the pass is skipped; the matched pair measures the difference | `AGENT9_SKIP_ATMOSPHERE_REPAIR` |
| 7 | repeated character lines (Percival's order, Ottoline's cog, Josephine's "how the canal runs") | profile text: the signature tic is offered in ONE chapter (A_82 P10) yet appears 4×, and "smallest cog" 5× — copied from the prior chapters' full text under STORY TO DATE, the same channel as #3 | **not built.** Trimming older chapters from STORY TO DATE would not help (16 of 24 copies came from the immediately preceding chapter); dropping all prior text is a continuity risk that needs its own matched pair. Recorded as the next prose lever if #3's fix leaves copies behind | — |

**What the read did not name and the log did:** the run's SHIP-CHECK said "226 repeated 6-word spans,
13.5× the median, WORTH A LOOK BEFORE READING" before the reader opened it. The instrument was right
about the book and the reader still gave 87 — repetition of the *locked values* is mandated and
harmless; the repetition that cost a mark was chapter 4's copied testimony, which #3 addresses.

### 12.1 STATUS

| item | status | commit |
|---|---|---|
| #1 reveal arithmetic | built, pinned on the run's device | `2784c5f7` |
| #3 ownership by the page (ledger + ask + validator + floor agree) | built, pinned on the run's chapter-3/4 shape | `2784c5f7` |
| #4 location label as prose | built, pinned on the run's label | `2784c5f7` |
| #5 rescue exact predicate | built, pinned on the run's two sentences | `2784c5f7` |
| #6 atmosphere pass skipped | built, ON for the matched pair | `2784c5f7` |
| #7 STORY TO DATE copying of profile lines | **recorded, not built** — needs its own matched pair | — |
| Agent 7: one canonical location per scene | **recorded, not built** — upstream change | — |
| device direction word vs arithmetic (§11.1) | **withdrawn** — the case was coherent; the prose blurred it (#1) | — |

### 12.2 How to measure them: the matched pair

All five are prose-side. `RESUME_REDO=prose` against run 81042's byte-identical upstream (~£0.45)
settles them without a new case: whole-sentence copies (29 → under 10), the reader's artifact list
(the three deterministic ones cannot recur; the atmosphere pass is off), the reveal's three
sentences on the page, and the C2 repetition density with the pass off.

---

## 13. THE MATCHED PAIR — one lever harmed the book, and it was the one the reader asked for · 2026-09-12 · £0.45

`RESUME_REDO=prose` on run 81042's byte-identical upstream. Arm A = the shipped 87/100 book; arm B =
the same case with §12's five prose flags on. Run `resume-1789236752745`, 13.7 min, 10,426 words,
release gate **warning**, no fallback chapter.

### 13.1 Scored

| prediction | verdict | measured |
|---|---|---|
| copies 29 → under 10; chapter 4's 24 → under 5 | **PARTIAL** | total **29 → 17**; **chapter 4: 24 → 1**; but chapter 6 **0 → 8** — the copying MOVED |
| ≥8 of 11 re-mandated clues marked inherited | **HELD** | `ALREADY ON THE PAGE` in the prompts of chapters 2–8 |
| the reveal carries three sentences with "ahead" | **FAILED** | the block reached **chapter 9**, the confrontation is chapter 8; "advanced by twenty minutes" survives |
| no frame on a possessive/death sentence; no label in narration | **HALF** | frames: **gone**. Label: **still there**, 3× |
| atmosphere pass skipped, density falls | **HELD** | skipped, 15 candidates left as written; repeated-6-gram density **675 → 612 per 10k** |
| gate no worse than warning, no fallback | **HELD** | warning, no fallback, readable |

### 13.2 THE REGRESSION, and what it cost

Arm B carried two rubric caps arm A did not: *reveal uses evidence not planted earlier → ending ≤ 5*
and *mechanism explained too early → plot_structure ≤ 6, pacing ≤ 6*, plus a geometry warning that
the reveal never named the culprit. (The internal rubric cannot RANK two books — A_74 §6.1 — but a
CAP is a categorical flag, not a graded score, and these three are new.)

Cause, measured against arm B's own artifacts: ownership-by-page retired **16 of 31** obligations,
and chapter 8 — the reveal — lost **both** of its, including `clue_culprit_direct_ottoline_dunmore`.
`missing_clue` regen log lines went **16 → 52** and scaffold regens **0 → 14**.

**The premise was half right.** Re-staging a discovery is a recap, which is what the reader
complained about; re-citing the evidence at the reveal is the genre's contract, and A_64 C2 already
says so in this repo ("the deduction must be WALKED"). The rule could not tell the two apart.

**And the obvious safety rail is inert.** "Never retire an `essential` clue" looks right until you
count: **1,128 of the archive's 1,216 clues (93%) are `essential`**. That guard would switch the
lever off while leaving the flag on — CLAUDE.md's B1 in reverse. The guard that shipped is narrow:
nothing retires in the reveal or discriminating-test chapter, and nothing whose id names the culprit
or the reveal. **The flag is OFF and recommended-against until a probe measures the narrowed rule.**

### 13.3 The two that fired and did not work — both for the same reason

**The location label is a sticky plaster.** The obligation line rendered correctly in all ten
chapters and the label still reached the page. It appears **4 times in the chapter-3 prompt**, and
one of the other three is the location registry's *"locations in your prose MUST use the EXACT
capitalisation from the CML profiles"*, naming "Drawing room and manor clock room" as canonical. I
fixed one of five printers. **The real fix is upstream**: a compound "X and Y" scene label is two
places, not a location name, and 39% of 537 archived scene labels are compound.

**The reveal arithmetic landed on chapter 9** because four components disagree about which chapter
the reveal is: the CML says act 3 scene 6 — *a coordinate that does not exist in this outline*, and
A_87 P3 measured `act 3 / scene 6` copied verbatim in **45 of 45** runs — the arbitration picks 9,
the outline's `revelation` beat is 10, and geometry warns about 8. Until that join resolves, every
reveal-chapter obligation is aimed by a copied placeholder.

### 13.4 STATUS

| item | status | commit |
|---|---|---|
| `AGENT9_CLUE_OWNERSHIP_BY_PAGE` | **WITHDRAWN — measured harmful**; narrowed guard in code, flag OFF | `56fced8e` |
| `AGENT9_VICTIM_RESCUE_EXACT_PREDICATE` | **confirmed on the page** — both frames gone | `56fced8e` |
| `AGENT9_PHRASE_LOCKED_BOUNDARY` | **confirmed** — the time glitch gone | `56fced8e` |
| `AGENT9_SKIP_ATMOSPHERE_REPAIR` | **confirmed** — skipped, density 675 → 612/10k | `56fced8e` |
| `AGENT9_LOCATION_LABEL_PROSE` | fired, ineffective — 4 of 5 printers unfixed; ON | `56fced8e` |
| `AGENT9_REVEAL_ARITHMETIC` | fired on chapter 9, not the confrontation; ON | `56fced8e` |
| Agent 7: a compound "X and Y" label must not enter the location registry | **recorded, not built** — upstream, 39% of scenes | — |
| the reveal-chapter join (CML placeholder vs arbitration vs beat vs geometry) | **recorded, not built** — A_87 family, blocks every reveal obligation | — |
| arm B as a read | **not recommended** — its reveal is capped by the withdrawn lever; read a book built without it | — |

### 13.5 What this cost and what it bought

£0.45. It bought the only thing a fresh run could not: proof that three of five fixes reach the page,
and proof that the fourth **makes the book worse** — before it shipped in a £1.29 run and an external
read. That is the matched pair working exactly as CLAUDE.md argues it should.

---

## 14. RUN 10845 — the first spatial book · 2026-09-12 · £1.2 + £0.45

**Parameters.** Seed 10845 (`node scripts/run-params.mjs --seed 10845`), spatial · 1930s · Village ·
Dark · short · private detective · classic · cast 5 (Oswald Ingram, Dr. Gerald Jardine, Dorothy
Underhill, Kenneth Merrow, Clarissa Ellery); theme "a concealment of WHERE the death happened — the
body moved, the true scene disguised"; angle "a brewery dynasty". **The project's first spatial
book**: the axis had 0 external reads against temporal's 9.

**Outcome.** The fresh run wrote 13,205 words and then **hard-stopped at the release gate** on one
clue; the prose never persisted. After the fix in §14.1 it was resumed (`resume-1789239262975`,
22.6 min) and shipped 11,701 words, gate **warning**, no fallback chapter:
`stories/story_20260912-2016/`.

### 14.1 THE RUN-KILLER: the floor planted what the matcher does not read

| | |
|---|---|
| the floor plants | the clue's `observable` |
| the gate's matcher (`buildClueSignatures`) requires tokens from | the clue's `description` **and** `pointsTo` |

On `clue_core_contradiction_chain` those are different sentences — *"Distinct knocking echoes and
structural differences are noted between the rooms"* against *"…the two rooms are separate; knocking
tests confirm their physical separation…"* — so the plant carried too few of the gate's tokens, the
floor logged *"NOT accepted by the gate matcher (hard-stop stands)"*, and thirteen stages of paid
artifacts were discarded over one clue.

WF-002 exactly: two components computing the same set, one feeding a WRITE and one a GATE. The floor
now plants from the SAME fields the matcher reads — observable, then description, then both, then all
three — and keeps its contract: accept only what the gate's own matcher then sees. Pinned against the
REAL `collectClueEvidenceFromProse` with this clue: the observable alone is not seen (the abort,
reproduced), the description is.

**Not confirmed in production.** The resumed prose carried the clue on its own, so the floor never
fired. The fix is verified by test against the deciding component, and by nothing else yet.

### 14.2 The predictions

| # | prediction | verdict | measured |
|---|---|---|---|
| 1 | a spatial case still fakes a TIME | **HELD** | apparent "half past ten at night", actual "twenty minutes past ten at night" — A_83's finding reproduced on a new axis and a new book |
| 2 | the deception pair fires | **NOT DETERMINABLE** (3rd run running) | the device locked 2 clocks, which the existing two-clock path already handles |
| 3 | the prose fixes hold outside a resume | **HELD** | the fresh run skipped the atmosphere pass (2 candidates) and shipped **14.4 repeated 6-word spans per 10k against a corpus median of 17.3 — "Normal"**, the first time in this sequence |
| 4 | anchoring holds on a second case | **HELD** | case **9/9**, clues **7/7**, outline **6/6** clock values resolve to a declared event |
| 5 | copying returns with ownership-by-page OFF | **it did not** | **0 whole-sentence copies of 596 sentences.** Run 81042's 29 were case-specific, not systemic — which is further reason the withdrawn lever was not worth its harm |

**`AGENT3B_DURATION_ANCHORS` was followed correctly, by not being used.** The device's one duration,
`death_to_sighting_interval`, declares `derivedFrom: [time_of_death, time_of_sighting]` — the right
declaration for an interval between two locked clocks — and correctly carries no `anchor`. Three runs
in, no device has yet locked a FREE duration, so the field itself is still untested.

### 14.3 A defect the shipped book still carries, and its fix

The book contains *"In a remembered moment, "You killed Oswald Ingram," Gerald said quietly…"*. Oswald
Ingram is the victim and the OBJECT of the killing; "said" belongs to Gerald. `hasActiveUse` looks for
the name followed by an active verb within 80 characters, so a dialogue tag two words later made the
corpse a live speaker and the canonical-victim rescue framed the line. **The third rescue frame in
three reads to land on a sentence nobody needed rescued** — and this time §12's exact-predicate fix
did not help, because the validator's own predicate was wrong.

`isConfessionKillObject` already encodes the judgement and was scoped to "I killed <name>" because
A_61 met it inside a confession. The subject was never the point. `isKillVerbObject` now covers any
subject, with the window stopped at the clause — no comma, semicolon, colon or quote between the verb
and the name. **The first cut used a bare 30-character window and suppressed the accusation's SPEAKER
as well**, caught by its own test before it shipped.

### 14.4 What the run says about the withdrawn lever, both ways

The rubric capped this book with *"reveal uses evidence not planted earlier"* and geometry warned
*"reveal_culprit_not_named (ch8)"* — the same two signals arm B produced in §13 — with
`AGENT9_CLUE_OWNERSHIP_BY_PAGE` **OFF**. So those signals also arise for reasons of their own, and
§13's attribution must be read as what it was: a matched pair on ONE case, where arm A lacked them and
arm B had them. The withdrawal stands on that comparison; this run shows the cap is not the lever's
private property.

### 14.5 STATUS

| item | status | commit |
|---|---|---|
| NSD-anchor floor plants what the matcher reads | built, pinned against the real matcher; **not yet exercised in production** | `bb4c0379` |
| `isKillVerbObject` — any subject, clause-bounded | built, pinned on the shipped line | @@COMMIT5@@ |
| run 10845 shipped after resume | `story_20260912-2016`, 11,701 words, gate warning, no fallback | @@COMMIT5@@ |
| the spatial book as a READ | **ready** — the first spatial read the project has ever had | — |
| Move 1's instrument stops before the prose | **recorded, not built** — the case/clues/outline anchor 9/9, 7/7, 6/6, and geometry still found 3 unaccounted times IN THE MANUSCRIPT | — |
| a device with a FREE duration | still unseen after 3 runs; `AGENT3B_DURATION_ANCHORS` untested | — |

### 14.6 The honest limit found here

`findUnanchoredClockValues` reads the case, the clues and the outline. It reported every clock value
anchored, and the geometry check independently found **three times in the manuscript** that nothing
accounts for. Move 1's instrument stops one layer before the reader. That is the next thing to
extend, and it is recorded rather than built because it needs a run to calibrate against.


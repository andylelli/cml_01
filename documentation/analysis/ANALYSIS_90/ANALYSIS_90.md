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

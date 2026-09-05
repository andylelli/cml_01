# Remediation plan — everything that may still cause issues in the generator, on ALL axes

**Opened 2026-09-04.** Scoped from the five most recent external reads (78, 76, 77, 83, 82) plus a
code audit of what those reads complained about. Every claim below is labelled MEASURED, INFERRED or
ASSUMED, and every measurement names what it was taken over.

Companion documents: `PLAN-TO-90.md` (the live score board), `FLAG-AUDIT.md` (the flag register).
This document does not replace either. It is a defect backlog with an axis dimension.

---

## §0 — Why this is not the same list as PLAN-TO-90

`PLAN-TO-90` asks *what raises the mark*. This asks *what is broken*. The two overlap but are not the
same set, and conflating them has cost this project before: a defect with no traceable reader
complaint still wastes calls, still aborts runs, and still ships wrong text.

Items here are ordered by **evidence strength × reach**, not by projected score.

---

## §1 — THE STRUCTURAL FINDING: verification is temporal, shipping is not

**MEASURED (2026-09-04) over `data/novelty-ledger.json`, 107 shipped runs:**

| axis | runs | share |
|---|---:|---:|
| temporal | 51 | 48% |
| behavioral | 21 | 20% |
| authority | 19 | 18% |
| spatial | 9 | 8% |
| identity | 7 | 7% |

**52% of shipped runs are NOT temporal.** The axis diversification worked (A_75: "the axis was never a
parameter" — four causes, all fixed 2026-08-22).

**MEASURED over the violation codes in `packages/story-geometry/src` + `packages/cml/src` — 20 codes,
and exactly half of them need clock data to fire at all:**

| requires a clock/duration | axis-general |
|---|---|
| `actual_covered` | `aftermath_repeat` |
| `apparent_not_covered` | `clearance_over_budget` |
| `times_identical` | `clincher_absent_at_payoff` |
| `declared_derivation_broken` | `clincher_not_planted` |
| `locked_time_arithmetic` | `contract_chapter_missing` |
| `reveal_times_not_stated` | `false_solution_absent` |
| `time_anchors_absent` | `method_signature_absent` |
| `time_model_unparseable` | `reveal_culprit_not_named` |
| `time_spines_disagree` | `reveal_method_absent` |
| `unaccounted_time` | `reveal_motive_absent` |

**MEASURED:** the two dedicated mechanism-coherence modules in the repo are `temporal-spine.ts` and
`timeline-deception.ts`. Zero files under `packages/cml/src` or `packages/story-geometry/src` mention
`spatial`, `impersonation`, `disguise` or `capability`.

**The precise statement, because the loose one is wrong.** These checks are not gated on the *axis* —
they are gated on the *shape*. An `authority` case with a timing mechanism gets all twenty (run 22362
did, and its X38 spine closed correctly). A case whose mechanism is a room layout, a mistaken
identity, or a claimed capability gets ten. So:

> **The mechanism-coherence half of this pipeline only exists for mechanisms made of clocks.**

**INFERRED, not measured:** that non-temporal cases therefore ship more mechanism defects. We cannot
measure it, because — see §4.1 — we have almost no non-temporal external reads. That gap is itself
the first work item.

---

## §2 — GROUP A: defects that ship today, axis-general, deterministic to verify

These need no judge and no external read. Each has a measured rate and a mechanical check.

### A1 — Cast name collisions violate a MANDATORY prompt rule *(reach: all axes)* — **DONE 2026-09-04 (`6fea6feb`)**

**MEASURED over 50 shipped casts:**
- **20% (10/50)** ship two characters sharing a first-name initial
- **8% (4/50)** ship two characters with the **same given name** (`Dr. Adela Quayle` + `Adela Jardine`)

`agent2-cast.ts:468` states the rule as mandatory — *"no two characters may share the same initial.
This guarantees name uniqueness across stories."* It lives **only in the prompt**. The cast checker
(`agent2-cast-checker.ts`) validates archetype distinctness, not names. `pickDistinctGiven` exists
only in `scripts/run-params.mjs`, so it never protects a non-seeded run.

Two of the five reads name it, and they are the two **lowest** `character_clarity` marks in the set
(5 and 6): *"Too many similar female names"*, *"Do not use Adela twice."*

**Change:** a deterministic post-Agent-2 repair — detect a collision, rename the later character from
the era-appropriate pool, propagate through the cast artifact before anything downstream reads it.
Agent 2 is the earliest point where the name exists, so nothing has been derived from it yet (the
same argument that makes the X60 "fail at the cheap end" fix correct).

**Flag:** `AGENT2_NAME_COLLISION_REPAIR`, default OFF.
**Verify:** deterministic — re-run the 50-cast audit; collisions must read 0.
**Falsifier:** if renaming produces a name that collides with a *location* or the victim's surname,
the repair has moved the defect rather than fixed it. Assert against both sets.
**Cost:** free to build; no run needed to verify.

**OUTCOME — and the diagnosis in the plan was half wrong, which is why it was measured first.**

The plan assumed Agent 2 was ignoring its own mandatory rule. It is not. `agent2-cast.ts` omits the
rule entirely when cast names are SUPPLIED (`!inputs.characterNames`), which is every seeded run, so
the seeded generator's output is final and unchecked. Split by who chose the names:

| names chosen by | casts | share an initial | share a given name |
|---|---:|---:|---:|
| the pipeline | 42 | 10% | **0%** |
| a seeded run | 8 | **75%** | **50%** |

All four books that shipped two characters with the same first name came from
`scripts/run-params.mjs`. `deriveNameInitials` was never at fault. `pickDistinctGiven` tracked used
NAMES, and both name pools carry the same sixteen initials (A–P).

Fixed in two places: the generator (rejection sampling, so a seed that never collided replays
byte-identically — measured: of 200 seeds, 85 changed and **all 85 had a collision**, zero
collateral), and `checkCast`, which gains `duplicate_given_name` / `shared_given_initial` for the 10%
residual on the path the generator cannot reach. checkCast is consumed in SHADOW, so that half is
visibility only and cannot regress a run.

Known-positive: replayed over 54 shipped cast artifacts it reports 4 + 6, against an independent
audit's 4 and 10 — the difference being exactly the casts that are both, which it does not
double-report.

**Still open from this item:** the pipeline path's 10% shared-initial residual is now *visible* but
not *repaired*, because `checkCast` does not drive a retry. Promoting it is a separate decision with a
B1 argument attached.

### A2 — Five scaffold templates still ship, two of them widely *(reach: all axes)* — **AXIS WORRY REFUTED; rewrite RECOMMENDED-AGAINST**

All five reads list "generator fingerprints". **MEASURED — which are ours:**

| phrase | source | shipped books |
|---|---|---:|
| `"…had passed before it was done"` | `agent9-run.ts` | **16** |
| `"The clocks put it at…"` | template | **17** |
| `"bent the trail toward…"` | template | 3 |
| `"could unsee what had just happened"` | `deterministic-repair.ts` | 3 |
| `"the logic stacked against the rest"` | template | 2 |

**AXIS NOTE, and it is the reason this item is not purely cosmetic:** the top two are *temporal*
templates. `"The clocks put it at…"` and `"…had passed before it was done"` are emitted when the
deterministic floor has to state a time or a duration. On a spatial or identity case they should not
fire at all — **if they do, the floor is stating time on a case that has none**, which is a worse
defect than the wording. That must be measured per axis before rewriting, not assumed.

Four further phrases the reads named are **NOT** in code (one book each, model-written):
`"Each detail was planted, waiting for its later significance"`, `"Clarissa's reasoning was
explicit"`, `"therefore X is the only person who could have committed the crime"`,
`"now detective-in-charge"`. The first is the worst thing in any of the five reads — it describes the
story as a constructed mystery — but it is not a template, so it is a prompt item, not a repair item.

**Change:** (a) measure per-axis firing of the two temporal templates; (b) if they fire on
non-temporal cases, that is a bug to fix at the floor, not the wording; (c) rewrite the wording of
whichever survive.
**Flag:** none for the measurement; `AGENT9_FLOOR_WORDING_V2` for the rewrite, default OFF.
**Verify:** deterministic — grep the manuscript.
**Falsifier:** rewriting a floor sentence can break the validator that floor exists to satisfy.
Every rewrite must be asserted against the **real predicate**, the way
`buildCulpritEvidenceSentenceInScene` was.

**A2 OUTCOME — the axis worry was the reason this item mattered, and it is refuted.**

A2 predicted that if the two temporal templates fire on a spatial or identity case, "the floor is
stating time on a case that has none". MEASURED over the 23 manuscripts joinable to a ledger row by
the `Run ID:` line the manuscript itself carries:

| axis | books | `The clocks put it at` | `…had passed before it was done` |
|---|---:|---:|---:|
| temporal | 12 | 6 | 4 |
| authority | 6 | 3 | 3 |
| identity | 2 | 2 | 1 |
| spatial | 2 | 1 | 0 |
| behavioral | 1 | 1 | 0 |

They fire on every axis — **and every book that fires one also states a clock in its own prose. Zero
exceptions.** Consistent with B1.1: the axis is nominal and the mechanisms are temporal regardless.
So this is a wording question, not a correctness one.

**The rewrite is RECOMMENDED-AGAINST, and the reason is in the code's own docblock.** These five
strings are a deliberate ROTATION, introduced to end an arms race with the leakage detectors:
*"The fix ends the arms race instead of joining it: no FIXED string ... none matching
TEMPLATE_LEAKAGE / DEBUG_NOTE_PATTERNS / the scaffold family — pinned by a test that asserts
non-membership."* A_47 had already renamed the template once to dodge that era's detectors.

Reviewers have now named **all five** variants — the three TIME_VARIANTS and both DURATION_VARIANTS —
across four different reads. Adding a sixth phrasing is exactly the move the docblock says was
abandoned, and there is no reason to think a human reader would miss it either.

**RECORDED INSTEAD, as a new sub-item worth more than the rewrite:** the distinctive string
`"The clocks put it at"` appears in **17 of 34** shipped manuscripts. That string is unlikely to be
natural prose, unlike its siblings (`"By then it was…"` is ordinary English, so the 91%
at-least-one-variant figure over-counts and is NOT claimed). A floor whose caller comment says it
"fires exactly when regen already failed" reaching half of all books means the floor is the primary
path, not a fallback — reviewers are reading our fallback prose because it is usually the prose. The
fix is upstream, at whatever makes the prose omit its locked facts, not in the wording.

### B2 — Two axis enums disagree — **DONE 2026-09-04: three lists, benign, now cross-referenced**

There are **three**, not two:

| list | axes | has `epistemic` |
|---|---:|---|
| `CmlAxis` (device-library) | 5 | no |
| `Axis` (novelty) | 6 | **yes** |
| `SCHEDULER_AXES` (cell-scheduler) | 5 | no |

MEASURED over 107 shipped runs: axes ever shipped are temporal, behavioral, authority, spatial,
identity. **`epistemic` count: 0.** Nothing can generate it; it exists only as a label the novelty
extractor may apply to a corpus work.

**Left divergent deliberately.** WF-002 triage asks whether one copy is the sole input to a WRITE.
Neither is: the scheduler is `shadow` and its own list excludes `epistemic` anyway, and the novelty
audit does not hard-fail. Narrowing `Axis` to five would throw away the extractor's ability to
classify a real novel that IS epistemic — a loss for no gain. The three declarations now carry a
shared comment naming each other and this measurement; the defect was that the divergence had to be
re-derived by hand.

### A3 — Chapters 8/9/10 overlap *(reach: all axes)*

**Named in 5 of 5 reads** — the most repeated complaint in the set, and the `ending` category is the
lowest-scoring of the ten (6, 5, 6, 7, 6).

Two pieces are **already fixed** and are not re-litigated here:
- the book ending on the injected culprit-evidence sentence (`9a531690`)
- the ch9 aftermath repair being unsatisfiable by construction — 44% of the chapters it ran on
  (`45507add`)

**Still open, and distinct from both:**
1. **Chapter 8 proves too much.** 0738 asks for *"Ch8 preparation only, Ch9 final trap only, Ch10
   aftermath only"* and says Ch8 *"goes too far into proving the solution"*. Nothing detects a reveal
   that lands a chapter early; `detectPrematureCulpritDisclosure` catches an explicit accusation
   before the reveal chapter, not a chapter that quietly completes the proof.
2. **Suspect clearances in Chapter 10.** Named in three reads. `AGENT9_CLEARANCE_TRIM` fires and is
   confirmed working, but the release gate still raised `aftermath_repeat` on the same run, so
   trimming clearances is not the same operation as removing the repeat.

**Change:** treat the chapter contract as the owner. The geometry already assigns roles
(`reveal`, `aftermath`); what is missing is a check that the *reveal work* is confined to the reveal
chapter.
**Flag:** `AGENT7_REVEAL_WORK_CONFINEMENT`, default OFF.
**Verify:** one run — `aftermath_repeat` absent at the release gate.
**Falsifier:** B1. If a new check fires on most runs it is an off switch with extra steps; baseline it
against the archive **before** wiring it, the way the 13% base rate was measured for
`detectFinalChapterVerdictEnding`.

---

## §3 — GROUP B: the axis gap

### B1 — Non-temporal mechanisms have no coherence check at all *(reach: 52% of runs)* — **B1.1 DONE; B1.2 RECOMMENDED-AGAINST 2026-09-04**

This is §1 restated as work. A temporal case cannot ship with the culprit's alibi covering the real
time of death without something firing. A **spatial** case can ship with the culprit in two places; an
**identity** case can ship with an impersonation witnessed by someone who knew both parties; a
**behavioral** case can ship with a capability the cast establishes the culprit lacks. Nothing looks.

**Do NOT build three new subsystems.** The temporal machinery took months and its own history says the
expensive part was the parser, not the arithmetic. Instead:

**B1.1 — First, find out whether the defect is real.** Replay the archive: for each non-temporal
shipped case, extract the mechanism's claimed invariant from `hidden_model.mechanism` and check it by
hand against the cast/locations. **n≈56 non-temporal runs.** This is free, and it answers whether
B1.2 is worth anything. **If the hand audit finds no incoherence, B1.2 is cancelled** — that is the
point of doing it first.

**B1.2 — Only if B1.1 finds a rate:** one *generic* invariant checker, not three. The shape common to
all five axes is *"the case asserts X and Y, and X contradicts Y"*. The temporal version is a special
case of it with a parser attached.

**Evidence tier:** B1.1 is T2 (archive replay). B1.2 would be T1→T3.
**Cost:** B1.1 free. B1.2 unknown until B1.1 reports — deliberately unscoped here.

**B1.1 OUTCOME — the audit did what it was put first to do: it cancelled B1.2.**

§1 MEASURED that half the structural codes need clock data and that 52% of shipped runs are not
temporal, then INFERRED a coverage gap. The inference is substantially **REFUTED**.

Over the 23 runs joinable to their CML artifact (ledger runId → projectId via `llm.jsonl`):

| axis | cases | mechanism carries a readable clock pair | locks a clock fact |
|---|---:|---:|---:|
| temporal | 14 | 86% | 71% |
| **authority** | 6 | **100%** | 67% |
| spatial | 1 | 100% | 100% |
| behavioral | 1 | 100% | 100% |
| identity | 1 | 100% | 0% |

That join reaches only 24 of 107 rows — the ledger predates both `llm.jsonl` and the current store —
so it was widened using the ledger's own prose (`falseAssumption`, `discrimDesign`, `crimeSubtype`,
`deathMethod`, `premise`) across **all 107**:

| axis | cases | any explicit time signal |
|---|---:|---:|
| temporal | 51 | 98% |
| identity | 7 | 71% |
| authority | 19 | 68% |
| spatial | 9 | 56% |
| behavioral | 21 | 48% |
| **ALL** | **107** | **78%** |

**And 78% is a FLOOR.** The signals were deliberately conservative — an explicit clock, an explicit
duration, or a named timing noun. Every case in the "no time signal" residue turns out to assert a
temporal relation without a clock: *"the murderer was seen in the lobby **at the time of the
murder**"* (spatial), *"Captain Hale was in his office **at the time of the murder**"* (authority),
*"poisoned **at the time of the toast**"* (behavioral), *"the gramophone was played **at the time of
the murder**"* (identity).

**So a non-temporal AXIS ships a temporal MECHANISM.** The axis varies only how the illusion is
produced — a clock, a mirror, a mask, a gramophone, a delayed poison — while the invariant underneath
is the same one the temporal machinery already checks: *someone appeared to be somewhere, or someone,
at a moment they were not.*

**B1.2 is therefore RECOMMENDED-AGAINST, not deleted.** Its whole justification was the coverage
argument in §1, and that argument does not survive the measurement. Building three axis-specific
coherence checkers — or one generic one — would be paying for reach the temporal checks already have.

**What the audit found INSTEAD, and it is not a verification defect:** the axis is largely nominal.
Run 22362 is labelled `authority` and its false assumption is *"the director's shouted rehearsal
start at twenty minutes past seven…"*. Six of six authority cases carry a readable clock pair. The
mechanism family barely varies with the axis — which matches DE2 dispersion telemetry from run 22362
(`mechanismFamily H=0.49, top "locked_room_timing" 60%`) and A_78's finding that the idea engine
draws 0.43% of its prompt from any real novel. **That is a novelty problem and belongs to the corpus
era, not to this defect backlog.** Recorded here so the observation is not lost with B1.2.

### B2 — Two axis enums disagree *(reach: novelty + scheduling)*

**MEASURED:** `packages/device-library/src/types.ts` defines `CmlAxis` with **5** members;
`packages/novelty/src/types.ts` defines `Axis` with **6** (adds `epistemic`). The device library
cannot produce an `epistemic` case, but the novelty extractor can classify one.

Per WF-002 divergence triage: two components computing the same entity set will disagree, and that is
harmful **only where one copy is the sole input to a WRITE**. Novelty gates shipping, so this needs
checking rather than assuming.

**Change:** determine which is authoritative, make the other derive from it.
**Verify:** deterministic.
**Cost:** free.

---

## §4 — GROUP C: instruments that see the defect and ship anyway

### C1 — The plausibility judge is `shadow` *(reach: all axes — arguably MORE important off-temporal)*

`AGENT3B_PLAUSIBILITY_JUDGE=shadow`. It scores and does not gate. Run 22362 scored 90; a prior run
scored **40 and shipped**.

Read 2136's central mechanism was physically impossible — *"a leather patch would muffle the sound,
but it would not literally delay sound by ten seconds"* — and that book scored `clues` 6. 0738's
optical trick *"needs a clearer mental picture"*, `clues` 6.

**This matters more off-temporal.** Clock arithmetic is checkable by the temporal machinery. A
spatial or behavioural mechanism's plausibility has **no** deterministic check, so the judge is the
only instrument that could catch it — and it is switched to advisory.

**Change:** at a score below a threshold, regenerate the device at the **design tier** (~$0.02)
rather than blocking. This is the same shape as `AGENT3B_ARITHMETIC_REGEN`: bounded to one attempt,
accepted only if it clears, reverts otherwise — so it can never abort a run.
**Flag:** `AGENT3B_PLAUSIBILITY_REGEN`, default OFF, threshold configurable.
**Verify:** shadow telemetry first — what is the score distribution across the archive? Pick the
threshold from that, not from intuition.
**Falsifier:** if regeneration at the threshold rarely clears, the judge is measuring taste rather
than physics and the flag goes off.

### C2 — Advisory gates generally

Run 22362 shipped with: the pronoun gate flagging **13** issues, four geometry release-gate warnings,
and `SHIP-CHECK final-chapter ending` firing. All advisory.

**Do not flip them to blocking.** B1 says a check that fires on most runs is an off switch with extra
steps, and a gate that drives retries costs **+2.43 register points** on the retried chapter
(measured). The question for each is: *is there a prompt operation or a post-pass that removes the
cause?* — which is exactly what the culprit-injection fix turned out to be.

**Change:** enumerate every advisory gate, and for each record whether its cause has an owner. Not a
code change — a register pass. `FLAG-AUDIT` already does this for flags; nothing does it for gates.
**Cost:** free.

---

## §5 — GROUP D: known-unverified

### D1 — `parseTemporalValue` is a second parser, and it is blinder than the first — **DONE 2026-09-04 (`3f629f01`)**

**MEASURED 2026-09-04:** the temporal spine's parser returns null for `"seven fifteen"`,
`"seven twenty"`, `"twenty past three"`, `"five forty-five"` — all of which `parseClockTime` reads
correctly. It reads `"a quarter past seven"`, `"3:20"` and `"half past ten"`.

**Exposure, stated honestly: 2 of 60** clock-valued locked facts in the archive
(`"twenty past ten"`, `"twenty past seven"` — the *"X past Y"* form without "minutes"). **Latent, not
currently biting.** But memory records this exact shape silencing X38 for a week, and a null parse is
indistinguishable from a clean case.

**Change:** delete the second parser. `parseTemporalValue` should delegate to `parseClockTime` and add
only the `dayOffset`/`qualifier` layer it needs. Two bodies computing "what time is this" is the trap
this repo has already been bitten by three times.
**Verify:** deterministic — the differential over all 156 locked-fact values must show zero
disagreement.
**Cost:** free.

**OUTCOME.** The "strict subset" argument in the docblock was sound in the abstract and wrong here:
`parseTemporalValue` is only ever handed `fact.value`, a structured field, so the false positive the
strictness guarded against cannot arrive. `readDialMinutes` now delegates to `parseClockTime`; the
day/daypart/meridiem layer stays, since it has no counterpart there.

Verified before changing anything: `parseClockTime` refuses all ten things the spine must refuse
(durations, dimensions, prose) — 0 violations — so delegation could not make it credulous.

**Two further defects fell out, neither of them the one this item was opened for:**

1. `parseClockTime("midday")` was **null** while `"noon"` read 12:00 — the one point where the strict
   subset was strictly *better*. Normalised once at the top of `parseClockTime` rather than added to
   the word table and five regex alternations. It also recovered a real alibi window,
   `"Between midday and one o'clock"` (wide readability 89% → 90%; narrow unchanged at 64%).

2. **The parity test found a silent value corruption on its first run.** The spine tested whether a
   phrase *contained* `midnight` and then discarded the dial reading:

   | value | `parseClockTime` | spine (before) |
   |---|---:|---:|
   | `"ten minutes past midnight"` | 10 | **0** |
   | `"a quarter to midnight"` | 705 | **0** |

   Both are real locked-fact values. A quarter to midnight read as midnight exactly — a
   fifteen-minute error in a number the arithmetic check then reasons from as fact. Fixed with the
   direction included, because it inverts: *past* midnight is 00:10 and morning, *to* midnight is
   23:45 and the night before; noon is the mirror of it.

`temporal-spine-parser-parity.test.ts` now runs a differential over all **156** distinct locked-fact
values on disk and asserts the two parsers never disagree — that guard is the actual deliverable, not
the delegation.

### D2 — Durations asserted in prose are unchecked

1907 caught real arithmetic the pipeline did not: *"3:20 to 5:45 is 2h25, not 1h55."* The
declared-derivations check covers **locked facts** and fired correctly on run 22362, but free prose
lines — `"It had taken twenty minutes in all"`, `"It had taken ten seconds in all"` — are never
verified against the case. Note the overlap with A2: those sentences come from the same floor.

**Change:** when the floor states a duration, it must state the one the case declares. Not a new
check — a builder that reads the registry instead of composing text.
**Cost:** free.

### D3 — Transcribed but not investigated

Listed so they are not lost. **None of these has been verified in code**; each needs a
five-minute audit before it earns a work item.

- **0738:** prose says *"stage manager's exclusive access"* while the culprit is Kestrel, not the
  stage manager — a role-attribution error in a floor sentence.
- **2136:** the missing blade fragment is found *after* the confession. `AGENT7_PLANT_BEFORE_REVEAL`
  is ON, so this slipped past it — either the clue was `optional` (the X52 shape) or the plant window
  is computed from the wrong chapter.
- **0738:** a repeated setting phrase across chapters — *"Grand Marquee Theatre District, cloaked in
  drizzle and expectation"*.

---

## §6 — Explicitly OUT of scope, with reasons

- **Character Life / Relationship Richness.** Named in all five reads (6–8), and nothing in the
  pipeline targets it. It is excluded here because it is a *craft* ask — "give the relationships
  personal history" — with no deterministic check and no measured lever. It belongs in
  `PLAN-TO-90`, not in a defect backlog. Recorded so it is not mistaken for an oversight.
- **Rewriting the mechanism families.** The reads ask for clearer mechanisms; A_78 already
  established the idea engine draws 0.43% of its prompt from the corpus. That is a corpus-era item.
- **Any score claim from a single read.** A single external read carries ±3, no judge separates an 86
  from an 81, and book-level A/B on chapter-level effects needs 250+ pairs. Nothing in this document
  claims a mark.

---

## §7 — Ordering

Ordered by **evidence × reach ÷ cost**. Everything in the first block is deterministic to verify and
needs no paid run.

| # | item | reach | evidence | run needed? |
|---|---|---|---|---|
| 1 | **A1** name collisions | all axes, 20% of books | MEASURED | no |
| 2 | **D1** delete the second clock parser | temporal | MEASURED | no |
| 3 | ~~**B1.1** hand-audit non-temporal coherence~~ **DONE — refuted the gap, cancelled B1.2** | 52% of runs | MEASURED | no |
| 4 | **A2** per-axis firing of the two temporal floor templates | all axes | MEASURED reach | no |
| 5 | **B2** two axis enums | novelty | MEASURED | no |
| 6 | **C2** advisory-gate register pass | all axes | — | no |
| 7 | **D2** floor durations read the registry | temporal | MEASURED | no |
| 8 | **C1** plausibility threshold from archive distribution | all axes | shadow telemetry first | then 1 |
| 9 | **A3** reveal-work confinement | all axes | 5/5 reads | 1, after baselining |
| 10 | ~~**B1.2** generic invariant checker~~ **RECOMMENDED-AGAINST — B1.1 refuted its premise** | — | — | — |

**Items 1–7 cost nothing but time.** Item 3 gates item 10 and may cancel it. No paid run is required
before item 8.

---

## §8 — Standing rules this plan inherits

- Every flag default OFF, registered in `FLAG-AUDIT.md`, env read at **call time** (ADR-0004).
- Baseline a gate against the archive **before** wiring it (B1).
- A negative result from a new probe is a claim about the **probe** until it fires against a
  known-positive.
- Pair artifacts by `projectId`, never by name.
- Do not report a sub-threshold delta as an effect.
- Update this board in the same commit as the code it describes; never delete an item — move it to
  recommended-against with the reason.

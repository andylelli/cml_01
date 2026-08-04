# Agent 7.5 — Story Geometry Compiler · high-level design

**Written:** 2026-08-03 · **Companion to:** [STORY-GEOMETRY.md](STORY-GEOMETRY.md) (what the concept is) and [THINK_01.md](THINK_01.md) (why we need it). This document is the build shape: what the agent does, what it must never do, and how it sits among the agents we already have without duplicating any of them.

**Design constraint from the brief:** *no overlap; every agent has a clear boundary.* That is the organising principle below, and it turned out to be the hardest and most useful part of the design — because two components already occupy part of this space.

---

## 1. The finding that shapes everything below

Before designing anything, the obvious question: **does this already exist?** Partly, twice, and neither is switched on.

| Package | What it does | State |
|---|---|---|
| **`@cml/beat-scheduler`** | `buildSceneGrid` — lays the CML's obligatory beats into a scene grid that is complete, ordered, exact-count and ≥60% clue-bearing *by construction*. Obligation kinds include `plant_clue { id, revealScene }`. Invariants: `checkComplete`, `checkOrdered`, **`checkPlantBeforeReveal`** (plant ≥2 slots before reveal), `checkCoverage`. | Pure, unit-tested. Its own header: *"Stage A: pure, no LLM, **NOT wired into the pipeline**."* Runs in shadow (`AGENT7_SCHEDULER_SHADOW` default ON, "acts on nothing"); `AGENT7_SCHEDULER_AUTHORITATIVE` default OFF |
| **`@cml/clue-spec`** | `deriveClueSpec(cml)` — computes the clue slots that *must* exist from the frozen CML, rather than generating then policing them | Pure, unit-tested. *"NOT wired into the shipped generate-then-audit path."* Shadow-reports each run: *"17 required slots; 100% of shipped clues map to one"* |
| **`timeline-deception.ts`** | `checkTimelineDeception` — the directional invariant for false-time concealments: the *apparent* time must sit inside a window the culprit can account for, the *actual* time outside it. Built in response to an external review that called the timeline "backwards" | Pure, total, unit-tested, **exported from the package index — and called by no agent** |

**The project has made the derive-don't-police turn three times and wired in none of them.** Meanwhile `agent7-run.ts` retrofits the same properties with what its own scheduler comment calls *"~700 lines of band-aids."*

**This reframes the whole proposal, and the reframing is the most important correction in this document.**

> Story geometry is **not mainly a missing capability. It is a missing integration point.** Three pure, tested modules already implement large parts of it. What has never existed is a stage that owns them, runs them in one place, and gates on the result.

Three consequences:

1. **The geometry agent is not greenfield** — and its job description shrinks accordingly. Most of the derivation exists; what is missing is ownership, a gate, and an acceptance test.
2. **Geometry is defined as what those modules do *not* cover** (§5), or it becomes a fourth thing in the same space.
3. **The failure mode to design against is not "we lack checkers" — it is "checkers get built and never wired."** The one integration mechanism that *is* wired, the locked-fact layer, satisfies obligations by **injecting text** — which is external complaint #1 in every review. That is the disease, stated precisely.

---

## 2. What Agent 7.5 does

Five responsibilities, and nothing else.

1. **Derive** the `StoryGeometry` object from the frozen CML plus the Agent-7 outline — deterministically wherever possible.
2. **Resolve two creative choices** the case model deliberately leaves open, via one small LLM call: *which physical trace is the clincher*, and *whom the false solution accuses*.
3. **Close the time model** — assert that the manuscript's temporal anchors reduce to exactly two: `true_time` and `apparent_time`.
4. **Gate the outline.** A geometry that cannot be closed is an outline defect. Bounded outline repair, then continue with a loud warning. Never a prose-stage abort.
5. **Own the post-prose acceptance test.** The same object, re-checked against the finished manuscript; violations become regen feedback naming the missed obligation.

Responsibility 5 is what makes it a distinct agent rather than a utility:

> **Every other stage asserts about a plan. Agent 7.5 is the only stage that writes its acceptance test *before* the artefact exists and enforces it *after*.**

---

## 3. What Agent 7.5 does NOT do

Explicit, because each line is a boundary someone will be tempted to cross.

- **It does not write or edit prose.** Not one sentence, not one injected clause. This is the [Black & Wilensky](STORY-GEOMETRY.md) lesson and external complaint #1 in the same rule.
- **It does not invent case facts.** CML is frozen upstream and read-only here ([ADR-0005](decisions/0005-story-bible-freeze.md)).
- **It does not invent clues.** That is `clue-spec` + Agent 5. The clincher is *selected* from evidence that already exists, never authored.
- **It does not assign scenes or order beats.** That is `beat-scheduler` + Agent 7.
- **It does not re-audit fair play.** Agent 6 answers "can the reader solve it". Geometry answers "does the manuscript deliver it".
- **It does not score, cap, or judge quality.** No overlap with the rubric.
- **It does not abort a run that has already generated prose** ([ADR-0003](decisions/0003-never-abort-release-gate.md)).

---

## 4. Boundary reconciliation

### 4.1 The three-part ownership test

A field belongs to Agent 7.5 **only if it passes at least one** of these — otherwise it belongs to an existing owner:

1. **Whole-manuscript**: the property is about the finished text as a whole, not about one scene or one clue.
2. **Negative**: it says what must *not* appear (no existing component models a negative obligation).
3. **Open selection**: the case model leaves a genuine choice the logic doesn't determine.

Anything derivable from the CML alone → `clue-spec`. Anything about *which scene* discharges an obligation → `beat-scheduler`. That test is the whole anti-creep mechanism.

### 4.2 Who owns what

| Stage | Owns | Agent 7.5 must never |
|---|---|---|
| **Agent 1** Setting | Era, place, physical world | Constrain or invent setting |
| **Agent 2** Cast | Who exists, roles, motives | Change a role or a motive |
| **Agent 2b/2c/2d** Profiles | Character voice, locations, temporal *context* | Author character or location detail |
| **Agent 2e** Background | Backstory | — |
| **Agent 3b** Hard logic | The mechanism / device | Design the mechanism |
| **Agent 3 (+4)** CML | The case: culprit, method, timeline, inference chain | Alter the case — read-only |
| **Agent 5 + `clue-spec`** | Which clues and red herrings must exist | Invent a clue |
| **Agent 6** Fair play | Solvability by the reader | Re-audit solvability |
| **Agent 6.5** World | The world document | — |
| **Agent 7 + `beat-scheduler`** | The scene grid: which scene discharges which obligation; dramatization | Assign scenes, reorder beats, or re-derive the plant schedule |
| **Agent 8** Novelty | Corpus distinctiveness | — |
| **Agent 7.5 Geometry** | **The manuscript contract, and its acceptance test** | *(see §3)* |
| **Agent 9** Prose | The sentences | Write or edit text |

### 4.3 The one genuine tension, and how it resolves

`beat-scheduler` already owns `plant_clue` and `checkPlantBeforeReveal`. STORY-GEOMETRY §5 listed `plant_schedule` as a geometry field. **Both cannot own it.**

Resolution: **the scheduler owns it; geometry consumes it.** The plant schedule is distributional — *which of N scenes* — and that is the scheduler's definition. Geometry reads the grid and adds only the plants the scheduler has no obligation kind for: the **method signature** and the **clincher**.

Same resolution for clue coverage (Agent 6 keeps it) and for the beat ordering (Agent 7 keeps it). **Geometry adds fields; it never re-implements one.**

---

## 5. The gap — what nothing currently owns

Each row names the component that would be the natural owner and why it does not cover it. This is the entire justification for a new stage.

| Geometry field | Test | Why no existing owner covers it |
|---|---|---|
| `time_model` — **the manuscript contains no third time** | whole-manuscript | ⚠️ **Corrected on audit.** The CML *does* carry exactly two times (`actual_time_of_death` / `apparent_time_of_death`, both required, with a directional invariant in `timeline-deception.ts`). The gap is not the model — it is that **nothing binds the manuscript to it**. The locked-fact layer enforces *presence* of a canonical value, **by injection**, and never *exclusivity*. `the_clock_s_deception` shipped 8:50, 10:15 *and* 11:10 against a two-time model |
| `clincher` — one trace unique to the culprit | open selection | `clue-spec` derives slots from inference steps; **no slot type is "the single decisive physical trace"**. Both external reviewers asked for it by name |
| `method_signature` — the method's physical evidence, chapter 1 | whole-manuscript | ⚠️ **Narrowed on audit.** `CASE.death_method` *is* modelled, prompt-enforced ("MUST be a bodily killing action, distinct from the concealment") and rubric-gated (weak-murder-method cap). The gap is only the **plant obligation**: `beat-scheduler` plants **clues** (`plant_clue`), and no obligation kind plants the *method's physical signature*. Hence *"the murder method disappears"* |
| `chapter_contract.must_not_contain` | **negative** | The `Obligation` union is **entirely positive** — `introduce_victim`, `reveal_clue`, `plant_clue`… There is no way to express "the aftermath chapter must not re-reveal". Hence *"Chapter 10 repeats Chapter 9"* |
| `false_solution.accused ≠ culprit` | whole-manuscript | ⚠️ **Corrected on audit.** It *is* specified — `agent3-cml.ts` instructs "The accused_suspect MUST NOT be the real culprit", and `beat-scheduler` carries `false_solution.accused_suspect`. But it is **an instruction to the generator with no downstream validator**, and story 1810's chapter 6 accused the actual murderer anyway. Prompt-only enforcement of a hard constraint is exactly what a contract is for |
| `frequency_rule` — no event narrated twice unmotivated | negative + whole-manuscript | AtmosphereRepair detects repeated *phrases*; nothing detects a repeated *event* |

Six fields. **Not one is derivable from the CML alone, and not one is about which scene something lands in** — so none of them belongs to `clue-spec` or `beat-scheduler` under the §4.1 test.

---

## 6. Data contract

```
INPUT   (all read-only)
  cml                frozen case model                    — Agent 3/4
  clues              clue set + red herrings              — Agent 5
  narrative          outline (acts → scenes, beats)       — Agent 7
  sceneGrid          obligation grid                      — beat-scheduler (shadow today)

OUTPUT  ctx.storyGeometry : StoryGeometry
  time_model        { true_time, apparent_time }
  clincher          { trace, unique_to_culprit, plant_by_chapter, payoff_chapter }
  method_signature  [ { evidence, plant_chapter } ]
  chapter_contract  [ { chapter, role, must_contain[], must_not_contain[] } ]
  false_solution    { accused, proposed_chapter, collapse_chapter }
  clearance_budget  { max_sentences, in_scene: true }
  closure           { closed: bool, unmet: [...] }

  DELIBERATELY NOT FIELDS — reconciled with STORY-GEOMETRY §5 on audit:
    plant_schedule   → owned by `beat-scheduler` (§4.3). Geometry consumes it.
    hermeneutic      → descriptive vocabulary, not an independent constraint;
                       its content is already expressed by chapter_contract + the grid's ordering.
    frequency_rule   → subsumed by chapter_contract.must_not_contain, which is
                       the enforceable form of "do not narrate this event again".

  persisted via onArtifact as "story_geometry" → resumable (R5)
  surfaced on the report as a geometry diagnostic → readable (A_70/A_71 rule)
```

**One LLM call**, on the cheap deployment, with two questions: which trace is the clincher, and whom does the false solution accuse. Everything else is derivation.

---

## 7. Integration

```
Agent 6.5 (world) → Agent 7 (outline)
                          ↓
              ┌───────────────────────────┐
              │  Agent 7.5 — GEOMETRY     │
              │  derive · resolve 2 · GATE│
              └───────────────────────────┘
                    ↓ closed          ↓ not closed
              Agent 9 (prose)   bounded outline repair
                    ↓                 (re-run 7, re-derive)
        post-prose acceptance test ──→ regen feedback
```

**Pre-prose check.** Closure is checked against the outline, where repair is free and no prose tokens have been spent — the pattern [ADR-0002](decisions/0002-sequential-prompt-chaining.md) defends.

**A precision the diagram overstates:** because an unclosable geometry must never abort a run ([ADR-0003](decisions/0003-never-abort-release-gate.md)), this is a **repair trigger with a warning**, not a hard gate. It buys bounded outline repair before the expensive stage; it does not stop the run. Calling it a "gate" would claim an enforcement strength it deliberately does not have.

**Post-prose acceptance test.** The same object re-checked against the manuscript. A violation produces **regen with feedback naming the missed obligation**. Never an injected sentence — that is the defect this whole line of work exists to remove.

**Failure semantics, in the order they matter:**
- Outline cannot close → bounded repair, then **continue with a loud warning**. Never abort.
- Manuscript violates the contract → regen the offending chapter. Bounded. Then ship with the violation recorded on the report.
- Geometry stage itself throws → warn, set `geometry: unavailable`, continue. A new stage must not become a new abort class.

---

## 8. The Agent 9 interface — in detail

This is the load-bearing seam. Geometry only earns its place if Agent 9 actually consumes it, and the design has to fit the prose stage that exists rather than the one we'd like.

### 8.1 Geometry meets Agent 9 exactly twice

**As an input**, before a chapter is generated — a contract stating what must be true of that chapter.
**As an acceptance test**, after the chapter (and after the whole manuscript) — the same object, re-checked.

It never appears as a third thing: no text, no template, no example sentence. A contract and a test, nothing between.

### 8.2 As prompt input — mapping onto blocks that already exist

Agent 9's prompt builder already classifies every block by `priority` and `stability` (`run` / `chapter` / `attempt`) — the machinery R8 added for prefix-ordered caching. Geometry drops into that taxonomy without inventing a new concept:

| Geometry field | Block key | Priority | Stability | Why |
|---|---|---|---|---|
| `time_model` | `geometry_time` | critical | **run** | identical in every chapter |
| `clincher` (identity + payoff chapter) | `geometry_clincher` | high | **run** | |
| `method_signature` | `geometry_method` | high | **run** | |
| `chapter_contract[N]` | `geometry_chapter` | critical | **chapter** | differs per chapter |
| violation feedback on a retry | `geometry_feedback` | critical | **attempt** | only on attempt ≥2 |

**Three of the five are run-stable, so they land inside the cached prefix and cost almost nothing after chapter 2.** That is measured, not hoped: the 08-02 run served **139,392 cached prompt tokens**, with chapter 3 alone at 23,680 of 24,521 tokens cached. A run-stable geometry block is paid for once.

The one genuinely new thing on the prompt surface is `must_not_contain`. **Every existing block is positive** — do this, include that. That is not an accident of style; it is why "chapter 10 repeats chapter 9" has no upstream owner.

### 8.3 Contract, not copy

The block states obligations in the vocabulary of the finished text, and stops:

```
CHAPTER 10 — role: aftermath
  must contain:      consequence and reaction to the arrest
  must not contain:  any suspect clearance, any restatement of method,
                     motive, or the clock deception — chapter 9 delivered these
```

What it must never contain is the sentence itself. *"Eleanor held the torn fabric beside Hugo's cuff…"* is the external reviewer's suggestion, not our prompt: the moment geometry supplies prose, it becomes the injector layer under a new name, and complaint #1 returns.

**One prompting subtlety worth designing around.** Negative instructions are weak — naming a thing you don't want raises the chance the model produces it. So `must_not_contain` is expressed to the model **positively, as a role** ("this chapter is aftermath: consequence and reaction only") and enforced **negatively by the acceptance test**. The prompt gets the role; the validator gets the prohibition.

### 8.4 Where it enters the existing repair ladder

Agent 9's ladder today: *generate → chapter validators → retry with feedback → scoped regen passes → polish → release gate.* Geometry enters at two existing rungs and adds none:

- **Chapter-local violations** — the reveal doesn't disclose; the clincher is absent; chapter 1 lacks the method signature. These are visible in one chapter, so they become a new defect signal on the **existing retry-with-feedback rung**.
- **Cross-chapter violations** — the aftermath repeats the reveal; a third clock time appears. **These are invisible chapter-locally**, which is exactly why they survive today. Host them in the existing `AGENT9_FULLSTORY_DIAGNOSTIC` pass (`off | shadow | apply`, default off) rather than building a second whole-story reader.

### 8.5 Reuse of the regen registry

Twelve regen passes exist. Geometry violations map almost entirely onto them:

| Geometry violation | Pass | Verdict |
|---|---|---|
| Reveal chapter doesn't disclose | `resolution` | **reuse** |
| Clincher absent from the reveal | `culprit_evidence` | **reuse** |
| Clearances delivered as a register | `clearance` / `suspect_elimination` | **reuse** |
| Method signature missing from chapter 1 | `clue` (closest fit) | reuse, or one narrow `method_plant` |
| **Aftermath repeats the reveal** | — | **NEW** — nothing expresses a negative |
| A third time appears | — | pre-prose defect; must never reach Agent 9 |

**At most two new passes, and one of them is optional.** The registry's drift test (`regen-registry.test.ts`) already fails if a thirteenth pass is added without registering it, so the boundary is enforced by CI rather than by discipline.

### 8.6 Negative constraints need a different repair primitive

This is the part with no precedent in the codebase, and it deserves stating plainly:

> **A positive constraint is satisfied by adding text. A negative constraint can only be satisfied by removing or rewriting it.**

A full-chapter regeneration to *delete* a repeated reveal risks dropping locked facts, clue mentions, or cast names along the way — which is why the acceptance validators exist. The right primitive already exists and is unused: **`AGENT9_REGEN_EDIT_LIST`**, which returns only the changed paragraphs and splices the untouched ones verbatim, so anything the pass didn't name **cannot drift by construction**.

The `aftermath_repeat` pass should ride that channel. This also gives a default-OFF, never-probed lever its first compelling use case — FLAG-AUDIT lists its stronger argument as safety, not cost, and this is precisely that argument.

### 8.7 Geometry replaces a heuristic Agent 9 already has

`resolveStageModeKey` (`clue-validation.ts`) *infers* a chapter's stage mode — including `aftermath_consequence` — from the outline's beat labels. That is A_67's beat-aware classifier, built because the final chapter kept re-staging a reveal an earlier chapter had already delivered.

Geometry **declares** the chapter role instead of inferring it. So this is not a new mechanism competing with an old one: the stage-mode machinery stays exactly as it is and gets a *declared* input instead of a *guessed* one. Same for `applyPlantBeforeReveal`, whose stamping becomes redundant once the scheduler's grid is authoritative.

### 8.8 What Agent 9 must never receive from geometry

- Sentences, templates, or example prose — of any kind
- Clue text (that is `clue_descriptions`)
- A restatement of the fair-play contract (that is `fair_play_contract`)
- Anything already in `locked_facts`, `narrative_state`, or `discriminating_test`

If a geometry block would duplicate an existing block, the geometry block is wrong. **Note that `first_appearance_contracts` is about characters** — pressure cues, no confessions on a first appearance — so geometry's `method_signature` and `clincher` plants do not collide with it. They are adjacent, and separate.

### 8.9 Ordering inside Agent 9

Where the check runs is not a detail. This codebase has already paid for getting it wrong once — deterministic post-processing running *after* validation, corrupting clean output with nothing to re-validate it.

Two rules:

1. **The chapter-level geometry test runs on the committed chapter text, after all deterministic post-processing** — never before. A sweep that runs later can otherwise violate a constraint that had already passed.
2. **The whole-manuscript geometry test runs after every chapter is committed and before the polish pass** — so polish cannot introduce a violation, and so a violation is repaired before the expensive line-edit rather than after it.

### 8.10 Failure semantics and telemetry

- Violations produce **bounded** regeneration, then the run ships with the violation recorded. Never an abort ([ADR-0003](decisions/0003-never-abort-release-gate.md)).
- Every constraint emits its outcome to the report as a geometry diagnostic — `{ field, chapter, satisfied, repaired }` — including the satisfied ones. **A zero that is never written is indistinguishable from a check that never ran**, which is the A_70/A_71 rule and the exact defect that left the `[R4]` counters unreadable.
- The whole object is persisted as an artifact, so a resumed run inherits the contract rather than re-deriving a different one.

---

## 8bis. The competing explanation, and how to tell them apart

**Added on audit, because it survived scrutiny and changes the sequencing.**

This design attributes the 68-scoring run to *missing geometry*. There is a simpler rival explanation, and the evidence for it is real:

> `the_clock_s_deception` shipped **9 chapters**, with chapter 9 titled *"The Culprit Revealed"* carrying both the suspect clearances **and** the reveal — and it delivered neither properly. `the_clockwork_deceit` shipped **10**, with the reveal (`final_trap`) and the aftermath (`revelation`) in separate chapters, and scored 80.
>
> `beat-scheduler/schedule.ts` already enforces the precedence laws — *"clue-before-test, test-before-reveal, false-before-test, victim/crime in Act I, **reveal last with no clue after**"* — and its canonical Golden-Age beat list already contains `final_trap` and `revelation` as **distinct** beats.

**So the rival hypothesis is: story B failed because the outline mis-allocated beats, and an authoritative `beat-scheduler` would have prevented it — with no geometry agent involved at all.**

That hypothesis is not obviously wrong, and taking it seriously has three consequences:

1. **Phase 0 is promoted from "recommended first" to a prerequisite.** Measuring geometry's value against today's retrofitted outline would credit geometry with gains the scheduler produced.
2. **The discriminating test is cheap:** promote the scheduler, run ≥4, and count the endgame failures. If incomplete reveals stop, geometry's remaining scope is the *craft* ceiling (clincher, aftermath repetition, manuscript-time binding) rather than the *completion* failures — a smaller and less urgent brief.
3. **What geometry owns is unaffected either way.** The scheduler cannot express a negative obligation, has no clincher concept, and never sees the manuscript. Those three gaps stand whatever the scheduler does — but their *value* is craft-ceiling value, not variance-elimination value, and [THINK_01](THINK_01.md) argued variance is where half the gap lives.

**Stated plainly: if the scheduler alone fixes the completion failures, the honest expected value of Agent 7.5 falls substantially, and it should be re-justified before phase 2.**

---

## 9. What must not change

- **Never-abort survives** ([ADR-0003](decisions/0003-never-abort-release-gate.md)). The gate binds the *outline*; the manuscript path only ever regenerates.
- **No injectors are added, and the aim is to remove some.** Once geometry covers an obligation by construction, the injector for it should fall to a zero firing rate and then be deleted — measured, not assumed.
- **The corpus regime holds**: flag-gated, runtime-read, default-OFF, shadow before authoritative.

---

## 10. Build sequence

Each phase is independently probeable and independently abandonable.

| Phase | What | Probe |
|---|---|---|
| **−1** | **Hand-author one geometry object** for an existing premise and feed it to prose. Needs a temporary prompt block behind a flag — ~20 lines, not zero code. | First-pass chapter success vs. the 64%/71% baseline. **If it doesn't move, stop — the thesis is wrong** |
| **0** | **Prerequisite (§8bis):** promote `beat-scheduler` and `clue-spec` out of shadow; wire `timeline-deception` | Endgame failure rate across ≥4 runs. **This is also the discriminating test between geometry and the scheduling explanation** — and it may deliver much of the benefit on its own |
| **1** | Agent 7.5 derive-only, **shadow**. Emits `StoryGeometry` + closure diagnostics against outline and finished manuscript. Changes nothing. | Do the diagnostics flag the defects the external reviewers flagged, on stories we already have? Free to check against 1810/1936 |
| **2** | Pre-prose gate (flag-gated) | Outline-repair rate; first-pass chapter success; generation-side cost |
| **3** | Post-prose acceptance test → regen feedback channel | Regen volume; violation rate at ship |
| **4** | Retire superseded band-aids — `applyPlantBeforeReveal`, the aftermath classifier, `enforceSuspectEliminationPresence` | Each one's firing rate at zero across ≥4 runs before deletion |

**Phase 1 is unusually cheap to validate**: we have two manuscripts with detailed external reviews. A geometry compiler that does not flag "three clock times", "chapter 9 never discloses", and "chapter 10 repeats chapter 9" on those two files is not ready for phase 2 — and that test costs nothing.

### 10.1 Build record — what actually landed, 2026-08-03

| Phase | Status | Where it lives | Flag / default |
|---|---|---|---|
| **−1** hand-authored probe | **skipped, deliberately** | — | Superseded: phase 1 costs no more than the probe would have, and produces a reusable stage rather than a throwaway one. The probe's question — *does a contract raise first-pass chapter success?* — is answered by flipping `AGENT9_GEOMETRY_CONTRACT`, which is the same experiment with nothing discarded |
| **0** promote scheduler / clue-spec / wire timeline-deception | **partial** | `agent75-run.ts` | `checkCaseTimelineDeception` is **now called** — for the first time since it was written — and its violations become geometry closure failures. Promoting `beat-scheduler` and `clue-spec` out of shadow is a **spend decision left to the owner** (§8bis, §11 Q1): it is a flag flip plus ≥4 runs, not code |
| **1** derive-only, shadow | **built** | `@cml/story-geometry`, `runAgent75` | `AGENT75_GEOMETRY=shadow` (default) |
| **2** pre-prose gate + prompt binding | **built, default-OFF** | `applyGeometryOutlineRepair`, four prompt blocks | `AGENT75_GEOMETRY=gate`, `AGENT9_GEOMETRY_CONTRACT` |
| **3** post-prose acceptance test → regen | **built** | `checkManuscriptGeometry` in `agent9-run.ts`; `runAftermathRepeatRegenPass` | `AGENT9_GEOMETRY_ACCEPTANCE=shadow` (default), `apply` + `AGENT9_REGEN_AFTERMATH_REPEAT` for repair |
| **4** retire superseded band-aids | **not started, correctly** | — | Gated on each band-aid's firing rate reaching zero across ≥4 runs. Deleting `applyPlantBeforeReveal` or `enforceSuspectEliminationPresence` before that measurement exists would be exactly the unmeasured change this document argues against |

**Three deviations from the design above, and the reasons.**

1. **The two read-only halves default to `shadow`, not `off`.** The corpus regime says default-OFF; but §1 of this document says the failure mode to design against is *"checkers get built and never wired"*, and a checker that ships `off` is that failure mode with a flag on it. Both shadow paths are deterministic and cost no LLM call, so the default buys measurement for nothing. The three halves that **change behaviour** — the outline repair, the prompt binding, the repair ladder — are all default-OFF as the regime requires.
2. **The LLM resolve (§6) is default-OFF, and the deterministic path is complete without it.** The clincher is *selectable* from the existing clue set by rank, and the false accused is already a CML field. A stage whose derivation depends on a call it may not make reports "unavailable" the first time the cheap deployment hiccups.
3. **`geometry_feedback` (§8.2, row 5) is not built.** It has no reachable producer: §8.9 puts the chapter-level acceptance test strictly after the retry loop that would consume it. Geometry violations reach the model through the regen instruction instead. See FLAG-AUDIT Addendum 7.

**What is measured but unprobed.** Every constraint's outcome — satisfied ones included — is on the report as `agent9_prose_story_geometry`, and the contract itself as `agent75_geometry_contract`. No run has yet exercised any of it. **Phase 1's acceptance criterion is asserted as a unit test** (`story-geometry/src/__tests__/accept.test.ts`) against reconstructions of the two 08-02 defect shapes — which is not the same as running it on the real manuscripts, and does not substitute for it.

---

## 11. Open questions for the owner

1. **Does `beat-scheduler` get promoted first, or does geometry ship against the current retrofitted outline?** Recommendation: promote first — building a contract on top of "~700 lines of band-aids" means the contract inherits their failure modes. But it is a separate spend decision.
2. **Agent 7.5, or an extension of Agent 7?** Recommendation: a separate stage, because it is the only component with a *post-prose* responsibility, and folding that into the outliner would blur exactly the boundary this document exists to draw.
3. **Is the clincher always required?** Some Golden-Age plots resolve on testimony or a logical trap rather than physical evidence. Recommendation: required by default, waivable by an explicit `resolution_kind` on the case — but not silently absent.
4. **How many chapters does the contract bind?** Recommendation: begin with the three that carry every measured defect — chapter 1 (method signature), the reveal, the aftermath — and extend only on evidence.

---

## 12. The design in one paragraph

Agent 7.5 derives a small, machine-checkable contract for the finished manuscript — two times, one clincher, the method's signature in chapter one, and what each of the three load-bearing chapters must and must not contain — gates the **outline** on it before any prose token is spent, and re-checks it against the finished text as an acceptance test whose failures become regeneration feedback rather than pasted sentences. It owns no clue, no scene assignment, and no sentence: the plant schedule stays with `beat-scheduler`, the clue set with `clue-spec`, solvability with Agent 6, and prose with Agent 9. It exists because six specific properties — every one of them either whole-manuscript, negative, or an open selection — have no owner today, and all six are visible in the external reviews of the last two runs.

### 10.2 Phase-1 backtest — result, 2026-08-03

`node scripts/geometry-backtest.mjs` · no LLM call, no run, no cost. Reconstructs each 08-02 run's
frozen CML, clue set and **shipped** outline from `documentation/prompts/actual/`, derives the
contract, and re-checks it against the manuscript in `stories/`.

**Verdict: PASS on the §10 criterion.** All three named defects are flagged: `third_time`,
`reveal_culprit_not_named`, `aftermath_repeat`. Two of the three fired on the story the reviewer
raised them against; the aftermath repeat fired on 1810 and the reveal failure on 1936, matching
[THINK_01 §3](THINK_01.md) rows 3 and 5 exactly. `clearance_over_budget` also fired on 1810
chapter 10 — 7 clearance sentences against a budget of 2 — which is reviewer complaint #5,
unprompted.

**The criterion nearly passed for the wrong reason, and that is the most useful thing it produced.**
The first run reported `reveal_culprit_not_named` on 1936 — but pointed at the *wrong chapter*, and
when pointed at chapter 9 (the one the reviewer said *"only points toward Hugo"*) it reported
**compliant**. Cause: the check was paragraph-scoped, and the shipped markdown carries 5–8-sentence
paragraphs, so "Hugo Vane" and the word "guilty" co-occurred inside a paragraph that is a
suspect-clearance register naming nobody as the murderer. Now sentence-scoped, with a regression test.
**A conjunction is only evidence at the granularity a reader reads it** — and this repository's
committed paragraphs are not that granularity, which is worth checking in every other detector that
tests two conditions against `paragraphs.some(...)`.

#### Four findings about the runs themselves

1. **1936's central deception is backwards in both directions — and nothing had ever checked.**
   *(FIXED 2026-08-03: `checkCaseTimelineDeception` moved into `@cml/cml` and is now enforced by
   `validateCml`, so this reaches Agent 4's revision loop pre-prose. It is deliberately conservative —
   absent or unparseable times yield no violation, so a case that does not fake a time is never
   blocked. The body moved rather than being called across the dependency edge, because `@cml/cml` is
   a leaf; `@cml/prompts-llm/timeline-deception.ts` is now a re-export, not a second copy.)*
   `apparent_time_of_death: "ten minutes to nine"`, `actual_time_of_death: "quarter past eight"`, and
   the culprit Hugo Vane's alibi window is `8:10 to 8:30` — which *contains* the real time of death
   (so he could not have done it) and *excludes* the staged one (so faking it does not protect him).
   `checkTimelineDeception` returns both `actual_covered` and `apparent_not_covered`. That function
   was written in response to an external review calling a timeline "backwards", was exported, and
   until this stage **had never been called by any agent**.

2. **The manuscript's true time is not the case model's true time.** 1936 shipped *"By then it was a
   quarter past ten"* as the operative time of death and states it in the reveal. The CML's
   `actual_time_of_death` — "quarter past eight" — appears **zero times in the whole manuscript.**
   The prose did not merely add a third clock reading; it silently re-based the case's central fact
   onto a value the model never contained, repairing an incoherent case by inventing a coherent one.
   The locked-fact layer enforces the *presence* of a canonical value and never its *exclusivity*, so
   nothing objected. This is the sharpest possible statement of why `time_model` needs to bind the
   manuscript rather than the case.

3. **1810's culprit was chosen by array position — and the position it chose was the falsely accused
   suspect.** *(Corrected 2026-08-03: the first reading of this finding said the run shipped with no
   culprit at all. That was wrong, and the correction makes it worse.)* Agent 3 returned
   `culpability: { culprit_count: 1, culprits: [] }` — the model never decided who did it — and
   `normalizeCml`'s silent fallback filled the gap with the first culprit-eligible cast member. That
   was **Captain Ivor Hale, who is also `false_solution.accused_suspect`.** Confirmed downstream: by
   Agent 6 the clue ids read `culprit_direct_captain_ivor_hale`. The external reviewer's complaint on
   that story was, verbatim: *"Chapter 6 accuses Hale, but Hale is guilty."*

   `agent3-cml.ts` has instructed *"The accused_suspect MUST NOT be the real culprit"* for months.
   Nothing checked it, and the fallback that violated it logged nothing — so on the report, a
   fabricated answer was indistinguishable from a decided one. **Fixed at source** (2026-08-03):
   `validateCml` now rejects an empty culprit list, a culprit who is the accused / the victim / the
   detective / cast-ineligible / absent from the cast, and a count that disagrees with the names — as
   validation ERRORS, so Agent 4's revision loop repairs them pre-prose. The fallback now prefers a
   cast member the model actually marked guilty, excludes the falsely accused, and records what it
   invented in `normalizationNotes`, surfaced on the run warnings. **This was never a geometry defect;
   geometry's backtest is only how it was found.**

4. **§8bis's rival explanation is visible in the artifacts.** 1810 shipped the canonical ten-beat arc.
   1936 shipped `… false_solution → final_trap → revelation → revelation` — `secrets` and `pattern`
   dropped, the terminal beat duplicated, nine chapters. Its chapter 7 is labelled `final_trap` but
   titled "The Discriminating Test", so the geometry contract inherited the mislabelling and bound
   the reveal to chapter 7 rather than 9. **A contract derived from a mis-beat outline is bound to
   the wrong chapters**, which is the strongest available argument for promoting `beat-scheduler`
   *before* trusting geometry's chapter roles — exactly the ordering §8bis and §11 Q1 recommend.

#### What the backtest does NOT establish

**Signal separation is weak.** Five violations on the 68 and five on the 80 (four, discounting the
null-culprit artifact). The acceptance test does not currently rank the two stories, and nothing here
claims it should — it is a checklist, not a judge. The one quantitative separation is extra clock
times: **2 on the 80, 5 on the 68.**

**And a methodological finding worth more than the backtest.** "The last Agent-7 response is the
outline that shipped" is **false**: run 1654 produced three outlines (10 beats, then 10 with a
duplicated `revelation`, then 9) and the manuscript matches the **first**; run 1818 produced two and
the manuscript matches the **second**. The prompt record does not say which candidate the pipeline
kept. Any replay harness that hydrates "the outline" by taking the last response is **replaying an
outline the run never used** — and matched-pair A/Bs are the project's only measurement tool.

**Audited 2026-08-03, and the harness has it.** `readLatestAgentJson` (two bodies —
`canary-agent-boundary.mjs` and `canary-agent3.mjs`) takes `matches[matches.length - 1]`, the
highest-sequence response record, for every agent code. `.actual-run-state.json` stores only
`sequence`, `agent`, `retryAttempt`, hashes and file names: **no validation status, no success flag,
nothing recording which candidate was committed.** So the correct attempt is not merely un-chosen —
it is *unrecoverable* from the artifacts.

Scale: **10 of the 11 recorded runs** have at least one multi-attempt agent (Agent 7 in 8, Agent 2 in
5, Agent 3 in 3). Hydrating the wrong Agent-7 attempt hands the replay a different **chapter count**,
which is one of the two variables that dominate any single-run comparison and precisely what
matched-pair A/B exists to hold fixed.

*Interim fix applied:* both call sites now emit `HYDRATION_AMBIGUOUS code=… attempts=N using=… ` when
more than one response exists, so the guess is on the record instead of inside it. **The real fix is
to hydrate from the COMMITTED artifacts** — the `onArtifact` store production resume already reads —
rather than from the prompt log. That unification is the open scope note in `resume-hydration.ts`, and
it should land before any probe whose conclusion depends on matched upstream.

### 10.3 Self-review, 2026-08-03 — four defects in the geometry code itself

Found by adversarial review of §10.1's build, before any of it was probed. Three were **silent**: they
produced confident, wrong output rather than failing.

| # | Defect | Why it mattered |
|---|---|---|
| 1 | **The reveal contract could vanish.** Contracts were added opening → false_solution → reveal → aftermath, skipping any chapter that already had one. An outline whose false-solution beat lands on the reveal chapter — which happens whenever there is no `final_trap` beat and the last chapter is `false_solution` — dropped the **reveal** contract, and with it every disclosure check. | The most important obligation in the object disappeared because of the order two lines were written in. Now resolved by explicit precedence (reveal > aftermath > false_solution > opening), with positives merged and only the winning role's prohibitions kept — a one-chapter story would otherwise carry "must name the culprit" and "must not reveal the culprit" in the same contract |
| 2 | **Chapter lookup was positional.** `chapters[n - 1]` is correct only while the array is dense, in order, and starting at 1. Reordering a compliant manuscript produced **six fabricated violations**, including "the reveal never names the culprit" against a chapter that names them in its first sentence. | A misaligned checker is worse than none: it reports confidently, and in `apply` mode it would regenerate clean chapters to repair defects they do not have. `chapterIndexFor` now treats a declared `chapterNumber` as authoritative and falls back to position only when nothing declares one |
| 3 | **The clincher trace could be authored prose.** A resolve returning an unknown clue id plus a sentence attached free text to a *different* clue's id and marked it `source: "llm"`. The probe's output was the external reviewer's own suggested sentence travelling into the prose prompt as the clincher. | §3 breached through the back door — a trace that maps to no clue is an invented clue. A restatement is now honoured only when it belongs to a clue that exists |
| 4 | **A repair that claimed a fix it had not made.** `clincher.plantByChapter` was "corrected" to `max(1, payoff - 1)`, which for a one-chapter story leaves plant == payoff while reporting the repair. | A closure re-check then reads as a pass. It now declines to claim the repair when there is no earlier chapter to move to |

One boundary tightening, not a bug: the clincher block re-printed a whole clue description into a
run-stable prompt block, which §8.8 forbids (`clue_descriptions` owns clue text). The object keeps the
full trace for the report; the prompt now gets a ≤90-character noun phrase plus an explicit pointer at
the clue list.

**What this says about the rest of the design.** Defect 2 is the general one: *a conjunction is only
evidence at the granularity a reader reads it, and an index is only a chapter if something guarantees
the ordering.* The same class produced the near-miss in §10.2 (paragraph-scoped instead of
sentence-scoped). Both were invisible in unit tests written against tidy fixtures and visible
immediately against real data — which is the argument for the backtest existing at all.

All four are covered by regression tests naming the defect, in
`packages/story-geometry/src/__tests__/`.

### 10.4 First live run, 2026-08-04 — and two detector corrections it forced

`npm run canary:core` at default flags. Story shipped, exit 0, no new abort class. Both halves of the
stage executed for the first time:

```
[Agent 7.5 geometry:shadow] chapters=10 contracts=1:opening,6:false_solution,8:reveal,9:aftermath closed=true
[Agent 9 geometry:shadow]   11 checks, 3 violation(s): third_time, clincher_absent_at_payoff, reveal_method_absent
```

Both diagnostics reached the artifact (`agent75_geometry_contract`, `agent9_prose_story_geometry` —
11 checks, 8 satisfied, extra times located by chapter and phrase). **Flag-off confirmed on the wire,
not in the code**: across all 42 prompt records, zero occurrences of any geometry block marker.

#### The finding that outranks the stage: the pipeline has two time models

| | apparent | true |
|---|---|---|
| `hidden_model.mechanism` (what geometry, `timeline-deception` and the rubric read) | "quarter past eight" | "quarter past seven" |
| appearances in the shipped manuscript | **0** | **0** |
| locked-fact registry (what the prose injector prints) | "a quarter to four" (5×) | "ten minutes past four" (6×) |

Agent 3b designs the device, locks its times and injects them into prose. Agent 3 authors the
mechanism's times and its prompt never receives the device's. Nothing reconciles them, so every check
reading the mechanism is measuring a timeline the book does not have — and `third_time` is a TRUE
detection of an incoherence that originates two stages upstream of the manuscript.

`checkLockedFactTimeAlignment` (agent3-run) now reports the split. It deliberately does not repair it:
`false_time_displayed` ↔ `apparent_time_of_death` is unambiguous, but `resumption_time` is when the
mechanism restarted — not when anyone died — and writing `actual_time_of_death` from it would
fabricate the coherence claim the case failed to make. **The root fix is to give Agent 3 the device's
locked times**, which is a prompt change and therefore a flag and a probe.

**This blocks phase 2.** Enabling `AGENT9_GEOMETRY_CONTRACT` today would put the mechanism's two
times into the prompt as a hard contract while the locked-fact layer injects two different ones —
two mandatory blocks contradicting each other on every chapter.

#### Two detector corrections the corpus forced

**`clearance_over_budget` had the test backwards.** It required a clearance word AND an evidence
connector in the same sentence. Story 1810's chapter 9 — the register a reviewer called *"validation
logic, not story"* — reads *"You are cleared." / "You are ruled out." / "You could not have done
it."* and scored **zero**, because a bare verdict cites no evidence. The conjunct was filtering out
the most mechanical clearances and keeping the ones that at least show their reasoning. Now a plain
count: 1810 ch9=3, ch10=11, 08-04 ch8=3 (all over budget), while the 08-04 aftermath's two
dialogue-borne clearances stay within it — which is what `inScene` asks for.

**The clincher rests on an `optional` clue, on every run measured.** All three picked
`clue_late_optional_slot_1`. The selection is right on content — it is the only physical trace in the
set, and it is the "torn fabric" both reviewers asked for by name — but geometry then binds a
load-bearing obligation to a clue no other stage must place, which is exactly why 1936 failed both
clincher checks. Recorded as a `closure.notes` entry: it does not block closure (the contract is
satisfiable) and it is no longer silent. The real fix is §5's missing slot type, and belongs to
`clue-spec` when it leaves shadow.

#### One defect found by accident, outside geometry entirely

`agent6-run.ts` cleared its transient warnings with `ctx.warnings = ctx.warnings.filter(...)`.
`filter` returns a NEW array, and that call is unconditional — so every run severed `ctx.warnings`
from the orchestrator's array, and **everything Agent 7, Agent 7.5 and Agent 9 pushed after it went
nowhere**. The run logged "Release gate warning: scene-grounding coverage below target" to the console
and recorded it on no artifact; every archived report shows zero `[Agent 9]` warnings. The clearing
never worked either — the report's array still held every line it meant to remove. Fixed by mutating
in place, with a property test that scans every agent for the reassignment.

`mystery-orchestrator.ts` asserts the invariant in a comment — *"Everything Agent 9 pushes to
ctx.warnings aliases this array, so this captures the whole run"* — inside the A_64 §2 F5 fix for
exactly this blindness. **A comment is not a check.**

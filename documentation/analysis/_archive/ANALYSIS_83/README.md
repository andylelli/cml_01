# ANALYSIS_83 — Does every axis reach 80+? And what does the code check when it is not temporal?

**Date** 2026-09-07 · **Cost** £0, all measurement against artifacts already on disk · **Method** the
built `dist`, the artifact store, `logs/llm-prompts-full.jsonl`, and the external-read ledger.

---

## 0. The question, and the one-line answer

> *"Check that we should be getting 80+ scores for all axes. Check the code for any weaknesses or
> extra checks needed for certain axes."*

**Two of the five axes have never been read by a human, and on the other three the axis reaches the
case's REASONING but not the DEVICE it is built around.**

The first draft of this document said "the axis is a label on a clock". That is wrong, and the
correction is the most useful thing here. MEASURED over all 107 shipped runs in
`data/novelty-ledger.json`, the axis-carrying fields are genuinely on-axis: a clock value appears in
the false assumption of 33% of temporal runs against 11% of authority, 14% of identity and **0% of
behavioral and spatial**; time vocabulary appears in the discriminating test of 86% of temporal runs
against 5% of behavioral and 11% of spatial. X88/X90/X91/X92 worked.

What did not move is one layer down. MEASURED over the 53 stored cases: **15 of 15 non-temporal cases
stage a false TIME of death** (against 30 of 38 temporal ones), 80% of an authority run's locked facts
are clock facts, and an authority book carries more clock language per 10,000 words of finished prose
than a temporal one. Agent 3b invents a clock device whatever the axis, Agent 3 then hangs an
axis-shaped false assumption off it, and the result is an authority story about a trusted clock
reading — every time, with no alternative ever generated.

Nothing checks this, or could: **there is not one deterministic check anywhere that compares any
produced artifact to `primaryAxis`.** Every warning that mentions the axis is about the INPUT being
missing or unrecognised.

---

## 1. How the axis of a past run was recovered

There is no axis field in the report, the story folder, or the manifest. The join used here is exact,
not nearest-neighbour, and the difference matters — a nearest-in-time join assigns aborted runs to a
neighbour's manuscript and silently invents rows (it mapped four different projects onto
`story_20260905-1242`).

    Agent-3 prompt in logs/llm-prompts-full.jsonl   ->  "Primary Axis: <axis>"  + projectId
    manuscript header                               ->  "Run ID: mystery-<epoch>"
    projectId canary_<epoch>                        ->  |Δ| <= 10 s, exact

`llm-prompts-full.jsonl` begins 2026-07-24, so runs before that are unjoinable — but they need no
join: until **X70 (2026-08-20)** the orchestrator coerced every unrecognised axis to `temporal`, so
every earlier read is temporal by construction.

**Refuted on the way:** the log shows several projects with two axes, which looked like the axis
drifting mid-pipeline. It is not. Agents 3, 3b, 5 and 7 all print the same axis in every case; **Agent
8 alone prints the whole five-value taxonomy** because its novelty prompt lists them. Checked per
agent across all 8 mixed projects — 8/8 consistent.

---

## 2. What has actually been read (MEASURED)

Post-X70 era, runs from 2026-08-21. Headline is the external reader's `/100`.

| axis | books read | headline | 80+ | mean |
|---|---|---|---|---|
| temporal | 9 | 74, 79, 81, 82, 82, 84, 84, 85, 85 | 7/9 | 81.8 |
| authority | 4 | 76, 77, 82, 83 | 2/4 | 79.5 |
| identity | 2 | 78, 85 | 1/2 | 81.5 |
| **spatial** | **0** | — | — | — |
| **behavioral** | **0** | — | — | — |

Category means, same set:

| | prem | hook | plot | char | dial | atmo | clues | pace | end | prose |
|---|---|---|---|---|---|---|---|---|---|---|
| temporal (9) | 8.3 | 7.8 | 7.8 | 7.9 | 7.0 | 8.2 | 7.2 | 7.8 | 7.2 | 6.6 |
| authority (4) | 8.0 | 7.5 | 7.5 | 6.8 | 7.0 | 7.8 | 6.3 | 7.5 | 6.0 | 6.3 |
| identity (2) | 8.5 | 8.0 | 7.5 | 7.5 | 7.5 | 8.5 | 7.0 | 7.5 | 6.5 | 6.5 |

**Do not read the headline gap as an effect.** A single read carries ±3 marks and no judge separates
an 86 from an 81; a 2.3-mark difference between n=9 and n=4 is unmeasured. The claims that ARE safe:

1. **spatial and behavioral have zero external reads.** One run each exists (both 2026-08-22, the
   axis sweep). "We get 80+ on all axes" is not a weak claim about them, it is an unmade one.
2. Every axis has produced at least one 80+ book, and authority has produced 83.
3. `ending` and `clues` are the two weakest categories on authority (6.0 and 6.3) — and §4 gives a
   mechanism for exactly those two, which is why they are worth a second look rather than dismissing
   as noise.

**Abort rate**, post-X70, from the report archive: temporal 6/22 (27%), authority 3/9 (33%), identity
2/5 (40%). Underpowered, but the CAUSES differ and that is informative: two of the three authority
aborts are at Agent 7 (`finish_reason=length`, then `content_filter` on `narrative_outline`) against
one of 22 temporal. And one identity run aborted on **`actual_covered`** — a temporal-deception
defect, in an identity story.

---

## 3. THE FINDING — the axis reaches the reasoning, not the device

### 3.0 First, what is NOT broken (n=107, the whole shipped ledger)

`data/novelty-ledger.json` records the declared axis and the case's own text for **107 shipped runs**
— twice the sample the artifact store holds. Against it, the axis-carrying fields are on-axis:

| axis | runs | clock value stated in the false assumption | time vocabulary in the discriminating test |
|---|---:|---:|---:|
| temporal | 51 | 17 (33%) | 44 (86%) |
| authority | 19 | 2 (11%) | 7 (37%) |
| identity | 7 | 1 (14%) | 2 (29%) |
| spatial | 9 | 0 (0%) | 1 (11%) |
| behavioral | 21 | 0 (0%) | 1 (5%) |

A behavioral case's wrong belief is a behavioral belief, and the detective proves it without a clock
in 20 of 21 runs. **The axis diversification is real and this section does not dispute it.** The
defect is one layer below, in the device — and separating the two is the whole point, because
"the axis does not work" would have sent a fix to the wrong agent.

### 3.1 Every non-temporal case stages a false time of death

MEASURED over the 53 `cml` artifacts in `data/store.json`, joined to axis as in §1:

| axis | cases | stage a TIME deception | locked facts that are clock facts |
|---|---|---|---|
| temporal | 38 | 30 / 38 (79%) | 124 / 145 (86%) |
| authority | 9 | **9 / 9 (100%)** | **24 / 30 (80%)** |
| identity | 4 | **4 / 4 (100%)** | 12 / 19 (63%) |
| spatial | 1 | **1 / 1** | 3 / 4 |
| behavioral | 1 | **1 / 1** | **4 / 4 (100%)** |

A temporal case is *less* likely to fake a time than a non-temporal one. The probe is not
vacuous: 8 temporal cases carry empty time fields, so an empty pair is detectable and detected.

### 3.2 The primary devices, by name

Every non-temporal device the pipeline has ever produced, with its locked-fact ids:

    authority   The Tide-Timed Silence                  high_tide_time, murder_claimed_time, ...
    authority   The Tide-Delayed Switch at the Dock     high_tide_time, message_logged_time, tide_delay_interval
    authority   The Time-Shifted Stage Clock            clock_winding_position, clock_displayed_time_at_murder,
                                                        true_time_of_death, time_shift_interval
    authority   The Marquee's Phantom Cue               official_cue_time, actual_cue_time, cue_time_shift_interval
    authority   The Conductor's Silent Baton            murder_time_estimate, sound_cue_time, sound_delay_interval
    authority   The Director's Overshadowed Cue         director_public_cue_time, hidden_bell_ring_time, ...
    authority   The Prop Master's Silent Cue            prop_master_silent_cue_time, actual_vocal_cue_time, murder_time
    authority   The Marquee Shadow Timestamp            shadow_angle_measurement, forged_rehearsal_time, ...
    authority   The Stage Manager's Backdated Call Sheet call_sheet_date, actual_call_sheet_creation, ...
    behavioral  The Anchored Memory Clock               clock_stop_time, clock_service_time, witness_anchor_time,
                                                        murder_actual_time
    identity    The Shadow Hour Displacement            sundial_shadow_time, lobby_clock_time_at_murder,
                                                        clock_fast_interval
    identity    The Harvest Festival Double-Role Confusion festival_arrival_time, bell_chime_time, ...
    identity    Costumed Double Exit                    first_exit_time, second_footstep_time, travel_time_between_rooms
    identity    The Spotlight Shadow Swap               spotlight_angle, shadow_orientation, time_of_scene, ...
    spatial     The Shadowed Staircase Passage          lamp_position_angle, door_lock_release_time, ...

`The Time-Shifted Stage Clock` **is** `clock_rewind`, the curated temporal seed pattern, wearing an
authority label. `The Anchored Memory Clock` is a stopped-clock device with a behavioral label and
four clock facts out of four.

`The Tide-Timed Silence` deserves its own line. `shared.ts`'s own docblock names it as *"the first
authority case ever generated"* and cites it as the defect X90 fixed. X90 fixed the FAMILY LIST. The
second tide-and-clock authority device (`The Tide-Delayed Switch at the Service Dock`) was generated
**after** that fix. The leak was closed one layer above where it happens.

### 3.3 It reaches the page

Clock phrases per 10,000 words of finished prose (`o'clock`, `quarter past/to`, `half past`,
`N minutes past/to`, `H:MM`):

    authority   33.5   (6 books)
    behavioral  42.7   (1 book)
    temporal    32.6   (24 books)
    identity    15.0   (3 books)
    spatial     13.0   (1 book)

**An authority book carries more clock language than a temporal one.** This is not a case-level
abstraction that the prose quietly drops; it is what the reader gets.

**A sub-hypothesis, REFUTED.** The natural next claim is that these off-axis clock values are more
likely to be decoration — locked into the prose and never used by the reasoning — because the axis
does not need them. Run `findDecorativeTimeFacts` over every case joinable to its device registry and
it is not so: authority 14/24 (58%), identity 6/9 (67%), temporal 62/99 (63%). The rate is flat. The
T3 finding is a property of how cases are built, not of which axis they are built on, and the two
should not be argued as one thing.

### 3.4 Why — the prompt

`packages/prompts-llm/src/agent3b-hard-logic-devices.ts` is where the device is invented. It gives
the axis **one line**, as a bare label in a context block:

    - Primary axis: ${inputs.primaryAxis}

with no gloss (Agent 3 has `PRIMARY_AXIS_MEANING`; Agent 3b has nothing) and no instruction that the
device must turn on it. The same prompt then spends roughly **sixty lines** on locked-fact guidance,
essentially all of it clock-tampering: `derivedFrom` on intervals, "check your own arithmetic",
"every other clock time must be placed on the shift, or off it", "then check the mechanism points the
right way". The one line telling the model not to reach for a clock —

    a stopped/rewound clock is ONE family among many ... do not default to the clock

— is scoped to **SECONDARY devices only**, and the primary device is the one that writes the locked
facts and the CML.

So the model is told, in effect: *the axis is authority; now build a clock device and get its
arithmetic right.* It complies. Per this project's own finding, **the model complies with operations
and ignores labels** — sixty lines of operations beat one line of label, every time.

---

## 4. What the code checks, by axis

### 4.1 Nothing is verified against the axis

    grep primaryAxis  ->  every warning is about the INPUT
      shared.ts:837   "primaryAxis not specified; defaulting to temporal"
      shared.ts:850   "Unknown primaryAxis ..."

There is no check anywhere that the false assumption, the mechanism, the device, the clues or the
outline are on the axis that was asked for. `validateCml` runs schema + inference-path quality +
cross-references + culprit integrity + `checkCaseTimelineDeception`. Four axis-neutral, one temporal.

### 4.2 The one deep structural check is temporal-only

`checkCaseTimelineDeception` verifies the invariant that makes a concealment worth having:

> the STAGED fact must exculpate the culprit, and the REAL fact must not

That invariant is not temporal. It generalises exactly:

| axis | staged fact | must exclude the culprit | real fact must admit them |
|---|---|---|---|
| temporal | apparent time of death | inside their alibi window | actual time outside it |
| spatial | apparent scene of death | somewhere they had no access to | true scene somewhere they did |
| identity | who was taken for whom | the believed identity has no motive/means | the true one has both |
| behavioral | the unbreakable habit | if true, they could not have acted | the exception admits them |
| authority | the trusted record/testimony | if believed, it clears them | the unchecked fact implicates them |

Only the first row exists in code. The other four have no representation at all — not a check, not a
schema field, not a prompt contract. **This is the single largest axis-shaped hole in the pipeline.**

### 4.3 Geometry: 5 of 15 codes are temporal — and they are NOT dormant off-axis

`time_model_unparseable`, `locked_time_arithmetic`, `time_anchors_absent`, `unaccounted_time`,
`reveal_times_not_stated`.

The expected complaint — "a third of geometry does nothing on a non-temporal book" — is **refuted by
§3.1**: because every non-temporal case fakes a time anyway, `deriveTimeModel` finds both values and
all five codes fire normally. The real cost is the opposite one: **a non-temporal story inherits
every temporal failure mode without getting any axis-specific check in exchange.** The identity run
that aborted on `actual_covered` is that bill, paid in full.

### 4.4 Raw material, per axis

Device-library retrieval, 1930, corpus flag ON (`DEVICE_LIBRARY_INCLUDE_CORPUS=true`, as shipped):

| axis | patterns retrievable |
|---|---|
| spatial | 9 |
| temporal | 7 |
| behavioral | 7 |
| **identity** | **2** |
| **authority** | **2** |

Seed exemplars in `examples/` that `buildNoveltyConstraints` can sort to the front (it matches
`false_assumption.type` exactly):

| axis | seeds |
|---|---|
| identity | 4 |
| temporal | 2 |
| spatial | 2 |
| **behavioral** | **0** |
| **authority** | **0** |

6 of the 14 seeds are invisible to that sort: five use an older `false_assumption`
(`description/correction/effect_on_case`) with no `type` at all, and `the_big_bow_mystery` declares
`"timing_error / witness_suggestion"` — free text, not one of the five allowed values, so it matches
nothing and would fail the schema's own `allowed:` list.

Encoded corpus works (`library/works/`) by case axis: spatial 5, behavioral 4, identity 3, temporal 1,
**authority 0**. Three works are correctly skipped as `failed` by the A_79 evidence gate — one of
them (`the_leavenworth_case`) is identity, which is why identity has 2 device patterns rather than 3.

**Authority has zero exemplars of any kind** — no seed, no encoded work — and two device patterns. It
is also the axis with the most runs (9) and the lowest reads.

### 4.5 A dead branch worth naming

No pattern in the library — curated or corpus — has `family: "behavioral"`. Measured: 0 of 20.
`device-library-block.ts`'s A_79 §7.1 note says the five previously-null novelty families
(`hidden_accomplice`, `disguised_natural_agent`, `unconscious_act`, `role_invisibility`,
`investigative_blind_spot`) were remapped to `behavioral` because *"with the corpus installed it
does"* have patterns. It does not. **Behaviour is unchanged** — both paths emit no block — so this is
a wrong comment rather than a regression, but it records coverage that has never existed.

---

## 5. What to do — ordered by evidence × reach ÷ cost

**A1 — Give Agent 3b the axis as an OPERATION, not a label.** *(prompt, free, highest reach)*
Add a `PRIMARY_AXIS_MEANING`-style gloss to the 3b prompt and an axis-conditioned locked-fact
instruction: for a non-temporal axis, say in terms that the primary device's locked facts must pin
down the axis quantity (a distance/sightline, a name/role, a habit/exception, a record/signature) and
that a clock value may appear only as corroboration, never as the mechanism. The sixty lines of clock
arithmetic should be **conditional on the device actually having two clock values**, not
unconditional. Evidence: §3.4. Risk: it is a prompt change to a paid pipeline, so flag-gated.

**A2 — An axis-coherence detector, TELEMETRY ONLY.** *(free, needed before anything else can be
judged)*
Deterministic: does the primary device's locked-fact set pin the axis quantity, or only the clock?
MEASURED it would fire on 15/15 non-temporal cases today — which is 100%, so **B1 forbids gating it**
and `decorative-times.ts` is the precedent to copy. Its value is that it turns A1 from an opinion
into a before/after number on one run, with no A/B and no £ spent.

**A3 — Generalise `checkCaseTimelineDeception` to the other four axes.** *(the real gap, largest
build)*
§4.2 has the invariant table. This needs a structured field per axis in the same spirit as
`alibi_span` — the lesson of T2 is that the check is only as good as the structure it reads. Do
**not** start by parsing prose for places or names; that is the defect this project spent a week
removing. Scope it after A1, because A1 changes what the cases contain.

**A4 — Fix the seed corpus's axis coverage.** *(cheap, bounded)*
Six of fourteen seeds are invisible to axis ordering. Normalising `the_big_bow_mystery`'s
`timing_error / witness_suggestion` to a legal value and back-filling `false_assumption.type` on the
five legacy-shaped seeds is an hour's work and gives every axis at least something to lead with —
except authority, which needs one encoded work of its own.

**A5 — Read a spatial and a behavioral book.** *(£2.30, two runs)*
There is no substitute and no instrument that can stand in for it. Until then "all axes reach 80+"
has 0 evidence for 2 of 5.

**A6 — Correct the A_79 §7.1 comment in `device-library-block.ts`.** *(free, documentation)*
§4.5. No behaviour change; it stops the next reader buying coverage that is not there.

**Not recommended:** raising the authority/identity device-pattern counts by hand-authoring more
curated patterns. The measured gap is not that the shortlist is short — it is that the model is told
to build a clock whatever is on the shortlist. Fix A1 first and re-measure.

---

## 6. What this could NOT determine

- Whether any axis genuinely scores worse once it is genuinely on-axis. Every non-temporal book read
  so far was a temporal book with a different label, so the reads measure the label, not the axis.
- Whether the Agent-7 abort concentration on authority (2/9 vs 1/22) is real or three coincidences.
- Whether identity's lower clock density (15.0 vs 32.6) is caused by its four seed exemplars or is
  noise across three books.

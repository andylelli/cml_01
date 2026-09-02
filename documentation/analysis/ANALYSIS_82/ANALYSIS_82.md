# ANALYSIS_82 — The full lever audit: what we built, what actually runs, and the push to 90

**Date:** 2026-09-02
**Question asked:** *"Do a full review of all the levers, flags, agent code and everything else we have
built that in theory should have got us to 90 by now. Work with what we've got."*
**Method:** measurement, not reading. Every claim below is labelled MEASURED / INFERRED / ASSUMED.
**Cost:** £0. No LLM calls. Every number comes from `logs/llm-prompts-full.jsonl` (2,508 prompts,
cumulative across runs), `data/store.json` (41 cases, 38 outlines, 44 cast designs), the 20 manuscripts
on disk, and the source tree.

---

## §0 Why this audit, and what it is allowed to conclude

A_81 §8.3 established that a prompt block can pass every unit test and reach **zero prompts**. That
happened to the PAGE SHAPE block, which was written, tested, compiled into `dist`, and never seen by
the model. The categories it served — dialogue 7, prose 6 — did not move across four external reads,
while every category served by a lever that *did* reach the prompt moved up.

If that happened once, the correct assumption is that it happened more than once. **This audit
measures reach for every lever rather than reading the code and believing it.**

Two guardrails were applied throughout, and both caught errors in this audit itself (§1.3):

- **A negative result from a probe is a claim about the PROBE** until the probe is shown to work
  against a known-positive. Every sweep below carries a control.
- **Reach is measured by the log, not by grepping the module.**

---

## §1 The delivery sweep — does each prompt block reach a prompt?

**MEASURED.** For every block-builder function in the prose prompt layer, a distinctive literal marker
from its own output was counted against the 2,508-prompt log.

| Builder | Prompts reached | Verdict |
| --- | ---: | --- |
| `buildCharacterContractsBlock` | 1,526 | live |
| `buildChapterOutcomeBlock` | 1,316 | live |
| `buildProseRequirements` | 658 | live |
| `buildFairPlayContractBlock` | 658 | live |
| `buildPromptContextBlocks` | 658 | live |
| `buildPostChapterOneCharacterPressure` | 608 | live |
| `buildCharacterPersonalityBlock` | **467** | live — *see §1.3, I had this wrong twice* |
| `buildWorldBriefBlock` | 389 | live |
| `buildLocationProfilesBlock` | 313 | live |
| `buildJudgedOnBlock` | 129 | live (M6) |
| `buildProsePrompt` (own text) | 83 | live |
| `buildTemporalContextBlock` | 58 | live |
| `buildFirstAppearanceContractsBlock` | 57 | live |
| `buildOpeningIdeationPrompt` | 50 | live |
| `buildVoiceSpecBlock` | 30 | live but **ignored** (A_75) |
| `buildRelationshipHistoryBlock` | 26 | live but **unused** (A_81 §13.1) |
| `buildDivergenceBlock` | 2 | near-dead |
| `buildVoiceSpecJudgePrompt` | 2 | near-dead |
| **`buildSettingRefinementBlock`** | **0** | **DEAD — §2.1** |
| **`buildBackgroundContextBlock`** | **0** | **DEAD — §2.1** |
| **`buildOpeningSituationBlock`** | **0** | **DEAD — §2.2** |
| `buildClockDirectionBlock` | 0 | correct — built after this log (A_81 F16) |

### 1.1 The distribution is the point

Fifteen builders reach the model. Three do not. Two more reach it and are demonstrably ignored. The
"we built a lot and the score didn't move" feeling has a measurable shape: **roughly a fifth of the
prose-prompt surface is either not delivered or not acted on.**

### 1.2 Control

`buildLocationProfilesBlock` returns **2,697 characters** when called against the same real case data
that makes the two dead blocks return zero. The probe works; the zeros are about the blocks.

### 1.3 Two corrections to my own measurements

Recorded because both are the exact traps CLAUDE.md names, and both would have produced a confident
false finding:

1. **Wrong arity.** I first probed `buildCharacterPersonalityBlock(castDesign, names)`. Its real
   signature is `(characterProfiles, castDesign, activeNames, library, deployedAssets, arcPosition)`,
   so `characterProfiles.profiles` was undefined and the guard returned `''`. I read that as "dead".
2. **Wrong marker.** The block emits `## Character Reference` on the asset-library path and
   `CHARACTER PERSONALITIES` only on the fallback. Counting the fallback header gave 0.

Measured correctly: **467 prompts.** The block is live. Both errors pointed the same way — towards a
more dramatic finding — which is exactly when to distrust a probe.

---

## §2 Three blocks that cannot ever fire

### 2.1 Two blocks read a key that nothing writes — MEASURED

`buildSettingRefinementBlock` reads `caseData.SETTING_REFINEMENT`.
`buildBackgroundContextBlock` reads `caseData.BACKGROUND_CONTEXT ?? caseData.background_context`.

A full-tree grep for those identifiers returns **the two readers and no writer**. Nothing in
`apps/` or `packages/` ever assigns either key to a case object. And the real stored case object has
exactly two top-level keys:

```
top-level keys on caseData: CML_VERSION, CASE
```

The *material* exists — Agent 1 produces setting refinement, Agent 2e produces background context, and
both are real artifacts carried on `ctx.settingRefinement` / `ctx.backgroundContext`. They are simply
never attached to the object the prose prompt reads. This is the artifact-unwrapping trap from
CLAUDE.md, frozen into two permanent no-ops.

Both are registered in the budget system with real priorities — `setting_refinement` at `high`,
`background_context` at `medium` with a 450-token allowance — so the pipeline *reserves budget* for
text that is always empty.

**Note for later:** `agent2c-location-profiles-scorer.ts:351` and `agent2d-temporal-context-scorer.ts:394`
also read `BACKGROUND_CONTEXT`, off a different object (`context.cml`). Not verified in this pass —
listed in §9 as undetermined, not asserted as broken.

### 2.2 One block is never called at all — MEASURED

`buildOpeningSituationBlock` (`opening-ideation.ts`) has **one definition and zero call sites** outside
its own file and tests. It is dead code. Its header `OPENING SITUATION (COMMITTED)` appears 0 times in
2,508 prompts, which is the expected consequence rather than an independent finding.

---

## §3 The headline: the prompt contains a worked example of the thing it forbids

**MEASURED.** This is the most consequential finding in the audit, and it explains a complaint that has
survived every fix aimed at it.

Every prose prompt carries this instruction (`prompt-builder.ts:1788`):

> CHAPTER OPENING (every chapter, lint-enforced): never open on a tour or inventory of named
> rooms/places…

Reach: **658 prompts.**

The *same* prompt carries this, in the developer/schema section:

> Example structure: `"The <MONTH> <TIME> brought <WEATHER> to <LOCATION>. In the <ROOM>, <LIGHTING>
> while <SENSORY_DETAIL>. <CHARACTER>'s <OBJECT> <ACTION>."`

Reach: **658 prompts.** The same 658.

And the book opens:

> "The Hotel Reception Area in Dunrath Bay held a tense weight to it" — ×5 in one book
> "Rockshore Hotel in St Ives Bay" — ×4 in the previous one

That is a direct instantiation of the supplied template: `The <LOCATION>` + a mood clause.

**The model is obeying the prompt.** A_75 settled that this model complies with concrete operations and
ignores abstract targets — VoiceSpec asked for 22.0 words/sentence and got 15.86 in 0 of 10 chapters,
while the same prompt asking for *semicolon-linked clauses* moved semicolons 5 → 13. Here it is given
an abstract prohibition and a concrete fill-in-the-blanks template, in one prompt, and it follows the
template. That is the documented behaviour, not a failure of instruction-following.

This also means **A_81 F17 is not yet sufficient**. I strengthened the prohibition yesterday. The
example it competes with is still there, still in all 658. INFERRED: the prohibition will lose again
unless the example is replaced.

Prose has been **6/10 in all four external reads** — the only category never to move. This is the first
mechanism identified that would hold it there regardless of what else is fixed.

---

## §4 Every book we have ever made is the *shortest* configuration

**MEASURED.** All 20 manuscripts on disk:

| | words |
| --- | --- |
| smallest | 10,381 |
| largest | 12,299 |
| latest (82/100) | 11,229 |
| chapters | **10 in every one** |

A 2,000-word spread across 20 books, never once above 12,299.

The built length policy (`story-length-targets.ts`, resolved at runtime):

| profile | scenes/chapters | words | ever used? |
| --- | ---: | ---: | --- |
| **short** | 10 | 4,500 – 12,500 | **every run** |
| medium | 20 | 13,500 – 37,500 | never |
| long | 30 | 27,000 – 75,000 | never |

Every stored run requested `targetLength: "short"` (5/5 in `store.json`), every outline produced
exactly 10 scenes, and prose writes one chapter per scene. **The pipeline is behaving correctly.** This
is a configuration fact, not a defect — which is why no amount of code auditing was ever going to
surface it.

So: we have been trying to reach 90 on an 11,000-word novella, while a 20-chapter and a 30-chapter
configuration sit built, tested and unused. A Golden Age novel is 60,000–90,000 words. The reviewers
have been scoring something one-sixth of that length and giving it 82.

**INFERRED, and flagged as the audit's biggest untested claim:** the categories that have never
exceeded 8 — character life, dialogue, pacing, plot structure — are the ones most plausibly limited by
having ~1,120 words per chapter. You cannot develop a relationship, plant and pay off a subplot, or
let a suspect breathe in 1,120 words. The reviewer's standing complaints ("relationship history
under-specific", "character life thin") describe exactly what length buys.

**ASSUMED, and NOT established:** that longer scores higher. This has never been run. It could
plausibly go the other way — three times the chapters is three times the retry surface, three times the
injection opportunities, and the register decay A_75 measured (ch1 19.7 words/sentence decaying to the
corpus mean) has more room to operate.

---

## §5 Flag census

**MEASURED.** 149 feature flags read from `process.env` in source (infrastructure excluded).

| | count |
| --- | ---: |
| configured with a live value | 45 |
| OFF | 104 |
| **OFF but with tests — built capability, idle** | **30** |

The 30 idle-but-built levers include several aimed straight at standing reader complaints:

| flag | what it serves |
| --- | --- |
| `AGENT9_CLUE_TIME_WORDFORM` | A_80 F12 — the timing-collapse fix, **built this session, still OFF** |
| `AGENT9_AFTERMATH_GROUNDING` | chapter-10 aftermath quality |
| `AGENT9_FULLSTORY_POLISH` | cross-chapter craft repair |
| `AGENT9_REVEAL_CITES_PLANTS` | A_67 FIX-3 — plant→payoff citation in the reveal |
| `AGENT9_LENGTH_COUNTERPRESSURE` | the length ratchet (A_75 §14) |
| `AGENT2B_OBSERVABLE_DETAIL`, `AGENT2B_VOICE_CHECK` | character distinctness / voice |
| `AGENT2_CONSTRAINED_CAST` | cast coherence |
| `AGENT9_POLISH_RETRIED_CHAPTERS` | polish on the chapters that scored worst |

**Not a recommendation to switch them all on.** Each was left off for a reason, several are untested at
T3, and B1 warns that a check firing on most runs is an off switch with extra steps. But "we built a
lot and nothing moved" is partly explained by this table: **a third of the tested capability is not
running.**

---

## §6 Injection census — the machine prose is largely under control

**MEASURED** against the 82/100 manuscript, using the 22 residue patterns in `injection-templates.ts`:

| | count |
| --- | ---: |
| residue templates in the registry | 22 |
| **firing in the shipped book** | **2** |

Both survivors are the discriminating-test scaffold:

- `Run again in front of them all, the test came out the same way` — ×1
- `as the only person whose story still needed the discredited theory to be true` — ×1

This is a genuinely good result and worth stating plainly: the injection-residue problem that
dominated earlier reads is now down to a single template family. A_81 F18 changed **where** that
family lands (before the confession, not after); it did not change the wording, and the reader has
quoted this wording in two consecutive reads.

---

## §7 What the arithmetic now says about 90

The standing arithmetic (memory: `five-categories-never-reached-nine`): across 34–40 recovered external
reads, hook / character / dialogue / pacing / prose have **never scored 9**. Best-ever-in-every-category
sums to ~85, and the observed 80+ offset is +2…+6 (mean ~3.9), so best-ever-everywhere projects to
~88.9.

The owner's correction of 2026-09-01 stands and is the right reading: **no judge has given a 9 because
we have not got there yet.** A never-observed score is not a ceiling — treating "never fired" as
"cannot fire" is the same error this project has caught in four dead levers.

What this audit adds to that arithmetic:

1. Three prompt blocks have **never been delivered** — so the categories they serve have never been
   attempted, let alone maxed.
2. The prose category has a **competing instruction inside its own prompt** (§3), which plausibly
   pins it at 6.
3. Every score to date is for the **shortest** configuration (§4). The scale the rubric's top band
   describes has never been generated.

INFERRED: the 88.9 projection is a projection *for a 11k-word short*. It is not the ceiling of the
system; it is the ceiling of the configuration we have been running.

---

## §8 The plan — ranked by (evidence × reach) ÷ cost

### Free, and the evidence is direct

| # | Action | Why it is first |
| --- | --- | --- |
| **P1** | **Replace the `Example structure:` template in the developer prompt** with a worked example that obeys the CHAPTER OPENING rule — a character action or sensory-in-motion opener. | §3. It reaches 658 prompts and contradicts the rule in the same prompt. Prose 6/10 in 4/4 reads. Highest-confidence single fix in this document. |
| **P2** | **Attach `SETTING_REFINEMENT` and `BACKGROUND_CONTEXT` to `caseData`** before the prose prompt is built (the material already exists on `ctx`). | §2.1. Two `high`/`medium` priority blocks go from 0 → live for the cost of an assignment. |
| **P3** | **Convert the relationship block from an effect to an operation** — name the pair, name the history, require one countable exchange. | A_81 §13.1: reaches 26 prompts, "affair" appears 0 times. A_75 says operations are followed and effects are not. |
| **P4** | **Rewrite the DT scaffold wording** (not its position — F18 did that). | §6. Two of 22 residue templates fire and both are this family, quoted in two consecutive reads. |
| **P5** | Either wire `buildOpeningSituationBlock` in, or delete it. | §2.2. Dead code that reads as a working lever. |

### Cheap, and settles the biggest open question

| # | Action | Cost |
| --- | --- | --- |
| **P6** | **One `medium` run (20 chapters).** The single largest untested variable in the system. | ~£2–3 (INFERRED from £1.07/run mean at 10 chapters; scenes double, so prose roughly doubles) |

P6 should follow P1–P5, so one run tests all of them, and it should be read against a pre-specified
list rather than a general impression:

1. do any chapters open `The <Room> in <Place>…`? (P1)
2. does the setting/background material appear at all? (P2)
3. does the relationship history reach the page? (P3)
4. does the DT scaffold wording survive? (P4)
5. does F16 name the clock direction correctly? (A_81, still unverified at T3)
6. **does 20 chapters read better or worse than 10?** (P6)

### Deliberately not recommended yet

- **Switching on the 30 idle flags.** They were each turned off for a reason and the interaction
  surface is unmeasured. The two worth considering individually are
  `AGENT9_CLUE_TIME_WORDFORM` (built this session for a defect the reader named) and
  `AGENT9_LENGTH_COUNTERPRESSURE` (directly relevant if we go to `medium`).
- **`long` (30 chapters).** Go to `medium` first and read it. Doubling is a test; tripling is a bet.

---

## §9 What this audit could NOT determine

- **Whether length improves the score.** Never run. §4 is the audit's strongest structural finding and
  its weakest causal one.
- **Whether the two scorer reads of `BACKGROUND_CONTEXT`** (`agent2c`/`agent2d` phase scorers, off
  `context.cml`) are also no-ops. Different object, not probed.
- **Whether the 30 idle flags would help or hurt.** Tested at T1 only.
- **Whether P1 will actually move prose.** The mechanism is measured; the effect is not. And a single
  external read carries ±3 marks (A_76), so no one run can attribute a delta to one of six changes.
- **Why `buildDivergenceBlock` and `buildVoiceSpecJudgePrompt` reach only 2 prompts.** Near-dead, cause
  not investigated.

---

## §10 The one-line version

Nothing in this system is broken in a way that explains the score. But **three prompt blocks have never
been delivered, one prompt tells the model to do the thing it forbids two paragraphs earlier, a third
of the tested capability is switched off, and every book we have ever judged is the shortest of three
built configurations.** Those are the levers we already own and have not pulled.

---

## §11 Coverage: do we have a solution — in theory — to every issue in the last 20 reviews?

**Question asked (2026-09-02):** *"Do we in theory have a solution (whether it works or not) to all of
these issues identified in the last 20 chatgpt-reviews?"*

**Short answer: for 11 of the 12 recurring complaint families, yes — something is built. But "built"
covers four states that behave completely differently, and only one of them is a solution.** Sorting
the 12 families by that distinction is what this section does, and it changes the plan in §8.

### 11.1 Method

**MEASURED.** All 53 review files on disk were enumerated; the 20 most recent were taken (19 in
`stories/`, plus `_archive/story_20260807-1412`). Complaint families were extracted from the reviews'
own numbered issue lists and then counted by keyword across all 20.

**Probe caveat, recorded because it changed the numbers.** My first patterns for the two largest
families matched 20/20 — because words like "aftermath" and "clearances" appear in the *praise*
sections too. Tightened to phrases that only occur in a complaint ("repeats after the confession",
"still contains leakage"), both fall to 12/20. **The tightened numbers are used below.** The loose
ones would have overstated the two families that most need honest measurement.

### 11.2 The complaint census — 20 external reads, 2026-08-07 → 2026-09-01

| # | Family | Reviews | Still present in the latest read (82/100)? |
| --- | --- | ---: | --- |
| 1 | timing / time-math | **14/20** | yes — direction inverted (A_81 F16) |
| 2 | reveal repeats after the confession / ch9–10 duplication | **12/20** | yes |
| 3 | scaffold lines / prompt leakage named as a fault | **12/20** | yes |
| 4 | dialogue catchphrases | 9/20 | not named |
| 5 | object / name / location inconsistency | 7/20 | not named |
| 6 | "the final test is not quite a test" / over-explained | 6/20 | yes |
| 7 | culprit link under-proved, plant it earlier | 5/20 | not named |
| 8 | location template / report-like opening | 5/20 | yes |
| 9 | mechanism not distinctive | 3/20 | not named |
| 10 | motive thin / abstract / underplanted | 2/20 | yes |
| 11 | pronoun / gender | 2/20 | no — closed (A_66) |
| 12 | locked-room geography needs a sentence | 1/20 | no |

### 11.3 The four states of "we have a solution"

This is the load-bearing distinction. A lever can be:

- **LIVE** — delivered to the model and acted on
- **LIVE-IGNORED** — delivered and measurably not acted on
- **IDLE** — built and tested, flag OFF, never runs
- **DEAD** — built, cannot ever fire
- **NONE** — nothing exists

| # | Family | What we built | State |
| --- | --- | --- | --- |
| 1 | timing | A_80 F12 wordform collapse guard | **IDLE** — `AGENT9_CLUE_TIME_WORDFORM` unset |
| | | A_81 §10 repair-collision fix | LIVE |
| | | A_81 F16 direction rule | LIVE (unverified at T3) |
| | | A_80 F15 gap check | LIVE but **measure-only, never gates** |
| | | Agent 3b arithmetic contract | LIVE |
| 2 | reveal repeats | `AGENT9_CLEARANCE_TRIM`, `AGENT9_FOLD_SUSPECT_CLEARANCES`, `AGENT9_REGEN_AFTERMATH_REPEAT` | **all three LIVE** |
| | | A_81 F18 scaffold ordering | LIVE |
| 3 | scaffold / leakage | control-plane-leakage rules, injection-template registry, A_80 F1/F2 | LIVE — and §6 shows **2 of 22** templates still fire |
| 4 | dialogue catchphrases | character contracts (1,526 prompts) | LIVE |
| | | VoiceSpec | **LIVE-IGNORED** (A_75: asked 22.0 w/s, got 15.86, 0/10 chapters) |
| | | X43 voice-fragment guard | LIVE but **measured not to lower the rate** (33%) |
| 5 | object / name consistency | locked facts (1,331), Setting Lock (658), name-hygiene | LIVE |
| 6 | final test | deterministic DT patch, `AGENT6_DT_EVIDENCE_COMPLETENESS` | LIVE — **but the patch itself is what readers quote** |
| 7 | culprit link | `AGENT7_PLANT_BEFORE_REVEAL` | LIVE |
| | | `AGENT9_REVEAL_CITES_PLANTS` (A_67 FIX-3) | **IDLE** — flag unset |
| 8 | location template | A_81 F17 prohibition | LIVE — **but contradicted in the same prompt (§3)** |
| 9 | mechanism freshness | novelty audit | **effectively NONE** — A_77: the audit *cannot fail* (fail band renders "> 100%"), `NOVELTY_HARD_FAIL=false`, and A_78: the cell-scheduler has no corpus parameter |
| 10 | motive | MOTIVE LOCK block | **DEAD — §11.4, found by this audit** |
| | | relationship-history block | **LIVE-IGNORED** (26 prompts, "affair" ×0) |
| 11 | pronoun / gender | A_66 pronoun war + sweep | LIVE — **closed**, 7/7 external "much improved" |
| 12 | locked-room geography | — | **NONE** |

### 11.4 A fifth dead lever, found while answering this question — MEASURED

`MOTIVE LOCK` (`prompt-builder.ts:430`) reaches **0 of 2,508 prompts**. Its sibling text in the *same
returned string* — `Setting Lock: Keep all scenes…` — reaches **658**. So the function runs; the block
is empty every time.

Root cause, and it is a repeat offender:

```ts
const motive = culpritChar?.motive_seed ?? '';     // reads a CML field name…
```

…off `castDesign.characters`, whose real keys are camelCase:

```
CastDesign character keys: name, ageRange, occupation, roleArchetype, role,
publicPersona, privateSecret, motiveSeed, motiveStrength, ...
```

`motive_seed` is the field name on `CASE.cast.characters`. On a CastDesign it is `motiveSeed`. The
lookup is always `undefined`, so the guard collapses the block to `''`.

The data is not missing — it is present and good. For the last run: `Captain Ivor Hale`,
`culpability: guilty`, `motive_seed: "Silence victim to protect secret Cold War past"`, and
`CASE.culpability.culprits: ["Captain Ivor Hale"]`. **The culprit's motive has never once been stated
to the prose model, and two reviews complain the motive is abstract or underplanted.**

This is the exact trap recorded in memory as `cast-field-camelcase-vs-snakecase-trap` — found and fixed
three times in the 2026-07-24 agents review, recurring here in a fourth site. **Fix: read
`motiveSeed ?? motive_seed`, the same defensive chain X50 established for `roleArchetype`.**

### 11.5 So: is there a theoretical solution to everything?

**Eleven of twelve families have something built. One (locked-room geography, 1/20) has nothing, and it
is the least-reported complaint in the set.** On paper that is near-total coverage. But sorting by
state gives a very different picture:

| State | Families |
| --- | ---: |
| genuinely LIVE and working | 4 (names/objects, pronouns, leakage-mostly, reveal-repeat machinery) |
| LIVE but contradicted, ignored, or measured ineffective | 4 (location template, dialogue, motive-relationships, final test) |
| best lever IDLE behind an OFF flag | 2 (timing's F12, culprit-link's FIX-3) |
| DEAD — cannot fire | 1 (motive lock) |
| effectively NONE | 1 (mechanism freshness — the audit cannot fail) |

**The honest answer is: coverage is near-total in theory and materially incomplete in delivery.** We
have not been failing to think of solutions. We have been failing to deliver the ones we built — which
is the same conclusion §1–§4 reached from the other direction, now confirmed against the reader's own
complaint list rather than against the code.

### 11.6 The uncomfortable finding — two families where the theory is already exhausted

Families 2 and 3 — reveal-repetition (12/20) and scaffold/leakage (12/20) — are the two most persistent
complaints in the corpus, **and every lever built for them is already ON**:
`AGENT9_CLEARANCE_TRIM`, `AGENT9_FOLD_SUSPECT_CLEARANCES`, `AGENT9_REGEN_AFTERMATH_REPEAT`,
`AGENT9_CULPRIT_INJECTION_IN_SCENE`, the leakage rules, the injection registry, and A_81 F18.

They are still in the most recent review.

**INFERRED:** for these two, switching more flags on cannot help, because the complaint is *caused by
the mechanism built to prevent it*. Every one of those levers is a deterministic writer or a
regeneration trigger — the thing readers quote back is the repair, not the model's prose. §6 measures
this precisely: the only two residue templates still firing are the DT scaffold's own sentences, and
A_81 §13.2 records that my B5 replacement text went straight onto the reader's deletion list.

The design answer for these two is not another injector but **fewer**: make the model satisfy the
obligation in its own words (the A_75 operations lesson) and let the injector be a genuine last resort
rather than the routine path. That is a larger change than anything in §8 and is not attempted here.

### 11.7 What this adds to the plan

Three additions to §8, all free, all now evidence-led rather than inferred:

| # | Action | Evidence |
| --- | --- | --- |
| **P6** | Fix the MOTIVE LOCK field name (`motiveSeed ?? motive_seed`) | §11.4 — 0/2,508 prompts, control at 658, data present and good |
| **P7** | Turn ON `AGENT9_CLUE_TIME_WORDFORM` for the next run | family 1 is 14/20, the largest in the corpus, and its flagship guard has never run |
| **P8** | Turn ON `AGENT9_REVEAL_CITES_PLANTS` | family 7 is 5/20 and the citation lever has never run |

P7 and P8 are the only two of the 30 idle flags this audit recommends enabling, because they are the
only two that map directly onto a *counted* reader complaint. The remaining 28 stay off — §5's warning
stands, and B1 applies.

---

## §12 The twelve families, each reviewed against its solutions: evidence, score, improvement

**Question asked (2026-09-02):** *"Review all 12 families against the solutions we have. See what the
evidence is. Score them and propose improvements for all 12."* Owner instruction on the same day:
**record first, change nothing yet.** Nothing in this section has been applied — every improvement is a
proposal, and every score is a score of the *current* state.

### 12.0 Method and rubric

**Trend, MEASURED.** The 20 reviews were split into the first 16 (2026-08-07 → 2026-08-30) and the last
4 (2026-08-31 → 2026-09-01, the four reads taken since the A_80/A_81 fixes started landing). A family
that is fading should show it here before it shows in the total score.

**Score /10 — four components, stated so they can be disagreed with:**

| component | range | meaning |
| --- | ---: | --- |
| Coverage | 0–2 | is every observed sub-mode of the complaint addressed by something built? |
| Delivery | 0–3 | 0 dead/none · 1 idle (flag OFF) · 2 live but ignored/contradicted/wrong layer · 3 live |
| Efficacy | 0–4 | best evidence it *works*: 0 none or worsening · 1 T1 only · 2 T3 measured · 3 T4 fading · 4 T4 gone and cause fixed |
| Trend | 0–1 | 1 if absent from all of the last 4 reads |

The rubric deliberately makes *delivery* and *efficacy* worth more than *coverage*. §11 showed coverage
is nearly total; it is the other two that have been missing.

### 12.1 Family 1 — timing / time-math

**Reviews:** 14/20. Trend **13/16 → 1/4** — the largest fade in the corpus.
**Built:** Agent 3b arithmetic contract (live) · A_81 §10 repair-collision fix (live) · A_80 F13/F14
(live) · A_80 F15 gap check (live, **measure-only**, baselined at 60–67% firing so it cannot gate — B1)
· A_81 F16 direction rule (live, **unverified at T3**) · **A_80 F12 word-form collapse guard — IDLE,
`AGENT9_CLUE_TIME_WORDFORM` unset.**
**Evidence, MEASURED:** the fade is real and it coincides with the arithmetic contract, F13 (which had
always read `undefined` before A_80) and the §10 fix landing. The one survivor in the last 4 is a *new
mode* — direction inverted — and it is not new to the corpus: `story_20260815-2027` was told *"choose
whether the clock is 14 minutes slow or 14 minutes fast."* F16 addresses a defect reported at least
twice, seventeen days apart.
**Score: 7/10** (Coverage 2 · Delivery 2 · Efficacy 3 · Trend 0). Delivery loses a point because the
flagship guard for the most-reported sub-mode has never run.
**Proposed improvements:**
- **P7** enable `AGENT9_CLUE_TIME_WORDFORM` for the next run and verify by agent label.
- Verify F16 at T3: the next case with a classifiable staged/true pair must show the derived direction
  block in the log *and* the correct word in the manuscript. Both are countable.
- Do **not** promote F15 to a gate. It fires on most cases at baseline; that is an off switch with
  extra steps. Its content is now delivered as a prompt operation by F16, which is the right form.

### 12.2 Family 2 — the reveal repeats after the confession / chapter 9–10 duplication

**Reviews:** 12/20. Trend **9/16 → 3/4 — not fading.**
**Built:** `AGENT9_CLEARANCE_TRIM` (ON) · `AGENT9_FOLD_SUSPECT_CLEARANCES` (ON) ·
`AGENT9_REGEN_AFTERMATH_REPEAT` (ON) · `AGENT9_CULPRIT_INJECTION_IN_SCENE` (ON) · A_81 F18 (live).
**Evidence, MEASURED by agent label in the log:** the machinery fires hard —
`Agent9-Regen-Ch10-aftermath_repeat` **35**, `Ch9-aftermath_repeat` **30**, `Ch8-missing_resolution`
**58**, `Ch8-missing_clearance` **18**, `Ch9-missing_resolution` 15. That is ~170 regeneration prompts
aimed at the chapter-8-to-10 geometry. The complaint is in 3 of the last 4 reads.
**Reading:** every lever is ON, every lever fires, and the family is the worst-trending in the set. The
regen and injection traffic *is* the repetition — each regen re-asserts the obligation in fresh prose,
each injector adds a sentence, and the reader quotes the result. This is §11.6's conclusion, now with
the traffic counted.
**Score: 5/10** (Coverage 2 · Delivery 3 · Efficacy 0 · Trend 0). Full marks for building and delivering;
none for outcome.
**Proposed improvements (design, not flags):**
- **P11 — a deletion pass, not an injection pass.** If chapter 10 restates a clearance or a test result
  already present in chapters 8–9, *remove* the restatement. A pass that can only delete cannot add
  machine prose; it is the only post-validation mutation direction that is safe by construction.
- **P12 — `AGENT9_REGEN_EDIT_LIST` is built and IDLE.** Regenerate with a bounded edit list rather than a
  rewrite, so an `aftermath_repeat` regen cannot re-introduce the material it was called to remove.
- Make the DT scaffold fire only when the chapter contains **no test at all**, not when its
  *marker words* are missing — the marker check is what puts a second demonstration after a first.

### 12.3 Family 3 — scaffold lines / prompt leakage named as a fault

**Reviews:** 12/20. Trend 10/16 → 2/4.
**Built:** control-plane-leakage rules (live; A_80 F1 narrowed `instruction_shape` after it fired on 2 of
12 real Golden Age novels) · watch-tier reporting F2 (live) · injection-template registry (live) ·
retry-regression guard F3 (live).
**Evidence, MEASURED:** §6 — **2 of 22** residue templates fire in the shipped 82/100 book, both from
the DT scaffold. The two families of leakage that dominated May–July reads are gone; what remains is one
template family.
**Score: 8/10** (Coverage 2 · Delivery 3 · Efficacy 3 · Trend 0).
**Proposed improvements:**
- **P4** rewrite the two surviving DT sentences as in-scene observation (position was fixed by F18;
  wording was not).
- Register both sentences at **watch** tier in the leakage lint so they can never ship silently again.
  Watch, not gate: a gate would force a regen, and §12.2 shows what regens cost.

### 12.4 Family 4 — dialogue catchphrases

**Reviews:** 9/20. Trend 8/16 → 1/4.
**Built:** character contracts with SIGNATURE TIC (live, **1,526 prompts**) · VoiceSpec
(live-ignored, A_75) · X43 voice-fragment guard (live, **measured not to lower the rate** — 33% before
and after) · page-shape operations (**dead**, A_81 §8.3).
**Evidence, MEASURED in the 82/100 book:** 62 quoted four-grams recur across ≥2 chapters. The top
non-locked-fact entries are *"isn't it just the way"* (**4 chapters**) and *"now isn't that a"* (3).
The first of those appears in **25 prompts** — it is a tic **we supplied**. The instruction reads:
*"use sparingly … at most once in this chapter … prefer a varied paraphrase … most chapters should omit
it entirely."* That is a rate instruction wrapped around a verbatim phrase. A_75 predicts exactly this
outcome: the model uses the concrete phrase and ignores the abstract restraint.
**Reading:** the complaint is manufactured by our own lever, and the mitigation built into the lever is
of the kind this model does not follow.
**Score: 5/10** (Coverage 1 · Delivery 2 · Efficacy 2 · Trend 0).
**Proposed improvements:**
- **P10 — make the tic an operation.** Assign each character's tic to **one named chapter** and omit it
  from every other chapter's prompt. A phrase the model is not given cannot be overused. Countable at
  T3: each tic appears in ≤1 chapter.
- Revive the page-shape block (the measured gap: paragraphs opening on speech **11.5% vs canon 59.7%**,
  A_79 §13). Its cause of death is still unidentified (A_81 §8.3) — chase that first.

### 12.5 Family 5 — object / name / location inconsistency

**Reviews:** 7/20. Trend **4/16 → 0/4.**
**Built:** locked facts (live, 1,331) · Setting Lock (live, 658) · X51 device-scoped locked-fact registry
(fixed) · name-hygiene.
**Evidence:** absent from all of the last 4 reads; the weapon-confusion and hotel-name complaints
cluster in 25–28 August and stop.
**Score: 9/10** (2 · 3 · 3 · 1). Held back from 10 only because four reads is a short window.
**Proposed improvement:** none beyond monitoring. Do not add a lever here.

### 12.6 Family 6 — "the final test is not quite a test" / over-explained

**Reviews:** 6/20. Trend **5/16 → 0/4.**
**Built:** deterministic DT patch (live) · `AGENT6_DT_EVIDENCE_COMPLETENESS` (ON).
**Evidence:** the 82/100 read *praises* the final clock test in its plot-structure line. The family is
gone — but the mechanism that closed it is the DT patch, whose sentences are the entire surviving
content of family 3 and part of family 2.
**Score: 8/10** (2 · 3 · 3 · 1 → 9, minus one for the dependency: this family is solved at the direct
expense of two others).
**Proposed improvement:** none for this family. P4 and P12 (above) reduce its cost to the others
without reopening it — provided the DT markers stay present, which F18's test pins.

### 12.7 Family 7 — culprit link under-proved, plant it earlier

**Reviews:** 5/20. Trend **5/16 → 0/4.**
**Built:** `AGENT7_PLANT_BEFORE_REVEAL` (ON) · X52 decisive-trace-is-essential fix ·
`AGENT9_REVEAL_CITES_PLANTS` (A_67 FIX-3) — **IDLE, unset.**
**Evidence:** absent from the last 4. The plant-before-reveal lever and the X52 fix landed in the
window where the complaint stopped.
**Score: 8/10** (2 · 2 · 3 · 1).
**Proposed improvement:** **P8** enable `AGENT9_REVEAL_CITES_PLANTS` — the citation half of a fix whose
planting half is already credited with the fade. Verify by label; it is a prompt operation
(`obligation-block.ts:795`), so it will show in the log or it is not on.

### 12.8 Family 8 — the location-template opening

**Reviews:** 5/20. Trend **3/16 → 2/4 — worsening.**
**Built:** CHAPTER OPENING rule + A_81 F17 (live, 658 prompts) · `AGENT9_OPENING_STYLE_PER_STORY` (ON) ·
`AGENT9_OPENING_FRESHNESS` / X95 (ON) · template_bleed lint (live, retry-time).
**Evidence, MEASURED — and this changes the diagnosis in §3.** Every opener in the 82/100 book:

```
ch1   Hotel Reception Area in Dunrath Bay held a tense weight to it; ringing rotary telephones,
ch2   The rain had settled over The Seaside Veranda Hotel in Dunrath Bay; the sound of the wind
ch3   Entering The Seaside Veranda Hotel in Dunrath Bay, the sound of the wind in the corridor
ch4   The Seaside Veranda Hotel in Dunrath Bay received them with old timber and damp stone
ch5   There was a hush in the Reception area and hotel bar as dusk crept up the glass doors
ch6   The Seaside Veranda Hotel in Dunrath Bay held a tense weight to it; the sound of the wind
ch7   The rain had settled over Hotel Reception Area in Dunrath Bay; ringing rotary telephones,
ch8   In The Seaside Veranda Hotel in Dunrath Bay, the sound of the wind in the corridor and old
ch9   In The Seaside Veranda Hotel in Dunrath Bay, the sound of the wind in the corridor and old
ch10  The Seaside Veranda Hotel in Dunrath Bay held a tense weight to it; the sound of the wind
```

**Ten of ten** are location-templated. Chapters 8 and 9 open on the **identical sentence**. *"held a
tense weight to it"* ×3, *"the sound of the wind in the corridor"* ×5. The reviewer counted five; the
true figure is every chapter.

Where the phrases come from, MEASURED:

| phrase | in source files | in prompts |
| --- | ---: | ---: |
| "sound of the wind in the corridor" | **1 — `agent9-run.ts`** | 33 |
| "held a tense weight" | 2 | 11 |
| "ringing rotary telephones" | 0 | 26 |
| "received them with old timber" | 0 | 11 |

And the mechanism, at `agent9-run.ts:2855`: `AGENT9_GROUNDING_LEAD` is **ON**, and when a chapter fails
the grounding scorer (`!hasAnchor || sensoryCount < 2 || !hasAtmosphere`) the run **prepends**
`buildUniqueGroundingLead(index, anchorName)` to the model's paragraphs. The flag's own comment: *"set
`AGENT9_GROUNDING_LEAD=0` to restore pure model openings."* The A_52 note beside it records that with the
lead OFF only 2/9 chapters passed the scorer — so with it ON, the prepend fires on **most chapters**.
(The `.env.local` comment "logged at 2/10 chapters last run" reads as if the lead fires rarely; the code
comment says the opposite. INFERRED that the `.env.local` note is the stale one; the count of applied
leads in the next run's output settles it.)

**So the opening the reader sees is not the model's opening.** It is a deterministic sentence, built
from a closed vocabulary, prepended **after validation** (memory: post-processing runs after
validation), and named "Unique" while producing ch8 = ch9. This is the same shape as X94/X95 — the
opening templated in code — recurring in a third place.

The consequence for the fixes already made: **the CHAPTER OPENING rule, F17, X95 and the template_bleed
lint all act on the model's paragraph — which this prepend demotes to paragraph two.** They are aimed
at the wrong layer and cannot succeed while the prepend is on. §3's "the prompt contradicts itself" is
real and still worth fixing, but it is the *second* cause; this is the first.

**Score: 2/10** (Coverage 1 · Delivery 1 · Efficacy 0 · Trend 0). The lowest score of any family with a
solution "built", because the live levers target a paragraph the reader never sees first.
**Proposed improvements:**
- **P9 — set `AGENT9_GROUNDING_LEAD=0`.** One env line, £0, reversible, and the flag's own comment
  describes the effect. It is also a B1 case: a rescue that fires on most chapters is not a rescue.
- **P1** replace the `Example structure` template (§3) — the second cause, so that "pure model openings"
  are not templated by the prompt instead.
- Then re-measure: openers templated ≤2/10 and zero identical first sentences. Both countable.

### 12.9 Family 9 — mechanism not distinctive

**Reviews:** 3/20. Trend 3/16 → 0/4.
**Built:** Agent 8 novelty audit · `NOVELTY_HARD_FAIL` (false) · `NOVELTY_SKELETON_JUDGE` (shadow) ·
cell-scheduler.
**Evidence:** A_77 — the audit **cannot fail** (the fail band renders "> 100%"); A_78 — the idea engine
draws 0.43% of its prompt from any real novel and the cell-scheduler has no corpus parameter. The 0/4
is not efficacy: the last four reads praise the clock devices as "classic and clear" and do not ask for
novelty. The family is quiet, not solved.
**Score: 3/10** (Coverage 0 · Delivery 1 · Efficacy 1 · Trend 1).
**Proposed improvements:** the A_77 §7–§14 plan, unchanged — fix the fail band so the audit *can*
fail, baseline its firing rate before letting `NOVELTY_HARD_FAIL` gate anything (B1), give the
cell-scheduler a corpus parameter. Largest deferred item in this document; not free (~£65, A_77 §12).

### 12.10 Family 10 — motive thin / relationship history unused

**Reviews:** 2/20 on the loose regex, but **4/4 in the last four** — and the last-four hits are the
*relationship* complaint (3–4 mentions per review) rather than "motive" per se.
**Built:** MOTIVE LOCK (**dead**, §11.4 — `motive_seed` read off a CastDesign whose key is
`motiveSeed`; 0/2,508 prompts against a sibling at 658) · relationship-history block (**live-ignored**,
26 prompts, "affair" 0× in the manuscript, A_81 §13.1).
**Evidence:** worsening, and both levers are non-functional in different ways — one never delivered, one
delivered and asking for an *effect* ("let it show without being explained").
**Score: 3/10** (Coverage 2 · Delivery 1 · Efficacy 0 · Trend 0).
**Proposed improvements:**
- **P6** fix the MOTIVE LOCK field name: `motiveSeed ?? motive_seed`, the X50 defensive chain.
- **P3** convert the relationship block to an operation: name the pair, name the history, require *one
  exchange in this chapter in which the named history is present and unmentioned*. Countable at T3:
  the named history's key noun appears ≥1 in the manuscript.

### 12.11 Family 11 — pronoun / gender

**Reviews:** 2/20. Trend 2/16 → 0/4.
**Built:** A_66 pronoun war (closed 2026-07-23, external 7/7 "much improved") · pronoun sweep · pronoun
coverage block.
**Score: 10/10** (2 · 3 · 4 · 1). The only family with T4 evidence that the *cause* was fixed.
**Proposed improvement:** none. Recorded as the template for what "solved" looks like: a fix, a run,
and an external read that names the improvement.

### 12.12 Family 12 — locked-room geography

**Reviews:** 1/20 (`story_20260826-1708`: *"needs a diagram-level sentence"*). Trend: quiet.
**Built:** nothing aimed at it — **but the material exists and is in a dead block.**
`buildSettingRefinementBlock` (§2.1, 0 prompts, no writer for its key) renders exactly this: *"Location
frame"*, *"physical constraints"*, *"access control"* from Agent 1's setting refinement.
**Score: 1/10** (0 · 0 · 0 · 1).
**Proposed improvement:** **P2** (attach `SETTING_REFINEMENT` to `caseData`) delivers the geography
material for free. Add one reveal-chapter obligation — *"state in one sentence who could reach the room
and by which door"* — which is countable and cheap.

### 12.13 Summary

| # | Family | n/20 | first 16 → last 4 | Score | Limiting factor |
| --- | --- | ---: | :---: | ---: | --- |
| 11 | pronoun / gender | 2 | 2 → 0 | **10** | — closed |
| 5 | object / name consistency | 7 | 4 → 0 | **9** | — |
| 3 | scaffold / leakage | 12 | 10 → 2 | **8** | one template family left |
| 6 | final test | 6 | 5 → 0 | **8** | solved at families 2/3's expense |
| 7 | culprit link | 5 | 5 → 0 | **8** | citation lever idle |
| 1 | timing | 14 | 13 → 1 | **7** | flagship guard idle; F16 unverified |
| 2 | reveal repeats | 12 | 9 → 3 | **5** | levers ARE the cause |
| 4 | dialogue catchphrases | 9 | 8 → 1 | **5** | we supply the phrase, then ask for restraint |
| 9 | mechanism freshness | 3 | 3 → 0 | **3** | audit cannot fail |
| 10 | motive / relationships | 2 | 2 → **4** | **3** | one dead, one ignored |
| 8 | location template | 5 | 3 → **2** | **2** | fixes aimed at the wrong layer |
| 12 | geography | 1 | — | **1** | material exists, in a dead block |

Mean **5.75/10**. Five families at 8+ are effectively closed on current evidence. Four families at ≤3
share one property: **the thing standing between them and a solution is not a missing idea.** It is a
field name (10), an env line (8), a fail band that renders >100% (9), and a key nobody attaches (12).

### 12.14 The recurring shape, stated once

Three of the twelve families — **2, 4 and 8** — are now measured to be *caused by the lever built to
prevent them*: the regen/injection traffic writes the repetition; the SIGNATURE TIC instruction supplies
the catchphrase; the grounding-lead prepend writes the templated opening. In each case the lever is ON,
fires on most chapters, and the fix that was attempted (a restraint clause, a prohibition, a rule) was
aimed at the model while the defect was being written by us.

CLAUDE.md's B1 rule — *a check that fires on most runs is an off switch with extra steps* — was
written about gates. It applies with equal force to rescues.

### 12.15 The improvement list, consolidated — nothing applied

| # | Action | Cost | Family | Evidence grade |
| --- | --- | --- | --- | --- |
| P9 | `AGENT9_GROUNDING_LEAD=0` | £0, 1 env line | 8 | MEASURED: source phrase → 10/10 openers |
| P1 | replace the `Example structure` template | £0 | 8 | MEASURED: 658 prompts, same as the rule |
| P6 | MOTIVE LOCK: `motiveSeed ?? motive_seed` | £0 | 10 | MEASURED: 0/2,508 vs sibling 658 |
| P2 | attach `SETTING_REFINEMENT` + `BACKGROUND_CONTEXT` to `caseData` | £0 | 12, atmosphere | MEASURED: no writer exists |
| P3 | relationship block → operation | £0 | 10 | MEASURED: 26 prompts, 0 uses |
| P10 | SIGNATURE TIC → one named chapter per character | £0 | 4 | MEASURED: tic in 25 prompts, 4 chapters |
| P7 | enable `AGENT9_CLUE_TIME_WORDFORM` | £0 | 1 | built for a counted complaint, never run |
| P8 | enable `AGENT9_REVEAL_CITES_PLANTS` | £0 | 7 | built for a counted complaint, never run |
| P4 | rewrite the two DT scaffold sentences | £0 | 3 | MEASURED: the only 2/22 firing |
| P11 | deletion pass for ch9/10 restatement | small build | 2 | INFERRED from label traffic |
| P12 | `AGENT9_REGEN_EDIT_LIST` — built, idle | £0 to enable | 2 | T1 only |
| P5 | wire or delete `buildOpeningSituationBlock` | £0 | — | dead code |
| P13 | novelty fail band + corpus parameter | ~£65 | 9 | A_77 plan |
| — | one `medium` run, read against a pre-specified list | ~£2–3 | all | §8 |

Ten of fourteen are free. The first six are each backed by a direct measurement of *why the current
state fails*, which no earlier improvement list in this project could say of more than one or two items.

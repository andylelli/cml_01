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

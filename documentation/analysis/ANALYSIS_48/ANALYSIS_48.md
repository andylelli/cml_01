# ANALYSIS_48 — Getting agents 1–8 to **90% prose-fitness** so Agent 9 can reach **80**

Status: **investigation complete (9 parallel per-agent audits of the live run `run_0a53fb34`, rubric 68). Thesis confirmed with code evidence across every upstream agent.** Sibling of [ANALYSIS_47](../ANALYSIS_47/ANALYSIS_47.md) (the upstream-vs-prose ablation) and the [ROADMAP_TO_80](../ANALYSIS_47/ROADMAP_TO_80.md). This document is the **upstream program**: what to fix in agents 1–8 so the artifacts stop capping the prose.

> Naming: this follows the established `ANALYSIS_nn` convention (the prior doc is ANALYSIS_47). "A_48" = this file.

---

## ▸ Implementation progress

Legend: ☐ not started · ◐ in progress · ☑ implemented (build + unit tests green) · ✓ verified-in-code (claim confirmed) · ⊘ deferred/rejected.

| ID | Agent | Change | Status | Verified | Notes |
|---|---|---|:--:|:--:|---|
| **T1.1** | 3 CML | Required `death_method`, physical, distinct from concealment mechanism (schema + prompt + validator) | ☑ | ✓ | skeleton key + genre-rule + checklist + guaranteed `normalizeCml` population (`deriveDeathMethodFromCrimeClass`); validator kept soft (validateCml hard-throws in Agent 9) — resolver already returns `""` gracefully. prompts-llm 433 |
| **T1.2** | 7 Outline | Beat scheduler authoritative (`buildSceneGrid` shadow→gate); no adjacent chapter shares a job | ☐ | ✓ | structural rewire needing full-run validation (ROADMAP_TO_80 M4 already says "not flipped blind"). Focused PR with a live run |
| **T1.3** | 7 Outline | Per-chapter word budget + `chapterJob` from length target | ☐ | ✓ | safe-ish; pairs with T1.2 in the outline PR. `estimatedWordCount` hardcoded 1800 confirmed |
| **T1.4** | 2b | Wire `checkVoiceCapsules` as an enforced retry gate (shadow→on) | ☐ | ✓ | with T1.5 landed, voices are still near-identical → enforcing the gate today would retry **most** runs; needs the gate + a tuned threshold together, else it destabilizes. Pair with a live-run check |
| **T1.5** | 2b | Atomize humour (`voice:NAME:humour`) in `asset-library.ts` | ☑ | ✓ | new obligation atom, fires when `humourStyle≠none && humourLevel≥0.4`; verified `profile.humourStyle/Level` reach the library |
| **T1.6** | 8 | Lower novelty `similarity_threshold_default` so the audit fires | ⊘ defer | ✓ | confirmed `1.1` "can never fire" (`generation-params.yaml`). Flipping it ALONE adds an LLM call + a possible CML regen while comparing only to **static seeds** (identical every run) → low value. Pair with T1.7; don't flip blind |
| **T1.7** | 8 | Wire the built `@cml/novelty` cross-run store | ☐ | ✓ | `@cml/novelty` exists/tested but unwired (zero imports under `apps/`); needs a persisted fingerprint ledger — a focused PR. This is the real premise lever |
| **T1.8** | 5 Clues | Semantic dedupe before scoring (normalized `pointsTo`/Jaccard) | ⊘ defer | ✓ | the "duplicate" clues are **structurally-required slots** (`clue_mechanism_visibility_core` / `_core_contradiction_chain` / `_core_elimination_chain`, `agent5-clues.ts:456-478`) with cross-referenced IDs — safe removal needs re-pointing + the T2.10 record restructure. Prose-visible twin already mitigated by the committed `dedupeByDescriptionSimilarity` (deterministic-repair). Defer to the T2.10/T2.11 refactor PR |
| **T2.1** | 6 | Blind-reader fooled-then-convinced inversion | ☐ | | makes surprise gateable |
| **T2.2** | 6 | Fail if a red herring points at the real culprit | ☐ | | |
| **T2.3** | 6 | Verify manner-of-death deducibility | ☐ | | |
| **T2.4** | 3b | Mechanism-plausibility judge leg (hard floor) | ☐ | | premise plausibility (D6) |
| **T2.5** | 3b | Delete/neutralize the hardcoded clock-rewind exemplar | ☑ | ✓ | replaced the `clock_reading/tamper_amount` exemplar (`"ten minutes past eleven"`/`"forty minutes"`) with a format-only placeholder + a "do not default to the clock" mechanism-family nudge; word-form/imperial NOTES kept |
| **T2.6** | 3b | Device complexity cap; stop rewarding length | ☐ | | |
| **T2.7** | 2c | Run after Agent 7 / profile the actual crime scene | ☐ | | atmosphere/pacing |
| **T2.8** | 2c | Per-location distinctness gate | ☐ | | repetitive openers |
| **T2.9** | 3 CML | Anti-trope motive + herrings misdirect away | ☐ | | premise |
| **T2.10** | 5 Clues | Restructure record `{observable,inference,pointsTo,first_full_reveal_chapter}` | ☐ | | kills spec-sentence leakage at source |
| **T2.11** | 5 Clues | One-insight / one-clearance discipline | ☐ | | Ch9/Ch10 smear |
| **T3.1** | 1 | Pipe `atmosphere` into the Agent 9 prompt + score real artifact | ☐ | | |
| **T3.2** | 2 | Swap in `agent2-cast-real-scorer.ts` | ☐ | | unpins quality=60 |
| **T3.3** | 2c | Rewrite `scoreSensoryRichness` (distinct atoms, not words) | ☐ | | |
| **T3.4** | 2e | Grade 2e's own output (not Agent-1 back-fill) | ☐ | | |
| **T3.5** | 3 | Content-assertion scorer (replace constant 100s) | ☐ | | |
| **T3.6** | 3b | Replace length-counting scorer | ☐ | | |
| **T3.7** | 7 | Invert `scoreSceneDetail` (budget, not length) | ☐ | | |
| **T3.8** | 1 | Season/time consistency contract with 2c | ☐ | | autumn→summer flip |

*Progress notes are appended in §8 as items land.*

---

## 0. TL;DR

1. **The agent scores are a lie.** Agents 1–8 almost all report **~100/A**, yet the run they produced scored rubric **68** and the prose phase **failed (60/D)**. The agent validators measure **schema-completeness, word-count, or a phantom adapter shape — not whether the artifact lets Agent 9 write an 80 story.** `agent3_cml` scored **100/A on a CML that contained no manner of death** — the single defect that tanked the run.
2. **Three failure modes recur in every agent** (§2): (A) **phantom/adapter scorers** grade a shape the agent never emits; (B) **the real quality machinery is already built but wired SHADOW/OFF** (VoiceCapsule, beat scheduler, cross-run novelty store, the real cast scorer); (C) **artifacts encode the gimmick, not the substance** (a "time-masked murder" with no killing; a blind-reader that *rewards predictability*).
3. **Most of the path to 90 is wiring, not invention.** The highest-leverage fixes are turning ON machinery that already exists and is tested. That makes this cheap and fundable.
4. **Each upstream fix maps to a specific frozen rubric mark** (§4). This is the missing link to ROADMAP_TO_80: the frozen `premise/opening/dialogue/ending` marks are **owned upstream**, and §3 names the owner and the fix for each.
5. **The real "90%" is a fitness gate, not the current vanity score** (§5). We must replace "schema is complete" with "this artifact contains what an 80-story needs and nothing that sabotages it," and **enforce** the checks that already exist in shadow.

---

## 1. The core finding — every agent's "90%+" is a vanity metric

Per-agent phase scores from `run_0a53fb34` (rubric 68, prose phase **failed**):

| Agent | Reported | What the scorer ACTUALLY measures | The gap |
|---|---|---|---|
| 1 Setting | 100/A | a **synthesized** `SettingRefinementOutput` the agent never emits (`agent1-scoring-adapter.ts` fabricates layouts) | atmosphere block is computed, **never read by Agent 9**, and overridden by 2c (season flips autumn→summer) |
| 2 Cast | **88 (q=60)** | empty `opportunity_channels`/`behavioral_tells` (adapter hardcodes `[]`) → depth structurally capped | the **real** `agent2-cast-real-scorer.ts` + `checkCast` exist, **unwired** |
| 2b Profiles | 100/A | **word count** of profile text | voice **distinctness** never checked; `checkVoiceCapsules` runs **shadow** |
| 2c Locations | **91 (q=70)** | **word count per sense**, on a deliberately-terse noun-phrase artifact | crime-scene location has **no profile**; locations not distinct → repetitive openers |
| 2d/2e Context | 98–100 | a schema the agents don't emit; 2e graded on **Agent-1 back-filled** fields | thin/duplicative; no consistency contract |
| 3 CML | **100/A** | **hardcoded constants** (`validation/completeness/consistency = 100`); docked only if Agent 4 revised | **no manner of death**, no plausibility, no premise-angle check |
| 3b Hard-logic | 100/A | **string length ≥ 30 chars** + array non-emptiness | implausible "gust rewinds clock 40 min"; **hardcoded clock-rewind exemplar** in the prompt |
| 5 Clues | **96/A** | clue **count** vs a density band; quality **floored at 70** | duplicate clues + spec-sentence leakage cost **0 points** |
| 6 Fair-play | 100/A | `pass → 100` status lookup | the blind-reader **rewards predictability** (fails when the reader is fooled) |
| 65/7 World/Outline | 100/A | chapter **count** + **longer summary = higher score** | beat scheduler **shadow**; no per-chapter job or word budget → pacing 5 |
| 8 Novelty | 100/A | **skipped** (`similarity_threshold_default: 1.1` "can never fire"); 100/A is a hardcoded default | no cross-run memory → every premise is the manor-clock |

**The pattern is total: not one upstream agent has a scorer that would fail the artifact for being unfit for an 80 story.**

---

## 2. The three recurring failure modes

### (A) Phantom / adapter scorers — the score grades a shape the agent never produced
- **Agent 1**: `adaptSettingForScoring` (`agent1-scoring-adapter.ts:73-148`) *fabricates* spatial layouts and pads `key_features` to ≥5 to satisfy `isPhysicallyPlausible`. The score measures the **adapter**, not the LLM output; `atmosphere`/`era`/`realism` are never scored.
- **Agent 2**: `agent2-scoring-adapter.ts:73-77` hardcodes `opportunity_channels`/`behavioral_tells = []`; `scoreCharacterDepth` awards 30/100 for those always-empty arrays → quality **pinned at ~60** no matter how good the cast is.
- **Agent 2e**: `agent2e-scoring-adapter.ts:46-66` back-fills the scored fields **from Agent 1**, so 2e's score reflects Agent 1's data, not 2e's one sentence.
- **Agent 2c**: scorer rewards **word count per sense** (`agent2c-location-profiles-scorer.ts:250-271`) on an artifact the prompt forces to be 3–8-word phrases → structurally capped ~70.

### (B) The real quality machinery is already built — and wired SHADOW/OFF
This is the most important (and most fundable) finding: **we don't have to invent the fixes; we have to turn them on.**
- **Agent 2/2b**: `checkCast`, `checkVoiceCapsules` (`agent2b-voice-capsule.ts`), and a whole `agent2-cast-real-scorer.ts` exist — all **shadow-only** behind `AGENT2_CAST_CHECK` / `AGENT2B_VOICE_CHECK`, default OFF.
- **Agent 7**: `buildSceneGrid` (the beat scheduler) runs as `runAgent7SchedulerShadow` (`agent7-run.ts:36-75`), "acts on nothing."
- **Agent 8**: `@cml/novelty` cross-run store (`packages/novelty/`) is built and tested but `index.ts:11` says "NOT wired into the pipeline," and `similarity_threshold_default: 1.1` (`generation-params.yaml:167`) means the audit **never fires**.
- **Agent 1**: the `atmosphere` block is generated but **never read by any runner**; Agent 2c's atmosphere wins (verified by the autumn→summer season flip in the prose).

### (C) Artifacts encode the gimmick, not the substance
- **Agent 3**: `crime_class.subtype = "time-masked manor murder"` encodes the *concealment trick*; `hidden_model.outcome.result` describes only the faked timeline. **There is no physical manner of death** — so `resolveDeathMethod()` returns `""`, the reveal obligation is silently skipped, and the killing is first invented in Ch10's confession.
- **Agent 3b**: the prompt's `lockedFacts` example **is** the clock-rewind (`agent3b-hard-logic-devices.ts:155-156`: `"ten minutes past eleven"`, `"forty minutes"`); the model copies the exemplar, so every story converges on the same physically-absurd device.
- **Agent 6**: the blind-reader gate passes when the reader **guesses the culprit** and fails when fooled — it **optimizes for predictability**, the exact opposite of a satisfying reveal.

---

## 3. Per-agent findings and improvements (ranked by leverage within each)

### Agent 3 — CMLGenerator *(the keystone; fix first)*
**Caps:** ending, plot_structure, clues, premise.
- **No physical `death_method` distinct from the concealment mechanism.** `validateCml` never references `crime_class`/`subtype`; `subtype` is free-text. The whole death-method fix chain (ANALYSIS_47) is **inert** because the field never exists. → Add a **required** `CASE.death_method` (physical killing action), validated non-empty **and lexically distinct** from `hidden_model.mechanism.description`. Prompt: "the concealment trick goes in `mechanism`; the bodily killing goes in `death_method` and `outcome.result`." Make the `final_reveal` death obligation (`prompt-builder.ts:687-696`) **unconditional** — fail upstream rather than silently omit.
- **Premise/motive on the banned-trope list.** Motive = "financial desperation/inheritance" — the prompt's own #1 anti-novelty pattern (`agent3-cml.ts:154-161`). Red herrings point **at** the real culprit. → Validate ≥2 herrings misdirect *away*; require a non-generic `unusual_angle`.
- **Scorer is constant 100s** (`agent3-run.ts:228-273`). → Replace with content assertions (see §5).

### Agent 3b — HardLogicDeviceGenerator
**Caps:** premise (plausibility), plot_structure, clues.
- **Remove the hardcoded clock-rewind exemplar** (`agent3b-hard-logic-devices.ts:154-157`); replace with a format-only placeholder + 2–3 rotating, axis-matched exemplars. Device[0]'s `lockedFacts` seed the registry that Agent 9 reproduces **verbatim** (`agent3b-run.ts:114`), so the exemplar is privileged straight into prose.
- **Add a mechanism-plausibility judge** (a real LLM leg, hard floor ≥ 80) wired into the `agent3b-run.ts` retry loop; make it a **critical** test so an absurd device cannot reach A. Today the scorer only counts string length.
- **Cap device complexity** (`mechanismSteps ≤ N`); stop rewarding length in `scoreDeviceDepth`.

### Agent 5 — ClueExtraction
**Caps:** clues, prose (leakage), pacing.
- **Semantic dedupe before scoring** (`agent5-run.ts`): the fixed-slot scheme (`agent5-clues.ts:456-478`) *mandates* duplicate clues (the verified "LINKS/TIES" twin; Margaret-elimination twice). Merge by normalized `pointsTo`/token-Jaccard.
- **Restructure the record to `{observable, inference, pointsTo, first_full_reveal_chapter}`** so the spec sentence never reaches Agent 9 (kills the leakage at the source, complementing the R-A chokepoint).
- **One-insight / one-clearance discipline**: ≤1 elimination clue per suspect (fixes the Ch9/Ch10 double-clearance smear); forbid two clues sharing a normalized `pointsTo`.
- Remove the `quality_score = max(70, …)` floor so duplicates actually cost points.

### Agent 6 — FairPlayAuditor + BlindReader
**Caps:** ending ("predictable"), clues.
- **Invert the blind-reader into a two-stage "fooled-then-convinced" test.** Run it on early+mid clues (must suspect the `false_solution.accused_suspect`, a non-culprit) then on +late clues (must flip to the true culprit). Replace `blindPasses` (`agent6-run.ts:1591`): a reader who guesses the true culprit **before** the reversal **fails** (too obvious). This makes *surprise* gateable for the first time.
- **Audit `false_solution`/red-herring `points_at_suspect`** (currently 0 references) — fail if any herring points at the real culprit.
- **Verify manner-of-death deducibility** in the structural audit (`agent6-run.ts:677`).

### Agent 7 (+6.5) — Narrative outline / WorldBuilder
**Caps:** pacing (the 5), plot_structure, opening_hook, atmosphere.
- **Make `buildSceneGrid` authoritative (M4).** Replace `runAgent7SchedulerShadow` (`agent7-run.ts:36-75`) with a gate that assigns each chapter **one obligation** and rejects outlines where two adjacent chapters share a job (kills the Ch9/Ch10 smear deterministically — the outline already *bans* it as an unenforced prompt line, `agent7-narrative.ts:750`).
- **Per-chapter word budget + `chapterJob`.** Every scene is hardcoded `estimatedWordCount: 1800` for a *short* story whose ideal is ~1,000 → verbosity → pacing 5. Derive the budget from `getStoryLengthTarget`; **invert** `scoreSceneDetail` (`agent7-narrative-scorer.ts:261-285`) which currently rewards longer.
- **Opening-hook contract**: gate that Scene 1's `summary` leads with the body/discovery, not arrival/atmosphere.
- **Atmosphere-density**: vary the stamped world notes per position; render each location in full **once**, then flag "reference-only" (stops the repeated clock/scent palette).

### Agent 2 + 2b — Cast / Profiles / VoiceCapsule
**Caps:** dialogue (frozen 6), character_clarity.
- **Wire `checkVoiceCapsules` as an enforced gate** (`agent2b-run.ts:89`, currently shadow): fail on `duplicate_voice` / `deployableCount < count`. Four of five voices in the real run were "measured/precise" — the direct cause of "overly formal, lacking variation."
- **Atomize humour** in `asset-library.ts:56-80` (a `voice:NAME:humour` atom): Agent 2b already generates per-character humour, then drops it — the single largest untapped dialogue-variation lever, **zero new LLM cost**.
- **Add a concrete `signatureTic`** to `CharacterProfileOutput` so Agent 9 has something to *quote*, not paraphrase.
- **Swap in `agent2-cast-real-scorer.ts`** (kills the empty-array depth cap that pinned quality at 60); reject hollow `motiveSeed = ""`/"N/A".

### Agent 2c/2d/2e — Location / Temporal / Background context
**Caps:** atmosphere, pacing, consistency.
- **Run Agent 2c after Agent 7** (or pass the CML crime-scene location) so the **crime scene has a profile**. In the real run the crime scene was the *Study* but 2c profiled a *Library* — Agent 9 had no sensory bible for the actual scene → generic, repeated openers and 3 AtmosphereRepair passes.
- **Per-location distinctness gate**: flag >50% sensory-atom overlap or shared `mood` across locations; rewrite `scoreSensoryRichness` to count **distinct atoms**, not words.
- **Season/time consistency contract** between Agent 1 and 2c (the autumn→summer flip); make the 2e scorer grade 2e's own output, not Agent-1 back-fill.

### Agent 8 — Novelty
**Caps:** premise (frozen 7), opening_hook.
- **Turn it on**: lower `similarity_threshold_default` from 1.1 (`generation-params.yaml:167`) so the audit fires; run it **before** the expensive CML on a cheap premise skeleton.
- **Wire the built cross-run store** (`@cml/novelty`): persist each shipped skeleton's fingerprint; feed `recent(20)` into `buildNoveltyConstraints` so avoidance includes **prior runs**, not just static seeds. This is what breaks the manor-clock attractor.
- **Make it authoritative**: a too-similar premise **reject-and-regenerates**, not warns. Add an `unusual_angle` requirement.

### Agent 1 — SettingRefiner
**Caps:** atmosphere, premise grounding.
- **Pipe `atmosphere` into the Agent 9 prompt** (today it's computed and discarded; Agent 2c overrides it). Reconcile the season so it can't contradict.
- **Score the real artifact** (delete the fabricating adapter); make `realism.recommendations` load-bearing (feed forensic/comms constraints to Agent 9) or drop them.

---

## 4. The rubric-category → owning-agent map

The link ROADMAP_TO_80 was missing: the **frozen** marks are owned upstream.

| Rubric category | Now | Upstream owner(s) | The fix that moves it |
|---|:--:|---|---|
| premise / concept | 7 (frozen) | **8** (novelty), **3** (angle) | cross-run novelty store + `unusual_angle`; non-trope motive |
| opening_hook | 6 (frozen) | **7** (outline), **2c** (scene profile) | in-medias-res Ch1 contract; crime-scene location profile |
| plot_structure | 7 | **7** (scheduler), **3** | authoritative beat grid; one job per chapter |
| character_clarity | 6→7 | **2/2b** | enforced voice distinctness; real cast scorer |
| dialogue | 6 (frozen) | **2b** (VoiceCapsule), **65** | wire VoiceCapsule + humour atoms + signatureTic |
| atmosphere | 8 (hold) | **2c**, **1**, **65** | distinct per-location sensory; stop the discard/override |
| clues | 7→8 | **5**, **6** | dedupe + one-insight; key-term records |
| pacing | 6→**5** | **7** (budget), **5** (clearances) | per-chapter word budget; one clearance per suspect |
| ending / reveal | 6(capped)→8 | **3** (death_method), **6** (reversal) | required death_method; fooled-then-convinced blind reader |
| prose / polish | 6 | **5** (leakage), **7** (length) | key-term clue records; length budget |

**Every frozen mark has a named upstream owner and a concrete fix.** That is the thesis of getting agents 1–8 to 90% so Agent 9 can reach 80.

---

## 5. The real "90% fitness" gate (replace the vanity score)

A consolidated definition of what "≥90, fit for an 80-story" should *assert* per agent (all are checks that today either don't exist or run in shadow):

- **Agent 1**: `atmosphere` is consumed by Agent 9 (round-trip) and ≥3 sensory modalities tied to the decade; no season contradiction with 2c.
- **Agent 2/2b**: `uniqueRegisters ≥ 0.6×count` **and** `duplicatePairs == 0` **and** `deployableCount == count`; ≥2 distinct humour styles; no hollow motive.
- **Agent 2c**: every scene/CML location resolves to a profile; the **crime scene** is profiled; cross-location distinctness above threshold.
- **Agent 3**: `death_method` present, **physical**, and **lexically distinct** from the concealment mechanism; `outcome.result` names the death; motive off the banned list; ≥2 herrings misdirect away.
- **Agent 3b**: device[0] passes an independent plausibility judge ≥ 80; ≤ N causal steps; title/lockedFacts not on the exemplar denylist (clock-rewind, "forty minutes").
- **Agent 5**: no duplicate clues (normalized-`pointsTo` Jaccard < 0.6); one insight per clue; ≤1 elimination per suspect; descriptions are intent, not spec sentences.
- **Agent 6**: a two-stage blind-reader proves **fair AND non-obvious** (fooled by the false solution on early+mid clues, reverses on the late clue, can name the manner of death).
- **Agent 7**: one distinct job per chapter, no adjacent repeat; word budget within ±15% of the length target; Ch1 opens on the body.
- **Agent 8**: the premise/mechanism fingerprint diverges on ≥2 structural fields from every run in the last 20.

---

## 6. Prioritized roadmap

**Tier 1 — Cheap wins: turn ON machinery that already exists (days, not weeks).**
1. **Agent 3 `death_method`** required + distinct-from-mechanism (the keystone; unblocks the ending cap and stops the 40-retry churn).
2. **Agent 7 beat scheduler authoritative** (`buildSceneGrid` shadow→gate) + per-chapter word budget — directly fixes pacing 5 and the double-clearance smear.
3. **Agent 2b VoiceCapsule + humour atoms wired** (shadow→enforced) — attacks the frozen dialogue 6.
4. **Agent 8 novelty store wired + threshold lowered** — attacks the frozen premise 7.
5. **Agent 5 semantic dedupe** — clues/prose/pacing.

**Tier 2 — Artifact-substance fixes.**
6. **Agent 6 blind-reader inversion** (fooled-then-convinced) — makes surprise gateable; the only lever for "predictable reveal."
7. **Agent 3b plausibility judge + delete clock exemplar** — premise plausibility.
8. **Agent 2c after Agent 7 + crime-scene profile + distinctness** — atmosphere/pacing.

**Tier 3 — Replace the vanity scorers** with the §5 fitness gates (Agent 1/2/2c/2e/3 scorers, the 3b length scorer, the 7 "longer = better" scorer). This is what makes "90%" *mean* something and prevents regression.

**Expected effect:** Tier 1 alone targets the four frozen marks (premise, opening, dialogue, ending) the prose program could not move, because they are **upstream-owned**. Tier 1+2 is the realistic path to the artifacts no longer capping the prose — the precondition ROADMAP_TO_80 named for Agent 9 reaching a dependable 73–76 and a credible run at 80.

---

## 7. How this connects to "Agent 9 at 80"

ANALYSIS_47 proved the ceiling is upstream: re-rolling Agent 9 cannot fix a defect baked into the artifacts. This document localizes **which** upstream agent owns **each** ceiling, and finds that in almost every case the fix is **already written and disabled**. The order is therefore:

1. **Make the artifacts fit** (Tier 1–2): every story has a real manner of death, a plausible mechanism, distinct voices, deduped clues, a paced outline, a surprising-but-fair reveal, and a non-repeating premise.
2. **Make the gates honest** (Tier 3): so "90%" certifies fitness, not schema-completeness — and a future regression *fails* instead of scoring A.
3. **Then** Agent 9's prose program (ROADMAP_TO_80 M1/M3 + the death-method wiring already committed) has artifacts worth rendering, and 80 becomes an engineering target rather than a hope.

> The one-line version: **the upstream agents are scoring themselves 100/A on the wrong test. Fix the test (mostly by un-disabling code that already exists), and the artifacts stop capping the prose.**

---

## 8. Implementation progress log

**Landed (verified in code, unit-tested, committed):**
- **T1.1 — Agent 3 `death_method` (keystone).** Skeleton key + genre rule + checklist + a guaranteed `normalizeCml` population (`deriveDeathMethodFromCrimeClass`: model value → class-derived → neutral default). This completes the chain whose prose half (`resolveDeathMethod` producer/gate + the rubric grader) was already committed but **inert** because Agent 3 never emitted a manner of death. The validator was deliberately **not** made hard (validateCml hard-throws in Agent 9 and old replays lack the field; the resolver returns `""` gracefully), so no run-blocking error was introduced.
- **T2.5 — Agent 3b de-anchor.** Removed the hardcoded clock-rewind `lockedFacts` exemplar (the literal `"ten minutes past eleven"` / `"forty minutes"` the model copied into every story) → format-only placeholder + a "don't default to the clock" mechanism-family nudge.
- **T1.5 — Agent 2b humour atoms.** New `voice:NAME:humour` deployable asset (fires on `humourStyle≠none && humourLevel≥0.4`) so dialogue gets tonal contrast — data the agent authored then dropped.

`prompts-llm` **433 passed**, `tsc` clean. (Commit: "ANALYSIS_48 Tier-1 upstream fitness".)

**Verified-in-code but deliberately deferred (with reasons — NOT to be flipped blind):**
- **T1.2 / T1.3 (Agent 7 outline).** Making `buildSceneGrid` authoritative is a structural rewire that ROADMAP_TO_80 (M4) already flags as requiring a full-run validation, not a blind flip. The word-budget piece (`estimatedWordCount` hardcoded `1800`) pairs with it. → one focused outline PR with a live run.
- **T1.4 (VoiceCapsule gate).** Voices are *currently* near-identical, so enforcing the gate today would force a retry on most runs; it needs the gate **and** a tuned distinctness threshold together (and benefits from T1.5 first). → pair with a live-run check.
- **T1.6 / T1.7 (Agent 8 novelty).** Confirmed the threshold `1.1` means the audit never fires. But lowering it **alone** adds an LLM call + a possible CML regeneration while comparing only to **static seeds** (identical every run) → low value. The real lever is T1.7 (persist a cross-run fingerprint ledger and feed `recent(20)` into the avoidance constraints); `@cml/novelty` is built and tested but unwired. → one focused novelty PR that does T1.7 then flips T1.6.
- **T1.8 / T2.10 / T2.11 (Agent 5 clues).** The "duplicate" clues are **structurally-required slots** (`clue_*_core`, `agent5-clues.ts:456-478`) with cross-referenced IDs — a safe fix is the record **restructure** (`{observable, inference, pointsTo, first_full_reveal_chapter}`) with reference re-pointing, not a record-removing dedupe. The prose-visible twin is already mitigated by the committed `dedupeByDescriptionSimilarity`. → the clue-record refactor PR.

**Not yet started:** Tier 2 (T2.1–T2.9 — blind-reader inversion, 3b plausibility judge, 2c crime-scene profiling) and Tier 3 (the scorer rewrites). These are the substance/measurement changes; each is a focused PR gated on a live run, per §6.

**Sequencing recommendation:** the three landed items are exactly the ones that are (a) high-leverage and (b) safe to ship without a live-run gate. Everything remaining changes generation behavior or run control flow and should be landed one focused PR at a time, each verified on an Azure replay — which is the same discipline ROADMAP_TO_80 prescribes. **Next highest-value PR: T1.7 (cross-run novelty store)** — it's the only remaining lever on the frozen `premise` mark and is additive (a ledger + avoidance feed) rather than a control-flow flip.

# ANALYSIS_57 — Prose to 80+ (ChatGPT band): a strategic, parameter-generic plan

Status: **strategy / deep-dive.** Grounded in run `09168377` (*The Sundial Shadow Conspiracy*): internal **K2 = 80/100**, ChatGPT **70/100**, ChatGPT's own ceiling estimate "**78–82 with the time-logic fixed and the experiment clarified.**" This doc turns that run's concrete defects into **generic, parameter-agnostic** levers for pushing the *external* (human/ChatGPT) prose score into the 80s — for **any** combination of era, setting, cast size, crime class, mechanism family, or story length.

> **Hard constraint (restated).** Every fix below must be **strategic and generic**. Nothing keys off a specific story, name, place, weather, or mechanism. Each fix is parameterised by a *structural property* (fact type, mechanism precondition, test shape, clearance type, cast gender) that exists for **every** run, and each entry states its parameter-agnostic guarantee explicitly.

---

## Implementation status (living — code landed on `redesign/agent-blue-sky`, not yet committed; no powered validation run yet)

| Lever | Status | Where |
|---|---|---|
| §4 D1 detector — malformed-surfacing cap (prose, global ≤70 at ≥3) | ✅ landed + tested | `rubric-score/facts.ts`, `hard-caps.ts` |
| §4 D4 detector — report-style clearance cap (prose + ending) | ✅ landed + tested | `rubric-score/facts.ts`, `hard-caps.ts` |
| D1 generation — atomic-vs-descriptive locked-fact split; verbatim only for atomic; descriptive → paraphrase block | ✅ landed + tested | `prompt-builder.ts` (`isAtomicLockedFactValue`), `agent9-run.ts` |
| D1 generation — `repairMalformedSurfacing` post-pass (apostrophe-splice cleanup) | ✅ landed + tested | `agent9-run.ts` |
| **D1 bug fix** — 7-word time-of-day ("…past four in the afternoon") was misclassified DESCRIPTIVE by the `>6 words` guard, losing verbatim fidelity on the clue-critical value; now strips the trailing day-part before the length check | ✅ landed + tested | `prompt-builder.ts` (`isAtomicLockedFactValue`) |
| D4 generation — deterministic clearance + obligation reworded off the "verdict" frame into dramatized deduction | ✅ landed + tested | `deterministic-repair.ts`, `obligation-block.ts` |
| D7 generation — physical-concreteness checklist (action + observed value + explicit exclusion) | ✅ landed | `discriminating.ts` |
| **D2 generation — "single canonical contradiction" contract** (staged/true pair surfaced AS ONE contrast, never two flat truths) via `findDiscriminatingContradictionPair` | ✅ landed + tested (this pass) | `prompt-builder.ts` |
| §4 **D2 detector** — dual-value-without-contrast → cap *clues* | ✅ landed + tested (this pass) | **unlocked by the ledger**: the world-state's canonical staged/true pair is published on `ctx.discriminatingContradiction` and threaded into `scoreStory` → `extractStoryFacts(cml, prose, { discriminatingPair })`; a high-precision windowed detector caps *clues* at 6 only when both canonical values co-occur with no contrast connective. `rubric-score/facts.ts`, `hard-caps.ts`, `score.ts`; wired in `agent9-run.ts` + `mystery-orchestrator.ts` |
| **D3 mechanism-environment contract** — derive the device's environmental precondition (solar/tidal/thermal/acoustic/astronomical), check it against the setting weather, and on conflict inject a "brief justified local exception" instruction into the prose prompt + warn | ✅ landed + tested (this pass) | new `mechanism-environment.ts` (`deriveMechanismEnvironmentPrecondition`, `checkMechanismEnvironmentConsistency`); wired in `agent9-run.ts`; surfaced via `prompt-builder.ts` (`mechanismEnvironmentException`) |
| **D5 pronoun re-validate-after-mutation** — extend the validation-gated mutation law beyond the grounding lead: wrap the deterministic post-processing passes (`repairMalformedSurfacing`, the broad pronoun sweep) in `mutateThenValidate` against a deterministic pronoun-stability validator (reuses `CharacterConsistencyValidator`); a pass that raises the misgendered-pronoun count auto-reverts. Pure-win; gated by `AGENT9_MUTATION_REVALIDATION`. | ✅ landed + tested (this pass) | `agent9-run.ts` (`buildPronounStabilityValidator`, `applyPronounGuardedMutation`) |
| **§9.1 world-state ledger + contradiction gate** — one canonical, typed, cross-checked object unifying D1 (typed facts) + D2 (staged/true pair) + D3 (mechanism-environment) + identity (gender); a gate reports culprit-is-victim / mechanism-environment / missing-gender / duplicate-name conflicts. v1 is a read-model wired into `agent9-run.ts` that logs gate conflicts (coherence telemetry — the §9.4 foundation). | ✅ landed + tested (this pass) | new `world-state.ts` (`buildStoryWorldState`, `runContradictionGate`); wired in `agent9-run.ts` |
| **§9.2 discriminator verifier** — deterministic soundness over the suspect partition: culprit is the unique survivor, every other suspect eliminated, ≥1 planted clue cited; flags `no_culprit` / `culprit_eliminated` / `suspect_unaccounted` / `no_evidence_clues`. | ✅ landed + tested (this pass) | new `discriminator-verifier.ts` (`verifyDiscriminator`); wired (warn-level telemetry) in `agent9-run.ts` |
| **§9.5(2) draw-from-ledger (consuming side)** — the ledger is built ONCE in `agent9-run`; D3's prose instruction and the D2 detector's pair are read off it (no second computation). | ✅ landed | `agent9-run.ts` |
| §9.5(2) full obligation rewire — thread the ledger object into `ProseGenerationInputs` so `prompt-builder` reads D1/D2 off it instead of calling the shared pure helpers itself | ⏳ follow-up (code-org, no drift) | the helpers are pure on the same inputs, so values can't drift today; this is centralization, not a correctness fix |
| contradiction gate / discriminator verifier → **repair-at-source** (promote from warn-level to abort-to-repair) | ⏳ gated on the validation run | deliberately warn-only now — a mid-pipeline abort gate can kill runs ([[template-bleed-no-backstop-kills-runs]]); promote only with telemetry showing it fires on genuine defects |
| D5 `pronoun_policy` enable (A/B); D6 voice capsules | ⏳ not code-completable | A/B-gated by design — needs a powered run to enable safely |
| judge re-calibration 70–80; critique→rewrite at creative temp; stronger generator model | ⏳ not code-completable | measurement-infra / model-tier (P2) |

All touched suites green at last run: prompts-llm 572, rubric-score 62, worker 259. `@cml/prompts-llm` + `@cml/rubric-score` dist rebuilt and the worker rebuilt against them, so the runtime sees the new classifier, the D3 check (drawn from the ledger), the D5 mutation guard, the world-state gate, the discriminator verifier, and the D2 clues cap.

---

## 0. Thesis — the gap is the prose layer, and it is invisible to our own judge

Two facts frame everything:

1. **Internal K2 = 80, ChatGPT = 70.** The 10-point delta is not noise — it is precisely the **prose-layer defects** a human penalises hard but our internal rubric under-detects: garbled evidence phrasing, a self-contradicting central clue, report-style clearances, pronoun slips. ChatGPT scored **prose 4/10** and **clues 5/10**; the internal scorer did not "see" those.
2. **Therefore two things must both happen.** (a) Generation must stop *producing* these defects, and (b) the internal judge must start *seeing* them — otherwise we optimise blind and keep shipping "80s" that read as 70s.

The structure is already strong (premise 8, plot 8, atmosphere 8). **We are not short on architecture; we are short on surface execution and on a judge that measures it.** Every point below targets the lever categories, never the ceiling ones.

---

## 1. Anatomy of the 70 — where the points actually are

| Category | ChatGPT | Reachable | Lever? | The generic defect that caps it |
|---|---|---|---|---|
| Premise / concept | 8 | 8–9 | — | (ceiling — leave it) |
| Plot structure | 8 | 8 | — | (ceiling) |
| Atmosphere / setting | 8 | 8 | — | (ceiling) |
| Opening hook | 7 | 8 | small | first clue stated as a contradiction (see D2) |
| Pacing | 7 | 8 | small | — |
| Ending / reveal | 7 | 8 | small | report-style clearances (D4); abstract test (D7) |
| **Character clarity** | **6** | **8** | **yes** | pronoun instability (D5) |
| **Dialogue** | **6** | **8** | **yes** | functional, low idiolect (D6) |
| **Mystery clues / logic** | **5** | **8** | **YES** | self-contradicting central clue (D2); mechanism-env incoherence (D3) |
| **Prose / polish** | **4** | **7–8** | **YES** | verbatim-locked-fact garble (D1); injection templates (D4); pronouns (D5) |

**The two dominant levers are `clues 5→8` and `prose 4→7/8` (+6–7 marks ≈ the entire 70→80+ jump).** ChatGPT's own verdict agrees: fix the clue logic + clarify the test → 78–82. Everything else is +1s.

---

## 2. The seven generic defect classes (root cause → generic fix → anchor → guarantee)

### D1 — Verbatim-locked-fact garble *(prose 4 — the #1 polish killer)*
**Symptom (run):** `…barometer needle settling on drizzle'the groundskeeper's entry noting silhouettes on the west lawn skies…` — six such run-ons across chapters, with stray `'` joins and dangling key-terms.
**Root cause (generic):** the prose prompt's **LOCKED EVIDENCE PHRASES block** ([prompt-builder.ts](packages/prompts-llm/src/agent9-prose/prompt-builder.ts), `lockedFactsBlock`) demands the model reproduce **every** locked fact *verbatim, character-for-character, no paraphrase*. That is correct for an **atomic** fact (a time/amount/measurement: "thirteen minutes to midnight") but wrong for a **descriptive** fact (a weather-log line, a document's contents): forcing a descriptive clause in verbatim produces an ungrammatical splice, and `enforceLockedFactValuePresence` then re-injects the same raw value, compounding it.
**Generic fix:**
1. **Type the locked facts.** Classify each by structural type — `atomic_measurement` (time/number/quantity) vs `descriptive_claim` (log/record/document text). The CML/registry already carries a value + description per fact; derive the type from the value shape (does it parse to a time/number/quantity?).
2. **Verbatim only for atomic.** Atomic → keep the existing verbatim obligation (fidelity matters for the clue). Descriptive → demote to a **paraphrasable key-term obligation** (surface the salient nouns, *compose your own sentence* — the existing R-A `surfaceSpecKeyTerms` path), never a verbatim clause.
3. **Deterministic malformed-surfacing repair** (post-prose, parameter-free): detect `\w['’]\w` no-space joins and dangling-keyword run-ons (a value's last token appended after an unrelated clause) → split/clean or drop.
**Anchor:** `lockedFactsBlock` (prompt-builder.ts); `enforceLockedFactValuePresence` (agent9-run.ts); `surfaceSpecKeyTerms` (deterministic-repair.ts).
**Parameter-agnostic guarantee:** keys off **fact *type*** (atomic vs descriptive), never fact content — holds for any era/mechanism/evidence.

### D2 — Self-contradicting central clue *(clues 5 — ChatGPT's "biggest problem")*
**Symptom (run):** Chapter 1 states **both** "twenty minutes past four" and "half past three" as flat truths; the staged-vs-true relationship is never framed as a single contradiction, so "the central clue contradicts itself."
**Root cause (generic):** the discriminating mechanism has a **staged value** and a **true value**, but they are surfaced as **two independent locked facts**, each obligated flatly. Nothing requires the prose to present them **as one contradiction**.
**Generic fix — the "single canonical contradiction" contract.** Every discriminating test reduces to `(staged_value, true_value, what_exposes_the_gap)`. Make Agent 3 emit that triple explicitly, and make Agent 9's discriminating-test obligation require the pair to appear **as a contrast** ("the watch read *staged*, but the shadow could only fall that way at *true*"), never as two standalone statements. **Deterministic check** (parameter-free): if a chapter contains both the staged and the true value with **no contrast connective** ("but/yet/however/could only") between them → flag + repair.
**Anchor:** `discriminating_test` block (agent3-cml), the DT-scene obligation (obligation-block.ts), `enforceLockedFactValuePresence`.
**Parameter-agnostic guarantee:** operates on the **staged/true pair**, not the values — identical for a clock, a tide table, a thermometer, or a ledger date.

### D3 — Mechanism–environment incoherence *(clues + atmosphere)*
**Symptom (run):** the sundial clue requires **clear skies**; the setting is **winter overcast/drizzle**. The clue-critical condition contradicts the ambient world, and the prose visibly strains to reconcile them (feeding D1).
**Root cause (generic):** no consistency contract between a mechanism's **required environmental precondition** (light, tide, temperature, daylight hour…) and the **setting/season/weather** chosen by Agent 1 / Agent 2d. (This is the deferred A_56 "1-B" generalised — the run proves it's real, not fuzzy.)
**Generic fix — mechanism-environment consistency contract.** The hard-logic device already implies an environmental precondition; surface it as a structured field (`requires_environment: {factor, condition}`). At Agent 3/7, deterministically compare it to the setting's weather/season/time-of-day: on conflict, **repair** — either adjust the ambient toward the precondition, or insert a justified local exception ("a brief break in the overcast"), and warn. Never ship a mechanism whose precondition the world contradicts.
**Anchor:** agent3b hard-logic device, Agent 1 setting atmosphere, Agent 2d seasonal lock, a new check in agent7-run / agent3-run.
**Parameter-agnostic guarantee:** parameterised by the **mechanism family's precondition type**, not a specific weather — works for solar, tidal, thermal, acoustic, optical mechanisms alike.

### D4 — Deterministic-injection template prose *(prose + ending)*
**Symptom (run):** *"Charles Whitmore was cleared because the Servants' testimonies and location in main hall during murder time established by the evidence and the timeline placed Charles Whitmore outside the fatal sequence of events."* — reads as validation output, not prose.
**Root cause (generic):** the deterministic **clearance patch**, the **locked-fact injection**, and the **resolution backstop** all emit fixed templates ("X was cleared because…", "X was responsible, and the evidence placed the matter beyond all reasonable doubt"). They guarantee *presence* but read as report.
**Generic fix:** route every deterministic injection through one of two parameter-free naturalisers — (a) a **micro-regen** (a tiny, cheap LLM rewrite of the injected fact into an in-scene deduction line), or (b) a **deduction-framed template library keyed off the clearance/injection *type*** (alibi / location / timing / access), e.g. *"Beatrice had been in the kitchen from half past three to the supper bell; three servants placed her there"* — never the "X was cleared because" frame. Prefer (a) when an LLM call is affordable; (b) as the deterministic fallback.
**Anchor:** the clearance patch + `enforceLockedFactValuePresence` + `buildResolutionBackstopSentence` (agent9-run.ts).
**Parameter-agnostic guarantee:** keys off the **clearance/injection *type***, never names — every suspect clearance reduces to alibi/location/timing/access.

### D5 — Pronoun & entity instability *(character 6)*
**Symptom (run):** Daphne (female) drawn with masculine pronouns; Arthur/Edward drift. ChatGPT: "pronouns still slip."
**Root cause (generic):** `agent9_prose.validation.pronoun_policy = off` in generation-params.yaml — the gender-locked sweep is disabled; only the parity gate runs (7 repairs, residuals remain), and post-generation mutation passes can re-introduce drift without re-validation (the known `agent9-postprocess-after-validation` trap).
**Generic fix:** drive a **gender-locked pronoun discipline from the cast genders** (every character has one): build a per-character pronoun lock and enforce it both at generation and **after every mutation pass** (extend `AGENT9_MUTATION_REVALIDATION` across the full post-processing chain, not just grounding). Because `pronoun_policy` is score-sensitive (false replacements in ambiguous antecedents), the enable is **A/B-gated**, but the *re-validate-after-mutation* half is pure-win and can ship now.
**Anchor:** generation-params.yaml `pronoun_policy`; `repairChapterPronouns` / the parity sweep; the post-processing chain in agent9-run.ts.
**Parameter-agnostic guarantee:** keys off **cast gender**, present for every character.

### D6 — Functional dialogue *(dialogue 6)*
**Symptom (run):** "some decent dry Arthur lines, but several exchanges still sound functional."
**Root cause (generic):** Agent 2b builds per-character **VoiceCapsules** (speech mannerisms, register, idiolect fragments) but they are **not wired into the prose prompt** beyond a single "voice colour" line, and `AGENT2B_VOICE_CHECK` is off — so distinctiveness isn't enforced.
**Generic fix:** thread each speaking character's VoiceCapsule (register + 2–3 idiolect fragments + a forbidden-cliché) into the Agent 9 chapter prompt for the characters present, and add a **dialogue-distinctiveness** check (do the suspects' lines share a register fingerprint?). A/B-gate the enforce mode.
**Anchor:** Agent 2b voice-capsule; `buildCharacterContractsBlock`; `AGENT2B_VOICE_CHECK`.
**Parameter-agnostic guarantee:** keys off the **cast's voice profiles** (built for every cast, any size).

### D7 — Abstract discriminating test *(clues + ending)*
**Symptom (run):** ChatGPT: "the test says the evidence proves itself, but the geometry remains vague." The sundial experiment is conceptually right but physically unclear.
**Root cause (generic):** the discriminating-test scene obligation requires the test to *occur* but not to be **physically concrete** — a measurable action and an explicit exclusion of the false value.
**Generic fix — discriminating-test concreteness contract.** The test scene must contain three parameter-free beats keyed off the **test *shape***: (a) a physical action (place/measure/re-enact), (b) an observed quantity, (c) an explicit comparison that **excludes** the staged value and admits only the true one. Render per shape: `physical_trace` → match a mark; `timetable_contradiction` → align two clocks/logs; `reconstruction` → re-enact and compare; `chemical_timing` → observe a rate. Deterministic check: the DT chapter must contain an action verb + a quantity + an exclusion connective.
**Anchor:** DT-scene obligation (obligation-block.ts), the `discriminating_test_shape` (now derivable via the A_56 8-A skeleton).
**Parameter-agnostic guarantee:** keyed off the **test shape** (six values), never the specific apparatus.

---

## 3. The cross-cutting ceiling-breaker — critique→rewrite at creative temperature

D1–D7 remove defects (≈ 70 → 78). To *hold* 80+ rather than scrape it, the proven lever is a **critique→rewrite pass at creative temperature (0.7–0.9) with deterministic re-validation + rollback**, scoped per-chapter to the **lowest-scoring categories** (ROADMAP_90 T2). The current post-pass runs at temp 0.2 ("prefer no change") and structurally cannot lift craft. This is the difference between *not failing* and *being good*.
**Parameter-agnostic guarantee:** scoped by per-chapter category scores, which exist for every story.

---

## 4. The measurement prerequisite — close the internal↔ChatGPT gap (or optimise blind)

**The internal rubric scored this 80 while a human scored it 70.** That means our judge **under-detects D1/D2/D4/D5**. If we tune generation against the internal judge, we will "improve" without the reader noticing. So the *first* lever is making the score honest:

- **Add deterministic structural detectors** to `@cml/rubric-score` (facts/hard-caps) for the defects a human always catches: **malformed-surfacing** (D1: `\w'\w` joins / dangling run-ons → cap *prose*), **dual-value-without-contrast** (D2: staged & true value co-present, no contrast connective → cap *clues*), **report-style clearance** (D4: "X was cleared because" / "as for myself" → cap *prose/ending*). These are parameter-free regex/structure checks, exactly like the existing mechanism-leak and victim-lifecycle caps.
- **Judge re-calibration at 70–80** (ROADMAP_90 T2a): anchor the LLM judge with exemplars so an 80 means a human 80, validated against held-out human/ChatGPT scores within ±3.

Until this lands, "80+" is unfalsifiable. **This is the meta-lever and belongs in P0.**

---

## 5. Prioritisation & sequencing

**P0 — make the gain real and visible (generic code, no measurement dependency):**
- §4 detectors (D1/D2/D4 caps + the malformed-surfacing repair) — *so the score stops lying.*
- D1 (atomic-vs-descriptive locked facts), D2 (single-contradiction contract), D3 (mechanism-environment contract), D4 (injection naturalisation).
These four are the bulk of `prose 4→7` and `clues 5→8` — the whole 70→80 jump — and are pure deterministic engineering.

**P1 — concreteness + the A/B-gated craft gates:**
- D7 (test-concreteness contract).
- D5 (pronoun: ship the *re-validate-after-mutation* half now; A/B the `pronoun_policy` enable).
- D6 (dialogue: wire VoiceCapsules; A/B the enforce gate).

**P2 — the ceiling (model/measurement-tier):**
- Critique→rewrite at creative temp (§3); judge re-calibration (§4); stronger generator model.

---

## 6. Acceptance criteria (generic, parameter-agnostic — measured across DIVERSE inputs)

A change counts only if it holds on a **powered N≥4 set spanning different era / setting / cast size / crime class / mechanism family** (single-story deltas are confounded — the `canary-k2-single-run-confounded` rule):
- **D1:** malformed-surfacing detector = 0 occurrences.
- **D2:** the discriminating clue appears as exactly **one** staged↔true contradiction (contrast connective present; no flat dual statement).
- **D3:** the mechanism precondition is consistent with the setting (or carries a justified local exception); 0 unresolved conflicts.
- **D4:** 0 "X was cleared because" / "as for myself" template lines.
- **D5:** 0 gender-mismatched pronouns (gender-locked).
- **D7:** the DT chapter contains action + quantity + exclusion.
- **Headline:** mean **ChatGPT/human score ≥ 80** and **internal−external gap ≤ 3** across the diverse set.

---

## 7. Disposition — code vs measurement vs model-tier

| Lever | Type | Generic key | Ship |
|---|---|---|---|
| §4 internal detectors (D1/D2/D4 caps) | code | regex/structure | P0 |
| D1 atomic/descriptive locked facts + repair | code | fact type | P0 |
| D2 single-contradiction contract | code | staged/true pair | P0 |
| D3 mechanism-environment contract | code | precondition type | P0 |
| D4 injection naturalisation | code (+micro-regen) | clearance type | P0 |
| D7 test-concreteness contract | code | test shape | P1 |
| D5 pronoun re-validate-after-mutation | code | cast gender | P1 |
| D5 `pronoun_policy` enable | measurement (A/B) | cast gender | P1 |
| D6 VoiceCapsule wiring + enforce | measurement (A/B) | voice profile | P1 |
| Critique→rewrite at creative temp | model-tier | per-chapter scores | P2 |
| Judge re-calibration 70–80 | measurement | exemplars | P2 |
| Stronger generator model | model-tier | — | P2 |

---

## 8. Bottom line

The run is encouraging: **structure is at 8s, and the upstream fixes held (raw 80, mechanism withheld, roles stable).** The 70→80+ gap is **entirely prose-and-clue execution**, and every lever is **generic** — keyed off a structural property (fact type, mechanism precondition, test shape, clearance type, cast gender) that every run has, never off a specific story. The single most important move is **P0 §4**: teach our own judge to see the polish defects, then the four deterministic contracts (D1–D4) that eliminate them. Do that across a diverse N≥4 set and the external score follows the internal one into the 80s — for any inputs.

---

## 9. Deep dive — the *best* solutions for coherent, interesting, logically sound stories

§2–§7 are symptom-level (seven defects, seven patches). That is the *fastest* route to 78–82, but it is not the *best* architecture — seven independent patches drift apart, miss cross-defect interactions, and leave the next defect unguarded. This section steps back and asks: **what is the minimal architecture that makes coherence, interest, and logical soundness the DEFAULT — for any inputs?** The answer collapses the seven symptoms into **three root diseases**, each owned by one quality pillar, plus the connective tissue.

> **The reframe — 7 symptoms, 3 diseases:**
> | Pillar | Root disease | Symptoms it explains | The one best solution |
> |---|---|---|---|
> | **Coherent** | facts are surfaced *independently and restated*, so they drift and contradict | D1, D2, D3 | a **canonical world-state ledger** (single source of truth) + contradiction gate |
> | **Logically sound** | the mystery's *logic* is never verified — only the prose is checked | D2-logic, D7 | a **discriminator verifier** (the test provably excludes all but one) + concreteness rendering |
> | **Interesting** | deterministic guarantees ensure *presence*, never *quality* — they declare instead of dramatize | D4, D6, weak opening/ending | **dramatization-not-declaration** (presence guarantee → dramatization obligation + micro-regen) |
> | (connective) | identity isn't propagated; the judge can't see polish | D5; the §4 gap | **identity contract** + a **three-pillar judge** |

### 9.1 Coherence — one canonical world-state, drawn from, never re-derived *(best fix for D1+D2+D3)*

**Why the contradictions happen.** Today every fact the prose references is surfaced *independently*: the time is a locked fact here, restated as scene-setting there; the weather is a clue ("clear skies") and, separately, an atmosphere cue ("drizzle"); the staged time and the true time are two unrelated obligations. Nothing holds the *single truth* of each fact, so each restatement is a fresh chance to drift — and they do (4:20 vs 3:30; clear vs overcast). **Coherence cannot be a property the prose is asked to maintain across ten chapters; it must be a property of the data the prose draws from.**

**The best solution — a Story World-State object**, built once after Agent 3/7, before any prose:
- It holds the **canonical, typed, cross-checked** value of every fact the prose may reference: the true and staged values of the discriminating quantity; the environmental condition at each key moment (light/tide/temperature); each character's location per time-slot; method; motive; the murder moment.
- Every chapter obligation **reads from this object** — the locked-fact block, the clue placements, the clearance facts all dereference the same canonical value. Nothing is independently re-derived in a prompt or a deterministic patch.
- A **contradiction gate** runs once over the world-state (not the prose): staged ≠ true *and* the gap is exposable by a planted clue; the mechanism precondition is consistent with the chosen weather/season (D3); each suspect's slot-location is consistent with the clearance that will exonerate them. Conflicts are **repaired at the source** (adjust the world-state), never papered over in prose.

**Why this is the best, not just *a*, solution.** It *subsumes* D1, D2, D3 in one structure instead of three patches: typing the facts gives D1 its atomic-vs-descriptive split for free; co-locating the staged/true pair makes D2's single contradiction natural; checking precondition-vs-weather in one place is D3. Alternatives are strictly worse — (a) per-defect patches catch each fact in isolation but miss *cross-fact* contradictions (a weather clue vs an atmosphere cue live in different code paths); (b) post-prose contradiction detection is too late to repair cleanly and fights ten chapters of generated text. **Upstream + holistic beats downstream + piecemeal.** It also builds on what exists — the locked-fact registry, the clue-spec, and the A_56 8-A skeleton are proto-world-states; this unifies them.

### 9.2 Logical soundness — verify the *discriminator*, then render it physically *(best fix for D2-logic + D7)*

**The deeper point ChatGPT made.** "The central clue contradicts itself" and "the test says the evidence proves itself" are the *same* failure: **we check that a discriminating test is mentioned, never that it actually discriminates.** A fair-play mystery is logically sound iff (1) the test **excludes every suspect but the culprit**, (2) using **only clues the reader has already seen**, (3) via steps the reader can **reconstruct**. None of that is verified today.

**The best solution — a discriminator verifier over the world-state** (a constraint check, not prose): given the suspects, their slot-locations, and the planted clues, mechanically confirm that the discriminating quantity's *true* value **excludes each non-culprit** (each has a clue placing them outside the true window) and leaves the culprit as the **unique survivor**. This is solvable as a tiny constraint-satisfaction check; if it fails, the *case* is unsound and must be repaired before prose — better an honest abort-to-repair than a beautifully-written incoherent mystery.

Then the **test-concreteness contract (D7)** merely *renders* that proven logic: action → measured quantity → explicit exclusion of the staged value. The logic lives in the world-state; the prose dramatizes it. **Separating verifiable logic from dramatized prose is the whole game** — it's why the result is *sound by construction* and *vivid by rendering*, instead of hoping the LLM keeps the geometry straight.

### 9.3 Interest — dramatize, never declare *(best fix for D4 + D6, and the opening/ending)*

**Why deterministic guarantees read as a report.** Our safety nets — the clearance patch, the locked-fact injection, the resolution backstop — guarantee a fact is *present* by writing a template ("X was cleared because…", "X was responsible, and the evidence placed the matter beyond doubt"). Presence is necessary; the *template* is what kills interest. Interest cannot be injected deterministically — it must be **generated under constraint**.

**The best solution — convert every "presence guarantee" into a "dramatization obligation."** Two tiers:
1. **Preferred — micro-regen.** When a guaranteed fact is missing or template-shaped, spend one tiny LLM call to render it *in scene*: the clearance becomes "Beatrice had been in the kitchen from half past three to the supper bell; three servants placed her there" — a deduction the reader watches, not a verdict they're told.
2. **Fallback — deduction-framed templates keyed off type** (alibi/location/timing/access), never the "X was cleared because" frame, for when an LLM call isn't affordable.

This is the right division of labour: **the deterministic layer owns *presence* (it can never regress to a missing clue); the LLM layer owns *quality* (it dramatizes).** Couple it with the character **voice contract** (D6 — each speaker's register + idiolect threaded into the prompt) so dialogue distinguishes people, and with **escalation mirroring** — the clue-spec already narrows the suspect set structurally; the prose should mirror that closing net (rising pressure chapter to chapter), which is what makes a sound plot also *gripping*.

### 9.4 The connective tissue — identity propagation + a three-pillar judge

- **Identity is the substrate of coherence (D5).** A character's (name, gender, role) is a contract built at Agent 2 and **propagated + re-validated after every mutation pass** (the missing half of `AGENT9_MUTATION_REVALIDATION`). Pronoun drift is just identity coherence failing under post-processing. Fold it into the world-state: a character is a first-class fact like a time or a location.
- **The judge must measure all three pillars, or none of this is visible (§4).** Add deterministic signals to `@cml/rubric-score`: a **contradiction count** (coherence), a **discriminator-validity** flag (soundness), and a **show-vs-tell / idiolect-variance** signal (interest). An internal 80 that ignores contradictions, unsound tests, and template prose is the reason we shipped a 70 thinking it was an 80.

### 9.5 The synthesis — the generation contract

The best architecture is a contract in four clauses, each generic to any inputs:

1. **Construct, then verify.** Agent 3/7 emit a **coherent, logically-verified world-state** (single source of truth + contradiction gate + discriminator verifier). A case that can't be made coherent or sound is repaired *here*, never in prose.
2. **Draw, never re-derive.** Every Agent 9 obligation dereferences the world-state. No fact is independently restated, so nothing can drift.
3. **Guarantee presence deterministically; earn quality with the LLM.** Safety nets ensure facts are present; micro-regen / critique-rewrite ensure they're dramatized, not declared.
4. **Judge all three pillars.** Coherence, soundness, and interest are each measured, so the score is honest and the loop can close.

Under this contract, **coherent + sound + interesting is the default, not the lucky outcome** — and because every clause keys off a structural property (a typed fact, a suspect partition, an obligation type, a character record) that *every* story has, it holds across any era, setting, cast size, crime class, or mechanism.

### 9.6 Build order (best-value first)

1. **World-state ledger + contradiction gate** — the coherence root; eliminates the D1/D2/D3 cluster (the largest, and ChatGPT's "biggest problem") in one structure. *(P0)*
2. **Discriminator verifier + test-concreteness** — soundness; makes the mystery provably fair, then vivid. *(P0/P1)*
3. **Dramatization obligations + micro-regen** — converts the template guarantees (D4) into in-scene deduction; the biggest single jump in the *prose* mark. *(P0/P1)*
4. **Three-pillar judge detectors** — so 1–3 become *visible* and can't be optimised away. *(P0 — ship alongside, per §4)*
5. **Identity/voice contracts + critique→rewrite at creative temperature** — the polish ceiling that turns "not failing" into "good." *(P1/P2)*

Steps 1–4 are deterministic engineering and move the dominant levers (`clues 5→8`, `prose 4→7/8`). Step 5 is the model-tier ceiling. The ordering is deliberate: **fix coherence first (the data), soundness second (the logic), interest third (the prose), visibility throughout (the judge)** — because an interesting story that contradicts itself still scores 70, but a coherent, sound one that's only adequately written already clears 78.

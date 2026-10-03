# WF-003 — function inventory: decide, estimate, allocate

**Run:** three read-only Explore agents, launched together (Agent tool, not a Workflow script) · **Date:** 2026-10-03
**Agents:** 3 · **Subagent tokens:** 1,427,539 (394,999 + 537,125 + 495,415) · **Tool uses:** 484 · **Duration:** 26.1 min (the longest agent)
**Script:** none — the three briefs are summarised under "The question"
**Tree:** `57697b5d` · **Consumer:** [WP-006](../white-papers/WP-006-decide-estimate-allocate.md)

---

## The question

For a white paper on applying logic, statistics and mathematics to the system's functions: **what
functions exist, by job, and how does each decide today?** One agent per job.

- **Estimate** — every function that computes a statistic, score, rate, threshold, correlation or
  ranking: formula, deciding literals, whether it carries any uncertainty, its unit, its consumer.
- **Decide** — every function that decides a logical property of the case, outline or manuscript:
  procedure, what it returns on unreadable input, its consumer.
- **Allocate** — every function that allocates, schedules, selects, samples, measures distance or
  budgets: algorithm, constants, scale, tests, consumer.

Probe rule in every brief (A_103): for each "none found", state the patterns tried and confirm the
search works against a known positive.

## Findings that SURVIVED verification

Verified by the session that wrote WP-006, by reading the line or running `dist`.

| finding | how verified |
|---|---|
| The "repeated passage" finding can never fire: `repetitionDensity` returns 6-word spans, `findings.ts:350` skips spans under 8 words | read `findings.ts:346–356`; ran `dist` on the Lockwood manuscript — all five worst spans are 6 words |
| The anti-copy check has no live caller; `.env.local:361` sets `PROSE_ANTI_COPY_GATE=true`; the selector's `copiedSpans` is the constant 0 | grep over `apps/worker/src` and `packages/prose-engine/src` finds only `selector.ts:153` and `types.ts:377`; positive control: the same grep finds those two |
| The case-logic package exists, is pure, and is OFF | ran `buildCaseModel` / `analyseTimeline` / `analyseProof` over 72 stored projects, 0 failures (`WP-006-probes/case-logic-archive.mjs`) |
| `analyseTimeline` maps a missing event dial to 0 | read `timeline.ts:121–122`, `:162–163`. Whether a dial can be missing in practice was NOT established |
| Innocents' alibis are compared with the time of death by a report-only function; the culprit's by live code | read `alibi-plan.ts`, `timeline-deception.ts:421`; measured 25/25 against 8/25 (`timetable-uniqueness.mjs`) |
| The selector's calibration is fixed at 49 reads, weights −3 / −1 / +1.5 / +1 / +0.5 / +1, register floored at 0.058 | read `selector.ts:86–125` |
| `run-params.mjs` uses one `mulberry32` stream and `arg() ?? pick()` per field | read `:255–264`, `:429–613`. NOT run (it writes provenance files) |
| Two empty sets: Jaccard 1 in `agent2b-voice-capsule.ts:231`, 0 in `agent2c-location-distinctness.ts:53` | read both |
| `toBudget` stops at the first overflowing line | read `bible.ts:104–113` |
| `prose-feature-sweep.mjs` tests against `1.96/√(n−1)` uncorrected | read `:90` |
| The external-read manifest has no word count or register field | confirmed; WP-006 also found it stale (72 rows against 79 reads on disk) |

## Findings REFUTED or narrowed, and why

| claim as returned | correction |
|---|---|
| "Only three things decide anything in a run" (estimate agent) | True of the **statistical** functions only. The decide inventory lists several other live stops: `validateCml` retries, the Agent 3 victim/culprit abort, the Agent 5 clue-time abort, the pre-prose fair-play abort, the binding novelty gate |
| The name generator's gender split uses the low bit of a power-of-two LCG (allocate agent, row 32) | True, and harmless as used: the bit is read once per cast (`name-generator.ts:592`), so it is the seed hash's parity, not an alternating sequence |
| "A culprit cleared" (not an agent claim; a `dist` result, 31 of 69) | Not adjudicated. A culprit's false alibi is meant to clear them until the test. Do not act on this number without reading cases |

## What the run could NOT determine

- Whether any of the 20 "unreadable → pass" branches has let a real defect through. They are read
  from the code; none was exercised with a failing fixture.
- Whether `decisiveClueIds` branch 2 is dead. It is inferred from the schema, not run.
- Whether a pinned run parameter shifts the later fields in practice. Read, not run.
- How often each hand-set weighted pick is close enough for its weights to matter (WP-006 K16).

## Expand / skip

**Skip a re-run.** The tables below are the asset; re-read them before commissioning another inventory.
**Expand** only by running, not reading: a fixture per "unreadable → pass" branch (WP-006 K4, K5) and a
replay of each weighted pick with perturbed weights (K16).

---

## Inventory 1 — ESTIMATE (63 rows)

Since the v1 prose engine was deleted (`43b44336`), many prose-guard functions are called only by
tests and scripts. Error bars exist only in `read-matched-pair.mjs`, `corpus-cells.mjs` and the A_110
probes. "n only" = a count is reported, no interval.

| # | file:line | name | computes | deciding thresholds | uncertainty | unit | consumer |
|---|---|---|---|---|---|---|---|
| 1 | prose-guard/src/machine-register.ts:193 | scoreSentenceRegister | 4 yes/no features per sentence (abstract subject; stative verb with no concrete noun; no concrete noun; no sensory word) | leading clause stripped if its comma is ≤60 chars | no | sentence | rows 2, 21 |
| 2 | machine-register.ts:281 (:269) | machineRegisterRate | hits / narration sentences; hit = score ≥ threshold; ≥5 words, no dialogue, no first person | threshold 3 (:92); 4 exported, "not a lever" | n only | book or chapter | selector term; edit guard; scripts |
| 3 | prose-guard/src/repetition-density.ts:57 | repetitionDensity | distinct 6-word spans occurring ≥3 times ×10,000 / words; 5 worst spans | span 6, repeats 3 | no | book | v2 SHIP-CHECK; selector; findings |
| 4 | repetition-density.ts:82 | summariseRepetitionDensity | multiple = per10k / 17.3 | median 17.3 (212 manuscripts); ≥3× = WORTH A LOOK | no | book | warning line |
| 5 | prose-guard/src/wit-density.ts:113 (:160) | witDensity | (retorts + flat answers + understatements + polite savagery) ×10,000 / words | retort ≤6 words after ≥15-word speech; gap ≤700 chars; canon median 41.4, floor 20.6 | no | book | selector term |
| 6 | prose-guard/src/turn-density.ts:54 | turnDensity | middle chapters ending with an uncleared suspect or an overturned belief | chapters 3–8 | no | chapters | none live |
| 7 | prose-guard/src/voice-spec.ts:167/:190/:204 | voiceConformance etc. | 1 − \|mean − spec.mean\| / spec.sd, clipped | delivered at ≥0.8 | sd and n, no CI | chapter/book | scripts |
| 8 | voice-spec.ts:99 | validateVoiceSpec | accept/reject a spec | mean 9–22; sd 3–12; ≥2.0 from recent means | no | spec | none live |
| 9 | prose-guard/src/anti-copy.ts:199 (:273, :368) | findCopiedSpans | exact 11-gram matches against source novels; validator 100 or 0 | n = 11 (0 hits on 229 clean manuscripts) | no | book | **none live**; flag set in `.env.local` |
| 10 | prose-guard/src/scaffold.ts:133/:165 | detectScaffoldNotProse | rule hits; max(0, 100 − 20·hits) | validation-note family needs ≥2 anchors | no | chapter | SHIP-CHECK; rubric cap |
| 11 | prose-guard/src/fidelity.ts:42/:186 | checkContractFidelity; pronounConsistencyValidator | 100 − 25·hard − 5·soft; 100 − 10·wrong pronouns | name within 60 chars of a guilt word | no | chapter | none live |
| 12 | fidelity.ts:155; dual-value.ts:40 | detectTemplateLeakage; detectDualValueNoContrast | regex hits; both values close with no contrast word | window 240 chars | no | book | rubric caps |
| 13 | prose-guard/src/mutate.ts:22 | mutateThenValidate | undo an edit if score falls or a violation appears | any drop | no | chapter | **gate**: editor edits |
| 14 | prose-guard/src/backstop.ts:64 | generateWithBackstop | best score across attempts | strict > | no | draft | none live |
| 15 | prose-engine/src/selector.ts:140/:167 | measureInstruments; emDashPer1k | register, repetition, speech-open share, long-sentence share, wit; em-dashes per 1k | long = >30 words | no | draft | row 18 |
| 16 | selector.ts:199 | checkHardGates | clue present if hits ≥ max(2, ⌈0.5k⌉); clue early if k ≥ 4 and hits ≥ max(4, ⌈0.9k⌉); book short; culprit named early; reveal names nobody | as stated | no | chapter/book | ranking; editor |
| 17 | selector.ts:403 | chooseDraft | fewest ranking failures, then highest composite | `RANKING_KINDS` | no | 3 drafts (1–5) | **picks the shipped draft** |
| 18 | selector.ts:333 | scoreDraft | Σ w·(x − μ)/σ on fixed `CALIBRATION` (n = 49) | weights −3, −1, +1.5, +1, +0.5, +1; register floor 0.058; design bar \|ρ\| ≥ 0.55 | no | draft | row 17 |
| 19 | prose-engine/src/findings.ts:213 | collectCheckerFindings | register sentences ≥3, top 8 per chapter; copied sentences ≥8 words; repeated passages from row 3 | — | no | chapter/book | editor prompt. **The repeated-passage branch cannot fire** |
| 20 | findings.ts:160 | anchorFindings | drop findings whose quote is <8 words or not verbatim | 8 | no | finding | filter |
| 21 | prose-engine/src/edits.ts:113/:151 | measureGuards; buildGuards | sum of guards incl. registerNotWorse = −round(1000·rate) | any drop undoes the edit; length tolerance 0.15 | no | chapter | **gate** |
| 22 | prose-engine/src/recaps.ts:46; instruction-echo.ts:204 | findRecaps; findCatchphrases | sentence restates ≥ max(3, ⌈0.6·terms⌉); quoted 2–6-word line ≥3 times | 0.6, 3, owner allowance 2 | no | chapter | editor |
| 23 | prose-engine/src/gate.ts:38 | applyGate | stop if no chapter at/after the reveal names the culprit, or a decisive clue has 0 hits before it | ≥3 key terms | no | book | **gate** |
| 24 | rubric-score/src/hard-caps.ts:15 | applyHardCaps | clamp(min(Σ capped marks, ceilings)) | leakage ≥1 → prose ≤4; ≥2 → overall ≤65; pronouns ≤69; victim alive ≤60; culprit = victim ≤55; … | no | book | shadow diagnostic |
| 25 | rubric-score/src/bands.ts:18; llm-judge.ts:78 | bandFor; parseJudgeResult | label; marks clamped 0–10 | 90/80/70/60/50/40 | no | book | report |
| 26 | rubric-score/src/facts.ts:139 | extractStoryFacts | facts for the caps | pronouns unstable at ≥2 events in ≥2 chapters | no | book | caps |
| 27 | rubric-score/src/structural-verifiers.ts:392/:413 | citationAppears; verifyCitations | substring or a run of 6 content words | needle ≥8 chars | no | flag | drops judge flags |
| 28 | structural-verifiers.ts:246/:288 | temporal-ordering contradiction; duplicate reveal | contradiction in the last 45% of chapters | gap in (0, 360) min | no | book | telemetry; flag OFF |
| 29 | rubric-score/src/calibration.ts:52/:91 | computeCalibrationDelta | internal − external; MAE; share in band | \|Δ\| < 10 | n only | corpus | **no consumer** |
| 30 | rubric-score/src/pairwise-judge.ts:252/:296 | foldOrientations; summarisePairs | pick counts only if both orientations agree; agreement; consistency | minGap 5; confidence collected, unused | n only | pairs | script |
| 31 | novelty/src/compare.ts:41/:81; worker/jobs/prior-run-fingerprints.ts:118 | severity; judgeNovelty; cellRepeatDepth | clone/variation/distinct by shared fields; repeat depth in last 20 | clone at ≥4 shared; depth ≥3 = REPEAT | no | skeleton | shadow |
| 32 | style-contract/src/usability.ts:36/:72 | checkArcCoverage; themeIsAClaim | arc beats by synonym; ≥3 tokens with a verb | 3 | no | text | none live |
| 33 | cml/src/case-logic/reader.ts:78 | walkReader | posterior over suspects; entropy in bits | ×4 implicate, ×1.5 withheld, ×0.05 cleared; H < 1 bit; leader ≥0.5; collapsed ≥0.9 | no (ratios assumed) | chapter | warning (flag OFF) |
| 34 | worker/jobs/novelty-dispersion.ts:250 | ledgerDispersion | normalised Shannon entropy per ledger field | window 20; vocabularies 6 and 14 | no | 20 runs | run log |
| 35 | novelty-dispersion.ts:133 | classifyMechanismFamilyFrom | weighted keyword vote | 1 / 0.6 / 0.25 | no | run | ledger labels |
| 36 | worker/jobs/agents/agent9-v2/ship-check.ts:17 | v2ShipCheckLines | repetition line + scaffold line | none of its own | no | book | warnings |
| 37 | story-validation/src/scoring/engine.ts:36 | phase composite | 0.4·validation + 0.3·quality + 0.2·completeness + 0.1·consistency | partial pass ≥60 | no | phase | row 38 |
| 38 | scoring/thresholds.ts:53 | passesThreshold | total ≥ bar and every component ≥ minimum | 85/80/75/70; 60/50/60/50 | no | phase | "recorded, not retried" |
| 39 | scoring/aggregator.ts:235 | overall score | mean of phases, capped 59 / 74, then min with prose | 59 / 74 | no | run | report |
| 40 | scripts/external-read-ledger.mjs:139, :303 | parseExternalRead; --best; --gaps | sum of 10; offset; best per category | sum only at exactly 10 marks | n only | 71+ reads | writes manifest |
| 41 | scripts/matched-pair-report.mjs:63 | delivery report | arm differences; voice conformance | delivered ≥0.80 | no | 2 books | report |
| 42 | scripts/judge-ab.mjs:300 | separation | mean gap against largest within-story range | separates if gap > noise | range | 2 × 3 | report |
| 43 | scripts/judge-pairwise.mjs:100, :253 | ordinal calibration | pairs bucketed by human gap | 40 pairs; pass ≥0.8 | n only | 35+ | report |
| 44 | scripts/calibration-measure.mjs:90… | registerOf; aggregate; sceneProfile | sentence-length quantiles; rates per 1000 | closed > 0.01 | no | canon vs ours | writes library/calibration |
| 45 | calibration-measure.mjs:205, :256 | lexicon frequency ratios | per-million canon / ours | period word ≥40 in canon and ratio ≥4 | no | corpora | lexicon.json |
| 46 | scripts/eval-calibrate.mjs:119 | calibration verdict | bias; sd; pairwise agreement | calibrated ≥0.85; sd ≤4; n ≥ 6 | sd and n | n = 9 | writes calibration.json |
| 47 | scripts/eval-rescore.mjs:210 | --variance | mean, sd, range of repeated scores | large at range ≥4 | sd | 1 × 5 | updates manifest |
| 48 | scripts/cross-book-templates.mjs:43 | cross-book templates | books containing each normalised sentence shape | 7–40 words; ≥4 books; reach ≥25% | no | all stories | report |
| 49 | scripts/distinctiveness-report.mjs:95 | reads by family | n, mean, min, max; same-day pairs | NOT SAFE at sum gap ≥4 | n only | 39+ | report |
| 50 | scripts/final-pair-repetition.mjs:64 | final-chapter overlap | share of last chapter's 5-word runs in the penultimate | ≥6 chapters | no | all books | report |
| 51 | scripts/check-ending-repetition.mjs:47 | roll-call check | suspects walked through in both final chapters | ≥2 shared | no | book | report |
| 52 | scripts/agent6-blind-reader-variance.mjs:92 | false-veto rate | vetoes / valid samples | N = 12 | n only | case × N | report |
| 53 | scripts/run-cost-audit.mjs:66 | cost | list price, cached at 0.5× | runs with ≥5 calls | no | 5 runs | report |
| 54 | scripts/voice-uniformity-guard.mjs:117 | between/within ratio | sd of book means / mean within-book sd | floor 0.25; last 15 books | no | 15 books | `--check` exits 1 |
| 55 | scripts/read-matched-pair.mjs:73 | paired t and MDE | per-chapter register difference; MDE = 2.8·sd/√n | t critical fixed at 2.26 | **yes** | ~10 chapter pairs | report |
| 56 | scripts/register-score-probe.mjs:139; prose-feature-sweep.mjs:77 | Spearman tests | ρ against the mark; 16 features × 2 outcomes | 1.96/√(n−1), uncorrected | approximate | ~40 books | report |
| 57 | scripts/selector-calibrate.mjs:111 | instrument calibration | tie-averaged Spearman per instrument; composite | ≥8000 words | n only | 49 books | emits CALIBRATION |
| 58 | scripts/obligation-load-vs-register.mjs:55; retries-vs-abstraction.mjs:99; upstream-register-vs-mark.mjs:103 | Spearman; Welch t | — | \|t\| > 2 | approximate | chapters/books | report |
| 59 | scripts/corpus-cells.mjs:188 | Chao1 | S + f1²/(2·f2), log-normal 95% interval | warns if f2 < 5 | **yes** | canon | cells map |
| 60 | scripts/anticopy-baseline.mjs:67; wit-calibration.mjs:91; derive-ledger-panels.mjs:171 | baselines, medians, panels | firing rate per n; medians | smallest n with 0 firing | no | 229 negatives | sets constants by hand |
| 61 | analysis/ANALYSIS_110/probes/stats-probe.mjs (uncommitted) | wilson; power; lower bound; sprt | Wilson interval; pairs for 80% power; 0.05^(1/n); Wald test | — | **yes** | runs | probe |
| 62 | ANALYSIS_110/probes/lexstats-probe.mjs, floor-probe.mjs (uncommitted) | compression; opener entropy; G² keyness | — | bigrams ≥5 | no | book vs canon | probe |
| 63 | ANALYSIS_110/probes/owner-read-probe.mjs, contract-lint.mjs (uncommitted) | MATTR; hapax; Gini; Wilson; Spearman | — | — | Wilson | book/corpus | probe |

**Answers.** (1) Read data: `eval/results/external-read/manifest.json`; no word-count or register field.
(2) No lexical-diversity measure in packages, apps or scripts — only in the A_110 probes. (3) No
keyness outside those probes; `calibration-measure.mjs:256` compares raw frequency ratios with no test.
(4) `judge-pairwise.mjs` fits no model. (5) WORTH A LOOK = per10k / 17.3 ≥ 3; gates nothing. (6) No
multiple-comparison correction anywhere; power in `read-matched-pair.mjs:100` and the A_110 probe; a
sequential rule only in the A_110 probe.

---

## Inventory 2 — DECIDE (64 rows)

`cml/` = `packages/cml/src`; `sv/` = `packages/story-validation/src`; `pe/` = `packages/prose-engine/src`;
`wk/` = `apps/worker/src/jobs`. The v1 prose validators in `sv/` are exported and unused. Run order of
the consuming stages: `wk/mystery-orchestrator.ts:481–578`.

| # | file:line | name | property decided | procedure | unreadable / missing → | consumer |
|---|---|---|---|---|---|---|
| **a. Time** | | | | | | |
| 1 | cml/timeline-deception.ts:117 | parseClockTime | string → 12-hour dial position | closed word list + 5 regex branches | `null` | everything temporal |
| 2 | timeline-deception.ts:312 | parseTimeWindow | free-text alibi → [start, end] | tries each separator | `null` | #3, #9 |
| 3 | timeline-deception.ts:421 | checkTimelineDeception | staged ∈ culprit window ∧ real ∉ window | point-in-interval, wrap-aware | either death time unparseable → `[]` (424); unreadable window → its own code | via #4 |
| 4 | timeline-deception.ts:626 | checkCaseTimelineDeception | #3 for the case's culprits | `alibi_span` overrides prose | no culprits → `[]`; unreadable dropped unless flag | `validateCml` → retry; **aborts** on the degrade path; Agent 7.5 |
| 5 | timeline-deception.ts:874 | checkCaseTimeCoherence | device duration = gap between its clocks | dial arithmetic | only on exactly 2 clocks + 1 duration | 3b warning; flagged regen |
| 6 | timeline-deception.ts:717 | parseDurationMinutes | string → minutes | regex + number words | `null` | #5, #9, #12 |
| 7 | cml/temporal-spine.ts:371 | buildTemporalSpine | declared `derivedFrom` arithmetic closes | tries every am/pm reading | status `unreadable` | #8 |
| 8 | cml/declared-derivations.ts:55 | checkDeclaredDerivations | #7 as violations | filter | `unreadable` is never a violation | 3b warning + regen (flag) |
| 9 | cml/temporal-closure.ts:133 | checkTemporalClosure | gap(staged, real) ≤ opportunity window | numeric; **three-valued** | `not-determinable` | warning |
| 10 | cml/chronology.ts:133/:433 | solveLockedChronology; checkChronologyCoherence | anchored durations solved; window length matches endpoints | fixed-point propagation | unanchored → `unplaced`; no length → skipped | prompt block; validation error (flags) |
| 11 | chronology.ts:403 | findUnanchoredClockValues | every clock value matches an event | regex + parser | unparseable phrases invisible | report |
| 12 | wk/agents/agent3b/locked-fact-registry.ts:280 | reconcileDeviceArithmetic | derived duration equals its clocks' gap | arithmetic + rewrite | unparseable → `continue` | **repairs** |
| 13 | locked-fact-registry.ts:158 | reportCaseTemporalCoherence | false/true gap equals declared shift | id regex + arithmetic | <2 facts → silent | report |
| 14 | wk/agents/agent3b/device-direction.ts:41 | reconcileDeviceDirection | "forward/back" matches shown vs true time | signed dial difference | pair not found → return | **repairs** (flag) |
| 15 | wk/agents/agent3-run.ts:64 | checkLockedFactTimeAlignment | staged time equals the locked displayed clock | id regex + equality | **distinguishes** stated-but-unparseable | warning |
| 16 | wk/clue-contracts/clue-time.ts:326 | findLockedFactClueTimeConflicts | a clue's time agrees with its locked fact | equality | unparseable → skipped; am/pm branch `false` unless flag | repair, then **aborts** Agent 5 |
| 17 | cml/alibi-plan.ts:282 (:154) | renderPlannedCulpritAlibi | culprit window contains staged, excludes real | constructive interval arithmetic | death times unparseable → `[]` | **repairs** the CML (flag) |
| 18 | cml/alibi-span.ts:190 | repairActualCovered | trim a culprit window covering the real time | interval trim | not its shape → `null` | **repairs** (flag) |
| 19 | cml/case-logic/timeline.ts:102 | analyseTimeline | true statements consistent; act window; innocents' coverage | regex classification → STN; 4-valued coverage | `unknown`; a missing dial becomes 0 | report (flag OFF) |
| 20 | cml/case-logic/stn.ts:32 | solveStn | simple temporal network consistency | Floyd–Warshall | open bounds ±∞ | #19 |
| 21 | cml-core/src/engines/timeline.ts:12 | checkTimeline | nobody in two places at once | interval overlap | typed input only | not wired |
| 22 | sv/timeline-validator.ts:86 | validateTimeline | prose time goes backwards >60 min | digit regex + 4 words | spelled times ignored | **unused** |
| 23 | story-geometry/src/accept.ts:790 | checkManuscriptGeometry (time) | no unaccounted clock time | parser set membership | `time_anchors_absent` = **met** when <2 anchors parse | scripts |
| **b. Uniqueness** | | | | | | |
| 24 | cml-core/src/engines/uniqueness.ts:16 | checkUniqueness | exactly one suspect not eliminable, and it is the culprit | enumerates every suspect | typed input only | not wired |
| 25 | cml-core/src/engines/deducibility.ts:16 | checkDeducibility | each elimination justified; no clue used before available | set + interval | missing premise → issue | not wired |
| 26 | cml/case-logic/proof.ts:61 | analyseProof | culprit proven; innocents cleared; culprit never cleared | Dung grounded extension | clue class falls back to `points` | report (flag OFF) |
| 27 | cml/case-logic/model.ts:137 | readInference | which suspects a clue clears or implicates | clause split + regex | names nobody → `neutral` | #19, #26, #31 |
| 28 | cml/validator.ts:342 | validateCulpritIntegrity | culprit ∈ cast, not victim/detective | set membership | empty culprits → error | validateCml |
| 29 | wk/agents/agent3/cml-acceptance.ts:334 | checkVictimCulpritCollision | culprit ≠ victim | exact role string | other spellings → no collision | retry, then **abort** |
| 30 | sv/genre-validator.ts:36 | validateGenreStructure | false solution ≠ culprit; ≥2 herrings | name match | empty circle → warning | Agent 6 warnings |
| 31 | cml/case-logic/reader.ts:75 | walkReader | reader posterior per chapter | fixed odds ratios | — | report (flag OFF) |
| 32 | wk/clue-contracts/suspect-coverage.ts:181 | analyzeSuspectCoverage | each non-culprit named in a clearing clue | name token + regex | warnings | Agent 5 retry prompt |
| 33 | wk/agents/agent6/retry-contract.ts:183 | runDeterministicStructuralAudit | every step has an essential early/mid clue | set + regex | gaps advisory | Agent 6 escalation |
| 34 | wk/clue-contracts/contracts.ts:960 | findCulpritDiscriminatingGaps | a clue names the culprit with exclusivity | regex (`only`, `uniquely`) | no culprits → `[]` | synthesises a clue, then **aborts** |
| 35 | wk/agents/agent6-run.ts:502 | blind-reader pass | an LLM reader names the culprit | **LLM** + name match | refusal = not measured | advisory unless flag |
| 36 | wk/agents/agent6-reveal-gate.ts:60/:130 | auditRedHerringTargets; auditDeathMethodDeducibility | no herring points at the culprit; manner of death in an early clue | name match; token regex | no tokens → `ok:true` | flag |
| 37 | sv/suspect-closure-validator.ts:93 | SuspectClosureValidator | each suspect cleared in prose | regex, then LLM | no cml → valid | **unused** |
| 38 | sv/suspect-clearance-gate.ts:79 | chooseClearanceKeeper | which scene owns the clearance | max index ≤ reveal | reveal −1 → last scene | **writes** outline stamp |
| **c. Clue logic** | | | | | | |
| 39 | wk/clue-contracts/inference-checks.ts:54 | checkInferencePathCoverage | every step has an observation clue | declared step + 40% word overlap | no steps → critical | **aborts** pre-prose |
| 40 | inference-checks.ts:32/:136/:162 | step bounds; contradiction pairs | index in range; ≥2 clues | numeric / set | stepCount 0 → `[]` | step bounds **aborts** |
| 41 | inference-checks.ts:220 | checkDiscriminatingTestReachability | test evidence exists, early/mid | id lookup, else 20% overlap | non-canonical ids dropped | non-fatal |
| 42 | wk/clue-contracts/red-herrings.ts:35 | findRedHerringOverlapDetails | a herring does not support the truth | weighted n-gram overlap ≥4 | no steps → `[]` | warning |
| 43 | wk/agents/clue-guardrails.ts:42 | applyClueGuardrails | ≥ minimum essentials; no late essentials | counts | minimum defaults to 3 | **repairs**; retry |
| 44 | wk/pipeline/gates.ts:27 | hasDeterministicPreTestTraceabilityBreak | evidence clues mapped before the test | (act, scene) order | no clues → `false` | corroborates #45 |
| 45 | gates.ts:88/:146/:241 | early structural abort; pre-prose gate | Agent 6 critical findings are structural | LLM rules ∩ deterministic corroboration | uncorroborated downgraded | **aborts** |
| 46 | cml/discriminating-planting.ts:38 | findUnplantedDiscriminatingClues | test evidence mapped before the test scene | act×100 + scene | no test scene → only unmapped flagged | warning |
| 47 | pe/contract.ts:240 | decisiveClueIds | which clues are decisive | id regex, else `fair_play.inference_path`, else last 3 essentials | branch 2 reads a non-schema path (inferred) | release gate |
| 48 | pe/selector.ts:199 | checkHardGates | clue on its owner chapter; nothing early | stemmed key-term thresholds | <4 terms → skipped | selection; editor |
| 49 | pe/gate.ts:38 | applyGate | **release gate** | regex + ≥1 hit | <3 terms → `continue`; no culprits → no stop | `ship=false` |
| 50 | pe/recaps.ts:46 | findRecaps | a clue restated after its owner chapter | containment ≥60% | unparsed times invisible | editor |
| 51 | story-geometry/src/closure.ts:23 | checkGeometryClosure | two time anchors; clincher planted before payoff | weighted score | presence of a string, not a parse | outline **repair** |
| 52 | clue-spec/src/derive.ts:74 | deriveClueSpec | slots the clue set must fill | structural | no source → no slot | shadow log |
| **d. Ordering** | | | | | | |
| 53 | beat-scheduler/src/invariants.ts:79/:156/:34 | checkOrdered; checkPlantBeforeReveal | essential clue before test; test before reveal; **no clearance after reveal** (:109); plant ≥2 slots early | slot precedence | — | throws in `buildSceneGrid`; worker shadow |
| 54 | wk/agents/agent7/stamps.ts:90/:230 | applyPlantBeforeReveal | essential clue planted ≥2 scenes early | index arithmetic | no essentials → return | **writes** stamps |
| 55 | sv/narrative-continuity-validator.ts:75 | case-transition bridge | body found before murder talk | regex | — | **unused** |
| 56 | sv/character-lifecycle-validator.ts:320 | validateCharacterLifecycle | victim not alive after death; culprit not cleared | per-sentence regex ledger | — | **unused** |
| 57 | prose-guard/src/fidelity.ts:42; dual-value.ts:40 | contract fidelity; dual-value contrast | no clue or culprit leaked early | substring + window | no key terms → clue id | rubric caps |
| **e. Identity** | | | | | | |
| 58 | pe/edits.ts:151 | buildGuards | an edit preserves locked values, clocks, names | substring counts | — | **reverts** the edit |
| 59 | sv/prose-consistency-validator.ts:180 | detectAttributionFlips | pronoun matches referent | regex scan-back | ambiguous → skipped | rubric copy |
| 60 | wk/mystery-orchestrator.ts:561 | locked-fact outline gate | every locked value verbatim in the outline | substring | — | warning |
| **f. Combination** | | | | | | |
| 61 | wk/agents/agent3-run.ts:178 | degrade path | proceed on Agent 4 budget exhaustion | OR over error strings | timeline codes → **abort** | continue / abort |
| 62 | wk/pipeline/gates.ts:190/:207 | novelty / fair-play binding gates | block when binding ∧ blocking | AND | — | **abort** |
| 63 | sv/scoring/run-outcome.ts:12 | deriveRunOutcome | run status | precedence ladder | no gate evidence → phase thresholds | report |
| 64 | cml-core/src/certify.ts:17 | certify | fair-play certificate | AND of timeline, deducibility, uniqueness | — | not wired |

**The twenty checks where unreadable counts as pass.** `checkTimelineDeception` (424, 645, 690);
`checkCaseTimeCoherence` (899, 930); `findLockedFactClueTimeConflicts` (233, 244, 192); `validateNode`
(`validator.ts:92`) — never enforces `min_items` and never checks undeclared fields (death times,
`alibi_span`, `evidence_clues`); `validateInferencePathQuality` (139); `checkDeclaredDerivations`
(121–145); `reconcileDeviceArithmetic` (343–373); `accept.ts` `time_anchors_absent` (1017);
`findUnanchoredClockValues` (273); `analyseTimeline` (121, 162); `applyGate` (76, 106);
`checkHardGates` (257); `auditDeathMethodDeducibility` (136); `findUnplantedDiscriminatingClues` (67);
`hasDeterministicPreTestTraceabilityBreak` (33, 139); `checkInferenceStepBounds` (38, 42);
`checkModelAuditConsistency` (`contracts.ts:901`); `SuspectClosureValidator` (94);
`checkGeometryClosure` (`closure.ts:77`); a missing coverage or novelty signal on resumed runs
(`mystery-orchestrator.ts:462`).

**Other answers.** A clock is minutes on a 12-hour dial, 0–719; `parseClockTime` returns `null` for
both "no time" and "could not read". The schema holds `alibi_window` as a string; `alibi_span` and the
two times of death are not schema paths. `essential` is an LLM label, forced on in several places and
**never verified by removal**. Reader knowledge is represented (`mustSurface`, `mustNotReveal`,
`availableByStep`); **per-character knowledge is not**. No check that a mechanism's key actor is in
the cast.

---

## Inventory 3 — ALLOCATE (58 rows)

| # | cat | file:line | name | what it does | constants | test | consumer |
|---|---|---|---|---|---|---|---|
| 1 | apportion | beat-scheduler/src/schedule.ts:38 | actCounts | round(n·r) for acts 1 and 2, act 3 the rest | 0.28, 0.47 | yes | shadow grid |
| 2 | apportion | prompts-llm/src/agent7-act-counts.ts:11 | computeActSceneCounts | same; no guard that act 3 ≥ 1 | yaml | yes | prompt |
| 3 | apportion | story-validation/src/story-length-targets.ts:177 | distributeChapterWordBudget | per-chapter budget by position, rounded to 50, clamped. **Totals not preserved** | 0.9 / 1.0 / 1.18 / 1.0; ceiling 1.6×; floor 0.45× | yes | flag OFF |
| 4 | budget | prose-engine/src/segments.ts:70 | planSegments | packs chapters into writer calls | 1.45 tokens/word; cap 0.8·max output | yes | call plan |
| 5 | budget | prose-engine/src/bible.ts:104/:387 | toBudget; buildBible | keeps lines until one would overflow; drops sections in fixed order | case 1800, cast 2400, world 1800, chronology 600, clues 900, relationships 600 | yes | every prose call |
| 6 | budget | prose-engine/src/brief.ts:33 | BRIEF_BUDGET | reported only; paragraphs = max(6, round(words/85)) | 1500; 85 | yes | prompt |
| 7 | apportion | worker/jobs/novelty-ledger.ts:359 | mergeWithReserve | prompt slots with a floor for seeds | cap 20 / reserve 6; cap 12 / reserve 3 | yes | Agent 3 prompt |
| 8 | apportion | worker/jobs/agents/novelty-constraints.ts:51 | buildNoveltyConstraints | same-axis first, keep first N | 12 | no | prompt |
| 9 | apportion | prose-engine/src/contract.ts:192 | distributeClearances | round-robin over clearance chapters | — | indirect | prompt; reader model |
| 10 | apportion | prose-engine/src/depth.ts:38 | assignTexture | even spacing; first-fit | — | indirect | prompt |
| 11 | apportion | prompts-llm/src/prose-contract/clue-obligations.ts:475 | measureClueObligationLoad | clue demands per chapter | budget 8 | yes | report |
| 12 | schedule | beat-scheduler/src/schedule.ts:73 | buildSceneGrid | greedy layout; self-check throws | target ⌈0.6N⌉ clue-bearing; no run >2 | yes | shadow; outline only with flag |
| 13 | schedule | beat-scheduler/src/invariants.ts:79 | checkOrdered etc. | verifies ordering rules | ≥0.6; plant ≥2 early | yes | throws in #12 |
| 14 | schedule | worker/jobs/agents/agent7/clue-pacing.ts:57 | applyDeterministicCluePreAssignment | four greedy passes | coverage 0.6; act floors 0.25 / 0.45 | yes | outline |
| 15 | schedule | clue-pacing.ts:450; agent7/scheduler.ts:188 | forceAssignUncoveredClues etc. | least-loaded scene in its act | — | yes | repair |
| 16 | schedule | agent7/stamps.ts:90 | applyPlantBeforeReveal | plant in the least-planted scene ≥2 earlier | 2 | yes | outline |
| 17 | schedule | prose-contract/clue-obligations.ts:378 | resolveClueOwnership | owner = first scene requiring the clue | — | yes | prompt |
| 18 | schedule | prose-engine/src/roles.ts:124 | assignChapterRoles | rule cascade by precedence | — | yes | prompt + gate |
| 19 | schedule | prose-contract/beats.ts:25; humour-level.ts:109; contract.ts:145 | selectWitBeat etc. | `pool[(chapter − 1) mod size]` | beatEvery 0 / 3 / 1 / 1 | yes | prompt |
| 20 | schedule | story-geometry/src/derive.ts:301 | deriveClincher etc. | clincher planted by clamp(reveal − 1, 1, 3) | 1, 3, 2 | yes | prompt |
| 21 | schedule | story-validation/src/suspect-clearance-gate.ts:79 | chooseClearanceKeeper | last clearance scene ≤ reveal | — | yes | outline |
| 22 | select / design | worker/jobs/cell-scheduler.ts:247 | scheduleCell | least-recently-used walk over axis × family; must change ≥2 coordinates | last 20 runs; 70 cells | yes | **shadow** |
| 23 | select | device-library/src/retrieve.ts:24 | retrievePatterns | filter, sort by 1/(1 + uses), top 4 | 4 | yes | prompt |
| 24 | select | prompts-llm/src/utils/seed-loader.ts:285 | selectRelevantPatterns | **default: first 3 alphabetical**; with flag, weighted | 3; 10 / 1 / 0.5 | yes | Agent 3 prompt |
| 25 | select | prompts-llm/src/agent3b-hard-logic-devices.ts:259 | selectThemeCoherentPrimary | most theme families; tie → quality | unit weights | yes | first device |
| 26 | select | story-geometry/src/derive.ts:223 | selectClincherClue | weighted argmax | +32, +8, +4, +3, +1, −6 | yes | prompt |
| 27 | select | worker/jobs/clue-contracts/evidence-candidates.ts:33 | scoreEvidenceCandidate | shared words + trait weights | {2, 1, 1}; {0, 2, 1} | yes | CML evidence |
| 28 | select | worker/jobs/agents/agent5/evidence-remediation.ts:64 | remap missing evidence ids | 4/3/2/1 + 3 per word; accept ≥7 | — | yes | CML evidence |
| 29 | select | prose-engine/src/selector.ts:333/:403 | scoreDraft; chooseDraft | Σ weight · z | −3, −1, +1.5, +1, +0.5, +1 | yes | **shipped draft** |
| 30 | select | prose-engine/src/contract.ts:240 | decisiveClueIds | three-branch fallback | last 3 | indirect | gate |
| 31 | select | covers/src/select.ts:24 | scoreCard; chooseFraming | weighted random | 2 / 2 / 1; blend 0.35 | yes | cover |
| 32 | random | prompts-llm/src/utils/name-generator.ts:23 | LCG; generateCastNames | power-of-two LCG from hash(runId) | a = 1664525, c = 1013904223 | yes | names when none supplied |
| 33 | select | scripts/corpus-cells.mjs:136 | morph ranking | "remoteness" = sum of marginal counts | unit | no | cells.json |
| 34 | select | scripts/corpus-survey.mjs:185 | genreScore | additive keyword score | +4, +2, +1, +1, +1 | no | candidates.json |
| 35 | similarity | prompts-llm/src/agent8-novelty.ts:416 | auditNovelty | LLM scores 5 dimensions per seed; code recomputes the weighted sum, takes the max | 0.30 / 0.25 / 0.15 / 0.25 / 0.05; T = 0.9 | yes | **binding gate** in seeded runs |
| 36 | similarity | novelty/src/compare.ts:37 | judgeNovelty | exact matches over 5 fields; **empty = empty matches** | clone ≥4 | yes | shadow |
| 37 | similarity | novelty/src/loader.ts:102 | loadReferenceCorpus | dedupe by 5-field key | last 20 | yes | shadow |
| 38 | similarity | prose-guard/src/anti-copy.ts:115 | fingerprint; findCopiedSpans | exact 11-grams, 53-bit hash, binary search | n = 11 | yes | **none in HEAD** |
| 39 | similarity | prompts-llm/src/agent2c-location-distinctness.ts:52 | jaccard | sensory-detail sets, all pairs | >0.5; ∅,∅ → 0 | yes | gate OFF |
| 40 | similarity | prompts-llm/src/agent2b-voice-capsule.ts:219 | trigramOverlap | character 3-grams | ≥0.7; ∅,∅ → **1** | yes | gate OFF |
| 41 | similarity | worker/jobs/clue-contracts/red-herrings.ts:35 | red-herring overlap | weighted containment | 1 / 2 / 3; flag ≥4 | yes | repair |
| 42 | similarity | prose-engine/src/recaps.ts:46; instruction-echo.ts:148 | recaps; instruction echoes | stemmed containment | 0.6; 0.7; length 3 | yes | editor |
| 43 | similarity | prose-guard repetition-density.ts:57; machine-register.ts:281 | — | see inventory 1 | — | yes | selector |
| 44 | budget | git `fd058f16^` agent9-prose/prompt-builder.ts:1458 | applyPromptBudgeting (**deleted 2026-10-01**) | cap each block, drop by tier; no value measure | ceiling 24000 | — | — |
| 45 | random | scripts/run-params.mjs:51, :255 | mulberry32; pick; pickN | **one stream for every field**; `arg() ?? pick()` | fresh-names 5 | self-test | run-params files |
| 46 | random | covers/src/framings.ts:14 | makeRng; weightedPick; shuffle | mulberry32; Fisher–Yates | — | yes | cover |
| 47 | random | prompts-llm/src/shared/temporal-anchor.ts:88 | generateSpecificDate | hash; **`Math.random` if no runId** | — | yes | Agent 2d |
| 48 | random | llm-client/src/retry.ts:55; web storyAngles.ts:207 | jitter; randomAngle | unseeded | — | yes | timing / UI |
| 49 | estimator | scripts/corpus-cells.mjs:188 | Chao1 + interval + extrapolation | — | warns f2 < 5 | no | cells.json |
| 50 | estimator | worker/jobs/novelty-dispersion.ts:205 | normalised Shannon entropy | H / ln V | V = 6, 14 (schema now has 16) | yes | report |
| 51 | estimator | novelty-dispersion.ts:133 | classifyMechanismFamilyFrom | weighted keyword vote | 1, 1, 1, 1, 0.6, 0.25 | yes | feeds #22, #37 |
| 52 | graph | cml/src/case-logic/reader.ts:75 | walkReader | the elimination schedule | ×4, ×1.5, ×0.05 | yes | report (flag OFF) |
| 53 | estimator | scripts/corpus-coverage.mjs:34; anticopy-baseline.mjs:61 | gap table; false-positive sweep | — | targets 8/8/8/6/6 | no | report |
| 54 | graph | cml/src/case-logic/proof.ts:42 | groundedExtension | Dung fixpoint | — | yes | report (flag OFF) |
| 55 | graph | cml/src/case-logic/stn.ts:32 | solveStn | Floyd–Warshall | O(n³) | yes | report (flag OFF) |
| 56 | graph | cml-core/src/util.ts:27; engines/* | unionCovers; checkUniqueness; proveSolvability | interval-union sweep; survivor set | — | yes | scripts only |
| 57 | graph | worker/jobs/agents/agent2-run.ts:151 | relationship top-up | rings uncovered characters into pairs | — | yes | cast |
| 58 | design | scripts/axis-sweep.mjs:60; schedule-run.mjs:82 | one-factor-at-a-time; scheduled cell | only the axis varies | 5 axes | no | run configs |

**Answers.** (1) HEAD has no prose token ceiling; the deleted rule was a fixed tier list walked
greedily, with no measure of a block's value. (2) The novelty audit is an LLM-scored weighted sum with a
hand-set threshold; self-rows are dropped after the fact, with a fallback to the unfiltered list if all
rows drop (`agent8-novelty.ts:481`). (3) Clues are placed by Agent 3's map, Agent 5's tags and four
greedy repair passes; **no live check orders clues by inference step**. (4) "Who remains possible after
chapter k" = `walkReader`, report-only. (5) Run parameters are independent draws from one stream; a pin
shifts every later field; the only cross-run balancing is name exclusion. (6) Thirteen hand-set
weighted sums pick a winner: rows 35, 29, 51, 26, 27, 28, 24 (ranked), 31, 25, 41, 32, 34, 33.

**Searches that found nothing, with their positive controls.** Apportionment (`webster|hamilton|
bresenham|largest.?remainder|apportion`) — only a surname in a name pool. Embeddings, edit distance,
MinHash — only comments saying they are not used; the same search finds Jaccard. Topological sort —
none; `reachableFrom` found in cml-core. SAT/CSP/ASP libraries — none; "Floyd" found at `stn.ts:6`.
Multiple-comparison correction (`bonferroni|holm|benjamini|fdr`) — only "Holmes"; `welch` found.

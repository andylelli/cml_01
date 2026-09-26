# 12 — Agent quality layer: phase scorers and scoring adapters

**Scope:** 38 files — 27 in `packages/story-validation/src/scoring/` (incl. `phase-scorers/`), 11 in `apps/worker/src/jobs/scoring-adapters/` · 9,717 lines, 7,165 code lines · **Read:** every line · **Written:** 2026-09-25
**Finding prefix:** SCO · **Method:** [RUBRIC.md](../RUBRIC.md)

## 1. What this area does

```
agentN-run.ts (worker)                                    packages/story-validation/src/scoring
  executeAgentWithRetry(agentId, phase, run, scoreOutput)  ─┐
    scoreOutput = adapter(realArtifact)                     │  vanity family: agentN-*-scorer.ts (10 classes)
                → XxxScorer.score(input, adapted, ctx)      │  honest family: agentN-*-real-scorer.ts (7 fns)
                → applyHonestScorer(vanity, () => real…)    │    + honest-scorer.ts (assembleHonestScore)
    ScoreAggregator.upsertPhaseScore(agentId, score)  ──────┤  aggregator.ts, thresholds.ts
    passesThreshold → retry? (RetryManager + buildRetryFeedback, only if AGENT_PRE9_ENABLE_LLM_RETRIES)
  agents 3/5/6/8: PhaseScore built inline in the run file   │
  agent 9: adaptProseForScoring + ProseScorer at 6 sites    │
orchestrator: savePartialReport / generateReport ──────────►│ report-invariants.ts ► FileReportRepository.save
```

- **Data in:** each agent's real artifact (camelCase, `@cml/prompts-llm` types). Adapters (worker) reshape it into the snake_case
  shapes the vanity scorers were written against; honest scorers read local "structural mirror" types of the real artifact.
- **Data out:** `PhaseScore` (4 categories, weighted total, grade, tests) → `PhaseReport` → `GenerationReport` (overall score,
  headline cap, run outcome from the release-gate diagnostic per ADR-0006, diagnostics, retry stats).
- **Gating:** everything is behind `ENABLE_SCORING` (default off) — including the report repository itself
  (`mystery-orchestrator.ts:882-905`), so the ADR-0010 durable record exists only when "scoring" is on.
- **Why adapters exist:** `@cml/prompts-llm` depends on `@cml/story-validation`, so scorers cannot import artifact types; the
  worker (depends on both) maps between them. The honest family shows the alternative (mirror types, no adapter).
- `agent9-scoring-adapter.ts` is not an adapter: it hosts `collectClueEvidenceFromProse`, the matcher the **release-gate NSD hard
  stop** uses (`agent9-run.ts:4681, 5251, 7085, 7147, 7156`), plus discriminating-test detection, fair-play timing and trust caps.

## 2. Verdict

The scoring layer's complexity is not algorithmic; it is one ~60-line scoring skeleton hand-copied eleven times (plus four inline
variants in agent run files), two scorer families grading two different shapes of the same artifacts, and a set of concepts each
implemented twice or more. jscpd puts **1,990 of the area's 9,717 lines (20.5%) in clones versus 3.62% repo-wide**, and
66 of the repo's 218 clones touch this area. The default (vanity) family grades adapter-fabricated data: on the four committed golden
bundles every one of 36 phase×bundle cells grades **A** (27 are 100/A), while the honest family is the only one that found a
defect (Agent 7 scene bloat, 70/C on all four). The defect class is live: phase identity has three vocabularies and three threshold
resolvers (HONEST_SCORERS=enforce silently drops Agent 3b's bar from 85 to 75 while the report shows 85), run outcome has five
writers, and the fair-play score has a drifted copy (85 vs 100 on the same input). **Single most valuable change:** one scoring
engine + one phase registry, proven byte-equal by a golden-bundle characterisation harness (all R0/R1), followed by an owner
decision to retire the vanity family, which would roughly halve the area.

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| SCO-01 | P1 | C, D | Two live scorer families; vanity family measures adapter fabrication — owner decision to retire it | R2 | M | −3,400 (if retired) |
| SCO-02 | P1 | C, B | One scoring engine: 40/30/20/10 skeleton copied 11×, grade ladder 16×, failure-reason 10× | R1 | M | −750 |
| SCO-03 | P2 | C, J | Declarative per-agent check tables over the engine; 129 hand-written pass/partial ternaries | R1 | L (3 d) | −450 |
| SCO-04 | P1 | C, E | Phase identity: 3 agent-ID vocabularies, 3 threshold resolvers, scorer-local pass rules ignored | R1 | S–M | −40 |
| SCO-05 | P1 | A, B | `generateReport` (324 LOC, cc 59) and five writers of run outcome | R1 | M | −120 (−180 incl. worker/API) |
| SCO-06 | P1 | A | Release-gate clue matcher lives in a "scoring adapter"; prose scored at 6 hand-assembled sites | R0/R1 | S | −45 |
| SCO-07 | P2 | C | Prose-stage semantic duplicates: expected clue set ×3, fair-play weights ×2 (drifted), DT scene ×2, trust caps ×2 | R1/R2 | M | −60 |
| SCO-08 | P2 | F | Two bodies of retry policy; same export name `buildRetryFeedback` in two packages; phase-score abort vs ADR-0006 | R0/R2 | S | −70 |
| SCO-09 | P2 | C, E | Adapter⇄scorer duplicate interfaces (9 types), 29 `any`/30 casts in one adapter, dead `adapted` field | R0 | S | −110 |
| SCO-10 | P2 | E, D | `ScoringContext` contract lies: `cml: undefined as any` at 6 sites makes CML checks dead; `threshold_config` never read | R1 | S | −170 |
| SCO-11 | P2 | D | Dead code: 10 scorer-utils fns, 5 aggregator methods, A/B harness, retry helpers, unused imports/locals | R0 | S | −470 |
| SCO-12 | P1 | J | Safety net: 6 scorers at 0% coverage; "fixed-seed benchmark" never runs a scorer; golden bundles unused | R0 | S | +150 |
| SCO-13 | P3 | H | Clue-evidence matcher ~208 ms/call, O(N²) per-batch series ~2.8 s; `existsSync` per (clue, paragraph) | R1 | S | 0 |

### SCO-01 — Two live scorer families; the default one measures adapter fabrication
- **P1 · lens C, D · R2 · M** (decision + deletion; the refactors below do not depend on it)
- **Evidence (MEASURED + INFERRED):**
  - "Vanity" = the original class scorers (`agent1-setting-refinement`, `agent2-cast`, `agent2b`, `agent2c-location-profiles`,
    `agent2d`, `agent2e-background`, `agent4-hard-logic`, `agent65`, `agent7-narrative`, `agent9-prose`) fed by worker adapters;
    live whenever `ENABLE_SCORING=true`. "Honest"/"real" (ANALYSIS_50 P3, `honest-scorer.ts:1-9`) = seven function scorers that
    grade the real artifact; live but flag-gated by `HONEST_SCORERS` off/shadow/enforce (default off) through
    `applyHonestScorer` (`apps/worker/src/jobs/agents/shared.ts:673-695`), called from agent1/2/2c/2e/3/3b/7 run files. **Neither
    family is vestigial** (grep repo-wide); ANALYSIS_56 §2-D already calls the vanity adapter "legacy/deprecated".
  - Adapters are written to trip the scorer: `agent1-scoring-adapter.ts:23-28` ("Build a spatial layout paragraph that satisfies
    isPhysicallyPlausible()"), `:87` ("Synthesise clue_placements … so the +10 existence score fires"), and the real
    `location.description` is discarded (`base` unused at `:30`, tsc TS6133). `agent2b-scoring-adapter.ts:47,62-63` (concatenate
    paragraphs to reach ≥80 words; expand humour enum because "scorer checks … length > 20"). `agent2c-scoring-adapter.ts:39-46`
    (synthesise a taste sentence "to pass the scorer's exists() check"), `:48-49` (geo string built to match `/\w+,\s+\w+/`).
    `agent2d-scoring-adapter.ts:45` (injects "The crime unfolds during the evening hours"). `agent2e-scoring-adapter.ts:33-66`
    scores Agent 1's fields under Agent 2e's name. `agent7-scoring-adapter.ts:129-157` pads clue IDs into chapters "to reach
    >=50% chapters with clues". The worker tests pin this behaviour (`scoring-adapters-character-profiles.test.ts:78-109`).
  - Golden-bundle characterisation (`eval/golden/bundle-*.json`, 4 bundles, wired exactly as the run files wire them): vanity =
    **A in 36/36 cells, 100/A in 27/36** (min 91). Honest = 100/A in 17/28; it found Agent 7 planning 1,800–2,600-word scenes for a
    `short` target (70/C ×4, vanity 100/A) and a thin Agent 3b device (87/B, vanity 100/A). Removing the Agent 7 clue padding does
    not change vanity scores on these four bundles (padding is inert here, not proven inert in general).
  - A_50's own probe (2026-06-26) logged enforce de-inflating agent2-cast 88→79 and agent3b 100→87.
- **Proposal:** owner decides per ADR-0004/0011: run `HONEST_SCORERS=shadow` over a batch (it logs vanity↔honest deltas to
  `run_warnings`), then promote `enforce` as default. ADR-0006 makes this low-risk: phase scores gate nothing, and with pre-Agent-9
  retries off, enforce changes only the recorded grade. Then delete the six vanity scorers that have an honest replacement
  (2,814 lines) and their six adapters (588 lines). Agent 7 needs care: `NarrativeScorer` is also the rescorer at
  `agent7-run.ts:1473` and carries the critical chapter-count test. Phases with no honest variant (2b, 2d, 6.5, 9) keep theirs.
  Fix SCO-04 first, so enforce does not change the thresholds.
- **Benefit:** −3,400 lines (~35% of the area); removes the adapter-fabrication defect class; retry feedback stops naming fields
  that the LLM never emitted.
- **Verification:** SCO-12 harness diffs before and after; shadow-batch deltas are the ADR-0011 evidence.
- **Relates to:** SCO-02, SCO-04, SCO-08, SCO-12.

### SCO-02 — One scoring engine
- **P1 · lens C, B · R1 · M**
- **Evidence (MEASURED):** `score()` bodies of 57–74 LOC in 11 scorers (647 lines total) repeat the same sequence: four category
  pushes, `calculateCategoryScore` ×4, 0.4/0.3/0.2/0.1 sum, critical failures, `passed = no critical && total >= 60`, floors
  60/50/60/50 hard-coded, return object (e.g. `agent1-setting-refinement-scorer.ts:40-96`, `agent2-cast-scorer.ts:64-121`).
  `honest-scorer.ts:29-66` (`assembleHonestScore`) is already this engine in 38 lines, used only by the honest family. The A–F
  ladder exists **16×**: canonical `thresholds.ts:110-116`, 11 private copies (e.g. `agent9-prose-scorer.ts:809-815`,
  `agent2-cast-real-scorer.ts:126-132`) and 4 inline ternaries (`agent3-run.ts:385,677`, `agent5-run.ts:4385`,
  `agent6-run.ts:1685`). `buildFailureReason` 10×. Top jscpd pairs are this skeleton: agent7⇄agent9 91 lines, agent2⇄agent4 80.
  Deliberate variants: agent65 uses 40/25/25/10, passes at 70, and treats an empty consistency category as 100
  (`agent65-world-builder-scorer.ts:75-95`); prose applies trust caps (`agent9-prose-scorer.ts:213`); inline agent3 uses 50/30/20/0 and
  agent5 uses 35/25/20/20.
- **Proposal:** `scoring/engine/engine.ts`: `assemblePhaseScore(agent, tests, policy = DEFAULT_POLICY)` where `ScoringPolicy =
  {weights, floors, passTotal, emptyCategory, postTotal?}` (the prose trust cap becomes `postTotal`). Move `calculateGrade` there. Each
  class scorer's `score()` becomes about 6 lines, and `score()` becomes synchronous (no scorer awaits anything). Worker inline scorers
  (agents 3/5/6/8, other areas) call the same function with their own policy.
- **Benefit:** ≈ −750 lines (score bodies −550, grade copies −90, failure reasons −145, engine +70); one pass rule and one floor table.
- **Verification:** SCO-12 byte-equality of every `PhaseScore` (tests order, message text, rounding) on golden bundles and prose
  fixtures. The nine verbatim copies are R0 in substance; agent65, prose and honest need policy parameters (R1).
- **Relates to:** SCO-03, SCO-04.

### SCO-03 — Declarative per-agent check tables
- **P2 · lens C, J · R1 · L (≈3 days)**
- **Evidence (MEASURED):** 129 `cond ? pass(…) : partial|fail(…)` ternaries across 16 scorers (e.g.
  `agent1-setting-refinement-scorer.ts:151-155`). The duplicate-names check is hand-rolled 5×, and `checkDuplicates` is used once.
  Of scorer-utils' 21 exports only `pass/fail/partial/exists/calculateCategoryScore/getCriticalFailures` carry real load;
  `validateSchema`/`scoreTextQuality` are imported and never called. Early-return guards (e.g. `agent2-cast-scorer.ts:130-157`)
  define which later checks exist.
- **Proposal:** `checks/agentN-*.checks.ts` exporting `Check<I>[] = {id, category, weight, requires?, run(input, ctx) →
  TestResult|TestResult[]|null}` in report order, plus helpers `present()`, `ratio(num, den, {passAt, msg})`, `bands()`,
  `noDuplicates()`. `defineScorer(agent, checks, policy)` returns the scorer. Honest and vanity tables share helpers.
- **Benefit:** ≈ −450 lines; each check is a pure function that is testable as data (table-driven tests per check). Weights,
  categories and non-empty categories become assertable metadata; threshold changes become one-line data diffs.
- **Verification:** SCO-12 byte-equality; message formatters must reproduce current strings exactly.
- **Relates to:** SCO-02, SCO-10.

### SCO-04 — Phase identity and thresholds: one registry
- **P1 · lens C, E · R1 · S–M**
- **Evidence (MEASURED):** Three agent-ID vocabularies: orchestrator `agent3b_hard_logic_devices`, vanity `agent4-hard-logic`,
  honest `agent3b-hard-logic`. Three resolvers: `thresholds.ts:63-69` (decides pass, keyed by `score.agent`), `thresholds.ts:121-128`
  `getThreshold` (test-only, a copy of the same lookup), and `aggregator.ts:507-528` `ORCHESTRATOR_THRESHOLDS` (displayed
  `threshold`, keyed by orchestrator id). Probe over all phases:
  - standard mode: displayed and deciding thresholds agree, **except under HONEST_SCORERS=enforce, where Agent 3b decides at 75
    and displays 85**;
  - strict/lenient: 4–5 phases disagree (e.g. prose shows 80, decides 85). No production caller uses strict or lenient; every
    site passes `"standard"`.
  - Scorer-local `passed` rules are overridden: agent65 documents "Pass threshold: 70" (`agent65-world-builder-scorer.ts:50`); a
    72 is `passed=true` from the scorer and **fails in the report at 75 with `failure_reason: undefined`**.
  - `'agent9_prose'` literal in `aggregator.ts:29` and `report-invariants.ts:150,158`.
  - Retry limits are keyed by orchestrator ids in `retry-limits.yaml`.
- **Proposal:** `scoring/phases.ts`: `PHASES: Record<PhaseId, {label, threshold, deliverable?, retryKey}>` keyed by orchestrator id.
  `passesThreshold(phaseId, score)` resolves from the phase, not from `score.agent`. Scorers stop computing `passed`/`failure_reason`
  (the aggregator derives them with `getFailedComponents`). Delete `DEFAULT_THRESHOLDS`, `THRESHOLD_MODES` strict/lenient,
  `ORCHESTRATOR_THRESHOLDS`, `getThreshold`.
- **Benefit:** removes the displayed≠decided defect class; −40 lines.
- **Verification:** port the probe (`scratchpad/sco12/thresholds-probe.mjs`) into a test; SCO-12 report snapshots are unchanged in
  standard mode. The enforce-arm 85/75 change is a behaviour fix on a flag-off arm: the owner confirms the intended value.
- **Relates to:** SCO-01, SCO-05, SCO-08.

### SCO-05 — `generateReport` and the five writers of run outcome
- **P1 · lens A, B · R1 · M**
- **Evidence (MEASURED/INFERRED):** `aggregator.ts:178-501` (324 LOC, cc 59) mixes eight jobs: mean score, release-gate status
  inference (195-263), run outcome (271-282), outcome reason (287-305), headline cap (334-346), snapshot parsing (348-378),
  summary (380-406), display status (408-428), and assembly. Hard-gate failure is inferred by regex over phase failure prose
  (208-218); the infra regex (220-221) is duplicated verbatim in `agents/shared.ts:627-629` (`applyAbortedRunMetadata`). Run-outcome
  fields are written by five bodies:
  - `generateReport`;
  - `savePartialReport` (`mystery-orchestrator.ts:946`);
  - `markStaleInProgressReport` (`:993`);
  - `applyAbortedRunMetadata` (`shared.ts:627`);
  - the API's `finalizeStaleInProgressReport` (`apps/api/src/server.ts:1326`).

  Four of them patch via `as any` fields absent from `GenerationReport` (`in_progress`, `aborted`, `abort_reason`, `stale`), and
  none reconciles `release_gate_outcome.shipped`. `report-invariants.ts:162-297` then polices their consistency. `addPhaseScore` and
  `upsertPhaseScore` are a 33-line self-clone, and `addPhaseScore` has 0 production callers. `overallGrade` (189) is dead, and
  `normalized_run_status.discrepancies` is always `[]` (424).
- **Proposal:** `report/run-outcome.ts` with pure `deriveReleaseGate(diagnostics, phases)`, `deriveRunOutcome(...)` and
  `applyTerminalState(report, {kind: 'completed'|'in_progress'|'aborted'|'stale', reason})`, used by all five writers (the API already
  imports `@cml/story-validation`). Add the patched fields to the type. Replace string inference with a structured
  `hard_gate_failed` flag on the phase or diagnostic. Invariants become a table of named predicates (cc 30 → ≤5 each). Rename
  `ScoreAggregator` → `RunReportBuilder`.
- **Benefit:** cc 59 → ≤12 per function; one outcome derivation (ADR-0006 in one place); −120 in area, ≈ −60 in worker/API.
- **Verification:** matrix test over (gate status × hard stops × warnings × phase pass × infra strings × prose present × terminal
  state) snapshotting outcome, reason, score, grade and gate fields before the split; existing `scoring.test.ts:389-590`,
  `report-finalization-a71.test.ts` and `aggregator-deliverable-cap.test.ts` stay green.
- **Relates to:** SCO-04. Open question 8 (report existing only when ENABLE_SCORING is on).

### SCO-06 — The release gate's clue matcher lives in a scoring adapter
- **P1 · lens A · R0 (move) / R1 (consolidation) · S**
- **Evidence:** `collectClueEvidenceFromProse` (`agent9-scoring-adapter.ts:280-422`, cc 28) is the NSD hard-stop matcher.
  `agent9-run.ts:7121` itself records the "split-brain: ledger uses chapterMentionsRequiredClue, gate uses
  collectClueEvidenceFromProse". Its thresholds live under `generation-params.yaml agent9_prose.scoring_adapter`.
  `adaptProseForScoring` (439-608, 170 LOC) re-derives `getKnownClueIds`, discriminating ids/tokens and `isDiscriminatingTestChapter`
  that the collector already computed (446-460). `ProseScorer` is invoked at 6 sites with hand-assembled args; `fallbackTelemetry` is
  passed at 1 of 3 full-score sites (`agent9-run.ts:5418` yes, `4450` no). The 608-line file is hotspot #3 (2,445).
- **Proposal:** move the collector and helpers to `clue-evidence.ts` (story-validation, beside the prose scorer, or the worker's
  agent 9 module: owner). Split fair-play/timing analysis into `prose-fair-play.ts`. Leave a ~120-line mapping adapter. Add one
  `scoreProse(chapters, {partial, sceneCount, fallbackTelemetry})` used by all six sites. Unifying the two clue matchers is R2 and
  belongs to the Agent 9 area.
- **Benefit:** the gate dependency becomes visible; 608 → ~120 + ~300 modules; −45 lines; closes the option-drift class.
- **Verification:** `scoring-adapters-prose.test.ts` (91% coverage) and NSD tests, unchanged; move-only diff.
- **Relates to:** SCO-07, SCO-13. Cross-area: Agent 9 clue-matcher unification.

### SCO-07 — Prose-stage semantic duplicates (ADR-0005)
- **P2 · lens C · R1 where equal, R2 where drifted · M**
- **Evidence:**
  - Fair-play score: `agent9-prose-scorer.ts:734-738` uses 35/35/15/15 (D8); `agent9-run.ts:5260-5263` writes
    `fair_play_component_score` with the pre-D8 40/40/20. **MEASURED: the same input gives 85 from the scorer and 100 in the
    diagnostic.**
  - Expected clue set derived three ways: adapter `getKnownClueIds` (`:155-192`, normalised dedupe, mapping∩distribution);
    `agent9-run.ts:2916` `getExpectedClueIdsForVisibility` (exact strings, distribution ∪ discriminating); scorer `extractCMLClues`
    fallback (`agent9-prose-scorer.ts:662-668`). The first two feed the same `post_generation_summary` diagnostic.
  - Discriminating-test scene: keyword regex, last match wins (`agent7-scoring-adapter.ts:77-96`), versus the canonical
    `resolveDiscriminatingSceneIndex` from the CML (`mechanism-reveal-gate.ts:31`).
  - Trust caps: the adapter sets 60/75/80/88 (`agent9-scoring-adapter.ts:498-533`), the scorer falls back to 60/75/80/85
    (`agent9-prose-scorer.ts:281-287`).
  - Scene-count gate: the scorer's critical test (`agent7-narrative-scorer.ts:141-153`) is re-implemented in `agent7-run.ts`
    (forcing total 0).
  - `normalizeClueIdForMatch` is duplicated (adapter `:95`, scorer `:88`).
- **Proposal:** one exported `expectedClueIds()`; the diagnostic reads the scorer's test score; the adapter uses the CML resolver;
  caps live in one table in the scorer.
- **Benefit:** −60 lines; removes four drift pairs from the durable record.
- **Verification:** SCO-12 prose snapshot; changed diagnostic values are listed for owner sign-off.
- **Relates to:** SCO-06.

### SCO-08 — Two bodies of retry policy
- **P2 · lens F · R0 (rename/dead) + R2 (policy) · S**
- **Evidence:**
  - Phase retries: `RetryManager` + `retry-limits.yaml` + a 67-line TS copy (`retry-manager.ts:87-153`) + story-validation
    `buildRetryFeedback(score)`, driven by `executeAgentWithRetry` (`shared.ts:707-807`). They run only when
    `AGENT_PRE9_ENABLE_LLM_RETRIES` is on (default off, `:662,758`).
  - Prose retries: `prompts-llm/src/retry-protocol.ts` `classifyFailure` + `buildRetryFeedback(packet)`, always on. **Same exported
    name in two packages.**
  - Dead config: the YAML `agent9_prose`/`agent8_novelty` entries are never consumed via RetryManager; `enhanced_feedback` is read only
    by an uncalled method.
  - `abort_on_max_retries: true` + `abortCritical` (`shared.ts:767-771`) lets a phase score, including a vanity score of fabricated
    data, abort a run when retries are on. That is in tension with ADR-0006 ("phase scores … do not define the outcome") and
    ADR-0003.
  - Feedback reaches prompts through `tone`/`theme` inputs, twice for 2e and 3b (`agent2e-run.ts:42-43`, `agent3b-run.ts:342-343`).
  - The minima 60/50/60/50 are hard-coded in `retry-feedback.ts:18-21`.
- **Proposal:** rename to `buildPhaseRetryFeedback` (R0); delete the dead YAML entries and methods (R0); read minima from
  `COMPONENT_MINIMUMS` (R0). Owner decision (R2): keep phase-score retries at all? If kept, abort-on-exhaustion should not apply.
- **Benefit:** −70 lines; one retry vocabulary per stage, and the ADR tension made explicit.
- **Verification:** new snapshot test for `buildRetryFeedback` (currently 0% covered).
- **Relates to:** SCO-01, SCO-04.

### SCO-09 — Adapter⇄scorer duplicate types; casts; dead `adapted`
- **P2 · lens C, E · R0 · S**
- **Evidence:** 9 interface pairs are declared in both the adapter and the scorer (jscpd adapter⇄scorer clones of 11–23 lines each;
  e.g. `agent1-scoring-adapter.ts:7-20` ≡ `agent1-setting-refinement-scorer.ts:14-27`), because the scoring barrel exports only the
  classes. `agent2d-scoring-adapter.ts` has 29 `any` and 30 casts over fields `TemporalContextResult` already types
  (`prompts-llm/src/agent2d-temporal-context.ts:18-96`); only `time_of_day_of_crime` is untyped. `scoreOutput` returns
  `{adapted, score}` at 9 sites and `executeAgentWithRetry` never reads `adapted` (`shared.ts:740`).
- **Proposal:** export the input types from `@cml/story-validation`, delete the adapter copies, type the 2d adapter with `Partial<>`
  defaults, and drop `adapted` from the contract.
- **Benefit:** −110 lines, −29 `any`, −30 casts.
- **Verification:** typecheck plus the existing adapter tests.
- **Relates to:** SCO-01 (moot if adapters are retired).

### SCO-10 — `ScoringContext` contract lies; dead CML branches
- **P2 · lens E, D · R1 · S**
- **Evidence:** `types.ts:43-69` declares `cml: CMLData` required. Agents 1, 2, 2c, 2d, 2e and 3b pass `cml: undefined as any`
  (e.g. `agent1-run.ts:45`), although 2c and 2d run after the CML exists. So these checks never execute in production:
  - agent1 clue-placement validity (`agent1-setting-refinement-scorer.ts:343-399`, which would also read a non-existent
    `CASE.hard_logic_devices[].clue_id`) and the location-coverage branch (`:286-307`, with `previous_phases: {}`);
  - agent2c atmosphere consistency (`:348-400`, reads `BACKGROUND_CONTEXT`, which is not a CML path, and always returns true);
  - agent2d fashion/date-era (`:392-473`, same path).

  No scorer reads `threshold_config` (12 call sites build it); `input` is unused in 8 of 10 scorers (tsc TS6133).
  `ProseScorer.targetLength` is instance state mutated per call (`agent9-prose-scorer.ts:177,184`).
- **Proposal:** per-scorer typed context (each check table declares what it needs); delete the unreachable branches (R1: unreachable
  from every call site, but not compiler-provable), or wire the CML in (R2, owner). Drop `threshold_config`.
- **Benefit:** −170 lines; removes a type lie at 6 sites.
- **Verification:** SCO-12 snapshots unchanged (the branches never ran).
- **Relates to:** SCO-03.

### SCO-11 — Dead code
- **P2 · lens D · R0 · S**
- **Evidence (MEASURED, export-usage over this scope + grep incl. `apps/web` + `tsc --noUnusedLocals`):**
  - scorer-utils: `hasMinLength`, `hasMaxLength`, `inRange`, `hasRequiredFields`, `getFailedTests`, `hasCriticalFailures`,
    `calculatePassRate`, `validateSchema`, `scoreTextQuality`, `scoreConsistency` (~165 lines, 0 production calls; file 37% covered).
  - `buildConciseRetryFeedback` + `getTopFailures` (43).
  - Aggregator `getPhases`, `getPhaseCount`, `hasFailures`, `getFailedPhases`, `getCurrentOverallScore` (0 callers, even in tests).
  - RetryManager `shouldProvideEnhancedFeedback`, `getConfig`, `reset`.
  - `comparePromptVariants` (`ab-prompt-harness.ts`, 170 lines + 102-line test): zero importers; the project's A/B tool
    (`scripts/exp-regen-clue/analyze-lib.mjs`) does not use it, though the README advertises it.
  - 11 unused imports; dead locals `overallGrade`, `ineligible`, `uniqueCapitalizedWords`, `base`, `isRedHerring`, `totalActs`;
    unused type import `KeyLocation`.
  - Stale header: `agent2-cast-real-scorer.ts:18` says "NOT wired"; it is wired (`agent2-run.ts:733`).
- **Proposal:** delete. Exported with zero importers repo-wide qualifies under ADR-0011's `@cml/utils` precedent. Keep the A/B harness
  only if the owner wants it for R6.
- **Benefit:** −470 lines (−570 with the harness test).
- **Verification:** typecheck, tests, `build:all`, `preflight-dist-check`.

### SCO-12 — Safety net: a golden-bundle characterisation harness
- **P1 · lens J · R0 · S**
- **Evidence (MEASURED, coverage run 2026-09-25):**
  - 0% line coverage: `agent1-setting-refinement` (303 lines), `agent2-cast` (341), `agent2b` (285), `agent2c-location-profiles`
    (308), `agent2e-background` (361), `agent4-hard-logic` (241) — 1,839 lines — and `retry-feedback.ts`.
  - Adapters 1, 2c, 2e, 3b and 7 are at ≤8%.
  - `fixed-seed-benchmark.replay.test.ts` compares stored report numbers with expected numbers and **never executes a scorer**; its
    fixtures are gitignored (`.gitignore:46`).
  - `agent9-replay.ts:357` sets `enableScoring: false`.
  - Committed `eval/golden/bundle-*.json` (4 bundles with every upstream artifact) are unused by tests. My probe scored all 9 wired
    phases (vanity + honest) from them in under a second.
- **Proposal:** `scoring/__tests__/golden-characterisation.test.ts`: for each bundle × phase, run adapter → scorer →
  `applyHonestScorer` (both arms) and snapshot the full `PhaseScore` JSON. Add a report-matrix test (SCO-05), the threshold probe
  (SCO-04), and one committed prose fixture (owner: capture from a canary) for ProseScorer/adapter snapshots.
- **Benefit:** makes SCO-02/03/04/05/09/10/11 provable byte-for-byte; about +150 lines of test.
- **Verification:** it is the verification.

### SCO-13 — Clue-evidence matcher cost
- **P3 · lens H · R1 · S**
- **Evidence (MEASURED, synthetic 20 chapters × 22 paragraphs, 15 clues):** `collectClueEvidenceFromProse` takes ~208 ms. The
  per-batch chapter series (`agent9-run.ts:4401-4435`, adapt(batch) + adapt(accumulated) per batch, O(N²)) takes ~2.8 s. ~25% is
  `getGenerationParams()` → `existsSync` per (clue, paragraph) (`agent9-scoring-adapter.ts:141-152`, `generation-params.ts:815-826`).
  Per-pair re-normalisation of each paragraph adds more (`:315`). Estimated ~100 calls per run: a few seconds of event-loop CPU,
  under 1% of a ~40-minute run.
- **Proposal:** read the config once per call; normalise each paragraph once; cache per-chapter evidence across the accumulated
  series.
- **Benefit:** ~10× less CPU; negligible against LLM latency, hence P3.
- **Verification:** `scoring-adapters-prose.test.ts` + SCO-12 prose snapshot.

## 4. Target structure

```
packages/story-validation/src/scoring/
  engine/engine.ts        ~90   assemblePhaseScore(policy), calculateGrade, failureReason
  engine/checks.ts        ~80   present/ratio/bands/noDuplicates, defineScorer
  engine/policy.ts        ~30   DEFAULT_POLICY {weights, floors, passTotal, emptyCategory}
  phases.ts               ~60   PHASES registry (orchestrator id → label, threshold, deliverable, retryKey)
  thresholds.ts           ~40   passesThreshold(phaseId, score), getFailedComponents
  checks/agentN-*.checks.ts     one table per agent, ~120–250 each (vanity today 300–550); honest tables alongside
  report/run-report-builder.ts ~200 (was aggregator.ts 574)
  report/run-outcome.ts   ~120  deriveReleaseGate, deriveRunOutcome, applyTerminalState
  report/headline.ts, snapshots.ts ~80
  report/report-invariants.ts ~220 (named predicate table)
  retry/retry-manager.ts ~200 · retry/phase-retry-feedback.ts ~60
  clue-evidence.ts ~300, prose-fair-play.ts ~120   (moved from the worker agent9 adapter; or worker agent9 module)
  types.ts (+ exported scorer input types)
apps/worker/src/jobs/scoring-adapters/   mapping-only (agent9 ~120), or removed with the vanity family
```
Area size: ≈ 7,600 lines after the R0/R1 findings; ≈ 4,900 if the vanity family is retired.

## 5. Suggested sequence

1. SCO-12 harness (golden bundles + report matrix + threshold probe) — R0.
2. SCO-11 dead code; SCO-09 exported types, 2d adapter typing, drop `adapted` — R0.
3. SCO-06 move the clue matcher (R0), then `scoreProse()` (R1).
4. SCO-02 engine — byte-equal against the harness.
5. SCO-04 phase registry (owner confirms the 3b enforce threshold).
6. SCO-05 run-outcome module + report builder split, then point worker/API writers at `applyTerminalState`.
7. SCO-03 check tables, one agent per PR.
8. SCO-10 dead CML branches; SCO-07 prose duplicates (drifted values listed for sign-off).
9. SCO-08 rename/dead config, then the owner's retry-policy decision.
10. SCO-01 shadow batch → enforce → delete vanity scorers and adapters.
11. SCO-13 when the agent 9 adapter is open.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `ENABLE_SCORING` | off | `mystery-orchestrator.ts:882-883` | unregistered; `flags:check` pattern cannot match it | Gates the report repository too (no durable record without it). Every agent run duplicates its LLM call in `if (enableScoring…) executeAgentWithRetry(…) else …` (`agent1-run.ts:26-75`) |
| `HONEST_SCORERS` | off (off/shadow/enforce) | `agents/shared.ts:679`, 7 call sites | unregistered; invisible to `flags:check` | One clean selector; enforce changes the threshold key (SCO-04) |
| `AGENT_PRE9_ENABLE_LLM_RETRIES` | off | `shared.ts:662`, `:729` | Addendum 5: default OFF | Makes RetryManager, backoff, abort and `buildRetryFeedback` dormant by default |
| `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` | **on** | `shared.ts:697-705` | Addendum 5 lists it default OFF — **register is wrong** | Not scoring; noticed in the same file |
| `CML_GENERATION_PARAMS_PATH` | unset | `generation-params.ts:816` | config | Unset means `existsSync` on every config read (SCO-13) |

Config also read here: `retry-limits.yaml` (+ TS copy); `generation-params.yaml agent9_prose.scoring_adapter/scorer`. The YAML
values (0.28/14/0.9/10/8) differ from `DEFAULT_CONFIG` (0.3/12/0.95/8/6, `generation-params.ts:764-779`).

## 7. Safety net

- **Pins today:**
  - `scoring.test.ts` (thresholds, RetryManager on its TS defaults rather than the YAML, aggregator outcome cases 389-590);
  - `agent9-prose-scorer.test.ts` (fair play D8, completeness diagnostics);
  - `agent7`/`agent2d`/`agent65` scorer tests (1–2 cases each);
  - `honest-scorers.test.ts` and `agent2-cast-real-scorer.test.ts` (honest family 94–100% covered);
  - `aggregator-deliverable-cap.test.ts`; `report-invariants*.test.ts` and `report-finalization-a71.test.ts`;
  - worker `scoring-adapters-{cast,character-profiles,prose,temporal}.test.ts`.
- **Gaps:** the six vanity scorers (0%), `retry-feedback.ts` (0%), adapters 1/2c/2e/3b/7 (≤8%), `generateReport` branch
  matrix partial, no prose fixture, the replay benchmark is inert.
- **Write first:** SCO-12's golden snapshot (both honest arms), the report matrix, the threshold probe, a `buildRetryFeedback` snapshot,
  and a prose fixture snapshot.

## 8. What NOT to refactor

- ADR-0006 outcome semantics: run outcome from the release gate, the unknown-gate phase fallback, `phase_thresholds_met`
  demotion, and `shipped` computed once. Centralise them; do not change them.
- The headline cap (`aggregator.ts:307-346`) and its wiring test; the A_71 `in_progress` label and the E1 exemption.
- `applyHonestScorer`'s never-throw contract; honest scorers' local mirror types (the prompts-llm → story-validation dependency
  direction is deliberate).
- ProseScorer's name and location matchers (A_61 RC4.4 fixes) and agent65's documented distinct weights: parameterise, do not
  normalise.
- Do not patch vanity adapters' fabrication piecemeal: it shifts the baseline for no decision (ANALYSIS_56 §2-D). Decide SCO-01
  instead.
- Report size and diagnostics (ADR-0010).

## 9. Incidental defects

1. **Fair-play diagnostic drift:** `agent9-run.ts:5260-5263` (40/40/20) vs scorer 35/35/15/15. MEASURED 100 vs 85 on one input.
   High confidence.
2. **HONEST_SCORERS=enforce lowers Agent 3b's pass bar 85→75** while the report shows 85 (`'agent3b-hard-logic'` is missing from
   `DEFAULT_THRESHOLDS`). MEASURED. High.
3. **Scorer-local pass rules are silently overridden:** agent65 at 72 passes by its own rule (≥70), then fails in the report at 75
   with `failure_reason` undefined, so the report shows a failed phase with no reason (fallback "Score below threshold").
   MEASURED. High.
4. `retry-feedback.ts:54` "partial successes" compares score (0–100) to weight (≤3), so it never renders. `:45` hides all minor
   issues when there are more than 5. High; dormant (retries off).
5. RetryManager backoff off-by-one: `recordRetry` increments before `getBackoffDelay` is read (`shared.ts:789-791`), so the first retry
   waits twice the base. Medium-high; dormant.
6. Prose rescore (`agent9-run.ts:4450`) omits `fallbackTelemetry`, so committed-fallback trust caps are dropped after a schema-repair
   rerun. Medium.
7. `checkCompleteness` dereferences arrays without a guard (`agent2-cast-scorer.ts:395`, `agent2b…:322`, `agent2c…:306`,
   `agent4…:300`); the scorer throws on a missing array and the caller logs "Scoring failed". Medium (degenerate input).
8. Agent 1 adapter discards `location.description` (`agent1-scoring-adapter.ts:30`). High.
9. Doc drift: the README gives the global retry cap as 15 (YAML 18) and prose as "strict 85" (code 80), and says retries are
   automatic (default off). High.
10. `apps/web/src/components/types.ts:295` mirrors report types by hand: missing `in_progress`, `shipped` and
    `phase_thresholds_met` (worked around by casts in `App.vue:3014`). High; cross-area.
11. FLAG-AUDIT Addendum 5 misstates the `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` default (§6). High.
12. Novelty "skipped" is recorded as 100/A and averaged into `overall_score` (`agent3-run.ts` ~700); the headline cap mitigates.
    Cross-area.

## 10. Cross-area observations

- **Inline PhaseScore builders:** agents 3, 5, 6 and 8 each build their own score, each with its own weights (50/30/20/0,
  35/25/20/20, validation-only) and grade ladder. `total` has no invariant tying it to the component scores.
- **Scoring hookup boilerplate in 9 run files:** the LLM call is duplicated across the scoring and non-scoring branches. A
  `runScoredPhase(ctx, spec)` helper would remove 15–25 lines per agent and the branch-divergence risk.
- **Retry feedback via `tone`/`theme`:** smuggled through input fields, duplicated for 2e and 3b.
- **Clue matchers and chapter scorers:** clue-matcher split-brain (`chapterMentionsRequiredClue` vs `collectClueEvidenceFromProse`),
  and three prose chapter scorers (`ProseScorer`, `buildProvisionalChapterScore` in `prompts-llm generate.ts:214` at 35/20/25/20,
  rubric-score).
- **Name matching re-implemented:** "includes both ways" in agents 1/2b/7, `namesMatch`, `castNameReferencedInProse`,
  `buildCastNameMap`.
- **YAML ⇄ TS default copies** (retry limits, generation params) that already differ.
- `(cml as any).CASE` repeated at 12+ sites in `agent9-run.ts`.
- `flag-register-check.mjs` misses unprefixed behaviour flags.

## 11. Open questions for the owner

1. Promote `HONEST_SCORERS=enforce` and retire the vanity scorers and adapters (SCO-01)? If both stay, is permanent shadow the
   intended state?
2. Under ADR-0006, should phase-score retries exist? If yes, may exhausting them abort a run?
3. Agent 3b under honest scoring: 85 or 75? Are strict/lenient modes wanted at all?
4. Where should the clue-evidence matcher live: story-validation or the worker's agent 9 module?
5. Keep `comparePromptVariants` for the R6 eval harness, or delete it?
6. Canonical fair-play weighting for the diagnostic: 35/35/15/15?
7. Should 2b, 2d, 6.5 and 9 get honest check tables?
8. Should the report (the ADR-0010 durable record) be written even when `ENABLE_SCORING` is off, with phase scoring as an optional
   input? May `in_progress`, `aborted`, `abort_reason` and `stale` join the `GenerationReport` type?

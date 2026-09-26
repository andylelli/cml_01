# 06 — Agent 5: clue extraction

**Scope:** `apps/worker/src/jobs/agents/agent5-run.ts` (4,474 lines, 3,648 code, 417 fns) · `packages/prompts-llm/src/agent5-clues.ts` (1,479 lines, 1,245 code, 83 fns) — 5,953 lines, 4,893 code lines · **Read:** every line, plus the relevant parts of `agent6-run.ts`, `shared.ts`, `mystery-orchestrator.ts`, `agent9-run.ts`, `clue-validation.ts`, `packages/clue-spec`, `harness/agent5-direct-llm-check-harness.ts` · **Written:** 2026-09-25
**Finding prefix:** A5 · **Method:** [RUBRIC.md](../RUBRIC.md)

## 1. What this area does

```
runAgent5(ctx)                                    agent5-run.ts:3318  (1,126 LOC, cc 133)
 P2  normalise CASE.discriminating_test.evidence_clues (mutates ctx.cml)       :3325-3342
 P3  prompt inputs: density, strict contract (memoised), proactive feedback     :3344-3390
 P5  extractClues() ──► prompts-llm/agent5-clues.ts                             :3440-3503
       buildCluePrompt (610 LOC, cc 102) → one LLM call (design tier, JSON mode,
       max_tokens 6000) → parseClueJsonContent/jsonrepair → truncation retry →
       dropMalformedParsedClues → step/evidenceType inference → clueTimeline
 P6  source-path repair + applyClueGuardrails (shared.ts) [+LLM retry, flag]    :3505-3607
 P7  inference-coverage gate [+LLM retry, flag]                                 :3609-3699
 P8  suspect-coverage gate [+LLM retry, flag | else deterministic backstops]    :3701-3822
 P9  red-herring FLOOR — default-ON full regeneration                           :3824-3917
 P10 red-herring overlap: [LLM retry] → sanitize → prune → abort                :3919-4078
 P11 final gates (source path, step bounds, cast path, audit, era time,
     locked-fact time, culprit evidence)                                        :4080-4165
 P12 evidence-ID remediation: seed / [LLM retry] / remap / purge               :4167-4290
 P13 step-coverage synthesis                                                    :4292-4310
 P14 enforceAgent5DeterministicContracts (also called by Agent 6 + harness)     :4312-4320
 P15 coverage hard gate · P16 commit ctx.clues/coverage · P17 phase score       :4322-4442
```

Data in: `ctx.cml`, `ctx.lockedFactRegistry` (prompt), `ctx.hardLogicDevices` (gates), inputs.targetLength. Out:
`ctx.clues` (`ClueDistributionResult`), `ctx.coverageResult`, `ctx.allCoverageIssues`, `ctx.agentCosts/agentDurations`,
`ctx.agent5*` status fields (read by `scripts/canary-agent-boundary.mjs:264-276`), a phase score, and **mutations of
`ctx.cml`** (evidence_clues). Around 2,900 of the runner's lines are helpers in eight families: CML/text utilities
(:185-258, :1410-1557), evidence-ID namespace (:260-482, :2620-2846), source paths (:139-155, :484-614, :1262-1369),
strict contract build/repair/check (:616-1260), cast/audit consistency (:1371-1464, :1577-1632), suspect coverage
(:1634-1839), locked-fact time (:1935-2138), coverage and red herrings (:2140-2618), and synthesis (:1841-1933, :2620-3108).

## 2. Verdict

This area is not badly written. Each helper is small, and most carry their incident history in comments. The
complexity comes from **accretion by duplication**: every incident added a detector, a repairer and a re-check next
to the last one. The same concept now exists in several bodies, and the bodies have drifted apart. The
source-path vocabulary has five bodies, and the prompt allows a path (`CASE.death_method`) that the worker rewrites
away. The discriminating-evidence namespace is rewritten by seven functions across three stages. The final gate
sequence runs twice per run. And the one LLM boundary returns data cast to `Clue` without normalising it, so the
runner distrusts every field (155 `any`, 145 `String(x?.y ?? "")` coercions). The single most valuable change is
**A5-01 plus A5-04**: turn `runAgent5` into a coordinator over explicit phases sharing one state object, merge its
P11 with `enforceAgent5DeterministicContracts`, and normalise the LLM JSON once at the parse boundary. Reading also
turned up one outright code-corruption defect (§9.1): the AM/PM guard has been dead since 2026-08-21.

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| A5-01 | P1 | B,C | `runAgent5` → coordinator over ~12 phases with explicit state; P11 duplicates `enforce…` | R1 | L (3 d) | −450 |
| A5-02 | P1 | C | Source-path vocabulary: 5 bodies, diverged (`CASE.death_method`) | R1 (merge) / R2 (accept path) | M | −120 |
| A5-03 | P1 | C | Discriminating-evidence namespace: 7 rewriters, 3 scorers, 3 stages, 3 policies | R1 / R2 | M | −90 |
| A5-04 | P1 | E | Normalise LLM JSON at the parse boundary + typed case view (removes most `any`) | R1 | M | −180 |
| A5-05 | P1 | A | Agent 6 imports a runner; clue types sit in an LLM module (fan-in 15) | R0 | S | 0 |
| A5-06 | P1 | F | Gate failures are strings; classifier covers 5 of ≥13 throws; Agent 6 regex branches dead | R1 | S | −60 |
| A5-07 | P2 | C | Check/repair pairs re-implement the same predicate (5 pairs) | R0/R1 | M | −90 |
| A5-08 | P2 | C | Synthesised-clue minting: ~7 bodies, 4 timeline builders, 2 direct-culprit synthesizers | R1 | M | −110 |
| A5-09 | P2 | B | `buildCluePrompt` (610 LOC, cc 102) → section builders + retry-feedback normaliser | R1 | M | +20 |
| A5-10 | P2 | I | Prompt asks for output nobody reads; proactive feedback has zero effect | R2 | S | −60 |
| A5-11 | P2 | I,F | Retries regenerate everything, statelessly, without locked facts or strict contract | R2 | M | −40 |
| A5-12 | P2 | G | WeakMap memos keyed on a CML that is mutated in place | R1 | S | −20 |
| A5-13 | P2 | D | Dead and vestigial code (compiler-proven and verified by grep) | R0 | S | −45 |
| A5-14 | P2 | C | Vocabulary and tokenizer zoo (escape ×2, elimination regex ×3, step-from-path ×4, clue-id regex ×6) | R0/R1 | M | −60 |
| A5-15 | P2 | C,E | `generateExplicitClueRequirements` vs `@cml/clue-spec` `deriveClueSpec`: two derivations | R2 | M | −120 |
| A5-16 | P3 | I | Stable prompt text sits after volatile CML text (prefix caching) | R2 | S | 0 |
| A5-17 | P3 | H | CPU: memo caches and O(n²) scans are negligible against LLM latency | — | — | 0 |

---

### A5-01 — Decompose `runAgent5`; merge its final gates with `enforceAgent5DeterministicContracts`
- **P1 · lens B,C · R1 · L (3 days)**
- **Evidence (MEASURED):** a TypeScript-AST pass over `runAgent5` (`agent5-run.ts:3318-4443`) found **47 top-level
  declarations, 17 of them referenced in more than one phase**, 20 `ctx` fields touched. The **8 mutable shared
  variables** are `clues`, `agent5RetryInvoked`, `finalCoverage`, `clueGuardrails`, `performedCoverageRetry`,
  `performedSuspectRetry`, `performedRedHerringRetry`, plus `extractionAttempt`, which is hidden inside the
  `extractWithAttempt` closure. The 5 shared closures are `mergeStrictPromptFeedback`, `failAgent5`,
  `recordHardFailPhaseScore`, `extractWithAttempt` and `buildCoverageSnapshot`. The 4 shared immutables are
  `llmRetriesEnabled`, `clueDensity`, `strictPromptFeedbackBase` and `hardLogicLockedFacts`. jscpd, run by me with
  `--max-lines` lifted, finds **29 clones / 239 lines inside the two files**. The biggest family is the retry
  boilerplate: `agentCosts/agentDurations` accumulation and `applyClueGuardrails` re-run at :3583, :3687, :3775,
  :3896, :4001, :4228 (7 LLM call sites after the first). **P11 (:4080-4165) is the first ten gates of
  `enforceAgent5DeterministicContracts` (:3121-3187) in the same order**. The only differences are the failure sink
  (`ctx.errors.push` + `failAgent5` against `throw`) and that `enforce` also runs strict repairs first. Every run
  therefore executes these gates twice, 4 LLM-free passes apart. P10's two branches (:4013-4036 and :4043-4069) are
  the same sanitize → prune → abort ladder.
- **Proposal:** add `agents/agent5/state.ts`:
  `interface Agent5RunState { cml; config: {llmRetries, density, strict?, hardLogicLockedFacts?}; clues; telemetry: {retryInvoked, coverageRetry, suspectRetry, rhRetry, firstGuardrails, attempt, startedAt}; coverage? }`.
  Add `agents/agent5/llm.ts` with `regenerate(state, feedback, label)`. It owns the attempt counter, cost and
  duration accounting (which fixes §9.2 in one place) and the post-regeneration guardrails. Split the phases into
  functions (`normaliseEvidenceIds`, `extractFirstPass`, `runGuardrailGate`, `runCoverageGate`, `runSuspectGate`,
  `runRedHerringFloor`, `runRedHerringOverlap`, `remediateEvidenceIds`, `synthesizeStepCoverage`, `assertCoverage`,
  `commit`). Add a pure `computeAgent5PhaseScore(inputs): PhaseScore`, extracted from the 95-line block at
  :4344-4438. Replace P11 and the first half of `enforce` with **one gate table**,
  `runGateSequence(cml, clues, gates, sink)` where each gate is `{id, check, repair?, onResidual:"throw"|"warn"}`.
  The sink maps to `ctx.errors` + `failAgent5` in the runner and to `throw` in Agent 6. `failAgent5` becomes a typed
  `Agent5GateError` caught once at the top (see A5-06).
- **Benefit:** the 1,126-line, cc 133 function becomes a coordinator of about 200 lines (cc ≈ 15) over phases of at
  most about 120 lines (cc ≤ 25), with the 17 shared variables made explicit. Seven retry copies become one (about
  −100 lines). The duplicated gate sequence goes (about −85). Score computation becomes unit-testable.
- **Verification:** characterisation harness first (§7, item 2), with byte-equal `ctx.warnings`/`ctx.errors`/
  `ctx.clues`/score on scripted LLM responses. Keeping both gate passes, in the same order, keeps this R1. Dropping
  the P11 pass is a separate R2 step.
- **Relates to:** A5-04, A5-06, A5-11; Agent 6 and Agent 7 areas (the same runner shape).

### A5-02 — One source-path vocabulary (five bodies today, already divergent)
- **P1 · lens C · R1 to merge, R2 to change what is legal · M**
- **Evidence (MEASURED):** the bodies are
  (1) the regex whitelist `ALLOWED_SOURCE_PATTERNS` (`agent5-run.ts:139-155`, 15 patterns);
  (2) the enumerator `computeStrictSourcePathWhitelist` (:556-603);
  (3) the enumerator `buildValidSourcePaths` (`agent5-clues.ts:547-606`) — a near-literal clone of (2) **plus
  `CASE.death_method`** (A_67 FIX-2, commit 43264bb0, 2026-07-24);
  (4) the prompt's "Allowed source roots" list (`agent5-clues.ts:896-913`, 16 roots including `CASE.death_method`);
  (5) `legalSourceTemplates` (`agent5-run.ts:3530-3539`, 8 templates, missing 8 of the families).
  A probe on the built code with `eval/golden/bundle-eb1251aa.json`: `validateSourcePath(cml,"CASE.death_method") = false`,
  and `repairInvalidSourcePaths` rewrites it to `CASE.inference_path.steps[0].observation [fallback]`. So the
  prompt's mandatory death-method tell (`agent5-clues.ts:363-381`) is re-sourced by the worker. In all 4 golden
  bundles the tell clue sits on `steps[0].observation` (2 of 4) or `steps[0].required_evidence[*]` (2 of 4), never on
  `death_method`. The `@cml/clue-spec` slots (`derive.ts:116,134,166,210`) use paths the worker also rejects.
- **Proposal:** `packages/clue-spec/src/source-paths.ts` exports `SOURCE_PATH_FAMILIES` (one table: template, regex,
  enumerator, prompt label). `validateSourcePath`, both enumerators, the prompt root list and the retry templates
  all derive from it. Step 1 (R1) merges the bodies but keeps the current worker verdicts through a
  `workerLegal: boolean` column, so the prompt still lists `death_method`. Step 2 (R2, owner) decides whether
  `death_method` is legal. Accepting it is what A_67 FIX-2 intended.
- **Benefit:** 5 bodies become 1 (about −120 lines). It removes a prompt/validator contradiction on every run, and it
  unblocks wiring `clue-spec` (A5-15).
- **Verification:** prompt byte-equality on the 4 golden CMLs (§7), plus a table test that validator ⊆ enumerator.
- **Relates to:** A5-15, §9.3.

### A5-03 — The discriminating-evidence ID namespace has no owner
- **P1 · lens C · R1 (merge the scorers) / R2 (unify the policy) · M**
- **Evidence (INFERRED, bodies read):** `CASE.discriminating_test.evidence_clues` is rewritten by
  `sanitizeDiscriminatingEvidenceClueIds` (:270), `alignDiscriminatingEvidenceIdsWithSceneMapping` (:300),
  `remapMissingDiscriminatingEvidenceIdsToExistingClues` (:368), the inline reseed (:4169-4189),
  `purgeUnmappableDiscriminatingEvidenceIds` (:2695), then by the orchestrator back-fill
  (`mystery-orchestrator.ts:1350-1400`, threshold 3) and by `reconcileDiscriminatingEvidenceIdsToCanonicalNamespace`
  (`agent9-run.ts:2968`, seeds to ≥2). That is three policies: "≥1 only when empty" (A5), "back-fill to 3" (the
  orchestrator) and "≥2" (A9). The "score clues against the test text" logic exists three times: `agent5-run.ts:2628-2646`
  and `mystery-orchestrator.ts:1363-1385` have identical weights except the tie-break, and `:2809-2845` uses
  different weights. The tokenising of the test text is copied 3×.
- **Proposal:** a new `clue-namespace.ts` (worker `jobs/clue-contracts/`) with `scoreEvidenceCandidates(cml, clues, weights)`
  and `reconcileEvidenceIds(cml, clues, policy): {finalIds, changes}` as a pure function returning a new array.
  Callers apply the result. R1 step: route all three scorers through it with their current weights. R2 step (owner):
  one policy, applied once, before Agent 6 audits the case, so later stages dereference it (ADR-0005 in spirit,
  ADR-0001).
- **Benefit:** 7 rewriters become 1 module. It removes a CML field that changes after the fair-play audit.
- **Relates to:** A5-12, Agent 9 and orchestrator areas.

### A5-04 — Normalise at the LLM-JSON boundary; give Agent 5 a typed case view
- **P1 · lens E · R1 · M**
- **Evidence (MEASURED, grep):** in `agent5-run.ts` there are 64 `(x: any)` callback parameters (mostly over
  `clues.clues`, which is already `Clue[]`), 71 `as any`, 16 `(clues as any)` for `clueTimeline`/`audit`, fields that
  *exist* on `ClueDistributionResult`, 36 `getCaseBlock()` calls returning `any`, 9 inline `(cml as any)?.CASE ?? cml`,
  145 `String(x?.y ?? "")` coercions and 90 `Array.isArray` guards. The root causes are that `CaseData = any`
  (`packages/cml/src/index.ts:105`) and that `extractClues` casts parsed JSON to `Clue` without validating the
  `placement`/`criticality`/`category` enums or the string fields (`agent5-clues.ts:1382-1406`). The runner then
  mixes exact comparisons (`c.placement !== "early"`, :2532) with lower-cased ones (:3066). The harness has a
  **third, divergent normaliser** (`agent5-direct-llm-check-harness.ts:293-356`: its own `inferStepFromSourcePath`,
  its own `inferEvidenceType` without the `time.contradictions` rule, and enum coercion that production lacks), so
  it measures a different pipeline from the one that ships.
- **Proposal:** in prompts-llm, add `agent5/parse.ts` exporting
  `normalizeParsedClueDistribution(raw, budget): {result: ClueDistributionResult, warnings}` (trim, enum-validate
  with a warning plus fallback, coerce numbers). The existing `parseClueJsonContent` and `dropMalformedParsedClues`
  move there too. Both `extractClues` and the harness use it. For the CML, adopt `@cml/clue-spec`'s
  `CmlCaseForClues` (extended with `constraint_space`, `prose_requirements`, `quality_controls`, `locked_facts`,
  `false_assumption.type`) and its `unwrapCase`, replacing `getCaseBlock`. This follows the repo's existing boundary
  patterns (`shared/json-boundary.ts`, `agent7-narrative-schema.ts`).
- **Benefit:** removes an estimated ≥110 of 155 `any` and ≥50 of 110 casts, and about 100 coercion lines. The
  harness becomes a faithful net.
- **Verification:** enum coercion changes behaviour only on malformed enums. Make it warn-only first (R1), with a
  counter; promotion per ADR-0011.
- **Relates to:** A5-13, cross-area `CaseData = any` (§10).

### A5-05 — Move the shared contract API and the clue types to leaf modules
- **P1 · lens A · R0 · S**
- **Evidence (MEASURED):** `agent6-run.ts:29-33` and `harness/agent5-direct-llm-check-harness.ts:13-16` import
  `enforceAgent5DeterministicContracts`, `buildStrictPromptFeedback` and `recomputeCoverageSnapshotForAgent6` from
  the Agent 5 *runner* (a worker agent importing another). Clue guardrails live separately in
  `shared.ts:183-560`. `agent5-clues.ts` has fan-in 15: 11 importers are `import type` only
  (`ClueDistributionResult`, `Clue`) and 3 import runtime values (`deriveClueObservable` ×3, `deathMethodTellHints` ×1).
  Agent 9's prose modules therefore depend on the Agent 5 LLM module (jsonrepair, llm-client, story-validation).
- **Proposal:** worker `jobs/clue-contracts/{source-paths,strict-contract,gates,coverage,guardrails}.ts`, imported by
  both runners. `applyClueGuardrails`, `ClueGuardrailIssue` and `InferenceCoverageResult` move out of `shared.ts`.
  In prompts-llm, `types/clue-distribution.ts` holds `Clue`, `RedHerring`, `ClueDistributionResult` and
  `ClueExtractionAudit`, and `shared/clue-observable.ts` holds `deriveClueObservable` and `deathMethodTellHints`.
  `agent5-clues.ts` re-exports them for compatibility.
- **Benefit:** removes the runner→runner edge and turns 15 edges into edges to a leaf. Pure moves.
- **Relates to:** Agent 6 area; S6 (`agent9-prose` extraction) gets fewer forward edges.

### A5-06 — Replace string-matched gate failures with a typed error
- **P1 · lens F · R1 (type) / R2 (new failure-class labels reach canary markers) · S**
- **Evidence (MEASURED, git):** `classifyAgent5FailureClass` (:159-167) matches 5 regexes. Of the throw and
  `failAgent5` sites (:3126-3240, :3489, :3592, :3601, :4032, :4065, :4088-4161, :4241, :4336), step-index,
  cast-path, audit-consistency, time-conflict, culprit-evidence, strict-contract, coverage and guardrail all fall to
  `agent5.unknown_failure`, and "weak elimination" is never thrown any more. The label reaches
  `scripts/canary-loop/validate.mjs:222`. `agent6-run.ts:551-576` branches on `/mechanism visibility gate failed/`
  and `/strict step coverage gate failed/`, messages that commit 2b76cbfa (2026-06-29, A_53 P2) stopped throwing. The
  strict-step fallback and `retryDeterministicContractsWithParityBridge` path there are unreachable.
- **Proposal:** `class Agent5GateError extends Error { gate: Agent5Gate; issues: ClueGuardrailIssue[] }` with a
  string-union `Agent5Gate`. The classifier becomes `gate → class`, and Agent 6 switches on `gate`, so the compiler
  flags dead branches.
- **Relates to:** A5-01 (gate table), Agent 6 area (≈50 dead lines).

### A5-07 — Check/repair pairs re-implement their predicate
- **P2 · lens C · R0/R1 · M**
- **Evidence (MEASURED jscpd + read):** `promoteLateGateCluesToMid` (:3062-3108) says it "mirrors" the selection in
  `checkDiscriminatingTestReachability` (:2544-2552) and `checkMechanismVisibility` (:2566-2581). The code is copied,
  and a 6-line clone also sits in `agent6-run.ts:875`. Other pairs: `checkCastNamePathConsistency`/`repair…`
  (:1371 / :1418, a 17-line clone); `findLockedFactClueTimeConflicts`/`repair…` (:2077 / :1998, 18+11-line
  clones); `checkModelAuditConsistency`/`reconcileModelAudit` (:1584 / :1619); and the strict mapping, direct-culprit
  and late-slot check/ensure pairs (:871-1091 / :1133-1214), which duplicate the early/mid and essential predicates.
- **Proposal:** extract selectors (`selectDiscriminatingTestClues`, `selectMechanismVisibleClues`,
  `castPathBindings`, `lockedTimeFactPairs`) and a declarative `ClueRequirement {id, placement?, criticality?,
  evidenceType?, sourceIn?}` with one `checkRequirement` and one `enforceRequirement`.
- **Benefit:** about −90 lines. A checker and its repairer can no longer drift.

### A5-08 — One way to mint a synthesised clue; derive the timeline once
- **P2 · lens C · R1 · M**
- **Evidence (MEASURED jscpd):** the prelude (normalise timeline, `nextId`, pick template) is a 26-line clone at
  :1853-1871, :2863-2893 and :2989-3013, and again in `agent6-run.ts:988-1012`. Inline id loops sit at :2770-2772
  and `agent6-run.ts:905-910`. Timeline append blocks are repeated at :2667-2671, :2792-2796, :1928, :2965, :3048.
  There are four timeline builders: `extractClues` (`agent5-clues.ts:1409`, drops unknown placements),
  `rebuildClueTimelineFromPlacements` (:831, unknown placements go to mid), `normalizeClueTimeline`
  (`shared.ts:190`) and the incremental appends. Two direct-culprit synthesizers use different ids and wording:
  `ensureStrictDirectCulpritClue` (:901, `clue_culprit_direct_<slug>`, "ties") and
  `synthesizeMissingCulpritDiscriminatingClues` (:1841, `clue_culprit_direct_<n>`, "links"). Two strict-step
  backstops mint the **same id families** (`clue_fp_backstop_step_N`, `clue_fp_contradiction_step_N`):
  `agent5-run.ts:2848` and `agent6-run.ts:982`. The canonical culprit sentence is repeated 3× inside :935-1005.
- **Proposal:** `ClueSetWriter` (`clue-contracts/synthesis.ts`) with `mint(prefix, template, fields)`, where the
  timeline is **computed from placements at read time** (or rebuilt once at commit). One culprit-slot synthesizer.
- **Benefit:** about −110 lines, and the timeline stops being a second copy of `placement`.

### A5-09 — Split `buildCluePrompt`
- **P2 · lens B · R1 · M**
- **Evidence:** `agent5-clues.ts:611-1220`, 610 LOC, cc 102. About 60% of the branches come from the 14 inline
  array normalisations of `fairPlayFeedback` (:1058-1141). The rest are static text blocks (19,620 literal chars
  per metrics).
- **Proposal:** `agent5/prompt-text.ts` (static blocks as constants), `agent5/prompt-sections.ts` (one builder per
  `##` section, 24 sections), `normalizeRetryFeedback(fb): NormalizedFeedback`, and `buildRetryModeBlock`. One
  shared `StrictClueContract` type replaces the five shapes declared 3× (`agent5-run.ts:57-65`,
  `agent5-clues.ts:35-39`, `:55-61`) and the `requiredDirectCulpritClue` literal repeated at `agent5-run.ts:691,
  738, 904, 1157` (jscpd: 13-line clone).
- **Benefit:** cc 102 → max about 15 per builder. Prompt sections become individually testable.
- **Verification:** byte-equality of system/developer/user for the 4 golden CMLs, first call plus each retry shape.

### A5-10 — The prompt asks for output nobody reads; the proactive feedback does nothing
- **P2 · lens I · R2 · S**
- **Evidence (MEASURED, `buildCluePrompt` on the 4 golden CMLs):** the first-call prompt is 30.7–31.8k chars
  (≈ 8k tokens). **`buildAgent5ProactiveFirstPassFeedback`'s fields (targetedClueIds, requiredCluePhrases,
  forbiddenTerms, preferredTerms, :636-678) change zero bytes.** They render only in the retry block, which needs
  violations. The feedback's only effect is making `isFirstAttemptPrompt` (`agent5-clues.ts:1005`) false, which
  suppresses two contract lines (309 chars) — the "CULPRIT-UNIQUE CLUE" and "FIRST-ATTEMPT RED HERRING" contracts.
  Every production caller passes feedback, so those lines never ship. The status contract is restated 11×,
  cast-path binding 7×, discriminating-ID coverage 8× and source legality 8×. 18 lines (1,832 chars) instruct
  `status`/`audit` output. `status` is never read; `audit` is overwritten by `reconcileModelAudit` (:1619) before
  `checkModelAuditConsistency` (:1584) compares it. That check therefore only tests that reconcile ran after the
  last mutation. `inference` and `first_full_reveal_chapter` are requested (:973-976, :1042) but have **no consumer**
  anywhere. `inference` is about 14% of stored clue JSON (1,819–2,243 of 13.4–16.1k chars in the golden bundles).
- **Proposal (owner):** drop the status/audit/inference instructions or wire consumers. State each contract once.
  Delete the proactive feedback, and decide explicitly whether the two first-attempt lines ship. Replace
  `checkModelAuditConsistency` with an assertion.
- **Benefit:** ≈ 3–4k prompt chars and ≈ 500 output tokens per call. This matters most on retries.

### A5-11 — Retries are full, stateless regenerations that lose context
- **P2 · lens I,F · R2 · M**
- **Evidence (INFERRED):** all 7 retry payloads (:3486, :3544, :3678, :3767, :3868, :3962, :4202) omit `lockedFacts`
  and `strictContract`, which only `cluesInputBase` (:3449-3475) carries. The prompt promises a "bounded delta
  repair" and `preserve_clue_ids[]` (`agent5-clues.ts:1145-1207`), but `ClueExtractionInputs` has no prior-output
  field, so the model never sees the clues it is told to preserve. The default-ON red-herring floor (:3868)
  regenerates **the whole clue set** to obtain 2 red herrings, after P8's deterministic suspect backstops
  (:3817), which it discards. P8 is not re-run afterwards. The retry prompt is 33.7–34.8k chars (MEASURED).
- **Proposal:** a targeted `extractRedHerrings(cml, clues)` call, or move the floor to directly after P5. Pass locked
  facts and the strict contract on every call through `regenerate()` (A5-01). ADR-0004: flag and probe.
- **Relates to:** §9.4, §9.5; REVIEW_12 (retry share of prompt volume).

### A5-12 — Memo caches over a mutable CML
- **P2 · lens G · R1 · S**
- **Evidence:** four module-level WeakMaps (:554, :784, :1702, :1741). The first two are keyed on `cml` identity
  while `evidence_clues` is mutated in place. Manual invalidation exists at :2720-2729 and :4179-4180, but
  `remapMissing…` (:476-478, called at :4255) mutates without invalidating, before `enforce` reads the memoised
  strict feedback (:3116). See §9.6.
- **Proposal:** finish all CML mutation (A5-03) before deriving the strict contract. Derive it once into
  `Agent5RunState` and delete the caches and invalidations.

### A5-13 — Dead and vestigial code
- **P2 · lens D · R0 · S**
- **Evidence (MEASURED):** `tsc --noUnusedLocals` flags `WORD_TO_NUM` (:1935-1943, 9 lines; a leftover from the
  removed parser). `recomputeInferenceCoverageForAgent6` (:3284) has 0 callers repo-wide, including tests.
  `RequiredClueSpec.sourceInCML` and `.isDeathMethodTell` (`agent5-clues.ts:280,284`) are written 11× and never
  read; Agent 7 even notes that the tag "does not survive Agent-5's output schema" (`agent7-run.ts:287`).
  `ClueExtractionAudit`, `PointsToCollision` and `PointsToDistinctnessResult` are exported but used only in-file.
  `deriveClueDescription` is used only by tests. `__testables` members never referenced by tests:
  `buildSuspectCoverage`, `sanitizeDiscriminatingEvidenceClueIds`, `detectTemporalLexicalCollision`.
  `fairPlayChecks` is only logged. **Not dead:** the `ctx.agent5*` fields, which `scripts/canary-agent-boundary.mjs`
  reads.
- **Benefit:** about −45 lines.

### A5-14 — Vocabulary and tokenizer zoo
- **P2 · lens C · R0 (identical copies) / R1 · M**
- **Evidence:** `escapeRegexNameLiteral` (:1410) ≡ `escapeRegex` (:2399). Six inline split/strip/filter token
  pipelines (:2288-2298, :2367-2374, :2425-2436) exist beside `normalizeTokens` (:185) and `tokenizeDiscriminatingId`
  (:361). Elimination-language regexes: `isEliminationLike` (:245), `inferEvidenceType` (`agent5-clues.ts:144`),
  harness (:310). Step-from-path: `agent5-clues.ts:122`, `agent5-run.ts:852`, :892, harness :293. "Eligible
  non-culprits" ×3 with different case rules (:643, :1643 case-sensitive, :1792). The clue-id regex
  `/^clue_[a-z0-9_-]+$/i` appears at `agent5-run.ts:157`, `agent5-clues.ts:1248`, `agent6-run.ts:1153`,
  `mystery-orchestrator.ts:339`, `agent4-revision.ts:723,731`, and `post-pass-polish.ts:45` **without the hyphen**.
  The fixed slot ids appear in `agent5-clues.ts:621-643` and `agent6-run.ts:157-166`.
- **Proposal:** `clue-contracts/text.ts` (tokens, name matching, escape) and one exported `CLUE_ID_RE` and
  `AGENT5_FIXED_SLOT_IDS`.

### A5-15 — Two derivations of "which clues must exist"
- **P2 · lens C,E · R2 · M**
- **Evidence:** `generateExplicitClueRequirements` (`agent5-clues.ts:291-492`, 202 LOC) against `deriveClueSpec`
  (`packages/clue-spec/src/derive.ts:74`), which calls itself "the authoritative, typed promotion of" it. It is shadow
  only (`mystery-orchestrator.ts:821`, `AGENT5_DERIVE_SHADOW` ON). They already diverge: clue-spec has
  flaw/clincher/red-herring slots; Agent 5 has premeditation, unique-means and first-pass chain requirements.
  `extractKeyTerms` and `inferCategory` exist twice with different stop-lists and defaults ("testimonial" against
  "physical").
- **Proposal:** make the prompt checklist a projection of `ClueSpec`, with the prompt-only extras as extra slot
  kinds, and carry slot ids (for example `slot_method_evidence`) into the output. Agent 7 then stops re-deriving
  the death-method tell by token matching. This is the clue-spec README's ladder step 1.

### A5-16 — Prefix-cache ordering (P3 · I · R2 · S)
The volatile `## CML Summary` opens the developer message; ≈ 9k chars of static contract text follow it. Moving the
static text first lets a cross-run prefix cache. At one call per run on the design tier this saves well under
$0.01 per run. It is honest P3, and worth doing only together with A5-09.

### A5-17 — Compute (P3 · H)
The suspect-coverage, overlap and fuzzy-coverage scans are O(clues × steps × tokens) over about 20 clues. The A_53
P10 memo caches save milliseconds against a ~30 s LLM call. Negligible. Remove the memos (A5-12) rather than
optimise.

## 4. Target structure

```
apps/worker/src/jobs/agents/agent5/
  index.ts          runAgent5 coordinator                 ~200
  state.ts          Agent5RunState, config resolution      ~60
  llm.ts            extract/regenerate, cost & attempts    ~90
  phases/{first-pass,guardrail-gate,coverage-gate,suspect-gate,red-herrings,evidence-ids,step-coverage}.ts  ~650
  score.ts          computeAgent5PhaseScore (pure)         ~110
apps/worker/src/jobs/clue-contracts/        (shared by Agent 5, Agent 6, harness)
  gates.ts          gate table, runGateSequence, enforce…  ~250
  strict-contract.ts build/check/enforce requirements      ~350
  coverage.ts       inference/suspect/DT/mechanism checks  ~400
  synthesis.ts      ClueSetWriter + synthesizers           ~350
  red-herring-overlap.ts                                   ~250
  clue-namespace.ts evidence-ID scoring/reconcile          ~150
  locked-fact-time.ts                                      ~130
  text.ts           tokens, names, era time, escape        ~180
  guardrails.ts     (from shared.ts)                       ~130
packages/clue-spec/src/source-paths.ts     one vocabulary  ~150
packages/prompts-llm/src/
  types/clue-distribution.ts · shared/clue-observable.ts   ~130
  agent5/{prompt-text,prompt-sections,requirements,parse,extract}.ts  ~1,250 (from 1,479)
```

Net for P1+P2 is about **−1,000 lines** (≈ 5,950 → ≈ 4,950 across both files' successors). No function exceeds
about 150 LOC or cc 25, down from max cc 133/102.

## 5. Suggested sequence

1. **Nets first:** golden prompt snapshots and the scripted-LLM `runAgent5` harness (§7).
2. A5-13 dead code; A5-05 moves (types leaf, `clue-contracts/`), R0.
3. A5-14 identical-copy merges (escape, id regex constant), R0.
4. A5-06 typed gate error (keep the old labels), then A5-01 state object + `regenerate()` + phase extraction, R1.
5. A5-01 gate table shared by P11 and `enforce`; A5-07 selectors; A5-08 `ClueSetWriter`, R1.
6. A5-02 step 1 source-path table (verdicts preserved); A5-03 shared scorer; A5-12 memo removal, R1.
7. A5-04 parse-boundary normaliser (warn-only) + typed case view; A5-09 prompt split (byte-equal), R1.
8. Owner and R2: §9.1 meridiem design, `death_method` legality, evidence-ID policy, A5-10/A5-11/A5-15 prompt changes
   behind flags.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `AGENT5_RED_HERRING_FLOOR` | ON | `agent5-run.ts:90` (`assessRedHerringFloor`, :3843) | Add. 5 "live, unconfigured"; Add. 6 fixed 2026-08-03, **unprobed** | Full-set regeneration placed after the P8 backstops (A5-11) |
| `AGENT5_STRICT_PROMPT_CONTRACTS` | ON | `agent5-run.ts:172` (:3349) | Add. 5 "live, unconfigured" | Gates only the *prompt* channels. `enforce` (:3116) and Agent 6 (:382) apply the contract regardless, so the OFF arm guarantees the synthesis floor |
| `AGENT5_ENABLE_LLM_RETRIES` | OFF | `agent5-run.ts:180` (:3320) | Add. 5 default OFF, mode-valued | Gates 6 retry branches (:3483, :3541, :3649, :3751, :3946, :4194), ≈ 350 lines dead at default. Retiring them is R2 (ADR-0011) |
| `AGENT5_DERIVE_SHADOW` | ON | `mystery-orchestrator.ts:822` | Add. 5 "live, unconfigured" | Shadow telemetry for A5-15 |

## 7. Safety net

**Existing tests:** `apps/worker/src/__tests__/agent5-run.test.ts` (1,635 lines, `__testables`, and `enforce…` on
fixtures), `agent5-red-herring-floor.test.ts`, `jobs/agents/__tests__/locked-fact-time-transposition.test.ts`,
`agent6-run-flow.test.ts` (mocks `extractClues`), and `packages/prompts-llm/src/__tests__/agent5.test.ts`,
`agent5-clues.test.ts`, `agent5-clue-restructure.test.ts`, `agent2b-8-prompt-eval.test.ts`.
**Gaps:** no test drives `runAgent5`; phase ordering (for example, the floor discarding the backstops) is
unpinned. No byte-level prompt snapshot. The meridiem guard's positive case is untested, which is how §9.1
survived. The Agent 9 replay harness hydrates clue artifacts and does not run Agent 5, so it is **not** a net here.
**Write first:**
(1) golden prompt snapshots — system/developer/user for the 4 `eval/golden` CMLs, first call plus red-herring,
coverage and ID-contract retry shapes;
(2) `runAgent5` characterisation with scripted `extractClues` responses (mirroring `agent6-run-flow.test.ts`) for
clean, 0 red herrings, uncovered suspect, missing evidence IDs, invalid paths and time conflict, asserting
`ctx.clues`, warnings, errors, phase score and the `agent5*` fields;
(3) `enforce…` golden output on the 4 bundle clue sets;
(4) a failing-by-design test for AM/PM mismatch.

## 8. What NOT to refactor

- The deterministic synthesizers and repair-not-abort residuals (A_53 P2, RC3.1, X86): these are ADR-0003/0007
  floors. Merge their bodies, but keep them.
- The **absence** of red-herring synthesis (:3835-3839, a deliberate anti-template decision).
- X86's literal-string transposition condition (:1985-1996, "a detector may guess; a repairer may not").
- `valueAppearsInText`'s whole-phrase rule (:221-243) and `nameAppearsInText`'s surname rule (A_53 P4).
- The truncation detection and single retry in `parseClueJsonContent`/`extractClues` (run a3c2973f).
- The re-reconcile after the cast-path repair (:3143, :4107) — until A5-10 removes the audit altogether.
- The ordering "sanitize → prune → abort" for red-herring overlap.

## 9. Incidental defects

1. **AM/PM guard dead since 2026-08-21 — HIGH, MEASURED.** `agent5-run.ts:1971` contains literal **0x08 backspace
   bytes** where `\b` was intended (`/^H(am|pm|a.m.|p.m.)^H/i`; `grep -P "\x08"`). Commit 51db0d1a replaced
   `/\b(am|pm|a\.m\.|p\.m\.)\b/i`, probably by passing it through a JS string, which also dropped the `\.` escapes.
   `statesExplicitMeridiem` is false for every real text. A probe on the built code — fact `"7:15 pm"` against clue
   "a quarter past seven" — gives 0 violations, where the old predicate would flag the ambiguity. The skip in
   `repairLockedFactClueTimeTranspositions` (:2046) is also inert. **Do not simply restore `\b`:** with word
   boundaries, the English verb "am" ("I am certain…") would trigger aborts. It needs a numeric-context regex (R2).
   The same corruption appears harmlessly in a comment at `packages/cml/src/__tests__/case-time-arithmetic-x61.test.ts:53`.
2. **Agent 5 cost double-counted — HIGH, INFERRED.** `extractClues` returns the cumulative per-client total
   (`agent5-clues.ts:1435-1436`). `runAgent5` does `+= clues.cost` after every call (:3495, :3583, :3687, :3775,
   :3896, :4001, :4228), where `agent6-run.ts:1621,1881` overwrites ("A_53 P3: cumulative … overwrite, not +=").
   With two calls (for example the default-ON floor), c1 + c2 is reported as 2·c1 + c2, and it flows into
   `totalCost` (`mystery-orchestrator.ts:1645`). One fix, two sites, one wired.
3. **`CASE.death_method` prompt-legal, worker-illegal — HIGH, MEASURED** (A5-02).
4. **Retries drop `lockedFacts` and `strictContract` — HIGH, INFERRED** (A5-11). This includes the default-ON
   red-herring floor, whose regenerated clues never see the Pillar 1 locked facts.
5. **The floor discards P8's suspect backstops, and P8 is not re-run — MEDIUM-HIGH, INFERRED** (:3817 then :3868).
   Residual gaps surface only as coverage *warnings*.
6. **Stale memo after remap — MEDIUM, INFERRED.** After `remapMissing…` rewrites `evidence_clues` (:4255), the
   memoised `requiredIdToSourceMappings` still names the old ID. `applyStrictPromptContractRepairs` (:1103-1111)
   then clones a clue under the missing ID, which is the fabrication A_61's purge exists to prevent.
7. **Gate and prompt read different locked facts — MEDIUM.** The prompt uses `ctx.lockedFactRegistry` (primary
   device, wordified, article-stripped, plus case facts). The gates use raw `hardLogicDevices.devices.flatMap(lockedFacts)`
   (:4133-4137, `agent6-run.ts:486`), from all devices, unnormalised. The transposition repair's `clueText.includes(value)`
   can miss article-stripped wording and throw. Also, `[]` from device-less facts disables the `CASE.locked_facts`
   fallback (:2007-2011).
8. **Agent 6 dead branches — HIGH, MEASURED via git** (A5-06).
9. **Coverage snapshots diverge — LOW-MEDIUM.** `buildCoverageSnapshot` (:3610) omits `checkMechanismVisibility`;
   `recomputeCoverageSnapshotForAgent6` (:3291) includes it (since e8a115b5). `ctx.allCoverageIssues` depends on
   which agent wrote last.
10. **No enum validation at parse — LOW-MEDIUM.** A capitalised `"Early"` is dropped from `clueTimeline` and handled
    inconsistently (exact comparisons at :2532 and :2591, lower-cased at :3066). `buildSuspectCoverage` uses
    case-sensitive `=== "eligible"` (:1644) where the other two bodies lower-case.

## 10. Cross-area observations

- **jscpd skipped every file over 1,000 lines — MEASURED.** Its default `--max-lines 1000` means `data/duplication.md`
  never scanned the 21 largest files: `agent9-run.ts`, `generate.ts`, `agent5-run.ts`, `agent6-run.ts`,
  `agent7-run.ts`, `mystery-orchestrator.ts`, `agent5-clues.ts`, and others (largest scanned: 993 lines). Re-running
  with `--max-lines 100000` over agents plus prompts-llm plus clue-spec finds 233 clones / 1,962 lines. Other areas'
  "no clones" claims for big files are unsupported.
- `CaseData = any` (`packages/cml/src/index.ts:105`) causes 76 inline `?.CASE ??` unwraps in the agents scope and 10
  named `caseOf`/`unwrapCase`/`getCaseBlock` bodies. One typed case view is a synthesis-level P1.
- "Cumulative byAgent cost used as per-call cost" appears in about 15 prompts-llm agents. Only some callers take
  deltas (`agent3b-run.ts:453`, `agent2c-run.ts:322`). Audit every `+= result.cost`.
- String-matched error classification between agents (A5-06) is likely elsewhere too; grep `/… gate failed/i`.
- The runner shape — closure state, a copy-pasted retry block per gate, check/repair/re-check triplets, and a
  hard-coded phase score — matches `runAgent6`, `runAgent7` and `runAgent9`, so one "phase + state + regenerate"
  pattern could serve all four.
- `placement` is overloaded: to Agent 5 it means act (early = Act I); to Agent 9's `chapterClueAppearsEarly`
  (`clue-validation.ts:893`) it means the first 25% of the chapter.
- Control-character corruption (§9.1) — worth a repo-wide pre-commit check (`grep -P "[\x00-\x08\x0b\x0c\x0e-\x1f]"`).

## 11. Open questions for the owner

1. Should `CASE.death_method` be a legal `sourceInCML` in the worker (A_67 FIX-2's intent)?
2. What should the AM/PM guard detect, given that a naive fix aborts on "I am"?
3. Keep asking the model for `status`, `audit` and `inference`, or wire consumers? Should the two suppressed
   first-attempt contract lines ship?
4. Red-herring floor: a targeted red-herring-only call, or move the floor before the deterministic phases?
5. What is the one evidence-ID policy (≥1 / back-fill to 3 / ≥2), and at which stage is it applied once?
6. The six `AGENT5_ENABLE_LLM_RETRIES` branches (≈ 350 lines) have not run at default since the deterministic mode
   became default. Retire them (needs ADR-0011 evidence), or keep them as a measured lever?
7. When does `@cml/clue-spec` become the source of the prompt checklist (A5-15)?

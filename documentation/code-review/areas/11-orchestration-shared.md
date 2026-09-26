# 11 — Orchestration & shared agent infrastructure (+ cross-agent survey)

**Scope:** `apps/worker/src/jobs/mystery-orchestrator.ts`, `agents/shared.ts`, `agents/index.ts`, `packages/prompts-llm/src/{index,types,retry-protocol,asset-library,world-state,story-title}.ts` and every non-test file under `prompts-llm/src/{types,shared,utils,contracts,constants}/` — 34 files, 7,208 lines, 5,156 code lines. Cross-agent survey: the top level of all 14 `runAgentN` functions and all 31 LLM call sites under `apps/worker/src/jobs` + `packages/prompts-llm/src`.
**Read:** every line of the 34 files. For the survey, each `runAgentN` read top to bottom; the internals of 5, 6, 7 and 9 were outlined, not read line by line. · **Written:** 2026-09-25
**Finding prefix:** ORC · **Method:** [RUBRIC.md](../RUBRIC.md)

## 1. What this area does

- **Entry:** `generateMystery(client, inputs, onProgress, onArtifact)` (`mystery-orchestrator.ts:862`). Called by the API (`apps/api/src/server.ts:711`), `resume-run.ts` and `jobs/index.ts` (the last through `generateMysterySimple`, `:2031`).
- **Setup (`:869-1022`):** flag-capability check, `ENABLE_SCORING` → aggregator/repository/loggers, run fingerprint, `reportProgress`, `savePartialReport`, `markStaleInProgressReport`, shutdown-flush registration.
- **Init-time derivations (`:1026-1085`):** location preset, `normalizePrimaryAxis`, `deriveHardLogicDirectives`, seed corpus (memoised), novelty constraints plus the cross-run ledger and cell scheduler.
- **Context (`:1088-1128`):** one `OrchestratorContext` (`shared.ts:216`, about 60 fields) that every `runAgentN(ctx)` mutates in place.
- **Resume (`:1136-1194`):** `applyResumeBundle`, a `ResumeSkipTracker`, and a local `stage(field, run)` guard.
- **Stage sequence (`:1196-1593`):** 1 → 2 → 2e → 3b → 3(+4, 8) → novelty gate → 5 → clue-spec shadow → 6 → fair-play gate → early structural abort → 2b/2c/2d (sequential, or in parallel under `AGENT_PROFILES_PARALLEL`) → CML validation gate (evidence back-fill) → 6.5 → character bundle → DNS preflight → 7 → 7.5 → locked-fact gate → DNS preflight → 9. After each stage, `onArtifact(name, ctx[field])`.
- **Post-run (`:1596-1790`):** degraded-resume warnings, rubric judge (`runRubricScoring`, `:650`), content-filter tally, report finalisation, status, novelty ledger, corpus snapshot, result.
- **Failure (`:1825-2019`):** aborted-prose diagnostics, partial report with aborted metadata, `partialArtifacts` attached to the thrown error.
- **`shared.ts`:** the context type, run utilities, `executeAgentWithRetry`, axis and mechanism-family derivation, clue guardrails (used by 5 and 6), outline guardrails (used by 7 and 9), novelty constraints.
- **prompts-llm infrastructure:** the root barrel (362 names), JSON boundary kit, clearance, death-method and temporal vocabularies, model tiers, seed loader, name generator, `withValidationRetry`, the prose request and obligation contracts, the asset library, the world-state ledger, arc-position constants, and the Agent 9 retry protocol.

## 2. Verdict

The orchestrator is readable and every one of its gates is deliberate (ADR-0002, ADR-0003). Its size comes from cross-cutting concerns added one commit at a time, not from new stages. 12 of the last 16 commits touching it added resume, parallelism, diagnostics or telemetry around the same 14 stage calls (MEASURED, `git log`). The larger cost is spread across the agents, and it is the cross-agent survey's main result: the skeleton *call → parse → validate → retry with feedback → score → account cost → persist* exists as 14 hand-written variants. They contain 4 JSON-parse ladders, 3 truncation policies, 3 definitions of "the cost of a call", 6 feedback-injection channels and 8+ boolean env-flag parsers with different accepted spellings. Each of these is a two-body concept of exactly the kind the earlier audits found defects in, and this review found live defects in several of them (§9). The single most valuable change is one typed `callLlmJson()` + `runStage()` pair built on `executeAgentWithRetry`, together with a `RunConfig` resolved once at run start (ORC-02, 03, 04, 05). Converting `generateMystery` into a stage table (ORC-01) is then mostly mechanical, because the context object already carries 18 of the 35 bindings its phases share.

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| ORC-01 | P1 | B | `generateMystery` (1,164 LOC, cc 160) → a stage table plus 5 phase modules | R1 | L (3 d) | −250 |
| ORC-02 | P1 | C | Scoring/no-scoring fork and copy-pasted generator inputs in 9 runners → `runStage()` on `executeAgentWithRetry` | R1 | M | −300 |
| ORC-03 | P1 | C | "Cost of a call" has 3 definitions; 16 of 18 accumulation sites add a cumulative total to itself | R1 (numbers in the report change) | M | −60 |
| ORC-04 | P1 | E/F | JSON boundary: the kit's `guardedJsonrepairParse` has 0 production callers; 4 ladders, 3 truncation policies → `callLlmJson()` | R1 | M | −180 |
| ORC-05 | P1 | G | 82 env flags read through 8+ parsers with different vocabularies → one typed `RunConfig`, resolved at run start and snapshotted to the report | R1 (vocabulary unification R2) | M | −80 |
| ORC-06 | P2 | A | `shared.ts` is a 7-responsibility grab-bag with fan-in 18 and closes an 18-file type cycle → split | R0 | M | 0 |
| ORC-07 | P2 | C | Rubric scoring, the context initialiser and prose assembly each exist twice (orchestrator vs `agent9-replay.ts`) and have drifted | R1 (replay R2) | S | −70 |
| ORC-08 | P2 | C | "Arc position of chapter N": 7 bodies, 4 formulas, fed into the same prompt | R1 → R2 | M | −40 |
| ORC-09 | P2 | D | Compiler-proven and grep-proven dead code in scope (11 items) | R0 | S | −60 |
| ORC-10 | P2 | D | Root barrel: 215 of 362 names never imported through it; append-only churn (44 commits) → subpath exports | R0 | S | −200 |
| ORC-11 | P2 | F | `executeAgentWithRetry` swallows its own abort (MEASURED); 6 stacked retry layers | R2 | S | −15 |
| ORC-12 | P2 | G | Four "one run per process" singletons, while the API permits concurrent runs → per-run `RunTelemetry` | R1 | M | +20 |
| ORC-13 | P2 | C | Small shared concepts re-implemented: clue-id regex ×6, grade ladder ×4, `simpleHash` ×4, `LockedFact` ×5 shapes, Agent 5's parse guard | R0/R1 | S | −50 |
| ORC-14 | P2 | I | An explicit `model:` from `resolveDesignModel()` silently disables the per-agent router for 8 call sites | R2 | S | −10 |
| ORC-15 | P3 | E | `OrchestratorContext` typing: `any` fields, `stage: any`, write-only fields set through casts | R0 | S | −10 |
| ORC-16 | P3 | H | `buildAssetLibrary` ("call once per run") is built at 3 sites, per batch attempt; 2 of its 4 parameters are never read | R1 | S | −15 |

### ORC-01 — `generateMystery` becomes a stage table with explicit phases
- **P1 · lens B · R1 · L (3 days)**
- **Evidence (MEASURED):** `mystery-orchestrator.ts:862-2025` is 1,164 LOC at cc 160 (metrics.md). It is the #3 hotspot: 55 commits, 13,237 lines churned. A TypeScript-AST walk (scratchpad `closure.cjs`) finds **112 named bindings** in the function's own scope. After removing same-name false positives (`errorMsg`, `err`, `e`, `logsDir`), **35 bindings cross a phase boundary**:
  - **18 are local aliases of fields that are also on `ctx`:** `client`, `inputs`, `runId`, `projectId`, `startTime`, `agentCosts`, `agentDurations`, `warnings`, `errors`, `enableScoring`, `scoreAggregator`, `retryManager`, `reportRepository`, `scoringLogger`, `runLogger`, `reportProgress`, `savePartialReport`, `proseScoringSnapshot`.
  - **5 only feed the ctx literal:** `locationSpec`, `primaryAxis`, `initialHardLogicDirectives`, `seedEntries`, `noveltyConstraints`.
  - **12 are owned by the orchestrator alone:** `ctx`, `onArtifact`, `markStaleInProgressReport`, `skippedStages`, `resumeApplication`, `skipTracker`, `stage`, `noteDegradedResumeSignals`, `scoringReport`, `status`, `totalCost`, `totalDurationMs`.
  - Other structural facts:
    - The 14 stage calls are hand-written lines, each followed by `if (onArtifact && ctx.X) await onArtifact("name", ctx.X).catch(() => {})` (`:1197-1593`).
    - Those 14 artifact names are a second copy of the table `resume-hydration.ts:61` declares to be "ONE table, deliberately".
    - 14 of the file's 33 `catch` occurrences are these silent `.catch(() => {})`. A failed artifact write, which is the resume checkpoint, leaves no warning (ADR-0010).
    - Agent 7.5 (`:1572`) and the parallel profile branch (`:1282-1333`) bypass `stage()`, each for a documented reason.
- **Proposal:**
  - **Stage table.** Add `jobs/pipeline/stages.ts` with a declarative table: `{ id, field: ResumeStageField, artifact: ResumeArtifactName, run: (ctx) => Promise<void>, resumable: boolean, group?: "profiles", after?: Gate[] }`. It is derived from `RESUME_FIELD_BY_ARTIFACT`, so artifact names exist once.
  - **`runPipeline(state, STAGES)`** loops over the table. It applies resume skip, `emitArtifact` (which warns on failure instead of swallowing), timing, and concurrency for groups flagged parallel, reusing the existing isolate/merge code.
  - **Gates become named pure functions** in `pipeline/gates.ts`: `noveltyBindingGate`, `fairPlayBindingGate`, `earlyStructuralAbort` (already pure), and `cmlPreProseGate` (the evidence back-fill, `:1340-1525`, about 185 lines).
  - **Phase modules:** `pipeline/init.ts` (setup and derivations → `createOrchestratorContext`), `pipeline/finalize.ts` (`:1596-1790`: rubric, content filter, report, status, ledger, snapshot), `pipeline/abort.ts` (`:1826-2019`: aborted-prose summaries, partial report, `partialArtifacts`).
  - **State:** the only state object needed beyond `ctx` is `RunState { ctx; resume: { tracker, skipped, application }; emitArtifact; lifecycle: { markStale } }`. Every phase reads `ctx` instead of the 18 aliases.
  - The stage **order** is untouched (ADR-0002). It is simply written once, as data.
- **Benefit:** `generateMystery` becomes a coordinator of about 150 lines at cc ≤ 20. The 14 artifact lines and 14 silent catches become one loop; the second copy of the artifact-name table disappears; each gate becomes unit-testable. Estimated net −250 lines (the removed aliases and repetition outweigh the new table).
- **Verification:** first write the characterisation test in §7(a). It asserts call order, `onArtifact` sequence, warnings, gate throws and result shape for a fresh run, a resumed run (with R9 on and off) and each gate firing, then compares byte-for-byte before and after. The existing `resume-parallel-profiles.test.ts` and `mystery-orchestrator-fixes.test.ts` keep passing.
- **Relates to:** ORC-05, 06, 07, 12, 15.

### ORC-02 — One `runStage()` for the 9 runners that share a skeleton
- **P1 · lens C · R1 · M**
- **Evidence (MEASURED, by reading):**
  - **The fork.** Agents 1, 2, 2b, 2c, 2d, 2e, 3b, 6.5 and 7 all contain the same fork: `if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) { executeAgentWithRetry(12 positional args) } else { same generator call without feedback; manual cost and duration }`. Examples: `agent1-run.ts:26-75`, `agent2b-run.ts:28-76`, `agent65-run.ts:22-89`.
  - **Copies of the same generator input literal per runner:** 1 ×3, 2 ×3, 2b ×3, 2c ×3, 2d ×2, 2e ×2, 3b ×3 (jscpd: 32 duplicated lines), 6.5 ×2, 7 ×8 (the `formatNarrative` sites at `agent7-run.ts:1732, 1828, 1895, 1991, 2089, 2173, 2225, 2326`).
  - **The copies drift:**
    - Agent 2's schema-repair re-call drops `characterGenders` (`agent2-run.ts:835` against `:706` and `:756`).
    - Agent 6.5's non-scoring branch drops `onProgress`.
    - Agent 6.5 ignores `retryFeedback` altogether (`_retryFeedback`, `:26`).
  - **Feedback reaches the prompt through 6 channels:** appended to `tone` (1, 2, 2b, 2c), to `tone` AND `theme` (2e and 3b, so the guidance is printed twice), `qualityGuardrails` (2d, 7), `fairPlayFeedback` (5, 6), `culpritExclusionNames`/`noveltyConstraints` (3), or ignored (6.5).
  - **Leftover scaffolding:** `retriesEnabled` is declared and never read in runAgent1/2/7 (`tsc --noUnusedLocals`); `appendRetryFeedback` is imported and unused in 2d and 6.5.
  - **Who uses the shared helper:** `executeAgentWithRetry` is used by those 9. Agents 3, 5, 6, 7.5 and 9 re-implement scoring by hand-building `PhaseScore`s (`agent3-run.ts:378`, `:661`; `agent5-run.ts:4375`; `agent6-run.ts:1675`).
- **Proposal:**
  - `agents/stage-runner.ts`: `runStage<T>(ctx, spec: { agentId, phase, costKey, generate: (feedback?) => Promise<{result: T; cost}>, score?: (r) => Promise<PhaseScore>, normalize?: (r) => T, validate?: (r) => ValidationResult, abortCritical? })`.
  - It performs the fork once. When scoring is off it calls `generate(undefined)`. It records cost and duration and applies `normalize` to **every** attempt, which is the invariant Agent 7 enforces by copy-paste (`agent7-run.ts:1913-1926`).
  - Each runner gets one `buildInputs(feedback?: string)` so the generator input literal exists once.
  - One `injectFeedback` policy per generator, declared next to the generator. Changing *where* the feedback lands is R2 (prompt bytes change); keeping each agent's current channel inside `buildInputs` is R1.
- **Benefit:** about 110 lines of duplicated input literals, 108 lines of non-scoring branches and about 60 lines of 12-argument call boilerplate go, against about 90 new shared lines: net about −300 across 9 files. Removes the input-drift class (three live instances above). Scoring with retry becomes available to 3, 5 and 6 without each writing its own.
- **Verification:** prompt byte-equality per agent on fixed inputs, scoring off and on, using a stub client that records `messages`. A direct unit test of `executeAgentWithRetry` (it has none today; §7).
- **Relates to:** ORC-03, 04, 11, 13; the agent-specific area reviews.

### ORC-03 — The cost of a call: 3 definitions, 18 accumulation sites
- **P1 · lens C · R1 · M**
- **Evidence (MEASURED, by reading):**
  - **13 generators return a cumulative per-label total** as `cost`, via `client.getCostTracker().getSummary().byAgent[LABEL]` (for example `agent1-setting.ts:327`, `agent5-clues.ts:1436`, `agent7-narrative.ts:907`).
  - **`designCast` returns `cost: 0` always** (`agent2-cast.ts:947`).
  - **The 3b judge, the 2c/3b gate loops, Agent 7.5 and Agent 9 compute before/after deltas.** Agent 9 alone has 24 `getTotalCost()` calls.
  - **The cumulative total is then summed again at 18 sites.** Examples: `shared.ts:735` (`totalCost += cost` per retry), `agent1-run.ts:169`, `agent2b-run.ts:117`, `agent5-run.ts` ×7, `agent7-run.ts` ×6.
  - **The trap was found three times and fixed locally in 4 styles:** A_53 P3 "overwrite, not +=" (`agent3-run.ts:342`, `agent6-run.ts:1621`); `perCallCostDelta` (`agent6-run.ts:1477`); inline deltas (`agent2c-run.ts:320`, `agent3b-run.ts:451`).
  - **The client already computes the true per-call cost** (`client.ts:388` `trackCost`) and discards it: `ChatResponse` has no `cost` field.
- **Proposal:** add `cost` to `ChatResponse` (llm-client, additive). `callLlmJson()` (ORC-04) returns the marginal cost. Generators return the per-call sum. Delete `perCallCostDelta` and the 12 before/after pairs in Agent 9 over time.
- **Benefit:** removes one defect class; about −60 lines. `agentCosts` in the report become correct on retry paths (ADR-0010 says `total_cost` is not in the contract, but per-phase costs feed `upsertPhaseScore`).
- **Verification:** unit-test cost sums with a stub tracker. On the default path, where no LLM retries run, the before/after reports are identical. Only retry paths change, so the owner should sign off on that report delta.
- **Relates to:** ORC-02, 04; Agent 5, 6, 7 reviews.

### ORC-04 — One JSON boundary: `callLlmJson()`
- **P1 · lens E/F · R1 · M**
- **Evidence (MEASURED, grep):**
  - **The kit.** `shared/json-boundary.ts` calls itself "the one rule, everywhere". `guardedJsonrepairParse` has **0 production callers** (export-usage: test-only). `looksTruncatedJson` is used by 5 generators (3, 6, 6.5, 2d, 2e).
  - **Four ladders:**
    - (a) 4 steps, strict → guard → jsonrepair → brace-extract → repair(candidate): `agent3-cml.ts:1441-1477` and `agent6-fairplay.ts:91-125` (guarded); `agent4-revision.ts:1028-1060` (**no guard**).
    - (b) strict → jsonrepair: 2d, 2e, 6.5 (guarded); 2b `:292`, 2c `:390` (**no guard**); `agent9-prose/sanitization.ts:92` (**the prose payload, no guard**).
    - (c) Agent 5's own `parseClueJsonContent` (`agent5-clues.ts:1233`): the original the kit was extracted from, never migrated back, which flags truncation and retries.
    - (d) strict only: 1, 2, 8, blind reader, 3b judge, 7.5 (`agent75-run.ts:134`), 4-patch, regen-llm, repair, full-story diagnostic.
  - **Truncation policies:** refuse by tail character; refuse on `finishReason === "length"` (Agent 7, `agent7-narrative.ts:898`); flag and retry (Agent 5); none.
- **Proposal:** `prompts-llm/src/shared/llm-json.ts`: `callLlmJson<T>(client, { messages, model?, maxTokens, jsonMode | jsonSchema, logContext, parse?: (unknown) => T })`. It returns `{ data: T | undefined, raw, cost, truncated, repaired, finishReason }`. It checks `finishReason` first, then ladder (a) guarded, then a typed boundary coercer (the `agent7-narrative-schema.ts` pattern).
  - Migrate the unguarded sites first: 2b, 2c, 4-revision, prose. Adding the guard there is **R2**, because a payload that is repaired today would be refused and retried.
  - Migrate the guarded sites as R1.
- **Benefit:** about −180 lines (4 ladders become one). The phantom-structure defect class (run a3c2973f) closes at the 4 boundaries still open. Every call site gains the same telemetry.
- **Verification:** golden tests feeding the same corpus of raw payloads (valid, sloppy, truncated, fenced) through old and new parsers. Existing `json-boundary` tests.
- **Relates to:** ORC-02, 03, 13.

### ORC-05 — A typed `RunConfig`, resolved once at run start
- **P1 · lens G · R1 (vocabulary unification R2) · M**
- **Evidence (MEASURED):**
  - **Counts.** The metrics tool reports 82 distinct flags and 108 reads in agent scope. My comment-stripped scan finds 98 names at 127 sites, including `env.X` parameters. The orchestrator makes 14 reads: `RUBRIC_JUDGE_MODEL` 4× in one function (`:701-772`), `AGENT_PROFILES_PARALLEL` 2×.
  - **At least 8 boolean idioms, with different accepted spellings:**
    - `=== "true" || === "1"`, case-sensitive: `mystery-orchestrator.ts:860`, `generate.ts:2157` and 7 more.
    - `.toLowerCase() === "true"` only, so **`ENABLE_SCORING=1` means off** (`:883`) and `ENABLE_PROSE_BLIND_READER=1` means off.
    - `/^(1|true|yes|on)$/i`: 22 sites.
    - `!/^(0|false|no|off)$/i`: default-on flags.
    - `mode && mode !== "off" && !== "false" && !== "0"`, so **`AGENT2_CAST_CHECK=no` turns the check on** (`agent2-run.ts:874`; also 2b, 2c, 2e).
    - `parseBooleanEnv` (17 sites, accepts `y`/`n`).
    - `["1","true","on","enabled"].includes` (`agent6-run.ts:2008`).
    - Per-module tri-state parsers.
  - **This defect class has been paid for before:** X3 (`flag-register-check.mjs`: "`LOG_FULL_PROMPTS_TO_FILE` had four parsers, three of which read `1` as false").
  - **Numeric bounds are parsed twice with different caps.** `AGENT2B_VOICE_MAX_RETRIES` is capped at 3 in `retry-gate-guard.ts:34` but **uncapped** in `agent2b-run.ts:97` (§9).
  - FLAG-AUDIT Addendum 5: "a run's behaviour cannot be reconstructed from its configuration."
- **Proposal:**
  - `apps/worker/src/jobs/run-config.ts` (the worker owns I/O) defines `resolveRunConfig(env = process.env): RunConfig`. It is typed and grouped (`scoring`, `retries`, `models`, `agents.a1…a9`, `novelty`, `rubric`, `diagnostics`) and built on one `envFlag(name, { default, accept })` parser.
  - It is called **inside `generateMystery` at t=0**, after dotenv has loaded, never at module load (ADR-0004). It is stored on `ctx.config`.
  - It is written to the report as a `run_config` diagnostic containing effective values, *including defaults*. That answers FLAG-AUDIT's reconstruction defect directly.
  - `retry-gate-guard` and `flag-preflight` read `RunConfig` instead of re-parsing.
  - prompts-llm generators receive the relevant slice as a parameter. `agent9/flags.ts` (S4 tranche 1) is the precedent and becomes the Agent 9 slice.
  - The `module-const-flag-check.mjs` rule still holds: the config is a value, not a module const.
  - Preserve each flag's current vocabulary inside `accept` (R1). Unifying vocabularies is a separate R2 step with a warning on unrecognised values.
- **Benefit:** 8 parsers become 1. Each flag is read once per run, not per call. Runs become reconstructable from the report. The mismatched-cap and "`no` means on" classes close. About −80 lines.
- **Verification:** a table-driven test asserting `resolveRunConfig` reproduces every current getter's result for every value in each vocabulary; `flags:check`; prompt byte-equality on a fixed env.
- **Relates to:** ORC-01, 12, 14; FLAG-AUDIT.

### ORC-06 — Split `shared.ts` and break the type cycle
- **P2 · lens A · R0 · M**
- **Evidence (MEASURED):** `shared.ts` (1,072 lines, fan-in 18, 23 commits) holds 7 responsibilities (symbol → importer map, by grep):
  - context and run types (`:44-350`), used by all;
  - axis vocabulary + `normalizePrimaryAxis` + `deriveHardLogicDirectives` + `FAMILY_AXIS` + `mergeHardLogicDirectives` (`:102-163`, `:352-395`, `:811-1027`), used only by the orchestrator and 3b;
  - clue guardrails (`:442-582`), agents 5 and 6;
  - outline guardrails (`:397-440`), agents 7 and 9;
  - run utilities (`:588-645`);
  - retry and scoring infrastructure (`:647-809`), 9 runners;
  - `buildNoveltyConstraints` (`:1029`), orchestrator only; its field reads are mirrored by `novelty-ledger.ts:213`.
  - The only in-scope import cycle is `shared.ts:42 import type { MysteryGenerationInputs } from "../mystery-orchestrator.js"` (an 18-file type cycle, metrics.md). The cycle is also why `reportProgress` is typed `stage: any` (`:225`).
- **Proposal:**
  - `jobs/run-contract.ts`: `MysteryGenerationInputs/Progress/Result`, `ProgressCallback`, `ArtifactCallback`. Re-export them from the orchestrator so the API import is unchanged.
  - `agents/context.ts`: `OrchestratorContext` + `createOrchestratorContext()` (ORC-07).
  - `agents/stage-runner.ts`: `executeAgentWithRetry`, feedback, honest scorer (ORC-02).
  - `agents/run-utils.ts`: `describeError`, `clearWarningsInPlace`, `applyAbortedRunMetadata`, `delay`.
  - `agents/premise.ts`: axes, directives, merge.
  - Move `applyClueGuardrails` to `agents/clue-guardrails.ts`, `buildOutlineRepairGuardrails` to `agents/outline-guardrails.ts`, and `buildNoveltyConstraints` next to `novelty-ledger.ts`.
  - Keep `shared.ts` as a re-export shim for one release, then delete it.
- **Benefit:** the type cycle is removed. A change to clue guardrails no longer touches the file all 18 importers depend on. `stage` gets a real union type. Net 0 lines (a move).
- **Verification:** `tsc`, `build:all`, `preflight-dist-check`, tests. The metrics tool should report "Cycles… None".
- **Relates to:** ORC-01, 15.

### ORC-07 — Rubric scoring, context init and prose text: each has a second copy in the replay harness
- **P2 · lens C · R1 (replay behaviour R2) · S**
- **Evidence (MEASURED, by reading):**
  - **Rubric scoring.** `agent9-replay.ts:160-185 runRubric` is a second copy of `runRubricScoring` (`mystery-orchestrator.ts:650`) and has drifted. It uses `AZURE_OPENAI_DEPLOYMENT_NAME` and **ignores `RUBRIC_JUDGE_MODEL`**. It calls `scoreStory({prose, cml, judge})` **without** `chapters`, `findUnplanted`, `discriminatingPair` or `noResolutionVerdict`, so the structural verifiers and the deterministic reveal verdict never run on replays. It also writes no `judge_model` record.
  - **Context initialiser.** `agent9-replay.ts:343-415` hand-copies the 40-field ctx literal and casts it `as unknown as OrchestratorContext`, so a new required field is not caught by the compiler.
  - **Prose assembly.** `story-output.ts:33 assembleFullProse` is a byte-identical reimplementation of `assembleScoringChapterTexts(...).join("\n\n")`, kept in line by a comment ("must stay identical to `assembleFullProse` in the orchestrator"). The orchestrator's `assembleFullProse` (`:646`) is dead (`tsc --noUnusedLocals`).
- **Proposal:** extract `jobs/rubric-scoring.ts` (`runRubricScoring` as it is today) and have the replay call it. Add `createOrchestratorContext(base, overrides)`, used by the orchestrator, the replay and tests. Make `story-output.assembleFullProse` delegate to `assembleScoringChapterTexts`.
- **Benefit:** about −70 lines. Replay rubric scores become comparable with live ones; today they come from a different judge scale.
- **Verification:** the orchestrator side is a move (R0/R1). The replay's scores change, which is R2: the owner decides, and the change should be noted in any board that quotes replay rubric figures.
- **Relates to:** ORC-01, 06; Agent 9 area.

### ORC-08 — Arc position: 7 bodies, 4 formulas
- **P2 · lens C · R1 → R2 · M**
- **Evidence (MEASURED, by reading).** `constants/arc-position.ts` holds the vocabulary maps but not the function that computes a position. The seven bodies:
  - **1-based ladder** (`=== total → resolution`): `chapter-obligation-contract.ts:27`, `generate.ts:2330`, `agent9-run.ts:4600`.
  - **0-based ladder** (`chapterStart - 1`; `ci <= 1 → opening`): `prompt-builder.ts:204` (world brief) and `:1613` (`proseArcPosition`).
  - **Normalised thresholds:** `agent7-run.ts:1211 toArcPosition`.
  - **Rounded interpolation:** `story-bible.ts:209 arcPositionFor`.
  - **Where the two ladders disagree.** For 12 chapters: chapter 2 is `opening` on the 0-based ladder and `early` on the 1-based one; chapter 4 is `early` against `first_turn`.
  - **Both ladders feed one check.** The tonal-contrast rule (`obligation-block.ts:822-826`) compares `previousChapterArcPosition` (1-based, from generate.ts) with `currentArcPosition` (0-based, from prompt-builder).
- **Proposal:** `arcPositionForChapter(chapter1Based, total): ArcPosition` plus an `ARC_POSITIONS` tuple, in `constants/arc-position.ts`.
  - Step 1 (R1): merge the three identical 1-based bodies, and the two identical 0-based bodies.
  - Step 2 (R2, flag): pick one formula. Prompt bytes change.
- **Benefit:** 7 bodies → 4 at R1 → 1 at R2; about −40 lines; the mixed-ladder tonal check is removed.
- **Verification:** a parity test that tabulates all 7 bodies over chapters 1..N for N ∈ {8, 10, 12, 16} and documents the divergence before any merge.
- **Relates to:** Agent 7 and 9 areas (§9 defect D5).

### ORC-09 — Dead and vestigial code in scope
- **P2 · lens D · R0 · S**
- **Evidence (MEASURED; `tsc --noUnusedLocals --noUnusedParameters` on the build copy, plus repo-wide grep including scripts and docs):**
  - `mystery-orchestrator.ts:646 assembleFullProse` (unused local).
  - `shared.ts:740` `adapted` is never read, so the `adapted` return field of `scoreOutput` is vestigial in 9 runners.
  - `retriesEnabled` unused in `agent1-run.ts:22`, `agent2-run.ts:687`, `agent7-run.ts:1706`.
  - `appendRetryFeedback` imported but unused in `agent2d-run.ts:14` and `agent65-run.ts:15`.
  - `GROUNDING_PRINCIPLE` (`shared/system.ts:34`): 0 uses outside its declaration and the barrel. It is prompt text never interpolated, so deleting it cannot change a prompt byte.
  - `resolveProseModel`/`resolveBaseModel` (`utils/model-tiers.ts:27`, `:32`): 0 callers. The logic of `resolveProseModel` is re-inlined at `agent9-run.ts:4287`.
  - `migrateNarrativeState` (`types/narrative-state.ts:130`): 0 callers.
  - `lockedThemeFamilies` is written onto ctx through a cast (`agent3b-run.ts:301`) and read nowhere.
  - `buildAssetLibrary`'s `locationProfiles` and `temporalContext` parameters are unused (`asset-library.ts:11-12`).
  - 9 of the 11 `__testables` in the orchestrator (`:2049`) are agent 7/9 functions imported only in order to be re-exported for a test (`agents/index.ts:58-71`).
  - **Correction to the shared data:** `export-usage.md` lists `generateMysterySimple` as unused. It is called at `jobs/index.ts:88` (`jobRegistry` → `runner.ts`).
- **Proposal:** delete the dead locals, parameters and exports (un-export first where the barrel exports them). Point `mystery-orchestrator-fixes.test.ts` directly at `agent7-run.js`/`agent9-run.js`. Replace the inlined prose-model expression with `RunConfig.models.prose` (ORC-05) rather than reviving `resolveProseModel`.
- **Benefit:** about −60 lines, and misleading signatures removed.
- **Verification:** `tsc`, `build:all`, tests, and a repo-wide grep for string or dynamic references (done for every item listed).

### ORC-10 — The root barrel: why it churns, and how to stop it
- **P2 · lens D · R0 · S**
- **Evidence (MEASURED):**
  - `prompts-llm/src/index.ts` has 44 commits, almost all append-only: of the last 30, 27 add 1–12 lines and delete 0–1.
  - The package has no `exports` subpath map. `agent9-prose/index.ts` uses `export *`, but the root **re-lists names explicitly** (`:105`, `:139-199`), so every new Agent 9 function the worker needs requires a root edit.
  - Of the 362 names the root exports, only **145 are imported through `@cml/prompts-llm` by production code**, 2 by tests or examples only, and **215 never** (script with comments stripped; a lower bound on reach, since a name used only through relative imports is correctly counted as never).
  - Two unrelated public `buildRetryFeedback` functions exist: `retry-protocol.ts:171` and `story-validation/retry-feedback.ts:6`.
- **Proposal:** add `package.json` `exports`: `"."`, `"./agent9-prose"`, `"./shared/*"`, `"./contracts"`. The worker imports Agent 9 symbols from `@cml/prompts-llm/agent9-prose`. Remove the 215 never-imported names from the root. Rename the prompts-llm one to `buildRetryPacketFeedback`.
  - This is also the cheapest step toward S6 (the blocked `agent9-prose` package extraction): the entry-point boundary exists before the package boundary does.
- **Benefit:** root barrel from 351 to about 150 lines; the churn source is gone.
- **Verification:** `tsc -b`, `build:all`, `preflight-dist-check` (dist resolution of subpaths).

### ORC-11 — `executeAgentWithRetry` swallows its own abort; the retry layers stack
- **P2 · lens F · R2 · S**
- **Evidence (MEASURED):** a stub probe against the built `dist/jobs/agents/shared.js` with `AGENT_PRE9_ENABLE_LLM_RETRIES=1`, `canRetry → false`, `shouldAbortOnMaxRetries → true`, `abortCritical = true`. It **returned** instead of throwing, and logged `"Setting Refinement: Scoring failed - … all retries are exhausted. Aborting generation … - continuing without retry"`.
  - The cause: the `throw` at `shared.ts:768` sits inside the `try` whose `catch` at `:802` turns every error into "scoring failed". It has been that way since the function was created (`git log -L`, da9756f5).
  - So `abortCritical` (A_53 P2) and `shouldAbortOnMaxRetries` have never had any effect.
  - **Retry layering, per upstream agent:**
    - transport (`chat()` → `withRetry`), plus a circuit breaker for 1, 3 and 3b;
    - the generator's internal loop (`withValidationRetry` in 2b, 2c, 2d, 2e, 3b; hand-rolled in 1, 2, 3, 4, 6.5);
    - the scoring retry (off by default);
    - schema-repair re-calls (1, 2, 7; on by default);
    - gate regeneration loops (2b, 2c, 3b, 5, 6, 7);
    - Agent 9's own.
- **Proposal:** decide the semantics. Under ADR-0003, the honest choice is to delete the unreachable abort and the `abortCritical` parameter, and log exhaustion truthfully. Wrap only the call to `scoreOutput` in the `try`. Document the layering in `stage-runner.ts` and expose a per-stage attempt budget in `RunConfig`.
- **Benefit:** the code states the behaviour it actually has; about −15 lines.
- **Verification:** the §7 unit test of `executeAgentWithRetry`. Owner decision (R2), because the warning text and the `logScoringError` records change.

### ORC-12 — Per-run telemetry instead of process singletons
- **P2 · lens G · R1 · M**
- **Evidence (MEASURED):**
  - Clearance and clue paste counters (`deterministic-repair.ts:594`, `:610`).
  - Repair-efficacy tallies (`repair-efficacy.ts:46`). These are reset at every `generateProse` start (`generate.ts:2066`), so an Agent 9 schema re-run (`agent9-run.ts:5558`) erases the first pass's counts.
  - A single-slot `activeFlush` (`process-guards.ts:31`). A second run's `registerShutdownFlush` replaces the first's, and the first run's `finally` clears the second run's registration.
  - `POST /api/projects/:id/run` (`server.ts:1239`) has no guard against concurrent runs. The pipeline timeout (`Promise.race`, `:1262`) leaves a timed-out run executing in the background.
  - CODE-AUDIT-BACKLOG §6 records the first three as held only by a comment.
- **Proposal:** `RunTelemetry` (counters + tallies) created in `createOrchestratorContext`, passed to prompts-llm through `ProseGenerationInputs`, and read into the report. `process-guards` keeps a `Map<runId, flush>`. The API refuses a second concurrent run explicitly (R2).
- **Benefit:** removes a concurrency defect class and the reset-loses-counts issue. About +20 lines.
- **Verification:** a test that runs two orchestrations interleaved with stub agents; counters stay separate.

### ORC-13 — Small shared concepts re-implemented at call sites
- **P2 · lens C · R0/R1 · S**
- **Evidence (MEASURED, grep):**
  - **Canonical clue id `/^clue_[a-z0-9_-]+$/i`, 6 bodies:** `mystery-orchestrator.ts:337` (byte-identical to `agent6-run.ts:1151`), `agent5-run.ts:157`, `agent4-revision.ts:723`, `:731`, `agent5-clues.ts:1248`.
  - **Letter-grade ladder, 4 inline copies** (`agent3-run.ts:385`, `:677`; `agent5-run.ts:4385`; `agent6-run.ts:1685`), although `calculateGrade` is exported from story-validation (`scoring/thresholds.ts:110`).
  - **`simpleHash`, 4 bodies:** `shared/temporal-anchor.ts:78`, `agent2-cast.ts:135`, `name-generator.ts:19`, and `agent1-setting.ts:71`, which deliberately uses `>>> 0`.
  - **`LockedFact`, 5 shapes:** `shared.ts:54` (+`derivedFrom`), `types/narrative-state.ts:15` (+`appearsInChapters`, and exported under the **same name** from `@cml/prompts-llm`), `types.ts:61`, `types.ts:88`, `world-state.ts:77`. In addition, Agents 5 and 6 derive "locked facts" from **all devices, un-wordified** (`agent5-run.ts:4133`, `agent6-run.ts:486`), while the registry holds the primary device's wordified values (`agent3b-run.ts:550`). That is a second derivation of one fact (ADR-0005).
  - **Agent 5's parse guard.** `parseClueJsonContent` is a second body of the kit (ORC-04).
  - **Stale header.** `temporal-anchor.ts:18-22` still says it is "a verbatim COPY … dark"; its consumers have imported it since phase 2.
- **Proposal:** `shared/clue-id.ts`, `calculateGrade`, `shared/hash.ts` (two named variants), one exported `LockedFactRecord` type in `@cml/cml`; fix the header. The ADR-0005 locked-facts question goes to the Agent 5/6 reviewers.
- **Benefit:** about −50 lines; 6+4+4+5 bodies → 1 each, with the deliberate variant named.
- **Verification:** R0 for the identical ones (typecheck + tests). The `LockedFact` source unification is R2.

### ORC-14 — An explicit design model defeats the per-agent router
- **P2 · lens I · R2 · S**
- **Evidence (INFERRED, by reading):** `agent-model-router.ts:26` gives an explicit `options.model` precedence and claims agents 3, 3b, 5, 6, 7 "pass no model". But 8 call sites pass `model: resolveDesignModel()`, which evaluates to `AZURE_OPENAI_DEPLOYMENT_NAME_DESIGN || AZURE_OPENAI_DEPLOYMENT_NAME` and is therefore always set in a real run: `agent3-cml.ts:1393`, `agent3b-hard-logic-devices.ts:543`, `agent5-clues.ts:1323`, `agent6-fairplay.ts:822`, `:920`, `agent7-narrative.ts:871`, `agent3b-plausibility-judge.ts:140`, `prose-blind-reader.ts:76`. The rubric judge likewise passes `RUBRIC_JUDGE_MODEL || AZURE_OPENAI_DEPLOYMENT_NAME` (`mystery-orchestrator.ts:701`). So `AGENT3_MODEL`, `AGENT5_MODEL`, `AGENT6_MODEL`, `AGENT7_MODEL` and `RUBRIC_SCORER_MODEL` are silent no-ops: "set in config, read by nothing" in a new form.
- **Proposal:** one model-resolution chain in `RunConfig.models`: per-agent override → tier (design/prose) → base. Call sites pass `logContext.agent` only.
- **Verification:** flag-register test plus a log-label check. R2, because a configured override would start taking effect.

### ORC-15 — `OrchestratorContext` typing
- **P3 · lens E · R0 · S**
- **Evidence:** `initialHardLogicDirectives: any`, `noveltyConstraints: any`, `nsdTransferTrace: any[]`, `reportProgress(stage: any…)` (`shared.ts:225-349`). Undeclared fields written through casts (`agent3b-run.ts:301`). `"novelty_math" as any` (`agent3-run.ts:632`), which is already a member of the union.
- **Proposal:** use `HardLogicDirectives`, `NoveltyConstraints` (from novelty-ledger) and `MysteryGenerationProgress["stage"]` once ORC-06 has broken the cycle.

### ORC-16 — The asset library is built per attempt despite its own contract
- **P3 · lens H · R1 · S**
- **Evidence:** `asset-library.ts:6` says "Call once per prose run". It is built at `agent9-run.ts:4478` (once per run), `prompt-builder.ts:1625` (per chapter prompt) and `generate.ts:2389` (per batch attempt). This is a derived fact computed three times (ADR-0005). The CPU cost is negligible against LLM latency.
- **Proposal:** pass the run-level library through `ProseGenerationInputs`.

## 4. Target structure

```
apps/worker/src/jobs/
  mystery-orchestrator.ts      ~150  generateMystery = init → runPipeline → finalize | abort
  run-contract.ts               ~110  public Inputs/Progress/Result/callback types        (ORC-06)
  run-config.ts                 ~250  resolveRunConfig + envFlag + run_config diagnostic  (ORC-05)
  rubric-scoring.ts             ~170  runRubricScoring (shared with agent9-replay)        (ORC-07)
  pipeline/stages.ts            ~120  declarative STAGES table (order per ADR-0002)
  pipeline/run-pipeline.ts      ~140  resume skip · emitArtifact(warn) · parallel group
  pipeline/gates.ts             ~330  novelty/fair-play binding, early abort, CML pre-prose gate
  pipeline/init.ts              ~160  setup + createOrchestratorContext inputs
  pipeline/finalize.ts          ~220  content filter, report, status, ledger, snapshot
  pipeline/abort.ts             ~200  aborted-prose summaries, partial report, partialArtifacts
  agents/context.ts             ~220  OrchestratorContext, createOrchestratorContext, RunTelemetry
  agents/stage-runner.ts        ~200  runStage, executeAgentWithRetry, feedback, honest scorer
  agents/premise.ts             ~300  axes, deriveHardLogicDirectives, merge
  agents/clue-guardrails.ts     ~150 · agents/outline-guardrails.ts ~50 · agents/run-utils.ts ~70
packages/prompts-llm/src/
  shared/llm-json.ts            ~180  callLlmJson (finishReason + guarded ladder + typed parse)  (ORC-04)
  shared/clue-id.ts, shared/hash.ts        ~30
  constants/arc-position.ts     +25   arcPositionForChapter                                     (ORC-08)
  index.ts                      ~150  + package.json subpath exports                            (ORC-10)
```

## 5. Suggested sequence

1. **R0 hygiene:** ORC-09 dead code, ORC-06 split (as a move, with a shim), ORC-15 typing, ORC-13 identical merges. Each independently shippable; verify with `tsc` + `build:all` + `preflight-dist-check`.
2. **Safety net:** write the §7 characterisation tests (a) orchestrator, (b) `executeAgentWithRetry`, (c) arc-position parity, (d) JSON-parser golden corpus.
3. **ORC-05 `RunConfig`**, preserving vocabularies, plus the `run_config` diagnostic.
4. **ORC-03 `ChatResponse.cost`**, then **ORC-04 `callLlmJson`** at the guarded sites (R1).
5. **ORC-02 `runStage`**, one runner per PR, smallest first: 2d, 6.5, 2e, 2b, 2c, 1, 2, 3b, 7.
6. **ORC-01 stage table** (the gates first, then finalize/abort, then the loop).
7. **ORC-07, ORC-10, ORC-12, ORC-16.**
8. **R2, for the owner:** ORC-04 guards at 2b/2c/4/prose, ORC-08 formula choice, ORC-11 semantics, ORC-14 routing, the replay rubric change, vocabulary unification.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `ENABLE_SCORING` | off | `mystery-orchestrator.ts:883` | unregistered | accepts only `"true"`; `1` = off. Forks every runner (ORC-02) |
| `AGENT_PROFILES_PARALLEL` | off | `:860` | DEFER (R9) | bypasses `stage()`; resume handled by `selectPending` |
| `AZURE_ENDPOINT_PREFLIGHT` | **on** | `:134` | unregistered | default-on and invisible in config |
| `AGENT5_DERIVE_SHADOW` | **on** (shadow) | `:822` | registered, default ON | telemetry only |
| `RUBRIC_SCORING_MODE` | shadow | `:693` | registered | replay reads it separately (ORC-07) |
| `RUBRIC_JUDGE_MODEL` | inherits base | `:701`, `:767`, `:768`, `:772` | registered (SET) | ignored by replay; defeats the router (ORC-14) |
| `CORPUS_SNAPSHOT_DIR` | unset | `:1779` | unregistered | path config |
| `AGENT_PRE9_ENABLE_LLM_RETRIES` | off | `shared.ts:663` | registered | gates the scoring retry; its abort path is dead (ORC-11) |
| `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` | **on** | `shared.ts:700` | registered as default-OFF (**register is wrong**: unset → `true`) | schema-repair re-calls in 1, 2, 3, 7 |
| `HONEST_SCORERS` | off | `shared.ts:679` | unregistered | wraps 7 scorers |
| `AGENT1_PERIOD_KB_ENABLED` | off | `shared/constraints.ts:64` | registered | tri-state |
| `AZURE_OPENAI_DEPLOYMENT_NAME_DESIGN` / `_PROSE` | fall back to base | `model-tiers.ts:23`, `:28`; `agent9-run.ts:4288` | CONFIG | `_PROSE` resolved twice, the helper unused (ORC-09) |
| `NOVELTY_CROSS_RUN` | shadow (on) | via `novelty-ledger.ts:100`; also `retry-gate-guard.ts:56` | registered as default-OFF (**register is wrong**) | parsed twice with different vocabularies |

## 7. Safety net

- **What pins the area today:**
  - `mystery-orchestrator-fixes.test.ts` (pure helpers via `__testables`);
  - `resume-hydration.test.ts`, `resume-parallel-profiles.test.ts`;
  - `warning-channel-aliasing.test.ts` (a source scan);
  - `behaviour-contract-role-x63.test.ts`;
  - `primary-axis-vocabulary`, `mechanism-family-axis`, `clue-guardrails-distinctness-a56`;
  - prompts-llm tests for `json-boundary`, `temporal-anchor`, `story-title`, `clearance-vocabulary-parity`.
- **Gaps:** **no test calls `generateMystery`** (grep); **no direct test of `executeAgentWithRetry`**, `appendRetryFeedback`, `applyHonestScorer` or `applyAbortedRunMetadata`; no test of `RunConfig`-style parsing across flags; no arc-position parity test.
- **Write first:**
  - (a) Orchestrator characterisation: `vi.mock("./agents/index.js")` with recording stubs that set ctx fields, a stub client, and scoring on. Snapshot call order, `onArtifact` names and payloads, warnings and result for: fresh run; resumed run (R9 off/on); each of the 3 gates plus the CML gate throwing; an Agent 9 failure (abort path).
  - (b) `executeAgentWithRetry` truth table (pass, retry, exhaustion with abortCritical true/false, scoring error, retries disabled), pinning today's behaviour including the swallowed abort.
  - (c) A prompt-capture harness (a stub `chat` recording `messages`) per runner, for the ORC-02 byte-equality proof.
  - (d) A golden corpus for the JSON parsers.
- **Replay harness:** `agent9-replay.ts` is not a no-cost net (it calls the LLM and its context and rubric drift, ORC-07). `REPLAY_DRY=1` only checks that the context assembles.

## 8. What NOT to refactor

- **The stage order and the gates' semantics** (ADR-0002). Encode them as data; do not reorder them or make them adaptive.
- **The never-abort catch-and-continue** around the rubric, Agent 7.5, the clue-spec shadow, the ledger and partial saves (ADR-0003). Only the silent `onArtifact` swallow and the misleading "scoring failed" message are defects.
- **The contiguous-prefix resume rule** (`ResumeSkipTracker`) and Agent 7.5's deliberate bypass of `stage()` (`:1565-1571`): keep both in the stage table as explicit properties.
- **`clearWarningsInPlace`** (array identity is load-bearing, and there is a test for it).
- **The write-time honesty of partial reports** (`in_progress` stamping, `:937-964`, `:984-1012`). Merge the two stampers only into one parameterised function with the same field sets.
- **The deliberately different vocabularies:** `CLEARANCE_TERMS_WITH_KILLER_RE`, the death-method labels, `agent1-setting` `simpleHash >>> 0`.
- **The generated `constants/opening-corpus.ts`** (edit the generator instead).

## 9. Incidental defects

| # | Defect | Evidence | Confidence |
|---|---|---|---|
| D1 | `executeAgentWithRetry` abort-on-exhaustion never propagates; `abortCritical` is inert | stub probe on dist (MEASURED), `shared.ts:766-807` | High |
| D2 | Replay rubric uses a different judge model and skips the structural verifiers and `noResolution`; replay rubric scores are not comparable with live ones | `agent9-replay.ts:160-185` vs `mystery-orchestrator.ts:650-721` | High |
| D3 | Per-agent costs are over-counted on every retry or regeneration path (cumulative + cumulative); Agent 2 cost is always 0 | `agent2-cast.ts:947`; 16 accumulation sites (ORC-03) | High |
| D4 | `AGENT2B_VOICE_MAX_RETRIES` is uncapped: `Infinity` or a large value makes an unbounded LLM regeneration loop (the "Phase-1 lesson" 3b guards against); the retry-gate guard assumes a cap of 3 | `agent2b-run.ts:97` vs `agent3b-run.ts:421-424`, `retry-gate-guard.ts:34` | High |
| D5 | The tonal-contrast check compares arc labels from two different ladders | `obligation-block.ts:822`; `prompt-builder.ts:1613` vs `generate.ts:2330` | Medium |
| D6 | Agent 2's schema-repair re-call drops the caller's `castGenders` lock | `agent2-run.ts:835` vs `:706`, `:756` | Medium (may be deliberate; undocumented) |
| D7 | `ENABLE_SCORING=1` and `ENABLE_PROSE_BLIND_READER=1` read as off; `AGENT2_CAST_CHECK=no` (and 2b/2c/2e) reads as on | parsers in ORC-05 | High |
| D8 | Explicit design model silences `AGENT3/5/6/7_MODEL` and `RUBRIC_SCORER_MODEL` | ORC-14 | High (INFERRED) |
| D9 | Concurrent API runs share the module counters and overwrite each other's shutdown flush; a timed-out run keeps executing | `process-guards.ts:31`, `server.ts:1239-1276` | High (INFERRED) |
| D10 | The retry-gate guard models `NOVELTY_HARD_FAIL` but not `NOVELTY_MODE=active`, which replaced it | `retry-gate-guard.ts:56` vs `novelty-ledger.ts:81-89` | Medium |
| D11 | `name-generator.ts:591-600` "2× weight" is a no-op: the de-duplication removes the duplicates before uniform `pickUnique` | reading | High (impact: name distribution only) |
| D12 | Agent 6 `perCallCostDelta` takes its baseline *after* the first retry call, so the first retry is never charged to the $ retry budget | `agent6-run.ts:1477-1487`, `:1593`, `:1619` | Medium |
| D13 | Artifact-write failures are swallowed silently, so the resume checkpoint can be missing with no trace in the report | 14 × `.catch(() => {})`, `mystery-orchestrator.ts:1197-1593` | High |

## 10. Cross-area observations — the cross-agent skeleton

Canonical skeleton: **context in → build prompt → LLM call → JSON parse/coerce → validate → retry with feedback → score → account cost → persist → telemetry.** How each agent deviates from it:

| Agent (runner LOC) | LLM call · model | Parse / truncation | Generator retry | Runner retry | Feedback channel | Score | Cost semantics | Extra persistence |
|---|---|---|---|---|---|---|---|---|
| 1 (168) | `chatWithRetry` · router | strict only | hand loop | EAWR + schema-repair re-call | `tone` | EAWR + honest | cumulative, re-added | — |
| 2 (204) | `chat` · router | strict only | hand loop | EAWR + deterministic repair + re-call (drops genders) | `tone` / guardrails | EAWR + honest | **always 0** | — |
| 2e (143) | `chat` · router | tail guard + jsonrepair | `withValidationRetry` | EAWR | `tone` **and** `theme` | EAWR + honest | cumulative | — |
| 3b (325) | `chatWithRetry` · design | via generator | `withValidationRetry` | EAWR + plausibility gate loop | `tone` + `theme` | EAWR + honest | cumulative; gate loop delta | `locked-facts-*.json` |
| 3 (+4, 8) (516) | `chatWithRetry` · design; 4, 8 `chat` | 4-step + guard (4: **no guard**; 8: strict) | hand loop + Agent 4 revision | collision retry, novelty retry | exclusions / constraints | **hand-built** ×2 | overwrite (A_53 P3) | `novelty-skeleton-*.json` |
| 5 (1,126) | `chat` · design | own `parseClueJsonContent` (flag + retry) | 1 truncation retry | 6 regeneration sites | `fairPlayFeedback` | **hand-built** | cumulative, re-added ×7 | — |
| 6 (1,139) | `chat` · design ×2 | 4-step + guard | none | fair-play + blind-reader loops; calls `extractClues` ×4, `reviseCml` | `fairPlayFeedback` | **hand-built** | overwrite + `perCallCostDelta` | — |
| 2b (124) | `chat` · router | jsonrepair, **no guard** | `withValidationRetry` | EAWR + voice gate (uncapped) | `tone` | EAWR | cumulative, re-added | — |
| 2c (227) | `chat` · router | jsonrepair, **no guard** | `withValidationRetry` | EAWR + scene gate | `tone` | EAWR + honest | cumulative; gate delta | — |
| 2d (87) | `chat` · router | tail guard + jsonrepair | `withValidationRetry` | EAWR | `qualityGuardrails` | EAWR | cumulative | — |
| 6.5 (74) | `chat` · router, temp 0.7 | tail guard + jsonrepair | 1 loop | EAWR (non-critical) | **ignored** | EAWR | cumulative | — |
| 7 (978) | `chat` · design, optional `jsonSchema` | `finishReason` guard + jsonrepair | none | EAWR + schema repair + 6 gate re-calls | `qualityGuardrails` | EAWR + honest + rescore | cumulative, re-added ×6 | — |
| 7.5 (114) | `chat` (flag) · router | bare `JSON.parse` | none | none | — | none (diagnostic) | `getTotalCost` delta | — |
| 9 (3,957) | `generateProse` + 7 regeneration/polish paths | `parseProseResponse` jsonrepair, **no guard** | per-chapter `classifyFailure` loop | schema re-run + regeneration passes | retry packets | **hand-built** | `getTotalCost` deltas (24 calls) | checkpoint, stories, logs |
| Rubric (orch.) | `chat` · explicit judge model | inside judge package | — | — | — | diagnostic | not recorded | — |

EAWR = `executeAgentWithRetry` (used by 9 runners). `appendRetryFeedback` is used by 5 runners; `withValidationRetry` by 5 generators; `looksTruncatedJson` by 5; `guardedJsonrepairParse` by none.

**Proposed abstractions, and what they remove (INFERRED estimates from line counts):**
- `callLlmJson()` (ORC-04 + 03), used by all 31 call sites: about −180 lines of parse ladders plus the cost-delta code.
- `runStage()` (ORC-02), used by the 9 EAWR runners, and available to 3, 5 and 6 so they can drop hand-built scores: about −300 lines.
- `buildInputs(feedback)` per runner (inside ORC-02): collapses 29 copies of generator input literals.
- `RunConfig` (ORC-05): all agents; about −80 lines.

**Total:** about −560 lines across the agents, and 14 skeleton variants become 1 skeleton with declared deviations.

**Other patterns for the synthesis:**
- Generator-level schema validation is repeated by the runner in 2b, 2c, 2d, 2e and 3b (two owners of one gate).
- Agent 6 calls Agent 5's and Agent 4's generators directly with its own payloads, so a third copy of the clue-extraction inputs lives in Agent 6.
- Novelty has two axis vocabularies (5-value `CML_PRIMARY_AXES` against the 6-value `NOVELTY_AXES`, whose fallback is `"behavioral"`), and "CML → avoidance patterns" has two bodies (`shared.ts:1029`, `novelty-ledger.ts:213`, `:305`).
- The LLM client is constructed in three places (`jobs/index.ts:47`, `cli-runtime.ts:128`, `server.ts:360`, `:664`), plus a further boolean parser `parseEnvBool` (`jobs/index.ts:34`, `"true"` only).
- All 9 `jobRegistry` names run the identical full pipeline (`jobs/index.ts:95`).

## 11. Open questions for the owner

1. ORC-11: should an exhausted scoring retry ever abort (restore the intended behaviour), or should the dead abort be deleted in line with ADR-0003?
2. ORC-07: may the replay harness adopt the live rubric path? Its historical scores become non-comparable with new ones.
3. ORC-04: guard the four unguarded jsonrepair boundaries (2b, 2c, 4, prose)? That is R2: payloads that are repaired today would be refused and retried.
4. ORC-08: which arc-position formula is canonical?
5. ORC-05: unify env-flag vocabularies (so that `1` means on everywhere), with a warning on unknown values, and register the four unregistered and two mis-registered flags in §6?
6. ORC-12: should the API refuse concurrent runs, or should the pipeline be made concurrency-safe?
7. ORC-14: should a per-agent model override outrank the design tier?

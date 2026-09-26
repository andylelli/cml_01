# 07 — Agents 6 & 6.5: fair play and world builder

**Scope:** `apps/worker/src/jobs/agents/agent6-run.ts` (2,532), `agent6-reveal-gate.ts` (218), `agent6-escalation-policy.ts` (138), `agent65-run.ts` (92); `packages/prompts-llm/src/agent6-fairplay.ts` (964), `agent65-world-builder.ts` (1,283). 5,227 lines, 4,241 code lines · **Read:** every line · **Written:** 2026-09-25
**Finding prefix:** A6 · **Method:** [RUBRIC.md](../RUBRIC.md)

## 1. What this area does

**Agent 6: fair play.** Entry point `runAgent6(ctx)` (`agent6-run.ts:1394`), called from `mystery-orchestrator.ts:1227`. It reads `ctx.cml` and `ctx.clues`, and may **replace both**. It writes `ctx.fairPlayAudit`, `hasCriticalFairPlayFailure`, `agent6FirstPassPassed/RetryInvoked/FailureClass`, `coverageResult` and `allCoverageIssues` (11 ctx fields written, 32 touched, MEASURED). Its phases, by line:

| Phase | Lines | What it does | LLM |
|---|---|---|---|
| P0–P3 setup | 1395–1530 | Normalise a string CML, set up the warning channel (3 sets), build the retry budget and cost-delta tracker, resolve config, define the `auditCurrentFairPlay` closure | — |
| P4 pre-LLM floor | 1532–1582 | Parity bridge → step backstops → bridge again → `runDeterministicStructuralAudit` (`:687`) | — |
| P5 audit loop | 1584–1633 | `auditFairPlay` (up to 2 attempts), with Agent-5 `extractClues` regeneration between attempts | audit, regen |
| P6 | 1635–1717 | Critical-violation warnings, then an inline phase score (`recordFairPlayScore`) | — |
| P7 blind reader | 1719–2023 | Primary read (majority-of-k opt-in) → remediation cycles (regen + audit + read) → deterministic rescue re-read → advisory or blocking verdict | read, regen, audit |
| P8 escalation | 2025–2429 | Classify the failure (`agent6-escalation-policy.ts`), synthesise upstream context, then Agent 4 `reviseCml` → provisional audit → regen → re-audit; or the `clue_only` regen; then the WP8A backstop re-audit | revise, audit, regen |
| P9 finalize | 2431–2461 | Clear transient warnings, recompute coverage, set ctx flags, genre-structure warnings | — |
| P10 reveal gate | 2463–2525 | `agent6-reveal-gate.ts`: herring→culprit (T2.2), death-method deducibility (T2.3), early+mid blind reader (T2.1) | read |
| P11 | 2527–2531 | Binding-gate `blocking` flag | — |

The prompts and LLM calls live in `agent6-fairplay.ts`: `auditFairPlay` (`:810`, temperature 0.3, 2,500 max tokens) and `blindReaderSimulation` (`:870`, temperature 0.2, 1,500 max tokens), both on `resolveDesignModel()`. The audit prompt has two modes. **Narrative** mode (`buildNarrativeDeveloperContext`, `:281`) is used when the structural pre-audit passed: about 12.6 KB. **Full** mode (`buildDeveloperContext`, `:368`) is about 27.5 KB (MEASURED on the four golden bundles).

**Agent 6.5: world builder.** `runAgent65` (`agent65-run.ts:19`) calls `generateWorldDocument` (`agent65-world-builder.ts:928`). That makes one LLM call at temperature 0.7 with 12,000 max tokens, inside an inner loop of up to 3 attempts, which sits inside an outer scoring retry (`executeAgentWithRetry`, max 1). Each attempt runs a JSON boundary check, deterministic normalisation, schema and cast-coverage gates, and word floors for the arc, theme and reveal. Output is `ctx.worldDocument`, which Agents 7 and 9 read.

## 2. Verdict

The two small extracted modules (`agent6-reveal-gate.ts`, `agent6-escalation-policy.ts`) are clean, pure and tested. They show the pattern works. The complexity sits in one place: `runAgent6`, with 1,139 lines, cyclomatic complexity 174, and 42 function-scope bindings, 30 of which are shared across its 12 phases. It carries four near-identical sub-sequences, repeated 4–6 times each:

- audit → cost → budget → critical → score
- regen → cost → contracts → budget
- blind read → content-filter guard → pass predicate
- deterministic floor → structural audit

Each copy has drifted. One floor sequence silently drops its telemetry. Of the three content-filter guards, two were added by a fix that "stopped short" of the third. One pass predicate exists as a function and is re-inlined three times.

The single most valuable finding is behavioural rather than structural, and it is MEASURED. Agent 6's retry feedback is exactly the HANDOVER §5.4 anti-pattern. On all four golden CMLs, the "REQUIRED CLUE CONTENT" block of the Agent-5 retry prompt holds **0 of 12** lines derived from the actual violations: fixed contract text fills the cap first. Agent 6.5 is the one `executeAgentWithRetry` caller (of 9) that throws its scoring feedback away.

The most valuable structural change is extracting `runAgent6` into phase functions over an explicit `Agent6RunState`, continuing the reveal-gate and escalation-policy pattern. Every other finding lands at a named seam once that is done.

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| A6-01 | P1 | B | `runAgent6` → coordinator plus 7 phase modules over explicit state (30 shared bindings, 9 mutable) | R0→R1 | L (3–4 d) | −250 |
| A6-02 | P1 | C/F/I | Fair-play retry feedback is failure-agnostic: 0 of 12 violation-derived lines reach Agent 5 | R2 | S | −90 |
| A6-03 | P1 | F/I | Agent 6.5 retry feedback: outer loop discards it; inner generic branch pushes length for failures the floors made unreachable | R2 | S | −20 |
| A6-04 | P1 | C | One deterministic clue-floor sequence exists in 4 orderings; one discards its repairs silently | R1 | M | −40 |
| A6-05 | P1 | D/F | Dead error-message classification ladder since `2b76cbfa` (~52 lines) | R1 | S | −52 |
| A6-06 | P2 | C | Blind read: pass predicate ×4, call ×5, content-filter guard ×3 (plus a duplicated 13-line comment) | R0/R1 | S | −70 |
| A6-07 | P2 | C | "Guess names the culprit": 3 matchers with opposite failure modes; blind reader told the detective and victim are suspects | R2 | M | −15 |
| A6-08 | P2 | C/E | Fair-play rule vocabulary: 7 code bodies, case-sensitive `has()`, and the prompt asks for different rule names | R1/R2 | M | −20 |
| A6-09 | P2 | A/C | Clue-synthesis helpers duplicated with Agent 5; the agent6→agent5 import edge should become a `clue-contracts` module | R0/R1 | M | −60 |
| A6-10 | P2 | C | CML prompt-header projection: 6 bodies across 4 files; FA-1/2/5 fixes landed only in Agent 6 | R1 | M | −80 |
| A6-11 | P2 | B | `buildDeveloperContext` (301 LOC, cc 63): split derivation from rendering; triplicated clue formatter | R0 | M | −30 |
| A6-12 | P2 | B/D | `generateWorldDocument` (339 LOC, cc 52): pure validator with a typed failure; ~55 lines of unreachable safety-net gates | R1 | M | −70 |
| A6-13 | P2 | J | Safety-net holes: structural audit untested; one test pins a local copy of the classifier; the 6.5 retry builder is untested | R0 | S | +150 |
| A6-14 | P2 | D | Dead config, fields, imports and flag parsers (YAML still holds `max_tokens: 6000`) | R0/R1 | S | −25 |
| A6-15 | P2 | G | Warning channel erases floor firings from the report on passing runs (ADR-0003/0010) | R2 (report-only) | S | ±0 |
| A6-16 | P3 | I | LLM calls a deterministic check could avoid; independent calls made in sequence | R2 | S | — |
| A6-17 | P3 | I | World Builder prompt: 15% JSON whitespace; the solution half of CASE is sent to an agent forbidden to use it | R2 | S | — |
| A6-18 | P3 | E | Types: `CaseData = any`, 15 `(cml as any)?.CASE ?? cml`, gratuitous casts, a local JSON-repair cascade | R0/R1 | M | −40 |
| A6-19 | P3 | C | Death-method vocabulary copied from rubric-score on a stale rationale; resolution semantics diverge | R0/R2 | S | −15 |

---

### A6-01 — Decompose `runAgent6` into phases over explicit state
- **P1 · lens B · R0 (moves) → R1 (merging repeated sequences) · L (3–4 days)**
- **Evidence (MEASURED, TypeScript AST over `agent6-run.ts`).**
  - `runAgent6` has 42 function-scope bindings, 7 of them closure functions.
  - 30 bindings are referenced in 2 or more of the 12 phases. 9 of those are mutable `let`s:
    - `fairPlayAudit`: 7 phases, written in 4
    - `agent6RetryInvoked`: 5 phases, written in 4
    - `hasCriticalFairPlayFailure`: 4 phases, written in 3
    - `preAuditStructuralResult`: 4 phases, written in 2
    - `emittedFinalCriticalFailureSummary`, `firstFairPlayStatus`, `agent6FailureClass`, `fairPlayAttempt`, `fairPlayAuditCostDuringLoop`
  - Repeated sub-sequences (counted with grep):
    - `auditCurrentFairPlay` ×6 (`:1586, 1889, 2270, 2325, 2365, 2402`), each followed by a cost write, `retryBudget.consume`, `hasCriticalFairPlayViolations` and `recordFairPlayScore`. 12 budget charges in total.
    - `extractClues` ×4 (`:1609, 1845, 2286, 2349`), each followed by a cost write and `applyAgent5ContractsToRegeneratedClues` (called 6× in all).
    - About 15 cost/duration accounting writes.
  - `recordFairPlayScore` (`:1671`) is an inline phase scorer. Its grade ternary duplicates `calculateGrade` (`story-validation/src/scoring/thresholds.ts:110`).
  - `persistentRiskWarnings` (`:1418`) is written and never read.
- **Proposal.** Continue the reveal-gate pattern: pure modules under `agents/agent6/`, and a coordinator of about 150 lines.
  - **State objects:**
    - `Agent6Config`: 8 resolved-once values (`retriesEnabled`, the max-attempt, remediation and targeted-regen caps, min confidence, cost cap, `clueDensity`, critical rules).
    - `CaseFacts`: 4 values (cast names, false assumption, culprit, false-solution suspect), **re-derived after any CML revision** (see §9 #5).
    - `Agent6RunState`: the 10 mutable fields.
    - Services: an `Agent6WarningChannel` class, and a `FairPlayBudget` that owns the cost-delta tracking now in the `perCallCostDelta` closure.
  - **Primitives that absorb the repeated sequences:**
    - `reaudit(ctx, state, label)`: audit + cost + charge + critical + score. Replaces 6 copies.
    - `regenerateClues(ctx, state, feedback, label)`: replaces 4.
  - **Phase modules:**
    - `preaudit-floor.ts` (A6-04)
    - `audit-loop.ts`
    - `blind-reader.ts` (A6-06)
    - `structural-escalation.ts`: context synthesis (`:2063–2127`) and revision instructions (`:2159–2203`) as pure builders
    - `finalize.ts`
    - `reveal-gate` (existing)
    - `agent6-fairplay-scorer.ts`, moving to `story-validation/src/scoring/phase-scorers`
- **Benefit.** The 1,139-line, cc-174 function becomes a coordinator of about 150 lines with cc ≤ 25. The largest phase (escalation) drops to about 250 lines. `agent6-run.ts` falls from 2,532 to about 900 lines, plus modules. The redesign's "checker authoritative" flip (`documentation/12_system_redesign/11_agent_6_fair_play_auditor.md` §7) becomes a one-line change in `structural-escalation.ts`.
- **Verification.**
  1. Moves only (R0): typecheck, the four existing agent6 test files, `build:all`.
  2. Merging the sequences (R1): first extend `agent6-run-flow.test.ts` with recorded mock-call transcripts (argument order and count for `auditFairPlay`, `extractClues`, `blindReaderSimulation`, `reviseCml`, with retries on and off), a snapshot of `ctx.warnings`, and a snapshot of `ctx.agentCosts`. Assert them byte-equal before and after.
- **Relates to:** A6-04, 05, 06, 15; ORC (`OrchestratorContext` bag); A9W (S4 split pattern).

### A6-02 — Fair-play retry feedback is failure-agnostic (the §5.4 class, in Agent 6)
- **P1 · lens C/F/I · R2 · S**
- **Evidence (MEASURED).**
  - `deriveRequiredCluePhrases` (`:239–366`) builds its output in a fixed order:
    - 4 `STRICT_FIRST_PASS_ACCEPTANCE_STATEMENTS`
    - 5–6 unified contract lines
    - 2 + cast-size cast-path lines
    - the violation-derived phrases
  - It then applies `.slice(0, 16)`. `buildFairPlayFeedbackPayload` (`:383–388`) re-merges and slices to 18. `agent5-clues.ts:1083–1084` slices again to 12.
  - The script `scratchpad/a6/phrases.mjs` ran on all four `eval/golden` CMLs (cast of 7). Result: `deriveRequiredCluePhrases` returns 16 lines, 16 fixed, **0 violation-specific**, and the payload holds 18 lines, 0 specific.
  - Rendering the real Agent-5 prompt (`agent5prompt.mjs`) gives a "REQUIRED CLUE CONTENT" block of **12 lines, 0 case- or violation-specific** (~1.8 KB of a ~38 KB prompt). The cast map also appears twice in that prompt.
  - The unit tests pass because their fixtures use a cast of 0–2 (`agent6-run.test.ts:221`, `agent6-run-flow.test.ts:319`).
  - Net effect: ~90 lines of violation → phrase logic (`:256–356`: pair contract, discriminating design, required_evidence, clock and alibi heuristics) never reach the model. The fixed acceptance summaries are also appended to `warnings` (`:393`) and so render as `must_fix` items.
- **Proposal.** Put failure-derived content first, capped separately. Render the fixed contracts once, in their own block (they already exist as `cast_path_binding_rules[]`). Make the builder take the failure as a typed input and return `{ specific[], contract[] }`. Only the retry arm is affected, which already sits behind the default-OFF `AGENT_PRE9_ENABLE_LLM_RETRIES`.
- **Benefit.** The retry prompt names what failed. Removes a dead-in-effect body and ~1 KB of duplicated contract text per retry.
- **Verification.** A property test: two different violation sets must yield `requiredCluePhrases` that differ within the first 12 entries, on a 7-member cast. Probe per ADR-0004 on the retries arm.
- **Relates to:** A6-03; A5 (Agent 5 prompt slice at `agent5-clues.ts:1084`).

### A6-03 — Agent 6.5 retry feedback: discarded outside, failure-agnostic inside
- **P1 · lens F/I · R2 · S**
- **Evidence (MEASURED).**
  - **Outer loop.** `agent65-run.ts:26` takes `async (_retryFeedback?: string)` and never passes it on, although `generateWorldDocument` supports `inputs.retryFeedback` (`agent65-world-builder.ts:942–951`, added in `7b8edddc`, nine days after the runner in `5fe522ae`). It is the only one of the 9 `executeAgentWithRetry` callers that does this; the other 8 use their `retryFeedback`. `appendRetryFeedback` is imported and unused (`tsc --noUnusedLocals`).
  - **Inner loop.** `4408c12` split the retry block into two branches: truncation and "everything else" (`:990–1031`). The generic branch still appends a fixed 12-line checklist whose last three lines demand longer text (arc ≥ 300 words, "a single dense paragraph is not enough", theme ≥ 25, reveal ≥ 90). But the deterministic floors now run before those gates:
    - `enforceArcDescriptionFloor` pads to the configured gate.
    - `enforceStoryThemeFloor` always has a register.
    - `enforceRevealImplicationsFloor` adds about 107 words with no base text.

    With the shipped config, the arc-length, theme and reveal gates cannot fire (INFERRED from `:477–556`, `:172–214`, `:130–170` and defaults). The failures that can still reach a retry are:
    - JSON parse failure or truncation
    - schema validation
    - cast coverage
    - a single-paragraph arc

    None of these is a length failure.
  - Truncation is classified by `/truncat/i` over an error message (`:990`), although `ChatResponse.finishReason` is available (`llm-client/src/types.ts:69`).
  - No test covers any of this: `4408c12` touched only source and docs.
- **Proposal.**
  - Pass `retryFeedback` through: a one-line change.
  - Introduce `type WorldBuildFailure = { kind: "truncated" | "parse" | "schema" | "cast" | "arc_paragraphs"; detail }`, set truncation from `finishReason === "length"`, and add a pure `buildWorldBuilderRetryMessage(failure)` with one branch per kind.
  - Drop the length directives from the non-length branches.
- **Benefit.** Removes the last failure-agnostic retry text in this area, and a known way of losing a paid run.
- **Verification.** Unit test of `buildWorldBuilderRetryMessage` for each kind: the truncation text must contain no "at least" or "MUST be". Probe per ADR-0004.
- **Relates to:** A6-12; ORC (`executeAgentWithRetry`); HANDOVER §5.4.

### A6-04 — One clue-floor sequence, four orderings
- **P1 · lens C · R1 · M**
- **Evidence (INFERRED, by reading).**
  - Pre-LLM (`:1537–1564`): bridge → backstop → bridge again, with repairs logged.
  - Post-revision (`:2304–2309`): bridge → backstop. **The return value is discarded**: nothing is logged, and the bridge is not re-run.
  - WP8A (`:2387–2391`): backstop → bridge.
  - `applyAgent5ContractsToRegeneratedClues` (`:465–622`): contracts → [backstop | bridge] (dead, see A6-05) → coverage → bridge → contracts → coverage.
  - Coverage is recomputed 4× by the same three-line block.
- **Proposal.** `applyFairPlayFloor(ctx, label): { repairs[], structuralAudit }`, one ordering (the pre-LLM one), always logged as floor firings (A6-15), used at all four sites.
- **Benefit.** One body for a concept that has already acquired four. Closes the silent post-revision floor (ADR-0010).
- **Verification.** A characterisation test per site: synthesised clue IDs and timeline before and after, on the golden bundles.
- **Relates to:** A6-01, 09, 15.

### A6-05 — Dead error-classification ladder
- **P1 · lens D/F · R1 · S**
- **Evidence (MEASURED).** `applyAgent5ContractsToRegeneratedClues` branches on `/mechanism visibility gate failed/i` and `/strict step coverage gate failed/i` (`:551–552`, `:576`). A repo-wide grep finds **no producer** of either message. Commit `2b76cbfa` (2026-06-29) turned both throws in `enforceAgent5DeterministicContracts` into non-fatal warnings (`agent5-run.ts:3228–3280`). The strict-step fallback (`:561–586`) and `retryDeterministicContractsWithParityBridge` (`:522–544`) have been unreachable since then.
- **Proposal.** Delete about 52 lines. Replace message matching with a typed `Agent5ContractGateError { gate }` exported from the contract module (A6-09), so any future coupling is visible to the compiler.
- **Verification.** The grep as evidence, plus a test that every throw from `enforceAgent5DeterministicContracts` is typed. Behaviour for every error actually thrown today is unchanged.
- **Relates to:** A6-09; A5.

### A6-06 — Blind-read triplication
- **P2 · lens C · R0 (predicate) / R1 (guard) · S**
- **Evidence (MEASURED).**
  - The pass predicate `blindReaderSamplePasses` (`:1733`) is re-inlined at `:1813–1820`, `:1933–1939` and `:1990–1996`.
  - `blindReaderSimulation` is called 5× with the same argument list.
  - The content-filter guard appears 3× (`:1797`, `:1919`, `:1982`). The 13-line "X33, COMPLETED" comment is duplicated (`:1898–1910` ≈ `:1954–1967`); its own story is that the fix "stopped two functions short".
  - The reveal-gate read (`:2488`) uses a catch-all instead.
- **Proposal.** `blind-reader.ts` exporting:
  - `safeBlindRead(ctx, inputs, opts): BlindReaderResult | { notMeasured: true }`
  - `blindReaderSamplePasses`
  - `runBlindReaderGate(ctx, state, config)`

  Warning strings are passed in as parameters so they stay byte-identical.
- **Benefit.** About 70 lines, and one guard, so a fourth copy cannot miss it.
- **Verification.** The existing flow test, plus a content-filter test for each of the three sites.

### A6-07 — Three culprit-name matchers
- **P2 · lens C · R2 · M**
- **Evidence.**
  - The blind-reader gate uses two-way `includes` (4 sites).
  - T2.1 uses `namesMatch`, which is exact or same surname (`identity-match.ts:23`).
  - `prose-blind-reader.ts:24–28` keeps its own copy.
  - They fail in opposite directions. `includes` rejects "Mr. Montague" for "Charles Montague". `namesMatch` accepts "Margaret Langley" for "Charles Langley".
  - Three of the four golden casts have shared surnames (MEASURED), so T2.1 enforce can flag a wrong early guess as "too obvious".
  - `castNamesForBlind` (`:1721`) includes the detective and the victim, and the prompt calls them "suspects".
- **Proposal.** One cast-aware `resolveGuessToCastMember(guess, cast)`: a unique full name or unique surname, otherwise ambiguous. Build the suspect list from the canonical elimination-suspect set (`computeEliminationSuspects`, `agent9-run.ts:2264`). R0 first step: A6-06 puts the matcher in one place.
- **Relates to:** A1X (identity-match), A9V (prose blind reader).

### A6-08 — Fair-play rule vocabulary
- **P2 · lens C/E · R1 (code) / R2 (prompt) · M**
- **Evidence (INFERRED).** Rule sets with different members, in 7 places:
  - `mystery-orchestrator.ts:1110` (Title Case)
  - `mystery-orchestrator.ts:415`
  - `STRUCTURAL_ESCALATION_RULES` (`agent6-escalation-policy.ts:11`)
  - `agent6-run.ts:201`, `:240`, `:2160`
  - `classifyFairPlayFailure` (`:100`)

  `hasCriticalFairPlayViolations` (`:461`) and `:2416` use a case-sensitive `has(v.rule)`; the others lowercase. The full-mode prompt (`agent6-fairplay.ts:735–762`) lists 9 checklist names, then asks 8 differently named checks with the example `"rule": "Clue Coverage"`. That name matches no code set. Which names the model actually emits today is UNVERIFIABLE; archived ANALYSIS_03 responses used the 9-point names.
- **Proposal.** Export a `FAIR_PLAY_RULES` const union from `agent6-fairplay.ts`. The prompt renders from it, `normalizeFairPlayAuditPayload` maps rule strings to canonical codes (reuse `normalizeViolationCode`, `:169`), and every set becomes a typed subset.

### A6-09 — The agent6→agent5 edge, and duplicated clue synthesis
- **P2 · lens A/C · R0 (move) / R1 (helper merge) · M**
- **Evidence.**
  - Agent 6 imports `enforceAgent5DeterministicContracts`, `buildStrictPromptFeedback` and `recomputeCoverageSnapshotForAgent6` (`agent6-run.ts:29–33`). They pull in most of the ~2,700-line checker and synthesiser library that sits above `runAgent5` in `agent5-run.ts`.
  - Agent 6's synthesisers repeat Agent 5's elimination backstop almost line for line: timeline normalisation, `nextId`, template choice, clone-and-push:
    - `ensureParityBridgeClue` (`:850`)
    - `ensureCriticalFairPlayBackstopClues` (`:982`)
    - `agent5-run.ts:2990–3050`, including `nextId` (`:3001` ≡ `agent6-run.ts:1001`)
  - Within Agent 6 itself:
    - `ensureParityBridgeClue` computes the same token list twice (`:856–860`, `:895–899`).
    - The backstop builds two near-identical clue blocks (`:1071–1095`, `:1113–1133`).
  - The elimination vocabulary also diverges. The structural audit accepts "rules out" and "clears" (`:781–786`); Agent 5's `isEliminationLike` (`agent5-run.ts:246`) does not.
- **Proposal.** Create `agents/clue-contracts/` containing the checkers, `enforceAgent5DeterministicContracts`, `buildStrictPromptFeedback`, a coverage snapshot, and a `createClueSynthesis(clues)` helper (`nextId`, `push(clue, bucket)`, index). Agents 5 and 6 both depend on it, and neither imports the other. `runDeterministicStructuralAudit` moves there as well (exported, but used only in its own file).
- **Relates to:** A5 (owner of the move), A6-04, A6-05.

### A6-10 — CML prompt-header projection has six bodies
- **P2 · lens C · R1 · M**
- **Evidence (MEASURED, by grep).** The prelude `legacy`/`cmlCase`/`meta`/title/primary axis/crime/culprit/false assumption/steps/discriminating test appears at:
  - `agent6-fairplay.ts:286`, `:369`
  - `agent7-narrative.ts:235`, `:528`
  - `agent8-novelty.ts:139`
  - `shared.ts:448`

  jscpd counts 38 duplicated lines between agents 6 and 7. The FA-1, FA-2 and FA-5 fixes (canonical primary axis, crime precedence, no non-schema step fallbacks) landed only in Agent 6. Agents 7 and 8 keep the old precedence.
- **Proposal.** `prompts-llm/src/shared/cml-prompt-view.ts` with `projectCaseForPrompt(cml) → CasePromptView` (derived once, ADR-0005 style), plus renderers for the recurring blocks: steps, discriminating test, constraint lists, clues by placement.
- **Verification.** Byte-equality of the prompts from all four builders on the golden CMLs. For CASE-shaped CML 2.0 the precedence differences are inert, because `meta.primary_axis` and `setup.*` are absent. Confirm that on the fixtures and the replay harness before calling it R1.
- **Relates to:** A7, A1X (agent8).

### A6-11 — `buildDeveloperContext`: derivation mixed with rendering
- **P2 · lens B · R0 · M**
- **Evidence.**
  - Lines `:369–534` derive (the cc of 63 comes from `?? / ||` fallbacks); `:536–667` is one template literal containing an IIFE.
  - The early, mid and late clue formatters are identical (`:612`, `:615`, `:618`).
  - The "Essential Clues" section re-lists descriptions already printed above: 3,045 of 22,772 developer characters on bundle 56049d93 (MEASURED).
  - Step coverage re-derives what the structural audit already computed.
- **Proposal.** Build `FairPlayAuditView` on top of `CasePromptView` (A6-10), then a flat renderer with a single `formatClueLine`. Dropping the duplicate essential listing is a separate R2 change of about 3 KB per full-mode audit.
- **Benefit.** cc 63 becomes about 30 in the derivation plus about 5 in the renderer. Byte-identical prompt (R0).

### A6-12 — `generateWorldDocument`: a pure validator, and unreachable gates
- **P2 · lens B/D · R1 · M**
- **Evidence (INFERRED).**
  - `completeHumourPlacementMap` runs inside `normalizeWorldDocumentStructure` (`:918`) and again at `:1118`. Its postcondition (all 12 positions, deduplicated, each rationale non-empty) makes the missing, duplicate and rationale gates (`:1121–1157`) unreachable.
  - Confirmations are rebuilt as 6 booleans (`:767`) and then forced to true (`:1162–1170`), so the gate at `:1172–1183` cannot fire.
  - The `lastError = …; if (attempt === 3) throw …; continue;` block is repeated 9×.
  - Model parameters are hard-coded; see A6-14.
- **Proposal.** Pure `validateWorldDocument(parsed, inputs): { ok: true, doc } | { ok: false, failure: WorldBuildFailure }` (A6-03). A loop of about 40 lines around it. Delete the ~55 lines of unreachable gates. Merge the three word-floor paddings into one `padToWordFloor`.
- **Verification.** Property tests on the postconditions of `completeHumourPlacementMap` and `buildDefaultValidationConfirmations`; `__testables` already exposes both.

### A6-13 — The safety net has holes
- **P2 · lens J · R0 · S**
- **Evidence (MEASURED, by grep).**
  - `runDeterministicStructuralAudit` has **no test**. The Agent-6 redesign calls it "the seed of the right idea", and it is the authority for escalation.
  - `guardrails.test.ts:412–509` "WP6A: classifyFairPlayFailure" tests a **local re-implementation** defined inside the test file, not the production function. The production function has extra rules for timing, parity and clue visibility.
  - `generateWorldDocument`'s retry builder has no test.
  - `perCallCostDelta` has no test (see §9 #1).
  - The fixtures use casts of 0–2, which hides A6-02.
- **Proposal.** Write these before any R1 step:
  - golden-bundle tests of the structural audit
  - point the WP6A tests at `agent6-escalation-policy.ts`
  - the A6-01 transcript tests
  - the A6-03 retry-builder test
  - a 7-member-cast fixture

### A6-14 — Dead config, fields, imports and flag parsers
- **P2 · lens D · R0/R1 · S**
- **Evidence (MEASURED).**
  - `agent65_world_builder.params.model.{temperature, max_tokens}` and `generation.default_max_attempts` are parsed and clamped (`generation-params.ts:1157–1161`) but never read. The code hard-codes 0.7, 12000 and 3 attempts. **The YAML still says `max_tokens: 6000`**, the very ceiling behind §5.4.
  - `WorldBuilderInputs.model` is never read.
  - `tsc --noUnusedLocals --noUnusedParameters` reports: unused imports `InferenceCoverageResult` and `FairPlayFailureClass` (`agent6-run.ts:24`, `:37`); unused parameter `clues` in `deriveRetryTargetedClueIds` (`:186`); unused `appendRetryFeedback` (`agent65-run.ts:15`); unused `ARC_DESC_GATE` (`agent65-world-builder.ts:309`).
  - `persistentRiskWarnings` is write-only.
  - `hasAbstractInferencePath` has a redundant branch (`agent6-escalation-policy.ts:50–55`): it is equivalent to `abstractMajority`.
  - In production `preAuditStructuralResult` always exists, so the LLM-signal fallback in `shouldEscalateStructuralCmlRevision` (`:128–137`) is unreachable. So is the `clue_only` branch (`agent6-run.ts:2334`) unless `canRunStructuralCmlRevision` is false.
  - The flags use three truthy vocabularies: `1|true|yes|on` (`:1214`), `1|true|on|enabled` (`:2008`), and `shared.ts:663`.
- **Proposal.**
  - Read the YAML values, set to today's 12000 / 3 / 0.7 so behaviour is byte-identical.
  - Delete the unused items.
  - Add `agents/agent6/flags.ts` with getters, following `agent9/flags.ts` (`parseBooleanEnv`), keeping each flag's current vocabulary for R0.
  - The unreachable escalation branches go with the redesign, not here.

### A6-15 — The warning channel erases floor firings
- **P2 · lens G · R2 (changes the report only; no prompt or chapter byte can differ) · S**
- **Evidence (INFERRED).** Pre-LLM backstop and parity-bridge repairs are emitted as `transient-diagnostic` (`:1541–1563`). When the audit passes, that set is cleared from `ctx.warnings` (`:2432–2434`), the durable record under ADR-0010. So on a passing run, which covers all four golden runs, the report no longer says the deterministic floor fired (contrary to ADR-0003's "logged as a floor firing"). Warnings emitted after `:2434` carry kinds that no longer mean anything.
- **Proposal.** Give `Agent6WarningChannel` a `floor` kind that is never cleared, or use a structured diagnostic.

### A6-16 — LLM calls a deterministic check could avoid (P3 · lens I · R2 · S)
- **Call map.**
  - **Default mode** (retries OFF): 1 audit + 1 blind read (×k when `MAJORITY_K` ≥ 2), plus 1 rescue re-read if the read fails, plus 1 early+mid read if the reveal gate is on. Maximum 4.
  - **Retries on:** up to 6 audits, 3 Agent-5 regens, 3 blind reads and 1 Agent-4 revision, 13 calls in all, capped at $0.15 (with the leak in §9 #1).
- **Avoidable or improvable calls:**
  1. The post-revision "provisional" audit (`:2270`) grades *old* clues against the *new* CML only to produce feedback, which A6-02 then drops. The deterministic structural audit gives the gaps for free.
  2. The rescue re-read (`:1969`) re-samples an identical prompt whenever the contracts changed nothing the reader can see. Digest the `[placement] description` projection first.
  3. The fair-play retry in narrative mode sends structural contract feedback about structure the deterministic audit already passed.
  4. The majority-of-k samples are awaited in sequence (`:1752`); `Promise.all` keeps the index order.
  5. In default mode the audit and the primary read are independent, and could run concurrently (saves one read's latency; ADR-0002 allows it).
  6. With no late clues, the early+mid read is byte-identical to the primary read.
- **Model routing.** `AGENT6_MODEL` can never take effect: both calls pass an explicit `resolveDesignModel()`, which wins at `llm-client/src/client.ts:264`. Both Agent-6 labels would share one env var anyway.

### A6-17 — World Builder prompt economy (P3 · lens I · R2 · S)
- **Evidence (MEASURED, by replicating `:308–336` on the golden bundles).**
  - The INPUTS section is 83–89 KB of pretty-printed JSON; 15% (~13 KB, ≈3.3k tokens) is indentation.
  - Solution and structure sections (hidden model, culpability, inference path, …) are about 53% of the 24–27 KB CASE block. They go to an agent told not to name the culprit or describe clues forensically.
  - The system prompt hard-codes "300 words" (`:247`) while the user message uses the configured value (`:352`).
  - Cost context: the World Builder was the most expensive non-Agent-9 stage on `mystery-1787681973166` ($0.193, 9%; `agent-model-router.ts:11`), for up to 3 × 2 calls.
- **Proposal.**
  - Compact JSON.
  - A CASE projection that keeps what `revealImplications` and `breakMoment` need.
  - Render the word minimum from config.

  All need a probe. The stable instructions come after the volatile inputs, but the caching gain is negligible: runs are hours apart, and retries within a run already share the prefix.

### A6-18 — Types and the JSON boundary (P3 · lens E · R0/R1 · M)
- **Evidence.**
  - `CaseData = any` (`packages/cml/src/index.ts:105`). `agent6-run.ts` has 54 `any` and 15 `(cml as any)?.CASE ?? cml` derivations; discriminating evidence IDs are derived 4× (`:127`, `:195`, `:492`, `:697`).
  - `(ctx as any).errors` and `.hardLogicDevices` (`:468`, `:486`) cast fields that are already typed on `OrchestratorContext`.
  - `parseJsonWithRepair` (`agent6-fairplay.ts:91–133`) and `agent65-world-builder.ts:1058–1073` each hand-roll the truncation-guarded parse, while `shared/json-boundary.ts:40` `guardedJsonrepairParse` has **zero production callers**.
- **Proposal.** A `caseOf(cml)` accessor and a typed `Agent6CaseFacts` read once. Both boundaries move onto `guardedJsonrepairParse`. This is R1 for Agent 6, whose extra brace-extraction fallback needs a characterisation test.

### A6-19 — Death-method vocabulary (P3 · lens C · R0 / R2 · S)
- **Evidence.** `DEATH_METHOD_TOKENS` (`agent6-reveal-gate.ts:86–96`) is a copy of `rubric-score/src/facts.ts:34–45` (jscpd, 12 lines). It is "kept local to avoid a worker→rubric-score dependency", but the worker already imports `@cml/rubric-score` (`mystery-orchestrator.ts`, `agent9-replay.ts`). Resolution also diverges: the gate takes the first non-empty field, while rubric-score scans a concatenated haystack.
- **Proposal.** Export one table and import it (R0). Unifying the resolution logic changes gate verdicts (R2).

## 4. Target structure

```
apps/worker/src/jobs/agents/
  agent6-run.ts                   ~150  coordinator: config → floor → audit loop → blind reader → escalation → finalize → reveal gate
  agent6/state.ts                  ~80  Agent6Config, CaseFacts (re-derivable), Agent6RunState
  agent6/warnings.ts               ~60  Agent6WarningChannel (progress | diagnostic | risk | floor)
  agent6/budget.ts                 ~50  FairPlayBudget (per-call deltas, seeded baselines)
  agent6/flags.ts                  ~40  getters (parseBooleanEnv)
  agent6/preaudit-floor.ts        ~120  applyFairPlayFloor + structural audit call
  agent6/audit-loop.ts            ~120  reaudit(), regenerateClues(), fair-play loop
  agent6/blind-reader.ts          ~160  safeBlindRead, predicate, gate + remediation + rescue
  agent6/structural-escalation.ts ~250  context synthesis, revision instructions, revise → regen → re-audit
  agent6/retry-feedback.ts        ~200  pure feedback builders (A6-02); move to prompts-llm later
  agent6-reveal-gate.ts            218  unchanged
  agent6-escalation-policy.ts     ~110  minus the unreachable fallback (with the redesign)
  clue-contracts/                       with A5: checkers, enforcer, synthesis helper, structural audit
packages/prompts-llm/src/
  shared/cml-prompt-view.ts       ~150  CasePromptView + block renderers (serves 6, 7, 8)
  agent6-fairplay.ts              ~700  view-based builders, FAIR_PLAY_RULES, guardedJsonrepairParse
  agent65-world-builder.ts       ~1150  validateWorldDocument, buildWorldBuilderRetryMessage, ~40-line loop
packages/story-validation/src/scoring/phase-scorers/agent6-fairplay-scorer.ts  ~50
```

## 5. Suggested sequence

1. **Tests first (A6-13).** Structural-audit golden tests; fix WP6A so it imports production code; `runAgent6` transcript snapshots with retries on and off; a 7-member-cast fixture.
2. **R0 hygiene (A6-14, A6-06 predicate, A6-18 casts).** Unused items, `agent6/flags.ts`, `blindReaderSamplePasses` at all 4 sites.
3. **A6-05.** Typed contract errors; delete the dead ladder.
4. **A6-01 moves.** State objects, warning channel, budget, scorer. Byte-equal transcripts.
5. **A6-04 and A6-06 guard merge, `reaudit` / `regenerateClues` (A6-01 R1).** Transcripts still byte-equal, except where A6-04 changes the post-revision ordering: take that as an explicit, owner-signed R2.
6. **A6-12, A6-11, A6-10** (the prompt-side splits, byte-equal prompt tests), then **A6-09** jointly with A5.
7. **Owner-gated R2 changes, each a separate probe:** A6-02, A6-03 (smallest first: pass `retryFeedback`), A6-15, A6-07, A6-08 prompt, A6-16, A6-17.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `AGENT_PRE9_ENABLE_LLM_RETRIES` | OFF | `shared.ts:662` via `agent6-run.ts:1395` (also `executeAgentWithRetry`) | unregistered, "default OFF" (Addendum 5) | Gates roughly 55–60% of `runAgent6`: the audit retry, remediation, escalation, WP8A. Default runs use none of it. Every A6-02 and A6-16 path lives behind it. |
| `AGENT6_BLIND_READER_BLOCKING` | OFF | `:2008` | default OFF | Its own truthy list (`enabled`, no `yes`) |
| `AGENT6_BLIND_READER_MAJORITY_K` | 1 | `:1743` | CONFIG | Sequential sampling |
| `AGENT6_DT_EVIDENCE_COMPLETENESS` | OFF | `:1214` | SET `true` in `.env.local` | Read twice per call (`:1222`, `:1267`) |
| `AGENT6_REVEAL_GATE` | off | `:2468`, `retry-gate-guard.ts:52` | SET in `.env.local` | Clean: `parseRevealGateMode` |
| `AGENT6_MODEL` / `AGENT65_MODEL` | unset | `client.ts:264` | router | `AGENT6_MODEL` has no effect (A6-16); `AGENT65_MODEL` works |

## 7. Safety net

**Pinned today:**
- `agent6-run.test.ts` (764 lines; helpers through `__testables`)
- `agent6-run-flow.test.ts` (3 flows, mocked LLM)
- `agent6-reveal-gate.test.ts`
- `agent6-dt-evidence-completeness-rc34.test.ts`
- `warning-channel-aliasing.test.ts`
- prompts-llm: `agent6.test.ts` (prompt substrings), `agent6-fairplay.test.ts`, `agent65-world-builder.test.ts` (helpers only)

**Gaps:** listed in A6-13, plus the escalation branch (`reviseCml` path) and reveal-gate enforce in the flow tests.

**Characterisation tests to write first:**
- Mock-call transcripts and warnings/cost snapshots for `runAgent6` (retries on and off; a blind-read failure; a content-filter refusal at each of the 3 sites).
- Byte snapshots of the audit prompts (both modes) and the World Builder user message on the four `eval/golden` bundles. They are free and deterministic, and `buildFairPlayPrompt` is already exported.
- The `agent9-replay.ts` harness does not reach Agent 6, so it cannot serve as a net here.

## 8. What NOT to refactor

- **The pre-LLM floor ordering (P4).** Floors run *before* the LLM audit, which inverts ADR-0007's ladder at the clue stage. It is deliberate ("LLM audits the already-patched state"). Changing it is R2 and belongs to the redesign.
- **Catch-and-continue around blind reads.** It is policy (X33, A_53 P2), not sloppiness. Keep the narrow content-filter guard; A6-06 only merges the copies.
- **`clearWarningsInPlace` in-place mutation.** Array identity is load-bearing (`:1439–1460`).
- **`enforceCastCoverage`'s victim exemption and reordering.** It closes abort classes #2 and M1.
- **The 6.5 word floors.** They are ADR-0003 floors. Only their loop mechanics merge.
- **Deleting the escalation policy, backstops or blind-reader loop.** That is the redesign's decision (ADR-0011: needs probes), not a refactor.

## 9. Incidental defects

1. **The retry budget never charges the first retry of each cost source.** `perCallCostDelta` (`:1477`) sets its baseline on first observation, which happens *after* the first in-loop call (audit attempt 2, the first regen, the first remediation re-read, the revision). Up to four calls go unbudgeted, contrary to the comment's own intent. High confidence (INFERRED). Fix: seed baselines before the loop, or return `estimatedCost` in `ChatResponse` (it is computed at `client.ts:388`).
2. **The default break-moment character is the detective.** `chooseBreakMomentCharacter` (`agent65-world-builder.ts:731–742`) filters on `member.role`, but CASE.cast carries only `role_archetype` (MEASURED: all four golden casts, and `cast[0]` is the Inspector). This is the same bug that `b5d822a8` fixed 90 lines lower. It is latent: it fires only when the model omits the field. High confidence.
3. **The structural audit treats the detective and victim as non-culprit suspects** (`:766–769`). MEASURED: the detective appears in `eliminationMissing` on all four golden bundles, and the victim on one. Advisory impact only.
4. **The blind reader is told the detective and victim are "suspects"** (`:1721`, `agent6-fairplay.ts:911`). Medium confidence on impact.
5. **Stale state after a CML revision (retries arm).** P7's verdict and P10's inputs (`:1720–1723`) describe the pre-revision CML and clues. Medium confidence.
6. **The post-revision floor discards its repairs** (`:2308`): no telemetry (ADR-0010). High confidence.
7. **T2.1 false positive on shared surnames** (A6-07). With the reveal gate in enforce mode this can block. Medium confidence.
8. **The backstop can emit a "contradiction" clue with the same text as its observation clue** when a step has no `correction` (`:1057–1111`). Low severity.
9. **`synchronizeClueTraceabilityFromCurrentClues` creates empty `prose_requirements` / `discriminating_test_scene` objects even on a no-op** (`:1227–1228`). Low severity.

## 10. Cross-area observations

- **Retry feedback that ignores the failure.** Detect it repo-wide with:
  - a grep for `executeAgent` callbacks with an unused or `_`-prefixed `retryFeedback`;
  - a grep for `.slice(0, N)` over arrays where constants are spread before failure-derived items;
  - a property test per retry builder: two failure classes must differ within the rendered cap.
- **Cumulative `byAgent` cost reads.** 26 sites read `getSummary().byAgent[label]` and so must diff by hand (the A_53 P3 class). Return per-call cost from `chat()` (ORC).
- **Role predicates.** `role` vs `role_archetype`, and substring vs head-noun matching, keep recurring; `identity-match.ts` and `@cml/cml/roles.ts` each export an `isDetectiveArchetype` (A1X, ORC).
- **Inline grade ternaries** duplicate `calculateGrade` (agents 3, 5, 6: SCO).
- **The "if scoring then `executeAgentWithRetry` else a direct call" duplication** in every enrichment runner (jscpd flags agent2d⇄agent65; ORC).
- **`guardedJsonrepairParse` has no production callers**, while at least two boundaries hand-roll it (ORC).
- **Unit-test fixtures smaller than production** (casts of 0–2 vs 7) hid A6-02. Check other areas' fixtures.

## 11. Open questions for the owner

1. **A6-02 and A6-03** change retry prompts only on the `AGENT_PRE9_ENABLE_LLM_RETRIES` arm. Is that arm still intended to be probed, or should its code wait for the redesign?
2. **Agent 6.5 is treated as "creative texture"** for scoring (A_53 P2), yet three parse failures abort the run. `normalizeWorldDocumentStructure({})` already yields a complete default document. Should a failed generation degrade to that, with a floor warning?
3. **Can the post-revision provisional audit (A6-16 #1)** be replaced by the deterministic audit without a probe, given that its output feeds a payload A6-02 shows is mostly discarded?
4. **Should `AGENT6_MODEL` be made effective**, with separate labels for the auditor and the blind reader (the ".env.local.example" low-risk tail)?

# 01 — Agent 9 worker orchestration

**Scope:** `apps/worker/src/jobs/agents/agent9-run.ts` (7,602 lines, 5,805 code), `agent9/flags.ts` (150 / 26), `agent9/prose-text.ts` (182 / 132) — 7,934 lines, 5,963 code · **Read:** every line · **Written:** 2026-09-25
**Finding prefix:** A9W · **Method:** [RUBRIC.md](../RUBRIC.md)

Two-body candidates in `packages/prompts-llm/src/agent9-prose/{generate,deterministic-repair,sanitization}.ts`, `shared/clearance-vocabulary.ts`, `shared/locked-fact-atoms.ts`, `story-bible.ts`, `story-contract.ts`, `types/narrative-state.ts`, `packages/cml/src/timeline-deception.ts` and `packages/story-validation/src/opening-grounding-vocabulary.ts` were read far enough to confirm or rule out each pair.

## 1. What this area does

`runAgent9(ctx)` (`agent9-run.ts:3646–7602`) is the ship layer around `generateProse()`. Its phases (line ranges used for the measurements below):

| # | Phase | Lines | What it does |
|---|---|---|---|
| P0 | setup | 3646–3705 | destructures ctx, resets package telemetry, preconditions, flag snapshot |
| P1 | CML preflight | 3707–3867 | DT-scene stub backfill, culprit-role lock, lifecycle/schema/usage validation, clue-namespace repair, outline gate (all may throw) |
| P2 | guardrails | 3869–3945 | baseline + upstream prompt guardrails |
| P3 | world state | 3947–4066 | locked facts, `repairCaseSoundness`, `buildStoryWorldState`, contradiction gate, discriminator verifier |
| P4 | locked facts + temporal | 4068–4208 | chapter scoping, clue-time mismatch (abort), cross-artifact conflicts (warn) |
| P5 | NSD / resume / models | 4210–4372 | gender map, `initNarrativeState`, checkpoint load, deployments, batch size |
| P6 | scoring helpers | 4374–4473 | closures used later |
| P7 | generation | 4475–4873 | StoryContract, `generateProse` + 279-line `onBatchComplete` (shadow NSD, trace, scoring, checkpoint) |
| P8 | regen ladder | 4875–5217 | standard hygiene chain + 6 flag-gated regen passes |
| P9–P10 | first-pass score, schema repair | 5225–5625 | `buildPostGenerationSummaryDetails`, full re-generation on schema failure |
| P11 | pre-validation floors | 5627–6019 | locked-fact regen + floor, RC1.4 regens, pronoun regen, injector floors, sweeps, walk-ons, scaffold ship-check |
| P12–P15 | validation + rescue ladders | 6021–6608 | up to 9 `validateCurrentProse` calls, three deterministic repair chains, G6 read-back gate, softening, autofix |
| P16 | geometry acceptance | 6610–6965 | Agent 7.5 contract check + repairs |
| P17–P18 | report + release gate | 6967–7510 | summaries, blind reader, NSD-anchor repair, reason classification, hard stop |
| P19–P20 | full-story diagnostic, commit | 7512–7602 | post-gate diagnostic; `ctx.prose = prose` |

Lines 1–3645 hold 99 top-level helpers (temporal parsing, locked-fact repair/injection, cast-role logic, lifecycle/pronoun repairs, injector floors, post-processing, gate classifiers, NSD-anchor repair, geometry maps). **In:** 14 upstream artifacts on `ctx`. **Out:** 13 `ctx` fields (`prose`, `validationReport`, scoring series, `nsdTransferTrace`, `discriminatingContradiction`, `agentCosts/Durations`, `agent9InjectorLint`…), 112 `ctx.warnings.push` and 19 `ctx.errors.push` sites, 11 diagnostics upserts. The file header (`:11-13`) lists only 10 of the outputs.

## 2. Verdict

The area is correct-by-accretion: every block carries its board reference, and 172 helper tests pass, but `runAgent9` itself has **no test at all** and is a 3,957-line, cc-605 sequence of phases that talk through **78 shared bindings** (MEASURED, below). The complexity is not the ship-layer logic — each phase is simple — it is that every phase can read and reassign everything (`prose` is reassigned at 32 sites), so no phase can be lifted out without an explicit state type. The costliest problems are not size but **second bodies of concepts the package already owns**: a shadow NarrativeState whose beat history and atom stamps never reach fresh-run prompts (A9W-02), a regen "bible" with an empty beat sheet that drops the culprit embargo on every worker-side regen (A9W-03), and nine derivations of "who is the victim/suspect" including three still in the X50 bug shape (A9W-04). The single most valuable change is to introduce the typed state objects of §4 and extract the phases behind them (A9W-01), starting with the R0 phases, after landing the ship-layer characterization test (A9W-15).

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| A9W-01 | P1 | B | `runAgent9` → ~350-line coordinator over typed phase functions | R0→R1 | L (5–7 d) | ~−150 (3,957 moved) |
| A9W-02 | P1 | C | Two NarrativeState bodies; worker copy never reaches prompts | R2 | M | −90 |
| A9W-03 | P1 | C | Two Story Bibles; 11 worker regens run with `beatSheet: []` (no embargo) | R0 then R2 | S+M | −20 |
| A9W-04 | P1 | C | 9 derivations of victim/suspect/detective; 2 culprit-role repairers | R1/R2 | M | −150 |
| A9W-05 | P1 | E | `prose: any` / `validationReport: any` discard existing types; 405 `any` | R0 | M | ~0 (−450 any/casts) |
| A9W-06 | P1 | C | Regen-stage wrapper repeated ×10 | R0 | S | −200 |
| A9W-07 | P2 | C | Clearance floor ×2 and evidence vocabulary ×3 | R0 + R2 | S | −15 |
| A9W-08 | P2 | C | Clock/duration parsing ×3; `classifyFactValue` ignores A_58 | R2 | M | −150 |
| A9W-09 | P2 | C | 7th copy of the opening-grounding vocabulary (X95 missed it) | R1 | S | −15 |
| A9W-10 | P2 | C | Pronoun repair: 6 call sites, 4 guard policies, a package twin | R1 (+R2) | M | −120 |
| A9W-11 | P2 | B/G | Injector floor chain ×3 with divergent guards, after the "last write" | R1 | M | −60 |
| A9W-12 | P2 | A | Helper layer (3,645 lines) → 12 modules behind re-export shims | R0 | M (2 d) | −40 |
| A9W-13 | P2 | D | Flag surface has leaked back out of `flags.ts` | R0 | S | ~0 |
| A9W-14 | P2 | D | Compiler-proven dead code and a vestigial counter | R0/R1 | S | −70 |
| A9W-15 | P1 | J | No test reaches `runAgent9`; golden ship-layer test first | R0 | M | +300 (tests) |
| A9W-16 | P3 | C | Micro-duplication (regex escape ×18, honorifics ×4, deaths ×3, args ×2) | R0/R1 | S | −90 |
| A9W-17 | P3 | I | Re-validation ×9 re-pays uncached semantic LLM fallbacks | R1 | S | +20 |
| A9W-18 | P3 | H | O(n²) cumulative chapter scoring — negligible | R1 | S | −30 |
| A9W-19 | P2 | G | Growth guard: size ratchet in `pretest` | R0 | S | +60 (script) |

### A9W-01 — Decompose `runAgent9` into phase functions over explicit state

- **P1 · lens B · R0 (R0 phases) → R1 (stateful phases) · L (5–7 days)**
- **Evidence (MEASURED):** a TS-compiler scan of the function body (scratchpad `a9w/closure-state.cjs`) finds **147 top-level bindings** (16 `let`, 12 function-valued). **70 are read in a later phase than declared, 42 are captured by a named nested closure; the union — the real threading set — is 78**: 10 `ctx` destructures, 14 `ctx` artifact aliases, **54 derived in-function**. REVIEW_03 §0h's "~100 closure variables" is the right order of magnitude; the honest figure is 78, of which only 54 need a home. Reassigned outer lets: `prose` ×32 (reassigned by P7, P8, P10, P11, P12, P14, P15, P16, P18, P19), `validationReport` ×8, `postRepairValidationSummary` ×8, `narrativeState` ×7 (6 inside `onBatchComplete`), the two culprit-gate counters ×2 each, `entityPronounDriftCount` ×1. Per-phase inputs: P1 10, P2 5, P4 4, P7 35, P10 31 (the duplicated `generateProse` argument bag), P13 5, P16 14, P18 23, P19 6. `ctx` itself is read for 37 distinct properties.
- **Proposal:** the state objects and phase signatures in §4. Extract in the order of §5: phases with no outer reassignment first (P1, P2, P4, P13, P17 summary builder, P18 classifier, P19) as R0 moves with explicit parameters; then introduce `ShipState` and move P8, P11, P12, P14–P16 (R1 — each must return the new `prose`/`validationReport` instead of assigning the outer `let`). `onBatchComplete` becomes `makeBatchCompleteHandler(gen: GenerationState, env, prepared)` in `agent9/phases/generation.ts`; after A9W-02 it drops to ~150 lines/cc ~25.
- **Benefit:** the 3,957-line/cc-605 function becomes a ~350-line coordinator (cc ≈ 40) calling ~14 phase functions, none over ~400 lines; each phase declares what it reads and writes, so an ordering bug ("injector after the last write", A9W-11) becomes visible in a signature. Largest remaining function: `evaluateReleaseGate` (~250 lines, pure).
- **Verification:** A9W-15's golden test byte-identical before/after each move; `tsc`, the 19 existing test files, `build:all`, `preflight-dist-check`.
- **Relates to:** A9W-05 (types are the state objects), A9W-12, A9W-15, A9W-19.

### A9W-02 — The worker keeps a shadow NarrativeState that prompts never see

- **P1 · lens C/G · R2 · M**
- **Evidence (INFERRED, high confidence on data flow):** `onBatchComplete` (`agent9-run.ts:4589-4676`) re-derives what `generate.ts:4033-4061` already computed as `liveNarrativeState`: batch clue ids, the arc-position ladder (`:4603-4610`, identical to `generate.ts:2331-2338`; three more copies at `prompt-builder.ts:204`, `:1616`, `story-bible.ts:207`), `updateNSD`, and victim-death detection with a **different vocabulary** (`:4637` lacks `strangled|shot|stabbed`, `generate.ts:4053` has them) and a different victim source. `checkNSDParity` (`:4664`) then compares the two bodies and **throws** on clue divergence. Worse, only the worker copy stamps obligation/texture atoms (`:4647`, `:4656`) and appends `beatHistory` (`:4619-4625`); `updateNSD` (`types/narrative-state.ts:198`) does neither, and prompts read `liveNarrativeState` (`generate.ts:2480`). So on a **fresh** run `selectChapterAtoms`' reuse budget (`asset-library.ts:175`) and the "BEATS ALREADY PLAYED"/recently-interrogated guards (`obligation-block.ts:129`, `:861`) see empty state; on a **resumed** run they see the worker's copy (checkpoint → `generate.ts:2205`). The `asset_deployment` diagnostic (`:6967`) reports a state the prompts never used. The victim-death blocks are also near-dead: BLUE-5 (`:4242-4256`) pre-sets `victimConfirmedDeadChapter = 1` whenever a victim is identifiable.
- **Proposal:** make the package the single NSD owner: `onBatchComplete` receives the full post-batch `NarrativeState` (move atom stamping and beat fingerprints into `generate.ts` next to `updateNSD`); the worker adopts it for checkpoint and diagnostics; `checkNSDParity` moves to a test. Export one `arcPositionFor(chapter, total)` from `constants/arc-position.ts`.
- **Benefit:** removes ~90 worker lines and the parity-abort class; one arc ladder instead of five; atom rotation and beat-history guards actually operate on fresh runs.
- **Verification:** behaviour change to prompts (atoms/beats start flowing) → flag (`AGENT9_NSD_SINGLE_OWNER`, default OFF) + N≥4 probe per ADR-0004. The pure part (single arc ladder, byte-identical outputs) is R1 with a unit test over chapter/total grids.
- **Relates to:** A9W-04 (victim source), §9 items 3–4, area covering `generate.ts`.

### A9W-03 — Two Story Bibles: worker regens run without the culprit embargo

- **P1 · lens C (ADR-0005) · R0 step, then R2 · S + M**
- **Evidence (MEASURED counts, INFERRED effect):** the package builds the full Bible (`generate.ts:2726`, `buildStoryBible` with beat sheet). The worker builds `buildStoryWorldState` (`:3979`) from un-annotated locked facts and a victim found by `/victim/i` on `role_archetype ?? role` (`:3976`, the X50 shape), and passes `{ ...worldState, beatSheet: [] }` to every regen — **11 constructions** (`:4919, 4962, 5015, 5078, 5117, 5173, 5667, 5760, 5858, 6710, 7145`). With no beat, `embargoForBeat` returns `[]` (`regen-integration.ts:71-80,154-162`), so every worker regen request has `mustNotReveal: []` — including the mechanism pass that only runs on pre-DT chapters, the unflagged NSD-anchor plant, and the default-ON scaffold regen. `buildStoryBible` is imported and never used (`:39`, TS6133).
- **Proposal:** (R0) one `const regenBible = { ...worldState, beatSheet: [] }` in `PreparedCase` with a comment naming the gap; (R2) build the Bible once in the worker (`buildStoryBible` from the same inputs as `generate.ts`), pass it into `generateProse`, and use it for worker regens behind a flag.
- **Benefit:** −20 lines now; one Bible, one victim, embargo restored on 12 regen channels.
- **Verification:** step 1 byte-identical; step 2 changes regen prompts → flag + probe; count `mustNotReveal` non-empty requests in `llm-prompts-full.jsonl`.
- **Relates to:** A9W-02, A9W-04, A9W-06.

### A9W-04 — Nine derivations of "victim / suspect / detective"; two culprit repairers

- **P1 · lens C (ADR-0005) · R1 for the projection, R2 for merging repairs · M**
- **Evidence (INFERRED):** victim: `getVictimNameSet` `:1280` (coalesces `role_archetype ?? roleArchetype ?? role` — the X50 bug shape), `enforceCmlCulpritRoleIntegrity` `:1332` via `roleTextForIntegrity` `:1309` (a *different* coalescing order), `computeEliminationSuspects` `:2304` (correct `roleTextsOf`), `computeLiveCulprits` `:2384` (exact equality on `role`/`role_archetype`), `worldStateVictim` `:3976` (substring, coalesced), BLUE-5 `:4244`, `resolveVictimName` `:4631`, `storyContract.victim` `:4490`; suspects: `computeEliminationSuspects`, `isSuspectRole` `:4031`, `blindSuspects` `:7037`; plus package copies (`deterministic-repair.ts:94,862,958`). `enforceCmlCulpritRoleIntegrity` (`:1318`, 116 lines, mutates CML) and `repairCaseSoundness` (`case-soundness-repair.ts:69`) both repair culprit/victim collisions on the same CASE, 215 lines apart (`:3753`, `:3968`); the worker one truncates to a single culprit (`:1383-1387`).
- **Proposal:** `agent9/cast-roles.ts`: `resolveCastRoles(cml, castDesign) → { victims, detectives, suspects, culprits, byName }` computed once in P3 and carried in `PreparedCase` (and later sourced from the Bible); all nine sites dereference it. Fold `enforceCmlCulpritRoleIntegrity` into `repairCaseSoundness` (one repairer).
- **Benefit:** ~−150 lines; closes the X50 class for the three sites still coalescing.
- **Verification:** projection: characterization table over the archived casts (both Agent-2 camelCase and CASE snake_case shapes) asserting today's per-site outputs, then switch site by site; merging the repairers changes CML mutations → R2.
- **Relates to:** A9W-03, cross-area (agent 2/3 role vocabularies).

### A9W-05 — A typed boundary already exists; `runAgent9` casts it away

- **P1 · lens E · R0 · M**
- **Evidence (MEASURED, AST scan `a9w/anyscan.cjs`):** 405 `any` (helpers 185, `runAgent9` 220), 214 casts + 13 `as const`. By object typed: prose/chapter/paragraph 132 `any` + 66 casts; cast entries 67 + 41; CML 57 + 44; validation report 32; `prose.validationDetails` 21 + 21; clues/NSD 18 + 5. `OrchestratorContext` already types `prose?: ProseGenerationResult`, `validationReport?: ValidationReport`, `cast?: CastDesignResult` (`shared.ts:260-320`), and `ProseGenerationResult.validationDetails` is fully typed (`agent9-prose/types.ts:203-272`), yet `let prose: any` (`:3947`), `let validationReport: any` (`:6038`), `validateCurrentProse(): Promise<any>` (`:6031`). `CaseData` is `export type CaseData = any` (`packages/cml/src/index.ts:105`), so the 32 `(cml as any)` casts are noise — and it is why `cml.CAST` (a key the schema does not have) compiles (§9 item 3).
- **Proposal:** `agent9/types.ts`: `WorkerProse = ProseGenerationResult & { pronounRepairsApplied?; groundingLeadReverts?; validationDetails?: … & { storyGeometry?; fullStoryDiagnostic? } }`; type `prose`, `validationReport`, and helper signatures (`(prose: WorkerProse) => WorkerProse`); a `ChapterMap` helper `mapChapters(prose, fn)` replaces 15 `(prose.chapters as any[]).map`. Type `CaseData` minimally (`CASE` shape actually read here) — cross-area with `packages/cml`.
- **Benefit:** ~−250 `any` and ~−150 casts from `prose`/`validationDetails`/report alone; the compiler checks the 60 report-field reads in the two summary builders.
- **Verification:** type-only → ADR-0004 exempt; `tsc` + tests.
- **Relates to:** A9W-01, §10.

### A9W-06 — The regen-stage wrapper is written out ten times

- **P1 · lens C (boilerplate) · R0 · S**
- **Evidence (MEASURED):** 12 `getCostTracker().getTotalCost()` snapshots, 12 `cost +=` finalisers, 10 `… pass failed:` catches, 12 `makeRegenFn({ client, model: regenDeployment, runId, projectId })`, 11 regen-bible spreads, 9 `Array.isArray(prose.chapters) && prose.chapters.length > 0` guards, 13 `applyStandardPostProcessingChain` calls (`:4916-5217`, `:5664-5906`, `:6635-6964`, `:7126-7176`, `:7524-7590`).
- **Proposal:** `agent9/regen-stage.ts`: `runRegenStage(state, env, { id, enabled, run: (deps) => Promise<void>, hygiene: boolean })` owning the flag check, cost bracket, catch-and-warn (ADR-0003: catch-and-continue is policy — keep it), and the post-stage hygiene call; `id` matches `REGEN_PASS_REGISTRY` so the ladder order is data.
- **Benefit:** ~−200 lines; one place for the cost bracket; the worker ladder becomes enumerable like S3 made the package passes.
- **Verification:** byte-identical warnings/prose under A9W-15; R0 because each wrapper body is moved verbatim.
- **Relates to:** A9W-01, A9W-03.

### A9W-07 — The clearance floor has two bodies and the evidence vocabulary three

- **P2 · lens C · R0 (vocabulary import) + R2 (predicate merge) · S**
- **Evidence (MEASURED by reading):** worker `enforceSuspectEliminationPresence` (`:2325`) judges "already cleared" over the **whole chapter** with case-sensitive `includes` (`nameInTextShared` `:2130`) + `CLEARANCE_TERMS_RE` + local `EVIDENCE_TERMS` (`:2342`); package `applyDeterministicClearancePatch` requires **one-paragraph co-location** with a `\b`-regex (`deterministic-repair.ts:514-525`). `EVIDENCE_TERMS` is byte-identical to the package's local `CLEARANCE_EVIDENCE_RE` (`deterministic-repair.ts:68`), whose comment claims it is "single-sourced; see shared/clearance-vocabulary.ts" — but the shared export of the **same name** has a different list (`clearance-vocabulary.ts`: `witness|saw|seen|account`, no `which proves|constraint|observation`). Injector telemetry also has two mechanisms: X4 `recordAgent9Injection` (worker floors only) and module-level paste counters (package floors only).
- **Proposal:** export the current literal as `CLEARANCE_EVIDENCE_CONNECTORS_RE` from `shared/clearance-vocabulary.ts` and import it in both (R0); one `hasReasonedClearance(text, name)` predicate for both floors (R2); pass an `InjectionRecorder` into `generateProse` so package floors report through X4 (R1).
- **Benefit:** one vocabulary, one predicate; floor-firing counts (ADR-0003's quality signal) complete in one place.
- **Verification:** R0 step trivially byte-identical; predicate merge changes which chapters get a paste → flag + `deterministic_clearance_paste_count`.
- **Relates to:** architecture/README §5 (known two-injector trap).

### A9W-08 — Three clock/quantity parsers; the worker copy has lost a board's lesson

- **P2 · lens C · R2 · M**
- **Evidence (MEASURED):** worker `WORD_TO_NUM`/`parseWordFormTime`/`extractDigitFormHour`/`parseWordFormQuantity`/`extractTemporalAnchorSignals` (`:429-734`); `@cml/cml` `parseClockTime`/`parseDurationMinutes` (`timeline-deception.ts:100,328`, corpus-hardened, already imported here for geometry `:79-83`); `shared/locked-fact-atoms.ts` `CLOCK_TIME_RE`/`UNIT_RE`. Gaps: `WORD_TO_NUM` lacks fifty-one…fifty-four/fifty-six…fifty-nine; `halfPast` bypasses the midnight/noon resolver (`:468-472`). `classifyFactValue` (`:1118`) treats a bare `to` as clock context — the exact A_58 error `locked-fact-atoms.ts:22-26` fixed. Offline probe of the built dist (`a9w/probe-floor.mjs`): value "thirty paces to the gate" makes the floor write **"It was thirty paces to the gate by the mantel clock."**
- **Proposal:** `agent9/temporal.ts` delegates parsing to `parseClockTime`/`parseDurationMinutes` (convert dial minutes); `classifyFactValue` reuses `CLOCK_TIME_RE`/`UNIT_RE` from `locked-fact-atoms.ts`.
- **Benefit:** ~−150 lines; one parser per concept (the X38 doctrine already stated at `:80-81`).
- **Verification:** parse the archived locked-fact values with both bodies and diff; repair/injection outcomes change where they differ → R2, flag.
- **Relates to:** §9 items 1–2.

### A9W-09 — The release gate grades grounding against a seventh vocabulary

- **P2 · lens C · R1 · S**
- **Evidence (MEASURED):** `GROUNDING_SENSORY_SOURCE`/`GROUNDING_ATMOSPHERE_SOURCE` (`:327-333`) — A_52's "single source" — predate X95 (`story-validation/src/opening-grounding-vocabulary.ts`), which collapsed six copies and missed this one. Divergences: the worker accepts `weather` and `lighting` (X95 removed `weather` deliberately) and lacks `light`; it matches `\b…\b` where the validator matches substrings; and it counts **occurrences** (`match(/g).length`, `:420`) where the validator counts **distinct terms** (`countGroundingMarkers`). So `sceneGrounding.coverage < 0.9` (`:7319`) warns on chapters the chapter validator passes and vice versa.
- **Proposal:** import `OPENING_SENSORY_MARKERS`, `OPENING_ATMOSPHERE_MARKERS`, `countGroundingMarkers`; keep only the location-anchor check local.
- **Benefit:** one grounding definition; −15 lines.
- **Verification:** prose-neutral by default (`AGENT9_GROUNDING_LEAD` is off, so only a release-gate *warning* can change) → R1: recount the warning over archived manuscripts.
- **Relates to:** area covering story-validation.

### A9W-10 — Pronoun repair: six call sites, four guard policies, and a package twin

- **P2 · lens C/F · R1 (make policy explicit) + R2 (unify) · M**
- **Evidence (INFERRED):** sites and guards: `:2829` (loose monotonic count), `:5920` (D5 `mutateThenValidate`), `:6076` (unwrapped sweep), `:6088` (targeted, unguarded), `:6181` (A_66 high-precision guard), `:6391-6396` (softening, unguarded). `applyDeterministicPronounSweep` (`:2541`) is a twin of the package's `applyFinalPronounSweep` (`generate.ts:2019`), which applies A_66 P2 (high-precision guard, report on text change) — the worker body does not. `detectAttributionFlips + detectImpossibleSelfReferences` is re-summed inline three times (`:1990`, `:5865`, `:5878`) instead of `detectPronounDriftEvents`; the binary-gender cast projection is built three times. Under the production policy `verify` (`generation-params.yaml:561`) `checkingEnabled` is false, so all six are dead-by-config; they run only under strict/relaxed.
- **Proposal:** `agent9/pronoun-repairs.ts` with one `guardedPronounMutation(prose, mutate, guard: "none"|"loose"|"d5"|"high_precision")`, each site naming today's policy (R1, byte-identical); then the owner decides whether to standardise on high-precision or delete the strict/relaxed path (R2, ADR-0011).
- **Benefit:** ~−120 lines; the policy divergence becomes one visible parameter.
- **Relates to:** A9W-11.

### A9W-11 — The deterministic injector chain exists three times, partly after the "last write"

- **P2 · lens B/G · R1 · M**
- **Evidence (INFERRED):** chain 1 `:5659-5959` (guarded sweep), chain 2 the nested composition `:6053-6079` (unguarded sweep), chain 3 the softening cycle `:6378-6397`. The ship-check block says "No text-writing pass may be added after this block" (`:5968`), but chains 2 and 3, the victim rescues, late pronoun repair, autofix, geometry repairs and NSD plants all write after it; chain 2 re-runs the culprit/clearance/resolution injectors whose templates are what A_64 F2's ship-check floors. `applyStandardPostProcessingChain` has a partial fifth inline copy (`:5658-5659`); the walk-on sweep exists twice (`:4892`, `:5939`).
- **Proposal:** `applyInjectorFloorChain(prose, deps, opts)` in `agent9/injectors.ts` used by all three sites, and a `shipCheck(prose)` step re-run after any post-validation writer.
- **Verification:** R1 — golden test must show chain 1 unchanged; adding the ship-check after chain 2 is R2.

### A9W-12 — Split the helper layer along its seams (remaining S4 groups)

- **P2 · lens A · R0 · M (2 days)**
- **Evidence:** lines 1–3645, 99 top-level functions; groups in §4. REVIEW_03 named temporal, injectors, pronoun/continuity, gate classifiers; add locked facts, grounding, cast roles, post-processing, CML preflight, NSD-anchor repair, geometry maps.
- **Proposal:** move each group to `agent9/<group>.ts`; `agent9-run.ts` re-exports every symbol currently exported (43), exactly as S4 did, so 19 test files and `index.ts:56` keep their paths. Un-export the 11 symbols with no external user (`enforceLockedFactValuePresence`, `computeLiveCulprits`, `normalizeChapterTitle`, `sanitizeProseResult`, `InjectionRecorder` … — export-usage.md) once they sit in their own module.
- **Verification:** `tsc` per group (the compiler caught S4's missed dependency), tests, `build:all`, `preflight-dist-check`.

### A9W-13 — The flag surface has leaked back out of `flags.ts`

- **P2 · lens D · R0 · S**
- **Evidence:** getters in `agent9-run.ts`: `resolveGeometryAcceptanceMode` `:3540`, `isAftermathRepeatRegenEnabled` `:3548`, `isRevealModifyRegenEnabled` `:3560`; inline reads `AGENT9_REDESIGN_V1` `:3695`, `AGENT9_PROSE_BATCH_SIZE` `:4361`, `CANARY_REPLAY_FAIRPLAY_ADVISORY` `:7246`; four YAML rollout flags via `(getGenerationParams().agent9_prose as any)` (`:6129, 6174, 6221, 6363`). `CANARY_REPLAY_FAIRPLAY_ADVISORY` and `ENABLE_PROSE_BLIND_READER` are not in FLAG-AUDIT. `flags.ts:65-71` still documents the removed critique-rewrite flag; `agent9-run.ts:2771-2774` says the grounding lead is "ON by default" (it is off, `flags.ts:54`).
- **Proposal:** move all getters to `flags.ts` plus a typed `agent9RolloutFlags()` accessor; register the two flags; delete the stale comments.
- **Verification:** R0 (getters stay runtime-read; `module-const-flag-check` passes).

### A9W-14 — Dead and vestigial code

- **P2 · lens D · R0 (R1 for the report field) · S**
- **Evidence (MEASURED, `tsc --noUnusedLocals`):** unused imports `checkMechanismEnvironmentConsistency`, `buildStoryBible`, `ChapterValidator`, `splitLongParagraphForReadability`; unused local `VICTIM_RECOLLECTION_PREFIX` (`:1801`). `buildRewriteAcceptanceValidator` (`:196-242`, 47 lines) has no production caller repo-wide — its only consumer was the critique-rewrite pass removed on a negative probe (comment `:5219`); only its test uses it. `ctx.proseRewritePassCount` is initialised to 0 in three places and never incremented, yet feeds `rewrite_pass_count` and `corrective_attempts` (`:5376`, `:7475`). `reconcileDiscriminatingEvidenceIds…` can only return an empty `nonCanonicalIds` (every id it keeps is canonical, `:3038`), so the abort at `:3827-3831` is unreachable.
- **Proposal:** delete the unused imports/local and the validator with its test (the pass's deletion evidence already exists per ADR-0011); drop the counter (report field always 0 — R1, check report readers); remove the unreachable abort.
- **Benefit:** ~−70 lines.

### A9W-15 — No test reaches `runAgent9`; write the ship-layer golden test first

- **P1 · lens J · R0 · M**
- **Evidence (MEASURED):** 19 test files / 172 tests import this module and pass in 10.6 s; every one targets a helper. Nothing calls `runAgent9` except `agent9-replay.ts`, which uses a live client. `agent75-geometry.test.ts:16` shows the fake-ctx pattern.
- **Proposal:** `apps/worker/src/__tests__/agent9-ship-layer.golden.test.ts`: `vi.mock("@cml/prompts-llm")` so `generateProse` returns a frozen prose fixture (two archived checkpoints), a stub client (`chat` rejects, cost 0), all LLM levers off, `StoryValidationPipeline` without semantic fallback; snapshot `ctx.prose`, `ctx.validationReport.summary`, `ctx.warnings`, and every diagnostic upsert. Second fixture with injector floors firing.
- **Benefit:** turns every R1 step of A9W-01/06/10/11 into a byte-equality check.

### A9W-16 — Micro-duplication, grouped

- **P3 · lens C · R0/R1 · S**
- **Evidence:** regex escaping on 18 lines with two definitions (`:1257`, shadowed at `:6231`); four honorific vocabularies (`:1271`, `:2129`, `:2380`, `:2513`, plus `titleExpansions` `:6235`); death vocabularies at `:2394` and `:4637` besides the imported `LIFECYCLE_DEATH_RE`; two locked-fact tokenizers (`:1109` vs `split/length>3` at `:4106`, `:4136`); the chapter-score row built twice (`:4420`, `:4780`); the schema-repair `generateProse` bag (`:5558-5597`) duplicates ~25 fields of `:4526-4571` and diverges (drops outline guardrails; §9 item 8); `checkManuscriptGeometry` deps object ×4 (`:6639-6699`); `logPhaseDiagnostic`+`upsertDiagnostic` pair ×7; clue visibility computed in both summaries (`:5251`, `:7085`); five report fields duplicated between the two summaries; `illegalControlCharPattern` re-typed at `:7213` because the export is `/g`.
- **Proposal:** shared `escapeRegex`, `HONORIFIC_RE` (story-validation), `buildGenerateProseInput(overrides)`, `emitProseDiagnostic(key, label, details)`, `hasIllegalControlChars()` in prose-text.ts.

### A9W-17 — Re-validation re-pays uncached LLM fallbacks

- **P3 · lens I · R1 · S**
- **Evidence:** 9 `validateCurrentProse` call sites (2–4 per run in practice, one unconditional at `:6607`). The pipeline gets `client` (`:5633`), so when the DT regex fails `DiscriminatingTestValidator` calls the LLM per scene sequentially (`discriminating-test-validator.ts:143-156`) and suspect closure 1–2 calls per suspect, with no memo across calls. Schema failure triggers a **full second generation** (`:5558`) where a deterministic coercion would usually do.
- **Proposal:** memoise semantic verdicts by (validator, sha(scene text)) per run; skip re-validation when prose bytes are unchanged; try deterministic schema coercion before the full retry.
- **Benefit (honest):** mini-tier, fallback-only: ≲£0.05/run typical; the schema retry, when it fires, is ~£1.

### A9W-18 — Cumulative chapter scoring is O(n²) — negligible

- **P3 · lens H · R1 · S** — `:4410-4418` and `:4768-4773` score the batch and then all accumulated chapters: 78 chapter-scorings for 12 chapters instead of 12. Deterministic CPU, seconds at most against minutes of LLM time; fix only while extracting `scoring.ts` (A9W-01). No other CPU hotspot worth a finding.

### A9W-19 — A guard so the split does not lose to growth again

- **P2 · lens G · R0 · S**
- **Evidence (MEASURED, git):** 6,814 (S4, `8c9c4e1a`, 2026-08-03) → 7,602 over 20 commits: **+788 = +432 code, +322 comment-only, +34 blank**; `runAgent9` +424 (3,533 → 3,957), helpers +364. By work item: geometry acceptance/N7/X24/X25/X35/X36/X38/X44 ≈ +447 (`3f141a52` alone +253), X4 telemetry +100, X50/X64/X65 +100, pronoun-coverage warning +49, X29 +49, A_73 +16. Every addition was a new top-level helper or a new block inside `runAgent9`, because that is where the pattern pointed.
- **Proposal:** `scripts/size-ratchet-check.mjs` in `pretest` (beside `module-const-flag-check.mjs`): fails when `agent9-run.ts` code lines exceed a stored ceiling, when any function exceeds 400 LOC, or when a new top-level function lands in `agent9-run.ts`; ceilings only ratchet down. After A9W-01, the ceiling for `agent9-run.ts` is the shim (~150 lines).

## 4. Target structure

State types (`agent9/types.ts`), grouping the 78 threading bindings:

| Type | Mutability | Members (source lines) |
|---|---|---|
| `Agent9Env` | read-only | `ctx`, `client`, `runId`, `projectId`, `reportProgress`, `savePartialReport`, `scoring {enableScoring, scoreAggregator, scoringLogger}`, `workspaceRoot`, `flags {bottomUpRedesign, pronounRepair, victimAliveRepair, pronounGateParity}` (3647–3696, 6128, 6173) |
| `Agent9Inputs` | read-only | `cml`, `castDesign`, `characterProfiles`, `locationProfiles`, `temporalContext`, `hardLogicDevices`, `narrative`, `clues`, `coverageResult`, `outlineCoverageIssues`, `fairPlayAudit`, `settingRefinement`, `backgroundContext`, `noveltyAudit` (3670–3694) |
| `PreparedCase` | frozen after P5 | `caseBlock`, `castRoles` (A9W-04), `worldState`/`bible`, `regenBible`, `annotatedLockedFacts`, `macroArcPlan`, `totalSceneCount`, `moralAmbiguityNote`, `mechanismEnvironmentException`, `guardrails {baseline, upstream}`, `storyContract`, `assetLibrary`, `lastClearanceChapter` |
| `ModelConfig` | frozen | `proseDeployment`, `proseModelOverride`, `regenDeployment`, `effectiveProseBatchSize` |
| `GenerationState` | mutable P5–P7 | `narrativeState`, `checkpointPath`, `loadedCheckpoint`, `checkpointedChapters`, `accumulatedChapters`, `pendingObligationAtomIds`, `pendingTextureAtomIds`, `prosePhaseStartTime`, `proseStart` |
| `ShipState` | mutable P8–P19 | `prose: WorkerProse`, `validationReport`, `preRepairSummary`, `postRepairSummary`, `firstPass {durationMs, cost}`, `telemetry {entityPronounDrift, culpritAliasMatches, culpritFalsePositives}`, `geometryReleaseWarnings`, `recordInjection` |
| `ShipServices` | functions over the above | `postProcess(prose)`, `validate(prose)`, `guardedMutation(...)`, `scoreArgs(extra)`, `pushPassAccounting(...)`, `rescore()` |

Phase functions (each `(env, inputs, …) => Promise<Out>`; none assigns an outer variable):

```
agent9/
  run.ts                    ~350  runAgent9: build env/inputs → phases in order → commit ctx
  types.ts                  ~150  state types, WorkerProse
  flags.ts                  ~200  (+6 getters, rolloutFlags)
  prose-text.ts              182  (+hasIllegalControlChars)
  phases/preflight.ts       ~380  P1+P4: runCmlPreflight(env, inputs) → { annotatedLockedFacts }  [R0]
  phases/prepare.ts         ~300  P2+P3+P5: prepareCase(env, inputs) → { prepared, models, gen }  [R0]
  phases/generation.ts      ~420  P7: generate(env, inputs, prepared, models, gen) → WorkerProse; makeBatchCompleteHandler  [R1]
  phases/regen-ladder.ts    ~250  P8: runRegenLadder(state, services, prepared) via runRegenStage  [R1]
  phases/floors.ts          ~330  P11: runPreValidationFloors(...)  [R1]
  phases/validation.ts      ~420  P12+P14+P15: runValidationRescue(...) → { prose, report, summaries, softened }  [R1]
  phases/readback-g6.ts     ~140  P13: runReadBackGate(prose, storyContract, cml, aliasGate) → { issues, counts }  [R0]
  phases/geometry.ts        ~380  P16: runGeometryAcceptance(...) → { prose, report?, warnings, diagnostic }  [R1]
  phases/release-gate.ts    ~420  P18: evaluateReleaseGate(inputs) (pure) + repairNsdAnchors + emit  [R0 classifier, R1 repair]
  phases/report.ts          ~260  P9/P17: buildProseSummaryDetails(input) (pure), failure lineage, diagnostics  [R0]
  phases/full-story-diag.ts ~90   P19  [R0]
  regen-stage.ts             ~60  A9W-06
  temporal.ts               ~300  A9W-08
  locked-facts.ts           ~420  word-form repair, classifyFactValue, INJECTION_TEMPLATES, floor
  grounding.ts              ~110  leads + (X95) coverage
  cast-roles.ts             ~220  A9W-04
  continuity-repairs.ts     ~380  lifecycle guard, victim rescues, malformed surfacing
  pronoun-repairs.ts        ~280  A9W-10
  injectors.ts              ~330  injectSentenceIfAbsent, culprit/clearance/resolution floors, X4 recorder, floor chain
  post-processing.ts        ~360  applyDeterministicProsePostProcessing, titles, role aliases, standard chain
  gate-classifiers.ts       ~300  clue visibility, alias classifiers, readability, placeholder, headings, partition
  nsd-anchor-repair.ts      ~130
  geometry-maps.ts           ~60
agent9-run.ts               ~150  re-export shim only (no logic; ratchet-guarded)
```

Extract first with little shared state (**R0**): P1/P4 (4–10 inputs, no outer writes), P2, P13 (returns its two counters), P17/report builders (pure over explicit inputs), the P18 classifier, P19. Need `ShipState` (**R1**): P7 (`narrativeState` reassigned ×6 inside the closure), P8, P10–P12, P14–P16 (all reassign `prose`; P12/P14–P16 also `validationReport`).

## 5. Suggested sequence

1. A9W-15 golden ship-layer test (two fixtures). Gate for everything R1.
2. A9W-14 dead code, A9W-13 flags, A9W-03 step 1, A9W-07 vocabulary import — R0, one PR each.
3. A9W-05 types (`WorkerProse`, `ValidationReport`) — R0, before moving code so moves are type-checked.
4. A9W-12 helper split, one group per PR with re-export shims; A9W-19 ratchet lands with the first group.
5. A9W-01 R0 phases: preflight, guardrails/prepare, G6, report builders, release-gate classifier, full-story diagnostic.
6. A9W-06 `runRegenStage`, then A9W-01 R1 phases with `ShipState` (regen ladder → floors → validation → geometry → generation last).
7. A9W-11, A9W-10 (R1 parts), A9W-09, A9W-16, A9W-17, A9W-18.
8. Owner decisions (R2, flag + probe): A9W-02 single NSD owner, A9W-03 step 2 Bible, A9W-04 repairer merge, A9W-07 predicate, A9W-08 parser merge, A9W-10 policy.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `AGENT9_MUTATION_REVALIDATION` | on | flags.ts:35 | active every run | two call sites, fine |
| `AGENT9_GROUNDING_LEAD` | off | flags.ts:54 | DEFER (R6) | contradicted by comment `:2771` |
| `AGENT9_BIBLE_GATES_BLOCKING` | off | flags.ts:63 | DEFER (held off) | two throw sites |
| `AGENT9_REGEN_SCAFFOLD` | on | flags.ts:86 | PROMOTE | wrapper A9W-06; runs with no embargo |
| `AGENT9_REGEN_LEAKAGE` / `_DUAL_VALUE` | off | flags.ts:98,107 | DEFER (R6) | wrapper A9W-06 |
| `AGENT9_REGEN_PRONOUN` | on | flags.ts:109 | active | only regen path under `verify` |
| `AGENT9_REGEN_RESOLUTION` / `_CULPRIT_EVIDENCE` / `_SUSPECT_ELIM` / `_MECHANISM` / `_LOCKED_FACT` | off (SET on in .env.local) | flags.ts:114–138 | DEFER | empty beat sheet A9W-03 |
| `AGENT9_REGEN_TRANSITION`, `AGENT9_WALKON_REPAIR` | off (SET on) | flags.ts:124,133 | PROMOTE | walk-on sweep duplicated (A9W-11) |
| `AGENT9_BIBLE_AUTHORITATIVE` | off (SET on) | flags.ts:142 | PROMOTE | code default contradicts production |
| `AGENT9_VOICE_ENFORCE` | off | flags.ts:147 | DEFER | comment says gate warning; code warns only |
| `AGENT9_GEOMETRY_ACCEPTANCE` | shadow | agent9-run.ts:3540 | PROBE | outside flags.ts |
| `AGENT9_REGEN_AFTERMATH_REPEAT` | off | :3548 | DEFER | outside flags.ts |
| `AGENT9_REGEN_REVEAL_MODIFY` | off | :3560 | PROBE | outside flags.ts |
| `AGENT9_REDESIGN_V1` | on | :3695 | active | gates the NSD parity throw (A9W-02) |
| `AGENT9_PROSE_BATCH_SIZE` | 1 (max 2) | :4361 | DEFER | inline |
| `CANARY_REPLAY_FAIRPLAY_ADVISORY` | off | :7246 | **unregistered** | replay-only |
| `ENABLE_PROSE_BLIND_READER` | off | prose-blind-reader.ts:31 | **unregistered** | |
| `AGENT9_FULLSTORY_DIAGNOSTIC` | off | full-story-diagnostic.ts:69 | DEFER | `apply` writes after the gate (§9) |
| YAML `victim_alive_repair_enabled`, `pronoun_gate_parity_enabled`, `culprit_alias_gate_enabled`, `repairable_abort_softening_enabled`; `pronoun_policy: verify` | true / verify | :6129,6174,6221,6363; generation-params | not in register | `as any` access; `verify` disables all worker pronoun mutation |

## 7. Safety net

Pinned today: 19 files / 172 tests (MEASURED pass) covering word-form repair, clue visibility, namespace reconcile, NSD partition and anchor repair, lifecycle/victim rescues, injector templates (non-membership, X64/X65 variance), culprit/clearance floors, role aliases, placeholder leakage, sanitisation, X4 telemetry, pronoun guards, geometry partition. **Gaps:** `runAgent9` (0 tests), `onBatchComplete`, the regen ladder wiring, the three injector chains' order, the release-gate reason builder (only `partitionNsdRevealedCluesForReleaseGate` and placeholder leakage are tested), `buildPostGenerationSummaryDetails`, G6, the schema-repair branch. **Write first:** A9W-15 golden test; then a pure-function table test for `evaluateReleaseGate` as it is extracted; a cast-roles characterization table (A9W-04); a parser diff over archived locked-fact values (A9W-08). The replay harness is not a free net (live client); its `REPLAY_SCORE_CHECKPOINT` mode supplies the fixtures.

## 8. What NOT to refactor

- Catch-and-continue around every regen and diagnostic — ADR-0003 policy; keep it inside `runRegenStage`.
- The deterministic floors and their ordering after their regen rungs (ADR-0007) — merge bodies, never remove the floor.
- The two-round NSD-anchor repair (`:7137`, class #12) and its gate-matcher acceptance — deliberate.
- Re-running the hygiene chain after each writer — it is the walk-on choke point (A_62 class #8); A9W-17 may skip only byte-identical re-runs.
- `REPLAY` demotion of the fair-play hard stop — measurement hygiene, not a leak.
- The board-reference comments: move them with their code; do not condense them in the same PR as a move (they are 41% of the recent growth, but they are the forensic record).

## 9. Incidental defects

1. **Floor writes nonsense for distance values (MEASURED, offline dist probe):** `classifyFactValue` bare-`to` rule (`:1124`) → "It was thirty paces to the gate by the mantel clock." High confidence.
2. **Curly-apostrophe o'clock facts never floor-injected (MEASURED):** the class `o['']clock` (`:1124`) holds two ASCII `'` (bytes checked); "eleven o’clock" → `generic` → empty template; the straight form injects. Same typo in `placeholderRoleSurnamePattern` `[-'']` (`:3190`), and sanitised prose always has curly in-word apostrophes, so that branch never matches. High.
3. **`cml.CAST` does not exist (MEASURED):** `precompileStoryContract({castData: cml.CAST})` (`:4491`) — both archived logs (`scratchpad/fourflag-run-20260823.log`, `a72-run-20260823.log`) show `victim.name="" roleConfirmedFrom="fallback_unknown"`; `culpritAlibiWindows` and hence Bible `placement` are always empty; beat fingerprints get no cast names (`:4618`); the victim-death block (`:4630`) never resolves a name. High.
4. **Beat history and atom stamps never reach fresh-run prompts** (A9W-02). High on data flow; prose impact UNVERIFIABLE.
5. **Worker regens carry no culprit/mechanism embargo** (A9W-03). High on code path; impact UNVERIFIABLE.
6. **X4 telemetry is not emitted on the two throw paths** (`:6573`, `:7509` precede `emitAgent9InjectorLintTelemetry` at `:7599`), contrary to its own "emitted even at zero" contract, unless the orchestrator's failure path serialises `ctx.agent9InjectorLint` (not checked). Medium.
7. **Full-story diagnostic `apply` rewrites chapters after the release gate without re-validation** (`:7541-7557`), against the parity invariant stated at `:6605`. Flag off by default; medium.
8. **Schema-repair retry** (`:5558`) regenerates from chapter 1 with the end-of-story `narrativeState` (advanced by the first pass's `onBatchComplete`) and drops the outline repair guardrails. Medium (rare path).
9. **Mojibake table:** rows `:35-36` of prose-text.ts match "â€" + ASCII `"` (bytes checked); the en-dash row is unreachable since the first commit, and CP1252 em/en-dash mojibake ("â€”", "â€“") is caught by neither the table nor `MOJIBAKE_PATTERN`. High on bytes.
10. **Culprit lock truncates to one culprit** (`:1383-1387`) while downstream code loops over culprits; possibly deliberate. Low.

## 10. Cross-area observations

- **`CaseData = any`** (`packages/cml`) is the root of ~100 casts here and of the `cml.CAST` defect; every agent that reads `ctx.cml` inherits it.
- **Role coalescing (`a ?? b ?? c`) is still the X50 shape** in `deterministic-repair.ts:94,864,960` and `case-soundness-repair.ts:88-89` — likely in other agents' cast handling too.
- **"Worker re-derives what the package computed"** (NSD, Bible, arc position, victim) — the ship layer is structurally a second body of the package; the S6 boundary decision should settle ownership, not just packaging.
- **Vocabularies consolidated incompletely:** X95 (grounding), A_73 §11.1 (clearance — the evidence half and a same-named divergent export survive), A_73 §11.3 (deaths). A consolidation should grep for the vocabulary's *terms*, not its variable name.
- **Two telemetry mechanisms for one concept** (X4 recorder vs module counters).
- **Untyped YAML rollout flags** read via `as any` in both worker and `generate.ts:2121`.
- **Comment growth:** 41% of this file's growth since S4 is comment-only lines; other hotspots likely show the same, so size guards should count code lines.

## 11. Open questions for the owner

1. NSD ownership (A9W-02): should the package own the NarrativeState outright (worker adopts it), accepting that atoms/beat history start flowing into fresh-run prompts behind a probe?
2. Bible (A9W-03): build once in the worker and pass into `generateProse`, or once in the package and return it? Either way, should worker regens get the embargo?
3. Under `pronoun_policy: verify`, ~400 lines of worker deterministic pronoun code never run. Keep strict/relaxed as supported arms (then unify their guards), or retire them (ADR-0011 evidence: the policy history)?
4. Is the single-culprit truncation in `enforceCmlCulpritRoleIntegrity` intended?
5. May the report fields `rewrite_pass_count` (always 0) and the five duplicated telemetry fields be dropped from the diagnostics schema?

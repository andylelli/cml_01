# Low-Level Design — Agent 9, From First Principles

**Source design:** `documentation/analysis/ANALYSIS_59/ANALYSIS_59.md` §"Building the best Agent 9 we can — a from-first-principles design" (and the §"Stepping back" root-cause analysis preceding it).
**Lineage:** A_51–A_59, the 8-agent full code review, the A_57 §9 architectural deep-dive (world-state ledger + discriminator verifier + dramatization-not-declaration).
**Related plans:** `documentation/plan/agent9-bottom-up-redesign-plan.md`, `documentation/plan/prose-generation-LLD.md`, `documentation/plan/prose-generation-HLD.md`.
**Status:** Design — full LLD for the target Agent 9 plus the in-place migration from the current implementation.

Each component section answers, per the house LLD convention:
- **Where** — exact file(s)/function(s).
- **What** — the precise change, with current-vs-target behaviour.
- **Test** — what a unit/integration test must assert.
- **Risk** — known caveats and ordering constraints.

---

## Implementation tracker

Status legend: ☐ not started · ◐ in progress · ☑ done · ⏸ blocked. Update the **Status** and **Run/PR** columns as phases land. Detailed task breakdown in §12; strategy in §9.

| Phase | Title | Primary deliverable | Flag | Depends on | N≥4 gate | Status | Run/PR |
|---|---|---|---|---|---|---|---|
| **P0** | Tactical stop-gaps | A1/A2 leakage→regen-or-drop; scaffold detector seed; pronoun re-measure; clearance micro-regen; Agent 3b magnitude check; early poison plant; repetition dedup | per-fix | — | yes (per fix) | ◐ | scaffold detector + score caps landed (tests green) |
| **P1** | Bible foundation | `buildStoryBible` + beat-sheet; all prompts dereference it | `AGENT9_BIBLE_AUTHORITATIVE` | — | yes | ◐ | type+builder+gates landed (11 tests); dereference-wiring pending |
| **P2** | Bible gates → blocking | `runContradictionGate` + `verifyDiscriminator` repair-at-source | `AGENT9_BIBLE_GATES_BLOCKING` | P1 | yes | ◐ | **wired default-off in `agent9-run.ts`** (warn→throw when set); `runBibleGates` tested; needs upstream repair hook + N≥4 |
| **P3** | Regen-repair loop + scaffold gate + convert A1 | `regen-repair.ts`; general `scaffold_not_prose` detector; first injector converted | `AGENT9_REGEN_CLUE` | P1 | yes | ◐ | **library complete + wired default-off in `generate.ts`** (loop/detector/RegenFn/glue/`runClueRegenPass`, 6+9+8+13 tests); **N≥4 A/B harness staged** (`scripts/exp-regen-clue-*`, paired-replay design + analyzer, 9 offline tests green — see [`regen-clue-n4-experiment.md`](./regen-clue-n4-experiment.md)); needs a live paired run to flip on |
| **P4** | Convert remaining content injectors | general `runInsertionRegenPass` + `runClearanceRegenPass` (A3/B7); A2/B5/B6/B8/B10 reuse it | `AGENT9_REGEN_<pass>` | P3 | yes (per pass) | ◐ | **general pass + clearance regen built + tested** (17 integration tests); per-injector detectors + call-sites pending |
| **P5** | Critique→rewrite pass | `critique-rewrite.ts` at temp 0.7–0.9 on lowest ≤4 chapters | `AGENT9_CRITIQUE_REWRITE` | P3 | yes | ◐ | **built + wired default-off in `agent9-run.ts`** (9 tests); rollback on dropped-fact/scaffold; cost folded in; needs N≥4 |
| **P6** | Model tiering | per-stage model router (`resolveStageModel`) | env `AGENT9_MODEL_*` | P3,P5 | yes | ◐ | **built + used by regen/critique/rewrite** (3 tests); falls back to today's model when unset |
| **P1.3** | Bible dereference (time anchor) | `buildContinuityContext` prefers case ground-truth time over the prose scrape | `AGENT9_BIBLE_AUTHORITATIVE` | P1 | yes | ◐ | **wired default-off** (`context-management.ts` + `prompt-builder.ts`, 3 tests); remaining identity/pronoun re-derivations pending |
| **P7** | Delete deterministic prose layer | remove converted injectors; keep guarded normalizers + logged floor | — | P4,P5,P6 | yes | ☐ | **correctly deferred** — safe only after every injector is validated-off on N≥4; deleting now breaks the live default path |

**Defect cross-reference (A_59 issues → phase):** #1/#4 leakage → P0 + P3; #2 pronouns → P0 (re-measure) then P1 (Bible-locked); #3 clearances → P0 + P4; #5 sundial physics → P0 (Agent 3b); #6 poison plant → P0 (Agent 5/7); #7 repetition → P0 + P5.

### Landed so far (libraries built + unit-tested; not yet wired into the live ship path)

These are the deterministic, pure, test-backed foundations. They change no run behaviour until the orchestrator wiring lands behind the flags above (deliberately deferred — that step is behaviour-changing and must clear an N≥4 gate, which a single session cannot run).

| Deliverable | Module | Tests | Phase |
|---|---|---|---|
| General `scaffold-not-prose` detector + `noScaffoldValidator` | `packages/prose-guard/src/scaffold.ts` | `prose-guard/.../scaffold.test.ts` (9) | P0.2/P3.2 |
| Scaffold leakage wired into the score (caps prose ≤4, ceil 65 when material) | `rubric-score/src/{facts,hard-caps,types}.ts` | `prose-defect-detectors-a57.test.ts` (+3) | P0.2/P3.2 |
| `StoryBible` type + `buildStoryBible` + `ChapterBeat` beat-sheet + `runBibleGates` | `packages/prompts-llm/src/story-bible.ts` | `prompts-llm/.../story-bible.test.ts` (11) | P1.1/P1.2/P2 |
| `ProseDefect`/`RegenRequest` types + async `runRegenRepair`/`regenThenValidate` loop | `packages/prompts-llm/src/agent9-prose/regen-repair.ts` | `prompts-llm/.../regen-repair.test.ts` (6) | P3.1/P3.4 |
| Concrete `RegenFn` — scoped in-scene regen prompt + parser (`buildRegenPrompt`, `makeRegenFn`) | `packages/prompts-llm/src/agent9-prose/regen-llm.ts` | `prompts-llm/.../regen-llm.test.ts` (8) | P3.3 (library) |
| Verifier→Bible→regen glue (`buildRegenRequest`, `instructionForDefect`, `pronounsFromBible`, `lockedFactValues`, `embargoForBeat`, `composeChapterValidator`) | `packages/prompts-llm/src/agent9-prose/regen-integration.ts` | `prompts-llm/.../regen-integration.test.ts` (13) | P3.3 (library) |
| **`runClueRegenPass` + `generate.ts` call-site** (default-off, `AGENT9_REGEN_CLUE`) — detects missing clues, regenerates in-scene before the A1 patch, logs unresolved | `regen-integration.ts` + `agent9-prose/generate.ts` (~2613, gated) | `regen-integration.test.ts` | P3.3 (wired) |
| General `runInsertionRegenPass` + `runClearanceRegenPass` (A3/B7 replacement) + insertion-only preservation guard | `regen-integration.ts` | `regen-integration.test.ts` (17) | P4 |
| Per-stage model router `resolveStageModel` | `agent9-prose/model-tiering.ts` | `model-tiering.test.ts` (3) | P6 |
| Critique→rewrite pass (`buildCritiquePrompt`, `buildRewritePrompt`, `critiqueAndRewriteChapter`, `runCritiqueRewritePass`, `selectLowestScoringChapters`) | `agent9-prose/critique-rewrite.ts` | `critique-rewrite.test.ts` (9) | P5 |
| **P5 `agent9-run.ts` call-site** (default-off, `AGENT9_CRITIQUE_REWRITE`) — rewrites lowest ≤4 chapters, rollback on dropped-fact/scaffold, cost folded in | `agent9-run.ts` (~4150, gated) | worker build + suite | P5 (wired) |
| **P2 gate promotion** (default-off, `AGENT9_BIBLE_GATES_BLOCKING`) — contradiction gate + discriminator warn→throw | `agent9-run.ts` (~3359/3394, gated) | worker build + suite | P2 (wired) |
| **P1.3 time-anchor dereference** (default-off, `AGENT9_BIBLE_AUTHORITATIVE`) — ground-truth time over the prose scrape | `context-management.ts` + `prompt-builder.ts` (gated) | `continuity-anchor-p13.test.ts` (3) | P1.3 (wired) |

**Verified:** `@cml/prose-guard` (30 tests), `@cml/rubric-score` (65), `@cml/prompts-llm` (637), `@cml/worker` (263) all green; prompts-llm + worker type-check and build to `dist` cleanly. `@cml/prompts-llm` declares `@cml/prose-guard` (leaf dep — no cycle).

**All of P2–P6 + P1.3 are now wired behind their own default-off flags** (`AGENT9_REGEN_CLUE`, `AGENT9_REGEN_*`, `AGENT9_CRITIQUE_REWRITE`, `AGENT9_BIBLE_GATES_BLOCKING`, `AGENT9_BIBLE_AUTHORITATIVE`, `AGENT9_MODEL_*`). When every flag is unset the pipeline is byte-for-byte today's behaviour (verified by the green worker suite + build). Each flag-gated path is wrapped so a failure degrades to the existing deterministic behaviour and never breaks a run.

**P7 is deliberately NOT implemented** — deleting the deterministic injector layer is only safe once every injector's regen replacement has won on N≥4; the injectors are still the live default path, so deleting now would break generation. It lands last, after the flips.

**Remaining is measurement, not code:** flip each flag on a powered **N≥4** matched set (starting with `AGENT9_REGEN_CLUE`), confirm quality ↑ with no presence/fairness/coherence regression and cost within 2×, wire the per-injector detectors for the rest of P4 (each a thin `runInsertionRegenPass` call), then P7. A single session cannot run N≥4, so these stay default-off. **P0.5 (Agent 3b magnitude check) and P0.6 (Agent 5/7 early poison plant)** live in other agents and are tracked outside this Agent 9 prose scope.

---

## 0. Purpose & scope

Agent 9 turns a fully-specified, verified case (cast, world-state, clue plan, discriminating test, beat-outline produced by Agents 1–8) into 8–12 chapters of Golden-Age detective prose. This LLD specifies **the best Agent 9 we can build inside a 2× LLM-cost ceiling (~$0.58/run, up from ~$0.29)** and the incremental, flag-gated path to get there from the code as it stands on `redesign/agent-blue-sky`.

The design is **an in-place evolution, not a rewrite** (A_59 §G). The hard, correct, hard-won half — the verification / fair-play / world-state logic — is kept verbatim. The narrow thing that changes is the **prose-production boundary**: the ~20 deterministic string-injection passes that today *write* shipped prose are converted to *detect → scoped-LLM-regenerate → re-verify*, and a **critique→rewrite-at-creative-temperature** pass is added to lift craft. Nothing about the case's structural guarantees changes.

---

## 1. The spec — what Agent 9 is for (A_59 §A)

A chapter set must be simultaneously:

1. **Coherent** — no fact drifts: times (staged & true), weather, locations, identities, **pronouns**.
2. **Fair-play sound** — every clue is planted before the reveal; the discriminating test actually *discriminates*; the reader could solve it.
3. **Interesting** — reads like published Golden-Age fiction: dramatized not declared, distinct voices, real atmosphere, an earned reveal.
4. **Clean** — never leaks scaffolding, reasoning text, template, or validation language.

The test of any line of Agent 9 code is: *which of these four does it serve, and is it the right kind of tool for that job?* Today much of the code fails that test — deterministic string-builders trying to serve #3 (Interesting) and #4 (Clean), which only a model can produce.

---

## 2. The governing principle (A_59 §B)

> **Deterministic code may VERIFY and GUARANTEE; it must never WRITE. The LLM WRITES and REPAIRS; deterministic code CHECKS and BLOCKS.**

The current architecture violates this: ~20 deterministic passes both *guarantee presence* and *emit prose*, so every guarantee ships as template — and that is the whack-a-mole (A_57 D4 reworded the clearance template; A_58 #1 rewrote the resolution backstop; A_59 #1/#4 found the clue/inference-surfacing templates leaking; same mole, three holes). The fix is one boundary, three strictly-separated layers:

| Concern | Owner | Rule |
|---|---|---|
| Presence / fairness / structure (decidable) | deterministic verifiers | check & block; **never write**; never regress |
| Prose (craft) | the LLM | writes, and repairs its own misses under constraint |
| The bridge (a verifier found a gap) | a **scoped LLM regen** | dramatize the missing element in-scene; a deterministic string is only an emergency floor that, **if it ever fires, flags the chapter for rewrite and logs a quality failure** — it does not silently ship |

---

## 3. Current architecture (as-built) — the baseline this LLD evolves

### 3.1 The orchestrator pipeline — `apps/worker/src/jobs/agents/agent9-run.ts`

Entry: **`runAgent9(ctx: OrchestratorContext): Promise<void>`** — [agent9-run.ts:3018](../../apps/worker/src/jobs/agents/agent9-run.ts#L3018). Consumes upstream artifacts on `ctx` (`cml`, `cast`, `characterProfiles`, `locationProfiles`, `temporalContext`, `hardLogicDevices`, `narrative` outline, `clues`, …) and writes `ctx.prose` + `ctx.validationReport` at [:5592](../../apps/worker/src/jobs/agents/agent9-run.ts#L5592). Twelve stages, executed in order:

| # | Stage | Where | Note |
|---|---|---|---|
| 1 | Preflight / CML integrity gates | :3067–3542 | schema, lifecycle, clue-namespace, blocking-outline, locked-fact↔clue temporal mismatch. Several hard-abort. |
| 2 | **World-state ledger** construct + gates | :3322–3400 | `buildStoryWorldState` (:3326), `runContradictionGate` (:3359), `verifyDiscriminator` (:3388) — currently **warn-level telemetry only**. |
| 3 | Locked-fact annotation + narrative-state init | :3437, :3567 | `initNarrativeState`, victim-dead-from-ch1 preset (:3588). |
| 4 | StoryContract precompile + role cross-validate | :3744, :3757 | the G5 oracle. |
| 5 | **Prose generation** (inner per-chapter loop) | :3775 → `generateProse` | drives batch loop + `onBatchComplete` (:3821). |
| 6 | Deterministic post-processing chain (round 1) | :4125, :4133 | `applyStandardPostProcessingChain`. |
| 7 | First-pass prose scoring | :4311–4380 | `ProseScorer`. |
| 8 | Prose schema validation (+ schema-repair regen) | :4444–4509 | hard-abort if still invalid. |
| 9 | Story Validation + deterministic repair cascade | :4528–5109 | the bulk of the Layer-B injectors run here. |
| 10 | Auto-fix encoding + re-validate | :5119–5141 | release-gate parity invariant. |
| 11 | **Release gate** | :5189–5587 | warnings vs hard-stops; throws on any hard-stop. |
| 12 | Commit | :5592 | sets `ctx.prose`, `ctx.validationReport`. |

The **per-chapter generate→validate→repair loop lives inside `generateProse`** ([generate.ts:1979](../../packages/prompts-llm/src/agent9-prose/generate.ts#L1979)): batch loop at [:2204](../../packages/prompts-llm/src/agent9-prose/generate.ts#L2204), attempt loop at [:2273](../../packages/prompts-llm/src/agent9-prose/generate.ts#L2273), single LLM call at [:2446](../../packages/prompts-llm/src/agent9-prose/generate.ts#L2446) (temp base 0.45, escalating to 0.85 on n-gram/fingerprint retries). Post-pass polish at [:3024](../../packages/prompts-llm/src/agent9-prose/generate.ts#L3024), online linter gate at [:3120](../../packages/prompts-llm/src/agent9-prose/generate.ts#L3120), exhaustion backstops at :3185–3288, final full-cast pronoun sweep at :4182.

**Known abort hazard (memory: `template-bleed-no-backstop-kills-runs`):** a cosmetic `template_bleed` that co-occurs with any other error, or fires with the bypass flag off, hard-aborts the batch at [generate.ts:3418](../../packages/prompts-llm/src/agent9-prose/generate.ts#L3418) before final validation — the run dies producing no story. The blocking room-inventory case ([lint.ts:557](../../packages/prompts-llm/src/agent9-prose/lint.ts#L557)) is intentionally outside the opener bypass ([generate.ts:3204](../../packages/prompts-llm/src/agent9-prose/generate.ts#L3204)).

### 3.2 The verifier surface (the KEEP core) — pure, decidable, never writes

| Verifier | File:line | Guarantees | Output |
|---|---|---|---|
| `buildStoryWorldState` / `runContradictionGate` | [world-state.ts:95](../../packages/prompts-llm/src/world-state.ts#L95)/[:133](../../packages/prompts-llm/src/world-state.ts#L133) | culprit≠victim, mechanism↔environment (D3), every character has a resolvable gender (D5 substrate), no duplicate names | `ContradictionGateResult` |
| `verifyDiscriminator` | [discriminator-verifier.ts:64](../../packages/prompts-llm/src/discriminator-verifier.ts#L64) | culprit named, not eliminated, every other suspect eliminated, ≥1 planted clue cited | `DiscriminatorVerdict` |
| `mutateThenValidate` / `allOf` | `packages/prose-guard/src/mutate.ts:22`/`:50` | the validation-gated-mutation law: revert on clean→dirty, score drop, or new violation | `MutationOutcome<T>` |
| `checkContractFidelity` + `detectLocationMetadataDump` + `detectTemplateLeakage` + `countMisgenderedPronouns` | `packages/prose-guard/src/fidelity.ts:42/98/148/174` | must-surface clues present, no early leak, culprit not unmasked early, no metadata dump, no template leakage, pronoun count | `FidelityReport` / `Validator<string>` |
| `generateWithBackstop` / `BestDraftTracker` | `packages/prose-guard/src/backstop.ts:64/15` | a run never dies with no story | best non-empty draft |
| `extractStoryFacts` + A_57 detectors `detectReportStyleClearance` (D4), `detectMalformedSurfacing` (D1), `detectDualValueNoContrast` (D2) + `applyHardCaps` + `verifyStructure` + `verifyCitations` | `packages/rubric-score/src/{facts,hard-caps,structural-verifiers}.ts` | honest score with deterministic hard caps; veto false judge flags | `CappedScore` |
| `validateChapterPreCommitObligations` + clue presence/early + stage-mode contracts | [clue-validation.ts:950](../../packages/prompts-llm/src/agent9-prose/clue-validation.ts#L950) | word floor, each clue present (early if required), stage-mode outcome contracts, reveal completeness | `ChapterObligationResult` |
| `lintBatchProse` (+ `detectControlPlaneLeakage`, `detectVerbatimFieldEcho`) | [lint.ts:106](../../packages/prompts-llm/src/agent9-prose/lint.ts#L106), `story-validation/src/control-plane-leakage.ts:74/138` | scaffold/template/control-plane/leakage detection, ≥12-word verbatim-echo | `ProseLinterIssue[]` |

Every one of these is **report-only** except `mutateThenValidate` (gates a write) and the season-lock rewriter `enforceMonthSeasonLockOnChapter(WithTelemetry)` ([lint.ts:901](../../packages/prompts-llm/src/agent9-prose/lint.ts#L901)/[:980](../../packages/prompts-llm/src/agent9-prose/lint.ts#L980)), which writes. This surface is the decidable guarantee layer the target architecture keeps untouched.

### 3.3 The injector surface (the DELETE/convert target) — ~20 deterministic prose-mutating passes

Two layers. **Layer A** runs inside the per-chapter loop (`deterministic-repair.ts`, `repair.ts`, `sanitization.ts`, `continuity-tail.ts`, `lint.ts`). **Layer B** runs once over the whole prose object in the orchestrator (`agent9-run.ts`), pipeline order at [agent9-run.ts:4549–4594](../../apps/worker/src/jobs/agents/agent9-run.ts#L4549).

| ID | Pass | Function : line | Emitted scaffold (verbatim sample) | Presence guarantee | Rollback? |
|---|---|---|---|---|---|
| A1 | clue / key-term surfacing | `buildDeterministicClueParagraphs` [deterministic-repair.ts:283](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L283), `applyDeterministicCluePatch` :309 | `"…pressed on to the next concrete detail"`; `"…weighed ${desc}, and the trail bent toward ${pointsTo}."`; `"That detail shifted the reasoning."` | clue present / early | **none** |
| A2 | discriminating-test scaffold | `buildDeterministicDiscriminatingTestParagraphs` [:353](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L353), patch :391 | `"…set out the two competing readings so everyone could weigh them side by side."` | DT stage outcomes | none (skip-guard only) |
| A3 | clearance patch | `buildDeterministicClearanceParagraph` [:467](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L467), patch :490 | `"By the time of the crime, …accounted for ${name}'s movements elsewhere; ${name} could not have been the killer."` | suspect cleared | none |
| A4 | stage fallback prose | `buildStageAwareFallbackParagraphs` [:595](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L595) | reveal: `"${inv} named ${culprit} only after laying motive and opportunity side by side…"` | stage outcomes | none |
| A5 | whole-chapter fallback | `buildCompletionFallbackChapter` [:816](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L816) | `"${location} held the inquiry in ${timeOfDay}…"` + canned expansion beats | non-empty chapter at floor | none |
| A6 | atmosphere phrase substitution | `applyPhraseSubstitutions` [repair.ts:202](../../packages/prompts-llm/src/agent9-prose/repair.ts#L202) | deterministic regex replace (LLM picks words) | phrase variety | none |
| A7 | season/month lock | `enforceMonthSeasonLockOnChapterWithTelemetry` [lint.ts:901](../../packages/prompts-llm/src/agent9-prose/lint.ts#L901) | wrong-season token → locked season | temporal consistency | partial (semantic-diff guard) |
| A8 | paragraph split | `enforceMinimumParagraphStructure` [sanitization.ts:142](../../packages/prompts-llm/src/agent9-prose/sanitization.ts#L142) | restructure only (no new text) | min paragraph count | none |
| A9 | audit-leak strip | `stripInternalAuditPhrasing` / `sanitizeGeneratedChapter` [sanitization.ts:25](../../packages/prompts-llm/src/agent9-prose/sanitization.ts#L25)/:91 | deletes leak sentences | no audit/control-plane leak | n/a (delete) |
| A10 | continuity-tail strip | `sanitizeContinuityTailForPrompt` [continuity-tail.ts:3](../../packages/prompts-llm/src/agent9-prose/continuity-tail.ts#L3) | strips banned atmosphere (prompt input, not ship-path) | prompt hygiene | n/a |
| B1 | grounding-lead | `buildDeterministicGroundingLead` [agent9-run.ts:411](../../apps/worker/src/jobs/agents/agent9-run.ts#L411) | `"A grey light filled ${L}, and the cold air carried the faint creak of old timber."` | scene grounding | **yes** (`noMetadataDumpValidator`); **OFF by default** |
| B2 | word-form locked-fact repair | `repairWordFormLockedFacts` [:953](../../apps/worker/src/jobs/agents/agent9-run.ts#L953) | `11:00`→`eleven o'clock` | locked-fact format | none |
| B3 | locked-fact value injection | `enforceLockedFactValuePresence` [:1902](../../apps/worker/src/jobs/agents/agent9-run.ts#L1902), templates :1200 | `"The hour stood at ${v}."`; `"It had taken ${v} in all."` | locked-fact present | none |
| B4 | malformed-surfacing repair | `repairMalformedSurfacing` [:1845](../../apps/worker/src/jobs/agents/agent9-run.ts#L1845) | `drizzle'the`→`drizzle; the` | boundary integrity | **yes** (pronoun-guarded) |
| B5 | culprit-evidence injection | `enforceCulpritEvidencePresence` [:2082](../../apps/worker/src/jobs/agents/agent9-run.ts#L2082) | `"${culprit} was responsible, and the evidence placed the matter beyond all reasonable doubt."` | culprit evidence chain | none |
| B6 | resolution injection/backstop | `injectResolutionIfAbsent` [:2171](../../apps/worker/src/jobs/agents/agent9-run.ts#L2171), sentence [clue-validation.ts:880](../../packages/prompts-llm/src/agent9-prose/clue-validation.ts#L880) | `"\"It was me.\" The words left ${surname} at last… \"I confess — I did it.\""` | resolution present, in-scene | none |
| B7 | suspect-elimination injection | `enforceSuspectEliminationPresence` [:2042](../../apps/worker/src/jobs/agents/agent9-run.ts#L2042) | `"${surname} was thoroughly cleared by the evidence; the alibi confirmed they could not have committed the crime."` | all suspects cleared | none |
| B8 | victim-reappearance rescue (×3) | `applyLifecycleContinuityGuard` [:1570](../../apps/worker/src/jobs/agents/agent9-run.ts#L1570), `applyVictimReappearanceRescue` :1649, `applyCanonicalVictimRescue` :1755 | `VICTIM_RECOLLECTION_PREFIX = "In a remembered moment, "` | dead not animated | none (victim-skip guard) |
| B9 | pronoun sweep | `applyDeterministicPronounSweep` [:2231](../../apps/worker/src/jobs/agents/agent9-run.ts#L2231), targeted :1425 | wrong-gender pronoun → cast gender | pronoun fidelity | **yes** (monotonic + `pronounStabilityValidator`) |
| B10 | role-alias substitution | `substituteRoleAliasesInPostRevealChapters` [:2346](../../apps/worker/src/jobs/agents/agent9-run.ts#L2346) | `the killer`→culprit name (post-reveal) | identity stability | none |
| B11 | chapter-title normalize | `normalizeChapterTitles` [:2304](../../apps/worker/src/jobs/agents/agent9-run.ts#L2304) | `"Chapter N: Title"` | title format | none |
| B12 | text-hygiene (mojibake/flow/dedup) | `applyDeterministicProsePostProcessing` [:2380](../../apps/worker/src/jobs/agents/agent9-run.ts#L2380) | dedup → fresh grounding lead | readability, no dup scaffold | partial |

**Rollback coverage is sparse:** only B1, B4, B9 (and A7 partially) are guarded. **Every content-presence injector — A1, A2, A3, A4, A5, B3, B5, B6, B7, B8, B10 — ships its synthesized string with no re-validation, by explicit design** (comment at [agent9-run.ts:4538](../../apps/worker/src/jobs/agents/agent9-run.ts#L4538): a revert could drop a required obligation). That class is exactly what the target replaces with scoped regeneration.

### 3.4 The generation-time discipline that already exists (and target preserves)

- **Obligations are already structured, not free text**: `ClueObligationContext` ([types.ts:314](../../packages/prompts-llm/src/agent9-prose/types.ts#L314)) and `ChapterRequirementLedgerEntry` ([types.ts:324](../../packages/prompts-llm/src/agent9-prose/types.ts#L324)); rendered as "what a character SEES/DOES/SAYS, in YOUR OWN WORDS" with reveal-class deferral ([obligation-block.ts:391](../../packages/prompts-llm/src/agent9-prose/obligation-block.ts#L391)).
- **Anti-verbatim key-term surfacing**: `surfaceSpecKeyTerms` / `describeDtMechanismForPrompt` ([discriminating.ts:18](../../packages/prompts-llm/src/agent9-prose/discriminating.ts#L18)) hands the model key terms, never the spec sentence (defeats the ≥12-word verbatim echo).
- **A 10-rule "ABSOLUTE PRONOUN LOCK"** generation contract: `buildPronounAccuracyBlock` ([prompt-blocks.ts:21](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts#L21)), priority critical, recency-ordered last.
- **Stage-mode beat contracts**: `defaultStageModeProfiles` ([narrative-balance.ts:44](../../packages/prompts-llm/src/agent9-prose/narrative-balance.ts#L44)) and the macro-arc archetype plan `buildMacroArcPlan` ([types.ts:61](../../packages/prompts-llm/src/agent9-prose/types.ts#L61)) — the de-facto per-chapter beat-sheet.
- **The post-pass already has the validate→rollback skeleton** the regen loop needs: `polishPassingChapter` ([post-pass-polish.ts:135](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L135)) calls `validateCandidate` and rolls back on `validation_regression` / `obligation_regression` / `quality_no_gain` — but at **temperature 0.2** ([:166](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L166)) with a "prefer no change" prompt, so it **structurally cannot lift craft**.

---

## 4. Target architecture — the six-stage pipeline (A_59 §C)

```
            ┌─────────────────────────────────────────────────────────────────┐
            │ Agents 1–8 artifacts (cast, world-state, clue plan, DT, outline)  │
            └─────────────────────────────────────────────────────────────────┘
                                          │
   STAGE 1  ┌───────────────────────────────────────────────┐
  THE BIBLE │ construct-then-verify, FROZEN before prose      │  deterministic
            │ • StoryBible (typed, cross-checked)             │  build + gates
            │ • contradiction gate (§9.1) + discriminator     │  (no writing)
            │   verifier (§9.2) → repair AT SOURCE            │
            └───────────────────────────────────────────────┘
                                          │ frozen, dereferenced — never re-derived
   STAGE 2  ┌───────────────────────────────────────────────┐
  GENERATE  │ LLM, temp ~0.45, full prior-chapter context     │  strong model
            │ writes COMPLETE chapter from its beat-sheet slice│  (Opus-class)
            │ clues as OBLIGATIONS, locked voice+gender+facts │
            └───────────────────────────────────────────────┘
                                          │
   STAGE 3  ┌───────────────────────────────────────────────┐
   VERIFY   │ deterministic, WRITES NOTHING                   │  the §3.2 surface
            │ presence • fairness • coherence • soundness •   │  → DEFECT LIST
            │ general scaffold/leakage gate                   │  with locations
            └───────────────────────────────────────────────┘
                                          │ defects?
   STAGE 4  ┌───────────────────────────────────────────────┐
  REGEN-    │ per defect: tiny scoped LLM regen → re-verify    │  cheap model
  REPAIR    │ mutate-then-validate; rollback on regression    │  the ~20 injectors
            │ deterministic string = logged emergency floor   │  are REMOVED from
            │ only (flags chapter for rewrite if it fires)    │  the ship path
            └───────────────────────────────────────────────┘
                                          │
   STAGE 5  ┌───────────────────────────────────────────────┐
 CRITIQUE→  │ lowest-scoring 3–4 chapters: LLM critiques vs    │  strong model
 REWRITE    │ rubric, rewrites at temp 0.7–0.9                │  temp 0.7–0.9
            │ deterministic re-validate + rollback (facts safe)│  + rollback
            └───────────────────────────────────────────────┘
                                          │
   STAGE 6  ┌───────────────────────────────────────────────┐
 JUDGE+GATE │ K2 rubric + deterministic detectors             │  maintenance
            │ ship / rewrite-again / abort                    │  (gap has closed)
            └───────────────────────────────────────────────┘
```

This subsumes the seven A_57 defect classes rather than patching them: D1/D2/D3 become Bible properties; D4 is *eliminated* by inject→regen; D5 is generation-discipline + targeted regen; D6/D7 are the Bible's voice/test fields realized by generation + the rewrite pass.

---

## 5. Data structures

### 5.1 The Story Bible — extend `StoryWorldState` to the single source (Stage 1)

**Where:** [world-state.ts](../../packages/prompts-llm/src/world-state.ts) (`StoryWorldState`, [:45](../../packages/prompts-llm/src/world-state.ts#L45)). Promote it to the canonical object every prompt dereferences. Today it holds D1 facts, the D2 contradiction, the D3 environment, and identity (name/gender/role/victim/culprits) — but **not** per-time clocks, per-character location-per-time, voice profiles, the structured discriminating test, or the beat-sheet. Those exist scattered across `characterBundle` (voice — [types.ts:99](../../packages/prompts-llm/src/agent9-prose/types.ts#L99)), `storyContract` (the G5 oracle — [types.ts:173](../../packages/prompts-llm/src/agent9-prose/types.ts#L173)), `temporalContext`, `clueDistribution`, `macroArcPlan`, and `narrativeState`. The Bible unifies them.

**What — target type (additive; existing fields unchanged):**

```ts
export interface StoryBible extends StoryWorldState {
  /** every referenceable time, both layers — D2 made first-class, not re-derived from prose. */
  clock: {
    staged: Record<string /*eventId*/, string /*verbatim value*/>;
    true:   Record<string /*eventId*/, string>;
    murderMoment: string;            // eventId
  };
  /** per-character location at each time-slot — kills location/alibi drift at the source. */
  placement: Record<string /*character*/, Record<string /*timeSlot*/, string /*location*/>>;
  /** identity substrate extended with a locked voice profile (D6) per character. */
  voices: Record<string /*character*/, {
    register: string; humourStyle: string; humourLevel: number;
    forbiddenCliché: string; speechMannerisms: string;
  }>;
  /** the discriminating test as a structured triple (D7) — not an analytical sentence. */
  discriminatingTest: {
    stagedValue: string; trueValue: string; exposingAction: string;
    evidenceClueIds: string[]; eliminatedSuspects: string[];
  };
  /** per-chapter beat-sheet — the obligation contract realized as data. */
  beatSheet: ChapterBeat[];
}

export interface ChapterBeat {
  chapter: number;
  archetype: Archetype;              // reuse BASE_ARCHETYPES (types.ts:23)
  stageMode: StageModeKey;           // reuse clue-validation StageModeKey
  beats: string[];                   // what happens, as obligations (not prose)
  cluesToPlant: ClueObligationContext[];
  cluesPaidOff: string[];
  charactersPresent: string[];       // each carries locked voice + gender + pronouns from voices/characters
  suspectPressured?: string;
  arcPosition: string;               // opening … resolution
  emotionalTurn?: string;
  mustNotReveal: { clues: string[]; solutionCulprit: boolean };
}
```

The `ChapterBeat` is the typed superset of today's `MacroArcEntry` ([types.ts:38](../../packages/prompts-llm/src/agent9-prose/types.ts#L38)), the `StageModeProfile` ([narrative-balance.ts:12](../../packages/prompts-llm/src/agent9-prose/narrative-balance.ts#L12)), and `ChapterRequirementLedgerEntry` ([types.ts:324](../../packages/prompts-llm/src/agent9-prose/types.ts#L324)) — it folds three scattered per-chapter contracts into one.

**Test:** `buildStoryBible(inputs)` is pure and null-safe; `runContradictionGate` + `verifyDiscriminator` run over it and **block at source** (promoted from warn-level — see §6.1); a fixture case with a staged/true time pair populates `clock.staged`/`clock.true`; every `ChapterBeat.charactersPresent` resolves to a `voices[...]` and a `characters[...]` gender.

**Risk:** the Bible must be the *only* dereference. The two live drift surfaces — the prose-scraped time anchor ([context-management.ts:125–143](../../packages/prompts-llm/src/agent9-prose/context-management.ts#L125)) and the shape-based atomic/descriptive re-classification per build ([prompt-builder.ts:120](../../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L120)) — must be replaced by reads of `clock` and `facts[].type`, or they will re-introduce the drift the Bible exists to remove.

### 5.2 The defect list — Stage 3 output (the bridge to Stage 4)

```ts
export interface ProseDefect {
  chapter: number;
  paragraphIndex?: number;           // anchor for scoped regen
  kind:
    | "missing_clue" | "clue_too_late" | "missing_clearance"
    | "missing_resolution" | "culprit_unlinked" | "suspect_unaccounted"
    | "pronoun_mismatch" | "victim_animated" | "locked_fact_absent"
    | "scaffold_not_prose"            // the general detector (§6.4)
    | "early_spoiler" | "leakage";
  detail: string;                    // human-readable, carries the obligation
  obligationRef?: string;            // clueId / suspect / factId — what to regenerate
  severity: "hard" | "soft";
}
```

Stage 3 emits `ProseDefect[]` and **never mutates**. Stage 4 consumes it. This replaces today's mixed model where validators both report (`ChapterObligationResult`, `ProseLinterIssue[]`) and injectors silently write.

### 5.3 The scoped-regen contract — Stage 4 input

```ts
export interface RegenRequest {
  chapter: ProseChapter;
  paragraphIndex?: number;           // regenerate just this span when possible
  instruction: string;              // "plant {clue} here as an observation"; "dramatize this clearance as a witnessed deduction"
  bible: StoryBible;                 // dereferenced facts/voices/pronouns — never re-derived
  constraints: { lockedFacts: WorldStateFact[]; pronouns: Record<string,string>; mustNotReveal: string[] };
  validate: (c: ProseChapter) => { chapter: ProseChapter; hardErrors: string[] };
}
```

---

## 6. Component LLDs

### 6.1 Stage 1 — The Story Bible: construct-then-verify, frozen before prose

**Where:** [world-state.ts](../../packages/prompts-llm/src/world-state.ts) + the orchestrator construction site [agent9-run.ts:3322–3400](../../apps/worker/src/jobs/agents/agent9-run.ts#L3322).

**What:**
1. Add `buildStoryBible(inputs): StoryBible` extending `buildStoryWorldState` with `clock`, `placement`, `voices`, `discriminatingTest`, `beatSheet` (§5.1), sourced from `temporalContext`, `characterBundle`, `storyContract`, `clueDistribution`, `macroArcPlan`.
2. **Promote `runContradictionGate` (:3359) and `verifyDiscriminator` (:3388) from warn-level telemetry to source-level blocking** — an unsound/incoherent case is repaired *here*, never in prose. (Today they only warn; the discriminator verdict and contradiction conflicts must gate.)
3. Migrate every Agent 9 obligation/prompt builder to **dereference the Bible** (the deferred A_57 §9.5 clause 2). Concretely: replace the prose-scraped time anchor ([context-management.ts:125](../../packages/prompts-llm/src/agent9-prose/context-management.ts#L125)) with `bible.clock`; replace per-call role/identity re-filtering ([obligation-block.ts:59](../../packages/prompts-llm/src/agent9-prose/obligation-block.ts#L59), prompt-builder) with `bible.characters`/`bible.victim`/`bible.culprits`; feed `bible.voices` to the character blocks; feed `bible.discriminatingTest` (the triple) to `describeDtMechanismForPrompt` instead of the analytical `design` sentence.

**Test:** the contradiction gate fails a fixture where the culprit is the victim, where the mechanism needs sun but the season is fog (D3), or where a character has unknown gender; the discriminator verifier fails a fixture where a suspect is neither culprit nor eliminated; a fixture with one staged/true time produces exactly one `clock.staged`/`clock.true` pair and **no second time** appears anywhere in the prompt context (drift surface closed).

**Risk:** promoting the gates to blocking can turn previously-shipping (unsound) cases into aborts — must be validated on N≥4 and paired with upstream (Agent 3b/5/7) repair so the gate has something to converge to, not just a new abort. Sequencing: land the Bible **structure + dereference** first (cost-neutral), promote the gates to blocking second.

### 6.2 Stage 2 — Generate

**Where:** [generate.ts:1979](../../packages/prompts-llm/src/agent9-prose/generate.ts#L1979) (`generateProse`), prompt at [prompt-builder.ts:1380](../../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L1380).

**What:** each chapter is written from its `ChapterBeat` slice: beats, `cluesToPlant` *as obligations* (not text), `charactersPresent` with **locked voice + gender + pronouns** from the Bible, locked atomic facts verbatim + descriptive facts paraphrased, arc/tone, and the absolute anti-scaffold rule. The model writes the **complete** chapter — clearances, reveal, test — as prose. **No placeholders, no "X was cleared because."** This is largely the current generation path; the change is that it draws every fact from the Bible (§6.1) and that **the model is responsible for producing the complete chapter** — the deterministic injectors no longer "finish" it. Keep the existing structured-obligation rendering ([obligation-block.ts:391](../../packages/prompts-llm/src/agent9-prose/obligation-block.ts#L391)), key-term surfacing, and the pronoun-lock block ([prompt-blocks.ts:21](../../packages/prompts-llm/src/agent9-prose/prompt-blocks.ts#L21)).

**Model/temp:** strongest available model (latest Claude, Opus-class — see §8), base temp 0.45 with the existing escalation. A stronger generator also reduces the Stage-4 repair burden (fewer defects), so it is partly self-funding.

**Test:** generation populates every `must_surface` clue for a fixture beat without any deterministic patch running; the generated reveal chapter names the culprit + motive + opportunity + method with no injector firing.

**Risk:** a weaker model omits obligations and forces more Stage-4 regen — acceptable (regens are cheap) but trades against the cost budget; measure defect-rate per model tier.

### 6.3 Stage 3 — Verify (writes nothing)

**Where:** the §3.2 verifier surface, run per-chapter and whole-story, emitting `ProseDefect[]` (§5.2).

**What:** consolidate the existing pure checks into a single defect-list producer:
- presence: `validateChapterPreCommitObligations` ([clue-validation.ts:950](../../packages/prompts-llm/src/agent9-prose/clue-validation.ts#L950)), `checkContractFidelity` (fidelity.ts:42);
- fairness: no pre-reveal spoiler (`must_not_reveal`), all clues visible (`verifyStructure` planted-evidence);
- coherence: gender/pronoun vs Bible (`countMisgenderedPronouns`), victim-not-animated, time/location/weather vs `bible.clock`/`bible.placement`;
- soundness: `verifyDiscriminator` over the realized prose's eliminations;
- a **general scaffold/leakage gate** (`lintBatchProse`, `detectControlPlaneLeakage`, `detectVerbatimFieldEcho`, plus the new `scaffold_not_prose` shape detector — §6.4).

Output is a defect list with `{chapter, paragraphIndex, kind, obligationRef}`. **No mutation.**

**Test:** for a chapter missing one clue and misgendering one pronoun, Stage 3 returns exactly two defects with correct `kind` and `paragraphIndex`; a clean chapter returns `[]`.

**Risk:** the verifiers must not regress in precision — they already carry hard-won false-positive fixes (e.g. `victim_alibi_error` FP on non-victims, A_58 #1; `weakMurderMethod` `wound`-collision exclusion). Reuse them verbatim; do not re-implement.

### 6.4 Stage 4 — Repair-by-regen loop + the general scaffold-not-prose gate

**Where:** new module `packages/prompts-llm/src/agent9-prose/regen-repair.ts`; reuses `mutateThenValidate` (prose-guard) and the post-pass validate/rollback skeleton ([post-pass-polish.ts:135](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L135)).

**What:**
1. **The loop.** For each `ProseDefect`, build a `RegenRequest` (§5.3) and issue **one tiny scoped LLM call** (one paragraph in/out where possible): *plant {clue} in this paragraph as an observation; dramatize this clearance as a witnessed deduction; resolve this pronoun; rewrite this scaffold sentence as prose.* Each repair re-runs **only the verifier it targeted** (`mutate-then-validate`) and **rolls back on any regression**. This is A_57 §9.3 ("detect → regenerate → re-validate") finally made the default.
2. **Removal of the injectors.** A1–A8, B3, B5, B6, B7, B8, B10 are **removed from the ship path.** Their deterministic strings survive only as a **logged last-resort emergency floor**: if regen fails after K attempts and `preferCompletionOnFailure` is set, the deterministic string may be used **but the chapter is flagged `best_draft_backstop` and a quality-failure is logged** — it never ships silently as prose (today they do). `buildCompletionFallbackChapter` (A5) becomes this floor, not a routine path.
3. **The general "scaffold-not-prose" detector** replaces the N per-template detectors. Seed phrases (`"pressed on to the next concrete detail"`, `"the trail bent toward"`, `"set out the two competing readings"`, `"that detail shifted the reasoning"`, `"was thoroughly cleared by the evidence"`, second-person "you are innocent" verdicts) generalise to the **shape**: a sentence that is *subject + reasoning-verb + raw key-terms with no scene grounding*. It lives in `prose-guard`/`rubric-score` next to `detectTemplateLeakage`/`detectReportStyleClearance`, and — crucially — **it fires the micro-regen** (sets a `scaffold_not_prose` defect) rather than only capping the score. Detection and repair are the same loop.

**Test:** given a chapter containing the A1 `"the trail bent toward …"` fragment, the scaffold detector emits a `scaffold_not_prose` defect anchored to that paragraph; the regen replaces it with a grounded observation; re-verify confirms the clue is still present (clue-presence gate green) and the scaffold phrase is gone; a regen that drops the clue is rolled back (original retained, defect re-queued). The new detector fires on the run-09168377-style and A_59 Sundial fragments in unit tests; 0 occurrences of the seed phrases survive in shipped prose.

**Risk:** (a) **whole-chapter rewrite re-genders characters** — this is a *known, already-paid* lesson ([repair.ts:153–177](../../packages/prompts-llm/src/agent9-prose/repair.ts#L153): the old wholesale-rewrite produced 15–17 pronoun errors/run, which is why phrase-level substitution exists). Therefore Stage-4 regen must be **paragraph-scoped** wherever possible, and every regen re-runs the pronoun validator (`countMisgenderedPronouns`) under `mutateThenValidate`. (b) The rollback must be airtight — generalise the `mutateThenValidate` law to chapter scope; a regen that regresses *any* targeted property is reverted. (c) Cost: 20–30 micro-regens/run is pennies (§8), but cap the per-defect retry count and `log()` any defect that exhausts retries (no silent floor).

### 6.5 Stage 5 — Critique → rewrite at creative temperature (the craft engine)

**Where:** new `packages/prompts-llm/src/agent9-prose/critique-rewrite.ts`; replaces the role (not the file) of `polishPassingChapter` ([post-pass-polish.ts:135](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L135)).

**What:** for the **lowest-scoring ~3–4 chapters/dimensions** (selected from the provisional chapter scores already computed at [agent9-run.ts:4311](../../apps/worker/src/jobs/agents/agent9-run.ts#L4311)), an LLM critiques against the rubric (prose, dialogue, character, atmosphere) and **rewrites to lift them at temp 0.7–0.9**, with deterministic re-validation + rollback. This is where dramatization, idiolect (D6), atmosphere, and de-repetition (A_59 #7) are *earned*. Two LLM calls per targeted chapter (critique + rewrite). The current post-pass runs at temp 0.2 ("prefer no change", [:166](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L166)) and **structurally cannot do this** — Stage 5 is the missing craft engine, not a louder polish.

**Model/temp:** strongest model, temp 0.7–0.9. Reuse the `hasPolishRegression` guard ([post-pass-polish.ts:45](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L45)) — generalised so the rewrite cannot drop a clue/clearance, over-compress (>20% word loss), or regress fairness/coherence/pronoun verifiers; on any regression, **keep the original**.

**Test:** a functional-dialogue chapter (Dialogue 6) is rewritten and re-validated; the rewrite keeps every clue/clearance/locked-fact (rollback fires if not) and the provisional re-score is ≥ the pre-rewrite score; pronoun mismatch count does not increase.

**Risk:** rewrite can regress a fact → the re-validate + rollback is **load-bearing** and must be airtight (A_59 §I). Scope to the lowest 3–4 chapters to stay inside 2× (rewriting all 10 likely breaches it). Latency rises (more calls) — acceptable for a batch generator, not real-time.

### 6.6 Stage 6 — Judge & gate

**Where:** [agent9-run.ts:4311](../../apps/worker/src/jobs/agents/agent9-run.ts#L4311) (`ProseScorer`) + release gate [:5189](../../apps/worker/src/jobs/agents/agent9-run.ts#L5189) + `rubric-score`.

**What:** the K2 rubric + deterministic detectors decide ship / rewrite-again / abort. A_59 shows the internal↔external gap has **closed** (74 vs 74) and the gate fails correctly, so this layer is **largely maintenance** now — keep calibrating against held-out human scores. The one structural change: the scaffold/leakage detectors now *also* drive Stage-4 regen (§6.4), so by the time Stage 6 runs the leakage class should be empty; the gate's role is the final honest ship decision, not the first line of defence.

**Test:** the gate still hard-stops on fair-play failure, mojibake, incomplete suspect-elimination, clue-visibility incomplete (the current `hardStopReasons` at [:5337–5410](../../apps/worker/src/jobs/agents/agent9-run.ts#L5337)); template-leakage caps are now redundant-but-present (defence in depth).

**Risk:** none structural; do not let Stage-6 caps silently substitute for Stage-4 repair (the whole point is to repair, not just cap).

---

## 7. KEEP / DELETE / BUILD register (A_59 §D)

### KEEP (hard-won and correct — the decidable guarantees)
- World-state ledger [world-state.ts](../../packages/prompts-llm/src/world-state.ts); discriminator verifier [discriminator-verifier.ts](../../packages/prompts-llm/src/discriminator-verifier.ts).
- `prose-guard`: `mutateThenValidate`, `allOf`, `checkContractFidelity`, fidelity validators, `generateWithBackstop`/`BestDraftTracker`.
- `rubric-score`: `extractStoryFacts`, A_57 D1/D2/D4 detectors, `applyHardCaps`, `verifyStructure`, `verifyCitations`.
- Pre-commit clue/obligation/stage verifiers [clue-validation.ts](../../packages/prompts-llm/src/agent9-prose/clue-validation.ts); `lintBatchProse` [lint.ts](../../packages/prompts-llm/src/agent9-prose/lint.ts); `detectControlPlaneLeakage`/`detectVerbatimFieldEcho`.
- The generation-time discipline: structured obligations, key-term surfacing, the pronoun-lock block, stage-mode/macro-arc beat contracts.

### DELETE from the ship path (the ~20 prose injectors → convert to regen)
- **Content-injecting (highest value):** A1 clue surfacing, A2 DT scaffold, A3 clearance patch, A4 stage fallback, B3 locked-fact value injection, B5 culprit-evidence injection, B6 resolution backstop, B7 suspect-elimination injection, B8 victim rescue prefix, B10 role-alias substitution.
- **Demote to logged emergency floor:** A5 `buildCompletionFallbackChapter` (never silently ships).
- **Keep as guarded repair (already correct):** B9 pronoun sweep (mutate-then-validate), B4 malformed-surfacing (pronoun-guarded), A7 season-lock (semantic-diff guard), B2 word-form, B11 title normalize, B12 text-hygiene, A8 paragraph split, A9 audit-strip — these are normalization/strip, not prose authorship; they stay but stay guarded.
- The 8-agent review found ~30 latent bugs concentrated in exactly the content-injecting passes; converting them to regen removes the bugs as a side-effect.

### BUILD
1. The unified **Story Bible + beat-sheet** (§5.1, §6.1).
2. The **scoped regen-repair loop** verify→regen→re-verify→rollback (§6.4).
3. The **general scaffold-not-prose detector** that *triggers regen* (§6.4).
4. The **critique→rewrite-at-temperature** pass (§6.5).
5. A **cost-tiered model router** (§8).

---

## 8. Model tiering & cost — fitting inside 2× (~$0.58/run from ~$0.29) (A_59 §E)

| Stage | Model tier | Temp | Cost shape |
|---|---|---|---|
| 1 Bible | deterministic | — | free |
| 2 Generate | **strongest (Opus-class)** | 0.45→0.85 | ~1 full-chapter gen × N chapters (≈ today) |
| 3 Verify | deterministic | — | free |
| 4 Regen-repair | cheap/fast model | low | 20–30 micro-regens (1 paragraph each) = pennies |
| 4 scaffold detector | deterministic | — | free |
| 5 Critique→rewrite | **strongest** | 0.7–0.9 | full-chapter in+out ×2, **scoped to lowest 3–4 chapters** |
| 6 Judge & gate | rubric LLM (unchanged) | — | ≈ today |

- Verifiers are deterministic → free; deleting the injectors is cost-neutral-to-negative.
- The expensive lever is Stage 5; **scoping it to the lowest ~3–4 chapters** (not all 10) keeps it inside 2×, and that is where marginal craft gain lives anyway.
- A stronger generator reduces the Stage-4 defect count, partly self-funding.
- **Router:** add a model field per stage in `getGenerationParams().agent9_prose` so Generate/Rewrite resolve to the strongest deployment and regen/classify to a cheaper one; default to the latest Claude (Opus-class) for craft-critical stages per this environment.

---

## 9. Migration path — incremental, flag-gated, validated on N≥4 (A_59 §H)

Each step is independently shippable and independently measured. **The whack-a-mole stops as soon as step 2 converts the current mole.**

1. **Finish the Bible** — promote `StoryWorldState` to the single source every prompt draws from (deferred A_57 §9.5 clause 2); add the per-chapter beat-sheet. Land structure + dereference first (cost-neutral); promote the gates to blocking second. Flag: `AGENT9_BIBLE_AUTHORITATIVE`.
2. **Build the regen-repair loop + the general scaffold detector**, and **convert the worst injector first — A1 clue/inference surfacing (A_59 #1).** Measure on a powered N≥4 set. Then convert the rest one at a time; each conversion *deletes* an injector. Flag per-injector (`AGENT9_REGEN_<pass>`), default off → on after N≥4 win.
3. **Land the critique→rewrite pass** behind `AGENT9_CRITIQUE_REWRITE` (default off); A/B it on N≥4.
4. **Tier the models** — strongest on Generate + Rewrite, cheap on regen/classify.
5. **Once all injectors are converted and the rewrite pass wins, delete the deterministic prose layer outright** (keep only the guarded normalizers and the logged emergency floor).

**Immediate stop-gaps (tactical, from the A_59 fix-plan — worth doing now, independently of the strategic inversion):**
- **P0 #1/#4 (leakage):** the A1/A2 templates must never ship; convert to regen or drop the inject (the clue is validated present independently). Add the scaffold detector. *Highest single Prose jump.*
- **P0 #2 (pronouns):** `2e32d698` fixed the D5 partial-revert (the count-free `pronounStabilityValidator` label — [agent9-run.ts:1872](../../apps/worker/src/jobs/agents/agent9-run.ts#L1872)/[:4540](../../apps/worker/src/jobs/agents/agent9-run.ts#L4540)). **Re-measure before flipping `pronoun_policy`** (score-sensitive).
- **P0 #3 (clearances):** route A3/B7 through micro-regen; suppress the detective self-clearance.
- **P1 #5 (sundial physics):** Agent 3b magnitude-plausibility check (prefer "loosened/tilted gnomon" over "thermal expansion → 10-min shift").
- **P1 #6 (poison under-planted):** Agent 5/7 schedule ≥1 poison tell at discovery.
- **P2 #7 (repetition):** tighten anti-repetition phrase-history so "truth remained elusive"/"evidence was mounting" can't recur.

---

## 10. Risks & honest limits (A_59 §I)

- **We cannot make string injection read like fiction** — so the deterministic *prose* output must stop shipping, not be reworded. Rewording only moves the leak (confirmed three times: A_57 D4, A_58 #1, A_59 #1).
- **We cannot fix ambiguous-antecedent pronouns deterministically** without false replacements — hence `pronoun_policy` caution. The safe sweep handles the unambiguous residue; the rest needs generation-time discipline (the Bible's locked pronouns) or paragraph-scoped LLM regen.
- **We cannot make the LLM never need repair.** Presence-repair must exist; the only choice is whether it ships as template (today) or is dramatized (target). "Delete the deterministic passes" is *not* the option — "stop letting them ship prose" is.
- **Whole-chapter rewrite can regress facts and re-gender characters** ([repair.ts:153](../../packages/prompts-llm/src/agent9-prose/repair.ts#L153) is the scar tissue) — the re-validate + rollback (`mutateThenValidate` generalised to chapter scope) is load-bearing and must be airtight; prefer paragraph-scoped regen.
- **Latency rises** with more calls — fine for a batch generator, not real-time.
- **Model tier is the ultimate ceiling** — past a point only a better model moves Dialogue 6 / "scenes still feel functional"; the architecture's job is to stop *wasting* the model on scaffolding and spend its capability on prose.
- **Single runs lie** — every step is judged on a powered **N≥4** matched set, matched on chapter count + opening-naming (memory: `canary-k2-single-run-confounded`). Single-story deltas keep producing false "fixed it"/"broke it" conclusions.

---

## 11. Bottom line

The best Agent 9 we can build is **not more guardrails** — it is a clean split where **deterministic code guarantees the case is present, fair, and sound, and a strong LLM (given creative-temperature room and rollback safety) does all the writing.** We already own the hard half (the verifiers + the world-state ledger + the `mutateThenValidate` law + the rubric detectors). The work is narrow: (1) finish the Bible so nothing is re-derived in a prompt; (2) convert the ~20 prose injectors from *inject-prose* to *detect-and-regenerate*, fronted by one general scaffold detector that triggers the regen; and (3) add the critique→rewrite-at-creative-temperature pass the current temp-0.2 post-pass can never be. That fits inside 2× cost, removes ~30 latent bugs as a side-effect, lifts the craft ceiling the rules never could, and **ends the mole hunt** — because no deterministic string ships as prose, there is no "next template" to leak.

---

## 12. Phased implementation plan (detailed)

This expands the §9 migration path into engineering-sized phases. **Sequencing rule:** every phase is independently shippable behind its flag and independently measured on a powered **N≥4** matched set (matched on chapter count + opening-naming — `canary-k2-single-run-confounded`); no flag flips to default-on until its N≥4 gate is green. Phases P0 and P1 are parallelizable; P3 depends on P1; P4/P5 depend on P3.

### Phase P0 — Tactical stop-gaps (ship now, independent of the strategic inversion)

The A_59 fix-plan items. Each is small, high-value, and does not require the Bible/regen machinery. Land these first to claw back the 74→~80 band while P1–P3 are built.

| Task | Where | Acceptance | N≥4 gate |
|---|---|---|---|
| P0.1 A1/A2 leakage: never ship the clue/DT scaffold — drop the inject (clue is validated present elsewhere) or route to a one-call regen | [deterministic-repair.ts:283](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L283)/[:353](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L353) | 0 occurrences of the seed phrases in shipped prose; clue-presence gate still green | prose ↑, no clue-presence regression |
| P0.2 Seed the general scaffold detector (cap + log; regen wiring lands in P3) | `rubric-score`/`prose-guard` next to `detectReportStyleClearance` | new detector fires on the A_59 Sundial + run-09168377 fragments in unit tests | — |
| P0.3 Pronoun re-measure post-`2e32d698` | [agent9-run.ts:1872](../../apps/worker/src/jobs/agents/agent9-run.ts#L1872)/[:4540](../../apps/worker/src/jobs/agents/agent9-run.ts#L4540) | sweep repair-count trends down; no `mutation-revalidation … reverted` on the sweep; **then** decide `pronoun_policy` flip | Character ↑, 0 reverts |
| P0.4 Clearance + detective self-clearance (A3/B7) → micro-regen or suppress self-clearance | [deterministic-repair.ts:467](../../packages/prompts-llm/src/agent9-prose/deterministic-repair.ts#L467), [agent9-run.ts:2042](../../apps/worker/src/jobs/agents/agent9-run.ts#L2042) | `detectReportStyleClearance` clean on shipped reveal; no "As for myself … which proves … responsible" | — |
| P0.5 Agent 3b magnitude-plausibility check on `physical_law` devices | Agent 3b device + `AGENT3B_PLAUSIBILITY_JUDGE` | device `corePrinciple`/`underlyingReality` carries a believable chain (loosened fixing + heat → tilt → delay), not raw expansion | clues/evidence ↑ |
| P0.6 Early poison plant at discovery | Agent 5/7 clue scheduling | Ch1 carries ≥1 poison tell (numbness/bitter/no wound/water glass) | opening_hook/fair-play ↑ |
| P0.7 Anti-repetition phrase-history dedup | [lint.ts](../../packages/prompts-llm/src/agent9-prose/lint.ts) / NSD phrase tracking | no stock phrase ("truth remained elusive", "evidence was mounting") repeats >1× | — |

**Exit:** an N≥4 set shows no deterministic-template phrases in prose, no report-style clearance, ~0 pronoun slips. Order within P0: P0.1 → P0.4 → (P0.3 re-measure) → P0.5 → P0.6 → P0.7 (A_59 §"Sequencing").

### Phase P1 — Bible foundation (structure + dereference)

**Goal:** one canonical, frozen object every prompt dereferences; nothing re-derived. Cost-neutral (deterministic).

- **P1.1** Add `StoryBible` type + `buildStoryBible(inputs)` extending `buildStoryWorldState` with `clock`/`placement`/`voices`/`discriminatingTest`/`beatSheet` (§5.1). Source from `temporalContext`, `characterBundle` ([types.ts:99](../../packages/prompts-llm/src/agent9-prose/types.ts#L99)), `storyContract` ([types.ts:173](../../packages/prompts-llm/src/agent9-prose/types.ts#L173)), `clueDistribution`, `macroArcPlan`.
- **P1.2** Build `ChapterBeat[]` by folding `MacroArcEntry` + `StageModeProfile` + `ChapterRequirementLedgerEntry` into the typed beat-sheet.
- **P1.3** Behind `AGENT9_BIBLE_AUTHORITATIVE`: rewrite the two drift surfaces to read the Bible — prose-scraped time anchor ([context-management.ts:125](../../packages/prompts-llm/src/agent9-prose/context-management.ts#L125)) → `bible.clock`; shape-based atomic/descriptive re-classification ([prompt-builder.ts:120](../../packages/prompts-llm/src/agent9-prose/prompt-builder.ts#L120)) → `bible.facts[].type`.
- **P1.4** Route role/identity re-filtering ([obligation-block.ts:59](../../packages/prompts-llm/src/agent9-prose/obligation-block.ts#L59)) and the DT framing ([discriminating.ts:18](../../packages/prompts-llm/src/agent9-prose/discriminating.ts#L18)) through `bible.characters`/`bible.victim`/`bible.culprits`/`bible.discriminatingTest`.

**Acceptance:** `buildStoryBible` pure + null-safe; a fixture with one staged/true time produces exactly one `clock` pair and no second time appears in any prompt block; identical case → identical Bible (deterministic). **N≥4:** no coherence regression vs baseline.

**Risk:** the Bible must be the *only* dereference — leaving any builder reading the old source re-opens the drift it closes.

### Phase P2 — Bible gates to blocking (repair at source)

**Goal:** an unsound/incoherent case is repaired before prose, not in it.

- **P2.1** Promote `runContradictionGate` ([agent9-run.ts:3359](../../apps/worker/src/jobs/agents/agent9-run.ts#L3359)) and `verifyDiscriminator` ([:3388](../../apps/worker/src/jobs/agents/agent9-run.ts#L3388)) from warn-level to blocking, with an upstream repair hook (Agent 3b/5/7) so the gate converges rather than just aborting.
- **P2.2** Wire conflicts into the existing preflight abort path with clear repair telemetry.

**Acceptance:** fixtures fail correctly (culprit=victim, mechanism↔environment, unknown gender, unaccounted suspect). **N≥4:** abort rate does not rise on sound cases (the gate only catches genuinely unsound ones); paired with upstream repair so net completion is flat-or-up.

**Risk:** turning previously-shipping unsound cases into aborts — must land *with* the upstream repair, validated on N≥4 before default-on.

### Phase P3 — Regen-repair loop + general scaffold gate + convert the first injector

**Goal:** the structural inversion; ends the whack-a-mole the moment A1 is converted.

- **P3.1** New `regen-repair.ts`: the verify→regen→re-verify→rollback loop (§6.4), reusing `mutateThenValidate` (prose-guard) and the `hasPolishRegression` rollback skeleton ([post-pass-polish.ts:45](../../packages/prompts-llm/src/agent9-prose/post-pass-polish.ts#L45)). Paragraph-scoped regen; per-defect retry cap; `log()` on exhaustion.
- **P3.2** Promote the P0.2 scaffold detector to **trigger a `scaffold_not_prose` defect** (detection + repair are one loop), generalised from seed phrases to the shape (subject + reasoning-verb + raw key-terms, no scene grounding).
- **P3.3** Convert **A1 clue/inference surfacing** (the A_59 #1 mole) from inject to regen behind `AGENT9_REGEN_clue`. Demote the deterministic string to a logged emergency floor (`best_draft_backstop` + quality-failure log), never a silent ship.
- **P3.4** Emit Stage-3 `ProseDefect[]` (§5.2) from the existing pure verifiers; Stage-4 consumes it.

**Acceptance:** the A_59 fragment produces a `scaffold_not_prose` defect → regen → clue still present, scaffold gone; a regen that drops the clue or raises pronoun mismatch is rolled back and re-queued; 0 seed-phrase occurrences ship. **N≥4:** prose ↑, no presence/fairness/coherence regression, cost within budget.

**Risk:** whole-chapter regen re-genders characters ([repair.ts:153](../../packages/prompts-llm/src/agent9-prose/repair.ts#L153) scar) — enforce paragraph scope + pronoun re-validate under `mutateThenValidate`.

### Phase P4 — Convert remaining content injectors (one at a time)

Each conversion deletes an injector and is gated `AGENT9_REGEN_<pass>`, validated on N≥4 before default-on. Order by leakage value: **A2 DT scaffold → A3 clearance → B6 resolution backstop → B5 culprit-evidence → B7 suspect-elimination → A4 stage fallback → B3 locked-fact value → B8 victim rescue → B10 role-alias.** A5 `buildCompletionFallbackChapter` becomes the **logged emergency floor** (the union target of the remaining strings). Keep B2/B4/B9/B11/B12/A7/A8/A9 as **guarded normalizers** (not prose authorship).

**Acceptance per pass:** the pass's presence guarantee still holds via regen (clue/clearance/resolution/culprit/elimination present); the injector's scaffold phrase no longer ships; rollback retains the original on regression. **N≥4 per pass.**

**Risk:** a regen that fails to satisfy the presence guarantee must re-queue or fall to the logged floor — never silently drop a required obligation (the explicit reason the injectors were unguarded at [agent9-run.ts:4538](../../apps/worker/src/jobs/agents/agent9-run.ts#L4538)).

### Phase P5 — Critique→rewrite at creative temperature

**Goal:** the craft engine the temp-0.2 post-pass can never be.

- **P5.1** New `critique-rewrite.ts` behind `AGENT9_CRITIQUE_REWRITE`: select the lowest-scoring ~3–4 chapters from the provisional scores ([agent9-run.ts:4311](../../apps/worker/src/jobs/agents/agent9-run.ts#L4311)); critique vs rubric (prose/dialogue/character/atmosphere); rewrite at temp 0.7–0.9.
- **P5.2** Generalise `hasPolishRegression` so the rewrite cannot drop a clue/clearance/locked-fact, over-compress (>20%), or regress fairness/coherence/pronoun verifiers; rollback to original on any regression.

**Acceptance:** a Dialogue-6 chapter is rewritten, keeps every clue/clearance/locked-fact (rollback fires otherwise), re-score ≥ pre-rewrite, pronoun mismatch does not rise. **N≥4:** dialogue/atmosphere/prose ↑ on targeted chapters; cost within 2×.

**Risk:** load-bearing rollback (`mutateThenValidate` generalised to chapter scope); scope to 3–4 chapters to stay inside 2×.

### Phase P6 — Model tiering

- **P6.1** Add a per-stage `model` field in `getGenerationParams().agent9_prose`: strongest (Opus-class) on Generate + Rewrite; cheaper/faster on micro-regens, classification, scaffold detection.
- **P6.2** Measure defect-rate per generator tier (a stronger generator reduces Stage-4 burden — partly self-funding).

**Acceptance:** router resolves per stage; total run cost ≤ ~$0.58. **N≥4:** craft ↑ at cost ≤ 2×.

### Phase P7 — Delete the deterministic prose layer

Once every content injector is converted and the rewrite pass wins on N≥4: remove the converted injectors outright, keeping only the guarded normalizers (B2/B4/B9/B11/B12/A7–A9) and the single logged emergency floor. Update the §3.3 inventory to reflect the deletions and close the migration.

**Acceptance:** no deterministic string ships as prose; the emergency floor, if it ever fires, logs a quality failure and flags the chapter. **N≥4:** stable at the target band with the injector layer gone.

---

## Appendix A — Source map (line numbers valid as of this LLD's session, branch `redesign/agent-blue-sky`)

| Symbol | File | Line |
|---|---|---|
| `runAgent9` | apps/worker/src/jobs/agents/agent9-run.ts | 3018 |
| world-state construct + gates (orchestrator) | same | 3322–3400 |
| Layer-B injector cascade | same | 4549–4594 |
| release gate / hard-stops | same | 5189 / 5337–5410 |
| `mutateThenValidate` call sites (grounding-lead / pronoun) | same | 2443 / 4540 |
| `buildPronounStabilityValidator` (count-free, post-`2e32d698`) | same | 1872 |
| `generateProse` | packages/prompts-llm/src/agent9-prose/generate.ts | 1979 |
| batch loop / attempt loop / LLM call | same | 2204 / 2273 / 2446 |
| post-pass polish invoke / non-convergent abort | same | 3024 / 3418 |
| `StoryWorldState` / `buildStoryWorldState` / `runContradictionGate` | packages/prompts-llm/src/world-state.ts | 45 / 95 / 133 |
| `verifyDiscriminator` | packages/prompts-llm/src/discriminator-verifier.ts | 64 |
| `mutateThenValidate` / `allOf` | packages/prose-guard/src/mutate.ts | 22 / 50 |
| `checkContractFidelity` / `detectTemplateLeakage` / `countMisgenderedPronouns` | packages/prose-guard/src/fidelity.ts | 42 / 148 / 174 |
| `extractStoryFacts` / `detectReportStyleClearance` / `applyHardCaps` / `verifyStructure` | packages/rubric-score/src/{facts,facts,hard-caps,structural-verifiers}.ts | 86 / 220 / 15 / 235 |
| `validateChapterPreCommitObligations` | packages/prompts-llm/src/agent9-prose/clue-validation.ts | 950 |
| `lintBatchProse` / blocking room-inventory `template_bleed` | packages/prompts-llm/src/agent9-prose/lint.ts | 106 / 557 |
| A1 clue surfacing / A2 DT scaffold / A3 clearance | packages/prompts-llm/src/agent9-prose/deterministic-repair.ts | 283 / 353 / 467 |
| A4 stage fallback / A5 whole-chapter fallback | same | 595 / 816 |
| `polishPassingChapter` (temp 0.2) / `hasPolishRegression` | packages/prompts-llm/src/agent9-prose/post-pass-polish.ts | 135 / 45 |
| `buildPronounAccuracyBlock` | packages/prompts-llm/src/agent9-prose/prompt-blocks.ts | 21 |
| `buildChapterObligationBlock` | packages/prompts-llm/src/agent9-prose/obligation-block.ts | 34 |
| `ClueObligationContext` / `ChapterRequirementLedgerEntry` / `MacroArcEntry` | packages/prompts-llm/src/agent9-prose/types.ts | 314 / 324 / 38 |
| prose-scraped time anchor (drift surface) | packages/prompts-llm/src/agent9-prose/context-management.ts | 125–143 |
| `isAtomicLockedFactValue` (shape re-classification) | packages/prompts-llm/src/agent9-prose/prompt-builder.ts | 120 |

## Appendix B — feature flags / env vars (current)

| Flag | Default | Effect | LLD relevance |
|---|---|---|---|
| `AGENT9_MUTATION_REVALIDATION` | on | the validation-gated-mutation law | the regen loop generalises this |
| `AGENT9_GROUNDING_LEAD` | **off** | deterministic grounding-lead prepend (B1) | leave off; Stage-4 regen replaces it |
| `AGENT9_REDESIGN_V1` | on | bottom-up redesign path | the contract substrate Stage 2 builds on |
| `pronoun_policy` / `pronoun_checking_enabled` | strict / on | deterministic pronoun repair (B9) | re-measure post-`2e32d698` before changing |
| `ENABLE_PROSE_BLIND_READER` | off | LLM fair-play judge (warning-only) | complements Stage-6 |
| `opener_exhaustion_bypass_enabled` | on | the `template_bleed` backstop | keep on; the abort hazard is when it's off |
| **`AGENT9_BIBLE_AUTHORITATIVE`** | *(new, **off**)* | P1.3 — dereference the true-time anchor from case ground truth (`context-management.ts`/`prompt-builder.ts`); **wired, inert until set** | migration step 1 |
| **`AGENT9_BIBLE_GATES_BLOCKING`** | *(new, **off**)* | P2 — contradiction gate + discriminator warn→throw (`agent9-run.ts`); **wired, inert until set** | migration step 1 |
| **`AGENT9_REGEN_CLUE`** | *(new, **off**)* | P3.3 — clue-miss regen pass in `generate.ts` (A1 replacement); **wired, inert until set**. N≥4 A/B staged: `scripts/exp-regen-clue-ab.mjs` (paired replay) + `-analyze.mjs` (verdict); protocol in [`regen-clue-n4-experiment.md`](./regen-clue-n4-experiment.md) | migration step 2 |
| **`AGENT9_REGEN_<pass>`** | *(new, off)* | P4 — further per-injector regen conversions via `runInsertionRegenPass` (clearance wired) | migration step 2 |
| **`AGENT9_CRITIQUE_REWRITE`** | *(new, **off**)* | P5 — critique→rewrite lowest ≤4 chapters at temp 0.7–0.9 (`agent9-run.ts`); **wired, inert until set** | migration step 3 |
| **`AGENT9_MODEL_GENERATE`/`_REWRITE`/`_CRITIQUE`/`_REGEN`** | *(new, unset)* | P6 — per-stage model override; unset ⇒ today's deployment | migration step 4 |

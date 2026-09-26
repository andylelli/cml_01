# 08 — Agents 7 & 7.5: narrative outline and story geometry

**Scope:** `apps/worker/src/jobs/agents/agent7-run.ts` (2,682 lines / 1,992 code), `packages/prompts-llm/src/agent7-narrative.ts` (993 / 793), `packages/prompts-llm/src/agent7-narrative-schema.ts` (147 / 103), `apps/worker/src/jobs/agents/agent75-run.ts` (348 / 225). 4,170 lines, 3,113 code lines · **Read:** every line · **Written:** 2026-09-26
**Finding prefix:** A7 · **Method:** [RUBRIC.md](../RUBRIC.md)

## 1. What this area does

```
orchestrator stage("narrative") ─► runAgent7(ctx)                      agent7-run.ts:1705 (978 LOC, cc 159)
  P0  config: pacing guardrails, locked-fact / completeness spreads     :1706-1725
  P1  formatNarrative()  (via executeAgentWithRetry when scoring on)   :1727-1842
  P2  act-purpose synthesis, beat coercion, field hoist (+R4 counters)  :1844-1876
  P3  schema validation → one schema-repair retry → throw               :1878-1942
  P4  scene-count gate → retry → rebalanceNarrativeSceneCounts…         :1944-2051
  P5  X32 closure count; outline coverage gate → coverage retry         :2053-2129
  P6  clue-pacing gate → retry → 2nd retry → applyDeterministicCluePre… :2131-2311
  P7  pre-commit completeness → bundled remediation retry               :2313-2373
  P8  World-First scene enrichment                                      :2375-2385
  P9  Pillar-4 completeness pre-patch + gate                            :2387-2477
  P10 clue-coverage force-assign                                        :2479-2524
  P11 deterministic DT / suspect-closure vocabulary patch               :2526-2599
  P12 Golden-Age beat-arc drift warnings                                :2601-2621
  P13 final coercion, emit [R4] telemetry, commit ctx.narrative         :2623-2650
  P14 post-commit stamps: scheduler shadow/authority, mechanism gate,
      suspect-clearance fold, DT evidence, discovery tell,
      plant-before-reveal, decisive-trace plant                         :2652-2681
formatNarrative (agent7-narrative.ts:857) = buildNarrativePrompt (system 1.1k + developer ~12k + user ~12–18k chars)
      → client.chat (json_object, or json_schema when AGENT7_STRUCTURED_OUTPUT) → parse ladder → light normalisation
runAgent75(ctx) (agent75-run.ts:190): deriveStoryGeometry(CML, clues, outline) → optional 1 LLM resolve
      → [gate] applyGeometryOutlineRepair (in place) → case-time coherence → ctx.storyGeometry + diagnostic
```

Data in: `ctx.cml`, `ctx.clues`, `ctx.inputs`, `ctx.lockedFactRegistry`, `ctx.characterBundle`, `ctx.worldDocument`. Out: `ctx.narrative`, `ctx.outlineCoverageIssues`, `ctx.agent7Coercion`, `ctx.storyGeometry`, costs, ~38 warning sites.

## 2. Verdict

Agent 7.5 is healthy: small, typed at its edges, never-throw by design, per-call cost deltas done right. Agent 7 is the #5 hotspot in the repo (73,704) and its history is pure accretion (+2,893 / −211 lines across 37 commits): every defect became a new pass or a new retry branch inside one function. The complexity does not come from shared state — **`runAgent7` shares only 8 locals across its 14 phases, and only `narrative` is mutable** — but from one concept ("accept an LLM outline candidate") being re-implemented at 8 `formatNarrative` call sites, each with its own subset of normalise / validate / rescore / cost bookkeeping. That is the defect class this audit targets, and it has already fired (A_67 "uncoerced retry beats"), and it is still firing (schema retry skips act-purpose synthesis; cost double-counted; pacing path never rescored). The single most valuable change is **A7-02: one candidate pipeline (`generate → normalise → validate → adopt`) used by every call site**, which falls out almost free from the decomposition in A7-01. The second is **A7-03**: the prompt's case summary is a stale copy of Agent 6's, and MEASURED in 125/125 archived prompts it tells Agent 7 "Victim: Unknown", "Motive: Unknown motive" and lists the culprit as a **Witness**.

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| A7-01 | P1 | B | Decompose `runAgent7` (978 LOC, cc 159) into a coordinator over 14 phases in `agent7/`; real shared state is 8 locals | R0 (+R1 helper) | L (2 d) | −60 (moves, + headers) |
| A7-02 | P1 | C/F | One outline-candidate pipeline for 8 call sites (inputs, accounting, normalise, validate, rescore) | R1 + R2 | M | −110 |
| A7-03 | P1 | C/E | One typed `CaseBrief` accessor for the CML-to-prompt summary shared by Agents 6/7/8 | R1 then R2 | M | −120 here, ~−200 across agents |
| A7-04 | P2 | E | 126 `any`: `CaseData = any`, `SceneRef.scene: any`, untyped lambdas over a typed outline, stamps missing from `Scene` | R0 | M | ~0 (−90 `any`) |
| A7-05 | P2 | C | Outline-geometry primitives duplicated: act split ×4, tolerance check ×5, scene flatten ×13 + 4 flatteners | R1 | S | −45 |
| A7-06 | P2 | C | Two clue-coverage force-assigners, placement→act ×4 with divergent defaults, "clue-bearing" defined twice, GENERIC regex ×2 | R1 | S | −40 |
| A7-07 | P2 | C/F | Scoring twice: retry-scorer closure vs `rescoreNarrative` diverge; pacing path never rescores | R1 | S | −25 |
| A7-08 | P2 | D | Flags: runtime getters are correct; 4 parse idioms; `contractRecoveryEnabled` forks the function 4× for a dormant mode; `retriesEnabled` dead | R0/R1/R2 | S | −10 (−70 if R2) |
| A7-09 | P2 | B/I | `buildUserRequest` (333 LOC, 6 params) → section builders; prose-requirements block and clue-pacing rule sent twice in 125/125 prompts | R0 / R2 | M | 0 / −40 |
| A7-10 | P2 | E | `agent7-narrative-schema.ts` is a request schema, not a boundary parser; 3 drifted bodies of the outline shape | R1/R2 | M | — |
| A7-11 | P1 | F/D | S7 is unblocked (cause fixed 08-04), but the counters cover 2 of ≥15 coercion sites; 2 sites are silent | R1 (telemetry) | S | +20 |
| A7-12 | P3 | A/D | Post-commit stamps → `agent7/stamps.ts` with shared helpers; small dead/vestigial items | R0 | S | −40 |
| A7-13 | P3 | C | Arc position computed 3 ways (A7 vs two in A9); 97/358 prose prompts carry two different emotional registers | R2 | S | −20 |
| A7-14 | P3 | E | Agent 7.5: minor type leaks only; leave structurally as is | R0 | S | −3 |

### A7-01 — Decompose `runAgent7` into a coordinator over named phases
- **P1 · lens B · R0 (moves) + R1 (generate helper) · L (2 days)**
- **Evidence (MEASURED):** `agent7-run.ts:1705-2682`, 978 LOC, cc 159, depth 6. I scripted a scan of top-level declarations against the phase ranges in §1. It found 20 declarations. 8 cross phase boundaries: `narrative` (all 14 phases, the only mutable one); `pacingGuardrails`, `lockedFactsSpread`, `completenessSpread` (used only to build `formatNarrative` inputs, in 6 phases); `contractRecoveryEnabled` (4 phases); `minClueSceneRatio` (P6); `finalCoverageIssues` and `coveragePatched` (P11 → P13). The phases also touch 23 `ctx` fields. Counts: 8 `formatNarrative` calls, 12 `narrative =` assignments, 8 cost writes, 10 `throw`, 38 `ctx.warnings.push`, 9 `reportProgress`. The broken indentation at `:1977-2049`, `:2078-2128` and `:2160-2309` shows where flag branches were wrapped around code without re-indenting it.
- **Proposal:** `createAgent7Run(ctx)` returns `Agent7Run = { ctx, contractRecovery, minClueSceneRatio, expectedScenes, tolerance, generate(extraGuardrails, label), adopt(candidate, reason) }`. Each phase has the signature `(run, outline) => Promise<NarrativeOutline>`: `generateInitialOutline`, `ensureSchemaValid`, `enforceSceneCount`, `enforceOutlineCoverage`, `enforceCluePacing`, `enforcePreCommitCompleteness`, `applyWorldFirstEnrichment`, `enforceCompletenessContract`, `forceAssignUncoveredClues`, `applyCoveragePatch` (returns `{issues, patched}`), `warnBeatArcDrift`, `commitOutline`, `applyPostCommitStamps`. `runAgent7` becomes a ~60-line sequence. Target modules are in §4.
- **Benefit:** max function cc 159 → ~25 (the pacing ladder); no function over 150 LOC in the file; the closure state is 8 locals, not agent 9's ~100, so the threading risk REVIEW_03 describes for S4 barely applies here.
- **Verification:** R0 moves: typecheck, existing 11 test files, `build:all`, `preflight-dist-check`. For the `generate` helper, first add the characterisation harness in §7, then check that prompt hashes, `ctx.narrative`, `ctx.warnings` and `ctx.agentCosts` are byte-identical across 6 scripted scenarios.
- **Relates to:** A7-02, A7-05, A7-08; S4 (same technique, far cheaper here).

### A7-02 — One outline-candidate pipeline for all 8 call sites
- **P1 · lens C/F · R1 (extraction) + R2 (uniform normalise/validate) · M**
- **Evidence (INFERRED from code, counts MEASURED):** the 11-line `formatNarrative` input literal is repeated at `:1732, :1828, :1895, :1991, :2089, :2173, :2225, :2326`. The time/cost accumulation block is repeated 7 times (`:1908, :2011, :2102, :2189, :2241, :2344`, …), mixing `|| 0` and `?? 0`. What each candidate receives differs by call site:

  | candidate | act-purpose synth | beat coerce + hoist | schema validate | rescore |
  |---|---|---|---|---|
  | first attempt | ✅ `:1848` | ✅ `:1863` | ✅ `:1879` | (scored) |
  | schema retry `:1895` | ❌ | ✅ `:1916-1926` | ✅ `:1928` | ✅ |
  | scene-count retry / repair `:1991` | ❌ | final pass only | ❌ | ✅ |
  | coverage retry `:2089` | ❌ | final pass only | ❌ | ✅ |
  | pacing retry, 2nd retry, fills `:2173, :2225` | ❌ | final pass only | ❌ | ❌ |
  | pre-commit remediation `:2326` | ❌ | hoist only `:2350` | ❌ | ✅ |

  The A_67 "final coercion" (`:2623-2635`) was added to cover the gaps in the column above it. It fixed two of the four columns. Schema validation is called only at `:1879` and `:1928` repo-wide (grep for `"narrative_outline"`).
- **Proposal:** add `agent7/generate.ts`. `generate(extra, label)` builds the inputs once and records **per-call** cost with the `getTotalCost()` before/after delta that `agent75-run.ts:117,149` already uses. `normalizeOutlineCandidate(ctx, c, label)` runs act-purpose synthesis, beat coercion, the hoist and per-site counters (A7-11). `adoptOutline(run, c, reason)` rescores (A7-07) and assigns. Step 1 (R1): move the input construction and the accounting into `generate` without changing semantics. Step 2 (R2, flag `AGENT7_UNIFORM_CANDIDATE`, default OFF): normalise and schema-validate every candidate before its acceptance check. The flag is needed because hoisting before `evaluateOutlineCoverage` can change retry acceptance.
- **Benefit:** −110 lines; removes the defect class behind A_67 and three live instances (§9 D2, D3, D4); the final coercion pass becomes a no-op and can then be deleted.
- **Verification:** step 1 with the harness from §7 (byte-equal prompts and outlines; `agentCosts` changes only where D3 applies, which is report metadata and cannot affect prose, so ADR-0004 exempts it). Step 2 by probe per ADR-0004.
- **Relates to:** A7-01, A7-07, A7-11, §9 D2–D4.

### A7-03 — One typed `CaseBrief` accessor for the prompt-side case summary
- **P1 · lens C/E · R1 (extract, byte-preserving) then R2 (correct values) · M**
- **Evidence (MEASURED):**
  - jscpd finds 38 duplicated lines between `agent6-fairplay.ts` and `agent7-narrative.ts`, and 16 more between `agent7-narrative.ts` and `agent8-novelty.ts`.
  - The shared pattern is the same in every copy: `legacy = caseData as any; cmlCase = legacy.CASE ?? {}; meta = cmlCase.meta ?? legacy.meta`. From that it derives title, axis, era, crime, victim, culprit, motive, method, false assumption, cast roles, inference steps, discriminating test and constraints (`formatConstraintList`), and renders them as markdown sections (`agent7-narrative.ts:235-330` ≡ `agent6-fairplay.ts:368-470` and `:284-300`).
  - Agent 6's copy was audited against CML 2.0: comments FA-1…FA-5, FB-1…FB-9 and FC-2, for example *"FA-3: CML 2.0 has no setup.crime.victim field"*. Agent 7's copy was not. It still reads `legacy.setup.crime.victim`, `legacy.solution.culprit.motive`, `step.type`/`step.reasoning` and top-level `legacy.cast` (`:249-257, :286-287, :532-540`), all of which are absent from CML 2.0.
  - No producer of the legacy `setup` shape exists anywhere in `apps/` or `packages/`.
  - The consequences are listed in §9 D1. The prompt tests pin the dead shape: `agent7.test.ts:11-80` uses a pre-CASE fixture with top-level `setup.crime.victim`.
- **Proposal:** `packages/prompts-llm/src/shared/case-brief.ts` with `deriveCaseBrief(cml): CaseBrief`. It uses `@cml/cml` `isVictimArchetype`/`isDetectiveArchetype` and the schema's `role` field for cast roles, and returns typed fields plus `render*` helpers for the shared sections. Step 1: Agents 6, 7 and 8 call it through per-agent adapters that reproduce today's exact bytes, verified with a new snapshot test on a CML-2.0 fixture. Step 2 (R2, flag): switch Agent 7's adapter to the correct values (named victim, real motive, culprit not labelled Witness).
- **Benefit:** `buildDeveloperContext` shrinks from 189 LOC / cc 40 to ~50; three or four bodies become one; the prompt defect is fixed by construction.
- **Verification:** snapshot of `buildNarrativePrompt` and the Agent 6/8 prompt builders on two CML-2.0 fixtures, byte-equal in step 1.
- **Relates to:** areas owning Agents 6 and 8; A7-09; A7-14 (a 4th suspect definition).

### A7-04 — Type the outline and the case; remove ~90 of 126 `any`
- **P2 · lens E · R0 · M**
- **Evidence (MEASURED, token count 136 including casts):** ~41 are scene access (`SceneRef.scene: any` at `:671`, `r.scene as any`, `scene: any`); ~21 are act lambdas `(a: any)` over `narrative.acts`, which is already typed `ActStructure[]`; ~23 are clue/mapping lambdas; 12 are `(ctx.cml as any)?.CASE ?? ctx.cml` and its `cml` variant (8 `CASE ??` sites, two of them with a `?? {}` fallback instead of `?? cml`: `:1339, :2544`). `@cml/story-geometry` already exports `caseOf` (`derive.ts:28`), and this file already imports from that package. `(ctx as any).scoreAggregator?.upsertDiagnostic?.` at `:1613` is unnecessary; `agent75-run.ts:341` calls the same method typed. `ctx.characterBundle as any` at `:1722`. The `agent7Coercion` type is declared twice (`agent7-run.ts:1555` and inline at `shared.ts:269`). The root cause is `export type CaseData = any` (`packages/cml/src/index.ts:105`).
- **Proposal:** type `SceneRef.scene` as `Scene`. Add `OutlineSceneStamps` (`cluesPlanted`, the five World-First fields, `suspectClearanceAllowed`, the mechanism-gate fields, `geometryRole`) to `Scene` in `agent7-narrative.ts`, so Agent 9 and story-geometry can read them typed as well. Replace the CASE casts with a typed `caseOf`. Declare the coercion counter type once in `shared.ts`.
- **Benefit:** about −90 `any`; the stamp fields, currently invisible in the outline type, become part of the artifact contract.
- **Verification:** type-only change: typecheck and existing tests. ADR-0004 exempt.
- **Relates to:** A7-10; cross-area `CaseData = any`.

### A7-05 — One set of outline-geometry primitives
- **P2 · lens C · R1 · S**
- **Evidence (MEASURED):**
  - The act split `round(n·r1), round(n·r2), n−a1−a2` exists 4 times: `agent7-narrative.ts:563-565`, `agent7-run.ts:812-818` (`computeTargetActSceneCounts`), `:1780-1783`, `:1980-1983`. Two of the copies carry a comment saying "the SAME ratios as buildUserRequest()".
  - `|actual − expected| > tolerance` appears 5 times (`:1777, :1957, :1967, :2020, :2034`).
  - `getSceneTarget(targetLength ?? "medium")` appears 3 times (`:1711, :1775, :1950`).
  - 13 inline `(narrative.acts ?? []).flatMap((a: any) => …)`.
  - Four scene flatteners sit in or next to the area (`flattenNarrativeScenes :762`, `formatNarrative :958`, story-geometry `flattenScenes`, the loop in `applyWorldFirstSceneEnrichment :1255`).
  - Three act-number resolutions (`:766`, `:873`, `:1261`).
- **Proposal:** `computeActSceneCounts(total)` exported from prompts-llm (the prompt owner). Add `countScenes`, `sceneHasClue`, `withinSceneTolerance` and a single `flattenNarrativeScenes` in `agent7/scene-refs.ts`.
- **Benefit:** −45 lines; one place to add the act-3 guard for §9 D6.
- **Verification:** all copies are identical today; add a unit test over totals 1–40.
- **Relates to:** A7-01, §9 D6.

### A7-06 — Merge the clue-coverage and placement duplicates
- **P2 · lens C · R1 · S**
- **Evidence (MEASURED/INFERRED):**
  - `reassertClueCoverage` (`:516-544`) and the P10 gate (`:2479-2524`) are the same algorithm; the helper's own comment says it "mirrors the main clue-coverage gate".
  - placement→act appears 4 times with **divergent defaults**: unknown placement maps to act 2 at `:530` and `:2501`, to act 3 at `:1093`, and the scoring `ClueRef` maps a missing `act_number` to `undefined` (`:1753`, which the adapter treats as *early*, `agent7-scoring-adapter.ts:133`) but to `"late"` in `rescoreNarrative` (`:1480`).
  - "Clue-bearing scene" is defined two ways: the pacing gate counts any non-empty `cluesRevealed` (`:2135`), while pre-assignment first drops IDs not in the distribution (`:1012-1022`). A hallucinated `clue_1`, the ID used in the prompt's own example at `agent7-narrative.ts:827`, therefore passes the gate.
  - `GENERIC_PATCH_RE` (`:2412`) and `GENERIC_PATTERNS` (`:2448`) are the same literal, 36 lines apart, one for the patch and one for the gate that checks it; they sit under two consecutive `if (ctx.inputs.enableOutlineCompleteness)`.
- **Proposal:** `forceAssignUncoveredClues(narrative, clues)`, `actForPlacement` / `placementForAct` (one default, chosen by the owner), `isClueBearing(scene, validIds)`, and one `GENERIC_CONTRACT_VALUE_RE`.
- **Benefit:** −40 lines; removes three silent divergences.
- **Verification:** the merge of identical bodies is R1 (characterisation on fixtures). Choosing one placement default is R2, because it changes behaviour only for clues with a missing or invalid placement.
- **Relates to:** A7-07, A7-11.

### A7-07 — One outline scorer
- **P2 · lens C/F · R1 · S**
- **Evidence (INFERRED):** the scorer closure passed to `executeAgentWithRetry` (`:1746-1814`) applies the scene-count F gate and `applyHonestScorer`. `rescoreNarrative` (`:1470-1498`) applies neither and maps clue placement differently (A7-06). Rescoring happens at 6 of 10 adoption sites; the pacing path (`:2206, :2253, :2267, :2292`) and the deterministic fill at `:2144` never rescore (§9 D4). Under `HONEST_SCORERS=enforce` the first score is honest and a post-retry score is the vanity one.
- **Proposal:** `scoreOutline(ctx, outline, { enforceSceneCount })`, called both by the retry scorer and by `adoptOutline` (A7-02).
- **Benefit:** −25 lines; the report's agent-7 phase score always describes the shipped outline.
- **Verification:** R1: scores match on fixtures when `HONEST_SCORERS=off` (the default).
- **Relates to:** A7-02.

### A7-08 — Flags: consolidate parsing, and decide the dormant recovery-off mode
- **P2 · lens D · R0 / R1 / R2 · S**
- **Evidence (MEASURED):** every Agent-7 flag is a runtime getter; `node scripts/module-const-flag-check.mjs` reports it clean. The ADR-0004 bug (X9) is fixed and pinned by `agent7-flags-runtime.test.ts`. But four parse idioms remain: `/^(1|true|yes|on)$/i` (`:70, :79, :93, :113`), `!/^(0|false|no|off)$/i` (`:61, :88`), `=== "true" || === "1"` (`:587`; `agent7-narrative-schema.ts:147`), and the list idiom in `shared.ts:697-705`. So `AGENT7_STRUCTURED_OUTPUT=on` or `AGENT9_FOLD_SUSPECT_CLEARANCES=yes` silently reads OFF, a milder cousin of the ADR-0004 failure. `AGENT9_FOLD_SUSPECT_CLEARANCES` is read inline in two packages (`agent7-run.ts:587`, `agent3-cml.ts:1313`). `parseBooleanEnv` already exists in `agent9/flags.ts:15`. `retriesEnabled` (`:1706`) is assigned and never read. `contractRecoveryEnabled` (`AGENT_PRE9_ENABLE_CONTRACT_RECOVERY`) defaults **ON** (`shared.ts:701`, unchanged since 2026-06-15), yet FLAG-AUDIT Addendum 5 files it under "Default OFF". Its `false` arm is a dormant deterministic-only / fail-fast mode that forks P3, P4, P5 and P6, about 70 lines.
- **Proposal:** add `agent7/flags.ts`, mirroring `agent9/flags.ts`, with `parseBooleanEnv` hoisted to a shared worker module. Delete `retriesEnabled` (R0). Correct the FLAG-AUDIT entry. The owner decides whether the recovery-off mode is still wanted (R2).
- **Benefit:** one enumerable flag surface; −10 lines, or −70 if the dormant arm is retired.
- **Verification:** the getter swap is R1, identical for every documented value (unset/true/1/0/false); unit test per flag.
- **Relates to:** §6.

### A7-09 — Restructure the prompt builder; drop the duplicated blocks
- **P2 · lens B/I · R0 (structure) / R2 (text) · M**
- **Evidence (MEASURED):**
  - `buildUserRequest` (`agent7-narrative.ts:519`, 333 LOC, 6 positional params, all derivable from `NarrativeFormattingInputs`) is about 70% static text; the file holds 21,217 characters of long literals.
  - `buildProseRequirements(caseData)` is rendered in the developer message (`:395`) **and** the user message (`:618/:662`): present twice in 125/125 archived Agent-7 prompts, median 1,236 characters (max 1,809).
  - The clue-pacing rule appears in "Pacing Principles" (`:769`, with a hard-coded "60%" beside a config-derived count) and again as guardrail #1 from `buildCluePacingGuardrails` in 125/125 prompts.
  - `buildDeveloperContext`'s `lockedFacts` parameter (`:233`) is never read.
  - The header says "Max Tokens: 4000" (`:15`); the config value is 16,000.
  - The volatile guardrail block sits at offset ~10.7k of a ~12–14.5k user message (probe on the built dist), so the ~3.5k characters after it lose prefix caching on each retry. That is small: ~0.9k tokens per retry at ~1.7 calls per run.
- **Proposal:** R0: `buildUserRequest(inputs)`, with section builders (`targetSpecBlock`, `actScaffoldBlock(counts, detectiveEntry)`, `FAIR_PLAY_RULES`, `pacingBlock`, `victimExclusionBlock`, `outputFormatBlock`, `completenessContractBlock`) and static text as module constants; remove the dead parameter. R2, behind a flag: emit prose requirements once, drop the duplicate pacing line, move guardrails to the end (cite R8 `AGENT9_PROMPT_PREFIX_ORDER`).
- **Benefit:** function 333 → ~40 LOC; ~1.5k characters (~5%) less per call under the R2 change.
- **Verification:** snapshot test of `buildNarrativePrompt` for all 3 lengths × 3 detective types; byte-equal for the R0 step.
- **Relates to:** A7-03.

### A7-10 — The schema file is not a boundary parser; generalise it before copying it
- **P2 · lens E · R1 / R2 · M**
- **Evidence (INFERRED):** `agent7-narrative-schema.ts` is a **request-side** JSON Schema for Azure strict decoding, gated by `AGENT7_STRUCTURED_OUTPUT` (default OFF; R4 was demoted to "DON'T" in REVIEW_05 §11.1). The response is still `JSON.parse` followed by an unchecked assertion (`agent7-narrative.ts:910-932`). The file removes no `any` downstream. It is the **third** hand-kept body of the outline shape, after the TS `Scene`/`ActStructure`/`NarrativeOutline` (`:116-172`) and `schema/narrative_outline.schema.yaml`, with the prompt's JSON example (`:808-848`) as a fourth. They have already drifted. The YAML lacks `pivotElement`, `factEstablished`, `permittedBehavioursByAct`, `redHerringPlacement` and `mechanism_stage`, so each produces an "unexpected field" schema warning per scene when present. The TS type lacks the World-First fields and every stamp. Agent 7's parse ladder (`:911-932`) is a third variant, after `json-boundary.ts` and agent6's parser; jscpd flags the brace-slice clone at `agent6-fairplay.ts:112-118`. Agent 7 is absent from the A_65b Ph8 inventory, though its `finishReason === "length"` guard (`:898`) is sound on both transports.
- **Proposal, and the answer on "template":** not as it stands. The pattern worth spreading is **one schema → derived TS type → boundary parser → request schema**. To get there this file needs:
  1. a derived type (`FromSchema<>` or a zod source emitting the JSON Schema);
  2. `parseNarrativeOutline(raw): {value, issues}`, which maps Azure's nullable-required fields to optional, applies the coercions from A7-11, counts them, and uses a shared `parseLlmJson` (the finishReason guard plus `guardedJsonrepairParse`);
  3. the YAML generated from it or retired for this artifact;
  4. the flag getter moved to `flags.ts`.

  After that it could serve as the template for the agents carrying 100+ `any`.
- **Benefit:** outline shape drift becomes a compile error.
- **Verification:** parser unit tests on archived/synthetic payloads; R2 wherever the parser accepts more or less than today.
- **Relates to:** A7-04, A7-11; cross-area boundary pattern.

### A7-11 — S7: the counters now emit, but instrument 2 of ≥15 coercion sites
- **P1 · lens F/D · R1 (telemetry only) · S**
- **Evidence (MEASURED):** why the counters did not emit is answered. `agent6-run.ts` did `ctx.warnings = ctx.warnings.filter(...)`, severing the alias with the orchestrator's array, so everything Agent 7, 7.5 and 9 pushed afterwards went nowhere (REVIEW_04 §4.3; REVIEW_05 §11.0; fixed 2026-08-04 via `clearWarningsInPlace`, `shared.ts:607`, pinned by `warning-channel-aliasing.test.ts`). A repo-wide grep finds no remaining `ctx.warnings =` assignment. REVIEW_06/07 record three `firings=0` runs. **The rubric's "S7 blocked" premise is stale.**

  The counters (`:1555-1623`) count only `coerceNarrativeSceneBeats` and `hoistMisplacedSceneFields`. The "~55 sites" figure is pipeline-wide (REVIEW_01:209). Uncounted coercion or normalisation sites on the Agent 7 path:
  - jsonrepair and brace-slice (`agent7-narrative.ts:914-927`);
  - totals synthesis and override (`:939-964`);
  - `mechanism_stage` deletion (`:969-986`, console only);
  - act-purpose synthesis (`:1848`);
  - rebalance defaults and bridge scenes (`:869-981`);
  - invalid clue-ID drop (`:1012-1022`, **silent**);
  - clue fills (`:1060-1186`);
  - the Pillar-4 patches (`:2393-2441`);
  - coverage force-assign (`:2479`);
  - the vocabulary patch (`:2526`).
- **Proposal:** give every site a counter inside `normalizeOutlineCandidate` (A7-02), and put the two silent ones on `ctx.warnings`. **Do not delete the two counted helpers on four zeros.** Zero events in n=4 bounds the per-run rate only at ≤53% (95%), both were written after observed aborts (run_01150a9f, a9c1e346), they are idempotent and O(scenes), and they are the floor that ADR-0007 says stays. S7's deliverable should be consolidation plus per-site evidence.
- **Benefit:** S7 becomes actionable per site rather than for two helpers.
- **Verification:** unit tests per counter; `[R4]` line format unchanged except for the added fields.
- **Relates to:** A7-02, A7-10; REVIEW_05 §11.

### A7-12 — Post-commit stamps and small vestigial items
- **P3 · lens A/D · R0 · S**
- **Evidence (MEASURED):**
  - The six stamp passes (`:126-350, :550-664`) repeat `firstRevealIdx` construction (`:137, :238`), the clue text blob (`:226, :299`) and DT-scene resolution (`:557, :638`). "Who are the suspects" is derived four different ways in the area (`agent7-run.ts:1376`, repeated at `:2553`; `agent7-narrative.ts:264`; `agent75-run.ts:77`).
  - `applyWorldFirstSceneEnrichment` is exported but used only in its own file (export-usage).
  - The `Agent7GridCache` fields `caseData`, `clues` and `redHerrings` are never read (only `.get` is).
  - `rebalance…().changed` means "reached target", and only a test reads it.
  - The JSDoc for `coerceNarrativeSceneBeats` (`:1528-1541`) is detached from its function by the R4 block.
  - `evaluateOutlineCoverage` carries a 22-line tombstone for a removed check (`:1393-1415`).
  - Four agent-7 helpers reach their test only through the orchestrator's `__testables` (`mystery-orchestrator.ts:2052`).
- **Proposal:** add `agent7/stamps.ts` with those helpers; un-export the enrichment function; rename `changed` to `reachedTarget`; trim the tombstone to one line with a link; test the helpers directly.
- **Benefit:** −40 lines.
- **Verification:** R0.
- **Relates to:** A7-01.

### A7-13 — Arc position computed three ways
- **P3 · lens C · R2 · S**
- **Evidence (MEASURED):** `toArcPosition` (`agent7-run.ts:1211`) claims to be "aligned with buildWorldBriefBlock". For a 10-chapter book it disagrees with `prompt-builder.ts:204` in chapters 2, 5, 6, 8 and 9, and with `generate.ts:2331` in chapter 3, computed by hand from the code. In the 07-20 and 07-22 prompt logs, **97 of 358** ProseGenerator prompts that carry both the world brief's "Emotional register at this point" and Agent 7's scene `emotionalRegister` give different registers for the same chapter; that is a lower bound. Humour is mapped two ways as well: `toSceneType` (`:1228`) versus `ARC_POS_TO_SCENE_TYPE` (`constants/arc-position.ts:5`). Neither mapper ever selects the `body_discovery` humour row, which the world builder always marks forbidden.
- **Proposal:** Agent 7 stamps `scene.arcPosition` once, using the shared constants, and Agent 9 dereferences it (ADR-0005).
- **Benefit:** removes a conflicting instruction from about 27% of prose prompts.
- **Verification:** R2: flag and probe.
- **Relates to:** the Agent 9 prompt area.

### A7-14 — Agent 7.5: leave it; three small type leaks
- **P3 · lens E · R0 · S**
- **Evidence:** `as any` on the chat options (`agent75-run.ts:132`) looks unnecessary, since every field fits `ChatOptions` (unverified by compile). `(ctx.narrative as any)` appears twice (`:229, :241`) because `GeometryOutline` and `NarrativeOutline` are separate types for one artifact. Otherwise the file does what the rest of the area should copy: per-call cost delta (`:117, :149`), never-throw (ADR-0003), a diagnostic emitted even at zero.
- **Proposal:** drop the cast; make `GeometryOutline` a structural subset of the typed `Scene` (A7-04).
- **Verification:** typecheck.

## 4. Target structure

```
apps/worker/src/jobs/agents/
  agent7-run.ts                ~90   runAgent7 coordinator + re-exports
  agent7/flags.ts              ~80   7 local getters + AGENT7_STRUCTURED_OUTPUT re-export (A7-08)
  agent7/scene-refs.ts         ~110  SceneRef, flatten, counts, tolerance, snapshots, count guardrails (A7-05)
  agent7/generate.ts           ~120  Agent7Run, generate (per-call cost), adoptOutline, scoreOutline (A7-02/07)
  agent7/normalize.ts          ~170  act purposes, beats, hoist, counters, telemetry (A7-02/11)
  agent7/scene-count.ts        ~200  bridge scenes, rebalance, enforceSceneCount phase
  agent7/clue-pacing.ts        ~320  ClueAssigner (4 phases of pre-assignment), gap cap, forceAssignUncoveredClues, enforceCluePacing
  agent7/outline-coverage.ts   ~230  regexes, sceneClosureText, evaluate, X32 count, vocabulary patch, buildOutlineRepairGuardrails (from shared.ts)
  agent7/completeness.ts       ~130  pre-commit check + remediation, Pillar-4 patch + gate
  agent7/world-first.ts        ~100  arc/scene-type mapping, enrichment (un-exported)
  agent7/scheduler.ts          ~180  grid cache, shadow, authority, clue-job authority
  agent7/stamps.ts             ~380  6 post-commit passes + shared helpers
  agent75-run.ts               ~345  unchanged
packages/prompts-llm/src/
  agent7-narrative.ts          ~650  formatNarrative + section builders (A7-09)
  shared/case-brief.ts         ~180  CaseBrief for Agents 6/7/8 (A7-03)
  agent7-narrative-schema.ts   ~150  → schema + derived type + parseNarrativeOutline (A7-10, later)
```
Total ≈ 2,400 lines in the worker (from 2,682 + 348), no function over ~120 LOC, max cc ≈ 25.

## 5. Suggested sequence

1. **Safety net** (§7): the stub-client harness for `runAgent7`, and prompt snapshots on CML-2.0 fixtures. *(1 day)*
2. **R0 hygiene:** delete `retriesEnabled` and the dead `lockedFacts` param, un-export `applyWorldFirstSceneEnrichment`, fix the JSDoc and the header comment, drop the dead grid-cache fields. *(1 h)*
3. **R0 moves:** extract the leaf modules (`flags`, `scene-refs`, `world-first`, `scheduler`, `stamps`, `outline-coverage`) unchanged. *(½ day)*
4. **R1:** the `generate` helper plus per-phase functions; `runAgent7` becomes the coordinator (A7-01); byte-equality via the harness. *(1 day)*
5. **R1 merges:** A7-05, A7-06 (identical bodies), A7-07, the flag getters (A7-08). *(½ day)*
6. **R1 telemetry:** per-site coercion counters (A7-11). *(2 h)*
7. **R1:** `CaseBrief` extraction with byte-preserving adapters (A7-03 step 1); `buildUserRequest` section builders (A7-09 R0). *(1 day)*
8. **Types** (A7-04), then the schema-derived boundary (A7-10). *(1–2 days)*
9. **R2 for the owner, each behind a flag:** uniform candidate normalise/validate (A7-02 step 2); correct case brief for Agent 7 (A7-03 step 2); prompt de-duplication and ordering (A7-09); arc position stamped once (A7-13); placement default; the recovery-off arm.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `AGENT7_SCHEDULER_SHADOW` | ON | `agent7-run.ts:61` | unregistered, "live every run" (Add. 5) | log only; fine |
| `AGENT7_SCHEDULER_AUTHORITATIVE` | OFF | `:70` | unregistered (N6 lever, 1 pair run) | gates budgets + calls clue-job authority |
| `AGENT7_CLUE_JOB_AUTHORITY` | OFF | `:79` | unregistered | nested inside the above |
| `AGENT7_MECHANISM_GATE` | ON | `:88` | unregistered, live every run | isolated pass |
| `AGENT7_DISCOVERY_TELL` | OFF (set in `.env.local` per audit) | `:93` | unregistered | isolated pass |
| `AGENT7_PLANT_BEFORE_REVEAL` | OFF (set in `.env.local`) | `:113` | unregistered | gates two passes (`:127`, `:195`) |
| `AGENT9_FOLD_SUSPECT_CLEARANCES` | OFF | `:587`; also `agent3-cml.ts:1313` | DEFER (rewired X93) | 2 inline readers, strict `"true"/"1"` parse |
| `AGENT7_STRUCTURED_OUTPUT` | OFF | `agent7-narrative-schema.ts:147` | DEFER (R4 demoted) | strict parse; request-side only |
| `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` | **ON** | `shared.ts:697` | misfiled "Default OFF" in Add. 5 | forks P3–P6; dormant OFF arm |
| `AGENT_PRE9_ENABLE_LLM_RETRIES` | OFF | `shared.ts:662` | unregistered | read at `:1706`, result unused |
| `HONEST_SCORERS` | off | `shared.ts:679` via `applyHonestScorer` | registered | skipped by `rescoreNarrative` |
| `AGENT75_GEOMETRY` | shadow | `agent75-run.ts:50` | PROBE | clean mode parser |
| `AGENT75_GEOMETRY_RESOLVE` | OFF | `agent75-run.ts:65` | DEFER | one optional LLM call |

The ADR-0004 module-const bug (X9) is fixed: the check script is clean (MEASURED).

## 7. Safety net

- **Existing:**
  - Worker tests pin helpers only: `agent7-run.test.ts` (gap cap, beat coercion, hoist), `agent7-coercion-telemetry`, `agent7-flags-runtime`, `-discovery-tell-rc35`, `-dt-evidence-a55`, `-plant-before-reveal-a64`, `decisive-trace-plant-x52`, `suspect-closure-ceiling-x32`, `jobs/agents/__tests__/suspect-clearance-fold`, and 3 cases in `mystery-orchestrator-fixes.test.ts` (pre-assignment, count floor, rebalance).
  - `agent75-geometry.test.ts` (13 cases) covers `runAgent75` end to end with a fake ctx; it is the model to follow.
  - Prompts: `agent7.test.ts` (25 substring checks, **on a legacy pre-CASE fixture**), `agent7-structured-output.test.ts`, plus substring tests in `act3-resolution-contract`, `obligation-aftermath-item11` and `m6-rubric-in-prompt`.
- **Gaps:** no test calls `runAgent7` or `formatNarrative`. No snapshot of the prompt. No CML-2.0 fixture for the prompt builders. No replay harness for Agent 7 (`agent9-replay.ts` is prose-only), and no archived outlines in the repo (`data/` is gitignored).
- **Write first:**
  1. A stub `ctx.client` whose `chat()` returns scripted outline JSON and records prompts, driving `runAgent7` through six scenarios: clean; schema failure; scene-count miss; coverage miss; pacing miss to a second retry; pre-commit remediation. Snapshot `ctx.narrative`, `ctx.warnings`, `ctx.agentCosts` and a hash of each prompt.
  2. Snapshots of `buildNarrativePrompt` on two CML-2.0 fixtures × 3 lengths.
  3. Property tests (random outlines) that `applyDeterministicCluePreAssignment` and `rebalance…` are unchanged across the split.

## 8. What NOT to refactor

- **The deterministic floors** (rebalance, clue fills, vocabulary patch, coercion helpers). They are ADR-0003 and ADR-0007 policy. Their catch-and-continue wrappers in the stamp passes are deliberate: a stamp must never cost an outline.
- **The ordering of P13–P14.** Coercion must precede the clearance gate (it keys on `beat`, `:2666-2668`). The stamps run last so they see final clue placement (`:2676-2681`). Keep the order in the coordinator, commented.
- **Runtime getters.** Never collapse them into module constants for "efficiency" (ADR-0004, X9).
- **Agent 7.5's never-throw envelope** and its early return on a restored contract (R5).
- **`finishReason === "length"`.** It is the correct truncation guard; the textual heuristic may be added, but do not remove this one.
- **CPU efficiency (lens H).** Nothing material: ≤ 40 scenes, a few regex scans, all under a millisecond against one ~31k-character LLM call. A_53 P10 already removed the only repeated work (grid built twice, coverage scanned four times).

## 9. Incidental defects

| # | Defect | Evidence | Confidence |
|---|---|---|---|
| D1 | **Agent 7's case summary is wrong on every CML-2.0 run.** It prints "Victim: Unknown" and "Motive: Unknown motive"; the victim-exclusion block names "**the victim**" with no name; the culprit is listed as a **Witness** (and a victim with `culprit_eligibility: ineligible` as a Witness too). | MEASURED: 125/125 archived Agent-7 prompts (72 runs, `documentation/campaign_data/llm-prompts-full.2026072{0,2}.jsonl.gz`). Reproduced on the built dist with a CASE cast that includes a `role: victim`. Cause: `agent7-narrative.ts:249-257, :261-273, :532-540` read legacy top-level fields. Agent 9 strips the victim from scenes downstream (`prompt-builder.ts:2262`), a downstream patch for this upstream gap. Agent 8 shows "Victim: Unknown" in 43 prompts. | High |
| D2 | **The schema-repair retry never synthesises missing act `purpose`** (required by the YAML schema), so a retry that omits it hard-aborts at `:1929-1932`, although the first attempt is protected at `:1848`. | Code read `:1895-1933` | Medium |
| D3 | **Agent-7 cost is double-counted.** `formatNarrative` returns the cumulative per-agent total (`agent7-narrative.ts:907`, `cost-tracker.ts:154`); `runAgent7` adds it on every retry (`:1908…`), and `executeAgentWithRetry` sums it too (`shared.ts:735`). k calls report k(k+1)/2 × the true cost in `metadata.totalCost`. This is the A_53 P3 class that was fixed in `agent6-run.ts:1469`. | Code read | High (mechanism); cents per run |
| D4 | **The pacing path never rescores**, so the reported agent-7 phase score describes a discarded outline after a pacing retry (4 sites); `rescoreNarrative` also skips the honest scorer. | `:2131-2311` has no `rescoreNarrative` call | Medium |
| D5 | **Five of seven outline-adoption routes skip schema validation**, so an outline from a scene-count, coverage, pacing or remediation retry reaches Agent 9 unvalidated. | Validation called only at `:1879, :1928` | Medium (impact unknown) |
| D6 | **A config inside the clamp bounds can hang the worker.** `act1_ratio` and `act2_ratio` are each clamped to ≤ 0.8 (`generation-params.ts:1147-1148`), but their sum is not checked, so act 3 can be negative. The rebalance loop at `:951-963` then never terminates (`splice` on an empty array), and the prompt asks for a negative scene count. | Code read; the defaults (0.28/0.47) are safe | High (mechanism), low likelihood |
| D7 | **Hallucinated clue IDs survive to Agent 9.** They pass the pacing gate (raw non-empty count) and are stripped only on the pre-assignment path, which runs in only some cases. | `:2135` vs `:1012-1022` | Low–medium |
| D8 | **Emotional-register conflict.** A7-13: 97/358 prose prompts carry two different registers for the same chapter. | MEASURED | Medium (on prose impact) |
| D9 | **Gate-mode geometry repair may not persist or resume.** In `AGENT75_GEOMETRY=gate`, the outline artifact is persisted (`mystery-orchestrator.ts:1563`) before Agent 7.5 stamps it in place, and on resume 7.5 returns early, so the stamps are not re-applied. Default mode (shadow) is unaffected. | Code read; store serialisation timing is UNVERIFIABLE | Low |
| D10 | **Unexpected-field warning noise.** `narrative_outline.schema.yaml` lacks the five Pillar-4 / structured-output fields, so each generates one warning per scene when present. | Schema vs `agent7-narrative-schema.ts:74-91` | High (noise only) |

## 10. Cross-area observations

- **One outline or LLM "candidate" accepted through N hand-copied paths.** Normalisation, validation and scoring are applied inconsistently per call site. Expect this in every agent with a retry ladder (Agents 5, 6, 9).
- **The scoring-or-direct branch** `if (ctx.enableScoring && scoreAggregator && retryManager && scoringLogger)` is repeated in 9 agent run files; `executeAgentWithRetry` takes 11 positional parameters. A shared `runScoredAgent` would remove both.
- **Cumulative `byAgent` cost treated as per-call.** Anywhere `result.cost` is summed (including `executeAgentWithRetry`) double-counts. Agent 7.5's `getTotalCost()` delta is the correct pattern.
- **The legacy/CASE dual accessor** and `CaseData = any` are the common root of `any` counts. `caseOf` exists in `@cml/story-geometry` but lives in the wrong package; it should move to `@cml/cml`, typed.
- **Case-summary prompt blocks copied between agents** (6, 7, 8), with fixes landing in only one copy.
- **Several JSON parse ladders.** Only 5 agents use `json-boundary.ts`, and Agent 7 was missed by the Ph8 inventory.
- **Multi-agent levers read inline in several packages** (`AGENT9_FOLD_SUSPECT_CLEARANCES`), and at least four boolean parse idioms. `parseBooleanEnv` should be shared repo-wide.
- **Derived positional facts** (arc position, humour slot, "suspects") recomputed per agent with divergent rules, which violates ADR-0005.
- **Test fixtures in a shape the pipeline no longer produces** (the legacy CML in `agent7.test.ts`), so tests pin dead paths while the live path goes unpinned.

## 11. Open questions for the owner

1. Is the `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY=0` mode (deterministic-only / fail-fast) still wanted? It is default ON, the OFF arm is never exercised, and it costs about 70 lines of forks.
2. Should S7 be re-scoped from "delete coercion sites" to "consolidate plus per-site counters"? A7-11 argues that four zeros cannot justify deleting the floor.
3. If N6 promotes `AGENT7_SCHEDULER_AUTHORITATIVE`, `@cml/beat-scheduler` claims to replace "~700 lines of band-aids" (`beat-scheduler/src/index.ts:6-8`). Should A7-01 wait for that decision, or proceed? This report recommends proceeding: the split makes a later deletion cheaper and verifiable.
4. Which placement default is correct for a clue with missing placement: act 2 or act 3 (A7-06)?
5. Approve a probe for the D1 fix (A7-03 step 2)? It changes Agent 7's prompt on every run.

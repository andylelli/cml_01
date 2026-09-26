# 09 — Agents 3, 3b & 4: CML generation, hard-logic devices, revision

**Scope:** 12 files, 6,356 lines, 4,780 code lines (`apps/worker/src/jobs/agents/agent3-run.ts`, `agent3b-run.ts`; `packages/prompts-llm/src/agent3-cml.ts`, `agent3-discriminating-planting.ts`, `agent3b-hard-logic-devices.ts`, `agent3b-plausibility-judge.ts`, `agent4-revision.ts`, `agent4-patch.ts`, `case-soundness-repair.ts`, `discriminator-verifier.ts`, `mechanism-environment.ts`, `timeline-deception.ts`) · **Read:** every line · **Written:** 2026-09-25
**Finding prefix:** A34 · **Method:** [RUBRIC.md](../RUBRIC.md)

## 1. What this area does

```
runAgent3b (agent3b-run.ts:282)            ← stage "hardLogicDevices"
  extractThemeMechanismFamilies → buildDeviceLibraryBlock
  generateHardLogicDevices (agent3b-hard-logic-devices.ts:517)   LLM #1 (design tier), withValidationRetry
    [scoring path: executeAgentWithRetry | plain path]            (same input literal written 3×)
  validateArtifact("hard_logic_devices")
  plausibility judge loop (AGENT3B_PLAUSIBILITY_JUDGE shadow|enforce)  LLM #2 (+ regen LLM #1)
  mergeHardLogicDirectives → ctx.hardLogicDirectives
  locked-fact registry: wordify → strip article → reconcileDeviceArithmetic (X38) → writeLockedFactsArtifact
runAgent3 (agent3-run.ts:229)              ← stage "cml"
  generateCML (agent3-cml.ts:779)                                  LLM #3, up to 3 attempts
    buildCMLPrompt (583 LOC, ~40k chars) → parse (JSON→jsonrepair→YAML) → normalizeCml (nested, 561 LOC) → validateCml
    on exhaustion: CML_REPAIR_MODE=patch|shadow → patchCmlNode (agent4-patch.ts, LLM #4 ≤16 calls)
                   then reviseCml (agent4-revision.ts:397)            LLM #5, ≤3 attempts, own nested normalizeCml (386 LOC)
  applyCmlRepairAndRevalidate · degrade/X60 policy · victim/culprit collision retry (generateCML again)
  CML phase score · Agent 8: skeleton-judge shadow + auditNovelty + novelty retry (generateCML again) + novelty score
  findUnplantedDiscriminatingClues telemetry · extendLockedFactRegistryWithCaseFacts (X51)
Consumed later by Agent 9 only: repairCaseSoundness, verifyDiscriminator, checkMechanismEnvironmentConsistency
Also called from agent6-run.ts:2241: buildCMLPrompt + reviseCml (fair-play structural revision)
```

Data in: setting, cast, background context, directives, novelty constraints. Data out: `ctx.hardLogicDevices`,
`ctx.hardLogicDirectives`, `ctx.lockedFactRegistry`, `ctx.cml`, `ctx.noveltyAudit`, two phase scores, `locked-facts-{runId}.json`.

## 2. Verdict

The area works, but it is the defect class of this codebase in miniature: nearly every concept here exists twice,
and the copies have drifted. There are **two CML normalisers** (185 identical lines, and different answers on 23
of the 25 fields I tested on the same input). There are **two sets of locked facts**: the canonical registry and
the raw device facts, and Agent 9 prints the raw ones. There are **three places that accept a generated CML**, each
with different follow-up checks, **five or more victim/detective predicates**, and **three truncation checks**
(Agent 4's parser has none). The size comes from two generators that each carry their own normaliser, parser and
retry loop, and from `runAgent3`, which also hosts all of Agent 8. The single most valuable change is **one
shared, tested, top-level CML normaliser (A34-01)**. It removes the largest clone pair in the repo, and it is
where the remaining divergences (A34-02, A34-11) get resolved on purpose instead of by accident.

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| A34-01 | P1 | C,B | Two nested CML normalisers (561 + 386 LOC); 185 identical lines; 23/25 fields diverge | R1 then R2 | L (3 d) | −350 |
| A34-02 | P1 | C,E | ≥8 role-predicate sites with ≥5 semantics; abort-class #10 substring survives | R2 | M | −30 |
| A34-03 | P1 | A,C | Locked facts: canonical registry vs raw device facts; Agent 9 reads the raw ones | R2 | M | −20 |
| A34-04 | P1 | B,C,F | `runAgent3` (516 LOC, cc 83): 3 CML-acceptance sites, 3 different post-conditions | R1 (+R2 slice) | M | −40 |
| A34-05 | P2 | D,I | Patch engine never run in a pipeline; unregistered flag; dead result fields | R2 | S–M | −560 if retired |
| A34-06 | P2 | C,F | LLM-output parsing cloned; Agent 4 copy lacks the A_65b truncation guard; 2 YAML libs | R1 (+R2) | M | −80 |
| A34-07 | P2 | B,C | `generateCML` (1,026 LOC, depth 7) and `reviseCml` (866) hand-roll one retry skeleton | R1 | M | −100 |
| A34-08 | P2 | I,E | `originalPrompt` is read only as `user.substring(0,200)`, mislabelled "Mystery Axis" | R0 (+R2) | S | −35 |
| A34-09 | P2 | C,I | Theme families derived 3×; retry feedback pollutes the theme lock (measured) | R1 (+R2) | S | −50 |
| A34-10 | P2 | A,C | Placement: planting check mirrored in rubric-score; case-soundness clones | R0/R1 | S | −110 |
| A34-11 | P2 | E,F | `degraded` is an optional boolean one of two callers ignores; X60 policy exists in one place | R1 (+R2) | S | ±0 |
| A34-12 | P2 | B | `runAgent3b` (325 LOC, cc 52): plausibility loop and registry build inline | R1 | M | −30 |
| A34-13 | P3 | D | Dead fields, dead writes, over-export, vestigial blocks | R0 | S | −60 |
| A34-14 | P3 | I | Prompt-as-code: 32k literal chars, volatile seed early, contract restated 2–3×, self-contradiction | R0 then R2 | S–M | 0 lines, −2–4k chars/call |

---

### A34-01 — One CML, two normalisers

- **P1 · lens C,B · R1 then R2 · L (3 days)**
- **Evidence (MEASURED):** `agent3-cml.ts:808-1368` (561 LOC, cc 93, nested in `generateCML`) and `agent4-revision.ts:415-800`
  (386 LOC, cc 31, nested in `reviseCml`). An uncapped jscpd run shows 13 clones and **185 identical lines** between the
  two files, e.g. `agent3-cml.ts:1108-1131 ≡ agent4-revision.ts:558-581` (constraint_space), `1220-1245 ≡ 764-789`
  (quality_controls), `1140-1153 ≡ 584-598` (fallback inference-step text). I fed one sparse raw CML through both
  bodies (via `generateCML` and `reviseCml` with a mock client). **23 of 25 probed fields differ:**

  | field | Agent 3 normaliser | Agent 4 normaliser |
  |---|---|---|
  | crime_class.subtype / death_method | `"poisoning"` / `"poisoning"` | `"unspecified"` / absent |
  | mechanism.description / outcome.result | `"Poisoned tea."` / `"Victim poisoned."` | `"Unknown"` |
  | false_assumption statement/why/hides | `"Death was natural."` / `"Symptoms mimic illness."` / `"Poisoning timeline."` | `"Unknown…"` |
  | cast motive_seed default | `"inheritance"` | `"a personal stake in the outcome"` |
  | cast `role`, `moral_complexity`, unknown fields | **dropped** (fixed field list, `:848-866`) | preserved (`...existing`, `:493`) |
  | enums (`"Guilty"`) | exact match → `"unknown"` | case-insensitive → `"guilty"` |
  | culprits `[]` | fabricated + note (`:953-971`) | left `[]` |
  | inference steps (1 given) | padded to 3 (`:1134`) | kept 1 (only rebuilds when 0, `:628`) |
  | required_evidence `["suspicious behavior"]` | kept (repaired later in the worker) | filtered + synthesised (`:632-686`) |
  | fair_play.explanation | `"All clues provided before reveal."` | synthesised "Step N: …" (`:746-762`) |
  | false_solution / red_herrings / closed_circle / clearance gap-fill | normalised (`:1031-1108`, `:1254-1360`) | untouched |
  | evidence_clues | trimmed only | canonicalised + back-filled from mapping (`:714-737`) |

  **INFERRED.** Most of these differences are not deliberate. ANALYSIS_53 line 46 records that
  `normalizer-hardcoded-story-fallbacks` was fixed in **A4 only** (`subtype→"unspecified"`,
  `motive→"a personal stake…"`). The identical defaults in A3, which runs on every run, were never touched. The A3
  prompt bans "Poison concealed in … tea" (`agent3-cml.ts:354`), yet its normaliser defaults to `"Poisoned tea."`.
  ANALYSIS_53 line 399 had already recommended "one post-mutation normalize pass (A3, A4)".
  There is no third body: `packages/cml` validates but never defaults, and `cml-core` works on a different typed
  model with no production importer.
- **Proposal:** a top-level module `packages/prompts-llm/src/cml/normalize.ts`:
  `normalizeCml(raw, ctx: CmlNormalizeContext, profile: "generate" | "revise"): { cml: NormalizedCml; notes: string[] }`.
  It is built from named sections, each separately tested: `normalizeMeta`, `normalizeCast`, `resolveCulprits`,
  `normalizeModels`, `normalizeGenreStructures`, `normalizeConstraintSpace`, `normalizeInferencePath`,
  `synthesizeRequiredEvidence`, `normalizeDiscriminatingTest`, `normalizeFairPlay`, `normalizeQualityControls` and
  `gapFillSuspectClearances`. **Every invented value is pushed to `notes`**; today only the culprit fabrication is
  (ADR-0010). Home: prompts-llm first, because the normaliser needs `deriveDeathMethodFromCrimeClass`
  (prompts-llm `shared/death-method-patterns.ts`) and `getGenerationParams` (story-validation, which already depends
  on `@cml/cml`, so putting it in `@cml/cml` would create a cycle). The long-term home is `@cml/cml`, beside
  `validateCml`. The normaliser is the other half of the schema contract, and its defaults could be declared in
  `schema/cml_2_0.schema.yaml`. That move needs `maxSteps` injected and the death-method vocabulary moved into cml.
  Step 1 (R1): move both bodies verbatim into the module as two profiles that share the identical sections.
  Step 2 (R2, owner): converge each divergence row above. Recommended direction: neutral defaults, preserve
  schema fields, case-insensitive enums, and culprit integrity on both paths.
- **Benefit:** 947 LOC across two cc-93/31 closures becomes about 600 LOC in 12 functions with cc ≤ 15; the
  repo's largest clone pair is gone; `generateCML` shrinks by 561 LOC and `reviseCml` by 386. Agent 6's revision
  path (`agent6-run.ts:2241` → `reviseCml`) also gains culprit integrity.
- **Verification:** characterisation corpus of raw CMLs (fixtures plus a sparse/garbled set like the probe above).
  Snapshot `normalize(raw)` for both profiles before the move and assert byte-equal JSON after it. Coverage gaps to
  close first: `agent3-cml.ts:1097-1107` (red_herrings), `1139-1178` (step synthesis), `1291-1293`, `1330-1332` are
  uncovered (coverage run). For step 2, count notes per run as the evidence.
- **Relates to:** A34-02, A34-06, A34-07, A34-11; ADR-0005 (one derivation).

### A34-02 — Victim/detective predicates: at least five semantics, and the abort-class #10 substring survives

- **P1 · lens C,E · R2 · M**
- **Evidence (MEASURED):** `@cml/cml` `roles.ts` exports `isVictimArchetype` (head-noun), `isDetectiveArchetype` and
  `roleTextsOf`. The in-area sites are:
  - `agent3-cml.ts:890,907`: `roleIncludes(role, ["victim"])`, a substring match.
  - `:902`: substring match on `detective|investigator|inspector`.
  - `:1041`: `.includes("detective")` combined with `isVictimArchetype`.
  - `:1277-1285`: a fourth local set.
  - `case-soundness-repair.ts:86` (`.includes("detective")`), `:157` (`/victim/i.test`) and `:163`.
  - `agent3-run.ts:217-219` (exact-match `ra === "victim"`, a third semantics).

  Commit 7cd38c1e ("every site swept to the one predicate") could not find `["victim"]` or `/victim/i` by grep. In
  the probe, a cast member with `role_archetype "Friend of the victim"` whom the model marked `"Guilty"` was forced to
  `ineligible/innocent` (`:888-894`), and a different culprit was fabricated. `validateCml`'s culprit check
  (`packages/cml/src/validator.ts:397-400`, added 2026-08-04, after the sweep) reintroduced `role.includes("victim")`.
- **Proposal:** every site calls `isVictimArchetype` / `isDetectiveArchetype` over `roleTextsOf(entry)`. Delete
  `roleIncludes`, `detectiveRoles` and `checkVictimCulpritCollision`'s private predicate, and key the collision retry
  off `validateCml`'s culprit-integrity error instead.
- **Benefit:** one role semantics in the area instead of five or more; removes a known run-killing class.
- **Verification:** R2, because predicates change on relational roles. Admissible evidence is a replay of every
  archived cast through old and new predicates with the disagreement count recorded. If it is 0, the change ships
  as R1.
- **Relates to:** A34-01, A34-10; X50, abort class #10.

### A34-03 — Two sets of locked facts, and the prose reads the uncanonicalised one

- **P1 · lens A,C · R2 · M**
- **Evidence (INFERRED from code, high confidence):** `agent3b-run.ts:545-581` builds `ctx.lockedFactRegistry` from
  `devices[0]` only, then applies `wordifyLockedFactValue`, `stripLeadingArticleFromLockedValue` (A_72 C1) and
  `reconcileDeviceArithmetic` (X38 repair, `:174`). `agent3-run.ts:765-800` appends X51 case facts. Agents 5, 7 and
  7.5 and the orchestrator gate read the registry (`agent5-run.ts:3473`, `agent7-run.ts:1717`,
  `agent75-run.ts:233`, `mystery-orchestrator.ts:1578`). **Agent 9 does not:** `agent9-run.ts:3953-3955` builds
  `proseLockedFacts` from `hardLogicDevices.devices[*].lockedFacts`, the raw values of *all* devices. These flow into
  `annotatedLockedFacts`, the story contract (`:4493`), the prose input (`:4540` → `prompt-builder.ts:1821-1874`
  critical `locked_facts` block) and the injectors. So the X38-repaired value, the article strip, the wordify step
  and the X51 weapon/alibi pins do not reach Agent 9's verbatim contract, while secondary devices' facts do. The
  orchestrator gate warns "Agent 9 will enforce via prose generation" (`:1580`) about registry values Agent 9 never
  receives. Helper placement is inverted too: `agent3-run.ts:21` imports `writeLockedFactsArtifact` and
  `stripLeadingArticleFromLockedValue` from `agent3b-run.ts`. `numberToWordsSmall` (`agent3b-run.ts:52`) duplicates
  `spellMinuteCount` (`packages/cml/src/timeline-deception.ts:366`, jscpd 7 lines).
- **Proposal:**
  - Put the pure registry logic in `@cml/cml/locked-facts.ts`, next to `buildCaseScopedLockedFacts`,
    `checkCaseTimeCoherence` and `rewriteDurationMinutes`. It covers `buildLockedFactRegistry(device)`,
    `canonicalizeLockedFactValue` (wordify ∘ strip, one number speller), `extendWithCaseFacts` and
    `reconcileDeviceArithmetic` (pure, returning repairs and warnings).
  - Move the worker I/O (artifact write, warning push) to `apps/worker/src/jobs/locked-facts.ts`.
  - Make Agent 9 dereference `ctx.lockedFactRegistry` (ADR-0005). Keep the raw device list only as a fallback when
    the registry is disabled.
- **Benefit:** one locked-fact body; three shipped fixes (X38, C1, X51) reach the prose they were built for;
  no worker-agent → worker-agent import.
- **Verification:** free and immediate. For any post-08-18 run, diff `locked-facts-{runId}.json` against the
  `locked_facts` block in `llm-prompts-full.jsonl`. The switch itself changes prompt bytes (R2), so it needs one
  matched pair, ideally on a clock device with an `[X38] … repaired at source` warning.
- **Relates to:** agent9-run area (the consumer line), A34-12; ADR-0005.

### A34-04 — `runAgent3`: three CML-acceptance paths, three sets of post-conditions

- **P1 · lens B,C,F · R1 (+R2 slice) · M**
- **Evidence (INFERRED):** the initial generation (`agent3-run.ts:236-316`) repairs, pushes `normalizationNotes`
  (`:255`), runs the time-alignment check, applies the degrade and X60 fatal-code policy (`:285-296`) and does the
  `revisedByAgent4` bookkeeping. The collision retry (`:333-353`) and the novelty retry (`:570-595`) do **none of the
  last four**. A fabricated culprit on a retry CML is therefore invisible in the report, which is the exact failure
  `:251-254` documents. A degraded retry throws where a degraded first attempt proceeds, and the CML phase score
  (`:359-419`) is never recomputed for the replacement CML. On top of that, `checkLockedFactTimeAlignment(ctx)` runs
  at `:247` and reads `ctx.cml`, which is first assigned at `:318`. The orchestrator creates ctx without `cml`, and
  the stage is skipped when a CML is restored, so the detector always sees `{}` and returns `[]`. The empty case is
  pinned by `locked-fact-time-alignment.test.ts:67`. Roughly 300 of the 516 LOC are Agent 8 (`:421-727`). Coverage
  of `agent3-run.ts` is 5.9% (33/556 lines).
- **Proposal:**
  - `acceptGeneratedCml(ctx, result, phase): CMLGenerationResult` does repair and revalidation, notes to warnings,
    `ctx.cml` assignment, then the time-alignment check (fixing the order), then the collision check and degrade
    policy. It is called at all three sites.
  - Extract `scoreCmlPhase` and `scoreNoveltyPhase` to `scoring-adapters/`, and `runNoveltyPhase(ctx, regenerate)`
    (skeleton-judge shadow, audit, retry, blocking policy) to `agent8-run.ts`.
  - `runAgent3` becomes a coordinator of about 70 lines. Shared closure state is only `cmlResult` plus flags
    resolved once.
- **Benefit:** cc 83 → about 10 in the coordinator; three bodies → one; the REVIEW_04 B1 detector starts working.
- **Verification:** R1 for the extraction plus the warning-only fixes, since no prompt byte changes. Harmonising
  degrade on retries is R2. Note for the owner: the `AGENT3_DEVICE_TIME_BINDING` probe criterion "findings drop to
  zero" is vacuous until the ordering is fixed. Characterisation: drive `runAgent3` with a stubbed `generateCML` and
  `auditNovelty`, and snapshot ctx warnings, errors and scores for the four paths.
- **Relates to:** A34-11, A34-13.

### A34-05 — Two revision strategies: the patch engine has never run in a pipeline

- **P2 · lens D,I · R2 · S–M**
- **Evidence (MEASURED):** `CML_REPAIR_MODE` (`agent3-cml.ts:1615`, default `rewrite`) selects `patchCmlNode`
  (`agent4-patch.ts`, 403 LOC). ANALYSIS_54 says it "was never exercised"; REVIEW_05 §21 found zero `Agent4-Revision`
  records in 13 archived runs; ANALYSIS_56:178 wrongly says it "is not a live env var". It is absent from
  FLAG-AUDIT because `flag-register-check.mjs` only matches `AGENT*|RUBRIC_*|NOVELTY_*|LLM_HTTP_TRANSPORT`.
  `budgetExhausted` and `netProgress` (`agent4-patch.ts:64-71`) have **zero readers**, although `:276` claims "the
  caller uses this". Patch cost (`Agent4-Patch`) is excluded from the returned cost (`agent3-cml.ts:1666`), and
  `shadow` mode spends up to 16 extra calls, then rewrites anyway.
- **Proposal:** the owner decides under ADR-0011. A matched-pair A/B is infeasible, because Agent 4 fires in roughly
  0–1 of 13 runs. The evidence must come from an offline replay of `scripts/agent4-patch-shadow.mjs` over failing
  CMLs from `probe:validators` (2/13 reach Agent 4). Either promote the patch path and later retire the whole-doc
  rewrite, or record the verdict and delete the patch branch (−403 −75 in `generateCML`, plus its test and script).
  Either way: register the flag and delete the two dead fields.
- **Benefit:** removes a dormant ~480-line production path, or the rewrite loop; fixes cost attribution.
- **Relates to:** A34-07; redesign doc `09_agent_4_cml_revision.md` §9 (the absorb plan).

### A34-06 — Parsing LLM output: two clones, three truncation checks, one missing

- **P2 · lens C,F · R1 (+R2) · M**
- **Evidence (MEASURED):** `sanitizeYaml` and `tryParseJson` are cloned between `agent3-cml.ts:1406-1484` and
  `agent4-revision.ts:994-1062` (jscpd 34+12+9 lines), and both are redefined inside the retry loop. The A_65b Ph8
  inventory (`shared/json-boundary.ts:1-12`) missed Agent 4: `agent4-revision.ts:1035,1053` runs `jsonrepair` bare
  on a full CML re-emission capped at 8,000 tokens. Agent 3 guards the same output (`:1450`); Agent 3b uses a
  third check (`agent3b-hard-logic-devices.ts:558`); the patch proposer and the plausibility judge parse on their
  own (`agent4-patch.ts:397`, `agent3b-plausibility-judge.ts:155`). `guardedJsonrepairParse` has zero users.
  prompts-llm imports `js-yaml` (undeclared in its package.json) alongside `yaml`.
- **Proposal:** `shared/llm-json.ts` exposes
  `parseLlmStructuredOutput(raw, { yamlFallback }) → { data, repaired, truncated, errors }`, built on
  `guardedJsonrepairParse`. Use one YAML library (js-yaml, already used by `@cml/cml`) and declare it.
- **Benefit:** −80 lines; one truncation rule everywhere. **Verification:** R1 for Agent 3 (same behaviour, parse
  corpus snapshot). Guarding Agent 4 is R2: a truncated revision becomes a retry instead of an ingested phantom.

### A34-07 — `generateCML` and `reviseCml` share one retry skeleton, written twice

- **P2 · lens B,C · R1 · M**
- **Evidence:** both functions run attempt loop → chat → parse → normalise → validate → log success/fail →
  retry/escalate/degrade (`agent3-cml.ts:1373-1800`, depth 7; `agent4-revision.ts:926-1258`). Agent 3b uses the
  shared `withValidationRetry`. `normalizationNotes` lives outside the loop (`:806`), so notes from discarded
  attempts leak into the result. MEASURED: attempt 1 fabricated a culprit, attempt 2 supplied `["Miss Vance"]`, and
  the returned notes still said "did not decide its own answer".
- **Proposal:** after A34-01 and A34-06, `generateCML` = `buildCMLPrompt` + `runCmlAttemptLoop` +
  `escalateToRevision(strategy)`, with notes held per attempt. `reviseCml` = prompt + the same loop +
  `degrade`. Target: `generateCML` ~150 LOC, `reviseCml` ~200.
- **Verification:** the mock-client pattern in `agent3.test.ts:176-201`; snapshot result objects for parse-fail,
  valid, revise and degrade.

### A34-08 — `originalPrompt` exists to supply 200 mislabelled characters

- **P2 · lens I,E · R0 (+R2) · S**
- **Evidence (MEASURED):** the only read is `agent4-revision.ts:318`,
  `**Mystery Axis**: ${originalPrompt.user.substring(0, 200)}`. On a sample input those 200 chars are "Create a
  complete mystery case in CML 2.0 format… Decade: 1930s - Location: … - Ins". "Primary Axis" is at offset 1,343.
  `system` and `developer` are never read. `agent6-run.ts:2211-2239` builds the full ~40k-char `buildCMLPrompt` just
  for this.
- **Proposal:** R0: `RevisionInputs.contextHead: string`, supplied by a small `buildCmlPromptHead(inputs)` that is
  byte-identical to the current snippet. R2 (owner): replace it with a real axis/era line.

### A34-09 — Agent 3b theme families: derived three times, and polluted by retry feedback

- **P2 · lens C,I · R1 (+R2 on flag-on arms) · S**
- **Evidence (MEASURED):** families are computed in `agent3b-run.ts:297`, again in
  `buildHardLogicDevicePrompt:345` and again in `generateHardLogicDevices:579`. The last two read `inputs.theme`,
  which `appendRetryFeedback` has extended with judge or scorer feedback (`agent3b-run.ts:343,463`; `shared.ts:647`).
  With a realistic plausibility feedback text, an open theme returns `["clock","poison","thermal"]`, including the
  family the judge rejected, and the prompt then demands the primary device realise it. The feedback appears in both
  Tone and Theme, plus the LOCKED THEME quote (2–3× per prompt). `matchedThemePrimary` is produced but never read.
  `ctx.lockedThemeFamilies` is written via a cast (`:301`) and never read. The input literal for
  `generateHardLogicDevices` appears 3× (jscpd, 48 lines).
- **Proposal:** add `HardLogicDeviceInputs.themeFamilies` and `retryFeedback`, rendered once at the end of the
  prompt. Add `buildHardLogicDeviceInputs(ctx, { deviceLibraryBlock, themeFamilies, retryFeedback })`.
- **Verification:** byte-identical prompts when there is no feedback (default path). Flag-on arms change (R2): this
  is a fix on the `AGENT3B_PLAUSIBILITY_JUDGE=enforce` and `AGENT_PRE9_ENABLE_LLM_RETRIES` arms.

### A34-10 — Where the small modules belong

- **P2 · lens A,C · R0/R1 · S**
- **Evidence:**
  - `agent3-discriminating-planting.ts:15-70` is duplicated **deliberately** as
    `findUnplantedDiscriminatingCluesLocal` (`rubric-score/src/structural-verifiers.ts:63-108`, 43 lines,
    documented as a "byte-for-byte faithful" mirror). An injection seam exists solely to avoid a dependency
    (`FindUnplantedFn`, `mystery-orchestrator.ts:718`).
  - `case-soundness-repair.ts:23-34` copies agent2-run's FIX-4 name lists (jscpd 13 lines), and `resolvedGender`
    (`:46`) is a fourth gender parser (with `agent4-revision.ts:433` normalizeGenderEnum, world-state parseGender
    and agent2 FIX-4). Blocks 8 and 8b (`:85-145`) are near-clones (jscpd 7 lines).
  - `discriminator-verifier.ts` and `case-soundness-repair.ts` are CASE invariants consumed only by Agent 9
    (`agent9-run.ts:3968,4050`, `story-bible.ts:270`).
  - `deriveMechanismEnvironmentPrecondition` (test-only) duplicates the match loop in
    `checkMechanismEnvironmentConsistency` (`mechanism-environment.ts:132 vs 155`).
- **Proposal:**
  - Move the planting check to `@cml/cml` (a pure CASE leaf, precedent `timeline-deception.ts`) with a
    prompts-llm re-export. rubric-score imports it (new dep on `@cml/cml`, which creates no cycle). Delete the
    mirror, the seam and the try/catch fallback (~65 lines).
  - Group verifier, soundness repair and planting into `prompts-llm/src/case/` (or `@cml/cml`).
  - Add one `demoteDuplicateRoleHolders(cast, isRole, design)`, one shared name→gender table, and make
    `checkMechanismEnvironmentConsistency` call `derive…`.
  - Keep `timeline-deception.ts` (a documented one-body shim).
- **Verification:** R0 for the moves; the existing tests (`case-soundness-repair.test.ts` 283 lines, 98.8% covered).

### A34-11 — The revision result lets callers ignore degradation

- **P2 · lens E,F · R1 (+R2) · S**
- **Evidence (INFERRED):** `RevisionResult.degraded?: boolean` (`agent4-revision.ts:39`) became reachable by default
  when A_53 P2 turned `AGENT4_GRACEFUL_DEGRADE` on. `agent3-run.ts:259-303` handles it. `agent6-run.ts:2257-2262`
  installs `revisedResult.cml` whenever it has ≥3 steps, without reading `validation`, `degraded` or
  `unresolvedLogicWarnings`. That reopens X60 (a waived defect that Agent 9's preflight rejects later), behind
  `AGENT_PRE9_ENABLE_LLM_RETRIES`. `CMLGenerationResult.cml` is `any` (`types.ts:108`).
- **Proposal:** a discriminated union `{ status: "valid" | "degraded"; unresolved: string[] }`, and move
  `UNREPAIRABLE_DEGRADE_CODES` plus the throw into a shared `assertDegradeShippable(result)` used by both callers.
  Return `NormalizedCml` (from A34-01) instead of `any`.

### A34-12 — `runAgent3b` decomposition

- **P2 · lens B · R1 · M**
- **Evidence:** 325 LOC, cc 52. Phases: family and library retrieval (`:297-329`), generation with a duplicated
  scoring/plain branch (`:331-397`), schema check, a 112-line inline plausibility loop with byAgent cost-delta
  bookkeeping (`:411-524`), theme telemetry, directives, registry build (`:545-603`). Coverage is 15.9%.
- **Proposal:** `generateDevices(ctx, feedback?)` (one input builder, A34-09),
  `runPlausibilityGate({ devices, judge, regenerate, mode, maxRetries })` (a pure loop with injected functions, so
  unit-testable), and the registry build in the A34-03 module. The coordinator ends up at about 60 LOC, cc about 10.

### A34-13 — Dead and vestigial code

- **P3 · lens D · R0 · S**
- `agent3-cml.ts:1337-1365`: `gapFillCount` computed, then an empty `if` whose comment claims "the caller will
  surface this".
- `:1793` logs `maxAttempts` (possibly undefined) instead of `resolvedMaxAttempts`.
- `extendLockedFactRegistryWithCaseFacts` is exported but used only in its own file (`agent3-run.ts:765`); the same
  applies to `checkLockedFactTimeAlignment` outside its test.
- `budgetExhausted` and `netProgress` (A34-05); `matchedThemePrimary` and `ctx.lockedThemeFamilies` (A34-09).
- `index.ts` exports 8 unused agent4-patch types plus `RevisionResult`, `CaseSoundnessRepairResult`,
  `DiscriminatorIssue*` and `PlausibilityJudgeContext` (export-usage.md).
- Only the compiler-provable items are R0; the flag branch in A34-05 is not.

### A34-14 — Prompt-as-code

- **P3 · lens I · R0 then R2 · S–M**
- **Evidence (MEASURED):**
  - `agent3-cml.ts` holds 32,363 long-literal chars. The Agent 3 prompt is ~40.1k chars (system 29.3k, user 10.9k).
  - The per-run `Uniqueness Seed` sits at offset 7,888 of the 29,279-char system message, so ~21k stable chars after
    it cannot be prefix-cached across runs. Within a run the retries share the seed, so the loss is pennies.
  - The required_evidence contract is restated twice in rule 4 (`:407-411` vs `:412-416`, 436 dup chars) and three
    times in the revision prompt when triggered (`agent4-revision.ts:214-225`, `323-336`, `339-356`, ~2.7k chars).
    Agent 4 puts the volatile attempt/errors ahead of 4.3k stable chars.
  - Self-contradiction: the skeleton says `evidence_clues: []  # Leave empty` (`:595-597`), while `:437`, rule 9e
    (`:721`) and rule 17 (`:744`) say it MUST be non-empty.
- **Proposal:** R0/R1: move text verbatim into `agent3-cml/prompt-text.ts` constants behind a byte-equality snapshot
  (`buildCMLPrompt` 583 → ~120 LOC). R2: de-duplicate, move the seed to the end, order revision prompts stable-first,
  and resolve the evidence_clues contradiction (owner). Honest magnitude: CPU is negligible and token savings are
  ≈0.5k tokens per Agent 3 call; the value is prompt coherence.

## 4. Target structure

```
packages/cml/src/
  locked-facts.ts            (~180)  registry build, canonicalise, extendWithCaseFacts, reconcile (pure)   A34-03
  discriminating-planting.ts (~60)   moved from prompts-llm; rubric-score imports it                        A34-10
  roles.ts                           unchanged — now the ONLY role predicate                                 A34-02
packages/prompts-llm/src/
  cml/normalize.ts           (~600)  12 section functions, notes for every invented value                   A34-01
  cml/attempt-loop.ts        (~150)  shared attempt → parse → normalise → validate loop                     A34-07
  shared/llm-json.ts         (~80)   one guarded parser (+YAML fallback)                                     A34-06
  agent3-cml.ts              (~300)  prompt assembly + generateCML coordinator (text in agent3-cml/prompt-text.ts)
  agent4-revision.ts         (~350)  prompt + reviseCml (union result)                                       A34-11
  agent4-patch.ts            (403 or deleted)                                                                A34-05
  agent3b-*.ts               unchanged size; inputs take themeFamilies/retryFeedback                         A34-09
  case/{soundness-repair, discriminator-verifier, mechanism-environment}.ts                                  A34-10
apps/worker/src/jobs/
  agents/agent3-run.ts       (~200)  coordinator + acceptGeneratedCml                                        A34-04
  agents/agent8-run.ts       (~300)  novelty phase moved out of runAgent3                                    A34-04
  agents/agent3b-run.ts      (~220)  coordinator + runPlausibilityGate                                       A34-12
  locked-facts.ts            (~40)   artifact write + warnings only                                          A34-03
  scoring-adapters/{cml,novelty}-phase-score.ts (~140)                                                       A34-04
```

## 5. Suggested sequence

1. **Characterisation first.** Normaliser snapshot corpus (both bodies); `runAgent3` path snapshots with stubbed
   LLM calls; a `buildCMLPrompt`/`buildRevisionPrompt` byte snapshot. (M)
2. **A34-13 and A34-10 moves** (R0), plus registering `CML_REPAIR_MODE` and `HONEST_SCORERS`. (S)
3. **A34-06 parser extraction** for Agent 3 (R1). The Agent 4 guard is a separate R2 PR. (S)
4. **A34-01 step 1:** one module with two profiles, byte-equal (R1). Then **A34-07** loop extraction (R1). (L)
5. **A34-04:** `acceptGeneratedCml` plus the time-alignment ordering fix (R1, warnings only); Agent 8 extraction. (M)
6. **A34-03 R0 half:** locked-facts module (pure moves). Then the R2 switch of Agent 9 to the registry, verified
   free against an existing run's artifacts first, then one pair. (M)
7. **R2 owner queue:** A34-01 step 2 (converge defaults), A34-02 predicates (replay count), A34-05
   promote-or-retire, A34-08/09/14 prompt changes, A34-11 degrade harmonisation.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `CML_REPAIR_MODE` | `rewrite` | `agent3-cml.ts:1615` | **unregistered** (checker regex can't see it) | selects between two whole strategies (A34-05) |
| `AGENT4_GRACEFUL_DEGRADE` | **ON** | `agent4-revision.ts:819` | registered, default ON | one of two callers ignores the degraded result (A34-11) |
| `AGENT4_MAX_COST_USD` | ∞ | `agent4-revision.ts:826` | CONFIG | fine |
| `AGENT3_DEVICE_TIME_BINDING` | off | `agent3-cml.ts:116` | PROBE | probe criterion is vacuous until A34-04 ordering fix |
| `AGENT9_FOLD_SUSPECT_CLEARANCES` | off | `agent3-cml.ts:1313` (+ agent7) | DEFER | an Agent-9-named flag changes Agent 3's CML (clearance scene coordinate) — layering smell; read per normalise call |
| `AGENT3B_PLAUSIBILITY_JUDGE` | off (`shadow` in .env.local) | `agent3b-run.ts:411` | registered | enforce arm has the A34-09 pollution defect |
| `AGENT3B_PLAUSIBILITY_MAX_RETRIES` | 1 (clamped 0–3) | `agent3b-run.ts:423` | CONFIG | fine |
| `AGENT_PRE9_ENABLE_LLM_RETRIES` | off | `shared.ts:662` via agent3-run:230 | registered | gates novelty retry |
| `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` | **ON** | `shared.ts:697` via agent3-run:231 | **misfiled as default-OFF** in FLAG-AUDIT Addendum 5 | gates collision retry |
| `HONEST_SCORERS` | off | `shared.ts:679` via agent3-run:410, agent3b-run:365 | **unregistered** | swaps phase scores |
| `NOVELTY_SKELETON_JUDGE` / `_MODEL`, `NOVELTY_SIMILARITY_THRESHOLD`, `NOVELTY_MODE` | shadow / – / YAML / off | `agent3-run.ts:446,454,430,435` | registered | all Agent 8 — move with A34-04 |

## 7. Safety net

- **Covered:** normaliser culprit fallback (`agent3.test.ts:513-575`); A3→A4 handoff (`:406-512`);
  `buildRevisionPrompt` (`agent4.test.ts`, `agent4-revision.test.ts`); degrade (`agent4-graceful-degrade.test.ts`);
  patch engine (`agent4-patch.test.ts`); theme lock (`agent3b-theme-lock.test.ts`); X38/X51/C1
  (`device-arithmetic-at-source`, `case-locked-facts-x51`, `locked-fact-article-c1`); planting, verifier,
  mechanism-environment, soundness (≥94% lines).
- **Gaps (coverage run):** `agent3-run.ts` 5.9%, `agent3b-run.ts` 15.9%, `generateHardLogicDevices` and
  `judgeMechanismPlausibility` uncovered (50% / 44%). In `agent3-cml.ts` the red-herring normalisation, step
  synthesis, clearance filtering, all parse fallbacks and the patch branch are uncovered (70.5% lines, 56.5%
  branches). The Agent 4 parse fallbacks are uncovered.
- **Write first:** (1) normaliser snapshot corpus for both bodies, including sparse, garbled, reordered-cast and
  relational-role inputs; (2) `runAgent3` path tests with stubbed `generateCML`/`auditNovelty` covering initial,
  collision-retry, novelty-retry and degraded; (3) a prompt byte snapshot for `buildCMLPrompt`,
  `buildRevisionPrompt` and `buildHardLogicDevicePrompt`; (4) a wiring test that `checkLockedFactTimeAlignment`
  sees the generated CML.
- The replay harnesses (`agent9-replay.ts`) start at Agent 9 and do not exercise this area.

## 8. What NOT to refactor

- **The graceful-degrade default and the X60 fatal-code abort** (`agent3-run.ts:285-296`): ADR-0003 policy plus its
  scoped exception; move them, do not remove them.
- **The culprit fabrication** (`agent3-cml.ts:943-971`): an abort would violate ADR-0003. Keep it, and keep it noted.
- **"A detector may guess, a repairer may not"** in `reconcileDeviceArithmetic` (`derivedFrom` licence,
  read-back assertion): move it intact.
- **The `timeline-deception.ts` shim**: a documented single body with import-path stability.
- **The rubric-score mirror** until A34-10 lands: it is deliberate, and today the orchestrator does inject the real
  function.
- **Prompt text bytes**: any edit is R2 (ADR-0004). Verbatim moves only, behind a snapshot.

## 9. Incidental defects

| # | Defect | Evidence | Confidence |
|---|---|---|---|
| 1 | `checkLockedFactTimeAlignment` reads `ctx.cml` before it is assigned, so it always returns `[]` | `agent3-run.ts:247` vs `:318`; ctx created without cml | High |
| 2 | Agent 9 prompts and enforces raw device locked facts (all devices), not the registry, so X38/C1/X51 don't reach its contract | `agent9-run.ts:3953`, `:4540`; A34-03 | High (code) / effect unverified |
| 3 | Positional gender lookup: if the model reorders the cast and omits gender, genders swap | `agent3-cml.ts:838,865`; MEASURED Vance→male, Blake→female | High (low frequency) |
| 4 | Cast truncated or padded to `castNames` length; extra model characters dropped positionally | `agent3-cml.ts:837-839` | High |
| 5 | Last-resort culprit fallback can name the detective or victim | `:963` (`normalizedCast[0]`); MEASURED "Inspector Blake" | High (validator catches it; Agent 4 then degrades) |
| 6 | `normalizationNotes` from discarded attempts leak; retries' notes never reach warnings | `:806`; `agent3-run.ts:333,570`; MEASURED | High |
| 7 | Agent 4 parser has no truncation guard on a full-CML re-emission | `agent4-revision.ts:1035,1053` | High |
| 8 | Plausibility/scoring feedback pollutes the theme lock | MEASURED `["clock","poison","thermal"]` | High (flag-on arms) |
| 9 | Agent 6 installs a degraded or invalid revision (X60 reopened) | `agent6-run.ts:2257-2262` | Medium (behind `AGENT_PRE9_ENABLE_LLM_RETRIES`) |
| 10 | Relational "Friend of the victim" made ineligible/innocent, overriding the model's "Guilty" | `agent3-cml.ts:888-894`; MEASURED | High |
| 11 | A3 prompt contradicts itself on `evidence_clues`; normaliser defaults contradict the anti-trope list | `:595-597` vs `:437,721,744`; `:354` vs `:1000` | High |
| 12 | `applyCmlRepairAndRevalidate` mutates the CML, then returns the pre-repair validation when revalidation fails (stale errors feed the degrade warnings) | `agent3-run.ts:63-73` | High |
| 13 | Agent 4 revision and the patch proposer run on the base model; the YAML's 5→3 cut assumes "a capable design model" | `agent4-revision.ts:960` (no `model`); `generation-params.yaml` agent4 comment | Medium (depends on env) |
| 14 | FLAG-AUDIT lists `AGENT_PRE9_ENABLE_CONTRACT_RECOVERY` as default-OFF; it is ON | `shared.ts:697-705` | High |
| 15 | Patch-path cost (`Agent4-Patch`) omitted from `agent3_cml` cost | `agent3-cml.ts:1666,1706` | High (flag-off path) |
| 16 | A3 normaliser drops the schema's canonical `role`/`moral_complexity` on every run | `:848-866` vs `schema/cml_2_0.schema.yaml:107-121` | High |

## 10. Cross-area observations

- **The jscpd baseline was blind to all 20 files over 1,000 lines** (default `maxLines`; the largest file scanned
  was 993 lines). The uncapped rerun found agent3-cml ⇄ agent4-revision at 185 lines, bigger than any pair in the
  original table. Every hotspot area should re-check against the corrected `duplication.md`.
- **"Sweeps by grep" leave survivors:** the abort-class #10 sweep missed `roleIncludes(x, ["victim"])` and
  `/victim/i`, and `validateCml` reintroduced `.includes("victim")` afterwards. About 30 substring role checks
  remain repo-wide (prompt-builder 6, obligation-block 4, others). Recommend a lint rule over `victim|detective`
  literals outside `roles.ts`.
- **Fixes applied to one of two bodies:** A_53 P1 (A4 only), A_65b truncation guard (A4 missed), X60 degrade guard
  (Agent 6 missed), C1 (the second call site found only afterwards). This pattern will recur in every area with
  parallel generators.
- **Number→words has three bodies** (`agent3b-run.ts:52` hyphenated, `@cml/cml spellMinuteCount`, `agent5-run.ts:1509`
  unhyphenated: "ten fifty pm" vs "ten-fifty"). Gender parsing has at least four.
- **Tri-state mode parsers** (`parsePlausibilityJudgeMode`, AGENT2B/2C/6 gates) are cloned; one
  `parseModeFlag(raw)` would serve all of them.
- **Flag register blind spots:** `flag-register-check.mjs` cannot see `CML_REPAIR_MODE` or `HONEST_SCORERS`; it
  should match by read site, not by name prefix.
- **Undeclared dependencies:** prompts-llm imports `@cml/story-validation` (20+ files) and `js-yaml` without
  declaring either.
- **Naming trap for the scoring area:** `agent4-hard-logic-scorer.ts` scores Agent 3b; its `HardLogicDevice` type is
  re-declared in `scoring-adapters/agent3b-scoring-adapter.ts`.
- **Shared generator boilerplate:** most generators hand-roll attempt → parse → validate → log;
  `withValidationRetry` exists but only the Agent 2-family and 3b use it.

## 11. Open questions for the owner

1. **Normaliser defaults (A34-01 step 2):** which direction wins for each divergent row? My recommendation: neutral
   defaults, preserve schema fields, case-insensitive enums, culprit integrity on both paths.
2. **Agent 9 and the registry (A34-03):** should Agent 9 read `ctx.lockedFactRegistry`? If so, should secondary
   devices' locked facts stop reaching the prose contract?
3. **Patch engine (A34-05):** promote after an offline corpus replay, or record a verdict and delete? A pipeline A/B
   is not feasible at Agent 4's firing rate.
4. **Structural repairs (A34-10):** should `repairCaseSoundness` and the discriminator verifier run at CML
   acceptance (every Agent 3, 4 and 6 output) instead of only at Agent 9? That is cheaper-end detection, but R2.
5. **Agent 4 model tier:** should Agent 4 run on the design tier, as the YAML comment assumes?

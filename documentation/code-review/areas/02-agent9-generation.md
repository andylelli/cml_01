# 02 — Agent 9 prose generation core

**Scope:** `packages/prompts-llm/src/agent9-prose/{generate.ts (4,712), context-management.ts (486), types.ts (353), index.ts (52), model-tiering.ts (41), continuity-tail.ts (63)}` and `agent9-prose.ts` (7). 5,714 lines, 4,399 code lines · **Read:** every line · **Written:** 2026-09-26
**Finding prefix:** A9G · **Method:** [RUBRIC.md](../RUBRIC.md)

Probe scripts: every MEASURED probe below ran against the built dist in the shared build copy. There were no LLM calls; the scripts are in the session scratchpad as `a9g-*.mjs|cjs`.

## 1. What this area does

`generateProse(client, inputs, maxAttempts?)` (generate.ts:2052) is the only production entry point. Its two callers are both in `runAgent9`: agent9-run.ts:4526 (the first pass) and :5558 (a whole-story schema-repair re-run).

```
generateProse
 ├─ run setup 2057–2297 ......... config/flags, cast normalisation, resume hydration, 55 run-scope variables
 ├─ for batch (2302) ............ BatchContext: scenes, arc position, requirement ledger, mechanism terms
 │   └─ for attempt 1..3 (2378)
 │       ├─ request contract (2380) → mitigation guardrails (2412) → buildProsePrompt (2473)
 │       ├─ retry brief + prior draft (2511–2533, buildCanonicalRetryBrief) → temperature (2543)
 │       ├─ client.chat (2551)  ← the only LLM call site counted by the metrics
 │       ├─ per chapter: normalise (season lock, split, structure, pronouns, sanitise, regen-clue*, det. repair) 2603–2773
 │       │     evaluateCandidate 2775–2986 → underflow expansion* 2995–3083 → pronoun/identity 3091–3168
 │       │     → victim-alive 3170 → per-chapter polish* 3185–3308 → provisional score 3310
 │       ├─ batch linter + clearance shortcut 3327–3440 → exhaustion bypasses 3442–3575 → best-attempt 3601
 │       ├─ reject: retry packet / non-convergence 3612–3714; exhausted: fallback 3716–3963
 │       ├─ accept: commit, NSD update, provisional feed-forward, commit record, onBatchComplete 3966–4203
 │       └─ catch: exception fallback 4204–4467
 ├─ whole-story passes: atmosphere repair* 4476, full-story polish* 4520, final pronoun sweep 4574
 └─ telemetry/result 4576–4711                       (* = additional LLM calls inside the loop)
```

The retry-prompt machinery sits at generate.ts:503–1988: 1,486 lines, 32% of the file. context-management.ts builds four prompt blocks (continuity context, story-to-date, scene-grounding checklist, opening-style rotation). types.ts holds `ProseGenerationInputs`, which has 38 fields including 3 callbacks, plus `ProseGenerationResult`. model-tiering.ts resolves the stage model tier from env, and continuity-tail.ts strips atmosphere words from the tail. Both barrels re-export all of this (`index.ts` does `export *` from 21 modules).

## 2. Verdict

The area works, but it is one 2,661-line closure (cyclomatic complexity 350) over 74 outer variables, 37 of which it mutates. Wrapped around it is a retry-prompt subsystem that has outgrown the budget it serves. At the live budget of 3 attempts, the 897-line `buildEnhancedRetryFeedback` never executes (MEASURED). Every retry is assembled by three independent authors from eleven independent string classifiers that disagree with each other on the archive's own verbatim messages. The complexity does not come from the problem. It comes from duplication: the chapter-acceptance rules exist in three bodies, the post-LLM normalisation chain in three, and arc position in six. Narrative state, the final pronoun sweep, the resolution backstop, the regen Story Bible and flag parsing are each decided on both sides of the `runAgent9`/`generateProse` boundary. **The single most valuable change is a mock-client characterisation harness (§7).** After that, extract a phase coordinator over explicit `RunConfig`/`RunState`/`BatchContext`/`RetryState` types (A9G-01), folding the three acceptance bodies into one (A9G-02) along the way. The largest single decision for the owner is A9G-03: restore or delete ~1,050 lines that the live configuration cannot reach.

## 3. Findings

| ID | P | Lens | Finding | Risk | Effort | Net lines |
|---|---|---|---|---|---|---|
| A9G-01 | P1 | B | `generateProse` is a 2,661-LOC closure: decompose it into a ~150-line coordinator over explicit state types | R1 | L (5 d) | −150 |
| A9G-02 | P1 | C | Chapter acceptance has three bodies (main, exhaustion fallback, exception fallback) with divergent check sets | R1 (+R2) | M | −170 |
| A9G-03 | P1 | D/F | `buildEnhancedRetryFeedback` and its satellites are unreachable at the live budget (commit 79524bd6, unflagged) | R2 | S | −1,050 or 0 |
| A9G-04 | P1 | C/F | Eleven classifiers of validator message strings; they measurably disagree | R1 → R2 | L (3 d) | −250 |
| A9G-05 | P1 | A | Boundary: NSD, pronoun sweep, resolution backstop, regen bible, flags and model tier are each decided on both sides | R1/R2 | L (4–6 d) | −150 |
| A9G-06 | P1 | I | Structural levers that would avoid retries (37% of prose prompt volume) | R2 | M + probes | n/a |
| A9G-07 | P2 | I | One retry message has three authors: each error repeated 4×, 16 headers, contradictory draft instructions | R2 | M | −80 |
| A9G-08 | P2 | D | 7 env flags / 13 reads / 3 parse idioms; rollout flags re-derived; 2 rollout flags control nothing | R1 | S | −40 |
| A9G-09 | P2 | C | Run-constant facts derived per call and in divergent ways; arc position has 6 bodies (loop and prompt disagree on 6/10 chapters) | R1/R2 | M | −60 |
| A9G-10 | P2 | C | The post-LLM normalisation chain is written three times (main, expansion, polish), each slightly different | R1 | S | −50 |
| A9G-11 | P2 | C | The provisional score re-implements clue presence with a looser threshold and feeds the next prompt | R2 | S | −15 |
| A9G-12 | P2 | D | Compiler-proven dead code: 43 unused import bindings, 16 dead forward edges, dead locals and exports | R0 | S | −120 |
| A9G-13 | P2 | D | Options with no setter: `preferCompletionOnFailure` abort branches, `enableSurgicalFingerprintRetry` | R2 | S | −45 |
| A9G-14 | P2 | E | Contract types restated inline 5×; untyped error tags, 2 of them write-only; 50 `as any` | R0/R1 | M | −40 |
| A9G-15 | P2 | A | S6 evidence: 67 forward edges, 16 dead, 25 type-only; a 4th back-edge found | R0 | S | 0 |
| A9G-16 | P2 | I | context-management does **no** budgeting; its STORY TO DATE block (all prior text) bypasses budgeting | R2 | S (measure) | 0 |
| A9G-17 | P3 | C | Vocabulary and regex copies: hard-coded atmosphere list (28 of 39 words), DT regex ×4, leakage regex ×2 | R1/R2 | S | −20 |

### A9G-01 — Decompose `generateProse` into phases over explicit state
- **P1 · lens B · R1 · L (5 d)**
- **Evidence (MEASURED, TS compiler API over the AST):** run scope declares 55 variables. 44 are read inside the attempt loop and 24 are mutated there (8 `let` rebinds, 16 collections mutated in place). Batch scope declares 33, reads 30, mutates 13. **The attempt loop therefore depends on 74 outer variables and mutates 37.** `evaluateCandidate` (2775, 212 LOC, cc 39) captures 21 and mutates 4: the underflow counters, which is why it needs the `trackUnderflow` parameter (2915). So "evaluate" has a telemetry side effect. Nesting depth is 9. `onBatchComplete` is awaited *inside* the attempt `try` (4183), so worker exceptions enter the package's retry logic (see §9).
- **Proposal:** introduce the following state types, plus an `AttemptOutcome = accepted | rejected | exhausted | exception` union:

  | Type | Holds |
  |---|---|
  | `RunConfig` | immutable, built once: flags, budget, rollout flags, phrase policy, validators, season lock, normalised cast |
  | `RunFacts` | see A9G-09 |
  | `RunState` | changed only by commit: chapters, summaries, word counts, provisional scores/feedback, liveNarrativeState, polished set, regenBible |
  | `RunTelemetry` | append-only: 10 collections + linter/integrity/underflow counters |
  | `BatchContext` | immutable per batch: scenes, labels, arc, ledger, clearances, mechanism terms, DT boundary |
  | `RetryState` | carried from attempt to attempt: last errors, linter issues, first sentence, raw response, texts, packets, best attempt |

  The phases, each a named function with explicit inputs and outputs:
  1. `resolveRunConfig`
  2. `initRunState` (resume)
  3. `buildBatchContext`
  4. `buildAttemptMessages` (guardrails, retry brief, prior draft, temperature)
  5. `callAndParse`
  6. `normalizeCandidateChapter` (A9G-10)
  7. `evaluateChapter` (pure: returns underflow facts instead of bumping counters)
  8. `expandUnderflow`
  9. `verifyPronounsAndIdentity`
  10. `maybePolish`
  11. `lintBatch`
  12. `applyExhaustionBypasses` (a rule table: entropy, opener, fingerprint/debug, resolution)
  13. `recordRejection`
  14. `commitFallback` (A9G-02)
  15. `commitBatch`
  16. `runWholeStoryPasses`
  17. `assembleResult`
- **Benefit:** the largest function falls from 2,661 LOC / cc 350 to ≤ 200 LOC / cc ≤ 30. Each phase becomes unit-testable. The duplicated `nsdCheckpoint` and `validationDetails` literals (4174–4182 ≡ 4431–4439; 4664–4695) collapse.
- **Verification:** the §7 golden harness must be byte-equal on every captured `messages[]` array and on the result JSON. Then typecheck, `build:all` and `preflight-dist-check`.
- **Relates to:** A9G-02, 08, 09, 10; area 01 (the `runAgent9` split has the same shape).

### A9G-02 — The acceptance rule set has three bodies
- **P1 · lens C · R1 (merge) + R2 (unify check sets) · M**
- **Evidence (MEASURED):** jscpd with the line cap lifted finds 17 clones / 226 lines touching generate.ts. The largest are:
  - 4255–4325 ≡ 3803–3874 (71 lines)
  - 3836–3863 ≡ 2874–2901 (28 lines, the A_71 reveal-context closure *including its comment*)
  - 4237–4250 ≡ 3764–3777 (14 lines)

  Both fallback blocks re-derive stage mode, suspects, culprit and murder method inline. `buildChapterRepairContext` (deterministic-repair.ts:922–981) already computes the same values, and the main path uses them (2675–2699). A clone of deterministic-repair.ts:957–965 is inside generate.ts. The three paths check different things:

  | Check | `evaluateCandidate` (+2787–3179) | exhaustion fallback 3777–3887 | exception fallback 4250–4325 |
  |---|---|---|---|
  | title / paragraph shape | ✓ | ✓ | — |
  | chapterValidator | ✓ | ✓ | **—** |
  | obligations, scene coverage | ✓ | ✓ | ✓ |
  | victim-alive | ✓ | ✓ | **—** |
  | pronoun drift, ch-1 victim name, verbatim echo, mechanism leak | ✓ | — | — |
  | `bestEffortLeakageResiduals` telemetry | n/a | ✓ (3906) | **—** |

  The misindented comment and `murderMethod` lines at 3831–3833 and 4283–4285 are copy-paste scars.
- **Proposal:** one `validateChapterForAcceptance(chapter, ctx, checks: CheckSet)` in `generation/candidate.ts`, with named check sets `ACCEPT`, `EXHAUSTION_FALLBACK` and `EXCEPTION_FALLBACK` that reproduce today exactly (R1). Take stage mode, suspects and culprit from `ChapterRepairContext`. One `commitFallback()` serves both exit paths, including the resolution backstop (3548–3575 ≡ 4334–4354, which differ only by `!usedBestAttempt`). Unifying the check sets is R2: adding chapterValidator to the exception path can turn a ship into an abort (ADR-0003).
- **Benefit:** about −170 lines, one body instead of three, and the divergence becomes a visible table rather than an accident.
- **Verification:** golden harness scenarios for "exhaust→best attempt", "exhaust→template" and "parse error ×3→exception"; the fallback error arrays must be byte-equal.
- **Relates to:** A9G-01, A9G-09.

### A9G-03 — ~1,050 lines are unreachable at the live budget
- **P1 · lens D/F · R2 · S (the code change, in either direction)**
- **Evidence (MEASURED probe of `buildCanonicalRetryBrief`; T = terminal path, E = enhanced feedback):**
  ```
  max=3 attempt=2  T  T  T  T      max=4 attempt=2  E  E  E  E      max=6 attempts 2–4  E …
  max=3 attempt=3  T  T  T  T      max=4 attempt=3  T  T  T  T
  ```
  `useTerminalRetryMode = attempt >= Math.max(1, maxAttempts - 1)` (1920). With `default_max_attempts: 3` (generation-params.yaml:409, the only value in use, since both callers omit the argument), both retries take the terminal branch. That branch never calls `buildEnhancedRetryFeedback` (985–1881). The following are all dead at the live budget:
  - the 404-line micro-prompt builder, including the `temporal_consistency` directive with the correct-season allow-list, which is exactly the REVIEW_12 §3.1 cause;
  - `classifyRetryPhase` and the phase headers (927–982);
  - `extractPronounOffendingSentences` (483);
  - the whole `enhancedFeedbackOptions` bag (2512–2518);
  - the `lastLinterIssues` accumulation (3628–3634) and `lastBatchChapterTexts`.

  The threshold was `Math.max(3, maxAttempts - 1)` until **commit 79524bd6 (2026-08-25)**. That commit's message ("APPLIED (correctness, no behaviour gamble)… at 2, terminal retry mode was unreachable") describes the max = 2 case. At max = 3 it also moved attempt 2 from the enhanced path to the terminal path, which changes every attempt-2 prompt, and it shipped without a flag (ADR-0004). Every enhanced-feedback test runs at `maxAttempts: 6` (agent9-prose.test.ts:277–380), a budget production has not used since it was lowered from 6 to 3.
- **Proposal:** the owner decides one of two routes. (a) Restore `Math.max(3, …)` behind a flag and probe it against today's terminal-only retries. (b) Accept terminal-only as the policy and delete the ~1,050 lines under ADR-0011, using a counter that proves the path at zero on real runs. Until the decision, extract the enhanced path unchanged into `retry/enhanced-feedback.ts` (R0), so generate.ts stops carrying it.
- **Benefit:** either about −1,050 lines, or a lever that has been silently off for a month gets measured.
- **Verification:** the probe above as a unit test pinning reachability per budget. For (b), a counter in the report at zero across ≥ 4 runs.
- **Relates to:** A9G-04, 07, 13; REVIEW_12 §4/§8.4 (written before this change).

### A9G-04 — Eleven string classifiers route one message eleven ways
- **P1 · lens C/F · R1 (registry reproducing today) → R2 (fix misroutes) · L (3 d)**
- **Evidence:**
  - *Inventory* (INFERRED): `detectRetryIssueFamilies` 512 · `classifyRetryPhase` 927 · enhanced-feedback buckets 1023–1123 (12 buckets built from 39 `!x.includes(e)` exclusions) · micro-prompt selectors 1125–1528 · `buildRetryRewriteActions` 636 · `buildRetrySuccessChecklist` 713 (mostly the same regexes as 636) · terminal-block regexes 837–841 · `COSMETIC_BATCH_ERROR_RE` 395 · retry-protocol.ts `classifySingle`/`classifySubcode` 29/52 · `inferBatchGatesFromError` (clue-validation.ts:442) · the exhaustion-bypass predicates and the regex copies at 2543/3665 and 3897/4359.
  - *Disagreement* (MEASURED, using the verbatim archive messages from retry-routing-vocabulary.test.ts):
    ```
    message                          family      phase    protocol class       enhanced bucket
    mechanism explained before DT    clue        quality  fair_play            CHARACTER NAME ERRORS
    clue copied verbatim             clue        quality  unknown              PROSE QUALITY ERRORS
    scene cast coverage missing      setting     quality  unknown              CHARACTER NAME ERRORS
    month/season contradiction       continuity  quality  unknown              PROSE QUALITY ERRORS
    VICTIM ALIVE: "…"                continuity  logic    unknown              VICTIM ALIVE
    ```
  - X80 (08-20) fixed the hyphen only in `detectRetryIssueFamilies`. Its siblings still match `/discriminating test/i` (938, 837, 686, 1070), so a mechanism leak is not a "logic" error and gets no terminal contract. "name the object" and "by name" land those messages in the invented-names bucket.
  - The protocol's `unknown` class is outside `FULL_BUDGET_RETRY_CLASSES`, so `shouldContinueRetry` (retry-protocol.ts:201) can stop a repeated season or verbatim failure after attempt 2. How many attempts a failure gets therefore depends on its wording.
- **Proposal:** add `retry/issue-registry.ts`, an ordered rule table `{ code, match, family, phase, protocolClass, gate, cosmetic, rewriteAction, checklistItem, terminalContract, microDirective(tier), bypassAtExhaustion }`. Every current consumer reads it. Step 1 (R1) reproduces today's routing byte-for-byte, misroutes included. Step 2 (R2, one flag) corrects the misroutes. End state: validators emit `code` and the regexes disappear. retry-protocol.ts keeps policy (`shouldContinueRetry`, mitigation choice) and loses classification.
- **Benefit:** eleven vocabularies become one, about −250 lines. Removes the defect class X80 documented ("a vocabulary that cannot read the strings it exists to read").
- **Verification:** a table test of every classifier over the archive messages (pin first); golden prompts byte-equal after step 1.
- **Relates to:** A9G-03, 06, 07; area 11 (retry loops).

### A9G-05 — The boundary: `runAgent9` and `generateProse` make the same decisions
- **P1 · lens A · R1 (single owners) / R2 (removals) · L (4–6 d, shared with area 01)**
- **Evidence (INFERRED unless marked):**

  | Decision | In `generateProse` | In `runAgent9` |
  |---|---|---|
  | Narrative state (NSD) | `liveNarrativeState`: updateNSD, victim-dead, sensory, phrases 4037–4126 | its own copy in `onBatchComplete` 4591–4660, **then `checkNSDParity` throws on divergence** (4663–4668) |
  | Final pronoun sweep | `applyFinalPronounSweep` 2019, guard `detectPronounDriftEvents` | `applyDeterministicPronounSweep` agent9-run.ts:2541, guard `countChapterPronounMismatches` (the A_66 "third body", commit b0ffb508) |
  | Resolution backstop | 3548–3575, 4334–4354 | `injectResolutionIfAbsent` (≈5913) |
  | Regen Story Bible | `buildStoryBible(...)` 2726 | `{...worldState, beatSheet: []}` ×12 (e.g. 4919; the rationale at 4914 covers the scaffold pass only) → no culprit/mechanism embargo in 12 worker passes |
  | Victim-dead detection | death regex incl. strangled/shot/stabbed (4054) | narrower regex, different victim resolution (≈4628) |
  | Arc position | 2331–2338 | 4603–4610 (identical copy) |
  | Model tier | in-loop regen uses `inputs.model` (2741), i.e. the **generate** tier | resolves `regenDeployment` for its 10 sites (4323; comment at 4314) |
  | Flag parsing | strict `=== "true"` | `parseBooleanEnv` (yes/on/TRUE) |
  | Whole-story passes | atmosphere repair, full-story polish, pronoun sweep (4476–4574) | README §4 rule: ship-layer passes belong here |

  **The two NSD copies do not feed each other** (generate.ts:2205–2219 deep-copies at entry). The worker's `stampDeployedAtoms` and `beatHistory` never reach `liveNarrativeState`. Yet the prompt reads `narrativeState.deployedAssets` (prompt-builder.ts:1631, prompt-blocks.ts:273) and `beatHistory` (prompt-builder.ts:1952). See §9.
- **Proposal:** make `generateProse` a chapter loop with typed hooks: `onBatchCommitted(record)` returns void, so worker failures are logged rather than retried. Put one NSD owner in the package (`commitBatch`), which also applies atom and beat stamps. The worker then reads the checkpoint, and the parity check has nothing left to compare. Move the three whole-story passes to the ship layer beside their siblings (R2: the text they see changes). Keep one sweep (`pronoun-sweep.ts`, with both guard strategies as named options). Pass `regenModel` in the inputs. Build the Bible once in the worker and pass it in (ADR-0005).
- **Benefit:** each concept gets one owner; about −150 lines across both packages; closes the §9 hazards.
- **Verification:** golden harness plus an assertion that chapter N's captured prompt carries the atoms and beats stamped in chapters < N (fails today). The worker suites.
- **Relates to:** area 01 (`onBatchComplete`, 279 LOC, cc 64), area 05 (polish/regen), A9G-15.

### A9G-06 — Structural changes that would avoid retries
- **P1 · lens I · R2 · M, plus the evidence below**
- **Evidence:** REVIEW_12 measured 115 k characters per retry against 100 k per first attempt. The retry brief is 2–4 k of that (MEASURED, A9G-07) and the prior draft 7–11 k. **The cost of a retry is the re-sent base prompt,** so shortening the retry text saves little. What saves money is not retrying, or retrying smaller. From the code:
  1. **The pre-fix and the detector are two bodies.** The season pre-fix (`enforceMonthSeasonLockOnChapterWithTelemetry`, lint.ts:1044, with its own `SPRING_MECHANICAL_COLLOCATION_RE`/`MECHANICAL_CONTEXT_RE` at 996–997) and the detector (story-validation `analyzeTemporalConsistency` + `caseNamesMechanicalSpring`) each define "mechanical spring" separately. lint.ts:1006–1014 is a hand-kept sync note. Driving the fixer from the detector's spans (`seasonTriggers`, added by REVIEW_12 §8.2) makes "fixer protected it, detector failed it" impossible. That split is the #1 retry cause REVIEW_12 measured (8 of 11 on one run).
  2. **Retries are spent on residuals that exhaustion accepts anyway.** Debug-note paragraphs are stripped deterministically, but only on the final attempt (3515–3533). The entropy-only, opener-only, fingerprint-only and resolution-only bypasses (3442–3575) accept at attempt 3 what they rejected at attempts 1–2.
  3. **A `surgical_patch` retry re-sends everything.** The strategy has decided the draft is mostly valid, yet the retry still re-sends the full base prompt plus the draft. A scoped edit-list regen (the existing `makeRegenFn({ editList: true })` channel) would carry only the failing paragraphs and constraints.
  4. **Retries that cannot succeed.** When the same validator code fails twice in a row, the retry is unwinnable; REVIEW_12 §5's outline-vs-validator contradiction is this case. A pre-flight check on stage mode × scene purpose, or a stop rule keyed on the A9G-04 issue code, avoids it.
- **Proposal and evidence required:** from `llm-prompts-full.jsonl`, measure (a) the share of retries whose error set ⊆ the bypass classes; (b) the share in `SURGICAL_PATCH` mode ("Retry mode: SURGICAL_PATCH" is in every retry prompt); (c) repeat-same-code rates. Then ship (1) as R1 if byte-equal on non-colliding text, and (2)–(4) each behind its own flag with an N ≥ 4 probe (ADR-0004).
- **Benefit (hypothesis, not measured):** if half of the 98 retries in the corpus were single-family patches replaced by ~15 k-character scoped regens, the saving would be about 4.9 M of 30.9 M characters (≈ 16%).
- **Relates to:** A9G-04, 07; REVIEW_12 §3/§5; area 03 (R8 prefix order: retry mitigations are injected into the system prompt at prompt-builder.ts:2137 rather than the tail).

### A9G-07 — One retry message, three authors
- **P2 · lens I · R2 · M**
- **Evidence (MEASURED, attempts 2/3 at max 3, two errors, redesign on):**
  - The message is 4,011 / 4,323 characters with **16 section headers** from `buildSinglePassRetryPrompt`, `buildTerminalRetryExecutionBlock` and retry-protocol `buildRetryFeedback`. **Each validator message appears 4 times.**
  - At attempt 2 the message says both "Retry mode: SURGICAL_PATCH … Use the existing draft as reference" (800–801, with the draft attached, 2529–2530) and "Use failed draft as negative example only. Do not preserve its sentence structures" (848).
  - Separately, the protocol's stage-mode boilerplate "Do not resolve the culprit…" (retry-protocol.ts:185–187) is emitted for every stage-mode subcode.
- **Proposal:** a single `renderRetryBrief(issues, strategy, packet)` driven by the A9G-04 registry. Each section appears once, and the draft instruction follows `strategy.includePriorDraft`.
- **Benefit:** clarity first. The token saving is honestly small, about 1.5–2 k characters per retry (≈ 2% of a retry prompt).
- **Verification:** probe-based prompt diff; flag plus probe.
- **Relates to:** A9G-03, A9G-04.

### A9G-08 — Flags: resolve once, parse one way
- **P2 · lens D · R1 · S**
- **Evidence (MEASURED):**
  - There are 13 `process.env` reads for 7 flags (§6), plus 2 in context-management. Three parse idioms are in use: `=== "true" || === "1"`, `!== "false" && !== "0"`, and `/^(1|true|yes|on)$/i`. The flags are read per chapter per attempt, deep in the loop (3192, 3208, 3355, 3377).
  - The 18-line `rolloutFlags` block (2121–2139) re-applies defaults that `mergeConfig` already guarantees (generation-params.ts:1290–1362, typed `Agent9RolloutFlagsConfig`) and casts through `as any`.
  - `integrity_retry_packet_enabled` and `integrity_blue_sky_mode_enabled` are read by nothing; they are only echoed to telemetry (4645–4646 → agent9-run.ts:5350–5352). `opener_exhaustion_bypass_enabled` gates behaviour (3486) but is missing from the telemetry mapping and from types.ts:229–244.
- **Proposal:** `agent9-prose/flags.ts`, with runtime getters on a shared `parseBooleanEnv` (move it from worker agent9/flags.ts to a leaf both sides import), and `rolloutFlags = getGenerationParams().agent9_prose.rollout_flags`, both resolved once into `RunConfig.flags`. Changing the parse idiom is R2 only for spellings such as "yes"/"TRUE" (§9 #6).
- **Benefit:** about −40 lines; the flags become enumerable for `flags:check`; no flag reads remain inside the loops.
- **Verification:** a unit test showing equivalence of the rollout block to the merged config for all 15 keys; golden harness.
- **Relates to:** A9G-05, 13.

### A9G-09 — Run-constant facts are derived per call, several ways
- **P2 · lens C · R1 (identical bodies) / R2 (divergent ones) · M**
- **Evidence:**
  - `resolveVictimName(inputs.cast)` is called 9× per chapter per attempt. `CASE.culpability.culprits[0]` is read 6×. `resolveDeathMethod` is called 3×. The verbatim-echo source strings are rebuilt on every `evaluateCandidate` (2856–2860). The victim is identified four ways across the boundary (`resolveVictimName`, `isVictimArchetype` at 2229, `/victim/i` at agent9-run.ts:3976, `culpabilityVictim` injection).
  - **Arc position has 6+ bodies:** generate.ts:2331, agent9-run.ts:4603, prompt-builder.ts:1613 and :206, chapter-obligation-contract.ts:27, and story-bible.ts:207 (a different formula, and it is the ADR-0005 freeze point).
  - The loop (1-based, `chapterEnd`) and the prompt builder (`ci = chapterStart − 1`) disagree on **6 of 10 chapters** of a 10-chapter book (computed from the code), e.g. `9: climax / pre_climax`. The prompt never says "climax".
- **Proposal:** `RunFacts` is computed once: victim, culprit, surname, suspects, murder method, mechanism terms, echo sources, DT boundary. Add one `arcPositionFor(chapter, total)` in constants/arc-position.ts and fold the identical bodies (loop, worker, obligation contract) into it (R1). Moving the prompt builder or the Bible onto it is R2 (prompt bytes change).
- **Benefit:** about −60 lines; ADR-0005 violations removed.
- **Relates to:** A9G-05; area 03.

### A9G-10 — The normalisation chain is written three times
- **P2 · lens C · R1 · S**
- **Evidence:** main 2603–2773 (season lock → split → structure repair → pronoun repair → sanitise → regen-clue → deterministic repair). Expansion 3016–3054 omits split, structure and regen. Polish `validateCandidate` 3263–3270 has only pronoun repair and sanitise. The P2-10 ordering comment is repeated at 3032.
- **Proposal:** `normalizeCandidateChapter(chapter, ctx, { stages })`, with the per-caller stage list made explicit.
- **Verification:** golden harness scenarios with an underflow case and a polish case.

### A9G-11 — The provisional score's clue matcher disagrees with the validator
- **P2 · lens C · R2 · S**
- **Evidence:** generate.ts:231–248 says "Mirror the real validator thresholds", but it uses `tokens.length <= 4 ? 1 : …`. The validator (`resolveContextOnlyCluePresence`, clue-validation.ts:946–963) always requires `ceil(n·t)` and filters non-cast proper names; this copy does neither. The directives it produces go into the next chapter's prompt (4129–4140).
- **Proposal:** export the validator's resolver and call it here. R2, because the feed-forward prompt text can change.

### A9G-12 — Compiler-proven dead code
- **P2 · lens D · R0 · S**
- **Evidence (MEASURED, `tsc --noUnusedLocals`):**
  - Unused import bindings: 32 in generate.ts, 7 in context-management.ts, 4 in types.ts.
  - Unused locals: `clueErrors` (1144) and `bestAttemptErrorCount` (2364, orphaned by A_55 #4).
  - `chunkScenes` (159) has zero callers repo-wide and is not re-exported by the package root.
  - An empty `if (attempt === 1) {}` at 3595–3597.
  - A dangling doc comment at context-management.ts:483–486.
  - `escapeForRegex` (2225) duplicates `escapeRegExp` (352).
  - The inline cost sum at 4579–4584 duplicates `getAgent9CostTotal` (clue-validation.ts:409).
  - The branch condition at 1725 is redundant (it reduces to `else if (hasFingerprintDupe)`).
  - 14 generate.ts exports have no user outside the file (export-usage.md).
- **Proposal:** delete them, and un-export the file-local helpers when their files are split.
- **Verification:** typecheck, suites, `build:all`, `preflight-dist-check` (ADR-0004 exemption).

### A9G-13 — Options with no setter
- **P2 · lens D · R2 · S**
- **Evidence (MEASURED, repo-wide grep):**
  - `preferCompletionOnFailure` is set nowhere, so `!preferCompletionOnFailure` (3674, 3723, 4462) is unreachable. That abort path contradicts ADR-0003, and the `promptLeakagePersisted` tag it sets (3739) has no reader.
  - `enableSurgicalFingerprintRetry` feeds only the enhanced path (2514), which is dead at max 3 (A9G-03). types.ts:148 describes structural-pivot behaviour that retry-protocol decides independently.
  - The `redesignEnabled` false path: FLAG-AUDIT verdict PROMOTE (`AGENT9_REDESIGN_V1`).
- **Proposal:** delete them, with FLAG-AUDIT and ADR-0003 as the recorded evidence. The owner decides.

### A9G-14 — Types and contracts
- **P2 · lens E · R0/R1 · M**
- **Evidence:**
  - Restated inline instead of named: the prompt-fingerprint shape (3×: types.ts:173, :196, generate.ts:2104); `nsdCheckpoint` (types.ts:128, agent9-run.ts:4581, the jscpd clone); linter stats (types.ts:212 vs `ProseLinterStats` :285); provisional score (types.ts:254 vs generate.ts:181); the rollout flags in camelCase (types.ts:229).
  - Errors carry untyped tags `(err as any).retriedBatches/fallbackValidationFailed/promptLeakagePersisted`. Only `retriedBatches` is read (mystery-orchestrator.ts:1872).
  - generate.ts has 50 `as any`, 14 of them `(inputs.caseData as any)`. `inputs.cast.characters` is re-read raw at 2788 although `castCharacters` is normalised.
  - `ProseGenerationInputs` has 38 fields and 4 `any` artifacts.
  - `buildMacroArcPlan` is value code living in types.ts:47.
- **Proposal:** named types in types.ts; a `ProseGenerationError` class; a typed `cmlCase` from a boundary parser (in the style of json-boundary.ts); move arc planning into a module of its own.

### A9G-15 — S6 evidence (the owner's open decision)
- **P2 · lens A · R0 · S**
- **Evidence (MEASURED, TS AST over agent9-prose/):**
  - 67 import statements go into the package root, over 19 modules. **16 are entirely unused.** context-management.ts (3/3) and phrase-analysis.ts (3/3) would have zero root edges after A9G-12.
  - Of the 51 live edges, **25 are type-only** (erased at runtime).
  - The value edges (26) are mostly leaf data and utilities: `shared/*` ×8, `constants/*` ×4, `types/macro-arc`, `utils/model-tiers`. The only non-leaf value dependencies are `agent5-clues.deriveClueObservable/deathMethodTellHints` (3), `asset-library` (3), `types/narrative-state` functions (2), `story-bible` (1), `retry-protocol` (1) and `prose-request-contract` (1).
  - **A fourth back-edge that REVIEW_03 §0j missed:** `types/narrative-state.ts:46` `beatHistory?: import('../agent9-prose.js').BeatFingerprint[]`, an inline type import that is invisible to import-statement cycle scans.
- **Reading:** the coupling is overwhelmingly types plus leaf constants. That favours option 2 (a leaf `prose-contracts` package holding types, shared vocabularies and constants) over "split prompts-llm". After R0 cleanup, the residual non-leaf value edges are 11 sites over 6 modules.

### A9G-16 — No second budgeting body; an unbudgeted block instead
- **P2 · lens I · R2 · S (measure first)**
- **Evidence (MEASURED):** context-management.ts contains no budgeting at all: no budget or token logic, only fixed item caps (8, 10, 3, 12, 15). The premise of a "second budgeting body" is false; `applyPromptBudgeting` (prompt-builder.ts:1398) is the only one. However, `buildStoryToDateBlock` (249–287) emits **the full text of every prior chapter**. It is interpolated straight into the user message (prompt-builder.ts:2318) and is not one of the budgeted sections, so it grows O(n²) over a run and is re-sent on every retry. Two things exist only because of it: the anti-copy guardrail (2464–2471) and the n-gram/fingerprint retry family.
- **Proposal:** measure its share of the prompt from the log (REVIEW_12 had budget lines for sections only). Then decide, with area 03: make it a budgeted section, or replace it with summaries. R2.

### A9G-17 — Vocabulary and regex copies
- **P3 · lens C · R1/R2 · S**
- **Evidence:** 1401–1404 hand-types the atmosphere list: 28 words against the 39 in `OPENING_ATMOSPHERE_MARKERS` (opening-grounding-vocabulary.ts:75), in the same file whose header says the vocabulary "has ONE body" (X95). The DT-scene regex appears ×4 (3811, 3983, 4263, deterministic-repair.ts:838). The leakage-residual regex ×2 (3897, 4359). The `resolvePolishProvider` wiring ×2 (3248, 4533).
- **Proposal:** render from the canonical constants (R2 where prompt text changes).

## 4. Target structure

```
agent9-prose/generation/   generate-prose.ts ~150 (coordinator) · run-config.ts ~120 · run-facts.ts ~80 · state.ts ~120
                           batch.ts ~180 · attempt.ts ~200 · candidate.ts ~350 (normalise+evaluate+acceptance)
                           expansion.ts ~90 · acceptance.ts ~200 (lint + bypass table) · fallback.ts ~150
                           commit.ts ~180 (sole NSD owner) · telemetry.ts ~120 · whole-story.ts ~100 (→ worker, A9G-05)
agent9-prose/retry/        issue-registry.ts ~250 · retry-brief.ts ~200 · provisional-score.ts ~110 · detectors.ts ~80
                           [enhanced-feedback.ts ~850 only if A9G-03 route (a)]
agent9-prose/flags.ts ~60 · pronoun-sweep.ts ~80 (one body, A9G-05) · context-management.ts ~270 · types.ts ~330
```
generate.ts goes from 4,712 lines to 0: the file is replaced by these modules, and ~2,200 lines disappear if A9G-03 route (b) is taken (~1,150 otherwise). The largest function goes from 2,661 LOC / cc 350 to ≤ 200 LOC / cc ≤ 30.

## 5. Suggested sequence

1. A9G-12 R0 cleanup (2 h).
2. §7 harness and classifier table tests (1–2 d). **This is the gate for everything after it.**
3. R0 moves: the retry machinery, provisional score and detectors out of generate.ts; the enhanced path into its own file pending A9G-03.
4. A9G-08 flags/`RunConfig`; A9G-09 R1 folds (`RunFacts`, one `arcPositionFor` for the three identical bodies).
5. A9G-02 merged acceptance/fallback (R1 check sets); A9G-10 normalisation.
6. A9G-01 phase extraction, byte-equal against the harness.
7. A9G-04 step 1 (the registry reproduces today).
8. Owner decisions, each behind its own flag: A9G-03, A9G-04 step 2, A9G-05 removals, A9G-06, 07, 11, 13, 16, 17.

## 6. Flags in this area

| Flag | Default | Read at | FLAG-AUDIT status | Structural note |
|---|---|---|---|---|
| `AGENT9_REGEN_CLUE` | off in code; **SET on** | generate.ts:2157 (once) | PROMOTE | Puts an LLM call inside the normalisation chain; uses the generate tier (§9 #2) |
| `AGENT9_BIBLE_AUTHORITATIVE` | off in code; **SET on** | 2324 (per batch); also prompt-builder.ts:1785, worker flags.ts:142 | PROMOTE | Keeps two derivations of the pre-DT boundary; 3 readers, 2 parse idioms |
| `AGENT9_POLISH_RETRIED_CHAPTERS` | off | 3192 (per chapter × attempt) | DEFER (R6) | Feeds `shouldPolishChapter` |
| `AGENT9_POLISH_HIGH_LEAKAGE_CHAPTERS` | **on** (`!== "false"`) | 3208 (per chapter × attempt) | PROMOTE | Default-on idiom |
| `AGENT9_CROSS_CHAPTER_ECHO` | off | 3355 (per attempt) | DEFER, deliberately | Regex idiom (accepts yes/on) |
| `AGENT9_REGEN_SUSPECT_ELIM` | off in code; **SET on** | 3377 (per attempt); worker flags.ts:120 | DEFER | One lever, two readers, two parsers |
| `AGENT9_FULLSTORY_POLISH` | off | 4521 | DEFER (R6) | Whole-story LLM pass inside the package |
| `AGENT9_CONTINUITY_SPAN` | off | context-management.ts:31 (via 84, 172) | PROMOTE or delete (A_73) | Clean getter |
| `AGENT9_LOCKED_FACT_ALIASES` | off | context-management.ts:232 | DELETE if no effect (A_73) | |
| `AGENT9_MODEL_GENERATE/REGEN/POLISH` | unset → fallback | model-tiering.ts:38 | CONFIG | Tiers split: generate/regen resolved in the worker, polish in the package |
| `rollout_flags` ×15 (YAML) | mostly on | 2121–2139 | outside FLAG-AUDIT | 2 control nothing; `culprit_alias` read only in the worker (6221) |
| `default_max_attempts` (YAML) | 3 | 2067 | config | Decides reachability of ~1,050 lines (A9G-03) |
| `bottomUpRedesignEnabled` ← `AGENT9_REDESIGN_V1` | on | 2223 | PROMOTE | False path = no contract, packet or protocol feedback |

## 7. Safety net

**Tests today.**

| Test | Covers |
|---|---|
| agent9-prose.test.ts (via the barrel) | `buildEnhancedRetryFeedback` ×3, `chooseRetryPromptStrategy` ×2, `buildCanonicalRetryBrief` ×1, `buildSinglePassRetryPrompt` ×2 — **all at maxAttempts 6 except one** |
| retry-routing-vocabulary.test.ts (4) | families only |
| a55-prose-gates | `scoreBatchErrorSeverity`, mechanism gate |
| a58 | `detectVictimAlive` |
| a66-final-sweep (6) | the sweep |
| continuity-anchor-p13 (3), opening-style-per-story, model-tiering | context and tiering helpers |

**Gaps (MEASURED):** zero tests call `generateProse` or `runAgent9`. No test covers the fallbacks, the bypasses, the commit/NSD path or the ordering of `onBatchComplete`. `agent9-replay.ts` uses a real client, so it is paid and cannot serve as a free net.

**Write first:**
1. **A scripted mock client:** `chat` returns queued JSON and `getCostTracker` is stubbed. Drive a 3-scene fixture through accept, fail→accept, exhaust→best attempt, exhaust→template, parse-error×3→exception, and last-batch resolution-only. Capture every `messages[]` array and the result JSON as goldens.
2. **A classifier table** over the archive messages (A9G-04).
3. **A retry-path reachability test** at max 2/3/4/6 (A9G-03).
4. **An atom/beat propagation assertion** (A9G-05; it is expected to fail today).

## 8. What NOT to refactor

- The best-attempt retention, the completion fallback and the four exhaustion bypasses are ADR-0003 policy. Change them only as R2 (A9G-06).
- The final-attempt structure repair and the single-paragraph split (2622–2664) are cheap deterministic floors that already save retries.
- Keep the ordering season lock → pronoun repair → sanitise (P2-10), and regen-clue before deterministic repair (ADR-0007).
- The polish claim-before-call invariant (`polishedChapterNumbers`, A_71).
- The per-run resets of the polish cache and repair efficacy (A_73 §36), until module-level state is removed.
- The seeded FNV opening rotation (reproducibility); the retry temperature escalation (policy); the resume filters (2081–2113).

## 9. Incidental defects

1. **The A_73 §35 threshold change altered live retries without a flag** (79524bd6). At max 3, attempt 2 moved from enhanced to terminal feedback, and ~1,050 lines became unreachable. *High* (MEASURED probe).
2. **The in-loop clue regen ignores the regen tier.** `makeRegenFn({ model: inputs.model })` (2741) runs on the generate deployment. The worker fixed its 10 sites (agent9-run.ts:4314) and missed this 11th. FLAG-AUDIT records `REGEN_CLUE` as SET on, so this is plausibly a live cost. *High* on the mechanism, *medium* that it affects live cost.
3. **Deployed atoms and beat history never reach the in-loop prompt.** Only the worker's NSD copy is stamped. The in-loop `liveNarrativeState` gets only the break-moment stamp (4114), yet the prompt reads `deployedAssets` for the texture budget and for detecting a character's first-impression chapter (prompt-builder.ts:1631, prompt-blocks.ts:273). The first-impression portrait is likely re-shown every chapter, and texture ranking stays static. *Medium-high* (needs §7 test 4).
4. **A throw from `onBatchComplete` duplicates chapters.** Chapters are pushed at 4027 before the awaited callback at 4183. A throw (for example the worker's NSD parity check, agent9-run.ts:4668) is caught at 4204 and the batch regenerates or falls back, pushing again. The run then dies at `validateChapterCount` (4576) with a misleading count. *High* on the mechanism, *low* on frequency.
5. **The loop and the prompt builder disagree on arc position for 6/10 chapters** (A9G-09). *High* that they differ, *medium* that it is unintended.
6. **Flag parse divergence.** `AGENT9_REGEN_SUSPECT_ELIM=yes` (or `TRUE`) turns the worker's regen on while generate.ts keeps the deterministic clearance shortcut. The same applies to `BIBLE_AUTHORITATIVE`. *High* on the mechanism, *low* that anyone sets those spellings.
7. **Classifier misroutes** (A9G-04). A mechanism leak lands in "CHARACTER NAME ERRORS". Season, verbatim-echo and victim-alive messages classify as protocol `unknown`, so non-convergence can stop them after 2 attempts. *Medium*.
8. **`chapterPronRepairCount > 8 && attempt < 4` (2787)** is a literal beside the budget: at max 3 the drift gate never relaxes on the final attempt. This is the class A_73 §35 fixed elsewhere; `attemptNum >= 3` (1434) and `<= 2` (1466) are other instances. *High*.
9. **`result.cost` and `BatchCommitRecord.cost` undercount.** They sum only `Agent9-ProseGenerator*` labels (4582, clue-validation.ts:412), so the in-loop expansion, polish, atmosphere, full-story and regen calls are excluded. This is one mechanism of the known under-reporting. *Medium*; see area 11.
10. **The exception fallback differs from the exhaustion fallback.** It skips chapterValidator and victim-alive, and it does not count leakage residuals (A9G-02). *High* that they differ.
11. **A 4th back-edge** exists at narrative-state.ts:46 (A9G-15). *High*.
12. index.ts:3 carries a BOM and a double-encoded em-dash ("Barrel â€”"); agent9-prose.ts:1 has a BOM. The fault is cosmetic.

## 10. Cross-area observations

- **Duplication data.** Running jscpd again with the line cap lifted agrees with the regenerated duplication.md: 17 clones / 226 lines touch generate.ts. Most of them are the acceptance and fallback bodies (A9G-02).
- **Validator messages are the de facto routing API.** String classifiers drift from the validators' wording: X80 documented 31% of archived retry messages as unroutable. Expect the same in the Agent 5/6/7 retry loops (area 11).
- **"Literal beside the budget"** attempt thresholds are a recurring shape (§9 #8).
- **One fact, many bodies, across the package boundary:** arc position (6+), victim identity (4), the regen Bible (`beatSheet: []` copied into 12 worker passes on a rationale stated for one; areas 01 and 05), the pronoun sweep (2), and NSD (2, with a runtime parity check that exists *because* there are two).
- **Flag parsing:** the worker uses `parseBooleanEnv`; the package uses strict equality.
- **Module-level mutable telemetry** (repair efficacy, clue-paste tallies, the polish-provider cache) lives in a long-lived API process where runs are in-process.
- **Whole-story passes wired in generate.ts** contradict README §4's own rule (area 05).
- **The retry cost is the re-sent base prompt**, not the retry text. Every retry-prompt optimisation should be priced against ~100 k characters.

## 11. Open questions for the owner

1. **A9G-03:** restore the enhanced feedback at attempt 2 (a flag plus a probe) or accept terminal-only and delete ~1,050 lines?
2. **Who owns narrative state:** the package (proposed) or the worker? And should the three whole-story passes move to the ship layer (A9G-05)?
3. **S6:** does A9G-15's edge profile (types plus leaf constants, 11 non-leaf value sites) settle it in favour of a leaf `prose-contracts` package?
4. Should residual classes that exhaustion accepts anyway stop consuming retries at attempts 1–2 (A9G-06 #2)?
5. Delete the `preferCompletionOnFailure` abort path as contrary to ADR-0003 (A9G-13)?
6. Should the registry's misroute corrections (A9G-04 step 2) ship as one flag or several?

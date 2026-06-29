# ANALYSIS_53 — Full audit of Agents 1–8 (bugs, issues, improvements, efficiency)

Status: **audit register — findings only, no code changed.** A read-only sweep of every structural/logic pipeline stage (Agent 1 → Agent 8, including the sub-agents 2b/2c/2d/2e, 3b, and 6.5). Agent 9 (prose) is out of scope. Each stage was audited by an independent reviewer reading the runner, the prompt module(s), and the tests, against a fixed rubric: **bugs**, **story-specific hardcoding in logic**, **improvements**, **efficiency**.

> Lineage: A_52 landed the role model + mechanism gate + scene-grounding + the Agent 5 source-path repair-not-abort + the temporal "May I?" false-positive fix. This doc is the systematic bug/efficiency pass across the rest of the pipeline. Two A_52 items are already fixed and were excluded from re-reporting: the mechanism-reveal-gate decoupling and the ambiguous-month "May I?" false positive.

Method note: ~104 findings across 8 stages. Severity is the reviewer's; confidence is included so the fix queue can prioritise high-confidence/high-severity first. Every proposed fix is **holistic** (parameter-driven, no story-specifics) per the standing principle.

---

## ⏱ Phased implementation tracker

**Status:** `☐` not started · `◐` in progress · `✅` done · `⊘` won't-do/obsolete. **Progress: ~98 / 103** — Phases 1–11 substantially complete. ~5 items deferred/partial with documented rationale (see below).

> **A_53 integration note (Phases 9–11):** the file-local efficiency/robustness items (Phases 9–11) were implemented via a 38-agent workflow (19 implement + 19 adversarial-verify), partitioned one file per agent. Verifier verdicts: **15 accept · 4 accept-with-fixes · 0 reverts · 0 story-specific hardcoding.** Integration fixes applied after the workflow: (a) `agent3-cml.ts` seed-cache delimiter was a literal NUL byte → `::` (git treated the file as binary); (b) `agent1-setting` schema-trim **reverted** (it dropped the prompt-eval quality score 90→85 and broke the schema contract — kept the genuinely-good raw-constraint-interpolation half); (c) `agent5-run` `analyzeSuspectCoverage` now returns defensive array copies (`.sort()` callers were corrupting the cache); (d) `agent5-run` strict whitelist/feedback caches invalidated after the in-place `evidence_clues` mutation; (e) `agent4-revision` `mechanismHint` excludes the literal `"Unknown"`; (f) seed-corpus load memoized at module scope (orchestrator). All 5 packages typecheck clean; full vitest sweep green (97 test files).
>
> **Deferred / partial (with rationale):**
> - `live-LLM-auditor-and-deterministic-package-disconnected` (P7) — needs a new worker→`@cml/novelty` dependency + the CML→Skeleton extractor the redesign gates as a "next phase".
> - `subagents-serial-llm-calls` (P9) — the 2b/2c concurrency races on the shared scoring state + `savePartialReport` file write; the safe sub-parts (2d season pin) already landed in P5/P6.
> - `expensive-post-CML-LLM-audit-runs-every-run` (P9) — **partial**: the seed-corpus cost is addressed (memo); the judge-gating leg is bounded by the deferred P7 wiring.
> - `a5-retry-loops-regenerate-all-clues` (P9) — skipped: structural rewrite of 5 dark-by-default round-trips, too risky under the single-file/no-test workflow constraints.
> - `a5-reconcile-audit-runs-three-expensive-scans` (P10) — `⊘` obsolete: the item's premise (two scans back-to-back with no intervening mutation) no longer holds in the current file.
>
> **Full canary validation (run mystery-1782677370766, 2026-06-28):** the entire A_53-modified pipeline ran **end-to-end (exit 0), no abort** — a full 9-chapter story was produced (`stories/story_20260628-2119/`), and the conservative culprit-near-death gate handled an edge case by **warn+skip, not crash** (repair-not-abort working). K2 rubric **60/100** ("promising but rough"); per-chapter prose 88–94. Caveats: (a) not directly comparable to the A_52 baseline of 70 — cross-run novelty (now default shadow) produced a *different* story; (b) the release gate reported **scene-grounding 0/9**, but inspection shows the prose IS richly grounded (location/time/sensory in every opening) — this is a **false-negative of the pre-existing `hasAnchor` heuristic** (`evaluateSceneGroundingCoverage`, UNCHANGED by A_53) which requires the location *proper noun* in the first 2 paragraphs, and this story used "the hotel" generically there. **Decision:** `CML_REPAIR_MODE` default reverted to `rewrite` (was flipped to `patch` by the P9 item) — patch is the efficiency win but a score-sensitive change, kept opt-in until an A/B validates it. Recommended next: a controlled A/B (A_53 defaults vs `NOVELTY_CROSS_RUN=off` + same theme) to isolate any real score delta.

Phases are ordered by leverage, not by agent — most fixes are *pattern* fixes that touch several agents at once (build the shared helper, apply everywhere). Each item links to its full evidence (file:line + quote) in §§1–8 by `id`. Do phases top-to-bottom; within a phase, do `high` before `med`/`low`.

| Phase | Theme | Items | High | Gate to advance |
|:--:|---|:--:|:--:|---|
| **1** | Holistic-principle: hardcoding & generalization | 3 | 3 | No story content in logic; theme-lock degrades gracefully |
| **2** | Reliability: crash + repair-not-abort sweep (Pattern A) | 15 | 8 | No deterministically-repairable violation throws; full run survives |
| **3** | Cost accounting (Pattern C) | 4 | 0 | Per-call cost deltas; budget can't spuriously abort |
| **4** | Identity matching (Pattern D) + culprit exclusivity | 5 | 1 | One word-boundary `namesMatch`; no substring false matches |
| **5** | Validator / gate false positives | 9 | 1 | No fair/valid story fails a gate |
| **6** | Mutation re-validation + config single-source-of-truth (Pattern E) | 8 | 1 | Every mutation re-normalized+re-validated; one config source |
| **7** | Novelty teeth & wiring | 5 | 0 | A clone can be blocked; deterministic judge wired |
| **8** | Dark levers (Agent 7 scheduler authority) | 4 | 2 | Word-budget lever shippable; clue-job lever safe to enable |
| **9** | Efficiency: LLM round-trips | 11 | 4 | No avoidable full-regeneration on the critical path |
| **10** | Efficiency: compute / memoization / token-trim | 19 | 0 | Immutable-CML derivations memoized; no rebuild-in-loop |
| **11** | Robustness & polish (remaining low items) | 20 | 0 | Backlog cleared |

---

### Phase 1 — Holistic-principle: hardcoding & generalization `(3 items · 3 high)` ✅ COMPLETE
**Goal:** logic must work for *any* story regardless of parameters. **Approach:** derive from the artifact's own data; never inject a concrete plot.
- ✅ `normalizer-hardcoded-story-fallbacks` · A4 · **high** — fallback inference steps now synthesized from the doc's OWN `constraint_space` anchors + `hidden_model.mechanism` (`buildFallbackInferenceSteps`); `subtype→"unspecified"`, `motive_seed→"a personal stake in the outcome"`. (`era.decade→"1930s"` kept: a decade is a structurally-required setting param and 1930s is the documented project era, not plot content — era-constraint mismatch is the separate P11 `era-constraints-silent-default-1930s`.)
- ✅ `disc-test-patch-hardcoded-clock-mechanism` · A7 · **high** — outline patch now derives the test phrasing from `discriminating_test.method/design`, the ruled-out count from the actual non-culprit suspect roster, and refers to the mechanism only generically ("the established mechanism") — no literal clock; closure patch's "two" parameterised.
- ✅ `mechanism-family-extractor-misses-most-themes` · A3 · **high** — data-driven synthetic-family fallback: a token shared by the theme prose AND the structured hints becomes a family (`scoreDeviceThemeMatch` realizes it via whole-word match), degrading gracefully without firing on open themes or abstract axis labels. +4 tests.

### Phase 2 — Reliability: crash + repair-not-abort sweep (Pattern A) `(15 items · 8 high)` ✅ COMPLETE
**Goal:** no whole-run failure where a deterministic repair from the artifact's own data exists. **Approach:** convert each throw to warn+deterministic-repair.
- ✅ `diversity-undefined-crash` · A2 · **high** — `normaliseCastOutput` now defaults `diversity={stereotypeCheck:[],recommendations:[]}` when omitted; access optional-chained
- ✅ `realism-hard-abort-should-repair` · A1 · **high** — both sites (agent1-setting final attempt + agent1-run defensive) fold anachronism/implausibility notes into `recommendations`, clear arrays, warn, continue
- ✅ `schema-validation-hard-abort` · A1 · **high** — `backfillSettingArtifact` fills schema-required fields from context (free, runs even with contract-recovery off); re-validate before any throw
- ✅ `role-diversity-hard-abort` · A2 · **high** — legacy path now accept-with-warning (mirrors constrained path); test updated
- ✅ `cml-min-steps-hard-throw` · A3 · **high** — synthesize missing steps from this case's constraint anchors + mechanism, pad to floor of 3, warn
- ✅ `revise-loop-no-convergence-guard` · A4 · **high** — `noProgressStreak`; after 2 non-reducing passes → degrade to best-so-far
- ✅ `a5-discrim-timing-gate-hard-abort-but-repair-exists` · A5 · **high** — `promoteLateGateCluesToMid` + rebuild timeline + re-check; residual → warn
- ✅ `a5-mechanism-visibility-gate-hard-abort` · A5 · **high** — same shared promotion repair; genuinely-empty case warns (no throw)
- ✅ `a5-meta-audit-gate-false-positive-and-abort` · A5 · **high** — demoted to warning (pattern-tightening is P5); test updated
- ✅ `a5-step-coverage-floor-requires-contradiction` · A5 · **high** — `requireContradiction` now per-step (own correction OR case time.contradictions); gate downgraded to warn
- ✅ `blind-reader-gate-throws-on-fair-mystery` · A6 · **high** — single-sample throw gated behind default-false `AGENT6_BLIND_READER_BLOCKING`; else non-fatal advisory
- ✅ `graceful-degrade-default-off-kills-runs` · A4 · med — `AGENT4_GRACEFUL_DEGRADE` default flipped ON (explicit off/false/0 restores strict); test updated
- ✅ `agent2-run-stereotype-hard-gate` · A2 · low — demoted to warnings (surfaces self-report + recommendations); the deterministic checkCast is the real gate
- ✅ `agent65-3-attempt-loop-can-hard-throw` · A65 · med — deterministic name-order reorder of portraits/sketches before the order gate
- ✅ `agent65-score-failure-aborts-via-shared-retry` · A65 · low — `executeAgentWithRetry` gains `abortCritical` (default true); Agent 6.5 passes `false`

### Phase 3 — Cost accounting (Pattern C) `(4 items · 0 high)` ✅ COMPLETE
**Goal:** the $0.15 retry budget reflects real spend and can't manufacture a second abort path. **Approach:** `perCallCostDelta(key, cumulative)` lazy-baseline helper → true per-call delta; overwrite (not `+=`) for cumulative byAgent totals.
- ✅ `blind-reader-cost-double-count` · A6 · med — `retryBudget.consume(perCallCostDelta("Agent6-BlindReader", latestBlind.cost), …)`; agentCosts overwrite
- ✅ `fairplay-audit-cost-double-count` · A6 · med — all consume sites use `perCallCostDelta("Agent6-FairPlayAuditor", …)`; loop accumulator + agentCosts overwrite (final cumulative); test updated to 0.04
- ✅ `collision-retry-cost-double-count` · A3 · med — assign `= retryResult.cost` (cumulative), matching the novelty-retry path
- ✅ `cost-budget-not-enforced` · A4 · low — `AGENT4_MAX_COST_USD` threaded; spend over the ceiling breaks to degrade (unset = no ceiling)

### Phase 4 — Identity matching (Pattern D) + culprit exclusivity `(5 items · 1 high)` ✅ COMPLETE
**Goal:** no `String.includes` false matches on names/roles. **Approach:** new shared `identity-match.ts` (`namesMatch`/`surname`/`nameAppearsAsWord`/`roleArchetypeIncludesWord`/`isDetectiveArchetype`); reveal-gate re-exports `namesMatch`. +10 unit tests.
- ✅ `a5-direct-culprit-slot-admits-non-culprit` · A5 · **high** — slot builder now runs `mentionsNonCulprit && !hasExclusivityLanguage` and rewrites adopted donors to the canonical exclusive description
- ✅ `detective-archetype-false-positive` · A2 · med — both sites use `isDetectiveArchetype` (word-boundary + non-police-qualifier denylist); first site also prefers `role`/`detectiveCandidates`
- ✅ `victim-culprit-check-substring-false-positive` · A3 · low — exact-match controlled vocab (`role_archetype==='victim'` after stripping "the ", OR `role==='victim'`)
- ✅ `elimination-clue-detection-substring-false-positive` · A6 · med — both suspect- and culprit-name checks use `nameAppearsAsWord`
- ✅ `a5-namesappearsintext-substring-collision` · A5 · low — `nameAppearsInText` now ordered-phrase OR distinctive-surname (was unordered all-tokens)

### Phase 5 — Validator / gate false positives `(9 items · 1 high)` ✅ COMPLETE
**Goal:** no genuinely fair/valid story is failed by a gate. **Approach:** tighten the offending matchers; extend the A_52 temporal work. +6 regression tests.
- ✅ `missing-bridge-false-positive-body-discovery` · A7 · **high** — `BRIDGE_TERMS` now matches `(found|discovered|recovered) … (body|corpse|remains)` and `(body|corpse|remains) (was/were)? (found|discovered|recovered)`
- ✅ `mar-abbrev-collides-with-ambiguous-march` · A7 · med — ambiguous-month abbreviations require the abbreviating period (`\bmar\.`); bare "mar" (verb) no longer matches
- ✅ `timeline-validator-no-day-tracking` · A7 · med — `DAY_ADVANCE_PATTERN` + per-ref `dayIndex`; refs sorted by text position; backward jump only flagged same-day
- ✅ `agent2d-season-month-inconsistency` · A2d · med — `season` pinned in the prompt as `derivedSeason` (from the mandated month), no longer LLM free-choice
- ✅ `false-solution-empty-object-truthy` · A7 · low — requires `accused_suspect` or any non-empty key, so a `{}` stub isn't a beat
- ✅ `a5-fuzzy-coverage-04-threshold-and-evidence-key` · A5 · low — fuzzy coverage now also requires a step-distinctive token (length ≥ 7), not just 40% common-word overlap
- ✅ `reveal-gate-death-method-token-prefix-false-positive` · A6 · low — word-boundary fallback-token match ("fall" no longer matches "befall")
- ✅ `structural-audit-elimination-all-or-nothing` · A6 · low — flags when `< 50%` of non-culprits are eliminated (was only when zero); surfaces missing names
- ✅ `reveal-gate-enforce-only-downgrades-pass-not-fail` · A6 · med — enforce mode sets a dedicated `blocking: true` independent of `enableBindingGates`

### Phase 6 — Mutation re-validation + config single-source-of-truth (Pattern E) `(8 items · 1 high)` ✅ COMPLETE
**Goal:** any deterministic mutation is re-normalized + re-validated; config has one source. +2 config tests. (prompts-llm/story-validation/beat-scheduler dist rebuilt so the worker consumes the new logic.)
- ✅ `novelty-audit-is-NOT-disabled-live` · A8 · **high** — threshold resolves from `getGenerationParams()` (single source); YAML aligned to 0.9 (was 1.1); test asserts default fires
- ✅ `grounding-mutation-after-validation` · A3 · med — patch path re-grounds `knowledge_revealed` + re-validates before returning
- ✅ `inference-required-evidence-not-repaired-on-valid-path` · A3 · med — `repairInferenceRequiredEvidence` now runs unconditionally; only re-validation is gated
- ✅ `no-revalidation-after-grounding-mutation-in-degrade` · A4 · med — degrade fallback normalizes+validates; no-candidate case always degrades (skeleton never a false success)
- ✅ `silent-evidence-truncation-and-synthesis` · A4 · low — `fallbackEvidence` prefers the doc's own anchors; dropped the fixed free-text templates
- ✅ `max-remediation-cycles-config-mismatch` · A6 · med — `DEFAULT_CONFIG` aligned to YAML (1); config-equality test
- ✅ `agent2d-validation-warns-not-errors` · A2d · low — `deriveSeasonFromMonth` (single source) re-pins month/season before the lock; validation labelled a failure (warning, since 2d is non-abort-critical)
- ✅ `lockedfact-digit-form-not-repaired` · A3 · med — `wordifyLockedFactValue` converts digit times / number+unit to era word-form at registry build

### Phase 7 — Novelty teeth & wiring `(5 items · 0 high)` ◐ 4/5 (1 deferred)
**Goal:** a clone can actually be blocked; the strong deterministic judge runs. **Approach:** `NOVELTY_MODE` + dedup + shared enum mapping.
- ✅ `audit-runs-but-is-toothless-warning-only` · A8 · **(high-impact)** — single `resolveNoveltyMode()` (`off\|shadow\|active`); active sets `blocking` + throws (unless forceWarnings), shadow warns, off skips; legacy `NOVELTY_HARD_FAIL=true` ⇒ active
- ⊘ `live-LLM-auditor-and-deterministic-package-disconnected` · A8 · med — **DEFERRED**: full wiring needs a new worker→`@cml/novelty` dependency (an install) **and** the CML→Skeleton fingerprint extractor the redesign explicitly gates as a "next phase". Package-side prep landed (dedup + axis helper). Wire after adding the dep + extractor.
- ✅ `cross-run-novelty-off-by-default` · A8 · med — `resolveCrossRunMode()` tri-state (`off\|shadow\|on`), default **shadow** (records + feeds prior runs, no threshold cap); `off` is the kill-switch; only `on` caps to 0.7
- ✅ `seed-cliche-fingerprint-duplicates` · A8 · med — `loadReferenceCorpus` de-dupes by structural key, warns on collision, keeps the more-specific corpus (caught `spare_key_relock`≡`the_second_key` etc.)
- ✅ `buildNoveltyConstraints-axis-field-mismatch` · A8 · low — shared `mapToNoveltyAxis` (canonical 6-axis vocab + alias + fallback); used by `extractPriorRunRecord`

### Phase 8 — Dark levers (Agent 7 scheduler authority) `(4 items · 2 high)` ✅ COMPLETE
**Goal:** the two real scheduler wins become safely enableable. **Approach:** split the lever — ship the non-destructive half, fix the destructive half. +5 rewritten/new tests.
- ✅ `scheduler-authority-dark-no-safe-enable-path` · A7 · **high** — split: `AGENT7_SCHEDULER_AUTHORITATIVE` now ships ONLY the pacing-shaped word budgets; the clue-job stamp moved behind a separate `AGENT7_CLUE_JOB_AUTHORITY` (now safe, default off)
- ✅ `grid-cluejob-positional-misalignment` · A7 · **high** — `applyGridClueJobs` aligns by `(act, act-scene-number)`; per-act count mismatch → falls back to the LLM distribution (`fellBack`)
- ✅ `gridcluejob-empties-noncovered-scenes` · A7 · **high** — stamp is ADDITIVE (union + global first-wins dedup, never wholesale-empties); `reassertClueCoverage` re-runs the coverage gate after stamping
- ✅ `gapfill-stride-skips-mid-gap-scenes` · A7 · low — greedy walk guarantees ≤2 consecutive clueless scenes, advancing on fill failure (was a blind `start+2` stride-of-3)

### Phase 9 — Efficiency: LLM round-trips `(11 items · 4 high)` ✅ 8/11 done (3 deferred/partial: subagents-serial, expensive-audit gating, a5-retry-loops — see integration note)
**Goal:** no avoidable full-regeneration, especially on the critical path. **Approach:** repair-before-reroll; patch-by-default; gate the always-on novelty LLM call.
- ☐ `schema-failure-full-llm-reroll-not-repair` · A1 · **high** — deterministic repair before any re-roll
- ☐ `cast-schema-repair-full-regen` · A2 · **high** — targeted field repair, not full regen
- ☐ `subagents-serial-llm-calls` · A2 · **high** — derive 2d/2e where deterministic; run 2b/2c concurrently
- ☐ `full-rewrite-resends-entire-cml-each-pass` · A4 · **high** — make `CML_REPAIR_MODE=patch` default
- ☐ `expensive-post-CML-LLM-audit-runs-every-run` · A8 · **high** — gate LLM audit behind the deterministic judge
- ☐ `realism-violation-reroll-vs-repair` · A1 · med — scrub realism notes deterministically
- ☐ `patch-then-rewrite-double-spend` · A4 · med — feed partially-patched CML into rewrite
- ☐ `patch-budget-consumed-by-unfixable-resurfacing` · A4 · med — signal `budgetExhausted`
- ☐ `a5-retry-loops-regenerate-all-clues` · A5 · med — gate behind deterministic-synth-failed; collapse to one
- ☐ `blind-reader-single-sample-gates` · A6 · med — majority-of-k or replace with `proveSolvability`
- ☐ `ships-whole-cml-and-full-clue-prose-to-every-audit` · A6 · med — slim audit/world-builder context

### Phase 10 — Efficiency: compute / memoization / token-trim `(19 items · 0 high)` ✅ COMPLETE (18/19; a5-reconcile-audit ⊘ obsolete)
**Goal:** stop recomputing derivations over the immutable CML / rebuilding objects in loops. **Approach:** memoize per case object; hoist constants to module scope.
- ☐ `a5-strict-feedback-recomputed-per-attempt` · A5 · med — memoize whitelist/feedback (WeakMap)
- ☐ `a5-suspect-coverage-recomputed-every-recheck` · A5 · med — cache coverage; hoist token frequency
- ☐ `a5-rebuilt-regex-in-overlap-loop-O-n2` · A5 · med — token `Set` membership, not per-word regex
- ☐ `checkcast-recomputed-multiple-times` · A2 · med — compute once; thread the result
- ☐ `enforce-victim-redundant-name-scans` · A2 · med — one `Map<lowerName,char>` + culprit `Set`
- ☐ `a5-reconcile-audit-runs-three-expensive-scans` · A5 · low — skip the redundant recheck
- ☐ `infer-gender-sets-rebuilt-per-call` · A2 · med — hoist name Sets to module scope
- ☐ `cast-names-stringified-repeatedly` · A2 · low — one lowercased `Set`; `.has`
- ☐ `subagent-prompt-ships-full-artifacts` · A2 · low — slim per-sub-agent projections
- ☐ `agent2c-cost-summary-rescan-in-loop` · A2 · low — targeted cost accessor; reuse distinctness
- ☐ `seed-loader-recompute-per-generate-call` · A3 · low — memoize seed load by `(dir, axis)`
- ☐ `revalidate-whole-doc-per-patch` · A4 · low — reuse `afterErrors`
- ☐ `backstop-and-parity-bridge-recompute-clue-scans` · A6 · low — `Map<step,clue[]>` index + dirty flag
- ☐ `outline-coverage-evaluated-thrice` · A7 · low — compute once after last patch
- ☐ `scheduler-grid-rebuilt-twice-per-run` · A7 · low — build grid once; pass to both
- ☐ `clue-preassign-recounts-scenes-in-loop` · A7 · low — incremental counts; sorted `emptyRefs`
- ☐ `seed-corpus-loaded-and-summarized-per-run` · A8 · low — memoize at module scope
- ☐ `O(n*m)-similarity-scan-uncached` · A8 · low — build corpus once/run; index if scaled
- ☐ `developer-prompt-schema+constraints-bloat` · A1 · low — raw constraint string; trim schema to key list

### Phase 11 — Robustness & polish (remaining low items) `(20 items · 0 high)` ✅ COMPLETE (backslash item already-fixed)
**Goal:** clear the backlog. **Approach:** independent small fixes; can be parallelised.
- ☐ `variation-seed-int-min-negative-index` · A1 · med — mask to unsigned (`>>> 0`)
- ☐ `era-constraints-silent-default-1930s` · A1 · med — warn + nearest-decade resolution
- ☐ `variation-seed-ignores-projectid-when-runid-present` · A1 · low — compose seed from multiple inputs
- ☐ `untethered-victim-no-culprit-silent` · A2 · med — warn; promote an eligible suspect
- ☐ `nonbinary-gender-contradiction` · A2 · med — single shared gender vocabulary
- ☐ `culprit-count-not-enforced-final` · A2 · low — top up to `min(3,count-1)` + warn
- ☐ `selection-tie-break-ignores-plausibility` · A3 · med — tie-break by quality signal
- ☐ `plausibility-regen-reuses-stale-theme-families` · A3 · med — one canonical family list on ctx
- ☐ `identity-family-collides-with-identity-axis` · A3 · low — rename family to `impersonation`; drop `twin`
- ☐ `normalizedevice-lockedfact-id-collision` · A3 · low — `fact_${index}_${fIdx}`
- ☐ `degrade-seed-double-normalize-mutation` · A4 · low — normalize once, reuse
- ☐ `validateContract-dup-error-false-pass` · A4 · low — compare multisets / node path
- ☐ `categorize-typeerror-catchall-mislabels` · A4 · low — key off error codes, specific-first
- ☐ `parse-error-feedback-bloats-prompt` · A4 · low — single replaced note, not accumulated
- ☐ `patch-context-truncation-mid-json` · A4 · low — select sub-nodes; truncate at boundaries
- ☐ `a5-getclueattemptnumber-fifo-eviction` · A5 · low — remove fallback map or LRU
- ☐ `genre-structure-cml-string-vs-object` · A6 · low — normalize `ctx.cml` to object at entry
- ☐ `backslash-in-avoidance-label` · A8 · low — fix `\subtype` → `/subtype` + test
- ☐ `spike-reads-uncompiled-dist` · A8 · low — point spike at TS source / add prespike build
- ☐ `prior-run-store-unbounded-vs-ledger-cap` · A8 · low — `maxEntries` ctor + slice

> Maintenance: flip `☐`→`◐`→`✅` as items land; update the **Progress** line and each phase's count. When a fix is verified by a live run, note the run id next to the item. Items that turn out obsolete on closer inspection → `⊘` with a one-line why.

---

## 0. Executive summary

**The pipeline works, but it is brittle in five systematic ways, and two of them violate the "no story-specific logic" principle outright.** The same handful of root patterns recur in almost every agent; fixing the *patterns* (not the 96 instances) is the high-leverage move.

### The five cross-cutting patterns (ranked by leverage)

| # | Pattern | Where it recurs | Why it matters |
|:--:|---|---|---|
| **A** | **Hard-abort where a deterministic repair from the artifact's own data exists** (violates the project rule "every violation → warning → deterministic repair, never a throw") | A1 (×2), A2 (×2), A3 (×1), A4 (×2), A5 (×5), A6 (×2), A65 (×2) | The dominant cause of whole-run failures. Each is a one-field repair away from shipping. This is *the* reliability lever. |
| **B** | **Story-specific content baked into LOGIC** (not config) | **A4** (normalizer fallback steps + scalar defaults), **A7** (discriminating-test patch hardcodes a clock + two suspects) | Directly breaks the holistic principle: injects a *wrong* plot into an unrelated mystery that then passes validation as canon. |
| **C** | **Cumulative-vs-per-call cost double-counting** → the $0.15 retry budget trips early and *itself* throws | **A6** (×2: blind-reader, fair-play), **A3** (collision-retry) | A cost-accounting bug that manufactures a *second* spurious abort path. High-confidence, mechanical fix. |
| **D** | **Substring name/role matching** (`String.includes`) → false positives on real casts | A2 (detective archetype), A3 (victim role), A5 (×2), A6 (elimination/culprit) | "Ann" matches "Joanna"; "inspector" matches "building inspector". Silently mis-binds clues, mislabels detective/victim, masks elimination gaps. A reusable word-boundary helper already exists in `agent6-reveal-gate.ts` (`namesMatch`) and is simply not adopted. |
| **E** | **Deterministic mutation shipped without re-validation / dark levers off with no safe enable path** | A3 (grounding not re-run after patch), A4 (evidence synth), A7 (grid clue-job overwrite + scheduler-authority lever), A8 (novelty audit toothless + deterministic judge unwired) | The A_52 §6 "mutation re-validation" class, plus genuinely useful levers trapped off. |

### Top-priority fix queue (high severity × principle impact)

1. **A7 `disc-test-patch-hardcoded-clock-mechanism`** (HIGH, hardcoding) — the outline patch literally writes a clock + two ruled-out suspects into any mystery. Principle violation **and** corrupts non-clock cases.
2. **A4 `normalizer-hardcoded-story-fallbacks`** (MED→treat as HIGH, hardcoding) — fallback inference steps inject a teacup/corridor/pawn-ticket *poisoning* plot, `era→"1930s"`, `subtype→"poisoning"`, `motive→"inheritance"` into any CML that loses its steps.
3. **A2 `diversity-undefined-crash`** (HIGH, bug) — unguarded `diversity.stereotypeCheck.length` raw-TypeErrors before the schema-repair seam can run.
4. **A6 cost double-counts** (`blind-reader-cost-double-count`, `fairplay-audit-cost-double-count`) + **A3 `collision-retry-cost-double-count`** (pattern C) — fix the cumulative-vs-delta accounting once.
5. **A5 four hard-abort gates** (`discrim-timing`, `mechanism-visibility`, `meta-audit`, `step-coverage-floor`) + **A6 `blind-reader-gate-throws-on-fair-mystery`** + **A1/A2/A3 throws** (pattern A) — convert to repair-not-abort.
6. **A8 `audit-runs-but-is-toothless-warning-only`** + `expensive-post-CML-LLM-audit-runs-every-run` — the novelty audit *does* fire (the "dark code" premise was stale) but can't block a clone by default while paying full LLM cost every run.
7. **D — adopt the word-boundary `namesMatch` helper** everywhere `String.includes` is used on names/roles.

---

## 1. Agent 1 — SettingRefiner

Files: `apps/worker/src/jobs/agents/agent1-run.ts`, `packages/prompts-llm/src/agent1-setting.ts`, `packages/prompts-llm/src/shared/constraints.ts`.
Note: Agent 1 **not** receiving `theme` is intended/correct (a setting refiner should be theme-agnostic) — not a defect.

| id | type · sev · conf | location | finding → holistic fix |
|---|---|---|---|
| `realism-hard-abort-should-repair` | bug · **high** · high | agent1-run.ts:84 `throw new Error("Setting refinement still contains realism issues")` | A usable setting with one residual anachronism note kills the whole run. → Move `realism.anachronisms`/`implausibilities` entries into `realism.recommendations`, clear the arrays, warn, continue. |
| `schema-validation-hard-abort` | bug · **high** · high | agent1-run.ts:91/108 `throw ... "failed schema validation"` | Schema fail aborts after one LLM re-roll; most failures are locally repairable. → Deterministic field backfill from `ctx.inputs`/`ctx.locationSpec` + re-validate before any throw. |
| `variation-seed-int-min-negative-index` | bug · med · high | agent1-setting.ts:84-87 `nameStyle: ((hash >> 4) % 5) + 1` | `Math.abs(INT_MIN)` overflows int32; `>>` re-signs it → `nameStyle:-2`, `focusArea:-1` rendered into the prompt. → Mask to unsigned (`>>> 0`) before slicing; same pattern in agent2-cast.ts. |
| `era-constraints-silent-default-1930s` | improvement · med · high | shared/constraints.ts:70 `return LEGACY_ERA_CONSTRAINTS[decade] \|\| LEGACY_ERA_CONSTRAINTS["1930s"]` | An unrecognised decade silently gets 1930s facts while the prompt says the real decade — silent period mismatch. → Warn + resolve to nearest seeded decade (the KB path already does this but is flag-off). |
| `variation-seed-ignores-projectid-when-runid-present` | improvement · low · med | agent1-setting.ts:114 `generateVariationSeed(inputs.runId \|\| inputs.projectId \|\| "")` | Reused/empty `runId` collapses all variation to a constant; empty → `{1,1,1}`. → Compose the seed from `runId`+`projectId`+`decade`+`location`. |
| `schema-failure-full-llm-reroll-not-repair` | efficiency · **high** · high | agent1-run.ts:95 `await refineSetting(... , 2)` | Schema fail pays 1–2 *full* regenerations for what a deterministic backfill fixes free, on the critical path. → Repair-then-revalidate before any LLM re-roll. |
| `realism-violation-reroll-vs-repair` | efficiency · med · high | agent1-setting.ts:283 `if (attempt < resolvedMaxAttempts) { continue; }` | Internal loop re-calls the model on scrubbable realism notes. → Fold notes into `recommendations` deterministically; reserve re-rolls for parse/structural failure. |
| `developer-prompt-schema+constraints-bloat` | efficiency · low · med | agent1-setting.ts:126/131-160 `JSON.stringify(eraConstraints, null, 2)` + full literal schema | Pretty-printed constraints (already a string) + a 30-line literal schema shipped every call though `jsonMode` is on. → Pass raw constraint string; trim schema to a key list. (Prompt is built once and KB is cached — those are clean.) |

---

## 2. Agent 2 — CastDesigner + role model + sub-agents (2b/2c/2d/2e)

Files: `agent2-run.ts`, `agent2b/2c/2d/2e-run.ts`, `packages/prompts-llm/src/agent2-cast.ts`, `agent2-cast-checker.ts`, `agent2d-temporal-context.ts`.
No story-specific hardcoding in logic (naming pools / archetype menus / name-gender list are config/data).

| id | type · sev · conf | location | finding → holistic fix |
|---|---|---|---|
| `diversity-undefined-crash` | bug · **high** · high | agent2-run.ts:603 `if (cast.cast.diversity.stereotypeCheck.length > 0)` | If the LLM omits `diversity`, a raw TypeError kills the run *before* the schema-repair retry seam. → Default `diversity = {stereotypeCheck:[],recommendations:[]}` in `normaliseCastOutput`; optional-chain the access. |
| `role-diversity-hard-abort` | bug · **high** · high | agent2-cast.ts:789 `throw ... "Cast role diversity guardrail failed after fallback"` | The default path throws when archetype diversity can't recover; the constrained path correctly warns. → Accept-with-warning on the final attempt (mirror the constrained path). |
| `agent2d-season-month-inconsistency` | bug · med · high | agent2d-temporal-context.ts:150 (`season` free-choice) vs 221-223 (mandated month) | LLM can ship `month:"December"` + `season:"fall"`; Agent 9 locks season from the *month* → self-inconsistent artifact; scorer never checks month-vs-season; vocab split ("fall" vs "autumn"). → Derive `season` from the month via the shared `monthToSeason`; align vocabulary to "autumn". |
| `detective-archetype-false-positive` | bug · med · med | agent2-run.ts:151/393 `/detective\|investigator\|inspector\|sleuth/.test(...)` | "building inspector"/"insurance investigator" suspects get resolved as THE detective when the regex is the fallback. → Word-boundary + detective-context phrases; prefer explicit `role`/`detectiveCandidates`; on 0-or-many matches, fall back deterministically + warn. |
| `untethered-victim-no-culprit-silent` | improvement · med · high | agent2-run.ts:475 `if (!tiedToCulprit && culprits.length > 0)` | When `possibleCulprits` is empty the victim ships with no motive anchor and **no warning** (checker also silent). → Warn; deterministically promote an eligible non-victim/non-detective suspect so an anchor always exists. |
| `nonbinary-gender-contradiction` | improvement · med · med | agent2-cast.ts:264/426 (`male\|female only`) vs normalizer/checker accept `non-binary` | Prompt forbids non-binary while schema/normalizer/checker accept it and `characterGenders` can't express it → mis-gendering risk. → Single shared gender vocabulary across prompt, schema, normalizer, checker, lock. |
| `agent2-run-stereotype-hard-gate` | improvement · low · high | agent2-run.ts:603 `throw ... "failed stereotype guardrails"` | The hard throw the deterministic checker was written to *replace* is still live; punishes honest self-reporting. → Demote to warning + bounded regenerate. |
| `agent2d-validation-warns-not-errors` | improvement · low · high | agent2d-run.ts:72-77 | Schema-invalid temporal artifact is logged as a "warning" and shipped unchanged into the season lock. → Deterministically re-pin `month`/`year`/`season` before shipping; record real errors as errors. |
| `culprit-count-not-enforced-final` | improvement · low · med | agent2-cast.ts:733-740 | `possibleCulprits` minimum is retried but never enforced on the final attempt → under-filled suspect pool can ship. → Top up to `min(3,count-1)` from the cast's own names + warn. |
| `cast-schema-repair-full-regen` | efficiency · **high** · high | agent2-run.ts:626 `await designCast(... schemaRepairGuardrails ...)` | A cosmetic schema near-miss fires a whole second `designCast` (itself ≤3 internal attempts) → doubles ~6k-token spend + latency. → Deterministic `checkCast`+coercion first; re-call only for specific residual schema errors; full regen only for structural failure. |
| `subagents-serial-llm-calls` | efficiency · **high** · med | agent2b:33 / 2c:121 / 2d:27 / 2e:39 (four serial LLM calls) | 2d's load-bearing month/season are deterministically derivable (`deriveTemporalAnchor`); 2e's non-`backdropSummary` fields are pure (`deriveBackgroundContext` shadow proves it); 2b/2c are independent. → Derive 2d's date/season (ask LLM only for texture or skip); replace 2e's derivable fields; run 2b/2c concurrently. |
| `infer-gender-sets-rebuilt-per-call` | efficiency · med · high | agent2-run.ts:90/96 `new Set([...32 names])` per call inside `forEach` | Two ~30-element Sets rebuilt per gender-less character, ×retry path. → Hoist `FEMALE_NAMES`/`MALE_NAMES` + suffix regex to module scope. |
| `checkcast-recomputed-multiple-times` | efficiency · med · high | agent2-run.ts:562/666, agent2-cast.ts:757 | Full `checkCast` (archetype maps + relationship-graph walk) run 2–3× over the same cast. → Compute once; thread the `CastCheckResult` to scorer, shadow logger, diversity diag. |
| `enforce-victim-redundant-name-scans` | efficiency · med · med | agent2-run.ts:407-423/469 | Many chained `.find`/`.filter` re-lowercase the cast; motive-anchor is O(pairs×culprits). → Build one `Map<lowerName,char>` + culprit `Set` up front; single-pass membership. |
| `agent2c-cost-summary-rescan-in-loop` | efficiency · low · med | agent2c-run.ts:270/287 | Full `getCostTracker().getSummary()` aggregation twice per regen + distinctness re-scans. → Targeted per-agent cost accessor; reuse the final iteration's distinctness results. |
| `subagent-prompt-ships-full-artifacts` | efficiency · low · med | agent2b:34 / 2c:122 / 2e:39 | Sub-agents serialize the entire cast (incl. secrets they're about to rewrite) + full CML/setting → token bloat scaling with cast size. → Pass slim per-sub-agent projections (the `castAnchors`/`deriveBackgroundContext` shape). |
| `cast-names-stringified-repeatedly` | efficiency · low · high | agent2-run.ts:253-296 (`castNames.includes(...)` in loops) | `castNames` re-mapped + O(pairs×cast) `Array.includes` in the relationship-merge. → One lowercased `Set`; `.has` membership; compute `castNames` once. |

---

## 3. Agent 3 — CMLGenerator + Agent 3b HardLogicDeviceGenerator

Files: `agent3-run.ts`, `agent3b-run.ts`, `packages/prompts-llm/src/agent3-cml.ts`, `agent3b-hard-logic-devices.ts`.
The theme→family *plumbing* is correctly general; the brittleness is the fixed keyword *menu* (finding 1). No hardcoded story values in logic.

| id | type · sev · conf | location | finding → holistic fix |
|---|---|---|---|
| `mechanism-family-extractor-misses-most-themes` | improvement · **high** · high | agent3b-hard-logic-devices.ts:64-92 `MECHANISM_FAMILY_KEYWORDS` (8 entries) | Any theme outside the 8 families → `extractThemeMechanismFamilies()===[]` → the whole theme-lock subsystem silently no-ops, the plausibility regen can swap the primary device family. → Drive family extraction from the generated devices' own hint/title tokens ∩ theme tokens (data-driven), with a generic theme-noun-overlap fallback so the lock degrades gracefully. |
| `cml-min-steps-hard-throw` | bug · **high** · high | agent3-cml.ts:891 `throw ... "minimum 3 required"` (inside `normalizeCml`, runs every attempt) | A 0–2-step inference path hard-aborts where everything else degrades; Agent 4 never sees the artifact. → Warn + synthesize missing steps from `constraint_space`/cast/mechanism, pad to the floor, continue to validate. |
| `collision-retry-cost-double-count` | bug · med · high | agent3-run.ts:207 `= (prev ?? 0) + retryResult.cost` | `.cost` is cumulative, so collision-retry double-counts the first generation (novelty-retry at :348 does it right with `=`). → Assign, don't accumulate (or use byAgent before/after deltas). |
| `lockedfact-digit-form-not-repaired` | bug · med · high | agent3b-run.ts:257 / orchestrator:1117 `if (fact.value && !narrJson.includes(fact.value))` | A digit/metric value (`"10:50 PM"`, `"4 metres"`) becomes enforced ground truth; the substring gate never matches era-word prose → permanent warn + Agent 9 told to inject era-violating values. → Detect/repair non-word-form values at registry build (parameter-driven on decade). |
| `grounding-mutation-after-validation` | bug · med · med | agent3-cml.ts:928 grounding inside `normalizeCml` only | Patch/rewrite paths can return a CML whose `discriminating_test`/`inference_path` were re-mutated but never re-grounded. → Hoist `groundDiscriminatingKnowledgeRevealed`+`repairInferenceRequiredEvidence` into one post-mutation normalize that runs after *any* mutation, then validate once. |
| `inference-required-evidence-not-repaired-on-valid-path` | bug · med · med | agent3-run.ts:52 `if (cmlResult.validation.valid) return cmlResult;` | A schema-*valid* CML can ship steps with `required_evidence:[]` (Agent 5 depends on it) → silent data loss. → Run `repairInferenceRequiredEvidence` unconditionally; only the re-validate needs the validity gate. |
| `selection-tie-break-ignores-plausibility` | improvement · med · med | agent3b-hard-logic-devices.ts:124 `if (score > bestScore)` | Equal-theme-score devices tie-break by array position → can lock onto the weakest on-theme device. → Tie-break by a quality signal (clue richness, lockedFacts, valid `principleType`). |
| `plausibility-regen-reuses-stale-theme-families` | improvement · med · med | agent3b-run.ts:235 + generator 419 | `matchedThemePrimary` computed from the *initial* directives' abstract families that the keyword map can't see → the "never trade theme for plausibility" guard silently doesn't engage; recomputed 3 places with different inputs. → Compute locked families once upstream, store on ctx, pass one canonical list everywhere. |
| `victim-culprit-check-substring-false-positive` | bug · low · med | agent3-run.ts:129 `ra.includes('victim')` | "victim's confidant"/"victim advocate" → false collision → wasted full-CML regen or hard throw. → Word-boundary/exact match against the controlled `role_archetype` vocabulary (pattern D). |
| `identity-family-collides-with-identity-axis` | improvement · low · med | agent3b-hard-logic-devices.ts:72 `identity:[...]` vs axis "identity" | Two unrelated "identity" meanings; `twin` keyword locks onto a trope the prompt bans. → Rename the family to `impersonation`; drop/qualify `twin`. |
| `normalizedevice-lockedfact-id-collision` | bug · low · med | agent3b-hard-logic-devices.ts:185 `id: asString(f?.id, \`fact_${index}\`)` (device index) | Two id-less facts in one device both become `fact_0` → id-keyed consumers collapse them. → Include the fact's own index: `fact_${index}_${fIdx}`. |
| `seed-loader-recompute-per-generate-call` | efficiency · low · med | agent3-cml.ts:65-77 (loads+parses seed library every `generateCML`) | Seed library re-read/parsed up to 3×/run (initial + collision + novelty retries). → Memoize load+extract keyed by `(examplesDir, primaryAxis)`. |

---

## 4. Agent 4 — Revision

Files: `agent4-run.ts`, `packages/prompts-llm/src/agent4-revision.ts`, `agent4-patch.ts`, `scripts/agent4-patch-shadow.mjs`.
The **patch** engine terminates soundly (skip-set + budget). Convergence risk is concentrated in the legacy **rewrite** loop.

| id | type · sev · conf | location | finding → holistic fix |
|---|---|---|---|
| `revise-loop-no-convergence-guard` | bug · **high** · high | agent4-revision.ts:1075 (rewrite loop, no progress check) | Burns all 3 LLM calls even when error count never drops (or grows). → Track `noProgressStreak`; break to degrade once a pass doesn't reduce errors. |
| `full-rewrite-resends-entire-cml-each-pass` | efficiency · **high** · high | agent4-revision.ts:1077/333 (whole CML, 8000-token output, ×3) | Re-emits the entire document to fix one field; the node-scoped `patch` engine exists but is gated behind `CML_REPAIR_MODE=patch` (default `rewrite`). → Make `patch` the default; rewrite only for residual classes patch can't address. |
| `normalizer-hardcoded-story-fallbacks` | **bug (hardcoding)** · med→**treat high** · high | agent4-revision.ts:543-559/439-467 — `"The teacup ring remains on the study desk..."`, `subtype→"poisoning"`, `motive→"inheritance"`, `era→"1930s"` | If a CML loses its steps, a teacup/pawn-ticket *poisoning* plot is injected into an unrelated case and **passes validation as canon**. Direct holistic-principle violation. → Derive fallback step text from the doc's own `constraint_space`/`mechanism`/cast (the `evidenceAnchors` machinery at :575 already exists); use generic `"Observation N"` only when no anchors exist; pull scalar defaults from era/prompt context, not fixed literals. |
| `patch-then-rewrite-double-spend` | efficiency · med · high | agent3-cml.ts:1312-1362 | Patch (≤16 calls) that doesn't fully resolve falls through to a full rewrite (≤3 calls) from the *original* CML, discarding patch progress — ~19 calls worst case. → Feed `patchResult.cml` (partially repaired) into rewrite; or raise patch budget and skip rewrite when most errors cleared. |
| `graceful-degrade-default-off-kills-runs` | improvement · med · high | agent4-revision.ts:1086 `throw ... "CML revision failed after N attempts"` | Default `AGENT4_GRACEFUL_DEGRADE=off` throws on exhaustion, discarding a usable best-so-far candidate. → Default degrade on; return best-so-far `degraded:true`; throw only when no candidate ever parsed. |
| `patch-budget-consumed-by-unfixable-resurfacing` | bug · med · med | agent4-patch.ts:156 | `budgetExhausted` isn't signalled, so >16-error docs silently stop + fall to a full rewrite, wasting the 16 proposer calls. → Return `budgetExhausted`; only fall to rewrite on zero net progress. |
| `no-revalidation-after-grounding-mutation-in-degrade` | improvement · med · high | agent4-revision.ts:782 | The degrade fallback can return the *raw un-normalized* parse with a `validation` describing the *original* CML → mismatch shipped. → Always `normalizeCml`+`validateCml` the fallback before returning. |
| `degrade-seed-double-normalize-mutation` | bug · low · high | agent4-revision.ts:772 `recordCandidate(normalizeCml(original), validateCml(normalizeCml(original)))` | `normalizeCml` mutates in place and is called twice → stored candidate ≠ validated object (latent if it ever becomes non-idempotent). → Normalize once, reuse. |
| `validateContract-dup-error-false-pass` | bug · low · med | agent4-patch.ts:124 (`Set` of error strings) | Duplicate error messages collapse → a regression that duplicates an existing failure passes the contract. → Compare multisets / include node path. |
| `categorize-typeerror-catchall-mislabels` | improvement · low · med | agent4-revision.ts:74 (`else → typeErrors`) | Fair-play/coverage/timing errors land in the prompt's "Type Errors" section; `includes("must be")` mis-catches allowed-value errors. → Key off stable error codes, most-specific-first. |
| `silent-evidence-truncation-and-synthesis` | improvement · low · med | agent4-revision.ts:606-639 | `required_evidence` repair drops/truncates/synthesizes with no warning → unplantable fair-play clues (A_52 §6 class). → Record synth/drops to warnings; synthesize only from real anchors, no free-text template. |
| `parse-error-feedback-bloats-prompt` | improvement · low · high | agent4-revision.ts:1001/1108 | Parse-failure messages are appended to `currentErrors` and accumulate across attempts into the prompt as if schema errors. → Keep a single replaced "last attempt failed because" note, separate from validation errors. |
| `patch-context-truncation-mid-json` | improvement · low · med | agent4-patch.ts:238 `JSON.stringify(...).slice(0,1200)` | Blunt char-slicing produces invalid JSON in the proposer prompt → grounding terms past the cut are invisible → patch rejected, call wasted. → Select relevant sub-nodes; truncate at array boundaries with "(N more omitted)". |
| `revalidate-whole-doc-per-patch` | efficiency · low · med | agent4-patch.ts:196-199 (3 full validations per patch) | `validator(current)` recomputes what `validateContract` already produced as `after`. → Reuse `afterErrors`; ~32 vs ~48 validations for a 16-patch run. |
| `cost-budget-not-enforced` | efficiency · low · high | agent4-revision.ts:378/781 (attempt-count only) | Cost tracker is read for reporting but never *stops* spend. → Thread `maxCostUsd` and break/degrade when exceeded (value is already read). |

---

## 5. Agent 5 — ClueExtraction

Files: `agent5-run.ts`, `packages/prompts-llm/src/agent5-clues.ts`. (Source-path gate already converted to repair-not-abort in A_52 — excluded.)

| id | type · sev · conf | location | finding → holistic fix |
|---|---|---|---|
| `a5-discrim-timing-gate-hard-abort-but-repair-exists` | bug · **high** · high | agent5-run.ts:2768 `throw ... "discriminating test timing gate failed"` | A late-placed evidence clue aborts the run; the fix is `placement="mid"` — the same mechanical repair `applyClueGuardrails` already does. → Repair placement deterministically, rebuild `clueTimeline`, re-check; warn only on a residual non-placement defect. |
| `a5-mechanism-visibility-gate-hard-abort` | bug · **high** · high | agent5-run.ts:2778 `throw ... "mechanism visibility gate failed"` | A late-only mechanism clue aborts where promotion to `mid` repairs it. → Split the two sub-cases; promote the late-only clue; warn (don't throw) on the genuinely-empty case. |
| `a5-meta-audit-gate-false-positive-and-abort` | bug · **high** · high | agent5-run.ts:84-97 patterns + 2762 throw | Broad substrings (`/clue visibility/`, `/no withholding/`, `/information parity/`) match legitimate prose → critical → throw. → Tighten to multi-token audit phrases; on match, deterministically scrub the (non-load-bearing) meta text + warn, don't throw. |
| `a5-direct-culprit-slot-admits-non-culprit` | bug · **high** · high | agent5-run.ts:808-818 donor-rename; exclusivity not enforced | A donor clue naming the culprit *and* another suspect fills the direct-culprit slot; the real exclusivity validator (`findCulpritDiscriminatingGaps`) isn't consulted in the slot builder. → Run the `mentionsNonCulprit && !hasExclusivityLanguage` check in the slot builder; regenerate the canonical exclusive description unconditionally. |
| `a5-step-coverage-floor-requires-contradiction` | bug · **high** · med | agent5-run.ts:534 `requireContradiction:true` for *every* step | A pure-observation step with no contradiction source can't satisfy the blanket floor → abort. → Derive `requireContradiction` per-step from whether `steps[i].correction`/a `time.contradictions` anchor exists; downgrade to warning when none exists. |
| `a5-retry-loops-regenerate-all-clues` | efficiency · med · high | agent5-run.ts retries @3028/3162/3251/3351/3572 | Five separate full-regeneration LLM round-trips, each known-flaky ("retry consistently returns zero clues", comment :2992); dark by default but maintained, expensive when on. → Gate behind "deterministic synth couldn't resolve"; collapse to one consolidated feedback round-trip, or retire. |
| `a5-rebuilt-regex-in-overlap-loop-O-n2` | efficiency · med · high | agent5-run.ts:2039 `new RegExp(\`\\b${word}\\b\`,"i").test(text)` per word×step×rh | Hundreds of regex compilations per overlap recheck, run 3–6×/run. → Precompute a token `Set` per red herring; membership test. |
| `a5-strict-feedback-recomputed-per-attempt` | efficiency · med · high | agent5-run.ts:2653/2655/2725/821/910/2621 | `buildStrictSourcePathWhitelist`/`buildStrictPromptFeedback` rebuilt 5–10× over the immutable CML. → Memoize per case object (WeakMap) for the Agent-5 invocation. |
| `a5-suspect-coverage-recomputed-every-recheck` | efficiency · med · high | agent5-run.ts:1460/1491/2320/3099/3189/3271 | `castTokenFrequency` + full clue×suspect scan rebuilt ~10×/run. → Build `castTokenFrequency` once; cache coverage keyed on clue-list version. |
| `a5-reconcile-audit-runs-three-expensive-scans` | efficiency · low · high | agent5-run.ts:1488 then 1453 | `reconcileModelAudit` then `checkModelAuditConsistency` recompute the identical three derivations back-to-back with no intervening mutation. → Skip the recheck (or return + feed the triple). |
| `a5-fuzzy-coverage-04-threshold-and-evidence-key` | improvement · low · med | agent5-run.ts:1899-1927 | 40% word-overlap can mark an unrelated step "covered"; `elimination` clues flip an unread coverage key → don't count. → Require a step-distinctive token; decide if elimination counts toward coverage. |
| `a5-getclueattemptnumber-fifo-eviction` | bug · low · med | agent5-clues.ts:86-104 (FIFO eviction of oldest, maybe-active run) | Mislabels retry artifact filenames for long-lived runs; effectively dead on the primary path (callers pass `retryAttempt`). → Remove the fallback map or evict by LRU. |
| `a5-namesappearsintext-substring-collision` | bug · low · med | agent5-run.ts:174 (unordered all-tokens) | "Mary"+"Vane" in different sentences matches "Mary Vane"; two incidental name-token matches make `mentionedNames.length===2` → the mis-binding check is skipped. → Ordered-phrase / unique-surname match; trigger on `>=1 && !includes(expected)` (pattern D). |

---

## 6. Agent 6 — FairPlayAuditor + BlindReader, and Agent 6.5 — WorldBuilder

Files: `agent6-run.ts`, `agent6-escalation-policy.ts`, `agent6-reveal-gate.ts`, `agent65-run.ts`, `packages/prompts-llm/src/agent6-fairplay.ts`, `agent65-world-builder.ts`. No story hardcoding in logic (literals are last-resort fallbacks, not branch conditions).

| id | type · sev · conf | location | finding → holistic fix |
|---|---|---|---|
| `blind-reader-gate-throws-on-fair-mystery` | bug · **high** · high | agent6-run.ts:1737 `throw ... "blind-reader gate failed"` | A single stochastic LLM sample (temp 0.2) is treated as a deterministic verdict and throws — the variance harness was built to indict exactly this. A fair mystery that reads "uncertain" once aborts ~30 agents of work. → Demote to a non-fatal annotator (or majority-of-k); move correctness to deterministic `proveSolvability`; gate any throw behind a default-false flag. |
| `blind-reader-cost-double-count` | bug · med · high | agent6-run.ts:1685 `= (... \|\| 0) + latestBlind.cost` | `.cost` is the cumulative run-total; the remediation loop adds it each cycle → quadratic inflation, and the inflated value feeds `retryBudget.consume` → the $0.15 budget throws on a cheap run. → Use a per-call delta (snapshot byAgent before/after); overwrite like the reveal-gate path. |
| `fairplay-audit-cost-double-count` | bug · med · high | agent6-run.ts:1447/1450 `+= fairPlayAudit.cost` | Same cumulative defect for the auditor across 6 accumulation sites → budget sees ~10× spend → premature throw. → Same per-call-delta fix (highest-leverage cost-budget correctness fix). |
| `elimination-clue-detection-substring-false-positive` | bug · med · med | agent6-run.ts:766 `desc.includes(nameLower)` | "Ann" matches "Joanna" → mis-credits elimination / false culprit-naming; `agent6-reveal-gate.ts`'s `namesMatch` already solves this and isn't reused. → Adopt `namesMatch` for elimination + culprit-pointing checks (pattern D). |
| `max-remediation-cycles-config-mismatch` | bug · med · high | generation-params.ts:471 (`2`) vs generation-params.yaml:125 (`1`) | If the YAML fails to load, Agent 6 silently runs *double* remediation (clue-regen+audit+blind each) → 2× worst-case spend. → YAML as single source of truth + a unit test asserting `DEFAULT_CONFIG` equals the parsed YAML. |
| `blind-reader-single-sample-gates` | efficiency · med · high | agent6-run.ts:1585 + reveal-gate 2207 | Gates on 1 stochastic sample; remediation + reveal-gate fire 2–4 blind calls + 2–5 audits/run for a verdict that flips. → Majority-of-k at temp 0, or replace with `proveSolvability` and keep blind purely advisory. |
| `ships-whole-cml-and-full-clue-prose-to-every-audit` | efficiency · med · med | agent6-fairplay.ts:402-533; agent65-world-builder.ts:281-302 | Full surface+hidden model+every clue's prose+cast block re-sent on 4–6 audit calls; WorldBuilder JSON-stringifies the entire CASE + all profiles + clue distribution at 6000 tokens ×3. → In narrative-only mode drop the sections the prompt says not to re-derive; pass clue summaries (id, placement, one-line). |
| `reveal-gate-enforce-only-downgrades-pass-not-fail` | improvement · med · med | agent6-run.ts:2239 | Reveal-gate only flips `pass→needs-revision`; with binding gates off, a real reveal break is only a warning. → A dedicated `revealGateBlocking` boolean independent of prior status/flag. |
| `agent65-3-attempt-loop-can-hard-throw` | improvement · med · med | agent65-world-builder.ts:1079/904-924 (cast name-order gate) | Cast portraits in a different order across all 3 attempts kill the run over a cosmetic ordering issue. → Deterministically reorder portraits/sketches to match `CASE.cast` before the order gate. |
| `structural-audit-elimination-all-or-nothing` | improvement · low · high | agent6-run.ts:786 `eliminationPresent.length === 0` | If *one* non-culprit has an elimination clue, the other N uneliminated suspects pass silently. → Parameterise a min-eliminated-fraction; always surface `eliminationMissing` names. |
| `backstop-and-parity-bridge-recompute-clue-scans` | efficiency · low · med | agent6-run.ts:991-1096/826-956 | O(steps×clues) scans + full coverage recompute run 5–8×/run on incrementally-changed data. → `Map<stepNumber,clue[]>` index per mutation; dirty-flag the snapshot recompute. |
| `agent65-score-failure-aborts-via-shared-retry` | improvement · low · med | agent65-run.ts:22-66 → shared.ts:572 | A sub-threshold *creative texture* score aborts the whole pipeline. → Mark Agent 65 non-abort-critical; degrade to warning + best-effort doc. |
| `genre-structure-cml-string-vs-object` | improvement · low · low | agent6-run.ts:1928 / 687 | If `ctx.cml` is ever a string at audit time, the case-block accessor treats the raw string as the case → audit vacuously "passes". → Normalise `ctx.cml` to a parsed object once at agent entry; drop the scattered dual-handling. |
| `reveal-gate-death-method-token-prefix-false-positive` | improvement · low · low | agent6-reveal-gate.ts:171 `tokens.some(t => text.includes(t))` | Fallback token "fall" matches "befall"/"fallen leaves" → false "manner-of-death deducible". → Word-boundary match for the literal-word fallback (matches the stated intent). |

---

## 7. Agent 7 — Narrative outline / Beat Scheduler

Files: `agent7-run.ts`, `packages/beat-scheduler/src/*`, `packages/story-validation/src/scene-job-authority.ts`, `timeline-validator.ts`, `narrative-continuity-validator.ts`, `temporal-consistency.ts`. (Mechanism-gate decoupling and "May I?" already fixed — excluded.)

| id | type · sev · conf | location | finding → holistic fix |
|---|---|---|---|
| `disc-test-patch-hardcoded-clock-mechanism` | **bug (hardcoding)** · **high** · high | agent7-run.ts:1644-1647 `"...timing constraints prove that two suspects are ruled out because the clock mechanism..."` | The deterministic outline patch splices a clock + exactly two ruled-out suspects into ANY mystery missing a discriminating-test scene → a false plot beat Agent 9 honors. Sibling suspect-closure patch at :1661 same. → Derive patch text from `discriminating_test.method/design` + actual non-culprit count, or inject only generic vocabulary tokens; parameterise on `culpability.culprits.length`. |
| `grid-cluejob-positional-misalignment` | bug · **high** · high | agent7-run.ts:136 / scene-job-authority.ts:43 (`scenes[i] ← slots[i]`) | The clue-job stamp aligns grid slot `i` to outline scene `i` by raw index; when act boundaries differ (allowed within tolerance), an Act-1 clue lands in Act-2 — corrupting placement the grid *proved* correct, with no re-validation. → Align by `(act, actSceneNumber)`; fall back to the LLM distribution when per-act counts differ. |
| `gridcluejob-empties-noncovered-scenes` | bug · **high** · high | scene-job-authority.ts:43-59 (sets `cluesRevealed=[]` for empty slots) | ~40% of slots are intentionally empty → those scenes' LLM-assigned clues are **deleted**; no clue-coverage re-run after. A clue can end anchored in zero scenes. → Make the stamp additive (union + global dedup; only remove if revealed elsewhere); re-run the coverage gate after stamping. |
| `missing-bridge-false-positive-body-discovery` | bug · **high** · high | narrative-continuity-validator.ts:9-11 `DEATH_TERMS=/...\|body\|corpse.../` | "They found her **body** at the foot of the cliff" trips `DEATH_TERMS` but misses the tightly-templated `BRIDGE_TERMS` → a legitimately-bridged discovery is flagged `missing_case_transition_bridge` → "critical continuity issue" release-gate reason (this is the warning seen on run mystery-1782647685448). → Add discovery-of-body collocations to `BRIDGE_TERMS` (`found … body/corpse`, `body/corpse was found/discovered/recovered`), or require a killing verb rather than the static nouns. |
| `scheduler-authority-dark-no-safe-enable-path` | improvement · **high** · high | agent7-run.ts:47/96-154 | The two real wins (pacing-shaped word budgets + once-per-clue placement) are trapped off because the clue-job half is unsafe (misalign + destructive overwrite). → Split the lever: ship the non-destructive word-budget stamp now; fix + make additive the clue-job half, then enable (same decoupling pattern as the mechanism gate). |
| `timeline-validator-no-day-tracking` | bug · med · high | timeline-validator.ts:84 `if (diff < -60 && diff > -720)` | No day boundary: a legitimate "9 p.m. → 2 p.m. next day" (diff −420) is flagged as time-going-backwards. → Track day-advancing cues and reset the baseline across a day boundary; flag only same-day backward jumps. |
| `mar-abbrev-collides-with-ambiguous-march` | bug · med · med | temporal-consistency.ts:18-31/96 `mar:'march' → /\bmar\.?\b/i` | The `mar` abbreviation re-introduces the bare-word false positive the ambiguous-month guard (A_52) closed: "would **mar** the autumn season" → march/spring vs autumn. → Skip bare-abbrev patterns whose expansion is in `AMBIGUOUS_MONTHS`, or require a trailing period/context for `mar`. |
| `false-solution-empty-object-truthy` | bug · low · high | beat-scheduler/collect.ts:107 `Boolean(false_solution && typeof === "object")` | A stub `false_solution:{}` becomes a real beat the scheduler must place → tightens feasibility on small grids. → Require a meaningful field (`accused_suspect` or non-empty keys). |
| `gapfill-stride-skips-mid-gap-scenes` | bug · low · med | agent7-run.ts:598 `for (pos=start+2; pos<=end; pos+=3)` | Best-effort stride doesn't *guarantee* ≤2 consecutive clueless scenes (unlike the scheduler's `liftCoverage`). → Fill from `start`, verify no run >2, advance on fill failure. |
| `outline-coverage-evaluated-thrice` | efficiency · low · high | agent7-run.ts:1245/1636/1695 | `evaluateOutlineCoverage` (4 whole-corpus regex scans) recomputed up to 4×/run. → Compute once after the last mutating patch; reuse. |
| `scheduler-grid-rebuilt-twice-per-run` | efficiency · low · high | agent7-run.ts:74 + 136 | `buildSceneGrid`+`collectObligations` built twice when shadow+authority both on. → Build once; pass to both. |
| `clue-preassign-recounts-scenes-in-loop` | efficiency · low · med | agent7-run.ts:607-627/505 | Threshold-fill recomputes per-act totals + full `countClueScenes` every assignment (O(n²) over ~0.6N). → Maintain counts incrementally; sorted/heap `emptyRefs`. |

---

## 8. Agent 8 — Novelty

Files: `scripts/agent8-novelty-spike.mjs`, `packages/novelty/src/*` + data, `apps/worker/src/jobs/novelty-ledger.ts`, `packages/prompts-llm/src/agent8-novelty.ts`, wiring in `mystery-orchestrator.ts`/`agent3-run.ts`/`apps/api/src/server.ts`, `apps/worker/config/generation-params.yaml`.

**KEY-QUESTION CORRECTION:** the "novelty audit is dark code (1.1 ≥ 1 → never fires)" premise is **stale for live operation.** The live skip reads `NOVELTY_SIMILARITY_THRESHOLD || 0.9` (server.ts:716 → agent3-run.ts:288), the YAML `1.1` is clamped to `1.0` at load and replaced by `0.9` in the prompt builder — so `shouldSkipNovelty` is **false by default and the LLM audit runs every run.** The real defects are that it's **non-blocking by default** and **pays full LLM cost** while the strong deterministic judge sits unwired.

| id | type · sev · conf | location | finding → holistic fix |
|---|---|---|---|
| `novelty-audit-is-NOT-disabled-live` | bug (stale premise) · **high** · high | server.ts:716 / agent3-run.ts:285-292 | The spike/README "never runs" claim reads raw YAML the live path doesn't use; the audit fires every run. Two divergent threshold defaults invite future drift. → Read one resolved threshold from `getGenerationParams()` (already clamped [0,1]); add a test asserting the default `shouldSkipNovelty`. |
| `audit-runs-but-is-toothless-warning-only` | bug · **high** · high | agent3-run.ts:372-381 + orchestrator:828-843 | A `fail` verdict is downgraded to a warning unless `NOVELTY_HARD_FAIL` **and** `enableBindingGates` **and** `!forceWarnings` — all default permissive → a confirmed clone ships. → A single `NOVELTY_MODE = off\|shadow\|active` instead of three permissive flags. |
| `expensive-post-CML-LLM-audit-runs-every-run` | efficiency · **high** · high | agent3-run.ts:294-311 (`auditNovelty`, 2500 tok, all 14 seeds; +full CML regen on fail) | An always-on LLM audit (+ possible 8000-token regen) for a result that's non-blocking by default → spend with no enforcement payoff. → Gate the LLM leg behind the free deterministic `judgeNovelty`; only spend on `variation`/`clone` near-neighbours. |
| `cross-run-novelty-off-by-default` | improvement · med · high | novelty-ledger.ts:50-52 (`NOVELTY_CROSS_RUN` default off) | No prior-run divergence pressure → the documented "premise frozen / mode collapse" (every run diverges only from the static seed corpus). → Default to on (or `shadow`: record+warn); keep a kill-switch for reproducible eval. |
| `live-LLM-auditor-and-deterministic-package-disconnected` | improvement · med · high | novelty/src/index.ts:12 ("NOT wired") vs agent8-novelty.ts | The cheap deterministic `judgeNovelty` (14/14 seed clones from a skeleton) runs nowhere; the expensive LLM auditor the redesign calls obsolete is the one that runs. → Wire `judgeNovelty` as a pre-CML gate; run the LLM auditor only on near-neighbours. |
| `seed-cliche-fingerprint-duplicates` | bug · med · high | data/cliche-ledger.yaml vs seed-fingerprints.yaml (exact-field dupes) | `spare_key_relock`≡`the_second_key` etc.; tie-break by `id.localeCompare` → non-deterministic corpus labelling; README admits 4/8 "clichés" are seeds. → De-dup across corpora at load (warn on collision); tie-break prefer the more-specific corpus. |
| `backslash-in-avoidance-label` | bug · low · high | shared.ts:750 `` `Crime method\subtype: ...` `` | `\s` drops → "Crime methodsubtype:" garbles the Agent 3 prompt. → Fix to `/subtype`; add a no-stray-backslash test. |
| `spike-reads-uncompiled-dist` | bug · low · high | agent8-novelty-spike.mjs:22 imports `../packages/novelty/dist/index.js` (gitignored) | Spike throws `ERR_MODULE_NOT_FOUND` on a clean checkout / stale dist → silent wrong results. → Point at TS source (tsx) or add a prespike build + clear error. |
| `prior-run-store-unbounded-vs-ledger-cap` | bug · low · med | novelty/src/store.ts:14-33 (no cap) vs novelty-ledger.ts:47 (`MAX=500`) | Two "stores" with divergent growth/window semantics — latent inconsistency if unified. → `maxEntries` ctor + slice on append, or make the fs ledger the only store. |
| `buildNoveltyConstraints-axis-field-mismatch` | improvement · low · med | novelty-ledger.ts:84 (`axis = false_assumption.type` string) vs types.ts:11 (6-axis enum) | The recorded "axis" isn't validated against the fingerprint enum → cross-run records can't feed `judgeNovelty` without a fragile mapping. → A shared enum-mapping helper (fallback + warn) used by both. |
| `seed-corpus-loaded-and-summarized-per-run` | efficiency · low · med | mystery-orchestrator.ts:750 + agent3-run.ts:300 | 14 static seed files re-read/parsed + re-summarized into the prompt every run (the novelty package's own loader caches; the worker's doesn't). → Memoize load/constraints/summaries at module scope keyed by `EXAMPLES_ROOT`. |
| `O(n*m)-similarity-scan-uncached` | efficiency · low · low | compare.ts:85 / store.ts:54 | Trivial today (~22 entries); the concatenated corpus is rebuilt per `judgeAgainstAll` — scales poorly at the 500-entry cap in a retry loop. → Build the corpus once/run; index by `false_assumption_pattern` if scaled. |

---

## 9. Cross-cutting fixes (do these as *patterns*, once)

These collapse dozens of the rows above into a handful of changes:

1. **Repair-not-abort sweep (pattern A).** Replace every "throw on a deterministically-repairable violation" with warn+repair. Affected throws: A1:84/91/108, A2:603/cast:789, A3-cml:891, A4:1086, A5:2762/2768/2778/2752 + the direct-culprit exclusivity, A6:1737, A65:1079/904. A shared helper `repairOrWarn(condition, repairFn, warning)` would standardise it.
2. **Per-call cost deltas (pattern C).** One helper: snapshot `costTracker.byAgent[name]` before a call, subtract after → a true per-call cost. Replace the cumulative `+=` at A6:1685/1447 (and the 6 accumulation sites) and A3:207. This also de-risks the $0.15 budget throw.
3. **Word-boundary name/role matcher (pattern D).** Promote `agent6-reveal-gate.ts`'s `namesMatch` to a shared util and replace `String.includes` on names/roles at A2:151/393, A3:129, A5:174/766-analog, A6:766/800.
4. **Single-source-of-truth for thresholds/config (patterns E).** Resolve novelty threshold from `getGenerationParams()` only (A8); assert `DEFAULT_CONFIG` == parsed YAML (A6 remediation-cycles); derive `season` from month via `monthToSeason` (A2d). Add a test per source.
5. **Mutation → re-normalize → re-validate (A_52 §6 class).** Hoist grounding/evidence/normalize into one post-mutation pass that runs after *any* CML mutation (A3, A4), and make the grid clue-job stamp additive + re-validated (A7).
6. **Kill the hardcoded story content in logic (pattern B).** A4 normalizer fallbacks and A7 discriminating-test patch must derive from the artifact's own data. **This is the principle-critical one.**
7. **Patch-by-default + memoize immutable-CML derivations (efficiency).** Default `CML_REPAIR_MODE=patch` (A4); memoize whitelist/feedback/coverage/seed-corpus over the immutable CML (A5, A3, A8); gate the always-on novelty LLM audit behind the deterministic judge (A8).

---

## 10. Recommended sequence

1. **Principle violations first:** B (A7 clock patch, A4 normalizer fallbacks) — they corrupt non-matching stories and break the holistic rule.
2. **Reliability:** A2 crash → pattern A repair-not-abort sweep → pattern C cost-delta (removes two abort classes at once).
3. **Correctness of the gates:** A7 `missing_case_transition_bridge` + `mar` false positives (extend the A_52 temporal work), pattern D name matching, A5 direct-culprit exclusivity.
4. **Novelty teeth:** A8 `NOVELTY_MODE` + wire the deterministic judge + gate the LLM leg.
5. **Dark levers:** A7 split the scheduler-authority lever (ship word-budgets; fix+enable clue-jobs).
6. **Efficiency:** patch-by-default, memoization, single-sample→majority blind reader, prompt-context trimming.

> Counts: **~104 findings** across 8 stages (A1: 8, A2: 17, A3: 12, A4: 14, A5: 13, A6/65: 14, A7: 12, A8: 14). No story-specific hardcoding was found in **logic** except the two pattern-B items (A4, A7); everything else honours the parameter-driven rule. Full per-finding evidence (file:line + code quote) is in §§1–8.

> Notable efficiency lever (A2): `subagents-serial-llm-calls` — sub-agents **2d** (temporal) and **2e** (background) are largely *deterministically derivable* (the `deriveTemporalAnchor` / `deriveBackgroundContext` shadows already prove it), and **2b/2c** are independent and could run concurrently. Turning two LLM round-trips into deterministic derivations + parallelising two more is the single biggest latency/token win in the early pipeline.

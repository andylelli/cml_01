# Agent 9 Phased Implementation Plan

Generated from: `reviews/agent9-code-review.md` (55 issues across 6 iterations)

Already completed items are noted for reference; they are not included in the work phases.

---

## Already Completed (Prior Sessions)

| # | Item | Notes |
|---|------|-------|
| 1.1 | Remove "note the stopped clock" from opening archetype | Done |
| 1.2 | Replace "The clock stood at X" in INJECTION_TEMPLATES | Done |
| 1.3 | Replace "before the hour was out" backstop with "before long" | Done |
| 3.1 | Expand RESOLUTION_RE with additional phrasings | Done |
| 17  | Remove `status === "failed"` guard from deterministic repair | Done |
| 21  | classifyFactValue AM/PM added to time classifier | Done |
| 29  | extractSurname hoisted to module-level | Done |
| 30  | buildClueSemanticAnchorFamilies 4 domain-agnostic families added | Done |
| 31  | tokenMatchesText slice(0,-1) fallback guarded to length ≥ 5 | Done |
| 32  | BEHAVIOURAL_MARKERS financial terms removed | Done |
| 33  | factualThreshold flat 0.55 (was length-dependent 0.45/0.6) | Done |
| 34  | inferBatchGatesFromError anchored regex patterns | Done |
| 41  | arcPosition 'climax' boundary fix (>= not >) | Done |
| 42  | buildMacroArcPlan short-story guard (≤7 chapters uses fixed arc) | Done |
| 46  | culpritChar lookup uses castCharacters not raw cast | Done |
| 49  | "$5–8 to regenerate" removed from prose requirements | Done |
| 51  | runAtmosphereRepairIfNeeded logs when replacements = 0 | Done |
| 52  | applyPhraseSubstitutions ALL-CAPS case preservation | Done |
| 53  | clueValidationErrors filter uses /\bclue_[a-z_]+\b/ regex | Done |
| 55  | ALIBI_PROBE mustNotContain changed to '' | Done |

---

## Phase 1 — Correctness (Silent Failures and Wrong Outputs)

These items cause wrong behaviour that is either invisible in logs or produces subtly incorrect stories. They should be fixed before broadening the story types tested by canary.

**Target**: Fix items that silently skip obligations, produce wrong gate decisions, or corrupt shared state.

---

### P1-1: #35 — `getRequiredClueIdsForScene` Scene-Number Mismatch (HIGH)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 516  
**Problem**: Per-act scene numbers from CML (1,2,3 per act) compared against global scene numbers from the narrative outline (1–9 across all acts). In Act 2+, the filter always returns zero matching clues. Clue obligations for chapters in Acts 2 and 3 are never enforced by the pre-commit validator — only by post-generation backstops.  
**Fix**: Before comparison, convert `entry.scene_number` to a global scene number by summing scene counts of all preceding acts, or adopt per-act numbering in the narrative outline at Agent 7 output time.  
**Effort**: Medium  
**Test signal**: Clue-absence warnings in Act 2+ chapters should drop after fix.

---

### P1-2: #43 — Normalized Cast Not Threaded to Helper Functions

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 5575  
**Problem**: `normalizeProseCastOrThrow` runs at the top of `generateProse`, but `buildContextSummary`, `buildWorldBriefBlock`, and `buildChapterObligationBlock` still receive raw `inputs.cast`. These functions use independent 3–4 branch fallback chains that may resolve to a different character list than the normalized result. Different prompt blocks may silently describe different casts.  
**Fix**: Pass `castCharacters` (from the normalized result) as an explicit parameter to all three helper functions. Remove the fallback chains in those functions — they are only needed because the normalized value was not passed.  
**Effort**: Medium

---

### P1-3: #44 — `matchingClearances` Never Populated at Linter Call Sites

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 948  
**Problem**: `lintBatchProse` P2-H clearance check only fires when `options.matchingClearances` is non-empty. Due to the scene-number mismatch (P1-1), `exactClearances` is almost always empty, so `matchingClearances` passed to the linter is an empty array. Clearance linting never triggers a retry; clearance obligations are only patched by `enforceSuspectEliminationPresence` post-generation, injecting a boilerplate sentence instead of a real narrative.  
**Fix**: Depends on P1-1. After fixing scene-number alignment, verify that `exactClearances` is populated and flows through to `lintBatchProse`. Add a diagnostic log when `matchingClearances` is empty for a chapter that should have a clearance obligation.  
**Effort**: Small (conditional on P1-1)

---

### P1-4: #22 — Season Repair Fires on Every Chapter After [WORLD FIX C]

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1260  
**Problem**: The guard that skipped season repair when no seasonal vocabulary was present was removed. The repair now scans every paragraph of every chapter unconditionally, replacing forbidden season words — including legitimate non-seasonal uses ("summer residence", "winter of their years").  
**Fix**: Restore a lightweight guard: skip repair entirely if the chapter contains zero occurrences of any season word, month word, or weather word. Only run replacement passes when seasonal vocabulary is actually present.  
**Effort**: Small

---

### P1-5: #4 — `placeholderGenericRolePattern` False-Positive Threshold

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 1306  
**Problem**: Generic role phrases ("a doctor", "a captain") trigger a placeholder-leakage hard stop at ≥12 occurrences. In a story featuring a character who is a doctor, 12 natural occurrences across 9 chapters is easily reached. `roleSurnameCount > 0` (which catches "a doctor Finch") is the correct signal; raw count is too coarse.  
**Fix**: Raise threshold to ≥25, or limit count to matches within 3 words of a capitalized name.  
**Effort**: Small (1–2 lines)

---

### P1-6: #26 — `discriminating_test_scene` Stub Repair Mutates Live CML Object

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 1540  
**Problem**: When `discriminating_test_scene` is an empty stub, the repair writes directly to `cml.CASE.prose_requirements.discriminating_test_scene` on the live CML object in `ctx.cml`. Other pipeline parts that hold the same reference see the mutated form inconsistently. The mutation is not persisted to the saved CML artifact, and the underlying Agent 3 generation failure is silently masked.  
**Fix**: Deep-clone the CML node before patching. Either persist the patched form explicitly or expose it as a `patchedCml` variable separate from `ctx.cml`. Emit an actionable `ctx.warnings` entry with the patched values so the saved artifact reflects what was used.  
**Effort**: Small-Medium

---

### P1-7: #27 — `enforceSuspectEliminationPresence` Reads from Wrong Cast Source

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 780  
**Problem**: Reads from `cml.CASE.cast` (flat array, Agent 3 raw output) rather than `castDesign.characters` (normalized, Agent 2 output). If `cml.CASE.cast` is empty or structured differently, the function silently no-ops without warning.  
**Fix**: Accept `castDesign` as an explicit parameter; read from `castDesign.characters`. Add a `console.warn` if `cml.CASE.cast` and `castDesign.characters` diverge.  
**Effort**: Small

---

## Phase 2 — Output Quality (Story Correctness and Prompt Fidelity)

These items do not cause silent failures but produce stories with incorrect structure, misapplied templates, or under-serving prompt instructions.

---

### P2-1: #1.4 — `repairWordFormLockedFacts` Has No Generic Fallback

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Problem**: The repair function handles time-format locked facts but has no fallback for generic locked facts (places, objects, quantities). Non-temporal locked facts that are misstated in prose fall through without repair.  
**Fix**: Add a generic fallback branch that uses the canonical value directly: `"The {factDescription} was {canonicalValue}."`. Consider splitting into `repairTemporalLockedFacts` and `repairQuantityLockedFacts` with shared logic.  
**Effort**: Medium

---

### P2-2: #1.5 — `WORD_TO_NUM` half/quarter in Wrong Branch

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Problem**: `half: 30` and `quarter: 15` are in the shared `WORD_TO_NUM` map used by all locked fact repair. In non-clock contexts, "a quarter of a mile" or "half the evidence" would produce incorrect numeric substitutions.  
**Fix**: Move `half` and `quarter` to the time-specific conversion branch only. The generic branch should not include clock-face fractions.  
**Effort**: Small

---

### P2-3: #5 — `buildDeterministicGroundingLead` Estate/Corridor Bias

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 220  
**Problem**: All 5 lead templates presuppose a large building with corridors. The fallback location is hardcoded to `"the estate"`. For ocean liners, railway carriages, solicitor's offices, etc., the injected sentence is semantically wrong.  
**Fix**: Change fallback to `"the premises"` (location-agnostic). Add location-type-aware template variants keyed to `locationType` from the location profile (building/train/ship/office).  
**Effort**: Medium

---

### P2-4: #6 — `classifyFactValue` quarter/half Cross-Classification

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Problem**: `quarter` and `half` in the `time` classifier match non-temporal contexts ("quarter of an hour" is fine, but "half the distance" is not a time fact). The `duration_minutes` classifier matches "at the hour" as a duration.  
**Fix**: Require at least one digit or hour-word (`o'clock`, `past`, `to`, `AM`, `PM`) adjacent to `quarter`/`half` before classifying as `time`. Add `at the hour` to the `time` classifier explicitly.  
**Effort**: Small

---

### P2-5: #11 — `nameInText` Misses Titled Addresses

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 876  
**Problem**: `enforceSuspectEliminationPresence` and `enforceCulpritEvidencePresence` check for character presence by name + surname. "Dr. Finch" is not detected when the character is registered as "Mallory Finch" and only the titled form appears in the chapter.  
**Fix**: Strip leading title prefix (`Dr.`, `Miss`, `Captain`, `Colonel`, etc.) before the `extractSurname` call, so "Dr. Finch" → surname "Finch" → matched correctly.  
**Effort**: Small

---

### P2-6: #13 — `buildTimelineStateBlock` Misleading Name and Scope

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1854  
**Problem**: The "FROZEN TIMELINE STATE" block filters to time-domain locked facts only. For a story where primary locked facts are weights, quantities, or locations, the block emits nothing but still renders a `FROZEN TIMELINE STATE` header in the prompt.  
**Fix**: Either rename to "FROZEN FACT STATE" and include all locked facts (up to a cap), or add a complementary injection path for non-temporal locked facts with the same `DO NOT ALTER` framing.  
**Effort**: Small

---

### P2-7: #15 — `TEMPLATE_BLEED_PATTERNS` Broad False Positives

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1133  
**Problem**: Patterns like `/^by the time they reached\b/im` and `affecting outdoor activities` match natural period-fiction prose. `/clung to coats and curtains\b/i` will false-positive on any legitimate mention of curtains.  
**Fix**: Require ALL parts of the template multi-phrase pattern to be present (AND condition, not OR) before flagging leakage. Single-phrase matching must be removed.  
**Effort**: Medium

---

### P2-8: #16 — Mandatory Atmosphere Word List Doesn't Match Validator

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 2032  
**Problem**: The prompt tells the LLM to include words from a 25-item weather list. The validator checks for sensory cues via a different mechanism. Legitimate atmosphere words ("grey", "chill", "damp", "lamplight", "firelight", "crisp") are absent from the list.  
**Fix**: Extend the list to include at least: grey, pale, cold, warm, chill, crisp, damp, drizzle, haze, lamplight, firelight. Share this list as a constant used in both the prompt builder and the validator to prevent drift.  
**Effort**: Small

---

### P2-9: #24 — Act-Level Clearance Fallback Fires on Every Chapter

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 2040  
**Problem**: With `proseBatchSize=1` (canary default), every batch is the "last scene in the batch". The fallback that was intended for the final chapter of each act fires for every chapter in that act. Every chapter receives redundant clearance obligation text.  
**Fix**: Track injected clearance obligations by suspect name. Skip the act-level fallback for chapters before the designated clearance scene. Root fix is P1-1 (scene number alignment).  
**Effort**: Small-Medium

---

### P2-10: #25 — `sanitizeGeneratedChapter` Runs Before Pronoun Repair

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1790  
**Problem**: `anonymizeUnknownTitledNames` changes "Dr. Finch said... He walked away" to "the doctor said... He walked away" before pronoun repair runs. The weakened antecedent may be misresolved.  
**Fix**: Move `sanitizeGeneratedChapter` to after `repairChapterPronouns` in the batch pipeline.  
**Effort**: Small (reorder calls)

---

### P2-11: #28 — Entropy Retry Directive Uses Clock-Specific Examples

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 4960  
**Problem**: The `opening_style` entropy repair directive offers "At half past nine..." and "At nine o'clock at night..." as examples — clock-specific idioms inappropriate for non-clock mysteries.  
**Fix**: Replace with generic time-anchor examples: "That morning...", "By the time dawn broke...", "It was nearing four o'clock". Better: derive the example from the story's `primaryAxis` value.  
**Effort**: Small

---

### P2-12: #36 — `buildDiscriminatingTestChecklist` Silently Disabled for batchSize > 1

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 4491  
**Problem**: Uses batch index numbers (1–N batches) where scene numbers are expected. For batchSize=2, `[4,5].some(n => n >= 7)` = false → checklist never fires. The discriminating test requirements are silently omitted for multi-chapter batch generation.  
**Fix**: Compare against chapter percentage (`chapterIndex / totalChapters`) rather than raw scene count.  
**Effort**: Small

---

### P2-13: #39 — `sanitizeForContentPolicy` Structural Masking

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 5220  
**Problem**: Word-level crime-vocabulary redaction produces `[crime-redacted]`-filled sentences that are less effective than the originals at preventing structural reproduction. The LLM cannot recognize the sentence structure it should avoid.  
**Fix**: Replace word-level redaction with structural masking (first 6 words + "..." + last 6 words). The LLM avoids the scaffold without seeing the content.  
**Effort**: Small

---

### P2-14: #40 — `buildRevealGroundworkCues` Produces Ungrammatical Cues

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1298  
**Problem**: `REVEAL_GROUNDWORK_BANNED_TERMS` replaces banned words with `"hidden-truth"`, producing "the hidden-truth of Dr. Finch's involvement" and "her hidden-truth expression".  
**Fix**: Strip the entire sentence containing a banned term and replace with a generic placeholder: `"Plant one subtle anomaly that can be re-read after the resolution."` Don't produce broken English instructions.  
**Effort**: Small

---

### P2-15: #45 — Three Independent Token Threshold Code Paths

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~lines 637–660  
**Problem**: Primary path, CTX fallback path, and early-placement path each duplicate the behavioural detection logic and threshold arithmetic. CTX fallback path applies 0.6 where primary path would apply 0.45 for ≥8-token clues.  
**Fix**: Extract `resolveClueMatchThreshold(tokens: string[], isBehavioural: boolean, placement?: 'early' | 'standard'): number` and call from all three paths.  
**Effort**: Small

---

### P2-16: #47 — `extractOpeningSentence` Fails on Quoted and Ellipsis Sentences

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1000  
**Problem**: The sentence splitter `[^.!?]+[.!?]` does not match Unicode ellipsis (…) or quote-terminated sentences. Fallback `slice(0,120)` cuts mid-sentence.  
**Fix**: Extend regex to include `…` and `"` as sentence terminators. Use a two-level fallback: full sentence regex first, then a 150-char soft limit.  
**Effort**: Small

---

### P2-17: #48 — String-Level Hard-Failure Dedup Conflates Distinct Clue Failures

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 882  
**Problem**: Two distinct clue IDs with the same description string are deduplicated to one retry directive. The LLM satisfies the one directive it sees; the other clue remains absent.  
**Fix**: Deduplicate on clue ID, not error string. Emit one combined directive: `"clue_A AND clue_B are both absent — include both."`.  
**Effort**: Small

---

### P2-18: #50 — 6+ MANDATORY Labels Dilute Instruction Priority

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 3570+  
**Problem**: Six distinct "MANDATORY", "NON-NEGOTIABLE", and "VALIDATION" labels in the system prompt. When everything is mandatory, nothing is prioritized.  
**Fix**: Consolidate to a single validation summary at the end of the system prompt. Reserve `MANDATORY` for only the hardest-to-satisfy requirement (typically the discriminating test checklist).  
**Effort**: Medium (careful text surgery)

---

### P2-19: #54 — `retryPacketHistory` Never Pruned → O(N²) Growth

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 5640  
**Problem**: For a 15-chapter story with 6 retries per chapter, `retryPacketHistory` accumulates 90 entries. Each `classifyFailure` call scans all prior entries. O(N²) is latent; invisible at 9 chapters, significant at 15+.  
**Fix**: Prune to last 20 entries before passing to `shouldContinueRetry`: `const recentHistory = retryPacketHistory.slice(-20);`  
**Effort**: Trivial (1 line)

---

## Phase 3 — Structural Refactoring (Duplication and Maintenance Risk)

These items reduce duplication, prevent future drift, and make the codebase testable. They do not change output behaviour but significantly reduce the risk of regressions.

---

### P3-1: #2.1 — Extract `applyStandardPostProcessingChain`

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Problem**: The triplet `applyDeterministicProsePostProcessing` → `repairWordFormLockedFacts` → `normalizeLocationNames` is called verbatim in 4 places. A future change must be applied consistently to all 4.  
**Fix**: Extract a single `applyStandardPostProcessingChain(prose, lockedFacts, locationRegistry, characters)` function and replace all 4 call sites.  
**Effort**: Medium

---

### P3-2: #2.2 — Audit Dual Pronoun Repair Passes

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Problem**: `repairChapterPronouns` (inside `applyDeterministicProsePostProcessing`) and `repairPronouns` (inside `applyDeterministicPronounSweep`) both wrap the same underlying library and run sequentially.  
**Fix**: Audit whether both passes are needed. If they target the same validator, de-duplicate. If they are distinct (different thresholds/scope), document the distinction explicitly.  
**Effort**: Medium (audit + decision)

---

### P3-3: #2.3 — Extract `injectSentenceIfAbsent` Shared Helper

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Problem**: `enforceSuspectEliminationPresence`, `enforceCulpritEvidencePresence`, and `injectResolutionIfAbsent` each duplicate ~30 lines of chapter-walking and paragraph-appending logic.  
**Fix**: Extract `injectSentenceIfAbsent(prose, targetNames, presenceCheck, buildSentence)`. Removes ~90 lines of duplication.  
**Effort**: Medium

---

### P3-4: #2.4 / #3.2 — Share `RESOLUTION_BACKSTOP_SENTENCE` and `RESOLUTION_RE`

**Files**: `apps/worker/src/jobs/agents/agent9-run.ts`, `packages/prompts-llm/src/agent9-prose.ts`  
**Problem**: The resolution backstop sentence and `RESOLUTION_RE` are each independently defined in both files and have already diverged once.  
**Fix**: Export both as shared constants from a utility module (`@cml/story-validation` or a shared `cml-constants` module). Import in both files.  
**Effort**: Small-Medium

---

### P3-5: #9 — Extract `buildProseScoreArgs`

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Problem**: `ProseScorer` is instantiated three times with nearly identical inline argument objects. If scoring configuration diverges between call sites, the three scores become incomparable.  
**Fix**: Extract `buildProseScoreArgs(cml, castDesign, outline, narrativeState): ProseScoreArgs` used by all three call sites.  
**Effort**: Small

---

### P3-6: #10 — Naming Cleanup and Local Utility Extraction

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Problem**: `normalizeChapterTitle` vs `normalizeChapterTitles` have different semantics. `parseBooleanEnv` is a local generic utility. `loadWritingGuides` reads hardcoded filenames with no manifest.  
**Fix**: Rename `normalizeChapterTitles` to `applyChapterTitleNormalizationInPlace`. Move `parseBooleanEnv` to a shared utils module. Add a guide-file manifest or at minimum a debug log when guide files are missing.  
**Effort**: Small

---

### P3-7: #12 — Combine Four Chapter-Walk Evaluations

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Problem**: `evaluateProseReadability`, `evaluateSceneGroundingCoverage`, `evaluatePlaceholderLeakage`, and `evaluateChapterHeadingArtifacts` are called sequentially and each independently walks all chapters.  
**Fix**: Combine into a single `evaluateProse(prose): ProseEvaluationResult` that computes all four metrics in one pass.  
**Effort**: Medium

---

### P3-8: #19 — `compileSensoryAtoms` Typo and Order-Dependent Strips

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 3050  
**Problem**: `lingier` is a typo for `lingers` — the regex never matches. Sequential strip operations leave trailing commas. Five-word hard cutoff can produce mid-phrase fragments.  
**Fix**: Fix typo. Apply a single pass that extracts the noun-phrase head before the first verb or clause marker, replacing the chain of sequential replacements.  
**Effort**: Medium

---

### P3-9: #20 — `perBlockTokenCap` Development-Time Assertions

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 2780  
**Problem**: 11 magic-number token caps with no documentation of derivation. Silent truncation (`[truncated for prompt budget]`) when a block grows beyond its cap.  
**Fix**: Add development-time logging: when any block's actual token count exceeds 90% of its cap, emit a `console.warn` so developers see when caps need updating.  
**Effort**: Small

---

### P3-10: #23 — `extractBeatFingerprints` Noun-Density Heuristic

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 2070  
**Problem**: The "noun" proxy counts all 5+ character words not in a 13-word stoplist, favouring verb-dense and noun-dense sentences equally. Generic sentences may get fingerprinted over plot-relevant ones, wasting forbidden-repeat slots.  
**Fix**: Use a two-condition filter: prioritize sentences containing a cast member name OR ≥8 words with investigation terms (evidence, alibi, witness, etc.).  
**Effort**: Small

---

### P3-11: #37 / #38 — Humour/Craft Guides and Fair-Play Guardrails Token Gating

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~lines 3566–3700  
**Problem**: Humour and craft guides are injected in full without story-tone gating (~700 tokens each, not in `perBlockTokenCap`). Four `fairPlayGuardrails` strings are hardcoded inline and duplicate the `fairPlayContractBlock`.  
**Fix**: Gate humour guide on `worldDoc.humourPlacementMap` containing at least one entry. Add both guides to `perBlockTokenCap`. Move the 4 fair-play inline strings into the `fairPlayContractBlock` source.  
**Effort**: Small

---

### P3-12: #14 — `sanitizeClueField` Should Live in Agent 3 Pipeline

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1963  
**Problem**: Strips Agent 3 annotation bleed phrases from clue descriptions, 4 agents too late. Patterns are brittle (adverb insertion bypasses them). One pattern can accidentally strip legitimate content beginning with "in the case background".  
**Fix**: Move `sanitizeClueField` to the output validation step immediately after Agent 3 generates the CML. Add structured tests for each pattern. Remove from Agent 9 once Agent 3 side is validated.  
**Effort**: Medium

---

## Phase 4 — Architecture (Major Structural Changes)

These items require significant refactoring. They do not affect current output but are necessary for long-term testability, agent reuse, and maintainability.

---

### P4-1: #7 — Move `validateCmlUsageForProse` to `@cml/story-validation`

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~lines 1350–1650  
**Problem**: This 300-line function validates CML structural compliance but is buried in the prose orchestrator. Other agents (5, 6, 7) that consume CML cannot reuse it. Schema changes require hunting through 3000+ lines of prose code.  
**Fix**: Move to `packages/story-validation` where it can be imported by all agents and independently tested.  
**Effort**: Large

---

### P4-2: #18 — Extract `evaluateCandidate` from Retry Loop

**File**: `packages/prompts-llm/src/agent9-prose.ts`  
**Problem**: 100-line function defined 4 levels deep inside the per-batch retry loop, capturing 12 variables from enclosing scopes. Cannot be tested without standing up the entire batch generation context.  
**Fix**: Extract to top-level `evaluateProseChapterCandidate(chapter, params: EvalParams): EvalResult` with an explicit parameter interface.  
**Effort**: Large

---

### P4-3: #8 — Extract `onBatchComplete` Inline Closure

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`  
**Problem**: 200-line inline closure capturing 15+ variables from the surrounding `runAgent9` scope. Hidden parameter list, untestable, difficult to trace.  
**Fix**: Extract to `processBatchComplete(params: BatchCompleteParams)` with an explicit typed interface. Make the dependency surface visible.  
**Effort**: Large

---

### P4-4: #2.2 Audit Outcome — Potential Refactor of Pronoun Repair Pipeline

**Depends on**: P3-2 audit  
**Potential fix**: If both pronoun repair passes are confirmed necessary, document the distinction and add test coverage. If redundant, remove one and add a regression test.  
**Effort**: Small-Medium (depends on audit)

---

## Implementation Order Recommendation

```
Phase 1 (run now, before expanding canary themes):
  P1-1 → P1-2 → P1-3 (clearance depends on P1-1)
  P1-4 (season repair guard restore)
  P1-5 (placeholder threshold)
  P1-6 (CML mutation)
  P1-7 (cast source)

Phase 2 (quality improvement sprint):
  P2-19 (trivial 1-liner, do first)
  P2-14, P2-16, P2-17 (small, high value)
  P2-4, P2-5, P2-11, P2-15 (small fixes)
  P2-1, P2-2, P2-3 (medium, locked fact repair)
  P2-6, P2-7, P2-8 (prompt quality)
  P2-9, P2-10 (ordering / clearance)
  P2-12, P2-13, P2-18 (polish)

Phase 3 (refactor sprint — no observable output change):
  P3-4 (shared constants, prep for P3-1 and P3-3)
  P3-5, P3-9, P3-10 (trivial)
  P3-1, P3-3 (extraction, medium effort)
  P3-2 (audit first)
  P3-6, P3-7, P3-8, P3-11, P3-12 (medium)

Phase 4 (architecture sprint — dedicated session):
  P4-2 (evaluateCandidate — largest single gain for testability)
  P4-3 (onBatchComplete)
  P4-1 (validateCmlUsageForProse — requires new package setup)
```

---

## Risk Notes

- **Phase 1 items must be tested with canary runs after each fix** to verify EXIT:0 is maintained.
- **P1-1 (scene number mismatch) is the highest-value correctness fix** and unblocks P1-3 and P2-9.
- **Phase 4 items should not be mixed with Phase 1/2 items in the same PR** — architectural changes carry regression risk and need isolated testing.
- **P3-4 (shared RESOLUTION_RE)** should be done before any further expansions of resolution phrasings, to prevent the two files from diverging again.

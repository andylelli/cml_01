# Agent 9 Code Review

**Files reviewed**: `apps/worker/src/jobs/agents/agent9-run.ts` (3191 lines), `packages/prompts-llm/src/agent9-prose.ts` (6691 lines)  
**Review focus**: General-purpose golden-age crime story capability; redundancy; weak points; refactoring opportunities.

---

## Progress Tracker

**Last updated**: 2026-05-17 (Phase 2 audit) | **Done: 26/55** | **Open: 29/55** | **N/A: 0/55**

| # | Issue | Priority | Status |
|---|-------|----------|--------|
| 1.1 | Remove "note the stopped clock" from `CHAPTER_TYPE_ADVANCE["opening"]` | High | ✅ Done |
| 1.2 | "The clock stood at X" → neutral form in `INJECTION_TEMPLATES["time"]` | High | ✅ Done |
| 1.3 | "before the hour was out" in resolution backstop | High | ✅ Done |
| 1.4 | `repairWordFormLockedFacts` only handles time/quantity facts | High | 🔲 Open |
| 1.5 | `half:30, quarter:15` in `WORD_TO_NUM` — clock-only semantics | Medium | 🔲 Open |
| 2.1 | Post-processing triplet called in 4 places — extract shared chain | High | 🔲 Open |
| 2.2 | Pronoun repair called twice (possible conflict) | Medium | 🔲 Open |
| 2.3 | 3 enforcement functions duplicate chapter-walk boilerplate (~90 lines) | Medium | 🔲 Open |
| 2.4 | Dual resolution backstops with diverging injected sentences | Medium | 🔲 Open |
| 3.1 | `RESOLUTION_RE` too narrow — misses many valid resolution phrasings | High | ✅ Done |
| 3.2 | `RESOLUTION_RE` duplicated across two files — drift risk | Medium | 🔲 Open |
| 4 | `placeholderGenericRolePattern` false-positive risk (≥12 "a doctor") | Medium | 🔲 Open |
| 5 | `buildDeterministicGroundingLead` hardcoded estate/corridor vocabulary | Medium | ✅ Done |
| 6 | `classifyFactValue` regex misclassification (time vs duration) | Medium | ✅ Done |
| 7 | `validateCmlUsageForProse` misplaced in orchestrator — move to `@cml/story-validation` | Medium | 🔲 Open |
| 8 | `onBatchComplete` 200-line inline closure with 15+ captured variables | Low-Med | 🔲 Open |
| 9 | `ProseScorer` instantiated 3× with inline args — config drift risk | Low | 🔲 Open |
| 10 | Naming confusion (`normalizeChapterTitle` vs plural), local utility duplication | Low | 🔲 Open |
| 11 | `nameInText` misses titled address forms (Dr., Miss, Captain) | Low | ✅ Done |
| 12 | Four separate O(N) chapter-walk evaluations at release gate | Low | 🔲 Open |
| 13 | `buildTimelineStateBlock` silently skips non-temporal locked facts | Medium | ✅ Done |
| 14 | `sanitizeClueField` brittle hardcoded annotation strip patterns | Low-Med | 🔲 Open |
| 15 | `TEMPLATE_BLEED_PATTERNS` — broad single-phrase matching, false-positive risk | Medium | 🔲 Open |
| 16 | Mandatory atmosphere word list doesn't match `evaluateSceneGroundingCoverage` | Medium | ✅ Done |
| 17 | Deterministic repair skipped when status is `needs_review` | Medium | ✅ Done |
| 18 | `evaluateCandidate` 100-line function defined inside retry loop | Medium | 🔲 Open |
| 19 | `compileSensoryAtoms` order-dependent strip + typo ("lingier") | Low | ✅ Done |
| 20 | `perBlockTokenCap` magic constants — no provenance, no drift detection | Low | 🔲 Open |
| 21 | `classifyFactValue` misses AM/PM → falls to `generic` | Medium | ✅ Done |
| 22 | Season repair fires on every chapter after [WORLD FIX C] removal of guard | Medium | ✅ Done |
| 23 | Beat score function counts all 5-char words as "nouns" | Low | 🔲 Open |
| 24 | Act-level clearance fallback fires on every chapter when `proseBatchSize=1` | Medium | 🔲 Open |
| 25 | `sanitizeGeneratedChapter` runs before `repairChapterPronouns` — antecedent corruption | Low | 🔲 Open |
| 26 | `discriminating_test_scene` stub repair mutates live CML object | Medium | 🔲 Open |
| 27 | `enforceSuspectEliminationPresence` reads `cml.CASE.cast` not `castDesign` | Low-Med | 🔲 Open |
| 28 | Entropy retry directive uses clock-specific time examples | Low | 🔲 Open |
| 29 | `extractSurname` defined identically in 3 places | Low | ✅ Done |
| 30 | `buildClueSemanticAnchorFamilies` only has clock/forensic families | Medium | ✅ Done |
| 31 | `tokenMatchesText` `slice(0,-1)` fallback produces false-positive substring matches | Low-Med | ✅ Done |
| 32 | `BEHAVIOURAL_MARKERS` includes financial terms → wrong threshold for factual clues | Medium | ✅ Done |
| 33 | Factual token threshold LOWER (0.45) for MORE descriptive clues — inverted | Low-Med | ✅ Done |
| 34 | `inferBatchGatesFromError` — "timeline"/"character" regex cross-contamination | Low | 🔲 Open |
| 35 | `getRequiredClueIdsForScene` conflates per-act vs global scene numbers | High | ✅ Done |
| 36 | `buildDiscriminatingTestChecklist` silently disabled for `proseBatchSize > 1` | Low | 🔲 Open |
| 37 | humour/craft guides injected in full without story-tone gating | Low | 🔲 Open |
| 38 | `fairPlayGuardrails` hardcoded outside token budget, duplicates contract block | Low | 🔲 Open |
| 39 | `sanitizeForContentPolicy` word-redaction weakens BANNED PARAGRAPH guardrail | Low | 🔲 Open |
| 40 | `buildRevealGroundworkCues` "hidden-truth" replacement produces ungrammatical cues | Low | 🔲 Open |
| 41 | `buildWorldBriefBlock` arc position uses `<` instead of `<=` — chapter 8 of 9-ch story gets wrong arc | Medium | ✅ Done |
| 42 | `buildMacroArcPlan` linear interpolation skips EVIDENCE/DISCRIMINATING/CONFRONTATION for 5-chapter stories | Medium | ✅ Done |
| 43 | `normalizeProseCastOrThrow` result not threaded to all helper functions | Medium | 🔲 Open |
| 44 | `matchingClearances` (P2-H) never populated at call sites — clearance linting disabled | Medium | 🔲 Open |
| 45 | Three independent token threshold code paths for same clue-presence check | Low-Med | 🔲 Open |
| 46 | `motiveLock` reads `cmlCase.cast?.characters` not resolved `castCharacters` | Low | ✅ Done |
| 47 | `extractOpeningSentence` fails on quote-terminated and ellipsis sentences | Low | 🔲 Open |
| 48 | String-level hard-failure dedup conflates distinct clue failures with same description | Low-Med | 🔲 Open |
| 49 | "$5–8 to regenerate" cost estimate injected into every prose prompt | Low | ✅ Done |
| 50 | 6+ `MANDATORY`/`VALIDATION` labels in developer prompt dilute instruction following | Low-Med | 🔲 Open |
| 51 | `runAtmosphereRepairIfNeeded` silent failure with no logging | Low | ✅ Done |
| 52 | `applyPhraseSubstitutions` case preservation only handles leading-capital, not ALL-CAPS | Low | ✅ Done |
| 53 | Clue error categorization uses fragile natural-language matching | Low-Med | ✅ Done |
| 54 | `retryPacketHistory` accumulated and never pruned — O(N²) growth | Low | 🔲 Open |
| 55 | `ARCHETYPE_CONTRACTS` `mustNotContain` references unfalsifiable prior-chapter state | Low | 🔲 Open |

---

---

## 1. Clock/Time Domain Coupling (Priority: High)

The current implementation is deeply entangled with the specific canary theme (clock-tampering murder). Several hardcoded strings and logic branches will behave incorrectly or produce absurd output for non-temporal mysteries.

### 1.1 `CHAPTER_TYPE_ADVANCE["opening"]` — hardcoded clock reference

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 2344

```typescript
const CHAPTER_TYPE_ADVANCE: Record<string, string> = {
  opening: 'Discover the body, confirm the victim, note the stopped clock',
  ...
};
```

"Note the stopped clock" is injected into every opening-chapter prompt regardless of whether the mystery involves a clock at all. A railway timetable mystery, a poison mystery, or a blackmail mystery would get the same instruction.

**Fix**: Remove "note the stopped clock" from the static string. It should derive from the CML's `primaryAxis` or `solution.method`, or simply read: `'Discover the body, confirm the victim, establish the time and circumstances of death.'`

---

### 1.2 `INJECTION_TEMPLATES["time"]` — "The clock stood at X"

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 697

```typescript
const INJECTION_TEMPLATES: Record<FactValueType, (desc: string, val: string) => string> = {
  time: (_d, v) => `The clock stood at ${v}.`,
  ...
};
```

Any time-type locked fact (e.g. "arrival time", "death time", "time of last sighting") will inject `"The clock stood at [value]."` This is:
- Nonsensical for time facts unrelated to a clock ("The clock stood at eleven-fifteen" as the victim's arrival time)
- Completely wrong for a mystery where the clock is not a prop

**Fix**: Change to a neutral sentence: `(_d, v) => \`The time recorded was ${v}.\`` or better use the description: `(d, v) => \`${d.charAt(0).toUpperCase() + d.slice(1)}: the time was ${v}.\``

---

### 1.3 `injectResolutionIfAbsent` — clock idiom in injected text

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 944

```typescript
paragraphs.push(
  `${culpritSurname} confessed at last, the evidence having made denial impossible. ` +
  `They were taken into custody before the hour was out. The case was closed.`
);
```

"Before the hour was out" is a clock metaphor that is jarring in a non-temporal mystery. The sentence is also identical for every story (same culprit formula, same phrase).

**Fix**: Change to neutral language: `"before long"` or `"shortly thereafter"`. The same applies to the parallel backstop injected in `agent9-prose.ts`.

---

### 1.4 `repairWordFormLockedFacts` — over-engineered time-only repair

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~lines 310–600

This ~290-line function has ~15 branches that are exclusively time/clock specific:
- `hourOnlyDigitAmPm` — "8 PM" → "eight o'clock"
- `hourWordAmPm` — "eight AM" → "eight o'clock"
- `inTheTimeOfDay` — "eight in the evening" → "eight o'clock"
- `pastWithoutMinutes` — "ten past" → "ten minutes past"
- `halfPast`, `quarterPast`, `quarterTo` patterns

For a mystery whose only locked facts are, say, "three grains of arsenic" and "the left-hand drawer", only the quantity branch (`WORD_TO_NUM`) fires. The rest of the code does no work but still runs on every chapter of every mystery.

This is acceptable overhead, but the function name `repairWordFormLockedFacts` undersells its scope. More importantly: **the function only knows how to repair temporal locked facts and simple quantities.** A locked fact like "the green ledger" or "the east wing" will fall through all branches unremedied.

**Recommendation**: Document scope explicitly and add a `generic` fallback branch with a simple verbatim-match check. Consider splitting `repairTemporalLockedFacts` and `repairQuantityLockedFacts` for clarity.

---

### 1.5 `WORD_TO_NUM` — semantic pollution

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 280

```typescript
const WORD_TO_NUM: Record<string, number> = {
  ...
  half: 30,
  quarter: 15,
};
```

`half` and `quarter` as `30` and `15` are valid only in the clock-face context (half past = 30 minutes, quarter past = 15 minutes). If `WORD_TO_NUM` is ever used for non-temporal quantity parsing, these values are incorrect. A quantity of "half a pound" does not equal 30.

**Fix**: Move these two entries to the time-specific parsing branch only. Do not include them in the general `WORD_TO_NUM` dictionary.

---

## 2. Redundant Post-Processing Passes (Priority: High)

### 2.1 Post-processing triplet called in 4 places

The triplet `applyDeterministicProsePostProcessing` → `repairWordFormLockedFacts` → `normalizeLocationNames` appears verbatim in:

1. After first-pass prose generation
2. After schema-repair retry
3. Before story validation (with additional enforcement functions)
4. After auto-fix encoding pass

Any future change to the post-processing chain (e.g. adding a new repair function) requires updating all 4 call sites consistently. A missed update creates subtle, hard-to-diagnose differences between code paths.

**Fix**: Extract a single `applyStandardPostProcessingChain(prose, lockedFacts, locationRegistry, characters)` function and call it from all 4 sites.

---

### 2.2 `applyDeterministicPronounSweep` called from two paths

`applyDeterministicProsePostProcessing` calls `repairChapterPronouns` internally. Then later, `applyDeterministicPronounSweep` calls `repairPronouns` (a different function) on the same text. Both functions wrap the same underlying pronoun repair library. The second pass may overwrite or undo the first, or produce no-op results on already-repaired text.

**Recommendation**: Audit whether both are needed. If both calls target the same validator, de-duplicate.

---

### 2.3 Deterministic enforcement functions share identical structure

`enforceSuspectEliminationPresence`, `enforceCulpritEvidencePresence`, and `injectResolutionIfAbsent` all follow the same pattern:
1. Extract target names from CML
2. Walk chapters to find last chapter naming the target
3. If obligation not met, append a sentence to the last paragraph

Each function duplicates ~30 lines of chapter-walking and paragraph-appending boilerplate. The only differences are the search regex, the target set, and the injected string.

**Fix**: Extract a shared helper:

```typescript
function injectSentenceIfAbsent(
  prose: any,
  targetNames: string[],
  presenceCheck: (text: string, name: string) => boolean,
  buildSentence: (surname: string) => string,
): any
```

This removes ~90 lines of duplication.

---

### 2.4 Dual resolution backstops

`injectResolutionIfAbsent` (in `agent9-run.ts`, post-generation) and the `isResolutionOnlyFailure` backstop (in `agent9-prose.ts`, inside the batch retry loop) both inject near-identical resolution sentences. The prose.ts backstop fires during generation; the run.ts backstop fires post-generation.

While defense-in-depth is desirable, having two different injection strings for the same obligation creates inconsistency: stories that hit the prose.ts backstop get one sentence; stories that hit the run.ts backstop get another. This makes regression analysis harder.

**Recommendation**: Share a single exported constant `RESOLUTION_BACKSTOP_SENTENCE(culpritSurname: string): string` used by both sites.

---

## 3. Weak/Narrow Resolution Detection (Priority: High)

### 3.1 `RESOLUTION_RE` is too narrow

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 932, and `packages/prompts-llm/src/agent9-prose.ts` ~line 856

```typescript
const RESOLUTION_RE = /\b(confess(?:ed|es)?|arrest(?:ed)?|taken\s+into\s+custody|I\s+(?:did|killed)|guilty|you\s+committed|you\s+killed|the\s+murderer\s+is|it\s+was\s+you)\b/i;
```

This misses many valid golden-age resolution phrasings:
- "unmasked", "exposed", "revealed as", "named as the killer"
- "proved guilty", "brought to justice", "condemned"
- "caught red-handed", "the truth was out"
- "the killer proved to be", "the murderer was none other than"
- "surrendered", "faced justice"

A well-written resolution that does not happen to use any of the exact regex terms will fail the gate and trigger the backstop injection, polluting the story with a boilerplate sentence.

**Fix**: Expand `RESOLUTION_RE`:
```typescript
const RESOLUTION_RE = /\b(confess(?:ed|es)?|arrest(?:ed)?|taken\s+into\s+custody|I\s+(?:did|killed)|guilty|you\s+committed|you\s+killed|the\s+murderer\s+is|it\s+was\s+you|unmask(?:ed)?|expos(?:ed|es)|named\s+as|revealed\s+as|proved?\s+guilty|brought\s+to\s+justice|caught\s+red-handed|surrendered|condemned|the\s+killer\s+(?:was|proved?|is))\b/i;
```

### 3.2 `RESOLUTION_RE` is duplicated

The same pattern is hardcoded in two separate files (run.ts ~932 and prose.ts ~856). If one is updated, the other drifts.

**Fix**: Extract to a shared constant in a utility module (e.g. `@cml/story-validation` or a new `@cml/cml-constants` package), then import in both files.

---

## 4. Placeholder Leakage Detector — False Positive Risk (Priority: Medium)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 1306

```typescript
const placeholderGenericRolePattern =
  /\b(a gentleman|an inspector|a detective|a constable|a sergeant|a captain|a doctor)\b/gi;
```

`hasLeakage` is set to `true` when `genericRoleCount >= 12`. In a story featuring a character who is a doctor (e.g. Dr. Mallory Finch), organic prose references like "a doctor's duties", "she had known a doctor once", "more than a doctor could determine" are legitimate. In a 9-chapter story, 12 natural occurrences is not unusual.

The existing `roleSurnameCount > 0` check (which correctly catches "a doctor Finch") is the right signal. The raw `genericRoleCount >= 12` threshold is too coarse and will create false-positive hard stops.

**Fix**: Either raise the threshold to ≥25, or — better — only count generic role phrases that appear within 3 words of a capitalized name, to distinguish "a doctor" (organic) from "a doctor [Name]" (placeholder). Alternatively, exclude matches that immediately follow a proper noun or title.

---

## 5. `buildDeterministicGroundingLead` — Country-House Bias (Priority: Medium)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 220

All 5 lead sentence templates presuppose a large building with corridors:

```
"...carried rain in every corridor..."
"...met at the doorway..."
"...clung to coats and curtains..."
```

For a mystery set in a London flat, a railway carriage, an ocean liner, or a solicitor's office, these templates produce semantically inappropriate sentences. "Coats and curtains" in a first-class railway compartment is passable; "in every corridor" injected into a scene set in a single room is wrong.

The `fallback = "the estate"` default (line 225) compounds this — any mystery without explicit location profiles defaults to `"the estate"`.

**Fix**: Make the fallback location-agnostic (`"the scene"` or `"the premises"`). Consider adding location-type-aware template variants (corridor/hall → building; compartment/carriage → train; cabin/deck → ship).

---

## 6. `classifyFactValue` — Regex Misclassification Risk (Priority: Medium)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` (inside `enforceLockedFactValuePresence`)

The classification regex for `duration_minutes` matches:
```typescript
/\b(minute|second|hour)s?\b/
```

This will misclassify:
- "at the hour" → matched as `duration_minutes` (is actually `time`)
- "took an hour-long walk" → `duration_minutes` (probably correct)
- "within the half hour" → possibly `time` (ambiguous)

Additionally, the `time` classifier: `/(past|to|o'clock|quarter|half|AM|PM)/i` will match:
- "quarter of an hour" → classified as `time` (should be `duration_minutes`)
- "half the distance" → classified as `time` (nonsensical for a non-temporal fact)

**Fix**: Make `time` classification require at least one digit or hour-word near the trigger word. Add an exclusion for `quarter` and `half` when not adjacent to a time-anchor word.

---

## 7. `validateCmlUsageForProse` — Misplaced in Orchestrator (Priority: Medium)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 1350–1650

This 300-line function validates CML structural compliance (cast integrity, clue references, inference chain, etc.) but lives inside the agent9-run.ts orchestrator file. The same validation concerns are relevant to multiple agents (Agent 5, Agent 6, Agent 7 all consume CML). Embedding it here means:

- Validation logic is not reusable by other agents
- Any CML schema change requires hunting through 3000+ lines of prose orchestration code
- It cannot be independently tested

**Recommendation**: Move to `@cml/story-validation` or a new `@cml/cml-validation` package where it can be shared and independently tested.

---

## 8. `onBatchComplete` — Overlong Inline Closure (Priority: Low-Medium)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` — inside `runAgent9`

The `onBatchComplete` callback is an inline closure of approximately 200 lines that captures 15+ variables from the surrounding scope (`cml`, `ctx`, `locationProfiles`, `annotatedLockedFacts`, `scoreAggregator`, `scoringLogger`, `narrativeState`, `castDesign`, `runId`, `projectId`, and more).

A closure with 15+ captured variables is effectively a hidden parameter list. It is difficult to test, difficult to trace execution through, and changes to any captured variable's type require understanding the entire closure's usage.

**Recommendation**: Extract to a named function `processBatchComplete(params: BatchCompleteParams)` with an explicit parameter interface. This makes the dependency surface visible and the function independently testable.

---

## 9. Scoring Redundancy (Priority: Low)

`ProseScorer` is instantiated and `.score()` called in at least three distinct contexts:

1. Per-batch in `onBatchComplete` (cumulative + per-batch)
2. In `computeProseChapterScoreSeries` (per-chapter series)
3. In `rescoreAgent9ProsePhase` (full-pass re-score after schema repair)

Each invocation constructs a new `ProseScorer` with nearly identical argument objects built from the same `cml`, `cast`, `outline` locals. The scoring arguments are also assembled inline each time (no shared builder function).

If scoring configuration diverges between call sites, the three scores may be computed with different parameters, making comparisons meaningless.

**Recommendation**: Extract a single `buildProseScoreArgs(cml, castDesign, outline, narrativeState): ProseScoreArgs` function used by all three call sites.

---

## 10. Naming Confusion (Priority: Low)

- `normalizeChapterTitle` (singular) vs `normalizeChapterTitles` (plural) exist in the same file with different semantics. The singular is a pure transform of a single string; the plural iterates prose chapters and mutates in-place. The similar names lead to call-site confusion.

- `parseBooleanEnv` is a locally-defined utility in agent9-run.ts. It is a generic helper with no agent-specific logic and should live in a shared `utils` module.

- `loadWritingGuides` reads two hardcoded filenames from `notes/` directory. If a guide file is absent or renamed, it silently succeeds (returns `undefined`). There is no manifest or schema to validate guide presence.

---

## 11. `nameInText` — No Title-Prefix Matching (Priority: Low)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 876

```typescript
const nameInText = (name: string, text: string): boolean =>
  text.includes(name) || text.includes(extractSurname(name));
```

This function is used by `enforceSuspectEliminationPresence` and `enforceCulpritEvidencePresence` to detect whether a character is mentioned in chapter text. It will **miss**:
- "Dr. Finch" when the character's registered name is "Mallory Finch"  
- "Miss Voss" when the registered name is "Eleanor Voss"
- "Captain Hale" when registered as "Ivor Hale"

For golden-age mysteries where titled address is universal (Dr., Miss, Captain, Colonel, etc.), the surname-only check is the practical default. But if the LLM writes "Dr. Finch throughout the chapter without once writing "Finch" standalone, the function may fail to detect presence.

**Fix**: Also check `text.includes(extractSurname(name))` after stripping any leading title prefix from the name. Alternatively, normalize both sides: strip titles before matching.

---

## 12. `evaluateSceneGroundingCoverage` — Four Separate Chapter Walks (Priority: Low)

`evaluateProseReadability`, `evaluateSceneGroundingCoverage`, `evaluatePlaceholderLeakage`, and `evaluateChapterHeadingArtifacts` are each called sequentially in the release gate and each independently iterates over all chapters and their paragraphs. This is four O(N) scans of the same data.

For a 9-chapter story the overhead is negligible. For a 15-chapter story with long paragraphs it becomes notable. More importantly, four separate full-text concatenations (each with `.join("\n")` or similar) create four separate string allocations.

**Recommendation**: Combine into a single `evaluateProse(prose): ProseEvaluationResult` function that computes all four metrics in a single pass.

---

## Summary Table

| # | Issue | Location | Impact | Priority |
|---|-------|----------|--------|----------|
| 1.1 | "note the stopped clock" in `CHAPTER_TYPE_ADVANCE` | agent9-prose.ts | Wrong instruction for all non-clock mysteries | High |
| 1.2 | "The clock stood at X" in `INJECTION_TEMPLATES` | agent9-run.ts | Wrong/absurd prose injection for non-clock time facts | High |
| 1.3 | "before the hour was out" in resolution backstop | agent9-run.ts | Clock idiom in any story | High |
| 1.4 | `repairWordFormLockedFacts` is time-only | agent9-run.ts | Generic locked facts (places, objects) not repaired | High |
| 1.5 | `half:30, quarter:15` in `WORD_TO_NUM` | agent9-run.ts | Incorrect quantity semantics outside clock domain | Medium |
| 2.1 | Post-processing triplet called in 4 places | agent9-run.ts | Chain maintenance risk | High |
| 2.2 | Pronoun repair called twice | agent9-run.ts | Redundant work, possible conflict | Medium |
| 2.3 | 3 enforcement functions duplicate chapter-walk boilerplate | agent9-run.ts | ~90 lines duplicated | Medium |
| 2.4 | Dual resolution backstops with diverging sentences | both files | Inconsistent output, regression noise | Medium |
| 3.1 | `RESOLUTION_RE` too narrow | both files | Triggers backstop injection on valid resolutions | High |
| 3.2 | `RESOLUTION_RE` duplicated across two files | both files | Divergence risk on any change | Medium |
| 4   | `placeholderGenericRolePattern` false positive risk | agent9-run.ts | False hard stop for legitimate "a doctor" usage | Medium |
| 5   | `buildDeterministicGroundingLead` estate bias | agent9-run.ts | Broken lead sentences for non-estate settings | Medium |
| 6   | `classifyFactValue` regex misclassification | agent9-run.ts | Wrong template applied to some facts | Medium |
| 7   | `validateCmlUsageForProse` misplaced in orchestrator | agent9-run.ts | Not reusable, hard to test | Medium |
| 8   | `onBatchComplete` 200-line inline closure | agent9-run.ts | Untestable, 15+ implicit deps | Low-Med |
| 9   | ProseScorer instantiated 3× with inline args | agent9-run.ts | Config drift risk between scoring passes | Low |
| 10  | Naming confusion, local utilities, hardcoded guide filenames | agent9-run.ts | Maintainability | Low |
| 11  | `nameInText` misses titled addresses | agent9-run.ts | False-negative in enforcement functions | Low |
| 12  | Four separate chapter-walk evaluations at release gate | agent9-run.ts | Minor perf, structural debt | Low |

---

## Recommended Immediate Fixes (Breaking Issues for Non-Clock Mysteries)

If the codebase should handle any golden-age crime story type, the following three changes are essential before expanding the canary theme beyond clock-tampering:

1. **`CHAPTER_TYPE_ADVANCE["opening"]`**: Remove "note the stopped clock". Replace with neutral discovery instruction.
2. **`INJECTION_TEMPLATES["time"]`**: Replace "The clock stood at X" with neutral form using the fact description.
3. **`injectResolutionIfAbsent` / resolution backstop**: Replace "before the hour was out" with "before long". Expand `RESOLUTION_RE` to cover more valid resolution phrasings.

These are 3-line changes that prevent actively incorrect behaviour for any new story type.

---

## Iteration 2 — Prompt Construction, Linting, and Scene-Grounding Findings

### 13. `buildTimelineStateBlock` — Time-Domain Keyword Filter Silently Skips Non-Temporal Facts (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1854

```typescript
(lockedFacts ?? [])
  .filter((fact) => /time|clock|hour|minute|midnight|dawn|dusk|morning|afternoon|evening|night/i.test(...))
  .slice(0, 6)
  .forEach((fact) => lines.push(...));
```

The "FROZEN TIMELINE STATE" block injects only locked facts whose description or value contains a time-domain keyword. A locked fact like "weight of the victim: three stone" or "distance from the butler's pantry: forty feet" will be silently filtered out and never appear in the timeline state block injected into the prompt.

This is not a correctness failure (non-temporal facts appear in the separate `lockedFactsBlock`), but it means the block's stated purpose ("FROZEN TIMELINE STATE — DO NOT ALTER") is misleading when the story's primary locked facts are non-temporal. For a poison mystery where the key locked facts are all weights and quantities, this block emits nothing, and the `FROZEN TIMELINE STATE` header is never generated.

**Fix**: Either rename the block to "FROZEN FACT STATE" and include all locked facts, or add a complementary injection path for non-temporal locked facts so they receive the same "DO NOT ALTER" framing.

---

### 14. `sanitizeClueField` — Brittle Hardcoded Annotation Pattern Stripping (Priority: Low-Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1963

```typescript
const sanitizeClueField = (text: string): string =>
  text
    .replace(/The detail is explicit:\s*/gi, '')
    .replace(/This detail added\s+\w+\s+texture[^.]+\./gi, '')
    .replace(/without changing the essential deduction chain[^.]*\./gi, '')
    .replace(/in the case background[^.]*\./gi, '')
    .trim();
```

This function strips four specific LLM annotation phrases that Agent 3 (CML generator) has historically leaked into clue descriptions. The patterns are fragile:
- They match on exact phrasing. If the LLM produces `"The detail is clearly explicit:"` (with an adverb), the strip fails silently.
- `/in the case background[^.]*\./gi` will accidentally strip legitimate clue descriptions that happen to begin with "in the case background" — e.g. a clue like "In the case background, the victim's ledger was last seen..." would have its content removed.

More fundamentally, these annotation leaks are a symptom of Agent 3 prompt quality, not a prose problem. Sanitizing them in Agent 9 is treating the wrong layer.

**Fix**: Address annotation bleed in Agent 3's prompt/schema contract. Move `sanitizeClueField` to a validation step that fires immediately after Agent 3 output, not 4 agents later. If it must remain in Agent 9, add tests for each pattern.

---

### 15. `TEMPLATE_BLEED_PATTERNS` — Overly Broad False-Positive Risk (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1133

```typescript
const TEMPLATE_BLEED_PATTERNS: RegExp[] = [
  /\bmet them with\b/i,
  /\bthreaded through the scene\b/i,
  /\bclung to coats and curtains\b/i,
  ...
  /^by the time they reached\b/im,
  /affecting outdoor activities/i,
  /tense and brooding,? with an underlying sense of unease among the guests/i,
];
```

These patterns are reverse-engineered from specific template outputs of `buildDeterministicGroundingLead`. If Agent 2c's location profile changes sensory vocabulary (e.g. it generates a profile where curtains are legitimately mentioned), the pattern `/clung to coats and curtains\b/i` will flag legitimate prose as scaffold leakage.

Conversely, `/^by the time they reached\b/im` is an extremely common sentence structure in period fiction ("By the time they reached the library..." is organic prose) — it will flag any chapter that opens with this phrasing.

The `affecting outdoor activities` pattern is extremely broad — a chapter that mentions fog "affecting outdoor activities" in any context hits this gate.

**Fix**: Scope template bleed detection to the exact multi-sentence structural pattern that defines the template (e.g. require ALL of: location name + "carried X in every corridor" + sensory noun), not any individual phrase in isolation. Single-phrase matching has an unacceptable false-positive rate.

---

### 16. `buildChapterObligationBlock` — Hardcoded Mandatory Atmosphere List (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 2032

```typescript
lines.push(`  - Opening atmosphere (MANDATORY — validator enforced): the first paragraph MUST contain ` +
  `at least one of: rain / wind / fog / storm / mist / thunder / evening / morning / night / dawn / ` +
  `dusk / season / afternoon / midday / noon / midnight / twilight / sunrise / sunset / daylight / ` +
  `sunlight / overcast / cloudy / bright / dark. A chapter that omits all of these from its opening ` +
  `paragraph will be rejected.`);
```

This list is the sole authority for the atmosphere validation gate. Issues:
1. **Missing common legitimate terms**: "grey", "pale", "cold", "warm", "humid", "chill", "crisp", "damp", "drizzle", "haze", "lamplight", "firelight" are all valid period-appropriate atmosphere anchors that are not on the list.
2. **Overly strict**: A chapter that opens with a character action ("Voss crossed the threshold and stopped short") followed by an atmosphere cue in the second sentence fails the gate even though the chapter is well-grounded. The gate forces atmosphere into the FIRST paragraph, not just the opening chapter.
3. **Mismatch**: The gate is described as "MANDATORY — validator enforced" but the actual validation function in `evaluateSceneGroundingCoverage` checks different signals (named location present + sensory cues). If the two become further out of sync, the LLM is being told to satisfy a check that the validator doesn't actually run.

**Fix**: Either extend the list to include additional common weather/light terms, or replace the word-list gate with a more semantic check: "The first 100 words must include at least one sensory or temporal anchor." A shared constant used in both the prompt builder and the validator would prevent drift.

---

### 17. `hasDeterministicRepairableFailures` — Skips Repair on `needs_review` Status (Priority: Medium)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 2620

```typescript
const hasDeterministicRepairableFailures =
  validationReport.status === "failed"
  && Array.isArray(validationReport.errors)
  && validationReport.errors.some((err: any) =>
    err?.type === "locked_fact_missing_value" || err?.type === "pronoun_drift" || ...
  );
```

The deterministic repair pass (re-running `repairWordFormLockedFacts`, `enforceLockedFactValuePresence`, etc.) is only triggered when `validationReport.status === "failed"`. If the status is `"needs_review"` (1–5 major issues), but those issues include `locked_fact_missing_value` or `pronoun_drift`, the repair pass is never triggered.

In practice: a story with exactly 3 `locked_fact_missing_value` errors scores `"needs_review"` → EXIT:0, but the prose still contains the incorrectly-phrased locked facts that the deterministic repair could fix for free. The story is saved with minor factual errors that could have been repaired deterministically at zero cost.

**Fix**: Remove the `status === "failed"` guard. Apply the deterministic repair pass whenever repairable error types are present, regardless of overall status. The repair functions are idempotent and safe to run on any story.

---

### 18. `evaluateCandidate` — 100-Line Function Defined Inside a Retry Loop (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` — inside the batch generation loop

`evaluateCandidate` is defined as an inline function inside the per-batch retry loop, 4 levels of nesting deep. It captures ~12 variables from the enclosing scopes (`castCharacters`, `ledgerEntry`, `chapterNumber`, `pronounCheckingEnabled`, `hardFloorMissCount`, `isLastBatch`, etc.). It is approximately 100 lines long.

This is untestable in isolation — no test can call `evaluateCandidate` for a specific chapter without standing up the entire batch generation context. Any modification to the function risks accidentally depending on outer-scope variables that should be explicit parameters.

**Fix**: Extract to a top-level `evaluateProseChapterCandidate(chapter, params: EvalParams): EvalResult` function with an explicit parameter interface. The batch loop becomes a thin caller.

---

### 19. `compileSensoryAtoms` — Order-Dependent Regex Strip Can Produce Dangling Clauses (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 3050

```typescript
const atomise = (val: string): string => {
  ...
  result = val
    .replace(/^The\s+/i, '')
    .replace(/\bprovide[sd]?\b.*$/i, '')
    .replace(/\bfill[sed]?\b.*$/i, '')
    .replace(/\blingier[sed]?\b.*$/i, '')  // note: "lingier" is not an English word
    ...
    .replace(/,\s*(punctuated|interrupted|mingling|...) [^,]*$/i, '')
    .replace(/\s*as\s+if\s+.*$/i, '')
    .replace(/\s*—\s+.*$/i, '')
    .replace(/\s*,\s+[a-z][^,]{20,}$/i, '')
    ...
```

Problems:
1. **Typo**: `lingier` is not an English word. The intended word is `linger` or `lingers`. The `linger` regex will never match any real text.
2. **Order-dependent**: the strip operations are applied sequentially. A string like "the smell of damp stone, providing atmosphere" first removes "^The " → "smell of damp stone, providing atmosphere", then the `provid` pattern removes "providing atmosphere" → "smell of damp stone," leaving a trailing comma.
3. **Fallback**: "If still long after stripping, keep only the first 5 tokens" — this can produce semantically broken fragments like "The fire crackles and" (mid-phrase cut at 5 words).

**Fix**: Apply a single pass that extracts the noun phrase head before the first verb or clause marker, using a greedy noun-phrase regex rather than sequential removals. Also fix the typo (`lingers` not `lingier`).

---

### 20. `perBlockTokenCap` — Magic Number Constants Without Provenance (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 2780

```typescript
const perBlockTokenCap: Partial<Record<string, number>> = {
  pronoun_accuracy: 700,
  setting_refinement: 700,
  background_context: 450,
  fair_play_contract: 700,
  character_personality: 1400,
  location_profiles: 1000,
  texture_pool: 600,
  temporal_context: 850,
  continuity_context: 500,
  humour_guide: 850,
  craft_guide: 850,
};
```

These 11 constants are hardcoded without documentation of how they were derived. When a prompt section grows (e.g. adding a new profile field), the budget cap must be updated manually. If a cap is too tight, the block is silently truncated (the `truncateToTokenBudget` function appends `[truncated for prompt budget]`), which means the LLM sees partial constraint lists and behaves unpredictably.

There is no test that verifies these caps are still adequate given the current prompt content. A block that was 400 tokens when the cap was set may now be 900 tokens after accumulated improvements.

**Fix**: Add a development-time assertion that logs a warning when any block's actual token count exceeds 90% of its cap, so developers see when caps need updating. Alternatively, document the intended content size per block alongside each cap value.

---

## Iteration 3 — Validation Contracts, Retry Strategy, and Architecture Findings

### 21. `classifyFactValue` — `AM` / `PM` Matches `duration_minutes` Not `time` (Priority: Medium)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 614

```typescript
function classifyFactValue(canonical: string): FactValueType {
  if (/\b(past|to|o'clock|quarter|half)\b/i.test(canonical)) return 'time';
  if (/\b(minute|second|hour)s?\b/i.test(canonical)) return 'duration_minutes';
  ...
}
```

A locked fact value like "ten minutes past eleven" matches both regexes: the `time` check fires first and returns correctly. But "eight AM" does not contain "past", "to", "o'clock", "quarter", or "half" — it falls through to `duration_minutes` because it contains no regex match and then falls through to `generic`. The template injected would be `"The relevant value was established: eight AM."` — grammatically weak.

More critically: after `repairWordFormLockedFacts` converts "8 AM" to "eight o'clock", the canonical value stored in `lockedFacts` still says "eight o'clock" (or "ten minutes past eleven"), so `classifyFactValue` receives the canonical form and correctly routes to `time`. But if `repairWordFormLockedFacts` is bypassed (schema-repair path, or a non-temporal mystery), the unrepaired "8 AM" will hit `generic`.

The actual issue is that `AM`/`PM` and `in the morning`/`in the evening` are time classifiers that are missing from the `time` branch.

**Fix**: Add AM/PM detection to the `time` classifier:
```typescript
if (/\b(past|to|o'clock|quarter|half|AM|PM|a\.m\.|p\.m\.|in\s+the\s+(morning|afternoon|evening|night))\b/i.test(canonical)) return 'time';
```

---

### 22. `enforceMonthSeasonLockOnChapter` — [WORLD FIX C] Over-Aggressive Season Repair (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1260

The [WORLD FIX C] change removed the guard that only applied season repair when the month word appeared in chapter text. The stated reasoning is correct — seasonal drift can occur in chapters that don't mention the month. However the change means the repair now runs on **every chapter of every story**, scanning for forbidden seasonal vocabulary even in chapters that contain no seasonal vocabulary at all.

More importantly: the repair function replaces forbidden season words with season-appropriate words. In a story set in November (autumn), it replaces occurrences of "spring", "summer", "winter" — but "winter" and "summer" commonly appear in non-seasonal contexts in period fiction ("summer residence", "a summer of discontent", "winter of their years") that are not seasonal references and should not be replaced.

**Fix**: Restore a lighter version of the guard: skip repair if the chapter has zero seasonal vocabulary at all (no occurrences of any season word, month word, or weather word). Apply repair only when seasonal vocabulary is present.

---

### 23. `extractBeatFingerprints` — Beat Extraction Uses a Dubious Noun-Density Score (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 2070

```typescript
const scoreSentence = (s: string): number => {
  const words = s.split(/\s+/);
  const pronouns = words.filter(w => /^(he|she|they|it|him|her|his|their|its)$/i.test(w)).length;
  const nouns = words.filter(w => w.length >= 5 && !/^(which|where|when|that|this|with|from|have|been|will|would|could|should)$/i.test(w)).length;
  return nouns - pronouns;
};
```

The "noun" proxy counts any word of 5+ characters that isn't in a 13-word stoplist. This means:
- Common verbs like "investigate", "discover", "whispered", "confirmed" count as "nouns" — the score favors verb-dense sentences as much as noun-dense ones
- "Eleanor", "Finch", "alibi", "clock", "Quill" all score as nouns correctly
- "there", "their", "these", "those" (4 chars) pass through — they score as 0 but are not excluded either

The larger issue is that beat fingerprints are injected into the NSD prompt as FORBIDDEN REPEATS. If a poor-quality sentence (e.g. a generic description like "The room was dark and quiet.") scores higher than a plot-relevant sentence, that generic sentence gets fingerprinted and forbidden in future chapters, wasting a forbidden-repeat slot on low-value content.

**Fix**: Use a simple heuristic that prioritizes sentences containing at least one named character or investigation term. A two-condition filter (any cast member name present OR the sentence is ≥8 words containing evidence/observation/alibi terms) would reliably select the most plot-relevant beat sentences.

---

### 24. `buildChapterObligationBlock` Scene-Number Fallback — Act-Level Clearance Over-Firing (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 2040

```typescript
const matchingClearances: typeof exactClearances = exactClearances.length > 0
  ? exactClearances
  : idx === (scenesForChapter as any[]).length - 1
    ? clearanceScenes.filter((entry: any) => Number(entry?.act_number) === Number(scene?.act))
    : [];
```

The fallback fires for "the last scene in the batch" when no exact scene-number match exists. But with `proseBatchSize=1` (which is the canary default), EVERY batch has exactly 1 scene, which means EVERY chapter is always "the last scene in the batch". This means the act-level fallback fires for **every chapter in every act** when the exact scene-number match fails — which it nearly always does due to the known act-vs-global scene numbering mismatch described in the comments.

The intended behaviour was to apply the clearance obligation once, to the last chapter in each act. The actual behaviour applies it to every chapter in the act. This generates redundant clearance obligation text in the prompt for every chapter that shares an act with a clearance scene, increasing token usage and creating a confusing directive for chapters that are not supposed to be the clearance scene.

**Fix**: Track which clearance obligations have already been injected (by suspect name) and skip them for chapters before the designated one. Or, fix the root cause: normalize scene numbers at Agent 7 output time so the narrative outline's `sceneNumber` values align with the CML's `scene_number` values.

---

### 25. `sanitizeGeneratedChapter` — `anonymizeUnknownTitledNames` Applied Per-Paragraph on Every Chapter (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1790

`sanitizeGeneratedChapter` is called on every chapter immediately after LLM response parsing. It calls `anonymizeUnknownTitledNames(text, validCastNames)` on the title, summary, and every paragraph. For a 9-chapter story with 6 paragraphs each, this is 9×6 = 54 individual regex passes over the prose.

More critically, `anonymizeUnknownTitledNames` replaces "Title Surname" patterns (e.g. "Detective Harlow" → "the detective") using a broad pattern that matches any `Title [Capital][lowercase]+ ` sequence where the surname is not in the valid cast set. In a period mystery where a character might be referred to as "Doctor Strange" in a narrative aside about medical precedents, or where "Captain Hale's" title appears hyphenated in a different form, the replacement may fire incorrectly.

Additionally, the function is applied before `repairChapterPronouns` inside the batch loop. If `anonymizeUnknownTitledNames` changes "Dr. Finch said... He walked away" to "the doctor said... He walked away", the pronoun "He" now has a weakened antecedent that the pronoun repair function may incorrectly resolve.

**Recommendation**: Move `sanitizeGeneratedChapter` to after `repairChapterPronouns` so that pronoun repair works on the original named-character text.

---

### 26. `discriminating_test_scene` Stub Repair — Silently Mutates the CML Object (Priority: Medium)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 1540

```typescript
proseReqsNode.discriminating_test_scene = {
  act_number: derivedActNumber,
  scene_number: derivedSceneNumber,
  ...
};
```

This directly mutates `cml.CASE.prose_requirements.discriminating_test_scene` on the live CML object held in `ctx.cml`. The mutation:
1. Is not reflected in `ctx.cml` consistently — other parts of the pipeline that already hold a reference to the CML may see the mutated or unmutated form depending on JavaScript reference semantics
2. Produces a `ctx.warnings` entry but no corresponding note in the saved CML artifact
3. Could mask a real Agent 3 generation failure that should be surfaced as an error to the user rather than silently patched

The correct action when `discriminating_test_scene` is an empty stub is to either fail with an actionable error message (triggering Agent 3 retry) or, if back-filling is appropriate, to do so on a deep clone of the CML rather than the live object.

**Fix**: Deep-clone the CML node before patching, and either persist the patched form or expose it as a dedicated `patchedCml` variable to make the mutation visible.

---

### 27. `enforceSuspectEliminationPresence` — Reads from `cml.CASE.cast` Not `castDesign` (Priority: Low-Medium)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts` ~line 780

```typescript
const castNames: string[] = Array.isArray(cml?.CASE?.cast)
  ? cml.CASE.cast.map(...)
  : [];
if (castNames.length === 0) return prose;
```

This function reads cast from `cml.CASE.cast` (a flat array). But the canonical cast is stored in `castDesign.characters` (which has been through Agent 2's normalisation). These two may diverge if Agent 3 generates a CML with a slightly different cast structure than what Agent 2 produced.

`enforceCulpritEvidencePresence` immediately below uses `cml.CASE.culpability.culprits` for the culprit list, which is correct. But if `cml.CASE.cast` is missing or empty (e.g. if Agent 3 stored characters under a different path), `enforceSuspectEliminationPresence` silently no-ops without warning.

**Fix**: Pass `castDesign` explicitly as a parameter and read from `castDesign.characters`. Add a warning log if `cml.CASE.cast` and `castDesign.characters` have different contents.

---

### 28. `buildRetryMicroPromptDirectives` — Entropy Fix Template Contains Clock Idiom (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 4960

```typescript
directives.push(
  `REPAIR [opening_style]: ...` +
  `  • Time anchor — open with a specific time: 'At half past nine...' or 'At midnight...' or 'At nine o'clock at night...'`
);
```

The retry directive for `opening_style_entropy` failure offers three example sentence structures. Two of the three are clock-specific ("At half past nine...", "At nine o'clock at night..."). For a non-clock mystery, this directive would steer the LLM toward clock-face language in a story where clocks have no narrative significance, creating thematic noise.

**Fix**: Use more generic time-anchor examples: "That morning...", "By the time dawn broke...", "It was nearly four o'clock" — or better, derive the example from the story's `primaryAxis` value.

---

### 29. Missing: `extractSurname` — Defined Three Times (Priority: Low)

**File**: `apps/worker/src/jobs/agents/agent9-run.ts`

The `extractSurname` helper is defined identically as a local arrow function in three different locations:

1. Inside `enforceSuspectEliminationPresence` (~line 862)
2. Inside `enforceCulpritEvidencePresence` (~line 920)
3. As a one-liner inside `injectResolutionIfAbsent` (inline, not extracted)

All three are identical: `const extractSurname = (name: string) => name.trim().split(/\s+/).pop() ?? name`.

**Fix**: Hoist to a module-level utility function. One line, three duplicates removed.

---

### Updated Summary Table (Additions from Iterations 2–3)

| # | Issue | Location | Priority |
|---|-------|----------|----------|
| 13 | `buildTimelineStateBlock` filters non-temporal locked facts | agent9-prose.ts | Medium |
| 14 | `sanitizeClueField` brittle annotation strips | agent9-prose.ts | Low-Med |
| 15 | `TEMPLATE_BLEED_PATTERNS` broad false-positive phrases | agent9-prose.ts | Medium |
| 16 | Mandatory atmosphere word list doesn't match validator | agent9-prose.ts | Medium |
| 17 | Deterministic repair skipped on `needs_review` status | agent9-run.ts | Medium |
| 18 | `evaluateCandidate` 100-line function inside retry loop | agent9-prose.ts | Medium |
| 19 | `compileSensoryAtoms` order-dependent strip + typo ("lingier") | agent9-prose.ts | Low |
| 20 | `perBlockTokenCap` magic constants without provenance | agent9-prose.ts | Low |
| 21 | `classifyFactValue` misses AM/PM → falls to generic | agent9-run.ts | Medium |
| 22 | Season repair fires on all chapters after [WORLD FIX C] | agent9-prose.ts | Medium |
| 23 | Beat score function counts all 5-char words as "nouns" | agent9-prose.ts | Low |
| 24 | Act-level clearance fallback fires on every chapter with proseBatchSize=1 | agent9-prose.ts | Medium |
| 25 | `sanitizeGeneratedChapter` runs before pronoun repair | agent9-prose.ts | Low |
| 26 | `discriminating_test_scene` stub repair mutates live CML object | agent9-run.ts | Medium |
| 27 | `enforceSuspectEliminationPresence` reads wrong cast source | agent9-run.ts | Low-Med |
| 28 | Entropy retry directive uses clock-specific examples | agent9-prose.ts | Low |
| 29 | `extractSurname` defined identically in 3 places | agent9-run.ts | Low |

---

## Iteration 4 — Clue Matching, Semantic Families, and Prompt Budget Findings

### 30. `buildClueSemanticAnchorFamilies` — All 5 Families Are Clock/Forensic Domain (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 597

The 5 semantic anchor families used to establish clue presence in chapter text are:

1. `clock|dial|chime|hour|minute|time`
2. `sun|daylight|window|shadow`
3. `tamper|wound|reset|adjust|stopped|mechanism`
4. `dust|powder|residue|fingerprint|smudge`
5. `witness|statement|testimony|heard|saw|alibi`

All 5 map to physical-forensic investigation vocabulary from the clock-tampering canary. For a poison mystery, a blackmail mystery, or a financial-motive story, none of these families are relevant. A clue described as "the victim's financial desperation, noted in a letter to his solicitor" would match 0 of the 5 families, causing the semantic anchor fallback to score it at 0 — producing a false negative (clue declared absent when the LLM did include it).

**Fix**: Add at minimum four domain-agnostic families:

- `poison|arsenic|toxin|dose|pharmaceutical|prescription`
- `financial|debt|ledger|inheritance|will|bankrupt`
- `document|letter|telegram|written|manuscript|envelope`
- `emotional|behaviour|reaction|distress|outburst|demeanour`

This allows clue presence detection to work correctly across mystery subtypes beyond the physical-forensic domain.

---

### 31. `tokenMatchesText` — `slice(0, -1)` Fallback Produces False Positives (Priority: Low-Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 501

After suffix stripping via a known-suffix list fails to produce a match, the function falls back to:

```typescript
loweredText.includes(token.slice(0, -1))
```

For a token `"over"` (4 chars), `slice(0, -1)` produces `"ove"` — matching "movement", "proved", "discovered", "covered", "recovered". For `"dust"`, it produces `"dus"` — matching "industry", "adjust", "dusty". For `"timer"`, it produces `"time"` — matching any chapter that mentions time at all.

This catch-all fallback conflates root matching with substring noise. It trades false negatives (missed clue) for false positives (unrelated text counted as a clue match), which is arguably worse: the pipeline believes a clue obligation has been satisfied when it has not.

**Fix**: Remove the `slice(0, -1)` fallback entirely, or require the resulting root to be ≥ 5 characters before the fallback fires. A 3-character `"ove"` root is not a reliable signal of anything.

---

### 32. `BEHAVIOURAL_MARKERS` — Financial Terms Apply Relaxed Threshold to Factual Clues (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 563

The `BEHAVIOURAL_MARKERS` set includes: `financial`, `distress`, `struggling`, `desperate`, `desperation`. When `isBehaviouralClue` returns `true`, the token threshold for declaring a clue present drops from 0.6 to 0.35 — a 42% reduction in required evidence.

A factual clue like `"The victim's financial ledger, last seen on Saturday in the library"` would be classified as behavioural because it contains the word `financial`. It would then require only 35% of its tokens to appear in the chapter to be marked present, even though it is a concrete physical document clue that should require the standard factual threshold.

The relaxed threshold is appropriate for purely observational/emotional behavioural clues (e.g. "Hale appeared troubled throughout dinner") because emotional states are described using varied vocabulary. It is not appropriate for financial clues, which are factual.

**Fix**: Narrow the `BEHAVIOURAL_MARKERS` set to purely observational and emotional vocabulary. Remove `financial`, `distress`, `struggling`, `desperate`, `desperation`. If financial clues need a lower threshold, add a separate `DOCUMENTARY_MARKERS` set with an intermediate threshold (0.45) — distinct from both behavioural (0.35) and standard factual (0.6).

---

### 33. `chapterMentionsRequiredClue` — Token Threshold LOWER for More Descriptive Clues (Priority: Low-Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 645

```typescript
const factualThreshold = tokens.length >= 8 ? 0.45 : 0.6;
```

A clue with 10 tokens (a more specific description) needs only 45% of its tokens matched (4–5 tokens). A clue with 5 tokens (a simpler description) needs 60% matched (3 tokens). More descriptive clues are easier to satisfy, not harder.

The stated rationale would be that longer descriptions contain more optional adjectives, so the useful signal is diluted. But this creates a perverse incentive: writing verbose clue descriptions in Agent 3 lowers the validation bar in Agent 9. An author who writes `"the small ornate silver pocket watch with a cracked face, stopped at eleven minutes past ten"` (12 tokens) needs to match only 5 of them, while `"the victim's watch"` (3 tokens) needs 2 of 3.

More importantly, this threshold affects whether a chapter PASSES validation and gets committed to the story. A lower threshold means more chapters pass that should have retried.

**Fix**: Use a flat threshold of 0.55 for all factual clues regardless of length. If adjustment is needed for long descriptions, scale up slightly with length (e.g. `0.50 + tokens.length * 0.005` capped at 0.65) rather than down.

---

### 34. `inferBatchGatesFromError` — Regex Cross-Contamination Between Gate Categories (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 380

The gate classifier uses `/timeline/` to detect `temporal_continuity` errors. But "timeline" appears in clue-absence error messages: `"clue evidence [clue_timeline_anomaly] is absent from this chapter"`. If a chapter fails because a clue named `clue_timeline_anomaly` is missing, that failure is misclassified as a temporal continuity error, and the wrong retry directive category gets incremented.

Similarly, the `character_pronoun_consistency` gate classifier uses `/character/` — but Agent 5 clue descriptions frequently include the word "character" (e.g. `"character behaviour at the time of the incident"`). Clue-absence errors for these clues get misclassified as pronoun errors.

Misclassification of gate type is purely diagnostic — it doesn't change the retry behaviour — but it corrupts scoring diagnostics that the user sees in logs.

**Fix**: Use anchored regex patterns:
- temporal: `/\btimeline\s+test\b|\btemporal\s+continuity\b|\btime(?:line)?\s+constraint\b/`
- character: `/\bpronoun\b|\bgender\s+mismatch\b/`

---

### 35. `getRequiredClueIdsForScene` — Conflates Per-Act and Global Scene Numbers (Priority: High)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 516

```typescript
Number(entry?.scene_number) === Number(scene?.sceneNumber)
```

`entry.scene_number` (from `CASE.prose_requirements.clue_to_scene_mapping`) is the scene number **within the act** (1, 2, 3 per act). `scene.sceneNumber` (from the narrative outline) is the **global** scene number across all acts (e.g. 1–9 for a 9-scene story).

In Act 2, scene 1 of that act would have `entry.scene_number = 1` but `scene.sceneNumber = 4` (if Act 1 had 3 scenes). This mismatch means the filter finds zero matching clues for almost every scene in Acts 2 and 3.

The consequence is that the chapter obligation block for scenes in Act 2+ never includes specific required clue IDs. Those clues still appear in the general clue distribution passed to the chapter, but they are not flagged as required for that specific scene — so the pre-commit obligation validator cannot enforce their presence. This is likely why many runs see clue-absence warnings in later chapters despite clue injection being nominally enabled.

**Fix**: Normalize `entry.scene_number` to a global scene number by summing prior-act scene counts before comparison. Alternatively, add a translation step at Agent 7 output time so the outline's `sceneNumber` values use per-act numbering to match the CML schema.

---

### 36. `buildDiscriminatingTestChecklist` — Breaks for `proseBatchSize > 1` (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 4491

```typescript
const lateThreshold = Math.ceil(totalScenes * 0.70);
const isLateChapter = chapterNumbers.some(n => n >= lateThreshold);
```

`chapterNumbers` is derived from `chapterRange` (e.g. `"7"` for a single chapter or `"7-8"` for a batch). `totalScenes` is the global scene count.

For `proseBatchSize = 1` (canary default), chapter 7 of 9 yields `chapterNumbers = [7]` and `lateThreshold = ceil(9 * 0.70) = 7`. Correct.

For `proseBatchSize = 2`, chapter 4 of 5 batches covers scenes 7–8 of a 10-scene story. `chapterNumbers = [4, 5]` (batch indices, not scene numbers), and `lateThreshold = ceil(10 * 0.70) = 7`. The check `[4, 5].some(n => n >= 7)` is `false`, so the checklist never fires.

The discriminating test checklist is silently disabled for any story generated with batch size > 1 — meaning the LLM never receives the detailed discriminating test requirements in multi-chapter batches. This is a latent correctness failure for any future configuration that uses larger batch sizes.

**Fix**: Compare against chapter percentage (`chapterIndex / totalChapters`) rather than against raw scene count. Or pass total chapter count alongside total scene count and threshold against that.

---

### 37. `humourGuideBlock` and `craftGuideBlock` — Long Hardcoded Content, No Story-Tone Gating (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~lines 3566–3700

Both guides are ~2000–2500 character strings injected in full when the corresponding notes files exist (`DEFINITIVE_GUIDE_TO_HUMOUR.md`, `WHAT_MAKES_A_GOOD_WHODUNNIT.md`). Neither is conditioned on story tone, mystery subgenre, or arc position.

A grim financial thriller mystery receives the same humour guide as a light country-house comedy. The humour guide includes the instruction "Do not try to be funny. Try to be exact." — which could conflict with a world document where humour is explicitly permitted at the current arc position.

Additionally, neither guide is included in `perBlockTokenCap`, so they cannot be budget-cut when the prompt is near the token limit. They consume a fixed ~700 tokens each regardless of what else is in the prompt.

**Fix**: Gate humour guide injection on `worldDoc.humourPlacementMap` containing at least one permitted humour entry for the current story. Suppress for entirely serious stories. Add both guides to `perBlockTokenCap` so they participate in budget management.

---

### 38. `fairPlayGuardrails` — Hardcoded Inline, Not in `perBlockTokenCap`, Duplicates `fairPlayContractBlock` (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 3688

Four fair-play guardrail strings are added to `allGuardrails` unconditionally:

```typescript
guardrails.push("Do not introduce new clue-bearing characters in the final two chapters.");
guardrails.push("Do not introduce clues that the reader could not have discovered earlier.");
guardrails.push("Maintain consistent character behaviour throughout the story.");
guardrails.push("Avoid deus ex machina solutions.");
```

These are not listed in `perBlockTokenCap` and cannot be budget-cut. They are also conceptually duplicated with the structured `fairPlayContractBlock` injected from Agent 6's audit output — a prose run may contain fair-play constraints twice: once from Agent 6's structured output, once from these inline strings.

**Fix**: Move these 4 strings into the `fairPlayContractBlock` source, not into `allGuardrails`. This ensures they share the `fair_play_contract` token budget entry and are not emitted when `fairPlayContractBlock` is already present.

---

### 39. `sanitizeForContentPolicy` — Redaction Weakens BANNED PARAGRAPH Guardrail (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 5220

```typescript
const sanitizeForContentPolicy = (text: string): string =>
  text.replace(
    /\b(murder(?:ed|er|ers|ing)?|poison(?:ed|ing|ous)?|strang(?:led|ling|ulation)|...)/gi,
    '[crime-redacted]',
  );
```

The BANNED PARAGRAPH instruction tells the LLM "do not write prose that structurally resembles this paragraph." After sanitization, the paragraph reads: `"[crime-redacted] was carefully measured by [crime-redacted]ous means before the [crime-redacted] was found."` This vague, marker-filled text is less effective at preventing structural reproduction than the original, because the LLM cannot recognize the sentence structure it is supposed to avoid.

A more effective approach: send only the sentence skeleton (first 6 words + last 6 words) of the banned paragraph, without the crime-vocabulary content. The LLM can then avoid the structural scaffold without the content ever passing through the Azure content filter.

**Fix**: Replace word-level redaction with structural masking:
```typescript
const maskForContentPolicy = (text: string): string => {
  const words = text.split(/\s+/);
  if (words.length <= 12) return '[paragraph omitted]';
  return words.slice(0, 6).join(' ') + ' ... ' + words.slice(-6).join(' ');
};
```

---

### Updated Summary Table (Additions from Iteration 4)

| # | Issue | Location | Priority |
|---|-------|----------|----------|
| 30 | `buildClueSemanticAnchorFamilies` only has clock/forensic families | agent9-prose.ts | Medium |
| 31 | `tokenMatchesText` `slice(0,-1)` fallback produces false positives | agent9-prose.ts | Low-Med |
| 32 | `BEHAVIOURAL_MARKERS` includes financial terms → wrong threshold for factual clues | agent9-prose.ts | Medium |
| 33 | Factual token threshold lower (0.45) for MORE descriptive clues | agent9-prose.ts | Low-Med |
| 34 | `inferBatchGatesFromError` "timeline"/"character" regexes cross-contaminate | agent9-prose.ts | Low |
| 35 | `getRequiredClueIdsForScene` conflates per-act vs global scene numbers | agent9-prose.ts | High |
| 36 | `buildDiscriminatingTestChecklist` batch-size-dependent — breaks for batchSize > 1 | agent9-prose.ts | Low |
| 37 | humour/craft guides injected in full without story-tone gating | agent9-prose.ts | Low |
| 38 | `fairPlayGuardrails` hardcoded inline, outside token budget, duplicates contract block | agent9-prose.ts | Low |
| 39 | `sanitizeForContentPolicy` redaction weakens BANNED PARAGRAPH guardrail | agent9-prose.ts | Low |

---

## Iteration 5 — World-Brief Construction, Token Threading, and Threshold Divergence

### 40. `buildRevealGroundworkCues` — `REVEAL_GROUNDWORK_BANNED_TERMS` Produces Ungrammatical Cues (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1298

```typescript
const REVEAL_GROUNDWORK_BANNED_TERMS = ['culprit', 'murderer', 'killer', 'guilty', 'reveal', 'revelation', 'solution', 'confession'];
```

Each word in this set is replaced with `"hidden-truth"` before cues are injected into the prompt. This produces:

- `"The revelation of Dr. Finch's involvement"` → `"The hidden-truth of Dr. Finch's involvement"` (ungrammatical)
- `"the solution becomes clear"` → `"the hidden-truth becomes clear"` (sounds like a product)
- `"her guilty expression"` → `"her hidden-truth expression"` (nonsensical)
- `"the killer's motive"` → `"the hidden-truth's motive"` (broken possessive)

Ungrammatical LLM instructions produce confusing results — the model may attempt to "repair" the grammatical error in unexpected ways when interpreting the instruction.

**Fix**: Rather than word-level replacement, strip the entire sentence containing a banned term and replace the cue with a generic placeholder: `"Plant one subtle anomaly that can be re-read after the resolution."` This is safer than producing broken English.

---

### 41. `buildWorldBriefBlock` — `arcPosition = 'climax'` Never Fires for ≤10 Chapter Stories (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1384

```typescript
const arcPosition: ArcPosition =
  chapterIndex === totalChapters - 1
    ? 'resolution'
    : chapterIndex > Math.floor(totalChapters * 0.8)
      ? 'climax'
      : chapterIndex > Math.floor(totalChapters * 0.5)
        ? 'midpoint'
        : chapterIndex > Math.floor(totalChapters * 0.3)
          ? 'rising_action'
          : 'setup';
```

For a 10-chapter story (indices 0–9):
- Index 9 → `'resolution'` (correct)
- Index 8 → `8 > floor(10 * 0.8) = 8` → `8 > 8` is **false** → falls through to `'midpoint'` check → `8 > 5` → `'midpoint'`
- No index satisfies `n > 8` except 9, which is already routed to `'resolution'`

`'climax'` is **dead code** for any story with ≤10 chapters. The world document's climax arc beat, character voice fragments registered for the climax position, and humour permission for `scenePosition: 'climax'` are never injected.

**Fix**: Change `> 0.8` to `>= 0.8` and adjust the boundary so that chapters 8 and 9 of 10 are climax while only the final chapter is resolution:

```typescript
const arcPosition: ArcPosition =
  chapterIndex >= totalChapters - 1         ? 'resolution'
  : chapterIndex >= Math.floor(totalChapters * 0.8) ? 'climax'
  : chapterIndex > Math.floor(totalChapters * 0.5)  ? 'midpoint'
  : chapterIndex > Math.floor(totalChapters * 0.3)  ? 'rising_action'
  : 'setup';
```

---

### 42. `buildMacroArcPlan` — Linear Interpolation Skips Critical Archetypes for Short Stories (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 99

For a 5-chapter story, `step = (BASE_ARCHETYPES.length - 1) / (n - 1) = 9 / 4 = 2.25`. The selected indices are `[0, 2, 4, 6, 9]` → `[DISCOVERY, ALIBI_PROBE, EVIDENCE, REVERSAL, RESOLUTION]`. 

Skipped archetypes: `FIRST_CONTACT`, `RED_HERRING`, `ISOLATION`, `DISCRIMINATING`, `CONFRONTATION`.

A 5-chapter mystery has:
- No chapter dedicated to the discriminating test
- No chapter for a red herring
- No isolation / narrowing of suspects
- No confrontation scene

For the current canary theme this is partially hidden because `DISCRIMINATING` content leaks into other chapters via the discriminating test checklist. But structurally, the arc plan tells the LLM that no chapter has this purpose, meaning the story lacks the structural beats required for a fair-play mystery.

**Fix**: For `n ≤ 7`, use a hand-crafted minimum viable arc sequence rather than interpolation:

```typescript
if (n <= 7) {
  const SHORT_ARC = ['DISCOVERY', 'EVIDENCE', 'RED_HERRING', 'REVERSAL', 'DISCRIMINATING', 'CONFRONTATION', 'RESOLUTION'];
  return SHORT_ARC.slice(0, n);
}
```

This guarantees the essential structural beats are always present in a short mystery.

---

### 43. `generateProse` — `normalizeProseCastOrThrow` Result Not Threaded to Helper Functions (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 5575

```typescript
const cast = normalizeProseCastOrThrow(inputs.cast);
const castCharacters = cast.characters;
const castNames = castCharacters.map(c => c.name);
```

`normalizeProseCastOrThrow` normalizes cast once at the top of `generateProse`. But several helper functions called later still receive the raw `inputs.cast`:

- `buildContextSummary(inputs.caseData, inputs.cast)` — uses its own 4-level fallback chain for cast extraction
- `buildWorldBriefBlock(...)` — receives `worldDoc.castCharacters` which comes from `inputs.cast.characters` pre-normalization
- `buildChapterObligationBlock(...)` — receives `cast` but as `(inputs as any).cast`

The normalized `cast` is only used for `castNames`, `castCharacters` in the batch loop, and the pronoun repair calls. Helper functions that build prompt context blocks may see a different (un-normalized) cast structure, producing different character lists in different blocks of the same prompt.

**Fix**: Replace all `inputs.cast` calls downstream of the normalization with the normalized `cast` result. Pass `castCharacters` explicitly to helper functions instead of `inputs.cast`.

---

### 44. `lintBatchProse` — `matchingClearances` (P2-H) May Never Be Populated (Priority: Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 948

```typescript
export function lintBatchProse(
  batch: ProseBatch,
  options?: {
    matchingClearances?: ClearanceEntry[];
    ...
  }
): ProseLinterIssue[]
```

The P2-H clearance linting block inside `lintBatchProse` runs only when `options.matchingClearances` is provided. Checking the call sites for `lintBatchProse` in the batch retry loop shows that `matchingClearances` is computed (from the `matchingClearances` variable derived from the act-level fallback) and passed in — but only when the act-level fallback fires (issue #24). When the exact scene match succeeds, `matchingClearances` is `exactClearances`, which may be an empty array.

An empty `matchingClearances` is passed as the `options.matchingClearances` value. The P2-H check then runs with zero clearances to validate — emitting no issues, never triggering a retry for clearance violations.

The clearance obligation is stated in the prompt block (`buildChapterObligationBlock`) but is rarely enforced by the linter. Suspect clearance validation only occurs via `enforceSuspectEliminationPresence` (post-generation repair) — which injects a backstop sentence, not a LLM retry. Stories with missing clearance scenes go to press with injected sentences rather than proper narrative clearance.

**Fix**: Ensure `matchingClearances` is always populated with the applicable clearances for the current chapter, regardless of whether the exact scene match fires. Use the correct scene-number normalization (see issue #35) so exact matches work reliably.

---

### 45. Three Independent Token Threshold Code Paths for the Same Clue-Presence Check (Priority: Low-Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~lines 637–660

`chapterMentionsRequiredClue` contains three separately-coded threshold paths:

1. **Primary path**: `factualThreshold = tokens.length >= 8 ? 0.45 : 0.6` or `behaviouralThreshold = 0.35` (if `isBehaviouralClue`)
2. **CTX fallback path** (for clues in ledger context but not in distribution): `isBehavioural ? 0.35 : 0.6` — independent code block, does NOT apply the 0.45 reduction for ≥8 tokens
3. **Early-placement path**: `0.25` threshold (25% match = observation present early in the chapter)

These three independently-coded threshold paths for the same semantic operation have diverged. The CTX fallback path applies 0.6 for factual clues with ≥8 tokens (which should be 0.45 per the primary path). The behavioural detection logic is duplicated in all 3 paths.

Any future threshold change requires updating 3 locations. Missing one creates a silent difference in behaviour between the code paths.

**Fix**: Extract `resolveClueMatchThreshold(tokens: string[], isBehavioural: boolean, placement?: 'early' | 'standard'): number` and call it from all 3 paths.

---

### 46. `buildContextSummary` — `motiveLock` Reads from Wrong CML Path for Flat-Array Cast (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1598

```typescript
const culpritChar = (cmlCase.cast?.characters ?? []).find(
  (c: any) => culpritNames.includes(c.name)
);
```

The CML schema stores cast in one of two formats depending on which agent generated it:
- Object format: `{ characters: [...] }` — from Agent 2 normalized output
- Flat array format: `[...]` — from Agent 3's CML generator

`cmlCase.cast?.characters` is `undefined` when cast is a flat array (because `undefined?.characters` is `undefined`). So `culpritChar` is always `undefined` for flat-array cast structures, and `motiveLock` is always empty — the motive lock prompt constraint is silently dropped.

Meanwhile, `buildContextSummary` already handles the flat-array case 10 lines above (the `castCharacters` extraction uses a 3-branch fallback). But `culpritChar` lookup does not use this resolved `castCharacters` — it reaches back into the raw `cmlCase.cast`.

**Fix**: Use the already-resolved `castCharacters` local variable for the `culpritChar` lookup:

```typescript
const culpritChar = castCharacters.find((c: any) => culpritNames.includes(c.name));
```

---

### 47. `extractOpeningSentence` — Fails on Quote-Terminated and Ellipsis Sentences (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1000

```typescript
const firstSentence = paragraph.match(/^[^.!?]+[.!?]/)?.[0] ?? paragraph.slice(0, 120);
```

This regex fails in two common period-fiction scenarios:

1. **Quote-terminated sentences**: `"She was troubled," he thought.` — the regex stops at the comma before the closing quote, returning `"She was troubled,"` (a fragment)
2. **Unicode ellipsis**: `"The manor grew quiet…"` — the Unicode character `…` (U+2026) is not matched by `[.!?]`, so the fallback `paragraph.slice(0, 120)` fires and may cut mid-sentence

The result is that `classifyOpeningStyle` receives a fragment rather than a full sentence, producing misclassified styles and potentially incorrect entropy measurements for the opening paragraph.

**Fix**:
```typescript
const firstSentence = paragraph.match(/^[^.!?…"]+[.!?…"](?:\s|$)/)?.[0]
  ?? paragraph.match(/^[^.!?…]{20,}[.!?…]/)?.[0]
  ?? paragraph.slice(0, 150);
```

---

### Updated Summary Table (Additions from Iteration 5)

| # | Issue | Location | Priority |
|---|-------|----------|----------|
| 40 | `buildRevealGroundworkCues` "hidden-truth" replacement produces ungrammatical cues | agent9-prose.ts | Low |
| 41 | `buildWorldBriefBlock` arcPosition 'climax' never fires for ≤10 chapter stories | agent9-prose.ts | Medium |
| 42 | `buildMacroArcPlan` skips EVIDENCE/DISCRIMINATING/CONFRONTATION for 5-chapter stories | agent9-prose.ts | Medium |
| 43 | `normalizeProseCastOrThrow` result not threaded to all helper functions | agent9-prose.ts | Medium |
| 44 | `matchingClearances` (P2-H) never populated at call sites → clearance linting disabled | agent9-prose.ts | Medium |
| 45 | 3 independent token threshold code paths for same clue-presence check | agent9-prose.ts | Low-Med |
| 46 | `motiveLock` reads wrong CML cast path for flat-array structures | agent9-prose.ts | Low |
| 47 | `extractOpeningSentence` fails on quoted and ellipsis-terminated sentences | agent9-prose.ts | Low |

---

## Iteration 6 — Error Handling, Instruction Quality, and Structural Debt

### 48. String-Level Hard-Failure Deduplication Conflates Distinct Clue Failures (Priority: Low-Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 882

```typescript
const uniqueHardFailures = Array.from(new Set(hardFailures));
```

Two different clue IDs that happen to share the same Agent 5 description string produce identical error strings and are deduplicated to one entry. If clue A (`clue_financial_ledger`) and clue B (`clue_financial_ledger_copy`) both have the description `"financial ledger"` and both are absent from the chapter, the dedup reduces two distinct clue failures to one — and only one repair directive is emitted in the retry prompt. The LLM satisfies the one directive it sees and the other clue remains absent.

The deduplication comment says this is intentional ("avoid repeated verbatim directives") but the implementation trades false safety for silently hidden failures.

**Fix**: Deduplicate on clue ID rather than on error string. If two clues share a description, emit: `"clue_financial_ledger AND clue_financial_ledger_copy are both absent — include both references"`. One directive, both clue IDs visible.

---

### 49. `buildProseRequirements` — "$5–8 to Regenerate" Cost Estimate in Every Prompt (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 1680 (approx)

The string `"**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate."` is injected into every prose generation prompt.

LLMs have no concept of monetary cost. Including cost-pressure language in LLM prompts has no measurable positive effect on instruction following and may produce erratic behaviour (defensive over-completion, safety anchoring, verbose hedging). The string also exposes internal cost assumptions to the LLM context, which is irrelevant noise consuming prompt tokens.

**Fix**: Remove entirely. The validation consequence is already communicated by the `MANDATORY` labels and the structural requirements block.

---

### 50. Developer Prompt — Multiple `MANDATORY` / `VALIDATION` Labels Stack and Dilute (Priority: Low-Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 3570+

The `developer` system prompt contains at minimum six distinct validation-failure warnings:

1. `"MANDATORY — validator enforced"` (atmosphere gate)
2. `"MANDATORY RESOLUTION"` (final chapter label)
3. `"WORD COUNT CONTRACT (NON-NEGOTIABLE)"`
4. `"VALIDATION REQUIREMENT"` (scene-setting block)
5. `"MANDATORY directives"` (completeness contracts block)
6. `"⚠️ VALIDATION: If ANY checkbox above is unchecked... the chapter will FAIL validation"`

Research on LLM instruction-following shows that multiplying warning labels degrades selectivity: the model treats all as equally urgent and none as specifically actionable. When everything is "MANDATORY", nothing is.

**Fix**: Consolidate to a single validation summary at the end of the system prompt: `"The validator enforces: (1) atmosphere, (2) word count, (3) required clues, (4) scene grounding, (5) discriminating test checklist. All five must pass."` Reserve `MANDATORY` for the one hardest-to-achieve requirement only.

---

### 51. `runAtmosphereRepairIfNeeded` — Silent Failure With No Logging (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 5500

```typescript
// If LLM returns unparseable or empty replacements, the chapter is left unchanged (best-effort).
```

When `parsePhraseReplacementsResponse` returns an empty array after a non-empty `presentPhrases` list, the chapter is silently left unchanged. There is no `console.warn`, no counter, no diagnostic entry. If the atmosphere repair silently fails for every chapter in a run (e.g. Azure content filter blocking the phrase list or an LLM response format change), the pipeline continues without any signal that the repair step did not run.

This is especially problematic because the function is on the hot path for every canary run — if it silently breaks, all subsequent runs will show the same atmosphere phrases reappearing with no log evidence.

**Fix**:
```typescript
if (replacements.length === 0 && presentPhrases.length > 0) {
  console.warn(`[Agent 9] AtmosphereRepair ch${target.index + 1}: LLM returned 0 replacements for ${presentPhrases.length} present phrase(s). Chapter unchanged.`);
}
```

---

### 52. `applyPhraseSubstitutions` — Case Preservation Only Handles Leading-Capital (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 5530

```typescript
result = result.replace(pattern, (match) => {
  if (match[0] && match[0] !== match[0].toLowerCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
});
```

This only handles the leading-capital case (e.g. sentence-opening words). ALL-CAPS text (chapter headers, emphasis, era-appropriate typography such as `"SILENCE FELL"`) would have its replacement returned in mixed-case, breaking the formatting.

While ALL-CAPS is rare in prose paragraphs, it appears in chapter titles and section markers. The fix is straightforward:

```typescript
result = result.replace(pattern, (match) => {
  if (match === match.toUpperCase() && match !== match.toLowerCase()) {
    return replacement.toUpperCase();
  }
  if (match[0] && match[0] !== match[0].toLowerCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
});
```

---

### 53. `buildEnhancedRetryFeedback` — Clue Error Categorization Uses Fragile Natural-Language Matching (Priority: Low-Medium)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 5200

```typescript
// Categorize errors — clue errors must be separated FIRST to prevent them from
// falling into qualityErrors (which matches anything containing "chapter").
const clueValidationErrors = errors.filter(e => {
  const lc = e.toLowerCase();
  return lc.includes('clue') || lc.includes('evidence') || lc.includes('obligation');
});
```

This catches clue errors by looking for the words "clue", "evidence", or "obligation" in the error string. But:
- A `qualityErrors` fallback bucket matches anything containing "chapter" — and many clue error strings also contain "chapter" (e.g. `"Chapter 3: clue evidence 'financial ledger' is absent"`)
- If a new error type is introduced that contains "evidence" but is not a clue error (e.g. "insufficient evidence of scene grounding"), it would be misrouted

The comment acknowledges the fragility ("must be separated FIRST") but the fix is incomplete.

**Fix**: Classify clue errors by matching the structured error format (clue IDs always follow the pattern `clue_[a-z_]+`):
```typescript
const clueValidationErrors = errors.filter(e => /\bclue_[a-z_]+\b/.test(e));
```

This is unambiguous: any error containing a well-formed clue ID is a clue error, regardless of what other words are in the string.

---

### 54. `retryPacketHistory` — Accumulated and Never Pruned (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 5640

```typescript
retryPacketHistory.push({ chapterRange, packet: retryPacket });
```

For a 15-chapter story with 6 retry attempts per chapter (worst case), `retryPacketHistory` accumulates up to 90 entries. The entire history is passed as `priorBatchRetryPackets` to `shouldContinueRetry` and `classifyFailure` on every retry attempt.

These functions iterate over all prior packets to detect cycles and classify failure modes. By chapter 14 with multiple retries, each `classifyFailure` call must scan 80+ prior packets. The O(N²) growth pattern (each retry scans all prior retries) is latent — invisible on 9-chapter canary stories but significant for 15+ chapter stories.

**Fix**: Prune `retryPacketHistory` to the last 20 entries before passing to `shouldContinueRetry`:

```typescript
const recentHistory = retryPacketHistory.slice(-20);
const decision = shouldContinueRetry(attempt, recentHistory, ...);
```

This caps the scan cost at a constant and does not affect cycle detection, since cycles manifest within a small number of consecutive attempts.

---

### 55. `ARCHETYPE_CONTRACTS` — `mustNotContain` References Prior-Chapter State (Unfalsifiable) (Priority: Low)

**File**: `packages/prompts-llm/src/agent9-prose.ts` ~line 75

```typescript
ALIBI_PROBE: {
  mustNotContain: ['evidence already found in prior chapters'],
  ...
},
ISOLATION: {
  mustNotContain: ['new body or crime'],
  ...
},
```

The `mustNotContain` constraints are injected into the per-chapter prompt as structural requirements. The LLM cannot verify `"evidence already found in prior chapters"` without seeing all prior chapters — it has no prior-chapter memory in a per-chapter generation context. The LLM can only comply by guessing.

`ISOLATION: mustNotContain: ['new body or crime']` is falsifiable (the LLM can avoid introducing a new crime). But `ALIBI_PROBE: mustNotContain: ['evidence already found in prior chapters']` is not, because "prior chapters" is undefined in the current-chapter generation context.

Unfalsifiable constraints may produce defensive over-caution ("I won't mention any evidence at all in case it was previously found") or be ignored.

**Fix**: Remove `mustNotContain` clauses that reference prior-chapter state. Replace with positive constraints framed in current-chapter terms: `"This chapter introduces one new alibi challenge; it does not rehash evidence conclusions already drawn."` Reserve `mustNotContain` for concrete, within-chapter falsifiable conditions only.

---

### Updated Summary Table (Additions from Iteration 6)

| # | Issue | Location | Priority |
|---|-------|----------|----------|
| 48 | String-level hard-failure dedup conflates distinct clue failures | agent9-prose.ts | Low-Med |
| 49 | "$5–8 to regenerate" cost estimate in every prose prompt | agent9-prose.ts | Low |
| 50 | 6+ MANDATORY/VALIDATION labels in developer prompt dilute instruction following | agent9-prose.ts | Low-Med |
| 51 | `runAtmosphereRepairIfNeeded` silent failure with no logging | agent9-prose.ts | Low |
| 52 | `applyPhraseSubstitutions` only handles leading-capital, not ALL-CAPS | agent9-prose.ts | Low |
| 53 | Clue error categorization uses fragile natural-language matching | agent9-prose.ts | Low-Med |
| 54 | `retryPacketHistory` accumulated but never pruned → O(N²) growth | agent9-prose.ts | Low |
| 55 | `ARCHETYPE_CONTRACTS` `mustNotContain` references unfalsifiable prior-chapter state | agent9-prose.ts | Low |

---

## Consolidated Cross-Iteration Priority List

The 55 issues found across 6 iterations, grouped by actionability:

### Immediately Actionable (≤3 line changes, high reward)
- **#1.1** Remove "note the stopped clock" from opening chapter archetype
- **#1.2** Replace "The clock stood at X" injection template with neutral form
- **#1.3** Replace "before the hour was out" backstop with "before long"
- **#3.1** Expand `RESOLUTION_RE` with 10+ additional resolution phrasings
- **#29** Hoist `extractSurname` to module-level (remove 2 duplicates)
- **#46** Fix `motiveLock` to use resolved `castCharacters` local
- **#49** Remove "$5–8 to regenerate" from prose requirements block
- **#52** Add ALL-CAPS preservation to `applyPhraseSubstitutions`

### Structural Fixes (medium effort, high correctness impact)
- **#35** Fix `getRequiredClueIdsForScene` per-act vs global scene number mismatch
- **#41** Fix `arcPosition = 'climax'` boundary condition for ≤10 chapter stories
- **#17** Remove `status === "failed"` guard from deterministic repair trigger
- **#43** Thread normalized cast to all helper functions in `generateProse`
- **#2.1** Extract `applyStandardPostProcessingChain` to remove 4× duplication
- **#53** Replace natural-language clue error matching with structured `clue_[a-z_]+` regex

### Architectural (larger effort, long-term health)
- **#7** Move `validateCmlUsageForProse` to `@cml/story-validation`
- **#18** Extract `evaluateCandidate` from retry loop to top-level function
- **#8** Extract `onBatchComplete` closure to named function with explicit params
- **#3.2** Consolidate `RESOLUTION_RE` to a single shared constant
- **#30** Add domain-agnostic families to `buildClueSemanticAnchorFamilies`
- **#42** Replace linear interpolation with fixed arc for short stories (≤7 chapters)

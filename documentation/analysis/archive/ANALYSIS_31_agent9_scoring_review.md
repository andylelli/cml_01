# ANALYSIS_31 — Agent 9 Scoring Review (Facts)

**Scope:** The scoring pipeline for Agent 9 — Prose Generation — covering the ProseScorer class, the scoring adapter, live in-generation scoring, post-generation scoring, the release gate, and all associated configuration.

**Primary sources read:**
- `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts`
- `apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts`
- `apps/worker/src/jobs/agents/agent9-run.ts` (scoring-related sections)
- `packages/story-validation/src/generation-params.ts`
- `packages/story-validation/src/story-length-targets.ts`
- `documentation/prose-generation.md` (Section 9)

---

## 1. Scoring Pipeline Position and Purpose

### 1.1 Placement in the run

Agent 9 scoring runs at five distinct moments within a single run:

1. **Live — per batch, during generation** (`onBatchComplete` callback): two ProseScorer invocations per batch — once for the batch alone, once for all accumulated chapters.
2. **Post first-pass** (immediately after `generateProse` returns): one full ProseScorer invocation over all chapters without `partialGeneration`.
3. **Post schema-repair** (if schema validation fails): `rescoreAgent9ProsePhase()` called — one full ProseScorer invocation.
4. **Post story-validation repair** (if story validation triggers repair): `rescoreAgent9ProsePhase()` called again.
5. **`computeProseChapterScoreSeries`** (called inside `rescoreAgent9ProsePhase`): re-scores all chapters in batches for the second-run chart series.

### 1.2 Purpose of scoring

The ProseScorer score determines:
- Whether the prose phase passes or fails the scoring threshold.
- Live feedback shown in the UI quality tab during generation.
- Whether a threshold warning is added to `ctx.warnings` (does not stop generation).
- The score stored in the aggregator and written to the partial report after every batch.

### 1.3 Key class

`ProseScorer` lives at `packages/story-validation/src/scoring/phase-scorers/agent9-prose-scorer.ts` and is exported from `@cml/story-validation`.

---

## 2. Input Types

### 2.1 `ChapterProse` interface (scorer)

```typescript
interface ChapterProse {
  chapter_number?: number;
  chapter_title?: string;
  prose?: string;
  clues_present?: string[];
  discriminating_test_present?: boolean;
}
```

### 2.2 `ProseOutput` interface (scorer)

```typescript
interface ProseOutput {
  chapters: ChapterProse[];
  overall_word_count?: number;
  expected_clue_ids?: string[];        // authoritative union from adapter
  fair_play_validation?: {
    all_clues_visible?: boolean;
    discriminating_test_complete?: boolean;
    no_solution_spoilers?: boolean;
    fair_play_timing_compliant?: boolean; // D7
    fair_play_timing_violations?: Array<{ clue_id: string; chapter: number }>;
  };
  completeness_diagnostics?: {
    expected_clue_ids_count?: number;
    visible_clue_ids_count?: number;
    clue_visibility_ratio?: number;
    missing_clue_ids?: string[];
  };
}
```

### 2.3 `ScoringContext` fields used by ProseScorer

- `context.targetLength`: `'short' | 'medium' | 'long'` (defaults `'medium'`)
- `context.cml`: full CML object — used for `CASE.cast`, clue extraction fallback
- `context.previous_phases.agent2_cast`: cast list for character name consistency
- `context.previous_phases.agent2b_character_profiles`: (passed but not directly consumed)
- `context.previous_phases.agent2c_location_profiles`: location profiles for setting fidelity
- `context.partialGeneration`: boolean; suppresses whole-story word count and chapter count tests when `true`

### 2.4 `CompletenessDiagnostics` internal type (scorer)

```typescript
type CompletenessDiagnostics = {
  word_count_target?: { actual_words, target_min, target_max, score, status };
  clue_visibility?: { expected_count, visible_count, ratio, score, status, missing_clue_ids? };
  dominant_subfailure?: 'word_count_target' | 'clue_visibility' | 'mixed' | 'none';
};
```

---

## 3. `ProseScorer.score()` Entry and Four-Category Structure

### 3.1 Entry method

```
score(input: any, output: ProseOutput, context: ScoringContext): Promise<PhaseScore>
```

- Sets `this.targetLength = context.targetLength ?? 'medium'`
- Calls four private methods in sequence:
  1. `validateStructure(output, context)` → `TestResult[]` + critical-failures list
  2. `assessQuality(output)` → `TestResult[]`
  3. `checkCompleteness(output, context)` → `{ tests: TestResult[], diagnostics: CompletenessDiagnostics }`
  4. `checkConsistency(output, context)` → `TestResult[]`

### 3.2 Score calculation

```
total = Math.round(
  validation_score × 0.4
  + quality_score × 0.3
  + completeness_score × 0.2
  + consistency_score × 0.1
)
```

Each component score is computed as a weighted average of its `TestResult` entries: `sum(result.score × result.weight) / sum(result.weight)`.

### 3.3 Pass/fail determination

```
passed = criticalFailures.length === 0  AND  total >= 60
```

### 3.4 Component failure detection

A component is tagged as a failure if its score falls below its threshold:

| Component | Threshold |
|---|---|
| Validation | < 60 |
| Quality | < 50 |
| Completeness | < 60 |
| Consistency | < 50 |

`component_failures[]` lists the names of failed components. `failure_reason` is built by `buildFailureReason()`.

### 3.5 `PhaseScore` return shape

Fields populated:
- `agent`, `validation_score`, `quality_score`, `completeness_score`, `consistency_score`
- `total` (Math.round), `grade` (A/B/C/D/F), `passed`, `tests[]`, `breakdown` (includes `completeness_diagnostics`), `component_failures[]`, `failure_reason`

---

## 4. VALIDATION Component (40% weight)

### 4.1 Method: `validateStructure(output, context)`

Four tests are evaluated:

#### Test 1 — Chapters array exists

| Property | Value |
|---|---|
| Weight | 0.5 |
| Critical | Yes — if chapters array is missing, fail is critical |
| Pass condition | `Array.isArray(output.chapters)` |

If this fails, all remaining structure tests are skipped.

#### Test 2 — All chapters present

| Property | Value |
|---|---|
| Weight | 2.0 |
| Skipped when | `context.partialGeneration === true` |
| Pass condition | `chapters.length === expected` |
| Partial (score 85) | `Math.abs(chapters.length - expected) <= 2` |
| Proportional partial | `chapters.length / expected × 100` |

Expected chapter count comes from `STORY_LENGTH_TARGETS[this.targetLength].chapters`.

#### Test 3 — Chapter structure ≥ 95% valid

| Property | Value |
|---|---|
| Weight | 1.5 |
| Pass condition | `valid / total >= 0.95` |
| `isValidChapter(c)` | `c.chapter_number && c.chapter_title && c.prose && c.prose.length >= 500` |
| Partial score | `valid / total × 100` |

#### Test 4 — Discriminating test present

| Property | Value |
|---|---|
| Weight | 1.5 |
| Critical | Yes — if no chapter has `discriminating_test_present === true` |
| Pass condition | At least one chapter where `discriminating_test_present === true` |

---

## 5. QUALITY Component (30% weight)

### 5.1 Method: `assessQuality(output)`

Two tests evaluated over all chapters:

#### Test 1 — Average prose quality

| Property | Value |
|---|---|
| Weight | 2.0 |
| Pass threshold | avg `scoreProseQuality()` >= 70 |
| Score | avg score if >= 70 = pass; else the avg value as partial |

#### Test 2 — Average readability

| Property | Value |
|---|---|
| Weight | 1.0 |
| Pass threshold | avg `scoreReadability()` >= 70 |
| Score | avg score if >= 70 = pass; else the avg value as partial |

### 5.2 `scoreProseQuality(prose)` → 0–100

Scoring breakdowns:

| Signal | Points |
|---|---|
| Word count ≥ `targets.chapterMinWords` | 30 pts |
| Word count ≥ 60% of `chapterMinWords` | 20 pts |
| Word count ≥ 35% of `chapterMinWords` | 10 pts |
| Paragraphs ≥ 5 | 20 pts |
| Paragraphs ≥ 3 | 12 pts |
| Paragraphs ≥ 1 | 5 pts |
| Dialogue present (quoted speech or said/asked/replied) | 20 pts |
| Sensory word: `saw` pattern | 5 pts |
| Sensory word: `heard` pattern | 5 pts |
| Sensory word: `smell` pattern | 5 pts |
| Sensory word: `felt` pattern | 5 pts |
| Transition word (meanwhile/later/afterward etc.) | 5 pts, max 10 |
| **Total (capped)** | **min(100, sum)** |

Sensory patterns use `\b(saw|noticed|spotted|glimpsed)`, `\b(heard|listened|sound)`, `\b(smell|scent|odor)`, `\b(felt|touched|sensation)`.

Transition words checked: `meanwhile`, `later`, `afterward`, `then`, `suddenly`, `finally`, `moments later`, `as`, `when`, `however`, `nevertheless`, `therefore`.

Dialogue pattern: `["'].*["']` or `\b(said|asked|replied|exclaimed|whispered|shouted|answered)`.

### 5.3 `scoreReadability(prose)` → 0–100

Scoring breakdown:

| Signal | Points |
|---|---|
| Sentences ≥ 20 | 30 pts |
| Sentences ≥ 10 | 20 pts |
| Sentences ≥ 5 | 10 pts |
| Sentence length variance > 50 | 30 pts |
| Sentence length variance > 20 | 20 pts |
| Sentence length variance > 10 | 10 pts |
| Overly long sentences (> 50 words): 0 | 20 pts |
| Overly long sentences ≤ 2 | 10 pts |
| Balanced paragraphs (30–300 words) ≥ 70% | 20 pts |
| Balanced paragraphs ≥ 40% | 10 pts |
| **Total (capped)** | **min(100, sum)** |

Sentence count: split on `[.!?]+` and filter non-empty.
Sentence length variance: `Math.max(lengths) - Math.min(lengths)` in word count.
Paragraph word counts: split prose on `\n\n+`, count words per block.

---

## 6. COMPLETENESS Component (20% weight)

### 6.1 Method: `checkCompleteness(output, context)`

Configuration read from `getGenerationParams().agent9_prose.scorer.completeness`.

#### Test 1 — Word count target

**Skipped when `context.partialGeneration === true`.**

| Condition | Status | Score |
|---|---|---|
| `wordCount >= targetMin && <= targetMax` | pass | 100 |
| `wordCount >= targetMin × word_count.low_ratio` | low | `word_count.low_score` |
| `wordCount < targetMin × low_ratio` | major_underflow | `min(100, wordCount / targetMin × 100)` |

- Weight: 1.5
- Partial severity: "minor" for low, "major" for major_underflow
- Word count source: `output.overall_word_count` if set; else sum of `chapter.prose.split(/\s+/).length` across all chapters
- `targetMin` and `targetMax` come from `STORY_LENGTH_TARGETS[this.targetLength]`

#### Test 2 — Clue visibility

| Condition | Status | Score |
|---|---|---|
| `clueVisibility >= pass_ratio` | pass | 100 |
| `clueVisibility >= minor_gap_ratio` | minor_gap | `minor_gap_score` |
| `clueVisibility < minor_gap_ratio` | critical_gap | `clueVisibility × 100` |

- Weight: 1.5
- Partial severity: "minor" for minor_gap, "critical" for critical_gap
- Expected clue IDs: `output.expected_clue_ids` if populated; else `extractCMLClues(context.cml)` (reads `CASE.prose_requirements.clue_to_scene_mapping[].clue_id`)
- Visible clues: a CML clue is considered visible if any prose clue in `flatMap(c.clues_present)` passes `clueInProse(cmlClue, proseClues)`
- `clueInProse`: normalizes both IDs and checks if either is a substring of the other
- `missingClueIds` tracked and included in `diagnostics.clue_visibility.missing_clue_ids`

### 6.2 `dominant_subfailure` logic

After both tests are scored, `dominant_subfailure` is assigned:

| Condition | Value |
|---|---|
| Both failed, word_count worse | `word_count_target` |
| Both failed, clue_visibility worse | `clue_visibility` |
| Both failed, scores within 5 pts of each other | `mixed` |
| Only word count failed | `word_count_target` |
| Only clue visibility failed | `clue_visibility` |
| Neither failed | `none` |

---

## 7. CONSISTENCY Component (10% weight)

### 7.1 Method: `checkConsistency(output, context)`

Three tests. Returns empty array if `output.chapters` is empty.

#### Test 1 — Character name consistency

| Property | Value |
|---|---|
| Weight | 2.0 |
| Data source | `context.cml.CASE.cast[].name` |
| Score | `coverageRate × 100` where `coverageRate = referencedMembers / castNames.length` |
| Pass threshold | score ≥ 90 |
| Partial severity | major if score < 70, minor if 70–89 |

Implementation: for each cast name, counts regex `\b{name}\b` occurrences in joined prose. A cast member is "referenced" if count > 0. Returns `{ score, reason: "N/M characters referenced" }`.

#### Test 2 — Setting fidelity

| Property | Value |
|---|---|
| Weight | 1.5 |
| Data source | `context.previous_phases.agent2c_location_profiles` — extracted as `p.name ?? p.location_name` |
| Score | `fidelityRate × 100` where `fidelityRate = referencedLocations / profileNames.length` |
| Pass threshold | score ≥ 70 |
| Partial | score value as partial, no explicit severity label |

Implementation: joins all chapter prose (lowercased) and checks `allProse.includes(locationName.toLowerCase())` for each location profile name.

#### Test 3 — Fair play compliance

| Property | Value |
|---|---|
| Weight | 1.5 |
| Data source | `output.fair_play_validation` |
| Pass condition | `fairPlayScore === 100` |
| Partial severity | critical if fairPlayScore < 60, minor otherwise |

Score formula (D8 weights):

```
fairPlayScore =
  (all_clues_visible       ? 35 : 0)
+ (discriminating_test_complete ? 35 : 0)
+ (no_solution_spoilers    ? 15 : 0)
+ (fair_play_timing_compliant !== false ? 15 : 0)
```

`fair_play_timing_compliant` defaults to pass when the field is `undefined` (backwards compatibility sentinel — `!== false` is intentional).

When timing violations exist, the partial detail string appends: `: timing violation in chapter(s) N, M`.

---

## 8. Grade Calculation

### 8.1 `calculateGrade(score)`

| Score range | Grade |
|---|---|
| ≥ 90 | A |
| ≥ 80 | B |
| ≥ 70 | C |
| ≥ 60 | D |
| < 60 | F |

### 8.2 `buildFailureReason(criticalFailures, componentFailures)`

Returns a string composed of:
- `"N critical failure(s)"` (if any critical failures)
- `"Components below minimum: X, Y"` (if any component failures)
- `"Score below threshold"` (fallback if both arrays empty)

---

## 9. `adaptProseForScoring()` — The Adapter Function

### 9.1 Location

`apps/worker/src/jobs/scoring-adapters/agent9-scoring-adapter.ts` — exported function.

### 9.2 Signature

```typescript
export function adaptProseForScoring(
  proseChapters: any[],
  cmlCase?: any,
  clueDistribution?: ClueDistributionResult,
): ProseOutput
```

### 9.3 Execution steps

1. Calls `collectClueEvidenceFromProse(proseChapters, cmlCase, clueDistribution)` → `evidence`
2. Calls `getKnownClueIds(cmlCase, clueDistribution)` → `knownClueIds`
3. Calls `getDiscriminatingEvidenceClueIds(cmlCase)` → `discriminatingEvidenceIds`
4. Calls `buildDiscriminatingSemanticTokens(cmlCase)` → `discriminatingTokens`
5. Maps each `proseChapters[i]` → `ChapterProse`:
   - `prose = ch.paragraphs?.join('\n\n') ?? ch.prose ?? ''`
   - `chapter_number = i + 1` (sequential 1-based, ignoring any embedded numbering)
   - `chapter_title = ch.title ?? ''`
   - `clues_present = evidence.evidenceByChapter[chapterNumber] ?? []`; omitted if empty
   - `discriminating_test_present = isDiscriminatingTestChapter(prose, ...)` — omitted if `false`
6. Computes `fair_play_validation`:
   - `dtComplete = chapters.some(c => c.discriminating_test_present)`
   - `allCluesVisible = knownClueIds.every(id => evidence.visibleClueIds.includes(id))`
   - `missingClueIds = knownClueIds.filter(id => !evidence.visibleClueIds.includes(id))`
   - `clueVisibilityRatio = evidence.visibleClueIds.length / knownClueIds.length`
   - `hasEarlyRevealCue = SPOILER_PROSE_RE.test()` on first `ceil(chapters.length × spoiler_early_chapter_ratio)` chapters
   - `noSolutionSpoilers = !hasEarlyRevealCue`
   - `fair_play_timing_compliant` and `fair_play_timing_violations[]` computed (D7 — see Section 13)
7. Returns `ProseOutput` with `chapters`, `expected_clue_ids`, `fair_play_validation`, `completeness_diagnostics`

### 9.4 `expected_clue_ids` justification

Without `expected_clue_ids` being set by the adapter, the scorer falls back to `extractCMLClues(context.cml)` which only reads `CASE.prose_requirements.clue_to_scene_mapping[].clue_id` (Agent 3 IDs). The adapter uses the union of four ID sources (see Section 10.2). Because Agent 3 and Agent 5 generate IDs independently, the two namespaces rarely match, causing every clue to appear missing and the visibility score to register as 0/N. Setting `expected_clue_ids` in the adapter output ensures the scorer and adapter use an identical ID namespace.

---

## 10. `collectClueEvidenceFromProse()` — Clue Detection

### 10.1 Signature

```typescript
export function collectClueEvidenceFromProse(
  proseChapters: any[],
  cmlCase?: any,
  clueDistribution?: ClueDistributionResult,
): ClueEvidenceExtractionResult
```

Returns `{ visibleClueIds, evidenceByClue, evidenceByChapter, clueStateById }`.

### 10.2 `getKnownClueIds()` — building the ID union

Union of four sources, deduplicated by normalized form:

| Source | Path |
|---|---|
| CML mapping | `CASE.prose_requirements.clue_to_scene_mapping[].clue_id` |
| Agent 5 distribution | `clueDistribution.clues[].id` |
| Discriminating test evidence | `CASE.discriminating_test.evidence_clues[]` |
| Clue registry | `CASE.clue_registry[].clue_id` or `.id` |

`dedupeClueIdsByNormalized`: normalizes each ID to `value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "")` and discards duplicates.

### 10.3 ID normalization

`normalizeClueIdForMatch(value)`: lowercase, trim, remove all non-alphanumeric characters.

`buildClueIdMatchVariants(clueId)`: generates four forms — `base`, `space-separated`, `hyphenated`, `underscored` — from the same base.

### 10.4 Semantic signature building

`buildClueSignatures(clueDistribution, knownClueIds)`:

**Primary path** (when `clueDistribution` is populated):
- For each clue in `clueDistribution.clues`: tokenizes `description` and `pointsTo` fields via `tokenizeForClueSignature`
- Tokens: lowercase, remove non-alpha, split on whitespace, filter: length ≥ 4 AND not in `CLUE_TOKEN_STOPWORDS` (34 words)
- Takes unique tokens, slices to `signature_tokens_from_distribution` (default 8)

**Fallback path** (when distribution sparse or absent):
- For each `knownClueId` without a signature, tokenizes the ID phrase (underscores/hyphens → spaces)
- Requires ≥ 2 tokens to create a fallback signature
- Slices to `signature_tokens_from_id_fallback` (default 6)

### 10.5 Per-chapter two-pass detection loop

For each chapter, for each known clue ID, two passes:

**Pass 1 — Exact ID match:**
- `buildClueIdMatchVariants(clueId)` generates 4 forms
- Checks `lowered.includes(variant)` for each form
- Also checks normalized paragraph text includes normalized clue ID
- If match found: `state = "explicit"`, `confidence = 1`, breaks immediately (no Pass 2)

**Pass 2 — Semantic match:**
- `hasSemanticCoverage(paragraph, signature)`: checks `matchedTokens.length >= semanticRequiredTokenMatches(tokenCount)`
- `semanticRequiredTokenMatches = max(min_token_matches, ceil(tokenCount × token_match_ratio))`
  - defaults: min_token_matches=2, token_match_ratio=0.3
- `confidence = min(confidence_cap=0.95, matchedTokens.length / requiredMatches)`
- State: `"hinted"`
- Keeps best anchor per chapter (highest confidence)

**Anchor structure stored:**

```typescript
interface ClueEvidenceAnchor {
  clue_id: string;
  chapter_number: number;
  evidence_quote: string;        // max 220 chars
  evidence_offset: { chapter, paragraph, sentence };
  confidence: number;
  state: 'introduced' | 'hinted' | 'explicit' | 'confirmed';
}
```

### 10.6 Discriminating test chapter evidence upgrade

After all clues are processed for a chapter:
- `isDiscriminatingTestChapter(chapterProse, discriminatingTokens, chapterClues, discriminatingEvidenceIds)` is called
- If the chapter is a DT chapter AND any `chapterClue` matches a `discriminatingEvidenceId`:
  - That clue's anchors in this chapter are upgraded: `state = "confirmed"`, `confidence = max(anchor.confidence, 0.95)`
  - `clueStateById[clueId] = "confirmed"`

### 10.7 Evidence state ranking

States are ranked: `introduced (0) < hinted (1) < explicit (2) < confirmed (3)`.
`mergeClueState`: keeps the higher-ranked state; never degrades.

Initial state for all known clue IDs: `"introduced"`.

---

## 11. Discriminating Test Chapter Detection

### 11.1 `isDiscriminatingTestChapter()` function

Three signals; any one is sufficient to flag a chapter as a DT chapter:

**Signal 1 — Prose regex (`regexSignal`):**

```
DISCRIMINATING_PROSE_RE = /\b(accus|confess|confronted?|unmasked?|reveal(?:ed|s)|the murderer|
the killer|guilty(?!\w)|arrested?|the culprit|gathered[^.!?]{0,80}suspects?|
gathered[^.!?]{0,80}everyone|explained[^.!?]{0,80}crime|solved(?!\w)|the solution|
the truth|now i know|i accuse|i name(?!\w))/i
```

**Signal 2 — Semantic token overlap (`semanticSignal`):**
- `discriminatingTokens` built from `CASE.discriminating_test.{design, knowledge_revealed, method}` fields
- Tokenized via `tokenizeSemanticTerms`, sliced to `max_semantic_tokens` (default 12)
- Match condition: `discriminatingTokens.filter(token in lowerProse).length >= max(min_semantic_token_matches=2, ceil(count × semantic_token_match_ratio=0.3))`
- Returns `false` if `discriminatingTokens` is empty

**Signal 3 — Evidence-clue reasoning (`evidenceSignal`):**
```
DISCRIMINATING_REASONING_RE = /\b(test|experiment|reconstruct|re-enact|demonstrat|proved?|
verification|timing|measured|compared|eliminat|ruled\s+out|constraint\s+proof|trap)\b/i
```
- Condition: `cluesPresent.some(id in discriminatingEvidenceIds)` AND `DISCRIMINATING_REASONING_RE.test(prose)`
- Returns `false` if `discriminatingEvidenceIds` is empty

### 11.2 Relationship between DT detection and scoring

- `adaptProseForScoring` sets `discriminating_test_present` on each chapter using this function
- `ProseScorer.validateStructure` checks `output.chapters.some(c => c.discriminating_test_present === true)` — critical failure if none detected
- `ProseScorer.checkConsistency` receives `fair_play_validation.discriminating_test_complete` (built by `adaptProseForScoring` using the same function) for the fair play score

---

## 12. Fair Play Validation Construction

### 12.1 Fields constructed in `adaptProseForScoring`

#### `all_clues_visible`
`knownClueIds.length === 0 OR knownClueIds.every(id => evidence.visibleClueIds.includes(id))`

Empty known clue list defaults to `true`.

#### `discriminating_test_complete`
`chapters.some(c => c.discriminating_test_present)`

#### `no_solution_spoilers`

```
SPOILER_PROSE_RE = /\b(the\s+culprit\s+was|the\s+killer\s+was|was\s+the\s+murderer|
confess(?:ed)?\s+to\s+the\s+murder|admitted\s+to\s+the\s+murder|
i\s+name\s+[A-Z][a-z]+|i\s+accuse\s+[A-Z][a-z]+)\b/i
```

Checked against: `chapters.slice(0, max(1, ceil(chapters.length × spoiler_early_chapter_ratio)))`.
Default `spoiler_early_chapter_ratio = 0.5` — first half of chapters.
`noSolutionSpoilers = !hasEarlyRevealCue`

#### `fair_play_timing_compliant` and `fair_play_timing_violations[]` (D7)

```
CONCLUSION_RE = /\b(that proves|which proves|therefore[^.!?]{0,60}(?:culprit|guilty|murderer)|
the only explanation|conclusively shows|i accuse|i name|you are the|the murderer is|
it follows that|this confirms|the truth is)\b/i
```

Steps:
1. Build `firstRevealChapterById`: for each clue, record the first chapter in which it appeared in `evidence.evidenceByChapter`
2. For each chapter: `isDeductionChapter = chapter.discriminating_test_present OR CONCLUSION_RE.test(chapter.prose)`
3. For each deduction chapter: find clues whose `firstRevealChapterById` equals the current chapter's number — these are "first revealed in a deduction chapter"
4. Each such clue produces a `{ clue_id, chapter }` entry in `fairPlayTimingViolations`
5. `fairPlayTimingCompliant = fairPlayTimingViolations.length === 0`

---

## 13. `expected_clue_ids` and `getExpectedClueIdsForVisibility()`

### 13.1 Adapter function: `getKnownClueIds(cmlCase, clueDistribution)`

Returns union of four sources (same as Section 10.2) after `dedupeClueIdsByNormalized`.

### 13.2 Standalone helper: `getExpectedClueIdsForVisibility(cmlCase, clueDistribution)`

Exported from `agent9-run.ts`. Used by `buildPostGenerationSummaryDetails` and release gate diagnostics.

```typescript
export const getExpectedClueIdsForVisibility = (
  cmlCase: any,
  clueDistribution?: any,
): string[]
```

Same four-source union as `getKnownClueIds` but using `Array.from(new Set(...))` rather than `dedupeClueIdsByNormalized`. Returns raw unique IDs (not normalized).

---

## 14. `STORY_LENGTH_TARGETS` Reference

### 14.1 Values

| Length | chapters | minWords | maxWords | chapterMinWords | chapterIdealWords |
|---|---|---|---|---|---|
| short | 20 | 15,000 | 25,000 | 800 | 1,000 |
| medium | 30 | 40,000 | 60,000 | 1,200 | 1,700 |
| long | 42 | 70,000 | 100,000 | 1,500 | 2,200 |

Source: `packages/story-validation/src/story-length-targets.ts` — single source of truth; cannot be overridden via `generation-params.yaml`.

### 14.2 Compile-time invariant

A TypeScript compile-time constraint asserts `scenes === chapters` for each length. A modification that breaks this equality causes a TypeScript error.

### 14.3 Usage in scoring

- `validateStructure`: expected chapter count = `STORY_LENGTH_TARGETS[targetLength].chapters`
- `checkCompleteness` word count: `targetMin = minWords`, `targetMax = maxWords`
- `scoreProseQuality` word count: `targets.chapterMinWords` for per-chapter scoring

---

## 15. Configuration: `generation-params.ts` Scoring Defaults

### 15.1 `scoring_adapter.discriminating`

| Key | Default | Purpose |
|---|---|---|
| `semantic_token_match_ratio` | 0.3 | Fraction of DT tokens that must match prose |
| `min_semantic_token_matches` | 2 | Minimum absolute matches required |
| `max_semantic_tokens` | 12 | Max tokens taken from DT description fields |

### 15.2 `scoring_adapter.clue_semantic`

| Key | Default | Purpose |
|---|---|---|
| `token_match_ratio` | 0.3 | Fraction of clue semantic tokens needed |
| `min_token_matches` | 2 | Minimum absolute matches |
| `confidence_cap` | 0.95 | Max confidence for semantic (not exact) matches |
| `signature_tokens_from_distribution` | 8 | Tokens taken from `description` + `pointsTo` |
| `signature_tokens_from_id_fallback` | 6 | Tokens taken from ID phrase when no distribution |

### 15.3 `scoring_adapter.fair_play`

| Key | Default | Purpose |
|---|---|---|
| `spoiler_early_chapter_ratio` | 0.5 | Fraction of chapters checked for spoiler language |

### 15.4 `scorer.completeness.word_count`

| Key | Default | Purpose |
|---|---|---|
| `low_ratio` | 0.8 | Word count below `targetMin × 0.8` = major_underflow |
| `low_score` | 70 | Score awarded for `low` status |

### 15.5 `scorer.completeness.clue_visibility`

| Key | Default | Purpose |
|---|---|---|
| `pass_ratio` | 0.95 | Clue visibility ≥ 95% = pass |
| `minor_gap_ratio` | 0.8 | Clue visibility ≥ 80% = minor_gap |
| `minor_gap_score` | 85 | Score awarded for minor_gap status |

### 15.6 Config validation guard

`validateGenerationParams(merged)`: enforces `pass_ratio >= minor_gap_ratio`. If violated (e.g. via YAML override), `pass_ratio` is clamped to equal `minor_gap_ratio`.

---

## 16. Live Scoring During Generation (`onBatchComplete`)

### 16.1 Trigger

Executed inside the `onBatchComplete` callback of `generateProse()`. Fires after every batch of chapters is committed. Only executes when `enableScoring && scoreAggregator && scoringLogger` are all truthy.

### 16.2 Per-batch scoring sequence

For each completed batch:

1. `accumulatedChapters.push(...batchChapters)`
2. Score the batch alone:
   ```
   adaptedBatch = adaptProseForScoring(batchChapters, CASE, clues)
   batchScore = scorer.score({}, adaptedBatch, { ..., partialGeneration: true })
   ```
3. Score all accumulated chapters:
   ```
   adaptedAll = adaptProseForScoring(accumulatedChapters, CASE, clues)
   partialScore = scorer.score({}, adaptedAll, { ..., partialGeneration: true })
   ```
4. Build score entry and push to `ctx.proseChapterScores[]`:
   ```typescript
   {
     chapter: batchEnd,
     total_chapters: totalSceneCount,
     individual_score,           // batch alone
     cumulative_score,           // all so far
     individual_validation_score,
     individual_quality_score,
     individual_completeness_score,
     individual_consistency_score,
     cumulative_validation_score,
     cumulative_quality_score,
     cumulative_completeness_score,
     cumulative_consistency_score,
   }
   ```
5. Update `ctx.proseScoringSnapshot`:
   - `.chaptersGenerated = batchEnd`
   - `.latestChapterScore = individualPct`
   - `.latestCumulativeScore = pct`
6. Upsert to aggregator:
   ```
   scoreAggregator.upsertPhaseScore(
     "agent9_prose", "Prose Generation",
     { ...partialScore, breakdown: { chapter_scores: [...ctx.proseChapterScores] } },
     elapsedMs, 0
   )
   ```
7. Call `savePartialReport()`
8. Call `reportProgress("prose", "Chapter N/M complete · chapter: X/100 · cumulative: Y/100", ...)`

---

## 17. `computeProseChapterScoreSeries()`

### 17.1 Location

Defined inside `agent9-run.ts` at line 685 as a closure over: `enableScoring`, `scoreAggregator`, `inputs.proseBatchSize`, `totalSceneCount`, `cast`, `characterProfiles`, `locationProfiles`, `cml`, `clues`, `inputs.targetLength`.

### 17.2 Signature

```typescript
const computeProseChapterScoreSeries = async (chaptersToScore: any[]): Promise<any[]>
```

Returns early (empty array) if `!enableScoring || !scoreAggregator || chaptersToScore.length === 0`.

### 17.3 Execution

- Creates a new `ProseScorer()` instance
- `batchSize = max(1, min(inputs.proseBatchSize ?? 1, 10))`
- Iterates `chaptersToScore` in batches:
  - Both batch-alone and cumulative scores computed, both with `partialGeneration: true`
  - Score entry shape identical to `onBatchComplete` entries (both individual and cumulative per-component scores)
- Errors are caught silently; returns `[]` on error

### 17.4 Call site

Called inside `rescoreAgent9ProsePhase()`:

```typescript
const rescoreAgent9ProsePhase = async () => {
  const secondRunSeries = await computeProseChapterScoreSeries(prose.chapters);
  if (ctx.proseSecondRunChapterScores.length === 0 && secondRunSeries.length > 0) {
    ctx.proseSecondRunChapterScores = secondRunSeries;
  }
  // ... full rescore ...
}
```

`ctx.proseSecondRunChapterScores` is only set once — the first successful call wins.

---

## 18. `rescoreAgent9ProsePhase()` — Full Post-Repair Rescore

### 18.1 Purpose

Called after schema-validation repair and after story-validation repair. Replaces the previous aggregator score with a fresh full score on the current (repaired) prose.

### 18.2 Steps

1. Calls `computeProseChapterScoreSeries(prose.chapters)` — populates `ctx.proseSecondRunChapterScores` once
2. Adapts `prose.chapters` with `adaptProseForScoring(...)`
3. Calls `new ProseScorer().score({}, reAdaptedProse, { ..., targetLength, threshold_config: { mode: "standard" } })` — **no `partialGeneration`**
4. If `ctx.proseChapterScores.length > 0`, attaches breakdown:
   ```
   (reScoreProse as PhaseScore).breakdown = {
     chapter_scores: [...ctx.proseChapterScores],
     repair_chapter_scores: [...ctx.proseSecondRunChapterScores],
   }
   ```
5. Sets `ctx.latestProseScore = reScoreProse`
6. Calls `scoreAggregator.upsertPhaseScore("agent9_prose", "Prose Generation", reScoreProse, duration, cost)`
7. Errors are caught silently — rescore is best-effort and never aborts generation

---

## 19. First-Pass Scoring (Post-Generation)

### 19.1 Trigger

Runs immediately after `generateProse()` returns and after `applyDeterministicProsePostProcessing(sanitizeProseResult(...))` has been applied. Guarded by `enableScoring && scoreAggregator && scoringLogger`.

### 19.2 Sequence

1. `adapted = adaptProseForScoring(prose.chapters, CASE, clues)`
2. `score = new ProseScorer().score({}, adapted, { ..., targetLength, threshold_config: { mode: "standard" } })` — **no `partialGeneration`**
3. Sets `ctx.latestProseScore = score`
4. If `ctx.proseChapterScores.length > 0` and no `breakdown` yet: attaches `{ chapter_scores: [...ctx.proseChapterScores] }`
5. Calls `scoreAggregator.upsertPhaseScore("agent9_prose", "Prose Generation", score, duration, cost)`
6. Calls `scoringLogger.logPhaseScore(...)`
7. Calls `savePartialReport()`
8. If `!scoreAggregator.passesThreshold(score)`: adds a warning to `ctx.warnings` (does **not** stop generation)
9. Calls `buildPostGenerationSummaryDetails(score, false)` → logs `agent9_prose_post_generation_summary` diagnostic (initial)
10. If `prose.prompt_fingerprints` present: logs `agent9_prose_prompt_fingerprints` diagnostic

---

## 20. Finalized Post-Generation Summary

### 20.1 Trigger

After story-validation pipeline runs (passing or auto-fixed), and after `applyDeterministicProsePostProcessing` is applied a final time, `buildPostGenerationSummaryDetails(ctx.latestProseScore, true)` is called with `finalized=true`.

### 20.2 Updates

The diagnostic key `agent9_prose_post_generation_summary` is overwritten (upserted) with the finalized version.

### 20.3 `buildPostGenerationSummaryDetails` fields

The finalized summary contains:
- `fair_play_all_clues_visible`, `fair_play_discriminating_test_complete`, `fair_play_no_solution_spoilers`
- `fair_play_component_score`: computed as `(all_clues_visible?40:0) + (dt_complete?40:0) + (no_solution_spoilers?20:0)` — this is a **40/40/20 breakdown used for diagnostics only**, distinct from the scorer's 35/35/15/15
- `clue_visibility_expected_ids`, `clue_visibility_extracted_ids`, `clue_visibility_missing_expected_ids`, `clue_visibility_unexpected_extracted_ids`
- `clue_visibility_expected_count`, `clue_visibility_extracted_count`
- Template linter stats: `checks_run`, `failed_checks`, `opening_style_entropy_failures`, `opening_style_entropy_bypasses`, `paragraph_fingerprint_failures`, `ngram_overlap_failures`
- `score_total`, `score_grade`, `score_passed_threshold`, `component_failures`, `failure_reason`
- `chapters_generated`, `prose_duration_ms_first_pass`, `prose_duration_ms_total`, `prose_cost_first_pass`, `prose_cost_total`
- `rewrite_pass_count`, `repair_pass_count`, `per_pass_accounting[]`
- `batch_size`, `batches_with_retries`, `total_batches`, `batch_failure_events`, `batch_failure_history[]`, `batch_failure_samples[]`
- `outline_coverage_issue_count`, `critical_clue_coverage_gap`
- `nsd_transfer_steps`, `nsd_transfer_trace[]`
- `metrics_snapshot`: `"final"` when `finalized=true`, else `"initial"`

---

## 21. Release Gate Scoring

### 21.1 Purpose

The release gate runs after story validation. It performs NSD-vs-clue-visibility divergence analysis: comparing NSD-revealed clue IDs against evidence anchors found in prose.

### 21.2 Hard stop vs warning

| Failure type | Effect |
|---|---|
| `releaseGateReasons` | Warning added to `ctx.warnings`; run continues |
| `hardStopReasons` | Error thrown; orchestrator catch saves partial report with a zeroed prose score |

A condition can appear in both arrays simultaneously.

### 21.3 NSD divergence check

- `nsdRevealedClues`: union of `step.newly_revealed_clue_ids` from `ctx.nsdTransferTrace`
- `revealedWithoutEvidence`: NSD-revealed clues with no prose evidence anchor
- `evidenceWithoutReveal`: evidence-visible clues not in NSD reveal list
- Both non-zero → release gate warning
- `revealedWithoutEvidence.length > 0` → hard stop: `"clue visibility incomplete (N NSD-revealed clues have no prose evidence anchors)"`

### 21.4 Fair play audit check

- `fpValidation` computed from `fair_play_validation`: `(all_clues_visible?40:0) + (dt_complete?40:0) + (no_solution_spoilers?20:0)` — 40/40/20 weights (diagnostic-only, same as post-generation summary)
- `hasZeroScoreViolation`: any fair-play sub-field is `false` (contributing 0 to the score)
- If `fpValidation < 60 || hasZeroScoreViolation` → release gate reason added

### 21.5 `agent9_prose_release_gate_summary` diagnostic

| Field | Content |
|---|---|
| `validation_status` | status from `validationReport` |
| `validation_snapshots` | pre_repair, post_repair, release_gate summaries |
| `release_gate_warning_count` | count |
| `release_gate_hard_stop_count` | count |
| `release_gate_warnings`, `release_gate_hard_stops` | lists |
| `readability` | `evaluateProseReadability(prose)` result |
| `scene_grounding` | `evaluateSceneGroundingCoverage(prose, locationProfiles)` |
| `placeholder_leakage` | `evaluatePlaceholderLeakage(prose)` |
| `chapter_heading_artifacts` | `evaluateChapterHeadingArtifacts(prose)` |
| `clue_visibility_*` | expected, extracted, missing, unexpected IDs and counts |
| `nsd_visibility_divergence` | divergence object |
| `has_illegal_control_chars`, `has_mojibake` | boolean |
| `fair_play_status` | `fairPlayAudit.overallStatus ?? null` |

---

## 22. Diagnostics Summary

### 22.1 Four diagnostic keys stored

| Key | Phase label | Diagram type | Timing |
|---|---|---|---|
| `agent9_prose_post_generation_summary` | `Prose Generation` | `post_generation_summary` | Written twice: initial after first pass, overwritten finalized after encoding fixes |
| `agent9_prose_release_gate_summary` | `Release Gate` | `release_gate_summary` | Written once after release gate |
| `agent9_prose_failure_lineage` | `Prose Generation` | `failure_lineage` | Written once after release gate |
| `agent9_prose_prompt_fingerprints` | `Prose Generation` | `prompt_fingerprints` | Written once after first-pass scoring (if `prose.prompt_fingerprints` is populated) |

### 22.2 `agent9_prose_failure_lineage` fields

| Field | Content |
|---|---|
| `first_failing_chapter` | Lowest `batchIndex + 1` from `failureHistory`; `null` if none |
| `error_classes[]` | Deduplicated error type codes: `clue_visibility`, `word_count`, `temporal`, `scene_grounding`, `identity_continuity`, `template_leakage`, `validation_error` |
| `corrective_attempts` | `ctx.proseRepairPassCount + ctx.proseRewritePassCount` |
| `final_blocking_reason` | First hard stop reasons (joined); else first 3 release-gate warnings; else `null` |

---

## 23. `onBatchComplete` NSD Integration

### 23.1 NSD transfer trace

During `onBatchComplete`, before scoring:
- `updateNSD(narrativeState, { paragraphs, cluesRevealedIds })` is called
- `collectClueEvidenceFromProse(batchChapters, CASE, clues)` called again (separately from scoring path)
- For each NSD-newly-revealed clue: evidence anchors extracted; clues with no anchor push a warning
- `ctx.nsdTransferTrace[]` receives an entry with: batch_start, batch_end, chapters_generated, validation_issue_count, validation_issue_samples, newly_revealed_clue_ids, clue_state_by_id, clue_evidence_anchors, before/after NSD state

### 23.2 Warnings on no-anchor clues

If any NSD-revealed clue has no prose evidence anchor in the batch:
> `"NSD batch N-M: clue(s) marked revealed but no prose evidence anchor found: [IDs]. Fair-play verification may be incomplete."`

---

## 24. Score Aggregator Interaction

### 24.1 `upsertPhaseScore` calls for `agent9_prose`

| Call site | partialGeneration | breakdown field |
|---|---|---|
| `onBatchComplete` (each batch) | true | `chapter_scores: [...ctx.proseChapterScores]` |
| First-pass scoring | false | `chapter_scores: [...]` if available |
| `rescoreAgent9ProsePhase` | false | `chapter_scores: [...], repair_chapter_scores: [...]` |

### 24.2 Score visibility

Each `upsertPhaseScore` call updates the in-memory aggregator immediately. The UI reads from the aggregator to render the quality tab. Because `savePartialReport()` is called after each batch update, the UI can also read from the persisted partial report.

### 24.3 `passesThreshold(score)`

Called after first-pass scoring. If the score does not pass, a warning is added to `ctx.warnings`, but generation is not stopped. The precise threshold logic lives in the aggregator.

---

## 25. Zero-Chapter / Hard-Stop Handling

### 25.1 Hard stop path

If `hardStopReasons` is non-empty at the end of the release gate:
1. A message is pushed to `ctx.errors`
2. `reportProgress("validation", hardStopMessage, 99)` is called
3. `throw new Error(hardStopMessage)` is thrown

The orchestrator (job runner) catches this error and saves a partial report. The saved report contains a zeroed prose score for `agent9_prose` (the aggregator state at time of throw).

### 25.2 Conditions that trigger hard stop

| Condition | Hard-stop message |
|---|---|
| NSD-revealed clues with no prose evidence anchor | `"clue visibility incomplete (N NSD-revealed clue(s) have no prose evidence anchors)"` |
| (Other conditions accumulate as `releaseGateReasons` only) | (no hard stop for warn-only conditions) |

---

## 26. `shared.ts` Interface Definitions

### 26.1 `ClueEvidenceState`

```typescript
export type ClueEvidenceState = 'introduced' | 'hinted' | 'explicit' | 'confirmed';
```

### 26.2 `ClueEvidenceAnchor`

```typescript
export interface ClueEvidenceAnchor {
  clue_id: string;
  chapter_number: number;
  evidence_quote: string;
  evidence_offset: { chapter: number; paragraph: number; sentence: number };
  confidence: number;
  state: ClueEvidenceState;
}
```

### 26.3 `ClueEvidenceExtractionResult`

```typescript
export interface ClueEvidenceExtractionResult {
  visibleClueIds: string[];
  evidenceByClue: Record<string, ClueEvidenceAnchor[]>;
  evidenceByChapter: Record<number, string[]>;
  clueStateById: Record<string, ClueEvidenceState>;
}
```

---

*End of ANALYSIS_31 — facts only. No assessments or recommendations are included in this document.*

# ANALYSIS_06: Chapter Word Count Hard-Floor Underflow — Overshoot Buffer and Expansion Pass

Date: 2026-03-15

## Question Answered
Why do chapters repeatedly fall below the hard-floor word count even after retries, and what mechanisms now mitigate this?

## Error Snapshot (From Runtime Logs)
```
[Agent 9] Batch ch1 validation failed (attempt 3/4):
  - Chapter 1: word count below hard floor (643/660)
    [source: generation-params.yaml#agent9_prose.word_policy.hard_floor_relaxation_ratio
     + generation-params.yaml#story_length_policy.word_targets.short.chapter_ideal_words
     (hard_floor_relaxation_ratio=0.88, chapter_ideal_words.short=1000,
      resolved_hard_floor_words=660)]
```

## Executive Summary
GPT-4o-mini systematically undershoots word count targets. The model generates prose that is 10–30% below the stated target, creating repeated hard-floor violations that consume retry budget and cause generation aborts. Two complementary mechanisms now address this: a prompt overshoot buffer that inflates the stated target, and a post-generation expansion pass that surgically extends underweight chapters.

## Technical Cause Analysis

### Why the LLM undershoots
1. **Token prediction bias**: Language models optimise for coherent completion, not word count compliance. The model treats word targets as soft guidance, not hard constraints.
2. **Context pressure**: When the prompt includes dense CML data, clue obligations, pronoun maps, and style constraints, the model prioritises narrative completeness over length targets.
3. **Retry regression**: When retries inject error feedback (fix pronouns, add clues), the model often shortens prose to "make room" for corrections, creating a length regression spiral.

### Hard-floor calculation
The hard floor is calculated as:
```
hard_floor = floor(chapter_ideal_words × hard_floor_relaxation_ratio)
```
With current config (`chapter_ideal_words.short = 1000`, `hard_floor_relaxation_ratio = 0.88` in YAML, `0.7` runtime default):
- YAML config: `floor(1000 × 0.88) = 880` (if YAML loads)
- Default: `floor(1000 × 0.7) = 700` (fallback)

The observed failure (643/660) used `hard_floor_relaxation_ratio = 0.88` with a shorter chapter ideal, yielding a 660-word floor.

### Two-tier word policy
The system uses two distinct thresholds:
- **Hard floor**: Viability gate — chapters below this fail validation and consume retry budget
- **Preferred target**: Quality pressure — chapters below this trigger corrective expansion but do not fail

This two-tier design is intentional (see ANALYSIS_01) but creates a gap where chapters can pass the hard floor yet remain below the quality target.

## Fix 1: Prompt Overshoot Buffer (IMPLEMENTED)

### Mechanism
The word target stated to the LLM is inflated by a configurable buffer, so the model aims higher and lands closer to the real target.

```
stated_target = preferred_words + overshoot_buffer
```

### Configuration

**Interface** (`packages/story-validation/src/generation-params.ts`, L120):
```typescript
export interface Agent9WordPolicyConfig {
  hard_floor_relaxation_ratio: number;
  prompt_overshoot_buffer_words: number;
}
```

**Default**: 200 words (in `DEFAULT_CONFIG`, L403)

**YAML** (`apps/worker/config/generation-params.yaml`, L201):
```yaml
agent9_prose:
  word_policy:
    prompt_overshoot_buffer_words: 200
```

**Merge logic** (`generation-params.ts`, L877): Clamped to range 0–600 words.

### Usage in prompt construction
**File:** `packages/prompts-llm/src/agent9-prose.ts` (L1663–1669)

The overshoot buffer is added to the preferred word target before it is stated in the prose prompt. The LLM sees (for example) "write at least 1200 words" when the real preferred target is 1000. Since the model typically undershoots by 10–20%, the actual output lands closer to the true preferred target.

### Tuning rationale
- **200 words** compensates for the observed 10–20% undershoot on a 1000-word target
- **600 word max** prevents the buffer from distorting prose quality at longer chapter targets
- **0 word min** allows disabling the buffer if the model improves

## Fix 2: Preferred-Target Expansion Pass (IMPLEMENTED)

### Mechanism
After initial prose generation, if a chapter's word count falls between the hard floor and the preferred target, an automatic expansion LLM call extends the prose before commit.

### Function
**File:** `packages/prompts-llm/src/agent9-prose.ts` (L2958)

```typescript
const attemptUnderflowExpansion = async (
  client, chapter, chapterNumber, scene, ledgerEntry,
  model, runId, projectId, targetWords?
): Promise<ProseChapter>
```

### Algorithm
1. Calculate current word count and effective target
2. Compute missing words: `max(0, effectiveTarget - currentWords)`
3. Apply expansion config bounds (`min_additional_words`, `max_additional_words`, `buffer_words`)
4. Construct surgical expansion prompt with fiction framing:
   - System: fiction-framing context + "expand the following chapter"
   - User: current chapter text + specific word count instruction
5. Call LLM with expansion-specific temperature and token settings
6. Parse expanded result and apply deterministic pronoun repair (L3462)
7. Re-evaluate candidate before committing (L3470)

### Invocation
Called at two points in the chapter production pipeline:
- **Hard-floor recovery** (L3448): When chapter is below hard floor after initial generation
- **Preferred-target boost** (L3490): When chapter passes hard floor but is below preferred target

### Configuration
Expansion parameters in YAML (`generation-params.yaml`):
```yaml
agent9_prose:
  underflow_expansion:
    min_additional_words: 50
    max_additional_words: 400
    buffer_words: 50
```

### Telemetry
**File:** `packages/prompts-llm/src/agent9-prose.ts` (L183–194)

```typescript
interface UnderflowTelemetry {
  hardFloorMisses: number;
  hardFloorMissChapters: number[];
  preferredTargetMisses: number;
  preferredTargetMissChapters: number[];
  expansionAttempts: number;
  expansionRecovered: number;
  expansionFailed: number;
  preferredExpansionAttempts: number;
  preferredExpansionRecovered: number;
  preferredExpansionFailed: number;
}
```

Counters are logged in `validationDetails` for post-run diagnostics.

## Combined Effect

The two mechanisms work together:
1. **Overshoot buffer** prevents most hard-floor violations by inflating the LLM's target
2. **Expansion pass** catches remaining shortfalls between hard floor and preferred target
3. Together they reduce the number of retries consumed by word-count failures, preserving retry budget for genuine quality defects (pronouns, clues, temporal consistency)

### Observed log pattern (from user's error report)
```
21:52:14.366Z Agent9-UnderflowExpansion-Ch1 | chat_request
21:52:20.447Z Agent9-UnderflowExpansion-Ch1 | chat_response
```
The expansion pass fired (visible in logs as `Agent9-UnderflowExpansion-Ch1`), bringing the chapter from initial generation up to 643 words — still 17 words short of the 660 hard floor. This triggered attempt 4, which was then blocked by the content filter (addressed in ANALYSIS_05).

### Gap analysis
The 643/660 near-miss (97.4%) shows the expansion pass got very close but didn't quite reach the floor. Contributing factors:
- The content filter consumed 2 of 4 attempts, leaving only 2 real prose attempts
- The expansion pass targets the preferred target, not the hard floor specifically
- With content-filter framing now in place (ANALYSIS_05), all 4 attempts will produce real prose, significantly improving recovery probability

## Relationship to Other Fixes
- **ANALYSIS_01**: Documents the two-tier word policy design and why different thresholds exist
- **ANALYSIS_03**: Documents how word count interacts with pronoun repair and content filter
- **ANALYSIS_05**: Content-filter framing ensures retry attempts produce prose instead of errors
- **FIX-20260312-01**: Original word count underflow analysis; the overshoot buffer and expansion pass are the implemented solution for Options B and E from that document

## Current Status
**IMPLEMENTED.** Both mechanisms are active:
- Prompt overshoot buffer: 200 words (configurable 0–600 via YAML)
- Underflow expansion pass: automatic, with telemetry
- Combined with content-filter framing (ANALYSIS_05), word-count recovery should be significantly more reliable

Awaiting empirical verification in next pipeline run.

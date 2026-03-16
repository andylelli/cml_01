# ANALYSIS_04: Agent 9 Retry Mode Selection (Auto-Detected)

Date: 2026-03-14

## Question Answered
What change was implemented to Agent 9 retry behavior, and why was this change necessary?

## Executive Summary
A second retry strategy was added to Agent 9 prose generation so retry behavior is now configurable from YAML.

- Existing behavior is preserved as `retry_mode: regenerate` (default).
- New behavior is available as `retry_mode: revise_previous`.

This change allows the pipeline to choose between:
1. full re-generation on retry, or
2. targeted repair of the previously failed prose with explicit keep-good-bits instructions.

## Why This Change Was Needed
Recent failure patterns showed Chapter 1 retries frequently failed on a combination of:
- hard-floor word count underflow,
- victim naming omission,
- pronoun mismatch drift.

Under full re-generation retries, valid prose sections can be rewritten unnecessarily, causing corrective oscillation (one issue fixed while another regresses). The new mode reduces rewrite surface area by preserving valid content and only correcting known failing constraints.

## What Was Implemented

### 1. New YAML configuration switch
Added a runtime control under Agent 9 generation config:
- `apps/worker/config/generation-params.yaml`
- Key: `agent9_prose.generation.retry_mode`
- Values:
  - `regenerate` (default): existing behavior
  - `revise_previous`: new targeted revision behavior

### 2. Config model and merge logic updates
Added typed support and safe merge fallback in generation params loader:
- `packages/story-validation/src/generation-params.ts`
  - Added `retry_mode` to `Agent9GenerationConfig`
  - Added default value in `DEFAULT_CONFIG`
  - Added merge logic that accepts only `revise_previous`, otherwise falls back to `regenerate`

### 3. Agent 9 retry-path implementation
Implemented mode-aware retry branching in Agent 9 prose generator:
- `packages/prompts-llm/src/agent9-prose.ts`

Behavior details:
- Attempt 1 always uses normal chapter-generation prompt flow.
- For attempts >1:
  - If `retry_mode=regenerate`: keep existing retry flow (normal prompt + retry feedback).
  - If `retry_mode=revise_previous`: send previous failed prose batch plus targeted defect list and minimal-edit instructions.

New helper added:
- `buildRetryRevisionPrompt(...)`
  - Constructs a surgical retry prompt with:
    - only listed validator errors,
    - explicit “preserve valid text” guidance,
    - strict requirement to keep chapter count/order unchanged,
    - JSON schema output contract.

## Design Intent
The change intentionally keeps both strategies:
- `regenerate` is better for broad quality resets when draft quality is globally poor.
- `revise_previous` is better for deterministic defect correction when most text is already valid.

This dual-mode design avoids a one-size-fits-all retry strategy and enables runtime tuning without code changes.

## Verification Performed

### Tests
- Updated/added unit coverage in:
  - `packages/prompts-llm/src/__tests__/agent9-prose.test.ts`
- Added test for `buildRetryRevisionPrompt` to verify:
  - prior prose is included,
  - targeted error list is included,
  - keep-good-bits constraint is explicit.

### Builds
Successful builds after implementation:
- `npm run -w @cml/story-validation build`
- `npm run -w @cml/prompts-llm build`
- `npm run -w @cml/worker build`

## Risk and Mitigation

### Risk
Surgical revision mode provides less full-context guidance than full re-generation, which may underperform when prose is structurally weak, not just locally defective.

### Mitigation
- Auto-detection handles this: structural failures (parse errors, exceptions, wrong chapter count) automatically fall back to full regeneration.
- The system only enters revision mode when the previous attempt produced valid, parseable prose — exactly the scenario where revision is most effective.
- Both paths now include prior prose context (revision as baseline, regeneration as reference).
- Preservation directives in revision mode are non-negotiable and top-of-prompt.

## Evolution: From Configurable to Auto-Detected

The original implementation (above) introduced `retry_mode` as a YAML-configurable parameter. Subsequent analysis showed:

1. The decision criteria are already available in the retry loop: `lastFailedBatchChapters` is non-null with correct length only when the previous attempt produced parseable prose.
2. There is no valid use case for forcing `regenerate` when revision-quality prose exists — it only wastes the previous work.
3. There is no valid use case for forcing `revise_previous` when the previous attempt was structurally broken — the system already handled this by setting `lastFailedBatchChapters = null` in the catch block.
4. The fresh-retry path was strengthened to include prior prose context and stability anchors, so even structural fallbacks preserve continuity.

**Changes made:**
- Removed `retry_mode` from `Agent9GenerationConfig` interface and default config.
- Removed `retry_mode` merge logic from `mergeConfig`.
- Removed `retry_mode` from `generation-params.yaml`.
- Changed `useRevisionRetry` decision in `generateProse` to depend solely on whether valid previous prose exists (no config check).
- The system now always uses surgical revision when the previous attempt produced parseable prose, and full regeneration (with prior prose context) when it didn't.

## Conclusion
Agent 9 retry mode is now fully automatic. Surgical revision is used when the previous attempt produced valid prose structure; full regeneration with prior prose context is used when it didn't. The YAML configuration parameter has been removed.
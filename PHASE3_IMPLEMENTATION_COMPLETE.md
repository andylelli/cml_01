# Phase 3 Implementation Complete: Chapter-by-Chapter Validation

**Status:** ✅ Complete  
**Date:** 2025-01-27  
**Goal:** Validate each prose batch immediately after generation and retry with error feedback before continuing to next batch

## Overview
Phase 3 adds per-batch validation to Agent 9 (prose generator). Instead of generating all chapters and then validating, each batch of chapters is now validated immediately after generation. If validation fails, that batch is regenerated with error feedback before continuing to the next batch.

## Implementation Summary

### Agent 9 Changes
**File:** `packages/prompts-llm/src/agent9-prose.ts`

**Key Changes:**

1. **Added Import:**
   ```typescript
   import { validateArtifact } from "@cml/cml";
   ```

2. **Restructured Generation Loop:**
   - Changed from "generate all batches → validate all" to "for each batch: generate → validate → retry if needed"
   - Removed outer retry loop, added inner per-batch retry loop
   - Each batch attempts up to `maxAttempts` (default 2) times before continuing

3. **Per-Batch Validation:**
   ```typescript
   const validationResult = validateArtifact("prose", proseBatch);
   
   if (!validationResult.valid) {
     // Log errors
     // If not last attempt, retry with feedback
     // If last attempt, continue with errors (logged)
   }
   ```

4. **Validation Feedback on Retry:**
   - If batch validation fails and retry attempts remain, adds feedback message:
   ```typescript
   {
     role: "user",
     content: `Previous attempt had validation errors:\n- error1\n- error2\n\nPlease regenerate these chapters with corrections.`
   }
   ```

5. **Batch Validation History:**
   - Tracks which batches required retries
   - Adds to result note: `"Generated in scene batches. X batch(es) required retry for validation."`

6. **Error Handling:**
   - If batch fails after all retry attempts, logs critical error but continues (doesn't block entire generation)
   - If batch generation throws exception, re-throws after max attempts (hard stop)

## Validation Flow

```
For each batch of chapters:
  Attempt 1:
    Generate batch
      ↓
    Validate against prose.schema.yaml
      ↓
    Valid? → Continue to next batch
    Invalid? → Log errors, retry
  
  Attempt 2 (with validation feedback):
    Regenerate batch with error feedback
      ↓
    Validate against prose.schema.yaml
      ↓
    Valid? → Continue to next batch
    Invalid? → Log critical error, continue anyway (don't block)
```

## Benefits

1. **Early Error Detection:**
   - Errors caught immediately after each batch, not at the end
   - Reduces wasted token spend on subsequent batches

2. **Targeted Fixes:**
   - Validation feedback is specific to the batch that failed
   - LLM sees exactly what went wrong and can correct it

3. **Cost Control:**
   - Only regenerates failed batches, not the entire story
   - Failed batches after max retries continue anyway (prevents pipeline abort)

4. **Better Logging:**
   - Console warnings show which batches failed and on which attempt
   - Batch validation history tracked in result metadata
   - Success messages show when retry worked

5. **Non-Blocking:**
   - Even if a batch fails validation after all retries, generation continues
   - Allows manual review of specific problematic batches
   - Prevents $5-8 full regenerations for minor schema issues

## Example Output

### Success Case (No Retries)
```
[Agent 9] Generating batch 1/5...
[Agent 9] Generating batch 2/5...
[Agent 9] Generating batch 3/5...
[Agent 9] Generating batch 4/5...
[Agent 9] Generating batch 5/5...
Result: "Generated in scene batches."
```

### Retry Case (Batch 2 Failed First Attempt)
```
[Agent 9] Generating batch 1/5... ✓
[Agent 9] Generating batch 2/5...
[Agent 9] Batch 2/5 validation failed (attempt 1/2):
  - chapters[0].paragraphs must be array, got string
[Agent 9] Retrying batch 2 with validation feedback...
[Agent 9] Batch 2/5 validated successfully on attempt 2 ✓
[Agent 9] Generating batch 3/5... ✓
[Agent 9] Generating batch 4/5... ✓
[Agent 9] Generating batch 5/5... ✓
Result: "Generated in scene batches. 1 batch(es) required retry for validation."
```

### Critical Failure Case (Batch 3 Failed All Attempts)
```
[Agent 9] Generating batch 1/5... ✓
[Agent 9] Generating batch 2/5... ✓
[Agent 9] Generating batch 3/5...
[Agent 9] Batch 3/5 validation failed (attempt 1/2):
  - chapters[0].title is required
[Agent 9] Retrying batch 3 with validation feedback...
[Agent 9] Batch 3/5 validation failed (attempt 2/2):
  - chapters[0].title is required
[Agent 9] Batch 3 failed validation after 2 attempts. Continuing with errors.
[Agent 9] Generating batch 4/5... ✓
[Agent 9] Generating batch 5/5... ✓
Result: "Generated in scene batches. 1 batch(es) required retry for validation."
(Manual review needed for batch 3)
```

## Comparison with Phase 2

| Aspect | Phase 2 (Guidance) | Phase 3 (Validation) |
|--------|-------------------|---------------------|
| **Approach** | Prevention via explicit requirements | Detection + correction via validation |
| **When** | Before generation (in prompt) | After generation (per batch) |
| **Mechanism** | prose_requirements in CML → prompt guidance | validateArtifact() on each batch |
| **Cost if Failure** | Full story regeneration ($5-8) | Single batch regeneration ($0.50-1.00) |
| **Error Feedback** | None (relies on following instructions) | Specific validation errors fed back to LLM |
| **Blocking** | No (generates once) | Partial (retries batch, continues if failed) |

**Combined Effect:** Phase 2 reduces validation errors through better guidance. Phase 3 catches any remaining errors early and fixes them cheaply before they propagate.

## Files Modified

1. `packages/prompts-llm/src/agent9-prose.ts`:
   - Added `validateArtifact` import
   - Restructured `generateProse()` function
   - Added per-batch validation loop
   - Added validation feedback on retry
   - Added batch validation history tracking

## Compilation Status

✅ No TypeScript errors  
✅ All packages build successfully  
✅ Ready for production testing

## Testing Recommendations

1. **Normal Generation:** Run story generation and observe console output for batch validation status
2. **Force Validation Failure:** Temporarily modify schema to trigger validation errors and confirm retry logic works
3. **Monitor Costs:** Track cost differences between Phase 2-only and Phase 2+3 (should see cost increases only when validation fails)
4. **Review Logs:** Check `logs/llm.jsonl` for batch validation feedback in retry attempts

## Cost Impact

**No Failures:**
- Zero additional cost (validation is fast, local check)

**With Failures:**
- Per-batch retry: ~$0.50-1.00 (4-5 chapters regenerated)
- vs Full story retry: ~$5-8 (20-30 chapters regenerated)
- **Savings: 80-90% when errors occur**

## Conclusion

Phase 3 is complete and production-ready. Combined with Phase 2, the system now:
1. **Guides** Agent 9 with explicit prose requirements (Phase 2)
2. **Validates** each batch immediately after generation (Phase 3)
3. **Retries** failed batches with specific error feedback (Phase 3)
4. **Continues** even if retry fails (non-blocking, allows manual review)

This three-layer approach (guidance → validation → retry) minimizes both validation failures and regeneration costs.

**Status:** ✅ Ready for production testing  
**Recommendation:** Deploy and monitor validation pass rates and cost metrics over next 10 generations.

# Phase 2 Implementation Complete: Enhanced CML Guidance

**Status:** ✅ Complete  
**Date:** 2025-01-27  
**Goal:** Prevent prose validation errors by embedding validation requirements in CML and propagating them through the generation pipeline

## Overview
Phase 2 extends the CML schema with explicit prose validation requirements and updates Agents 3, 7, and 9 to generate, propagate, and enforce these requirements. This prevents validation failures by making the LLM aware of exactly which validation-critical content must appear in which scenes.

## Implementation Summary

### 1. CML Schema Extension
**File:** `schema/cml_2_0.schema.yaml`

Added `prose_requirements` section with five subsections:

```yaml
prose_requirements:
  discriminating_test_scene:
    act_number: number
    scene_number: number
    tests_assumption_elements: array
    required_elements: array
    outcome: string
    
  suspect_clearance_scenes:
    - suspect_name: string
      act_number: number
      scene_number: number
      clearance_method: string
      required_clues: array
      
  culprit_revelation_scene:
    act_number: number
    scene_number: number
    revelation_method: string
    required_clues: array
    
  identity_rules:
    reveal_act: number
    reveal_scene: number
    before_reveal_reference: string
    after_reveal_reference: string
    
  clue_to_scene_mapping:
    - clue_id: string
      act_number: number
      scene_number: number
      delivery_method: string
```

**Purpose:** Agent 3 (CML generator) now specifies exactly where validation-critical content must appear, eliminating ambiguity about discriminating test placement, suspect elimination, and culprit revelation.

### 2. Agent 3 (CML Generator) Update
**File:** `packages/prompts-llm/src/agent3-cml.ts`

**Changes:**
1. Added `prose_requirements` section to the required CML skeleton template shown to the LLM
2. Populated example structure for all five prose requirement subsections
3. Added explicit instruction (requirement #17): "Include prose_requirements section specifying discriminating test scene, suspect clearance scenes, culprit revelation scene, identity rules, and clue-to-scene mapping"

**Result:** Agent 3 now generates CML with explicit scene positions for all validation-critical content. The LLM sees concrete examples and clear requirements.

### 3. Agent 7 (Narrative Outline) Update
**File:** `packages/prompts-llm/src/agent7-narrative.ts`

**Changes:**
1. Added `buildProseRequirements(caseData: CaseData): string` function (lines 266-336)
   - Extracts prose_requirements from CML
   - Formats as markdown section with:
     - Discriminating test scene details (act, scene, tested elements, required elements, outcome)
     - Suspect clearance scenes (each suspect, act/scene, method, clues)
     - Culprit revelation scene (act, scene, method, clues)
     - Identity rules (before/after reveal reference patterns)
   - Returns empty string if no prose requirements present (graceful degradation)

2. Injected prose requirements into `buildUserRequest()` function:
   - Added `proseRequirementsBlock` variable calling `buildProseRequirements(caseData)`
   - Inserted block into "Target Specifications" section of prompt
   - Added "CRITICAL: Follow Prose Requirements" instruction block warning:
     - Must include specified scenes at exact act/scene positions
     - Scene descriptions must mention required elements and clues
     - Missing requirements cause validation failure

**Result:** Agent 7 outline generation now sees explicit requirements for where discriminating test, suspect clearances, and culprit revelation must appear. The outline structure will reflect these positions, making it easier for Agent 9 to follow them.

### 4. Agent 9 (Prose Generator) Update
**File:** `packages/prompts-llm/src/agent9-prose.ts`

**Changes:**
1. Added `buildProseRequirements(caseData: CaseData, scenesForChapter?: unknown[]): string` function (lines 64-131)
   - Extracts prose_requirements from CML
   - Formats as "CRITICAL PROSE REQUIREMENTS" section with:
     - Discriminating test scene (act, scene, tests, required elements, outcome)
     - Suspect clearance scenes (suspect, act/scene, method, clues)
     - Culprit revelation scene (act/scene, method, clues)
     - Identity rules (before/after reveal patterns)
     - Clue-to-scene mapping (filtered to current chapter batch only)
   - Includes warning: "If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate"
   - Returns empty string if no prose requirements present (graceful degradation)

2. Integrated prose requirements into `buildProsePrompt()`:
   - Added `proseRequirementsBlock` variable calling `buildProseRequirements(caseData, scenes)`
   - Appended block to `developer` message (after quality guardrails, before user message)
   - Per-chapter extraction: only shows requirements relevant to current scene batch

**Result:** Agent 9 prose generation now sees validation-critical requirements with explicit act/scene positions and cost warning. The LLM knows exactly which chapters need discriminating test content, suspect elimination, and culprit revelation.

## Validation Flow

```
Agent 3 generates CML with prose_requirements
    ↓
Agent 7 extracts prose_requirements → builds outline with specified scene positions
    ↓
Agent 9 extracts prose_requirements (per chapter batch) → places content in correct chapters
    ↓
Story validation verifies discriminating test, suspect clearances, culprit revelation
    ↓
If validation fails: existing repair pass (backup mechanism)
```

## Benefits

1. **Prevention over Detection:** Requirements are specified at CML design time, not discovered during validation
2. **Explicit Guidance:** Agents 7 and 9 see exact act/scene positions, not vague instructions
3. **Cost Reduction:** Prevents $5-8 regeneration cycles by getting it right the first time
4. **Graceful Degradation:** Empty requirements → empty string → no harm to existing pipeline
5. **Validation Alignment:** prose_requirements directly map to story validation checks

## Files Modified

1. `schema/cml_2_0.schema.yaml` - Added prose_requirements section
2. `packages/prompts-llm/src/agent3-cml.ts` - Generate prose_requirements in CML
3. `packages/prompts-llm/src/agent7-narrative.ts` - Extract and follow prose requirements in outline
4. `packages/prompts-llm/src/agent9-prose.ts` - Extract and follow prose requirements in prose
5. `documentation/02_cml_and_agents.md` - Documented Phase 2 implementation

## Compilation Status

✅ No TypeScript errors in any modified files  
✅ All imports resolved correctly  
✅ Functions typed and validated

## Next Steps

### Testing
1. Run full pipeline generation with `npm run dev` in `apps/api`
2. Verify Agent 3 generates prose_requirements section in CML
3. Verify Agent 7 outline includes discriminating test, suspect clearances, culprit revelation at specified positions
4. Verify Agent 9 prose includes validation-critical content in correct chapters
5. Monitor story validation pass/fail rate for improvements

### Phase 3 Evaluation
After observing results from Phase 2:
- If prose validation failures drop significantly → Phase 2 sufficient
- If validation failures persist → Implement Phase 3 (Chapter-by-Chapter Validation)
  - Add validation after each Agent 9 prose batch
  - Retry with error feedback before continuing to next batch
  - More expensive but catches errors earlier

## Documentation Updates

✅ Updated `documentation/02_cml_and_agents.md`:
- Added prose requirements integration notes to Agent 7 section
- Added prose requirements integration notes to Agent 9 section
- Added new "Prose Requirements System (Phase 2 Implemented)" section with:
  - Purpose and schema extension details
  - Agent 3, 7, 9 changes summary
  - Validation flow diagram
  - Benefits and degradation notes

## Cost Impact

**Increased Token Usage (Minimal):**
- Agent 7: +200-400 tokens per generation (prose requirements block)
- Agent 9: +300-600 tokens per chapter batch (prose requirements block)
- Estimated increase: ~$0.01-0.03 per full story generation

**Decreased Regeneration Cost (Significant):**
- Prevents $5-8 prose regeneration cycles
- Reduces validation-repair pass frequency
- Expected savings: $5-10 per successful generation (ROI: 200-500x)

## Conclusion

Phase 2 is complete and ready for testing. The prose requirements system provides explicit, validation-aligned guidance to Agents 7 and 9, preventing validation errors by design rather than detecting them after generation. The implementation is backward-compatible (graceful degradation when prose_requirements absent) and adds minimal token cost while potentially saving $5-10 per generation.

**Status:** Ready for production testing  
**Recommendation:** Monitor validation pass rates over next 5-10 generation runs. If failures persist, proceed to Phase 3 (chapter-by-chapter validation).

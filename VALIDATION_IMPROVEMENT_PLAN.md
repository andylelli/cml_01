# Validation Improvement Implementation Plan

**Created:** 2026-02-14  
**Purpose:** Eliminate validation failures and schema errors by implementing multi-layered validation, chapter-by-chapter prose generation, and enhanced CML guidance.

---

## Problem Classes to Address

1. **Schema Compliance Failures** - Agents returning malformed data (strings instead of objects, descriptive text instead of enums)
2. **Clue Distribution Quality** - Missing inference coverage, suspect coverage gaps, red herring conflicts
3. **Prose Validation Failures** - Missing discriminating test scenes, incomplete suspect elimination, identity continuity breaks

---

## Phase 1: Agent-Level Schema Validation (High Priority)

**Goal:** Prevent malformed artifacts from entering the pipeline.

### Tasks

#### 1.1: Create Reusable Validation + Retry Wrapper
**File:** `packages/prompts-llm/src/validation-retry-wrapper.ts` (new)

**Implementation:**
```typescript
interface RetryConfig {
  maxAttempts: number;
  validationFn: (data: any) => { valid: boolean; errors: string[] };
  agentName: string;
}

async function withValidationRetry<T>(
  generateFn: () => Promise<T>,
  config: RetryConfig
): Promise<T>
```

**Features:**
- Retry loop (up to N attempts)
- Schema validation after each attempt
- Error feedback to next attempt
- Cost tracking across attempts
- Detailed logging

**Estimated Effort:** 4 hours

---

#### 1.2: Add Schema Validation to Agent 2b (Character Profiles)
**File:** `packages/prompts-llm/src/agent2b-character-profiles.ts`

**Changes:**
- Import `validateArtifact` from `@cml/cml`
- Wrap LLM call in `withValidationRetry()`
- Add explicit JSON schema examples to prompt
- Validate `motiveStrength` enum values
- Retry up to 2 times on validation failure

**Validation Rules:**
- All required fields present
- `motiveStrength` is enum: `weak | moderate | strong | compelling`
- `humourLevel` is number 0.0-1.0
- `humourStyle` is valid enum value

**Estimated Effort:** 3 hours

---

#### 1.3: Add Schema Validation to Agent 2c (Location Profiles)
**File:** `packages/prompts-llm/src/agent2c-location-profiles.ts`

**Changes:**
- Import `validateArtifact` from `@cml/cml`
- Wrap LLM call in `withValidationRetry()`
- Add explicit JSON schema to prompt showing object structure
- Validate each location is an object with required fields
- Retry up to 2 times on validation failure

**Validation Rules:**
- `keyLocations` is array of objects (not strings)
- Each location has: `name`, `description`, `significance`, `atmosphere`
- All fields are non-empty strings

**Estimated Effort:** 3 hours

---

#### 1.4: Extend Validation to Other Artifact Agents
**Files to modify:**
- `packages/prompts-llm/src/agent2d-temporal-context.ts`
- `packages/prompts-llm/src/agent2e-background-context.ts`
- `packages/prompts-llm/src/agent3b-hard-logic-devices.ts`

**Changes (same pattern):**
- Wrap in `withValidationRetry()`
- Add schema validation before returning
- Retry on validation failure
- Log validation warnings but continue if pass after retry

**Estimated Effort:** 4 hours (all three)

---

**Phase 1 Total:** ~14 hours

---

## Phase 2: Enhanced CML Schema for Prose Guidance (High Priority)

**Goal:** Make CML explicitly specify prose validation requirements so Agent 9 has clear guidance.

### Tasks

#### 2.1: Extend CML Schema with Prose Validation Requirements
**File:** `schema/cml_2_0.schema.yaml`

**New Top-Level Section:**
```yaml
proseRequirements:
  type: object
  required: [discriminatingTestScene, suspectClearanceScenes, culpritRevelationScene, identityRules]
  properties:
    discriminatingTestScene:
      type: object
      properties:
        actNumber: { type: integer }
        sceneNumber: { type: integer }
        requiredElements: { type: array, items: { type: string } }
        testType: { type: string }
    
    suspectClearanceScenes:
      type: array
      items:
        type: object
        properties:
          suspectName: { type: string }
          actNumber: { type: integer }
          sceneNumber: { type: integer }
          clearanceMethod: { type: string }
          supportingClues: { type: array, items: { type: string } }
    
    culpritRevelationScene:
      type: object
      properties:
        actNumber: { type: integer }
        sceneNumber: { type: integer }
        revelationMethod: { type: string }
    
    identityRules:
      type: array
      items:
        type: object
        properties:
          characterName: { type: string }
          revealedInScene: { type: string }
          beforeReveal: { type: string }  # How to reference before reveal
          afterReveal: { type: string }   # How to reference after reveal
    
    clueToSceneMapping:
      type: array
      items:
        type: object
        properties:
          clueId: { type: string }
          actNumber: { type: integer }
          sceneNumber: { type: integer }
          deliveryMethod: { type: string }
```

**Estimated Effort:** 3 hours

---

#### 2.2: Update Agent 3 to Generate Prose Requirements
**File:** `packages/prompts-llm/src/agent3-cml.ts`

**Changes:**
- Add prose requirements section to CML generation prompt
- Instruct Agent 3 to specify which outline scenes will contain validation requirements
- Map clues to specific act/scene positions
- Define identity alias rules for each character

**Prompt Additions:**
```
You must also generate a `proseRequirements` section that specifies:
1. Which scene contains the discriminating test execution
2. For each suspect, which scene explicitly clears them
3. Which scene reveals the culprit's identity
4. Identity alias rules (how characters should be named before/after reveals)
5. Mapping of clues to specific scenes where they appear
```

**Estimated Effort:** 4 hours

---

#### 2.3: Update Agent 7 to Respect Prose Requirements
**File:** `packages/prompts-llm/src/agent7-narrative.ts`

**Changes:**
- Accept `proseRequirements` from CML as input
- Include prose requirements in outline generation prompt
- Ensure outline includes required scenes at specified acts
- Add scene-level metadata marking validation-critical scenes

**Estimated Effort:** 3 hours

---

#### 2.4: Update Agent 9 to Follow Prose Requirements
**File:** `packages/prompts-llm/src/agent9-prose.ts`

**Changes:**
- Accept `proseRequirements` from CML as input
- Add prose requirements to generation prompt
- For each chapter, show which validation requirements must be satisfied
- Include identity alias rules in character context

**Prompt Additions:**
```
CRITICAL PROSE REQUIREMENTS for this chapter:
- [List any discriminating test, suspect clearance, or culprit revelation requirements for this chapter]
- Character identity rules: [Show alias rules]
- Required clues to incorporate: [List clue IDs mapped to this chapter]
```

**Estimated Effort:** 4 hours

---

**Phase 2 Total:** ~14 hours

---

## Phase 3: Chapter-by-Chapter Prose Validation (High Priority)

**Goal:** Validate each chapter immediately after generation to catch errors early and minimize regeneration costs.

### Tasks

#### 3.1: Refactor Agent 9 for Sequential Chapter Generation
**File:** `packages/prompts-llm/src/agent9-prose.ts`

**Current Behavior:** Generates all chapters in one LLM call  
**New Behavior:** Generate chapters sequentially, validate each before proceeding

**New Function Signatures:**
```typescript
interface ChapterGenerationContext {
  chapterNumber: number;
  previousChapters: Chapter[];
  narrativeOutline: NarrativeOutline;
  caseData: CaseData;
  proseRequirements: ProseRequirements;
  // ... other context
}

async function generateChapter(
  context: ChapterGenerationContext
): Promise<{ chapter: Chapter; cost: number }>

async function generateProseSequential(
  inputs: ProseGenerationInputs
): Promise<ProseGenerationResult>
```

**Implementation:**
- Loop through outline acts/scenes
- Generate each chapter with context from previous chapters
- Return chapter + cost after each generation
- Build cumulative context for next chapter

**Estimated Effort:** 8 hours

---

#### 3.2: Create Per-Chapter Validation Function
**File:** `packages/story-validation/src/per-chapter-validator.ts` (new)

**Implementation:**
```typescript
interface ChapterValidationResult {
  passed: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  criticalIssues: string[];
}

function validateChapter(
  chapter: Chapter,
  chapterNumber: number,
  proseRequirements: ProseRequirements,
  cml: CaseData,
  previousChapters: Chapter[]
): ChapterValidationResult
```

**Validation Checks:**
- If this chapter should contain discriminating test scene, verify it's present
- If this chapter should clear suspects, verify clearance is explicit
- If this chapter reveals culprit, verify revelation is present
- Check identity alias consistency with previous chapters
- Verify required clues are incorporated

**Estimated Effort:** 6 hours

---

#### 3.3: Integrate Chapter Validation into Sequential Generation
**File:** `packages/prompts-llm/src/agent9-prose.ts`

**Changes:**
- After generating each chapter, call `validateChapter()`
- If validation fails with critical issues:
  - Regenerate chapter with validation feedback (up to 2 attempts)
  - If still fails after 2 attempts, continue but log warning
- Only proceed to next chapter after current chapter passes
- Track per-chapter validation attempts and costs

**Estimated Effort:** 4 hours

---

#### 3.4: Update Orchestrator to Use Sequential Prose Generation
**File:** `apps/worker/src/jobs/mystery-orchestrator.ts`

**Changes:**
- Replace single `generateProse()` call with sequential version
- Update progress reporting to show "Generating chapter X of Y"
- Handle per-chapter validation results
- Aggregate chapter costs
- Keep final validation pass for cross-chapter consistency

**Estimated Effort:** 3 hours

---

**Phase 3 Total:** ~21 hours

---

## Phase 4: Enhanced Clue Coverage Requirements (Medium Priority)

**Goal:** Improve clue distribution quality by making coverage requirements explicit in CML.

### Tasks

#### 4.1: Add Clue Coverage Requirements to CML Schema
**File:** `schema/cml_2_0.schema.yaml`

**New Section in `proseRequirements`:**
```yaml
clueDistributionRequirements:
  type: object
  properties:
    inferenceStepCoverage:
      type: array
      items:
        type: object
        properties:
          stepNumber: { type: integer }
          requiredClueTypes: { type: array, items: { type: string } }
          mustHaveContradiction: { type: boolean }
    
    suspectCoverage:
      type: array
      items:
        type: object
        properties:
          suspectName: { type: string }
          requiredClues: 
            type: array
            items:
              type: object
              properties:
                clueType: { type: string }
                purpose: { type: string }  # "eliminate", "implicate", "misdirect"
    
    redHerringConstraints:
      type: object
      properties:
        maxRedHerrings: { type: integer }
        cannotSupport: { type: array, items: { type: string } }
```

**Estimated Effort:** 2 hours

---

#### 4.2: Update Agent 3 to Generate Clue Coverage Requirements
**File:** `packages/prompts-llm/src/agent3-cml.ts`

**Changes:**
- For each inference step, specify required clue types
- For each suspect, specify what clues must exist to eliminate them
- Define red herring constraints (what they must NOT support)

**Estimated Effort:** 3 hours

---

#### 4.3: Update Agent 5 to Follow Clue Coverage Requirements
**File:** `packages/prompts-llm/src/agent5-clues.ts`

**Changes:**
- Accept `clueDistributionRequirements` as input
- Add requirements to prompt explicitly
- Generate clues that satisfy coverage matrix
- Self-check against requirements before returning

**Estimated Effort:** 4 hours

---

#### 4.4: Make WP4 Coverage Checks Blocking
**File:** `apps/worker/src/jobs/mystery-orchestrator.ts`

**Changes:**
- Change WP4 checks from warnings to errors for critical gaps:
  - Inference steps with no clues → ERROR (not warning)
  - Suspects never referenced → ERROR
  - Red herrings supporting true solution → ERROR
- Only allow retry if coverage requirements exist in CML
- If fail after retry, downgrade to warnings but log clearly

**Lines to modify:** ~400-650 (WP4 section)

**Estimated Effort:** 3 hours

---

**Phase 4 Total:** ~12 hours

---

## Phase 5: Testing and Documentation (Medium Priority)

### Tasks

#### 5.1: Create Unit Tests for Validation Wrapper
**File:** `packages/prompts-llm/tests/validation-retry-wrapper.test.ts` (new)

**Tests:**
- Successful generation on first attempt
- Retry after validation failure
- Max attempts exceeded
- Cost tracking across attempts

**Estimated Effort:** 3 hours

---

#### 5.2: Create Integration Tests for Chapter-by-Chapter Generation
**File:** `packages/prompts-llm/tests/agent9-sequential.test.ts` (new)

**Tests:**
- Sequential generation success
- Chapter validation failure + retry
- Progress tracking
- Context building across chapters

**Estimated Effort:** 4 hours

---

#### 5.3: Update Documentation
**Files:**
- `PIPELINE_METHOD_MAP.md` - Document new validation flows
- `documentation/02_cml_and_agents.md` - Document prose requirements section
- `documentation/03_architecture_backend.md` - Document sequential prose generation
- `documentation/04_llm_ai.md` - Document validation + retry patterns

**Estimated Effort:** 4 hours

---

#### 5.4: Create Validation Testing Guide
**File:** `validation/VALIDATION_TESTING_GUIDE.md` (new)

**Contents:**
- How to test schema validation
- How to trigger chapter validation failures
- How to verify prose requirements are followed
- Test cases for each validation type

**Estimated Effort:** 2 hours

---

**Phase 5 Total:** ~13 hours

---

## Implementation Priority

### Must-Have (Ship Blockers)
1. **Phase 1: Agent-Level Schema Validation** (~14 hours)
   - Fixes immediate schema compliance failures (Agents 2b, 2c)
   - Prevents malformed data in pipeline
   - Highest ROI, lowest risk

2. **Phase 2: Enhanced CML Schema** (~14 hours)
   - Provides foundation for prose validation
   - Reduces prose generation errors at source
   - Required for Phase 3

3. **Phase 3: Chapter-by-Chapter Validation** (~21 hours)
   - Biggest cost savings on prose regeneration
   - Early error detection
   - Dependency on Phase 2

### Should-Have (Quality Improvements)
4. **Phase 4: Enhanced Clue Coverage** (~12 hours)
   - Improves clue distribution quality
   - Makes WP4 checks more effective
   - Can be done in parallel with Phase 1-2

### Nice-to-Have (Polish)
5. **Phase 5: Testing and Documentation** (~13 hours)
   - Ensures stability
   - Makes system maintainable
   - Do incrementally with each phase

---

## Total Effort Estimate

- **Phase 1:** 14 hours
- **Phase 2:** 14 hours
- **Phase 3:** 21 hours
- **Phase 4:** 12 hours
- **Phase 5:** 13 hours

**Total:** ~74 hours (~2 weeks for one developer)

---

## Rollout Strategy

### Week 1: Foundation
- **Days 1-2:** Phase 1 (schema validation + retry wrapper)
- **Days 3-4:** Phase 2 (CML schema + Agent 3 updates)
- **Day 5:** Testing and validation of Phases 1-2

### Week 2: Core Features
- **Days 1-3:** Phase 3 (sequential prose generation)
- **Days 4-5:** Phase 4 (clue coverage requirements)

### Week 3: Polish
- **Days 1-2:** Phase 5 (testing + documentation)
- **Days 3-5:** Bug fixes, optimization, manual testing

---

## Success Metrics

### Before Implementation (Current State)
- Schema validation failures: ~4 per generation
- Prose validation failures: ~60% of generations
- Full prose regeneration cost: $5-8 per failure
- Clue coverage warnings: ~3 per generation

### After Implementation (Target)
- Schema validation failures: <1% (caught and retried automatically)
- Prose validation failures: <20% of generations
- Average prose regeneration cost: $1-2 per failure (only failing chapters)
- Clue coverage warnings: <1 per generation (blocked by requirements)
- Overall generation success rate: >90% without manual intervention

---

## Risk Mitigation

### Risk: Sequential prose generation increases total cost
**Mitigation:** Per-chapter generation actually reduces total cost because:
- Validation is cheap compared to regeneration
- Only failing chapters regenerate (not all chapters)
- Early chapters inform later chapters, reducing errors

### Risk: Schema validation retry adds latency
**Mitigation:** 
- Most agents pass validation on first attempt
- Retries only add ~30s per agent
- Total pipeline latency increase: <2 minutes
- Worth the trade-off for correctness

### Risk: CML schema changes break existing seeds
**Mitigation:**
- Make `proseRequirements` optional initially
- Agent 3 defaults to basic requirements if not specified
- Backward compatible with existing CML files
- Gradual migration path

---

## Maintenance Plan

### Ongoing Monitoring
- Track validation failure rates per agent
- Monitor retry frequency and costs
- Alert on schema validation failure spikes
- Dashboard showing validation metrics

### Iteration Points
- After Phase 1: Review schema validation effectiveness
- After Phase 3: Measure cost savings from sequential generation
- After Phase 4: Assess clue coverage improvement
- Monthly review of validation rules and thresholds

---

**END OF PLAN**

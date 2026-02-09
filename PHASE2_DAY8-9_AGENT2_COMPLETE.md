# Phase 2 - Week 2 Day 8-9: Agent 2 (Cast & Motive Designer) - COMPLETE ✅

**Date**: February 9, 2026  
**Status**: Fully Implemented and Tested

## Overview

Agent 2 generates psychologically rich character casts with detailed profiles, interconnected relationships, diversity checks, and crime dynamics analysis for classic mystery stories.

## Implementation Details

### Files Created
- **`packages/prompts-llm/src/agent2-cast.ts`** (331 lines)
  - Main agent implementation with prompt building and LLM integration
  - Follows simplified pattern (NO explicit logging like Agent 1)
  
- **`packages/prompts-llm/__tests__/agent2.test.ts`** (23 tests)
  - Unit tests for prompt building logic
  - Coverage: prompt structure, settings, crime types, requirements
  
- **`packages/prompts-llm/examples/agent2-demo.ts`**
  - Integration demo with real Azure OpenAI
  - Successfully generates 6-character cast with full profiles

## Architecture Decision

**Simplified Pattern (NO Logging)**:
- Agent 2 follows Agent 1's pattern: NO explicit logging infrastructure
- Unlike Agent 3 which uses logger from llm-client
- Rationale: Simpler implementation, easier debugging, fewer dependencies
- Documented in PHASE2_LLM_INTEGRATION_PLAN.md and file headers

## Configuration

```typescript
{
  temperature: 0.7,      // Creative but controlled
  maxTokens: 4000,       // 6 characters with detailed profiles
  jsonMode: true,        // Structured output for parsing
  maxAttempts: 3         // Retry logic with validation
}
```

## Character Profile Structure

Each character includes 12 required fields:

### Basic Profile
- `name`: Full character name
- `ageRange`: Age description (e.g., "late 50s", "mid 20s")
- `occupation`: Character's profession or role

### Role & Persona
- `roleArchetype`: Detective, culprit candidate, red herring, victim candidate, witness, authority figure
- `publicPersona`: How character presents themselves publicly
- `privateSecret`: Hidden information character conceals

### Motive & Opportunity
- `motiveSeed`: Psychological basis for potential culpability
- `motiveStrength`: weak | moderate | strong | compelling
- `alibiWindow`: Time window and verification status
- `accessPlausibility`: Opportunity level for crime commission
- `stakes`: What character risks losing

### Character Arc
- `characterArcPotential`: How character might evolve during investigation

## Output Structure

### 1. Characters Array
6 complete character profiles with all required fields

### 2. Relationship Web
- Relationship pairs between characters
- Connection type and shared history
- Tension levels: low | moderate | high
- Potential for conflict escalation

### 3. Diversity Checks
- `stereotypeCheck`: List of stereotypes to avoid
- `recommendations`: Authentic representation strategies

### 4. Crime Dynamics
- `possibleCulprits`: Characters with strong motive/opportunity (2-3)
- `redHerrings`: Characters with suspicious traits but unlikely culpability (1-2)
- `victimCandidates`: Characters at risk (1-2)
- `detectiveCandidates`: Characters who might solve the mystery (1-2)

## Test Results

### Unit Tests: 23/23 Passing ✅

**buildCastPrompt Structure (10 tests)**:
- ✅ Complete prompt structure
- ✅ Character design specialist system prompt
- ✅ Character profile template
- ✅ Relationship web template
- ✅ Diversity check requirements
- ✅ Crime dynamics analysis
- ✅ JSON output format specification
- ✅ Character names in user prompt
- ✅ Setting and crime type inclusion
- ✅ Messages array formatting

**Different Settings (3 tests)**:
- ✅ Ocean liner setting
- ✅ University setting
- ✅ Missing optional socialContext handling

**Different Crime Types (2 tests)**:
- ✅ Theft
- ✅ Blackmail

**Requirements Validation (8 tests)**:
- ✅ Character count requirement
- ✅ Diverse representation
- ✅ Interconnected relationships
- ✅ Motive and alibi generation
- ✅ Culprit candidates
- ✅ Red herrings
- ✅ Stereotype avoidance
- ✅ Public facade and private secrets

### Integration Test: Successful ✅

**Demo Input**:
```typescript
{
  characterNames: [
    "Lady Margaret Ashford",
    "Professor James Hartford",
    "Miss Emily Thornton",
    "Dr. Charles Westwood",
    "Mrs. Catherine Blake",
    "Inspector Thomas Reid"
  ],
  setting: {
    location: "Ashford Manor",
    era: "1930s",
    restrictions: "No anachronisms"
  },
  crimeType: "murder",
  tone: "classic_golden_age",
  socialContext: "English countryside estate, class divisions"
}
```

**Demo Output**:
- ✅ 6 complete character profiles
- ✅ Age ranges: late 50s, early 60s, mid 20s, early 40s, mid 40s, late 30s
- ✅ Occupations: matriarch, scholar, amateur sleuth, physician, housekeeper, detective
- ✅ Role archetypes: authority, witness, detective candidate, witness, culprit candidate, detective
- ✅ Public personas and private secrets for each
- ✅ Motive strengths: strong (2), moderate (2), compelling (1), weak (1)
- ✅ 5 key relationships with tension levels
- ✅ Diversity checks: 4 stereotypes to avoid, 5 recommendations
- ✅ Crime dynamics:
  - Possible Culprits: 3 (Lady Margaret, Dr. Westwood, Mrs. Blake)
  - Red Herrings: 2 (Professor Hartford, Emily Thornton)
  - Victim Candidates: 1
  - Detective Candidates: 2 (Inspector Reid, Emily Thornton)

## Performance Metrics

- **Latency**: ~24 seconds per cast generation
- **Success Rate**: 100% (attempt 1 in demo)
- **Token Usage**: ~4000 output tokens per cast
- **Cost**: ~$0.01-0.02 per generation (estimated)

## Key Functions

### `buildCastPrompt(inputs: CastInputs): PromptComponents`

Constructs the full prompt with:
- System prompt (character design specialist role)
- Developer prompt (templates and requirements)
- User prompt (specific cast requirements)

### `designCast(client, inputs, maxAttempts): Promise<CastDesignResult>`

Main agent function with:
1. Build prompt from inputs
2. Call Azure OpenAI with JSON mode
3. Parse and validate response
4. Retry on failures (up to 3 attempts)
5. Return structured cast design

## Example Generated Cast

**Lady Margaret Ashford** (late 50s, matriarch):
- Public: Commanding presence, maintains social order
- Secret: Financial troubles threaten estate
- Motive: Strong (protect family legacy)
- Arc: May soften as investigation reveals vulnerabilities

**Professor James Hartford** (early 60s, intellectual):
- Public: Respected academic guest, collector
- Secret: Academic fraud decades ago
- Motive: Moderate (protect reputation)
- Arc: Red herring - suspicious but ultimately innocent

**Miss Emily Thornton** (mid 20s, amateur sleuth):
- Public: Bright, curious, book-smart
- Secret: Hidden connection to victim's past
- Motive: Moderate (seeking justice or revenge)
- Arc: Detective candidate - may uncover truth

## Integration Points

Agent 2 outputs feed into:
- **Agent 3 (CML Generator)**: Uses character profiles to populate `CASE.cast[]` section
- **UI Character Builder**: Can display Agent 2 output directly for user refinement
- **Relationship Visualizer**: Relationship web data for graph display

## Known Limitations

1. **Cost Tracking**: Simplified client doesn't return cost in response (set to 0)
2. **Character Count**: Fixed at 6 characters (not configurable)
3. **Validation**: No schema validation of JSON output (relies on LLM compliance)

## Next Steps

**Agent 4 (CML Revision Agent)** - Week 2 Day 10:
- Parse CML validation errors from Agent 3
- Generate targeted revision prompts
- Implement iterative revision loop
- Fix ~90% of Agent 3 validation failures
- Enable production-ready CML generation

Agent 2 is ready for production use and integration into the full pipeline!

---

**Implementation Notes**:
- No explicit logging = simpler debugging
- JSON mode = reliable structured output
- Diversity checks = built-in bias detection
- Crime dynamics = automatic role assignment
- Relationship web = interconnected cast design

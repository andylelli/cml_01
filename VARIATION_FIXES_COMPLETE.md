# Variation Fixes Complete

## Problem
LLMs were generating repetitive content across multiple generations:
- Same dates (e.g., always October 1954)
- Similar character names and relationship patterns
- Similar location names and architectural details

## Root Cause
**Passive seed instructions don't work.** Simply showing runId/projectId and saying "use this to vary" is meaningless to an LLM. The model has no mechanism to actually use a string ID to generate variation.

## Solution Applied

### Deterministic Hash-Based Variation

Added hash functions that convert runId → specific variation directives that the LLM can follow.

---

## Agent 2d: Temporal Context ✅

**What Was Fixed:**
- Added `simpleHash()` function to convert runId to number
- Added `generateSpecificDate()` that deterministically picks year (0-9 offset) and month (1-12) within the decade
- **Injected specific date into prompt** as a requirement (not a suggestion)
- Changed from "choose a date randomly" to "YOU MUST use March 1957"
- Increased temperature from 0.5 → 0.7

**Result:**
- Each runId generates a different date within the decade constraints
- 120 possible combinations (10 years × 12 months)
- LLM is told the EXACT date, cannot default to October/June

---

## Agent 1: Setting ✅

**What Was Fixed:**
- Added `generateVariationSeed()` that creates:
  - `archStyle` (1-5): Level of architectural detail to include
  - `nameStyle` (1-5): Distinctiveness of property names
  - `focusArea` (1-3): Which detail area to emphasize (Social/Physical/Atmospheric)
- Replaced passive "use seed to vary" with **specific directives**:
  ```
  VARIATION DIRECTIVES FOR THIS MYSTERY:
  - Architectural Style Emphasis: 4/5 (highly detailed)
  - Naming Convention: 5/5 (distinctive/unusual)
  - Detail Focus Area: Physical Spaces
  ```
- Increased temperature from 0.3 → 0.6

**Result:**
- Each runId generates different emphasis levels
- LLM gets actionable instructions, not vague suggestions
- More varied location names, architectural descriptions

---

## Agent 2: Cast ✅

**What Was Fixed:**
- Added `generateCastVariation()` that creates:
  - `relationshipStyle` (1-4): Which type of relationships to emphasize
  - `motivePattern` (1-3): How to distribute motives across cast
  - `dynamicType` (1-3): Which social dynamic to highlight
- Replaced passive seed with **specific thematic directives**:
  ```
  VARIATION DIRECTIVES FOR THIS CAST:
  - Relationship Theme: Emphasize romantic entanglements and betrayals
  - Motive Distribution: concentrate strong motives in 2-3 characters
  - Social Dynamic: Highlight insider vs outsider dynamics
  ```
- Increased temperature from 0.7 → 0.75

**Result:**
- Each runId generates different relationship patterns
- Different motive distributions (concentrated vs spread)
- Different social dynamics emphasized
- More varied character archetypes and names

---

## Technical Implementation

### Hash Function
```typescript
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};
```

### Variation Generation Pattern
```typescript
const generateVariation = (runId: string) => {
  const hash = simpleHash(runId);
  return {
    param1: (hash % N) + 1,          // Use modulo for first parameter
    param2: ((hash >> 4) % M) + 1,   // Shift bits for second parameter
    param3: ((hash >> 8) % K) + 1    // Shift more for third parameter
  };
};
```

**Key insight:** Use bit-shifting to extract different random values from the same hash.

---

## Temperature Increases

| Agent | Old Temp | New Temp | Reason |
|-------|----------|----------|--------|
| Agent 2d (Temporal) | 0.5 | 0.7 | More varied descriptions |
| Agent 1 (Setting) | 0.3 | 0.6 | Allow creative location naming |
| Agent 2 (Cast) | 0.7 | 0.75 | More diverse characters |

Higher temperature = more variation in creative content, while still following structural constraints.

---

## Why This Works

### Before (Passive):
```
Uniqueness Seed: abc123-xyz789
Use this seed to vary your output.
```
❌ LLM sees the seed but has no mechanism to use it
❌ Defaults to most common/prototypical output
❌ Low temperature makes it highly deterministic

### After (Active):
```
VARIATION DIRECTIVES FOR THIS MYSTERY:
- Architectural Style Emphasis: 4/5 (highly detailed)
- Naming Convention: 5/5 (distinctive/unusual)
```
✅ LLM gets specific, actionable instructions
✅ Each runId produces different instructions
✅ Higher temperature allows execution of creative directives

---

## Testing Verification

Generate 3-5 mysteries with different runIds and verify:

### Temporal Context:
- [ ] Different months selected (not all October)
- [ ] Different years within each decade
- [ ] Appropriate seasonal descriptions for chosen months

### Setting:
- [ ] Different property names (not all "[Place] Manor")
- [ ] Varied architectural detail levels
- [ ] Different emphasis areas across generations

### Cast:
- [ ] Different relationship patterns
- [ ] Varied character names (no repeated patterns)
- [ ] Different motive distributions
- [ ] Different social dynamics emphasized

---

## Files Modified

1. `packages/prompts-llm/src/agent2d-temporal-context.ts`
   - Added hash and date generation functions
   - Inject specific dates into prompts
   - Increased temperature to 0.7

2. `packages/prompts-llm/src/agent1-setting.ts`
   - Added hash and variation seed functions
   - Generate specific variation directives
   - Increased temperature to 0.6

3. `packages/prompts-llm/src/agent2-cast.ts`
   - Added hash and cast variation functions
   - Generate specific thematic directives
   - Increased temperature to 0.75

---

## Related Documentation

- [FALLBACK_TEXT_ELIMINATION_PLAN.md](FALLBACK_TEXT_ELIMINATION_PLAN.md) - Removed hardcoded example text
- [FALLBACK_TEXT_ELIMINATION_COMPLETE.md](FALLBACK_TEXT_ELIMINATION_COMPLETE.md) - Example text removal completion

---

## Status: ✅ Complete

All three agents now use deterministic hash-based variation to ensure unique outputs per runId while staying within the specified constraints.

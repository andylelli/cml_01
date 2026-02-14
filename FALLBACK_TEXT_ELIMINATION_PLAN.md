# Fallback Text Elimination Plan

## Problem
User reports getting "the same month and date and similar cast names" in generated mysteries. Investigation found hardcoded examples in agent prompts that the LLM may be copying instead of generating unique content.

## Hardcoded Examples Found

### Agent 2d (Temporal Context) - Line 120-190
**Location**: `packages/prompts-llm/src/agent2d-temporal-context.ts`
**Hardcoded values**:
- `"October"` (appears 3 times in example JSON)
- `"October 1954"` (specific date example)
- Various 1954-specific examples (films, books, prices, cultural references)

**Impact**: LLM may copy "October 1954" instead of choosing a random month/year within the decade.

### Agent 9 (Prose) - Line 235-370
**Location**: `packages/prompts-llm/src/agent9-prose.ts`
**Hardcoded values**:
- Line 315: `"The June morning brought oppressive heat to Ashford Manor"`
- Line 315: `"Lord Ashford's pocket watch"`
- Line 315: `"rose gardens"`
- Line 342: `"Lady Pemberton"`
- Line 235: `"The library smelled of leather and pipe tobacco"`

**Impact**: LLM may copy "June", "Ashford Manor", "Lady Pemberton" names instead of generating unique content.

### Examples in Other Locations
**Agent 9 humour/dialogue examples** (lines 274-300):
- Multiple dialogue examples with placeholder characters
- These are teaching examples, less likely to be copied
- Still should add warnings

## Solution Strategy

### 1. Replace Specific Examples with Placeholders

#### Agent 2d Changes:
```typescript
// OLD:
"year": 1954,
"month": "October",

// NEW:
"year": <CHOOSE_YEAR_WITHIN_DECADE>,
"month": "<CHOOSE_APPROPRIATE_MONTH>",
```

Replace all `1954` references with `<YEAR>`, all `October` with `<MONTH>`.

#### Agent 9 Changes:
```typescript
// OLD:
Example: "The June morning brought oppressive heat to Ashford Manor..."

// NEW:
Example: "The <SEASON> morning brought <WEATHER_DESCRIPTION> to <LOCATION_NAME>..."
```

Replace:
- `"June"` → `"<MONTH>"`
- `"Ashford Manor"` → `"<LOCATION_NAME>"`
- `"Lord Ashford"` → `"<CHARACTER_NAME>"`
- `"Lady Pemberton"` → `"<CHARACTER_NAME>"`
- `"rose gardens"` → `"<LOCATION_DETAILS>"`
- `"library smelled of leather and pipe tobacco"` → `"<LOCATION> smelled of <PERIOD_APPROPRIATE_SCENTS>"`

### 2. Add Explicit Anti-Copying Warnings

Add to every agent with examples:
```
⚠️ CRITICAL: The examples above use placeholder values like <MONTH>, <CHARACTER_NAME>, etc.
DO NOT copy these placeholders or the example content literally.
Generate entirely unique, original content specific to this mystery's setting, era, and characters.
The examples show STRUCTURE and STYLE only, not content to reuse.
```

### 3. Strengthen Uniqueness Instructions

Add to all generation agents:
```
UNIQUENESS REQUIREMENTS:
- Use the runId (${runId}) and projectId (${projectId}) to ensure varied outputs
- Never use generic placeholder names like "John", "Mary", "Lord Ashford"
- Choose month/date randomly within the specified decade
- All character names MUST come from the provided cast list
- All location names MUST come from the setting refinement
- Generate fresh, original descriptions - do not copy example phrasing
```

### 4. Specific Fixes Per Agent

#### Agent 2d (Temporal Context)
1. Replace all `1954` with `<YEAR>` or `[CHOSEN_YEAR]`
2. Replace all `October` with `<MONTH>` or `[CHOSEN_MONTH]`
3. Add instruction: "Choose a specific year and month randomly within ${decade}. Do not default to October or any specific month."
4. Add warning after example JSON

#### Agent 9 (Prose)
1. Replace "June morning...Ashford Manor" example with placeholder version
2. Replace "Lady Pemberton" example with placeholder version
3. Replace "library...pipe tobacco" example with placeholder version
4. Add warning after each example section
5. Add instruction: "Use the actual character names from the cast list provided. Use the actual location names from the setting. Generate unique atmospheric descriptions."

## Implementation Order

1. ✅ Document all hardcoded examples (this file)
2. Fix Agent 2d temporal context examples
3. Fix Agent 9 prose examples
4. Add anti-copying warnings to both agents
5. Add uniqueness enforcement instructions
6. Test with multiple generations to confirm variation

## Testing Verification

After implementation, generate 3 mysteries and verify:
- [ ] Different months/years chosen (not always October or June)
- [ ] No "Ashford Manor" or "Lady Pemberton" appearing
- [ ] Character names from actual cast (not generic examples)
- [ ] Location names from actual setting (not examples)
- [ ] Varied atmospheric descriptions (not copying "library smelled of leather")

## Success Criteria

✅ No hardcoded example text appears in generated mysteries
✅ Months/dates vary across generations
✅ Character/location names unique to each mystery
✅ LLM generates original content, not copied examples

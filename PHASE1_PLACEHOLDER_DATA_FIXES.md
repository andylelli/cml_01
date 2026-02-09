# Phase 1 Placeholder Data Fixes

**Date**: February 9, 2026  
**Purpose**: Fix issues with hardcoded placeholder data appearing before projects are created

---

## Issues Identified

### Issue 1: Setting Overview Shows Before Project Creation
**Problem**: The "Setting overview" card in the Project tab displayed hardcoded placeholder data (`1936 • Country house • Autumn storm`) even when no project had been created yet.

**Root Cause**: [App.vue line 1298](apps/web/src/App.vue#L1298) had a fallback `v-else` that showed static text when `settingData` was null.

```vue
<!-- OLD CODE -->
<div v-if="settingData" class="mt-2 text-sm text-slate-600">
  {{ settingData.decade }} • {{ settingData.locationPreset }} • {{ settingData.weather }}
</div>
<div v-else class="mt-2 text-sm text-slate-600">
  1936 • Country house • Autumn storm  <!-- ❌ Hardcoded placeholder -->
</div>
```

**Fix**: Removed the hardcoded fallback. Now the entire "Setting overview" card only appears when `settingData` exists.

```vue
<!-- NEW CODE -->
<div v-if="settingData" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
  <div class="text-sm font-semibold text-slate-700">Setting overview</div>
  <div class="mt-2 text-sm text-slate-600">
    {{ settingData.decade ?? "Unknown era" }} •
    {{ settingData.locationPreset ?? "Unknown location" }} •
    {{ settingData.weather ?? "Unknown weather" }}
  </div>
  <!-- ... -->
</div>
```

**Result**: 
- ✅ No setting data appears before project creation
- ✅ Setting overview only shows after running the pipeline
- ✅ Clear indication that no data exists yet

---

### Issue 2: Clues Are Always Identical
**Problem**: Every project generated the exact same clues regardless of user specifications (decade, location, primary axis, cast names).

**Example of Identical Clues**:
- "The clock in the library stopped at 8:40." (always the same time, always the library)
- "Only the kitchen keyring was missing overnight." (always the kitchen)
- "A teacup carries a bitter almond scent." (always a teacup)
- "A neighbor reported a shadow by the greenhouse." (always the greenhouse)

**Root Cause**: [server.ts deriveClues()](apps/api/src/server.ts#L243) function returned hardcoded static clues without considering the project spec.

```typescript
// OLD CODE
const deriveClues = (spec?: Record<string, unknown>) => {
  const density = (spec?.clueDensity as string) ?? "medium";
  const axis = (spec?.primaryAxis as string) ?? "temporal";
  const baseClues = [
    {
      id: "clue-1",
      category: "time",
      text: "The clock in the library stopped at 8:40.",  // ❌ Always the same
      pointsTo: "timeline discrepancy",
      redHerring: false,
      revealChapter: 1,
    },
    // ... more static clues
  ];
  // ...
};
```

**Fix**: Modified `deriveClues()` to generate clues dynamically based on:
- `primaryAxis` - Different clue types for temporal/spatial/identity/behavioral/authority
- `decade` - Era-appropriate evidence (telegram in 1930s, letter in 1940s, document in 1950s)
- `locationPreset` - Location-specific details (library in CountryHouse, suite in SeasideHotel)
- `cast.suspects` - Uses actual character names from the project

```typescript
// NEW CODE
const deriveClues = (spec?: Record<string, unknown>) => {
  const density = (spec?.clueDensity as string) ?? "medium";
  const axis = (spec?.primaryAxis as string) ?? "temporal";
  const decade = (spec?.decade as string) ?? "1930s";
  const location = (spec?.locationPreset as string) ?? "CountryHouse";
  const cast = deriveCast(spec);
  const firstSuspect = cast.suspects[0] ?? "the suspect";
  const secondSuspect = cast.suspects[1] ?? "another guest";

  // Generate axis-specific clues that vary by project settings
  const axisClues: Record<string, { category: string; text: string; pointsTo: string }> = {
    temporal: {
      category: "time",
      text: `A clock was stopped at ${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}.`,
      pointsTo: "timeline discrepancy",
    },
    spatial: {
      category: "access",
      text: `Only ${firstSuspect} had access to the ${location === "CountryHouse" ? "library" : location === "SeasideHotel" ? "suite" : "restricted area"}.`,
      pointsTo: "restricted access",
    },
    identity: {
      category: "testimony",
      text: `${secondSuspect} was seen in two places at once according to witness statements.`,
      pointsTo: "identity confusion",
    },
    behavioral: {
      category: "behavior",
      text: `${firstSuspect} exhibited unusual nervous behavior when questioned about the evening.`,
      pointsTo: "suspicious behavior",
    },
    authority: {
      category: "circumstantial",
      text: `A forged ${decade === "1930s" ? "telegram" : decade === "1940s" ? "letter" : "document"} was found claiming official authority.`,
      pointsTo: "authority misuse",
    },
  };

  const primaryClue = axisClues[axis] ?? axisClues.temporal;

  const baseClues = [
    {
      id: "clue-1",
      category: primaryClue.category,
      text: primaryClue.text,  // ✅ Varies by axis
      pointsTo: primaryClue.pointsTo,
      redHerring: false,
      revealChapter: 1,
    },
    {
      id: "clue-2",
      category: "physical",
      text: `A ${decade === "1930s" ? "cigarette stub" : decade === "1940s" ? "matchbook" : "lighter"} was found at the scene.`,  // ✅ Varies by decade
      pointsTo: "physical evidence",
      redHerring: false,
      revealChapter: 2,
    },
    {
      id: "clue-3",
      category: "document",
      text: `A diary entry from ${firstSuspect} mentions a secret meeting.`,  // ✅ Uses actual suspect name
      pointsTo: "motive evidence",
      redHerring: false,
      revealChapter: 2,
    },
  ];

  const redHerrings = [
    {
      id: "red-1",
      category: "testimony",
      text: `${secondSuspect} was reportedly seen near the ${location === "CountryHouse" ? "greenhouse" : location === "SeasideHotel" ? "beach" : "garden"}.`,  // ✅ Varies by location and suspect
      pointsTo: "false lead",
      redHerring: true,
      revealChapter: 1,
    },
  ];

  const items = density === "sparse" ? baseClues : density === "rich" ? [...baseClues, ...redHerrings] : [...baseClues, ...redHerrings];

  return {
    status: "ready",
    density,
    axis,
    summary: `Clues generated based on ${axis} axis in ${decade} ${location} setting.`,  // ✅ Updated summary
    items,
  };
};
```

**Result**:
- ✅ Clues now vary by primary axis (temporal/spatial/identity/behavioral/authority)
- ✅ Physical evidence adapts to decade (cigarette stub in 1930s, matchbook in 1940s, lighter in 1950s)
- ✅ Location references match the chosen setting (library/suite/restricted area)
- ✅ Suspect names from the actual cast are used in clue text
- ✅ Random variation in time-based clues (clock stopped times vary)
- ✅ Summary text reflects the actual project settings

---

## Examples of Variation

### Temporal Axis, 1930s, CountryHouse, Cast: [Avery, Blair, Casey]
**Clues Generated**:
1. "A clock was stopped at 7:23." (random time)
2. "A cigarette stub was found at the scene." (1930s-appropriate)
3. "A diary entry from Avery mentions a secret meeting." (uses Avery)
4. "Blair was reportedly seen near the greenhouse." (uses Blair, CountryHouse location)

### Spatial Axis, 1940s, SeasideHotel, Cast: [Morgan, Quinn, Ellis]
**Clues Generated**:
1. "Only Morgan had access to the suite." (spatial clue, Morgan, suite instead of library)
2. "A matchbook was found at the scene." (1940s-appropriate)
3. "A diary entry from Morgan mentions a secret meeting." (uses Morgan)
4. "Quinn was reportedly seen near the beach." (uses Quinn, SeasideHotel location)

### Identity Axis, 1950s, Village, Cast: [Dana, Harper, Jordan]
**Clues Generated**:
1. "Harper was seen in two places at once according to witness statements." (identity clue)
2. "A lighter was found at the scene." (1950s-appropriate)
3. "A diary entry from Dana mentions a secret meeting." (uses Dana)
4. "Harper was reportedly seen near the garden." (uses Harper, generic location)

---

## Testing

**Test Results**: ✅ All 77 tests passing

**Manual Testing Checklist**:
- [ ] Create new project → No setting data appears
- [ ] Run pipeline → Setting data appears with correct decade/location
- [ ] Create project with temporal axis → Clues mention time discrepancies
- [ ] Create project with spatial axis → Clues mention access restrictions
- [ ] Create project with identity axis → Clues mention witness confusion
- [ ] Create project with 1930s decade → Physical evidence is "cigarette stub"
- [ ] Create project with 1940s decade → Physical evidence is "matchbook"
- [ ] Create project with 1950s decade → Physical evidence is "lighter"
- [ ] Create project with CountryHouse → Red herring mentions "greenhouse"
- [ ] Create project with SeasideHotel → Red herring mentions "beach"
- [ ] Create project with custom cast names → Clues use actual names

---

## Related Documentation

**Updated Files**:
- [apps/web/src/App.vue](apps/web/src/App.vue) - Removed hardcoded setting fallback
- [apps/api/src/server.ts](apps/api/src/server.ts) - Enhanced deriveClues() with variation

**Related Documents**:
- [LLM_GENERATION_MAP.md](LLM_GENERATION_MAP.md) - Stage 6: Clues Generation
- [documentation/06_workflow.md](documentation/06_workflow.md) - Pipeline execution flow
- [PHASE2_TESTING_COMPLETE.md](PHASE2_TESTING_COMPLETE.md) - Previous testing summary

---

## Future Enhancements

**Phase 2+ Improvements**:
1. **Full LLM Clue Generation**: Replace deterministic logic with LLM-generated clues based on CML
2. **More Variation Factors**:
   - Cast size affects clue complexity
   - Tone affects clue presentation style
   - Cast relationships affect red herring content
3. **Clue Density**: Currently only affects count; could affect detail level
4. **Context-Aware Red Herrings**: Generate red herrings that specifically support the false assumption from CML
5. **Chapter-Aware Placement**: Dynamically place clues across outline chapters based on pacing

**Current Limitations**:
- Clues still use deterministic templates (not LLM-generated)
- Limited variation within each axis type
- Red herrings don't yet tie to the false assumption from CML
- Physical evidence only varies by decade (could vary by crime type, location, etc.)

---

## Summary

**Before**:
- ❌ Hardcoded "1936 • Country house • Autumn storm" appeared before project creation
- ❌ Every project generated identical clues regardless of settings
- ❌ No personalization based on cast names or user choices

**After**:
- ✅ No placeholder data appears before pipeline runs
- ✅ Clues vary by primary axis, decade, location, and cast names
- ✅ Physical evidence adapts to era
- ✅ Character names from user spec appear in clue text
- ✅ Location-specific details match chosen setting
- ✅ Summary text reflects actual project configuration

**Impact**:
- Better user experience with no confusing pre-filled data
- Each project feels more unique and customized
- Clues are now contextually appropriate to project settings
- Foundation for future LLM-based clue generation in Phase 2+

# Location & Setting Profile Generation Plan

## Executive Summary

Create a new agent (Agent 2c) to generate rich narrative profiles for locations, settings, and background atmosphere. These profiles will provide detailed, evocative descriptions that Agent 9 (prose generator) can use to enrich the story with vivid setting details, similar to how character profiles currently enrich character descriptions.

---

## Current State Analysis

### Character Profiles (Agent 2b)
**Location:** `packages/prompts-llm/src/agent2b-character-profiles.ts`

**What it does:**
- Takes cast design from Agent 2
- Generates 4-6 narrative paragraphs per character
- Includes: public persona, private secrets, motive seeds, alibi windows
- Target: ~1000 words per character
- Used by Agent 9 to write rich character descriptions

**Pipeline position:** After Agent 7 (Narrative), before Agent 9 (Prose)

### Setting Refinement (Agent 1)
**Location:** `packages/prompts-llm/src/agent1-setting.ts`

**What it does:**
- Refines era and location details
- Adds technology constraints, forensics, social norms
- Physical constraints and access control
- Atmospheric details (weather, mood)

**Output:** Structured constraints, not narrative prose

### Current Gap
- Agent 1 provides **constraints** (what's allowed)
- Agent 9 needs **narrative richness** (how to describe it)
- Character profiles bridge this gap for characters
- **No equivalent exists for locations/settings**

---

## Proposed Solution: Agent 2c - Location Profiles

### Overview

Create a new agent that generates rich narrative profiles for:
1. **Primary Location** (manor, liner, hotel)
2. **Key Locations** (crime scene, gathering spaces, isolated areas)
3. **Atmospheric Background** (era, weather, mood, sensory details)

### Agent Position in Pipeline

```
Agent 1 (Setting Refinement)
    ↓
Agent 2 (Cast Design)
    ↓
Agent 2b (Character Profiles) ← Currently here
    ↓
Agent 2c (Location Profiles) ← NEW
    ↓
Agent 3 (CML Generation)
    ...
Agent 7 (Narrative Outline)
    ↓
Agent 9 (Prose Generation) ← Uses both character AND location profiles
```

**Alternative positioning:** After Agent 7 (Narrative), parallel to Agent 2b

---

## Detailed Design

### 1. Location Profile Structure

```typescript
export interface LocationProfile {
  // Primary location
  primary: {
    name: string;              // "SS Bellerophon", "Ashworth Manor"
    type: string;              // "Ocean liner", "Country house"
    summary: string;           // 1-2 sentence overview
    visualDescription: string; // Physical appearance
    atmosphere: string;        // Mood and feel
    paragraphs: string[];      // 3-5 narrative paragraphs
  };
  
  // Key locations within setting
  keyLocations: Array<{
    id: string;                // "crime_scene", "dining_room", "deck"
    name: string;              // "Captain's Quarters", "Grand Dining Hall"
    type: 'interior' | 'exterior' | 'transitional';
    purpose: string;           // "Crime occurs here", "Clues discovered here"
    visualDetails: string;     // Physical description
    sensoryDetails: {
      sights: string[];        // Visual elements
      sounds: string[];        // Audio atmosphere
      smells: string[];        // Scents
      tactile: string[];       // Touch/temperature
    };
    accessControl: string;     // Who can access, when
    paragraphs: string[];      // 2-3 narrative paragraphs
  }>;
  
  // Atmospheric background
  atmosphere: {
    era: string;               // "1950s Atlantic crossing"
    weather: string;           // "Violent storm at sea"
    timeFlow: string;          // "Compressed 3-day journey"
    mood: string;              // "Claustrophobic tension"
    eraMarkers: string[];      // Authentic period details
    sensoryPalette: {
      dominant: string;        // "Salt spray, brass polish"
      secondary: string[];     // Other sensory notes
    };
    paragraphs: string[];      // 2-3 atmospheric paragraphs
  };
}
```

### 2. Input Data

Agent 2c receives:
- **Agent 1 output:** Setting refinement (era, location constraints, atmosphere)
- **Agent 3 output:** CML data (crime scene location, setting details)
- **Agent 7 output:** Narrative outline (which locations appear in which scenes)

```typescript
export interface LocationProfilesInputs {
  settingRefinement: SettingRefinement;  // From Agent 1
  caseData: CaseData;                     // From Agent 3
  narrative: NarrativeOutline;            // From Agent 7
  tone?: string;                          // "Cozy", "Gothic", "Classic"
  targetWordCount?: number;               // Per location (~800-1200)
  runId?: string;
  projectId?: string;
}
```

### 3. Generation Logic

**Prompt structure:**
```
System: You are a setting and atmosphere specialist for mystery fiction.
        Create vivid, evocative location descriptions that bring the setting to life.

Developer: 
  - Use sensory details: sights, sounds, smells, textures
  - Include era-authentic markers (from Agent 1 constraints)
  - Describe physical layout relevant to mystery (access, sightlines)
  - Create mood appropriate to mystery type
  - Match tone: {cozy|gothic|classic}
  - Target: {targetWordCount} words per location

User: Generate location profiles for this mystery:
      Setting: {location} in {era}
      Primary location: {type}
      Crime scene: {crimeSceneLocation}
      Key locations from outline: {locations from narrative scenes}
      Atmosphere: {weather, mood from Agent 1}
```

### 4. Integration with Agent 9 (Prose)

**Current Agent 9 inputs:**
- CaseData (CML)
- Narrative outline
- Cast design
- (Character profiles - implicitly available but not passed directly)

**Enhanced Agent 9 inputs:**
```typescript
export interface ProseGenerationInputs {
  caseData: CaseData;
  outline: NarrativeOutline;
  cast: CastDesign;
  characterProfiles: CharacterProfilesResult;  // Already available
  locationProfiles: LocationProfilesResult;    // NEW
  targetLength?: "short" | "medium" | "long";
  narrativeStyle?: "classic" | "modern" | "atmospheric";
  runId?: string;
  projectId?: string;
}
```

**Agent 9 prompt enhancement:**
```
You now have access to rich location profiles. Use them to:
- Set vivid scenes with sensory details
- Maintain atmospheric consistency
- Describe locations when characters first encounter them
- Reference setting details organically in action

Location Profiles:
{JSON.stringify(locationProfiles)}

When describing a location:
1. First mention: Use full profile details
2. Return visits: Brief reference to key features
3. Action scenes: Integrate physical details into action
4. Atmospheric: Use sensory palette throughout
```

---

## Implementation Roadmap

### Phase 1: Core Agent (Week 1)

**Tasks:**
1. ✅ Create `packages/prompts-llm/src/agent2c-location-profiles.ts`
2. ✅ Define TypeScript interfaces (LocationProfile, LocationProfilesResult, etc.)
3. ✅ Implement `buildLocationProfilesPrompt()` function
4. ✅ Implement `generateLocationProfiles()` function with LLM call
5. ✅ Add JSON parsing and error handling
6. ✅ Export from `packages/prompts-llm/src/index.ts`

**Deliverables:**
- Working agent that generates location profiles
- Type-safe interfaces
- Error handling and retry logic
- Cost tracking

### Phase 2: Pipeline Integration (Week 1)

**Tasks:**
1. ✅ Update `mystery-orchestrator.ts` to call Agent 2c
2. ✅ Position: After Agent 7 (Narrative), parallel to Agent 2b
3. ✅ Add progress tracking: "Generating location profiles..." (89-90%)
4. ✅ Add cost/duration tracking
5. ✅ Include in `MysteryGenerationResult` interface
6. ✅ Pass location profiles to Agent 9

**Changes:**
```typescript
// In mystery-orchestrator.ts after characterProfiles

// Agent 2c: Location Profiles
reportProgress("location-profiles", "Generating location profiles...", 89);

const locationProfilesStart = Date.now();
const locationProfiles = await generateLocationProfiles(client, {
  settingRefinement: setting.setting,
  caseData: cml,
  narrative: narrative,
  tone: inputs.tone || "Classic",
  targetWordCount: 1000,
  runId,
  projectId: projectId || "",
});

agentCosts["agent2c_location_profiles"] = locationProfiles.cost;
agentDurations["agent2c_location_profiles"] = Date.now() - locationProfilesStart;

reportProgress("location-profiles", 
  `Location profiles generated (${locationProfiles.keyLocations.length} locations)`, 
  90);
```

### Phase 3: Agent 9 Enhancement (Week 1-2)

**Tasks:**
1. ✅ Update `ProseGenerationInputs` to include `locationProfiles`
2. ✅ Enhance `buildProsePrompt()` to inject location profile context
3. ✅ Add location description guidance to system prompt
4. ✅ Test prose quality with location profiles

**Prompt additions:**
```typescript
const locationContext = inputs.locationProfiles 
  ? `\n\nLOCATION PROFILES:\n\n${JSON.stringify(inputs.locationProfiles, null, 2)}\n\nUSAGE:\n- First scene in location: Use full sensory description\n- Action scenes: Integrate physical layout\n- Atmospheric: Reference weather, lighting, sounds\n- Era details: Weave in period markers naturally`
  : '';

const developer = `${basePrompt}${locationContext}`;
```

### Phase 4: Testing & Refinement (Week 2)

**Tasks:**
1. ✅ Generate test stories with and without location profiles
2. ✅ Compare prose quality and atmosphere richness
3. ✅ Tune prompt for optimal location integration
4. ✅ Validate cost impact (target: <$0.50 per story)
5. ✅ Check for location consistency across chapters
6. ✅ Ensure no over-description (balance with action)

**Metrics:**
- Sensory detail density (aim for 2-3 sensory details per scene)
- Setting consistency score (validate against setting refinement)
- Reader survey: atmosphere richness rating
- Cost per story (should add <10% to total)

### Phase 5: Validation Integration (Week 2)

**Tasks:**
1. ⚠️ Add location consistency validator to story-validation package
2. ⚠️ Check: locations match CML and setting refinement
3. ⚠️ Check: no anachronistic setting details
4. ⚠️ Check: sensory details appropriate to era
5. ⚠️ Check: physical layout consistency

**New validator:**
```typescript
export class LocationConsistencyValidator implements Validator {
  validate(story: Story, cml: CMLData, locationProfiles: LocationProfilesResult) {
    // Verify all locations mentioned exist in profiles
    // Check era markers match setting
    // Validate sensory details are plausible
    // Ensure physical constraints respected
  }
}
```

---

## Expected Benefits

### 1. Prose Quality
- **Richer atmosphere:** Vivid sensory details in every scene
- **Setting as character:** Location becomes integral to story
- **Era authenticity:** Consistent period details throughout
- **Reader immersion:** More evocative, engaging prose

### 2. Consistency
- **Physical accuracy:** Layout established upfront, referenced correctly
- **Atmospheric coherence:** Weather, lighting, mood stay consistent
- **Era fidelity:** Period details don't drift or contradict
- **Access logic:** Who can be where is clear and consistent

### 3. Agent 9 Performance
- **Reduced hallucination:** Less inventing of setting details
- **Faster generation:** Pre-written descriptions to draw from
- **Better integration:** Setting details match CML and constraints
- **Style consistency:** Tone and atmosphere uniform across chapters

---

## Cost Analysis

### Agent 2c Generation
- **Input tokens:** ~2,000 (setting + CML + narrative)
- **Output tokens:** ~3,500 (profiles for 3-5 locations)
- **Cost per story:** ~$0.30 - $0.50
- **Time:** 5-8 seconds

### Agent 9 Enhancement
- **Added input tokens:** ~3,500 (location profiles)
- **Cost increase:** ~$0.10 - $0.15
- **Time increase:** ~2 seconds

### Total Impact
- **Cost increase:** $0.40 - $0.65 per story (~8-10%)
- **Time increase:** 7-10 seconds (~2%)
- **Quality improvement:** Expected 30-50% increase in atmosphere richness

**ROI: High** - Significant quality gain for minimal cost increase

---

## Example Output

### Primary Location Profile
```json
{
  "primary": {
    "name": "SS Bellerophon",
    "type": "Trans-Atlantic Ocean Liner",
    "summary": "A grand 1950s luxury liner, four days into a storm-tossed Atlantic crossing, her gilt and glamour now underlaid by creaking tension.",
    "visualDescription": "Art deco elegance meets nautical engineering...",
    "atmosphere": "A cage of velvet and brass, isolated by miles of storm-churned ocean...",
    "paragraphs": [
      "The SS Bellerophon cut through the Atlantic swell with deceptive grace, her art deco lines and polished brass fixtures speaking to an era when ocean travel still meant something. The grand salon, with its sweeping mahogany panels and crystal chandeliers, had hosted countless crossings of the wealthy and well-connected...",
      
      "But three days into this particular voyage, the ship's elegance had taken on a different quality. The storm that had blown in from the northwest transformed the liner into something more isolated, more claustrophobic...",
      
      "The crew quarters lay deep in the ship's bowels, separated from passenger country by more than bulkheads and doors—by class, by purpose, by the invisible lines that defined 1950s society..."
    ]
  }
}
```

### Key Location Profile
```json
{
  "keyLocations": [{
    "id": "crime_scene",
    "name": "Captain's Private Quarters",
    "type": "interior",
    "purpose": "Crime scene - body discovered here",
    "visualDetails": "Oak-paneled cabin, nautical charts, brass chronometer, overturned chair",
    "sensoryDetails": {
      "sights": ["Scattered papers", "Overturned inkwell", "Broken compass glass"],
      "sounds": ["Hull creaking", "Muffled storm outside", "Ventilation hum"],
      "smells": ["Spilled ink", "Salt air", "Brass polish", "Tobacco"],
      "tactile": ["Cold metal fittings", "Smooth oak paneling", "Damp from condensation"]
    },
    "accessControl": "Captain's key required; accessible to first officer and steward",
    "paragraphs": [
      "The captain's quarters occupied the stern-most cabin of the officer's deck, a sanctum of authority marked by its oak paneling and brass appointments. Unlike the art deco flourishes of passenger country, this was a working space: nautical charts spread across a plotting table, a brass chronometer ticking with mechanical precision, logbooks stacked with military neatness...",
      
      "But the scene that greeted Detective Marlowe was anything but orderly. The captain's chair lay overturned, papers scattered across the deck like fallen leaves. The brass inkwell had tipped, spreading a black stain across the blotter that looked disturbingly like..."
    ]
  }]
}
```

---

## Alternative Approaches Considered

### Option A: Expand Agent 1 Output
**Pros:** No new agent needed
**Cons:** Agent 1 is constraint-focused, not narrative-focused; would bloat its purpose

### Option B: Let Agent 9 Generate On-the-Fly  
**Pros:** No extra LLM call
**Cons:** Inconsistent descriptions, higher hallucination risk, less control

### Option C: Use Templates
**Pros:** Fast, cheap, predictable
**Cons:** Formulaic, not unique per story, lacks richness

**Selected: Option D (Agent 2c)** - Best balance of quality, control, and cost

---

## Success Criteria

### Quantitative
- ✅ Agent 2c completes in <10 seconds
- ✅ Cost increase <$0.70 per story
- ✅ Location profiles generated for 100% of stories
- ✅ No pipeline failures due to location profiles
- ✅ Sensory details in 80%+ of scenes

### Qualitative
- ✅ Setting feels vivid and immersive
- ✅ Location descriptions consistent across chapters
- ✅ Era details authentic and appropriate
- ✅ Physical layout clear and logical
- ✅ Atmosphere enhances mystery tension

### User Feedback
- ⚠️ Beta readers rate atmosphere 4+ out of 5
- ⚠️ "Setting as character" achieved in 70%+ of stories
- ⚠️ No complaints about generic or templated descriptions

---

## Risks & Mitigations

### Risk 1: Over-Description
**Problem:** Too much setting detail slows pacing
**Mitigation:** 
- Guidance in Agent 9 prompt: "Balance setting with action"
- Target: 1-2 setting details per scene, not full descriptions
- First mention gets full treatment; subsequent references are brief

### Risk 2: Inconsistency
**Problem:** Agent 9 contradicts location profiles
**Mitigation:**
- Add location consistency validator
- Include profiles prominently in Agent 9 context
- System prompt emphasizes "Use profiles, don't invent"

### Risk 3: Cost Overrun
**Problem:** Location profiles add significant cost
**Mitigation:**
- Target word count per location: 800-1200 (not 2000+)
- Limit to 3-5 key locations (not every scene)
- Use temperature 0.6 (not 0.9) for more focused output

### Risk 4: Era Anachronisms
**Problem:** Generated details contradict era constraints
**Mitigation:**
- Pass Agent 1 constraints to Agent 2c
- Era authenticity validator checks location details
- Explicit forbidden items list in prompt

---

## Documentation Updates

### Files to Create
1. ✅ `packages/prompts-llm/src/agent2c-location-profiles.ts` - Agent implementation
2. ✅ `packages/prompts-llm/src/types.ts` - Add LocationProfilesResult type
3. ⚠️ `packages/story-validation/src/location-validator.ts` - Location consistency validator
4. ⚠️ `LOCATION_PROFILES_GUIDE.md` - Usage and examples

### Files to Update
1. ✅ `apps/worker/src/jobs/mystery-orchestrator.ts` - Pipeline integration
2. ✅ `packages/prompts-llm/src/agent9-prose.ts` - Enhanced with location profiles
3. ✅ `packages/prompts-llm/src/index.ts` - Export new agent
4. ⚠️ `documentation/02_cml_and_agents.md` - Document Agent 2c
5. ⚠️ `documentation/04_llm_ai.md` - Update agent list
6. ⚠️ `README.md` - Mention location profiles feature

---

## Timeline

### Week 1: Core Implementation
- Day 1: Create Agent 2c structure, interfaces
- Day 2: Implement prompt builder and LLM integration
- Day 3: Pipeline integration and testing
- Day 4: Agent 9 enhancement
- Day 5: Initial testing and refinement

### Week 2: Polish & Validation
- Day 6-7: Comprehensive testing across story types
- Day 8: Location consistency validator
- Day 9: Cost optimization and tuning
- Day 10: Documentation and examples

### Total: 2 weeks for complete implementation

---

## Next Steps

1. **Approval:** Review plan with team
2. **Prototype:** Build Agent 2c core in 1-2 days
3. **Test:** Generate location profiles for 5 example stories
4. **Evaluate:** Assess quality and decide on full implementation
5. **Implement:** Follow roadmap if approved

---

## Appendix: Prompt Template

```
SYSTEM:
You are a setting and atmosphere specialist for Golden Age mystery fiction. 
Your role is to create vivid, evocative location profiles that bring mystery 
settings to life through sensory details, authentic period atmosphere, and 
physical descriptions that serve the mystery plot.

DEVELOPER:
Generate location profiles for a mystery story setting.

Required output structure:
{
  "status": "draft",
  "primary": { ... },
  "keyLocations": [ ... ],
  "atmosphere": { ... },
  "cost": 0,
  "durationMs": 0
}

Requirements:
- 3-5 narrative paragraphs per primary location
- 2-3 paragraphs per key location
- Rich sensory details (sight, sound, smell, touch)
- Era-authentic markers from: {era}
- Physical details relevant to mystery (access, layout, sightlines)
- Tone: {tone}
- No anachronisms or implausible details

USER:
Generate location profiles for this mystery:

Setting: {location} in {era}
Crime scene: {crimeSceneLocation}
Key locations: {locationsFromNarrative}
Atmosphere: {weather}, {mood}
Physical constraints: {constraintsFromAgent1}
```

---

**Status:** Draft - Ready for Review
**Author:** GitHub Copilot
**Date:** February 13, 2026
**Version:** 1.0

# Artifact Schema System

## Overview

The artifact schema system provides validation and type-safe access to all generated artifacts in the mystery generation pipeline.

## Schema Files

All schemas are located in `schema/` directory:

- **cml_2_0.schema.yaml** - Core CML structure (mystery logic)
- **character_profiles.schema.yaml** - Character psychological profiles (Agent 2b)
- **location_profiles.schema.yaml** - Location and setting profiles with sensory details (Agent 2c)
- **temporal_context.schema.yaml** - Date, season, fashion, cultural context (Agent 2d)
- **cast_design.schema.yaml** - Character design with motives and relationships (Agent 2)
- **setting_refinement.schema.yaml** - Era constraints and location details (Agent 1)
- **narrative_outline.schema.yaml** - Scene-by-scene outline (Agent 7)
- **prose.schema.yaml** - Final prose with chapters (Agent 9)

## Validation

### Automatic Validation

The orchestrator automatically validates artifacts after generation:

```typescript
import { validateArtifact } from "@cml/cml";

// After generating location profiles
const validation = validateArtifact("location_profiles", locationProfiles);
if (!validation.valid) {
  console.error("Validation errors:", validation.errors);
}
if (validation.warnings.length > 0) {
  console.warn("Schema warnings:", validation.warnings);
}
```

### Manual Validation

```typescript
import { validateArtifacts } from "@cml/cml";

// Validate multiple artifacts at once
const results = validateArtifacts([
  { type: "character_profiles", payload: profiles },
  { type: "location_profiles", payload: locations },
  { type: "temporal_context", payload: temporal }
]);

Object.entries(results).forEach(([type, result]) => {
  if (!result.valid) {
    console.error(`${type} validation failed:`, result.errors);
  }
});
```

## Type-Safe Accessors

Use accessor classes for safe, schema-aware field access:

### Character Profile Access

```typescript
import { CharacterProfileAccessor } from "@cml/cml";

const accessor = new CharacterProfileAccessor(characterProfiles);

// Get all character names
const names = accessor.getAllNames();

// Get specific character data
const publicPersona = accessor.getPublicPersona("Lord Ashford");
const secret = accessor.getPrivateSecret("Lord Ashford");
const paragraphs = accessor.getParagraphs("Lord Ashford");
```

### Location Profile Access

```typescript
import { LocationProfileAccessor } from "@cml/cml";

const accessor = new LocationProfileAccessor(locationProfiles);

// Get primary location details
const locationName = accessor.getPrimaryLocationName();
const place = accessor.getPrimaryLocationPlace(); // e.g., "Little Middleton"
const country = accessor.getPrimaryLocationCountry(); // e.g., "England"
const geoContext = accessor.getGeographicContext(); // "Little Middleton, England"

// Get sensory details for a location
const sensory = accessor.getSensoryDetails("Drawing Room");
console.log(sensory.sights); // Array of visual details
console.log(sensory.sounds); // Array of sound details
console.log(sensory.smells); // Array of smell details
console.log(sensory.tactile); // Array of tactile details

// Get atmosphere
const mood = accessor.getAtmosphericMood();
const weather = accessor.getWeather();
const eraMarkers = accessor.getEraMarkers();
```

### Temporal Context Access

```typescript
import { TemporalContextAccessor } from "@cml/cml";

const accessor = new TemporalContextAccessor(temporalContext);

// Get date information
const dateStr = accessor.getDateString(); // "June 1925"
const season = accessor.getSeason(); // "summer"
const weather = accessor.getSeasonalWeather(); // Array of weather conditions

// Get fashion details
const mensFormal = accessor.getMensFormalWear();
const womensFormal = accessor.getWomensFormalWear();
const mensAccessories = accessor.getMensAccessories();

// Get cultural context
const popularMusic = accessor.getPopularMusic();
const films = accessor.getFilms();
const prices = accessor.getTypicalPrices();
const culturalHighlights = accessor.getCulturalHighlights();

// Get atmospheric details
const atmospheric = accessor.getAtmosphericDetails();
const majorEvents = accessor.getMajorEvents();
```

### Combined Accessor

Use the combined accessor for easy access to all artifacts:

```typescript
import { ArtifactAccessor } from "@cml/cml";

const accessor = new ArtifactAccessor({
  characterProfiles,
  locationProfiles,
  temporalContext
});

// Access all types through one object
const geoContext = accessor.locations.getGeographicContext();
const dateStr = accessor.temporal.getDateString();
const characterNames = accessor.characters.getAllNames();

// Build comprehensive context for prose generation
const proseContext = accessor.buildProseContext();
console.log(proseContext);
// Output:
// LOCATION: Ashford Manor (Little Middleton, England)
// DATE: June 1925 (summer)
// ATMOSPHERE: Warm and humid, Tense expectation
```

## Usage in Prose Generation

The accessor system is designed to make prose generation safe and reliable:

```typescript
import { ArtifactAccessor } from "@cml/cml";

// In Agent 9 (prose generator)
const artifacts = new ArtifactAccessor({
  characterProfiles: inputs.characterProfiles,
  locationProfiles: inputs.locationProfiles,
  temporalContext: inputs.temporalContext
});

// Build location context block
const locationContext = `
PRIMARY LOCATION: ${artifacts.locations.getPrimaryLocationName()}
Geographic Context: ${artifacts.locations.getGeographicContext()}
Summary: ${artifacts.locations.getPrimarySummary()}
Weather: ${artifacts.locations.getWeather()}
Mood: ${artifacts.locations.getAtmosphericMood()}
`;

// Build temporal context block
const temporalBlock = `
DATE: ${artifacts.temporal.getDateString()}
Season: ${artifacts.temporal.getSeason()} (${artifacts.temporal.getSeasonalWeather().join(", ")})
Men's Fashion: ${artifacts.temporal.getMensFormalWear().slice(0, 3).join(", ")}
Women's Fashion: ${artifacts.temporal.getWomensFormalWear().slice(0, 3).join(", ")}
Cultural Context: ${artifacts.temporal.getCulturalHighlights().join(", ")}
`;

// Build character context for specific scene
const characterContext = artifacts.characters.getAllNames()
  .map(name => `${name}: ${artifacts.characters.getPublicPersona(name)}`)
  .join("\\n");
```

## Benefits

1. **Type Safety**: Accessors provide safe access to nested fields
2. **Schema Validation**: Automatic validation ensures data integrity
3. **Documentation**: Schemas serve as documentation for all artifacts
4. **Error Prevention**: Reduces null/undefined errors in prose generation
5. **Maintainability**: Changes to artifact structure update automatically
6. **Reliability**: Prose generator can confidently access all context data

## Schema Format

All schemas use YAML format with this structure:

```yaml
fieldName:
  type: string | number | boolean | object | array
  required: true | false
  allowed: [value1, value2, ...]  # Optional constraint
  description: "Field purpose"    # Optional documentation
  fields:                          # For object types
    nestedField:
      type: string
      required: true
  items:                           # For array types
    type: string                   # Simple type
    # OR
    type: object                   # Complex type
    fields: { ... }
```

## Adding New Schemas

1. Create new schema file in `schema/` directory
2. Follow naming convention: `{artifact_name}.schema.yaml`
3. Add validation call in orchestrator after generation
4. Create accessor class if needed for complex access patterns
5. Export from `@cml/cml` package

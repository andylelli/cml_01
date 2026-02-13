# Story Validation Package

Comprehensive validation system for generated mystery stories, implementing solutions to prevent common quality issues.

## Overview

This package provides multi-layer validation to ensure generated stories are:
- **Consistent** (character names, pronouns, locations)
- **Plausible** (physical evidence obeys real-world physics)
- **Authentic** (period-appropriate for specified era)
- **Readable** (no encoding artifacts)

## Installation

```bash
npm install @cml/story-validation
```

## Quick Start

```typescript
import { StoryValidationPipeline } from '@cml/story-validation';

const pipeline = new StoryValidationPipeline();
const report = await pipeline.validate(story, cml);

if (report.status === 'failed') {
  console.error('Critical errors found:', report.errors);
} else if (report.status === 'passed') {
  console.log('Story passed all validations!');
}

// Auto-fix encoding issues
const fixedStory = pipeline.autoFix(story);
```

## Validators

### 1. EncodingValidator
**Priority: HIGH**

Detects and fixes UTF-8 encoding artifacts.

```typescript
import { EncodingValidator } from '@cml/story-validation';

const validator = new EncodingValidator();
const result = validator.validate(story);

// Auto-fix
const fixedStory = validator.fixStory(story);
```

**Detects:**
- â → ' (apostrophe corruption)
- faˆ§ade → façade
- Other common encoding artifacts

### 2. CharacterConsistencyValidator
**Priority: CRITICAL**

Ensures character names, pronouns, and roles are consistent throughout.

```typescript
import { CharacterConsistencyValidator } from '@cml/story-validation';

const validator = new CharacterConsistencyValidator();
const result = validator.validate(story, cml);
```

**Detects:**
- Character name switches (e.g., "Detective Thompson" → "Detective Harrington")
- Pronoun-gender mismatches (e.g., "she" used for male character)
- Role-location inconsistencies (e.g., passenger in crew quarters)
- Unknown characters not in CML cast

### 3. PhysicalPlausibilityValidator
**Priority: HIGH**

Validates that physical evidence obeys real-world physics.

```typescript
import { PhysicalPlausibilityValidator } from '@cml/story-validation';

const validator = new PhysicalPlausibilityValidator();
const result = validator.validate(story, cml);
```

**Detects:**
- Impossible footprints (e.g., on wet wooden deck in storm)
- Implausible embedded objects (e.g., metal in hardwood without massive force)
- Weather-evidence contradictions (e.g., trace evidence in storm)
- Implausible struggle damage

**Provides alternatives:**
```
❌ "Footprints on wooden deck in rain"
✓ "Muddy residue trail" or "wet footprints on interior carpet"
```

### 4. EraAuthenticityValidator
**Priority: MODERATE**

Ensures story uses period-appropriate technology, language, and details.

```typescript
import { EraAuthenticityValidator } from '@cml/story-validation';

const validator = new EraAuthenticityValidator();
const result = validator.validate(story, cml);
```

**Detects:**
- Anachronisms (e.g., "cell phone" in 1950s story)
- Missing period markers (generic/timeless feel)

**For 1950s:**
- ❌ Forbidden: cell phone, internet, email, computer, GPS
- ✓ Required: telephone, telegram, radio, typewriter
- ✓ Markers: formal address (Mr./Mrs.), period fashion (hats, gloves)

## Validation Pipeline

The pipeline coordinates all validators and provides comprehensive reporting.

```typescript
import { StoryValidationPipeline } from '@cml/story-validation';

const pipeline = new StoryValidationPipeline();
const report = await pipeline.validate(story, cml);

console.log(`Status: ${report.status}`);
console.log(`Total issues: ${report.summary.totalIssues}`);
console.log(`Critical: ${report.summary.critical}`);
console.log(`Major: ${report.summary.major}`);
console.log(`Recommendations:`, report.recommendations);
```

### Validation Statuses

- **passed**: No significant issues (✅ ready to publish)
- **needs_review**: Minor issues present (⚠️ review recommended)
- **needs_revision**: Multiple major issues (🔄 regenerate recommended)
- **failed**: Critical errors present (❌ must fix)

### Quality Thresholds

Status is determined by error counts:
- **Critical errors = 0**: Required for all statuses except "failed"
- **Major errors ≤ 5**: Required for "passed"/"needs_review"
- **Major errors > 5**: Triggers "needs_revision"

## Integration with Story Generation

### In Prompt Engineering

The validation rules are now embedded in Agent 9 (Prose Generator) prompts:

```typescript
// Character consistency rules injected
// Physical plausibility rules injected
// Era authenticity rules injected
```

This provides **prevention** at generation time.

### Post-Generation Validation

```typescript
import { StoryValidationPipeline } from '@cml/story-validation';

async function generateAndValidate(inputs) {
  // Generate story
  const story = await generateProse(client, inputs);
  
  // Validate
  const pipeline = new StoryValidationPipeline();
  const report = await pipeline.validate(story, inputs.caseData);
  
  if (report.status === 'failed') {
    // Auto-fix encoding issues
    story = pipeline.autoFix(story);
    
    // Re-validate
    const retry = await pipeline.validate(story, inputs.caseData);
    
    if (retry.status === 'failed') {
      throw new Error('Story validation failed after auto-fix');
    }
  }
  
  return { story, validationReport: report };
}
```

## Error Types

### Critical Severity
- `character_name_inconsistency`: Character name switches mid-story
- `detective_name_inconsistency`: Detective name changes
- `pronoun_gender_mismatch`: Wrong pronouns for character

### Major Severity
- `encoding_artifact`: UTF-8 corruption (auto-fixable)
- `role_location_mismatch`: Passenger in crew quarters
- `implausible_footprints`: Footprints on impossible surface
- `implausible_embedded_object`: Metal embedded in hardwood
- `anachronism`: Technology that didn't exist in era

### Moderate Severity
- `missing_period_markers`: Story feels generic/timeless
- `role_location_notice`: Minor location inconsistency
- `implausible_struggle_damage`: Unrealistic struggle results

## API Reference

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings?: ValidationError[];
}
```

### ValidationError

```typescript
interface ValidationError {
  type: string;
  message: string;
  severity: 'critical' | 'major' | 'moderate' | 'minor';
  sceneNumber?: number;
  lineNumber?: number;
  suggestion?: string;
  cmlReference?: string;
}
```

### ValidationReport

```typescript
interface ValidationReport {
  status: 'passed' | 'needs_review' | 'needs_revision' | 'failed';
  summary: {
    totalIssues: number;
    critical: number;
    major: number;
    moderate: number;
    minor: number;
  };
  errors: ValidationError[];
  canProceed: boolean;
  recommendations: string[];
}
```

## Configuration

Future enhancement: configurable thresholds

```typescript
const pipeline = new StoryValidationPipeline({
  strictMode: true,  // Lower error tolerances
  autoFix: true,     // Automatically fix encoding issues
  customValidators: [myCustomValidator]
});
```

## Testing

```bash
npm test
```

Run specific validator tests:
```bash
npm test -- encoding-validator
npm test -- character-validator
```

## Contributing

When adding new validators:

1. Implement `Validator` interface
2. Add to `StoryValidationPipeline.validators` array
3. Update documentation
4. Add test coverage

Example validator structure:

```typescript
export class MyValidator implements Validator {
  name = 'MyValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    const errors: ValidationError[] = [];
    
    // Validation logic here
    
    return { valid: errors.length === 0, errors };
  }
}
```

## Implementation Priority

Validators are ordered by priority:

1. **EncodingValidator** (HIGH) - Immediate readability
2. **CharacterConsistencyValidator** (CRITICAL) - Story coherence
3. **PhysicalPlausibilityValidator** (HIGH) - Story believability
4. **EraAuthenticityValidator** (MODERATE) - Immersion enhancement

## Future Enhancements

- [ ] Spatial logic validator (crime scene location consistency)
- [ ] Timeline logic validator (event chronology)
- [ ] CML compliance validator (story matches CML specifications)
- [ ] Plot mechanism validator (show vs tell)
- [ ] Configurable thresholds
- [ ] Custom validator hooks
- [ ] Performance optimization for large stories

## License

MIT

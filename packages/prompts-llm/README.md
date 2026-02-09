# @cml/prompts-llm

LLM prompt templates for all 8 mystery generation agents. Currently implements Agent 3 (CML Generator) - the backbone of the system.

## Features

- **Agent 3: CML Generator** - Complete prompt building and generation pipeline
- **Seed Pattern Analysis** - Loads structural patterns from example CML files (no content copying)
- **Era Constraints** - Authentic constraints for 1920s-1960s settings
- **Axis-Specific Prompts** - Tailored prompts for temporal, spatial, identity, behavioral, authority axes
- **Novelty Constraints** - Ensures generated mysteries diverge from seed examples
- **Fair-Play Enforcement** - Built-in checklist for solvable mysteries
- **Retry Logic** - Automatic validation and retry on failures

## Installation

```bash
npm install @cml/prompts-llm
```

## Usage

### Agent 3: CML Generator

```typescript
import { generateCML } from "@cml/prompts-llm";
import { AzureOpenAIClient } from "@cml/llm-client";

const client = new AzureOpenAIClient({
  apiKey: process.env.AZURE_OPENAI_API_KEY!,
  endpoint: process.env.AZURE_OPENAI_ENDPOINT!,
  defaultModel: "gpt-4",
});

const inputs = {
  // Setting
  decade: "1930s",
  location: "Country house",
  institution: "Private estate",
  tone: "Classic Golden Age",
  weather: "Fog",
  socialStructure: "Rigid class hierarchy",
  
  // Mystery structure
  primaryAxis: "temporal",
  castSize: 6,
  castNames: ["Inspector Blake", "Lord Ashford", "Lady Ashford", "Dr. Marsh", "Miss Grey", "Butler Stevens"],
  detectiveType: "Professional police detective",
  victimArchetype: "Wealthy aristocrat",
  
  // Complexity
  complexityLevel: "moderate",
  mechanismFamilies: ["clock manipulation", "timeline confusion"],
  
  // Context
  runId: "run-123",
  projectId: "proj-456",
};

// Generate CML with retry and validation
const result = await generateCML(
  client,
  inputs,
  "./examples", // Path to seed CML files
  3 // Max attempts
);

console.log(`Generated CML in ${result.attempt} attempts`);
console.log(`Latency: ${result.latencyMs}ms`);
console.log(`Cost: $${result.cost.toFixed(4)}`);
console.log(`Valid: ${result.validation.valid}`);
```

### Build Prompt Only (No API Call)

```typescript
import { buildCMLPrompt } from "@cml/prompts-llm";

const prompt = buildCMLPrompt(inputs, "./examples");

console.log("System:", prompt.system);
console.log("Developer:", prompt.developer);
console.log("User:", prompt.user);
console.log("Messages:", prompt.messages);
```

### Load Seed Patterns

```typescript
import {
  loadSeedCMLFiles,
  extractStructuralPatterns,
  selectRelevantPatterns,
  formatPatternsForPrompt,
} from "@cml/prompts-llm";

const cmlFiles = loadSeedCMLFiles("./examples");
const patterns = extractStructuralPatterns(cmlFiles);
const relevantPatterns = selectRelevantPatterns(patterns, "temporal", 3);
const formattedText = formatPatternsForPrompt(relevantPatterns);

console.log(formattedText);
```

## API Reference

### generateCML(client, inputs, examplesDir?, maxAttempts?)

Generates a complete CML document with validation and retry logic.

**Parameters**:
- `client: AzureOpenAIClient` - Configured LLM client
- `inputs: CMLPromptInputs` - Mystery specifications
- `examplesDir?: string` - Path to seed CML files (optional)
- `maxAttempts?: number` - Max retry attempts (default: 3)

**Returns**: `Promise<CMLGenerationResult>`
- `cml: any` - Generated CML object
- `validation: { valid: boolean, errors: string[] }` - Validation result
- `attempt: number` - Number of attempts needed
- `latencyMs: number` - Total generation time
- `cost: number` - Estimated cost in USD

### buildCMLPrompt(inputs, examplesDir?)

Builds the complete prompt structure for CML generation.

**Parameters**:
- `inputs: CMLPromptInputs` - Mystery specifications
- `examplesDir?: string` - Path to seed CML files (optional)

**Returns**: `PromptMessages`
- `system: string` - System role prompt
- `developer: string` - Developer context (schema, constraints, seeds)
- `user: string` - User requirements
- `messages: Message[]` - Formatted for OpenAI API

## CMLPromptInputs

```typescript
{
  // Setting & Era
  decade: string;           // "1920s" | "1930s" | "1940s" | "1950s" | "1960s"
  location: string;         // "Country house" | "Manor" | "Hotel" | etc.
  institution: string;      // "Private estate" | "Resort" | "College" | etc.
  tone: string;             // "Classic Golden Age" | "Noir" | "Cozy" | etc.
  weather: string;          // "Fog" | "Storm" | "Snow" | etc.
  socialStructure: string;  // "Rigid class hierarchy" | "Egalitarian" | etc.
  
  // Mystery Structure
  primaryAxis: "temporal" | "spatial" | "identity" | "behavioral" | "authority";
  castSize: number;         // 4-10 characters
  castNames: string[];      // Exact names to use
  detectiveType: string;    // "Police" | "Amateur" | "Private eye" | etc.
  victimArchetype: string;  // "Wealthy" | "Popular" | "Mysterious" | etc.
  
  // Complexity
  complexityLevel: "simple" | "moderate" | "complex";
  mechanismFamilies: string[];  // ["poison", "alibi"] etc.
  
  // Novelty (optional)
  noveltyConstraints?: {
    divergeFrom: string[];         // Seed IDs to avoid
    areas: string[];               // Areas requiring divergence
    avoidancePatterns: string[];   // Specific patterns to avoid
  };
  
  // Context
  runId: string;
  projectId: string;
}
```

## Primary Axes

### temporal
Mystery depends on **when** events occurred.
- False assumption about timing, sequence, or duration
- Example: Clock stopped at wrong time
- Discriminating test: Timeline reconstruction

### spatial
Mystery depends on **where** events occurred.
- False assumption about locations or movement
- Example: Room switch, hidden passage
- Discriminating test: Physical reconstruction

### identity
Mystery depends on **who** someone is.
- False assumption about identity or relationships
- Example: Impersonation, unknown twin
- Discriminating test: Knowledge trap

### behavioral
Mystery depends on character psychology.
- False assumption about motives or habits
- Example: Unexpected behavior deviation
- Discriminating test: Behavioral inconsistency

### authority
Mystery depends on institutional rules.
- False assumption about permissions or hierarchy
- Example: False credentials, rule exploitation
- Discriminating test: Authority verification

## Era Constraints

The package includes authentic constraints for each decade:

### 1920s
- No television, limited telephones
- Fingerprinting new, no DNA
- Steam trains, early automobiles
- Post-WWI trauma, rigid class structures

### 1930s
- Radio common, early telephones
- Fingerprinting standard, basic toxicology
- Great Depression, class tensions

### 1940s
- Radio ubiquitous, early television
- WWII trauma, wartime restrictions

### 1950s
- Television spreading, transistor radios
- Cold War paranoia, conformity

### 1960s
- Color TV, mainframe computers
- Social upheaval, questioning authority

## Seed Pattern Analysis

The package can load CML files from an examples directory and extract structural patterns (not content):

```typescript
{
  id: "study_in_scarlet",
  axis: "temporal",
  structure: {
    mechanismType: "clock_manipulation",
    falseAssumptionPattern: "temporal",
    constraintSpaceSize: 7,
    inferencePathSteps: 4,
    discriminatingTestMethod: "timeline_analysis",
  }
}
```

These patterns inform the LLM about CML structure without copying content.

## Testing

```bash
npm test          # Run all tests
npm run test:watch # Watch mode
```

**Test Coverage**: 16 tests covering:
- Prompt generation for all 5 axes
- Era constraint generation
- Novelty constraint handling
- Seed pattern loading
- Message formatting

## Architecture

```
src/
├── agent3-cml.ts          # CML generation with retry loop
├── types.ts               # TypeScript interfaces
├── index.ts               # Main exports
├── shared/
│   ├── system.ts          # System prompts
│   ├── constraints.ts     # Era/location constraints
│   └── schemas.ts         # CML schema reference
└── utils/
    └── seed-loader.ts     # Seed pattern analysis
```

## Future Agents

The package structure supports 8 agents total:

1. ✅ **Agent 3: CML Generator** (IMPLEMENTED)
2. ⏳ Agent 1: Setting & Era
3. ⏳ Agent 2: Cast & Motive
4. ⏳ Agent 4: CML Revision
5. ⏳ Agent 5: Clues & Red Herrings
6. ⏳ Agent 6: Narrative Outliner
7. ⏳ Agent 7: Prose Writer
8. ⏳ Agent 8: Game Pack Generator

## License

MIT

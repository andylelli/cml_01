/**
 * Agent 7: Narrative Formatter
 *
 * Transforms validated CML + clues into a scene-by-scene narrative outline.
 * Acts as bridge between logical structure (CML) and prose generation.
 *
 * - Organizes scenes by three-act structure
 * - Places clues naturally within scenes
 * - Creates dramatic pacing and tension
 * - Shows character interactions and development
 * - Sets up reveals, twists, and false assumptions
 * - Provides scene descriptions for prose generation
 *
 * Temperature: 0.5 (moderate - creative scene structuring grounded in CML)
 * Max Tokens: 4000 (larger - detailed scene descriptions)
 * Output Format: JSON (structured scene list)
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { ClueDistributionResult } from "./agent5-clues.js";
import type { PromptComponents } from "./types.js";

// ============================================================================
// Types
// ============================================================================

export interface NarrativeFormattingInputs {
  caseData: CaseData;
  clues: ClueDistributionResult;
  targetLength?: "short" | "medium" | "long"; // Story length preference
  narrativeStyle?: "classic" | "modern" | "atmospheric"; // Style preference
  runId?: string;
  projectId?: string;
}

export interface Scene {
  sceneNumber: number;
  act: 1 | 2 | 3;
  title: string;
  setting: {
    location: string;
    timeOfDay: string;
    atmosphere: string;
  };
  characters: string[]; // Character IDs
  purpose: string; // Why this scene exists
  cluesRevealed: string[]; // Clue IDs revealed in this scene
  dramaticElements: {
    conflict?: string;
    tension?: string;
    revelation?: string;
    misdirection?: string;
  };
  summary: string; // 2-3 sentence scene description
  estimatedWordCount: number;
}

export interface ActStructure {
  actNumber: 1 | 2 | 3;
  title: string;
  purpose: string;
  scenes: Scene[];
  estimatedWordCount: number;
}

export interface NarrativeOutline {
  acts: ActStructure[];
  totalScenes: number;
  estimatedTotalWords: number;
  pacingNotes: string[];
  cost: number;
  durationMs: number;
}

// ============================================================================
// Prompt Builder
// ============================================================================

export function buildNarrativePrompt(inputs: NarrativeFormattingInputs): PromptComponents {
  const { caseData, clues, targetLength = "medium", narrativeStyle = "classic" } = inputs;

  // System: Define the narrative formatter role
  const system = `You are an expert mystery fiction narrative architect. Your role is to transform a validated mystery structure (CML) and its clues into a compelling scene-by-scene outline for prose generation.

You understand the craft of mystery storytelling:
- **Three-act structure**: Setup, Investigation, Resolution
- **Pacing**: When to reveal clues, build tension, create misdirection
- **Character development**: Show personalities through action and dialogue
- **Atmosphere**: Create mood appropriate to the era and setting
- **Fair play**: Ensure clues are naturally woven into scenes
- **Dramatic irony**: Reader knows more than characters, or vice versa

You work from the CML's logical structure (inference path, constraint space) and the clue distribution to create scenes that:
1. Reveal clues organically through detective investigation
2. Build tension and maintain reader engagement
3. Develop characters and relationships
4. Support the false assumption until the discriminating test
5. Lead to a satisfying revelation and denouement

Your output is a JSON scene outline that prose generators can use to write the full story.`;

  // Developer: Provide CML and clue context
  const developer = buildDeveloperContext(caseData, clues);

  // User: Request the narrative outline
  const user = buildUserRequest(targetLength, narrativeStyle);

  return { system, developer, user };
}

function buildDeveloperContext(caseData: CaseData, clues: ClueDistributionResult): string {
  const { meta, setup, cast, inference_path, solution, constraint_space } = caseData;

  const title = meta?.title || "Untitled Mystery";
  const primaryAxis = meta?.primary_axis || "unknown";
  const era = `${setup.era.year} - ${setup.era.location}`;
  const crime = setup.crime.description;
  const victim = setup.crime.victim;
  const culprit = solution.culprit.character_id;
  const culpritName = cast.find((c) => c.character_id === culprit)?.name || "Unknown";
  const motive = solution.culprit.motive;
  const method = solution.culprit.method;
  const falseAssumption = solution.false_assumption.description;
  const whenRevealed = solution.false_assumption.when_revealed;

  // Cast list
  const detective = cast.find((c) => c.role === "detective");
  const suspects = cast.filter((c) => c.role === "suspect");
  const witnesses = cast.filter((c) => c.role === "witness");

  const castList = [
    detective ? `- **Detective**: ${detective.name} (${detective.character_id})` : "",
    ...suspects.map((s) => `- **Suspect**: ${s.name} (${s.character_id})`),
    ...witnesses.map((w) => `- **Witness**: ${w.name} (${w.character_id})`),
  ]
    .filter(Boolean)
    .join("\n");

  // Inference path
  const inferenceSteps = inference_path.steps
    .map((step, idx) => `${idx + 1}. **${step.type}**: ${step.observation} → ${step.reasoning}`)
    .join("\n");

  // Discriminating test
  const discrimTest = `**When**: ${inference_path.discriminating_test.when}\n**Test**: ${inference_path.discriminating_test.test}\n**Reveals**: ${inference_path.discriminating_test.reveals}`;

  // Clue organization
  const earlyClues = clues.clues.filter((c) => c.placement === "early");
  const midClues = clues.clues.filter((c) => c.placement === "mid");
  const lateClues = clues.clues.filter((c) => c.placement === "late");

  const clueList = (clueSet: typeof clues.clues, label: string) => {
    if (clueSet.length === 0) return `### ${label}\nNone`;
    return `### ${label}\n${clueSet.map((c) => `- [${c.id}] ${c.category}: ${c.description}`).join("\n")}`;
  };

  // Red herrings
  const redHerringList = clues.redHerrings.length
    ? clues.redHerrings.map((rh) => `- [${rh.id}] ${rh.description}`).join("\n")
    : "None";

  // Key constraints
  const timeConstraints = constraint_space.time.slice(0, 3).map((t) => `- ${t.description}`).join("\n") || "None";
  const accessConstraints = constraint_space.access.slice(0, 3).map((a) => `- ${a.description}`).join("\n") || "None";

  return `# Narrative Formatting Context

## Mystery Overview
**Title**: ${title}
**Era & Setting**: ${era}
**Primary Axis**: ${primaryAxis}
**Crime**: ${crime}
**Victim**: ${victim}
**Culprit**: ${culpritName}
**Motive**: ${motive}
**Method**: ${method}

## The False Assumption
${falseAssumption}
*Revealed: ${whenRevealed}*

---

## Cast of Characters
${castList}

---

## Detective's Inference Path
The logical steps the detective follows:

${inferenceSteps}

### The Discriminating Test
${discrimTest}

---

## Clue Distribution

${clueList(earlyClues, "Early Clues (Act I)")}

${clueList(midClues, "Mid Clues (Act II)")}

${clueList(lateClues, "Late Clues (Act III)")}

### Red Herrings
${redHerringList}

---

## Key Constraints

### Temporal
${timeConstraints}

### Access
${accessConstraints}

---

## Era Details
${setup.era.key_details.map((d) => `- ${d}`).join("\n")}`;
}

function buildUserRequest(targetLength: string, narrativeStyle: string): string {
  const lengthGuidance = {
    short: "15-25 scenes, ~15,000-25,000 words (novella)",
    medium: "25-35 scenes, ~40,000-60,000 words (novel)",
    long: "35-50 scenes, ~70,000-100,000 words (long novel)",
  };

  const styleGuidance = {
    classic:
      "Golden Age detective fiction style - puzzle-focused, rational deduction, restrained prose, emphasis on fair play clues",
    modern:
      "Contemporary mystery style - character-driven, psychological depth, naturalistic dialogue, atmospheric tension",
    atmospheric:
      "Gothic/noir style - mood and setting prominent, shadows and secrets, poetic prose, emphasis on dread and revelation",
  };

  return `# Narrative Outline Task

Create a scene-by-scene outline for this mystery story.

## Target Specifications
- **Length**: ${targetLength} (${lengthGuidance[targetLength as keyof typeof lengthGuidance]})
- **Style**: ${narrativeStyle} (${styleGuidance[narrativeStyle as keyof typeof styleGuidance]})

## Scene Construction Guidelines

### Act I: Setup (25-30% of scenes)
- **Introduce the crime**: Discovery of victim, initial shock
- **Establish setting**: Era atmosphere, location details
- **Meet the cast**: Detective, suspects, witnesses
- **Plant early clues**: Subtle hints, initial observations
- **Support false assumption**: Lead reader toward wrong conclusion
- **End with**: Detective commits to investigation, stakes established

### Act II: Investigation (45-50% of scenes)
- **Interview scenes**: Suspects reveal information, alibis, motives
- **Clue discovery**: Physical evidence, testimonies, constraints
- **Red herrings**: Misdirection supporting false assumption
- **Character development**: Relationships, conflicts, secrets
- **Discriminating test**: The crucial scene that shifts everything
- **Rising tension**: Complications, dead ends, breakthroughs
- **End with**: Detective has all pieces but hasn't assembled them

### Act III: Resolution (20-25% of scenes)
- **Revelation**: Detective assembles the solution
- **Confrontation**: Culprit exposed, confession or capture
- **Explanation**: How the clues fit together
- **Justice**: Resolution of crime and consequences
- **Denouement**: Loose ends tied, reflection, restoration

## Scene Requirements

Each scene must include:
1. **Setting**: Location, time of day, atmosphere
2. **Characters present**: Who appears in the scene
3. **Purpose**: Why this scene exists narratively
4. **Clues revealed**: Which clue IDs are naturally woven in
5. **Dramatic elements**: Conflict, tension, revelation, or misdirection
6. **Summary**: 2-3 sentence description of what happens

## Pacing Principles
- Alternate between action (discovery, confrontation) and reflection (deduction, analysis)
- Space clues evenly within each act
- Build tension toward act breaks
- Use red herrings in Act I and early Act II
- Discriminating test appears in late Act II or early Act III
- Save essential clues for when inference path requires them

## Output Format

Return a JSON object:

\`\`\`json
{
  "acts": [
    {
      "actNumber": 1,
      "title": "Act I: The Crime",
      "purpose": "Establish mystery and introduce cast",
      "scenes": [
        {
          "sceneNumber": 1,
          "act": 1,
          "title": "Discovery",
          "setting": {
            "location": "Lord Ashford's study",
            "timeOfDay": "Morning after the murder",
            "atmosphere": "Tense, somber, shocked"
          },
          "characters": ["detective", "butler", "constable"],
          "purpose": "Introduce the crime and detective",
          "cluesRevealed": ["clue_1", "clue_2"],
          "dramaticElements": {
            "conflict": "Butler resistant to investigation",
            "tension": "Locked room mystery established"
          },
          "summary": "Detective arrives at manor to find Lord Ashford dead in locked study. Initial survey reveals no obvious exit. Butler appears nervous.",
          "estimatedWordCount": 1500
        }
      ],
      "estimatedWordCount": 12000
    }
  ],
  "totalScenes": 28,
  "estimatedTotalWords": 45000,
  "pacingNotes": [
    "Discriminating test placed in Scene 19 (late Act II)",
    "Red herrings concentrated in Scenes 4-8",
    "Character development balanced with clue discovery"
  ]
}
\`\`\`

Create a complete, well-paced outline that brings this mystery to life.`;
}

// ============================================================================
// Main Formatting Function
// ============================================================================

export async function formatNarrative(
  client: AzureOpenAIClient,
  inputs: NarrativeFormattingInputs
): Promise<NarrativeOutline> {
  const startTime = Date.now();

  // Build the narrative prompt
  const prompt = buildNarrativePrompt(inputs);

  // Call LLM with JSON mode
  const response = await client.complete({
    system: prompt.system,
    developer: prompt.developer,
    user: prompt.user,
    temperature: 0.5, // Moderate - creative scene structuring grounded in CML
    maxTokens: 4000, // Larger - detailed scene descriptions
    responseFormat: { type: "json_object" },
    runId: inputs.runId,
    projectId: inputs.projectId,
  });

  const durationMs = Date.now() - startTime;
  const cost = response.cost;

  // Parse the narrative outline
  let outlineData: Omit<NarrativeOutline, "cost" | "durationMs">;
  try {
    outlineData = JSON.parse(response.content);
  } catch (error) {
    throw new Error(`Failed to parse narrative outline JSON: ${error}`);
  }

  // Validate required fields
  if (!outlineData.acts || !Array.isArray(outlineData.acts) || outlineData.acts.length === 0) {
    throw new Error("Invalid narrative outline: missing or empty acts array");
  }

  if (!outlineData.totalScenes || !outlineData.estimatedTotalWords) {
    throw new Error("Invalid narrative outline: missing totalScenes or estimatedTotalWords");
  }

  return {
    ...outlineData,
    cost,
    durationMs,
  };
}

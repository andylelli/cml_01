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
import { jsonrepair } from "jsonrepair";
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
  qualityGuardrails?: string[];
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
  const user = buildUserRequest(targetLength, narrativeStyle, inputs.qualityGuardrails ?? []);

  return { system, developer, user };
}

function buildDeveloperContext(caseData: CaseData, clues: ClueDistributionResult): string {
  const legacy = caseData as any;
  const cmlCase = (legacy?.CASE ?? {}) as any;
  const meta = cmlCase.meta ?? legacy.meta ?? {};
  const crimeClass = meta.crime_class ?? {};
  const castRoster = Array.isArray(cmlCase.cast) ? cmlCase.cast : legacy.cast ?? [];

  const title = meta?.title || "Untitled Mystery";
  const primaryAxis = meta?.primary_axis || cmlCase.false_assumption?.type || "unknown";
  const era = meta?.era?.decade
    ? `${meta.era.decade} - ${meta.setting?.location ?? "Unknown"}`
    : legacy.setup?.era
      ? `${legacy.setup.era.year} - ${legacy.setup.era.location}`
      : "Unknown era";
  const settingLocation = meta?.setting?.location ?? legacy.setup?.era?.location ?? "Unknown setting";
  const crime = legacy.setup?.crime?.description || crimeClass.subtype || crimeClass.category || "crime";
  const victim = legacy.setup?.crime?.victim || "Unknown";
  const culpritName =
    cmlCase.culpability?.culprits?.[0] || castRoster[0]?.name || legacy.solution?.culprit?.character_id || "Unknown";
  const motive = legacy.solution?.culprit?.motive || "Unknown motive";
  const method = legacy.solution?.culprit?.method || crimeClass.subtype || "Unknown method";
  const falseAssumption =
    cmlCase.false_assumption?.statement || legacy.solution?.false_assumption?.description || "Unknown";
  const whenRevealed = legacy.solution?.false_assumption?.when_revealed || "final act";

  // Cast list
  const detective = castRoster.find((c: any) => c.role === "detective");
  const suspects = castRoster.filter((c: any) => c.role === "suspect");
  const witnesses = castRoster.filter((c: any) => c.role === "witness");

  const castSummary = [
    detective ? `- **Detective**: ${detective.name} (${detective.character_id})` : "",
    ...suspects.map((s: any) => `- **Suspect**: ${s.name} (${s.character_id})`),
    ...witnesses.map((w: any) => `- **Witness**: ${w.name} (${w.character_id})`),
  ]
    .filter(Boolean)
    .join("\n");

  // Inference path
  const inferenceSteps = (cmlCase.inference_path?.steps ?? legacy.inference_path?.steps ?? [])
    .map((step: any, idx: number) => {
      const observation = step.observation || step.type || "Observation";
      const correction = step.correction || step.reasoning || "Correction";
      const effect = step.effect ? ` → ${step.effect}` : "";
      return `${idx + 1}. **${observation}**: ${correction}${effect}`;
    })
    .join("\n");

  // Discriminating test
  const discrimTest = cmlCase.discriminating_test
    ? `**Method**: ${cmlCase.discriminating_test.method}\n**Design**: ${cmlCase.discriminating_test.design}\n**Reveals**: ${cmlCase.discriminating_test.knowledge_revealed}`
    : `**When**: ${legacy.inference_path?.discriminating_test?.when ?? "final act"}\n**Test**: ${legacy.inference_path?.discriminating_test?.test ?? "N/A"}\n**Reveals**: ${legacy.inference_path?.discriminating_test?.reveals ?? "N/A"}`;

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
  const constraintSpace = cmlCase.constraint_space ?? legacy.constraint_space ?? {};
  const formatConstraintList = (value: any, keys: string[]) => {
    if (Array.isArray(value)) {
      return value.slice(0, 3).map((entry: any) => `- ${entry.description ?? entry}`).join("\n") || "None";
    }
    const lines = keys.flatMap((key) => (Array.isArray(value?.[key]) ? value[key] : []));
    return lines.slice(0, 3).map((entry: any) => `- ${entry.description ?? entry}`).join("\n") || "None";
  };
  const timeConstraints = formatConstraintList(constraintSpace.time, ["anchors", "windows", "contradictions"]);
  const accessConstraints = formatConstraintList(constraintSpace.access, ["actors", "objects", "permissions"]);
  const eraDetails = Array.isArray(meta?.era?.realism_constraints)
    ? meta.era.realism_constraints.map((d: any) => `- ${d}`).join("\n")
    : legacy.setup?.era?.key_details?.map((d: any) => `- ${d}`).join("\n") || "None";

  return `# Narrative Formatting Context

## Mystery Overview
**Title**: ${title}
**Era & Setting**: ${era}
**Setting Lock**: All scenes must remain within this setting: ${settingLocation}. Do not move to a different location type.
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
${castSummary}

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
${eraDetails}`;
}

function buildUserRequest(targetLength: string, narrativeStyle: string, qualityGuardrails: string[]): string {
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

  const guardrailBlock = qualityGuardrails.length > 0
    ? `\n## Quality Guardrails (Must Satisfy)\n${qualityGuardrails.map((rule, idx) => `${idx + 1}. ${rule}`).join("\n")}\n`
    : "";

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
7. **Fair-play parity**: Key deductions must reference clue IDs already revealed to the reader

## Pacing Principles
- Alternate between action (discovery, confrontation) and reflection (deduction, analysis)
- Space clues evenly within each act
- Build tension toward act breaks
- Use red herrings in Act I and early Act II
- Discriminating test appears in late Act II or early Act III
- Save essential clues for when inference path requires them
- Do not introduce detective-private insights; avoid reveals unsupported by previously listed clue IDs
${guardrailBlock}

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
  const response = await client.chat({
    messages: [
      { role: "system", content: prompt.system },
      { role: "developer", content: prompt.developer },
      { role: "user", content: prompt.user }
    ],
    temperature: 0.5, // Moderate - creative scene structuring grounded in CML
    maxTokens: 4000, // Larger - detailed scene descriptions
    jsonMode: true,
    logContext: {
      runId: inputs.runId || "unknown",
      projectId: inputs.projectId || "unknown",
      agent: "Agent7-NarrativeFormatter"
    }
  });

  const durationMs = Date.now() - startTime;
  const costTracker = client.getCostTracker();
  const cost = costTracker.getSummary().byAgent["Agent7-NarrativeFormatter"] || 0;

  // Parse the narrative outline
  let outlineData: Omit<NarrativeOutline, "cost" | "durationMs">;
  try {
    outlineData = JSON.parse(response.content);
  } catch (error) {
    try {
      const repaired = jsonrepair(response.content);
      outlineData = JSON.parse(repaired);
    } catch {
      const trimmed = response.content.trim();
      const start = trimmed.indexOf("{");
      const end = trimmed.lastIndexOf("}");
      if (start !== -1 && end > start) {
        const candidate = trimmed.slice(start, end + 1);
        try {
          outlineData = JSON.parse(candidate);
        } catch (candidateError) {
          throw new Error(`Failed to parse narrative outline JSON: ${candidateError}`);
        }
      } else {
        throw new Error(`Failed to parse narrative outline JSON: ${error}`);
      }
    }
  }

  // Validate required fields
  if (!outlineData.acts || !Array.isArray(outlineData.acts) || outlineData.acts.length === 0) {
    throw new Error("Invalid narrative outline: missing or empty acts array");
  }

  if (!outlineData.totalScenes || !outlineData.estimatedTotalWords) {
    const acts = outlineData.acts ?? [];
    const allScenes = acts.flatMap((act: any) => (Array.isArray(act.scenes) ? act.scenes : []));
    const computedTotalScenes = allScenes.length;
    const computedTotalWords = allScenes.reduce(
      (sum: number, scene: any) => sum + (typeof scene.estimatedWordCount === "number" ? scene.estimatedWordCount : 0),
      0,
    );

    outlineData = {
      ...outlineData,
      totalScenes: outlineData.totalScenes ?? computedTotalScenes,
      estimatedTotalWords: outlineData.estimatedTotalWords ?? computedTotalWords,
    };
  }

  return {
    ...outlineData,
    cost,
    durationMs,
  };
}

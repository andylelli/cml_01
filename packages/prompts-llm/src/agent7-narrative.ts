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
  detectiveType?: 'police' | 'private' | 'amateur'; // Determines how the detective enters the story
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
  const user = buildUserRequest(caseData, targetLength, narrativeStyle, inputs.qualityGuardrails ?? [], inputs.detectiveType);

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
${eraDetails}

---

## Prose Requirements (CRITICAL - Must be reflected in outline)
${buildProseRequirements(caseData)}`;
}

function buildProseRequirements(caseData: CaseData): string {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const proseReq = cmlCase.prose_requirements;
  
  if (!proseReq) {
    return "No explicit prose requirements specified. Follow standard mystery structure.";
  }

  let reqText = "";

  // Discriminating test scene
  if (proseReq.discriminating_test_scene) {
    const dt = proseReq.discriminating_test_scene;
    reqText += `### Discriminating Test Scene (REQUIRED)\n`;
    reqText += `- **Must appear in:** Act ${dt.act_number}, Scene ${dt.scene_number}\n`;
    reqText += `- **Test type:** ${dt.test_type}\n`;
    reqText += `- **Required elements:** ${(dt.required_elements || []).join(", ")}\n\n`;
  }

  // Suspect clearance scenes
  if (proseReq.suspect_clearance_scenes && proseReq.suspect_clearance_scenes.length > 0) {
    reqText += `### Suspect Clearance Scenes (REQUIRED)\n`;
    proseReq.suspect_clearance_scenes.forEach((clearance: any) => {
      reqText += `- **${clearance.suspect_name}**: Act ${clearance.act_number}, Scene ${clearance.scene_number}\n`;
      reqText += `  - Method: ${clearance.clearance_method}\n`;
      if (clearance.supporting_clues && clearance.supporting_clues.length > 0) {
        reqText += `  - Clues: ${clearance.supporting_clues.join(", ")}\n`;
      }
    });
    reqText += "\n";
  }

  // Culprit revelation
  if (proseReq.culprit_revelation_scene) {
    const rev = proseReq.culprit_revelation_scene;
    reqText += `### Culprit Revelation Scene (REQUIRED)\n`;
    reqText += `- **Must appear in:** Act ${rev.act_number}, Scene ${rev.scene_number}\n`;
    reqText += `- **Revelation method:** ${rev.revelation_method}\n\n`;
  }

  // Identity rules
  if (proseReq.identity_rules && proseReq.identity_rules.length > 0) {
    reqText += `### Identity Reference Rules\n`;
    proseReq.identity_rules.forEach((rule: any) => {
      reqText += `- **${rule.character_name}**:\n`;
      reqText += `  - Before reveal (Acts 1-${rule.revealed_in_act - 1}): "${rule.before_reveal_reference}"\n`;
      reqText += `  - After reveal (Act ${rule.revealed_in_act}+): "${rule.after_reveal_reference}"\n`;
    });
    reqText += "\n";
  }

  // Clue to scene mapping
  if (proseReq.clue_to_scene_mapping && proseReq.clue_to_scene_mapping.length > 0) {
    reqText += `### Clue Placement Guidelines\n`;
    const mapped = proseReq.clue_to_scene_mapping.slice(0, 5); // Show first 5
    mapped.forEach((mapping: any) => {
      reqText += `- **${mapping.clue_id}**: Act ${mapping.act_number}`;
      if (mapping.scene_number) {
        reqText += `, Scene ${mapping.scene_number}`;
      }
      if (mapping.delivery_method) {
        reqText += ` (${mapping.delivery_method})`;
      }
      reqText += `\n`;
    });
  }

  return reqText || "No prose requirements specified.";
}

function buildUserRequest(caseData: CaseData, targetLength: string, narrativeStyle: string, qualityGuardrails: string[], detectiveType?: 'police' | 'private' | 'amateur'): string {
  const lengthGuidance = {
    short: "exactly 12 scenes (one per chapter), ~15,000-25,000 words total",
    medium: "exactly 18 scenes (one per chapter), ~40,000-60,000 words total",
    long: "exactly 26 scenes (one per chapter), ~70,000-100,000 words total",
  };

  const totalSceneCount = ({ short: 12, medium: 18, long: 26 } as Record<string, number>)[targetLength] ?? 18;
  const minClueScenes = Math.ceil(totalSceneCount * 0.6);

  const styleGuidance = {
    classic:
      "Golden Age detective fiction style - puzzle-focused, rational deduction, restrained prose, emphasis on fair play clues",
    modern:
      "Contemporary mystery style - character-driven, psychological depth, naturalistic dialogue, atmospheric tension",
    atmospheric:
      "Gothic/noir style - mood and setting prominent, shadows and secrets, poetic prose, emphasis on dread and revelation",
  };

  // Act I entry-point rules based on detective type — this is non-negotiable story logic
  const detectiveEntryRule = detectiveType === 'private'
    ? `### Detective Entry (MANDATORY — Private Investigator)
The private investigator is NOT present before the crime. A scene in Act I MUST show them being engaged by a client (one of the named cast members or a credible off-page party such as a solicitor or insurance agent). This scene must establish:
- **Who the client is** and their relationship to the victim or the situation
- **Why they are bypassing or supplementing the police** (distrust, desire for discretion, a specific question the police won't pursue)
- **The PI's limited authority**: they cannot compel witnesses to speak; every interview must be earned through persuasion, charm, or the client's leverage
Do NOT write Act I as if the PI was already on the scene. They arrive as an outsider, engaged after the fact.`
    : detectiveType === 'amateur'
    ? `### Detective Entry (MANDATORY — Amateur / Civilian)
The amateur investigator has no official standing. Act I MUST establish, organically and plausibly:
- **Why they were already present** (invited guest, local resident, stranded traveller, visiting relative) OR what specific event drew them in after the crime
- **Why they are uniquely placed to investigate** despite having no authority (specialist knowledge, the victim's prior confidence in them, access to spaces or people the police can't reach socially)
- **Their uneasy relationship with authority**: the official police (if present) may be dismissive, obstructive, or actively suspicious of their involvement. Other characters may refuse to cooperate.
NEVER write the amateur as automatically welcomed or respected. Their involvement must be earned scene by scene.`
    : `### Detective Entry (Police Inspector)
The police detective/inspector is summoned in an official capacity following a formal report of the crime. They arrive at the scene with full investigative authority. Act I opens with or shortly after their official arrival. Witnesses are expected to cooperate; the detective can compel access.`;

  const guardrailBlock = qualityGuardrails.length > 0
    ? `\n## Quality Guardrails (Must Satisfy)\n${qualityGuardrails.map((rule, idx) => `${idx + 1}. ${rule}`).join("\n")}\n`
    : "";

  const proseRequirementsBlock = buildProseRequirements(caseData);

  return `# Narrative Outline Task

Create a scene-by-scene outline for this mystery story.

## Target Specifications
- **Length**: ${targetLength} (${lengthGuidance[targetLength as keyof typeof lengthGuidance]})
- **Style**: ${narrativeStyle} (${styleGuidance[narrativeStyle as keyof typeof styleGuidance]})
${proseRequirementsBlock}

## Scene Construction Guidelines

### Act I: Setup (25-30% of scenes)
- **Introduce the crime**: Discovery of victim, initial shock
- **Establish setting**: Era atmosphere, location details
- **Meet the cast**: Detective, suspects, witnesses
- **Plant early clues**: Subtle hints, initial observations
- **Support false assumption**: Lead reader toward wrong conclusion
- **End with**: Detective commits to investigation, stakes established

${detectiveEntryRule}

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
  - **CRITICAL — Clue Distribution**: Clues MUST appear in at least 60% of all scenes. Concretely: with ${totalSceneCount} scenes, at least ${minClueScenes} scenes must have a non-empty cluesRevealed array. Do NOT leave more than 2 consecutive scenes without any clue.
- Space clues evenly across all three acts — no act should be entirely clue-free
- Build tension toward act breaks
- Use red herrings in Act I and early Act II
- Discriminating test appears in late Act II or early Act III
- Save essential clues for when inference path requires them
- Do not introduce detective-private insights; avoid reveals unsupported by previously listed clue IDs

## CRITICAL: Character Names in Scenes
In every scene's "characters" array, use the **EXACT character names** from the "Cast of Characters" section above.
**NEVER** use role labels such as "detective", "butler", "suspect", "constable", "witness" — these are placeholder examples in the JSON schema, not real names.
Every string in a scene's characters array must be a proper name that appears in the Cast of Characters.

${detectiveType === 'amateur' || detectiveType === 'private'
  ? `## CRITICAL: No Invented Police Officials
This story has a **${detectiveType === 'amateur' ? 'civilian amateur' : 'private investigator'}** as the detective. Do NOT invent named police officials (no "Inspector [Surname]", no "Constable [Surname]", no "Sergeant [Surname]") anywhere in scene summaries, purposes, or dramaticElements. The only named characters are those in the Cast of Characters above. If police must appear, describe them anonymously: "a local constable", "the sergeant", "officers from the village". Any invented police name will be scrubbed automatically and will confuse the prose LLM.
`
  : ''}

## CRITICAL: Follow Prose Requirements
**You MUST include the scenes specified in the "Prose Requirements" section at the exact act/scene positions indicated.**
- If a discriminating test scene is specified, that scene must appear at that position
- If suspect clearance scenes are specified, each must appear at their designated positions
- If a culprit revelation scene is specified, it must appear at that position
- Scene descriptions must mention the required elements and clues indicated
- These requirements are mandatory for story validation - missing them will cause generation failure
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
            "location": "[ACTUAL LOCATION FROM CML]",
            "timeOfDay": "[TIME OF DAY]",
            "atmosphere": "[ATMOSPHERE]"
          },
          "characters": ["[EXACT NAME FROM CAST LIST]", "[EXACT NAME FROM CAST LIST]"],
          "purpose": "Introduce the crime and detective",
          "cluesRevealed": ["clue_1", "clue_2"],
          "dramaticElements": {
            "conflict": "[DESCRIBE CONFLICT]",
            "tension": "[DESCRIBE TENSION]"
          },
          "summary": "[2-3 sentence scene description using only exact names from the Cast of Characters above]",
          "estimatedWordCount": 1800
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

/**
 * Agent 2: Cast & Motive Designer
 *
 * Generates detailed character profiles with secrets, motives, alibis, and relationships.
 * Accepts user-provided character names and creates psychologically rich suspects.
 * 
 * Note: Like Agent 1, this implementation does NOT use explicit logging calls to keep it simple.
 * Agent 3 uses the logger from client, but Agents 1 & 2 follow a simpler pattern.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";

// ============================================================================
// Types
// ============================================================================

export interface CastInputs {
  runId: string;
  projectId: string;
  characterNames?: string[]; // User-provided names (optional)
  castSize?: number; // Number of characters to generate (if names not provided)
  setting: string; // Era + location context
  crimeType: string; // Murder, theft, etc.
  tone: string; // Golden age, noir, cozy, etc.
  socialContext?: string; // Class structure, institution type
}

export interface CharacterProfile {
  name: string;
  ageRange: string;
  occupation: string;
  roleArchetype: string;
  publicPersona: string;
  privateSecret: string;
  motiveSeed: string;
  motiveStrength: "weak" | "moderate" | "strong" | "compelling";
  alibiWindow: string;
  accessPlausibility: "impossible" | "unlikely" | "possible" | "easy";
  stakes: string;
  characterArcPotential: string;
}

export interface RelationshipWeb {
  pairs: Array<{
    character1: string;
    character2: string;
    relationship: string;
    tension: "none" | "low" | "moderate" | "high";
    sharedHistory: string;
  }>;
}

export interface CastDesign {
  characters: CharacterProfile[];
  relationships: RelationshipWeb;
  diversity: {
    stereotypeCheck: string[];
    recommendations: string[];
  };
  crimeDynamics: {
    possibleCulprits: string[];
    redHerrings: string[];
    victimCandidates: string[];
    detectiveCandidates: string[];
  };
}

export interface CastDesignResult {
  cast: CastDesign;
  attempt: number;
  latencyMs: number;
  cost: number;
}

interface PromptComponents {
  system: string;
  developer: string;
  user: string;
  messages: Array<{ role: "system" | "user"; content: string }>;
}

// ============================================================================
// Prompt Building
// ============================================================================

export function buildCastPrompt(inputs: CastInputs): PromptComponents {
  const system = `You are a character design specialist for classic mystery fiction, with expertise in creating psychologically rich, diverse casts of suspects. Your role is to take user-provided character names and develop detailed profiles with hidden motives, secrets, alibis, and interpersonal tensions.

You have expertise in:
- Character psychology and motivation
- Relationship dynamics and hidden tensions
- Stereotype avoidance and diverse representation
- Classic mystery archetypes (amateur sleuth, professional, witness, etc.)
- Alibi construction and access plausibility
- Creating red herrings and misdirection`;

  const developer = `# Character Profile Template

For each character, generate:

## Basic Profile
- **name**: (from user-provided list)
- **ageRange**: (e.g., "late 20s", "mid 40s", "60s")
- **occupation**: (profession or role)
- **roleArchetype**: (e.g., "amateur sleuth", "professional detective", "victim", "primary suspect", "comic relief", "voice of reason")

## Public vs Private
- **publicPersona**: What others see (facade, reputation, social mask)
- **privateSecret**: Hidden truth (scandal, debt, affair, addiction, trauma)

## Motive & Opportunity
- **motiveSeed**: Reason they *could* be involved (greed, revenge, protection, fear, love)
- **motiveStrength**: "weak" | "moderate" | "strong" | "compelling"
- **alibiWindow**: When they were/weren't accessible during crime window
- **accessPlausibility**: "impossible" | "unlikely" | "possible" | "easy" (access to crime scene/means)
- **stakes**: What they stand to gain or lose

## Character Arc
- **characterArcPotential**: How they might evolve through investigation

# Relationship Web Template

Generate pairs of relationships:
- **character1** and **character2**: (names)
- **relationship**: (e.g., "siblings", "employer/employee", "former lovers", "rivals")
- **tension**: "none" | "low" | "moderate" | "high"
- **sharedHistory**: Brief backstory of their connection

# Diversity & Realism Check

- **stereotypeCheck**: List any potential stereotypes to avoid
- **recommendations**: Suggestions for authentic, diverse representation

# Crime Dynamics

Analyze the cast for:
- **possibleCulprits**: Characters with strong motive + access
- **redHerrings**: Characters who seem guilty but aren't
- **victimCandidates**: Who might be the victim (if murder)
- **detectiveCandidates**: Who could be the investigator

# Output Format

Return JSON only:
\`\`\`json
{
  "characters": [
    {
      "name": "...",
      "ageRange": "...",
      "occupation": "...",
      "roleArchetype": "...",
      "publicPersona": "...",
      "privateSecret": "...",
      "motiveSeed": "...",
      "motiveStrength": "weak|moderate|strong|compelling",
      "alibiWindow": "...",
      "accessPlausibility": "impossible|unlikely|possible|easy",
      "stakes": "...",
      "characterArcPotential": "..."
    }
  ],
  "relationships": {
    "pairs": [
      {
        "character1": "...",
        "character2": "...",
        "relationship": "...",
        "tension": "none|low|moderate|high",
        "sharedHistory": "..."
      }
    ]
  },
  "diversity": {
    "stereotypeCheck": ["..."],
    "recommendations": ["..."]
  },
  "crimeDynamics": {
    "possibleCulprits": ["..."],
    "redHerrings": ["..."],
    "victimCandidates": ["..."],
    "detectiveCandidates": ["..."]
  }
}
\`\`\`
`;

  const count = inputs.characterNames?.length || inputs.castSize || 6;
  const namesSection = inputs.characterNames 
    ? `**Character Names**: ${inputs.characterNames.join(", ")}`
    : `**Cast Size**: Create ${count} original characters (generate appropriate names)`;

  const user = `Design detailed character profiles for the following mystery:

${namesSection}
**Setting**: ${inputs.setting}
**Crime Type**: ${inputs.crimeType}
${inputs.socialContext ? `**Social Context**: ${inputs.socialContext}` : ""}
**Tone**: ${inputs.tone}

Requirements:
1. Create complete profiles for all ${count} characters
2. Ensure diverse representation (age, background, archetype)
3. Build interconnected relationships with hidden tensions
4. Generate plausible motives and alibis for each character
5. Identify 2-3 strong culprit candidates
6. Create 1-2 effective red herrings
7. Avoid stereotypes and clichés
8. Ensure each character has both public facade and private secrets

Output JSON only.`;

  // Azure OpenAI requires system + developer combined
  const messages = [
    { role: "system" as const, content: `${system}\n\n${developer}` },
    { role: "user" as const, content: user },
  ];

  return { system, developer, user, messages };
}

// ============================================================================
// Main Agent Function
// ============================================================================

export async function designCast(
  client: AzureOpenAIClient,
  inputs: CastInputs,
  maxAttempts = 3
): Promise<CastDesignResult> {
  const startTime = Date.now();
  const expectedCount = inputs.characterNames?.length || inputs.castSize || 6;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // 1. Build prompt
      const prompt = buildCastPrompt(inputs);

      // 2. Call LLM
      const response = await client.chat({
        messages: prompt.messages,
        temperature: 0.7,
        maxTokens: 4000,
        jsonMode: true,
        logContext: {
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent2-CastDesigner",
          retryAttempt: attempt,
        },
      });

      // 3. Parse JSON
      const content = response.content;
      if (!content) {
        console.error("Empty response - full response:", response);
        throw new Error("Empty response from LLM");
      }

      let cast: CastDesign;
      try {
        cast = JSON.parse(content);
      } catch (error) {
        if (attempt < maxAttempts) {
          console.error(`Attempt ${attempt}: JSON parse failed`, error);
          continue; // Retry on parse error
        } else {
          throw new Error(`JSON parsing failed after ${maxAttempts} attempts: ${(error as Error).message}`);
        }
      }

      // 4. Validate and normalize structure
      const normalizedCharacters = Array.isArray(cast.characters) ? [...cast.characters] : [];
      if (normalizedCharacters.length !== expectedCount) {
        console.warn(
          `Attempt ${attempt}: Validation failed - expected ${expectedCount} characters, got ${normalizedCharacters.length}. Normalizing.`,
        );
      }
      while (normalizedCharacters.length < expectedCount) {
        const index = normalizedCharacters.length + 1;
        normalizedCharacters.push({
          name: `Placeholder ${index}`,
          ageRange: "adult",
          occupation: "resident",
          roleArchetype: "suspect",
          publicPersona: "reserved",
          privateSecret: "keeps a secret",
          motiveSeed: "inheritance",
          motiveStrength: "moderate",
          alibiWindow: "evening",
          accessPlausibility: "possible",
          stakes: "reputation",
          characterArcPotential: "discovers hidden resolve",
        });
      }
      if (normalizedCharacters.length > expectedCount) {
        normalizedCharacters.length = expectedCount;
      }
      cast.characters = normalizedCharacters;

      // Validate all characters have required fields
      const requiredFields = [
        "name",
        "ageRange",
        "occupation",
        "roleArchetype",
        "publicPersona",
        "privateSecret",
        "motiveSeed",
        "motiveStrength",
        "alibiWindow",
        "accessPlausibility",
        "stakes",
        "characterArcPotential",
      ];

      const missingFields = cast.characters
        .map((char: any, idx: number) => {
          const missing = requiredFields.filter((field) => !char[field]);
          return missing.length > 0
            ? `Character ${idx + 1} (${char.name || "unknown"}): ${missing.join(", ")}`
            : null;
        })
        .filter(Boolean);

      if (missingFields.length > 0) {
        if (attempt < maxAttempts) {
          continue; // Retry on missing fields
        }
        // Fill missing fields with defaults to avoid hard failure
        cast.characters = cast.characters.map((char: any, idx: number) => ({
          name: char.name || `Placeholder ${idx + 1}`,
          ageRange: char.ageRange || "adult",
          occupation: char.occupation || "resident",
          roleArchetype: char.roleArchetype || "suspect",
          publicPersona: char.publicPersona || "reserved",
          privateSecret: char.privateSecret || "keeps a secret",
          motiveSeed: char.motiveSeed || "inheritance",
          motiveStrength: char.motiveStrength || "moderate",
          alibiWindow: char.alibiWindow || "evening",
          accessPlausibility: char.accessPlausibility || "possible",
          stakes: char.stakes || "reputation",
          characterArcPotential: char.characterArcPotential || "discovers hidden resolve",
          relationships: Array.isArray(char.relationships) ? char.relationships : [],
        }));
      }

      // Success!
      const latencyMs = Date.now() - startTime;

      return {
        cast,
        attempt,
        latencyMs,
        cost: 0, // Cost tracking not available in simplified client
      };
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error; // Re-throw on final attempt
      }
      // Otherwise continue to next attempt
    }
  }

  throw new Error(`Cast design failed after ${maxAttempts} attempts`);
}

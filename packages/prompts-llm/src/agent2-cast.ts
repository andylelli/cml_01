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
  detectiveType?: 'police' | 'private' | 'amateur'; // Archetype of the investigator character
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

// Simple hash function for variation
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

/**
 * Derive N distinct first-name starting letters from the run hash.
 * Uses a linear congruential generator seeded with the hash so we get a
 * deterministic but highly varied sequence across runs.
 * Avoids letters that feel unnatural as period name starters (Q, X, Y, Z, U, V).
 */
const deriveNameInitials = (hash: number, count: number): string[] => {
  const letterPool = 'ABCDEFGHIJKLMNOPRSTW'; // 20 period-authentic letters
  const initials: string[] = [];
  const used = new Set<string>();
  // LCG: produces a different sequence per hash seed
  let state = (hash >>> 0) || 1;
  for (let i = 0; i < count; i++) {
    state = Math.imul(state, 1664525) + 1013904223 >>> 0;
    let idx = state % letterPool.length;
    // Resolve collision by walking forward in pool
    let attempts = 0;
    while (used.has(letterPool[idx]) && attempts < letterPool.length) {
      idx = (idx + 1) % letterPool.length;
      attempts++;
    }
    const letter = letterPool[idx];
    initials.push(letter);
    used.add(letter);
  }
  return initials;
};

// Generate specific variation directives from runId
const generateCastVariation = (runId: string, count: number): {
  relationshipStyle: number;
  motivePattern: number;
  dynamicType: number;
  namingPool: string;
  nameInitials: string[];
} => {
  const hash = simpleHash(runId);
  const namingPools = [
    'English county gentry (Midlands/South — Austen-era landed families)',
    'Irish or Welsh with Celtic surnames (O\'Brien, Llewellyn, Maguire, Pryce style)',
    'Scottish Lowland merchant class (Erskine, Drummond, Gillespie, Dunbar style)',
    'Anglo-French Norman descent (Beaumont, Delacroix, Montfort, Villiers style)',
    'Northern English (Yorkshire/Lancashire industrialist — Sutcliffe, Threlfall, Appleyard style)',
    'Jewish-British professional London (Goldstein, Levy, Abramowitz, Cohen style)',
    'Central European émigré (Austrian/German: Vossler, Grunewald, Steiner, Hirsch style)',
    'Mixed colonial (Anglo-Indian or Caribbean-British: Krishnamurthy, Okonkwo, De Silva, Ferreira style)',
    'East Anglian/Fenland working gentry (Sparrow, Fulcher, Lavenham, Brome style)',
    'Victorian professional London (Solicitor/physician class: Alderton, Carver, Penrose, Quain style)',
    'Cornish or Devon coastal (Trevithick, Carne, Pengelly, Rosevear style)',
    'Edwardian theatrical/artistic circle (Sable, Lancing, Beauchamp, Glaive style)',
  ];
  return {
    relationshipStyle: (hash % 4) + 1,
    motivePattern: ((hash >> 4) % 3) + 1,
    dynamicType: ((hash >> 8) % 3) + 1,
    namingPool: namingPools[(hash >> 12) % namingPools.length],
    nameInitials: deriveNameInitials(hash, count),
  };
};

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
 - **Requirement**: Final stereotypeCheck must be empty; resolve any issues before output

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

  // Detective archetype guidance
  const detectiveArchetype = inputs.detectiveType === 'private'
    ? 'a private investigator or hired detective — independent, not affiliated with the police; perhaps ex-military, a former solicitor, or a professional inquiry agent'
    : inputs.detectiveType === 'amateur'
    ? 'an amateur sleuth — a civilian drawn into the case by circumstance. Could be anyone: a retired schoolteacher, a nosy vicar, a sharp-witted spinster, a travelling journalist, a young doctor, a gentleman of leisure, or any other compelling civilian whose particular skills or social position make them uniquely suited to solve the crime. Be creative and era-appropriate.'
    : 'a professional police detective or inspector — a member of the official constabulary or a detective from Scotland Yard';

  const detectiveRoleLabel = inputs.detectiveType === 'private'
    ? 'Private Investigator / Inquiry Agent'
    : inputs.detectiveType === 'amateur'
    ? 'Amateur Sleuth / Civilian Investigator'
    : 'Police Detective / Inspector';

  // Entry-point narrative mandate — how the detective legitimately comes to investigate
  const detectiveEntryMandate = inputs.detectiveType === 'private'
    ? `The private investigator is NOT present at the crime scene before the crime. They must be engaged AFTER the crime occurs. Their characterArcPotential MUST describe:
  (a) who their client is (a family member, a solicitor, an insurance company, a worried heir — one of the other named characters or a credible off-page party), and
  (b) the client's reason for bypassing or supplementing the official police investigation (distrust, desire for discretion, competing interests, or a specific question the police won't ask).
  The PI has no power to compel anyone to speak to them — their access relies on charm, guile, and the client's social leverage.`
    : inputs.detectiveType === 'amateur'
    ? `The amateur investigator has NO official standing whatsoever. Their characterArcPotential MUST describe:
  (a) why they were already present at the location when the crime occurred (invited guest, local resident, visiting relative, chance traveller caught by weather or circumstance), OR what event drew them in after the fact, and
  (b) the specific skill, knowledge, or social circumstance that gives them a unique angle the official police lack (knowledge of the household, specialist expertise, the victim's trust, local knowledge, etc.).
  The official police may be dismissive or obstructive. Other characters may refuse to speak to them. Their investigation must be earned through ingenuity and social navigation.`
    : `The police detective/inspector is summoned to the scene in an official capacity following a report of the crime. They have full investigative authority and witnesses are expected to cooperate. Their characterArcPotential should reflect any personal stakes, professional complications, or political pressures that complicate the official investigation.`;

  const namesSection = inputs.characterNames 
    ? `**Character Names**: ${inputs.characterNames.join(", ")}`
    : `**Cast Size**: Create exactly ${count} original characters. Generate names that are authentic to the era and setting (${inputs.setting}). Names must sound plausible for that time period and social class — not modern or anachronistic.

IMPORTANT: Exactly ONE of the ${count} characters is the investigator/detective. That character must be ${detectiveArchetype}. Their roleArchetype must be "${detectiveRoleLabel}". The remaining ${count - 1} characters are suspects, witnesses, and victims.

DETECTIVE ENTRY MANDATE: ${detectiveEntryMandate}`;

  const variation = generateCastVariation(inputs.runId || inputs.projectId || "", count);
  const relationshipGuidance = [
    "family secrets and inheritance conflicts",
    "professional rivalries and workplace tensions",
    "romantic entanglements and betrayals",
    "long-buried scandals resurfacing"
  ][variation.relationshipStyle - 1];
  
  const motiveGuidance = variation.motivePattern === 1 
    ? "concentrate strong motives in 2-3 characters" 
    : variation.motivePattern === 2
    ? "distribute moderate motives across most characters"
    : "create one overwhelming motive and several weak ones";
  
  const dynamicGuidance = variation.dynamicType === 1
    ? "class tensions and social climbing"
    : variation.dynamicType === 2
    ? "insider vs outsider dynamics"
    : "generational conflicts and changing values";

  const user = `Design detailed character profiles for the following mystery:

VARIATION DIRECTIVES FOR THIS CAST:
- Naming Style: ${variation.namingPool}
- NAMING RULE: Generate names that feel authentic to the naming style above. FORBIDDEN overused golden-age surnames (do NOT use any of these): Harrington, Whitfield, Ashford, Pemberton, Wentworth, Blackwood, Sterling, Thornton, Bancroft, Worthington, Montague, Greystone, Ashbourne, Hartley, Fletcher, Cunningham. Use fresh, surprising names the reader has not seen a hundred times.
- FIRST-NAME INITIALS (MANDATORY): The ${count} characters' given names must begin with these letters (one per character, assign in any order you like): ${variation.nameInitials.join(', ')}. Every character must have a first name starting with one of these letters — no two characters may share the same initial. This guarantees name uniqueness across stories.
- Relationship Theme: Emphasize ${relationshipGuidance}
- Motive Distribution: ${motiveGuidance}
- Social Dynamic: Highlight ${dynamicGuidance}

Use these directives to create a UNIQUE cast with distinctive dynamics.

${namesSection}
**Setting**: ${inputs.setting}
**Crime Type**: ${inputs.crimeType}
${inputs.socialContext ? `**Social Context**: ${inputs.socialContext}` : ""}
**Tone**: ${inputs.tone}

Requirements:
1. Create complete profiles for ALL ${count} characters — the characters array MUST have exactly ${count} entries
2. ONE character is the investigator/detective (roleArchetype: "${detectiveRoleLabel}") — they must NOT appear in crimeDynamics.possibleCulprits
3. Ensure diverse representation (age, background, archetype)
4. Build interconnected relationships with hidden tensions
5. Generate plausible motives and alibis for each non-detective character
6. Identify at least ${Math.min(3, count - 1)} strong culprit candidates from the non-detective characters (CRITICAL: crimeDynamics.possibleCulprits MUST contain at least ${Math.min(3, count - 1)} names)
7. Create 1-2 effective red herrings
8. Avoid stereotypes and clichés
9. Ensure each character has both public facade and private secrets
10. Resolve any potential stereotypes; output stereotypeCheck as []

CRITICAL COMPLETENESS RULES:
- The final characters array MUST have exactly ${count} entries — no more, no fewer
- crimeDynamics.possibleCulprits MUST name at least ${Math.min(3, count - 1)} characters (suspects only — never the detective)
- The detective character's roleArchetype MUST be "${detectiveRoleLabel}"

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
        temperature: 0.75, // Higher for diverse character generation
        maxTokens: 6000,   // 7 rich characters + relationships easily exceeds 4000
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

      // Retry on any character shortfall (before the final attempt).
      // Placeholder characters score zero on depth metrics so we want real LLM
      // content for every slot; only pad with placeholders as a last resort on
      // the final attempt.
      if (normalizedCharacters.length < expectedCount && attempt < maxAttempts) {
        console.warn(
          `Attempt ${attempt}: Only ${normalizedCharacters.length} of ${expectedCount} characters returned. Retrying.`,
        );
        continue;
      }

      if (normalizedCharacters.length !== expectedCount) {
        console.warn(
          `Attempt ${attempt}: Final attempt — expected ${expectedCount} characters, got ${normalizedCharacters.length}. Padding with placeholders.`,
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

      // Validate possibleCulprits: need at least min(3, count-1) names
      const requiredCulprits = Math.min(3, expectedCount - 1);
      const possibleCulprits = Array.isArray(cast.crimeDynamics?.possibleCulprits)
        ? cast.crimeDynamics.possibleCulprits
        : [];
      if (possibleCulprits.length < requiredCulprits) {
        if (attempt < maxAttempts) {
          console.warn(
            `Attempt ${attempt}: Only ${possibleCulprits.length} possibleCulprits, need ${requiredCulprits}. Retrying.`,
          );
          continue;
        }
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

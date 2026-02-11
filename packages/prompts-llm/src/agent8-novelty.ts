/**
 * Agent 8: Novelty Auditor
 *
 * Validates that a generated mystery is sufficiently different from seed CML examples.
 * Enforces the novelty requirement: no copying from seed patterns, only structural inspiration.
 *
 * Compares the generated CML against all seed CMLs to detect:
 * - Plot similarity (same crime, method, motive)
 * - Character similarity (same names, roles, relationships)
 * - Setting similarity (same era, location combination)
 * - Solution similarity (same culprit profile, false assumption, discriminating test)
 * - Overall structural similarity
 *
 * Returns similarity scores and pass/fail status based on thresholds.
 *
 * Temperature: 0.3 (low - consistent, objective comparison)
 * Max Tokens: 2500 (moderate - detailed similarity report)
 * Output Format: JSON (structured similarity scores)
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { PromptComponents } from "./types.js";

// ============================================================================
// Types
// ============================================================================

export interface NoveltyAuditInputs {
  generatedCML: CaseData;
  seedCMLs: CaseData[]; // All seed examples to compare against
  similarityThreshold?: number; // 0-1, default 0.7 (70% similarity = fail)
  runId?: string;
  projectId?: string;
}

export interface SimilarityScore {
  seedTitle: string;
  overallSimilarity: number; // 0-1
  plotSimilarity: number; // Crime, method, motive
  characterSimilarity: number; // Names, roles, relationships
  settingSimilarity: number; // Era, location
  solutionSimilarity: number; // Culprit profile, false assumption, test
  structuralSimilarity: number; // CML structure, inference path length
  concerningMatches: string[]; // Specific similarities that are problematic
}

export interface NoveltyAuditResult {
  status: "pass" | "fail" | "warning";
  overallNovelty: number; // 0-1, higher = more novel
  mostSimilarSeed: string;
  highestSimilarity: number;
  similarityScores: SimilarityScore[];
  violations: string[]; // Critical similarities that violate novelty
  warnings: string[]; // Moderate similarities to be aware of
  recommendations: string[];
  summary: string;
  cost: number;
  durationMs: number;
}

// ============================================================================
// Prompt Builder
// ============================================================================

export function buildNoveltyPrompt(inputs: NoveltyAuditInputs): PromptComponents {
  const { generatedCML, seedCMLs, similarityThreshold = 0.7 } = inputs;

  // System: Define the novelty auditor role
  const system = `You are an expert plagiarism and similarity detection specialist for mystery fiction. Your role is to compare a newly generated mystery (CML) against a set of seed examples to ensure sufficient novelty.

**Critical Principle**: The seed CMLs provide structural inspiration only. The generated mystery must NOT copy:
- Specific plot details (same crime, method, motive combination)
- Character names, profiles, or relationship dynamics
- Setting details (same era + location + key details)
- Solution patterns (same culprit type, false assumption, discriminating test)

**What IS allowed (structural patterns)**:
- Using similar CML structure (all mysteries have setup, cast, constraints)
- Same primary axis (temporal, spatial, etc.)
- Similar cast size (6-8 characters)
- Similar constraint types (time windows, locked rooms, alibis)

**What is NOT allowed (copying)**:
- Identical or near-identical crime scenarios
- Same character names or obvious name variants
- Same era + location combination
- Same motive categories for same character types
- Same false assumption pattern with same discriminating test

Your task is to compute similarity scores across multiple dimensions and flag any concerning matches that violate novelty.`;

  // Developer: Provide generated CML and seed CMLs
  const developer = buildDeveloperContext(generatedCML, seedCMLs);

  // User: Request the similarity analysis
  const user = buildUserRequest(similarityThreshold);

  return { system, developer, user };
}

function buildDeveloperContext(generatedCML: CaseData, seedCMLs: CaseData[]): string {
  const generated = summarizeCML(generatedCML, "Generated Mystery");

  const seeds = seedCMLs
    .map((seed, idx) => {
      return summarizeCML(seed, `Seed ${idx + 1}`);
    })
    .join("\n\n---\n\n");

  return `# Novelty Audit Context

## Generated Mystery (To Be Checked)

${generated}

---

## Seed CML Examples (Reference Patterns)

${seeds}`;
}

function summarizeCML(cml: CaseData, label: string): string {
  const legacy = cml as any;
  const cmlCase = (legacy?.CASE ?? {}) as any;
  const meta = cmlCase.meta ?? legacy.meta ?? {};
  const crimeClass = meta.crime_class ?? {};

  const title = meta?.title || "Untitled";
  const primaryAxis = meta?.primary_axis || cmlCase.false_assumption?.type || "unknown";
  const era = meta?.era?.decade
    ? `${meta.era.decade} - ${meta.setting?.location ?? "Unknown"}`
    : legacy.setup?.era
      ? `${legacy.setup.era.year} - ${legacy.setup.era.location}`
      : "Unknown era";
  const eraDetails = Array.isArray(meta?.era?.realism_constraints)
    ? meta.era.realism_constraints.slice(0, 3).join(", ")
    : legacy.setup?.era?.key_details?.slice(0, 3).join(", ") || "";
  const crime = legacy.setup?.crime?.description || crimeClass.subtype || crimeClass.category || "crime";
  const victim = legacy.setup?.crime?.victim || "Unknown";
  const method = legacy.setup?.crime?.method || crimeClass.subtype || "Unknown";

  const castList = Array.isArray(cmlCase.cast) ? cmlCase.cast : legacy.cast ?? [];
  const castSummary = castList.map((c: any) => c.name || "Unknown").join(", ");
  const castCount = castList.length;

  const culpritName =
    cmlCase.culpability?.culprits?.[0] || castList[0]?.name || legacy.solution?.culprit?.character_id || "Unknown";
  const motive = legacy.solution?.culprit?.motive || "Unknown";
  const solutionMethod = legacy.solution?.culprit?.method || crimeClass.subtype || "Unknown";
  const falseAssumption =
    cmlCase.false_assumption?.statement || legacy.solution?.false_assumption?.description || "Unknown";
  const discrimTest = cmlCase.discriminating_test?.design || legacy.inference_path?.discriminating_test?.test || "Unknown";

  const timeConstraints = cmlCase.constraint_space?.time ?? legacy.constraint_space?.time ?? [];
  const accessConstraints = cmlCase.constraint_space?.access ?? legacy.constraint_space?.access ?? [];
  const physicalConstraints = cmlCase.constraint_space?.physical ?? legacy.constraint_space?.physical ?? [];

  const countConstraintEntries = (value: any, keys: string[]) =>
    keys.reduce((acc, key) => acc + (Array.isArray(value?.[key]) ? value[key].length : 0), 0);

  const constraintCount = {
    time: Array.isArray(timeConstraints)
      ? timeConstraints.length
      : countConstraintEntries(timeConstraints, ["anchors", "windows", "contradictions"]),
    access: Array.isArray(accessConstraints)
      ? accessConstraints.length
      : countConstraintEntries(accessConstraints, ["actors", "objects", "permissions"]),
    physical: Array.isArray(physicalConstraints)
      ? physicalConstraints.length
      : countConstraintEntries(physicalConstraints, ["laws", "traces"]),
  };

  const inferenceSteps = (cmlCase.inference_path?.steps ?? legacy.inference_path?.steps ?? []).length;

  return `### ${label}
**Title**: ${title}
**Primary Axis**: ${primaryAxis}
**Era & Setting**: ${era}
**Era Details**: ${eraDetails}

**Crime**: ${crime}
**Victim**: ${victim}
**Method**: ${method}

**Cast (${castCount})**: ${castSummary}

**Culprit**: ${culpritName}
**Motive**: ${motive}
**Solution Method**: ${solutionMethod}

**False Assumption**: ${falseAssumption}
**Discriminating Test**: ${discrimTest}

**Constraints**: ${constraintCount.time} temporal, ${constraintCount.access} access, ${constraintCount.physical} physical
**Inference Path**: ${inferenceSteps} steps`;
}

function buildUserRequest(similarityThreshold: number): string {
  const thresholdPercent = Math.round(similarityThreshold * 100);

  return `# Novelty Audit Task

Compare the generated mystery against ALL seed examples and compute similarity scores.

## Similarity Dimensions

For each seed CML, evaluate:

### 1. Plot Similarity (0-1)
- Same crime type (murder, theft, fraud, etc.)
- Same crime method (stabbing, poisoning, etc.)
- Same crime location type (locked room, public space, etc.)
- Same victim profile
- **High similarity (>0.7)**: Indicates plot copying

### 2. Character Similarity (0-1)
- Same or similar character names
- Same character role combinations (butler + nephew + doctor)
- Same relationship dynamics (love triangle, inheritance dispute)
- Same character count and distribution
- **High similarity (>0.7)**: Indicates character copying

### 3. Setting Similarity (0-1)
- Same era (exact year or within 5 years)
- Same location (city, country estate, ship, etc.)
- Same era details (gaslight, telegraph, hansom cabs)
- **High similarity (>0.8)**: Indicates setting copying (era alone is OK)

### 4. Solution Similarity (0-1)
- Same culprit profile (role, relationship to victim)
- Same motive category (greed, revenge, protection, etc.)
- Same solution method (spare key, poison switch, alibi fabrication)
- Same false assumption pattern
- Same discriminating test type
- **High similarity (>0.7)**: Indicates solution copying

### 5. Structural Similarity (0-1)
- Similar inference path length
- Similar constraint counts
- Similar cast size
- Similar CML structure
- **High similarity (>0.8)**: OK - structural patterns are allowed

## Similarity Scoring

**Overall Similarity** = weighted average:
- Plot: 30%
- Characters: 25%
- Setting: 15%
- Solution: 25%
- Structural: 5%

## Pass/Fail Threshold

- **Pass**: Overall similarity < ${thresholdPercent}% for ALL seeds
- **Warning**: Overall similarity ${thresholdPercent}-${thresholdPercent + 10}% for any seed
- **Fail**: Overall similarity > ${thresholdPercent + 10}% for any seed

## Output Format

Return a JSON object:

\`\`\`json
{
  "status": "pass" | "fail" | "warning",
  "overallNovelty": 0.75,
  "mostSimilarSeed": "The Moonstone",
  "highestSimilarity": 0.62,
  "similarityScores": [
    {
      "seedTitle": "The Moonstone",
      "overallSimilarity": 0.62,
      "plotSimilarity": 0.55,
      "characterSimilarity": 0.70,
      "settingSimilarity": 0.80,
      "solutionSimilarity": 0.50,
      "structuralSimilarity": 0.65,
      "concerningMatches": [
        "Same era (Victorian England)",
        "Similar character count (7 vs 8)",
        "Both involve locked room mysteries"
      ]
    }
  ],
  "violations": [
    "Critical: Plot similarity 0.85 with 'The Moonstone' (same locked room + theft)"
  ],
  "warnings": [
    "Moderate: Character similarity 0.73 with 'The Sign of the Four' (similar cast structure)"
  ],
  "recommendations": [
    "Consider changing the crime location to increase plot differentiation",
    "Adjust character names to reduce similarity with Seed 2"
  ],
  "summary": "Generated mystery shows acceptable novelty. Highest similarity is 0.62 with 'The Moonstone', below the ${thresholdPercent}% threshold."
}
\`\`\`

Be specific about what similarities exist and whether they violate novelty principles.`;
}

// ============================================================================
// Main Audit Function
// ============================================================================

export async function auditNovelty(
  client: AzureOpenAIClient,
  inputs: NoveltyAuditInputs
): Promise<NoveltyAuditResult> {
  const startTime = Date.now();

  // Build the novelty prompt
  const prompt = buildNoveltyPrompt(inputs);

  // Call LLM with JSON mode
  const response = await client.chat({
    messages: [
      { role: "system", content: prompt.system },
      { role: "developer", content: prompt.developer },
      { role: "user", content: prompt.user }
    ],
    temperature: 0.3, // Low - consistent, objective comparison
    maxTokens: 2500, // Moderate - detailed similarity report
    jsonMode: true,
    logContext: {
      runId: inputs.runId || "unknown",
      projectId: inputs.projectId || "unknown",
      agent: "Agent8-NoveltyAuditor"
    }
  });

  const durationMs = Date.now() - startTime;
  const costTracker = client.getCostTracker();
  const cost = costTracker.getSummary().byAgent["Agent8-NoveltyAuditor"] || 0;

  // Parse the novelty result
  let noveltyData: Omit<NoveltyAuditResult, "cost" | "durationMs">;
  try {
    noveltyData = JSON.parse(response.content);
  } catch (error) {
    throw new Error(`Failed to parse novelty audit JSON: ${error}`);
  }

  // Validate required fields
  if (!noveltyData.status || !noveltyData.similarityScores || !noveltyData.summary) {
    throw new Error("Invalid novelty audit result: missing required fields (status, similarityScores, summary)");
  }

  return {
    ...noveltyData,
    cost,
    durationMs,
  };
}

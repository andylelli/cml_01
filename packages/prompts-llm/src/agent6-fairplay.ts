/**
 * Agent 6: Fair Play Auditor
 *
 * Validates that a mystery follows detective fiction fair play rules:
 * - All essential clues visible before solution reveal
 * - No information withheld from reader that detective knows
 * - No special knowledge required that wasn't disclosed
 * - Inference path completeness (all steps have supporting clues)
 * - Discriminating test appears at proper time
 *
 * Temperature: 0.3 (very low - consistent, rigorous auditing)
 * Max Tokens: 2500 (moderate - detailed audit report)
 * Output Format: JSON (structured pass/fail report)
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { ClueDistributionResult } from "./agent5-clues.js";
import type { PromptComponents } from "./types.js";

// ============================================================================
// Types
// ============================================================================

export interface FairPlayAuditInputs {
  caseData: CaseData;
  clues: ClueDistributionResult;
  runId?: string;
  projectId?: string;
}

export interface FairPlayCheck {
  rule: string;
  status: "pass" | "fail" | "warning";
  details: string;
  recommendations?: string[];
}

export interface FairPlayViolation {
  severity: "critical" | "moderate" | "minor";
  rule: string;
  description: string;
  location: string; // Where in the CML/clues the violation occurs
  suggestion: string;
}

export interface FairPlayAuditResult {
  overallStatus: "pass" | "fail" | "needs-revision";
  checks: FairPlayCheck[];
  violations: FairPlayViolation[];
  warnings: string[];
  recommendations: string[];
  summary: string;
  cost: number;
  durationMs: number;
}

// ============================================================================
// Prompt Builder
// ============================================================================

export function buildFairPlayPrompt(inputs: FairPlayAuditInputs): PromptComponents {
  const { caseData, clues } = inputs;

  // System: Define the auditor role
  const system = `You are an expert mystery fiction fair play auditor. Your role is to rigorously validate that a detective mystery follows the classic "fair play" rules established by the Detection Club:

1. **All clues must be revealed to the reader** before the solution
2. **No special knowledge** required (obscure poisons, rare languages, etc.) unless explained
3. **No information withheld** from reader that the detective knows
4. **The solution must be logically deducible** from the clues provided
5. **The discriminating test** (the crucial clue that reveals the culprit) must appear at the proper time
6. **No supernatural solutions** or deus ex machina
7. **The detective must not commit crimes** or use illegal methods to solve the case

You audit the mystery by analyzing the CML structure (which defines the logical proof) and the clue distribution (which shows how that proof is revealed to the reader).

Your goal is to ensure a reader, armed with the clues, can deduce the solution using logical reasoning—exactly as the detective does.`;

  // Developer: Provide the CML and clue data for analysis
  const developer = buildDeveloperContext(caseData, clues);

  // User: Request the audit
  const user = buildUserRequest();

  return { system, developer, user };
}

function buildDeveloperContext(caseData: CaseData, clues: ClueDistributionResult): string {
  const { meta, setup, cast, constraint_space, inference_path, solution } = caseData;

  // Extract essential information
  const title = meta?.title || "Untitled Mystery";
  const primaryAxis = meta?.primary_axis || "unknown";
  const crime = setup.crime.description;
  const victim = setup.crime.victim;
  const culprit = solution.culprit.character_id;
  const culpritName = cast.find((c) => c.character_id === culprit)?.name || "Unknown";
  const falseAssumption = solution.false_assumption.description;

  // Inference path steps
  const inferenceSteps = inference_path.steps.map((step, idx) => {
    return `${idx + 1}. **${step.type}**: ${step.observation} → ${step.reasoning}`;
  });

  // Discriminating test
  const discrimTest = `**When**: ${inference_path.discriminating_test.when}\n**What**: ${inference_path.discriminating_test.test}\n**Why**: ${inference_path.discriminating_test.reveals}`;

  // Clue timeline
  const earlyClues = clues.clues.filter((c) => c.placement === "early");
  const midClues = clues.clues.filter((c) => c.placement === "mid");
  const lateClues = clues.clues.filter((c) => c.placement === "late");
  const essentialClues = clues.clues.filter((c) => c.criticality === "essential");

  // Red herrings
  const redHerrings = clues.redHerrings.map((rh) => `- ${rh.description} (supports: ${rh.supportsAssumption})`).join("\n");

  return `# Fair Play Audit Context

## Mystery Overview
**Title**: ${title}
**Primary Axis**: ${primaryAxis}
**Crime**: ${crime}
**Victim**: ${victim}
**Culprit**: ${culpritName}
**False Assumption**: ${falseAssumption}

---

## Inference Path (Detective's Logic)
The detective follows these logical steps to reach the solution:

${inferenceSteps.join("\n")}

### Discriminating Test
${discrimTest}

---

## Clue Distribution
The mystery distributes ${clues.clues.length} clues to the reader:

### Early Clues (Act I) - ${earlyClues.length} clues
${earlyClues.map((c) => `- [${c.criticality}] ${c.category}: ${c.description}`).join("\n") || "None"}

### Mid Clues (Act II) - ${midClues.length} clues
${midClues.map((c) => `- [${c.criticality}] ${c.category}: ${c.description}`).join("\n") || "None"}

### Late Clues (Act III) - ${lateClues.length} clues
${lateClues.map((c) => `- [${c.criticality}] ${c.category}: ${c.description}`).join("\n") || "None"}

### Essential Clues
${essentialClues.map((c) => `- ${c.description} (${c.placement})`).join("\n")}

### Red Herrings
${redHerrings || "None"}

---

## Constraint Space
The mystery establishes these constraints:

### Temporal Constraints
${constraint_space.time.map((t) => `- ${t.description} (${t.constraint_type})`).join("\n")}

### Access Constraints
${constraint_space.access.map((a) => `- ${a.description} (${a.constraint_type})`).join("\n")}

### Physical Evidence
${constraint_space.physical.map((p) => `- ${p.description} (${p.constraint_type})`).join("\n")}

---

## Cast Evidence Sensitivity
${cast
  .filter((c) => c.evidence_sensitivity && c.evidence_sensitivity.length > 0)
  .map((c) => {
    const evidence = c.evidence_sensitivity!.map((e) => `${e.evidence_type}: ${e.vulnerability}`).join(", ");
    return `- **${c.name}**: ${evidence}`;
  })
  .join("\n")}`;
}

function buildUserRequest(): string {
  return `# Fair Play Audit Task

Perform a rigorous fair play audit of this mystery. Analyze whether the reader can logically deduce the solution from the clues provided.

## Audit Checklist

1. **Clue Visibility**: Are all essential clues revealed before the discriminating test?
2. **Information Parity**: Does the reader have the same information as the detective?
3. **Special Knowledge**: Is any specialized knowledge required? If so, is it explained?
4. **Logical Deducibility**: Can the reader follow the inference path using only the clues provided?
5. **Discriminating Test Timing**: Does the crucial clue appear at the right moment (typically Act II or early Act III)?
6. **No Withholding**: Are there any facts the detective knows but the reader doesn't?
7. **Constraint Consistency**: Do the clues align with the constraint space (time, access, physical evidence)?
8. **False Assumption Support**: Do the red herrings effectively support the false assumption?
9. **Solution Uniqueness**: Do the clues point unambiguously to the culprit?

## Output Format

Return a JSON object with this structure:

\`\`\`json
{
  "overallStatus": "pass" | "fail" | "needs-revision",
  "checks": [
    {
      "rule": "Clue Visibility",
      "status": "pass" | "fail" | "warning",
      "details": "Description of what was checked and the result",
      "recommendations": ["Optional suggestions for improvement"]
    }
  ],
  "violations": [
    {
      "severity": "critical" | "moderate" | "minor",
      "rule": "Information Parity",
      "description": "Specific violation found",
      "location": "Where in the CML/clues",
      "suggestion": "How to fix it"
    }
  ],
  "warnings": ["Non-critical issues that could improve fair play"],
  "recommendations": ["General suggestions to strengthen the mystery"],
  "summary": "Overall assessment of the mystery's fair play compliance"
}
\`\`\`

Be thorough and specific. If you find violations, explain exactly what's wrong and how to fix it.`;
}

// ============================================================================
// Main Audit Function
// ============================================================================

export async function auditFairPlay(
  client: AzureOpenAIClient,
  inputs: FairPlayAuditInputs
): Promise<FairPlayAuditResult> {
  const startTime = Date.now();

  // Build the audit prompt
  const prompt = buildFairPlayPrompt(inputs);

  // Call LLM with JSON mode
  const response = await client.complete({
    system: prompt.system,
    developer: prompt.developer,
    user: prompt.user,
    temperature: 0.3, // Very low - consistent, rigorous auditing
    maxTokens: 2500, // Moderate - detailed audit report
    responseFormat: { type: "json_object" },
    runId: inputs.runId,
    projectId: inputs.projectId,
  });

  const durationMs = Date.now() - startTime;
  const cost = response.cost;

  // Parse the audit result
  let auditData: Omit<FairPlayAuditResult, "cost" | "durationMs">;
  try {
    auditData = JSON.parse(response.content);
  } catch (error) {
    throw new Error(`Failed to parse fair play audit JSON: ${error}`);
  }

  // Validate required fields
  if (!auditData.overallStatus || !auditData.checks || !auditData.summary) {
    throw new Error("Invalid audit result: missing required fields (overallStatus, checks, summary)");
  }

  return {
    ...auditData,
    cost,
    durationMs,
  };
}

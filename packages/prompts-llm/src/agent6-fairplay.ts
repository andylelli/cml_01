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
  const legacy = caseData as any;
  const cmlCase = (legacy?.CASE ?? {}) as any;
  const meta = cmlCase.meta ?? legacy.meta ?? {};
  const crimeClass = meta.crime_class ?? {};
  const castList = Array.isArray(cmlCase.cast) ? cmlCase.cast : legacy.cast ?? [];

  // Extract essential information
  const title = meta?.title || "Untitled Mystery";
  // FA-5: meta.primary_axis not in CML 2.0 schema; false_assumption.type is the canonical field
  const primaryAxis = cmlCase.false_assumption?.type || meta?.primary_axis || "unknown";
  // FA-5: schema canonical order: subtype → category; setup.crime not in CML 2.0
  const crime = crimeClass.subtype || crimeClass.category || legacy.setup?.crime?.description || "crime";
  // FA-3: CML 2.0 has no setup.crime.victim field; victim info lives in hidden_model.outcome.result
  const culpritName =
    cmlCase.culpability?.culprits?.[0] || castList[0]?.name || "Unknown";
  // FB-3: extract all three false_assumption fields (schema: statement, why_it_seems_reasonable, what_it_hides)
  const falseAssumptionStatement =
    cmlCase.false_assumption?.statement || legacy.solution?.false_assumption?.description || "Unknown";
  const falseAssumptionWhyReasonable: string = cmlCase.false_assumption?.why_it_seems_reasonable ?? "";
  const falseAssumptionWhatHides: string = cmlCase.false_assumption?.what_it_hides ?? "";
  // FB-1: surface_model — the false narrative the reader is meant to accept
  const surfaceNarrative: string = cmlCase.surface_model?.narrative?.summary ?? "";
  const acceptedFacts: string[] = Array.isArray(cmlCase.surface_model?.accepted_facts)
    ? cmlCase.surface_model.accepted_facts as string[]
    : [];
  const inferredConclusions: string[] = Array.isArray(cmlCase.surface_model?.inferred_conclusions)
    ? cmlCase.surface_model.inferred_conclusions as string[]
    : [];
  // FB-2: hidden_model — the actual crime mechanism
  const hiddenMechanism: string = cmlCase.hidden_model?.mechanism?.description ?? "";
  const deliveryPath: string[] = Array.isArray(cmlCase.hidden_model?.mechanism?.delivery_path)
    ? (cmlCase.hidden_model.mechanism.delivery_path as any[]).map((d) => d.step ?? String(d))
    : [];
  const hiddenOutcome: string = cmlCase.hidden_model?.outcome?.result ?? "";

  // Inference path steps
  const inferenceSteps = (cmlCase.inference_path?.steps ?? legacy.inference_path?.steps ?? []).map(
    (step: any, idx: number) => {
      const observation = step.observation || "Observation"; // FA-2: removed duplicate + non-schema fallbacks (step.type not in schema)
      const correction = step.correction || "Correction";   // FA-1: removed non-schema step.reasoning fallback
      const effect = step.effect ? ` → ${step.effect}` : "";
      // FB-9: flag steps only visible to detective, not directly to reader
      const readerNote = step.reader_observable === false ? " *(detective reasoning only)*" : "";
      // FB-4: required_evidence is the direct per-step signal for Logical Deducibility
      const reqEvidence = Array.isArray(step.required_evidence) && step.required_evidence.length > 0
        ? `\n   **Required evidence**: ${(step.required_evidence as string[]).join("; ")}`
        : "";
      return `${idx + 1}. **${observation}**: ${correction}${effect}${readerNote}${reqEvidence}`;
    },
  );

  // Discriminating test
  const discrimTest = cmlCase.discriminating_test
    ? `**Method**: ${cmlCase.discriminating_test.method}\n**Design**: ${cmlCase.discriminating_test.design}\n**Reveals**: ${cmlCase.discriminating_test.knowledge_revealed}`
    : `**When**: ${legacy.inference_path?.discriminating_test?.when ?? "final act"}\n**What**: ${legacy.inference_path?.discriminating_test?.test ?? "N/A"}\n**Why**: ${legacy.inference_path?.discriminating_test?.reveals ?? "N/A"}`;

  const constraintSpace = cmlCase.constraint_space ?? legacy.constraint_space ?? {};
  const formatConstraintList = (value: any, keys: string[]) => {
    if (Array.isArray(value)) {
      return value.map((entry: any) => `- ${entry.description ?? entry}`).join("\n") || "None";
    }
    const lines = keys.flatMap((key) => (Array.isArray(value?.[key]) ? value[key] : []));
    return lines.map((entry: any) => `- ${entry.description ?? entry}`).join("\n") || "None";
  };
  const timeConstraints = formatConstraintList(constraintSpace.time, ["anchors", "windows", "contradictions"]);
  const accessConstraints = formatConstraintList(constraintSpace.access, ["actors", "objects", "permissions"]);
  const physicalConstraints = formatConstraintList(constraintSpace.physical, ["laws", "traces"]);
  // FB-5: social constraints (trust_channels, authority_sources) — absent from original
  const socialConstraints = formatConstraintList(constraintSpace.social, ["trust_channels", "authority_sources"]);
  // FB-6: CML fair_play self-assertion block — for cross-checking author declarations
  const fairPlayBlock = cmlCase.fair_play
    ? [
        `all_clues_visible: ${cmlCase.fair_play.all_clues_visible}`,
        `no_special_knowledge_required: ${cmlCase.fair_play.no_special_knowledge_required}`,
        `no_late_information: ${cmlCase.fair_play.no_late_information}`,
        `reader_can_solve: ${cmlCase.fair_play.reader_can_solve}`,
        `explanation: ${cmlCase.fair_play.explanation ?? "none"}`,
      ].join("\n")
    : "Not declared in CML";
  // FB-7: quality_controls — clue count gates and discriminating test timing
  const qc = cmlCase.quality_controls ?? {};
  const qcClueVis = qc.clue_visibility_requirements ?? {};
  const qcDiscrimTiming: string = qc.discriminating_test_requirements?.timing ?? "not specified";
  const qcEssentialMin = qcClueVis.essential_clues_min ?? "not specified";
  const qcEarlyMin = qcClueVis.early_clues_min ?? "not specified";
  const qcMidMin = qcClueVis.mid_clues_min ?? "not specified";
  const qcLateMin = qcClueVis.late_clues_min ?? "not specified";
  const qcEssentialBeforeTest = qcClueVis.essential_clues_before_test ?? "not specified";
  // FA-4: evidence_sensitivity items are plain strings in CML 2.0 (not objects with evidence_type/vulnerability)
  // FC-2: add alibi_window, access_plausibility, opportunity_channels per cast member for No Withholding check
  const castEvidence = castList
    .map((c: any) => {
      const evSensitivity = Array.isArray(c.evidence_sensitivity) && c.evidence_sensitivity.length > 0
        ? c.evidence_sensitivity
            .map((entry: unknown) => {
              if (typeof entry === "string") return entry;
              if (entry && typeof entry === "object") {
                const obj = entry as { evidence_type?: unknown; vulnerability?: unknown };
                const type = typeof obj.evidence_type === "string" ? obj.evidence_type : undefined;
                const vulnerability = typeof obj.vulnerability === "string" ? obj.vulnerability : undefined;
                if (type && vulnerability) return `${type}: ${vulnerability}`;
                if (vulnerability) return vulnerability;
                if (type) return type;
              }
              return "";
            })
            .filter((v: string) => v.length > 0)
            .join(", ") || "none"
        : "none";
      const alibi = c.alibi_window ?? "unknown";
      const access = c.access_plausibility ?? "unknown";
      const opportunities = Array.isArray(c.opportunity_channels) && c.opportunity_channels.length > 0
        ? (c.opportunity_channels as string[]).join("; ")
        : "none";
      return `- **${c.name}**: alibi="${alibi}" | access="${access}" | opportunities: ${opportunities} | evidence_sensitivity: ${evSensitivity}`;
    })
    .join("\n");

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
**Primary Axis / False Assumption Type**: ${primaryAxis}
**Crime**: ${crime}
**Culprit**: ${culpritName}

---

## Surface Model (What the Reader Is Meant to Believe)
**Narrative**: ${surfaceNarrative || "not specified"}

### Accepted Facts (reader takes these as given)
${acceptedFacts.map((f: string) => `- ${f}`).join("\n") || "None"}

### Inferred Conclusions (reader draws these from accepted facts)
${inferredConclusions.map((c: string) => `- ${c}`).join("\n") || "None"}

---

## Hidden Model (What Is Actually True)
**Mechanism**: ${hiddenMechanism || "not specified"}

### Delivery Path
${deliveryPath.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n") || "None"}

**Outcome**: ${hiddenOutcome || "not specified"}

---

## False Assumption
**Statement**: ${falseAssumptionStatement}
**Why it seems reasonable**: ${falseAssumptionWhyReasonable || "not specified"}
**What it hides**: ${falseAssumptionWhatHides || "not specified"}

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
${earlyClues.map((c) => `- [${c.criticality}] ${c.category}${c.supportsInferenceStep ? ` →step${c.supportsInferenceStep}` : ""}${c.evidenceType ? ` (${c.evidenceType})` : ""}: ${c.description}`).join("\n") || "None"}

### Mid Clues (Act II) - ${midClues.length} clues
${midClues.map((c) => `- [${c.criticality}] ${c.category}${c.supportsInferenceStep ? ` →step${c.supportsInferenceStep}` : ""}${c.evidenceType ? ` (${c.evidenceType})` : ""}: ${c.description}`).join("\n") || "None"}

### Late Clues (Act III) - ${lateClues.length} clues
${lateClues.map((c) => `- [${c.criticality}] ${c.category}${c.supportsInferenceStep ? ` →step${c.supportsInferenceStep}` : ""}${c.evidenceType ? ` (${c.evidenceType})` : ""}: ${c.description}`).join("\n") || "None"}

### Essential Clues (per inference step)
${essentialClues.map((c) => `- ${c.description} (${c.placement}${c.supportsInferenceStep ? `, step ${c.supportsInferenceStep}` : ""})`).join("\n") || "None"}

### Red Herrings
${redHerrings || "None"}

---

## Constraint Space
The mystery establishes these constraints:

### Temporal Constraints
${timeConstraints}

### Access Constraints
${accessConstraints}

### Physical Evidence
${physicalConstraints}

### Social Constraints
${socialConstraints}

---

## Cast — Alibi, Access & Evidence Sensitivity
${castEvidence || "None"}

---

## CML Fair Play Declarations
${fairPlayBlock}

---

## Quality Controls
**Discriminating test must appear**: ${qcDiscrimTiming}
**Essential clues minimum**: ${qcEssentialMin} | before discriminating test: ${qcEssentialBeforeTest}
**Clues per act minimum**: early=${qcEarlyMin}, mid=${qcMidMin}, late=${qcLateMin}

---

## Clue-to-Scene Mapping (when present)
${(() => {
  const mapping = (cmlCase as any).prose_requirements?.clue_to_scene_mapping;
  if (!Array.isArray(mapping) || mapping.length === 0) return "Not specified in CML";
  return mapping.map((m: any) => `- clue ${m.clue_id}: Act ${m.act_number}${m.scene_number ? `, Scene ${m.scene_number}` : ""}${m.delivery_method ? ` (${m.delivery_method})` : ""}`).join("\n");
})()}`;
}

function buildUserRequest(): string {
  return `# Fair Play Audit Task

Perform a rigorous fair play audit of this mystery. Analyze whether the reader can logically deduce the solution from the clues provided.

## Audit Checklist

1. **Clue Visibility**: Are all essential clues revealed before the discriminating test?
2. **Information Parity**: Does the reader have the same information as the detective?
3. **Special Knowledge**: Is any specialized knowledge required? If so, is it explained?
4. **Logical Deducibility**: Can the reader follow the inference path using only the clues provided?
5. **Discriminating Test Timing**: Does the discriminating test scene appear at the timing specified in the Quality Controls section above, and do all clues the test relies on appear in earlier scenes before it?
6. **No Withholding**: Are there any facts the detective knows but the reader doesn't? Cross-reference the Hidden Model and the cast alibi/access/opportunity data against the clue set.
7. **Constraint Consistency**: Do the clues align with the constraint space (time, access, physical evidence, social trust channels)?
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
  const response = await client.chat({
    messages: [
      { role: "system", content: prompt.system },
      { role: "developer", content: prompt.developer },
      { role: "user", content: prompt.user }
    ],
    temperature: 0.3, // Very low - consistent, rigorous auditing
    maxTokens: 2500, // Moderate - detailed audit report
    jsonMode: true,
    logContext: {
      runId: inputs.runId || "unknown",
      projectId: inputs.projectId || "unknown",
      agent: "Agent6-FairPlayAuditor"
    }
  });

  const durationMs = Date.now() - startTime;
  const costTracker = client.getCostTracker();
  const cost = costTracker.getSummary().byAgent["Agent6-FairPlayAuditor"] || 0;

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

// ============================================================================
// WP5: Blind Reader Simulation
// ============================================================================

export interface BlindReaderResult {
  suspectedCulprit: string;
  reasoning: string;
  confidenceLevel: "certain" | "likely" | "uncertain" | "impossible";
  missingInformation: string[];
  cost: number;
  durationMs: number;
}

export async function blindReaderSimulation(
  client: AzureOpenAIClient,
  clues: ClueDistributionResult,
  falseAssumption: string,
  castNames: string[],
  inputs: { runId?: string; projectId?: string }
): Promise<BlindReaderResult> {
  const startTime = Date.now();

  const system = "You are a careful reader of Golden Age detective fiction. You are reading a mystery " +
    "and trying to deduce who committed the crime. You will be given ONLY the clues presented in the " +
    "story. You do NOT know the solution, the inference path, or the detective reasoning. " +
    "You must work it out from the clues alone.";

  const clueList = clues.clues
    .slice()
    .sort((a, b) => {
      const order: Record<string, number> = { early: 0, mid: 1, late: 2 };
      return (order[a.placement] ?? 1) - (order[b.placement] ?? 1);
    })
    .map((c, i) => (i + 1) + ". [" + c.placement + "] " + c.description)
    .join("\n");

  const redHerringList = clues.redHerrings
    .map((rh, i) => (i + 1) + ". " + rh.description)
    .join("\n");

  const user = "Here are all the clues you encountered while reading this mystery:\n\n" +
    clueList + "\n\n" +
    (redHerringList ? "Additional observations:\n" + redHerringList + "\n\n" : "") +
    "The suspects are: " + castNames.join(", ") + "\n\n" +
    "The initial assumption is: \"" + falseAssumption + "\"\n\n" +
    "Based ONLY on these clues, who do you think committed the crime and why? " +
    "If you cannot determine the culprit, explain what information is missing.\n\n" +
    'Return JSON: { "suspectedCulprit": "name", "reasoning": "step by step", ' +
    '"confidenceLevel": "certain|likely|uncertain|impossible", ' +
    '"missingInformation": ["what you would need to know"] }';

  const response = await client.chat({
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.2,
    maxTokens: 1500,
    jsonMode: true,
    logContext: {
      runId: inputs.runId || "unknown",
      projectId: inputs.projectId || "unknown",
      agent: "Agent6-BlindReader",
    },
  });

  const durationMs = Date.now() - startTime;
  const costTracker = client.getCostTracker();
  const cost = costTracker.getSummary().byAgent["Agent6-BlindReader"] || 0;

  const result = JSON.parse(response.content);
  return { ...result, cost, durationMs };
}

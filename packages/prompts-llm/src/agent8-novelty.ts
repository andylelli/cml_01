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

import { parseLlmJson } from "./shared/llm-json.js";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { isVictimMember, verifiedFixesEnabled } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
import {
  AGENT8_CASE_POLICY,
  culpritMotiveSeedOf,
  projectCaseForPrompt,
  victimMemberOf,
} from "./shared/cml-prompt-view.js";
import type { PromptComponents } from "./types.js";

// ============================================================================
// Types
// ============================================================================

export interface NoveltyAuditInputs {
  generatedCML: CaseData;
  seedCMLs: CaseData[]; // All seed examples to compare against
  similarityThreshold?: number; // 0-1, default 0.9 (90% similarity = warning/fail window)
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
  /** Pillar 3: set to true by agent3-run when enableBindingGates and status is warning. */
  blocking: boolean;
  cost: number;
  durationMs: number;
}

// ============================================================================
// Prompt Builder
// ============================================================================

/**
 * A1X-12 — the novelty threshold policy, resolved once and read by BOTH the prompt and the verdict.
 *
 * The two used to compute it separately: the prompt hard-coded a +10-point fail band, the verdict read
 * `thresholds.fail_delta`. Under the shipped config (fail_delta 0.1) they state the same band, so both
 * now read `failDelta` from here. Two differences are KEPT, because removing either changes behaviour
 * (R2, not done): the prompt guards the threshold to (0,1) and falls back to 0.9 (`promptThreshold`)
 * while the verdict uses the configured value unguarded (`similarityThreshold`, where >= 1 means
 * "always pass"); and the prompt prints whole percentages (0.875 → 88% / 98%) while the verdict
 * compares the exact value (0.875 / 0.975).
 */
export interface NoveltyPolicy {
  /** The input's similarityThreshold, else the config default — unguarded; the verdict's threshold. */
  similarityThreshold: number;
  /** similarityThreshold when it lies strictly inside (0,1), else 0.9 — the threshold the prompt states. */
  promptThreshold: number;
  /** `thresholds.fail_delta` — the width of the warning band. */
  failDelta: number;
  /** The verdict's fail threshold: min(1, similarityThreshold + failDelta). */
  failThreshold: number;
}

/** The slice of `agent8_novelty.params` the policy reads. */
interface NoveltyThresholdConfig {
  thresholds: { similarity_threshold_default: number; fail_delta: number };
}

export function resolveNoveltyPolicy(
  inputs: Pick<NoveltyAuditInputs, "similarityThreshold">,
  config: NoveltyThresholdConfig = getGenerationParams().agent8_novelty.params,
): NoveltyPolicy {
  const similarityThreshold =
    typeof inputs.similarityThreshold === "number"
      ? inputs.similarityThreshold
      : config.thresholds.similarity_threshold_default;
  // Prevent invalid/out-of-range config from collapsing thresholds to 100%.
  const promptThreshold =
    Number.isFinite(similarityThreshold) && similarityThreshold > 0 && similarityThreshold < 1
      ? similarityThreshold
      : 0.9;
  const failDelta = config.thresholds.fail_delta;
  return { similarityThreshold, promptThreshold, failDelta, failThreshold: Math.min(1, similarityThreshold + failDelta) };
}

export function buildNoveltyPrompt(inputs: NoveltyAuditInputs): PromptComponents {
  const { generatedCML, seedCMLs } = inputs;
  const policy = resolveNoveltyPolicy(inputs);

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
  const user = buildUserRequest(policy.promptThreshold, policy.failDelta);

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
  // A1X-12 / A7-03: the shared header projection. Agent 8 keeps its older precedence (meta.primary_axis
  // first, setup.crime first) and the "Untitled" fallback — byte-preserving; see shared/cml-prompt-view.ts.
  const view = projectCaseForPrompt(cml, AGENT8_CASE_POLICY);
  const { legacy, cmlCase, meta, crimeClass, title, primaryAxis, era, crime, culpritName } = view;
  const eraDetails = Array.isArray(meta?.era?.realism_constraints)
    ? meta.era.realism_constraints.slice(0, 3).join(", ")
    : legacy.setup?.era?.key_details?.slice(0, 3).join(", ") || "";
  const castList = view.cast;
  // A1X-D03 (owner decision 12, CML_VERIFIED_FIXES): read the victim and motive from CML 2.0
  // (CASE.cast), not the CML-1.x setup/solution paths that summarised every case as "Unknown".
  const fixA1XD03 = verifiedFixesEnabled();
  const victimMember = fixA1XD03 ? victimMemberOf(view, isVictimMember) : undefined;
  const victim = (fixA1XD03 && typeof victimMember?.name === "string" && victimMember.name) || legacy.setup?.crime?.victim || "Unknown";
  const method = legacy.setup?.crime?.method || crimeClass.subtype || "Unknown";

  const castSummary = castList.map((c: any) => c.name || "Unknown").join(", ");
  const castCount = castList.length;

  const motive = (fixA1XD03 && culpritMotiveSeedOf(view, culpritName))
    || legacy.solution?.culprit?.motive || "Unknown";
  const mechanism = cmlCase.hidden_model?.mechanism?.description;
  const solutionMethod = (fixA1XD03 && typeof mechanism === "string" && mechanism.trim())
    || legacy.solution?.culprit?.method || crimeClass.subtype || "Unknown";
  const falseAssumption = view.falseAssumptionStatement;
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

  const inferenceSteps = view.inferenceSteps.length;

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

function buildUserRequest(similarityThreshold: number, failDelta: number): string {
  const thresholdPercent = Math.round(similarityThreshold * 100);
  // A1X-12: the fail band is config `fail_delta` (0.1 shipped = the +10 points this used to hard-code).
  const failPercent = Math.min(100, thresholdPercent + Math.round(failDelta * 100));

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
- **Warning**: Overall similarity ${thresholdPercent}-${failPercent}% for any seed
- **Fail**: Overall similarity > ${failPercent}% for any seed

## Quality Bar
- Justify high similarity scores with specific matched elements, not vague summaries.
- Differentiate acceptable structural reuse from disallowed content copying.
- Provide recommendations that meaningfully reduce future similarity risk.

## Micro-exemplars
- Weak warning: "Some similarities exist."
- Strong warning: "Character similarity 0.74 driven by mirrored role triangle (heiress-doctor-steward) and near-identical inheritance-conflict motive arc."

## Silent Pre-Output Checklist
- all similarity dimensions scored for each seed
- weighted overall similarity matches configured formula
- status matches threshold policy
- violations/warnings cite concrete matched elements
- JSON only, no markdown fences

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


const normTitle = (t: unknown): string => String(t ?? "").toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

/**
 * A_105 — keep only similarity rows that can be about a supplied seed. A row titled as the generated
 * mystery is the model scoring the candidate against itself (1.00 by construction); a row naming no
 * supplied seed, when seed titles are known, is an invention. Pure, so the case is pinned by a test.
 */
export const dropSelfAndUnknownSeeds = <T extends { seedTitle?: string }>(
  scores: T[],
  seedTitles: string[],
  generatedTitle: string,
): { kept: T[]; dropped: string[] } => {
  const self = normTitle(generatedTitle);
  const known = new Set(seedTitles.map(normTitle).filter((t) => t.length > 0));
  const kept: T[] = [];
  const dropped: string[] = [];
  for (const row of scores) {
    const t = normTitle(row.seedTitle);
    const isSelf = self.length > 0 && t === self;
    const unknown = known.size > 0 && t.length > 0 && !known.has(t);
    if (isSelf || unknown) dropped.push(String(row.seedTitle ?? "")); else kept.push(row);
  }
  return { kept, dropped };
};

export async function auditNovelty(
  client: AzureOpenAIClient,
  inputs: NoveltyAuditInputs
): Promise<NoveltyAuditResult> {
  const config = getGenerationParams().agent8_novelty.params;
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
    temperature: config.model.temperature,
    maxTokens: config.model.max_tokens,
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

  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  const computeOverallSimilarity = (score: SimilarityScore) =>
    config.weighting.plot * score.plotSimilarity
    + config.weighting.character * score.characterSimilarity
    + config.weighting.setting * score.settingSimilarity
    + config.weighting.solution * score.solutionSimilarity
    + config.weighting.structural * score.structuralSimilarity;

  // Parse the novelty result
  // A1X-D09: this parse was strict only, and its throw leaves runAgent3 — a sloppy but complete payload
  // (a trailing comma) aborted the run. The guarded ladder repairs that; a truncated payload is still
  // refused, and a failure throws the message it always did.
  const parsedJson = parseLlmJson<Omit<NoveltyAuditResult, "cost" | "durationMs">>(response.content, { guard: true });
  if (parsedJson.data === undefined) throw new Error(`Failed to parse novelty audit JSON: ${parsedJson.parseError}`);
  const noveltyData = parsedJson.data;

  // Validate required fields
  if (!noveltyData.status || !noveltyData.similarityScores || !noveltyData.summary) {
    throw new Error("Invalid novelty audit result: missing required fields (status, similarityScores, summary)");
  }

  // A1X-12: the same policy the prompt stated (the verdict keeps the unguarded threshold — see NoveltyPolicy).
  const { similarityThreshold, failThreshold } = resolveNoveltyPolicy(inputs, config);

  // A_105: the model can echo the GENERATED mystery back as a "seed" at 1.00 (seed 18179 did, and
  // the binding gate blocked the run on it). Its own verdict ignored that row; the maximum below did
  // not. Drop self-titled rows, and rows naming no supplied seed when seed titles are known.
  const dropped = dropSelfAndUnknownSeeds(
    noveltyData.similarityScores,
    inputs.seedCMLs.map((c: any) => String(c?.CASE?.meta?.title ?? "")),
    String((inputs.generatedCML as any)?.CASE?.meta?.title ?? ""),
  );
  const keptScores = dropped.kept.length > 0 ? dropped.kept : noveltyData.similarityScores;
  if (dropped.dropped.length > 0) {
    noveltyData.warnings = [
      ...dropped.dropped.map((t) => `Novelty audit: ignored a similarity row titled "${t}" — the generated mystery itself, or no supplied seed`),
      ...(Array.isArray(noveltyData.warnings) ? noveltyData.warnings : []),
    ];
  }

  const normalizedScores = keptScores.map((score) => {
    const normalized: SimilarityScore = {
      ...score,
      overallSimilarity: clamp(score.overallSimilarity),
      plotSimilarity: clamp(score.plotSimilarity),
      characterSimilarity: clamp(score.characterSimilarity),
      settingSimilarity: clamp(score.settingSimilarity),
      solutionSimilarity: clamp(score.solutionSimilarity),
      structuralSimilarity: clamp(score.structuralSimilarity),
    };
    return {
      ...normalized,
      overallSimilarity: computeOverallSimilarity(normalized),
    };
  });

  const highestSimilarity = normalizedScores.reduce((max, score) => Math.max(max, score.overallSimilarity), 0);
  const mostSimilarSeed = normalizedScores.find((score) => score.overallSimilarity === highestSimilarity)?.seedTitle
    ?? normalizedScores[0]?.seedTitle
    ?? "Unknown";
  const overallNovelty = clamp(1 - highestSimilarity);

  let status: "pass" | "fail" | "warning" = "pass";
  if (similarityThreshold >= 1) {
    status = "pass";
  } else if (highestSimilarity >= failThreshold) {
    status = "fail";
  } else if (highestSimilarity >= similarityThreshold) {
    status = "warning";
  }

  const topScore = normalizedScores.find((score) => score.seedTitle === mostSimilarSeed) ?? normalizedScores[0];
  const weights = {
    plot: config.weighting.plot,
    character: config.weighting.character,
    setting: config.weighting.setting,
    solution: config.weighting.solution,
    structural: config.weighting.structural,
  };

  await client.getLogger().logResponse({
    runId: inputs.runId || "unknown",
    projectId: inputs.projectId || "unknown",
    agent: "Agent8-NoveltyAuditor",
    operation: "novelty_math",
    model: "n/a",
    success: true,
    timestamp: new Date().toISOString(),
    metadata: {
      weights,
      similarityThreshold,
      failThreshold,
      mostSimilarSeed,
      highestSimilarity,
      overallNovelty,
      topScore: topScore
        ? {
            seedTitle: topScore.seedTitle,
            overallSimilarity: topScore.overallSimilarity,
            plotSimilarity: topScore.plotSimilarity,
            characterSimilarity: topScore.characterSimilarity,
            settingSimilarity: topScore.settingSimilarity,
            solutionSimilarity: topScore.solutionSimilarity,
            structuralSimilarity: topScore.structuralSimilarity,
          }
        : null,
    },
  });

  return {
    ...noveltyData,
    status,
    overallNovelty,
    mostSimilarSeed,
    highestSimilarity,
    similarityScores: normalizedScores,
    blocking: false,
    cost,
    durationMs,
  };
}

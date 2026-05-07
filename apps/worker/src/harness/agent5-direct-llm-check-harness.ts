import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { validateCml, type CaseData } from "@cml/cml";
import { AzureOpenAIClient, LLMLogger, type LogLevel } from "@cml/llm-client";
import {
  buildCluePrompt,
  type ClueDistributionResult,
  type ClueExtractionInputs,
} from "@cml/prompts-llm";
import {
  enforceAgent5DeterministicContracts,
  recomputeCoverageSnapshotForAgent6,
} from "../jobs/agents/agent5-run.js";
import { applyClueGuardrails } from "../jobs/agents/shared.js";

type CliArgs = {
  cmlPath: string;
  clueDensity: "minimal" | "moderate" | "dense";
  redHerringBudget: number;
  temperature: number;
  maxTokens: number;
  model?: string;
  runId: string;
  projectId: string;
  promptFilePath?: string;
  fairPlayFeedbackPath?: string;
  outputPath?: string;
  strictCmlValidation: boolean;
};

type HarnessResult = {
  harness: {
    timestamp: string;
    runId: string;
    projectId: string;
    model?: string;
    clueDensity: "minimal" | "moderate" | "dense";
    redHerringBudget: number;
    temperature: number;
    maxTokens: number;
    promptSource: "generated" | "replayed";
    promptFilePath?: string;
    cmlPath: string;
  };
  cmlValidation: {
    valid: boolean;
    errors: string[];
  };
  prompt: {
    system: string;
    developer: string;
    user: string;
  };
  llm: {
    latencyMs: number;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    rawContent: string;
    parsed: unknown;
  };
  normalizedClues: {
    clueCount: number;
    redHerringCount: number;
    status?: string;
    audit?: unknown;
    clueTimeline: {
      early: string[];
      mid: string[];
      late: string[];
    };
  };
  checks: {
    guardrails: {
      hasCriticalIssues: boolean;
      issues: Array<{ severity: string; message: string }>;
      fixes: string[];
    };
    deterministicContracts: {
      passed: boolean;
      warnings: string[];
      error?: string;
    };
    coverageSnapshot: {
      hasCriticalCoverageIssues: boolean;
      uncoveredSteps: number[];
      criticalIssues: string[];
      allIssues: string[];
    };
  };
  pass: boolean;
};

type NormalizedClue = {
  id: string;
  category: "temporal" | "spatial" | "physical" | "behavioral" | "testimonial";
  description: string;
  sourceInCML: string;
  pointsTo: string;
  placement: "early" | "mid" | "late";
  criticality: "essential" | "supporting" | "optional";
  supportsInferenceStep?: number;
  evidenceType?: "observation" | "contradiction" | "elimination";
};

type NormalizedRedHerring = {
  id: string;
  description: string;
  supportsAssumption: string;
  misdirection: string;
};

type PromptMessages = {
  system: string;
  developer: string;
  user: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workerRoot = path.resolve(__dirname, "..", "..");
const repoRoot = path.resolve(workerRoot, "..", "..");

const printUsage = (): void => {
  // eslint-disable-next-line no-console
  console.log(
    [
      "Agent5 Direct LLM Harness",
      "",
      "Usage:",
      "  npm run -w @cml/worker harness:agent5:direct -- --cml <path-to-cml.json> [options]",
      "",
      "Required:",
      "  --cml <path>                     Path to CML JSON file",
      "",
      "Options:",
      "  --density <minimal|moderate|dense>   Default: minimal",
      "  --redHerrings <number>               Default: 2",
      "  --temperature <number>               Default: 0.4",
      "  --maxTokens <number>                 Default: 3000",
      "  --model <deployment-name>            Default: AZURE_OPENAI_DEPLOYMENT_NAME",
      "  --runId <id>                         Default: harness-<timestamp>",
      "  --projectId <id>                     Default: harness-project",
      "  --promptFile <path>                  Optional markdown file containing Message 1/2/3 blocks",
      "  --fairPlayFeedback <path>            Optional JSON file used as fairPlayFeedback input",
      "  --out <path>                         Optional output JSON path",
      "  --allowInvalidCml                    Continue even if validateCml fails",
      "  --help                               Show this help",
    ].join("\n"),
  );
};

const parseArgs = (argv: string[]): CliArgs => {
  const getArg = (name: string): string | undefined => {
    const idx = argv.indexOf(name);
    if (idx < 0) return undefined;
    return argv[idx + 1];
  };

  if (argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const cmlPath = getArg("--cml");
  if (!cmlPath) {
    throw new Error("Missing required --cml argument.");
  }

  const densityRaw = (getArg("--density") ?? "minimal").toLowerCase();
  if (!["minimal", "moderate", "dense"].includes(densityRaw)) {
    throw new Error(`Invalid --density value: ${densityRaw}`);
  }

  const redHerringBudget = Number(getArg("--redHerrings") ?? "2");
  if (!Number.isInteger(redHerringBudget) || redHerringBudget < 0) {
    throw new Error(`Invalid --redHerrings value: ${String(getArg("--redHerrings"))}`);
  }

  const temperature = Number(getArg("--temperature") ?? "0.4");
  if (!Number.isFinite(temperature) || temperature < 0 || temperature > 2) {
    throw new Error(`Invalid --temperature value: ${String(getArg("--temperature"))}`);
  }

  const maxTokens = Number(getArg("--maxTokens") ?? "3000");
  if (!Number.isInteger(maxTokens) || maxTokens <= 0) {
    throw new Error(`Invalid --maxTokens value: ${String(getArg("--maxTokens"))}`);
  }

  const now = new Date();
  const timestamp = now.toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);

  return {
    cmlPath,
    clueDensity: densityRaw as "minimal" | "moderate" | "dense",
    redHerringBudget,
    temperature,
    maxTokens,
    model: getArg("--model"),
    runId: getArg("--runId") ?? `harness-${timestamp}`,
    projectId: getArg("--projectId") ?? "harness-project",
    promptFilePath: getArg("--promptFile"),
    fairPlayFeedbackPath: getArg("--fairPlayFeedback"),
    outputPath: getArg("--out"),
    strictCmlValidation: !argv.includes("--allowInvalidCml"),
  };
};

const loadEnv = (): void => {
  const candidates = [
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env"),
    path.resolve(repoRoot, ".env.local"),
    path.resolve(repoRoot, ".env"),
  ];

  for (const candidate of candidates) {
    dotenv.config({ path: candidate, override: false });
  }
};

const loadJsonFile = async (filePath: string): Promise<unknown> => {
  const abs = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  const raw = await readFile(abs, "utf8");
  return JSON.parse(raw);
};

const stripMarkdownFences = (raw: string): string => {
  const trimmed = raw.trim();
  if (!trimmed.startsWith("```")) return raw;
  return trimmed
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
};

const parseModelJson = (raw: string): unknown => {
  const firstAttempt = stripMarkdownFences(raw);
  try {
    return JSON.parse(firstAttempt);
  } catch {
    throw new Error("Model response was not valid JSON.");
  }
};

const parsePromptMarkdown = (raw: string): PromptMessages => {
  const messageHeadingRegex = /^#{2,3}\s+Message\s+\d+\s+\(([^)]+)\)\s*$/gim;
  const headings = [...raw.matchAll(messageHeadingRegex)];
  if (headings.length === 0) {
    throw new Error("Prompt file did not contain any Message headings.");
  }

  const getMessageBody = (targetRole: "system" | "developer" | "user"): string => {
    for (let i = 0; i < headings.length; i += 1) {
      const descriptor = String(headings[i][1] ?? "")
        .toLowerCase()
        .replace(/\s+/g, "");
      const isRoleMatch = descriptor === targetRole || descriptor === `role=${targetRole}`;
      if (!isRoleMatch) continue;

      const start = (headings[i].index ?? 0) + headings[i][0].length;
      const end = i + 1 < headings.length
        ? (headings[i + 1].index ?? raw.length)
        : raw.length;
      const section = raw.slice(start, end);
      const codeBlock = section.match(/```(?:text|markdown|md)?\s*\r?\n([\s\S]*?)\r?\n```/i);
      if (!codeBlock) {
        throw new Error(`Prompt file Message (${targetRole}) is missing a fenced code block.`);
      }
      return codeBlock[1].trim();
    }

    throw new Error(`Prompt file is missing Message (${targetRole}).`);
  };

  return {
    system: getMessageBody("system"),
    developer: getMessageBody("developer"),
    user: getMessageBody("user"),
  };
};

const loadPromptMessagesFromFile = async (filePath: string): Promise<PromptMessages> => {
  const abs = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
  const raw = await readFile(abs, "utf8");
  return parsePromptMarkdown(raw);
};

const inferStepFromSourcePath = (sourceInCML: string): number | undefined => {
  const match = String(sourceInCML ?? "").match(/CASE\.inference_path\.steps\[(\d+)\]\./);
  if (!match) return undefined;
  const idx = Number(match[1]);
  if (!Number.isInteger(idx) || idx < 0) return undefined;
  return idx + 1;
};

const inferEvidenceType = (clue: any): "observation" | "contradiction" | "elimination" => {
  const explicit = String(clue?.evidenceType ?? "").toLowerCase();
  if (explicit === "observation" || explicit === "contradiction" || explicit === "elimination") {
    return explicit;
  }

  const source = String(clue?.sourceInCML ?? "");
  if (/\.correction$/.test(source)) return "contradiction";

  const text = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`.toLowerCase();
  if (/\b(eliminat|ruled\s+out|excluded|cleared|innocent)\b/.test(text)) return "elimination";

  return "observation";
};

const normalizeDistribution = (
  parsed: any,
  redHerringBudget: number,
  latencyMs: number,
  cost: number,
): ClueDistributionResult & { status?: "pass" | "fail"; audit?: unknown } => {
  const normalizedClues = Array.isArray(parsed?.clues) ? parsed.clues : [];
  const normalizedRedHerrings = Array.isArray(parsed?.redHerrings) ? parsed.redHerrings : [];

  const clues: NormalizedClue[] = normalizedClues.map((clue: any, index: number) => {
    const inferredStep = inferStepFromSourcePath(String(clue?.sourceInCML ?? ""));
    const supportsInferenceStep = Number(clue?.supportsInferenceStep);

    const categoryRaw = String(clue?.category ?? "testimonial").toLowerCase();
    const category = (["temporal", "spatial", "physical", "behavioral", "testimonial"] as const)
      .includes(categoryRaw as any)
      ? (categoryRaw as "temporal" | "spatial" | "physical" | "behavioral" | "testimonial")
      : "testimonial";

    const placementRaw = String(clue?.placement ?? "mid").toLowerCase();
    const placement = (["early", "mid", "late"] as const).includes(placementRaw as any)
      ? (placementRaw as "early" | "mid" | "late")
      : "mid";

    const criticalityRaw = String(clue?.criticality ?? "supporting").toLowerCase();
    const criticality = (["essential", "supporting", "optional"] as const).includes(criticalityRaw as any)
      ? (criticalityRaw as "essential" | "supporting" | "optional")
      : "supporting";

    return {
      id: String(clue?.id ?? `clue_${index + 1}`),
      category,
      description: String(clue?.description ?? ""),
      sourceInCML: String(clue?.sourceInCML ?? ""),
      pointsTo: String(clue?.pointsTo ?? ""),
      placement,
      criticality,
      supportsInferenceStep: Number.isInteger(supportsInferenceStep) && supportsInferenceStep > 0
        ? supportsInferenceStep
        : inferredStep,
      evidenceType: inferEvidenceType(clue),
    };
  });

  const redHerrings: NormalizedRedHerring[] = normalizedRedHerrings.map((rh: any, index: number) => ({
    id: String(rh?.id ?? `rh_${index + 1}`),
    description: String(rh?.description ?? ""),
    supportsAssumption: String(rh?.supportsAssumption ?? ""),
    misdirection: String(rh?.misdirection ?? ""),
  }));

  const clueTimeline = {
    early: clues.filter((c: NormalizedClue) => c.placement === "early").map((c: NormalizedClue) => c.id),
    mid: clues.filter((c: NormalizedClue) => c.placement === "mid").map((c: NormalizedClue) => c.id),
    late: clues.filter((c: NormalizedClue) => c.placement === "late").map((c: NormalizedClue) => c.id),
  };

  const essentialClues = clues.filter((c: NormalizedClue) => c.criticality === "essential");
  const fairPlayChecks = {
    allEssentialCluesPresent: essentialClues.length >= 3,
    noNewFactsIntroduced: clues.every((c: NormalizedClue) => c.sourceInCML && c.sourceInCML.trim() !== "" && c.sourceInCML !== "N/A"),
    redHerringsDontBreakLogic: redHerrings.length <= redHerringBudget,
  };

  const statusRaw = String(parsed?.status ?? "").toLowerCase();
  const status = statusRaw === "pass" || statusRaw === "fail"
    ? (statusRaw as "pass" | "fail")
    : undefined;

  return {
    clues,
    redHerrings,
    clueTimeline,
    fairPlayChecks,
    latencyMs,
    cost,
    status,
    audit: parsed?.audit,
  };
};

const toAbsPath = (value: string): string => (
  path.isAbsolute(value) ? value : path.resolve(process.cwd(), value)
);

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  loadEnv();

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
  const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
  if (!endpoint || !apiKey) {
    throw new Error("Missing Azure credentials. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY.");
  }

  const cmlPayload = await loadJsonFile(args.cmlPath);
  const cmlValidation = validateCml(cmlPayload);
  if (!cmlValidation.valid && args.strictCmlValidation) {
    throw new Error(`CML validation failed: ${cmlValidation.errors.join("; ")}`);
  }

  const fairPlayFeedback = args.fairPlayFeedbackPath
    ? (await loadJsonFile(args.fairPlayFeedbackPath) as any)
    : undefined;

  const logger = new LLMLogger({
    logLevel: process.env.LOG_LEVEL as LogLevel | undefined,
    logToConsole: true,
    logToFile: true,
    logFilePath: process.env.LOG_FILE_PATH || "apps/api/logs/llm.jsonl",
  });

  const client = new AzureOpenAIClient({
    endpoint,
    apiKey,
    defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini",
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-10-21",
    requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE || 60),
    logger,
  });

  const prompt: PromptMessages = args.promptFilePath
    ? await loadPromptMessagesFromFile(args.promptFilePath)
    : buildCluePrompt({
      cml: cmlPayload as Record<string, unknown>,
      clueDensity: args.clueDensity,
      redHerringBudget: args.redHerringBudget,
      fairPlayFeedback,
      runId: args.runId,
      projectId: args.projectId,
    } as ClueExtractionInputs);

  const started = Date.now();
  const llmResponse = await client.chat({
    messages: [
      { role: "system", content: prompt.system },
      { role: "developer", content: prompt.developer },
      { role: "user", content: prompt.user },
    ],
    model: args.model,
    temperature: args.temperature,
    maxTokens: args.maxTokens,
    jsonMode: true,
    logContext: {
      runId: args.runId,
      projectId: args.projectId,
      agent: "Agent5-DirectHarness",
      retryAttempt: 1,
    },
  });

  const parsed = parseModelJson(llmResponse.content);
  const costSummary = client.getCostTracker().getSummary();
  const latencyMs = Date.now() - started;
  const agentCost = costSummary.byAgent["Agent5-DirectHarness"] || 0;

  const normalized = normalizeDistribution(parsed, args.redHerringBudget, latencyMs, agentCost);

  const guardrailResult = applyClueGuardrails(cmlPayload as CaseData, normalized as ClueDistributionResult);

  let deterministicWarnings: string[] = [];
  let deterministicError: string | undefined;
  try {
    const deterministic = enforceAgent5DeterministicContracts(
      cmlPayload as CaseData,
      normalized as ClueDistributionResult,
    );
    deterministicWarnings = deterministic.warnings;
  } catch (error) {
    deterministicError = (error as Error).message;
  }

  const coverageSnapshot = recomputeCoverageSnapshotForAgent6(
    cmlPayload as CaseData,
    normalized as ClueDistributionResult,
  );

  const criticalCoverageIssues = coverageSnapshot.allCoverageIssues
    .filter((issue) => issue.severity === "critical")
    .map((issue) => issue.message);

  const pass = !guardrailResult.hasCriticalIssues
    && !deterministicError
    && criticalCoverageIssues.length === 0;

  const result: HarnessResult = {
    harness: {
      timestamp: new Date().toISOString(),
      runId: args.runId,
      projectId: args.projectId,
      model: args.model || process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
      clueDensity: args.clueDensity,
      redHerringBudget: args.redHerringBudget,
      temperature: args.temperature,
      maxTokens: args.maxTokens,
      promptSource: args.promptFilePath ? "replayed" : "generated",
      promptFilePath: args.promptFilePath ? toAbsPath(args.promptFilePath) : undefined,
      cmlPath: toAbsPath(args.cmlPath),
    },
    cmlValidation: {
      valid: cmlValidation.valid,
      errors: cmlValidation.errors,
    },
    prompt: {
      system: prompt.system,
      developer: prompt.developer,
      user: prompt.user,
    },
    llm: {
      latencyMs,
      usage: {
        promptTokens: llmResponse.usage.promptTokens,
        completionTokens: llmResponse.usage.completionTokens,
        totalTokens: llmResponse.usage.totalTokens,
      },
      rawContent: llmResponse.content,
      parsed,
    },
    normalizedClues: {
      clueCount: normalized.clues.length,
      redHerringCount: normalized.redHerrings.length,
      status: normalized.status,
      audit: normalized.audit,
      clueTimeline: normalized.clueTimeline,
    },
    checks: {
      guardrails: {
        hasCriticalIssues: guardrailResult.hasCriticalIssues,
        issues: guardrailResult.issues,
        fixes: guardrailResult.fixes,
      },
      deterministicContracts: {
        passed: !deterministicError,
        warnings: deterministicWarnings,
        error: deterministicError,
      },
      coverageSnapshot: {
        hasCriticalCoverageIssues: criticalCoverageIssues.length > 0,
        uncoveredSteps: coverageSnapshot.coverageResult.uncoveredSteps,
        criticalIssues: criticalCoverageIssues,
        allIssues: coverageSnapshot.allCoverageIssues.map((issue) => issue.message),
      },
    },
    pass,
  };

  const outPath = args.outputPath
    ? toAbsPath(args.outputPath)
    : path.resolve(
      repoRoot,
      "apps",
      "worker",
      "logs",
      `${args.promptFilePath ? "agent5-direct-harness-replay" : "agent5-direct-harness"}-${args.runId}.json`,
    );

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(result, null, 2), "utf8");

  // eslint-disable-next-line no-console
  console.log("Agent5 direct harness completed");
  // eslint-disable-next-line no-console
  console.log(`pass=${String(pass)} guardrailsCritical=${String(guardrailResult.hasCriticalIssues)} deterministicError=${deterministicError ? "yes" : "no"} coverageCritical=${String(criticalCoverageIssues.length)}`);
  // eslint-disable-next-line no-console
  console.log(`output=${outPath}`);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(`Harness failed: ${(error as Error).message}`);
  process.exitCode = 1;
});

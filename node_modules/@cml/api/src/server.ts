import express from "express";
import cors from "cors";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRepository } from "./db.js";
import { validateCml } from "@cml/cml";
import { AzureOpenAIClient, LLMLogger, LogLevel } from "@cml/llm-client";
import { generateCharacterProfiles } from "@cml/prompts-llm";
import { generateMystery } from "@cml/worker/jobs/mystery-orchestrator.js";
import type { MysteryGenerationInputs } from "@cml/worker/jobs/mystery-orchestrator.js";

const ALLOWED_CML_MODES = new Set(["advanced", "expert"] as const);

type CmlMode = "user" | "advanced" | "expert";

type ModeRequest = express.Request & { cmlMode?: CmlMode };

type ModeResponse = express.Response;

type ModeNext = express.NextFunction;

const withMode = (req: ModeRequest, _res: ModeResponse, next: ModeNext) => {
  const headerMode = (req.header("x-cml-mode") || "user").toLowerCase();
  const mode: CmlMode = headerMode === "advanced" || headerMode === "expert" ? headerMode : "user";
  req.cmlMode = mode;
  next();
};

const isAllowedCmlMode = (mode?: CmlMode): mode is "advanced" | "expert" =>
  mode === "advanced" || mode === "expert";

const requireCmlAccess = (req: ModeRequest, res: ModeResponse, next: ModeNext) => {
  if (isAllowedCmlMode(req.cmlMode) && ALLOWED_CML_MODES.has(req.cmlMode)) {
    next();
    return;
  }

  res.status(403).json({
    error: "CML access requires Advanced or Expert mode",
    mode: req.cmlMode ?? "user",
  });
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const examplesDir = path.resolve(__dirname, "../../..", "examples");

const listSampleFiles = async () => {
  const files = await fs.readdir(examplesDir);
  return files.filter((file) => file.endsWith(".yaml") || file.endsWith(".yml"));
};

const getSampleId = (filename: string) => filename.replace(/\.(yaml|yml)$/i, "");

const toTitle = (id: string) =>
  id
    .replace(/_cml2$/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const escapePdfText = (value: string) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const sanitizePdfLine = (value: unknown) => {
  const text = typeof value === "string" ? value : value == null ? "" : String(value);
  return text.replace(/\r?\n/g, " ").replace(/\t/g, " ");
};
const wrapPdfLine = (value: string, maxLength = 92) => {
  const words = value.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [""];
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if (!current) {
      current = word;
      continue;
    }

    if (`${current} ${word}`.length <= maxLength) {
      current = `${current} ${word}`;
      continue;
    }

    lines.push(current);
    current = word;
  }

  if (current) lines.push(current);
  return lines;
};
type PdfLine = { text: string; size: number; leading: number };

const wrapPdfLineSized = (value: string, size: number) => {
  const base = 92;
  const maxLength = Math.max(40, Math.floor((base * 12) / size));
  return wrapPdfLine(value, maxLength);
};

const markdownToPdfLines = (markdown: string): PdfLine[] => {
  const rawLines = markdown.split(/\r?\n/);
  const lines: PdfLine[] = [];

  const pushWrapped = (text: string, size: number) => {
    const cleaned = sanitizePdfLine(text);
    const wrapped = cleaned ? wrapPdfLineSized(cleaned, size) : [""];
    wrapped.forEach((line) => {
      lines.push({ text: line, size, leading: size + 4 });
    });
  };

  for (const raw of rawLines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      lines.push({ text: "", size: 12, leading: 16 });
      continue;
    }

    if (line.startsWith("### ")) {
      pushWrapped(line.replace(/^###\s+/, ""), 14);
      continue;
    }
    if (line.startsWith("## ")) {
      pushWrapped(line.replace(/^##\s+/, ""), 16);
      continue;
    }
    if (line.startsWith("# ")) {
      pushWrapped(line.replace(/^#\s+/, ""), 20);
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      pushWrapped(`• ${line.replace(/^[-*]\s+/, "")}`, 12);
      continue;
    }

    pushWrapped(line, 12);
  }

  return lines;
};

const paginatePdfLines = (lines: PdfLine[], startY = 720, bottomY = 72) => {
  const pages: PdfLine[][] = [];
  let current: PdfLine[] = [];
  let y = startY;

  lines.forEach((line) => {
    if (y - line.leading < bottomY) {
      pages.push(current);
      current = [];
      y = startY;
    }
    current.push(line);
    y -= line.leading;
  });

  if (current.length) pages.push(current);
  return pages.length ? pages : [[]];
};

const buildPdfFromLinePages = (pages: PdfLine[][]) => {
  const contentStreams = pages.map((pageLines) => {
    const commands: string[] = ["BT", "/F1 12 Tf", "72 720 Td", "16 TL"];
    pageLines.forEach((line) => {
      commands.push(`/F1 ${line.size} Tf`);
      commands.push(`${line.leading} TL`);
      commands.push(`(${escapePdfText(line.text)}) Tj`);
      commands.push(`0 -${line.leading} Td`);
    });
    commands.push("ET");
    return commands.join("\n");
  });

  const objects: string[] = [];
  const pageCount = pages.length;
  const pageObjectStart = 3;
  const contentObjectStart = pageObjectStart + pageCount;
  const fontObjectNum = contentObjectStart + pageCount;

  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  const kids = Array.from({ length: pageCount }, (_, idx) => `${pageObjectStart + idx} 0 R`).join(" ");
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>\nendobj`);

  for (let i = 0; i < pageCount; i += 1) {
    const pageObjNum = pageObjectStart + i;
    const contentObjNum = contentObjectStart + i;
    objects.push(
      `${pageObjNum} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentObjNum} 0 R /Resources << /Font << /F1 ${fontObjectNum} 0 R >> >> >>\nendobj`
    );
  }

  contentStreams.forEach((stream, i) => {
    const contentObjNum = contentObjectStart + i;
    objects.push(`${contentObjNum} 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`);
  });

  objects.push(`${fontObjectNum} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`);

  let offset = 0;
  const xref: string[] = ["0000000000 65535 f "];
  const body = objects
    .map((obj) => {
      const entry = obj + "\n";
      const current = offset;
      offset += entry.length;
      xref.push(`${String(current).padStart(10, "0")} 00000 n `);
      return entry;
    })
    .join("");

  const header = "%PDF-1.4\n";
  const xrefStart = header.length + body.length;
  const xrefTable = `xref\n0 ${xref.length}\n${xref.join("\n")}\n`;
  const trailer = `trailer\n<< /Size ${xref.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  const pdf = header + body + xrefTable + trailer;
  return Buffer.from(pdf, "utf-8");
};

const buildGamePackPdf = (gamePack: Record<string, unknown>) => {
  const title = (gamePack.title as string) ?? "Mystery Game Pack";
  const suspects = Array.isArray(gamePack.suspects) ? (gamePack.suspects as string[]) : [];
  const hostPacket = (gamePack.hostPacket as Record<string, unknown>) ?? {};
  const materials = Array.isArray(gamePack.materials) ? (gamePack.materials as string[]) : [];

  const markdown = [
    `# ${title}`,
    "",
    "## Suspects",
    ...(suspects.length ? suspects.map((suspect) => `- ${suspect}`) : ["- No suspects available yet."]),
    "",
    "## Host Packet",
    (hostPacket.summary as string) ?? "Host packet summary pending.",
    `Culprit count: ${hostPacket.culpritCount ?? 1}`,
    "",
    "## Materials",
    ...(materials.length ? materials.map((material) => `- ${material}`) : ["- No materials listed yet."]),
  ].join("\n");

  const lines = markdownToPdfLines(markdown);
  const pages = paginatePdfLines(lines);
  return buildPdfFromLinePages(pages);
};

const buildProsePdf = (prose: Record<string, unknown>, fallbackTitle?: string) => {
  const title = sanitizePdfLine(
    (prose.title as string) || (prose.note as string) || fallbackTitle || "Mystery Story"
  );
  const chapters = Array.isArray(prose.chapters) ? (prose.chapters as Array<Record<string, unknown>>) : [];

  const proseLines: string[] = [`# ${title}`, "", "## Chapters"];
  if (!chapters.length) {
    proseLines.push("", "No story chapters available yet.");
  }

  chapters.forEach((chapter, index) => {
    const chapterTitle = sanitizePdfLine((chapter.title as string) || `Chapter ${index + 1}`);
    proseLines.push("", `### ${chapterTitle}`);
    const summary = sanitizePdfLine(chapter.summary as string | undefined);
    if (summary) {
      proseLines.push(`Summary: ${summary}`);
      proseLines.push("");
    }
    const paragraphs = Array.isArray(chapter.paragraphs) ? chapter.paragraphs : [];
    paragraphs.forEach((para, idx) => {
      const cleaned = sanitizePdfLine(para);
      if (cleaned) {
        proseLines.push(cleaned);
      }
      if (idx < paragraphs.length - 1) {
        proseLines.push("");
      }
    });
  });

  const lines = markdownToPdfLines(proseLines.join("\n"));
  const pages = paginatePdfLines(lines);
  return buildPdfFromLinePages(pages);
};

const parseEnvBool = (value: string | undefined, defaultValue: boolean) => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
};

const buildLlmClient = () => {
  const config = {
    endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
    apiKey: process.env.AZURE_OPENAI_API_KEY || "",
    defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini",
    apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-10-21",
    requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE || 60),
    logger: buildLlmLogger(),
  };

  if (!config.endpoint || !config.apiKey) {
    return null;
  }

  return new AzureOpenAIClient(config);
};

const normalizeCastForProfiles = (castPayload: Record<string, unknown>) => {
  const cast = (castPayload as any)?.cast ?? castPayload;
  const characters = Array.isArray(cast?.characters)
    ? cast.characters
    : Array.isArray(cast?.suspects)
      ? cast.suspects.map((name: string) => ({
          name,
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
        }))
      : [];

  return {
    characters,
    relationships: { pairs: [] },
    diversity: { stereotypeCheck: [], recommendations: [] },
    crimeDynamics: {
      possibleCulprits: [],
      redHerrings: [],
      victimCandidates: [],
      detectiveCandidates: [],
    },
  };
};

const buildLlmLogger = () =>
  new LLMLogger({
    logLevel: process.env.LOG_LEVEL as LogLevel | undefined,
    logToConsole: parseEnvBool(process.env.LOG_TO_CONSOLE, true),
    logToFile: parseEnvBool(process.env.LOG_TO_FILE, false),
    logFilePath: process.env.LOG_FILE_PATH,
  });

const describeError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

const MOJIBAKE_REPLACEMENTS: Array<[RegExp, string]> = [
  [/â€™/g, "'"],
  [/â€˜/g, "'"],
  [/â€œ|â€\x9d/g, '"'],
  [/â€"|â€”/g, "—"],
  [/â€“/g, "–"],
  [/â€¦/g, "…"],
  [/faˆ§ade/g, "façade"],
  [/Â/g, ""],
  [/\uFFFD/g, ""],
];

const stripSystemResidue = (value: string) => {
  if (/^generated in scene batches\.?$/i.test(value.trim())) {
    return "";
  }
  return value;
};

const normalizeProseText = (value: unknown, stripSummaryPrefix = false) => {
  let text = typeof value === "string" ? value : value == null ? "" : String(value);
  text = stripSystemResidue(text);
  text = text.normalize("NFC");

  for (const [pattern, replacement] of MOJIBAKE_REPLACEMENTS) {
    text = text.replace(pattern, replacement);
  }

  text = text
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\t/g, " ")
    .replace(/\s+$/gm, "")
    .replace(/^\s+/gm, (match) => (match.includes("\n") ? match : ""));

  if (stripSummaryPrefix) {
    text = text.replace(/^Summary:\s*/i, "");
  }

  return text;
};

const sanitizeProsePayload = (payload: Record<string, unknown>, stripSummaryPrefix = false) => {
  const chapters = Array.isArray(payload.chapters)
    ? payload.chapters.map((chapter) => {
        const chapterRecord = chapter as Record<string, unknown>;
        const paragraphs = Array.isArray(chapterRecord.paragraphs)
          ? chapterRecord.paragraphs
              .map((p) => normalizeProseText(p, stripSummaryPrefix))
              .filter((p) => p.length > 0)
          : [];
        return {
          ...chapterRecord,
          title: normalizeProseText(chapterRecord.title),
          summary: normalizeProseText(chapterRecord.summary, stripSummaryPrefix),
          paragraphs,
        };
      })
    : [];

  const note = normalizeProseText(payload.note);

  return {
    ...payload,
    title: normalizeProseText(payload.title),
    note: note.length > 0 ? note : undefined,
    chapters,
  };
};


const runPipeline = async (
  repoPromise: ReturnType<typeof createRepository>,
  projectId: string,
  runId: string,
  specPayload?: Record<string, unknown>,
) => {
  const repo = await repoPromise;

  try {
    // Initialize Azure OpenAI client
    const config = {
      endpoint: process.env.AZURE_OPENAI_ENDPOINT || "",
      apiKey: process.env.AZURE_OPENAI_API_KEY || "",
      defaultModel: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini",
      apiVersion: process.env.AZURE_OPENAI_API_VERSION || "2024-10-21",
      requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE || 60),
      logger: buildLlmLogger(),
    };

    if (!config.endpoint || !config.apiKey) {
      throw new Error("Azure OpenAI credentials missing; pipeline requires LLM access.");
    }

    const client = new AzureOpenAIClient(config);

    // Build mystery generation inputs from spec
    const similarityThreshold = Number(process.env.NOVELTY_SIMILARITY_THRESHOLD || 0.9);
    const skipNoveltyCheck = String(process.env.NOVELTY_SKIP || "").toLowerCase() === "true" || similarityThreshold >= 1;

    const tone = (specPayload?.tone as string | undefined) ?? undefined;
    const narrativeStyle = (specPayload?.narrativeStyle as "classic" | "modern" | "atmospheric")
      || (tone === "Dark" ? "atmospheric" : "classic");

    const inputs: MysteryGenerationInputs = {
      theme: (specPayload?.theme as string) || "A classic murder mystery",
      eraPreference: specPayload?.decade as string,
      locationPreset: specPayload?.locationPreset as string,
      tone,
      primaryAxis: specPayload?.primaryAxis as "temporal" | "spatial" | "social" | "psychological" | "mechanical",
      castSize: specPayload?.castSize as number,
      castNames: Array.isArray(specPayload?.castNames) ? (specPayload?.castNames as string[]) : undefined,
      targetLength: (specPayload?.targetLength as "short" | "medium" | "long") || "medium",
      narrativeStyle,
      similarityThreshold,
      skipNoveltyCheck,
      runId,
      projectId,
    };

    await repo.addRunEvent(runId, "pipeline_started", "Starting mystery generation pipeline");

    // Progress callback to update run events
    const onProgress = async (progress: { stage: string; message: string; percentage: number }) => {
      await repo.addRunEvent(runId, progress.stage, progress.message);
    };

    // Call real LLM pipeline
    const result = await generateMystery(client, inputs, onProgress);

    // Save all artifacts
    await repo.createArtifact(projectId, "setting", result.setting, null);
    await repo.addRunEvent(runId, "setting_done", "Setting generated");

    await repo.createArtifact(projectId, "cast", result.cast, null);
    await repo.addRunEvent(runId, "cast_done", "Cast generated");

    await repo.createArtifact(projectId, "background_context", result.backgroundContext, null);
    await repo.addRunEvent(runId, "background_context_done", "Background context generated");

    await repo.createArtifact(projectId, "hard_logic_devices", result.hardLogicDevices, null);
    await repo.addRunEvent(runId, "hard_logic_devices_done", `Hard-logic devices generated (${result.hardLogicDevices.devices.length})`);

    await repo.createArtifact(projectId, "cml", result.cml, null);
    await repo.addRunEvent(runId, "cml_done", "CML generated");

    await repo.createArtifact(projectId, "character_profiles", result.characterProfiles, null);
    await repo.addRunEvent(runId, "character_profiles_done", "Character profiles generated");

    await repo.createArtifact(projectId, "location_profiles", result.locationProfiles, null);
    await repo.addRunEvent(runId, "location_profiles_done", "Location profiles generated");

    await repo.createArtifact(projectId, "temporal_context", result.temporalContext, null);
    await repo.addRunEvent(runId, "temporal_context_done", "Temporal context generated");

    // Generate synopsis from CML
    const caseMeta = (result.cml as any)?.CASE?.meta ?? {};
    const crimeClass = caseMeta.crime_class ?? {};
    const synopsis = {
      title: caseMeta.title || "Untitled Mystery",
      summary: crimeClass.subtype
        ? `A ${String(crimeClass.subtype)} case unfolds.`
        : "A mysterious crime has occurred.",
    };
    await repo.createArtifact(projectId, "synopsis", synopsis, null);
    await repo.addRunEvent(runId, "synopsis_done", "Synopsis generated");

    await repo.createArtifact(projectId, "clues", result.clues, null);
    await repo.addRunEvent(runId, "clues_done", "Clues distributed");

    await repo.createArtifact(projectId, "fair_play_report", result.fairPlayAudit, null);
    await repo.addRunEvent(runId, "fair_play_report_done", "Fair play audit complete");

    await repo.createArtifact(projectId, "outline", result.narrative, null);
    await repo.addRunEvent(runId, "outline_done", "Narrative outline generated");

    if (result.noveltyAudit) {
      await repo.createArtifact(projectId, "novelty_audit", result.noveltyAudit, null);
      const summary = result.noveltyAudit.summary?.trim();
      const scores = Array.isArray(result.noveltyAudit.similarityScores)
        ? [...result.noveltyAudit.similarityScores]
        : [];
      const topScore = scores.sort((a, b) => (b.overallSimilarity ?? 0) - (a.overallSimilarity ?? 0))[0];
      const detailParts = [summary].filter(Boolean) as string[];
      if (topScore?.seedTitle) {
        const similarityPct = typeof topScore.overallSimilarity === "number"
          ? Math.round(topScore.overallSimilarity * 100)
          : null;
        detailParts.push(`Top match: ${topScore.seedTitle}${similarityPct !== null ? ` (${similarityPct}%)` : ""}`);
      }
      const detailSuffix = detailParts.length > 0 ? ` — ${detailParts.join(" | ")}` : "";
      await repo.addRunEvent(
        runId,
        "novelty_audit_done",
        `Novelty audit: ${result.noveltyAudit.status}${detailSuffix}`
      );
    }

    const sanitizedProse = sanitizeProsePayload(result.prose as unknown as Record<string, unknown>);
    await repo.createArtifact(projectId, `prose_${inputs.targetLength}`, sanitizedProse, null);
    await repo.addRunEvent(runId, "prose_done", `Prose generated (${inputs.targetLength} format)`);

    await repo.addRunEvent(
      runId,
      "pipeline_complete",
      `Mystery generation complete! Total cost: £${result.metadata.totalCost.toFixed(4)} | Duration: ${(result.metadata.totalDurationMs / 1000).toFixed(1)}s | Status: ${result.status}`
    );

    if (result.warnings.length > 0) {
      await repo.addRunEvent(runId, "pipeline_warnings", `Warnings: ${result.warnings.join(", ")}`);
    }

  } catch (error) {
    await repo.addRunEvent(
      runId,
      "pipeline_error",
      `Pipeline failed: ${describeError(error)}`
    );
    throw error;
  }
};

const appendActivityLog = async (entry: Record<string, unknown>) => {
  const logDir = path.resolve(process.cwd(), "logs");
  const logPath = path.join(logDir, "activity.jsonl");
  await fs.mkdir(logDir, { recursive: true });
  await fs.appendFile(logPath, `${JSON.stringify(entry)}\n`, "utf-8");
};

export const createServer = () => {
  const app = express();
  const repoPromise = createRepository();

  app.use(cors());
  app.use(express.json());
  app.use(withMode);

  app.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => {
      repoPromise
        .then((repo) => {
          const match = req.path.match(/\/api\/projects\/([^/]+)/);
          const projectId = match?.[1] ?? null;
          const durationMs = Date.now() - start;
          const httpEntry = {
            projectId,
            scope: "http",
            message: `${req.method} ${req.path} ${res.statusCode}`,
            payload: { durationMs },
          };
          const httpLog = repo.createLog(httpEntry);
          appendActivityLog({
            ...httpEntry,
            createdAt: new Date().toISOString(),
          }).catch(() => undefined);
          if (res.statusCode >= 400) {
            const errorEntry = {
              projectId,
              scope: "http_error",
              message: `${req.method} ${req.path} ${res.statusCode}`,
              payload: { durationMs },
            };
            appendActivityLog({
              ...errorEntry,
              createdAt: new Date().toISOString(),
            }).catch(() => undefined);
            return Promise.all([httpLog, repo.createLog(errorEntry)]).then(() => undefined);
          }
          return httpLog;
        })
        .catch(() => undefined);
    });
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "api" });
  });

  app.post("/api/admin/clear-store", async (_req, res) => {
    try {
      const repo = await repoPromise;
      await repo.clearAllData();
      res.status(200).json({ status: "ok" });
    } catch {
      res.status(500).json({ error: "Failed to clear persistence store" });
    }
  });

  app.post("/api/projects", (_req, res) => {
    const name = typeof _req.body?.name === "string" ? _req.body.name : "Untitled project";
    repoPromise
      .then((repo) => repo.createProject(name))
      .then((project) => res.status(201).json(project))
      .catch(() => res.status(500).json({ error: "Failed to create project" }));
  });

  app.get("/api/projects", (_req, res) => {
    repoPromise
      .then((repo) => repo.listProjects())
      .then((projects) => res.json({ projects }))
      .catch(() => res.status(500).json({ error: "Failed to list projects" }));
  });

  app.get("/api/projects/:id", (_req, res) => {
    repoPromise
      .then((repo) => repo.getProject(_req.params.id))
      .then((project) => {
        if (!project) {
          res.status(404).json({ error: "Project not found" });
          return;
        }
        res.json(project);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch project" }));
  });

  app.post("/api/projects/:id/regenerate", express.json(), async (req, res) => {
    const scope = typeof req.body?.scope === "string" ? req.body.scope : "";
    const allowedScopes = new Set([
      "setting",
      "cast",
      "character_profiles",
      "cml",
      "clues",
      "outline",
      "prose",
      "game_pack",
      "fair_play_report",
    ]);
    if (!allowedScopes.has(scope)) {
      res.status(400).json({ error: "scope must be one of setting, cast, character_profiles, cml, clues, outline, prose, game_pack, fair_play_report" });
      return;
    }

    try {
      const repo = await repoPromise;
      const spec = await repo.getLatestSpec(req.params.id);
      if (!spec) {
        res.status(404).json({ error: "Spec not found" });
        return;
      }

      const latestRun = await repo.getLatestRun(req.params.id).catch(() => null);
      const runId = latestRun?.id ?? null;

      const client = buildLlmClient();
      if (!client) {
        res.status(503).json({ error: "Azure OpenAI credentials missing; regeneration requires LLM access." });
        return;
      }

      if (scope === "character_profiles") {
        const cast = await repo.getLatestArtifact(req.params.id, "cast");
        const cml = await repo.getLatestArtifact(req.params.id, "cml");
        if (!cast || !cml) {
          res.status(409).json({ error: "Cast and CML artifacts required for character profiles regeneration" });
          return;
        }
        const profiles = await generateCharacterProfiles(client, {
          caseData: cml.payload as any,
          cast: normalizeCastForProfiles(cast.payload as Record<string, unknown>),
          tone: (spec.spec as Record<string, unknown>)?.tone as string | undefined,
          targetWordCount: 1000,
          runId: runId ?? undefined,
          projectId: req.params.id,
        });
        await repo.createArtifact(req.params.id, "character_profiles", profiles, spec.id);
      } else {
        res.status(409).json({ error: "Regeneration for this scope requires a full pipeline run to ensure fresh LLM output." });
        return;
      }

      if (runId) {
        await repo.addRunEvent(runId, `${scope}_regenerated`, `${scope} regenerated`);
      }

      res.status(200).json({ status: "ok", scope });
    } catch (error) {
      res.status(500).json({ error: "Failed to regenerate artifact" });
    }
  });

  app.post("/api/projects/:id/specs", (_req, res) => {
    repoPromise
      .then((repo) => repo.getProject(_req.params.id))
      .then((project) => {
        if (!project) {
          res.status(404).json({ error: "Project not found" });
          return null;
        }
        return repoPromise.then((repo) => repo.createSpec(project.id, _req.body ?? {}));
      })
      .then((spec) => {
        if (spec) {
          res.status(201).json(spec);
        }
      })
      .catch(() => res.status(500).json({ error: "Failed to save spec" }));
  });

  app.get("/api/specs/:id", (_req, res) => {
    repoPromise
      .then((repo) => repo.getSpec(_req.params.id))
      .then((spec) => {
        if (!spec) {
          res.status(404).json({ error: "Spec not found" });
          return;
        }
        res.json(spec);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch spec" }));
  });

  app.post("/api/projects/:id/run", (_req, res) => {
    repoPromise
      .then((repo) => repo.getProject(_req.params.id))
      .then((project) => {
        if (!project) {
          res.status(404).json({ error: "Project not found" });
          return null;
        }

        const hasAzureCreds = Boolean(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY);
        if (!hasAzureCreds) {
          res.status(503).json({ error: "Azure OpenAI credentials missing; pipeline requires LLM access." });
          return null;
        }

        return repoPromise.then(async (repo) => {
          const run = await repo.createRun(project.id, "running");
          await repo.setProjectStatus(project.id, "running");
          await repo.addRunEvent(run.id, "run_started", "Pipeline run started");

          const latestSpec = await repo.getLatestSpec(project.id);
          const specPayload = (latestSpec?.spec as Record<string, unknown>) ?? undefined;

          setTimeout(() => {
            runPipeline(repoPromise, project.id, run.id, specPayload)
              .then(async () => {
                await repo.updateRunStatus(run.id, "idle");
                await repo.setProjectStatus(project.id, "idle");
                await repo.addRunEvent(run.id, "run_finished", "Pipeline run finished");
              })
              .catch(async () => {
                await repo.updateRunStatus(run.id, "idle");
                await repo.setProjectStatus(project.id, "idle");
                await repo.addRunEvent(run.id, "run_failed", "Pipeline failed");
              });
          }, 0);

          res.status(202).json({ status: "running", projectId: project.id, runId: run.id });
          return project;
        });
      })
      .catch(() => res.status(500).json({ error: "Failed to start run" }));
  });

  app.get("/api/projects/:id/status", (_req, res) => {
    repoPromise
      .then((repo) => repo.getProject(_req.params.id))
      .then((project) => {
        if (!project) {
          res.status(404).json({ error: "Project not found" });
          return null;
        }
        return repoPromise.then(async (repo) => {
          const status = await repo.getProjectStatus(project.id);
          res.json({ projectId: project.id, status });
          return status;
        });
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch status" }));
  });

  app.get("/api/projects/:id/runs/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestRun(_req.params.id))
      .then((run) => {
        if (!run) {
          res.status(404).json({ error: "Run not found" });
          return;
        }
        res.json(run);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch latest run" }));
  });

  app.get("/api/runs/:id/events", (_req, res) => {
    repoPromise
      .then((repo) => repo.getRunEvents(_req.params.id))
      .then((events) => res.json({ runId: _req.params.id, events }))
      .catch(() => res.status(500).json({ error: "Failed to fetch run events" }));
  });

  app.get("/api/projects/:id/events", (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const interval = setInterval(() => {
      repoPromise
        .then((repo) => repo.getProjectStatus(req.params.id))
        .then((status) => {
          res.write(`event: ping\n`);
          res.write(`data: ${JSON.stringify({ projectId: req.params.id, status })}\n\n`);
        })
        .catch(() => {
          res.write(`event: ping\n`);
          res.write(`data: ${JSON.stringify({ projectId: req.params.id, status: "unknown" })}\n\n`);
        });
    }, 15000);

    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });
  });

  app.get("/api/projects/:id/cml/latest", requireCmlAccess, (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "cml"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "CML artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch CML artifact" }));
  });

  app.post("/api/projects/:id/cml/validate", requireCmlAccess, (_req, res) => {
    repoPromise
      .then((repo) => repo.getProject(_req.params.id))
      .then((project) => {
        if (!project) {
          res.status(404).json({ error: "Project not found" });
          return null;
        }
        const result = validateCml(_req.body);
        return repoPromise.then(async (repo) => {
          await repo.createArtifact(project.id, "cml_validation", result);
          res.status(200).json(result);
          return result;
        });
      })
      .catch(() => res.status(500).json({ error: "Failed to validate CML" }));
  });

  app.get("/api/projects/:id/cml/validation/latest", requireCmlAccess, (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "cml_validation"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "CML validation artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch CML validation artifact" }));
  });

  app.get("/api/projects/:id/clues/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "clues"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Clues artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch clues artifact" }));
  });

  app.get("/api/projects/:id/setting/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "setting"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Setting artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch setting artifact" }));
  });

  app.get("/api/projects/:id/cast/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "cast"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Cast artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch cast artifact" }));
  });

  app.get("/api/projects/:id/setting/validation/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "setting_validation"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Setting validation artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch setting validation artifact" }));
  });

  app.get("/api/projects/:id/cast/validation/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "cast_validation"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Cast validation artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch cast validation artifact" }));
  });

  app.get("/api/projects/:id/outline/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "outline"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Outline artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch outline artifact" }));
  });

  app.get("/api/projects/:id/clues/validation/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "clues_validation"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Clues validation artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch clues validation artifact" }));
  });

  app.get("/api/projects/:id/outline/validation/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "outline_validation"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Outline validation artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch outline validation artifact" }));
  });

  app.get("/api/projects/:id/prose/latest", async (_req, res) => {
    try {
      const repo = await repoPromise;
      // Check for length-specific versions first, fall back to legacy "prose"
      const lengths = ["medium", "short", "long"];
      let artifact = null;
      
      for (const length of lengths) {
        artifact = await repo.getLatestArtifact(_req.params.id, `prose_${length}`);
        if (artifact) break;
      }
      
      // Fallback to old-style prose artifact
      if (!artifact) {
        artifact = await repo.getLatestArtifact(_req.params.id, "prose");
      }
      
      if (!artifact) {
        res.status(404).json({ error: "Prose artifact not found" });
        return;
      }
      const payload = sanitizeProsePayload(artifact.payload as Record<string, unknown>);
      res.json({ ...artifact, payload });
    } catch {
      res.status(500).json({ error: "Failed to fetch prose artifact" });
    }
  });

  app.get("/api/projects/:id/prose/all", async (_req, res) => {
    try {
      const repo = await repoPromise;
      const versions: Record<string, any> = {};
      
      // Check all length variants
      const lengths = ["short", "medium", "long"];
      for (const length of lengths) {
        const artifact = await repo.getLatestArtifact(_req.params.id, `prose_${length}`);
        if (artifact) {
          versions[length] = {
            ...artifact,
            payload: sanitizeProsePayload(artifact.payload as Record<string, unknown>),
          };
        }
      }
      
      // Include legacy prose if exists
      const legacy = await repo.getLatestArtifact(_req.params.id, "prose");
      if (legacy) {
        versions.legacy = {
          ...legacy,
          payload: sanitizeProsePayload(legacy.payload as Record<string, unknown>),
        };
      }
      
      res.json({ versions });
    } catch {
      res.status(500).json({ error: "Failed to fetch prose versions" });
    }
  });

  app.get("/api/projects/:id/character-profiles/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "character_profiles"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Character profiles artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch character profiles artifact" }));
  });

  app.get("/api/projects/:id/location-profiles/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "location_profiles"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Location profiles artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch location profiles artifact" }));
  });

  app.get("/api/projects/:id/temporal-context/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "temporal_context"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Temporal context artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch temporal context artifact" }));
  });

  app.get("/api/projects/:id/background-context/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "background_context"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Background context artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch background context artifact" }));
  });

  app.get("/api/projects/:id/hard-logic-devices/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "hard_logic_devices"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Hard-logic devices artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch hard-logic devices artifact" }));
  });

  app.get("/api/projects/:id/fair-play/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "fair_play_report"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Fair-play report artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch fair-play report artifact" }));
  });

  app.get("/api/projects/:id/game-pack/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "game_pack"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Game pack artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch game pack artifact" }));
  });

  app.get("/api/projects/:id/synopsis/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "synopsis"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Synopsis artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch synopsis artifact" }));
  });

  app.get("/api/projects/:id/novelty-audit/latest", (_req, res) => {
    repoPromise
      .then((repo) => repo.getLatestArtifact(_req.params.id, "novelty_audit"))
      .then((artifact) => {
        if (!artifact) {
          res.status(404).json({ error: "Novelty audit artifact not found" });
          return;
        }
        res.json(artifact);
      })
      .catch(() => res.status(500).json({ error: "Failed to fetch novelty audit artifact" }));
  });

  app.post("/api/logs", express.json(), async (req, res) => {
    try {
      const { projectId, scope, message, payload } = req.body ?? {};
      if (typeof scope !== "string" || typeof message !== "string") {
        res.status(400).json({ error: "scope and message are required" });
        return;
      }
      const repo = await repoPromise;
      const logEntry = {
        projectId: typeof projectId === "string" ? projectId : null,
        scope,
        message,
        payload: payload ?? null,
      };
      const log = await repo.createLog(logEntry);
      appendActivityLog({
        ...logEntry,
        createdAt: log.createdAt,
      }).catch(() => undefined);
      res.status(201).json(log);
    } catch (error) {
      res.status(500).json({ error: "Failed to create log" });
    }
  });

  app.get("/api/llm-logs", async (req, res) => {
    try {
      const limit = Number(req.query.limit ?? 200);
      const projectId = typeof req.query.projectId === "string" ? req.query.projectId : null;
      const logPath = process.env.LOG_FILE_PATH || path.resolve(process.cwd(), "logs", "llm.jsonl");
      const raw = await fs.readFile(logPath, "utf-8");
      const lines = raw.trim().split("\n").filter(Boolean);
      const entries = lines
        .map((line) => {
          try {
            return JSON.parse(line) as Record<string, unknown>;
          } catch {
            return null;
          }
        })
        .filter((entry): entry is Record<string, unknown> => Boolean(entry));
      const filtered = projectId ? entries.filter((entry) => entry.projectId === projectId) : entries;
      const sliced = filtered.slice(-Math.max(1, limit));
      res.json({ entries: sliced });
    } catch {
      res.status(404).json({ error: "LLM log file not found" });
    }
  });

  app.get("/api/logs", async (_req, res) => {
    try {
      const projectId = typeof _req.query.projectId === "string" ? _req.query.projectId : null;
      const repo = await repoPromise;
      const logs = await repo.listLogs(projectId);
      res.json({ logs });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch logs" });
    }
  });

  app.get("/api/projects/:id/game-pack/pdf", async (_req, res) => {
    try {
      const repo = await repoPromise;
      const artifact = await repo.getLatestArtifact(_req.params.id, "game_pack");
      if (!artifact) {
        res.status(404).json({ error: "Game pack artifact not found" });
        return;
      }
      const pdfBuffer = await buildGamePackPdf(artifact.payload as Record<string, unknown>);
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=\"game_pack_${_req.params.id}.pdf\"`);
      res.status(200).send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate game pack PDF" });
    }
  });

  app.get("/api/projects/:id/prose/pdf", async (req, res) => {
    try {
      const repo = await repoPromise;
      const length = req.query.length as string | undefined;
      
      let artifact = null;
      if (length && ["short", "medium", "long"].includes(length)) {
        artifact = await repo.getLatestArtifact(req.params.id, `prose_${length}`);
      } else {
        // Try all lengths in order: medium, short, long, legacy
        const lengths = ["medium", "short", "long"];
        for (const len of lengths) {
          artifact = await repo.getLatestArtifact(req.params.id, `prose_${len}`);
          if (artifact) break;
        }
        if (!artifact) {
          artifact = await repo.getLatestArtifact(req.params.id, "prose");
        }
      }
      
      if (!artifact) {
        res.status(404).json({ error: "Prose artifact not found" });
        return;
      }
      const synopsis = await repo.getLatestArtifact(req.params.id, "synopsis");
      const fallbackTitle = synopsis?.payload && typeof synopsis.payload === "object"
        ? (synopsis.payload as Record<string, unknown>).title
        : undefined;
      const sanitizedProse = sanitizeProsePayload(artifact.payload as Record<string, unknown>);
      const pdfBuffer = await buildProsePdf(sanitizedProse, fallbackTitle as string | undefined);
      const lengthSuffix = length ? `_${length}` : "";
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename=\"story_${req.params.id}${lengthSuffix}.pdf\"`);
      res.status(200).send(pdfBuffer);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate story PDF" });
    }
  });


  // Export selected artifacts as a single JSON file
  app.post("/api/projects/:id/export", express.json(), async (req, res) => {
    const { artifactTypes } = req.body;
    if (!Array.isArray(artifactTypes) || artifactTypes.length === 0) {
      res.status(400).json({ error: "artifactTypes must be a non-empty array" });
      return;
    }
    try {
      const repo = await repoPromise;
      const results: Record<string, unknown> = {};
      for (const type of artifactTypes) {
        // Only fetch known artifact types for safety
        if (typeof type !== "string") continue;
        const artifact = await repo.getLatestArtifact(req.params.id, type);
        if (artifact) {
          if (type === "prose" || /^prose_(short|medium|long)$/.test(type)) {
            results[type] = sanitizeProsePayload(artifact.payload as Record<string, unknown>);
          } else {
            results[type] = artifact.payload;
          }
        }
      }
      const filename = `export_${req.params.id}_${Date.now()}.json`;
      res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
      res.setHeader("Content-Type", "application/json");
      res.status(200).send(JSON.stringify(results, null, 2));
    } catch (err) {
      res.status(500).json({ error: "Failed to export artifacts" });
    }
  });

  app.get("/api/samples", async (_req, res) => {
    try {
      const files = await listSampleFiles();
      const samples = files.map((file) => {
        const id = getSampleId(file);
        return { id, name: toTitle(id), filename: file };
      });
      res.json({ samples });
    } catch (error) {
      res.status(500).json({ error: "Failed to list samples" });
    }
  });

  app.get("/api/samples/:name", async (_req, res) => {
    try {
      const files = await listSampleFiles();
      const match = files.find((file) => getSampleId(file) === _req.params.name || file === _req.params.name);
      if (!match) {
        res.status(404).json({ error: "Sample not found" });
        return;
      }
      const contents = await fs.readFile(path.join(examplesDir, match), "utf-8");
      res.json({ id: getSampleId(match), name: toTitle(getSampleId(match)), content: contents });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sample" });
    }
  });

  return app;
};

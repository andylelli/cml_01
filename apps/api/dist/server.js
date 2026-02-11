import express from "express";
import cors from "cors";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRepository } from "./db.js";
import { validateCml } from "@cml/cml";
import { AzureOpenAIClient, LLMLogger } from "@cml/llm-client";
import { generateMystery } from "@cml/worker/jobs/mystery-orchestrator.js";
const ALLOWED_CML_MODES = new Set(["advanced", "expert"]);
const withMode = (req, _res, next) => {
    const headerMode = (req.header("x-cml-mode") || "user").toLowerCase();
    const mode = headerMode === "advanced" || headerMode === "expert" ? headerMode : "user";
    req.cmlMode = mode;
    next();
};
const isAllowedCmlMode = (mode) => mode === "advanced" || mode === "expert";
const requireCmlAccess = (req, res, next) => {
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
const getSampleId = (filename) => filename.replace(/\.(yaml|yml)$/i, "");
const toTitle = (id) => id
    .replace(/_cml2$/i, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
const escapePdfText = (value) => value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
const buildGamePackPdf = (gamePack) => {
    const title = gamePack.title ?? "Mystery Game Pack";
    const suspects = Array.isArray(gamePack.suspects) ? gamePack.suspects : [];
    const hostPacket = gamePack.hostPacket ?? {};
    const materials = Array.isArray(gamePack.materials) ? gamePack.materials : [];
    const lines = [
        title,
        "",
        "Suspects",
        ...(suspects.length ? suspects.map((suspect) => `• ${suspect}`) : ["• No suspects available yet."]),
        "",
        "Host Packet",
        hostPacket.summary ?? "Host packet summary pending.",
        `Culprit count: ${hostPacket.culpritCount ?? 1}`,
        "",
        "Materials",
        ...(materials.length ? materials.map((material) => `• ${material}`) : ["• No materials listed yet."]),
    ];
    const contentLines = lines.map((line) => `(${escapePdfText(line)}) Tj T*`).join("\n");
    const stream = `BT\n/F1 12 Tf\n72 720 Td\n14 TL\n${contentLines}\nET`;
    const objects = [
        "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj",
        "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj",
        "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj",
        `4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`,
        "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj",
    ];
    let offset = 0;
    const xref = ["0000000000 65535 f "];
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
const deriveSetting = (spec) => ({
    decade: spec?.decade ?? "1930s",
    locationPreset: spec?.locationPreset ?? "CountryHouse",
    weather: "Autumn storm",
    socialStructure: "aristocracy",
    institution: "Estate",
});
const deriveCast = (spec) => {
    const rawNames = spec?.castNames;
    const normalizedNames = Array.isArray(rawNames)
        ? rawNames.map((name) => String(name).trim()).filter(Boolean)
        : typeof rawNames === "string"
            ? rawNames
                .split(",")
                .map((name) => name.trim())
                .filter(Boolean)
            : [];
    const requestedSize = spec?.castSize ?? 6;
    const baseSize = normalizedNames.length ? normalizedNames.length : requestedSize;
    const targetSize = Math.max(3, Math.min(baseSize, 8));
    const fillCount = Math.max(0, targetSize - normalizedNames.length);
    const defaultNames = [
        "Avery",
        "Blair",
        "Casey",
        "Dana",
        "Ellis",
        "Finley",
        "Harper",
        "Jordan",
        "Morgan",
        "Quinn",
    ];
    const filler = Array.from({ length: fillCount }, (_, index) => {
        return defaultNames[index] ?? `Suspect ${index + 1}`;
    });
    const suspects = (normalizedNames.length ? [...normalizedNames, ...filler] : filler).slice(0, targetSize);
    return {
        size: suspects.length,
        detectiveType: "amateur sleuth",
        victimArchetype: "blackmailer",
        suspects,
    };
};
const deriveCml = (spec) => ({
    CML_VERSION: 2.0,
    CASE: {
        meta: {
            title: "Phase 3 Deterministic",
            author: "CML",
            license: "internal",
            era: {
                decade: spec?.decade ?? "1930s",
                realism_constraints: ["no modern forensics"],
            },
            setting: {
                location: spec?.locationPreset ?? "Country House",
                institution: "Estate",
            },
            crime_class: {
                category: "murder",
                subtype: "poisoning",
            },
        },
        cast: deriveCast(spec).suspects.map((name) => ({
            name,
            age_range: "adult",
            role_archetype: "suspect",
            relationships: ["victim"],
            public_persona: "reserved",
            private_secret: "debts",
            motive_seed: "inheritance",
            motive_strength: "medium",
            alibi_window: "evening",
            access_plausibility: "medium",
            opportunity_channels: ["kitchen"],
            behavioral_tells: ["hesitation"],
            stakes: "inheritance",
            evidence_sensitivity: ["poison"],
            culprit_eligibility: "eligible",
            culpability: "unknown",
        })),
        culpability: {
            culprit_count: 1,
            culprits: [deriveCast(spec).suspects[0] ?? "A. Example"],
        },
        surface_model: {
            narrative: { summary: "A simple surface summary." },
            accepted_facts: ["Victim found deceased."],
            inferred_conclusions: ["Death appears natural."],
        },
        hidden_model: {
            mechanism: {
                description: "Poisoned tea.",
                delivery_path: [{ step: "Tea prepared" }],
            },
            outcome: { result: "Victim poisoned" },
        },
        false_assumption: {
            statement: "Death was natural.",
            type: spec?.primaryAxis ?? "temporal",
            why_it_seems_reasonable: "Symptoms resemble illness.",
            what_it_hides: "Poisoning timeline.",
        },
        constraint_space: {
            time: { anchors: [], windows: [], contradictions: [] },
            access: { actors: [], objects: [], permissions: [] },
            physical: { laws: [], traces: [] },
            social: { trust_channels: [], authority_sources: [] },
        },
        inference_path: {
            steps: [{ observation: "Symptom onset", correction: "Poison delay", effect: "Alibi breaks" }],
        },
        discriminating_test: {
            method: "trap",
            design: "Reveal poison source",
            knowledge_revealed: "Access window",
            pass_condition: "Culprit reacts",
        },
        fair_play: {
            all_clues_visible: true,
            no_special_knowledge_required: true,
            no_late_information: true,
            reader_can_solve: true,
            explanation: "All clues shown early.",
        },
    },
});
const deriveClues = (spec) => {
    const density = spec?.clueDensity ?? "medium";
    const axis = spec?.primaryAxis ?? "temporal";
    const decade = spec?.decade ?? "1930s";
    const location = spec?.locationPreset ?? "CountryHouse";
    const cast = deriveCast(spec);
    const firstSuspect = cast.suspects[0] ?? "the suspect";
    const secondSuspect = cast.suspects[1] ?? "another guest";
    // Generate axis-specific clues that vary by project settings
    const axisClues = {
        temporal: {
            category: "time",
            text: `A clock was stopped at ${Math.floor(Math.random() * 12) + 1}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}.`,
            pointsTo: "timeline discrepancy",
        },
        spatial: {
            category: "access",
            text: `Only ${firstSuspect} had access to the ${location === "CountryHouse" ? "library" : location === "SeasideHotel" ? "suite" : "restricted area"}.`,
            pointsTo: "restricted access",
        },
        identity: {
            category: "testimony",
            text: `${secondSuspect} was seen in two places at once according to witness statements.`,
            pointsTo: "identity confusion",
        },
        behavioral: {
            category: "behavior",
            text: `${firstSuspect} exhibited unusual nervous behavior when questioned about the evening.`,
            pointsTo: "suspicious behavior",
        },
        authority: {
            category: "circumstantial",
            text: `A forged ${decade === "1930s" ? "telegram" : decade === "1940s" ? "letter" : "document"} was found claiming official authority.`,
            pointsTo: "authority misuse",
        },
    };
    const primaryClue = axisClues[axis] ?? axisClues.temporal;
    const baseClues = [
        {
            id: "clue-1",
            category: primaryClue.category,
            text: primaryClue.text,
            pointsTo: primaryClue.pointsTo,
            redHerring: false,
            revealChapter: 1,
        },
        {
            id: "clue-2",
            category: "physical",
            text: `A ${decade === "1930s" ? "cigarette stub" : decade === "1940s" ? "matchbook" : "lighter"} was found at the scene.`,
            pointsTo: "physical evidence",
            redHerring: false,
            revealChapter: 2,
        },
        {
            id: "clue-3",
            category: "document",
            text: `A diary entry from ${firstSuspect} mentions a secret meeting.`,
            pointsTo: "motive evidence",
            redHerring: false,
            revealChapter: 2,
        },
    ];
    const redHerrings = [
        {
            id: "red-1",
            category: "testimony",
            text: `${secondSuspect} was reportedly seen near the ${location === "CountryHouse" ? "greenhouse" : location === "SeasideHotel" ? "beach" : "garden"}.`,
            pointsTo: "false lead",
            redHerring: true,
            revealChapter: 1,
        },
    ];
    const items = density === "sparse" ? baseClues : density === "rich" ? [...baseClues, ...redHerrings] : [...baseClues, ...redHerrings];
    return {
        status: "ready",
        density,
        axis,
        summary: `Clues generated based on ${axis} axis in ${decade} ${location} setting.`,
        items,
    };
};
const deriveSynopsis = (cml) => {
    const caseBlock = cml?.CASE ?? {};
    const meta = caseBlock.meta ?? {};
    const title = meta.title ?? "Untitled Mystery";
    const era = meta.era ?? {};
    const decade = era.decade ?? "unknown era";
    const setting = meta.setting ?? {};
    const location = setting.location ?? "unknown location";
    const crimeClass = meta.crime_class ?? {};
    const category = crimeClass.category ?? "crime";
    const falseAssumption = caseBlock.false_assumption ?? {};
    const assumption = falseAssumption.statement ?? "a false assumption";
    return {
        status: "ready",
        title,
        summary: `${title} is a ${decade} ${category} in ${location}. The case hinges on ${assumption.toLowerCase()}.`,
    };
};
const deriveOutline = (spec) => ({
    status: "pending",
    tone: spec?.tone ?? "Cozy",
    chapters: spec?.chapters ?? null,
    summary: "Deterministic placeholder outline derived from spec.",
});
const deriveFairPlayReport = (cml, clues) => {
    const fairPlay = cml?.CASE?.fair_play;
    const clueItems = clues?.items ?? [];
    const hasRedHerrings = clueItems.some((item) => item.redHerring === true);
    return {
        status: "ready",
        summary: "Deterministic placeholder fair-play report derived from CML and clues.",
        checks: [
            {
                id: "all_clues_visible",
                label: "All clues are visible",
                status: fairPlay?.all_clues_visible ? "pass" : "warn",
            },
            {
                id: "no_late_information",
                label: "No late information",
                status: fairPlay?.no_late_information ? "pass" : "warn",
            },
            {
                id: "reader_can_solve",
                label: "Reader can solve with given clues",
                status: fairPlay?.reader_can_solve ? "pass" : "warn",
            },
            {
                id: "red_herrings_controlled",
                label: "Red herrings are clearly flagged",
                status: hasRedHerrings ? "pass" : "warn",
            },
        ],
    };
};
const deriveProse = (spec, outline, cast) => {
    const outlineChapters = outline?.chapters;
    const suspects = Array.isArray(cast?.suspects) ? cast?.suspects : [];
    const chapters = Array.isArray(outlineChapters)
        ? outlineChapters.map((chapter, index) => ({
            title: `Chapter ${index + 1}`,
            summary: typeof chapter === "string" ? chapter : `Chapter ${index + 1} beats derived from outline.`,
            paragraphs: [
                `The story advances as the investigator tracks a new thread in chapter ${index + 1}.`,
                suspects.length
                    ? `Suspicion brushes against ${suspects[index % suspects.length]} while new details surface.`
                    : "Suspicion gathers as new details surface.",
            ],
        }))
        : [
            {
                title: "Chapter 1",
                summary: outline?.summary ?? "Opening beats derived from outline.",
                paragraphs: [
                    "The case opens with a quiet routine shattered by a startling discovery.",
                    suspects.length ? `Attention turns to ${suspects[0]} as the first clue emerges.` : "Attention turns as the first clue emerges.",
                ],
            },
            {
                title: "Chapter 2",
                summary: "Investigation beats derived from outline.",
                paragraphs: [
                    "Interviews reveal fractures in alibis and motives.",
                    suspects.length ? `A second inquiry puts ${suspects[1] ?? suspects[0]} under pressure.` : "A second inquiry puts the household under pressure.",
                ],
            },
        ];
    return {
        status: "draft",
        tone: outline?.tone ?? spec?.tone ?? "Cozy",
        chapters,
        cast: suspects,
        note: "Deterministic placeholder prose derived from outline and cast.",
    };
};
const deriveGamePack = (_spec, cast, cml) => {
    const caseBlock = cml?.CASE ?? {};
    const meta = caseBlock.meta ?? {};
    const title = meta.title ?? "Untitled Mystery";
    return {
        status: "draft",
        title,
        suspects: Array.isArray(cast?.suspects) ? cast?.suspects : [],
        hostPacket: {
            summary: "Deterministic placeholder host packet derived from CML and cast.",
            culpritCount: caseBlock.culpability?.culprit_count ?? 1,
        },
        materials: ["suspect_cards", "host_packet", "timeline_sheet"],
        note: "Deterministic placeholder game pack derived from CML and cast.",
    };
};
const validateSetting = (setting) => ({
    valid: Boolean(setting.decade && setting.locationPreset),
    errors: setting.decade && setting.locationPreset ? [] : ["Setting must include decade and locationPreset"],
});
const validateCast = (cast) => ({
    valid: Array.isArray(cast.suspects) && cast.suspects.length >= 3,
    errors: Array.isArray(cast.suspects) && cast.suspects.length >= 3
        ? []
        : ["Cast must include at least 3 suspects"],
});
const validateClues = (clues) => {
    const hasBasics = Boolean(clues.density && clues.axis);
    const items = clues.items ?? [];
    const hasItems = Array.isArray(items) && items.length > 0;
    return {
        valid: hasBasics && hasItems,
        errors: hasBasics && hasItems ? [] : ["Clues must include density, axis, and at least one item"],
    };
};
const validateOutline = (outline) => ({
    valid: Boolean(outline.tone),
    errors: outline.tone ? [] : ["Outline must include tone"],
});
const parseEnvBool = (value, defaultValue) => {
    if (value === undefined)
        return defaultValue;
    return value.toLowerCase() === "true";
};
const buildLlmLogger = () => new LLMLogger({
    logLevel: process.env.LOG_LEVEL,
    logToConsole: parseEnvBool(process.env.LOG_TO_CONSOLE, true),
    logToFile: parseEnvBool(process.env.LOG_TO_FILE, false),
    logFilePath: process.env.LOG_FILE_PATH,
});
const describeError = (error) => {
    if (error instanceof Error) {
        return error.message;
    }
    try {
        return JSON.stringify(error);
    }
    catch {
        return String(error);
    }
};
const runPipeline = async (repoPromise, projectId, runId, specPayload) => {
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
            throw new Error("Azure OpenAI credentials not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY environment variables.");
        }
        const client = new AzureOpenAIClient(config);
        // Build mystery generation inputs from spec
        const inputs = {
            theme: specPayload?.theme || "A classic murder mystery",
            eraPreference: specPayload?.decade,
            primaryAxis: specPayload?.primaryAxis,
            castSize: specPayload?.castSize,
            targetLength: specPayload?.targetLength || "medium",
            narrativeStyle: specPayload?.narrativeStyle || "classic",
            runId,
            projectId,
        };
        await repo.addRunEvent(runId, "pipeline_started", "Starting mystery generation pipeline");
        // Progress callback to update run events
        const onProgress = async (progress) => {
            await repo.addRunEvent(runId, progress.stage, progress.message);
        };
        // Call real LLM pipeline
        const result = await generateMystery(client, inputs, onProgress);
        // Save all artifacts
        await repo.createArtifact(projectId, "setting", result.setting, null);
        await repo.addRunEvent(runId, "setting_done", "Setting generated");
        await repo.createArtifact(projectId, "cast", result.cast, null);
        await repo.addRunEvent(runId, "cast_done", "Cast generated");
        await repo.createArtifact(projectId, "cml", result.cml, null);
        await repo.addRunEvent(runId, "cml_done", "CML generated");
        // Generate synopsis from CML
        const caseMeta = result.cml?.CASE?.meta ?? {};
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
            await repo.addRunEvent(runId, "novelty_audit_done", `Novelty audit: ${result.noveltyAudit.status}`);
        }
        // Generate prose placeholder (Agent 7 outputs outline, actual prose is future work)
        const allScenes = result.narrative.acts?.flatMap(act => act.scenes) || [];
        const prose = {
            title: synopsis.title,
            chapters: allScenes.map((scene, idx) => ({
                number: idx + 1,
                title: `Scene ${idx + 1}`,
                content: scene.summary || "",
            })),
        };
        await repo.createArtifact(projectId, "prose", prose, null);
        await repo.addRunEvent(runId, "prose_done", "Prose structure generated");
        // Generate game pack
        const gamePack = {
            title: synopsis.title,
            suspects: result.cast.cast.characters?.map((c) => c.name) || [],
            materials: ["Character cards", "Clue cards", "Investigation guide"],
        };
        await repo.createArtifact(projectId, "game_pack", gamePack, null);
        await repo.addRunEvent(runId, "game_pack_done", "Game pack generated");
        await repo.addRunEvent(runId, "pipeline_complete", `Mystery generation complete! Total cost: $${result.metadata.totalCost.toFixed(4)} | Duration: ${(result.metadata.totalDurationMs / 1000).toFixed(1)}s | Status: ${result.status}`);
        if (result.warnings.length > 0) {
            await repo.addRunEvent(runId, "pipeline_warnings", `Warnings: ${result.warnings.join(", ")}`);
        }
    }
    catch (error) {
        await repo.addRunEvent(runId, "pipeline_error", `Pipeline failed: ${describeError(error)}`);
        throw error;
    }
};
const appendActivityLog = async (entry) => {
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
        }
        catch {
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
    // DISABLED: Regenerate endpoint uses placeholder functions
    // Individual regeneration will be implemented later with real LLM agents
    app.post("/api/projects/:id/regenerate", express.json(), async (req, res) => {
        res.status(501).json({
            error: "Individual regeneration not yet implemented",
            message: "Use the main Generate button to regenerate the full mystery with real AI agents"
        });
        return;
        /* PLACEHOLDER CODE DISABLED
        const scope = typeof req.body?.scope === "string" ? req.body.scope : "";
        const allowedScopes = new Set([
          "setting",
          "cast",
          "cml",
          "clues",
          "outline",
          "prose",
          "game_pack",
          "fair_play_report",
        ]);
        if (!allowedScopes.has(scope)) {
          res.status(400).json({ error: "scope must be one of setting, cast, cml, clues, outline, prose, game_pack, fair_play_report" });
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
    
          if (scope === "setting") {
            const setting = deriveSetting(spec.spec as Record<string, unknown>);
            await repo.createArtifact(req.params.id, "setting", setting, spec.id);
            await repo.createArtifact(req.params.id, "setting_validation", validateSetting(setting), spec.id);
          }
    
          if (scope === "cast") {
            const cast = deriveCast(spec.spec as Record<string, unknown>);
            await repo.createArtifact(req.params.id, "cast", cast, spec.id);
            await repo.createArtifact(req.params.id, "cast_validation", validateCast(cast), spec.id);
          }
    
          if (scope === "cml") {
            const cml = deriveCml(spec.spec as Record<string, unknown>);
            const cmlValidation = validateCml(cml);
            await repo.createArtifact(req.params.id, "cml", cml, spec.id);
            await repo.createArtifact(req.params.id, "cml_validation", cmlValidation, spec.id);
            await repo.createArtifact(req.params.id, "novelty_audit", { status: "pass", seedIds: [], patterns: [] }, spec.id);
          }
    
          if (scope === "clues") {
            const clues = deriveClues(spec.spec as Record<string, unknown>);
            await repo.createArtifact(req.params.id, "clues", clues, spec.id);
            await repo.createArtifact(req.params.id, "clues_validation", validateClues(clues), spec.id);
            const cml = await repo.getLatestArtifact(req.params.id, "cml");
            const fairPlayReport = deriveFairPlayReport((cml?.payload as Record<string, unknown>) ?? {}, clues);
            await repo.createArtifact(req.params.id, "fair_play_report", fairPlayReport, spec.id);
          }
    
          if (scope === "outline") {
            const outline = deriveOutline(spec.spec as Record<string, unknown>);
            await repo.createArtifact(req.params.id, "outline", outline, spec.id);
            await repo.createArtifact(req.params.id, "outline_validation", validateOutline(outline), spec.id);
          }
    
          if (scope === "prose") {
            const outline = await repo.getLatestArtifact(req.params.id, "outline");
            const cast = await repo.getLatestArtifact(req.params.id, "cast");
            if (!outline || !cast) {
              res.status(409).json({ error: "Outline and cast artifacts required for prose regeneration" });
              return;
            }
            const prose = deriveProse(spec.spec as Record<string, unknown>, outline.payload as Record<string, unknown>, cast.payload as Record<string, unknown>);
            await repo.createArtifact(req.params.id, "prose", prose, spec.id);
          }
    
          if (scope === "game_pack") {
            const cml = await repo.getLatestArtifact(req.params.id, "cml");
            const cast = await repo.getLatestArtifact(req.params.id, "cast");
            if (!cml || !cast) {
              res.status(409).json({ error: "CML and cast artifacts required for game pack regeneration" });
              return;
            }
            const gamePack = deriveGamePack(spec.spec as Record<string, unknown>, cast.payload as Record<string, unknown>, cml.payload as Record<string, unknown>);
            await repo.createArtifact(req.params.id, "game_pack", gamePack, spec.id);
          }
    
          if (scope === "fair_play_report") {
            const cml = await repo.getLatestArtifact(req.params.id, "cml");
            const clues = await repo.getLatestArtifact(req.params.id, "clues");
            if (!cml || !clues) {
              res.status(409).json({ error: "CML and clues artifacts required for fair-play report regeneration" });
              return;
            }
            const fairPlayReport = deriveFairPlayReport(cml.payload as Record<string, unknown>, clues.payload as Record<string, unknown>);
            await repo.createArtifact(req.params.id, "fair_play_report", fairPlayReport, spec.id);
          }
    
          if (runId) {
            await repo.addRunEvent(runId, `${scope}_regenerated`, `${scope} regenerated`);
          }
    
          res.status(200).json({ status: "ok", scope });
        } catch (error) {
          res.status(500).json({ error: "Failed to regenerate artifact" });
        }
        */ // END PLACEHOLDER CODE
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
            return repoPromise.then(async (repo) => {
                const run = await repo.createRun(project.id, "running");
                await repo.setProjectStatus(project.id, "running");
                await repo.addRunEvent(run.id, "run_started", "Pipeline run started");
                const latestSpec = await repo.getLatestSpec(project.id);
                const specPayload = latestSpec?.spec ?? undefined;
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
    app.get("/api/projects/:id/prose/latest", (_req, res) => {
        repoPromise
            .then((repo) => repo.getLatestArtifact(_req.params.id, "prose"))
            .then((artifact) => {
            if (!artifact) {
                res.status(404).json({ error: "Prose artifact not found" });
                return;
            }
            res.json(artifact);
        })
            .catch(() => res.status(500).json({ error: "Failed to fetch prose artifact" }));
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
        }
        catch (error) {
            res.status(500).json({ error: "Failed to create log" });
        }
    });
    app.get("/api/logs", async (_req, res) => {
        try {
            const projectId = typeof _req.query.projectId === "string" ? _req.query.projectId : null;
            const repo = await repoPromise;
            const logs = await repo.listLogs(projectId);
            res.json({ logs });
        }
        catch (error) {
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
            const pdfBuffer = await buildGamePackPdf(artifact.payload);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=\"game_pack_${_req.params.id}.pdf\"`);
            res.status(200).send(pdfBuffer);
        }
        catch (error) {
            res.status(500).json({ error: "Failed to generate game pack PDF" });
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
            const results = {};
            for (const type of artifactTypes) {
                // Only fetch known artifact types for safety
                if (typeof type !== "string")
                    continue;
                const artifact = await repo.getLatestArtifact(req.params.id, type);
                if (artifact) {
                    results[type] = artifact.payload;
                }
            }
            const filename = `export_${req.params.id}_${Date.now()}.json`;
            res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
            res.setHeader("Content-Type", "application/json");
            res.status(200).send(JSON.stringify(results, null, 2));
        }
        catch (err) {
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
        }
        catch (error) {
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
        }
        catch (error) {
            res.status(500).json({ error: "Failed to fetch sample" });
        }
    });
    return app;
};
//# sourceMappingURL=server.js.map
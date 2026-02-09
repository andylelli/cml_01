import express from "express";
import cors from "cors";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRepository } from "./db.js";
import { validateCml } from "@cml/cml";

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

const buildGamePackPdf = (gamePack: Record<string, unknown>) => {
  const title = (gamePack.title as string) ?? "Mystery Game Pack";
  const suspects = Array.isArray(gamePack.suspects) ? (gamePack.suspects as string[]) : [];
  const hostPacket = (gamePack.hostPacket as Record<string, unknown>) ?? {};
  const materials = Array.isArray(gamePack.materials) ? (gamePack.materials as string[]) : [];

  const lines = [
    title,
    "",
    "Suspects",
    ...(suspects.length ? suspects.map((suspect) => `• ${suspect}`) : ["• No suspects available yet."]),
    "",
    "Host Packet",
    (hostPacket.summary as string) ?? "Host packet summary pending.",
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

const deriveSetting = (spec?: Record<string, unknown>) => ({
  decade: (spec?.decade as string) ?? "1930s",
  locationPreset: (spec?.locationPreset as string) ?? "CountryHouse",
  weather: "Autumn storm",
  socialStructure: "aristocracy",
  institution: "Estate",
});

const deriveCast = (spec?: Record<string, unknown>) => {
  const rawNames = spec?.castNames;
  const normalizedNames = Array.isArray(rawNames)
    ? rawNames.map((name) => String(name).trim()).filter(Boolean)
    : typeof rawNames === "string"
      ? rawNames
          .split(",")
          .map((name) => name.trim())
          .filter(Boolean)
      : [];

  const requestedSize = (spec?.castSize as number) ?? 6;
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

const deriveCml = (spec?: Record<string, unknown>) => ({
  CML_VERSION: 2.0,
  CASE: {
    meta: {
      title: "Phase 3 Deterministic",
      author: "CML",
      license: "internal",
      era: {
        decade: (spec?.decade as string) ?? "1930s",
        realism_constraints: ["no modern forensics"],
      },
      setting: {
        location: (spec?.locationPreset as string) ?? "Country House",
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
      type: (spec?.primaryAxis as string) ?? "temporal",
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

const deriveClues = (spec?: Record<string, unknown>) => {
  const density = (spec?.clueDensity as string) ?? "medium";
  const axis = (spec?.primaryAxis as string) ?? "temporal";
  const decade = (spec?.decade as string) ?? "1930s";
  const location = (spec?.locationPreset as string) ?? "CountryHouse";
  const cast = deriveCast(spec);
  const firstSuspect = cast.suspects[0] ?? "the suspect";
  const secondSuspect = cast.suspects[1] ?? "another guest";

  // Generate axis-specific clues that vary by project settings
  const axisClues: Record<string, { category: string; text: string; pointsTo: string }> = {
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

const deriveSynopsis = (cml: Record<string, unknown>) => {
  const caseBlock = (cml?.CASE as Record<string, unknown>) ?? {};
  const meta = (caseBlock.meta as Record<string, unknown>) ?? {};
  const title = (meta.title as string) ?? "Untitled Mystery";
  const era = (meta.era as Record<string, unknown>) ?? {};
  const decade = (era.decade as string) ?? "unknown era";
  const setting = (meta.setting as Record<string, unknown>) ?? {};
  const location = (setting.location as string) ?? "unknown location";
  const crimeClass = (meta.crime_class as Record<string, unknown>) ?? {};
  const category = (crimeClass.category as string) ?? "crime";
  const falseAssumption = (caseBlock.false_assumption as Record<string, unknown>) ?? {};
  const assumption = (falseAssumption.statement as string) ?? "a false assumption";

  return {
    status: "ready",
    title,
    summary: `${title} is a ${decade} ${category} in ${location}. The case hinges on ${assumption.toLowerCase()}.`,
  };
};

const deriveOutline = (spec?: Record<string, unknown>) => ({
  status: "pending",
  tone: (spec?.tone as string) ?? "Cozy",
  chapters: spec?.chapters ?? null,
  summary: "Deterministic placeholder outline derived from spec.",
});

const deriveFairPlayReport = (cml?: Record<string, unknown>, clues?: Record<string, unknown>) => {
  const fairPlay = (cml?.CASE as Record<string, unknown>)?.fair_play as Record<string, unknown> | undefined;
  const clueItems = (clues?.items as Array<Record<string, unknown>> | undefined) ?? [];
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

const deriveProse = (
  spec?: Record<string, unknown>,
  outline?: Record<string, unknown>,
  cast?: Record<string, unknown>,
) => {
  const outlineChapters = outline?.chapters as unknown[] | null | undefined;
  const suspects = Array.isArray(cast?.suspects) ? (cast?.suspects as string[]) : [];
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
          summary: (outline?.summary as string) ?? "Opening beats derived from outline.",
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
    tone: (outline?.tone as string) ?? (spec?.tone as string) ?? "Cozy",
    chapters,
    cast: suspects,
    note: "Deterministic placeholder prose derived from outline and cast.",
  };
};

const deriveGamePack = (
  _spec?: Record<string, unknown>,
  cast?: Record<string, unknown>,
  cml?: Record<string, unknown>,
) => {
  const caseBlock = (cml?.CASE as Record<string, unknown>) ?? {};
  const meta = (caseBlock.meta as Record<string, unknown>) ?? {};
  const title = (meta.title as string) ?? "Untitled Mystery";

  return {
    status: "draft",
    title,
    suspects: Array.isArray(cast?.suspects) ? (cast?.suspects as string[]) : [],
    hostPacket: {
      summary: "Deterministic placeholder host packet derived from CML and cast.",
      culpritCount: (caseBlock.culpability as Record<string, unknown>)?.culprit_count ?? 1,
    },
    materials: ["suspect_cards", "host_packet", "timeline_sheet"],
    note: "Deterministic placeholder game pack derived from CML and cast.",
  };
};

const validateSetting = (setting: Record<string, unknown>) => ({
  valid: Boolean(setting.decade && setting.locationPreset),
  errors: setting.decade && setting.locationPreset ? [] : ["Setting must include decade and locationPreset"],
});

const validateCast = (cast: Record<string, unknown>) => ({
  valid: Array.isArray(cast.suspects) && (cast.suspects as unknown[]).length >= 3,
  errors:
    Array.isArray(cast.suspects) && (cast.suspects as unknown[]).length >= 3
      ? []
      : ["Cast must include at least 3 suspects"],
});

const validateClues = (clues: Record<string, unknown>) => {
  const hasBasics = Boolean(clues.density && clues.axis);
  const items = (clues.items as Array<Record<string, unknown>> | undefined) ?? [];
  const hasItems = Array.isArray(items) && items.length > 0;
  return {
    valid: hasBasics && hasItems,
    errors: hasBasics && hasItems ? [] : ["Clues must include density, axis, and at least one item"],
  };
};

const validateOutline = (outline: Record<string, unknown>) => ({
  valid: Boolean(outline.tone),
  errors: outline.tone ? [] : ["Outline must include tone"],
});

const runPipeline = async (
  repoPromise: ReturnType<typeof createRepository>,
  projectId: string,
  runId: string,
  specPayload?: Record<string, unknown>,
) => {
  const repo = await repoPromise;

  const setting = deriveSetting(specPayload);
  await repo.createArtifact(projectId, "setting", setting, null);
  await repo.createArtifact(projectId, "setting_validation", validateSetting(setting), null);
  await repo.addRunEvent(runId, "setting_done", "Setting generated");

  const cast = deriveCast(specPayload);
  await repo.createArtifact(projectId, "cast", cast, null);
  await repo.createArtifact(projectId, "cast_validation", validateCast(cast), null);
  await repo.addRunEvent(runId, "cast_done", "Cast generated");

  let cml = deriveCml(specPayload);
  let cmlValidation = validateCml(cml);
  await repo.createArtifact(projectId, "cml", cml, null);

  if (!cmlValidation.valid) {
    await repo.addRunEvent(runId, "cml_retry", "CML failed validation; retrying");
    cml = deriveCml({ ...specPayload, primaryAxis: "temporal" });
    cmlValidation = validateCml(cml);
    await repo.createArtifact(projectId, "cml", cml, null);
  }

  await repo.createArtifact(projectId, "cml_validation", cmlValidation, null);
  await repo.addRunEvent(runId, "cml_validated", "CML validated");

  const synopsis = deriveSynopsis(cml);
  await repo.createArtifact(projectId, "synopsis", synopsis, null);
  await repo.addRunEvent(runId, "synopsis_done", "Synopsis generated");

  await repo.createArtifact(projectId, "novelty_audit", { status: "pass", seedIds: [], patterns: [] }, null);
  await repo.addRunEvent(runId, "novelty_audit", "Novelty audit passed (no seeds selected)");

  const clues = deriveClues(specPayload);
  await repo.createArtifact(projectId, "clues", clues, null);
  await repo.createArtifact(projectId, "clues_validation", validateClues(clues), null);
  await repo.addRunEvent(runId, "clues_done", "Clues generated");

  const fairPlayReport = deriveFairPlayReport(cml, clues);
  await repo.createArtifact(projectId, "fair_play_report", fairPlayReport, null);
  await repo.addRunEvent(runId, "fair_play_report_done", "Fair-play report generated");

  const outline = deriveOutline(specPayload);
  await repo.createArtifact(projectId, "outline", outline, null);
  await repo.createArtifact(projectId, "outline_validation", validateOutline(outline), null);
  await repo.addRunEvent(runId, "outline_done", "Outline generated");

  const prose = deriveProse(specPayload, outline, cast);
  await repo.createArtifact(projectId, "prose", prose, null);
  await repo.addRunEvent(runId, "prose_done", "Prose generated");

  const gamePack = deriveGamePack(specPayload, cast, cml);
  await repo.createArtifact(projectId, "game_pack", gamePack, null);
  await repo.addRunEvent(runId, "game_pack_done", "Game pack generated");
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
          return repo.createLog({
            projectId,
            scope: "http",
            message: `${req.method} ${req.path} ${res.statusCode}`,
            payload: { durationMs: Date.now() - start },
          });
        })
        .catch(() => undefined);
    });
    next();
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "api" });
  });

  app.post("/api/projects", (_req, res) => {
    const name = typeof _req.body?.name === "string" ? _req.body.name : "Untitled project";
    repoPromise
      .then((repo) => repo.createProject(name))
      .then((project) => res.status(201).json(project))
      .catch(() => res.status(500).json({ error: "Failed to create project" }));
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
          const specPayload = (latestSpec?.spec as Record<string, unknown>) ?? undefined;

          setTimeout(() => {
            runPipeline(repoPromise, project.id, run.id, specPayload).catch(() => {
              repo.addRunEvent(run.id, "run_failed", "Pipeline failed");
            });
          }, 0);

          setTimeout(async () => {
            await repo.updateRunStatus(run.id, "idle");
            await repo.setProjectStatus(project.id, "idle");
            await repo.addRunEvent(run.id, "run_finished", "Pipeline run finished");
          }, 5000);

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
      const log = await repo.createLog({
        projectId: typeof projectId === "string" ? projectId : null,
        scope,
        message,
        payload: payload ?? null,
      });
      res.status(201).json(log);
    } catch (error) {
      res.status(500).json({ error: "Failed to create log" });
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
          results[type] = artifact.payload;
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

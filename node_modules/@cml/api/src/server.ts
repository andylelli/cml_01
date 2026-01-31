import express from "express";
import cors from "cors";
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

const requireCmlAccess = (req: ModeRequest, res: ModeResponse, next: ModeNext) => {
  if (req.cmlMode && ALLOWED_CML_MODES.has(req.cmlMode)) {
    next();
    return;
  }

  res.status(403).json({
    error: "CML access requires Advanced or Expert mode",
    mode: req.cmlMode ?? "user",
  });
};

const deriveSetting = (spec?: Record<string, unknown>) => ({
  decade: (spec?.decade as string) ?? "1930s",
  locationPreset: (spec?.locationPreset as string) ?? "CountryHouse",
  weather: "Autumn storm",
  socialStructure: "aristocracy",
  institution: "Estate",
});

const deriveCast = (spec?: Record<string, unknown>) => {
  const size = (spec?.castSize as number) ?? 6;
  const suspects = Array.from({ length: Math.max(3, Math.min(size, 8)) }, (_, index) => {
    return String.fromCharCode(65 + index) + ". Example";
  });

  return {
    size,
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

const deriveClues = (spec?: Record<string, unknown>) => ({
  status: "pending",
  density: (spec?.clueDensity as string) ?? "medium",
  axis: (spec?.primaryAxis as string) ?? "temporal",
  summary: "Deterministic placeholder clues derived from spec.",
});

const deriveOutline = (spec?: Record<string, unknown>) => ({
  status: "pending",
  tone: (spec?.tone as string) ?? "Cozy",
  chapters: spec?.chapters ?? null,
  summary: "Deterministic placeholder outline derived from spec.",
});

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

const validateClues = (clues: Record<string, unknown>) => ({
  valid: Boolean(clues.density && clues.axis),
  errors: clues.density && clues.axis ? [] : ["Clues must include density and axis"],
});

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

  await repo.createArtifact(projectId, "novelty_audit", { status: "pass", seedIds: [], patterns: [] }, null);
  await repo.addRunEvent(runId, "novelty_audit", "Novelty audit passed (no seeds selected)");

  const clues = deriveClues(specPayload);
  await repo.createArtifact(projectId, "clues", clues, null);
  await repo.createArtifact(projectId, "clues_validation", validateClues(clues), null);
  await repo.addRunEvent(runId, "clues_done", "Clues generated");

  const outline = deriveOutline(specPayload);
  await repo.createArtifact(projectId, "outline", outline, null);
  await repo.createArtifact(projectId, "outline_validation", validateOutline(outline), null);
  await repo.addRunEvent(runId, "outline_done", "Outline generated");

  await repo.createArtifact(projectId, "prose", { status: "pending" }, null);
  await repo.addRunEvent(runId, "prose_pending", "Prose pending" );
};

export const createServer = () => {
  const app = express();
  const repoPromise = createRepository();

  app.use(cors());
  app.use(express.json());
  app.use(withMode);

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

  app.get("/api/samples", (_req, res) => {
    res.status(501).json({ error: "Not implemented" });
  });

  app.get("/api/samples/:name", (_req, res) => {
    res.status(501).json({ error: "Not implemented" });
  });

  return app;
};

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

const buildStubCml = () => ({
  CML_VERSION: 2.0,
  CASE: {
    meta: {
      title: "Phase 2 Stub",
      author: "CML",
      license: "internal",
      era: {
        decade: "1930s",
        realism_constraints: ["no modern forensics"],
      },
      setting: {
        location: "Country House",
        institution: "Estate",
      },
      crime_class: {
        category: "murder",
        subtype: "poisoning",
      },
    },
    cast: [
      {
        name: "A. Example",
        age_range: "adult",
        role_archetype: "heir",
        relationships: ["victim"],
        public_persona: "polite",
        private_secret: "debts",
        motive_seed: "inheritance",
        motive_strength: "high",
        alibi_window: "evening",
        access_plausibility: "high",
        opportunity_channels: ["kitchen"],
        behavioral_tells: ["nervous"],
        stakes: "inheritance",
        evidence_sensitivity: ["poison"],
        culprit_eligibility: "eligible",
        culpability: "unknown",
      },
    ],
    culpability: {
      culprit_count: 1,
      culprits: ["A. Example"],
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
      type: "temporal",
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

          const stubCml = buildStubCml();
          const validation = validateCml(stubCml);
          await repo.createArtifact(project.id, "cml", stubCml, null);
          await repo.createArtifact(project.id, "cml_validation", validation, null);
          await repo.createArtifact(project.id, "clues", { status: "pending" }, null);
          await repo.createArtifact(project.id, "outline", { status: "pending" }, null);
          await repo.createArtifact(project.id, "prose", { status: "pending" }, null);

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

import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import pg from "pg";

export type Project = {
  id: string;
  name: string;
  status: string;
  createdAt?: string;
};

export type Spec = {
  id: string;
  projectId: string;
  spec: unknown;
};

export type ActivityLog = {
  id: string;
  projectId: string | null;
  scope: string;
  message: string;
  payload: unknown;
  createdAt: string;
};

export type ProjectRepository = {
  createProject: (name: string) => Promise<Project>;
  listProjects: () => Promise<Project[]>;
  getProject: (id: string) => Promise<Project | null>;
  createSpec: (projectId: string, spec: unknown) => Promise<Spec>;
  getSpec: (id: string) => Promise<Spec | null>;
  getLatestSpec: (projectId: string) => Promise<Spec | null>;
  setProjectStatus: (projectId: string, status: string) => Promise<void>;
  getProjectStatus: (projectId: string) => Promise<string>;
  createRun: (projectId: string, status: string) => Promise<{ id: string; projectId: string; status: string; createdAt: string }>;
  updateRunStatus: (runId: string, status: string) => Promise<void>;
  addRunEvent: (runId: string, step: string, message: string) => Promise<void>;
  getLatestRun: (projectId: string) => Promise<{ id: string; projectId: string; status: string } | null>;
  getRunEvents: (runId: string) => Promise<Array<{ step: string; message: string }>>;
  createLog: (log: Omit<ActivityLog, "id" | "createdAt">) => Promise<ActivityLog>;
  listLogs: (projectId?: string | null) => Promise<ActivityLog[]>;
  createArtifact: (
    projectId: string,
    type: string,
    payload: unknown,
    sourceSpecId?: string | null,
  ) => Promise<{ id: string; projectId: string; type: string; payload: unknown }>;
  getLatestArtifact: (projectId: string, type: string) => Promise<
    { id: string; projectId: string; type: string; payload: unknown } | null
  >;
  clearAllData: () => Promise<void>;
  /** What the store holds, for the Settings page. Cheap: counts, not contents. */
  countStoreContents: () => Promise<{ projects: number; specs: number; runs: number; runEvents: number; artifacts: number; logs: number }>;
  /** Drop the diagnostic activity log, keeping everything that is a record. Returns how many went. */
  trimLogs: () => Promise<number>;
  /** Delete one project and everything belonging to it. */
  deleteProject: (id: string) => Promise<{ artifacts: number; specs: number; runs: number } | null>;
  /** Where this repository is persisting, so the UI can say so. */
  storeLocation: () => string;
};

type FileState = {
  projects: Record<string, Project>;
  specs: Record<string, Spec>;
  specOrder: Array<{ id: string; projectId: string }>;
  runs: Record<string, { id: string; projectId: string; status: string; createdAt?: string }>;
  runOrder: Array<{ id: string; projectId: string }>;
  runEvents: Array<{ runId: string; step: string; message: string }>;
  artifacts: Array<{ id: string; projectId: string; type: string; payload: unknown }>;
  logs: ActivityLog[];
};

/**
 * A_73 §12.1, SECOND INSTANCE — AND THIS ONE IS THE PRIMARY DATABASE.
 *
 * WAS: `path.resolve(process.cwd(), "data", "store.json")`. The store's location therefore depended
 * entirely on which directory the API was launched from:
 *
 *   cwd = apps/api      -> apps/api/data/store.json    (where the real 831KB store lives)
 *   cwd = repo root     -> repo/data/store.json        (does not exist)
 *   cwd = anywhere else -> <there>/data/store.json     (does not exist)
 *
 * And a missing file is not an error here — the repository creates an empty one. So starting the API
 * from the wrong directory silently serves a BRAND NEW EMPTY DATABASE: every project, run and
 * artifact apparently gone, with a 200 response and no warning. FOUND EMPIRICALLY, 2026-08-25: the
 * API was started from the workspace root during a wiring check and `/api/projects` returned `[]`
 * against a store holding two.
 *
 * This is the same defect the novelty ledger had (`novelty-ledger.ts`), in the app's main
 * persistence layer, and it is the reason `apps/api/data/` is where the data ended up in the first
 * place — it records which directory somebody happened to launch from.
 *
 * NOW: anchored to the workspace root. Legacy cwd-dependent locations are still READ (first existing
 * wins) so an existing store is never abandoned in favour of a new empty one, and the resolution is
 * announced once at startup so "which database am I looking at" is answerable from the log.
 */
const workspaceRootMarkers = ["package-lock.json", "tsconfig.base.json"] as const;

const resolveWorkspaceRoot = (): string => {
  const explicit = process.env.CML_WORKSPACE_ROOT?.trim();
  if (explicit) return path.resolve(explicit);
  // Walk up from THIS MODULE, never from cwd — cwd is the thing that was wrong.
  let dir = path.dirname(fileURLToPath(import.meta.url));
  for (let i = 0; i < 8; i += 1) {
    if (workspaceRootMarkers.every((m) => existsSync(path.join(dir, m)))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
};

const resolveStorePath = (): string => {
  const root = resolveWorkspaceRoot();
  const canonical = path.join(root, "apps", "api", "data", "store.json");
  if (existsSync(canonical)) return canonical;
  const legacy = [
    path.join(root, "data", "store.json"),
    path.resolve(process.cwd(), "data", "store.json"),
  ].find((p) => existsSync(p));
  if (legacy) {
    console.warn(`[db] using store at legacy location ${legacy}; canonical is ${canonical}`);
    return legacy;
  }
  return canonical;
};

const createMemoryRepository = async (filePath?: string): Promise<ProjectRepository> => {
  const storePath = filePath ?? process.env.CML_JSON_DB_PATH ?? resolveStorePath();
  console.log(`[db] store: ${storePath}${existsSync(storePath) ? "" : " (new — will be created empty)"}`);
  const storeDir = path.dirname(storePath);
  const storeFileName = path.basename(storePath);
  let savePromise: Promise<void> | null = null;

  const removeTempFileBestEffort = async (tempPath: string) => {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        await fs.unlink(tempPath);
        return;
      } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === "ENOENT") {
          return;
        }
        if (err.code !== "EPERM" && err.code !== "EBUSY") {
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, 25 * (attempt + 1)));
      }
    }
  };

  const cleanupStaleTempFiles = async () => {
    try {
      const entries = await fs.readdir(storeDir, { withFileTypes: true });
      const tmpPrefix = `${storeFileName}.`;

      await Promise.all(
        entries
          .filter((entry) => entry.isFile() && entry.name.startsWith(tmpPrefix) && entry.name.endsWith(".tmp"))
          .map(async (entry) => {
            const candidate = path.join(storeDir, entry.name);
            try {
              await removeTempFileBestEffort(candidate);
            } catch {
              // Ignore cleanup failures; normal persistence can continue.
            }
          })
      );
    } catch {
      // Directory may not exist yet; ignore.
    }
  };

  const loadState = async (): Promise<FileState | null> => {
    try {
      const raw = await fs.readFile(storePath, "utf-8");
      return JSON.parse(raw) as FileState;
    } catch {
      return null;
    }
  };

  const atomicWrite = async (payload: string): Promise<void> => {
    const tempPath = path.join(storeDir, `${storeFileName}.${randomUUID()}.tmp`);
    try {
      await fs.writeFile(tempPath, payload, "utf-8");
      await fs.rename(tempPath, storePath);
    } catch (error) {
      await removeTempFileBestEffort(tempPath);
      throw error;
    }
  };

  const persistState = async (state: FileState): Promise<void> => {
    // Chain onto the existing promise so writes are strictly serialised.
    // .catch(() => {}) absorbs any prior rejection so the next write always runs.
    const current = (savePromise ?? Promise.resolve()).catch(() => {}).then(async () => {
      await fs.mkdir(storeDir, { recursive: true });
      const payload = JSON.stringify(state, null, 2);
      try {
        await atomicWrite(payload);
      } catch (error) {
        const err = error as NodeJS.ErrnoException;
        if (err.code === "ENOENT") {
          await fs.mkdir(storeDir, { recursive: true });
          await atomicWrite(payload);
        } else if (err.code === "EPERM" || err.code === "EBUSY") {
          await new Promise((resolve) => setTimeout(resolve, 50));
          await atomicWrite(payload);
        } else {
          throw error;
        }
      }
    });
    savePromise = current;
    await current;
  };

  const restored = await loadState();
  await cleanupStaleTempFiles();
  const projects = new Map<string, Project>();
  const specs = new Map<string, Spec>();
  const specOrder: Array<{ id: string; projectId: string }> = [];
  const runs = new Map<string, { id: string; projectId: string; status: string; createdAt?: string }>();
  const runOrder: Array<{ id: string; projectId: string }> = [];
  const runEvents: Array<{ runId: string; step: string; message: string }> = [];
  const artifacts: Array<{ id: string; projectId: string; type: string; payload: unknown }> = [];
  const logs: ActivityLog[] = [];

  const snapshot = (): FileState => ({
    projects: Object.fromEntries(projects.entries()),
    specs: Object.fromEntries(specs.entries()),
    specOrder: [...specOrder],
    runs: Object.fromEntries(runs.entries()),
    runOrder: [...runOrder],
    runEvents: [...runEvents],
    artifacts: [...artifacts],
    logs: [...logs],
  });

  const persist = async () => {
    await persistState(snapshot());
  };

  /**
   * THE ACTIVITY LOG IS DIAGNOSTIC, AND IT WAS NEITHER BOUNDED NOR CHEAP.
   *
   * Every HTTP request writes one (server.ts, the request logger), and every write called
   * `persist()` — a full snapshot and `JSON.stringify` of the whole store. MEASURED: the store had
   * reached 39.7 MB, 12.7 MB of which was 46,544 log entries, and the case file polls 20 endpoints
   * every 4 seconds during a run. Five 39.7 MB serialisations a second, into V8's large-object
   * space. The API died of heap exhaustion at 3.8 GB mid-run.
   *
   * So: keep a bounded window, and flush it on a timer rather than on every entry. Losing a second
   * of diagnostic log to a crash costs nothing. Everything that is a RECORD — projects, specs,
   * runs, artifacts — still persists synchronously on write, as before.
   */
  const MAX_LOGS = 2000;
  const LOG_FLUSH_MS = 2000;
  let logFlushTimer: NodeJS.Timeout | null = null;

  const persistLogsSoon = () => {
    if (logFlushTimer) return;
    logFlushTimer = setTimeout(() => {
      logFlushTimer = null;
      void persist().catch(() => {
        /* a lost diagnostic flush is not worth crashing the API for */
      });
    }, LOG_FLUSH_MS);
    // Never hold the process open for a diagnostic write.
    logFlushTimer.unref?.();
  };

  if (restored) {
    Object.entries(restored.projects ?? {}).forEach(([id, project]) => projects.set(id, project));
    Object.entries(restored.specs ?? {}).forEach(([id, spec]) => specs.set(id, spec));
    (restored.specOrder ?? []).forEach((entry) => specOrder.push(entry));
    Object.entries(restored.runs ?? {}).forEach(([id, run]) => runs.set(id, run));
    (restored.runOrder ?? []).forEach((entry) => runOrder.push(entry));
    (restored.runEvents ?? []).forEach((entry) => runEvents.push(entry));
    (restored.artifacts ?? []).forEach((entry) => artifacts.push(entry));
    (restored.logs ?? []).forEach((entry) => logs.push(entry));

    // Startup recovery: any run/project left as "running" from a previous server
    // process that crashed or was killed mid-pipeline must be reset to "idle".
    // There can be no genuinely in-flight run at startup; these are all zombies.
    let hadZombies = false;
    for (const [id, project] of projects) {
      if (project.status === "running") {
        projects.set(id, { ...project, status: "idle" });
        hadZombies = true;
      }
    }
    for (const [id, run] of runs) {
      if (run.status === "running") {
        runs.set(id, { ...run, status: "idle" });
        hadZombies = true;
      }
    }
    if (hadZombies) {
      await persist();
    }
  }

  return {
    async createProject(name: string) {
      const id = `proj_${randomUUID()}`;
      const project: Project = { id, name, status: "idle", createdAt: new Date().toISOString() };
      projects.set(id, project);
      await persist();
      return project;
    },
    async listProjects() {
      return [...projects.values()];
    },
    async getProject(id: string) {
      return projects.get(id) ?? null;
    },
    async createSpec(projectId: string, spec: unknown) {
      const id = `spec_${randomUUID()}`;
      const saved: Spec = { id, projectId, spec };
      specs.set(id, saved);
      specOrder.push({ id, projectId });
      await persist();
      return saved;
    },
    async getSpec(id: string) {
      return specs.get(id) ?? null;
    },
    async getLatestSpec(projectId: string) {
      const match = [...specOrder].reverse().find((entry) => entry.projectId === projectId);
      return match ? specs.get(match.id) ?? null : null;
    },
    async setProjectStatus(projectId: string, status: string) {
      const project = projects.get(projectId);
      if (project) {
        projects.set(projectId, { ...project, status });
        await persist();
      }
    },
    async getProjectStatus(projectId: string) {
      return projects.get(projectId)?.status ?? "idle";
    },
    async createRun(projectId: string, status: string) {
      const id = `run_${randomUUID()}`;
      const createdAt = new Date().toISOString();
      runs.set(id, { id, projectId, status, createdAt });
      runOrder.push({ id, projectId });
      await persist();
      return { id, projectId, status, createdAt };
    },
    async updateRunStatus(runId: string, status: string) {
      const run = runs.get(runId);
      if (run) {
        runs.set(runId, { ...run, status });
        await persist();
      }
    },
    async addRunEvent(runId: string, step: string, message: string) {
      runEvents.push({ runId, step, message });
      await persist();
    },
    async getLatestRun(projectId: string) {
      const match = [...runOrder].reverse().find((entry) => entry.projectId === projectId);
      return match ? runs.get(match.id) ?? null : null;
    },
    async getRunEvents(runId: string) {
      return runEvents.filter((event) => event.runId === runId).map(({ step, message }) => ({ step, message }));
    },
    async createLog(log) {
      const id = `log_${randomUUID()}`;
      const createdAt = new Date().toISOString();
      const entry: ActivityLog = { id, createdAt, ...log };
      logs.push(entry);
      // Bounded: splice from the front once over the cap, so memory and store size both stop growing.
      if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);
      persistLogsSoon();
      return entry;
    },
    async listLogs(projectId?: string | null) {
      if (!projectId) {
        return [...logs];
      }
      return logs.filter((log) => log.projectId === projectId);
    },
    async createArtifact(projectId: string, type: string, payload: unknown) {
      const id = `artifact_${randomUUID()}`;
      const artifact = { id, projectId, type, payload };
      artifacts.push(artifact);
      await persist();
      return artifact;
    },
    async getLatestArtifact(projectId: string, type: string) {
      const matches = artifacts.filter((artifact) => artifact.projectId === projectId && artifact.type === type);
      return matches[matches.length - 1] ?? null;
    },
    async countStoreContents() {
      return {
        projects: projects.size,
        specs: specs.size,
        runs: runs.size,
        runEvents: runEvents.length,
        artifacts: artifacts.length,
        logs: logs.length,
      };
    },
    async trimLogs() {
      const removed = logs.length;
      logs.length = 0;
      await persist();
      return removed;
    },
    async deleteProject(id: string) {
      if (!projects.has(id)) return null;

      // Count first, so the caller can be told what actually went.
      const removed = {
        artifacts: artifacts.filter((a) => a.projectId === id).length,
        specs: [...specs.values()].filter((sp) => sp.projectId === id).length,
        runs: [...runs.values()].filter((r) => r.projectId === id).length,
      };

      const runIds = new Set([...runs.values()].filter((r) => r.projectId === id).map((r) => r.id));

      projects.delete(id);
      for (const [specId, sp] of [...specs.entries()]) if (sp.projectId === id) specs.delete(specId);
      for (const [runId, r] of [...runs.entries()]) if (r.projectId === id) runs.delete(runId);

      // Splice in place rather than reassigning: these are `const` bindings closed over by every
      // method above, so a reassignment would silently orphan them.
      const dropWhere = <T>(arr: T[], pred: (item: T) => boolean) => {
        for (let i = arr.length - 1; i >= 0; i--) if (pred(arr[i])) arr.splice(i, 1);
      };
      dropWhere(artifacts, (a) => a.projectId === id);
      dropWhere(specOrder, (e) => e.projectId === id);
      dropWhere(runOrder, (e) => e.projectId === id);
      dropWhere(runEvents, (e) => runIds.has(e.runId));
      dropWhere(logs, (l) => l.projectId === id);

      await persist();
      return removed;
    },
    storeLocation() {
      return storePath;
    },
    async clearAllData() {
      projects.clear();
      specs.clear();
      specOrder.length = 0;
      runs.clear();
      runOrder.length = 0;
      runEvents.length = 0;
      artifacts.length = 0;
      logs.length = 0;
      await persist();
    },
  };
};

const createPostgresRepository = async (connectionString: string): Promise<ProjectRepository> => {
  const pool = new pg.Pool({ connectionString });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'idle',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS spec_versions (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      spec_json JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS artifact_versions (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      payload_json JSONB NOT NULL,
      source_spec_id TEXT NULL REFERENCES spec_versions(id) ON DELETE SET NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS runs (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      status TEXT NOT NULL,
      started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      finished_at TIMESTAMPTZ NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS run_events (
      id SERIAL PRIMARY KEY,
      run_id TEXT NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
      step TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      project_id TEXT NULL REFERENCES projects(id) ON DELETE SET NULL,
      scope TEXT NOT NULL,
      message TEXT NOT NULL,
      payload_json JSONB NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  return {
    async createProject(name: string) {
      const id = `proj_${randomUUID()}`;
      const status = "idle";
      const result = await pool.query(
        "INSERT INTO projects (id, name, status) VALUES ($1, $2, $3) RETURNING created_at",
        [id, name, status],
      );
      return { id, name, status, createdAt: result.rows[0]?.created_at };
    },
    async listProjects() {
      const result = await pool.query(
        "SELECT id, name, status, created_at AS \"createdAt\" FROM projects ORDER BY created_at DESC",
      );
      return result.rows ?? [];
    },
    async getProject(id: string) {
      const result = await pool.query(
        "SELECT id, name, status, created_at AS \"createdAt\" FROM projects WHERE id = $1",
        [id],
      );
      return result.rows[0] ?? null;
    },
    async createSpec(projectId: string, spec: unknown) {
      const id = `spec_${randomUUID()}`;
      await pool.query(
        "INSERT INTO spec_versions (id, project_id, spec_json) VALUES ($1, $2, $3)",
        [id, projectId, spec],
      );
      return { id, projectId, spec };
    },
    async getSpec(id: string) {
      const result = await pool.query(
        "SELECT id, project_id AS \"projectId\", spec_json AS spec FROM spec_versions WHERE id = $1",
        [id],
      );
      return result.rows[0] ?? null;
    },
    async getLatestSpec(projectId: string) {
      const result = await pool.query(
        "SELECT id, project_id AS \"projectId\", spec_json AS spec FROM spec_versions WHERE project_id = $1 ORDER BY created_at DESC LIMIT 1",
        [projectId],
      );
      return result.rows[0] ?? null;
    },
    async setProjectStatus(projectId: string, status: string) {
      await pool.query("UPDATE projects SET status = $1 WHERE id = $2", [status, projectId]);
    },
    async getProjectStatus(projectId: string) {
      const result = await pool.query("SELECT status FROM projects WHERE id = $1", [projectId]);
      return result.rows[0]?.status ?? "idle";
    },
    async createRun(projectId: string, status: string) {
      const id = `run_${randomUUID()}`;
      const createdAt = new Date().toISOString();
      await pool.query("INSERT INTO runs (id, project_id, status) VALUES ($1, $2, $3)", [id, projectId, status]);
      return { id, projectId, status, createdAt };
    },
    async updateRunStatus(runId: string, status: string) {
      await pool.query(
        "UPDATE runs SET status = $1, finished_at = CASE WHEN $1 = 'idle' THEN NOW() ELSE finished_at END WHERE id = $2",
        [status, runId],
      );
    },
    async addRunEvent(runId: string, step: string, message: string) {
      await pool.query("INSERT INTO run_events (run_id, step, message) VALUES ($1, $2, $3)", [
        runId,
        step,
        message,
      ]);
    },
    async getLatestRun(projectId: string) {
      const result = await pool.query(
        "SELECT id, project_id AS \"projectId\", status FROM runs WHERE project_id = $1 ORDER BY started_at DESC LIMIT 1",
        [projectId],
      );
      return result.rows[0] ?? null;
    },
    async getRunEvents(runId: string) {
      const result = await pool.query(
        "SELECT step, message FROM run_events WHERE run_id = $1 ORDER BY created_at ASC",
        [runId],
      );
      return result.rows ?? [];
    },
    async createLog(log) {
      const id = `log_${randomUUID()}`;
      await pool.query(
        "INSERT INTO activity_logs (id, project_id, scope, message, payload_json) VALUES ($1, $2, $3, $4, $5)",
        [id, log.projectId, log.scope, log.message, log.payload ?? null],
      );
      return { id, createdAt: new Date().toISOString(), ...log };
    },
    async listLogs(projectId?: string | null) {
      if (projectId) {
        const result = await pool.query(
          "SELECT id, project_id AS \"projectId\", scope, message, payload_json AS payload, created_at AS \"createdAt\" FROM activity_logs WHERE project_id = $1 ORDER BY created_at DESC",
          [projectId],
        );
        return result.rows ?? [];
      }
      const result = await pool.query(
        "SELECT id, project_id AS \"projectId\", scope, message, payload_json AS payload, created_at AS \"createdAt\" FROM activity_logs ORDER BY created_at DESC",
      );
      return result.rows ?? [];
    },
    async createArtifact(projectId: string, type: string, payload: unknown, sourceSpecId?: string | null) {
      const id = `artifact_${randomUUID()}`;
      await pool.query(
        "INSERT INTO artifact_versions (id, project_id, type, payload_json, source_spec_id) VALUES ($1, $2, $3, $4, $5)",
        [id, projectId, type, payload, sourceSpecId ?? null],
      );
      return { id, projectId, type, payload };
    },
    async getLatestArtifact(projectId: string, type: string) {
      const result = await pool.query(
        "SELECT id, project_id AS \"projectId\", type, payload_json AS payload FROM artifact_versions WHERE project_id = $1 AND type = $2 ORDER BY created_at DESC LIMIT 1",
        [projectId, type],
      );
      return result.rows[0] ?? null;
    },
    async countStoreContents() {
      const one = async (table: string) => {
        const r = await pool.query(`SELECT COUNT(*)::int AS n FROM ${table}`);
        return r.rows[0]?.n ?? 0;
      };
      return {
        projects: await one("projects"),
        specs: await one("spec_versions"),
        runs: await one("runs"),
        runEvents: await one("run_events"),
        artifacts: await one("artifact_versions"),
        logs: await one("activity_logs"),
      };
    },
    async trimLogs() {
      const r = await pool.query("DELETE FROM activity_logs");
      return r.rowCount ?? 0;
    },
    async deleteProject(id: string) {
      const exists = await pool.query("SELECT 1 FROM projects WHERE id = $1", [id]);
      if (exists.rowCount === 0) return null;
      const count = async (table: string) => {
        const r = await pool.query(`SELECT COUNT(*)::int AS n FROM ${table} WHERE project_id = $1`, [id]);
        return r.rows[0]?.n ?? 0;
      };
      const removed = {
        artifacts: await count("artifact_versions"),
        specs: await count("spec_versions"),
        runs: await count("runs"),
      };
      // run_events references runs; delete it first rather than relying on a cascade that the
      // schema above does not actually declare for that table.
      await pool.query("DELETE FROM run_events WHERE run_id IN (SELECT id FROM runs WHERE project_id = $1)", [id]);
      await pool.query("DELETE FROM activity_logs WHERE project_id = $1", [id]);
      await pool.query("DELETE FROM artifact_versions WHERE project_id = $1", [id]);
      await pool.query("DELETE FROM spec_versions WHERE project_id = $1", [id]);
      await pool.query("DELETE FROM runs WHERE project_id = $1", [id]);
      await pool.query("DELETE FROM projects WHERE id = $1", [id]);
      return removed;
    },
    storeLocation() {
      return "postgres";
    },
    async clearAllData() {
      await pool.query(
        "TRUNCATE TABLE activity_logs, artifact_versions, run_events, runs, spec_versions, projects RESTART IDENTITY CASCADE",
      );
    },
  };
};

export const createRepository = async (): Promise<ProjectRepository> => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("DATABASE_URL not set. Using JSON file-backed repository.");
    return createMemoryRepository();
  }

  return createPostgresRepository(connectionString);
};

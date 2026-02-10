import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import pg from "pg";
const createMemoryRepository = async (filePath) => {
    const defaultPath = path.resolve(process.cwd(), "data", "store.json");
    const storePath = filePath ?? process.env.CML_JSON_DB_PATH ?? defaultPath;
    const storeDir = path.dirname(storePath);
    let savePromise = null;
    const loadState = async () => {
        try {
            const raw = await fs.readFile(storePath, "utf-8");
            return JSON.parse(raw);
        }
        catch {
            return null;
        }
    };
    const persistState = async (state) => {
        if (savePromise) {
            await savePromise;
        }
        savePromise = (async () => {
            await fs.mkdir(storeDir, { recursive: true });
            const tempPath = `${storePath}.tmp`;
            await fs.writeFile(tempPath, JSON.stringify(state, null, 2), "utf-8");
            await fs.rename(tempPath, storePath);
        })();
        await savePromise;
        savePromise = null;
    };
    const restored = await loadState();
    const projects = new Map();
    const specs = new Map();
    const specOrder = [];
    const runs = new Map();
    const runOrder = [];
    const runEvents = [];
    const artifacts = [];
    const logs = [];
    if (restored) {
        Object.entries(restored.projects ?? {}).forEach(([id, project]) => projects.set(id, project));
        Object.entries(restored.specs ?? {}).forEach(([id, spec]) => specs.set(id, spec));
        (restored.specOrder ?? []).forEach((entry) => specOrder.push(entry));
        Object.entries(restored.runs ?? {}).forEach(([id, run]) => runs.set(id, run));
        (restored.runOrder ?? []).forEach((entry) => runOrder.push(entry));
        (restored.runEvents ?? []).forEach((entry) => runEvents.push(entry));
        (restored.artifacts ?? []).forEach((entry) => artifacts.push(entry));
        (restored.logs ?? []).forEach((entry) => logs.push(entry));
    }
    const snapshot = () => ({
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
    return {
        async createProject(name) {
            const id = `proj_${randomUUID()}`;
            const project = { id, name, status: "idle", createdAt: new Date().toISOString() };
            projects.set(id, project);
            await persist();
            return project;
        },
        async listProjects() {
            return [...projects.values()];
        },
        async getProject(id) {
            return projects.get(id) ?? null;
        },
        async createSpec(projectId, spec) {
            const id = `spec_${randomUUID()}`;
            const saved = { id, projectId, spec };
            specs.set(id, saved);
            specOrder.push({ id, projectId });
            await persist();
            return saved;
        },
        async getSpec(id) {
            return specs.get(id) ?? null;
        },
        async getLatestSpec(projectId) {
            const match = [...specOrder].reverse().find((entry) => entry.projectId === projectId);
            return match ? specs.get(match.id) ?? null : null;
        },
        async setProjectStatus(projectId, status) {
            const project = projects.get(projectId);
            if (project) {
                projects.set(projectId, { ...project, status });
                await persist();
            }
        },
        async getProjectStatus(projectId) {
            return projects.get(projectId)?.status ?? "idle";
        },
        async createRun(projectId, status) {
            const id = `run_${randomUUID()}`;
            runs.set(id, { id, projectId, status });
            runOrder.push({ id, projectId });
            await persist();
            return { id, projectId, status };
        },
        async updateRunStatus(runId, status) {
            const run = runs.get(runId);
            if (run) {
                runs.set(runId, { ...run, status });
                await persist();
            }
        },
        async addRunEvent(runId, step, message) {
            runEvents.push({ runId, step, message });
            await persist();
        },
        async getLatestRun(projectId) {
            const match = [...runOrder].reverse().find((entry) => entry.projectId === projectId);
            return match ? runs.get(match.id) ?? null : null;
        },
        async getRunEvents(runId) {
            return runEvents.filter((event) => event.runId === runId).map(({ step, message }) => ({ step, message }));
        },
        async createLog(log) {
            const id = `log_${randomUUID()}`;
            const createdAt = new Date().toISOString();
            const entry = { id, createdAt, ...log };
            logs.push(entry);
            await persist();
            return entry;
        },
        async listLogs(projectId) {
            if (!projectId) {
                return [...logs];
            }
            return logs.filter((log) => log.projectId === projectId);
        },
        async createArtifact(projectId, type, payload) {
            const id = `artifact_${randomUUID()}`;
            const artifact = { id, projectId, type, payload };
            artifacts.push(artifact);
            await persist();
            return artifact;
        },
        async getLatestArtifact(projectId, type) {
            const matches = artifacts.filter((artifact) => artifact.projectId === projectId && artifact.type === type);
            return matches[matches.length - 1] ?? null;
        },
    };
};
const createPostgresRepository = async (connectionString) => {
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
        async createProject(name) {
            const id = `proj_${randomUUID()}`;
            const status = "idle";
            const result = await pool.query("INSERT INTO projects (id, name, status) VALUES ($1, $2, $3) RETURNING created_at", [id, name, status]);
            return { id, name, status, createdAt: result.rows[0]?.created_at };
        },
        async listProjects() {
            const result = await pool.query("SELECT id, name, status, created_at AS \"createdAt\" FROM projects ORDER BY created_at DESC");
            return result.rows ?? [];
        },
        async getProject(id) {
            const result = await pool.query("SELECT id, name, status, created_at AS \"createdAt\" FROM projects WHERE id = $1", [id]);
            return result.rows[0] ?? null;
        },
        async createSpec(projectId, spec) {
            const id = `spec_${randomUUID()}`;
            await pool.query("INSERT INTO spec_versions (id, project_id, spec_json) VALUES ($1, $2, $3)", [id, projectId, spec]);
            return { id, projectId, spec };
        },
        async getSpec(id) {
            const result = await pool.query("SELECT id, project_id AS \"projectId\", spec_json AS spec FROM spec_versions WHERE id = $1", [id]);
            return result.rows[0] ?? null;
        },
        async getLatestSpec(projectId) {
            const result = await pool.query("SELECT id, project_id AS \"projectId\", spec_json AS spec FROM spec_versions WHERE project_id = $1 ORDER BY created_at DESC LIMIT 1", [projectId]);
            return result.rows[0] ?? null;
        },
        async setProjectStatus(projectId, status) {
            await pool.query("UPDATE projects SET status = $1 WHERE id = $2", [status, projectId]);
        },
        async getProjectStatus(projectId) {
            const result = await pool.query("SELECT status FROM projects WHERE id = $1", [projectId]);
            return result.rows[0]?.status ?? "idle";
        },
        async createRun(projectId, status) {
            const id = `run_${randomUUID()}`;
            await pool.query("INSERT INTO runs (id, project_id, status) VALUES ($1, $2, $3)", [id, projectId, status]);
            return { id, projectId, status };
        },
        async updateRunStatus(runId, status) {
            await pool.query("UPDATE runs SET status = $1, finished_at = CASE WHEN $1 = 'idle' THEN NOW() ELSE finished_at END WHERE id = $2", [status, runId]);
        },
        async addRunEvent(runId, step, message) {
            await pool.query("INSERT INTO run_events (run_id, step, message) VALUES ($1, $2, $3)", [
                runId,
                step,
                message,
            ]);
        },
        async getLatestRun(projectId) {
            const result = await pool.query("SELECT id, project_id AS \"projectId\", status FROM runs WHERE project_id = $1 ORDER BY started_at DESC LIMIT 1", [projectId]);
            return result.rows[0] ?? null;
        },
        async getRunEvents(runId) {
            const result = await pool.query("SELECT step, message FROM run_events WHERE run_id = $1 ORDER BY created_at ASC", [runId]);
            return result.rows ?? [];
        },
        async createLog(log) {
            const id = `log_${randomUUID()}`;
            await pool.query("INSERT INTO activity_logs (id, project_id, scope, message, payload_json) VALUES ($1, $2, $3, $4, $5)", [id, log.projectId, log.scope, log.message, log.payload ?? null]);
            return { id, createdAt: new Date().toISOString(), ...log };
        },
        async listLogs(projectId) {
            if (projectId) {
                const result = await pool.query("SELECT id, project_id AS \"projectId\", scope, message, payload_json AS payload, created_at AS \"createdAt\" FROM activity_logs WHERE project_id = $1 ORDER BY created_at DESC", [projectId]);
                return result.rows ?? [];
            }
            const result = await pool.query("SELECT id, project_id AS \"projectId\", scope, message, payload_json AS payload, created_at AS \"createdAt\" FROM activity_logs ORDER BY created_at DESC");
            return result.rows ?? [];
        },
        async createArtifact(projectId, type, payload, sourceSpecId) {
            const id = `artifact_${randomUUID()}`;
            await pool.query("INSERT INTO artifact_versions (id, project_id, type, payload_json, source_spec_id) VALUES ($1, $2, $3, $4, $5)", [id, projectId, type, payload, sourceSpecId ?? null]);
            return { id, projectId, type, payload };
        },
        async getLatestArtifact(projectId, type) {
            const result = await pool.query("SELECT id, project_id AS \"projectId\", type, payload_json AS payload FROM artifact_versions WHERE project_id = $1 AND type = $2 ORDER BY created_at DESC LIMIT 1", [projectId, type]);
            return result.rows[0] ?? null;
        },
    };
};
export const createRepository = async () => {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        console.warn("DATABASE_URL not set. Using JSON file-backed repository.");
        return createMemoryRepository();
    }
    return createPostgresRepository(connectionString);
};
//# sourceMappingURL=db.js.map
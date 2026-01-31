import { randomUUID } from "crypto";
import pg from "pg";
const createMemoryRepository = () => {
    const projects = new Map();
    const specs = new Map();
    const specOrder = [];
    const runs = new Map();
    const runOrder = [];
    const runEvents = [];
    const artifacts = [];
    return {
        async createProject(name) {
            const id = `proj_${randomUUID()}`;
            const project = { id, name, status: "idle" };
            projects.set(id, project);
            return project;
        },
        async getProject(id) {
            return projects.get(id) ?? null;
        },
        async createSpec(projectId, spec) {
            const id = `spec_${randomUUID()}`;
            const saved = { id, projectId, spec };
            specs.set(id, saved);
            specOrder.push({ id, projectId });
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
            }
        },
        async getProjectStatus(projectId) {
            return projects.get(projectId)?.status ?? "idle";
        },
        async createRun(projectId, status) {
            const id = `run_${randomUUID()}`;
            runs.set(id, { id, projectId, status });
            runOrder.push({ id, projectId });
            return { id, projectId, status };
        },
        async updateRunStatus(runId, status) {
            const run = runs.get(runId);
            if (run) {
                runs.set(runId, { ...run, status });
            }
        },
        async addRunEvent(runId, step, message) {
            runEvents.push({ runId, step, message });
        },
        async getLatestRun(projectId) {
            const match = [...runOrder].reverse().find((entry) => entry.projectId === projectId);
            return match ? runs.get(match.id) ?? null : null;
        },
        async getRunEvents(runId) {
            return runEvents.filter((event) => event.runId === runId).map(({ step, message }) => ({ step, message }));
        },
        async createArtifact(projectId, type, payload) {
            const id = `artifact_${randomUUID()}`;
            const artifact = { id, projectId, type, payload };
            artifacts.push(artifact);
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
    return {
        async createProject(name) {
            const id = `proj_${randomUUID()}`;
            const status = "idle";
            await pool.query("INSERT INTO projects (id, name, status) VALUES ($1, $2, $3)", [id, name, status]);
            return { id, name, status };
        },
        async getProject(id) {
            const result = await pool.query("SELECT id, name, status FROM projects WHERE id = $1", [id]);
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
        console.warn("DATABASE_URL not set. Using in-memory repository for now.");
        return createMemoryRepository();
    }
    return createPostgresRepository(connectionString);
};
//# sourceMappingURL=db.js.map
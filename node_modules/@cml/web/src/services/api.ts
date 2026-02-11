// Export selected artifacts as a downloadable JSON file
export const exportArtifacts = async (projectId: string, artifactTypes: string[]): Promise<Blob> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/export`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ artifactTypes }),
  });
  if (!response.ok) {
    throw new Error(`Export failed (${response.status})`);
  }
  return response.blob();
};
export type ApiHealth = {
  status: string;
  service: string;
};

export type Project = {
  id: string;
  name: string;
  status?: string;
  createdAt?: string;
};

export type Spec = {
  id: string;
  projectId: string;
  spec: unknown;
};

export type Artifact<T = unknown> = {
  id: string;
  projectId: string;
  type: string;
  payload: T;
};

export type Run = {
  id: string;
  projectId: string;
  status: string;
};

export type RunEvent = {
  step: string;
  message: string;
};

export type ProjectStatus = {
  projectId: string;
  status: string;
};

export type ActivityLogPayload = {
  projectId?: string | null;
  scope: string;
  message: string;
  payload?: unknown;
};

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3005";

export const fetchHealth = async (): Promise<ApiHealth> => {
  const response = await fetch(`${apiBase}/api/health`);
  if (!response.ok) {
    throw new Error(`Health check failed (${response.status})`);
  }
  return response.json() as Promise<ApiHealth>;
};

export const logActivity = async (entry: ActivityLogPayload): Promise<void> => {
  try {
    await fetch(`${apiBase}/api/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
  } catch {
    // swallow logging failures
  }
};

export const createProject = async (name: string): Promise<Project> => {
  const response = await fetch(`${apiBase}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    throw new Error(`Create project failed (${response.status})`);
  }
  return response.json() as Promise<Project>;
};

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await fetch(`${apiBase}/api/projects`);
  if (!response.ok) {
    throw new Error(`Fetch projects failed (${response.status})`);
  }
  const data = (await response.json()) as { projects: Project[] };
  return data.projects;
};

export const fetchProject = async (projectId: string): Promise<Project> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}`);
  if (!response.ok) {
    throw new Error(`Fetch project failed (${response.status})`);
  }
  return response.json() as Promise<Project>;
};

export const saveSpec = async (projectId: string, spec: unknown): Promise<Spec> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/specs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(spec),
  });
  if (!response.ok) {
    throw new Error(`Save spec failed (${response.status})`);
  }
  return response.json() as Promise<Spec>;
};

export const runPipeline = async (projectId: string) => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/run`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Run pipeline failed (${response.status})`);
  }
  return response.json() as Promise<{ status: string; projectId: string }>;
};

export const regenerateArtifact = async (projectId: string, scope: string) => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/regenerate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scope }),
  });
  if (!response.ok) {
    throw new Error(`Regenerate failed (${response.status})`);
  }
  return response.json() as Promise<{ status: string; scope: string }>;
};

export const fetchCml = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/cml/latest`, {
    headers: { "x-cml-mode": "advanced" },
  });
  if (!response.ok) {
    throw new Error(`Fetch CML failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchCmlValidation = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/cml/validation/latest`, {
    headers: { "x-cml-mode": "advanced" },
  });
  if (!response.ok) {
    throw new Error(`Fetch CML validation failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchSetting = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/setting/latest`);
  if (!response.ok) {
    throw new Error(`Fetch setting failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchCast = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/cast/latest`);
  if (!response.ok) {
    throw new Error(`Fetch cast failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchSettingValidation = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/setting/validation/latest`);
  if (!response.ok) {
    throw new Error(`Fetch setting validation failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchCastValidation = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/cast/validation/latest`);
  if (!response.ok) {
    throw new Error(`Fetch cast validation failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchClues = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/clues/latest`);
  if (!response.ok) {
    throw new Error(`Fetch clues failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchCluesValidation = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/clues/validation/latest`);
  if (!response.ok) {
    throw new Error(`Fetch clues validation failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchOutline = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/outline/latest`);
  if (!response.ok) {
    throw new Error(`Fetch outline failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchOutlineValidation = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/outline/validation/latest`);
  if (!response.ok) {
    throw new Error(`Fetch outline validation failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchProse = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/prose/latest`);
  if (!response.ok) {
    throw new Error(`Fetch prose failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchFairPlayReport = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/fair-play/latest`);
  if (!response.ok) {
    throw new Error(`Fetch fair-play report failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchGamePack = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/game-pack/latest`);
  if (!response.ok) {
    throw new Error(`Fetch game pack failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchSynopsis = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/synopsis/latest`);
  if (!response.ok) {
    throw new Error(`Fetch synopsis failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchNoveltyAudit = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/novelty-audit/latest`);
  if (!response.ok) {
    throw new Error(`Fetch novelty audit failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const downloadGamePackPdf = async (projectId: string): Promise<Blob> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/game-pack/pdf`);
  if (!response.ok) {
    throw new Error(`Download game pack PDF failed (${response.status})`);
  }
  return response.blob();
};

export type SampleSummary = { id: string; name: string; filename: string };

export const fetchSamples = async (): Promise<SampleSummary[]> => {
  const response = await fetch(`${apiBase}/api/samples`);
  if (!response.ok) {
    throw new Error(`Fetch samples failed (${response.status})`);
  }
  const data = (await response.json()) as { samples: SampleSummary[] };
  return data.samples;
};

export const fetchSampleContent = async (id: string): Promise<{ id: string; name: string; content: string }> => {
  const response = await fetch(`${apiBase}/api/samples/${id}`);
  if (!response.ok) {
    throw new Error(`Fetch sample failed (${response.status})`);
  }
  return response.json() as Promise<{ id: string; name: string; content: string }>;
};

export const fetchLatestRun = async (projectId: string): Promise<Run> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/runs/latest`);
  if (!response.ok) {
    throw new Error(`Fetch latest run failed (${response.status})`);
  }
  return response.json() as Promise<Run>;
};

export const fetchRunEvents = async (runId: string): Promise<RunEvent[]> => {
  const response = await fetch(`${apiBase}/api/runs/${runId}/events`);
  if (!response.ok) {
    throw new Error(`Fetch run events failed (${response.status})`);
  }
  const data = (await response.json()) as { events: RunEvent[] };
  return data.events;
};

export const fetchProjectStatus = async (projectId: string): Promise<ProjectStatus> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/status`);
  if (!response.ok) {
    throw new Error(`Status check failed (${response.status})`);
  }
  return response.json() as Promise<ProjectStatus>;
};

export const clearPersistenceStore = async (): Promise<{ status: string }> => {
  const response = await fetch(`${apiBase}/api/admin/clear-store`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Clear store failed (${response.status})`);
  }
  return response.json() as Promise<{ status: string }>;
};

export type LlmLogEntry = {
  timestamp: string;
  runId: string;
  projectId: string;
  agent: string;
  operation: string;
  model?: string;
  latencyMs?: number;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  estimatedCost?: number;
  errorMessage?: string;
  validationStatus?: string;
};

export const fetchLlmLogs = async (projectId?: string | null, limit = 200): Promise<LlmLogEntry[]> => {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (projectId) params.set("projectId", projectId);
  const response = await fetch(`${apiBase}/api/llm-logs?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Fetch LLM logs failed (${response.status})`);
  }
  const data = (await response.json()) as { entries: LlmLogEntry[] };
  return data.entries;
};

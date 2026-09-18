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

export const fetchLatestSpec = async (projectId: string): Promise<Spec | null> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/specs/latest`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Fetch latest spec failed (${response.status})`);
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
  return response.json() as Promise<{ status: string; projectId: string; runId?: string }>;
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

export const fetchCharacterProfiles = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/character-profiles/latest`);
  if (!response.ok) {
    throw new Error(`Fetch character profiles failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchLocationProfiles = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/location-profiles/latest`);
  if (!response.ok) {
    throw new Error(`Fetch location profiles failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchTemporalContext = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/temporal-context/latest`);
  if (!response.ok) {
    throw new Error(`Fetch temporal context failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchBackgroundContext = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/background-context/latest`);
  if (!response.ok) {
    throw new Error(`Fetch background context failed (${response.status})`);
  }
  return response.json() as Promise<Artifact>;
};

export const fetchHardLogicDevices = async (projectId: string): Promise<Artifact> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/hard-logic-devices/latest`);
  if (!response.ok) {
    throw new Error(`Fetch hard-logic devices failed (${response.status})`);
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

export const downloadStoryPdf = async (projectId: string, length?: string): Promise<Blob> => {
  const url = length 
    ? `${apiBase}/api/projects/${projectId}/prose/pdf?length=${length}`
    : `${apiBase}/api/projects/${projectId}/prose/pdf`;
  const response = await fetch(url);
  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let details = "";
    if (contentType.includes("application/json")) {
      try {
        const data = (await response.json()) as { error?: string };
        details = data?.error ? `: ${data.error}` : "";
      } catch {
        details = "";
      }
    } else {
      try {
        const text = await response.text();
        details = text ? `: ${text}` : "";
      } catch {
        details = "";
      }
    }
    throw new Error(`Download story PDF failed (${response.status})${details}`);
  }
  return response.blob();
};

export const fetchProseVersions = async (projectId: string): Promise<Record<string, Artifact>> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/prose/all`);
  if (!response.ok) {
    throw new Error(`Fetch prose versions failed (${response.status})`);
  }
  const data = (await response.json()) as { versions: Record<string, Artifact> };
  return data.versions;
};

export type SampleSummary = {
  id: string;
  name: string;
  filename: string;
  /** `verified` = re-encoded and checked span-by-span against the source text; `legacy` = the
   *  hand-authored 2025 encoding, which A_77 §3.2 found materially wrong in four known cases. */
  state?: "verified" | "legacy";
};

/** Totals for the whole reference library, not just the cases that are openable. */
export type LibrarySummary = {
  works: number;
  encoded: number;
  legacy: number;
  awaitingEncode: number;
};

export const fetchSamples = async (): Promise<{ samples: SampleSummary[]; library?: LibrarySummary }> => {
  const response = await fetch(`${apiBase}/api/samples`);
  if (!response.ok) {
    throw new Error(`Fetch samples failed (${response.status})`);
  }
  return (await response.json()) as { samples: SampleSummary[]; library?: LibrarySummary };
};

export const fetchSampleContent = async (id: string): Promise<{ id: string; name: string; content: string }> => {
  const response = await fetch(`${apiBase}/api/samples/${id}`);
  if (!response.ok) {
    throw new Error(`Fetch sample failed (${response.status})`);
  }
  return response.json() as Promise<{ id: string; name: string; content: string }>;
};

export const fetchLatestRun = async (projectId: string): Promise<Run | null> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/runs/latest`);
  if (!response.ok) {
    throw new Error(`Fetch latest run failed (${response.status})`);
  }
  const payload = (await response.json()) as Run | { run: null };
  if (typeof payload === "object" && payload !== null && "run" in payload) {
    return null;
  }
  return payload as Run;
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

export const clearPersistenceStore = async (): Promise<{ status: string; cleared?: string[] }> => {
  const response = await fetch(`${apiBase}/api/admin/clear-store`, {
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(`Clear store failed (${response.status})`);
  }
  return response.json() as Promise<{ status: string; cleared?: string[] }>;
};

export const fetchScoringReport = async (projectId: string, runId: string): Promise<unknown> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/runs/${runId}/report`);
  // HTTP 202 = run in progress. The body is the live partial snapshot (phase scores so far).
  // Surface it (tagged in_progress) so the Quality tab can render live updates per agent, rather
  // than discarding it and showing nothing until the run completes.
  if (response.status === 202) {
    try {
      const partial = (await response.json()) as Record<string, unknown>;
      if (partial && typeof partial === "object") {
        return { ...partial, in_progress: true };
      }
    } catch {
      // No parseable body (e.g. {status:"running"} only) — nothing live to show yet.
    }
    return null;
  }
  if (!response.ok) {
    throw new Error(`Fetch scoring report failed (${response.status})`);
  }
  const data = (await response.json()) as Record<string, unknown>;
  // A 200 with in_progress:true is a partial snapshot served while the run is live — keep it and
  // let the caller render it with a live indicator (do not discard).
  return data;
};

export const fetchScoringHistory = async (projectId: string, limit = 10): Promise<unknown[]> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/reports/history?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Fetch scoring history failed (${response.status})`);
  }
  const data = (await response.json()) as { reports: unknown[] };
  return data.reports;
};

export const fetchScoringAggregate = async (): Promise<unknown> => {
  const response = await fetch(`${apiBase}/api/reports/aggregate`);
  if (!response.ok) {
    throw new Error(`Fetch aggregate scoring stats failed (${response.status})`);
  }
  return response.json();
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

/* ── admin / storage ─────────────────────────────────────────────────────────────────────────── */

export interface StorageFile {
	name: string;
	bytes: number;
	modified: string;
}

export interface StorageReport {
	store: {
		path: string;
		bytes: number;
		modified: string | null;
		counts: { projects: number; specs: number; runs: number; runEvents: number; artifacts: number; logs: number };
	};
	live: StorageFile[];
	archived: StorageFile[];
}

const admin = async <T>(path: string, init?: RequestInit): Promise<T> => {
	const response = await fetch(`${apiBase}${path}`, init);
	if (!response.ok) {
		const detail = await response.json().catch(() => null);
		throw new Error((detail as { error?: string } | null)?.error ?? `Request failed (${response.status})`);
	}
	return response.json() as Promise<T>;
};

/**
 * What storage costs, not just what it occupies. The store's size is the number that matters: it is
 * re-serialised on every write, so a large store is per-request CPU, not disk space.
 */
export const fetchStorage = (): Promise<StorageReport> => admin<StorageReport>("/api/admin/storage");

export const archiveLogs = (): Promise<{ moved: Array<{ name: string; bytes: number }>; archivedTo: string }> =>
	admin("/api/admin/logs/archive", { method: "POST" });

export const deleteArchive = (name: string): Promise<{ deleted: string; bytes: number }> =>
	admin(`/api/admin/logs/archive/${encodeURIComponent(name)}`, { method: "DELETE" });

export const trimStoreLogs = (): Promise<{ removed: number }> =>
	admin("/api/admin/store/trim-logs", { method: "POST" });

export const deleteProjectCompletely = (
	id: string,
): Promise<{ artifacts: number; specs: number; runs: number }> =>
	admin(`/api/admin/projects/${encodeURIComponent(id)}`, { method: "DELETE" });

export const clearStore = (): Promise<{ cleared: string[] }> =>
	admin("/api/admin/clear-store", { method: "POST" });

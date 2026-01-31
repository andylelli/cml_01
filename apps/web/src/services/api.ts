export type ApiHealth = {
  status: string;
  service: string;
};

export type Project = {
  id: string;
  name: string;
};

export type Spec = {
  id: string;
  projectId: string;
  spec: unknown;
};

export type ProjectStatus = {
  projectId: string;
  status: string;
};

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const fetchHealth = async (): Promise<ApiHealth> => {
  const response = await fetch(`${apiBase}/api/health`);
  if (!response.ok) {
    throw new Error(`Health check failed (${response.status})`);
  }
  return response.json() as Promise<ApiHealth>;
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

export const fetchProjectStatus = async (projectId: string): Promise<ProjectStatus> => {
  const response = await fetch(`${apiBase}/api/projects/${projectId}/status`);
  if (!response.ok) {
    throw new Error(`Status check failed (${response.status})`);
  }
  return response.json() as Promise<ProjectStatus>;
};

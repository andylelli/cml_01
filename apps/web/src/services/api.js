// Export selected artifacts as a downloadable JSON file
export const exportArtifacts = async (projectId, artifactTypes) => {
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
const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3005";
export const fetchHealth = async () => {
    const response = await fetch(`${apiBase}/api/health`);
    if (!response.ok) {
        throw new Error(`Health check failed (${response.status})`);
    }
    return response.json();
};
export const logActivity = async (entry) => {
    try {
        await fetch(`${apiBase}/api/logs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(entry),
        });
    }
    catch {
        // swallow logging failures
    }
};
export const createProject = async (name) => {
    const response = await fetch(`${apiBase}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
    });
    if (!response.ok) {
        throw new Error(`Create project failed (${response.status})`);
    }
    return response.json();
};
export const fetchProjects = async () => {
    const response = await fetch(`${apiBase}/api/projects`);
    if (!response.ok) {
        throw new Error(`Fetch projects failed (${response.status})`);
    }
    const data = (await response.json());
    return data.projects;
};
export const fetchProject = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}`);
    if (!response.ok) {
        throw new Error(`Fetch project failed (${response.status})`);
    }
    return response.json();
};
export const saveSpec = async (projectId, spec) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/specs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(spec),
    });
    if (!response.ok) {
        throw new Error(`Save spec failed (${response.status})`);
    }
    return response.json();
};
export const fetchLatestSpec = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/specs/latest`);
    if (response.status === 404)
        return null;
    if (!response.ok) {
        throw new Error(`Fetch latest spec failed (${response.status})`);
    }
    return response.json();
};
export const runPipeline = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/run`, {
        method: "POST",
    });
    if (!response.ok) {
        throw new Error(`Run pipeline failed (${response.status})`);
    }
    return response.json();
};
export const regenerateArtifact = async (projectId, scope) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/regenerate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scope }),
    });
    if (!response.ok) {
        throw new Error(`Regenerate failed (${response.status})`);
    }
    return response.json();
};
export const fetchCml = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/cml/latest`, {
        headers: { "x-cml-mode": "advanced" },
    });
    if (!response.ok) {
        throw new Error(`Fetch CML failed (${response.status})`);
    }
    return response.json();
};
export const fetchCmlValidation = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/cml/validation/latest`, {
        headers: { "x-cml-mode": "advanced" },
    });
    if (!response.ok) {
        throw new Error(`Fetch CML validation failed (${response.status})`);
    }
    return response.json();
};
export const fetchSetting = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/setting/latest`);
    if (!response.ok) {
        throw new Error(`Fetch setting failed (${response.status})`);
    }
    return response.json();
};
export const fetchCast = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/cast/latest`);
    if (!response.ok) {
        throw new Error(`Fetch cast failed (${response.status})`);
    }
    return response.json();
};
export const fetchSettingValidation = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/setting/validation/latest`);
    if (!response.ok) {
        throw new Error(`Fetch setting validation failed (${response.status})`);
    }
    return response.json();
};
export const fetchCastValidation = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/cast/validation/latest`);
    if (!response.ok) {
        throw new Error(`Fetch cast validation failed (${response.status})`);
    }
    return response.json();
};
export const fetchClues = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/clues/latest`);
    if (!response.ok) {
        throw new Error(`Fetch clues failed (${response.status})`);
    }
    return response.json();
};
export const fetchCluesValidation = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/clues/validation/latest`);
    if (!response.ok) {
        throw new Error(`Fetch clues validation failed (${response.status})`);
    }
    return response.json();
};
export const fetchOutline = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/outline/latest`);
    if (!response.ok) {
        throw new Error(`Fetch outline failed (${response.status})`);
    }
    return response.json();
};
export const fetchOutlineValidation = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/outline/validation/latest`);
    if (!response.ok) {
        throw new Error(`Fetch outline validation failed (${response.status})`);
    }
    return response.json();
};
export const fetchProse = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/prose/latest`);
    if (!response.ok) {
        throw new Error(`Fetch prose failed (${response.status})`);
    }
    return response.json();
};
export const fetchCharacterProfiles = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/character-profiles/latest`);
    if (!response.ok) {
        throw new Error(`Fetch character profiles failed (${response.status})`);
    }
    return response.json();
};
export const fetchLocationProfiles = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/location-profiles/latest`);
    if (!response.ok) {
        throw new Error(`Fetch location profiles failed (${response.status})`);
    }
    return response.json();
};
export const fetchTemporalContext = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/temporal-context/latest`);
    if (!response.ok) {
        throw new Error(`Fetch temporal context failed (${response.status})`);
    }
    return response.json();
};
export const fetchBackgroundContext = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/background-context/latest`);
    if (!response.ok) {
        throw new Error(`Fetch background context failed (${response.status})`);
    }
    return response.json();
};
export const fetchHardLogicDevices = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/hard-logic-devices/latest`);
    if (!response.ok) {
        throw new Error(`Fetch hard-logic devices failed (${response.status})`);
    }
    return response.json();
};
export const fetchFairPlayReport = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/fair-play/latest`);
    if (!response.ok) {
        throw new Error(`Fetch fair-play report failed (${response.status})`);
    }
    return response.json();
};
export const fetchGamePack = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/game-pack/latest`);
    if (!response.ok) {
        throw new Error(`Fetch game pack failed (${response.status})`);
    }
    return response.json();
};
export const fetchSynopsis = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/synopsis/latest`);
    if (!response.ok) {
        throw new Error(`Fetch synopsis failed (${response.status})`);
    }
    return response.json();
};
export const fetchNoveltyAudit = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/novelty-audit/latest`);
    if (!response.ok) {
        throw new Error(`Fetch novelty audit failed (${response.status})`);
    }
    return response.json();
};
export const downloadGamePackPdf = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/game-pack/pdf`);
    if (!response.ok) {
        throw new Error(`Download game pack PDF failed (${response.status})`);
    }
    return response.blob();
};
export const downloadStoryPdf = async (projectId, length) => {
    const url = length
        ? `${apiBase}/api/projects/${projectId}/prose/pdf?length=${length}`
        : `${apiBase}/api/projects/${projectId}/prose/pdf`;
    const response = await fetch(url);
    if (!response.ok) {
        const contentType = response.headers.get("content-type") || "";
        let details = "";
        if (contentType.includes("application/json")) {
            try {
                const data = (await response.json());
                details = data?.error ? `: ${data.error}` : "";
            }
            catch {
                details = "";
            }
        }
        else {
            try {
                const text = await response.text();
                details = text ? `: ${text}` : "";
            }
            catch {
                details = "";
            }
        }
        throw new Error(`Download story PDF failed (${response.status})${details}`);
    }
    return response.blob();
};
export const fetchProseVersions = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/prose/all`);
    if (!response.ok) {
        throw new Error(`Fetch prose versions failed (${response.status})`);
    }
    const data = (await response.json());
    return data.versions;
};
export const fetchSamples = async () => {
    const response = await fetch(`${apiBase}/api/samples`);
    if (!response.ok) {
        throw new Error(`Fetch samples failed (${response.status})`);
    }
    const data = (await response.json());
    return data.samples;
};
export const fetchSampleContent = async (id) => {
    const response = await fetch(`${apiBase}/api/samples/${id}`);
    if (!response.ok) {
        throw new Error(`Fetch sample failed (${response.status})`);
    }
    return response.json();
};
export const fetchLatestRun = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/runs/latest`);
    if (!response.ok) {
        throw new Error(`Fetch latest run failed (${response.status})`);
    }
    const payload = (await response.json());
    if (typeof payload === "object" && payload !== null && "run" in payload) {
        return null;
    }
    return payload;
};
export const fetchRunEvents = async (runId) => {
    const response = await fetch(`${apiBase}/api/runs/${runId}/events`);
    if (!response.ok) {
        throw new Error(`Fetch run events failed (${response.status})`);
    }
    const data = (await response.json());
    return data.events;
};
export const fetchProjectStatus = async (projectId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/status`);
    if (!response.ok) {
        throw new Error(`Status check failed (${response.status})`);
    }
    return response.json();
};
export const clearPersistenceStore = async () => {
    const response = await fetch(`${apiBase}/api/admin/clear-store`, {
        method: "POST",
    });
    if (!response.ok) {
        throw new Error(`Clear store failed (${response.status})`);
    }
    return response.json();
};
export const fetchScoringReport = async (projectId, runId) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/runs/${runId}/report`);
    if (!response.ok) {
        throw new Error(`Fetch scoring report failed (${response.status})`);
    }
    return response.json();
};
export const fetchScoringHistory = async (projectId, limit = 10) => {
    const response = await fetch(`${apiBase}/api/projects/${projectId}/reports/history?limit=${limit}`);
    if (!response.ok) {
        throw new Error(`Fetch scoring history failed (${response.status})`);
    }
    const data = (await response.json());
    return data.reports;
};
export const fetchScoringAggregate = async () => {
    const response = await fetch(`${apiBase}/api/reports/aggregate`);
    if (!response.ok) {
        throw new Error(`Fetch aggregate scoring stats failed (${response.status})`);
    }
    return response.json();
};
export const fetchLlmLogs = async (projectId, limit = 200) => {
    const params = new URLSearchParams();
    params.set("limit", String(limit));
    if (projectId)
        params.set("projectId", projectId);
    const response = await fetch(`${apiBase}/api/llm-logs?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`Fetch LLM logs failed (${response.status})`);
    }
    const data = (await response.json());
    return data.entries;
};
//# sourceMappingURL=api.js.map
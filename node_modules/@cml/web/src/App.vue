<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import ExportPanel from "./components/ExportPanel.vue";
import ErrorNotification from "./components/ErrorNotification.vue";
import ValidationPanel from "./components/ValidationPanel.vue";
import ProseReader from "./components/ProseReader.vue";
import RunHistory from "./components/RunHistory.vue";
import NoveltyAudit from "./components/NoveltyAudit.vue";
import TabBar from "./components/TabBar.vue";
import TabPanel from "./components/TabPanel.vue";
import type {
  ErrorItem,
  ErrorSeverity,
  AllValidation,
  ValidationResult,
  ProseData,
  RunEvent,
  NoveltyAuditData,
  Tab,
  TabStatus,
} from "./components/types";
import {
  createProject,
  downloadGamePackPdf,
  fetchProject,
  fetchProjects,
  fetchCast,
  fetchCastValidation,
  fetchCml,
  fetchCmlValidation,
  fetchClues,
  fetchCluesValidation,
  fetchHealth,
  fetchFairPlayReport,
  fetchGamePack,
  fetchSynopsis,
  fetchLatestRun,
  fetchOutline,
  fetchOutlineValidation,
  fetchSampleContent,
  fetchSamples,
  fetchSetting,
  fetchSettingValidation,
  fetchProse,
  fetchRunEvents,
  logActivity,
  regenerateArtifact,
  runPipeline,
  saveSpec,
  type Artifact,
  type Project,
} from "./services/api";
import { subscribeToRunEvents } from "./services/sse";

type Mode = "user" | "advanced" | "expert";
type View = "dashboard" | "builder" | "generate" | "cast" | "clues" | "outline" | "samples" | "cml" | "prose" | "history";

const mode = ref<Mode>("user");
const currentView = ref<View>("dashboard");

// Tab navigation state
const activeMainTab = ref<string>("project");
const activeReviewTab = ref<string>("cast");
const activeAdvancedTab = ref<string>("cml");

// Define main tabs
const mainTabs = computed<Tab[]>(() => [
  { id: "project", label: "Project" },
  { id: "spec", label: "Spec" },
  { id: "generate", label: "Generate" },
  { id: "review", label: "Review" },
  { id: "advanced", label: "Advanced", disabled: !isAdvanced.value },
  { id: "export", label: "Export" },
]);

// Define review sub-tabs
const reviewTabs = computed<Tab[]>(() => [
  { id: "cast", label: "Cast" },
  { id: "clues", label: "Clues" },
  { id: "outline", label: "Outline" },
  { id: "prose", label: "Prose" },
]);

// Define advanced sub-tabs
const advancedTabs = computed<Tab[]>(() => [
  { id: "cml", label: "CML" },
  { id: "samples", label: "Samples" },
  { id: "history", label: "History" },
]);

// Tab status tracking
const tabStatuses = ref<Record<string, TabStatus>>({
  project: "available",
  spec: "available",
  generate: "available",
  review: "available",
  advanced: "locked",
  export: "available",
});

const isAdvanced = computed(() => mode.value === "advanced" || mode.value === "expert");
const isExpert = computed(() => mode.value === "expert");

const advancedChecked = computed({
  get: () => isAdvanced.value,
  set: (checked: boolean) => handleAdvancedToggle(checked),
});

const expertChecked = computed({
  get: () => isExpert.value,
  set: (checked: boolean) => handleExpertToggle(checked),
});

// Error management
const errors = ref<ErrorItem[]>([]);
let errorIdCounter = 0;

const addError = (severity: ErrorSeverity, scope: string, message: string, details?: string) => {
  const error: ErrorItem = {
    id: `error_${++errorIdCounter}`,
    timestamp: Date.now(),
    severity,
    scope,
    message,
    details,
  };
  errors.value.push(error);
  
  // Auto-dismiss info messages after 5 seconds
  if (severity === "info") {
    setTimeout(() => {
      dismissError(error.id);
    }, 5000);
  }
  
  logActivity({
    projectId: projectId.value,
    scope: "error",
    message: `${severity}: ${message}`,
    payload: { scope, details },
  });
};

const dismissError = (id: string) => {
  const index = errors.value.findIndex((e) => e.id === id);
  if (index > -1) {
    errors.value.splice(index, 1);
  }
};

const clearErrors = (scope?: string) => {
  if (scope) {
    errors.value = errors.value.filter((e) => e.scope !== scope);
  } else {
    errors.value = [];
  }
};

const setMode = (nextMode: Mode) => {
  mode.value = nextMode;
};

const handleAdvancedToggle = (checked: boolean) => {
  if (checked) {
    if (mode.value !== "expert") {
      setMode("advanced");
    }
    logActivity({ projectId: projectId.value, scope: "ui", message: "mode_advanced_on" });
    return;
  }
  setMode("user");
  logActivity({ projectId: projectId.value, scope: "ui", message: "mode_advanced_off" });
};

const handleExpertToggle = (checked: boolean) => {
  if (checked) {
    setMode("expert");
    logActivity({ projectId: projectId.value, scope: "ui", message: "mode_expert_on" });
    return;
  }
  setMode("advanced");
  logActivity({ projectId: projectId.value, scope: "ui", message: "mode_expert_off" });
};

const setView = (nextView: View) => {
  currentView.value = nextView;
  persistState();
  logActivity({
    projectId: projectId.value,
    scope: "ui",
    message: "view_change",
    payload: { view: nextView },
  });
};

const healthStatus = ref<"idle" | "ok" | "error">("idle");
const healthMessage = ref("Not checked");
const runStatus = ref("Idle • No active run");
const projectName = ref("Golden Age Prototype");
const projectId = ref<string | null>(null);
const projectIdInput = ref("");
const latestSpecId = ref<string | null>(null);
const spec = ref({
  decade: "1930s",
  locationPreset: "CountryHouse",
  tone: "Cozy",
  castSize: 6,
  castNames: [] as string[],
  primaryAxis: "temporal",
});

// Artifact state
const cmlArtifact = ref<string | null>(null);
const cluesArtifact = ref<string | null>(null);
const outlineArtifact = ref<string | null>(null);
const proseArtifact = ref<string | null>(null);
const gamePackArtifact = ref<string | null>(null);
const gamePackData = ref<{ title?: string; suspects?: string[]; materials?: string[] } | null>(null);
const settingArtifact = ref<string | null>(null);
const settingData = ref<{ decade?: string; locationPreset?: string; weather?: string; socialStructure?: string } | null>(null);
const castArtifact = ref<string | null>(null);
const castData = ref<{ suspects?: string[] } | null>(null);
const cluesData = ref<{ summary?: string; items?: Array<{ id: string; category: string; text: string; pointsTo: string; redHerring: boolean; revealChapter?: number }> } | null>(null);
const fairPlayReport = ref<{ summary?: string; checks?: Array<{ id: string; label: string; status: string }> } | null>(null);
const outlineData = ref<{ chapters?: unknown } | null>(null);
const synopsisData = ref<{ title?: string; summary?: string } | null>(null);

// New artifact state
const proseData = ref<ProseData | null>(null);
const noveltyAuditData = ref<NoveltyAuditData | null>(null);
const runEventsData = ref<RunEvent[]>([]);
const latestRunId = ref<string | null>(null);

// Validation state
const allValidation = ref<AllValidation>({
  setting: { valid: true, errors: [], warnings: [] },
  cast: { valid: true, errors: [], warnings: [] },
  cml: { valid: true, errors: [], warnings: [] },
  clues: { valid: true, errors: [], warnings: [] },
  outline: { valid: true, errors: [], warnings: [] },
});

// UI state
const showRedHerrings = ref(true);
const playModeEnabled = ref(false);
const currentChapter = ref(1);
const samples = ref<Array<{ id: string; name: string; filename: string }>>([]);
const selectedSample = ref<{ id: string; name: string; content: string } | null>(null);
const projectsList = ref<Project[]>([]);
const selectedProjectId = ref("");
const missingProjectNotified = ref(false);
const artifactsStatus = ref<"idle" | "loading" | "ready" | "partial" | "error">("idle");
const lastProjectStatus = ref<string | null>(null);
let unsubscribe: (() => void) | null = null;

const STORAGE_KEY = "cml_ui_state";

const persistState = () => {
  const state = {
    projectName: projectName.value,
    projectId: projectId.value,
    latestSpecId: latestSpecId.value,
    spec: spec.value,
    currentView: currentView.value,
    mode: mode.value,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const hydrateState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as Partial<{
      projectName: string;
      projectId: string | null;
      latestSpecId: string | null;
      spec: typeof spec.value;
      currentView: View;
      mode: Mode;
    }>;
    if (saved.projectName) projectName.value = saved.projectName;
    if (typeof saved.projectId !== "undefined") projectId.value = saved.projectId;
    if (typeof saved.latestSpecId !== "undefined") latestSpecId.value = saved.latestSpecId;
    if (saved.spec) spec.value = saved.spec;
    if (saved.currentView) currentView.value = saved.currentView;
    if (saved.mode) mode.value = saved.mode;
  } catch {
    // ignore invalid storage
  }
};

const filteredClues = computed(() => {
  if (!cluesData.value?.items) return [];
  return cluesData.value.items.filter((item) => {
    const allowRedHerring = showRedHerrings.value || !item.redHerring;
    const allowChapter = !playModeEnabled.value || (item.revealChapter ?? 1) <= currentChapter.value;
    return allowRedHerring && allowChapter;
  });
});

const chapterOptions = computed(() => {
  const chapters = outlineData.value?.chapters;
  if (Array.isArray(chapters) && chapters.length > 0) {
    return chapters.map((_, index) => index + 1);
  }
  return [1, 2, 3];
});

const castNamesInput = computed({
  get: () => (Array.isArray(spec.value.castNames) ? spec.value.castNames.join(", ") : ""),
  set: (value: string) => {
    const names = value
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean);
    spec.value.castNames = names;
    if (names.length) {
      spec.value.castSize = names.length;
    }
  },
});

const viewLabel = computed(() => {
  switch (currentView.value) {
    case "dashboard":
      return "Dashboard";
    case "builder":
      return "Builder";
    case "cast":
      return "Cast";
    case "clues":
      return "Clue board";
    case "outline":
      return "Outline";
    case "samples":
      return "Samples";
    case "cml":
      return "CML Viewer";
    default:
      return "Dashboard";
  }
});

const synopsisSummary = computed(() => {
  const summary = synopsisData.value?.summary?.trim();
  if (!summary) return "";
  const title = synopsisData.value?.title?.trim();
  if (title && summary.startsWith(title)) {
    return summary.slice(title.length).replace(/^[\s:–—-]+/, "").trim();
  }
  return summary;
});

const scrollToSection = (id: string) => {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
};

const maxChapter = computed(() => chapterOptions.value[chapterOptions.value.length - 1] ?? 1);

const castCount = computed(() => castData.value?.suspects?.length ?? 0);
const cluesCount = computed(() => cluesData.value?.items?.length ?? 0);
const outlineReady = computed(() => Boolean(outlineArtifact));
const fairPlayReady = computed(() => Boolean(fairPlayReport));
const gamePackReady = computed(() => Boolean(gamePackData));

const nextChapter = () => {
  if (!playModeEnabled.value) return;
  currentChapter.value = Math.min(currentChapter.value + 1, maxChapter.value);
};

const prevChapter = () => {
  if (!playModeEnabled.value) return;
  currentChapter.value = Math.max(currentChapter.value - 1, 1);
};

watch(chapterOptions, (options) => {
  if (!options.includes(currentChapter.value)) {
    currentChapter.value = options[options.length - 1] ?? 1;
  }
});

watch([projectName, projectId, latestSpecId, currentView, mode], () => {
  persistState();
});

watch(projectId, (nextId) => {
  if (nextId) {
    loadArtifacts();
  }
});

watch(
  spec,
  () => {
    persistState();
  },
  { deep: true },
);

const connectSse = () => {
  if (!projectId.value) {
    runStatus.value = "No project • create one first";
    return;
  }
  if (unsubscribe) {
    unsubscribe();
  }
  unsubscribe = subscribeToRunEvents(
    projectId.value,
    (payload) => {
      runStatus.value = `${payload.status} • project ${payload.projectId}`;
      const previous = lastProjectStatus.value;
      lastProjectStatus.value = payload.status;
      if (previous === "running" && payload.status === "idle") {
        pollArtifacts();
      }
    },
    () => {
      runStatus.value = "Disconnected • retrying";
    },
  );
};

const disconnectSse = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
};

// Watchers for tab navigation sync
// Update tab status based on project state
watch([projectId, isAdvanced], () => {
  if (projectId.value) {
    tabStatuses.value.project = "complete";
  }
  if (isAdvanced.value) {
    tabStatuses.value.advanced = "available";
  } else {
    tabStatuses.value.advanced = "locked";
  }
});

// Sync tab navigation with current view
watch(activeMainTab, (newTab) => {
  switch (newTab) {
    case "project":
      setView("dashboard");
      break;
    case "spec":
      setView("builder");
      break;
    case "generate":
      setView("generate");
      break;
    case "review":
      // Use active review sub-tab
      if (activeReviewTab.value === "cast") setView("cast");
      else if (activeReviewTab.value === "clues") setView("clues");
      else if (activeReviewTab.value === "outline") setView("outline");
      else if (activeReviewTab.value === "prose") setView("prose");
      break;
    case "advanced":
      // Use active advanced sub-tab
      if (activeAdvancedTab.value === "cml") setView("cml");
      else if (activeAdvancedTab.value === "samples") setView("samples");
      else if (activeAdvancedTab.value === "history") setView("history");
      break;
    case "export":
      setView("dashboard");
      break;
  }
});

watch(activeReviewTab, (newTab) => {
  if (activeMainTab.value === "review") {
    setView(newTab as View);
  }
});

watch(activeAdvancedTab, (newTab) => {
  if (activeMainTab.value === "advanced") {
    setView(newTab as View);
  }
});

// Sync currentView changes back to tabs (for sidebar navigation)
watch(currentView, (newView) => {
  switch (newView) {
    case "dashboard":
    case "builder":
      activeMainTab.value = newView === "dashboard" ? "project" : "spec";
      break;
    case "generate":
      activeMainTab.value = "generate";
      break;
    case "cast":
    case "clues":
    case "outline":
    case "prose":
      activeMainTab.value = "review";
      activeReviewTab.value = newView;
      break;
    case "cml":
    case "samples":
    case "history":
      activeMainTab.value = "advanced";
      activeAdvancedTab.value = newView;
      break;
  }
});

const checkHealth = async () => {
  healthStatus.value = "idle";
  try {
    const health = await fetchHealth();
    healthStatus.value = "ok";
    healthMessage.value = `${health.service} • ${health.status}`;
    addError("info", "system", "API connection successful");
  } catch (error) {
    healthStatus.value = "error";
    healthMessage.value = "API unreachable";
    addError("error", "system", "API unreachable", "Check that the API server is running on the correct port");
  }
};

const handleCreateProject = async () => {
  clearErrors("project");
  try {
    const project = await createProject(projectName.value.trim() || "Untitled project");
    projectId.value = project.id;
    projectIdInput.value = project.id;
    selectedProjectId.value = project.id;
    missingProjectNotified.value = false;
    projectsList.value = [project, ...projectsList.value.filter((entry) => entry.id !== project.id)];
    runStatus.value = `idle • project ${project.id}`;
    
    // Reset validation state for new project (no artifacts yet)
    allValidation.value = {
      setting: { valid: true, errors: [], warnings: [] },
      cast: { valid: true, errors: [], warnings: [] },
      cml: { valid: true, errors: [], warnings: [] },
      clues: { valid: true, errors: [], warnings: [] },
      outline: { valid: true, errors: [], warnings: [] },
    };
    
    connectSse();
    addError("info", "project", `Project created: ${project.id}. Configure your spec, then click Generate.`);
    persistState();
    logActivity({ projectId: project.id, scope: "ui", message: "project_created" });
    await loadProjects();
    // Don't auto-run pipeline - user should configure spec first and manually click Generate
  } catch (error) {
    addError("error", "project", "Failed to create project", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "project_create_failed" });
  }
};

const loadProjects = async () => {
  clearErrors("project");
  try {
    projectsList.value = await fetchProjects();
    if (projectId.value && !selectedProjectId.value) {
      selectedProjectId.value = projectId.value;
    }
    if (projectId.value && !projectsList.value.some((project) => project.id === projectId.value)) {
      projectId.value = null;
      latestSpecId.value = null;
      selectedProjectId.value = "";
      runStatus.value = "Idle • No active run";
      missingProjectNotified.value = true;
      persistState();
      addError(
        "warning",
        "project",
        "Saved project not found",
        "The API was restarted or the project was deleted. Create a new project or select an existing one."
      );
    }
  } catch (error) {
    addError("warning", "project", "Failed to load project list", error instanceof Error ? error.message : String(error));
  }
};

const handleLoadProject = async () => {
  const nextId = projectIdInput.value.trim();
  if (!nextId) {
    addError("warning", "project", "Please enter a project ID");
    return;
  }
  clearErrors("project");
  try {
    const project = await fetchProject(nextId);
    projectId.value = project.id;
    projectName.value = project.name;
    runStatus.value = `idle • project ${project.id}`;
    connectSse();
    persistState();
    await pollArtifacts();
    addError("info", "project", `Project loaded: ${project.id}`);
    logActivity({ projectId: project.id, scope: "ui", message: "project_loaded" });
  } catch (error) {
    addError("error", "project", "Failed to load project", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: nextId, scope: "ui", message: "project_load_failed" });
  }
};

const handleSaveSpec = async () => {
  if (!projectId.value) {
    addError("warning", "spec", "Create a project first");
    return;
  }
  clearErrors("spec");
  try {
    const saved = await saveSpec(projectId.value, spec.value);
    latestSpecId.value = saved.id;
    addError("info", "spec", `Spec saved: ${saved.id}`);
    persistState();
    logActivity({ projectId: projectId.value, scope: "ui", message: "spec_saved", payload: { specId: saved.id } });
  } catch (error) {
    addError("error", "spec", "Failed to save spec", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "spec_save_failed" });
  }
};

const loadArtifacts = async () => {
  if (!projectId.value) return;
  artifactsStatus.value = "loading";
  clearErrors("artifacts");
  
  const [
    setting,
    cast,
    cml,
    validation,
    clues,
    fairPlay,
    outline,
    prose,
    gamePack,
    synopsis,
    settingValidation,
    castValidation,
    cluesValidation,
    outlineValidation,
    noveltyAudit,
  ] = await Promise.allSettled([
    fetchSetting(projectId.value),
    fetchCast(projectId.value),
    fetchCml(projectId.value),
    fetchCmlValidation(projectId.value),
    fetchClues(projectId.value),
    fetchFairPlayReport(projectId.value),
    fetchOutline(projectId.value),
    fetchProse(projectId.value),
    fetchGamePack(projectId.value),
    fetchSynopsis(projectId.value),
    fetchSettingValidation(projectId.value),
    fetchCastValidation(projectId.value),
    fetchCluesValidation(projectId.value),
    fetchOutlineValidation(projectId.value),
    // New: fetch novelty audit
    fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3005"}/api/projects/${projectId.value}/novelty-audit/latest`)
      .then(r => r.ok ? r.json() as Promise<Artifact> : Promise.reject(new Error(`${r.status}`))),
  ]);

  settingArtifact.value = setting.status === "fulfilled" ? JSON.stringify(setting.value.payload, null, 2) : null;
  settingData.value = setting.status === "fulfilled" ? (setting.value.payload as typeof settingData.value) : null;
  castArtifact.value = cast.status === "fulfilled" ? JSON.stringify(cast.value.payload, null, 2) : null;
  castData.value = cast.status === "fulfilled" ? (cast.value.payload as { suspects?: string[] }) : null;
  cmlArtifact.value = cml.status === "fulfilled" ? JSON.stringify(cml.value.payload, null, 2) : null;
  
  // Update validation state
  allValidation.value = {
    setting: settingValidation.status === "fulfilled" 
      ? (settingValidation.value.payload as ValidationResult)
      : { valid: true, errors: [], warnings: [] },
    cast: castValidation.status === "fulfilled"
      ? (castValidation.value.payload as ValidationResult)
      : { valid: true, errors: [], warnings: [] },
    cml: validation.status === "fulfilled"
      ? (validation.value.payload as ValidationResult)
      : { valid: true, errors: [], warnings: [] },
    clues: cluesValidation.status === "fulfilled"
      ? (cluesValidation.value.payload as ValidationResult)
      : { valid: true, errors: [], warnings: [] },
    outline: outlineValidation.status === "fulfilled"
      ? (outlineValidation.value.payload as ValidationResult)
      : { valid: true, errors: [], warnings: [] },
  };
  
  cluesArtifact.value = clues.status === "fulfilled" ? JSON.stringify(clues.value.payload, null, 2) : null;
  cluesData.value = clues.status === "fulfilled" ? (clues.value.payload as typeof cluesData.value) : null;
  fairPlayReport.value = fairPlay.status === "fulfilled" ? (fairPlay.value.payload as typeof fairPlayReport.value) : null;
  outlineArtifact.value = outline.status === "fulfilled" ? JSON.stringify(outline.value.payload, null, 2) : null;
  outlineData.value = outline.status === "fulfilled" ? (outline.value.payload as typeof outlineData.value) : null;
  proseArtifact.value = prose.status === "fulfilled" ? JSON.stringify(prose.value.payload, null, 2) : null;
  
  // Parse prose into structured format
  proseData.value = prose.status === "fulfilled" ? (prose.value.payload as ProseData) : null;
  
  gamePackArtifact.value = gamePack.status === "fulfilled" ? JSON.stringify(gamePack.value.payload, null, 2) : null;
  gamePackData.value = gamePack.status === "fulfilled" ? (gamePack.value.payload as typeof gamePackData.value) : null;
  synopsisData.value = synopsis.status === "fulfilled" ? (synopsis.value.payload as typeof synopsisData.value) : null;
  
  // Parse novelty audit
  noveltyAuditData.value = noveltyAudit.status === "fulfilled" ? (noveltyAudit.value.payload as NoveltyAuditData) : null;

  // Fetch run events
  const latestRun = await fetchLatestRun(projectId.value).catch(() => null);
  if (latestRun) {
    latestRunId.value = latestRun.id;
    const events = await fetchRunEvents(latestRun.id).catch(() => []);
    runEventsData.value = events;
  }

  const failures = [
    setting,
    cast,
    cml,
    validation,
    clues,
    fairPlay,
    outline,
    prose,
    gamePack,
    synopsis,
    settingValidation,
    castValidation,
    cluesValidation,
    outlineValidation,
    noveltyAudit,
  ].filter((result) => result.status === "rejected");

  const failureReasons = failures
    .map((result) => (result.status === "rejected" ? result.reason : null))
    .filter((reason): reason is Error => reason instanceof Error);
  const hasNotFound = failureReasons.some((reason) => reason.message.includes("(404)"));
  const hasNetworkError = failureReasons.some((reason) => reason.message.toLowerCase().includes("failed to fetch"));

  if (failures.length === 0) {
    artifactsStatus.value = "ready";
    addError("info", "artifacts", "All artifacts loaded successfully");
  } else if (failures.length === 15) {
    if (hasNotFound) {
      const projectMissing = projectId.value
        ? !projectsList.value.some((project) => project.id === projectId.value)
        : false;
      if (projectMissing && !missingProjectNotified.value) {
        missingProjectNotified.value = true;
        projectId.value = null;
        latestSpecId.value = null;
        selectedProjectId.value = "";
        runStatus.value = "Idle • No active run";
        persistState();
        addError(
          "warning",
          "project",
          "Saved project not found",
          "The API was restarted or the project was deleted. Create a new project or select an existing one."
        );
      } else if (!missingProjectNotified.value) {
        artifactsStatus.value = "error";
        addError(
          "error",
          "artifacts",
          "No artifacts found for this project",
          "The API may have restarted or the project ID is invalid. Load the project again or rerun the pipeline."
        );
        missingProjectNotified.value = true;
      }
    } else if (hasNetworkError) {
      artifactsStatus.value = "error";
      addError(
        "error",
        "artifacts",
        "API unreachable",
        "Check that the API server is running and refresh the page."
      );
    } else {
      // All artifacts failed - likely a new project with no generated content yet
      artifactsStatus.value = "idle";
      // Don't show error - this is expected for new projects
    }
  } else if (failures.length < 5) {
    artifactsStatus.value = "partial";
    addError("warning", "artifacts", `${failures.length} artifacts failed to load`, "Some content may be unavailable. Refresh to retry.");
  } else {
    artifactsStatus.value = "error";
    addError("error", "artifacts", "Failed to load most artifacts", "Check API connection and try refreshing.");
  }
};

const refreshArtifacts = async () => {
  if (!projectId.value) {
    addError("warning", "artifacts", "Create a project first");
    return;
  }
  await loadArtifacts();
};

const pollArtifacts = async (attempts = 8, delayMs = 1500) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    await loadArtifacts();
    if (castData.value?.suspects?.length || outlineArtifact.value) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  addError("warning", "artifacts", "Generated data not ready yet", "Please refresh again in a moment");
};

const handleRunPipeline = async () => {
  if (!projectId.value) {
    addError("warning", "pipeline", "Create a project first");
    return;
  }
  clearErrors("pipeline");
  try {
    await runPipeline(projectId.value);
    await pollArtifacts();
    addError("info", "pipeline", "Pipeline completed successfully");
    logActivity({ projectId: projectId.value, scope: "ui", message: "run_started" });
  } catch (error) {
    addError("error", "pipeline", "Failed to start pipeline", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "run_failed" });
  }
};

const handleRegenerate = async (scope: "setting" | "cast" | "clues" | "outline" | "prose") => {
  if (!projectId.value) {
    addError("warning", "regenerate", "Create a project first");
    return;
  }
  clearErrors("regenerate");
  try {
    await regenerateArtifact(projectId.value, scope);
    await loadArtifacts();
    addError("info", "regenerate", `${scope} regenerated successfully`);
    logActivity({ projectId: projectId.value, scope: "ui", message: "regenerate", payload: { scope } });
  } catch (error) {
    addError("error", "regenerate", `Failed to regenerate ${scope}`, error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "regenerate_failed", payload: { scope } });
  }
};

const handleDownloadGamePackPdf = async () => {
  if (!projectId.value) {
    addError("warning", "export", "Create a project first");
    return;
  }
  try {
    const blob = await downloadGamePackPdf(projectId.value);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `game_pack_${projectId.value}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    addError("info", "export", "Game pack PDF downloaded");
    logActivity({ projectId: projectId.value, scope: "ui", message: "download_game_pack_pdf" });
  } catch (error) {
    addError("error", "export", "Failed to download game pack", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "download_game_pack_failed" });
  }
};

const loadSamples = async () => {
  clearErrors("samples");
  try {
    samples.value = await fetchSamples();
  } catch (error) {
    addError("error", "samples", "Failed to load samples", error instanceof Error ? error.message : String(error));
  }
};

const handleSampleSelect = async (id: string) => {
  clearErrors("samples");
  try {
    selectedSample.value = await fetchSampleContent(id);
    logActivity({ projectId: projectId.value, scope: "ui", message: "sample_selected", payload: { id } });
  } catch (error) {
    addError("error", "samples", "Failed to load sample", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "sample_select_failed", payload: { id } });
  }
};

onMounted(async () => {
  hydrateState();
  checkHealth();
  connectSse();
  await loadProjects();
  loadSamples();
  if (projectId.value) {
    loadArtifacts();
  }
});

onBeforeUnmount(() => {
  disconnectSse();
});
</script>

<template>
  <div class="min-h-screen">
    <div class="flex h-screen">
      <aside class="hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 md:flex">
        <div class="text-lg font-semibold">CML Whodunit Builder</div>
        <nav class="mt-6 space-y-1 text-sm">
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'dashboard' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('dashboard')"
          >
            Dashboard
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'builder' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('builder')"
          >
            Builder
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'cast' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('cast')"
          >
            Cast
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'clues' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('clues')"
          >
            Clues
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'outline' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('outline')"
          >
            Outline
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'prose' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('prose')"
          >
            Prose
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'samples' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('samples')"
          >
            Samples
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'history' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('history')"
          >
            History
          </button>
          <button
            v-if="isAdvanced"
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'cml' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('cml')"
          >
            CML Viewer
          </button>
        </nav>
      </aside>

      <!-- Error Notifications -->
      <ErrorNotification :errors="errors" @dismiss="dismissError" @clear="clearErrors" />

      <div class="flex min-w-0 flex-1 flex-col">
        <header class="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <div class="text-sm text-slate-500">Project</div>
            <div class="text-lg font-semibold">{{ projectName }}</div>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <label class="flex items-center gap-2 text-slate-600">
              <input
                v-model="advancedChecked"
                data-testid="advanced-toggle"
                type="checkbox"
                class="h-4 w-4 rounded border border-slate-300"
              />
              Advanced
            </label>
            <label class="flex items-center gap-2 text-slate-600">
              <input
                v-model="expertChecked"
                data-testid="expert-toggle"
                type="checkbox"
                class="h-4 w-4 rounded border border-slate-300"
              />
              Expert
            </label>
            <div class="ml-2 text-xs text-slate-500">Mode: {{ mode }}</div>
          </div>
        </header>

        <!-- Main Tab Navigation -->
        <TabBar
          :tabs="mainTabs"
          :active-tab="activeMainTab"
          :tab-statuses="tabStatuses"
          @update:active-tab="activeMainTab = $event"
        />

        <!-- Sub-tab Navigation for Review -->
        <TabBar
          v-if="activeMainTab === 'review'"
          :tabs="reviewTabs"
          :active-tab="activeReviewTab"
          @update:active-tab="activeReviewTab = $event"
          class="bg-slate-50"
        />

        <!-- Sub-tab Navigation for Advanced -->
        <TabBar
          v-if="activeMainTab === 'advanced' && isAdvanced"
          :tabs="advancedTabs"
          :active-tab="activeAdvancedTab"
          @update:active-tab="activeAdvancedTab = $event"
          class="bg-slate-50"
        />

        <main class="flex min-h-0 flex-1 gap-6 overflow-hidden bg-slate-50 px-6 py-6">
          <section class="flex min-w-0 flex-1 flex-col gap-6 overflow-auto relative">
            <!-- Project Tab -->
            <TabPanel id="project-tab" :active="activeMainTab === 'project'" :lazy="true">
              <div class="flex flex-col gap-6">

            <div class="rounded-lg border border-blue-100 bg-blue-50 p-4 shadow-sm">
              <div class="text-sm font-semibold text-blue-900">Welcome to your Mystery Generator</div>
              <div class="mt-2 text-sm text-blue-800">
                This is your project dashboard. Create a new project, configure your story settings in the Spec tab, then generate your mystery in the Generate tab. All generated content will appear here and in the Review tab.
              </div>
            </div>

            <div v-if="synopsisData" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Synopsis</div>
              <div class="mt-2 text-sm text-slate-600">
                <strong v-if="synopsisData.title" class="text-slate-800">{{ synopsisData.title }}</strong>
                <span :class="synopsisData.title ? 'ml-2' : ''">{{ synopsisSummary }}</span>
              </div>
              <div class="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                <button
                  class="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600"
                  @click="scrollToSection('dashboard-details')"
                >
                  View details below
                </button>
                <button
                  class="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600"
                  @click="setView('clues')"
                >
                  Open Clue board
                </button>
                <button
                  class="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600"
                  @click="setView('outline')"
                >
                  Open Outline
                </button>
                <button
                  v-if="isAdvanced"
                  class="rounded border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600"
                  @click="setView('cml')"
                >
                  Open CML Viewer
                </button>
              </div>
            </div>

            <div v-if="currentView === 'dashboard' || currentView === 'builder'" class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Project setup</div>
              <div class="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label class="text-xs font-semibold text-slate-500">Project name</label>
                  <input
                    v-model="projectName"
                    class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Golden Age Prototype"
                  />
                </div>
                <div class="flex items-end">
                  <button
                    class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    @click="handleCreateProject"
                  >
                    Create project
                  </button>
                </div>
                <div>
                  <label class="text-xs font-semibold text-slate-500">Load project by ID</label>
                  <input
                    v-model="projectIdInput"
                    class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    placeholder="proj_..."
                  />
                </div>
                <div class="flex items-end">
                  <button
                    class="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    @click="handleLoadProject"
                  >
                    Load project
                  </button>
                </div>
                <div>
                  <label class="text-xs font-semibold text-slate-500">Load existing project</label>
                  <select
                    v-model="selectedProjectId"
                    class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="">Select a project</option>
                    <option v-for="project in projectsList" :key="project.id" :value="project.id">
                      {{ project.name }} ({{ project.id }})
                    </option>
                  </select>
                </div>
                <div class="flex items-end">
                  <button
                    class="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    :disabled="!selectedProjectId"
                    @click="projectIdInput = selectedProjectId; handleLoadProject()"
                  >
                    Load selected
                  </button>
                </div>
              </div>
              <div class="mt-3 text-xs text-slate-500">
                Project ID: {{ projectId ?? "not created" }} • Spec: {{ latestSpecId ?? "not saved" }}
              </div>
            </div>

              </div>
            </TabPanel>

            <!-- Spec Tab -->
            <TabPanel id="spec-tab" :active="activeMainTab === 'spec'" :lazy="true">
              <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Story Specification</div>
                <div class="mt-4 text-sm text-slate-600">
                  Configure your mystery story settings. These specifications will guide the AI generation.
                </div>
                <div class="mt-6 grid gap-4 md:grid-cols-2">
                  <div>
                    <label class="text-xs font-semibold text-slate-500">Decade</label>
                    <select v-model="spec.decade" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                      <option>1930s</option>
                      <option>1940s</option>
                      <option>1950s</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-slate-500">Location preset</label>
                    <select v-model="spec.locationPreset" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                      <option>CountryHouse</option>
                      <option>SeasideHotel</option>
                      <option>Village</option>
                      <option>Liner</option>
                      <option>Theatre</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-slate-500">Tone</label>
                    <select v-model="spec.tone" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                      <option>Cozy</option>
                      <option>Classic</option>
                      <option>Dark</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-slate-500">Cast size</label>
                    <input
                      v-model.number="spec.castSize"
                      type="number"
                      min="4"
                      max="12"
                      class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs font-semibold text-slate-500">Cast names (comma-separated)</label>
                    <input
                      v-model="castNamesInput"
                      class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm"
                      placeholder="Avery, Blair, Casey, Dana, Ellis, Finley"
                    />
                    <div class="mt-1 text-[11px] text-slate-400">
                      Optional. If provided, the cast list will use these names.
                    </div>
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-slate-500">Primary axis</label>
                    <select v-model="spec.primaryAxis" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                      <option>temporal</option>
                      <option>spatial</option>
                      <option>identity</option>
                      <option>behavioral</option>
                      <option>authority</option>
                    </select>
                  </div>
                </div>
                <div class="mt-4 text-xs text-slate-500">
                  This is a minimal spec draft for Phase 1; additional fields will be added in later phases.
                </div>
              </div>
            </TabPanel>

            <!-- Generate Tab -->
            <TabPanel id="generate-tab" :active="activeMainTab === 'generate'" :lazy="true">
              <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Generate Content</div>
                <div class="mt-4 text-sm text-slate-600">
                  Run the pipeline to generate all artifacts. Monitor progress below.
                </div>

                <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span
                    :class="[
                      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
                      healthStatus === 'ok' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700',
                    ]"
                  >
                    API: {{ healthMessage }}
                  </span>
                  <button class="text-xs font-semibold text-slate-600 underline" @click="checkHealth">
                    Recheck API
                  </button>
                  <button
                    class="text-xs font-semibold text-slate-600 underline"
                    :disabled="!projectId || artifactsStatus === 'loading'"
                    @click="refreshArtifacts"
                  >
                    Refresh data
                  </button>
                </div>

                <div class="mt-3 text-xs text-slate-500">
                  Cast: {{ castCount }} • Clues: {{ cluesCount }} • Outline: {{ outlineReady ? "ready" : "pending" }} • Fair-play:
                  {{ fairPlayReady ? "ready" : "pending" }} • Game pack: {{ gamePackReady ? "ready" : "pending" }}
                </div>

                <div class="mt-4 flex flex-wrap gap-3">
                  <button
                    class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    @click="handleRunPipeline"
                  >
                    Generate
                  </button>
                  <button
                    class="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    @click="handleSaveSpec"
                  >
                    Save draft
                  </button>
                </div>

                <!-- Regenerate Controls -->
                <div class="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Regenerate Individual Artifacts</div>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId"
                      @click="handleRegenerate('setting')"
                    >
                      Setting
                    </button>
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId"
                      @click="handleRegenerate('cast')"
                    >
                      Cast
                    </button>
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId"
                      @click="handleRegenerate('clues')"
                    >
                      Clues
                    </button>
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId"
                      @click="handleRegenerate('outline')"
                    >
                      Outline
                    </button>
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId"
                      @click="handleRegenerate('prose')"
                    >
                      Generate Story
                    </button>
                  </div>
                  <div class="mt-2 text-xs text-slate-500">
                    Regenerate a specific artifact without running the full pipeline.
                  </div>
                </div>
              </div>
            </TabPanel>

            <!-- Review Tab with sub-tabs -->
            <TabPanel id="review-tab" :active="activeMainTab === 'review'" :lazy="true">
              <div class="flex flex-col gap-6">

            <div class="rounded-lg border border-purple-100 bg-purple-50 p-4 shadow-sm">
              <div class="text-sm font-semibold text-purple-900">Review Generated Content</div>
              <div class="mt-2 text-sm text-purple-800">
                <span v-if="activeReviewTab === 'cast'">Review the cast of suspects with their roles and relationships.</span>
                <span v-else-if="activeReviewTab === 'clues'">Browse all clues with red herring filtering and play mode to reveal by chapter.</span>
                <span v-else-if="activeReviewTab === 'outline'">View the story structure broken down by chapters and events.</span>
                <span v-else-if="activeReviewTab === 'prose'">Read the full narrative story text.</span>
              </div>
            </div>

            <div v-if="currentView === 'cast'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-slate-700">Cast of Suspects</div>
                <div class="text-xs text-slate-500">{{ castData?.suspects?.length || 0 }} suspects</div>
              </div>
              <div v-if="castData && castData.suspects && castData.suspects.length" class="mt-4 space-y-2 text-sm text-slate-600">
                <div v-for="suspect in castData.suspects" :key="suspect" class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
                  {{ suspect }}
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-slate-500">Cast not yet generated.</div>
            </div>

            <div v-if="currentView === 'clues'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-semibold text-slate-700">Clue Board</div>
                  <div class="mt-1 text-xs text-slate-500">{{ cluesData?.items?.length || 0 }} total clues</div>
                </div>
                <div class="flex items-center gap-3 text-xs">
                  <label class="flex items-center gap-1">
                    <input v-model="showRedHerrings" type="checkbox" class="h-3 w-3" />
                    Show red herrings
                  </label>
                  <label class="flex items-center gap-1">
                    <input v-model="playModeEnabled" type="checkbox" class="h-3 w-3" />
                    Play mode
                  </label>
                  <select v-if="playModeEnabled" v-model="currentChapter" class="rounded border border-slate-200 px-2 py-1">
                    <option v-for="ch in chapterOptions" :key="ch" :value="ch">Chapter {{ ch }}</option>
                  </select>
                </div>
              </div>
              <div v-if="filteredClues.length" class="mt-4 space-y-2">
                <div
                  v-for="clue in filteredClues"
                  :key="clue.id"
                  class="rounded-md border px-3 py-2 text-sm"
                  :class="clue.redHerring ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'"
                >
                  <div class="font-semibold text-slate-700">{{ clue.category }}</div>
                  <div class="mt-1 text-slate-600">{{ clue.text }}</div>
                  <div class="mt-1 text-xs text-slate-500">
                    Points to: {{ clue.pointsTo }}
                    <span v-if="clue.revealChapter"> • Reveal: Ch.{{ clue.revealChapter }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-slate-500">Clues not yet generated.</div>
            </div>

            <div v-if="currentView === 'outline'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-slate-700">Story Outline</div>
                <div class="text-xs text-slate-500">{{ outlineData?.chapters?.length || 0 }} chapters</div>
              </div>
              <div v-if="outlineData && outlineData.chapters && outlineData.chapters.length" class="mt-4 space-y-4">
                <div v-for="(chapter, idx) in outlineData.chapters" :key="idx" class="border-l-2 border-slate-300 pl-4">
                  <div class="text-sm font-semibold text-slate-700">Chapter {{ idx + 1 }}: {{ chapter.title || 'Untitled' }}</div>
                  <div class="mt-1 text-sm text-slate-600">{{ chapter.summary || chapter.description || 'No summary available' }}</div>
                  <div v-if="chapter.events && chapter.events.length" class="mt-2 text-xs text-slate-500">
                    {{ chapter.events.length }} event(s)
                  </div>
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-slate-500">Outline not yet generated.</div>
            </div>

            <div v-if="currentView === 'prose'">
              <ProseReader v-if="proseData" :prose-data="proseData" />
              <div v-else class="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                Prose not yet generated
              </div>
            </div>
              </div>
            </TabPanel>

            <!-- Advanced Tab with sub-tabs -->
            <TabPanel id="advanced-tab" :active="activeMainTab === 'advanced' && isAdvanced" :lazy="true">
              <div class="flex flex-col gap-6">

            <div class="rounded-lg border border-amber-100 bg-amber-50 p-4 shadow-sm">
              <div class="text-sm font-semibold text-amber-900">Advanced Mode</div>
              <div class="mt-2 text-sm text-amber-800">
                <span v-if="activeAdvancedTab === 'cml'">View the raw CML (Compositional Mystery Language) structure. Expert mode enables editing.</span>
                <span v-else-if="activeAdvancedTab === 'samples'">Browse example mystery structures for inspiration. Use these as patterns, not templates to copy.</span>
                <span v-else-if="activeAdvancedTab === 'history'">View the complete run history and event log for this project.</span>
              </div>
            </div>

            <div v-if="currentView === 'cml'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-slate-700">CML Viewer</div>
                <div class="text-xs text-slate-500">
                  <span v-if="isExpert" class="rounded bg-red-100 px-2 py-1 text-red-700">Expert Mode - Editable</span>
                  <span v-else class="rounded bg-slate-100 px-2 py-1 text-slate-700">Read-only</span>
                </div>
              </div>
              <div class="mt-2 text-xs text-slate-500">
                CML (Compositional Mystery Language) is the canonical source of truth for your mystery structure.
              </div>
              <div v-if="cmlArtifact" class="mt-4">
                <pre class="overflow-auto rounded-md bg-slate-900 p-4 text-xs text-slate-100">{{ cmlArtifact }}</pre>
              </div>
              <div v-else class="mt-4 text-sm text-slate-500">CML not yet generated.</div>
            </div>

            <div v-if="currentView === 'samples'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Sample Mystery Structures</div>
              <div class="mt-2 text-xs text-slate-500">
                Browse classic mystery examples for structural inspiration. These show patterns and techniques, but content should not be copied to ensure novelty.
              </div>
              <div class="mt-4 grid gap-2">
                <button
                  v-for="sample in samples"
                  :key="sample.id"
                  class="rounded-md border border-slate-200 px-3 py-2 text-left text-sm hover:bg-slate-50"
                  :class="selectedSample?.id === sample.id ? 'bg-slate-100' : ''"
                  @click="handleSampleSelect(sample.id)"
                >
                  {{ sample.name }}
                </button>
              </div>
              <div v-if="selectedSample" class="mt-4">
                <pre class="overflow-auto rounded-md bg-slate-900 p-4 text-xs text-slate-100">{{ selectedSample.content }}</pre>
              </div>
            </div>

            <div v-if="currentView === 'history'">
              <RunHistory v-if="runEventsData.length" :events="runEventsData" :run-id="latestRunId" />
              <div v-else class="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                No run history available
              </div>
            </div>
              </div>
            </TabPanel>

            <!-- Export Tab -->
            <TabPanel id="export-tab" :active="activeMainTab === 'export'" :lazy="true">
              <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Export Your Mystery</div>
                <div class="mt-4 text-sm text-slate-600">
                  Download your complete game pack as a PDF. This includes suspect cards, clue materials, and all content needed to run your mystery game.
                </div>
                <div class="mt-2 text-xs text-slate-500">
                  Game pack status: {{ gamePackReady ? 'Ready to download' : 'Generate content first to enable export' }}
                </div>
                <div class="mt-4">
                  <button
                    class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    @click="handleDownloadGamePackPdf"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </TabPanel>

            <!-- Dashboard details shown in Project tab only -->
            <div v-if="activeMainTab === 'project'" id="dashboard-details" class="grid gap-6 md:grid-cols-2">
              <div v-if="settingData" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Setting overview</div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ settingData.decade ?? "Unknown era" }} •
                  {{ settingData.locationPreset ?? "Unknown location" }} •
                  {{ settingData.weather ?? "Unknown weather" }}
                </div>
                <div v-if="settingData?.socialStructure" class="mt-1 text-xs text-slate-500">
                  Social: {{ settingData.socialStructure }}
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Cast cards</div>
                <div v-if="castData?.suspects?.length" class="mt-3 grid gap-2 text-xs text-slate-700">
                  <div
                    v-for="suspect in castData.suspects"
                    :key="suspect"
                    class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div class="text-sm font-semibold">{{ suspect }}</div>
                    <div class="text-[11px] text-slate-500">Role: Suspect • Motive: pending</div>
                  </div>
                </div>
                <div v-else class="mt-2 text-sm text-slate-600">
                  Cast not loaded yet. Run the pipeline, then refresh data.
                  <button
                    class="ml-2 text-xs font-semibold text-slate-600 underline"
                    :disabled="!projectId || artifactsStatus === 'loading'"
                    @click="refreshArtifacts"
                  >
                    Refresh data
                  </button>
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Clue board</div>
                <div class="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                  <div>{{ cluesData?.items?.length ? `${cluesData.items.length} clues` : "No clues generated yet" }}</div>
                  <div class="flex items-center gap-3">
                    <label class="flex items-center gap-2">
                      <input v-model="playModeEnabled" type="checkbox" />
                      Play mode
                    </label>
                    <label v-if="playModeEnabled" class="flex items-center gap-2">
                      <span>Chapter</span>
                      <select v-model.number="currentChapter" class="rounded border border-slate-200 px-2 py-1">
                        <option v-for="chapter in chapterOptions" :key="chapter" :value="chapter">
                          {{ chapter }}
                        </option>
                      </select>
                    </label>
                    <div v-if="playModeEnabled" class="flex items-center gap-2">
                      <button
                        class="rounded border border-slate-200 px-2 py-1 text-[11px]"
                        :disabled="currentChapter <= 1"
                        @click="prevChapter"
                      >
                        Prev
                      </button>
                      <button
                        class="rounded border border-slate-200 px-2 py-1 text-[11px]"
                        :disabled="currentChapter >= maxChapter"
                        @click="nextChapter"
                      >
                        Next
                      </button>
                      <span class="text-[11px] text-slate-400">{{ currentChapter }} / {{ maxChapter }}</span>
                    </div>
                    <label class="flex items-center gap-2">
                      <input v-model="showRedHerrings" type="checkbox" />
                      Show red herrings
                    </label>
                  </div>
                </div>
                <div v-if="filteredClues.length" class="mt-3 space-y-2 text-sm text-slate-700">
                  <div
                    v-for="clue in filteredClues"
                    :key="clue.id"
                    class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div class="flex items-center justify-between text-xs text-slate-500">
                      <span class="uppercase">{{ clue.category }}</span>
                      <span v-if="clue.redHerring" class="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                        Red herring
                      </span>
                    </div>
                    <div class="mt-1 text-sm font-medium text-slate-700">{{ clue.text }}</div>
                    <div class="mt-1 text-[11px] text-slate-500">
                      Points to: {{ clue.pointsTo }} · Reveal: Chapter {{ clue.revealChapter ?? 1 }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Outline</div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ outlineArtifact ? "Outline placeholder stored" : "Outline will appear after validation" }}
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Fair-play report</div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ fairPlayReport ? fairPlayReport.summary : "Report will appear after clues" }}
                </div>
                <div v-if="fairPlayReport?.checks?.length" class="mt-3 space-y-1 text-xs text-slate-600">
                  <div v-for="check in fairPlayReport.checks" :key="check.id" class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full" :class="check.status === 'pass' ? 'bg-emerald-500' : 'bg-amber-500'"></span>
                    <span>{{ check.label }}</span>
                  </div>
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Game pack</div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ gamePackData?.title ?? "Game pack pending" }}
                </div>
                <div class="mt-2 text-xs text-slate-500">
                  {{ gamePackData?.suspects?.length ?? 0 }} suspects · {{ gamePackData?.materials?.length ?? 0 }} materials
                </div>
                <button
                  class="mt-3 rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!gamePackData || !projectId"
                  @click="handleDownloadGamePackPdf"
                >
                  Download PDF
                </button>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Community templates</div>
                <div class="mt-3 grid gap-2 text-xs text-slate-600">
                  <button
                    v-for="sample in samples"
                    :key="sample.id"
                    class="rounded-md border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
                    @click="handleSampleSelect(sample.id)"
                  >
                    {{ sample.name }}
                  </button>
                </div>
                <pre
                  v-if="selectedSample"
                  class="mt-3 max-h-40 overflow-auto rounded bg-slate-900/5 p-2 text-[11px] text-slate-600"
                >{{ selectedSample.content }}</pre>
              </div>
            </div>

          </section>

          <aside class="hidden w-80 flex-shrink-0 flex-col gap-4 md:flex">
            <RunHistory :events="runEventsData.slice(-5)" :run-id="latestRunId ?? undefined" />
            
            <ValidationPanel :validation="allValidation" />
            
            <NoveltyAudit :audit="noveltyAuditData" />
            
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Run status</div>
              <div class="mt-2 text-sm text-slate-600">{{ runStatus }}</div>
              <div class="mt-3 flex gap-2">
                <button class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold" @click="connectSse">
                  Connect
                </button>
                <button class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold" @click="disconnectSse">
                  Disconnect
                </button>
              </div>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Regenerate</div>
              <div class="mt-3 grid gap-2">
                <button
                  class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!projectId"
                  @click="handleRegenerate('setting')"
                >
                  Regenerate setting
                </button>
                <button
                  class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!projectId"
                  @click="handleRegenerate('cast')"
                >
                  Regenerate cast
                </button>
                <button
                  class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!projectId"
                  @click="handleRegenerate('clues')"
                >
                  Regenerate clues
                </button>
                <button
                  class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!projectId"
                  @click="handleRegenerate('outline')"
                >
                  Regenerate outline
                </button>
                <button
                  class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!projectId"
                  @click="handleRegenerate('prose')"
                >
                  Regenerate prose
                </button>
              </div>
            </div>
            <ExportPanel
              :project-id="projectId"
              :available="{
                setting: Boolean(settingArtifact),
                cast: Boolean(castArtifact),
                cml: isAdvanced && Boolean(cmlArtifact),
                clues: Boolean(cluesArtifact),
                outline: Boolean(outlineArtifact),
                prose: Boolean(proseArtifact),
                gamePack: Boolean(gamePackArtifact),
                fairPlay: Boolean(fairPlayReport),
              }"
            />
            <div v-if="isAdvanced" class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">CML preview</div>
              <pre class="mt-2 max-h-48 overflow-auto rounded bg-slate-900/5 p-2 text-xs text-slate-700">
{{ cmlArtifact ?? "No CML available" }}
              </pre>
            </div>
          </aside>
        </main>
      </div>
    </div>
  </div>
</template>

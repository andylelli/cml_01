<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
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
  Tab,
  TabStatus,
} from "./components/types";
import { useProjectStore } from "./stores/projectStore";
import {
  createProject,
  clearPersistenceStore,
  downloadGamePackPdf,
  downloadStoryPdf,
  fetchProject,
  fetchProjects,
  fetchProseVersions,
  fetchSampleContent,
  fetchSamples,
  logActivity,
  regenerateArtifact,
  runPipeline,
  saveSpec,
  type Project,
} from "./services/api";
import { subscribeToRunEvents } from "./services/sse";

type Mode = "user" | "advanced" | "expert";
type View =
  | "dashboard"
  | "builder"
  | "generate"
  | "cast"
  | "background"
  | "hardLogic"
  | "locations"
  | "temporal"
  | "clues"
  | "outline"
  | "samples"
  | "cml"
  | "prose"
  | "history"
  | "artifacts"
  | "logs";

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
  { id: "background", label: "Background" },
  { id: "hardLogic", label: "Hard Logic" },
  { id: "locations", label: "Locations" },
  { id: "temporal", label: "Era & Culture" },
  { id: "clues", label: "Clues" },
  { id: "outline", label: "Outline" },
  { id: "prose", label: "Prose" },
]);

// Define advanced sub-tabs
const advancedTabs = computed<Tab[]>(() => [
  { id: "cml", label: "CML" },
  { id: "artifacts", label: "Artifacts" },
  { id: "logs", label: "LLM Logs" },
  { id: "samples", label: "Samples" },
  { id: "history", label: "History" },
]);

const projectStore = useProjectStore();
const {
  artifactsStatus,
  cmlArtifact,
  cluesArtifact,
  outlineArtifact,
  proseArtifact,
  characterProfilesArtifact,
  locationProfilesArtifact,
  temporalContextArtifact,
  backgroundContextArtifact,
  hardLogicDevicesArtifact,
  gamePackArtifact,
  settingArtifact,
  castArtifact,
  settingData,
  castData,
  cluesData,
  fairPlayReport,
  outlineData,
  synopsisData,
  proseData,
  characterProfilesData,
  backgroundContextData,
  hardLogicDevicesData,
  locationProfilesData,
  temporalContextData,
  noveltyAuditData,
  gamePackData,
  runEventsData,
  latestRunId,
  allValidation,
  llmLogs,
} = storeToRefs(projectStore);

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
const lastFailedAction = ref<null | { type: "pipeline" | "regenerate" | "spec"; scope?: "setting" | "cast" | "clues" | "outline" | "prose" | "character_profiles" }>(null);

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

const handleErrorAction = async (item: ErrorItem) => {
  if (item.severity === "info") {
    dismissError(item.id);
    return;
  }

  if (!lastFailedAction.value) {
    dismissError(item.id);
    return;
  }

  const action = lastFailedAction.value;
  dismissError(item.id);

  if (action.type === "pipeline") {
    await handleRunPipeline();
    return;
  }

  if (action.type === "spec") {
    await handleSaveSpec();
    return;
  }

  if (action.type === "regenerate" && action.scope) {
    await handleRegenerate(action.scope);
  }
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

const handleReviewTabChange = (tabId: string) => {
  activeReviewTab.value = tabId;
  setView(tabId as View);
};

const handleAdvancedTabChange = (tabId: string) => {
  activeAdvancedTab.value = tabId;
  setView(tabId as View);
};

const runStatus = ref("Ready to generate");
const isCreatingProject = ref(false);
const projectName = ref("Golden Age Prototype");
const projectId = ref<string | null>(null);
const projectIdInput = ref("");
const latestSpecId = ref<string | null>(null);
const spec = ref({
  decade: "1930s",
  locationPreset: "CountryHouse",
  tone: "Cozy",
  theme: "",
  castSize: 6,
  castNames: [] as string[],
  primaryAxis: "temporal",
  targetLength: "medium" as "short" | "medium" | "long",
});

// Artifact + validation state lives in Pinia store

// UI state
const showRedHerrings = ref(true);
const playModeEnabled = ref(false);
const currentChapter = ref(1);
const samples = ref<Array<{ id: string; name: string; filename: string }>>([]);
const selectedSample = ref<{ id: string; name: string; content: string } | null>(null);
const projectsList = ref<Project[]>([]);
const selectedProjectId = ref("");
const missingProjectNotified = ref(false);
const lastProjectStatus = ref<string | null>(null);
const pendingRunId = ref<string | null>(null);
const showAdvancedValidation = ref(false);
const updateInProgress = ref<string | null>(null);
const selectedProseLength = ref<string | null>(null);
const availableProseVersions = ref<string[]>([]);
let unsubscribe: (() => void) | null = null;
let runEventsInterval: ReturnType<typeof setInterval> | null = null;

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

const themeSuggestions = [
  "A charity gala with hidden rivalries",
  "A missing heirloom tied to a wartime secret",
  "A seaside storm and a vanishing alibi",
  "A theatrical troupe with tangled debts",
  "A country house with a sealed-off wing",
  "A transatlantic liner with a false identity",
  "A village fête hiding a decades-old feud",
  "An aristocratic engagement with a sabotaged will",
  "A museum exhibition and a forged provenance",
  "A blackout revealing a staged scene",
  "Locked-room via geometric sightline contradiction",
  "Train timetable paradox with probability misdirection",
  "Botanical dose-timing trap in a country manor",
  "Seaside hotel acoustic mislocalization under fog",
  "Inheritance puzzle driven by social-status testimony bias",
  "Country house pure-geometry mechanism, increase difficulty",
  "Near-impossible manor crime with precision timing, make it brutal",
];

const handleSuggestTheme = () => {
  const next = themeSuggestions[Math.floor(Math.random() * themeSuggestions.length)];
  if (next) {
    spec.value.theme = next;
  }
};

const viewLabel = computed(() => {
  switch (currentView.value) {
    case "dashboard":
      return "Dashboard";
    case "builder":
      return "Builder";
    case "cast":
      return "Cast";
    case "background":
      return "Background";
    case "hardLogic":
      return "Hard Logic";
    case "clues":
      return "Clue board";
    case "outline":
      return "Outline";
    case "samples":
      return "Samples";
    case "cml":
      return "CML Viewer";
    case "artifacts":
      return "Artifacts";
    case "logs":
      return "LLM Logs";
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
const outlineReady = computed(() => Boolean(outlineArtifact.value));
const fairPlayReady = computed(() => Boolean(fairPlayReport.value));
const gamePackReady = computed(() => Boolean(gamePackData.value));
const settingReady = computed(() => Boolean(settingData.value));
const castReady = computed(() => Boolean(castData.value?.suspects?.length));
const cluesReady = computed(() => Boolean(cluesData.value?.items?.length));
const proseReady = computed(() => Boolean(proseData.value?.chapters?.length));
const isRunning = computed(() => lastProjectStatus.value === "running");
const isStartingRun = ref(false);
const isDownloadingStoryPdf = ref(false);
const isDownloadingGamePackPdf = ref(false);
const lastUpdatedAt = ref<number | null>(null);

const lastUpdatedLabel = computed(() => {
  if (!lastUpdatedAt.value) return "Not updated yet";
  const diffMs = Date.now() - lastUpdatedAt.value;
  if (diffMs < 60_000) return "Updated just now";
  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 60) return `Updated ${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  return `Updated ${diffHours} hr ago`;
});

const progressPercentFromEvent = (event: { step: string; message: string }) => {
  const step = event.step.toLowerCase();
  const message = event.message.toLowerCase();

  switch (step) {
    case "pipeline_started":
    case "run_started":
      return 2;
    case "setting_done":
      return 12;
    case "setting":
      return message.includes("refined") ? 12 : 0;
    case "cast_done":
      return 25;
    case "cast":
      return message.includes("designed") ? 25 : 12;
    case "hard_logic_devices_done":
      return 38;
    case "hard_logic_devices":
      return message.includes("generated") ? 38 : 25;
    case "cml_done":
      return 50;
    case "cml":
      if (message.includes("regenerating")) return 54;
      if (message.includes("validated") || message.includes("generated")) return 50;
      return 25;
    case "novelty_audit_done":
    case "novelty":
      return message.includes("skipped") || message.includes("check") ? 58 : 52;
    case "clues_done":
      return 62;
    case "clues":
      if (message.includes("regenerating")) return 60;
      return message.includes("distributed") ? 62 : 50;
    case "fair_play_report_done":
      return 75;
    case "fairplay":
      return message.includes("audit") ? 75 : 62;
    case "outline_done":
      return 87;
    case "narrative":
      return message.includes("scenes") || message.includes("structured") ? 87 : 75;
    case "character_profiles_done":
      return 91;
    case "profiles":
      return message.includes("generated") ? 91 : 88;
    case "prose_done":
      return 94;
    case "prose":
      return message.includes("generated") ? 94 : 91;
    case "pipeline_complete":
    case "run_finished":
    case "complete":
      return 100;
    default:
      return null;
  }
};

const runProgress = computed(() => {
  let percent = 0;
  let label = "Starting generation...";

  for (const event of runEventsData.value) {
    const eventPercent = progressPercentFromEvent(event);
    if (typeof eventPercent === "number" && eventPercent >= percent) {
      percent = eventPercent;
      label = event.message || label;
    }
  }

  return { percent, label };
});

const runProgressPercent = computed(() => runProgress.value.percent);
const runProgressLabel = computed(() => {
  if (isRunning.value || isStartingRun.value) {
    return runProgress.value.label || "Starting generation...";
  }
  return runStatus.value;
});

const fixSuggestions = computed(() => {
  const suggestions: string[] = [];
  const validationEntries = Object.entries(allValidation.value ?? {});
  const seen = new Set<string>();

  const labelMap: Record<string, string> = {
    setting: "setting details",
    cast: "cast setup",
    cml: "mystery logic",
    clues: "clues",
    outline: "outline",
  };

  const addSuggestion = (text: string) => {
    if (!seen.has(text)) {
      seen.add(text);
      suggestions.push(text);
    }
  };

  for (const [key, value] of validationEntries) {
    if (!value) continue;
    const issues = [...(value.errors ?? []), ...(value.warnings ?? [])];
    if (!issues.length) continue;

    const label = labelMap[key] ?? key;
    const allText = issues.join(" ").toLowerCase();

    if (allText.includes("required") || allText.includes("missing")) {
      addSuggestion(`We’re missing details in ${label}. Add the required information and try again.`);
    }

    if (allText.includes("anachron") || allText.includes("implausible")) {
      addSuggestion("Adjust the setting to remove anachronisms or implausible details.");
    }

    if (allText.includes("discriminating test")) {
      addSuggestion("Ensure the discriminating test appears late and clearly resolves the mystery.");
    }

    if (allText.includes("inference path")) {
      addSuggestion("Tighten the inference path so each step has observation, correction, and effect.");
    }

    if (allText.includes("false assumption")) {
      addSuggestion("Clarify the mistaken belief and how the clues dismantle it.");
    }

    if (allText.includes("clue") && (allText.includes("late") || allText.includes("reveal"))) {
      addSuggestion("Move key clues earlier so the solution is fair.");
    }

    if (allText.includes("red herring")) {
      addSuggestion("Ensure red herrings support the false assumption without hiding key evidence.");
    }

    if (key === "cast") {
      addSuggestion("Review roles and relationships, then update the cast if needed.");
    } else if (key === "setting") {
      addSuggestion("Adjust the setting details or update the setting section.");
    } else if (key === "cml") {
      addSuggestion("Update the mystery logic to resolve inconsistencies.");
    } else if (key === "clues") {
      addSuggestion("Update clues to improve fairness and placement.");
    } else if (key === "outline") {
      addSuggestion("Update the outline to align pacing and reveals.");
    }
  }

  if (!suggestions.length) {
    suggestions.push("Everything looks good so far.");
  }
  return suggestions;
});

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
    return;
  }

  availableProseVersions.value = [];
  selectedProseLength.value = spec.value.targetLength;
});

watch(
  spec,
  () => {
    persistState();
  },
  { deep: true },
);

watch(
  () => spec.value.targetLength,
  (length) => {
    if (length) {
      selectedProseLength.value = length;
    }
  },
  { immediate: true },
);

const connectSse = () => {
  if (!projectId.value) {
    runStatus.value = "Create a project to begin";
    return;
  }
  if (unsubscribe) {
    unsubscribe();
  }
  unsubscribe = subscribeToRunEvents(
    projectId.value,
    async (payload) => {
      const previous = lastProjectStatus.value;
      lastProjectStatus.value = payload.status;

      if (payload.status === "running") {
        runStatus.value = "Building your mystery...";
        startRunEventsPolling();
        return;
      }

      if (previous === "running" && payload.status === "idle") {
        isStartingRun.value = false;
        stopRunEventsPolling();
        await loadRunEventsForProject();

        const latestEvent = runEventsData.value[runEventsData.value.length - 1];
        const failed = latestEvent?.step === "pipeline_error" || latestEvent?.step === "run_failed";

        if (failed) {
          runStatus.value = "Generation stopped before completion. Check run history and retry.";
          addError("warning", "pipeline", "Generation stopped before completion", "Open History/Logs for details, then retry.");
          logActivity({ projectId: projectId.value, scope: "ui", message: "run_failed" });
          return;
        }

        runStatus.value = "All set. Explore your results.";
        pollArtifacts();
        addError("info", "pipeline", "Your mystery is ready.");
        logActivity({ projectId: projectId.value, scope: "ui", message: "run_completed" });
        return;
      }

      if (payload.status === "idle" && !isStartingRun.value && runStatus.value === "Building your mystery...") {
        runStatus.value = "Ready to generate";
      }
    },
    () => {
      runStatus.value = "Reconnecting...";
    },
  );
};

const disconnectSse = () => {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  stopRunEventsPolling();
};

const maybeRefreshLlmLogs = async () => {
  if (!projectId.value) return;
  const shouldRefresh = (activeMainTab.value === "advanced" && activeAdvancedTab.value === "logs") || isRunning.value;
  if (!shouldRefresh) return;
  try {
    await projectStore.loadLlmLogs(projectId.value, 200);
  } catch {
    // handled via error banner if needed
  }
};

const loadRunEventsForProject = async () => {
  if (!projectId.value) return;
  await projectStore.loadRunEvents(projectId.value);
  if (runEventsData.value.length) {
    const hasMatchedPendingRun = !pendingRunId.value || latestRunId.value === pendingRunId.value;
    if (hasMatchedPendingRun) {
      isStartingRun.value = false;
      pendingRunId.value = null;
      const latestEvent = runEventsData.value[runEventsData.value.length - 1];
      if (latestEvent?.step === "pipeline_error") {
        runStatus.value = "Generation failed. Review run history and try again.";
      }
    }
  }
  await maybeRefreshLlmLogs();
};

const startRunEventsPolling = () => {
  if (runEventsInterval) return;
  runEventsInterval = setInterval(() => {
    loadRunEventsForProject();
  }, 3000);
};

const stopRunEventsPolling = () => {
  if (!runEventsInterval) return;
  clearInterval(runEventsInterval);
  runEventsInterval = null;
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
      else if (activeReviewTab.value === "background") setView("background");
      else if (activeReviewTab.value === "hardLogic") setView("hardLogic");
      else if (activeReviewTab.value === "locations") setView("locations");
      else if (activeReviewTab.value === "temporal") setView("temporal");
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

watch([activeMainTab, activeAdvancedTab, projectId], async ([mainTab, advancedTab, currentProject]) => {
  if (mainTab === "advanced" && advancedTab === "logs") {
    try {
      await projectStore.loadLlmLogs(currentProject, 200);
    } catch {
      // handled via error banner if needed
    }
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
    case "background":
    case "hardLogic":
    case "locations":
    case "temporal":
    case "clues":
    case "outline":
    case "prose":
      activeMainTab.value = "review";
      activeReviewTab.value = newView;
      break;
    case "cml":
    case "samples":
    case "history":
    case "artifacts":
    case "logs":
      activeMainTab.value = "advanced";
      activeAdvancedTab.value = newView;
      break;
  }
});

const handleCreateProject = async () => {
  clearErrors("project");
  try {
    isCreatingProject.value = true;
    const project = await createProject(projectName.value.trim() || "Untitled project");
    projectId.value = project.id;
    projectIdInput.value = project.id;
    selectedProjectId.value = project.id;
    missingProjectNotified.value = false;
    projectsList.value = [project, ...projectsList.value.filter((entry) => entry.id !== project.id)];
    runStatus.value = "Ready to generate";
    
    // Clear any prior artifacts so the new project starts pending
    projectStore.clearAll();
    
    connectSse();
    addError("info", "project", "Project created. Choose your settings, then select Generate.");
    persistState();
    logActivity({ projectId: project.id, scope: "ui", message: "project_created" });
    await loadProjects();
    // Don't auto-run pipeline - user should configure spec first and manually click Generate
  } catch (error) {
    addError("error", "project", "Failed to create project", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "project_create_failed" });
  } finally {
    isCreatingProject.value = false;
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
      runStatus.value = "Ready to generate";
      missingProjectNotified.value = true;
      showAdvancedValidation.value = false;
      persistState();
      addError(
        "warning",
        "project",
        "Saved project not found",
        "That saved project is no longer available. Create a new project or select another."
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
    runStatus.value = "Ready to generate";
    connectSse();
    persistState();
    await pollArtifacts();
    addError("info", "project", "Project loaded.");
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
    lastFailedAction.value = null;
  } catch (error) {
    addError("error", "spec", "Failed to save spec", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "spec_save_failed" });
    lastFailedAction.value = { type: "spec" };
  }
};

const handleClearStore = async () => {
  if (!confirm("This will delete all saved projects and results. Continue?")) {
    return;
  }
  clearErrors("project");
  clearErrors("artifacts");
  try {
    await clearPersistenceStore();
    projectStore.clearAll();
    projectId.value = null;
    latestSpecId.value = null;
    projectIdInput.value = "";
    selectedProjectId.value = "";
    projectsList.value = [];
    runStatus.value = "Ready to generate";
    missingProjectNotified.value = false;
    showAdvancedValidation.value = false;
    persistState();
    addError("info", "project", "All saved work was cleared.");
    logActivity({ projectId: null, scope: "ui", message: "clear_store" });
  } catch (error) {
    addError("error", "project", "Failed to clear persistence", error instanceof Error ? error.message : String(error));
  }
};

const loadArtifacts = async () => {
  if (!projectId.value) return;
  clearErrors("artifacts");
  const { failures, hasNotFound, hasNetworkError, notFoundCount } = await projectStore.loadArtifacts(projectId.value, {
    includeCml: isAdvanced.value,
  });

  // Load prose versions after artifacts are loaded
  await loadProseVersions();

  if (failures.length === 0) {
    addError("info", "artifacts", "Everything is up to date");
    lastUpdatedAt.value = Date.now();
    return;
  }

  if (hasNetworkError) {
    addError("error", "artifacts", "We couldn't connect", "We’ll keep trying in the background.");
    return;
  }

  if (hasNotFound && notFoundCount === failures.length) {
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
        "That saved project is no longer available. Create a new project or select another."
      );
    }
    return;
  }

  if (failures.length < 5) {
    addError("warning", "artifacts", "Some sections are still loading", "We’ll keep checking and update automatically.");
    return;
  }

  addError("error", "artifacts", "Some items are still unavailable", "We’ll retry automatically.");
};

const pollArtifacts = async (attempts = 20, delayMs = 2000) => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    await loadArtifacts();
    const hasArtifacts =
      Boolean(settingData.value) ||
      Boolean(castData.value?.suspects?.length) ||
      Boolean(hardLogicDevicesData.value?.devices?.length) ||
      Boolean(cmlArtifact.value) ||
      Boolean(cluesData.value?.items?.length) ||
      Boolean(outlineArtifact.value) ||
      Boolean(proseData.value?.chapters?.length) ||
      Boolean(characterProfilesData.value?.profiles?.length);

    if (hasArtifacts) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  addError("warning", "artifacts", "We’re still preparing your results", "We’ll keep checking and update soon.");
};

const handleRunPipeline = async () => {
  if (!projectId.value) {
    addError("warning", "pipeline", "Create a project first");
    runStatus.value = "Create a project to begin";
    return;
  }
  clearErrors("pipeline");
  try {
    isStartingRun.value = true;
    runStatus.value = "Saving your settings...";
    const saved = await saveSpec(projectId.value, spec.value);
    latestSpecId.value = saved.id;
    persistState();
    logActivity({ projectId: projectId.value, scope: "ui", message: "spec_saved", payload: { specId: saved.id } });
    runStatus.value = "Starting mystery generation pipeline...";
    const started = await runPipeline(projectId.value);
    pendingRunId.value = started.runId ?? null;
    addError("info", "pipeline", "Generation started");
    logActivity({ projectId: projectId.value, scope: "ui", message: "run_started" });
    startRunEventsPolling();
    lastFailedAction.value = null;
  } catch (error) {
    isStartingRun.value = false;
    pendingRunId.value = null;
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("503")) {
      runStatus.value = "Generation unavailable (missing Azure OpenAI credentials)";
      addError("error", "pipeline", "We couldn’t start generation", "Azure OpenAI credentials are required to generate a mystery.");
    } else {
      runStatus.value = "Generation failed to start";
      addError("error", "pipeline", "We couldn’t start generation", message);
    }
    logActivity({ projectId: projectId.value, scope: "ui", message: "run_failed" });
    lastFailedAction.value = { type: "pipeline" };
  }
};

const handleRegenerate = async (scope: "setting" | "cast" | "clues" | "outline" | "prose" | "character_profiles") => {
  if (!projectId.value) {
    addError("warning", "regenerate", "Create a project first");
    return;
  }
  clearErrors("regenerate");
  try {
    updateInProgress.value = scope;
    await regenerateArtifact(projectId.value, scope);
    await loadArtifacts();
    lastUpdatedAt.value = Date.now();
    addError("info", "regenerate", "Section updated");
    logActivity({ projectId: projectId.value, scope: "ui", message: "regenerate", payload: { scope } });
    lastFailedAction.value = null;
  } catch (error) {
    addError("error", "regenerate", "We couldn’t update that section", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "regenerate_failed", payload: { scope } });
    lastFailedAction.value = { type: "regenerate", scope };
  } finally {
    if (updateInProgress.value === scope) {
      updateInProgress.value = null;
    }
  }
};

const handleDownloadGamePackPdf = async () => {
  if (!projectId.value) {
    addError("warning", "export", "Create a project first");
    return;
  }
  try {
    isDownloadingGamePackPdf.value = true;
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
    addError("error", "export", "We couldn’t download the game pack", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "download_game_pack_failed" });
  } finally {
    isDownloadingGamePackPdf.value = false;
  }
};

const handleDownloadStoryPdf = async () => {
  if (!projectId.value) {
    addError("warning", "export", "Create a project first");
    return;
  }
  try {
    isDownloadingStoryPdf.value = true;
    const blob = await downloadStoryPdf(projectId.value, selectedProseLength.value || undefined);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const lengthSuffix = selectedProseLength.value ? `_${selectedProseLength.value}` : "";
    a.download = `story_${projectId.value}${lengthSuffix}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
    addError("info", "export", "Story PDF downloaded");
    logActivity({ projectId: projectId.value, scope: "ui", message: "download_story_pdf" });
  } catch (error) {
    addError("error", "export", "We couldn’t download the story", error instanceof Error ? error.message : String(error));
    logActivity({ projectId: projectId.value, scope: "ui", message: "download_story_pdf_failed" });
  } finally {
    isDownloadingStoryPdf.value = false;
  }
};

const handleDownloadAllProseVersions = async () => {
  if (!projectId.value) {
    addError("warning", "export", "Create a project first");
    return;
  }
  if (availableProseVersions.value.length === 0) {
    addError("warning", "export", "No prose versions available");
    return;
  }
  try {
    for (const length of availableProseVersions.value) {
      const blob = await downloadStoryPdf(projectId.value, length);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `story_${projectId.value}_${length}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    addError("info", "export", `Downloaded ${availableProseVersions.value.length} story versions`);
    logActivity({ projectId: projectId.value, scope: "ui", message: "download_all_prose_versions" });
  } catch (error) {
    addError("error", "export", "Failed to download all versions", error instanceof Error ? error.message : String(error));
  }
};

const loadProseVersions = async () => {
  if (!projectId.value) return;
  try {
    const versions = await fetchProseVersions(projectId.value);
    availableProseVersions.value = Object.keys(versions).filter(k => k !== 'legacy');
    if (availableProseVersions.value.length > 0 && !selectedProseLength.value) {
      selectedProseLength.value = availableProseVersions.value.includes('medium') 
        ? 'medium' 
        : availableProseVersions.value[0];
    }
  } catch {
    availableProseVersions.value = [];
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
    <div class="flex min-h-screen">
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
            :class="currentView === 'background' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('background')"
          >
            Background
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'hardLogic' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('hardLogic')"
          >
            Hard Logic
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'locations' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('locations')"
          >
            Locations
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-slate-100"
            :class="currentView === 'temporal' ? 'bg-slate-100 text-slate-900' : 'text-slate-700'"
            @click="setView('temporal')"
          >
            Era & Culture
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
      <ErrorNotification
        :errors="errors"
        :show-details="isAdvanced"
        @dismiss="dismissError"
        @clear="clearErrors"
        @action="handleErrorAction"
      />

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
          v-model:activeTab="activeMainTab"
          :tab-statuses="tabStatuses"
        />

        <!-- Sub-tab Navigation for Review -->
        <TabBar
          v-if="activeMainTab === 'review'"
          :tabs="reviewTabs"
          :active-tab="activeReviewTab"
          @update:activeTab="handleReviewTabChange"
          class="bg-slate-50"
        />

        <!-- Sub-tab Navigation for Advanced -->
        <TabBar
          v-if="activeMainTab === 'advanced' && isAdvanced"
          :tabs="advancedTabs"
          :active-tab="activeAdvancedTab"
          @update:activeTab="handleAdvancedTabChange"
          class="bg-slate-50"
        />

        <main class="flex min-h-0 flex-1 gap-6 overflow-auto bg-slate-50 px-6 py-6">
          <section class="flex min-w-0 flex-1 flex-col gap-6">
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
                    class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isCreatingProject"
                    @click="handleCreateProject"
                  >
                    <span class="inline-flex items-center gap-2">
                      <font-awesome-icon v-if="isCreatingProject" icon="spinner" spin />
                      {{ isCreatingProject ? "Creating..." : "Create project" }}
                    </span>
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
              <div class="mt-4 flex items-center justify-between rounded-md border border-rose-200 bg-rose-50 px-4 py-3">
                <div class="text-xs text-rose-700">
                  Clears the JSON persistence store and resets the UI state.
                </div>
                <button
                  class="rounded-md border border-rose-300 bg-white px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  @click="handleClearStore"
                >
                  Clear persistence
                </button>
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
                  <div class="md:col-span-2">
                    <label class="text-xs font-semibold text-slate-500">Theme (optional)</label>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <input
                        v-model="spec.theme"
                        class="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm"
                        placeholder="A charity gala with hidden rivalries"
                      />
                      <button
                        class="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        type="button"
                        @click="handleSuggestTheme"
                      >
                        Suggest theme
                      </button>
                    </div>
                    <div class="mt-1 text-[11px] text-slate-400">
                      Optional. Adds a thematic jolt to steer the mystery.
                    </div>
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
                  <div>
                    <label class="text-xs font-semibold text-slate-500">Story length</label>
                    <select v-model="spec.targetLength" class="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm">
                      <option value="short">Short (15-25K words)</option>
                      <option value="medium">Medium (40-60K words)</option>
                      <option value="long">Long (70-100K words)</option>
                    </select>
                    <div class="mt-1 text-[11px] text-slate-400">
                      Story length affects scene count and narrative pacing.
                    </div>
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
                <div class="text-sm font-semibold text-slate-700">Generate</div>
                <div class="mt-4 text-sm text-slate-600">
                  Generate your mystery in one click. We handle the rest.
                </div>

                <div class="mt-4 flex items-center gap-2 text-sm text-slate-600">
                  <font-awesome-icon v-if="isRunning || isStartingRun" icon="spinner" spin class="text-slate-500" />
                  <font-awesome-icon v-else icon="circle-check" class="text-emerald-600" />
                  <span>{{ isRunning || isStartingRun ? runProgressLabel : "Ready to generate." }}</span>
                </div>
                <div v-if="isRunning || isStartingRun" class="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    class="h-full rounded-full bg-slate-600 transition-all duration-500"
                    :style="{ width: `${runProgressPercent}%` }"
                  ></div>
                </div>
                <div v-if="isRunning || isStartingRun" class="mt-2 text-xs text-slate-500">
                  {{ Math.round(runProgressPercent) }}% complete
                </div>

                <div class="mt-3 text-xs text-slate-500">
                  Cast: {{ castCount }} • Clues: {{ cluesCount }} • Outline: {{ outlineReady ? "ready" : "pending" }} • Fair-play:
                  {{ fairPlayReady ? "ready" : "pending" }} • Game pack: {{ gamePackReady ? "ready" : "pending" }}
                </div>

                <div class="mt-4 flex flex-wrap gap-3">
                  <button
                    class="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!projectId || isRunning || isStartingRun"
                    @click="handleRunPipeline"
                  >
                    <span class="inline-flex items-center gap-2">
                      <font-awesome-icon v-if="isRunning || isStartingRun" icon="spinner" spin />
                      Generate
                    </span>
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
                  <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Update sections</div>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('setting')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'setting'" icon="spinner" spin />
                        Update setting
                      </span>
                    </button>
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('cast')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'cast'" icon="spinner" spin />
                        Update cast
                      </span>
                    </button>
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('character_profiles')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'character_profiles'" icon="spinner" spin />
                        Update profiles
                      </span>
                    </button>
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('clues')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'clues'" icon="spinner" spin />
                        Update clues
                      </span>
                    </button>
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('outline')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'outline'" icon="spinner" spin />
                        Update outline
                      </span>
                    </button>
                    <button
                      class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('prose')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'prose'" icon="spinner" spin />
                        Update story
                      </span>
                    </button>
                  </div>
                  <div v-if="updateInProgress" class="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                    <div class="h-full w-1/2 animate-pulse rounded-full bg-slate-600"></div>
                  </div>
                  <div class="mt-2 text-xs text-slate-500">
                    Update a single section without rerunning everything.
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
                <span v-if="activeReviewTab === 'cast'">Review character profiles with public and private details.</span>
                <span v-else-if="activeReviewTab === 'background'">Review setting, place, and period context for the mystery backdrop.</span>
                <span v-else-if="activeReviewTab === 'hardLogic'">Inspect generated hard-logic devices that ground the mystery mechanism.</span>
                <span v-else-if="activeReviewTab === 'locations'">Explore detailed location profiles with sensory details and atmosphere.</span>
                <span v-else-if="activeReviewTab === 'temporal'">View the specific date, era, fashion, culture, and historical context.</span>
                <span v-else-if="activeReviewTab === 'clues'">Browse all clues with red herring filtering and play mode to reveal by chapter.</span>
                <span v-else-if="activeReviewTab === 'outline'">View the story structure broken down by chapters and events.</span>
                <span v-else-if="activeReviewTab === 'prose'">Read the full narrative story text.</span>
              </div>
            </div>

            <div v-if="currentView === 'cast'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-slate-700">Character Profiles</div>
                  <div class="text-xs text-slate-500">{{ castData?.suspects?.length || characterProfilesData?.profiles?.length || 0 }} total cast</div>
                </div>
                <div class="mt-1 text-xs text-slate-500">
                  {{ characterProfilesData?.note ?? "Character profiles are derived from the cast." }}
                </div>
                <div v-if="characterProfilesData?.profiles?.length" class="mt-4 space-y-3">
                  <details
                    v-for="profile in characterProfilesData.profiles"
                    :key="profile.name"
                    class="rounded-md border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <summary class="cursor-pointer text-sm font-semibold text-slate-700">
                      {{ profile.name }}
                    </summary>
                    <div class="mt-2 space-y-3 text-sm text-slate-600">
                      <p v-if="profile.summary" class="italic">{{ profile.summary }}</p>
                      <div v-if="profile.publicPersona" class="text-xs text-slate-500">
                        <span class="font-semibold">Public:</span> {{ profile.publicPersona }}
                      </div>
                      <div v-if="profile.humourStyle && profile.humourStyle !== 'none'" class="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span class="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
                          {{ profile.humourStyle.replace(/_/g, ' ') }}
                        </span>
                        <span v-if="typeof profile.humourLevel === 'number'" class="text-slate-400">
                          {{ profile.humourLevel >= 0.7 ? 'Frequently witty' : profile.humourLevel >= 0.4 ? 'Occasionally witty' : 'Rarely witty' }}
                        </span>
                        <span class="inline-flex items-center gap-0.5" :title="`Humour level: ${profile.humourLevel}`">
                          <span v-for="n in 5" :key="n" class="inline-block h-1.5 w-3 rounded-sm" :class="n <= Math.round((profile.humourLevel || 0) * 5) ? 'bg-amber-400' : 'bg-slate-200'"></span>
                        </span>
                      </div>
                      <div v-else-if="profile.humourStyle === 'none'" class="mt-1 text-xs text-slate-400 italic">
                        Plays it straight — no humour
                      </div>
                      <div v-if="profile.speechMannerisms" class="mt-1 text-xs text-slate-500">
                        <span class="font-semibold">Voice:</span> {{ profile.speechMannerisms }}
                      </div>
                      <div v-if="isAdvanced" class="space-y-1 text-xs text-slate-500">
                        <div v-if="profile.privateSecret"><span class="font-semibold">Private:</span> {{ profile.privateSecret }}</div>
                        <div v-if="profile.motiveSeed"><span class="font-semibold">Motive:</span> {{ profile.motiveSeed }}</div>
                        <div v-if="profile.alibiWindow"><span class="font-semibold">Alibi:</span> {{ profile.alibiWindow }}</div>
                        <div v-if="profile.accessPlausibility"><span class="font-semibold">Access:</span> {{ profile.accessPlausibility }}</div>
                        <div v-if="profile.stakes"><span class="font-semibold">Stakes:</span> {{ profile.stakes }}</div>
                      </div>
                      <div
                        v-else-if="profile.privateSecret || profile.motiveSeed || profile.alibiWindow || profile.accessPlausibility || profile.stakes"
                        class="text-xs text-slate-400"
                      >
                        Private details hidden. Enable Advanced mode to view.
                      </div>
                      <p v-for="(para, idx) in profile.paragraphs" :key="`${profile.name}-para-${idx}`">{{ para }}</p>
                    </div>
                  </details>
                </div>
                <div v-else class="mt-4 text-sm text-slate-500">Profiles will appear after generation.</div>
              </div>
            </div>

            <div v-if="currentView === 'locations'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-slate-700">Location Profiles</div>
                <div class="text-xs text-slate-500">
                  {{ locationProfilesData ? `${locationProfilesData.keyLocations?.length || 0} key locations` : 'Not generated' }}
                </div>
              </div>

              <div v-if="locationProfilesData" class="mt-4 space-y-6">
                <!-- Primary Location -->
                <div v-if="locationProfilesData.primary" class="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <div class="flex items-center justify-between">
                    <div class="text-sm font-semibold text-slate-700">{{ locationProfilesData.primary.name }}</div>
                    <span class="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Primary</span>
                  </div>
                  <div class="mt-1 text-xs text-slate-500">
                    {{ locationProfilesData.primary.type }}
                    <span v-if="locationProfilesData.primary.place || locationProfilesData.primary.country" class="text-slate-400"> • </span>
                    <span v-if="locationProfilesData.primary.place">{{ locationProfilesData.primary.place }}</span>
                    <span v-if="locationProfilesData.primary.place && locationProfilesData.primary.country">, </span>
                    <span v-if="locationProfilesData.primary.country">{{ locationProfilesData.primary.country }}</span>
                  </div>
                  <p class="mt-2 text-sm italic text-slate-600">{{ locationProfilesData.primary.summary }}</p>
                  <div class="mt-3 space-y-2 text-sm text-slate-600">
                    <p v-for="(para, idx) in locationProfilesData.primary.paragraphs" :key="`primary-${idx}`">{{ para }}</p>
                  </div>
                </div>

                <!-- Atmosphere -->
                <div v-if="locationProfilesData.atmosphere" class="rounded-md border border-slate-200 bg-amber-50 p-4">
                  <div class="text-sm font-semibold text-slate-700">Atmosphere</div>
                  <div class="mt-2 grid gap-2 text-xs">
                    <div><span class="font-semibold text-slate-600">Mood:</span> {{ locationProfilesData.atmosphere.mood }}</div>
                    <div><span class="font-semibold text-slate-600">Weather:</span> {{ locationProfilesData.atmosphere.weather }}</div>
                    <div v-if="locationProfilesData.atmosphere.eraMarkers?.length">
                      <span class="font-semibold text-slate-600">Era Markers:</span>
                      <span class="ml-1">{{ locationProfilesData.atmosphere.eraMarkers.join(', ') }}</span>
                    </div>
                    <div v-if="locationProfilesData.atmosphere.sensoryPalette?.length">
                      <span class="font-semibold text-slate-600">Sensory Palette:</span>
                      <span class="ml-1">{{ locationProfilesData.atmosphere.sensoryPalette.join(', ') }}</span>
                    </div>
                  </div>
                </div>

                <!-- Key Locations -->
                <div v-if="locationProfilesData.keyLocations?.length" class="space-y-3">
                  <div class="text-sm font-semibold text-slate-700">Key Locations</div>
                  <details
                    v-for="(location, idx) in locationProfilesData.keyLocations"
                    :key="`location-${idx}`"
                    class="rounded-md border border-slate-200 bg-white p-3"
                  >
                    <summary class="cursor-pointer text-sm font-semibold text-slate-700">
                      {{ location.name }} <span class="text-xs font-normal text-slate-500">({{ location.type }})</span>
                    </summary>
                    <div class="mt-2 space-y-3">
                      <p class="text-sm italic text-slate-600">{{ location.description }}</p>
                      <div class="space-y-2 text-sm text-slate-600">
                        <p v-for="(para, paraIdx) in location.paragraphs" :key="`loc-${idx}-para-${paraIdx}`">{{ para }}</p>
                      </div>
                      <div v-if="location.sensoryDetails" class="rounded bg-slate-50 p-2 text-xs">
                        <div class="font-semibold text-slate-700">Sensory Details:</div>
                        <div v-if="location.sensoryDetails.sights?.length" class="mt-1">
                          <span class="font-semibold text-slate-600">Sights:</span> {{ location.sensoryDetails.sights.join(', ') }}
                        </div>
                        <div v-if="location.sensoryDetails.sounds?.length" class="mt-1">
                          <span class="font-semibold text-slate-600">Sounds:</span> {{ location.sensoryDetails.sounds.join(', ') }}
                        </div>
                        <div v-if="location.sensoryDetails.smells?.length" class="mt-1">
                          <span class="font-semibold text-slate-600">Smells:</span> {{ location.sensoryDetails.smells.join(', ') }}
                        </div>
                        <div v-if="location.sensoryDetails.tactile?.length" class="mt-1">
                          <span class="font-semibold text-slate-600">Tactile:</span> {{ location.sensoryDetails.tactile.join(', ') }}
                        </div>
                      </div>
                      <div v-if="location.accessibility" class="rounded bg-slate-50 p-2 text-xs">
                        <div class="font-semibold text-slate-700">Access:</div>
                        <div class="mt-1">
                          <span class="font-semibold text-slate-600">Public:</span> {{ location.accessibility.publicAccess ? 'Yes' : 'No' }}
                        </div>
                        <div v-if="location.accessibility.whoCanEnter?.length" class="mt-1">
                          <span class="font-semibold text-slate-600">Who can enter:</span> {{ location.accessibility.whoCanEnter.join(', ') }}
                        </div>
                        <div v-if="location.accessibility.restrictions?.length" class="mt-1">
                          <span class="font-semibold text-slate-600">Restrictions:</span> {{ location.accessibility.restrictions.join(', ') }}
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-slate-500">Location profiles will appear after generation.</div>
            </div>

            <div v-if="currentView === 'background'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-slate-700">Story Background</div>
                <div class="text-xs text-slate-500">Background context</div>
              </div>

              <div v-if="backgroundContextData || settingData || locationProfilesData || temporalContextData" class="mt-4 space-y-4">
                <div v-if="backgroundContextData?.backdropSummary" class="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                  {{ backgroundContextData.backdropSummary }}
                </div>
                <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div class="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Setting</div>
                    <div class="mt-1 text-sm text-slate-700">{{ backgroundContextData?.setting?.location ?? settingData?.locationPreset ?? "Not generated" }}</div>
                    <div class="mt-1 text-xs text-slate-500">{{ backgroundContextData?.setting?.institution ?? "Institution pending" }}</div>
                  </div>
                  <div class="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Atmosphere</div>
                    <div class="mt-1 text-sm text-slate-700">{{ backgroundContextData?.setting?.weather ?? settingData?.weather ?? locationProfilesData?.atmosphere?.weather ?? "Not generated" }}</div>
                    <div class="mt-1 text-xs text-slate-500">{{ locationProfilesData?.atmosphere?.mood ?? "Mood pending" }}</div>
                  </div>
                  <div class="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Period</div>
                    <div class="mt-1 text-sm text-slate-700">
                      {{ backgroundContextData?.era?.decade ?? (temporalContextData ? `${temporalContextData.specificDate.month} ${temporalContextData.specificDate.year}` : "Not generated") }}
                    </div>
                    <div class="mt-1 text-xs text-slate-500">{{ backgroundContextData?.era?.socialStructure ?? temporalContextData?.specificDate?.era ?? "Era pending" }}</div>
                  </div>
                </div>

                <div v-if="backgroundContextData?.castAnchors?.length" class="rounded-md border border-slate-200 bg-white p-4">
                  <div class="text-sm font-semibold text-slate-700">Cast anchors</div>
                  <div class="mt-2 flex flex-wrap gap-2 text-xs">
                    <span
                      v-for="name in backgroundContextData.castAnchors"
                      :key="name"
                      class="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-slate-600"
                    >
                      {{ name }}
                    </span>
                  </div>
                </div>

                <div v-if="locationProfilesData?.primary" class="rounded-md border border-slate-200 bg-white p-4">
                  <div class="text-sm font-semibold text-slate-700">Primary location</div>
                  <div class="mt-1 text-xs text-slate-500">
                    {{ locationProfilesData.primary.name }}
                    <span v-if="locationProfilesData.primary.place"> • {{ locationProfilesData.primary.place }}</span>
                    <span v-if="locationProfilesData.primary.country">, {{ locationProfilesData.primary.country }}</span>
                  </div>
                  <p class="mt-2 text-sm text-slate-600">{{ locationProfilesData.primary.summary }}</p>
                </div>

                <div v-if="temporalContextData?.paragraphs?.length" class="rounded-md border border-slate-200 bg-white p-4">
                  <div class="text-sm font-semibold text-slate-700">Backdrop notes</div>
                  <p class="mt-2 text-sm text-slate-600">{{ temporalContextData.paragraphs[0] }}</p>
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-slate-500">Background context will appear after generation.</div>
            </div>

            <div v-if="currentView === 'hardLogic'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-slate-700">Hard-Logic Devices</div>
                <div class="text-xs text-slate-500">{{ hardLogicDevicesData?.devices?.length || 0 }} devices</div>
              </div>

              <div v-if="hardLogicDevicesData" class="mt-4 space-y-4">
                <div v-if="hardLogicDevicesData.overview" class="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                  {{ hardLogicDevicesData.overview }}
                </div>
                <details
                  v-for="(device, idx) in hardLogicDevicesData.devices"
                  :key="`${device.title}-${idx}`"
                  class="rounded-md border border-slate-200 bg-white p-3"
                >
                  <summary class="cursor-pointer text-sm font-semibold text-slate-700">
                    {{ device.title }}
                    <span class="ml-2 text-xs font-normal text-slate-500">({{ device.principleType.replace('_', ' ') }})</span>
                  </summary>
                  <div class="mt-3 space-y-2 text-sm text-slate-600">
                    <div><span class="font-semibold text-slate-700">Core principle:</span> {{ device.corePrinciple }}</div>
                    <div><span class="font-semibold text-slate-700">Surface illusion:</span> {{ device.surfaceIllusion }}</div>
                    <div><span class="font-semibold text-slate-700">Underlying reality:</span> {{ device.underlyingReality }}</div>
                    <div><span class="font-semibold text-slate-700">Why it is not a trope:</span> {{ device.whyNotTrope }}</div>
                    <div><span class="font-semibold text-slate-700">Variation:</span> {{ device.variationEscalation }}</div>
                    <div v-if="device.mechanismFamilyHints?.length">
                      <span class="font-semibold text-slate-700">Mechanism hints:</span>
                      {{ device.mechanismFamilyHints.join(', ') }}
                    </div>
                    <div v-if="device.modeTags?.length">
                      <span class="font-semibold text-slate-700">Mode tags:</span>
                      {{ device.modeTags.join(', ') }}
                    </div>
                    <div v-if="device.fairPlayClues?.length">
                      <div class="font-semibold text-slate-700">Fair-play clues</div>
                      <ul class="ml-4 mt-1 list-disc text-xs text-slate-600">
                        <li v-for="(clue, clueIdx) in device.fairPlayClues" :key="`${device.title}-clue-${clueIdx}`">{{ clue }}</li>
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
              <div v-else class="mt-4 text-sm text-slate-500">Hard-logic devices will appear after generation.</div>
            </div>

            <div v-if="currentView === 'temporal'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-slate-700">Era & Cultural Context</div>
                <div v-if="temporalContextData" class="text-xs text-slate-500">
                  {{ temporalContextData.specificDate.month }} {{ temporalContextData.specificDate.year }}
                </div>
              </div>

              <div v-if="temporalContextData" class="mt-4 space-y-6">
                <!-- Specific Date -->
                <div class="rounded-md border border-slate-200 bg-blue-50 p-4">
                  <div class="text-sm font-semibold text-slate-700">Specific Date</div>
                  <div class="mt-2 text-sm text-slate-600">
                    <span class="font-semibold">{{ temporalContextData.specificDate.month }}</span>
                    <span v-if="temporalContextData.specificDate.day"> {{ temporalContextData.specificDate.day }},</span>
                    {{ temporalContextData.specificDate.year }}
                    <span class="text-xs text-slate-500">({{ temporalContextData.specificDate.era }})</span>
                  </div>
                </div>

                <!-- Narrative Paragraphs -->
                <div v-if="temporalContextData.paragraphs?.length" class="space-y-2 text-sm text-slate-600">
                  <p v-for="(para, idx) in temporalContextData.paragraphs" :key="`temp-para-${idx}`">{{ para }}</p>
                </div>

                <!-- Seasonal Context -->
                <div v-if="temporalContextData.seasonal" class="rounded-md border border-slate-200 bg-green-50 p-4">
                  <div class="text-sm font-semibold text-slate-700">Seasonal Context</div>
                  <div class="mt-2 space-y-2 text-xs">
                    <div><span class="font-semibold text-slate-600">Season:</span> {{ temporalContextData.seasonal.season }}</div>
                    <div><span class="font-semibold text-slate-600">Daylight:</span> {{ temporalContextData.seasonal.daylight }}</div>
                    <div v-if="temporalContextData.seasonal.weather?.length">
                      <span class="font-semibold text-slate-600">Weather:</span> {{ temporalContextData.seasonal.weather.join(', ') }}
                    </div>
                    <div v-if="temporalContextData.seasonal.holidays?.length">
                      <span class="font-semibold text-slate-600">Holidays:</span> {{ temporalContextData.seasonal.holidays.join(', ') }}
                    </div>
                    <div v-if="temporalContextData.seasonal.seasonalActivities?.length">
                      <span class="font-semibold text-slate-600">Activities:</span> {{ temporalContextData.seasonal.seasonalActivities.join(', ') }}
                    </div>
                  </div>
                </div>

                <!-- Fashion -->
                <details v-if="temporalContextData.fashion" class="rounded-md border border-slate-200 bg-purple-50 p-3">
                  <summary class="cursor-pointer text-sm font-semibold text-slate-700">Fashion & Attire</summary>
                  <div class="mt-3 space-y-3 text-xs">
                    <div>
                      <div class="font-semibold text-slate-600">Men's Formal:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.fashion.mensWear.formal?.join(', ') }}</div>
                    </div>
                    <div>
                      <div class="font-semibold text-slate-600">Men's Casual:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.fashion.mensWear.casual?.join(', ') }}</div>
                    </div>
                    <div>
                      <div class="font-semibold text-slate-600">Women's Formal:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.fashion.womensWear.formal?.join(', ') }}</div>
                    </div>
                    <div>
                      <div class="font-semibold text-slate-600">Women's Casual:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.fashion.womensWear.casual?.join(', ') }}</div>
                    </div>
                    <div v-if="temporalContextData.fashion.trendsOfTheMoment?.length">
                      <div class="font-semibold text-slate-600">Trends:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.fashion.trendsOfTheMoment.join(', ') }}</div>
                    </div>
                  </div>
                </details>

                <!-- Current Affairs -->
                <details v-if="temporalContextData.currentAffairs" class="rounded-md border border-slate-200 bg-red-50 p-3">
                  <summary class="cursor-pointer text-sm font-semibold text-slate-700">Current Affairs</summary>
                  <div class="mt-3 space-y-2 text-xs">
                    <div v-if="temporalContextData.currentAffairs.politicalClimate">
                      <div class="font-semibold text-slate-600">Political Climate:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.currentAffairs.politicalClimate }}</div>
                    </div>
                    <div v-if="temporalContextData.currentAffairs.economicConditions">
                      <div class="font-semibold text-slate-600">Economic Conditions:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.currentAffairs.economicConditions }}</div>
                    </div>
                    <div v-if="temporalContextData.currentAffairs.majorEvents?.length">
                      <div class="font-semibold text-slate-600">Major Events:</div>
                      <ul class="ml-4 mt-1 list-disc">
                        <li v-for="(event, idx) in temporalContextData.currentAffairs.majorEvents" :key="`event-${idx}`">{{ event }}</li>
                      </ul>
                    </div>
                  </div>
                </details>

                <!-- Cultural Context -->
                <details v-if="temporalContextData.cultural" class="rounded-md border border-slate-200 bg-yellow-50 p-3">
                  <summary class="cursor-pointer text-sm font-semibold text-slate-700">Cultural Context</summary>
                  <div class="mt-3 space-y-3 text-xs">
                    <div v-if="temporalContextData.cultural.entertainment">
                      <div class="font-semibold text-slate-600">Entertainment:</div>
                      <div class="ml-2 mt-1 space-y-1">
                        <div v-if="temporalContextData.cultural.entertainment.popularMusic?.length">
                          <span class="font-semibold">Music:</span> {{ temporalContextData.cultural.entertainment.popularMusic.join(', ') }}
                        </div>
                        <div v-if="temporalContextData.cultural.entertainment.films?.length">
                          <span class="font-semibold">Films:</span> {{ temporalContextData.cultural.entertainment.films.join(', ') }}
                        </div>
                        <div v-if="temporalContextData.cultural.entertainment.theater?.length">
                          <span class="font-semibold">Theater:</span> {{ temporalContextData.cultural.entertainment.theater.join(', ') }}
                        </div>
                      </div>
                    </div>
                    <div v-if="temporalContextData.cultural.technology">
                      <div class="font-semibold text-slate-600">Technology:</div>
                      <div class="ml-2 mt-1 space-y-1">
                        <div v-if="temporalContextData.cultural.technology.commonDevices?.length">
                          <span class="font-semibold">Common Devices:</span> {{ temporalContextData.cultural.technology.commonDevices.join(', ') }}
                        </div>
                        <div v-if="temporalContextData.cultural.technology.recentInventions?.length">
                          <span class="font-semibold">Recent Inventions:</span> {{ temporalContextData.cultural.technology.recentInventions.join(', ') }}
                        </div>
                      </div>
                    </div>
                    <div v-if="temporalContextData.cultural.dailyLife">
                      <div class="font-semibold text-slate-600">Daily Life:</div>
                      <div class="ml-2 mt-1 space-y-1">
                        <div v-if="temporalContextData.cultural.dailyLife.typicalPrices?.length">
                          <span class="font-semibold">Typical Prices:</span> {{ temporalContextData.cultural.dailyLife.typicalPrices.join(', ') }}
                        </div>
                        <div v-if="temporalContextData.cultural.dailyLife.socialRituals?.length">
                          <span class="font-semibold">Social Rituals:</span> {{ temporalContextData.cultural.dailyLife.socialRituals.join(', ') }}
                        </div>
                      </div>
                    </div>
                  </div>
                </details>

                <!-- Atmospheric Details -->
                <div v-if="temporalContextData.atmosphericDetails?.length" class="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <div class="text-sm font-semibold text-slate-700">Atmospheric Details</div>
                  <ul class="ml-4 mt-2 list-disc space-y-1 text-xs text-slate-600">
                    <li v-for="(detail, idx) in temporalContextData.atmosphericDetails" :key="`atm-${idx}`">{{ detail }}</li>
                  </ul>
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-slate-500">Temporal context will appear after generation.</div>
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
              <div v-else class="mt-4 text-sm text-slate-500">No clues yet. Generate to create them.</div>
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
              <div v-else class="mt-4 text-sm text-slate-500">No outline yet. Generate to create it.</div>
            </div>

            <div v-if="currentView === 'prose'">
              <div class="mb-4 flex items-center justify-between gap-3">
                <div v-if="availableProseVersions.length > 1" class="flex items-center gap-2">
                  <label class="text-xs font-semibold text-slate-500">PDF version:</label>
                  <select v-model="selectedProseLength" class="rounded-md border border-slate-200 px-3 py-1 text-xs">
                    <option v-for="length in availableProseVersions" :key="length" :value="length">
                      {{ length === 'short' ? 'Short (15-25K)' : length === 'medium' ? 'Medium (40-60K)' : 'Long (70-100K)' }}
                    </option>
                  </select>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    v-if="availableProseVersions.length > 1"
                    class="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!proseData || !projectId"
                    @click="handleDownloadAllProseVersions"
                  >
                    Export all versions
                  </button>
                  <button
                    class="rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!proseData || !projectId || isDownloadingStoryPdf"
                    @click="handleDownloadStoryPdf"
                  >
                    <span class="inline-flex items-center gap-2">
                      <font-awesome-icon v-if="isDownloadingStoryPdf" icon="spinner" spin />
                      Export story PDF
                    </span>
                  </button>
                </div>
              </div>
              <ProseReader v-if="proseData" :prose="proseData" />
              <div v-else class="rounded-lg border border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
                No story text yet. Generate to create it.
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
                <span v-else-if="activeAdvancedTab === 'artifacts'">Inspect the raw JSON artifacts saved from the pipeline.</span>
                <span v-else-if="activeAdvancedTab === 'logs'">Review LLM operational logs (model, tokens, cost, latency).</span>
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
              <div v-else class="mt-4 text-sm text-slate-500">CML will appear after generation.</div>
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

            <div v-if="currentView === 'artifacts'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Raw Artifacts</div>
              <div class="mt-2 text-xs text-slate-500">Full JSON payloads as stored in the persistence layer.</div>
              <div class="mt-4 space-y-4 text-xs">
                <div>
                  <div class="font-semibold text-slate-600">Setting</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ settingArtifact ?? "Not available" }}</pre>
                </div>
                <div>
                  <div class="font-semibold text-slate-600">Cast</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ castArtifact ?? "Not available" }}</pre>
                </div>
                <div>
                  <div class="font-semibold text-slate-600">Character Profiles</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ characterProfilesArtifact ?? "Not available" }}</pre>
                </div>
                <div>
                  <div class="font-semibold text-slate-600">Location Profiles</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ locationProfilesArtifact ?? "Not available" }}</pre>
                </div>
                <div>
                  <div class="font-semibold text-slate-600">Temporal Context</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ temporalContextArtifact ?? "Not available" }}</pre>
                </div>
                <div>
                  <div class="font-semibold text-slate-600">Background Context</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ backgroundContextArtifact ?? "Not available" }}</pre>
                </div>
                <div>
                  <div class="font-semibold text-slate-600">Hard-Logic Devices</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ hardLogicDevicesArtifact ?? "Not available" }}</pre>
                </div>
                <div>
                  <div class="font-semibold text-slate-600">Clues</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ cluesArtifact ?? "Not available" }}</pre>
                </div>
                <div>
                  <div class="font-semibold text-slate-600">Outline</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ outlineArtifact ?? "Not available" }}</pre>
                </div>
                <div>
                  <div class="font-semibold text-slate-600">Prose</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ proseArtifact ?? "Not available" }}</pre>
                </div>
                <div>
                  <div class="font-semibold text-slate-600">Game Pack</div>
                  <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-slate-900 p-3 text-slate-100">{{ gamePackArtifact ?? "Not available" }}</pre>
                </div>
              </div>
            </div>

            <div v-if="currentView === 'logs'" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">LLM Log Entries</div>
              <div class="mt-2 text-xs text-slate-500">Operational log entries (model, tokens, cost, latency). Raw prompts are not stored.</div>
              <div v-if="llmLogs.length" class="mt-4 space-y-2 text-xs">
                <div
                  v-for="(entry, idx) in llmLogs"
                  :key="`${entry.timestamp}-${idx}`"
                  class="rounded border border-slate-200 bg-slate-50 px-3 py-2"
                >
                  <div class="flex flex-wrap items-center justify-between gap-2 text-slate-600">
                    <span class="font-semibold text-slate-700">{{ entry.agent }}</span>
                    <span>{{ entry.operation }}</span>
                    <span>{{ entry.model }}</span>
                    <span v-if="entry.totalTokens">{{ entry.totalTokens }} tokens</span>
                    <span v-if="entry.estimatedCost">${{ entry.estimatedCost.toFixed(4) }}</span>
                  </div>
                  <div class="mt-1 text-[11px] text-slate-500">
                    {{ entry.timestamp }} • {{ entry.projectId }} • {{ entry.runId }}
                  </div>
                  <div v-if="entry.errorMessage" class="mt-1 text-[11px] text-rose-600">{{ entry.errorMessage }}</div>
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-slate-500">No activity yet. Run generation to see entries.</div>
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
              <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div class="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div class="text-sm font-semibold text-slate-700">Export your mystery</div>
                  <div class="mt-2 text-sm text-slate-500">
                    Download artifacts as JSON, or export reader-ready PDFs when available.
                  </div>

                  <div class="mt-5 grid gap-4 sm:grid-cols-2">
                    <div class="rounded-md border border-slate-200 bg-slate-50 p-4">
                      <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Game pack PDF</div>
                      <div class="mt-2 text-xs text-slate-500">
                        {{ gamePackReady ? 'Ready to download' : 'Generate content first to enable export' }}
                      </div>
                      <button
                        class="mt-3 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="!gamePackData || !projectId || isDownloadingGamePackPdf"
                        @click="handleDownloadGamePackPdf"
                      >
                        <span class="inline-flex items-center gap-2">
                          <font-awesome-icon v-if="isDownloadingGamePackPdf" icon="spinner" spin />
                          Download game pack PDF
                        </span>
                      </button>
                    </div>

                    <div class="rounded-md border border-slate-200 bg-slate-50 p-4">
                      <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Story PDF</div>
                      <div class="mt-2 text-xs text-slate-500">
                        {{ proseReady ? 'Ready to download' : 'Generate prose first to enable export' }}
                      </div>
                      <button
                        class="mt-3 rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="!proseReady || !projectId || isDownloadingStoryPdf"
                        @click="handleDownloadStoryPdf"
                      >
                        <span class="inline-flex items-center gap-2">
                          <font-awesome-icon v-if="isDownloadingStoryPdf" icon="spinner" spin />
                          Download story PDF
                        </span>
                      </button>
                    </div>
                  </div>
                </div>

                <ExportPanel
                  :project-id="projectId"
                  :available="{
                    setting: Boolean(settingArtifact),
                    cast: Boolean(castArtifact),
                    characterProfiles: Boolean(characterProfilesArtifact),
                    hardLogicDevices: Boolean(hardLogicDevicesArtifact),
                    cml: isAdvanced && Boolean(cmlArtifact),
                    clues: Boolean(cluesArtifact),
                    outline: Boolean(outlineArtifact),
                    prose: Boolean(proseArtifact),
                    gamePack: Boolean(gamePackArtifact),
                    fairPlay: Boolean(fairPlayReport),
                  }"
                />
              </div>
            </TabPanel>

            <!-- Dashboard details shown in Project tab only -->
            <div v-if="activeMainTab === 'project'" id="dashboard-details" class="grid gap-6 md:grid-cols-2">
              <div v-if="settingData" class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-slate-700">Setting overview</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="settingReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    <font-awesome-icon :icon="settingReady ? 'circle-check' : 'circle-info'" />
                    {{ settingReady ? "Ready" : "Pending" }}
                  </span>
                </div>
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
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-slate-700">Cast cards</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="castReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    <font-awesome-icon :icon="castReady ? 'circle-check' : 'circle-info'" />
                    {{ castReady ? "Ready" : "Pending" }}
                  </span>
                </div>
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
                  Cast not available yet. Select Generate to create your cast.
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-slate-700">Clue board</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="cluesReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    <font-awesome-icon :icon="cluesReady ? 'circle-check' : 'circle-info'" />
                    {{ cluesReady ? "Ready" : "Pending" }}
                  </span>
                </div>
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
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-slate-700">Outline</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="outlineReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    <font-awesome-icon :icon="outlineReady ? 'circle-check' : 'circle-info'" />
                    {{ outlineReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ outlineReady ? "Your story outline is ready." : "Outline will appear after generation." }}
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-slate-700">Story</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="proseReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    <font-awesome-icon :icon="proseReady ? 'circle-check' : 'circle-info'" />
                    {{ proseReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ proseReady ? "Your story is ready to read." : "Story text will appear after generation." }}
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-slate-700">What’s next?</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="cluesReady || outlineReady || proseReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    <font-awesome-icon :icon="cluesReady || outlineReady || proseReady ? 'circle-check' : 'circle-info'" />
                    {{ cluesReady || outlineReady || proseReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ cluesReady || outlineReady || proseReady ? "Pick a place to explore your mystery." : "Generate results to unlock these next steps." }}
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <button
                    class="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!cluesReady"
                    @click="setView('clues')"
                  >
                    Explore clues
                  </button>
                  <button
                    class="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!outlineReady"
                    @click="setView('outline')"
                  >
                    Read outline
                  </button>
                  <button
                    class="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!proseReady"
                    @click="setView('prose')"
                  >
                    Open story
                  </button>
                </div>
              </div>
              <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-slate-700">Fair-play report</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="fairPlayReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    <font-awesome-icon :icon="fairPlayReady ? 'circle-check' : 'circle-info'" />
                    {{ fairPlayReady ? "Ready" : "Pending" }}
                  </span>
                </div>
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
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-slate-700">Game pack</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="gamePackReady ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'"
                  >
                    <font-awesome-icon :icon="gamePackReady ? 'circle-check' : 'circle-info'" />
                    {{ gamePackReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-slate-600">
                  {{ gamePackData?.title ?? "Game pack will appear after generation." }}
                </div>
                <div class="mt-2 text-xs text-slate-500">
                  {{ gamePackData?.suspects?.length ?? 0 }} suspects · {{ gamePackData?.materials?.length ?? 0 }} materials
                </div>
                <button
                  class="mt-3 rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold"
                  :disabled="!gamePackData || !projectId || isDownloadingGamePackPdf"
                  @click="handleDownloadGamePackPdf"
                >
                  <span class="inline-flex items-center gap-2">
                    <font-awesome-icon v-if="isDownloadingGamePackPdf" icon="spinner" spin />
                    Download PDF
                  </span>
                </button>
              </div>
            </div>

          </section>

          <aside class="hidden w-80 flex-shrink-0 flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3 md:flex md:self-start md:sticky md:top-4 md:max-h-[calc(100vh-2rem)] md:overflow-y-auto">
            <div class="px-1 pt-1">
              <div class="text-xs font-semibold uppercase tracking-wide text-slate-500">Workspace panel</div>
              <div class="mt-1 text-[11px] text-slate-500">Status, validation, and diagnostics</div>
            </div>
            <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Status</div>
              <div class="mt-2 text-sm text-slate-600">{{ runProgressLabel }}</div>
              <div v-if="isRunning || isStartingRun" class="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  class="h-full rounded-full bg-slate-600 transition-all duration-500"
                  :style="{ width: `${runProgressPercent}%` }"
                ></div>
              </div>
              <div v-if="isRunning || isStartingRun" class="mt-2 text-xs text-slate-500">
                {{ Math.round(runProgressPercent) }}% complete
              </div>
              <div class="mt-3 text-xs text-slate-500">{{ lastUpdatedLabel }}</div>
            </div>

            <div v-if="!isAdvanced" class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div class="text-sm font-semibold text-slate-700">Helpful fixes</div>
              <ul class="mt-2 space-y-1 text-xs text-slate-600">
                <li v-for="(suggestion, index) in fixSuggestions" :key="index">{{ suggestion }}</li>
              </ul>
            </div>

            <div v-if="isAdvanced" class="space-y-4">
              <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-slate-700">Validation details</div>
                  <button
                    class="text-xs font-semibold text-slate-600 underline"
                    @click="showAdvancedValidation = !showAdvancedValidation"
                  >
                    {{ showAdvancedValidation ? "Hide" : "Show" }} details
                  </button>
                </div>
                <div v-if="showAdvancedValidation" class="mt-3">
                  <ValidationPanel :validation="allValidation" />
                </div>
              </div>
              <NoveltyAudit :audit="noveltyAuditData" />
              <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div class="text-sm font-semibold text-slate-700">Connection</div>
                <div class="mt-2 text-xs text-slate-500">Advanced diagnostics</div>
                <div class="mt-3 flex gap-2">
                  <button class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold" @click="connectSse">
                    Reconnect
                  </button>
                  <button class="rounded-md border border-slate-200 px-3 py-1 text-xs font-semibold" @click="disconnectSse">
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </main>
      </div>
    </div>
  </div>
</template>

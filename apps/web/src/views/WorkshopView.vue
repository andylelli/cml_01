<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import ExportPanel from "../components/ExportPanel.vue";
import ErrorNotification from "../components/ErrorNotification.vue";
import ValidationPanel from "../components/ValidationPanel.vue";
import ProseReader from "../components/ProseReader.vue";
import RunHistory from "../components/RunHistory.vue";
import NoveltyAudit from "../components/NoveltyAudit.vue";
import ScoreCard from "../components/ScoreCard.vue";
import PhaseBreakdownTable from "../components/PhaseBreakdownTable.vue";
import ScoreTrendChart from "../components/ScoreTrendChart.vue";
import TabBar from "../components/TabBar.vue";
import TabPanel from "../components/TabPanel.vue";
import ProgressIndicator from "../components/ProgressIndicator.vue";
import type { PipelineStep } from "../components/pipelineTypes";
import ArtifactStatusDashboard from "../components/ArtifactStatusDashboard.vue";
import ErrorLogPanel from "../components/ErrorLogPanel.vue";
import DebugPanel from "../components/DebugPanel.vue";
import ContentSkeleton from "../components/ContentSkeleton.vue";
import KeyboardShortcutHelp from "../components/KeyboardShortcutHelp.vue";
import VirtualList from "../components/VirtualList.vue";
import type {
  ErrorItem,
  ErrorSeverity,
  Tab,
  TabStatus,
  GenerationReport,
} from "../components/types";
import { useProjectStore } from "../stores/projectStore";
import {
  createProject,
  clearPersistenceStore,
  downloadGamePackPdf,
  downloadStoryPdf,
  fetchProject,
  fetchProjects,
  fetchLatestSpec,
  fetchProseVersions,
  fetchSampleContent,
  fetchSamples,
  fetchLatestRun,
  fetchScoringReport,
  fetchScoringHistory,
  logActivity,
  regenerateArtifact,
  runPipeline,
  saveSpec,
  type Project,
} from "../services/api";
import { subscribeToRunEvents } from "../services/sse";
import { useRunProgress } from "../composables/useRunProgress";
import { useShortcuts, type Shortcut } from "../composables/useShortcuts";
import { coerceSpec, defaultSpec, type MysterySpec } from "../spec/vocabulary";

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
  | "logs"
  | "quality";

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
  { id: "quality", label: "Quality" },
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
};

const handleAdvancedTabChange = (tabId: string) => {
  activeAdvancedTab.value = tabId;
};

// runStatus, lastProjectStatus, isRunning, isStartingRun and pendingRunId now come from
// useRunProgress — declared below, once the refs its dependencies close over exist.
const scoringReport = ref<GenerationReport | null>(null);
const scoringHistory = ref<GenerationReport[]>([]);
const isScoringReportLoading = ref(false);
const isCreatingProject = ref(false);
const projectName = ref("Golden Age Prototype");
const projectId = ref<string | null>(null);
const projectIdInput = ref("");
const latestSpecId = ref<string | null>(null);
/**
 * One source for the spec shape and its defaults (spec/vocabulary.ts), rather than a second literal
 * here that drifts from it. This console's copy had no `humourLevel` field at all, so the control
 * for it could not have been added without this.
 */
const spec = ref<MysterySpec>(defaultSpec());

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
const showAdvancedValidation = ref(false);
const updateInProgress = ref<string | null>(null);
const selectedProseLength = ref<string | null>(null);
const availableProseVersions = ref<string[]>([]);
// The SSE handle and the 3s/8s intervals moved into useRunProgress, which owns their cleanup.

/**
 * B12 — the console's OWN key, not the shell's.
 *
 * This file used to BE the application and owned `cml_ui_state`. Once the shell took that key with
 * a versioned schema (composables/useUiState.ts), both wrote to it: the console's unversioned
 * payload overwrote the shell's on every interaction, the shell's `hydrate()` then correctly
 * rejected it for having no version, and the effect on screen was that advanced mode silently
 * reverted to user on every reload. Found by running the app, not by reading it — two owners of one
 * key type-check perfectly.
 *
 * The two persist DIFFERENT things and are meant to: the shell keeps the spec and which view is
 * open; the console keeps which of its own thirteen panels was last used.
 */
const STORAGE_KEY = "cml_workshop_state";

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
    // B8, in this file too: a stored spec went straight to the API. `primaryAxis` is the one field
    // whose bad value throws at pipeline INIT, so a stale localStorage entry could abort a paid run.
    if (saved.spec) spec.value = coerceSpec(saved.spec);
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
/**
 * The run state machine (UI-002 item 19).
 *
 * Declared here rather than beside the other refs because its dependencies close over `projectId`,
 * `spec` and the tab refs above. Every dependency is an arrow evaluated at CALL time, so the
 * functions below — `loadRunEventsForProject`, `pollScoringReport` — may be declared after this
 * without a temporal-dead-zone problem: `useRunProgress` calls none of them during setup.
 */
const progress = useRunProgress({
  subscribe: subscribeToRunEvents,
  loadRunEvents: () => loadRunEventsForProject(),
  latestEventStep: () => runEventsData.value[runEventsData.value.length - 1]?.step,
  loadScoringReport: () => pollScoringReport(),
  loadScoringHistory: () => loadScoringHistory(),
  pollArtifacts: () => pollArtifacts(),
  // The 8s poll is pointless traffic unless the quality panel is actually on screen.
  shouldPollQuality: () => activeMainTab.value === "advanced" && activeAdvancedTab.value === "quality",
  notify: (severity, message, detail) => addError(severity, "pipeline", message, detail),
  logActivity: (message) => logActivity({ projectId: projectId.value, scope: "ui", message }),
});

const { runStatus, lastProjectStatus, isStartingRun, pendingRunId, isRunning } = progress;

const advancedTabStatuses = computed<Record<string, TabStatus>>(() => ({
  quality: isRunning.value || isStartingRun.value ? "in-progress" : "available",
}));

// Per-stage status for the Review sub-tabs so each agent's output visibly "lights up" as it is
// generated: complete once its artifact has arrived (polled every 3s during the run), in-progress
// while the run is active and it hasn't arrived yet, otherwise available.
const reviewTabStatuses = computed<Record<string, TabStatus>>(() => {
  const running = isRunning.value || isStartingRun.value;
  const statusFor = (present: boolean): TabStatus =>
    present ? "complete" : running ? "in-progress" : "available";
  return {
    cast: statusFor(!!castData.value),
    background: statusFor(!!backgroundContextData.value),
    hardLogic: statusFor(!!hardLogicDevicesData.value),
    locations: statusFor(!!locationProfilesData.value),
    temporal: statusFor(!!temporalContextData.value),
    clues: statusFor(!!cluesData.value),
    outline: statusFor(!!outlineData.value),
    prose: statusFor(!!proseData.value),
  };
});
/** The project id whose artifacts a caller has already taken responsibility for loading. */
const artifactLoadHandledFor = ref<string | null>(null);
const isDownloadingStoryPdf = ref(false);
const isDownloadingGamePackPdf = ref(false);
const isDownloadingAllVersions = ref(false);
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

    // ── Setting (agent1) ────────────────────────────────────────────────────
    case "setting_done":
      return 12;
    case "setting":
      return message.includes("refined") ? 12 : 3;

    // ── Cast (agent2) ───────────────────────────────────────────────────────
    case "cast_done":
      return 25;
    case "cast":
      return message.includes("designed") ? 25 : 13;

    // ── Background Context (agent2e) ─────────────────────────────────────────
    case "background_context_done":
      return 30;
    case "background-context":
      return message.includes("generated") ? 30 : 26;

    // ── Hard Logic Devices (agent3b) ─────────────────────────────────────────
    case "hard_logic_devices_done":
      return 35;
    case "hard_logic_devices":
      return message.includes("generated") ? 35 : 31;

    // ── CML (agent3 + optional agent4 revision) ───────────────────────────────
    case "cml_done":
      return 52;
    case "cml":
      if (message.includes("regenerating")) return 50;
      if (message.includes("validated") || message.includes("generated")) return 52;
      return 36;

    // ── Novelty Audit (agent3) ────────────────────────────────────────────────
    case "novelty_audit_done":
      return 58;
    case "novelty":
      if (message.includes("skipped")) return 58;
      return message.includes("check:") ? 58 : 53;

    // ── Clues (agent5) ────────────────────────────────────────────────────────
    case "clues_done":
      return 65;
    case "clues":
      if (message.includes("regenerating")) return 60;
      return message.includes("distributed") ? 65 : 59;

    // ── Fair-play (agent6) ────────────────────────────────────────────────────
    case "fair_play_report_done":
      return 75;
    case "fairplay":
      // "Fair play audit: pass/fail" contains "audit:" — that signals completion
      if (message.includes("audit:")) return 75;
      if (message.includes("blind")) return 72;
      return 66;

    // ── Character Profiles (agent2b) ──────────────────────────────────────────
    case "character_profiles_done":
      return 80;
    case "profiles":
      return message.includes("generated") ? 80 : 76;

    // ── Location Profiles (agent2c) ───────────────────────────────────────────
    case "location_profiles_done":
      return 83;
    case "location-profiles":
      return message.includes("generated") ? 83 : 81;

    // ── Temporal Context (agent2d) ────────────────────────────────────────────
    case "temporal_context_done":
      return 86;
    case "temporal-context":
      return message.includes("generated") ? 86 : 84;

    // ── World Builder (agent65) ───────────────────────────────────────────────
    case "world_builder_done":
      return 92;
    case "world-builder":
      return message.includes("complete") ? 92 : 87;

    // ── Narrative Outline (agent7) ────────────────────────────────────────────
    case "outline_done":
      return 95;
    case "narrative":
      if (message.includes("scenes") || message.includes("structured") || message.includes("complete")) return 95;
      return 93;

    // ── Prose (agent9) ────────────────────────────────────────────────────────
    case "prose_done":
      return 98;
    case "prose":
      return message.includes("generated") ? 98 : 96;

    // ── Validation (agent9 post-prose gate) ───────────────────────────────────
    case "validation":
      if (message.includes("passed") || message.includes("auto-fix") || message.includes("encoding")) return 99;
      return 97;

    // ── Complete ──────────────────────────────────────────────────────────────
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
    const countBefore = suggestions.length;

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

    // Only emit the generic per-key fallback when no specific suggestion was added (U-9 fix)
    if (suggestions.length === countBefore) {
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

/**
 * B2 — the skip is now recorded AGAINST AN ID, not as a bare one-shot boolean.
 *
 * The old flag was set to true by two callers just before they assigned `projectId`, so the watcher
 * would not double-load artifacts they were already loading. But a Vue watcher does not fire when
 * the value is assigned the SAME id it already holds — and "load the project I already have open"
 * is an ordinary thing to do from the project dropdown. The flag then stayed true and silently ate
 * the NEXT genuine project change, so switching projects showed the previous project's artifacts.
 *
 * Keying the skip to the id it was recorded for makes that unrepresentable: it can only suppress
 * the load it was meant for, and any transition clears it.
 */
watch(projectId, (nextId) => {
  if (nextId) {
    const handled = artifactLoadHandledFor.value === nextId;
    artifactLoadHandledFor.value = null;
    if (handled) return;
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

/**
 * The SSE subscription and the run state machine live in useRunProgress (UI-002 item 19). These
 * four keep their names so every call site in this 3,300-line file stays where it is — the
 * implementation moved, the interface did not.
 *
 * The state machine they now delegate to is pinned by 20 tests and 5 mutation checks. It used to be
 * seventy lines here, reachable only from a live pipeline, and therefore never once exercised.
 */
const connectSse = () => progress.connect(projectId.value);

const disconnectSse = () => progress.disconnect();

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
  // Refresh artifacts on the same polling cycle so review tabs populate as
  // each pipeline stage completes — no tab switch needed.
  void projectStore.loadArtifacts(projectId.value, { includeCml: isAdvanced.value });
  // Refresh quality report on the same cycle as run events so the Quality tab
  // stays reactive without requiring a tab switch. During the run this will
  // 404 silently; once the report is written, the next cycle picks it up.
  void loadScoringReport();
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

const startRunEventsPolling = () => progress.startEventsPolling();

const stopRunEventsPolling = () => progress.stopEventsPolling();

// Watchers for tab navigation sync
// (Scoring report is only meaningful at run completion — do not poll it during
// active runs. It is loaded reactively when: the run completes, a new runId
// appears, or the user switches to the quality tab.)

// Refresh report + history whenever a new run is identified.
// Clear any stale report immediately so the Quality tab doesn't show old data
// while the new run is in progress.
watch(latestRunId, async (newRunId) => {
  if (!newRunId || !projectId.value) return;
  scoringReport.value = null;
  projectStore.clearArtifactsOnly(); // clear stale review-tab artifacts for the new run
  await loadScoringReport();
  await loadScoringHistory();
});
// Update tab status based on project state
watch([projectId, isAdvanced], ([nextId, nextAdvanced], [, prevAdvanced]) => {
  if (nextId) {
    tabStatuses.value.project = "complete";
  }
  if (nextAdvanced) {
    tabStatuses.value.advanced = "available";
    if (!prevAdvanced && nextId) {
      // Advanced mode just turned on with a project loaded — fetch CML (U-2 fix)
      void loadArtifacts();
    }
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
      else if (activeAdvancedTab.value === "artifacts") setView("artifacts");
      else if (activeAdvancedTab.value === "logs") setView("logs");
      else if (activeAdvancedTab.value === "samples") setView("samples");
      else if (activeAdvancedTab.value === "history") setView("history");
      else if (activeAdvancedTab.value === "quality") setView("quality");
      break;
    // 'export' tab has no sub-view to sync; no setView call needed (U-1 fix)
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
    if (newTab === "quality") {
      void loadScoringReport();
      void loadScoringHistory();
    }
  }
}, { immediate: true });

// The 8s quality poll follows isRunning and is owned by useRunProgress, which also clears it on
// disposal. The watcher here only tells it that the flag changed.
watch(isRunning, () => progress.syncQualityPolling());

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
    case "quality":
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
    // Recorded AFTER the id is known, and against that id — see the watcher's note on B2.
    artifactLoadHandledFor.value = project.id;
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
    // Against the id actually fetched, not the one requested — they can differ if the API
    // canonicalises, and a skip recorded for the wrong id would suppress the wrong load.
    artifactLoadHandledFor.value = project.id;
    projectId.value = project.id;
    projectName.value = project.name;
    // Restore the spec settings (decade, tone, etc.) from the last saved spec
    try {
      const savedSpec = await fetchLatestSpec(nextId);
      if (savedSpec) {
        latestSpecId.value = savedSpec.id;
        if (savedSpec.spec && typeof savedSpec.spec === "object") {
          spec.value = { ...spec.value, ...(savedSpec.spec as typeof spec.value) };
        }
      }
    } catch {
      // spec restore is best-effort; don't block the rest of the load
    }
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
  if (!confirm("This will delete all saved projects, generated results, reports, logs, and prompt history. Continue?")) {
    return;
  }
  clearErrors("project");
  clearErrors("artifacts");
  try {
    const result = await clearPersistenceStore();
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
    const clearedCount = result.cleared?.length;
    const suffix = clearedCount ? ` (${clearedCount} stores cleared)` : "";
    addError("info", "project", `All saved work, reports, logs, and prompt history were cleared.${suffix}`);
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

const loadScoringReport = async () => {
  if (!projectId.value) return;
  isScoringReportLoading.value = true;
  try {
    // Guard 1: a new run was just started (pendingRunId set) but latestRunId
    // hasn't caught up yet. Requesting the old run's real report would succeed
    // and display stale data. Bail early so the Quality tab shows "in progress".
    if ((isRunning.value || isStartingRun.value) && pendingRunId.value && latestRunId.value !== pendingRunId.value) {
      scoringReport.value = null;
      return;
    }
    const runId = latestRunId.value ?? (await fetchLatestRun(projectId.value).catch(() => null))?.id ?? null;
    if (runId) {
      const report = await fetchScoringReport(projectId.value, runId) as (Record<string, unknown> & GenerationReport) | null;
      if (report) {
        // Guard 2: the server may return a stale fallback (from a prior run) when
        // no report exists for the requested run yet. During an active run, discard
        // stale reports so the Quality tab shows "in progress" instead of old data.
        if ((isRunning.value || isStartingRun.value) && report.stale === true) {
          scoringReport.value = null;
          return;
        }
        scoringReport.value = report as GenerationReport;
        return;
      }
    }
    // During an active run no report exists yet — clear stale data and wait.
    if (isRunning.value || isStartingRun.value) {
      scoringReport.value = null;
      return;
    }
    // Fallback: history endpoint reads directly from disk with no run-status gating
    const history = await fetchScoringHistory(projectId.value, 1);
    if (history.length > 0) scoringReport.value = history[0] as GenerationReport;
  } catch {
    // Do not clear existing data on failure — keep showing the last known report.
    if (!scoringReport.value) {
      scoringReport.value = null;
    }
  } finally {
    isScoringReportLoading.value = false;
  }
};

/**
 * Retry-polling version of loadScoringReport used after run completion.
 * The scoring report is written to disk asynchronously after the worker finishes;
 * the SSE "idle" event may arrive before the file exists. This retries with
 * increasing delays so the Quality tab updates automatically without requiring
 * the user to switch tabs.
 */
const pollScoringReport = async (attempts = 10, delayMs = 1500) => {
  if (!projectId.value || !latestRunId.value) return;
  isScoringReportLoading.value = true;
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (!projectId.value || !latestRunId.value) break;
    try {
      const report = await fetchScoringReport(projectId.value, latestRunId.value);
      if (report) {
        scoringReport.value = report as GenerationReport;
        isScoringReportLoading.value = false;
        return;
      }
    } catch {
      // report not written yet — keep retrying
    }
    if (attempt < attempts - 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, delayMs));
    }
  }
  // All attempts exhausted — fall back to history (direct disk read, no run-status gating)
  try {
    const history = await fetchScoringHistory(projectId.value, 1);
    if (history.length > 0) scoringReport.value = history[0] as GenerationReport;
  } catch { /* best-effort */ }
  isScoringReportLoading.value = false;
};

const loadScoringHistory = async () => {
  if (!projectId.value) return;
  try {
    const history = await fetchScoringHistory(projectId.value, 10);
    scoringHistory.value = history as GenerationReport[];
  } catch {
    scoringHistory.value = [];
  }
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
    projectStore.clearArtifactsOnly(); // clear stale artifacts immediately so Review tabs don't show old data
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
  if (isDownloadingAllVersions.value) return;  // concurrency guard (U-4 fix)
  if (!projectId.value) {
    addError("warning", "export", "Create a project first");
    return;
  }
  if (availableProseVersions.value.length === 0) {
    addError("warning", "export", "No prose versions available");
    return;
  }
  isDownloadingAllVersions.value = true;
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
  } finally {
    isDownloadingAllVersions.value = false;
  }
};

const loadProseVersions = async () => {
  if (!projectId.value) return;
  try {
    const versions = await fetchProseVersions(projectId.value);
    availableProseVersions.value = Object.keys(versions).filter(k => k !== 'legacy');
    if (availableProseVersions.value.length > 0) {
      // Always resolve to an actually-available version; prefer spec target,
      // then 'medium', then first available (U-5 fix)
      const preferred = spec.value.targetLength ?? '';
      selectedProseLength.value = availableProseVersions.value.includes(preferred)
        ? preferred
        : availableProseVersions.value.includes('medium')
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

// ── New UI state ────────────────────────────────────────────────────────────
const showShortcutHelp = ref(false);

// Maps runEventsData into a typed PipelineStep[] for ProgressIndicator
const pipelineSteps = computed((): PipelineStep[] => {
  // doneEvent: the part of the "*_done" event name (without "_done") emitted by server.ts
  // runningStage: the progress stage name emitted by the orchestrator's reportProgress()
  const steps: { id: string; label: string; doneEvent: string; runningStage: string }[] = [
    { id: "setting",          label: "Setting",       doneEvent: "setting",            runningStage: "setting" },
    { id: "cast",             label: "Cast",          doneEvent: "cast",               runningStage: "cast" },
    { id: "background",       label: "Background",    doneEvent: "background_context", runningStage: "background-context" },
    { id: "hard_logic",       label: "Hard Logic",    doneEvent: "hard_logic_devices", runningStage: "hard_logic_devices" },
    { id: "cml",              label: "CML",           doneEvent: "cml",                runningStage: "cml" },
    { id: "novelty_audit",    label: "Novelty Audit", doneEvent: "novelty_audit",      runningStage: "novelty" },
    { id: "clues",            label: "Clues",         doneEvent: "clues",              runningStage: "clues" },
    { id: "fairplay",         label: "Fair-play",     doneEvent: "fair_play_report",   runningStage: "fairplay" },
    { id: "profiles",         label: "Char. Profiles",doneEvent: "character_profiles", runningStage: "profiles" },
    { id: "location_profiles",label: "Locations",     doneEvent: "location_profiles",  runningStage: "location-profiles" },
    { id: "temporal_context", label: "Era & Culture", doneEvent: "temporal_context",   runningStage: "temporal-context" },
    { id: "world_builder",    label: "World Builder", doneEvent: "world_builder",      runningStage: "world-builder" },
    { id: "outline",          label: "Outline",       doneEvent: "outline",            runningStage: "narrative" },
    { id: "prose",            label: "Prose",         doneEvent: "prose",              runningStage: "prose" },
  ];

  const completedDoneEvents = new Set<string>();
  const failedIds = new Set<string>();
  let runningStage: string | null = null;

  for (const event of runEventsData.value) {
    const step = event.step.toLowerCase();
    if (step.endsWith("_done")) {
      completedDoneEvents.add(step.replace(/_done$/, ""));
    } else if (["pipeline_complete", "run_finished", "complete"].includes(step)) {
      steps.forEach((s) => completedDoneEvents.add(s.doneEvent));
    } else if (["pipeline_error", "run_failed"].includes(step)) {
      if (runningStage) {
        const failedStep = steps.find((s) => s.runningStage === runningStage);
        if (failedStep) failedIds.add(failedStep.id);
      }
    } else if (!step.includes("_done") && !["pipeline_started", "run_started", "pipeline_warnings"].includes(step)) {
      runningStage = step;
    }
  }

  return steps.map((s): PipelineStep => {
    let status: PipelineStep["status"] = "pending";
    if (completedDoneEvents.has(s.doneEvent)) status = "complete";
    else if (failedIds.has(s.id)) status = "failed";
    else if (runningStage === s.runningStage) status = "running";
    return { id: s.id, label: s.label, status };
  });
});

// Maps store artifact refs into ArtifactStatusDashboard entries
const artifactEntries = computed(() => [
  { id: "setting", label: "Setting", generatedAt: null, ready: Boolean(settingArtifact.value), dependsOn: [] },
  { id: "cast", label: "Cast", generatedAt: null, ready: Boolean(castArtifact.value), dependsOn: ["setting"] },
  { id: "hard_logic_devices", label: "Hard Logic", generatedAt: null, ready: Boolean(hardLogicDevicesArtifact.value), dependsOn: ["setting", "cast"] },
  { id: "cml", label: "CML", generatedAt: null, ready: Boolean(cmlArtifact.value), dependsOn: ["cast", "hard_logic_devices"] },
  { id: "clues", label: "Clues", generatedAt: null, ready: Boolean(cluesArtifact.value), dependsOn: ["cml"] },
  { id: "outline", label: "Outline", generatedAt: null, ready: Boolean(outlineArtifact.value), dependsOn: ["clues"] },
  { id: "character_profiles", label: "Profiles", generatedAt: null, ready: Boolean(characterProfilesArtifact.value), dependsOn: ["cast"] },
  { id: "location_profiles", label: "Locations", generatedAt: null, ready: Boolean(locationProfilesArtifact.value), dependsOn: ["setting"] },
  { id: "temporal_context", label: "Era & Culture", generatedAt: null, ready: Boolean(temporalContextArtifact.value), dependsOn: ["setting"] },
  { id: "background_context", label: "Background", generatedAt: null, ready: Boolean(backgroundContextArtifact.value), dependsOn: ["setting"] },
  { id: "prose", label: "Prose", generatedAt: null, ready: Boolean(proseArtifact.value), dependsOn: ["outline", "character_profiles"] },
]);

// Maps store llmLogs to DebugPanel's expected shape
const debugLogs = computed(() =>
  llmLogs.value.map((l, i) => ({
    id: `${l.runId ?? "run"}-${i}`,
    timestamp: l.timestamp,
    agent: l.agent,
    model: l.model,
    promptTokens: l.promptTokens,
    completionTokens: l.completionTokens,
    totalTokens: l.totalTokens,
    durationMs: l.latencyMs,
    cost: l.estimatedCost,
    status: l.errorMessage ? ("error" as const) : ("ok" as const),
    errorMessage: l.errorMessage,
  }))
);

const handleCancelRun = () => {
  addError("warning", "pipeline", "Cancel is not available mid-run.", "Wait for completion or refresh the page.");
};

const handleArtifactView = (id: string) => {
  const viewMap: Record<string, View> = {
    setting: "background",
    cast: "cast",
    hard_logic_devices: "hardLogic",
    cml: "cml",
    clues: "clues",
    outline: "outline",
    character_profiles: "cast",
    location_profiles: "locations",
    temporal_context: "temporal",
    background_context: "background",
    prose: "prose",
  };
  const view = viewMap[id];
  if (view) setView(view);
};

const handleArtifactRegenerate = (id: string) => {
  const scopeMap: Partial<Record<string, "setting" | "cast" | "clues" | "outline" | "prose" | "character_profiles">> = {
    setting: "setting",
    cast: "cast",
    clues: "clues",
    outline: "outline",
    character_profiles: "character_profiles",
    prose: "prose",
  };
  const scope = scopeMap[id];
  if (scope) {
    handleRegenerate(scope);
  } else {
    addError("warning", "regenerate", `Regeneration for '${id}' is not available individually.`);
  }
};

const handleValidationFieldFocus = (key: string) => {
  // Jump to the spec tab so fields are visible
  activeMainTab.value = "spec";
  // After tab transition, scroll to the relevant field group
  setTimeout(() => {
    const fieldId = `field-${key}`;
    const target = document.getElementById(fieldId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      target.classList.add("ring-2", "ring-line-strong", "ring-offset-1");
      setTimeout(() => target.classList.remove("ring-2", "ring-line-strong", "ring-offset-1"), 2500);
    }
  }, 150);
};

/**
 * Keyboard shortcuts (UI-002 item 21), declared rather than branched.
 *
 * Two defects went with the rewrite, both of which a hand-written if-chain made easy to miss:
 *
 * - **The tab ids were a second copy of `mainTabs`** — a literal six-element array. Rename or
 *   reorder a tab and Ctrl+3 quietly lands somewhere else. They are now READ FROM `mainTabs`.
 * - **A disabled tab was still reachable.** `advanced` carries `disabled: !isAdvanced`, and the old
 *   handler set `activeMainTab` to it regardless, so Ctrl+5 in user mode opened a tab the UI does
 *   not offer. Disabled tabs are now skipped.
 *
 * `Escape` is `whileTyping` because closing a dialog must work from inside a field; the bare letters
 * deliberately are not.
 */
const shortcuts = computed<Shortcut[]>(() => [
  {
    key: "?",
    description: "Show or hide this help",
    run: () => {
      showShortcutHelp.value = !showShortcutHelp.value;
    },
  },
  {
    key: "Escape",
    whileTyping: true,
    description: "Close the help",
    run: () => {
      showShortcutHelp.value = false;
    },
  },
  ...mainTabs.value.map((tab, index) => ({
    key: String(index + 1),
    ctrl: true,
    preventDefault: true,
    description: `Go to ${tab.label}`,
    run: () => {
      if (!tab.disabled) activeMainTab.value = tab.id;
    },
  })),
  { key: "j", description: "Next chapter", run: () => nextChapter() },
  { key: "k", description: "Previous chapter", run: () => prevChapter() },
]);

useShortcuts(shortcuts);

onMounted(async () => {
  hydrateState();
  connectSse();
  await loadProjects();
  loadSamples();
  void loadScoringReport();
});

onBeforeUnmount(() => {
  disconnectSse();
  /**
   * A_73 — both polling intervals were once left running on unmount.
   *
   * The 3s run-events poll and the 8s quality poll were cleared only by their own start/stop helpers
   * and by the `isRunning` watcher, so unmounting mid-run left both firing against a destroyed
   * component — the shape behind the A_30 defect where a poll overwrote freshly-loaded state.
   *
   * Both timers now belong to `useRunProgress`, which is the change that most easily UNDOES this
   * fix: a split like that is exactly how ownership of a timer gets lost. So the composable
   * registers its own `onScopeDispose` as well, and the guarantee is asserted by test
   * (`useRunProgress.test.ts`, "clears BOTH intervals and the subscription on scope disposal") and
   * by a mutation check that removes the quality clear and confirms two cases go red.
   */
  progress.dispose();
});
</script>

<template>
  <!-- No min-h-screen: AppShell already owns the full-height column, and two nested ones make the
       page scroll past its own footer. -->
  <div>
    <div class="flex min-h-[70vh]">
      <aside class="hidden w-60 flex-col border-r border-line bg-surface px-4 py-6 md:flex">
        <!-- The old product name lived here. The app has a wordmark of its own now (brand.ts), and
             this panel is one view inside it rather than the whole application. -->
        <!-- An h1, not a styled div: this view had no heading element anywhere, so it offered a
             screen reader no structure to navigate by at all. Item 29. -->
        <h1 class="t-section">Workshop</h1>
        <p class="t-subtitle mt-1 text-[0.75rem]">Every stage of the pipeline.</p>
        <nav class="mt-6 space-y-1 text-sm">
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'dashboard' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('dashboard')"
          >
            Dashboard
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'builder' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('builder')"
          >
            Builder
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'cast' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('cast')"
          >
            Cast
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'background' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('background')"
          >
            Background
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'hardLogic' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('hardLogic')"
          >
            Hard Logic
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'locations' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('locations')"
          >
            Locations
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'temporal' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('temporal')"
          >
            Era & Culture
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'clues' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('clues')"
          >
            Clues
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'outline' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('outline')"
          >
            Outline
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'prose' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('prose')"
          >
            Prose
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'samples' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('samples')"
          >
            Samples
          </button>
          <button
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'history' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
            @click="setView('history')"
          >
            History
          </button>
          <button
            v-if="isAdvanced"
            class="flex w-full items-center rounded-md px-3 py-2 text-left font-medium hover:bg-surface-sunken"
            :class="currentView === 'cml' ? 'border-l-2 border-accent bg-accent-wash font-semibold text-ink' : 'border-l-2 border-transparent text-ink-soft'"
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
        <header class="flex items-center justify-between border-b border-line bg-surface px-6 py-4">
          <div>
            <div class="text-sm text-ink-soft">Project</div>
            <div class="text-lg font-semibold">{{ projectName }}</div>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <label class="flex items-center gap-2 text-ink-soft">
              <input
                v-model="advancedChecked"
                data-testid="advanced-toggle"
                type="checkbox"
                class="h-4 w-4 rounded border border-line-strong"
              />
              Advanced
            </label>
            <label class="flex items-center gap-2 text-ink-soft">
              <input
                v-model="expertChecked"
                data-testid="expert-toggle"
                type="checkbox"
                class="h-4 w-4 rounded border border-line-strong"
              />
              Expert
            </label>
            <div class="ml-2 text-xs text-ink-soft">Mode: {{ mode }}</div>
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
          :tab-statuses="reviewTabStatuses"
          @update:activeTab="handleReviewTabChange"
          class="bg-ground"
        />

        <!-- Sub-tab Navigation for Advanced -->
        <TabBar
          v-if="activeMainTab === 'advanced' && isAdvanced"
          :tabs="advancedTabs"
          :active-tab="activeAdvancedTab"
          :tab-statuses="advancedTabStatuses"
          @update:activeTab="handleAdvancedTabChange"
          class="bg-ground"
        />

        <main class="flex min-h-0 flex-1 gap-6 overflow-auto bg-ground px-6 py-6">
          <section class="flex min-w-0 flex-1 flex-col gap-6">
            <!-- Project Tab -->
            <TabPanel id="project-tab" :active="activeMainTab === 'project'" :lazy="true">
              <div class="flex flex-col gap-6">

            <div class="rounded-lg border border-line-strong bg-surface-sunken p-4 shadow-sm">
              <div class="text-sm font-semibold text-frame">Welcome to your Mystery Generator</div>
              <div class="mt-2 text-sm text-frame">
                This is your project dashboard. Create a new project, configure your story settings in the Spec tab, then generate your mystery in the Generate tab. All generated content will appear here and in the Review tab.
              </div>
            </div>

            <div v-if="synopsisData" class="rounded-lg border border-line bg-surface p-6 shadow-sm">
              <div class="text-sm font-semibold text-ink">Synopsis</div>
              <div class="mt-2 text-sm text-ink-soft">
                <strong v-if="synopsisData.title" class="text-ink">{{ synopsisData.title }}</strong>
                <span :class="synopsisData.title ? 'ml-2' : ''">{{ synopsisSummary }}</span>
              </div>
              <div class="mt-3 flex flex-wrap gap-2 text-xs text-ink-soft">
                <button
                  class="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-soft"
                  @click="scrollToSection('dashboard-details')"
                >
                  View details below
                </button>
                <button
                  class="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-soft"
                  @click="setView('clues')"
                >
                  Open Clue board
                </button>
                <button
                  class="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-soft"
                  @click="setView('outline')"
                >
                  Open Outline
                </button>
                <button
                  v-if="isAdvanced"
                  class="rounded border border-line px-2 py-1 text-xs font-semibold text-ink-soft"
                  @click="setView('cml')"
                >
                  Open CML Viewer
                </button>
              </div>
            </div>

            <div v-if="currentView === 'dashboard' || currentView === 'builder'" class="rounded-lg border border-line bg-surface p-6 shadow-sm">
              <div class="text-sm font-semibold text-ink">Project setup</div>
              <div class="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <!-- `for`/`id`: the label was beside the field but not bound to it, so a screen
                       reader announced an unnamed text box. Item 29. -->
                  <label for="ws-project-name" class="text-xs font-semibold text-ink-soft">Project name</label>
                  <input
                    id="ws-project-name"
                    v-model="projectName"
                    class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"
                    placeholder="Golden Age Prototype"
                  />
                </div>
                <div class="flex items-end">
                  <button
                    class="rounded-md bg-frame px-4 py-2 text-sm font-semibold text-[--surface] hover:bg-frame disabled:cursor-not-allowed disabled:opacity-60"
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
                  <label for="ws-project-id" class="text-xs font-semibold text-ink-soft">Load project by ID</label>
                  <input
                    id="ws-project-id"
                    v-model="projectIdInput"
                    class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"
                    placeholder="proj_..."
                  />
                </div>
                <div class="flex items-end">
                  <button
                    class="rounded-md border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-ground"
                    @click="handleLoadProject"
                  >
                    Load project
                  </button>
                </div>
                <div>
                  <label for="ws-project-select" class="text-xs font-semibold text-ink-soft">Load existing project</label>
                  <select
                    id="ws-project-select"
                    v-model="selectedProjectId"
                    class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"
                  >
                    <option value="">Select a project</option>
                    <option v-for="project in projectsList" :key="project.id" :value="project.id">
                      {{ project.name }} ({{ project.id }})
                    </option>
                  </select>
                </div>
                <div class="flex items-end">
                  <button
                    class="rounded-md border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-ground"
                    :disabled="!selectedProjectId"
                    @click="projectIdInput = selectedProjectId; handleLoadProject()"
                  >
                    Load selected
                  </button>
                </div>
              </div>
              <div class="mt-4 flex items-center justify-between rounded-md border border-danger bg-danger-wash px-4 py-3">
                <div class="text-xs text-danger">
                  Clears saved projects, artifacts, run history, scoring reports, LLM logs, and prompt history.
                </div>
                <button
                  class="rounded-md border border-danger bg-surface px-3 py-2 text-xs font-semibold text-danger hover:bg-danger-wash"
                  @click="handleClearStore"
                >
                  Clear all persistence
                </button>
              </div>
              <div class="mt-3 text-xs text-ink-soft">
                Project ID: {{ projectId ?? "not created" }} • Spec: {{ latestSpecId ?? "not saved" }}
              </div>
            </div>

              </div>
            </TabPanel>

            <!-- Spec Tab -->
            <TabPanel id="spec-tab" :active="activeMainTab === 'spec'" :lazy="true">
              <div class="rounded-lg border border-line bg-surface p-6 shadow-sm">
                <div class="text-sm font-semibold text-ink">Story Specification</div>
                <div class="mt-4 text-sm text-ink-soft">
                  Configure your mystery story settings. These specifications will guide the AI generation.
                </div>
                <div class="mt-6 grid gap-4 md:grid-cols-2">
                  <div id="field-setting">
                    <label class="text-xs font-semibold text-ink-soft">Decade</label>
                    <select id="field-decade" v-model="spec.decade" class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm">
                      <option>1930s</option>
                      <option>1940s</option>
                      <option>1950s</option>
                    </select>
                  </div>
                  <div id="field-location">
                    <label class="text-xs font-semibold text-ink-soft">Location preset</label>
                    <select id="field-locationPreset" v-model="spec.locationPreset" class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm">
                      <option>CountryHouse</option>
                      <option>SeasideHotel</option>
                      <option>Village</option>
                      <option>Liner</option>
                      <option>Theatre</option>
                    </select>
                  </div>
                  <div id="field-tone">
                    <label class="text-xs font-semibold text-ink-soft">Tone</label>
                    <select v-model="spec.tone" class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm">
                      <option>Cozy</option>
                      <option>Classic</option>
                      <option>Dark</option>
                    </select>
                    <!-- B4: server.ts:675 also flips narrativeStyle to "atmospheric" when tone is
                         Dark. Surfacing the coupling, not changing it — that is a pipeline call. -->
                    <div class="mt-1 text-[11px] text-ink-faint">
                      <strong>Dark</strong> also sets the narrator to <em>atmospheric</em>.
                    </div>
                  </div>
                  <div id="field-humourLevel">
                    <label class="text-xs font-semibold text-ink-soft">Humour band</label>
                    <select v-model="spec.humourLevel" class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm">
                      <option value="none">None — no character is funny</option>
                      <option value="dry">Dry — at most two, understated</option>
                      <option value="classic">Classic — a beat each chapter (default)</option>
                      <option value="sharp">Sharp — three wits, one unkind</option>
                    </select>
                    <!-- B5: wired through Agent 2b and Agent 9 since A_92 and never sent by any UI.
                         Absent resolves to "classic" silently (humour-level.ts:87), so every run
                         started from this app has used that band whether or not it was wanted. -->
                    <div class="mt-1 text-[11px] text-ink-faint">
                      Sets which humour styles the cast may take and how often a wit beat is asked for.
                    </div>
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs font-semibold text-ink-soft">Theme (optional)</label>
                    <div class="mt-2 flex flex-wrap gap-2">
                      <input
                        v-model="spec.theme"
                        class="flex-1 rounded-md border border-line px-3 py-2 text-sm"
                        placeholder="A charity gala with hidden rivalries"
                      />
                      <button
                        class="rounded-md border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-ground"
                        type="button"
                        @click="handleSuggestTheme"
                      >
                        Suggest theme
                      </button>
                    </div>
                    <div class="mt-1 text-[11px] text-ink-faint">
                      Optional. Adds a thematic jolt to steer the mystery.
                    </div>
                  </div>
                  <div id="field-cast">
                    <label class="text-xs font-semibold text-ink-soft">Cast size</label>
                    <input
                      id="field-castSize"
                      v-model.number="spec.castSize"
                      type="number"
                      min="4"
                      max="12"
                      class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"
                    />
                    <div class="mt-1 text-[11px] text-ink-faint">
                      Suspects &amp; witnesses. The detective is always added as an extra character (+1).
                    </div>
                  </div>
                  <div id="field-detectiveType">
                    <label class="text-xs font-semibold text-ink-soft">Detective type</label>
                    <select v-model="spec.detectiveType" class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm">
                      <option value="police">Police Inspector / Detective</option>
                      <option value="private">Private Investigator</option>
                      <option value="amateur">Amateur / Layperson</option>
                    </select>
                    <div class="mt-1 text-[11px] text-ink-faint">
                      Amateur lets the AI invent anyone — a vicar, a schoolteacher, a nosy neighbour&hellip;
                    </div>
                  </div>
                  <div class="md:col-span-2">
                    <label class="text-xs font-semibold text-ink-soft">Cast names (comma-separated)</label>
                    <input
                      v-model="castNamesInput"
                      class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"
                      placeholder="Avery, Blair, Casey, Dana, Ellis, Finley"
                    />
                    <div class="mt-1 text-[11px] text-ink-faint">
                      Optional. If provided, the cast list will use these names.
                    </div>
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-ink-soft">Primary axis</label>
                    <select v-model="spec.primaryAxis" class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm">
                      <option>temporal</option>
                      <option>spatial</option>
                      <option>identity</option>
                      <option>behavioral</option>
                      <option>authority</option>
                    </select>
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-ink-soft">Story length</label>
                    <select v-model="spec.targetLength" class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm">
                      <option value="short">Short (15-25K words)</option>
                      <option value="medium">Medium (40-60K words)</option>
                      <option value="long">Long (70-100K words)</option>
                    </select>
                    <div class="mt-1 text-[11px] text-ink-faint">
                      Story length affects scene count and narrative pacing.
                    </div>
                  </div>
                  <div>
                    <label class="text-xs font-semibold text-ink-soft">Prose batch size</label>
                    <input
                      v-model.number="spec.proseBatchSize"
                      type="number"
                      min="1"
                      max="10"
                      class="mt-2 w-full rounded-md border border-line px-3 py-2 text-sm"
                    />
                    <div class="mt-1 text-[11px] text-ink-faint">
                      Chapters generated per LLM call (1–10). Higher = fewer API calls but coarser retries. Default: 1.
                    </div>
                  </div>
                </div>
                <div class="mt-4 text-xs text-ink-soft">
                  This is a minimal spec draft for Phase 1; additional fields will be added in later phases.
                </div>
              </div>
            </TabPanel>

            <!-- Generate Tab -->
            <TabPanel id="generate-tab" :active="activeMainTab === 'generate'" :lazy="true">
              <div class="rounded-lg border border-line bg-surface p-6 shadow-sm">
                <div class="text-sm font-semibold text-ink">Generate</div>
                <div class="mt-4 text-sm text-ink-soft">
                  Generate your mystery in one click. We handle the rest.
                </div>

                <!-- Rich progress indicator (replaces simple spinner+bar) -->
                <div class="mt-4">
                  <ProgressIndicator
                    :steps="pipelineSteps"
                    :is-running="isRunning || isStartingRun"
                    :progress-percent="runProgressPercent"
                    :progress-label="runProgressLabel"
                    @cancel="handleCancelRun"
                  />
                </div>

                <div class="mt-3 text-xs text-ink-soft">
                  Cast: {{ castCount }} • Clues: {{ cluesCount }} • Outline: {{ outlineReady ? "ready" : "pending" }} • Fair-play:
                  {{ fairPlayReady ? "ready" : "pending" }} • Game pack: {{ gamePackReady ? "ready" : "pending" }}
                </div>

                <div class="mt-4 flex flex-wrap gap-3">
                  <button
                    class="rounded-md bg-frame px-4 py-2 text-sm font-semibold text-[--surface] hover:bg-frame disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!projectId || isRunning || isStartingRun"
                    @click="handleRunPipeline"
                  >
                    <span class="inline-flex items-center gap-2">
                      <font-awesome-icon v-if="isRunning || isStartingRun" icon="spinner" spin />
                      Generate
                    </span>
                  </button>
                  <button
                    class="rounded-md border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink hover:bg-ground"
                    @click="handleSaveSpec"
                  >
                    Save draft
                  </button>
                </div>

                <!-- Regenerate Controls -->
                <div class="mt-6 rounded-lg border border-line bg-ground p-4">
                  <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Update sections</div>
                  <div class="mt-3 flex flex-wrap gap-2">
                    <button
                      class="rounded-md border border-line-strong bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ground disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('setting')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'setting'" icon="spinner" spin />
                        Update setting
                      </span>
                    </button>
                    <button
                      class="rounded-md border border-line-strong bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ground disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('cast')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'cast'" icon="spinner" spin />
                        Update cast
                      </span>
                    </button>
                    <button
                      class="rounded-md border border-line-strong bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ground disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('character_profiles')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'character_profiles'" icon="spinner" spin />
                        Update profiles
                      </span>
                    </button>
                    <button
                      class="rounded-md border border-line-strong bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ground disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('clues')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'clues'" icon="spinner" spin />
                        Update clues
                      </span>
                    </button>
                    <button
                      class="rounded-md border border-line-strong bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ground disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('outline')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'outline'" icon="spinner" spin />
                        Update outline
                      </span>
                    </button>
                    <button
                      class="rounded-md border border-line-strong bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ground disabled:opacity-50"
                      :disabled="!projectId || updateInProgress !== null"
                      @click="handleRegenerate('prose')"
                    >
                      <span class="inline-flex items-center gap-2">
                        <font-awesome-icon v-if="updateInProgress === 'prose'" icon="spinner" spin />
                        Update story
                      </span>
                    </button>
                  </div>
                  <div v-if="updateInProgress" class="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-sunken">
                    <div class="h-full w-1/2 animate-pulse rounded-full bg-frame-tint"></div>
                  </div>
                  <div class="mt-2 text-xs text-ink-soft">
                    Update a single section without rerunning everything.
                  </div>
                </div>
              </div>
            </TabPanel>

            <!-- Review Tab with sub-tabs -->
            <TabPanel id="review-tab" :active="activeMainTab === 'review'" :lazy="true">
              <div class="flex flex-col gap-6">

            <div class="rounded-lg border border-line-strong bg-surface-sunken p-4 shadow-sm">
              <div class="text-sm font-semibold text-frame">Review Generated Content</div>
              <div class="mt-2 text-sm text-frame">
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

            <!-- Run in progress banner -->
            <div v-if="isRunning || isStartingRun" class="flex items-center gap-3 rounded-lg border border-line-strong bg-surface-sunken px-4 py-3 text-sm text-frame">
              <font-awesome-icon icon="spinner" spin class="flex-shrink-0" />
              <div>
                <span class="font-semibold">Run in progress</span>
                <span class="ml-1 text-frame">— {{ runProgressLabel }}</span>
              </div>
            </div>

            <div v-if="activeReviewTab === 'cast'" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div>
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-ink">Character Profiles</div>
                  <div class="text-xs text-ink-soft">{{ castData?.suspects?.length || characterProfilesData?.profiles?.length || 0 }} total cast</div>
                </div>
                <div class="mt-1 text-xs text-ink-soft">
                  {{ characterProfilesData?.note ?? "Character profiles are derived from the cast." }}
                </div>
                <!-- Loading skeleton while cast data is being generated -->
                <ContentSkeleton
                  v-if="!characterProfilesData && (isRunning || isStartingRun || artifactsStatus === 'loading')"
                  class="mt-4"
                  :rows="5"
                />
                <div v-if="characterProfilesData?.profiles?.length" class="mt-4 space-y-3">
                  <details
                    v-for="profile in characterProfilesData.profiles"
                    :key="profile.name"
                    class="rounded-md border border-line bg-ground px-3 py-2"
                  >
                    <summary class="cursor-pointer text-sm font-semibold text-ink">
                      {{ profile.name }}
                    </summary>
                    <div class="mt-2 space-y-3 text-sm text-ink-soft">
                      <p v-if="profile.summary" class="italic">{{ profile.summary }}</p>
                      <div v-if="profile.publicPersona" class="text-xs text-ink-soft">
                        <span class="font-semibold">Public:</span> {{ profile.publicPersona }}
                      </div>
                      <div v-if="profile.humourStyle && profile.humourStyle !== 'none'" class="mt-1 flex flex-wrap items-center gap-2 text-xs">
                        <span class="rounded-full bg-warn-wash px-2 py-0.5 text-warn">
                          {{ profile.humourStyle.replace(/_/g, ' ') }}
                        </span>
                        <span v-if="typeof profile.humourLevel === 'number'" class="text-ink-faint">
                          {{ profile.humourLevel >= 0.7 ? 'Frequently witty' : profile.humourLevel >= 0.4 ? 'Occasionally witty' : 'Rarely witty' }}
                        </span>
                        <span class="inline-flex items-center gap-0.5" :title="`Humour level: ${profile.humourLevel}`">
                          <span v-for="n in 5" :key="n" class="inline-block h-1.5 w-3 rounded-sm" :class="n <= Math.round((profile.humourLevel || 0) * 5) ? 'bg-warn' : 'bg-surface-sunken'"></span>
                        </span>
                      </div>
                      <div v-else-if="profile.humourStyle === 'none'" class="mt-1 text-xs text-ink-faint italic">
                        Plays it straight — no humour
                      </div>
                      <div v-if="profile.speechMannerisms" class="mt-1 text-xs text-ink-soft">
                        <span class="font-semibold">Voice:</span> {{ profile.speechMannerisms }}
                      </div>
                      <div v-if="isAdvanced" class="space-y-1 text-xs text-ink-soft">
                        <div v-if="profile.privateSecret"><span class="font-semibold">Private:</span> {{ profile.privateSecret }}</div>
                        <div v-if="profile.motiveSeed"><span class="font-semibold">Motive:</span> {{ profile.motiveSeed }}</div>
                        <div v-if="profile.alibiWindow"><span class="font-semibold">Alibi:</span> {{ profile.alibiWindow }}</div>
                        <div v-if="profile.accessPlausibility"><span class="font-semibold">Access:</span> {{ profile.accessPlausibility }}</div>
                        <div v-if="profile.stakes"><span class="font-semibold">Stakes:</span> {{ profile.stakes }}</div>
                      </div>
                      <div
                        v-else-if="profile.privateSecret || profile.motiveSeed || profile.alibiWindow || profile.accessPlausibility || profile.stakes"
                        class="text-xs text-ink-faint"
                      >
                        Private details hidden. Enable Advanced mode to view.
                      </div>
                      <p v-for="(para, idx) in profile.paragraphs" :key="`${profile.name}-para-${idx}`">{{ para }}</p>
                    </div>
                  </details>
                </div>
                <div v-else class="mt-4 text-sm text-ink-soft">Profiles will appear after generation.</div>
              </div>
            </div>

            <div v-if="activeReviewTab === 'locations'" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-ink">Location Profiles</div>
                <div class="text-xs text-ink-soft">
                  {{ locationProfilesData ? `${locationProfilesData.keyLocations?.length || 0} key locations` : 'Not generated' }}
                </div>
              </div>

              <ContentSkeleton v-if="!locationProfilesData && (isRunning || isStartingRun || artifactsStatus === 'loading')" class="mt-4" :rows="5" />
              <div v-else-if="locationProfilesData" class="mt-4 space-y-6">
                <!-- Primary Location -->
                <div v-if="locationProfilesData.primary" class="rounded-md border border-line bg-ground p-4">
                  <div class="flex items-center justify-between">
                    <div class="text-sm font-semibold text-ink">{{ locationProfilesData.primary.name }}</div>
                    <span class="rounded bg-surface-sunken px-2 py-0.5 text-xs text-frame">Primary</span>
                  </div>
                  <div class="mt-1 text-xs text-ink-soft">
                    {{ locationProfilesData.primary.type }}
                    <span v-if="locationProfilesData.primary.place || locationProfilesData.primary.country" class="text-ink-faint"> • </span>
                    <span v-if="locationProfilesData.primary.place">{{ locationProfilesData.primary.place }}</span>
                    <span v-if="locationProfilesData.primary.place && locationProfilesData.primary.country">, </span>
                    <span v-if="locationProfilesData.primary.country">{{ locationProfilesData.primary.country }}</span>
                  </div>
                  <p class="mt-2 text-sm italic text-ink-soft">{{ locationProfilesData.primary.summary }}</p>
                  <div class="mt-3 space-y-2 text-sm text-ink-soft">
                    <p v-for="(para, idx) in locationProfilesData.primary.paragraphs" :key="`primary-${idx}`">{{ para }}</p>
                  </div>
                </div>

                <!-- Atmosphere -->
                <div v-if="locationProfilesData.atmosphere" class="rounded-md border border-line bg-warn-wash p-4">
                  <div class="text-sm font-semibold text-ink">Atmosphere</div>
                  <div class="mt-2 grid gap-2 text-xs">
                    <div><span class="font-semibold text-ink-soft">Mood:</span> {{ locationProfilesData.atmosphere.mood }}</div>
                    <div><span class="font-semibold text-ink-soft">Weather:</span> {{ locationProfilesData.atmosphere.weather }}</div>
                    <div v-if="locationProfilesData.atmosphere.eraMarkers?.length">
                      <span class="font-semibold text-ink-soft">Era Markers:</span>
                      <span class="ml-1">{{ locationProfilesData.atmosphere.eraMarkers.join(', ') }}</span>
                    </div>
                    <div v-if="locationProfilesData.atmosphere.sensoryPalette?.length">
                      <span class="font-semibold text-ink-soft">Sensory Palette:</span>
                      <span class="ml-1">{{ locationProfilesData.atmosphere.sensoryPalette.join(', ') }}</span>
                    </div>
                  </div>
                </div>

                <!-- Key Locations -->
                <div v-if="locationProfilesData.keyLocations?.length" class="space-y-3">
                  <div class="text-sm font-semibold text-ink">Key Locations</div>
                  <details
                    v-for="(location, idx) in locationProfilesData.keyLocations"
                    :key="`location-${idx}`"
                    class="rounded-md border border-line bg-surface p-3"
                  >
                    <summary class="cursor-pointer text-sm font-semibold text-ink">
                      {{ location.name }} <span class="text-xs font-normal text-ink-soft">({{ location.type }})</span>
                    </summary>
                    <div class="mt-2 space-y-3">
                      <p class="text-sm italic text-ink-soft">{{ location.description }}</p>
                      <div class="space-y-2 text-sm text-ink-soft">
                        <p v-for="(para, paraIdx) in location.paragraphs" :key="`loc-${idx}-para-${paraIdx}`">{{ para }}</p>
                      </div>
                      <div v-if="location.sensoryDetails" class="rounded bg-ground p-2 text-xs">
                        <div class="font-semibold text-ink">Sensory Details:</div>
                        <div v-if="location.sensoryDetails.sights?.length" class="mt-1">
                          <span class="font-semibold text-ink-soft">Sights:</span> {{ location.sensoryDetails.sights.join(', ') }}
                        </div>
                        <div v-if="location.sensoryDetails.sounds?.length" class="mt-1">
                          <span class="font-semibold text-ink-soft">Sounds:</span> {{ location.sensoryDetails.sounds.join(', ') }}
                        </div>
                        <div v-if="location.sensoryDetails.smells?.length" class="mt-1">
                          <span class="font-semibold text-ink-soft">Smells:</span> {{ location.sensoryDetails.smells.join(', ') }}
                        </div>
                        <div v-if="location.sensoryDetails.tactile?.length" class="mt-1">
                          <span class="font-semibold text-ink-soft">Tactile:</span> {{ location.sensoryDetails.tactile.join(', ') }}
                        </div>
                      </div>
                      <div v-if="location.accessibility" class="rounded bg-ground p-2 text-xs">
                        <div class="font-semibold text-ink">Access:</div>
                        <div class="mt-1">
                          <span class="font-semibold text-ink-soft">Public:</span> {{ location.accessibility.publicAccess ? 'Yes' : 'No' }}
                        </div>
                        <div v-if="location.accessibility.whoCanEnter?.length" class="mt-1">
                          <span class="font-semibold text-ink-soft">Who can enter:</span> {{ location.accessibility.whoCanEnter.join(', ') }}
                        </div>
                        <div v-if="location.accessibility.restrictions?.length" class="mt-1">
                          <span class="font-semibold text-ink-soft">Restrictions:</span> {{ location.accessibility.restrictions.join(', ') }}
                        </div>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-ink-soft">Location profiles will appear after generation.</div>

            </div>

            <div v-if="activeReviewTab === 'background'" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-ink">Story Background</div>
                <div class="text-xs text-ink-soft">Background context</div>
              </div>

              <ContentSkeleton v-if="!(backgroundContextData || settingData || locationProfilesData || temporalContextData) && (isRunning || isStartingRun || artifactsStatus === 'loading')" class="mt-4" :rows="4" />
              <div v-else-if="backgroundContextData || settingData || locationProfilesData || temporalContextData" class="mt-4 space-y-4">
                <div v-if="backgroundContextData?.backdropSummary" class="rounded-md border border-line bg-ground p-3 text-sm text-ink">
                  {{ backgroundContextData.backdropSummary }}
                </div>
                <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div class="rounded-md border border-line bg-ground p-3">
                    <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Setting</div>
                    <div class="mt-1 text-sm text-ink">{{ backgroundContextData?.setting?.location ?? settingData?.locationPreset ?? "Not generated" }}</div>
                    <div class="mt-1 text-xs text-ink-soft">{{ backgroundContextData?.setting?.institution ?? "Institution pending" }}</div>
                  </div>
                  <div class="rounded-md border border-line bg-ground p-3">
                    <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Atmosphere</div>
                    <div class="mt-1 text-sm text-ink">{{ backgroundContextData?.setting?.weather ?? settingData?.weather ?? locationProfilesData?.atmosphere?.weather ?? "Not generated" }}</div>
                    <div class="mt-1 text-xs text-ink-soft">{{ locationProfilesData?.atmosphere?.mood ?? "Mood pending" }}</div>
                  </div>
                  <div class="rounded-md border border-line bg-ground p-3">
                    <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Period</div>
                    <div class="mt-1 text-sm text-ink">
                      {{ backgroundContextData?.era?.decade ?? (temporalContextData ? `${temporalContextData.specificDate.month} ${temporalContextData.specificDate.year}` : "Not generated") }}
                    </div>
                    <div class="mt-1 text-xs text-ink-soft">{{ backgroundContextData?.era?.socialStructure ?? temporalContextData?.specificDate?.era ?? "Era pending" }}</div>
                  </div>
                </div>

                <div v-if="backgroundContextData?.castAnchors?.length" class="rounded-md border border-line bg-surface p-4">
                  <div class="text-sm font-semibold text-ink">Cast anchors</div>
                  <div class="mt-2 flex flex-wrap gap-2 text-xs">
                    <span
                      v-for="name in backgroundContextData.castAnchors"
                      :key="name"
                      class="rounded-full border border-line bg-ground px-2 py-1 text-ink-soft"
                    >
                      {{ name }}
                    </span>
                  </div>
                </div>

                <div v-if="locationProfilesData?.primary" class="rounded-md border border-line bg-surface p-4">
                  <div class="text-sm font-semibold text-ink">Primary location</div>
                  <div class="mt-1 text-xs text-ink-soft">
                    {{ locationProfilesData.primary.name }}
                    <span v-if="locationProfilesData.primary.place"> • {{ locationProfilesData.primary.place }}</span>
                    <span v-if="locationProfilesData.primary.country">, {{ locationProfilesData.primary.country }}</span>
                  </div>
                  <p class="mt-2 text-sm text-ink-soft">{{ locationProfilesData.primary.summary }}</p>
                </div>

                <div v-if="temporalContextData?.paragraphs?.length" class="rounded-md border border-line bg-surface p-4">
                  <div class="text-sm font-semibold text-ink">Backdrop notes</div>
                  <p class="mt-2 text-sm text-ink-soft">{{ temporalContextData.paragraphs[0] }}</p>
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-ink-soft">Background context will appear after generation.</div>

            </div>

            <div v-if="activeReviewTab === 'hardLogic'" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-ink">Hard-Logic Devices</div>
                <div class="text-xs text-ink-soft">{{ hardLogicDevicesData?.devices?.length || 0 }} devices</div>
              </div>

              <ContentSkeleton v-if="!hardLogicDevicesData && (isRunning || isStartingRun || artifactsStatus === 'loading')" class="mt-4" :rows="5" />
              <div v-else-if="hardLogicDevicesData" class="mt-4 space-y-4">
                <div v-if="hardLogicDevicesData.overview" class="rounded-md border border-line bg-ground p-3 text-sm text-ink-soft">
                  {{ hardLogicDevicesData.overview }}
                </div>
                <details
                  v-for="(device, idx) in hardLogicDevicesData.devices"
                  :key="`${device.title}-${idx}`"
                  class="rounded-md border border-line bg-surface p-3"
                >
                  <summary class="cursor-pointer text-sm font-semibold text-ink">
                    {{ device.title }}
                    <span class="ml-2 text-xs font-normal text-ink-soft">({{ device.principleType.replace('_', ' ') }})</span>
                  </summary>
                  <div class="mt-3 space-y-2 text-sm text-ink-soft">
                    <div><span class="font-semibold text-ink">Core principle:</span> {{ device.corePrinciple }}</div>
                    <div><span class="font-semibold text-ink">Surface illusion:</span> {{ device.surfaceIllusion }}</div>
                    <div><span class="font-semibold text-ink">Underlying reality:</span> {{ device.underlyingReality }}</div>
                    <div><span class="font-semibold text-ink">Why it is not a trope:</span> {{ device.whyNotTrope }}</div>
                    <div><span class="font-semibold text-ink">Variation:</span> {{ device.variationEscalation }}</div>
                    <div v-if="device.mechanismFamilyHints?.length">
                      <span class="font-semibold text-ink">Mechanism hints:</span>
                      {{ device.mechanismFamilyHints.join(', ') }}
                    </div>
                    <div v-if="device.modeTags?.length">
                      <span class="font-semibold text-ink">Mode tags:</span>
                      {{ device.modeTags.join(', ') }}
                    </div>
                    <div v-if="device.fairPlayClues?.length">
                      <div class="font-semibold text-ink">Fair-play clues</div>
                      <ul class="ml-4 mt-1 list-disc text-xs text-ink-soft">
                        <li v-for="(clue, clueIdx) in device.fairPlayClues" :key="`${device.title}-clue-${clueIdx}`">{{ clue }}</li>
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
              <div v-else class="mt-4 text-sm text-ink-soft">Hard-logic devices will appear after generation.</div>

            </div>

            <div v-if="activeReviewTab === 'temporal'" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-ink">Era & Cultural Context</div>
                <div v-if="temporalContextData" class="text-xs text-ink-soft">
                  {{ temporalContextData.specificDate.month }} {{ temporalContextData.specificDate.year }}
                </div>
              </div>

              <ContentSkeleton v-if="!temporalContextData && (isRunning || isStartingRun || artifactsStatus === 'loading')" class="mt-4" :rows="5" />
              <div v-else-if="temporalContextData" class="mt-4 space-y-6">
                <!-- Specific Date -->
                <div class="rounded-md border border-line bg-surface-sunken p-4">
                  <div class="text-sm font-semibold text-ink">Specific Date</div>
                  <div class="mt-2 text-sm text-ink-soft">
                    <span class="font-semibold">{{ temporalContextData.specificDate.month }}</span>
                    <span v-if="temporalContextData.specificDate.day"> {{ temporalContextData.specificDate.day }},</span>
                    {{ temporalContextData.specificDate.year }}
                    <span class="text-xs text-ink-soft">({{ temporalContextData.specificDate.era }})</span>
                  </div>
                </div>

                <!-- Narrative Paragraphs -->
                <div v-if="temporalContextData.paragraphs?.length" class="space-y-2 text-sm text-ink-soft">
                  <p v-for="(para, idx) in temporalContextData.paragraphs" :key="`temp-para-${idx}`">{{ para }}</p>
                </div>

                <!-- Seasonal Context -->
                <div v-if="temporalContextData.seasonal" class="rounded-md border border-line bg-ok-wash p-4">
                  <div class="text-sm font-semibold text-ink">Seasonal Context</div>
                  <div class="mt-2 space-y-2 text-xs">
                    <div><span class="font-semibold text-ink-soft">Season:</span> {{ temporalContextData.seasonal.season }}</div>
                    <div><span class="font-semibold text-ink-soft">Daylight:</span> {{ temporalContextData.seasonal.daylight }}</div>
                    <div v-if="temporalContextData.seasonal.weather?.length">
                      <span class="font-semibold text-ink-soft">Weather:</span> {{ temporalContextData.seasonal.weather.join(', ') }}
                    </div>
                    <div v-if="temporalContextData.seasonal.holidays?.length">
                      <span class="font-semibold text-ink-soft">Holidays:</span> {{ temporalContextData.seasonal.holidays.join(', ') }}
                    </div>
                    <div v-if="temporalContextData.seasonal.seasonalActivities?.length">
                      <span class="font-semibold text-ink-soft">Activities:</span> {{ temporalContextData.seasonal.seasonalActivities.join(', ') }}
                    </div>
                  </div>
                </div>

                <!-- Fashion -->
                <details v-if="temporalContextData.fashion" class="rounded-md border border-line bg-surface-sunken p-3">
                  <summary class="cursor-pointer text-sm font-semibold text-ink">Fashion & Attire</summary>
                  <div class="mt-3 space-y-3 text-xs">
                    <div>
                      <div class="font-semibold text-ink-soft">Men's Formal:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.fashion.mensWear.formal?.join(', ') }}</div>
                    </div>
                    <div>
                      <div class="font-semibold text-ink-soft">Men's Casual:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.fashion.mensWear.casual?.join(', ') }}</div>
                    </div>
                    <div>
                      <div class="font-semibold text-ink-soft">Women's Formal:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.fashion.womensWear.formal?.join(', ') }}</div>
                    </div>
                    <div>
                      <div class="font-semibold text-ink-soft">Women's Casual:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.fashion.womensWear.casual?.join(', ') }}</div>
                    </div>
                    <div v-if="temporalContextData.fashion.trendsOfTheMoment?.length">
                      <div class="font-semibold text-ink-soft">Trends:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.fashion.trendsOfTheMoment.join(', ') }}</div>
                    </div>
                  </div>
                </details>

                <!-- Current Affairs -->
                <details v-if="temporalContextData.currentAffairs" class="rounded-md border border-line bg-danger-wash p-3">
                  <summary class="cursor-pointer text-sm font-semibold text-ink">Current Affairs</summary>
                  <div class="mt-3 space-y-2 text-xs">
                    <div v-if="temporalContextData.currentAffairs.politicalClimate">
                      <div class="font-semibold text-ink-soft">Political Climate:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.currentAffairs.politicalClimate }}</div>
                    </div>
                    <div v-if="temporalContextData.currentAffairs.economicConditions">
                      <div class="font-semibold text-ink-soft">Economic Conditions:</div>
                      <div class="ml-2 mt-1">{{ temporalContextData.currentAffairs.economicConditions }}</div>
                    </div>
                    <div v-if="temporalContextData.currentAffairs.majorEvents?.length">
                      <div class="font-semibold text-ink-soft">Major Events:</div>
                      <ul class="ml-4 mt-1 list-disc">
                        <li v-for="(event, idx) in temporalContextData.currentAffairs.majorEvents" :key="`event-${idx}`">{{ event }}</li>
                      </ul>
                    </div>
                  </div>
                </details>

                <!-- Cultural Context -->
                <details v-if="temporalContextData.cultural" class="rounded-md border border-line bg-warn-wash p-3">
                  <summary class="cursor-pointer text-sm font-semibold text-ink">Cultural Context</summary>
                  <div class="mt-3 space-y-3 text-xs">
                    <div v-if="temporalContextData.cultural.entertainment">
                      <div class="font-semibold text-ink-soft">Entertainment:</div>
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
                      <div class="font-semibold text-ink-soft">Technology:</div>
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
                      <div class="font-semibold text-ink-soft">Daily Life:</div>
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
                <div v-if="temporalContextData.atmosphericDetails?.length" class="rounded-md border border-line bg-ground p-4">
                  <div class="text-sm font-semibold text-ink">Atmospheric Details</div>
                  <ul class="ml-4 mt-2 list-disc space-y-1 text-xs text-ink-soft">
                    <li v-for="(detail, idx) in temporalContextData.atmosphericDetails" :key="`atm-${idx}`">{{ detail }}</li>
                  </ul>
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-ink-soft">Temporal context will appear after generation.</div>

            </div>

            <div v-if="activeReviewTab === 'clues'" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-sm font-semibold text-ink">Clue Board</div>
                  <div class="mt-1 text-xs text-ink-soft">{{ cluesData?.items?.length || 0 }} total clues</div>
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
                  <select v-if="playModeEnabled" v-model="currentChapter" class="rounded border border-line px-2 py-1">
                    <option v-for="ch in chapterOptions" :key="ch" :value="ch">Chapter {{ ch }}</option>
                  </select>
                </div>
              </div>
              <ContentSkeleton
                v-if="!cluesData && (isRunning || isStartingRun || artifactsStatus === 'loading')"
                class="mt-4"
                :rows="6"
              />
              <div v-else-if="filteredClues.length" class="mt-4">
                <VirtualList :items="filteredClues" :estimated-item-height="80" :overscan="4">
                  <template #default="{ item: clue }">
                    <div
                      class="mb-2 rounded-md border px-3 py-2 text-sm"
                      :class="clue.redHerring ? 'border-warn bg-warn-wash' : 'border-line bg-surface'"
                    >
                      <div class="font-semibold text-ink">{{ clue.category }}</div>
                      <div class="mt-1 text-ink-soft">{{ clue.text }}</div>
                      <div class="mt-1 text-xs text-ink-soft">
                        Points to: {{ clue.pointsTo }}
                        <span v-if="clue.revealChapter"> • Reveal: Ch.{{ clue.revealChapter }}</span>
                      </div>
                    </div>
                  </template>
                </VirtualList>
              </div>
              <div v-else class="mt-4 text-sm text-ink-soft">No clues yet. Generate to create them.</div>
            </div>

            <div v-if="activeReviewTab === 'outline'" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-ink">Story Outline</div>
                <div class="text-xs text-ink-soft">{{ outlineData?.chapters?.length || 0 }} chapters</div>
              </div>
              <ContentSkeleton v-if="!(outlineData?.chapters?.length) && (isRunning || isStartingRun || artifactsStatus === 'loading')" class="mt-4" :rows="5" />
              <div v-else-if="outlineData && outlineData.chapters && outlineData.chapters.length" class="mt-4 space-y-4">
                <div v-for="(chapter, idx) in outlineData.chapters" :key="idx" class="border-l-2 border-line-strong pl-4">
                  <div class="text-sm font-semibold text-ink">Chapter {{ idx + 1 }}: {{ chapter.title || 'Untitled' }}</div>
                  <div class="mt-1 text-sm text-ink-soft">{{ chapter.summary || chapter.description || 'No summary available' }}</div>
                  <div v-if="chapter.events && chapter.events.length" class="mt-2 text-xs text-ink-soft">
                    {{ chapter.events.length }} event(s)
                  </div>
                </div>
              </div>
              <div v-else class="mt-4 text-sm text-ink-soft">No outline yet. Generate to create it.</div>

            </div>

            <div v-if="activeReviewTab === 'prose'">
              <div class="mb-4 flex items-center justify-between gap-3">
                <div v-if="availableProseVersions.length > 1" class="flex items-center gap-2">
                  <label class="text-xs font-semibold text-ink-soft">PDF version:</label>
                  <select v-model="selectedProseLength" class="rounded-md border border-line px-3 py-1 text-xs">
                    <option v-for="length in availableProseVersions" :key="length" :value="length">
                      {{ length === 'short' ? 'Short (15-25K)' : length === 'medium' ? 'Medium (40-60K)' : 'Long (70-100K)' }}
                    </option>
                  </select>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    v-if="availableProseVersions.length > 1"
                    class="rounded-md border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink hover:bg-ground disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!proseData || !projectId || isDownloadingAllVersions"
                    @click="handleDownloadAllProseVersions"
                  >
                    Export all versions
                  </button>
                  <button
                    class="rounded-md border border-line bg-surface px-3 py-1 text-xs font-semibold text-ink hover:bg-ground disabled:cursor-not-allowed disabled:opacity-60"
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
              <div v-else class="rounded-lg border border-line bg-surface p-6 text-center text-sm text-ink-soft">
                No story text yet. Generate to create it.
              </div>
            </div>
              </div>
            </TabPanel>

            <!-- Advanced Tab with sub-tabs -->
            <TabPanel id="advanced-tab" :active="activeMainTab === 'advanced' && isAdvanced" :lazy="true">
              <div class="flex flex-col gap-6">

            <div class="rounded-lg border border-warn bg-warn-wash p-4 shadow-sm">
              <div class="text-sm font-semibold text-warn">Advanced Mode</div>
              <div class="mt-2 text-sm text-warn">
                <span v-if="activeAdvancedTab === 'cml'">View the raw CML (Compositional Mystery Language) structure. Expert mode enables editing.</span>
                <span v-else-if="activeAdvancedTab === 'artifacts'">Inspect the raw JSON artifacts saved from the pipeline.</span>
                <span v-else-if="activeAdvancedTab === 'logs'">Review LLM operational logs (model, tokens, cost, latency).</span>
                <span v-else-if="activeAdvancedTab === 'samples'">Browse example mystery structures for inspiration. Use these as patterns, not templates to copy.</span>
                <span v-else-if="activeAdvancedTab === 'history'">View the complete run history and event log for this project.</span>
                <span v-else-if="activeAdvancedTab === 'quality'">Phase-by-phase quality scores from the most recent generation run. Enable <code class="font-mono text-xs">ENABLE_SCORING=true</code> to activate scoring.</span>
              </div>
            </div>

            <div v-if="activeAdvancedTab === 'cml'" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div class="flex items-center justify-between">
                <div class="text-sm font-semibold text-ink">CML Viewer</div>
                <div class="text-xs text-ink-soft">
                  <span v-if="isExpert" class="rounded bg-danger-wash px-2 py-1 text-danger">Expert Mode - Editable</span>
                  <span v-else class="rounded bg-surface-sunken px-2 py-1 text-ink">Read-only</span>
                </div>
              </div>
              <div class="mt-2 text-xs text-ink-soft">
                CML (Compositional Mystery Language) is the canonical source of truth for your mystery structure.
              </div>
              <div v-if="cmlArtifact" class="mt-4">
                <pre class="overflow-auto rounded-md bg-frame p-4 text-xs text-on-frame">{{ cmlArtifact }}</pre>
              </div>
              <div v-else class="mt-4 text-sm text-ink-soft">CML will appear after generation.</div>
            </div>

            <div v-if="activeAdvancedTab === 'samples'" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
              <div class="text-sm font-semibold text-ink">Sample Mystery Structures</div>
              <div class="mt-2 text-xs text-ink-soft">
                Browse classic mystery examples for structural inspiration. These show patterns and techniques, but content should not be copied to ensure novelty.
              </div>
              <div class="mt-4 grid gap-2">
                <button
                  v-for="sample in samples"
                  :key="sample.id"
                  class="rounded-md border border-line px-3 py-2 text-left text-sm hover:bg-ground"
                  :class="selectedSample?.id === sample.id ? 'bg-surface-sunken' : ''"
                  @click="handleSampleSelect(sample.id)"
                >
                  {{ sample.name }}
                </button>
              </div>
              <div v-if="selectedSample" class="mt-4">
                <pre class="overflow-auto rounded-md bg-frame p-4 text-xs text-on-frame">{{ selectedSample.content }}</pre>
              </div>
            </div>

            <div v-if="activeAdvancedTab === 'artifacts'" class="flex flex-col gap-4">
              <!-- High-level artifact status dashboard -->
              <ArtifactStatusDashboard
                :artifacts="artifactEntries"
                :is-running="isRunning || isStartingRun"
                @view="handleArtifactView"
                @regenerate="handleArtifactRegenerate"
              />
              <!-- Expert-only raw JSON dump -->
              <details v-if="isExpert" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <summary class="cursor-pointer text-sm font-semibold text-ink">Raw Artifacts (Expert)</summary>
                <div class="mt-4 space-y-4 text-xs">
                  <div>
                    <div class="font-semibold text-ink-soft">Setting</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ settingArtifact ?? "Not available" }}</pre>
                  </div>
                  <div>
                    <div class="font-semibold text-ink-soft">Cast</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ castArtifact ?? "Not available" }}</pre>
                  </div>
                  <div>
                    <div class="font-semibold text-ink-soft">Character Profiles</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ characterProfilesArtifact ?? "Not available" }}</pre>
                  </div>
                  <div>
                    <div class="font-semibold text-ink-soft">Location Profiles</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ locationProfilesArtifact ?? "Not available" }}</pre>
                  </div>
                  <div>
                    <div class="font-semibold text-ink-soft">Temporal Context</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ temporalContextArtifact ?? "Not available" }}</pre>
                  </div>
                  <div>
                    <div class="font-semibold text-ink-soft">Background Context</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ backgroundContextArtifact ?? "Not available" }}</pre>
                  </div>
                  <div>
                    <div class="font-semibold text-ink-soft">Hard-Logic Devices</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ hardLogicDevicesArtifact ?? "Not available" }}</pre>
                  </div>
                  <div>
                    <div class="font-semibold text-ink-soft">Clues</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ cluesArtifact ?? "Not available" }}</pre>
                  </div>
                  <div>
                    <div class="font-semibold text-ink-soft">Outline</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ outlineArtifact ?? "Not available" }}</pre>
                  </div>
                  <div>
                    <div class="font-semibold text-ink-soft">Prose</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ proseArtifact ?? "Not available" }}</pre>
                  </div>
                  <div>
                    <div class="font-semibold text-ink-soft">Game Pack</div>
                    <pre class="mt-2 max-h-64 overflow-auto rounded-md bg-frame p-3 text-on-frame">{{ gamePackArtifact ?? "Not available" }}</pre>
                  </div>
                </div>
              </details>
            </div>

            <div v-if="activeAdvancedTab === 'logs'" class="flex flex-col gap-4">
              <!-- Application error log -->
              <ErrorLogPanel :errors="errors" @clear="clearErrors()" />
              <!-- LLM operational log -->
              <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <div class="text-sm font-semibold text-ink">LLM Log Entries</div>
                <div class="mt-2 text-xs text-ink-soft">Operational log entries (model, tokens, cost, latency). Raw prompts are not stored.</div>
                <div v-if="llmLogs.length" class="mt-4 space-y-2 text-xs">
                  <div
                    v-for="(entry, idx) in llmLogs"
                    :key="`${entry.timestamp}-${idx}`"
                    class="rounded border border-line bg-ground px-3 py-2"
                  >
                    <div class="flex flex-wrap items-center justify-between gap-2 text-ink-soft">
                      <span class="font-semibold text-ink">{{ entry.agent }}</span>
                      <span>{{ entry.operation }}</span>
                      <span>{{ entry.model }}</span>
                      <span v-if="entry.totalTokens">{{ entry.totalTokens }} tokens</span>
                      <span v-if="entry.estimatedCost">${{ entry.estimatedCost.toFixed(4) }}</span>
                    </div>
                    <div class="mt-1 text-[11px] text-ink-soft">
                      {{ entry.timestamp }} • {{ entry.projectId }} • {{ entry.runId }}
                    </div>
                    <div v-if="entry.errorMessage" class="mt-1 text-[11px] text-danger">{{ entry.errorMessage }}</div>
                  </div>
                </div>
                <div v-else class="mt-4 text-sm text-ink-soft">No activity yet. Run generation to see entries.</div>
              </div>
              <!-- Expert: raw LLM debug panel -->
              <DebugPanel v-if="isExpert" :logs="debugLogs" />
            </div>

            <div v-if="activeAdvancedTab === 'history'">
              <RunHistory v-if="runEventsData.length" :events="runEventsData" :run-id="latestRunId ?? undefined" />
              <div v-else class="rounded-lg border border-line bg-surface p-6 text-center text-sm text-ink-soft">
                No run history available
              </div>
            </div>

            <div v-if="activeAdvancedTab === 'quality'" class="space-y-4">
              <!-- Run in progress banner -->
              <div v-if="isRunning || isStartingRun" class="flex items-center gap-3 rounded-lg border border-line-strong bg-surface-sunken px-4 py-3 text-sm text-frame">
                <font-awesome-icon icon="spinner" spin class="flex-shrink-0" />
                <div>
                  <span class="font-semibold">Run in progress</span>
                  <span class="ml-1 text-frame">— {{ runProgressLabel }}</span>
                </div>
              </div>
              <!-- Quality report (always visible) -->
              <div v-if="isScoringReportLoading && !scoringReport" class="rounded-lg border border-line bg-surface p-6 text-center text-sm text-ink-soft">
                Loading quality report...
              </div>
              <template v-else>
                <div v-if="!scoringReport && (isRunning || isStartingRun)" class="rounded-lg border border-line bg-surface p-6 text-center text-sm text-ink-soft">
                  Generating — scores for each stage will appear here as they complete.
                </div>
                <template v-else>
                  <!-- Partial / in-progress snapshot banner -->
                  <div v-if="scoringReport && (scoringReport as unknown as Record<string, unknown>).in_progress === true && (isRunning || isStartingRun)"
                       class="flex items-center gap-2 rounded-lg border border-warn bg-warn-wash px-4 py-2 text-sm text-warn">
                    <font-awesome-icon icon="spinner" spin class="flex-shrink-0" />
                    <span>Partial scores — updating as each stage completes</span>
                  </div>
                  <ScoreCard :report="scoringReport" :loading="isScoringReportLoading" />
                  <PhaseBreakdownTable v-if="scoringReport" :phases="scoringReport.phases" />
                  <ScoreTrendChart v-if="scoringHistory.length >= 2" :history="scoringHistory" />
                </template>
              </template>
            </div>
              </div>
            </TabPanel>

            <!-- Export Tab -->
            <TabPanel id="export-tab" :active="activeMainTab === 'export'" :lazy="true">
              <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div class="rounded-lg border border-line bg-surface p-6 shadow-sm">
                  <div class="text-sm font-semibold text-ink">Export your mystery</div>
                  <div class="mt-2 text-sm text-ink-soft">
                    Download artifacts as JSON, or export reader-ready PDFs when available.
                  </div>

                  <div class="mt-5 grid gap-4 sm:grid-cols-2">
                    <div class="rounded-md border border-line bg-ground p-4">
                      <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Game pack PDF</div>
                      <div class="mt-2 text-xs text-ink-soft">
                        {{ gamePackReady ? 'Ready to download' : 'Generate content first to enable export' }}
                      </div>
                      <button
                        class="mt-3 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="!gamePackData || !projectId || isDownloadingGamePackPdf"
                        @click="handleDownloadGamePackPdf"
                      >
                        <span class="inline-flex items-center gap-2">
                          <font-awesome-icon v-if="isDownloadingGamePackPdf" icon="spinner" spin />
                          Download game pack PDF
                        </span>
                      </button>
                    </div>

                    <div class="rounded-md border border-line bg-ground p-4">
                      <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Story PDF</div>
                      <div class="mt-2 text-xs text-ink-soft">
                        {{ proseReady ? 'Ready to download' : 'Generate prose first to enable export' }}
                      </div>
                      <button
                        class="mt-3 rounded-md border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-sunken disabled:cursor-not-allowed disabled:opacity-60"
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
              <div v-if="settingData" class="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-ink">Setting overview</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="settingReady ? 'bg-ok-wash text-ok' : 'bg-surface-sunken text-ink-soft'"
                  >
                    <font-awesome-icon :icon="settingReady ? 'circle-check' : 'circle-info'" />
                    {{ settingReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-ink-soft">
                  {{ settingData.decade ?? "Unknown era" }} •
                  {{ settingData.locationPreset ?? "Unknown location" }} •
                  {{ settingData.weather ?? "Unknown weather" }}
                </div>
                <div v-if="settingData?.socialStructure" class="mt-1 text-xs text-ink-soft">
                  Social: {{ settingData.socialStructure }}
                </div>
              </div>
              <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-ink">Cast cards</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="castReady ? 'bg-ok-wash text-ok' : 'bg-surface-sunken text-ink-soft'"
                  >
                    <font-awesome-icon :icon="castReady ? 'circle-check' : 'circle-info'" />
                    {{ castReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div v-if="castData?.suspects?.length" class="mt-3 grid gap-2 text-xs text-ink">
                  <div
                    v-for="suspect in castData.suspects"
                    :key="suspect"
                    class="rounded-md border border-line bg-ground px-3 py-2"
                  >
                    <div class="text-sm font-semibold">{{ suspect }}</div>
                    <div class="text-[11px] text-ink-soft">Role: Suspect • Motive: pending</div>
                  </div>
                </div>
                <div v-else class="mt-2 text-sm text-ink-soft">
                  Cast not available yet. Select Generate to create your cast.
                </div>
              </div>
              <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-ink">Clue board</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="cluesReady ? 'bg-ok-wash text-ok' : 'bg-surface-sunken text-ink-soft'"
                  >
                    <font-awesome-icon :icon="cluesReady ? 'circle-check' : 'circle-info'" />
                    {{ cluesReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-soft">
                  <div>{{ cluesData?.items?.length ? `${cluesData.items.length} clues` : "No clues generated yet" }}</div>
                  <div class="flex items-center gap-3">
                    <label class="flex items-center gap-2">
                      <input v-model="playModeEnabled" type="checkbox" />
                      Play mode
                    </label>
                    <label v-if="playModeEnabled" class="flex items-center gap-2">
                      <span>Chapter</span>
                      <select v-model.number="currentChapter" class="rounded border border-line px-2 py-1">
                        <option v-for="chapter in chapterOptions" :key="chapter" :value="chapter">
                          {{ chapter }}
                        </option>
                      </select>
                    </label>
                    <div v-if="playModeEnabled" class="flex items-center gap-2">
                      <button
                        class="rounded border border-line px-2 py-1 text-[11px]"
                        :disabled="currentChapter <= 1"
                        @click="prevChapter"
                      >
                        Prev
                      </button>
                      <button
                        class="rounded border border-line px-2 py-1 text-[11px]"
                        :disabled="currentChapter >= maxChapter"
                        @click="nextChapter"
                      >
                        Next
                      </button>
                      <span class="text-[11px] text-ink-faint">{{ currentChapter }} / {{ maxChapter }}</span>
                    </div>
                    <label class="flex items-center gap-2">
                      <input v-model="showRedHerrings" type="checkbox" />
                      Show red herrings
                    </label>
                  </div>
                </div>
                <div v-if="filteredClues.length" class="mt-3">
                  <VirtualList :items="filteredClues" :estimated-item-height="72" :overscan="4">
                    <template #default="{ item: clue }">
                      <div class="mb-2 rounded-md border border-line bg-ground px-3 py-2">
                        <div class="flex items-center justify-between text-xs text-ink-soft">
                          <span class="uppercase">{{ clue.category }}</span>
                          <span v-if="clue.redHerring" class="rounded bg-warn-wash px-2 py-0.5 text-[10px] font-semibold text-warn">
                            Red herring
                          </span>
                        </div>
                        <div class="mt-1 text-sm font-medium text-ink">{{ clue.text }}</div>
                        <div class="mt-1 text-[11px] text-ink-soft">
                          Points to: {{ clue.pointsTo }} · Reveal: Chapter {{ clue.revealChapter ?? 1 }}
                        </div>
                      </div>
                    </template>
                  </VirtualList>
                </div>
              </div>
              <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-ink">Outline</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="outlineReady ? 'bg-ok-wash text-ok' : 'bg-surface-sunken text-ink-soft'"
                  >
                    <font-awesome-icon :icon="outlineReady ? 'circle-check' : 'circle-info'" />
                    {{ outlineReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-ink-soft">
                  {{ outlineReady ? "Your story outline is ready." : "Outline will appear after generation." }}
                </div>
              </div>
              <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-ink">Story</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="proseReady ? 'bg-ok-wash text-ok' : 'bg-surface-sunken text-ink-soft'"
                  >
                    <font-awesome-icon :icon="proseReady ? 'circle-check' : 'circle-info'" />
                    {{ proseReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-ink-soft">
                  {{ proseReady ? "Your story is ready to read." : "Story text will appear after generation." }}
                </div>
              </div>
              <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-ink">What’s next?</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="cluesReady || outlineReady || proseReady ? 'bg-ok-wash text-ok' : 'bg-surface-sunken text-ink-soft'"
                  >
                    <font-awesome-icon :icon="cluesReady || outlineReady || proseReady ? 'circle-check' : 'circle-info'" />
                    {{ cluesReady || outlineReady || proseReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-ink-soft">
                  {{ cluesReady || outlineReady || proseReady ? "Pick a place to explore your mystery." : "Generate results to unlock these next steps." }}
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <button
                    class="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ground disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!cluesReady"
                    @click="setView('clues')"
                  >
                    Explore clues
                  </button>
                  <button
                    class="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ground disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!outlineReady"
                    @click="setView('outline')"
                  >
                    Read outline
                  </button>
                  <button
                    class="rounded-md border border-line px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ground disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="!proseReady"
                    @click="setView('prose')"
                  >
                    Open story
                  </button>
                </div>
              </div>
              <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-ink">Fair-play report</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="fairPlayReady ? 'bg-ok-wash text-ok' : 'bg-surface-sunken text-ink-soft'"
                  >
                    <font-awesome-icon :icon="fairPlayReady ? 'circle-check' : 'circle-info'" />
                    {{ fairPlayReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-ink-soft">
                  {{ fairPlayReport ? fairPlayReport.summary : "Report will appear after clues" }}
                </div>
                <div v-if="fairPlayReport?.checks?.length" class="mt-3 space-y-1 text-xs text-ink-soft">
                  <div v-for="check in fairPlayReport.checks" :key="check.id" class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full" :class="check.status === 'pass' ? 'bg-ok' : 'bg-warn'"></span>
                    <span>{{ check.label }}</span>
                  </div>
                </div>
              </div>
              <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-ink">Game pack</div>
                  <span
                    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold transition"
                    :class="gamePackReady ? 'bg-ok-wash text-ok' : 'bg-surface-sunken text-ink-soft'"
                  >
                    <font-awesome-icon :icon="gamePackReady ? 'circle-check' : 'circle-info'" />
                    {{ gamePackReady ? "Ready" : "Pending" }}
                  </span>
                </div>
                <div class="mt-2 text-sm text-ink-soft">
                  {{ gamePackData?.title ?? "Game pack will appear after generation." }}
                </div>
                <div class="mt-2 text-xs text-ink-soft">
                  {{ gamePackData?.suspects?.length ?? 0 }} suspects · {{ gamePackData?.materials?.length ?? 0 }} materials
                </div>
                <button
                  class="mt-3 rounded-md border border-line px-3 py-1 text-xs font-semibold"
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

          <aside class="hidden w-80 flex-shrink-0 flex-col gap-4 rounded-xl border border-line bg-ground/80 p-3 md:flex md:self-start md:sticky md:top-4 md:max-h-[calc(100vh-2rem)] md:overflow-y-auto">
            <div class="px-1 pt-1">
              <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft">Workspace panel</div>
              <div class="mt-1 text-[11px] text-ink-soft">Status, validation, and diagnostics</div>
            </div>
            <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
              <div class="text-sm font-semibold text-ink">Status</div>
              <div class="mt-2 text-sm text-ink-soft">{{ runProgressLabel }}</div>
              <div v-if="isRunning || isStartingRun" class="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-sunken">
                <div
                  class="h-full rounded-full bg-frame-tint transition-all duration-500"
                  :style="{ width: `${runProgressPercent}%` }"
                ></div>
              </div>
              <div v-if="isRunning || isStartingRun" class="mt-2 text-xs text-ink-soft">
                {{ Math.round(runProgressPercent) }}% complete
              </div>
              <div class="mt-3 text-xs text-ink-soft">{{ lastUpdatedLabel }}</div>
            </div>

            <div v-if="!isAdvanced" class="rounded-lg border border-line bg-surface p-4 shadow-sm">
              <div class="text-sm font-semibold text-ink">Helpful fixes</div>
              <ul class="mt-2 space-y-1 text-xs text-ink-soft">
                <li v-for="(suggestion, index) in fixSuggestions" :key="index">{{ suggestion }}</li>
              </ul>
            </div>

            <div v-if="isAdvanced" class="space-y-4">
              <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-semibold text-ink">Validation details</div>
                  <button
                    class="text-xs font-semibold text-ink-soft underline"
                    @click="showAdvancedValidation = !showAdvancedValidation"
                  >
                    {{ showAdvancedValidation ? "Hide" : "Show" }} details
                  </button>
                </div>
                <div v-if="showAdvancedValidation" class="mt-3">
                  <ValidationPanel :validation="allValidation" @field-focus="handleValidationFieldFocus" />
                </div>
              </div>
              <NoveltyAudit :audit="noveltyAuditData" />
              <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
                <div class="text-sm font-semibold text-ink">Connection</div>
                <div class="mt-2 text-xs text-ink-soft">Advanced diagnostics</div>
                <div class="mt-3 flex gap-2">
                  <button class="rounded-md border border-line px-3 py-1 text-xs font-semibold" @click="connectSse">
                    Reconnect
                  </button>
                  <button class="rounded-md border border-line px-3 py-1 text-xs font-semibold" @click="disconnectSse">
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
  <!-- Global keyboard shortcut help overlay (? key) -->
  <KeyboardShortcutHelp v-if="showShortcutHelp" @close="showShortcutHelp = false" />
</template>

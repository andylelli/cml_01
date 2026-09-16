import type { InjectionKey } from "vue";
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import ExportPanel from "../../components/ExportPanel.vue";
import ErrorNotification from "../../components/ErrorNotification.vue";
import ValidationPanel from "../../components/ValidationPanel.vue";
import ProseReader from "../../components/ProseReader.vue";
import RunHistory from "../../components/RunHistory.vue";
import NoveltyAudit from "../../components/NoveltyAudit.vue";
import ScoreCard from "../../components/ScoreCard.vue";
import PhaseBreakdownTable from "../../components/PhaseBreakdownTable.vue";
import ScoreTrendChart from "../../components/ScoreTrendChart.vue";
import TabBar from "../../components/TabBar.vue";
import TabPanel from "../../components/TabPanel.vue";
import ProgressIndicator from "../../components/ProgressIndicator.vue";
import type { PipelineStep } from "../../components/pipelineTypes";
import ArtifactStatusDashboard from "../../components/ArtifactStatusDashboard.vue";
import ErrorLogPanel from "../../components/ErrorLogPanel.vue";
import DebugPanel from "../../components/DebugPanel.vue";
import ContentSkeleton from "../../components/ContentSkeleton.vue";
import KeyboardShortcutHelp from "../../components/KeyboardShortcutHelp.vue";
import VirtualList from "../../components/VirtualList.vue";
import type {
  ErrorItem,
  ErrorSeverity,
  Tab,
  TabStatus,
  GenerationReport,
} from "../../components/types";
import { useProjectStore } from "../../stores/projectStore";
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
} from "../../services/api";
import { subscribeToRunEvents } from "../../services/sse";
import { useRunProgress } from "../../composables/useRunProgress";
import { useShortcuts, type Shortcut } from "../../composables/useShortcuts";
import { deriveProgress, deriveStages, progressPercentFromEvent } from "../../run/timeline";
import { coerceSpec, defaultSpec, type MysterySpec } from "../../spec/vocabulary";

/**
 * THE OPERATOR CONSOLE'S STATE, lifted out of WorkshopView.vue (UI-002 item 25).
 *
 * The console was one 3,226-line component: ~1,700 lines of script and ~1,500 of template, holding
 * six top-level tabs and fourteen sub-panels. This is the first half of the split — the logic moved
 * to a composable so that:
 *
 *   1. its RETURN TYPE is the contract panel components inject, inferred rather than hand-written
 *      across 130 fields, and
 *   2. it is ordinary TypeScript rather than an SFC, so it can be tested directly.
 *
 * MEASURED before the split: 130 distinct bindings reach the template, and 100 of them are used by
 * exactly ONE panel. Those are the ones that should eventually live in their panel rather than
 * here; this file is the staging post, not the destination.
 */
export const useWorkshopState = () => {

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

  const runProgress = computed(() => deriveProgress(runEventsData.value));

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
  const pipelineSteps = computed((): PipelineStep[] => deriveStages(runEventsData.value));

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

  return {
    activeAdvancedTab,
    activeMainTab,
    activeReviewTab,
    advancedChecked,
    advancedTabStatuses,
    advancedTabs,
    allValidation,
    artifactEntries,
    artifactsStatus,
    availableProseVersions,
    backgroundContextArtifact,
    backgroundContextData,
    castArtifact,
    castCount,
    castData,
    castNamesInput,
    castReady,
    chapterOptions,
    characterProfilesArtifact,
    characterProfilesData,
    clearErrors,
    cluesArtifact,
    cluesCount,
    cluesData,
    cluesReady,
    cmlArtifact,
    connectSse,
    currentChapter,
    currentView,
    debugLogs,
    disconnectSse,
    dismissError,
    errors,
    expertChecked,
    fairPlayReady,
    fairPlayReport,
    filteredClues,
    fixSuggestions,
    gamePackArtifact,
    gamePackData,
    gamePackReady,
    handleAdvancedTabChange,
    handleArtifactRegenerate,
    handleArtifactView,
    handleCancelRun,
    handleClearStore,
    handleCreateProject,
    handleDownloadAllProseVersions,
    handleDownloadGamePackPdf,
    handleDownloadStoryPdf,
    handleErrorAction,
    handleLoadProject,
    handleRegenerate,
    handleReviewTabChange,
    handleRunPipeline,
    handleSampleSelect,
    handleSaveSpec,
    handleSuggestTheme,
    handleValidationFieldFocus,
    hardLogicDevicesArtifact,
    hardLogicDevicesData,
    isAdvanced,
    isCreatingProject,
    isDownloadingAllVersions,
    isDownloadingGamePackPdf,
    isDownloadingStoryPdf,
    isExpert,
    isRunning,
    isScoringReportLoading,
    isStartingRun,
    lastUpdatedLabel,
    latestRunId,
    latestSpecId,
    llmLogs,
    locationProfilesArtifact,
    locationProfilesData,
    mainTabs,
    maxChapter,
    mode,
    nextChapter,
    noveltyAuditData,
    outlineArtifact,
    outlineData,
    outlineReady,
    pipelineSteps,
    playModeEnabled,
    prevChapter,
    progress,
    projectId,
    projectIdInput,
    projectName,
    projectsList,
    proseArtifact,
    proseData,
    proseReady,
    reviewTabStatuses,
    reviewTabs,
    runEventsData,
    runProgressLabel,
    runProgressPercent,
    samples,
    scoringHistory,
    scoringReport,
    scrollToSection,
    selectedProjectId,
    selectedProseLength,
    selectedSample,
    setView,
    settingArtifact,
    settingData,
    settingReady,
    showAdvancedValidation,
    showRedHerrings,
    showShortcutHelp,
    spec,
    synopsisData,
    synopsisSummary,
    tabStatuses,
    temporalContextArtifact,
    temporalContextData,
    updateInProgress,
  };
};

/** The context panel components inject. Inferred, so it cannot drift from what is provided. */
export type WorkshopState = ReturnType<typeof useWorkshopState>;

export const WORKSHOP_KEY: InjectionKey<WorkshopState> = Symbol("workshop-state");

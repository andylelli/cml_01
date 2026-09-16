<script setup lang="ts">
import { provide } from "vue";
import { useWorkshopState, WORKSHOP_KEY } from "./workshop/useWorkshopState";

// The six tab panels, each injecting the provided state.
import ProjectPanel from "./workshop/panels/ProjectPanel.vue";
import SpecPanel from "./workshop/panels/SpecPanel.vue";
import GeneratePanel from "./workshop/panels/GeneratePanel.vue";
import ReviewPanel from "./workshop/panels/ReviewPanel.vue";
import AdvancedPanel from "./workshop/panels/AdvancedPanel.vue";
import ExportTab from "./workshop/panels/ExportTab.vue";

// Components are imported HERE, not in the composable: <script setup> auto-registers only what it
// imports itself, and a component imported elsewhere fails to resolve at runtime with nothing at
// compile time to warn you.
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
import ArtifactStatusDashboard from "../components/ArtifactStatusDashboard.vue";
import ErrorLogPanel from "../components/ErrorLogPanel.vue";
import DebugPanel from "../components/DebugPanel.vue";
import ContentSkeleton from "../components/ContentSkeleton.vue";
import KeyboardShortcutHelp from "../components/KeyboardShortcutHelp.vue";
import VirtualList from "../components/VirtualList.vue";

/**
 * The console's shell. Its state lives in useWorkshopState, which is also provided to the panel
 * components being extracted from this template (UI-002 item 25).
 */
const ctx = useWorkshopState();
provide(WORKSHOP_KEY, ctx);

const {
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
} = ctx;
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
            <ProjectPanel />

            <!-- Spec Tab -->
            <SpecPanel />

            <!-- Generate Tab -->
            <GeneratePanel />

            <!-- Review Tab with sub-tabs -->
            <ReviewPanel />

            <!-- Advanced Tab with sub-tabs -->
            <AdvancedPanel />

            <!-- Export Tab -->
            <ExportTab />

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


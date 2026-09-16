<script setup lang="ts">
import { provide } from "vue";
import { useWorkshopState, WORKSHOP_KEY } from "./workshop/useWorkshopState";

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


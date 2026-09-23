<script setup lang="ts">
import { provide } from "vue";
import { useWorkshopState, WORKSHOP_KEY } from "./workshop/useWorkshopState";

// The tab panels, each injecting the provided state.
import ProjectPanel from "./workshop/panels/ProjectPanel.vue";
import SpecSummary from "./workshop/panels/SpecSummary.vue";
import GeneratePanel from "./workshop/panels/GeneratePanel.vue";
import InspectPanel from "./workshop/panels/InspectPanel.vue";
import ExportTab from "./workshop/panels/ExportTab.vue";
import WorkspaceRail from "./workshop/WorkspaceRail.vue";

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

/**
 * The console does not own the spec any more, so it needs a way to hand the user back to the
 * page that does. UI-006.
 */
const emit = defineEmits<{ openCreate: [] }>();
const {
  activeMainTab,
  artifactEntries,
  artifactsStatus,
  availableProseVersions,
  backgroundContextArtifact,
  backgroundContextData,
  castArtifact,
  castCount,
  castData,
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
  currentChapter,
  debugLogs,
  dismissError,
  errors,
  fairPlayReady,
  fairPlayReport,
  filteredClues,
  gamePackArtifact,
  gamePackData,
  gamePackReady,
  handleArtifactView,
  handleCancelRun,
  handleClearStore,
  handleDownloadAllProseVersions,
  handleDownloadGamePackPdf,
  handleDownloadStoryPdf,
  handleErrorAction,
  handleLoadProject,
  handleRunPipeline,
  handleSampleSelect,
  hardLogicDevicesArtifact,
  hardLogicDevicesData,
  isAdvanced,
  isDownloadingAllVersions,
  isDownloadingGamePackPdf,
  isDownloadingStoryPdf,
  isRunning,
  isScoringReportLoading,
  isStartingRun,
  latestRunId,
  latestSpecId,
  llmLogs,
  locationProfilesArtifact,
  locationProfilesData,
  mainTabs,
  maxChapter,
  mode,
  nextChapter,
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
  runEventsData,
  samples,
  scoringHistory,
  scrollToSection,
  selectedProjectId,
  selectedProseLength,
  selectedSample,
  goTo,
  settingArtifact,
  settingData,
  settingReady,
  showRedHerrings,
  showShortcutHelp,
  spec,
  synopsisData,
  synopsisSummary,
  tabStatuses,
  temporalContextArtifact,
  temporalContextData,
} = ctx;
</script>

<template>
  <!-- No min-h-screen: AppShell already owns the full-height column, and two nested ones make the
       page scroll past its own footer. -->
  <div>
    <div class="flex min-h-[70vh]">

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
          <div class="min-w-0">
            <!-- The console's only h1 used to be in the sidebar. With the sidebar gone the view had
                 no heading element at all, which the item-29 auditor caught immediately. -->
            <p class="t-eyebrow">Workshop</p>
            <h1 class="t-display-sm mt-0.5 truncate">{{ projectName || "No project open" }}</h1>
          </div>
          <div class="flex items-center gap-4 text-sm">
            <!--
              The Advanced and Expert checkboxes lived here. Expert gated a badge and two panels
              that were already inside a tab gated on the SAME flag; Advanced was circular — turning
              it off removed the Workshop from the nav while the Workshop was still the rendered
              view (B15, verified stranded). Reaching this screen is now the switch. UI-003 §3.
            -->
            <span class="t-eyebrow rounded-sm border border-line bg-surface-sunken px-2.5 py-1">
              Operator
            </span>
          </div>
        </header>

        <!-- Main Tab Navigation -->
        <TabBar
          :tabs="mainTabs"
          v-model:activeTab="activeMainTab"
          :tab-statuses="tabStatuses"
        />

        <!-- No second tab row (UI-009). Long pages carry a jump bar instead. -->

        <main class="flex min-h-0 flex-1 gap-6 overflow-auto bg-ground px-6 py-6">
          <section class="flex min-w-0 flex-1 flex-col gap-6">
            <!--
              RUN — open a project, watch it being written, re-run a stage.

              It was BUILD: open a project, configure the whole spec, generate. The spec form is
              gone — story setup belongs to Create, and having it here too meant two editors for
              one module-singleton value with nothing on screen saying which the run had used.
              What replaces it is the same spec read-only, because reviewing what the pipeline
              produced is meaningless without knowing what it was asked for. UI-006.
            -->
            <TabPanel id="build-tab" :active="activeMainTab === 'build'" :lazy="true">
              <div class="flex flex-col gap-6">
                <!--
                  Merging three tabs into one made the page long, which is the trade. A jump bar
                  pays for it: the three sections are still one workflow, and now you can also get
                  straight to the one you want. `scroll-mt` keeps the heading clear of the sticky
                  tab strip when you land on it.
                -->
                <nav aria-label="Build sections" class="flex flex-wrap items-center gap-2">
                  <span class="t-eyebrow">Jump to</span>
                  <a
                    v-for="s in [
                      { id: 'build-project', label: 'Project' },
                      { id: 'build-generate', label: 'Run' },
                    ]"
                    :key="s.id"
                    :href="`#${s.id}`"
                    class="transition-control rounded-sm border border-line bg-surface px-2.5 py-1 text-[0.78rem] font-medium text-ink no-underline hover:border-line-strong hover:bg-surface-sunken"
                  >
                    {{ s.label }}
                  </a>
                </nav>

                <div id="build-project" class="scroll-mt-24"><ProjectPanel /></div>
                <SpecSummary @open-create="emit('openCreate')" />
                <div id="build-generate" class="scroll-mt-24"><GeneratePanel /></div>
              </div>
            </TabPanel>

            <!-- Inspect: quality, clues, artifacts, logs, history -->
            <InspectPanel />

            <!-- Export Tab -->
            <ExportTab />

            <!-- Dashboard details, with the Build tab. A_103 B73: e8f86c9a removed the `project` tab and
                 this guard kept its name, so Setting overview, Cast, Clue board, Outline, Story, Fair-play
                 and the game-pack download could never render, and "View details below" scrolled to nothing. -->
            <div v-if="activeMainTab === 'build'" id="dashboard-details" class="grid gap-6 md:grid-cols-2">
              <div v-if="settingData" class="rounded-lg border border-line bg-surface p-6 shadow-card">
                <div class="flex items-center justify-between">
                  <div class="t-section">Setting overview</div>
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
                <div v-if="settingData?.socialStructure" class="t-subtitle mt-1">
                  Social: {{ settingData.socialStructure }}
                </div>
              </div>
              <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
                <div class="flex items-center justify-between">
                  <div class="t-section">Cast cards</div>
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
              <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
                <div class="flex items-center justify-between">
                  <div class="t-section">Clue board</div>
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
              <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
                <div class="flex items-center justify-between">
                  <div class="t-section">Outline</div>
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
              <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
                <div class="flex items-center justify-between">
                  <div class="t-section">Story</div>
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
              <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
                <div class="flex items-center justify-between">
                  <div class="t-section">What’s next?</div>
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
                    class="transition-control rounded border border-line bg-surface px-3 py-1.5 text-[0.8rem] font-medium text-ink hover:border-line-strong hover:bg-surface-sunken disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-surface"
                    :disabled="!cluesReady"
                    @click="goTo('inspect', 'inspect-clues')"
                  >
                    Explore clues
                  </button>
                  <button
                    class="transition-control rounded border border-line bg-surface px-3 py-1.5 text-[0.8rem] font-medium text-ink hover:border-line-strong hover:bg-surface-sunken disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-surface"
                    :disabled="!outlineReady"
                    @click="goTo('inspect', 'artifact-outline')"
                  >
                    Read outline
                  </button>
                  <button
                    class="transition-control rounded border border-line bg-surface px-3 py-1.5 text-[0.8rem] font-medium text-ink hover:border-line-strong hover:bg-surface-sunken disabled:cursor-not-allowed disabled:text-ink-faint disabled:hover:bg-surface"
                    :disabled="!proseReady"
                    @click="goTo('export')"
                  >
                    Open story
                  </button>
                </div>
              </div>
              <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
                <div class="flex items-center justify-between">
                  <div class="t-section">Fair-play report</div>
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
              <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
                <div class="flex items-center justify-between">
                  <div class="t-section">Game pack</div>
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
                <div class="t-subtitle mt-1">
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

          <WorkspaceRail />
        </main>
      </div>
    </div>
  </div>
  <!-- Global keyboard shortcut help overlay (? key) -->
  <!-- Labels come from the real tab list, so the help cannot describe tabs that are not there —
       which it did, for six of them, after the Build merge. -->
  <KeyboardShortcutHelp
    v-if="showShortcutHelp"
    :tab-labels="mainTabs.map((t) => t.label)"
    @close="showShortcutHelp = false"
  />
</template>


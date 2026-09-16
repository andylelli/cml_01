<script setup lang="ts">
import { useWorkshop } from "../useWorkshopState";
import ArtifactStatusDashboard from "../../../components/ArtifactStatusDashboard.vue";
import DebugPanel from "../../../components/DebugPanel.vue";
import ErrorLogPanel from "../../../components/ErrorLogPanel.vue";
import PhaseBreakdownTable from "../../../components/PhaseBreakdownTable.vue";
import RunHistory from "../../../components/RunHistory.vue";
import ScoreCard from "../../../components/ScoreCard.vue";
import ScoreTrendChart from "../../../components/ScoreTrendChart.vue";
import TabPanel from "../../../components/TabPanel.vue";

/**
 * Advanced — CML, artifacts, logs, history and quality.
 *
 * Extracted from WorkshopView (UI-002 item 25). It injects the console state rather than taking
 * props: this panel alone binds 37 values, and a prop signature that wide is not an
 * interface. The block below is the original markup, moved unchanged.
 */
const {
	activeAdvancedTab,
	activeMainTab,
	artifactEntries,
	backgroundContextArtifact,
	castArtifact,
	characterProfilesArtifact,
	clearErrors,
	cluesArtifact,
	cmlArtifact,
	debugLogs,
	errors,
	gamePackArtifact,
	handleArtifactRegenerate,
	handleArtifactView,
	handleSampleSelect,
	hardLogicDevicesArtifact,
	isAdvanced,
	isExpert,
	isRunning,
	isScoringReportLoading,
	isStartingRun,
	latestRunId,
	llmLogs,
	locationProfilesArtifact,
	mode,
	outlineArtifact,
	progress,
	projectId,
	proseArtifact,
	runEventsData,
	runProgressLabel,
	samples,
	scoringHistory,
	scoringReport,
	selectedSample,
	settingArtifact,
	temporalContextArtifact,
} = useWorkshop();
</script>

<template>
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
</template>

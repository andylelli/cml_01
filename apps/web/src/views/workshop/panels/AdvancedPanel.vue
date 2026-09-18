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
import { AXIS_OPTIONS } from "../../../spec/vocabulary";

/**
 * Advanced — CML, artifacts, logs, history and quality.
 *
 * Extracted from WorkshopView (UI-002 item 25). It injects the console state rather than taking
 * props: this panel alone binds 37 values, and a prop signature that wide is not an
 * interface. The block below is the original markup, moved unchanged.
 */
const {
	activeAdvancedTab,
	handleClearStore,
	spec,
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
	handleArtifactView,
	hardLogicDevicesArtifact,
	isAdvanced,
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
	settingArtifact,
	temporalContextArtifact,
} = useWorkshop();
</script>

<template>
	<TabPanel id="advanced-tab" :active="activeMainTab === 'advanced' && isAdvanced" :lazy="true">
	  <div class="flex flex-col gap-6">

	<div class="rounded-lg border border-warn bg-warn-wash p-5">
	  <div class="text-sm font-semibold text-warn">Advanced Mode</div>
	  <div class="mt-2 text-sm text-warn">
	    <span v-if="activeAdvancedTab === 'operator'">The two spec fields that are not story setup. Everything else about a story is configured under Create.</span>
	    <span v-else-if="activeAdvancedTab === 'cml'">View the raw CML (Compositional Mystery Language) structure. Read-only.</span>
	    <span v-else-if="activeAdvancedTab === 'artifacts'">Inspect the raw JSON artifacts saved from the pipeline.</span>
	    <span v-else-if="activeAdvancedTab === 'logs'">Review LLM operational logs (model, tokens, cost, latency).</span>
	    <span v-else-if="activeAdvancedTab === 'samples'">Browse example mystery structures for inspiration. Use these as patterns, not templates to copy.</span>
	    <span v-else-if="activeAdvancedTab === 'history'">View the complete run history and event log for this project.</span>
	    <span v-else-if="activeAdvancedTab === 'quality'">Phase-by-phase quality scores from the most recent generation run. Enable <code class="font-mono text-xs">ENABLE_SCORING=true</code> to activate scoring.</span>
	  </div>
	</div>

	<div v-if="activeAdvancedTab === 'cml'" class="rounded-lg border border-line bg-surface p-6 shadow-card">
	  <div class="flex items-center justify-between">
	    <div class="t-section">CML Viewer</div>
	    <div class="text-xs text-ink-soft">
	      <!-- Was v-else to an "Expert Mode" badge. The viewer is read-only in either mode. UI-003 s3. -->
	      <span class="rounded bg-surface-sunken px-2 py-1 text-ink">Read-only</span>
	    </div>
	  </div>
	  <div class="t-subtitle mt-1">
	    CML (Compositional Mystery Language) is the canonical source of truth for your mystery structure.
	  </div>
	  <div v-if="cmlArtifact" class="mt-4">
	    <pre class="overflow-auto rounded-md bg-frame p-4 text-xs text-on-frame">{{ cmlArtifact }}</pre>
	  </div>
	  <div v-else class="mt-4 text-sm text-ink-soft">CML will appear after generation.</div>
	</div>

	<!-- Advanced ▸ Samples was cut: it fetched the same two endpoints as
	     InspirationView and rendered them worse. UI-003 §4, W6. -->

	<div v-if="activeAdvancedTab === 'artifacts'" class="flex flex-col gap-4">
	  <!-- High-level artifact status dashboard -->
	  <ArtifactStatusDashboard
	    :artifacts="artifactEntries"
	    :is-running="isRunning || isStartingRun"
	    @view="handleArtifactView"
	  />
	  <!-- Raw JSON, for when the rendered view is lying -->
	  <details class="rounded-lg border border-line bg-surface p-6 shadow-card">
	    <summary class="cursor-pointer t-section">Raw Artifacts</summary>
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
	  <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
	    <div class="t-section">LLM Log Entries</div>
	    <div class="t-subtitle mt-1">Operational log entries (model, tokens, cost, latency). Raw prompts are not stored.</div>
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
	  <!-- Raw LLM debug panel -->
	  <DebugPanel :logs="debugLogs" />
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
	<div v-if="activeAdvancedTab === 'operator'" class="flex flex-col gap-4">
	  <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
	    <div class="t-section">Run parameters</div>
	    <p class="mt-2 max-w-prose text-sm text-ink-soft">
	      Story setup — era, setting, tone, cast, theme, story angle — lives under <strong>Create</strong>.
	      These two stayed here because neither is a story decision a reader should be asked to make.
	    </p>
	    <div class="mt-4 grid gap-4 md:grid-cols-2">
	      <div>
	        <label for="op-primary-axis" class="text-xs font-semibold text-ink-soft">Concealment axis</label>
	        <select
	          id="op-primary-axis"
	          v-model="spec.primaryAxis"
	          class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong"
	        >
	          <option v-for="axis in AXIS_OPTIONS" :key="axis.value" :value="axis.value">
	            {{ axis.label }} — {{ axis.hint }}
	          </option>
	        </select>
	        <!--
	          The ONE spec field whose bad value throws at pipeline init rather than degrading
	          silently — after the project is made, the spec is saved and the run has begun costing
	          money. A closed list here is what keeps that from ever happening (X60).
	        -->
	        <div class="mt-1 text-[11px] text-ink-faint">
	          What the deception turns on. An unrecognised value aborts the run at init, so this is
	          never free text.
	        </div>
	      </div>
	      <div>
	        <label for="op-prose-batch" class="text-xs font-semibold text-ink-soft">Prose batch size</label>
	        <input
	          id="op-prose-batch"
	          v-model.number="spec.proseBatchSize"
	          type="number"
	          min="1"
	          max="5"
	          class="transition-control mt-2 w-full rounded border border-line bg-surface px-3 py-2.5 text-[0.9rem] text-ink outline-none hover:border-line-strong"
	        />
	        <div class="mt-1 text-[11px] text-ink-faint">
	          Chapters written per LLM call. A throughput knob, not a craft one.
	        </div>
	      </div>
	    </div>
	  </div>

	  <!--
	    Moved out of Project setup, where it sat under a heading that invited clicking. It is a
	    destructive diagnostic and it belongs behind the advanced gate with the other ones.
	  -->
	  <div class="flex items-center justify-between rounded-lg border border-danger bg-danger-wash px-4 py-3">
	    <div class="text-xs text-danger">
	      Clears saved projects, artifacts, run history, scoring reports, LLM logs and prompt history.
	      This cannot be undone.
	    </div>
	    <button
	      class="rounded-md border border-danger bg-surface px-3 py-2 text-xs font-semibold text-danger hover:bg-danger-wash"
	      @click="handleClearStore"
	    >
	      Clear all persistence
	    </button>
	  </div>
	</div>

	</TabPanel>
</template>

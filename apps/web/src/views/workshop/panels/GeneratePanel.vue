<script setup lang="ts">
import { useWorkshop } from "../useWorkshopState";
import ProgressIndicator from "../../../components/ProgressIndicator.vue";
import TabPanel from "../../../components/TabPanel.vue";

/**
 * Generate — Start a run and watch its stages.
 *
 * Extracted from WorkshopView (UI-002 item 25). It injects the console state rather than taking
 * props: this panel alone binds 18 values, and a prop signature that wide is not an
 * interface. The block below is the original markup, moved unchanged.
 */
const {
	activeMainTab,
	castCount,
	cluesCount,
	fairPlayReady,
	gamePackReady,
	handleCancelRun,
	handleRegenerate,
	handleRunPipeline,
	handleSaveSpec,
	isRunning,
	isStartingRun,
	outlineReady,
	pipelineSteps,
	progress,
	projectId,
	runProgressLabel,
	runProgressPercent,
	updateInProgress,
} = useWorkshop();
</script>

<template>
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
</template>

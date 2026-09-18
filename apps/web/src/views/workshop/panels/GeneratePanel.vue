<script setup lang="ts">
import { useWorkshop } from "../useWorkshopState";
import ProgressIndicator from "../../../components/ProgressIndicator.vue";

/**
 * Generate — Start a run and watch its stages.
 *
 * Extracted from WorkshopView (UI-002 item 25). It injects the console state rather than taking
 * props: this panel alone binds 18 values, and a prop signature that wide is not an
 * interface. The block below is the original markup, moved unchanged.
 */
const {
	castCount,
	cluesCount,
	fairPlayReady,
	gamePackReady,
	handleCancelRun,
	handleRunPipeline,
	isRunning,
	isStartingRun,
	outlineReady,
	pipelineSteps,
	progress,
	projectId,
	runProgressLabel,
	runProgressPercent,
} = useWorkshop();
</script>

<template>
	  <div class="rounded-lg border border-line bg-surface p-6 shadow-card">
	    <div class="t-section">Generate</div>
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
	        class="transition-control rounded border border-accent bg-accent px-4 py-2 text-[0.88rem] font-medium text-[--surface] hover:border-accent-hover hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-sunken disabled:text-ink-faint"
	        :disabled="!projectId || isRunning || isStartingRun"
	        @click="handleRunPipeline"
	      >
	        <span class="inline-flex items-center gap-2">
	          <font-awesome-icon v-if="isRunning || isStartingRun" icon="spinner" spin />
	          Generate
	        </span>
	      </button>
	    </div>

	  </div>
</template>

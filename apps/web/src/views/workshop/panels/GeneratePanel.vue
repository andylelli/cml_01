<script setup lang="ts">
import { useWorkshop } from "../useWorkshopState";
import ProgressIndicator from "../../../components/ProgressIndicator.vue";
import { AXIS_OPTIONS } from "../../../spec/vocabulary";

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
	spec,
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

	    <!--
	      RUN PARAMETERS live here now (UI-009), not behind an "Operator" sub-tab.
	      Story setup is Create's job; these two are not story decisions, they are how THIS run
	      behaves — so they belong next to the button that starts it.
	    -->
	    <div class="mt-5 grid gap-4 border-t border-line pt-5 md:grid-cols-2">
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

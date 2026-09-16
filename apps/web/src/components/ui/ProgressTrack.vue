<script setup lang="ts">
import { computed } from "vue";
import AppIcon from "./AppIcon.vue";
import { readerStage } from "../../run/readerStages";
import type { PipelineStep } from "../pipelineTypes";

/**
 * The consumer-facing view of a run in progress.
 *
 * Not the console's `ProgressIndicator`: that one is a dense operator instrument showing every agent
 * by name, and it should stay that way. This shows the same `deriveStages` output in the reader's
 * language — one line per stage, the current one named, and a bar.
 *
 * The bar is `role="progressbar"` with real `aria-valuenow`, so the percentage is available to a
 * screen reader rather than being purely a coloured rectangle.
 */
const props = defineProps<{
	stages: readonly PipelineStep[];
	percent: number;
	/** The pipeline's own message for the current step; shown verbatim under the bar. */
	label?: string;
	failed?: boolean;
}>();

const clamped = computed(() => Math.min(100, Math.max(0, Math.round(props.percent))));
const current = computed(() => props.stages.find((s) => s.status === "running"));
const doneCount = computed(() => props.stages.filter((s) => s.status === "complete").length);
</script>

<template>
	<div class="rounded-lg border border-line bg-surface p-5 shadow-card sm:p-6">
		<div class="flex flex-wrap items-baseline justify-between gap-2">
			<h2 class="t-section">{{ failed ? "Stopped" : "Writing your mystery" }}</h2>
			<span class="t-subtitle text-[0.78rem]">
				{{ doneCount }} of {{ stages.length }} stages
			</span>
		</div>

		<!-- The bar -->
		<div
			class="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-sunken"
			role="progressbar"
			:aria-valuenow="clamped"
			aria-valuemin="0"
			aria-valuemax="100"
			:aria-label="`Generation progress: ${clamped}%`"
		>
			<div
				class="h-full rounded-full transition-[width] duration-500 ease-out"
				:class="failed ? 'bg-danger' : 'bg-accent'"
				:style="{ width: `${clamped}%` }"
			/>
		</div>

		<p class="mt-3 flex items-baseline gap-2 text-[0.88rem]">
			<span class="font-display text-[1.05rem] font-semibold tabular-nums">{{ clamped }}%</span>
			<span class="text-ink-soft">
				{{ current ? readerStage(current.id).blurb : (label ?? "Getting started.") }}
			</span>
		</p>

		<!-- The stages, in the reader's words -->
		<ol class="mt-5 grid gap-x-5 gap-y-1.5 p-0 sm:grid-cols-2">
			<li
				v-for="stage in stages"
				:key="stage.id"
				class="flex list-none items-center gap-2 text-[0.82rem]"
				:class="{
					'text-ink': stage.status === 'complete' || stage.status === 'running',
					'text-ink-faint': stage.status === 'pending',
					'text-danger': stage.status === 'failed',
				}"
			>
				<span class="flex h-4 w-4 shrink-0 items-center justify-center" aria-hidden="true">
					<AppIcon v-if="stage.status === 'complete'" name="check" :size="13" :weight="2.5" class="text-ok" />
					<AppIcon v-else-if="stage.status === 'failed'" name="close" :size="12" :weight="2.5" />
					<AppIcon v-else-if="stage.status === 'running'" name="gear" :size="13" class="spin text-accent" />
					<span v-else class="h-1.5 w-1.5 rounded-full bg-line-strong" />
				</span>

				<span :class="stage.status === 'running' ? 'font-semibold' : ''">
					{{ readerStage(stage.id).label }}
				</span>

				<!-- Status in text, not colour alone. -->
				<span class="sr-only">
					{{
						stage.status === "complete"
							? "done"
							: stage.status === "running"
								? "in progress"
								: stage.status === "failed"
									? "failed"
									: "not started"
					}}
				</span>
			</li>
		</ol>
	</div>
</template>

<style scoped>
.spin {
	animation: spin 1.4s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>

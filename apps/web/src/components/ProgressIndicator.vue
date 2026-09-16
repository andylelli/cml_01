<script lang="ts">
export type { PipelineStep } from "./pipelineTypes";
</script>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue";
import type { PipelineStep } from "./pipelineTypes";

const props = defineProps<{
  steps: PipelineStep[];
  isRunning: boolean;
  progressPercent: number;
  progressLabel: string;
  /** Elapsed ms since run started — provided by parent */
  elapsedMs?: number;
}>();

const emit = defineEmits<{
  cancel: [];
}>();

// Local elapsed timer (ticks every second while running)
const localElapsedMs = ref(props.elapsedMs ?? 0);
let timerHandle: ReturnType<typeof setInterval> | null = null;

const startTimer = () => {
  if (timerHandle) return;
  timerHandle = setInterval(() => {
    localElapsedMs.value += 1000;
  }, 1000);
};

const stopTimer = () => {
  if (timerHandle) {
    clearInterval(timerHandle);
    timerHandle = null;
  }
};

watch(
  () => props.isRunning,
  (running) => {
    if (running) {
      localElapsedMs.value = props.elapsedMs ?? 0;
      startTimer();
    } else {
      stopTimer();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => stopTimer());

const formatMs = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
};

const estimatedRemainingMs = computed(() => {
  if (!props.isRunning || props.progressPercent <= 0) return null;
  const rate = localElapsedMs.value / props.progressPercent; // ms per percent
  const remaining = rate * (100 - props.progressPercent);
  return Math.max(0, Math.round(remaining / 1000) * 1000);
});

const statusIcon = (status: PipelineStep["status"]): string => {
  switch (status) {
    case "complete":
      return "✅";
    case "failed":
      return "❌";
    case "running":
      return "🔵";
    case "skipped":
      return "⏭";
    default:
      return "⚪";
  }
};

const statusClass = (status: PipelineStep["status"]): string => {
  switch (status) {
    case "complete":
      return "text-ok";
    case "failed":
      return "text-danger";
    case "running":
      return "text-frame font-semibold";
    case "skipped":
      return "text-ink-faint line-through";
    default:
      return "text-ink-faint";
  }
};
</script>

<template>
  <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="text-sm font-semibold text-ink">Pipeline Progress</div>
      <button
        v-if="isRunning"
        class="rounded border border-danger bg-surface px-2 py-1 text-xs font-medium text-danger hover:bg-danger-wash"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>

    <!-- Progress bar -->
    <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
      <div
        class="h-full rounded-full bg-frame-tint transition-all duration-700"
        :style="{ width: `${Math.min(100, progressPercent)}%` }"
      ></div>
    </div>

    <div class="mt-1 flex items-center justify-between text-xs text-ink-soft">
      <span>{{ Math.round(progressPercent) }}%</span>
      <span v-if="isRunning">
        Elapsed: {{ formatMs(localElapsedMs) }}
        <span v-if="estimatedRemainingMs !== null"> · Est. remaining: {{ formatMs(estimatedRemainingMs) }}</span>
      </span>
    </div>

    <!-- Current step label -->
    <div v-if="progressLabel" class="mt-2 text-xs text-ink-soft">{{ progressLabel }}</div>

    <!-- Step list -->
    <ol class="mt-4 space-y-1">
      <li
        v-for="step in steps"
        :key="step.id"
        class="flex items-center gap-2 text-xs"
        :class="statusClass(step.status)"
      >
        <span class="w-4 text-center leading-none" :class="step.status === 'running' ? 'animate-pulse' : ''">
          {{ statusIcon(step.status) }}
        </span>
        <span class="flex-1">{{ step.label }}</span>
        <span v-if="step.durationMs !== undefined" class="text-ink-faint">
          ({{ formatMs(step.durationMs) }})
        </span>
      </li>
    </ol>
  </div>
</template>

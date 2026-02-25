<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue";

export interface PipelineStep {
  id: string;
  label: string;
  status: "pending" | "running" | "complete" | "failed" | "skipped";
  durationMs?: number;
}

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

// Rough estimate: total pipeline ~3 min for a full run
const ESTIMATED_TOTAL_MS = 180_000;

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
      return "text-emerald-600";
    case "failed":
      return "text-rose-600";
    case "running":
      return "text-blue-600 font-semibold";
    case "skipped":
      return "text-slate-400 line-through";
    default:
      return "text-slate-400";
  }
};
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="text-sm font-semibold text-slate-700">Pipeline Progress</div>
      <button
        v-if="isRunning"
        class="rounded border border-rose-200 bg-white px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
        @click="emit('cancel')"
      >
        Cancel
      </button>
    </div>

    <!-- Progress bar -->
    <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
      <div
        class="h-full rounded-full bg-slate-700 transition-all duration-700"
        :style="{ width: `${Math.min(100, progressPercent)}%` }"
      ></div>
    </div>

    <div class="mt-1 flex items-center justify-between text-xs text-slate-500">
      <span>{{ Math.round(progressPercent) }}%</span>
      <span v-if="isRunning">
        Elapsed: {{ formatMs(localElapsedMs) }}
        <span v-if="estimatedRemainingMs !== null"> · Est. remaining: {{ formatMs(estimatedRemainingMs) }}</span>
      </span>
    </div>

    <!-- Current step label -->
    <div v-if="progressLabel" class="mt-2 text-xs text-slate-600">{{ progressLabel }}</div>

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
        <span v-if="step.durationMs !== undefined" class="text-slate-400">
          ({{ formatMs(step.durationMs) }})
        </span>
      </li>
    </ol>
  </div>
</template>

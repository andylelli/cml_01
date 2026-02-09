<script setup lang="ts">
import { computed } from "vue";

export interface RunEvent {
  step: string;
  message: string;
}

const props = defineProps<{
  events: RunEvent[];
  runId?: string;
}>();

const getEventIcon = (step: string) => {
  if (step.includes("done") || step.includes("finished") || step.includes("pass")) return "✅";
  if (step.includes("failed") || step.includes("error")) return "❌";
  if (step.includes("retry") || step.includes("warn")) return "⚠️";
  if (step.includes("started")) return "▶️";
  return "•";
};

const getEventClass = (step: string) => {
  if (step.includes("done") || step.includes("finished") || step.includes("pass"))
    return "text-emerald-600";
  if (step.includes("failed") || step.includes("error")) return "text-rose-600";
  if (step.includes("retry") || step.includes("warn")) return "text-amber-600";
  return "text-slate-600";
};

const hasEvents = computed(() => props.events.length > 0);
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div class="text-sm font-semibold text-slate-700">Run History</div>
    <div v-if="runId" class="mt-1 text-xs text-slate-500">Run ID: {{ runId }}</div>
    
    <div v-if="!hasEvents" class="mt-3 text-sm text-slate-600">
      No events recorded yet. Run the pipeline to see execution history.
    </div>

    <div v-else class="mt-3 space-y-2">
      <div
        v-for="(event, idx) in events"
        :key="idx"
        class="flex items-start gap-3 rounded border border-slate-200 bg-slate-50 px-3 py-2"
      >
        <span :class="['flex-shrink-0 text-sm', getEventClass(event.step)]">
          {{ getEventIcon(event.step) }}
        </span>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold uppercase text-slate-500">{{ event.step }}</div>
          <div class="mt-0.5 text-sm text-slate-700">{{ event.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

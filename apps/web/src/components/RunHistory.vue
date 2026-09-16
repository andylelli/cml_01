<script setup lang="ts">
import { computed } from "vue";

export interface RunEvent {
  step: string;
  message: string;
}

const props = defineProps<{
  events: RunEvent[];
  runId?: string;
  maxEvents?: number;
}>();

const emit = defineEmits<{
  "view-full": [];
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
    return "text-ok";
  if (step.includes("failed") || step.includes("error")) return "text-danger";
  if (step.includes("retry") || step.includes("warn")) return "text-warn";
  return "text-ink-soft";
};

const getEventCardClass = (step: string) => {
  if (step.includes("done") || step.includes("finished") || step.includes("pass")) {
    return "border-l-4 border-l-emerald-500";
  }
  if (step.includes("failed") || step.includes("error")) {
    return "border-l-4 border-l-rose-500";
  }
  if (step.includes("retry") || step.includes("warn")) {
    return "border-l-4 border-l-amber-500";
  }
  return "border-l-4 border-l-slate-300";
};

const hasEvents = computed(() => props.events.length > 0);
const isPreviewMode = computed(() => typeof props.maxEvents === "number" && props.maxEvents > 0);
const displayedEvents = computed(() => {
  if (!isPreviewMode.value) return props.events;
  return props.events.slice(-props.maxEvents).reverse();
});
const isTruncated = computed(() => isPreviewMode.value && props.events.length > (props.maxEvents ?? 0));
</script>

<template>
  <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
    <div class="text-sm font-semibold text-ink">Run History</div>
    <div v-if="runId" class="mt-1 text-xs text-ink-soft">Run ID: {{ runId }}</div>
    
    <div v-if="!hasEvents" class="mt-3 text-sm text-ink-soft">
      No events recorded yet. Run the pipeline to see execution history.
    </div>

    <div v-else class="mt-3 space-y-2">
      <div
        v-for="(event, idx) in displayedEvents"
        :key="`${event.step}-${idx}`"
        :class="[
          'flex items-start gap-3 rounded border border-line bg-ground px-3 py-2',
          getEventCardClass(event.step),
        ]"
      >
        <span :class="['flex-shrink-0 text-sm', getEventClass(event.step)]">
          {{ getEventIcon(event.step) }}
        </span>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-semibold uppercase text-ink-soft">{{ event.step }}</div>
          <div class="mt-0.5 text-sm text-ink">{{ event.message }}</div>
        </div>
      </div>
      <div v-if="isTruncated" class="pt-1 text-right">
        <button
          class="text-xs font-semibold text-ink underline"
          @click="emit('view-full')"
        >
          View full history
        </button>
      </div>
    </div>
  </div>
</template>

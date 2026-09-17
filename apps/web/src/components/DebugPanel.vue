<script lang="ts">
/**
 * DebugPanel — the raw LLM call log, inside the Advanced tab.
 * Shows raw LLM request/response log entries, network timings, and performance metrics.
 */
export type { LlmLogEntry } from "./debugPanelTypes";
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { LlmLogEntry } from "./debugPanelTypes";

const props = defineProps<{
  logs: LlmLogEntry[];
}>();

const expandedIndex = ref<number | null>(null);

const toggle = (i: number) => {
  expandedIndex.value = expandedIndex.value === i ? null : i;
};

const totalCost = computed(() =>
  props.logs.reduce((sum, l) => sum + (l.cost ?? 0), 0)
);

const totalTokens = computed(() =>
  props.logs.reduce((sum, l) => sum + (l.totalTokens ?? 0), 0)
);

const avgDuration = computed(() => {
  const withDuration = props.logs.filter((l) => l.durationMs != null);
  if (!withDuration.length) return 0;
  return Math.round(withDuration.reduce((sum, l) => sum + (l.durationMs ?? 0), 0) / withDuration.length);
});

const statusClass = (status?: string) => {
  switch (status) {
    case "ok":
      return "text-ok";
    case "error":
      return "text-danger";
    case "retry":
      return "text-warn";
    default:
      return "text-ink-soft";
  }
};

const handleCopyEntry = (entry: LlmLogEntry) => {
  navigator.clipboard.writeText(JSON.stringify(entry, null, 2)).catch(() => undefined);
};
</script>

<template>
  <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
    <div class="t-section">Debug Panel</div>

    <!-- Performance summary -->
    <div class="mt-3 grid grid-cols-3 gap-3 text-xs">
      <div class="rounded-lg border border-line bg-ground p-2 text-center">
        <div class="font-semibold text-ink">{{ logs.length }}</div>
        <div class="text-ink-soft">LLM calls</div>
      </div>
      <div class="rounded-lg border border-line bg-ground p-2 text-center">
        <div class="font-semibold text-ink">{{ totalTokens.toLocaleString() }}</div>
        <div class="text-ink-soft">Total tokens</div>
      </div>
      <div class="rounded-lg border border-line bg-ground p-2 text-center">
        <div class="font-semibold text-ink">${{ totalCost.toFixed(4) }}</div>
        <div class="text-ink-soft">Est. cost</div>
      </div>
    </div>
    <div class="mt-1 text-center text-[11px] text-ink-faint">
      Avg. response time: {{ avgDuration }}ms
    </div>

    <div v-if="!logs.length" class="mt-4 text-xs text-ink-faint">No LLM calls recorded yet.</div>

    <!-- Log entries -->
    <div v-else class="mt-4 space-y-2">
      <div
        v-for="(entry, i) in logs"
        :key="entry.id ?? i"
        class="rounded border border-line text-xs"
      >
        <!-- Summary row -->
        <button
          class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-ground"
          @click="toggle(i)"
        >
          <span class="font-semibold text-ink">{{ entry.agent ?? "unknown" }}</span>
          <span :class="statusClass(entry.status)">{{ entry.status ?? "—" }}</span>
          <span class="ml-auto text-ink-faint">{{ entry.durationMs != null ? `${entry.durationMs}ms` : "" }}</span>
          <span class="text-ink-faint">{{ entry.totalTokens != null ? `${entry.totalTokens}tok` : "" }}</span>
          <span class="text-[11px] text-ink-faint">{{ expandedIndex === i ? "▲" : "▼" }}</span>
        </button>

        <!-- Expanded detail -->
        <div v-if="expandedIndex === i" class="border-t border-line px-3 py-2">
          <div class="flex justify-end">
            <button
              class="text-[11px] text-ink-faint hover:text-ink-soft"
              @click="handleCopyEntry(entry)"
            >
              Copy JSON
            </button>
          </div>
          <div v-if="entry.errorMessage" class="mt-1 text-danger">{{ entry.errorMessage }}</div>
          <div class="mt-2 space-y-1 text-[11px] text-ink-soft">
            <div v-if="entry.model"><span class="font-semibold">Model:</span> {{ entry.model }}</div>
            <div v-if="entry.promptTokens != null"><span class="font-semibold">Prompt tokens:</span> {{ entry.promptTokens }}</div>
            <div v-if="entry.completionTokens != null"><span class="font-semibold">Completion tokens:</span> {{ entry.completionTokens }}</div>
            <div v-if="entry.cost != null"><span class="font-semibold">Cost:</span> ${{ entry.cost.toFixed(6) }}</div>
            <div v-if="entry.timestamp"><span class="font-semibold">Time:</span> {{ entry.timestamp }}</div>
          </div>
          <details v-if="entry.prompt" class="mt-2">
            <summary class="cursor-pointer text-[11px] font-semibold text-ink-soft">Prompt</summary>
            <pre class="mt-1 max-h-48 overflow-auto rounded bg-surface-sunken p-2 text-[11px] text-ink whitespace-pre-wrap">{{ entry.prompt }}</pre>
          </details>
          <details v-if="entry.response" class="mt-2">
            <summary class="cursor-pointer text-[11px] font-semibold text-ink-soft">Response</summary>
            <pre class="mt-1 max-h-48 overflow-auto rounded bg-surface-sunken p-2 text-[11px] text-ink whitespace-pre-wrap">{{ entry.response }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

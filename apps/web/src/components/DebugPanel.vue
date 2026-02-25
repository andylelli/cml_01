<script setup lang="ts">
/**
 * DebugPanel — Expert mode only.
 * Shows raw LLM request/response log entries, network timings, and performance metrics.
 */
import { computed, ref } from "vue";

export interface LlmLogEntry {
  id?: string;
  timestamp?: string;
  agent?: string;
  model?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  durationMs?: number;
  cost?: number;
  status?: "ok" | "error" | "retry";
  errorMessage?: string;
  prompt?: string;
  response?: string;
}

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
      return "text-emerald-600";
    case "error":
      return "text-rose-600";
    case "retry":
      return "text-amber-600";
    default:
      return "text-slate-500";
  }
};

const handleCopyEntry = (entry: LlmLogEntry) => {
  navigator.clipboard.writeText(JSON.stringify(entry, null, 2)).catch(() => undefined);
};
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="text-sm font-semibold text-slate-700">Debug Panel <span class="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-normal text-slate-500">Expert</span></div>

    <!-- Performance summary -->
    <div class="mt-3 grid grid-cols-3 gap-3 text-xs">
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center">
        <div class="font-semibold text-slate-700">{{ logs.length }}</div>
        <div class="text-slate-500">LLM calls</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center">
        <div class="font-semibold text-slate-700">{{ totalTokens.toLocaleString() }}</div>
        <div class="text-slate-500">Total tokens</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-slate-50 p-2 text-center">
        <div class="font-semibold text-slate-700">${{ totalCost.toFixed(4) }}</div>
        <div class="text-slate-500">Est. cost</div>
      </div>
    </div>
    <div class="mt-1 text-center text-[11px] text-slate-400">
      Avg. response time: {{ avgDuration }}ms
    </div>

    <div v-if="!logs.length" class="mt-4 text-xs text-slate-400">No LLM calls recorded yet.</div>

    <!-- Log entries -->
    <div v-else class="mt-4 space-y-2">
      <div
        v-for="(entry, i) in logs"
        :key="entry.id ?? i"
        class="rounded border border-slate-200 text-xs"
      >
        <!-- Summary row -->
        <button
          class="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-slate-50"
          @click="toggle(i)"
        >
          <span class="font-semibold text-slate-700">{{ entry.agent ?? "unknown" }}</span>
          <span :class="statusClass(entry.status)">{{ entry.status ?? "—" }}</span>
          <span class="ml-auto text-slate-400">{{ entry.durationMs != null ? `${entry.durationMs}ms` : "" }}</span>
          <span class="text-slate-400">{{ entry.totalTokens != null ? `${entry.totalTokens}tok` : "" }}</span>
          <span class="text-[11px] text-slate-400">{{ expandedIndex === i ? "▲" : "▼" }}</span>
        </button>

        <!-- Expanded detail -->
        <div v-if="expandedIndex === i" class="border-t border-slate-200 px-3 py-2">
          <div class="flex justify-end">
            <button
              class="text-[11px] text-slate-400 hover:text-slate-600"
              @click="handleCopyEntry(entry)"
            >
              Copy JSON
            </button>
          </div>
          <div v-if="entry.errorMessage" class="mt-1 text-rose-600">{{ entry.errorMessage }}</div>
          <div class="mt-2 space-y-1 text-[11px] text-slate-500">
            <div v-if="entry.model"><span class="font-semibold">Model:</span> {{ entry.model }}</div>
            <div v-if="entry.promptTokens != null"><span class="font-semibold">Prompt tokens:</span> {{ entry.promptTokens }}</div>
            <div v-if="entry.completionTokens != null"><span class="font-semibold">Completion tokens:</span> {{ entry.completionTokens }}</div>
            <div v-if="entry.cost != null"><span class="font-semibold">Cost:</span> ${{ entry.cost.toFixed(6) }}</div>
            <div v-if="entry.timestamp"><span class="font-semibold">Time:</span> {{ entry.timestamp }}</div>
          </div>
          <details v-if="entry.prompt" class="mt-2">
            <summary class="cursor-pointer text-[11px] font-semibold text-slate-500">Prompt</summary>
            <pre class="mt-1 max-h-48 overflow-auto rounded bg-slate-100 p-2 text-[11px] text-slate-700 whitespace-pre-wrap">{{ entry.prompt }}</pre>
          </details>
          <details v-if="entry.response" class="mt-2">
            <summary class="cursor-pointer text-[11px] font-semibold text-slate-500">Response</summary>
            <pre class="mt-1 max-h-48 overflow-auto rounded bg-slate-100 p-2 text-[11px] text-slate-700 whitespace-pre-wrap">{{ entry.response }}</pre>
          </details>
        </div>
      </div>
    </div>
  </div>
</template>

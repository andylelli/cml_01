<script setup lang="ts">
/**
 * ErrorLogPanel
 * Chronological log of all errors/warnings/info events.
 * Filterable by severity. Supports copy-to-clipboard and clear.
 * Shown in Advanced drawer.
 */
import { computed, ref } from "vue";
import type { ErrorItem, ErrorSeverity } from "./types";

const props = defineProps<{
  errors: ErrorItem[];
}>();

const emit = defineEmits<{
  clear: [];
}>();

const filterSeverity = ref<ErrorSeverity | "all">("all");

const filtered = computed(() => {
  const list = [...props.errors].reverse(); // newest first
  if (filterSeverity.value === "all") return list;
  return list.filter((e) => e.severity === filterSeverity.value);
});

const severityClass = (severity: ErrorSeverity): string => {
  switch (severity) {
    case "error":
      return "text-danger bg-danger-wash border-danger";
    case "warning":
      return "text-warn bg-warn-wash border-warn";
    case "info":
      return "text-frame bg-surface-sunken border-line-strong";
    default:
      return "text-ink-soft bg-ground border-line";
  }
};

const severityIcon = (severity: ErrorSeverity): string => {
  switch (severity) {
    case "error":
      return "❌";
    case "warning":
      return "⚠️";
    case "info":
      return "ℹ️";
    default:
      return "•";
  }
};

const formatTs = (ms: number): string => {
  try {
    return new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch {
    return String(ms);
  }
};

const handleCopy = () => {
  const text = filtered.value
    .map((e) => `[${formatTs(e.timestamp)}] [${e.severity.toUpperCase()}] [${e.scope}] ${e.message}${e.details ? ` — ${e.details}` : ""}`)
    .join("\n");
  navigator.clipboard.writeText(text).catch(() => undefined);
};
</script>

<template>
  <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="text-sm font-semibold text-ink">Error Log</div>
      <div class="flex items-center gap-2">
        <select
          v-model="filterSeverity"
          aria-label="Filter the error log by severity"
          class="rounded border border-line px-2 py-1 text-xs text-ink-soft"
        >
          <option value="all">All</option>
          <option value="error">Errors</option>
          <option value="warning">Warnings</option>
          <option value="info">Info</option>
        </select>
        <button
          class="rounded border border-line px-2 py-1 text-xs text-ink-soft hover:bg-ground"
          @click="handleCopy"
        >
          Copy
        </button>
        <button
          class="rounded border border-danger px-2 py-1 text-xs text-danger hover:bg-danger-wash"
          @click="emit('clear')"
        >
          Clear
        </button>
      </div>
    </div>

    <div v-if="!filtered.length" class="mt-4 text-xs text-ink-faint">No log entries.</div>

    <ol v-else class="mt-3 space-y-2">
      <li
        v-for="entry in filtered"
        :key="entry.id"
        class="rounded border p-2 text-xs"
        :class="severityClass(entry.severity)"
      >
        <div class="flex items-start gap-2">
          <span>{{ severityIcon(entry.severity) }}</span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <span class="font-semibold">{{ entry.scope }}</span>
              <span class="text-[11px] opacity-60">{{ formatTs(entry.timestamp) }}</span>
            </div>
            <div class="mt-0.5">{{ entry.message }}</div>
            <div v-if="entry.details" class="mt-0.5 opacity-70">{{ entry.details }}</div>
          </div>
        </div>
      </li>
    </ol>
  </div>
</template>

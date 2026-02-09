<script setup lang="ts">
import { computed } from "vue";

export type ErrorSeverity = "error" | "warning" | "info";

export interface ErrorItem {
  id: string;
  timestamp: number;
  severity: ErrorSeverity;
  scope: string;
  message: string;
  details?: string;
}

const props = defineProps<{
  errors: ErrorItem[];
}>();

const emit = defineEmits<{
  dismiss: [id: string];
  clear: [scope?: string];
}>();

const sortedErrors = computed(() => {
  return [...props.errors].sort((a, b) => b.timestamp - a.timestamp);
});

const getSeverityClass = (severity: ErrorSeverity) => {
  switch (severity) {
    case "error":
      return "border-rose-200 bg-rose-50 text-rose-900";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-900";
    case "info":
      return "border-blue-200 bg-blue-50 text-blue-900";
  }
};

const getSeverityIcon = (severity: ErrorSeverity) => {
  switch (severity) {
    case "error":
      return "❌";
    case "warning":
      return "⚠️";
    case "info":
      return "ℹ️";
  }
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};
</script>

<template>
  <div v-if="errors.length" class="fixed right-4 top-20 z-50 w-96 space-y-2">
    <div
      v-for="error in sortedErrors.slice(0, 3)"
      :key="error.id"
      :class="[
        'rounded-lg border p-4 shadow-lg transition-all',
        getSeverityClass(error.severity),
      ]"
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <span class="text-lg flex-shrink-0">{{ getSeverityIcon(error.severity) }}</span>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-semibold uppercase">{{ error.scope }}</span>
              <span class="text-xs opacity-60">{{ formatTime(error.timestamp) }}</span>
            </div>
            <p class="mt-1 text-sm font-medium">{{ error.message }}</p>
            <p v-if="error.details" class="mt-1 text-xs opacity-80">{{ error.details }}</p>
          </div>
        </div>
        <button
          class="text-lg opacity-60 hover:opacity-100 flex-shrink-0"
          @click="emit('dismiss', error.id)"
        >
          ×
        </button>
      </div>
    </div>
    <div v-if="errors.length > 3" class="rounded-lg border border-slate-200 bg-white p-3 text-center shadow-lg">
      <p class="text-sm text-slate-600">{{ errors.length - 3 }} more errors</p>
      <button
        class="mt-2 text-xs font-semibold text-slate-700 underline"
        @click="emit('clear')"
      >
        Clear all
      </button>
    </div>
  </div>
</template>

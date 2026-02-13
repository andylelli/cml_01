<script setup lang="ts">
import { computed, ref } from "vue";

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
  showDetails?: boolean;
}>();

const emit = defineEmits<{
  dismiss: [id: string];
  clear: [scope?: string];
  action: [item: ErrorItem];
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
      return "circle-xmark";
    case "warning":
      return "triangle-exclamation";
    case "info":
      return "circle-info";
  }
};

const getPrimaryActionLabel = (scope: string, severity: ErrorSeverity) => {
  if (severity === "info") return "Okay";
  if (scope === "pipeline" || scope === "regenerate") return "Try again";
  if (scope === "spec") return "Save draft";
  if (scope === "project") return "Try again";
  return "Try again";
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
};

const expandedIds = ref<Set<string>>(new Set());
const isExpanded = (id: string) => expandedIds.value.has(id);
const toggleDetails = (id: string) => {
  const next = new Set(expandedIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  expandedIds.value = next;
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
          <font-awesome-icon
            class="text-base flex-shrink-0"
            :icon="getSeverityIcon(error.severity)"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-semibold uppercase">{{ error.scope }}</span>
              <span class="text-xs opacity-60">{{ formatTime(error.timestamp) }}</span>
            </div>
            <p class="mt-1 text-sm font-medium">{{ error.message }}</p>
            <div v-if="props.showDetails && error.details" class="mt-2">
              <button
                class="text-[11px] font-semibold text-current/70 underline"
                data-testid="toggle-details"
                @click="toggleDetails(error.id)"
              >
                {{ isExpanded(error.id) ? "Hide details" : "Show details" }}
              </button>
              <p v-if="isExpanded(error.id)" class="mt-1 text-xs opacity-80">
                {{ error.details }}
              </p>
            </div>
            <div class="mt-3 flex gap-2">
              <button
                class="rounded-md border border-current/30 px-2.5 py-1 text-[11px] font-semibold"
                @click="emit('action', error)"
              >
                {{ getPrimaryActionLabel(error.scope, error.severity) }}
              </button>
            </div>
          </div>
        </div>
        <button
          class="text-lg opacity-60 hover:opacity-100 flex-shrink-0"
          data-testid="dismiss-error"
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

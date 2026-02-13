<script setup lang="ts">
import { computed, ref } from "vue";
import type { AllValidation, ValidationResult } from "./types";

const props = defineProps<{
  validation: AllValidation | null;
}>();

const validationEntries = computed(() => Object.entries(props.validation ?? {}));

const expanded = ref<Record<string, boolean>>({
  setting: false,
  cast: false,
  cml: false,
  clues: false,
  outline: false,
});

const toggleExpand = (key: string) => {
  expanded.value[key] = !expanded.value[key];
};

const getStatusIcon = (valid: boolean, hasWarnings: boolean) => {
  if (!valid) return "❌";
  if (hasWarnings) return "⚠️";
  return "✅";
};

const getStatusClass = (valid: boolean, hasWarnings: boolean) => {
  if (!valid) return "text-rose-600";
  if (hasWarnings) return "text-amber-600";
  return "text-emerald-600";
};

const hasIssues = (result: ValidationResult) => {
  return !result.valid || (result.warnings && result.warnings.length > 0);
};
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div class="text-sm font-semibold text-slate-700">Validation Results</div>
    <div v-if="validationEntries.length" class="mt-3 space-y-2">
      <div
        v-for="([key, result]) in validationEntries"
        :key="key"
        class="rounded border border-slate-200 bg-slate-50"
      >
        <button
          class="flex w-full items-center justify-between px-3 py-2 text-left"
          @click="toggleExpand(String(key))"
        >
          <div class="flex items-center gap-2">
            <span
              :class="[
                'text-sm',
                getStatusClass(result.valid, Boolean(result.warnings?.length)),
              ]"
            >
              {{ getStatusIcon(result.valid, Boolean(result.warnings?.length)) }}
            </span>
            <span class="text-sm font-medium capitalize">{{ key }}</span>
            <span
              v-if="!result.valid"
              class="rounded bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700"
            >
              {{ result.errors.length }} {{ result.errors.length === 1 ? 'error' : 'errors' }}
            </span>
            <span
              v-else-if="result.warnings?.length"
              class="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700"
            >
              {{ result.warnings.length }} {{ result.warnings.length === 1 ? 'warning' : 'warnings' }}
            </span>
          </div>
          <span class="text-xs text-slate-400">
            {{ expanded[String(key)] ? '▼' : '▶' }}
          </span>
        </button>
        <div
          v-if="expanded[String(key)]"
          class="border-t border-slate-200 px-3 py-2"
        >
          <div v-if="hasIssues(result) && result.errors.length" class="space-y-1">
            <div class="text-xs font-semibold text-rose-700">Errors:</div>
            <ul class="list-disc space-y-1 pl-4 text-xs text-rose-600">
              <li v-for="(error, idx) in result.errors" :key="idx">{{ error }}</li>
            </ul>
          </div>
          <div v-if="hasIssues(result) && result.warnings?.length" class="mt-2 space-y-1">
            <div class="text-xs font-semibold text-amber-700">Warnings:</div>
            <ul class="list-disc space-y-1 pl-4 text-xs text-amber-600">
              <li v-for="(warning, idx) in result.warnings" :key="idx">{{ warning }}</li>
            </ul>
          </div>
          <div v-if="!hasIssues(result)" class="text-xs text-emerald-700">
            No issues found.
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mt-3 text-xs text-slate-500">
      No validation results yet.
    </div>
  </div>
</template>

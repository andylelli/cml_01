<script setup lang="ts">
import { computed, ref } from "vue";
import type { AllValidation, ValidationResult } from "./types";

const props = defineProps<{
  validation: AllValidation | null;
}>();

const emit = defineEmits<{
  fieldFocus: [key: string];
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
  if (!valid) return "text-danger";
  if (hasWarnings) return "text-warn";
  return "text-ok";
};

const hasIssues = (result: ValidationResult) => {
  return !result.valid || (result.warnings && result.warnings.length > 0);
};
</script>

<template>
  <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
    <div class="text-sm font-semibold text-ink">Validation Results</div>
    <div v-if="validationEntries.length" class="mt-3 space-y-2">
      <div
        v-for="([key, result]) in validationEntries"
        :key="key"
        class="rounded border border-line bg-ground"
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
              class="rounded bg-danger-wash px-2 py-0.5 text-xs font-semibold text-danger"
            >
              {{ result.errors.length }} {{ result.errors.length === 1 ? 'error' : 'errors' }}
            </span>
            <span
              v-else-if="result.warnings?.length"
              class="rounded bg-warn-wash px-2 py-0.5 text-xs font-semibold text-warn"
            >
              {{ result.warnings.length }} {{ result.warnings.length === 1 ? 'warning' : 'warnings' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="hasIssues(result) && ['setting', 'cast', 'clues', 'outline'].includes(String(key))"
              class="rounded border border-line-strong bg-surface-sunken px-2 py-0.5 text-[10px] font-semibold text-frame hover:bg-surface-sunken"
              @click.stop="emit('fieldFocus', String(key))"
            >
              Fix →
            </button>
            <span class="text-xs text-ink-faint">
              {{ expanded[String(key)] ? '▼' : '▶' }}
            </span>
          </div>
        </button>
        <div
          v-if="expanded[String(key)]"
          class="border-t border-line px-3 py-2"
        >
          <div v-if="hasIssues(result) && result.errors.length" class="space-y-1">
            <div class="text-xs font-semibold text-danger">Errors:</div>
            <ul class="list-disc space-y-1 pl-4 text-xs text-danger">
              <li v-for="(error, idx) in result.errors" :key="idx">{{ error }}</li>
            </ul>
          </div>
          <div v-if="hasIssues(result) && result.warnings?.length" class="mt-2 space-y-1">
            <div class="text-xs font-semibold text-warn">Warnings:</div>
            <ul class="list-disc space-y-1 pl-4 text-xs text-warn">
              <li v-for="(warning, idx) in result.warnings" :key="idx">{{ warning }}</li>
            </ul>
          </div>
          <div v-if="!hasIssues(result)" class="text-xs text-ok">
            No issues found.
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mt-3 text-xs text-ink-soft">
      No validation results yet.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AppIcon from "./ui/AppIcon.vue";
import type { IconName } from "./ui/icons";
import type { AllValidation, ValidationResult } from "./types";

/**
 * Validation results, as a list you can expand.
 *
 * It used to carry a "Fix →" button per row. That button navigated to a `spec` tab which has not
 * existed since UI-006 moved setup to Create, and scrolled to `field-*` ids that exist nowhere in
 * the app — so it blanked the console's content area and did nothing else. Removed (UI-009).
 */
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

/** Glyphs, not emoji — UI-001 §4. Each carries a word too, so colour is never the only signal. */
const getStatus = (valid: boolean, hasWarnings: boolean): { icon: IconName; label: string } => {
  if (!valid) return { icon: "close", label: "invalid" };
  if (hasWarnings) return { icon: "bookmark", label: "has warnings" };
  return { icon: "check", label: "valid" };
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
            <AppIcon
              :name="getStatus(result.valid, Boolean(result.warnings?.length)).icon"
              :size="14"
              role="img"
              :aria-label="getStatus(result.valid, Boolean(result.warnings?.length)).label"
              :class="getStatusClass(result.valid, Boolean(result.warnings?.length))"
            />
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
          <AppIcon
            :name="expanded[String(key)] ? 'chevronDown' : 'chevronRight'"
            :size="14"
            class="shrink-0 text-ink-faint"
            aria-hidden="true"
          />
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

<script setup lang="ts">
/**
 * ContentSkeleton
 * Loading placeholder that mimics card layouts during data fetch.
 * Use instead of blank space while an artifact is being loaded.
 */
const props = defineProps<{
  /** How many skeleton rows/lines to show */
  rows?: number;
  /** Show a heading skeleton above the rows */
  showHeading?: boolean;
}>();

const rowCount = props.rows ?? 4;
</script>

<template>
  <div class="animate-pulse rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <!-- Heading skeleton -->
    <div v-if="showHeading !== false" class="h-4 w-1/3 rounded bg-slate-200"></div>

    <!-- Row skeletons -->
    <div class="mt-4 space-y-3">
      <div
        v-for="i in rowCount"
        :key="i"
        class="h-3 rounded bg-slate-200"
        :style="{ width: `${60 + ((i * 17) % 35)}%` }"
      ></div>
    </div>
  </div>
</template>

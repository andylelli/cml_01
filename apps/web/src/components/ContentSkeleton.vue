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
  /** Announced to assistive technology in place of the empty bars. */
  label?: string;
}>();

const rowCount = props.rows ?? 4;
</script>

<!--
  NOTE: keep the template single-root. A comment ABOVE the root element makes this a fragment, and
  `wrapper.element` then resolves to the comment rather than the div — which silently broke the
  a11y assertion below until it was traced.

  role="status" + aria-busy, with the bars themselves aria-hidden: a skeleton is a picture of
  content that is not there yet, and without this a screen reader walks a stack of empty divs and
  announces nothing useful. The live region carries a real sentence instead.
-->
<template>
  <div
    class="animate-pulse rounded-lg border border-line bg-surface p-5 shadow-card"
    role="status"
    aria-busy="true"
    aria-live="polite"
  >
    <span class="sr-only">{{ label ?? "Loading…" }}</span>

    <!-- Heading skeleton -->
    <div v-if="showHeading !== false" class="h-4 w-1/3 rounded bg-surface-sunken" aria-hidden="true"></div>

    <!-- Row skeletons -->
    <div class="mt-4 space-y-3" aria-hidden="true">
      <div
        v-for="i in rowCount"
        :key="i"
        class="h-3 rounded bg-surface-sunken"
        :style="{ width: `${60 + ((i * 17) % 35)}%` }"
      ></div>
    </div>
  </div>
</template>

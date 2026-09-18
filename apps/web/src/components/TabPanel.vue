<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps<{
  id: string;
  active: boolean;
  lazy?: boolean;
}>();

const hasBeenActive = ref(false);

watch(
  () => props.active,
  (active) => {
    if (active) {
      hasBeenActive.value = true;
    }
  },
  { immediate: true },
);

const shouldRender = computed(() => {
  if (!props.lazy) return true;
  return props.active || hasBeenActive.value;
});

const shouldShowSlot = computed(() => props.active || hasBeenActive.value);

/**
 * The tab that labels this panel. Ids are `<name>-tab` here and `tab-<name>` in TabBar, so the
 * pairing is derivable rather than a fourth thing to keep in step by hand. Without it the panel is
 * an unnamed region: `role="tabpanel"` with nothing saying which tab opened it.
 */
const labelledBy = computed(() => `tab-${props.id.replace(/-tab$/, "")}`);
</script>

<template>
  <div
    v-if="shouldRender"
    :id="id"
    :class="[
      'tab-panel',
      active ? 'block' : 'hidden',
    ]"
    role="tabpanel"
    :aria-labelledby="labelledBy"
    :aria-hidden="!active"
  >
    <slot v-if="shouldShowSlot" />
  </div>
</template>

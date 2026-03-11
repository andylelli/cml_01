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
</script>

<template>
  <div
    v-if="shouldRender"
    :id="id"
    :class="[
      'tab-panel transition-opacity duration-200',
      active ? 'opacity-100' : 'opacity-0 pointer-events-none absolute',
    ]"
    role="tabpanel"
    :aria-hidden="!active"
  >
    <slot v-if="shouldShowSlot" />
  </div>
</template>

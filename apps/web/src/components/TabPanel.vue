<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  id: string;
  active: boolean;
  lazy?: boolean;
}>();

const hasBeenActive = ref(false);

const shouldRender = () => {
  if (!props.lazy) return true;
  if (props.active) {
    hasBeenActive.value = true;
    return true;
  }
  return hasBeenActive.value;
};

onMounted(() => {
  if (props.active) {
    hasBeenActive.value = true;
  }
});
</script>

<template>
  <div
    v-if="shouldRender()"
    :id="id"
    :class="[
      'tab-panel transition-opacity duration-200',
      active ? 'opacity-100' : 'opacity-0 pointer-events-none absolute',
    ]"
    role="tabpanel"
    :aria-hidden="!active"
  >
    <slot v-if="active || hasBeenActive" />
  </div>
</template>

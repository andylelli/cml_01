<script setup lang="ts">
/**
 * VirtualList
 * Renders only the items visible in the viewport using an intersection observer.
 * Suitable for large clue/chapter lists where full DOM rendering is wasteful.
 *
 * Usage:
 *   <VirtualList :items="clues" :estimated-item-height="56" v-slot="{ item, index }">
 *     <ClueRow :clue="item" />
 *   </VirtualList>
 */
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  estimatedItemHeight?: number;
  /** How many items outside viewport to keep mounted (buffers above/below) */
  overscan?: number;
}>();

const itemHeight = computed(() => props.estimatedItemHeight ?? 60);
const overscan = computed(() => props.overscan ?? 5);

const containerRef = ref<HTMLElement | null>(null);
const scrollTop = ref(0);
const containerHeight = ref(600); // initial guess; updated on mount

let resizeObserver: ResizeObserver | null = null;
let scrollHandler: (() => void) | null = null;

const visibleRange = computed(() => {
  const start = Math.max(0, Math.floor(scrollTop.value / itemHeight.value) - overscan.value);
  const visibleCount = Math.ceil(containerHeight.value / itemHeight.value) + overscan.value * 2;
  const end = Math.min(props.items.length - 1, start + visibleCount);
  return { start, end };
});

const totalHeight = computed(() => props.items.length * itemHeight.value);

const visibleItems = computed(() =>
  props.items.slice(visibleRange.value.start, visibleRange.value.end + 1).map((item, i) => ({
    item,
    index: visibleRange.value.start + i,
    top: (visibleRange.value.start + i) * itemHeight.value,
  }))
);

onMounted(() => {
  const el = containerRef.value;
  if (!el) return;

  containerHeight.value = el.clientHeight || 600;

  scrollHandler = () => {
    scrollTop.value = el.scrollTop;
  };
  el.addEventListener("scroll", scrollHandler, { passive: true });

  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      containerHeight.value = entry.contentRect.height;
    }
  });
  resizeObserver.observe(el);
});

onBeforeUnmount(() => {
  const el = containerRef.value;
  if (el && scrollHandler) el.removeEventListener("scroll", scrollHandler);
  resizeObserver?.disconnect();
});
</script>

<template>
  <!-- Outer scrollable container -->
  <div ref="containerRef" class="relative overflow-y-auto" style="max-height: 600px">
    <!-- Spacer that preserves total scroll height -->
    <div :style="{ height: `${totalHeight}px`, position: 'relative' }">
      <div
        v-for="{ item, index, top } in visibleItems"
        :key="index"
        :style="{ position: 'absolute', top: `${top}px`, width: '100%' }"
      >
        <slot :item="item" :index="index" />
      </div>
    </div>
  </div>
</template>

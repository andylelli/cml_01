<script setup lang="ts">
import { computed } from "vue";
import type { Tab, TabStatus } from "./types";

const props = defineProps<{
  tabs: Tab[];
  activeTab: string;
  tabStatuses?: Record<string, TabStatus>;
}>();

const emit = defineEmits<{
  "update:activeTab": [tabId: string];
}>();

const getStatusIcon = (status?: TabStatus) => {
  if (!status) return "";
  switch (status) {
    case "complete":
      return "✅";
    case "error":
      return "❌";
    case "in-progress":
      return "🔵";
    case "locked":
      return "🔒";
    default:
      return "";
  }
};

const getStatusColor = (status?: TabStatus) => {
  switch (status) {
    case "complete":
      return "text-emerald-600";
    case "error":
      return "text-rose-600";
    case "in-progress":
      return "text-blue-600";
    case "locked":
      return "text-slate-400";
    default:
      return "";
  }
};

const isTabDisabled = (tab: Tab) => {
  const status = props.tabStatuses?.[tab.id];
  return tab.disabled || status === "locked";
};

const handleTabClick = (tab: Tab) => {
  if (!isTabDisabled(tab)) {
    emit("update:activeTab", tab.id);
  }
};

const handleKeyDown = (event: KeyboardEvent, currentIndex: number) => {
  let newIndex = currentIndex;
  
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    newIndex = Math.max(0, currentIndex - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    newIndex = Math.min(props.tabs.length - 1, currentIndex + 1);
  } else {
    return;
  }

  // Find next enabled tab
  while (newIndex !== currentIndex && isTabDisabled(props.tabs[newIndex])) {
    if (newIndex < currentIndex) {
      newIndex--;
      if (newIndex < 0) break;
    } else {
      newIndex++;
      if (newIndex >= props.tabs.length) break;
    }
  }

  if (newIndex >= 0 && newIndex < props.tabs.length && !isTabDisabled(props.tabs[newIndex])) {
    emit("update:activeTab", props.tabs[newIndex].id);
  }
};
</script>

<template>
  <div class="border-b border-slate-700 bg-slate-900">
    <div class="flex items-center overflow-x-auto flex-nowrap scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :class="[
          'relative px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
          activeTab === tab.id
            ? 'text-white border-b-2 border-blue-500 bg-slate-800'
            : isTabDisabled(tab)
            ? 'text-slate-500 cursor-not-allowed'
            : 'text-slate-300 hover:text-white hover:bg-slate-800',
        ]"
        :disabled="isTabDisabled(tab)"
        :aria-selected="activeTab === tab.id"
        :aria-disabled="isTabDisabled(tab)"
        role="tab"
        :tabindex="activeTab === tab.id ? 0 : -1"
        @click="handleTabClick(tab)"
        @keydown="(e) => handleKeyDown(e, index)"
      >
        <span class="flex items-center gap-2">
          <span>{{ tab.label }}</span>
          <span
            v-if="tabStatuses?.[tab.id]"
            :class="['text-xs', getStatusColor(tabStatuses[tab.id])]"
          >
            {{ getStatusIcon(tabStatuses[tab.id]) }}
          </span>
        </span>
      </button>
    </div>
  </div>
</template>

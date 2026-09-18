<script setup lang="ts">
import AppIcon from "./ui/AppIcon.vue";
import type { IconName } from "./ui/icons";
import type { Tab, TabStatus } from "./types";

/**
 * The console's tab strip. One strip now — the sub-tab rows are gone (UI-009).
 *
 * Three things were wrong with it and all three are fixed here:
 *
 * 1. **The ARIA was invalid.** It rendered `role="tab"` buttons with no `role="tablist"` around
 *    them and no `aria-controls` on any of them. An orphan tab role tells assistive tech there is
 *    a tab widget and then gives it nothing to navigate. Tabs now live in a real tablist and each
 *    one names the panel it controls; `TabPanel` renders that id.
 *
 * 2. **Status was emoji** — ✅ ❌ 🔵 🔒, rendered from whatever the OS font decides, in an app
 *    whose UI-001 §4 mandates flat line glyphs and says a stock placeholder is worse than a good
 *    drawing. They are `AppIcon` now, and colour is never the only signal: every state has a glyph
 *    and an `aria-label`.
 *
 * 3. **It invented a fourth "active" style.** The top nav underlines in accent, this underlined in
 *    `line-strong` (UI-008 §A catalogued two more). Accent underline, like the nav.
 */
const props = defineProps<{
  tabs: Tab[];
  activeTab: string;
  tabStatuses?: Record<string, TabStatus>;
}>();

const emit = defineEmits<{
  "update:activeTab": [tabId: string];
}>();

/** Every status carries a glyph and a word, so colour is never doing the work alone. */
const STATUS: Record<TabStatus, { icon: IconName; label: string; class: string } | null> = {
  complete: { icon: "check", label: "complete", class: "text-ok" },
  error: { icon: "close", label: "failed", class: "text-danger" },
  "in-progress": { icon: "gear", label: "in progress", class: "text-badge animate-spin" },
  locked: { icon: "bookmark", label: "locked", class: "text-ink-faint" },
  available: null,
};

const statusFor = (tab: Tab) => {
  const status = props.tabStatuses?.[tab.id];
  return status ? STATUS[status] : null;
};

const isTabDisabled = (tab: Tab) => tab.disabled || props.tabStatuses?.[tab.id] === "locked";

const handleTabClick = (tab: Tab) => {
  if (!isTabDisabled(tab)) emit("update:activeTab", tab.id);
};

/** Left/right move between tabs, as a tablist is expected to. */
const handleKeyDown = (event: KeyboardEvent, currentIndex: number) => {
  let newIndex = currentIndex;
  if (event.key === "ArrowLeft") newIndex = currentIndex - 1;
  else if (event.key === "ArrowRight") newIndex = currentIndex + 1;
  else if (event.key === "Home") newIndex = 0;
  else if (event.key === "End") newIndex = props.tabs.length - 1;
  else return;

  event.preventDefault();
  if (newIndex >= 0 && newIndex < props.tabs.length && !isTabDisabled(props.tabs[newIndex])) {
    emit("update:activeTab", props.tabs[newIndex].id);
  }
};
</script>

<template>
  <div class="border-b border-line-strong bg-frame">
    <div
      role="tablist"
      aria-label="Console sections"
      class="scrollbar-thin flex flex-nowrap items-center overflow-x-auto"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :id="`tab-${tab.id}`"
        role="tab"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`${tab.id}-tab`"
        :aria-disabled="isTabDisabled(tab) || undefined"
        :disabled="isTabDisabled(tab)"
        :tabindex="activeTab === tab.id ? 0 : -1"
        class="relative whitespace-nowrap px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-line-strong"
        :class="
          activeTab === tab.id
            ? 'text-[--surface]'
            : isTabDisabled(tab)
              ? 'cursor-not-allowed text-ink-soft'
              : 'text-ink-faint hover:bg-frame-tint hover:text-[--surface]'
        "
        @click="handleTabClick(tab)"
        @keydown="(e) => handleKeyDown(e, index)"
      >
        <span class="flex items-center gap-2">
          <span>{{ tab.label }}</span>
          <AppIcon
            v-if="statusFor(tab)"
            :name="statusFor(tab)!.icon"
            :size="13"
            :class="statusFor(tab)!.class"
            role="img"
            :aria-label="statusFor(tab)!.label"
          />
        </span>
        <!-- Accent underline, matching the top nav. UI-001 §3: an underline, never a fill. -->
        <span
          v-if="activeTab === tab.id"
          class="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-accent"
          aria-hidden="true"
        />
      </button>
    </div>
  </div>
</template>

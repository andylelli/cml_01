<script setup lang="ts">
import { computed } from "vue";
/**
 * KeyboardShortcutHelp
 * Overlay panel (press ? to open) showing all global keyboard shortcuts.
 */
const props = defineProps<{
  /**
   * The tab labels the Ctrl+N shortcuts actually reach, in order.
   *
   * Passed in rather than written here. This list used to be six hard-coded entries naming Project,
   * Spec and Generate; after those merged into Build (UI-003 W4) the panel was describing tabs that
   * no longer existed, against numbers that no longer matched. That is exactly the defect
   * `useShortcuts` was built to remove — a second copy of the tab list — reappearing one component
   * along, and it is why this one is derived instead.
   */
  tabLabels?: string[];
}>();

const emit = defineEmits<{
  close: [];
}>();

const shortcuts = computed<Array<{ keys: string[]; description: string; category: string }>>(() => [
  ...(props.tabLabels ?? []).map((label, i) => ({
    keys: ["Ctrl", String(i + 1)],
    description: `Go to ${label}`,
    category: "Navigation",
  })),
  { keys: ["J"], description: "Next clue / chapter", category: "Content" },
  { keys: ["K"], description: "Previous clue / chapter", category: "Content" },
  { keys: ["?"], description: "Show keyboard shortcuts", category: "General" },
  { keys: ["Esc"], description: "Close this panel", category: "General" },
]);

const categories = computed(() => [...new Set(shortcuts.value.map((s) => s.category))]);
const byCategory = (cat: string) => shortcuts.value.filter((s) => s.category === cat);
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    @click.self="emit('close')"
    @keydown.esc="emit('close')"
  >
    <div class="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-xl">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold text-ink">Keyboard Shortcuts</div>
        <button
          class="text-xs text-ink-faint hover:text-ink-soft"
          @click="emit('close')"
        >
          Close
        </button>
      </div>

      <div class="mt-4 space-y-4">
        <div v-for="cat in categories" :key="cat">
          <div class="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{{ cat }}</div>
          <div class="mt-2 space-y-1.5">
            <div
              v-for="shortcut in byCategory(cat)"
              :key="shortcut.description"
              class="flex items-center justify-between text-xs"
            >
              <span class="text-ink-soft">{{ shortcut.description }}</span>
              <div class="flex items-center gap-1">
                <kbd
                  v-for="key in shortcut.keys"
                  :key="key"
                  class="rounded border border-line bg-surface-sunken px-1.5 py-0.5 font-mono text-[11px] text-ink"
                >
                  {{ key }}
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

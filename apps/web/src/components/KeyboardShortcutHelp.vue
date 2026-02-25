<script setup lang="ts">
/**
 * KeyboardShortcutHelp
 * Overlay panel (press ? to open) showing all global keyboard shortcuts.
 */
const emit = defineEmits<{
  close: [];
}>();

const shortcuts: Array<{ keys: string[]; description: string; category: string }> = [
  // Tab navigation
  { keys: ["Ctrl", "1"], description: "Go to Project tab", category: "Navigation" },
  { keys: ["Ctrl", "2"], description: "Go to Spec tab", category: "Navigation" },
  { keys: ["Ctrl", "3"], description: "Go to Generate tab", category: "Navigation" },
  { keys: ["Ctrl", "4"], description: "Go to Review tab", category: "Navigation" },
  { keys: ["Ctrl", "5"], description: "Go to Advanced tab", category: "Navigation" },
  { keys: ["Ctrl", "6"], description: "Go to Export tab", category: "Navigation" },
  // Clue/chapter navigation
  { keys: ["J"], description: "Next clue / chapter", category: "Content" },
  { keys: ["K"], description: "Previous clue / chapter", category: "Content" },
  // Actions
  { keys: ["?"], description: "Show keyboard shortcuts", category: "General" },
  { keys: ["Esc"], description: "Close this panel", category: "General" },
];

const categories = [...new Set(shortcuts.map((s) => s.category))];
const byCategory = (cat: string) => shortcuts.filter((s) => s.category === cat);
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    @click.self="emit('close')"
    @keydown.esc="emit('close')"
  >
    <div class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
      <div class="flex items-center justify-between">
        <div class="text-sm font-semibold text-slate-800">Keyboard Shortcuts</div>
        <button
          class="text-xs text-slate-400 hover:text-slate-600"
          @click="emit('close')"
        >
          Close
        </button>
      </div>

      <div class="mt-4 space-y-4">
        <div v-for="cat in categories" :key="cat">
          <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{{ cat }}</div>
          <div class="mt-2 space-y-1.5">
            <div
              v-for="shortcut in byCategory(cat)"
              :key="shortcut.description"
              class="flex items-center justify-between text-xs"
            >
              <span class="text-slate-600">{{ shortcut.description }}</span>
              <div class="flex items-center gap-1">
                <kbd
                  v-for="key in shortcut.keys"
                  :key="key"
                  class="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] text-slate-700"
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

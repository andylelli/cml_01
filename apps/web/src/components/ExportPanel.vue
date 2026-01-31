<script setup lang="ts">
import { computed, ref } from "vue";

const props = defineProps<{
  projectId: string | null;
  available: {
    setting: boolean;
    cast: boolean;
    cml: boolean;
    clues: boolean;
    outline: boolean;
    prose: boolean;
    gamePack: boolean;
    fairPlay: boolean;
  };
}>();

const selection = ref({
  setting: true,
  cast: true,
  cml: false,
  clues: true,
  outline: true,
  prose: false,
  gamePack: false,
  fairPlay: true,
});

const canExport = computed(() =>
  Object.values(selection.value).some(Boolean) && Boolean(props.projectId),
);


import { exportArtifacts } from "../services/api";

const handleExport = async () => {
  if (!props.projectId) return;
  const typeMap: Record<string, string> = {
    setting: "setting",
    cast: "cast",
    cml: "cml",
    clues: "clues",
    outline: "outline",
    fairPlay: "fair_play_report",
    prose: "prose",
    gamePack: "game_pack",
  };
  const types = Object.entries(selection.value)
    .filter(([_, v]) => v)
    .map(([k]) => typeMap[k] ?? k);
  try {
    const blob = await exportArtifacts(props.projectId, types);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `export_${props.projectId}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  } catch (err) {
    alert("Export failed: " + (err instanceof Error ? err.message : err));
  }
};
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div class="text-sm font-semibold text-slate-700">Export</div>
    <div class="mt-2 text-xs text-slate-500">Select artifacts to include.</div>
    <div class="mt-3 space-y-2 text-sm">
      <label class="flex items-center gap-2">
        <input v-model="selection.setting" type="checkbox" />
        Setting
      </label>
      <label class="flex items-center gap-2">
        <input v-model="selection.cast" type="checkbox" />
        Cast
      </label>
      <label class="flex items-center gap-2">
        <input v-model="selection.cml" type="checkbox" :disabled="!available.cml" />
        CML (Advanced/Expert)
      </label>
      <label class="flex items-center gap-2">
        <input v-model="selection.clues" type="checkbox" />
        Clues
      </label>
      <label class="flex items-center gap-2">
        <input v-model="selection.outline" type="checkbox" />
        Outline
      </label>
      <label class="flex items-center gap-2">
        <input v-model="selection.fairPlay" type="checkbox" :disabled="!available.fairPlay" />
        Fair-play report
      </label>
      <label class="flex items-center gap-2">
        <input v-model="selection.prose" type="checkbox" :disabled="!available.prose" />
        Prose
      </label>
      <label class="flex items-center gap-2">
        <input v-model="selection.gamePack" type="checkbox" :disabled="!available.gamePack" />
        Game pack
      </label>
    </div>
    <button
      class="mt-4 w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="!canExport"
      @click="handleExport"
    >
      Export selected
    </button>
  </div>
</template>

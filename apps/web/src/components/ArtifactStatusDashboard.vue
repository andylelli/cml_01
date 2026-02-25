<script setup lang="ts">
/**
 * ArtifactStatusDashboard
 * Grid view of all artifact types with status, timestamp, quick-action buttons,
 * and dependency arrows showing what relies on what.
 */
import { computed } from "vue";

export interface ArtifactEntry {
  id: string;
  label: string;
  /** null = not generated, iso string = timestamp of last generation */
  generatedAt: string | null;
  /** Whether the artifact payload is non-empty */
  ready: boolean;
  /** Artifact IDs this one depends on */
  dependsOn: string[];
}

const props = defineProps<{
  artifacts: ArtifactEntry[];
  isRunning: boolean;
}>();

const emit = defineEmits<{
  view: [id: string];
  regenerate: [id: string];
}>();

const formatTs = (iso: string | null): string => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
};

const chipClass = (entry: ArtifactEntry) => {
  if (props.isRunning) return "bg-blue-100 text-blue-700";
  if (entry.ready) return "bg-emerald-100 text-emerald-700";
  return "bg-slate-100 text-slate-500";
};

const chipLabel = (entry: ArtifactEntry) => {
  if (props.isRunning && !entry.ready) return "Pending";
  if (entry.ready) return "Ready";
  return "Not generated";
};

/** Find unmet dependencies (deps that aren't ready yet) */
const unmetDeps = (entry: ArtifactEntry): string[] => {
  return entry.dependsOn.filter((depId) => {
    const dep = props.artifacts.find((a) => a.id === depId);
    return dep && !dep.ready;
  });
};
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="text-sm font-semibold text-slate-700">Artifact Status</div>
    <div class="mt-1 text-xs text-slate-500">All generated components and their current state.</div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="entry in artifacts"
        :key="entry.id"
        class="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
      >
        <!-- Header row -->
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-slate-700">{{ entry.label }}</span>
          <span
            class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :class="chipClass(entry)"
          >
            {{ chipLabel(entry) }}
          </span>
        </div>

        <!-- Timestamp -->
        <div class="text-[11px] text-slate-400">
          Last generated: {{ formatTs(entry.generatedAt) }}
        </div>

        <!-- Unmet dependencies warning -->
        <div v-if="unmetDeps(entry).length" class="text-[11px] text-amber-600">
          ⚠ Waiting on:
          {{ unmetDeps(entry).map((id) => artifacts.find((a) => a.id === id)?.label ?? id).join(", ") }}
        </div>

        <!-- Quick actions -->
        <div class="flex gap-2">
          <button
            v-if="entry.ready"
            class="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100"
            @click="emit('view', entry.id)"
          >
            View
          </button>
          <button
            class="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-40"
            :disabled="isRunning"
            @click="emit('regenerate', entry.id)"
          >
            Regenerate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

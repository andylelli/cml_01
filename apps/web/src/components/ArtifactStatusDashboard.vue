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
  if (props.isRunning) return "bg-surface-sunken text-frame";
  if (entry.ready) return "bg-ok-wash text-ok";
  return "bg-surface-sunken text-ink-soft";
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
  <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
    <div class="text-sm font-semibold text-ink">Artifact Status</div>
    <div class="mt-1 text-xs text-ink-soft">All generated components and their current state.</div>

    <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="entry in artifacts"
        :key="entry.id"
        class="flex flex-col gap-2 rounded-lg border border-line bg-ground p-3"
      >
        <!-- Header row -->
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-ink">{{ entry.label }}</span>
          <span
            class="rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :class="chipClass(entry)"
          >
            {{ chipLabel(entry) }}
          </span>
        </div>

        <!-- Timestamp -->
        <div class="text-[11px] text-ink-faint">
          Last generated: {{ formatTs(entry.generatedAt) }}
        </div>

        <!-- Unmet dependencies warning -->
        <div v-if="unmetDeps(entry).length" class="text-[11px] text-warn">
          ⚠ Waiting on:
          {{ unmetDeps(entry).map((id) => artifacts.find((a) => a.id === id)?.label ?? id).join(", ") }}
        </div>

        <!-- Quick actions -->
        <div class="flex gap-2">
          <button
            v-if="entry.ready"
            class="rounded border border-line bg-surface px-2 py-1 text-[11px] font-medium text-ink-soft hover:bg-surface-sunken"
            @click="emit('view', entry.id)"
          >
            View
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

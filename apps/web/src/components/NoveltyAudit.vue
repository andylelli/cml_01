<script setup lang="ts">
export interface NoveltyAuditData {
  status: "pass" | "fail" | "warn";
  seedIds?: string[];
  patterns?: Array<{
    seed: string;
    similarity: number;
    matches?: string[];
  }>;
  summary?: string;
}

const props = defineProps<{
  audit: NoveltyAuditData | null;
}>();

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pass":
      return "✅";
    case "fail":
      return "❌";
    case "warn":
      return "⚠️";
    default:
      return "•";
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case "pass":
      return "text-ok";
    case "fail":
      return "text-danger";
    case "warn":
      return "text-warn";
    default:
      return "text-ink-soft";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pass":
      return "bg-ok-wash text-ok";
    case "fail":
      return "bg-danger-wash text-danger";
    case "warn":
      return "bg-warn-wash text-warn";
    default:
      return "bg-surface-sunken text-ink";
  }
};
</script>

<template>
  <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
    <div class="text-sm font-semibold text-ink">Novelty Audit</div>
    
    <div v-if="!audit" class="mt-3 text-sm text-ink-soft">
      Novelty audit not yet run. Generate CML to check for originality.
    </div>

    <div v-else class="mt-3">
      <div class="flex items-center gap-2">
        <span :class="['text-lg', getStatusClass(audit.status)]">
          {{ getStatusIcon(audit.status) }}
        </span>
        <span
          :class="[
            'rounded px-2 py-0.5 text-xs font-semibold uppercase',
            getStatusBadge(audit.status),
          ]"
        >
          {{ audit.status }}
        </span>
      </div>

      <p v-if="audit.summary" class="mt-2 text-sm text-ink-soft">
        {{ audit.summary }}
      </p>

      <div v-if="audit.seedIds?.length" class="mt-3">
        <div class="text-xs font-semibold text-ink-soft">Seeds Checked:</div>
        <div class="mt-1 flex flex-wrap gap-1">
          <span
            v-for="seedId in audit.seedIds"
            :key="seedId"
            class="rounded bg-surface-sunken px-2 py-0.5 text-xs text-ink"
          >
            {{ seedId }}
          </span>
        </div>
      </div>

      <div v-if="audit.patterns?.length" class="mt-3 space-y-2">
        <div class="text-xs font-semibold text-ink-soft">Pattern Matches:</div>
        <div
          v-for="(pattern, idx) in audit.patterns"
          :key="idx"
          class="rounded border border-line bg-ground px-3 py-2"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-ink">{{ pattern.seed }}</span>
            <span
              :class="[
                'rounded px-2 py-0.5 text-xs font-semibold',
                pattern.similarity > 0.7
                  ? 'bg-danger-wash text-danger'
                  : pattern.similarity > 0.4
                    ? 'bg-warn-wash text-warn'
                    : 'bg-ok-wash text-ok',
              ]"
            >
              {{ Math.round(pattern.similarity * 100) }}% similar
            </span>
          </div>
          <ul v-if="pattern.matches?.length" class="mt-2 list-disc space-y-1 pl-4 text-xs text-ink-soft">
            <li v-for="(match, mIdx) in pattern.matches" :key="mIdx">{{ match }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

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
      return "text-emerald-600";
    case "fail":
      return "text-rose-600";
    case "warn":
      return "text-amber-600";
    default:
      return "text-slate-600";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pass":
      return "bg-emerald-100 text-emerald-700";
    case "fail":
      return "bg-rose-100 text-rose-700";
    case "warn":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <div class="text-sm font-semibold text-slate-700">Novelty Audit</div>
    
    <div v-if="!audit" class="mt-3 text-sm text-slate-600">
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

      <p v-if="audit.summary" class="mt-2 text-sm text-slate-600">
        {{ audit.summary }}
      </p>

      <div v-if="audit.seedIds?.length" class="mt-3">
        <div class="text-xs font-semibold text-slate-500">Seeds Checked:</div>
        <div class="mt-1 flex flex-wrap gap-1">
          <span
            v-for="seedId in audit.seedIds"
            :key="seedId"
            class="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700"
          >
            {{ seedId }}
          </span>
        </div>
      </div>

      <div v-if="audit.patterns?.length" class="mt-3 space-y-2">
        <div class="text-xs font-semibold text-slate-500">Pattern Matches:</div>
        <div
          v-for="(pattern, idx) in audit.patterns"
          :key="idx"
          class="rounded border border-slate-200 bg-slate-50 px-3 py-2"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-700">{{ pattern.seed }}</span>
            <span
              :class="[
                'rounded px-2 py-0.5 text-xs font-semibold',
                pattern.similarity > 0.7
                  ? 'bg-rose-100 text-rose-700'
                  : pattern.similarity > 0.4
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700',
              ]"
            >
              {{ Math.round(pattern.similarity * 100) }}% similar
            </span>
          </div>
          <ul v-if="pattern.matches?.length" class="mt-2 list-disc space-y-1 pl-4 text-xs text-slate-600">
            <li v-for="(match, mIdx) in pattern.matches" :key="mIdx">{{ match }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

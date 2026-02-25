<script setup lang="ts">
import type { GenerationReport } from "./types";

const props = defineProps<{
  report: GenerationReport | null;
}>();

const gradeColors: Record<string, string> = {
  A: "border-emerald-300 bg-emerald-50 text-emerald-700",
  B: "border-blue-300 bg-blue-50 text-blue-700",
  C: "border-amber-300 bg-amber-50 text-amber-700",
  D: "border-orange-300 bg-orange-50 text-orange-700",
  F: "border-rose-300 bg-rose-50 text-rose-700",
};

const scoreFill = (score: number) => {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 80) return "bg-blue-500";
  if (score >= 70) return "bg-amber-500";
  if (score >= 60) return "bg-orange-500";
  return "bg-rose-500";
};

const gradeColor = (grade: string) => gradeColors[grade] ?? gradeColors["F"];

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
};

const exportJson = () => {
  if (!props.report) return;
  const json = JSON.stringify(props.report, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `quality-report-${props.report.run_id ?? "export"}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const phaseLabel = (agent: string) => {
  const map: Record<string, string> = {
    agent1_setting: "Setting Refinement",
    agent2_cast: "Cast Design",
    agent2b_character_profiles: "Character Profiles",
    agent2c_location_profiles: "Location Profiles",
    agent2d_temporal_context: "Temporal Context",
    agent2e_background_context: "Background Context",
    agent4_hard_logic: "Hard Logic",
    agent7_narrative: "Narrative Outline",
    agent9_prose: "Prose Generation",
    // alternate name forms
    "agent1-setting": "Setting Refinement",
    "agent2-cast": "Cast Design",
    "agent2b-character-profiles": "Character Profiles",
    "agent2c-location-profiles": "Location Profiles",
    "agent2d-temporal-context": "Temporal Context",
    "agent2e-background-context": "Background Context",
    "agent4-hard-logic": "Hard Logic",
    "agent7-narrative": "Narrative Outline",
    "agent9-prose": "Prose Generation",
  };
  return map[agent] ?? agent;
};
</script>

<template>
  <div v-if="!report" class="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
    <div class="text-base font-semibold text-slate-600">No quality report available</div>
    <div class="mt-2">Quality reports are generated when <code class="rounded bg-slate-200 px-1 py-0.5 text-xs">ENABLE_SCORING=true</code> is set.</div>
    <div class="mt-1 text-xs text-slate-400">Run generation with scoring enabled to see phase-by-phase quality metrics.</div>
  </div>

  <div v-else class="space-y-4">
    <!-- Header row: grade badge + status -->
    <div class="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <div class="text-sm font-semibold text-slate-700">Generation Quality Report</div>
        <div class="mt-1 text-xs text-slate-500">{{ formatDate(report.generated_at) }}</div>
        <div class="mt-1 text-xs text-slate-500">Mode: <span class="font-medium capitalize">{{ report.threshold_config.mode }}</span></div>
      </div>
      <div class="flex items-center gap-3">
        <!-- Large grade badge -->
        <div
          class="flex h-16 w-16 flex-col items-center justify-center rounded-xl border-2 font-bold"
          :class="gradeColor(report.overall_grade)"
        >
          <span class="text-2xl leading-none">{{ report.overall_grade }}</span>
          <span class="text-xs font-semibold opacity-80">{{ Math.round(report.overall_score) }}/100</span>
        </div>
        <!-- Pass/fail badge -->
        <span
          class="rounded-full px-3 py-1.5 text-sm font-semibold"
          :class="report.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
        >
          {{ report.passed ? "✓ Passed" : "✗ Failed" }}
        </span>
        <!-- Export button -->
        <button
          class="rounded border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          title="Export quality report as JSON"
          @click="exportJson"
        >
          ⬇ Export JSON
        </button>
      </div>
    </div>

    <!-- Score bar -->
    <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div class="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
        <span>Overall Score</span>
        <span>{{ Math.round(report.overall_score) }} / 100</span>
      </div>
      <div class="h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="scoreFill(report.overall_score)"
          :style="{ width: `${Math.min(100, report.overall_score)}%` }"
        ></div>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div class="text-xs text-slate-500">Phases</div>
        <div class="mt-1 text-sm font-semibold text-slate-800">
          <span class="text-emerald-600">{{ report.summary.phases_passed }}✓</span>
          <span class="mx-1 text-slate-300">/</span>
          <span v-if="report.summary.phases_failed > 0" class="text-rose-600">{{ report.summary.phases_failed }}✗</span>
          <span v-else class="text-slate-400">0✗</span>
        </div>
        <div class="mt-0.5 text-[11px] text-slate-400">of {{ report.summary.total_phases }} total</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div class="text-xs text-slate-500">Pass rate</div>
        <div class="mt-1 text-sm font-semibold text-slate-800">{{ report.summary.pass_rate }}%</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div class="text-xs text-slate-500">Duration</div>
        <div class="mt-1 text-sm font-semibold text-slate-800">{{ formatDuration(report.total_duration_ms) }}</div>
      </div>
      <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div class="text-xs text-slate-500">Cost</div>
        <div class="mt-1 text-sm font-semibold text-slate-800">${{ report.total_cost.toFixed(3) }}</div>
      </div>
    </div>

    <!-- Weakest / strongest / retries -->
    <div class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div class="flex flex-wrap gap-x-6 gap-y-2 text-xs">
        <div v-if="report.summary.weakest_phase">
          <span class="text-slate-400">Weakest phase:</span>
          <span class="ml-1 font-semibold text-rose-600">{{ phaseLabel(report.summary.weakest_phase) }}</span>
        </div>
        <div v-if="report.summary.strongest_phase">
          <span class="text-slate-400">Strongest phase:</span>
          <span class="ml-1 font-semibold text-emerald-600">{{ phaseLabel(report.summary.strongest_phase) }}</span>
        </div>
        <div v-if="report.summary.retry_stats.total_retries > 0">
          <span class="text-slate-400">Retries:</span>
          <span class="ml-1 font-semibold text-amber-600">
            {{ report.summary.retry_stats.total_retries }} across {{ report.summary.retry_stats.phases_retried }} phase(s)
          </span>
        </div>
        <div v-else>
          <span class="text-slate-400">Retries:</span>
          <span class="ml-1 text-emerald-600">None needed</span>
        </div>
      </div>
    </div>
  </div>
</template>

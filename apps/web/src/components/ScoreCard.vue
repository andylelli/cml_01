<script setup lang="ts">
import type { GenerationReport } from "./types";

const props = defineProps<{
  report: GenerationReport | null;
  loading?: boolean;
}>();

const gradeColors: Record<string, string> = {
  A: "border-ok bg-ok-wash text-ok",
  B: "border-line-strong bg-surface-sunken text-frame",
  C: "border-warn bg-warn-wash text-warn",
  D: "border-warn bg-warn-wash text-warn",
  F: "border-danger bg-danger-wash text-danger",
};

const scoreFill = (score: number) => {
  if (score >= 90) return "bg-ok";
  if (score >= 80) return "bg-frame";
  if (score >= 70) return "bg-warn";
  if (score >= 60) return "bg-warn";
  return "bg-danger";
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
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const normalizeAgentId = (agent: string) => agent.toLowerCase().replace(/-/g, "_");

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
  };
  const normalized = normalizeAgentId(agent);
  return map[normalized] ?? agent;
};

const getRunOutcome = (
  report: GenerationReport,
): "passed" | "failed" | "aborted" | "infra_failure" | "in_progress" => {
  if (
    report.run_outcome === "passed"
    || report.run_outcome === "failed"
    || report.run_outcome === "aborted"
    || report.run_outcome === "infra_failure"
    // A_71: a live snapshot names itself rather than borrowing the verdict of the phases
    // that happen to have finished.
    || report.run_outcome === "in_progress"
  ) {
    return report.run_outcome;
  }
  return report.passed ? "passed" : "failed";
};

const runOutcomeLabel = (report: GenerationReport) => {
  const outcome = getRunOutcome(report);
  if (outcome === "passed") return "✓ Passed";
  if (outcome === "in_progress") return "◷ In Progress";
  if (outcome === "infra_failure") return "⚠ Infra Failure";
  if (outcome === "aborted") return "■ Aborted";
  return "✗ Failed";
};

const runOutcomeClass = (report: GenerationReport) => {
  const outcome = getRunOutcome(report);
  if (outcome === "passed") return "bg-ok-wash text-ok";
  if (outcome === "in_progress") return "bg-surface-sunken text-frame";
  if (outcome === "infra_failure") return "bg-surface-sunken text-ink";
  if (outcome === "aborted") return "bg-warn-wash text-warn";
  return "bg-danger-wash text-danger";
};
</script>

<template>
  <div v-if="!report || !report.summary" class="rounded-lg border border-line bg-ground p-6 text-center text-sm text-ink-soft">
    <div class="text-base font-semibold text-ink-soft">No quality report available</div>
    <div class="mt-2">Quality reports are generated when <code class="rounded bg-surface-sunken px-1 py-0.5 text-xs">ENABLE_SCORING=true</code> is set.</div>
    <div class="mt-1 text-xs text-ink-faint">Run generation with scoring enabled to see phase-by-phase quality metrics.</div>
  </div>

  <div v-else class="space-y-4">
    <!-- Header row: grade badge + status -->
    <div class="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-line bg-surface p-5 shadow-sm">
      <div>
        <div class="flex items-center justify-between">
          <div class="text-sm font-semibold text-ink">Generation Quality Report</div>
          <span v-if="loading" class="text-xs text-ink-faint animate-pulse">Refreshing…</span>
        </div>
        <div class="mt-1 text-xs text-ink-soft">{{ formatDate(report.generated_at) }}</div>
        <div class="mt-1 text-xs text-ink-soft">Mode: <span class="font-medium capitalize">{{ report.threshold_config.mode }}</span></div>
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
          :class="runOutcomeClass(report)"
        >
          {{ runOutcomeLabel(report) }}
        </span>
        <!-- Export button -->
        <button
          class="rounded border border-line bg-surface px-2.5 py-1.5 text-xs font-medium text-ink-soft hover:bg-ground hover:border-line-strong"
          title="Export quality report as JSON"
          @click="exportJson"
        >
          ⬇ Export JSON
        </button>
      </div>
    </div>

    <!-- Score bar -->
    <div class="rounded-lg border border-line bg-surface p-5 shadow-sm">
      <div class="mb-1 flex items-center justify-between text-xs font-semibold text-ink-soft">
        <span>Overall Score</span>
        <span>{{ Math.round(report.overall_score) }} / 100</span>
      </div>
      <div class="h-3 w-full overflow-hidden rounded-full bg-surface-sunken">
        <div
          class="h-full rounded-full transition-all duration-500"
          :class="scoreFill(report.overall_score)"
          :style="{ width: `${Math.min(100, report.overall_score)}%` }"
        ></div>
      </div>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
        <div class="text-xs text-ink-soft">Phases</div>
        <div class="mt-1 text-sm font-semibold text-ink">
          <span class="text-ok">{{ report.summary.phases_passed }}✓</span>
          <span class="mx-1 text-ink-faint">/</span>
          <span v-if="report.summary.phases_failed > 0" class="text-danger">{{ report.summary.phases_failed }}✗</span>
          <span v-else class="text-ink-faint">0✗</span>
        </div>
        <div class="mt-0.5 text-[11px] text-ink-faint">of {{ report.summary.total_phases }} total</div>
      </div>
      <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
        <div class="text-xs text-ink-soft">Pass rate</div>
        <div class="mt-1 text-sm font-semibold text-ink">{{ report.summary.pass_rate }}%</div>
      </div>
      <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
        <div class="text-xs text-ink-soft">Duration</div>
        <div class="mt-1 text-sm font-semibold text-ink">{{ formatDuration(report.total_duration_ms) }}</div>
      </div>
      <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
        <div class="text-xs text-ink-soft">Cost (GBP)</div>
        <!--
          A_73 §24 — this printed `$` on a number the tracker computes in POUNDS.
          `CostTracker`'s rate table is USD list pricing pre-multiplied by 0.79 (cost-tracker.ts),
          so every run's cost was displayed in the wrong currency and ~27% low, to three decimals
          of false precision. The value was always right; only the symbol was wrong, and the unit
          lives in a comment in another package — see A_73 §20.1.
        -->
        <div class="mt-1 text-sm font-semibold text-ink">£{{ report.total_cost.toFixed(3) }}</div>
      </div>
    </div>

    <!-- Weakest / strongest / retries -->
    <div class="rounded-lg border border-line bg-surface p-4 shadow-sm">
      <div class="flex flex-wrap gap-x-6 gap-y-2 text-xs">
        <div v-if="report.summary.weakest_phase">
          <span class="text-ink-faint">Weakest phase:</span>
          <span class="ml-1 font-semibold text-danger">{{ phaseLabel(report.summary.weakest_phase) }}</span>
        </div>
        <div v-if="report.summary.strongest_phase">
          <span class="text-ink-faint">Strongest phase:</span>
          <span class="ml-1 font-semibold text-ok">{{ phaseLabel(report.summary.strongest_phase) }}</span>
        </div>
        <div v-if="report.summary.retry_stats.total_retries > 0">
          <span class="text-ink-faint">Retries:</span>
          <span class="ml-1 font-semibold text-warn">
            {{ report.summary.retry_stats.total_retries }} across {{ report.summary.retry_stats.phases_retried }} phase(s)
          </span>
        </div>
        <div v-else>
          <span class="text-ink-faint">Retries:</span>
          <span class="ml-1 text-ok">None needed</span>
        </div>
      </div>
    </div>
  </div>
</template>

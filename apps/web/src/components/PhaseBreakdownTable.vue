<script setup lang="ts">
import { ref } from "vue";
import type { ScoringPhaseReport, ScoringTestResult } from "./types";

const props = defineProps<{
  phases: ScoringPhaseReport[];
}>();

const expandedPhase = ref<string | null>(null);

const togglePhase = (agent: string) => {
  expandedPhase.value = expandedPhase.value === agent ? null : agent;
};

const gradeColors: Record<string, string> = {
  A: "bg-emerald-100 text-emerald-700",
  B: "bg-blue-100 text-blue-700",
  C: "bg-amber-100 text-amber-700",
  D: "bg-orange-100 text-orange-700",
  F: "bg-rose-100 text-rose-700",
};

const scoreBarColor = (score: number) => {
  if (score >= 90) return "bg-emerald-500";
  if (score >= 80) return "bg-blue-500";
  if (score >= 70) return "bg-amber-500";
  if (score >= 60) return "bg-orange-400";
  return "bg-rose-500";
};

const gradeColor = (grade: string) => gradeColors[grade] ?? gradeColors["F"];

const categoryLabel = (cat: string) => {
  const labels: Record<string, string> = {
    validation: "Validation",
    quality: "Quality",
    completeness: "Completeness",
    consistency: "Consistency",
  };
  return labels[cat] ?? cat;
};

const categoryWeight = (cat: string) => {
  const weights: Record<string, string> = {
    validation: "40%",
    quality: "30%",
    completeness: "20%",
    consistency: "10%",
  };
  return weights[cat] ?? "";
};

const COMPONENT_MINIMUMS: Record<string, number> = {
  validation: 60,
  quality: 50,
  completeness: 60,
  consistency: 50,
};

const componentScore = (phase: ScoringPhaseReport, cat: string): number => {
  const key = `${cat}_score` as keyof typeof phase.score;
  return (phase.score[key] as number) ?? 0;
};

const componentPasses = (phase: ScoringPhaseReport, cat: string): boolean => {
  return componentScore(phase, cat) >= (COMPONENT_MINIMUMS[cat] ?? 0);
};

const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  const secs = Math.round(ms / 1000);
  if (secs < 60) return `${secs}s`;
  const mins = Math.floor(secs / 60);
  const rem = secs % 60;
  return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
};

const testsForCategory = (tests: ScoringTestResult[], cat: string) =>
  tests.filter((t) => t.category === cat);

const severityClass = (severity?: string) => {
  switch (severity) {
    case "critical": return "text-rose-600";
    case "major": return "text-orange-600";
    case "moderate": return "text-amber-600";
    case "minor": return "text-slate-500";
    default: return "text-slate-600";
  }
};
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="border-b border-slate-100 px-5 py-3">
      <div class="text-sm font-semibold text-slate-700">Phase Breakdown</div>
      <div class="mt-0.5 text-xs text-slate-500">Click any row to expand details</div>
    </div>

    <div v-if="!phases.length" class="p-6 text-center text-sm text-slate-500">
      No phase data available.
    </div>

    <div v-else class="divide-y divide-slate-100">
      <div v-for="phase in phases" :key="phase.agent">
        <!-- Phase row (clickable) -->
        <button
          class="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-slate-50 transition-colors"
          :class="expandedPhase === phase.agent ? 'bg-slate-50' : ''"
          @click="togglePhase(phase.agent)"
        >
          <!-- Pass/fail indicator -->
          <span class="flex-shrink-0 text-base" :class="phase.passed ? 'text-emerald-500' : 'text-rose-500'">
            {{ phase.passed ? "✓" : "✗" }}
          </span>

          <!-- Phase name -->
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium text-slate-800">{{ phase.phase_name }}</div>
            <div class="mt-0.5 flex items-center gap-2">
              <!-- Mini score bar -->
              <div class="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                <div
                  class="h-full rounded-full"
                  :class="scoreBarColor(phase.score.total)"
                  :style="{ width: `${phase.score.total}%` }"
                ></div>
              </div>
              <span class="text-xs text-slate-500">{{ phase.score.total }}/100</span>
              <!-- Component pills: V Q C Co -->
              <span class="flex items-center gap-0.5 ml-1">
                <span
                  v-for="[abbr, cat] in [['V','validation'],['Q','quality'],['C','completeness'],['Co','consistency']]"
                  :key="cat"
                  class="rounded px-1 py-0.5 text-[10px] font-bold leading-none"
                  :class="componentPasses(phase, cat)
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-rose-100 text-rose-600'"
                  :title="`${categoryLabel(cat)}: ${Math.round(componentScore(phase, cat))}/100 (min ${COMPONENT_MINIMUMS[cat]})`"
                >
                  {{ abbr }}
                </span>
              </span>
              <span v-if="phase.retry_count && phase.retry_count > 0" class="text-[11px] text-amber-600">
                ↻ {{ phase.retry_count }} retry{{ phase.retry_count > 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <!-- Grade badge -->
          <span
            class="flex-shrink-0 rounded px-2 py-0.5 text-xs font-bold"
            :class="gradeColor(phase.score.grade)"
          >
            {{ phase.score.grade }}
          </span>

          <!-- Duration -->
          <span class="flex-shrink-0 w-16 text-right text-xs text-slate-400">{{ formatDuration(phase.duration_ms) }}</span>

          <!-- Cost -->
          <span class="flex-shrink-0 w-16 text-right text-xs text-slate-400">${{ phase.cost.toFixed(3) }}</span>

          <!-- Expand chevron -->
          <span class="flex-shrink-0 text-slate-400 text-xs">{{ expandedPhase === phase.agent ? "▼" : "▶" }}</span>
        </button>

        <!-- Expanded detail panel -->
        <div v-if="expandedPhase === phase.agent" class="border-t border-slate-100 bg-slate-50 px-5 py-4 space-y-4">

          <!-- Component scores -->
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">Category Scores</div>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div
                v-for="cat in ['validation', 'quality', 'completeness', 'consistency']"
                :key="cat"
                class="rounded-md border p-2"
                :class="componentPasses(phase, cat)
                  ? 'border-slate-200 bg-white'
                  : 'border-rose-200 bg-rose-50'"
              >
                <div class="text-[11px] text-slate-500">{{ categoryLabel(cat) }} <span class="text-slate-400">({{ categoryWeight(cat) }})</span></div>
                <div class="mt-1 flex items-center gap-1">
                  <span
                    class="text-sm font-bold"
                    :class="componentPasses(phase, cat) ? 'text-slate-800' : 'text-rose-700'"
                  >
                    {{ componentScore(phase, cat) }}
                  </span>
                  <span class="text-[11px] text-slate-400">/ 100</span>
                  <span
                    v-if="!componentPasses(phase, cat)"
                    class="ml-1 text-[10px] text-rose-600 font-semibold"
                  >
                    ✗ min {{ COMPONENT_MINIMUMS[cat] }}
                  </span>
                </div>
                <div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    class="h-full rounded-full"
                    :class="scoreBarColor(componentScore(phase, cat))"
                    :style="{ width: `${componentScore(phase, cat)}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Component failure reason -->
            <div v-if="phase.score.component_failures?.length" class="mt-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              <span class="font-semibold">Failed:</span> {{ phase.score.failure_reason }}
            </div>
          </div>

          <!-- Test results by category -->
          <div v-for="cat in ['validation', 'quality', 'completeness', 'consistency']" :key="`tests-${cat}`">
            <div v-if="testsForCategory(phase.tests, cat).length" class="space-y-1">
              <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{{ categoryLabel(cat) }} Tests</div>
              <div
                v-for="test in testsForCategory(phase.tests, cat)"
                :key="test.name"
                class="flex items-start gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-xs"
              >
                <span :class="test.passed ? 'text-emerald-500' : 'text-rose-500'" class="flex-shrink-0 font-bold">
                  {{ test.passed ? "✓" : "✗" }}
                </span>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-slate-700">{{ test.name }}</div>
                  <div v-if="test.message" class="mt-0.5" :class="severityClass(test.severity)">{{ test.message }}</div>
                </div>
                <span class="flex-shrink-0 text-slate-500">{{ test.score }}/100</span>
              </div>
            </div>
          </div>

          <!-- Retry history -->
          <div v-if="phase.retry_history?.length">
            <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Retry History</div>
            <div class="space-y-1">
              <div
                v-for="attempt in phase.retry_history"
                :key="attempt.attempt"
                class="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
              >
                <span class="font-semibold">Attempt {{ attempt.attempt }}:</span>
                {{ attempt.reason }}
                <span v-if="attempt.score_before !== undefined" class="ml-2 text-amber-600">(score: {{ attempt.score_before }})</span>
              </div>
            </div>
          </div>

          <!-- Errors -->
          <div v-if="phase.errors?.length">
            <div class="text-[11px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Errors</div>
            <ul class="space-y-1">
              <li
                v-for="(err, idx) in phase.errors"
                :key="idx"
                class="rounded-md border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700"
              >
                {{ err }}
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

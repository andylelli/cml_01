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
  A: "bg-ok-wash text-ok",
  B: "bg-surface-sunken text-frame",
  C: "bg-warn-wash text-warn",
  D: "bg-warn-wash text-warn",
  F: "bg-danger-wash text-danger",
};

const scoreBarColor = (score: number) => {
  if (score >= 90) return "bg-ok";
  if (score >= 80) return "bg-frame";
  if (score >= 70) return "bg-warn";
  if (score >= 60) return "bg-warn";
  return "bg-danger";
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

type ChapterScoreRow = {
  chapter: number;
  total_chapters: number;
  individual_score: number;
  cumulative_score: number;
  individual_validation_score?: number;
  individual_quality_score?: number;
  individual_completeness_score?: number;
  individual_consistency_score?: number;
  cumulative_validation_score?: number;
  cumulative_quality_score?: number;
  cumulative_completeness_score?: number;
  cumulative_consistency_score?: number;
};

const normalizeAgentId = (agent: string) => (agent || "").toLowerCase().replace(/-/g, "_");

const readChapterScoreSeries = (
  phase: ScoringPhaseReport,
  keys: string[],
): ChapterScoreRow[] => {
  const breakdown = (phase.score as any)?.breakdown ?? {};
  for (const key of keys) {
    const value = breakdown?.[key];
    if (Array.isArray(value)) {
      return value as ChapterScoreRow[];
    }
  }
  return [];
};

const getChapterScores = (phase: ScoringPhaseReport): ChapterScoreRow[] =>
  readChapterScoreSeries(phase, ["chapter_scores", "first_pass_chapter_scores"]);

const getRepairChapterScores = (phase: ScoringPhaseReport): ChapterScoreRow[] =>
  readChapterScoreSeries(phase, ["repair_chapter_scores", "second_run_chapter_scores"]);

const isProsePhase = (phase: ScoringPhaseReport): boolean => {
  return normalizeAgentId(phase.agent) === "agent9_prose";
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
    case "critical": return "text-danger";
    case "major": return "text-warn";
    case "moderate": return "text-warn";
    case "minor": return "text-ink-soft";
    default: return "text-ink-soft";
  }
};

const chapterComponentMinimum = (component: string): number => COMPONENT_MINIMUMS[component] ?? 0;

const chapterComponentPassClass = (score: number | undefined, component: string): string => {
  const value = score ?? 0;
  return value >= chapterComponentMinimum(component)
    ? 'text-ok'
    : 'text-danger';
};
</script>

<template>
  <div class="rounded-lg border border-line bg-surface shadow-sm">
    <div class="border-b border-line px-5 py-3">
      <div class="text-sm font-semibold text-ink">Phase Breakdown</div>
      <div class="mt-0.5 text-xs text-ink-soft">Click any row to expand details</div>
    </div>

    <div v-if="!phases.length" class="p-6 text-center text-sm text-ink-soft">
      No phase data available.
    </div>

    <div v-else class="divide-y divide-line">
      <div v-for="phase in phases" :key="phase.agent">
        <!-- Phase row (clickable) -->
        <button
          class="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-ground transition-colors"
          :class="expandedPhase === phase.agent ? 'bg-ground' : ''"
          @click="togglePhase(phase.agent)"
        >
          <!-- Pass/fail indicator -->
          <span class="flex-shrink-0 text-base" :class="phase.passed ? 'text-ok' : 'text-danger'">
            {{ phase.passed ? "✓" : "✗" }}
          </span>

          <!-- Phase name -->
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium text-ink">{{ phase.phase_name }}</div>
            <div class="mt-0.5 flex items-center gap-2">
              <!-- Mini score bar -->
              <div class="h-1.5 w-24 overflow-hidden rounded-full bg-surface-sunken">
                <div
                  class="h-full rounded-full"
                  :class="scoreBarColor(phase.score.total)"
                  :style="{ width: `${phase.score.total}%` }"
                ></div>
              </div>
              <span class="text-xs text-ink-soft">{{ phase.score.total }}/100</span>
              <!-- Component pills: V Q C Co -->
              <span class="flex items-center gap-0.5 ml-1">
                <span
                  v-for="[abbr, cat] in [['V','validation'],['Q','quality'],['C','completeness'],['Co','consistency']]"
                  :key="cat"
                  class="rounded px-1 py-0.5 text-[10px] font-bold leading-none"
                  :class="componentPasses(phase, cat)
                    ? 'bg-ok-wash text-ok'
                    : 'bg-danger-wash text-danger'"
                  :title="`${categoryLabel(cat)}: ${Math.round(componentScore(phase, cat))}/100 (min ${COMPONENT_MINIMUMS[cat]})`"
                >
                  {{ abbr }}
                </span>
              </span>
              <span v-if="phase.retry_count && phase.retry_count > 0" class="text-[11px] text-warn">
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
          <span class="flex-shrink-0 w-16 text-right text-xs text-ink-faint">{{ formatDuration(phase.duration_ms) }}</span>

          <!-- Cost -->
          <span class="flex-shrink-0 w-16 text-right text-xs text-ink-faint">${{ phase.cost.toFixed(3) }}</span>

          <!-- Expand chevron -->
          <span class="flex-shrink-0 text-ink-faint text-xs">{{ expandedPhase === phase.agent ? "▼" : "▶" }}</span>
        </button>

        <!-- Expanded detail panel -->
        <div v-if="expandedPhase === phase.agent" class="border-t border-line bg-ground px-5 py-4 space-y-4">

          <!-- Component scores -->
          <div>
            <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">Category Scores</div>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div
                v-for="cat in ['validation', 'quality', 'completeness', 'consistency']"
                :key="cat"
                class="rounded-md border p-2"
                :class="componentPasses(phase, cat)
                  ? 'border-line bg-surface'
                  : 'border-danger bg-danger-wash'"
              >
                <div class="text-[11px] text-ink-soft">{{ categoryLabel(cat) }} <span class="text-ink-faint">({{ categoryWeight(cat) }})</span></div>
                <div class="mt-1 flex items-center gap-1">
                  <span
                    class="text-sm font-bold"
                    :class="componentPasses(phase, cat) ? 'text-ink' : 'text-danger'"
                  >
                    {{ componentScore(phase, cat) }}
                  </span>
                  <span class="text-[11px] text-ink-faint">/ 100</span>
                  <span
                    v-if="!componentPasses(phase, cat)"
                    class="ml-1 text-[10px] text-danger font-semibold"
                  >
                    ✗ min {{ COMPONENT_MINIMUMS[cat] }}
                  </span>
                </div>
                <div class="mt-1 h-1 w-full overflow-hidden rounded-full bg-surface-sunken">
                  <div
                    class="h-full rounded-full"
                    :class="scoreBarColor(componentScore(phase, cat))"
                    :style="{ width: `${componentScore(phase, cat)}%` }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Component failure reason -->
            <div v-if="phase.score.component_failures?.length" class="mt-2 rounded-md border border-danger bg-danger-wash px-3 py-2 text-xs text-danger">
              <span class="font-semibold">Failed:</span> {{ phase.score.failure_reason }}
            </div>
          </div>

          <!-- Test results by category -->
          <div v-for="cat in ['validation', 'quality', 'completeness', 'consistency']" :key="`tests-${cat}`">
            <div v-if="testsForCategory(phase.tests, cat).length" class="space-y-1">
              <div class="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{{ categoryLabel(cat) }} Tests</div>
              <div
                v-for="test in testsForCategory(phase.tests, cat)"
                :key="test.name"
                class="flex items-start gap-2 rounded-md border border-line bg-surface px-3 py-2 text-xs"
              >
                <span :class="test.passed ? 'text-ok' : 'text-danger'" class="flex-shrink-0 font-bold">
                  {{ test.passed ? "✓" : "✗" }}
                </span>
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-ink">{{ test.name }}</div>
                  <div v-if="test.message" class="mt-0.5" :class="severityClass(test.severity)">{{ test.message }}</div>
                </div>
                <span class="flex-shrink-0 text-ink-soft">{{ test.score }}/100</span>
              </div>
            </div>
          </div>

          <!-- Retry history -->
          <div v-if="phase.retry_history?.length">
            <div class="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-1">Retry History</div>
            <div class="space-y-1">
              <div
                v-for="attempt in phase.retry_history"
                :key="attempt.attempt"
                class="rounded-md border border-warn bg-warn-wash px-3 py-2 text-xs text-warn"
              >
                <span class="font-semibold">Attempt {{ attempt.attempt }}:</span>
                {{ attempt.reason }}
                <span v-if="attempt.score_before !== undefined" class="ml-2 text-warn">(score: {{ attempt.score_before }})</span>
              </div>
            </div>
          </div>

          <!-- Chapter-by-chapter breakdown (prose phase only) -->
          <div v-if="isProsePhase(phase) && getChapterScores(phase).length">
            <div class="text-xs font-semibold uppercase tracking-wide text-ink-soft mb-2">Chapter Quality Scores</div>
            <div class="mb-2 text-[11px] text-ink-faint">Component columns: V=Validation, Q=Quality, C=Completeness, Co=Consistency</div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr class="text-left text-ink-faint border-b border-line">
                    <th class="pb-1 pr-4 font-medium">Chapter</th>
                    <th class="pb-1 pr-4 font-medium">Individual</th>
                    <th class="pb-1 pr-4 font-medium">Cumulative</th>
                    <th class="pb-1 pr-4 font-medium">V</th>
                    <th class="pb-1 pr-4 font-medium">Q</th>
                    <th class="pb-1 pr-4 font-medium">C</th>
                    <th class="pb-1 pr-4 font-medium">Co</th>
                    <th class="pb-1 font-medium w-32">Cumulative bar</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-line">
                  <tr
                    v-for="ch in getChapterScores(phase)"
                    :key="`first-${ch.chapter}`"
                  >
                    <td class="pr-4 py-1 text-ink-soft font-medium">
                      {{ ch.chapter }}/{{ ch.total_chapters }}
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="ch.individual_score >= 80 ? 'text-ok' : ch.individual_score >= 70 ? 'text-warn' : 'text-danger'"
                      >
                        {{ ch.individual_score }}/100
                      </span>
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="ch.cumulative_score >= 80 ? 'text-ok' : ch.cumulative_score >= 70 ? 'text-warn' : 'text-danger'"
                      >
                        {{ ch.cumulative_score }}/100
                      </span>
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="chapterComponentPassClass(ch.individual_validation_score, 'validation')"
                      >
                        {{ ch.individual_validation_score ?? '-' }}
                      </span>
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="chapterComponentPassClass(ch.individual_quality_score, 'quality')"
                      >
                        {{ ch.individual_quality_score ?? '-' }}
                      </span>
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="chapterComponentPassClass(ch.individual_completeness_score, 'completeness')"
                      >
                        {{ ch.individual_completeness_score ?? '-' }}
                      </span>
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="chapterComponentPassClass(ch.individual_consistency_score, 'consistency')"
                      >
                        {{ ch.individual_consistency_score ?? '-' }}
                      </span>
                    </td>
                    <td class="py-1 w-32">
                      <div class="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                        <div
                          class="h-full rounded-full"
                          :class="scoreBarColor(ch.cumulative_score)"
                          :style="{ width: `${ch.cumulative_score}%` }"
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Chapter-by-chapter breakdown (repair prose run) -->
          <div v-if="isProsePhase(phase) && getRepairChapterScores(phase).length" class="mt-2">
            <div class="text-xs font-semibold uppercase tracking-wide text-warn mb-2">Chapter Quality Scores — Second Run</div>
            <div class="mb-2 text-[11px] text-ink-faint">Component columns: V=Validation, Q=Quality, C=Completeness, Co=Consistency</div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr class="text-left text-ink-faint border-b border-line">
                    <th class="pb-1 pr-4 font-medium">Chapter</th>
                    <th class="pb-1 pr-4 font-medium">Individual</th>
                    <th class="pb-1 pr-4 font-medium">Cumulative</th>
                    <th class="pb-1 pr-4 font-medium">V</th>
                    <th class="pb-1 pr-4 font-medium">Q</th>
                    <th class="pb-1 pr-4 font-medium">C</th>
                    <th class="pb-1 pr-4 font-medium">Co</th>
                    <th class="pb-1 font-medium w-32">Cumulative bar</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-line">
                  <tr
                    v-for="ch in getRepairChapterScores(phase)"
                    :key="`second-${ch.chapter}`"
                  >
                    <td class="pr-4 py-1 text-ink-soft font-medium">
                      {{ ch.chapter }}/{{ ch.total_chapters }}
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="ch.individual_score >= 80 ? 'text-ok' : ch.individual_score >= 70 ? 'text-warn' : 'text-danger'"
                      >
                        {{ ch.individual_score }}/100
                      </span>
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="ch.cumulative_score >= 80 ? 'text-ok' : ch.cumulative_score >= 70 ? 'text-warn' : 'text-danger'"
                      >
                        {{ ch.cumulative_score }}/100
                      </span>
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="chapterComponentPassClass(ch.individual_validation_score, 'validation')"
                      >
                        {{ ch.individual_validation_score ?? '-' }}
                      </span>
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="chapterComponentPassClass(ch.individual_quality_score, 'quality')"
                      >
                        {{ ch.individual_quality_score ?? '-' }}
                      </span>
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="chapterComponentPassClass(ch.individual_completeness_score, 'completeness')"
                      >
                        {{ ch.individual_completeness_score ?? '-' }}
                      </span>
                    </td>
                    <td class="pr-4 py-1">
                      <span
                        class="font-semibold"
                        :class="chapterComponentPassClass(ch.individual_consistency_score, 'consistency')"
                      >
                        {{ ch.individual_consistency_score ?? '-' }}
                      </span>
                    </td>
                    <td class="py-1 w-32">
                      <div class="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                        <div
                          class="h-full rounded-full"
                          :class="scoreBarColor(ch.cumulative_score)"
                          :style="{ width: `${ch.cumulative_score}%` }"
                        ></div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Errors -->
          <div v-if="phase.errors?.length">
            <div class="text-[11px] font-semibold uppercase tracking-wide text-ink-faint mb-1">Errors</div>
            <ul class="space-y-1">
              <li
                v-for="(err, idx) in phase.errors"
                :key="idx"
                class="rounded-md border border-danger bg-danger-wash px-3 py-1 text-xs text-danger"
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

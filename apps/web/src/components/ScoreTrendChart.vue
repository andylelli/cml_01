<script setup lang="ts">
import { computed } from "vue";
import type { GenerationReport } from "./types";

const props = defineProps<{
  history: GenerationReport[];
}>();

// Chart dimensions
const W = 560;
const H = 140;
const PAD = { top: 16, right: 16, bottom: 28, left: 36 };
const CHART_W = W - PAD.left - PAD.right;
const CHART_H = H - PAD.top - PAD.bottom;

const points = computed(() => {
  if (props.history.length < 2) return [];
  const scores = props.history.map((r) => r.overall_score);
  const n = scores.length;
  return scores.map((score, i) => ({
    x: PAD.left + (i / (n - 1)) * CHART_W,
    y: PAD.top + CHART_H - ((Math.min(100, Math.max(0, score)) / 100) * CHART_H),
    score: Math.round(score),
    label: new Date(props.history[i].generated_at).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    passed: props.history[i].passed,
  }));
});

const polylinePoints = computed(() =>
  points.value.map((p) => `${p.x},${p.y}`).join(" ")
);

// Y-axis grid lines at 60, 70, 80, 90, 100
const yGridLines = [60, 70, 80, 90, 100].map((val) => ({
  y: PAD.top + CHART_H - (val / 100) * CHART_H,
  label: val,
}));

const avgScore = computed(() => {
  if (!props.history.length) return 0;
  return Math.round(props.history.reduce((sum, r) => sum + r.overall_score, 0) / props.history.length);
});

const trend = computed(() => {
  if (props.history.length < 2) return "neutral";
  const first = props.history[0].overall_score;
  const last = props.history[props.history.length - 1].overall_score;
  const diff = last - first;
  if (diff > 3) return "improving";
  if (diff < -3) return "declining";
  return "stable";
});

const trendLabel: Record<string, string> = {
  improving: "↑ Improving",
  declining: "↓ Declining",
  stable: "→ Stable",
  neutral: "",
};

const trendClass: Record<string, string> = {
  improving: "text-emerald-600",
  declining: "text-rose-600",
  stable: "text-slate-500",
  neutral: "text-slate-400",
};
</script>

<template>
  <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <div class="flex items-center justify-between">
      <div class="text-sm font-semibold text-slate-700">Score Trend</div>
      <div class="flex items-center gap-4 text-xs">
        <span class="text-slate-400">Avg: <span class="font-semibold text-slate-600">{{ avgScore }}</span></span>
        <span :class="trendClass[trend]" class="font-semibold">{{ trendLabel[trend] }}</span>
      </div>
    </div>

    <div v-if="history.length < 2" class="mt-4 py-6 text-center text-sm text-slate-400">
      At least 2 generations needed to show trend.
    </div>

    <div v-else class="mt-3 overflow-x-auto">
      <svg
        :viewBox="`0 0 ${W} ${H}`"
        class="w-full"
        :style="{ minWidth: '280px', height: `${H}px` }"
        aria-label="Score trend chart"
      >
        <!-- Grid lines -->
        <g v-for="line in yGridLines" :key="line.label">
          <line
            :x1="PAD.left"
            :y1="line.y"
            :x2="W - PAD.right"
            :y2="line.y"
            stroke="#e2e8f0"
            stroke-width="1"
          />
          <text
            :x="PAD.left - 4"
            :y="line.y + 3.5"
            text-anchor="end"
            class="text-[10px]"
            fill="#94a3b8"
            font-size="10"
          >
            {{ line.label }}
          </text>
        </g>

        <!-- Threshold line at 75 (standard) -->
        <line
          :x1="PAD.left"
          :y1="PAD.top + CHART_H - (75 / 100) * CHART_H"
          :x2="W - PAD.right"
          :y2="PAD.top + CHART_H - (75 / 100) * CHART_H"
          stroke="#f59e0b"
          stroke-width="1"
          stroke-dasharray="4,3"
          opacity="0.6"
        />
        <text
          :x="W - PAD.right + 2"
          :y="PAD.top + CHART_H - (75 / 100) * CHART_H + 3"
          fill="#f59e0b"
          font-size="9"
          opacity="0.8"
        >
          75
        </text>

        <!-- Score polyline fill area -->
        <path
          v-if="points.length >= 2"
          :d="`M ${points[0].x},${points[0].y} ${points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')} L ${points[points.length-1].x},${PAD.top + CHART_H} L ${points[0].x},${PAD.top + CHART_H} Z`"
          fill="rgba(99,102,241,0.08)"
        />

        <!-- Score polyline -->
        <polyline
          v-if="points.length >= 2"
          :points="polylinePoints"
          fill="none"
          stroke="#6366f1"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
        />

        <!-- Data points -->
        <g v-for="(pt, i) in points" :key="`pt-${i}`">
          <circle
            :cx="pt.x"
            :cy="pt.y"
            r="4"
            :fill="pt.passed ? '#6366f1' : '#f43f5e'"
            stroke="white"
            stroke-width="1.5"
          />
          <!-- Score label above point (only first, last, and any failures) -->
          <text
            v-if="i === 0 || i === points.length - 1 || !pt.passed"
            :x="pt.x"
            :y="pt.y - 7"
            text-anchor="middle"
            font-size="10"
            :fill="pt.passed ? '#6366f1' : '#f43f5e'"
            font-weight="600"
          >
            {{ pt.score }}
          </text>
        </g>

        <!-- X-axis date labels (first and last only) -->
        <text
          v-if="points.length"
          :x="points[0].x"
          :y="H - 4"
          text-anchor="start"
          font-size="9"
          fill="#94a3b8"
        >
          {{ points[0].label }}
        </text>
        <text
          v-if="points.length > 1"
          :x="points[points.length - 1].x"
          :y="H - 4"
          text-anchor="end"
          font-size="9"
          fill="#94a3b8"
        >
          {{ points[points.length - 1].label }}
        </text>
      </svg>
    </div>

    <div class="mt-2 flex items-center gap-4 text-[11px] text-slate-400">
      <div class="flex items-center gap-1">
        <span class="inline-block h-2 w-2 rounded-full bg-indigo-500"></span>
        Passed
      </div>
      <div class="flex items-center gap-1">
        <span class="inline-block h-2 w-2 rounded-full bg-rose-500"></span>
        Failed
      </div>
      <div class="flex items-center gap-1">
        <span class="inline-block h-2 w-4 border-b-2 border-dashed border-amber-400"></span>
        Threshold (75)
      </div>
    </div>
  </div>
</template>

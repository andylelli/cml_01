<script setup lang="ts">
import { computed } from "vue";
import ValidationPanel from "../../components/ValidationPanel.vue";
import NoveltyAudit from "../../components/NoveltyAudit.vue";
import { useWorkshop } from "./useWorkshopState";
import {
	AXIS_OPTIONS,
	DECADE_OPTIONS,
	DETECTIVE_OPTIONS,
	HUMOUR_OPTIONS,
	LENGTH_OPTIONS,
	LOCATION_OPTIONS,
	TONE_OPTIONS,
} from "../../spec/vocabulary";

/**
 * THE RAIL — rebuilt, because it was 16% of the window saying 191 characters.
 *
 * MEASURED with a project carrying twelve artifacts fully loaded, its entire content was:
 *
 *   "WORKSPACE PANEL · Status, validation, and diagnostics · STATUS · Ready to generate ·
 *    Not updated yet · VALIDATION DETAILS · Novelty Audit · Novelty audit not yet run."
 *
 * A header naming itself, a header describing itself, one useful phrase, a timestamp that was not
 * there, a collapsed disclosure, and a message about something that had not run.
 *
 * ── WHAT A PERSISTENT COLUMN IS ACTUALLY FOR ──────────────────────────────────────────────────
 *
 * It should answer the two questions you cannot answer from whichever panel you happen to be in:
 * **what am I looking at**, and **is it any good**. So:
 *
 *   THIS CASE  — the spec, which otherwise takes two clicks to see, and which is the thing you most
 *                need while reading any other panel. The axis leads: it is the craft decision the
 *                whole mystery turns on.
 *   RUN        — progress while running; the verdict, the cost and the duration once it is not.
 *   FAIR PLAY  — the release gate's actual answer, with counts rather than a link to a panel.
 *   VALIDATION — kept as a disclosure; it is long and it is not always wanted.
 *   NOVELTY    — shown ONLY when it has run. A card whose entire content is "this has not run" is
 *                a card that has nothing to say.
 *
 * "Helpful fixes" was dropped: it carried `v-if="!isAdvanced"` in a console that is now always in
 * operator mode, so it could not render at all.
 */

const {
	spec,
	projectId,
	isRunning,
	isStartingRun,
	runProgressLabel,
	runProgressPercent,
	lastUpdatedLabel,
	scoringReport,
	fairPlayReport,
	allValidation,
	noveltyAuditData,
	showAdvancedValidation,
} = useWorkshop();

/** Render a stored value with the label the operator chose it by, not its wire form. */
const labelOf = (options: readonly { value: string; label: string }[], value: string): string =>
	options.find((o) => o.value === value)?.label ?? value;

const caseFacts = computed(() => [
	{ term: "Axis", value: labelOf(AXIS_OPTIONS, spec.value.primaryAxis), lead: true },
	{ term: "Era", value: labelOf(DECADE_OPTIONS, spec.value.decade) },
	{ term: "Setting", value: labelOf(LOCATION_OPTIONS, spec.value.locationPreset) },
	{ term: "Tone", value: labelOf(TONE_OPTIONS, spec.value.tone) },
	{ term: "Humour", value: labelOf(HUMOUR_OPTIONS, spec.value.humourLevel) },
	{ term: "Length", value: labelOf(LENGTH_OPTIONS, spec.value.targetLength) },
	{ term: "Detective", value: labelOf(DETECTIVE_OPTIONS, spec.value.detectiveType) },
	{ term: "Cast", value: `${spec.value.castSize}` },
]);

/** The run's verdict, once there is one. */
const verdict = computed(() => {
	const r = scoringReport.value;
	if (!r) return null;
	const outcome = r.run_outcome ?? (r.passed ? "passed" : "failed");
	return {
		grade: r.overall_grade,
		score: r.overall_score,
		outcome,
		ok: outcome === "passed",
		// GBP — A_73 §20.1.
		cost: typeof r.total_cost === "number" ? r.total_cost : null,
		minutes: typeof r.total_duration_ms === "number" ? Math.round(r.total_duration_ms / 60000) : null,
	};
});

/** Fair play, as a count rather than a link to somewhere else. */
const fairPlay = computed(() => {
	const report = fairPlayReport.value;
	if (!report?.checks?.length) return null;
	const failed = report.checks.filter((c) => c.status !== "pass" && c.status !== "ok").length;
	return { total: report.checks.length, failed, summary: report.summary };
});

/** Only render the novelty card when the audit actually ran. */
const hasNovelty = computed(() => Boolean(noveltyAuditData.value?.status));

/** `lastUpdatedLabel` reports "Not updated yet" when there is no timestamp; that is not a timestamp. */
const hasTimestamp = computed(() => {
	const label = lastUpdatedLabel.value;
	return Boolean(label) && !/not updated/i.test(label);
});
</script>

<template>
	<aside class="hidden w-80 flex-shrink-0 flex-col gap-4 md:flex">
		<!-- ── what am I looking at ─────────────────────────────────────── -->
		<section v-if="projectId" class="rounded-lg border border-line bg-surface p-5 shadow-card">
			<h2 class="t-section">This case</h2>
			<dl class="mt-3 flex flex-col gap-1.5">
				<div
					v-for="fact in caseFacts"
					:key="fact.term"
					class="flex items-baseline gap-3"
					:class="fact.lead ? 'border-b border-line pb-2 mb-1' : ''"
				>
					<dt class="t-label w-[4.75rem] shrink-0">{{ fact.term }}</dt>
					<dd
						class="m-0 min-w-0 flex-1 text-[0.85rem]"
						:class="fact.lead ? 'font-semibold text-ink' : 'text-ink'"
					>
						{{ fact.value }}
					</dd>
				</div>
			</dl>
		</section>

		<!-- ── the run ──────────────────────────────────────────────────── -->
		<section class="rounded-lg border border-line bg-surface p-5 shadow-card">
			<h2 class="t-section">Run</h2>

			<!--
				NOW and LAST RUN are different facts and were being stacked without saying so, which
				read as a contradiction: "Ready to generate" directly above "ABORTED". The first is
				the console's current state; the second is the verdict on the run before it.
			-->
			<p class="mt-2 text-[0.85rem] text-ink-soft">{{ runProgressLabel }}</p>

			<template v-if="isRunning || isStartingRun">
				<div
					class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
					role="progressbar"
					:aria-valuenow="Math.round(runProgressPercent)"
					aria-valuemin="0"
					aria-valuemax="100"
				>
					<div
						class="h-full rounded-full bg-accent transition-all duration-500"
						:style="{ width: `${runProgressPercent}%` }"
					/>
				</div>
				<p class="t-subtitle mt-1.5">{{ Math.round(runProgressPercent) }}% complete</p>
			</template>

			<!-- The verdict, the cost and the time — none of which the rail used to show. -->
			<div v-else-if="verdict" class="mt-3 flex flex-col gap-2 border-t border-line pt-3">
				<p class="t-label">Last run</p>
				<p class="flex items-center gap-2">
					<span
						class="rounded-sm px-2 py-0.5 text-[0.72rem] font-semibold uppercase tracking-wide"
						:class="verdict.ok ? 'bg-ok-wash text-ok' : 'bg-danger-wash text-danger'"
					>
						{{ verdict.outcome }}
					</span>
					<span class="font-display text-[1.05rem] font-semibold">
						{{ verdict.grade }}<span v-if="verdict.score != null" class="text-ink-soft"> · {{ verdict.score }}</span>
					</span>
				</p>
				<p class="t-subtitle">
					<span v-if="verdict.cost != null">£{{ verdict.cost.toFixed(2) }}</span>
					<span v-if="verdict.cost != null && verdict.minutes != null"> · </span>
					<span v-if="verdict.minutes != null">{{ verdict.minutes }} min</span>
				</p>
			</div>

			<!-- Only when there IS a timestamp. "Not updated yet" is the absence of information
			     wearing the costume of information. -->
			<p v-if="hasTimestamp" class="t-subtitle mt-3">{{ lastUpdatedLabel }}</p>
		</section>

		<!-- ── fair play, as an answer ──────────────────────────────────── -->
		<section v-if="fairPlay" class="rounded-lg border border-line bg-surface p-5 shadow-card">
			<h2 class="t-section">Fair play</h2>
			<p class="mt-2 flex items-baseline gap-2">
				<span
					class="rounded-sm px-2 py-0.5 text-[0.72rem] font-semibold uppercase tracking-wide"
					:class="fairPlay.failed === 0 ? 'bg-ok-wash text-ok' : 'bg-warn-wash text-warn'"
				>
					{{ fairPlay.failed === 0 ? "clear" : `${fairPlay.failed} to answer` }}
				</span>
				<span class="t-subtitle">{{ fairPlay.total }} checks</span>
			</p>
			<p v-if="fairPlay.summary" class="mt-2 text-[0.8rem] leading-snug text-ink-soft">
				{{ fairPlay.summary }}
			</p>
		</section>

		<!-- ── validation: long, so still a disclosure ──────────────────── -->
		<section class="rounded-lg border border-line bg-surface shadow-card">
			<button
				type="button"
				class="transition-control flex w-full items-center gap-2 rounded-lg px-5 py-4 text-left hover:bg-surface-sunken"
				:aria-expanded="showAdvancedValidation"
				@click="showAdvancedValidation = !showAdvancedValidation"
			>
				<span class="t-section flex-1">Validation details</span>
				<svg
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					class="text-ink-soft transition-transform duration-150"
					:class="showAdvancedValidation ? 'rotate-180' : ''"
					aria-hidden="true"
				>
					<path d="m6 9.5 6 6 6-6" />
				</svg>
			</button>
			<div v-if="showAdvancedValidation" class="border-t border-line px-5 py-4">
				<ValidationPanel :validation="allValidation" />
			</div>
		</section>

		<!-- Only when it has actually run. -->
		<NoveltyAudit v-if="hasNovelty" :audit="noveltyAuditData" />
	</aside>
</template>

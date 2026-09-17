<script setup lang="ts">
import { computed } from "vue";
import AppButton from "../../../components/ui/AppButton.vue";
import { useWorkshop } from "../useWorkshopState";
import {
	DECADE_OPTIONS,
	DETECTIVE_OPTIONS,
	HUMOUR_OPTIONS,
	LENGTH_OPTIONS,
	LOCATION_OPTIONS,
	TONE_OPTIONS,
} from "../../../spec/vocabulary";

/**
 * WHAT THIS RUN WAS ASKED FOR — read-only.
 *
 * The console used to hold a full editable copy of the spec form, which meant story setup lived in
 * two places: a reader configured a mystery in Create, then found a second set of the same fields
 * here, with no indication which one the run had actually used. The spec is a module singleton, so
 * they were the same values — but nothing on screen said so, and two editors for one value is an
 * invitation to change the wrong one.
 *
 * Setup now lives in Create. The console still has to SHOW the spec, because reviewing what the
 * pipeline produced is meaningless without knowing what it was asked for. So: the same values, read
 * only, with one link back to the page that owns them.
 *
 * `primaryAxis` and `proseBatchSize` are not here. They are operator-only — the axis because it is a
 * craft decision and the one field that aborts a run on a bad value (vocabulary.ts:127), the batch
 * size because it is a throughput knob — and they live under Advanced ▸ Operator.
 */

const { spec, goTo, isAdvanced } = useWorkshop();

const emit = defineEmits<{ openCreate: [] }>();

const labelOf = (options: readonly { value: string; label: string }[], value: string): string =>
	options.find((o) => o.value === value)?.label ?? value;

/** The story fields, in the order Create asks for them, so the two pages read the same way. */
const rows = computed(() => {
	const s = spec.value;
	return [
		{ term: "Era", value: labelOf(DECADE_OPTIONS, s.decade) },
		{ term: "Setting", value: labelOf(LOCATION_OPTIONS, s.locationPreset) },
		{ term: "Tone", value: labelOf(TONE_OPTIONS, s.tone) },
		{ term: "Humour", value: labelOf(HUMOUR_OPTIONS, s.humourLevel) },
		{ term: "Cast", value: `${s.castSize} characters` },
		{ term: "Detective", value: labelOf(DETECTIVE_OPTIONS, s.detectiveType) },
		{ term: "Length", value: labelOf(LENGTH_OPTIONS, s.targetLength) },
	];
});

const castNames = computed(() => (spec.value.castNames ?? []).filter(Boolean));
</script>

<template>
	<div class="rounded-lg border border-line bg-surface p-6 shadow-card">
		<div class="flex flex-wrap items-baseline justify-between gap-2">
			<div class="t-section">What this run was asked for</div>
			<AppButton size="sm" variant="ghost" icon="chevronRight" @click="emit('openCreate')">
				Change in Create
			</AppButton>
		</div>

		<dl class="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
			<div v-for="row in rows" :key="row.term">
				<dt class="t-label">{{ row.term }}</dt>
				<dd class="m-0 text-[0.86rem] text-ink">{{ row.value }}</dd>
			</div>
		</dl>

		<div v-if="spec.storyAngle" class="mt-4 border-t border-line pt-4">
			<dt class="t-label">Story angle</dt>
			<dd class="m-0 text-[0.86rem] text-ink">{{ spec.storyAngle }}</dd>
			<p class="mt-1 text-[0.72rem] leading-snug text-ink-faint">
				The world the story moves in. Sent to the setting and cast directly, and added to the theme
				as background — never as the murder method.
			</p>
		</div>

		<div v-if="spec.theme" class="mt-4 border-t border-line pt-4">
			<dt class="t-label">Theme</dt>
			<dd class="m-0 font-display text-[0.88rem] italic leading-relaxed text-ink">{{ spec.theme }}</dd>
		</div>

		<div v-if="castNames.length" class="mt-4 border-t border-line pt-4">
			<dt class="t-label">Named cast</dt>
			<dd class="m-0 text-[0.86rem] text-ink">{{ castNames.join(", ") }}</dd>
		</div>

		<p v-if="isAdvanced" class="mt-4 border-t border-line pt-3 text-[0.72rem] text-ink-faint">
			Concealment axis and prose batch size are under
			<button type="button" class="underline hover:text-ink" @click="goTo('advanced', 'operator')">
				Advanced ▸ Operator
			</button>.
		</p>
	</div>
</template>

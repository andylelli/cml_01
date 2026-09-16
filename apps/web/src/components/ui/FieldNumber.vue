<script setup lang="ts">
import { computed, useId } from "vue";
import AppIcon from "./AppIcon.vue";

/**
 * Board 1 step 4: the "− 6 +" stepper.
 *
 * The middle is a real number input, not a label, so the value can be typed and is announced with
 * its own role and bounds. The buttons are `type="button"` — inside a form, a bare <button> submits,
 * and "add a suspect" firing a paid pipeline run is exactly the class of bug this rebuild exists to
 * remove.
 */
const props = withDefaults(
	defineProps<{
		label: string;
		min?: number;
		max?: number;
		help?: string;
		/** Announced with the number, e.g. "characters". */
		unit?: string;
	}>(),
	{ min: 0, max: 99, help: undefined, unit: undefined },
);

const model = defineModel<number>({ required: true });

const id = `num-${useId()}`;
const helpId = `${id}-help`;

const clamp = (value: number) => Math.min(props.max, Math.max(props.min, Math.round(value)));

const atMin = computed(() => model.value <= props.min);
const atMax = computed(() => model.value >= props.max);

const step = (delta: number) => {
	model.value = clamp((Number(model.value) || props.min) + delta);
};

/** A typed value is clamped on change, not on every keystroke — clamping mid-type fights the user. */
const onInput = (event: Event) => {
	const raw = Number((event.target as HTMLInputElement).value);
	if (Number.isFinite(raw)) model.value = raw;
};

const onChange = () => {
	model.value = Number.isFinite(Number(model.value)) ? clamp(Number(model.value)) : props.min;
};
</script>

<template>
	<div class="min-w-0">
		<label :for="id" class="t-label mb-1.5 block">{{ label }}</label>

		<div
			class="transition-control flex items-stretch overflow-hidden rounded border border-line bg-surface hover:border-line-strong"
		>
			<button
				type="button"
				class="transition-control flex w-10 shrink-0 items-center justify-center border-r border-line text-ink-soft hover:bg-surface-sunken hover:text-ink disabled:text-ink-faint disabled:hover:bg-transparent"
				:disabled="atMin"
				:aria-label="`Fewer ${unit ?? label}`"
				@click="step(-1)"
			>
				<AppIcon name="minus" :size="16" :weight="2" />
			</button>

			<input
				:id="id"
				:value="model"
				type="number"
				inputmode="numeric"
				:min="min"
				:max="max"
				:aria-describedby="help ? helpId : undefined"
				class="w-full min-w-0 bg-transparent py-2.5 text-center text-[0.95rem] font-semibold text-ink outline-none"
				@input="onInput"
				@change="onChange"
				@blur="onChange"
			/>

			<button
				type="button"
				class="transition-control flex w-10 shrink-0 items-center justify-center border-l border-line text-ink-soft hover:bg-surface-sunken hover:text-ink disabled:text-ink-faint disabled:hover:bg-transparent"
				:disabled="atMax"
				:aria-label="`More ${unit ?? label}`"
				@click="step(1)"
			>
				<AppIcon name="plus" :size="16" :weight="2" />
			</button>
		</div>

		<p v-if="help" :id="helpId" class="mt-1.5 text-[0.72rem] leading-snug text-ink-soft">
			{{ help }}
		</p>
	</div>
</template>

<style scoped>
/* The spinners duplicate the buttons either side of them. */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
	appearance: none;
	margin: 0;
}

input[type="number"] {
	appearance: textfield;
	-moz-appearance: textfield;
}

div:has(> input:focus-visible) {
	box-shadow: var(--focus-ring);
	border-color: var(--accent);
}
</style>

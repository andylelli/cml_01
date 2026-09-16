<script setup lang="ts" generic="T extends string">
import { useId } from "vue";
import AppIcon from "./AppIcon.vue";
import type { IconName } from "./icons";
import type { Option } from "./OptionGroup.vue";

/**
 * Board 2's control: a bordered field with the glyph in its own cell at the left and a chevron at
 * the right. A native <select> underneath — the platform's own picker is better than anything we
 * would build, correct on mobile, and free to a screen reader.
 *
 * The chevron is decorative; the native arrow is suppressed with `appearance: none`, and a
 * `@supports` guard restores it where that is not honoured so the control can never lose its
 * affordance entirely.
 */
withDefaults(
	defineProps<{
		label: string;
		options: readonly Option<T>[];
		icon?: IconName;
		/** Shown after the label in lighter type, e.g. "(optional)". */
		note?: string;
		/** Rendered under the field; also announced via aria-describedby. */
		help?: string;
		disabled?: boolean;
	}>(),
	{ icon: undefined, note: undefined, help: undefined, disabled: false },
);

const model = defineModel<T>({ required: true });

const id = `field-${useId()}`;
const helpId = `${id}-help`;
</script>

<template>
	<div class="min-w-0">
		<label :for="id" class="t-label mb-1.5 block">
			{{ label }}
			<span v-if="note" class="font-normal text-ink-faint">{{ note }}</span>
		</label>

		<div
			class="transition-control flex items-stretch overflow-hidden rounded border bg-surface"
			:class="disabled ? 'border-line bg-surface-sunken' : 'border-line hover:border-line-strong'"
		>
			<span
				v-if="icon"
				class="flex w-10 shrink-0 items-center justify-center border-r border-line text-ink-soft"
				aria-hidden="true"
			>
				<AppIcon :name="icon" :size="17" />
			</span>

			<div class="relative min-w-0 flex-1">
				<select
					:id="id"
					v-model="model"
					:disabled="disabled"
					:aria-describedby="help ? helpId : undefined"
					class="w-full appearance-none bg-transparent py-2.5 pl-3 pr-9 text-[0.9rem] font-medium text-ink outline-none disabled:text-ink-faint"
				>
					<option v-for="option in options" :key="option.value" :value="option.value">
						{{ option.label }}
					</option>
				</select>

				<AppIcon
					name="chevronDown"
					:size="16"
					class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"
				/>
			</div>
		</div>

		<p v-if="help" :id="helpId" class="mt-1.5 text-[0.72rem] leading-snug text-ink-soft">
			{{ help }}
		</p>
	</div>
</template>

<style scoped>
/* Where appearance:none is not honoured, let the native arrow back in rather than shipping a
   control with two arrows or none. */
@supports not (appearance: none) {
	select {
		padding-right: 0.75rem;
	}
	select + svg {
		display: none;
	}
}

/* The ring belongs on the framed field, not on the bare select inside it. */
div:has(> div > select:focus-visible) {
	box-shadow: var(--focus-ring);
	border-color: var(--accent);
}
</style>

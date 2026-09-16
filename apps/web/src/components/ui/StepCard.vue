<script setup lang="ts">
import { computed, useId } from "vue";
import AppIcon from "./AppIcon.vue";
import type { IconName } from "./icons";

/**
 * A numbered section card. Board 1 puts a number in the tan circle; board 2 puts an icon there.
 * Both are supported because both boards are the same system (UI-001 §1) — pass `step` or `icon`.
 *
 * Rendered as a <section> labelled by its own heading, so the step structure is navigable by
 * landmark and the numbers are not the only thing tying a control to its group.
 */
const props = withDefaults(
	defineProps<{
		title: string;
		subtitle?: string;
		step?: number;
		icon?: IconName;
		/** Collapsible on narrow screens — board 2's phone accordion. */
		collapsible?: boolean;
		/** Two-way when collapsible; ignored otherwise. */
		open?: boolean;
	}>(),
	{ subtitle: undefined, step: undefined, icon: undefined, collapsible: false, open: true },
);

const emit = defineEmits<{ "update:open": [boolean] }>();

const headingId = `step-${useId()}`;
const badge = computed(() => (props.step !== undefined ? String(props.step) : null));
</script>

<template>
	<section
		:aria-labelledby="headingId"
		class="rounded-lg border border-line bg-surface shadow-card"
	>
		<component
			:is="collapsible ? 'button' : 'div'"
			:type="collapsible ? 'button' : undefined"
			:aria-expanded="collapsible ? open : undefined"
			class="flex w-full items-center gap-3.5 px-5 pt-5 text-left"
			:class="collapsible ? 'cursor-pointer pb-5' : 'pb-1'"
			@click="collapsible && emit('update:open', !open)"
		>
			<span
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-badge text-badge-ink"
				aria-hidden="true"
			>
				<span v-if="badge" class="font-display text-[0.95rem] font-semibold">{{ badge }}</span>
				<AppIcon v-else-if="icon" :name="icon" :size="18" :weight="1.6" />
			</span>

			<span class="min-w-0 flex-1">
				<h2 :id="headingId" class="t-section">
					<span v-if="badge" class="sr-only">Step {{ badge }}. </span>{{ title }}
				</h2>
				<p v-if="subtitle" class="t-subtitle mt-0.5">{{ subtitle }}</p>
			</span>

			<AppIcon
				v-if="collapsible"
				name="chevronDown"
				:size="18"
				class="text-ink-soft transition-transform duration-150"
				:class="open ? 'rotate-180' : ''"
			/>
		</component>

		<div v-show="!collapsible || open" class="px-5 pb-5 pt-4">
			<slot />
		</div>
	</section>
</template>

<style scoped>
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}
</style>

<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
import type { IconName } from "./icons";

/**
 * Buttons. Four variants, and the count is the point (UI-001 §1): red means the primary action and
 * nothing else, so `danger` is deliberately the browner `--danger` and can never be mistaken for it.
 *
 * `busy` keeps the button's width and swaps the label, rather than shrinking it — a CTA that
 * changes size mid-click moves whatever is under the pointer.
 */
withDefaults(
	defineProps<{
		variant?: "primary" | "secondary" | "ghost" | "danger";
		icon?: IconName;
		type?: "button" | "submit";
		disabled?: boolean;
		busy?: boolean;
		busyLabel?: string;
		size?: "md" | "sm";
		block?: boolean;
	}>(),
	{
		variant: "secondary",
		icon: undefined,
		type: "button",
		disabled: false,
		busy: false,
		busyLabel: "Working…",
		size: "md",
		block: false,
	},
);
</script>

<template>
	<button
		:type="type"
		:disabled="disabled || busy"
		:aria-busy="busy || undefined"
		class="transition-control inline-flex items-center justify-center gap-2 rounded border font-medium disabled:cursor-not-allowed"
		:class="[
			size === 'sm' ? 'px-3 py-1.5 text-[0.8rem]' : 'px-5 py-2.5 text-[0.92rem]',
			block ? 'w-full' : '',
			{
				primary:
					'border-accent bg-accent text-[--surface] hover:border-accent-hover hover:bg-accent-hover disabled:border-line disabled:bg-surface-sunken disabled:text-ink-faint',
				secondary:
					'border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-sunken disabled:text-ink-faint',
				ghost:
					'border-transparent bg-transparent text-ink-soft hover:bg-surface-sunken hover:text-ink disabled:text-ink-faint',
				danger:
					'border-danger bg-danger-wash text-danger hover:bg-[--danger] hover:text-[--surface] disabled:border-line disabled:bg-surface-sunken disabled:text-ink-faint',
			}[variant],
		]"
	>
		<AppIcon v-if="busy" name="gear" :size="size === 'sm' ? 14 : 17" class="animate-spin" />
		<AppIcon v-else-if="icon" :name="icon" :size="size === 'sm' ? 14 : 17" />
		<span v-if="busy">{{ busyLabel }}</span>
		<slot v-else />
	</button>
</template>

<style scoped>
/* UI-001 §2.3 allows no transform motion on controls; a spinner is the one exception, and it is
   suppressed under prefers-reduced-motion by the global rule in tokens.css. */
.animate-spin {
	animation: spin 1.4s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>

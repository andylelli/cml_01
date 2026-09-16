<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
import type { IconName } from "./icons";

/**
 * Board 1's dark green side column: a pull quote over a short list of what the product does.
 *
 * Decorative and supplementary — it carries no control and no information the form needs, so it is
 * the first thing dropped below 1180px (UI-001 §6) and is marked `aria-hidden` for the quote while
 * the feature list stays readable, because the list is real information and the epigraph is not.
 */
export interface Feature {
	icon: IconName;
	title: string;
	detail: string;
}

defineProps<{
	quote: string;
	features: readonly Feature[];
}>();
</script>

<template>
	<aside class="on-frame rounded-lg bg-frame p-6 text-on-frame-soft">
		<blockquote class="t-quote border-b border-frame-tint pb-6 text-on-frame">
			<span aria-hidden="true">“</span>{{ quote }}<span aria-hidden="true">”</span>
		</blockquote>

		<ul class="mt-6 flex flex-col gap-5 p-0">
			<li v-for="feature in features" :key="feature.title" class="flex list-none gap-3.5">
				<AppIcon :name="feature.icon" :size="22" :weight="1.4" class="mt-0.5 shrink-0 text-badge" />
				<span class="min-w-0">
					<span class="block text-[0.85rem] font-semibold text-on-frame">{{ feature.title }}</span>
					<span class="block text-[0.8rem] leading-snug">{{ feature.detail }}</span>
				</span>
			</li>
		</ul>

		<slot />
	</aside>
</template>

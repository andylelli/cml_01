<script setup lang="ts">
import { computed, ref } from "vue";
import { brand } from "../../design/brand";
import AppIcon from "./AppIcon.vue";
import type { NavItem } from "./types";

/**
 * The green frame: wordmark, nav, search pill, and the footer. Board 1 and board 2 differ only in
 * where the wordmark sits, so this is one component.
 *
 * On narrow screens the top nav collapses to a menu button and a bottom tab bar appears — board 1's
 * phone. The bottom bar is `position: fixed`, so the page reserves space for it with padding rather
 * than letting it cover the last control on the page.
 */
const props = defineProps<{
	items: readonly NavItem[];
	current: string;
	/** Hidden when there is nothing to search yet. */
	showSearch?: boolean;
}>();

const emit = defineEmits<{ navigate: [string]; search: [string] }>();

/**
 * THE PHONE TAB BAR FITS FOUR, AND THERE ARE NOW SIX SECTIONS.
 *
 * It used to be `items.slice(0, 4)`, which silently dropped whatever came fifth. That was harmless
 * while there were four; it stopped being harmless when the open case joined the list, because the
 * open case is the page a run is watched from — so on a phone, during the forty minutes a mystery
 * takes to write, the tab bar would show four sections and none of them would be the live one, nor
 * would any be highlighted.
 *
 * So: the first three, plus the current section whenever it is not already among them. Where you are
 * is always reachable and always indicated.
 */
const phoneTabs = computed<readonly NavItem[]>(() => {
	const head = props.items.slice(0, 4);
	if (head.some((item) => item.id === props.current)) return head;
	const active = props.items.find((item) => item.id === props.current);
	return active ? [...props.items.slice(0, 3), active] : head;
});

const menuOpen = ref(false);
const query = ref("");

const go = (id: string) => {
	menuOpen.value = false;
	emit("navigate", id);
};
</script>

<template>
	<div class="flex min-h-screen flex-col bg-ground">
		<!-- ── frame: top ─────────────────────────────────────────────── -->
		<header class="on-frame sticky top-0 z-30 border-b border-frame-tint bg-frame">
			<div class="mx-auto flex max-w-shell items-center gap-4 px-4 py-3 sm:px-6">
				<button
					type="button"
					class="-ml-1 rounded p-1.5 text-on-frame md:hidden"
					:aria-expanded="menuOpen"
					aria-label="Menu"
					@click="menuOpen = !menuOpen"
				>
					<AppIcon :name="menuOpen ? 'close' : 'menu'" :size="22" />
				</button>

				<a
					href="#main"
					class="flex min-w-0 items-center gap-2.5 text-on-frame no-underline"
					@click.prevent="go(items[0]?.id ?? 'create')"
				>
					<AppIcon name="hat" :size="30" :weight="1.3" class="shrink-0 text-badge" />
					<span class="min-w-0 leading-none">
						<span class="font-display block text-[1.05rem] font-bold uppercase tracking-[.1em]">
							{{ brand.nameLines[0] }}
						</span>
						<span class="font-display block text-[0.82rem] uppercase tracking-[.18em] text-on-frame-soft">
							{{ brand.nameLines[1] }}
						</span>
					</span>
				</a>

				<span class="t-eyebrow hidden border-l border-frame-tint pl-4 !text-on-frame-soft lg:inline">
					{{ brand.tagline }}
				</span>

				<nav class="ml-auto hidden items-center gap-1 md:flex" aria-label="Sections">
					<button
						v-for="item in items"
						:key="item.id"
						type="button"
						class="transition-control relative rounded-sm px-3 py-2 text-[0.88rem] font-medium"
						:class="
							current === item.id
								? 'text-on-frame'
								: 'text-on-frame-soft hover:bg-frame-tint hover:text-on-frame'
						"
						:aria-current="current === item.id ? 'page' : undefined"
						@click="go(item.id)"
					>
						{{ item.label }}
						<span
							v-if="current === item.id"
							class="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent"
							aria-hidden="true"
						/>
					</button>
				</nav>

				<form
					v-if="showSearch"
					class="ml-auto hidden items-center gap-2 rounded border border-frame-tint bg-frame-deep px-3 py-2 md:ml-0 md:flex"
					role="search"
					@submit.prevent="emit('search', query)"
				>
					<AppIcon name="search" :size="16" class="text-on-frame-soft" />
					<input
						v-model="query"
						type="search"
						:placeholder="brand.searchPlaceholder"
						aria-label="Search mysteries"
						class="w-52 bg-transparent font-display text-[0.82rem] italic text-on-frame outline-none placeholder:text-on-frame-soft"
					/>
				</form>
			</div>

			<!-- mobile drawer -->
			<nav v-if="menuOpen" class="border-t border-frame-tint md:hidden" aria-label="Sections">
				<button
					v-for="item in items"
					:key="item.id"
					type="button"
					class="flex w-full items-center gap-3 border-b border-frame-tint px-5 py-3 text-left text-[0.92rem]"
					:class="current === item.id ? 'bg-frame-deep text-on-frame' : 'text-on-frame-soft'"
					:aria-current="current === item.id ? 'page' : undefined"
					@click="go(item.id)"
				>
					<AppIcon :name="item.icon" :size="18" />
					{{ item.label }}
				</button>
			</nav>
		</header>

		<!-- ── body ───────────────────────────────────────────────────── -->
		<main id="main" class="flex-1 pb-20 md:pb-0">
			<slot />
		</main>

		<!-- ── frame: bottom ──────────────────────────────────────────── -->
		<footer class="on-frame mt-auto bg-frame text-on-frame-soft">
			<div
				class="mx-auto flex max-w-shell flex-col gap-3 px-4 py-5 text-[0.8rem] sm:px-6 md:flex-row md:items-center md:justify-between"
			>
				<span class="t-eyebrow !text-on-frame-soft">{{ brand.name }}</span>
				<span class="font-display italic">{{ brand.footerLine }}</span>
			</div>
		</footer>

		<!-- board 1's phone: bottom tabs. Hidden from desktop and from print. -->
		<nav
			class="on-frame no-print fixed inset-x-0 bottom-0 z-30 flex border-t border-frame-tint bg-frame md:hidden"
			aria-label="Sections"
		>
			<button
				v-for="item in phoneTabs"
				:key="item.id"
				type="button"
				class="flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium"
				:class="current === item.id ? 'text-badge' : 'text-on-frame-soft'"
				:aria-current="current === item.id ? 'page' : undefined"
				@click="go(item.id)"
			>
				<AppIcon :name="item.icon" :size="19" />
				{{ item.label }}
			</button>
		</nav>
	</div>
</template>

import type { IconName } from "./icons";

/**
 * Shared types for the UI primitives.
 *
 * These live here rather than in the components that use them because `<script setup>` cannot
 * contain ES module exports — a type declared inside one is not importable, and Vue's compiler
 * rejects the `export` outright.
 */

/** One selectable choice, used by OptionGroup and FieldSelect alike. */
export interface Option<V extends string = string> {
	value: V;
	label: string;
	hint?: string;
	/** Named glyph. Typed loosely as string at the spec layer, narrowed here at the render site. */
	icon: string;
}

/** A destination in the top nav and the mobile tab bar. */
export interface NavItem {
	id: string;
	label: string;
	icon: IconName;
}

/** A line in the epigraph column. */
export interface Feature {
	icon: IconName;
	title: string;
	detail: string;
}

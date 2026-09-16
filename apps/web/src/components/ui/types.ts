import type { IconName } from "./icons";

/**
 * Shared types for the UI primitives.
 *
 * These live here rather than in the components that use them because `<script setup>` cannot
 * contain ES module exports — a type declared inside one is not importable, and Vue's compiler
 * rejects the `export` outright.
 */

/**
 * One selectable choice in a `FieldSelect`.
 *
 * `icon` is OPTIONAL here because a select draws ONE glyph — its own `icon` prop, beside the field —
 * and never a glyph per option. The flavour lists (spec/flavour.ts) carry no glyphs at all, and
 * requiring one would have meant inventing eight meaningless ones.
 */
export interface Option<V extends string = string> {
	value: V;
	label: string;
	hint?: string;
	/** Named glyph. Typed loosely as string at the spec layer, narrowed at the render site. */
	icon?: string;
}

/**
 * A choice in an `OptionGroup`, where each tile IS a glyph plus a label — so here it is required.
 * `SpecOption` in spec/vocabulary.ts satisfies this; `FlavourOption` deliberately does not.
 */
export interface TileOption<V extends string = string> extends Option<V> {
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

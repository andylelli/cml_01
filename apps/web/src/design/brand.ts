/**
 * THE WORDMARK.
 *
 * The mood boards carry two names — "Murder in Minutes" and "The Crime Builder". We ship the first.
 * Changing the product name is an edit to this file and nothing else: no component embeds the
 * string, and no test asserts it (they assert `brand.name` instead), so a rename cannot break the
 * suite. See documentation/ui/UI-001-design-system.md §7.
 */

export interface Brand {
	/** The wordmark. Rendered in two weights: "MURDER" bold, "IN MINUTES" lighter beneath it. */
	name: string;
	/** Split for the stacked lockup on the boards. Must concatenate back to `name`. */
	nameLines: readonly [string, string];
	/** Sits beside the wordmark in the nav, letterspaced small caps. */
	tagline: string;
	/** The search field's placeholder — italic on the boards. */
	searchPlaceholder: string;
	/** Footer line, small caps and centred. */
	footerLine: string;
	/** The handwritten note near the submit button. Decorative; always aria-hidden. */
	scriptNote: string;
	/** Document title. */
	documentTitle: string;
}

export const brand: Brand = {
	name: "Murder in Minutes",
	nameLines: ["Murder", "in Minutes"],
	tagline: "Classic crimes. New stories.",
	searchPlaceholder: "A little mystery goes a long way.",
	footerLine: "Small crimes. Big imaginations.",
	scriptNote: "Clever plots,\nbrighter days",
	documentTitle: "Murder in Minutes",
};

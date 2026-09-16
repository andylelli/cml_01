import { onScopeDispose, toValue, type MaybeRefOrGetter } from "vue";

/**
 * Global keyboard shortcuts, declared rather than branched.
 *
 * ── WHAT WAS WRONG WITH THE ORIGINAL, BEYOND ITS LOCATION ─────────────────────────────────────
 *
 * The handler in WorkshopView was a chain of `if (e.key === …)` with two defects that a declarative
 * list makes unrepresentable:
 *
 * 1. **The tab ids were hard-coded** — `["project", "spec", "generate", "review", "advanced",
 *    "export"]` — a second copy of the list `mainTabs` already computes. Rename or reorder a tab and
 *    Ctrl+3 quietly goes somewhere else, or nowhere, with nothing to catch it. Bindings are now
 *    supplied by the caller from its own real list.
 *
 * 2. **The typing guard missed `contenteditable`.** It checked INPUT, TEXTAREA and SELECT only, so a
 *    rich-text field anywhere in the app would have had `j` and `k` steal the keystroke. The guard
 *    here asks whether the event target is editable at all.
 *
 * One listener is attached regardless of how many bindings there are, and it is removed on scope
 * disposal — the same discipline B1 needed for the timers.
 */

export interface Shortcut {
	/** `event.key`, matched case-sensitively for letters ("j"), literally for the rest ("?", "Escape"). */
	key: string;
	/** Ctrl OR Meta — one binding covers both platforms, which is what a user expects. */
	ctrl?: boolean;
	alt?: boolean;
	shift?: boolean;
	/** Call `preventDefault()` before running. */
	preventDefault?: boolean;
	/**
	 * Fire even while the user is typing in a field. Default false, and it should stay false for
	 * anything that is a bare letter.
	 */
	whileTyping?: boolean;
	run: (event: KeyboardEvent) => void;
	/** Shown in the shortcut help panel. */
	description?: string;
}

/** Is the event target somewhere the user is entering text? */
export const isEditableTarget = (target: EventTarget | null): boolean => {
	const el = target as HTMLElement | null;
	if (!el || typeof el.tagName !== "string") return false;
	if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) return true;
	// The case the original missed.
	return el.isContentEditable === true;
};

/** Does this event satisfy this binding? */
export const matches = (shortcut: Shortcut, event: KeyboardEvent): boolean => {
	if (event.key !== shortcut.key) return false;
	// Ctrl and Meta are interchangeable; requiring neither means neither may be held, or a bare "j"
	// would also fire on Ctrl+J.
	const wantsModifier = shortcut.ctrl === true;
	const hasModifier = event.ctrlKey || event.metaKey;
	if (wantsModifier !== hasModifier) return false;
	if ((shortcut.alt === true) !== event.altKey) return false;
	// Shift is only checked when the binding asks about it: "?" IS shift+/ on most layouts, and
	// demanding shift===false there would make it unpressable.
	if (shortcut.shift !== undefined && shortcut.shift !== event.shiftKey) return false;
	return true;
};

export interface ShortcutOptions {
	/** Where to listen. Injectable so a test does not need a real window. */
	target?: Pick<Window, "addEventListener" | "removeEventListener">;
	/** Set false to attach nothing — e.g. while a modal owns the keyboard. */
	enabled?: MaybeRefOrGetter<boolean>;
}

export const useShortcuts = (
	bindings: MaybeRefOrGetter<readonly Shortcut[]>,
	options: ShortcutOptions = {},
) => {
	const target = options.target ?? (typeof window !== "undefined" ? window : undefined);

	const onKeydown = (event: KeyboardEvent): void => {
		if (options.enabled !== undefined && !toValue(options.enabled)) return;

		const editing = isEditableTarget(event.target);

		// Read the list at EVENT time, so a caller whose bindings are computed gets the current ones.
		for (const shortcut of toValue(bindings)) {
			if (editing && !shortcut.whileTyping) continue;
			if (!matches(shortcut, event)) continue;
			if (shortcut.preventDefault) event.preventDefault();
			shortcut.run(event);
			// First match wins — two bindings on one chord is a caller bug, not something to run twice.
			return;
		}
	};

	let attached = false;

	const attach = (): void => {
		if (attached || !target) return;
		target.addEventListener("keydown", onKeydown as EventListener);
		attached = true;
	};

	const detach = (): void => {
		if (!attached || !target) return;
		target.removeEventListener("keydown", onKeydown as EventListener);
		attached = false;
	};

	attach();
	onScopeDispose(detach, true);

	return { attach, detach, isAttached: () => attached, handle: onKeydown };
};

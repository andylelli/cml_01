import { onScopeDispose, ref } from "vue";

/**
 * The error/notification list.
 *
 * ── THE BUG THIS REPLACES (UI-002 §5, B9) ─────────────────────────────────────────────────────
 *
 * The old `addError` auto-dismissed `info` items with a bare `setTimeout(..., 5000)` and never kept
 * a handle on it. Every info notification left a timer that outlived the component, which is the
 * same shape as the two polling intervals A_73 already had to fix here — and the same shape as the
 * A_30 defect where a timer outliving its owner overwrote freshly-loaded state.
 *
 * Timers are tracked and cleared on scope disposal. `onScopeDispose` rather than `onBeforeUnmount`
 * so this is correct when used outside a component too.
 */

export type ErrorSeverity = "info" | "warning" | "error";

export interface ErrorItem {
	id: string;
	timestamp: number;
	severity: ErrorSeverity;
	scope: string;
	message: string;
	details?: string;
}

/** What to retry when the user presses the action on a notification. */
export interface FailedAction {
	type: "pipeline";
	scope?: string;
}

export interface ErrorLogOptions {
	/** How long an `info` item stays up. 0 disables auto-dismiss. */
	autoDismissMs?: number;
	/** Side channel for the activity log; kept injectable so tests do not need a server. */
	onLogged?: (item: ErrorItem) => void;
}

export const useErrorLog = (options: ErrorLogOptions = {}) => {
	const { autoDismissMs = 5000, onLogged } = options;

	const errors = ref<ErrorItem[]>([]);
	const lastFailedAction = ref<FailedAction | null>(null);

	let counter = 0;
	const timers = new Set<ReturnType<typeof setTimeout>>();

	const dismiss = (id: string): void => {
		const index = errors.value.findIndex((e) => e.id === id);
		if (index > -1) errors.value.splice(index, 1);
	};

	const add = (
		severity: ErrorSeverity,
		scope: string,
		message: string,
		details?: string,
	): ErrorItem => {
		const item: ErrorItem = {
			id: `error_${++counter}`,
			timestamp: Date.now(),
			severity,
			scope,
			message,
			details,
		};
		errors.value.push(item);

		if (severity === "info" && autoDismissMs > 0) {
			const timer = setTimeout(() => {
				timers.delete(timer);
				dismiss(item.id);
			}, autoDismissMs);
			timers.add(timer);
		}

		onLogged?.(item);
		return item;
	};

	const clear = (scope?: string): void => {
		errors.value = scope ? errors.value.filter((e) => e.scope !== scope) : [];
	};

	/**
	 * Resolve a notification. Returns the action to retry, or null when there is nothing to retry —
	 * the composable does not know how to run a pipeline and should not.
	 */
	const resolve = (item: ErrorItem): FailedAction | null => {
		dismiss(item.id);
		if (item.severity === "info") return null;
		const action = lastFailedAction.value;
		lastFailedAction.value = null;
		return action;
	};

	const recordFailure = (action: FailedAction | null): void => {
		lastFailedAction.value = action;
	};

	/** Clear every outstanding timer. Idempotent. */
	const dispose = (): void => {
		for (const timer of timers) clearTimeout(timer);
		timers.clear();
	};

	/**
	 * `failSilently` because this is also used outside a component in tests and could be used from a
	 * plain module later. Without it Vue warns, and — worse — the warning is the ONLY sign that the
	 * cleanup did not register at all. Callers with no scope must call `dispose()` themselves.
	 */
	onScopeDispose(dispose, true);

	return {
		dispose,
		errors,
		lastFailedAction,
		add,
		dismiss,
		clear,
		resolve,
		recordFailure,
		/** Test seam: how many auto-dismiss timers are outstanding. */
		pendingTimers: () => timers.size,
	};
};

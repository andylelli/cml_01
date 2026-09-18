import { effectScope } from "vue";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useErrorLog, type ErrorItem } from "../useErrorLog";

/** Run a composable inside a disposable scope so onScopeDispose can be exercised. */
const inScope = <T>(fn: () => T): { value: T; dispose: () => void } => {
	const scope = effectScope();
	const value = scope.run(fn) as T;
	return { value, dispose: () => scope.stop() };
};

describe("useErrorLog", () => {
	beforeEach(() => vi.useFakeTimers());
	afterEach(() => vi.useRealTimers());

	it("adds and lists items in order", () => {
		const log = useErrorLog();
		log.add("error", "pipeline", "First");
		log.add("warning", "spec", "Second");
		expect(log.errors.value.map((e) => e.message)).toEqual(["First", "Second"]);
	});

	it("gives every item a unique id", () => {
		const log = useErrorLog();
		const ids = [log.add("error", "a", "x").id, log.add("error", "a", "x").id];
		expect(new Set(ids).size).toBe(2);
	});

	it("auto-dismisses info items", () => {
		const log = useErrorLog();
		log.add("info", "pipeline", "Your mystery is ready.");
		expect(log.errors.value).toHaveLength(1);
		vi.advanceTimersByTime(5000);
		expect(log.errors.value).toHaveLength(0);
	});

	it("never auto-dismisses warnings or errors", () => {
		const log = useErrorLog();
		log.add("warning", "pipeline", "Stopped before completion");
		log.add("error", "spec", "Save failed");
		vi.advanceTimersByTime(60_000);
		expect(log.errors.value).toHaveLength(2);
	});

	it("clears its timers on scope disposal — the B9 fix", () => {
		// The old addError left an untracked setTimeout per info item. Same shape as the two polling
		// intervals A_73 had to fix, and as the A_30 defect where a timer outlived its owner.
		const { value: log, dispose } = inScope(() => useErrorLog());
		log.add("info", "pipeline", "one");
		log.add("info", "pipeline", "two");
		expect(log.pendingTimers()).toBe(2);

		dispose();
		expect(log.pendingTimers()).toBe(0);

		// And nothing fires afterwards.
		expect(() => vi.advanceTimersByTime(10_000)).not.toThrow();
	});

	it("forgets a timer once it has fired, so the set cannot grow unbounded", () => {
		const log = useErrorLog();
		log.add("info", "pipeline", "one");
		vi.advanceTimersByTime(5000);
		expect(log.pendingTimers()).toBe(0);
	});

	it("honours autoDismissMs: 0 as 'never'", () => {
		const log = useErrorLog({ autoDismissMs: 0 });
		log.add("info", "pipeline", "sticky");
		vi.advanceTimersByTime(60_000);
		expect(log.errors.value).toHaveLength(1);
		expect(log.pendingTimers()).toBe(0);
	});

	it("dismisses by id and ignores an unknown one", () => {
		const log = useErrorLog();
		const item = log.add("error", "a", "x");
		log.dismiss("error_does_not_exist");
		expect(log.errors.value).toHaveLength(1);
		log.dismiss(item.id);
		expect(log.errors.value).toHaveLength(0);
	});

	it("clears by scope, or entirely", () => {
		const log = useErrorLog();
		log.add("error", "pipeline", "a");
		log.add("error", "spec", "b");
		log.clear("pipeline");
		expect(log.errors.value.map((e) => e.scope)).toEqual(["spec"]);
		log.clear();
		expect(log.errors.value).toHaveLength(0);
	});

	it("returns the action to retry, and forgets it afterwards", () => {
		const log = useErrorLog();
		log.recordFailure({ type: "pipeline" });
		const item = log.add("error", "pipeline", "Run failed");

		expect(log.resolve(item)).toEqual({ type: "pipeline" });
		// A second press must not re-run it.
		expect(log.resolve(item)).toBeNull();
	});

	it("returns null for an info item even when a failure is recorded", () => {
		const log = useErrorLog();
		log.recordFailure({ type: "pipeline" });
		const item = log.add("info", "pipeline", "Your mystery is ready.");
		expect(log.resolve(item)).toBeNull();
	});

	it("reports each item to the activity log once", () => {
		const logged: ErrorItem[] = [];
		const log = useErrorLog({ onLogged: (item) => logged.push(item) });
		log.add("error", "pipeline", "boom");
		expect(logged).toHaveLength(1);
		expect(logged[0].message).toBe("boom");
	});

	it("can be disposed explicitly when there is no scope to own it", () => {
		// Used outside a component, onScopeDispose registers nothing — and the warning it would emit
		// is the only clue. `dispose()` is the supported way out, and it is idempotent.
		const log = useErrorLog();
		log.add("info", "pipeline", "one");
		expect(log.pendingTimers()).toBe(1);
		log.dispose();
		expect(log.pendingTimers()).toBe(0);
		expect(() => log.dispose()).not.toThrow();
	});
});

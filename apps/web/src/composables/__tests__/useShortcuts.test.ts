import { effectScope, ref } from "vue";
import { describe, expect, it, vi } from "vitest";
import { isEditableTarget, matches, useShortcuts, type Shortcut } from "../useShortcuts";

/** A minimal event target that records what is attached, so no real window is needed. */
const fakeTarget = () => {
	let handler: ((e: KeyboardEvent) => void) | null = null;
	return {
		addEventListener: (_type: string, fn: EventListener) => {
			handler = fn as (e: KeyboardEvent) => void;
		},
		removeEventListener: () => {
			handler = null;
		},
		attached: () => handler !== null,
		send: (init: Partial<KeyboardEvent> & { key: string }) => {
			handler?.({ preventDefault: () => {}, ...init } as KeyboardEvent);
		},
	};
};

const press = (key: string, extra: Partial<KeyboardEvent> = {}) =>
	({ key, ctrlKey: false, metaKey: false, altKey: false, shiftKey: false, ...extra }) as KeyboardEvent;

describe("matches", () => {
	const bare: Shortcut = { key: "j", run: () => {} };
	const withCtrl: Shortcut = { key: "1", ctrl: true, run: () => {} };

	it("matches a bare key only when no modifier is held", () => {
		expect(matches(bare, press("j"))).toBe(true);
		// Without this, "j" would also fire on Ctrl+J and steal a browser shortcut.
		expect(matches(bare, press("j", { ctrlKey: true }))).toBe(false);
		expect(matches(bare, press("j", { metaKey: true }))).toBe(false);
	});

	it("treats ctrl and meta as the same binding", () => {
		expect(matches(withCtrl, press("1", { ctrlKey: true }))).toBe(true);
		expect(matches(withCtrl, press("1", { metaKey: true }))).toBe(true);
		expect(matches(withCtrl, press("1"))).toBe(false);
	});

	it("ignores shift unless the binding asks about it", () => {
		// "?" IS shift+/ on most layouts; demanding shift===false would make it unpressable.
		expect(matches({ key: "?", run: () => {} }, press("?", { shiftKey: true }))).toBe(true);
		expect(matches({ key: "?", shift: false, run: () => {} }, press("?", { shiftKey: true }))).toBe(false);
	});

	it("is case-sensitive on letters", () => {
		expect(matches(bare, press("J"))).toBe(false);
	});

	it("checks alt", () => {
		expect(matches({ key: "j", alt: true, run: () => {} }, press("j", { altKey: true }))).toBe(true);
		expect(matches(bare, press("j", { altKey: true }))).toBe(false);
	});
});

describe("isEditableTarget", () => {
	it("recognises the three form elements", () => {
		for (const tagName of ["INPUT", "TEXTAREA", "SELECT"]) {
			expect(isEditableTarget({ tagName } as HTMLElement)).toBe(true);
		}
	});

	it("recognises contenteditable — the case the original guard missed", () => {
		expect(isEditableTarget({ tagName: "DIV", isContentEditable: true } as HTMLElement)).toBe(true);
		expect(isEditableTarget({ tagName: "DIV", isContentEditable: false } as HTMLElement)).toBe(false);
	});

	it("is safe on null and on a non-element target", () => {
		expect(isEditableTarget(null)).toBe(false);
		expect(isEditableTarget({} as EventTarget)).toBe(false);
	});
});

describe("useShortcuts", () => {
	it("runs a matching binding", () => {
		const run = vi.fn();
		const target = fakeTarget();
		const scope = effectScope();
		scope.run(() => useShortcuts([{ key: "j", run }], { target }));

		target.send(press("j"));
		expect(run).toHaveBeenCalledOnce();
		scope.stop();
	});

	it("does not run a bare-letter binding while typing", () => {
		const run = vi.fn();
		const target = fakeTarget();
		const scope = effectScope();
		scope.run(() => useShortcuts([{ key: "j", run }], { target }));

		target.send({ ...press("j"), target: { tagName: "INPUT" } } as never);
		expect(run).not.toHaveBeenCalled();
		scope.stop();
	});

	it("runs a whileTyping binding even in a field — Escape must always work", () => {
		const run = vi.fn();
		const target = fakeTarget();
		const scope = effectScope();
		scope.run(() => useShortcuts([{ key: "Escape", whileTyping: true, run }], { target }));

		target.send({ ...press("Escape"), target: { tagName: "INPUT" } } as never);
		expect(run).toHaveBeenCalledOnce();
		scope.stop();
	});

	it("calls preventDefault only when asked", () => {
		const prevented = vi.fn();
		const target = fakeTarget();
		const scope = effectScope();
		scope.run(() =>
			useShortcuts([{ key: "1", ctrl: true, preventDefault: true, run: () => {} }], { target }),
		);

		target.send({ ...press("1", { ctrlKey: true }), preventDefault: prevented } as never);
		expect(prevented).toHaveBeenCalledOnce();
		scope.stop();
	});

	it("runs only the first match", () => {
		const first = vi.fn();
		const second = vi.fn();
		const target = fakeTarget();
		const scope = effectScope();
		scope.run(() => useShortcuts([{ key: "j", run: first }, { key: "j", run: second }], { target }));

		target.send(press("j"));
		expect(first).toHaveBeenCalledOnce();
		expect(second).not.toHaveBeenCalled();
		scope.stop();
	});

	it("reads the binding list at EVENT time, not at setup", () => {
		// The console's bindings are derived from its tab list, which is computed.
		const run = vi.fn();
		const bindings = ref<Shortcut[]>([]);
		const target = fakeTarget();
		const scope = effectScope();
		scope.run(() => useShortcuts(bindings, { target }));

		target.send(press("j"));
		expect(run).not.toHaveBeenCalled();

		bindings.value = [{ key: "j", run }];
		target.send(press("j"));
		expect(run).toHaveBeenCalledOnce();
		scope.stop();
	});

	it("honours `enabled`", () => {
		const run = vi.fn();
		const enabled = ref(false);
		const target = fakeTarget();
		const scope = effectScope();
		scope.run(() => useShortcuts([{ key: "j", run }], { target, enabled }));

		target.send(press("j"));
		expect(run).not.toHaveBeenCalled();

		enabled.value = true;
		target.send(press("j"));
		expect(run).toHaveBeenCalledOnce();
		scope.stop();
	});

	it("attaches one listener and removes it on scope disposal", () => {
		const target = fakeTarget();
		const scope = effectScope();
		const api = scope.run(() => useShortcuts([{ key: "j", run: () => {} }], { target })) as ReturnType<
			typeof useShortcuts
		>;

		expect(target.attached()).toBe(true);
		expect(api.isAttached()).toBe(true);

		scope.stop();

		expect(target.attached()).toBe(false);
		expect(api.isAttached()).toBe(false);
	});

	it("is safe to detach twice", () => {
		const target = fakeTarget();
		const scope = effectScope();
		const api = scope.run(() => useShortcuts([], { target })) as ReturnType<typeof useShortcuts>;
		api.detach();
		expect(() => api.detach()).not.toThrow();
		scope.stop();
	});
});

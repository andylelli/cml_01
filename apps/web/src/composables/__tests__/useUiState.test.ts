import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STATE_VERSION, STORAGE_KEY, useUiState } from "../useUiState";
import { defaultSpec } from "../../spec/vocabulary";

const sample = () => ({
	projectName: "Golden Age Prototype",
	projectId: "p1",
	latestSpecId: "s1",
	spec: defaultSpec(),
	view: "create",
	mode: "user" as const,
});

describe("useUiState", () => {
	beforeEach(() => localStorage.clear());
	afterEach(() => vi.restoreAllMocks());

	it("round-trips a state", () => {
		const { persist, hydrate } = useUiState();
		expect(persist(sample())).toBe(true);
		expect(hydrate()).toEqual({ version: STATE_VERSION, ...sample() });
	});

	it("returns null when nothing is stored", () => {
		expect(useUiState().hydrate()).toBeNull();
	});

	it("returns null for unparseable JSON rather than throwing", () => {
		localStorage.setItem(STORAGE_KEY, "{not json");
		expect(useUiState().hydrate()).toBeNull();
	});

	it("discards a payload from an older schema instead of half-applying it", () => {
		// B10. Half-applying is how a stale spec field survives a redesign and reaches the pipeline.
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ version: STATE_VERSION - 1, projectName: "old", spec: { decade: "1890s" } }),
		);
		expect(useUiState().hydrate()).toBeNull();
	});

	it("discards an unversioned payload — the shape the previous build wrote", () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ projectName: "old", mode: "expert" }));
		expect(useUiState().hydrate()).toBeNull();
	});

	it("repairs a stored spec rather than handing it to the API", () => {
		// B8. This is the one that can abort a paid run: primaryAxis throws at pipeline init.
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({
				version: STATE_VERSION,
				...sample(),
				spec: { ...defaultSpec(), primaryAxis: "chronological", tone: "Thrilling", castSize: 900 },
			}),
		);
		const state = useUiState().hydrate();
		expect(state?.spec.primaryAxis).toBe(defaultSpec().primaryAxis);
		expect(state?.spec.tone).toBe(defaultSpec().tone);
		expect(state?.spec.castSize).toBe(10);
	});

	it("rejects a mode that is not one of the three", () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ version: STATE_VERSION, ...sample(), mode: "root" }),
		);
		expect(useUiState().hydrate()?.mode).toBe("user");
	});

	it("does not throw when setItem throws — the B7 fix", () => {
		// setItem throws on quota exhaustion and in Safari private browsing. The old persistState had
		// no try/catch and ran inside a DEEP watcher, so one throw stopped all persistence silently.
		vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new DOMException("QuotaExceededError");
		});
		const { persist } = useUiState();
		expect(() => persist(sample())).not.toThrow();
		expect(persist(sample())).toBe(false);
	});

	it("does not throw when storage is blocked entirely", () => {
		vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
			throw new DOMException("SecurityError");
		});
		const { hydrate } = useUiState();
		expect(() => hydrate()).not.toThrow();
		expect(hydrate()).toBeNull();
	});

	it("reports availability without throwing", () => {
		expect(useUiState().available()).toBe(true);
		vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
			throw new DOMException("SecurityError");
		});
		expect(useUiState().available()).toBe(false);
	});

	it("clears without throwing when storage is unavailable", () => {
		vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
			throw new DOMException("SecurityError");
		});
		expect(() => useUiState().clear()).not.toThrow();
	});

	it("leaves no probe key behind", () => {
		useUiState().persist(sample());
		expect(Object.keys(localStorage).filter((k) => k.includes("probe"))).toEqual([]);
	});
});

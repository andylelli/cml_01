import { coerceSpec, type MysterySpec } from "../spec/vocabulary";

/**
 * localStorage persistence for the shell's state.
 *
 * ── THREE BUGS THIS REPLACES (UI-002 §5, B7/B8/B10) ───────────────────────────────────────────
 *
 * B7 — the old `persistState` called `localStorage.setItem` with NO try/catch, while `hydrateState`
 *      had one. setItem throws on quota exhaustion and in Safari private browsing, and it was called
 *      from a DEEP watcher on the spec, so one throw took the watcher down and silently stopped all
 *      persistence for the session.
 *
 * B8 — the old `hydrateState` did `if (saved.spec) spec.value = saved.spec` with no validation. A
 *      spec written by an older build went straight to the API. Combined with `primaryAxis` throwing
 *      at pipeline init, a stale localStorage value could ABORT A PAID RUN. Everything read here now
 *      goes through `coerceSpec`.
 *
 * B10 — there was no schema version, so any future change to the stored shape would be read as
 *      valid. A version lets an unreadable payload be discarded deliberately instead of half-applied.
 */

export const STORAGE_KEY = "cml_ui_state";

/** Bump when the stored shape changes incompatibly. Older payloads are discarded, not migrated. */
export const STATE_VERSION = 2;

export type Mode = "user" | "advanced" | "expert";

export interface PersistedState {
	version: number;
	projectName: string;
	projectId: string | null;
	latestSpecId: string | null;
	spec: MysterySpec;
	view: string;
	mode: Mode;
}

const MODES: readonly Mode[] = ["user", "advanced", "expert"];

/**
 * Whether localStorage can actually be used. Reading `window.localStorage` itself throws when a
 * browser is set to block site data, so the probe has to be inside the try, not around the access.
 */
const storage = (): Storage | null => {
	try {
		const probe = "__cml_probe__";
		window.localStorage.setItem(probe, "1");
		window.localStorage.removeItem(probe);
		return window.localStorage;
	} catch {
		return null;
	}
};

export interface UiStateInput {
	projectName: string;
	projectId: string | null;
	latestSpecId: string | null;
	spec: MysterySpec;
	view: string;
	mode: Mode;
}

export const useUiState = () => {
	/** Never throws. A failed write is a lost convenience, never a broken watcher. */
	const persist = (state: UiStateInput): boolean => {
		const store = storage();
		if (!store) return false;
		try {
			store.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, ...state }));
			return true;
		} catch {
			// Quota exhausted or blocked mid-session. Nothing to do and nothing worth telling the
			// user — the app works, it just will not remember.
			return false;
		}
	};

	/** Returns null when there is nothing usable, so the caller keeps its own defaults. */
	const hydrate = (): PersistedState | null => {
		const store = storage();
		if (!store) return null;

		let raw: string | null = null;
		try {
			raw = store.getItem(STORAGE_KEY);
		} catch {
			return null;
		}
		if (!raw) return null;

		let saved: Partial<PersistedState>;
		try {
			saved = JSON.parse(raw) as Partial<PersistedState>;
		} catch {
			return null;
		}

		if (!saved || typeof saved !== "object") return null;

		// An older or unversioned payload is discarded rather than half-applied. Half-applying is how
		// a stale spec field survives a redesign and reaches the pipeline.
		if (saved.version !== STATE_VERSION) return null;

		return {
			version: STATE_VERSION,
			projectName: typeof saved.projectName === "string" ? saved.projectName : "",
			projectId: typeof saved.projectId === "string" ? saved.projectId : null,
			latestSpecId: typeof saved.latestSpecId === "string" ? saved.latestSpecId : null,
			// B8: never trust a stored spec.
			spec: coerceSpec(saved.spec),
			view: typeof saved.view === "string" ? saved.view : "create",
			mode: MODES.includes(saved.mode as Mode) ? (saved.mode as Mode) : "user",
		};
	};

	const clear = (): void => {
		try {
			storage()?.removeItem(STORAGE_KEY);
		} catch {
			/* nothing to do */
		}
	};

	return { persist, hydrate, clear, available: () => storage() !== null };
};

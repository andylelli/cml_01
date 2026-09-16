import { ref } from "vue";
import { coerceSpec, defaultSpec, type MysterySpec } from "../spec/vocabulary";
import type { Mode } from "./useUiState";

/**
 * THE TWO THINGS THE WHOLE APP SHARES — B13.
 *
 * The shell and the console each held their own `mode` and `spec` refs. Nothing was lost, but a spec
 * configured in Create was not the spec the console showed, and advanced mode had to be turned on
 * again after crossing into the Workshop. Two sources of one truth.
 *
 * Module-level refs rather than a Pinia store: these are two values with no actions, no async and no
 * derived state, and a store for them would be ceremony. The cost is that they are a singleton, so
 * `resetSessionState()` exists for tests — a module singleton that leaks between test files is its
 * own well-known trap.
 *
 * ── WHO PERSISTS THEM ─────────────────────────────────────────────────────────────────────────
 *
 * The SHELL does, through `useUiState`, which owns the versioned schema. The console must not write
 * them to its own key as well: that was B12, and it is the same mistake one level down.
 */

const mode = ref<Mode>("user");
const spec = ref<MysterySpec>(defaultSpec());

export const useSessionState = () => ({ mode, spec });

/** Replace the spec wholesale, repairing anything an older build or a stale payload may carry. */
export const setSpec = (next: Partial<MysterySpec> | null | undefined): void => {
	spec.value = coerceSpec(next);
};

/** Tests only: module singletons outlive a test file otherwise. */
export const resetSessionState = (): void => {
	mode.value = "user";
	spec.value = defaultSpec();
};

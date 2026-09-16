import { readonly, ref } from "vue";
import { createProject, runPipeline, saveSpec } from "../services/api";
import { isPrimaryAxis, type MysterySpec } from "../spec/vocabulary";

/**
 * The one path from a filled-in wizard to a running pipeline: create the project, save the spec,
 * start the run.
 *
 * In the old App.vue these were three handlers that each assumed the previous one had happened, and
 * each set `runStatus` from a different place. Here the sequence is one function with one status, so
 * a failure at any step reports the step it failed at rather than a generic message.
 *
 * ── THE PRE-FLIGHT CHECK ──────────────────────────────────────────────────────────────────────
 *
 * `primaryAxis` is the only spec field whose bad value THROWS at pipeline init — after the project
 * is created, after the spec is saved, and after the run has started costing money. CLAUDE.md's rule
 * for this shape is X60: fail at the cheap end. So it is validated here, before the first network
 * call, and a bad value never reaches the API.
 */

export type CreateStatus =
	| { phase: "idle" }
	| { phase: "creating"; message: string }
	| { phase: "saving"; message: string }
	| { phase: "starting"; message: string }
	| { phase: "started"; message: string; projectId: string; runId: string | null }
	| { phase: "failed"; message: string; detail?: string; step: "validate" | "create" | "save" | "start" };

export interface CreateFlowOptions {
	/** Existing project to reuse. When absent a new one is created. */
	existingProjectId?: () => string | null;
	projectName?: () => string;
	onActivity?: (message: string, payload?: Record<string, unknown>) => void;
}

const message = (error: unknown): string =>
	error instanceof Error ? error.message : String(error);

/** 503 from the API means the worker has no Azure credentials. Say that, not "failed". */
const explain = (raw: string): string =>
	raw.includes("503")
		? "Generation is unavailable: the server has no Azure OpenAI credentials configured."
		: raw;

export const useCreateFlow = (options: CreateFlowOptions = {}) => {
	const status = ref<CreateStatus>({ phase: "idle" });
	const busy = ref(false);

	const fail = (
		step: Extract<CreateStatus, { phase: "failed" }>["step"],
		msg: string,
		detail?: string,
	): CreateStatus => {
		const next: CreateStatus = { phase: "failed", message: msg, detail, step };
		status.value = next;
		options.onActivity?.(`create_failed_${step}`, { detail });
		return next;
	};

	/**
	 * Returns the terminal status rather than throwing, so a caller can render it without a second
	 * try/catch. Never throws.
	 */
	const start = async (spec: MysterySpec): Promise<CreateStatus> => {
		if (busy.value) return status.value;
		busy.value = true;

		try {
			// X60: fail at the cheap end. A bad axis aborts the run AFTER it starts costing.
			if (!isPrimaryAxis(spec.primaryAxis)) {
				return fail(
					"validate",
					"That concealment axis is not one the pipeline knows",
					`"${String(spec.primaryAxis)}" is not one of temporal, spatial, identity, behavioral, authority.`,
				);
			}

			let projectId = options.existingProjectId?.() ?? null;

			if (!projectId) {
				status.value = { phase: "creating", message: "Opening a new case…" };
				try {
					const project = await createProject(options.projectName?.().trim() || "Untitled case");
					projectId = project.id;
					options.onActivity?.("project_created", { projectId });
				} catch (error) {
					return fail("create", "Could not open a new case", explain(message(error)));
				}
			}

			status.value = { phase: "saving", message: "Saving your settings…" };
			try {
				const saved = await saveSpec(projectId, spec);
				options.onActivity?.("spec_saved", { projectId, specId: saved.id });
			} catch (error) {
				return fail("save", "Could not save your settings", explain(message(error)));
			}

			status.value = { phase: "starting", message: "Starting the mystery…" };
			try {
				const started = await runPipeline(projectId);
				const next: CreateStatus = {
					phase: "started",
					message: "Your mystery is being written.",
					projectId,
					runId: started.runId ?? null,
				};
				status.value = next;
				options.onActivity?.("run_started", { projectId, runId: started.runId ?? null });
				return next;
			} catch (error) {
				return fail("start", "Could not start generation", explain(message(error)));
			}
		} finally {
			busy.value = false;
		}
	};

	const reset = (): void => {
		status.value = { phase: "idle" };
	};

	return { status: readonly(status), busy: readonly(busy), start, reset };
};

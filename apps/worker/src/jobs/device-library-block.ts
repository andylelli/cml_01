/**
 * device-library-block.ts — ANALYSIS_74 §8 **DE8**. Plugging in an engine that was already built.
 *
 * ── WHAT WAS FOUND ───────────────────────────────────────────────────────────────────────────────
 *
 * `packages/device-library/` holds eleven curated, schema-validated, era-annotated mechanism patterns
 * — `clock_rewind`, `tidal_window`, `delayed_poison`, `mirror_misdirection`, `recorded_presence`,
 * `concealed_passage`, `string_pulley_lock`, `substituted_identity`, `forged_document_timeline`,
 * `hearth_release`, `trusted_authority_lie` — each with a `requires` / `forbids` era-capability gate,
 * clue archetypes, sources, and a `usage_log`. `retrievePatterns` ranks them by a `noveltyScore` that
 * DECAYS WITH USE. It has golden tests.
 *
 * Grep for consumers outside the package and there are two: `scripts/build-all.mjs`, which compiles
 * it, and a comment in `cml-core/device-binding.ts` explaining that cml-core deliberately does not
 * depend on it. **No pipeline code imported it.** Agent 3b invented five devices from scratch every
 * run while a deterministic, usage-aware, era-checked selector sat on disk — the retrieval-and-
 * recombination architecture designed, built, tested, and never connected.
 *
 * ── WHY THIS IS RECOMBINATION AND NOT A CATALOGUE ────────────────────────────────────────────────
 *
 * The obvious failure mode of handing a model eleven worked examples is that it picks one and files
 * off the serial numbers, and eleven patterns would then become a NEW and smaller monoculture — the
 * exact defect DE5 exists to fix, re-created one layer down. Two guards:
 *
 * 1. The block is framed as RAW MATERIAL TO RECOMBINE, and says so in terms. The instruction asks for
 *    a mechanism that could not be described by any single entry.
 * 2. Retrieval is filtered by era feasibility and ranked most-novel-first, so what the model sees is
 *    already the least-used end of the corpus.
 *
 * It is still true that this narrows the model's search. That is the trade: a narrowed search inside a
 * cell the pipeline has NEVER VISITED is worth more than an open search that returns to the cell it
 * always returns to. If DE9 shows the scheduled run reading as derivative, this block is the first
 * suspect and should be ablated before the scheduler is.
 *
 * ── MAPPING BETWEEN TWO OF THE SIX VOCABULARIES ──────────────────────────────────────────────────
 *
 * A_74 §8.1.7 counted six vocabularies for "what kind of trick is this". This module joins two of
 * them: the scheduler speaks `@cml/novelty`'s 14-value `MechanismFamily`; the library speaks its own
 * 5-value one. The map is explicit and total, and a family with no library coverage returns NO BLOCK
 * rather than a wrong one — retrieving spatial patterns for a poisoning is worse than retrieving
 * nothing, because the model will use what it is given.
 *
 * Flag: `AGENT3B_DEVICE_LIBRARY` (default OFF).
 */

import { retrievePatterns, type DevicePattern, type MechanismFamily as LibFamily, type CmlAxis } from "@cml/device-library";

/**
 * `@cml/novelty` family -> device-library family. `null` means the library has nothing honest to
 * offer for that family and the caller must emit no block.
 */
const FAMILY_MAP: Record<string, LibFamily | null> = {
  locked_room_timing: "timing",
  poison_delayed: "timing",
  recorded_presence: "timing",
  locked_room_key: "spatial_routing",
  impersonation: "identity",
  substituted_body: "identity",
  alibi_fabrication: "authority",
  secret_will_inheritance: "authority",
  information_leak: "authority",
  // No library coverage. Named explicitly so the gap is a decision, not an oversight.
  poison_substitution: null,
  staged_scene: null,
  hidden_accomplice: null,
  disguised_natural_agent: null,
  unconscious_act: null,
};

export const deviceLibraryEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT3B_DEVICE_LIBRARY ?? "").trim());

export interface DeviceLibraryQuery {
  decade: number;
  primaryAxis: CmlAxis;
  /** The scheduled `@cml/novelty` family, when DE5 assigned one. */
  noveltyFamily?: string;
  place?: string;
  /** How many patterns to show. Four is enough to recombine from and short enough to be read. */
  limit?: number;
}

const render = (patterns: DevicePattern[]): string => {
  const lines = patterns.map(
    (p) =>
      `- ${p.title} [${p.family}] — ${p.principle}\n` +
      `    surface: ${p.surface_illusion_template}\n` +
      `    reality: ${p.underlying_reality_template}\n` +
      `    leaves traces of: ${(p.clue_archetypes ?? []).join("; ") || "(unspecified)"}`,
  );
  return (
    `CURATED MECHANISM CORPUS (retrieved for this run's era and axis — raw material, NOT a menu):\n` +
    `${lines.join("\n")}\n` +
    `These are period-verified starting points, ranked least-used first. RECOMBINE them: take the ` +
    `principle of one and the trace-pattern of another, or invert the direction of a single one, so ` +
    `that the mechanism you invent could NOT be described by any single entry above. Do not reproduce ` +
    `one of them with the nouns changed — a renamed entry is the same device and will read as stock. ` +
    `If none of them fits the mechanism assignment for this run, ignore all of them: the assignment ` +
    `wins, and inventing from nothing is better than forcing a listed pattern to be something it is not.`
  );
};

/**
 * The retrieved block, or `""` when there is nothing honest to say — an empty corpus, an unmapped
 * family, or the flag off. The caller concatenates unconditionally, exactly like
 * `buildOpeningFreshnessBlock`.
 */
export const buildDeviceLibraryBlock = (query: DeviceLibraryQuery, env: NodeJS.ProcessEnv = process.env): string => {
  if (!deviceLibraryEnabled(env)) return "";
  try {
    const mapped = query.noveltyFamily ? FAMILY_MAP[query.noveltyFamily] : undefined;
    // An assigned family the library cannot serve => no block. See the header: a wrong retrieval is
    // worse than none, because the model uses what it is given.
    if (query.noveltyFamily && mapped === null) {
      console.warn(
        `[DE8 device-library] no curated patterns for family "${query.noveltyFamily}" — emitting no block. ` +
          "The corpus has 11 patterns across 4 families; this is a coverage gap, not an error.",
      );
      return "";
    }
    const ranked = retrievePatterns({
      decade: query.decade,
      primaryAxis: query.primaryAxis,
      mechanismFamilies: mapped ? [mapped] : undefined,
      place: query.place,
    });
    if (ranked.length === 0) {
      console.warn(
        `[DE8 device-library] retrieval returned 0 patterns for decade=${query.decade} axis=${query.primaryAxis}` +
          `${mapped ? ` family=${mapped}` : ""} — emitting no block.`,
      );
      return "";
    }
    const chosen = ranked.slice(0, query.limit ?? 4).map((r) => r.pattern);
    console.warn(
      `[DE8 device-library] ${ranked.length} feasible pattern(s), using ${chosen.length}: ` +
        chosen.map((p) => p.pattern_id).join(", "),
    );
    return render(chosen);
  } catch (e) {
    // Never fail a run over a prompt enrichment.
    console.warn(`[DE8 device-library] skipped: ${(e as Error).message}`);
    return "";
  }
};

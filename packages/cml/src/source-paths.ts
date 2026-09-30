/**
 * CR-16 (A5-02) — the legal `sourceInCML` paths of a clue, stated once.
 *
 * Five bodies described the same set: the worker's regex whitelist, the worker's strict-whitelist
 * enumerator, prompts-llm's enumerator (a clone plus `CASE.death_method`), the Agent 5 prompt's "Allowed
 * source roots" list, and the worker's retry templates. They are now derived from this table. Step 1 (R1)
 * keeps today's verdicts through `workerLegal`: the prompt still lists `CASE.death_method` and the worker
 * still rejects it. Whether it is legal is step 2 (A5-02, the owner's) — accepting it is what A_67 FIX-2
 * intended.
 *
 * Each regex is DERIVED from its template (`[N]`/`[M]` → an index), so a family is written once.
 */

export interface SourcePathFamily {
  /** The path with `[N]`/`[M]` for indices, as the prompt prints it. */
  template: string;
  /** Accepted by the worker's validator today. */
  workerLegal: boolean;
  /** Position in the worker's retry-feedback template list, when it is one of them. */
  retryRank?: number;
}

export const SOURCE_PATH_FAMILIES: readonly SourcePathFamily[] = [
  { template: "CASE.inference_path.steps[N].observation", workerLegal: true, retryRank: 1 },
  { template: "CASE.inference_path.steps[N].correction", workerLegal: true, retryRank: 2 },
  { template: "CASE.inference_path.steps[N].required_evidence[M]", workerLegal: true, retryRank: 3 },
  { template: "CASE.constraint_space.time.anchors[M]", workerLegal: true, retryRank: 4 },
  { template: "CASE.constraint_space.time.contradictions[M]", workerLegal: true, retryRank: 5 },
  { template: "CASE.constraint_space.access.actors[M]", workerLegal: true },
  { template: "CASE.constraint_space.access.objects[M]", workerLegal: true },
  { template: "CASE.constraint_space.access.permissions[M]", workerLegal: true },
  { template: "CASE.constraint_space.physical.laws[M]", workerLegal: true },
  { template: "CASE.constraint_space.physical.traces[M]", workerLegal: true, retryRank: 8 },
  { template: "CASE.cast[N].alibi_window", workerLegal: true, retryRank: 6 },
  { template: "CASE.cast[N].access_plausibility", workerLegal: true, retryRank: 7 },
  { template: "CASE.cast[N].evidence_sensitivity[M]", workerLegal: true },
  { template: "CASE.discriminating_test.evidence_clues[M]", workerLegal: true },
  { template: "CASE.prose_requirements.clue_to_scene_mapping[M].clue_id", workerLegal: true },
  { template: "CASE.death_method", workerLegal: false },
];

/** `CASE.x[N].y` → /^CASE\.x\[(\d+)\]\.y$/ */
export const sourcePathPattern = (template: string): RegExp =>
  new RegExp(`^${template.replace(/[.[\]]/g, (c) => `\\${c}`).replace(/\\\[[NM]\\\]/g, "\\[(\\d+)\\]")}$`);

/** The worker validator's patterns, in table order. */
export const WORKER_LEGAL_SOURCE_PATTERNS: RegExp[] = SOURCE_PATH_FAMILIES.filter((f) => f.workerLegal).map((f) => sourcePathPattern(f.template));

/** The prompt's "Allowed source roots", in table order. */
export const SOURCE_PATH_PROMPT_ROOTS: string[] = SOURCE_PATH_FAMILIES.map((f) => f.template);

/** The worker's retry-feedback templates, in their rank order. */
export const SOURCE_PATH_RETRY_TEMPLATES: string[] = SOURCE_PATH_FAMILIES
  .filter((f) => f.retryRank !== undefined)
  .sort((a, b) => (a.retryRank ?? 0) - (b.retryRank ?? 0))
  .map((f) => f.template);

/**
 * Every concrete path a case offers, in the order both enumerators always produced (per inference step:
 * observation, correction, its evidence; then the constraint lists; per cast member; the test's evidence; the
 * clue-to-scene mapping) — that order reaches the Agent 5 prompt. `deathMethod` adds `CASE.death_method`
 * when the case has one (prompts-llm's list; the worker's strict whitelist leaves it out).
 */
export function enumerateSourcePaths(caseBlock: any, options: { deathMethod: boolean }): string[] {
  const paths: string[] = [];
  const pushIndexed = (base: string, arr: unknown): void => {
    if (!Array.isArray(arr)) return;
    for (let i = 0; i < arr.length; i += 1) paths.push(`${base}[${i}]`);
  };
  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  for (let i = 0; i < steps.length; i += 1) {
    paths.push(`CASE.inference_path.steps[${i}].observation`);
    paths.push(`CASE.inference_path.steps[${i}].correction`);
    pushIndexed(`CASE.inference_path.steps[${i}].required_evidence`, steps[i]?.required_evidence);
  }
  pushIndexed("CASE.constraint_space.time.anchors", caseBlock?.constraint_space?.time?.anchors);
  pushIndexed("CASE.constraint_space.time.contradictions", caseBlock?.constraint_space?.time?.contradictions);
  pushIndexed("CASE.constraint_space.access.actors", caseBlock?.constraint_space?.access?.actors);
  pushIndexed("CASE.constraint_space.access.objects", caseBlock?.constraint_space?.access?.objects);
  pushIndexed("CASE.constraint_space.access.permissions", caseBlock?.constraint_space?.access?.permissions);
  pushIndexed("CASE.constraint_space.physical.laws", caseBlock?.constraint_space?.physical?.laws);
  pushIndexed("CASE.constraint_space.physical.traces", caseBlock?.constraint_space?.physical?.traces);
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  for (let i = 0; i < cast.length; i += 1) {
    paths.push(`CASE.cast[${i}].alibi_window`);
    paths.push(`CASE.cast[${i}].access_plausibility`);
    pushIndexed(`CASE.cast[${i}].evidence_sensitivity`, cast[i]?.evidence_sensitivity);
  }
  pushIndexed("CASE.discriminating_test.evidence_clues", caseBlock?.discriminating_test?.evidence_clues);
  const clueSceneMap = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
    : [];
  for (let i = 0; i < clueSceneMap.length; i += 1) {
    paths.push(`CASE.prose_requirements.clue_to_scene_mapping[${i}].clue_id`);
  }
  if (options.deathMethod && typeof caseBlock?.death_method === "string" && caseBlock.death_method.trim()) {
    paths.push("CASE.death_method");
  }
  return paths;
}

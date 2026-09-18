/**
 * PROSE ENGINE v2 — ANALYSIS_99 §10.
 *
 * Pure: no LLM client, no worker import. The worker adapts its context into `ContractInput`, calls
 * these, and owns the calls. Every module here is testable against the 66 stored projects.
 */
export const packageName = "@cml/prose-engine";

export * from "./types.js";
export { assignChapterRoles, beatOf } from "./roles.js";
export type { RoleAssignment } from "./roles.js";
export {
  buildContractCore,
  buildChronologyTable,
  assignOwnedShapes,
  decisiveClueIds,
  unwrapCase,
  flattenScenes,
} from "./contract.js";

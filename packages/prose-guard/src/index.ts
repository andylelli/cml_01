/**
 * @cml/prose-guard — Agent 9's prose-safety laws (redesign §4.1–§4.3,
 * documentation/12_system_redesign/15_agent_9_prose_generator.md).
 *
 * Agent 9 is the flagship rebuild: the easiest job in the pipeline (render a proof already proven)
 * made the largest, costliest, most defect-prone component by judging prose with regexes and
 * repairing it with string edits. This package is **Phase A** — the safety laws that make its three
 * worst shipped defects structurally impossible, with NO upstream dependency:
 *
 *   - `mutateThenValidate` — validation-gated mutation (§4.2): no deterministic pass ships text it
 *     didn't re-validate. Stops the §3.2 grounding-lead leak and §3.3 pronoun flip cold.
 *   - `generateWithBackstop` — the universal best-draft backstop (§4.3): a run can never die with no
 *     story. Generalises the ANALYSIS_44 opener-exhaustion allowlist (§3.1) into one terminal law.
 *   - `deriveChapterContracts` + `checkContractFidelity` — the chapter-as-contract (§4.1): fidelity is
 *     a machine-checked property (clue surfaced by its chapter, nothing revealed early), not a regex.
 *
 * Pure, no LLM, NOT wired into the pipeline. The LLM critic (§4.3) and whole-book context (§4.4) are
 * gated later phases; the live deletions land only behind these laws (§7).
 */

export const packageName = "@cml/prose-guard";

export type {
  ClueSurfaceObligation,
  ChapterObligationContract,
  ValidatorResult,
  Validator,
  MutationOutcome,
  FidelityViolationKind,
  FidelityViolation,
  FidelityReport,
  ScoredDraft,
  AcceptReason,
  BackstopResult,
} from "./types.js";

export { mutateThenValidate, allOf } from "./mutate.js";
export { BestDraftTracker, generateWithBackstop } from "./backstop.js";
export type { ScoredAttempt, BackstopOptions } from "./backstop.js";
export { deriveChapterContracts } from "./contract.js";
export type { SceneInput, ContractDerivationOptions } from "./contract.js";
export {
  checkContractFidelity,
  makeFidelityValidator,
  revealsCulprit,
  detectLocationMetadataDump,
  noMetadataDumpValidator,
  detectTemplateLeakage,
  noTemplateLeakageValidator,
  countMisgenderedPronouns,
  pronounConsistencyValidator,
} from "./fidelity.js";
export type { FidelityOptions } from "./fidelity.js";
export {
  detectScaffoldNotProse,
  noScaffoldValidator,
  detectReportStyleClearance,
  noReportStyleClearanceValidator,
} from "./scaffold.js";
export type { ScaffoldHit } from "./scaffold.js";

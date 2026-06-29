/**
 * @cml/novelty — novelty as abstract structural fingerprints + an explainable verdict (Agent 8
 * redesign, documentation/12_system_redesign/14_agent_8_novelty_auditor.md).
 *
 * Today's Agent 8 is an expensive, seed-only, magic-number gate that runs AFTER the costliest
 * artifact is built — and in production it is switched off by a threshold of 1.1 that can never fire.
 * This package is the offline foundation of the redesign: the `Fingerprint` schema "the whole
 * redesign is built on", the seed + genre-cliche ledgers (the corpus the seed-only design is blind
 * to), the deterministic structural compare → explainable `NoveltyVerdict`, and a cross-run store.
 *
 * Pure, no LLM, NOT wired into the pipeline. The LLM fingerprint extractor + structural judge (§4.3)
 * and the live NOVELTY_MODE flag (§9.7) are the gated next phases.
 */

export const packageName = "@cml/novelty";

export type {
  Axis,
  MechanismFamily,
  DiscriminatingTestShape,
  Corpus,
  Fingerprint,
  Skeleton,
  Verdict,
  SharedField,
  NoveltyVerdict,
} from "./types.js";

export {
  loadSeedFingerprints,
  loadClicheLedger,
  loadReferenceCorpus,
  validateFingerprint,
} from "./loader.js";

export { judgeNovelty, sharedFields, TRICK_SHARED_FOR_VARIATION, CLONE_MIN_SHARED } from "./compare.js";
export { NoveltyStore, judgeAgainstAll } from "./store.js";

// A_56 8-A — the LLM skeleton-extractor (§9.1-spike-2): the only way to produce the hand-authored
// `false_assumption_pattern` / `inference_shape` labels the structural judge gates on. Pure prompt +
// parser behind a `ChatFn` seam; the worker supplies the chat fn and runs it SHADOW.
export type { ChatFn, ChatArgs, ChatMessage, SkeletonExtractorOptions } from "./extractor.js";
export {
  createSkeletonExtractor,
  buildSkeletonExtractionMessages,
  parseSkeletonResponse,
} from "./extractor.js";

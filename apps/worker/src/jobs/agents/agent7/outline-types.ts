/**
 * A7-04 — the outline types the Agent 7 phases read and stamp, declared once.
 *
 * `@cml/prompts-llm`'s `Scene` is the shape the model is asked to return. The worker then stamps
 * further fields onto the committed scenes (plants, the World-First enrichment, the per-scene gates)
 * that the type never named, so every read and write of them went through `as any`. They are declared
 * here, as a worker-side extension, rather than in prompts-llm. Type-only: nothing in this module
 * exists at run time.
 */
import type { Clue, Scene } from "@cml/prompts-llm";

/** Fields the worker stamps onto an outline scene after `formatNarrative` returns it. All optional. */
export interface OutlineSceneStamps {
  /** A_64 C1 / X52 — clue ids planted (incidentally) before their reveal. */
  cluesPlanted?: string[];
  /** DIAGNOSIS-BATCH #2 — the culprit whose motive beat this scene owes. */
  motiveBeatCulprit?: string;
  /** World-First enrichment (`applyWorldFirstSceneEnrichment`). */
  emotionalRegister?: string;
  dominantCharacterNote?: { name: string; voiceRegister: string };
  humourGuidance?: { permission: string; character?: string; form?: string; condition?: string };
  eraTextureNote?: string;
  locationRegisterNote?: string;
  /** Read by the World-First enrichment; not in the outline schema. */
  locationId?: string;
  /** A_52 item 4 — `stampMechanismRevealGate`. */
  mechanismRevealAllowed?: boolean;
  /** X32 — `stampSuspectClearanceGate`. */
  suspectClearanceAllowed?: boolean;
}

/** An outline scene as the worker sees it: the model's `Scene` plus the worker's stamps. */
export type OutlineScene = Scene & OutlineSceneStamps;

/**
 * A live Agent-5 clue as the stamping passes read it: the typed `Clue` plus two fields some
 * distributions carry and the type does not name. Read defensively (`Array.isArray`, `=== true`).
 */
export type LiveClue = Clue & { keyTerms?: unknown; isDeathMethodTell?: unknown };

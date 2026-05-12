import type { CaseData } from "@cml/cml";
import type { NarrativeOutline } from "../agent7-narrative.js";
import type { ClueDistributionResult } from "../agent5-clues.js";
import type { NarrativeState } from "../types/narrative-state.js";
import type { Asset, AssetLibrary } from "../types/asset-library.js";
import { selectChapterAtoms } from "../asset-library.js";
import {
  computeChapterObligation,
  validateChapterReadiness,
  type ChapterObligation,
} from "./chapter-obligation-contract.js";
import type { RetryPacket } from "../retry-protocol.js";

export interface ProseRequestContract {
  caseData: CaseData;
  outline: NarrativeOutline;
  obligation: ChapterObligation;
  activeCharacterNames: Set<string>;
  activeLocationNames: Set<string>;
  obligationAtoms: Asset[];
  textureAtoms: Asset[];
  narrativeState: NarrativeState;
  retryFeedback?: {
    fromAttempt: number;
    failureClass: RetryPacket["failureClass"];
    directives: string[];
  };
  requestFingerprintSeed: string;
}

const normalizeLocationName = (value: unknown): string =>
  String(value ?? "").trim().toLowerCase();

export function buildProseRequestContract(args: {
  caseData: CaseData;
  outline: NarrativeOutline;
  clueDistribution?: ClueDistributionResult;
  batchScenes: any[];
  chapterStart: number;
  targetLength: "short" | "medium" | "long";
  assetLibrary: AssetLibrary;
  narrativeState: NarrativeState;
  retryPacket?: RetryPacket;
}): ProseRequestContract {
  const {
    caseData,
    outline,
    clueDistribution,
    batchScenes,
    chapterStart,
    targetLength,
    assetLibrary,
    narrativeState,
    retryPacket,
  } = args;

  const activeCharacterNames = new Set<string>(
    batchScenes
      .flatMap((scene: any) => (Array.isArray(scene?.characters) ? scene.characters : []))
      .map((name: unknown) => String(name).trim())
      .filter(Boolean),
  );

  const activeLocationNames = new Set<string>(
    batchScenes
      .map((scene: any) => normalizeLocationName(scene?.setting?.location))
      .filter(Boolean),
  );

  const obligation = computeChapterObligation({
    chapterNumber: chapterStart,
    targetLength,
    batchScenes,
    outline,
    cml: caseData,
    clueDistribution,
    narrativeState,
  });

  const readiness = validateChapterReadiness(obligation);
  if (!readiness.passed) {
    throw new Error(
      `Chapter obligation contract failed for chapter ${chapterStart}: ${readiness.blockers.join(" | ")}`,
    );
  }

  const { obligationAtoms, textureAtoms } = selectChapterAtoms(
    assetLibrary,
    activeCharacterNames,
    activeLocationNames,
    narrativeState.deployedAssets ?? {},
    obligation.arcPosition,
  );

  const retryFeedback = retryPacket
    ? {
        fromAttempt: retryPacket.attempt,
        failureClass: retryPacket.failureClass,
        directives: [...retryPacket.mustFix],
      }
    : undefined;

  const requestFingerprintSeed = [
    `chapter:${chapterStart}`,
    `arc:${obligation.arcPosition}`,
    `chars:${Array.from(activeCharacterNames).sort().join(",")}`,
    `locs:${Array.from(activeLocationNames).sort().join(",")}`,
    `obligationAtoms:${obligationAtoms.map((a) => a.id).sort().join(",")}`,
    `textureAtoms:${textureAtoms.map((a) => a.id).sort().join(",")}`,
    `retry:${retryPacket?.failureClass ?? "none"}`,
  ].join("|");

  return {
    caseData,
    outline,
    obligation,
    activeCharacterNames,
    activeLocationNames,
    obligationAtoms,
    textureAtoms,
    narrativeState,
    retryFeedback,
    requestFingerprintSeed,
  };
}

export function validateRequestContract(contract: ProseRequestContract): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!contract.caseData || typeof contract.caseData !== "object") {
    errors.push("Missing case data in prose request contract.");
  }
  if (!contract.outline || !Array.isArray(contract.outline.acts)) {
    errors.push("Missing or malformed narrative outline in prose request contract.");
  }
  if (!contract.narrativeState || typeof contract.narrativeState !== "object") {
    errors.push("Missing narrative state in prose request contract.");
  }

  const invalidObligationAtoms = contract.obligationAtoms.filter((atom) => atom.tier !== "obligation");
  if (invalidObligationAtoms.length > 0) {
    errors.push(
      `Invalid obligation atom tier(s): ${invalidObligationAtoms.map((atom) => atom.id).join(", ")}`,
    );
  }

  const contradictoryClues = contract.obligation.mandatoryCluesToReveal.filter((id) =>
    contract.obligation.cluesNotYetRevealed.includes(id),
  );
  if (contradictoryClues.length > 0) {
    errors.push(`Contradictory clue obligations: ${contradictoryClues.join(", ")}`);
  }

  if (contract.requestFingerprintSeed.trim().length === 0) {
    errors.push("Missing request fingerprint seed.");
  }

  return { valid: errors.length === 0, errors };
}

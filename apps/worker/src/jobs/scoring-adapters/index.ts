// Barrel re-export — identical public API to the original scoring-adapters.ts
// All consumers that previously imported from "./scoring-adapters.js" now use
// "./scoring-adapters/index.js" (or "./scoring-adapters/index.ts") unchanged.

export type { ClueRef, ClueEvidenceAnchor, ClueEvidenceState, ClueEvidenceExtractionResult } from "./shared.js";



export type { CharacterProfile, CharacterProfilesOutput } from "./agent2b-scoring-adapter.js";
export { adaptCharacterProfilesForScoring } from "./agent2b-scoring-adapter.js";


export type { ScorerTemporalContextOutput } from "./agent2d-scoring-adapter.js";
export { adaptTemporalContextForScoring } from "./agent2d-scoring-adapter.js";





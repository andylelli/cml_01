// Barrel re-export — identical public API to the original scoring-adapters.ts
// All consumers that previously imported from "./scoring-adapters.js" now use
// "./scoring-adapters/index.js" (or "./scoring-adapters/index.ts") unchanged.
//
// SCO-Q07 (2026-10-02): the Agent 2b and 2d adapters are deleted with the vanity scorers they fed — the honest
// scorers read the real artifacts. Nothing imports this barrel now; the shared types are kept for the record.

export type { ClueRef, ClueEvidenceAnchor, ClueEvidenceState, ClueEvidenceExtractionResult } from "./shared.js";

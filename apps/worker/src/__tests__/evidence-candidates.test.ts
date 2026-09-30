import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { BACKFILL_WEIGHTS, SELECTION_WEIGHTS, discriminatingTestTokens, scoreEvidenceCandidate } from "../jobs/clue-contracts/evidence-candidates.js";

/**
 * CR-16 (A5-03) — the shared scorer against VERBATIM copies of the three bodies it replaced, over every clue
 * of every golden bundle, so each site keeps its exact scores.
 */
const DIR = join(__dirname, "..", "..", "..", "..", "eval", "golden");
const bundles = readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync(join(DIR, f), "utf8")));

const oldTokens = (caseBlock: any) => {
  const discrimText = `${String(caseBlock?.discriminating_test?.design ?? "")} ${String(caseBlock?.discriminating_test?.knowledge_revealed ?? "")}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");
  return new Set(discrimText.split(/\s+/).filter((t) => t.length >= 5));
};
const oldGatesTokens = (node: any) => {
  const designText = String(node.design ?? "").toLowerCase();
  const knowledgeText = String(node.knowledge_revealed ?? "").toLowerCase();
  return new Set(`${designText} ${knowledgeText}`.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length >= 5));
};
const oldBackfill = (c: any, tokens: Set<string>) => {
  const text = `${String(c?.description ?? "")} ${String(c?.pointsTo ?? "")}`.toLowerCase();
  let score = 0;
  for (const token of tokens) if (text.includes(token)) score += 1;
  if (c?.placement === "early" || c?.placement === "mid") score += 2;
  if (c?.evidenceType === "observation" || c?.evidenceType === "contradiction") score += 1;
  return score;
};
const oldSelection = (c: any, tokens: Set<string>) => {
  const text = `${String(c?.description ?? "")} ${String(c?.pointsTo ?? "")}`.toLowerCase();
  let score = 0;
  for (const token of tokens) if (text.includes(token)) score += 1;
  if (c?.criticality === "essential") score += 2;
  if (c?.placement === "early" || c?.placement === "mid") score += 1;
  if (c?.evidenceType === "observation" || c?.evidenceType === "contradiction") score += 1;
  return score;
};

describe("evidence-candidate scoring (A5-03)", () => {
  it("reproduces all three old bodies on every golden clue", () => {
    let compared = 0;
    for (const b of bundles) {
      const caseBlock = b.artifacts?.cml?.CASE ?? b.artifacts?.cml;
      const clues = b.artifacts?.clues?.clues ?? [];
      const tokens = discriminatingTestTokens(caseBlock?.discriminating_test);
      expect([...tokens]).toEqual([...oldTokens(caseBlock)]);
      expect([...tokens]).toEqual([...oldGatesTokens(caseBlock?.discriminating_test ?? {})]);
      for (const c of clues) {
        expect(scoreEvidenceCandidate(c, tokens, BACKFILL_WEIGHTS)).toBe(oldBackfill(c, tokens));
        expect(scoreEvidenceCandidate(c, tokens, SELECTION_WEIGHTS)).toBe(oldSelection(c, tokens));
        compared += 1;
      }
    }
    expect(compared).toBeGreaterThan(20);
  });
});

/**
 * Device library — deterministic retrieval (Agent 3b redesign §4.1 / §9.1 Spike A).
 *
 * The cheap, NON-LLM filter that replaces the five-device brainstorm fan-out: given a run's era,
 * primary axis, and mechanism-family directives, return the compatible patterns ranked by novelty
 * (least-used first). The LLM later recombines from this shortlist; retrieval itself never calls a
 * model.
 */

import { loadPatterns } from "./loader.js";
import type { DevicePattern, RankedPattern, RetrievalQuery } from "./types.js";

const toDecade = (yearOrDecade: number): number => Math.floor(yearOrDecade / 10) * 10;

/** Novelty: 1 when never used, decreasing with usage_log length. */
export const noveltyScore = (pattern: DevicePattern): number =>
  1 / (1 + (pattern.usage_log?.length ?? 0));

const matches = (pattern: DevicePattern, query: RetrievalQuery): boolean => {
  const decade = toDecade(query.decade);
  if (!pattern.feasibility.eras.includes(decade)) return false;
  if (!pattern.axes.includes(query.primaryAxis)) return false;
  if (query.mechanismFamilies && query.mechanismFamilies.length > 0) {
    if (!query.mechanismFamilies.includes(pattern.family)) return false;
  }
  if (query.place && pattern.feasibility.places && pattern.feasibility.places.length > 0) {
    if (!pattern.feasibility.places.includes(query.place)) return false;
  }
  return true;
};

/**
 * Retrieve the patterns compatible with `query`, ranked most-novel-first (tie-broken by id for
 * determinism). Pass an explicit `patterns` set in tests; defaults to the seeded corpus.
 */
export function retrievePatterns(query: RetrievalQuery, patterns: DevicePattern[] = loadPatterns()): RankedPattern[] {
  return patterns
    .filter((p) => matches(p, query))
    .map((pattern) => ({
      pattern,
      noveltyScore: noveltyScore(pattern),
      matchedFamily: !query.mechanismFamilies?.length || query.mechanismFamilies.includes(pattern.family),
      matchedAxis: pattern.axes.includes(query.primaryAxis),
    }))
    .sort((a, b) => b.noveltyScore - a.noveltyScore || a.pattern.pattern_id.localeCompare(b.pattern.pattern_id));
}

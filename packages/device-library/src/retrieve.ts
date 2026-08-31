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

/**
 * A corpus-derived pattern is one whose `sources` cite a file in `library/works/`. That is the
 * authored fact, not a naming convention — a pattern is corpus-derived because it was generated from
 * a validator-clean case, and the citation is the only place that is recorded.
 */
const isCorpusPattern = (pattern: DevicePattern): boolean =>
  (pattern.sources ?? []).some((s) => String(s).includes("library/works/"));

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
  const ranked = patterns
    .filter((p) => matches(p, query))
    .map((pattern) => ({
      pattern,
      noveltyScore: noveltyScore(pattern),
      matchedFamily: !query.mechanismFamilies?.length || query.mechanismFamilies.includes(pattern.family),
      matchedAxis: pattern.axes.includes(query.primaryAxis),
    }))
    .sort((a, b) => b.noveltyScore - a.noveltyScore || a.pattern.pattern_id.localeCompare(b.pattern.pattern_id));

  /**
   * A_79 §14 — INTERLEAVE THE SOURCES, because the novelty score is a total tie and the tiebreak
   * decided everything.
   *
   * `noveltyScore` is 1 for every pattern that has never been used, and nothing has ever been used:
   * MEASURED in the 2026-08-31 canary, all 20 patterns scored exactly 1. So the `localeCompare`
   * tiebreak was the whole ranking — and the curated eleven are named `clock_rewind`,
   * `concealed_passage`, `delayed_poison`… while corpus patterns are named after their works
   * (`a_jury_of_her_peers`, `the_big_bow_mystery`). Alphabetically the curated set wins every time,
   * the caller takes the top 4, and the corpus landed at positions 5-9.
   *
   * The result was a flag that loaded 9 extra patterns and changed not one byte of any prompt.
   * Retrieval was never the problem — `the_clue_of_the_twisted_candle` WAS retrieved, sixth of seven.
   *
   * This is the second instance of the same defect in one day: `buildNoveltyConstraints` cut its seed
   * titles with an alphabetical `slice(0, 8)`, which meant Trent's Last Case could never be named.
   * An arbitrary-but-CONSTANT tiebreak in front of a fixed-size cut is not a tiebreak, it is a
   * silent allowlist.
   *
   * Interleaving rather than re-scoring keeps the honest part: nothing here knows that a corpus
   * pattern is BETTER than a curated one, only that a cut of 4 should not be able to exclude an
   * entire source. Order within each source is unchanged, so the result stays deterministic.
   */
  const corpus = ranked.filter((r) => isCorpusPattern(r.pattern));
  const curated = ranked.filter((r) => !isCorpusPattern(r.pattern));
  if (corpus.length === 0 || curated.length === 0) return ranked;
  const woven: RankedPattern[] = [];
  for (let i = 0; i < Math.max(curated.length, corpus.length); i += 1) {
    if (i < curated.length) woven.push(curated[i]);
    if (i < corpus.length) woven.push(corpus[i]);
  }
  return woven;
}

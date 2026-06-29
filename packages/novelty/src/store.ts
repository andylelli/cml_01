/**
 * The cross-run novelty store (Agent 8 redesign §4.4) — the guard the current design structurally
 * cannot have, because it only ever looks at the static seeds. Every *shipped* skeleton's fingerprint
 * is appended here; each new candidate is checked against the last N, catching mode collapse the
 * moment run #200 starts to resemble run #50.
 *
 * This is the pure in-memory core (append-only, tiny). A file/KV-backed persistence wrapper is a thin
 * later/live concern; the comparison logic — the part worth testing — lives here.
 */

import { judgeNovelty } from "./compare.js";
import type { Fingerprint, NoveltyVerdict, Skeleton } from "./types.js";

// A_53 P11 (prior-run-store-unbounded-vs-ledger-cap): mirror the fs ledger's MAX_LEDGER_ENTRIES=500
// so the in-memory store has the same bounded growth/window semantics (no latent unbounded leak).
const DEFAULT_MAX_ENTRIES = 500;

export class NoveltyStore {
  private readonly shipped: Fingerprint[] = [];
  private readonly maxEntries: number;

  constructor(initial: Fingerprint[] = [], maxEntries: number = DEFAULT_MAX_ENTRIES) {
    // A_53 P11 (prior-run-store-unbounded-vs-ledger-cap): a non-positive cap disables bounding.
    this.maxEntries = maxEntries > 0 ? maxEntries : Number.POSITIVE_INFINITY;
    for (const fp of initial) this.shipped.push({ ...fp, corpus: "prior_run" });
    this.trim();
  }

  // A_53 P11 (prior-run-store-unbounded-vs-ledger-cap): keep only the most recent maxEntries,
  // matching the fs ledger's `.slice(-MAX_LEDGER_ENTRIES)`.
  private trim(): void {
    if (this.shipped.length > this.maxEntries) {
      this.shipped.splice(0, this.shipped.length - this.maxEntries);
    }
  }

  /** Append a shipped skeleton (tagged as a prior run). */
  append(skeleton: Skeleton & { id: string }): void {
    this.shipped.push({
      id: skeleton.id,
      corpus: "prior_run",
      axis: skeleton.axis,
      mechanism_family: skeleton.mechanism_family,
      false_assumption_pattern: skeleton.false_assumption_pattern,
      discriminating_test_shape: skeleton.discriminating_test_shape,
      inference_shape: skeleton.inference_shape,
      premise: skeleton.premise,
    });
    this.trim();
  }

  /** The most recent N shipped fingerprints (the comparison window). */
  recent(n: number): Fingerprint[] {
    return n <= 0 ? [] : this.shipped.slice(-n);
  }

  all(): Fingerprint[] {
    return [...this.shipped];
  }

  /** Judge a candidate against the last N shipped runs — detects cross-run mode collapse. */
  judge(skeleton: Skeleton, windowN = 20): NoveltyVerdict {
    return judgeNovelty(skeleton, this.recent(windowN));
  }
}

// A_53 P10 (O(n*m)-similarity-scan-uncached): concatenate the three corpora once. A retry loop
// judging the same corpus repeatedly should build this once/run and pass the result straight to
// `judgeNovelty`, instead of re-spreading the arrays on every candidate.
export function buildCorpus(corpora: {
  seeds?: Fingerprint[];
  cliches?: Fingerprint[];
  priorRuns?: Fingerprint[];
}): Fingerprint[] {
  return [...(corpora.seeds ?? []), ...(corpora.cliches ?? []), ...(corpora.priorRuns ?? [])];
}

/**
 * Judge a candidate against all three corpora at once (§4.4) and return the worst verdict — seeds,
 * cliches, and recent prior runs treated identically.
 */
export function judgeAgainstAll(
  skeleton: Skeleton,
  corpora: { seeds?: Fingerprint[]; cliches?: Fingerprint[]; priorRuns?: Fingerprint[] },
): NoveltyVerdict {
  // A_53 P10 (O(n*m)-similarity-scan-uncached): share the corpus-build path with `buildCorpus`.
  return judgeNovelty(skeleton, buildCorpus(corpora));
}

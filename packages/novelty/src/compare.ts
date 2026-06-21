/**
 * The deterministic structural compare (Agent 8 redesign §4.3 cheap leg + §4.5 verdict).
 *
 * This is the fast, free, sighted triage: it compares the candidate skeleton's *abstract structure*
 * (not its surface text) against a corpus and returns a typed, explainable `NoveltyVerdict`. The
 * §4.3 LLM structural judge runs only on what this flags as a near neighbour (the gated leg); this
 * deterministic core already separates `clone` / `variation` / `distinct` by how many — and which —
 * structural axes are shared. The threshold is one honest integer, not five opaque decimals (§4.5).
 */

import type { Fingerprint, NoveltyVerdict, SharedField, Skeleton, Verdict } from "./types.js";

/**
 * §4.5's honest knobs. A mystery's identity lives in the *false-assumption pattern* (the reader's
 * load-bearing wrong belief) plus the *trick* (mechanism + inference shape); `axis` and
 * `discriminating_test_shape` are coarse buckets many cases share coincidentally. So:
 *   - sharing the false assumption AND ≥1 trick element  → clone (the same mystery in new clothes),
 *   - sharing the false assumption alone, or ≥2 trick elements → variation,
 *   - otherwise (only coarse overlap, or one trick element) → distinct.
 */
export const TRICK_SHARED_FOR_VARIATION = 2; // two of {mechanism, inference} with no shared belief
export const CLONE_MIN_SHARED = 4; // or near-total overlap regardless of which fields

const FIELDS: SharedField[] = [
  "axis",
  "mechanism_family",
  "false_assumption_pattern",
  "discriminating_test_shape",
  "inference_shape",
];

const TRICK_FIELDS: SharedField[] = ["mechanism_family", "inference_shape"];

const norm = (s: string): string => s.trim().toLowerCase();

/** The abstract fields the candidate shares with a fingerprint. */
export function sharedFields(skeleton: Skeleton, fp: Fingerprint): SharedField[] {
  return FIELDS.filter((f) => norm(String(skeleton[f] ?? "")) === norm(String(fp[f] ?? "")));
}

function severity(shared: SharedField[]): Verdict {
  const sharesBelief = shared.includes("false_assumption_pattern");
  const trickShared = shared.filter((f) => TRICK_FIELDS.includes(f)).length;
  // same wrong belief + same trick (or near-total overlap) = the same mystery in new clothes (§4.6)
  if ((sharesBelief && trickShared >= 1) || shared.length >= CLONE_MIN_SHARED) return "clone";
  // same wrong belief alone, or two trick elements without it = a structural variation
  if (sharesBelief || trickShared >= TRICK_SHARED_FOR_VARIATION) return "variation";
  return "distinct";
}

const RANK: Record<Verdict, number> = { distinct: 0, variation: 1, clone: 2 };

const LABEL: Record<SharedField, string> = {
  axis: "axis",
  mechanism_family: "mechanism",
  false_assumption_pattern: "false-assumption pattern",
  discriminating_test_shape: "discriminating-test shape",
  inference_shape: "inference shape",
};

function relation(skeleton: Skeleton, shared: SharedField[]): string {
  if (shared.length === 0) return "no shared abstract structure";
  return "shares " + shared.map((f) => `${LABEL[f]} '${skeleton[f]}'`).join(" + ");
}

function divergenceDirective(skeleton: Skeleton, shared: SharedField[], verdict: Verdict): string {
  if (verdict === "distinct") return "Sufficiently distinct from the corpus — proceed.";
  const parts: string[] = [];
  if (shared.includes("false_assumption_pattern")) parts.push(`change the false assumption (currently '${skeleton.false_assumption_pattern}')`);
  if (shared.includes("mechanism_family")) parts.push(`drop the ${skeleton.mechanism_family} mechanism`);
  if (shared.includes("inference_shape")) parts.push(`reshape the deduction away from '${skeleton.inference_shape}'`);
  if (shared.includes("discriminating_test_shape") && parts.length < 2) parts.push(`force the truth a different way than ${skeleton.discriminating_test_shape}`);
  if (shared.includes("axis") && parts.length === 0) parts.push(`move off the ${skeleton.axis} axis`);
  return `Keep what is distinctive, but ${parts.join("; ")}.`;
}

/**
 * Judge a candidate skeleton against a corpus, returning the worst (highest-severity, then closest)
 * neighbour and an explainable verdict. Pure and deterministic.
 */
export function judgeNovelty(skeleton: Skeleton, corpus: Fingerprint[]): NoveltyVerdict {
  if (corpus.length === 0) {
    return { verdict: "distinct", nearest: null, shared_structure: [], divergence_directive: "No corpus supplied — proceed." };
  }
  const scored = corpus.map((fp) => {
    const shared = sharedFields(skeleton, fp);
    return { fp, shared, verdict: severity(shared) };
  });
  // worst neighbour: highest severity, then most shared fields, then id for determinism
  scored.sort(
    (a, b) =>
      RANK[b.verdict] - RANK[a.verdict] ||
      b.shared.length - a.shared.length ||
      a.fp.id.localeCompare(b.fp.id),
  );
  const best = scored[0];
  return {
    verdict: best.verdict,
    nearest: { corpus: best.fp.corpus, id: best.fp.id, relation: relation(skeleton, best.shared) },
    shared_structure: best.shared,
    divergence_directive: divergenceDirective(skeleton, best.shared, best.verdict),
  };
}

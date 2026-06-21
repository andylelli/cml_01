/**
 * Period KB — deterministic anachronism linter.
 *
 * Replaces the old generator-as-its-own-auditor pattern (where Agent 1 had to certify its
 * own `realism.anachronisms: []` or the whole run died). This is a SEPARATE, deterministic
 * mechanism that validates authored atmosphere text AGAINST the KB entry it was given.
 *
 * Two guarantees that make it safe to put in the pipeline:
 *   - It is a CHECKER, not a generator: in strip mode it only ever REMOVES offending
 *     sentences, so its output is always a subset of its input (it can never add a fact).
 *   - It has a BACKSTOP, not a kill-switch: callers act on `violations` (targeted re-roll,
 *     then a neutral stub) instead of aborting the run.
 */

import { ANACHRONISM_SURFACE_TERMS, resolveTermAvailability } from "./internal.js";
import type { EraEntry } from "./types.js";

export interface AnachronismViolation {
  /** Canonical KB token the surface phrase resolved to (deduped key). */
  term: string;
  /** The exact phrase found in the text. */
  surface: string;
  /** Character index of the match in the input text. */
  index: number;
  /** Why the KB considers it anachronistic (e.g. "not_yet_invented"). */
  basis: string;
}

export interface LintResult {
  ok: boolean;
  violations: AnachronismViolation[];
  /** Present only when `{ strip: true }`: the input with offending sentences removed. */
  strippedText?: string;
}

export interface LintOptions {
  /** When true, also return `strippedText` with offending sentences removed. */
  strip?: boolean;
}

const escapeRegExp = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Longest phrases first so "fluorescent lighting" wins over "fluorescent" for the same span.
const SCAN_TERMS = [...ANACHRONISM_SURFACE_TERMS].sort((a, b) => b.length - a.length);

const splitSentences = (text: string): string[] => {
  const parts = text.match(/[^.!?]+[.!?]*\s*/g);
  return parts ?? (text ? [text] : []);
};

/**
 * Lint authored atmosphere `text` against era `entry`. Flags any scanned surface phrase
 * that the KB says was unavailable in that period. Each canonical anachronism is reported
 * once (earliest position wins).
 */
export function lint(text: string, entry: EraEntry, opts: LintOptions = {}): LintResult {
  const byCanonical = new Map<string, AnachronismViolation>();

  for (const surface of SCAN_TERMS) {
    const resolution = resolveTermAvailability(entry, surface);
    if (resolution.available !== false) {
      continue; // available (or unknown) in this period — not an anachronism
    }
    const re = new RegExp(`\\b${escapeRegExp(surface)}\\b`, "gi");
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
      const existing = byCanonical.get(resolution.canonical);
      if (!existing || match.index < existing.index) {
        byCanonical.set(resolution.canonical, {
          term: resolution.canonical,
          surface: match[0],
          index: match.index,
          basis: resolution.basis,
        });
      }
    }
  }

  const violations = [...byCanonical.values()].sort((a, b) => a.index - b.index);
  const result: LintResult = { ok: violations.length === 0, violations };

  if (opts.strip) {
    if (violations.length === 0) {
      result.strippedText = text;
    } else {
      const flaggedSurfaces = violations.map((v) => v.surface.toLowerCase());
      const kept = splitSentences(text).filter((sentence) => {
        const lower = sentence.toLowerCase();
        return !flaggedSurfaces.some((s) => lower.includes(s));
      });
      result.strippedText = kept.join("").trim();
    }
  }

  return result;
}

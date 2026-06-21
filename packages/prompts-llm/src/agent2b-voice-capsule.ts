/**
 * Agent 2b — Voice Capsule (OFFLINE foundation).
 *
 * The first increment of the Agent 2b redesign
 * (documentation/12_system_redesign/03_agent_2b_character_profiles.md §4, §9).
 *
 * The redesign replaces the 1000-word profile *essay* (`paragraphs[]`) with a small,
 * typed **Voice Capsule** — the one prose-facing thing the CML can't already supply:
 * how a character sounds, moves under stress, and the single emotional throughline that
 * colours their delivery. This module is the deterministic, additive foundation:
 *
 *   - `VoiceCapsule`       — the small typed voice contract per character (§4.1).
 *   - `extractVoiceCapsule`— a PURE projection from an existing `CharacterProfileOutput`,
 *                            so capsules are shippable *today* from data the live agent
 *                            already produces (no LLM, no new generation call).
 *   - `checkVoiceCapsules` — a deterministic distinctiveness / groundedness / deployability
 *                            checker (analogous to `checkCast`), replacing "score on word
 *                            count" with checks that predict good prose (§4.6).
 *
 * Nothing here calls an LLM, mutates the profile, or wires into the pipeline. It only
 * projects and reports. The live generator (`agent2b-character-profiles.ts`) is untouched.
 */

import type { CharacterProfileOutput } from "./agent2b-character-profiles.js";

/**
 * Speaking register — the coarse "tone of voice" for a character.
 * `unknown` is the explicit groundless sentinel when nothing in the profile implies one.
 */
export type VoiceRegister =
  | "formal"
  | "plain"
  | "terse"
  | "florid"
  | "warm"
  | "cold"
  | "unknown";

/** Coarse humour frequency, the redesign's replacement for the 0.0–1.0 `humourLevel` float (§4.1). */
export type HumourFrequency = "never" | "rare" | "sometimes" | "often";

/**
 * The Voice Capsule: a small, reusable, deploy-ready voice contract for one character.
 * Every field is grounded in what `CharacterProfileOutput` already carries; nothing is
 * a restated CML/cast fact (motive, alibi, access, etc. are read from the cast directly).
 */
export interface VoiceCapsule {
  /** Character name (carried straight from the profile). */
  name: string;
  /** Coarse speaking register, derived from speechMannerisms. */
  register: VoiceRegister;
  /** Atomizable speech tics — one phrase/pattern each, ready to become `voice:*` atoms. */
  speechTics: string[];
  /** A short prose description of diction (the raw mannerism text, normalised). */
  diction: string;
  /** Coarse humour setting. `style` mirrors the profile enum; `level` is bucketed. */
  humour: { style: string; level: HumourFrequency };
  /** Physical / verbal tells that surface under stress. */
  tells: string[];
  /** The single emotional/voice throughline (interiority not present in the case file). */
  throughLine: string;
}

/** Issue severity, mirroring the cast checker. */
export type VoiceCapsuleSeverity = "error" | "warn";

export interface VoiceCapsuleIssue {
  /** Stable machine code, e.g. "empty_register", "duplicate_voice". */
  code: string;
  severity: VoiceCapsuleSeverity;
  /** Character name this issue is about, when applicable. */
  character?: string;
  /** Human-readable description. */
  message: string;
  /** A single targeted instruction suitable for one structured-feedback retry. */
  feedback: string;
}

export interface VoiceCapsuleMetrics {
  count: number;
  /** Capsules with a concrete (non-"unknown") register. */
  groundedRegisterCount: number;
  /** Capsules that have a register and ≥1 speech tic (the deployability bar). */
  deployableCount: number;
  /** Number of near-identical (register + tics) capsule pairs found. */
  duplicatePairs: number;
  /** Distinct registers across the cast. */
  uniqueRegisters: number;
  /** Capsules with one or more empty/placeholder fields. */
  ungroundedCount: number;
}

export interface VoiceCapsuleCheckResult {
  /** true when there are no error-severity issues. */
  ok: boolean;
  issues: VoiceCapsuleIssue[];
  metrics: VoiceCapsuleMetrics;
}

export interface VoiceCapsuleCheckOptions {
  /**
   * Trigram-overlap ratio at/above which two capsules' combined register+tics text counts
   * as "near-identical". Default 0.7. (Spike B's distinctiveness knob, §9.1.)
   */
  duplicateSimilarityThreshold?: number;
}

const PLACEHOLDER_RE = /^(tbd|todo|n\/?a|none|placeholder|unknown|\.+|-+)$/i;

const norm = (v: unknown): string =>
  typeof v === "string" ? v.trim().replace(/\s+/g, " ") : "";

/** A field is "empty" if it is blank or a common placeholder token. */
const isEmptyish = (v: unknown): boolean => {
  const s = norm(v);
  return s.length === 0 || PLACEHOLDER_RE.test(s);
};

/**
 * Map the free-text `speechMannerisms` onto a coarse register.
 * Deterministic keyword scan — first matching bucket wins, in priority order.
 */
function deriveRegister(speechMannerisms: unknown): VoiceRegister {
  const text = norm(speechMannerisms).toLowerCase();
  if (text.length === 0) return "unknown";

  const has = (...words: string[]) => words.some((w) => text.includes(w));

  if (has("formal", "precise", "legal", "clipped legal", "correct", "proper", "stilted")) return "formal";
  if (has("terse", "clipped", "curt", "brusque", "monosyllab", "blunt", "laconic", "short")) return "terse";
  if (has("florid", "ornate", "verbose", "elaborate", "flowery", "grandiloquent", "effusive")) return "florid";
  if (has("warm", "gentle", "kind", "soft", "tender", "genial", "affable")) return "warm";
  if (has("cold", "icy", "frosty", "aloof", "detached", "distant", "withering")) return "cold";
  if (has("plain", "direct", "simple", "provincial", "idiom", "colloquial", "informal", "casual")) return "plain";

  // Mannerism text exists but matched no bucket — call it plain rather than groundless.
  return "plain";
}

/**
 * Split free-text speech mannerisms into atomizable tics. Mirrors the asset-library
 * split heuristic (`;` / sentence boundary) so capsule tics map 1:1 onto `voice:*` atoms.
 */
function deriveSpeechTics(speechMannerisms: unknown): string[] {
  return norm(speechMannerisms)
    .split(/[;]|\.\s+/)
    .map((s) => s.trim().replace(/\.+$/, "").trim())
    .filter((s) => s.length > 3 && !isEmptyish(s));
}

/** Bucket the 0.0–1.0 `humourLevel` float into the coarse frequency the deployer reads (§4.1). */
function deriveHumourFrequency(level: unknown): HumourFrequency {
  const n = typeof level === "number" && Number.isFinite(level) ? level : 0;
  if (n <= 0.05) return "never";
  if (n < 0.4) return "rare";
  if (n < 0.7) return "sometimes";
  return "often";
}

/**
 * Build the capsule's throughline (the one emotional/voice strand) from interiority fields,
 * preferring internalConflict, falling back to personalStakeInCase, then summary.
 */
function deriveThroughLine(profile: Partial<CharacterProfileOutput>): string {
  for (const candidate of [profile.internalConflict, profile.personalStakeInCase, profile.summary]) {
    if (!isEmptyish(candidate)) return norm(candidate);
  }
  return "";
}

/**
 * PURE, deterministic projection from an existing CharacterProfileOutput → VoiceCapsule.
 *
 * Derives register/diction/tics from `speechMannerisms`, humour from `humourStyle`/`humourLevel`,
 * the throughline from `internalConflict`/`personalStakeInCase`, and tells from any physical
 * mannerism plus the speech tics. No LLM, no mutation, never throws — tolerant of malformed
 * input (missing fields, wrong types).
 */
export function extractVoiceCapsule(profile: Partial<CharacterProfileOutput> | null | undefined): VoiceCapsule {
  const p = (profile ?? {}) as Partial<CharacterProfileOutput> & Record<string, unknown>;

  const speechTics = deriveSpeechTics(p.speechMannerisms);
  const register = deriveRegister(p.speechMannerisms);

  // Tells under stress: a physical mannerism (if the profile carries one) plus the speech tics,
  // which double as verbal tells. De-duplicated, order-stable.
  const physical = norm((p as Record<string, unknown>).physicalMannerisms);
  const tells: string[] = [];
  if (!isEmptyish(physical)) tells.push(physical);
  for (const tic of speechTics) {
    if (!tells.includes(tic)) tells.push(tic);
  }

  const humourStyle = isEmptyish(p.humourStyle) ? "none" : norm(p.humourStyle);

  return {
    name: norm(p.name),
    register,
    speechTics,
    diction: norm(p.speechMannerisms),
    humour: {
      style: humourStyle,
      level: deriveHumourFrequency(p.humourLevel),
    },
    tells,
    throughLine: deriveThroughLine(p),
  };
}

/** Lower-cased trigram (3-char shingle) set of a string, for cheap similarity. */
function trigrams(s: string): Set<string> {
  const clean = s.toLowerCase().replace(/\s+/g, " ").trim();
  const grams = new Set<string>();
  if (clean.length < 3) {
    if (clean.length > 0) grams.add(clean);
    return grams;
  }
  for (let i = 0; i <= clean.length - 3; i++) grams.add(clean.slice(i, i + 3));
  return grams;
}

/** Jaccard overlap of two trigram sets (0..1). Two empties are treated as identical (1). */
function trigramOverlap(a: string, b: string): number {
  const ta = trigrams(a);
  const tb = trigrams(b);
  if (ta.size === 0 && tb.size === 0) return 1;
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const g of ta) if (tb.has(g)) inter += 1;
  const union = ta.size + tb.size - inter;
  return union === 0 ? 0 : inter / union;
}

/** The combined voice signature used for distinctiveness comparison. Tolerant of malformed input. */
const voiceSignature = (c: VoiceCapsule): string => {
  const register = norm(c?.register);
  const tics = Array.isArray(c?.speechTics) ? c.speechTics.map(norm).filter(Boolean) : [];
  return `${register} ${tics.join(" ")}`.trim();
};

/**
 * Deterministic distinctiveness / groundedness / deployability checker for a set of capsules.
 * Pure: never mutates input, never calls an LLM, never throws (tolerant of malformed entries).
 *
 * - distinctiveness: no two capsules share a near-identical register+tics signature.
 * - groundedness:    no capsule has empty/placeholder register/tics/throughLine.
 * - deployability:   each capsule has a concrete register AND ≥1 speech tic (the asset
 *                    library needs something to deploy).
 */
export function checkVoiceCapsules(
  capsules: VoiceCapsule[] | null | undefined,
  opts: VoiceCapsuleCheckOptions = {}
): VoiceCapsuleCheckResult {
  const simThreshold = opts.duplicateSimilarityThreshold ?? 0.7;
  const list: VoiceCapsule[] = Array.isArray(capsules) ? capsules.filter((c) => c && typeof c === "object") : [];

  const issues: VoiceCapsuleIssue[] = [];
  let groundedRegisterCount = 0;
  let deployableCount = 0;
  let ungroundedCount = 0;
  const registerSet = new Set<string>();

  list.forEach((capsule, idx) => {
    const name = norm(capsule?.name) || `capsule ${idx + 1}`;
    const register = norm(capsule?.register) || "unknown";
    const tics = Array.isArray(capsule?.speechTics) ? capsule.speechTics.filter((t) => !isEmptyish(t)) : [];
    const throughLine = capsule?.throughLine;

    const hasConcreteRegister = register.length > 0 && register !== "unknown";
    if (hasConcreteRegister) {
      groundedRegisterCount += 1;
      registerSet.add(register.toLowerCase());
    }

    let ungrounded = false;

    // --- groundedness: register ---
    if (!hasConcreteRegister) {
      ungrounded = true;
      issues.push({
        code: "empty_register",
        severity: "error",
        character: name,
        message: `${name} has no concrete register (got "${register}").`,
        feedback: `Give ${name} a concrete speaking register, not a placeholder.`,
      });
    }

    // --- groundedness: throughLine ---
    if (isEmptyish(throughLine)) {
      ungrounded = true;
      issues.push({
        code: "empty_through_line",
        severity: "warn",
        character: name,
        message: `${name} has an empty throughLine (no want/fear/stake to colour the voice).`,
        feedback: `Give ${name} a one-sentence emotional throughline (what they want or fear).`,
      });
    }

    // --- deployability: ≥1 tic ---
    if (tics.length === 0) {
      ungrounded = true;
      issues.push({
        code: "no_speech_tics",
        severity: "error",
        character: name,
        message: `${name} has no atomizable speech tics — nothing for the asset library to deploy.`,
        feedback: `Give ${name} at least one concrete speech tic (a phrase, verbal habit, or pattern).`,
      });
    }

    if (hasConcreteRegister && tics.length >= 1) deployableCount += 1;
    if (ungrounded) ungroundedCount += 1;
  });

  // --- distinctiveness: pairwise near-identical voice signatures ---
  let duplicatePairs = 0;
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const a = list[i];
      const b = list[j];
      const overlap = trigramOverlap(voiceSignature(a), voiceSignature(b));
      if (overlap >= simThreshold) {
        duplicatePairs += 1;
        const an = norm(a?.name) || `capsule ${i + 1}`;
        const bn = norm(b?.name) || `capsule ${j + 1}`;
        issues.push({
          code: "duplicate_voice",
          severity: "warn",
          character: bn,
          message: `${bn}'s voice is near-identical to ${an}'s (register+tics overlap ${overlap.toFixed(2)}).`,
          feedback: `Differentiate ${bn}'s voice from ${an}'s — give a distinct register or distinct speech tics.`,
        });
      }
    }
  }

  const metrics: VoiceCapsuleMetrics = {
    count: list.length,
    groundedRegisterCount,
    deployableCount,
    duplicatePairs,
    uniqueRegisters: registerSet.size,
    ungroundedCount,
  };

  return {
    ok: !issues.some((i) => i.severity === "error"),
    issues,
    metrics,
  };
}

/**
 * Agent 5 clue contracts — legal clue source paths into the CML: validation, repair, and the strict whitelist.
 * Split from agent5-contracts.ts (code review A5-05), which re-exports what it exported.
 */
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import { caseOf, type CaseView } from "@cml/cml";
import { WORKER_LEGAL_SOURCE_PATTERNS, enumerateSourcePaths } from "@cml/cml";
import {
  type ClueGuardrailIssue,
} from "../agents/shared.js";

type SourcePathValidationResult = {
  invalidPaths: string[];
  issues: ClueGuardrailIssue[];
};

// CR-16 (A5-02): derived from the one source-path table in @cml/cml (worker-legal families).
export const ALLOWED_SOURCE_PATTERNS: RegExp[] = WORKER_LEGAL_SOURCE_PATTERNS;

/** A5-04 — kept as the clue-contract name for `caseOf` (same reference, now typed). */
export const getCaseBlock = (cml: CaseData): CaseView => caseOf(cml);

export const getByPath = (root: any, path: string): { ok: boolean; value?: any } => {
  const tokens = path.match(/[A-Za-z_][A-Za-z0-9_]*|\[(\d+)\]/g);
  if (!tokens) return { ok: false };

  let current: any = root;
  for (const token of tokens) {
    if (token.startsWith("[")) {
      const idx = Number(token.slice(1, -1));
      if (!Array.isArray(current) || !Number.isInteger(idx) || idx < 0 || idx >= current.length) {
        return { ok: false };
      }
      current = current[idx];
      continue;
    }
    if (current == null || typeof current !== "object" || !(token in current)) {
      return { ok: false };
    }
    current = current[token];
  }

  return { ok: true, value: current };
};

export const validateSourcePath = (cml: CaseData, sourcePath: string): boolean => {
  if (!sourcePath || typeof sourcePath !== "string") return false;
  if (!ALLOWED_SOURCE_PATTERNS.some((re) => re.test(sourcePath))) return false;
  return getByPath({ CASE: getCaseBlock(cml) }, sourcePath).ok;
};

export const checkSourcePathValidity = (cml: CaseData, clues: ClueDistributionResult): SourcePathValidationResult => {
  const invalidPaths = new Set<string>();
  const issues: ClueGuardrailIssue[] = [];

  for (const clue of clues.clues) {
    const sourcePath = String(clue?.sourceInCML ?? "").trim();
    if (!validateSourcePath(cml, sourcePath)) {
      invalidPaths.add(sourcePath || "(empty-source-path)");
      issues.push({
        severity: "critical",
        message: `Invalid sourceInCML path on clue ${String(clue?.id ?? "(unknown-id)")}: ${sourcePath || "(empty-source-path)"}`,
      });
    }
  }

  return { invalidPaths: Array.from(invalidPaths), issues };
};

// A_53 P10 (a5-strict-feedback-recomputed-per-attempt): the strict source-path whitelist is a pure
// derivation of the immutable CML but is rebuilt 5-10x per Agent-5 invocation (every retry attempt
// and every gate re-check). Memoize per CML object so repeated callers reuse the first result. The
// WeakMap is keyed on the case object identity, so a different CML (next run) is computed fresh and
// stale entries are GC'd with the case object.
export const strictSourcePathWhitelistCache = new WeakMap<object, string[]>();

const computeStrictSourcePathWhitelist = (cml: CaseData): string[] =>
  // CR-16 (A5-02): the shared enumerator — the same list the Agent 5 prompt offers (owner decision 4).
  [...new Set(enumerateSourcePaths(getCaseBlock(cml)))].filter((path) => validateSourcePath(cml, path));

export const buildStrictSourcePathWhitelist = (cml: CaseData): string[] => {
  // A_53 P10 (a5-strict-feedback-recomputed-per-attempt): memoized wrapper over the pure compute.
  const key = (cml as unknown as object) ?? undefined;
  if (!key || typeof key !== "object") return computeStrictSourcePathWhitelist(cml);
  const cached = strictSourcePathWhitelistCache.get(key);
  if (cached) return cached;
  const computed = computeStrictSourcePathWhitelist(cml);
  strictSourcePathWhitelistCache.set(key, computed);
  return computed;
};

export const repairInvalidSourcePaths = (cml: CaseData, clues: ClueDistributionResult): string[] => {
  const repairs: string[] = [];
  const caseBlock = getCaseBlock(cml);
  const stepCount = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps.length : 0;
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];

  const clampLastArrayIndexInPath = (path: string): string => {
    const match = path.match(/^(.*)\[(\d+)\](.*)$/);
    if (!match) return "";

    const parentPath = match[1];
    const index = Number(match[2]);
    const suffix = match[3] || "";
    if (!Number.isInteger(index) || index < 0) return "";

    const parent = getByPath({ CASE: caseBlock }, parentPath);
    if (!parent.ok || !Array.isArray(parent.value) || parent.value.length === 0) return "";

    const clamped = Math.min(index, parent.value.length - 1);
    return `${parentPath}[${clamped}]${suffix}`;
  };

  // Build a fallback path for clues with completely missing sourceInCML so that the
  // deterministic repair can fill in empty paths rather than leaving them for the LLM retry.
  const fallbackSourcePath = (() => {
    const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
    const candidate = steps.length > 0 ? `CASE.inference_path.steps[0].observation` : "";
    return candidate && validateSourcePath(cml, candidate) ? candidate : "";
  })();

  // Last-resort guaranteed-valid path (CML-derived): a clue whose invalid path no targeted heuristic
  // below can rescue is still repaired to a REAL CML location, so the source-path gate REPAIRS rather
  // than hard-aborts the run (project rule: every violation is a warning → deterministic repair, never
  // a throw). Prefer the inference-chain anchor; else the first validated whitelist path. Empty only for
  // a degenerate CML that exposes no valid source path anywhere — that residual case the gate surfaces.
  const guaranteedFallbackPath = fallbackSourcePath || buildStrictSourcePathWhitelist(cml)[0] || "";

  for (const clue of clues.clues) {
    const clueId = String(clue?.id ?? "(unknown-id)");
    const sourcePath = String(clue?.sourceInCML ?? "").trim();

    // Handle completely empty source paths: assign the fallback path so this clue
    // no longer triggers the LLM retry gate (the retry consistently returns 0 clues).
    if (!sourcePath) {
      if (fallbackSourcePath) {
        clue.sourceInCML = fallbackSourcePath;
        repairs.push(`${clueId}: (empty) -> ${fallbackSourcePath} [fallback]`);
      }
      continue;
    }

    if (validateSourcePath(cml, sourcePath)) continue;

    let repaired = "";

    // Canonicalize dot-notation near-misses for known cast leaf fields before any other repair.
    // Handles: CASE.cast[N].access.plausibility -> CASE.cast[N].access_plausibility
    //          CASE.cast[N].alibi.window        -> CASE.cast[N].alibi_window
    const castDotNearMissMatch = sourcePath.match(/^(CASE\.cast\[(\d+)\])\.(\w+)\.(\w+)(.*)$/);
    if (!repaired && castDotNearMissMatch) {
      const castPrefix = castDotNearMissMatch[1];
      const castIdx = Number(castDotNearMissMatch[2]);
      const seg1 = castDotNearMissMatch[3];
      const seg2 = castDotNearMissMatch[4];
      const suffix = castDotNearMissMatch[5] || "";
      const underscoreLeaf = `${seg1}_${seg2}`;
      const candidate = `${castPrefix}.${underscoreLeaf}${suffix}`;
      if (castIdx >= 0 && castIdx < cast.length && validateSourcePath(cml, candidate)) {
        repaired = candidate;
      }
    }

    const stepMatch = sourcePath.match(/^CASE\.inference_path\.steps\[(\d+)\]\.(observation|correction)$/);
    if (!repaired && stepMatch && stepCount > 0) {
      const field = stepMatch[2];
      repaired = `CASE.inference_path.steps[${stepCount - 1}].${field}`;
    }

    const castSensitivityMatch = sourcePath.match(/^CASE\.cast\[(\d+)\]\.evidence_sensitivity\[(\d+)\]$/);
    if (!repaired && castSensitivityMatch) {
      const castIdx = Number(castSensitivityMatch[1]);
      const sensitivity = Array.isArray(cast[castIdx]?.evidence_sensitivity) ? cast[castIdx].evidence_sensitivity : [];
      if (castIdx >= 0 && castIdx < cast.length && sensitivity.length > 0) {
        repaired = `CASE.cast[${castIdx}].evidence_sensitivity[0]`;
      } else if (castIdx >= 0 && castIdx < cast.length && cast[castIdx]?.access_plausibility !== undefined) {
        repaired = `CASE.cast[${castIdx}].access_plausibility`;
      } else if (castIdx >= 0 && castIdx < cast.length && cast[castIdx]?.alibi_window !== undefined) {
        repaired = `CASE.cast[${castIdx}].alibi_window`;
      }
    }

    if (!repaired) {
      repaired = clampLastArrayIndexInPath(sourcePath);
    }

    if (repaired && validateSourcePath(cml, repaired)) {
      clue.sourceInCML = repaired;
      repairs.push(`${clueId}: ${sourcePath} -> ${repaired}`);
    } else if (guaranteedFallbackPath) {
      // No targeted heuristic matched this path shape — anchor the clue to a guaranteed-valid CML
      // location so the gate repairs rather than aborts (repair-not-abort).
      clue.sourceInCML = guaranteedFallbackPath;
      repairs.push(`${clueId}: ${sourcePath} -> ${guaranteedFallbackPath} [fallback]`);
    }
  }

  return repairs;
};

/**
 * Agent 4 — targeted patch engine (Phase 2 of the redesign:
 * documentation/12_system_redesign/09_agent_4_cml_revision.md §4.2, §9.2).
 *
 * Replaces "regenerate the entire CML to fix one broken field" with a node-scoped patch:
 *   1. parse the failing node's address out of a `validateCml` error string,
 *   2. hand a proposer ONLY that sub-structure (+ read-only context),
 *   3. apply the returned patch IN CODE by splicing it into the parsed object — the model never
 *      re-emits the document, so every other node is byte-for-byte preserved,
 *   4. enforce the §9.2 safety CONTRACT with scoped re-validation: the target error must be fixed
 *      AND no previously-passing check may newly fail; otherwise the patch is rejected.
 *
 * The validator and the proposer are injectable: `validateCml` and an LLM proposer in production,
 * deterministic stand-ins in tests. Pure orchestration — no LLM dependency in this module.
 */

import { validateCml } from "@cml/cml";
import type { AzureOpenAIClient } from "@cml/llm-client";

export type PathSegment = string | number;

export type CmlDoc = Record<string, unknown>;

export interface Validator {
  (doc: CmlDoc): { valid: boolean; errors: string[] };
}

export interface PatchRequest {
  /** The full validateCml error string being repaired. */
  error: string;
  /** Addressable path to the failing node, e.g. ["CASE","inference_path","steps",2,"required_evidence",0]. */
  path: PathSegment[];
  /** The current value at that node (read-only). */
  node: unknown;
  /** Read-only context the proposer may use to ground a fix (never to be changed). */
  context: { parent: unknown; constraintSpace: unknown; inferencePath: unknown };
}

/** Returns the replacement value for the node, or undefined to skip this error. */
export type PatchProposer = (req: PatchRequest) => Promise<unknown> | unknown;

export interface AppliedPatch {
  error: string;
  path: string;
  nodeBytes: number;
}

export interface RejectedPatch {
  error: string;
  reason: string;
  newlyFailing?: string[];
}

export interface PatchRunResult {
  cml: CmlDoc;
  validation: { valid: boolean; errors: string[] };
  applied: AppliedPatch[];
  rejected: RejectedPatch[];
}

export interface ContractResult {
  ok: boolean;
  targetFixed: boolean;
  newlyFailing: string[];
  fixed: string[];
}

const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

/** Parse the leading `CASE...` address out of a validateCml error string. */
export function parseErrorPath(error: string): PathSegment[] | null {
  const m = error.match(/^(CASE(?:\.[A-Za-z0-9_]+|\[\d+\])*)/);
  if (!m) return null;
  const segs: PathSegment[] = [];
  const re = /([A-Za-z0-9_]+)|\[(\d+)\]/g;
  let t: RegExpExecArray | null;
  while ((t = re.exec(m[1])) !== null) {
    segs.push(t[1] !== undefined ? t[1] : Number(t[2]));
  }
  return segs.length ? segs : null;
}

export const pathToString = (segs: PathSegment[]): string =>
  segs.map((s) => (typeof s === "number" ? `[${s}]` : `.${s}`)).join("").replace(/^\./, "");

export function getAtPath(doc: unknown, segs: PathSegment[]): unknown {
  let cur: unknown = doc;
  for (const seg of segs) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<PathSegment, unknown>)[seg as never];
  }
  return cur;
}

/** Set the value at `segs` (in place). Returns false if the parent path doesn't exist. */
export function setAtPath(doc: unknown, segs: PathSegment[], value: unknown): boolean {
  if (segs.length === 0) return false;
  let cur: unknown = doc;
  for (let i = 0; i < segs.length - 1; i++) {
    if (cur == null || typeof cur !== "object") return false;
    cur = (cur as Record<PathSegment, unknown>)[segs[i] as never];
  }
  if (cur == null || typeof cur !== "object") return false;
  (cur as Record<PathSegment, unknown>)[segs[segs.length - 1] as never] = value;
  return true;
}

/** Clone `doc` and splice `value` into only the node at `segs`. Returns null if not settable. */
export function applyPatchInCode(doc: CmlDoc, segs: PathSegment[], value: unknown): CmlDoc | null {
  const next = clone(doc);
  return setAtPath(next, segs, value) ? next : null;
}

/**
 * The §9.2 safety contract, checked by scoped re-validation: after the patch, the target error must
 * be gone AND no previously-passing check may newly fail.
 */
export function validateContract(
  before: CmlDoc,
  after: CmlDoc,
  targetError: string,
  validator: Validator = validateCml,
): ContractResult {
  const beforeErrors = new Set(validator(before).errors);
  const afterErrors = validator(after).errors;
  const afterSet = new Set(afterErrors);
  const newlyFailing = afterErrors.filter((e) => !beforeErrors.has(e));
  const fixed = [...beforeErrors].filter((e) => !afterSet.has(e));
  const targetFixed = beforeErrors.has(targetError) && !afterSet.has(targetError);
  return { ok: targetFixed && newlyFailing.length === 0, targetFixed, newlyFailing, fixed };
}

export interface PatchRunOptions {
  cml: CmlDoc;
  propose: PatchProposer;
  validator?: Validator;
  /** Max patch attempts (per-document budget). Default 8. */
  maxPatches?: number;
}

/**
 * Drive node-scoped patching until the CML validates, the budget is spent, or no remaining error is
 * addressable/fixable. A rejected patch (violates the contract) is never applied; its error is
 * skipped so the loop can't spin on it.
 */
export async function patchCmlNode(opts: PatchRunOptions): Promise<PatchRunResult> {
  const validator = opts.validator ?? validateCml;
  const maxPatches = opts.maxPatches ?? 8;
  let current = clone(opts.cml);
  let validation = validator(current);
  const applied: AppliedPatch[] = [];
  const rejected: RejectedPatch[] = [];
  const skip = new Set<string>();
  let used = 0;

  while (!validation.valid && used < maxPatches) {
    const error = validation.errors.find((e) => !skip.has(e));
    if (!error) break; // nothing left we can attempt
    used++;

    const segs = parseErrorPath(error);
    if (!segs) {
      rejected.push({ error, reason: "unaddressable error path" });
      skip.add(error);
      continue;
    }

    const node = getAtPath(current, segs);
    const context = {
      parent: getAtPath(current, segs.slice(0, -1)),
      constraintSpace: getAtPath(current, ["CASE", "constraint_space"]),
      inferencePath: getAtPath(current, ["CASE", "inference_path"]),
    };

    let patchValue: unknown;
    try {
      patchValue = await opts.propose({ error, path: segs, node, context });
    } catch (e) {
      rejected.push({ error, reason: `proposer error: ${(e as Error).message}` });
      skip.add(error);
      continue;
    }
    if (patchValue === undefined) {
      rejected.push({ error, reason: "proposer returned no patch" });
      skip.add(error);
      continue;
    }

    const candidate = applyPatchInCode(current, segs, patchValue);
    if (!candidate) {
      rejected.push({ error, reason: "node path not settable" });
      skip.add(error);
      continue;
    }

    const contract = validateContract(current, candidate, error, validator);
    if (contract.ok) {
      current = candidate;
      validation = validator(current);
      applied.push({ error, path: pathToString(segs), nodeBytes: JSON.stringify(patchValue ?? null).length });
    } else {
      rejected.push({
        error,
        reason: contract.targetFixed
          ? `introduced ${contract.newlyFailing.length} new error(s)`
          : "did not fix the target error",
        newlyFailing: contract.newlyFailing,
      });
      skip.add(error);
    }
  }

  return { cml: current, validation, applied, rejected };
}

/**
 * An LLM-backed patch proposer: hands the model ONLY the failing node + read-only context and asks
 * for a replacement value for that node (not the whole document). The model authors a real fix;
 * `patchCmlNode` applies it in code and enforces the contract.
 */
export function makeLlmPatchProposer(
  client: AzureOpenAIClient,
  opts: { runId?: string; projectId?: string } = {},
): PatchProposer {
  return async ({ error, path, node, context }) => {
    const system =
      "You repair ONE node of a CML mystery document to fix a single validation error, without " +
      "changing anything else. Reply ONLY with JSON: {\"patch\": <replacement value for the node>}. " +
      "The patch must be the SAME shape as the current node (a string, array, or object). Use " +
      "concrete, reader-visible facts grounded in the context; never abstract placeholders, never " +
      "detective-only reactions.";
    const user =
      `VALIDATION ERROR:\n${error}\n\n` +
      `NODE PATH: ${pathToString(path)}\n` +
      `CURRENT NODE VALUE:\n${JSON.stringify(node, null, 2)}\n\n` +
      `READ-ONLY CONTEXT (do not change; use to ground the fix). If this is a grounding error, your ` +
      `fix MUST use facts/terms that already appear in the inference_path below:\n` +
      `parent: ${JSON.stringify(context.parent ?? null).slice(0, 1200)}\n` +
      `inference_path: ${JSON.stringify(context.inferencePath ?? null).slice(0, 3000)}\n` +
      `constraint_space: ${JSON.stringify(context.constraintSpace ?? null).slice(0, 1500)}\n\n` +
      `Return {"patch": <new value for ONLY this node>}.`;
    const res = await client.chat({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.2,
      maxTokens: 1000,
      jsonMode: true,
      logContext: { runId: opts.runId ?? "agent4-patch", projectId: opts.projectId ?? "", agent: "Agent4-Patch", retryAttempt: 1 },
    });
    try {
      const parsed = JSON.parse(res.content) as { patch?: unknown };
      return parsed.patch;
    } catch {
      return undefined;
    }
  };
}

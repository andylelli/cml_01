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
  /**
   * A_53 P9 (patch-budget-consumed-by-unfixable-resurfacing): true when the loop stopped because the
   * per-document patch budget ran out while errors remained (vs. stopping because nothing left was
   * addressable). Lets the caller distinguish "ran out of calls mid-repair" from "gave up cleanly".
   */
  budgetExhausted: boolean;
  /**
   * A_53 P9 (patch-budget-consumed-by-unfixable-resurfacing): net reduction in validation-error count
   * from the original doc to the final doc (errorsBefore - errorsAfter; >=0). Zero means the patch pass
   * made no headway, so a downstream full rewrite is justified; positive means real progress that a
   * blind rewrite would discard.
   */
  netProgress: number;
}

export interface ContractResult {
  ok: boolean;
  targetFixed: boolean;
  newlyFailing: string[];
  fixed: string[];
  /**
   * A_53 P10 (revalidate-whole-doc-per-patch): the validator output for `after`, carried out so the
   * caller can reuse it instead of recomputing `validator(after)` once the contract passes.
   */
  afterErrors: string[];
  afterValid: boolean;
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
  const beforeList = validator(before).errors;
  const afterResult = validator(after);
  const afterErrors = afterResult.errors;
  // A_53 P11 (validateContract-dup-error-false-pass): compare error MULTISETS, not Sets. A regression
  // that adds a SECOND copy of an already-failing error (e.g. the patch reintroduces a duplicate
  // node) collapses in a Set and the contract falsely passes; counting occurrences catches it. Each
  // error string already carries its node path (validateCml prefixes "CASE.<path> ..."), so equal
  // strings are equal failures and counts are the right granularity.
  const tally = (list: string[]): Map<string, number> => {
    const m = new Map<string, number>();
    for (const e of list) m.set(e, (m.get(e) ?? 0) + 1);
    return m;
  };
  const beforeCounts = tally(beforeList);
  const afterCounts = tally(afterErrors);
  // newlyFailing: every after-occurrence beyond the matching before-occurrence count (per distinct
  // error), so a duplicated existing failure surfaces as a new one.
  const newlyFailing: string[] = [];
  for (const [e, aCount] of afterCounts) {
    const extra = aCount - (beforeCounts.get(e) ?? 0);
    for (let i = 0; i < extra; i++) newlyFailing.push(e);
  }
  // fixed: before-occurrences that no longer appear at the same multiplicity.
  const fixed: string[] = [];
  for (const [e, bCount] of beforeCounts) {
    const gone = bCount - (afterCounts.get(e) ?? 0);
    for (let i = 0; i < gone; i++) fixed.push(e);
  }
  const targetFixed = (beforeCounts.get(targetError) ?? 0) > (afterCounts.get(targetError) ?? 0);
  return {
    ok: targetFixed && newlyFailing.length === 0,
    targetFixed,
    newlyFailing,
    fixed,
    // A_53 P10 (revalidate-whole-doc-per-patch): expose this validation so the loop need not rerun it.
    afterErrors,
    afterValid: afterResult.valid,
  };
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
  // A_53 P9 (patch-budget-consumed-by-unfixable-resurfacing): remember the starting error count so we
  // can report net progress (errorsBefore - errorsAfter) to the caller.
  const errorsBefore = validation.errors.length;
  const applied: AppliedPatch[] = [];
  const rejected: RejectedPatch[] = [];
  const skip = new Set<string>();
  let used = 0;
  // A_53 P9 (patch-budget-consumed-by-unfixable-resurfacing): set when we leave the loop because the
  // budget is spent (errors remain). Stays false if we exit because nothing addressable is left.
  let budgetExhausted = false;

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
      // A_53 P10 (revalidate-whole-doc-per-patch): reuse the post-patch validation that
      // validateContract already computed for `candidate` instead of calling validator(current) again
      // (~32 vs ~48 validations for a 16-patch run). current === candidate here, so it is the same doc.
      validation = { valid: contract.afterValid, errors: contract.afterErrors };
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

  // A_53 P9 (patch-budget-consumed-by-unfixable-resurfacing): we ran out of budget (not options) iff
  // errors remain, we hit the cap, and at least one remaining error was still attemptable (not skipped
  // as unfixable). When errors remain only because everything left is skipped/unaddressable, the loop
  // exited via `break` with used < maxPatches and this is false — a clean give-up, not an exhausted
  // budget. The caller uses this with netProgress to avoid spending a full rewrite when the budget was
  // consumed making real progress (>16-error docs), and to fall to rewrite only on zero net progress.
  if (!validation.valid && used >= maxPatches && validation.errors.some((e) => !skip.has(e))) {
    budgetExhausted = true;
  }
  const netProgress = errorsBefore - validation.errors.length;

  return { cml: current, validation, applied, rejected, budgetExhausted, netProgress };
}

/**
 * A_53 P11 (patch-context-truncation-mid-json): bound a node to a character budget WITHOUT producing
 * invalid JSON. A blunt `JSON.stringify(...).slice(0, N)` cuts mid-token, so the proposer sees broken
 * JSON and any grounding term past the cut is invisible → the fix is rejected and the call is wasted.
 *
 * Strategy (holistic, data-driven — no story content): if the full serialization already fits the
 * budget, return it verbatim. Otherwise recursively shrink the LARGEST arrays by keeping a prefix of
 * elements and appending a literal `"(N more omitted)"` string element (still valid JSON), so every
 * truncation lands on an element boundary. Object keys are preserved (a deletion could hide the very
 * term being grounded). Returns pretty-printed valid JSON that fits, or a best-effort minimal form.
 */
function boundedJson(value: unknown, budget: number): string {
  // JSON.stringify(undefined) is undefined, not a string — normalize to null first so callers that
  // omit a context field still get valid JSON ("null") rather than a crash.
  const safe = value === undefined ? null : value;
  const full = JSON.stringify(safe, null, 2);
  if (full.length <= budget) return full;

  // Deep clone so we never mutate the live read-only context.
  const root: unknown = JSON.parse(full);

  // Repeatedly find the longest array (by serialized length) reachable from root and trim it by one
  // element from the tail, replacing the dropped tail with a single "(N more omitted)" sentinel.
  const fits = (v: unknown): boolean => JSON.stringify(v, null, 2).length <= budget;
  const omittedMarker = (n: number): string => `(${n} more omitted)`;

  // A guard so a pathological structure can't loop forever; each pass removes >=1 array element.
  let guard = 100000;
  while (!fits(root) && guard-- > 0) {
    let target: unknown[] | null = null;
    let targetLen = -1;
    const visit = (v: unknown): void => {
      if (Array.isArray(v)) {
        // Count only "real" (non-sentinel) trailing-trimmable elements.
        const len = JSON.stringify(v).length;
        if (len > targetLen && v.some((el) => typeof el !== "string" || !/^\(\d+ more omitted\)$/.test(el))) {
          target = v;
          targetLen = len;
        }
        for (const el of v) visit(el);
      } else if (v && typeof v === "object") {
        for (const el of Object.values(v as Record<string, unknown>)) visit(el);
      }
    };
    visit(root);
    if (!target) break; // no array left to trim — can't shrink further without dropping keys

    const arr = target as unknown[];
    // Drop the last real element; fold any existing trailing sentinel into a single updated count.
    let omitted = 0;
    const last = arr[arr.length - 1];
    if (typeof last === "string") {
      const m = last.match(/^\((\d+) more omitted\)$/);
      if (m) {
        omitted = Number(m[1]);
        arr.pop();
      }
    }
    if (arr.length === 0) break;
    arr.pop();
    omitted += 1;
    arr.push(omittedMarker(omitted));
  }

  const out = JSON.stringify(root, null, 2);
  // Last resort: if still over budget (e.g. one giant scalar), hard-truncate but keep it a valid JSON
  // string literal rather than emitting a broken object/array.
  if (out.length > budget) return JSON.stringify(out.slice(0, Math.max(0, budget - 2)) + "…");
  return out;
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
      `fix MUST use facts/terms that already appear in the inference_path below. Where an array is ` +
      `shortened you will see "(N more omitted)":\n` +
      // A_53 P11 (patch-context-truncation-mid-json): bound each context field at array boundaries so
      // the JSON the proposer reads stays valid and grounding terms are never cut mid-token.
      `parent: ${boundedJson(context.parent ?? null, 1200)}\n` +
      `inference_path: ${boundedJson(context.inferencePath ?? null, 3000)}\n` +
      `constraint_space: ${boundedJson(context.constraintSpace ?? null, 1500)}\n\n` +
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

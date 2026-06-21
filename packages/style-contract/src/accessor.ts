/**
 * The contract→agent consumption interface (§9.2 "the keystone of the build").
 *
 * Every generative agent reads the frozen contract through ONE typed accessor, so no agent
 * re-derives voice from raw upstream JSON (the §3.D fragmented-ownership wound). `contractFingerprint`
 * + `sameContract` back the §9.4 load-bearing invariant: *every agent receives the byte-identical
 * contract signed at grounding* — if that breaks, ownership has fragmented again.
 */

import type { StyleContract } from "./types.js";

/**
 * Read the frozen Style Contract off a CML-ish object. The contract is a first-class CML field
 * (§4.5); accept the common shapes (`STYLE_CONTRACT`, `CASE.style_contract`, bare `style_contract`).
 * Returns undefined when no contract is present (e.g. legacy CML predating the redesign).
 */
export function readStyleContract(cml: unknown): StyleContract | undefined {
  if (!cml || typeof cml !== "object") return undefined;
  const obj = cml as Record<string, unknown>;
  const candidate =
    obj.STYLE_CONTRACT ??
    obj.style_contract ??
    (obj.CASE && typeof obj.CASE === "object"
      ? (obj.CASE as Record<string, unknown>).style_contract
      : undefined);
  return candidate && typeof candidate === "object" ? (candidate as StyleContract) : undefined;
}

/** Stable serialization (recursively sorted keys) so two contracts compare regardless of key order. */
export function contractFingerprint(contract: StyleContract): string {
  return stableStringify(contract);
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.keys(value as Record<string, unknown>)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify((value as Record<string, unknown>)[k])}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}

/** The §9.4 invariant check: do two agents hold the same frozen contract? */
export function sameContract(a: StyleContract, b: StyleContract): boolean {
  return stableStringify(a) === stableStringify(b);
}

/**
 * PROSE ENGINE v2 — the whole contract: the structure, the bible and the brief (ANALYSIS_99 §10.2).
 *
 * One call, one object, and every role in the engine reads it. Nothing downstream derives anything
 * from an upstream artifact again — that is L6, and it is what v1 does not have: the reveal chapter
 * is computed in `obligation-block.ts`, `scene-ref-reconcile.ts` and `clue-validation.ts`, and this
 * week's bug check found two of the three disagreeing.
 */
import { contractFixesEnabled } from "@cml/cml";
import { buildBible, whereAndWhen } from "./bible.js";
import { buildBrief } from "./brief.js";
import { buildContractCore } from "./contract.js";
import { checkContractRules } from "./contract-rules.js";
import type { BookContract, ContractInput } from "./types.js";

export const buildBookContract = (input: ContractInput): BookContract => {
  const core = buildContractCore(input);
  const bible = buildBible(input, core);
  const contract: BookContract = {
    engine: "v2",
    ...core,
    bible,
    brief: buildBrief({
      core,
      profiles: (input.profiles?.profiles ?? []) as Array<Record<string, unknown>>,
      humourLevel: input.humourLevel,
    }),
  };
  // A_110 W1 / WP-006 K4: a place the bible cannot read is an answer — "unknown" — and goes to the run report.
  if (contractFixesEnabled()) {
    const { unknown } = whereAndWhen(input);
    if (unknown.length > 0) contract.notes.push(`THE WORLD could not read ${unknown.join(", ")}`);
  }
  // A_110 M1 / WP-006 K6: the contract's own invariants, reported every run, flag or no flag (telemetry, never a gate).
  const violated = checkContractRules(contract, bible.text);
  if (violated.length > 0) {
    contract.notes.push(`contract rules violated: ${violated.map((v) => `${v.rule} (${v.where})`).join(", ")}`);
  }
  return contract;
};

/**
 * PROSE ENGINE v2 — the whole contract: the structure, the bible and the brief (ANALYSIS_99 §10.2).
 *
 * One call, one object, and every role in the engine reads it. Nothing downstream derives anything
 * from an upstream artifact again — that is L6, and it is what v1 does not have: the reveal chapter
 * is computed in `obligation-block.ts`, `scene-ref-reconcile.ts` and `clue-validation.ts`, and this
 * week's bug check found two of the three disagreeing.
 */
import { buildBible } from "./bible.js";
import { buildBrief } from "./brief.js";
import { buildContractCore } from "./contract.js";
import type { BookContract, ContractInput } from "./types.js";

export const buildBookContract = (input: ContractInput): BookContract => {
  const core = buildContractCore(input);
  return {
    engine: "v2",
    ...core,
    bible: buildBible(input, core),
    brief: buildBrief({
      core,
      profiles: (input.profiles?.profiles ?? []) as Array<Record<string, unknown>>,
      humourLevel: input.humourLevel,
    }),
  };
};

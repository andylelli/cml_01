// Shipped env: verified fixes + prompt trims ON; every A_110 flag unset.
export const SHIPPED = { CML_VERIFIED_FIXES: "1", CML_PROMPT_TRIMS: "1" };
export const A110 = ["PROSE_V2_CONTRACT_FIXES", "PROSE_V2_OPENING", "PROSE_V2_SELECTOR_RANKS", "PROSE_V2_TAIL_FINDING", "PROSE_V2_SCHEDULE", "PROSE_V2_BOOK_FIRST", "PROSE_V2_TOUCH_ONCE", "CML_A110_UPSTREAM", "PROSE_V2_KEYNESS_FINDING", "PROSE_V2_PRESENCE_PENALTY", "PROSE_V2_FALSE_LEAD", "PROSE_V2_PROOF_STEPS", "PROSE_V2_AUDIT_FIXES"];
// Arms: OFF (shipped); B (A_110 arm B); S (B + the schedule and the upstream Gathering); each with `_AUDIT` adds the
// V batch (A_111 §5, PROSE_V2_AUDIT_FIXES). AUDIT alone is the shipped env plus the V batch.
export const setEnv = (arm) => {
  Object.assign(process.env, SHIPPED);
  for (const k of A110) delete process.env[k];
  if (arm === "AUDIT" || arm.endsWith("_AUDIT")) process.env.PROSE_V2_AUDIT_FIXES = "1";
  if (/^(B|S)(_AUDIT)?$/.test(arm)) for (const k of ["PROSE_V2_CONTRACT_FIXES", "PROSE_V2_OPENING", "PROSE_V2_SELECTOR_RANKS", "PROSE_V2_TAIL_FINDING"]) process.env[k] = "1";
  if (/^S(_AUDIT)?$/.test(arm)) for (const k of ["PROSE_V2_SCHEDULE", "CML_A110_UPSTREAM"]) process.env[k] = "1";
};

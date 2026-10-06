// Shipped env: verified fixes + prompt trims ON; every A_110 flag unset.
export const SHIPPED = { CML_VERIFIED_FIXES: "1", CML_PROMPT_TRIMS: "1" };
export const A110 = ["PROSE_V2_CONTRACT_FIXES", "PROSE_V2_OPENING", "PROSE_V2_SELECTOR_RANKS", "PROSE_V2_TAIL_FINDING", "PROSE_V2_SCHEDULE", "PROSE_V2_BOOK_FIRST", "PROSE_V2_TOUCH_ONCE", "CML_A110_UPSTREAM", "PROSE_V2_KEYNESS_FINDING", "PROSE_V2_PRESENCE_PENALTY", "PROSE_V2_FALSE_LEAD", "PROSE_V2_PROOF_STEPS"];
export const setEnv = (arm) => {
  Object.assign(process.env, SHIPPED);
  for (const k of A110) delete process.env[k];
  if (arm === "B") for (const k of ["PROSE_V2_CONTRACT_FIXES", "PROSE_V2_OPENING", "PROSE_V2_SELECTOR_RANKS", "PROSE_V2_TAIL_FINDING"]) process.env[k] = "1";
};

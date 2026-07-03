/**
 * A_61 RC2.5 — the deterministic case-soundness repair hook (LLD P2 prerequisite).
 *
 * `runContradictionGate` + `verifyDiscriminator` detect an unsound case (culprit==victim, unresolvable
 * gender, a partition that excludes its own answer, an unaccounted suspect, missing culprit). Promoting
 * those gates to BLOCKING (AGENT9_BIBLE_GATES_BLOCKING) without a repair would convert previously-shipping
 * cases into aborts. This pass repairs the clear-cut data errors AT SOURCE — the same repair-not-abort
 * shape as RC3.1's `synthesizeInferenceStepCoverageClues` — mutating the frozen CASE in place so both the
 * prose prompt and the re-run gate see the fixed data. Pure/deterministic, no LLM. Runs unconditionally.
 *
 * It mutates `caseBlock.cast[].gender`, `caseBlock.culpability.culprits`, and
 * `caseBlock.discriminating_test.eliminated_suspects`. Conflicts with no safe deterministic repair
 * (duplicate names, zero evidence clues, no guilty cast to derive a culprit from) are returned in
 * `residualBlocked` for the caller to log; `mechanism_environment` is NOT repaired here (it is already
 * handled by the prose repairInstruction) and must be excluded from any blocking-throw condition.
 */

const norm = (s: unknown): string => String(s ?? "").trim().toLowerCase();

// Ported from agent2-run.ts FIX-4 (kept local — worker cannot be imported here). A small high-confidence
// Golden-Age name list + classic feminine suffixes; unknowns fall back to deterministic alternation.
const FEMALE_NAMES = new Set([
  "mary", "margaret", "clara", "vivienne", "geraldine", "evelyn", "agnes", "edith", "florence", "dorothy",
  "alice", "beatrice", "constance", "eleanor", "harriet", "ada", "cecilia", "rose", "violet", "lillian",
  "grace", "ruth", "helen", "jane", "elizabeth", "catherine", "anne", "anna", "emma", "charlotte",
  "louisa", "ethel", "sylvia", "mallory", "beatrix",
]);
const MALE_NAMES = new Set([
  "harold", "james", "thomas", "edward", "arthur", "richard", "william", "henry", "charles", "george",
  "frederick", "albert", "walter", "ernest", "herbert", "alfred", "john", "robert", "samuel", "francis",
  "hugh", "reginald", "percy", "cecil", "rupert", "ivor", "hugo",
]);
const FEMININE_SUFFIX_RE = /(?:a|ine|ette|elle|een|ina)$/;

function inferGenderFromName(name: string): "male" | "female" | undefined {
  const first = name.trim().split(/\s+/)[0]?.toLowerCase().replace(/[^a-z]/g, "") ?? "";
  if (!first) return undefined;
  if (FEMALE_NAMES.has(first)) return "female";
  if (MALE_NAMES.has(first)) return "male";
  if (FEMININE_SUFFIX_RE.test(first)) return "female";
  return undefined;
}

/** Mirrors world-state.ts parseGender: is this gender value already resolvable (not "unknown")? */
function resolvedGender(value: unknown): "male" | "female" | null {
  const g = norm(value);
  if (g === "m" || g === "male" || g === "man") return "male";
  if (g === "f" || g === "female" || g === "woman") return "female";
  return null;
}

export interface CaseSoundnessRepairResult {
  /** human-readable log of each repair applied (pushed to ctx.warnings by the caller). */
  repairs: string[];
  /** conflict/issue kinds that survive the repair (no safe deterministic fix) — for logging only. */
  residualBlocked: string[];
}

/**
 * Repair the clear-cut soundness data errors on `caseBlock` in place. Idempotent: a second run on a
 * repaired case is a no-op. Never throws.
 */
export function repairCaseSoundness(caseBlock: any): CaseSoundnessRepairResult {
  const repairs: string[] = [];
  const residualBlocked: string[] = [];
  if (!caseBlock || typeof caseBlock !== "object") return { repairs, residualBlocked };

  const cast: any[] = Array.isArray(caseBlock.cast) ? caseBlock.cast : [];

  // 1. character_missing_gender — the kind that actually fires. Resolve declared → name-inferred →
  //    deterministic alternation (the agent2 FIX-4 ladder), so no cast member reaches the Bible as unknown.
  cast.forEach((c, idx) => {
    if (resolvedGender(c?.gender)) return;
    const assigned = inferGenderFromName(String(c?.name ?? "")) ?? (idx % 2 === 0 ? "female" : "male");
    c.gender = assigned;
    repairs.push(`case-soundness: assigned gender ${assigned} to "${String(c?.name ?? "(unnamed)")}"`);
  });

  const victimName =
    cast.find((c) => /victim/i.test(String(c?.role_archetype ?? c?.role ?? "")))?.name ??
    caseBlock?.culpability?.victim ??
    caseBlock?.victim ??
    null;
  const isSuspectRole = (c: any): boolean => {
    const role = norm(c?.role_archetype ?? c?.role);
    return !role.includes("detective") && !role.includes("victim");
  };
  const suspectNames = cast.filter(isSuspectRole).map((c) => String(c?.name ?? "")).filter(Boolean);

  const culpability = (caseBlock.culpability ??= {});
  let culprits: string[] = Array.isArray(culpability.culprits)
    ? culpability.culprits.map((x: unknown) => String(x)).filter(Boolean)
    : [];

  // 7. culprit_is_victim — drop the victim from the culprit list (the collision is a data error).
  if (victimName) {
    const vKey = norm(victimName);
    const before = culprits.length;
    culprits = culprits.filter((c) => norm(c) !== vKey);
    if (culprits.length !== before) {
      repairs.push(`case-soundness: removed victim "${victimName}" from the culprit list`);
    }
  }

  // 2. no_culprit — derive from cast[].culpability==="guilty"; residual if none.
  if (culprits.length === 0) {
    const guilty = cast.filter((c) => norm(c?.culpability) === "guilty").map((c) => String(c?.name ?? "")).filter(Boolean);
    if (guilty.length > 0) {
      culprits = guilty;
      repairs.push(`case-soundness: derived culprit(s) [${guilty.join(", ")}] from cast culpability=guilty`);
    } else {
      residualBlocked.push("no_culprit");
    }
  }
  culpability.culprits = culprits;
  const culpritKeys = new Set(culprits.map(norm));

  // discriminating_test.eliminated_suspects repairs
  const dt = (caseBlock.discriminating_test ??= {});
  const hadExplicitElim = Array.isArray(dt.eliminated_suspects) && dt.eliminated_suspects.length > 0;
  let eliminated: string[] = Array.isArray(dt.eliminated_suspects)
    ? dt.eliminated_suspects.map((s: any) => (typeof s === "string" ? s : s?.name)).filter(Boolean)
    : [];

  // 4. culprit_eliminated — a partition that excludes its own answer is a data error; drop the culprit.
  const beforeElim = eliminated.length;
  eliminated = eliminated.filter((s) => !culpritKeys.has(norm(s)));
  const removedCulpritFromElim = eliminated.length !== beforeElim;
  if (removedCulpritFromElim) {
    repairs.push(`case-soundness: removed culprit(s) from eliminated_suspects (self-contradicting partition)`);
  }

  // 3. suspect_unaccounted — only when eliminated_suspects was EXPLICITLY listed but incomplete: union the
  //    derived-complete set (every non-culprit, non-"guilty" suspect). When the list was absent, the
  //    downstream DT checklist already derives the complete set, so we leave it alone.
  if (hadExplicitElim) {
    const elimKeys = new Set(eliminated.map(norm));
    const added: string[] = [];
    for (const s of suspectNames) {
      const sk = norm(s);
      if (culpritKeys.has(sk) || elimKeys.has(sk)) continue;
      const member = cast.find((c) => norm(c?.name) === sk);
      if (norm(member?.culpability) === "guilty") continue; // a guilty non-culprit is a different problem
      eliminated.push(s);
      elimKeys.add(sk);
      added.push(s);
    }
    if (added.length > 0) {
      repairs.push(`case-soundness: completed eliminated_suspects with [${added.join(", ")}]`);
    }
  }
  if (hadExplicitElim || removedCulpritFromElim) {
    dt.eliminated_suspects = eliminated;
  }

  return { repairs, residualBlocked };
}

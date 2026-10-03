/**
 * Identity-rule occupation collisions, repaired in place before any formatNarrative call reads the CML.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import type { CaseView } from "@cml/cml";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  isIdentityRuleCollisionGuardEnabled,
} from "./flags.js";

/**
 * Normalize an occupation/role label for collision comparison: lowercase, strip a leading article,
 * collapse whitespace. "the Stage Manager" and "Stage Manager" and "stage  manager" all compare equal.
 */
const normalizeOccupationLabel = (raw: unknown): string =>
  String(raw ?? "")
    .toLowerCase()
    .replace(/^(the|a|an)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * DIAGNOSIS-BATCH #5 — a pre-reveal identity alias that collides with ANOTHER character's real
 * occupation. Pure: cast in, identity_rules in, colliding entries out. Extracted so it is tested
 * directly against the actual measured failure, not only through the full pipeline.
 *
 * MEASURED, story_20260903-0738 (external read 78/100). Agent 3 (CML generation, `agent3-cml.ts`)
 * runs BEFORE Agent 2b (character profiles) and Agent 65 (world builder) in this pipeline's actual
 * execution order — confirmed against `logs/llm-prompts-full.jsonl` for the real run, scoped by
 * runId, NOT assumed from the doc-comment pipeline order at the top of CLAUDE.md, which is a
 * simplification that does not match execution order. So Agent 3 cannot have copied anyone's later-
 * assigned occupation; it independently invented "the stage manager" as culprit Ivor Kestrel's
 * pre-reveal `identity_rules.before_reveal_reference` (the shape is templated at
 * `agent3-cml.ts:637-641`, built for masked-stranger cases: "the stranger" -> "Lord Ashford"). Agent
 * 2b then, separately, gave the ACTUAL stage manager (Marguerite Yardley) `occupation: "Stage
 * Manager"` as her real, correct job title — with no visibility into Kestrel's alias, since nothing
 * cross-checks an identity-rule alias against any OTHER character's occupation. The manuscript ships
 * "the stage manager" referring to two different people of different genders, and
 * `prose-consistency-validator.ts`'s pronoun detectors are confirmed role-noun-blind (they index only
 * NAME tokens, `buildGenderedTokenIndex`) — this class of collision is invisible to every existing
 * pronoun check, not merely uncaught by one.
 *
 * Checked against every cast member's real `occupation` (`ctx.cast.cast.characters[].occupation`,
 * Agent 2's own schema field, present from the earliest point in the pipeline — not Agent 2b's
 * elaborated profile, which carries no separate occupation field of its own) because that is the
 * single reliable source available by the time Agent 7 runs `formatNarrative`, regardless of which
 * upstream agent is the TRUE original source of any given collision.
 */
export interface IdentityRuleCollision {
  ruleIndex: number;
  characterName: string;
  alias: string;
  collidesWithCharacter: string;
}

export const detectIdentityRuleOccupationCollisions = (
  identityRules: ReadonlyArray<{ character_name?: unknown; before_reveal_reference?: unknown }> | undefined,
  castCharacters: ReadonlyArray<{ name?: unknown; occupation?: unknown }> | undefined,
): IdentityRuleCollision[] => {
  if (!Array.isArray(identityRules) || identityRules.length === 0) return [];
  if (!Array.isArray(castCharacters) || castCharacters.length === 0) return [];
  const collisions: IdentityRuleCollision[] = [];
  identityRules.forEach((rule, ruleIndex) => {
    const aliasNorm = normalizeOccupationLabel(rule?.before_reveal_reference);
    if (!aliasNorm) return;
    const ruleCharacterName = String(rule?.character_name ?? "").trim();
    for (const member of castCharacters) {
      const memberName = String(member?.name ?? "").trim();
      if (!memberName || memberName === ruleCharacterName) continue; // never collide with yourself
      const occupationNorm = normalizeOccupationLabel(member?.occupation);
      if (!occupationNorm) continue;
      if (occupationNorm === aliasNorm) {
        collisions.push({
          ruleIndex,
          characterName: ruleCharacterName,
          alias: String(rule?.before_reveal_reference ?? ""),
          collidesWithCharacter: memberName,
        });
        break; // one collision per rule is enough to repair it
      }
    }
  });
  return collisions;
};

/**
 * DIAGNOSIS-BATCH #5 — repairs `ctx.cml.CASE.prose_requirements.identity_rules` in place, BEFORE any
 * `formatNarrative` call in this function reads `ctx.cml!` (every call site passes it directly, so a
 * single upstream repair reaches all of them — patching each of the nine call sites individually
 * would risk exactly the divergence CLAUDE.md's evidence standard warns about).
 *
 * A dropped alias is always safe: Agent 7 and Agent 9 both fall back to the character's real name
 * when no identity rule exists for them, which is the common case for every character not on the
 * identity axis. Dropping one alias never removes a fair-play obligation — the concealment mechanism
 * this project actually gates on (locked facts, discriminating test, clue coverage) does not depend
 * on WHICH words name a suspect before the reveal.
 *
 * Flag-gated and default OFF, not because the repair is risky, but because this project's own
 * discipline (CLAUDE.md: "verify a lever by its agent label... not by grepping the module"; A_80 F13:
 * "measure the reach across a few runs first, then decide whether it should block") applies here too
 * — this is the FIRST time this collision class has ever been checked, its firing rate across the
 * corpus is unknown, and a repair that silently strips an intentional masked-stranger device on a
 * false-positive match would be a real loss. The warning fires regardless of the flag, so several
 * runs establish the real rate before the repair becomes the default.
 */
export function applyIdentityRuleCollisionRepair(ctx: OrchestratorContext): void {
  try {
    const identityRules = (ctx.cml as { CASE?: CaseView } | null | undefined)?.CASE?.prose_requirements?.identity_rules;
    const castCharacters = ctx.cast?.cast?.characters;
    const collisions = detectIdentityRuleOccupationCollisions(identityRules, castCharacters);
    if (collisions.length === 0) return;
    for (const c of collisions) {
      ctx.warnings.push(
        `[Agent 7 identity-rule collision] "${c.alias}" (${c.characterName}'s pre-reveal alias) is also ` +
          `${c.collidesWithCharacter}'s real occupation — a bare role-noun reference to either character ` +
          `would be ambiguous to a reader and invisible to the pronoun validator (role-noun-blind by ` +
          `design). ${isIdentityRuleCollisionGuardEnabled() ? "REPAIRED: dropped the alias." : "NOT repaired (AGENT7_IDENTITY_RULE_COLLISION_GUARD is off) — measuring only."}`,
      );
    }
    if (isIdentityRuleCollisionGuardEnabled()) {
      const dropIndices = new Set(collisions.map((c) => c.ruleIndex));
      (ctx.cml as { CASE: Required<Pick<CaseView, "prose_requirements">> }).CASE.prose_requirements.identity_rules = identityRules!.filter(
        (_: unknown, i: number) => !dropIndices.has(i),
      );
    }
  } catch (e) {
    console.warn(`[Agent 7 identity-rule collision] skipped: ${(e as Error).message}`);
  }
}

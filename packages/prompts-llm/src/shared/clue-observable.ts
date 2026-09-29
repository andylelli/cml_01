/**
 * The prose-facing clue helpers the Agent 9 modules call at runtime, split from the Agent 5 LLM module (code review A5-05) so importing them no longer pulls in jsonrepair, the client and story-validation. agent5-clues.ts re-exports them.
 */
import type { Clue } from "../types/clue-distribution.js";

/**
 * A_61 RC3.5 — map a physical death method to fair-play tells a witness could observe at the
 * body-discovery scene, plus the tokens Agent 7 uses to locate the generated tell clue. Generic across
 * the canonical methods; defaults to a neutral "manner of death" tell for anything unrecognised.
 */
export function deathMethodTellHints(deathMethod: string): { examples: string; tokens: string[] } {
  const m = String(deathMethod ?? "").toLowerCase();
  if (/poison|toxin|venom|arsenic|cyanide|strychnine/.test(m))
    return { examples: "for poison: numbness, a bitter almond residue, constriction, or sudden collapse with no wound", tokens: ["numbness", "bitter", "residue", "collapse", "convulsion", "no wound", "froth"] };
  if (/stab|knife|blade|dagger|puncture/.test(m))
    return { examples: "for stabbing: a puncture wound, blood pooling, a torn garment, or a missing blade", tokens: ["wound", "blood", "blade", "puncture", "torn"] };
  if (/blunt|struck|bludgeon|blow|struck down|beaten/.test(m))
    return { examples: "for blunt-force: a head wound, a bloodied heavy object, or bruising", tokens: ["wound", "blood", "bruis", "struck", "blunt"] };
  if (/strangl|garrot|throttle|asphyxiat|suffocat/.test(m))
    return { examples: "for strangulation: ligature marks, petechiae in the eyes, or a disturbed collar", tokens: ["ligature", "marks", "throat", "collar", "petechiae", "bruis"] };
  if (/shot|gun|firearm|bullet|pistol|revolver/.test(m))
    return { examples: "for shooting: a bullet wound, powder burns, a spent cartridge, or the report heard", tokens: ["wound", "bullet", "powder", "cartridge", "gunshot"] };
  if (/drown/.test(m))
    return { examples: "for drowning: water in the lungs, sodden clothing, or weed on the body", tokens: ["water", "sodden", "drown", "lungs"] };
  return { examples: "a concrete physical sign of how the victim died, visible at the scene", tokens: ["wound", "mark", "residue", "collapse"] };
}

/**
 * P1.2 — the on-page surface a character can SEE/HEAR/FIND. Prefer the dedicated `observable`
 * field and fall back to the analytic `description`, so existing distributions stay valid (this
 * lever is inert until the synthesizer/LLM starts emitting `observable`).
 */
export function deriveClueObservable(clue: Pick<Clue, "observable" | "description">): string {
  const observable = String(clue.observable ?? "").trim();
  if (observable.length > 0) return observable;
  return String(clue.description ?? "").trim();
}

/**
 * Shared role-archetype semantics for cast entries.
 *
 * Abort class #10 (2026-07-19, P5-CR poison arm): `role.includes("victim")`-style predicates —
 * ~30 sites across worker/prompts-llm/story-validation — treat RELATIONAL roles ("Friend of the
 * victim") as the deceased. The prompt builder then instructs the model the character is
 * "DECEASED, past-tense only", the lifecycle validator convicts her living scenes, and the rescue
 * pass reframes them — a run-killing cascade from one substring match. Word-boundary matching does
 * not fix this ("friend of the victim" contains the whole word), so the predicate below requires
 * "victim" to be what the role DENOTES: the head noun of the phrase.
 */
export const isVictimArchetype = (roleText: unknown): boolean => {
  const raw = String(roleText ?? "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " "); // "Victim (poisoned)" → "Victim"
  if (!raw.trim()) return false;

  // A role string may list alternates ("victim, hotel guest"); any victim-denoting segment counts.
  return raw.split(/[,;/]/).some((segment) => {
    // Relational phrases reference the victim without denoting them — keep only the head segment
    // before the first "of" ("friend of the victim" → "friend"; "victim of poisoning" → "victim").
    const head = (segment.split(/\bof\b/)[0] ?? "").trim().replace(/["'.!?]+$/, "");
    // The role denotes the victim only when "victim(s)" is the final (head) word — "murder victim",
    // "the victim" — never a modifier ("victim advocate") or possessive ("victim's confidant").
    return /\bvictims?$/.test(head);
  });
};

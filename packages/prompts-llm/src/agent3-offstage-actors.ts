/**
 * A_96 F3 — THE MECHANISM'S ACTORS MUST EXIST, OR BE NAMED AS ABSENT.
 *
 * Run 50862's CASE is coherent: *"the judge's habitual subtle tilting of the compass casing caused a
 * consistent fifteen-degree offset… Nora Quayle exploited this authoritative testimony."* A respected
 * witness is honestly wrong and the culprit leans on him — a proper authority-axis case. But the cast
 * is six people and none of them is the judge. Agent 9 had nobody to attach the role to and fused it
 * onto the VICTIM, so a dead man's sworn bearing anchored the book and the exploitation step was
 * never written. Clues would score 5 or 6.
 *
 * MEASURED across 59 archived cases: 1. Rare, catastrophic, and checked by nothing.
 *
 * Two halves. The audit finds role nouns in the mechanism that no cast member holds. The prompt line
 * then tells Agent 9 the role is OFF-STAGE — not the victim, not any cast member — so the model
 * writes an absent authority instead of inventing a fusion.
 */
const ROLE_NOUN_RE =
  /\bthe\s+(judge|steward|doctor|physician|surgeon|solicitor|barrister|vicar|rector|curate|bishop|constable|inspector|sergeant|superintendent|coroner|magistrate|clerk|porter|chauffeur|gardener|nurse|butler|housekeeper|cook|curator|surveyor|engineer|harbourmaster|stationmaster|postmaster|photographer|librarian|auctioneer|referee|timekeeper|adjudicator|umpire|steward|pilot|captain|colonel|major|professor|headmaster|matron|verger|sexton|organist|choirmaster|jeweller|banker|notary)\b/gi;

export interface OffstageActorAudit {
  /** Roles the mechanism names that no cast member's name or role field carries. */
  offstage: string[];
  /** Roles the mechanism names that a cast member does hold. */
  onstage: string[];
}

const castRoleBlob = (cmlCase: any): string =>
  ((cmlCase?.cast ?? []) as any[])
    .map((c) => `${c?.name ?? ""} ${c?.role_archetype ?? ""} ${c?.roleArchetype ?? ""} ${c?.role ?? ""} ${c?.occupation ?? ""}`)
    .join(" ")
    .toLowerCase();

export const auditMechanismActors = (cmlCase: any): OffstageActorAudit => {
  const mech = cmlCase?.hidden_model?.mechanism ?? {};
  const text = [
    String(mech.description ?? ""),
    ...((Array.isArray(mech.delivery_path) ? mech.delivery_path : []) as any[]).map((s) =>
      typeof s === "string" ? s : String(s?.step ?? ""),
    ),
  ].join(" ");
  const roles = new Set<string>();
  for (const m of text.matchAll(ROLE_NOUN_RE)) roles.add(m[1]!.toLowerCase());
  const blob = castRoleBlob(cmlCase);
  const offstage: string[] = [];
  const onstage: string[] = [];
  for (const r of roles) (blob.includes(r) ? onstage : offstage).push(r);
  return { offstage: offstage.sort(), onstage: onstage.sort() };
};

export const isOffstageActorsEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_OFFSTAGE_ACTORS ?? "").trim());

/** The line for the chapter prompt. Empty when every actor is on stage. */
export const buildOffstageActorLines = (cmlCase: any): string[] => {
  const { offstage } = auditMechanismActors(cmlCase);
  if (offstage.length === 0) return [];
  const victim = ((cmlCase?.cast ?? []) as any[]).find((c) =>
    /victim/i.test(String(c?.role_archetype ?? c?.roleArchetype ?? c?.role ?? "")),
  );
  const victimName = victim?.name ? ` and is NOT ${victim.name}, the victim` : "";
  const list = offstage.map((r) => `"the ${r}"`).join(", ");
  return [
    `  - ⚠ OFF-STAGE ACTOR${offstage.length > 1 ? "S" : ""}: the case refers to ${list}. ` +
      `No cast member holds this role${victimName}. This person exists OFF the page: their word, ` +
      `record or testimony is quoted, relied on and argued over, but they never appear, and the role ` +
      `must never be fused onto a cast member or onto the victim. If a character describes them, ` +
      `describe them as absent.`,
  ];
};

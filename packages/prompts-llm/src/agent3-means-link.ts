/**
 * THE MEANS-LINK CHECK — does the case connect the culprit to the ACT of killing, or only to the room?
 *
 * A_102: 48 of 56 archived cases (86%) prove the culprit was PRESENT and never that they struck the
 * blow, and the external reader named exactly that in four consecutive reads. Agent 3's MEANS-LINK
 * requirement (rule 8b in the prompt) asks the case to author one physical trace that ties the culprit
 * to the murder weapon. This is the check that says whether it did.
 *
 * ONE FUNCTION, TWO CALLERS. It began life inside `harness:agent3:direct` and was moved here so that
 * production normalization and the harness score a case with the SAME rule. A_102 §8: the paid run on
 * seed 61062 wrote the means-link trace naming a suspect the same case marks innocent, and nothing in
 * the pipeline noticed, because the only copy of this check lived in the harness. A second copy in the
 * pipeline would be restated-facts-must-be-generated-and-checked, which this repo has paid for four
 * times; so the harness now imports this one.
 *
 * It was wrong four times before it was right (A_102 §7.3), every defect found by reading the cases
 * it scored: it matched the culprit by surname only; it stopped at the first trace mentioning the
 * weapon; it demanded the weapon noun in a trace that legitimately sits somewhere the weapon is not;
 * and it matched the killing VERB, awarding its strongest verdict to "reveals Nora's presence when
 * Gaunt was stabbed". A_103 B71 then found raw substring matching reading "rope" in "proper". Every
 * one of those corrections is preserved below, with the reason beside it.
 */

export interface MeansLinkVerdict {
  /** PROVES THE ACT | TRACE ONLY | PRESENCE ONLY | UNKNOWN */
  verdict: "PROVES THE ACT" | "TRACE ONLY" | "PRESENCE ONLY" | "UNKNOWN";
  detail: string;
  /** Traces that mention the murder weapon AND name the culprit — the requirement's target. */
  linkingTraces: string[];
  /** Traces that mention the murder weapon and name nobody. */
  weaponTracesNamingNobody: string[];
  /** Traces that name the culprit but not the weapon — surfaced for a person to adjudicate. */
  culpritTracesWithoutWeapon: string[];
  /** A linking trace appears, word for word, in some inference step's observation or required_evidence. */
  usedInInferencePath: boolean;
  /** 1-based index of that step, when used. */
  usedByStep?: number;
}

const norm = (t: unknown): string => String(t ?? "").toLowerCase().replace(/[“”"'‘’]/g, "").replace(/\s+/g, " ").trim();

/**
 * Which inference step (1-based) carries one of the linking traces, in its observation or its
 * required_evidence — or undefined when none does. A_102 §10.2: authored and unused is the failure
 * the harness could not see.
 */
export const stepUsingTrace = (caseBlock: any, linkingTraces: string[]): number | undefined => {
  const steps: any[] = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  const targets = linkingTraces.map(norm).filter((t) => t.length > 0);
  if (targets.length === 0) return undefined;
  for (let i = 0; i < steps.length; i += 1) {
    const fields: string[] = [norm(steps[i]?.observation), ...(Array.isArray(steps[i]?.required_evidence) ? steps[i].required_evidence.map(norm) : [])];
    if (fields.some((f) => f.length > 0 && targets.some((t) => f.includes(t) || t.includes(f)))) return i + 1;
  }
  return undefined;
};

const STOP = new Set(["with", "were", "from", "into", "that", "this", "used", "been", "some", "their"]);
const TITLES = new Set(["mr", "mrs", "miss", "ms", "dr", "sir", "lady", "lord", "the"]);

const escapeRe = (w: string): string => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// A_103 B71: whole words only. Raw substring matching read "rope" in "proper", "iron" in
// "environment" and "Eve" in "Everard" as PROVES THE ACT (MEASURED, three fixtures).
const wordRe = (w: string): RegExp => new RegExp(`\\b${escapeRe(w)}\\b`, "i");
const wordReCase = (w: string): RegExp => new RegExp(`\\b${escapeRe(w)}\\b`);

/**
 * The INSTRUMENT nouns of a death_method, and only those. death_method reads
 * "<verb> with a <instrument>", and the verb ("stabbed") appears in every sentence that describes
 * the murder — including ones that prove only presence. Matching it made the probe agree with
 * anything (A_102 §7.3 defect 4). Take what follows " with ".
 */
export const instrumentWords = (deathMethod: string): string[] => {
  const dm = String(deathMethod ?? "").trim();
  const instrument = / with /i.test(dm) ? dm.split(/ with /i).slice(1).join(" ") : "";
  return instrument
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOP.has(w));
};

/**
 * Match ANY name token of a culprit, not just the surname: a trace reading "traces to Gwendolyn"
 * names the culprit as surely as one reading "Vance" (A_102 §7.3 defect 1). Titles are not names.
 */
export const nameTokens = (name: string): string[] =>
  String(name ?? "")
    .split(/[\s.,]+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 3 && !TITLES.has(w.toLowerCase()));

export const textNamesAnyOf = (text: string, names: string[]): boolean =>
  names.some((c) => text.includes(c) || nameTokens(c).some((w) => wordReCase(w).test(text)));

export const provesTheAct = (caseBlock: any): MeansLinkVerdict => {
  const empty = { linkingTraces: [] as string[], weaponTracesNamingNobody: [] as string[], culpritTracesWithoutWeapon: [] as string[], usedInInferencePath: false };
  const dm = String(caseBlock?.death_method ?? "").trim();
  if (!dm) return { verdict: "UNKNOWN", detail: "the case records no death_method", ...empty };
  const words = instrumentWords(dm);
  if (words.length === 0) {
    // No named instrument (strangled, smothered, pushed). Nothing to match on.
    return { verdict: "UNKNOWN", detail: `death_method names no instrument to trace: "${dm}"`, ...empty };
  }

  const has = (text: string): boolean => words.some((w) => wordRe(w).test(text));
  const dt = caseBlock?.discriminating_test ?? {};
  const testText = `${dt.design ?? ""} ${dt.knowledge_revealed ?? ""} ${dt.pass_condition ?? ""}`;
  const traces: string[] = Array.isArray(caseBlock?.constraint_space?.physical?.traces)
    ? caseBlock.constraint_space.physical.traces.map(String)
    : [];
  const culprits: string[] = Array.isArray(caseBlock?.culpability?.culprits)
    ? caseBlock.culpability.culprits.map(String)
    : [];
  const namesCulprit = (t: string): boolean => textNamesAnyOf(t, culprits);

  // EVERY trace that touches the means of death, not the first one (A_102 §7.3 defect 2). A case can
  // carry a forensic trace pointing at an innocent AND a provenance trace naming the culprit; stopping
  // at the first reported the weaker of the two and hid the one the requirement was written to produce.
  const weaponTraces = traces.filter((t) => has(t));
  const linkingTraces = weaponTraces.filter((t) => namesCulprit(t));
  const weaponTracesNamingNobody = weaponTraces.filter((t) => !namesCulprit(t));
  // Traces that name the culprit without repeating a noun of death_method (defect 3). The requirement
  // asks for what the weapon's TAKING disturbed, which can sit somewhere the weapon is not ("blood on
  // her clothing"). The verdict stays conservative; these are surfaced to be read, never counted.
  const culpritTracesWithoutWeapon = traces.filter((t) => namesCulprit(t) && !has(t));
  const q = (xs: string[]): string => xs.map((t) => `"${t}"`).join("; ");
  const adjudicate =
    culpritTracesWithoutWeapon.length > 0
      ? `\n    NAMES THE CULPRIT, no weapon noun — adjudicate: ${q(culpritTracesWithoutWeapon)}`
      : "";
  const usedByStep = stepUsingTrace(caseBlock, linkingTraces);
  const out = { linkingTraces, weaponTracesNamingNobody, culpritTracesWithoutWeapon, usedInInferencePath: usedByStep !== undefined, usedByStep };

  if (has(testText)) return { verdict: "PROVES THE ACT", detail: "the discriminating test names the means of death", ...out };
  if (linkingTraces.length > 0) {
    // A_102 §10.2: a trace the inference path never touches reaches the clue layer without its
    // object. Say so beside the verdict, in the harness and in the run log alike.
    const use = usedByStep !== undefined ? `  [used by inference step ${usedByStep}]` : "  [NOT USED by any inference step]";
    return {
      verdict: "PROVES THE ACT",
      detail: q(linkingTraces) + use + (weaponTracesNamingNobody.length > 0 ? `  [also on the weapon, naming nobody: ${q(weaponTracesNamingNobody)}]` : ""),
      ...out,
    };
  }
  if (weaponTraces.length > 0) {
    return { verdict: "TRACE ONLY", detail: `${q(weaponTraces)} — none names a culprit${adjudicate}`, ...out };
  }
  return {
    verdict: "PRESENCE ONLY",
    detail: `nothing connects ${culprits.join(", ") || "the culprit"} to "${dm}" — pass_condition: "${String(dt.pass_condition ?? "").slice(0, 110)}"${adjudicate}`,
    ...out,
  };
};

/**
 * A_102 §8.3 — the means-link slot was filled with the name of a suspect the case itself marks
 * innocent, after normalization reassigned the culprit. Given the names the model ORIGINALLY listed
 * as culprits and the names normalization settled on, report any means-link-shaped trace (the
 * "<what was found> in <place> — <name>" shape, or any trace mentioning the weapon) that names one of
 * the originals and none of the settled culprits: that trace now points at an innocent.
 */
export const orphanedMeansLinkTraces = (
  caseBlock: any,
  originalCulprits: string[],
  settledCulprits: string[],
): string[] => {
  const traces: string[] = Array.isArray(caseBlock?.constraint_space?.physical?.traces)
    ? caseBlock.constraint_space.physical.traces.map(String)
    : [];
  const words = instrumentWords(String(caseBlock?.death_method ?? ""));
  const mentionsWeapon = (t: string): boolean => words.some((w) => wordRe(w).test(t));
  const shaped = (t: string): boolean => /\s[—–-]\s*(by\s+)?[A-Z][^,;]*$/.test(t);
  const originals = originalCulprits.filter((n) => !settledCulprits.includes(n));
  if (originals.length === 0) return [];
  return traces.filter((t) => (shaped(t) || mentionsWeapon(t)) && textNamesAnyOf(t, originals) && !textNamesAnyOf(t, settledCulprits));
};

/**
 * ANALYSIS_109 M3 — DOES THE CASE PROVE ITSELF? An abstract argumentation framework (Dung, 1995).
 *
 * Arguments: G(s) "s is guilty" for every suspect; each clearing clue and each stated clearance; the
 * false assumption and the culprit's own alibi (the culprit's COVER); the discriminating test and each
 * clue that points at the culprit (what breaks the cover). Attacks: a clearance attacks G of whom it
 * clears; a cover attacks G(culprit); the test and the pointing clues attack the cover.
 *
 * The GROUNDED extension — the unique least fixpoint of "accept every argument all of whose attackers
 * are attacked by what is accepted" — is what the case establishes. Read off it:
 *   - the culprit is PROVEN iff G(culprit) is in it (every cover defeated);
 *   - an innocent whose G(s) is in it was never cleared by anything — a second live suspect at the end;
 *   - a clearance aimed at the culprit is a contradiction in the case.
 *
 * WHAT THIS CANNOT DO, stated because A_109 promised more: the case says which clue clears whom and
 * which proof step a clue serves, but not which evidence defeats which part of the culprit's cover.
 * A "how busy is the solution" count built on that would be invented, so it is not built. The proof's
 * ORDER is the case's own inference path, which the reveal can be asked to follow (`proofSteps`).
 */
import type { CaseModel } from "./model.js";

export interface ProofAnalysis {
  culpritProven: boolean;
  /** Innocents nothing clears — each is still a live suspect when the book ends. */
  uncleared: string[];
  /** Culprits a clue or clearance clears — a contradiction in the case. */
  culpritCleared: string[];
  /** Inference steps no clue declares it serves. */
  stepsWithoutClues: number[];
  /** How many steps the proof has — the reveal's count. */
  proofSteps: number;
  /** The arguments the grounded extension accepts, for audit. */
  grounded: string[];
}

export interface ProofInput {
  /** `prose_requirements.suspect_clearance_scenes[].suspect_name`, when the case states them. */
  clearedByScene?: ReadonlyArray<string>;
}

/** The grounded extension of (args, attacks): iterate the characteristic function from ∅. */
export const groundedExtension = (args: ReadonlyArray<string>, attacks: ReadonlyArray<readonly [string, string]>): Set<string> => {
  const attackers = new Map<string, string[]>(args.map((a) => [a, []]));
  for (const [from, to] of attacks) attackers.get(to)?.push(from);
  const accepted = new Set<string>();
  const defeated = new Set<string>();
  for (let changed = true; changed; ) {
    changed = false;
    for (const a of args) {
      if (accepted.has(a) || defeated.has(a)) continue;
      if ((attackers.get(a) ?? []).every((b) => defeated.has(b))) {
        accepted.add(a);
        for (const [from, to] of attacks) if (from === a && !defeated.has(to)) defeated.add(to);
        changed = true;
      }
    }
  }
  return accepted;
};

export const analyseProof = (model: CaseModel, input: ProofInput = {}): ProofAnalysis => {
  const culprits = new Set(model.culprits);
  const G = (s: string): string => `guilty:${s}`;
  const args: string[] = model.suspects.map((s) => G(s.name));
  const attacks: Array<[string, string]> = [];

  // Clearances: a clearing clue attacks G of each non-culprit it names; a clearance aimed only at
  // culprits is recorded as a contradiction rather than silently dropped.
  const culpritCleared = new Set<string>();
  for (const clue of model.clues.filter((c) => c.clears.length > 0)) {
    clue.clears.filter((n) => culprits.has(n)).forEach((n) => culpritCleared.add(n));
    const targets = clue.clears.filter((n) => !culprits.has(n));
    if (targets.length === 0) continue;
    args.push(`clue:${clue.id}`);
    for (const t of targets) attacks.push([`clue:${clue.id}`, G(t)]);
  }
  for (const name of input.clearedByScene ?? []) {
    if (!model.suspects.some((s) => s.name === name)) continue;
    if (culprits.has(name)) {
      culpritCleared.add(name);
      continue;
    }
    args.push(`clearance:${name}`);
    attacks.push([`clearance:${name}`, G(name)]);
  }

  // The culprit's cover, and what breaks it.
  const covers: string[] = [];
  if (model.falseAssumption) covers.push("cover:false-assumption");
  for (const c of model.culprits) {
    if (model.suspects.find((s) => s.name === c)?.alibiRaw) covers.push(`cover:alibi:${c}`);
  }
  args.push(...covers);
  for (const cover of covers) for (const c of model.culprits) attacks.push([cover, G(c)]);
  const breakers: string[] = [];
  if (model.testDesign) breakers.push("test");
  for (const clue of model.clues.filter((c) => c.implicates.some((n) => culprits.has(n)))) {
    breakers.push(`points:${clue.id}`);
  }
  args.push(...breakers);
  for (const b of breakers) for (const cover of covers) attacks.push([b, cover]);

  const grounded = groundedExtension(args, attacks);
  const declared = new Set(model.clues.map((c) => c.step).filter((n): n is number => n !== null));
  return {
    culpritProven: model.culprits.length > 0 && model.culprits.every((c) => grounded.has(G(c))),
    uncleared: model.suspects.filter((s) => !culprits.has(s.name) && grounded.has(G(s.name))).map((s) => s.name),
    culpritCleared: [...culpritCleared],
    stepsWithoutClues: model.steps.map((s) => s.index).filter((i) => !declared.has(i)),
    proofSteps: model.steps.length,
    grounded: [...grounded],
  };
};

export const summariseProof = (p: ProofAnalysis): string => {
  const short = (n: string): string => n.split(" ").slice(-1)[0] ?? n;
  const parts = [
    p.culpritProven ? "culprit proven (every cover defeated)" : "culprit NOT proven — a cover stands undefeated",
    p.uncleared.length === 0 ? "every innocent cleared" : `uncleared innocents: ${p.uncleared.map(short).join(", ")}`,
  ];
  if (p.culpritCleared.length > 0) parts.push(`the case CLEARS the culprit: ${p.culpritCleared.map(short).join(", ")}`);
  if (p.stepsWithoutClues.length > 0) parts.push(`proof steps with no clue: ${p.stepsWithoutClues.join(", ")}`);
  parts.push(`${p.proofSteps} proof steps`);
  return parts.join(" · ");
};

/** The names the case's own clearance scenes clear (`prose_requirements.suspect_clearance_scenes`). */
export const clearedBySceneOf = (cml: unknown): string[] => {
  const c = (cml as { CASE?: unknown })?.CASE ?? cml;
  const pr = (c as { prose_requirements?: { suspect_clearance_scenes?: unknown[] } } | null)?.prose_requirements;
  return (Array.isArray(pr?.suspect_clearance_scenes) ? pr!.suspect_clearance_scenes : [])
    .map((e) => String((e as { suspect_name?: unknown })?.suspect_name ?? "").trim())
    .filter(Boolean);
};

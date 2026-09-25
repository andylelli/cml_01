/**
 * ANALYSIS_109 §9 — ONE PARSE OF THE CASE FOR EVERY FORMAL CHECK.
 *
 * M1 (the timeline network), M2 (the reader model), M3 (the proof core) and M4 (the route) all read
 * the same facts: who the suspects are, what each clue points at, when things happen. Parsed once
 * here, so four methods cannot disagree about who is named in a clue. Pure — no LLM, no env — so it
 * replays over the archive for £0.
 *
 * Every classification below is a RULE over the case's own fields, stated where it is made. None of
 * it is a claim about the prose; all of it is INFERRED from ids and wording, and each consumer
 * reports how many facts it could not place, so a verdict over half the facts is not believed.
 */
import { deriveCaseChronology } from "../chronology.js";
import type { Chronology, ChronologyFactInput } from "../chronology.js";

export interface SuspectFact {
  name: string;
  role: string;
  /** The alibi as the case wrote it. */
  alibiRaw: string;
  channels: string[];
  motiveStrength: string;
  /** Lower-case name tokens that belong to this person and to nobody else in the cast. */
  identifying: string[];
}

/**
 * What a clue does to the reader's suspicion. `points` — it implicates the suspects it names;
 * `eliminates` — it clears them; `neutral` — it names no suspect (a mechanism or time clue).
 */
export type ClueKind = "points" | "eliminates" | "neutral";

export interface ClueFact {
  id: string;
  text: string;
  /** Suspects the clue names (never the victim or the investigator). */
  names: string[];
  /** Suspects the clue clears, and suspects it implicates — one clue can do both. */
  clears: string[];
  implicates: string[];
  /** The summary: `points` if it implicates anyone, `eliminates` if it only clears, else `neutral`. */
  kind: ClueKind;
  /** `supportsInferenceStep`, when the clue declares it (1-based, as Agent 5 writes it). */
  step: number | null;
  criticality: string;
}

export interface StepFact {
  index: number;
  observation: string;
  correction: string;
  effect: string;
  requiredEvidence: string[];
}

export interface CaseModel {
  victim: string;
  culprits: string[];
  detective: string | null;
  /** The false solution's accused, when the case names one. */
  falseAccused: string | null;
  falseAssumption: string;
  testDesign: string;
  /** Every living cast member who is not the investigator — the culprit included. */
  suspects: SuspectFact[];
  chronology: Chronology;
  clues: ClueFact[];
  steps: StepFact[];
}

const text = (value: unknown): string => String(value ?? "").replace(/\s+/g, " ").trim();
const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);
const rec = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" ? (value as Record<string, unknown>) : {};

/** Titles and particles that identify nobody. */
const TITLES = new Set(
  "lady lord sir dame dr doctor mr mrs miss ms inspector sergeant constable captain colonel major reverend rev father professor prof the of de van von".split(" "),
);

const tokensOf = (name: string): string[] =>
  name
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/[\s-]+/)
    .filter((t) => t.length > 1 && !TITLES.has(t));

const words = (value: string): Set<string> =>
  new Set(value.toLowerCase().replace(/[^a-z\s'-]/g, " ").split(/[\s-]+/).filter(Boolean).map((w) => w.replace(/'s$/, "")));

/** Each name with the tokens that identify it within this set of names — for `namesIn`. */
export const identifyPeople = (names: ReadonlyArray<string>): Array<{ name: string; identifying: string[] }> => {
  const unique = [...new Set(names.map((n) => String(n ?? "").trim()).filter(Boolean))];
  const count = new Map<string, number>();
  for (const name of unique) for (const t of new Set(tokensOf(name))) count.set(t, (count.get(t) ?? 0) + 1);
  return unique.map((name) => ({ name, identifying: tokensOf(name).filter((t) => count.get(t) === 1) }));
};

/**
 * The people a text names, by the tokens that identify them. "Charles" names Charles Langley only
 * when no other Charles is in the cast; "Langley" names nobody in a cast of three Langleys (golden
 * 6b91b4b1) — which is why a surname match alone was not used.
 */
export const namesIn = (value: string, people: ReadonlyArray<{ name: string; identifying: string[] }>): string[] => {
  const w = words(value);
  const lower = value.toLowerCase();
  return people
    .filter((p) => lower.includes(p.name.toLowerCase()) || p.identifying.some((t) => w.has(t)))
    .map((p) => p.name);
};

/**
 * WHAT A CLUE DOES, read first from the case's own statement of it.
 *
 * Agent 5 writes an `inference` for every clue (88 of 88 golden clues) and it usually says the effect
 * outright: "Eliminates Margaret Hensley and narrows the solution toward Charles Montague";
 * "Annabelle Marwood cannot be the culprit, focusing suspicion on Charles Fenwick". One clue can clear
 * one person and implicate another, so the inference is read CLAUSE BY CLAUSE, and each clause assigns
 * the people it names to `clears` or `implicates`.
 *
 * Only a clue whose inference names nobody's fate falls back to the wording rules, which were measured
 * wrong on golden eb1251aa before the inference was used: `clue_charles_alibi_conflict` ("witnesses
 * place Charles Pembroke near the sundial … conflicting with his alibi") read as clearing the culprit;
 * "footprints … lack moisture traces matching Eleanor Fairchild's shoes" read as pointing at her.
 */
const CLEARS = /\b(?:eliminat\w*|exclud\w*|clears?|cleared|rules? out|ruled out|cannot be|could not have|lacked (?:the )?(?:opportunity|means|access)|had no (?:opportunity|means|access)|innocen\w*|alibi (?:holds|stands|confirmed)|was not present)\b/i;
const IMPLICATES = /\b(?:only|ties|tied|implicat\w*|identif\w*|narrows?|narrowing|focus\w*|suspicion on|motive|premeditat\w*|present near|presence near|involvement|guilt\w*|culprit|murderer|responsible|means and|had the (?:means|skill|opportunity)|at the (?:scene|crime)|with opportunity|opportunity to|shortly (?:before|after) the murder)\b/i;
const BREAKS = /\b(?:conflict\w*|contradict\w*|inconsisten\w*|breaks?|broken|false|lie[sd]?|gap|disprov\w*)\b/i;
const NEGATED_MATCH = /\b(?:lack|lacks|lacking|no|not|never|without|absence of)\b[^.]{0,50}\bmatch/i;
const CORROBORATES = /\b(?:confirm|corroborat|attest|verif|exclud|accounted|places?|placing|placed|was seen (?:in|at))\w*/i;
const ELIMINATES_ID = /eliminat|alibi|clear|exclud/i;
const POINTS_ID = /culprit|premeditation|unique|possession|tool|means|motive/i;

type People = ReadonlyArray<{ name: string; identifying: string[] }>;

/** Clause by clause: who the inference clears and who it implicates. */
export const readInference = (inference: string, people: People): { clears: string[]; implicates: string[] } => {
  const clears = new Set<string>();
  const implicates = new Set<string>();
  const clauses = inference.split(/;|\.\s|,\s*(?=(?:and |which |narrow|focus|leaving|pointing|so ))|\band (?=narrow|focus|point|leav)/i);
  for (const clause of clauses) {
    const named = namesIn(clause, people);
    if (named.length === 0) continue;
    if (CLEARS.test(clause) && !BREAKS.test(clause)) named.forEach((n) => clears.add(n));
    else if (IMPLICATES.test(clause) || BREAKS.test(clause)) named.forEach((n) => implicates.add(n));
  }
  return { clears: [...clears], implicates: [...implicates].filter((n) => !clears.has(n)) };
};

/** The fallback, for a clue whose inference names nobody's fate: rules over id and wording. */
const classifyByWording = (id: string, body: string, named: string[]): ClueKind => {
  if (named.length === 0) return "neutral";
  if (NEGATED_MATCH.test(body)) return "eliminates";
  if (BREAKS.test(id) || BREAKS.test(body)) return "points";
  // Seen AT the scene is opportunity, however it is corroborated: golden eb1251aa's `clue_staff_witness`
  // ("staff recall seeing Charles Pembroke near the garden gates shortly before the murder") read as a
  // clearance of the culprit because its description says "confirms".
  if (IMPLICATES.test(body)) return "points";
  if (ELIMINATES_ID.test(id)) return "eliminates";
  if (POINTS_ID.test(id)) return "points";
  if (CORROBORATES.test(body) && !/\bonly\b/i.test(body)) return "eliminates";
  return "points";
};

export interface CaseModelInput {
  /** The CML, wrapped (`{CASE}`) or bare. */
  cml: unknown;
  /** The clues artifact (`{clues: [...]}`) or the array. */
  clues?: unknown;
  lockedFacts?: ReadonlyArray<ChronologyFactInput>;
}

export const buildCaseModel = (input: CaseModelInput): CaseModel => {
  const C = rec(rec(input.cml).CASE ?? input.cml);
  const cast = asArray(C.cast).map(rec);
  const roleOf = (m: Record<string, unknown>): string => text(m.role_archetype ?? m.roleArchetype ?? m.role).toLowerCase();
  const nameOf = (m: Record<string, unknown>): string => text(m.name);

  const culprits = asArray(rec(C.culpability).culprits).map(text).filter(Boolean);
  const victim = nameOf(cast.find((m) => /victim/.test(roleOf(m))) ?? {}) || text(C.victim);
  const detective = nameOf(cast.find((m) => /detective|investigator|inspector/.test(roleOf(m))) ?? {}) || null;

  const everyone = cast.map(nameOf).filter(Boolean);
  const tokenCount = new Map<string, number>();
  for (const name of everyone) for (const t of new Set(tokensOf(name))) tokenCount.set(t, (tokenCount.get(t) ?? 0) + 1);
  const identifying = (name: string): string[] => tokensOf(name).filter((t) => tokenCount.get(t) === 1);

  const suspects: SuspectFact[] = cast
    .filter((m) => nameOf(m) && nameOf(m) !== victim && nameOf(m) !== detective)
    .map((m) => ({
      name: nameOf(m),
      role: roleOf(m),
      alibiRaw: text(m.alibi_window ?? m.alibiWindow),
      channels: asArray(m.opportunity_channels ?? m.opportunityChannels).map(text).filter(Boolean),
      motiveStrength: text(m.motive_strength ?? m.motiveStrength),
      identifying: identifying(nameOf(m)),
    }));

  const clueList = Array.isArray(input.clues) ? input.clues : asArray(rec(input.clues).clues);
  const clues: ClueFact[] = clueList.map(rec).map((c) => {
    const id = text(c.id);
    const body = [c.observable, c.description, c.pointsTo].map(text).filter(Boolean).join(" ");
    const named = namesIn(body, suspects);
    const step = Number(c.supportsInferenceStep);
    const read = readInference(text(c.inference), suspects);
    let clears = read.clears;
    let implicates = read.implicates;
    if (clears.length === 0 && implicates.length === 0) {
      const kind = classifyByWording(id, body, named);
      if (kind === "eliminates") clears = named;
      if (kind === "points") implicates = named;
    }
    return {
      id,
      text: text(c.observable) || text(c.description),
      names: [...new Set([...named, ...clears, ...implicates])],
      clears,
      implicates,
      kind: clears.length > 0 && implicates.length === 0 ? "eliminates" : implicates.length > 0 ? "points" : "neutral",
      step: Number.isFinite(step) && step > 0 ? step : null,
      criticality: text(c.criticality),
    };
  });

  const steps: StepFact[] = asArray(rec(C.inference_path).steps).map(rec).map((s, i) => ({
    index: i + 1,
    observation: text(s.observation),
    correction: text(s.correction),
    effect: text(s.effect),
    requiredEvidence: asArray(s.required_evidence).map(text).filter(Boolean),
  }));

  const falseSolution = rec(C.false_solution);
  const falseAccused = text(falseSolution.accused_suspect ?? falseSolution.accused) || null;
  const falseAssumption = text(rec(C.false_assumption).statement ?? C.false_assumption);

  return {
    victim,
    culprits,
    detective,
    falseAccused,
    falseAssumption,
    testDesign: text(rec(C.discriminating_test).design),
    suspects,
    chronology: deriveCaseChronology(C, input.lockedFacts ?? []),
    clues,
    steps,
  };
};

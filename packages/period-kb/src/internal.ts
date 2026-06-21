/**
 * Period KB — internal term resolution shared by the oracle and the linter.
 *
 * One job: given an era entry and a surface term ("fluorescent light", "dna swab",
 * "telephone"), decide whether that means was available in that period, using only the
 * structured facts in the entry. Surface phrasings are mapped to canonical KB tokens via
 * the alias tables below so callers don't have to know the exact token spelling.
 */

import type { EraEntry } from "./types.js";

export interface TermResolution {
  normalizedTerm: string;
  /** Canonical token the surface phrase resolved to — the dedupe key for the linter. */
  canonical: string;
  available: boolean | "unknown";
  basis: string;
  caveat?: string;
}

/** Lowercase, strip punctuation, collapse whitespace, underscore-join. */
export function normalizeTerm(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "_");
}

/**
 * Surface phrase (normalized) -> canonical token that appears in an entry's
 * not_yet_invented / lighting.absent / technology.absent / lighting.domestic /
 * technology.present lists.
 */
const TERM_ALIASES: Record<string, string> = {
  // hard-absent technologies
  fluorescent: "fluorescent_lighting",
  fluorescent_light: "fluorescent_lighting",
  fluorescent_lighting: "fluorescent_lighting",
  strip_light: "fluorescent_lighting",
  strip_lighting: "fluorescent_lighting",
  dna: "dna_profiling",
  dna_test: "dna_profiling",
  dna_profiling: "dna_profiling",
  dna_profile: "dna_profiling",
  dna_swab: "dna_profiling",
  dna_evidence: "dna_profiling",
  genetic_fingerprint: "dna_profiling",
  ballpoint: "ballpoint_pen",
  ballpoint_pen: "ballpoint_pen",
  biro: "ballpoint_pen",
  television: "television_broadcast_domestic",
  television_set: "television_broadcast_domestic",
  tv_set: "television_broadcast_domestic",
  photocopier: "photocopier",
  photocopy: "photocopier",
  xerox: "photocopier",
  mobile_phone: "mobile_telephone",
  mobile_telephone: "mobile_telephone",
  cell_phone: "mobile_telephone",
  cellphone: "mobile_telephone",
  cellular_phone: "mobile_telephone",
  cctv: "cctv",
  cctv_camera: "cctv",
  security_camera: "cctv",
  surveillance_camera: "cctv",
  penicillin: "antibiotics_penicillin_clinical",
  antibiotic: "antibiotics_penicillin_clinical",
  antibiotics: "antibiotics_penicillin_clinical",
  jet: "jet_airliner",
  jet_airliner: "jet_airliner",
  jetliner: "jet_airliner",
  tape_recorder: "tape_recorder_portable",
  portable_tape_recorder: "tape_recorder_portable",
  computer: "computer",
  led_light: "led",
  led_lamp: "led",
  halogen: "halogen",
  halogen_lamp: "halogen",
  // present period means
  gaslight: "gaslight",
  gas_light: "gaslight",
  candle: "candle",
  oil_lamp: "oil_lamp",
  paraffin_lamp: "paraffin_lamp",
  wireless: "wireless_radio",
  wireless_set: "wireless_radio",
  wireless_radio: "wireless_radio",
  gramophone: "gramophone",
  motorcar: "motorcar",
  motor_car: "motorcar",
  typewriter: "typewriter",
  wristwatch: "wristwatch",
  flashbulb: "flashbulb",
};

/** Surface phrase (normalized) -> a capability lookup in forensics/communication. */
const CAPABILITY_ALIASES: Record<string, { domain: "forensics" | "communication"; key: string }> = {
  fingerprint: { domain: "forensics", key: "fingerprinting" },
  fingerprints: { domain: "forensics", key: "fingerprinting" },
  fingerprinting: { domain: "forensics", key: "fingerprinting" },
  fingerprint_powder: { domain: "forensics", key: "fingerprinting" },
  toxicology: { domain: "forensics", key: "toxicology" },
  poison_test: { domain: "forensics", key: "toxicology" },
  ballistics: { domain: "forensics", key: "ballistics" },
  comparison_microscope: { domain: "forensics", key: "ballistics" },
  blood_typing: { domain: "forensics", key: "blood" },
  blood_group: { domain: "forensics", key: "blood" },
  blood_grouping: { domain: "forensics", key: "blood" },
  document_examination: { domain: "forensics", key: "document_examination" },
  handwriting_analysis: { domain: "forensics", key: "document_examination" },
  telephone: { domain: "communication", key: "telephone" },
  phone: { domain: "communication", key: "telephone" },
  telephone_call: { domain: "communication", key: "telephone" },
  telegram: { domain: "communication", key: "telegram" },
  telegraph: { domain: "communication", key: "telegram" },
  post: { domain: "communication", key: "post" },
  letter: { domain: "communication", key: "post" },
  radio: { domain: "communication", key: "radio" },
};

/**
 * Surface phrases the anachronism linter scans for. Each must resolve to a definite
 * availability via `resolveTermAvailability`. Deliberately excludes words that are
 * ambiguous in period prose (bare "tv", bare "led", bare "neon") to avoid false positives.
 */
export const ANACHRONISM_SURFACE_TERMS: string[] = [
  "fluorescent lighting",
  "fluorescent light",
  "fluorescent",
  "strip lighting",
  "dna profiling",
  "dna test",
  "dna swab",
  "dna evidence",
  "genetic fingerprint",
  "dna",
  "ballpoint pen",
  "ballpoint",
  "biro",
  "television set",
  "television",
  "tv set",
  "photocopier",
  "photocopy",
  "xerox",
  "mobile phone",
  "cell phone",
  "cellphone",
  "cctv camera",
  "cctv",
  "security camera",
  "surveillance camera",
  "penicillin",
  "antibiotics",
  "jet airliner",
  "jetliner",
  "computer",
  "tape recorder",
  "halogen lamp",
  "led light",
];

const lightingAbsentBasis = (entry: EraEntry, token: string): string | undefined => {
  if (entry.not_yet_invented.includes(token)) return "not_yet_invented";
  if (entry.lighting.absent.includes(token)) return "lighting.absent";
  if (entry.technology.absent.includes(token)) return "technology.absent";
  return undefined;
};

/**
 * Resolve whether `rawTerm` was available in `entry`'s period. Pure, deterministic.
 */
export function resolveTermAvailability(entry: EraEntry, rawTerm: string): TermResolution {
  const normalizedTerm = normalizeTerm(rawTerm);

  // 1. Capability lookup (forensics/communication).
  const capability = CAPABILITY_ALIASES[normalizedTerm];
  if (capability) {
    const canonical = `${capability.domain}:${capability.key}`;
    if (capability.domain === "forensics") {
      const fact = entry.forensics[capability.key];
      if (!fact) {
        return { normalizedTerm, canonical, available: "unknown", basis: `forensics.${capability.key} not in entry` };
      }
      return {
        normalizedTerm,
        canonical,
        available: fact.status !== "nonexistent",
        basis: `forensics.${capability.key} status=${fact.status}`,
        caveat: fact.caveat ?? fact.note,
      };
    }
    const comm = entry.communication[capability.key];
    if (!comm) {
      return { normalizedTerm, canonical, available: "unknown", basis: `communication.${capability.key} not in entry` };
    }
    return {
      normalizedTerm,
      canonical,
      available: true,
      basis: `communication.${capability.key}`,
      caveat: comm.caveat ?? comm.note,
    };
  }

  // 2. Canonical token against absent/present sets.
  const canonical = TERM_ALIASES[normalizedTerm] ?? normalizedTerm;

  const absentBasis = lightingAbsentBasis(entry, canonical);
  if (absentBasis) {
    return { normalizedTerm, canonical, available: false, basis: absentBasis };
  }
  if (entry.lighting.domestic.includes(canonical)) {
    return { normalizedTerm, canonical, available: true, basis: "lighting.domestic" };
  }
  if (entry.technology.present.includes(canonical)) {
    return { normalizedTerm, canonical, available: true, basis: "technology.present" };
  }

  // 3. Direct key match (caller passed an exact forensics/communication key).
  if (entry.forensics[canonical]) {
    const fact = entry.forensics[canonical];
    return {
      normalizedTerm,
      canonical: `forensics:${canonical}`,
      available: fact.status !== "nonexistent",
      basis: `forensics.${canonical} status=${fact.status}`,
      caveat: fact.caveat ?? fact.note,
    };
  }
  if (entry.communication[canonical]) {
    return { normalizedTerm, canonical: `communication:${canonical}`, available: true, basis: `communication.${canonical}` };
  }

  // 4. Not represented.
  return { normalizedTerm, canonical, available: "unknown", basis: "not represented in KB" };
}

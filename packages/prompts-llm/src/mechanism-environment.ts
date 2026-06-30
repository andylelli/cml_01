/**
 * A_57 D3 — mechanism–environment consistency.
 *
 * A hard-logic device implies an environmental PRECONDITION (a sundial needs direct sunlight; a tidal
 * mechanism needs a particular tide; a thermal latch needs a temperature). When the story's SETTING
 * weather/season contradicts that precondition — the run-09168377 sundial needed CLEAR SKIES but the
 * setting was winter OVERCAST/drizzle — the clue-critical condition fights the ambient world and the prose
 * visibly strains to reconcile them (which also feeds the D1 garbled-surfacing splices).
 *
 * This module derives the precondition from the device text and checks it against the setting. It is
 * parameter-generic: it keys off the mechanism FAMILY (solar / tidal / thermal / acoustic / astronomical),
 * never a specific weather or story. It is deliberately CONSERVATIVE — it asserts a precondition only when
 * a strong family signal is present, and flags a conflict only when an ambient term directly contradicts
 * it, so it never invents a conflict the world does not actually have.
 */

export type EnvironmentFactor = "sunlight" | "tide" | "temperature" | "quiet" | "night_sky";

export interface MechanismEnvironmentPrecondition {
  /** the environmental factor the mechanism depends on */
  factor: EnvironmentFactor;
  /** human-readable ambient condition the mechanism needs in order to work */
  requires: string;
}

export interface MechanismEnvironmentCheck {
  /** the derived precondition, or null when no strong mechanism-family signal is present */
  precondition: MechanismEnvironmentPrecondition | null;
  /** true only when the setting weather/season directly contradicts the precondition */
  conflict: boolean;
  /** the ambient weather text examined (for logs / prompts) */
  ambient: string;
  /** the specific ambient term that contradicts the precondition, when conflict is true */
  conflictTerm?: string;
  /**
   * a generic, parameter-agnostic instruction the prose layer can surface so a conflict is resolved by a
   * brief, JUSTIFIED local exception (a short break in the overcast) rather than ignored or papered over.
   */
  repairInstruction?: string;
}

export interface DeviceLike {
  title?: string;
  corePrinciple?: string;
  surfaceIllusion?: string;
  underlyingReality?: string;
  mechanismFamilyHints?: string[];
  fairPlayClues?: string[];
}

export interface AtmosphereLike {
  weather?: string;
  timeOfDay?: string;
  season?: string;
}

/**
 * Each family: a high-precision signal pattern over the device text, the precondition it implies, and the
 * ambient terms that CONTRADICT it. Order matters only for which precondition is reported first; the first
 * family whose signal matches wins (devices realise one primary mechanism). Patterns are intentionally
 * specific (e.g. `sundial`/`gnomon`/`solar`) to avoid asserting a precondition on a vague match.
 */
interface FamilyRule {
  factor: EnvironmentFactor;
  signal: RegExp;
  requires: string;
  /** ambient phrases incompatible with the precondition */
  conflict: RegExp;
}

const FAMILY_RULES: FamilyRule[] = [
  {
    // Solar / optical: sundials, shadows, solar geometry — need an unobstructed sun.
    factor: "sunlight",
    signal: /\b(?:sundial|gnomon|sun['’]?s?\s+(?:angle|shadow|position)|solar\s+(?:angle|azimuth|elevation|geometry|position)|shadow\s+(?:length|angle|cast)|cast\s+a?\s*shadow|sunlight\s+angle)\b/i,
    requires: "direct, unobstructed sunlight and clear skies (the shadow / solar reading cannot form under cloud)",
    conflict: /\b(?:overcast|cloud(?:y|ed)?|rain(?:y|ing)?|drizzl\w*|downpour|storm\w*|fog(?:gy)?|mist(?:y)?|gloom\w*|grey\s+sk\w*|gray\s+sk\w*|sleet|snow(?:ing|fall)?|sunless|no\s+sun)\b/i,
  },
  {
    // Tidal: needs a specific tide / water state.
    factor: "tide",
    signal: /\b(?:tide|tidal|low\s+water|high\s+water|ebb\s+tide|flood\s+tide|tide\s+table)\b/i,
    requires: "the specific tide state the mechanism depends on (the timing fails at the wrong tide)",
    conflict: /\b(?:slack\s+water|tide\s+(?:was|were)\s+wrong|against\s+the\s+tide)\b/i,
  },
  {
    // Astronomical / nocturnal: stars, moon, constellations — need a clear NIGHT sky.
    factor: "night_sky",
    signal: /\b(?:constellation|stellar|star\s+(?:position|chart|map)|lunar|moonlight|moon['’]?s?\s+position|eclipse|astronomical)\b/i,
    requires: "a clear night sky (the celestial reading cannot be taken through cloud or by day)",
    conflict: /\b(?:overcast|cloud(?:y|ed)?|fog(?:gy)?|mist(?:y)?|rain(?:y|ing)?|storm\w*|broad\s+daylight|midday|noon)\b/i,
  },
  {
    // Thermal: heat / freezing drives the mechanism.
    factor: "temperature",
    signal: /\b(?:thermal|thermometer|heat\s+(?:of|from|caused)|hearth\s+heat|temperature\s+(?:rose|fell|drop|rise)|froze|freezing|frost\s+(?:caused|formed)|expansion\s+of\s+(?:metal|brass|the))\b/i,
    requires: "the temperature condition the mechanism depends on (heat or cold of the stated degree)",
    conflict: /\b(?:unseasonably\s+(?:warm|mild|cold)|mild\s+for\s+the\s+season)\b/i,
  },
  {
    // Acoustic: a sound / echo must carry — needs relative quiet.
    factor: "quiet",
    signal: /\b(?:acoustic|echo(?:ed|es)?|reverberat\w*|sound\s+(?:carried|travelled|traveled)|audible\s+(?:report|shot)|heard\s+the\s+(?:shot|report))\b/i,
    requires: "relative quiet so the sound carries (a storm or gale would mask it)",
    conflict: /\b(?:howling\s+(?:wind|gale)|gale|thunder(?:storm)?|roaring\s+(?:wind|storm))\b/i,
  },
];

const textOf = (device: DeviceLike | null | undefined): string => {
  if (!device) return "";
  return [
    device.title,
    device.corePrinciple,
    device.surfaceIllusion,
    device.underlyingReality,
    ...(Array.isArray(device.mechanismFamilyHints) ? device.mechanismFamilyHints : []),
    ...(Array.isArray(device.fairPlayClues) ? device.fairPlayClues : []),
  ]
    .filter((s): s is string => typeof s === "string")
    .join(" · ");
};

/**
 * Derive the environmental precondition a device implicitly requires, or null when no strong
 * mechanism-family signal is present. Conservative by design.
 */
export function deriveMechanismEnvironmentPrecondition(
  device: DeviceLike | null | undefined,
): MechanismEnvironmentPrecondition | null {
  const haystack = textOf(device);
  if (!haystack) return null;
  for (const rule of FAMILY_RULES) {
    if (rule.signal.test(haystack)) {
      return { factor: rule.factor, requires: rule.requires };
    }
  }
  return null;
}

/**
 * Check a device's environmental precondition against the setting atmosphere. Returns `conflict: true`
 * only when an ambient term in the weather/season directly contradicts the precondition.
 */
export function checkMechanismEnvironmentConsistency(
  device: DeviceLike | null | undefined,
  atmosphere: AtmosphereLike | null | undefined,
): MechanismEnvironmentCheck {
  const haystack = textOf(device);
  const ambient = [atmosphere?.weather, atmosphere?.season, atmosphere?.timeOfDay]
    .filter((s): s is string => typeof s === "string" && s.trim().length > 0)
    .join(" · ");

  let matched: FamilyRule | null = null;
  if (haystack) {
    for (const rule of FAMILY_RULES) {
      if (rule.signal.test(haystack)) {
        matched = rule;
        break;
      }
    }
  }

  if (!matched) return { precondition: null, conflict: false, ambient };

  const precondition: MechanismEnvironmentPrecondition = { factor: matched.factor, requires: matched.requires };
  const conflictMatch = ambient.match(matched.conflict);
  if (!conflictMatch) return { precondition, conflict: false, ambient };

  const conflictTerm = conflictMatch[0];
  const repairInstruction =
    `⚠ MECHANISM–ENVIRONMENT EXCEPTION (the central clue depends on it): the mystery's mechanism requires ` +
    `${matched.requires}, but the established setting is "${ambient}" (note "${conflictTerm}"). At the ` +
    `clue-critical moment, render a BRIEF, JUSTIFIED local exception — a short, explicitly-noted break in ` +
    `the prevailing conditions (e.g. "a brief clearing in the ${conflictTerm}") — so the mechanism can ` +
    `operate WITHOUT contradicting the established weather. Do not silently ignore the ${conflictTerm}, and ` +
    `do not present the mechanism as if the conditions were always favourable.`;

  return { precondition, conflict: true, ambient, conflictTerm, repairInstruction };
}

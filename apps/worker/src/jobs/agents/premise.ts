/**
 * The primary-axis vocabulary and the hard-logic directives derived from the premise.
 *
 * Moved verbatim from `shared.ts` (code review ORC-06), which re-exports it.
 */
import type {
  HardLogicDeviceIdea,
} from "@cml/prompts-llm";

export type DifficultyMode = "standard" | "increase" | "extreme";

/**
 * The five story axes, and the ONE vocabulary for them.
 *
 * THE DEFECT THIS REPLACES (found by review, 2026-08-20). Two incompatible vocabularies were in use
 * at once: the CML layer named these five, while `MysteryGenerationInputs` and the API named
 * `social | psychological | mechanical`. Only `temporal` and `spatial` were common to both, and
 * `normalizePrimaryAxis` ended in `default: return "temporal"` — so three of the five values the
 * canary's own input file documents were **silently coerced to temporal**:
 *
 *     identity -> temporal      behavioral -> temporal      authority -> temporal
 *
 * The coercion was invisible: no warning, no error, and a `deriveHardLogicDirectives` switch that
 * matched none of them and therefore seeded ZERO mechanism families. `canary-core-inputs.yaml` even
 * documented an auto-mapping that does not exist anywhere in `canary-core.mjs`.
 *
 * MEASURED CONSEQUENCE: **23 of 23 archived cases are `false_assumption.type: temporal`** and 24 of
 * 24 devices are clock-family. Four of the five axes this generator advertises have never been
 * produced once — never validated, never scored, never read — and 5 of the 15 geometry codes are
 * temporal-only, so a third of geometry would go silent on an axis nobody has ever run.
 *
 * A generator whose parameters change every run cannot have a parameter that silently means one
 * thing. So: one union, and `normalizePrimaryAxis` THROWS on anything it does not recognise.
 */
export const CML_PRIMARY_AXES = ["temporal", "spatial", "identity", "behavioral", "authority"] as const;

export type CmlPrimaryAxis = (typeof CML_PRIMARY_AXES)[number];

/**
 * Input spellings retired in favour of the canonical five, still accepted so existing configs and
 * saved specs keep working.
 *
 * `mechanical` is deliberately NOT here. It used to map to `identity`, which is wrong in a way that
 * changes the book: a mechanical mystery turns on a device, and the identity axis is impersonation,
 * twins and swaps. A caller asking for a mechanism was handed an identity-swap plot. There is no
 * correct target for it in the canonical five, so it now throws and says so rather than guessing —
 * a mechanism story is expressed as a `temporal` or `spatial` axis with a mechanism family.
 */
const LEGACY_AXIS_ALIASES: Readonly<Record<string, CmlPrimaryAxis>> = {
  social: "authority",
  psychological: "behavioral",
};

/** What a caller may pass: the canonical five, or a retired spelling. */
export type PrimaryAxisInput = CmlPrimaryAxis | keyof typeof LEGACY_AXIS_ALIASES;

/** The axis used when a caller specifies none. Explicit, so it is never mistaken for a coercion. */
export const DEFAULT_PRIMARY_AXIS: CmlPrimaryAxis = "temporal";

export type HardLogicDirectives = {
  mechanismFamilies: string[];
  complexityLevel: "simple" | "moderate" | "complex";
  hardLogicModes: string[];
  difficultyMode: DifficultyMode;
  /**
   * Families a keyword rule matched but the axis guard refused, as `name (owner axis, why)`.
   *
   * Surfaced rather than dropped on purpose. A silently discarded input is how the full-story
   * polish spent a month looking dormant (X85) — and refusing a family the caller can see in their
   * own location preset is exactly the kind of decision that must leave a mark on the run.
   */
  refusedFamilies: string[];
};

// ============================================================================
// Hard logic directive merger — used exclusively by Agent 3b run file
// ============================================================================

export const mergeHardLogicDirectives = (
  base: HardLogicDirectives,
  hardLogicDevices: HardLogicDeviceIdea[],
): HardLogicDirectives => {
  const mechanismFamilies = new Set(base.mechanismFamilies);
  const hardLogicModes = new Set(base.hardLogicModes);

  for (const device of hardLogicDevices) {
    for (const family of device.mechanismFamilyHints ?? []) {
      if (family.trim().length > 0) mechanismFamilies.add(family.trim());
    }
    for (const mode of device.modeTags ?? []) {
      if (mode.trim().length > 0) hardLogicModes.add(mode.trim());
    }
    switch (device.principleType) {
      case "mathematical_principle":
        mechanismFamilies.add("quantitative contradiction");
        break;
      case "cognitive_bias":
        mechanismFamilies.add("cognitive-bias exploitation");
        break;
      case "social_logic":
        mechanismFamilies.add("authority-channel manipulation");
        break;
      default:
        mechanismFamilies.add("physical-constraint proof");
        break;
    }
  }

  return {
    mechanismFamilies: Array.from(mechanismFamilies),
    hardLogicModes: Array.from(hardLogicModes),
    complexityLevel: base.complexityLevel,
    difficultyMode: base.difficultyMode,
    // Carried forward, not recomputed: this merger folds in Agent 3b's device hints and derives
    // nothing from keywords, so it has no refusal of its own to add.
    refusedFamilies: base.refusedFamilies,
  };
};

// ============================================================================
// Init-time utilities — called by generateMystery before ctx construction
// ============================================================================

/**
 * Resolve a caller's axis to the canonical vocabulary, or THROW.
 *
 * Throwing is the point. The previous body ended in `default: return "temporal"`, which turned every
 * typo, every retired spelling and three of the five documented values into a temporal mystery with
 * no signal of any kind — see `CML_PRIMARY_AXES` for the measured consequence. A silent coercion on
 * the one input that decides what KIND of mystery this is cannot be distinguished, downstream or in
 * an archive, from a caller who asked for temporal.
 *
 * The three outcomes are now distinct and all of them are legible:
 *   • a recognised axis (canonical or retired spelling) → the canonical value
 *   • no axis at all                                    → `DEFAULT_PRIMARY_AXIS`, reported via
 *     `onDefault` so the run log records that nobody chose
 *   • anything else                                     → an error naming what was passed and what
 *     is accepted, at init, before a penny of generation is spent
 */
export const normalizePrimaryAxis = (
  axis: string | undefined | null,
  onDefault?: (message: string) => void,
): CmlPrimaryAxis => {
  if (axis === undefined || axis === null || String(axis).trim() === "") {
    onDefault?.(
      `primaryAxis not specified; defaulting to "${DEFAULT_PRIMARY_AXIS}". ` +
        `The five axes are ${CML_PRIMARY_AXES.join(", ")} — set one explicitly to vary the mystery's kind.`,
    );
    return DEFAULT_PRIMARY_AXIS;
  }

  const raw = String(axis).trim().toLowerCase();
  if ((CML_PRIMARY_AXES as readonly string[]).includes(raw)) return raw as CmlPrimaryAxis;

  const alias = LEGACY_AXIS_ALIASES[raw];
  if (alias) return alias;

  throw new Error(
    `Unknown primaryAxis "${axis}". Accepted: ${CML_PRIMARY_AXES.join(", ")}` +
      ` (retired spellings still accepted: ${Object.keys(LEGACY_AXIS_ALIASES).join(", ")}).` +
      ` "mechanical" was removed because it mapped to "identity", which is a different kind of` +
      ` mystery — express a mechanism story as temporal or spatial with a mechanism family.`,
  );
};

/**
 * Seed mechanism families from the axis and the theme.
 *
 * The axis parameter is the CANONICAL one (post-`normalizePrimaryAxis`), which it was not before.
 * The switch below listed `social | psychological | mechanical` while every caller that had already
 * normalised passed `identity | behavioral | authority` — so three of the five axes fell through
 * `default: break` and seeded **no families at all**, on top of being coerced to temporal. Both
 * halves of that are now impossible: the type is the canonical union, and every member has a case.
 */
/**
 * Which axis each mechanism family BELONGS to — the switch below is the definition, this is its index.
 *
 * WHY THIS EXISTS. `deriveHardLogicDirectives` seeds two families from the axis and then lets keyword
 * rules append more. Those rules matched against `theme + locationPreset` merged into one string and
 * had no idea what axis they were adding to, so:
 *
 *     primaryAxis: authority, locationPreset: SeasideHotel
 *       -> [authority-channel manipulation, status-based witness distortion, TIMETABLE DEPENDENCY]
 *
 * `/train|rail|liner|ship|seaside|hotel/` matches `SeasideHotel` twice over, so every seaside run was
 * handed a temporal mechanism family whatever axis it asked for — and `SeasideHotel` is the DEFAULT
 * location in `canary-core-inputs.yaml`. MEASURED on the first authority case ever generated: its
 * locked facts came out `high_tide_time`, `murder_claimed_time`, `promenade_length`,
 * `wet_sand_mark_length` — a tide-and-clock mechanism wearing an authority label.
 *
 * That is the second half of the temporal monoculture. [X88] forced the axis LABEL to collapse; this
 * forced the MECHANISM. Fixing X88 alone would have produced four more non-temporal labels over four
 * more temporal mechanisms, and the sweep would have reported five successes.
 *
 * THE RULE, and the distinction it turns on: **a theme is intent, a location is scenery.** If the
 * caller writes a theme about a liner they are asking for a transit mystery and any family it implies
 * is theirs to have. If they merely set the story in a seaside hotel, that must colour the setting
 * without redirecting the mystery onto an axis they did not choose. So a family listed here is
 * refused when the LOCATION alone introduced it and it belongs to a different axis; families absent
 * from this table (sealed-space, document-chain, dose-timing, acoustic mislocalization, …) are
 * axis-neutral and always allowed.
 */
const FAMILY_AXIS: Readonly<Record<string, CmlPrimaryAxis>> = {
  "schedule contradiction": "temporal",
  "timing window trap": "temporal",
  "timetable dependency": "temporal",
  "access path illusion": "spatial",
  "geometry-based movement": "spatial",
  "role substitution proof": "identity",
  "witness misidentification constraint": "identity",
  "cognitive bias exploitation": "behavioral",
  "memory anchoring misdirection": "behavioral",
  "authority-channel manipulation": "authority",
  "status-based witness distortion": "authority",
};

export const deriveHardLogicDirectives = (
  theme: string | undefined,
  primaryAxis: CmlPrimaryAxis | undefined,
  locationPreset: string | undefined,
): HardLogicDirectives => {
  // `text` stays the merged string every keyword rule below already matches on — behaviour unchanged.
  // `themeText` is the half that carries INTENT, and is what decides whether a matched family is
  // allowed to introduce a different axis. See FAMILY_AXIS above.
  const themeText = `${theme ?? ""}`.toLowerCase();
  const text = `${themeText} ${locationPreset ?? ""}`.toLowerCase();
  const familySet = new Set<string>();
  const modeSet = new Set<string>();
  /** Families the location introduced that belong to another axis — reported, never silently dropped. */
  const refusedFamilies: string[] = [];

  /**
   * `addFamily` is used by the axis switch AND by the keyword rules. Only the keyword rules can be
   * wrong here, and only when the LOCATION matched: the axis switch is the definition of what the
   * axis wants, and a theme match is the caller asking for it explicitly.
   */
  const addFamily = (value: string) => familySet.add(value);
  /**
   * A family added because a keyword matched. `viaTheme` says whether the CALLER asked for it (the
   * regex hit the theme) or whether only the location did.
   */
  const addKeywordFamily = (value: string, viaTheme: boolean) => {
    const owner = FAMILY_AXIS[value];
    if (primaryAxis && owner && owner !== primaryAxis && !viaTheme) {
      refusedFamilies.push(`${value} (${owner} family, introduced by location not theme)`);
      return;
    }
    familySet.add(value);
  };
  const addMode = (value: string) => modeSet.add(value);

  switch (primaryAxis) {
    case "temporal":
      addFamily("schedule contradiction");
      addFamily("timing window trap");
      break;
    case "spatial":
      addFamily("access path illusion");
      addFamily("geometry-based movement");
      break;
    case "authority":
      addFamily("authority-channel manipulation");
      addFamily("status-based witness distortion");
      break;
    case "behavioral":
      addFamily("cognitive bias exploitation");
      addFamily("memory anchoring misdirection");
      break;
    case "identity":
      // Identity is impersonation, substitution and mistaken role — NOT the mechanical families that
      // the retired `mechanical` alias used to land here. Those were the wrong seeds for this axis
      // and are why an identity story would have been written as a device story.
      addFamily("role substitution proof");
      addFamily("witness misidentification constraint");
      break;
    case undefined:
      break;
  }

  /**
   * Keyword rules, each with its pattern NAMED so the rule can answer a second question: did this
   * match the THEME, or only the location? `addKeywordFamily` needs that to tell a caller asking for
   * a transit mystery from a caller who merely set one in a seaside hotel.
   */
  const RULES: ReadonlyArray<{ re: RegExp; mode: string; families: string[] }> = [
    { re: /(locked[-\s]?room|impossible crime)/, mode: "locked-room", families: ["sealed-space constraint proof"] },
    { re: /train|rail|liner|ship|seaside|hotel/, mode: "transit or seaside topology", families: ["timetable dependency"] },
    { re: /inheritance|will|estate/, mode: "inheritance pressure logic", families: ["document-chain contradiction"] },
    {
      re: /(math|mathematics|geometry|probability|pure mathematics)/,
      mode: "mathematical principle",
      families: ["probability misdirection", "geometric visibility constraint"],
    },
    { re: /(botanical|medical|toxin|toxicology|botany)/, mode: "botanical or medical mechanism", families: ["dose-timing asymmetry"] },
    { re: /acoustic|sound|echo/, mode: "acoustics", families: ["acoustic mislocalization"] },
    { re: /(multi-layer|double-bluff|double bluff|nested)/, mode: "multi-layer deception", families: ["stacked false assumptions"] },
  ];

  for (const rule of RULES) {
    if (!rule.re.test(text)) continue;
    // The MODE always applies: it describes the SETTING, which the location legitimately determines.
    // Only the FAMILY — what kind of deduction the mystery turns on — is axis-guarded.
    addMode(rule.mode);
    const viaTheme = rule.re.test(themeText);
    for (const family of rule.families) addKeywordFamily(family, viaTheme);
  }

  let difficultyMode: DifficultyMode = "standard";
  if (/make it brutal|extreme mode/.test(text)) {
    difficultyMode = "extreme";
    addMode("near-impossible construction");
    addFamily("precision timing geometry");
  } else if (/increase difficulty|escalation mode/.test(text)) {
    difficultyMode = "increase";
    addMode("multi-step reasoning");
    addFamily("dual-principle contradiction");
  }

  const complexityLevel: "simple" | "moderate" | "complex" =
    difficultyMode === "standard" ? "moderate" : "complex";

  if (familySet.size === 0) {
    addFamily("constraint contradiction");
    addFamily("inference-path trap");
  }

  return {
    // Insertion order, and the axis switch runs first — so the axis's own families always lead and
    // the slice can only ever truncate keyword extras.
    mechanismFamilies: Array.from(familySet).slice(0, 6),
    complexityLevel,
    hardLogicModes: Array.from(modeSet).slice(0, 6),
    difficultyMode,
    refusedFamilies,
  };
};

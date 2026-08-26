/**
 * Agent 3b: Hard-Logic Device Ideation
 *
 * Generates novel, contradiction-driven mechanism concepts before CML generation.
 * This ensures the final CML is grounded in explicitly generated novel devices,
 * not only keyword-derived directives.
 */

import type { AzureOpenAIClient, Message } from "@cml/llm-client";
import { validateArtifact } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
import { resolveDesignModel } from "./utils/model-tiers.js";
import type { HardLogicDeviceIdea } from "./types.js";
import { withValidationRetry, buildValidationFeedback } from "./utils/validation-retry-wrapper.js";

export interface HardLogicDeviceInputs {
  runId: string;
  projectId: string;
  decade: string;
  location: string;
  institution: string;
  tone: string;
  theme?: string;
  primaryAxis: "temporal" | "spatial" | "identity" | "behavioral" | "authority";
  mechanismFamilies?: string[];
  hardLogicModes?: string[];
  difficultyMode?: "standard" | "increase" | "extreme";
  noveltyConstraints?: {
    divergeFrom: string[];
    areas: string[];
    avoidancePatterns: string[];
  };
  /**
   * A_74 §8 DE8 — a pre-rendered block of retrieved device-library patterns, or undefined.
   *
   * PRE-RENDERED, not a typed pattern list, and that is deliberate. `@cml/device-library` owns the
   * schema, the era-feasibility oracle and the usage-decayed novelty ranking; this package owns
   * prompt text. Passing text keeps prompts-llm free of the dependency for exactly the reason
   * `cml-core/device-binding.ts` documents for itself, and it keeps the retrieval decision — which
   * patterns, in which order — auditable in ONE place instead of split across two.
   */
  deviceLibraryBlock?: string;
}

export interface HardLogicDeviceResult {
  status: "ok";
  overview: string;
  devices: HardLogicDeviceIdea[];
  rawResponse: string;
  attempt: number;
  latencyMs: number;
  cost: number;
  /**
   * A_50 §9.3: true when the theme commits to a concrete mechanism family AND the primary
   * device (devices[0]) realizes it. false when a locked theme was given but no generated
   * device matched it (off-theme primary — feeds the regen "never downgrade theme-coherence"
   * guard and telemetry). Absent/false also when the theme leaves the mechanism open.
   */
  matchedThemePrimary?: boolean;
}

/**
 * A_50 §9.3 — theme/device mechanism-family map.
 *
 * When the story theme commits to a specific murder mechanism (e.g. "clock-tampering"), Agent 3b
 * must make the PRIMARY device realize THAT family — otherwise the locked-fact registry (built from
 * devices[0]) and the CML diverge from the case the prose tells (probe `mystery-1782504792424`:
 * theme = clock-tampering, but 3b emitted a thermal-latch primary, then the plausibility regen
 * swapped in a tide/drowning device — neither realized the clock). Both the theme text and a
 * generated device's text are mapped through the SAME stems, then intersected. Stems are chosen to
 * be specific enough to avoid false matches in ordinary prose ("witness account", "the heat of the
 * moment") — bare generic words are deliberately excluded.
 */
const MECHANISM_FAMILY_KEYWORDS: Record<string, string[]> = {
  clock: ["clock", "chime", "pendulum", "timepiece", "horolog", "clockwork", "winding key"],
  tide: ["tide", "tidal", "drown", "flood tide", "sea level", "water level", "sluice"],
  poison: ["poison", "toxin", "venom", "arsenic", "cyanide", "toxicolog", "dosage"],
  acoustic: ["acoustic", "gramophone", "phonograph", "recording", "soundproof", "echo chamber"],
  optics: ["mirror", "optical", "reflection", "lens", "prism", "refraction"],
  ledger: ["ledger", "forgery", "forged", "embezzl", "account book", "bookkeep"],
  thermal: ["thermal", "heat expansion", "temperature", "expansion of", "fahrenheit", "furnace"],
  // A_53 P11 (identity-family-collides-with-identity-axis): renamed from 'identity' to
  // 'impersonation' so the mechanism family no longer collides semantically with the "identity"
  // primary axis. Dropped the 'twin' stem — the prompt bans the twins-as-solution trope, so the
  // keyword must not lock a primary device onto it.
  impersonation: ["impersonat", "disguise", "masquerade", "double identity"],
};

const familiesIn = (text: string): string[] => {
  const hay = text.toLowerCase();
  const found: string[] = [];
  for (const [family, stems] of Object.entries(MECHANISM_FAMILY_KEYWORDS)) {
    if (stems.some((stem) => hay.includes(stem))) found.push(family);
  }
  return found;
};

/**
 * A_53 P1 — generic words that are NOT distinctive mechanism nouns. Excluded from the data-driven
 * synthetic-family fallback so it can't fire on ordinary mystery prose or on the abstract axis
 * labels `deriveHardLogicDirectives` emits ("schedule contradiction", "misdirection", …).
 */
const SYNTHETIC_FAMILY_STOPWORDS = new Set([
  "murder", "murders", "mystery", "death", "deaths", "killer", "victim", "crime", "case",
  "story", "clue", "clues", "detective", "suspect", "suspects", "method", "methods",
  "mechanism", "trick", "technique", "scheme", "twist", "alibi", "motive", "based",
  "around", "involving", "hinging", "driven", "using", "with", "from", "that", "this",
  "into", "onto", "about", "golden", "age", "classic",
  // abstract axis / directive labels — not concrete, device-realizable mechanisms
  "contradiction", "confusion", "misdirection", "manipulation", "tampering", "pressure",
  "institutional", "administrative", "psychology", "psychological", "behavioral", "behavioural",
  "temporal", "spatial", "identity", "authority", "timing", "timeline", "impossible", "location",
]);

/** Distinct lower-cased content tokens (≥4 letters, not a stopword) in a piece of text. */
const salientMechanismTokens = (text: string): string[] => {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const tok of text.toLowerCase().match(/[a-z]{4,}/g) ?? []) {
    if (SYNTHETIC_FAMILY_STOPWORDS.has(tok) || seen.has(tok)) continue;
    seen.add(tok);
    out.push(tok);
  }
  return out;
};

/** True when a synthetic (non-keyword) family token appears as a whole word in device text. */
const syntheticFamilyRealized = (token: string, deviceTextLower: string): boolean =>
  token.length >= 4 && new RegExp(`\\b${token}`, "i").test(deviceTextLower);

/**
 * A_56 3-A: two method tokens name the SAME concept when they are identical OR one is a prefix of the
 * other (≥4-letter stem) — so an inflection mismatch between the theme prose and the structured hints
 * ("grafting" theme vs a "graft" hint, "poisoning" vs "poison") still corroborates a synthetic family.
 * Stays conservative: it never relaxes the requirement that BOTH the theme and the hints name the method
 * (open themes still produce no synthetic family), it only stops exact-token equality from missing
 * inflections. The shorter form (the stem) is the canonical token, so device-realization matching
 * (`syntheticFamilyRealized`, a `\b<stem>` prefix test) also covers all inflections.
 */
const sharesMethodStem = (a: string, b: string): boolean => {
  if (a === b) return true;
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 4 && long.startsWith(short);
};

/**
 * The concrete mechanism families a theme commits to (empty ⇒ the theme leaves the method open and
 * the de-anchoring "explore many families" guidance applies freely). Primary signal is the 8-family
 * keyword map (theme text + explicit hints — the strongest signal; `deriveHardLogicDirectives` only
 * yields abstract axis families). A_53 P1: when the keyword map yields nothing but the theme prose
 * AND the structured mechanism-family hints independently name the SAME distinctive noun (e.g. a
 * botanical "grafting" method outside the menu), those shared nouns become synthetic families so the
 * theme-lock still engages — degrading gracefully WITHOUT firing on open themes (whose prose shares
 * no method noun with the hints) or on abstract axis labels (stop-worded above).
 */
export function extractThemeMechanismFamilies(theme?: string, mechanismFamilies?: string[]): string[] {
  const hints = (mechanismFamilies ?? []).join(" ");
  const keyworded = familiesIn(`${theme ?? ""} ${hints}`);
  if (keyworded.length > 0) return keyworded;
  const themeTokenList = salientMechanismTokens(theme ?? "");
  if (themeTokenList.length === 0) return [];
  // A_56 3-A: corroborate theme↔hint method nouns by STEM (inflection-robust) rather than exact token,
  // and canonicalise to the shorter stem so off-menu themes phrased with an inflection still engage
  // theme-lock. Still requires the hints to independently name the method (open themes stay open).
  const shared: string[] = [];
  for (const tok of salientMechanismTokens(hints)) {
    const match = themeTokenList.find((t) => sharesMethodStem(t, tok));
    if (!match) continue;
    const stem = match.length <= tok.length ? match : tok;
    if (!shared.some((s) => sharesMethodStem(s, stem))) shared.push(stem);
  }
  return shared.slice(0, 4);
}

/** How many of the theme's locked mechanism families a single device realizes. */
export function scoreDeviceThemeMatch(device: HardLogicDeviceIdea, themeFamilies: string[]): number {
  if (themeFamilies.length === 0) return 0;
  const deviceText = [
    device.title,
    device.corePrinciple,
    device.surfaceIllusion,
    device.underlyingReality,
    ...(device.mechanismFamilyHints ?? []),
  ].join(" ");
  const deviceTextLower = deviceText.toLowerCase();
  const deviceFamilies = new Set(familiesIn(deviceText));
  return themeFamilies.reduce((n, family) => {
    const realized = Object.prototype.hasOwnProperty.call(MECHANISM_FAMILY_KEYWORDS, family)
      ? deviceFamilies.has(family)
      : syntheticFamilyRealized(family, deviceTextLower);
    return n + (realized ? 1 : 0);
  }, 0);
}

/**
 * Reorder devices so the one best realizing the locked theme leads (becomes devices[0], the source
 * of the locked-fact registry + CML grounding). No-op — preserving full novelty — when the theme
 * leaves the mechanism open (`themeFamilies` empty) or when no device matches it (best-effort: keep
 * the model's order, flag `matchedThemePrimary=false`). Never drops or mutates a device.
 */
export function selectThemeCoherentPrimary(
  devices: HardLogicDeviceIdea[],
  themeFamilies: string[],
): { devices: HardLogicDeviceIdea[]; matchedThemePrimary: boolean; reorderedFrom: number } {
  if (devices.length === 0 || themeFamilies.length === 0) {
    return { devices, matchedThemePrimary: false, reorderedFrom: -1 };
  }
  let bestIdx = 0;
  let bestScore = scoreDeviceThemeMatch(devices[0], themeFamilies);
  let bestQuality = deviceQualitySignal(devices[0]);
  for (let i = 1; i < devices.length; i += 1) {
    const score = scoreDeviceThemeMatch(devices[i], themeFamilies);
    // A_53 P11 (selection-tie-break-ignores-plausibility): on an equal theme-score, prefer the
    // higher quality signal (clue richness / lockedFacts / valid principleType) instead of locking
    // onto whichever device happened to come first in the model's array.
    if (score > bestScore) {
      bestScore = score;
      bestQuality = deviceQualitySignal(devices[i]);
      bestIdx = i;
    } else if (score === bestScore) {
      const quality = deviceQualitySignal(devices[i]);
      if (quality > bestQuality) {
        bestQuality = quality;
        bestIdx = i;
      }
    }
  }
  if (bestScore <= 0) {
    return { devices, matchedThemePrimary: false, reorderedFrom: -1 };
  }
  if (bestIdx === 0) {
    return { devices, matchedThemePrimary: true, reorderedFrom: -1 };
  }
  const reordered = [
    devices[bestIdx],
    ...devices.slice(0, bestIdx),
    ...devices.slice(bestIdx + 1),
  ];
  return { devices: reordered, matchedThemePrimary: true, reorderedFrom: bestIdx };
}

const principleTypeValues = new Set([
  "physical_law",
  "mathematical_principle",
  "cognitive_bias",
  "social_logic",
]);

/**
 * A_53 P11 (selection-tie-break-ignores-plausibility): a holistic, data-driven quality signal for a
 * device, used ONLY to break ties between devices with equal theme-score (never to override theme
 * coherence). Derived entirely from the device's own artifact fields — no story-specific content:
 * clue richness (fair-play clues are what make a device solvable/plausible), the count of locked
 * facts (concrete pinned ground truth), and whether it carries a valid principleType. Higher is
 * better; a richer, better-grounded on-theme device should lead over a thin one at the same score.
 */
const deviceQualitySignal = (device: HardLogicDeviceIdea): number => {
  const clueRichness = (device.fairPlayClues ?? []).filter((c) => c && c.trim().length > 0).length;
  const lockedFactCount = (device.lockedFacts ?? []).length;
  const validPrinciple = principleTypeValues.has(device.principleType) ? 1 : 0;
  return clueRichness + lockedFactCount + validPrinciple;
};

const asString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;

const asStringArray = (value: unknown, fallback: string[] = []) =>
  Array.isArray(value)
    ? value.map((item) => String(item ?? "").trim()).filter((item) => item.length > 0)
    : fallback;

const normalizeDevice = (value: unknown, index: number): HardLogicDeviceIdea => {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

  const principleTypeRaw = asString(record.principleType, "physical_law");
  const principleType = principleTypeValues.has(principleTypeRaw)
    ? (principleTypeRaw as HardLogicDeviceIdea["principleType"])
    : "physical_law";

  return {
    title: asString(record.title, `Device Concept ${index + 1}`),
    corePrinciple: asString(record.corePrinciple, "Constraint-driven contradiction"),
    principleType,
    surfaceIllusion: asString(record.surfaceIllusion, "An apparently impossible sequence of events"),
    underlyingReality: asString(record.underlyingReality, "A hidden but fair-play mechanism resolves the contradiction"),
    fairPlayClues: asStringArray(record.fairPlayClues, ["Observable timing inconsistency", "Access-path contradiction"]),
    whyNotTrope: asString(record.whyNotTrope, "Uses a fresh constraint interaction rather than a stock shortcut"),
    variationEscalation: asString(record.variationEscalation, "Add one extra constraint interaction while preserving solvability"),
    mechanismFamilyHints: asStringArray(record.mechanismFamilyHints, ["constraint contradiction"]),
    modeTags: asStringArray(record.modeTags),
    moralAmbiguity: typeof record.moralAmbiguity === 'string' && record.moralAmbiguity.trim() ? record.moralAmbiguity.trim() : undefined,
    lockedFacts: Array.isArray(record.lockedFacts)
      ? (record.lockedFacts as any[]).map((f: any, fIdx: number) => ({
          // A_53 P11 (normalizedevice-lockedfact-id-collision): include the fact's own index so two
          // id-less facts in the same device don't both collapse to `fact_${index}` (id-keyed consumers
          // would merge them). Device index keeps ids unique across devices; fIdx within the device.
          id: asString(f?.id, `fact_${index}_${fIdx}`),
          value: asString(f?.value, ''),
          description: asString(f?.description, ''),
          ...(Array.isArray(f?.appearsInChapters) ? { appearsInChapters: (f.appearsInChapters as any[]).map(String) } : {}),
          // X38-at-source — the device says which of its values is a CONSEQUENCE of which others.
          //
          // Optional, and absent means "primary": a mechanism's fixed constant (how long a poison
          // takes to act, a tide interval, a fuse) declares nothing and is therefore never rewritten.
          // Nothing in the pipeline may repair a locked fact it was not told is derived — the value is
          // printed into the prose verbatim, so a wrong guess is unrecoverable. Detection may guess;
          // repair may not.
          ...(Array.isArray(f?.derivedFrom)
            ? { derivedFrom: (f.derivedFrom as any[]).map(String).map((s) => s.trim()).filter(Boolean) }
            : {}),
        })).filter((f: { value: string }) => f.value.length > 0)
      : undefined,
  };
};

export function buildHardLogicDevicePrompt(inputs: HardLogicDeviceInputs, previousErrors?: string[]): {
  system: string;
  developer: string;
  user: string;
  messages: Message[];
} {
  const hardLogicModes = inputs.hardLogicModes ?? [];
  const mechanismFamilies = inputs.mechanismFamilies ?? [];
  const difficultyMode = inputs.difficultyMode ?? "standard";
  const validationFeedback = buildValidationFeedback(previousErrors);

  // A_74 §8 DE8 — the curated corpus, when the caller retrieved one. Empty string when not.
  const deviceLibrarySection = inputs.deviceLibraryBlock ? `
${inputs.deviceLibraryBlock}
` : "";

  const noveltySection = inputs.noveltyConstraints
    ? `
Novelty constraints:
- Diverge from: ${inputs.noveltyConstraints.divergeFrom.join(", ") || "(none)"}
- Required divergence areas: ${inputs.noveltyConstraints.areas.join(", ") || "(none)"}
- Avoid patterns: ${inputs.noveltyConstraints.avoidancePatterns.join(" | ") || "(none)"}
`
    : "";

  // A_50 §9.3: when the theme commits to a concrete mechanism, the PRIMARY device must realize it.
  // The de-anchoring "explore many families" guidance below then applies only to SECONDARY devices.
  const themeFamilies = extractThemeMechanismFamilies(inputs.theme, mechanismFamilies);
  const themeLockSection = themeFamilies.length > 0
    ? `
LOCKED THEME — PRIMARY DEVICE CONSTRAINT (non-negotiable):
The theme commits to a specific murder-mechanism family: ${themeFamilies.join(", ")} (from the theme: "${inputs.theme}").
- The PRIMARY device (devices[0]) MUST realize this mechanism family. Its corePrinciple, surfaceIllusion, underlyingReality, fairPlayClues, and lockedFacts must all concern ${themeFamilies.join(" / ")} — not a substitute method.
- Do NOT swap in an unrelated family (e.g. tide, poison, acoustics, thermal) for the primary device "for novelty". The locked-fact registry and the whole case are built from this primary device; an off-theme primary makes the final story incoherent.
- The "explore many families / do not default to the clock" guidance applies ONLY to the SECONDARY devices (devices[1..]) for variety — it never overrides the locked theme for the primary device.
`
    : "";

  const system = `You are a Golden Age detective plot engineer (1920-1945), specializing in fair-play hard-logic murder mechanisms.

Your job is to propose novel mechanism devices that are contradiction-driven and period-solvable.

Hard constraints:
- No modern electronics, DNA, CCTV, digital records, or post-1945 science.
- No lazy trope shortcuts (twins-as-solution, secret passages with no clueability, confession-only endings).
- Every mechanism must hinge on at least one of: physical law, mathematical principle, cognitive bias, social logic.
- Each concept must include visible fair-play clues and a falsifiable discriminating path.`;

  const developer = `Uniqueness Seed: ${inputs.runId}-${inputs.projectId}
Use the seed to vary concepts while staying coherent with the spec.

Spec context:
- Decade: ${inputs.decade}
- Location: ${inputs.location}
- Institution: ${inputs.institution}
- Tone: ${inputs.tone}
- Theme: ${inputs.theme ?? "(none specified)"}
- Primary axis: ${inputs.primaryAxis}
- Mechanism family hints: ${mechanismFamilies.join(", ") || "(none)"}
- Hard-logic mode tags: ${hardLogicModes.join(", ") || "standard varied mix"}
- Difficulty mode: ${difficultyMode}
${noveltySection}${themeLockSection}${deviceLibrarySection}
Output JSON only, with this exact structure:

{
  "overview": string,
  "devices": [
    {
      "title": string,
      "corePrinciple": string,
      "principleType": "physical_law" | "mathematical_principle" | "cognitive_bias" | "social_logic",
      "surfaceIllusion": string,
      "underlyingReality": string,
      "fairPlayClues": string[],
      "whyNotTrope": string,
      "variationEscalation": string,
      "mechanismFamilyHints": string[],
      "modeTags": string[],
      "moralAmbiguity": string,
      "lockedFacts": [
        { "id": "<short_snake_case_id>", "value": "<the locked value, in word form — see NOTES below>", "description": "<the exact physical fact this pins down for THIS device>" },
        { "id": "<another_fact_id>", "value": "<word-form value>", "description": "<what it pins down>", "derivedFrom": ["<id>", "<id>"] }
      ]
      // "derivedFrom" is REQUIRED on any value that FOLLOWS ARITHMETICALLY from exactly two others,
      // and forbidden everywhere else. This is not a formatting preference — it is the only signal
      // that tells the pipeline which number is a CONSEQUENCE and may therefore be corrected, and
      // which is a PRIMARY value fixed by the mechanism and must never be touched.
      //
      // CRITICAL — CONSEQUENCES. If your device states two clock times and the interval between
      // them, the interval is a consequence: it follows from the two times and cannot disagree with
      // them. Put derivedFrom on the interval, naming the two clock-fact ids:
      //     { "id": "clock_shift_interval", "value": "thirty minutes",
      //       "description": "how far the clock was moved",
      //       "derivedFrom": ["reception_clock_time_seen", "kitchen_clock_time_punched"] }
      // Then CHECK YOUR OWN ARITHMETIC before you answer: if the two times are twenty-five minutes
      // apart, the interval is "twenty-five minutes". Locked facts are injected into the prose
      // VERBATIM, so a reader meets both numbers in the same book — and a cold read has twice marked
      // the clue logic down to 6/10 for exactly this contradiction (2026-08-15 and 2026-08-25).
      //
      //
      // THE INTERVAL IS NOT ALWAYS THE CONSEQUENCE. In a clock-tampering device the interval follows
      // from the two times, so the interval carries derivedFrom. In a device built on a PHYSICAL
      // CONSTANT — a poison's onset, a tide's period, a fuse's burn — the duration is fixed by nature
      // and the TIMES follow from it; there, derivedFrom goes on the derived clock value, not on the
      // duration. Decide which of your numbers nature fixes and which your plot computes, and mark
      // only the computed one. Marking the wrong one tells the pipeline it may rewrite a constant.
      // Omit derivedFrom on any value fixed by the mechanism itself; a value with no derivedFrom is
      // treated as primary and is never adjusted for you.
      // lockedFacts MUST be specific to the device you invented above — do NOT copy the placeholder ids/values.
      // For SECONDARY devices (and whenever no LOCKED THEME is specified above), invent each fresh from a
      // DIFFERENT mechanism family for variety — a stopped/rewound clock is ONE family among many (poison
      // timing, sound/acoustics, optics/mirrors, tide/temperature, ledger forgery, impersonation, mechanical
      // traps); do not default to the clock. But when a LOCKED THEME is given, the PRIMARY device (devices[0])
      // MUST realize that theme's family — the variety rule never overrides the locked theme for the primary.

NOTE — TIME VALUES IN lockedFacts: All clock times MUST be written in old-style English word form. 
CORRECT: "ten minutes past eleven", "a quarter to three", "twenty past midnight"
WRONG: any digit-and-colon clock notation, AM/PM notation, or twenty-four-hour notation
Never use digits, colons, AM/PM, or 24-hour notation for any time locked fact.

NOTE — QUANTITIES IN lockedFacts: ALL numeric values MUST be written in word form, not digits.
CORRECT: "forty minutes", "fourteen feet", "six pounds", "thirty yards"
WRONG: any figure-based quantity expression
This applies to durations, distances, weights, temperatures, counts — every value.

NOTE — ERA MEASUREMENT UNITS: This is a ${inputs.decade} story. All measurements MUST use the period-standard imperial system.
- Distance / length: feet, inches, yards, miles  —  NEVER metres, centimetres, kilometres
- Weight / mass: ounces, pounds, stones, tons  —  NEVER grams, kilograms
- Temperature: degrees Fahrenheit  —  NEVER Celsius or Centigrade
- Volume: pints, gallons, fluid ounces  —  NEVER litres, millilitres
CORRECT: "fourteen feet", "six pounds three ounces", "ninety-eight point six degrees Fahrenheit"
WRONG: "four metres", "three kilograms", "thirty-seven degrees Celsius"
    }
  ]
}

Default target is 5 varied devices.
Do not include markdown fences or extra commentary.

Quality bar:
- Devices must be mechanically explainable, not merely theatrical.
- PLAUSIBILITY (critical): the underlyingReality must obey real period physics — a knowledgeable
  1930s reader could believe it genuinely works. Do NOT invent effects that violate basic mechanics:
  a pendulum/grandfather clock does NOT run backward when wound, wind does NOT "rewind" a clock by
  tens of minutes, springs do not store time. A false TIME can only be produced by tampering with an
  instrument whose reading can be genuinely reset or shifted (clock/watch/chime/bell/log); a reading
  set by an EXTERNAL driver — a sundial/shadow (sun geometry), a thermometer (ambient heat), a tide,
  a burned candle — CANNOT be time-delayed by cooling, warping, or moving the device (that changes the
  reading's value or position, not the timeline). If a mechanism only works by hand-waving, replace it.
- Prefer the SIMPLEST mechanism that creates the contradiction; do not add steps for their own sake.
- Each device must produce clueable traces the reader could reasonably notice.
- Variation across devices should include different principle types and social contexts.

Micro-exemplars:
- Weak corePrinciple: "A trick with time."
- Strong corePrinciple: "Thermal expansion in a brass latch delays bolt release until hearth heat peaks."
- Weak fairPlayClues: ["Something looked wrong"]
- Strong fairPlayClues: ["Soot line on latch plate", "Mantel thermometer reading inconsistent with claimed fire schedule"]

Before finalizing, run a silent checklist:
- every device passes a basic physics plausibility check — the underlyingReality is genuinely possible
  with period technology (no clock running backward, no wind rewinding a mechanism, no cooling/warping
  "delaying" a sundial shadow or thermometer reading — those cannot be time-shifted), not just asserted
- the primary device is the simplest one that still creates a fair, clueable contradiction
- exactly 5 devices unless explicit impossibility
- principleType enums valid
- lockedFacts values use words, not digits
- time phrases use period style
- no modern post-1945 dependencies

CRITICAL: Ensure principleType is one of the four exact values: "physical_law", "mathematical_principle", "cognitive_bias", "social_logic"${validationFeedback}`;

  const user = `Generate novel hard-logic mechanism devices now.

Requirements:
1) Return exactly 5 devices unless there is an explicit impossibility (then still return at least 3).
2) Ensure each device can be transformed into a CML false assumption + discriminating test.
3) Keep clues observable by readers before reveal.
4) Make mechanisms diagrammable and contradiction-driven.
5) If difficulty is "increase" or "extreme", include at least one multi-step or precision-timing construction.
6) For each device, include a 'moralAmbiguity' field: one sentence explaining a gray area that makes the crime morally complex (why a reader might feel unexpected sympathy for the culprit, or be disturbed by the verdict).
7) For the primary device (first in the list), populate 'lockedFacts' with 2-4 specific physical values that must appear verbatim in the prose — clock times, compass bearings, temperatures, distances, weights, counts. These become irrefutable ground truth that the prose agent must never contradict across chapters. Other devices may include lockedFacts if appropriate, or omit the field.
  CRITICAL — TIME FORMAT: Any clock time in lockedFacts MUST be written in old-style English word form. Examples: "ten minutes past eleven", "a quarter to three", "twenty past midnight", "half past nine at night". NEVER use digit-and-colon notation, AM/PM notation, or twenty-four-hour notation.
  CRITICAL — WORD FORM FOR ALL VALUES: Every numeric value in lockedFacts must be spelled out in words. Write out every quantity in full words, never in figure-based shorthand. Digits in locked fact values break the repair system.
   CRITICAL — IMPERIAL UNITS: All measurements must use the imperial system standard for ${inputs.decade} stories. Distances in feet/yards/miles, weights in ounces/pounds/stones, temperatures in degrees Fahrenheit, volumes in pints/gallons. NEVER use metric units (metres, centimetres, kilograms, litres, Celsius/Centigrade).
  CRITICAL — THE VALUES MUST AGREE WITH EACH OTHER: locked facts are printed into the prose verbatim, so a reader meets all of them and can do the arithmetic between them. Whenever one locked value is determined by two others — an interval between two stated times, a distance implied by a speed and a duration, a total implied by its parts — WORK IT OUT AND CHECK IT before you return. Do not state a relation your own numbers contradict. A device whose own numbers disagree is not a hard-logic device, and it is the single most common defect found in this pipeline's output.
  CRITICAL — SAY WHICH VALUE IS THE CONSEQUENCE: when a locked fact IS determined by two others, add 'derivedFrom' to it listing exactly those two ids. Add it ONLY to the value that follows from the others, and only when it genuinely does. Which value that is depends on your mechanism, and only you know: if a clock is tampered with for a stretch, the STRETCH follows from the two times it separates, so the interval carries 'derivedFrom'. But if the interval is fixed by physics or nature — how long a poison takes to act, a tide's period, how long a fuse burns, how long a body takes to cool — then that interval is PRIMARY and the times follow from it, so leave the interval alone and put 'derivedFrom' on the time that follows. If nothing is determined by anything else, omit the field entirely. Omitting it is always safe; a wrong 'derivedFrom' is not.

Return JSON only.`;

  const combinedSystem = `${system}\n\n# Technical Specifications\n\n${developer}`;
  const messages: Message[] = [
    { role: "system", content: combinedSystem },
    { role: "user", content: user },
  ];

  return { system, developer, user, messages };
}

export async function generateHardLogicDevices(
  client: AzureOpenAIClient,
  inputs: HardLogicDeviceInputs,
  maxAttempts?: number,
): Promise<HardLogicDeviceResult> {
  const logger = client.getLogger();
  const startTime = Date.now();
  const config = getGenerationParams().agent3b_hard_logic_devices.params;
  const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;

  const retryResult = await withValidationRetry({
    maxAttempts: resolvedMaxAttempts,
    agentName: "Agent 3b (Hard Logic Devices)",
    validationFn: (data) => {
      const validation = validateArtifact("hard_logic_devices", data);
      return {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
      };
    },
    generateFn: async (attempt, previousErrors) => {
      const prompt = buildHardLogicDevicePrompt(inputs, previousErrors);

      const response = await client.chatWithRetry({
        messages: prompt.messages,
        model: resolveDesignModel()!,
        temperature: config.model.temperature,
        maxTokens: config.model.max_tokens,
        jsonMode: true,
        logContext: {
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3b-HardLogicDeviceGenerator",
          retryAttempt: attempt,
        },
      });

      let parsed: Record<string, unknown>;
      try {
        const trimmed = response.content.trim();
        if (!trimmed.endsWith('}')) {
          throw new Error(`Response appears truncated (ends with: ...${trimmed.slice(-40).replace(/\n/g, '\\n')}). Increase max_tokens or reduce output size.`);
        }
        parsed = JSON.parse(trimmed) as Record<string, unknown>;
      } catch (parseError) {
        await logger.logError({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3b-HardLogicDeviceGenerator",
          operation: "parse_json",
          errorMessage: `JSON parse failed: ${(parseError as Error).message}`,
          retryAttempt: attempt,
        });
        throw new Error(`Hard-logic device JSON parsing failed: ${(parseError as Error).message}`);
      }

      const rawDevices = Array.isArray(parsed.devices) ? parsed.devices : [];
      const normalized = rawDevices.map((device, index) => normalizeDevice(device, index)).slice(0, 5);

      // A_50 §9.3: keep the PRIMARY device coherent with a theme that commits to a concrete
      // mechanism (the locked-fact registry + CML are built from devices[0]). No-op for open themes.
      const themeFamilies = extractThemeMechanismFamilies(inputs.theme, inputs.mechanismFamilies);
      const primarySelection = selectThemeCoherentPrimary(normalized, themeFamilies);
      const devices = primarySelection.devices;
      if (primarySelection.reorderedFrom > 0) {
        console.warn(
          `[Agent 3b] theme-lock: promoted device #${primarySelection.reorderedFrom + 1} ` +
            `("${devices[0].title}") to primary to realize theme family [${themeFamilies.join(", ")}].`,
        );
      }

      if (devices.length < 3) {
        await logger.logError({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3b-HardLogicDeviceGenerator",
          operation: "validate_devices",
          errorMessage: `Expected at least 3 devices, got ${devices.length}`,
          retryAttempt: attempt,
        });
        throw new Error("Hard-logic device generation returned too few valid devices");
      }

      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent3b-HardLogicDeviceGenerator"] || 0;

      await logger.logResponse({
        runId: inputs.runId,
        projectId: inputs.projectId,
        agent: "Agent3b-HardLogicDeviceGenerator",
        operation: "generate_hard_logic_devices",
        model: response.model || "unknown",
        success: true,
        validationStatus: "pass",
        retryAttempt: attempt,
        latencyMs: Date.now() - startTime,
        metadata: {
          primaryAxis: inputs.primaryAxis,
          deviceCount: devices.length,
          difficultyMode: inputs.difficultyMode || "standard",
        },
      });

      return {
        result: {
          status: "ok" as const,
          overview: asString(parsed.overview, "Novel hard-logic devices prepared for CML grounding."),
          devices,
          rawResponse: response.content,
          attempt,
          latencyMs: Date.now() - startTime,
          cost,
          matchedThemePrimary: primarySelection.matchedThemePrimary,
        },
        cost,
      };
    },
  });

  // Log validation warnings if any
  if (retryResult.validationResult.warnings && retryResult.validationResult.warnings.length > 0) {
    console.warn(
      `[Agent 3b] Hard logic devices validation warnings:\n` +
      retryResult.validationResult.warnings.map(w => `- ${w}`).join("\n")
    );
  }

  // If validation failed after all retries, log errors but continue
  if (!retryResult.validationResult.valid) {
    console.error(
      `[Agent 3b] Hard logic devices failed validation after ${resolvedMaxAttempts} attempts:\n` +
      retryResult.validationResult.errors.map(e => `- ${e}`).join("\n")
    );
  }

  return retryResult.result as HardLogicDeviceResult;
}

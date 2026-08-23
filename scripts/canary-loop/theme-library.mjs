// A_52 item 5 (premise diversity): a small library of structurally-divergent seed themes for the eval
// loop. Every run otherwise reuses one fixed "mechanical clock-tampering" theme and converges to the
// same "Second Key" mystery; selecting a different mechanism family here changes the murder method, the
// clue set, and the reveal — real structural divergence, not just a nudged similarity score. Opt-in via
// the CANARY_THEME env var; unset leaves the YAML theme completely untouched (default behaviour).

const FAIR_PLAY_CLAUSE =
  " Enforce strict fair-play: reveal all mechanism-critical clues to reader by mid-story, place the " +
  "discriminating test no later than early Act III, include at least 3 explicit evidence clues tied to " +
  "final deduction, and ensure every red herring is inference-isolated from the true solution chain.";

// Each premise's lead sentence is crafted so Agent 3b's mechanism-family extractor locks the PRIMARY
// device to the intended family (see MECHANISM_FAMILY_KEYWORDS in
// packages/prompts-llm/src/agent3b-hard-logic-devices.ts). primaryAxis values are the canonical set
// — temporal | spatial | identity | behavioral | authority. They were NOT, until 2026-08-21: three
// entries carried retired spellings, one of which ("mechanical") is now fatal.
// accepted by the orchestrator: temporal | spatial | social | psychological | mechanical.
export const CANARY_THEME_LIBRARY = {
  clock: {
    primaryAxis: "temporal",
    premise:
      "Golden Age murder driven by a mechanical clock-tampering method, where a rewound timepiece staged the apparent time of death.",
  },
  poison: {
    // Retired spelling of `behavioral`. Canonical now — the aliases still resolve, but a
    // config carrying the old vocabulary is how the reverse-alias map survived unnoticed.
    primaryAxis: "behavioral",
    premise:
      "Golden Age murder driven by a delayed-action poison method, where the toxicology and dosage timing conceal when the fatal dose was actually administered.",
  },
  tide: {
    primaryAxis: "temporal",
    premise:
      "Golden Age murder driven by a tidal-drowning method, where the flood-tide timetable and shifting sea level fix — and falsify — the window in which the victim could have drowned.",
  },
  acoustic: {
    // WAS "mechanical", which X70 made a THROW — `CANARY_THEME=acoustic` would have killed the
    // run outright. There is no canonical `mechanical`: a mechanism story is expressed as temporal
    // or spatial plus a mechanism family. This premise turns on when the death actually occurred
    // (a recording fabricates an alibi for the true moment), so the axis is temporal.
    primaryAxis: "temporal",
    premise:
      "Golden Age murder driven by an acoustic method, where a gramophone recording played into a soundproofed room fabricates an alibi for the true moment of death.",
  },
  optics: {
    primaryAxis: "spatial",
    premise:
      "Golden Age murder driven by an optical method, where a mirror-and-lens reflection falsified a witness's sightline across the room.",
  },
  identity: {
    // WAS "social", which resolves to `authority` — so the entry named `identity`, whose premise is
    // literally a masquerade of double identity, produced an authority mystery.
    primaryAxis: "identity",
    premise:
      "Golden Age murder driven by an impersonation method, where a masquerade of double identity — a disguise exploited to seem to be in two places — breaks the assumed alibi.",
  },
};

export function listCanaryThemeKeys() {
  return Object.keys(CANARY_THEME_LIBRARY);
}

/**
 * Resolve a CANARY_THEME selector into a { key, theme, primaryAxis } override, or null to keep the
 * YAML theme. Pure and deterministic given its inputs.
 *  - a known key (e.g. "poison") selects that premise
 *  - "rotate" picks deterministically from `seed` (the loader passes Date.now(); tests pass an index)
 *  - unknown / empty selector → null (no override; caller keeps the YAML theme)
 */
export function selectCanaryTheme(selector, seed = 0) {
  const raw = String(selector ?? "").trim().toLowerCase();
  if (!raw) return null;
  const keys = listCanaryThemeKeys();
  let key;
  if (raw === "rotate") {
    const n = Number.isFinite(seed) ? Math.abs(Math.trunc(seed)) : 0;
    key = keys[n % keys.length];
  } else if (Object.prototype.hasOwnProperty.call(CANARY_THEME_LIBRARY, raw)) {
    key = raw;
  } else {
    return null;
  }
  const entry = CANARY_THEME_LIBRARY[key];
  return {
    key,
    theme: entry.premise + FAIR_PLAY_CLAUSE,
    primaryAxis: entry.primaryAxis,
  };
}

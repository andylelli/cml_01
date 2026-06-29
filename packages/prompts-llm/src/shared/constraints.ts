/**
 * Era and setting constraint templates.
 *
 * Phase 1 of the Agent 1 redesign
 * (documentation/12_system_redesign/01_agent_1_era_setting.md §9.3): `buildEraConstraints`
 * can now be backed by the deterministic @cml/period-kb Knowledge Base instead of the
 * hardcoded per-decade strings below. Gated by the AGENT1_PERIOD_KB_ENABLED env flag:
 *
 *   unset / "off" / "false" / "0"  → legacy strings (DEFAULT — byte-identical to before)
 *   "shadow"                       → compute the KB string, log a one-line diff, RETURN legacy
 *   "on" / "true" / "1"            → RETURN the KB-backed string (legacy fallback if unparseable)
 *
 * The KB path also replaces the silent default-to-1930s with an explicit, logged
 * nearest-anchor binding. `buildLocationConstraints` is unchanged (that is Phase 2).
 */

import { buildEraConstraintsForDecade } from "@cml/period-kb";

const LEGACY_ERA_CONSTRAINTS: Record<string, string> = {
  "1920s": `1920s Era Constraints:
- Technology: No television, limited telephones, telegram primary distance communication
- Forensics: Fingerprinting new, no DNA, basic toxicology, blood typing primitive
- Transportation: Steam trains, early automobiles (unreliable), ocean liners, no commercial air travel
- Communication: Letters (days), telegrams (hours), telephone (rare, expensive)
- Social: Post-WWI trauma, rigid class structures, prohibition (US), women's suffrage new
- Policing: Scotland Yard methods, no forensic labs, gentleman amateur detectives common`,

  "1930s": `1930s Era Constraints:
- Technology: Radio common, early telephones in homes, no television, typewriters standard
- Forensics: Fingerprinting standard, basic toxicology, ballistics analysis emerging
- Transportation: Automobiles more reliable, passenger trains peak, early commercial aviation
- Communication: Telephone more common, telegrams faster, airmail available
- Social: Great Depression impact, class tensions, fascism rising in Europe
- Policing: Professional detectives emerging, forensic science developing`,

  "1940s": `1940s Era Constraints:
- Technology: Radio ubiquitous, early television (post-war), radar, code-breaking
- Forensics: Blood typing standard, ballistics good, some trace evidence analysis
- Transportation: Wartime restrictions (rationing, blackouts), post-war automobile boom
- Communication: Long-distance calls possible, military encryption legacy
- Social: WWII and post-war trauma, women in workforce, beginning of Cold War
- Policing: Military investigation techniques adapted, FBI modernizing`,

  "1950s": `1950s Era Constraints:
- Technology: Television spreading, early computers (room-sized), transistor radios
- Forensics: Serology advanced, microscopy improved, polygraph controversial
- Transportation: Commercial aviation growing, interstate highways beginning (US), cars common
- Communication: Direct dial phones spreading, no mobile phones, television news
- Social: Conformity pressure, suburbanization, Cold War paranoia, nuclear anxiety
- Policing: Professional detective work standardized, FBI crime labs expanding`,

  "1960s": `1960s Era Constraints:
- Technology: Color TV, mainframe computers, transistors common, no personal computers
- Forensics: Trace evidence analysis good, no DNA profiling, gas chromatography
- Transportation: Jet age, highways established, no security screening
- Communication: Direct dial common, international calls expensive, no internet
- Social: Social upheaval, questioning authority, civil rights, counterculture
- Policing: Miranda rights (1966), forensic science professionalizing`,
};

type KbMode = "off" | "shadow" | "on";

function readKbMode(): KbMode {
  const raw = (process.env.AGENT1_PERIOD_KB_ENABLED ?? "").trim().toLowerCase();
  if (raw === "shadow") return "shadow";
  if (raw === "on" || raw === "true" || raw === "1" || raw === "enabled") return "on";
  return "off";
}

/** Parse the leading year out of a decade key/label (e.g. "1930s" -> 1930). */
function decadeToYear(decade: string): number | undefined {
  const match = /\d{3,4}/.exec(decade);
  if (!match) return undefined;
  const year = Number.parseInt(match[0], 10);
  return Number.isFinite(year) ? year : undefined;
}

/**
 * A_53 P11 (era-constraints-silent-default-1930s): an unrecognised decade used to silently
 * get 1930s era facts while the prompt named the real decade — a silent period mismatch.
 * Resolve to the *nearest seeded decade* (derived from the map's own keys) and WARN, mirroring
 * the KB path's explicit nearest-anchor binding. Holistic: no hardcoded fallback decade —
 * the choice is data-driven from whatever decades are seeded, with an earlier-anchor tie-break.
 */
function nearestSeededDecade(decade: string): string {
  const seeded = Object.keys(LEGACY_ERA_CONSTRAINTS);
  const target = decadeToYear(decade);

  // If we cannot parse a year (or nothing is seeded), fall back to the first seeded decade.
  if (target === undefined || seeded.length === 0) {
    return seeded[0] ?? decade;
  }

  let best: string | undefined;
  let bestDistance = Number.POSITIVE_INFINITY;
  let bestYear = Number.POSITIVE_INFINITY;
  for (const key of seeded) {
    const year = decadeToYear(key);
    if (year === undefined) continue;
    const distance = Math.abs(year - target);
    // Earlier-anchor tie-break, deterministic (matches the KB oracle's pickNearestYear).
    if (distance < bestDistance || (distance === bestDistance && year < bestYear)) {
      best = key;
      bestDistance = distance;
      bestYear = year;
    }
  }
  return best ?? seeded[0];
}

function legacyEraConstraints(decade: string): string {
  const exact = LEGACY_ERA_CONSTRAINTS[decade];
  if (exact) return exact;

  // A_53 P11 (era-constraints-silent-default-1930s): warn + nearest-seeded-decade resolution
  // instead of a silent default-to-1930s.
  const resolved = nearestSeededDecade(decade);
  console.warn(
    `[agent1-era] no era constraints seeded for decade "${decade}"; using nearest seeded decade "${resolved}"`
  );
  return LEGACY_ERA_CONSTRAINTS[resolved] ?? LEGACY_ERA_CONSTRAINTS["1930s"];
}

export function buildEraConstraints(decade: string): string {
  const mode = readKbMode();
  const legacy = legacyEraConstraints(decade);

  if (mode === "off") {
    return legacy;
  }

  let kb: string | undefined;
  try {
    kb = buildEraConstraintsForDecade(decade, {
      onWarn: (m) => console.warn(`[agent1-period-kb] ${m}`),
    });
  } catch (err) {
    console.warn(
      `[agent1-period-kb] KB era lookup failed for "${decade}"; using legacy. ${(err as Error).message}`
    );
    kb = undefined;
  }

  if (mode === "shadow") {
    // Shadow mode NEVER affects the live artifact — it only logs a diff for comparison.
    if (kb) {
      console.info(
        `[agent1-period-kb][shadow] decade=${decade} kb=${kb.length}c legacy=${legacy.length}c identical=${kb === legacy}`
      );
    } else {
      console.info(`[agent1-period-kb][shadow] decade=${decade} KB could not serve; legacy used`);
    }
    return legacy;
  }

  // mode === "on": prefer the KB-backed string, fall back to legacy only if unparseable.
  return kb ?? legacy;
}

export function buildLocationConstraints(location: string, institution: string): string {
  return `Location: ${location} (${institution})

Physical Constraints:
- Geography and layout enable specific movement patterns
- Architecture creates natural access restrictions
- Weather and climate affect timing and physical evidence
- Isolation level determines outside help availability
- Local customs and rules create behavioral constraints

${institution} Specific Rules:
- Access permissions and restricted areas
- Daily schedules and routine patterns
- Social hierarchies and reporting structures
- Expected behaviors and protocol violations
- Resources available for investigation`;
}

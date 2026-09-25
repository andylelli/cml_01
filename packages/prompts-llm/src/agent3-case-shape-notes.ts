/**
 * 17-hitting-90 P3.1 and P3.2 — two shapes the readers asked the CASE for, checked as notes.
 *
 * P3.1 — the fatal wound where it kills. Both reads of seed 23403 stopped on it: *"If the foil killed
 * her, the wound should be chest/neck"*; *"A fatal upper-arm puncture is possible only with major
 * artery detail."* The case said "stabbed with a fencing foil" and a clue said "torn sleeve"; both
 * engines wrote an arm wound from the sleeve. The prompt now asks death_method for the place on the
 * body; this note says when it did not get one.
 *
 * P3.2 — the opportunity as a window with two ends. Four of four recent reads asked the reveal to
 * state it; 18 of 67 archived cases carry no window about the act at all (MEASURED 2026-09-25), so
 * the reveal had nothing to state. The prompt asks for one; this note says when it is missing.
 *
 * NOTES ONLY — no retry, no abort (B1: a gate that drives retries costs +2.43 register points).
 */

const WOUNDING = /\b(stab|stabbed|shot|struck|blow|bludgeon|club|cut|slash|pierc|punctur|knif|dagger|sword|foil|bayonet|axe|hatchet)\w*/i;

/** Places a single wound of that kind kills. A closed list, so it decides a NOTE and never a pass. */
const KILLING_SITES =
  /\b(chest|breast|heart|throat|neck|jugular|carotid|skull|head|temple|brain|back|spine|abdomen|belly|stomach|liver|lung|ribs?|artery|femoral|groin)\b/i;

export const deathMethodWoundSiteNote = (deathMethod: unknown): string | undefined => {
  const dm = String(deathMethod ?? "").trim();
  if (!dm || !WOUNDING.test(dm)) return undefined;
  if (KILLING_SITES.test(dm)) return undefined;
  return `[17-hitting-90 P3.1] death_method names a wound and no place on the body that it kills: "${dm}"`;
};

const ACT_WINDOW = /\b(murder|the act|killing|death|entry|opportunit|access)\b/i;
const TWO_ENDS = /\b(to|until|till|through|and)\b|[-–—]/;

/** The window about the act, if the case states one with two ends. */
export const actWindowOf = (caseBlock: any): string | undefined => {
  const windows: unknown[] = Array.isArray(caseBlock?.constraint_space?.time?.windows)
    ? caseBlock.constraint_space.time.windows
    : [];
  return windows.map(String).find((w) => ACT_WINDOW.test(w) && TWO_ENDS.test(w));
};

export const actWindowNote = (caseBlock: any): string | undefined =>
  actWindowOf(caseBlock)
    ? undefined
    : `[17-hitting-90 P3.2] constraint_space.time.windows states no window about the act with two ends — the reveal has no opening and closing time to give`;

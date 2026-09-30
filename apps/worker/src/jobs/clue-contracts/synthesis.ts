/**
 * What every deterministic clue synthesiser in Agents 5 and 6 does before and after it mints a clue.
 *
 * A5-08 / A6-09: the prelude below — normalise the timeline's three buckets, collect the ids in use,
 * `nextId(prefix)` — was four verbatim copies (the culprit and strict-step backstops here, Agent 5's
 * elimination backstop, Agent 6's fair-play backstop), and the incremental append three more. One body
 * each now; what each synthesiser mints, and from which template, is still its own.
 */

/** Normalise `clues.clueTimeline` (creating it if absent) and return it with an id minter. */
export function openClueSynthesis(clues: object, clueList: any[]) {
  const holder = clues as { clueTimeline?: any };
  const timeline = holder.clueTimeline ?? { early: [], mid: [], late: [] };
  timeline.early = Array.isArray(timeline.early) ? timeline.early : [];
  timeline.mid = Array.isArray(timeline.mid) ? timeline.mid : [];
  timeline.late = Array.isArray(timeline.late) ? timeline.late : [];
  holder.clueTimeline = timeline;

  const existingIds = new Set(
    clueList.map((clue) => String(clue?.id ?? "").trim()).filter((id) => id.length > 0),
  );
  /** `prefix`, else `prefix_2`, `prefix_3`, … — the first not in use; reserved once returned. */
  const nextId = (prefix: string): string => {
    let candidate = prefix;
    let suffix = 2;
    while (existingIds.has(candidate)) {
      candidate = `${prefix}_${suffix}`;
      suffix += 1;
    }
    existingIds.add(candidate);
    return candidate;
  };
  return { timeline: timeline as { early: string[]; mid: string[]; late: string[] }, nextId };
}

/**
 * Append one id to the timeline bucket its placement names (early, late, else mid), creating the
 * timeline if absent. Copies the bucket rather than pushing into it, and leaves the other buckets as
 * they are — the behaviour of the three sites this replaces.
 */
export function appendToClueTimeline(clues: object, id: string, placement: string): void {
  const holder = clues as { clueTimeline?: any };
  const timeline = holder.clueTimeline ?? { early: [], mid: [], late: [] };
  if (placement === "early") timeline.early = [...(timeline.early ?? []), id];
  else if (placement === "late") timeline.late = [...(timeline.late ?? []), id];
  else timeline.mid = [...(timeline.mid ?? []), id];
  holder.clueTimeline = timeline;
}

/**
 * A_110 N9 + M9 (IMPLEMENTATION PLAN 0.2, PROSE_V2_SCHEDULE) — THE SCHEDULE OF THE EVIDENCE.
 *
 * MEASURED over the 64 stored contracts (WP-007 §2.2, §5.1; A_110 §38.2): the A_109 reader model has the culprit as the
 * favourite by chapter 6 in 64 of 64 and by chapter 4 in 52, against a test in chapter 8 in 57; the median book spends
 * 71% of its pre-test chapters with the belief not moving at all; and deleting any one clue never un-proves the
 * culprit (0 of 72), so the case is over-determined. In run bcc0d637 six of the culprit's ten pointing clues land in
 * chapter 6, which carries 10 pieces of evidence while four chapters carry none (A_110 §26).
 *
 * Two operations, both on the case's own fields:
 *  - M9, LOAD: placement is P|prec|Cmax — minimise the busiest chapter's load, every clue no later than where the
 *    outline put it, and none before the first chapter that owns any evidence (nothing is found before the crime).
 *    A greedy pass that moves a clue from the busiest chapter to the least-loaded earlier one is within one of optimal
 *    at 24 clues by 10 chapters (Graham's list-scheduling bound). Decisive clues are moved last.
 *  - N9, CONCLUSIONS: a clue that implicates a culprit shows its FACT where it is scheduled and its MEANING from the
 *    test chapter on — the A_109 reader model's `withheld`. An observable that names the culprit shows "someone" before
 *    the test, so the fact is on the page and the reader has to do the inference (Golden Age fair play).
 */

export interface LoadMove {
  id: string;
  from: number;
  to: number;
}

/**
 * Move clues out of overloaded chapters into earlier, lighter ones. `ownership` is mutated: the returned moves say what
 * changed, so the caller can surface each moved clue in its new chapter.
 */
export const rebalanceEvidence = (
  ownership: Map<string, number>,
  opts: { chapters: number[]; decisive: ReadonlySet<string>; before: number; keepLate?: ReadonlySet<string> },
): LoadMove[] => {
  const moves: LoadMove[] = [];
  const movable = (id: string): boolean => !(opts.keepLate?.has(id) ?? false);
  const owned = [...ownership.entries()].filter(([, ch]) => ch < opts.before);
  if (owned.length === 0) return moves;
  const floor = Math.min(...owned.map(([, ch]) => ch));
  const span = opts.chapters.filter((c) => c >= floor && c < opts.before);
  if (span.length < 2) return moves;
  const target = Math.ceil(owned.length / span.length) + 1;
  const load = (c: number): number => [...ownership.values()].filter((ch) => ch === c).length;
  for (let guard = 0; guard < owned.length * 2; guard++) {
    // The heaviest overloaded chapter that has a movable clue and a lighter earlier chapter to send it to.
    let move: LoadMove | null = null;
    for (const from of span.filter((c) => load(c) > target).sort((a, b) => load(b) - load(a) || a - b)) {
      // Non-decisive first, then by id for a deterministic order.
      const id = [...ownership.entries()]
        .filter(([cid, ch]) => ch === from && movable(cid))
        .map(([cid]) => cid)
        .sort((a, b) => Number(opts.decisive.has(a)) - Number(opts.decisive.has(b)) || a.localeCompare(b))[0];
      // The lightest earlier chapter; on a tie the latest, closest to where the outline put it.
      const to = span.filter((c) => c < from && load(c) < target).sort((a, b) => load(a) - load(b) || b - a)[0];
      if (id !== undefined && to !== undefined) {
        move = { id, from, to };
        break;
      }
    }
    if (!move) break;
    ownership.set(move.id, move.to);
    moves.push(move);
  }
  return moves;
};

/**
 * N9, the facts themselves: a culprit's clues owned in the first half of the investigation move into its second half,
 * spread evenly and in their original order, never past `before` (the test). Ely, Frankel & Kamenica's
 * suspense-optimal plot spends belief late; MEASURED, deferring the meaning alone left the reader model settled before
 * the chapter ahead of the test in 60 of 64 contracts, because the facts still arrive early and in number. Moving a
 * clue LATER keeps plant-before-use, since the test is still after it. `ownership` is mutated.
 */
export const holdCulpritCluesLate = (
  ownership: Map<string, number>,
  culpritClues: ReadonlySet<string>,
  opts: { chapters: number[]; before: number },
): LoadMove[] => {
  const owned = [...ownership.entries()].filter(([, ch]) => ch < opts.before);
  if (owned.length === 0) return [];
  const floor = Math.min(...owned.map(([, ch]) => ch));
  const span = opts.chapters.filter((c) => c >= floor && c < opts.before).sort((a, b) => a - b);
  if (span.length < 3) return [];
  const secondHalf = span.slice(Math.floor(span.length / 2));
  const load = (c: number): number => [...ownership.values()].filter((ch) => ch === c).length;
  // The move never makes the book's busiest chapter busier than it already was (the archive test caught 4 -> 6).
  const cap = Math.max(...span.map(load));
  const early = owned
    .filter(([id, ch]) => culpritClues.has(id) && ch < secondHalf[0]!)
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]));
  const moves: LoadMove[] = [];
  let floorForOrder = secondHalf[0]!;
  for (const [id, from] of early) {
    // The lightest second-half chapter at or after the last one used, so the clues keep their order.
    const to = secondHalf.filter((c) => c >= floorForOrder && load(c) < cap).sort((a, b) => load(a) - load(b) || a - b)[0];
    if (to === undefined) continue;
    ownership.set(id, to);
    moves.push({ id, from, to });
    floorForOrder = to;
  }
  return moves;
};

/** The culprit's names, longest first, so "Ada Vane" is replaced before "Ada". */
const namePatterns = (culprits: ReadonlyArray<string>): RegExp[] => {
  const forms = new Set<string>();
  for (const name of culprits) {
    const clean = name.replace(/\b(Mr|Mrs|Miss|Dr|Sir|Lady|Lord)\.?\s+/g, "").trim();
    if (clean) forms.add(clean);
    for (const token of clean.split(/\s+/)) if (/^[A-Z][a-z]{2,}/.test(token)) forms.add(token);
  }
  return [...forms]
    .sort((a, b) => b.length - a.length)
    .map((f) => new RegExp(`(?<![A-Za-z])${f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![a-z])`, "g"));
};

/** The observable with every form of the culprit's name replaced by "someone". */
export const withoutCulprit = (observable: string, culprits: ReadonlyArray<string>): string => {
  let out = observable;
  for (const re of namePatterns(culprits)) out = out.replace(re, "someone");
  return out.replace(/\bsomeone(?:\s+someone)+\b/g, "someone");
};

export const namesCulprit = (text: string, culprits: ReadonlyArray<string>): boolean =>
  namePatterns(culprits).some((re) => {
    re.lastIndex = 0;
    return re.test(text);
  });

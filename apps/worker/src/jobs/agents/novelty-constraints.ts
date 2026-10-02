/**
 * The novelty constraints handed to Agent 3 (seed avoidance by axis).
 *
 * Moved verbatim from `shared.ts` (code review ORC-06), which re-exports it.
 */
import type { CaseData } from "@cml/cml";

/**
 * A_79 B — TWO DEFECTS, AND THE SECOND IS THE EXPENSIVE ONE.
 *
 * 1. THE TITLE READ MISSED A THIRD OF THE SHELF. `CASE.meta ?? meta` matches neither of the two
 *    shapes actually on disk for five of the fourteen legacy seeds, which put their title at
 *    `case_metadata.title`. Those five fell through to the raw filename, so Agent 3 was told in as
 *    many words to diverge from "trents_last_case_cml2.yaml".
 *
 * 2. THE LIST WAS ALPHABETICAL, AND ALMOST ALL OF IT WAS DISCARDED DOWNSTREAM. The seed titles were
 *    cut with `.slice(0, 8)` over a sorted readdir. With cross-run novelty on,
 *    `mergeWithReserve(priorTitles, seeds, MAX_DIVERGE_FROM=12, reserve=3)` then leaves the seeds
 *    THREE slots. Alphabetical order makes those three slots constant for the life of the project:
 *    a_jury_of_her_peers, a_study_in_scarlet, the_big_bow_mystery. Trent's Last Case and The
 *    Mysterious Affair at Styles — two of the most imitated plots in the genre, and both on our own
 *    shelf — could never once be named. Enlarging the corpus made this WORSE, because every work
 *    added after "the_b…" landed behind the cut.
 *
 * The fix is ordering, not capacity: the works sharing this story's axis lead the list, because a
 * same-axis seed is the one the run is actually at risk of re-deriving. Sort is stable, so order
 * within a group stays the readdir order and the output stays deterministic.
 */
const seedTitleOf = (seed: { filename: string; cml: CaseData }): string => {
  const root = seed.cml as any;
  const fromMeta =
    root?.CASE?.meta?.title || root?.case_metadata?.title || root?.meta?.title || root?.CASE?.title;
  if (fromMeta) return String(fromMeta);
  // Never emit a filename as a title. A humanised stem is a book; "x_cml2.yaml" is a path.
  return seed.filename
    .replace(/\.(ya?ml)$/i, "")
    .replace(/_cml2$/i, "")
    .split(/[_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const seedAxisOf = (seed: { cml: CaseData }): string => {
  const C = (seed.cml as any)?.CASE ?? {};
  return String(C.false_assumption?.type || C.meta?.primary_axis || C.meta?.primaryAxis || "")
    .trim()
    .toLowerCase();
};

export const buildNoveltyConstraints = (
  seedEntries: Array<{ filename: string; cml: CaseData }>,
  primaryAxis?: string,
) => {
  const wanted = String(primaryAxis ?? "").trim().toLowerCase();
  const ordered = wanted
    ? [...seedEntries].sort(
        (a, b) => Number(seedAxisOf(b) === wanted) - Number(seedAxisOf(a) === wanted),
      )
    : seedEntries;

  const titles = ordered.map(seedTitleOf).filter((title): title is string => Boolean(title));

  const avoidancePatterns = ordered.flatMap((seed) => {
    const cmlCase = (seed.cml as any)?.CASE ?? {};
    const meta = cmlCase.meta ?? {};
    const crimeClass = meta.crime_class ?? {};
    const era = meta?.era?.decade ?? "";
    const location = meta?.setting?.location ?? "";
    const falseAssumption = cmlCase?.false_assumption?.statement ?? "";
    const discrimMethod = cmlCase?.discriminating_test?.method ?? "";
    const discrimDesign = cmlCase?.discriminating_test?.design ?? "";
    const crimeSubtype = crimeClass?.subtype ?? "";
    const axis = cmlCase?.false_assumption?.type ?? "";
    return [
      era && location ? `Era+location combo: ${era} / ${location}` : "",
      crimeSubtype ? `Crime method/subtype: ${crimeSubtype}` : "",
      axis ? `False assumption type: ${axis}` : "",
      falseAssumption ? `False assumption statement: ${falseAssumption}` : "",
      discrimMethod ? `Discriminating test method: ${discrimMethod}` : "",
      discrimDesign ? `Discriminating test design: ${discrimDesign}` : "",
    ].filter(Boolean);
  });

  const uniqueAvoidance = Array.from(new Set(avoidancePatterns)).slice(0, 12);

  return {
    // 12, not 8, to match MAX_DIVERGE_FROM downstream — so this function stops being the binding
    // cut and the merge decides, which is where the reserve policy actually lives.
    divergeFrom: Array.from(new Set(titles)).slice(0, 12),
    areas: [
      "crime method + motive combination",
      "false assumption statement and justification",
      "discriminating test design and trigger",
      "era + location pairing",
      "culprit access path and opportunity channel",
      "constraint-space anchors and contradictions",
    ],
    avoidancePatterns: uniqueAvoidance,
  };
};

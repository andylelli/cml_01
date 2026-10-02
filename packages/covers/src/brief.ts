import type { CoverAnchors, CoverBrief, StoryCoverInput, StyleChoice } from "./types.js";

/**
 * The image prompt, composed from a TEMPLATE — not written by an LLM — so a cover is reproducible from
 * its brief.json and a change in look is attributable to a change in a card (give-a-requirement-a-shape).
 *
 * Section order is fixed: subject → composition → mystery modifier → palette → medium → layout → exclusions.
 * The mystery modifier is the same for every card: none of the 15 samples carries menace (§1 of the plan),
 * so it is supplied here as three operations rather than left to the style.
 */
export const composeBrief = (input: StoryCoverInput, anchors: CoverAnchors, choice: StyleChoice, index = 0): CoverBrief => {
  const { primary, secondary, palette } = choice;
  const compositionCard = secondary ?? primary;
  const bandPct = Math.round(primary.type_band.height * 100);
  const details = anchors.place_details.length ? ` Visible: ${anchors.place_details.join("; ")}.` : "";
  const era = input.era ? ` Everything is consistent with the ${input.era}${anchors.era_details.length ? ` (${anchors.era_details.join("; ")})` : ""}.` : "";
  const figure = anchors.figure ? ` One figure: ${anchors.figure}; ${primary.figure_treatment}.` : "";

  const lines = [
    `Vintage mystery-novel cover illustration, portrait format.`,
    `SUBJECT: ${anchors.place}, at ${anchors.time_of_day}, ${anchors.season}, ${anchors.weather}.${details}${figure}${era}`,
    `COMPOSITION: ${compositionCard.composition.join("; ")}.`,
    `MYSTERY: ${anchors.clue_object} sits in the foreground and is the most sharply lit object in the picture; ` +
      `one long shadow falls across the scene toward it; one doorway or window is dark. Mood: ${anchors.mood}.`,
    `MOTIFS (use at most two): ${primary.motifs.join("; ")}.`,
    `PALETTE: ${primary.palette_rule}. Use only these colours: ${palette.inks.join(", ")}.`,
    `MEDIUM: ${primary.medium}.`,
    `LAYOUT: the top ${bandPct}% of the picture is a plain, calm area of a single flat colour from the palette (open sky, a wall or a dark ground) with nothing important in it — a title will be printed there later. The main subject sits in the lower ${100 - bandPct}%.`,
    `EXCLUDE: ${[...primary.avoid, "words, letters, numbers, signatures, logos or frames of text"].join("; ")}.`,
  ];
  const styles = secondary ? [primary.id, secondary.id] : [primary.id];
  return {
    id: `${String(index + 1).padStart(2, "0")}-${styles.join("+")}-${palette.name}`,
    styles,
    palette: palette.name,
    prompt: lines.join("\n"),
    typeBand: primary.type_band,
    titleFont: primary.title_font,
    inks: palette.inks,
  };
};

import { figureFor } from "./framings.js";
import type { CoverAnchors, CoverBrief, StoryCoverInput, StyleChoice } from "./types.js";

/**
 * The image prompt, composed from a TEMPLATE — not written by an LLM — so a cover is reproducible from
 * its brief.json (anchors + style spec + seed) and a change in look is attributable to a card or a framing.
 *
 * Sections: subject → framing (what/where) → style layout → mystery touches → palette → medium → layout → exclusions.
 * The framing, touches, light and object come from the seeded draw in resolveStyleChoices; a choice without
 * them (an old caller) falls back to the original fixed still-life wording.
 */
export const composeBrief = (input: StoryCoverInput, anchors: CoverAnchors, choice: StyleChoice, index = 0, seed?: number): CoverBrief => {
  const { primary, secondary, palette, framing } = choice;
  const layoutCard = secondary ?? primary;
  const obj = choice.object ?? anchors.clue_object;
  const light = choice.light ?? anchors.time_of_day;
  const bandPct = Math.round(primary.type_band.height * 100);
  const details = anchors.place_details.length ? ` Visible: ${anchors.place_details.join("; ")}.` : "";
  const era = input.era ? ` Everything is consistent with the ${input.era}${anchors.era_details.length ? ` (${anchors.era_details.join("; ")})` : ""}.` : "";
  const who = framing ? figureFor(framing, anchors) : anchors.figure ?? "";
  const figureNote = who ? ` People are drawn this way: ${primary.figure_treatment}.` : "";

  const framingLines = framing
    ? framing.operations({ obj, place: anchors.place, who: who || "a figure in period clothing", light })
    : [`${obj} sits in the foreground and is the most sharply lit object in the picture`];
  const touches = choice.touches?.length
    ? choice.touches
    : ["one long shadow falls across the scene", "one doorway or window is dark"];

  const lines = [
    `Vintage mystery-novel cover illustration, portrait format.`,
    `SUBJECT: ${anchors.place}; ${anchors.season}, ${anchors.weather}, in ${light}.${details}${era}${figureNote}`,
    `FRAMING: ${framingLines.join("; ")}.`,
    `STYLE LAYOUT: ${layoutCard.composition.join("; ")}.`,
    `MYSTERY: ${touches.join("; ")}. Mood: ${anchors.mood}.`,
    `MOTIFS (use at most one): ${layoutCard.motifs.join("; ")}.`,
    `PALETTE: ${primary.palette_rule}. Use only these colours: ${palette.inks.join(", ")}.`,
    `MEDIUM: ${primary.medium}.`,
    `LAYOUT: the top ${bandPct}% of the picture is a plain, calm area of a single flat colour from the palette (open sky, a wall or a dark ground) with nothing important in it — a title will be printed there later. The main subject sits in the lower ${100 - bandPct}%.`,
    `EXCLUDE: ${[...primary.avoid, "words, letters, numbers, signatures, logos or frames of text"].join("; ")}.`,
  ];
  const styles = secondary ? [primary.id, secondary.id] : [primary.id];
  const framingId = framing?.id ?? "still-life";
  return {
    id: `${String(index + 1).padStart(2, "0")}-${styles.join("+")}-${framingId}-${palette.name}`,
    styles,
    palette: palette.name,
    framing: framingId,
    seed,
    prompt: lines.join("\n"),
    typeBand: primary.type_band,
    titleFont: primary.title_font,
    inks: palette.inks,
  };
};

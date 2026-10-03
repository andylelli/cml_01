import { figureFor } from "./framings.js";
import type { CoverAnchors, CoverBrief, StoryCoverInput, StyleChoice } from "./types.js";

/**
 * The image prompt, composed from a TEMPLATE — not written by an LLM — so a cover is reproducible from
 * its brief.json (anchors + style spec + seed) and a change in look is attributable to a card or a framing.
 *
 * Sections: subject → framing (what/where) → style layout → mystery touches → palette → medium → TITLE → text → exclusions.
 * The framing, touches, light and object come from the seeded draw in resolveStyleChoices; a choice without
 * them (an old caller) falls back to the original fixed still-life wording.
 */
export const composeBrief = (input: StoryCoverInput, anchors: CoverAnchors, choice: StyleChoice, index = 0, seed?: number): CoverBrief => {
  const { primary, secondary, palette, framing } = choice;
  const layoutCard = secondary ?? primary;
  const obj = choice.object ?? anchors.clue_object;
  const light = choice.light ?? anchors.time_of_day;
  const title = input.title.trim();
  const where =
    primary.title_position === "top" ? "across the top" : primary.title_position === "bottom" ? "across the bottom" : "at the top or the bottom, wherever the design is strongest";
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
    // The title is PAINTED as part of the cover (owner, 2026-10-03), so it is spelled out once, quoted, with its
    // letter count — a count of a simple thing is an operation this model keeps (prompts-move-operations).
    `TITLE: the cover is lettered with the book's title, exactly: "${title}" — ${title.replace(/\s+/g, "").length} characters not counting spaces, spelled exactly as given, letter for letter, nothing added or dropped. Place it ${where}, as part of the design. Lettering: ${primary.lettering}.`,
    `TEXT: the title is the ONLY text on the cover — no author name, no tagline, no price, no publisher mark, no signature, no numbers other than any in the title.`,
    `EXCLUDE: ${[...primary.avoid, "any words other than the title", "misspelled or invented letters"].join("; ")}.`,
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
    title,
    inks: palette.inks,
  };
};

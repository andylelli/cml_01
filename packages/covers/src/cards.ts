import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { parse } from "yaml";
import type { StyleCard } from "./types.js";

/**
 * Where the cards live. `CML_COVER_STYLES_DIR` wins (read at CALL time, ADR-0004); otherwise walk up
 * from `from` (default cwd) to the first directory holding `library/cover-styles/cards`.
 */
export const resolveCardsDir = (from: string = process.cwd()): string => {
  const override = (process.env.CML_COVER_STYLES_DIR ?? "").trim();
  if (override) return resolve(override);
  let dir = resolve(from);
  for (;;) {
    const candidate = join(dir, "library", "cover-styles", "cards");
    if (existsSync(candidate)) return candidate;
    const parent = dirname(dir);
    if (parent === dir) throw new Error(`cover style cards not found above ${from} (set CML_COVER_STYLES_DIR)`);
    dir = parent;
  }
};

const strArr = (v: unknown, field: string, id: string): string[] => {
  if (!Array.isArray(v) || v.some((x) => typeof x !== "string")) throw new Error(`card ${id}: ${field} must be a list of strings`);
  return v as string[];
};

/** Validate one parsed card. Throws naming the card and field — a bad card must fail loudly, not draw blank. */
export const validateCard = (raw: unknown, source = "card"): StyleCard => {
  if (!raw || typeof raw !== "object") throw new Error(`${source}: not an object`);
  const c = raw as Record<string, any>;
  const id = typeof c.id === "string" && c.id ? c.id : source;
  for (const f of ["id", "label", "family", "summary", "medium", "palette_rule", "figure_treatment", "title_font"]) {
    if (typeof c[f] !== "string" || !c[f].trim()) throw new Error(`card ${id}: ${f} is required`);
  }
  if (!Array.isArray(c.palettes) || c.palettes.length === 0) throw new Error(`card ${id}: palettes must be non-empty`);
  for (const p of c.palettes) {
    if (typeof p?.name !== "string" || !Array.isArray(p?.inks) || p.inks.length < 2) throw new Error(`card ${id}: each palette needs a name and 2+ inks`);
    for (const ink of p.inks) if (!/^#[0-9a-f]{6}$/i.test(ink)) throw new Error(`card ${id}: palette ${p.name} ink ${ink} is not #rrggbb`);
  }
  const tb = c.type_band ?? {};
  if (tb.position !== "top" || !["framed", "full-bleed"].includes(tb.style) || !(tb.height > 0.1 && tb.height < 0.4)) {
    throw new Error(`card ${id}: type_band needs position top, style framed|full-bleed, 0.1 < height < 0.4`);
  }
  const suits = c.suits ?? {};
  return {
    id: c.id,
    label: c.label,
    family: c.family,
    summary: c.summary,
    medium: c.medium.trim(),
    palette_rule: c.palette_rule,
    palettes: c.palettes,
    composition: strArr(c.composition, "composition", id),
    motifs: strArr(c.motifs ?? [], "motifs", id),
    figure_treatment: c.figure_treatment,
    type_band: { position: "top", style: tb.style, height: tb.height },
    title_font: c.title_font,
    avoid: strArr(c.avoid ?? [], "avoid", id),
    suits: {
      axis: strArr(suits.axis ?? [], "suits.axis", id),
      tone: strArr(suits.tone ?? [], "suits.tone", id),
      location: strArr(suits.location ?? [], "suits.location", id),
    },
  };
};

/** Load every `*.yaml` card, sorted by id so selection ties break the same way on every machine. */
export const loadStyleCards = (dir: string = resolveCardsDir()): StyleCard[] => {
  const files = readdirSync(dir).filter((f) => /\.ya?ml$/i.test(f));
  const cards = files.map((f) => validateCard(parse(readFileSync(join(dir, f), "utf8")), f));
  const seen = new Set<string>();
  for (const c of cards) {
    if (seen.has(c.id)) throw new Error(`duplicate card id ${c.id} in ${dir}`);
    seen.add(c.id);
  }
  return cards.sort((a, b) => a.id.localeCompare(b.id));
};

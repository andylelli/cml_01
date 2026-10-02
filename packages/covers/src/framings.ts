import type { CoverAnchors } from "./types.js";

/**
 * FRAMINGS — what the cover shows and from where, chosen per cover independently of the style card.
 *
 * MEASURED 2026-10-02, first matrix: 12 of 12 covers were one composition (a woman seen from behind, the
 * object in the foreground) because the brief template fixed the object's position and every card asked for
 * a figure. The style card now says HOW it is painted; the framing says WHAT is in the picture and WHERE.
 * Each framing is a short list of operations, written against the anchors.
 */

/** Seeded PRNG (mulberry32) — every random choice in a cover flows from one recorded seed. */
export type Rng = () => number;
export const makeRng = (seed: number): Rng => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
/** A fresh seed per call — "every run makes a different cover". */
export const randomSeed = () => Math.floor(Math.random() * 0xffffffff) >>> 0;

export const pick = <T>(rng: Rng, items: readonly T[]): T => items[Math.floor(rng() * items.length) % items.length];

/** Weighted pick; weights ≤ 0 are never chosen unless all are. */
export const weightedPick = <T>(rng: Rng, items: readonly T[], weight: (t: T) => number): T => {
  const ws = items.map((t) => Math.max(0, weight(t)));
  const total = ws.reduce((a, b) => a + b, 0);
  if (total <= 0) return pick(rng, items);
  let r = rng() * total;
  for (let i = 0; i < items.length; i++) {
    r -= ws[i];
    if (r < 0) return items[i];
  }
  return items[items.length - 1];
};

/** Fisher–Yates on a copy. */
export const shuffle = <T>(rng: Rng, items: readonly T[]): T[] => {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export interface Framing {
  id: string;
  label: string;
  /** Whether the picture contains a person. "none" framings break the "always a woman from behind" habit. */
  figure: "required" | "optional" | "none";
  /** A framing that fixes the time of day sets its own light, overriding the random draw (MEASURED clash: "at night" + "dusk"). */
  light?: string;
  /** Axes it suits a little better (weight ×2); every framing is possible for every story. */
  suits?: string[];
  /** The COMPOSITION operations. `obj` = the chosen object, `who` = the figure description. */
  operations: (a: { obj: string; place: string; who: string; light: string }) => string[];
}

export const FRAMINGS: readonly Framing[] = [
  {
    id: "establishing",
    label: "The house under a big sky",
    figure: "optional",
    suits: ["spatial", "physical"],
    operations: ({ place, who, obj }) => [
      `${place} seen from a distance, occupying the lower third of the picture under a large sky`,
      `one tiny figure (${who}) on the approach, dwarfed by the building`,
      `${obj} does not appear large; at most it is a small detail in one lit window`,
    ],
  },
  {
    id: "still-life",
    label: "The object, close",
    figure: "none",
    suits: ["temporal", "physical"],
    operations: ({ obj, place }) => [
      `a close still life: ${obj} fills the lower half of the picture, seen from slightly above`,
      `behind it, out of focus or simplified, a window or doorway opening onto ${place}`,
      `no people anywhere in the picture`,
    ],
  },
  {
    id: "through-doorway",
    label: "Through a doorway",
    figure: "optional",
    suits: ["spatial", "behavioural"],
    operations: ({ who, obj }) => [
      `the viewer stands in a dark room looking through an open doorway; the doorframe forms a tall dark border`,
      `beyond the doorway, a lit room; ${who} stands far inside, small, turned away`,
      `${obj} sits on a surface just inside the doorway, catching the light`,
    ],
  },
  {
    id: "birds-eye",
    label: "Looking down",
    figure: "optional",
    suits: ["spatial"],
    operations: ({ place, who, obj }) => [
      `a high viewpoint looking steeply down — over a staircase well, a hall floor or the grounds of ${place}`,
      `strong geometric pattern from floor tiles, paths, hedges or banisters`,
      `${who}, seen from directly above, small, casting a long shadow; ${obj} visible as a small bright shape`,
    ],
  },
  {
    id: "shadow-on-wall",
    label: "Only a shadow",
    figure: "none",
    suits: ["psychological", "behavioural"],
    operations: ({ obj }) => [
      `a plain wall or a closed door fills most of the picture`,
      `across it falls the long, distorted shadow of a person who is NOT in the picture`,
      `${obj} sits on a table or ledge at the bottom edge, in the same light`,
    ],
  },
  {
    id: "hand-and-object",
    label: "A hand reaching",
    figure: "none",
    suits: ["physical", "behavioural"],
    operations: ({ obj }) => [
      `a single gloved hand enters from the edge of the picture, reaching toward ${obj}`,
      `only the hand and cuff are visible — no face, no body`,
      `the object and hand sit in the lower half; the background is simple and dark`,
    ],
  },
  {
    id: "lit-window-night",
    label: "One lit window at night",
    figure: "optional",
    light: "moonlight and one lamp",
    suits: ["temporal", "spatial", "psychological"],
    operations: ({ place, who }) => [
      `${place} at night, mostly dark shapes against a deep sky`,
      `exactly one window is lit; inside it, ${who} is a small silhouette`,
      `the foreground is dark ground, a path or water reflecting the window`,
    ],
  },
  {
    id: "portrait-glance",
    label: "A figure, close",
    figure: "required",
    suits: ["behavioural", "psychological"],
    operations: ({ who, place, obj }) => [
      `${who}, head and shoulders, close to the viewer, turned to glance over one shoulder at something out of frame`,
      `behind, simplified, a glimpse of ${place}`,
      `${obj} appears small at the bottom edge`,
    ],
  },
  {
    id: "two-figures",
    label: "Two people, apart",
    figure: "required",
    suits: ["behavioural", "psychological"],
    operations: ({ place }) => [
      `two figures in period dress at opposite sides of the picture, not looking at each other, inside or before ${place}`,
      `a wide gap of floor, lawn or shadow between them`,
      `one of them holds something small, its shape unclear`,
    ],
  },
  {
    id: "reflection",
    label: "Seen in a reflection",
    figure: "optional",
    suits: ["spatial", "psychological"],
    operations: ({ place, who }) => [
      `the scene is seen reflected — in a pool, a dark window pane or a polished table`,
      `${place} appears upside down or doubled in the reflection; ${who} is small within it`,
      `ripples or a crack break the reflection into flat shapes`,
    ],
  },
];

/** The mystery touches — two are drawn per cover instead of the same three on every one. */
export const MYSTERY_TOUCHES: readonly string[] = [
  "one long shadow falls across the scene",
  "one doorway or window is completely dark",
  "a single window is lit while everything else is dim",
  "a curtain stirs at an open window",
  "a door stands slightly ajar",
  "a distant figure watches, barely visible",
  "a clock face is visible somewhere, its hands unreadable",
  "smoke or mist hangs low across the ground",
  "one chair is pushed back as if someone has just risen",
  "light falls in a hard wedge through a gap",
];

export const LIGHTS: readonly string[] = ["low winter sun", "moonlight", "lamplight", "grey fog light", "the last light of dusk", "hard morning light"];

/** Choose a framing for a story: weighted toward the axis, never excluding any. */
export const chooseFraming = (rng: Rng, axis: string | undefined, exclude: Set<string> = new Set()): Framing => {
  const pool = FRAMINGS.filter((f) => !exclude.has(f.id));
  const items = pool.length ? pool : FRAMINGS;
  return weightedPick(rng, items, (f) => (axis && f.suits?.includes(axis.toLowerCase()) ? 2 : 1));
};

/** The figure description to use, given the framing and what the story offers. */
export const figureFor = (framing: Framing, anchors: CoverAnchors) =>
  framing.figure === "none" ? "" : anchors.figure || "a figure in period clothing";

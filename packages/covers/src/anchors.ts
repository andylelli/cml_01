import type { CoverAnchors, CoverChatClient, StoryCoverInput } from "./types.js";

/** Agent label in logs/llm-prompts-full.jsonl — verify the call by this label, not by grepping the module. */
export const ANCHORS_AGENT_LABEL = "Agent10-CoverAnchors";

const MAX_OPENING_CHARS = 14_000;

/**
 * The anchor prompt. Shaped, not described: it asks for a fixed JSON object with countable fields, and
 * gives the model JOBS for the spoiler constraint rather than prohibitions. MEASURED 2026-10-02 (3 stories):
 * the first wording ("the most paintable location", "one object from the opening") picked the victim's
 * bedroom and the WEAPON on 2 of 3 — chapters 1–2 contain the discovery, so "opening only" is not
 * spoiler-safe by itself. The place is now the SETTING and the object belongs to the PLACE.
 */
export const buildAnchorPrompt = (input: StoryCoverInput) => {
  const facts = [
    `Title: ${input.title}`,
    input.era && `Era: ${input.era}`,
    input.locationPreset && `Location type: ${input.locationPreset}`,
    input.setting && `Setting: ${input.setting}`,
    input.tone && `Tone: ${input.tone}`,
    input.storyAngle && `Story angle: ${input.storyAngle}`,
  ].filter(Boolean).join("\n");
  const system =
    "You are an art director choosing what a vintage mystery-novel cover will depict. " +
    "You read the opening chapters of a novel and pick concrete, drawable things that a reader meets on the first pages. " +
    "Reply with one JSON object and nothing else.";
  const user = `${facts}

OPENING CHAPTERS (the only text you may draw from):
"""
${input.openingText.slice(0, MAX_OPENING_CHARS)}
"""

Return this JSON object:
{
  "place": "the house, building or landscape the story is set in, seen from OUTSIDE, in 4-10 words (e.g. 'a flint manor above a salt marsh')",
  "place_details": ["exactly 3 visible physical details of that place, 2-8 words each"],
  "time_of_day": "one of: dawn, morning, afternoon, dusk, night",
  "weather": "2-5 words",
  "season": "one of: spring, summer, autumn, winter",
  "clue_objects": ["exactly 3 everyday period objects that belong to the place and appear in the opening — a clock, a key, a lamp, a teacup, a letter, a glove, a hat — 2-8 words each, most paintable first"],
  "mood": "2-4 words",
  "figure": "one living character from the opening, described by period clothing and posture only, no name, 4-12 words — or null",
  "era_details": ["exactly 2 period details visible in the opening (vehicles, clothing, lamps, furniture), 2-6 words each"]
}`;
  return { system, user };
};

const str = (v: unknown, max = 120) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const list = (v: unknown, n: number) =>
  Array.isArray(v) ? v.map((x) => str(x, 80)).filter(Boolean).slice(0, n) : [];

/** Pull the outermost JSON object from a reply (fences, preamble). */
const extractJson = (raw: string): unknown => {
  const text = (raw ?? "").trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = (fenced?.[1] ?? text).trim();
  const start = body.indexOf("{");
  const end = body.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("no JSON object in anchor reply");
  return JSON.parse(body.slice(start, end + 1));
};

const ONE_OF = (v: string, allowed: string[], dflt: string) => (allowed.includes(v.toLowerCase()) ? v.toLowerCase() : dflt);

/**
 * The cover is seen before page one, so it must not show the means or the result of the crime. The model
 * is asked for three candidates and this picks the first that is not a weapon, poison or crime trace —
 * a backstop for a shaped request, not the request itself (MEASURED: 1 of 3 still chose a letter opener
 * after the prompt was reshaped). Rejections are recorded on the anchors so the filter can be audited.
 */
export const CRIME_OBJECT_RE =
  /\b(knife|knives|dagger|blade|letter[- ]?opener|gun|pistol|revolver|rifle|shotgun|bullet|poison|arsenic|cyanide|strychnine|vial|phial|syringe|needle|rope|cord|garrotte|noose|blood|bloody|bloodied|wound|body|corpse|fingerprints?|weapon|bludgeon|cosh|poker|candlestick|razor|hammer|axe|hatchet|scissors|shears)\b/i;
export const CRIME_PLACE_RE = /\b(victim'?s?|bedroom|body|corpse|crime scene|blood|morgue|mortuary)\b/i;

/** Parse and coerce a model reply. Throws when the two load-bearing fields are missing. */
export const parseAnchors = (raw: string): CoverAnchors => {
  const o = extractJson(raw) as Record<string, unknown>;
  let place = str(o.place);
  const candidates = [...list(o.clue_objects, 5), str(o.clue_object)].filter(Boolean);
  if (!place || candidates.length === 0) throw new Error("anchor reply missing place or clue_objects");
  const rejected = candidates.filter((c) => CRIME_OBJECT_RE.test(c));
  const clue = candidates.find((c) => !CRIME_OBJECT_RE.test(c)) ?? "a single lit oil lamp";
  if (CRIME_PLACE_RE.test(place)) {
    rejected.push(place);
    // "the victim's bedroom in a country manor" → "a country manor": keep the building, drop the room.
    place = place.match(/\b(?:in|of|at)\s+(.+)$/i)?.[1]?.trim() || "an English country house";
  }
  const figure = str(o.figure);
  return {
    place,
    place_details: list(o.place_details, 3),
    time_of_day: ONE_OF(str(o.time_of_day), ["dawn", "morning", "afternoon", "dusk", "night"], "dusk"),
    weather: str(o.weather, 60) || "still air",
    season: ONE_OF(str(o.season), ["spring", "summer", "autumn", "winter"], "autumn"),
    clue_object: clue,
    mood: str(o.mood, 60) || "quiet unease",
    figure: figure && figure.toLowerCase() !== "null" ? figure : null,
    era_details: list(o.era_details, 2),
    ...(rejected.length ? { rejected } : {}),
    source: "llm",
  };
};

/** Anchors from the inputs alone — used when no LLM is available or its reply is unusable. Never throws. */
export const fallbackAnchors = (input: StoryCoverInput): CoverAnchors => ({
  place: input.setting?.slice(0, 80) || (input.locationPreset ? `an English ${input.locationPreset.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase()}` : "an English country house"),
  place_details: [],
  time_of_day: "dusk",
  weather: "still air",
  season: "autumn",
  clue_object: "a single lit oil lamp",
  mood: input.tone && /dark/i.test(input.tone) ? "menace" : "quiet unease",
  figure: null,
  era_details: input.era ? [`${input.era} period details`] : [],
  source: "fallback",
});

/**
 * One LLM call; on any failure, the fallback. A cover must never fail a run (it is a post-pass on a book
 * that already exists), so the error is returned, not thrown.
 */
export const extractAnchors = async (
  input: StoryCoverInput,
  llm: CoverChatClient | undefined,
  logContext?: { runId: string; projectId: string },
): Promise<{ anchors: CoverAnchors; error?: string; cost?: number }> => {
  if (!llm) return { anchors: fallbackAnchors(input), error: "no LLM client" };
  const { system, user } = buildAnchorPrompt(input);
  try {
    const res = await llm.chat({
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.4,
      maxTokens: 800,
      jsonMode: true,
      logContext: logContext ? { ...logContext, agent: ANCHORS_AGENT_LABEL } : undefined,
    });
    return { anchors: parseAnchors(res.content), cost: res.cost };
  } catch (e) {
    return { anchors: fallbackAnchors(input), error: String((e as Error)?.message ?? e) };
  }
};

/**
 * A_95 M1 — THE REGISTER BAN: the chapter's own worst sentences, handed back as a numbered list.
 *
 * ── WHY ──────────────────────────────────────────────────────────────────────────────────────────
 *
 * "Still has generated/scaffold lines" appears in **15 of 15** reviewer texts on disk, and prose has
 * never scored above 8 in 61 external reads (top-15 mean 6.93). An 8 has only ever been given to a
 * book the reader called clean of them, so prose is capped by ONE defect class rather than by
 * quality.
 *
 * Machine register is the only validated predictor this project owns — ρ −0.60 against the headline
 * and **−0.71 against character clarity** over 34 read books — and since A_88 it has acted on
 * nothing. It scores exactly the sentences the reader calls "generated" when no template is
 * involved: a stative verb, an abstract subject, no concrete noun, no sensory word. *"The mechanism
 * behind it all remained hidden, the contradiction unresolved."*
 *
 * ── WHY A LIST AND NOT A RULE ────────────────────────────────────────────────────────────────────
 *
 * The polish prompt already carries five well-written prohibitions and the rate has not moved. This
 * model complies with countable OPERATIONS and ignores statistics (CLAUDE.md), and the two levers
 * that have worked in this codebase — the tic-template ban (23% → 0 of 7) and the repeat ban list
 * (A_94 R5) — are both lists of specific strings with a count beside them. This is the same shape:
 * *these seven sentences, rewritten*, not *"write less abstractly"*.
 *
 * ── WHAT IS NOT DONE HERE ────────────────────────────────────────────────────────────────────────
 *
 * Nothing is rewritten deterministically. A_84 measured that our own injectors authored every
 * "generated line" one reader flagged, and A_91 measured `AtmosphereRepair` authoring 5 of the last
 * 20 — a scrubber that writes prose is how this project has repeatedly made prose worse. The list
 * goes to the LLM polish pass, which already has a rollback guard.
 */
import { REGISTER_TELEMETRY_THRESHOLD, scoreSentenceRegister } from "@cml/prose-guard";

import type { ProseChapter } from "./types.js";

export const isRegisterBanEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_REGISTER_BAN ?? "").trim());

/** How many sentences to name. Enough to matter, few enough that each gets attention. */
export const REGISTER_BAN_MAX_SENTENCES = 8;

/** Below this a sentence is too short for the score to mean anything. */
const MIN_SENTENCE_WORDS = 6;

export interface RegisterOffender {
  sentence: string;
  score: number;
}

const splitSentences = (text: string): string[] =>
  String(text ?? "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

/**
 * NARRATION ONLY. A line of dialogue is not machine register however abstract it is — people are
 * allowed to speak in abstractions, and rewriting a suspect's evasion to add a concrete noun would
 * damage the character work this is meant to protect.
 */
const isNarration = (sentence: string): boolean => !/[“"]/.test(sentence);

export const collectRegisterOffenders = (
  chapter: ProseChapter,
  limit = REGISTER_BAN_MAX_SENTENCES,
): RegisterOffender[] => {
  const text = (chapter?.paragraphs ?? []).join("\n\n");
  const out: RegisterOffender[] = [];
  for (const sentence of splitSentences(text)) {
    if (!isNarration(sentence)) continue;
    if (sentence.split(" ").length < MIN_SENTENCE_WORDS) continue;
    const { score } = scoreSentenceRegister(sentence);
    if (score >= REGISTER_TELEMETRY_THRESHOLD) out.push({ sentence, score });
  }
  // Worst first, and ties broken by length so the longest offender of a given score is named.
  out.sort((a, b) => b.score - a.score || b.sentence.length - a.sentence.length);
  return out.slice(0, limit);
};

/**
 * The block for the polish prompt. Empty when the chapter has no offenders — a chapter that is
 * already concrete is told nothing, which is what keeps this from being an off switch with extra
 * steps (B1).
 */
export const buildRegisterBanBlock = (chapter: ProseChapter, limit = REGISTER_BAN_MAX_SENTENCES): string => {
  const offenders = collectRegisterOffenders(chapter, limit);
  if (offenders.length === 0) return "";
  const lines: string[] = [];
  lines.push("");
  lines.push("THESE SENTENCES, SPECIFICALLY — they are this chapter's own, and each one is the shape a reader");
  lines.push("calls machine-written: a state of affairs reported, with nothing anybody could see, touch or do.");
  lines.push("");
  offenders.forEach((o, i) => lines.push(`  ${i + 1}. "${o.sentence}"`));
  lines.push("");
  lines.push("Rewrite EVERY one of them. Each rewrite must contain a thing that is physically present in the");
  lines.push("scene, and somebody doing something with it or to it. Keep the fact the sentence carries — the");
  lines.push("same information, arriving through an object and a person instead of through a summary. If the");
  lines.push("sentence carries no fact, cut it.");
  lines.push("");
  lines.push("Do not simply add an adjective, and do not move the abstraction into dialogue.");
  return lines.join("\n");
};

/**
 * agent9-prose/sanitization.ts
 * Text sanitization helpers for prose chapters and cast references.
 * Also owns parseProseResponse to avoid circular dependency between generate.ts and repair.ts.
 */
import { jsonrepair } from "jsonrepair";
import { anonymizeUnknownTitledNames } from "@cml/story-validation";
import type { CastDesign } from "../agent2-cast.js";
import type { ProseChapter, ProseGenerationResult } from "./types.js";

const INTERNAL_AUDIT_LEAK_PATTERNS: RegExp[] = [
  /\bthe detail is explicit\b/i,
  /\bthis detail added\b.*\btexture\b/i,
  /\bwithout changing the essential deduction chain\b/i,
  /\bfor the purposes of this (?:scene|chapter|narrative)\b/i,
  /\bthe (?:time|value|reading|interval) was recorded as\b/i,
  /\bthe (?:exact|precise) (?:amount|value|time|phrase|interval)\b.{0,40}\b(?:wound back|came to|amounts to|equals)\b/i,
  /\buntil the investigator\b.{0,40}\b(?:arriv|comes?|is here)\b/i,
  /\bhold on\b.{0,50}\buntil.*investigator\b/i,
  /\bthis evidence points to\b.{0,80}\b(?:involvement|guilt|culpability)\b/i,
  /\bdirect evidence ties\b.{0,80}\baccess point\b/i,
  /^\s*(setting|mood|atmosphere|continuity note|audit note)\s*:/i,
];

/**
 * Internal identifier families that must never survive into shipped prose. These are pipeline
 * bookkeeping tokens; no work of fiction contains them, so the scrub below is unconditionally safe.
 */
// Narrowed after a false-positive sweep: `fact|node|step` were speculative additions beyond the
// observed leak (`clue_*`) and they matched ordinary text — "the fact_finding mission" became
// "the mission", and case-insensitivity let "Node_A of the plan" become "of the plan". Only families
// the pipeline actually emits, matched case-SENSITIVELY because pipeline ids are always lowercase.
const IDENTIFIER_PREFIXES = "clue|scene|beat|atom|obligation";
const IDENTIFIER_TOKEN = `(?:${IDENTIFIER_PREFIXES})_[a-z0-9_]+`;

/**
 * Remove internal identifiers from prose, repairing the punctuation they were embedded in.
 *
 * MEASURED (story_20260731-1650 Ch9): the model copied identifiers out of its own prompt and set
 * them as hyphenated appositives —
 *   "Witness accounts-clue_mid_1-place you away from the lobby."
 *   "the forensic report revealing tampering-clue_core_contradiction_chain-prove the deception."
 *
 * `stripInternalAuditPhrasing` could not help: it drops whole SENTENCES, so applying it here would
 * delete a load-bearing reveal beat rather than a stray token. This scrub is surgical — it removes
 * the identifier and the bracketing punctuation, leaving the sentence otherwise intact.
 *
 * All three of that run's leaks were in Chapter 9 — the one chapter that failed validation and so
 * never reached the post-pass polish, whose prompt explicitly strips this class of text. This scrub
 * is the backstop that does not depend on polish being reached.
 */
export function scrubInternalIdentifiers(text: string): string {
  const input = String(text ?? "");
  if (!input) return input;
  let out = input;
  // Dash-wrapped appositive: "accounts-clue_mid_1-place" -> "accounts place"
  out = out.replace(new RegExp(`\\s*[-–—]\\s*${IDENTIFIER_TOKEN}\\s*[-–—]\\s*`, "g"), " ");
  // Bracketed aside: "(clue_mid_1)" / "[clue_mid_1]" -> removed
  out = out.replace(new RegExp(`\\s*[([{]\\s*${IDENTIFIER_TOKEN}\\s*[)\\]}]`, "g"), "");
  // Trailing dash form: "tampering-clue_x" -> "tampering"
  out = out.replace(new RegExp(`\\s*[-–—]\\s*${IDENTIFIER_TOKEN}\\b`, "g"), "");
  // Bare token anywhere else.
  out = out.replace(new RegExp(`\\b${IDENTIFIER_TOKEN}\\b`, "g"), "");
  // Repair what removal left behind.
  return out
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,;:])\s*\1+/g, "$1")
    .trim();
}

export function stripInternalAuditPhrasing(text: string): string {
  const normalized = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";

  const sentenceParts = normalized.match(/[^.!?]+[.!?]+['""\u2019\u201d]?(?:\s+|$)/g) ?? [normalized];
  const cleaned = sentenceParts
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && !INTERNAL_AUDIT_LEAK_PATTERNS.some((re) => re.test(part)));

  if (cleaned.length === 0) return "";
  return cleaned.join(" ").replace(/\s+/g, " ").trim();
}

export const parseProseResponse = (content: string) => {
  const stripAuditLocal = (parsed: any): any => {
    if (!parsed || typeof parsed !== 'object' || !('audit' in parsed)) return parsed;
    const { audit: _audit, ...rest } = parsed;
    return rest;
  };
  try {
    return stripAuditLocal(JSON.parse(content)) as Omit<ProseGenerationResult, "cost" | "durationMs">;
  } catch (error) {
    const repaired = jsonrepair(content);
    return stripAuditLocal(JSON.parse(repaired)) as Omit<ProseGenerationResult, "cost" | "durationMs">;
  }
};
export function sanitizeScenesCharacters(scenes: any[], validCastNames: string[]): any[] {
  const validSet = new Set(validCastNames);
  const sanitizeText = (text: string): string => anonymizeUnknownTitledNames(text, validCastNames);

  return scenes.map(scene => {
    if (!scene) return scene;
    const sanitized = Array.isArray(scene.characters)
      ? scene.characters.filter((name: any) => typeof name === 'string' && validSet.has(name))
      : scene.characters;

    // Sanitize all free-text fields that the prose LLM reads — not just summary/title.
    // The outline LLM commonly writes phantom names in purpose and dramaticElements too.
    const sanitizedDramaticElements = scene.dramaticElements
      ? Object.fromEntries(
          Object.entries(scene.dramaticElements as Record<string, any>).map(([k, v]) => [
            k,
            typeof v === 'string' ? sanitizeText(v) : v,
          ])
        )
      : scene.dramaticElements;

    return {
      ...scene,
      characters: sanitized?.length > 0 ? sanitized : scene.characters,
      summary: typeof scene.summary === 'string' ? sanitizeText(scene.summary) : scene.summary,
      title: typeof scene.title === 'string' ? sanitizeText(scene.title) : scene.title,
      purpose: typeof scene.purpose === 'string' ? sanitizeText(scene.purpose) : scene.purpose,
      dramaticElements: sanitizedDramaticElements,
    };
  });
}

/**
 * Sanitize generated chapter prose to remove invented titled names before validation.
 *
 * Converts unknown `Title Surname` mentions into anonymous role phrases
 * (e.g. "Detective Harlow" -> "the detective"). This acts as a hard safety
 * net for late-chapter retries where the model may still drift into
 * genre-attractor names.
 */
export function sanitizeGeneratedChapter(chapter: ProseChapter, validCastNames: string[]): ProseChapter {
  const sanitizeText = (text: string): string => {
    const withAnonymousNames = anonymizeUnknownTitledNames(text, validCastNames);
    // Scrub identifiers BEFORE the sentence-level audit filter: a sentence carrying a stray
    // identifier is otherwise valid prose, and dropping it whole would lose a reveal beat.
    return stripInternalAuditPhrasing(scrubInternalIdentifiers(withAnonymousNames));
  };

  return {
    ...chapter,
    title: typeof chapter.title === 'string' ? sanitizeText(chapter.title) : chapter.title,
    summary: typeof chapter.summary === 'string' ? sanitizeText(chapter.summary) : chapter.summary,
    paragraphs: Array.isArray(chapter.paragraphs)
      ? chapter.paragraphs
          .map((p) => (typeof p === 'string' ? sanitizeText(p) : p))
          .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
      : chapter.paragraphs,
  };
}

export function splitParagraphForStructure(text: string): [string, string] | null {
  const normalized = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!normalized) return null;

  const sentenceChunks = (normalized.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) ?? [])
    .map((chunk) => chunk.trim())
    .filter(Boolean);
  if (sentenceChunks.length >= 2) {
    const midpoint = Math.ceil(sentenceChunks.length / 2);
    const left = sentenceChunks.slice(0, midpoint).join(' ').trim();
    const right = sentenceChunks.slice(midpoint).join(' ').trim();
    if (left && right) return [left, right];
  }

  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length < 40) return null;
  const midpoint = Math.floor(words.length / 2);
  const scanStart = Math.max(8, midpoint - 24);
  const scanEnd = Math.min(words.length - 8, midpoint + 24);
  let splitIdx = midpoint;
  for (let i = scanStart; i < scanEnd; i += 1) {
    if (/[.!?;:,]$/.test(words[i])) {
      splitIdx = i + 1;
      break;
    }
  }

  const left = words.slice(0, splitIdx).join(' ').trim();
  const right = words.slice(splitIdx).join(' ').trim();
  if (!left || !right) return null;
  return [left, right];
}

export function enforceMinimumParagraphStructure(chapter: ProseChapter, minParagraphs: number): ProseChapter {
  if (!Array.isArray(chapter.paragraphs) || chapter.paragraphs.length >= minParagraphs) {
    return chapter;
  }

  const paragraphs = chapter.paragraphs
    .map((p) => String(p ?? '').trim())
    .filter(Boolean);
  if (paragraphs.length >= minParagraphs) {
    return { ...chapter, paragraphs };
  }

  let safety = 0;
  while (paragraphs.length < minParagraphs && safety < 8) {
    safety += 1;
    let longestIdx = -1;
    let longestLen = 0;
    for (let i = 0; i < paragraphs.length; i += 1) {
      const len = paragraphs[i].length;
      if (len > longestLen) {
        longestLen = len;
        longestIdx = i;
      }
    }
    if (longestIdx < 0 || longestLen < 220) break;

    const split = splitParagraphForStructure(paragraphs[longestIdx]);
    if (!split) break;
    paragraphs.splice(longestIdx, 1, split[0], split[1]);
  }

  return { ...chapter, paragraphs };
}


export const normalizeProseCastOrThrow = (inputCast: unknown): CastDesign => {
  const maybeCast = inputCast as { characters?: unknown } | null | undefined;
  if (!maybeCast || !Array.isArray(maybeCast.characters)) {
    throw new Error(
      "Agent 9 input validation failed: cast.characters is required and must be an array before prose generation.",
    );
  }
  // Defensive ingestion hygiene: trim whitespace on character names so a stray
  // trailing space persisted upstream (e.g. "Margaret " in store.json) cannot
  // defeat name-matching in pronoun repair / character-consistency validation.
  const characters = (maybeCast.characters as any[]).map((c) =>
    c && typeof c === "object" && typeof (c as any).name === "string"
      ? { ...c, name: (c as any).name.trim() }
      : c,
  );
  return { ...(maybeCast as any), characters } as CastDesign;
};

export const stripAuditField = (parsed: any): any => {
  if (!parsed || typeof parsed !== 'object' || !('audit' in parsed)) {
    return parsed;
  }
  const { audit: _audit, ...rest } = parsed;
  return rest;
};

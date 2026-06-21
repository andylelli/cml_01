/**
 * prose-blind-reader.ts — SWEEP D.
 *
 * The Agent 6 blind reader checks solvability from the CLUE SET (descriptions). This checks
 * solvability from the ACTUAL PROSE: it feeds the model every chapter EXCEPT the reveal and
 * asks it to name the culprit from the suspect list. If a careful reader cannot reach the
 * culprit before the revelation, the story is not fair-play — the genre's real fairness test.
 *
 * Warning-level by design and gated by ENABLE_PROSE_BLIND_READER so it adds no cost unless
 * enabled. Never throws to the caller (errors resolve to ran:false).
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import { resolveDesignModel } from "../utils/model-tiers.js";

export interface ProseBlindReadResult {
  ran: boolean;
  guessedCulprit: string;
  confidence: number; // 0..1
  correct: boolean;
  reasoning: string;
  error?: string;
}

const surname = (value: string): string => value.trim().split(/\s+/).pop()?.toLowerCase() ?? "";
const namesMatch = (a: string, b: string): boolean => {
  const ka = a.trim().toLowerCase();
  const kb = b.trim().toLowerCase();
  return Boolean(ka) && Boolean(kb) && (ka === kb || surname(a) === surname(b));
};

export function isProseBlindReaderEnabled(): boolean {
  return String(process.env.ENABLE_PROSE_BLIND_READER ?? "").toLowerCase() === "true";
}

export async function blindReadProse(args: {
  client: AzureOpenAIClient;
  chapters: Array<{ title?: string; paragraphs?: string[] }>;
  suspects: string[];
  culprit: string;
  /** 1-based chapter index that begins the reveal; that chapter and all after it are withheld.
   *  Defaults to the last chapter. */
  revelationChapter?: number;
}): Promise<ProseBlindReadResult> {
  const empty: ProseBlindReadResult = { ran: false, guessedCulprit: "", confidence: 0, correct: false, reasoning: "" };
  try {
    const chapters = Array.isArray(args.chapters) ? args.chapters : [];
    const suspects = (args.suspects ?? []).map((s) => String(s).trim()).filter(Boolean);
    const culprit = String(args.culprit ?? "").trim();
    if (chapters.length < 2 || suspects.length === 0 || !culprit) {
      return empty;
    }

    // Withhold the reveal: everything from revelationChapter onward (default: final chapter).
    const cutoff = Math.min(
      Math.max(1, args.revelationChapter ?? chapters.length),
      chapters.length,
    );
    const readable = chapters.slice(0, cutoff - 1);
    if (readable.length === 0) return empty;

    const storyText = readable
      .map((ch, i) => `## Chapter ${i + 1}: ${ch.title ?? ""}\n${(ch.paragraphs ?? []).join("\n\n")}`)
      .join("\n\n");

    const system =
      "You are a careful reader of a fair-play detective story. You are given every chapter EXCEPT the final " +
      "revelation. Using ONLY clues present in the text, decide who committed the crime. Choose from the suspect " +
      "list. Respond with strict JSON: " +
      '{ "culprit": "<one suspect name>", "confidence": <0.0-1.0>, "reasoning": "<one or two sentences citing the clues>" }';
    const user =
      `Suspects: ${suspects.join(", ")}\n\n` +
      `Story (revelation withheld):\n\n${storyText}\n\n` +
      `Who is the culprit? Return JSON only.`;

    const response = await args.client.chat({
      model: resolveDesignModel(),
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0,
      jsonMode: true,
    });

    let parsed: any = {};
    try {
      parsed = JSON.parse(response.content);
    } catch {
      const match = response.content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    }
    const guessedCulprit = String(parsed?.culprit ?? "").trim();
    const confidence = Number.isFinite(Number(parsed?.confidence)) ? Number(parsed.confidence) : 0;
    const reasoning = String(parsed?.reasoning ?? "").trim();
    return {
      ran: true,
      guessedCulprit,
      confidence,
      correct: namesMatch(guessedCulprit, culprit),
      reasoning,
    };
  } catch (error) {
    return { ...empty, error: error instanceof Error ? error.message : String(error) };
  }
}

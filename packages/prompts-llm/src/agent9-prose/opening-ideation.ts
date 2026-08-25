/**
 * agent9-prose/opening-ideation.ts — A2b, the distinctiveness engine pointed at the opening.
 *
 * WHY THIS EXISTS. A_72 §2 measured the thing this whole project turns on:
 *
 *     **9 goes to what is DISTINCTIVE. 8 goes to what is CORRECT.**
 *
 * Across 36 external reads `opening_hook` has never once been given a 9, and all seventeen of its 8s
 * are the same note — an inventory of props followed by a compliment: *"Body, letter opener, clock,
 * scratch on pendulum arm, wrong chime — strong setup."* The reader is not withholding a mark because
 * the opening is weak. They are describing an opening that contains the correct objects and nothing
 * they would remember.
 *
 * The pipeline has exactly ONE engine that manufactures distinctiveness, and it works: Agent 3b makes
 * one design-tier call, returns five candidate devices under an explicit `noveltyConstraints`, a judge
 * picks one, and the winner becomes a contract every downstream agent honours. `premise` holds 8 of
 * the 14 nines ever awarded. This is that engine, transplanted — which is what A_72 §10.1 specified
 * and nobody had built.
 *
 * WHAT IT MUST COMMIT, AND WHY IT IS NOT A SENTENCE. X94 rotated the opening STYLE per story and
 * produced the first non-`character-action` opening in the project's history; the hook mark did not
 * move (A_72 §4). A_73 §3 found A2a had done the same thing again with vocabulary. The reader's notes
 * are about WHAT IS IN THE SCENE — body, clock, weapon, prop — not about how sentence one is built.
 * So this commits a SITUATION: who is present, what is discovered, in what posture.
 *
 * COST. One design-tier call, ~$0.01–0.02 against a ~£1.10 run. The five candidates and the choice
 * come back in a single response rather than a second judging call, because a second call would
 * double the cost of the cheapest part of the pipeline to arbitrate five options a model has just
 * generated and ranked.
 *
 * FLAG: `AGENT9_OPENING_IDEATION`, default OFF. Falsification is stated in A_72 §10.1 and inherited
 * here — if this ships and `opening_hook` stays at 8 with a props inventory, §2's thesis is wrong and
 * the generation-model question reopens with real evidence behind it for the first time.
 */

import { RECENT_OPENING_SITUATIONS, OVERUSED_OPENING_WORDS } from "../constants/opening-corpus.js";

export const openingIdeationEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(env.AGENT9_OPENING_IDEATION ?? "");

/** Minimum archived openings worth diverging from. Below this, the instruction has no referent. */
const MIN_CORPUS = 6;

/**
 * The engine REFUSES to run without its corpus, and says so.
 *
 * `RECENT_OPENING_SITUATIONS` is generated from `stories/`, which is gitignored — so on a fresh
 * clone it is empty until `scripts/build-opening-corpus.mjs --write` is run where the archive lives.
 * Running ideation anyway would issue "diverge from these" with nothing after it, which is not a
 * weaker version of this engine: it is X94 and A2a again, a divergence instruction with no referent,
 * and it would burn a paid call to produce a candidate that cannot be better than chance.
 *
 * Loud, not silent — the whole point of A_71's read-path lesson.
 */
export const openingCorpusReady = (
  situations: readonly string[] = RECENT_OPENING_SITUATIONS,
): boolean => {
  if (situations.length >= MIN_CORPUS) return true;
  console.warn(
    `[Agent 9][A2b] opening ideation SKIPPED — the divergence corpus holds ${situations.length} ` +
      `opening(s), below the minimum of ${MIN_CORPUS}. Run \`node scripts/build-opening-corpus.mjs --write\` ` +
      `on a machine that has stories/ (it is gitignored). Diverging from an empty corpus is the defect ` +
      `this engine exists to avoid, so it does not run.`,
  );
  return false;
};

/** One candidate opening. Deliberately a SITUATION — no prose, no sentence shape. */
export interface OpeningSituation {
  /** One line: who is present, what is discovered, in what posture. */
  situation: string;
  /** What makes it unlike the archived openings — the model's own claim, used for review. */
  divergence: string;
}

export interface OpeningIdeationResult {
  chosen: OpeningSituation;
  candidates: OpeningSituation[];
  /** Candidates rejected by the deterministic distinctness filter, with the reason. */
  rejected: Array<{ situation: string; reason: string }>;
}

const CANDIDATE_COUNT = 5;

/**
 * The prompt. Mirrors Agent 3b's shape: N divergent candidates in one call, against an EXPLICIT list
 * of what to differ from, plus the avoidance vocabulary the corpus measured.
 */
export const buildOpeningIdeationPrompt = (args: {
  era: string;
  location: string;
  victimName: string;
  detectiveName: string;
  deviceSummary: string;
  situations?: readonly string[];
  overusedWords?: readonly string[];
}): { system: string; user: string } => {
  const priors = (args.situations ?? RECENT_OPENING_SITUATIONS).slice(-12);
  const avoid = (args.overusedWords ?? OVERUSED_OPENING_WORDS).slice(0, 24);

  const system = [
    "You design the OPENING SITUATION of a Golden Age detective novel — not its prose.",
    "",
    "A situation is three things and nothing else:",
    "  1. WHO is present at the top of chapter one",
    "  2. WHAT is discovered, or what is already known to have happened",
    "  3. In what POSTURE the scene finds them — what they are doing when the book opens",
    "",
    "You are not writing sentences. Do not write prose, dialogue, or descriptions.",
  ].join("\n");

  const user = [
    `SETTING: ${args.era}, ${args.location}.`,
    `VICTIM: ${args.victimName}.  INVESTIGATOR: ${args.detectiveName}.`,
    `THE MECHANISM OF THE CRIME (already fixed, do not change it): ${args.deviceSummary}`,
    "",
    "DIVERGE FROM THESE. Every book this pipeline has produced opens the same way, and a reader has",
    "said so about every one of them. Here are real openings from the archive:",
    "",
    ...priors.map((p, i) => `  [${i + 1}] ${p.slice(0, 320)}`),
    "",
    "Read them as SITUATIONS, not as sentences. Notice who is present, what is discovered, and what",
    "posture the scene finds them in — then propose openings that are not that.",
    "",
    avoid.length
      ? `These words appear in at least a third of those openings, so they are house style rather than choice — avoid them: ${avoid.join(", ")}.`
      : "",
    "",
    `Return exactly ${CANDIDATE_COUNT} candidate situations, ordered BEST FIRST, as JSON:`,
    '{ "candidates": [ { "situation": "...", "divergence": "..." } ] }',
    "",
    "Each `situation` is ONE line naming who is present, what is discovered, and in what posture.",
    "Each `divergence` says what makes it unlike the archived openings above.",
    "The mechanism of the crime is fixed — the opening must remain compatible with it.",
  ].filter(Boolean).join("\n");

  return { system, user };
};

/** Tolerant JSON extraction — the same problem `stripFences` solves for the rubric judge. */
export const parseOpeningIdeation = (content: string): OpeningSituation[] => {
  const fenced = /```(?:json)?\s*([\s\S]*?)```/.exec(content);
  const body = (fenced ? fenced[1]! : content).trim();
  const start = body.indexOf("{");
  if (start < 0) return [];
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < body.length; i += 1) {
    const ch = body[i]!;
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') inString = true;
    else if (ch === "{") depth += 1;
    else if (ch === "}") {
      depth -= 1;
      if (depth === 0) {
        try {
          const parsed = JSON.parse(body.slice(start, i + 1)) as { candidates?: OpeningSituation[] };
          return (parsed.candidates ?? [])
            .filter((c) => typeof c?.situation === "string" && c.situation.trim().length > 0)
            .map((c) => ({ situation: c.situation.trim(), divergence: String(c.divergence ?? "").trim() }));
        } catch {
          return [];
        }
      }
    }
  }
  return [];
};

/**
 * Choose the winner.
 *
 * The model returns its candidates best-first, and that ranking is kept — but it is CHECKED, because
 * "diverge from these" is exactly the instruction A_72 §4 measured a model complying with in letter
 * and not in substance. A candidate that leans on the archive's own vocabulary is rejected and the
 * next one taken; if every candidate fails, the top one is used anyway and the failure is reported
 * rather than hidden, so a probe can tell "the engine ran and the model ignored it" from "the engine
 * never ran".
 */
export const selectOpeningSituation = (
  candidates: OpeningSituation[],
  overused: readonly string[] = OVERUSED_OPENING_WORDS,
): OpeningIdeationResult | null => {
  if (candidates.length === 0) return null;
  const avoid = new Set(overused.slice(0, 24).map((w) => w.toLowerCase()));
  const rejected: Array<{ situation: string; reason: string }> = [];

  for (const candidate of candidates) {
    const words = (candidate.situation.toLowerCase().match(/[a-z][a-z'-]{3,}/g) ?? []);
    const hits = [...new Set(words.filter((w) => avoid.has(w)))];
    // Two or more house-style words is leaning on the archive; one may be unavoidable (e.g. "room").
    if (hits.length >= 2) {
      rejected.push({ situation: candidate.situation, reason: `house-style vocabulary: ${hits.join(", ")}` });
      continue;
    }
    return { chosen: candidate, candidates, rejected };
  }

  return { chosen: candidates[0]!, candidates, rejected };
};

/**
 * The block committed into chapter 1's prompt. Rendered ONLY for chapter 1 — this is a contract about
 * where the book starts, not a running instruction.
 */
export const buildOpeningSituationBlock = (situation: string): string =>
  [
    "",
    "## OPENING SITUATION (COMMITTED — chapter 1 only)",
    "",
    "Chapter one opens on this situation, chosen because it is unlike the openings this pipeline has",
    "produced before:",
    "",
    `  ${situation}`,
    "",
    "Write that scene. You choose the sentences, the order and the imagery — the SITUATION is fixed.",
    "Do not substitute the familiar opening of a detective novel (a named investigator arriving at a",
    "body in a room and cataloguing the objects around it) for the one above.",
  ].join("\n");

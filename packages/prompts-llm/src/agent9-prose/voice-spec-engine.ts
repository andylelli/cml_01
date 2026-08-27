/**
 * A_75 §6.1 (P1) — generate → judge → commit, for how a book SOUNDS.
 *
 * ── THE MECHANISM, COPIED FROM THE ONE THAT WORKS ────────────────────────────────────────────────
 *
 * A_72 §2.1 measured why `premise` earns 9s and nothing else does. Agent 3b generates several
 * candidates under an explicit `divergeFrom`, a judge picks one, and the winner is committed as a
 * constraint every downstream agent honours. One design-tier call. `premise` holds 7 of the 14 nines
 * ever awarded, and it is the only category with an engine.
 *
 * This is that engine, aimed at the sentence. It runs ONCE per story, before chapter 1, and its output
 * becomes a prompt block every chapter carries.
 *
 * ── WHY IT DIVERGES ON A NUMBER ──────────────────────────────────────────────────────────────────
 *
 * `divergeFrom` here is not a list of adjectives. It is the MEASURED mean sentence length of the last
 * twenty manuscripts (`VOICE_CORPUS`), and the generator is told which bands are occupied and asked to
 * land outside them. That is what makes the divergence checkable rather than aspirational — a
 * candidate whose mean sits 0.4 words from the last book is REJECTED by `validateVoiceSpec` before it
 * costs a judge call, and no amount of confident prose in the `syntacticHabit` field can rescue it.
 *
 * The corpus is stark: 20 books spanning 13.6 to 17.2 words per sentence, a full spread of 3.6 against
 * a WITHIN-book standard deviation of about 7.8. The entire between-book variation of everything this
 * pipeline has ever produced is under half of the variation inside any single one of those books.
 *
 * ── WHAT THIS DOES NOT CLAIM ─────────────────────────────────────────────────────────────────────
 *
 * A spec is not good prose, and conformance to it is not quality. §6.1 states the falsification before
 * the build: **conformance >= 0.8 with `prose` still at 6-7 across two external reads kills the
 * hypothesis**, and A_72's Tier 4 (the generation model) reopens with evidence instead of assumption.
 * The whole reason to build this rather than argue about it is that it can lose.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { VoiceSpec, VoiceSpecSummary } from "@cml/prose-guard";
import { validateVoiceSpec, VOICE_MEAN_MIN, VOICE_MEAN_MAX, VOICE_MEAN_MIN_GAP } from "@cml/prose-guard";

import { VOICE_CORPUS, VOICE_CORPUS_MEAN } from "../constants/voice-corpus.js";
import { resolveDesignModel } from "../utils/model-tiers.js";

const GENERATE_LABEL = "Agent9-VoiceSpec";
const JUDGE_LABEL = "Agent9-VoiceSpecJudge";

/** Read at CALL time — a module const freezes before dotenv, which this repo has paid for twice. */
export const isVoiceSpecEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  env.AGENT9_VOICE_SPEC === "true" || env.AGENT9_VOICE_SPEC === "1";

export interface VoiceSpecContext {
  runId?: string;
  projectId?: string;
  /** Title, setting and era — the spec should suit the book, not float free of it. */
  title?: string;
  settingSummary?: string;
  era?: string;
}

export interface VoiceSpecResult {
  ran: boolean;
  spec: VoiceSpec | null;
  /** Every candidate generated, with why it was kept or dropped. Telemetry, not decoration. */
  candidates: Array<{ spec: VoiceSpec; rejected: string[]; score?: number; note?: string }>;
  cost: number;
  durationMs: number;
  error?: string;
}

/** How many candidates to generate. Three is the smallest number a judge can rank meaningfully. */
export const VOICE_SPEC_CANDIDATES = 3;

// ── the divergence instruction ───────────────────────────────────────────────

/**
 * The occupied bands, stated as numbers. A generator told "be distinctive" produces the corpus mean;
 * a generator told "13.6, 14.3, 14.4 … 17.2 are taken, land outside them by at least 2.0" cannot.
 */
export const buildDivergenceBlock = (recent: ReadonlyArray<VoiceSpecSummary> = []): string => {
  const corpusMeans = VOICE_CORPUS.map((c) => c.mean);
  const recentMeans = recent.map((r) => r.mean);
  const all = [...corpusMeans, ...recentMeans].sort((a, b) => a - b);
  const occupied = all.map((m) => m.toFixed(1)).join(", ");
  const moves = recent.map((r) => `  - ${r.story}: ${r.signatureMove}`).filter(Boolean);

  return [
    "DIVERGE FROM THE CORPUS.",
    "",
    `The last ${VOICE_CORPUS.length} books this pipeline produced have these mean sentence lengths,`,
    "in words:",
    `  ${occupied}`,
    "",
    `They average ${VOICE_CORPUS_MEAN.toFixed(1)} words. Their WITHIN-book standard deviation is about`,
    "8 words — so the entire difference between these books is smaller than the variation inside any",
    "one of them. Every one of them reads the same way, and no reader has ever praised a sentence in",
    "any of them.",
    "",
    `Your mean MUST be at least ${VOICE_MEAN_MIN_GAP.toFixed(1)} words away from every number above,`,
    `and inside [${VOICE_MEAN_MIN}, ${VOICE_MEAN_MAX}]. A candidate that does not clear that gap is`,
    "rejected before it is read.",
    ...(moves.length ? ["", "Signature moves already used — pick a different one:", ...moves] : []),
  ].join("\n");
};

const SPEC_SHAPE = `{
  "sentenceLength": { "mean": <number>, "sd": <number, 3-12> },
  "syntacticHabit": "<one habit, in a writer's words>",
  "diction": "plain-anglo" | "latinate-formal" | "mixed-period" | "clipped-reportorial",
  "narrationDistance": "close-third-interior" | "cool-observer" | "wry-companion",
  "signatureMove": "<one recurring device this book returns to>",
  "avoid": ["<tic>", "<tic>"]
}`;

export const buildVoiceSpecPrompt = (
  ctx: VoiceSpecContext,
  recent: ReadonlyArray<VoiceSpecSummary> = [],
): { system: string; user: string } => ({
  system: [
    "You are a novelist deciding how one specific book will sound, before a word of it is written.",
    "",
    "You are not describing good prose in general. You are choosing a VOICE — a set of habits this",
    "book will keep for ten chapters and other books will not share. The choice is binding: every",
    "chapter is written to it and a script measures whether the book held it.",
    "",
    "A voice is made of a rhythm and a handful of habits, not of adjectives. 'Vivid' and 'atmospheric'",
    "are not voices. 'Sentences that run long and withhold the verb until the last clause' is.",
    "",
    `Return ${VOICE_SPEC_CANDIDATES} DISTINCT candidates as JSON: {"candidates": [ ... ]}, each of the shape`,
    SPEC_SHAPE,
    "",
    "The candidates must differ from EACH OTHER in mean sentence length by at least 2 words. Three",
    "variations on one rhythm is one candidate submitted three times.",
  ].join("\n"),
  user: [
    ctx.title ? `BOOK: ${ctx.title}` : "",
    ctx.era ? `ERA: ${ctx.era}` : "",
    ctx.settingSummary ? `SETTING: ${ctx.settingSummary}` : "",
    "",
    buildDivergenceBlock(recent),
    "",
    "The voice should suit THIS book — its setting, its era, its situation. A clipped reportorial",
    "voice and a wry companion voice are both legitimate; which one belongs here is the judgement",
    "you are being asked for.",
  ].filter(Boolean).join("\n"),
});

// ── parsing ──────────────────────────────────────────────────────────────────

const asStringList = (v: unknown): string[] =>
  Array.isArray(v) ? v.map((x) => String(x ?? "").trim()).filter(Boolean).slice(0, 6) : [];

const DICTIONS = new Set(["plain-anglo", "latinate-formal", "mixed-period", "clipped-reportorial"]);
const DISTANCES = new Set(["close-third-interior", "cool-observer", "wry-companion"]);

/**
 * Coerce one candidate into a spec. Enum fields fall back rather than throwing — a model that writes
 * "plain anglo-saxon" for the diction has made a formatting slip, and discarding an otherwise good
 * candidate for it would be the Agent 7 beat-enum defect repeated (coerce before validating).
 */
export const parseVoiceSpecCandidate = (raw: unknown): VoiceSpec | null => {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, any>;
  const len = o.sentenceLength ?? o.sentence_length ?? {};
  const mean = Number(len.mean);
  const sd = Number(len.sd);
  if (!Number.isFinite(mean)) return null;
  const normalise = (v: unknown) => String(v ?? "").trim().toLowerCase().replace(/[\s_]+/g, "-");
  const diction = normalise(o.diction);
  const distance = normalise(o.narrationDistance ?? o.narration_distance);
  return {
    sentenceLength: { mean, sd: Number.isFinite(sd) ? sd : 7 },
    syntacticHabit: String(o.syntacticHabit ?? o.syntactic_habit ?? "").trim(),
    diction: (DICTIONS.has(diction) ? diction : "mixed-period") as VoiceSpec["diction"],
    narrationDistance: (DISTANCES.has(distance) ? distance : "cool-observer") as VoiceSpec["narrationDistance"],
    signatureMove: String(o.signatureMove ?? o.signature_move ?? "").trim(),
    avoid: asStringList(o.avoid),
  };
};

const extractJson = (content: string): any => {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : {};
  }
};

// ── the judge ────────────────────────────────────────────────────────────────

export const buildVoiceSpecJudgePrompt = (
  candidates: ReadonlyArray<VoiceSpec>,
  ctx: VoiceSpecContext,
): { system: string; user: string } => ({
  system: [
    "You are choosing which of several voices a specific book should be written in.",
    "",
    "Judge on two things and nothing else:",
    "  1. DISTINCTIVENESS — would a reader who has read the other books notice this one sounds",
    "     different? A voice that is merely competent scores low here however well described.",
    "  2. WRITABILITY — can a writer hold this for ten chapters of a Golden Age mystery? A voice that",
    "     collapses the moment a clue has to be explained is not usable, however striking.",
    "",
    'Return JSON: {"winner": <index>, "score": <0-100>, "why": "<one sentence>"}.',
    "The winner is an INDEX into the list as given, counting from 0.",
  ].join("\n"),
  user: [
    ctx.title ? `BOOK: ${ctx.title}` : "",
    ctx.settingSummary ? `SETTING: ${ctx.settingSummary}` : "",
    "",
    "CANDIDATES:",
    ...candidates.map((c, i) => [
      `[${i}] ${c.sentenceLength.mean.toFixed(1)}±${c.sentenceLength.sd.toFixed(1)} words · ${c.diction} · ${c.narrationDistance}`,
      `    habit: ${c.syntacticHabit}`,
      `    signature: ${c.signatureMove}`,
    ].join("\n")),
  ].filter(Boolean).join("\n"),
});

// ── the engine ───────────────────────────────────────────────────────────────

/**
 * Generate, validate, judge, commit. Returns `ran: false` and a null spec on any failure — the caller
 * writes a chapter without a voice block, exactly as it does today. **A voice spec is a craft lever
 * and must never be able to stop a run**, which is the same reasoning B1 applied to geometry three
 * days before this: a check that can abort is an off switch with extra steps.
 */
export async function generateVoiceSpec(
  client: AzureOpenAIClient,
  ctx: VoiceSpecContext,
  recent: ReadonlyArray<VoiceSpecSummary> = [],
): Promise<VoiceSpecResult> {
  const started = Date.now();
  const tracker = client.getCostTracker();
  const costBefore =
    (tracker.getSummary().byAgent[GENERATE_LABEL] || 0) + (tracker.getSummary().byAgent[JUDGE_LABEL] || 0);
  const spend = () =>
    (tracker.getSummary().byAgent[GENERATE_LABEL] || 0)
    + (tracker.getSummary().byAgent[JUDGE_LABEL] || 0)
    - costBefore;

  const empty: VoiceSpecResult = { ran: false, spec: null, candidates: [], cost: 0, durationMs: 0 };

  try {
    const { system, user } = buildVoiceSpecPrompt(ctx, recent);
    const response = await client.chat({
      model: resolveDesignModel(),
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
      // Higher than the judge's 0.2 on purpose: this call exists to produce VARIETY, and the whole
      // finding it answers is that the pipeline converges on one voice.
      temperature: 0.9,
      jsonMode: true,
      logContext: { runId: ctx.runId || "unknown", projectId: ctx.projectId || "unknown", agent: GENERATE_LABEL },
    });

    const parsed = extractJson(response.content);
    const rawList: unknown[] = Array.isArray(parsed?.candidates)
      ? parsed.candidates
      : Array.isArray(parsed) ? parsed : [parsed];

    const candidates = rawList
      .map(parseVoiceSpecCandidate)
      .filter((s): s is VoiceSpec => s !== null)
      .map((spec) => ({ spec, rejected: validateVoiceSpec(spec, recent).problems }));

    const usable = candidates.filter((c) => c.rejected.length === 0);
    if (usable.length === 0) {
      return {
        ...empty,
        candidates,
        cost: spend(),
        durationMs: Date.now() - started,
        error: candidates.length
          ? `all ${candidates.length} candidate(s) rejected: ${candidates[0].rejected.join("; ")}`
          : "no parseable candidate",
      };
    }

    // One usable candidate needs no judge — paying for a ranking of one is the kind of cost this
    // project audits for.
    if (usable.length === 1) {
      usable[0].note = "only usable candidate — no judge call";
      return { ran: true, spec: usable[0].spec, candidates, cost: spend(), durationMs: Date.now() - started };
    }

    const judge = buildVoiceSpecJudgePrompt(usable.map((u) => u.spec), ctx);
    const verdict = await client.chat({
      model: resolveDesignModel(),
      messages: [{ role: "system", content: judge.system }, { role: "user", content: judge.user }],
      temperature: 0.2,
      jsonMode: true,
      logContext: { runId: ctx.runId || "unknown", projectId: ctx.projectId || "unknown", agent: JUDGE_LABEL },
    });

    const parsedVerdict = extractJson(verdict.content);
    const rawWinner = Number(parsedVerdict?.winner);
    // An out-of-range or missing index falls back to the FIRST usable candidate rather than throwing.
    // The judge improves the choice; it is not load-bearing for having one.
    const winner = Number.isInteger(rawWinner) && rawWinner >= 0 && rawWinner < usable.length ? rawWinner : 0;
    usable.forEach((u, i) => {
      u.note = i === winner
        ? `judge winner${parsedVerdict?.why ? `: ${String(parsedVerdict.why).slice(0, 160)}` : ""}`
        : "not selected";
      if (i === winner && Number.isFinite(Number(parsedVerdict?.score))) u.score = Number(parsedVerdict.score);
    });

    return { ran: true, spec: usable[winner].spec, candidates, cost: spend(), durationMs: Date.now() - started };
  } catch (error) {
    return {
      ...empty,
      cost: spend(),
      durationMs: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

// ── the block the writer sees ────────────────────────────────────────────────

/**
 * The committed spec, as an instruction. Deliberately short: A_72 measured that the prompt already
 * loses its craft blocks to budget pressure on late chapters, so a voice block that runs to a page
 * would be the first thing dropped from exactly the chapters it needs to reach.
 *
 * The mean is stated as a target with its spread, NOT as a rule to count words against. A model told
 * to hit 12.0 words per sentence writes twelve-word sentences and nothing else, which is a metronome
 * rather than a voice — hence the explicit instruction that the spread is part of the target.
 */
export const buildVoiceSpecBlock = (spec: VoiceSpec | null | undefined): string => {
  if (!spec) return "";
  return [
    "THIS BOOK'S VOICE (committed before chapter one; every chapter keeps it):",
    `  Rhythm: average about ${spec.sentenceLength.mean.toFixed(0)} words per sentence, and VARY widely`,
    `    around it — a spread of roughly ${spec.sentenceLength.sd.toFixed(0)} words. Long sentences and`,
    "    short ones, not a run of identical ones. The average is the target, not the shape.",
    `  Habit: ${spec.syntacticHabit}`,
    `  Diction: ${spec.diction.replace(/-/g, " ")}`,
    `  Distance: ${spec.narrationDistance.replace(/-/g, " ")}`,
    `  Signature: ${spec.signatureMove} — return to it, do not announce it.`,
    ...(spec.avoid.length ? [`  Avoid in this book: ${spec.avoid.join("; ")}`] : []),
  ].join("\n");
};

/** Reduce a committed spec for the next story's `divergeFrom`. */
export const summariseVoiceSpec = (story: string, spec: VoiceSpec): VoiceSpecSummary => ({
  story,
  mean: spec.sentenceLength.mean,
  diction: spec.diction,
  narrationDistance: spec.narrationDistance,
  signatureMove: spec.signatureMove,
});

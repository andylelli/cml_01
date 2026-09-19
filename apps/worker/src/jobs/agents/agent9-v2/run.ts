/**
 * PROSE ENGINE v2 — THE RUNNER (ANALYSIS_99 §10.1).
 *
 * ── WHAT THIS FILE IS, AND WHAT IT DELIBERATELY IS NOT ───────────────────────────────────────────
 *
 * It is the orchestration and nothing else: adapt the context into a contract, plan the segments,
 * call the writer k times, select, criticise, edit, gate, report. Every DECISION it makes lives in
 * `@cml/prose-engine`, which is pure and replayable over the archive — so this file has no rule of
 * its own to get wrong, and the 33,430 lines of v1 it replaces are mostly rules with nowhere to be
 * tested.
 *
 * It writes no prose. That is L1, it is asserted in the telemetry (`deterministic writes: 0`) rather
 * than trusted, and it is the single largest difference from v1, where ten deterministic passes
 * write sentences and A_84 traced every reader-named "generated line" to one of them.
 *
 * It never aborts after the first draft exists. That is L4, and its receipt is run 95041: ten
 * chapters, 13,928 words, four validation majors that were the case's own forged document dates, and
 * nothing saved.
 */

import {
  applyEditList,
  applyGate,
  anchorFindings,
  buildBookContract,
  buildCriticPrompt,
  buildEditorPrompt,
  buildTelemetryBlock,
  chooseDraft,
  fullParagraphs,
  indexChapters,
  collectCheckerFindings,
  continueInstruction,
  parseCriticFindings,
  parseEditList,
  parseWriterOutput,
  planSegments,
  priorChapters,
  revealOperation,
  scoreDraft,
  writerFormatInstruction,
  type BookContract,
  type ContractInput,
  type Draft,
  type EditOutcome,
  type Finding,
  type ProseChapterLike,
  type ScoredDraft,
} from "@cml/prose-engine";
import { humourBand } from "@cml/prompts-llm";
import type { ChatCapableClient } from "@cml/llm-client";

import type { OrchestratorContext } from "../shared.js";
import { hashContract, emptyCheckpoint, readCheckpoint, recordSegment, writeCheckpoint, type V2Checkpoint } from "./checkpoint.js";
import { resolveRole, roleLabel, type ResolvedRole, type RoleTelemetry } from "./roles.js";

/** The master switch. Read at call time (ADR-0004); anything but `v2` leaves v1 untouched. */
export const isProseEngineV2 = (env: NodeJS.ProcessEnv = process.env): boolean =>
  String(env.PROSE_ENGINE ?? "").trim().toLowerCase() === "v2";

/**
 * How many continuation calls one draft may use.
 *
 * The measured behaviour is one chapter per call, so the bound is the chapters owed plus a little
 * slack for a round that delivers two — not a number chosen for its own sake. It is a BOUND, not a
 * plan: the no-progress guard normally stops first, and a model that writes the book in one call
 * never enters the loop.
 */
const maxContinuations = (chaptersInSegment: number): number => chaptersInSegment + 2;

/** How many drafts per segment. Three is the design's default; one makes v2 a single-draft engine. */
const draftCount = (): number => {
  const raw = Number((process.env.PROSE_V2_DRAFTS ?? "").trim());
  return Number.isFinite(raw) && raw >= 1 && raw <= 5 ? Math.floor(raw) : 3;
};

/** `PROSE_V2_DRY=1` builds every prompt and makes no call — §10.13's dry run. */
const isDryRun = (): boolean => /^(1|true|yes|on)$/i.test(String(process.env.PROSE_V2_DRY ?? "").trim());

const asArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

/** The context, as the narrow structural input the pure package reads. */
export const buildContractInput = (ctx: OrchestratorContext): ContractInput => ({
  cml: ctx.cml ?? {},
  clues: (ctx.clues ?? null) as ContractInput["clues"],
  outline: (ctx.narrative ?? null) as ContractInput["outline"],
  cast: (ctx.cast?.cast ?? null) as ContractInput["cast"],
  profiles: (ctx.characterProfiles ?? null) as ContractInput["profiles"],
  world: ctx.worldDocument,
  locations: ctx.locationProfiles,
  temporal: ctx.temporalContext,
  setting: ctx.setting,
  lockedFacts: (ctx.lockedFactRegistry ?? []) as ReadonlyArray<Record<string, unknown>>,
  humourLevel: (ctx.inputs as { humourLevel?: string }).humourLevel,
  primaryAxis: ctx.primaryAxis,
  targetLength: ctx.inputs.targetLength,
});

const chat = async (
  role: ResolvedRole,
  args: { system: string; user: string; maxTokens: number; label: string; ctx: OrchestratorContext },
): Promise<string> => {
  const response = await role.client.chat({
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: args.user },
    ],
    ...(role.model ? { model: role.model } : {}),
    ...(role.supportsTemperature ? { temperature: 0.7 } : {}),
    maxTokens: args.maxTokens,
    logContext: {
      runId: ctxRunId(args.ctx),
      projectId: args.ctx.projectId ?? "",
      agent: args.label,
      retryAttempt: 1,
    },
  });
  return String(response?.content ?? "");
};

const ctxRunId = (ctx: OrchestratorContext): string => String(ctx.runId ?? "");

/** The book so far, verbatim. Never a summary — that is the whole of v2's second move. */
const bookSoFar = (chapters: ProseChapterLike[], numbers: number[]): string => {
  if (chapters.length === 0) return "";
  const lines: string[] = ["THE BOOK SO FAR — every word of it, for continuity and for voice:"];
  chapters.forEach((chapter, index) => {
    lines.push("");
    lines.push(`=== CHAPTER ${chapter.number ?? numbers[index]}: ${chapter.title} ===`);
    for (const paragraph of chapter.paragraphs ?? []) lines.push(paragraph);
  });
  return lines.join("\n");
};

/** One chapter's contract, as the writer reads it. Countable obligations, no prohibitions beyond the withheld. */
export const renderSceneContract = (contract: BookContract, chapter: number): string => {
  const scene = contract.scenes.find((s) => s.chapter === chapter);
  if (!scene) return "";
  const lines: string[] = [];
  lines.push(`=== CHAPTER ${chapter}: ${scene.title} ===`);
  lines.push(`  This chapter is the ${scene.role.replace(/_/g, " ")}.`);
  if (scene.present.length > 0) lines.push(`  On the page: ${scene.present.join(", ")}.`);
  if (scene.location) lines.push(`  Where: ${scene.location}${scene.timeOfDay ? `, ${scene.timeOfDay}` : ""}.`);
  if (scene.timeWindow) lines.push(`  The clock: between ${scene.timeWindow.from} and ${scene.timeWindow.to}.`);
  for (const surface of scene.mustSurface) {
    lines.push(`  A reader must be able to use, from this chapter: ${surface.observable || surface.keyTerms.join(", ")}`);
    if (surface.unlockedBy) lines.push(`    ${surface.unlockedBy.name} reads it because they know ${surface.unlockedBy.skill}.`);
  }
  for (const ref of scene.mayMention) {
    lines.push(`  Already on the page from chapter ${ref.firstChapter} — refer to it, do not stage it again: ${ref.keyTerms.slice(0, 5).join(", ")}`);
  }
  for (const withheld of scene.mustNotReveal) {
    if (withheld.what === "culprit") lines.push(`  The culprit is named in chapter ${withheld.until}.`);
    else if (withheld.what === "mechanism") lines.push(`  How the trick worked is shown in chapter ${withheld.until}.`);
  }
  for (const elimination of scene.eliminationsAllowed) {
    const closure = chapter > contract.roles.reveal;
    lines.push(
      closure
        ? `  ${elimination.name} is already cleared by the arrest: give them one human beat, and settle the rest in a clause.`
        : `  ${elimination.name} is cleared here — ${elimination.method} — shown, and carrying one human beat.`,
    );
  }
  if (scene.job) {
    for (const [field, value] of Object.entries(scene.job)) {
      if (field === "beat" || typeof value !== "string") continue;
      lines.push(`  ${field}: ${value}`);
    }
  }
  if (scene.beats.wit) {
    const shapes = scene.beats.wit.shapes.map((s) => `${s.shape.replace(/_/g, " ")} — ${s.name}`).join("; ");
    lines.push(`  Wit beat: ${scene.beats.wit.name}, ${scene.beats.wit.style.replace(/_/g, " ")}. ${shapes}`);
  }
  if (scene.beats.depth) {
    lines.push(`  One thing about ${scene.beats.depth.name}, shown as an action and never explained: ${scene.beats.depth.trait}`);
  }
  if (scene.aftermath) {
    lines.push(`  Opens on the settled outcome: ${scene.aftermath.outcome}.`);
    if (scene.aftermath.survivors.length > 0) {
      lines.push(`  Two survivors with one concrete change each: ${scene.aftermath.survivors.join(", ")}.`);
    }
    if (scene.aftermath.consequenceFor) lines.push(`  Whose life this shows changed: ${scene.aftermath.consequenceFor}.`);
    if (scene.aftermath.repairTarget) lines.push(`  One thing outside a person put right: ${scene.aftermath.repairTarget}.`);
  }
  /**
   * The two operations the first four v2 books missed, restated where the writing happens. The
   * brief says both once for the whole book; a continuation writing chapter 9 has that brief twenty
   * thousand tokens behind it and this contract directly in front. Em-dashes proved the brief is
   * read; these two are the ones that need saying twice.
   */
  if (scene.role === "reveal") lines.push(`  ${revealOperation(contract)}`);
  lines.push(
    `  At least ${fullParagraphs(scene.words.preferred)} paragraphs here run to four sentences or more, for about ${scene.words.preferred} words.`,
  );
  return lines.join("\n");
};

const WRITER_SYSTEM =
  "You are writing a Golden Age detective novella. Everything true about the case is given to you; " +
  "your work is the prose. Write chapters, in order, in the format the instruction names.";

export interface V2Result {
  chapters: ProseChapterLike[];
  contract: BookContract;
  telemetry: string[];
  ship: boolean;
  stops: string[];
}

/**
 * Generate a book. Returns the chapters and the report; the caller owns `ctx.prose` and the artifact,
 * so this function can be exercised by a harness without a pipeline.
 */
export const generateBookV2 = async (ctx: OrchestratorContext): Promise<V2Result> => {
  const started = Date.now();
  const contract = buildBookContract(buildContractInput(ctx));
  const azure = ctx.client as unknown as ChatCapableClient;
  /**
   * The alternate provider MUST share the run's logger and cost tracker, or its calls are absent
   * from `logs/llm.jsonl` and its spend is invisible — the defect `polish-provider.ts` documents
   * from its own first cut.
   */
  const telemetryWiring = {
    logger: (ctx as unknown as { runLogger?: RoleTelemetry["logger"] }).runLogger,
    costTracker:
      typeof (ctx.client as { getCostTracker?: () => unknown }).getCostTracker === "function"
        ? ctx.client.getCostTracker()
        : undefined,
  };
  const writer = resolveRole("writer", azure, telemetryWiring);
  const critic = resolveRole("critic", azure, telemetryWiring);
  const editor = resolveRole("editor", azure, telemetryWiring);

  const plan = planSegments(contract, writer.maxOutputTokens);
  const k = draftCount();
  const band = humourBand((ctx.inputs as { humourLevel?: string }).humourLevel);

  const contractHash = hashContract({
    chapters: contract.book.chapters,
    reveal: contract.roles.reveal,
    aftermath: contract.roles.aftermath,
    clueIds: contract.scenes.flatMap((s) => s.mustSurface.map((m) => m.id)),
  });
  const checkpointPath =
    String((ctx.inputs as { agent9CheckpointPath?: string }).agent9CheckpointPath ?? "").trim() ||
    `${ctx.workerAppRoot}/logs/agent9v2-checkpoint-${ctx.projectId ?? ctx.runId}.json`;
  let checkpoint: V2Checkpoint =
    readCheckpoint(checkpointPath, contractHash) ?? emptyCheckpoint(ctx.projectId ?? "", ctxRunId(ctx), contractHash);

  const written: ProseChapterLike[] = [];
  const writtenNumbers: number[] = [];
  const selections: Array<{ segment: number; scored: ScoredDraft[]; chosen: ScoredDraft | null }> = [];

  /**
   * A checkpointed segment is reusable only if it is COMPLETE.
   *
   * MEASURED 2026-09-18: a run whose writer stopped after chapter 1 recorded segment 0 as done with
   * one chapter of ten, and every later run on that project restored it and never called the writer
   * at all. A truncated book became permanent, silently, and the telemetry said "restored from the
   * checkpoint" as though that were good news. The checkpoint's job is to avoid paying twice for
   * work that FINISHED; a segment missing nine of its chapters did not finish.
   *
   * This also repairs checkpoints written before the fix: they are simply not reused.
   */
  const reusable = (index: number, expected: number[]): ProseChapterLike[] | null => {
    const stored = checkpoint.segments.find((s) => s.index === index && s.chosen !== null);
    if (!stored) return null;
    const chosen = stored.drafts.find((d) => d.attempt === stored.chosen);
    const chapters = chosen?.chapters ?? [];
    return chapters.length === expected.length ? chapters : null;
  };

  for (const segment of plan.segments) {
    // A resumed run skips what the checkpoint already accepted IN FULL.
    const restored = reusable(segment.index, segment.chapters);
    if (restored) {
      ctx.warnings.push(
        `[Agent 9 v2] segment ${segment.index} restored from the checkpoint (${restored.length} chapter(s))`,
      );
      written.push(...restored);
      writtenNumbers.push(...segment.chapters);
      continue;
    }
    if (checkpoint.segments.some((s) => s.index === segment.index && s.chosen !== null)) {
      ctx.warnings.push(
        `[Agent 9 v2] segment ${segment.index} was checkpointed INCOMPLETE and is being rewritten`,
      );
    }

    const contracts = segment.chapters.map((c) => renderSceneContract(contract, c)).join("\n\n");
    const user = [
      contract.bible.text,
      "",
      "## THE BRIEF",
      contract.brief.text,
      "",
      "## THE CHAPTERS TO WRITE",
      contracts,
      "",
      bookSoFar(written, writtenNumbers),
      "",
      writerFormatInstruction(segment.chapters),
    ].join("\n");

    ctx.reportProgress?.(
      "prose",
      `Writing chapters ${segment.chapters[0]}-${segment.chapters[segment.chapters.length - 1]} (${k} drafts)...`,
      60 + Math.round((30 * segment.index) / Math.max(1, plan.segments.length)),
    );

    let drafts: Draft[] = [];
    if (isDryRun()) {
      ctx.warnings.push(
        `[Agent 9 v2] DRY RUN — segment ${segment.index}: prompt ${Math.ceil(user.length / 4)} tokens, ` +
          `${segment.chapters.length} chapter(s), ${k} draft(s) would be requested`,
      );
      continue;
    }

    drafts = await Promise.all(
      Array.from({ length: k }, async (_unused, index) => {
        const attempt = index + 1;
        try {
          const raw = await chat(writer, {
            system: WRITER_SYSTEM,
            user,
            maxTokens: writer.maxOutputTokens,
            label: roleLabel("writer", `S${segment.index}-D${attempt}`),
            ctx,
          });
          let draft = parseWriterOutput(raw, segment.chapters, segment.index, attempt);
          // An unfinished segment is CONTINUED, never redrafted: the chapters that finished are paid
          // for, and the continuation carries the whole book so far, so the voice is one voice.
          //
          // ── WHY THIS IS A LOOP AND NOT AN `if` ──────────────────────────────────────────────────
          //
          // It was an `if`, on the assumption that a model stops mid-book only when it runs out of
          // output tokens, so one continuation finishes the job.
          //
          // MEASURED 2026-09-18, seed 50862, azure:gpt-4.1 with a 32,768-token cap and all ten
          // chapters owed: the first call returned CHAPTER 1 and stopped — about 1,300 tokens, 4% of
          // the cap. It was not truncated. It wrote a chapter, the way the contract describes a
          // chapter, and considered the turn done. The single continuation bought chapter 2, and the
          // book SHIPPED AT 2 OF 10 — 1,964 words against the v1 arm's 8,965.
          //
          // The model writes A CHAPTER per call however many are owed, so the continuation runs
          // until the chapters owed are delivered. `truncated` is no longer consulted: the real
          // condition was always "chapters are missing", and reading a truncation flag instead is
          // what made a stopped model look like a finished one.
          let rounds = 0;
          while (draft.missing.length > 0 && draft.chapters.length > 0 && rounds < maxContinuations(segment.chapters.length)) {
            rounds += 1;
            const owed = draft.missing.length;
            const accepted = segment.chapters.filter((c) => !draft.missing.includes(c));
            const continued = await chat(writer, {
              system: WRITER_SYSTEM,
              user: [
                user,
                "",
                bookSoFar(draft.chapters, accepted),
                "",
                continueInstruction(accepted, draft.missing),
              ].join("\n"),
              maxTokens: writer.maxOutputTokens,
              label: roleLabel("writer", `S${segment.index}-D${attempt}-continue${rounds}`),
              ctx,
            });
            const rest = parseWriterOutput(continued, draft.missing, segment.index, attempt);
            draft = {
              ...draft,
              chapters: [...draft.chapters, ...rest.chapters],
              missing: rest.missing,
              truncated: rest.missing.length > 0,
            };
            // NO PROGRESS: a continuation that delivered nothing will not deliver anything next time
            // either, and every round re-sends the whole book. Stop, and let the selector and the
            // gate report a short draft rather than paying for the same refusal ten times.
            if (draft.missing.length >= owed) {
              ctx.warnings.push(
                `[Agent 9 v2] segment ${segment.index} draft ${attempt}: continuation ${rounds} added ` +
                  `no chapter; stopping with ${draft.missing.length} of ${segment.chapters.length} unwritten`,
              );
              break;
            }
          }
          if (rounds > 0) {
            ctx.warnings.push(
              `[Agent 9 v2] segment ${segment.index} draft ${attempt}: ${draft.chapters.length} chapter(s) ` +
                `in 1 + ${rounds} call(s)` + (draft.missing.length > 0 ? `, ${draft.missing.length} unwritten` : ""),
            );
          }
          return draft;
        } catch (error) {
          ctx.warnings.push(
            `[Agent 9 v2] draft ${attempt} of segment ${segment.index} failed: ${(error as Error).message}`,
          );
          return { segment: segment.index, attempt, chapters: [], truncated: true, missing: [...segment.chapters] };
        }
      }),
    );

    const scored: ScoredDraft[] = drafts.map((draft) => ({
      draft,
      score: scoreDraft(draft, contract, segment.chapters, {
        witTargetPer10k: band.targetPer10k,
        clueDistribution: (ctx.clues ?? undefined) as { clues?: unknown[] } | undefined,
      }),
    }));
    const chosen = chooseDraft(scored);
    selections.push({ segment: segment.index, scored, chosen });

    if (!chosen) {
      ctx.warnings.push(`[Agent 9 v2] segment ${segment.index} produced no usable draft`);
      continue;
    }
    written.push(...chosen.draft.chapters);
    // The numbers a draft DELIVERED, not the first N of the segment: a writer that skipped chapter 3
    // and wrote 4 would otherwise have chapter 4's prose filed under chapter 3, and every downstream
    // check — the clue audit, the reveal gate, the editor's anchors — would read the wrong page.
    writtenNumbers.push(...segment.chapters.filter((c) => !chosen.draft.missing.includes(c)));
    // A segment is checkpointed only when it is COMPLETE; see `reusable` above for what an
    // incomplete one cost.
    if (chosen.draft.missing.length === 0) {
      checkpoint = recordSegment(checkpoint, segment, scored.map((s) => ({ draft: s.draft, score: s.score })), chosen.draft.attempt, chosen.draft.chapters);
      writeCheckpoint(checkpointPath, checkpoint);
    } else {
      ctx.warnings.push(
        `[Agent 9 v2] segment ${segment.index} NOT checkpointed: ${chosen.draft.missing.length} of ` +
          `${segment.chapters.length} chapter(s) unwritten, so a later run rewrites it rather than inheriting it`,
      );
    }
  }

  const expected = plan.segments.flatMap((s) => s.chapters);

  // ── findings ───────────────────────────────────────────────────────────────────────────────────
  const checkerFindings = collectCheckerFindings(written, contract, expected, {
    clueDistribution: (ctx.clues ?? undefined) as { clues?: unknown[] } | undefined,
  });
  let criticFindings: Finding[] = [];
  let criticMalformed = 0;
  if (!isDryRun() && written.length > 0) {
    try {
      const raw = await chat(critic, {
        system: "You find defects in a finished novella and quote them. You never write prose.",
        user: buildCriticPrompt({ chapters: written, core: contract, expected }),
        // The critic reads a whole book and answers for every chapter; the editor gets 4,000 for ONE
        // chapter. Four critic findings failed to anchor on the first full run and truncation was a
        // candidate cause that nothing had separated from bad quoting. Cheap to rule out.
        maxTokens: 6_000,
        label: roleLabel("critic"),
        ctx,
      });
      const parsed = parseCriticFindings(raw);
      criticFindings = parsed.findings;
      criticMalformed = parsed.malformed;
    } catch (error) {
      ctx.warnings.push(`[Agent 9 v2] the critic pass failed: ${(error as Error).message} — the checkers stand alone`);
    }
  }

  const byChapter = indexChapters(written, expected);
  const { anchored, discarded } = anchorFindings([...checkerFindings, ...criticFindings], byChapter);

  // ── edits: two rounds, the second for fair play and defects only ───────────────────────────────
  const editOutcomes: EditOutcome[] = [];
  const lockedValues = ((ctx.lockedFactRegistry ?? []) as Array<{ value?: unknown }>)
    .map((f) => String(f?.value ?? "").trim())
    .filter(Boolean);
  const castNames = asArray((ctx.cast?.cast as { characters?: unknown[] } | undefined)?.characters)
    .map((c) => String((c as { name?: unknown })?.name ?? "").trim())
    .filter(Boolean);

  let standing = anchored;
  for (const round of [1, 2]) {
    if (isDryRun() || standing.length === 0) break;
    // A `report` finding never reaches an editor: its repair is one the guards revert, so asking
    // costs a call per chapter and buys a rollback. It stays in `standing` and reaches the gate's
    // warnings, where a human can see it.
    const repairable = standing.filter((f) => f.severity !== "report");
    const forThisRound = round === 1 ? repairable : repairable.filter((f) => f.severity !== "craft");
    if (forThisRound.length === 0) break;
    const nextStanding: Finding[] = standing.filter((f) => !forThisRound.includes(f));

    for (const [chapter, chapterText] of byChapter) {
      const findings = forThisRound.filter((f) => f.chapter === chapter);
      if (findings.length === 0) continue;
      try {
        const raw = await chat(editor, {
          system: "You repair specific defects in one chapter and return an edit list. You never rewrite the chapter.",
          user: buildEditorPrompt({
            chapter: chapterText,
            chapterNumber: chapter,
            findings,
            scene: contract.scenes.find((s) => s.chapter === chapter),
          }),
          maxTokens: 4_000,
          label: roleLabel("editor", `Ch${chapter}-R${round}`),
          ctx,
        });
        const { chapter: edited, outcome } = applyEditList(chapterText, parseEditList(raw), {
          scene: contract.scenes.find((s) => s.chapter === chapter),
          lockedValues,
          castNames,
          findings,
        });
        byChapter.set(chapter, edited);
        // Write back by IDENTITY, not by position: `written` is missing any chapter the writer did
        // not deliver, so the index of a chapter number in `expected` is not its index in `written`.
        const index = written.findIndex((c) => c === chapterText);
        if (index >= 0) written[index] = edited;
        editOutcomes.push(outcome);
        nextStanding.push(...outcome.unresolved);
      } catch (error) {
        ctx.warnings.push(`[Agent 9 v2] the editor failed on chapter ${chapter}: ${(error as Error).message}`);
        nextStanding.push(...findings);
      }
    }
    standing = nextStanding;
  }

  // ── the gate: two fair-play stops, everything else a warning ───────────────────────────────────
  const verdict = applyGate({
    chapters: written,
    core: contract,
    expected,
    findings: standing,
    deterministicWrites: 0,
  });

  const costByRole: Record<string, number> = {};
  try {
    const summary = (ctx.client as { getCostTracker?: () => { getSummary: () => { byAgent?: Record<string, number> } } })
      .getCostTracker?.()
      ?.getSummary();
    for (const [agent, usd] of Object.entries(summary?.byAgent ?? {})) {
      if (agent.startsWith("Agent9v2-")) costByRole[agent.replace("Agent9v2-", "")] = usd;
    }
  } catch {
    // Telemetry must never cost a book.
  }

  const telemetry = buildTelemetryBlock({
    contract,
    plan,
    selections,
    findings: { anchored, discarded, criticMalformed },
    edits: editOutcomes,
    deterministicWrites: 0,
    costByRole,
    wallMs: Date.now() - started,
  });
  for (const warning of verdict.warnings) telemetry.push(`[Agent 9 v2] WARNING ${warning}`);
  for (const stop of verdict.stops) telemetry.push(`[Agent 9 v2] STOP ${stop}`);

  checkpoint = { ...checkpoint, findings: { anchored, discarded }, edits: editOutcomes };
  writeCheckpoint(checkpointPath, checkpoint);

  return { chapters: written, contract, telemetry, ship: verdict.ship, stops: verdict.stops };
};

/**
 * The stage entry point. Writes `ctx.prose` in the SAME shape v1 does (L10), so story output, the
 * rubric scorer, the UI and the ledger read it unchanged; the v2 metadata is additive.
 */
export const runProseEngineV2 = async (ctx: OrchestratorContext): Promise<void> => {
  const started = Date.now();
  const result = await generateBookV2(ctx);
  for (const line of result.telemetry) ctx.warnings.push(line);

  const castNames = asArray((ctx.cast?.cast as { characters?: unknown[] } | undefined)?.characters)
    .map((c) => String((c as { name?: unknown })?.name ?? "").trim())
    .filter(Boolean);

  ctx.prose = {
    status: "final",
    chapters: result.chapters.map((c) => ({ title: c.title, summary: c.summary, paragraphs: c.paragraphs })),
    cast: castNames,
    cost: 0,
    durationMs: Date.now() - started,
    ...({ engine: "v2", writer: (process.env.PROSE_V2_WRITER ?? "azure:gpt-4.1").trim() } as Record<string, unknown>),
  } as never;

  if (!result.ship) {
    // The two fair-play stops. Everything else shipped with a warning, which is L4.
    ctx.errors.push(...result.stops.map((s) => `[Agent 9 v2] ${s}`));
  }
};

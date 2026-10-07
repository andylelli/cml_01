import type { PipelineStep } from "../components/pipelineTypes";
import type { RunEvent } from "../components/types";

/**
 * RUN TIMELINE — events in, progress out. Pure, and therefore testable and shareable.
 *
 * Both functions lived inside WorkshopView, which meant the consumer views could not show a run's
 * progress at all: after pressing Generate a user saw a spinner and the word "running", while the
 * operator console two clicks away had a fourteen-stage breakdown. Moving them here is what lets
 * CaseView show the same thing in the reader's language.
 *
 * The API stores an event's stage and message only — the worker's own `percentage` is dropped in
 * server.ts — so every number the bar shows comes from STAGE_END below.
 */

/**
 * Where each stage ENDS, as a percentage of the run's wall-clock time.
 *
 * MEASURED 2026-10-07 from the LLM-call timestamps of the three latest full v2 runs
 * (logs/llm.jsonl: mystery-1790896091454, -1790960614933, -1790962241800; 14, 27 and 24 minutes).
 * The previous table put the outline at 95%, where a run is about a THIRD of the way through:
 * chapter writing is 46–62% of the wall clock and the critic/editor/scoring tail another 5–16%,
 * so the bar sat at 96% for the last two-thirds of every run.
 */
export const STAGE_END = {
  started: 1,
  setting: 2,
  cast: 3,
  background: 4,
  hardLogic: 6,
  cml: 10,
  novelty: 11,
  clues: 14,
  fairplay: 16,
  profiles: 19,
  locations: 24,
  temporal: 26,
  world: 30,
  outline: 34,
  /** The last chapter is written; the critic and editor follow, then the rubric scorer. */
  chapters: 90,
  prose: 91,
  editing: 91,
  scoring: 98,
  complete: 100,
} as const;

/**
 * Chapters do not take equal time: each carries the book so far in its prompt, so chapter 10 takes
 * about three times as long as chapter 1. Measured cumulative writer time after a fraction `x` of
 * the chapters is close to x^1.7 (x = 0.3: 0.125 and 0.129 measured, 0.129 modelled; x = 0.5: 0.30
 * and 0.31 measured, 0.31 modelled).
 */
const CHAPTER_TIME_EXPONENT = 1.7;

export const chapterPercent = (chaptersDone: number, total: number): number => {
  const x = Math.min(1, Math.max(0, chaptersDone / Math.max(1, total)));
  return Math.round(STAGE_END.outline + (STAGE_END.chapters - STAGE_END.outline) * x ** CHAPTER_TIME_EXPONENT);
};

/**
 * Chapters finished, and the total when the message carries one. v2 says "Writing chapters 3-3
 * (3 drafts)..." at the START of a segment, so its first chapter is not done yet; v1 says
 * "Generating chapter 3/10..." and then "Chapter 3/10 complete".
 */
const parseChapterProgress = (message: string): { done: number; total?: number } | null => {
  let m = /writing chapters (\d+)-(\d+)(?: of (\d+))?/.exec(message);
  if (m) return { done: Number(m[1]) - 1, total: m[3] ? Number(m[3]) : undefined };
  m = /chapter (\d+)\/(\d+) (?:complete|validated)/.exec(message);
  if (m) return { done: Number(m[1]), total: Number(m[2]) };
  m = /chapter (\d+)(?:\/| of )(\d+)/.exec(message);
  if (m) return { done: Number(m[1]) - 1, total: Number(m[2]) };
  return null;
};

/** What earlier events tell a later one: the outline's scene count is the v2 chapter total. */
export interface ProgressContext {
  chapterTotal?: number;
}

export const progressPercentFromEvent = (
  event: { step: string; message: string },
  context: ProgressContext = {},
): number | null => {
  const step = event.step.toLowerCase();
  const message = event.message.toLowerCase();
  const E = STAGE_END;

  switch (step) {
    case "pipeline_started":
    case "run_started":
      return E.started;

    // ── Setting (agent1) ────────────────────────────────────────────────────
    case "setting_done":
      return E.setting;
    case "setting":
      return message.includes("refined") ? E.setting : E.started;

    // ── Cast (agent2) ───────────────────────────────────────────────────────
    case "cast_done":
      return E.cast;
    case "cast":
      return message.includes("designed") ? E.cast : E.setting;

    // ── Background Context (agent2e) ─────────────────────────────────────────
    case "background_context_done":
      return E.background;
    case "background-context":
      return message.includes("generated") ? E.background : E.cast;

    // ── Hard Logic Devices (agent3b) ─────────────────────────────────────────
    case "hard_logic_devices_done":
      return E.hardLogic;
    case "hard_logic_devices":
      return message.includes("generated") ? E.hardLogic : E.background;

    // ── CML (agent3 + optional agent4 revision) ───────────────────────────────
    case "cml_done":
      return E.cml;
    case "cml":
      if (message.includes("regenerating")) return E.cml - 1;
      if (message.includes("validated") || message.includes("generated")) return E.cml;
      return E.hardLogic;

    // ── Novelty Audit (agent8) ────────────────────────────────────────────────
    case "novelty_audit_done":
      return E.novelty;
    case "novelty":
      if (message.includes("skipped")) return E.novelty;
      return message.includes("check:") ? E.novelty : E.cml;

    // ── Clues (agent5) ────────────────────────────────────────────────────────
    case "clues_done":
      return E.clues;
    case "clues":
      if (message.includes("regenerating")) return E.clues - 1;
      return message.includes("distributed") ? E.clues : E.novelty;

    // ── Fair-play (agent6) ────────────────────────────────────────────────────
    case "fair_play_report_done":
      return E.fairplay;
    case "fairplay":
      // "Blind reader simulation: PASS" is the last fair-play event; "Fair play audit: pass" precedes it.
      if (message.includes("simulation:")) return E.fairplay;
      if (message.includes("audit:") || message.includes("blind")) return E.fairplay - 1;
      return E.clues;

    // ── Character Profiles (agent2b) ──────────────────────────────────────────
    case "character_profiles_done":
      return E.profiles;
    case "profiles":
      return message.includes("generated") ? E.profiles : E.fairplay;

    // ── Location Profiles (agent2c) ───────────────────────────────────────────
    case "location_profiles_done":
      return E.locations;
    case "location-profiles":
      return message.includes("generated") ? E.locations : E.profiles;

    // ── Temporal Context (agent2d) ────────────────────────────────────────────
    case "temporal_context_done":
      return E.temporal;
    case "temporal-context":
      return message.includes("generated") ? E.temporal : E.locations;

    // ── World Builder (agent65) ───────────────────────────────────────────────
    case "world_builder_done":
      return E.world;
    case "world-builder":
      return message.includes("complete") ? E.world : E.temporal;

    // ── Narrative Outline (agent7, then 7.5 geometry) ─────────────────────────
    case "outline_done":
      return E.outline;
    case "narrative":
      if (message.includes("scenes") || message.includes("structured") || message.includes("geometry")) return E.outline - 1;
      return E.world;

    // ── Prose (agent9) ────────────────────────────────────────────────────────
    case "prose_done":
      return E.prose;
    case "prose": {
      if (message.includes("prose generated")) return E.prose;
      const chapters = parseChapterProgress(message);
      const total = chapters?.total ?? context.chapterTotal;
      if (chapters && total) return chapterPercent(chapters.done, total);
      return E.outline;
    }

    // ── Critic + editor (agent9 v2) ───────────────────────────────────────────
    case "editing":
      return E.editing;

    // ── Rubric scoring (finalize.ts), and v1's post-prose validation gate ────────
    case "scoring":
      return E.scoring;
    case "validation":
      return message.includes("passed") || message.includes("auto-fix") || message.includes("encoding") ? E.scoring : E.prose + 1;

    // ── Complete ──────────────────────────────────────────────────────────────
    case "pipeline_complete":
    case "run_finished":
    case "complete":
      return E.complete;

    default:
      return null;
  }
};

/**
 * The stages the tick list shows, in pipeline order (mystery-orchestrator.ts).
 *
 * `rank` is the order a stage can START in. Profiles, locations and the period share one rank:
 * with AGENT_PROFILES_PARALLEL they run at once (pipeline/stages.ts runProfileStages), so seeing a
 * locations event says nothing about whether the character profiles have finished.
 *
 * `end` is the STAGE_END milestone a stage's own finishing message reaches; a stage with no
 * finishing message of its own (prose in v2, editing, scoring) finishes when a later rank starts.
 */
const STAGES: readonly {
  id: string;
  label: string;
  doneEvent: string;
  runningStage: string;
  rank: number;
  end?: number;
}[] = [
  { id: "setting",           label: "Setting",        doneEvent: "setting",            runningStage: "setting",            rank: 0,  end: STAGE_END.setting },
  { id: "cast",              label: "Cast",           doneEvent: "cast",               runningStage: "cast",               rank: 1,  end: STAGE_END.cast },
  { id: "background",        label: "Background",     doneEvent: "background_context", runningStage: "background-context", rank: 2,  end: STAGE_END.background },
  { id: "hard_logic",        label: "Hard Logic",     doneEvent: "hard_logic_devices", runningStage: "hard_logic_devices", rank: 3,  end: STAGE_END.hardLogic },
  { id: "cml",               label: "CML",            doneEvent: "cml",                runningStage: "cml",                rank: 4,  end: STAGE_END.cml },
  { id: "novelty_audit",     label: "Novelty Audit",  doneEvent: "novelty_audit",      runningStage: "novelty",            rank: 5,  end: STAGE_END.novelty },
  { id: "clues",             label: "Clues",          doneEvent: "clues",              runningStage: "clues",              rank: 6,  end: STAGE_END.clues },
  { id: "fairplay",          label: "Fair-play",      doneEvent: "fair_play_report",   runningStage: "fairplay",           rank: 7,  end: STAGE_END.fairplay },
  { id: "profiles",          label: "Char. Profiles", doneEvent: "character_profiles", runningStage: "profiles",           rank: 8,  end: STAGE_END.profiles },
  { id: "location_profiles", label: "Locations",      doneEvent: "location_profiles",  runningStage: "location-profiles",  rank: 8,  end: STAGE_END.locations },
  { id: "temporal_context",  label: "Era & Culture",  doneEvent: "temporal_context",   runningStage: "temporal-context",   rank: 8,  end: STAGE_END.temporal },
  { id: "world_builder",     label: "World Builder",  doneEvent: "world_builder",      runningStage: "world-builder",      rank: 9,  end: STAGE_END.world },
  { id: "outline",           label: "Outline",        doneEvent: "outline",            runningStage: "narrative",          rank: 10 },
  { id: "prose",             label: "Chapters",       doneEvent: "prose",              runningStage: "prose",              rank: 11, end: STAGE_END.prose },
  { id: "editing",           label: "Editing",        doneEvent: "editing",            runningStage: "editing",            rank: 12 },
  // v1's post-prose gate reported under "validation"; it belongs with the scoring tail.
  { id: "scoring",           label: "Scoring",        doneEvent: "scoring",            runningStage: "scoring",            rank: 13 },
];

const RANK_OF_STEP = new Map<string, number>([
  ...STAGES.map((s) => [s.runningStage, s.rank] as [string, number]),
  ["novelty_math", 5],
  ["validation", 13],
]);
const STAGE_OF_STEP = new Map<string, string>([
  ...STAGES.map((s) => [s.runningStage, s.id] as [string, string]),
  ["novelty_math", "novelty_audit"],
  ["validation", "scoring"],
]);

const FINISH_STEPS = new Set(["pipeline_complete", "run_finished", "complete"]);
const FAIL_STEPS = new Set(["pipeline_error", "run_failed"]);

/**
 * Each stage's status, from the events alone.
 *
 * A stage is COMPLETE when its own finishing message has arrived, when a later-ranked stage has
 * started since its last event, or when its *_done event arrives. That last one is not enough on its
 * own: server.ts emits every *_done only after the whole pipeline returns, so relying on it showed
 * every finished stage as "pending" for the whole run. A stage with no events of its own but a
 * later stage running was restored by a resume (RESUME_REDO=prose) and is complete too.
 */
export const deriveStages = (events: readonly RunEvent[]): PipelineStep[] => {
  const lastIndex = new Map<string, number>();
  const finishedBy = new Map<string, boolean>();
  /** For each event index, the highest rank of any stage event from that index on. */
  const stageEvents: { index: number; rank: number }[] = [];
  const completedDoneEvents = new Set<string>();
  let runComplete = false;
  let failedAt = -1;

  events.forEach((event, index) => {
    const step = event.step.toLowerCase();
    if (step.endsWith("_done")) {
      completedDoneEvents.add(step.replace(/_done$/, ""));
      return;
    }
    if (FINISH_STEPS.has(step)) {
      runComplete = true;
      return;
    }
    if (FAIL_STEPS.has(step)) {
      if (failedAt < 0) failedAt = index;
      return;
    }
    const id = STAGE_OF_STEP.get(step);
    const rank = RANK_OF_STEP.get(step);
    if (id === undefined || rank === undefined) return;
    lastIndex.set(id, index);
    const stage = STAGES.find((s) => s.id === id)!;
    const percent = progressPercentFromEvent(event);
    finishedBy.set(id, stage.end !== undefined && step === stage.runningStage && percent !== null && percent >= stage.end);
    stageEvents.push({ index, rank });
  });

  const laterRankStartedAfter = (rank: number, index: number) =>
    stageEvents.some((e) => e.rank > rank && e.index > index);

  return STAGES.map((s): PipelineStep => {
    const last = lastIndex.get(s.id);
    let status: PipelineStep["status"] = "pending";
    if (runComplete || completedDoneEvents.has(s.doneEvent)) status = "complete";
    else if (last === undefined) status = laterRankStartedAfter(s.rank, -1) ? "complete" : "pending";
    else if (finishedBy.get(s.id) || laterRankStartedAfter(s.rank, last)) status = "complete";
    else status = failedAt > last ? "failed" : "running";
    return { id: s.id, label: s.label, status };
  });
};

/**
 * The highest percentage any event has reported, with that event's message as the label. Highest
 * rather than last, because a late warning event carries no percentage and would otherwise drag the
 * bar backwards.
 */
export const deriveProgress = (events: readonly RunEvent[]): { percent: number; label: string } => {
  let percent = 0;
  let label = "Starting generation...";
  const context: ProgressContext = {};
  for (const event of events) {
    // v2 prose events name the chapter but not the total; the outline's scene count is the total.
    if (event.step.toLowerCase() === "narrative") {
      const scenes = /(\d+) scenes/.exec(event.message);
      if (scenes) context.chapterTotal = Number(scenes[1]);
    }
    const eventPercent = progressPercentFromEvent(event, context);
    if (typeof eventPercent === "number" && eventPercent >= percent) {
      percent = eventPercent;
      label = event.message || label;
    }
  }
  return { percent, label };
};

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
 * The bodies are moved VERBATIM from WorkshopView — a 116-line switch mapping pipeline events to
 * percentages is not something to retype.
 */

export const progressPercentFromEvent = (event: { step: string; message: string }) => {
  const step = event.step.toLowerCase();
  const message = event.message.toLowerCase();

  switch (step) {
    case "pipeline_started":
    case "run_started":
      return 2;

    // ── Setting (agent1) ────────────────────────────────────────────────────
    case "setting_done":
      return 12;
    case "setting":
      return message.includes("refined") ? 12 : 3;

    // ── Cast (agent2) ───────────────────────────────────────────────────────
    case "cast_done":
      return 25;
    case "cast":
      return message.includes("designed") ? 25 : 13;

    // ── Background Context (agent2e) ─────────────────────────────────────────
    case "background_context_done":
      return 30;
    case "background-context":
      return message.includes("generated") ? 30 : 26;

    // ── Hard Logic Devices (agent3b) ─────────────────────────────────────────
    case "hard_logic_devices_done":
      return 35;
    case "hard_logic_devices":
      return message.includes("generated") ? 35 : 31;

    // ── CML (agent3 + optional agent4 revision) ───────────────────────────────
    case "cml_done":
      return 52;
    case "cml":
      if (message.includes("regenerating")) return 50;
      if (message.includes("validated") || message.includes("generated")) return 52;
      return 36;

    // ── Novelty Audit (agent3) ────────────────────────────────────────────────
    case "novelty_audit_done":
      return 58;
    case "novelty":
      if (message.includes("skipped")) return 58;
      return message.includes("check:") ? 58 : 53;

    // ── Clues (agent5) ────────────────────────────────────────────────────────
    case "clues_done":
      return 65;
    case "clues":
      if (message.includes("regenerating")) return 60;
      return message.includes("distributed") ? 65 : 59;

    // ── Fair-play (agent6) ────────────────────────────────────────────────────
    case "fair_play_report_done":
      return 75;
    case "fairplay":
      // "Fair play audit: pass/fail" contains "audit:" — that signals completion
      if (message.includes("audit:")) return 75;
      if (message.includes("blind")) return 72;
      return 66;

    // ── Character Profiles (agent2b) ──────────────────────────────────────────
    case "character_profiles_done":
      return 80;
    case "profiles":
      return message.includes("generated") ? 80 : 76;

    // ── Location Profiles (agent2c) ───────────────────────────────────────────
    case "location_profiles_done":
      return 83;
    case "location-profiles":
      return message.includes("generated") ? 83 : 81;

    // ── Temporal Context (agent2d) ────────────────────────────────────────────
    case "temporal_context_done":
      return 86;
    case "temporal-context":
      return message.includes("generated") ? 86 : 84;

    // ── World Builder (agent65) ───────────────────────────────────────────────
    case "world_builder_done":
      return 92;
    case "world-builder":
      return message.includes("complete") ? 92 : 87;

    // ── Narrative Outline (agent7) ────────────────────────────────────────────
    case "outline_done":
      return 95;
    case "narrative":
      if (message.includes("scenes") || message.includes("structured") || message.includes("complete")) return 95;
      return 93;

    // ── Prose (agent9) ────────────────────────────────────────────────────────
    case "prose_done":
      return 98;
    case "prose":
      return message.includes("generated") ? 98 : 96;

    // ── Validation (agent9 post-prose gate) ───────────────────────────────────
    case "validation":
      if (message.includes("passed") || message.includes("auto-fix") || message.includes("encoding")) return 99;
      return 97;

    // ── Complete ──────────────────────────────────────────────────────────────
    case "pipeline_complete":
    case "run_finished":
    case "complete":
      return 100;

    default:
      return null;
  }
};

export const deriveStages = (events: readonly RunEvent[]): PipelineStep[] => {
  // doneEvent: the part of the "*_done" event name (without "_done") emitted by server.ts
  // runningStage: the progress stage name emitted by the orchestrator's reportProgress()
  const steps: { id: string; label: string; doneEvent: string; runningStage: string }[] = [
    { id: "setting",          label: "Setting",       doneEvent: "setting",            runningStage: "setting" },
    { id: "cast",             label: "Cast",          doneEvent: "cast",               runningStage: "cast" },
    { id: "background",       label: "Background",    doneEvent: "background_context", runningStage: "background-context" },
    { id: "hard_logic",       label: "Hard Logic",    doneEvent: "hard_logic_devices", runningStage: "hard_logic_devices" },
    { id: "cml",              label: "CML",           doneEvent: "cml",                runningStage: "cml" },
    { id: "novelty_audit",    label: "Novelty Audit", doneEvent: "novelty_audit",      runningStage: "novelty" },
    { id: "clues",            label: "Clues",         doneEvent: "clues",              runningStage: "clues" },
    { id: "fairplay",         label: "Fair-play",     doneEvent: "fair_play_report",   runningStage: "fairplay" },
    { id: "profiles",         label: "Char. Profiles",doneEvent: "character_profiles", runningStage: "profiles" },
    { id: "location_profiles",label: "Locations",     doneEvent: "location_profiles",  runningStage: "location-profiles" },
    { id: "temporal_context", label: "Era & Culture", doneEvent: "temporal_context",   runningStage: "temporal-context" },
    { id: "world_builder",    label: "World Builder", doneEvent: "world_builder",      runningStage: "world-builder" },
    { id: "outline",          label: "Outline",       doneEvent: "outline",            runningStage: "narrative" },
    { id: "prose",            label: "Prose",         doneEvent: "prose",              runningStage: "prose" },
  ];

  const completedDoneEvents = new Set<string>();
  const failedIds = new Set<string>();
  let runningStage: string | null = null;

  for (const event of events) {
    const step = event.step.toLowerCase();
    if (step.endsWith("_done")) {
      completedDoneEvents.add(step.replace(/_done$/, ""));
    } else if (["pipeline_complete", "run_finished", "complete"].includes(step)) {
      steps.forEach((s) => completedDoneEvents.add(s.doneEvent));
    } else if (["pipeline_error", "run_failed"].includes(step)) {
      if (runningStage) {
        const failedStep = steps.find((s) => s.runningStage === runningStage);
        if (failedStep) failedIds.add(failedStep.id);
      }
    } else if (!step.includes("_done") && !["pipeline_started", "run_started", "pipeline_warnings"].includes(step)) {
      runningStage = step;
    }
  }

  return steps.map((s): PipelineStep => {
    let status: PipelineStep["status"] = "pending";
    if (completedDoneEvents.has(s.doneEvent)) status = "complete";
    else if (failedIds.has(s.id)) status = "failed";
    else if (runningStage === s.runningStage) status = "running";
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
  for (const event of events) {
    const eventPercent = progressPercentFromEvent(event);
    if (typeof eventPercent === "number" && eventPercent >= percent) {
      percent = eventPercent;
      label = event.message || label;
    }
  }
  return { percent, label };
};

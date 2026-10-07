import { describe, expect, it } from "vitest";
import { STAGE_END, chapterPercent, deriveProgress, deriveStages } from "../timeline";

/**
 * The event stream of a real v2 run, in order (data/store.json, run_bcc0d637…, trimmed). The
 * `*_done` events come AFTER `complete`: server.ts emits them once generateMystery returns.
 */
const V2_RUN = [
  ["run_started", "Pipeline run started"],
  ["pipeline_started", "Starting mystery generation pipeline"],
  ["setting", "Refining era and setting..."],
  ["setting", "Era and setting refined"],
  ["cast", "Designing cast and motives..."],
  ["cast", "Cast designed (7 characters)"],
  ["background-context", "Generating background context..."],
  ["background-context", "Background context generated"],
  ["hard_logic_devices", "Generating novel hard-logic device concepts..."],
  ["hard_logic_devices", "Generated 5 novel hard-logic devices"],
  ["cml", "Generating mystery structure (CML) grounded in novel devices..."],
  ["cml", "Mystery structure generated and validated"],
  ["novelty", "Novelty check skipped (threshold >= 1.0)"],
  ["clues", "Extracting and organizing clues..."],
  ["clues", "21 clues distributed"],
  ["fairplay", "Auditing fair play compliance..."],
  ["fairplay", "Fair play audit: pass"],
  ["fairplay", "Running blind reader simulation..."],
  ["fairplay", "Blind reader simulation: PASS"],
  ["profiles", "Generating character profiles..."],
  ["profiles", "Character profiles generated (7)"],
  ["location-profiles", "Generating location profiles..."],
  ["location-profiles", "Location profiles generated (4 locations)"],
  ["temporal-context", "Generating temporal context..."],
  ["temporal-context", "Temporal context generated (December 1930)"],
  ["world-builder", "Generating World Document..."],
  ["world-builder", "World Document complete"],
  ["narrative", "Formatting narrative structure..."],
  ["narrative", "10 scenes structured (~10,000 words target)"],
  ["narrative", "Compiling story geometry..."],
  ...Array.from({ length: 10 }, (_, i) => ["prose", `Writing chapters ${i + 1}-${i + 1} (3 drafts)...`]),
  ["complete", "Mystery generation complete!"],
  ["setting_done", "Setting generated"],
  ["prose_done", "Prose generated (short format)"],
  ["run_finished", "Pipeline run finished"],
].map(([step, message]) => ({ step, message }));

const percentAfter = (n: number) => deriveProgress(V2_RUN.slice(0, n)).percent;
const indexOf = (message: string) => V2_RUN.findIndex((e) => e.message === message) + 1;

describe("the bar follows measured wall-clock time", () => {
  it("never falls", () => {
    for (let i = 2; i <= V2_RUN.length; i++) {
      expect(percentAfter(i), `fell at ${V2_RUN[i - 1].message}`).toBeGreaterThanOrEqual(percentAfter(i - 1));
    }
  });

  it("is about a third of the way when the outline is done, not 95%", () => {
    expect(percentAfter(indexOf("Compiling story geometry..."))).toBeLessThanOrEqual(STAGE_END.outline);
    expect(percentAfter(indexOf("Compiling story geometry..."))).toBeGreaterThanOrEqual(30);
  });

  it("moves through the chapters, using the outline's scene count as the total", () => {
    const ch1 = percentAfter(indexOf("Writing chapters 1-1 (3 drafts)..."));
    const ch6 = percentAfter(indexOf("Writing chapters 6-6 (3 drafts)..."));
    const ch10 = percentAfter(indexOf("Writing chapters 10-10 (3 drafts)..."));
    expect(ch1).toBe(STAGE_END.outline);
    expect(ch6).toBe(chapterPercent(5, 10));
    expect(ch10).toBe(chapterPercent(9, 10));
    expect(ch10).toBeLessThan(STAGE_END.chapters);
    expect(percentAfter(V2_RUN.length)).toBe(100);
  });

  it("weights later chapters more, as measured (x^1.7)", () => {
    // Half the chapters written is ~31% of the writing time, not 50%.
    const half = (chapterPercent(5, 10) - STAGE_END.outline) / (STAGE_END.chapters - STAGE_END.outline);
    expect(half).toBeGreaterThan(0.28);
    expect(half).toBeLessThan(0.34);
  });

  it("reads the v1 chapter messages too", () => {
    const events = [{ step: "prose", message: "Chapter 5/10 complete · chapter: 94/100" }];
    expect(deriveProgress(events).percent).toBe(chapterPercent(5, 10));
  });
});

describe("stages already passed read complete during the run", () => {
  it("marks every earlier stage complete while prose runs, before any *_done event", () => {
    const stages = deriveStages(V2_RUN.slice(0, indexOf("Writing chapters 4-4 (3 drafts)...")));
    const prose = stages.findIndex((s) => s.id === "prose");
    expect(stages[prose].status).toBe("running");
    for (const s of stages.slice(0, prose)) expect(s.status, s.id).toBe("complete");
  });

  it("leaves stages not yet reached pending", () => {
    const stages = deriveStages(V2_RUN.slice(0, indexOf("21 clues distributed")));
    expect(stages.find((s) => s.id === "clues")?.status).toBe("running");
    expect(stages.find((s) => s.id === "profiles")?.status).toBe("pending");
  });
});

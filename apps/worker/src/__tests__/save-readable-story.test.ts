import { describe, expect, it, afterAll } from "vitest";
import { readFile, rm } from "fs/promises";
import { tmpdir } from "os";
import path from "path";
import { saveReadableStory } from "../jobs/save-readable-story.js";

// A_61 follow-up — the SAME story writer the API and the canary both use, so a UI run and a canary run
// produce the identical story file. Fixed `now` makes the datePart deterministic.

const NOW = new Date(2026, 6, 4, 10, 30); // 2026-07-04 10:30 → story_20260704-1030
const storiesDir = path.join(tmpdir(), `cml-stories-test-${process.pid}`);
afterAll(async () => { await rm(storiesDir, { recursive: true, force: true }); });

const prose = {
  chapters: [
    { title: "The Body in the Study", paragraphs: ["It was a “cold” morning…", "Nothing stirred."] },
    { title: "The Reveal", paragraphs: ["‘It was you,’ she said."] },
  ],
};

describe("saveReadableStory", () => {
  it("uses prose.title, builds the slug + dated dir, and returns the paths", async () => {
    const saved = await saveReadableStory({ storiesDir, prose: { ...prose, title: "The Clockwork Alibi" }, runId: "run_1", now: NOW });
    expect(saved.title).toBe("The Clockwork Alibi");
    expect(saved.slug).toBe("the_clockwork_alibi");
    expect(saved.relPath).toBe(path.join("story_20260704-1030", "the_clockwork_alibi.md"));
    const content = await readFile(saved.absPath, "utf-8");
    expect(content.startsWith("# The Clockwork Alibi")).toBe(true);
    expect(content).toContain("*Run ID: run_1 — Generated");
    expect(content).toContain("## Chapter 1: The Body in the Study");
    expect(content).toContain("## Chapter 2: The Reveal");
    expect(content).toMatch(/It was a "cold" morning\.\.\./); // smart quotes + ellipsis normalised
  });

  it("falls back to the caller's fallbackTitle (synopsis/case title) when prose has no title", async () => {
    const saved = await saveReadableStory({ storiesDir, prose, runId: "run_2", fallbackTitle: "Murder at Thornfield", now: NOW });
    expect(saved.title).toBe("Murder at Thornfield");
    expect(saved.slug).toBe("murder_at_thornfield");
  });

  it("NEVER uses prose.note as a title (the diagnostic-note leak deriveStoryTitle prevents)", async () => {
    const saved = await saveReadableStory({
      storiesDir,
      prose: { ...prose, note: "Generated in scene batches. 10 batch(es) required retry for validation." },
      runId: "run_3",
      fallbackTitle: "Untitled Mystery",
      now: NOW,
    });
    expect(saved.title).toBe("Untitled Mystery"); // note ignored → fallback used
    expect(saved.slug).not.toContain("batch");
  });
});

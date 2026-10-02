import { describe, expect, it } from "vitest";
import type { ProjectRepository } from "../db.js";
import { cleanStoryTitle, storyTitleFor, withStoryTitle } from "../project-title.js";

/** Just enough repository for the helper: one synopsis per project, or none. */
const repoWith = (synopses: Record<string, unknown>) =>
  ({
    getLatestArtifact: async (projectId: string, type: string) =>
      type === "synopsis" && projectId in synopses
        ? { id: "a", projectId, type, payload: synopses[projectId] }
        : null,
  }) as unknown as ProjectRepository;

describe("story title for a project", () => {
  it("is the synopsis title, not the spec-derived project name", async () => {
    const repo = repoWith({ p1: { title: "  The Shadow on the Lighthouse ", summary: "x" } });
    const project = { id: "p1", name: "1930s · SeasideHotel", status: "idle" };
    expect(await withStoryTitle(repo, project)).toEqual({ ...project, title: "The Shadow on the Lighthouse" });
  });

  it("is null before a synopsis exists, so the UI keeps the project name", async () => {
    expect(await storyTitleFor(repoWith({}), "p2")).toBeNull();
  });

  it("rejects the API's placeholder and Agent 9's diagnostic note", () => {
    expect(cleanStoryTitle("Untitled Mystery")).toBeNull();
    expect(cleanStoryTitle("Generated in scene batches. 10 batch(es) required retry for validation.")).toBeNull();
    expect(cleanStoryTitle("   ")).toBeNull();
    expect(cleanStoryTitle(42)).toBeNull();
  });
});

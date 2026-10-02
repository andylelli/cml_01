import { isGenerationResidueTitle } from "@cml/prompts-llm";
import type { Project, ProjectRepository } from "./db.js";

/**
 * THE STORY'S TITLE, AS OPPOSED TO THE PROJECT'S NAME.
 *
 * A project is named when it is created, before anything is written — from the spec, so it reads
 * "1930s · SeasideHotel". The title the pipeline gives the story lands much later, in the `synopsis`
 * artifact (from CASE.meta.title). MEASURED on the live store: 9 of 9 finished stories had a synopsis
 * title and 0 of 9 prose payloads carried one, so anything reading `prose.title` and falling back to
 * the project name — the case list, the narration — showed the spec label instead of the title.
 *
 * `"Untitled Mystery"` is the placeholder runPipeline writes when the CML has no title; it is not a
 * title either, and the project name is the better label in that case.
 */
const PLACEHOLDER = /^untitled mystery$/i;

export const cleanStoryTitle = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || PLACEHOLDER.test(trimmed) || isGenerationResidueTitle(trimmed)) return null;
  return trimmed;
};

/** The story's title for a project, or null while none has been generated. */
export const storyTitleFor = async (repo: ProjectRepository, projectId: string): Promise<string | null> => {
  const synopsis = await repo.getLatestArtifact(projectId, "synopsis").catch(() => null);
  const payload = synopsis?.payload as { title?: unknown } | undefined;
  return cleanStoryTitle(payload?.title);
};

export type TitledProject = Project & { title: string | null };

export const withStoryTitle = async (repo: ProjectRepository, project: Project): Promise<TitledProject> => ({
  ...project,
  title: await storyTitleFor(repo, project.id),
});

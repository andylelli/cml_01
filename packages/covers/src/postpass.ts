import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { LLMLogger } from "@cml/llm-client";
import { generateCovers } from "./generate.js";
import { createImageClientFromEnv } from "./image-client.js";
import { createCoverLlmFromEnv } from "./llm.js";
import { storyInputFromRun } from "./story-input.js";
import type { CoverChatClient, CoverManifest, ImageClient } from "./types.js";

export interface CoverPostPassArgs {
  /** The story folder the manuscript was saved into; covers go to `<storyDir>/covers/`, THE cover to `<storyDir>/cover.png`. */
  storyDir: string;
  /** Style spec from resolveCoverRequest — "auto", a card id, "a+b", "auto:3"… */
  style: string;
  title: string;
  prose: Parameters<typeof storyInputFromRun>[0]["prose"];
  inputs?: Record<string, unknown>;
  cml?: Record<string, any> | null;
  author?: string;
  variants?: number;
  logger?: LLMLogger;
  logContext?: { runId: string; projectId: string };
  env?: NodeJS.ProcessEnv;
  log?: (line: string) => void;
  /** Test seams; production builds both from env. */
  image?: ImageClient;
  llm?: CoverChatClient;
}

export interface CoverPostPassResult {
  ok: boolean;
  /** Absolute path of `<storyDir>/cover.png` when one was made. */
  coverPath?: string;
  outDir: string;
  manifest?: CoverManifest;
  error?: string;
  provider?: string;
  model?: string;
}

/**
 * The pipeline's cover step (API run, canary run, on-demand button). NEVER throws: the book already exists
 * and a cover is optional, so every failure comes back as `{ ok: false, error }` for the caller to record
 * as a run event.
 */
export const runCoverPostPass = async (args: CoverPostPassArgs): Promise<CoverPostPassResult> => {
  const outDir = join(args.storyDir, "covers");
  try {
    const env = args.env ?? process.env;
    const image = args.image ? { client: args.image, error: undefined } : createImageClientFromEnv(env);
    if (!image.client) return { ok: false, outDir, error: image.error };
    const llm = args.llm ? { client: args.llm, error: undefined } : createCoverLlmFromEnv(env, args.logger);
    if (llm.error) args.log?.(`[covers] anchors will fall back to run inputs: ${llm.error}`);
    const input = storyInputFromRun({ title: args.title, prose: args.prose, inputs: args.inputs, cml: args.cml, author: args.author });
    if (!input.openingText.trim()) return { ok: false, outDir, error: "the manuscript has no chapter text" };
    const manifest = await generateCovers({
      input,
      outDir,
      styles: args.style,
      variants: args.variants ?? 1,
      llm: llm.client,
      image: image.client,
      logContext: args.logContext,
      log: args.log,
    });
    const provider = image.client.provider;
    const model = image.client.model;
    if (!manifest.primary) {
      const reason = manifest.covers.map((c) => c.error).filter(Boolean)[0] ?? "no cover produced";
      return { ok: false, outDir, manifest, error: reason, provider, model };
    }
    const coverPath = join(args.storyDir, "cover.png");
    copyFileSync(join(outDir, manifest.primary), coverPath);
    return { ok: existsSync(coverPath), coverPath, outDir, manifest, provider, model };
  } catch (e) {
    return { ok: false, outDir, error: String((e as Error)?.message ?? e) };
  }
};

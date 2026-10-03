import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { LLMLogger } from "@cml/llm-client";
import { generateCovers } from "./generate.js";
import { createImageClientFromEnv } from "./image-client.js";
import { createCoverLlmFromEnv } from "./llm.js";
import { storyInputFromRun } from "./story-input.js";
import type { CoverChatClient, CoverManifest, ImageClient, StoryCoverInput } from "./types.js";
import { createTitleCheckerFromEnv, type TitleChecker } from "./title-check.js";

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
  /** Replay a recorded seed; omitted → a fresh one, so every run's cover differs. */
  seed?: number;
  /** Test seams; production builds these from env (checkTitle null = no check). */
  image?: ImageClient;
  llm?: CoverChatClient;
  checkTitle?: TitleChecker | null;
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
      seed: args.seed,
      checkTitle: args.checkTitle === undefined ? createTitleCheckerFromEnv(env).check : args.checkTitle ?? undefined,
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

export interface PaintCoverArgs {
  outDir: string;
  style: string;
  /** Usually storyInputFromSetting(...) WITH the title — the title is painted into the cover. */
  input: StoryCoverInput;
  seed?: number;
  logger?: LLMLogger;
  logContext?: { runId: string; projectId: string };
  env?: NodeJS.ProcessEnv;
  log?: (line: string) => void;
  image?: ImageClient;
  llm?: CoverChatClient;
  /** Test seam; production builds it from env (null = no check). */
  checkTitle?: TitleChecker | null;
}

/**
 * Paint ONE finished cover — title included — from whatever input the caller has (the setting, once the CML has
 * named the book). Never throws.
 */
export const paintCover = async (
  args: PaintCoverArgs,
): Promise<{ ok: boolean; outDir: string; coverPath?: string; manifest?: CoverManifest; error?: string; provider?: string; model?: string }> => {
  try {
    const env = args.env ?? process.env;
    if (!args.input.title.trim()) return { ok: false, outDir: args.outDir, error: "no title yet — a cover is painted with its title" };
    const image = args.image ? { client: args.image, error: undefined } : createImageClientFromEnv(env);
    if (!image.client) return { ok: false, outDir: args.outDir, error: image.error };
    const llm = args.llm ? { client: args.llm, error: undefined } : createCoverLlmFromEnv(env, args.logger);
    if (llm.error) args.log?.(`[covers] anchors will fall back to run inputs: ${llm.error}`);
    if (!args.input.openingText.trim()) return { ok: false, outDir: args.outDir, error: "nothing to paint from (empty setting)" };
    const checkTitle = args.checkTitle === undefined ? createTitleCheckerFromEnv(env).check : args.checkTitle ?? undefined;
    const manifest = await generateCovers({
      input: args.input,
      outDir: args.outDir,
      styles: args.style,
      variants: 1,
      seed: args.seed,
      llm: llm.client,
      image: image.client,
      checkTitle,
      logContext: args.logContext,
      log: args.log,
    });
    const provider = image.client.provider;
    const model = image.client.model;
    if (!manifest.primary) {
      return { ok: false, outDir: args.outDir, manifest, error: manifest.covers.map((c) => c.error).filter(Boolean)[0] ?? "no cover produced", provider, model };
    }
    return { ok: true, outDir: args.outDir, coverPath: join(args.outDir, manifest.primary), manifest, provider, model };
  } catch (e) {
    return { ok: false, outDir: args.outDir, error: String((e as Error)?.message ?? e) };
  }
};

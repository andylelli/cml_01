import { copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { LLMLogger } from "@cml/llm-client";
import { generateCovers } from "./generate.js";
import { createImageClientFromEnv } from "./image-client.js";
import { createCoverLlmFromEnv } from "./llm.js";
import { storyInputFromRun } from "./story-input.js";
import type { CoverChatClient, CoverManifest, ImageClient, StoryCoverInput } from "./types.js";

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
      seed: args.seed,
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

export interface PaintArtArgs {
  /** Where the art goes; THE cover is lettered into the same folder later (letterCover). */
  outDir: string;
  style: string;
  /** Usually from storyInputFromSetting — a cover painted FIRST, before the book has a title. */
  input: StoryCoverInput;
  seed?: number;
  logger?: LLMLogger;
  logContext?: { runId: string; projectId: string };
  env?: NodeJS.ProcessEnv;
  log?: (line: string) => void;
  image?: ImageClient;
  llm?: CoverChatClient;
}

/**
 * Paint ONE cover's art, untitled, from whatever input the caller has (the setting, early in a run). Never
 * throws. The title is set afterwards — for free, as often as it changes — with letterCover().
 */
export const paintCoverArt = async (
  args: PaintArtArgs,
): Promise<{ ok: boolean; outDir: string; artPath?: string; manifest?: CoverManifest; error?: string; provider?: string; model?: string }> => {
  try {
    const env = args.env ?? process.env;
    const image = args.image ? { client: args.image, error: undefined } : createImageClientFromEnv(env);
    if (!image.client) return { ok: false, outDir: args.outDir, error: image.error };
    const llm = args.llm ? { client: args.llm, error: undefined } : createCoverLlmFromEnv(env, args.logger);
    if (llm.error) args.log?.(`[covers] anchors will fall back to run inputs: ${llm.error}`);
    if (!args.input.openingText.trim()) return { ok: false, outDir: args.outDir, error: "nothing to paint from (empty setting)" };
    const manifest = await generateCovers({
      input: { ...args.input, title: "" },
      outDir: args.outDir,
      styles: args.style,
      variants: 1,
      letter: false,
      seed: args.seed,
      llm: llm.client,
      image: image.client,
      logContext: args.logContext,
      log: args.log,
    });
    const rec = manifest.covers.find((c) => c.artPath);
    const provider = image.client.provider;
    const model = image.client.model;
    if (!rec?.artPath) {
      return { ok: false, outDir: args.outDir, manifest, error: manifest.covers.map((c) => c.error).filter(Boolean)[0] ?? "no art produced", provider, model };
    }
    return { ok: true, outDir: args.outDir, artPath: join(args.outDir, rec.artPath), manifest, provider, model };
  } catch (e) {
    return { ok: false, outDir: args.outDir, error: String((e as Error)?.message ?? e) };
  }
};

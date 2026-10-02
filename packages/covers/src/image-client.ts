import type { ImageClient, ImageRequest, ImageResult } from "./types.js";

/**
 * Image providers. Env is read at CALL time (ADR-0004), never in a module const.
 *
 *   CML_COVER_IMAGE_PROVIDER   openai | azure. Unset → openai when OPENAI_API_KEY is set, else azure.
 *   CML_COVER_IMAGE_MODEL      OpenAI model id, or the Azure DEPLOYMENT name. Default gpt-image-2.
 *   CML_COVER_IMAGE_QUALITY    low | medium | high. Default medium.
 *   OPENAI_API_KEY             OpenAI direct (the route evaria uses for gpt-image-2).
 *   AZURE_OPENAI_IMAGE_ENDPOINT / AZURE_OPENAI_IMAGE_API_KEY   Azure; fall back to AZURE_OPENAI_ENDPOINT / _API_KEY.
 *   AZURE_OPENAI_IMAGE_API_VERSION   Default 2025-04-01-preview.
 *
 * MEASURED 2026-10-02: the project's Azure resource has NO image deployment (probe: 404 DeploymentNotFound
 * for gpt-image-2/1.5/1 and dall-e-3; the chat deployment answers 400, so the probe discriminates).
 * The OpenAI key evaria uses lists gpt-image-2. Hence the OpenAI-first default.
 */

export const DEFAULT_IMAGE_MODEL = "gpt-image-2";
const DEFAULT_AZURE_API_VERSION = "2025-04-01-preview";

export const resolveImageQuality = (raw = process.env.CML_COVER_IMAGE_QUALITY): ImageRequest["quality"] => {
  const v = (raw ?? "").trim().toLowerCase();
  return v === "low" || v === "high" ? v : "medium";
};

type FetchLike = typeof fetch;

const decode = async (res: Response, provider: string): Promise<{ png: Buffer; usage?: Record<string, unknown> }> => {
  const text = await res.text();
  if (!res.ok) {
    // The body is the API's own error object — no secret in it. Trim so a log line stays one line.
    throw new Error(`${provider} image call failed: HTTP ${res.status} ${text.slice(0, 400).replace(/\s+/g, " ")}`);
  }
  const json = JSON.parse(text) as { data?: Array<{ b64_json?: string }>; usage?: Record<string, unknown> };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error(`${provider} image call returned no b64_json`);
  return { png: Buffer.from(b64, "base64"), usage: json.usage };
};

export class OpenAIImageClient implements ImageClient {
  readonly provider = "openai";
  constructor(
    readonly model: string,
    private readonly apiKey: string,
    private readonly fetchImpl: FetchLike = fetch,
    private readonly baseUrl = "https://api.openai.com/v1",
  ) {}

  async generate(req: ImageRequest): Promise<ImageResult> {
    const t0 = Date.now();
    const res = await this.fetchImpl(`${this.baseUrl}/images/generations`, {
      method: "POST",
      headers: { authorization: `Bearer ${this.apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({ model: this.model, prompt: req.prompt, size: req.size, quality: req.quality, n: 1 }),
    });
    const { png, usage } = await decode(res, this.provider);
    return { png, usage, provider: this.provider, model: this.model, latencyMs: Date.now() - t0 };
  }
}

export class AzureImageClient implements ImageClient {
  readonly provider = "azure";
  constructor(
    /** The deployment name. */
    readonly model: string,
    private readonly endpoint: string,
    private readonly apiKey: string,
    private readonly apiVersion = DEFAULT_AZURE_API_VERSION,
    private readonly fetchImpl: FetchLike = fetch,
  ) {}

  async generate(req: ImageRequest): Promise<ImageResult> {
    const t0 = Date.now();
    const url = `${this.endpoint.replace(/\/+$/, "")}/openai/deployments/${encodeURIComponent(this.model)}/images/generations?api-version=${this.apiVersion}`;
    const res = await this.fetchImpl(url, {
      method: "POST",
      headers: { "api-key": this.apiKey, "content-type": "application/json" },
      body: JSON.stringify({ prompt: req.prompt, size: req.size, quality: req.quality, n: 1 }),
    });
    const { png, usage } = await decode(res, this.provider);
    return { png, usage, provider: this.provider, model: this.model, latencyMs: Date.now() - t0 };
  }
}

/**
 * Build the configured client, or explain why it cannot be built. Returns `{ error }` rather than throwing
 * so a pipeline post-pass can record "cover skipped: <reason>" and carry on.
 */
export const createImageClientFromEnv = (
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: FetchLike = fetch,
): { client?: ImageClient; error?: string } => {
  const model = (env.CML_COVER_IMAGE_MODEL ?? "").trim() || DEFAULT_IMAGE_MODEL;
  const openaiKey = (env.OPENAI_API_KEY ?? "").trim();
  const requested = (env.CML_COVER_IMAGE_PROVIDER ?? "").trim().toLowerCase();
  const provider = requested || (openaiKey ? "openai" : "azure");
  if (provider === "openai") {
    if (!openaiKey) return { error: "CML_COVER_IMAGE_PROVIDER=openai but OPENAI_API_KEY is unset" };
    return { client: new OpenAIImageClient(model, openaiKey, fetchImpl) };
  }
  if (provider === "azure") {
    const endpoint = (env.AZURE_OPENAI_IMAGE_ENDPOINT ?? env.AZURE_OPENAI_ENDPOINT ?? "").trim();
    const key = (env.AZURE_OPENAI_IMAGE_API_KEY ?? env.AZURE_OPENAI_API_KEY ?? "").trim();
    if (!endpoint || !key) return { error: "no image provider: set OPENAI_API_KEY, or AZURE_OPENAI_IMAGE_ENDPOINT/_API_KEY with an image deployment" };
    const apiVersion = (env.AZURE_OPENAI_IMAGE_API_VERSION ?? "").trim() || DEFAULT_AZURE_API_VERSION;
    return { client: new AzureImageClient(model, endpoint, key, apiVersion, fetchImpl) };
  }
  return { error: `CML_COVER_IMAGE_PROVIDER="${requested}" is not openai or azure` };
};

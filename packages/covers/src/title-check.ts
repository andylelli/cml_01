/**
 * TITLE CHECK — the image model letters the title itself (owner, 2026-10-03), and image models still misspell.
 * A vision call reads the cover back; generate.ts repaints ONCE on a mismatch and records the read either way.
 * One vision call is a fraction of a penny against ~4p for the image.
 *
 * Uses the Azure chat deployment (AZURE_OPENAI_*; it accepts images — analyse-samples.mjs uses the same route),
 * or CML_COVER_TITLE_CHECK=off to skip. Env read at CALL time (ADR-0004).
 */
export type TitleChecker = (png: Buffer, title: string) => Promise<{ ok: boolean; read: string }>;

/** Letters and digits only, upper case, single spaces — so "The Clock's Hand" ≡ "THE CLOCKS HAND". */
export const normaliseTitle = (s: string) =>
  s
    .toUpperCase()
    .replace(/[’'`]/g, "")
    .replace(/[^A-Z0-9]+/g, " ")
    .trim();

/** The read matches when the whole normalised title appears in it, in order (extra text is a separate failure). */
export const titleMatches = (read: string, title: string) => {
  const want = normaliseTitle(title);
  return !!want && normaliseTitle(read).replace(/\s+/g, " ").includes(want);
};

export const createTitleCheckerFromEnv = (
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch,
): { check?: TitleChecker; error?: string } => {
  if ((env.CML_COVER_TITLE_CHECK ?? "").trim().toLowerCase() === "off") return { error: "CML_COVER_TITLE_CHECK=off" };
  const endpoint = (env.AZURE_OPENAI_ENDPOINT ?? "").trim().replace(/\/+$/, "");
  const key = (env.AZURE_OPENAI_API_KEY ?? "").trim();
  const deployment = (env.AZURE_OPENAI_DEPLOYMENT_NAME ?? "").trim();
  if (!endpoint || !key || !deployment) return { error: "no Azure chat deployment for the title check" };
  const apiVersion = (env.AZURE_OPENAI_API_VERSION ?? "").trim() || "2024-10-21";
  const check: TitleChecker = async (png, title) => {
    const res = await fetchImpl(`${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`, {
      method: "POST",
      headers: { "api-key": key, "content-type": "application/json" },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text:
                  "Transcribe EVERY piece of text lettered on this book cover, exactly as it is spelled on the image " +
                  "(do not correct spelling), top to bottom. Reply with JSON: {\"text\": \"...\"}.",
              },
              { type: "image_url", image_url: { url: `data:image/png;base64,${png.toString("base64")}`, detail: "high" } },
            ],
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0,
        max_tokens: 200,
      }),
    });
    const body = await res.text();
    if (!res.ok) throw new Error(`title check failed: HTTP ${res.status} ${body.slice(0, 160)}`);
    const read = String(JSON.parse(JSON.parse(body).choices[0].message.content).text ?? "");
    return { ok: titleMatches(read, title), read };
  };
  return { check };
};

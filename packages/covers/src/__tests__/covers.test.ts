import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createCanvas, loadImage } from "@napi-rs/canvas";
import { afterAll, describe, expect, it } from "vitest";
import {
  buildAnchorPrompt,
  composeBrief,
  createImageClientFromEnv,
  extractAnchors,
  fitTitle,
  generateCovers,
  loadStyleCards,
  parseAnchors,
  parseManuscript,
  readStoryDir,
  runCoverPostPass,
  listCoverStyles,
  resolveCoverRequest,
  resolveStyleChoices,
  storyInputFromRun,
  typesetCover,
  validateCard,
  type CoverAnchors,
  type ImageClient,
  type StoryCoverInput,
} from "../index.js";

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(here, "../../../..");
const CARDS = join(ROOT, "library/cover-styles/cards");
const FONTS = join(ROOT, "library/cover-styles/fonts");
const cards = loadStyleCards(CARDS);
const tmp = mkdtempSync(join(tmpdir(), "cml-covers-"));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

const input: StoryCoverInput = {
  title: "The Rotating Wall at Halloway Manor",
  era: "1930s",
  locationPreset: "CountryHouse",
  tone: "Cozy",
  primaryAxis: "spatial",
  openingText: "Harriet stood at the threshold. A neglected mantel clock ticked unevenly.",
};
const anchors: CoverAnchors = {
  place: "a long gallery in a flint manor",
  place_details: ["tall mullioned windows", "a panelled wall", "a worn stair rail"],
  time_of_day: "dusk",
  weather: "fog off the marsh",
  season: "autumn",
  clue_object: "a stopped carriage clock",
  mood: "quiet unease",
  figure: null,
  era_details: ["oil lamps", "a cloche hat on a chair"],
  source: "llm",
};

/** A 1024x1536 plain-colour PNG standing in for model output. */
const fakeArt = (colour = "#203040") => {
  const c = createCanvas(1024, 1536);
  const ctx = c.getContext("2d");
  ctx.fillStyle = colour;
  ctx.fillRect(0, 0, 1024, 1536);
  return c.toBuffer("image/png");
};

describe("style cards", () => {
  it("loads the four library cards, sorted by id", () => {
    expect(cards.map((c) => c.id)).toEqual(["deco-portrait", "flat-travel-poster", "magazine-illustration", "painterly-poster"]);
  });
  it("rejects a card whose ink is not #rrggbb, naming the card", () => {
    const bad = { ...cards[0], palettes: [{ name: "x", inks: ["#123", "#ffffff"] }] };
    expect(() => validateCard(bad)).toThrow(/deco-portrait.*#123/);
  });
});

describe("style selection", () => {
  it("a spatial country-house story ranks a poster card first", () => {
    const [choice] = resolveStyleChoices("auto", cards, input);
    expect(["flat-travel-poster", "painterly-poster"]).toContain(choice.primary.id);
  });
  it("is deterministic and variants walk the palette list", () => {
    const a = resolveStyleChoices("flat-travel-poster", cards, input, 3);
    const b = resolveStyleChoices("flat-travel-poster", cards, input, 3);
    expect(a.map((c) => c.palette.name)).toEqual(b.map((c) => c.palette.name));
    expect(new Set(a.map((c) => c.palette.name)).size).toBe(3);
  });
  it("parses blends and lists, and names unknown styles", () => {
    const [blend] = resolveStyleChoices("deco-portrait+flat-travel-poster", cards, input);
    expect(blend.primary.id).toBe("deco-portrait");
    expect(blend.secondary?.id).toBe("flat-travel-poster");
    expect(resolveStyleChoices("all", cards, input)).toHaveLength(4);
    expect(resolveStyleChoices("auto:2", cards, input)).toHaveLength(2);
    expect(() => resolveStyleChoices("nope", cards, input)).toThrow(/unknown cover style "nope"/);
  });
});

describe("anchors", () => {
  it("the prompt carries the opening and the fixed JSON shape", () => {
    const { user } = buildAnchorPrompt(input);
    expect(user).toContain("mantel clock");
    expect(user).toContain('"clue_objects"');
  });
  it("parses a fenced reply and coerces out-of-vocabulary values", () => {
    const a = parseAnchors('Here:\n```json\n{"place":"a boathouse","clue_object":"a wet oar","time_of_day":"Midnight","season":"WINTER","figure":"null"}\n```');
    expect(a).toMatchObject({ place: "a boathouse", clue_object: "a wet oar", time_of_day: "dusk", season: "winter", figure: null, source: "llm" });
  });
  it("refuses a weapon or crime-scene anchor and records it", () => {
    const a = parseAnchors(JSON.stringify({
      place: "the victim's bedroom in a country manor",
      clue_objects: ["a letter opener with fingerprints", "a bloodied glove", "a carriage clock on the mantel"],
    }));
    expect(a.clue_object).toBe("a carriage clock on the mantel");
    expect(a.place).not.toMatch(/victim|bedroom/);
    expect(a.rejected).toEqual(["a letter opener with fingerprints", "a bloodied glove", "the victim's bedroom in a country manor"]);
  });
  it("drops place details that paint the mechanism (the two measured on the first real covers)", () => {
    const a = parseAnchors(JSON.stringify({
      place: "a large 1950s country manor in winter",
      place_details: ["stone walls with a hidden panel", "heavy carpet with disturbed patch", "tall chimneys against a white sky"],
      clue_objects: ["a mantel clock"],
    }));
    expect(a.place_details).toEqual(["tall chimneys against a white sky"]);
    expect(a.rejected).toEqual(["stone walls with a hidden panel", "heavy carpet with disturbed patch"]);
  });
  it("falls back, never throws, when the LLM fails", async () => {
    const res = await extractAnchors(input, { chat: async () => { throw new Error("boom"); } });
    expect(res.anchors.source).toBe("fallback");
    expect(res.error).toBe("boom");
    expect(res.anchors.place).toMatch(/country house/);
  });
  it("labels the call Agent10-CoverAnchors", async () => {
    let agent = "";
    await extractAnchors(input, {
      chat: async (o) => { agent = o.logContext?.agent ?? ""; return { content: JSON.stringify(anchors) }; },
    }, { runId: "r", projectId: "p" });
    expect(agent).toBe("Agent10-CoverAnchors");
  });
});

describe("brief", () => {
  it("is built from the template: subject, clue object, inks, reserved band, exclusions", () => {
    const [choice] = resolveStyleChoices("flat-travel-poster", cards, input);
    const b = composeBrief(input, anchors, choice);
    expect(b.prompt).toContain("a stopped carriage clock sits in the foreground");
    expect(b.prompt).toContain("top 24%");
    for (const ink of choice.palette.inks) expect(b.prompt).toContain(ink);
    expect(b.prompt).toMatch(/EXCLUDE:.*words, letters/);
    expect(b.prompt).toContain("1930s");
    expect(b.prompt).not.toMatch(/in the style of/i);
  });
  it("a blend takes composition from the second card", () => {
    const [choice] = resolveStyleChoices("magazine-illustration+flat-travel-poster", cards, input);
    const b = composeBrief(input, anchors, choice);
    expect(b.prompt).toContain(cards.find((c) => c.id === "flat-travel-poster")!.composition[0]);
    expect(b.prompt).toContain(choice.palette.inks[0]);
  });
});

describe("image client from env", () => {
  it("prefers OpenAI when OPENAI_API_KEY is set, default model gpt-image-2", () => {
    const { client } = createImageClientFromEnv({ OPENAI_API_KEY: "k" } as NodeJS.ProcessEnv);
    expect(client?.provider).toBe("openai");
    expect(client?.model).toBe("gpt-image-2");
  });
  it("never infers Azure from the chat resource alone; Azure is named or given an image endpoint", () => {
    const chatOnly = { AZURE_OPENAI_ENDPOINT: "https://x", AZURE_OPENAI_API_KEY: "k" } as NodeJS.ProcessEnv;
    expect(createImageClientFromEnv(chatOnly).error).toMatch(/no image model configured/);
    expect(createImageClientFromEnv({ ...chatOnly, CML_COVER_IMAGE_PROVIDER: "azure" }).client?.provider).toBe("azure");
    expect(createImageClientFromEnv({ ...chatOnly, AZURE_OPENAI_IMAGE_ENDPOINT: "https://img" }).client?.provider).toBe("azure");
    expect(createImageClientFromEnv({} as NodeJS.ProcessEnv).error).toMatch(/no image model configured/);
  });
  it("sends the OpenAI request shape and surfaces an HTTP error body", async () => {
    let body: any;
    const ok = createImageClientFromEnv({ OPENAI_API_KEY: "k" } as NodeJS.ProcessEnv, (async (_u: any, init: any) => {
      body = JSON.parse(init.body);
      return new Response(JSON.stringify({ data: [{ b64_json: fakeArt().toString("base64") }], usage: { total_tokens: 1 } }));
    }) as typeof fetch).client!;
    const res = await ok.generate({ prompt: "p", size: "1024x1536", quality: "medium" });
    expect(body).toEqual({ model: "gpt-image-2", prompt: "p", size: "1024x1536", quality: "medium", n: 1 });
    expect(res.png.length).toBeGreaterThan(1000);
    const bad = createImageClientFromEnv({ OPENAI_API_KEY: "k" } as NodeJS.ProcessEnv, (async () =>
      new Response('{"error":{"code":"DeploymentNotFound"}}', { status: 404 })) as unknown as typeof fetch).client!;
    await expect(bad.generate({ prompt: "p", size: "1024x1536", quality: "low" })).rejects.toThrow(/HTTP 404 .*DeploymentNotFound/);
  });
});

describe("typeset", () => {
  it("fitTitle wraps within width and line limits", () => {
    const measure = (s: string, size: number) => s.length * size * 0.6;
    const fit = fitTitle("THE ROTATING WALL AT HALLOWAY MANOR", measure, { maxWidth: 900, maxHeight: 300, maxLines: 3, maxSize: 132, minSize: 36, lineHeight: 1.08 });
    expect(fit.lines.length).toBeLessThanOrEqual(3);
    for (const l of fit.lines) expect(measure(l, fit.size)).toBeLessThanOrEqual(900);
  });
  it("produces a 1024x1536 PNG for both band styles", async () => {
    for (const style of ["framed", "full-bleed"] as const) {
      const png = await typesetCover({
        art: fakeArt(), title: input.title, author: "A. N. Author",
        band: { position: "top", style, height: 0.24 }, inks: ["#1d2b3a", "#e9a03b", "#f3e6c8"], titleFont: "display-deco", fontsDir: FONTS,
      });
      const img = await loadImage(png);
      expect([img.width, img.height]).toEqual([1024, 1536]);
    }
  });
});

describe("story input", () => {
  const md = "# The Clockwork Alibi\n\n*Run ID: x*\n\n---\n\n## Chapter 1: One\n\nFirst para.\n\n---\n\n## Chapter 2: Two\n\nSecond.\n\n---\n\n## Chapter 3: Three\n\nTHE SOLUTION.\n\n---\n";
  it("parses the saved manuscript format; the opening is chapters 1-2 only", () => {
    const p = parseManuscript(md);
    expect(p.title).toBe("The Clockwork Alibi");
    expect(p.chapters).toHaveLength(3);
    const dir = join(tmp, "story");
    rmSync(dir, { recursive: true, force: true });
    mkdirSync(dir);
    writeFileSync(join(dir, "the_clockwork_alibi.md"), md);
    writeFileSync(join(dir, "run-params.json"), JSON.stringify({ eraPreference: "1930s", primaryAxis: "spatial", tone: "auto" }));
    const s = readStoryDir(dir);
    expect(s.openingText).toContain("Second.");
    expect(s.openingText).not.toContain("SOLUTION");
    expect(s).toMatchObject({ era: "1930s", primaryAxis: "spatial", tone: undefined });
  });
  it("storyInputFromRun prefers the CML era and setting", () => {
    const s = storyInputFromRun({
      title: "T",
      prose: { chapters: [{ paragraphs: ["a"] }, { paragraphs: ["b"] }, { paragraphs: ["SPOILER"] }] },
      inputs: { eraPreference: "auto", locationPreset: "Seaside" },
      cml: { CASE: { meta: { era: { decade: "1920s" }, setting: { location: "Cornwall", place: "a harbour inn" } } } },
    });
    expect(s).toMatchObject({ era: "1920s", setting: "a harbour inn, Cornwall", locationPreset: "Seaside" });
    expect(s.openingText).not.toContain("SPOILER");
  });
});

describe("generateCovers", () => {
  it("dry run writes anchors, briefs, manifest and contact sheet, and calls no image model", async () => {
    const out = join(tmp, "dry");
    let calls = 0;
    const image: ImageClient = { provider: "fake", model: "m", generate: async () => { calls++; throw new Error("x"); } };
    const m = await generateCovers({ input, outDir: out, styles: "all", dryRun: true, anchors, image, cardsDir: CARDS });
    expect(calls).toBe(0);
    expect(m.covers).toHaveLength(4);
    expect(m.primary).toBeUndefined();
    for (const f of ["anchors.json", "covers.json", "index.html", m.covers[0].briefPath]) expect(existsSync(join(out, f))).toBe(true);
  });
  it("records one failed image and still ships the others, primary = first success", async () => {
    const out = join(tmp, "live");
    let n = 0;
    const image: ImageClient = {
      provider: "fake", model: "m",
      generate: async () => { if (n++ === 0) throw new Error("filtered"); return { png: fakeArt("#c4462e"), provider: "fake", model: "m", latencyMs: 1 }; },
    };
    const m = await generateCovers({ input, outDir: out, styles: "flat-travel-poster", variants: 2, anchors, image, cardsDir: CARDS, concurrency: 1 });
    expect(m.covers[0].error).toBe("filtered");
    expect(m.covers[1].coverPath).toBeTruthy();
    expect(m.primary).toBe("cover.png");
    expect(existsSync(join(out, "cover.png"))).toBe(true);
    expect(readFileSync(join(out, "index.html"), "utf8")).toContain("filtered");
  });
});

describe("cover request resolution", () => {
  it("explicit beats env; off beats env; env on means auto", () => {
    expect(resolveCoverRequest(undefined, "")).toBeNull();
    expect(resolveCoverRequest(undefined, "true")).toBe("auto");
    expect(resolveCoverRequest("off", "true")).toBeNull();
    expect(resolveCoverRequest("deco-portrait", "")).toBe("deco-portrait");
  });
});

describe("runCoverPostPass", () => {
  const prose = { chapters: [{ paragraphs: ["The manor stood above the marsh."] }, { paragraphs: ["A clock ticked."] }] };
  it("never throws: no provider configured is an error result", async () => {
    const r = await runCoverPostPass({ storyDir: join(tmp, "pp0"), style: "auto", title: "T", prose, env: {} as NodeJS.ProcessEnv });
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/no image model configured/);
  });
  it("writes <storyDir>/cover.png and covers/ when the image call succeeds", async () => {
    process.env.CML_COVER_STYLES_DIR = CARDS;
    try {
      const dir = join(tmp, "pp1");
      const r = await runCoverPostPass({
        storyDir: dir, style: "flat-travel-poster", title: "The Marsh Clock", prose, env: {} as NodeJS.ProcessEnv,
        image: { provider: "fake", model: "m", generate: async () => ({ png: fakeArt(), provider: "fake", model: "m", latencyMs: 1 }) },
        llm: { chat: async () => ({ content: JSON.stringify({ place: "a flint manor above a marsh", clue_objects: ["a carriage clock"] }) }) },
      });
      expect(r.ok).toBe(true);
      expect(existsSync(join(dir, "cover.png"))).toBe(true);
      expect(existsSync(join(dir, "covers", "covers.json"))).toBe(true);
      expect(r.manifest?.anchors.clue_object).toBe("a carriage clock");
    } finally {
      delete process.env.CML_COVER_STYLES_DIR;
    }
  });
  it("lists styles for the UI", () => {
    expect(listCoverStyles(CARDS).map((s) => s.id)).toContain("deco-portrait");
  });
});

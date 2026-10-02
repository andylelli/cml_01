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
  splitTitle,
  runCoverPostPass,
  listCoverStyles,
  resolveCoverRequest,
  resolveStyleChoices,
  rankCards,
  makeRng,
  FRAMINGS,
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
  clue_candidates: ["a stopped carriage clock", "a brass door key", "a folded letter"],
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
    // The RANKING is deterministic; "auto" now draws from it at random (weighted), tested below.
    expect(rankCards(cards, input)[0].card.id).toBe("flat-travel-poster");
  });
  const sig = (cs: ReturnType<typeof resolveStyleChoices>) =>
    cs.map((c) => [c.primary.id, c.secondary?.id, c.palette.name, c.framing?.id, c.light, c.object, ...(c.touches ?? [])].join("|"));
  it("the same seed reproduces a draw exactly; a different seed changes it", () => {
    const a = resolveStyleChoices("auto:3", cards, input, 1, makeRng(42), anchors);
    const b = resolveStyleChoices("auto:3", cards, input, 1, makeRng(42), anchors);
    const c = resolveStyleChoices("auto:3", cards, input, 1, makeRng(43), anchors);
    expect(sig(a)).toEqual(sig(b));
    expect(sig(c)).not.toEqual(sig(a));
  });
  it("variants of one card get distinct palettes and distinct framings", () => {
    const v = resolveStyleChoices("flat-travel-poster", cards, input, 3, makeRng(7), anchors);
    expect(new Set(v.map((c) => c.palette.name)).size).toBe(3);
    expect(new Set(v.map((c) => c.framing?.id)).size).toBe(3);
  });
  it("over many runs, auto varies card, framing and blend — and still favours the best fit", () => {
    const draws = Array.from({ length: 200 }, (_, i) => resolveStyleChoices("auto", cards, input, 1, makeRng(i + 1), anchors)[0]);
    const cardCounts = new Map<string, number>();
    for (const d of draws) cardCounts.set(d.primary.id, (cardCounts.get(d.primary.id) ?? 0) + 1);
    expect(cardCounts.size).toBe(4);
    const best = [...cardCounts.entries()].sort((x, y) => y[1] - x[1])[0][0];
    expect(best).toBe("flat-travel-poster"); // the top-scoring card for a spatial country house
    expect(new Set(draws.map((d) => d.framing?.id)).size).toBeGreaterThanOrEqual(9);
    const blends = draws.filter((d) => d.secondary).length;
    expect(blends).toBeGreaterThan(40);
    expect(blends).toBeLessThan(110);
    expect(new Set(draws.map((d) => d.object))).toEqual(new Set(anchors.clue_candidates));
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
  it("is built from the template: subject, framing, object, inks, reserved band, exclusions", () => {
    const [choice] = resolveStyleChoices("flat-travel-poster", cards, input, 1, makeRng(3), anchors);
    const b = composeBrief(input, anchors, choice, 0, 3);
    expect(b.prompt).toMatch(/FRAMING: /);
    expect(b.prompt).toContain(choice.object!);
    expect(b.seed).toBe(3);
    expect(b.id).toContain(choice.framing!.id);
    expect(b.prompt).toContain("top 24%");
    for (const ink of choice.palette.inks) expect(b.prompt).toContain(ink);
    expect(b.prompt).toMatch(/EXCLUDE:.*words, letters/);
    expect(b.prompt).toContain("1930s");
    expect(b.prompt).not.toMatch(/in the style of/i);
  });
  it("a framing with no figure puts no person in the brief", () => {
    const shadow = FRAMINGS.find((f) => f.id === "shadow-on-wall")!;
    const [choice] = resolveStyleChoices("deco-portrait", cards, input, 1, makeRng(1), { ...anchors, figure: "a woman in a grey suit" });
    const b = composeBrief(input, { ...anchors, figure: "a woman in a grey suit" }, { ...choice, framing: shadow });
    expect(b.prompt).not.toContain("a woman in a grey suit");
    expect(b.prompt).not.toContain("People are drawn this way");
    expect(b.prompt).toContain("NOT in the picture");
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
  it("splitTitle breaks at a colon or dash, and leaves a plain title alone", () => {
    expect(splitTitle("THE HALF-HOUR HAND: A THEATRE CLOCK DECEPTION")).toEqual({ main: "THE HALF-HOUR HAND", sub: "A THEATRE CLOCK DECEPTION" });
    expect(splitTitle("DEATH — A STUDY")).toEqual({ main: "DEATH", sub: "A STUDY" });
    expect(splitTitle("THE HALF-HOUR HAND")).toEqual({ main: "THE HALF-HOUR HAND" });
  });
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
  it("records the seed; an unseeded rerun draws differently, a seeded rerun identically", async () => {
    const run = (dir: string, seed?: number) =>
      generateCovers({ input, outDir: join(tmp, dir), styles: "auto:3", dryRun: true, anchors, cardsDir: CARDS, seed });
    const a = await run("s1");
    const b = await run("s2");
    const c = await run("s3", a.seed);
    const ids = (m: Awaited<ReturnType<typeof run>>) => m.covers.map((x) => x.briefId).join(",");
    expect(typeof a.seed).toBe("number");
    expect(a.seed).not.toBe(b.seed);
    expect(ids(c)).toBe(ids(a));
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

describe("framing light", () => {
  it("a framing that fixes the time of day overrides the random light", () => {
    for (let i = 1; i <= 60; i++) {
      for (const c of resolveStyleChoices("all", cards, input, 1, makeRng(i), anchors)) {
        if (c.framing?.id === "lit-window-night") expect(c.light).toBe("moonlight and one lamp");
      }
    }
  });
});

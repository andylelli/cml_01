/**
 * 17-hitting-90 P0.3 — the ship-check runs on v2's manuscript. Known-positive first: a probe that
 * has never fired is a claim about the probe.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { normaliseWords, resetAntiCopyIndex } from "@cml/prose-guard";

import { v2AntiCopyShipCheckLines, v2ShipCheckLines } from "../jobs/agents/agent9-v2/ship-check.js";

const chapter = (paragraphs: string[]) => ({ title: "t", paragraphs });

describe("the v2 ship-check", () => {
  it("KNOWN-POSITIVE: a repeated six-word span and a scaffold signature are both reported", () => {
    const repeated = "the seven feet above the rocky shore";
    const lines = v2ShipCheckLines([
      chapter([`He measured ${repeated} twice.`, `She had already counted ${repeated} herself.`, `Nobody doubted ${repeated} now.`]),
      chapter(["Nobody in the room could unsee what had just happened."]),
    ]);
    expect(lines.some((l) => /SHIP-CHECK: repetition — /.test(l))).toBe(true);
    expect(lines.some((l) => /scaffold residual \[A2b:could_unsee\] in ch2/.test(l))).toBe(true);
    expect(lines.some((l) => /in ch1/.test(l))).toBe(false);
  });

  it("a clean book reports its repetition figure and no scaffold line", () => {
    const lines = v2ShipCheckLines([chapter(["The morning came in grey off the water, and the hotel woke slowly."])]);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/repetition/);
  });

  it("no chapters, no lines", () => {
    expect(v2ShipCheckLines([])).toEqual([]);
  });
});

// ── the anti-copy line (2026-10-03) ──────────────────────────────────────────────────────────────
//
// v1's hard-fail call site died with the v1 engine (43b44336) and v2 had no output-side copy check
// while PROSE_ANTI_COPY_GATE=true sat in config. The source here is a REAL library text, so the
// known-positive is "a span copied from a library text", not a synthetic string.

const LIBRARY_TEXTS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..", "library", "texts");

describe("the v2 anti-copy ship-check line", () => {
  const dirs: string[] = [];
  const saved = {
    gate: process.env.PROSE_ANTI_COPY_GATE,
    dir: process.env.PROSE_ANTI_COPY_TEXTS_DIR,
  };

  /** A corpus directory holding ONE real work — the smallest in library/texts, so the index builds at once. */
  const oneRealWork = (): { dir: string; words: string[] } => {
    const smallest = fs
      .readdirSync(LIBRARY_TEXTS)
      .filter((f) => f.endsWith(".txt"))
      .map((f) => ({ f, size: fs.statSync(path.join(LIBRARY_TEXTS, f)).size }))
      .sort((a, b) => a.size - b.size)[0]!;
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "v2-anticopy-"));
    dirs.push(dir);
    fs.copyFileSync(path.join(LIBRARY_TEXTS, smallest.f), path.join(dir, smallest.f));
    return { dir, words: normaliseWords(fs.readFileSync(path.join(dir, smallest.f), "utf8")) };
  };

  beforeEach(() => {
    process.env.PROSE_ANTI_COPY_GATE = "true";
    resetAntiCopyIndex();
  });

  afterEach(() => {
    for (const [key, value] of [["PROSE_ANTI_COPY_GATE", saved.gate], ["PROSE_ANTI_COPY_TEXTS_DIR", saved.dir]] as const) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    resetAntiCopyIndex();
    for (const d of dirs.splice(0)) fs.rmSync(d, { recursive: true, force: true });
  });

  const original = "The morning came in grey off the water, and the hotel woke slowly under a pale sky.";

  it("KNOWN-POSITIVE: an 11-word span copied from a library text is reported, in the chapter that holds it", async () => {
    const { dir, words } = oneRealWork();
    process.env.PROSE_ANTI_COPY_TEXTS_DIR = dir;
    const lift = words.slice(400, 411).join(" ");
    expect(lift.split(" ")).toHaveLength(11);

    const lines = await v2AntiCopyShipCheckLines([
      chapter([original]),
      chapter([original, `Mrs Pell murmured, ${lift}, and then said nothing more.`]),
    ]);

    expect(lines.some((l) => /anti-copy — ch2: 1 verbatim span\(s\), longest 11 words/.test(l))).toBe(true);
    expect(lines.some((l) => /ch1/.test(l))).toBe(false);
    expect(lines.at(-1)).toMatch(/1 verbatim span\(s\) of 11\+ words in 1 chapter\(s\) against 1 works.*WORTH A LOOK BEFORE READING/);
  });

  it("a 10-word lift is below n and is not reported", async () => {
    const { dir, words } = oneRealWork();
    process.env.PROSE_ANTI_COPY_TEXTS_DIR = dir;
    const lines = await v2AntiCopyShipCheckLines([chapter([`Mrs Pell murmured, ${words.slice(400, 410).join(" ")}, and left.`])]);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/no verbatim span of 11\+ words against 1 works.*Clean\./);
  });

  it("a clean book is reported CLEAN — checked is distinguishable from never checked", async () => {
    process.env.PROSE_ANTI_COPY_TEXTS_DIR = oneRealWork().dir;
    const lines = await v2AntiCopyShipCheckLines([chapter([original])]);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/Clean\./);
  });

  it("the flag OFF reports nothing at all", async () => {
    process.env.PROSE_ANTI_COPY_GATE = "";
    process.env.PROSE_ANTI_COPY_TEXTS_DIR = oneRealWork().dir;
    expect(await v2AntiCopyShipCheckLines([chapter([original])])).toEqual([]);
  });

  it("an unreadable corpus says NOT RUN instead of passing the book or throwing", async () => {
    process.env.PROSE_ANTI_COPY_TEXTS_DIR = path.join(os.tmpdir(), "v2-anticopy-does-not-exist-xyz");
    const lines = await v2AntiCopyShipCheckLines([chapter([original])]);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/NOT RUN/);
  });

  it("no chapters, no hits — still one Clean line when the flag is on", async () => {
    process.env.PROSE_ANTI_COPY_TEXTS_DIR = oneRealWork().dir;
    const lines = await v2AntiCopyShipCheckLines([]);
    expect(lines).toHaveLength(1);
    expect(lines[0]).toMatch(/Clean\./);
  });
});

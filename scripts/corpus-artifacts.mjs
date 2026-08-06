/**
 * Reading an archived run and the manuscript it shipped — ONE body, shared by every offline probe.
 *
 * Extracted 2026-08-06 when M1b needed the same four readers `geometry-backtest.mjs` already had.
 * Copying them would have been the trap this codebase has paid for five times over (REVIEW_05 §10
 * rule 2, and X3's four `parseEnvBool`s, and N5's three `extractResponseJson`s). The backtest now
 * imports these rather than defining them, so a fix to `shippedOutline` reaches every consumer.
 *
 * Everything here is offline and free: it reads `documentation/prompts/actual/` and `stories/`.
 */

import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/** Pull the JSON payload out of a `## Response Body` record. */
export const responseJson = (path) => {
  const text = readFileSync(path, "utf8");
  const marker = text.indexOf("## Response Body");
  if (marker < 0) return null;
  const fenced = text.slice(marker).match(/```(?:text|json)?\n([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text.slice(marker + "## Response Body".length);
  const start = body.indexOf("{");
  if (start < 0) return null;
  try {
    return JSON.parse(body.slice(start));
  } catch {
    return null;
  }
};

export const responsesFor = (runDir, agentPattern) =>
  readdirSync(runDir)
    .filter((f) => f.endsWith("_response.md") && agentPattern.test(f))
    .sort((a, b) => Number(a.split("_")[0]) - Number(b.split("_")[0]))
    .map((f) => ({ file: f, parsed: responseJson(join(runDir, f)) }))
    .filter((r) => r.parsed);

/** The LAST response from an agent — retries and revisions supersede earlier attempts. */
export const lastResponseFor = (runDir, agentPattern) => {
  const all = responsesFor(runDir, agentPattern);
  return all.length > 0 ? all[all.length - 1] : { parsed: null, file: null };
};

/**
 * Which Agent-7 attempt actually SHIPPED — matched against the manuscript, not assumed.
 *
 * FOUND BY THE BACKTEST, and a finding in its own right. "The last attempt wins" is wrong: on run
 * 1654, Agent 7 produced three outlines (10 beats, then 10 with a duplicated `revelation`, then 9)
 * and the manuscript matches the FIRST. On run 1818 it produced two and the manuscript matches the
 * SECOND. The prompt record does not state which candidate the pipeline kept — a later attempt can
 * be scored worse and discarded — so the only honest reconstruction is to match chapter count and
 * titles against the text that shipped.
 *
 * That gap matters beyond any one script: an A/B replay that hydrates "the outline" by taking the
 * last response is replaying an outline the run never used. N5 is the same finding, fixed live.
 */
export const shippedOutline = (runDir, manuscript) => {
  const candidates = responsesFor(runDir, /Agent7-NarrativeFormatter/);
  if (candidates.length === 0) return { parsed: null, file: null, match: null };
  const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const chapterTitles = manuscript.chapters.map((c) => norm(c.title));
  const scored = candidates.map((candidate) => {
    const scenes = (candidate.parsed.acts ?? []).flatMap((a) => (Array.isArray(a.scenes) ? a.scenes : []));
    const countMatch = scenes.length === manuscript.chapters.length;
    const titleHits = scenes.filter((s, i) => {
      const t = norm(s?.title);
      return t && chapterTitles[i] && (chapterTitles[i].includes(t) || t.includes(chapterTitles[i]));
    }).length;
    return { ...candidate, scenes: scenes.length, countMatch, titleHits };
  });
  scored.sort((a, b) => (b.countMatch ? 1 : 0) - (a.countMatch ? 1 : 0) || b.titleHits - a.titleHits);
  const best = scored[0];
  return {
    parsed: best.parsed,
    file: best.file,
    match: { attempts: scored.length, scenes: best.scenes, titleHits: best.titleHits, of: manuscript.chapters.length },
  };
};

/**
 * Split a saved story into chapters and paragraphs.
 *
 * Deliberately reads the SHIPPED markdown rather than any intermediate: the acceptance test's whole
 * claim is about the text a reader receives, after every regen, injector and sweep has run.
 *
 * Accepts a directory (finds the single `.md`) or a path to the file itself, because the calibration
 * manifest names files and the backtest names directories.
 */
export const readManuscript = (storyPathOrDir) => {
  let file = storyPathOrDir;
  if (!storyPathOrDir.endsWith(".md")) {
    const found = readdirSync(storyPathOrDir).find((f) => f.endsWith(".md"));
    if (!found) return { chapters: [], title: null, file: null };
    file = join(storyPathOrDir, found);
  }
  const text = readFileSync(file, "utf8");
  const title = text.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? null;
  const chapters = [];
  const re = /^##\s+Chapter\s+(\d+)\s*:?\s*(.*)$/gm;
  const marks = [...text.matchAll(re)];
  marks.forEach((mark, i) => {
    const body = text.slice(mark.index + mark[0].length, i + 1 < marks.length ? marks[i + 1].index : text.length);
    const paragraphs = body
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s+/g, " ").trim())
      .filter((p) => p && p !== "---");
    chapters.push({ chapterNumber: Number(mark[1]), title: mark[2].trim(), paragraphs });
  });
  return { chapters, title, file };
};

/**
 * The locked-fact registry as Agent 3b built it, reconstructed from its response.
 *
 * X12: geometry's `accountedTimes` comes from here, and a probe that omits it silently runs the old
 * "exactly two times" rule under the new name.
 */
export const lockedFactsFrom = (deviceDoc) =>
  (Array.isArray(deviceDoc?.devices) ? deviceDoc.devices[0]?.lockedFacts ?? [] : []).filter(
    (f) => typeof f?.id === "string" && typeof f?.value === "string" && f.value.trim().length > 0,
  );

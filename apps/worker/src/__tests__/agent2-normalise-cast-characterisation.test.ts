import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { normaliseCastOutput } from "../jobs/agents/agent2-run.js";

/**
 * CR-12 (A1X-04) — characterisation of normaliseCastOutput (330 lines, cc 67, untested until now), written
 * before its phases move out. Corpus: every Agent 2 cast archived in data/store.json, plus damage applied to
 * a handful — the shapes a model reply takes: snake_case crimeDynamics, relationships as a bare array or
 * nested per character, missing genders, off-vocabulary enums, no diversity block, no role tags. Per cast:
 * a digest of the normalised cast and the exact warnings it wrote.
 */
const STORE = join(__dirname, "..", "..", "..", "..", "data", "store.json");
const casts: Array<{ id: string; cast: Record<string, any> }> = existsSync(STORE)
  ? Object.values(JSON.parse(readFileSync(STORE, "utf8")).artifacts as Record<string, any>)
      .filter((a) => a?.type === "cast" && a.payload?.cast?.characters)
      .map((a) => ({ id: String(a.id), cast: a.payload.cast }))
      .sort((x, y) => x.id.localeCompare(y.id))
      // A_111: one row per DISTINCT cast. Every prose redo copies the project's artifacts into the store, so without this
      // each paid run added rows of a cast already characterised and broke the snapshot (2026-10-06: three times).
      .filter((row, i, all) => all.findIndex((other) => JSON.stringify(other.cast) === JSON.stringify(row.cast)) === i)
  : [];
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));
const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 16);

const DAMAGE: Record<string, (c: Record<string, any>) => Record<string, any>> = {
  "snake_case crimeDynamics": (c) => {
    const cd = c.crimeDynamics ?? {};
    c.crimeDynamics = { possible_culprits: cd.possibleCulprits, red_herrings: cd.redHerrings, victim_candidates: cd.victimCandidates, detective_candidates: cd.detectiveCandidates };
    return c;
  },
  "relationships as a bare array": (c) => { c.relationships = (c.relationships?.pairs ?? []).slice(0, 3); return c; },
  "relationships nested per character": (c) => {
    const pairs = c.relationships?.pairs ?? [];
    delete c.relationships;
    for (const ch of c.characters ?? []) ch.relationships = pairs.filter((p: any) => p?.character1 === ch.name).map((p: any) => ({ with: p.character2, relationship: p.relationship, tension: p.tension }));
    return c;
  },
  "genders missing": (c) => { for (const ch of c.characters ?? []) delete ch.gender; return c; },
  "off-vocabulary enums": (c) => {
    for (const ch of c.characters ?? []) { ch.motiveStrength = "Overwhelming"; ch.accessPlausibility = "Likely"; ch.gender = "M"; }
    for (const p of c.relationships?.pairs ?? []) p.tension = "severe";
    return c;
  },
  // every tension branch: a synonym per band and one word no band knows (the fallback)
  "tension vocabulary": (c) => { const words = ["medium", "unclear", "mild", "calm", "intense"]; (c.relationships?.pairs ?? []).forEach((p: any, i: number) => { p.tension = words[i % words.length]; }); return c; },
  "no diversity, no role tags": (c) => { delete c.diversity; for (const ch of c.characters ?? []) delete ch.role; return c; },
  "crimeDynamics missing": (c) => { delete c.crimeDynamics; return c; },
};

const run = (cast: Record<string, any>) => {
  const warnings: string[] = [];
  try {
    normaliseCastOutput(cast, warnings);
    return { cast: digest(cast), warnings };
  } catch (e) {
    return { threw: (e as Error).message, warnings };
  }
};

describe("normaliseCastOutput characterisation (A1X-04)", () => {
  it("covers the archive", () => { expect(casts.length).toBeGreaterThanOrEqual(50); });

  it("every archived Agent 2 cast", () => {
    expect(Object.fromEntries(casts.map(({ id, cast }) => [id, run(clone(cast))]))).toMatchSnapshot();
  });

  for (const [kind, damage] of Object.entries(DAMAGE)) {
    it(`damaged: ${kind}`, () => {
      expect(Object.fromEntries(casts.slice(0, 8).map(({ id, cast }) => [id, run(damage(clone(cast)))]))).toMatchSnapshot();
    });
  }
});

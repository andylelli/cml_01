import { createHash } from "node:crypto";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import yaml from "js-yaml";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getGenerationParams } from "@cml/story-validation";
import { normalizeCmlForGeneration, normalizeCmlForRevision } from "../cml/normalize.js";

/**
 * CR-14 (A34-01) — characterisation of both CML normaliser profiles, written before their shared sections
 * are merged and the generate profile is split into named sections.
 *
 * Corpus: every authored case in library/works (137 real CMLs) plus seven kinds of damage applied to a
 * handful of them — the shapes a model reply takes (no culprit, capitalised enums, one inference step,
 * missing sections, wrong types, extra schema fields, near-empty). Per case and profile the snapshot holds a
 * digest of the normalised CML and, for "generate", the notes it wrote. A digest changes on any byte.
 */
afterEach(() => vi.restoreAllMocks());

const ROOT = join(__dirname, "..", "..", "..", "..", "library", "works");
const works = existsSync(ROOT) ? readdirSync(ROOT).filter((w) => existsSync(join(ROOT, w, "case.cml2.yaml"))).sort() : [];
const load = (w: string) => yaml.load(readFileSync(join(ROOT, w, "case.cml2.yaml"), "utf8")) as Record<string, any>;
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

const DAMAGE: Record<string, (c: Record<string, any>) => Record<string, any>> = {
  "no culprit": (c) => { if (c.CASE?.culpability) c.CASE.culpability.culprits = []; return c; },
  "capitalised enums": (c) => {
    for (const m of c.CASE?.cast ?? []) {
      if (typeof m.culpability === "string") m.culpability = m.culpability.toUpperCase();
      if (typeof m.culprit_eligibility === "string") m.culprit_eligibility = m.culprit_eligibility[0].toUpperCase() + m.culprit_eligibility.slice(1);
      if (typeof m.gender === "string") m.gender = m.gender.toUpperCase();
    }
    return c;
  },
  "one inference step": (c) => { const s = c.CASE?.inference_path?.steps; if (Array.isArray(s)) c.CASE.inference_path.steps = s.slice(0, 1); return c; },
  "sections missing": (c) => { for (const k of ["false_solution", "constraint_space", "quality_controls", "fair_play", "discriminating_test"]) delete c.CASE?.[k]; return c; },
  "wrong types": (c) => { if (c.CASE) { c.CASE.cast = { not: "an array" }; if (c.CASE.inference_path) c.CASE.inference_path.steps = "three steps"; } return c; },
  "extra schema fields": (c) => { for (const m of c.CASE?.cast ?? []) { m.role = "suspect"; m.moral_complexity = "grey"; m.unknown_field = 1; } return c; },
  "near-empty": (c) => ({ CASE: { meta: { title: c.CASE?.meta?.title ?? "Untitled" } } }),
  // Every cast member reduced to a name, so each field default is exercised (a known-positive probe on a
  // default no authored case reaches found the corpus blind to them without this).
  "cast fields blanked": (c) => { if (Array.isArray(c.CASE?.cast)) c.CASE.cast = c.CASE.cast.map((m: any) => ({ name: m?.name })); return c; },
};

const inputs = {
  decade: "1930s", location: "A country house", institution: "Manor", primaryAxis: "temporal",
  castNames: ["Eleanor Voss", "Dr. Mallory Finch", "Captain Ivor Hale", "Beatrice Quill"],
  castGenders: { "Eleanor Voss": "female", "Captain Ivor Hale": "male" },
  victimArchetype: "Dr. Mallory Finch",
} as any;

const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex").slice(0, 16);

function runBoth(raw: Record<string, any>) {
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
  const notes: string[] = [];
  const out: Record<string, unknown> = {};
  try { out.generate = digest(normalizeCmlForGeneration(clone(raw), inputs, notes, getGenerationParams().agent3_cml.params)); } catch (e) { out.generate = `THREW ${(e as Error).message}`; }
  out.notes = notes;
  try { out.revise = digest(normalizeCmlForRevision(clone(raw), getGenerationParams().agent4_cml_validator.params)); } catch (e) { out.revise = `THREW ${(e as Error).message}`; }
  return out;
}

describe("CML normaliser characterisation (CR-14)", () => {
  it("covers the library", () => { expect(works.length).toBeGreaterThanOrEqual(100); });

  it("every authored case, both profiles", () => {
    const table = Object.fromEntries(works.map((w) => [w, runBoth(load(w))]));
    expect(table).toMatchSnapshot();
  });

  for (const [kind, damage] of Object.entries(DAMAGE)) {
    it(`damaged: ${kind}`, () => {
      const table = Object.fromEntries(works.slice(0, 6).map((w) => [w, runBoth(damage(clone(load(w))))]));
      expect(table).toMatchSnapshot();
    });
  }
});

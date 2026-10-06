import { afterEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { getGenerationParams } from "@cml/story-validation";
import { normalizeCmlForGeneration } from "../cml/normalize.js";

/** A_111 (AGENT3_ALIBI_COVERS): the prompt operation, and the alibi-coverage report on the case P-6 exposed. */
const FLAG = "AGENT3_ALIBI_COVERS";
const saved = process.env[FLAG];
afterEach(() => {
  if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved;
  vi.restoreAllMocks();
});

const STORE = "../../data/store.json";
describe.skipIf(!existsSync(STORE))("the alibi-coverage report on the case P-6 exposed", () => {
  const load = () => {
    const store = JSON.parse(readFileSync(STORE, "utf8"));
    const row = Object.values<{ projectId: string; type: string; payload: { CASE: { cast: Array<{ name: string }> } } }>(store.artifacts)
      .find((a) => a.projectId === "canary_1790962241799" && a.type === "cml");
    return row ? structuredClone(row.payload) : null;
  };
  const run = () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    const payload = load();
    if (!payload) return null;
    const notes: string[] = [];
    const inputs = { decade: "1950s", location: "x", institution: "x", primaryAxis: "spatial", castNames: payload.CASE.cast.map((m) => m.name) } as never;
    normalizeCmlForGeneration(payload as never, inputs, notes, getGenerationParams().agent3_cml.params);
    return notes;
  };
  it("OFF: no note (the notes stay byte-identical)", () => {
    delete process.env[FLAG];
    const notes = run();
    if (notes) expect(notes.some((n) => n.includes("alibi-coverage"))).toBe(false);
  });
  it("ON: 0 of 3 innocent alibis contain the actual time of death (the known positive)", () => {
    process.env[FLAG] = "1";
    const notes = run();
    if (notes) expect(notes.find((n) => n.includes("alibi-coverage"))).toMatch(/0 of 3 innocent alibis contain the actual time of death — missing: /);
  });
});

describe("the prompt operation", () => {
  it("ON adds the order of work; OFF does not", async () => {
    const { buildCMLPrompt } = await import("../agent3-cml.js");
    const inputs = {
      decade: "1930s", location: "x", institution: "y", tone: "Cozy", weather: "rain", socialStructure: "g", theme: "t", castSize: 4,
      castNames: ["Ada Vane", "Tom Bell", "Cy Ross", "Di Lowe"], detectiveType: "amateur", victimArchetype: "Cy Ross",
      complexityLevel: "moderate", mechanismFamilies: ["spatial"], primaryAxis: "spatial", hardLogicDevices: [],
    } as never;
    const text = (o: unknown) => (typeof o === "string" ? o : Object.values(o as Record<string, string>).join("\n"));
    delete process.env[FLAG];
    expect(text(buildCMLPrompt(inputs))).not.toContain("ORDER OF WORK: write hidden_model.mechanism.actual_time_of_death FIRST");
    process.env[FLAG] = "1";
    expect(text(buildCMLPrompt(inputs))).toContain("<a time BEFORE the actual time of death> to <a time AFTER it> in <one named place>");
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { getGenerationParams } from "@cml/story-validation";
import { normalizeCmlForGeneration } from "../cml/normalize.js";

/**
 * A_111 CR-i (CML_A110_UPSTREAM): the victim is never a suspect to clear. MEASURED before the fix: 63 of 71 stored CMLs
 * list the victim by exact name in prose_requirements.suspect_clearance_scenes — the gap-fill skipped only the culprit
 * and the detective.
 */
const FLAG = "CML_A110_UPSTREAM";
let saved: string | undefined;
beforeEach(() => {
  saved = process.env[FLAG];
  delete process.env[FLAG];
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "log").mockImplementation(() => {});
});
afterEach(() => {
  if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved;
  vi.restoreAllMocks();
});

const params = () => getGenerationParams().agent3_cml.params;
const clearedOf = (out: any): string[] => (out.CASE.prose_requirements?.suspect_clearance_scenes ?? []).map((e: any) => e.suspect_name);

describe("CR-i — the gap-fill and the model's own list", () => {
  const cast = [
    { name: "Ada Vane", role_archetype: "Amateur Detective" },
    { name: "Cecil Thorne", role_archetype: "Victim" },
    { name: "Beatrice Quill", role_archetype: "Culprit" },
    { name: "Tom Bell", role_archetype: "Harbour master" },
  ];
  const inputs = { decade: "1930s", location: "A harbour town", institution: "Inn", primaryAxis: "spatial", castNames: cast.map((c) => c.name) } as any;
  const raw = () => ({
    CASE: {
      cast: structuredClone(cast),
      culpability: { culprit_count: 1, culprits: ["Beatrice Quill"] },
      prose_requirements: {
        culprit_revelation_scene: { act_number: 3, scene_number: 4 },
        suspect_clearance_scenes: [{ suspect_name: "Cecil Thorne", act_number: 2, scene_number: 3, clearance_method: "Alibi confirmed" }],
      },
    },
  });

  it("OFF: the victim stays a suspect to clear (the defect, as shipped)", () => {
    const out = normalizeCmlForGeneration(raw(), inputs, [], params()) as any;
    expect(clearedOf(out)).toContain("Cecil Thorne");
  });

  it("ON: the victim is removed from the model's list and never added; the innocent suspect is still cleared", () => {
    process.env[FLAG] = "1";
    const out = normalizeCmlForGeneration(raw(), inputs, [], params()) as any;
    expect(clearedOf(out)).not.toContain("Cecil Thorne");
    expect(clearedOf(out)).toContain("Tom Bell");
    expect(clearedOf(out)).not.toContain("Beatrice Quill");
  });
});

// The archive as witness: every stored CML, re-normalised. Skips where data/store.json is absent (a fresh worktree).
const STORE = "../../data/store.json";
describe.skipIf(!existsSync(STORE))("CR-i — over the stored CMLs", () => {
  it("OFF lists the victim in most cases; ON in none", () => {
    const store = JSON.parse(readFileSync(STORE, "utf8"));
    const latest = new Map<string, any>();
    for (const a of Object.values<any>(store.artifacts)) if (a.type === "cml") latest.set(a.projectId, a.payload);
    let cases = 0, off = 0, on = 0;
    for (const payload of latest.values()) {
      const c = payload?.CASE;
      const victims = (c?.cast ?? []).filter((m: any) => /victim/i.test(String(m.role_archetype ?? "")));
      if (victims.length !== 1) continue;
      const inputs = { decade: "1930s", location: "x", institution: "x", primaryAxis: "temporal", castNames: c.cast.map((m: any) => m.name) } as any;
      cases++;
      delete process.env[FLAG];
      if (clearedOf(normalizeCmlForGeneration(structuredClone(payload), inputs, [], params())).includes(victims[0].name)) off++;
      process.env[FLAG] = "1";
      if (clearedOf(normalizeCmlForGeneration(structuredClone(payload), inputs, [], params())).includes(victims[0].name)) on++;
    }
    expect(cases).toBeGreaterThan(20);
    expect(off).toBeGreaterThan(cases / 2);
    expect(on).toBe(0);
  });
});

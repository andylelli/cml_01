import { afterEach, describe, expect, it } from "vitest";
import { buildCMLPrompt } from "../agent3-cml.js";

/**
 * A_111 P-8 (AGENT3_ONE_MECHANISM): one device shown once, and the clock kept out of a non-temporal case's reasoning.
 * OFF: the five devices twice and "or a coherent hybrid of two" (the known positive).
 */
const FLAG = "AGENT3_ONE_MECHANISM";
const saved = process.env[FLAG];
afterEach(() => {
  if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved;
});

const device = (title: string) => ({
  title, principleType: "physical", corePrinciple: "a physical principle", surfaceIllusion: "seems", underlyingReality: "is",
  fairPlayClues: ["a", "b"], whyNotTrope: "fresh", variationEscalation: "", mechanismFamilyHints: [], modeTags: [], lockedFacts: [],
});
const inputs = (axis: string) => ({
  decade: "1930s", location: "A country house", institution: "Manor", tone: "Cozy", weather: "rain", socialStructure: "gentry",
  theme: "a test", castSize: 4, castNames: ["Ada Vane", "Tom Bell", "Cy Ross", "Di Lowe"], detectiveType: "amateur",
  victimArchetype: "Cy Ross", complexityLevel: "moderate", mechanismFamilies: ["spatial"], primaryAxis: axis,
  hardLogicDevices: [device("First Device"), device("Second Device"), device("Third Device")],
}) as never;

const text = (axis: string): string => {
  const out = buildCMLPrompt(inputs(axis)) as unknown as { system?: string; developer?: string; user?: string } | string;
  return typeof out === "string" ? out : [out.system, out.developer, out.user].filter(Boolean).join("\n");
};

describe("A_111 P-8 — one mechanism", () => {
  it("OFF: every device, twice, and the hybrid invitation", () => {
    delete process.env[FLAG];
    const t = text("spatial");
    expect(t.split("Second Device").length - 1).toBeGreaterThanOrEqual(2);
    expect(t).toContain("or a coherent hybrid of two");
    expect(t).not.toContain("AT MOST ONE inference step");
  });

  it("ON: only the primary device, once; one trick; at most one clock step on a non-temporal axis", () => {
    process.env[FLAG] = "1";
    const t = text("spatial");
    expect(t).not.toContain("Second Device");
    expect(t.split("First Device").length - 1).toBe(1);
    expect(t).not.toContain("or a coherent hybrid of two");
    expect(t).toContain("Build the whole mechanism on this ONE device");
    expect(t).toContain("On this spatial axis, AT MOST ONE inference step may reason from a clock time");
  });

  it("ON, temporal axis: the clock is the mechanism, so no limit is set", () => {
    process.env[FLAG] = "1";
    expect(text("temporal")).not.toContain("AT MOST ONE inference step");
  });
});

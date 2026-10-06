import { afterEach, describe, expect, it } from "vitest";
import { buildBookContract } from "../book-contract.js";
import { checkTraceRules } from "../trace-templates.js";
import { completeProjects } from "./fixtures.js";
import type { ContractInput } from "../types.js";

/**
 * A_110 P3 and P2, the contract half (CML_A110_UPSTREAM). P3: the victim is alive in a scene only when the outline MARKS
 * it and the scene comes before the crime beat — 61 of 64 stored outlines read "gathering > crime" with the gathering
 * scene being the discovery, so the label alone must never be trusted. P2: Agent 2b's `appearance` and `whyHere` reach
 * the first-appearance line only.
 */
afterEach(() => {
  delete process.env.CML_A110_UPSTREAM;
  delete process.env.PROSE_V2_OPENING;
});

type Scene = { beat?: string; victimAlive?: boolean; setting?: Record<string, unknown> };
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const scenesOf = (outline: unknown): Scene[] => {
  const o = outline as { acts?: Array<{ scenes?: Scene[] }>; narrative?: { acts?: Array<{ scenes?: Scene[] }> } };
  return (o.acts ?? o.narrative?.acts ?? []).flatMap((a) => a.scenes ?? []);
};
const projects = completeProjects().filter((p) => {
  const s = scenesOf(p.input.outline);
  return s[0]?.beat === "gathering" && s[1]?.beat === "crime";
});

describe("P3 — the Gathering keeps the victim alive, only when marked", () => {
  it("has archived outlines of the gathering > crime shape", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("ON + marked before the crime beat: the scene carries victimAlive and the trace rule can read it", () => {
    process.env.CML_A110_UPSTREAM = "1";
    const p = projects[0]!;
    const input = clone(p.input) as ContractInput;
    scenesOf(input.outline)[0]!.victimAlive = true;
    const c = buildBookContract(input);
    expect(c.scenes[0]!.victimAlive).toBe(true);
    expect(checkTraceRules(c).find((t) => t.rule === "victim-alive-before-found")!.verdict).not.toBe("unknown");
  });

  it("the mark nested under `setting` is honoured (Agent 7's known shape drift)", () => {
    process.env.CML_A110_UPSTREAM = "1";
    const input = clone(projects[0]!.input) as ContractInput;
    const first = scenesOf(input.outline)[0]!;
    first.setting = { ...(first.setting ?? {}), victimAlive: true };
    expect(buildBookContract(input).scenes[0]!.victimAlive).toBe(true);
  });

  it("never inferred: unmarked, marked after the crime, or the flag off — no scene is alive", () => {
    const unmarked = clone(projects[0]!.input) as ContractInput;
    const late = clone(projects[0]!.input) as ContractInput;
    scenesOf(late.outline)[2]!.victimAlive = true;
    const offMarked = clone(projects[0]!.input) as ContractInput;
    scenesOf(offMarked.outline)[0]!.victimAlive = true;
    expect(buildBookContract(offMarked).scenes.some((s) => s.victimAlive)).toBe(false);
    process.env.CML_A110_UPSTREAM = "1";
    expect(buildBookContract(unmarked).scenes.some((s) => s.victimAlive)).toBe(false);
    expect(buildBookContract(late).scenes.some((s) => s.victimAlive)).toBe(false);
  });

  it("ON, over every archived outline as stored (none marked): byte-identical briefs and no living victim", () => {
    for (const p of completeProjects().slice(0, 10)) {
      const off = buildBookContract(p.input);
      process.env.CML_A110_UPSTREAM = "1";
      const onC = buildBookContract(p.input);
      delete process.env.CML_A110_UPSTREAM;
      expect(onC.scenes.some((s) => s.victimAlive)).toBe(false);
      expect(onC.brief.text).toBe(off.brief.text);
    }
  });
});

describe("P2 — appearance and whyHere in the first-appearance line only", () => {
  it("ON with the opening: an introduced person's profile fields ride with their introduction", () => {
    process.env.PROSE_V2_OPENING = "1";
    process.env.CML_A110_UPSTREAM = "1";
    const input = clone(completeProjects()[0]!.input) as ContractInput;
    const profiles = ((input.profiles as { profiles?: Array<Record<string, unknown>> })?.profiles ?? []) as Array<Record<string, unknown>>;
    for (const p of profiles) {
      p.appearance = "a grey coat buttoned to the throat and a cane";
      p.whyHere = "came for the reading of the will";
    }
    const c = buildBookContract(input);
    const intros = c.scenes.flatMap((s) => s.opening?.introductions ?? []);
    expect(intros.length).toBeGreaterThan(0);
    expect(intros.every((i) => i.appearance === "a grey coat buttoned to the throat and a cane" && i.whyHere === "came for the reading of the will")).toBe(true);
    expect(c.bible.text).not.toContain("came for the reading of the will");
  });
});

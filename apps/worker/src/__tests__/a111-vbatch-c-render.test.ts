import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { parseClockTime } from "@cml/cml";
import { buildBookContract, type BookContract, type ContractInput } from "@cml/prose-engine";
import { renderSceneContract } from "../jobs/agents/agent9-v2/run.js";

/**
 * ANALYSIS_111 §5, group C — the two V-batch defects that live in the RENDERED contract (run.ts), with every stored
 * case as a witness (skipped without data/store.json) and one synthetic case that carries both defects by construction.
 *   V-2 (WF-005 V2C-02): "The clock: between {actual} and {apparent}" reads backwards when the trick makes the death
 *        look EARLIER — 31 of 64 stored contracts (29 by raw dial, 2 across midnight).
 *   V-5 (V2C-05): "The body: X — found dead" prints in every chapter whose outline lists the victim, at and after the
 *        reveal in 25 of 64.
 */
afterEach(() => {
  delete process.env.PROSE_V2_AUDIT_FIXES;
});

const repoRoot = (): string => {
  let dir = dirname(fileURLToPath(import.meta.url));
  for (let up = 0; up < 8; up += 1) {
    if (existsSync(join(dir, "data", "store.json"))) return dir;
    dir = dirname(dir);
  }
  return join(process.cwd(), "..", "..");
};

const storedInputs = (): ContractInput[] => {
  const path = join(repoRoot(), "data", "store.json");
  if (!existsSync(path)) return [];
  const store = JSON.parse(readFileSync(path, "utf8")) as { artifacts?: Array<{ projectId?: string; type?: string; payload?: unknown }> };
  const by = new Map<string, Record<string, unknown>>();
  for (const a of store.artifacts ?? []) {
    if (!a?.projectId || !a.type) continue;
    if (!by.has(a.projectId)) by.set(a.projectId, {});
    by.get(a.projectId)![a.type] = a.payload;
  }
  const out: ContractInput[] = [];
  for (const a of by.values()) {
    if (!a.cml || !a.outline || !a.clues || !a.cast) continue;
    const cast = (a.cast as { cast?: unknown }).cast ?? a.cast;
    const devices = (a.hard_logic_devices as { devices?: Array<{ lockedFacts?: unknown }> } | undefined)?.devices;
    out.push({
      cml: a.cml,
      clues: a.clues as ContractInput["clues"],
      outline: a.outline as ContractInput["outline"],
      cast: cast as ContractInput["cast"],
      profiles: a.character_profiles as ContractInput["profiles"],
      lockedFacts: (Array.isArray(devices?.[0]?.lockedFacts) ? devices![0]!.lockedFacts : []) as ContractInput["lockedFacts"],
      humourLevel: "classic",
    });
  }
  return out;
};

const inputs = storedInputs();
const build = (input: ContractInput, on: boolean): BookContract => {
  if (on) process.env.PROSE_V2_AUDIT_FIXES = "1";
  else delete process.env.PROSE_V2_AUDIT_FIXES;
  return buildBookContract(input);
};
const dialForward = (from: number, to: number): number => (((to - from) % 720) + 720) % 720;
/** The two times a rendered clock line states, in the order it states them. */
const clockLine = (c: BookContract): string[] =>
  c.scenes.map((s) => renderSceneContract(c, s.chapter).split("\n").find((l) => /^\s+The clock:/.test(l)) ?? "").filter(Boolean);
const backwards = (c: BookContract): boolean =>
  clockLine(c).some((line) => {
    const m = line.match(/between (.+) and (.+)\.$/) ?? line.match(/\bat (.+?); .*\bat (.+)\.$/);
    const a = m ? parseClockTime(m[1]) : null;
    const b = m ? parseClockTime(m[2]) : null;
    return a !== null && b !== null && dialForward(a, b) > 360;
  });
const bodyChapters = (c: BookContract): number[] =>
  c.scenes.filter((s) => / {2}The body: .* — found dead/.test(renderSceneContract(c, s.chapter))).map((s) => s.chapter);

(inputs.length > 0 ? describe : describe.skip)("A_111 V batch C, rendered — every stored case a witness", () => {
  it("V-2: OFF, some crime chapter's clock reads backwards; ON, none does", () => {
    expect(inputs.filter((i) => backwards(build(i, false))).length).toBeGreaterThan(0);
    expect(inputs.filter((i) => backwards(build(i, true))).length).toBe(0);
    expect(inputs.filter((i) => clockLine(build(i, true)).length > 0).length).toBeGreaterThan(0);
  });

  it("V-5: OFF, the body is found at or after the reveal; ON, once, before it", () => {
    expect(inputs.filter((i) => { const c = build(i, false); return bodyChapters(c).some((ch) => ch >= c.roles.reveal); }).length).toBeGreaterThan(0);
    for (const i of inputs) {
      const c = build(i, true);
      const chs = bodyChapters(c);
      expect(chs.length).toBeLessThanOrEqual(1);
      for (const ch of chs) expect(ch).toBeLessThan(c.roles.reveal);
    }
  });
});

describe("A_111 V batch C, rendered — a synthetic case carrying both defects", () => {
  const scene = (n: number, beat: string) => ({
    sceneNumber: n, act: 1, beat, title: `Chapter ${n}`,
    characters: ["Alder Voss", "Brook Hale", "Cedar Lane", "Dell Marsh"], setting: { location: "the hall" },
  });
  const input: ContractInput = {
    cml: {
      CASE: {
        culpability: { culprits: ["Brook Hale"] },
        cast: [
          { name: "Alder Voss", role_archetype: "detective" },
          { name: "Brook Hale", role_archetype: "suspect" },
          { name: "Cedar Lane", role_archetype: "suspect" },
          { name: "Dell Marsh", role_archetype: "victim" },
        ],
        // The trick makes the death look EARLIER than it was: the OFF window reads "between ten o'clock and half past nine".
        hidden_model: { mechanism: { description: "a clock set back", actual_time_of_death: "ten o'clock", apparent_time_of_death: "half past nine" } },
      },
    },
    clues: { clues: [] },
    outline: { acts: [{ scenes: [scene(1, "crime"), scene(2, "investigation"), scene(3, "final_trap"), scene(4, "revelation"), scene(5, "resolution")] }] },
    cast: { characters: [{ name: "Alder Voss" }, { name: "Brook Hale" }, { name: "Cedar Lane" }, { name: "Dell Marsh", role_archetype: "victim" }] },
    lockedFacts: [
      { id: "true_time", value: "ten o'clock", description: "the true time of death" },
      { id: "false_time", value: "half past nine", description: "the time the clock was made to show" },
    ],
    humourLevel: "classic",
  };

  it("OFF: the window reads backwards and the body is found again at and after the reveal (the known positives)", () => {
    const c = build(input, false);
    expect(clockLine(c)[0]).toBe("  The clock: between ten o'clock and half past nine.");
    expect(bodyChapters(c)).toContain(c.roles.reveal);
    expect(bodyChapters(c)).toContain(c.roles.reveal + 1);
  });

  it("ON: two instants, earlier first, and the body found once, before the reveal", () => {
    const c = build(input, true);
    expect(clockLine(c)[0]).toBe("  The clock: the death was made to seem to fall at half past nine; Dell Marsh truly died at ten o'clock.");
    expect(bodyChapters(c)).toEqual([1]);
  });
});

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { parseClockTime } from "@cml/cml";
import {
  deviceContradicts,
  expectedDirection,
  falseAndTrueClocks,
  fixText,
  repairDeviceDirection,
} from "../jobs/agents/agent3b/device-direction.js";

/** The clock's direction at source — the external read of seed 5670: "set back fifteen minutes, not forward". */
describe("expectedDirection", () => {
  it("a clock showing earlier than the truth was set back; later, forward; shortest way round the dial", () => {
    expect(expectedDirection(parseClockTime("a quarter to six")!, parseClockTime("six o'clock")!)).toBe("back");
    expect(expectedDirection(parseClockTime("half past nine")!, parseClockTime("ten past ten")!)).toBe("back");
    expect(expectedDirection(parseClockTime("twenty past ten")!, parseClockTime("ten o'clock")!)).toBe("forward");
    expect(expectedDirection(parseClockTime("ten o'clock")!, parseClockTime("ten o'clock")!)).toBeNull();
  });
});

describe("fixText", () => {
  it("rewrites the 5670 device's sentences to 'back'", () => {
    const core = "A large mechanical clock in the theatre foyer was wound forward exactly by thirty minutes shortly after the murder.";
    expect(fixText(core, "back")).toBe("A large mechanical clock in the theatre foyer was wound back exactly by thirty minutes shortly after the murder.");
    expect(fixText("The culprit advanced the theatre foyer clock by thirty minutes.", "back")).toBe("The culprit set back the theatre foyer clock by thirty minutes.");
  });
  it("rewrites 'back' to 'forward' when the clock runs ahead", () => {
    expect(fixText("She turned the hall clock back twenty minutes.", "forward")).toBe("She turned the hall clock forward twenty minutes.");
    expect(fixText("He rewound the watch.", "forward")).toBe("He wound forward the watch.");
  });
  it("leaves agreeing text and sentences that are not about a clock alone", () => {
    expect(fixText("The clock was set back fifteen minutes.", "back")).toBe("The clock was set back fifteen minutes.");
    expect(fixText("The inspector set forward a theory.", "back")).toBe("The inspector set forward a theory.");
  });
});

describe("over the archived devices", () => {
  const store = JSON.parse(readFileSync(join(__dirname, "..", "..", "..", "..", "data", "store.json"), "utf8"));
  const arts: any[] = Array.isArray(store.artifacts) ? store.artifacts : Object.values(store.artifacts);
  const cases = arts
    .filter((a) => a?.type === "hard_logic_devices")
    .map((a) => ({ id: a.projectId as string, device: a.payload?.devices?.[0] }))
    .filter((c) => c.device)
    .map((c) => {
      const pair = falseAndTrueClocks(c.device.lockedFacts ?? [], parseClockTime);
      const want = pair ? expectedDirection(pair.shown, pair.truth) : null;
      return { ...c, want };
    })
    .filter((c): c is typeof c & { want: "forward" | "back" } => c.want !== null);

  it("repairs exactly the contradicting devices (5670's among them) and leaves the agreeing ones byte-identical", () => {
    let repaired = 0;
    for (const c of cases) {
      const device = JSON.parse(JSON.stringify(c.device));
      const before = JSON.stringify(device);
      const was = deviceContradicts(device, c.want);
      const changed = repairDeviceDirection(device, c.want);
      if (was) {
        repaired++;
        expect(changed.length, c.id).toBeGreaterThan(0);
        expect(deviceContradicts(device, c.want), c.id).toBe(false);
      } else {
        expect(JSON.stringify(device), c.id).toBe(before);
      }
      // locked fact values and ids are never touched
      expect(device.lockedFacts?.map((f: any) => [f.id, f.value])).toEqual(c.device.lockedFacts?.map((f: any) => [f.id, f.value]));
    }
    expect(repaired).toBeGreaterThanOrEqual(2); // known positives: canary_1790896091452 (seed 5670) and canary_1788155622369
    expect(cases.some((c) => c.id === "canary_1790896091452")).toBe(true);
  });
});

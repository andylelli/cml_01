import { describe, expect, it } from "vitest";
import { jobRegistry } from "../jobs/index.js";

describe("worker job registry (phase 1)", () => {
  it("includes all phase 1 job names", () => {
    expect(Object.keys(jobRegistry)).toEqual([
      "settingJob",
      "castJob",
      "cmlJob",
      "validateCmlJob",
      "cluesJob",
      "outlineJob",
      "proseJob",
      "gamePackJob",
    ]);
  });

  it("runs placeholder job handlers", async () => {
    await expect(jobRegistry.settingJob({})).resolves.toBeUndefined();
  });
});

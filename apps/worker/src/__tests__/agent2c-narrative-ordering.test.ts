/**
 * R2 (architecture/REVIEW_01.md) — Agent 2c's `narrative` read, and the sweep that followed it.
 *
 * THE FINDING. `agent2c-run.ts` passed `narrative: ctx.narrative!` to `generateLocationProfiles`.
 * `ctx.narrative` is assigned only by Agent 7, which runs LONG AFTER 2c — it has to, because Agent 7
 * consumes the location profiles 2c produces. So the value was `undefined` on every run that has
 * ever executed, and the non-null assertion is what stopped the compiler saying so.
 *
 * THE VERDICT. Ordering cannot be reversed without creating a cycle, and the parameter is genuinely
 * optional downstream (`narrative?:`, and the builder derives scene locations only when acts are
 * present). So the fix was to remove the lie, not to move the stage.
 *
 * These tests pin the DEGRADATION PATH — that undefined narrative produces a usable prompt rather
 * than a crash or an empty location set — because that is the behaviour every run actually depends
 * on, and nothing asserted it before.
 */

import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { buildLocationProfilesPrompt } from "@cml/prompts-llm";

// Resolved from this file, not process.cwd() — vitest's cwd is the repo root, not the package root.
const AGENT2C_RUN = fileURLToPath(new URL("../jobs/agents/agent2c-run.ts", import.meta.url));
const ORCHESTRATOR = fileURLToPath(new URL("../jobs/mystery-orchestrator.ts", import.meta.url));

const minimalInputs = () =>
  ({
    settingRefinement: {
      era: { decade: "1950s", technology: ["telephone"], transportation: [], communication: [] },
      location: { type: "country house", description: "Thornfield Manor, isolated on the moor" },
      atmosphere: { weather: "Fog", mood: "Tense" },
    },
    caseData: {
      CASE: {
        meta: { title: "The Frozen Clock", setting: { location: "The Library" }, era: { decade: "1950s" } },
        cast: [{ name: "Inspector Vale", role_archetype: "detective" }],
      },
    },
    tone: "Classic",
    targetWordCount: 1000,
  }) as any;

describe("Agent 2c location profiles without a narrative", () => {
  it("builds a usable prompt when narrative is undefined — the state of EVERY real run", () => {
    const prompt = buildLocationProfilesPrompt({ ...minimalInputs(), narrative: undefined });

    expect(typeof prompt.user).toBe("string");
    expect(prompt.user.length).toBeGreaterThan(200);
    // The setting still reaches the prompt: degrading on narrative must not degrade the rest.
    expect(`${prompt.system}${prompt.user}`).toContain("Thornfield Manor");
  });

  it("does not throw on the shapes an absent narrative can take", () => {
    for (const narrative of [undefined, null, {}, { acts: undefined }, { acts: [] }] as any[]) {
      expect(() => buildLocationProfilesPrompt({ ...minimalInputs(), narrative })).not.toThrow();
    }
  });

  it("still uses a narrative when one IS supplied, so the parameter is not vestigial", () => {
    // The other half of the fix's premise: if this produced identical output either way, the right
    // change would have been to delete the parameter instead of making it optional.
    const withNarrative = buildLocationProfilesPrompt({
      ...minimalInputs(),
      narrative: {
        acts: [{ scenes: [{ setting: "The Observatory Tower" }, { setting: "The Boathouse" }] }],
      },
    } as any);
    const without = buildLocationProfilesPrompt({ ...minimalInputs(), narrative: undefined });

    expect(withNarrative.user).toContain("Observatory Tower");
    expect(without.user).not.toContain("Observatory Tower");
  });
});

describe("R2 sweep — non-null assertions vs the orchestrator's call order", () => {
  it("agent2c no longer asserts ctx.narrative is present", () => {
    // The assertion is the mechanism that hid this for the life of the pipeline. If it comes back,
    // this fails — a source check because the defect was a TYPE claim, not a runtime value.
    const source = readFileSync(AGENT2C_RUN, "utf8");
    expect(source).not.toMatch(/ctx\.narrative!/);
  });

  /**
   * Sweep result, recorded here so it is re-checked rather than remembered.
   *
   * Every `ctx.<field>!` in apps/worker/src/jobs/agents/ was checked against the orchestrator's
   * call order. `ctx.narrative` in 2c was the ONLY violation. The rest are satisfied:
   *
   *   agent2  (2nd)  setting                                          ← agent1
   *   agent2e (3rd)  setting, cast                                    ← agent1, agent2
   *   agent3b (4th)  setting, cast, backgroundContext                 ← agent1, agent2, agent2e
   *   agent3  (5th)  setting, cast, backgroundContext,
   *                  hardLogicDevices, hardLogicDirectives            ← agent3b writes both
   *   agent5  (6th)  cml                                              ← agent3
   *   agent6  (7th)  cml, clues                                       ← agent3, agent5
   *   agent2b (8th)  cml, cast                                        ← agent3, agent2
   *   agent2c (8th)  setting, cml, backgroundContext                  ← all upstream
   *   agent2d (8th)  setting, cml, backgroundContext                  ← all upstream
   *   agent65 (9th)  cml, character/location profiles, temporal,
   *                  backgroundContext, hardLogicDevices, clues       ← all upstream
   *   agent7 (10th)  cml, cast, clues                                 ← all upstream
   *
   * Self-writes (agent3's noveltyAudit, agent6's coverageResult, agent3b's hardLogicDevices) are
   * assigned by the same agent before being read and are not ordering claims.
   */
  it("records the sweep as a fixed list so a new stage cannot silently reorder past it", () => {
    // Guards the one ordering fact 2c actually depends on: Agent 7 runs after Agent 2c, so any
    // future attempt to feed 2c a narrative has to solve the cycle, not just remove the `?`.
    const orchestrator = readFileSync(ORCHESTRATOR, "utf8");
    // Anchor on the STAGE CALLS, not the first textual occurrence — `"narrative"` also appears in
    // type declarations far above the pipeline, which would make a naive indexOf pass by accident.
    const locationProfilesAt = orchestrator.indexOf('stage("locationProfiles"');
    const narrativeAt = orchestrator.indexOf('stage("narrative"');

    expect(locationProfilesAt).toBeGreaterThan(-1);
    expect(narrativeAt).toBeGreaterThan(-1);
    expect(locationProfilesAt).toBeLessThan(narrativeAt);
  });
});

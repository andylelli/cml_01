import { afterEach, describe, expect, it } from "vitest";
import { enforceVictimRoleInvariant } from "../jobs/agents/agent2-run.js";

/**
 * A_111 CR-a — owner decision 2's tie rule. Seed 82094's model marked TWO members `role: victim` (the real victim, and
 * a suspect who was that run's culprit). With CML_IDENTITY_ROLE_WINS the explicit role wins everywhere downstream, so
 * the cast must leave Agent 2 with exactly one; the tie is broken by the cast's own evidence before list order.
 */
const FLAG = "CML_IDENTITY_ROLE_WINS";
const saved = process.env[FLAG];
afterEach(() => {
  if (saved === undefined) delete process.env[FLAG]; else process.env[FLAG] = saved;
});

const cast = () => ({
  characters: [
    { name: "Adela Halloway", roleArchetype: "Private Investigator", role: "detective" },
    { name: "Ivor Yardley", roleArchetype: "Circus owner with debts", role: "victim" },
    { name: "Cecil Thorne", roleArchetype: "Wealthy landowner and victim", role: "victim" },
    { name: "Harriet Bellamy", roleArchetype: "Housekeeper", role: "suspect" },
  ],
  crimeDynamics: { possibleCulprits: ["Ivor Yardley", "Harriet Bellamy"], redHerrings: [], victimCandidates: ["Cecil Thorne"], detectiveCandidates: ["Adela Halloway"] },
});
const roles = (c: Record<string, unknown>) =>
  Object.fromEntries((c.characters as Array<{ name: string; role: string }>).map((m) => [m.name, m.role]));

describe("A_111 CR-a — two members carry role: victim", () => {
  // Step 6/7 of the invariant already re-tags exactly one victim; what the tie decides is WHICH one.
  it("OFF: list order decides — here the suspect listed first is kept as the victim, and the real one demoted", () => {
    delete process.env[FLAG];
    const c = cast();
    enforceVictimRoleInvariant(c, []);
    expect((c.crimeDynamics as { victimCandidates: string[] }).victimCandidates).toEqual(["Ivor Yardley"]);
    expect(roles(c)["Cecil Thorne"]).toBe("suspect");
  });

  it("ON: the cast's own evidence decides (archetype or victimCandidates), and exactly one victim remains", () => {
    process.env[FLAG] = "1";
    const c = cast();
    enforceVictimRoleInvariant(c, []);
    expect((c.crimeDynamics as { victimCandidates: string[] }).victimCandidates).toEqual(["Cecil Thorne"]);
    expect(roles(c)["Cecil Thorne"]).toBe("victim");
    expect(roles(c)["Ivor Yardley"]).toBe("suspect");
    expect(Object.values(roles(c)).filter((r) => r === "victim")).toHaveLength(1);
  });

  it("ON with one role: victim — the same victim as OFF (the flip changes nothing on an untied cast)", () => {
    const untied = () => { const c = cast(); (c.characters[1] as { role: string }).role = "suspect"; return c; };
    delete process.env[FLAG];
    const off = untied(); enforceVictimRoleInvariant(off, []);
    process.env[FLAG] = "1";
    const on = untied(); enforceVictimRoleInvariant(on, []);
    expect(roles(on)).toEqual(roles(off));
  });
});

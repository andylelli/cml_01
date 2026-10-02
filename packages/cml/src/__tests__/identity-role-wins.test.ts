import { afterEach, describe, expect, it, vi } from "vitest";
import { explicitRoleOf, isDetectiveMember, isVictimMember, resolveIdentity } from "../roles.js";

/**
 * Owner decision 2 (2026-10-01, A1X-Q01): the explicit `role` enum wins over the archetype; shipped behind
 * CML_IDENTITY_ROLE_WINS (default OFF) with every disagreement logged as [identity-disagree].
 */
const saved = process.env.CML_IDENTITY_ROLE_WINS;
afterEach(() => {
  if (saved === undefined) delete process.env.CML_IDENTITY_ROLE_WINS;
  else process.env.CML_IDENTITY_ROLE_WINS = saved;
  vi.restoreAllMocks();
});

describe("the unified predicate (role wins)", () => {
  it("reads the schema enum case-insensitively, and nothing else as a role", () => {
    expect(explicitRoleOf({ role: "Detective" })).toBe("detective");
    expect(explicitRoleOf({ role: "consulting detective" })).toBeUndefined();
    expect(explicitRoleOf({})).toBeUndefined();
  });

  it("an explicit role beats a detective-sounding archetype (the archive's 'Outsider Investigator' class)", () => {
    expect(isDetectiveMember({ role_archetype: "Outsider Investigator", role: "suspect" })).toBe(false);
    expect(isDetectiveMember({ role_archetype: "police inspector, official authority", role: "suspect" })).toBe(false);
  });

  it("without a role, the archetype predicates decide — including the relational exclusions", () => {
    expect(isDetectiveMember({ role_archetype: "Consulting detective" })).toBe(true);
    expect(isVictimMember({ role_archetype: "Friend of the victim" })).toBe(false);
    expect(isVictimMember({ role_archetype: "innocent heiress", role: "victim" })).toBe(true);
  });
});

describe("the shadow phase", () => {
  const outsider = { name: "Mr. Grey", role_archetype: "Outsider Investigator", role: "suspect" };

  it("OFF keeps the old verdict and logs the disagreement", () => {
    delete process.env.CML_IDENTITY_ROLE_WINS;
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveIdentity("test.site", "detective", outsider, true)).toBe(true);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[identity-disagree] site=test.site kind=detective member="Mr. Grey" old=true unified=false'));
  });

  it("ON returns the unified verdict", () => {
    process.env.CML_IDENTITY_ROLE_WINS = "true";
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveIdentity("test.site", "detective", outsider, true)).toBe(false);
  });

  it("agreement logs nothing", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(resolveIdentity("test.site", "victim", { name: "V", role: "victim" }, true)).toBe(true);
    expect(warn).not.toHaveBeenCalled();
  });
});

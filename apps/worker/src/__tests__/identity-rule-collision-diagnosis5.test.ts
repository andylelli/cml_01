import { afterEach, describe, expect, it } from "vitest";
import {
  applyIdentityRuleCollisionRepair,
  detectIdentityRuleOccupationCollisions,
} from "../jobs/agents/agent7-run.js";

/**
 * DIAGNOSIS-BATCH #5 — the stage-manager pronoun/role-label collision.
 *
 * MEASURED, story_20260903-0738 (external read 78/100). Agent 3 (CML generation) runs BEFORE Agent
 * 2b/Agent 65 in this pipeline's real execution order (confirmed against the runId-scoped prompt
 * log, not assumed from CLAUDE.md's simplified doc order) — so it independently invented "the stage
 * manager" as culprit Ivor Kestrel's pre-reveal `identity_rules` alias, with no visibility into
 * Marguerite Yardley's real `occupation: "Stage Manager"`, assigned later. Nothing anywhere cross-
 * checked one against the other, and `prose-consistency-validator.ts`'s pronoun detectors are
 * confirmed role-noun-blind (name-token index only) — this class of collision is invisible to every
 * existing check, not merely uncaught by one.
 */

const KESTREL_RULE = { character_name: "Ivor Kestrel", before_reveal_reference: "the stage manager", after_reveal_reference: "Ivor Kestrel" };
const CAST = [
  { name: "Marguerite Yardley", occupation: "Stage Manager" },
  { name: "Ivor Kestrel", occupation: "Lighting Designer" },
  { name: "Gwendolyn Thorne", occupation: "Leading Actress" },
];

describe("detectIdentityRuleOccupationCollisions (pure)", () => {
  it("catches the ACTUAL measured collision: Kestrel's alias vs. Marguerite's real occupation", () => {
    const collisions = detectIdentityRuleOccupationCollisions([KESTREL_RULE], CAST);
    expect(collisions).toHaveLength(1);
    expect(collisions[0]).toMatchObject({
      characterName: "Ivor Kestrel",
      alias: "the stage manager",
      collidesWithCharacter: "Marguerite Yardley",
    });
  });

  it("is article- and case-insensitive: 'Stage Manager' collides with 'the stage manager'", () => {
    const rule = { character_name: "Ivor Kestrel", before_reveal_reference: "Stage Manager" };
    expect(detectIdentityRuleOccupationCollisions([rule], CAST)).toHaveLength(1);
  });

  it("does NOT flag a character colliding with their OWN occupation", () => {
    // Marguerite's own alias matching her own occupation is not a collision — it would be a name-vs-
    // self reference, never ambiguous.
    const selfRule = { character_name: "Marguerite Yardley", before_reveal_reference: "the stage manager" };
    expect(detectIdentityRuleOccupationCollisions([selfRule], CAST)).toEqual([]);
  });

  it("does NOT flag an alias with no occupation match at all", () => {
    const rule = { character_name: "Ivor Kestrel", before_reveal_reference: "the stranger" };
    expect(detectIdentityRuleOccupationCollisions([rule], CAST)).toEqual([]);
  });

  it("returns [] for missing/empty inputs without throwing", () => {
    expect(detectIdentityRuleOccupationCollisions(undefined, CAST)).toEqual([]);
    expect(detectIdentityRuleOccupationCollisions([KESTREL_RULE], undefined)).toEqual([]);
    expect(detectIdentityRuleOccupationCollisions([], [])).toEqual([]);
  });

  it("checks EVERY rule independently — one clean, one colliding", () => {
    const clean = { character_name: "Ivor Kestrel", before_reveal_reference: "the visitor" };
    const collisions = detectIdentityRuleOccupationCollisions([clean, KESTREL_RULE], CAST);
    expect(collisions).toHaveLength(1);
    expect(collisions[0].ruleIndex).toBe(1);
  });
});

describe("applyIdentityRuleCollisionRepair (ctx-coupled)", () => {
  const FLAG = "AGENT7_IDENTITY_RULE_COLLISION_GUARD";
  const orig = process.env[FLAG];
  afterEach(() => {
    if (orig === undefined) delete process.env[FLAG];
    else process.env[FLAG] = orig;
  });

  const makeCtx = () => ({
    cml: { CASE: { prose_requirements: { identity_rules: [KESTREL_RULE] } } },
    cast: { cast: { characters: CAST } },
    warnings: [] as string[],
  });

  it("flag OFF (default): warns but does NOT drop the colliding rule — measure only", () => {
    delete process.env[FLAG];
    const ctx = makeCtx() as any;
    applyIdentityRuleCollisionRepair(ctx);
    expect(ctx.warnings.some((w: string) => w.includes("identity-rule collision"))).toBe(true);
    expect(ctx.warnings.some((w: string) => w.includes("NOT repaired"))).toBe(true);
    expect(ctx.cml.CASE.prose_requirements.identity_rules).toHaveLength(1); // untouched
  });

  it("flag ON: drops the colliding rule so Agent 7/9 fall back to the real name", () => {
    process.env[FLAG] = "true";
    const ctx = makeCtx() as any;
    applyIdentityRuleCollisionRepair(ctx);
    expect(ctx.warnings.some((w: string) => w.includes("REPAIRED"))).toBe(true);
    expect(ctx.cml.CASE.prose_requirements.identity_rules).toHaveLength(0);
  });

  it("flag ON, no collision: leaves a clean identity_rules array completely alone", () => {
    process.env[FLAG] = "true";
    const ctx = makeCtx() as any;
    ctx.cml.CASE.prose_requirements.identity_rules = [
      { character_name: "Ivor Kestrel", before_reveal_reference: "the stranger" },
    ];
    applyIdentityRuleCollisionRepair(ctx);
    expect(ctx.warnings).toEqual([]);
    expect(ctx.cml.CASE.prose_requirements.identity_rules).toHaveLength(1);
  });

  it("does not throw on missing ctx.cml / ctx.cast — degrades to a no-op", () => {
    const ctx = { cml: undefined, cast: undefined, warnings: [] as string[] } as any;
    expect(() => applyIdentityRuleCollisionRepair(ctx)).not.toThrow();
    expect(ctx.warnings).toEqual([]);
  });
});

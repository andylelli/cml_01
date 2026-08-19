import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { countSuspectClosureScenes } from "../jobs/agents/agent7-run.js";
import { buildOutlineRepairGuardrails, type OutlineCoverageIssue } from "../jobs/agents/shared.js";

/**
 * X32 / X62 — the clearance floor had no ceiling, and its wordlists could not read the outline.
 *
 * REVIEW_13 §5 offered `AGENT9_FOLD_SUSPECT_CLEARANCES` as the fix for pacing's only named defect.
 * The 08-19 run settles it: the flag's guardrail hung off `missing_suspect_closure_scene`, which
 * fires when the outline has NO closure language — and an outline that repeats clearances satisfies
 * that check by definition. On the run whose manuscript clears its suspects in chapters 6, 9 and 10,
 * the guardrail was never emitted at all. Folding cannot repair an absence.
 *
 * Underneath it, both wordlists shipped a stem with a trailing `\b`, which cannot match.
 */

/** The Act 2 scene from the real 08-19 outline (run_20260818-2204), verbatim. */
const CLEARING_THE_OTHERS = {
  sceneNumber: 6,
  title: "Clearing the Others",
  purpose: "Establish alibis and eliminate suspects except Hugo",
  summary:
    "Mallory interviews Beatrice, Captain Hale, and Sylvia, verifying their alibis with staff logs " +
    "and witness testimonies. Beatrice's presence in the staff basement, Captain Hale's dining hall " +
    "attendance, and Sylvia's continuous service are all confirmed, eliminating them from suspicion.",
  dramaticElements: { revelation: "" },
};

/** The Act 3 scene from the same outline. */
const CLEARANCES_AND_CULPRIT = {
  sceneNumber: 10,
  title: "Clearances and Culprit Revealed",
  purpose: "Clear innocent suspects, confront and reveal Hugo Vane as culprit",
  summary:
    "Mallory methodically clears Captain Ivor Hale, Beatrice Quill, and Sylvia Trent using hotel " +
    "layout, staff logs, and witness testimonies confirming their alibis. She confronts Hugo Vane " +
    "with the mechanical evidence and timing contradictions.",
  dramaticElements: { revelation: "" },
};

const INNOCENT_SCENE = {
  sceneNumber: 3,
  title: "Wounds and Watches",
  purpose: "Establish the medical timeline",
  summary: "Mallory examines the body and records the state of the wound against the clock evidence.",
  dramaticElements: { revelation: "" },
};

const outlineOf = (...scenes: unknown[]) => ({ acts: [{ scenes }] });

describe("countSuspectClosureScenes — the ceiling Check 2 never had (X32)", () => {
  it("counts BOTH clearance scenes in the real 08-19 outline", () => {
    const titles = countSuspectClosureScenes(outlineOf(INNOCENT_SCENE, CLEARING_THE_OTHERS, CLEARANCES_AND_CULPRIT));
    expect(titles).toEqual(["Clearing the Others", "Clearances and Culprit Revealed"]);
  });

  it("reads the inflections the old wordlists could not — this is why 08-19 counted one, not two", () => {
    // `\b(...|eliminat|...)\b` cannot match "eliminate"/"eliminating"; `\balibi\b` cannot match
    // "alibis". "Clearing the Others" contains BOTH and used to score zero.
    expect(countSuspectClosureScenes(outlineOf(CLEARING_THE_OTHERS))).toEqual(["Clearing the Others"]);
  });

  it("stays silent on a scene with no clearance job", () => {
    expect(countSuspectClosureScenes(outlineOf(INNOCENT_SCENE))).toEqual([]);
  });

  it("one clearance scene is correct, not a defect", () => {
    expect(countSuspectClosureScenes(outlineOf(INNOCENT_SCENE, CLEARANCES_AND_CULPRIT))).toHaveLength(1);
  });

  it("is total on malformed or absent outlines", () => {
    expect(countSuspectClosureScenes(undefined)).toEqual([]);
    expect(countSuspectClosureScenes({})).toEqual([]);
    expect(countSuspectClosureScenes({ acts: [{ scenes: null }] })).toEqual([]);
    expect(countSuspectClosureScenes({ acts: [{ scenes: ["not a scene"] }] })).toEqual([]);
  });
});

describe("buildOutlineRepairGuardrails — folding answers the ceiling, not the floor", () => {
  const CML = { CASE: { culpability: { culprits: ["Hugo Vane"] } } } as any;
  const issue = (type: OutlineCoverageIssue["type"]): OutlineCoverageIssue[] => [{ type, message: "x" }];
  const original = process.env.AGENT9_FOLD_SUSPECT_CLEARANCES;
  beforeEach(() => { delete process.env.AGENT9_FOLD_SUSPECT_CLEARANCES; });
  afterEach(() => {
    if (original === undefined) delete process.env.AGENT9_FOLD_SUSPECT_CLEARANCES;
    else process.env.AGENT9_FOLD_SUSPECT_CLEARANCES = original;
  });

  it("the FLOOR asks for a clearance scene — folding cannot repair an absence", () => {
    const g = buildOutlineRepairGuardrails(issue("missing_suspect_closure_scene"), CML).join(" ");
    expect(g).toMatch(/include at least one scene/i);
    expect(g).not.toMatch(/do NOT allocate a separate scene/i);
  });

  it("the CEILING asks for folding, and names the culprit", () => {
    const g = buildOutlineRepairGuardrails(issue("duplicate_suspect_closure_scenes"), CML).join(" ");
    expect(g).toMatch(/do NOT allocate a separate scene/i);
    expect(g).toMatch(/do not restate a clearance in a later scene/i);
    expect(g).toMatch(/Hugo Vane/);
  });

  it("the fold text is no longer reachable from the floor, which is how it stayed unreachable", () => {
    process.env.AGENT9_FOLD_SUSPECT_CLEARANCES = "true";
    const g = buildOutlineRepairGuardrails(issue("missing_suspect_closure_scene"), CML).join(" ");
    expect(g).not.toMatch(/do NOT allocate a separate scene/i);
  });

  it("no issues, no guardrails", () => {
    expect(buildOutlineRepairGuardrails([], CML)).toEqual([]);
  });
});

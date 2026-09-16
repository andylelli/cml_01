/**
 * A_95 M6 — the middle of the book has no turn.
 *
 * MEASURED over 51 stored outlines: a `false_solution` scene's purpose names an innocent being
 * accused in **23 (45%)**; an `alibis` scene carries its second incident in **2 (4%)**. On the
 * bookshop book (seed 63935) scenes 3-7 were five consecutive "reveal evidence linking Percival"
 * purposes, and the prose carried **0 sentences entertaining another suspect and 0 theories
 * overturned** across ten chapters.
 *
 * The fixtures are that outline's real scene purposes.
 */

import { afterEach, describe, expect, it } from "vitest";

import {
  BEAT_JOBS,
  auditBeatJobs,
  beatJobFor,
  buildBeatJobContract,
  buildBeatJobFeedback,
  isBeatJobFieldsEnabled,
} from "../agent7-beat-jobs.js";
import { buildMacroArcPlan, buildMacroArcPlanFromBeats, isArcFromBeatsEnabled } from "../agent9-prose/types.js";

const FLAGS = ["AGENT7_BEAT_JOB_FIELDS", "AGENT9_ARC_FROM_BEATS"];
const saved = Object.fromEntries(FLAGS.map((f) => [f, process.env[f]]));
afterEach(() => {
  for (const f of FLAGS) {
    if (saved[f] === undefined) delete process.env[f];
    else process.env[f] = saved[f]!;
  }
});

/** The bookshop outline, verbatim purposes, with its real beats. */
const BOOKSHOP = {
  acts: [
    {
      scenes: [
        { sceneNumber: 1, beat: "gathering", purpose: "Introduce the crime and detective" },
        { sceneNumber: 2, beat: "crime", purpose: "Establish the time discrepancy and deepen mystery" },
        { sceneNumber: 3, beat: "first_enquiries", purpose: "Reveal early clues and establish false assumption" },
      ],
    },
    {
      scenes: [
        { sceneNumber: 4, beat: "motives", purpose: "Reveal physical evidence linking Percival to hidden access" },
        { sceneNumber: 5, beat: "alibis", purpose: "Reveal environmental clue confirming hidden hatch" },
        { sceneNumber: 6, beat: "false_solution", purpose: "Reveal physical evidence linking murder weapon to concealed mechanism" },
        { sceneNumber: 7, beat: "secrets", purpose: "Reveal Percival's ledger entries linking him to mirror maintenance and financial motives" },
        { sceneNumber: 8, beat: "pattern", purpose: "Execute the discriminating test proving the hidden hatch and time staging" },
      ],
    },
    {
      scenes: [
        { sceneNumber: 9, beat: "final_trap", purpose: "Clear suspects Iris, Oswald, and Frances with solid alibis" },
        { sceneNumber: 10, beat: "revelation", purpose: "Reveal Percival Orme as the murderer and resolve the case" },
      ],
    },
  ],
};

const FIXED = {
  acts: [
    {
      scenes: [
        { sceneNumber: 6, beat: "false_solution", purpose: "Accuse Iris Thorne of the murder; the ledger hand is not hers", accusedInnocent: "Iris Thorne", flawFound: "The ledger entry is in a left-hander's slope and Iris is right-handed." },
        { sceneNumber: 5, beat: "alibis", purpose: "Alibis are tested, and the shop is broken into during the night", secondIncident: "The bookshop is broken into and the ledger's missing page is taken." },
        { sceneNumber: 4, beat: "motives", purpose: "Motives surface and suspicion shifts to Oswald Merrow", suspicionShiftsTo: "Oswald Merrow" },
        { sceneNumber: 7, beat: "secrets", purpose: "An unrelated lie surfaces: Frances hid a debt that has nothing to do with the death", unrelatedLie: "Frances lied about a debt, unconnected to the murder." },
        { sceneNumber: 10, beat: "revelation", purpose: "The aftermath: what the truth cost Marguerite Selwyn", consequenceFor: "Marguerite Selwyn — she closes the shop." },
      ],
    },
  ],
};

describe("the flags default OFF", () => {
  it("both are off unless .env says so", () => {
    for (const f of FLAGS) delete process.env[f];
    expect(isBeatJobFieldsEnabled()).toBe(false);
    expect(isArcFromBeatsEnabled()).toBe(false);
  });
});

describe("the audit catches the defect on the book it was found in", () => {
  it("THE DEFECT: the bookshop outline fails every job beat it carries", () => {
    const audit = auditBeatJobs(BOOKSHOP);
    expect(audit.checked).toBe(5); // motives, alibis, false_solution, secrets, revelation
    expect(audit.failures).toHaveLength(5);
    const bySceneNo = Object.fromEntries(audit.failures.map((f) => [f.sceneNumber, f]));
    expect(bySceneNo[6]!.beat).toBe("false_solution");
    expect(bySceneNo[6]!.missingFields).toEqual(["accusedInnocent", "flawFound"]);
    expect(bySceneNo[6]!.purposeDoesJob).toBe(false);
    expect(bySceneNo[5]!.missingFields).toEqual(["secondIncident"]);
  });

  it("KNOWN-POSITIVE: a corrected outline passes, so the audit is not simply always-fail", () => {
    const audit = auditBeatJobs(FIXED);
    expect(audit.checked).toBe(5);
    expect(audit.failures).toEqual([]);
  });

  it("a scene with the field but a purpose that does not state the job still fails", () => {
    const half = { acts: [{ scenes: [{ sceneNumber: 6, beat: "false_solution", purpose: "Reveal more evidence about the hatch", accusedInnocent: "Iris Thorne", flawFound: "The slope is wrong." }] }] };
    const audit = auditBeatJobs(half);
    expect(audit.failures).toHaveLength(1);
    expect(audit.failures[0]!.missingFields).toEqual([]);
    expect(audit.failures[0]!.purposeDoesJob).toBe(false);
  });

  it("beats with no job are not checked — gathering, crime, pattern, final_trap", () => {
    for (const beat of ["gathering", "crime", "first_enquiries", "pattern", "final_trap"]) {
      expect(beatJobFor(beat)).toBeUndefined();
    }
    expect(auditBeatJobs({ acts: [{ scenes: [{ sceneNumber: 1, beat: "gathering", purpose: "Anything at all" }] }] }).checked).toBe(0);
  });

  /**
   * MEASURED on run 50862: the audit scored scene 5 as failing when its purpose read "end with a
   * SECOND DRAMATIC INCIDENT" — an adjective between "second" and "incident" broke the match. A false
   * negative in an audit is worse than no audit: it reports a defect that is not there and hides that
   * the contract worked.
   */
  it("REGRESSION: an adjective between 'second' and 'incident' still counts", () => {
    const n = { acts: [{ scenes: [{ sceneNumber: 5, beat: "alibis", purpose: "Test alibis and expose contradictions; end with a second dramatic incident", secondIncident: "A rival's car is tampered with overnight." }] }] };
    expect(auditBeatJobs(n).failures).toEqual([]);
  });

  it("no acts, no crash", () => {
    expect(auditBeatJobs(null)).toEqual({ failures: [], checked: 0 });
  });
});

describe("the contract is an operation with names in it", () => {
  it("every job beat is named, with its fields", () => {
    const block = buildBeatJobContract();
    for (const job of BEAT_JOBS) {
      expect(block).toContain(`**${job.beat}**`);
      for (const f of job.fields) expect(block).toContain(f);
    }
  });

  it("it says the accused is not the culprit — the point of the whole move", () => {
    expect(buildBeatJobContract()).toContain("are NOT the culprit");
  });

  it("no worked example any model could lift (A_67)", () => {
    expect(buildBeatJobContract()).not.toMatch(/Percival|Iris Thorne|mirror|carting|stoop/i);
  });

  it("the feedback names the scene and what it owes", () => {
    const fb = buildBeatJobFeedback(auditBeatJobs(BOOKSHOP));
    expect(fb).toContain("scene 6 (false_solution)");
    expect(fb).toContain("accusedInnocent");
    expect(fb).toContain("the PURPOSE does not state the job");
    expect(buildBeatJobFeedback({ failures: [], checked: 3 })).toBe("");
  });
});

describe("the archetype derives from the beat — one owner (WF-002)", () => {
  const scenes = [
    { beat: "gathering" }, { beat: "crime" }, { beat: "first_enquiries" }, { beat: "motives" },
    { beat: "alibis" }, { beat: "false_solution" }, { beat: "secrets" }, { beat: "pattern" },
    { beat: "final_trap" }, { beat: "revelation" },
  ];

  it("OFF: byte-identical to the positional plan", () => {
    delete process.env.AGENT9_ARC_FROM_BEATS;
    expect(buildMacroArcPlanFromBeats(10, scenes)).toEqual(buildMacroArcPlan(10));
  });

  it("THE POSITIONAL DEFECT: a 10-chapter book never gets CONFRONTATION, and ch10 is told to confess", () => {
    const positional = buildMacroArcPlan(10);
    expect(positional.map((e) => e.archetype)).not.toContain("CONFRONTATION");
    expect(positional[9]!.mustContain).toContain("confession or arrest");
  });

  it("ON: the beats supply CONFRONTATION at the final trap and a reversal in the middle", () => {
    process.env.AGENT9_ARC_FROM_BEATS = "true";
    const plan = buildMacroArcPlanFromBeats(10, scenes);
    const archetypes = plan.map((e) => e.archetype);
    expect(archetypes[8]).toBe("CONFRONTATION");
    expect(archetypes[5]).toBe("RED_HERRING");
    expect(archetypes[6]).toBe("REVERSAL");
    expect(archetypes[9]).toBe("RESOLUTION");
  });

  it("ON: the contract travels with the archetype, so the chapter is told the new job", () => {
    process.env.AGENT9_ARC_FROM_BEATS = "true";
    const plan = buildMacroArcPlanFromBeats(10, scenes);
    expect(plan[8]!.mustContain).toContain("culprit directly present");
    expect(plan[5]!.mustContain).toContain("wrong lead");
  });

  it("an unlabelled scene keeps its positional archetype — a beatless outline is unchanged", () => {
    process.env.AGENT9_ARC_FROM_BEATS = "true";
    const blank = scenes.map(() => ({}));
    expect(buildMacroArcPlanFromBeats(10, blank)).toEqual(buildMacroArcPlan(10));
  });
});

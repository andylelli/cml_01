/**
 * A_96 group B — F3 off-stage actors, F5 mandated values exempt from the ban, F8 describe a character
 * once, F9 the depth beat hands over the trait and not the cause. Each pinned on run 50862.
 */
import { afterEach, describe, expect, it } from "vitest";

import { auditMechanismActors, buildOffstageActorLines, isOffstageActorsEnabled } from "../agent3-offstage-actors.js";
import {
  buildChapterObligationBlock,
  buildDepthBeatLines,
  isDepthTraitOnlyEnabled,
  traitOnly,
} from "../agent9-prose/obligation-block.js";
import { buildWorldBriefBlock, isDescribeOnceEnabled, namesAlreadyOnThePage } from "../agent9-prose/prompt-builder.js";
import { buildRepeatBanBlock, collectRepeatedSpans, isRepeatBanAlibiExemptEnabled, mandatedValuesOf } from "../agent9-prose/repeat-ban.js";

const FLAGS = ["AGENT9_OFFSTAGE_ACTORS", "AGENT9_DEPTH_TRAIT_ONLY", "AGENT9_DESCRIBE_ONCE", "AGENT9_REPEAT_BAN_ALIBI_EXEMPT"];
const saved = Object.fromEntries(FLAGS.map((f) => [f, process.env[f]]));
afterEach(() => {
  for (const f of FLAGS) {
    if (saved[f] === undefined) delete process.env[f];
    else process.env[f] = saved[f]!;
  }
});

/** Run 50862's case, reduced to what these checks read. The mechanism text is verbatim. */
const CASE = {
  hidden_model: {
    mechanism: {
      description:
        "The judge's habitual subtle tilting of the compass casing caused a consistent fifteen-degree offset in the compass bearing, creating a false alibi placing the suspect away from the actual scene. Nora Quayle exploited this authoritative testimony, combined with manipulation of the hotel ledger's timing entries, to fabricate an alibi",
      delivery_path: [{ step: "Judge takes compass bearing with casing tilted, shifting needle reading" }],
      actual_time_of_death: "nine ten",
      apparent_time_of_death: "nine o'clock",
    },
  },
  culpability: { culprits: ["Nora Quayle"] },
  cast: [
    { name: "Gwendolyn Vance", role_archetype: "Guest - Socialite", alibi_window: "in the lounge at nine thirty" },
    { name: "Nora Quayle", role_archetype: "Hotel Proprietor", alibi_window: "in the office from eight forty-five" },
    { name: "Bertram Norbury", role_archetype: "Detective" },
    { name: "Montague Gaunt", role_archetype: "victim" },
  ],
  prose_requirements: {
    suspect_clearance_scenes: [{ suspect_name: "Gwendolyn Vance", act_number: 3, scene_number: 5, clearance_method: "Confirmed presence in lounge with multiple witnesses" }],
    clue_to_scene_mapping: [],
  },
};

describe("flags default OFF", () => {
  it("all four are off unless .env says so", () => {
    for (const f of FLAGS) delete process.env[f];
    expect(isOffstageActorsEnabled()).toBe(false);
    expect(isDepthTraitOnlyEnabled()).toBe(false);
    expect(isDescribeOnceEnabled()).toBe(false);
    expect(isRepeatBanAlibiExemptEnabled()).toBe(false);
  });
});

describe("F3 — the judge is not in the cast", () => {
  it("THE DEFECT: the audit finds the off-stage judge on the run's own mechanism", () => {
    expect(auditMechanismActors(CASE)).toEqual({ offstage: ["judge"], onstage: [] });
  });

  it("KNOWN-POSITIVE: a role a cast member holds is on stage, not flagged", () => {
    const withJudge = { ...CASE, cast: [...CASE.cast, { name: "Sir Hugo Vane", role_archetype: "Race judge" }] };
    expect(auditMechanismActors(withJudge).offstage).toEqual([]);
    expect(auditMechanismActors(withJudge).onstage).toEqual(["judge"]);
  });

  it("the prompt line names the role, says it is not the victim, and forbids the fusion", () => {
    const line = buildOffstageActorLines(CASE).join("\n");
    expect(line).toContain('"the judge"');
    expect(line).toContain("NOT Montague Gaunt, the victim");
    expect(line).toContain("never be fused onto a cast member or onto the victim");
  });

  it("no off-stage actor, no line; and it reaches the chapter block only when the flag is on", () => {
    const withJudge = { ...CASE, cast: [...CASE.cast, { name: "Sir Hugo Vane", role_archetype: "Race judge" }] };
    expect(buildOffstageActorLines(withJudge)).toEqual([]);
    const scene = { sceneNumber: 2, act: 1, beat: "crime", title: "Dissonant Bearings", purpose: "Reveal early contradictions", characters: ["Bertram Norbury"] };
    const block = () => buildChapterObligationBlock([scene], 2, CASE, undefined, undefined, undefined, undefined, undefined, undefined, "rising", undefined, undefined, [scene], undefined, undefined, undefined, undefined);
    delete process.env.AGENT9_OFFSTAGE_ACTORS;
    expect(block()).not.toContain("OFF-STAGE ACTOR");
    process.env.AGENT9_OFFSTAGE_ACTORS = "true";
    expect(block()).toContain("OFF-STAGE ACTOR");
  });
});

describe("F9 — the depth beat hands over the trait, not the cause", () => {
  const harriet = {
    name: "Harriet Kestrel",
    humourStyle: "none",
    humourLevel: 0,
    formativeIncident: "Holds herself rigidly upright and never sits with her back to a door ever since a false accusation of theft at nineteen cost her a post and her good name; she has been guarding both since.",
  };

  it("traitOnly keeps the clause before the origin connector", () => {
    expect(traitOnly(harriet.formativeIncident)).toBe("Holds herself rigidly upright and never sits with her back to a door");
    expect(traitOnly("Walked with a stoop ever since a carting accident at nine.")).toBe("Walked with a stoop");
    expect(traitOnly("Refused to sit with her back to the door — a burglary at the office had taught her that.")).toBe("Refused to sit with her back to the door");
  });

  it("OFF: the whole incident, cause included — the A_91 line, byte-identical", () => {
    delete process.env.AGENT9_DEPTH_TRAIT_ONLY;
    const lines = buildDepthBeatLines(harriet).join("\n");
    expect(lines).toContain("false accusation");
    expect(lines).toContain("shown once and not explained");
  });

  it("ON: the cause is not in the prompt at all, so it cannot be copied (B11)", () => {
    process.env.AGENT9_DEPTH_TRAIT_ONLY = "true";
    const lines = buildDepthBeatLines(harriet).join("\n");
    expect(lines).toContain("never sits with her back to a door");
    expect(lines).not.toContain("false accusation");
    expect(lines).not.toContain("nineteen");
    expect(lines).toContain("withheld from you on purpose");
  });
});

describe("F8 — describe a character once", () => {
  const worldDoc = {
    characterPortraits: [
      { name: "Gwendolyn Vance", portrait: "A pastel tea dress, white gloves, a composed elegance.", eraIntersection: "1930s hotel society" },
      { name: "Harriet Kestrel", portrait: "A crisp cleaning apron and a light knit bolero." },
    ],
  };
  const active = new Set(["Gwendolyn Vance", "Harriet Kestrel"]);

  it("namesAlreadyOnThePage reads prior chapters, not the cast list", () => {
    const prior = [{ title: "Chapter 1", paragraphs: ["Gwendolyn Vance stood by the window."] }];
    const names = ["Gwendolyn Vance", "Harriet Kestrel"];
    expect([...namesAlreadyOnThePage(prior, names)]).toEqual(["Gwendolyn Vance"]);
    expect(namesAlreadyOnThePage([], names).size).toBe(0);
  });

  it("OFF: every chapter gets the full portrait — the costume roll-call", () => {
    delete process.env.AGENT9_DESCRIBE_ONCE;
    const block = buildWorldBriefBlock(worldDoc, 3, 10, undefined, active, undefined, new Set(["Gwendolyn Vance"]));
    expect(block).toContain("pastel tea dress");
  });

  /**
   * REGRESSION, MEASURED on run 95041 — which ABORTED because of it. The portraits carry the only
   * prose-level gender signal ("she", "Her", "his"); suppressing five a chapter took pronoun failures
   * from 1 to 10 (two gender mismatches, seven drifts) and story validation refused the book.
   */
  it("REGRESSION: the pronoun survives the suppression — it is the costume that repeats, not the gender", () => {
    process.env.AGENT9_DESCRIBE_ONCE = "true";
    const block = buildWorldBriefBlock(worldDoc, 3, 10, { "Gwendolyn Vance": "she/her" }, active, undefined, new Set(["Gwendolyn Vance"]));
    expect(block).toContain("Gwendolyn Vance is she/her");
    expect(block).not.toContain("pastel tea dress");
  });

  it("ON: an introduced character gets a name and an instruction not to restate; a new one gets the portrait", () => {
    process.env.AGENT9_DESCRIBE_ONCE = "true";
    const block = buildWorldBriefBlock(worldDoc, 3, 10, undefined, active, undefined, new Set(["Gwendolyn Vance"]));
    expect(block).not.toContain("pastel tea dress");
    expect(block).toContain("### Gwendolyn Vance");
    expect(block).toContain("A name suffices");
    expect(block).toContain("crisp cleaning apron");
  });

  it("ON, chapter 1: nobody is introduced yet, so everyone gets the portrait — chapter 1 is where description belongs (F11)", () => {
    process.env.AGENT9_DESCRIBE_ONCE = "true";
    const block = buildWorldBriefBlock(worldDoc, 0, 10, undefined, active, undefined, new Set());
    expect(block).toContain("pastel tea dress");
    expect(block).toContain("crisp cleaning apron");
  });
});

describe("F5 — mandated values are exempt from the ban, like locked ones", () => {
  it("mandatedValuesOf collects alibi windows and clearance methods from the run's case", () => {
    expect(mandatedValuesOf(CASE)).toEqual([
      "in the lounge at nine thirty",
      "in the office from eight forty-five",
      "Confirmed presence in lounge with multiple witnesses",
    ]);
  });

  it("THE RISER: the alibi value the obligations require is listed without the exemption and not with it", () => {
    const line = "Gwendolyn Vance said she had been in the lounge at nine thirty with several guests who could confirm it.";
    const prior = [1, 2, 3].map((n) => ({ title: `Chapter ${n}`, paragraphs: [`Chapter ${n} opened on the dunes. ${line}`] }));
    const without = buildRepeatBanBlock(prior, [], []);
    // the passage merge caps at 14 words, so the value may arrive as the tail of a longer passage
    expect(without).toMatch(/in the lounge at/);
    const withExempt = buildRepeatBanBlock(prior, [], mandatedValuesOf(CASE));
    expect(withExempt).not.toContain("lounge at nine thirty");
    // and it is exempt by POSITION, so the words either side are not stitched into a passage
    expect(collectRepeatedSpans(prior, mandatedValuesOf(CASE)).some((s) => /nine thirty|lounge at/.test(s.span))).toBe(false);
  });
});

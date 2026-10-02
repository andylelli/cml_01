/**
 * A_96 group B — F3 off-stage actors, F5 mandated values exempt from the ban, F8 describe a character
 * once, F9 the depth beat hands over the trait and not the cause. Each pinned on run 50862.
 */
import { afterEach, describe, expect, it } from "vitest";
import { traitOnly } from "../prose-contract/beats.js";


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
});

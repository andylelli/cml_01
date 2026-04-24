import { describe, expect, it } from "vitest";
import { validateCml } from "@cml/cml";

const buildBaseCml = () => ({
  CML_VERSION: 2.0,
  CASE: {
    meta: {
      title: "Test Case",
      author: "Copilot",
      license: "CC-BY-4.0",
      era: { decade: "1930s", realism_constraints: ["No modern forensics"] },
      setting: {
        location: "Manor house",
        place: "Little Middleton",
        country: "England",
        institution: "Estate",
      },
      crime_class: { category: "murder", subtype: "mechanical deception" },
    },
    cast: [
      {
        name: "Hugo Vane",
        age_range: "40-50",
        role_archetype: "businessman",
        relationships: [],
        public_persona: "Confident financier",
        private_secret: "Secretly altered the house clocks before",
        motive_seed: "Needs control of the estate accounts",
        motive_strength: "high",
        alibi_window: "Dinner",
        access_plausibility: "high",
        opportunity_channels: ["study"],
        behavioral_tells: ["checks the clock too often"],
        stakes: "Inheritance",
        evidence_sensitivity: [],
        culprit_eligibility: "eligible",
        culpability: "guilty",
        gender: "male",
        role: "culprit",
      },
      {
        name: "Agnes Pike",
        age_range: "50-60",
        role_archetype: "housekeeper",
        relationships: [],
        public_persona: "Loyal servant",
        private_secret: "Knows family accounts are strained",
        motive_seed: "Protect the house",
        motive_strength: "low",
        alibi_window: "Kitchen",
        access_plausibility: "medium",
        opportunity_channels: ["kitchen"],
        behavioral_tells: ["avoids gossip"],
        stakes: "Employment",
        evidence_sensitivity: [],
        culprit_eligibility: "eligible",
        culpability: "innocent",
        gender: "female",
        role: "witness",
      },
    ],
    culpability: { culprit_count: 1, culprits: ["Hugo Vane"] },
    surface_model: {
      narrative: { summary: "A household murder hides behind a manipulated clock." },
      accepted_facts: [],
      inferred_conclusions: [],
    },
    hidden_model: {
      mechanism: {
        description: "The culprit forged the railway timetable and reset the library clock to create a false arrival window.",
        delivery_path: [
          { step: "A forged railway timetable advances the reported arrival time." },
          { step: "The library clock is reset to support the false arrival window." },
        ],
      },
      outcome: { result: "Hugo Vane manufactured a false alibi." },
    },
    false_assumption: {
      statement: "The victim died when the library clock struck ten.",
      type: "temporal",
      why_it_seems_reasonable: "Everyone heard the chime from the library.",
      what_it_hides: "The clock had been reset before the chime.",
    },
    constraint_space: {
      time: {
        anchors: ["Dinner ended at ten minutes to ten."],
        windows: ["The murder happened before the false chime."],
        contradictions: ["The porter logged the last train after the supposed arrival."],
      },
      access: { actors: ["Hugo Vane"], objects: ["library clock", "railway timetable"], permissions: ["study access"] },
      physical: { laws: ["A reset clock leaves fresh tool marks."], traces: ["Metal filings on the clock bezel."] },
      social: { trust_channels: ["household routines"], authority_sources: ["porter logbook"] },
    },
    inference_path: {
      steps: [
        {
          observation: "The porter log records the last train arrival well after Hugo claims he reached the manor.",
          correction: "Hugo's arrival story depends on a false timetable rather than the real train schedule.",
          effect: "Eliminates the claimed arrival window and weakens Hugo's alibi.",
          required_evidence: [
            "The porter logbook lists the last train at twenty minutes past ten.",
            "A forged railway timetable in Hugo's case advances the arrival by forty minutes.",
          ],
          reader_observable: true,
        },
        {
          observation: "Fresh tool marks and filings sit around the library clock bezel after the supposed time of death.",
          correction: "The library clock was reset after dinner and cannot fix the murder time.",
          effect: "Narrows the true murder window to before the false chime.",
          required_evidence: [
            "Metal filings on the library clock bezel show recent tampering.",
            "The clock key bears new grease matching Hugo's study tools.",
          ],
          reader_observable: true,
        },
        {
          observation: "Agnes recalls Hugo checking the porter room notices before anyone mentioned the delayed train.",
          correction: "Hugo knew the real train timing well enough to forge a timetable around it.",
          effect: "Links the forged railway timetable directly to Hugo's preparation.",
          required_evidence: [
            "Agnes Pike saw Hugo copy the porter room timetable into his notebook.",
            "A torn porter-room notice matches the paper in Hugo's case.",
          ],
          reader_observable: true,
        },
      ],
    },
    discriminating_test: {
      method: "trap",
      design: "Confront the suspects with the forged railway timetable and the reset library clock in the porter room.",
      knowledge_revealed: "Only the forged railway timetable and reset library clock can explain Hugo's false arrival window.",
      pass_condition: "Hugo cannot reconcile the porter log with the forged timetable and altered clock.",
      evidence_clues: ["clue_1", "clue_2"],
    },
    fair_play: {
      all_clues_visible: true,
      no_special_knowledge_required: true,
      no_late_information: true,
      reader_can_solve: true,
      explanation: "The porter log, forged timetable, and altered library clock are all visible before the final trap.",
    },
    quality_controls: {
      inference_path_requirements: {
        min_steps: 3,
        max_steps: 5,
        require_observation_correction_effect: true,
      },
      clue_visibility_requirements: {
        essential_clues_min: 3,
        essential_clues_before_test: true,
        early_clues_min: 2,
        mid_clues_min: 1,
        late_clues_min: 0,
      },
      discriminating_test_requirements: { timing: "early_act3", must_reference_inference_step: true },
    },
    prose_requirements: {
      discriminating_test_scene: {
        act_number: 3,
        scene_number: 2,
        required_elements: ["porter log", "railway timetable", "library clock"],
        test_type: "trap",
      },
      suspect_clearance_scenes: [],
      culprit_revelation_scene: {
        act_number: 3,
        scene_number: 3,
        revelation_method: "Confrontation with physical evidence",
      },
      identity_rules: [],
      clue_to_scene_mapping: [
        { clue_id: "clue_1", act_number: 1, scene_number: 2, delivery_method: "Observation" },
        { clue_id: "clue_2", act_number: 2, scene_number: 1, delivery_method: "Interview" },
        { clue_id: "clue_3", act_number: 2, scene_number: 3, delivery_method: "Document" },
      ],
    },
  },
});

describe("CML viability validation", () => {
  it("fails when mechanism and test facts are not grounded in reader-visible inference evidence", () => {
    const cml = buildBaseCml() as any;

    cml.CASE.inference_path.steps = [
      {
        observation: "Agnes notices that Hugo becomes defensive when the inheritance papers are mentioned at dinner.",
        correction: "The quarrel was about money pressure, not grief over the victim.",
        effect: "Raises Hugo as a financial suspect without exposing the murder method.",
        required_evidence: [
          "Agnes Pike overhears Hugo argue about estate debts before dessert.",
          "A torn bank notice in Hugo's pocket shows urgent repayment demands.",
        ],
        reader_observable: true,
      },
      {
        observation: "The victim's desk contains a sealed letter accusing someone of account fraud.",
        correction: "The killing is tied to money pressure rather than a random intruder.",
        effect: "Narrows motive toward someone desperate about the estate books.",
        required_evidence: [
          "A sealed accusation letter lies inside the victim's desk drawer.",
          "Fresh ink stains mark Hugo's cuff after he handles the estate accounts.",
        ],
        reader_observable: true,
      },
      {
        observation: "A gardener reports seeing Hugo return from the study with soot on his sleeve.",
        correction: "Hugo moved through the servant corridor after the lights failed.",
        effect: "Places Hugo near the private rooms without explaining how the alibi was built.",
        required_evidence: [
          "The gardener saw soot on Hugo's sleeve after the blackout.",
          "Boot prints in the servant corridor lead away from the study door.",
        ],
        reader_observable: true,
      },
    ];

    const validation = validateCml(cml);

    expect(validation.valid).toBe(false);
    expect(validation.errors.some((error) => /CASE\.hidden_model\.mechanism\.description is not grounded/i.test(error))).toBe(true);
    expect(validation.errors.some((error) => /CASE\.discriminating_test\.knowledge_revealed is not grounded/i.test(error))).toBe(true);
  });

  it("fails when required evidence uses abstract placeholders instead of concrete facts", () => {
    const cml = buildBaseCml() as any;

    cml.CASE.inference_path.steps[0].required_evidence = [
      "timeline discrepancy",
      "suspicious behavior",
    ];

    const validation = validateCml(cml);

    expect(validation.valid).toBe(false);
    expect(validation.errors.some((error) => /required_evidence\[0\] is too abstract/i.test(error))).toBe(true);
    expect(validation.errors.some((error) => /required_evidence\[1\] is too abstract/i.test(error))).toBe(true);
  });

  it("passes when mechanism and discriminating-test facts are grounded in reader-visible evidence", () => {
    const validation = validateCml(buildBaseCml());

    expect(validation.valid).toBe(true);
  });

  it("ignores generic discriminating-test wrapper wording when core mechanism facts are already grounded", () => {
    const cml = buildBaseCml() as any;

    cml.CASE.discriminating_test.design = "Stage a controlled demonstration in which the library clock is examined under observation beside the forged railway timetable.";
    cml.CASE.discriminating_test.knowledge_revealed = "The inconsistencies in the alibis can only be explained by the forged railway timetable and reset library clock.";

    const validation = validateCml(cml);

    expect(validation.valid).toBe(true);
  });

  it("fails when discriminating-test proof relies on signals of guilt or defensive reactions", () => {
    const cml = buildBaseCml() as any;

    cml.CASE.inference_path.steps[2].required_evidence = [
      "Agnes Pike saw Hugo copy the porter room timetable into his notebook.",
      "signals of guilt from those near the library clock",
    ];
    cml.CASE.discriminating_test.design = "Eleanor reenacts the train arrival and compares the guests' reactions to the timeline discrepancy.";
    cml.CASE.discriminating_test.knowledge_revealed = "Signals of guilt emerge from the guest who tampered with the clock.";
    cml.CASE.discriminating_test.pass_condition = "Hugo reacts defensively when the porter log is read aloud.";

    const validation = validateCml(cml);

    expect(validation.valid).toBe(false);
    expect(validation.errors.some((error) => /required_evidence\[1\] relies on detective-only behavioral shorthand/i.test(error))).toBe(true);
    expect(validation.errors.some((error) => /CASE\.discriminating_test\.design relies on detective-only reaction\/confession language/i.test(error))).toBe(true);
    expect(validation.errors.some((error) => /CASE\.discriminating_test\.knowledge_revealed relies on detective-only reaction\/confession language/i.test(error))).toBe(true);
    expect(validation.errors.some((error) => /CASE\.discriminating_test\.pass_condition relies on detective-only reaction\/confession language/i.test(error))).toBe(true);
  });

  it("ignores generic reenactment wrapper wording when the underlying mechanism facts are already grounded", () => {
    const cml = buildBaseCml() as any;

    cml.CASE.discriminating_test.design = "A reenactment of the events surrounding the clock's tampering is staged, putting guests under scrutiny beside the forged railway timetable and reset library clock.";
    cml.CASE.discriminating_test.knowledge_revealed = "Inconsistent details about the clock tampering and the timeline of events can only be resolved by the forged railway timetable and reset library clock.";

    const validation = validateCml(cml);

    expect(validation.valid).toBe(true);
  });
});
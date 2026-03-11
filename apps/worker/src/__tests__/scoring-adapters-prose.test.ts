import { describe, expect, it } from "vitest";
import { adaptProseForScoring, collectClueEvidenceFromProse } from "../jobs/scoring-adapters/index.js";

describe("adaptProseForScoring clue visibility", () => {
  it("marks clue visibility via semantic clue signature when prose omits clue IDs", () => {
    const chapters = [
      {
        title: "The Grate",
        paragraphs: [
          "In the study, she lifted a silver pendant engraved with the Whitfield crest from the grate while everyone watched.",
        ],
      },
    ];

    const cmlCase = {
      prose_requirements: {
        clue_to_scene_mapping: [{ clue_id: "clue_pendant" }],
      },
    };

    const clueDistribution = {
      clues: [
        {
          id: "clue_pendant",
          description: "A silver pendant engraved with the Whitfield crest was recovered from the study grate.",
          category: "physical",
          criticality: "essential",
          pointsTo: "Links the culprit to the study at the critical hour.",
        },
      ],
    } as any;

    const adapted = adaptProseForScoring(chapters, cmlCase, clueDistribution);

    expect(adapted.chapters[0].clues_present).toEqual(["clue_pendant"]);
    expect(adapted.fair_play_validation?.all_clues_visible).toBe(true);
  });

  it("avoids semantic false positives when only one weak token matches", () => {
    const chapters = [
      {
        title: "A Loose Thread",
        paragraphs: ["He noticed a thread on the sleeve, but nothing in the room tied it to any location."],
      },
    ];

    const cmlCase = {
      prose_requirements: {
        clue_to_scene_mapping: [{ clue_id: "clue_curtain" }],
      },
    };

    const clueDistribution = {
      clues: [
        {
          id: "clue_curtain",
          description: "A scarlet thread torn from the velvet curtain near the conservatory window.",
          category: "trace",
          criticality: "essential",
          pointsTo: "Indicates forced contact at the conservatory window.",
        },
      ],
    } as any;

    const adapted = adaptProseForScoring(chapters, cmlCase, clueDistribution);

    expect(adapted.chapters[0].clues_present).toBeUndefined();
    expect(adapted.fair_play_validation?.all_clues_visible).toBe(false);
  });

  it("extracts clue evidence anchors for explicit and semantic visibility", () => {
    const chapters = [
      {
        title: "The Grate",
        paragraphs: [
          "In the study, she lifted a silver pendant engraved with the Whitfield crest from the grate while everyone watched.",
        ],
      },
      {
        title: "Inventory",
        paragraphs: ["By dawn, clue_key was logged by the constable in the ledger."],
      },
    ];

    const cmlCase = {
      prose_requirements: {
        clue_to_scene_mapping: [{ clue_id: "clue_pendant" }, { clue_id: "clue_key" }],
      },
    };

    const clueDistribution = {
      clues: [
        {
          id: "clue_pendant",
          description: "A silver pendant engraved with the Whitfield crest was recovered from the study grate.",
          pointsTo: "Links the culprit to the study at the critical hour.",
        },
        {
          id: "clue_key",
          description: "A brass key tagged by the constable after dawn.",
          pointsTo: "Connects the suspect to the locked archive.",
        },
      ],
    } as any;

    const evidence = collectClueEvidenceFromProse(chapters, cmlCase, clueDistribution);

    expect(evidence.visibleClueIds).toContain("clue_pendant");
    expect(evidence.visibleClueIds).toContain("clue_key");
    expect(evidence.evidenceByClue.clue_pendant?.[0]?.state).toBe("hinted");
    expect(evidence.evidenceByClue.clue_key?.[0]?.state).toBe("explicit");
    expect(evidence.evidenceByChapter[1]).toContain("clue_pendant");
    expect(evidence.evidenceByChapter[2]).toContain("clue_key");
  });

  it("falls back to clueDistribution IDs when mapping is absent", () => {
    const chapters = [
      {
        title: "Library Dust",
        paragraphs: [
          "A brass key tagged by the constable after dawn was entered in the ledger.",
        ],
      },
    ];

    const clueDistribution = {
      clues: [
        {
          id: "clue_key",
          description: "A brass key tagged by the constable after dawn.",
          pointsTo: "Connects the suspect to the archive.",
        },
      ],
    } as any;

    const adapted = adaptProseForScoring(chapters, {}, clueDistribution);

    expect(adapted.chapters[0].clues_present).toEqual(["clue_key"]);
    expect(adapted.fair_play_validation?.all_clues_visible).toBe(true);
  });

  it("uses additive clue sources when mapping is partial", () => {
    const chapters = [
      {
        title: "Early Ledger",
        paragraphs: [
          "A brass key tagged by the constable after dawn was entered in the ledger.",
        ],
      },
      {
        title: "Study Ash",
        paragraphs: [
          "By evening she recovered a silver pendant engraved with the Whitfield crest from the study grate.",
        ],
      },
    ];

    const cmlCase = {
      prose_requirements: {
        clue_to_scene_mapping: [{ clue_id: "clue_key" }],
      },
      discriminating_test: {
        evidence_clues: ["clue_pendant"],
      },
    };

    const clueDistribution = {
      clues: [
        {
          id: "clue_key",
          description: "A brass key tagged by the constable after dawn.",
          pointsTo: "Confirms archive access window.",
        },
        {
          id: "clue_pendant",
          description: "A silver pendant engraved with the Whitfield crest recovered from the study grate.",
          pointsTo: "Links the culprit to the study.",
        },
      ],
    } as any;

    const adapted = adaptProseForScoring(chapters, cmlCase, clueDistribution);

    expect(adapted.chapters[0].clues_present).toContain("clue_key");
    expect(adapted.chapters[1].clues_present).toContain("clue_pendant");
    expect(adapted.fair_play_validation?.all_clues_visible).toBe(true);
  });

  it("marks discriminating test complete from semantic design/evidence signals", () => {
    const chapters = [
      {
        title: "The Demonstration",
        paragraphs: [
          "In a careful reconstruction, she measured the time and compared each alibi against clue_key and clue_watch records until one suspect was ruled out.",
        ],
      },
    ];

    const cmlCase = {
      discriminating_test: {
        design: "A timing reconstruction compares alibis against key and watch evidence.",
        knowledge_revealed: "Only one suspect could complete the route in time.",
        evidence_clues: ["clue_key", "clue_watch"],
      },
      prose_requirements: {
        clue_to_scene_mapping: [
          { clue_id: "clue_key" },
          { clue_id: "clue_watch" },
        ],
      },
    };

    const clueDistribution = {
      clues: [
        {
          id: "clue_key",
          description: "A brass key tagged by the constable after dawn.",
          pointsTo: "Confirms archive access window.",
        },
        {
          id: "clue_watch",
          description: "A stopped watch fixed the minute of disturbance.",
          pointsTo: "Supports the reconstruction timeline.",
        },
      ],
    } as any;

    const adapted = adaptProseForScoring(chapters, cmlCase, clueDistribution);
    const evidence = collectClueEvidenceFromProse(chapters, cmlCase, clueDistribution);

    expect(adapted.chapters[0].discriminating_test_present).toBe(true);
    expect(adapted.fair_play_validation?.discriminating_test_complete).toBe(true);
    expect(evidence.clueStateById.clue_key).toBe("confirmed");
    expect(evidence.clueStateById.clue_watch).toBe("confirmed");
  });

  it("flags spoilers when culprit reveal language appears in early chapters", () => {
    const chapters = [
      {
        title: "Too Early",
        paragraphs: [
          "Before breakfast, the culprit was already named and the killer was revealed in front of everyone.",
        ],
      },
      {
        title: "Aftermath",
        paragraphs: ["The rest of the case was paperwork."],
      },
    ];

    const adapted = adaptProseForScoring(chapters, {}, { clues: [] } as any);
    expect(adapted.fair_play_validation?.no_solution_spoilers).toBe(false);
  });
});

import { describe, expect, it } from "vitest";
import { __testables } from "../agent65-world-builder.ts";

describe("agent65 world builder storyTheme hardening", () => {
  it("deterministically expands short storyTheme to a complete 25+ word sentence", () => {
    const shortTheme = "In The Clockwork Deception, class tensions and personal ambition reveal how secrets fracture trust and lead to dire consequences.";

    const expanded = __testables.enforceStoryThemeFloor(
      shortTheme,
      25,
      "The cost of protecting status over truth",
      "tense and reflective",
    );

    expect(__testables.countWords(expanded)).toBeGreaterThanOrEqual(25);
    expect(/[.!?]$/.test(expanded)).toBe(true);
    const sentenceEndings = expanded.match(/[.!?]/g) ?? [];
    expect(sentenceEndings.length).toBe(1);
  });

  it("preserves already valid storyTheme text", () => {
    const validTheme = "At its core, the mystery shows that reputation can delay justice, but careful evidence eventually forces every character to confront the moral price of deception.";

    const normalized = __testables.enforceStoryThemeFloor(
      validTheme,
      25,
      "Moral accountability over social image",
      "somber",
    );

    expect(normalized).toBe(validTheme);
  });
});

describe("agent65 enforceArcDescriptionFloor", () => {
  const turningPoints = [
    { position: "opening", emotionalDescription: "A house party iced by unspoken dread." },
    { position: "early", emotionalDescription: "First suspicions sharpen into accusations." },
    { position: "first_turn", emotionalDescription: "The alibi that seemed watertight springs a leak." },
    { position: "mid", emotionalDescription: "Loyalties divide the household against itself." },
    { position: "second_turn", emotionalDescription: "A hidden letter recolours everything already seen." },
    { position: "pre_climax", emotionalDescription: "The detective forces a confrontation no one can escape." },
    { position: "climax", emotionalDescription: "The murderer is named in front of the assembled cast." },
    { position: "resolution", emotionalDescription: "Silence falls; what was broken cannot be mended." },
  ];

  it("returns the original text when already at or above the floor", () => {
    const longText = "word ".repeat(210).trim();
    const result = __testables.enforceArcDescriptionFloor(longText, 200, turningPoints, "", "");
    expect(result).toBe(longText);
  });

  it("expands short text to meet the floor using turningPoints", () => {
    const shortText = "A brief arc.";
    const result = __testables.enforceArcDescriptionFloor(shortText, 200, turningPoints, "Truth costs more than people expect.", "somber determination");
    expect(__testables.countWords(result)).toBeGreaterThanOrEqual(200);
    expect(result).toContain(shortText);
  });

  it("reaches the floor even with no turningPoints via fallback padding", () => {
    const result = __testables.enforceArcDescriptionFloor("", 200, [], "", "");
    expect(__testables.countWords(result)).toBeGreaterThanOrEqual(200);
  });

  it("produces multi-paragraph output", () => {
    const result = __testables.enforceArcDescriptionFloor("Start.", 200, turningPoints, "Theme sentence here.", "grim");
    expect(__testables.paragraphCount(result)).toBeGreaterThanOrEqual(2);
  });
});

describe("agent65 sanitiseArrayOfObjects", () => {
  it("filters out string entries from a mixed array", () => {
    const input = [{ name: "A" }, "some string", null, { name: "B" }, ["nested"]];
    const result = __testables.sanitiseArrayOfObjects(input);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: "A" });
    expect(result[1]).toEqual({ name: "B" });
  });

  it("returns empty array for non-array input", () => {
    expect(__testables.sanitiseArrayOfObjects(null)).toEqual([]);
    expect(__testables.sanitiseArrayOfObjects(undefined)).toEqual([]);
    expect(__testables.sanitiseArrayOfObjects("string")).toEqual([]);
  });

  it("preserves a clean array unchanged", () => {
    const input = [{ a: 1 }, { b: 2 }];
    expect(__testables.sanitiseArrayOfObjects(input)).toHaveLength(2);
  });
});

describe("agent65 completeHumourPlacementMap", () => {
  const ALL_POSITIONS = [
    "opening_scene", "first_investigation", "body_discovery", "first_interview",
    "domestic_scene", "mid_investigation", "second_interview", "tension_scene",
    "pre_climax", "discriminating_test", "revelation", "resolution",
  ];

  it("injects all 12 positions when given an empty array", () => {
    const result = __testables.completeHumourPlacementMap([]);
    expect(result.map((e) => e.scenePosition).sort()).toEqual([...ALL_POSITIONS].sort());
  });

  it("fills missing positions while preserving existing ones", () => {
    const partial = [
      { scenePosition: "opening_scene", humourPermission: "permitted", rationale: "Light touch works here." },
    ];
    const result = __testables.completeHumourPlacementMap(partial);
    expect(result).toHaveLength(12);
    const opening = result.find((e) => e.scenePosition === "opening_scene")!;
    expect(opening.rationale).toBe("Light touch works here.");
  });

  it("fills empty rationale strings on existing entries", () => {
    const map = ALL_POSITIONS.map((pos) => ({ scenePosition: pos, humourPermission: "conditional", rationale: "" }));
    const result = __testables.completeHumourPlacementMap(map);
    for (const entry of result) {
      expect(entry.rationale.length).toBeGreaterThan(0);
    }
  });

  it("uses 'forbidden' for solemn positions in defaults", () => {
    const result = __testables.completeHumourPlacementMap([]);
    const solemn = result.filter((e) =>
      ["body_discovery", "discriminating_test", "revelation"].includes(e.scenePosition)
    );
    for (const entry of solemn) {
      expect(entry.humourPermission).toBe("forbidden");
    }
  });

  it("deduplicates: first occurrence of a position wins", () => {
    const map = [
      { scenePosition: "opening_scene", humourPermission: "permitted", rationale: "First." },
      { scenePosition: "opening_scene", humourPermission: "forbidden", rationale: "Second (duplicate)." },
    ];
    const result = __testables.completeHumourPlacementMap(map);
    const openings = result.filter((e) => e.scenePosition === "opening_scene");
    expect(openings).toHaveLength(1);
    expect(openings[0].rationale).toBe("First.");
  });
});

describe("agent65 structural normalization", () => {
  const caseData = {
    CASE: {
      cast: [
        { name: "Eleanor Voss", role: "detective" },
        { name: "Captain Ivor Hale", role: "suspect" },
        { name: "Adrian Wren", role: "victim" },
      ],
      culpability: {
        culprits: [],
      },
    },
  };

  it("synthesizes required structural objects before schema validation", () => {
    const normalized = __testables.normalizeWorldDocumentStructure(
      {
        status: "final",
        storyTheme: "Truth matters.",
        historicalMoment: undefined,
        characterPortraits: [],
        characterVoiceSketches: [],
        locationRegisters: [],
        storyEmotionalArc: undefined,
        humourPlacementMap: [
          { scenePosition: "opening_scene", humourPermission: "permitted", rationale: "" },
          "bad trailing string",
        ],
        breakMoment: undefined,
        revealImplications: undefined,
        validationConfirmations: undefined,
      } as any,
      {
        caseData: caseData as any,
        temporalContext: { specificDate: "1932-09" } as any,
      },
    );

    expect(normalized.historicalMoment.specificDate).toBe("1932-09");
    expect(normalized.storyEmotionalArc.turningPoints).toHaveLength(8);
    expect(normalized.breakMoment.character).toBe("Captain Ivor Hale");
    expect(normalized.breakMoment.scenePosition).toBe("tension_scene");
    expect(normalized.revealImplications).toBe("");
    expect(normalized.validationConfirmations).toEqual({
      noNewCharacterFacts: false,
      noNewPlotFacts: false,
      castComplete: false,
      eraSpecific: false,
      lockedFactsPreserved: false,
      humourMapComplete: false,
    });
    expect(normalized.humourPlacementMap).toHaveLength(12);
    expect(normalized.humourPlacementMap.every((entry: any) => typeof entry === "object" && !!entry)).toBe(true);
    expect(normalized.humourPlacementMap.every((entry: any) => typeof entry.rationale === "string" && entry.rationale.length > 0)).toBe(true);
  });

  it("keeps an existing breakMoment while backfilling empty fields", () => {
    const breakMoment = __testables.buildDefaultBreakMoment(caseData as any, {
      character: "Captain Ivor Hale",
      scenePosition: "",
      form: "",
      narrativeFunction: "",
    });

    expect(breakMoment.character).toBe("Captain Ivor Hale");
    expect(breakMoment.scenePosition).toBe("tension_scene");
    expect(breakMoment.form.length).toBeGreaterThan(0);
    expect(breakMoment.narrativeFunction.length).toBeGreaterThan(0);
  });

  it("forces validation confirmations into a full boolean object", () => {
    expect(__testables.buildDefaultValidationConfirmations(undefined)).toEqual({
      noNewCharacterFacts: false,
      noNewPlotFacts: false,
      castComplete: false,
      eraSpecific: false,
      lockedFactsPreserved: false,
      humourMapComplete: false,
    });

    expect(__testables.buildDefaultValidationConfirmations({
      noNewCharacterFacts: true,
      noNewPlotFacts: "yes",
      castComplete: true,
      eraSpecific: true,
      lockedFactsPreserved: 1,
      humourMapComplete: true,
    })).toEqual({
      noNewCharacterFacts: true,
      noNewPlotFacts: false,
      castComplete: true,
      eraSpecific: true,
      lockedFactsPreserved: false,
      humourMapComplete: true,
    });
  });
});

/**
 * The structured-output schema for the rubric judge (P2). Returned object is schema-valid by
 * construction — no JSON-parse-or-throw. Mirrors `RubricScore` + the judge-observed `flags`.
 */

export const RUBRIC_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["categories", "total", "overall_view", "what_works", "main_problems", "chapter_issues", "fastest_fixes"],
  properties: {
    categories: {
      type: "array",
      minItems: 10,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["category", "mark", "reason"],
        properties: {
          category: {
            type: "string",
            enum: [
              "premise", "opening_hook", "plot_structure", "character_clarity", "dialogue",
              "atmosphere", "clues", "pacing", "ending", "prose",
            ],
          },
          mark: { type: "integer", minimum: 0, maximum: 10 },
          reason: { type: "string", minLength: 1 },
        },
      },
    },
    total: { type: "integer", minimum: 0, maximum: 100 },
    overall_view: { type: "string" },
    what_works: { type: "array", items: { type: "string" } },
    main_problems: { type: "array", items: { type: "string" } },
    chapter_issues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["chapter", "issues"],
        properties: {
          chapter: { type: "integer" },
          issues: { type: "array", items: { type: "string" } },
        },
      },
    },
    fastest_fixes: { type: "array", items: { type: "string" } },
    // judge-observed structural conditions (drive the hard caps the extractor can't compute)
    flags: {
      type: "object",
      additionalProperties: false,
      properties: {
        deadVictimAppearsAlive: { type: "boolean" },
        deadVictimIsCulprit: { type: "boolean" },
        victimIdentityUnclear: { type: "boolean" },
        multipleRoleChanges: { type: "boolean" },
        pronounsUnstable: { type: "boolean" },
        culpritConfessesTamperingOnly: { type: "boolean" },
        revealUsesUnplantedEvidence: { type: "boolean" },
        mechanismExplainedTooEarly: { type: "boolean" },
        noResolution: { type: "boolean" },
        endingContradictsEarlier: { type: "boolean" },
      },
    },
    // K2 §2: EVERY flag set true above MUST cite the chapter + the verbatim sentence that proves it.
    // The cap engine deterministically verifies each citation against the prose and DROPS any flag whose
    // cited evidence does not actually appear — this self-exposes the templated false-positives.
    flag_citations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["flag", "chapter", "sentence"],
        properties: {
          flag: {
            type: "string",
            enum: [
              "deadVictimAppearsAlive", "deadVictimIsCulprit", "victimIdentityUnclear",
              "multipleRoleChanges", "pronounsUnstable", "culpritConfessesTamperingOnly",
              "revealUsesUnplantedEvidence", "mechanismExplainedTooEarly", "noResolution",
              "endingContradictsEarlier",
            ],
          },
          chapter: { type: "integer", minimum: 1 },
          sentence: { type: "string", minLength: 1 },
        },
      },
    },
  },
} as const;

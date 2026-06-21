import { describe, expect, it } from "vitest";
import type { SettingRefinement } from "../agent1-setting.js";
import type { CastDesign } from "../agent2-cast.js";
import type { BackgroundContextArtifact } from "../agent2e-background-context.js";
import {
  BACKDROP_SUMMARY_STUB,
  deriveBackgroundContext,
  rankAnchors,
} from "../agent2e-background-derive.js";

// ---------------------------------------------------------------------------
// Fixtures: a representative Agent-1 setting + Agent-2 cast, plus the artifact
// the LIVE Agent 2e produces for those inputs (hand-authored to mirror the real
// shape, with the five deterministic fields being verbatim copies/derivations of
// the upstream data — exactly what the live prompt hands the model).
// ---------------------------------------------------------------------------

function buildSetting(): SettingRefinement {
  return {
    era: {
      decade: "1920s",
      technology: ["petrol touring cars", "domestic wiring with outages"],
      forensics: ["delayed regional fingerprint analysis"],
      transportation: ["branch-line railway", "horse trap"],
      communication: ["party-line telephone", "telegrams via the village office"],
      socialNorms: [
        "rigid class deference between family and household staff",
        "scandal carries lasting reputational cost",
        "women's testimony discounted in public matters",
      ],
      policing: ["county constabulary", "Scotland Yard summoned for serious crime"],
    },
    location: {
      type: "Country manor",
      description: "Thornfield Grange, a rambling Jacobean manor set in isolated Yorkshire moorland",
      physicalConstraints: ["single carriage drive", "no telephone in the east wing"],
      geographicIsolation: "eight miles from the nearest village, cut off by flooded fords",
      accessControl: ["locked gatehouse at night", "household keys held by the butler"],
    },
    atmosphere: {
      weather: "a relentless winter storm that floods the roads",
      timeOfDay: "late evening",
      mood: "claustrophobic and tense",
      visualDescription: "guttering candlelight against rain-streaked leaded windows",
    },
    realism: {
      anachronisms: [],
      implausibilities: [],
      recommendations: [
        "Replace lab certainty with delayed regional analysis.",
        "Use the storm to justify the severed telephone line.",
        "Keep the gatehouse key with a single named servant.",
      ],
    },
  };
}

function buildCast(): CastDesign {
  return {
    characters: [
      mkChar("Inspector Alderton", "Police Detective / Inspector"),
      mkChar("Beatrice Vossler", "Disgraced insider"),
      mkChar("Cornelius Pengelly", "Financial suspect"),
      mkChar("Drusilla Threlfall", "Family loyalist"),
      mkChar("Ezra Maguire", "Gatekeeper witness"),
      mkChar("Florence Quain", "Outsider observer"),
    ],
    relationships: {
      pairs: [
        {
          character1: "Cornelius Pengelly",
          character2: "Beatrice Vossler",
          relationship: "Cornelius Pengelly holds Beatrice Vossler's forged notes of credit",
          tension: "high",
          sharedHistory:
            "Cornelius Pengelly and Beatrice Vossler conspired to hide the estate's insolvency",
        },
      ],
    },
    diversity: {
      stereotypeCheck: [],
      recommendations: ["Vary social positions across the household."],
    },
    crimeDynamics: {
      possibleCulprits: ["Cornelius Pengelly", "Beatrice Vossler", "Drusilla Threlfall"],
      redHerrings: ["Ezra Maguire"],
      victimCandidates: ["Florence Quain"],
      detectiveCandidates: ["Inspector Alderton"],
    },
  };
}

function mkChar(name: string, roleArchetype: string): CastDesign["characters"][number] {
  return {
    name,
    ageRange: "40s",
    occupation: "resident",
    roleArchetype,
    publicPersona: "composed",
    privateSecret: "keeps a secret",
    motiveSeed: "inheritance",
    motiveStrength: "moderate",
    alibiWindow: "between nine and ten",
    accessPlausibility: "possible",
    stakes: "reputation",
    characterArcPotential: "discovers hidden resolve",
    gender: "female",
  };
}

const HISTORICAL_BACKDROP_SUMMARY =
  "An inheritance hearing keeps heirs, staff, and creditors under one roof while public scandal makes private loyalties expensive.";
const THEME = "buried debts surfacing under the threat of public ruin";

/**
 * What the LIVE Agent 2e emitted for the fixtures above. The five "deterministic"
 * fields here are EXACTLY the upstream values the live prompt feeds the model:
 *   era.decade           = setting.era.decade
 *   era.socialStructure  = setting.era.socialNorms.join("; ")
 *   setting.location     = setting.location.description
 *   setting.institution  = setting.location.type
 *   setting.weather      = setting.atmosphere.weather
 *   theme                = inputs.theme
 * Only backdropSummary is genuinely authored by the model.
 */
function buildHistorical2eArtifact(): BackgroundContextArtifact {
  return {
    status: "ok",
    backdropSummary: HISTORICAL_BACKDROP_SUMMARY,
    era: {
      decade: "1920s",
      socialStructure:
        "rigid class deference between family and household staff; scandal carries lasting reputational cost; women's testimony discounted in public matters",
    },
    setting: {
      location: "Thornfield Grange, a rambling Jacobean manor set in isolated Yorkshire moorland",
      institution: "Country manor",
      weather: "a relentless winter storm that floods the roads",
    },
    castAnchors: [
      "Inspector Alderton",
      "Florence Quain",
      "Beatrice Vossler",
      "Cornelius Pengelly",
      "Drusilla Threlfall",
      "Ezra Maguire",
    ],
    theme: THEME,
  };
}

describe("deriveBackgroundContext — byte-identical golden proof", () => {
  it("reproduces the FIVE deterministic fields byte-identically from upstream artifacts", () => {
    const setting = buildSetting();
    const cast = buildCast();
    const historical = buildHistorical2eArtifact();

    const derived = deriveBackgroundContext({
      setting,
      cast,
      // The single creative field is parameterized — we feed the historical sentence,
      // exactly as §9.1 Spike B describes (testing the derivation, not the model).
      backdropSummary: historical.backdropSummary,
      theme: THEME,
    });

    // --- The deterministic (copied/derived) fields must match EXACTLY ---
    expect(derived.status).toBe(historical.status);
    expect(derived.era.decade).toBe(historical.era.decade);
    expect(derived.era.socialStructure).toBe(historical.era.socialStructure);
    expect(derived.setting.location).toBe(historical.setting.location);
    expect(derived.setting.institution).toBe(historical.setting.institution);
    expect(derived.setting.weather).toBe(historical.setting.weather);
    expect(derived.theme).toBe(historical.theme);

    // castAnchors: deterministic ranking reproduces the historical anchor list exactly
    expect(derived.castAnchors).toEqual(historical.castAnchors);
  });

  it("is BYTE-IDENTICAL to the historical artifact once the creative sentence is supplied", () => {
    const setting = buildSetting();
    const cast = buildCast();
    const historical = buildHistorical2eArtifact();

    const derived = deriveBackgroundContext({
      setting,
      cast,
      backdropSummary: historical.backdropSummary,
      theme: THEME,
    });

    // Full structural equality, including the parameterized backdropSummary.
    expect(derived).toEqual(historical);
    // And byte-identical JSON serialization (the strict "byte" claim).
    expect(JSON.stringify(derived)).toBe(JSON.stringify(historical));
  });

  it("derives EVERY field EXCEPT backdropSummary deterministically (the creative field is the only gap)", () => {
    const setting = buildSetting();
    const cast = buildCast();
    const historical = buildHistorical2eArtifact();

    // Derive WITHOUT supplying the creative sentence.
    const derivedNoSummary = deriveBackgroundContext({ setting, cast, theme: THEME });

    // Every deterministic field still matches the historical artifact...
    const { backdropSummary: _hist, ...historicalRest } = historical;
    const { backdropSummary: derivedSummary, ...derivedRest } = derivedNoSummary;
    expect(derivedRest).toEqual(historicalRest);

    // ...and the ONLY field the derivation cannot reproduce is backdropSummary,
    // which falls back to the documented stub (never invented).
    expect(derivedSummary).toBe(BACKDROP_SUMMARY_STUB);
    expect(derivedSummary).not.toBe(historical.backdropSummary);
  });
});

describe("rankAnchors — deterministic selection", () => {
  it("ranks detective → victim → roster, drawn only from real cast names, capped", () => {
    const cast = buildCast();
    const anchors = rankAnchors(cast);

    // detective candidate first, then victim candidate, then remaining roster
    expect(anchors[0]).toBe("Inspector Alderton");
    expect(anchors[1]).toBe("Florence Quain");

    // every anchor is an actual cast name (no invention)
    const castNames = new Set(cast.characters.map((c) => c.name));
    for (const anchor of anchors) {
      expect(castNames.has(anchor)).toBe(true);
    }

    // 4–8 entries, no duplicates
    expect(anchors.length).toBeGreaterThanOrEqual(4);
    expect(anchors.length).toBeLessThanOrEqual(8);
    expect(new Set(anchors).size).toBe(anchors.length);
  });

  it("is deterministic: same cast → identical anchor list", () => {
    expect(rankAnchors(buildCast())).toEqual(rankAnchors(buildCast()));
  });

  it("ignores candidate names that are not present in the cast roster", () => {
    const cast = buildCast();
    cast.crimeDynamics.detectiveCandidates = ["Ghost Detective Not In Cast"];
    const anchors = rankAnchors(cast);
    expect(anchors).not.toContain("Ghost Detective Not In Cast");
    const castNames = new Set(cast.characters.map((c) => c.name));
    for (const anchor of anchors) {
      expect(castNames.has(anchor)).toBe(true);
    }
  });
});

describe("deriveBackgroundContext — totality (never throws on partial input)", () => {
  it("does not throw on a completely empty input object", () => {
    expect(() => deriveBackgroundContext({} as never)).not.toThrow();
    const artifact = deriveBackgroundContext({} as never);
    expect(artifact.status).toBe("ok");
    expect(artifact.backdropSummary).toBe(BACKDROP_SUMMARY_STUB);
    expect(artifact.era.decade).toBe("");
    expect(artifact.setting.location).toBe("");
    expect(artifact.setting.institution).toBe("");
    expect(artifact.castAnchors).toEqual([]);
  });

  it("does not throw when setting/cast sub-objects are missing or partial", () => {
    const partial = {
      setting: { era: { decade: "1930s" } },
      cast: { characters: [{ name: "Solo" }] },
    } as unknown as Parameters<typeof deriveBackgroundContext>[0];

    expect(() => deriveBackgroundContext(partial)).not.toThrow();
    const artifact = deriveBackgroundContext(partial);
    expect(artifact.era.decade).toBe("1930s");
    expect(artifact.era.socialStructure).toBeUndefined(); // omitted when no norms
    expect(artifact.setting.weather).toBeUndefined(); // omitted when no weather
    expect(artifact.castAnchors).toEqual(["Solo"]);
  });

  it("does not throw on null/undefined inputs", () => {
    expect(() => deriveBackgroundContext(null as never)).not.toThrow();
    expect(() => deriveBackgroundContext(undefined as never)).not.toThrow();
    expect(() => rankAnchors(undefined)).not.toThrow();
    expect(rankAnchors(undefined)).toEqual([]);
  });

  it("omits optional theme/socialStructure/weather rather than emitting empty strings", () => {
    const setting = buildSetting();
    setting.era.socialNorms = [];
    setting.atmosphere.weather = "";
    const derived = deriveBackgroundContext({ setting, cast: buildCast() });
    expect("socialStructure" in derived.era).toBe(false);
    expect("weather" in derived.setting).toBe(false);
    expect("theme" in derived).toBe(false);
  });
});

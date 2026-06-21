import { describe, expect, it } from "vitest";
import {
  assembleProseBrief,
  checkProseBrief,
} from "../prose-brief.js";
import type { AssembleProseBriefInputs, ProseBrief } from "../prose-brief.js";
import type { CharacterProfileOutput } from "../agent2b-character-profiles.js";
import type { LocationProfilesResult } from "../agent2c-location-profiles.js";
import type { SettingRefinement } from "../agent1-setting.js";
import type { CastDesign } from "../agent2-cast.js";

// ---------------------------------------------------------------------------
// Fixtures: representative upstream artifacts — a couple of character profiles,
// a location-profiles result, a decade + runId, and an Agent-1 setting + Agent-2
// cast. These mirror what the four projection modules each already consume.
// ---------------------------------------------------------------------------

const DECADE = "1920s";
const RUN_ID = "run-prose-brief-fixture";
const THEME = "buried debts surfacing under the threat of public ruin";

function buildProfiles(): Array<Partial<CharacterProfileOutput>> {
  return [
    {
      name: "Edith Pryce",
      speechMannerisms:
        "Clipped, formal diction; over-corrects to precise legal phrasing when nervous",
      humourStyle: "polite_savagery",
      humourLevel: 0.2,
      internalConflict: "She will not admit she cannot afford to keep the house.",
      personalStakeInCase: "The inquiry threatens the one fact she has organised her dignity around.",
    },
    {
      name: "Tom Marsh",
      speechMannerisms: "Warm, gentle, provincial idiom; trails off mid-sentence",
      humourStyle: "self_deprecating",
      humourLevel: 0.6,
      internalConflict: "He fears being believed about the night he was awake.",
      personalStakeInCase: "His loyalty to the family is about to cost him everything.",
    },
  ];
}

function buildLocationProfiles(): LocationProfilesResult {
  return {
    status: "draft",
    tone: "Classic",
    primary: {
      name: "Thornfield Grange",
      type: "interior",
      summary: "An isolated country house cut off by the moor.",
      visualDescription: "Rambling Jacobean pile.",
      atmosphere: "Brooding and remote.",
      paragraphs: ["Para 1", "Para 2"],
    },
    keyLocations: [
      {
        id: "library",
        name: "The West Library",
        type: "interior",
        purpose: "Clue site",
        visualDetails: "Dark oak panelling and gas sconces",
        sensoryDetails: {
          sights: ["candlelight on dark oak", "rain-streaked window panes"],
          sounds: ["crackling fire"],
          smells: ["beeswax and cold ash"],
          tactile: ["chill draft from the casement"],
        },
        accessControl: "Locked after dinner; key held by the butler",
        paragraphs: ["Para 1"],
      },
      {
        id: "conservatory",
        name: "The Conservatory",
        type: "exterior",
        purpose: "Gathering space",
        visualDetails: "Glass roof and tangled ferns",
        sensoryDetails: {
          sights: ["green light through fogged glass"],
          sounds: ["dripping condensation"],
          smells: ["wet earth and jasmine"],
          tactile: ["humid warmth"],
        },
        accessControl: "Open to family and guests by day",
        paragraphs: ["Para 1"],
      },
    ],
    atmosphere: {
      era: "1920s",
      weather: "Rain",
      timeFlow: "Three days of mounting tension on a snowbound estate",
      mood: "Oppressive",
      eraMarkers: ["gas lamps", "motor cars"],
      sensoryPalette: { dominant: "cold beeswax and old paper", secondary: ["hushed"] },
      paragraphs: ["Atmosphere para 1"],
    },
    cost: 0,
    durationMs: 0,
  };
}

function buildSetting(): SettingRefinement {
  return {
    era: {
      decade: DECADE,
      technology: ["petrol touring cars"],
      forensics: ["delayed regional fingerprint analysis"],
      transportation: ["branch-line railway"],
      communication: ["party-line telephone"],
      socialNorms: [
        "rigid class deference between family and household staff",
        "scandal carries lasting reputational cost",
      ],
      policing: ["county constabulary"],
    },
    location: {
      type: "Country manor",
      description: "Thornfield Grange, a rambling Jacobean manor on isolated Yorkshire moorland",
      physicalConstraints: ["single carriage drive"],
      geographicIsolation: "eight miles from the nearest village",
      accessControl: ["locked gatehouse at night"],
    },
    atmosphere: {
      weather: "a relentless winter storm that floods the roads",
      timeOfDay: "late evening",
      mood: "claustrophobic and tense",
      visualDescription: "guttering candlelight against rain-streaked windows",
    },
    realism: { anachronisms: [], implausibilities: [], recommendations: [] },
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

function buildCast(): CastDesign {
  return {
    characters: [
      mkChar("Inspector Alderton", "Police Detective / Inspector"),
      mkChar("Edith Pryce", "Disgraced insider"),
      mkChar("Tom Marsh", "Family loyalist"),
      mkChar("Florence Quain", "Outsider observer"),
    ],
    relationships: { pairs: [] },
    diversity: { stereotypeCheck: [], recommendations: [] },
    crimeDynamics: {
      possibleCulprits: ["Edith Pryce", "Tom Marsh"],
      redHerrings: [],
      victimCandidates: ["Florence Quain"],
      detectiveCandidates: ["Inspector Alderton"],
    },
  };
}

function buildInputs(overrides: Partial<AssembleProseBriefInputs> = {}): AssembleProseBriefInputs {
  return {
    characterProfiles: buildProfiles(),
    locationProfiles: buildLocationProfiles(),
    decade: DECADE,
    runId: RUN_ID,
    setting: buildSetting(),
    cast: buildCast(),
    theme: THEME,
    ...overrides,
  };
}

describe("assembleProseBrief — composition of the four projections", () => {
  it("returns a brief with all four sections populated", () => {
    const brief = assembleProseBrief(buildInputs());

    // voice capsules: one per supplied profile, names carried through
    expect(brief.voiceCapsules).toHaveLength(2);
    expect(brief.voiceCapsules.map((c) => c.name)).toEqual(["Edith Pryce", "Tom Marsh"]);
    // each capsule has a concrete register + at least one tic (deployable)
    for (const capsule of brief.voiceCapsules) {
      expect(capsule.register).not.toBe("unknown");
      expect(capsule.speechTics.length).toBeGreaterThanOrEqual(1);
    }

    // location spine: projected from the full location-profiles artifact
    expect(brief.locationSpine.primaryName).toBe("Thornfield Grange");
    expect(brief.locationSpine.places.map((p) => p.id)).toEqual(["library", "conservatory"]);
    expect(brief.locationSpine.places[0].baselinePalette.dominant).not.toBe("");

    // temporal anchor: deterministic year/month/season
    expect(brief.temporal.year).toBeGreaterThanOrEqual(1920);
    expect(brief.temporal.year).toBeLessThanOrEqual(1929);
    expect(typeof brief.temporal.month).toBe("string");
    expect(["spring", "summer", "autumn", "winter"]).toContain(brief.temporal.season);

    // background: deterministic fields copied from setting + ranked cast anchors
    expect(brief.background.status).toBe("ok");
    expect(brief.background.era.decade).toBe(DECADE);
    expect(brief.background.setting.institution).toBe("Country manor");
    expect(brief.background.castAnchors[0]).toBe("Inspector Alderton");
    expect(brief.background.theme).toBe(THEME);
  });

  it("produces a coherent, healthy summary for clean inputs", () => {
    const brief = assembleProseBrief(buildInputs());
    expect(brief.health.ok).toBe(true);
    // no error-prefixed voice issues and no spine issues on clean data
    expect(brief.health.issues.some((i) => i.startsWith("voice[error]"))).toBe(false);
    expect(brief.health.issues.some((i) => i.startsWith("spine:"))).toBe(false);
  });

  it("is deterministic: same inputs → identical brief", () => {
    expect(assembleProseBrief(buildInputs())).toEqual(assembleProseBrief(buildInputs()));
  });

  it("passes the temporal anchor through with a derived season (single source of truth)", () => {
    const brief = assembleProseBrief(buildInputs());
    // re-deriving with the same (decade, runId) must yield the same anchor
    const again = assembleProseBrief(buildInputs());
    expect(brief.temporal).toEqual(again.temporal);
    expect(brief.temporal.season).toBeDefined();
  });

  it("checkProseBrief agrees with the embedded health summary", () => {
    const brief = assembleProseBrief(buildInputs());
    expect(checkProseBrief(brief)).toEqual(brief.health);
  });
});

describe("assembleProseBrief — health.ok goes false on weak input", () => {
  it("flags duplicate voice capsules (near-identical register + tics)", () => {
    // Two characters with identical speech mannerisms → duplicate voice signatures.
    const dupMannerism = "Clipped, terse, blunt; never finishes a sentence about the estate";
    const profiles: Array<Partial<CharacterProfileOutput>> = [
      { name: "Twin A", speechMannerisms: dupMannerism, internalConflict: "guilt" },
      { name: "Twin B", speechMannerisms: dupMannerism, internalConflict: "fear" },
    ];
    const brief = assembleProseBrief(buildInputs({ characterProfiles: profiles }));

    // Duplicate voice is a warn, so it surfaces in issues...
    expect(brief.health.issues.some((i) => i.includes("near-identical"))).toBe(true);
  });

  it("health.ok is false when a capsule has no atomizable speech tics (error severity)", () => {
    const profiles: Array<Partial<CharacterProfileOutput>> = [
      // Empty mannerisms → no register, no tics → error-severity voice issues.
      { name: "Silent Sam", speechMannerisms: "", internalConflict: "" },
    ];
    const brief = assembleProseBrief(buildInputs({ characterProfiles: profiles }));

    expect(brief.health.ok).toBe(false);
    expect(brief.health.issues.some((i) => i.startsWith("voice[error]"))).toBe(true);
  });

  it("health.ok is false when a spine place is missing its purpose", () => {
    const profiles = buildLocationProfiles();
    // Strip the purpose from one key location — the spine checker treats this as blocking.
    profiles.keyLocations[0].purpose = "";
    const brief = assembleProseBrief(buildInputs({ locationProfiles: profiles }));

    expect(brief.health.ok).toBe(false);
    expect(brief.health.issues.some((i) => i.startsWith("spine:") && i.includes("purpose"))).toBe(
      true,
    );
  });
});

describe("assembleProseBrief — totality (never throws on partial/empty input)", () => {
  it("does not throw on a completely empty input object", () => {
    expect(() => assembleProseBrief({})).not.toThrow();
    const brief = assembleProseBrief({});
    // every section is still present and well-shaped
    expect(brief.voiceCapsules).toEqual([]);
    expect(brief.locationSpine.places).toEqual([]);
    expect(brief.background.status).toBe("ok");
    expect(typeof brief.temporal.year).toBe("number");
    // empty input is not healthy (no capsules deploy, no spine places, no anchors)
    expect(brief.health.ok).toBe(false);
  });

  it("does not throw on null / undefined inputs", () => {
    expect(() => assembleProseBrief(null)).not.toThrow();
    expect(() => assembleProseBrief(undefined)).not.toThrow();
    const brief = assembleProseBrief(null);
    expect(brief.voiceCapsules).toEqual([]);
    expect(brief.locationSpine.places).toEqual([]);
  });

  it("does not throw when sections are partial / malformed", () => {
    const partial = {
      characterProfiles: [{ name: "Solo" }, null, undefined],
      locationProfiles: { keyLocations: [{}] },
      setting: { era: { decade: "1930s" } },
      cast: { characters: [{ name: "Lone Anchor" }] },
      decade: "1930s",
      runId: "partial-run",
    } as unknown as AssembleProseBriefInputs;

    expect(() => assembleProseBrief(partial)).not.toThrow();
    const brief = assembleProseBrief(partial);
    // one capsule per profile entry (including the malformed ones, projected safely)
    expect(brief.voiceCapsules).toHaveLength(3);
    expect(brief.background.era.decade).toBe("1930s");
    expect(brief.background.castAnchors).toEqual(["Lone Anchor"]);
  });

  it("checkProseBrief tolerates a null/empty brief", () => {
    expect(() => checkProseBrief(null)).not.toThrow();
    expect(() => checkProseBrief({} as ProseBrief)).not.toThrow();
    const health = checkProseBrief(null);
    expect(health.ok).toBe(false);
  });
});

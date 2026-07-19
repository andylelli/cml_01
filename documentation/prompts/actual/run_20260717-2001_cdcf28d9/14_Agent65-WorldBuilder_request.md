# Actual Prompt Record

- Run ID: `run_cdcf28d9-b08b-429d-bc7a-d50f3da66bd3`
- Project ID: `proj_60ea64d0-8bbf-4c6a-a528-7798eeaafb92`
- Timestamp: `2026-07-17T20:07:14.529Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `a83b529dd654db7f`

## Message 1 (role=system)

```text
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
  - storyEmotionalArc.arcDescription is your most important output field. Budget your tokens
    for it before writing shorter fields. It MUST be at least 300 words written across multiple
    clearly distinct paragraphs — not a dense single block. Trace the full emotional journey:
    opening atmosphere → rising unease → first investigative turn → mid-story revelation →
    second pivot → pre-climax pressure → climax → resolution. A response shorter than 300 words
    will fail validation. Count your words before finalising this field.
  - JSON arrays must contain ONLY objects of the specified type. Never add strings, notes,
    comments, or placeholder text inside characterPortraits, characterVoiceSketches,
    locationRegisters, humourPlacementMap, or any other array field.
  - You must not invent any new character secrets, new relationships, or new backstory beyond
    what is in the provided inputs.
  - You must not name the culprit identity or describe any clue in specific forensic detail.
  - Every locked fact (exact times, distances, quantities, measurements) must appear in this
    document exactly as given — not paraphrased, not rounded, not changed.
  - Character voice sketches must be consistent with the speechMannerisms and humourStyle
    from the character profiles. A character with humourStyle: "none" must not produce wit.
  - The historical moment section must reason from the specific year and month provided.
    It must not be a general description of the decade. A reviewer should be able to
    identify the approximate date from the historicalMoment section alone.
  - All text fields must be written as if addressed to a novelist about to write this story:
    purposeful, not bureaucratic; specific, not generic.
  - FIRST-PASS CONTRACT: satisfy storyTheme, revealImplications, and arcDescription minimum lengths in the initial response; do not rely on deterministic fallback expansion.
  - humourPlacementMap: every entry (all 12 scene positions) MUST include a non-empty
    "rationale" string. This applies to "forbidden" entries too — explain WHY it is forbidden.
    Omitting rationale on any entry will cause schema validation failure.
  - FIRST-PASS CONTRACT: include all required humourPlacementMap scene positions exactly once in the initial response.

You will produce a single JSON object. Return only the JSON. No preamble, no commentary.
```

## Message 2 (role=user)

```text
## INPUTS

### CASE
{
  "meta": {
    "title": "The Sundial’s Silent Hour at Stanhope Manor",
    "author": "CML Specialist",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "No modern technology beyond 1930s standards",
        "Forensic methods limited to fingerprinting and basic toxicology",
        "Social hierarchy and household protocol strictly enforced",
        "Physical laws and mechanical clocks behave as known in the 1930s"
      ]
    },
    "setting": {
      "location": "Stanhope Manor Estate",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Manor house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "stabbing with letter opener"
    }
  },
  "death_method": "stabbed with a letter opener",
  "cast": [
    {
      "name": "Inspector Harold Bramwell",
      "age_range": "40-55",
      "role_archetype": "Detective",
      "relationships": [
        "Professional acquaintance of the Stanhope family"
      ],
      "public_persona": "Methodical, astute inspector",
      "private_secret": "Has a personal history with Charles Stanhope",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Investigative questioning",
        "Access to manor grounds during investigation"
      ],
      "behavioral_tells": [
        "Observant, calm under pressure"
      ],
      "stakes": "Professional reputation and career",
      "evidence_sensitivity": [
        "Clock mechanism knowledge",
        "Attention to timing and schedules"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Lady Evelyn Stanhope",
      "age_range": "45-55",
      "role_archetype": "victim",
      "relationships": [
        "Wife of Charles Stanhope",
        "Employer of household staff"
      ],
      "public_persona": "Respected lady of the manor",
      "private_secret": "Had recent quarrels with family members",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Life",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Charles Stanhope",
      "age_range": "50-60",
      "role_archetype": "Family member",
      "relationships": [
        "Husband of Lady Evelyn Stanhope"
      ],
      "public_persona": "Stoic estate owner",
      "private_secret": "Struggling with debts and political views",
      "motive_seed": "Financial pressure and political disagreements",
      "motive_strength": "moderate",
      "alibi_window": "Two to four o’clock afternoon",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Had access to study and garden between two and four"
      ],
      "behavioral_tells": [
        "Tense during questioning",
        "Avoids discussing finances"
      ],
      "stakes": "Estate and reputation",
      "evidence_sensitivity": [
        "Knowledge of clock mechanisms",
        "Access to study"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Margaret Lyle",
      "age_range": "30-40",
      "role_archetype": "Housekeeper",
      "relationships": [
        "Head of household staff",
        "Loyal to Lady Evelyn"
      ],
      "public_persona": "Strict but fair housekeeper",
      "private_secret": "Secretly resents reduced staff and wages",
      "motive_seed": "Resentment over household changes",
      "motive_strength": "low",
      "alibi_window": "Late afternoon, 3:30 to 5:00",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to all parts of the manor",
        "Control over servant schedules"
      ],
      "behavioral_tells": [
        "Protective of staff",
        "Avoids discussing sundial timing"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [
        "Household schedule records",
        "Servants’ ledger"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "James Archer",
      "age_range": "35-50",
      "role_archetype": "Butler",
      "relationships": [
        "Reports to Margaret Lyle",
        "Close observer of household events"
      ],
      "public_persona": "Reliable and discreet",
      "private_secret": "Knows secrets of family and staff",
      "motive_seed": "Ambition and loyalty conflicts",
      "motive_strength": "moderate",
      "alibi_window": "Two to three forty-five",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to dining hall, study, garden"
      ],
      "behavioral_tells": [
        "Noted unusual sundial shadow absence",
        "Mentions clock ticking irregularities"
      ],
      "stakes": "Position and trust",
      "evidence_sensitivity": [
        "Clock mechanism observations",
        "Sundial shadow knowledge"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Collins",
      "age_range": "25-35",
      "role_archetype": "Governess",
      "relationships": [
        "Responsible for children’s education",
        "Respected by family"
      ],
      "public_persona": "Kind and diligent",
      "private_secret": "Had a private quarrel with Lady Evelyn",
      "motive_seed": "Personal grudge",
      "motive_strength": "moderate",
      "alibi_window": "Between two and three",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to nursery and garden paths"
      ],
      "behavioral_tells": [
        "Nervous when discussing garden timeline",
        "Mentions sudden chill at sundial"
      ],
      "stakes": "Employment and reputation",
      "evidence_sensitivity": [
        "Witness statements",
        "Weather journal"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Philip Marsh",
      "age_range": "45-60",
      "role_archetype": "Family physician",
      "relationships": [
        "Trusted doctor to the Stanhopes"
      ],
      "public_persona": "Calm and professional",
      "private_secret": "Knows about Lady Evelyn’s health concerns",
      "motive_seed": "Professional duty to conceal scandal",
      "motive_strength": "low",
      "alibi_window": "Late afternoon, 3:00 to 5:00",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Visits to manor during day"
      ],
      "behavioral_tells": [
        "Notes about timing of death",
        "Observes physical condition of victim"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [
        "Medical report",
        "Timing of injury"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Charles Stanhope"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During an overcast autumn afternoon at the Stanhope Manor estate in Yorkshire, Lady Evelyn Stanhope was found stabbed in the garden near the sundial. All witnesses insist she was seen alive at a quarter past two, confirmed by the sundial’s shadow. However, the overcast weather created a shadowless hour, leading to a false timeline. Inspector Harold Bramwell uncovers mechanical interference with the manor’s clocks and social logic traps in household schedules, revealing that Charles Stanhope manipulated time perceptions to conceal his guilt."
    },
    "accepted_facts": [
      "Lady Evelyn Stanhope was stabbed with a letter opener in the garden near the sundial.",
      "Multiple witnesses claim to have seen her alive at quarter past two afternoon, confirmed by the sundial’s shadow.",
      "The weather was overcast with intermittent drizzle, preserving footprints and dampening sound.",
      "The manor’s mechanical clocks showed inconsistent timings.",
      "Charles Stanhope had access to the study and knowledge of the manor’s clocks.",
      "The household schedule and servant logs contained overlapping and suspicious timing entries."
    ],
    "inferred_conclusions": [
      "The sundial’s shadow could not have been visible at quarter past two due to a brief cloud cover.",
      "The actual time of Lady Evelyn’s death was earlier than witnesses believed.",
      "Charles Stanhope exploited knowledge of the sundial and clock mechanisms to create a false timeline.",
      "Other suspects’ alibis hold under corrected timeline constraints."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A brief but dense cloud cover at quarter past two erased the sundial’s shadow, making witnesses mistakenly believe Lady Evelyn was alive then. Meanwhile, Charles Stanhope manipulated the manor’s mechanical clock pendulum by impeding it with a hidden latch, causing the clock to lag and then rapidly catch up. This created a false timeline supported by altered servant ledger entries and social expectations. The combined physical and social timing traps concealed the true time of death and opportunity.",
      "delivery_path": [
        {
          "step": "Charles Stanhope tampered with the library clock pendulum latch earlier in the day."
        },
        {
          "step": "A fleeting cloud bank caused the sundial to lose its shadow at quarter past two."
        },
        {
          "step": "Witnesses relied on the sundial’s shadow and faulty clocks to fix the timeline."
        },
        {
          "step": "Servant ledgers and household schedules were subtly manipulated to align with the false timeline."
        },
        {
          "step": "Charles used the confusion to commit murder in the garden earlier, before the assumed quarter past two."
        }
      ]
    },
    "outcome": {
      "result": "The victim was stabbed before quarter past two, but the false timing created by natural and mechanical factors allowed Charles Stanhope to escape suspicion initially."
    }
  },
  "false_assumption": {
    "statement": "The victim was seen alive precisely at quarter past two by multiple witnesses, confirmed by the sundial’s shadow.",
    "type": "temporal",
    "why_it_seems_reasonable": "All testimonies from household members and guests consistently report seeing Lady Evelyn in the garden at that time, with the sundial’s shadow reinforcing the exact moment.",
    "what_it_hides": "A brief cloud cover erased the sundial’s shadow, making it impossible for the shadow to confirm the time, thus concealing that Lady Evelyn was already dead by then."
  },
  "false_solution": {
    "accused_suspect": "James Archer",
    "supporting_points": [
      "James was seen near the garden at quarter past two, close to the victim’s location.",
      "He noticed the sundial’s shadow was unusually absent, implying suspicious behavior around the time of death."
    ],
    "the_one_flaw": "James’s presence at quarter past two is impossible since the mechanical clock’s lag and servant ledger timing prove he was occupied elsewhere.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A muddy footprint near the garden gate matches James Archer’s shoes.",
      "points_at_suspect": "James Archer",
      "innocent_explanation": "James was delivering messages at the time and passed the garden gate, unrelated to the murder.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Margaret Lyle was seen arguing with Lady Evelyn earlier that day.",
      "points_at_suspect": "Margaret Lyle",
      "innocent_explanation": "The argument concerned household staffing cuts, unrelated to the murder, and Margaret’s alibi is confirmed by multiple servants.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Charles Stanhope",
      "Margaret Lyle",
      "James Archer",
      "Beatrice Collins",
      "Dr. Philip Marsh"
    ],
    "rationale": "All individuals present at the manor during the murder window and with access to the garden area; no outsiders could have entered unnoticed due to estate security and weather conditions."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Quarter past two sundial shadow disappearance",
        "Library clock pendulum obstruction between 1:45 and 3:00",
        "Servants’ ledger shift times from 1:30 to 4:00"
      ],
      "windows": [
        "Lady Evelyn alive before quarter past two",
        "Murder occurred before sundial shadow vanished",
        "Charles Stanhope’s access to study 1:30 to 2:30"
      ],
      "contradictions": [
        "Sundial shadow claimed at quarter past two but physically impossible due to cloud cover",
        "Library clock time reading inconsistent with actual elapsed time due to pendulum lag",
        "Servant ledger times overlapping and inconsistent with witness statements"
      ]
    },
    "access": {
      "actors": [
        "Charles Stanhope",
        "Margaret Lyle",
        "James Archer",
        "Beatrice Collins",
        "Dr. Philip Marsh"
      ],
      "objects": [
        "Library clock",
        "Sundial",
        "Household ledger",
        "Garden paths"
      ],
      "permissions": [
        "Charles’s unrestricted access to study and garden",
        "Staff access to servant areas and garden",
        "Dr. Marsh’s access to the manor and victim"
      ]
    },
    "physical": {
      "laws": [
        "Sundial cannot cast shadow under dense cloud cover",
        "Mechanical clock pendulum swing affects timekeeping accuracy",
        "Thermal and physical properties of clock components affect timing"
      ],
      "traces": [
        "Scratch marks inside library clock casing",
        "Faint footprints on damp garden soil",
        "Overlapping servant ledger entries"
      ]
    },
    "social": {
      "trust_channels": [
        "Household routine expectations",
        "Witness testimony relying on sundial and clock",
        "Staff and family hierarchical communications"
      ],
      "authority_sources": [
        "Housekeeper’s control over servant schedules",
        "Estate owner’s authority over household",
        "Inspector’s investigative authority"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The sundial’s surface near the garden shows no shadow mark at quarter past two despite witness claims.",
        "correction": "A dense cloud bank at that moment prevented the sundial from casting any shadow, invalidating the claimed time.",
        "effect": "Narrows victim’s time of death to before quarter past two, eliminating suspects relying on the later timeline.",
        "required_evidence": [
          "Sundial surface inspection near garden",
          "Witness statements of cloud bank and chill at quarter past two",
          "Weather journal noting fleeting cloud cover"
        ],
        "reader_observable": true
      },
      {
        "observation": "The library clock pendulum has scratch marks inside the casing and the clock’s time lags real time by about fifteen minutes before accelerating.",
        "correction": "The pendulum was impeded deliberately, causing the clock to show an inaccurate time and creating a false timeline for alibis.",
        "effect": "Eliminates suspects whose alibis depend on the clock’s displayed time after 2:00.",
        "required_evidence": [
          "Scratch marks inside library clock casing",
          "Butler James Archer’s testimony on clock’s irregular ticking",
          "Displaced clock weights found unevenly hanging"
        ],
        "reader_observable": true
      },
      {
        "observation": "Servant ledger entries for shifts between 1:30 and 3:30 show overlapping times with inconsistent handwriting and ink.",
        "correction": "The ledger was altered with rounding errors and overlapping shifts to support the false timeline and cover for the suspect’s absence.",
        "effect": "Narrows opportunity window, confirming Charles Stanhope’s presence in the garden before quarter past two, eliminating others with alibis in ledger.",
        "required_evidence": [
          "Servant ledger with overlapping shifts and mismatched ink",
          "Housekeeper Margaret Lyle’s control over staff schedules",
          "Servant note questioning ledger timing accuracy"
        ],
        "reader_observable": true
      },
      {
        "observation": "Charles Stanhope uniquely possesses knowledge of clock mechanisms and had opportunity to tamper with the library clock pendulum latch.",
        "correction": "Only Charles could engineer the mechanical interference creating the false timeline.",
        "effect": "Identifies Charles Stanhope as the only suspect with means to manipulate physical timekeeping devices.",
        "required_evidence": [
          "Charles Stanhope’s familiarity with clock mechanisms",
          "Access to the study where the clock is located",
          "Absence of similar knowledge or access in other suspects"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "constraint_proof",
    "design": "A timed comparison is staged between the manor’s library clock and an external time standard using the sundial during a replicated cloudless afternoon. The test demonstrates the clock’s fifteen-minute lag caused by the pendulum latch mechanism and the sundial’s inability to cast shadows under cloud cover. This exposes the false timeline asserted by Charles Stanhope and disproves his alibi.",
    "knowledge_revealed": "The mechanical interference with the clock pendulum latch caused the false time display, and the cloud cover eliminated the sundial’s shadow, invalidating witness timelines.",
    "pass_condition": "If the library clock is shown to lag behind the external time standard by fifteen minutes and the sundial fails to cast a shadow under cloud cover, Charles Stanhope’s timeline is proven false and he is identified as the murderer.",
    "evidence_clues": [
      "clue_12",
      "clue_21",
      "clue_13"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The sundial’s shadow absence (early clues) and weather journal (mid clues) reveal the false timing of victim sighting. Step 2: The scratched clock pendulum and butler’s testimony (mid clues) expose mechanical tampering. Step 3: The servant ledger’s overlapping times (mid clues) confirm manipulated schedules. Step 4: Charles Stanhope’s unique mechanical knowledge and access (early and mid clues) isolate him as the only suspect capable of the tampering. The discriminating test employs these known facts to prove the false timeline and guilt."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 4,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 4,
      "essential_clues_before_test": true,
      "early_clues_min": 2,
      "mid_clues_min": 2,
      "late_clues_min": 0
    },
    "discriminating_test_requirements": {
      "timing": "early_act3",
      "must_reference_inference_step": true
    }
  },
  "prose_requirements": {
    "discriminating_test_scene": {
      "act_number": 3,
      "scene_number": 4,
      "required_elements": [
        "Execute the timed comparison between the manor clock and the sundial under replicated conditions",
        "Observe the clock lag and sundial shadow absence",
        "Draw conclusion about Charles Stanhope’s guilt"
      ],
      "test_type": "constraint_proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Margaret Lyle",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi by multiple servants and ledger consistency",
        "supporting_clues": [
          "Servant ledger with overlapping shifts and mismatched ink",
          "Housekeeper Margaret Lyle’s control over staff schedules"
        ]
      },
      {
        "suspect_name": "James Archer",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by witness statements and timing constraints",
        "supporting_clues": [
          "Butler James Archer’s testimony on clock’s irregular ticking",
          "Displaced clock weights found unevenly hanging"
        ]
      },
      {
        "suspect_name": "Beatrice Collins",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified through nursery records and weather journal",
        "supporting_clues": [
          "Witness statements",
          "Weather journal noting fleeting cloud cover"
        ]
      },
      {
        "suspect_name": "Dr. Philip Marsh",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Medical report timing excludes opportunity",
        "supporting_clues": [
          "Medical report",
          "Timing of injury"
        ]
      },
      {
        "suspect_name": "Lady Evelyn Stanhope",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": [
          "Charles Stanhope’s familiarity with clock mechanisms"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with mechanical clock tampering evidence and sundial shadow contradiction"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_11",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_13",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_14",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_15",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_16",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_17",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_18",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_19",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_20",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_21",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_charles_stanhope",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Inspector Harold Bramwell",
    "summary": "A seasoned Scotland Yard detective, methodical and calm, caught between justice and political pressures.",
    "publicPersona": "Inspector Bramwell is the very picture of composed professionalism. Years of service have honed his intellect and his patience, making him a reliable figure amidst the chaos of crime. His reputation precedes him as a man of integrity and sharp observation, the sort who unravels mysteries with quiet precision rather than flamboyant spectacle.",
    "privateSecret": "Bramwell wrestles with the weight of political interference, as powerful backers of the Stanhope estate urge him to close the case swiftly, no matter the truth. This pressure gnaws at his sense of justice, threatening to compromise the very principles that define him.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "impossible",
    "stakes": "His professional reputation and integrity hang in the balance, challenged by the estate's influential patrons who demand expediency over thoroughness.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Bramwell speaks with measured deliberation, his sentences carefully constructed and often laced with subtle irony. He rarely wastes words, but when he does, his dry wit surfaces — a quiet, knowing remark that punctuates tense moments. His tone remains polite but firm, embodying the composed authority of a man who’s seen much and trusts little.",
    "signatureTic": "\"One mustn’t jump to conclusions, now, must we?\"",
    "internalConflict": "Bramwell struggles with the moral tension between his duty to uncover the truth and the political pressure to deliver a convenient resolution, fearing that bending to influence would betray his life's work.",
    "personalStakeInCase": "This case is more than professional duty; the Stanhope estate’s prominence and powerful allies mean that failure or compromise here could irreparably damage Bramwell’s career and sense of justice.",
    "paragraphs": [
      "Inspector Harold Bramwell carries the weight of decades spent in the service of the law, his demeanor a study in calm and methodical inquiry. To his colleagues and the public, he is the epitome of reliability, a man whose sharp intellect and steady hand have brought many a criminal to book. At Stanhope Manor, his presence commands respect, though beneath the surface, a quiet battle rages.",
      "The inspector is no stranger to political undercurrents, but this case tests him as never before. The estate's powerful backers exert subtle but relentless pressure, urging him to close the investigation swiftly and quietly. Bramwell senses that the truth might be sacrificed for appearances, and this threatens to erode the very foundation of his professional integrity.",
      "His speech is precise and deliberate, each word chosen like a chess move. His dry wit is a shield and a weapon — a means to deflect tension and probe those around him with gentle sarcasm. He rarely raises his voice, preferring instead to unsettle suspects with pointed, understated observations that linger in the air.",
      "Internally, Bramwell wrestles with a gnawing doubt: will pursuing justice here cost him his career? He fears that exposing inconvenient truths might alienate powerful figures and end his tenure at Scotland Yard. Yet, the alternative—complicity in a cover-up—would betray his deepest convictions.",
      "For Bramwell, the case is a crucible. It tests not only his detective skills but his moral compass. The stakes are personal; the fate of his reputation and the principle of impartial justice hang in the balance. His every move is shadowed by the question of whether the law will ultimately prevail or be subverted by influence.",
      "As he interrogates the inhabitants of Stanhope Manor, Bramwell’s keen eye notes the subtle fractures beneath polished surfaces. His challenge is to peel away layers of deception without losing himself to the very politics he so mistrusts, striving always to ensure that the sundial’s silent hour reveals more than just shadows."
    ],
    "order": 1
  },
  {
    "name": "Lady Evelyn Stanhope",
    "summary": "The venerable matriarch of Stanhope Manor, whose death unravels hidden family tensions and threatens the estate’s legacy.",
    "publicPersona": "Lady Evelyn commands respect as a philanthropic and socially influential figure, embodying tradition and dignity. Her presence at the manor is a bastion of stability, and her word carries weight in both local society and the broader aristocratic circles.",
    "privateSecret": "Behind her poised exterior, Lady Evelyn was preparing to rewrite her will, intending to disinherit her eldest son due to his reckless and politically risky behavior—a move that would have upended family expectations and fortunes.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "impossible",
    "stakes": "Her death threatens to destabilize the carefully maintained legacy of the Stanhope estate and cast uncertainty over its future.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Lady Evelyn’s speech is formal and measured, with a graceful cadence befitting her station. She employs subtle understatement and rarely indulges in overt emotion, preferring a calm and composed manner even in private. Her humour is restrained, often manifesting as a dry, knowing remark that hints at deeper feelings.",
    "signatureTic": "\"One must maintain decorum, even in the most trying circumstances.\"",
    "internalConflict": "Though unseen now, she wrestled with the conflict between maternal affection and duty to preserve the estate’s future, torn over the consequences of disinheriting her son.",
    "personalStakeInCase": "Though deceased, Lady Evelyn’s intentions and secrets form the fulcrum of the case, her death a catalyst revealing the fractures within her family and the shifting tides of tradition and modernity.",
    "paragraphs": [
      "Lady Evelyn Stanhope stands as the embodiment of aristocratic grace and tradition, her life devoted to the stewardship of her family’s legacy and the welfare of her estate. Her philanthropic efforts have earned her admiration beyond the manor’s gates, and her presence commands a quiet authority.",
      "Yet beneath her dignified exterior, Lady Evelyn harbored troubling doubts about the future. The reckless ambitions of her eldest son had strained her patience and trust, leading her to the difficult decision to alter her will—a secret she guarded closely. This private resolve to disinherit Charles threatened to upend the established order.",
      "Her manner of speech reflects her temperament: formal, deliberate, and touched with subtle understatement. She rarely raised her voice or revealed her emotions openly, choosing instead to convey meaning through carefully chosen words and a poised demeanor. Even in moments of tension, her humour was a gentle nudge, a soft-spoken observation that revealed more than it stated.",
      "The internal struggle she faced—between love for her son and duty to her family’s future—was a silent burden. She understood that her decisions could fracture the family, yet she remained steadfast in her resolve, believing that the estate’s survival depended on difficult sacrifices.",
      "Lady Evelyn’s death casts a long shadow over Stanhope Manor, exposing hidden resentments and ambitions. Her absence unleashes forces long restrained by tradition, and the investigation into her final hours unearths truths she had sought to keep buried.",
      "Though she can no longer speak, Lady Evelyn’s legacy and secrets shape the narrative of the case. Her life and death stand as a testament to the tensions between past and future, loyalty and ambition, that pulse at the heart of the manor."
    ],
    "order": 2
  },
  {
    "name": "Charles Stanhope",
    "summary": "The charismatic eldest son and aspiring politician, whose desperate financial woes and inheritance stake cast him under suspicion.",
    "publicPersona": "Charles is a charming, eloquent figure, seen by many as a promising modern politician with fresh ideas. His charisma and public appeal mask the precariousness of his personal affairs.",
    "privateSecret": "Burdened by mounting debts, Charles is desperate to secure his inheritance to fund his political ambitions. His mother’s plan to disinherit him threatens not only his fortune but also his future career.",
    "motiveSeed": "Murder preserves his claim to the estate’s fortune by preventing the will’s alteration, securing funds essential to his political campaign.",
    "motiveStrength": "strong",
    "alibiWindow": "Was alone in the library from 8:30 PM to 9:15 PM, claiming to be engrossed in political correspondence.",
    "accessPlausibility": "easy",
    "stakes": "His financial survival and political future hinge on the victim’s death, making the stakes intensely personal.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Charles speaks with confident flair, often employing sharp, sardonic wit that veils his inner anxieties. His tone is polished yet edged with impatience, and he frequently uses rhetorical questions and pointed sarcasm to deflect probing inquiries. His manner is urbane but occasionally brittle under stress.",
    "signatureTic": "\"Isn’t it curious how fortune favors the bold?\"",
    "internalConflict": "Charles grapples with the moral cost of ambition, torn between loyalty to family and the ruthless pursuit of his political dreams, haunted by what he might have done to secure his future.",
    "personalStakeInCase": "The case threatens to expose his debts and desperation, potentially ruining both his inheritance and burgeoning political career, making the investigation a matter of survival.",
    "paragraphs": [
      "Charles Stanhope is the very image of the ambitious heir, a man whose charm and eloquence have won him admirers in political circles and beyond. Yet beneath the polished exterior lies a man under immense pressure, his mounting debts a dark cloud over his aspirations.",
      "His relationship with his mother had grown increasingly strained, her intention to disinherit him a devastating blow. Charles’s financial desperation and political ambitions create a potent motive, one that the investigation must weigh carefully against his carefully crafted alibi.",
      "His speech carries a sardonic edge, a defence mechanism against the scrutiny he faces. He peppers his conversation with rhetorical flourishes and wry observations, often deflecting uncomfortable questions with a sharp quip or a cynical remark. His urbane manner conceals a brittle core, vulnerable to exposure.",
      "Internally, Charles battles the moral implications of his desires. The line between rightful ambition and ruthless self-interest blurs as he contemplates the consequences of his actions. Loyalty to family conflicts with the instinct to survive and succeed at all costs.",
      "The stakes for Charles are high indeed: the loss of inheritance would not only strip him of fortune but also cripple his political future. The investigation threatens to unravel the carefully maintained façade, exposing debts and desperation to the unforgiving light of day.",
      "As the inquiry unfolds, Charles must confront the shadow his ambitions cast, navigating a treacherous path between truth and survival, charm and culpability."
    ],
    "order": 3
  },
  {
    "name": "Margaret Lyle",
    "summary": "The efficient estate manager, caught between loyalty and ambition, whose desire for reform clashes with tradition.",
    "publicPersona": "Margaret is regarded as a competent and respected administrator, the steady hand that keeps the estate functioning amid financial strain. Her professionalism is beyond reproach, and she commands quiet respect among the staff.",
    "privateSecret": "She harbours a secret resentment towards Lady Evelyn’s refusal to modernize the estate’s operations, fearing that without reform, her own position—and the estate’s future—are at risk.",
    "motiveSeed": "The victim’s rejection of new management plans threatened Margaret’s job security; removing Lady Evelyn could open the door for reforms benefiting Margaret’s career.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be inspecting the kitchens from 8:45 PM to 9:00 PM, but lacks direct witnesses to confirm.",
    "accessPlausibility": "possible",
    "stakes": "Her professional advancement and job security are tied to the estate’s modernization and the shifts in management.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Margaret’s speech is crisp and precise, her tone polite but often tinged with a subtle, cutting edge. She delivers barbed remarks with a veneer of civility, using carefully chosen words to convey both respect and underlying critique. Her language is formal yet laced with a faintly sardonic undertone.",
    "signatureTic": "\"One must adapt, or one becomes obsolete, wouldn’t you agree?\"",
    "internalConflict": "Margaret wrestles with her loyalty to the estate and its traditions versus her ambition and belief in necessary modernization, torn between duty and self-interest.",
    "personalStakeInCase": "The outcome of the investigation could determine whether the estate embraces reform or clings to tradition, directly impacting Margaret’s career and livelihood.",
    "paragraphs": [
      "Margaret Lyle is the embodiment of efficiency and order within the sprawling estate, tasked with managing day-to-day operations under increasingly strained finances. Her competence is unquestioned, and her ability to maintain calm in the face of pressure earns her the trust of many.",
      "Yet beneath her professional poise lies a simmering frustration. Lady Evelyn’s steadfast refusal to modernize the estate’s management jeopardizes not only the estate’s future but also Margaret’s own position. This tension fuels a private ambition masked by outward decorum.",
      "Her speech reflects this duality: polite and formal, yet with a sharpness that can catch the unwary off guard. Margaret’s barbed comments are delivered with a courteous smile, her polite savagery an art form in itself. She wields language as both shield and sword.",
      "Internally, she is torn. Loyalty to the estate and its long-standing traditions conflicts with her conviction that change is essential. This internal struggle colors her actions and attitudes, making her both a guardian of the old and a herald of the new, albeit reluctantly.",
      "Margaret’s claim of inspecting the kitchens during the critical time is uncorroborated, leaving a shadow of doubt. Whether driven by fear for her job or genuine concern for the estate, her motives intertwine ambition with allegiance.",
      "As the investigation probes deeper, Margaret stands at a crossroads, her future hinging on whether the manor will embrace transformation or remain shackled to the past."
    ],
    "order": 4
  },
  {
    "name": "James Archer",
    "summary": "The loyal, old-fashioned butler, devoted to family tradition but fearful of the changes threatening his role.",
    "publicPersona": "James is the quintessential butler, embodying devotion and traditional service. His presence is a reassuring constant within the household, a keeper of protocol and dignity.",
    "privateSecret": "He harbours a deep disdain for the younger generation’s disregard for established protocol and fears that Lady Evelyn’s death could usher in chaos threatening the stability and his own position.",
    "motiveSeed": "Though opposed to change, James feared that the victim’s death might precipitate upheaval that could lead to dismissal of long-serving staff, including himself.",
    "motiveStrength": "moderate",
    "alibiWindow": "States he was overseeing the wine cellar from 8:50 PM to 9:20 PM; some servant testimony supports this, but timing remains somewhat vague.",
    "accessPlausibility": "easy",
    "stakes": "Preserving the traditional household order and his own longstanding role are paramount to James.",
    "humourStyle": "deadpan",
    "humourLevel": 0.3,
    "speechMannerisms": "James speaks in a clipped, formal manner, his voice steady and unembellished. His deadpan delivery often carries an undercurrent of dry humour, revealing his skepticism toward modern trends without overt complaint. He favors brevity and precision, rarely volunteering more than necessary.",
    "signatureTic": "\"As it has always been, so it should remain.\"",
    "internalConflict": "James is caught between pride in his lifelong service and growing anxiety over the inevitable changes that threaten to render his role obsolete.",
    "personalStakeInCase": "The investigation’s outcome will determine whether the household retains its traditional order or succumbs to upheaval, directly impacting James’s future.",
    "paragraphs": [
      "James Archer epitomizes the steadfast butler, a man whose life has been devoted to maintaining the dignity and order of Stanhope Manor. His loyalty to the family is unwavering, and he views the household’s traditions as sacrosanct.",
      "Yet beneath his composed exterior lies a simmering discontent with the younger generation’s flouting of protocol. He sees their modern ideas as threats to the very fabric that has preserved the estate’s grandeur, and he fears for the fate of long-serving staff like himself.",
      "His speech is formal and clipped, delivered with a deadpan tone that often masks his sharp observations. James’s dry humour surfaces in understated remarks, a subtle critique of the changing times that he neither fully embraces nor openly confronts.",
      "During the critical hour, he claims to have been overseeing the wine cellar, a statement supported by some servants but lacking precise confirmation. This alibi straddles the line between credibility and suspicion, much like the man himself.",
      "Internally, James wrestles with the tension between pride in his service and the anxiety that inevitable change brings. The possibility of dismissal or diminished status weighs heavily upon him, coloring his interactions with the family and staff alike.",
      "As the investigation unfolds, James stands as a guardian of tradition, his future uncertain in a world that seems ever more inclined to discard the past."
    ],
    "order": 5
  },
  {
    "name": "Beatrice Collins",
    "summary": "The eager and discreet secretary, navigating loyalty and reformist ideals in a changing social landscape.",
    "publicPersona": "Beatrice is known as an efficient and trusted personal secretary to Lady Evelyn, managing correspondence and schedules with aplomb. She is discreet and eager, earning confidence within the household.",
    "privateSecret": "Privately, she harbors critical views of Lady Evelyn’s outdated attitudes and is secretly in contact with reformist political groups, hoping to advance progressive changes.",
    "motiveSeed": "Feared Lady Evelyn’s opposition to reforms would sabotage her career and ideological goals, prompting a motive to remove the obstacle.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been typing letters in the study from 8:40 PM to 9:10 PM, but was alone and unobserved during this period.",
    "accessPlausibility": "possible",
    "stakes": "Her career advancement and the success of her reformist ideals depend on overcoming the victim’s resistance.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice’s speech is quick and precise, with a tone that balances eagerness and professional restraint. She often interjects observations about social dynamics, revealing a sharp mind attuned to undercurrents. Her humour is subtle but perceptive, using irony and pointed comments to navigate delicate situations.",
    "signatureTic": "\"One must read between the lines, don’t you think?\"",
    "internalConflict": "She struggles to reconcile her loyalty to Lady Evelyn with her commitment to reformist ideals, torn between personal ambition and ethical considerations.",
    "personalStakeInCase": "The case’s outcome could either stifle or propel her career and ideological aspirations, making it deeply personal.",
    "paragraphs": [
      "Beatrice Collins is the indispensable right hand to Lady Evelyn, managing the estate’s correspondence and schedules with a blend of efficiency and discretion. Her youth and eagerness are tempered by a professionalism that earns her trust within the household.",
      "Yet beneath her dutiful exterior lies a mind restless with reformist zeal. She privately criticizes Lady Evelyn’s adherence to outdated values and maintains secret contacts with political groups advocating change, positioning herself at the nexus of tradition and progress.",
      "Her manner of speech is brisk and articulate, often punctuated by sharp observations about the social fabric surrounding her. Beatrice’s humour is observational, weaving irony and subtle wit into her comments as a means to navigate the often fraught dynamics of the estate.",
      "Her alibi—typing letters alone in the study—is uncorroborated, leaving room for suspicion. The solitude of her task contrasts with the communal nature of the household, underscoring her isolation amid competing loyalties.",
      "Internally, Beatrice grapples with conflicting loyalties: devotion to the Lady who entrusted her versus commitment to a future shaped by reform. This tension colors her decisions and fuels a quiet desperation to see her ideals realized.",
      "As the investigation progresses, Beatrice’s ambitions and ethics collide, placing her at a crossroads where career advancement and personal conscience hang in delicate balance."
    ],
    "order": 6
  },
  {
    "name": "Dr. Philip Marsh",
    "summary": "The reserved family physician, caught between medical ethics and self-preservation amid controversy.",
    "publicPersona": "Dr. Marsh is a trusted and discreet medical professional with longstanding ties to the Stanhope family. His calm demeanor and professional conduct inspire confidence among the household.",
    "privateSecret": "He is acutely aware of Lady Evelyn’s failing health and has opposed her refusal to accept certain treatments, a conflict that weighs heavily on him.",
    "motiveSeed": "Feared that the victim’s death would expose his controversial medical advice and could ruin his reputation; also worried about financial dependence on the estate.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was attending to a local patient in a nearby village from 8:00 PM to 9:30 PM, confirmed by a nurse’s testimony.",
    "accessPlausibility": "unlikely",
    "stakes": "His professional reputation and financial stability hinge on the investigation’s outcome, placing him under quiet pressure.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Marsh speaks in a calm, measured tone, his manner reserved and precise. He avoids unnecessary words and maintains a professional distance, rarely displaying emotion or humour. His speech reflects the careful restraint of a man accustomed to discretion and the weight of responsibility.",
    "signatureTic": "\"It is a matter of medical prudence.\"",
    "internalConflict": "He faces the ethical dilemma of respecting patient autonomy versus advocating for treatment, compounded by fear that exposure of his advice might end his career.",
    "personalStakeInCase": "The investigation threatens to unveil controversial aspects of his medical practice and jeopardize his financial reliance on the estate, making the case a matter of survival.",
    "paragraphs": [
      "Dr. Philip Marsh has served the Stanhope family with quiet dedication, his presence a reassuring constant amid the estate’s shifting fortunes. His reputation for discretion and professionalism is well earned, and he approaches his duties with solemn care.",
      "However, Lady Evelyn’s declining health and her refusal to accept certain treatments have placed him in a difficult position. His medical advice, though well-intentioned, has been met with resistance, and this conflict weighs heavily on his conscience.",
      "His speech is subdued and precise, reflecting a man who prefers facts over flourish. He maintains a professional detachment, avoiding emotional displays and eschewing humour altogether, his words chosen for clarity and prudence.",
      "During the critical time frame, Dr. Marsh was verifiably attending to a patient in a nearby village, with a nurse’s testimony supporting his alibi. This places him beyond easy reach of the manor, though suspicion lingers given his potential motives.",
      "Internally, he wrestles with the tension between medical ethics and self-preservation. The fear that exposure of his controversial treatments could end his career adds a layer of anxiety to his otherwise composed exterior.",
      "The outcome of the investigation carries profound implications for Dr. Marsh, threatening both his professional standing and financial security. His role in the unfolding drama is marked by quiet conflict and the burden of secrets."
    ],
    "order": 7
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Stanhope Manor Estate",
    "type": "Manor house estate",
    "place": "Ashcombe Vale",
    "country": "England",
    "summary": "An imposing Tudor Revival manor house set within formal gardens and dense woodlands, Stanhope Manor dominates the isolated Ashcombe Vale countryside, its grandeur shadowed by mounting tension and guarded secrets.",
    "visualDescription": "Half-timbered gables and steeply pitched roofs punctuate the sprawling stone façade; mullioned windows framed by creeping ivy overlook manicured parterres and gravelled drives winding through ancient oaks.",
    "atmosphere": "A blend of genteel elegance and foreboding quiet pervades the estate, where autumn mist clings to hedgerows and the chill dampness seeps into every creaking timber and stone flagstone.",
    "paragraphs": [
      "Stanhope Manor stands resolute against the grey autumn sky, its Tudor Revival architecture marked by dark oak beams and patterned brickwork. The extensive grounds are partitioned by clipped yew hedges and wrought-iron gates, beyond which dense woodlands press close, muffling distant sounds. The gravel drive crunches underfoot, bordered by fading chrysanthemums and moss-covered sundials that hint at the passage of time frozen in place.",
      "Inside, heavy velvet drapes and polished mahogany furniture speak of a bygone grandeur, while the pervasive scent of aged paper and leather-bound volumes fills the library. The manor’s layout restricts movement: private family quarters are locked tight, and servant passages are discreetly segregated, preserving social boundaries. The radio hums softly in the drawing room, its crackling voice a tenuous link to the wider world beyond the estate’s isolation.",
      "Outside, intermittent drizzle dampens the gardens and softens footsteps on the flagstone paths, preserving subtle footprints that may hold vital clues. The gatehouse enforces strict visitor logs, while the distant whistle of a steam train echoes faintly from the village miles away, underscoring the estate’s remoteness and the slow arrival of external aid.",
      "Despite the cozy interiors and careful order, an undercurrent of anxiety weaves through the household. Economic hardship and political unrest abroad weigh heavily on conversations whispered behind closed doors, while the sundial in the central courtyard, silent and moss-covered, seems to mark not only the hour but the tension that grips Stanhope Manor."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast autumn day with intermittent drizzle, dampening outdoor sounds and preserving subtle footprints",
    "timeFlow": "Three days of mounting tension marked by careful observation and constrained movement within the estate",
    "mood": "Cozy yet tense, with underlying social unease reflecting economic hardship and political unrest abroad",
    "eraMarkers": [
      "Rotary-dial domestic telephones with shared party lines",
      "Manual typewriters for correspondence and record keeping",
      "Petrol-powered automobiles owned by the estate family"
    ],
    "sensoryPalette": {
      "dominant": "damp earth and aged wood permeated by faint smoke and leather",
      "secondary": [
        "crackling radio static and whispered conversations",
        "rain-softened gravel and rustling autumn leaves"
      ]
    },
    "paragraphs": [
      "The estate breathes a quiet, measured rhythm as autumn rain mutes footsteps and softens the sharp edges of the manicured gardens. The scent of damp earth mingles with the rich musk of aged leather bindings and the faint trace of wood smoke from the manor’s chimneys. Inside, the low murmur of a radio and the rhythmic clatter of typewriter keys punctuate the heavy silence, while heavy curtains trap shadows beneath gas-lit sconces.",
      "Outside, the dense woodlands encircle the formal gardens like a protective embrace, yet their dark silhouettes hint at secrets hidden beyond the manicured paths. The intermittent drizzle preserves each footprint on the gravel drives and flagstones, a silent witness to movements made in haste or stealth. The sundial at the heart of the courtyard stands as a mute sentinel, its mossy face catching the dim light, marking the passage of time in a place where every moment counts."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Manor Courtyard by the Sundial",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A cobbled courtyard framed by Tudor facades, centered on a moss-covered stone sundial under skeletal linden trees; wet cobbles glisten beneath a grey sky, bordered by clipped box hedges and wrought-iron benches.",
      "sensoryDetails": {
        "sights": [
          "moss-clad stone sundial",
          "wet cobbled courtyard stones",
          "drizzle-dappled linden branches",
          "gloomy Tudor timber framing",
          "rusted wrought-iron garden benches",
          "flickering gas lamp shadows"
        ],
        "sounds": [
          "soft patter of autumn drizzle",
          "damp leaves rustling in breeze",
          "faint distant church bell tolls",
          "footsteps muted on cobbles",
          "occasional creak of wrought iron"
        ],
        "smells": [
          "cold damp stone and moss",
          "wet earth and fallen leaves",
          "faint smoke from distant chimneys",
          "lingering scent of aged oak",
          "damp iron and autumn grass"
        ],
        "tactile": [
          "slick mossy sundial surface",
          "cold wet cobblestones underfoot",
          "rough bark of linden trees",
          "chill autumn breeze on skin",
          "iron bench’s cold metal armrest",
          "damp fabric of overcoat sleeve"
        ]
      },
      "accessControl": "Restricted access; family and select staff only during daylight hours; visitors logged at gatehouse and escorted; courtyard locked at night except for household emergency use.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked sundial surface",
            "grey reflections on wet cobbles",
            "shimmering puddles in crevices",
            "droplets clinging to linden leaves"
          ],
          "sounds": [
            "steady rain drumming on stone",
            "gentle water trickling from gutters",
            "soft squelch of footsteps",
            "distant muffled voices"
          ],
          "smells": [
            "fresh wet earth",
            "mossy stone dampness",
            "cold rain on leaves"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light on stones",
            "shadows softened by cloud cover",
            "darkened timber beams"
          ],
          "sounds": [
            "silence broken by distant clock chime",
            "creaking iron bench",
            "rustle of dead leaves"
          ],
          "smells": [
            "damp stone",
            "faint wood smoke",
            "earthy leaf decay"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on sundial",
            "crisp autumn sky darkening"
          ],
          "sounds": [
            "distant voices from manor windows",
            "soft crackle of firelight",
            "rustling fabric in quiet footfalls"
          ],
          "smells": [
            "smoky hearth embers",
            "cool night air",
            "faint scent of garden herbs"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The manor courtyard, with its moss-covered sundial at center, is an enclave of stillness beneath the skeletal linden trees. The cobblestones are slick from the persistent drizzle, reflecting the muted grey sky above. Clipped box hedges border the space, while wrought-iron benches stand empty, their rusted arms cold to the touch. The Tudor timber framing of the surrounding buildings absorbs the dim light, casting deep shadows that seem to lengthen as the day wanes.",
        "Sounds are hushed here; the soft patter of rain on stone mingles with the rustling of damp leaves and distant, solemn church bells. The chill dampness carries the faint smoke of distant chimneys, blending with the musky scent of moss and wet earth. In this quiet, the sundial stands as a silent witness to the crime, its surface slick and cold under cautious fingers, marking an hour heavy with secrets."
      ]
    },
    {
      "id": "library",
      "name": "Manor Library",
      "type": "interior",
      "purpose": "Clue discovery and private consultation",
      "visualDetails": "A high-ceilinged room lined with floor-to-ceiling oak bookshelves filled with leather-bound volumes; heavy velvet drapes partially drawn over mullioned windows; a large carved desk cluttered with papers and a manual typewriter.",
      "sensoryDetails": {
        "sights": [
          "dark oak bookshelves crammed with volumes",
          "golden glow from shaded desk lamp",
          "dust motes in filtered daylight",
          "heavy velvet curtains drawn aside",
          "stacked correspondence papers",
          "engraved brass desk fittings"
        ],
        "sounds": [
          "soft scratch of pen on paper",
          "quiet turning of brittle pages",
          "distant ticking of brass clock",
          "low hum of radio receiver",
          "faint crackle from fireplace"
        ],
        "smells": [
          "musty leather bindings",
          "faint scent of old parchment",
          "smoky cedarwood from shelves",
          "slight tang of ink and wax",
          "warm beeswax polish"
        ],
        "tactile": [
          "smooth polished wood desk surface",
          "rough grain of leather book covers",
          "cool metal of typewriter keys",
          "soft velvet curtain folds",
          "warm hearthstone edges"
        ]
      },
      "accessControl": "Access limited to family members and trusted staff during daytime; locked evenings; visitors require escort.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through wet windowpanes",
            "rain-streaked mullions"
          ],
          "sounds": [
            "steady rain tapping roof",
            "soft rustling of papers",
            "low radio static"
          ],
          "smells": [
            "damp leather",
            "fresh ink",
            "warm beeswax polish"
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat muted daylight",
            "dust motes drifting in air",
            "deep shadows in corners"
          ],
          "sounds": [
            "clock ticking steadily",
            "page turning softly",
            "fireplace embers crackling"
          ],
          "smells": [
            "cedarwood smoke",
            "old parchment",
            "wax polish"
          ],
          "mood": "contemplative"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm lamplight glow",
            "dark window panes reflecting interior",
            "shimmering firelight"
          ],
          "sounds": [
            "typewriter keys clicking",
            "radio broadcasts faintly",
            "soft crackle of fire"
          ],
          "smells": [
            "burning wood smoke",
            "fresh ink",
            "aged leather"
          ],
          "mood": "focused intensity"
        }
      ],
      "paragraphs": [
        "The library is a sanctuary of knowledge, its soaring oak shelves heavy with leather-bound tomes and yellowed manuscripts. Golden light from a shaded desk lamp spills over stacks of correspondence and a manual typewriter, while dust motes drift lazily in the filtered daylight through the mullioned windows. Heavy velvet curtains frame the view outside, muffling the damp world beyond.",
        "Within this hushed space, the low hum of the radio blends with the soft scratch of pen on paper and the ticking of a brass clock. The air carries the warm scent of beeswax polish mingled with smoky cedarwood and the faint tang of ink, inviting careful scrutiny of clues hidden in written words or whispered confidences. The polished desk surface is cool beneath fingertips, a tactile reminder of the painstaking search for truth."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants’ Hall",
      "type": "interior",
      "purpose": "Staff gathering and informal exchanges",
      "visualDetails": "A modest room with sturdy wooden benches and tables, plain plastered walls hung with a calendar and notices; a large cast-iron stove dominates one corner, surrounded by polished tin kettles and chipped crockery.",
      "sensoryDetails": {
        "sights": [
          "worn wooden benches and tables",
          "faded calendar pinned to wall",
          "scuffed floorboards",
          "glowing stove embers",
          "chipped enamel mugs",
          "patchwork cloth napkins"
        ],
        "sounds": [
          "clinking of tin cups",
          "soft murmur of hushed conversation",
          "steady crackle from stove",
          "footsteps on creaking floorboards",
          "rustle of coarse uniforms"
        ],
        "smells": [
          "boiling tea and damp wool",
          "stove smoke and burnt toast",
          "earthy scent of laundry soap",
          "musty cloth and dry wood",
          "faint aroma of boiled cabbage"
        ],
        "tactile": [
          "rough wooden bench surfaces",
          "warm cast-iron stove heat",
          "coarse fabric of uniforms",
          "smooth enamel cup rims",
          "grainy texture of worn floorboards"
        ]
      },
      "accessControl": "Restricted to domestic staff during work hours and breaks; family and visitors prohibited except by invitation; door locked at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through small window",
            "steam rising from tea kettles",
            "glowing stove embers"
          ],
          "sounds": [
            "rain tapping on windowpanes",
            "soft chatter among staff",
            "stove crackling"
          ],
          "smells": [
            "fresh brewed tea",
            "damp wool uniforms",
            "burnt toast"
          ],
          "mood": "quiet camaraderie"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "flickering stove glow",
            "worn calendar pages"
          ],
          "sounds": [
            "murmured conversations",
            "footsteps pacing floorboards",
            "stove embers popping"
          ],
          "smells": [
            "earthy soap",
            "stove smoke",
            "boiled cabbage"
          ],
          "mood": "weary routine"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm stove light",
            "darkened window silhouettes",
            "neatly stacked crockery"
          ],
          "sounds": [
            "soft laughter",
            "quiet footsteps",
            "stove heat humming"
          ],
          "smells": [
            "fresh laundry",
            "wood smoke",
            "tea and toast"
          ],
          "mood": "relaxed respite"
        }
      ],
      "paragraphs": [
        "The servants’ hall is a humble refuge from the demands of the manor, its sturdy wooden benches and tables worn smooth by years of use. A large cast-iron stove radiates warmth, surrounded by an assortment of polished tin kettles and chipped crockery. Faded calendars and notices hang on plain plaster walls, reminders of the regimented daily routine that governs this hidden world.",
        "Here, the clinking of cups and soft murmur of voices form a quiet chorus beneath the steady crackle of the stove. The air carries the earthy scent of laundry soap mingled with the smoky tang of wood fire and the faint aroma of boiled cabbage. The tactile textures of rough bench surfaces and coarse uniforms ground the servants in their shared labor and whispered confidences."
      ]
    },
    {
      "id": "gatehouse",
      "name": "Estate Gatehouse",
      "type": "transitional",
      "purpose": "Visitor verification and access control",
      "visualDetails": "A small stone building with leaded glass windows and a slate roof, flanked by wrought-iron gates set into high stone pillars; inside, a wooden desk cluttered with visitor logs and a rotary telephone.",
      "sensoryDetails": {
        "sights": [
          "frosted leaded glass panes",
          "weathered stone pillars",
          "iron gate bars",
          "stacked visitor registers",
          "glossy black telephone",
          "faint light from oil lamp"
        ],
        "sounds": [
          "clicking rotary phone dial",
          "rustling paper logs",
          "distant rumble of automobile",
          "metal gate creaking",
          "footsteps on gravel path"
        ],
        "smells": [
          "cold damp stone",
          "faint oil and ink",
          "wood polish",
          "smoky lamp oil",
          "fresh autumn leaves"
        ],
        "tactile": [
          "rough stone wall surface",
          "smooth rotary dial",
          "coarse paper pages",
          "cold iron gate bars",
          "worn wooden desk edge"
        ]
      },
      "accessControl": "Strictly monitored; all visitors recorded and identity verified; gates locked after dusk; telephone connects to manor and nearest village exchange.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windowpanes",
            "glossy wet gate bars",
            "grey stone pillars"
          ],
          "sounds": [
            "steady rain on roof",
            "telephone ringing softly",
            "footsteps splashing gravel"
          ],
          "smells": [
            "wet stone",
            "damp wood",
            "oil lamp smoke"
          ],
          "mood": "alert vigilance"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on gate ironwork",
            "shadows beneath eaves",
            "faint glow of oil lamp"
          ],
          "sounds": [
            "rustling paper",
            "quiet telephone clicks",
            "distant carriage wheels"
          ],
          "smells": [
            "ink and paper",
            "cold stone",
            "smoky lamp oil"
          ],
          "mood": "watchful calm"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "flickering oil lamp light",
            "silhouetted gate pillars",
            "darkening slate roof"
          ],
          "sounds": [
            "soft gate creak",
            "telephone receiver lifted",
            "crisp footsteps on gravel"
          ],
          "smells": [
            "cool night air",
            "fresh leaves",
            "oil lamp smoke"
          ],
          "mood": "guarded quiet"
        }
      ],
      "paragraphs": [
        "The estate gatehouse stands as the first line of defense against the outside world, its small stone structure weathered by years of wind and rain. Frosted leaded glass windows glow faintly with oil lamp light, while wrought-iron gates hang between high stone pillars, their bars slick with autumn moisture. Inside, a wooden desk bears the weight of visitor logs and a rotary telephone, the estate’s lifeline to the village beyond.",
        "Sounds of clicking dials and rustling papers fill the cramped space, mingling with the distant rumble of automobiles on the gravel drive. The air smells of cold damp stone, wood polish, and smoky lamp oil, a sensory reminder of the vigilance required to maintain order and security. Access is tightly controlled here, with all visitors recorded and identity verified before the heavy gates swing open."
      ]
    }
  ],
  "note": "",
  "cost": 0.006744072,
  "durationMs": 55324
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1931,
    "month": "May",
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "mild temperatures averaging 50-60°F (10-15°C)",
      "frequent overcast skies with occasional light rain showers",
      "damp mornings with lingering morning dew on lawns and garden beds"
    ],
    "daylight": "Increasing daylight hours with sunset around 8:30 pm, allowing for extended outdoor activities in the early evening",
    "time_of_day_of_crime": "Late afternoon to early evening — between 5 pm and 7 pm, when daylight begins fading and shadows lengthen across the manor grounds",
    "holidays": [
      "May Day (May 1) celebrated with traditional dances and maypole festivities",
      "Ascension Day (may vary, often in May) observed by some in the community",
      "Early preparations for Whitsun (Pentecost) approaching at month's end"
    ],
    "seasonalActivities": [
      "Planting and tending to spring flower beds, particularly tulips and bluebells",
      "Organizing and attending afternoon garden parties or tea on the manor's terrace",
      "Early morning walks on estate grounds to enjoy emerging greenery and bird song"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Single-breasted wool suits in muted grays and browns with narrow lapels",
        "Starched detachable collars paired with silk neckties featuring geometric Art Deco patterns",
        "Two-tone Oxford shoes with leather wingtips"
      ],
      "casual": [
        "Lightweight tweed jackets with elbow patches",
        "Knitted v-neck sweaters layered over collared shirts",
        "Flat caps or trilby hats for outdoor wear"
      ],
      "accessories": [
        "Pocket watches with chain attachments",
        "Leather gloves in dark brown or black",
        "Silk pocket squares with subtle paisley prints"
      ]
    },
    "womensWear": {
      "formal": [
        "Drop-waist day dresses in floral prints or pastel silk, featuring pleated skirts",
        "Cloche hats decorated with ribbons or small feathers",
        "Kid leather gloves and matching low-heeled pumps"
      ],
      "casual": [
        "Lightweight gabardine skirts paired with blouses having Peter Pan collars",
        "Short-sleeved cardigans in soft colors",
        "Simple straw hats for garden use"
      ],
      "accessories": [
        "Beaded handbags or small leather purses",
        "Delicate pearl necklaces or brooches",
        "Silk scarves tied around the neck or hat"
      ]
    },
    "trendsOfTheMoment": [
      "Emphasis on slender silhouettes with dropped waistlines for women",
      "Emergence of geometric patterns influenced by Art Deco in textiles and accessories",
      "Men favoring softer tailoring and casual layering amid economic restraint"
    ],
    "socialExpectations": [
      "Men expected to present a polished and respectable appearance reflecting their social standing",
      "Women encouraged to maintain modesty while embracing modern styles that allowed greater mobility",
      "Accessories and grooming serve as subtle indicators of wealth and taste given budget constraints"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "British economy struggles from the ongoing Great Depression, with rising unemployment and industrial unrest",
      "May 1931 sees political unease as Ramsay MacDonald’s National Government debates budget cuts and austerity",
      "Internationally, tensions grow with Japan’s aggression in Manchuria raising concerns in London political circles"
    ],
    "politicalClimate": "A fragile coalition government attempts to balance austerity measures with social welfare demands while maintaining imperial interests, creating underlying societal tensions",
    "economicConditions": "Widespread economic hardship with factories closing and many families feeling the strain, though landed estates often attempt to maintain appearances despite reduced incomes",
    "socialIssues": [
      "Class divisions become more pronounced as working-class hardship increases",
      "Debates over social reform and unemployment relief intensify",
      "Anxieties about the rise of extremist political movements abroad begin permeating elite discussions"
    ],
    "internationalNews": [
      "Japan’s occupation of Manchuria continues to unsettle global diplomacy",
      "The United States experiences banking failures contributing to worldwide economic uncertainty"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Duke Ellington’s orchestral jazz numbers gaining popularity",
        "Bing Crosby’s crooning beginning to influence British tastes",
        "Classical music concerts featuring works by Ravel and Debussy"
      ],
      "films": [
        "‘City Lights’ (1931) by Charlie Chaplin admired for its blend of comedy and pathos",
        "‘Dracula’ (1931) introduces the horror genre to wide audiences",
        "British films such as ‘The Man Who Knew Too Much’ (early production) spark interest"
      ],
      "theater": [
        "West End productions of Noël Coward’s plays drawing sophisticated audiences",
        "Revues featuring variety acts and music hall stars remain popular",
        "Shakespeare performances staged by repertory companies"
      ],
      "radio": [
        "The BBC Home Service broadcasts news, drama, and classical music",
        "Comedy programs like ‘Band Waggon’ begin captivating listeners",
        "Educational talks and serialized detective stories air in evening slots"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s ‘The Sittaford Mystery’ (1931) enjoyed by mystery readers",
        "Virginia Woolf’s ‘The Waves’ (1931) pushes modernist boundaries",
        "Daphne du Maurier’s early works gaining attention in literary circles"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Modernist experimental novels",
        "Romantic and historical fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "Increased adoption of domestic radio receivers with improved sound fidelity",
        "Introduction of more efficient manual typewriters used in offices and homes",
        "Early development of talking motion pictures (talkies) transforming entertainment"
      ],
      "commonDevices": [
        "Rotary dial telephones, often shared on party lines in rural areas",
        "Bicycle ownership common for local transport",
        "Electric kitchen appliances beginning to appear in affluent households"
      ],
      "emergingTrends": [
        "Growing reliance on radio as a primary news source",
        "Expansion of automobile use among middle and upper classes",
        "Improved public transport connectivity in suburban and rural areas"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 4 pence",
        "Pint of milk: 1 penny",
        "Taxi ride across town: approximately 2 shillings"
      ],
      "commonActivities": [
        "Household staff preparing afternoon tea and maintaining estate grounds",
        "Residents reading newspapers or gathering around radio sets in the evening",
        "Sunday church attendance and social calls among neighbors"
      ],
      "socialRituals": [
        "Strict adherence to formal meal times and seating arrangements in manor houses",
        "Seasonal garden parties serving as key social networking events for local gentry"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Landed gentry maintain a sense of noblesse oblige but face economic pressures that erode traditional privileges",
      "Domestic staff expected to show unquestioning loyalty and reverence toward estate owners"
    ],
    "gender": [
      "Women increasingly participate in social and cultural activities but remain largely confined to domestic roles",
      "Men bear responsibility for financial provision and public representation of family status",
      "Subtle shifts begin as younger women experiment with more relaxed fashions and attitudes"
    ],
    "race": [
      "Predominantly Eurocentric social norms with limited awareness of multicultural perspectives within British society",
      "Colonial attitudes still prevalent in elite circles, often unchallenged"
    ],
    "generalNorms": [
      "Deference to hierarchy and tradition governs daily interactions, especially within the estate",
      "Privacy and discretion highly valued in personal and social matters",
      "Public displays of emotion or dissent discouraged among upper classes"
    ]
  },
  "atmosphericDetails": [
    "The damp earth and fresh greenery emit a subtle, rich scent under the subdued gray skies",
    "Muted footsteps echo softly on wet stone paths, muffled by the persistent drizzle",
    "The steady hum of distant radio broadcasts blends with the subdued rustle of spring leaves, underscoring a fragile calm"
  ],
  "paragraphs": [
    "May 1931 at Stanhope Manor unfolds amidst the lingering chill of early spring, with overcast skies casting a somber light over the estate's sprawling gardens. The frequent drizzle dampens the gravel paths and muffles sounds, preserving the faintest traces of footsteps—an important detail in any investigation. Daylight lingers well into the early evening, but the gathering gloom brings a quiet tension as shadows creep across the manor's venerable stone facade. This time of year is marked by traditional May Day celebrations in nearby villages, contrasting with the manor’s more restrained observances amid economic uncertainty.",
    "Fashion at the manor reflects both the elegance and the austerity of the times. Gentlemen favor well-tailored wool suits in muted tones, their accessories restrained yet refined, while ladies adopt the modern drop-waist silhouette in soft floral fabrics, complemented by cloche hats and delicate gloves. The delicate balance between maintaining appearances and coping with financial constraints is evident in the careful selection of garments and accessories, with an emphasis on subtle luxury rather than ostentation. Social rituals such as afternoon tea and garden parties continue to serve as essential venues for reinforcing class distinctions and gossip.",
    "Daily life here is shaped by the great social and economic pressures of the era. The household staff moves with practiced discretion, managing estate affairs under reduced budgets while upholding strict standards of service and deference. News from the BBC radio and newspapers brings reports of political instability and economic hardship, heightening an underlying anxiety among the gentry. Conversations often touch on international tensions, especially Japan’s aggressive moves in Manchuria, signaling a world on the brink of further upheaval. Yet amid these challenges, the rhythms of estate life, from formal meals to Sunday worship, maintain a fragile semblance of order and tradition."
  ],
  "note": "All details are historically grounded in British upper-class estate life during May 1931, reflecting the intersection of seasonal customs, fashion, technology, and social dynamics relevant to a manor house mystery narrative.",
  "cost": 0.00352182,
  "durationMs": 24426
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amid economic strain and rising political tensions, the landed Stanhope family and their loyal domestic staff are confined within the rigidly controlled manor estate, where social hierarchies and strict household protocols intensify underlying unease.",
  "era": {
    "decade": "1930s",
    "socialStructure": "A clear divide between the landed gentry and domestic staff defines daily life, with deference to estate owners and adherence to strict household protocols, all under the shadow of Great Depression hardships and elite discussions of European unrest."
  },
  "setting": {
    "location": "A large, Tudor Revival country estate several miles from the nearest village, surrounded by formal gardens and woodlands with limited road access.",
    "institution": "Manor house estate",
    "weather": "Overcast autumn day with intermittent drizzle, dampening outdoor sounds and preserving subtle footprints."
  },
  "castAnchors": [
    "Inspector Harold Bramwell",
    "Lady Evelyn Stanhope",
    "Charles Stanhope",
    "Margaret Lyle",
    "James Archer",
    "Beatrice Collins",
    "Dr. Philip Marsh"
  ],
  "theme": "A classic murder mystery emphasizing social tension and protocol within a confined, hierarchical estate setting."
}

### LOCKED_FACTS
[
  {
    "id": "sundial_shadow_absent_time",
    "value": "a quarter past two",
    "description": "Exact time when sundial shadow vanished due to cloud cover"
  },
  {
    "id": "garden_temperature_drop",
    "value": "forty-five degrees Fahrenheit",
    "description": "Temperature recorded in the garden coinciding with the shadowless period"
  },
  {
    "id": "sun_azimuth_at_event",
    "value": "ninety-five degrees east of true north",
    "description": "Sun’s horizontal angle relative to the sundial at the critical time"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 23,
  "countsByPlacement": {
    "early": 6,
    "mid": 17,
    "late": 0
  },
  "countsByCriticality": {
    "essential": 22,
    "supporting": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_11",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_13",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_14",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_15",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_16",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_17",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_18",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_19",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_20",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_21",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_22",
      "placement": "mid",
      "criticality": "supporting",
      "category": "physical"
    },
    {
      "id": "clue_culprit_direct_charles_stanhope",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    }
  ]
}

---

## OUTPUT INSTRUCTIONS

Produce a single JSON object with ALL of the following fields.

Return the JSON object directly — no preamble, no markdown fences, no commentary.

ARRAYS RULE: Every array field (characterPortraits, characterVoiceSketches, locationRegisters,
humourPlacementMap) must contain ONLY the specified object type. Do NOT include strings, notes,
comments, or extra placeholder entries anywhere inside an array. Each array element must be a
valid JSON object conforming to the schema below.

MANDATORY FIELD LENGTHS:
- storyEmotionalArc.arcDescription: MINIMUM 300 words (target 350).
  This is the most important field. Plan your token budget for it FIRST.
  Write multiple distinct paragraphs tracing the full emotional journey:
    Para 1 — Opening atmosphere and the weight of the initial crime
    Para 2 — Rising investigation: first clues, first false leads, emotional cost
    Para 3 — Mid-story pivot: something changes the investigator's direction
    Para 4 — Second turn: a revelation recolours earlier events
    Para 5 — Pre-climax and climax: mounting pressure and confrontation
    Para 6 — Resolution: what the ending costs emotionally for each character
  A single dense paragraph will fail the validation gate regardless of word count. Count your words.
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- revealImplications: MINIMUM 90 words. Three earlier scenes, each revisited with one full sentence
  of analysis. Aim for 120 words.
- storyTheme: MINIMUM 25 words. Write a complete sentence with a subject, main clause, and a nuanced
  qualifier about the story's deeper meaning. Not a title, a noun phrase, or a fragment.
  A storyTheme shorter than 25 words will fail the quality gate.
- SELF-CHECK CONTRACT (INTERNAL): before returning JSON, verify the minimum lengths and required scene-position coverage are already satisfied on this first pass.

Required structure:
{
  "status": "final",
  "storyTheme": "<one sentence — story's deeper meaning, not a plot summary>",
  "historicalMoment": {
    "specificDate": "<year and month from TEMPORAL_CONTEXT exactly>",
    "eraRegister": "<200-300 words: what is it like to live through this specific moment>",
    "currentTensions": ["<3-5 concrete current-event pressures at this date>"],
    "physicalConstraints": ["<3-6 era-specific physical constraints on movement and communication>"],
    "emotionalRegister": "<one sentence: dominant collective emotional state at this date>",
    "wartimeServiceContext": { "serviceStatus": "...", "socialTexture": "...", "absenceEffect": "..." }
  },
  "characterPortraits": [
    {
      "name": "<exact name from CASE.cast>",
      "portrait": "<80-120 words: this character's relationship to the historical moment>",
      "eraIntersection": "<one sentence: how their private situation intersects with the historical moment>"
    }
  ],
  "characterVoiceSketches": [
    {
      "name": "<exact name from CASE.cast>",
      "voiceDescription": "<one sentence: how this character sounds and speaks — functional, no labels>",
      "fragments": [
        { "register": "comfortable", "text": "<2-4 lines of actual speech, no attribution>" },
        { "register": "evasive", "text": "<2-4 lines of actual speech>" },
        { "register": "stressed", "text": "<2-4 lines of actual speech>" }
      ],
      "humourNote": "<one sentence — include only if humourLevel > 0 in profiles>"
    }
  ],
  "locationRegisters": [
    {
      "locationId": "<must match a keyLocation id from LOCATION_PROFILES>",
      "name": "<location name>",
      "emotionalRegister": "<60-100 words: what it feels like to be here in this story>",
      "eraNote": "<one sentence: era-specific constraint on this location — optional>",
      "cameraAngle": "<one sentence: emotional stance for a writer entering this space>"
    }
  ],
  "storyEmotionalArc": {
    "dominantRegister": "<one sentence: story's overall emotional character>",
    "arcDescription": "<300-400 words: emotional map of the journey, not a plot summary>",
    "turningPoints": [
      { "position": "opening", "emotionalDescription": "<one sentence>" },
      { "position": "early", "emotionalDescription": "<one sentence>" },
      { "position": "first_turn", "emotionalDescription": "<one sentence>" },
      { "position": "mid", "emotionalDescription": "<one sentence>" },
      { "position": "second_turn", "emotionalDescription": "<one sentence>" },
      { "position": "pre_climax", "emotionalDescription": "<one sentence>" },
      { "position": "climax", "emotionalDescription": "<one sentence>" },
      { "position": "resolution", "emotionalDescription": "<one sentence>" }
    ],
    "endingNote": "<one sentence: what emotional register does the ending carry>"
  },
  "humourPlacementMap": [
    { "scenePosition": "opening_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "first_investigation",  "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "body_discovery",       "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "first_interview",      "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "domestic_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "mid_investigation",    "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "second_interview",     "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "tension_scene",        "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "pre_climax",           "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "discriminating_test",  "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "revelation",           "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "resolution",           "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" }
  ],
  "breakMoment": {
    "character": "<non-culprit, non-detective cast member>",
    "scenePosition": "<one of the 12 humour positions — best at tension_scene or pre_climax>",
    "form": "<specific: how loss of control manifests>",
    "narrativeFunction": "<one sentence: why this moment matters>"
  },
  "revealImplications": "<90-150 words: 2-3 earlier story moments the final revelation will retroactively recolour>",
  "validationConfirmations": {
    "noNewCharacterFacts": true,
    "noNewPlotFacts": true,
    "castComplete": true,
    "eraSpecific": true,
    "lockedFactsPreserved": true,
    "humourMapComplete": true
  }
}

IMPORTANT RULES for humourPlacementMap:
- "body_discovery", "discriminating_test", "revelation": ALWAYS "forbidden". No exceptions.
- "tension_scene", "pre_climax": "forbidden" unless a character has humourLevel > 0.7 AND no direct threat/violence. Then "conditional" with explicit condition.
- Characters with humourLevel < 0.3 must NOT appear in permittedCharacters.
- The detective may appear in permittedCharacters only for "domestic_scene" and "resolution", and only with "understatement" or "dry_wit".
- All 12 scene positions must be present in humourPlacementMap.

IMPORTANT: characterPortraits and characterVoiceSketches must each have exactly one entry per cast member in CASE.cast, in the same order.
```

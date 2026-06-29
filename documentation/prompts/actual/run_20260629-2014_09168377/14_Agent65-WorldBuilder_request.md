# Actual Prompt Record

- Run ID: `run_09168377-8a7c-483c-b498-af9745492070`
- Project ID: `proj_b81c20c5-117d-447a-9663-b6dd7554ca0d`
- Timestamp: `2026-06-29T20:20:07.678Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `46218d576b15c0fd`

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
    "title": "The Sundial Shadow Conspiracy",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "No modern forensic technology beyond fingerprinting and basic toxicology",
        "Communication limited to telephone and telegrams",
        "Social hierarchy strictly enforced in manor household",
        "Transportation primarily by automobile and horse-drawn carriage"
      ]
    },
    "setting": {
      "location": "Marwood Manor, Little Middleton, Yorkshire",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "country house estate (manor house)"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "stabbing"
    }
  },
  "death_method": "stabbed with a dagger",
  "cast": [
    {
      "name": "Edith Marwood",
      "age_range": "50s",
      "role_archetype": "victim",
      "relationships": [
        "Wife of Edward Marwood",
        "Mother of Arthur Langley"
      ],
      "public_persona": "Matriarch of Marwood family, respected and reserved",
      "private_secret": "Had recently confronted a family secret involving a forged ledger",
      "motive_seed": "Knew of embezzlement threatening family reputation",
      "motive_strength": "N/A",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "High personal and family reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Arthur Langley",
      "age_range": "40s",
      "role_archetype": "Detective",
      "relationships": [
        "Son of Edith and Edward Marwood"
      ],
      "public_persona": "Estate manager and amateur sleuth",
      "private_secret": "Harbors resentment toward family financial secrets",
      "motive_seed": "Suspected someone was trying to hide financial fraud",
      "motive_strength": "moderate",
      "alibi_window": "Between two and four in the afternoon",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Estate grounds",
        "Servants' quarters",
        "Family wing"
      ],
      "behavioral_tells": [
        "Observant and skeptical of servants’ timelines"
      ],
      "stakes": "Protect family name and uncover truth",
      "evidence_sensitivity": [
        "Ledger records",
        "Clock and sundial timings"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Beatrice Hargrave",
      "age_range": "30s",
      "role_archetype": "Housekeeper",
      "relationships": [
        "Trusted senior servant"
      ],
      "public_persona": "Efficient and loyal housekeeper",
      "private_secret": "Recently discovered discrepancies in ledgers",
      "motive_seed": "Feared exposure of her involvement in minor embezzlement",
      "motive_strength": "moderate",
      "alibi_window": "Claims to be in kitchen from one to three",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Servants' quarters",
        "Kitchen",
        "Family wing"
      ],
      "behavioral_tells": [
        "Nervous when ledger is mentioned"
      ],
      "stakes": "Employment and reputation",
      "evidence_sensitivity": [
        "Ledger pages",
        "Kitchen access logs"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Charles Whitmore",
      "age_range": "50s",
      "role_archetype": "Butler",
      "relationships": [
        "Head of household staff"
      ],
      "public_persona": "Impeccably proper, controls estate access",
      "private_secret": "Knows about ledger falsifications but loyal to family",
      "motive_seed": "Wants to protect the estate’s reputation",
      "motive_strength": "low",
      "alibi_window": "Claims to be in the main hall from two to four",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Main hall",
        "Servants’ quarters",
        "Family wing"
      ],
      "behavioral_tells": [
        "Assertive about access permissions"
      ],
      "stakes": "Maintain social order and his position",
      "evidence_sensitivity": [
        "Access logs",
        "Household schedules"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Daphne Sinclair",
      "age_range": "20s",
      "role_archetype": "Guest",
      "relationships": [
        "Friend of Arthur Langley"
      ],
      "public_persona": "Charming visitor to the estate",
      "private_secret": "Has secret romantic ties with Arthur",
      "motive_seed": "Jealousy over Edith's influence on Arthur",
      "motive_strength": "low",
      "alibi_window": "Claims to be in the garden between two and three",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Garden",
        "Guest wing"
      ],
      "behavioral_tells": [
        "Distracted when questioned about whereabouts"
      ],
      "stakes": "Preserve relationship with Arthur",
      "evidence_sensitivity": [
        "Garden sundial",
        "Guest logs"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Edward Marwood",
      "age_range": "60s",
      "role_archetype": "Patriarch",
      "relationships": [
        "Husband of Edith Marwood",
        "Father of Arthur Langley"
      ],
      "public_persona": "Estate owner, traditional and authoritative",
      "private_secret": "Concealed a past financial scandal",
      "motive_seed": "Fear of scandal exposure after Edith's threats",
      "motive_strength": "strong",
      "alibi_window": "Says he was in his study from one to four",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Study",
        "Family wing"
      ],
      "behavioral_tells": [
        "Irritable when questioned about finances"
      ],
      "stakes": "Preserve family legacy",
      "evidence_sensitivity": [
        "Study ledger",
        "Access to family wing"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Edward Marwood"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In the isolated Marwood Manor during a drizzly early autumn afternoon, Edith Marwood is found stabbed in her private sitting room. The household staff and family provide conflicting timelines. The sundial in the garden and the stopped watch on Edith reveal a contradiction in the reported time of death. Arthur Langley investigates, unravelling a scheme that manipulated the timing of events and exploited social trust to conceal the real murderer within the family."
    },
    "accepted_facts": [
      "Edith Marwood was stabbed in her sitting room between two and four in the afternoon.",
      "Servants testified that Edith was alive until shortly before sunset.",
      "The sundial shadow on Edith's watch face indicates a later time than servants claim.",
      "Edward Marwood claims to have been in his study during the murder window.",
      "The household follows strict schedules, including servant rounds and meal times.",
      "The family ledger shows suspicious financial entries linked to Edward Marwood."
    ],
    "inferred_conclusions": [
      "The time of death was later than servants testified due to sundial shadow evidence.",
      "Edward Marwood had opportunity and motive to commit the murder.",
      "Servants’ testimonies on timing are unreliable or manipulated.",
      "The family ledger falsification is linked to Edward’s motive."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murder was concealed by manipulating the timeline through false servant testimonies and the misuse of the sundial’s shadow as an alibi. Edward Marwood exploited the physical law of solar shadow geometry, deliberately positioning Edith's stopped watch to cast a shadow indicating an earlier time than the actual murder. This misled witnesses and investigators. Additionally, the strict social structure and authority channels suppressed contradictory testimonies, allowing the false timeline to hold until Arthur Langley's logical deconstruction.",
      "delivery_path": [
        {
          "step": "Edward arranged for the watch to be placed face-up in the garden to catch the sundial's shadow."
        },
        {
          "step": "Servant testimonies were coached to align with an earlier time before sunset."
        },
        {
          "step": "Edward claimed an alibi in the study based on manipulated household schedules."
        },
        {
          "step": "Arthur Langley analyzed shadow angles and ledger inconsistencies to expose the false timeline."
        }
      ]
    },
    "outcome": {
      "result": "The sundial shadow and ledger arithmetic prove the murder occurred later than claimed, invalidating servant alibis and implicating Edward Marwood as the murderer."
    }
  },
  "false_assumption": {
    "statement": "The victim was murdered shortly before sunset as all household servants consistently testified.",
    "type": "temporal",
    "why_it_seems_reasonable": "Multiple servants reported hearing Edith alive during late afternoon activities, and the family dinner time was scheduled shortly after sunset.",
    "what_it_hides": "It hides the fact that the murder occurred later, after servants' claimed presence, and the timeline was manipulated through false testimonies and physical shadow misdirection."
  },
  "false_solution": {
    "accused_suspect": "Charles Whitmore",
    "supporting_points": [
      "Charles controlled access to the family wing and could have had the opportunity during his supposed watch in the main hall.",
      "His assertiveness about access permissions could be seen as a cover for secret movements."
    ],
    "the_one_flaw": "The sundial shadow and ledger arithmetic prove the time of death occurred when Charles was accounted for in the main hall, eliminating him as the culprit.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Beatrice Hargrave was seen nervously handling the family ledger shortly before the murder.",
      "points_at_suspect": "Beatrice Hargrave",
      "innocent_explanation": "She was correcting minor bookkeeping errors unrelated to the murder and had no motive to kill Edith.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Daphne Sinclair’s unexplained presence in the garden near the sundial around the murder time.",
      "points_at_suspect": "Daphne Sinclair",
      "innocent_explanation": "She was meeting Arthur Langley secretly, unrelated to the murder.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Arthur Langley",
      "Beatrice Hargrave",
      "Charles Whitmore",
      "Daphne Sinclair",
      "Edward Marwood"
    ],
    "rationale": "The manor’s isolation and strict access control ensured no outsiders could enter unseen; all possible suspects were present on the estate at the time."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Servant testimonies placing Edith alive before sunset",
        "Sun position and shadow length on the sundial",
        "Household meal schedule starting at half past six",
        "Edward's study occupancy from one to four in the afternoon"
      ],
      "windows": [
        "Murder must occur between two and four in the afternoon",
        "Servants scheduled rounds between one and five"
      ],
      "contradictions": [
        "Sundial shadow indicates time inconsistent with servant statements",
        "Ledger entries dated after the supposed time of murder",
        "Edward's alibi overlaps with murder window"
      ]
    },
    "access": {
      "actors": [
        "Edward Marwood",
        "Charles Whitmore",
        "Beatrice Hargrave",
        "Arthur Langley",
        "Daphne Sinclair"
      ],
      "objects": [
        "Family wing",
        "Study",
        "Garden sundial",
        "Servants' quarters"
      ],
      "permissions": [
        "Charles controls access to family wing",
        "Beatrice has kitchen and ledger room access",
        "Edward has unrestricted family wing and study access",
        "Arthur has managerial access"
      ]
    },
    "physical": {
      "laws": [
        "Solar geometry governs sundial shadow length and direction",
        "Stopped watch face shows shadow cast, not reflection",
        "Thermal expansion not affecting sundial readings"
      ],
      "traces": [
        "Shadow outline on Edith’s watch face",
        "Ledger ink inconsistencies",
        "Footprints in garden near sundial"
      ]
    },
    "social": {
      "trust_channels": [
        "Servants’ coordinated testimonies",
        "Family deference to Edward’s authority",
        "Household schedules and protocols"
      ],
      "authority_sources": [
        "Edward’s estate ownership and command",
        "Charles’s role as butler managing access",
        "Arthur’s managerial position"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Edith Marwood’s watch, found stopped in the garden, shows a clear shadow on its face cast by the sundial’s gnomon.",
        "correction": "The shadow length and direction correspond to a time later than servants’ claimed time of death based on solar geometry for Little Middleton on that day.",
        "effect": "Narrows the murder time window to after servants’ last reported sighting, invalidating their timeline.",
        "required_evidence": [
          "Shadow outline on Edith’s watch face",
          "Sundial’s gnomon intact and precisely angled",
          "Weather logs confirming clear skies during the afternoon",
          "Servants’ testimonies stating Edith was alive before sunset"
        ],
        "reader_observable": true
      },
      {
        "observation": "Household ledger pages show financial entries dated after the servants’ claimed time of death, with ink inconsistencies suggesting falsification.",
        "correction": "Since Edith had confronted Edward about ledger falsifications, the ledger’s timing proves the murder happened after the servants’ supposed last sighting.",
        "effect": "Eliminates suspects claiming presence before the ledger entries and implicates those with motive to hide fraudulent finances.",
        "required_evidence": [
          "Ledger pages with dated ink inconsistencies",
          "Financial entries dated after servants’ claimed time of death",
          "Edith Marwood’s known confrontation about embezzlement",
          "Edward Marwood’s access to family wing and ledger"
        ],
        "reader_observable": true
      },
      {
        "observation": "Edward Marwood’s study logs and housekeeper’s testimony conflict; Edward claims presence in study from one to four, but no independent confirmation exists.",
        "correction": "Given the adjusted murder time from sundial and ledger evidence, Edward’s alibi overlaps with the murder window, making his claimed presence improbable.",
        "effect": "Eliminates Edward’s alibi and narrows culpability to him.",
        "required_evidence": [
          "Edward Marwood’s study occupancy claim",
          "Servants’ lack of observation of Edward during murder window",
          "Sundial shadow timing evidence",
          "Ledger falsification motive linked to Edward"
        ],
        "reader_observable": true
      },
      {
        "observation": "Only Edward had the authority and unmonitored access to manipulate the watch’s position in the garden to cast a misleading sundial shadow.",
        "correction": "This exclusive access and knowledge prove premeditation and ability to stage the false timeline.",
        "effect": "Uniquely identifies Edward Marwood as the culprit.",
        "required_evidence": [
          "Edward’s unrestricted access to garden and family wing",
          "Watch found deliberately placed for sundial shadow",
          "Household schedules restricting others’ garden access",
          "Edward’s motive to conceal ledger falsifications"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled sundial shadow experiment is conducted by placing an identical watch face at the sundial under the same sunlight conditions at various times, demonstrating the precise shadow length and direction that contradicts servant testimonies and Edward’s claimed alibi, thereby proving the murder’s true timing and implicating Edward Marwood.",
    "knowledge_revealed": "The test reveals the exact time the shadow on Edith’s watch could have been cast, disproving all alibis based on earlier death times and confirming Edward’s guilt due to the impossible timeline manipulation.",
    "pass_condition": "The sundial shadow matches the later afternoon time, invalidating servant and Edward’s alibis.",
    "evidence_clues": [
      "clue_12",
      "clue_2",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The sundial shadow on Edith’s watch and weather logs (early clues) establish the murder time contradicting servant statements. Step 2: Ledger ink inconsistencies and financial entries dated after servants’ timeline narrow suspects and reveal Edward’s motive. Step 3: Edward’s alibi conflicts with the revised timeline, eliminating his claimed innocence. Step 4: Only Edward’s exclusive access to the garden and watch placement proves premeditation. The discriminating test uses these clues to definitively prove the false timeline and Edward’s guilt."
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
      "mid_clues_min": 1,
      "late_clues_min": 1
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
        "Execute the sundial shadow experiment demonstrating time contradiction",
        "Observe Edward Marwood’s reaction to the invalidation of his alibi",
        "Draw conclusion about Edward’s guilt based on physical evidence"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Hargrave",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proof of kitchen presence and ledger corrections unrelated to murder",
        "supporting_clues": [
          "Kitchen access logs",
          "Ledger pagination and ink analysis"
        ]
      },
      {
        "suspect_name": "Charles Whitmore",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Servants’ testimonies and location in main hall during murder time",
        "supporting_clues": [
          "Household schedules",
          "Witness accounts"
        ]
      },
      {
        "suspect_name": "Daphne Sinclair",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified by guest logs and Arthur Langley’s confirmation",
        "supporting_clues": [
          "Guest arrival and movement logs",
          "Arthur’s testimony"
        ]
      },
      {
        "suspect_name": "Edith Marwood",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": [
          "Edward Marwood’s study occupancy claim"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with sundial shadow evidence, ledger analysis, and authority channel breach"
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
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Witness statement"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_14",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_15",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_16",
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
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_edward_marwood",
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
    "name": "Edith Marwood",
    "summary": "Respected matriarch of Marwood Manor, whose strict adherence to tradition belies a discovery that threatens her family's legacy.",
    "publicPersona": "Edith Marwood commanded Marwood Manor with the iron grace of a seasoned matriarch. Her presence was synonymous with tradition and order, a pillar in Little Middleton’s social tapestry. She was known to dispense wisdom with a measured tone and a gaze that brooked no nonsense, ensuring the estate and its inhabitants adhered to the codes she so cherished.",
    "privateSecret": "Beneath her composed exterior, Edith had unearthed a scandal—documents forged to alter the family lineage, alongside the shadow of her late husband's infidelities. This knowledge was a burden she carried alone, a secret that could unravel the very foundation of her claim to the estate and dismantle the social order she fought to preserve.",
    "motiveSeed": "N/A (victim)",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "possible",
    "stakes": "Her control over the estate and family legacy.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Speaks with measured, deliberate pacing, favoring formal phrasing and occasionally pausing to let her words settle. She rarely raises her voice but wields irony and subtle barbs with precision, often implying more than she says outright.",
    "signatureTic": "\"One must never rush the inevitable.\"",
    "internalConflict": "Struggled with the weight of preserving her family’s honor while grappling with the bitter truth of betrayal within her own bloodline.",
    "personalStakeInCase": "Her death is the catalyst that threatens to topple the ancestral legacy she dedicated her life to protect, making the truth about her demise crucial to the estate's future.",
    "paragraphs": [
      "Edith Marwood was the embodiment of old-world dignity, her every gesture steeped in the rituals of a bygone era. The sprawling halls of Marwood Manor echoed with her footsteps, a reminder that the estate was under vigilant guardianship. She approached her role not merely as an inheritance but as a sacred trust, one that demanded unwavering commitment to tradition and propriety.",
      "Yet beneath the veneer of control, Edith harbored a secret that gnawed at her resolve. The discovery of forged documents and her late husband’s indiscretions presented a threat not just to her reputation but to the very legitimacy of her stewardship. It was a scandal that could reduce the Marwood name to rubble, and she bore the weight of this knowledge with a quiet but fierce determination to safeguard her family’s standing.",
      "Her interactions with others were often tinged with a subtle, dry wit that masked the formidable will beneath. She wielded understatement like a weapon, delivering cutting observations that left interlocutors scrambling to keep pace. It was this combination of grace and steel that made her both respected and feared within the household and beyond.",
      "The shadow of her impending fate loomed large, for her death would not merely be a personal tragedy but a rupture in the social fabric of Little Middleton. As the keeper of family secrets, her absence promised to unleash long-buried rivalries and ambitions, setting the stage for upheaval among those who stood to gain or lose from the estate’s future.",
      "In the final days, Edith's demeanor grew even more resolute, as if sensing the gathering storm. Her measured declarations and habitual pauses took on a gravitas that bespoke unspoken warnings, a last stand against the forces that sought to dismantle the world she had so carefully upheld."
    ],
    "order": 1
  },
  {
    "name": "Arthur Langley",
    "summary": "A disciplined former military officer turned private inquiry agent, tasked with unmasking the truth behind the Marwood murder.",
    "publicPersona": "Arthur Langley carries the quiet authority of a man accustomed to command and discretion. His military past informs his meticulous approach to investigation, blending a soldier’s discipline with a gentleman’s reserve. Known for his calm demeanor and unwavering focus, he commands respect without ostentation.",
    "privateSecret": "Beneath his professional exterior simmers a deep resentment toward the aristocracy, born from betrayals suffered during his service. This bitterness fuels a personal quest for justice that sometimes blurs the lines of impartiality.",
    "motiveSeed": "N/A (detective)",
    "motiveStrength": "weak",
    "alibiWindow": "Not present at the manor before the crime; engaged after murder discovery.",
    "accessPlausibility": "easy",
    "stakes": "His reputation as a capable investigator and personal redemption.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with clipped precision and economy of words, often punctuating observations with dry, understated humour. His tone is measured, occasionally slipping into military jargon or metaphors, reflecting a mind trained to assess and adapt.",
    "signatureTic": "\"Let’s not jump to conclusions, shall we?\"",
    "internalConflict": "Battles a simmering distrust of the upper class he investigates, alongside a personal desire to prove his worth beyond the scars of past betrayals.",
    "personalStakeInCase": "This case represents a chance for redemption, a test of his skills to deliver justice where official channels falter, and a confrontation with the very class that once wronged him.",
    "paragraphs": [
      "Arthur Langley entered Marwood Manor with the measured gait of a man who had seen far more than his years might suggest. His military bearing was unmistakable, yet softened by the nuanced understanding of civilian complexities he’d gained as a private inquiry agent. He possessed an unyielding commitment to uncovering truth, tempered by a tactful discretion suited to delicate social milieus.",
      "His past service had left scars not visible to the eye—betrayals by those he once served under, an aristocracy that discarded loyalty when expedient. This history lent a quiet edge to his investigations, fueling a personal vendetta against injustice wrapped in privilege. Yet, he maintained a veneer of professionalism, masking his inner turmoil with a steady hand and a dry quip.",
      "Arthur’s speech was economical but incisive; he favored clarity over flourish. His dry wit surfaced in moments of tension, a subtle tool to defuse or redirect. His penchant for military metaphors lent an unexpected colour to his dialogue, revealing a mind always strategizing, always a step ahead.",
      "Though newly arrived at Marwood Manor, he quickly grasped the intricate web of relationships and secrets that cloaked the estate. His role was not merely to solve a crime but to navigate the labyrinthine social codes that governed the household and the surrounding community, balancing justice with discretion.",
      "The investigation was more than a professional engagement; it was a crucible for Arthur’s own demons. Success meant reclaiming personal honour and proving that justice could prevail even when the law’s reach faltered. Failure, however, threatened to deepen the shadows cast by his past.",
      "Throughout, Arthur maintained a cautious optimism, tempered by realism. His measured approach and dry humour served as a shield and a beacon, guiding him through the murky waters of Marwood’s secrets."
    ],
    "order": 2
  },
  {
    "name": "Beatrice Hargrave",
    "summary": "A charming social climber with a precarious secret, whose ambitions and debts cast suspicion upon her.",
    "publicPersona": "Beatrice Hargrave is the epitome of cultivated charm, her laughter ringing clear at society gatherings as she maneuvers for favor and opportunity. She dresses impeccably and speaks with the polished grace of someone who has studied the art of social ascendance, ever mindful of appearances.",
    "privateSecret": "Beneath the glamour lies a woman shackled by debt and blackmail. Edith’s knowledge of a forged letter threatens to shatter Beatrice’s fragile ascent, making her desperation palpable and her motives suspect.",
    "motiveSeed": "Stands to lose social standing and financial stability if Edith exposes the forged letter; killing Edith prevents exposure and possible ruin.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be at the stables during the time of the murder, but no one can confirm.",
    "accessPlausibility": "possible",
    "stakes": "Maintaining her status and freedom from debt and blackmail.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Articulate and fluid, Beatrice’s speech is laced with subtle barbs and double entendres. She wields wit as a weapon, often cloaking sharp observations beneath a veneer of coquettish charm and practiced civility.",
    "signatureTic": "\"Darling, one must always keep one’s options open.\"",
    "internalConflict": "Torn between the desire to ascend socially and the fear of exposure that could obliterate her carefully constructed identity.",
    "personalStakeInCase": "The crime’s outcome will determine whether she rises beyond her debts and blackmail or falls into irredeemable disgrace.",
    "paragraphs": [
      "Beatrice Hargrave was a creature of society’s bright lights, ever chasing the next invitation or whispered compliment. Her presence at Marwood Manor was both expected and calculated, her every move designed to impress and influence. She spoke with the ease of one accustomed to performing, her laughter a carefully measured instrument to charm and disarm.",
      "Yet beneath the polished exterior lurked desperation. The forged letter that Edith threatened to reveal was a specter that haunted every whispered conversation and sleepless night. Beatrice’s debts were mounting, and the blackmail tightened its grip, making the stakes of Edith’s silence a matter of survival rather than mere reputation.",
      "Her speech betrayed a sharp mind and a tongue sharpened by necessity. She deployed polite savagery with a coy smile, delivering stinging remarks wrapped in compliments, a social predator cloaked in silk. This verbal dexterity made her both an ally and a threat within the tangled dynamics of the household.",
      "Her alibi, a solitary claim of presence at the stables, was as fragile as the secrets she guarded. The absence of witnesses left a gap filled by suspicion and speculation, painting her as a figure both vulnerable and dangerous.",
      "Beatrice’s ambitions were as palpable as the tension she carried; the murder was not merely a crime but a crossroads. Should the truth emerge, her carefully constructed world would crumble, yet if she prevailed, she might ascend beyond the shadows that currently enveloped her.",
      "Her internal battle between fear and hope played out in every glance and phrase, making her a compelling and unpredictable force in the unfolding drama."
    ],
    "order": 3
  },
  {
    "name": "Charles Whitmore",
    "summary": "A stoic family solicitor whose loyalty is tested by secret acts of desperation.",
    "publicPersona": "Charles Whitmore is the archetype of the steadfast legal advisor—reserved, meticulous, and unwaveringly loyal to the Marwood family. His presence commands quiet respect, and his counsel is sought in matters both mundane and grave, delivered with a calm, measured tone.",
    "privateSecret": "Behind this facade lies a man ensnared by his own vices. To pay off crippling gambling debts, he altered Edith’s will to favor a corporate buyer, a forgery that now threatens to unmask him. Edith’s recent discovery of this betrayal places him in peril.",
    "motiveSeed": "Killing Edith prevents her from revealing the forged will codicil, preserving his financial salvation.",
    "motiveStrength": "compelling",
    "alibiWindow": "Was attending to paperwork in his study; windows overlooked by staff who saw him there.",
    "accessPlausibility": "easy",
    "stakes": "Avoiding financial ruin and legal consequences.",
    "humourStyle": "deadpan",
    "humourLevel": 0.3,
    "speechMannerisms": "His speech is precise and formal, often delivered in a flat, unemotional tone. He rarely indulges in humour, but when he does, it is dry and understated, revealing a mind accustomed to control and calculation.",
    "signatureTic": "\"The law is, regrettably, indifferent to sentiment.\"",
    "internalConflict": "Struggles with guilt over betraying a family he ostensibly serves and fears the collapse of his carefully maintained life.",
    "personalStakeInCase": "His survival—both legal and financial—depends on the crime remaining unsolved or the truth remaining buried.",
    "paragraphs": [
      "Charles Whitmore embodied the image of a dutiful solicitor, his every action steeped in the rituals and formalities of the legal profession. His office, lined with leather-bound volumes and neat stacks of paperwork, was a sanctuary where he wielded order against chaos. Within Marwood Manor, he was both advisor and confidant, a man whose counsel shaped destinies.",
      "Yet beneath his stoic exterior, Charles was a man cornered by his own failings. Years of gambling had plunged him into debt, compelling him to manipulate Edith’s will—a betrayal that gnawed at his conscience even as it promised salvation. The recent threat of exposure by Edith transformed desperation into a motive of the gravest order.",
      "His speech was marked by a formal precision that brooked no frivolity. When humour surfaced, it was a dry, deadpan remark that served to underscore rather than lighten the gravity of a situation. There was a coldness in his tone, a reflection of the walls he had built around his true feelings.",
      "The alibi he presented was solid on the surface: staff affirming his presence in the study during the murder. Yet, the ease of access and intimate knowledge of the manor’s workings made the possibility of duplicity a chilling prospect.",
      "Charles’s internal struggle was profound. Loyalty to the Marwood family clashed with the instinct for self-preservation, creating a tension that threatened to unravel his composure. The crime was not merely a matter of law but a crucible of conscience and survival.",
      "As the investigation unfolded, Charles remained a figure of quiet menace—his calm exterior concealing the turmoil of a man who gambled not only with cards but with lives and legacies."
    ],
    "order": 4
  },
  {
    "name": "Daphne Sinclair",
    "summary": "The head housekeeper, a vigilant guardian of household order, hiding a scandalous past that could topple her carefully maintained position.",
    "publicPersona": "Daphne Sinclair is the epitome of efficiency and dignity among the domestic staff. She commands respect through competence and a strict adherence to protocol, ensuring that Marwood Manor runs like a well-oiled machine. Her demeanor is composed, with an authority that is quietly acknowledged rather than loudly asserted.",
    "privateSecret": "Long ago, she was entangled in a scandalous affair with Edith’s late husband, a secret she has guarded fiercely. The fear that Edith might expose this past threatens her livelihood and status within the household.",
    "motiveSeed": "Feared exposure of her past affair by Edith which would cost her current status and livelihood; murder seen as the only safeguard.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be coordinating staff in the kitchen quarters during the murder timeframe.",
    "accessPlausibility": "possible",
    "stakes": "Preserving her livelihood and status in the household.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Speaks with a measured Yorkshire accent, often using understated humour and self-effacing remarks. Her tone is warm but firm, blending practicality with an occasional dry quip that reveals a sharp intellect beneath her domestic role.",
    "signatureTic": "\"Well, you can’t please everyone, can you?\"",
    "internalConflict": "Battles the fear that her past indiscretions will destroy the life she has painstakingly built, while striving to remain the loyal custodian of the household.",
    "personalStakeInCase": "The crime threatens to unearth secrets that could cost her position and possibly more, making her deeply invested in the outcome.",
    "paragraphs": [
      "Daphne Sinclair moved through Marwood Manor with the assuredness of one who has mastered the art of unseen influence. As head housekeeper, she was the linchpin of order, her every instruction delivered with calm authority. The staff looked to her not only for guidance but as a bulwark against the chaos that often lurked behind the manor’s stately facade.",
      "Her Yorkshire accent lent a homely warmth to her speech, punctuated by wry, self-deprecating humour that endeared her to some and disarmed others. Beneath this approachable exterior, however, lay a woman keenly aware of the precariousness of her position and the secrets she kept.",
      "The affair with Edith’s late husband was a shadow that darkened her past, a secret fiercely protected. The prospect of its revelation by Edith was a threat that extended beyond mere embarrassment—it was a potential ruin of her livelihood and standing within the household she had come to command.",
      "During the murder, Daphne claimed to be orchestrating the kitchen staff, a plausible alibi though not beyond question. Her intimate knowledge of the manor’s workings and the staff’s movements gave her both opportunity and motive, intertwining loyalty with fear.",
      "Her humour, though modest in volume, was sharp in effect—she often deflected probing questions with a dry quip or a humble admission, a tactic that both masked and revealed her intelligence. This blend of warmth and steel made her a complex figure, one whose loyalties were tested by the shifting tides of fortune.",
      "In the unfolding drama, Daphne stands at a crossroads, her fate entwined with the secrets she guards and the family she serves."
    ],
    "order": 5
  },
  {
    "name": "Edward Marwood",
    "summary": "A confident but resentful young heir whose ambitions and secret dealings threaten to upend the estate's future.",
    "publicPersona": "Edward Marwood exudes the assured confidence of a man destined to inherit, yet his demeanor often carries the edge of impatience and defiance. Groomed to manage the estate, he navigates his role with a blend of charm and steely resolve, though his clashes with Edith hint at deeper tensions.",
    "privateSecret": "His resentment towards Edith’s control is matched only by his covert negotiations with developers to sell parts of the estate, directly contravening her wishes. This secret gamble places his ambitions and the estate’s future on a knife-edge.",
    "motiveSeed": "Wanted to remove Edith to gain full control of the estate before a lucrative sale; murder was the way to bypass her veto.",
    "motiveStrength": "strong",
    "alibiWindow": "Was seen by the gardener near the west wing at time of murder, but no direct witness to his exact whereabouts.",
    "accessPlausibility": "easy",
    "stakes": "His ambition and financial future.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks with a brisk, clipped tone, often punctuated by sardonic remarks and a tendency to challenge others with pointed questions. His speech is direct, occasionally abrasive, revealing impatience and a sharp intellect.",
    "signatureTic": "\"If you ask me, that’s a waste of good time.\"",
    "internalConflict": "Struggles between loyalty to family legacy and his desire to assert control and independence, haunted by the fear that his ambitions might destroy what he claims to protect.",
    "personalStakeInCase": "The crime determines whether he can claim the estate’s future or be forever barred by scandal and suspicion.",
    "paragraphs": [
      "Edward Marwood moved through the halls of Marwood Manor with the confidence of a man who believed the estate was rightfully his, yet beneath that veneer simmered a restless impatience. His frequent disagreements with Edith over management reflected a deeper struggle for authority and recognition within the family hierarchy.",
      "His speech was sharp and sardonic, often cutting through pleasantries with pointed observations or veiled challenges. He wielded words like weapons, testing the mettle of those around him and revealing a mind that prized efficiency over diplomacy.",
      "Behind closed doors, Edward’s ambitions took a more dangerous form. His secret dealings with developers to sell portions of the estate directly undermined Edith’s wishes, a gamble that, if revealed, could shatter both family bonds and financial prospects.",
      "At the time of the murder, he was seen by the gardener near the west wing, a presence noted but lacking corroboration for his precise actions. This ambiguity cast a shadow over his alibi, inviting suspicion as well as speculation.",
      "His internal conflict was a crucible of competing loyalties: the desire to honor his family’s legacy clashed with the urge to assert control and secure his own future. The murder threatened to tip this balance, presenting a path to power or a descent into ruin.",
      "Edward’s sardonic humour and direct manner made him both compelling and unsettling, a figure whose fate was inextricably linked to the unraveling mystery at Marwood Manor."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Marwood Manor",
    "type": "country house estate (manor house)",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Marwood Manor, a sprawling 1930s Yorkshire estate, stands isolated amid rolling moorlands, its multiple wings and extensive grounds sheltering secrets beneath genteel façades.",
    "visualDescription": "A large stone manor with slate roofs and mullioned windows, multiple wings extending around a central courtyard, wrought-iron gates guarding the gravel driveway, formal gardens with clipped hedges, and weathered sundials casting long shadows on damp flagstones.",
    "atmosphere": "An enveloping quiet tension permeates the manor; the overcast skies and intermittent rain cloak the estate in muted greys, while the distant train whistle and crackling radio broadcasts underscore the uneasy calm of a fading era.",
    "paragraphs": [
      "Marwood Manor sits several miles from Little Middleton village, perched on a gentle rise overlooking the Yorkshire moors. Its stone façade, weathered by decades of wind and rain, blends with the mist that often curls around the clipped box hedges and ancient oaks. The manor’s multiple wings create a labyrinthine interior, with narrow corridors and staircases that twist out of sight, perfect for concealment or whispered conversations. The wrought-iron gates at the driveway’s entrance are manned by estate staff who maintain strict visitor logs, ensuring the household’s privacy and security.",
      "Inside, the atmosphere is one of faded grandeur. Heavy oak furniture bears the patina of generations, and floral chintz upholstery softens the austerity. The drawing room features a large radio receiver, its soft crackle filling the space during evening broadcasts. Domestic telephones connect rooms via a party-line exchange, their ring distinct and sometimes shared. Manual typewriters rest on polished desks, evidence of correspondence and record-keeping that underpin the manor’s outward calm. The scent of old leather-bound books mingles with faint tobacco smoke, while the chill of stone floors contrasts with the warmth of hearth fires.",
      "The estate’s grounds are extensive, including formal gardens, a sundial terrace, stables, and a small orchard. Frequent autumn rains leave the gravel paths slick and the air thick with damp earth and moss. The sundial, a weathered centerpiece, often casts long shadows that shift with the cloudy sky, a silent witness to the passing hours and the mysteries unfolding beneath. The isolation of the manor, combined with the regimented routines of family and staff, creates an atmosphere ripe for secrets and subtle intrigues to flourish.",
      "At night, the manor's silhouette merges with the darkening moorland beyond, lit only by flickering gas lamps and the occasional glow from curtained windows. The sounds of distant trains and rustling leaves mingle with the soft murmur of voices and the occasional clink of china, weaving a tapestry of genteel life tinged with underlying unease."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast skies with intermittent light rain, typical of English countryside in early autumn",
    "timeFlow": "Three days of mounting tension culminating in a stormy night",
    "mood": "Quiet tension underlying the genteel atmosphere, reflecting economic uncertainties of the Great Depression and rising political unease in Europe",
    "eraMarkers": [
      "Radio receivers common in drawing rooms",
      "Domestic telephones connected via party-line exchanges",
      "Manual typewriters used for correspondence and record-keeping",
      "Reliable petrol-powered automobiles for estate staff and owners",
      "Passenger trains connecting nearest towns with limited schedules",
      "Telephone calls subject to party-line privacy limitations",
      "Telegrams dispatched from nearest town post office"
    ],
    "sensoryPalette": {
      "dominant": "damp earth and aged stone",
      "secondary": [
        "crackling hearth-fire",
        "faint tobacco smoke",
        "murmur of distant train whistles"
      ]
    },
    "paragraphs": [
      "The manor’s atmosphere is shaped by the persistent autumn drizzle, which leaves the flagstones slick and the air heavy with the scent of damp earth and moss. The stone walls absorb the muted daylight, casting soft shadows that blur the edges of rooms and corridors. Inside, the faint crackle of the radio and the low murmur of voices create a backdrop to the otherwise hushed estate. Tobacco smoke lingers in the drawing room, mixing with the musty scent of old books and polished wood, evoking a sense of faded elegance and careful restraint.",
      "Outside, the rhythmic whistle of distant trains punctuates the quiet, a reminder of the world beyond the estate’s isolation. The intermittent rain drums softly on slate roofs and rustles through the ancient trees lining the drive. The sundial’s shadow shifts imperceptibly across the terrace, marking time in a place where secrets seem to linger in the damp air. This combination of natural and domestic sounds and smells weaves a tapestry of tension beneath the surface calm of the manor’s genteel life."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Sundial Terrace",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A stone terrace paved with mossy flagstones, centered around an ornate sundial weathered by time, surrounded by clipped box hedges and aged oaks; the terrace overlooks the sweeping moorlands with a wrought-iron bench nearby.",
      "sensoryDetails": {
        "sights": [
          "moss-covered flagstones",
          "weathered stone sundial casting shadows",
          "overcast sky filtering pale light",
          "glossy wet leaves on hedges",
          "distant moorland shrouded in mist",
          "rusted wrought-iron bench"
        ],
        "sounds": [
          "soft patter of light rain",
          "distant train whistle echoing",
          "rustling leaves in cool breeze",
          "drip of water from eaves",
          "faint footsteps on gravel path"
        ],
        "smells": [
          "damp earth and wet stone",
          "freshly cut box hedge",
          "moss and decaying leaves",
          "cool autumn air",
          "faint scent of distant woodsmoke"
        ],
        "tactile": [
          "rough mossy flagstone underfoot",
          "chill dampness on skin",
          "cold iron of bench armrest",
          "slick wet leaves",
          "crisp autumn breeze"
        ]
      },
      "accessControl": "Accessible only during daylight hours; estate staff monitor visitors; sundial terrace locked at night to preserve privacy; family and trusted staff have keys.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked sundial surface",
            "grey mist over moorlands",
            "droplets clinging to leaves",
            "pools of water on flagstones"
          ],
          "sounds": [
            "steady raindrops on stone",
            "water trickling into drains",
            "distant low thunder rumble",
            "soft wind through branches"
          ],
          "smells": [
            "wet earth and stone",
            "fresh rain on leaves",
            "peat smoke faintly rising"
          ],
          "mood": "oppressive and foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat muted light over terrace",
            "shadows softened by cloud cover",
            "dark green hedges",
            "glossy wet stones"
          ],
          "sounds": [
            "distant train whistle",
            "occasional bird call",
            "rustle of wet leaves"
          ],
          "smells": [
            "damp moss and earth",
            "freshly trimmed box hedge",
            "faint woodsmoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "pale moonlight on flagstones",
            "silhouetted oaks against night sky"
          ],
          "sounds": [
            "soft night breeze",
            "distant hoot of owl",
            "crickets in undergrowth"
          ],
          "smells": [
            "cool night air",
            "earth and damp stone",
            "faint scent of night-blooming flowers"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Sundial Terrace serves as the heart of the manor’s garden, its weathered flagstones slick with autumn rain and the ornate sundial casting shifting shadows under the grey skies. Surrounded by clipped box hedges and towering oaks, the terrace offers a vantage point over the moorlands, though its isolation and limited access make it a place where secrets can easily be kept.",
        "The chill air carries the scent of damp earth and moss, while the soft patter of rain mingles with distant train whistles and rustling leaves. The cold iron of the wrought-iron bench invites brief rest but also bears silent witness to the events that unfolded here, its surface rough and damp under touch. The terrace’s seclusion, combined with the controlled access by estate staff, ensures that only a few trusted individuals traverse its stones after dusk."
      ]
    },
    {
      "id": "library",
      "name": "Marwood Manor Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A high-ceilinged room lined with tall mahogany bookshelves filled with leather-bound volumes, a large Persian rug covering the oak floor, heavy velvet drapes framing mullioned windows, and a central oak desk cluttered with papers and a manual typewriter.",
      "sensoryDetails": {
        "sights": [
          "glossy leather book spines",
          "dust motes in filtered light",
          "flickering gas lamp glow",
          "stacks of yellowed correspondence",
          "deep red velvet curtains",
          "polished brass desk lamp"
        ],
        "sounds": [
          "soft rustle of turning pages",
          "occasional scratch of pen on paper",
          "quiet ticking of grandfather clock",
          "low hum of radio broadcasts"
        ],
        "smells": [
          "old leather and polished wood",
          "faint scent of pipe tobacco",
          "aged paper and ink",
          "wax polish on furniture"
        ],
        "tactile": [
          "smooth leather book covers",
          "cool brass of desk lamp",
          "rough parchment edges",
          "velvet curtain folds",
          "solid oak desk surface"
        ]
      },
      "accessControl": "Library locked after dinner; access restricted to family members and select staff; keys held by the housekeeper and the lord of the manor.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through rain-streaked windows",
            "soft shadows from gas lamps",
            "glossy wet leaves visible outside"
          ],
          "sounds": [
            "steady rain tapping on windowpanes",
            "soft scratching of pen on paper",
            "low crackle from fireplace"
          ],
          "smells": [
            "damp stone faintly seeping in",
            "fresh ink and paper",
            "smoke from peat fire"
          ],
          "mood": "contemplative and subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat muted daylight filtering through curtains",
            "glossy book spines catching dim light",
            "shadows pooling in corners"
          ],
          "sounds": [
            "soft turning of pages",
            "quiet ticking grandfather clock",
            "distant murmur of voices below stairs"
          ],
          "smells": [
            "musty books and wax polish",
            "faint pipe tobacco",
            "polished wood"
          ],
          "mood": "tense focus"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of gas lamps",
            "flickering fireplace light",
            "deep shadows behind bookshelves"
          ],
          "sounds": [
            "crackling fire",
            "distant ticking mantel clock",
            "soft rustle of papers"
          ],
          "smells": [
            "burning wood smoke",
            "leather and ink",
            "wax polish"
          ],
          "mood": "quiet urgency"
        }
      ],
      "paragraphs": [
        "The library exudes an air of studied calm, its towering mahogany shelves filled with leather-bound tomes and yellowed manuscripts. The thick Persian rug muffles footsteps, while the heavy velvet drapes absorb the muted daylight filtering through the mullioned windows. A large oak desk, littered with correspondence and a manual typewriter, stands as the command center for research and secretive note-taking.",
        "The scent of old leather mingles with pipe tobacco smoke and the faint polish of waxed wood, creating an atmosphere steeped in tradition and careful order. The steady ticking of a grandfather clock and the soft rustle of papers provide a rhythmic backdrop, inviting quiet contemplation but also serving as a reminder of time slipping away in the pursuit of hidden truths."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants' Hall",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A modest, functional room with plain wooden tables and benches, a large cast-iron stove in the corner, a well-worn wooden floor, and small windows with simple linen curtains; hooks for coats and boots line one wall.",
      "sensoryDetails": {
        "sights": [
          "scuffed wooden floorboards",
          "plain earthenware crockery",
          "flickering stove flames",
          "threadbare linen curtains",
          "stacked coal baskets",
          "hanging oil lamps"
        ],
        "sounds": [
          "clatter of tin plates",
          "murmured conversations",
          "crackling stove fire",
          "clinking of cutlery",
          "footsteps on creaking floor"
        ],
        "smells": [
          "smoky peat fire",
          "stale cooking grease",
          "washed linen and soap",
          "earthy damp boots",
          "sweat and wood smoke"
        ],
        "tactile": [
          "rough wooden bench surfaces",
          "warm stove metal",
          "coarse linen fabric",
          "cool stone floor edges",
          "scuffed leather soles"
        ]
      },
      "accessControl": "Restricted to household staff; family members prohibited; door locked at night; entry logged by housekeeper.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "damp coats hanging on hooks",
            "grey light through small windows",
            "steam rising from breakfast pots"
          ],
          "sounds": [
            "water dripping from boots",
            "quiet morning chatter",
            "stove fire crackling"
          ],
          "smells": [
            "wet wool and leather",
            "smoky peat fire",
            "freshly baked bread"
          ],
          "mood": "busy but subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadowed corners",
            "empty tables",
            "faint dust motes"
          ],
          "sounds": [
            "distant clatter from kitchen",
            "soft murmurs",
            "occasional creak of floorboards"
          ],
          "smells": [
            "lingering cooking smells",
            "soapy water",
            "smoke from stove"
          ],
          "mood": "quiet anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from oil lamps",
            "shadows dancing on walls",
            "neatly stacked boots"
          ],
          "sounds": [
            "soft laughter",
            "clinking cups",
            "fire crackling"
          ],
          "smells": [
            "tobacco pipe smoke",
            "washed linens",
            "smoky peat fire"
          ],
          "mood": "relaxed camaraderie"
        }
      ],
      "paragraphs": [
        "The servants' hall is a stark contrast to the manor’s grand interiors, its plain wooden tables and benches worn smooth by daily use. The cast-iron stove provides much-needed warmth against the autumn chill, its flickering flames casting lively shadows on the scuffed floorboards. Hooks along the wall hold damp coats and boots, evidence of the estate’s ever-present rain and the hard work of its staff.",
        "The air is a mixture of smoky peat fire, stale cooking grease, and freshly washed linens, creating a homely yet utilitarian atmosphere. The murmur of quiet conversations, clinking cutlery, and occasional laughter fills the room during breaks, while the scent of tobacco smoke lingers as workers unwind. Access is strictly controlled, ensuring this space remains a private refuge for the household staff."
      ]
    },
    {
      "id": "family_study",
      "name": "Family Study",
      "type": "interior",
      "purpose": "Private family quarters and confidential discussions",
      "visualDetails": "A richly paneled room with dark walnut walls, a large leather Chesterfield armchair beside a crackling fireplace, heavy silk drapes, a polished writing desk with a manual typewriter, and shelves holding family portraits and silver trophies.",
      "sensoryDetails": {
        "sights": [
          "dark wood paneling with intricate carvings",
          "flickering firelight on leather armchair",
          "silk drapes drawn against grey light",
          "glinting silver trophies on shelves",
          "sepia-toned family portraits",
          "polished brass desk lamp"
        ],
        "sounds": [
          "soft crackle of burning logs",
          "rustle of heavy drapes",
          "distant ticking of mantel clock",
          "quiet rustling of paper",
          "muted footsteps on carpet"
        ],
        "smells": [
          "rich leather and polished wood",
          "smoky peat fire",
          "faint scent of aged parchment",
          "underlying hints of cedar polish"
        ],
        "tactile": [
          "smooth leather armchair upholstery",
          "warm brass lamp base",
          "coarse silk drape folds",
          "solid oak desk surface",
          "soft woven carpet fibers"
        ]
      },
      "accessControl": "Strictly private; entry limited to family members and trusted guests; door locked outside business hours; keys held by the lord and lady of the manor.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through silk drapes",
            "firelight flickering softly",
            "glossy wood surfaces darkened by damp"
          ],
          "sounds": [
            "steady rain tapping on windowpanes",
            "fire crackling gently",
            "soft turning of papers"
          ],
          "smells": [
            "smoky peat and leather",
            "damp wood faintly rising",
            "fresh ink on paper"
          ],
          "mood": "introspective and guarded"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat muted daylight through curtains",
            "deep shadows in corners",
            "silver trophies gleaming faintly"
          ],
          "sounds": [
            "quiet ticking clock",
            "rustle of papers",
            "soft footsteps outside"
          ],
          "smells": [
            "aged leather and wood polish",
            "smoky peat fire",
            "faint cedar"
          ],
          "mood": "tense confidentiality"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm firelight glow",
            "shadows dancing on paneling",
            "glinting brass and silver"
          ],
          "sounds": [
            "crackling logs",
            "soft rustle of papers",
            "muffled voices beyond door"
          ],
          "smells": [
            "rich leather and smoke",
            "polished wood",
            "aged parchment"
          ],
          "mood": "secretive and intimate"
        }
      ],
      "paragraphs": [
        "The family study exudes a private, intimate atmosphere, its dark walnut paneling and heavy silk drapes shielding it from the manor’s external chill. The large Chesterfield armchair beside the fireplace invites quiet reflection, while the polished writing desk, complete with a manual typewriter, serves as a locus for confidential correspondence and strategic planning.",
        "The room’s scent of rich leather, smoky peat fire, and cedar polish blends with the soft rustle of papers and the steady ticking of a mantel clock, creating an environment steeped in tradition and discretion. Access is carefully controlled, ensuring that only family members and trusted guests enter this space where secrets are guarded and alliances forged."
      ]
    }
  ],
  "note": "",
  "cost": 0.006961795999999999,
  "durationMs": 40044
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1937,
    "month": "January",
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "chill dampness with frequent overcast skies",
      "occasional light frost overnight",
      "intermittent misty rain typical of English countryside winters"
    ],
    "daylight": "short winter days with sunset around 4:15 PM, dusk falling rapidly thereafter",
    "time_of_day_of_crime": "Late evening — between eight and ten o’clock, when the manor’s rooms are dimly lit by gas lamps and fading daylight",
    "holidays": [
      "New Year’s Day",
      "Epiphany (January 6th)"
    ],
    "seasonalActivities": [
      "taking brisk country walks on estate grounds despite the cold",
      "indoor card and board games by the fireside",
      "preparations for the upcoming Burns Night celebrations"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece wool flannel suits in dark greys or browns",
        "double-breasted overcoats with wide lapels",
        "silk cravats or narrow ties with subtle patterns"
      ],
      "casual": [
        "knitted argyle sweaters worn over collared shirts",
        "tweed sports jackets paired with corduroy trousers",
        "leather brogue shoes, polished but showing wear"
      ],
      "accessories": [
        "felt homburg or trilby hats",
        "leather gloves lined with wool",
        "pocket watches on chains"
      ]
    },
    "womensWear": {
      "formal": [
        "wool crepe day dresses with padded shoulders and narrow waists",
        "fur-trimmed coats with large collars",
        "felt hats adorned with small veils or feathers"
      ],
      "casual": [
        "knitted cardigans layered over silk blouses",
        "mid-calf length skirts in tweed or wool blends",
        "leather lace-up ankle boots"
      ],
      "accessories": [
        "silk scarves tied at the neck",
        "leather handbags with metal clasps",
        "long gloves for outdoor wear"
      ]
    },
    "trendsOfTheMoment": [
      "shift from flamboyant 1920s styles to more conservative, tailored silhouettes",
      "influence of Hollywood glamour promoting elegant simplicity",
      "increased use of fur trims in winter fashion"
    ],
    "socialExpectations": [
      "men to present a composed, authoritative appearance especially in formal settings",
      "women expected to dress modestly yet stylishly in public and social gatherings",
      "accessories and grooming viewed as signs of social standing"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "King George VI’s recent coronation preparations following Edward VIII’s abdication in late 1936",
      "continuing tensions in Europe with Nazi Germany’s increasing militarization",
      "ongoing economic struggles in Britain amidst global depression recovery efforts"
    ],
    "politicalClimate": "A cautious political atmosphere marked by uncertainty; the government pursues rearmament while public opinion remains divided on foreign policy and domestic economic measures.",
    "economicConditions": "Slow recovery from the Great Depression with unemployment still significant in industrial regions; rural estates face financial pressures yet maintain traditional hierarchies.",
    "socialIssues": [
      "class disparities and social mobility constraints persist",
      "debates about women’s roles in workforce and society continue",
      "concerns over rising fascism and political extremism abroad"
    ],
    "internationalNews": [
      "Japan’s expansion in East Asia escalating tensions",
      "Spanish Civil War intensifies, drawing international attention and volunteers"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby’s crooning hits",
        "Duke Ellington’s jazz orchestras gaining UK popularity",
        "British dance bands like Jack Hylton’s ensemble"
      ],
      "films": [
        "‘The Awful Truth’ starring Cary Grant",
        "‘Snow White and the Seven Dwarfs’ previewing in Europe",
        "British productions such as ‘The 39 Steps’ still in circulation"
      ],
      "theater": [
        "West End productions of Noël Coward plays",
        "revues featuring music hall favorites",
        "Shakespearean staging in regional theaters"
      ],
      "radio": [
        "BBC Home Service broadcasting popular variety shows",
        "news bulletins providing updates on European tensions",
        "serial dramas and detective stories capturing public imagination"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s ‘Dumb Witness’ published in late 1936",
        "John Steinbeck’s ‘In Dubious Battle’ gaining attention",
        "Virginia Woolf’s essays and diaries continued circulation"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "modernist literature",
        "social realism novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "improved radio receivers with better sound fidelity",
        "introduction of early automatic washing machines for affluent homes",
        "advances in automotive engineering with more reliable engines"
      ],
      "commonDevices": [
        "domestic telephones connected by party lines",
        "manual typewriters for correspondence",
        "battery-powered flashlights used by estate staff"
      ],
      "emergingTrends": [
        "increased household electrification in rural areas",
        "growing popularity of radio as main entertainment source",
        "early experiments with home refrigeration"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: fourpence",
        "coal scuttle refill: one shilling sixpence",
        "taxi ride across town: two shillings"
      ],
      "commonActivities": [
        "morning chores and correspondence before breakfast",
        "afternoon tea and social calls within local gentry",
        "evening billiards or card games in the manor’s smoking room"
      ],
      "socialRituals": [
        "formal dinner served promptly at 7 PM with multiple courses",
        "staff and family separation maintained during meals"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "strict deference to the landed gentry and estate owners",
      "clear separation and protocol between servants and family"
    ],
    "gender": [
      "women expected to embody grace and reserve in public",
      "men to uphold authority and financial responsibility",
      "increasing, though still limited, opportunities for women in education and work"
    ],
    "race": [
      "predominantly white British rural society with limited racial diversity",
      "colonial attitudes prevalent in upper-class discourse"
    ],
    "generalNorms": [
      "politeness and understatement valued in social interaction",
      "privacy and discretion paramount within the upper classes",
      "religious observance common, especially Anglican traditions"
    ]
  },
  "atmosphericDetails": [
    "The faint scent of coal smoke mixes with damp earth and wood polish inside the manor.",
    "Heavy velvet curtains are drawn against the chill, muffling the muffled ticking of the grandfather clock.",
    "Soft murmurs of the wireless radio blend with the occasional crackle from the fire, underscoring the manor’s quiet tension."
  ],
  "paragraphs": [
    "January 1937 in the English countryside brings short, grey days marked by cold dampness and intermittent misty rain. The manor house sits shrouded in a muted winter light that fades before the evening meal, with fires burning steadily in the hearths to ward off the chill. Outside, the estate’s grounds are sodden but still inviting for brisk walks, while indoors, the household observes routines refined by decades of tradition, from punctual dinners to carefully observed social hierarchies.",
    "Fashion this January reflects a turn toward conservative elegance. Men favor heavy wool suits and overcoats complemented by felt hats and leather gloves, projecting an image of restrained authority. Women’s attire blends practicality with subtle glamour — tailored wool dresses with padded shoulders and fur trims, paired with felt hats and silk scarves. These clothing choices not only convey social standing but also a collective mood of cautious optimism amid uncertain times.",
    "The cultural atmosphere is alive with the era’s prominent voices: Bing Crosby’s soothing croons on the wireless, Agatha Christie’s latest mysteries enjoyed by the reading public, and BBC radio dramas unfolding in drawing rooms across Britain. Politically, the nation stands on edge, watching King George VI prepare to ascend fully to the throne while Europe inches toward instability. Daily life continues its measured rhythm with formal dinners, afternoon teas, and evenings of quiet entertainment, all underscored by the unspoken anxieties of the age."
  ],
  "note": "All details strictly adhere to January 1937 England rural manor context, avoiding anachronisms and providing a vivid, historically accurate setting for the mystery.",
  "cost": 0.003100276,
  "durationMs": 19483
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst the strict social hierarchy and regimented routines of an isolated 1930s English manor, the Marwood family and their close associates navigate economic anxieties and guarded interactions while confined by estate protocols and rising external tensions.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Rigid class distinctions separate family members from staff, with deference demanded toward estate owners and senior household figures, enforcing controlled social interactions under the pressure of economic uncertainty and political unease."
  },
  "setting": {
    "location": "A large, isolated English manor house with multiple wings, servant quarters, and extensive grounds including gardens and stables",
    "institution": "Country house estate (manor house)",
    "weather": "Overcast skies with intermittent light rain, typical of English countryside in early autumn"
  },
  "castAnchors": [
    "Edith Marwood",
    "Arthur Langley",
    "Beatrice Hargrave",
    "Charles Whitmore",
    "Daphne Sinclair",
    "Edward Marwood"
  ],
  "theme": "A classic murder mystery emphasizing genteel yet tense social dynamics within a confined, tradition-bound estate during a period of economic and political uncertainty."
}

### LOCKED_FACTS
[
  {
    "id": "murder_time_conflict",
    "value": "twenty minutes past four in the afternoon",
    "description": "The actual time when the sundial’s shadow length indicates the murder must have occurred"
  },
  {
    "id": "victim_watch_shadow_time",
    "value": "half past three in the afternoon",
    "description": "Time indicated by the sundial’s shadow on the watch face, contradicting the servants’ timeline"
  },
  {
    "id": "weather_condition",
    "value": "clear skies",
    "description": "Weather condition recorded in the estate’s log confirming shadow visibility"
  },
  {
    "id": "gnomon_angle",
    "value": "forty-five degrees",
    "description": "Angle of the sundial’s gnomon from the horizontal plane, essential for shadow calculation"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 5,
    "mid": 14,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
    "supporting": 1,
    "optional": 1
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
      "id": "clue_2",
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
      "category": "testimonial"
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
      "category": "spatial"
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
      "id": "clue_core_contradiction_chain",
      "placement": "mid",
      "criticality": "supporting",
      "category": "temporal"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_16",
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
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_edward_marwood",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
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

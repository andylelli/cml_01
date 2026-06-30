# Actual Prompt Record

- Run ID: `run_efedba16-9baf-44a2-9d3a-254029d53cd9`
- Project ID: `proj_aa8a2295-c4b0-4827-a98f-2565d70fe160`
- Timestamp: `2026-06-30T09:52:50.730Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `bf51b30202768e5e`

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
    "title": "The Sundial’s Silent Verdict",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Fingerprinting standard",
        "Basic toxicology available",
        "Ballistics analysis emerging",
        "Early telephones common",
        "No television or modern electronics",
        "Automobiles reliable but estate isolated",
        "Great Depression impacts social and financial tensions"
      ]
    },
    "setting": {
      "location": "Harcourt Manor Estate",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "Manor house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "poisoning with delayed effect"
    }
  },
  "death_method": "poisoned with aconite concealed in ice cubes",
  "cast": [
    {
      "name": "Evelyn Harcourt",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [
        "Daughter of Lord Charles Harcourt",
        "Sister to James Harcourt"
      ],
      "public_persona": "Reserved, observant lady of the estate",
      "private_secret": "Skeptical of family appearances and determined to uncover truth",
      "motive_seed": "Desire to protect family honor and prevent scandal",
      "motive_strength": "moderate",
      "alibi_window": "Late morning to early afternoon of the murder day",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to manor house and servants’ quarters",
        "Free movement within gardens and stables"
      ],
      "behavioral_tells": [
        "Unusually attentive to sundial and timing details",
        "Questions servants’ testimonies about times"
      ],
      "stakes": "Protecting family legacy and uncovering killer",
      "evidence_sensitivity": [
        "Sundial temperature readings",
        "Garden journal notes",
        "Servants’ testimonies"
      ],
      "culprit_eligibility": "locked",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Lord Charles Harcourt",
      "age_range": "60-70",
      "role_archetype": "victim",
      "relationships": [
        "Father to Evelyn and James Harcourt",
        "Employer of Agnes Wilkes and Edward Mallory"
      ],
      "public_persona": "Respected head of the Harcourt family",
      "private_secret": "Harbored tensions with family over finances and secrets",
      "motive_seed": "N/A (victim)",
      "motive_strength": "N/A",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Beatrice Langley",
      "age_range": "28-35",
      "role_archetype": "Housekeeper",
      "relationships": [
        "Long-serving servant to Harcourt family",
        "Close working relationship with Agnes Wilkes"
      ],
      "public_persona": "Loyal and discreet head of household staff",
      "private_secret": "Resents Lord Charles’s harshness and financial cutbacks",
      "motive_seed": "Desire to protect servants and retaliate against family’s neglect",
      "motive_strength": "moderate",
      "alibi_window": "Mid-morning to just after noon",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to kitchen, ice trays, and servants’ quarters",
        "Knowledge of household schedules and routines"
      ],
      "behavioral_tells": [
        "Defensive when questioned about ice tray",
        "Claims to have no knowledge of any poison"
      ],
      "stakes": "Job security and personal dignity",
      "evidence_sensitivity": [
        "Ice tray condition",
        "Servants’ testimony",
        "Household schedule"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "James Harcourt",
      "age_range": "30-40",
      "role_archetype": "Younger Son",
      "relationships": [
        "Brother to Evelyn Harcourt",
        "Son of Lord Charles Harcourt"
      ],
      "public_persona": "Charming but financially strained gentleman",
      "private_secret": "Desperate over gambling debts and estate finances",
      "motive_seed": "Financial desperation and resentment toward father",
      "motive_strength": "high",
      "alibi_window": "Late morning around the time of death",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to manor house and gardens",
        "Opportunity to tamper with sundial and ice tray"
      ],
      "behavioral_tells": [
        "Nervous when asked about whereabouts",
        "Unexplained absence during key times"
      ],
      "stakes": "Avoiding financial ruin and scandal",
      "evidence_sensitivity": [
        "Ledger discrepancies",
        "Witness statements",
        "Sundial temperature record"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Agnes Wilkes",
      "age_range": "45-55",
      "role_archetype": "Cook",
      "relationships": [
        "Servant to the Harcourt family",
        "Colleague of Beatrice Langley"
      ],
      "public_persona": "Steadfast and no-nonsense cook",
      "private_secret": "Knows about household tensions and overheard arguments",
      "motive_seed": "Protecting her position and avoiding blame",
      "motive_strength": "low",
      "alibi_window": "Morning to early afternoon",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to kitchen and ice tray",
        "Presence during meal preparations"
      ],
      "behavioral_tells": [
        "Cautious when questioned about timing of footsteps",
        "Claims to have heard footsteps twice"
      ],
      "stakes": "Maintaining employment and reputation",
      "evidence_sensitivity": [
        "Weather vane data",
        "Stable yard footprints",
        "Servants’ testimonies"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Edward Mallory",
      "age_range": "50-60",
      "role_archetype": "Butler",
      "relationships": [
        "Long-serving butler to the Harcourt family",
        "Trusted by Lord Charles Harcourt"
      ],
      "public_persona": "Impeccably professional and discreet",
      "private_secret": "Aware of forged ledger entries and financial discrepancies",
      "motive_seed": "Loyalty conflicted between family and personal ethics",
      "motive_strength": "moderate",
      "alibi_window": "Late morning until just after noon",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to ledger and household records",
        "Control over household schedules and staff"
      ],
      "behavioral_tells": [
        "Hesitant when ledger discrepancies arise",
        "Keeps detailed but possibly manipulated accounts"
      ],
      "stakes": "Preserving family reputation and his position",
      "evidence_sensitivity": [
        "Ledger entries",
        "Ink shade differences",
        "Receipts and dates"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "James Harcourt"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "On a foggy autumn day at Harcourt Manor, Lord Charles Harcourt is found dead, apparently poisoned. Everyone believes he died at solar noon, as indicated by the sundial. However, Evelyn Harcourt discovers the sundial’s shadow was delayed due to thermal expansion of the brass gnomon, meaning he died earlier. A forged ledger and servants’ contradictory testimonies about footsteps and timing further complicate the timeline. Evelyn must unravel the temporal illusion, exposing the true time of death and revealing James Harcourt as the killer who exploited this false assumption to stage his alibi."
    },
    "accepted_facts": [
      "Lord Charles Harcourt was found poisoned in the manor grounds.",
      "The sundial shadow indicated solar noon at time of death.",
      "A garden thermometer showed temperatures above seventy-five degrees Fahrenheit.",
      "A faint expansion gap is visible in the brass gnomon of the sundial.",
      "The ledger shows a seven shilling discrepancy in totals.",
      "Servants reported hearing footsteps in the stable yard twice at conflicting times.",
      "Weather vane indicated consistent east wind around the murder time.",
      "Ice tray contained hollowed ice cubes matching delayed poison delivery."
    ],
    "inferred_conclusions": [
      "The sundial shadow lagged behind true solar time by about ten minutes.",
      "The victim died earlier than solar noon, challenging servants’ alibis.",
      "The forged ledger entries reveal an impossible timeline.",
      "Footprint evidence and sound refraction explain servant testimony contradictions.",
      "Only James Harcourt had motive, means, and opportunity to manipulate timing and poison."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The brass gnomon of the sundial expands due to midday heat, delaying the sundial’s shadow alignment by approximately ten minutes. This physical law creates a false temporal anchor for the time of death. The culprit exploited this by administering aconite poison concealed in hollow ice cubes, which released toxin with delay. A forged ledger with checksum errors and manipulated servant testimonies about footsteps created a fabricated timeline to establish alibis. The combination of physical law and forgery concealed the true time of death and the killer’s involvement.",
      "delivery_path": [
        {
          "step": "Victim drank ice water containing delayed-release aconite poison."
        },
        {
          "step": "Thermal expansion in sundial's brass gnomon delayed shadow, misleading witnesses."
        },
        {
          "step": "Culprit forged ledger entries with checksum errors to fabricate victim's presence."
        },
        {
          "step": "Servants’ testimonies about footsteps exploited wind direction and stable acoustics to mislead timing."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death was about ten minutes before solar noon, invalidating the suspect alibis and exposing James Harcourt as the sole culprit who manipulated timing and evidence to conceal his crime."
    }
  },
  "false_assumption": {
    "statement": "Lord Charles Harcourt died exactly at solar noon, as indicated by the sundial’s shadow.",
    "type": "temporal",
    "why_it_seems_reasonable": "All witnesses consistently referred to the sundial’s shadow as the definitive timekeeper, supported by the visible sundial in the garden and servants' testimonies.",
    "what_it_hides": "That the sundial’s shadow was delayed by thermal expansion of the brass gnomon, causing the victim to have died earlier and allowing the culprit to fabricate alibis based on the incorrect timeline."
  },
  "false_solution": {
    "accused_suspect": "Beatrice Langley",
    "supporting_points": [
      "Beatrice was seen near the kitchen ice tray around the time of death, suggesting opportunity to poison the victim’s drink.",
      "She expressed resentment toward Lord Charles due to his financial cutbacks affecting the servants."
    ],
    "the_one_flaw": "Beatrice’s alibi is confirmed by multiple servants and the timing contradictions disproved the assumed time of death; the true time predates her opportunity.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Servants report hearing footsteps in the stable yard twice at conflicting times, suggesting someone moved unseen.",
      "points_at_suspect": "Agnes Wilkes",
      "innocent_explanation": "Wind direction and stable door acoustics caused echoes and sound refraction, misleading servant testimonies about timing.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A ledger entry appears forged with inconsistent ink shades, implying malfeasance by the butler.",
      "points_at_suspect": "Edward Mallory",
      "innocent_explanation": "Ledger totals contain a mathematical checksum error revealing an amateur forgery by the culprit, but Edward was unaware of the alteration.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Evelyn Harcourt",
      "Beatrice Langley",
      "James Harcourt",
      "Agnes Wilkes",
      "Edward Mallory"
    ],
    "rationale": "All suspects were present within the manor estate during the murder window, with no outsiders having access due to the estate’s isolation and strict social controls."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Sundial shadow at solar noon",
        "Servants’ testimonies about footsteps at quarter past ten and nearly eleven",
        "Ledger entries timestamped mid-morning"
      ],
      "windows": [
        "Victim’s death time window narrowed to ten minutes before solar noon",
        "Servants’ assigned duties between 10:00 AM and 11:00 AM"
      ],
      "contradictions": [
        "Sundial shadow delay contradicts assumed death time",
        "Ledger totals mathematically impossible given timestamps",
        "Servants’ footsteps testimonies conflict with physical footprint evidence"
      ]
    },
    "access": {
      "actors": [
        "James Harcourt",
        "Beatrice Langley",
        "Agnes Wilkes",
        "Edward Mallory",
        "Evelyn Harcourt"
      ],
      "objects": [
        "Ice tray with hollowed ice cubes",
        "Sundial with brass gnomon",
        "Ledger book",
        "Garden thermometer",
        "Stable yard"
      ],
      "permissions": [
        "Household staff access to kitchen and ice tray",
        "Family access to gardens and sundial",
        "Butler access to ledger and records"
      ]
    },
    "physical": {
      "laws": [
        "Thermal expansion of brass delays sundial shadow by ~10 minutes at high temperature",
        "Delayed-release poison effect from melting hollow ice cubes",
        "Sound refraction and echoes in stable yard caused by wind direction"
      ],
      "traces": [
        "Faint expansion gap in sundial gnomon",
        "Temperatures above 75°F recorded by garden thermometer",
        "Footprint patterns in stable yard inconsistent with later servant testimonies",
        "Ink shade differences in ledger entries",
        "Hollowed ice cubes in ice tray"
      ]
    },
    "social": {
      "trust_channels": [
        "Servants’ testimonies",
        "Household schedules and duty rosters",
        "Family and staff hierarchical reporting"
      ],
      "authority_sources": [
        "Butler’s control over household records",
        "Housekeeper’s oversight of kitchen and staff",
        "Lord Charles’s authority over estate routines"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Garden thermometer next to the sundial shows temperature well above seventy-five degrees Fahrenheit on the murder day.",
        "correction": "The high temperature would cause thermal expansion in the brass gnomon, delaying the sundial’s shadow alignment by approximately ten minutes.",
        "effect": "Narrows the time of death window to about ten minutes before solar noon, contradicting witness assumptions.",
        "required_evidence": [
          "Garden thermometer reading above seventy-five degrees Fahrenheit",
          "Visible expansion gap in the brass gnomon joint on the sundial",
          "Servants consistently referencing sundial shadow time"
        ],
        "reader_observable": true
      },
      {
        "observation": "Ledger book shows a seven shilling mismatch in total sums, and ink shades differ on entries supposedly written at the same time.",
        "correction": "The ledger entries were forged or altered, invalidating the timeline of the victim’s presence and conversations at mid-morning.",
        "effect": "Eliminates Edward Mallory's claim of accurate record-keeping and narrows suspect pool to those with access and motive to forge records.",
        "required_evidence": [
          "Ledger totals mismatch by seven shillings",
          "Ink shade differences on contemporaneous ledger entries",
          "Receipts with inconsistent dates compared to ledger"
        ],
        "reader_observable": true
      },
      {
        "observation": "Servants report hearing the victim’s footsteps in the stable yard twice: once at quarter past ten and again nearly an hour later, but footprint patterns show no fresh prints matching the later time.",
        "correction": "Wind direction and stable door acoustics caused echoes and sound refraction, creating auditory illusions of footsteps at conflicting times.",
        "effect": "Eliminates suspicion of a double presence or secret movement, narrowing the timeline and suspect alibis.",
        "required_evidence": [
          "Weather vane showing consistent east wind at about ten miles per hour",
          "Footprint patterns in stable yard lacking fresh prints matching later testimony",
          "Conflicting servant testimonies on direction and volume of footsteps"
        ],
        "reader_observable": true
      },
      {
        "observation": "Ice tray found with hollowed ice cubes, and servants testify the victim’s demeanor was unchanged immediately after drinking iced water.",
        "correction": "The poison was concealed in hollow ice cubes releasing toxin slowly, causing a delayed poisoning effect after ingestion.",
        "effect": "Narrows poison administration to early before solar noon and implicates those with access to the kitchen and ice tray.",
        "required_evidence": [
          "Hollowed ice cubes discovered in ice tray",
          "Servants’ testimony about unchanged victim demeanor immediately after drinking",
          "Discarded vial of aconite poison found in kitchen waste bin"
        ],
        "reader_observable": true
      },
      {
        "observation": "James Harcourt was seen near the sundial and ice tray during the critical time window and had motive due to financial desperation and resentment.",
        "correction": "Only James had the motive, means, and opportunity to manipulate both the physical timing illusion and administer the delayed poison.",
        "effect": "Identifies James Harcourt as the sole remaining suspect and culprit.",
        "required_evidence": [
          "James Harcourt’s nervousness and unexplained absences",
          "Access to garden sundial and kitchen ice tray",
          "Motive rooted in financial desperation and family resentment"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "constraint_proof",
    "design": "A controlled demonstration measures the sundial’s shadow delay under similar temperature conditions, confirming the approximately ten-minute lag caused by thermal expansion of the brass gnomon. This proves the victim’s actual time of death predates servant alibis and ledger entries, invalidating their timelines and exposing the forged evidence. Additionally, re-examination of hollow ice cubes confirms the delayed-release poison mechanism unique to the culprit’s access and knowledge.",
    "knowledge_revealed": "The sundial’s physical delay and the forged ledger’s checksum errors definitively prove the false temporal assumption and the fabricated alibis, conclusively identifying James Harcourt as the killer.",
    "pass_condition": "Demonstration confirms sundial shadow delay and ledger forgery, eliminating all suspects except James Harcourt.",
    "evidence_clues": [
      "clue_13",
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The garden thermometer and visible gnomon expansion gap (early clues) reveal the sundial shadow delay correcting the assumed time of death. Step 2: Ledger discrepancies with ink differences and receipt dates (mid clues) expose a forged timeline invalidating Edward Mallory’s accounting. Step 3: Footprint evidence and wind data (mid clues) clarify servant testimony contradictions about footsteps, eliminating double presence theories. Step 4: Hollow ice cubes and servant testimonies (mid to late clues) establish the delayed poisoning method. Step 5: James Harcourt’s suspicious behavior, access, and motive (late clues) focus guilt. The discriminating test applies these known facts to prove the false assumption and identify the culprit."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 4,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 5,
      "essential_clues_before_test": true,
      "early_clues_min": 2,
      "mid_clues_min": 2,
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
        "Execute the sundial shadow delay measurement and ledger checksum demonstration",
        "Observe the hollow ice cubes and relate poison timing",
        "Draw firm conclusion about the false temporal assumption and culprit identity"
      ],
      "test_type": "constraint_proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Langley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Multiple servant alibis and timing contradictions disprove opportunity",
        "supporting_clues": [
          "Servants’ consistent testimony on Beatrice’s whereabouts",
          "Timing of ledger forgery excludes her access"
        ]
      },
      {
        "suspect_name": "Agnes Wilkes",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Acoustic explanation of footsteps clears suspicion of secret movement",
        "supporting_clues": [
          "Weather vane and footprint pattern data",
          "Agnes’s observed duties and presence"
        ]
      },
      {
        "suspect_name": "Edward Mallory",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Unaware of forged ledger entries and no motive for poisoning",
        "supporting_clues": [
          "Ledger ink shade and checksum errors link to forgery",
          "Edward’s known record-keeping habits"
        ]
      },
      {
        "suspect_name": "Lord Charles Harcourt",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with sundial physical test, ledger forgery proof, and ice tray evidence"
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
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Direct observation"
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
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_17",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_james_harcourt",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_elimination_edward_mallory",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Evelyn Harcourt",
    "summary": "A former solicitor turned estate manager with a sharp investigative mind, Evelyn is the discreet force uncovering the tangled truths behind Lord Harcourt's murder.",
    "publicPersona": "Evelyn Harcourt is the epitome of efficiency and discretion. As the estate manager of Harcourt Manor, she commands respect through her sharp intellect and unwavering loyalty to the family she serves. Her presence is calming yet authoritative, and she navigates the intricate social webs of the upper class with practiced ease, always keeping a watchful eye on the estate’s affairs.",
    "privateSecret": "Beneath her composed exterior lies a former solicitor who abandoned the law out of disillusionment with the justice system’s failings. Despite leaving legal practice, she retained her investigative acumen and cultivated a network among local officials and informants, which she now employs quietly in service to the Harcourts.",
    "motiveSeed": "Evelyn was engaged by the Harcourt family solicitor to conduct a discreet inquiry into the murder, as the local police investigation appears compromised by influential local interests. Her commitment is both professional and personal, a chance to restore justice where official channels faltered.",
    "motiveStrength": "compelling",
    "alibiWindow": "Evelyn was not present at the estate prior to the murder; she arrived post-murder upon being engaged to investigate.",
    "accessPlausibility": "impossible",
    "stakes": "This case is career-defining for Evelyn, testing her loyalty to the Harcourt family and her own standards of justice. Solving the mystery will cement her reputation as a capable and discreet investigator.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Evelyn speaks with measured precision, her tone clipped but never harsh. She favours understatement and often employs a subtle irony that can cut through pretense. Her questions are deliberate, sometimes rhetorical, and she has a habit of pausing just long enough to let her meaning sink in.",
    "signatureTic": "\"One must consider the evidence, not the emotion.\"",
    "internalConflict": "Evelyn struggles with a lingering distrust of formal justice, shaped by past disappointments, and fears that uncovering the truth here might expose systemic corruption that she is powerless to fully combat.",
    "personalStakeInCase": "Her loyalty to the Harcourt family solicitor who hired her compels her to seek justice where others have failed, making this investigation a test of both her professional skill and personal integrity.",
    "paragraphs": [
      "Evelyn Harcourt’s arrival at Harcourt Manor was marked by a quiet authority that belied her outsider status. Though not a member of the family, her reputation as an efficient and discreet estate manager preceded her, and her keen mind was immediately apparent to those who sought her counsel. She moved through the halls with a purposeful grace, observing minutiae that others overlooked, a habit born from years of legal practice.",
      "Her past as a solicitor is a shadow she neither flaunts nor hides. Disillusioned by the law’s failures to serve true justice, Evelyn left the courtroom behind, yet the skills she honed remain sharp. She wields her knowledge of legal nuances and social dynamics like a scalpel, dissecting the tangled web of relationships and motives within the estate. Her network of contacts in local government and law enforcement provides her with a flow of information that the official police investigation sorely lacks.",
      "In conversation, Evelyn’s speech is economical, her dry wit delivering barbed observations that often leave listeners reconsidering their assumptions. She is not one for idle chatter; every word is weighed and measured. Yet, there is a warmth beneath her formality, a subtle empathy that surfaces when she senses the true pain behind a facade of composure.",
      "Despite her professional detachment, Evelyn carries an internal tension born of her distrust in the justice system. She fears that uncovering the truth may reveal not only the murderer but also the rot of societal corruption and privilege that protects them. This moral conflict drives her forward but also weighs heavily on her conscience.",
      "Her personal stake in the case is profound. Engaged by the Harcourt family solicitor—one of the few she trusts—Evelyn sees this investigation as a chance to uphold the principles she once believed the law embodied. Failure is not an option; the reputation of the Harcourt family and her own integrity hang in the balance."
    ],
    "order": 1
  },
  {
    "name": "Lord Charles Harcourt",
    "summary": "The stern patriarch of Harcourt Manor, Lord Charles struggled to preserve his estate amid financial woes and family strife until his untimely death.",
    "publicPersona": "Lord Charles Harcourt commanded respect as a dignified yet stern figure, the embodiment of the old landed gentry. His bearing was that of a man determined to uphold tradition and maintain the estate, even as economic pressures mounted. He was both feared and admired, a man who bore the weight of his family’s legacy with grim resolve.",
    "privateSecret": "Behind closed doors, Lord Charles wrestled with the harsh realities of decline. He was poised to disinherit his son due to reckless spending and planned to sell off portions of the estate to cover mounting debts—a move that threatened to fracture family loyalty and social standing.",
    "motiveSeed": "N/A as victim",
    "motiveStrength": "weak",
    "alibiWindow": "Deceased; found early morning in the library",
    "accessPlausibility": "possible",
    "stakes": "His death threatens to unravel the fragile social order and family inheritance, setting off a chain of upheavals that could destroy Harcourt Manor’s legacy.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Lord Charles spoke with an austere formality, each word deliberate and measured. His tone was often clipped, with a tendency toward dry understatement that conveyed authority more than warmth. He rarely indulged in small talk, preferring to address matters of consequence directly.",
    "signatureTic": "\"We must endure, as our fathers did.\"",
    "internalConflict": "He struggled internally with the tension between preserving tradition and adapting to inevitable change, fearing that his decisions would alienate his family and erode the estate’s future.",
    "personalStakeInCase": "Though deceased, Lord Charles’s death is the fulcrum around which the entire mystery pivots, his life choices and secrets casting long shadows over the estate’s fate.",
    "paragraphs": [
      "Lord Charles Harcourt was the last of a proud lineage, a man who bore the weight of centuries of family history on his shoulders. His presence at the manor was imposing, his stern gaze and measured speech reflecting a lifetime of discipline and duty. He faced the decline of his estate with a grim determination, unwilling to surrender to the pressures that threatened his family’s standing.",
      "Despite his public stoicism, Lord Charles harboured private anxieties. His son’s reckless spending had driven a wedge between them, and the decision to disinherit James was a bitter one. To cover debts, he contemplated selling off parts of the estate, a move that would forever alter the family’s legacy and social position.",
      "His speech was economical, often marked by dry, almost bleak understatement. He spoke of endurance and duty with a solemnity that brooked no dissent, his manner both commanding and distant. Conversations with him left little room for levity, reflecting a man for whom humor was a luxury long abandoned.",
      "Internally, Lord Charles wrestled with the conflict between the old order and the inevitable changes of the modern world. The burden of responsibility weighed heavily, and the fear that his decisions might fracture his family haunted him.",
      "Though his voice is now silenced, Lord Charles remains the pivotal figure. His death not only removes the patriarch but also exposes the fissures within the family and estate, setting the stage for secrets to surface and loyalties to be tested."
    ],
    "order": 2
  },
  {
    "name": "Beatrice Langley",
    "summary": "A charming socialite with a tenuous grasp on fortune, Beatrice’s secret affair and financial desperation cast suspicion upon her amidst the manor’s turmoil.",
    "publicPersona": "Beatrice Langley is known in society circles as a gracious and philanthropic figure, effortlessly charming those around her. Her involvement in charitable causes has earned her admiration, and she is often seen as a rising star among the social elite, carefully cultivating favor with influential figures, including Lord Harcourt.",
    "privateSecret": "Beneath her polished veneer, Beatrice is deeply in debt and desperate to secure her social standing. She engaged in a secret affair with Lord Harcourt, hoping to secure financial support and a foothold in the aristocracy, only to face abrupt withdrawal when the will’s changes came to light.",
    "motiveSeed": "She stands to lose a promised but unofficial financial arrangement with Lord Harcourt, who intended to sever ties following the impending alterations to his will.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be hosting a charity event at the village hall during the murder hours.",
    "accessPlausibility": "possible",
    "stakes": "Beatrice’s financial ruin and loss of social standing are at stake, threatening to undo the carefully constructed life she has built on charm and opportunism.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice’s speech is florid and deliberate, peppered with genteel sarcasm and barbed compliments. She enjoys weaving social niceties with subtle jabs, her tone often masking sharp calculation beneath a veneer of warmth. Her laughter is light but sometimes tinged with a knowing edge.",
    "signatureTic": "\"Isn’t society simply a dance of masks and whispers?\"",
    "internalConflict": "She battles the fear of exposure and the shame of her financial desperation, caught between ambition and the moral compromises she has made along the way.",
    "personalStakeInCase": "Beatrice’s future hinges on the outcome; the murder threatens to sever her ties to wealth and influence, forcing her to confront the consequences of her social climbing.",
    "paragraphs": [
      "Beatrice Langley moves through the world with the practiced ease of a seasoned socialite, her smile disarming and her charm seemingly effortless. Those who meet her are often captivated by her grace and apparent generosity, unaware of the precarious financial tightrope she walks beneath the surface.",
      "Her involvement with Lord Harcourt was a calculated gamble. The secret affair promised financial security and social advancement, but with the patriarch’s plans to alter his will, Beatrice found herself abruptly cast aside. The promise of support vanished, leaving her desperate and vulnerable.",
      "Her words are a blend of genteel civility and sharp wit. She enjoys the subtle art of polite savagery, delivering compliments that sting and observations laced with irony. Her laughter, light and melodic, often conceals the anxiety that lurks just beneath her composed exterior.",
      "Internally, Beatrice wrestles with the shame of her debts and the moral compromises she has made to secure her place among the elite. The fear of losing everything gnaws at her, yet she masks it with bravado and social grace.",
      "The stakes for Beatrice could not be higher. The murder threatens not only her immediate financial arrangements but the very future she has painstakingly built. As the investigation unfolds, she must navigate the perilous intersection of ambition, loyalty, and survival."
    ],
    "order": 3
  },
  {
    "name": "James Harcourt",
    "summary": "The charming but reckless heir, James is caught between desperation and entitlement, his strained ties to his father clouding his innocence.",
    "publicPersona": "James Harcourt is known for his charm and occasional recklessness, a young heir whose gambling debts and strained relationship with his father have made him a figure of whispered concern among the estate’s circles. His passion for history contrasts with his impulsive tendencies.",
    "privateSecret": "Recently, James discovered his father’s intention to disinherit him, a revelation that sent him into a spiral of desperation. He is determined to regain favor and control over the estate, willing to take risks that threaten to undo him.",
    "motiveSeed": "He stands to inherit only if the existing will remains unchanged; the planned alterations would leave him destitute, providing a compelling motive to obstruct his father’s plans by any means.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claims to have been in the stables tending horses during the murder, an alibi supported solely by a servant whose reliability is questionable.",
    "accessPlausibility": "easy",
    "stakes": "Inheritance and social status hang in the balance; failure means losing everything to creditors and family rivals, a fall from grace that haunts him.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "James speaks in a straightforward, sometimes brusque manner, lacking pretense or artifice. His words are often clipped, and he tends to avoid unnecessary embellishment, reflecting his impatience and frustration. When nervous, he fidgets or interrupts himself.",
    "signatureTic": "\"Look, I’m not one for beating around the bush.\"",
    "internalConflict": "He is torn between his entitlement as heir and the fear of losing everything, battling guilt over his reckless behaviors and resentment toward his father’s decisions.",
    "personalStakeInCase": "The murder directly threatens his future; it is a fight for survival as much as for inheritance, making the outcome deeply personal and urgent.",
    "paragraphs": [
      "James Harcourt embodies the contradictions of youth and privilege. His charm wins friends, but his reckless gambling and mounting debts have earned him wary glances. His passion for history offers a glimpse of depth beyond his impulsive exterior, though it often goes unnoticed.",
      "The discovery of his father’s plan to disinherit him struck like a blow. His desperation grew, fueling risky decisions and strained confrontations. He claims to have been in the stables during the murder, but the sole witness to this alibi is a servant whose trustworthiness is suspect, casting doubt on his innocence.",
      "James’s speech is blunt and to the point, reflecting a man who prefers action over diplomacy. His impatience surfaces in clipped sentences, and under pressure, he exhibits nervous habits such as fidgeting or trailing off mid-sentence. He eschews social niceties, speaking plainly even when it might offend.",
      "Internally, James wrestles with the dual burdens of guilt and entitlement. He resents his father’s decisions but also fears the ruin that awaits should he lose the inheritance. This conflict drives much of his behavior, blurring the line between victim and suspect.",
      "His stake in the case is deeply personal. The murder threatens to extinguish his hopes and ambitions, forcing him to confront the consequences of his recklessness and the fragile nature of his position within the family and society."
    ],
    "order": 4
  },
  {
    "name": "Agnes Wilkes",
    "summary": "The steadfast head housekeeper whose loyalty to the estate is tested by rising class tensions and the threat of upheaval.",
    "publicPersona": "Agnes Wilkes commands respect as the head housekeeper, a figure of steadfast loyalty and discretion. Her decades of service have earned her the trust of both family and staff, and she manages the household with a firm yet fair hand.",
    "privateSecret": "Though devoted, Agnes harbours a deep resentment toward the family’s disregard for servants. She holds a secret protective affection for Lord Harcourt, viewing him as a bastion of stability, even as she fears the reckless heirs may destroy all they have preserved.",
    "motiveSeed": "Horrified by the prospect of estate lands being sold and the consequent job losses for servants, Agnes fears the victim’s death will unleash chaos that threatens the social order she has maintained.",
    "motiveStrength": "moderate",
    "alibiWindow": "She was occupied managing the evening servants’ routines, an alibi corroborated by several staff members.",
    "accessPlausibility": "easy",
    "stakes": "Her own job security and the livelihoods of fellow servants are at risk, as is the preservation of the estate’s traditional social hierarchy.",
    "humourStyle": "deadpan",
    "humourLevel": 0.2,
    "speechMannerisms": "Agnes speaks in a steady, unembellished tone, often with a dry, deadpan delivery that conveys both patience and quiet exasperation. She uses few words but when she does, they carry weight. Her humour is subtle, often expressed through ironic understatement rather than overt jokes.",
    "signatureTic": "\"Well, that’s the way of things, isn’t it?\"",
    "internalConflict": "She wrestles with her loyalty to the family and growing disillusionment as class tensions rise and the estate’s future becomes uncertain.",
    "personalStakeInCase": "The murder symbolizes a threat to the order and security she has dedicated her life to preserving, making the outcome vital not only for the family but for all who depend on the estate.",
    "paragraphs": [
      "Agnes Wilkes is the quiet backbone of Harcourt Manor, her steady presence a reassurance to all who live and work there. Her decades of service have shaped her into a woman of discretion and resilience, commanding respect without demanding it. She manages the household with an iron will wrapped in a velvet glove.",
      "Though outwardly loyal, Agnes harbours a simmering resentment toward the family’s frequent disregard for the servants’ welfare. Her secret affection for Lord Harcourt stems from seeing in him a rare respect for tradition and order, qualities she fears are vanishing with his death.",
      "Her speech is plain and unadorned, delivered in a deadpan manner that often masks a sharp intelligence and a wry sense of humour. She rarely wastes words, but when she speaks, her observations cut to the core with understated irony.",
      "Internally, Agnes struggles with the tension between her loyalty and her growing disillusionment. The impending sale of estate lands threatens to uproot the lives of many she cares for, and she fears the social upheaval that may follow the patriarch’s death.",
      "Her stake in the case is deeply tied to her role within the estate. The murder jeopardizes not just the family’s legacy but the livelihoods and dignity of the servants who form the manor’s unseen foundation."
    ],
    "order": 5
  },
  {
    "name": "Edward Mallory",
    "summary": "An ambitious local businessman whose aspirations to rise into the landed gentry are shadowed by his secret machinations and opportunism.",
    "publicPersona": "Edward Mallory is a confident and ambitious figure in local commerce, eager to expand his influence and break into the ranks of the landed gentry. His connections and business acumen make him a formidable presence in the village and beyond.",
    "privateSecret": "Behind his polished exterior, Edward pressured Lord Harcourt to sell parts of the estate cheaply and harboured secret hopes of marrying into the family to cement his social elevation.",
    "motiveSeed": "The murder would destabilize the estate, facilitating a forced sale that benefits his business interests. He feared Lord Harcourt’s opposition would block these plans, providing a strong motive.",
    "motiveStrength": "strong",
    "alibiWindow": "He was reportedly at the village pub during the time of the murder, an alibi supported by several patrons.",
    "accessPlausibility": "unlikely",
    "stakes": "His social advancement and financial gain through land acquisition are on the line, with the murder potentially clearing the path to his ambitions.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Edward speaks with a smooth, confident cadence, often punctuated by sharp observations about social dynamics and human nature. His tone is polished, occasionally slipping into persuasive rhetoric, reflecting his business mindset. He uses humour to disarm and to assert control.",
    "signatureTic": "\"Opportunity, my friend, is a most persuasive companion.\"",
    "internalConflict": "He grapples with the limits of his ambition, aware that his social climbing may alienate those he wishes to impress and that some barriers may be insurmountable.",
    "personalStakeInCase": "The murder represents both a threat and an opportunity; Edward’s future depends on the estate’s fate and his ability to navigate the ensuing power vacuum.",
    "paragraphs": [
      "Edward Mallory strides through the local scene with the assuredness of a man on the rise. His confidence is palpable, and his connections in commerce grant him a foothold in both the village and the corridors of power. He views the landed gentry not as an exclusive club but as a prize within reach.",
      "His dealings with Lord Harcourt were marked by persistent pressure to sell estate lands at a bargain, a strategy that would enable Edward’s expansion. His ambition extended beyond business; he nurtured secret hopes of marrying into the family, imagining the social elevation that would follow.",
      "Edward’s speech is polished and deliberate, his tone smooth and persuasive. He peppers conversations with keen observations and wry humour, using wit as a tool to charm and manipulate. His rhetoric often carries an undercurrent of calculated intent.",
      "Yet beneath his confident exterior, Edward wrestles with the realization that ambition alone may not suffice. He fears that entrenched class barriers and family loyalties could thwart his plans, leaving him to ponder the true cost of his aspirations.",
      "The murder at Harcourt Manor is a double-edged sword for Edward. It threatens to disrupt the delicate balance of power but also offers a chance to seize opportunity. His future hinges on how deftly he maneuvers through the unfolding chaos."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Harcourt Manor Estate",
    "type": "Manor house estate",
    "place": "Wychwood Heath",
    "country": "England",
    "summary": "An imposing 1930s country manor nestled amidst rolling parkland and ancient woodlands, Harcourt Manor Estate exudes old-world grandeur and rigid social order, isolated from the nearby village of Wychwood Heath by miles of farmland and dense hedgerows.",
    "visualDescription": "A sprawling stone manor with steep slate roofs and leaded glass windows, surrounded by manicured formal gardens, a sundial centerpiece, extensive stables painted deep green, and servants’ quarters arranged discreetly beyond a walled courtyard. Gravel drive winds through towering oaks and dense hedges, ending at wrought-iron gates.",
    "atmosphere": "The estate’s atmosphere is heavy with unspoken tensions beneath a veneer of genteel civility. Cool autumn mists curl around the grounds, muffling sounds and blurring outlines, while the scent of damp earth and burning wood lingers in the crisp air. Time moves deliberately here, measured by the distant church bell and the ticking of brass clocks in richly paneled rooms.",
    "paragraphs": [
      "Harcourt Manor dominates the landscape of Wychwood Heath, a stately home built of weathered stone and steep slate roofs that catch the low autumn light. Leaded glass windows glint faintly through the morning fog, revealing heavy curtains and glimpses of polished wood interiors. The formal gardens, bordered by clipped box hedges, center on an ornate sundial whose shadow falls silent and unyielding, a symbol of the estate’s enduring legacy and hidden secrets.",
      "The long gravel driveway curves through ancient oaks whose branches reach like gnarled fingers over the path, their leaves whispering with every breeze. Beyond the main house, the stables stand in orderly rows, painted a deep forest green, their scents of hay and leather carried faintly on the damp air. Servants’ quarters are tucked behind a high stone wall, accessible only through a narrow gated archway, separating the working staff from the family’s private domain.",
      "Inside, the manor is a labyrinth of dark oak paneling, heavy rugs, and brass fittings, warmed by crackling fires in vast hearths. The air carries subtle hints of beeswax polish, pipe tobacco, and aged paper from the family’s library. Time here is marked by the mechanical ticking of clocks, the chime of the distant parish bell, and the steady rhythms of domestic routine—meals punctuated by the ringing of silverware on fine china, and footsteps echoing softly in polished corridors.",
      "Isolation defines the estate’s character. Several miles from Wychwood Heath village, the manor is reachable only by a single country road, often slick with autumn rain or veiled in persistent fog. The natural barriers of hedgerows and woodlands keep visitors at bay, while the estate’s gates and locked private rooms enforce strict boundaries among its inhabitants. This physical and social seclusion fosters an atmosphere ripe for whispered confidences and concealed motives beneath the surface of polite society."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "cool, damp autumn with intermittent fog typical of English countryside",
    "timeFlow": "Three days of mounting tension unfolding in deliberate, measured hours",
    "mood": "reserved and tense under polite surface, reflecting social pressures and economic uncertainty",
    "eraMarkers": [
      "petrol touring cars on country roads",
      "domestic telephones on party-line exchanges",
      "manual typewriters for correspondence and record keeping"
    ],
    "sensoryPalette": {
      "dominant": "damp earth and woodsmoke mingling with clipped box hedges",
      "secondary": [
        "crackling fires and polished brass fittings",
        "faint ticking of mechanical clocks"
      ]
    },
    "paragraphs": [
      "The manor’s vast grounds are shrouded in a persistent autumnal fog that softens edges and swallows distant sounds. The cool air carries the mingled scents of damp earth, burning wood, and the faint musk of fallen leaves. Gravel crunches underfoot along the winding driveway, while the hush is broken only by the occasional call of a distant pheasant or the rustle of dry foliage. Inside the house, the warmth of hearth fires contrasts with the chill seeping through stone walls, and the scent of beeswax polish and tobacco smoke lingers in richly furnished rooms.",
      "Time here is both oppressive and slow, measured by the steady ticking of brass clocks and the tolling of the village church bell heard faintly across the estate. The social order imposes a rigid rhythm on daily life—meals served punctually, servants moving silently through shadowed corridors, and family members maintaining a veneer of civility despite underlying tensions. This atmosphere of poised restraint and unspoken secrets shapes every footstep and whispered conversation within Harcourt’s walls."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library at Harcourt Manor",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A somber, wood-paneled room lined with towering bookcases filled with leather-bound volumes. Heavy velvet drapes frame tall mullioned windows overlooking the garden sundial. A large mahogany desk cluttered with papers and a manual typewriter sits beneath a green-shaded banker’s lamp. Persian rugs muffle footsteps on polished floorboards.",
      "sensoryDetails": {
        "sights": [
          "leather-bound spines on bookcases",
          "green-shaded banker’s lamp glow",
          "velvet drapes drawn over window",
          "scattered handwritten letters and papers",
          "dust motes in filtered sunlight",
          "polished mahogany desk surface"
        ],
        "sounds": [
          "soft rustling of heavy pages",
          "distant ticking of brass clock",
          "quiet scratching of pen on paper",
          "faint creak of settling wood",
          "muffled footsteps on rugs",
          "occasional crackle from fireplace"
        ],
        "smells": [
          "aged leather and parchment",
          "faint pipe tobacco smoke",
          "beeswax polish on wood",
          "musty paper and dust",
          "embers smoldering in hearth",
          "old ink and sealing wax"
        ],
        "tactile": [
          "smooth leather chair armrest",
          "cool brass of lamp base",
          "rough grain of oak desk",
          "soft pile of Persian rug",
          "crisp edges of paper sheets",
          "warmth from nearby hearth"
        ]
      },
      "accessControl": "Restricted to family and select senior staff; locked outside of business hours; visitors require escort; private rooms beyond library strictly off-limits.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked mullioned windows",
            "grey light filtering through drapes",
            "glossy wet leaves visible outside",
            "glistening sundial stone outdoors"
          ],
          "sounds": [
            "steady tapping of raindrops",
            "water dripping from eaves",
            "soft rustle of wet leaves",
            "distant rumble of thunder"
          ],
          "smells": [
            "damp stone and wet wood",
            "earthy petrichor from garden",
            "smoky hearth embers",
            "faint scent of ink and paper"
          ],
          "mood": "oppressive and contemplative"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter daylight through windows",
            "shadows softened by cloud cover",
            "dust motes suspended in air",
            "dark spines of books in rows"
          ],
          "sounds": [
            "quiet turning of pages",
            "distant clock striking hour",
            "creaking floorboards beneath footsteps",
            "low crackle from dying fire"
          ],
          "smells": [
            "wax polish on wood",
            "musty old books",
            "pipe tobacco lingering",
            "faint scent of cold stone"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm candlelight flickering on walls",
            "glowing embers in hearth",
            "reflections on polished wood"
          ],
          "sounds": [
            "soft ticking of mantel clock",
            "whispered voices from hallway",
            "rustling pages in silence",
            "occasional crackle from fire"
          ],
          "smells": [
            "burning beeswax candles",
            "rich pipe tobacco",
            "warm fireplace ash",
            "aged parchment and ink"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library serves as a sanctum of knowledge and secrecy within Harcourt Manor, its tall bookcases sheltering centuries of family history and arcane tomes. The heavy velvet curtains mute the outside world, while the green-shaded lamp casts a focused glow over the cluttered desk, strewn with handwritten correspondence and a well-used manual typewriter. Persian rugs soften footsteps, lending an air of hushed reverence to the room.",
        "It is here, amid the scent of aged leather and pipe smoke, that the silence was shattered by an unseen violence. The polished wood bears faint impressions of hurried movement, and the scattered papers hint at interrupted thoughts. Access is tightly controlled, the library locked except during designated hours, preserving the scene’s integrity. Outside, the garden sundial stands silent, a mute witness to the unfolding mystery."
      ]
    },
    {
      "id": "servants_quarters",
      "name": "Servants’ Quarters",
      "type": "interior",
      "purpose": "Staff residence and work hub",
      "visualDetails": "A modest, utilitarian wing of the estate with narrow corridors lined by plain wooden doors. Small communal rooms furnished with simple pine tables and chairs, worn rugs, and iron-framed beds with faded linens. Windows overlook the kitchen yard and stable backs.",
      "sensoryDetails": {
        "sights": [
          "plain whitewashed walls",
          "faded linen curtains",
          "scuffed wooden floorboards",
          "rows of iron-framed beds",
          "stacked enamel washbasins",
          "hanging oil lamps"
        ],
        "sounds": [
          "clinking of enamel dishes",
          "low murmur of whispered conversations",
          "scraping of chairs on floor",
          "distant clatter from kitchen",
          "footsteps on creaking stairs",
          "rustling fabric of uniforms"
        ],
        "smells": [
          "stale soap and liniment",
          "warm bread baking nearby",
          "sour sweat and damp wool",
          "burning coal from kitchen range",
          "freshly laundered cotton",
          "earthy stable odors drifting"
        ],
        "tactile": [
          "rough woolen uniforms",
          "cool iron bed frames",
          "scratchy cotton sheets",
          "smooth enamel basin edges",
          "worn wooden chair seats",
          "warmth from nearby stove"
        ]
      },
      "accessControl": "Restricted to servants and domestic staff; no family members permitted except rare visits; entry controlled by housekeeper; movement confined mostly to daylight hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through small windows",
            "damp patches on floorboards",
            "glossy wet cobblestones outside"
          ],
          "sounds": [
            "drumming of rain on roof",
            "soft footsteps in hallways",
            "clinking of breakfast dishes"
          ],
          "smells": [
            "wet wool and earth",
            "warm coal embers",
            "freshly baked bread"
          ],
          "mood": "quiet diligence"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light through curtained windows",
            "shadows pooling in corners",
            "flickering oil lamp flames"
          ],
          "sounds": [
            "murmured conversations",
            "distant kitchen clatter",
            "soft rustle of fabric"
          ],
          "smells": [
            "soap and liniment",
            "burning coal smoke",
            "earthy stable scents"
          ],
          "mood": "subdued routine"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from oil lamps",
            "shadows stretching along walls",
            "flickering hearth embers"
          ],
          "sounds": [
            "quiet footsteps",
            "whispered voices",
            "distant ticking of clock"
          ],
          "smells": [
            "smoke from kitchen range",
            "fresh linen scent",
            "cool night air through windows"
          ],
          "mood": "weary calm"
        }
      ],
      "paragraphs": [
        "The servants’ quarters form a stark contrast to the manor’s opulence, a functional space of plain walls, worn furniture, and narrow corridors where the estate’s domestic staff gather between duties. The air carries the mingled scents of soap, coal smoke, and the earthy tang of nearby stables. Here, the rigid social hierarchy is palpable; the staff move with quiet efficiency, their lives governed by strict schedules and limited freedoms.",
        "Despite its austerity, the quarters are a refuge from the estate’s formalities, where whispered confidences and shared burdens circulate beneath the hum of oil lamps and the clink of enamelware. Access is tightly controlled, with only servants allowed entry, reinforcing the separation from the family’s private world. The atmosphere is one of subdued diligence, punctuated by moments of weary camaraderie."
      ]
    },
    {
      "id": "estate_gardens",
      "name": "Formal Gardens and Sundial",
      "type": "exterior",
      "purpose": "Gathering space and symbolic landmark",
      "visualDetails": "Geometrically arranged flowerbeds and clipped box hedges surround a central stone sundial atop a low pedestal. Gravel paths wind through rose bushes and towering yew trees. Stone benches and wrought-iron garden seats provide resting points. The garden borders dense woodland.",
      "sensoryDetails": {
        "sights": [
          "vibrant autumn foliage",
          "gleaming sundial face",
          "clipped box hedges",
          "scattered fallen leaves",
          "stone benches weathered by time",
          "dappled sunlight through yew branches"
        ],
        "sounds": [
          "rustling dry leaves",
          "distant birdcalls",
          "soft crunch of gravel",
          "whispering wind through trees",
          "occasional bee buzzing",
          "gentle drip of dew"
        ],
        "smells": [
          "earthy damp soil",
          "faint scent of chrysanthemums",
          "crisp autumn air",
          "woody resin from yew",
          "fresh cut grass",
          "moss and fallen leaves"
        ],
        "tactile": [
          "rough stone sundial surface",
          "crisp fallen leaves underfoot",
          "cold wrought-iron bench arms",
          "coarse gravel paths",
          "smooth weathered stone benches",
          "cool breeze on skin"
        ]
      },
      "accessControl": "Open to family and escorted visitors during daylight hours; gates locked after dusk; garden paths monitored by staff; woodland edge off-limits without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-slick leaves and petals",
            "glistening sundial stone",
            "grey sky through bare branches"
          ],
          "sounds": [
            "steady rain on foliage",
            "water dripping from leaves",
            "soft splash of puddles"
          ],
          "smells": [
            "wet earth and moss",
            "fresh rain on stone",
            "damp foliage"
          ],
          "mood": "melancholy serenity"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on muted colors",
            "soft shadows beneath hedges",
            "clouded sky above treetops"
          ],
          "sounds": [
            "rustling leaves in still air",
            "distant woodpecker tapping",
            "soft crunch of footsteps"
          ],
          "smells": [
            "dry leaves and soil",
            "woody resin",
            "faint floral undertones"
          ],
          "mood": "quiet contemplation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of setting sun",
            "long shadows across paths",
            "glint of sundial edges"
          ],
          "sounds": [
            "evening birdcalls fading",
            "soft breeze through branches",
            "distant church bell toll"
          ],
          "smells": [
            "cool autumn air",
            "smoke from distant chimneys",
            "crisp leaf litter"
          ],
          "mood": "reflective calm"
        }
      ],
      "paragraphs": [
        "The formal gardens at Harcourt Manor are a carefully curated blend of nature and order, where clipped box hedges frame vibrant flowerbeds and a central sundial stands as a silent arbiter of time’s passage. Gravel paths meander through towering yews and rose bushes, their blooms fading into autumn hues. Stone benches, softened by years of weathering, offer quiet spots for reflection or whispered conversations.",
        "Surrounding the manicured grounds, dense woodland edges the estate, its shadowy presence a reminder of the wild beyond the ordered world of the manor. The gardens serve as both a social gathering place and a symbolic heart of the estate, where the sundial’s shadow marks the unchanging rhythm beneath the shifting tensions of its inhabitants."
      ]
    },
    {
      "id": "stable_yard",
      "name": "Stable Yard and Coach House",
      "type": "exterior",
      "purpose": "Work area and transport hub",
      "visualDetails": "A cobbled courtyard surrounded by red-brick stable buildings and a large coach house with sliding wooden doors. Rows of saddles and bridles hang neatly on hooks inside. Stables’ windows open to the yard, revealing straw-filled stalls and the occasional flicker of horse tails. A petrol touring car is parked near the coach house.",
      "sensoryDetails": {
        "sights": [
          "red brick walls with ivy tendrils",
          "gleaming leather saddles",
          "neatly coiled ropes",
          "oil-stained cobblestones",
          "shining brass horse fittings",
          "parked petrol touring car"
        ],
        "sounds": [
          "snorting and shifting of horses",
          "clattering of harness buckles",
          "footsteps on cobbles",
          "distant clip-clop of hooves",
          "soft murmur of stable hands",
          "creaking of wooden doors"
        ],
        "smells": [
          "fresh hay and straw",
          "horse sweat and leather",
          "oil and petrol fumes",
          "earthy damp cobblestones",
          "woodsmoke from nearby chimneys",
          "scent of horse liniment"
        ],
        "tactile": [
          "rough horsehair coat",
          "smooth leather reins",
          "cool iron stable fittings",
          "hard cobblestone underfoot",
          "warm oil-stained hands",
          "coarse straw beneath fingers"
        ]
      },
      "accessControl": "Restricted to stable hands and authorized staff; family may visit during daylight; coach house locked when unattended; gates secured at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "wet cobblestones gleaming",
            "rain dripping from eaves",
            "mist rising from straw stacks"
          ],
          "sounds": [
            "steady rain on tiled roofs",
            "soft snorts from sheltered horses",
            "water splashing in puddles"
          ],
          "smells": [
            "damp hay and leather",
            "fresh rain on earth",
            "oil and petrol"
          ],
          "mood": "busy yet subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on brickwork",
            "shadows pooling in corners",
            "muddy footprints on cobbles"
          ],
          "sounds": [
            "clinking harness buckles",
            "hoofbeats on hard ground",
            "quiet voices of stable hands"
          ],
          "smells": [
            "earthy dampness",
            "horse sweat and leather",
            "faint smoke from chimneys"
          ],
          "mood": "steady and practical"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light spilling from windows",
            "long shadows across yard",
            "gleaming brass fittings"
          ],
          "sounds": [
            "soft nickers from horses",
            "closing of wooden doors",
            "distant church bell"
          ],
          "smells": [
            "cool evening air",
            "fresh hay and leather",
            "smoke from kitchen fires"
          ],
          "mood": "calm closure"
        }
      ],
      "paragraphs": [
        "The stable yard bustles with quiet industry, its red-brick buildings and cobbled courtyard a hub of estate activity. Inside, rows of saddles and harnesses gleam under the lantern light, while the scent of fresh hay and leather pervades the air. The occasional neigh or snort punctuates the steady rhythm of footsteps and the clatter of harness fittings, as stable hands tend to their charges and prepare the petrol touring car for journeys beyond the estate.",
        "Despite the practical focus, the coach house and stables carry an air of tradition and care, the well-maintained tack and orderly arrangements reflecting the estate’s pride in its horses and vehicles. Access is carefully controlled, with gates locked at night and only authorized staff permitted within, underscoring the manor’s blend of openness and guarded privacy."
      ]
    }
  ],
  "note": "",
  "cost": 0.0072695799999999994,
  "durationMs": 71153
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1934,
    "month": "October",
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "cool temperatures averaging 8-12°C (46-54°F)",
      "damp mornings with intermittent fog rolling in from nearby woodlands and fields",
      "occasional chilly drizzle and overcast skies typical of English countryside autumn"
    ],
    "daylight": "shortening daylight hours with sunset around 6pm, dusk falling early, and morning fog delaying sunrise clarity",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded and the manor has quieted",
    "holidays": [
      "Harvest Festival celebrations in local villages earlier in the month",
      "All Saints’ Day preparations on November 1st, influencing late October church services and floral decorations"
    ],
    "seasonalActivities": [
      "fox hunting meets on crisp autumn mornings",
      "harvesting and cider pressing on estate grounds",
      "evening fireside gatherings with storytelling and radio listening"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece wool tweed suits in earth tones with waistcoats",
        "stiff detachable collars paired with silk ties",
        "brogue leather Oxford shoes polished to a shine"
      ],
      "casual": [
        "knitted argyle sweaters worn under tweed shooting jackets",
        "flat caps or homburg hats",
        "corduroy trousers with turn-ups"
      ],
      "accessories": [
        "silver pocket watches with chain fob",
        "leather driving gloves",
        "silk scarves in muted plaids"
      ]
    },
    "womensWear": {
      "formal": [
        "long-sleeved silk blouses with lace collars paired with bias-cut wool skirts",
        "cloche hats decorated with feathers or ribbons",
        "suede pumps with modest heels"
      ],
      "casual": [
        "knitted twinsets or cardigan sweaters over shirtwaist dresses",
        "wool berets or felt hats",
        "long gloves for outdoor excursions"
      ],
      "accessories": [
        "beaded handbags",
        "pearl necklaces and brooches",
        "silk scarves tied at the neck"
      ]
    },
    "trendsOfTheMoment": [
      "return to more conservative, tailored silhouettes after the more flamboyant late 1920s",
      "use of natural fibers like wool, silk, and cotton emphasizing practicality",
      "hats remaining essential for both genders in public"
    ],
    "socialExpectations": [
      "men expected to maintain impeccable grooming and wear appropriate attire for each occasion",
      "women to observe modesty and elegance, reflecting social standing",
      "both genders to adhere strictly to class-appropriate dress codes, especially in rural aristocratic settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Labour Party under Ramsay MacDonald governs a National Government coalition amidst economic difficulties",
      "ongoing debates over tariffs and trade policy to combat Great Depression impacts",
      "increased tensions in Europe as Nazi Germany consolidates power under Hitler"
    ],
    "politicalClimate": "Britain experiences cautious stability under a National Government, with social unrest simmering due to unemployment and austerity measures",
    "economicConditions": "The Great Depression deeply affects rural estates; many landowners struggle maintaining finances and reduce servant staff",
    "socialIssues": [
      "class divisions sharply felt as traditional aristocratic privileges erode",
      "rise of political activism among working classes and unemployed",
      "gender roles contested subtly as women's workforce participation grows"
    ],
    "internationalNews": [
      "Italy's invasion of Ethiopia raises alarms over fascist aggression",
      "US President Franklin D. Roosevelt’s New Deal programs continue to reshape American economic recovery"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby’s crooning gaining popularity on radio",
        "Duke Ellington’s jazz orchestras touring Europe",
        "British dance bands like Jack Hylton’s Orchestra"
      ],
      "films": [
        "British film 'The Private Life of Henry VIII' (1933) still drawing audiences",
        "American gangster films such as 'The Thin Man' (1934)",
        "early Alfred Hitchcock thrillers showing in London cinemas"
      ],
      "theater": [
        "West End productions of Noël Coward’s plays",
        "revivals of Shakespearean dramas in country houses",
        "variety shows and music halls remaining popular in towns"
      ],
      "radio": [
        "BBC Home Service broadcasts including news, radio plays, and music programs",
        "radio detective dramas beginning to gain listenership",
        "weekly broadcasts of orchestral concerts and talks"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s 'Murder on the Orient Express' (1934) gaining acclaim",
        "Daphne du Maurier’s early short stories appearing in literary magazines",
        "T.S. Eliot’s 'Murder in the Cathedral' first performed in 1935 but in preparation"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "modernist poetry and drama",
        "social realist novels addressing class and economic hardship"
      ]
    },
    "technology": {
      "recentInventions": [
        "improvements in radio receiver designs making home radios more accessible",
        "advances in automobile engineering improving touring car reliability",
        "refinements in typewriter mechanisms increasing typing speed"
      ],
      "commonDevices": [
        "manual typewriters for correspondence and record keeping",
        "party-line domestic telephones with limited privacy",
        "battery-powered portable radios for news and entertainment"
      ],
      "emergingTrends": [
        "growing household adoption of radios replacing newspapers as evening entertainment",
        "automobile ownership expanding in rural gentry families",
        "early use of forensic fingerprinting becoming more routine in criminal investigations"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: 3 pence",
        "a pint of milk: 1.5 pence",
        "servant’s weekly wage: approximately 3-5 shillings"
      ],
      "commonActivities": [
        "morning rides or hunts on estate grounds",
        "afternoon tea with family or guests",
        "evening fireside reading or radio listening"
      ],
      "socialRituals": [
        "formal dinners requiring strict seating and dress codes",
        "Sunday church attendance with attendant social calls"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "landed gentry maintain social distance and authority over servants and villagers",
      "growing awareness of economic vulnerability tempers traditional aristocratic confidence"
    ],
    "gender": [
      "women expected to embody decorum and domestic management skills",
      "men as heads of household and estate stewards",
      "emerging but cautious acceptance of women’s public roles beyond home"
    ],
    "race": [
      "prevailing British attitudes marked by imperialist views and racial hierarchy",
      "limited awareness or representation of racial minorities in rural English estates"
    ],
    "generalNorms": [
      "discretion and reserve govern upper-class interactions, masking tensions",
      "strict observance of social hierarchy in speech and behavior",
      "privacy highly valued, especially regarding family matters and scandals"
    ]
  },
  "atmosphericDetails": [
    "the scent of damp earth and fallen leaves mingling with the faint smoke of estate hearths",
    "the muffled clop of horses’ hooves on wet gravel paths under a heavy mist",
    "the soft crackle of fires in stone hearths punctuating the quiet manor rooms",
    "early darkness lending a shadowy stillness to the manicured gardens and ancient sundials",
    "the low murmur of servants’ footsteps in corridors and distant voices blending with evening radio broadcasts"
  ],
  "paragraphs": [
    "October 1934 in the English countryside brings a cool, damp chill that settles into the bones by mid-afternoon. Mornings often begin with thick fog clinging to the ancient trees and creeping over the estate’s rolling lawns, swallowing the familiar shapes of the sundial and garden statues. The shortening days cast a muted amber glow before dusk descends early, wrapping the manor house in shadows that deepen the sense of quiet reserve and unspoken tension among its residents. This is a season marked by the seasonal rhythms of harvest festivals and fox hunting meets, rituals that still bind the landed gentry to the land despite the economic pressures that whisper through every room.",
    "Fashion in October 1934 reflects a subtle shift from the flamboyance of the Roaring Twenties toward tailored sobriety and practicality, especially in rural aristocratic circles. Men favor earth-toned tweeds and three-piece suits, their collars starched and ties carefully knotted, while women wear bias-cut skirts with silk blouses that combine elegance with modesty. Hats remain essential for public appearances, and accessories like pearl brooches or silver pocket watches underscore the importance of social status. Evening attire demands formality, with subdued colors and refined textures emphasizing restraint over ostentation, mirroring the cautious mood of the times.",
    "Daily life on an estate this autumn is governed by tradition and careful social choreography. Servants move silently through drafty corridors, preparing fires and setting tables for formal dinners where conversation rarely strays beyond polite topics. Morning hunts and afternoon teas punctuate the day, while radio broadcasts provide a modern soundtrack to age-old routines. The lingering effects of the Great Depression are visible in the thinning of staff and the frugal management of resources, fostering an atmosphere where every gesture and word is measured. Social hierarchies remain rigid, yet beneath the surface, uncertainty and subtle shifts in gender and class roles begin to stir, quietly challenging the established order."
  ],
  "note": "All details are carefully curated to reflect October 1934 in a rural English manor setting, with historically accurate weather, fashion, social context, and cultural references to root the mystery firmly in this precise temporal moment.",
  "cost": 0.0034080599999999996,
  "durationMs": 41107
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "The Harcourt family and their close associates are confined within the isolated manor estate during a tense autumn, where rigid class roles and economic strain heighten the pressure to maintain appearances amid growing suspicion.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Sharp class distinctions separate the landed gentry, servants, and local workers, enforcing strict daily routines and formal reserve among the upper class, while the Great Depression strains estate finances and servant employment, amplifying social tensions."
  },
  "setting": {
    "location": "Large country manor estate in the English countryside",
    "institution": "Manor house estate",
    "weather": "Cool, damp autumn with intermittent fog typical of the English countryside"
  },
  "castAnchors": [
    "Evelyn Harcourt",
    "Lord Charles Harcourt",
    "Beatrice Langley",
    "James Harcourt",
    "Agnes Wilkes",
    "Edward Mallory"
  ],
  "theme": "A classic murder mystery exploring the fragile social order and concealed tensions beneath a polished, reserved surface."
}

### LOCKED_FACTS
[
  {
    "id": "sundial_shadow_delay",
    "value": "ten minutes",
    "description": "Delay caused by thermal expansion of sundial’s gnomon at midday."
  },
  {
    "id": "noon_temperature",
    "value": "eighty degrees Fahrenheit",
    "description": "Temperature recorded near sundial at time of death."
  },
  {
    "id": "time_of_death_estimate",
    "value": "half past eleven",
    "description": "Victim’s actual time of death based on corrected sundial timing."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 21,
  "countsByPlacement": {
    "early": 5,
    "mid": 14,
    "late": 1,
    "unknown": 1
  },
  "countsByCriticality": {
    "essential": 19,
    "unknown": 1,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "id": "clue_core_contradiction_chain",
      "placement": "mid",
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
      "category": "physical"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
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
      "category": "temporal"
    },
    {
      "id": "clue_15",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_16",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_17",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_18",
      "category": "testimonial"
    },
    {
      "id": "clue_fp_elimination_edward_mallory",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_james_harcourt",
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

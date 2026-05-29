# Actual Prompt Record

- Run ID: `run_75eb120a-fedd-42f7-a23b-8fe949bc1e80`
- Project ID: `proj_efa63c23-6b20-431a-962e-e7f55377b332`
- Timestamp: `2026-05-29T20:18:49.873Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `257acd1c33c5e960`

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
    "title": "The Tide and the Time: A Seaside Hotel Mystery",
    "author": "CML Specialist",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": [
        "Blood typing standard",
        "Ballistics available",
        "Limited trace evidence analysis",
        "Wartime rationing and blackouts",
        "Post-war social adjustments",
        "Early Cold War paranoia"
      ]
    },
    "setting": {
      "location": "Clifftop Seaside Hotel",
      "place": "Brighton, East Sussex",
      "country": "England",
      "institution": "Seaside hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "timing deception murder"
    }
  },
  "cast": [
    {
      "name": "Linda Gamble",
      "age_range": "30-40",
      "role_archetype": "Guest",
      "relationships": [
        "Friend of Elisabeth Padgett",
        "Acquainted with Robert Eastwood"
      ],
      "public_persona": "Charming socialite with artistic interests",
      "private_secret": "Conceals Cold War espionage sympathies",
      "motive_seed": "Jealousy over undisclosed liaison with victim",
      "motive_strength": "moderate",
      "alibi_window": "Between ten and eleven-thirty pm",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Rooftop terrace",
        "Lobby",
        "Guest corridors"
      ],
      "behavioral_tells": [
        "Unexplained nervous glances at clock",
        "Hesitant answers about whereabouts"
      ],
      "stakes": "Risk of exposure of secret past",
      "evidence_sensitivity": [
        "Clock tampering",
        "Restricted area access"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Robert Eastwood",
      "age_range": "40-50",
      "role_archetype": "Guest",
      "relationships": [
        "Rival of Henry Parkins",
        "Partner of Sharon Sheldon"
      ],
      "public_persona": "Successful businessman with military background",
      "private_secret": "Former intelligence operative concealing past",
      "motive_seed": "Silencing the victim who threatened to expose blackmail",
      "motive_strength": "strong",
      "alibi_window": "Between eleven and midnight",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Staff-only wing",
        "Lobby",
        "Rooftop terrace"
      ],
      "behavioral_tells": [
        "Sudden change in demeanor after murder",
        "Avoids direct questions on timing"
      ],
      "stakes": "Loss of reputation and freedom",
      "evidence_sensitivity": [
        "Restricted wing access",
        "Clock tampering"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Henry Parkins",
      "age_range": "50-60",
      "role_archetype": "Detective",
      "relationships": [
        "Professional acquaintance of Robert Eastwood",
        "Respected by hotel staff"
      ],
      "public_persona": "Sharp-witted private detective",
      "private_secret": "Haunted by wartime loss",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "Present throughout",
      "access_plausibility": "high",
      "opportunity_channels": [
        "All public areas",
        "Staff wing with permission"
      ],
      "behavioral_tells": [
        "Calm observation",
        "Methodical questioning"
      ],
      "stakes": "Professional integrity",
      "evidence_sensitivity": [
        "All available evidence"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Sharon Sheldon",
      "age_range": "25-35",
      "role_archetype": "Guest",
      "relationships": [
        "Partner of Robert Eastwood",
        "Friendly with Linda Gamble"
      ],
      "public_persona": "Young widow with artistic temperament",
      "private_secret": "Conceals resentment toward victim",
      "motive_seed": "Desire to protect Robert Eastwood",
      "motive_strength": "moderate",
      "alibi_window": "Between ten-thirty and eleven-thirty pm",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Lobby",
        "Rooftop terrace"
      ],
      "behavioral_tells": [
        "Avoids rooftop conversations",
        "Stammers when questioned about timing"
      ],
      "stakes": "Protecting loved one",
      "evidence_sensitivity": [
        "Witness statements on timing"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Elisabeth Padgett",
      "age_range": "45-55",
      "role_archetype": "Guest",
      "relationships": [
        "Friend of Linda Gamble",
        "Distant from Robert Eastwood"
      ],
      "public_persona": "Widowed author of historical novels",
      "private_secret": "Knows victim’s true identity",
      "motive_seed": "Fear victim’s knowledge endangers her",
      "motive_strength": "moderate",
      "alibi_window": "At dinner until 10:45 pm",
      "access_plausibility": "low",
      "opportunity_channels": [
        "Dining room",
        "Hallway near staff wing"
      ],
      "behavioral_tells": [
        "Calm but evasive",
        "Keeps watchful eye on hotel clock"
      ],
      "stakes": "Preserving personal safety",
      "evidence_sensitivity": [
        "Clock tampering",
        "Restricted wing access"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Robert Eastwood"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "At a clifftop seaside hotel in Brighton, the enigmatic death of an unnamed guest appears to be timed by a stopped clock showing ten minutes past eleven. Witnesses recall the time matching the clock, but physical evidence from tidal marks on the terrace steps contradicts this timeline. Detective Henry Parkins must unravel the deception of a wound-back clock to expose Robert Eastwood as the culprit, who manipulated time to cover his motive linked to blackmail and Cold War paranoia."
    },
    "accepted_facts": [
      "Victim found dead in private suite late evening",
      "Victim's clock stopped at ten minutes past eleven",
      "Tidal marks on terrace steps inconsistent with time shown on clock",
      "Hotel ledger shows clock serviced three days prior without faults",
      "Scratch on clock winding key indicating recent tampering",
      "Witnesses recall a light signal flash from rooftop terrace",
      "Elevator maintenance log shows recent door mechanism repairs",
      "Staff-only wing access restricted to authorized personnel"
    ],
    "inferred_conclusions": [
      "Clock was wound back after time of death to mislead",
      "Tidal evidence proves victim died earlier than clock indicates",
      "Light signal coordinated murder timing",
      "Robert Eastwood had motive and opportunity",
      "Other suspects' alibis inconsistent with physical evidence"
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murderer wound back the victim’s clock by forty minutes after committing the murder to fabricate an alibi consistent with witnesses’ statements. This temporal deception is revealed by tidal marks on the rooftop terrace steps, which correspond to a different tide level incompatible with the clock’s displayed time. The murderer further exploited a coded light signal from the rooftop lamp to coordinate timing and mislead witnesses. The clock's winding key shows fresh scratches from tampering, and hotel logs confirm the clock was previously faultless. This combination of physical law (tidal timing), social signaling (semaphore flash), and restricted area access conceals the true moment of death and implicates the culprit.",
      "delivery_path": [
        {
          "step": "Victim’s clock stopped at 11:10 pm but tidal marks indicate earlier death"
        },
        {
          "step": "Clock winding key found scratched, indicating recent tampering"
        },
        {
          "step": "Witnesses notice single brief rooftop lamp flash interpreted as distress"
        },
        {
          "step": "Semaphoric code decoded from lamp flash indicates accomplice arrival"
        },
        {
          "step": "Hotel ledger shows no prior clock faults; tampering must be recent"
        }
      ]
    },
    "outcome": {
      "result": "Robert Eastwood is revealed as the sole culprit who manipulated the clock and coordinated the timing via the rooftop signal to mask his murder of the victim, exploiting the tidal timing to create a false alibi."
    }
  },
  "false_assumption": {
    "statement": "The victim’s time of death corresponds exactly to the stopped clock time of ten minutes past eleven, as confirmed by witness statements.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock was found stopped at that time, and multiple witnesses recall events consistent with that timing, making it appear as the definitive time of death.",
    "what_it_hides": "The clock was deliberately wound back after the murder to create a misleading timeline; tidal evidence and physical traces contradict this assumed time of death."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Victim’s clock stopped at 11:10 pm",
        "Tidal charts for Brighton on murder night",
        "Witness statements about rooftop lamp flash timing",
        "Hotel ledger showing clock maintenance three days prior"
      ],
      "windows": [
        "Murder occurred between 10:15 pm and 10:40 pm",
        "Clock tampering occurred shortly after murder",
        "Rooftop lamp flash between 10:30 pm and 10:45 pm"
      ],
      "contradictions": [
        "Clock time vs tidal mark levels on terrace steps",
        "Witness recall of time vs physical tidal evidence",
        "Clock maintenance records vs fresh winding key scratches"
      ]
    },
    "access": {
      "actors": [
        "Robert Eastwood",
        "Linda Gamble",
        "Sharon Sheldon",
        "Elisabeth Padgett",
        "Hotel staff"
      ],
      "objects": [
        "Victim’s clock and winding key",
        "Rooftop terrace lamp",
        "Elevator with recently repaired door mechanism"
      ],
      "permissions": [
        "Restricted access to staff-only wing",
        "Rooftop terrace accessible to guests after 10 pm",
        "Elevator access controlled by staff"
      ]
    },
    "physical": {
      "laws": [
        "Tidal levels correspond to precise times per official charts",
        "Clock mechanism cannot stop and restart without external winding",
        "Light signals from rooftop follow established semaphore codes"
      ],
      "traces": [
        "Scratches on clock winding key",
        "Tidal water marks on terrace steps",
        "Lens smudge on rooftop lamp shaped like semaphore letter"
      ]
    },
    "social": {
      "trust_channels": [
        "Guest witness statements",
        "Hotel staff gatekeeping of restricted areas",
        "Guest diary entries noting rooftop activity"
      ],
      "authority_sources": [
        "Hotel ledger and maintenance logs",
        "Police investigation records",
        "Semaphore code reference materials"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The terrace steps show tidal water marks inconsistent with the clock time of ten minutes past eleven, indicating a lower tide level matching an earlier time.",
        "correction": "Since tidal charts confirm water levels at ten minutes past eleven should be higher, the victim’s death must have occurred earlier than the clock shows.",
        "effect": "Narrows time of death window to before ten minutes past eleven, contradicting the clock time.",
        "required_evidence": [
          "Victim’s clock stopped at 11:10 pm",
          "Tidal charts for Brighton on murder night",
          "Tidal water marks on terrace steps"
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock’s winding key has fresh scratches inconsistent with normal use and the hotel ledger shows no recent faults in the clock.",
        "correction": "The scratches indicate deliberate recent tampering of the clock, meaning the stopped time was manipulated after the murder.",
        "effect": "Eliminates innocent clock failure as cause, confirming tampering to mislead timeline.",
        "required_evidence": [
          "Hotel ledger showing clock maintenance three days prior",
          "Scratch marks on clock winding key",
          "Victim’s clock stopped at 11:10 pm"
        ],
        "reader_observable": true
      },
      {
        "observation": "Guests report a single brief flash from the rooftop lamp at approximately ten-thirty pm, initially interpreted as a distress signal.",
        "correction": "Partial semaphore code keys found in the victim’s study and a lens smudge on the lamp reveal the flash was a deliberate coded signal coordinating timing.",
        "effect": "Narrows timing coordination window and suggests accomplice involvement.",
        "required_evidence": [
          "Guest diary noting rooftop lamp flash",
          "Partial semaphore code keys found in victim’s study",
          "Lens smudge on rooftop lamp shaped like semaphore letter"
        ],
        "reader_observable": true
      },
      {
        "observation": "Elevator maintenance logs show recent repairs to the door mechanism enabling delayed door release; a faint grease smudge near the elevator shaft is found.",
        "correction": "This allowed near-silent passage past victim’s floor, enabling culprit access and escape without witness detection around the false clock time.",
        "effect": "Eliminates suspects lacking access to restricted wing and elevator manipulation knowledge.",
        "required_evidence": [
          "Elevator maintenance log showing recent door repairs",
          "Faint grease smudge on floor near elevator shaft",
          "Access permissions to restricted staff wing"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled reenactment simultaneously compares the victim’s stopped clock time, tidal water marks at identical terrace steps, and the rooftop lamp semaphore signals under observation, proving that only a tampered clock and coordinated signal can explain the timing contradictions evidenced by the scratched winding key and maintenance logs.",
    "knowledge_revealed": "This test confirms that the clock was deliberately wound back after the murder and that the rooftop semaphore flash was used to coordinate the murder timing, exposing Robert Eastwood’s manipulation and eliminating all other suspects with inconsistent alibis.",
    "pass_condition": "The reenactment replicates the tidal mark level at the supposed clock time and reproduces the semaphore signal flash, demonstrating the impossibility of the victim dying at the clock time without tampering.",
    "evidence_clues": [
      "clue_9",
      "clue_1",
      "clue_10"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The tide level marks and tidal charts (early clues) expose the temporal contradiction with the clock. Step 2: The scratched winding key and maintenance ledger (mid clues) prove clock tampering. Step 3: Semaphore clues from the guest diary and lamp smudge (mid clues) reveal coordination. Step 4: Elevator repair logs and smudges (late clues) restrict access. The discriminating test synthesizes these visible clues to confirm Robert Eastwood’s guilt."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 3,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 3,
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
        "Execute the reenactment comparing clock time, tidal marks, and semaphore flash",
        "Observe the contradiction between natural tides and stopped clock",
        "Confirm the semaphore signal coding and timing coordination",
        "Conclude Robert Eastwood’s guilt with no reasonable doubt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Linda Gamble",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by guest diary and lobby witness statements",
        "supporting_clues": [
          "Guest diary noting Linda Gamble’s lobby presence",
          "Lobby guest witness statements"
        ]
      },
      {
        "suspect_name": "Sharon Sheldon",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by dinner time records and lack of rooftop presence",
        "supporting_clues": [
          "Dining room log",
          "Witnesses noting Sharon’s absence from rooftop"
        ]
      },
      {
        "suspect_name": "Elisabeth Padgett",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Presence in dining room during critical time window and limited access to staff wing",
        "supporting_clues": [
          "Dining room attendance records",
          "Hotel access logs"
        ]
      },
      {
        "suspect_name": "Henry Parkins",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Continuous presence as detective with documented observations",
        "supporting_clues": [
          "Detective’s observation notes",
          "Staff acknowledgments"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with physical evidence and reenactment results"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_core_contradiction_chain",
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
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_robert_eastwood",
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
    "name": "Linda Gamble",
    "summary": "Linda Gamble is the composed and capable hotel manager whose polished exterior conceals a desperate secret that threatens her career and the hotel’s future.",
    "publicPersona": "Linda is the embodiment of professionalism, managing the clifftop hotel with an efficient hand and calm demeanor that earns her the respect and affection of staff and guests alike. Her steady presence is the backbone of the establishment, always quick with a reassuring word or a precise instruction.",
    "privateSecret": "Years ago, Linda covered up a serious accident involving a guest—a scandal that could have shuttered the hotel and ended her career. The victim of the current tragedy had threatened to expose this secret, placing Linda in a perilous position.",
    "motiveSeed": "With the hotel’s lucrative government contract hanging in the balance, Linda saw silencing the victim as the only way to protect everything she had built. The threat of exposure was a direct threat to the hotel’s survival and her own reputation.",
    "motiveStrength": "compelling",
    "alibiWindow": "She claims to have been overseeing the kitchen staff between 8 and 9 PM, though no direct witness can confirm her continuous presence throughout that hour.",
    "accessPlausibility": "easy",
    "stakes": "The survival of the hotel and her professional standing depend on keeping her past buried.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "Linda speaks with calm precision, often choosing measured words and a formal tone. She employs subtle understatement, rarely raising her voice but letting her dry wit slip through in carefully placed remarks, especially when deflecting intrusive questions.",
    "internalConflict": "Linda wrestles with guilt over the cover-up and the moral weight of potentially committing a greater crime to protect her secret. Her loyalty to the hotel clashes with the fear of losing everything if the truth emerges.",
    "personalStakeInCase": "This murder strikes at the heart of her life’s work; exposing the truth would not only ruin her but could close the hotel, leaving her with nothing.",
    "paragraphs": [
      "Linda Gamble runs the Clifftop Seaside Hotel with an air of quiet authority. She moves through the corridors with assured steps, her eyes always alert, balancing the demands of guests and staff with seamless grace. To the outside world, she is the very picture of competence and composure, the kind of manager who reassures anxious visitors with a firm handshake and a steady smile.",
      "But beneath this polished surface lies a secret that gnaws at her conscience. Years ago, a grave accident involving a guest could have spelled disaster for the establishment and ended Linda’s career before it truly began. She chose to bury the truth, a decision that now threatens to unravel everything she has worked for. The victim of the current mystery had threatened to bring this scandal to light, forcing Linda into a desperate corner.",
      "Her alibi is carefully constructed: she claims to have been overseeing the kitchen staff during the critical hour, a time when the fatal act occurred. Yet no one can vouch for her presence the entire time. Such gaps in her story only deepen the suspicion around her, though she maintains a calm exterior, skillfully deflecting probing questions with understated remarks that hint at more than she reveals.",
      "Linda’s humor is subtle and dry, a defense mechanism honed over years of managing crises. She rarely jokes outright but uses understatement to deflate tension, often delivering lines that are quietly sardonic, leaving listeners to read between the lines. This style complements her formal speech and measured tone, making her a figure both admired and enigmatic.",
      "Her internal struggle is profound. She is torn between the desire to protect the hotel and the guilt of past misdeeds that now threaten to consume her. The fear that the investigation could expose her cover-up clashes with the instinct to confess and seek redemption, a battle she fights silently as the tide of suspicion rises.",
      "Ultimately, the case is more than a professional challenge for Linda—it is a personal crucible. The hotel is her legacy, and the murder threatens to shatter the fragile world she has built. How she chooses to face the truth will define her future, forcing her to confront the shadows of her past or continue the dangerous facade she has maintained for so long."
    ],
    "order": 1
  },
  {
    "name": "Robert Eastwood",
    "summary": "Robert Eastwood is a dignified retired naval officer whose honorable facade masks a haunted past and a desperate need to protect a tarnished legacy.",
    "publicPersona": "A gentleman of stature and respect, Robert carries himself with the decorum of a seasoned military man. His conversations often turn to themes of honor and duty, making him a familiar and esteemed presence at the hotel’s social gatherings.",
    "privateSecret": "Behind this veneer lies a secret wartime scandal involving a failed operation buried by his superiors. The victim knew of this and was blackmailing Robert, threatening to ruin his pension and reputation.",
    "motiveSeed": "Robert considered the blackmail a greater threat than any public trial. The prospect of losing his honor and financial security drove him toward drastic measures to silence the victim permanently.",
    "motiveStrength": "strong",
    "alibiWindow": "He claims to have been on the rooftop terrace between 8:30 and 9 PM, but there were few guests around to confirm his presence.",
    "accessPlausibility": "possible",
    "stakes": "His personal honor, financial security, and the legacy he hopes to leave behind are all at risk.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Robert’s speech is formal yet peppered with a dry, sometimes ironic wit. He favors precise language and military cadence but occasionally slips into sardonic quips that reveal his skepticism about the world and his own past.",
    "internalConflict": "He is tormented by the contradiction between his public image as a man of honor and the shameful secrets he harbors. The weight of his past actions and the fear of exposure gnaw at his conscience.",
    "personalStakeInCase": "This case threatens not just his livelihood but the very reputation he has spent a lifetime building—a reckoning with his past he is unprepared to face openly.",
    "paragraphs": [
      "Robert Eastwood presents himself as the archetype of the retired naval officer: dignified, composed, and steeped in the values of honor and duty. He is a familiar figure in the hotel’s social circles, often regaling guests with stories of service and leadership, his presence lending an air of gravitas to gatherings.",
      "Yet beneath this cultivated image lies a man haunted by a wartime operation gone awry, a scandal that was buried by those above him. The victim’s knowledge of this secret and their subsequent blackmail placed Robert in a perilous position. The threat to his pension and reputation was intolerable, and the prospect of public disgrace loomed large.",
      "His alibi situates him on the rooftop terrace during the crucial half-hour, a location with scant witnesses. His demeanor remains calm but guarded, his words measured and deliberate. He deploys a dry wit that sometimes borders on sardonic, using irony to distance himself from uncomfortable truths.",
      "Robert’s speech carries the cadence of a military man: formal, precise, and disciplined. Yet his humor, though restrained, surfaces in moments of tension as a means of coping with the contradictions in his life. His ironic quips often mask a deeper cynicism about the ideals he once upheld.",
      "Internally, Robert battles the chasm between the honorable man he portrays and the shameful secrets he hides. The fear of exposure threatens to dismantle his carefully constructed identity, leaving him vulnerable to the judgment he has long avoided.",
      "For Robert, this investigation is no mere professional inconvenience; it is a personal reckoning. The outcome will determine whether he can preserve the legacy of his service or be consumed by the shadows of his past."
    ],
    "order": 2
  },
  {
    "name": "Henry Parkins",
    "summary": "Henry Parkins is an ambitious young chef whose passion for culinary excellence is overshadowed by dangerous debts and desperate choices.",
    "publicPersona": "Henry is known among the hotel staff as a dedicated and passionate chef, eager to make a name in the post-war culinary world. Though friendly, he maintains a certain reserve, focused on his craft and career advancement.",
    "privateSecret": "He is burdened by a gambling debt owed to unsavory characters and was being blackmailed by the victim to repay the money or suffer dire consequences.",
    "motiveSeed": "Faced with the threat of ruin and criminal charges, Henry saw murder as a desperate means of escape from a spiraling nightmare that jeopardized both his career and freedom.",
    "motiveStrength": "strong",
    "alibiWindow": "He states he was busy prepping meals in the kitchen between 8 and 9 PM, with only a junior kitchen assistant partially confirming his presence.",
    "accessPlausibility": "possible",
    "stakes": "His future as a chef and his personal freedom hang in the balance.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Henry speaks with a youthful enthusiasm tempered by occasional self-deprecating remarks. His tone is informal, sometimes nervous, and he often uses culinary metaphors or jokes to lighten tense moments.",
    "internalConflict": "He struggles with guilt over his debts and the desperate measures he considered, torn between protecting his future and facing the consequences of his actions.",
    "personalStakeInCase": "The crime threatens to end not just his career but his very freedom; his involvement would mean losing everything he has worked toward.",
    "paragraphs": [
      "Henry Parkins is the hotel’s young and ambitious chef, a man driven by a passion for his craft and the dream of making a mark in the culinary world. His dedication is evident in the care he takes with every dish, and though he is somewhat reserved, his friendliness endears him to the kitchen staff.",
      "Yet behind his professional zeal lies a dangerous secret: a mounting gambling debt to unsavory characters. The victim exploited this weakness, blackmailing Henry to repay the debt under threat of exposure and ruin. The pressure weighed heavily on him, pushing him toward desperate thoughts.",
      "His alibi places him in the kitchen during the hour of the murder, busy with meal preparations. Only a junior assistant can partially confirm his presence, leaving gaps that invite suspicion. Henry’s nervous energy surfaces in his speech, where he peppers conversations with culinary jokes and self-deprecating humor to ease discomfort.",
      "His manner of speaking is informal and peppered with youthful enthusiasm, though tinged with occasional anxiety. He often uses food-related metaphors, a habit that reveals both his identity and his attempt to make light of grim situations.",
      "Internally, Henry wrestles with guilt and fear. The debts and threats have forced him into a moral quandary—whether to protect himself by hiding the truth or to face the consequences and seek redemption. This tension colors his every interaction and decision.",
      "For Henry, the stakes could not be higher. The outcome of this investigation will determine whether he can salvage his career and freedom or be consumed by the shadows of his past mistakes."
    ],
    "order": 3
  },
  {
    "name": "Sharon Sheldon",
    "summary": "Sharon Sheldon is a sharp and persistent journalist whose professional rivalry and pursuit of truth complicate the unfolding mystery.",
    "publicPersona": "A tenacious investigative reporter, Sharon is known for her incisive questions and relentless pursuit of inconvenient truths. She commands respect and wariness in equal measure within the hotel’s social milieu.",
    "privateSecret": "She had a confidential source inside the hotel who was killed in the incident and was on the verge of publishing a story implicating insiders in corruption.",
    "motiveSeed": "Her rivalry with the victim over a potentially career-ruining scoop fuels professional jealousy, though her motives are more about competition than a desire to kill.",
    "motiveStrength": "moderate",
    "alibiWindow": "She was interviewing guests in the lobby from 8 to 9 PM, with several witnesses confirming her presence.",
    "accessPlausibility": "unlikely",
    "stakes": "Her professional reputation and the exclusive story that could make or break her career.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Sharon's speech is sharp, quick, and laced with polite but cutting remarks. She often employs pointed questions and subtle barbs, using a tone that is both engaging and slightly intimidating, revealing her journalistic edge.",
    "internalConflict": "She grapples with the ethical implications of her rivalry and the consequences of her pursuit of the story, questioning whether ambition justifies the risks involved.",
    "personalStakeInCase": "The unfolding story could define her career, making this case a pivotal moment between professional triumph and ruin.",
    "paragraphs": [
      "Sharon Sheldon strides through the hotel lobby with purposeful steps, her keen eyes missing little. As an investigative journalist, she thrives on uncovering hidden truths and exposing corruption, a reputation that precedes her in social circles. Her incisive questions and persistent nature often unsettle those around her, but they also command respect.",
      "Her confidential source within the hotel was tragically among the victims, a loss that cuts deeply and fuels her determination to get to the bottom of the mystery. Sharon was on the cusp of breaking a story that implicated several insiders in corruption, a scoop that had already sparked a rivalry with the victim over who would publish first.",
      "Her alibi is solid, supported by multiple witnesses who saw her interviewing guests in the lobby during the critical hour. Access to the crime scene is unlikely for her given her public presence, but her professional jealousy introduces complexity to her motives.",
      "Sharon’s humor is a weapon of polite savagery. Her remarks are often barbed yet delivered with a veneer of civility, a style that unsettles interviewees and colleagues alike. Her speech is rapid, sharp, and imbued with a journalistic edge that cuts through pretense and evasion.",
      "Internally, she wrestles with the fine line between ambition and ethics. The rivalry with the victim and the stakes of the story force her to question how far she is willing to go to achieve professional success. This tension adds depth to her relentless pursuit of the truth.",
      "For Sharon, the case is more than a story—it is a defining moment. The outcome could cement her reputation as a fearless reporter or tarnish it irrevocably, making every discovery and decision fraught with consequence."
    ],
    "order": 4
  },
  {
    "name": "Elisabeth Padgett",
    "summary": "Elisabeth Padgett is a charming but strained socialite whose desperate attempt to preserve her fragile standing leads her into dangerous territory.",
    "publicPersona": "Elegant and graceful, Elisabeth carries the air of a once-celebrated aristocrat now visibly marked by financial and social setbacks. Her charm masks the strain of recent hardships, making her a figure both admired and pitied.",
    "privateSecret": "She had a secret affair with the victim, a scandal that, if revealed, would devastate her social standing and cut off vital family support.",
    "motiveSeed": "The victim’s threat to expose their past liaison was a direct assault on Elisabeth’s social survival, pushing her toward a desperate act to protect what little remained.",
    "motiveStrength": "compelling",
    "alibiWindow": "She claims to have been resting in her suite due to illness, but a hotel maid places her near the restricted staff wing shortly before the murder.",
    "accessPlausibility": "possible",
    "stakes": "Her social status and financial security depend on keeping her secret safe.",
    "humourStyle": "observational",
    "humourLevel": 0.3,
    "speechMannerisms": "Elisabeth speaks with refined elegance, her tone measured and often tinged with a subtle melancholy. She has a habit of making wry observations about society and her own predicament, delivering them with a gentle, sometimes wistful irony.",
    "internalConflict": "She struggles to reconcile her desire to maintain dignity with the fear of exposure and the consequences of her hidden past.",
    "personalStakeInCase": "The investigation threatens to unmask her secret affair, jeopardizing her already fragile social position and financial lifeline.",
    "paragraphs": [
      "Elisabeth Padgett moves through the hotel with the poise of a woman accustomed to admiration, though the sparkle in her eyes is dimmed by recent misfortunes. Once a celebrated socialite, the war and its aftermath have left her financially strained and socially vulnerable, a reality she conceals beneath layers of charm and elegance.",
      "Her secret affair with the victim is a shadow that stretches over her present, a scandal that could destroy the remnants of her standing if revealed. The victim’s threats to expose this liaison pushed Elisabeth into a desperate state, where preserving her reputation became a matter of survival.",
      "While she claims to have been resting in her suite due to illness during the time of the murder, a maid’s testimony places her near the restricted staff wing shortly before the incident, casting doubt on her alibi. This discrepancy adds a layer of intrigue to her role in the mystery.",
      "Elisabeth’s speech is marked by refined elegance and a gentle melancholy. She often makes wry, observational remarks about the social world she inhabits and the ironies of her situation, her tone tinged with wistful irony that invites sympathy even as it hints at deeper turmoil.",
      "Her internal conflict revolves around the tension between maintaining dignity and confronting the potential fallout of her past. The fear of exposure battles with a stubborn pride that refuses to yield, creating a poignant struggle beneath her composed exterior.",
      "For Elisabeth, the stakes are intensely personal. The investigation threatens to unearth a secret that could sever her from the social and financial support she desperately needs, forcing her to confront the precariousness of her existence and the lengths she will go to protect it."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "The Cliffhaven Hotel",
    "type": "Seaside hotel",
    "place": "St. Ives Bay, Cornwall",
    "country": "England",
    "summary": "An imposing Art Deco hotel perched on a coastal cliff, offering commanding views of the English Channel and sheltering guests in a blend of post-war elegance and lingering tensions.",
    "visualDescription": "A multi-story, cream-rendered building with nautical reliefs in polished chrome and frosted glass, featuring a grand arched entrance with etched porthole windows, sweeping staircases with brass railings, and a rooftop terrace bordered by wrought iron balustrades overlooking the sea.",
    "atmosphere": "The hotel balances refined 1940s luxury with the muted anxiety of the post-war era, its interiors glowing with warm light from period lamps and the occasional flicker of early television screens, while outside the persistent sea mist softens edges and muffles sounds.",
    "paragraphs": [
      "The Cliffhaven Hotel stands proudly on the rugged cliffs of St. Ives Bay, its Art Deco façade punctuated by nautical motifs that evoke the nearby sea’s enduring presence. The grand entrance, framed by etched glass portholes and polished chrome, opens into a spacious lobby where rich mahogany paneling and deep-green velvet upholstery create a warm refuge from the damp, salty air beyond. Guests gather quietly amid brass lampshades and the soft murmur of a crackling radio broadcast, the muted tones of wartime ballads blending with the occasional cough or whispered conversation.",
      "Ascending the sweeping staircases, visitors encounter corridors lined with framed seascapes and maritime charts, their polished floors reflecting the glow of wall sconces. The staff-only wing, hidden behind a heavy oak door with a brass plaque, is guarded by vigilant supervisors who enforce strict access controls. Narrow stairwells and a single elevator create natural choke points that complicate movement, especially when fog rolls in thick from the channel, wrapping the hotel in a shroud of quiet uncertainty.",
      "Atop the building, the rooftop terrace offers panoramic views of the churning sea and distant radar installations blinking faintly in the dusk. Here, guests sometimes seek solitude or furtive meetings, the sound of waves crashing against the cliffs below mixing with the distant calls of seabirds. The hotel’s isolation is underscored by the limited road access winding down to the village and the infrequent public bus service, meaning that inclement weather can delay arrivals and departures, leaving the hotel temporarily cut off from the mainland.",
      "Inside, the atmosphere is one of cozy elegance tinged with subtle unease. The post-war social shifts are visible in the increased presence of female staff moving efficiently through their duties, while guests carry the weight of recent conflicts in their guarded conversations. Early television sets flicker in the lounge, offering brief distraction, but the persistent sea mist and the distant, rhythmic pulse of coastal defense radar serve as constant reminders of the broader world’s tensions."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "cool, damp sea air with intermittent fog rolling in from the channel, creating a muted, muffled soundscape",
    "timeFlow": "Three days of mounting tension with moments of quiet reflection and sudden revelations",
    "mood": "cozy yet tinged with post-war unease, guests mingle quietly while the underlying tension of recent conflicts and emerging geopolitical anxieties subtly influence conversations",
    "eraMarkers": [
      "radio broadcasts common in guest rooms",
      "early television sets rare but present in hotel lounge post-war",
      "basic radar technology used in nearby coastal defense",
      "automobiles subject to wartime fuel rationing and blackout restrictions",
      "limited public bus service connecting town and hotel",
      "private boats occasionally used for coastal access",
      "long-distance telephone calls possible but often expensive and monitored"
    ],
    "sensoryPalette": {
      "dominant": "salt-tinged sea mist and damp stone",
      "secondary": [
        "faint crackle of radio broadcasts",
        "warm glow of period brass lamps"
      ]
    },
    "paragraphs": [
      "The Cliffhaven Hotel’s atmosphere is saturated with the pervasive presence of the sea. The cool, damp air carries a briny tang that clings to the skin and settles into the heavy woolen fabrics of coats and curtains alike. Fog drifts in from the channel, softening edges and swallowing distant sounds in a hushed veil. Inside, the low hum of a radio broadcast blends with the occasional murmur of conversation and the steady ticking of mantel clocks, creating a soundtrack that is at once comforting and quietly suspenseful.",
      "The interplay between the hotel’s warm interior and the chill, mist-laden exterior heightens the sense of isolation and fragile safety. Guests wrapped in shawls or pressed into thick wool sweaters gather in the lobby beneath brass sconces, their faces illuminated by the flicker of early television sets in the lounge. Outside, the faint blinking of radar stations on the cliff’s edge punctuates the night, a reminder of the ongoing war’s shadow even as the hotel offers a temporary sanctuary."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Hotel Rooftop Terrace",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A windswept terrace bordered by wrought iron balustrades, flagstones slick with sea spray, and scattered wooden deck chairs facing the turbulent channel; a nearby radar station’s faint blinking lights visible on the cliff edge.",
      "sensoryDetails": {
        "sights": [
          "fog-shrouded sea horizon",
          "blink of distant radar lights",
          "damp flagstone flooring",
          "glossy wrought iron railings",
          "weathered wooden deck chairs"
        ],
        "sounds": [
          "crashing waves below cliffs",
          "distant seabird calls",
          "whistling sea breeze",
          "soft clink of metal railings",
          "muffled footsteps on stone"
        ],
        "smells": [
          "sharp salt spray",
          "wet stone and seaweed",
          "briny ocean air",
          "cool damp moss",
          "faint coal smoke from nearby chimneys"
        ],
        "tactile": [
          "chill wind biting skin",
          "rough wrought iron railings",
          "cold damp flagstones",
          "weathered wood grain",
          "slippery moss patches"
        ]
      },
      "accessControl": "Accessible only during daylight and early evening hours; hotel staff restrict access after curfew; occasional guest presence under supervision; emergency exits monitored and alarmed.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-slick flagstones",
            "grey mist over sea",
            "water beading on railings"
          ],
          "sounds": [
            "steady rain patter",
            "distant thunder rumble",
            "water dripping from eaves"
          ],
          "smells": [
            "wet stone",
            "salty dampness",
            "fresh sea spray"
          ],
          "mood": "gloomy and oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light",
            "shadows softened by mist",
            "dull sea surface"
          ],
          "sounds": [
            "distant crashing waves",
            "whispering wind",
            "occasional seabird cry"
          ],
          "smells": [
            "briny sea air",
            "damp moss",
            "faint coal smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "crisp sea horizon",
            "twinkling radar lights",
            "long shadows on flagstones"
          ],
          "sounds": [
            "soft lapping waves",
            "quiet footsteps"
          ],
          "smells": [
            "cool salt air",
            "damp stone",
            "smoky wood fire"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The rooftop terrace crowns the Cliffhaven Hotel with panoramic views of the restless English Channel, its flagstones darkened by sea spray and weathered by years of salt and wind. Wrought iron railings encircle the space, their glossy black paint chipped in places to reveal rust beneath. Wooden deck chairs, faded and worn, are scattered unevenly, some turned askew as if hastily abandoned. The terrace is a place of solitude for some, but also a setting for secrets—its isolation and exposure make it a prime spot for clandestine meetings or sudden violence.",
        "The constant presence of the sea is tangible here: the sharp tang of salt in the air, the relentless crashing of waves against the cliff base, and the low whistle of the wind all combine to create an atmosphere both invigorating and unsettling. The faint blinking of the nearby coastal radar station’s lights adds a modern, almost eerie pulse to the scene, a reminder of the war’s lingering shadow and the vigilance it demands."
      ]
    },
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious hall with polished mahogany paneling, deep green velvet armchairs, brass sconces casting warm pools of light, and a large reception desk topped with a polished oak counter; windows framed by heavy wool curtains looking out to the cliffside gardens.",
      "sensoryDetails": {
        "sights": [
          "glossy mahogany paneling",
          "flickering brass sconces",
          "deep green velvet upholstery",
          "etched glass porthole windows",
          "polished oak reception counter"
        ],
        "sounds": [
          "soft murmur of conversations",
          "rustle of woolen coats",
          "steady ticking of a wall clock",
          "pages flipping quietly",
          "distant radio broadcast crackle"
        ],
        "smells": [
          "beeswax polish",
          "wool and leather",
          "faint tobacco smoke",
          "damp sea air filtered through windows",
          "aged paper from guest registers"
        ],
        "tactile": [
          "smooth polished wood surfaces",
          "soft velvet armrests",
          "cool brass fittings",
          "heavy wool curtains",
          "coarse woven rugs"
        ]
      },
      "accessControl": "Open to guests during daytime and early evening; curfew enforced after 10pm with limited access; staff present continuously; visitors must register at reception and be accompanied.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through curtains",
            "wet footprints on rugs",
            "misted windowpanes"
          ],
          "sounds": [
            "rain tapping on windows",
            "soft footsteps on rugs",
            "distant radio news bulletin"
          ],
          "smells": [
            "damp wool",
            "freshly polished wood",
            "tea brewing scent"
          ],
          "mood": "quiet and reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "muted daylight",
            "shadows pooling in corners",
            "glint of brass fittings"
          ],
          "sounds": [
            "low murmur of voices",
            "clock ticking steadily",
            "soft page turning"
          ],
          "smells": [
            "beeswax polish",
            "faint tobacco",
            "wool fabric"
          ],
          "mood": "calm with underlying tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm lamp glow",
            "long shadows on floor",
            "reflections on polished wood"
          ],
          "sounds": [
            "quiet conversation",
            "mantel clock ticking",
            "distant footsteps on stairs"
          ],
          "smells": [
            "candle wax",
            "leather-bound books",
            "sea air faintly"
          ],
          "mood": "welcoming yet watchful"
        }
      ],
      "paragraphs": [
        "The grand lobby of the Cliffhaven Hotel is a sanctuary from the damp chill outside. Polished mahogany walls gleam softly under the glow of brass sconces, their light dancing across deep green velvet armchairs where guests sit wrapped in thick coats. The large reception desk, with its smooth oak surface, serves as the hub of activity, where staff register arrivals and monitor comings and goings. Outside, the heavy wool curtains frame views of the cliffside gardens, their greenery muted by the persistent sea mist.",
        "Sounds here are softened by thick rugs and heavy curtains: the murmur of quiet conversation, the rustle of wool, and the steady ticking of a wall clock create a soothing backdrop. The faint crackle of a radio broadcast drifts from a nearby corner, carrying news and music that connect guests to the wider world. The lobby’s layout allows vigilant staff to observe entrances and key corridors, making it a natural choke point for movement and a place where secrets can be overheard or concealed in plain sight."
      ]
    },
    {
      "id": "staff_wing",
      "name": "Staff-Only Wing",
      "type": "interior",
      "purpose": "Restricted access, staff quarters and workspaces",
      "visualDetails": "Narrow, dimly lit corridors with utilitarian tiled floors and painted plaster walls, lined with doors to small rooms including the kitchen, laundry, and staff dormitories; heavy fire doors and keypad-locked entrances restrict guest access.",
      "sensoryDetails": {
        "sights": [
          "flickering fluorescent tubes",
          "plain whitewashed walls",
          "metal kitchen equipment",
          "stacked linen carts",
          "closed heavy fire doors"
        ],
        "sounds": [
          "clatter of pots and pans",
          "whir of laundry machines",
          "muffled voices and footsteps",
          "distant elevator bell",
          "rustling of uniforms"
        ],
        "smells": [
          "soap and bleach",
          "hot grease and cooking herbs",
          "starch and damp linen",
          "faint tobacco smoke",
          "cleaning fluids"
        ],
        "tactile": [
          "cold tiled floors",
          "rough cotton uniforms",
          "smooth metal handles",
          "heavy wooden doorframes",
          "warm kitchen heat"
        ]
      },
      "accessControl": "Strictly limited to authorized staff with badges; guests forbidden except escorted by management; supervisors monitor movement closely; emergency exits alarmed and locked.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim corridor lighting",
            "wet footprints on floor",
            "steam rising in kitchen"
          ],
          "sounds": [
            "splashing water",
            "clinking dishes",
            "laundry machine hum"
          ],
          "smells": [
            "wet cotton",
            "freshly cooked breakfast aromas",
            "cleaning fluid"
          ],
          "mood": "busy and purposeful"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat fluorescent glow",
            "shadows under doors",
            "stacked linen piles"
          ],
          "sounds": [
            "soft chatter",
            "clanging kitchen utensils",
            "footsteps on tile"
          ],
          "smells": [
            "soap and starch",
            "faint grease",
            "damp cloth"
          ],
          "mood": "efficient but tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "low corridor lighting",
            "closed kitchen doors",
            "empty laundry carts"
          ],
          "sounds": [
            "distant voices",
            "quiet footsteps",
            "clinking glassware"
          ],
          "smells": [
            "lingering cooking scents",
            "fresh soap",
            "cool night air"
          ],
          "mood": "quiet anticipation"
        }
      ],
      "paragraphs": [
        "The staff-only wing of the Cliffhaven Hotel is a world apart from the guest areas, defined by narrow, utilitarian corridors that hum with the constant activity of service. Fluorescent lights flicker intermittently, casting stark shadows on whitewashed walls and tiled floors that bear the marks of countless footsteps. Doors to the kitchen, laundry, and staff dormitories line the hall, each secured by heavy fire doors or keypad locks that enforce the strict separation from guest spaces.",
        "Sounds here are a symphony of domestic industry: the clatter of pots, the whirl of laundry machines, and the rustle of starched uniforms. The air carries the mingled scents of soap, bleach, cooking herbs, and starch, creating an atmosphere both clean and intense. Movement is carefully monitored by supervisors, and the wing’s layout—with its choke points and locked exits—makes unauthorized access difficult, ensuring that secrets held here remain well guarded."
      ]
    },
    {
      "id": "library",
      "name": "Hotel Library",
      "type": "interior",
      "purpose": "Clue discovery and quiet retreat",
      "visualDetails": "A cozy room lined with dark oak bookcases filled with leather-bound volumes, a fireplace framed by carved stone mantel, deep armchairs upholstered in faded burgundy velvet, and heavy curtains drawn against the chill sea air.",
      "sensoryDetails": {
        "sights": [
          "glossy leather spines",
          "flickering firelight",
          "dust motes in beams",
          "carved stone mantelpiece",
          "heavy velvet curtains"
        ],
        "sounds": [
          "crackling fireplace",
          "soft rustle of pages",
          "quiet footsteps on carpet",
          "distant clock ticking",
          "low murmured voices"
        ],
        "smells": [
          "aged paper and leather",
          "smoke and burnt wood",
          "wool and dust",
          "faint perfume of sea air",
          "wax polish"
        ],
        "tactile": [
          "soft velvet upholstery",
          "rough leather book covers",
          "smooth carved wood",
          "warm stone hearth",
          "plush carpet fibers"
        ]
      },
      "accessControl": "Open to guests during daytime hours; closed after 9pm; staff supervise entry; quiet space with restricted movement to preserve calm and order.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light through curtains",
            "firelight flicker",
            "rain-streaked windows"
          ],
          "sounds": [
            "rain tapping softly",
            "pages turning",
            "fire crackling"
          ],
          "smells": [
            "damp paper",
            "smoky wood",
            "aged leather"
          ],
          "mood": "contemplative and somber"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "muted daylight",
            "soft shadows",
            "dust in air"
          ],
          "sounds": [
            "quiet whispers",
            "fire crackling low",
            "clock ticking"
          ],
          "smells": [
            "old books",
            "wax polish",
            "faint sea breeze"
          ],
          "mood": "quietly tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm firelight glow",
            "deep shadows",
            "soft lamp light"
          ],
          "sounds": [
            "soft footsteps",
            "pages softly turning",
            "low murmured voices"
          ],
          "smells": [
            "burnt wood smoke",
            "leather bindings",
            "perfumed air"
          ],
          "mood": "intimate and secretive"
        }
      ],
      "paragraphs": [
        "The hotel library offers a refuge of calm and reflection amid the Cliffhaven’s bustle. Dark oak bookcases rise to the ceiling, packed with leather-bound volumes whose spines gleam softly in the flickering firelight. A carved stone mantel frames the hearth, where flames crackle and cast dancing shadows on the deep burgundy velvet armchairs arranged in quiet clusters. Heavy curtains are drawn against the chill sea air, muffling the distant roar of the channel and creating an intimate cocoon of warmth and knowledge.",
        "This room is a natural magnet for those seeking solace or secrets. The scent of aged paper and leather mingles with the smoke of the fire, while the soft rustle of turning pages and the distant ticking of a clock provide a gentle rhythm. Access is carefully controlled to maintain the library’s tranquility, making it a perfect setting for discreet conversations or the discovery of hidden clues within the hotel’s many volumes."
      ]
    }
  ],
  "note": "",
  "cost": 0.00664074,
  "durationMs": 57238
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1949,
    "month": "October",
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "cool temperatures averaging 10-13°C (50-55°F)",
      "damp sea air with intermittent fog rolling in from the English Channel",
      "overcast skies with occasional light rain showers and gusty winds"
    ],
    "daylight": "Shortening days with sunset around 6pm, dusk creeping in by 5:30pm, early evenings growing noticeably darker and chillier",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after guests have retired from dinner and gathered in lounges or their rooms",
    "holidays": [
      "October 31: Halloween, observed with modest decorations and children’s parties",
      "Early October: Harvest Festival celebrations in nearby villages"
    ],
    "seasonalActivities": [
      "Seaside autumn walks along the cliffs with sea mist thickening the air",
      "Harvest Festival gatherings featuring local produce and folk music",
      "Evening fireside gatherings in hotel lounges with radio broadcasts and occasional early television demonstrations"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Wool gabardine suits in muted shades of grey and brown",
        "Double-breasted jackets with broad lapels",
        "Felt fedora hats and polished leather brogues"
      ],
      "casual": [
        "Chunky knitted sweaters layered under tweed jackets",
        "Corduroy trousers with turn-ups",
        "Heavy leather boots suitable for damp coastal walks"
      ],
      "accessories": [
        "Silk neckties with subtle geometric patterns",
        "Pocket watches on brass chains",
        "Leather gloves and wool scarves in dark hues"
      ]
    },
    "womensWear": {
      "formal": [
        "Tailored wool skirts with matching jackets featuring padded shoulders",
        "Blouses with peter pan collars and bow ties",
        "Stockings held by garters, with polished leather pumps"
      ],
      "casual": [
        "Knitted cardigans over calf-length skirts",
        "Wool berets and knitted gloves",
        "Practical waterproof trench coats for seaside weather"
      ],
      "accessories": [
        "Pearl necklaces and brooches with floral motifs",
        "Handbags in boxy shapes made from leather or fabric",
        "Hosiery in neutral tones with seamed backs"
      ]
    },
    "trendsOfTheMoment": [
      "Post-war austerity still influencing muted color palettes and practical designs",
      "Increasing popularity of synthetic fabrics like rayon blends",
      "Return to more structured, feminine silhouettes for women after wartime utility wear"
    ],
    "socialExpectations": [
      "Men expected to maintain a polished and reserved demeanor, especially in formal settings",
      "Women balancing traditional domestic roles with increasing participation in the workforce",
      "Politeness and discretion highly valued in mixed social gatherings at hotels"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The establishment of the Federal Republic of Germany (West Germany) in May 1949 creating geopolitical tensions",
      "Ongoing rationing in Britain with gradual easing of food and clothing restrictions",
      "The London dock strike of September 1949 causing minor disruptions to shipping and supply chains"
    ],
    "politicalClimate": "A cautious optimism mixed with Cold War anxieties; Britain navigating post-war recovery while wary of Soviet expansion and the emerging NATO alliance",
    "economicConditions": "Slow economic recovery with continued rationing and government austerity measures, yet increasing consumer goods availability",
    "socialIssues": [
      "Adjustment of returning veterans to civilian life",
      "Women negotiating roles in post-war society amid shifting expectations",
      "Housing shortages and rebuilding efforts after wartime bombings"
    ],
    "internationalNews": [
      "Chinese Communist Party consolidating control after October’s proclamation of the People’s Republic of China",
      "United States increasing military and economic aid to Western Europe through the Marshall Plan"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Frank Sinatra’s smooth crooning dominating dance halls",
        "Duke Ellington’s jazz orchestras playing in London clubs",
        "Traditional British music hall songs still popular among older patrons"
      ],
      "films": [
        "The Third Man (released in late 1949, critically acclaimed film noir)",
        "Kind Hearts and Coronets (dark British comedy released in 1949)",
        "Adam’s Rib (American romantic comedy appealing to post-war audiences)"
      ],
      "theater": [
        "Noël Coward’s plays enjoying revivals in West End theatres",
        "Agatha Christie’s mystery plays drawing crowds",
        "Shakespearean productions staged by the Old Vic company"
      ],
      "radio": [
        "BBC Home Service broadcasting news, drama, and variety shows",
        "Listeners tuning into serials like ‘The Archers’ (began in 1950 but radio dramas were popular)",
        "Quiz shows and live music programs providing evening entertainment"
      ]
    },
    "literature": {
      "recentPublications": [
        "George Orwell’s ‘Nineteen Eighty-Four’ gaining attention since its June 1949 release",
        "Agatha Christie’s new detective novels continuing to captivate readers",
        "Poetry collections reflecting on war and social change"
      ],
      "popularGenres": [
        "Detective and crime fiction",
        "Social realism and post-war reflection",
        "Historical novels and escapist fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "Early television sets becoming test items in select hotels and households",
        "Radar technology advancing coastal defense systems",
        "Improvements in radio receivers allowing clearer broadcasts"
      ],
      "commonDevices": [
        "Radio sets in guest rooms and lounges",
        "Mechanical clocks and typewriters",
        "Basic telephones with rotary dials"
      ],
      "emergingTrends": [
        "Growing interest in home television ownership",
        "Expansion of commercial air travel post-war",
        "Increased use of synthetic fabrics in clothing manufacturing"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 6 pence",
        "Pint of milk: 3 pence",
        "Taxi ride across town: 2 shillings"
      ],
      "commonActivities": [
        "Guests engaging in seaside promenades despite brisk weather",
        "Evening card games and socializing in hotel lounges",
        "Listening to nightly radio broadcasts or early television demonstrations"
      ],
      "socialRituals": [
        "Afternoon tea served promptly at 4pm in hotel dining rooms",
        "Formal dinners requiring men to wear jackets and women to wear gloves"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Strong awareness of social hierarchy; upper classes maintaining formal decorum while working classes slowly gaining post-war mobility",
      "Deference to traditional authority figures such as hotel managers and military veterans"
    ],
    "gender": [
      "Women increasingly employed in clerical and service roles, yet expected to maintain traditional feminine comportment",
      "Men perceived as family providers and decision-makers despite social upheaval",
      "Subtle tensions arising from shifting gender norms after wartime collaboration"
    ],
    "race": [
      "Limited racial diversity in coastal England, with some awareness of colonial subjects returning or visiting",
      "Prevailing racial attitudes marked by British imperial perspectives and cautious curiosity towards other cultures"
    ],
    "generalNorms": [
      "Politeness and reserve expected in public and semi-private settings",
      "Smoking socially acceptable and widespread among both sexes",
      "Discussions of politics or personal hardship often veiled or avoided in mixed company"
    ]
  },
  "atmosphericDetails": [
    "The muted soundscape of waves crashing softly against the pebble beach through the damp fog",
    "The faint scent of salt and seaweed mingling with the coal smoke from nearby chimneys",
    "The low murmur of quiet conversations in hotel lounges punctuated by the crackle of a coal fire and the occasional radio announcer’s voice"
  ],
  "paragraphs": [
    "October 1949 at the seaside hotel carries the unmistakable chill of autumn, with damp fog drifting in from the Channel and settling thickly over the cliffs. The cool, briny air seeps into every corner, muffling footsteps on the pebble walkways and softening the edges of the hotel’s classic architecture. Guests wrapped in woolens mingle quietly in the lounges, their conversations restrained, tinged by lingering memories of war and the unease of an uncertain geopolitical future. Outside, the shortening daylight fades early, cloaking the coast in shadow well before dinnertime.",
    "Fashion this month reflects the sober tones and practical tailoring of post-war Britain. Men favor double-breasted gabardine suits and felt fedoras, while their casual wear leans toward sturdy tweeds and chunky knits, ready to fend off sea winds during cliffside strolls. Women wear tailored wool skirts and jackets with padded shoulders, accessorized by neat pearl necklaces and boxy leather handbags. The austerity of recent years still shapes choices, though a subtle return to elegance and femininity is evident in the structured silhouettes and careful detailing.",
    "Cultural life at the hotel is centered on radio broadcasts that fill the evenings with music, news, and drama, occasionally interrupted by the flickering images of early television in the lounge. Guests listen to Frank Sinatra’s latest croons or discuss the recent release of ‘The Third Man,’ while outside the world shifts with the establishment of West Germany and the tensions of the burgeoning Cold War. Social rituals remain formal yet comforting: afternoon tea is a punctual affair, and dinners require gloves and jackets, reinforcing a sense of order amid the shifting social landscape. The quiet murmur of polite conversation masks the undercurrents of personal and political uncertainty that define this precise moment in time."
  ],
  "note": "",
  "cost": 0.0033519700000000006,
  "durationMs": 28638
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Post-war guests and staff at a secluded seaside hotel navigate shifting social roles and Cold War tensions while isolated by weather and geography, binding this diverse cast in a delicate balance of civility and suspicion.",
  "era": {
    "decade": "1940s",
    "socialStructure": "A transitional society with increased female workforce presence, lingering wartime trauma, and emerging Cold War paranoia shaping interactions across class and institutional roles within the hotel."
  },
  "setting": {
    "location": "A large, multi-story seaside hotel on a cliff overlooking the English Channel",
    "institution": "Seaside hotel",
    "weather": "Cool, damp sea air with intermittent fog rolling in from the channel, creating a muted, muffled soundscape"
  },
  "castAnchors": [
    "Linda Gamble",
    "Robert Eastwood",
    "Henry Parkins",
    "Sharon Sheldon",
    "Elisabeth Padgett"
  ],
  "theme": "A classic murder mystery blending cozy social interactions with undercurrents of post-war unease and emerging geopolitical anxieties."
}

### LOCKED_FACTS
[
  {
    "id": "clock_reading",
    "value": "ten minutes past eleven",
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "tamper_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  },
  {
    "id": "terrace_tide_mark",
    "value": "six feet",
    "description": "Height of tide mark on the terrace step inconsistent with clock time"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The terrace steps show tidal water marks inconsistent with the clock time of ten minutes past eleven, indicating the tide was lower than expected at that time.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The tidal water marks contradict the clock's stopped time, suggesting the victim died earlier.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Since tidal charts confirm water levels at ten minutes past eleven should be higher, the victim’s death must have occurred earlier than the clock's stopped time.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Overturns the assumption that the victim died at the clock's stopped time, proving an earlier time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The clock’s winding key has fresh scratches inconsistent with normal use and the hotel ledger shows no recent authorized winding.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "The clock was tampered with recently, indicating manipulation of the stopped time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The scratches indicate deliberate recent tampering of the clock, meaning the stopped time was manipulated to mislead about the time of death.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Confirms the clock's stopped time was set deliberately to fabricate an alibi.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "testimonial",
      "description": "Guests report a single brief flash from the rooftop lamp at approximately ten-thirty pm, initially interpreted as a signal.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Indicates a timed signal was sent around the time of the murder, relevant to the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Partial semaphore code keys found in the victim’s study and a lens smudge on the lamp reveal the flash was a deliberate coded signal.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Demonstrates the rooftop lamp flash was not accidental but a planned semaphore message.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "spatial",
      "description": "Elevator maintenance logs show recent repairs to the door mechanism enabling delayed door release; a feature not previously present.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "The elevator could be used for near-silent passage, facilitating secret movement.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "This allowed near-silent passage past victim’s floor, enabling culprit access and escape without witnesses, contradicting initial assumptions of no access.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "Shows how the murderer could move unnoticed, explaining the timeline discrepancies.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The murderer wound back the victim’s clock by forty minutes after committing the murder to fabricate an alibi consistent with witnesses’ statements.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "Reveals the core mechanism of the crime: clock tampering to mislead about time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "Since tidal charts confirm water levels at ten minutes past eleven should be higher, the victim’s death must have occurred earlier than the clock’s stopped time, overturning the false assumption that the stopped clock time matches time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "Explicitly overturns the false assumption about the time of death using tidal evidence.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Linda Gamble because her alibi from hotel staff during the murder window is corroborated and she lacked access to the restricted wing where the clock was tampered.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "Excludes Linda Gamble as the murderer, narrowing suspicion toward Robert Eastwood.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "A controlled reenactment simultaneously compares the victim’s stopped clock time, tidal water marks on the terrace steps, and tidal charts, confirming the inconsistency of the stopped clock time with actual tide levels.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[1]",
      "pointsTo": "Provides concrete evidence supporting the timing contradiction before the discriminating test.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "temporal",
      "description": "Robert Eastwood’s fingerprints are found on the clock’s winding key with fresh scratches matching the tampering marks, linking him uniquely to the clock manipulation.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "Links Robert Eastwood directly to the clock tampering, identifying him as the likely murderer.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "behavioral",
      "description": "Robert Eastwood was observed silencing the victim who threatened to expose blackmail, visible in hotel security footage prior to the murder.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[1]",
      "pointsTo": "Shows Robert Eastwood’s motive and premeditation, reinforcing his guilt.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "testimonial",
      "description": "Eliminates Sharon Sheldon because multiple guests confirm her presence in the dining hall during the murder window, supported by hotel staff logs.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Excludes Sharon Sheldon as a suspect based on a solid alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_13",
      "category": "testimonial",
      "description": "Eliminates Elisabeth Padgett because she lacked access to the restricted wing and was accounted for in the lounge during the murder time, confirmed by staff.",
      "sourceInCML": "CASE.cast[4].alibi_window",
      "pointsTo": "Excludes Elisabeth Padgett as a suspect with corroborated alibi and access restrictions.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_14",
      "category": "testimonial",
      "description": "Eliminates Linda Gamble because hotel security footage confirms her absence from the restricted wing and presence in the lobby during the murder window, while Robert Eastwood had access and opportunity.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "Further excludes Linda Gamble and implicates Robert Eastwood through access and opportunity evidence.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_robert_eastwood",
      "category": "temporal",
      "description": "Direct evidence ties Robert Eastwood to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Robert Eastwood had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Victim’s clock stopped at eleven ten in the evening remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Several witnesses recall the victim’s death corresponds exactly to the witnesses statements time of ten exactly past confirmed, reinforcing the initial assumption.",
      "supportsAssumption": "The victim’s death corresponds exactly to the stopped clock time.",
      "misdirection": "This misleads by relying on events memory recall considering physical corresponds evidence or statements multiple."
    },
    {
      "id": "rh_2",
      "description": "Hotel staff report no unusual activity reported the making or terrace steps at the time of the murder, supporting the assumption that the definitive making time is accurate.",
      "supportsAssumption": "The victim’s death corresponds exactly to the stopped clock time.",
      "misdirection": "This misdirection ignores the fresh appear on the winding key and consistent inconsistencies, focusing on routine staff observations."
    }
  ],
  "status": "pass",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_core_elimination_chain",
      "clue_9",
      "clue_10",
      "clue_11",
      "clue_12",
      "clue_13",
      "clue_14",
      "clue_culprit_direct_robert_eastwood"
    ],
    "late": [
      "clue_late_optional_slot_1"
    ]
  },
  "fairPlayChecks": {
    "allEssentialCluesPresent": true,
    "noNewFactsIntroduced": true,
    "redHerringsDontBreakLogic": true
  },
  "latencyMs": 35929,
  "cost": 0.00505837
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

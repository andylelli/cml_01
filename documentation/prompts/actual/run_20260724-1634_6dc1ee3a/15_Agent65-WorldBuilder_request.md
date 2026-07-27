# Actual Prompt Record

- Run ID: `run_6dc1ee3a-ae3c-453e-9644-090754bf4ca3`
- Project ID: `proj_592321de-fd84-4beb-9236-95406b91b4b1`
- Timestamp: `2026-07-24T16:40:21.706Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4.1-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `3e8d2867eebd535f`

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
    "title": "The Bell Tower's Last Chime",
    "author": "A. Detective",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": [
        "Radio and early telephone technology present",
        "Basic forensic toxicology and fingerprinting available",
        "Social class distinctions strongly enforced",
        "No post-1945 scientific knowledge"
      ]
    },
    "setting": {
      "location": "Langley Manor",
      "place": "Little Middleton, Yorkshire",
      "country": "England",
      "institution": "country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "delayed acoustic timeline murder"
    }
  },
  "death_method": "struck with a heavy brass choir bell clapper",
  "cast": [
    {
      "name": "Inspector Gerald Havers",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [
        "Official investigator of the case"
      ],
      "public_persona": "Methodical and respected inspector",
      "private_secret": "Obsessed with getting the details exactly right",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "Entire investigation period",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Official access to all areas",
        "Interviewing staff and family"
      ],
      "behavioral_tells": [
        "Calm under pressure"
      ],
      "stakes": "Solve case accurately",
      "evidence_sensitivity": [
        "Physical evidence",
        "Witness testimony"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    },
    {
      "name": "Lady Beatrice Langley",
      "age_range": "50-60",
      "role_archetype": "victim",
      "relationships": [
        "Wife to Charles Langley",
        "Mother to Margaret Langley"
      ],
      "public_persona": "Respected matriarch of the Langley family",
      "private_secret": "Feared some staff distrusted her",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "Time of murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "In her private chambers",
        "Family and staff had access at times"
      ],
      "behavioral_tells": [
        "Strict and commanding"
      ],
      "stakes": "Status and family reputation",
      "evidence_sensitivity": [
        "Physical injury pattern",
        "Timeline contradictions"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Charles Langley",
      "age_range": "55-65",
      "role_archetype": "Family patriarch",
      "relationships": [
        "Husband to Lady Beatrice Langley",
        "Father to Margaret Langley"
      ],
      "public_persona": "Aristocratic, authoritative",
      "private_secret": "Financial troubles unknown to others",
      "motive_seed": "Blackmail threat from victim",
      "motive_strength": "strong",
      "alibi_window": "Between quarter past and half past seven",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to bell tower and victim's chambers"
      ],
      "behavioral_tells": [
        "Irritated during evening prayers"
      ],
      "stakes": "Protect family finances",
      "evidence_sensitivity": [
        "Access logs to bell tower",
        "Witness statements on timing"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Margaret Langley",
      "age_range": "25-35",
      "role_archetype": "Daughter",
      "relationships": [
        "Daughter to Lady Beatrice and Charles Langley"
      ],
      "public_persona": "Gentle and reserved",
      "private_secret": "Secret correspondence with Edward Barnes",
      "motive_seed": "Jealousy of attention to family name",
      "motive_strength": "moderate",
      "alibi_window": "At dinner between quarter to and quarter past eight",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to servants' wing and gardens"
      ],
      "behavioral_tells": [
        "Nervous when questioned"
      ],
      "stakes": "Maintain family honor",
      "evidence_sensitivity": [
        "Letters found in her room",
        "Dinner times verified by multiple guests"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Edward Barnes",
      "age_range": "30-40",
      "role_archetype": "Family friend/guest",
      "relationships": [
        "Friend to the Langley family",
        "Correspondent of Margaret Langley"
      ],
      "public_persona": "Charming and sociable",
      "private_secret": "Unemployed and financially dependent",
      "motive_seed": "Blackmail exposure threat from victim",
      "motive_strength": "strong",
      "alibi_window": "Between six and eight in the evening",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to main house and gardens"
      ],
      "behavioral_tells": [
        "Avoidant when asked about whereabouts"
      ],
      "stakes": "Avoid exposure",
      "evidence_sensitivity": [
        "Witness statements of movements",
        "Correspondence intercepts"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Agnes Crowley",
      "age_range": "50-60",
      "role_archetype": "Housekeeper",
      "relationships": [
        "Head of servants",
        "Loyal to the Langley family"
      ],
      "public_persona": "Stern but fair",
      "private_secret": "Dislikes certain family members",
      "motive_seed": "Fear of dismissal",
      "motive_strength": "moderate",
      "alibi_window": "Between seven and eight in the evening",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all servant quarters",
        "Access to bell tower keys"
      ],
      "behavioral_tells": [
        "Clenched fists when questioned"
      ],
      "stakes": "Maintain position",
      "evidence_sensitivity": [
        "Bell tower key logs",
        "Servants' statements"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Thomas Radcliffe",
      "age_range": "35-45",
      "role_archetype": "Gardener",
      "relationships": [
        "Employee of Langley estate"
      ],
      "public_persona": "Quiet and observant",
      "private_secret": "Secretly resentful of family",
      "motive_seed": "Grudge over working conditions",
      "motive_strength": "moderate",
      "alibi_window": "At fountain between six forty-five and seven twenty",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to gardens and outbuildings"
      ],
      "behavioral_tells": [
        "Avoids eye contact"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [
        "Gardener's log book",
        "Water basin inspection"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Charles Langley"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "On a foggy autumn evening in 1930s Yorkshire, Lady Beatrice Langley is found dead in her chambers. Witnesses swear the manor's choir bell rang the hour after her death, suggesting a timeline that contradicts physical evidence. Inspector Gerald Havers must unravel the truth behind the acoustic deception and social tensions to reveal the murderer among family and staff."
    },
    "accepted_facts": [
      "Lady Beatrice Langley was found dead from blunt trauma caused by a brass choir bell clapper.",
      "The manor’s choir bell chimed at what witnesses say was after Lady Beatrice’s death.",
      "The bell tower clock stopped at half past seven.",
      "Multiple servants gave inconsistent accounts of when they heard the choir bell.",
      "A loose muffling leather pad was found near the choir bell clapper.",
      "A sketch of the bell tower reveals an unusual echo chamber within.",
      "The gardener’s fountain water flow was continuous despite a noted pump failure."
    ],
    "inferred_conclusions": [
      "The choir bell’s sound was acoustically delayed by a muffling mechanism and echo chamber.",
      "The accepted timeline based on the bell’s chime is false.",
      "Charles Langley had motive, access, and opportunity for murder in the distorted timeline.",
      "Other suspects can be eliminated based on their alibis and access constraints."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The murderer manipulated the choir bell mechanism by inserting a muffling leather pad onto the clapper and exploiting the bell tower’s echo chamber. This caused the bell’s chimes to be heard significantly later than when struck, creating an illusion that Lady Beatrice was alive after being killed. This acoustic delay misled witnesses’ auditory recall, generating a false timeline that concealed the true time and culprit.",
      "delivery_path": [
        {
          "step": "Charles Langley accessed the bell tower using a key he obtained from Agnes Crowley."
        },
        {
          "step": "He inserted the muffling leather pad onto the choir bell clapper to dampen and delay the bell’s sound."
        },
        {
          "step": "The bell tower’s echo chamber amplified the delay, causing the chime to be heard up to twenty minutes after the bell was struck."
        },
        {
          "step": "Witnesses’ auditory memories were influenced by cognitive bias, accepting the delayed chime as the true hour."
        },
        {
          "step": "The stop of the bell tower clock at half past seven was used as an anchor, but the physical acoustic facts override its reliability, hiding the actual time of death."
        }
      ]
    },
    "outcome": {
      "result": "The false timeline based on the choir bell misleads everyone except the culprit, who used the acoustic delay to establish a seemingly airtight alibi and misdirect suspicion."
    }
  },
  "false_assumption": {
    "statement": "The manor’s choir bell chimed immediately upon being struck, so the time it was heard corresponds exactly to the time of the bell strike and thus the murder.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses heard the bell at a certain hour and, trusting the clock and the bell’s normal functioning, concluded the chime was immediate and reliable for timing events.",
    "what_it_hides": "It hides the fact that the bell’s sound was artificially delayed by a muffling pad and acoustic echo chamber, creating a false timeline that misdirects witnesses and investigators."
  },
  "false_solution": {
    "accused_suspect": "Edward Barnes",
    "supporting_points": [
      "Edward Barnes was seen near the victim's chambers shortly before the bell chimed, and his nervous behavior suggested guilt.",
      "His financial desperation and secret correspondence with Margaret Langley imply a strong motive."
    ],
    "the_one_flaw": "He could not have accessed the bell tower to manipulate the timing of the bell chimes, and the acoustic evidence disproves his ability to control the false timeline.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Margaret Langley was found with secret letters implying a romantic affair with Edward Barnes, suggesting a motive of jealousy.",
      "points_at_suspect": "Margaret Langley",
      "innocent_explanation": "The letters were innocent and unrelated to the murder; Margaret was dining publicly during the murder window.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Agnes Crowley was observed nervously hiding the bell tower keys, hinting she might have manipulated access.",
      "points_at_suspect": "Agnes Crowley",
      "innocent_explanation": "Agnes was protecting the keys to prevent unauthorized access, not herself accessing them for wrongdoing.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Charles Langley",
      "Margaret Langley",
      "Edward Barnes",
      "Agnes Crowley",
      "Thomas Radcliffe"
    ],
    "rationale": "The manor was isolated during the foggy evening with all entrances guarded and accounted for. Only family and staff present had access and opportunity, excluding outsiders."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Bell tower clock stopped at half past seven",
        "Dinner served at quarter past seven",
        "Gardener's fountain pump failure logged at seven twenty"
      ],
      "windows": [
        "Murder occurred between quarter past seven and half past seven",
        "Bell chimed heard up to twenty minutes after being struck"
      ],
      "contradictions": [
        "Servants’ testimony of hearing bell at different times clashes with stopped clock time",
        "Witnesses place victim alive after bell chimed, but medical evidence disagrees"
      ]
    },
    "access": {
      "actors": [
        "Charles Langley",
        "Agnes Crowley",
        "Margaret Langley",
        "Edward Barnes",
        "Thomas Radcliffe"
      ],
      "objects": [
        "Bell tower key",
        "Choir bell clapper",
        "Muffling leather pad"
      ],
      "permissions": [
        "Only Agnes Crowley had official bell tower key custody",
        "Charles Langley obtained key temporarily from Agnes",
        "Servants and guests restricted from bell tower access"
      ]
    },
    "physical": {
      "laws": [
        "Sound travel and delay due to muffling and echo in bell tower",
        "Bell tower clock stopped at half past seven, not running thereafter"
      ],
      "traces": [
        "Loose muffling leather pad near clapper",
        "Echo chamber sketch showing prolonged reverberations"
      ]
    },
    "social": {
      "trust_channels": [
        "Servants' shared but biased recollections of bell chime",
        "Agnes Crowley's control of bell tower keys"
      ],
      "authority_sources": [
        "Lady Beatrice Langley's authority over servants",
        "Charles Langley's patriarchal authority"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "A loose muffling leather pad was found near the choir bell clapper in the bell tower.",
        "correction": "The presence of the muffling pad indicates the bell's sound was deliberately dampened, causing delay in the chimed sound reaching listeners.",
        "effect": "Narrows the timeline constraint by invalidating the assumption that bell sound is immediate.",
        "required_evidence": [
          "Loose muffling leather pad found near choir bell clapper",
          "Bell tower sketch showing clapper and bell assembly"
        ],
        "reader_observable": true
      },
      {
        "observation": "The bell tower clock stopped at half past seven, but servants report hearing the bell chime at times ranging from half past seven to nearly eight o’clock.",
        "correction": "The stopped clock is reliable for timing the bell strike, but the delayed chime was heard later, proving an acoustic delay caused the temporal confusion.",
        "effect": "Eliminates timeline interpretations based on auditory witness memory alone.",
        "required_evidence": [
          "Bell tower clock stopped at half past seven",
          "Servants’ inconsistent testimony on bell chime times"
        ],
        "reader_observable": true
      },
      {
        "observation": "Charles Langley had the bell tower key briefly as recorded in Agnes Crowley's log and had motive to manipulate the timeline.",
        "correction": "Charles was uniquely capable of inserting the muffling pad and exploiting the bell tower echo to create the false timeline.",
        "effect": "Identifies Charles Langley as having exclusive means and motive, narrowing suspect pool to him.",
        "required_evidence": [
          "Agnes Crowley's bell tower key log showing transfer to Charles Langley",
          "Charles Langley’s financial troubles and motive for murder"
        ],
        "reader_observable": true
      },
      {
        "observation": "Medical examination confirms Lady Beatrice died before the earliest bell chime reported by servants.",
        "correction": "This confirms the acoustic delay made witnesses falsely recall the timing of the murder after the bell chimed.",
        "effect": "Confirms temporal false assumption and supports elimination of other suspects with alibis after bell chime.",
        "required_evidence": [
          "Medical report on time of death",
          "Servants’ testimony placing victim alive after bell chime"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "constraint_proof",
    "design": "A controlled ringing of the choir bell is staged in the presence of witnesses, with prior measurement of the echo chamber’s acoustic delay and observation of the muffling pad’s effect. The test proves the bell’s strike time does not match the sound heard by listeners, exposing the false auditory timeline and implicating only someone with access to the bell tower during the critical window.",
    "knowledge_revealed": "The acoustic delay measured during the test exactly matches the gap between the bell tower clock stop and witnesses’ reported chime times, confirming the manipulation by the culprit.",
    "pass_condition": "The witnesses experience the delay as before, disproving their original timeline and demonstrating the mechanism of deception.",
    "evidence_clues": [
      "clue_12",
      "clue_9",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The muffling leather pad and bell tower sketch provide visible physical evidence of sound delay, challenging the initial timeline. Step 2: The stopped bell tower clock and servants’ inconsistent witness statements establish the temporal contradiction. Step 3: Agnes Crowley’s log and Charles Langley’s motive and access narrow suspicion to one culprit. Step 4: The medical report confirms victim’s time of death before the earliest perceived bell chime. The discriminating test recreates the acoustic delay to definitively prove the false timeline and implicate Charles Langley."
  },
  "quality_controls": {
    "inference_path_requirements": {
      "min_steps": 3,
      "max_steps": 5,
      "require_observation_correction_effect": true
    },
    "clue_visibility_requirements": {
      "essential_clues_min": 4,
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
        "Execute the controlled choir bell ringing test",
        "Measure echo chamber acoustic delay",
        "Observe servants’ witness reaction and timing discrepancy",
        "Draw conclusion about the false timeline and guilt"
      ],
      "test_type": "constraint_proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Margaret Langley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Public dinner alibi verified by guests",
        "supporting_clues": [
          "Letters found in Margaret’s room",
          "Dinner guests’ testimony"
        ]
      },
      {
        "suspect_name": "Edward Barnes",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses place him away from bell tower at critical time",
        "supporting_clues": [
          "Correspondence intercepts",
          "Witness statements of Edward's location"
        ]
      },
      {
        "suspect_name": "Agnes Crowley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Bell tower key log shows no unauthorized access",
        "supporting_clues": [
          "Bell tower key log",
          "Servants’ statements"
        ]
      },
      {
        "suspect_name": "Thomas Radcliffe",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Gardener’s log and fountain inspection confirm location and absence of opportunity",
        "supporting_clues": [
          "Gardener's log book",
          "Water basin inspection"
        ]
      },
      {
        "suspect_name": "Lady Beatrice Langley",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: Time of murder",
        "supporting_clues": [
          "Agnes Crowley’s bell tower key log showing transfer to Charles Langley"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with acoustic evidence and key logs"
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
        "clue_id": "clue_14",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "clue_id": "clue_17",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_18",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_19",
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_charles_langley",
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
    "name": "Inspector Gerald Havers",
    "summary": "A seasoned Scotland Yard detective, methodical and insightful, navigating the delicate intrigues of Langley Manor with a sharp eye and a heavy heart.",
    "publicPersona": "Inspector Havers is known for his unwavering dedication to justice and his keen ability to untangle the complexities of upper-class scandals. His presence commands respect, his manner precise and deliberate, embodying the very essence of a professional detective.",
    "privateSecret": "Beneath his composed exterior, Havers wrestles with the decline of his own family’s fortunes. He harbors a quiet skepticism about the fairness of the class system he serves, feeling the weight of his divided loyalties as he probes the secrets of Langley Manor.",
    "motiveSeed": "N/A - detective",
    "motiveStrength": "weak",
    "alibiWindow": "N/A - detective",
    "accessPlausibility": "easy",
    "stakes": "His professional reputation and personal sense of justice are at stake, with mounting pressure to solve the case discreetly and correctly.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Havers speaks with measured clarity and a calm precision, often punctuating his observations with sharp, dry remarks. His tone carries a subtle irony, reflecting his experienced skepticism, and he habitually frames questions with a deliberate, almost rhetorical cadence.",
    "signatureTic": "\"One mustn't jump to conclusions, now, must we?\"",
    "internalConflict": "Havers struggles with his role enforcing a justice system that seems skewed by class privilege, fearing that uncovering the truth might expose uncomfortable social realities or deepen his own disillusionment.",
    "personalStakeInCase": "This case challenges Havers beyond duty; the victim’s aristocratic milieu reminds him of his own family’s fall from grace, stirring empathy and a desire to see justice done fairly, not just expediently.",
    "paragraphs": [
      "Inspector Gerald Havers arrived at Langley Manor with the calm assurance of a man accustomed to the weight of responsibility. His sharp eyes missed little, noting the subtle tensions among the assembled family and staff. To the outside world, he was the embodiment of law and order, a figure who could be relied upon to restore calm amid chaos.",
      "Yet beneath the surface, Havers carried a personal burden. The decline of his own family’s fortunes gnawed at him, and the opulence of Langley Manor only deepened his unease about the rigid class distinctions that governed such estates. He found himself torn between his duty to enforce the law and his empathy for those ensnared by social expectations and secrets.",
      "His methodical approach was punctuated by a wry, dry wit that surfaced in moments of tension. When suspects offered evasions or half-truths, Havers’s calm but pointed questions often exposed contradictions with a subtle irony that unsettled them. He refrained from overt judgment, preferring to let facts speak, yet his tone conveyed a quiet skepticism of the pretenses around him.",
      "As the investigation unfolded, Havers felt the pressure of his professional reputation mounting. Solving the case discreetly was paramount, for the scandal threatened to ripple beyond the manor’s walls into the delicate fabric of society. Yet he knew that to do so without confronting uncomfortable truths would be a betrayal of justice.",
      "Throughout, Havers maintained a steady, measured presence, balancing the demands of his role with an internal struggle that lent his inquiries a depth beyond mere procedure. The case was not just another file; it was a test of his integrity and his belief in fairness amidst a world rife with privilege and deception."
    ],
    "order": 1
  },
  {
    "name": "Lady Beatrice Langley",
    "summary": "The formidable matriarch of Langley Manor, whose iron will and secretive final decisions cast a long shadow over her family’s fate.",
    "publicPersona": "Lady Beatrice was both respected and feared, ruling over the Langley estate with a steely resolve. Her commanding presence and sharp intellect kept her family and staff in line, and her word was law within the manor’s walls.",
    "privateSecret": "Shortly before her death, Lady Beatrice secretly altered her will to disinherit her eldest son, Charles, in favor of a hidden relative—a move that threatened to upend the family’s future and ignite fierce conflicts.",
    "motiveSeed": "N/A - victim",
    "motiveStrength": "weak",
    "alibiWindow": "N/A - victim",
    "accessPlausibility": "easy",
    "stakes": "Her death sets in motion an inheritance dispute that exposes long-buried secrets and fractures family loyalties.",
    "humourStyle": "understatement",
    "humourLevel": 0.2,
    "speechMannerisms": "In life, Lady Beatrice spoke with a measured, commanding tone, her words deliberate and often laced with dry understatement. She wielded language like a weapon, delivering sharp rebukes or veiled warnings with a calm, unflappable demeanor.",
    "signatureTic": "\"One must always consider the long game.\"",
    "internalConflict": "Though outwardly resolute, Lady Beatrice harbored doubts about the legacy she would leave, torn between protecting the estate and confronting the failings of her children.",
    "personalStakeInCase": "Deceased, her posthumous will and secrets drive the entire narrative, reshaping the family’s trajectory and revealing the true cost of her iron rule.",
    "paragraphs": [
      "Lady Beatrice Langley’s presence was felt long before her passing, her voice and decisions echoing through the halls of the manor. As the matriarch, she commanded authority with a quiet but unyielding strength. Her control over the family estate was absolute, and none dared challenge her will openly.",
      "Her reputation for stern fairness masked a shrewd mind that had carefully guarded secrets, including the clandestine alteration of her will. This act, intended to protect the estate from her eldest son’s reckless tendencies, was a last, private gambit to secure the manor’s future beyond her own lifetime.",
      "Despite her formidable exterior, Lady Beatrice wrestled privately with the consequences of her decisions. She knew the fractures within her family ran deep, and the choices she made might splinter those bonds irrevocably. The burden of legacy weighed heavily upon her, yet she faced it with characteristic resolve.",
      "Her death plunged the Langley family into turmoil, as the revelation of her revised will threatened to upend established expectations. The manor, once a symbol of stability, became a battleground for competing ambitions and resentments, all ignited by her final, secret decree.",
      "Though silent now, Lady Beatrice’s influence persists, shaping every suspicion and motive that the investigation uncovers. Her legacy is a testament to the power and peril of control wielded with an iron hand and a cautious heart."
    ],
    "order": 2
  },
  {
    "name": "Charles Langley",
    "summary": "The disinherited eldest son, a man caught between desperation and defiance, whose reckless past and secret debts paint him as both suspect and tragic figure.",
    "publicPersona": "Once the favored heir, Charles’s reputation has been tarnished by reckless spending and strained relations with his mother. He carries the air of a man who has lost his way but clings stubbornly to fading privileges.",
    "privateSecret": "Burdened by gambling debts and the threat of ruin, Charles has threatened to expose family scandals to regain control of the estate, making him a man with everything to lose and desperate enough to act.",
    "motiveSeed": "He stands to regain the estate if Lady Beatrice’s altered will is destroyed and fears exposure of his debts would obliterate his social standing.",
    "motiveStrength": "compelling",
    "alibiWindow": "Left the dining room briefly during the evening meal, unaccounted for fifteen minutes.",
    "accessPlausibility": "easy",
    "stakes": "Faced with financial ruin and social disgrace, Charles’s very future hinges on the outcome of the investigation.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Charles speaks with a frank, often brusque manner, his words clipped and sometimes edged with frustration or impatience. He avoids pretense, and when pressed, his tone hardens, revealing a man accustomed to confrontation and accustomed to masking vulnerability with bravado.",
    "signatureTic": "\"Look, I’m not here to play games.\"",
    "internalConflict": "Charles is torn between his pride and the overwhelming pressure of his debts and disgrace, battling the fear that his worst impulses may destroy what remains of his family ties.",
    "personalStakeInCase": "The murder investigation is a crucible for Charles — a chance to reclaim his place or face permanent exile from the family and society.",
    "paragraphs": [
      "Charles Langley’s fall from grace was as public as it was painful. Once the shining heir apparent, his reckless spending and mounting debts eroded the trust and favor his mother once bestowed. His presence at Langley Manor was marked by tension, a man visibly struggling to maintain dignity amid whispers and judgment.",
      "His desperation was palpable. The altered will threatened to strip him of what little security remained, and with creditors closing in, Charles’s threats to expose family scandals were as much a plea for help as a weapon of blackmail. He knew the game was dangerous but saw no alternative path.",
      "During the critical moments of the crime, Charles’s unexplained absence from the dining room cast a long shadow of suspicion. His easy access to the victim and personal stakes made him a prime suspect, yet his blunt denials and moments of vulnerability hinted at a more complex character than mere villainy.",
      "His speech, terse and direct, often betrayed his frustration with the situation and the people around him. He preferred confrontation to subtlety, and his impatience sometimes alienated allies. Yet beneath the bluster lay a man grappling with shame and a desperate hope for redemption.",
      "As the investigation progressed, Charles’s arc hung in balance — potential ruin or a hard-won chance at reclaiming honor. His fate was intertwined with the manor’s secrets, and every revelation threatened to unravel the fragile threads holding his life together."
    ],
    "order": 3
  },
  {
    "name": "Margaret Langley",
    "summary": "The younger daughter and socialite, whose charm and ambition mask a labyrinth of secrets and a precarious position within the family hierarchy.",
    "publicPersona": "Known for her dazzling parties and social finesse, Margaret is a figure of grace and ambition in society, constantly striving to elevate her status and secure her place among the elite.",
    "privateSecret": "Engaged secretly to a wealthy industrialist, Margaret fears disinheritance and the ruin of her carefully cultivated social standing if family scandals emerge.",
    "motiveSeed": "Killing Lady Beatrice could hasten inheritance settlement favoring her interests and preserve her lifestyle from the threat of drawn-out disputes.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be in the garden with a guest, but this remains uncorroborated for twenty minutes during the crime.",
    "accessPlausibility": "possible",
    "stakes": "Maintaining her lavish lifestyle and social ascent depends on the swift resolution of the inheritance and the suppression of damaging secrets.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Margaret’s speech is polished and genteel, imbued with a subtle sharpness that cuts beneath pleasantries. She wields social niceties as weapons, her tone often laced with veiled barbs and ironic observations that reveal her shrewd mind.",
    "signatureTic": "\"Isn’t it simply delightful when things fall into place?\"",
    "internalConflict": "Margaret wrestles with the cost of her ambition, caught between the desire for social elevation and the fear that her secrets might destroy all she has built.",
    "personalStakeInCase": "Her future, and that of her secret engagement, hinges on the outcome of the inheritance dispute and the fate of the family’s reputation.",
    "paragraphs": [
      "Margaret Langley moved through Langley Manor like a practiced actress, her every gesture and word carefully calibrated to charm and impress. As a socialite, she was adept at hosting dazzling parties that cemented her standing and drew influential figures into her orbit.",
      "Beneath the glittering surface, however, Margaret’s life was shadowed by secrets. Her clandestine engagement to a wealthy industrialist was a delicate balancing act, threatened by the unstable fortunes of her family. The prospect of disinheritance or scandal was a constant source of anxiety.",
      "Her alibi during the murder—claimed time spent in the garden with a guest—was curiously unconfirmed, raising questions about her movements and intentions. While she projected an air of innocence, her ambition and subtle manipulations suggested she might act decisively to protect her interests.",
      "Margaret’s speech was a blend of polished elegance and polite savagery. She could deliver a compliment that felt like a challenge, or a casual remark that exposed a rival’s weakness. This sharp wit made her both admired and feared in social circles, a master of the unspoken game of power.",
      "Her internal struggle was palpable; the desire for advancement warred with the precariousness of her position. The investigation threatened to expose not just a murder but the fragile foundations of her carefully constructed world.",
      "Ultimately, Margaret’s role in the drama was a study in contrasts: a woman of grace and ambition, navigating the perilous waters of family loyalty and social survival with equal parts charm and cunning."
    ],
    "order": 4
  },
  {
    "name": "Edward Barnes",
    "summary": "The longtime family lawyer, a pillar of discretion whose professional facade conceals a web of manipulation and self-preservation.",
    "publicPersona": "Edward Barnes is the trusted legal advisor of the Langley family, respected for his discretion and unflappable professionalism. His advice is sought and seldom questioned.",
    "privateSecret": "He has been forging legal documents to favor certain family members for personal gain, a secret Lady Beatrice threatened to expose, making him a man desperate to silence her.",
    "motiveSeed": "Faced with potential exposure and ruin, Edward saw murder as the only way to protect his lucrative position and avoid scandal.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in his office drafting documents, but no witnesses confirm his presence during the critical time period.",
    "accessPlausibility": "possible",
    "stakes": "His professional life and freedom hang in the balance, with the threat of disgrace or imprisonment looming.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Edward speaks with careful enunciation and a calm, measured tone, often punctuating his statements with dry observations about human nature and the folly of ambition. His language is formal but carries an undercurrent of subtle irony.",
    "signatureTic": "\"It’s all quite elementary, if one cares to look closely.\"",
    "internalConflict": "He is tormented by the fear of losing everything he’s built and the moral compromises that have led him to a dangerous precipice.",
    "personalStakeInCase": "The investigation threatens to unmask his forgeries and end his career, forcing him into desperate measures to maintain control.",
    "paragraphs": [
      "Edward Barnes had served the Langley family for decades, his role as legal advisor making him a fixture within the manor’s walls. His reputation for discretion was impeccable, earning the trust of Lady Beatrice and her kin alike, though that trust concealed darker dealings.",
      "Behind the veneer of professionalism, Edward had been manipulating legal documents to shift inheritances and favors to his own advantage. He knew Lady Beatrice’s recent will alterations endangered his schemes, and the threat of exposure cast a shadow over his every move.",
      "His alibi was tenuous; claiming to be engrossed in paperwork in his office, yet no one could confirm his whereabouts during the crucial moments. This gap invited suspicion, as did his calm demeanor that hinted at a mind always calculating the next move.",
      "Edward’s speech betrayed a man who observed human weakness with detached amusement. His remarks often included wry comments on ambition and folly, masking his own desperation beneath layers of irony and formality.",
      "Internally, he wrestled with guilt and fear, aware that the path he chose might lead to ruin. Yet his pride and desire to maintain his position drove him to consider extremes that few could fathom.",
      "As the investigation closed in, Edward’s fate became a tightrope walk between confession and concealment, his life balanced on the edge of a knife sharpened by his own duplicity."
    ],
    "order": 5
  },
  {
    "name": "Agnes Crowley",
    "summary": "The head housekeeper, a stern guardian of tradition whose loyalty to Langley Manor is matched only by her resentment of the younger generation’s disregard.",
    "publicPersona": "Agnes commands the household with an iron fist, maintaining order and discretion among the staff. Her presence is formidable, and her authority rarely questioned.",
    "privateSecret": "She harbors knowledge of compromising family secrets and fears losing her position if the new will favors outsiders, fueling resentment and a motive to act.",
    "motiveSeed": "Killing Lady Beatrice might stall unwanted changes and preserve Agnes’s job security and status within the household hierarchy.",
    "motiveStrength": "moderate",
    "alibiWindow": "Busy organizing staff during dinner hour, but her exact whereabouts are uncertain for ten minutes.",
    "accessPlausibility": "easy",
    "stakes": "Her livelihood and social standing within the manor depend on maintaining the status quo.",
    "humourStyle": "deadpan",
    "humourLevel": 0.2,
    "speechMannerisms": "Agnes speaks plainly and without flourish, her tone flat and often tinged with weary sarcasm. She favors succinct statements and seldom indulges in emotion, delivering observations with a dry, matter-of-fact bluntness.",
    "signatureTic": "\"If it isn’t one thing, it’s another.\"",
    "internalConflict": "Agnes wrestles with loyalty to the family and frustration over being sidelined by changing times and younger, less respectful generations.",
    "personalStakeInCase": "The murder threatens to overturn the household’s delicate balance, putting Agnes’s authority and future at risk.",
    "paragraphs": [
      "Agnes Crowley was the backbone of Langley Manor’s domestic order, her firm hand ensuring that staff maintained the standards expected by generations of Langleys. Her loyalty to tradition was unwavering, and she viewed any upheaval with suspicion and disdain.",
      "She knew many of the family’s secrets, gleaned through years of quiet observation and discreet conversations. This knowledge gave her a measure of power but also made her wary of the shifting sands beneath her feet, especially with the prospect of a new will that might favor outsiders.",
      "During the evening meal, Agnes was seen bustling among the staff, but a brief ten-minute window of unaccounted time left room for doubt. Her easy access to the manor’s inner workings made her involvement plausible, though her stoic demeanor concealed much.",
      "Her speech was marked by a deadpan bluntness, often expressing exasperation with a dry wit that veered into sarcasm. She rarely minced words, and when she spoke of the younger generation, her tone suggested both disappointment and quiet menace.",
      "Inside, Agnes struggled with conflicted loyalties. She wished to protect the family she served but resented the erosion of respect and the threat to her own position. The murder investigation forced her to confront these tensions, revealing a complex character shaped by duty and frustration.",
      "Her role in the unfolding drama was that of a guardian of the old ways, willing to resist change by any means necessary, even if it meant crossing dangerous lines."
    ],
    "order": 6
  },
  {
    "name": "Thomas Radcliffe",
    "summary": "The ambitious business manager, an outsider with grand designs, whose embezzlement and fear of exposure place him squarely in the crosshairs of suspicion.",
    "publicPersona": "Hired recently to modernize the estate’s finances, Thomas is seen as a determined but unproven figure, eager to prove his worth to skeptical old money.",
    "privateSecret": "He has been embezzling funds and fears that Lady Beatrice’s discovery would end his schemes and ruin his social aspirations.",
    "motiveSeed": "Murder would prevent exposure of his fraud and secure his control over the estate’s finances.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in the stables checking accounts, but no staff corroborate his presence during the crime.",
    "accessPlausibility": "possible",
    "stakes": "His freedom and future depend on escaping disgrace and maintaining control over the estate’s wealth.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Thomas’s speech is sharp and quick, often laced with sardonic humor and a biting edge. He uses sarcasm as a shield and weapon, speaking with confidence that sometimes borders on arrogance, revealing both his ambition and insecurity.",
    "signatureTic": "\"Well, isn’t that just rich?\"",
    "internalConflict": "He battles the fear of exposure and ruin against his desire for advancement, pushing him toward increasingly reckless choices.",
    "personalStakeInCase": "The investigation threatens to dismantle his carefully constructed facade and send him to ruin, making the stakes intensely personal.",
    "paragraphs": [
      "Thomas Radcliffe entered Langley Manor as a man with a mission: to modernize and streamline the estate’s finances. His presence was met with skepticism from the old guard, who viewed him as an opportunist eager to climb the social ladder by any means.",
      "Behind his polished exterior, Thomas had been siphoning funds for his own benefit, a secret that grew heavier with each passing day. Lady Beatrice’s potential discovery of his embezzlement posed an existential threat to his ambitions and freedom.",
      "His alibi was flimsy at best. Claiming to be in the stables auditing accounts, he lacked any witnesses to corroborate his story during the critical window. This gap, combined with his access to key areas, made his involvement plausible and his motives compelling.",
      "Thomas’s sardonic humor surfaced in his speech, where biting remarks and ironic observations masked his anxiety. His tone often conveyed a mixture of bravado and bitterness, betraying a man who felt trapped by his own schemes.",
      "Internally, he was caught between the fear of exposure and the hunger for power. Each step deeper into deception risked collapse, yet retreat was not an option he entertained.",
      "The investigation was a crucible for Thomas, forcing him to confront the consequences of his actions and the precariousness of his social ambitions."
    ],
    "order": 7
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Cozy",
  "primary": {
    "name": "Langley Manor",
    "type": "country house estate",
    "place": "Cotswold Hills",
    "country": "England",
    "summary": "An imposing 18th-century Georgian manor set deep within the Cotswold Hills, Langley Manor is surrounded by extensive gardens and ancient woodlands, embodying the quiet grandeur and social hierarchies of rural England in the 1930s.",
    "visualDescription": "Symmetrical stone façades with classical porticos, tall sash windows framed by climbing ivy, slate roofs punctuated by brick chimneys, and wrought iron gates guarding gravel driveways. The estate sprawls with manicured lawns, formal parterres, and dense woodland edges.",
    "atmosphere": "The manor exudes a dignified, reserved presence, shadowed by autumn mists that curl through the gardens and cloak the surrounding trees. The air carries a chill, with the faint glow of domestic electric lamps flickering inside against the encroaching dusk.",
    "paragraphs": [
      "Langley Manor rises stately amidst the rolling Cotswold Hills, its Georgian symmetry a testament to refined 18th-century craftsmanship. The house’s stone exterior, weathered by decades of rain and frost, holds the quiet dignity of an ancestral home, while the classical porticos offer a restrained welcome to visitors along the gravel drive. Ivy tendrils climb steadily, softening the manor’s imposing silhouette against the grey autumn sky.",
      "Surrounding the house, the gardens reveal an orderly contrast: clipped box hedges, gravel paths edged with fallen amber leaves, and ancient oaks whose branches creak with the wind. Dense woodlands hem the estate, their shadowed depths occasionally pierced by narrow shafts of fading light. The wrought iron gates at the entrance stand locked when not in use, guarding the estate’s privacy and seclusion.",
      "Inside, the manor’s layout reflects social order and tradition. The family’s private quarters remain locked and heavily curtained, while the servants’ wing buzzes quietly with routine activity at prescribed hours. The library, drawing room, and dining hall serve as gathering spaces for both family and guests, their interiors warmed by flickering fires and intermittently lit by domestic electric lamps prone to flicker during sudden gusts of wind.",
      "The estate’s isolation is palpable; the nearest village lies miles away, reachable only by unpaved country lanes where petrol vehicles kick up dust and horse-drawn carriages occasionally pass. The party-line telephone exchange crackles with distant voices, a reminder of the wider world beyond the autumnal hush that envelops Langley Manor."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "cool autumn evening with intermittent fog rolling in from surrounding woodlands",
    "timeFlow": "Three days of mounting tension, marked by dusk settling into foggy nights",
    "mood": "a quiet, intimate tension underscored by the era’s economic uncertainty and the shadow of rising European political unrest",
    "eraMarkers": [
      "domestic electric lighting with occasional outages",
      "manual typewriters for correspondence and record keeping",
      "party-line telephone exchange connecting manor to nearby village",
      "petrol-powered automobiles on unpaved estate roads",
      "horse-drawn carriages retained for estate use",
      "passenger trains connecting the nearest town to regional centers",
      "limited commercial aviation not routinely accessible"
    ],
    "sensoryPalette": {
      "dominant": "damp autumn leaves and cold stone underfoot",
      "secondary": [
        "faint crackle of hearth fires",
        "whisper of fog through ancient oaks"
      ]
    },
    "paragraphs": [
      "As dusk descends on Langley Manor, the creeping autumn fog curls through the dense woodlands and drapes the estate in a veil of muted grey. The air is sharp with the scent of damp earth and fallen leaves, and the occasional flicker of a candle or electric bulb glimmers through curtained windows. The silence is punctuated by distant birdcalls and the soft rustling of branches, suggesting both isolation and watchful stillness.",
      "Inside, the manor’s atmosphere balances warmth with restraint. Fires crackle low in hearths, casting amber glows on polished wood and faded tapestries. The scent of beeswax mingles with faint traces of pipe tobacco and aged paper, while the subtle chill of drafts through old sash windows reminds all of the estate’s venerable age. Time seems to slow here, weighted by tradition and the unspoken tensions of the era."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Langley Manor Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Walls lined with towering oak bookcases filled with leather-bound volumes, heavy velvet drapes drawn against the chill, a large mahogany desk cluttered with papers and a manual typewriter, a crackling fireplace set into a stone hearth, and a Persian rug worn at the edges.",
      "sensoryDetails": {
        "sights": [
          "flickering firelight on dark oak shelves",
          "dust motes in waning twilight",
          "faded leather spines with gilt lettering",
          "scattered papers and handwritten notes",
          "heavy velvet curtains absorbing light",
          "glint of brass desk lamp fittings"
        ],
        "sounds": [
          "crackling hearth-fire",
          "soft rustle of turning pages",
          "distant ticking of an old clock",
          "whispered footsteps on worn floorboards",
          "occasional creak of settling timber",
          "muted tapping of typewriter keys"
        ],
        "smells": [
          "old leather and polished wood",
          "faint scent of pipe tobacco smoke",
          "cold beeswax and ash",
          "musty parchment and ink",
          "dry autumn leaves pressed in books",
          "subtle hint of mothballs"
        ],
        "tactile": [
          "rough grain of oak desk surface",
          "velvet drapes soft to the touch",
          "crisp edges of paper sheets",
          "warmth radiating from fireplace bricks",
          "cool metal of brass lamp",
          "worn leather armchair cushions"
        ]
      },
      "accessControl": "Restricted to family and select guests during daytime; locked and off-limits after dinner; servants enter only for cleaning before dawn.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked sash windows",
            "grey light filtering through curtains",
            "glossy wet leaves outside window",
            "dimly lit rows of books",
            "shadowed corners softened by drizzle"
          ],
          "sounds": [
            "steady drumming on roof slates",
            "water trickling in stone gutters",
            "soft tapping of raindrops on glass",
            "muffled footsteps on wet gravel",
            "distant rumble of thunder"
          ],
          "smells": [
            "damp earth and wet stone",
            "petrichor from soaked garden beds",
            "cold, musty paper and ink",
            "fresh rain mingled with woodsmoke"
          ],
          "mood": "oppressive and contemplative"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light on oak shelves",
            "soft shadows without clear edges",
            "glimmer of polished wood surfaces",
            "scattered papers catching faint light",
            "heavy curtains drawn against chill"
          ],
          "sounds": [
            "silence broken by distant clock chimes",
            "creak of settling floorboards",
            "rustle of turning pages",
            "quiet scratching of pen on paper"
          ],
          "smells": [
            "beeswax polish",
            "aged leather bindings",
            "faint tobacco smoke",
            "dry woodsmoke lingering faintly"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on brass fittings",
            "long shadows stretching across rug",
            "glow of fireplace embers",
            "soft gleam on polished desk surface"
          ],
          "sounds": [
            "tick of mantel clock",
            "low murmur of voices from below",
            "fire crackling steadily",
            "quiet rustling of papers"
          ],
          "smells": [
            "warm beeswax",
            "smoke from burning logs",
            "tobacco and cold ash",
            "faint scent of lavender sachets"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Langley Manor library is a sanctuary of knowledge and quiet contemplation, its dark oak bookcases reaching to the ceiling and filled with leather-bound volumes that smell of age and dust. Heavy velvet curtains guard the windows against the evening chill, while a large mahogany desk bears the scattered detritus of recent correspondence and research. The crackling hearth-fire offers a faint warmth, its flickering light casting dancing shadows across the worn Persian rug.",
        "This room feels both intimate and confining, a place where secrets might be hidden among the rows of books or in the folds of the heavy drapes. The faint scent of pipe tobacco lingers in the air, mingling with the cold beeswax polish and the musty aroma of old paper. Sounds are muted here, with only the occasional creak of settling floorboards or the ticking of an ancient clock interrupting the stillness.",
        "Access is tightly controlled; family members and trusted guests may enter during the day, but after dinner the library is locked, preserving its mysteries until the next morning. Servants attend briefly before dawn to tidy, their presence marked only by the subtle disturbance of dust and faint echoes on the polished wood floor."
      ]
    },
    {
      "id": "garden_path",
      "name": "East Garden Gravel Path",
      "type": "exterior",
      "purpose": "Clue discovery and secret meetings",
      "visualDetails": "Narrow gravel path winding through clipped box hedges and late-blooming chrysanthemums, flanked by gnarled apple trees shedding autumn fruit, with glimpses of dense woodland beyond and wrought iron benches placed intermittently.",
      "sensoryDetails": {
        "sights": [
          "fading amber leaves on gravel",
          "shimmer of damp moss on stone edging",
          "twilight filtered through bare branches",
          "glossy red apples scattered on ground",
          "flickering lantern light from gatehouse",
          "shadowed outlines of distant trees"
        ],
        "sounds": [
          "crunch of gravel underfoot",
          "rustle of dry leaves in breeze",
          "distant call of an owl",
          "soft clink of gate latch",
          "whisper of wind through hedges",
          "occasional drip of lingering rain"
        ],
        "smells": [
          "earthy dampness of fallen leaves",
          "crisp scent of decaying fruit",
          "fresh pine and woodland resin",
          "faint trace of gardenia blooms",
          "cool autumn air tinged with smoke",
          "wet gravel and mossy stone"
        ],
        "tactile": [
          "rough gravel crunching beneath shoes",
          "cool metal of wrought iron bench",
          "damp texture of fallen leaves",
          "bark roughness on apple tree trunks",
          "chill autumn breeze on skin",
          "smooth stone edging under fingertips"
        ]
      },
      "accessControl": "Open to family and guests during daylight hours; restricted after dusk except for authorized staff; monitored by discreet garden staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-dappled gravel path",
            "glossy wet leaves and fruit",
            "grey mist hanging low over hedges",
            "droplets clinging to mossy stone"
          ],
          "sounds": [
            "steady patter of raindrops",
            "water dripping from branches",
            "soft squelch of soaked earth",
            "distant caw of crows"
          ],
          "smells": [
            "wet earth and decaying leaves",
            "fresh rain mingled with pine",
            "mossy dampness",
            "faint woodsmoke on breeze"
          ],
          "mood": "somber quietude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat, muted light on gravel",
            "shadowless hedges",
            "clouded sky through bare branches",
            "dim hues of late autumn flowers"
          ],
          "sounds": [
            "rustling leaves in still air",
            "distant drip of melting rain",
            "soft footsteps on gravel",
            "whisper of wind through trees"
          ],
          "smells": [
            "earthy dampness",
            "faint scent of garden herbs",
            "wet stone and moss",
            "cool air tinged with smoke"
          ],
          "mood": "reserved watchfulness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "silver light of rising moon",
            "glimmer of lanterns at gatehouse",
            "twinkling stars through bare branches"
          ],
          "sounds": [
            "soft rustle of night breeze",
            "distant hoot of owl",
            "occasional snap of twig",
            "quiet footsteps on gravel"
          ],
          "smells": [
            "crisp autumn air",
            "pine resin and damp earth",
            "smoke from distant chimneys",
            "faint scent of wild herbs"
          ],
          "mood": "secretive anticipation"
        }
      ],
      "paragraphs": [
        "The East Garden gravel path meanders quietly through the waning autumn foliage, bordered by neatly clipped box hedges and the gnarled trunks of apple trees heavy with fallen fruit. The air here carries the rich scent of damp earth and decaying leaves, mingling with the cool sharpness of pine resin from the nearby woodland. The path’s narrowness and winding course create natural concealment, making it a favored spot for hushed conversations or secretive movements.",
        "Lantern light from the distant gatehouse occasionally flickers through the trees, casting long shadows that stretch across the gravel and mossy stone edging. The crunch of footsteps on the path is muffled by the thick carpet of fallen leaves, while the soft rustle of drying chrysanthemums adds a fragile note to the evening stillness. The occasional clink of wrought iron benches offers a tactile contrast against the rough textures underfoot.",
        "Access is carefully managed; family and guests enjoy the garden during daylight hours, but after dusk the path is largely deserted except for authorized staff tending late tasks or discreetly observing. This isolation and the enclosing hedges make the East Garden path a place where clues might be hidden or meetings held away from prying eyes."
      ]
    },
    {
      "id": "servants_hall",
      "name": "Servants' Hall",
      "type": "interior",
      "purpose": "Gathering space for staff and potential overhearing of gossip",
      "visualDetails": "A modest room with plain wooden tables and benches, whitewashed walls with peeling paint, a large cast-iron stove dominating one corner, and a narrow window with iron bars overlooking the kitchen yard.",
      "sensoryDetails": {
        "sights": [
          "flickering stove firelight",
          "scuffed wooden floorboards",
          "simple crockery on tables",
          "peeling whitewash on walls",
          "iron bars on narrow window",
          "stacked firewood near stove"
        ],
        "sounds": [
          "clatter of metal cutlery",
          "murmurs of quiet conversation",
          "creak of wooden benches",
          "soft footsteps on stone floor",
          "clinking of enamel mugs",
          "occasional cough or clearing throat"
        ],
        "smells": [
          "stale cooking grease",
          "sweat and damp wool uniforms",
          "smoke from cast-iron stove",
          "suds of soap and damp cloth",
          "earthy scent of coal ash",
          "faint scent of boiled vegetables"
        ],
        "tactile": [
          "rough wooden bench surfaces",
          "warm cast-iron stove heat",
          "coarse wool of work uniforms",
          "cold stone threshold underfoot",
          "smooth enamel mug rims",
          "dampness in air against skin"
        ]
      },
      "accessControl": "Strictly for household staff during scheduled breaks; family and guests forbidden except on special occasions; entry logged by housekeeper.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through barred window",
            "steam rising from enamel mugs",
            "damp cloak hanging on peg",
            "wet footprints on stone floor"
          ],
          "sounds": [
            "steady drip of rain on roof",
            "murmurs over breakfast",
            "clink of spoons in bowls",
            "squelch of wet boots"
          ],
          "smells": [
            "wet wool and damp earth",
            "smoke from stove",
            "stale cooking aromas",
            "freshly boiled porridge"
          ],
          "mood": "weary camaraderie"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light on peeling walls",
            "empty tables awaiting use",
            "shadows pooling in corners",
            "neatly stacked firewood"
          ],
          "sounds": [
            "silence interrupted by distant kitchen sounds",
            "occasional creak of bench",
            "soft footsteps in hallway"
          ],
          "smells": [
            "lingering smoke and coal ash",
            "faint scent of soap",
            "dry dust on floorboards"
          ],
          "mood": "quiet anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from stove fire",
            "shadows flickering on walls",
            "uniforms folded on benches",
            "narrow window catching moonlight"
          ],
          "sounds": [
            "soft chatter of staff",
            "clinking of cups",
            "distant closing of doors",
            "low hum of settling house"
          ],
          "smells": [
            "smoke and soot",
            "earthy dampness",
            "cooked stew aromas",
            "faint scent of pipe tobacco"
          ],
          "mood": "relaxed vigilance"
        }
      ],
      "paragraphs": [
        "The servants’ hall is a humble refuge from the grandeur above stairs, its plain wooden tables and benches marked by years of use and the steady passage of household staff. The whitewashed walls bear peeling paint, evidence of the building’s age and the relentless demands placed upon it. A large cast-iron stove radiates warmth, its flickering flames the heart of the room during colder months.",
        "Through the narrow window barred with iron, the kitchen yard is visible, often slick with mud and puddles after rain. The air is thick with the mingled scents of stale cooking grease, damp wool uniforms, and the faint smoke from the stove. The room hums softly with quiet conversation and the clatter of cutlery during breaks, a place where gossip and news from the manor’s upper floors filter down.",
        "Access to this room is tightly controlled: only household staff gather here during prescribed breaks, and the housekeeper keeps a careful log of entries. For those seeking overheard secrets or insights into the daily rhythms of the manor, the servants’ hall is an invaluable vantage point, its atmosphere a blend of weary camaraderie and watchful alertness."
      ]
    },
    {
      "id": "gatehouse",
      "name": "Main Gatehouse",
      "type": "transitional",
      "purpose": "Access control and visitor reception",
      "visualDetails": "A small stone building flanking the wrought iron gates, featuring a tiled roof, shuttered windows, a heavy wooden door with iron fittings, and a lantern hanging beside the entrance. Gravel road stretches inward from the gates, lined with tall stone pillars topped by carved finials.",
      "sensoryDetails": {
        "sights": [
          "glint of iron gate bars",
          "worn stone pillars capped with finials",
          "flickering lantern light at dusk",
          "muddy ruts on gravel road",
          "shuttered window panes",
          "weathered timber door"
        ],
        "sounds": [
          "clank of gate hinges",
          "footsteps crunching on gravel",
          "distant echo of carriage wheels",
          "rustle of wind through nearby trees",
          "soft murmur of voices",
          "occasional birdcall"
        ],
        "smells": [
          "wet earth and damp stone",
          "smoke from gatehouse hearth",
          "horse sweat and leather tack",
          "fresh-cut wood from nearby stables",
          "smoky peat from village chimneys"
        ],
        "tactile": [
          "cold iron gate bars",
          "rough stone pillar surfaces",
          "smooth worn wood of door",
          "chilly autumn breeze on skin",
          "gravel crunching underfoot"
        ]
      },
      "accessControl": "Entry strictly monitored; visitors must announce arrival and be admitted by gatekeeper; estate staff pass according to schedule; locked tight after dusk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-slicked iron gates",
            "grey sky reflected on wet stone",
            "water pooling in gravel ruts",
            "mist swirling around pillars"
          ],
          "sounds": [
            "steady rain pattering on roof",
            "soft splash of boots in puddles",
            "distant lowing of cattle",
            "drip of water from eaves"
          ],
          "smells": [
            "wet leather and earth",
            "smoke from peat fire",
            "damp stone and moss",
            "fresh rain on wood"
          ],
          "mood": "somber vigilance"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on stone and iron",
            "shuttered windows casting shadows",
            "muddy gravel road",
            "clouded sky through bare trees"
          ],
          "sounds": [
            "rustle of wind in branches",
            "faint murmur of village sounds",
            "occasional creak of gate hinges"
          ],
          "smells": [
            "damp earth",
            "smoke and leather",
            "woodsmoke faint on breeze"
          ],
          "mood": "watchful waiting"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of lanterns",
            "long shadows on gravel",
            "moonlight on ironwork",
            "starry sky above treetops"
          ],
          "sounds": [
            "soft clank of closing gate",
            "quiet footsteps fading away",
            "distant dog barking",
            "rustle of night breeze"
          ],
          "smells": [
            "cool night air",
            "smoke from hearth",
            "earth and leather tack",
            "faint scent of autumn leaves"
          ],
          "mood": "guarded calm"
        }
      ],
      "paragraphs": [
        "The main gatehouse stands sentinel at the entrance to Langley Manor, a modest stone building with a tiled roof and shuttered windows that watch over the wrought iron gates. Heavy wooden doors and iron fittings speak to utility and security rather than comfort. The gravel road beyond is rutted and worn from years of estate traffic, flanked by tall stone pillars topped with carved finials that mark the boundary between the outside world and the secluded estate.",
        "Lanterns hang from wrought iron brackets, their flickering light casting long shadows in the autumn dusk. The air here is crisp and carries the mingled scent of damp earth, horse sweat from passing carriages, and smoky peat fires from the distant village. Sounds are often muted but keenly noticed: the clank of gate hinges, the crunch of approaching footsteps, or the distant echo of carriage wheels.",
        "Access is tightly controlled; visitors must announce themselves and be admitted by the gatekeeper, who maintains a strict schedule for estate staff movements. After dusk, the gates are locked and the gatehouse becomes a solitary outpost where vigilance is both a duty and a necessity."
      ]
    }
  ],
  "note": "",
  "cost": 0.007928124,
  "durationMs": 53444
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1932,
    "month": "April",
    "day": null,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "cool temperatures ranging from 45 to 60°F (7 to 15°C)",
      "frequent overcast skies with intermittent light rain showers",
      "early morning and late evening fog drifting from surrounding woodlands"
    ],
    "daylight": "Increasing daylight with sunsets around 7:30 PM; mornings bright by 6 AM but often misty",
    "time_of_day_of_crime": "Late evening — between 9 and 11 PM, when the household is winding down after dinner",
    "holidays": [
      "Easter Sunday (April 17, 1932)",
      "April Fools' Day (April 1)",
      "May Day preparations beginning late April"
    ],
    "seasonalActivities": [
      "Spring planting and garden maintenance in estate grounds",
      "Afternoon tea parties in sunrooms or garden terraces",
      "Early season country walks and bird watching in wooded areas"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Single-breasted wool suits in muted greys and browns",
        "Starched white shirts with detachable collars",
        "Silk ties with geometric Art Deco patterns"
      ],
      "casual": [
        "Knitted vests worn over shirts",
        "Tweed sports jackets with elbow patches",
        "Knickerbockers paired with long socks for country walking"
      ],
      "accessories": [
        "Homburg hats or flat caps",
        "Pocket watches with chain fobs",
        "Leather brogues polished to a shine"
      ]
    },
    "womensWear": {
      "formal": [
        "Day dresses with dropped waists and pleated skirts ending just below the knee",
        "Lightweight silk blouses with Peter Pan collars",
        "Tailored coats in pastel shades for outings"
      ],
      "casual": [
        "Knitted cardigans paired with calf-length skirts",
        "Cloche hats worn tightly over waved hair",
        "Practical leather Oxford shoes for estate grounds"
      ],
      "accessories": [
        "Long pearl necklaces and delicate brooches",
        "Gloves made of kid leather or fine cotton",
        "Small structured handbags with metal frames"
      ]
    },
    "trendsOfTheMoment": [
      "Emphasis on sleek, streamlined silhouettes influenced by Art Deco",
      "Use of light, pastel colors reflecting spring optimism",
      "Popularity of sportswear-inspired casual attire for country life"
    ],
    "socialExpectations": [
      "Men expected to wear hats and gloves when outdoors or visiting",
      "Women required to maintain modesty with knee-length skirts and covered shoulders",
      "Servants to present impeccable, simple uniforms and remain discreet"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Britain’s National Government faces rising unemployment and austerity debates amid Great Depression",
      "Labour unrest increasing with miners’ strikes in coal regions",
      "Political tensions growing in Europe as Adolf Hitler’s Nazi Party gains influence in Germany"
    ],
    "politicalClimate": "Marked by economic hardship and cautious political conservatism, with widespread concern over stability both at home and abroad",
    "economicConditions": "Severe unemployment nearing 20% in Britain, with many landed gentry estates tightening budgets and reducing staff",
    "socialIssues": [
      "Class disparities exacerbated by economic decline",
      "Growing calls for social reform and workers’ rights",
      "Emerging anxiety over international militarization and fascism"
    ],
    "internationalNews": [
      "Japan’s invasion of Manchuria continues to provoke global condemnation",
      "The League of Nations struggles to enforce peace amid rising global tensions"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Duke Ellington’s orchestral jazz recordings gaining UK popularity",
        "Gracie Fields’ music hall hits",
        "Dance band tunes by Ambrose and his Orchestra"
      ],
      "films": [
        "Dr. Jekyll and Mr. Hyde (1931) still screening in cinemas",
        "Grand Hotel (1932) acclaimed in London theaters",
        "The Public Enemy (1931) attracting attention for its gritty realism"
      ],
      "theater": [
        "Noël Coward’s plays such as 'Design for Living' performed in West End",
        "Operettas at local theaters providing escapist entertainment",
        "Revues featuring popular music and comedy sketches"
      ],
      "radio": [
        "BBC’s 'In Town Tonight' variety program",
        "News bulletins at 9 PM providing updates on domestic and international affairs",
        "Serialized radio dramas gaining audience in rural areas"
      ]
    },
    "literature": {
      "recentPublications": [
        "Agatha Christie’s 'Peril at End House' (1932) freshly released",
        "Virginia Woolf’s 'The Waves' (1931) circulating in literary circles",
        "John Steinbeck’s 'The Pastures of Heaven' (1932) noted in US literary reviews"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Modernist experimental literature",
        "Social realism addressing economic inequality"
      ]
    },
    "technology": {
      "recentInventions": [
        "Improvements in domestic electric lighting efficiency",
        "Development of portable battery-powered radios",
        "Advances in forensic fingerprint dusting powders"
      ],
      "commonDevices": [
        "Manual typewriters for correspondence",
        "Party-line telephones connecting country estates to villages",
        "Wireless radios used for news and entertainment"
      ],
      "emergingTrends": [
        "Increasing use of radios for mass communication",
        "Early experiments with sound film technology",
        "Growing reliance on electric appliances in middle and upper-class homes"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 3 pence",
        "A pint of milk: 1 penny",
        "Taxi ride across town: 1 shilling 6 pence"
      ],
      "commonActivities": [
        "Daily prayers and formal meals in estate dining rooms",
        "Afternoon tea served with delicate biscuits",
        "Country walks and tending to spring gardens"
      ],
      "socialRituals": [
        "Formal introduction of guests upon arrival",
        "Strict separation of family, guests, and servants in social spaces"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Rigid class distinctions accepted as natural and necessary for social order",
      "Deference to landed gentry and estate heads unquestioned in rural settings"
    ],
    "gender": [
      "Women expected to embody domestic grace and modesty",
      "Men assumed to be providers and public figures",
      "Increasing but limited female participation in workforce and politics"
    ],
    "race": [
      "Predominantly Eurocentric societal views with colonial attitudes common",
      "Limited awareness or presence of ethnic minorities in rural England"
    ],
    "generalNorms": [
      "Privacy and discretion prioritized especially within upper-class households",
      "Politeness and formal etiquette strictly observed",
      "Conservative moral values guiding behavior and dress"
    ]
  },
  "atmosphericDetails": [
    "The damp earth releases a rich scent after brief spring rains, mingling with faint wood smoke from estate chimneys",
    "Soft electric lighting flickers occasionally as the aging wiring strains under sporadic outages",
    "The distant hoot of an owl punctuates the stillness, while the rustle of budding leaves whispers in the cool breeze"
  ],
  "paragraphs": [
    "April 1932 in the English countryside is a time where the fresh optimism of spring is tempered by the lingering chill of economic hardship. The cool air carries intermittent fog rolling in from the surrounding woodlands, softening the edges of the sprawling country estate. Daylight lengthens, allowing for early morning garden work and afternoon walks, yet evenings fall swiftly into quiet shadows pierced only by the occasional flicker of electric lamps struggling against minor outages. Easter preparations bring a brief lift in spirits, with families gathering for formal teas and moments of reflection amid the estate's budding flora.",
    "Fashion this April reflects a blend of practicality and elegance suited to country life and social expectation. Gentlemen don tweed jackets and knickerbockers for daytime activities, switching to tailored wool suits and starched collars for formal dinners. Women embrace the new season in pastel silk dresses with dropped waists and cloche hats, often accessorized with pearl strands and kid gloves, their attire reflecting both the influence of Art Deco modernity and the reserved propriety expected within rural upper-class society. Servants maintain crisp uniforms, essential to the smooth running and strict hierarchy of the household.",
    "The cultural atmosphere pulses quietly with the tension of the wider world. Radio broadcasts bring news of rising political unrest in Europe and domestic struggles with unemployment, while also offering entertainment through music halls, dance bands, and serialized dramas. The manor’s library holds the latest detective novels by Agatha Christie, providing an escape from the day’s uncertainties. Social rituals emphasize discretion, with formal introductions, adherence to class divisions, and carefully maintained privacy. This delicate balance of tradition, emerging modernity, and looming global unease creates an intimate tension that lingers in the air, setting the perfect stage for mysteries to unfold."
  ],
  "note": "This temporal context is crafted to root the mystery firmly in April 1932 England, reflecting the cool, foggy spring evenings on a country estate during a period of social conservatism and economic uncertainty, complemented by authentic fashion, cultural references, and social dynamics of the early 1930s.",
  "cost": 0.003308836,
  "durationMs": 26129
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "Amidst the seclusion of a grand Georgian manor during the 1930s, the Langley family, their guests, and devoted staff are bound by strict social hierarchies and formal routines, all under the shadow of economic hardship and rising political unease, creating a tense atmosphere where discretion and loyalty are paramount.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Rigid class distinctions separate the aristocratic family, their invited guests, and the servant staff, with formal daily rituals reinforcing deference to the manor’s head and senior personnel, while economic pressures from the Great Depression heighten social anxieties and expectations of privacy."
  },
  "setting": {
    "location": "A large 18th-century Georgian manor house surrounded by extensive gardens and woodlands, several miles from the nearest village",
    "institution": "Country house estate",
    "weather": "Cool autumn evening with intermittent fog rolling in from surrounding woodlands"
  },
  "castAnchors": [
    "Inspector Gerald Havers",
    "Lady Beatrice Langley",
    "Charles Langley",
    "Margaret Langley",
    "Edward Barnes",
    "Agnes Crowley",
    "Thomas Radcliffe"
  ],
  "theme": "A classic murder mystery emphasizing intimate tension and the interplay of social roles within a confined, formal country estate setting."
}

### LOCKED_FACTS
[
  {
    "id": "bell_strike_time",
    "value": "twenty minutes past seven",
    "description": "Exact time the bell was mechanically struck"
  },
  {
    "id": "victim_death_time",
    "value": "ten minutes past seven",
    "description": "Time of victim’s death as per medical exam"
  },
  {
    "id": "tower_clock_stopped",
    "value": "half past seven",
    "description": "Time at which the bell tower clock stopped"
  },
  {
    "id": "echo_chamber_depth",
    "value": "six feet",
    "description": "Depth of the echo chamber causing sound delay"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 6,
    "mid": 13,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 19,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
      "id": "clue_9",
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
      "id": "clue_culprit_direct_charles_langley",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_14",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
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
      "category": "elimination"
    },
    {
      "id": "clue_17",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_18",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_19",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "physical"
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

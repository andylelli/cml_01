# Actual Prompt Record

- Run ID: `mystery-1784246493530`
- Project ID: ``
- Timestamp: `2026-07-17T00:05:30.347Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `7576bf7191ed3962`

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
    "title": "Reflections of Deceit",
    "author": "Agent 5",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Oceanview Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "optical illusion"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp and perceptive investigator",
      "private_secret": "Has a hidden connection to the victim",
      "motive_seed": "Curiosity",
      "motive_strength": "moderate",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Investigative access",
        "Social interactions"
      ],
      "behavioral_tells": [],
      "stakes": "Solving the mystery",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Witness",
      "relationships": [
        "Friend of victim"
      ],
      "public_persona": "Respected medical professional",
      "private_secret": "Has financial troubles",
      "motive_seed": "Desperation",
      "motive_strength": "low",
      "alibi_window": "10 minutes before death",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical knowledge"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Acquaintance of victim"
      ],
      "public_persona": "A retired naval officer",
      "private_secret": "Struggling with PTSD",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to hotel"
      ],
      "behavioral_tells": [],
      "stakes": "Honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Close friend of victim"
      ],
      "public_persona": "A charming socialite",
      "private_secret": "In love with victim",
      "motive_seed": "Unrequited love",
      "motive_strength": "high",
      "alibi_window": "30 minutes before death",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Social gatherings"
      ],
      "behavioral_tells": [],
      "stakes": "Heartbreak",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "25-35",
      "role_archetype": "Victim",
      "relationships": [
        "Acquaintance of victim"
      ],
      "public_persona": "A keen observer",
      "private_secret": "Knows too much about the others",
      "motive_seed": "Protection",
      "motive_strength": "high",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Safety",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "Friend of all cast members"
      ],
      "public_persona": "A wealthy businessman",
      "private_secret": "Involved in shady dealings",
      "motive_seed": "Covering his tracks",
      "motive_strength": "high",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Business interactions"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Dr. Mallory Finch"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In the shadow of a seaside hotel, a wealthy businessman is found dead, seemingly strangled by an unknown assailant. As the storm outside rages, a keen detective, Eleanor Voss, must unravel the web of deceit that is hiding the truth, aided by peculiar reflections and a series of misdirections."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A cleverly placed convex mirror redirects light, altering the perceived position of the murderer.",
      "delivery_path": [
        {
          "step": "Witness sees a reflection of a figure standing at the bar, misjudging their location."
        }
      ]
    },
    "outcome": {
      "result": "The murderer was actually positioned behind the mirror, making them appear to be somewhere they were not."
    }
  },
  "false_assumption": {
    "statement": "The murderer was seen standing directly at the bar when the crime was committed.",
    "type": "spatial",
    "why_it_seems_reasonable": "Witnesses saw a reflection that made it look like the figure was at the bar.",
    "what_it_hides": "The true position of the murderer behind the mirror."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses recall seeing him near the bar just before the murder.",
      "His military background gives him the skills to carry out such a crime."
    ],
    "the_one_flaw": "The angle of the reflection contradicts the physical position he could have been in.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A loud crash was heard from the dining room just before the murder.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "A waiter accidentally dropped a tray, unrelated to the murder.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A note was found in Hugo's pocket suggesting a meeting with Captain Hale.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "It was an old note about a different business deal.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "rationale": "All suspects were present at the hotel during the murder, and no outsiders had access."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Time of death estimated at 9:30 PM",
        "Witnesses recall seeing the reflection just before the murder."
      ],
      "windows": [
        "Alibi window for Dr. Mallory Finch is 10 minutes before death"
      ],
      "contradictions": [
        "Witnesses' conflicting accounts of the reflection's position."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "Convex mirror",
        "Bar area",
        "Dining room"
      ],
      "permissions": [
        "All suspects had access to the bar."
      ]
    },
    "physical": {
      "laws": [
        "Light reflects at equal angles, allowing for misdirection."
      ],
      "traces": [
        "Smudge on the convex mirror."
      ]
    },
    "social": {
      "trust_channels": [
        "Victim's reputation led to misplaced trust in certain individuals."
      ],
      "authority_sources": []
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "A faint smudge is found on the convex mirror near the bar.",
        "correction": "The smudge could indicate that the mirror was manipulated recently.",
        "effect": "Narrows suspect access to those who could have touched the mirror.",
        "required_evidence": [
          "Smudge on the convex mirror",
          "Witnesses recall the figure's unusual reflection angle"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witness statements indicate the figure seen was not standing at the bar but rather reflected from another angle.",
        "correction": "The figure was likely positioned behind the mirror, altering the witness's perception.",
        "effect": "Eliminates Captain Hale as he could not physically be in the position seen.",
        "required_evidence": [
          "Witness statements about the peculiar angle of the reflection",
          "Location of the convex mirror"
        ],
        "reader_observable": true
      },
      {
        "observation": "The angle of light hitting the convex mirror indicates a specific source.",
        "correction": "The direction of the light shows that only certain positions could create that reflection.",
        "effect": "Narrows opportunity channels to those who had access to the bar at that angle.",
        "required_evidence": [
          "Angle of light hitting the glass",
          "Physical layout of the bar area"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Setting up a controlled environment to observe the reflection of light on the convex mirror while guests are positioned in various spots.",
    "knowledge_revealed": "The revealed facts are position, reflection, and faint.",
    "pass_condition": "Only the true murderer can be seen in the correct position when the light is directed appropriately.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_1",
      "clue_2",
      "clue_fp_contradiction_step_3"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The smudge on the mirror (early) and witness statements (mid) provide the first clues about the reflection. Step 2: The angle of the reflection reveals the impossibility of Captain Hale's position (mid). Step 3: The controlled test demonstrates the only viable reflection position, confirming the true murderer."
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
        "Execute the discriminating test",
        "Observe the culprit's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": "controlled test"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Eliminating him as he could not be at the bar at that angle.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her alibi checks out with multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: None",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: None",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_1",
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
        "clue_id": "clue_5",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_6",
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
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Test result observation"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a charming socialite whose elegance hides a web of deceit and desperation.",
    "publicPersona": "Eleanor glides through the upper echelons of society, a vision of grace at every charity gala, her laughter ringing like a bell. She is the epitome of charm, captivating everyone around her with her wit and poise, as if she were born to the life of privilege she so desperately clings to.",
    "privateSecret": "Beneath the glitz, Eleanor is drowning in debts of her own making, siphoning funds from her charity to maintain her lavish lifestyle. The guilt gnaws at her, but the thrill of social climbing is too intoxicating to resist.",
    "motiveSeed": "With the prospect of inheriting a substantial estate, Eleanor sees a way out of her financial quagmire, a chance to secure her status and silence her creditors.",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have been at the beach during the murder, a convenient alibi that may not hold up under scrutiny.",
    "accessPlausibility": "possible",
    "stakes": "Should her secrets unravel, Eleanor faces not only a loss of reputation but the very foundation of her identity — her social standing.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a refined elegance, her words dripping with charm. She often employs subtle sarcasm, her laughter punctuating her sentences, though there's an edge to her wit that hints at deeper anxieties.",
    "signatureTic": "Oh, darling, isn't life just a delightful mess?",
    "internalConflict": "Eleanor struggles with the fear that her carefully constructed façade will shatter, exposing her as a fraud and leaving her with nothing.",
    "personalStakeInCase": "The murder could expose her embezzlement, unraveling her life and leaving her destitute.",
    "paragraphs": [
      "Eleanor Voss stands on the precipice of her carefully curated world, a socialite whose charm masks a tumultuous undercurrent of desperation. Every smile she offers is a calculated move, a step closer to securing her place among the elite. Yet, behind the facade of elegance lies a woman ensnared in a web of deceit, embezzling from her charity to fund a lifestyle she can barely afford. The stakes are high, and the pressure mounts as whispers of her financial misdeeds swirl around her.",
      "At charity events, Eleanor is the life of the party, effortlessly captivating her audience with stories of philanthropy and kindness. But within her heart, a storm brews; the debts she has incurred loom like a dark cloud over her future. With every laugh, she fears the laughter will turn to scorn, that her peers will see through her glamorous exterior to the desperate woman beneath. She has her sights set on a substantial inheritance, a golden ticket that could save her from the brink of ruin.",
      "Eleanor's alibi for the murder is as flimsy as the gowns she wears; she claims to have spent the evening at the beach, a place where she can feign innocence and bask in the moonlight while the truth waits, lurking in the shadows. The possibility of exposure sends shivers down her spine. The thought of losing her reputation is unbearable, yet the thrill of the social climb keeps her moving forward, even as the ground beneath her begins to crumble.",
      "In private moments, Eleanor wrestles with her moral compass, torn between the life she desires and the darkness of her actions. Each encounter with the victim, Hugo Vane, is a reminder of her precarious balance — he is the gatekeeper to her dreams and the harbinger of her downfall. As the investigation unfolds, she realizes that her desperation may lead her to make choices that she never thought herself capable of, pushing her closer to a reckoning she cannot escape."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician with a sinister secret lurking behind her kind demeanor.",
    "publicPersona": "With a reputation as a compassionate healer, Dr. Finch is the go-to physician for the affluent and influential, her gentle touch and warm smile earning her the trust of the community.",
    "privateSecret": "However, beneath this facade lies a darker truth; she has been conducting unauthorized experiments on her patients, driven by a relentless thirst for knowledge and a desperate need to protect her career.",
    "motiveSeed": "When the victim threatened to expose her malpractice, Mallory's world began to unravel, leaving her with no choice but to silence the threat permanently.",
    "motiveStrength": "compelling",
    "alibiWindow": "Dr. Finch claims she was in the kitchen with the staff during the murder, a plausible cover but one that could easily be tested.",
    "accessPlausibility": "easy",
    "stakes": "The potential loss of her medical license and the respect she has cultivated over the years hangs in the balance.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Dr. Finch speaks with a calm, nurturing tone, often punctuating her sentences with self-deprecating humor, as if to disarm those around her. She has a habit of using medical jargon, which she softens with a relatable story or personal anecdote.",
    "signatureTic": "Well, you know what they say — a little knowledge is a dangerous thing.",
    "internalConflict": "Dr. Finch grapples with the guilt of her unethical practices, torn between her desire for success and the morality of her actions.",
    "personalStakeInCase": "The murder investigation threatens to expose her malpractice, which could end her career and destroy her reputation.",
    "paragraphs": [
      "Dr. Mallory Finch is a pillar of the community, known for her gentle touch and reassuring demeanor. She is the doctor everyone turns to in times of need, her warm smile and comforting presence bringing solace to her patients. But beneath the surface, a darkness brews, as Dr. Finch has been engaging in unauthorized experiments, driven by a need to push the boundaries of medicine. The thrill of discovery has consumed her, yet so too has the fear of being discovered.",
      "When Hugo Vane threatened to reveal her malpractice, Mallory felt the ground shift beneath her. Her world, built on trust and respect, was suddenly at risk. Her alibi, claiming to be in the kitchen with the staff during the murder, is a precarious one, and she knows it. Each day that passes brings her closer to exposure, and the stakes couldn't be higher. The thought of losing her medical license is a nightmare she cannot entertain, yet the reality of her situation is all too real.",
      "In her interactions with others, Dr. Finch employs a self-deprecating humor that disarms her patients and colleagues alike. She often quips about her own shortcomings, as if to remind them that she is just as human as they are. But internally, she wrestles with guilt, torn between her ambition and the ethical lines she has crossed. Each patient she treats is a reminder of her transgressions, and the weight of her secrets grows heavier with each passing day.",
      "As the investigation unfolds, Dr. Finch finds herself at a crossroads. She could face the consequences of her actions and seek redemption, or she could manipulate the situation to her advantage, using her charm and intelligence to evade justice. The decision weighs heavily on her conscience, and as she navigates the treacherous waters of the investigation, she must confront the truth of who she is and what she is willing to sacrifice for her career."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a grizzled veteran haunted by his past, whose illegal dealings threaten to expose him.",
    "publicPersona": "With a commanding presence, Captain Hale is a retired naval officer respected for his service and authority. He often captivates audiences with tales of bravery and valor from his time in the navy.",
    "privateSecret": "However, beneath that stalwart exterior lies a man grappling with PTSD and engaging in illegal activities to cope with his trauma.",
    "motiveSeed": "When the victim threatened to expose his connections to the black market, Ivor found himself cornered, with no way out but silence.",
    "motiveStrength": "strong",
    "alibiWindow": "He claims to have been on a walk during the murder, a story that raises eyebrows given the circumstances.",
    "accessPlausibility": "unlikely",
    "stakes": "The exposure of his illegal activities could lead to imprisonment, shattering the remnants of his dignity.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Captain Hale speaks with a measured cadence, his words often carrying the weight of experience. He has a tendency to punctuate his narratives with dry wit, using anecdotes from his past to illustrate his points.",
    "signatureTic": "Every man has his battles, some just happen to be in the shadows.",
    "internalConflict": "Ivor battles with the ghosts of his past, torn between the man he was and the man he has become, struggling to confront his demons.",
    "personalStakeInCase": "The murder investigation could force him to confront his illegal dealings and the darker aspects of his character, risking everything he has built.",
    "paragraphs": [
      "Captain Ivor Hale stands tall, a figure of authority, yet beneath the surface, he is a man grappling with the ghosts of his past. The tales he tells of bravery and valor are laced with the bitterness of memory, each story a reminder of the battles he fought both on the seas and within himself. As a retired naval officer, he has earned respect, but that respect is a fragile veneer that could shatter at any moment.",
      "Haunted by PTSD, Ivor has sought solace in the shadows, engaging in illegal activities to cope with the demons that plague him. The threat of exposure looms large when Hugo Vane, the victim, threatens to reveal his connections to the black market. Ivor's alibi, a simple walk, feels flimsy in the face of scrutiny, and he knows that the truth could unravel his carefully constructed life.",
      "In conversation, Ivor's dry wit serves as both armor and weapon, a way to deflect probing questions and mask his vulnerabilities. He often shares anecdotes from his naval days, using humor to lighten the weight of his burdens. Yet, there is a heaviness to his words, a sense that he is recounting tales of a man who no longer exists. Each laugh is tinged with sorrow, a reminder that the battles fought in silence often leave the deepest scars.",
      "As the investigation unfolds, Ivor finds himself at a crossroads. He can either confront the darkness within him and seek redemption or continue to hide in the shadows, risking everything he has left. The stakes are high, and the path to redemption is fraught with peril. The choice lies before him, and with it, the potential for a new beginning or the final descent into the abyss."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a dedicated nurse whose compassion is tested by the cruelty of the wealthy patients she serves.",
    "publicPersona": "Known for her unwavering dedication, Beatrice is a compassionate nurse who tends to her patients with care and empathy, earning the respect of her colleagues.",
    "privateSecret": "Yet, beneath her nurturing exterior lies a simmering resentment towards the wealthy patients who mistreat her, pushing her to the brink.",
    "motiveSeed": "When the cruel and demanding victim became a source of torment, Beatrice's patience wore thin, leading her to consider drastic measures.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims she was attending to other patients in the hotel at the time of the murder, a plausible story but one that could be verified.",
    "accessPlausibility": "possible",
    "stakes": "Her reputation and job as a nurse hang in the balance, as accusations could lead to her dismissal.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks in a warm, nurturing tone, often using observational humor to connect with others. She has a tendency to share amusing anecdotes about her experiences with patients, which helps lighten the mood.",
    "signatureTic": "You know, sometimes I think patients should get a taste of their own medicine.",
    "internalConflict": "Beatrice struggles with her resentment and the desire to stand up for herself, questioning her role as a caregiver.",
    "personalStakeInCase": "The murder investigation threatens her job and reputation, forcing her to confront her feelings towards her patients.",
    "paragraphs": [
      "Beatrice Quill is the heart of the Oceanview Hotel, a nurse whose compassion shines through even the darkest of days. Her dedication to her patients is unwavering, earning her the trust and admiration of those who know her. But beneath the surface lies a growing resentment towards the wealthy patrons who often mistreat her, pushing her to the brink of her patience. Each cruel remark is a reminder of the imbalance of power, and she finds herself questioning her role as a caregiver.",
      "When the victim, a demanding and cruel patient, becomes a source of torment, Beatrice's resolve begins to fray. Her alibi — attending to other patients at the time of the murder — is plausible, yet she knows that scrutiny could unravel her carefully constructed life. The stakes are high; her job and reputation as a nurse are at risk, and the thought of being accused of murder sends shivers down her spine.",
      "In conversation, Beatrice employs observational humor, often sharing amusing anecdotes about her experiences with patients. Her warm, nurturing tone draws others in, creating an environment where laughter can flourish, even amidst tension. Yet, beneath the laughter, a storm brews. The resentment she harbors towards the wealthy patients who see her as little more than a servant threatens to consume her, pushing her towards a breaking point.",
      "As the investigation unfolds, Beatrice finds herself at a crossroads. She could continue to be the passive caregiver, or she could stand up for herself and confront the injustices she faces. The murder investigation forces her to reckon with her feelings, and as the pressure mounts, she must decide whether to embrace her role as a caregiver or break free from the chains of resentment that bind her."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a keen observer and writer, whose investigation into the murder could lead to personal liberation or familial ruin.",
    "publicPersona": "An astute writer known for her sharp wit, Sylvia is respected for her insightful articles that delve into the complexities of human nature.",
    "privateSecret": "However, she hides the fact that she is financially dependent on her wealthy relatives, a truth that complicates her sense of independence.",
    "motiveSeed": "Encouraged by her family to investigate their affairs under the guise of writing, Sylvia finds herself entangled in a web of secrets.",
    "motiveStrength": "weak",
    "alibiWindow": "Sylvia claims she was in her room working on a manuscript when the murder occurred, a story that could be easily verified.",
    "accessPlausibility": "easy",
    "stakes": "The potential to uncover family secrets could lead to her losing their support, jeopardizing her financial stability.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a measured tone, often laced with dry humor. She has a penchant for using literary references to illustrate her points and has a habit of posing rhetorical questions that invite deeper thought.",
    "signatureTic": "Isn't it fascinating how life mirrors fiction?",
    "internalConflict": "Sylvia grapples with her dependency on her family, torn between loyalty and the desire for independence.",
    "personalStakeInCase": "The outcome of the investigation could expose family secrets, threatening her financial stability and independence.",
    "paragraphs": [
      "Sylvia Trent navigates the world with the keen eye of an observer, her sharp wit and insightful articles earning her respect among peers. As a writer, she delves into the complexities of human nature, but behind her confident exterior lies a woman grappling with the weight of familial expectations. Financially dependent on her wealthy relatives, she often feels like a puppet dancing to their tune, and the strings are beginning to chafe.",
      "Encouraged by her family to investigate their affairs under the guise of writing, Sylvia finds herself entangled in a web of secrets that threaten to unravel her carefully constructed life. Her alibi — claiming to be in her room working on a manuscript — is easily verifiable, yet it feels like a flimsy shield against the scrutiny of those who would seek to expose her.",
      "In conversation, Sylvia employs dry humor, often punctuating her observations with literary references that invite deeper thought. She has a habit of posing rhetorical questions, encouraging others to reflect on their own lives. This intellectual approach serves as both a defense mechanism and a way to connect with others, yet it often leaves her feeling isolated, as if she is an observer in her own life.",
      "As the investigation unfolds, Sylvia finds herself at a crossroads. The potential to uncover family secrets looms large, and with it, the risk of losing their support. She grapples with her loyalty to her family versus her desire for independence, and as the pressure mounts, she must decide whether to embrace her role as a writer or break free from the constraints that bind her."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Oceanview Hotel",
    "type": "Hotel",
    "place": "Scarborough",
    "country": "England",
    "summary": "A grand seaside hotel with Art Deco flair, perched on the rugged cliffs of Scarborough, offering stunning ocean views and a sense of isolation.",
    "visualDescription": "The hotel features smooth, geometric lines and chrome accents, with a sweeping staircase leading to a polished marble lobby. Ocean-view balconies overlook crashing waves, while the dining room's large windows frame dramatic coastal vistas. Dark wood paneling in the lounge adds warmth to the cool, salty air.",
    "atmosphere": "A tense and suspenseful atmosphere, steeped in post-war unease.",
    "paragraphs": [
      "Nestled atop the cliffs of Scarborough, the Oceanview Hotel stands as a relic of the 1940s, its Art Deco architecture a stark contrast to the rugged natural landscape. The grand entrance, flanked by polished chrome and glass, opens to a lobby filled with the soft hum of early evening conversations, punctuated by the distant crash of waves against the rocks below. The air is charged with a sense of isolation, the hotel seemingly cut off from the outside world, as storm clouds gather on the horizon, casting a grey pall over the gathering dusk.",
      "Inside, the scent of damp sea air mingles with the rich aroma of tobacco and varnished wood, creating an atmosphere thick with secrets. The lounge, with its plush chairs and low lighting, invites hushed whispers, while the dining room, adorned with nautical motifs, serves as a backdrop for both laughter and tense exchanges. As guests gather, the shadows lengthen, and the oppressive weight of unspoken words hangs heavily in the air, a reminder of the turmoil that still lingers in the hearts of those who survived the war.",
      "With each passing hour, the hotel transforms. The distant sound of thunder echoes through the halls, and the flickering lights hint at a storm brewing outside. As the rain begins to patter against the windows, it becomes clear that the Oceanview Hotel holds more than just memories of sunlit summers; it is a stage for betrayal and deceit, where every corner could conceal a clue or a threat. The isolation of the cliffs, combined with the sense of mounting tension, sets the stage for a mystery that begs to be unraveled."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of coastal areas during the fall",
    "timeFlow": "Days of mounting tension leading to a stormy climax",
    "mood": "Tense and suspenseful, reflecting post-war anxieties",
    "eraMarkers": [
      "Art Deco architecture",
      "early radio broadcasts",
      "post-war automobiles parked outside",
      "rationed wartime vehicles"
    ],
    "sensoryPalette": {
      "dominant": "Salty air filled with tension",
      "secondary": [
        "Warm wood and tobacco aromas",
        "Crisp echoes of distant thunder"
      ]
    },
    "paragraphs": [
      "The Oceanview Hotel looms over the jagged cliffs, a fortress against the stormy sea, its Art Deco lines softened by the mist. Inside, the atmosphere thickens with anticipation, as the sounds of rain against the windows blend with the low murmur of conversations. Each guest wears a mask, their eyes flickering with secrets and unease, while the smell of damp wood and tobacco fills the air, a reminder of the past lingering just beneath the surface.",
      "With every passing hour, the tension escalates. The distant rumble of thunder becomes a symphony of dread, while the scent of wet stone and saltwater creeps through the cracks in the walls. The hotel, isolated on the cliffs, stands as both refuge and prison, its corridors whispering of hidden intentions and unspoken fears. In this space, the line between friend and foe blurs, and the truth remains elusive, shrouded in the fog of deception."
    ]
  },
  "keyLocations": [
    {
      "id": "lounge",
      "name": "The Grand Lounge",
      "type": "interior",
      "purpose": "Gathering space for guests, a hub of conversation and intrigue",
      "visualDetails": "A spacious room adorned with Art Deco furnishings, plush velvet sofas, and low tables, illuminated by soft wall sconces casting warm glows.",
      "sensoryDetails": {
        "sights": [
          "plush velvet armchairs",
          "geometric patterns on the carpet",
          "soft light from sconces",
          "ocean views through large windows"
        ],
        "sounds": [
          "soft jazz music from a radio",
          "murmurs of conversation",
          "clinking glasses",
          "the crackle of a log fire"
        ],
        "smells": [
          "freshly brewed coffee",
          "cigarette smoke",
          "polished wood and varnish",
          "salt from the sea air"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cool marble tabletops",
          "warmth from the fireplace",
          "smooth brass fixtures"
        ]
      },
      "accessControl": "Open to all guests during operational hours; staff access for cleaning and maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on glass",
            "misty ocean views",
            "dim light through clouds",
            "faded colors of the decor"
          ],
          "sounds": [
            "steady rain on the roof",
            "soft whispers of early risers",
            "the crackle of a radio",
            "distant thunder"
          ],
          "smells": [
            "damp wood",
            "freshly brewed tea",
            "mildew from the humidity",
            "salt from the ocean"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light filtering through clouds",
            "shadows stretching across the floor",
            "dimly lit corners",
            "empty chairs at tables"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the rustle of newspaper pages",
            "the low hum of conversation",
            "the creak of an old floorboard"
          ],
          "smells": [
            "dust from the carpet",
            "tobacco lingering in the air",
            "old leather from furniture",
            "the scent of varnish"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting on glass",
            "people gathered in intimate groups",
            "glittering ocean in the distance"
          ],
          "sounds": [
            "laughter echoing in the room",
            "the clinking of cutlery",
            "the soft strum of a guitar",
            "the murmur of the waves outside"
          ],
          "smells": [
            "grilled seafood from the kitchen",
            "freshly baked bread",
            "warmth of candle wax",
            "the scent of wine"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lounge is a hub of activity, where guests gather to exchange stories and secrets. Plush velvet armchairs invite relaxation, while the warm glow of sconces casts an intimate atmosphere over hushed conversations. The scent of freshly brewed coffee mingles with the salty tang of the sea, creating an intoxicating blend that draws people in. As the rain begins to fall outside, the sound of jazz music from the radio provides a comforting backdrop to the growing tension in the air.",
        "In the late afternoon, the lounge transforms into a place of uneasy stillness. Shadows deepen as the grey light filters through the windows, and the once lively chatter fades into whispers. The lingering smell of tobacco and dust creates an oppressive atmosphere, leaving guests feeling as if they are being watched. With each creak of the floorboards, the sense of foreboding grows, and the lounge becomes a stage for hidden agendas and unspoken fears."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Dining Room",
      "type": "interior",
      "purpose": "Formal dining area for guests, a setting for meals and discussions",
      "visualDetails": "Elegantly set tables with crisp white linens, polished silverware, and large windows offering stunning ocean views.",
      "sensoryDetails": {
        "sights": [
          "elegantly set dining tables",
          "crystal chandeliers above",
          "ocean waves crashing outside",
          "fresh flowers adorning each table"
        ],
        "sounds": [
          "clinking of silverware",
          "soft murmurs of conversation",
          "the rustle of napkins",
          "the hum of kitchen activity"
        ],
        "smells": [
          "roasted meats and vegetables",
          "fresh bread from the oven",
          "aromas of fine wines",
          "the scent of polished wood"
        ],
        "tactile": [
          "smooth linen tablecloths",
          "cold silver cutlery",
          "warmth of freshly baked bread",
          "crispness of napkins"
        ]
      },
      "accessControl": "Open during meal times; staff access for service and cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "dim morning light",
            "empty tables waiting for guests",
            "wet pavement outside"
          ],
          "sounds": [
            "soft patter of rain",
            "the clinking of dishes from the kitchen",
            "the rustling of menus",
            "the hum of the coffee machine"
          ],
          "smells": [
            "freshly baked pastries",
            "the scent of brewing coffee",
            "dampness in the air",
            "the aroma of sizzling bacon"
          ],
          "mood": "calm anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across tables",
            "dim light filtering through clouds",
            "empty chairs at tables",
            "the ocean churning outside"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the murmur of distant conversations",
            "the creak of the old building"
          ],
          "smells": [
            "cooked fish and chips",
            "the aroma of vinegar",
            "the scent of lemon and herbs",
            "the lingering smell of past meals"
          ],
          "mood": "tense unease"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering across tables",
            "elegant place settings",
            "the sun setting over the ocean",
            "guests laughing and talking"
          ],
          "sounds": [
            "the hum of conversation",
            "the clinking of glasses",
            "soft laughter echoing",
            "the distant sound of waves"
          ],
          "smells": [
            "grilled seafood and herbs",
            "the scent of rich desserts",
            "the aroma of fine wines",
            "the warmth of baked bread"
          ],
          "mood": "suspenseful delight"
        }
      ],
      "paragraphs": [
        "The Dining Room at the Oceanview Hotel exudes elegance, with its beautifully set tables and stunning ocean views. Crystal chandeliers cast a warm glow over the room, creating an inviting atmosphere for guests. The enticing aromas of roasted meats and freshly baked bread waft through the air, blending with the sounds of clinking silverware and soft conversations. As the rain patters against the windows, guests share stories and laughter, unaware of the secrets lurking just beneath the surface.",
        "In the late afternoon, the atmosphere shifts to one of tense unease. Shadows stretch across the tables as the light dims, and the sound of distant thunder rumbles ominously outside. The scent of cooked fish and chips fills the air, but the laughter has faded, replaced by nervous whispers. The ocean churns violently outside, mirroring the turmoil within the hotel, as guests find themselves caught in a web of deception and intrigue."
      ]
    },
    {
      "id": "kitchen",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Staff-only area for food preparation and storage",
      "visualDetails": "A bustling space filled with stainless steel appliances, large pots, and an array of fresh ingredients, with staff moving quickly about their tasks.",
      "sensoryDetails": {
        "sights": [
          "stainless steel countertops",
          "large pots simmering on the stove",
          "fresh produce stacked high",
          "staff in crisp white uniforms"
        ],
        "sounds": [
          "clanging of pots and pans",
          "the sizzling of food cooking",
          "shouting orders from the head chef",
          "the hum of refrigeration units"
        ],
        "smells": [
          "savory spices and herbs",
          "the scent of roasting meat",
          "freshly baked bread",
          "the aroma of vegetables sautéing"
        ],
        "tactile": [
          "cool metal surfaces",
          "warmth from the ovens",
          "smoothness of fresh produce",
          "the weight of heavy pots"
        ]
      },
      "accessControl": "Restricted to kitchen staff during operational hours; monitored access at all times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "wet floors from morning cleaning",
            "staff preparing for breakfast rush",
            "fresh produce being washed",
            "steam rising from pots"
          ],
          "sounds": [
            "the drip of rain outside",
            "the chatter of staff",
            "the clatter of dishes",
            "the hum of kitchen equipment"
          ],
          "smells": [
            "freshly baked pastries",
            "the scent of brewing coffee",
            "dampness in the air",
            "the aroma of sizzling bacon"
          ],
          "mood": "busy urgency"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim lighting from cloudy skies",
            "staff preparing for dinner service",
            "ingredients being chopped",
            "pans lined up for cooking"
          ],
          "sounds": [
            "the clatter of utensils",
            "the sizzling of food on the stove",
            "the hum of conversation among staff",
            "the ticking of a wall clock"
          ],
          "smells": [
            "the aroma of simmering sauces",
            "fresh herbs and spices",
            "the scent of grilled meats",
            "the lingering smell of baked goods"
          ],
          "mood": "tense focus"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "brightly lit kitchen",
            "staff hustling to serve guests",
            "dishes being plated with care",
            "steam rising from hot food"
          ],
          "sounds": [
            "the bustle of staff at work",
            "the clanging of dishes",
            "the laughter of chefs",
            "the sound of food sizzling"
          ],
          "smells": [
            "the scent of rich sauces",
            "smoky aromas from grilling",
            "the sweetness of desserts baking",
            "the freshness of herbs"
          ],
          "mood": "excited anticipation"
        }
      ],
      "paragraphs": [
        "The kitchen is a whirlwind of activity, bustling with staff preparing for the day’s meals. Stainless steel countertops gleam under the bright lights, while the scent of savory spices and fresh produce fills the air. Clattering pots and pans create a symphony of sound, punctuated by the head chef’s orders echoing through the room. The atmosphere is charged with busy urgency as the team works in harmony to create culinary delights for the guests.",
        "As the afternoon deepens, the kitchen takes on a more focused tone. The dim light filtering through the windows casts shadows on the staff as they chop and sauté with precision. The aroma of simmering sauces wafts through the air, mingling with the scent of grilled meats, creating an enticing backdrop to the tension building within the hotel. Each dish prepared is not just a meal; it’s a piece of the larger puzzle that will unfold as night falls."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Outdoor area for guests to relax and enjoy ocean views",
      "visualDetails": "A secluded terrace with wrought iron furniture, surrounded by low walls and potted plants, offering panoramic views of the stormy sea.",
      "sensoryDetails": {
        "sights": [
          "storm clouds gathering overhead",
          "ocean waves crashing against cliffs",
          "wrought iron furniture",
          "potted plants swaying in the wind"
        ],
        "sounds": [
          "howling wind through the railings",
          "the roar of the ocean below",
          "the distant rumble of thunder",
          "the rustling of leaves"
        ],
        "smells": [
          "salt from the ocean air",
          "fresh rain on stone",
          "the scent of damp earth",
          "the aroma of blooming flowers"
        ],
        "tactile": [
          "cold metal furniture",
          "wet stone underfoot",
          "the chill of the sea breeze",
          "smooth petals of flowers"
        ]
      },
      "accessControl": "Restricted to guests; staff can access for maintenance and cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops clinging to flower petals",
            "grey skies above",
            "mist rolling over the ocean",
            "puddles forming on the terrace"
          ],
          "sounds": [
            "steady rain hitting the ground",
            "the distant sound of thunder",
            "the rustle of wet leaves",
            "the splash of waves"
          ],
          "smells": [
            "damp earth and stone",
            "the scent of rain-soaked flowers",
            "salt in the air",
            "the freshness of morning"
          ],
          "mood": "melancholic introspection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light filtering through clouds",
            "waves crashing against the cliffs",
            "swaying plants in the wind",
            "distant flashes of lightning"
          ],
          "sounds": [
            "the roar of the ocean",
            "the rush of wind",
            "the creak of metal furniture",
            "the distant rumble of thunder"
          ],
          "smells": [
            "fresh sea air",
            "the scent of wet stone",
            "the aroma of rain-soaked plants",
            "the tang of salt in the breeze"
          ],
          "mood": "foreboding tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "stars beginning to twinkle",
            "the ocean glistening under moonlight",
            "guests gathered around for drinks"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "soft laughter and chatter",
            "the clinking of glasses",
            "the rustle of leaves in the breeze"
          ],
          "smells": [
            "the scent of blooming flowers",
            "the freshness of the sea air",
            "the aroma of cocktails",
            "the warmth of candle wax"
          ],
          "mood": "romantic anticipation"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers a breathtaking view of the stormy sea, its wrought iron furniture standing resolutely against the elements. As the wind howls and the clouds gather ominously overhead, the scent of salt and damp earth fills the air, creating a raw, invigorating atmosphere. The distant roar of waves crashing against the cliffs adds a sense of drama to the setting, drawing guests outside to witness nature’s fury. It’s a place where secrets can be shared, but also where danger lurks in the shadows.",
        "In the afternoon, the terrace takes on a foreboding tone, with the ocean churning violently below and flashes of lightning illuminating the sky. The air is thick with tension as guests huddle together, their laughter replaced by nervous glances at the brewing storm. The scent of wet stone and sea salt hangs heavily in the air, a reminder that the beauty of this place can quickly turn into chaos. Here, amidst the growing darkness, the lines between safety and peril blur, setting the stage for the mysteries that await."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028332876,
  "durationMs": 52832
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "April",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "overcast with occasional rain",
      "mild temperatures around 50°F",
      "the scent of wet earth after showers"
    ],
    "daylight": "Days are lengthening, with daylight lasting until around 7:30 PM, and the light is soft and diffused due to cloud cover.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests settle in for the night.",
    "holidays": [
      "Easter Sunday (April 4, 1948)"
    ],
    "seasonalActivities": [
      "spring cleaning in hotels and homes",
      "Easter egg hunts in parks",
      "local flower festivals celebrating blooms"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "lightweight wool trousers",
        "crisp white dress shirt"
      ],
      "casual": [
        "tweed jacket",
        "slacks with suspenders",
        "button-up shirt with rolled sleeves"
      ],
      "accessories": [
        "silk tie with geometric patterns",
        "fedora hat",
        "classic leather shoes polished to a shine"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress in pastel colors",
        "tailored blazer with a nipped waist",
        "stylish gloves"
      ],
      "casual": [
        "floral print blouse",
        "high-waisted skirt",
        "light cardigan for cooler evenings"
      ],
      "accessories": [
        "pearl necklace",
        "small clutch purse",
        "hat adorned with flowers or ribbons"
      ]
    },
    "trendsOfTheMoment": [
      "post-war elegance with a focus on femininity",
      "utilitarian styles for men reflecting practicality",
      "vintage influences from the 1920s and 1930s returning"
    ],
    "socialExpectations": [
      "men are expected to dress formally for work and social events",
      "women are encouraged to embrace post-war fashion while balancing work roles",
      "social gatherings often include discussions of political events and personal experiences of war"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the Berlin Blockade begins, heightening tensions in Europe",
      "the United States is adjusting to the post-war economy",
      "trials for war criminals continue to dominate headlines"
    ],
    "politicalClimate": "The political climate is tense, with Cold War anxieties manifesting in public discourse and policies.",
    "economicConditions": "Struggling to recover from wartime scarcity, many families face rationing, particularly for clothing and food.",
    "socialIssues": [
      "displacement of war refugees",
      "struggles for civil rights gaining momentum",
      "debates surrounding women's rights in the workforce"
    ],
    "internationalNews": [
      "the formation of NATO is announced",
      "the first successful test of a jet engine in commercial aviation",
      "growing unrest in colonial territories as independence movements rise"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Nature Boy' by Nat King Cole",
        "'Mule Train' by Frankie Laine",
        "'It's Magic' by Doris Day"
      ],
      "films": [
        "'The Red Shoes'",
        "'Key Largo'",
        "'Gentleman's Agreement'"
      ],
      "theater": [
        "'A Streetcar Named Desire'",
        "'The King and I'",
        "'The Glass Menagerie'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Lone Ranger'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Naked and the Dead' by Norman Mailer",
        "'The Catcher in the Rye' by J.D. Salinger",
        "'Brave New World' by Aldous Huxley"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "post-war realism",
        "social commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "transistor radio",
        "improvements in radar technology",
        "the first commercial jet airliner"
      ],
      "commonDevices": [
        "television sets becoming more common in urban households",
        "typewriters and early computing devices for businesses",
        "household appliances like refrigerators and washing machines"
      ],
      "emergingTrends": [
        "increased use of mass media for advertising",
        "growing interest in home entertainment systems",
        "early computer technology being tested for various applications"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Pint of milk: one shilling"
      ],
      "commonActivities": [
        "attending local theater performances",
        "gathering for community picnics",
        "participating in church events and social clubs"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "local dances and social gatherings",
        "book clubs discussing popular literature"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "the upper class shows distinct fashion and lifestyle choices post-war",
      "the middle class is striving for a semblance of normalcy",
      "the working class faces economic challenges with resilience"
    ],
    "gender": [
      "women are increasingly entering the workforce but still face societal pressures to conform to traditional roles",
      "men returning from war are expected to find stable jobs",
      "gender roles are beginning to shift subtly in urban areas"
    ],
    "race": [
      "racial tensions are beginning to surface more prominently",
      "integration efforts are met with both resistance and support",
      "the civil rights movement is gaining early momentum in some regions"
    ],
    "generalNorms": [
      "community involvement is highly valued",
      "there is a growing emphasis on family and stability",
      "political discussions are common and often heated in social settings"
    ]
  },
  "atmosphericDetails": [
    "The smell of damp earth fills the air as spring rains sweep through the coastal hotel, cloaking everything in a veil of mist.",
    "Guests gather in the hotel lobby, their laughter mingling with the sound of rain tapping against the windows, creating a tense yet vibrant atmosphere.",
    "The dimly lit hallways are adorned with fresh flowers, their colors muted by the overcast sky, hinting at the delicate balance between hope and underlying anxiety."
  ],
  "paragraphs": [
    "In April 1948, the coastal hotel stands as a refuge amidst a world still recovering from the ravages of World War II. The air is thick with the scent of wet earth from the recent showers, and guests bustle about, their attitudes reflecting the lingering tensions of the post-war era. Overhead, the clouds hang low, casting a gray hue over the scene, which matches the somber moods of many. The conversations are punctuated by laughter, but often turn to the political climate, as news of the Berlin Blockade spreads through the hotel like wildfire.",
    "Fashion in this spring of 1948 is a blend of post-war elegance and practicality. Men don double-breasted navy suits paired with crisp white shirts, while women favor tea-length dresses in pastel shades, accessorized with stylish gloves and pearl necklaces. The influence of previous decades is evident, with both men and women embracing vintage styles, yet there remains a clear focus on the practicality necessary for everyday life. This season, the tension between tradition and modernity is palpable, mirrored in the elegant yet functional attire of the hotel patrons.",
    "Daily life at the hotel is marked by the routines of its guests, who navigate the complexities of a society grappling with change. A loaf of bread costs a mere four pence, and Sunday dinners are a cherished ritual, where families gather to reconnect. Movies and theater are popular diversions, with patrons discussing the latest films over drinks in the lobby. As women increasingly join the workforce, social norms are shifting, yet the expectations of gender roles still linger, creating an atmosphere of quiet rebellion and hope for the future."
  ],
  "note": "",
  "cost": 0.00112140105,
  "durationMs": 17091
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of disparate guests at a seaside hotel confront their intertwined fates amidst the societal upheaval of post-WWII, where the pressures of emerging Cold War tensions and shifting gender roles create an atmosphere ripe for deception.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Class distinctions blur as women enter the workforce, while the specter of war and the Cold War foster suspicion and anxiety among the guests."
  },
  "setting": {
    "location": "A remote seaside hotel with Art Deco architecture",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an optical method, where a mirror-and-lens reflection falsified a witness's sightline across the room."
}

### LOCKED_FACTS
[
  {
    "id": "mirror_angle",
    "value": "thirty degrees",
    "description": "The angle at which the mirror was positioned."
  },
  {
    "id": "witness_distance",
    "value": "ten feet",
    "description": "The distance from the witness to the mirror."
  },
  {
    "id": "time_of_murder",
    "value": "a quarter past nine",
    "description": "The exact time the murder occurred."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 8,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
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
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_5",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
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
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
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

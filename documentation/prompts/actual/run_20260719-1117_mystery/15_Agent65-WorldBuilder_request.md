# Actual Prompt Record

- Run ID: `mystery-1784459833247`
- Project ID: ``
- Timestamp: `2026-07-19T11:20:06.642Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `15d6e1454092a4f2`

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
    "title": "The Delayed Demise",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Coastal Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "delayed-action poison"
    }
  },
  "death_method": "poisoned with a botanical toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "public_persona": "Charismatic socialite",
      "private_secret": "In debt due to gambling",
      "motive_seed": "Blackmail",
      "motive_strength": "high",
      "alibi_window": "8:00 PM - 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "tea service",
        "dinner gathering"
      ],
      "behavioral_tells": [
        "anxiety over finances"
      ],
      "stakes": "Social reputation",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "35-45",
      "role_archetype": "Female Doctor",
      "relationships": [
        "Eleanor Voss",
        "Hugo Vane"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Discovered Eleanor's debts",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM - 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "tea service"
      ],
      "behavioral_tells": [
        "nervousness about recent events"
      ],
      "stakes": "Professional integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Military Officer",
      "relationships": [
        "Eleanor Voss",
        "Beatrice Quill"
      ],
      "public_persona": "Gallant captain",
      "private_secret": "In love with Eleanor",
      "motive_seed": "Desperation",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM - 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "dinner gathering"
      ],
      "behavioral_tells": [
        "intense focus on Eleanor"
      ],
      "stakes": "Romantic relationship",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Friend",
      "relationships": [
        "Eleanor Voss",
        "Sylvia Trent"
      ],
      "public_persona": "Charming hostess",
      "private_secret": "Envious of Eleanor's popularity",
      "motive_seed": "Jealousy",
      "motive_strength": "low",
      "alibi_window": "8:00 PM - 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "tea service"
      ],
      "behavioral_tells": [
        "sarcastic comments about Eleanor"
      ],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Socialite",
      "relationships": [
        "Eleanor Voss",
        "Hugo Vane"
      ],
      "public_persona": "Diligent organizer",
      "private_secret": "Unrequited feelings for Hugo",
      "motive_seed": "Revenge",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM - 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "dinner gathering"
      ],
      "behavioral_tells": [
        "overly friendly"
      ],
      "stakes": "Emotional turmoil",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [
        "Eleanor Voss",
        "Dr. Mallory Finch"
      ],
      "public_persona": "Astute investigator",
      "private_secret": "Knows Eleanor's secrets",
      "motive_seed": "Protective",
      "motive_strength": "high",
      "alibi_window": "8:00 PM - 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel staff",
        "dinner gathering"
      ],
      "behavioral_tells": [
        "calm under pressure"
      ],
      "stakes": "Reputation as a detective",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
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
      "summary": "At a charity gala at a coastal hotel, Eleanor Voss is found dead after consuming tea, leading to a complex investigation that reveals hidden motives and a clever murder method."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead after tea was served.",
      "The tea was unusually warm when served.",
      "Witnesses reported Eleanor's anxiety over her financial situation."
    ],
    "inferred_conclusions": [
      "The timing of Eleanor's death suggests a delayed-action poison.",
      "Dr. Mallory Finch had access to the tea service.",
      "The motive for murder relates to Eleanor's financial troubles."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on service, poison, and witness to expose the false timing.",
      "delivery_path": [
        {
          "step": "The heat-sensitive vial containing the poison melts when the tea reaches a critical temperature, releasing the toxin slowly."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor's death is ruled a murder due to the delayed-action poison."
    }
  },
  "false_assumption": {
    "statement": "Eleanor died from a heart attack due to her anxiety.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses noted her anxiety and the timing of her death.",
    "what_it_hides": "The true cause was the slow-acting poison in the tea."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses reported seeing him near the tea service shortly before Eleanor's death.",
      "He had expressed concern over Eleanor's gambling debts."
    ],
    "the_one_flaw": "Hale had no access to the poison or the tea service mechanism.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses claim to have seen Captain Hale leave the tea service area shortly before Eleanor's collapse.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "Hale was actually assisting another guest with a sick child.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A note found in Eleanor's room suggesting she was being blackmailed.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The note was written by Eleanor herself, indicating her own desperation.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the gala, and no outsiders could have committed the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Tea was served at 8:30 PM",
        "Eleanor was found at 9:15 PM"
      ],
      "windows": [
        "Death occurred between 9:00 PM and 9:15 PM"
      ],
      "contradictions": [
        "Eleanor's symptoms did not align with a heart attack."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Tea service",
        "Poison vial"
      ],
      "permissions": [
        "Only the host had access to the tea service."
      ]
    },
    "physical": {
      "laws": [
        "Poison's effects can be delayed based on dosage."
      ],
      "traces": [
        "No physical struggle evident at the scene."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust the staff to serve safe food and drink."
      ],
      "authority_sources": [
        "Hotel management assured the safety of all food."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall that the tea served to Eleanor was unusually warm.",
        "correction": "This suggests that the poison may have been activated by the heat of the tea.",
        "effect": "Narrows the focus to the tea service as a possible source of poison.",
        "required_evidence": [
          "Witness statements about the warmth of the tea.",
          "Testimony from the hotel staff regarding the tea service."
        ],
        "reader_observable": true
      },
      {
        "observation": "A small vial is found in the tea service area.",
        "correction": "This vial likely contains the poison used in Eleanor's murder, indicating premeditation.",
        "effect": "Eliminates Captain Ivor Hale as a suspect due to lack of access to the poison.",
        "required_evidence": [
          "Description of the vial found.",
          "Access records showing Hale's absence from the tea service area."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory Finch was seen near the tea service shortly before Eleanor's collapse.",
        "correction": "Her access to the tea and knowledge of Eleanor's condition suggest she could have poisoned the tea.",
        "effect": "Narrows the suspect pool to Dr. Mallory Finch.",
        "required_evidence": [
          "Witnesses confirming Finch's proximity to the tea service.",
          "Finch's knowledge of Eleanor's health issues."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares service, witness, and recall against the claimed timeline.",
    "knowledge_revealed": "The mechanism confirms that only Dr. Mallory Finch had the means to execute the poisoning.",
    "pass_condition": "If the vial melts under observed conditions, it proves the method of murder.",
    "evidence_clues": [
      "clue_culprit_direct_1",
      "clue_5",
      "clue_7",
      "clue_culprit_direct_dr_mallory_finch"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witnesses' observations about the tea's heat (early) and the vial found (mid) lead the reader to question the cause of Eleanor's death. Step 2: Finch's proximity to the tea service narrows the suspect pool (mid). Step 3: The controlled reenactment (discriminating test) confirms the poisoning method."
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
      "test_type": ""
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proving his absence from the tea service area.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness statements indicating she was occupied with guests.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified by hotel staff.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 8:00 PM - 10:00 PM",
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_12",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_9",
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
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Vial discovery"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, the charming hotel manager, maintains an air of elegance while concealing a web of deceit beneath her polished facade.",
    "publicPersona": "Charming and composed, Eleanor presents herself as a capable leader who keeps the hotel running smoothly.",
    "privateSecret": "She embezzled funds from the hotel to fund her luxurious lifestyle and is desperate to cover her tracks.",
    "motiveSeed": "Eleanor stands to lose her position and face criminal charges if the victim exposes her financial misdeeds.",
    "motiveStrength": "strong",
    "alibiWindow": "was in the kitchen preparing for a dinner event during the time of death",
    "accessPlausibility": "easy",
    "stakes": "Maintaining her reputation and freedom.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Eleanor speaks with a measured tone, often punctuating her sentences with soft laughter, giving the impression of light-heartedness even in serious matters. She occasionally slips into formalities, especially when discussing the hotel's affairs.",
    "signatureTic": "Well, that's just the way the cookie crumbles, isn't it?",
    "internalConflict": "Eleanor grapples with guilt over her embezzlement while desperately trying to maintain her carefully constructed image.",
    "personalStakeInCase": "This crime threatens her very existence, as the exposure of her financial misdeeds could lead to her downfall and ruin her reputation.",
    "paragraphs": [
      "Eleanor Voss stands at the helm of the coastal hotel, her presence a blend of grace and authority. Guests admire her effortless poise, yet behind the scenes, she is a woman on the brink. A recent scheme to embezzle funds has spiraled into a nightmare, and with the victim’s untimely demise, Eleanor feels the noose tightening around her neck. The charming smile she wears is a mask, hiding the panic that simmers just beneath the surface.",
      "In the kitchen, her fingers deftly whip up a soufflé, but her mind is far from the culinary task at hand. The clattering dishes and bustling staff serve as a backdrop to her racing thoughts. What if someone discovers her secret? The thought of losing her position, and worse, facing criminal charges, sends shivers down her spine. She has poured her soul into this hotel, and the thought of it crumbling under the weight of her deception is unbearable.",
      "Eleanor's interactions are laced with subtle undertones of tension. She uses humor as a shield, often delivering dry quips that seem to downplay her internal turmoil. 'Well, that's just the way the cookie crumbles, isn't it?' she chuckles, even when the stakes are dire. It's a coping mechanism, a way to maintain control in a world that feels increasingly chaotic. But as she navigates her dual existence, the lines between her public persona and private guilt begin to blur.",
      "As the investigation unfolds, Eleanor is forced to confront the consequences of her actions. The stakes have never been higher, and the pressure mounts with each passing day. She must decide whether to continue down the path of deceit or confront the truth of her unethical behavior. In a world where appearances are everything, will she risk it all to save her reputation, or will she find the strength to make amends before it's too late?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a once-respected physician, now battles envy and desperation, torn between ambition and integrity.",
    "publicPersona": "Respected in her field, Mallory is seen as a dedicated doctor who puts her patients first.",
    "privateSecret": "She is envious of the victim's recent success and is struggling with her own career stagnation.",
    "motiveSeed": "Mallory believed the victim planned to expose her past medical malpractice, jeopardizing her career.",
    "motiveStrength": "compelling",
    "alibiWindow": "attending to patients at a nearby clinic, unverified by witnesses",
    "accessPlausibility": "possible",
    "stakes": "Defending her career and reputation.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a clinical precision, her words carefully chosen and often laced with a hint of sarcasm. She has a habit of pausing before answering questions, as if weighing her words against the weight of her secrets.",
    "signatureTic": "Oh, the irony is positively delicious, isn't it?",
    "internalConflict": "Mallory's envy of the victim's success gnaws at her conscience, forcing her to question her own ambitions and moral compass.",
    "personalStakeInCase": "The crime threatens to unearth her past mistakes, potentially ruining her career and exposing her vulnerabilities to the world.",
    "paragraphs": [
      "Dr. Mallory Finch is a woman of science, yet her life has become a tangled web of envy and ambition. Once a promising physician, she now finds herself overshadowed by the victim’s meteoric rise. In the sterile confines of her clinic, she meticulously attends to her patients, yet her mind drifts to thoughts of Eleanor Voss, whose success feels like a dagger to Mallory's pride. 'Oh, the irony is positively delicious, isn't it?' she muses to herself, bitterness creeping into her voice.",
      "As she moves through her day, Mallory’s demeanor remains professional, but the jealousy festers beneath her composed exterior. The whispers of her past medical malpractice haunt her, and the fear of exposure looms large. She suspects that Eleanor may have been preparing to expose her secrets, and the thought sends a chill down her spine. The stakes are high, and the pressure to maintain her reputation mounts with each passing moment.",
      "Her interactions with others are punctuated by a dry wit, often masking the turmoil within. Mallory's humor serves as both a shield and a weapon, allowing her to navigate the complexities of her relationships while keeping her vulnerabilities hidden. Yet, as the investigation unfolds, she becomes increasingly aware that her envy could lead her down a dark path, one that may cost her everything she has worked for.",
      "In the face of mounting evidence and suspicion, Mallory must confront the truth of her feelings. Will she succumb to the darkness of her ambition, or will she find the strength to embrace integrity and make amends for her past? The choices she makes in the coming days will determine not only her future but the very essence of who she is."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a disgraced naval officer, grapples with the ghosts of his past while facing the consequences of his present.",
    "publicPersona": "A decorated veteran, Ivor is admired for his service but struggles with his post-war identity.",
    "privateSecret": "He is deeply in debt and had resorted to blackmailing the victim to fix his financial troubles.",
    "motiveSeed": "Ivor needed the victim to keep silent about his blackmail, which involved sensitive information from their past.",
    "motiveStrength": "strong",
    "alibiWindow": "was reported to be on a walk along the beach during the time of death, but no witnesses can confirm",
    "accessPlausibility": "possible",
    "stakes": "His dignity and financial stability are on the line.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor often speaks in a gruff, straightforward manner, occasionally softening with self-deprecating humor that hints at his inner turmoil. His sentences are clipped, reflecting both military precision and a reluctance to reveal too much.",
    "signatureTic": "Just a sailor adrift in a storm, I suppose.",
    "internalConflict": "Ivor battles with feelings of shame over his financial desperation and the blackmail that has ensnared him in a web of deceit.",
    "personalStakeInCase": "The crime threatens to expose his blackmail scheme, potentially ruining his already tarnished reputation and leaving him without a lifeline.",
    "paragraphs": [
      "Captain Ivor Hale stands at the edge of the beach, the salty breeze tousling his graying hair. Once a decorated naval officer, he now feels like a relic of a bygone era, struggling to find his place in a world that has moved on without him. The weight of his past hangs heavy on his shoulders, compounded by the crushing debt that has driven him to desperate measures. 'Just a sailor adrift in a storm, I suppose,' he mutters to himself, the irony of his situation not lost on him.",
      "Ivor's life has become a series of calculated risks, and the blackmail of the victim is a gamble he never expected to take. The information he possesses is like a noose around his neck, tightening with each passing day. As he walks along the beach, he wrestles with the consequences of his actions, haunted by memories of honor and duty that now feel like distant echoes.",
      "In conversation, Ivor's demeanor is gruff, his words often short and to the point. Yet, when the opportunity arises, he employs self-deprecating humor to mask the shame of his predicament. The laughter that escapes his lips is tinged with bitterness, a defense mechanism against the harsh realities he faces. 'Well, if I had a nickel for every bad decision I’ve made…' he quips, but the jest falls flat against the backdrop of his spiraling life.",
      "As the investigation unfolds, Ivor finds himself at a crossroads. The stakes have never been higher, and the fear of exposure looms large. Will he continue down the path of deceit, or will he muster the courage to confront the ghosts of his past? The choices he makes in the days to come will determine not only his fate but also his chance at redemption."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious journalist, finds herself at a crossroads as her desire for success clashes with her hidden relationship.",
    "publicPersona": "Beatrice is a young and ambitious writer eager to make a name for herself in the competitive world of journalism.",
    "privateSecret": "She had been secretly dating the victim and feared their relationship would damage her career if discovered.",
    "motiveSeed": "Beatrice's fear of scandal drove her to consider drastic measures to protect her reputation and career.",
    "motiveStrength": "moderate",
    "alibiWindow": "was out getting coffee for the hotel staff during the time of death, which can be corroborated",
    "accessPlausibility": "easy",
    "stakes": "Her burgeoning career and public image are at risk.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a youthful exuberance, often punctuating her sentences with a touch of sarcasm. She has a tendency to weave stories into her conversations, making her sound both engaging and slightly verbose.",
    "signatureTic": "Well, isn’t that just the cherry on top?",
    "internalConflict": "Beatrice wrestles with the fear that her secret relationship could ruin her career, leading her to question her values and ambitions.",
    "personalStakeInCase": "The crime threatens to expose her relationship with the victim, potentially jeopardizing her burgeoning career and public image.",
    "paragraphs": [
      "Beatrice Quill is a whirlwind of ambition, her pen poised to carve her name into the annals of journalism. Yet beneath the vibrant exterior lies a tangled web of secrets. Her relationship with the victim has become a ticking time bomb, and as she navigates the competitive landscape of her profession, the fear of scandal looms large. 'Well, isn’t that just the cherry on top?' she muses, sarcasm lacing her words as she confronts the absurdity of her situation.",
      "In her quest for success, Beatrice has often relied on her charm and wit, but the stakes have never felt higher. While fetching coffee for the hotel staff, her mind races with thoughts of what might happen if her relationship with Eleanor is exposed. The idea sends shivers down her spine; her career is just beginning to take off, and the thought of it unraveling fills her with dread.",
      "Beatrice's speech is lively, her words tumbling out in a rush, often accompanied by a sardonic twist. She has an innate ability to weave narratives, making even mundane conversations feel like grand tales. Yet, as the investigation unfolds, the urgency of her situation transforms her playful banter into a shield against the encroaching reality. Her laughter becomes a mask, hiding the turmoil that brews within.",
      "As she grapples with her internal conflict, Beatrice faces a critical decision. Will she allow her ambition to overshadow her values, or will she find the courage to stand up for what is right, even if it means risking everything? The choices she makes in the days to come will not only shape her future but also define the woman she ultimately becomes."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a wealthy socialite, struggles with envy and the emptiness of her privileged existence, masking her insecurities with charm.",
    "publicPersona": "Sylvia is well-connected and uses her influence to support charitable causes, appearing generous and kind.",
    "privateSecret": "She is envious of the victim's success and feels overshadowed in their social circle.",
    "motiveSeed": "Sylvia believed the victim's ascendance would diminish her social standing, pushing her to consider eliminating the competition.",
    "motiveStrength": "moderate",
    "alibiWindow": "was hosting a social event in another part of the hotel, where guests can confirm her presence.",
    "accessPlausibility": "easy",
    "stakes": "Preserving her social position and elite status.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Sylvia speaks with a refined eloquence, often using flowery language that masks her sharp wit. She has a tendency to deliver biting remarks wrapped in compliments, showcasing her polite savagery.",
    "signatureTic": "Oh, darling, isn’t life just a delightful mess?",
    "internalConflict": "Sylvia struggles with feelings of inadequacy and the fear that her social standing is slipping away, leading her to question her values.",
    "personalStakeInCase": "The crime threatens to shatter her carefully curated image, potentially exposing her jealousy and insecurity to her social circle.",
    "paragraphs": [
      "Sylvia Trent glides through the hotel with an air of effortless grace, her laughter ringing like chimes in the wind. A wealthy socialite, she is the epitome of charm, deftly maneuvering through her social obligations. Yet beneath the polished exterior lies a tempest of envy, fueled by the victim’s recent success. 'Oh, darling, isn’t life just a delightful mess?' she quips, masking her insecurity with a smile that barely reaches her eyes.",
      "In the world of high society, Sylvia has always been the one to host grand events, showcasing her wealth and influence. However, the rise of Eleanor Voss has cast a long shadow over her carefully constructed image. The thought of being overshadowed by the victim gnaws at her, planting seeds of jealousy that threaten to bloom into something darker. As she mingles with guests at a charity event, the tension within her simmers just below the surface.",
      "Sylvia’s eloquence is a double-edged sword; her words are often laced with polite savagery, allowing her to deliver cutting remarks disguised as compliments. 'What a lovely outfit, dear. It must be so refreshing to wear something so... unique,' she says, her tone dripping with insincerity. It's a defense mechanism, a way to deflect attention from her own insecurities while maintaining her social facade.",
      "As the investigation unfolds, Sylvia is forced to confront the emptiness of her social ambitions. The stakes are high, and the fear of losing her position in the social hierarchy weighs heavily on her. Will she allow her envy to consume her, or will she find the strength to seek genuine connections beyond the superficiality of her world? The choices she makes in the coming days will define not only her future but also her understanding of true worth."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a charming traveling salesman, walks a precarious line between opportunism and honesty, grappling with the consequences of his actions.",
    "publicPersona": "Hugo is charming and persuasive, often seen as a smooth talker in business.",
    "privateSecret": "He has been exploiting his connections to smuggle goods post-war, risking legal consequences.",
    "motiveSeed": "Hugo wanted the victim to cover for him regarding a recent deal gone wrong, fearing exposure.",
    "motiveStrength": "weak",
    "alibiWindow": "checked into the hotel just hours before the murder, but his whereabouts during the crime are unclear.",
    "accessPlausibility": "possible",
    "stakes": "Avoiding legal trouble and maintaining his business reputation.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with a smooth, persuasive cadence, often peppering his conversations with observational humor. He has a tendency to sidestep direct questions, using charm to navigate difficult topics.",
    "signatureTic": "Ah, the fine art of persuasion, my friend.",
    "internalConflict": "Hugo feels the weight of his choices pressing down on him, torn between the allure of opportunism and the desire for genuine connections.",
    "personalStakeInCase": "The crime could expose his illicit dealings, jeopardizing his reputation and the fragile connections he has built.",
    "paragraphs": [
      "Hugo Vane struts into the hotel lobby with the confidence of a man who knows how to sell ice to an Eskimo. A traveling salesman, he is well-versed in the fine art of persuasion, yet beneath the charm lies a man grappling with the consequences of his choices. 'Ah, the fine art of persuasion, my friend,' he often says, a smirk playing on his lips as he navigates the murky waters of his post-war dealings.",
      "As he checks into the hotel, Hugo's mind races with thoughts of recent transactions that have teetered on the edge of legality. The smuggling of goods has become a dangerous game, and the last thing he needs is for the victim to expose his misdeeds. The stakes are high, and the pressure to maintain his reputation weighs heavily on him. He can’t shake the feeling that the walls are closing in, and with each passing moment, the risk grows.",
      "In conversation, Hugo employs a smooth, persuasive rhythm, often using observational humor to deflect attention from his dubious dealings. He sidesteps direct questions with ease, his charm serving as a shield against scrutiny. Yet, as the investigation unfolds, he finds himself increasingly aware of the precarious line he walks. The allure of opportunism clashes with a growing desire for authenticity, leaving him in a state of internal conflict.",
      "As the investigation deepens, Hugo must confront the reality of his situation. Will he continue to exploit his connections for personal gain, or will he recognize the value of honesty and genuine relationships? The choices he makes in the coming days will not only determine his fate but also challenge his understanding of what it truly means to connect with others."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Seascape Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A striking coastal hotel that blends Victorian elegance with Art Deco flair, perched precariously on a cliff overlooking the turbulent sea.",
    "visualDescription": "The hotel features grand arches and intricate moldings, with shimmering glass and chrome accents that reflect the waves below. The lobby, with its high ceilings and sweeping staircase, is bathed in soft light from elegant chandeliers, while the scent of salt and sea permeates the air.",
    "atmosphere": "An uneasy blend of elegance and foreboding, the Seascape Hotel stands as a relic of a bygone era, caught in the grip of post-war uncertainties.",
    "paragraphs": [
      "Perched on the edge of a craggy cliff, the Seascape Hotel commands a breathtaking view of the churning sea below. Built in the early 1900s, its architecture exhibits a distinctive fusion of Victorian opulence and the sleek lines of Art Deco, symbolizing a time when elegance was paramount. The lobby, expansive and grand, is adorned with plush velvet furnishings and gleaming brass fixtures, casting an inviting yet haunting aura, as if the very walls hold secrets of past guests. Dim light filters through the tall windows, illuminating the swirling fog that often envelops the coastal landscape, creating an atmosphere thick with suspense.",
      "As guests navigate the narrow hallways, the faint sound of waves crashing against the rocks below mingles with the distant hum of a radio playing soft jazz, a reminder of the world outside. This isolated hotel, five miles from the nearest town, feels like a world unto itself, where whispers of wartime secrets and post-war aspirations echo through the corridors. The air is tinged with the scent of damp wood and sea salt, a constant reminder of its precarious position on the cliff's edge. Each room, while offering stunning views, feels like a potential trap, with thin walls that barely contain the conversations and secrets shared within.",
      "In the evenings, as the fog thickens, the atmosphere shifts. The once-vibrant lobby becomes a shadowy space where guests exchange nervous glances, their laughter tinged with unease. The grand staircase, leading to the upper floors, creaks ominously with each step, as if warning of the mysteries hidden above. The hotel staff, efficient yet watchful, monitor the comings and goings, ensuring that access to restricted areas remains tightly controlled. It is here, amidst the elegance and isolation, that the stage is set for a chilling revelation, where every guest becomes a suspect and every shadow holds a clue."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Foggy with occasional rain, typical of coastal climates in the 1940s",
    "timeFlow": "A tense weekend of unraveling mysteries and hidden truths",
    "mood": "Tense and uneasy, with a sense of impending change due to post-war adjustments",
    "eraMarkers": [
      "Radio broadcasting soft jazz in the lobby",
      "Early television set flickering in the lounge",
      "Post-war automobile parked outside",
      "Wartime rationing affecting guest supplies"
    ],
    "sensoryPalette": {
      "dominant": "The salty tang of the sea air",
      "secondary": [
        "Soft glow of antique chandeliers",
        "Melancholic strains of jazz music"
      ]
    },
    "paragraphs": [
      "The Seascape Hotel, with its majestic view of the roiling sea, stands as a testament to a time when elegance met the encroaching shadows of change. Fog swirls around the cliffside, softening the edges of reality, while the distant sound of waves crashing creates a hypnotic rhythm that lulls guests into a false sense of security. Yet, beneath this facade of tranquility, the air is thick with tension, as whispers of the past and fears of the future intertwine, creating an atmosphere ripe for intrigue.",
      "Guests wander the narrow hallways, their footsteps echoing softly against the polished marble floors, a reminder of the isolation that surrounds them. The faint crackling of radio broadcasts filters through the walls, offering brief distractions from the mounting unease. As night falls, the once-vibrant lobby dims, casting long shadows that dance along the walls, hinting at the secrets waiting to be uncovered within this grand yet foreboding establishment."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Ocean View Suite",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Luxurious furnishings juxtaposed with a chaotic scene, glass shattered on the floor, curtains billowing from an open window.",
      "sensoryDetails": {
        "sights": [
          "shattered glass on carpet",
          "billowing lace curtains",
          "upturned champagne bottle",
          "faded family photographs",
          "ocean waves crashing below"
        ],
        "sounds": [
          "distant waves crashing",
          "whispering wind through the window",
          "faint ticking of a clock",
          "soft footsteps outside",
          "muffled voices from the hallway"
        ],
        "smells": [
          "scent of spilled champagne",
          "salt air from the ocean",
          "dusty upholstery",
          "faint floral perfume",
          "moisture from the fog"
        ],
        "tactile": [
          "cold shards of glass",
          "soft silk of curtains",
          "worn velvet armchair",
          "smooth surface of a table",
          "chill draft from the window"
        ]
      },
      "accessControl": "Access restricted to hotel staff and investigators; guests are prohibited from entering.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down glass",
            "grey light filtering through curtains",
            "dark puddles outside",
            "mist rolling in from the sea",
            "overcast sky"
          ],
          "sounds": [
            "steady patter of rain",
            "distant thunder rumbling",
            "water dripping from eaves",
            "soft rustle of wet leaves",
            "quiet footsteps in the hallway"
          ],
          "smells": [
            "damp earth and seaweed",
            "fresh rain on asphalt",
            "wet stone and wood",
            "faint aroma of coffee",
            "clean scent of rain"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light through heavy clouds",
            "shadows pooling in corners",
            "still ocean reflecting grey sky",
            "faded wallpaper peeling slightly",
            "flickering light from a lamp"
          ],
          "sounds": [
            "silence broken by distant clock",
            "creaking of old wood",
            "soft rustle of fabric",
            "muffled conversations from below",
            "occasional thud from the hallway"
          ],
          "smells": [
            "musty scent of damp fabric",
            "scent of old books",
            "faint woodsmoke in the air",
            "hint of mildew",
            "dust from the corners"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting orange glow",
            "long shadows from furniture",
            "glimmer of stars outside",
            "soft flicker of candlelight",
            "reflections in the window"
          ],
          "sounds": [
            "soft murmur of voices",
            "gentle clinking of glasses",
            "distant laughter from the lobby",
            "the tick of a clock",
            "occasional rustle of fabric"
          ],
          "smells": [
            "scent of candle wax",
            "hint of tobacco smoke",
            "faint aroma of dinner being prepared",
            "freshly polished wood",
            "cool evening air"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Ocean View Suite, once a picturesque retreat, now lies in disarray. Shattered glass glints ominously on the plush carpet, remnants of a celebration turned tragic. The curtains, caught in the salty breeze, flutter like ghostly apparitions, while the remnants of a spilled champagne bottle lie in stark contrast to the chaos. Faded family photographs hang crookedly on the walls, their subjects forever frozen in happier times, now overshadowed by the chilling events that have transpired. The sound of waves crashing against the cliff below creates a haunting backdrop, echoing the turmoil that fills the room.",
        "As investigators step through the threshold, the air is thick with the scent of spilled champagne, mingling with salt from the ocean and the mustiness of the fog. Each detail, from the cold shards of glass underfoot to the chill draft coming through the open window, serves as a reminder of the night’s events. Outside, the ocean roars, while inside, the silence is deafening, broken only by the faint ticking of a clock, counting down the moments until the next revelation emerges from the shadows."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Expansive hall with high ceilings, adorned with Art Deco chandeliers and plush seating areas, overlooking the ocean through large windows.",
      "sensoryDetails": {
        "sights": [
          "elegant Art Deco chandeliers",
          "plush velvet armchairs",
          "tall windows framing the sea",
          "ornate marble flooring",
          "faded floral wallpaper"
        ],
        "sounds": [
          "soft chatter of guests",
          "clinking of glasses",
          "background jazz music",
          "distant footsteps on marble",
          "rustle of newspapers"
        ],
        "smells": [
          "freshly brewed coffee",
          "scent of polished wood",
          "hint of perfume",
          "faint aroma of baked goods",
          "salt air wafting in"
        ],
        "tactile": [
          "smooth marble underfoot",
          "plush fabric of armchairs",
          "cool glass of a drink",
          "warmth of sunlight through windows",
          "crisp pages of newspapers"
        ]
      },
      "accessControl": "Open to all guests; staff monitors behavior and interactions.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "grey light spilling inside",
            "glistening marble floors",
            "wet umbrellas in the foyer",
            "damp guests shaking off rain"
          ],
          "sounds": [
            "steady patter of rain on glass",
            "muffled conversations outside",
            "soft laughter from inside",
            "the creak of doors opening",
            "rushing water in the gutters"
          ],
          "smells": [
            "fresh rain on pavement",
            "damp fabric from umbrellas",
            "scent of wet earth",
            "aroma of hot tea",
            "hint of mildew in corners"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "shadows pooling in corners",
            "faded colors of wallpaper",
            "stillness of seated guests",
            "flickering lights above"
          ],
          "sounds": [
            "silence punctuated by coughs",
            "soft rustle of fabric",
            "muffled conversations from corners",
            "occasional laughter from the bar",
            "the tick of a clock"
          ],
          "smells": [
            "scent of stale air",
            "hint of burnt toast",
            "aroma of overbrewed coffee",
            "faint floral scent",
            "dust settling on furniture"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from chandeliers",
            "glow of sunset through windows",
            "guests mingling with drinks",
            "sparkle of crystal glassware"
          ],
          "sounds": [
            "laughter filling the air",
            "clinking of glasses",
            "soft jazz playing in the background",
            "the rustle of evening dresses",
            "the pop of champagne corks"
          ],
          "smells": [
            "scent of fine tobacco",
            "aroma of rich desserts",
            "freshly polished wood",
            "hint of perfume in the air",
            "smoky scent from the fireplace"
          ],
          "mood": "sophisticated revelry"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of the Seascape Hotel serves as a bustling hub for guests, a place of elegance and social interaction where the air is thick with anticipation. Art Deco chandeliers hang from the high ceilings, casting a warm glow over the plush velvet armchairs arranged in inviting clusters. Large windows frame the tumultuous sea, offering a breathtaking view that draws the eye while simultaneously trapping a sense of foreboding within the space. The marble flooring reflects the soft light, creating an atmosphere of opulence that belies the tensions simmering just beneath the surface.",
        "As guests gather, the sounds of soft jazz blend with the clinking of glasses and the murmur of conversation, creating a symphony of social life. The scent of freshly brewed coffee and baked goods wafts through the air, mingling with the salty tang of sea breeze that sneaks in through the open windows. However, as the day wears on and shadows lengthen, an undercurrent of unease begins to permeate the lobby, as guests exchange furtive glances and whispers, each one aware that the hotel holds secrets waiting to be revealed."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Oceanview Dining Room",
      "type": "interior",
      "purpose": "Dining and socializing space",
      "visualDetails": "Elegant dining space with floor-to-ceiling windows, adorned with white tablecloths and polished silverware, offering stunning views of the ocean.",
      "sensoryDetails": {
        "sights": [
          "crisp white tablecloths",
          "gleaming silver cutlery",
          "floor-to-ceiling windows",
          "freshly arranged floral centerpieces",
          "glasses glimmering in candlelight"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft murmur of conversations",
          "gentle music from a string quartet",
          "the rustle of napkins",
          "distant sound of waves crashing"
        ],
        "smells": [
          "aroma of grilled seafood",
          "scent of fresh herbs",
          "hint of citrus from desserts",
          "freshly baked bread",
          "smoky scent from the kitchen"
        ],
        "tactile": [
          "smooth texture of fine china",
          "coolness of crystal glasses",
          "soft fabric of napkins",
          "warmth from candle flames",
          "weight of silver cutlery"
        ]
      },
      "accessControl": "Open to guests during meal times; staff manages reservations and seating.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops trickling down windows",
            "darkened tables waiting for breakfast",
            "fog obscuring the view outside",
            "dim light from overhead fixtures",
            "wet floor reflecting light"
          ],
          "sounds": [
            "soft patter of rain on glass",
            "quiet footsteps of staff preparing",
            "muffled conversations from the kitchen",
            "distant thunder rumbling"
          ],
          "smells": [
            "scent of damp fabric",
            "aroma of brewing coffee",
            "freshly baked pastries",
            "hint of mildew from the rain",
            "muffled scent of the sea"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "shadows creeping across the floor",
            "faded colors of decor",
            "stillness of the room"
          ],
          "sounds": [
            "silence punctuated by distant laughter",
            "soft rustling of tablecloths",
            "occasional clink of glassware",
            "muffled music from the lobby",
            "the tick of a clock"
          ],
          "smells": [
            "scent of stale air",
            "aroma of overcooked vegetables",
            "hint of burnt toast",
            "faint floral scent from arrangements",
            "dust settling on furniture"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "guests being served with care",
            "glow from the setting sun",
            "reflections in polished glassware",
            "beautifully arranged plates"
          ],
          "sounds": [
            "laughter and conversation",
            "music from the string quartet",
            "clinking of glasses",
            "soft rustle of dresses",
            "distant sound of waves"
          ],
          "smells": [
            "rich aroma of seafood dishes",
            "scent of fresh herbs and citrus",
            "hint of smoke from the kitchen",
            "warmth of baked bread",
            "sweet fragrance of desserts"
          ],
          "mood": "sophisticated celebration"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room, with its breathtaking vista of the ocean, serves as a culinary oasis for guests. Floor-to-ceiling windows frame the tumultuous sea, while the elegant decor features crisp white tablecloths and polished silverware that gleam in the soft candlelight. The room hums with the gentle sounds of clinking cutlery and soft conversations, creating an atmosphere of refined enjoyment. Freshly arranged floral centerpieces stand as vibrant focal points, adding to the elegance of the dining experience.",
        "As guests indulge in culinary delights, the air fills with the enticing aroma of grilled seafood and fresh herbs, mingling with the scent of freshly baked bread wafting from the kitchen. The gentle strains of a string quartet provide a soothing backdrop, enhancing the sophistication of the evening. However, as the sun sets and the shadows deepen, an undercurrent of tension begins to permeate the room, as guests exchange furtive glances, acutely aware that the hotel holds mysteries that could unravel at any moment."
      ]
    },
    {
      "id": "staff_area",
      "name": "The Staff Quarters",
      "type": "interior",
      "purpose": "Staff-only area for rest and preparation",
      "visualDetails": "A cramped area with simple furnishings, a small kitchenette, and a shared table, contrasting sharply with the opulence of the hotel.",
      "sensoryDetails": {
        "sights": [
          "worn wooden tables",
          "faded photographs on walls",
          "dim lighting from a single bulb",
          "stacked linens in a corner",
          "discarded uniforms on chairs"
        ],
        "sounds": [
          "murmurs of staff conversations",
          "clinking of dishes",
          "the hiss of a kettle boiling",
          "soft footsteps on the floor",
          "the rustle of uniforms"
        ],
        "smells": [
          "scent of stale coffee",
          "hint of soap and cleaning supplies",
          "aroma of simple meals",
          "faint mustiness from closed windows",
          "odor of damp clothing"
        ],
        "tactile": [
          "rough texture of worn wood",
          "cool metal of utensils",
          "soft fabric of uniforms",
          "warmth of a kettle",
          "smooth surface of a table"
        ]
      },
      "accessControl": "Restricted to hotel staff; guests prohibited from entering.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "wet floors reflecting light",
            "staff huddled together",
            "kettle steaming on the counter",
            "puddles forming outside"
          ],
          "sounds": [
            "steady patter of rain on windows",
            "soft voices discussing duties",
            "clinking of dishes being washed",
            "the hiss of steam from the kettle",
            "the rustle of uniforms"
          ],
          "smells": [
            "pungent scent of wet fabric",
            "aroma of brewing coffee",
            "hint of cleaning supplies",
            "faint mildew in the corners",
            "scent of damp earth"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping into corners",
            "faded photographs on walls",
            "glimmer of metal utensils",
            "empty chairs stacked",
            "half-opened windows"
          ],
          "sounds": [
            "soft murmurs of conversation",
            "clinking of dishes",
            "the rustle of linens",
            "occasional laughter from the lobby",
            "the tick of a clock"
          ],
          "smells": [
            "scent of stale air",
            "aroma of simple meals",
            "hint of soap from cleaning supplies",
            "faint mustiness from storage",
            "smell of damp clothing"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light from a single bulb",
            "staff preparing for night shifts",
            "empty chairs arranged for rest",
            "glint of silverware being polished",
            "the glow of streetlights outside"
          ],
          "sounds": [
            "soft chatter of staff",
            "clinking of silverware",
            "distant laughter from the dining room",
            "the hum of the kettle",
            "the rustle of uniforms"
          ],
          "smells": [
            "scent of freshly brewed coffee",
            "aroma of warm meals",
            "hint of soap from cleaning supplies",
            "faint mustiness from the corners",
            "smell of damp fabric"
          ],
          "mood": "tired camaraderie"
        }
      ],
      "paragraphs": [
        "The Staff Quarters, a stark contrast to the opulence of the guest areas, offer a glimpse into the lives of those who keep the Seascape Hotel running. With worn wooden tables and simple furnishings, the cramped space exudes a sense of familiarity and camaraderie among the staff. Faded photographs of previous employees hang on the walls, telling stories of years gone by, while the dim light casts long shadows, creating an atmosphere of quiet reflection amidst the bustle of hotel life.",
        "In the mornings, the scent of stale coffee mingles with the faint aroma of simple meals being prepared. Staff members gather around the table, discussing their duties while the kettle hisses softly, providing warmth in the cool air. The sounds of clinking dishes and muted conversations create a comforting rhythm, yet there is an undercurrent of tension in the air, as whispers of the events unfolding in the guest areas seep into their conversations, hinting at the mysteries that surround them."
      ]
    }
  ],
  "note": "",
  "cost": 0.00314677935,
  "durationMs": 30415
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1947,
    "month": "January",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "foggy with occasional rain",
      "chilly temperatures averaging around 40°F",
      "overcast skies"
    ],
    "daylight": "Short winter days with daylight lasting from approximately 7:30 AM to 4:30 PM, when the sun sets behind thick clouds.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after guests have gathered for drinks in the hotel lounge.",
    "holidays": [
      "New Year's Day",
      "Martin Luther King Jr. Day"
    ],
    "seasonalActivities": [
      "attending winter dances at local community halls",
      "visiting indoor ice skating rinks",
      "enjoying hot beverages in cozy cafés"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suit",
        "thin tie with geometric patterns",
        "fedora hat"
      ],
      "casual": [
        "corduroy trousers",
        "knit sweater",
        "wool overcoat"
      ],
      "accessories": [
        "leather gloves",
        "silk pocket square",
        "wristwatch with a leather strap"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a fitted waist",
        "three-quarter sleeve coat with fur trim",
        "pearl necklace"
      ],
      "casual": [
        "tweed skirt with a cashmere sweater",
        "button-up blouse with a Peter Pan collar",
        "ankle-length wool coat"
      ],
      "accessories": [
        "beret or cloche hat",
        "nylon stockings",
        "leather handbag"
      ]
    },
    "trendsOfTheMoment": [
      "utilitarian styles reflecting post-war practicality",
      "bold patterns and colors in evening wear",
      "increased use of synthetic fabrics"
    ],
    "socialExpectations": [
      "men are expected to provide financially",
      "women are increasingly seen in professional roles",
      "family and community ties are emphasized"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Tensions rising in Europe as Cold War begins",
      "The United Nations begins its first assembly session",
      "Strikes in the UK as workers demand better wages"
    ],
    "politicalClimate": "Political uncertainty as countries adjust to post-war realities; the U.S. is emerging as a global leader while Europe struggles with recovery.",
    "economicConditions": "Inflation is becoming a concern; rationing is still in effect for some goods while others are returning to normal markets.",
    "socialIssues": [
      "racial tensions in the U.S. as civil rights movements gain momentum",
      "the beginnings of the baby boom",
      "struggles for veterans adjusting to civilian life"
    ],
    "internationalNews": [
      "The Marshall Plan proposed to aid European recovery",
      "The Soviet Union's influence in Eastern Europe expands",
      "The establishment of the CIA as a response to global tensions"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - 'White Christmas'",
        "Nat King Cole - 'The Christmas Song'",
        "Frank Sinatra - 'I'll Be Home for Christmas'"
      ],
      "films": [
        "The Best Years of Our Lives",
        "It’s a Wonderful Life",
        "Miracle on 34th Street"
      ],
      "theater": [
        "A Streetcar Named Desire",
        "Death of a Salesman",
        "The Glass Menagerie"
      ],
      "radio": [
        "Suspense",
        "The Jack Benny Program",
        "The Lone Ranger"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Catcher in the Rye by J.D. Salinger",
        "The Naked and the Dead by Norman Mailer",
        "The Fountainhead by Ayn Rand"
      ],
      "popularGenres": [
        "hard-boiled detective fiction",
        "post-war literature exploring existential themes",
        "romantic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial jet aircraft prototype",
        "the introduction of the polio vaccine trials",
        "early computer developments at Harvard"
      ],
      "commonDevices": [
        "radio sets as the primary source of news and entertainment",
        "the first television sets in homes",
        "military radar technology beginning to be adapted for civilian use"
      ],
      "emergingTrends": [
        "increased interest in home entertainment systems",
        "development of consumer goods as the economy recovers",
        "a shift towards modernist design in architecture and furniture"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Coal scuttle refill: one shilling sixpence"
      ],
      "commonActivities": [
        "gathering at local cafés for warm drinks",
        "participating in community dances",
        "attending church services"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "Friday evening radio shows as family entertainment"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased visibility of the middle class",
      "emerging class tensions as working-class movements gain traction"
    ],
    "gender": [
      "women are returning to domestic roles while also maintaining careers",
      "gender roles are being questioned and reshaped"
    ],
    "race": [
      "racial integration remains contentious",
      "growing awareness and activism for civil rights"
    ],
    "generalNorms": [
      "community and family stability are prioritized",
      "post-war optimism is tempered by economic challenges"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with fog, muffling the sounds of the bustling streets and lending an eerie quiet to the hotel lobby.",
    "The scent of damp wool and fresh coffee merges in the air, with the sporadic laughter of patrons echoing against the aged walls.",
    "Dim lights flicker above the bar where weary travelers sip their drinks, the tension palpable as whispers of the outside world filter through the haze."
  ],
  "paragraphs": [
    "January 1947 casts a peculiar spell over the coastal town, where the winter fog wraps the streets in an almost claustrophobic embrace. The temperature hovers around 40°F, with the occasional drizzle adding to the chill. Guests at the local hotel are drawn indoors, gathering in the lounge to escape the dampness and share stories over warm drinks. The holiday season has just passed, and the excitement of New Year’s festivities lingers in the air, tinged with a sense of uncertainty as post-war adjustments begin to settle into daily life.",
    "Fashion reflects the duality of this transitional period; men don double-breasted suits with fedora hats, while women embrace tea-length dresses accentuated by pearls and the warmth of wool coats. The use of bold patterns and practical fabrics illustrates the societal shifts, as the remnants of wartime rationing meet a burgeoning consumer culture. As the hotel’s guests mingle, their attire not only showcases personal style but also hints at their aspirations in a world still navigating the remnants of conflict.",
    "Daily life unfolds amid the shadows of uncertainty, as community dances and indoor ice skating rinks become the backdrop for social interaction. Coffee houses buzz with conversation over the latest radio shows, while families prioritize Sunday dinners as a ritual of togetherness. However, the specter of the Cold War looms, bringing with it a palpable tension that affects even the most mundane encounters. This atmosphere stirs a sense of change, where whispers of new beginnings dance alongside the echoes of the past, setting the stage for the mystery that will soon unfold."
  ],
  "note": "",
  "cost": 0.00107629995,
  "durationMs": 14351
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a coastal hotel for a charity gala brings together a diverse group, where the pressures of post-war societal changes and emerging Cold War tensions heighten the stakes of personal and professional rivalries.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Women are increasingly entering the workforce, creating a shift in traditional roles, while the remnants of wartime camaraderie clash with the anxieties of a new geopolitical landscape."
  },
  "setting": {
    "location": "A coastal hotel on a cliffside, five miles from the nearest town.",
    "institution": "hotel",
    "weather": "Foggy with occasional rain, typical of coastal climates."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a delayed-action poison method, where the toxicology and dosage timing conceal when the fatal dose was actually administered."
}

### LOCKED_FACTS
[
  {
    "id": "tea_temperature",
    "value": "one hundred eighty degrees",
    "description": "The temperature of the tea at the time it was served."
  },
  {
    "id": "vial_contents",
    "value": "deadly poison",
    "description": "The contents of the vial that released the poison."
  },
  {
    "id": "time_of_death",
    "value": "half past ten at night",
    "description": "The time the victim was declared dead."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 18,
  "countsByPlacement": {
    "early": 7,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "spatial"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "id": "clue_11",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_12",
      "placement": "early",
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
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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

# Actual Prompt Record

- Run ID: `mystery-1784068590753`
- Project ID: ``
- Timestamp: `2026-07-15T03:51:15.481Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `bb5cbf70480871b2`

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
    "title": "The Deadly Bouquets",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "poisoning"
    }
  },
  "death_method": "poisoned with a rare botanical toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (acquaintance)",
        "Beatrice Quill (rival)",
        "Sylvia Trent (colleague)",
        "Hugo Vane (detective)"
      ],
      "public_persona": "Charming and sociable",
      "private_secret": "Struggling with a recent personal loss",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "none",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "None",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "30-40",
      "role_archetype": "Friend",
      "relationships": [
        "Eleanor Voss (friend)",
        "Captain Ivor Hale (colleague)",
        "Beatrice Quill (rival)",
        "Sylvia Trent (colleague)",
        "Hugo Vane (detective)"
      ],
      "public_persona": "Compassionate and dedicated",
      "private_secret": "Has a hidden jealousy towards Eleanor",
      "motive_seed": "Jealousy",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Medical supplies"
      ],
      "behavioral_tells": [
        "Nervousness when discussing Eleanor's health"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [
        "Medical records of Eleanor"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Acquaintance",
      "relationships": [
        "Eleanor Voss (acquaintance)",
        "Dr. Mallory Finch (colleague)",
        "Beatrice Quill (rival)",
        "Sylvia Trent (colleague)",
        "Hugo Vane (detective)"
      ],
      "public_persona": "Charming and enigmatic",
      "private_secret": "Hiding a past connection with Eleanor",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "7:00 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Visiting Eleanor's room"
      ],
      "behavioral_tells": [
        "Avoids eye contact when questioned"
      ],
      "stakes": "Reputation in the community",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Rival",
      "relationships": [
        "Eleanor Voss (rival)",
        "Dr. Mallory Finch (colleague)",
        "Captain Ivor Hale (acquaintance)",
        "Sylvia Trent (colleague)",
        "Hugo Vane (detective)"
      ],
      "public_persona": "Ambitious and cutthroat",
      "private_secret": "Resents Eleanor's success",
      "motive_seed": "Professional rivalry",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Social gatherings"
      ],
      "behavioral_tells": [
        "Cold demeanor towards Eleanor"
      ],
      "stakes": "Career advancement",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Colleague",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (acquaintance)",
        "Beatrice Quill (rival)",
        "Hugo Vane (detective)"
      ],
      "public_persona": "Supportive and loyal",
      "private_secret": "Knows more about Eleanor's life than she reveals",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Shared accommodations"
      ],
      "behavioral_tells": [
        "Too eager to provide alibis for others"
      ],
      "stakes": "Loyalty to Eleanor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [
        "Eleanor Voss (victim)",
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (acquaintance)",
        "Beatrice Quill (rival)",
        "Sylvia Trent (colleague)"
      ],
      "public_persona": "Sharp and perceptive",
      "private_secret": "Has a personal stake in the case",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Investigative access"
      ],
      "behavioral_tells": [],
      "stakes": "Professional integrity",
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
      "summary": "In the foggy atmosphere of a seaside hotel, Eleanor Voss is found dead after a dinner party, seemingly from a heart attack. As guests recount their evening, secrets unfold, revealing jealousy and ambition. Detective Hugo Vane must untangle the web of relationships and hidden motives to uncover the truth behind the deadly bouquet."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The poison from a rare flower was secretly added to a bouquet gifted to Eleanor, causing a delayed reaction that mimicked a natural illness.",
      "delivery_path": [
        {
          "step": "Dr. Mallory Finch prepares the bouquet with the toxic flower."
        },
        {
          "step": "Eleanor receives the bouquet at half past seven."
        },
        {
          "step": "Eleanor shows symptoms of poisoning hours later."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor Voss dies from the delayed effects of the poison."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss's death was a sudden heart attack caused by stress.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Eleanor had been feeling unwell and was under significant pressure due to work.",
    "what_it_hides": "The true cause was the slow-acting poison from the bouquet."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses saw him near Eleanor before she collapsed, suggesting he had a motive.",
      "He seemed overly concerned after her collapse, leading others to suspect him."
    ],
    "the_one_flaw": "Captain Hale has an alibi confirmed by multiple sources that places him elsewhere when the poisoning occurred.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Dr. Mallory Finch's nervousness when questioned about her medical practices.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "Her nervousness stems from her concern for Eleanor's health, not guilt.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Beatrice Quill's cold demeanor toward Eleanor.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "Her behavior is due to professional rivalry and not involvement in the murder.",
      "resolved_in_chapter": 5
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
    "rationale": "All suspects were present at the hotel during the time of the incident, and there are no outsiders involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner started at 7:00 PM",
        "Eleanor received the bouquet at 7:30 PM",
        "Eleanor collapsed around 9:00 PM"
      ],
      "windows": [
        "Symptoms of poisoning can take hours to manifest"
      ],
      "contradictions": [
        "Witnesses claim to have seen Eleanor in good spirits up until she received the bouquet."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Beatrice Quill"
      ],
      "objects": [
        "The bouquet",
        "The dining room where the dinner took place"
      ],
      "permissions": [
        "All guests had access to the dining area."
      ]
    },
    "physical": {
      "laws": [
        "Delayed action of botanical poisons can mimic natural causes of death."
      ],
      "traces": [
        "Petals from the toxic flower found near Eleanor's body."
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor trusted Dr. Mallory Finch as her physician."
      ],
      "authority_sources": [
        "Medical records showing Eleanor's prior health conditions."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Petals from a rare flower were found near Eleanor's body.",
        "correction": "The flower's petals indicate a botanical poison was involved.",
        "effect": "Narrows to Dr. Mallory Finch as she had access to the flower.",
        "required_evidence": [
          "Petals found at the scene",
          "Eleanor's medical records showing no prior heart conditions"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall the bouquet being presented to Eleanor at half past seven.",
        "correction": "The timing suggests the poison was administered shortly before her symptoms appeared.",
        "effect": "Eliminates the possibility of Captain Ivor Hale as he was seen elsewhere.",
        "required_evidence": [
          "Witness statements about the timing of the bouquet",
          "Captain Hale's confirmed alibi"
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory Finch shows signs of nervousness when questioned about her access to the bouquet.",
        "correction": "Her nervousness indicates possible guilt regarding the bouquet's contents.",
        "effect": "Narrows suspicion further towards Dr. Mallory Finch.",
        "required_evidence": [
          "Dr. Mallory's nervous demeanor",
          "Her access to the bouquet prior to the dinner"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares flower, petal, and indicate against the claimed timeline.",
    "knowledge_revealed": "Dr. Mallory cannot explain the presence of the flower's petals without implicating herself.",
    "pass_condition": "If Dr. Mallory Finch cannot explain her involvement with the bouquet, it confirms her guilt.",
    "evidence_clues": [
      "clue_1",
      "clue_culprit_direct_1",
      "clue_8",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The petals found (early) and Eleanor's medical records (mid) suggest poisoning. Step 2: Timing of the bouquet delivery (mid) eliminates Captain Hale. Step 3: Dr. Mallory's nervousness (discriminating test) reveals her as the culprit."
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
        "Observe Dr. Mallory's reaction",
        "Draw conclusion about her guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi",
        "supporting_clues": [
          "Captain Hale's alibi",
          "Witness statements"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No evidence linking her to the bouquet",
        "supporting_clues": [
          "Witness statements",
          "Social dynamics"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her loyalty to Eleanor is evident",
        "supporting_clues": [
          "Witness statements",
          "Sylvia's testimony"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
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
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, the respected hotel manager, is found dead under suspicious circumstances, revealing a life tangled in deceit and desperation.",
    "publicPersona": "Eleanor Voss is known for her strict adherence to rules and high standards, maintaining a polished façade that commands respect among the hotel staff and guests alike. Her authoritative presence is often accompanied by a meticulous attention to detail, ensuring the hotel operates like a well-oiled machine.",
    "privateSecret": "Beneath her composed exterior, Eleanor grapples with crippling gambling debts that have led her to embezzle funds from the hotel she manages. This precarious situation creates a constant undercurrent of anxiety, as she fears exposure will lead to not just her professional ruin but also her imprisonment.",
    "motiveSeed": "Eleanor's fear of being exposed for her embezzlement becomes a driving force in her life. When she perceives that the victim may threaten to report her, desperation drives her to the edge, making her a potential suspect in a crime she never intended to commit.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claimed to be in her office from 8 to 9 PM, a time when the hotel was bustling with guests and staff, yet no one can corroborate her whereabouts during that crucial hour.",
    "accessPlausibility": "easy",
    "stakes": "The stakes for Eleanor are devastatingly high; not only does she risk jail time, but the potential loss of her career would shatter her fragile world.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Eleanor speaks in a clipped, authoritative tone, often using formal language that underscores her position. She has a habit of punctuating her sentences with a sharp finality, leaving little room for debate.",
    "signatureTic": "\"Order is paramount.\"",
    "internalConflict": "Eleanor is torn between her desire to maintain her career and the growing realization that her dishonest actions may lead to her downfall. The weight of her secrets creates a profound sense of guilt that lingers in her mind.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it threatens to expose her hidden life of crime and destroy the reputation she has worked so hard to build.",
    "paragraphs": [
      "Eleanor Voss stood at the helm of the seaside hotel, her sharp gaze surveying the bustling lobby with a blend of authority and anxiety. Known for her strict adherence to rules and high standards, she commanded respect among her staff and guests alike. Yet, beneath this polished exterior lay a web of deceit spun from desperation. Gambling debts had become her silent adversary, forcing her to embezzle funds from the very establishment she cherished.",
      "As the sun dipped below the horizon, casting an ominous glow over the hotel, Eleanor’s mind raced. She had always prided herself on being in control, yet the fear of exposure loomed like a dark cloud over her. The victim, a thorn in her side, had made veiled threats that sent shivers down her spine. What if their words turned to actions? The thought alone was enough to drive her to the brink of madness.",
      "Claiming to be in her office during the time of the murder, Eleanor found herself ensnared in a web of lies. No one could corroborate her alibi, and the walls of her carefully constructed reality began to close in. The stakes were high; if her secrets were unveiled, not only would she face jail time but the loss of her career would render her a pariah, forever marked by her failures.",
      "In the days that followed, Eleanor oscillated between panic and resolve. She could either find redemption through honesty or spiral further into crime, plunging deeper into the abyss. Yet, every encounter with the hotel staff felt like a reminder of her precarious position. How long could she maintain her façade before it crumbled under the weight of her sins?"
    ]
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose envy for the victim's connections leads her down a dark path of suspicion and rivalry.",
    "publicPersona": "Widely regarded as a competent and opinionated doctor, Dr. Mallory Finch has built a successful practice that commands respect. Her strong opinions often spark debates among peers, reinforcing her position as a formidable presence in the medical community.",
    "privateSecret": "Beneath her confident exterior, Mallory harbors a deep dissatisfaction with her career, as she secretly envies Eleanor Voss's connections and influence. This envy has festered over time, leading her to question her own abilities and worth.",
    "motiveSeed": "Mallory has convinced herself that Eleanor is sabotaging her practice, gaining influence over patients that rightfully belonged to her. The thought of losing her hard-earned reputation drives her to the edge, igniting a simmering resentment that could lead to drastic actions.",
    "motiveStrength": "moderate",
    "alibiWindow": "During the time of the murder, Mallory claims to have been attending to a patient, yet she lacks any proof to substantiate her whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "For Mallory, the stakes are high; the loss of her professional reputation and influence could shatter her dreams and drive her to the brink of despair.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with a confident cadence, often punctuating her sentences with sharp wit. Her dialogue flows smoothly, but there’s an underlying tension that betrays her simmering discontent. She has a tendency to ask rhetorical questions, challenging the listener’s perspective.",
    "signatureTic": "\"Wouldn't you agree?\"",
    "internalConflict": "Mallory is caught in a moral tug-of-war, feeling torn between her envy and the professional integrity she once upheld. The thought of resorting to underhanded tactics eats away at her conscience, leaving her in a state of turmoil.",
    "personalStakeInCase": "This crime matters to Mallory because it represents the culmination of her frustrations and ambitions. The potential fallout could either propel her career or plunge her into obscurity.",
    "paragraphs": [
      "Dr. Mallory Finch strode through the hotel corridor, her presence commanding attention as she navigated the bustling crowds with an air of authority. A respected physician, she had built her practice on the foundation of strong opinions and unwavering confidence. Yet, beneath this polished veneer lay a simmering discontent that threatened to consume her.",
      "Mallory’s envy of Eleanor Voss gnawed at her insides, a constant reminder of the connections and influence the hotel manager wielded. She had watched as patients flocked to Eleanor’s side, undermining her own practice in ways she could hardly articulate. Wouldn’t you agree? The thought of Eleanor’s sabotage was enough to ignite a fire within her, pushing her closer to the brink.",
      "Claiming to have been attending to a patient during the time of the murder, Mallory found herself in a precarious position. With no proof to corroborate her alibi, the shadows of suspicion began to close in around her. The stakes were high; the loss of her reputation would shatter her carefully constructed identity, leaving her adrift in a sea of regret.",
      "As the investigation unfolded, Mallory wrestled with her moral compass, torn between her ambitions and the integrity she had once held dear. Each interaction with the other suspects felt like a game of chess, her every move calculated yet fraught with peril. Would she succumb to her jealousy, or could she rise above the fray, reclaiming her position in a world that felt increasingly hostile?"
    ]
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a charismatic retired naval officer, grapples with his past as he becomes embroiled in a murder investigation that threatens to unravel his carefully crafted image.",
    "publicPersona": "Known for his boisterous charm and storied military past, Captain Ivor Hale captivates those around him with tales of valor and adventure. His larger-than-life personality often masks the turmoil lurking beneath the surface.",
    "privateSecret": "Beneath the charismatic façade lies a man haunted by violent outbursts and PTSD from his time in service. The memories of war linger like ghosts, casting a shadow over his present.",
    "motiveSeed": "A heated argument with the victim over comments about his actions during the war ignites a spark of anger in Ivor, pushing him to confront the demons of his past. Insults cut deeper than anyone realizes, leading him to contemplate actions he might otherwise avoid.",
    "motiveStrength": "weak",
    "alibiWindow": "Ivor claims to have been enjoying the view from the balcony during the time of the murder, a claim that is difficult to verify but plausible.",
    "accessPlausibility": "possible",
    "stakes": "For Ivor, the stakes are not just about maintaining his reputation but also about confronting the ghosts of his past that threaten to resurface.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a hearty, jovial tone, often punctuating his stories with self-deprecating humor. His speech is animated, reflecting his larger-than-life personality, but there is an underlying tension that occasionally breaks through.",
    "signatureTic": "\"Ah, the things we do for honor!\"",
    "internalConflict": "Ivor is torn between the desire to maintain his reputation as a charming war hero and the reality of his violent past. The fear of confronting those demons leaves him in a constant state of unease.",
    "personalStakeInCase": "This crime matters to Ivor because it forces him to confront the very nature of his identity, as well as the risks associated with his reputation.",
    "paragraphs": [
      "Captain Ivor Hale stood on the balcony, the sea breeze ruffling his hair as he regaled a small group with tales of his naval exploits. Known for his boisterous charm, he captivated those around him, weaving stories that painted him as a war hero. Yet, beneath the surface, Ivor wrestled with a past that refused to fade away, haunted by violent memories and the specters of his service.",
      "The argument with Eleanor had stung, her words cutting deeper than he cared to admit. Ah, the things we do for honor! The thought echoed in his mind, a reminder of the insults he had endured. The heated exchange had ignited a spark within him, one that threatened to spiral into something darker. Was it possible that he could be drawn into the very violence he had fought to escape?",
      "During the time of the murder, Ivor claimed to have been enjoying the view from the balcony, but with no one to corroborate his alibi, doubt began to seep into the minds of those around him. The stakes were high; maintaining his reputation was paramount, yet the specter of his past loomed large, threatening to overshadow everything he had built.",
      "As the investigation unfolded, Ivor found himself grappling with the duality of his existence. Could he confront the demons of his past and emerge victorious, or would he spiral deeper into a world of violence that he had fought so hard to leave behind? Each moment felt like a test, a chance to redefine who he was amidst the chaos surrounding him."
    ]
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious journalist, finds herself entangled in a murder investigation as her secret quest for a scandal piece leads her into dangerous territory.",
    "publicPersona": "Beatrice Quill is an up-and-coming journalist known for her tenacity and ambition. Eager to make a name for herself, she approaches her work with a relentless fervor, often seeking out stories that others might overlook.",
    "privateSecret": "Beneath her ambitious exterior, Beatrice is conducting a secret investigation into the hotel’s affairs for a scandal piece, driven by the desire to expose the truth and propel her career forward.",
    "motiveSeed": "The potential to expose damaging information about the victim could catapult Beatrice's career to new heights, creating a dangerous intersection between her ambition and the investigation.",
    "motiveStrength": "weak",
    "alibiWindow": "During the time of the murder, Beatrice was at the bar talking to patrons, a social setting that might provide her with an alibi, yet it remains unverified.",
    "accessPlausibility": "unlikely",
    "stakes": "For Beatrice, the stakes are career advancement and recognition in journalism, but the truth comes at a cost that she may not be prepared to pay.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice has a quick, lively speech pattern, often punctuated with sardonic remarks. She possesses a knack for irony, using humor to navigate tense situations, and her dialogue often reflects her keen observational skills.",
    "signatureTic": "\"What’s the story here?\"",
    "internalConflict": "Beatrice grapples with her ambition and the ethical implications of her actions, torn between her desire for success and the potential fallout of her investigation.",
    "personalStakeInCase": "This crime matters to Beatrice because it represents a pivotal moment in her career, where the truth could either elevate her or lead her into a quagmire of moral ambiguity.",
    "paragraphs": [
      "Beatrice Quill perched at the hotel bar, her keen eyes scanning the room as she engaged in light conversation with fellow patrons. An ambitious journalist, she thrived on the thrill of the chase, eager to uncover stories that would set her apart from the rest. What’s the story here? This question echoed in her mind, driving her relentless pursuit of the truth.",
      "Yet, beneath her confident exterior lay a secret investigation that threatened to unravel her carefully crafted image. She was conducting a covert inquiry into the hotel’s affairs for a scandal piece, driven by the desire to expose the truth and propel her career to new heights. The stakes were high; one wrong move could lead her into dangerous territory.",
      "During the time of the murder, Beatrice found herself at the bar, engaged in conversation, yet she knew that her alibi remained unverified. The potential to expose damaging information about the victim loomed like a double-edged sword, tempting her with the promise of fame while threatening to engulf her in the chaos of the investigation.",
      "As the events unfolded, Beatrice wrestled with her ambition and the ethical implications of her actions. Could she navigate this treacherous landscape without losing herself in the pursuit of success? The lines between right and wrong blurred, leaving her to question whether the truth was worth the price she might have to pay."
    ]
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a talented interior designer, battles her inner demons as jealousy over the victim's success threatens to consume her.",
    "publicPersona": "Sylvia Trent is a well-regarded interior designer known for her impeccable taste and creativity. Her work often receives accolades, yet she feels overshadowed by the success of others.",
    "privateSecret": "Beneath her polished exterior, Sylvia harbors a deep-seated resentment towards Eleanor Voss, believing that the victim has stolen her design concepts and undermined her work.",
    "motiveSeed": "Sylvia's jealousy drives her to believe that Eleanor's success comes at her expense, igniting a desire to confront the victim and reclaim what she feels is rightfully hers.",
    "motiveStrength": "moderate",
    "alibiWindow": "Sylvia claims to have been in her room working on a design from 8 to 9 PM, a claim that lacks corroboration but is plausible.",
    "accessPlausibility": "possible",
    "stakes": "For Sylvia, the stakes are high; her reputation in the design community and her personal pride hang in the balance, pushing her towards the edge.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with an articulate and measured tone, often using descriptive language to convey her thoughts. Her speech is infused with observational insights, and she occasionally employs irony to highlight the absurdities of her situation.",
    "signatureTic": "\"It's all in the details.\"",
    "internalConflict": "Sylvia grapples with her jealousy and the realization that her rivalry with Eleanor may be leading her down a dark path. The desire for recognition battles against her moral compass, leaving her in turmoil.",
    "personalStakeInCase": "This crime matters to Sylvia because it represents the culmination of her frustrations and desires, pushing her to confront the very nature of her rivalry with the victim.",
    "paragraphs": [
      "Sylvia Trent stood in her room, surrounded by sketches and fabric swatches, her mind racing with thoughts of the competition she faced in the design community. A talented interior designer, she had built her reputation on impeccable taste and creativity, yet the shadow of Eleanor Voss loomed large, eclipsing her achievements. It's all in the details, she reminded herself, but the nagging feeling of inadequacy lingered.",
      "Beneath her polished exterior, Sylvia harbored a resentment that festered like an open wound. She believed that Eleanor had undermined her work, stealing design concepts that she felt were rightfully hers. The jealousy that coursed through her veins ignited a fire, pushing her to confront the victim in ways she had never imagined.",
      "Claiming to have been working in her room during the time of the murder, Sylvia found herself in a precarious position. With no one to corroborate her alibi, the stakes felt impossibly high. The reputation she had worked so hard to build could crumble in the blink of an eye, leaving her vulnerable and exposed.",
      "As the investigation unfolded, Sylvia grappled with her inner demons, torn between her desire for recognition and the moral implications of her rivalry. Could she channel her frustrations positively, or was she destined to become consumed by bitterness? Each moment felt like a test, a chance to redefine her identity amidst the chaos surrounding her."
    ]
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a charming real estate developer, finds himself embroiled in a murder investigation that threatens to expose his hidden past.",
    "publicPersona": "Hugo Vane is a wealthy real estate developer known for his charm and business acumen. His polished demeanor often masks the darker aspects of his dealings.",
    "privateSecret": "Beneath his charming exterior lies a hidden past of shady dealings and connections to organized crime, a secret that could unravel his carefully crafted reputation.",
    "motiveSeed": "Drawn into the investigation after overhearing a crucial conversation about the victim, Hugo finds himself entangled in a web of intrigue that threatens to expose his past.",
    "motiveStrength": "compelling",
    "alibiWindow": "Hugo was seen attending a dinner party at the hotel, but there are whispers that he may have slipped away during the gathering, casting doubt on his whereabouts.",
    "accessPlausibility": "easy",
    "stakes": "For Hugo, the stakes are high; his business reputation and ties to the community are at risk, putting him in a precarious position.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with a smooth, engaging tone, often employing a mix of charm and sarcasm. His dialogue reflects his confidence, with a tendency to use clever wordplay and subtle jabs that reveal his sharp wit.",
    "signatureTic": "\"You catch more flies with honey, don’t you?\"",
    "internalConflict": "Hugo grapples with the moral implications of his past, torn between the desire to redeem himself through genuine investigation and the temptation to descend deeper into corruption.",
    "personalStakeInCase": "This crime matters to Hugo because it threatens to expose the very foundations of his business and personal life, forcing him to confront the consequences of his past.",
    "paragraphs": [
      "Hugo Vane mingled effortlessly at the dinner party, his charm radiating as he engaged guests with tales of his latest real estate ventures. A wealthy developer, he had become accustomed to the adoration that accompanied his polished persona. Yet, beneath this façade lay a hidden past of shady dealings and connections to organized crime, a secret that loomed like a dark cloud over his reputation.",
      "The conversation he overheard that night about the victim sent chills down his spine, drawing him into an investigation that threatened to expose everything he had worked to build. You catch more flies with honey, don’t you? The irony of that saying echoed in his mind as he navigated the treacherous waters of suspicion.",
      "With the dinner party serving as his alibi, whispers of his potential absence during the time of the murder cast doubt on his credibility. The stakes were impossibly high; his business reputation and ties to the community hung in the balance, forcing him to confront the precarious nature of his existence.",
      "As the investigation unfolded, Hugo found himself grappling with the moral implications of his past. Could he redeem himself through genuine investigation, or would he succumb to the temptations that had previously defined him? Each moment felt like a reckoning, a chance to redefine his identity amidst the chaos surrounding him."
    ]
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Azure Crest Hotel",
    "type": "hotel",
    "place": "Porthcawl",
    "country": "Wales",
    "summary": "An elegant seaside hotel with Art Deco charm, perched on a cliff with views of the turbulent ocean.",
    "visualDescription": "The Azure Crest Hotel features sweeping curves and geometric shapes typical of Art Deco, with polished brass fixtures and large glass windows framing the ocean. The lobby is adorned with plush velvet chairs in deep sapphire and gold accents, while the ocean's roar can be seen crashing against the cliffs below.",
    "atmosphere": "A tense and suspenseful ambiance, the air thick with the scent of salt and dampness, accentuated by the recent unsettling rumors of espionage.",
    "paragraphs": [
      "The Azure Crest Hotel stands resolute against the backdrop of a stormy sea, its Art Deco facade shimmering even in the fog. Guests arrive amidst whispers of espionage, the air heavy with tension. The hotel, isolated on its cliff, feels like a world unto itself, where secrets linger like the mist that clings to the shoreline. The elegant lobby, with its polished marble floors and striking chandeliers, contrasts sharply with the unease that permeates the atmosphere.",
      "As the fog rolls in, muffling sound and light, the hotel feels more like a fortress than a retreat. The narrow hallways echo with the soft footfalls of staff, while guests whisper nervously in the drawing room, casting furtive glances at one another. The distant crash of waves serves as a reminder of the perilous cliffs below, a fitting metaphor for the hidden dangers lurking within the hotel's walls. Here, every creak of the floorboards and flicker of candlelight seems to hold a secret waiting to be uncovered.",
      "The setting sun casts a muted glow over the ocean, illuminating the hotel in a haunting light. The air grows colder, and the scent of wet earth and seaweed wafts through the open windows. Each guest is a potential suspect, each shadow a whisper of treachery. The Azure Crest Hotel, once a sanctuary, now feels like a stage for a deadly game of intrigue, where trust is as scarce as the fading daylight."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "foggy with occasional rain, typical of coastal climates",
    "timeFlow": "Three days of mounting tension and intrigue",
    "mood": "suspenseful and tense, heightened by recent reports of espionage",
    "eraMarkers": [
      "Art Deco architecture and design",
      "Rationed wartime vehicles parked outside",
      "Radio broadcasts crackling in the lounge"
    ],
    "sensoryPalette": {
      "dominant": "Salt-tinged sea air and damp earth",
      "secondary": [
        "Flickering candlelight",
        "Muted conversations and whispers"
      ]
    },
    "paragraphs": [
      "The Azure Crest Hotel, with its Art Deco elegance, stands defiantly against the tempestuous sea. Fog clings to the air, thick and heavy, wrapping the hotel in a shroud of mystery. The scent of saltwater mingles with damp wood, creating an atmosphere ripe with suspense. Guests, lost in their thoughts, navigate the narrow hallways, their footsteps muffled by the plush carpets that absorb sound. Outside, the crashing waves echo the turmoil within, a constant reminder of the isolation that envelops the hotel.",
      "As night falls, the flickering candlelight casts dancing shadows across the walls, lending an air of intrigue to the hotel's opulent decor. The sound of rain drumming against the windows heightens the tension, a rhythmic reminder of the storm brewing beyond. Conversations are hushed, filled with suspicion and unspoken fears, while the lingering scent of polished wood and old books fills the library, where secrets are kept and uncovered. The Azure Crest becomes a character in its own right, a silent witness to the unfolding drama."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Cliffside Lounge",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A dimly lit room with large windows overlooking the churning sea, adorned with plush armchairs and an ornate bar.",
      "sensoryDetails": {
        "sights": [
          "ocean waves crashing against cliffs",
          "narrow shadows along the corridor"
        ],
        "sounds": [
          "whispered conversations",
          "clinking glasses at the bar"
        ],
        "smells": [
          "old leather and tobacco smoke",
          "salt air mixing with damp wood"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cold glass of a whiskey tumbler"
        ]
      },
      "accessControl": "Accessible to all guests, but staff-only areas behind the bar restrict access after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked glass panes",
            "grey light spilling through curtains"
          ],
          "sounds": [
            "steady patter of rain",
            "distant thunder rumbling"
          ],
          "smells": [
            "fresh rain on stone",
            "damp upholstery"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat, featureless sky",
            "dim light filtering through clouds"
          ],
          "sounds": [
            "silence punctuated by the wind",
            "the creak of the building settling"
          ],
          "smells": [
            "musty fabric",
            "faint traces of oil from the bar"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling across the floor",
            "long shadows stretching from furniture"
          ],
          "sounds": [
            "soft laughter from guests",
            "the crackle of a fireplace"
          ],
          "smells": [
            "warm wood and smoke",
            "citrus from cocktails"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Cliffside Lounge, with its expansive view of the roaring sea, has become the scene of an unspeakable crime. Dimly lit and filled with the scent of old leather and tobacco, the room feels heavy with secrets. Guests huddle in the corners, their whispers barely audible over the crashing waves outside. The bar, a polished mahogany masterpiece, stands as a silent witness to the unfolding drama, its shelves lined with bottles that gleam in the flickering candlelight.",
        "As the rain begins to fall, the atmosphere shifts; the once inviting lounge now feels claustrophobic, the shadows stretching like fingers across the plush upholstery. The sounds of clinking glasses and hushed conversations blend with the persistent drumming of rain on the windows, creating a symphony of unease. It is here, amidst the shifting light and dark, that the mystery deepens, and the tension mounts."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A grand room with large bay windows, adorned with rich tapestries and a grand piano in the corner.",
      "sensoryDetails": {
        "sights": [
          "luxurious tapestries hanging on walls",
          "sunlight filtering through bay windows"
        ],
        "sounds": [
          "soft piano melodies",
          "gentle laughter"
        ],
        "smells": [
          "freshly polished wood",
          "floral arrangements"
        ],
        "tactile": [
          "smooth piano keys",
          "soft silk cushions"
        ]
      },
      "accessControl": "Open to all guests during the day, locked at night for security.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light washing over furnishings",
            "drops racing down windowpanes"
          ],
          "sounds": [
            "soft patter of rain",
            "distant thunder rumbling"
          ],
          "smells": [
            "scent of wet earth",
            "faint mildew"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "tapestries absorbing color"
          ],
          "sounds": [
            "the rustle of fabric",
            "the ticking of a clock"
          ],
          "smells": [
            "dusty books",
            "old leather bindings"
          ],
          "mood": "reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light from lamps",
            "shadows dancing on the walls"
          ],
          "sounds": [
            "soft conversations",
            "the clink of teacups"
          ],
          "smells": [
            "freshly brewed tea",
            "scented candles"
          ],
          "mood": "comforting and inviting"
        }
      ],
      "paragraphs": [
        "The Drawing Room, a bastion of elegance, welcomes guests with its warm hues and rich textures. Sunlight spills through the bay windows, illuminating the luxurious tapestries that adorn the walls. The grand piano stands in one corner, inviting soft melodies that drift through the air, mingling with the scent of fresh flowers arranged meticulously on the tables. It is a place where laughter and conversation flow freely, yet the undercurrents of suspicion run just as deep.",
        "As the day wanes, the atmosphere shifts; the once bright room takes on a more somber tone, shadows creeping into every corner. The soft sounds of laughter are replaced by cautious whispers, and the scent of fresh tea mingles with the musty aroma of old books. Guests exchange knowing glances, each one aware that beneath the veneer of civility lies a web of intrigue. The Drawing Room, with all its charm, becomes a stage for the unfolding mystery."
      ]
    },
    {
      "id": "kitchen",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Staff-only area",
      "visualDetails": "A bustling kitchen filled with stainless steel appliances and large wooden tables, the air thick with the scent of cooking.",
      "sensoryDetails": {
        "sights": [
          "gleaming stainless steel surfaces",
          "hanging pots and pans"
        ],
        "sounds": [
          "clattering utensils",
          "boiling water bubbling"
        ],
        "smells": [
          "roasting meats",
          "freshly baked bread"
        ],
        "tactile": [
          "warmth from the ovens",
          "rough wood of the tables"
        ]
      },
      "accessControl": "Restricted to kitchen staff only, locked after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "steam rising from pots",
            "water pooling on the floor"
          ],
          "sounds": [
            "dripping water",
            "sizzling on the stovetop"
          ],
          "smells": [
            "wet earth from the deliveries",
            "fresh herbs"
          ],
          "mood": "chaotic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "cloudy light filtering through windows",
            "shadows of busy staff"
          ],
          "sounds": [
            "voices raised in laughter",
            "clanking of dishes"
          ],
          "smells": [
            "smoky spices",
            "sour cream"
          ],
          "mood": "busy and lively"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of hanging lights",
            "shiny surfaces reflecting light"
          ],
          "sounds": [
            "the hum of refrigerators",
            "the crackle of frying food"
          ],
          "smells": [
            "sweet desserts baking",
            "sizzling garlic"
          ],
          "mood": "satisfied and warm"
        }
      ],
      "paragraphs": [
        "The kitchen buzzes with energy, a stark contrast to the hushed tones of the guest areas. Stainless steel gleams under the fluorescent lights, while the air is filled with the rich scents of roasting meats and freshly baked bread. The sounds of clattering utensils and boiling pots create a symphony of activity, as staff move with purpose, preparing meals for the guests above. It is a place of warmth and comfort, yet secrets lurk behind the bustling facade.",
        "As the day evolves, the kitchen becomes a whirlwind of chaos; the rain outside drums persistently against the windows, adding to the sense of urgency. Staff chatter fills the air, laughter echoing off the walls, but beneath the joviality lies an undercurrent of tension. With every slice of a knife and every stirring of a pot, the kitchen remains a crucial hub, where secrets can be overheard and mysteries can unfold."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Restricted access area",
      "visualDetails": "An open terrace with stunning ocean views, adorned with wrought iron furniture and potted plants.",
      "sensoryDetails": {
        "sights": [
          "vast expanse of the ocean",
          "twinkling lights of distant ships"
        ],
        "sounds": [
          "howling wind",
          "waves crashing against the cliffs"
        ],
        "smells": [
          "salt air and blooming flowers",
          "damp stone"
        ],
        "tactile": [
          "cold metal of iron chairs",
          "rough surface of stone tiles"
        ]
      },
      "accessControl": "Access restricted to hotel management and maintenance staff; locked at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds hanging low",
            "rain falling on potted plants"
          ],
          "sounds": [
            "heavy rain hitting stone",
            "the distant rumble of thunder"
          ],
          "smells": [
            "fresh rain on soil",
            "scent of wet foliage"
          ],
          "mood": "bleak and foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "darkening skies",
            "shadows creeping across the terrace"
          ],
          "sounds": [
            "whistling wind",
            "the distant call of seabirds"
          ],
          "smells": [
            "brine and seaweed",
            "damp earth"
          ],
          "mood": "isolated and eerie"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "stars beginning to twinkle"
          ],
          "sounds": [
            "gentle lapping of waves",
            "soft rustle of leaves"
          ],
          "smells": [
            "sweet scent of blooming flowers",
            "cool night air"
          ],
          "mood": "serene yet tense"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers breathtaking views of the ocean, a stark contrast to the mysteries brewing within the hotel. Wrought iron furniture sits against the backdrop of the vast expanse of water, where the horizon meets the sky. The air is thick with the scent of salt and blooming flowers, yet a chill runs through the bones as the winds howl around the edges of the terrace. It is a place for quiet reflection, but also one of potential danger, where secrets could be whispered away from prying ears.",
        "As evening falls, the terrace transforms; the sunset bathes the area in a warm glow, but the chill of the approaching night casts an unsettling shadow. The sound of waves crashing below becomes a reminder of the perilous cliffs, while the scent of blooming flowers mingles with the cool air. The terrace, once a peaceful retreat, now feels charged with tension, as if harboring secrets that could unravel the very fabric of the hotel."
      ]
    }
  ],
  "note": "",
  "cost": 0.0021831018,
  "durationMs": 40634
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1947,
    "month": "December",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "December",
    "weather": [
      "foggy with occasional rain",
      "chilly temperatures around 35°F",
      "overcast skies"
    ],
    "daylight": "Short days with twilight ending around 4 PM, darkness falling quickly.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel lounges fill with guests.",
    "holidays": [
      "Christmas",
      "New Year's Eve"
    ],
    "seasonalActivities": [
      "Christmas shopping in bustling streets",
      "attending holiday parties",
      "enjoying festive decorations and lights in the hotel"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits",
        "tweed sport coats",
        "silk ties"
      ],
      "casual": [
        "button-up shirts with rolled sleeves",
        "corduroy trousers",
        "wool sweaters"
      ],
      "accessories": [
        "fedora hats",
        "leather gloves",
        "wool scarves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length evening dresses with fitted bodices",
        "long-sleeved silk blouses",
        "full skirts with petticoats"
      ],
      "casual": [
        "tweed skirts with matching cardigans",
        "button-up blouses",
        "woolen coats"
      ],
      "accessories": [
        "cloche hats",
        "string pearl necklaces",
        "gloves in soft leather"
      ]
    },
    "trendsOfTheMoment": [
      "post-war utilitarian style",
      "increasingly bold patterns and colors",
      "accessories featuring floral motifs"
    ],
    "socialExpectations": [
      "ladies are expected to wear hats and gloves when going out",
      "formal attire for evening gatherings",
      "gentlemen should wear suits in public settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "increased tensions in Europe due to Cold War",
      "the establishment of the Marshall Plan to aid European recovery",
      "growing fear of espionage following revelations of Soviet spies in the West"
    ],
    "politicalClimate": "A climate of suspicion and anxiety prevails, as citizens grapple with the impact of the Cold War on daily life.",
    "economicConditions": "The economy is slowly recovering from the war, but inflation is rising, and many goods remain rationed.",
    "socialIssues": [
      "housing shortages",
      "racial tensions in urban areas",
      "the integration of women into the workforce post-war"
    ],
    "internationalNews": [
      "the trial of Nazi war criminals continues in Nuremberg",
      "tensions in Palestine rise as the UN votes on partition",
      "the U.S. recognizes Israel"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Nat King Cole's 'The Christmas Song'",
        "Ella Fitzgerald's 'Bewitched, Bothered and Bewildered'"
      ],
      "films": [
        "'Miracle on 34th Street'",
        "'The Best Years of Our Lives'",
        "'The Killers'"
      ],
      "theater": [
        "'A Streetcar Named Desire'",
        "'The Glass Menagerie'",
        "'Annie Get Your Gun'"
      ],
      "radio": [
        "The Jack Benny Program",
        "Suspense",
        "The Adventures of Sam Spade"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'A Streetcar Named Desire' by Tennessee Williams",
        "'The Naked and the Dead' by Norman Mailer"
      ],
      "popularGenres": [
        "detective fiction",
        "post-war literature",
        "social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "the ballpoint pen",
        "instant coffee",
        "the transistor radio"
      ],
      "commonDevices": [
        "early television sets",
        "radios in homes",
        "cameras for snapshot photography"
      ],
      "emergingTrends": [
        "the rise of consumerism",
        "increased advertising in print and radio",
        "the popularity of television programming"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "loaf of bread: four pence",
        "movie ticket: one shilling",
        "a pint of milk: four pence"
      ],
      "commonActivities": [
        "visiting friends for holiday gatherings",
        "shopping for Christmas gifts",
        "attending church services on Christmas Eve"
      ],
      "socialRituals": [
        "exchanging Christmas cards",
        "decorating homes with holly and mistletoe"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a growing middle class is emerging",
      "awareness of class disparities remains",
      "post-war optimism contrasts with economic concerns"
    ],
    "gender": [
      "women increasingly assert independence",
      "traditional gender roles are challenged",
      "women returning to workforce face societal scrutiny"
    ],
    "race": [
      "racial segregation and discrimination are prevalent",
      "civil rights movements begin to gain momentum",
      "increased visibility of African American culture"
    ],
    "generalNorms": [
      "politeness and decorum are highly valued",
      "public behavior reflects social class",
      "family and community ties are emphasized"
    ]
  },
  "atmosphericDetails": [
    "The air is dense with the scent of damp earth and the faint aroma of roasted chestnuts from nearby street vendors, mingling with the sharpness of winter chill.",
    "The flickering glow of street lamps casts eerie shadows on the foggy streets, where muffled footsteps echo from the distant sounds of laughter and conversation.",
    "Inside the hotel, the warmth of crackling fires contrasts with the chill outside, as guests sip hot drinks amidst the festive decorations that twinkle with holiday cheer."
  ],
  "paragraphs": [
    "In December 1947, the coastal hotel buzzes with the chatter of guests, their voices blending with the crackle of fires and the soft strains of Christmas carols. Outside, fog rolls in from the ocean, wrapping the streets in a damp embrace, while the occasional drizzle adds to the chill. The atmosphere is thick with suspense, heightened by recent reports of espionage that have left the public on edge. Inside, holiday decorations sparkle, casting a warm glow that belies the growing tensions in the world beyond the hotel's doors.",
    "Fashion during this winter season leans toward a sophisticated elegance. Men don double-breasted suits in rich wool, complemented by silk ties and fedora hats, while women favor tea-length dresses adorned with floral patterns and fitted bodices. Cloche hats and pearl necklaces complete their outfits, as society expects a certain decorum during social gatherings. The attire reflects a post-war optimism, yet hints at the underlying uncertainties of a world still grappling with the implications of conflict.",
    "Daily life is marked by the hustle of Christmas preparations, with shoppers flocking to stores for last-minute gifts. The prices are modest yet reflective of a recovering economy: a loaf of bread costs four pence, while a movie ticket is one shilling. People engage in social rituals, such as exchanging Christmas cards and gathering for festive meals, but beneath the surface, there is a sense of anxiety. The specter of Cold War tensions looms large, and conversations often drift toward the latest news of political unrest and the threat of espionage, adding a layer of intrigue to the otherwise cheerful holiday season."
  ],
  "note": "",
  "cost": 0.00106456845,
  "durationMs": 21101
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of guests at a secluded seaside hotel confronts the tensions of post-war society while a mysterious poisoning incident unfolds, revealing hidden loyalties and secrets among them.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The emergence of women in the workforce amid post-war trauma creates a volatile mix of ambition and suspicion, heightened by Cold War anxieties."
  },
  "setting": {
    "location": "An elegant seaside hotel built in the early 1920s, featuring Art Deco elements and a view of the ocean.",
    "institution": "hotel",
    "weather": "foggy with occasional rain, typical of coastal climates"
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
    "id": "bouquet_presentation_time",
    "value": "half past seven in the evening",
    "description": "The exact time the bouquet was presented to the victim."
  },
  {
    "id": "flower_poison_effect_time",
    "value": "two hours",
    "description": "The time it takes for the flower's poison to begin affecting the victim."
  },
  {
    "id": "victim_alarm_time",
    "value": "a quarter to nine",
    "description": "The time the victim was last seen alert and healthy."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 7,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 16,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "behavioral"
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
      "category": "testimonial"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_7",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_9",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "behavioral"
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

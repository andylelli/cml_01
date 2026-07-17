# Actual Prompt Record

- Run ID: `mystery-1784142200392`
- Project ID: ``
- Timestamp: `2026-07-15T19:08:47.952Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `b09d2f0b7318977d`

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
    "title": "Masquerade of Authority",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Grand Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "impersonation"
    }
  },
  "death_method": "strangled with a silk scarf",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Sharp-witted investigator",
      "private_secret": "keeps a secret",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Desire for justice",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Professional",
      "relationships": [
        "Sylvia Trent (friend)"
      ],
      "public_persona": "Esteemed physician",
      "private_secret": "Had a secret affair with Sylvia",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the victim's room"
      ],
      "behavioral_tells": [
        "Nervous when discussing Sylvia"
      ],
      "stakes": "Fear of reputation damage",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Authority figure",
      "relationships": [
        "Beatrice Quill (former lover)"
      ],
      "public_persona": "Military officer",
      "private_secret": "Discharged under mysterious circumstances",
      "motive_seed": "Desire to protect reputation",
      "motive_strength": "high",
      "alibi_window": "8:30 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Presence at the hotel"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Avoiding scandal",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Acquaintance",
      "relationships": [
        "Sylvia Trent (friend)"
      ],
      "public_persona": "Socialite",
      "private_secret": "Envious of Sylvia's beauty",
      "motive_seed": "Resentment",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the victim’s room"
      ],
      "behavioral_tells": [
        "Gossiping about Sylvia"
      ],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "25-35",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charming guest at the hotel",
      "private_secret": "Involved in a secret relationship",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "none",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Life",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Rival",
      "relationships": [
        "Sylvia Trent (rivalry)"
      ],
      "public_persona": "Wealthy businessman",
      "private_secret": "Had financial dealings with Sylvia",
      "motive_seed": "Financial gain",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Frequent meetings with the victim"
      ],
      "behavioral_tells": [
        "Evasive when questioned about finances"
      ],
      "stakes": "Business reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Captain Ivor Hale"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "At a grand seaside hotel, a masquerade ball turns deadly when Sylvia Trent is found strangled with a silk scarf. With the stormy weather outside and tensions high among guests, Detective Eleanor Voss must unravel a web of deceit and authority impersonation to uncover the truth."
    },
    "accepted_facts": [
      "Sylvia Trent was found dead in her room.",
      "Witnesses claim to have seen hotel staff entering and leaving her room."
    ],
    "inferred_conclusions": [
      "The killer must have had access to the hotel staff uniform.",
      "The time of death is crucial to establishing the timeline."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "Captain Hale disguised himself as hotel staff to access Sylvia's room and create a false alibi.",
      "delivery_path": [
        {
          "step": "Disguised as a bellboy, Captain Hale entered Sylvia's room under the pretense of delivering a message."
        },
        {
          "step": "After the murder, he returned to the lobby and interacted with guests to establish his alibi."
        }
      ]
    },
    "outcome": {
      "result": "Captain Hale's disguise allowed him to move freely and avoid suspicion, framing others instead."
    }
  },
  "false_assumption": {
    "statement": "The hotel staff member seen entering Sylvia's room was legitimate and above suspicion.",
    "type": "authority",
    "why_it_seems_reasonable": "The uniform indicated authority, leading guests to trust the staff member's presence.",
    "what_it_hides": "The true identity of the killer, who manipulated perceptions using the disguise."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch had a motive due to her secret affair with Sylvia.",
      "Witnesses saw her near the victim's room shortly before the murder."
    ],
    "the_one_flaw": "Dr. Finch's medical records place her in the infirmary during the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A bellboy was reported seen near Sylvia's room just before the murder.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The bellboy was delivering a message unrelated to the murder.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Dr. Finch's nervous behavior when questioned raised suspicions.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "She was anxious about her reputation being tarnished due to her affair.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Hugo Vane"
    ],
    "rationale": "All suspects were guests at the hotel during the murder and had the opportunity."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Time of death was estimated between 9:00 PM and 9:30 PM"
      ],
      "windows": [
        "Dr. Finch was in the infirmary from 8:30 PM to 9:30 PM"
      ],
      "contradictions": [
        "Witnesses saw the bellboy after the estimated time of death."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Bellboy"
      ],
      "objects": [
        "Staff uniform",
        "Victim's room"
      ],
      "permissions": [
        "Staff access to guest rooms"
      ]
    },
    "physical": {
      "laws": [
        "A person cannot be in two places at once."
      ],
      "traces": [
        "Scarf found in victim's room"
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust hotel staff implicitly."
      ],
      "authority_sources": [
        "Hotel management"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall seeing a bellboy entering Sylvia's room around 9:15 PM.",
        "correction": "The bellboy's presence does not guarantee legitimacy; it could be a disguise.",
        "effect": "Narrows suspects to Captain Ivor Hale as the only known person with access to the staff uniform.",
        "required_evidence": [
          "Witness statements about the bellboy's entry",
          "Staff access records showing who was on duty"
        ],
        "reader_observable": true
      },
      {
        "observation": "The scarf used to strangle Sylvia has a unique pattern matching a staff uniform.",
        "correction": "The scarf indicates a connection between the killer and hotel staff.",
        "effect": "Strengthens the case against Captain Ivor Hale, who has access to staff uniforms.",
        "required_evidence": [
          "Scarf found in victim's room",
          "Staff uniform description"
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Finch's medical records show she was in the infirmary at the time of death.",
        "correction": "Dr. Finch's alibi eliminates her from suspicion.",
        "effect": "Eliminates Dr. Mallory Finch from the suspect pool.",
        "required_evidence": [
          "Medical records from the infirmary",
          "Witness statements placing her there"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the bellboy's uniform and the scarf used in the murder reveals inconsistencies in size and pattern that don't match Captain Hale's uniform.",
    "knowledge_revealed": "The scarf's unique pattern proves only the bellboy could have worn it, implicating Hale's disguise.",
    "pass_condition": "If the scarf does not match Hale's attire, he must have been the one impersonating the staff member.",
    "evidence_clues": [
      "clue_3",
      "clue_8",
      "clue_core_contradiction_chain",
      "clue_1",
      "clue_2"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements and staff access records allow readers to see the bellboy's dubious entry. Step 2: The scarf's unique pattern links to staff uniforms, narrowing suspicion to Hale. Step 3: Medical records clear Finch, leaving Hale as the only suspect."
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
        "Observe the scarf's pattern match or mismatch",
        "Draw conclusion about Captain Hale's guilt"
      ],
      "test_type": "comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Medical records confirming her presence in the infirmary.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 9:00 PM to 10:00 PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 8:00 PM to 9:30 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence."
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements about the bellboy's entry."
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Medical records from the infirmary."
      },
      {
        "clue_id": "clue_4",
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
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Scarf found in victim's room."
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a charming socialite whose dazzling smile hides a world of debt and desperation. At the center of high society, she is fighting to maintain her status while grappling with a dark secret.",
    "publicPersona": "Charming, well-connected, and always at the center of social happenings.",
    "privateSecret": "Deeply in debt from extravagant spending and fears losing her social status.",
    "motiveSeed": "Wants to eliminate the victim, who has threatened to expose her financial troubles to the high society.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been at the beach club from 8 to 10 PM.",
    "accessPlausibility": "possible",
    "stakes": "Losing her reputation and social standing if exposed.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks with an air of sophistication, often peppering her dialogue with flattery and subtle jabs. Her tone can shift from sweet to sharp in an instant, reflecting her dual nature.",
    "signatureTic": "Oh, darling, you simply must understand...",
    "internalConflict": "Eleanor battles with her growing anxiety over financial ruin and the lengths she might go to preserve her façade.",
    "personalStakeInCase": "Her connection to the victim is deeply personal; the threat of exposure looms over her like a guillotine.",
    "paragraphs": [
      "Eleanor Voss glided through the opulent ballroom of the Grand Seaside Hotel, a vision of elegance draped in silk and diamonds. Her laughter rang like chimes, masking the frantic heart beneath. 'Oh, darling, you simply must understand,' she would say, charming the crowd while calculating each connection like a chess player. To the world, she was the queen of social events, but behind the glimmering facade lay a woman tethered by the weight of her debts.",
      "In hushed conversations, whispers of her financial troubles danced through the elite circles, yet Eleanor wore her mask well. The threat posed by the victim, who had the audacity to threaten exposure, ignited a fire within her. She had long ago learned that in high society, reputation was everything; a tarnished name could lead to a swift fall from grace. The stakes were nothing less than her very existence as she knew it.",
      "As she claimed to have spent the evening at the beach club, her mind raced with possibilities. The victim's fate loomed over her like a shadow, and Eleanor couldn't help but wonder if she could snuff it out without consequence. The thrill of manipulation coursed through her veins, but so did the dread of being caught. Each smile she flashed felt like a tightrope walk over the abyss. Would she finally tumble into the darkness?",
      "Eleanor's internal conflict deepened as the investigation unfolded. The thought of losing her status sent shivers down her spine, and yet, she felt a strange exhilaration in her duplicitous life. Perhaps this was her chance to not just survive but thrive—if only she could eliminate the threat. As she plotted her next move, a realization struck: she could either sink into the depths of deceit or face the truth of her existence. The choice was hers, and the game was just beginning."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated physician caught in a web of desperation and moral ambiguity. Known for her compassion, she struggles to balance her professional integrity with the dark choices she’s made to stay afloat.",
    "publicPersona": "Respected and diligent doctor known for her compassion.",
    "privateSecret": "Has been performing illegal procedures out of desperation to keep her practice afloat.",
    "motiveSeed": "Resentment towards the victim for belittling her professional achievements at social events.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in her office until 9 PM, but could have slipped out.",
    "accessPlausibility": "possible",
    "stakes": "Her medical license is at risk if her illegal activities are revealed.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks with a calm, measured tone, often using medical jargon. She has a tendency to make dry jokes about her profession, reflecting her coping mechanism in the face of stress.",
    "signatureTic": "Well, in my professional opinion...",
    "internalConflict": "Dr. Finch grapples with the guilt of her illegal practices, torn between her oath to heal and her need for financial survival.",
    "personalStakeInCase": "The victim's potential exposure of her illegal procedures could not only ruin her career but also shatter her sense of self-worth.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her office, the scent of antiseptic mingling with the weight of her conscience. 'Well, in my professional opinion...' she often joked, masking her despair with dry wit. As a respected physician, she had always believed in the sanctity of her profession, but desperation had driven her to compromise her values. The illegal procedures she performed began as a means to an end but quickly spiraled into a source of shame.",
      "The victim, with her penchant for ridicule, had taken pleasure in undermining Mallory's achievements at social gatherings. The resentment simmered beneath the surface, a festering wound that made her question her own worth. If only she could silence the voice that belittled her every success. In a world where reputation was currency, the threat of exposure loomed large, and any slip could lead to the unraveling of her life.",
      "Mallory's alibi was shaky at best; she had been in her office until 9 PM but could have easily slipped away. As the investigation unfolded, the fear of being caught gnawed at her insides. The thought of losing her medical license was unbearable. She had devoted her life to healing, yet here she was, teetering on the edge of professional disgrace. The stakes had never felt higher.",
      "With each passing day, Mallory faced an internal conflict that threatened to consume her. Could she confront her moral failings, or would she sink deeper into the shadows of her illegal practices? The case seemed to offer a perverse opportunity: a chance to rid herself of the victim and perhaps reclaim her dignity. Yet, as she pondered her choices, she knew that the road ahead was fraught with peril. What would she sacrifice to save herself?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired military officer whose stoic exterior masks the trauma of his past. Haunted by PTSD and rumors of his wartime actions, he stands at a crossroads between redemption and darkness.",
    "publicPersona": "Stoic and disciplined, a war hero enjoying his retirement by the sea.",
    "privateSecret": "Struggles with PTSD and has become increasingly aggressive.",
    "motiveSeed": "The victim had been spreading rumors about his wartime actions, threatening his reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been in the hotel bar from 9 to 10 PM.",
    "accessPlausibility": "easy",
    "stakes": "A potential disgrace affecting his family legacy.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Speaks in a direct, no-nonsense manner, often punctuated by terse statements. His tone is often grave, reflecting the seriousness of his experiences.",
    "signatureTic": "You have to understand, in war, things are different...",
    "internalConflict": "Ivor battles with the shadows of his past, struggling to reconcile his wartime actions with the man he wishes to be.",
    "personalStakeInCase": "The rumors surrounding the victim could tarnish not only his reputation but also the legacy he wishes to leave for his family.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, nursing a drink as the weight of his past pressed heavily on his shoulders. 'You have to understand, in war, things are different...' he often muttered, as if trying to justify the scars that marred his soul. A war hero in the eyes of many, Ivor's stoicism masked a tempest of emotions, the shadows of PTSD lurking just beneath the surface.",
      "The victim's relentless gossip about his wartime conduct ignited a fire within him, a blend of anger and fear that threatened to consume him. Ivor had fought for honor, and now his name was being dragged through the mud by someone who had never faced the horrors of battle. The stakes were high; a disgrace could shatter not only his reputation but also the legacy he wished to uphold for his family.",
      "With a solid alibi claiming he was in the hotel bar from 9 to 10 PM, Ivor felt a flicker of security, but it was fleeting. The ease of access to the victim only compounded his anxiety. He could feel the walls closing in, the whispers of doubt echoing in his mind. Would he be able to maintain the facade of the stoic hero, or would the darkness within him rise to the surface?",
      "As the investigation unfolded, Ivor faced an internal conflict that threatened to unravel him. Could he find healing and redemption, or would he succumb to the aggression that had begun to consume him? The question loomed large as he navigated the murky waters of guilt and honor. The battle within was just as fierce as any he had fought on the front lines."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an aspiring writer whose dreams are overshadowed by jealousy and insecurity. As she grapples with her identity, the line between admiration and envy grows dangerously thin.",
    "publicPersona": "Enthusiastic and imaginative, always scribbling stories in her notebook.",
    "privateSecret": "Has been plagiarizing parts of the victim's work.",
    "motiveSeed": "Jealous of the victim's literary success and the attention she receives.",
    "motiveStrength": "weak",
    "alibiWindow": "Was in her room writing from 7 to 9 PM.",
    "accessPlausibility": "unlikely",
    "stakes": "Risking her budding career and reputation as a writer.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks in a whimsical, almost dreamy fashion, often getting lost in her thoughts. She has a tendency to laugh at her own misfortunes, using humor to mask her insecurities.",
    "signatureTic": "Oh, I’m just a nobody...",
    "internalConflict": "Beatrice struggles with her self-worth and the fear that she will never achieve the literary success she craves, leading her to desperate measures.",
    "personalStakeInCase": "The victim's possible exposure of her plagiarism could destroy her chances at becoming a recognized writer.",
    "paragraphs": [
      "Beatrice Quill sat in her room, surrounded by crumpled papers and half-finished stories. 'Oh, I’m just a nobody...' she would often say, her voice tinged with self-deprecation. Her enthusiasm for writing was infectious, yet it was overshadowed by the gnawing jealousy she felt towards the victim. The woman had basked in literary success while Beatrice remained in the shadows, scribbling her dreams into oblivion.",
      "As she poured over her notes, Beatrice couldn't shake the feeling of inadequacy that clung to her. The victim's brilliance felt like a spotlight, illuminating her own failures. The plagiarism she engaged in was a desperate attempt to rise above the mediocrity she feared defined her. But the stakes were high; discovery could shatter her budding career before it even began.",
      "Her alibi of writing from 7 to 9 PM felt flimsy against the weight of her guilt. The thought of being implicated in the victim's demise sent her heart racing. Access was unlikely, yet the idea of her secrets being laid bare loomed over her like a dark cloud. Could she bear the shame of being unmasked?",
      "As the investigation unfolded, Beatrice faced an internal conflict that threatened to unravel her dreams. Would she finally embrace her true voice and become a genuine writer, or would jealousy continue to trap her in a cycle of deception? The line between admiration and envy had grown dangerously thin, and she knew that the choice she made could define her future."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is the meticulous hotel manager whose ambition has led her into morally murky waters. As the victim's unethical practices threaten to unravel her carefully constructed world, she must confront her own demons.",
    "publicPersona": "Efficient and meticulous, known for running a tight ship at the hotel.",
    "privateSecret": "Harboring resentment toward the victim for taking credit for her ideas.",
    "motiveSeed": "Victim planned to report unethical practices in the hotel that could implicate Sylvia.",
    "motiveStrength": "compelling",
    "alibiWindow": "Seen helping guests until close around 9 PM.",
    "accessPlausibility": "easy",
    "stakes": "Potential job loss and public disgrace.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with an air of authority, often using sharp, concise language. Her sardonic humor often surfaces as she navigates the challenges of hotel management.",
    "signatureTic": "Well, that’s just typical, isn’t it?",
    "internalConflict": "Sylvia wrestles with her ambition, torn between her desire for success and the ethical compromises she has made to achieve it.",
    "personalStakeInCase": "The victim's threat of exposure could unravel her career and lead to public disgrace, jeopardizing everything she has worked for.",
    "paragraphs": [
      "Sylvia Trent stood in the lobby of the Grand Seaside Hotel, her eyes scanning the bustling guests with a mix of pride and anxiety. 'Well, that’s just typical, isn’t it?' she would quip, her sardonic humor often surfacing in the face of chaos. As the hotel manager, her reputation was built on efficiency, yet the shadows of unethical practices loomed over her like a storm cloud.",
      "The victim's penchant for taking credit for Sylvia's ideas had fostered a simmering resentment. With whispers of the victim's intent to expose the hotel’s wrongdoings, Sylvia felt the ground shift beneath her. The stakes had never been higher; the potential for job loss and public disgrace hung in the balance, threatening to unravel her carefully constructed world.",
      "Her alibi was solid; she had been seen helping guests until closing time, but access to the victim was all too easy. Sylvia felt the pressure mounting, the fear of exposure gnawing at her resolve. Each day was a precarious balancing act, and she could sense that the walls were closing in around her.",
      "As the investigation unfolded, Sylvia faced an internal conflict that tested her ambition. Could she confront the ethical compromises she had made, or would she continue to spiral deeper into the murky waters of deceit? The path ahead was fraught with peril, and every choice she made could lead her closer to either redemption or ruin."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a charismatic real estate developer whose charm conceals a web of corruption. As he navigates the treacherous waters of deceit, he must decide whether to face the consequences of his actions or manipulate his way out.",
    "publicPersona": "Charismatic and persuasive, known for his successful business ventures.",
    "privateSecret": "Involved in shady dealings that the victim threatened to expose.",
    "motiveSeed": "To protect his business interests from the victim's upcoming article revealing corruption.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be closing a deal in town from 8 to 10 PM.",
    "accessPlausibility": "possible",
    "stakes": "His entire business could collapse if exposed.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with a smooth, persuasive tone, often using anecdotes to charm his listeners. He has a knack for turning conversations to his advantage.",
    "signatureTic": "You see, the thing about business is...",
    "internalConflict": "Hugo grapples with the moral implications of his shady dealings, torn between ambition and the fear of exposure.",
    "personalStakeInCase": "The victim's threat to expose his corruption could not only ruin his business but also shatter the facade of success he has built.",
    "paragraphs": [
      "Hugo Vane leaned back in his chair, a charming smile plastered across his face. 'You see, the thing about business is...' he would begin, weaving tales that captivated his audience. A charismatic real estate developer, he had built his empire on charm and persuasion, but the foundation was riddled with corruption. The victim's impending article threatened to expose the cracks in his carefully crafted image.",
      "As he claimed to have been closing a deal in town from 8 to 10 PM, Hugo felt a twinge of anxiety. His alibi was plausible, yet the stakes were monumental; the collapse of his business loomed like a specter. The thought of being unmasked sent shivers down his spine, as he pondered the lengths he might go to protect his interests.",
      "Hugo maneuvered through conversations like a skilled diplomat, but beneath the charm lay an internal conflict that gnawed at him. The moral implications of his shady dealings haunted him, a constant reminder of the precarious position he occupied. Could he continue to manipulate the situation, or would the truth inevitably catch up with him?",
      "As the investigation unfolded, Hugo faced a choice that would define his future. Would he confront the consequences of his actions, or would he slip further into the shadows, using his charm to evade the truth? The game was afoot, and the stakes had never been higher. In a world where power was the ultimate prize, he knew that every move could lead him closer to victory or ruin."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Grand Seaside Hotel",
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand Art Deco hotel perched on a cliff, overlooking the tumultuous sea, where secrets lurk behind every door.",
    "visualDescription": "A striking façade of polished stone and glass, adorned with geometric patterns; a sweeping staircase leads to the central lobby, where plush armchairs invite weary travelers. Large windows frame the grey ocean, waves crashing against the rocks below.",
    "atmosphere": "An air of tension hangs over the hotel, with whispered conversations and furtive glances exchanged among guests.",
    "paragraphs": [
      "As guests arrived at the Grand Seaside Hotel, they were greeted by the exquisite Art Deco architecture that defined its charm. The lobby, with its grand staircase and intricate chandeliers, was a hub of activity, yet beneath the surface, an unsettling tension simmered. The sound of waves crashing against the cliffs outside reminded everyone of the isolation that enveloped the hotel, where assistance from the outside world felt like a distant dream.",
      "The scent of damp sea air mingled with the rich aroma of tobacco from the guests gathered in the lounge, their conversations punctuated by the crackle of the radio broadcasting news from afar. The polished floors reflected the muted light filtering through the large windows, casting long shadows that seemed to whisper secrets of their own. It was a place where the past and present collided, and the weight of unspoken words hung heavily in the air.",
      "As night fell, the atmosphere shifted; the once vibrant lobby grew quieter, the only sounds being the soft rustle of silk gowns and the faint clinking of glasses. Candles flickered on tabletops, their warm glow contrasting with the chill creeping in from the ocean. Guests retreated to their rooms, but the sense of dread lingered, as if the walls themselves were witnesses to the unfolding drama. Each room held its own stories, and each guest their own secrets, waiting to be uncovered."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical for a coastal setting",
    "timeFlow": "Three days of mounting tension and suspicion",
    "mood": "Tense, with an undercurrent of suspicion among the guests",
    "eraMarkers": [
      "Radio broadcasts filling the air with news",
      "Early television sets in common areas",
      "Rationed fuel for transportation",
      "Post-war societal adjustments"
    ],
    "sensoryPalette": {
      "dominant": "Salty sea air mingled with tobacco smoke",
      "secondary": [
        "Soft chatter of hushed conversations",
        "Distant sound of crashing waves"
      ]
    },
    "paragraphs": [
      "The Grand Seaside Hotel stood resolute against the crashing waves, a sentinel of elegance amidst the wild coastal landscape. Its Art Deco lines and grand entrance beckoned travelers, yet the stormy skies overhead cast an ominous shadow. The scent of salt and damp stone filled the air, mixing with the faint aroma of perfume and whiskey as guests mingled in the lobby, their laughter barely masking the tension that lingered.",
      "As evening descended, the atmosphere thickened, shadows lengthening in the corners of the vast lobby. The flickering candlelight illuminated the faces of those gathered, revealing fleeting expressions of concern and curiosity. Outside, the wind howled, and the rain tapped insistently against the windows, creating a symphony of unease that matched the growing apprehension within. Each guest was a potential suspect, each corner of the hotel a potential hiding place for secrets waiting to be unearthed."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Oceanview Lounge",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Plush velvet armchairs arranged around low tables; large windows reveal the turbulent sea outside; dimly lit with art deco sconces.",
      "sensoryDetails": {
        "sights": [
          "dark velvet drapes against the windows",
          "glint of polished brass fittings",
          "shadowy corners where whispers linger",
          "crumpled cocktail napkins scattered",
          "flickering candle flames on tables"
        ],
        "sounds": [
          "soft jazz music from a hidden radio",
          "the distant crash of waves",
          "muffled conversations from nearby tables",
          "the creak of wooden floorboards",
          "the clink of glass against glass"
        ],
        "smells": [
          "salt air mixed with cigar smoke",
          "stale whiskey lingering in the air",
          "freshly polished wood",
          "faint perfume lingering",
          "dampness from the ocean"
        ],
        "tactile": [
          "soft velvet upholstery",
          "cool glass of a cocktail",
          "chill from the ocean breeze",
          "rough stone fireplace surround",
          "smooth metal of a lighter"
        ]
      },
      "accessControl": "Access restricted to hotel guests; staff-only areas behind the bar; security personnel monitoring the entrance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "raindrops racing down the glass",
            "wet footprints on the floor",
            "mist swirling outside the windows"
          ],
          "sounds": [
            "steady patter of rain on the roof",
            "water gurgling in the gutters",
            "the distant rumble of thunder",
            "squeaky shoes on wet floors"
          ],
          "smells": [
            "fresh earth after rain",
            "wet wood and mildew",
            "faint scent of breakfast from the kitchen"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "puddles forming on the floor",
            "guests huddled under umbrellas",
            "clouds hanging heavy in the sky"
          ],
          "sounds": [
            "silence broken by the ticking clock",
            "the creak of old furniture",
            "whispers of guests sharing rumors",
            "the rustle of newspaper pages"
          ],
          "smells": [
            "smoky aroma from a nearby fireplace",
            "dust motes dancing in the air",
            "scent of freshly brewed coffee",
            "the tang of dampness"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight casting flickering shadows",
            "glimmer of stars outside the windows",
            "luxurious fabrics in muted colors",
            "glasses reflecting the light"
          ],
          "sounds": [
            "soft laughter echoing in the room",
            "the crackle of a fire",
            "the distant sound of the ocean",
            "the tolling of a clock striking the hour"
          ],
          "smells": [
            "scent of sandalwood and jasmine",
            "faintly sweet aroma of dessert",
            "the warmth of freshly baked bread",
            "the inviting smell of coffee"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanview Lounge, once a vibrant gathering space, had transformed into a scene of chaos. Plush armchairs that had cradled laughter now bore witness to whispered accusations. The large windows, which typically framed a picturesque view of the sea, now seemed to amplify the sense of foreboding as the waves crashed violently against the cliffs. The flickering candlelight cast unsettling shadows, creating an atmosphere thick with tension as guests eyed one another warily.",
        "As the investigation unfolded, the lounge became a focal point of suspicion. The remnants of half-finished drinks and scattered cocktail napkins told a story of hurried conversations and secrets. Each creak of the floorboards echoed like a heartbeat in the charged silence, and the lingering scent of cigar smoke mixed with the salty air served as a reminder of the storm brewing both outside and within the hotel."
      ]
    },
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Social gathering space",
      "visualDetails": "Richly decorated with art deco furnishings; large bay windows overlook the sea; elegant rugs cover polished wood floors.",
      "sensoryDetails": {
        "sights": [
          "geometric patterns on rugs",
          "opulent chandeliers hanging low",
          "portraits in gilded frames",
          "plush sofas in deep colors",
          "glimmers of sunlight through curtains"
        ],
        "sounds": [
          "soft laughter and chatter",
          "the rustle of silk dresses",
          "a distant piano playing",
          "the crackle of a fire in the hearth",
          "the ticking of an ornate clock"
        ],
        "smells": [
          "freshly polished wood and varnish",
          "the scent of blooming flowers",
          "coffee brewing in the corner",
          "the faint aroma of old books",
          "cinnamon from pastries"
        ],
        "tactile": [
          "smooth silk of cushions",
          "cool marble fireplace mantel",
          "soft wool of rugs underfoot",
          "warmth from the fire",
          "the crispness of a newspaper"
        ]
      },
      "accessControl": "Open to all guests; staff may enter to serve refreshments; monitored by security.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops clinging to windowpanes",
            "clouds casting a grey hue",
            "damp flowers in vases",
            "shadows of branches swaying"
          ],
          "sounds": [
            "gentle pattering of rain",
            "muffled conversations from the lobby",
            "the distant sound of thunder",
            "the crackle of the fire"
          ],
          "smells": [
            "fresh earth and rain",
            "the scent of wet wool",
            "the aroma of baking bread",
            "the tang of sea air"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through curtains",
            "the glow of firelight",
            "shadows stretching across the floor",
            "the flicker of candle flames"
          ],
          "sounds": [
            "the soft murmur of voices",
            "the rustle of fabric",
            "the ticking of the clock",
            "the crackle of the fire"
          ],
          "smells": [
            "the scent of brewing tea",
            "the aroma of baked goods",
            "the mustiness of old books",
            "the warmth of the fireplace"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "twinkling stars visible through windows",
            "candlelight reflecting off glass",
            "the shimmer of the sea at night",
            "the silhouettes of guests in conversation"
          ],
          "sounds": [
            "soft melodies from a piano",
            "the clinking of glasses",
            "laughter echoing softly",
            "the distant crash of waves"
          ],
          "smells": [
            "the rich scent of coffee",
            "the sweetness of pastries",
            "the warmth of freshly baked bread",
            "the earthy aroma of wood smoke"
          ],
          "mood": "warm camaraderie"
        }
      ],
      "paragraphs": [
        "The Drawing Room, with its opulent decor and inviting atmosphere, served as a gathering place for guests seeking solace from the storm outside. Richly adorned with art deco furnishings, the room was a blend of comfort and sophistication. Guests lounged on plush sofas, their conversations a soft murmur against the backdrop of a crackling fire. Here, the air was filled with the aroma of freshly brewed coffee and the sweet scent of pastries, creating an inviting ambiance that belied the tensions brewing beneath the surface.",
        "As the evening wore on, the Drawing Room transformed into a stage for intrigue. The flickering candlelight danced across the faces of those gathered, revealing fleeting glances and whispered secrets. Guests began to speculate about the events of the day, their voices a mix of curiosity and concern. In this space, alliances were formed and suspicions ignited, as the warmth of camaraderie provided a false sense of security amidst the growing uncertainty."
      ]
    },
    {
      "id": "kitchen",
      "name": "Hotel Kitchen",
      "type": "interior",
      "purpose": "Staff-only area for meal preparation",
      "visualDetails": "Industrial layout with stainless steel counters; large ovens and refrigerators; shelves stocked with ingredients.",
      "sensoryDetails": {
        "sights": [
          "gleaming stainless steel surfaces",
          "steam rising from boiling pots",
          "the hustle of kitchen staff",
          "bright overhead lights illuminating the space"
        ],
        "sounds": [
          "the clanging of pots and pans",
          "the hiss of frying food",
          "the chatter of kitchen staff",
          "the whoosh of the oven door",
          "the bubbling of sauces on the stove"
        ],
        "smells": [
          "the rich aroma of roasting meats",
          "fresh herbs and spices",
          "the scent of baking bread",
          "the tang of citrus fruits",
          "the smoky scent of grilled vegetables"
        ],
        "tactile": [
          "cool steel of counters",
          "warmth from the oven",
          "rough texture of burlap sacks",
          "smoothness of fresh vegetables",
          "heat from the stovetop"
        ]
      },
      "accessControl": "Restricted to kitchen staff; monitored by head chef; entry via a locked door.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water pooling on the floor",
            "damp ingredients being prepped",
            "steam clouding the windows",
            "the glow of lights against grey"
          ],
          "sounds": [
            "pattering rain on the roof",
            "the rush of water from the tap",
            "the clatter of utensils",
            "the hum of the refrigerator"
          ],
          "smells": [
            "the scent of fresh pastries",
            "the aroma of brewing coffee",
            "the tang of citrus being zested",
            "the warmth of baked goods"
          ],
          "mood": "busy urgency"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "ingredients laid out for preparation",
            "the bustle of staff at work",
            "the organized chaos of the kitchen"
          ],
          "sounds": [
            "the sizzling of food on the grill",
            "the chatter of staff discussing orders",
            "the clinking of dishes being washed",
            "the thud of pots on the counter"
          ],
          "smells": [
            "the savory aroma of simmering sauces",
            "the scent of fresh bread baking",
            "the richness of herbs and spices",
            "the warmth of cooked meats"
          ],
          "mood": "focused intensity"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of lights illuminating the work area",
            "the shine of polished utensils",
            "preparations for a dinner service",
            "the organized layout of ingredients"
          ],
          "sounds": [
            "the clattering of plates being prepared",
            "the hiss of food finishing on the stove",
            "the laughter of staff unwinding",
            "the distant sounds of guests enjoying their meal"
          ],
          "smells": [
            "the mouthwatering scent of gourmet dishes",
            "the richness of desserts baking",
            "the fragrance of fresh herbs",
            "the warmth of caramelizing onions"
          ],
          "mood": "satisfying anticipation"
        }
      ],
      "paragraphs": [
        "The Hotel Kitchen buzzed with the energy of staff preparing for the evening meals. Gleaming stainless steel counters and the rhythmic clanging of pots created a symphony of culinary creation. The air was thick with the rich aroma of roasting meats and fresh herbs, a tantalizing invitation to guests awaiting their dinner. The organized chaos of the kitchen belied the tension outside, where the storm raged and whispers of intrigue circulated among the guests.",
        "As the day wore on, the kitchen staff worked diligently, their movements a blur as they prepared dishes with precision. The sounds of sizzling food and the chatter of chefs filled the air, creating a lively atmosphere. Yet, amidst the bustle, an undercurrent of unease lingered, as they caught snippets of gossip from the dining room. Secrets exchanged over the clattering of dishes hinted at the brewing storm beyond the kitchen doors, reflecting the growing tensions within the hotel."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023741949000000004,
  "durationMs": 51461
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1949,
    "month": "June",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "overcast skies",
      "occasional rain",
      "cool coastal breezes"
    ],
    "daylight": "Long summer days with daylight lasting until nearly ten o'clock in the evening, followed by a quick descent into twilight.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests gather for dinner.",
    "holidays": [
      "Father's Day (June 19)"
    ],
    "seasonalActivities": [
      "seaside promenades",
      "attending outdoor concerts",
      "visiting local markets"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "dark wool suits",
        "tailored dress shirts with narrow ties",
        "double-breasted blazers"
      ],
      "casual": [
        "lightweight linen trousers",
        "short-sleeved button-up shirts",
        "polo shirts"
      ],
      "accessories": [
        "fedora hats",
        "leather gloves",
        "cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dresses",
        "satin evening gowns",
        "tailored blouses with pencil skirts"
      ],
      "casual": [
        "floral summer dresses",
        "knit cardigans",
        "capri pants"
      ],
      "accessories": [
        "pearl necklaces",
        "wide-brimmed hats",
        "stylish handbags"
      ]
    },
    "trendsOfTheMoment": [
      "increased use of synthetic fabrics",
      "bold floral patterns",
      "mid-century modern aesthetics"
    ],
    "socialExpectations": [
      "traditional gender roles beginning to shift",
      "emphasis on modesty in attire",
      "formal etiquette during social gatherings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Cold War tensions escalating between the USA and USSR",
      "The Marshall Plan continuing to reshape Europe",
      "Growing labor strikes in various industries"
    ],
    "politicalClimate": "A climate of suspicion and paranoia due to the onset of the Cold War, with both domestic and international affairs stirring public concern.",
    "economicConditions": "Post-war recovery is underway, though rationing still affects certain goods; inflation begins to rise.",
    "socialIssues": [
      "women's rights movements gaining momentum",
      "racial integration efforts in the South",
      "labor rights and union disputes"
    ],
    "internationalNews": [
      "Establishment of NATO in April 1949",
      "Continued strife in Palestine",
      "Tensions in China as the Communist Party gains ground"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "The Andrews Sisters' hits",
        "Nat King Cole's ballads"
      ],
      "films": [
        "'All the King's Men'",
        "'The Third Man'",
        "'Gentlemen's Agreement'"
      ],
      "theater": [
        "'South Pacific'",
        "'Death of a Salesman'",
        "'A Streetcar Named Desire'"
      ],
      "radio": [
        "'Suspense' series",
        "'The Shadow'",
        "'The Jack Benny Program'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'1984' by George Orwell",
        "'Fahrenheit 451' by Ray Bradbury"
      ],
      "popularGenres": [
        "detective fiction",
        "science fiction",
        "social commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor",
        "early computers",
        "color television experiments"
      ],
      "commonDevices": [
        "radio sets",
        "film projectors",
        "early television sets"
      ],
      "emergingTrends": [
        "the rise of suburban living",
        "increased automobile ownership",
        "growth of consumerism"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Pint of milk: six pence"
      ],
      "commonActivities": [
        "evening strolls on the boardwalk",
        "family picnics at the beach",
        "garden parties"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "attending church services",
        "community fairs and celebrations"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased mobility due to post-war prosperity",
      "growing awareness of social inequality"
    ],
    "gender": [
      "women increasingly viewed as integral to workforce",
      "traditional domestic roles challenged"
    ],
    "race": [
      "racial tensions simmering in the South",
      "increased discourse on civil rights"
    ],
    "generalNorms": [
      "conformity in social behaviors",
      "emphasis on community and family",
      "suspicion of outsiders"
    ]
  },
  "atmosphericDetails": [
    "The salty tang of the ocean hangs in the air, mingling with the scent of freshly brewed coffee from the hotel's café.",
    "The sound of distant thunder echoes, punctuating conversations in the dimly lit lobby, where guests cast wary glances at one another.",
    "Soft jazz croons from a radio in the corner, setting a tense yet sophisticated mood as the evening unfolds."
  ],
  "paragraphs": [
    "In June 1949, the coastal city is shrouded in a heavy overcast, the horizon blurred by the mist rolling in from the ocean. Occasional rain showers bring a chill to the air, prompting hotel guests to don their best attire for evening gatherings. The long summer days stretch into twilight, where the tension among the guests is palpable, each person acutely aware of the unspoken suspicions brewing beneath their polite smiles. The air is thick with anticipation as the weekend draws near, and the looming Father's Day celebration adds a bittersweet note to the atmosphere.",
    "Fashionably attired, men sport dark wool suits with narrow ties, their fedoras tipped at a rakish angle. The women, in elegant tea dresses adorned with floral patterns, engage in hushed conversations, their pearl necklaces glinting under the dim light. This blend of post-war sophistication and emerging modernity is mirrored in social expectations, where traditional roles are beginning to shift, yet the remnants of modesty still dominate. The hotel lobby buzzes with the sound of laughter and clinking glasses, a stark contrast to the undercurrents of suspicion that weave through their interactions.",
    "Daily life unfolds with a mixture of routine and excitement, as families gather for picnics on the beach or stroll along the boardwalk, enjoying the cool breeze that accompanies the coastal rain. Prices remain reasonable, with a loaf of bread costing four pence, and a movie ticket just a shilling, making entertainment accessible for many. Yet, beneath the surface, social issues simmer: labor strikes and civil rights discussions echo in the minds of many. The growing presence of women in the workforce is slowly changing the dynamics of society, challenging old norms and fostering a sense of resilience in the face of uncertainty."
  ],
  "note": "",
  "cost": 0.0010225957499999999,
  "durationMs": 16659
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A masquerade ball at a grand seaside hotel draws together a diverse group of guests, each navigating post-war societal changes and personal secrets while under the watchful eye of the hotel staff.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Post-WWII adjustments with women entering the workforce, creating tension among traditional roles and fostering suspicion in a climate of Cold War anxieties."
  },
  "setting": {
    "location": "A grand seaside hotel overlooking the ocean",
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
  "theme": "Golden Age murder driven by an impersonation method, where a masquerade of double identity — a disguise exploited to seem to be in two places — breaks the assumed alibi."
}

### LOCKED_FACTS
[
  {
    "id": "mirror_angle",
    "value": "thirty degrees",
    "description": "The angle at which the mirror is placed to create the illusion."
  },
  {
    "id": "footprint_size",
    "value": "size ten",
    "description": "The size of the footprints leading away from the mirror."
  },
  {
    "id": "time_of_appearance",
    "value": "ten minutes past eight",
    "description": "The time witnesses claimed to have seen the suspect in front of the mirror."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 18,
  "countsByPlacement": {
    "early": 3,
    "mid": 14,
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
      "category": "temporal"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_4",
      "placement": "mid",
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
      "category": "temporal"
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
      "category": "behavioral"
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
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "category": "behavioral"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_3",
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

# Actual Prompt Record

- Run ID: `mystery-1784063124632`
- Project ID: ``
- Timestamp: `2026-07-14T21:10:00.041Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `24c42ec774772400`

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
    "author": "AI Mystery Writer",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "seaside",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
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
      "public_persona": "A keen observer and sharp-minded detective.",
      "private_secret": "Haunted by her wartime experiences.",
      "motive_seed": "Solving the mystery to regain her confidence.",
      "motive_strength": "strong",
      "alibi_window": "None; she was present at the scene.",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Direct access to all areas of the hotel."
      ],
      "behavioral_tells": [],
      "stakes": "Her reputation as a detective.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Witness",
      "relationships": [],
      "public_persona": "Respected medical professional.",
      "private_secret": "Has a past connection with the victim.",
      "motive_seed": "Potentially protecting her reputation.",
      "motive_strength": "moderate",
      "alibi_window": "10 minutes before the crime.",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "As a guest at the hotel."
      ],
      "behavioral_tells": [
        "Nervous when discussing the victim."
      ],
      "stakes": "Her professional integrity.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority",
      "relationships": [],
      "public_persona": "Ex-military officer, now a hotel manager.",
      "private_secret": "Knows more about hotel operations than he admits.",
      "motive_seed": "Desires to maintain order in the hotel.",
      "motive_strength": "strong",
      "alibi_window": "Claims to have been in his office.",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all areas of the hotel."
      ],
      "behavioral_tells": [],
      "stakes": "His job and reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A charming guest at the hotel.",
      "private_secret": "Hiding her true identity.",
      "motive_seed": "N/A",
      "motive_strength": "N/A",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "An ambitious journalist.",
      "private_secret": "Desires to uncover hotel scandals.",
      "motive_seed": "Seeking a big story.",
      "motive_strength": "strong",
      "alibi_window": "Claims to have been interviewing guests.",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to the hotel under the guise of work."
      ],
      "behavioral_tells": [
        "Too curious about the victim."
      ],
      "stakes": "Her career.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A wealthy businessman.",
      "private_secret": "Involved in dubious dealings.",
      "motive_seed": "Protecting his interests.",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been in the dining area.",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all areas of the hotel."
      ],
      "behavioral_tells": [
        "Defensive when questioned."
      ],
      "stakes": "His financial standing.",
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
      "summary": "At a grand seaside hotel, a masquerade ball turns deadly when Beatrice Quill is found strangled, revealing a web of deception as Eleanor Voss investigates the true identity behind a mask of authority."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on hotel, staff, and witness to expose the false timing.",
      "delivery_path": [
        {
          "step": "Hale uses his position to instruct staff to create a cover story."
        },
        {
          "step": "He disguises himself as a hotel authority figure."
        },
        {
          "step": "He ensures witnesses see him in a different part of the hotel during the crime."
        }
      ]
    },
    "outcome": {
      "result": "The true sequence of events around Beatrice's death is obscured."
    }
  },
  "false_assumption": {
    "statement": "Captain Hale was in his office at the time of the murder, as he stated.",
    "type": "authority",
    "why_it_seems_reasonable": "Hale is the hotel manager and has access to all areas, making his claim credible.",
    "what_it_hides": "His actual presence at the crime scene disguised as a staff member."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch was seen near the victim shortly before her death.",
      "She had access to the victim's room."
    ],
    "the_one_flaw": "Dr. Finch's alibi is corroborated by multiple witnesses who were with her at the time.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A missing piece of jewelry belonging to Beatrice.",
      "points_at_suspect": "Sylvia Trent",
      "innocent_explanation": "Sylvia was helping Beatrice prepare for the ball and misplaced it.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A note found in Beatrice's belongings suggesting she was in trouble.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The note was from an old business deal unrelated to her murder.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the masquerade ball."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Time of death at approximately eight o'clock."
      ],
      "windows": [
        "Hale's alibi claims he was in his office from seven thirty to eight fifteen."
      ],
      "contradictions": [
        "Witnesses saw Hale in the lobby at eight, contradicting his alibi."
      ]
    },
    "access": {
      "actors": [
        "Captain Hale",
        "Hotel staff"
      ],
      "objects": [
        "Victim's room",
        "Manager's office"
      ],
      "permissions": [
        "Hale had unrestricted access as hotel manager."
      ]
    },
    "physical": {
      "laws": [
        "The hotel's layout allows for hidden routes between locations."
      ],
      "traces": [
        "Footprints found leading away from the crime scene."
      ]
    },
    "social": {
      "trust_channels": [
        "Staff trust Hale due to his authority."
      ],
      "authority_sources": [
        "Hale's position as hotel manager."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses report seeing Captain Hale in the lobby at eight, just after the murder.",
        "correction": "Hale's alibi claiming he was in his office at that time is false.",
        "effect": "Eliminates Hale's credibility as a suspect.",
        "required_evidence": [
          "Witness statements confirming Hale's presence in the lobby.",
          "Hale's alibi statement."
        ],
        "reader_observable": true
      },
      {
        "observation": "A missing button from a hotel uniform is found at the crime scene.",
        "correction": "The button suggests a hotel staff member was present during the murder.",
        "effect": "Narrows the suspect pool to those with access to the uniform.",
        "required_evidence": [
          "The button itself found at the crime scene.",
          "Reports of uniforms being used at the ball."
        ],
        "reader_observable": true
      },
      {
        "observation": "Hale instructs staff to create a cover story that conflicts with witness accounts.",
        "correction": "This manipulation indicates Hale's involvement in obscuring the truth.",
        "effect": "Narrows the investigation towards Hale as a potential culprit.",
        "required_evidence": [
          "Staff statements about Hale's instructions.",
          "Witness reports contradicting the cover story."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Setting up a staged confrontation with hotel staff to reveal Hale's manipulation of alibi.",
    "knowledge_revealed": "Hale's instructions to staff differ from hotel protocols, confirming his deception.",
    "pass_condition": "Hale cannot provide a credible explanation for his conflicting statements.",
    "evidence_clues": [
      "clue_2",
      "clue_1",
      "clue_3"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements about Hale in the lobby (early) and his alibi (mid) expose his deception. Step 2: The missing button clue (early) indicates a staff presence at the murder. Step 3: Hale's manipulation of witness accounts (discriminating test) reveals him as the culprit."
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
        "Observe Hale's reaction or result",
        "Draw conclusion about guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness corroboration",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Jewelry misplaced during preparation.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Old business note unrelated to murder.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "During the trap execution"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witnesses report"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_fp_elimination_hugo_vane",
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
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a tenacious journalist whose sharp instincts drive her to uncover the truth, even as she grapples with her own buried trauma.",
    "publicPersona": "Known for her incisive articles, Eleanor presents herself as a relentless seeker of justice, her words often resonating with the pain and hope of a society recovering from war.",
    "privateSecret": "Haunted by the belief that her brother's death in the war was preventable, Eleanor carries a weight of guilt that shadows her every move.",
    "motiveSeed": "Initially drawn to the hotel for a feature on post-war recovery, Eleanor's instincts compel her to dig deeper into the murder that disrupts the fragile peace.",
    "motiveStrength": "moderate",
    "alibiWindow": "She was interviewing hotel staff at the time of the murder, a plausible cover that grants her access to the investigation.",
    "accessPlausibility": "easy",
    "stakes": "Eleanor's personal quest for justice intertwines with her professional duty, as she seeks to honor her brother's memory by exposing the truth.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a mixture of urgency and precision, her words often clipped when she's passionate. She has a habit of punctuating her statements with rhetorical questions, challenging her interlocutors.",
    "signatureTic": "‘Isn’t it curious how the truth always seems to hide?’",
    "internalConflict": "Eleanor wrestles with the guilt of not being able to save her brother, which complicates her pursuit of justice for others.",
    "personalStakeInCase": "The murder case strikes a personal chord for Eleanor, as she sees it as a chance to confront the unresolved grief over her brother's death.",
    "paragraphs": [
      "Eleanor Voss stood at the edge of the hotel lobby, her keen eyes scanning the room for any sign of truth beneath the polished veneer. She was a journalist, yes, but more than that, she was a seeker of justice, a role she had embraced with fervor since her brother's death during the war. The weight of his loss, compounded by the belief that it was preventable, lurked in the shadows of her mind, urging her to uncover the hidden narratives of pain and resilience that lay beneath the surface of society’s recovery.",
      "The hotel, with its grand facade and gentle sea breeze, was meant to be a sanctuary for healing, a place where souls could mend. Instead, it had become a stage for a murder that threatened to unravel the fragile threads of peace. Her assignment to write about post-war recovery had quickly transformed into a personal investigation, igniting a fire within her that she couldn’t ignore. Each interview she conducted was not just about gathering facts; it was a desperate attempt to reclaim some semblance of control over her own narrative of loss.",
      "As Eleanor delved deeper into the lives of the hotel staff and guests, she found herself navigating a web of secrets and lies. Her instincts, honed by years of reporting, guided her through the murky waters of deceit. Yet, with each revelation, the echoes of her brother’s voice reminded her of her own shortcomings. Was she truly equipped to seek justice when she felt so powerless against her own past? This internal conflict gnawed at her, creating a juxtaposition between her role as a journalist and her unresolved grief.",
      "The stakes grew higher as she uncovered connections between the victim and those around her, leading her to question not only their motives but also her own. Could she confront the truth without succumbing to the weight of her memories? With every clue that surfaced, Eleanor felt the pull of her brother's spirit urging her to press on, to honor his memory by bringing justice to the forefront. It was a perilous journey, one that would either lead to redemption or further entrench her in the shadows of her past."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected psychiatrist whose calm demeanor masks a tumultuous secret, threatening to shatter her carefully constructed life.",
    "publicPersona": "As a community leader and trauma specialist, Dr. Finch is admired for her insights into the human psyche, often seen as a pillar of strength for her patients.",
    "privateSecret": "Behind her polished exterior lies a dark truth: she has conducted unethical experiments on vulnerable patients, driven by a desperate need to maintain her reputation.",
    "motiveSeed": "The victim's potential revelations about her practices could expose her dark past and destroy the career she has painstakingly built.",
    "motiveStrength": "strong",
    "alibiWindow": "She claimed to be in her office, but the possibility of slipping away unnoticed looms large.",
    "accessPlausibility": "possible",
    "stakes": "Her freedom and reputation hang in the balance, as the threat of exposure looms like a storm cloud over her head.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a measured cadence, her words carefully chosen to convey authority. She often employs clinical jargon but softens her tone with a hint of warmth when engaging with patients.",
    "signatureTic": "‘Well, isn’t that an interesting perspective?’",
    "internalConflict": "Dr. Finch grapples with guilt over her unethical choices, fearing that exposure could lead to the loss of everything she values.",
    "personalStakeInCase": "The murder investigation strikes at the heart of her carefully crafted life, as the risk of exposure threatens not only her career but her very identity.",
    "paragraphs": [
      "Dr. Mallory Finch sat in her office, surrounded by the comforting chaos of books and papers, a façade of order that belied her inner turmoil. To the outside world, she was a beacon of hope, a psychiatrist revered for her understanding of trauma. Yet beneath the surface, a tempest brewed, fueled by the dark secrets she had buried in the depths of her conscience. Her patients trusted her, confided their vulnerabilities, unaware of the ethical lines she had crossed in pursuit of knowledge and validation.",
      "The murder of Beatrice Quill had sent shockwaves through the community, and for Dr. Finch, it was an awakening of her worst fears. The victim had become a ticking time bomb, potentially poised to expose the unethical experiments she had conducted under the guise of treatment. As she navigated the delicate balance of her professional responsibilities and the lurking dread of exposure, Dr. Finch found herself spiraling into a morass of guilt and anxiety. Each day felt like a countdown, her carefully maintained reputation hanging by a thread.",
      "In conversations with colleagues and patients alike, Dr. Finch masked her apprehension with an air of calm professionalism. Her words flowed like silk, her tone soothing yet authoritative, masking the turmoil roiling inside her. Yet, when pressed, her polite savagery emerged—sharp comments veiled as concern, a protective armor against the scrutiny she feared. ‘Well, isn’t that an interesting perspective?’ she would say, deflecting probing questions while masking her internal chaos.",
      "As the investigation unfolded, Dr. Finch was forced to confront the consequences of her actions. Would she stand by her choices, or would the weight of her guilt compel her to seek redemption? Each revelation about the victim's life felt like an echo of her own misdeeds, a reminder that truth, like a blade, could cut both ways. In a world where the line between healer and manipulator blurred, Dr. Finch’s journey would lead her to a reckoning that could shatter her carefully constructed life."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a charming retired naval officer whose charismatic exterior conceals a dangerous involvement in illicit activities.",
    "publicPersona": "With his charismatic charm and engaging stories, Captain Hale is a beloved figure in the community, often seen as a mentor to younger naval enthusiasts.",
    "privateSecret": "Involved in a smuggling operation that uses the hotel as a front, Captain Hale risks everything to maintain his double life.",
    "motiveSeed": "The victim had discovered his smuggling activities and was poised to expose him, threatening his carefully crafted image.",
    "motiveStrength": "strong",
    "alibiWindow": "He claimed to be at the bar, yet no one can confirm his whereabouts, leaving a shadow of doubt over his innocence.",
    "accessPlausibility": "easy",
    "stakes": "Captain Hale stands to lose not only his reputation but also his freedom if his illicit activities come to light.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Captain Hale speaks with a booming voice, often punctuating his tales with grand gestures. He has a penchant for dramatic pauses and uses nautical jargon liberally, creating a theatrical presence.",
    "signatureTic": "‘Ahoy, matey! Life’s but a grand adventure!’",
    "internalConflict": "While he relishes the thrill of his secret life, Captain Hale is increasingly aware of the moral decay it brings, forcing him to question his choices.",
    "personalStakeInCase": "The murder case is a direct threat to his livelihood and reputation, pushing him to take desperate measures to protect his secrets.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, a glass of whiskey cradled in his hand, his presence radiating charm and confidence. To the world, he was a hero—a retired naval officer who had served his country with honor. But behind the jovial exterior lay a darker reality, one that involved smuggling operations that threatened to unravel the very fabric of his carefully constructed life. ‘Ahoy, matey! Life’s but a grand adventure!’ he would exclaim, drawing laughter from patrons, unaware that his own adventure was spiraling into chaos.",
      "The murder of Beatrice Quill felt like the storm that had finally breached his ship’s hull. She had stumbled upon his secret, a dangerous knowledge that could sink him if it surfaced. As he navigated the murky waters of deceit, Captain Hale felt the pressure mounting. The jovial tales he spun in the bar now felt like a thin veneer, barely concealing the panic that threatened to engulf him. With every passing moment, the stakes grew higher, forcing him to consider how far he would go to protect his secrets.",
      "In conversations with the hotel staff and guests, Hale employed his sardonic humor as both a shield and a weapon. His stories, laced with wit, often masked the tension simmering beneath the surface. ‘Ah, the sea is a fickle mistress, but I’ve always managed to sail her well!’ he would joke, deflecting inquiries with a charming grin. Yet, the weight of his choices bore down on him, and he found himself questioning whether he could continue to live this double life without consequence.",
      "As the investigation unfolded, Captain Hale stood at a crossroads. Would he continue to navigate the treacherous waters of his criminal enterprise, or would he finally confront the moral decay that had taken root in his life? The thrill of the chase was intoxicating, but the fear of exposure loomed large. In a world where charm could only take him so far, Captain Hale would need to confront the reality of his choices and the potential fallout of the murder that threatened to unravel everything he held dear."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a young hotel receptionist whose sweet demeanor hides a simmering resentment towards the victim, who belittled her ambitions.",
    "publicPersona": "Portrayed as a naive and eager young woman, Beatrice strives to maintain the hotel's reputation and please her superiors.",
    "privateSecret": "Internally, Beatrice harbors bitterness towards the victim, who relentlessly undermined her aspirations in the hospitality industry.",
    "motiveSeed": "The humiliation she felt at the victim's hands drove Beatrice to a boiling point, leading her to contemplate dark choices.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claimed to be at the reception desk during the murder, but the possibility of slipping away remains.",
    "accessPlausibility": "possible",
    "stakes": "Beatrice fears losing her job and being wrongly blamed for the incident, which would shatter her fragile self-esteem.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Beatrice speaks in a soft voice, often punctuating her sentences with nervous laughter. She has a tendency to downplay her own importance, using phrases that reveal her insecurities.",
    "signatureTic": "‘I suppose I’m just not cut out for this kind of thing…’",
    "internalConflict": "Beatrice struggles with her feelings of inadequacy, torn between her desire for validation and the resentment she harbors towards those who belittle her.",
    "personalStakeInCase": "The murder case not only threatens her job but also forces Beatrice to confront her own feelings of worthlessness and the need to assert herself.",
    "paragraphs": [
      "Beatrice Quill stood behind the reception desk, her fingers nervously tapping against the polished wood as she greeted guests with a bright smile. To the world, she was the epitome of sweetness and naivety, always eager to please. But beneath the surface, a tempest brewed—one fueled by the relentless belittling she had endured at the hands of Beatrice Quill. The victim’s scorn had cut deep, leaving Beatrice feeling small and insignificant, a mere cog in the hotel’s grand machinery.",
      "As the murder unfolded, Beatrice found herself grappling with a whirlwind of emotions. She had once looked up to the victim, aspiring to rise through the ranks in the hospitality industry. Yet, with each dismissive remark, her dreams felt further out of reach. ‘I suppose I’m just not cut out for this kind of thing…’ she would mutter to herself, downplaying her ambitions while resentments simmered just beneath the surface. The incident had ignited a fire within her, a yearning to reclaim her voice and assert her worth in a world that had consistently overlooked her.",
      "In conversations with colleagues, Beatrice often employed self-deprecating humor to navigate her insecurities. Her soft voice would quiver slightly as she attempted to deflect attention away from herself, often punctuating her statements with nervous laughter. ‘Oh, I’m just the receptionist, nothing too important,’ she would say, attempting to downplay her role in the hotel’s operations. Yet, as the investigation unfolded, the weight of her feelings became increasingly difficult to suppress.",
      "The stakes had never been higher for Beatrice. Not only did she fear losing her job, but the specter of blame loomed large over her. As the investigation continued, she was forced to confront the very resentment that had held her captive for so long. Would she continue to remain in the shadows of others, or would she find the courage to step into the light and assert her own identity? The murder case had become a crucible for Beatrice, one that could either forge her into a stronger version of herself or shatter her fragile self-esteem."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a wealthy socialite whose extravagant lifestyle masks a precarious financial situation and the threat of blackmail.",
    "publicPersona": "Known for her lavish parties and charm, Sylvia captivates the elite circles with her charisma and elegance.",
    "privateSecret": "Desperately in debt and facing blackmail from the victim, Sylvia's world is built on a fragile facade.",
    "motiveSeed": "The victim's plan to expose her financial troubles threatened to unravel the social standing Sylvia had fought so hard to maintain.",
    "motiveStrength": "compelling",
    "alibiWindow": "She claimed to be hosting a dinner party, yet her guests' reliability is questionable at best.",
    "accessPlausibility": "unlikely",
    "stakes": "Sylvia's social standing and financial future hang in the balance, as the threat of exposure looms large.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a refined eloquence, often weaving in anecdotes from her social life. She has a tendency to make dry observations about the absurdities of high society.",
    "signatureTic": "‘Isn’t it amusing how appearances can be so deceiving?’",
    "internalConflict": "Sylvia struggles with the duality of her public persona and her private struggles, fearing that the truth will shatter her carefully constructed life.",
    "personalStakeInCase": "The murder case threatens to expose her vulnerabilities, forcing Sylvia to confront her financial troubles and the precariousness of her social standing.",
    "paragraphs": [
      "Sylvia Trent glided through the hotel lobby, her presence commanding attention, a vision of elegance draped in silk and pearls. To the world, she was the epitome of high society—a socialite who hosted extravagant soirées and captivated the elite with her charm. Yet, beneath the polished surface lay a precarious reality, one where financial troubles loomed large and blackmail threatened to expose the cracks in her facade. ‘Isn’t it amusing how appearances can be so deceiving?’ she would remark with a wry smile, masking her fears with a veneer of confidence.",
      "The murder of Beatrice Quill sent ripples through Sylvia's carefully curated life, bringing her vulnerabilities to the forefront. The victim had been privy to Sylvia's financial woes, threatening to unravel the social standing she had fought tooth and nail to maintain. Each day felt like a tightrope walk, balancing the demands of her public persona with the gnawing dread of exposure. Sylvia’s once-joyous laughter now felt hollow, echoing in the empty chambers of her mind as she grappled with the reality of her situation.",
      "In conversations with her peers, Sylvia employed observational humor to navigate the absurdities of high society. ‘Oh, darling, isn’t it fascinating how people will go to great lengths to maintain an illusion?’ she would quip, her tone laced with a mixture of charm and cynicism. Yet, as the investigation unfolded, the laughter that once flowed so freely began to feel like a mask, hiding the truth of her precarious existence. The pressure of maintaining appearances weighed heavily on her, forcing her to confront the reality of her situation.",
      "As the investigation deepened, Sylvia faced a reckoning. Would she continue to hide behind the mask of the socialite, or would she embrace the authenticity that had long eluded her? The murder case had become a catalyst for change, pushing her to confront her financial struggles and the fragility of her social standing. In a world where appearances reigned supreme, Sylvia would need to decide whether to risk everything for the sake of truth or to cling to the facade that had defined her life for so long."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a suave hotel manager whose polished exterior conceals a web of shady dealings that threaten to unravel his career.",
    "publicPersona": "With a reputation for charm and efficiency, Hugo is known for his ability to schmooze guests and maintain the hotel's image.",
    "privateSecret": "Engaged in unethical deals to boost profits, Hugo fears that the victim's knowledge of his dealings could cost him everything.",
    "motiveSeed": "The victim had evidence of his shady practices, putting Hugo at risk of exposure.",
    "motiveStrength": "strong",
    "alibiWindow": "He insisted he was in the office during the murder, but no one can verify his whereabouts.",
    "accessPlausibility": "easy",
    "stakes": "Hugo risks losing his career and facing jail time if his dealings are uncovered.",
    "humourStyle": "blunt",
    "humourLevel": 0.7,
    "speechMannerisms": "Hugo speaks with a confident cadence, often cutting to the chase with blunt honesty. He has a knack for using sardonic humor to deflect uncomfortable topics.",
    "signatureTic": "‘Let’s not mince words here…’",
    "internalConflict": "Hugo is torn between his ambition and the moral implications of his actions, struggling to reconcile his greed with the potential consequences.",
    "personalStakeInCase": "The murder investigation threatens to expose his unethical dealings, forcing Hugo to confront the reality of his choices and the potential fallout.",
    "paragraphs": [
      "Hugo Vane leaned against the reception desk, a suave smile playing on his lips as he greeted guests with effortless charm. To the world, he was the epitome of the ideal hotel manager—efficient, polished, and always ready with a quip. Yet, beneath the surface, a web of shady dealings threatened to unravel his carefully crafted image. ‘Let’s not mince words here…’ he would say, cutting to the chase in conversations, revealing a blunt honesty that masked the chaos lurking just out of sight.",
      "The murder of Beatrice Quill felt like a ticking time bomb, one that could expose the unethical deals he had orchestrated to boost the hotel’s profits. Each passing hour intensified his anxiety, as the specter of exposure loomed large. The victim had been privy to his secrets, and with her death, the stakes had never been higher. Would he manage to navigate this treacherous landscape, or would his ambition lead to his downfall?",
      "In conversations with staff and guests, Hugo employed blunt humor as a defense mechanism, using sardonic remarks to deflect attention from his precarious situation. ‘Ah, the hospitality industry… where the truth is just another service we provide,’ he would joke, his tone laced with irony. Yet, as the investigation progressed, the facade began to crack, revealing the depth of his internal conflict. Ambition and greed battled against the moral implications of his choices, leaving him torn between the allure of success and the fear of exposure.",
      "As the investigation deepened, Hugo faced a reckoning. Would he continue to pursue his ambitions, risking everything for the sake of profit, or would he confront the reality of his actions? The murder case had become a catalyst for change, forcing him to grapple with the consequences of his choices. In a world where charm could only take him so far, Hugo would need to confront the truth of his dealings and the potential fallout that could shatter the carefully constructed life he had built."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Cliffside Grand Hotel",
    "type": "hotel",
    "place": "Bournemouth",
    "country": "England",
    "summary": "A grand seaside hotel perched on the cliffs of Bournemouth, offering stunning ocean views and an air of mystery.",
    "visualDescription": "Art deco architecture with sweeping curves; polished marble floors reflect the soft glow of ornate chandeliers; large windows frame the turbulent sea below.",
    "atmosphere": "A palpable tension fills the air, as whispers of recent events stir unease among the guests.",
    "paragraphs": [
      "The Cliffside Grand Hotel stands defiantly against the churning waves of the English Channel, its art deco facade a striking contrast to the rugged cliffs below. The lobby, with its polished marble floors and high ceilings, echoes with the soft murmur of guests, each lost in their own thoughts. A hint of salt and dampness pervades the air, mingling with the faint scent of fresh flowers arranged in glass vases. The large windows frame a tumultuous sea, the grey waters reflecting the overcast sky, creating an atmosphere thick with suspense.",
      "Evening approaches, and the hotel's grand dining area buzzes with a mix of chatter and clinking cutlery. Guests, cloaked in their finest attire, gather around tables adorned with crisp white linens and flickering candlelight. Yet, beneath the surface of laughter lies an undercurrent of tension, as recent events cast shadows over the festivities. The distant sound of waves crashing against the cliffs punctuates the air, a constant reminder of the isolation that envelops this cliffside retreat.",
      "As the night deepens, the hotel reveals its secrets—narrow hallways leading to guest rooms, where thin walls allow for whispered conversations to travel unnoticed. Staff-only areas remain off-limits, with management keeping a watchful eye on guest activities. The secluded beach access, with its fire exit leading directly to the shore, adds an element of danger, especially when the storm clouds gather above, threatening to unleash their fury. This grand hotel, while a haven for some, harbors a mystery that begs to be uncovered."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates",
    "timeFlow": "Three days of mounting tension as secrets unravel",
    "mood": "tense, with whispers of recent events causing unease among guests",
    "eraMarkers": [
      "Radio broadcasts in every guest room",
      "Early television sets in common areas",
      "Rationed fuel limiting transportation"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and dampness",
      "secondary": [
        "flickering candlelight",
        "crackling fireplace"
      ]
    },
    "paragraphs": [
      "The air is thick with anticipation, laden with the scent of salt and the distant rumble of thunder. Shadows dance across the polished marble floors, cast by the flickering candlelight of the dining room, where laughter seems just a touch too forced. Outside, the ocean churns restlessly, a mirror to the unease festering within the hotel's guests.",
      "As night falls, the atmosphere shifts; the soft sounds of waves crashing meld with hushed conversations and the occasional clink of glass. Secrets linger in the air, heavy and unspoken, while the overcast sky looms ominously, as if aware of the mysteries waiting to be unveiled."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "High ceilings adorned with art deco chandeliers; polished marble flooring; large windows overlooking the sea.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate chandeliers",
          "sea-view windows",
          "plush velvet seating",
          "decorative potted plants"
        ],
        "sounds": [
          "murmurs of guests",
          "clinking glasses",
          "distant piano music",
          "footsteps on marble",
          "the rush of the wind outside"
        ],
        "smells": [
          "fresh flowers",
          "polished wood",
          "damp sea air",
          "candle wax",
          "old leather"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft velvet upholstery",
          "cool sea breeze",
          "warmth from the fireplace",
          "crisp linen napkins"
        ]
      },
      "accessControl": "Open to all guests; staff access for cleaning and maintenance during off-hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady rain on the roof",
            "soft whispers of guests",
            "the rustle of newspapers"
          ],
          "smells": [
            "wet stone",
            "freshly brewed coffee",
            "damp fabric"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light from the sky",
            "shadows lengthening in corners"
          ],
          "sounds": [
            "silence punctuated by distant laughter",
            "the distant crash of waves"
          ],
          "smells": [
            "dust from the corners",
            "beeswax polish",
            "old paper"
          ],
          "mood": "suspicious stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "guests in elegant attire"
          ],
          "sounds": [
            "clinking cutlery",
            "laughter rising and falling",
            "soft piano melodies"
          ],
          "smells": [
            "cooked seafood",
            "fresh bread",
            "burning wood"
          ],
          "mood": "festive anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the heartbeat of the hotel, a place where guests gather, share stories, and partake in the evening's entertainment. The high ceilings, adorned with intricate art deco chandeliers, cast a warm glow over the polished marble floors, which reflect the soft light like a mirror. Plush velvet seating invites weary travelers to relax, while large windows frame the tumultuous sea, hinting at the mysteries that lie beyond.",
        "As guests mingle, the air is filled with a blend of laughter and hushed conversation, the atmosphere thick with unspoken secrets. The scent of fresh flowers and polished wood mingles with the salty tang of the sea, creating a unique olfactory signature that defines this space. It's a gathering place that, while welcoming, holds an undercurrent of tension, as if the very walls are privy to the secrets whispered within."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Dining area",
      "visualDetails": "Elegant tables set with fine china; large windows overlooking the crashing waves; art deco motifs in the decor.",
      "sensoryDetails": {
        "sights": [
          "white tablecloths with silverware",
          "glimmering glass chandeliers",
          "ocean waves crashing below",
          "art deco wall motifs",
          "elegantly dressed guests"
        ],
        "sounds": [
          "soft classical music",
          "clinking of silverware",
          "murmurs of conversation",
          "occasional laughter",
          "the crash of waves against the cliffs"
        ],
        "smells": [
          "rich seafood dishes",
          "freshly baked bread",
          "scent of wine",
          "butter melting on vegetables",
          "candle wax"
        ],
        "tactile": [
          "smooth porcelain plates",
          "cool metal cutlery",
          "soft fabric napkins",
          "warmth from nearby fireplaces",
          "the draft from open windows"
        ]
      },
      "accessControl": "Open to all guests during meal hours; staff access for service.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through rain",
            "wet tablecloths"
          ],
          "sounds": [
            "rain tapping against windows",
            "the rustling of newspapers"
          ],
          "smells": [
            "fresh coffee",
            "toasted bread",
            "wet linens"
          ],
          "mood": "serene yet heavy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "empty tables waiting for evening guests"
          ],
          "sounds": [
            "silence punctuated by distant waves",
            "the faint creak of old wood"
          ],
          "smells": [
            "dust settling",
            "the scent of lingering meals",
            "old leather"
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight casting flickering shadows",
            "guests toasting with wine glasses"
          ],
          "sounds": [
            "laughter rising and falling",
            "the soft thump of chairs being moved"
          ],
          "smells": [
            "grilled fish",
            "herbs and spices",
            "freshly baked pastries"
          ],
          "mood": "giddy celebration"
        }
      ],
      "paragraphs": [
        "The Dining Room, with its elegant tables set for dinner, offers guests a feast for both the palate and the eyes. Large windows frame the ocean beyond, where waves crash against the cliffs, providing a dramatic backdrop to the evening's indulgences. The air is filled with the enticing aroma of rich seafood dishes and freshly baked bread, creating an atmosphere of culinary delight.",
        "As guests gather, the soft strains of classical music accompany the clinking of silverware and the gentle murmur of conversation. Here, laughter mingles with the salty air, and the flickering candlelight casts a warm glow over the tables, creating an inviting space that hides the tension simmering just beneath the surface. The Dining Room is a place where the charm of fine dining meets the weight of unspoken secrets."
      ]
    },
    {
      "id": "beach_access",
      "name": "Secluded Beach Access",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "Narrow pathway leading down the cliff; wild grasses swaying in the wind; rocky shore below.",
      "sensoryDetails": {
        "sights": [
          "rough cliffside path",
          "crashing waves against rocks",
          "tangled seaweed",
          "stormy skies",
          "distant figures walking along the shore"
        ],
        "sounds": [
          "waves crashing on rocks",
          "wind howling through grasses",
          "distant seagull cries",
          "the rustle of leaves",
          "the echo of footsteps"
        ],
        "smells": [
          "salty sea air",
          "wet earth",
          "damp driftwood",
          "fresh rain on sand",
          "decaying seaweed"
        ],
        "tactile": [
          "rough stone path underfoot",
          "cool sea breeze against skin",
          "wet sand between toes",
          "cold sea water splashing",
          "sharp edges of rocks"
        ]
      },
      "accessControl": "Guests may only access during daylight hours; restricted access at night for safety.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds overhead",
            "puddles forming on the path"
          ],
          "sounds": [
            "steady rain falling",
            "distant thunder rumbling"
          ],
          "smells": [
            "damp earth",
            "fresh rain",
            "soggy seaweed"
          ],
          "mood": "ominous"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dark clouds gathering",
            "waves crashing violently"
          ],
          "sounds": [
            "roaring waves",
            "howling wind"
          ],
          "smells": [
            "cold sea spray",
            "wet sand",
            "damp driftwood"
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting fiery colors",
            "silhouettes of people on the beach"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the soft whisper of the wind"
          ],
          "smells": [
            "warm sea breeze",
            "scent of evening flowers",
            "salt lingering in the air"
          ],
          "mood": "haunting beauty"
        }
      ],
      "paragraphs": [
        "The Secluded Beach Access is a narrow, winding path that descends from the hotel to the rocky shore below. Wild grasses sway in the coastal breeze, framing the rugged landscape that leads to the crashing waves. This path, while offering a breathtaking view, also hides its dangers, particularly when the storm clouds gather overhead.",
        "As the waves roar against the rocks, the air is filled with the salty tang of the sea, mingling with the damp earth from the recent rains. Here, the isolation of the beach creates an eerie stillness, broken only by the sound of the surf and the occasional cry of a distant gull. This is a place where secrets can be buried, and the shadows of the cliffs conceal more than just the tide."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "Dark wood shelves lined with books; leather armchairs; a large globe in the corner.",
      "sensoryDetails": {
        "sights": [
          "soft glow from reading lamps",
          "leather-bound tomes",
          "an ornate globe",
          "dust motes floating in light"
        ],
        "sounds": [
          "soft rustling of pages",
          "the ticking of a clock",
          "distant whispers",
          "the creak of leather seats",
          "the crackle of a fire"
        ],
        "smells": [
          "old paper and leather",
          "dust",
          "smoky fireplace",
          "vanilla from candles",
          "fresh ink"
        ],
        "tactile": [
          "smooth leather chair",
          "cool brass doorknob",
          "crisp pages of books",
          "soft woolen throw",
          "warmth from the fireplace"
        ]
      },
      "accessControl": "Access restricted to guests with permission; staff may enter for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "dim light filtering through clouds"
          ],
          "sounds": [
            "steady rain on the roof",
            "soft whispers of guests"
          ],
          "smells": [
            "damp paper",
            "freshly brewed tea",
            "the scent of wet wood"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "dust accumulating on shelves"
          ],
          "sounds": [
            "silence punctuated by distant laughter",
            "the faint creak of old wood"
          ],
          "smells": [
            "dust settling",
            "the scent of fading books",
            "old leather"
          ],
          "mood": "suspicious stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight casting flickering shadows",
            "guests deep in thought"
          ],
          "sounds": [
            "the soft crackle of the fire",
            "the turning of pages"
          ],
          "smells": [
            "burning wood",
            "freshly brewed coffee",
            "the scent of polished wood"
          ],
          "mood": "tense focus"
        }
      ],
      "paragraphs": [
        "The Library, with its dark wood shelves filled with leather-bound books, offers a sanctuary of knowledge and mystery. A soft glow from reading lamps illuminates the space, inviting guests to lose themselves in the pages of forgotten tales. An ornate globe rests in the corner, a reminder of the vast world beyond the hotel’s confines.",
        "As guests settle into the leather armchairs, the air is thick with the scent of old paper and leather, creating an atmosphere of introspection. The soft rustling of pages and the ticking of a clock create a rhythm of quiet contemplation, while the crackle of the fireplace adds warmth to the dimly lit room. This is a place where secrets may be uncovered, and the past whispers through the pages waiting to be turned."
      ]
    }
  ],
  "note": "",
  "cost": 0.0022644402,
  "durationMs": 49162
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
      "overcast with frequent rain showers",
      "chilly winds from the coast",
      "damp air creating a heavy atmosphere"
    ],
    "daylight": "Short daylight hours, with the sun rising around 7:50 AM and setting by 4:30 PM, leaving long shadows and a sense of early nightfall",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests retreat to their rooms, the hotel quieting down",
    "holidays": [
      "New Year's Day (January 1)",
      "Epiphany (January 6)"
    ],
    "seasonalActivities": [
      "Indoor gatherings with board games and card games in the hotel lounge",
      "Visits to local museums to escape the rain",
      "Enjoying warm drinks by the fireplace"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "dark wool suits with wide lapels",
        "crisp white dress shirts",
        "black leather oxfords"
      ],
      "casual": [
        "tweed blazers",
        "faded wool sweaters",
        "slack trousers"
      ],
      "accessories": [
        "silk ties with geometric patterns",
        "felt fedoras",
        "gloves for protection against the chill"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dresses with cinched waists",
        "string of pearls",
        "heavily padded coats"
      ],
      "casual": [
        "tweed skirts paired with thick knit sweaters",
        "turtlenecks under cardigans",
        "wide-brimmed hats"
      ],
      "accessories": [
        "stylish handbags made of leather",
        "fur stoles for evening wear",
        "decorative brooches"
      ]
    },
    "trendsOfTheMoment": [
      "utilitarian styles reflecting post-war practicality",
      "influences of Hollywood glamour on evening wear",
      "the return of bold, bright colors in spring collections"
    ],
    "socialExpectations": [
      "traditional gender roles still prevalent but slowly shifting",
      "increased acceptance of women in leadership roles at work",
      "heightened suspicion and anxiety regarding foreign influences"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the start of the Cold War and rising tensions with the Soviet Union",
      "the Berlin Blockade initiated in June 1948, becoming a point of concern",
      "domestic adjustments as returning soldiers reintegrate into civilian life"
    ],
    "politicalClimate": "A sense of unease as politicians debate foreign policy and military readiness in light of recent global tensions",
    "economicConditions": "Struggling to recover from wartime rationing; prices are stabilizing but still reflect shortages in certain goods",
    "socialIssues": [
      "displacement of veterans needing jobs",
      "women's rights movements gaining traction",
      "racial tensions as civil rights discussions begin to surface"
    ],
    "internationalNews": [
      "the establishment of the United Nations and its role in promoting peace",
      "increasing reports of Soviet espionage in Western nations",
      "the impact of the Marshall Plan on European recovery efforts"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "The Andrews Sisters' 'Boogie Woogie Bugle Boy'",
        "Nat King Cole's smooth jazz tunes"
      ],
      "films": [
        "'The Best Years of Our Lives' depicting veterans adjusting to civilian life",
        "'It’s A Wonderful Life' showcasing post-war community values",
        "'Gentlemen's Agreement' addressing anti-Semitism"
      ],
      "theater": [
        "Broadway hits like 'Annie Get Your Gun'",
        "local vaudeville shows attracting hotel guests",
        "experimental plays exploring social themes"
      ],
      "radio": [
        "'The Jack Benny Program' providing comedic relief",
        "news bulletins discussing the latest from Washington",
        "music variety shows captivating audiences"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'The Stranger' by Albert Camus",
        "'The Naked and the Dead' by Norman Mailer"
      ],
      "popularGenres": [
        "detective fiction gaining traction",
        "post-war novels reflecting existential themes",
        "romantic thrillers capturing the imagination"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercially available television sets gaining popularity",
        "advancements in radar technology for military use",
        "early computers in their infancy, mainly for research purposes"
      ],
      "commonDevices": [
        "radio sets in every guest room",
        "public phonographs playing popular records in lounges",
        "newspaper vending machines on street corners"
      ],
      "emergingTrends": [
        "the rise of television as a household staple",
        "increased interest in consumer electronics",
        "greater availability of household appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cigarettes: seven pence",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "attending community dances and social gatherings",
        "visiting local parks for winter walks",
        "engaging in group discussions about politics over coffee"
      ],
      "socialRituals": [
        "afternoon tea served in the hotel lounge",
        "weekly bingo nights drawing guests together",
        "formal dinner parties with set seating arrangements"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "an emerging middle class with disposable income",
      "persistent class distinctions affecting social interactions"
    ],
    "gender": [
      "increasing independence for women in the workforce",
      "debates surrounding women's roles in society"
    ],
    "race": [
      "growing awareness of civil rights issues",
      "racial segregation still prevalent in many areas"
    ],
    "generalNorms": [
      "traditional family values still hold strong",
      "increased acceptance of diverse lifestyles in urban areas",
      "collective trauma shaping post-war relationships"
    ]
  },
  "atmosphericDetails": [
    "The damp air clings to the skin, heavy with the scent of rain-soaked wood and lingering smoke from the fireplace.",
    "The muted chatter of guests fills the hotel lobby, occasionally punctuated by the sound of a radio broadcasting the evening news.",
    "Outside, the rhythmic patter of rain against windows creates a backdrop of tension, echoing the unease of the times."
  ],
  "paragraphs": [
    "In the coastal chill of January 1947, the atmosphere in the hotel is thick with unease. Overcast skies loom overhead, and occasional rain showers create a dreary backdrop for the guests, many of whom are still adjusting to the aftermath of the war. The short days leave the hotel dim and shadowy, with whispers of recent events and global tensions permeating conversations. As the evening descends, the once bustling lobby quiets, with only the faint crackle of a radio and the soft clinking of glasses echoing the growing tension among the guests.",
    "Fashion reflects the resilience of a society in transition. Men don dark wool suits with wide lapels, their fedoras tipped low to shield them from the damp chill, while women embrace elegant tea-length dresses cinched at the waist, adorned with pearls. Stylish handbags and gloves complete their looks, evoking a sense of post-war glamour amid practical utility. The trend towards bold colors is just beginning to emerge, hinting at a brighter future beyond the shadows of conflict.",
    "Daily life in this January is marked by a blend of traditional social rituals and emerging modernity. Guests gather for afternoon tea, sharing stories of their lives, while evenings may find them engaged in spirited games of bingo or discussing the latest news over coffee. Prices reflect the ongoing recovery: a loaf of bread costs four pence, while a taxi ride is two shillings. Social expectations still lean heavily towards the traditional, but an undercurrent of change is palpable, with women stepping into roles previously reserved for men, and the stirrings of civil rights discussions beginning to shape the conversations."
  ],
  "note": "",
  "cost": 0.00114017145,
  "durationMs": 15852
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A masquerade ball at a grand seaside hotel draws a diverse group of guests, where post-war tensions and shifting social norms create an atmosphere ripe for deception and intrigue.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has seen women entering the workforce, while societal pressures and Cold War anxieties complicate personal relationships and loyalties."
  },
  "setting": {
    "location": "A grand seaside hotel on a cliffside overlooking the ocean",
    "institution": "hotel",
    "weather": "overcast with occasional rain, typical of coastal climates"
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
    "id": "button_found",
    "value": "one",
    "description": "A missing button from the hotel employee's uniform found at the crime scene."
  },
  {
    "id": "witness_count",
    "value": "three",
    "description": "Three witnesses recall seeing the murderer at the ball."
  },
  {
    "id": "costume_matching",
    "value": "the same",
    "description": "The costume matches the description of a character seen at the event."
  },
  {
    "id": "ball_time",
    "value": "half past eight at night",
    "description": "The masquerade ball started at half past eight at night, coinciding with the time of the murder."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 16,
  "countsByPlacement": {
    "early": 8,
    "mid": 7,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 15,
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
      "category": "temporal"
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
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_fp_elimination_hugo_vane",
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
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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

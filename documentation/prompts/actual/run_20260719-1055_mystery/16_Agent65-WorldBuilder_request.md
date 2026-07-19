# Actual Prompt Record

- Run ID: `mystery-1784458527442`
- Project ID: ``
- Timestamp: `2026-07-19T10:58:27.233Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `7a6be63b3b80873a`

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
    "title": "The Clockwork Deception",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "seaside hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Investigative journalist",
      "private_secret": "Has a personal vendetta against the hotel owner",
      "motive_seed": "Desire for justice",
      "motive_strength": "strong",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all hotel areas"
      ],
      "behavioral_tells": [],
      "stakes": "Finding the truth",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Local physician",
      "private_secret": "Had a romantic interest in Sylvia",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Visited Sylvia before dinner"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation as a physician",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Retired naval officer",
      "private_secret": "Involved in a dispute over property with Sylvia",
      "motive_seed": "Financial gain",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to guest rooms"
      ],
      "behavioral_tells": [],
      "stakes": "Avoiding financial ruin",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "Hotel manager",
      "private_secret": "Hides a past connection to Hugo",
      "motive_seed": "Protecting the hotel reputation",
      "motive_strength": "strong",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Main access to hotel systems"
      ],
      "behavioral_tells": [],
      "stakes": "Job security",
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
      "public_persona": "Socialite",
      "private_secret": "Had secrets that could ruin others",
      "motive_seed": "None",
      "motive_strength": "none",
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
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Private investigator",
      "private_secret": "Has a history with the victim",
      "motive_seed": "Desire for closure",
      "motive_strength": "strong",
      "alibi_window": "8:00 PM - 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Investigative access to all hotel areas"
      ],
      "behavioral_tells": [],
      "stakes": "Solving the case",
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
      "summary": "In the overcast atmosphere of a seaside hotel, Sylvia Trent is found strangled just before dinner. As the clock suggests a time of death that misleads the guests, Hugo Vane, the detective, must unravel a web of jealousy and deceit among the staff."
    },
    "accepted_facts": [
      "Sylvia was last seen alive at dinner preparations.",
      "The clock in her room shows a different time than the other clocks."
    ],
    "inferred_conclusions": [
      "The time of death was manipulated to mislead investigators."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, 8, and 30 to expose the false timing.",
      "delivery_path": [
        {
          "step": "The clock was tampered with to show a time before the actual murder."
        }
      ]
    },
    "outcome": {
      "result": "The time of death appears to be misrepresented."
    }
  },
  "false_assumption": {
    "statement": "Sylvia died shortly before dinner as indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses believed the clock time and the timing of dinner",
    "what_it_hides": "The actual time of death was earlier due to clock tampering."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Captain Hale had a motive due to financial disputes with Sylvia.",
      "Witnesses saw him near the victim's room shortly before dinner."
    ],
    "the_one_flaw": "His alibi of being seen in the dining area contradicts the timeline established by the clock.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses claim to have heard a loud argument between Dr. Finch and Sylvia just before dinner.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The argument was a misunderstanding; they were discussing medical advice.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A broken vase is found in the dining area, which suggests a struggle.",
      "points_at_suspect": "Eleanor Voss",
      "innocent_explanation": "The vase broke during dinner preparations unrelated to the murder.",
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
    "rationale": "All suspects were either staff or guests at the hotel, with no outsiders involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner was scheduled for 9:00 PM",
        "The clock in the victim's room was set to 8:30 PM"
      ],
      "windows": [
        "Victim was last seen at 8:00 PM",
        "Dinner preparations began at 8:30 PM"
      ],
      "contradictions": [
        "Clock shows 8:30 PM, but witnesses recall seeing the victim alive at 8:00 PM."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "Victim's clock",
        "Dining room"
      ],
      "permissions": [
        "Staff had access to the victim's room"
      ]
    },
    "physical": {
      "laws": [
        "Physical manipulation of timepieces is possible"
      ],
      "traces": [
        "No direct evidence of struggle was found in the victim's room."
      ]
    },
    "social": {
      "trust_channels": [
        "Staff members trust each other regarding alibis"
      ],
      "authority_sources": [
        "The hotel management's word was taken as truth."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in Sylvia's room shows a time of 8:30 PM.",
        "correction": "This indicates that the time of death could have been manipulated.",
        "effect": "Narrows timeline window for suspects.",
        "required_evidence": [
          "The clock in Sylvia's room shows a time of 8:30 PM.",
          "Witnesses claim dinner preparations began at 8:30 PM."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Finch claims he was treating a patient at 8:00 PM.",
        "correction": "This alibi does not hold with the clock's time.",
        "effect": "Eliminates Dr. Finch as a plausible alibi.",
        "required_evidence": [
          "Dr. Finch's alibi states he was with a patient at 8:00 PM.",
          "The clock shows a different time."
        ],
        "reader_observable": true
      },
      {
        "observation": "A scuff mark is found on the floor near the clock.",
        "correction": "This suggests the clock was recently moved.",
        "effect": "Narrows opportunity for access to the victim's room.",
        "required_evidence": [
          "Scuff marks are present on the floor near the clock.",
          "Witnesses state the clock was not there earlier."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, 8, and 30 against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, 8, and 30.",
    "pass_condition": "If Dr. Finch's clock does not match the others, it proves he tampered with Sylvia's clock.",
    "evidence_clues": [
      "clue_culprit_direct_1",
      "clue_12",
      "clue_5",
      "clue_culprit_direct_dr_mallory_finch"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock time (8:30 PM) and preparation claims (8:30 PM) set a false timeline. Step 2: Dr. Finch's alibi contradicts this timeline. Step 3: Scuff marks indicate tampering, revealing access to the victim's clock."
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
        "clearance_method": "Proves he was in the dining area at the time of death.",
        "supporting_clues": [
          "Witness statements",
          "Dining schedule"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her access permissions allowed her to be in the dining area.",
        "supporting_clues": [
          "Access records",
          "Alibi statements"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
        "delivery_method": "Test execution"
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
    "summary": "Eleanor Voss is a charming social climber, expertly navigating high society while concealing her financial struggles.",
    "publicPersona": "With a smile that could light up the dimmest of rooms, Eleanor exudes sophistication and charm. She glides through the upper echelons of society, expertly weaving connections that would make even the most seasoned socialites envious.",
    "privateSecret": "Behind her polished façade lies a woman drowning in debt, desperately clinging to the trappings of wealth to maintain her status.",
    "motiveSeed": "Eleanor's desperation intensifies as she faces the potential loss of a lucrative design contract that the victim threatened to take away.",
    "motiveStrength": "strong",
    "alibiWindow": "She was seen in the dining area from 7:30 to 8:00 PM, yet her whereabouts after that remain unaccounted for.",
    "accessPlausibility": "possible",
    "stakes": "The stakes are high for Eleanor; her career and reputation hinge on securing this contract, pushing her to the brink.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with an airy confidence, often using grandiose expressions and charming quips that disarm her audience. She has a tendency to dismiss uncomfortable topics with a laugh, deflecting deeper inquiries.",
    "signatureTic": "‘Oh, darling, let’s not dwell on the unpleasant!’",
    "internalConflict": "Eleanor grapples with the fear that her carefully curated life is built on fragile foundations, and the truth of her financial instability could unravel everything.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as it could either solidify her standing in society or expose her vulnerabilities, leading to her downfall.",
    "paragraphs": [
      "Eleanor Voss stood in front of the mirror, adjusting her pearls with a practiced hand. The reflection staring back at her was one of elegance and poise, yet beneath the surface, a tempest brewed. The lavish lifestyle she flaunted was a delicate facade, masking the financial turmoil that threatened to engulf her. Every connection she made was not just for social gain but a desperate reach for stability in a world that valued appearance above all else.",
      "As she floated through the dining area, exchanging pleasantries with the elite, Eleanor felt the weight of her secret pressing down. The victim's presence loomed over her like a dark cloud, threatening to snatch away the lucrative contract she had been courting for months. 'What would they think of me if they knew?' she mused, her heart racing at the thought of scandal. It was a precarious game she played, balancing on the edge of respectability while desperately trying to keep her debts at bay.",
      "In the dim light of the hotel, Eleanor's laughter rang out, a beautiful sound that masked her inner turmoil. 'Oh, darling, let’s not dwell on the unpleasant!' she would say, brushing aside probing questions with a wave of her hand, her smile unwavering. Yet, in the silence of her thoughts, she knew that one misstep could shatter her carefully constructed reality. The victim’s threat to her contract felt like a noose tightening around her neck, and she was prepared to do anything to loosen it.",
      "When the clock struck eight, Eleanor found herself unmoored, a witness to her own unraveling. She had been seen in the dining area, but what lay beyond those moments was a blank slate of possibility. Her alibi was thin, and as she contemplated the looming shadows of suspicion, she realized that her survival depended on more than just charm; it relied on cunning and perhaps, just perhaps, a willingness to cross a line she had sworn never to approach."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated physician with a fierce ambition, battling the ghosts of a bitter rivalry in her quest for professional advancement.",
    "publicPersona": "Admired by patients and colleagues alike, Dr. Finch presents herself as the epitome of compassion and dedication, a trusted figure in the community.",
    "privateSecret": "Beneath her polished exterior lies a simmering resentment towards the victim, whose influence threatens to derail her ambitions for a coveted hospital position.",
    "motiveSeed": "Dr. Finch fears that the victim's proximity to power could jeopardize her chances at a promotion she desperately desires.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claimed to be in her office until 9 PM, yet her office was found empty upon inspection.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Dr. Finch are high; her career advancement in a fiercely competitive environment hangs in the balance.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a measured tone, her words carefully chosen, often laced with dry humor that emerges when she feels particularly tense. She has a habit of pausing to collect her thoughts, which gives her an air of deliberation.",
    "signatureTic": "‘In my experience…’",
    "internalConflict": "Dr. Finch wrestles with her ambition, torn between her desire for success and the ethics of her profession, questioning whether the ends justify the means.",
    "personalStakeInCase": "This crime matters to Dr. Finch not just for her career but because it forces her to confront the darker aspects of her ambition that she has long suppressed.",
    "paragraphs": [
      "Dr. Mallory Finch adjusted her glasses, the weight of her ambition pressing heavily upon her shoulders. In the pristine confines of her office, she had cultivated an image of unwavering dedication, yet outside those walls, a storm brewed. The victim had become a formidable obstacle in her path, a constant reminder of the bitter rivalry that had festered between them over the years. 'In my experience…,' she often began, but now the words felt hollow, devoid of the conviction they once held.",
      "As whispers of the victim's influence reached her ears, Dr. Finch felt the familiar sting of jealousy. The promotion she had long coveted now seemed as elusive as a mirage, taunting her with its proximity. She had spent years building her reputation, yet here she was, overshadowed by someone whose methods she disdained. The thought of her rival's power over her future ignited a fire within her, one that threatened to consume her integrity.",
      "That fateful evening, she had claimed to be in her office, but the emptiness left behind spoke volumes. The ticking clock echoed in the silence, a reminder that time was running out for her ambitions. As she paced the room, her mind raced with possibilities—what if the victim's influence could be extinguished? Would that clear the path for her to finally step into the spotlight she so desperately craved? The moral implications swirled in her mind, but ambition has a way of dulling the conscience.",
      "When the news of the murder broke, Dr. Finch felt an unsettling mixture of dread and relief. The stakes had never been higher, and as she navigated the treacherous waters of suspicion, she found herself questioning everything she believed in. Would she sacrifice her ethics on the altar of ambition? Or could she find a way to reconcile her desire for success with the principles that once guided her?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a grizzled war hero, grappling with fading glory and the shadows of resentment cast by a powerful community figure.",
    "publicPersona": "With a reputation for strict discipline and a commanding presence, Captain Hale is a respected figure among veterans and townsfolk alike.",
    "privateSecret": "Underneath his stoic exterior lies a deep resentment towards the victim, who he believes undermined his efforts to support veterans in the community.",
    "motiveSeed": "His belief that the victim was sabotaging his initiatives fuels a growing anger that threatens to boil over.",
    "motiveStrength": "moderate",
    "alibiWindow": "Reportedly on the porch from 8:00 to 8:30 PM, yet there are no witnesses to confirm his whereabouts.",
    "accessPlausibility": "easy",
    "stakes": "For Captain Hale, the stakes are not just personal; they involve the reputation he has built and the support of his fellow veterans.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a gravelly voice, his words clipped and to the point. He often punctuates his sentences with a stern look, as if daring anyone to challenge him. His humor, when it surfaces, is dry and often laced with bitterness.",
    "signatureTic": "‘In my day…’",
    "internalConflict": "Captain Hale struggles with the duality of his past heroism and the bitterness that has taken root, questioning whether he can still be a force for good.",
    "personalStakeInCase": "This crime matters to Captain Hale because it strikes at the heart of his legacy, forcing him to confront his failures and the impact they have on those he fought to protect.",
    "paragraphs": [
      "Captain Ivor Hale stood on the porch, the cool sea breeze ruffling his graying hair as he stared into the distance. The weight of his past hung heavy upon him, a mix of pride and regret that he wore like a badge. A war hero, once revered, now found himself grappling with the fading echoes of glory. 'In my day…,' he often reminisced, but those days felt like a distant memory, overshadowed by the victim's looming presence in his community.",
      "To Hale, the victim was more than just a rival; she represented everything that had undermined his efforts to support veterans in town. Her influence felt like a noose tightening around his initiatives, and with each passing day, his resentment festered. The thought of her sabotaging his work ignited a smoldering anger within him, one that he could barely contain. He wanted to confront her, to demand respect for the sacrifices he had made, yet the shadows of doubt whispered that his efforts might be in vain.",
      "When the clock struck eight, Hale found himself alone, a solitary figure on the porch with nothing but the sea's roar for company. He had reported being there, but as the hours slipped by, he felt the weight of uncertainty creeping in. The absence of witnesses gnawed at him, and he could almost hear the whispers of suspicion echoing through the night. What if this was his moment to reclaim his legacy, to confront the truth behind the victim's influence?",
      "As the news of the murder spread, Captain Hale felt a tumultuous mix of grief and anger. The stakes had never been higher; his reputation was on the line, and the support of his fellow veterans hung in the balance. This crime was more than a mere murder; it was a reckoning, forcing him to confront not only the darkness in others but the shadows within himself. Could he rise above the bitterness and redefine his role in the community, or would he be consumed by the very anger he sought to conquer?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious young journalist, eager to make her mark while navigating the murky waters of ethics and ambition.",
    "publicPersona": "With a sharp wit and keen insight, Beatrice is a rising star in journalism, known for her tenacity and determination.",
    "privateSecret": "Beneath her ambition lies a desire to expose the victim’s shady dealings, a story she believes could catapult her career.",
    "motiveSeed": "She yearns to publish a scandalous piece that would ruin the victim's reputation and boost her standing in the field.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims to have been in her room writing from 7:00 PM onwards, but the truth remains clouded.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, her future in journalism hinges on a big story that could either make her or break her.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a lively cadence, her words flowing quickly as she often interjects humor into serious discussions. She has a penchant for sarcasm, which she uses to mask her insecurities and ambitions.",
    "signatureTic": "‘Let’s get to the juicy bits!’",
    "internalConflict": "Beatrice battles with the ethical implications of her ambitions, torn between her desire for success and the morality of her methods.",
    "personalStakeInCase": "This crime matters to Beatrice because it challenges her to confront the consequences of her ambition and the ethical compromises she is willing to make for success.",
    "paragraphs": [
      "Beatrice Quill sat at her desk, the typewriter clacking rhythmically as she poured her thoughts onto the page. A rising star in the world of journalism, she was driven by a burning ambition that often overshadowed her moral compass. 'Let’s get to the juicy bits!' she would declare, her enthusiasm infectious, yet beneath the surface lay a deep-seated desire to expose the victim’s shady dealings, a story that could propel her career to dizzying heights.",
      "As she navigated the hotel's opulent halls, Beatrice couldn't shake the feeling that the victim's influence was a roadblock in her path. The idea of publishing a scandalous piece that would ruin the victim's reputation thrilled her, igniting a fire within. Yet, the ethical implications of her ambitions loomed like a specter, whispering doubts that threatened to derail her aspirations. She often found herself torn between the pursuit of truth and the allure of sensationalism.",
      "That evening, she claimed to be in her room writing, but the truth was more elusive than the ink that flowed from her typewriter. The clock ticked away, counting down the minutes as she pondered her next move. The shadows of suspicion danced around her, and she knew that if she could just uncover the right details, she could turn the tide in her favor. The stakes were personal; her future in journalism depended on the next big story, and she was determined to seize the opportunity.",
      "When the news of the murder broke, Beatrice felt a mix of excitement and dread. This was the moment she had been waiting for, yet it also forced her to confront the darker side of her ambition. Could she rise above the temptation to exploit tragedy for her gain? Or would she find herself ensnared in a web of her own making, trapped by the very journalism she sought to elevate? The clock was ticking, and Beatrice knew she had to decide what kind of journalist she truly wanted to be."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a flamboyant art dealer, embodies the life of luxury while concealing the precariousness of her financial situation.",
    "publicPersona": "Known for her extravagant parties and lavish lifestyle, Sylvia is a captivating figure in the art world, drawing admirers and critics alike.",
    "privateSecret": "Beneath her vibrant exterior lies the truth of an embezzlement scheme that threatens her gallery's future.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "possible",
    "stakes": "For Sylvia, her business and financial stability are at risk, adding pressure to an already tumultuous life.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Sylvia speaks with a theatrical flair, her words flowing like a performance. She gestures widely, drawing her audience into her narrative, yet there’s an underlying tension in her voice that hints at her hidden struggles.",
    "signatureTic": "‘Art is life, darling!’",
    "internalConflict": "Sylvia grapples with the fear that her glamorous lifestyle is a façade, one that could crumble at any moment, exposing her vulnerabilities.",
    "personalStakeInCase": "This crime matters to Sylvia as it threatens not only her life’s work but the very image she has built, forcing her to confront the reality of her situation.",
    "paragraphs": [
      "Sylvia Trent twirled through the gallery, her vibrant dress swirling around her like a burst of color in a monochrome world. 'Art is life, darling!' she proclaimed, her voice a melodic blend of enthusiasm and desperation. To the outside world, she was the embodiment of glamour and success, hosting extravagant parties that left guests breathless. Yet behind the curtain of her lavish lifestyle lay a precarious truth, one that threatened to unravel her carefully constructed world.",
      "The whispers of embezzlement circled like vultures, and Sylvia felt their sharp claws digging into her psyche. Her gallery, once a beacon of creativity, now felt like a sinking ship, and the victim’s influence loomed large over her operations. The stakes were high; her business and financial stability hung in the balance, and the fear of losing everything kept her awake at night. The vibrant colors of her art masked the shadows that encroached upon her life.",
      "In the midst of her flamboyant parties, Sylvia felt the tension simmering beneath the surface. Each laugh, each toast, felt like a fragile bubble, ready to burst at any moment. The victim was a constant reminder of her precarious position, and the thought of being exposed filled her with dread. What if the truth came to light? What if her world of glamour crumbled, leaving her vulnerable and exposed?",
      "When the news of the murder broke, Sylvia’s heart raced with a mix of fear and relief. The crime threatened to upend everything she had built, but it also offered a twisted opportunity to bury her own secrets in the chaos. For Sylvia, this was more than just a crime; it was a reckoning, a moment that would force her to confront the reality of her life and the choices she had made."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a charming entrepreneur, adept at negotiation but haunted by a history of betrayal in his business dealings.",
    "publicPersona": "With a smooth demeanor and clever wit, Hugo is a charismatic figure known for his ability to charm and influence others.",
    "privateSecret": "Beneath his charming exterior lies a history of backstabbing business partners to climb the social ladder.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "possible",
    "stakes": "N/A",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with an engaging rhythm, often using anecdotes and observations to connect with his audience. He has a penchant for playful banter, making even serious subjects feel lighthearted.",
    "signatureTic": "‘You see, it’s all about the angle!’",
    "internalConflict": "Hugo struggles with the consequences of his past betrayals, questioning whether his charm can truly mask the shadows of his ambition.",
    "personalStakeInCase": "This crime matters to Hugo as it forces him to confront the darker aspects of his character and the relationships he has manipulated.",
    "paragraphs": [
      "Hugo Vane leaned against the bar, a glass of whiskey in hand, exuding an effortless charm that drew people in like moths to a flame. 'You see, it’s all about the angle!' he would often quip, flashing a disarming smile that belied the history of backstabbing that lay beneath his polished exterior. He was a master of negotiation, navigating the treacherous waters of business with a deftness that left others in awe, yet the shadows of his past lingered, whispering doubts into his ear.",
      "As he mingled with the guests at the hotel, Hugo felt the familiar thrill of connection, yet an unease simmered beneath the surface. The victim's murder had thrown the social landscape into chaos, and he found himself questioning whether his charm could shield him from the scrutiny that followed. Each smile felt like a mask, hiding the betrayals that had brought him to this point. What if his past caught up with him? What if the very people he had manipulated turned against him?",
      "In conversations, Hugo’s playful banter often masked a deeper unease. He had built a reputation on charm and wit, yet the fear of exposure haunted him. As the clock ticked on, he found himself drawn into the investigation, both intrigued and terrified by the potential fallout. The stakes were unclear, but the implications were real; he had to confront the consequences of his past manipulations or risk losing everything he had built.",
      "When the news broke, Hugo felt a mix of excitement and dread. This was an opportunity to redefine his narrative, yet it also forced him to reckon with the darker aspects of his character. As he navigated the complexities of the case, he realized that the detective's role was not just about unraveling the truth but also about confronting the shadows of their own ambitions. For Hugo, this crime was more than just a mystery; it was a chance for redemption, if he could find the courage to face the truth."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Cliffside Hotel",
    "type": "seaside hotel",
    "place": "St. Ives",
    "country": "England",
    "summary": "A sprawling seaside hotel perched on a cliff, offering stunning ocean views and a touch of post-war mystery.",
    "visualDescription": "The hotel boasts a blend of Art Deco and Colonial architecture, with large windows framing the restless sea, a wraparound porch lined with wicker chairs, and weathered shingles that speak of many storms weathered.",
    "atmosphere": "Tension hangs in the air, mingled with the salty tang of the ocean and the whispers of secrets held within the hotel’s walls.",
    "paragraphs": [
      "The Cliffside Hotel stands resolute against the crashing waves, its facade a marriage of Art Deco elegance and Colonial charm. Guests often linger on the wraparound porch, sipping tea as they gaze out at the turbulent sea. However, beneath the picturesque surface lies a palpable tension, a sense of something amiss. The overcast sky looms overhead, casting a shadow over the hotel's bright facade, hinting at the secrets buried within its walls.",
      "Inside, the lobby exudes an air of faded grandeur, with its marble floors and ornate chandeliers. The scent of damp wood mingles with the briny ocean air, while the soft murmur of conversations and the distant sound of a crackling radio create an uneasy backdrop. As guests navigate the narrow hallways, their footsteps echo ominously, amplifying the feeling of isolation that the hotel’s cliffside location imposes.",
      "Each guest room offers a fleeting escape, but the sound of the sea crashing against the rocks below serves as a constant reminder of the hotel’s precarious position. Shadows dance in the corners, and the distant tick of a wall clock marks the passage of time, each tick a reminder of the secrets that unravel as the clockwork of deception ticks on.",
      "As evening descends, the hotel transforms. Candlelight flickers in the dining area, casting long shadows across the tablecloths. The clink of silverware and the soft laughter of guests fill the air, but the tension remains, thick and palpable. Outside, the mist rolls in from the sea, enveloping the hotel in a shroud of secrecy, as if the very atmosphere conspires to protect the mysteries hidden within."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional mist from the sea",
    "timeFlow": "Days of mounting tension leading to a fateful evening",
    "mood": "tense and mysterious, with an undercurrent of post-war anxiety",
    "eraMarkers": [
      "radio broadcasting in the lobby",
      "rationed fuel for transportation",
      "early television sets in guest rooms"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air mixed with damp wood",
      "secondary": [
        "flickering candlelight shadows",
        "clinking silverware and hushed conversations"
      ]
    },
    "paragraphs": [
      "The atmosphere of The Cliffside Hotel is thick with the scent of salt and damp wood, a reminder of its precarious perch on the cliffs of St. Ives. The low hum of a radio broadcasts a distant news report, the voices blending with the sound of waves crashing against the rocks below. Shadows flicker on the walls, cast by the flickering candlelight that struggles against the encroaching darkness, creating an ambiance of unease that permeates the air.",
      "As guests navigate the narrow hallways, the muted sound of footsteps echoes ominously, heightening the sense of isolation that the hotel’s cliffside location imposes. The distant ticking of a clock serves as a reminder of time slipping away, while the occasional clink of silverware and the low murmur of conversations create a delicate balance between normalcy and tension, hinting at the secrets that lie beneath the surface."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Main Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Marble floors and ornate chandeliers; large windows with ocean views",
      "sensoryDetails": {
        "sights": [
          "ornate chandeliers shimmering",
          "large windows framing the sea"
        ],
        "sounds": [
          "soft murmurs of conversation",
          "crackling radio broadcasts"
        ],
        "smells": [
          "damp wood and varnish",
          "salt from the sea breeze"
        ],
        "tactile": [
          "cool marble underfoot",
          "worn leather armchairs"
        ]
      },
      "accessControl": "Open to all guests, monitored by the front desk staff",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-drenched windows",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft whispers of guests"
          ],
          "smells": [
            "fresh rain on pavement",
            "wet stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "shadows flickering on walls"
          ],
          "sounds": [
            "the ticking of a grandfather clock",
            "the rustle of newspaper pages"
          ],
          "smells": [
            "old paper and ink",
            "dusty wood"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off polished surfaces",
            "guests gathered in quiet conversation"
          ],
          "sounds": [
            "clinking of glasses",
            "the laughter of guests"
          ],
          "smells": [
            "candle wax",
            "freshly brewed coffee"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The main lobby of The Cliffside Hotel is a grand space that welcomes guests with its marble floors and ornate chandeliers. Large windows overlook the tumultuous sea, allowing the salty air to drift in. The soft hum of a radio in the corner fills the space with distant news, while guests gather in worn leather armchairs, exchanging hushed conversations that seem to carry an unspoken tension. The scent of damp wood and varnish lingers, a reminder of the hotel’s long history.",
        "As the day progresses, the atmosphere shifts. Morning rain casts a grey pall over the lobby, the sound of droplets racing down the glass mingling with the soft whispers of guests. The air grows heavy with the scent of wet stone, and the ticking of a grandfather clock becomes a reminder of time slipping away. Shadows flicker across the walls, hinting at the secrets that the hotel holds within its walls."
      ]
    },
    {
      "id": "dining_area",
      "name": "Dining Area",
      "type": "interior",
      "purpose": "Meal gatherings, clue discovery",
      "visualDetails": "Elegant tables set with white linens, candlelight flickering",
      "sensoryDetails": {
        "sights": [
          "elegantly set tables",
          "candlelight dancing on glassware"
        ],
        "sounds": [
          "soft clinking of cutlery",
          "murmurs of conversation"
        ],
        "smells": [
          "roasted meats and fresh bread",
          "rich red wine"
        ],
        "tactile": [
          "smooth tablecloths",
          "warmth from candle flames"
        ]
      },
      "accessControl": "Open during meal times for all guests, staff only during preparation",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "cloudy skies through windows",
            "water droplets on glass"
          ],
          "sounds": [
            "steady patter of rain",
            "soft laughter of early risers"
          ],
          "smells": [
            "freshly brewed coffee",
            "warm pastries"
          ],
          "mood": "cozy yet melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "shadows playing on the walls"
          ],
          "sounds": [
            "quiet murmurs of guests",
            "the rustle of napkins"
          ],
          "smells": [
            "roasted vegetables",
            "herbs and spices"
          ],
          "mood": "somber yet intimate"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight illuminating faces",
            "guests laughing and toasting"
          ],
          "sounds": [
            "clinking of glasses",
            "the hum of conversation"
          ],
          "smells": [
            "grilled meats",
            "sweet desserts"
          ],
          "mood": "festive yet tense"
        }
      ],
      "paragraphs": [
        "The dining area of The Cliffside Hotel is a place of elegance and anticipation, with tables adorned in crisp white linens and flickering candlelight casting a warm glow. The scent of roasted meats and fresh bread wafts through the air, mingling with the rich aroma of red wine being poured. Guests gather around tables, their laughter and soft clinking of cutlery creating a symphony of sounds that mask the underlying tension that permeates the atmosphere.",
        "As morning rain falls, the dining area takes on a cozy yet melancholic mood. The cloudy skies filter through the windows, casting a muted light over the elegant setup. The soft patter of rain outside contrasts with the warmth inside, where the scent of freshly brewed coffee and warm pastries fills the air. Conversations flow, but there’s an undercurrent of unease that seems to linger just beneath the surface, hinting at the secrets yet to be uncovered."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "Guest Rooms",
      "type": "interior",
      "purpose": "Resting spaces, clue discovery",
      "visualDetails": "Cozy, well-furnished rooms with ocean views and heavy drapes",
      "sensoryDetails": {
        "sights": [
          "heavy drapes framing large windows",
          "decorative seashell motifs"
        ],
        "sounds": [
          "distant waves crashing",
          "the creak of floorboards"
        ],
        "smells": [
          "fresh linen and lavender",
          "salt and dampness"
        ],
        "tactile": [
          "soft bedding underfoot",
          "chill air from the window"
        ]
      },
      "accessControl": "Access limited to guests and housekeeping staff; privacy respected",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through drapes",
            "water droplets on window panes"
          ],
          "sounds": [
            "steady rainfall",
            "soft rustling of sheets"
          ],
          "smells": [
            "wet earth outside",
            "scent of damp wood"
          ],
          "mood": "isolated and reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "ocean mist creeping in"
          ],
          "sounds": [
            "the murmur of distant conversations",
            "the rustle of fabric"
          ],
          "smells": [
            "dusty furniture",
            "faint scent of mildew"
          ],
          "mood": "oppressive and heavy"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset reflecting off the ocean",
            "shadows lengthening across the room"
          ],
          "sounds": [
            "the distant sound of laughter",
            "the soft ticking of a clock"
          ],
          "smells": [
            "freshly polished wood",
            "candle wax"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The guest rooms at The Cliffside Hotel provide a cozy retreat, each adorned with heavy drapes that frame large windows overlooking the tumultuous ocean. The scent of fresh linen and lavender fills the air, while the soft sound of waves crashing against the cliffs creates a calming backdrop. However, the creak of floorboards hints at the secrets that may linger just beyond the door, and the chill air from the window reminds guests of the isolation of their cliffside haven.",
        "As morning rain falls, the rooms take on a reflective mood, with grey light filtering through the drapes. The steady sound of rainfall creates a serene atmosphere, but the scent of wet earth and damp wood serves as a reminder of the outside world. Guests may find themselves lost in thought, contemplating the mysteries that the hotel holds within its walls, isolated from the bustle of life beyond."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "Rooftop Terrace",
      "type": "exterior",
      "purpose": "Restricted access, potential clue discovery",
      "visualDetails": "Open terrace with a railing overlooking the cliffs and ocean",
      "sensoryDetails": {
        "sights": [
          "vast ocean stretching to the horizon",
          "seagulls soaring overhead"
        ],
        "sounds": [
          "ocean waves crashing",
          "wind rustling through leaves"
        ],
        "smells": [
          "salt and sea spray",
          "fresh air"
        ],
        "tactile": [
          "rough railing underhand",
          "cool breeze against skin"
        ]
      },
      "accessControl": "Staff only; guests require permission for entry",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "clouds hanging low over the ocean",
            "puddles forming on the terrace"
          ],
          "sounds": [
            "soft patter of rain",
            "distant thunder"
          ],
          "smells": [
            "wet sea air",
            "fresh rain"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey clouds looming",
            "dim light over the ocean"
          ],
          "sounds": [
            "the distant roar of waves",
            "wind howling past"
          ],
          "smells": [
            "salt and dampness",
            "fresh seaweed"
          ],
          "mood": "chilling"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the sky in hues",
            "stars beginning to twinkle"
          ],
          "sounds": [
            "gentle waves lapping",
            "the distant sound of laughter"
          ],
          "smells": [
            "freshly opened air",
            "the scent of night blooming flowers"
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The rooftop terrace of The Cliffside Hotel offers breathtaking views of the ocean, a vast expanse stretching to the horizon. Seagulls soar overhead, their cries mingling with the sound of waves crashing against the cliffs below. The rough railing feels solid underhand, but the cool breeze that sweeps across the terrace carries whispers of secrets untold. This open space, however, is restricted; only staff are permitted to tread here, adding an air of mystery to its allure.",
        "In the morning rain, the terrace transforms into a foreboding space. Clouds hang low over the ocean, and puddles form on the terrace, reflecting the grey sky above. The soft patter of rain creates a haunting melody, while the scent of wet sea air fills the lungs. As guests gaze out at the turbulent waters, they may feel the weight of the hotel’s secrets pressing down upon them, urging them to uncover what lies hidden."
      ]
    }
  ],
  "note": "",
  "cost": 0.0021544248,
  "durationMs": 21892
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1947,
    "month": "November",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "November",
    "weather": [
      "overcast with occasional mist from the sea",
      "chill in the air",
      "intermittent light rain"
    ],
    "daylight": "Short days with twilight settling in around four o'clock in the afternoon, leading to long, dark evenings.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel guests settle in for the night.",
    "holidays": [
      "Thanksgiving (Fourth Thursday of November)"
    ],
    "seasonalActivities": [
      "Strolling along the beach to gather sea shells",
      "Attending a local dance at the community hall",
      "Preparing for Thanksgiving feasts with seasonal decorations"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece suits with wide lapels",
        "fedoras in dark wool or felt",
        "double-breasted overcoats"
      ],
      "casual": [
        "tweed jackets with elbow patches",
        "corduroy trousers",
        "crew-neck sweaters"
      ],
      "accessories": [
        "leather gloves",
        "silk ties with geometric patterns",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with cinched waists",
        "tailored wool coats",
        "beret hats"
      ],
      "casual": [
        "knit cardigans over blouses",
        "pencil skirts",
        "wide-leg trousers"
      ],
      "accessories": [
        "string of pearls",
        "colorful silk scarves",
        "handbags with clasp closures"
      ]
    },
    "trendsOfTheMoment": [
      "New Look silhouette introduced by Dior",
      "popularity of bright colors and floral prints",
      "influence of wartime utility style still evident"
    ],
    "socialExpectations": [
      "men expected to dress formally for evening events",
      "women encouraged to embrace femininity in their style",
      "post-war decorum emphasizes modesty and elegance"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The beginning of the Cold War tensions as the Iron Curtain falls across Europe",
      "The United Nations is actively engaged in addressing post-war reconstruction",
      "Debates on the Marshall Plan's efficacy continue in Congress"
    ],
    "politicalClimate": "Political instability is evident, with rising tensions between the Soviet Union and Western powers, leading to public anxiety.",
    "economicConditions": "While the economy is recovering, inflation is a concern, and rationing is still in effect for certain goods.",
    "socialIssues": [
      "Struggles for civil rights are beginning to surface",
      "Debate over women's roles in the workforce remains contentious",
      "Veterans are facing challenges reintegrating into civilian life"
    ],
    "internationalNews": [
      "The establishment of the State of Israel is on the horizon",
      "Continued unrest in Palestine as tensions rise",
      "The Nuremberg Trials are concluding, affecting global views on justice and war crimes"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Nearness of You' by Hoagy Carmichael",
        "'I Don't Want to Set the World on Fire' by The Ink Spots",
        "'My Blue Heaven' by Gene Austin"
      ],
      "films": [
        "'Gentleman's Agreement'",
        "'The Best Years of Our Lives'",
        "'Miracle on 34th Street'"
      ],
      "theater": [
        "'A Streetcar Named Desire'",
        "'The Glass Menagerie'",
        "'Death of a Salesman'"
      ],
      "radio": [
        "'Suspense' - a thrilling mystery series",
        "'The Jack Benny Program' - popular comedy show",
        "'Your Hit Parade' - music countdown program"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'The Naked and the Dead' by Norman Mailer",
        "'The Bell Jar' by Sylvia Plath"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "post-war social commentary",
        "psychological thrillers"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial jet airliner - the de Havilland Comet is in development",
        "advancements in radar technology",
        "the rise of television as a household medium"
      ],
      "commonDevices": [
        "manual typewriters",
        "early television sets",
        "vacuum tube radios"
      ],
      "emergingTrends": [
        "Increased popularity of television shows",
        "Growth of the consumer economy",
        "Expansion of the automobile industry"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Bottle of milk: three pence"
      ],
      "commonActivities": [
        "Attending community events at local halls",
        "Engaging in volunteer work for veterans",
        "Visiting the seaside for fresh air"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "Thanksgiving preparations and gatherings",
        "Evening strolls along the pier"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Emerging middle class is asserting its influence",
      "Class distinctions are still pronounced, yet beginning to blur post-war"
    ],
    "gender": [
      "Increased acceptance of women in the workforce",
      "Traditional gender roles are challenged, yet remain influential",
      "Post-war anxieties fuel debates on women's rights"
    ],
    "race": [
      "Racial segregation remains a contentious issue",
      "Emerging civil rights movements are beginning to gain traction"
    ],
    "generalNorms": [
      "Increased focus on family values",
      "Community engagement is encouraged",
      "Politeness and decorum are highly valued in public settings"
    ]
  },
  "atmosphericDetails": [
    "The salty breeze carries the scent of the sea, mingled with the earthy aroma of damp leaves.",
    "The sound of crashing waves contrasts with the distant murmur of hotel guests, creating an air of suspense.",
    "Flickering shadows from the gas lamps illuminate the hotel's grand lobby, enhancing the mystery of the evening."
  ],
  "paragraphs": [
    "In November 1947, the seaside hotel stands cloaked in an overcast sky, with the mist rolling in from the ocean adding an air of mystery. The chill in the air hints at the encroaching winter, while the twilight settles in early, casting long shadows across the lobby filled with guests sharing hushed conversations. The recent memories of the war linger like ghosts, creating an ambiance thick with unspoken anxiety and hope. As Thanksgiving approaches, the hotel's staff prepares for a flurry of holiday activity, but beneath the surface, secrets simmer, waiting to be uncovered.",
    "Fashion of the time reflects a blend of post-war pragmatism and the elegance of the New Look. Men don three-piece suits with wide lapels, while women grace the dining area in tea-length dresses cinched at the waist, accented by pearls and stylish hats. The community dances and evening gatherings bring a splash of color to the otherwise muted tones of the season, as bright florals and geometric patterns dominate the attire. The atmosphere is one of cautious optimism, where the elegance of evening wear is juxtaposed with the somber realities of a society still grappling with the fallout of war.",
    "Daily life is marked by a juxtaposition of routine and uncertainty. Guests at the hotel partake in typical activities such as evening strolls by the sea or participating in local dances, while the hum of radio programs fills the air with entertainment and news. Prices for everyday items remain low, yet the specter of rationing still looms, with families coming together for Sunday dinners and Thanksgiving feasts. The role of women in society is shifting, as they begin to claim their place in the workforce, challenging traditional gender norms while grappling with the expectations of family life. In this intricate tapestry of life, the atmosphere is thick with the tension of change, where every whispered conversation could lead to a revelation, or a deception."
  ],
  "note": "",
  "cost": 0.00113391465,
  "durationMs": 16711
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A seaside hotel hosts a gathering of staff and guests amid post-war tensions, where the pressures of societal change and the secrets of the past converge to create a volatile atmosphere.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is shifting as women step into roles traditionally held by men, creating class tensions and personal rivalries, while the specter of WWII trauma lingers over social interactions."
  },
  "setting": {
    "location": "A sprawling seaside hotel on a cliff with ocean views.",
    "institution": "The hotel serves as a retreat for guests seeking solace but also harbors hidden agendas among its staff.",
    "weather": "Overcast with occasional mist from the sea, enhancing the mood of tension and mystery."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a mechanical clock-tampering method, where a rewound timepiece staged the apparent time of death."
}

### LOCKED_FACTS
[
  {
    "id": "victim_time",
    "value": "twenty minutes past eight",
    "description": "The time the victim's watch stopped."
  },
  {
    "id": "clock_time",
    "value": "ten minutes to nine",
    "description": "The time displayed on the hotel clock at the time of discovery."
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
    "essential": 17,
    "supporting": 2,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "category": "temporal"
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
      "criticality": "supporting",
      "category": "temporal"
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
      "criticality": "supporting",
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
      "category": "temporal"
    },
    {
      "id": "clue_11",
      "placement": "mid",
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
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
      "criticality": "essential",
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

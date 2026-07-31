# Actual Prompt Record

- Run ID: `mystery-1785507417070`
- Project ID: ``
- Timestamp: `2026-07-31T14:21:22.652Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `3d26c31e3080ce98`

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
    "title": "The Clockwork Conspiracy",
    "author": "John Doe",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Seaside hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "death_method": "struck with a heavy object",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp and observant investigator.",
      "private_secret": "Haunted by a case that went unsolved.",
      "motive_seed": "Seeks justice for the victim.",
      "motive_strength": "strong",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal investment in solving the case.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Respected physician.",
      "private_secret": "Had a secretive side business.",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "None",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "None.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A retired naval officer.",
      "private_secret": "Involved in smuggling during the war.",
      "motive_seed": "Financial gain.",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "The terrace where the murder occurred"
      ],
      "behavioral_tells": [
        "Nervous when questioned about alibi."
      ],
      "stakes": "Avoiding exposure of past crimes.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "An aspiring artist.",
      "private_secret": "In love with Dr. Finch.",
      "motive_seed": "Jealousy over unrequited love.",
      "motive_strength": "weak",
      "alibi_window": "8:30 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Avoids eye contact when asked about the victim."
      ],
      "stakes": "Heartbreak and social reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A wealthy widow.",
      "private_secret": "Involved in shady investments.",
      "motive_seed": "Financial loss due to the victim's actions.",
      "motive_strength": "strong",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Fidgeting when discussing finances."
      ],
      "stakes": "Desperation to maintain her lifestyle.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A charming businessman.",
      "private_secret": "Has a secret relationship with Beatrice.",
      "motive_seed": "Protecting Beatrice.",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Defensive when questioned about Beatrice."
      ],
      "stakes": "His relationship with Beatrice at risk.",
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
      "summary": "During a family reunion at a grand hotel, Dr. Mallory Finch is found dead shortly after a clock is tampered with to mislead the timeline of her murder. Eleanor Voss, an astute detective, must unravel the series of alibis and find the real culprit among the guests."
    },
    "accepted_facts": [
      "Dr. Mallory Finch was found dead at approximately 10:50 PM.",
      "Witnesses claim the clock in the lobby chimed at 9:10 PM."
    ],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock in the hotel lobby was tampered with to display a false time, misleading witnesses about the actual time of death.",
      "delivery_path": [
        {
          "step": "The clock's mechanism was adjusted to slow down its hands, resulting in a time discrepancy."
        },
        {
          "step": "This misled guests into believing the murder happened earlier than it actually did."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death was proven to be later than the clock indicated."
    }
  },
  "false_assumption": {
    "statement": "The murder of Dr. Mallory Finch occurred shortly after 9:00 PM.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock chimed at 9:10 PM, leading everyone to believe the murder happened immediately afterward.",
    "what_it_hides": "The actual time of death was much later, around 10:50 PM, due to clock tampering."
  },
  "false_solution": {
    "accused_suspect": "Beatrice Quill",
    "supporting_points": [
      "Witnesses saw her arguing with Dr. Finch shortly before her death.",
      "She was last seen near the clock before it chimed."
    ],
    "the_one_flaw": "The clock's tampering shows that the timeline was manipulated, clearing her of guilt.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witness accounts claim they saw Beatrice near the scene of the crime.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "She was helping Dr. Finch with her art supplies shortly before her death.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Captain Hale's nervous demeanor during questioning.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was merely anxious about the recent events and his past.",
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
    "rationale": "All suspects were guests at the hotel and had the opportunity to commit the crime."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock in the lobby",
        "Witness statements about time of death"
      ],
      "windows": [
        "9:00 PM to 10:00 PM"
      ],
      "contradictions": [
        "Clock chimed at 9:10 PM, yet Dr. Finch was found dead at 10:50 PM."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Hugo Vane"
      ],
      "objects": [
        "Lobby clock",
        "Heavy object used in murder"
      ],
      "permissions": [
        "Guests allowed in the lobby at all times"
      ]
    },
    "physical": {
      "laws": [
        "Physics of clock mechanisms",
        "Gravity affecting the heavy object"
      ],
      "traces": [
        "Fingerprints on the clock",
        "Dust on the murder weapon"
      ]
    },
    "social": {
      "trust_channels": [
        "Relationships among guests",
        "Past connections"
      ],
      "authority_sources": [
        "Hotel management's account of events",
        "Witness statements"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the lobby shows a time of ten minutes past nine.",
        "correction": "This contradicts the later witness statements about the time of death.",
        "effect": "Narrows time of death to after 10:00 PM.",
        "required_evidence": [
          "Clock in the lobby shows ten minutes past nine.",
          "Witness statements confirm Dr. Finch was alive after 10:00 PM."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dust on the clock suggests it hasn't been tampered with in days.",
        "correction": "The clock was tampered with just before the murder to mislead witnesses about the time.",
        "effect": "Eliminates the possibility that the clock was tampered with days before.",
        "required_evidence": [
          "Dust accumulation on the clock face.",
          "Witnesses recall the clock striking at odd intervals."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall seeing Captain Hale leave the terrace shortly before 10:50 PM.",
        "correction": "This shows he had access to the area and thus could have committed the murder.",
        "effect": "Narrows down the suspect pool to Captain Hale.",
        "required_evidence": [
          "Witness statements about Captain Hale's whereabouts.",
          "Time of death confirmed to be around 10:50 PM."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, tamper, and lobby against the claimed timeline.",
    "knowledge_revealed": "The clock's mechanism shows recent tampering marks not on the other clock.",
    "pass_condition": "The test proves only Captain Hale had the means to alter the clock.",
    "evidence_clues": [
      "clue_4",
      "clue_6",
      "clue_culprit_direct_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time indicated ten minutes past nine (early). Step 2: Dust on the clock (mid) shows it was not touched recently. Step 3: Witness statements about Captain Hale's presence near the clock (discriminating test) confirm he had the opportunity."
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
        "Observe the clock's tampering",
        "Draw conclusion about Captain Hale's guilt"
      ],
      "test_type": "mechanical comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by her sketchbook's timestamps.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her financial records prove she was elsewhere.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm he was seen at the bar.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: None",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of clock tampering."
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Confrontation evidence"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_elimination_hugo_vane",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_sylvia_trent",
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
    "summary": "A charismatic traveling journalist, Eleanor Voss finds herself tangled in a web of secrets and unrequited love while investigating a murder at a seaside hotel.",
    "publicPersona": "Charismatic and insightful, always ready with a story that captivates her audience.",
    "privateSecret": "Eleanor is secretly in love with Captain Hale, complicating her investigations.",
    "motiveSeed": "She longs for the truth behind the murder, which may reveal deeper secrets about her own feelings.",
    "motiveStrength": "strong",
    "alibiWindow": "present at the hotel during the murder as she was writing an article.",
    "accessPlausibility": "easy",
    "stakes": "personal emotional investment in uncovering the truth.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a fluidity that reflects her journalistic background, often weaving anecdotes into her dialogue, and her tone shifts from playful to serious, depending on the gravity of the situation.",
    "signatureTic": "“Let me tell you a story...”",
    "internalConflict": "Eleanor grapples with her feelings for Ivor, torn between her professional integrity and personal desires, fearing that uncovering the truth about the murder may also expose her heart.",
    "personalStakeInCase": "This crime matters to Eleanor because it could either solidify her feelings for Captain Hale or shatter them completely, depending on what truths are unveiled.",
    "paragraphs": [
      "Eleanor Voss stood at the edge of the terrace, her gaze lost in the frothy waves crashing against the rocks below. The salty breeze whipped her auburn hair into a frenzy as she scribbled notes into her leather-bound journal. To the casual observer, she was merely a journalist, collecting stories for her next column. But beneath that confident exterior lay a heart in turmoil, caught in the crosshairs of affection and ambition. She was here to uncover the truth behind the recent murder, yet her thoughts often drifted to the man at the center of her emotional storm — Captain Ivor Hale.",
      "With each interview, Eleanor felt the weight of her affection for Ivor grow heavier. She had watched him from a distance, his rugged charm and gallant demeanor captivating her like a moth drawn to a flame. But every time she approached him, the professional facade would slip, and the tangled mess of her feelings would ensnare her tongue. What would it take to unravel this knot? Perhaps the truth about the murder would provide the clarity she sought, a way to either confess her love or let it go. It was a dangerous gamble, but Eleanor was no stranger to risk.",
      "As she delved deeper into the investigation, Eleanor uncovered secrets that intertwined the lives of the hotel’s guests. The victim was not just a stranger; they were a catalyst for the emotions swirling around her. Each revelation chipped away at the barriers she had built, forcing her to confront her own motives and desires. The truth about the murder was elusive, and with every dead end, Eleanor questioned if she was seeking justice or merely a way to justify her feelings for Ivor.",
      "Eleanor's resolve hardened as she navigated the treacherous waters of the investigation. She was determined to seek justice, not only for the victim but for herself. The clock was ticking, and with each passing moment, she felt the urgency to discover the truth before it slipped away like the tide. In the end, she knew that the answers she sought would either bind her to Ivor or free her from the emotional shackles that had kept her anchored in uncertainty."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected physician with a hidden past, Dr. Mallory Finch must confront her bitter secrets after becoming the victim of a murder that threatens to unravel her life.",
    "publicPersona": "Respected doctor known for her charity work and medical expertise.",
    "privateSecret": "Mallory had a secret romantic relationship with the victim, which ended bitterly.",
    "motiveSeed": "She could lose her credibility if it gets out that the victim was blackmailing her.",
    "motiveStrength": "moderate",
    "alibiWindow": "in the hotel clinic during the murder, but her movements are unverified.",
    "accessPlausibility": "possible",
    "stakes": "reputation and professional standing in the community.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory speaks with a calm, measured tone, often using medical jargon when discussing her profession, but there’s an underlying tension in her words that hints at her concealed turmoil.",
    "signatureTic": "“As a doctor, I must...”",
    "internalConflict": "Mallory is haunted by her past relationship with the victim, feeling guilty for not being able to protect herself from their manipulation while fearing the scandal that may ensue.",
    "personalStakeInCase": "This crime matters to Mallory because it threatens to expose her past and ruin her reputation as a respected physician, leaving her vulnerable in a community that once held her in high regard.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the quiet confines of the hotel clinic, her hands trembling slightly as she examined the instruments laid out before her. To the outside world, she was the epitome of professionalism, a beacon of hope for those in need. Yet, as the shadows of the past crept into her consciousness, Mallory felt the weight of her secret pressing down on her. The victim had been more than just a casualty; they were a reminder of a relationship that had spiraled into chaos, one that could unravel everything she had worked to build.",
      "The whispers of blackmail echoed in her mind, a dark specter that loomed over her reputation. Mallory had always prided herself on her integrity, but the affair had left her vulnerable, and the victim had exploited that vulnerability mercilessly. Now, with their untimely death, she couldn’t help but wonder if the truth would come to light, dragging her down with it. The stakes were higher than ever, and the pressure to maintain her facade was suffocating.",
      "As she navigated the aftermath of the murder, Mallory found herself grappling with conflicting emotions. Anger, regret, and fear swirled within her, each feeling vying for dominance. She had loved the victim, despite their faults, and now that love was tainted by betrayal. The memories of their time together haunted her, reminding her of the choices she had made that led to this moment. Would she be forced to confront her past, or could she bury it beneath the weight of her grief?",
      "With each passing day, the investigation tightened its grip around her. Mallory felt the scrutiny of her colleagues and the community, their eyes piercing through her carefully constructed facade. She knew that if the truth emerged, it would not only shatter her reputation but also expose the fragility of her own heart. In the end, Mallory had to confront the truth — not just about the victim, but about herself, and whether she could rise above the remnants of her past to reclaim the life she had nearly lost."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A charming naval officer ensnared in a tangled love triangle, Captain Ivor Hale must confront the consequences of his past as he becomes a prime suspect in a murder investigation.",
    "publicPersona": "Charming and courageous, a war hero with a magnetic presence.",
    "privateSecret": "Ivor was involved in a love triangle that left both women heartbroken, including Eleanor.",
    "motiveSeed": "He felt trapped in his relationships and wanted the victim out of the picture to pursue his dreams.",
    "motiveStrength": "compelling",
    "alibiWindow": "was seen at the bar until shortly before the murder, but the timing is suspect.",
    "accessPlausibility": "easy",
    "stakes": "his future and emotional freedom.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a confident swagger, often using playful banter and sarcasm to deflect questions, but his voice carries a weight of regret that occasionally breaks through.",
    "signatureTic": "“You know how it is...”",
    "internalConflict": "Ivor struggles with guilt over his past decisions, particularly how they have affected Eleanor and the victim, leading him to question whether he is truly deserving of happiness.",
    "personalStakeInCase": "This crime matters to Ivor because it threatens to expose his tangled relationships and the emotional fallout that could jeopardize his future aspirations.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, a whiskey in hand, his charm radiating like the sun setting over the ocean. He was a man of action, a war hero with stories that could captivate any audience. Yet beneath that magnetic exterior lay a man grappling with the consequences of his past. The recent murder had thrust him into the spotlight, turning his world upside down and forcing him to confront the choices he had made in the name of love and ambition.",
      "As he exchanged banter with the hotel staff, Ivor's mind wandered to the women in his life — Eleanor and the victim. Both had captured his heart in different ways, but the weight of his decisions had left them both heartbroken. He felt like a puppet caught in a tangled string of emotions, and the murder was the final act of a tragedy he had inadvertently orchestrated. The whispers of suspicion surrounding him only added to his turmoil, and he couldn’t shake the feeling that he was being watched, judged for his past.",
      "Ivor's alibi was as shaky as the ground beneath him. He had been at the bar until moments before the murder, but how could he prove his innocence? The thought of being implicated in the very crime that could shatter his dreams sent a chill down his spine. He had always prided himself on being in control, but now he felt like a marionette, strings pulled taut by unseen hands. The irony of his situation was not lost on him; he had wanted freedom, yet here he was, trapped by the very relationships he had sought to escape.",
      "As the investigation unfolded, Ivor was forced to confront the ghosts of his past. Each revelation felt like a dagger, piercing through the facade he had built. He wanted to be the hero, the man who could save the day, but the truth was far more complicated. Would he have to sacrifice his future for the mistakes of his past? The stakes had never been higher, and as he faced the consequences of his choices, Ivor sought a way to reclaim his life before it slipped through his fingers like sand."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An entitled socialite with a flair for the dramatic, Beatrice Quill must navigate her jealousy and ambition as the murder investigation unfolds.",
    "publicPersona": "Flamboyant and self-assured, always in the spotlight of social events.",
    "privateSecret": "Beatrice is jealous of the victim's relationship with Captain Hale, feeling overshadowed.",
    "motiveSeed": "She stood to gain favor with Ivor by eliminating his embarrassing connection to the victim.",
    "motiveStrength": "weak",
    "alibiWindow": "claiming to be on the terrace at the time of the murder, but no witnesses.",
    "accessPlausibility": "possible",
    "stakes": "her social standing and romantic aspirations.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks with an exaggerated flair, often punctuating her sentences with dramatic pauses and grand gestures, but her tone can shift to a cold, biting sarcasm when discussing rivals.",
    "signatureTic": "“Darling, you simply must understand...”",
    "internalConflict": "Beatrice struggles with her self-worth, constantly comparing herself to others, particularly the victim, and fears being overshadowed in both love and social standing.",
    "personalStakeInCase": "This crime matters to Beatrice because it threatens to expose her insecurities and diminish her status in a society that reveres power and connections.",
    "paragraphs": [
      "Beatrice Quill flitted about the hotel like a butterfly, her vibrant dress swirling around her as she commanded the attention of everyone in the room. She was a socialite at heart, accustomed to being the center of attention, but beneath the flamboyant exterior lay a simmering jealousy that threatened to boil over. The recent murder had cast a shadow over her social circle, and Beatrice felt the weight of scrutiny bearing down on her as whispers of suspicion began to swirl. In her eyes, the victim was the embodiment of everything she loathed — an obstacle to her desire for Captain Hale’s affections.",
      "As she lounged on the terrace, Beatrice recalled the moments when Captain Hale had looked at the victim with admiration. It was a gaze that sent shivers down her spine, igniting a fire of jealousy that burned within her. She had always prided herself on her ability to charm and manipulate, yet here she was, feeling powerless against a rival who had captured the heart of the man she coveted. The murder had presented an opportunity — one that she could not ignore. Perhaps if the victim were out of the picture, Ivor would finally see her for the captivating woman she was.",
      "Beatrice's alibi was flimsy at best, a mere claim that she had been on the terrace during the murder, but without witnesses, her innocence was suspect. She could sense the eyes of the other guests on her, judging her every move, and the pressure to maintain her social standing weighed heavily on her shoulders. The thought of being implicated in the murder sent a thrill of fear through her, but it was overshadowed by the tantalizing idea that she could emerge victorious from this chaos, her status elevated by the drama unfolding around her.",
      "As the investigation progressed, Beatrice found herself at a crossroads. Would she continue to play the role of the entitled socialite, or would she confront her insecurities head-on? The murder had shaken her world, and in the face of adversity, she may find that true power lies not in manipulation but in embracing her authentic self. The stakes were high, and Beatrice had to decide if she was willing to risk everything for love and acceptance."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "The impeccable hotel manager, Sylvia Trent, must confront her buried resentment as the murder investigation threatens her carefully curated reputation.",
    "publicPersona": "Professional and polished, always ensuring the hotel's reputation.",
    "privateSecret": "Sylvia harbors resentment against the victim for a past slight at a charity event.",
    "motiveSeed": "She felt undermined by the victim's continuous complaints about the hotel's service.",
    "motiveStrength": "weak",
    "alibiWindow": "in the kitchen during the murder, but her staff's testimony could be bias.",
    "accessPlausibility": "possible",
    "stakes": "the hotel's reputation and her own integrity.",
    "humourStyle": "observational",
    "humourLevel": 0.3,
    "speechMannerisms": "Sylvia speaks in a composed, measured tone, often using formal language, but her words can carry a sharp edge when discussing matters of the hotel and its reputation.",
    "signatureTic": "“In my experience...”",
    "internalConflict": "Sylvia struggles with the need for validation in her role as hotel manager, feeling that the victim’s criticisms have undermined her authority and self-worth.",
    "personalStakeInCase": "This crime matters to Sylvia because it threatens the reputation of the hotel she has dedicated her life to, and she fears that the fallout may tarnish her own standing in the community.",
    "paragraphs": [
      "Sylvia Trent stood in the kitchen, surrounded by the clatter of pots and pans, her heart racing as she processed the chaos that had erupted in her hotel. As the manager, she was accustomed to maintaining order, but the recent murder had turned her world upside down. The victim had been a constant thorn in her side, their complaints echoing through the halls, undermining her authority at every turn. Now, with their death hanging over the hotel like a dark cloud, Sylvia felt the pressure mounting to protect not only her establishment but also her own reputation.",
      "In the polished world of hospitality, Sylvia had learned to navigate the complexities of human behavior with grace, but the victim had tested her patience time and again. Each encounter had chipped away at her confidence, and now their absence left a void filled with unresolved resentment. She had longed for the opportunity to prove herself, to demonstrate her capabilities as a manager, yet the murder had overshadowed her accomplishments, casting a pall over her hard-earned reputation.",
      "As she spoke with her staff, Sylvia’s voice remained steady, but her thoughts raced. The investigation was a double-edged sword, threatening to expose her vulnerabilities while also offering a chance for redemption. She could feel the eyes of the community on her, scrutinizing every decision she made, and the stakes had never felt higher. Would she be able to rise above the whispers of doubt, or would the shadows of the past consume her?",
      "In the end, Sylvia understood that the true test of her character lay not only in how she managed the hotel but also in how she confronted her own insecurities. The murder had forced her to confront the resentment she had buried deep within, and perhaps, through this turmoil, she could find the strength to forgive and prove that her worth extended far beyond the walls of the hotel."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A quiet waiter with a keen eye for detail, Hugo Vane must navigate his own insecurities as he becomes embroiled in a murder investigation at the hotel.",
    "publicPersona": "Quiet and attentive, always watching the goings-on with keen interest.",
    "privateSecret": "Hugo has a secret crush on Eleanor and envies the attention she gets.",
    "motiveSeed": "He learned too many secrets while serving guests, and the victim threatened to expose his background.",
    "motiveStrength": "weak",
    "alibiWindow": "was delivering room service during the murder, but the timing is vague.",
    "accessPlausibility": "easy",
    "stakes": "his job and personal dignity.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.2,
    "speechMannerisms": "Hugo tends to speak in a soft, hesitant manner, often trailing off or mumbling when nervous, and he frequently uses self-deprecating humor to deflect attention from himself.",
    "signatureTic": "“I’m just a waiter, after all...”",
    "internalConflict": "Hugo grapples with feelings of inadequacy and jealousy, particularly regarding Eleanor, and fears that the truth about his past will ruin any chance he has at happiness.",
    "personalStakeInCase": "This crime matters to Hugo because it could threaten his job and force him to confront his insecurities, especially in relation to his feelings for Eleanor.",
    "paragraphs": [
      "Hugo Vane moved through the hotel with the quiet grace of a shadow, always observing but rarely seen. His role as a waiter allowed him to blend into the background, yet he possessed a keen eye for detail, catching snippets of conversations and unguarded moments that others overlooked. But beneath his attentive exterior lay a heart burdened by unrequited love for Eleanor, a woman who seemed to shine like the sun, while he felt more like a forgotten star in the night sky.",
      "As the murder investigation unfolded, Hugo found himself entangled in a web of secrets he had overheard while serving guests. The victim had threatened to expose his past, a dark shadow that loomed over him like a storm cloud, and now he felt the pressure to protect his dignity while also navigating his feelings for Eleanor. The thought of losing his job was terrifying, but the idea of being revealed as the man he feared he was left him paralyzed with anxiety.",
      "Hugo's alibi was as flimsy as a whisper, a vague claim that he had been delivering room service at the time of the murder. The uncertainty gnawed at him, and he could sense the scrutiny from the other guests, their eyes probing for weaknesses. In moments of panic, he resorted to self-deprecating humor, often muttering to himself, “I’m just a waiter, after all…” as if that could somehow shield him from the storm raging around him.",
      "As the investigation progressed, Hugo felt the weight of his insecurities pressing down on him, forcing him to confront the truth about himself. Could he find the courage to stand up for his feelings, or would he remain in the shadows, forever watching Eleanor from a distance? The stakes were high, and as the clock ticked down, Hugo realized that he had to choose between hiding from the truth or stepping into the light and facing his fears head-on."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Oceanview Grand Hotel",
    "type": "seaside hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "An imposing Art Deco hotel overlooking the turbulent sea, a haven for guests seeking refuge from the chaos of the world.",
    "visualDescription": "The hotel boasts grand, sweeping staircases, polished marble floors, and intricate geometric patterns in the ceilings. Tall windows frame the ever-changing ocean, while plush furnishings invite weary travelers to linger.",
    "atmosphere": "A constant tension hangs in the air, as the distant sound of crashing waves mirrors the unrest of wartime Britain.",
    "paragraphs": [
      "The Oceanview Grand Hotel stands resolute against the stormy sea, its Art Deco façade a striking contrast to the moody skies above. High ceilings soar in the lobby, adorned with intricate plasterwork and shimmering chandeliers that catch the dim light. Guests, wrapped in heavy coats, sip tea in the terrace lounge, their eyes flickering to the churning waters beyond, as if they might reveal secrets of the world outside. The scent of salt and damp wood permeates the air, mingling with the faint echoes of laughter and whispered conversations.",
      "Within its walls, the hotel is a microcosm of society, a gathering place for those seeking solace from the war's chaos. The narrow hallways, lined with plush carpets, create an intimate yet claustrophobic atmosphere, where every creak of the floorboards seems amplified. Staff bustle about, their footsteps quickening as they navigate the tight spaces, while guests retreat to their rooms, the heavy doors closing with a resounding thud. Outside, the relentless wind whips through the terrace, carrying with it the scent of rain and the distant crash of waves, a reminder of the isolation that surrounds this coastal refuge.",
      "As night falls, the hotel transforms; the flickering candlelight casts dancing shadows across the walls, and the distant sound of the radio fills the air, offering a brief respite from the grim realities of the outside world. Yet beneath the surface, a tension simmers, as secrets lie hidden in the corners of the grand establishment. The clock ticks ominously in the lobby, its hands moving inexorably forward, counting down the moments until the next revelation shatters the fragile calm."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain showers, typical of coastal climates",
    "timeFlow": "Three days of mounting tension, culminating in a shocking revelation",
    "mood": "tense and apprehensive, heightened by recent events in the war",
    "eraMarkers": [
      "ubiquitous radios crackling with news bulletins",
      "rationed wartime vehicles parked outside",
      "manual typewriters clacking in the business center"
    ],
    "sensoryPalette": {
      "dominant": "briny sea air mixed with damp wood",
      "secondary": [
        "flickering candlelight",
        "the faint rustle of silk dresses"
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of brine, a constant reminder of the ocean's presence just beyond the hotel's walls. The overcast sky looms overhead, casting a grey pallor over the building, while the sound of rain occasionally drums against the windows, creating an unsettling rhythm. A sense of unease pervades the atmosphere, as if the very walls of the hotel are holding their breath, waiting for the next shoe to drop.",
      "Inside, the lobby is alive with the low murmur of conversations, punctuated by the clinking of teacups and the occasional burst of laughter. Yet beneath the surface, a current of anxiety flows, as guests steal glances at one another, their faces etched with worry. The flickering candlelight casts eerie shadows that dance across the polished marble floor, enhancing the sense of mystery that envelops the hotel."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Seaside Terrace",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A windswept terrace with wrought iron railings, overlooked by the hotel’s upper floors. The sea crashes violently against the rocks below, sending salty spray into the air.",
      "sensoryDetails": {
        "sights": [
          "churning waves crashing against rocks",
          "dark clouds swirling overhead",
          "scattered furniture blown askew",
          "dim light from hotel windows",
          "flickering lanterns swaying in the breeze"
        ],
        "sounds": [
          "crashing waves echoing below",
          "howling wind whipping around corners",
          "distant sirens wailing through the night",
          "soft footfalls on damp tiles",
          "rustling leaves in the garden"
        ],
        "smells": [
          "salt air tinged with damp earth",
          "wet stone and seaweed",
          "smoky remnants of extinguished candles",
          "fresh rain on concrete",
          "acrid scent of spilled whiskey"
        ],
        "tactile": [
          "cold metal of the railing",
          "rough texture of weathered stone",
          "slickness of rain-soaked tiles",
          "chill of the ocean breeze",
          "softness of a discarded scarf"
        ]
      },
      "accessControl": "Accessible to guests only during daylight hours; restricted access post-sunset due to safety concerns.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "puddles forming on tiles",
            "raindrops racing down the railing"
          ],
          "sounds": [
            "steady drumming of rain on metal",
            "distant thunder rumbling",
            "soft whispers of guests huddled together"
          ],
          "smells": [
            "damp earth mixing with salt",
            "fresh rain on seaweed",
            "cold stone absorbing moisture"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dulling colors",
            "shadows creeping along the terrace",
            "sea mist rising from the waves"
          ],
          "sounds": [
            "silence broken by a distant gull’s cry",
            "the creak of the railing as guests lean",
            "the rustle of a newspaper in hand"
          ],
          "smells": [
            "beeswax from lanterns",
            "the tang of briny sea air",
            "faint whiff of damp wood"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering in the breeze",
            "long shadows stretching across tiles",
            "stars beginning to peek through clouds"
          ],
          "sounds": [
            "the gentle lapping of waves",
            "soft laughter from nearby tables",
            "the distant thrum of a radio"
          ],
          "smells": [
            "candle wax melting",
            "the sweet scent of blooming night jasmine",
            "tobacco smoke wafting from guests"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Seaside Terrace, once a place of laughter and leisurely afternoons, now bears the weight of a recent tragedy. Cracked tiles and overturned furniture hint at a struggle, while the relentless waves crash against the rocks below, echoing the turmoil that has unfolded. A chilling breeze sweeps through, carrying with it the scent of salt and damp earth, a stark reminder of the isolation that surrounds the hotel. Guests gather in hushed groups, their eyes darting nervously toward the terrace, whispers of the incident mingling with the sound of the sea.",
        "As evening descends, the flickering lanterns cast eerie shadows across the terrace, heightening the sense of foreboding. The once-vibrant space feels heavy with secrets, as if the very air is charged with tension. The distant sound of a radio crackles to life, playing a tune that feels oddly out of place amid the unease. Guests exchange wary glances, each one acutely aware that the truth lies hidden just out of reach, waiting to be uncovered."
      ]
    },
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious lobby adorned with polished marble floors, high ceilings, and grand chandeliers that cast a warm glow. Plush seating areas invite guests to linger.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors reflecting light",
          "ornate chandeliers with crystal accents",
          "vintage art deco furniture",
          "large floral arrangements on reception desk",
          "guests in elegant attire mingling"
        ],
        "sounds": [
          "soft murmur of conversation",
          "clinking of glasses in the bar area",
          "the rustle of newspapers being read",
          "the thud of luggage being dropped",
          "the distant chime of a grandfather clock"
        ],
        "smells": [
          "freshly brewed coffee wafting from the café",
          "polished wood and varnish",
          "flower petals and damp earth",
          "a hint of perfume lingering in the air",
          "the musty scent of old books from the library"
        ],
        "tactile": [
          "smoothness of marble underfoot",
          "soft upholstery of armchairs",
          "coolness of metal fixtures",
          "warmth from the fireplace",
          "the weight of a leather-bound guest book"
        ]
      },
      "accessControl": "Open to all guests and visitors during the day; locked at night with staff monitoring.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets racing down windows",
            "dim light filtering through clouds",
            "guests huddled under umbrellas"
          ],
          "sounds": [
            "pattering rain against glass",
            "quiet footsteps on wet floors",
            "the distant sound of thunder"
          ],
          "smells": [
            "freshly brewed tea and scones",
            "damp wood and upholstery",
            "the earthy scent of rain-soaked flowers"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "guests wrapped in heavy coats",
            "the glow of lamps against the gloom"
          ],
          "sounds": [
            "the rustle of newspaper pages turning",
            "soft laughter echoing in the corners",
            "the intermittent sound of a radio playing"
          ],
          "smells": [
            "the comforting scent of baked goods",
            "faint whiff of cigar smoke",
            "the musty aroma of aging books"
          ],
          "mood": "contemplative"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft glow of lamps illuminating faces",
            "glimmer of glassware at the bar",
            "guests in evening attire chatting"
          ],
          "sounds": [
            "the gentle clinking of ice in drinks",
            "soft jazz music playing in the background",
            "the laughter of a group enjoying cocktails"
          ],
          "smells": [
            "sweet scent of desserts being served",
            "the rich aroma of whiskey",
            "the refreshing smell of citrus and mint"
          ],
          "mood": "sophisticated warmth"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the heart of the Oceanview Grand Hotel, a bustling hub where guests gather to socialize, sip cocktails, and exchange stories. Polished marble floors gleam under the soft glow of ornate chandeliers, while plush armchairs invite weary travelers to pause and take in the atmosphere. The scent of fresh coffee mingles with the floral arrangements, creating a welcoming ambiance. Yet, as conversations flow, an undercurrent of tension lingers, as if everyone is waiting for the next unexpected turn of events.",
        "As the day progresses, the lobby transforms with the weather outside. The dim light of an overcast afternoon casts long shadows across the marble, and the soft murmur of voices becomes more subdued, as guests steal glances toward the entrance, anticipating arrivals that may bring news of the outside world. In the evenings, the atmosphere shifts once more; laughter and music fill the air, but the tension of the unknown still lingers, keeping everyone on edge."
      ]
    },
    {
      "id": "library",
      "name": "Hotel Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A cozy, dimly lit room lined with shelves of well-worn books, plush armchairs, and a large fireplace crackling softly in the corner.",
      "sensoryDetails": {
        "sights": [
          "dust motes dancing in the warm light",
          "wooden shelves crammed with books",
          "faded upholstery on armchairs",
          "the flickering flames in the fireplace",
          "a large globe in the corner"
        ],
        "sounds": [
          "crackling fire casting soft pops",
          "pages turning in the silence",
          "the faint ticking of a clock",
          "the rustle of a newspaper",
          "whispers of guests sharing secrets"
        ],
        "smells": [
          "old paper and leather bindings",
          "smoky scent of burning wood",
          "the faint aroma of tea brewing",
          "the sweet scent of aged wood"
        ],
        "tactile": [
          "soft fabric of well-worn armchairs",
          "smoothness of leather-bound books",
          "warmth radiating from the fireplace",
          "cool wood of the globe",
          "the crispness of freshly turned pages"
        ]
      },
      "accessControl": "Open to guests during daytime; locked at night with limited access for staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops tapping against the window",
            "dim light filtering through clouds",
            "the glow of a lamp illuminating pages"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "the crackling of the fire",
            "the quiet sighs of readers lost in thought"
          ],
          "smells": [
            "the comforting scent of wet earth",
            "the rich aroma of brewing tea",
            "the mustiness of old books"
          ],
          "mood": "reflective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows deepening in the corners",
            "the glow of fireplace light flickering",
            "the spine of a book catching light"
          ],
          "sounds": [
            "the rustling of pages turning",
            "the distant sound of laughter",
            "the ticking of a clock marking time"
          ],
          "smells": [
            "the scent of old leather and dust",
            "the faint whiff of pipe tobacco",
            "the earthy aroma of damp wood"
          ],
          "mood": "introspective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light spilling from lamps",
            "the glow of embers in the fireplace",
            "guests gathered in quiet conversation"
          ],
          "sounds": [
            "soft laughter mingling with whispers",
            "the crackling of the fire",
            "the distant sound of a radio playing"
          ],
          "smells": [
            "the sweet scent of a nearby dessert",
            "the rich aroma of coffee brewing",
            "the comforting smell of burning wood"
          ],
          "mood": "serene yet tense"
        }
      ],
      "paragraphs": [
        "The Hotel Library is a sanctuary of knowledge and secrets, a space where guests can retreat from the chaos outside. Shelves lined with well-worn books create a cozy atmosphere, while plush armchairs beckon those seeking solace in literature. The crackling fireplace adds warmth, as the scent of old paper and leather fills the air, mingling with the faint aroma of tea brewing nearby. Here, whispers of intrigue linger, as guests share hushed conversations about the events unfolding around them.",
        "As the day progresses, the library takes on a life of its own. Morning rain creates a reflective ambiance, with the soft patter of droplets against the window providing a gentle soundtrack. In the afternoons, the overcast light deepens the shadows, making every creak of the floorboards feel significant. As evening descends, the library transforms once more, with the warm glow of lamps inviting guests to linger, their conversations punctuated by the crackle of the fire, a reminder that even in this sanctuary, tension is never far away."
      ]
    }
  ],
  "note": "",
  "cost": 0.00237276105,
  "durationMs": 54077
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1942,
    "month": "June",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "overcast with occasional rain showers",
      "cool breezes from the ocean",
      "periods of high humidity"
    ],
    "daylight": "Long summer days with daylight stretching until about nine o'clock at night.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded.",
    "holidays": [
      "Flag Day - June 14"
    ],
    "seasonalActivities": [
      "strolling along the beach in warmer clothing",
      "evening dance events at the hotel",
      "fishing trips arranged by local charters"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tweed suit with a light-colored waistcoat",
        "crisp white dress shirt with a narrow tie",
        "fedora hat"
      ],
      "casual": [
        "short-sleeve button-up shirts",
        "linen trousers",
        "deck shoes"
      ],
      "accessories": [
        "pocket square",
        "silver watch",
        "cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "knee-length floral dress with a fitted bodice",
        "sleeveless tea dress with a cinched waist",
        "lightweight cardigan"
      ],
      "casual": [
        "high-waisted shorts and a blouse",
        "capri pants with a fitted top",
        "simple sundress"
      ],
      "accessories": [
        "straw hat with a wide brim",
        "beaded handbag",
        "string of pearls"
      ]
    },
    "trendsOfTheMoment": [
      "utilitarian clothing reflecting wartime restrictions",
      "bold floral prints that signify a desire for normalcy",
      "sustainable fashion due to fabric rationing"
    ],
    "socialExpectations": [
      "men are expected to be in uniform or dressed sharply for social events",
      "women are increasingly taking on roles in the workforce and public life",
      "social gatherings are marked by discussions on war and its impact"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Battle of Midway begins, marking a turning point in the Pacific War",
      "reports of rations affecting food availability in urban areas",
      "growing concerns over the situation in North Africa"
    ],
    "politicalClimate": "Tension remains high due to ongoing military engagements and the draft.",
    "economicConditions": "Inflation is rising, and rationing is affecting many aspects of daily life, from food to clothing.",
    "socialIssues": [
      "women's rights as they enter the workforce in greater numbers",
      "racial inequalities as war jobs remain segregated",
      "anti-communist sentiment rising amidst the war"
    ],
    "internationalNews": [
      "news of Allied successes in various theaters of war",
      "increased propaganda efforts to boost morale at home",
      "declarations of loyalty drives in response to wartime fears"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's 'In the Mood'",
        "Bing Crosby's 'White Christmas'",
        "Duke Ellington's 'Take the 'A' Train'"
      ],
      "films": [
        "Casablanca",
        "The Maltese Falcon",
        "Yankee Doodle Dandy"
      ],
      "theater": [
        "Oklahoma!",
        "This is the Army",
        "The Glass Menagerie"
      ],
      "radio": [
        "The Shadow",
        "Fibber McGee and Molly",
        "The Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Fountainhead by Ayn Rand",
        "The Robe by Lloyd C. Douglas",
        "The Screwtape Letters by C.S. Lewis"
      ],
      "popularGenres": [
        "detective fiction",
        "romance novels reflecting wartime love stories",
        "political thrillers"
      ]
    },
    "technology": {
      "recentInventions": [
        "improvements in radar technology for military use",
        "advancements in radio communication",
        "development of synthetic rubber"
      ],
      "commonDevices": [
        "radio receivers as the main source of news",
        "manual typewriters for business and personal use",
        "early television sets in affluent homes"
      ],
      "emergingTrends": [
        "increased use of plastic in everyday items",
        "growing popularity of the automobile",
        "adoption of war-time technologies in civilian life"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Eggs (dozen): one shilling",
        "Movie ticket: one shilling"
      ],
      "commonActivities": [
        "attending community dances at local venues",
        "participating in war bond drives",
        "visiting local beaches for picnics"
      ],
      "socialRituals": [
        "Sunday family gatherings for shared meals",
        "evening radio listening as a family activity"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased awareness of class disparities due to rationing",
      "greater acceptance of working-class individuals in public roles"
    ],
    "gender": [
      "women are celebrated for their contributions to the workforce",
      "traditional gender roles are being challenged"
    ],
    "race": [
      "racial segregation remains a significant issue",
      "growing activism for civil rights among African Americans"
    ],
    "generalNorms": [
      "patriotism is paramount, with public displays of support for the war",
      "community bonds are stronger due to shared sacrifices"
    ]
  },
  "atmosphericDetails": [
    "The salty scent of the ocean mixed with the faint aroma of rain lingers in the air.",
    "The sound of seagulls cries punctuates the tense silence of the hotel lobby.",
    "A low hum of radio broadcasts fills the background, with news of the war creating a palpable anxiety."
  ],
  "paragraphs": [
    "In June 1942, the seaside hotel bustles with an uneasy energy. Overcast skies drape the coastal landscape, with sporadic rain showers creating a rhythmic patter against the windows. Long summer days linger, with the sun barely peeking through the clouds, casting a muted light over guests who gather in the lounge, discussing the latest news from the front lines. The recent Battle of Midway looms large in conversation, offering a glimmer of hope amidst the prevailing apprehension over the war's toll on families and communities. Flag Day, celebrated just the day prior, serves as a reminder of patriotism, yet the specter of rationing casts a shadow over the festivities, making each gathering feel both necessary and strained.",
    "Fashion reflects the strain of the times, with men donning tailored tweed suits paired with crisp white shirts and fedoras as they attempt to maintain a sense of normalcy. Women opt for floral dresses that echo the season's vibrancy, with many embracing the practicality of shorter hemlines that allow for ease of movement in their new roles at work. Accessories such as beaded handbags and straw hats become symbols of resilience, as the populace adapts to wartime restrictions while still seeking beauty in their attire. Amidst this, the emergence of utilitarian clothing trends underscores the necessity of practicality over extravagance, echoing the broader societal shifts that accompany the war effort.",
    "Daily life is intertwined with the rhythms of war; families gather for Sunday meals, discussing the latest updates over simple yet hearty dishes. Prices of staple goods like bread and eggs reflect the economic strain, with citizens navigating rationing cards and fluctuating prices. Evening radio broadcasts become a cherished ritual, where families unite to hear news of the war, mingling with popular entertainment to momentarily distract from the harsh realities outside. Yet, unease lingers in the air, as the specter of uncertainty looms large, underscoring the delicate balance between hope and despair that defines this summer of 1942."
  ],
  "note": "",
  "cost": 0.0011955702,
  "durationMs": 21871
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a seaside hotel for a family reunion is overshadowed by the tensions of post-WWII society, where shifting roles and secrets threaten to unravel long-held loyalties.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII has disrupted traditional family dynamics, with women entering the workforce and a pervasive atmosphere of suspicion fueled by anti-communist sentiments."
  },
  "setting": {
    "location": "A grand, Art Deco-style hotel overlooking the ocean",
    "institution": "seaside hotel",
    "weather": "overcast with occasional rain showers"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age country-house murder driven by a mechanical clock-tampering method."
}

### LOCKED_FACTS
[
  {
    "id": "clock_time",
    "value": "ten minutes past nine",
    "description": "The displayed time on the clock at the moment of the murder."
  },
  {
    "id": "actual_time",
    "value": "twenty minutes to eleven",
    "description": "The actual time when the murder occurred."
  },
  {
    "id": "witness_testimony_time",
    "value": "a quarter past nine",
    "description": "The time witnesses reported hearing the clock chime."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 14,
  "countsByPlacement": {
    "early": 3,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 13,
    "optional": 1
  },
  "redHerringCount": 0,
  "clues": [
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_2",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "spatial"
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
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "physical"
    },
    {
      "id": "clue_fp_elimination_sylvia_trent",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_elimination_hugo_vane",
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

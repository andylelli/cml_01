# Actual Prompt Record

- Run ID: `mystery-1778781007262`
- Project ID: ``
- Timestamp: `2026-05-14T17:53:55.220Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `8fb76019505cd435`

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
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "clock-tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "victim"
      ],
      "public_persona": "Charismatic estate hostess",
      "private_secret": "Drowning in debt and forced to sell the estate",
      "motive_seed": "Desperation for financial stability",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "direct access to clock",
        "garden access"
      ],
      "behavioral_tells": [
        "nervousness about finances"
      ],
      "stakes": "Maintain family legacy amidst financial ruin",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "expert witness",
      "relationships": [
        "acquaintance"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Former lover of the victim",
      "motive_seed": "Revenge for a past betrayal",
      "motive_strength": "moderate",
      "alibi_window": "disputed timeline",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "visiting the estate under the guise of a consultation"
      ],
      "behavioral_tells": [
        "excessive concern for the victim's well-being"
      ],
      "stakes": "Redemption of lost love",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "loyal retainer",
      "relationships": [
        "friend",
        "bodyguard"
      ],
      "public_persona": "Devoted family friend",
      "private_secret": "Secretly in love with Eleanor",
      "motive_seed": "Desire to protect Eleanor at all costs",
      "motive_strength": "strong",
      "alibi_window": "affirmed by multiple witnesses",
      "access_plausibility": "high",
      "opportunity_channels": [
        "personal access to all rooms in the estate"
      ],
      "behavioral_tells": [
        "intense protectiveness towards Eleanor"
      ],
      "stakes": "Eleanor's safety and well-being",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "the maid",
      "relationships": [
        "servant"
      ],
      "public_persona": "Obedient and quiet staff member",
      "private_secret": "Hides a petty theft from the estate",
      "motive_seed": "Financial desperation",
      "motive_strength": "weak",
      "alibi_window": "unconfirmed",
      "access_plausibility": "high",
      "opportunity_channels": [
        "frequent access to the clock room"
      ],
      "behavioral_tells": [
        "anxious demeanor around staff"
      ],
      "stakes": "Avoiding dismissal from service",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Eleanor Voss"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "Amidst the financial strains of the Great Depression, Eleanor Voss is found dead in her manor house, with the clock mysteriously tampered to mislead the investigation. As the guests unravel the timeline of events, they discover the truth hidden in plain sight."
    },
    "accepted_facts": [
      "The clock was stopped at ten minutes past eleven.",
      "Witnesses last saw Eleanor alive at a quarter past eleven.",
      "The fireplace contained ashes from a fire that was still warm."
    ],
    "inferred_conclusions": [
      "Eleanor's death occurred after the time shown on the clock.",
      "Someone manipulated the clock to create a misleading timeline."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, minut, and stopp to expose the false timing.",
      "delivery_path": [
        {
          "step": "The clock was deliberately tampered with before the guests arrived."
        }
      ]
    },
    "outcome": {
      "result": "The true timeline of events reveals Eleanor as the orchestrator of her own demise."
    }
  },
  "false_assumption": {
    "statement": "Eleanor must have died before her last seen time of a quarter past eleven due to the clock's indication.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock's stopping at ten minutes past eleven suggests she died earlier.",
    "what_it_hides": "The actual time of death was later, due to intentional tampering."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "quarter past eleven",
        "ten minutes past eleven"
      ],
      "windows": [
        "eleven o'clock to eleven forty"
      ],
      "contradictions": [
        "Witnesses saw Eleanor alive after the clock stopped."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Beatrice Quill"
      ],
      "objects": [
        "clock",
        "fireplace"
      ],
      "permissions": [
        "free access to the manor"
      ]
    },
    "physical": {
      "laws": [
        "The clock mechanism can be manipulated without detection."
      ],
      "traces": [
        "Ashes in the fireplace suggest recent use."
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor's authority as hostess"
      ],
      "authority_sources": [
        "Dr. Finch as the physician"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock was found stopped at ten minutes past eleven.",
        "correction": "This suggests a deliberate tampering to mislead about the time of death.",
        "effect": "Narrows the time of death to after quarter past eleven.",
        "required_evidence": [
          "Clock stopped at ten minutes past eleven",
          "Witnesses last saw Eleanor alive at quarter past eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "The ashes in the fireplace suggest a recent fire.",
        "correction": "If the fire was warm, it contradicts the idea that Eleanor died before she was last seen.",
        "effect": "Eliminates the idea that she died before quarter past eleven.",
        "required_evidence": [
          "Ashes in the fireplace are still warm",
          "Witnesses recall Eleanor's last actions happening closer to eleven thirty"
        ],
        "reader_observable": true
      },
      {
        "observation": "Multiple witnesses confirm that the clock chimed at eleven.",
        "correction": "This indicates that the tampering led to a false timeline.",
        "effect": "Narrows suspicion to Eleanor for manipulating the clock.",
        "required_evidence": [
          "Witnesses heard the clock chime at eleven",
          "The clock's internal mechanism shows signs of recent tampering"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, witness, and stopp against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, tamper, and stopp.",
    "pass_condition": "If Eleanor is proven to have tampered with the clock, her earlier alibi collapses.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_fp_contradiction_step_3_2",
      "clue_core_contradiction_chain",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock stopped at ten minutes past eleven and witnesses last saw Eleanor alive at quarter past eleven, indicating a timeline manipulation. Step 2: Warm ashes in the fireplace contradict the idea of an earlier death, as they suggest Eleanor was alive longer. Step 3: Witnesses heard the clock chime at eleven, confirming Eleanor's involvement in tampering."
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
        "Observe the clock's behavior during the reenactment",
        "Draw conclusion about Eleanor's guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Dr. Finch's confirmed alibi tightens timeline evidence.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses affirm Hale's presence elsewhere when death occurred.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Beatrice's access to the clock is confirmed but not the motive.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with clock evidence and witness testimonies."
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical evidence from the fireplace"
      },
      {
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_eleanor_voss",
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
        "clue_id": "clue_fp_contradiction_step_1_2",
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
        "delivery_method": "Witness testimony"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3_2",
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
    "summary": "Eleanor Voss is a charismatic socialite, adept at navigating the treacherous waters of high society while harboring a deep-seated fear of losing her family's dwindling fortune.",
    "publicPersona": "Known for her lavish gatherings that attract the elite of Little Middleton, Eleanor has mastered the art of charm and social connection. Her parties are the talk of the town, each one a meticulously curated affair designed to bolster her family's status.",
    "privateSecret": "Beneath her sparkling facade, Eleanor grapples with the reality of her family's financial decline. The pressure to maintain appearances weighs heavily on her, and she fears that any misstep could lead to a catastrophic fall from grace.",
    "motiveSeed": "The recent murder of a prominent figure in her social circle has left Eleanor anxious about the victim's influence, which she believes could threaten her daughter's future prospects.",
    "motiveStrength": "compelling",
    "alibiWindow": "Eleanor claims she was in the garden, mingling with other guests from eight to ten, a time frame that conveniently allows her a potential cover.",
    "accessPlausibility": "With her social stature, gaining access to the victim before the incident would have been remarkably easy, as she often moved in the same circles.",
    "stakes": "Eleanor is desperate to secure a beneficial marriage for her daughter, seeing it as the last bastion of her family's fading glory.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Eleanor speaks with a polished eloquence, often peppering her conversation with wry observations about her peers. She has a tendency to lean into sarcasm when addressing social faux pas, which she views as an opportunity to assert her superiority.",
    "internalConflict": "Eleanor's ambition clashes with her compassion for the victim, leading her to question whether her desire for social elevation is worth the potential harm to others.",
    "personalStakeInCase": "This crime strikes at the very heart of her social aspirations, forcing Eleanor to confront the lengths she is willing to go to protect her family's reputation.",
    "paragraphs": [
      "Eleanor Voss glided through the garden like a shimmering apparition, her laughter ringing out amidst the clinking of glasses and the rustling of silk. To the guests of Little Middleton's elite, she was a beacon of charm and sophistication, a woman who knew how to turn a gathering into an event. But beneath the surface of her polished persona lay a tempest of worry, each smile carefully crafted to mask the gnawing anxiety of her family's dwindling fortune. The whispers of financial ruin were a constant presence, lurking in the shadows of her opulent soirées.",
      "As she exchanged pleasantries with her guests, Eleanor's gaze often drifted toward the figure of the victim, a woman whose influence in their social circle was both revered and feared. The recent murder had sent shockwaves through their tight-knit community, and Eleanor could not shake the feeling that the victim's demise might somehow derail her carefully laid plans for her daughter's future. The stakes had never felt so high, and the thought of losing any semblance of control over her family's legacy sent her heart racing.",
      "In the quiet moments between conversations, Eleanor found herself grappling with a moral dilemma that threatened to unravel her ambitions. She recalled the victim's moments of kindness, the laughter they had shared over tea, and the secrets they had exchanged. The conflict within Eleanor was palpable: could she truly stand by and allow her desire for social elevation to overshadow the humanity she once shared with the victim? It was a question that haunted her as she prepared to navigate the murky waters of this investigation.",
      "The clock was ticking, and Eleanor knew she must act quickly. She needed answers, not only for her peace of mind but to safeguard her daughter's future. As she stepped into the role of amateur sleuth, Eleanor felt the weight of her family's legacy resting heavily on her shoulders. With each revelation, she would be forced to confront not only the mystery of the murder but also the very essence of her own ambitions. Would she emerge from this ordeal with her social standing intact, or would the truth shatter the delicate facade she had worked so hard to maintain?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose charm and intellect mask a long-suppressed infatuation with the victim, complicating his professional demeanor.",
    "publicPersona": "Widely regarded for his progressive medical views and unwavering dedication to charity, Dr. Finch is a pillar of the community. His calm demeanor and articulate speech often leave patients feeling reassured, and he has cultivated a reputation as the go-to doctor for the well-to-do.",
    "privateSecret": "Beneath his composed exterior lies a tumultuous history of unrequited love for the victim. Years of suppressing these feelings have left him conflicted, and he now finds himself in a precarious position as the investigation unfolds.",
    "motiveSeed": "The emergence of the victim's new romantic interest has ignited a simmering jealousy within Dr. Finch, leaving him fearful of losing both his professional reputation and the loyalty of his patients.",
    "motiveStrength": "weak",
    "alibiWindow": "Dr. Finch asserts he was attending a medical conference from six to midnight, a claim that could be corroborated by colleagues.",
    "accessPlausibility": "While his alibi is solid, Dr. Finch's past interactions with the victim grant him access to her life, making him a potential suspect despite his claims of innocence.",
    "stakes": "His primary concern is the potential fallout from revealing his feelings, which could jeopardize not only his career but also his standing in the community.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Dr. Finch speaks with a measured cadence, often employing medical jargon that he softens with a dry sense of humor. He has a habit of raising an eyebrow when making a particularly astute observation, lending an air of intellectuality to his dialogue.",
    "internalConflict": "Dr. Finch is torn between the love he feels for the victim and the professional boundaries he must maintain, leading to a deep sense of internal strife as he navigates the investigation.",
    "personalStakeInCase": "The murder of the victim forces Dr. Finch to confront his long-buried feelings and the implications they hold for his professional integrity, as well as the fear of being exposed.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the lectern, his voice steady as he addressed a room full of eager medical minds. The conference was a welcome distraction from the chaos that had unfolded in Little Middleton. He spoke of progressive medical practices and the importance of empathy in patient care, his words laced with a conviction that earned him the respect of his peers. Yet, as he spoke, his mind wandered to the victim, a woman who had once been the light in his otherwise disciplined existence. The memories of their shared laughter and fleeting glances haunted him like a specter.",
      "It was a cruel twist of fate that the very woman who had captivated his heart was now at the center of a scandal that could tarnish his reputation. The revelation of her new romantic interest had stirred a jealousy within him that he had long suppressed. Dr. Finch prided himself on his professionalism, yet the thought of losing the victim to another man gnawed at him, threatening to unravel the carefully constructed facade he had built around his feelings.",
      "As he returned to his practice, Dr. Finch found himself grappling with the delicate balance between personal desire and professional duty. He could not shake the feeling that he was being drawn into a web of intrigue that would force him to confront his past. The investigation into the murder was not just a matter of community safety; it was a reckoning of sorts, a chance for him to either confront his feelings or bury them deeper in the recesses of his mind.",
      "With each passing day, the stakes grew higher. Dr. Finch knew that if his feelings were ever revealed, it could spell disaster for his career. The thought of scandal loomed over him like a dark cloud, and he found himself caught in a tempest of emotions that threatened to engulf him. As he navigated the intricacies of the case, he realized that he would have to confront not only the truth behind the murder but also the unfulfilled desires that had shaped his life for far too long."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer whose unwavering loyalty masks a simmering resentment towards the victim for past betrayals.",
    "publicPersona": "A gentleman of the highest regard, Captain Hale commands respect in Little Middleton. His past as a naval officer lends him an air of authority and honor, making him a trusted figure in the community.",
    "privateSecret": "Beneath the surface of his dignified exterior lies a deep-seated resentment towards the victim, stemming from past betrayals that have left scars on his pride and honor.",
    "motiveSeed": "Captain Hale believes the victim has manipulated others against him, fueling a desire for personal retribution that he has kept buried for years.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claims to have been strolling the estate grounds from seven to nine, a time that provides him ample opportunity to confront the victim.",
    "accessPlausibility": "As a long-time resident of the estate, Captain Hale had easy access to the victim, making his alibi both plausible and suspicious.",
    "stakes": "The tarnishing of his honor and legacy weighs heavily on him, as he fears that the victim's influence may continue to undermine his standing in the community.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a commanding presence, often punctuating his sentences with a self-deprecating remark that reveals his vulnerability. His speech is punctuated by a certain gravitas, yet he occasionally allows a wry smile to escape at his own expense.",
    "internalConflict": "Captain Hale struggles with the morality of vengeance, torn between his desire for retribution and the values he upheld during his naval career.",
    "personalStakeInCase": "The murder of the victim forces Captain Hale to confront the shadows of his past, as he must navigate the complex emotions tied to honor, betrayal, and the quest for redemption.",
    "paragraphs": [
      "Captain Ivor Hale surveyed the estate grounds with a practiced eye, the remnants of his naval training evident in his posture and demeanor. He had always commanded respect, a trait that had served him well both in the line of duty and in his current life as a retired officer. The whispers of the murder had spread like wildfire, and as he considered the implications, he felt the stirrings of resentment that had long lain dormant within him. The victim, a woman he had once trusted, had betrayed him in ways that still stung, and now, her untimely death had rekindled old wounds.",
      "As he strolled through the gardens, Captain Hale's thoughts turned to the past, to the betrayals that had driven a wedge between him and the victim. He had always believed in loyalty and honor, principles that had guided him through years of service. Yet here he stood, grappling with a desire for retribution that felt foreign to him. The victim had managed to manipulate others against him, and the thought of her influence lingering even after death fueled his anger. It was an internal conflict that gnawed at him as he weighed his options.",
      "In the wake of the murder, Captain Hale found himself at a crossroads. The investigation would force him to confront not only the truth surrounding the victim's death but also the shadows of his own past. He had always prided himself on his integrity, yet the desire for vengeance threatened to cloud his judgment. What would it mean for a man of honor to seek retribution? The question loomed large as he navigated the complexities of the case, each revelation pulling him deeper into a moral quagmire.",
      "As the investigation unfolded, Captain Hale realized that the stakes were higher than he had anticipated. The specter of his past loomed over him, challenging his sense of self and the values he had lived by. The murder of the victim was not just a crime; it was a reckoning of sorts, a chance for him to either reclaim his honor or succumb to the darkness that threatened to consume him. With each passing day, he felt the weight of his choices bear down on him, and he knew that the path ahead would demand both courage and introspection."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a spirited housemaid whose rebellious nature often lands her in trouble, complicating her feelings towards the victim and her unrequited love for Captain Hale.",
    "publicPersona": "Known for her outspoken nature, Beatrice is often seen as a troublemaker among the staff, unafraid to voice her opinions and challenge authority when the mood strikes her.",
    "privateSecret": "Beneath her defiant exterior lies a secret love for Captain Hale, which complicates her view of the victim and her motivations in the unfolding drama.",
    "motiveSeed": "After a public confrontation with the victim left her feeling humiliated, Beatrice's resentment simmered, clouding her judgment and complicating her emotions.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice claims she was cleaning the attic from eight to ten, a time when she was ostensibly out of sight.",
    "accessPlausibility": "As a housemaid, her access to the estate was routine, but her presence in the victim's life was often overshadowed by the social dynamics at play.",
    "stakes": "Beatrice craves respect from her peers and the attention of Captain Hale, making her actions driven by a desire to assert herself in a world that often overlooks her.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a quick wit and a sharp tongue, her sentences often laced with sarcasm. She employs a casual, almost irreverent tone, and is known for her tendency to turn a phrase on its head when she feels particularly indignant.",
    "internalConflict": "Beatrice's feelings for Captain Hale clash with her disdain for the victim, creating a tumultuous internal struggle as she navigates her emotions and ambitions.",
    "personalStakeInCase": "The murder of the victim thrusts Beatrice into a position where she must confront her own feelings of inadequacy and the desire for recognition in a world that often dismisses her.",
    "paragraphs": [
      "Beatrice Quill stood in the attic, surrounded by dust and memories, her hands busily scrubbing away the remnants of a life she felt increasingly distant from. As the housemaid of the grand estate, she was often overlooked, her contributions dismissed in favor of the more glamorous lives of her employers. Yet, there was a fire within her, a rebellious spirit that refused to be silenced. Her sharp tongue and quick wit often landed her in trouble, but they also provided a thrill that made her feel alive. Today, however, her mind was elsewhere, consumed by thoughts of the victim and the public confrontation that had left her humiliated.",
      "The memory of that encounter stung like a fresh wound, and Beatrice couldn't shake the feeling that her pride had been trampled. The victim, with her polished charm and effortless grace, had overshadowed Beatrice at every turn, and the resentment that had brewed within her was hard to contain. Yet, in the midst of her anger, there was a flicker of something more complicated: an undeniable attraction to Captain Hale, the very man who had been the source of her daydreams. The juxtaposition of her feelings left her feeling conflicted, as she navigated the thin line between admiration and contempt.",
      "As she scrubbed the floor, Beatrice's thoughts turned to the murder investigation that had gripped the estate. The victim's death had sent shockwaves through the household, and for Beatrice, it was an opportunity to step out of the shadows and assert herself. She was tired of being seen as merely a housemaid; she wanted to be respected, to be heard. The thought of her unrequited feelings for Captain Hale added another layer of complexity to her desire for recognition. Would he ever see her for more than just the help, or would she remain forever trapped in the attic of their lives?",
      "With each passing day, Beatrice found herself drawn deeper into the investigation, her rebellious spirit igniting a determination to uncover the truth. The stakes were personal, and as she navigated the tangled web of emotions surrounding the murder, she realized that this was her chance to redefine herself. No longer would she be a mere spectator in the lives of those around her; she would seize the opportunity to carve out her place in a world that had often overlooked her. As the mystery unraveled, Beatrice felt the stirrings of a new resolve, one that would force her to confront both her feelings for Captain Hale and the complexities of her own identity."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Little Middleton Manor",
    "type": "Country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Little Middleton Manor stands as a relic of grandeur, its sprawling grounds and formal gardens shrouded in an air of mystery and suspicion.",
    "visualDescription": "The manor, built of dark stone with ivy creeping up its walls, looms against a backdrop of overcast skies. Its tall windows, framed by heavy drapes, reflect the dim light of the day, while the manicured hedges of the gardens create a sense of isolation within the estate.",
    "atmosphere": "The atmosphere is tense, with a palpable undercurrent of suspicion that runs through the gathering of guests, each one hiding secrets.",
    "paragraphs": [
      "Little Middleton Manor, an imposing edifice of dark stone and intricate gables, commands attention as it rises from the misty ground like a sentinel of the past. The formal gardens, with their meticulously trimmed hedges and ornamental fountains, offer a deceptive beauty; beneath their allure lies a labyrinth of secrets waiting to be uncovered. The air is thick with the scent of damp earth and decaying leaves, a reminder of the autumn rains that come and go, leaving a chill that seeps into the bones. As guests arrive, their whispers mingle with the rustle of leaves, each conversation laced with suspicion, each glance a veiled inquiry into the others’ intentions.",
      "Inside, the grand hall greets visitors with a polished oak staircase that spirals up into shadows, leading to the upper floors where light barely reaches. Gas lamps flicker, casting elongated shadows that dance across the walls adorned with ancestral portraits, their eyes seeming to follow every movement. The distant sound of rain pattering against the window panes is a constant reminder of the world outside, while the ticking of the large grandfather clock in the corner echoes the slow passage of time, amplifying the tension that hangs thick in the air. The guests, gathered for a weekend of leisure, find themselves ensnared in a web of intrigue, their laughter tinged with unease as they navigate the hidden depths of the manor.",
      "As night falls, the manor transforms, the flickering candlelight casting an intimate but foreboding glow upon the drawing room where guests gather. The rich smell of tobacco mingles with the faint aroma of beeswax from polished surfaces, creating a comforting yet oppressive atmosphere. Outside, the wind whispers through the trees, a subtle reminder of the isolation that surrounds the estate. Conversations grow quieter, glances more furtive, as all are acutely aware that something is amiss. In this opulent setting, the veneer of civility begins to crack, revealing the darker truths that lie beneath the surface, waiting to be unearthed by the sharp eyes of an astute investigator."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "overcast with intermittent rain, typical of early autumn",
    "timeFlow": "Three days of mounting tension, each hour thickening the air with dread and uncertainty.",
    "mood": "tension-filled, with an undercurrent of suspicion among guests",
    "eraMarkers": [
      "Petrol touring cars parked in the gravel driveway, hinting at the wealth of the guests.",
      "Early telephones in the drawing room, their cords snaking elegantly across the polished surfaces.",
      "Typewriters clacking in the study, a stark reminder of the work that continues despite the unfolding mystery."
    ],
    "sensoryPalette": {
      "dominant": "The pervasive scent of damp earth and decaying leaves from the gardens.",
      "secondary": [
        "The flickering warmth of candle wax as it melts under the dim light.",
        "The sharp tang of tobacco smoke curling through the air."
      ]
    },
    "paragraphs": [
      "The atmosphere of Little Middleton Manor is thick with unspoken words and hidden agendas, as the overcast sky mirrors the inner turmoil of its guests. As the rain intermittently taps against the windows, it serves as a metronome for the rising tension, each drop a reminder of the secrets lurking within the walls. The air is suffused with the smell of dampness, which clings to the fabric of their clothing and mingles with the faintest hint of mildew that whispers of long-forgotten corners of the estate.",
      "Within this grand setting, the mood is perpetually uneasy, as shadows stretch and flicker in the corners of the rooms, hinting at the presence of the unseen. Conversations turn to hushed tones, laughter is forced, and the weight of suspicion hangs heavy, like the clouds that threaten more rain. Guests exchange glances, each trying to decipher the other's motives, while the clock ticks steadily on, reminding them that time is a luxury they may not have."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a cavernous room lined with dark oak bookcases filled with leather-bound volumes, their spines cracked and dust-covered. A large, ornate fireplace dominates one wall, its mantle adorned with family portraits that seem to watch over the room.",
      "sensoryDetails": {
        "sights": [
          "The flickering light from the fireplace casts ominous shadows across the room, illuminating the dust motes that float lazily in the air.",
          "Heavy velvet drapes frame tall windows, their edges frayed, allowing only the faintest light to filter through, creating a somber ambiance."
        ],
        "sounds": [
          "The crackling of the fire is punctuated by the soft rustle of pages turning, an eerie reminder of the secrets held within the books.",
          "Occasionally, the distant sound of thunder rumbles outside, echoing the tension that has enveloped the manor."
        ],
        "smells": [
          "The musty odor of aged paper and leather fills the air, mingling with the faint scent of smoke from the fireplace.",
          "A hint of dampness lingers, a reminder of the rain-soaked grounds just outside the windows."
        ],
        "tactile": [
          "The coolness of the marble floor contrasts sharply with the warmth radiating from the fireplace, creating a disconcerting sensation as one moves through the space.",
          "The rough texture of the leather-bound books adds an element of antiquity, each one a potential vessel for hidden truths."
        ]
      },
      "accessControl": "The library remains locked during the day, accessible only to the household staff for dusting; guests are allowed entry only during scheduled evening gatherings.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the windows, distorting the view of the gardens outside.",
            "The low light casts a gloomy pall over the room, making the shadows seem deeper."
          ],
          "sounds": [
            "The steady drumming of rain against the roof creates a rhythmic backdrop, enhancing the sense of isolation.",
            "Occasional thunder rumbles, shaking the very foundations of the manor."
          ],
          "smells": [
            "The dampness of the air is palpable, mixed with the earthy scent of wet soil from the gardens.",
            "A faint whiff of mildew from the books adds to the oppressive atmosphere."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat, grey light filters through the heavy drapes, casting a muted glow over the room.",
            "Shadows creep across the floor, giving the impression that the room itself is alive."
          ],
          "sounds": [
            "The silence is occasionally broken by the creak of the old wooden shelves under the weight of the books.",
            "Distant footsteps echo from the hallway, amplifying the sense of being watched."
          ],
          "smells": [
            "The scent of old wood mingles with the faint aroma of polished furniture, evoking a sense of nostalgia.",
            "A lingering hint of burnt wood from the fireplace adds an unsettling edge."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the walls, creating a warm yet eerie glow that dances in rhythm with the flames.",
            "The rich colors of the room become more pronounced under the soft light, revealing the intricate details of the decor."
          ],
          "sounds": [
            "The ticking of a clock in the corner grows louder as the room quiets, each tick a reminder of time slipping away.",
            "Muffled voices from the drawing room filter in, heightening the tension of the moment."
          ],
          "smells": [
            "The scent of burning candles mixes with the rich aroma of tobacco, creating an inviting yet tense atmosphere.",
            "A hint of cold ash from the fireplace lingers in the air, a reminder of the warmth that once filled the room."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary for the manor's secrets, stands in stark contrast to the chaos that unfolds around it. Dark oak shelves groan under the weight of history, while the warm glow of the fireplace offers a deceptive sense of comfort. Here, amidst the leather-bound tomes and the flickering shadows, lies the heart of the mystery — a place where every book could harbor a clue and every shadow could conceal a motive. As the storm rages outside, the room feels increasingly claustrophobic, the walls closing in as whispers of betrayal echo through the air.",
        "In the dim light, the library transforms into a stage for the unfolding drama, each guest a player in a game of deception. The air is thick with tension, the scent of old books mingling with the anticipation of revelations yet to come. It is within these walls that the truth will either be unearthed or buried forever, the fate of the manor's inhabitants hanging in the balance, as the clock ticks ever onward, counting down to the moment of revelation."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room boasts opulent furnishings, with plush sofas arranged around a grand piano, its polished surface reflecting the flickering light from the gas sconces. Ornate mirrors line the walls, creating an illusion of space while capturing the muted colors of the decor.",
      "sensoryDetails": {
        "sights": [
          "Rich tapestries hang from the walls, their intricate designs telling stories of the manor's history, while the heavy drapes frame the windows, blocking out the dreary light of the outside world.",
          "The gleam of polished silverware on the sideboard catches the eye, hinting at the lavish gatherings that often take place here."
        ],
        "sounds": [
          "The gentle hum of conversation fills the air, punctuated by the occasional laughter that feels forced, as if the guests are trying to maintain appearances.",
          "The soft notes of a piano being played in the corner add a layer of elegance, yet the music feels strained, echoing the tension in the room."
        ],
        "smells": [
          "The aroma of fresh flowers in a vase mingles with the scent of polished wood, creating an inviting yet suffocating atmosphere.",
          "Hints of perfume linger in the air, mixing with the faint odor of smoke from the fireplace, evoking a sense of nostalgia."
        ],
        "tactile": [
          "The plush upholstery of the sofas invites guests to sink in, yet the tension in the air makes it difficult to relax fully.",
          "The coolness of the marble fireplace surround contrasts with the warmth from the burning logs, creating an unsettling duality."
        ]
      },
      "accessControl": "The drawing room is open to guests during the evenings, but is typically closed off during the day for cleaning and maintenance by the staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the windowpanes, creating a blurred view of the gardens outside, while the room remains shrouded in shadow.",
            "The dim light enhances the rich colors of the tapestries, giving them an almost surreal quality."
          ],
          "sounds": [
            "The rhythmic sound of rain tapping against the windows provides a constant backdrop, muffling the outside world.",
            "Occasional thunder rumbles in the distance, a reminder of the storm's presence."
          ],
          "smells": [
            "The scent of dampness seeps into the room, mingling with the floral notes of the fresh arrangements.",
            "A hint of smoke from the fireplace adds a layer of warmth, contrasting with the chill in the air."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is flat and grey, casting a muted glow over the room that dulls the vibrancy of the decor.",
            "Shadows deepen in the corners, creating an atmosphere that feels both intimate and claustrophobic."
          ],
          "sounds": [
            "The silence is punctuated by the soft rustle of fabric as guests shift nervously in their seats.",
            "Distant laughter from the library feels jarring against the otherwise quiet backdrop."
          ],
          "smells": [
            "The air carries the scent of old wood, mingled with the faintest hint of mildew, suggesting the room has not been fully aired out in some time.",
            "The richness of the flowers seems to fade, replaced by a more stagnant aroma."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers across the room, illuminating the fine details of the furnishings and casting playful shadows that dance on the walls.",
            "The atmosphere is charged, with guests dressed in their finest attire, yet the air feels thick with tension."
          ],
          "sounds": [
            "The sound of clinking glasses fills the air as drinks are poured, yet the laughter feels strained and hollow.",
            "The distant notes of the piano seem to echo the unease in the room, creating a soundtrack of tension."
          ],
          "smells": [
            "The rich scent of polished wood and fresh flowers mingles with the more pungent aroma of tobacco smoke, creating a heady mix.",
            "A whiff of burnt wood from the fireplace adds a sense of warmth that contrasts sharply with the coolness of the evening air."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the heart of social gatherings at Little Middleton Manor, its opulent furnishings inviting guests to relax, yet the atmosphere is anything but serene. Rich tapestries and elegant mirrors reflect the tension that simmers just beneath the surface, as whispers of suspicion fill the air. Each guest, adorned in their finest attire, navigates the space with a sense of unease, their laughter tinged with the weight of hidden agendas. The flicker of candlelight casts a warm glow that belies the coldness of the truths that remain unspoken.",
        "As the evening unfolds, the drawing room becomes a stage for the unfolding drama, the guests' interactions laced with double meanings and veiled threats. The music from the piano, once a source of joy, now feels like an elegy for the innocence lost in the face of the mystery that envelops them. With each passing moment, the tension thickens, as each character becomes more acutely aware that they are not just players in a game, but potential suspects in a conspiracy that could unravel them all."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Gathering space for staff",
      "visualDetails": "The servants' hall is a utilitarian space, with simple wooden tables and chairs, a large communal fireplace, and shelves lined with household supplies. The walls are adorned with practical notices and schedules, reflecting the regimented life of the staff.",
      "sensoryDetails": {
        "sights": [
          "Faded wallpaper peels slightly at the edges, revealing the bare wood beneath, while a large clock on the wall ticks steadily, a reminder of the duties that bind the staff.",
          "A large pot of stew simmers on the hearth, steam rising and creating a warm haze in the otherwise austere room."
        ],
        "sounds": [
          "The clatter of dishes being washed echoes in the background, interspersed with the quiet conversations of the staff as they share whispers and gossip.",
          "The crackle of the fire provides a comforting backdrop, yet it is punctuated by the occasional shout from the upper floors, reminding everyone of the divisions between classes."
        ],
        "smells": [
          "The hearty aroma of stew fills the air, mingling with the scent of wood smoke from the fireplace, creating a warm, inviting atmosphere.",
          "A hint of dampness lingers, a reminder of the manor's age and the rain-soaked grounds outside."
        ],
        "tactile": [
          "The rough texture of the wooden tables and chairs contrasts with the soft warmth of the fire, creating a sense of comfort amidst the harsh realities of their work.",
          "The coolness of the stone floor beneath their feet serves as a reminder of the divide between the staff's quarters and the opulence of the upper floors."
        ]
      },
      "accessControl": "The servants' hall is accessible to all staff members at any time, but is off-limits to guests unless they are invited for specific discussions.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the windows, distorting the view of the gardens and creating a gloomy atmosphere within.",
            "The dim light casts elongated shadows across the worn wooden tables, enhancing the sense of isolation."
          ],
          "sounds": [
            "The steady patter of rain against the roof creates a rhythmic sound that blends with the quiet murmurs of the staff.",
            "Occasional thunder rumbles in the distance, a reminder of the storm's presence outside."
          ],
          "smells": [
            "The scent of damp earth filters in through the cracks in the windows, mingling with the aromatic stew simmering on the hearth.",
            "A hint of mildew clings to the corners of the room, a testament to the manor's age."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is flat and grey, casting a dull sheen over the room, while the shadows deepen in the corners.",
            "The clock on the wall ticks loudly, each second echoing in the silence."
          ],
          "sounds": [
            "The quiet clatter of utensils and the soft whispers of the staff create a sense of intimacy, yet the tension is palpable.",
            "Distant voices from the upper floors occasionally break the silence, reminding them of their place in the hierarchy."
          ],
          "smells": [
            "The aroma of stew is more pronounced, filling the room with a comforting scent that stands in stark contrast to the chill in the air.",
            "A faint whiff of wood smoke mingles with the dampness, creating a unique blend of scents."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of the fire illuminates the room, creating a cozy atmosphere that feels inviting yet secretive.",
            "The flickering shadows dance along the walls, enhancing the sense of camaraderie among the staff."
          ],
          "sounds": [
            "Laughter and chatter fill the air as staff members unwind after a long day, yet the sound of a distant argument from the upper floors serves as a reminder of the tensions that exist.",
            "The crackling of the fire provides a comforting backdrop, yet it is tinged with an undercurrent of anxiety."
          ],
          "smells": [
            "The rich aroma of stew blends with the scent of burning logs, creating a sense of warmth and home.",
            "A hint of tobacco smoke lingers from the staff's occasional indulgences, adding a layer of complexity to the air."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The servants' hall, a stark contrast to the opulence of the upper floors, serves as a refuge for the staff, where they can gather and share their thoughts away from the prying eyes of the guests. The simple furnishings and communal fireplace create a warm yet austere atmosphere, where laughter and whispers of gossip intertwine with the aroma of hearty stew simmering on the hearth. Amidst the chatter, an undercurrent of tension runs deep, as the staff navigates their roles in the unfolding drama, each one acutely aware of the power dynamics at play within the manor.",
        "As evening descends, the hall becomes a sanctuary for secrets, where the staff exchange knowing glances and hushed conversations about the guests and the strange occurrences that have unfolded. The flickering firelight casts shadows across their faces, illuminating the worry and suspicion that have taken root. Each member of the staff holds a piece of the puzzle, their loyalties tested as they contemplate their place within the manor's intricate web of intrigue. In this space, the divide between classes is palpable, each laugh tinged with the weight of unspoken truths and hidden agendas."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028106066999999996,
  "durationMs": 39461
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1930,
    "month": "March",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "March",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "cool winds"
    ],
    "daylight": "Days are gradually lengthening, with daylight extending into the evening, and the sun setting around 6:30 PM.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when shadows deepen and the house creaks with secrets.",
    "holidays": [
      "St. Patrick's Day (March 17)"
    ],
    "seasonalActivities": [
      "spring cleaning in homes",
      "visiting local gardens as flowers bloom",
      "attending early spring fairs"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool suits",
        "crisp white dress shirts",
        "bow ties or narrow ties"
      ],
      "casual": [
        "tweed jackets",
        "knitted vests",
        "corduroy trousers"
      ],
      "accessories": [
        "felt hats",
        "pocket watches",
        "cane umbrellas"
      ]
    },
    "womensWear": {
      "formal": [
        "satin evening gowns with dropped waistlines",
        "embroidered shawls",
        "cloche hats"
      ],
      "casual": [
        "printed tea dresses",
        "cardigans",
        "ankle-length skirts"
      ],
      "accessories": [
        "beaded handbags",
        "long gloves",
        "pearls"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco design elements",
      "influence of Hollywood glamour",
      "growing popularity of jazz music"
    ],
    "socialExpectations": [
      "men are expected to show restraint and control",
      "women are increasingly entering the workforce",
      "class distinctions remain prominent"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "economic pressures from the Great Depression",
      "debate over unemployment relief measures in Parliament",
      "increasing interest in fascist movements across Europe"
    ],
    "politicalClimate": "The political atmosphere is tense, with economic strife leading to heightened discussions around class struggles and the rise of radical ideologies.",
    "economicConditions": "Many families are facing financial hardship; unemployment rates are high, and luxury goods are becoming increasingly out of reach for the average citizen.",
    "socialIssues": [
      "rising unemployment",
      "class divide becoming more pronounced",
      "growing concern over political extremism"
    ],
    "internationalNews": [
      "tensions in Germany as Hitler rises to power",
      "conflicts in China with the ongoing civil war",
      "strikes in various industries across Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Ain't She Sweet' by Milton Ager",
        "'My Heart Stood Still' by Richard Rodgers",
        "'The Birth of the Blues' by Ray Henderson"
      ],
      "films": [
        "'The Love Parade'",
        "'The Big House'",
        "'The Singing Fool'"
      ],
      "theater": [
        "'The Front Page'",
        "'The Royal Family'",
        "'The Cat and the Fiddle'"
      ],
      "radio": [
        "'Amos 'n' Andy'",
        "news broadcasts on the economic situation",
        "various jazz music programs"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Great Gatsby' by F. Scott Fitzgerald"
      ],
      "popularGenres": [
        "mystery",
        "social commentary",
        "romantic fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "electric refrigerators becoming common",
        "early models of home radios",
        "advancements in automotive technology"
      ],
      "commonDevices": [
        "typewriters in offices",
        "telephones in homes",
        "petrol cars for travel"
      ],
      "emergingTrends": [
        "increased use of radio for entertainment",
        "growing availability of household appliances",
        "adoption of modernist designs in home decor"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Pair of shoes: ten shillings"
      ],
      "commonActivities": [
        "attending local fairs and markets",
        "evening gatherings for bridge or whist",
        "visiting tea rooms for socializing"
      ],
      "socialRituals": [
        "afternoon tea gatherings",
        "community church services on Sundays"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "upper class retains privileges despite economic strain",
      "working class faces increasing desperation"
    ],
    "gender": [
      "women are beginning to assert independence",
      "traditional gender roles are increasingly questioned",
      "men are expected to be providers"
    ],
    "race": [
      "racial tensions remain, with limited rights for minorities",
      "emerging discussions on equality and inclusion"
    ],
    "generalNorms": [
      "conservatism prevails in social settings",
      "discussions of politics often avoided in polite company",
      "community loyalty remains strong despite class divisions"
    ]
  },
  "atmosphericDetails": [
    "The air carries the fresh scent of rain mixed with the earthy aroma of awakening soil.",
    "Inside the estate, whispers echo against the walls, and the flickering candlelight casts long shadows across the polished wood floors.",
    "Outside, the early spring blooms struggle to emerge, symbolizing hope amid the pervasive gloom of a world grappling with uncertainty."
  ],
  "paragraphs": [
    "In March 1930, the world is slowly shaking off the remnants of winter, though the air remains cool and damp, a typical early spring in the English countryside. Overcast skies loom overhead, and intermittent showers patter softly on the estate windows, creating a tense atmosphere within the grand country house. Guests, gathered for a weekend of leisure and camaraderie, find themselves enveloped in a sense of foreboding, as discussions turn to the economic strains of the Great Depression and the unsettling political climate sweeping across Europe. With St. Patrick's Day just around the corner, the estate staff prepares for an evening of celebration, unaware of the dark events that will soon unfold among the guests.",
    "Fashion during this time reflects both elegance and practicality. Men don tailored wool suits, often accompanied by crisp dress shirts and bow ties, while casual wear includes tweed jackets and knitted vests, perfect for the unpredictable weather. Women, on the other hand, embrace the trend of dropping waistlines in their satin evening gowns and cloche hats, accessorized with pearls and beaded handbags. The Art Deco influence permeates their attire, echoing the glamorous films of the day. As the guests navigate the social rituals of afternoon tea and evening card games, the tension is palpable, and the sharpness of their attire contrasts with the somber discussions about the state of the world.",
    "Daily life is marked by the struggles of the Great Depression, with families counting every penny. A loaf of bread costs four pence, and a cinema ticket is a shilling—luxuries increasingly out of reach for many. Social expectations dictate that men should be the providers, while women begin to find their voices in the workforce. Yet, within the confines of the estate, societal norms prevail, and discussions on class and race are often avoided in polite company. As the evening shadows lengthen and the gathering grows more intimate, the guests remain blissfully unaware of the undercurrents of suspicion and betrayal that will soon envelop them, transforming their weekend retreat into a scene of mystery and intrigue."
  ],
  "note": "",
  "cost": 0.0010803408,
  "durationMs": 12747
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the estate for a wealthy heir's reading of the will intensifies class tensions and suspicions amidst the economic strain of the Great Depression.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class divisions are pronounced, with estate owners and their staff navigating rising tensions and economic hardship, while political discussions are influenced by the threat of fascism."
  },
  "setting": {
    "location": "A large manor house set within expansive grounds, featuring formal gardens and a walled perimeter.",
    "institution": "Country house estate",
    "weather": "overcast with intermittent rain, typical of early autumn"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "Golden Age country-house murder driven by a mechanical clock-tampering method."
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
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The mechanism relies on the clock's minute hand and stoppage to expose the false timing.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This reveals how the clock's condition can mislead the timeline of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "Witnesses saw Eleanor alive after the clock stopped.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This contradicts the assumption that Eleanor died before a quarter past eleven.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was confirmed to be with Captain Hale until eleven fifteen.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This corroborates that Dr. Mallory Finch could not have committed the murder at the time of death.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "behavioral",
      "description": "Eleanor was seen arguing about money days before her death.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This suggests a motive related to financial desperation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "testimonial",
      "description": "A neighbor heard an argument just before eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "This could involve Eleanor and any of the suspects, hinting at tension.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "spatial",
      "description": "The ashes in the fireplace suggest a recent fire.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This indicates activity in the house shortly before the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "Multiple witnesses confirm that the clock chimed at eleven.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This indicates that the clock was functioning at that time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "behavioral",
      "description": "Eleanor Voss was seen near the clock just before it stopped.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "This links Eleanor Voss directly to the mechanism of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was at the market during the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This confirms Beatrice Quill's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "The clock was found stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This raises questions about the timing of Eleanor's death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "behavioral",
      "description": "Eleanor Voss had been seen acting nervously in the days leading up to her death.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This could indicate her state of mind and possible motive.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "spatial",
      "description": "The fire in the fireplace was still smoldering when the body was discovered.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "This suggests that the fire was lit shortly before the discovery.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was seen shopping at the market during the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This corroborates her alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_11",
      "category": "temporal",
      "description": "The argument between Eleanor and another suspect was heard by a neighbor just before eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "This indicates a potential motive and opportunity.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "category": "temporal",
      "description": "Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "category": "temporal",
      "description": "Witnesses saw Eleanor alive after the clock stopped.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This contradicts the assumption that Eleanor died before a quarter past eleven.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Multiple witnesses confirm that the clock chimed at eleven.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This indicates that the clock was functioning at that time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Quarter past eleven remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_1_2",
      "category": "temporal",
      "description": "The clock was found stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This suggests a deliberate tampering to mislead about the time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_fp_contradiction_step_3_2",
      "category": "temporal",
      "description": "Multiple witnesses confirm that the clock chimed at eleven.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This indicates that the tampering led to a false timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Some believe that the clock's malfunction was due to a power surge.",
      "supportsAssumption": "Eleanor must have died before her last seen time of a quarter past eleven.",
      "misdirection": "This distracts from the evidence that Eleanor was alive after the clock stopped."
    },
    {
      "id": "rh_2",
      "description": "Dr. Mallory Finch was seen leaving the vicinity shortly after the clock stopped.",
      "supportsAssumption": "Eleanor must have died before her last seen time of a quarter past eleven.",
      "misdirection": "This does not consider his confirmed alibi with Captain Hale."
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
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_1",
      "clue_3",
      "clue_7",
      "clue_culprit_direct_eleanor_voss",
      "clue_fp_contradiction_step_1",
      "clue_fp_contradiction_step_1_2"
    ],
    "mid": [
      "clue_core_elimination_chain",
      "clue_2",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_11",
      "clue_fp_contradiction_step_3",
      "clue_fp_contradiction_step_3_2"
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
  "latencyMs": 18749,
  "cost": 0.0048331173
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

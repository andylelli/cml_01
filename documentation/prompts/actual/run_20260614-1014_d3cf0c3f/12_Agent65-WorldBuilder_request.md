# Actual Prompt Record

- Run ID: `run_d3cf0c3f-048e-46f1-b840-a17f801b614d`
- Project ID: `proj_6e502e7d-ce5e-4cff-9f8d-9ded9f2105dc`
- Timestamp: `2026-06-14T10:17:24.512Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `e11efec1ebbca74d`

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
    "title": "The Timed Deception",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton, Yorkshire",
      "place": "Hadley Manor",
      "country": "England",
      "institution": "Manor house"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "unknown"
    }
  },
  "cast": [
    {
      "name": "Hugh Hadley",
      "age_range": "40-50",
      "role_archetype": "wealthy host",
      "relationships": [],
      "public_persona": "Charming and gracious host",
      "private_secret": "Financial troubles due to the Great Depression",
      "motive_seed": "Desire to maintain family legacy",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "manor access",
        "garden paths"
      ],
      "behavioral_tells": [
        "nervous laughter",
        "excessive hospitality"
      ],
      "stakes": "Maintaining reputation",
      "evidence_sensitivity": [
        "financial records",
        "guest statements"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Brenda Marlow",
      "age_range": "30-40",
      "role_archetype": "lady of the house",
      "relationships": [
        "friend of the victim"
      ],
      "public_persona": "Diligent and caring",
      "private_secret": "Unrequited love for Hugh",
      "motive_seed": "Desire for Hugh's affection",
      "motive_strength": "high",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "kitchen access",
        "service routes"
      ],
      "behavioral_tells": [
        "glances at Hugh",
        "fidgeting"
      ],
      "stakes": "Emotional fulfillment",
      "evidence_sensitivity": [
        "dinner arrangements",
        "servant testimonies"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Mary Selby",
      "age_range": "20-30",
      "role_archetype": "servant",
      "relationships": [
        "works for the Hadley family"
      ],
      "public_persona": "Obedient and quiet",
      "private_secret": "Knows more than she lets on",
      "motive_seed": "Protective of her job",
      "motive_strength": "low",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "staff quarters",
        "kitchen"
      ],
      "behavioral_tells": [
        "avoids eye contact",
        "overly helpful"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [
        "staff schedules",
        "cleaning logs"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Trevor Cheyne",
      "age_range": "30-40",
      "role_archetype": "guest",
      "relationships": [
        "friend of Hugh",
        "acquaintance of Brenda"
      ],
      "public_persona": "Charming and witty",
      "private_secret": "Gambling debts",
      "motive_seed": "Desire to eliminate a rival",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "guest rooms",
        "social events"
      ],
      "behavioral_tells": [
        "checking watch",
        "increased drinking"
      ],
      "stakes": "Personal gain",
      "evidence_sensitivity": [
        "gambling records",
        "guest interactions"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Gertrude Walton",
      "age_range": "40-50",
      "role_archetype": "detective",
      "relationships": [
        "family friend"
      ],
      "public_persona": "Sharp and observant",
      "private_secret": "Past investigation failures",
      "motive_seed": "Desire to prove her skills",
      "motive_strength": "high",
      "alibi_window": "n/a",
      "access_plausibility": "high",
      "opportunity_channels": [
        "manor exploration",
        "guest interactions"
      ],
      "behavioral_tells": [
        "serious demeanor",
        "intense focus"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [
        "case files",
        "investigation reports"
      ],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Hugh Hadley"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a stormy evening at Hadley Manor, an unidentified guest is found murdered, leading to a tense investigation where time becomes the key to uncovering the truth."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The victim was poisoned with a time-delayed poison that activated after the guest had been seen with the drink.",
      "delivery_path": [
        {
          "step": "The poison was mixed into a drink served during dinner, but was not activated until hours later."
        }
      ]
    },
    "outcome": {
      "result": "The victim appears to have been poisoned shortly before the body was discovered, leading to misinterpretation of the timeline."
    }
  },
  "false_assumption": {
    "statement": "The victim was poisoned immediately before they were found dead.",
    "type": "temporal",
    "why_it_seems_reasonable": "Eyewitnesses saw the victim with the drink shortly before their death.",
    "what_it_hides": "The true timing of the poisoning, which occurred hours earlier due to a temperature-sensitive poison."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner started at 8:00 PM",
        "Body found at 10:00 PM"
      ],
      "windows": [
        "9:00 PM to 10:00 PM"
      ],
      "contradictions": [
        "Witnesses claim victim was seen drinking just before 10:00 PM, but forensic evidence shows poison activation requires a temperature trigger that was not met until after 10:00 PM."
      ]
    },
    "access": {
      "actors": [
        "Hugh Hadley",
        "Brenda Marlow",
        "Trevor Cheyne"
      ],
      "objects": [
        "Drink served at dinner",
        "Poison container"
      ],
      "permissions": [
        "Kitchen access for staff",
        "Guest access to dining areas"
      ]
    },
    "physical": {
      "laws": [
        "Temperature-sensitive poison activation"
      ],
      "traces": [
        "Cold temperature of the drink",
        "Radiator turned off in the dining room"
      ]
    },
    "social": {
      "trust_channels": [
        "Staff trust in Hugh",
        "Guest trust in Brenda"
      ],
      "authority_sources": [
        "Hugh as the host",
        "Gertrude as the investigator"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The drink served to the victim was found unusually cold for the time of year.",
        "correction": "The cold temperature suggests that the drink was prepared well in advance, affecting the timing of the poison's activation.",
        "effect": "Narrows timeline of poisoning, suggesting it could not have occurred shortly before death.",
        "required_evidence": [
          "Drink temperature record taken by the butler",
          "Testimony from Mary about drink preparation timing"
        ],
        "reader_observable": true
      },
      {
        "observation": "The radiator in the dining room was switched off at the time of the incident.",
        "correction": "The off radiator confirms that the drink remained cold, supporting the idea of delayed poison activation.",
        "effect": "Eliminates the possibility that the victim was poisoned immediately before their death.",
        "required_evidence": [
          "Radiator status report from the house staff",
          "Witness statements about the dining room conditions"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses state they saw the victim with the drink shortly before 10:00 PM.",
        "correction": "This contradicts the earlier observations about the temperature, indicating a false assumption about the timing of the poisoning.",
        "effect": "Narrows suspicion away from those who had direct access to the drink right before the body was discovered.",
        "required_evidence": [
          "Statements from guests about the victim's actions",
          "Timing of the death confirmed by medical examination"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Recreate the dining conditions to compare the drink temperature at the time of the victim's death, revealing the contradiction in witness statements.",
    "knowledge_revealed": "The temperature discrepancies and the timing of poison activation prove that the assumptions made by witnesses were incorrect.",
    "pass_condition": "If the recreated conditions show a warm drink was necessary for immediate poisoning, all witnesses who claimed otherwise are implicated.",
    "evidence_clues": [
      "clue_7",
      "clue_2",
      "clue_4",
      "clue_fp_contradiction_step_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The drink's cold temperature and staff testimony indicate it was prepared early. Step 2: The radiator being off suggests that the poison couldn't activate until later. Step 3: Witness statements about the victim's last actions contradict the established timeline, implicating them."
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
        "suspect_name": "Mary Selby",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Testimony corroborated by physical evidence",
        "supporting_clues": [
          "Drink temperature record taken by the butler",
          "Radiator status report from the house staff"
        ]
      },
      {
        "suspect_name": "Brenda Marlow",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 9:00 PM to 10:00 PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Trevor Cheyne",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 9:00 PM to 10:00 PM",
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
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
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_hugh_hadley",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Comparative analysis"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Hugh Hadley",
    "summary": "Hugh Hadley, a respected landowner, is ensnared in a web of financial deceit and personal desperation.",
    "publicPersona": "Hugh is often seen as the benevolent patriarch of Little Middleton, a man whose charitable contributions and leadership are widely acknowledged and respected. His public image is that of a dignified elder statesman, forever committed to the welfare of his estate and its people.",
    "privateSecret": "Beneath this polished exterior, Hugh is grappling with crippling debt, having siphoned funds from the estate's maintenance budget to sustain his lavish lifestyle. The looming threat of exposure coupled with the victim's knowledge of his financial indiscretions drives him to a state of paranoia.",
    "motiveSeed": "Hugh's fear of being exposed for his embezzlement is compounded by the victim's impending revelation of his financial troubles to the family, creating a compelling motive that weighs heavily on his conscience.",
    "motiveStrength": "compelling",
    "alibiWindow": "He claims to have been sequestered in the library, absorbed in a tome from eight o'clock until the moment of the murder, a solitary alibi that lacks verification.",
    "accessPlausibility": "easy",
    "stakes": "The stakes for Hugh are monumental: the potential loss of his estate, his reputation, and the trust of those who have relied on him for so long.",
    "humourStyle": "understatement",
    "humourLevel": 0.3,
    "speechMannerisms": "Hugh speaks with a measured cadence, often employing formal language that reflects his station. He occasionally punctuates his speech with dry, self-deprecating remarks, particularly when discussing his foibles.",
    "internalConflict": "Hugh is tormented by guilt and fear, wrestling with the consequences of his actions while grappling with the prospect of losing everything he has built.",
    "personalStakeInCase": "This crime strikes a personal chord for Hugh as it threatens to unravel his carefully constructed life and expose the depths of his moral failings.",
    "paragraphs": [
      "Hugh Hadley, a figure of authority and respect in Little Middleton, often walks the grounds of his estate with an air of confidence, yet beneath the surface lies a maelstrom of anxiety. The weight of his secrets presses down upon him like a leaden shroud, threatening to suffocate his carefully curated image. He has long been the benevolent benefactor, the man who donates to local charities and supports the community. Yet, as he gazes out over the manicured lawns, he knows that the truth is far less noble.",
      "In the dim light of the library, Hugh immerses himself in a book, the familiar scent of aged paper providing fleeting comfort. It is a sanctuary where he can momentarily escape the reality of his financial ruin. But that sanctuary is shattered by the knowledge that the victim was on the brink of exposing his transgressions. The thought sends a shiver down his spine, and he finds himself wondering if he truly can maintain his façade any longer. The stakes are higher than they have ever been, and the walls seem to close in around him.",
      "Hugh's alibi, while seemingly solid, is a brittle construct. Alone in the library, he can hardly provide proof of his whereabouts, and he knows that the whispers of doubt will soon echo through the halls of his estate. If his embezzlement comes to light, it will not only bring shame upon him but also bring ruin to the very people he vowed to protect. His heart races at the thought, and he must confront the reality: he is not just protecting himself, but his entire legacy.",
      "As he navigates the treacherous waters of suspicion, Hugh finds himself in a moral quandary. Should he come clean about his misdeeds, or should he attempt to quell the storm brewing around him? The fear of losing everything he has cultivated drives him to consider desperate measures. In the quiet corners of his mind, he senses a flicker of hope—a chance for redemption if he can navigate this crisis without succumbing to the truth. But as the investigation unfolds, he realizes that the greatest battle lies not just against external forces, but within himself."
    ],
    "order": 1
  },
  {
    "name": "Brenda Marlow",
    "summary": "Brenda Marlow, the ambitious personal assistant, finds herself entangled in a web of jealousy and desire.",
    "publicPersona": "Brenda is perceived as an industrious and detail-oriented assistant, admired by the estate staff for her dedication and sharp instincts. She is the type of person who ensures that everything runs like clockwork, always several steps ahead in her duties.",
    "privateSecret": "However, beneath her professional demeanor lies a simmering ambition fueled by her secret affair with Hugh Hadley. Brenda hopes to leverage their relationship into a more permanent position within the estate, but the threat posed by the victim's knowledge of their liaison casts a shadow over her aspirations.",
    "motiveSeed": "Brenda's jealousy of the victim's close relationship with Hugh fuels her fears of losing both her job and the man she desires, creating a moderate motive that complicates her actions.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claims to have been delivering important documents to the east wing during the murder, yet her timeline remains uncorroborated by any witnesses.",
    "accessPlausibility": "possible",
    "stakes": "For Brenda, the stakes are personal and professional: the potential loss of her career and the future she envisions with Hugh hang in the balance.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Brenda speaks with a brisk efficiency, often peppering her conversation with subtle jabs and dry observations. Her tone is polished, yet she occasionally lets slip a biting wit that reveals her underlying ambition and frustration.",
    "internalConflict": "Brenda grapples with the tension between her loyalty to Hugh and her desire for professional advancement, torn between ambition and the fear of exposure.",
    "personalStakeInCase": "This crime matters deeply to Brenda, as it not only threatens her current position but also jeopardizes her hopes for a future with Hugh, whom she has come to view as her ticket to a better life.",
    "paragraphs": [
      "Brenda Marlow is the embodiment of ambition, a whirlwind of efficiency and keen observation. She navigates the estate with a grace that belies the storm brewing within her. Her colleagues respect her, often marveling at her ability to juggle a multitude of tasks without breaking a sweat. Yet, beneath the polished exterior lies a tempest of envy, particularly towards the victim, whose presence looms like a dark cloud over her aspirations.",
      "In the quiet moments when she is alone, Brenda reflects on her clandestine relationship with Hugh Hadley. It is a connection she has nurtured in secret, believing it to be the key to her future. Yet, the victim's knowledge of their affair becomes a specter that haunts her every decision. The fear of losing both her job and the man she desires weighs heavily on her mind, and she finds herself trapped in a delicate dance of jealousy and ambition.",
      "As she delivers documents to the east wing, her heart races at the thought of what could unfold. Her alibi is shaky at best, and the absence of witnesses to corroborate her story sends a chill down her spine. She is acutely aware that any slip could lead to her unraveling, and the thought of being discovered fills her with a mix of dread and determination. The stakes have never been higher, and every glance exchanged with Hugh sends her mind racing toward the potential consequences of their secret.",
      "Brenda's internal conflict is palpable; she is torn between her loyalty to Hugh and her ambition to rise above her current station. Each day spent in the shadow of the estate's grandeur heightens her desire for more, yet she fears the cost of her aspirations. As the investigation unfolds, she must confront the truth of her motivations and decide whether to protect her own interests or risk everything for a chance at love and success. The path ahead is fraught with peril, but Brenda is determined to navigate it with the tenacity that defines her."
    ],
    "order": 2
  },
  {
    "name": "Mary Selby",
    "summary": "Mary Selby, the loyal housekeeper, hides a darker side as she grapples with the consequences of her blackmail.",
    "publicPersona": "Mary is the epitome of loyalty, a long-serving housekeeper whose discretion and dedication have earned her the respect of the estate's inhabitants. She is the backbone of the household, ensuring that everything runs smoothly.",
    "privateSecret": "Yet, her steadfast exterior conceals a secret that could shatter her world: she has been blackmailing Hugh Hadley for a raise, leveraging her knowledge of his embezzlement for financial gain.",
    "motiveSeed": "With the victim aware of her scheme, Mary stands to lose not only her financial security but also her job, creating a strong motive driven by desperation.",
    "motiveStrength": "strong",
    "alibiWindow": "Mary claims to have been in the kitchen preparing dinner, but her access to the estate and knowledge of its layout make it easy for her to slip away unnoticed.",
    "accessPlausibility": "easy",
    "stakes": "For Mary, the stakes are monumental; her job and financial stability hinge on maintaining her leverage over Hugh, and the threat of exposure looms large.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mary's speech is marked by a practical and no-nonsense tone, often laced with dry remarks that reflect her sharp mind and keen awareness. She speaks with a steady rhythm, occasionally punctuating her sentences with a wry observation about the absurdity of her situation.",
    "internalConflict": "Mary struggles with the tension between her loyalty to the estate and her need for financial security, haunted by the fear that her actions may lead to her downfall.",
    "personalStakeInCase": "This crime matters deeply to Mary, as it not only threatens her financial security but also puts her in direct conflict with the man she has relied upon for her livelihood.",
    "paragraphs": [
      "Mary Selby is a cornerstone of the Hadley estate, her presence a comforting constant in the lives of those she serves. With decades of experience under her belt, she navigates the household with a practiced ease, ensuring that everything is in its place. Her loyalty is unquestionable, and her discretion has earned her the trust of both staff and family alike. But beneath her steadfast exterior lies a darker truth, one that threatens to unravel the very fabric of her life.",
      "For years, Mary has wielded her knowledge of Hugh's embezzlement like a sword, using it to extract a raise that has become her lifeline. The power she holds is intoxicating, yet it comes with its own burdens. The victim's awareness of her blackmail places her in a precarious position, and the thought of exposure sends tremors of fear through her. She knows that should her scheme be revealed, her job—and perhaps her very livelihood—would be at stake.",
      "As she busies herself in the kitchen, preparing dinner for the household, Mary reflects on the tangled web she has woven. Her alibi, while plausible, is far from secure. The knowledge that she could slip away unnoticed adds a layer of tension to her already fraught existence. Each moment spent in the shadows of the estate heightens her anxiety, and she feels the walls closing in around her as the investigation unfolds.",
      "In the depths of her mind, Mary wrestles with the moral implications of her actions. She has always prided herself on her loyalty, yet the very secret she guards so fiercely threatens to consume her. As the specter of exposure looms larger, she finds herself at a crossroads: should she continue to protect her interests, or should she seek redemption by coming forward with the truth? The stakes could not be higher, and the path she chooses may well determine her fate."
    ],
    "order": 3
  },
  {
    "name": "Trevor Cheyne",
    "summary": "Trevor Cheyne, the disgruntled junior estate manager, harbors resentment and dreams of advancement.",
    "publicPersona": "Trevor is seen as a young and eager junior estate manager, striving to prove himself in a role that often feels thankless. He is the embodiment of youthful ambition, though overshadowed by the more established figures around him.",
    "privateSecret": "Beneath his earnest demeanor lies a simmering resentment towards Hugh, stemming from a series of perceived slights and missed opportunities for promotion. Trevor's frustration grows as he watches others rise while he remains overlooked.",
    "motiveSeed": "The victim's pressure on Hugh to promote him amplifies Trevor's bitterness, creating a weak motive fueled by jealousy and discontent.",
    "motiveStrength": "weak",
    "alibiWindow": "Trevor claims to have been tending to the gardens alone, but his solitary presence lacks verification from anyone else.",
    "accessPlausibility": "possible",
    "stakes": "For Trevor, the stakes are tied to his career advancement and self-worth, as each passing day without recognition chips away at his confidence.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Trevor's speech is punctuated by a sardonic edge, often laced with dry humor that reflects his disillusionment. He speaks with a casual rhythm, peppering his dialogue with sharp observations about the absurdities of estate life.",
    "internalConflict": "Trevor grapples with feelings of inadequacy and frustration, torn between his ambitions and the reality of his position.",
    "personalStakeInCase": "This crime resonates with Trevor as it underscores his struggles for recognition and respect, amplifying his desire to break free from the shadows of his superiors.",
    "paragraphs": [
      "Trevor Cheyne is an ambitious soul trapped in the gilded cage of the Hadley estate. As the junior estate manager, he hustles to prove his worth, yet often finds himself overshadowed by the more established figures around him. His youthful enthusiasm is tempered by a growing sense of disillusionment, as each unrecognized effort chips away at his confidence. He is eager to climb the ranks, yet the ladder seems forever out of reach.",
      "Beneath the surface, Trevor harbors a resentment that festers like an untreated wound. He feels overlooked, passed over for promotions, while others bask in the glow of recognition. The victim's insistence on pushing Hugh for his advancement becomes a bitter reminder of his own frustrations, and he struggles to reconcile his ambitions with the reality of his situation. The thought of the victim's pressure on Hugh adds fuel to the fire of his discontent.",
      "As he claims to have been tending to the gardens alone during the time of the murder, Trevor is acutely aware of the lack of witnesses to corroborate his story. The solitude of the gardens, once a sanctuary for his thoughts, now feels like a prison of doubt. Each rustle of leaves seems to whisper accusations, and he finds himself grappling with the realization that his aspirations could be overshadowed by the chaos of the investigation.",
      "Trevor's internal conflict is palpable; he longs for recognition yet fears that his bitterness may lead him down a dark path. The stakes are personal, as the crime threatens to expose not just the secrets of others but the fragility of his own self-worth. As the investigation unfolds, he must confront the uncomfortable truth: is he willing to risk everything for a chance at advancement, or will he learn to navigate the complexities of ambition with integrity?"
    ],
    "order": 4
  },
  {
    "name": "Gertrude Walton",
    "summary": "Gertrude Walton, a retired schoolteacher and amateur sleuth, finds herself drawn into a mystery that challenges her meddlesome nature.",
    "publicPersona": "Gertrude is a beloved figure in the community, known for her sharp mind and keen observations. As a retired schoolteacher, she has a penchant for order and an insatiable curiosity about the lives of those around her.",
    "privateSecret": "However, her history of meddling in the affairs of others has earned her a few enemies along the way, and her reputation is not without its blemishes.",
    "motiveSeed": "Drawn into the investigation by whispers of suspicion surrounding the victim, Gertrude's involvement is fueled by her desire to uncover the truth, though her motivations may not be entirely altruistic.",
    "motiveStrength": "weak",
    "alibiWindow": "She claims to have been hosting a tea party with several guests, but her brief moment outside raises questions about her whereabouts during the murder.",
    "accessPlausibility": "easy",
    "stakes": "For Gertrude, the stakes revolve around her community reputation and her personal sense of justice, as she seeks to validate her meddling with a successful investigation.",
    "humourStyle": "observational",
    "humourLevel": 0.6,
    "speechMannerisms": "Gertrude speaks with an articulate clarity, often punctuating her observations with dry wit. Her dialogue is peppered with anecdotes and reflections that reveal her keen understanding of human nature.",
    "internalConflict": "Gertrude wrestles with her need for validation and the consequences of her meddling, torn between her desire to help and the potential harm her actions may cause.",
    "personalStakeInCase": "This crime matters to Gertrude as it presents an opportunity to assert her role as the unofficial investigator of the community, while also addressing her own insecurities about her place in a changing world.",
    "paragraphs": [
      "Gertrude Walton is a familiar face in Little Middleton, her presence a blend of warmth and keen observation. As a retired schoolteacher, she possesses a sharp intellect and an insatiable curiosity that propels her into the thick of community affairs. Her neighbors respect her insights and often seek her counsel, but beneath the surface lies a history of meddling that has occasionally ruffled feathers. Her reputation as a busybody is a title she wears with mixed pride.",
      "When whispers of suspicion regarding the victim begin to circulate, Gertrude feels a familiar thrill of intrigue. The notion of unraveling a mystery ignites her passion, yet she is aware of the fine line she walks between helpfulness and intrusion. As she hosts a tea party, her guests are oblivious to the storm brewing in her mind, and she finds herself torn between the desire to assist and the fear of overstepping her bounds. The stakes are high, and she longs to prove her worth as a community investigator.",
      "Her alibi, while seemingly solid, is tenuous at best. The brief moment she spent outside during the party raises questions about her whereabouts during the murder, and she senses the tension in the air as the investigation unfolds. Each interaction with her guests becomes a balancing act, as she navigates their expectations while quietly plotting her next steps in the investigation. The thrill of discovery fuels her determination, but she must also contend with the potential fallout of her actions.",
      "As Gertrude delves deeper into the mystery, she grapples with her own motivations. The need for validation looms large, as she seeks to prove that her meddling can yield positive outcomes. Yet, she also fears the consequences—what if her actions lead to harm rather than resolution? The stakes are not just about solving a crime; they are about asserting her place in a changing world where her role as a community figure may be shifting. As the pieces of the puzzle begin to come together, Gertrude must confront the complexities of her own nature and the impact of her involvement on those around her."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Little Middleton Manor",
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling country estate steeped in mystery and class tensions, where secrets loom as large as the estate itself.",
    "visualDescription": "An imposing stone facade with ivy-clad walls, large bay windows reflecting the overcast sky, and a grand entrance flanked by ancient oaks. The interiors boast polished mahogany furnishings and rich tapestries, with sprawling grounds that include meticulously manicured gardens and shadowy woods.",
    "atmosphere": "A palpable sense of unease pervades the estate, with whispers of discontent and hidden agendas echoing through its halls.",
    "paragraphs": [
      "Little Middleton Manor stands resolutely against the Yorkshire skyline, its weathered stone walls telling tales of generations past. The grand entrance, framed by towering oak trees, ushers guests into a world of elegance and intrigue. Inside, the air is thick with the scent of polished wood and damp earth, as if the very walls hold their breath, anticipating the unfolding drama. Shadows dance beneath gas lamps, casting an eerie glow on the rich tapestries that adorn the walls, each depicting scenes of hunting and harvest, a stark contrast to the tension simmering beneath the surface.",
      "The sprawling grounds of the manor stretch out like a labyrinth, with manicured hedges and overgrown paths that twist into the dense woods beyond. The gardens, once a source of beauty, now seem to harbor secrets among their fragrant blooms, the heavy scent of damp earth mingling with the perfume of wilting roses. A chill breeze whispers through the trees, carrying with it the distant sound of thunder, as if nature itself senses the impending storm of revelations. The isolation of the estate, miles from the nearest town, creates an atmosphere of entrapment, where the guests are both observers and participants in a deadly game.",
      "As night falls, the manor transforms. The flickering candlelight casts long shadows across the polished floors, and the crackling hearth-fire offers only a feeble warmth against the encroaching chill. The distant tolling of a clock marks the passage of time, reminding all within that the truth waits, hidden in the dark corners of the manor. Each guest, cloaked in their own secrets, moves with purpose, while the oppressive atmosphere weighs heavily, suggesting that no one is truly safe within these walls. The stage is set for confrontation, and the manor itself seems to lean closer, eager to witness the unraveling of its guests' facades."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical for the season, creating a somber mood.",
    "timeFlow": "A single evening of mounting tension, culminating in a night of revelations.",
    "mood": "Tense and foreboding, reflecting the underlying class struggles and personal conflicts among guests.",
    "eraMarkers": [
      "Petrol-driven automobiles parked in the courtyard",
      "Typewriters clacking in the study",
      "Early telephone system ringing intermittently"
    ],
    "sensoryPalette": {
      "dominant": "The scent of damp earth and polished wood",
      "secondary": [
        "Flickering candlelight shadows",
        "Creaking floorboards underfoot"
      ]
    },
    "paragraphs": [
      "The manor's atmosphere is thick with anticipation, an almost tangible energy that crackles in the air. Each click of a typewriter in the study echoes like a ticking clock, counting down to an inevitable confrontation. The scent of damp earth seeps into every corner, mingling with the rich aroma of beeswax candles, creating a heady mix that both comforts and unnerves. The overcast skies loom heavily, casting a muted light that dulls the vibrant colors of the gardens, making them appear almost ghostly in the twilight. Shadows flicker and dance, as if alive, adding to the sense of unease that permeates the estate.",
      "As evening descends, the manor transforms into a theater of secrets. The distant rumble of thunder serves as a reminder of the storm brewing outside, while the soft crackling of the hearth-fire offers little solace. The air is thick with tension, each whispered conversation a thread in the intricate web of deception that binds the guests together. Outside, the rain taps insistently against the windows, a relentless reminder of the world beyond the estate's imposing walls. Within, the atmosphere is charged with unspoken words and hidden truths, setting the stage for a night that promises to unravel the carefully woven fabric of their lives."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "Richly decorated with velvet drapes, an ornate chandelier casting soft light, and a grand piano resting in the corner.",
      "sensoryDetails": {
        "sights": [
          "velvet drapes in deep crimson",
          "ornate chandelier glimmering",
          "grand piano with polished keys",
          "portraits of ancestors lining walls",
          "flickering candlelight reflections"
        ],
        "sounds": [
          "soft laughter and murmurs",
          "the creak of polished floorboards",
          "the distant chiming of a clock",
          "the rustle of silk dresses",
          "the gentle plucking of piano strings"
        ],
        "smells": [
          "faint perfume lingering in the air",
          "aged leather from armchairs",
          "beeswax from candles",
          "freshly cut flowers on the mantel",
          "wood smoke from the fireplace"
        ],
        "tactile": [
          "silk upholstery against skin",
          "cool marble of the fireplace mantel",
          "worn leather of armchair cushions",
          "smoothness of polished wood surfaces",
          "the warmth of the crackling fire"
        ]
      },
      "accessControl": "Guests have free access during the day; locked after dinner for privacy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "dim light filtering through clouds",
            "wet floor reflecting light",
            "flowers drooping under rain",
            "mist rising from the gardens"
          ],
          "sounds": [
            "steady rain on roof",
            "distant thunder rumbling",
            "water dripping from eaves",
            "soft rustling of leaves",
            "the creaking of old timbers"
          ],
          "smells": [
            "fresh rain on earth",
            "damp wood and leather",
            "the scent of wet flowers",
            "mildew in corners",
            "cold stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light casting shadows",
            "dust motes floating in beams",
            "silhouette of trees outside",
            "the flicker of candlelight",
            "a gathering storm on the horizon"
          ],
          "sounds": [
            "silence broken by distant clock",
            "the soft crackle of fire",
            "whispers of conversation",
            "the rustle of pages turning",
            "the creak of furniture shifting"
          ],
          "smells": [
            "beeswax and smoke",
            "dusty books on shelves",
            "the scent of old leather",
            "freshly brewed tea",
            "the faint aroma of pipe tobacco"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off polished surfaces",
            "shadows stretching across the floor",
            "the glow of the fireplace",
            "the last light of day fading",
            "the flicker of lanterns outside"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "distant laughter from the dining room",
            "the crackle of the fire",
            "soft music playing",
            "the rustle of evening gowns"
          ],
          "smells": [
            "warmth of the fire",
            "scent of tobacco smoke",
            "the richness of dark wood",
            "the sweet smell of dessert",
            "the faintest hint of lavender"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Drawing Room serves as a central hub for the guests, a space where laughter and tension intertwine beneath the ornate chandelier. Richly decorated with velvet drapes and portraits of ancestors, the room feels both welcoming and foreboding. The grand piano stands ready for a performance, its polished keys gleaming in the flickering candlelight, a silent witness to the secrets exchanged in hushed tones. Each creak of the floorboards adds to the atmosphere, a reminder that the manor itself is alive, observing the drama unfold.",
        "As the rain patters against the windows, the Drawing Room transforms into a refuge from the storm outside. The scent of beeswax and aged leather fills the air, mingling with the faint perfume of the guests, each scent telling its own story. Conversations ebb and flow, punctuated by laughter that feels oddly strained, as if the room itself is holding its breath. With each passing moment, the tension builds, and the Drawing Room becomes a stage set for confrontation, where alliances may shift and truths may come to light."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene and clue discovery",
      "visualDetails": "Shelves lined with leather-bound books, a large mahogany desk strewn with papers, and a globe in the corner gathering dust.",
      "sensoryDetails": {
        "sights": [
          "rows of leather-bound volumes",
          "dust motes drifting in sunlight",
          "the large mahogany desk",
          "an ornate globe covered in dust",
          "a flickering candle on the desk"
        ],
        "sounds": [
          "the rustling of pages turning",
          "the distant ticking of a clock",
          "the soft creak of the floor",
          "the whisper of fabric brushing against wood",
          "the faint patter of rain on the roof"
        ],
        "smells": [
          "old paper and leather",
          "the musty scent of forgotten tomes",
          "the faint aroma of tobacco",
          "the crispness of fresh ink",
          "the dampness of the air"
        ],
        "tactile": [
          "smoothness of leather spines",
          "the chill of the desk surface",
          "the rough texture of old paper",
          "the weight of a heavy book",
          "the coolness of the globe"
        ]
      },
      "accessControl": "Restricted access; only the master of the house and select guests can enter, usually during the day.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets on windows",
            "grey light filtering through clouds",
            "darkened corners of the room",
            "the glow of a lone candle",
            "the glossy surface of the desk"
          ],
          "sounds": [
            "steady rain against windows",
            "the soft rustle of paper",
            "the ticking of a clock",
            "the creak of old wood",
            "the sound of a chair being pulled"
          ],
          "smells": [
            "dampness in the air",
            "the mustiness of old books",
            "the scent of wet leather",
            "the faint aroma of ink",
            "the coldness of stone walls"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "dust motes visible in the air",
            "the outline of the globe",
            "the flicker of candlelight",
            "the heavy drapes drawn tight"
          ],
          "sounds": [
            "the clock ticking steadily",
            "the soft rustling of pages",
            "whispers echoing off the walls",
            "the creak of shelves under weight",
            "the distant sound of thunder"
          ],
          "smells": [
            "the scent of aged paper",
            "the aroma of leather binding",
            "the mustiness of the room",
            "the faint smell of tobacco smoke",
            "the crispness of fresh ink"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of candles",
            "the rich colors of leather spines",
            "shadows stretching across the floor",
            "the gleam of polished wood",
            "the silhouette of the globe"
          ],
          "sounds": [
            "the crackle of fire in the hearth",
            "distant laughter from other rooms",
            "the rustle of pages turning",
            "the ticking of a clock",
            "the soft creak of the door opening"
          ],
          "smells": [
            "warmth of the fire",
            "the scent of aged books",
            "the aroma of tobacco",
            "the fresh smell of ink",
            "the crispness of leather"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Library is a sanctuary of knowledge and secrets, its shelves lined with leather-bound volumes that have witnessed the passage of time. A large mahogany desk stands at the center, cluttered with papers and the remnants of previous research, hinting at the mysteries that lie within the pages. Dust motes dance in the shafts of light that pierce through the heavy drapes, illuminating the outlines of the globe in the corner, a forgotten relic in this haven of solitude. The air is thick with the scent of old paper and leather, each breath a reminder of the stories waiting to be uncovered.",
        "As the rain patters against the windows, the Library transforms into a cocoon of oppressive silence, the ticking clock echoing like a heartbeat in the stillness. The musty aroma of forgotten tomes fills the air, mingling with the crisp scent of fresh ink, creating a heady mix that heightens the senses. Shadows deepen in the corners, as if the very room is concealing its own secrets, waiting for the right moment to reveal the truth. In this space, every rustle of paper, every creak of wood, seems amplified, as if the Library itself is an accomplice in the unfolding mystery."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Private space for the master of the house",
      "visualDetails": "Dark wood paneling, a large desk cluttered with papers, and a heavy leather chair facing a window overlooking the gardens.",
      "sensoryDetails": {
        "sights": [
          "dark wood paneling enveloping the room",
          "papers strewn across the desk",
          "a heavy leather chair worn with use",
          "the view of gardens through the window",
          "the faint outline of trees beyond"
        ],
        "sounds": [
          "the ticking of a clock",
          "the rustle of paper",
          "the creak of the chair as it shifts",
          "the faint sound of rain against the window",
          "the whisper of wind through trees"
        ],
        "smells": [
          "the scent of polished wood",
          "the aroma of old paper",
          "the faint smell of tobacco",
          "the musk of leather",
          "the dampness of the air"
        ],
        "tactile": [
          "the smoothness of the desk surface",
          "the softness of the leather chair",
          "the chill of the window frame",
          "the rough texture of paper",
          "the weight of a heavy book"
        ]
      },
      "accessControl": "Access restricted to the master and select guests; entered only during specific times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down the window",
            "darkened corners of the room",
            "the glow of a lone lamp",
            "papers fluttering in the breeze",
            "the muted colors of the garden outside"
          ],
          "sounds": [
            "steady rain drumming on the roof",
            "the soft rustle of paper",
            "the ticking of a clock",
            "the creak of the chair",
            "the distant rumble of thunder"
          ],
          "smells": [
            "dampness in the air",
            "the scent of leather",
            "the aroma of old books",
            "the mustiness of paper",
            "the faint smell of rain"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light filtering through clouds",
            "shadows pooling in corners",
            "the outline of the garden visible",
            "the flickering of candlelight",
            "the clutter of papers on the desk"
          ],
          "sounds": [
            "the clock ticking steadily",
            "the soft rustle of paper",
            "the whisper of wind outside",
            "the creak of the chair as it shifts",
            "the distant sound of voices"
          ],
          "smells": [
            "the scent of polished wood",
            "the aroma of leather",
            "the musty smell of old paper",
            "the faint hint of tobacco smoke",
            "the dampness of the air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light from a desk lamp",
            "the glow of polished wood",
            "the shadows flickering across the walls",
            "the view of the garden under moonlight",
            "the silhouette of trees outside"
          ],
          "sounds": [
            "the ticking of a clock",
            "the soft crackle of a fire",
            "the rustle of paper",
            "distant laughter from the Drawing Room",
            "the whisper of leaves in the wind"
          ],
          "smells": [
            "the warmth of tobacco smoke",
            "the scent of old books",
            "the aroma of polished wood",
            "the crispness of leather",
            "the faint smell of lavender from the garden"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Study is a sanctuary of contemplation, its dark wood paneling enveloping the room in a cocoon of solitude. A large desk, cluttered with papers, stands as a testament to the master’s restless mind, while a heavy leather chair, worn from use, beckons for a moment of respite. The view from the window offers a glimpse of the gardens, their vibrant colors muted by the overcast sky, creating a perfect backdrop for the secrets that linger within. The ticking clock serves as a reminder of time slipping away, each second heavy with unspoken truths.",
        "As the rain patters against the window, the Study becomes a refuge from the storm outside. The air is thick with the scent of polished wood and old paper, a comforting mixture that belies the tension simmering beneath the surface. Every rustle of paper and creak of the chair amplifies the isolation, as if the room itself is a witness to the unfolding drama. In this space, the weight of secrets feels almost palpable, urging the master to confront the shadows that loom just beyond the door."
      ]
    },
    {
      "id": "gardens",
      "name": "The Gardens",
      "type": "exterior",
      "purpose": "Setting for outdoor interactions and potential clues",
      "visualDetails": "Lush greenery interspersed with winding paths, a fountain at the center, and overgrown hedges concealing hidden corners.",
      "sensoryDetails": {
        "sights": [
          "lush greenery and blooming flowers",
          "winding gravel paths",
          "the glint of water in the fountain",
          "overgrown hedges creating shadows",
          "the silhouette of trees against the sky"
        ],
        "sounds": [
          "chirping birds in the trees",
          "the soft trickle of water from the fountain",
          "the rustle of leaves in the breeze",
          "distant laughter from the manor",
          "the crunch of gravel underfoot"
        ],
        "smells": [
          "the fragrance of blooming roses",
          "freshly cut grass",
          "the earthy scent of damp soil",
          "the crispness of morning dew",
          "the faint aroma of herbs from the kitchen garden"
        ],
        "tactile": [
          "the softness of petals brushing against skin",
          "the coolness of the fountain's edge",
          "the roughness of gravel paths",
          "the dampness of earth underfoot",
          "the gentle caress of a breeze"
        ]
      },
      "accessControl": "Open during the day; restricted at night, with paths illuminated by lanterns.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops clinging to petals",
            "grey clouds looming overhead",
            "the fountain splashing softly",
            "damp earth glistening",
            "the muted colors of flowers"
          ],
          "sounds": [
            "steady rain falling on leaves",
            "the soft trickle of water in the fountain",
            "birds chirping cautiously",
            "the rustle of wet foliage",
            "the distant sound of thunder"
          ],
          "smells": [
            "fresh rain on earth",
            "the scent of wet flowers",
            "the dampness of the air",
            "the aroma of herbs",
            "the crispness of morning dew"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "the fountain surrounded by wilted blooms",
            "the outline of trees against the grey sky",
            "the stillness of the air"
          ],
          "sounds": [
            "the rustle of leaves in the wind",
            "the distant sound of laughter",
            "the soft splash of water",
            "the creak of branches",
            "the sound of gravel shifting underfoot"
          ],
          "smells": [
            "the earthy scent of damp soil",
            "the fragrance of fading flowers",
            "the aroma of freshly cut grass",
            "the scent of herbs wafting from the kitchen",
            "the dampness in the air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of lanterns lighting the paths",
            "the shimmering surface of the fountain",
            "the colors of flowers vibrant in twilight",
            "the silhouette of hedges against the sky",
            "the flicker of fireflies"
          ],
          "sounds": [
            "the gentle trickle of the fountain",
            "the chirping of crickets",
            "the rustle of leaves in the evening breeze",
            "laughter echoing from the manor",
            "the distant hoot of an owl"
          ],
          "smells": [
            "the sweet fragrance of night-blooming flowers",
            "the scent of freshly cut grass",
            "the earthy aroma of soil",
            "the crispness of the night air",
            "the faint smell of smoke from the manor"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Gardens of Little Middleton Manor are a tapestry of color and life, interspersed with winding paths that beckon exploration. Lush greenery surrounds a central fountain, its gentle trickle providing a soothing soundtrack to the vibrant blooms that sway softly in the breeze. However, the overgrown hedges cast long shadows, concealing hidden corners where secrets may lie. The air is thick with the fragrance of roses and freshly cut grass, a deceptive sweetness that masks the tension building within the manor's walls.",
        "As evening descends, the Gardens transform under the warm glow of lanterns, casting playful shadows that dance among the flowers. The air is filled with the sweet scent of night-blooming flora, mingling with the earthy aroma of soil, creating an intoxicating atmosphere. Laughter echoes softly from the manor, but there is an undercurrent of unease, as the stillness of the night amplifies each sound. In this enchanting setting, the stage is set for clandestine meetings and whispered conversations, where the truth may be as elusive as the flickering fireflies that dart between the blooms."
      ]
    }
  ],
  "note": "",
  "cost": 0.0030514934999999995,
  "durationMs": 46872
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1935,
    "month": "September",
    "day": null,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "September",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "cool breezes"
    ],
    "daylight": "Days are shortening, with twilight settling in by six o'clock, casting long shadows that creep across the manor grounds.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, as the rain begins to pick up.",
    "holidays": [
      "Harvest Festival"
    ],
    "seasonalActivities": [
      "apple picking at local orchards",
      "attending harvest fairs in nearby towns",
      "organizing charity events for the less fortunate"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored dark wool suits",
        "white dress shirts with high collars",
        "black leather brogues"
      ],
      "casual": [
        "tweed jackets",
        "corduroy trousers",
        "knit vests"
      ],
      "accessories": [
        "silk ties with geometric patterns",
        "flat caps",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dresses with floral patterns",
        "cloche hats adorned with feathers",
        "string of pearls"
      ],
      "casual": [
        "tweed skirts paired with soft blouses",
        "lightweight cardigans",
        "cotton scarves"
      ],
      "accessories": [
        "small leather handbags",
        "silk stockings",
        "brooches shaped like flowers"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influence in design",
      "strong emphasis on practicality in fashion",
      "the rise of Hollywood glamour"
    ],
    "socialExpectations": [
      "strict adherence to class distinctions",
      "emphasis on propriety and decorum in social settings",
      "expectation for women to be well-mannered and poised"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "increased tensions in Europe as fascism rises",
      "the aftermath of the Nuremberg Laws affecting Jewish communities",
      "growing labor strikes in the UK due to economic hardships"
    ],
    "politicalClimate": "A climate of uncertainty prevails as fascist ideologies gain traction across Europe, provoking fear and unrest.",
    "economicConditions": "The Great Depression continues to pose significant challenges, especially for the working class, leading to increased class tensions.",
    "socialIssues": [
      "unemployment rates remain high",
      "discussions on social welfare and rights for the poor",
      "debates over immigration policies"
    ],
    "internationalNews": [
      "German rearmament causing alarm across Europe",
      "the impending war in Ethiopia drawing attention to Italian aggression"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'In the Mood' by Glenn Miller",
        "'Cheek to Cheek' by Ella Fitzgerald",
        "'Night and Day' by Cole Porter"
      ],
      "films": [
        "'Top Hat' featuring Fred Astaire",
        "'A Midsummer Night's Dream'",
        "'The 39 Steps' directed by Alfred Hitchcock"
      ],
      "theater": [
        "'Pygmalion' by George Bernard Shaw",
        "'The Front Page' by Ben Hecht"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "The Lone Ranger"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Gone with the Wind' by Margaret Mitchell",
        "'The Grapes of Wrath' by John Steinbeck",
        "'Of Mice and Men' by John Steinbeck"
      ],
      "popularGenres": [
        "social realism",
        "detective fiction",
        "historical novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial radio stations",
        "the automatic washing machine",
        "the electric refrigerator"
      ],
      "commonDevices": [
        "typewriters in offices",
        "early model cars",
        "telephones in homes"
      ],
      "emergingTrends": [
        "the rise of consumerism",
        "increased use of mass media",
        "early developments in aviation technology"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "A pint of milk: three pence"
      ],
      "commonActivities": [
        "social gatherings in the evening",
        "attending community fairs",
        "visiting local tea rooms"
      ],
      "socialRituals": [
        "afternoon tea served with scones and jam",
        "weekly church services followed by community discussions"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a rigid class system with clear distinctions",
      "growing resentment towards the upper classes due to economic disparities"
    ],
    "gender": [
      "women are expected to maintain the home and support their husbands",
      "men are viewed as the primary breadwinners",
      "increasing discussions about women's rights"
    ],
    "race": [
      "racial tensions are palpable, particularly against Jewish communities",
      "a growing awareness of colonial issues"
    ],
    "generalNorms": [
      "strict adherence to social etiquette",
      "emphasis on family honor and reputation",
      "growing acceptance of modern ideas, though slowly"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth mingles with the crispness of fallen leaves, as the rain taps rhythmically against the grand windows of the manor.",
    "The sound of distant thunder echoes, creating an ominous background to the hushed conversations among the guests.",
    "Shadows flicker from the candlelight, illuminating the richly decorated but somber interiors, heightening the sense of tension among the gathered company."
  ],
  "paragraphs": [
    "As September unfolds in 1935, the air carries the crispness of fall, with overcast skies threatening rain. The manor house, a relic of aristocratic lineage, stands solemn against the backdrop of the encroaching autumn. The harvest festival, a time of celebration, feels overshadowed by the pervasive gloom of the Great Depression. Guests, dressed in the latest fashions—men in tailored suits of dark wool and women in elegant tea-length dresses—gather for an evening of strained politeness, each aware of the class divides that threaten to unravel their delicate social fabric.",
    "Fashion in this era reflects both the elegance and practicality demanded by the times. Men sport silk ties with geometric patterns, while women adorn themselves with cloche hats and strings of pearls that glimmer in the candlelight. Casual outings see tweed jackets and corduroy trousers, indicative of a society still clinging to traditional values while adapting to the economic hardships. Yet, even in their finery, there’s an undercurrent of unease, a reminder that the world's politics are shifting beneath their feet.",
    "Daily life in 1935 is marked by the constant awareness of social expectations and economic realities. Community gatherings are common, with afternoon tea rituals serving as a cover for the discussions of labor strikes and rising tensions across Europe. The local economy is struggling, evidenced by the prices of common goods; a loaf of bread costs four pence, a stark reminder of the times. In the evenings, as guests partake in the manor's lavish dinners, the atmosphere is thick with foreboding, as the rain begins to beat harder against the windows, mirroring the turmoil brewing outside."
  ],
  "note": "",
  "cost": 0.0010545314999999998,
  "durationMs": 12746
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the Hadley estate for a family reunion becomes a crucible of tension, as economic despair and class conflict force the wealthy and their staff into a precarious dance of loyalty and betrayal.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The wealthy elite grapple with the stigma of their privilege amid the Great Depression, while the working class faces increasing resentment and rising political tensions."
  },
  "setting": {
    "location": "Hadley Manor",
    "institution": "Manor house",
    "weather": "Overcast with intermittent rain"
  },
  "castAnchors": [
    "Hugh Hadley",
    "Brenda Marlow",
    "Mary Selby",
    "Trevor Cheyne",
    "Gertrude Walton"
  ],
  "theme": "A classic murder mystery"
}

### LOCKED_FACTS
[
  {
    "id": "temperature_reading",
    "value": "sixty degrees Fahrenheit",
    "description": "The temperature of the drink when first tested"
  },
  {
    "id": "activation_time",
    "value": "thirty minutes",
    "description": "The exact delay before the poison activated"
  },
  {
    "id": "death_time",
    "value": "a quarter past ten",
    "description": "The time of death recorded"
  },
  {
    "id": "party_start_time",
    "value": "eight o'clock",
    "description": "The time the party began"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The victim was poisoned with a time-delayed poison that activated after the guest had been seen with the drink.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Reveals the mechanism of the poisoning.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "testimonial",
      "description": "This contradicts the earlier observations about the temperature, indicating a false assumption about the timing of the poisoning.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Overturns the false assumption regarding the timing of the poisoning.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Brenda Marlow because she was seen in the kitchen preparing the dessert at the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Narrow the solution towards other suspects.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The drink served to the victim was found unusually cold for the time of year.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Indicates the drink was prepared in advance.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "testimonial",
      "description": "Witnesses state they saw the victim with the drink shortly before ten o'clock.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Provides a timeline for the victim's last moments.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The radiator in the dining room was switched off at the time of the incident.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Confirms that the drink remained cold.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "testimonial",
      "description": "This off radiator confirms that the drink remained cold, supporting the idea of delayed poison activation.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Reinforces the timeline of events.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "behavioral",
      "description": "Hugh Hadley was observed discussing family legacy concerns with the victim just before dinner.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[0]",
      "pointsTo": "Indicates motive for premeditation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Trevor Cheyne because he was seen leaving the premises at eight-thirty.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "Narrow the solution towards other suspects.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "Recreate the dining conditions to compare the drink temperature at the time of the victim's death.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "Necessary for understanding the poison activation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "behavioral",
      "description": "Gertrude Walton was noted to be unusually nervous during the dinner.",
      "sourceInCML": "CASE.cast[4].evidence_sensitivity[0]",
      "pointsTo": "Suggests possible knowledge of the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "testimonial",
      "description": "Witnesses confirmed that they heard a loud argument between the victim and Hugh Hadley shortly before dinner.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Indicates a motive for murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "testimonial",
      "description": "Eliminates Brenda Marlow because she was serving other guests at the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Narrow the solution towards other suspects.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_hugh_hadley",
      "category": "temporal",
      "description": "Direct evidence ties Hugh Hadley to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Hugh Hadley had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_early_1",
      "category": "testimonial",
      "description": "Witnesses state they saw the victim with the drink shortly before ten o'clock.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Provides a timeline for the victim's last moments.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_mid_1",
      "category": "temporal",
      "description": "The victim was poisoned with a time-delayed poison that activated after the guest had been seen with the drink.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Reveals the mechanism of the poisoning.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_1",
      "category": "testimonial",
      "description": "This contradicts the earlier observations about the temperature, indicating a false assumption about the timing of the poisoning.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Overturns the false assumption regarding the timing of the poisoning.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Dinner started at eight o'clock in the evening remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "category": "temporal",
      "description": "The drink served to the victim was found unusually cold for the time of year.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The cold temperature suggests that the drink was prepared well in advance, affecting the timing of the poison's activation.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Some guests believed the victim was poisoned immediately before they were found dead.",
      "supportsAssumption": "The victim was poisoned immediately before they were found dead.",
      "misdirection": "This eyewitnesses misleads by not considering the cold poisoned of the immediately."
    },
    {
      "id": "rh_2",
      "description": "Several guests reported seeing the victim drinking a different beverage earlier in the evening.",
      "supportsAssumption": "The victim was poisoned immediately before they were found dead.",
      "misdirection": "This misleads by suggesting the victim's drinking habits were inconsistent."
    }
  ],
  "status": "fail",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_mechanism_visibility_core",
      "clue_1",
      "clue_3",
      "clue_mid_1",
      "clue_fp_contradiction_step_1"
    ],
    "mid": [
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
      "clue_2",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "clue_culprit_direct_hugh_hadley",
      "clue_early_1",
      "clue_late_1"
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
  "latencyMs": 13664,
  "cost": 0.00149967675
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

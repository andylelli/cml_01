# Actual Prompt Record

- Run ID: `mystery-1778531247623`
- Project ID: ``
- Timestamp: `2026-05-11T20:31:30.895Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `8d38044016bf4895`

## Message 1 (role=system)

```text
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
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
  - storyEmotionalArc.arcDescription MUST be at least 300 words across multiple paragraphs.
    A single-paragraph summary is insufficient regardless of word count — the emotional
    journey must unfold across clearly distinct paragraphs.
    Trace opening → rising tension → first turn → mid → second turn → climax → resolution.
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
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Wealthy heiress and socialite",
      "private_secret": "Investigating her own murder",
      "motive_seed": "Inheritance dispute",
      "motive_strength": "high",
      "alibi_window": "10:00 PM - 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "manor house",
        "gardens"
      ],
      "behavioral_tells": [],
      "stakes": "Inheritance of family estate",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "alibi witness",
      "relationships": [],
      "public_persona": "Respected local physician",
      "private_secret": "Unrequited love for Eleanor",
      "motive_seed": "Desire for approval",
      "motive_strength": "moderate",
      "alibi_window": "10:15 PM - 11:15 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "study",
        "library"
      ],
      "behavioral_tells": [
        "nervous demeanor"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "War veteran and family friend",
      "private_secret": "Gambling debts",
      "motive_seed": "Financial desperation",
      "motive_strength": "high",
      "alibi_window": "10:00 PM - 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "garden",
        "dining room"
      ],
      "behavioral_tells": [
        "sweating",
        "fidgeting"
      ],
      "stakes": "Financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "maid",
      "relationships": [],
      "public_persona": "Loyal servant",
      "private_secret": "Witness to a secret meeting",
      "motive_seed": "Loyalty to Eleanor",
      "motive_strength": "high",
      "alibi_window": "9:30 PM - 10:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "kitchen",
        "hallway"
      ],
      "behavioral_tells": [],
      "stakes": "Job security and loyalty",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "During a stormy evening in the 1930s, Eleanor Voss is found dead in the library of her family's manor house. As the investigation unfolds, the tampering of a clock raises questions about the true time of death and the motives of those closest to her."
    },
    "accepted_facts": [
      "Eleanor was found dead with the clock showing ten minutes past eleven.",
      "Dr. Finch claims he was with Eleanor until ten minutes to eleven.",
      "Captain Hale has gambling debts that could lead to financial motives."
    ],
    "inferred_conclusions": [
      "The clock's time may not reflect the actual time of death.",
      "There are discrepancies in the alibis provided by the suspects."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock was wound back to create a false time of death.",
      "delivery_path": [
        {
          "step": "The clock was tampered with prior to the murder to mislead the investigation."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is revealed, implicating Captain Hale."
    }
  },
  "false_assumption": {
    "statement": "The clock in the library accurately reflects the time of death.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appears to be functioning normally and was wound recently.",
    "what_it_hides": "The tampering of the clock misleads everyone about the actual timeline."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Eleanor's last known alive time at ten minutes to eleven.",
        "The clock showing ten minutes past eleven when found."
      ],
      "windows": [
        "Alibi windows of each suspect overlapping with the time of death."
      ],
      "contradictions": [
        "Dr. Finch's claim of being with Eleanor until ten minutes to eleven contradicts the clock's time."
      ]
    },
    "access": {
      "actors": [
        "Captain Hale",
        "Dr. Finch",
        "Beatrice Quill"
      ],
      "objects": [
        "The clock in the library",
        "Eleanor's body"
      ],
      "permissions": [
        "Staff had limited access to the library during the evening."
      ]
    },
    "physical": {
      "laws": [
        "Physical tampering of mechanical devices can alter their function."
      ],
      "traces": [
        "Fingerprint evidence on the clock."
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor's trust in Captain Hale as a family friend."
      ],
      "authority_sources": [
        "Dr. Finch's professional reputation as a local physician."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the library shows ten minutes past eleven at the time of discovery.",
        "correction": "The time displayed by the clock may not be accurate.",
        "effect": "Narrows the investigation focus to the clock itself.",
        "required_evidence": [
          "The clock's time of ten minutes past eleven.",
          "Witness statements about the clock's last known accurate time."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Finch claims he was with Eleanor until ten minutes to eleven.",
        "correction": "Dr. Finch's alibi may conflict with the clock's time.",
        "effect": "Eliminates Dr. Finch as a credible witness.",
        "required_evidence": [
          "Dr. Finch's statement about the time he was with Eleanor.",
          "The clock's time of ten minutes past eleven."
        ],
        "reader_observable": true
      },
      {
        "observation": "There are unusual wear patterns on the clock's winding mechanism.",
        "correction": "The clock has been tampered with, indicating foul play.",
        "effect": "Narrows suspect actions to those who had access to the clock.",
        "required_evidence": [
          "Wear patterns on the clock's winding mechanism.",
          "Access records for the library on the night of the murder."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock stopped at an earlier time than it should have.",
        "correction": "The time discrepancy directly affects the timeline of the murder.",
        "effect": "Implies that the time of death was earlier than reported.",
        "required_evidence": [
          "The clock's stopped time.",
          "Witness accounts of when Eleanor was last seen."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A reenactment is staged where the clock is compared to a known accurate timepiece, revealing the tampering.",
    "knowledge_revealed": "The revealed facts are clock, tamper, and library.",
    "pass_condition": "If the clock time is shown to be inaccurate compared to the accurate timepiece, it implicates Captain Hale.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_6"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's displayed time (early) and witness accounts (mid) show inconsistencies. Step 2: Dr. Finch's alibi (mid) eliminates him. Step 3: The tampering evidence (discriminating test) clearly identifies Captain Hale."
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
      "scene_number": 2,
      "required_elements": [
        "Execute the discriminating test",
        "Observe the clock's tampering evidence",
        "Draw conclusion about Captain Hale's guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 3,
        "clearance_method": "Proves his alibi through time discrepancies.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 4,
        "clearance_method": "Her loyalty to Eleanor removes her as a suspect.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 5,
      "revelation_method": "Confrontation with evidence of clock tampering."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation of the clock"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Clock mechanism examination"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
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
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Behavioral observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a gracious socialite and philanthropist, revered for her charitable contributions, yet burdened by a hidden financial crisis. She stands at a crossroads of societal expectation and personal desperation.",
    "publicPersona": "Eleanor is the epitome of a gracious host, her soirées a blend of sparkling conversation and generous donations to local charities, painted with the charm of old money and the allure of high society.",
    "privateSecret": "Behind her poised façade, Eleanor is desperately in debt, her family's estate hanging by a thread as she relies on her social standing to maintain appearances and stave off creditors.",
    "motiveSeed": "The stakes rise sharply when the victim's inheritance threatens to confirm her financial ruin, compelling Eleanor to protect her family's legacy at all costs.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims she was in the garden from eight to nine, mingling with guests and enjoying the evening air, but her mind was elsewhere, consumed by thoughts of her failing finances.",
    "accessPlausibility": "easy",
    "stakes": "For Eleanor, this case isn't merely about solving a murder; it's about preserving her family's name and her own fragile financial stability.",
    "humourStyle": "understatement",
    "humourLevel": 0.4,
    "speechMannerisms": "Eleanor speaks with a refined cadence, often punctuating her sentences with soft laughter or sighs, as if her words are carefully chosen to reflect the elegance she wishes to project, even when anxiety gnaws at her.",
    "internalConflict": "Eleanor faces a moral dilemma that pits her need for survival against her desire to uphold the family's dignity, teetering on the edge of desperation.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it is entwined with her family's legacy and the very roof over her head; failure could mean losing everything.",
    "paragraphs": [
      "Eleanor Voss stood in the garden, her fingers delicately tracing the petals of a blooming rose, a serene smile plastered on her face as guests mingled around her. To the outside world, she was the epitome of grace and charity, a woman who poured her heart into philanthropy. Yet, beneath this polished exterior, a tempest brewed. The family estate, once a bastion of wealth and status, was crumbling under the weight of debt that threatened to swallow her whole. Every laugh, every toast, felt like a façade, a mask that hid her desperation.",
      "As the evening wore on, Eleanor's mind drifted away from the laughter and music, fixating instead on the implications of the recent murder. The victim's inheritance, if confirmed, would signal the end of her family's legacy, a fate Eleanor could not bear to contemplate. Her heart raced at the thought of creditors closing in, their whispers echoing in her ears like a haunting melody. She needed to find the truth, to protect what little remained of her family name, even if it meant delving into the murky waters of deceit.",
      "Eleanor's alibi was solid; she had been in the garden, surrounded by guests who could vouch for her presence. But as the clock ticked, she felt the walls closing in, each tick a reminder of her precarious situation. Her charm, once a tool for social navigation, now felt like a double-edged sword, cutting deeper into her own soul. She had to tread carefully, for every interaction could tip the balance between salvation and ruin.",
      "With each passing hour, Eleanor found herself grappling with her internal conflict. Should she continue to uphold the image of the dutiful socialite, or should she risk everything to uncover the truth, even if it meant tarnishing her family's name? The answer lay hidden within the shadows of the past, and Eleanor knew she had to confront her fears if she was ever to reclaim her family's honor."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a dedicated physician whose reputation is built on her commitment to her patients. However, her secret romantic involvement with the victim complicates her life in ways she never anticipated.",
    "publicPersona": "Known for her unwavering dedication to her patients, Dr. Finch is a respected figure in Little Middleton, often seen as a pillar of the community, providing care and compassion.",
    "privateSecret": "In the shadows of her professional life, Mallory harbors a deeply personal secret: a romantic relationship with the murder victim, a liaison that, if exposed, could ruin her career and reputation.",
    "motiveSeed": "The fear of scandal looms large over Mallory; should their affair come to light, it could jeopardize not only her career but also her emotional well-being.",
    "motiveStrength": "strong",
    "alibiWindow": "Mallory asserts she was in her office from seven to ten, treating patients, a claim that is both a shield and a potential trap.",
    "accessPlausibility": "unlikely",
    "stakes": "For Mallory, the stakes are not merely professional; they are deeply personal. She must protect her love while navigating the treacherous waters of potential scandal.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with a measured tone, often employing medical jargon when nervous, but she has a knack for dry humor, using it as a shield against the emotional turmoil that threatens to surface.",
    "internalConflict": "Mallory is torn between her love for the victim and her professional integrity, caught in a web of conflicting loyalties that threatens to unravel her carefully constructed life.",
    "personalStakeInCase": "This case is personal for Mallory because it forces her to confront the reality of her relationship and the potential fallout that could destroy her career and personal life.",
    "paragraphs": [
      "Dr. Mallory Finch sat at her desk, surrounded by patient files and the faint scent of antiseptic, her mind racing with thoughts of the victim. To the world, she was a dedicated physician, a healer who cared deeply for her patients. But beneath this façade lay a secret that could unravel everything she had worked for. Her heart raced at the thought of the affair being exposed, a scandal that would not only tarnish her reputation but also sever the bond she had forged with the victim.",
      "The night of the murder, Mallory had been in her office, treating patients as usual. It was a routine that brought her comfort, yet the weight of her secret hung heavy in the air. Every laugh from the waiting room, every cheerful conversation felt like a taunt, a reminder of what she stood to lose. Her alibi was solid, but the truth was a fickle companion, and she knew that one slip could unravel her carefully constructed life.",
      "As she pondered the implications of the murder, Mallory felt the internal conflict gnawing at her. Was she willing to sacrifice her career for love? The thought sent shivers down her spine. She had always prided herself on her professionalism, yet the heart had a way of complicating matters, twisting logic into a pretzel of emotion. Each moment spent with the victim had been a sweet escape, but now it felt like a noose tightening around her neck.",
      "Dr. Finch knew she had to tread carefully, for the truth was a dangerous game. Her loyalty to the victim clashed with her duty as a physician, and as the investigation unfolded, she found herself caught in a web of conflicting emotions. The stakes were higher than ever, and Mallory realized that the path to uncovering the truth would demand more than just her medical expertise; it would require confronting the very essence of her heart."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer, respected yet disillusioned, grappling with the remnants of his past glory and a simmering resentment towards the victim.",
    "publicPersona": "A stern figure in the community, Captain Hale commands respect with his no-nonsense demeanor and steadfast loyalty to tradition, often seen as the voice of authority.",
    "privateSecret": "Beneath his stoic exterior, Ivor harbors a deep resentment towards the victim, believing that the inheritance should have rightfully belonged to his family, a wound that festers with every passing day.",
    "motiveSeed": "The belief that the victim's inheritance was stolen from him fuels Ivor's desire for retribution, pushing him to confront the ghosts of his past.",
    "motiveStrength": "compelling",
    "alibiWindow": "Ivor claims to have been playing cards with guests from eight to nine, a pastime that provided a veneer of normalcy amidst the unfolding chaos.",
    "accessPlausibility": "possible",
    "stakes": "For Ivor, this case is about reclaiming his family's honor and status, a chance to rewrite the narrative of his life and restore what he believes is rightfully his.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a clipped, authoritative tone, often punctuating his statements with dry humor that hints at his frustrations and disappointments, his words laced with an air of command.",
    "internalConflict": "Ivor is torn between his disillusionment with the world around him and a longing for the glory days of his youth, grappling with the realization that the past may never return.",
    "personalStakeInCase": "This case is deeply personal for Ivor, as it represents a chance to reclaim his family's lost honor and confront the injustice he has felt for years.",
    "paragraphs": [
      "Captain Ivor Hale stood at the edge of the card table, his expression a mixture of stern resolve and barely concealed frustration. To those around him, he was a respected figure, a retired naval officer whose presence commanded respect. Yet beneath this façade lay a simmering resentment towards the victim, a man he believed had usurped his family’s rightful place in society. The inheritance that had slipped through his fingers felt like salt in an old wound, a reminder of the glory days that had long since faded.",
      "As the cards were dealt, Ivor's mind wandered to the implications of the murder. The victim's death presented an opportunity to reclaim what was lost, a chance to confront the injustices that had shaped his life. His alibi of playing cards with guests provided a convenient shield, but Ivor knew that the truth was more complex than mere appearances. The stakes were high, and he felt the weight of his family's legacy pressing down on him, each moment steeped in a sense of urgency.",
      "The internal conflict within Ivor was palpable. He had once been a man of honor, a captain who fought for his country, yet now he found himself grappling with feelings of disillusionment and resentment. The world had changed, and with it, his sense of purpose had waned. As he navigated the treacherous waters of the investigation, Ivor was forced to confront the ghosts of his past, battling the urge to reclaim his family's honor while wrestling with the reality of a world that had moved on without him.",
      "In the shadows of the investigation, Ivor found himself at a crossroads. Should he pursue the truth at any cost, risking everything to restore his family's name, or should he accept the reality of his circumstances and let go of the past? The answers lay hidden within the depths of the case, and Captain Hale knew that the path to redemption would demand more than mere resolve; it would require a reckoning with the very essence of his identity."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious governess, charming and well-liked, yet driven by a relentless desire to climb the social ladder, even if it means stepping on others along the way.",
    "publicPersona": "Beatrice is adored by the children she teaches, her charm and enthusiasm making her a beloved figure in the household, often seen as a bright spot in the lives of those around her.",
    "privateSecret": "Beneath her sunny exterior lies a cunning ambition; Beatrice plans to marry into wealth, viewing the victim as an obstacle to her dreams of social ascension.",
    "motiveSeed": "The victim stands in the way of her aspirations, fueling her desire to eliminate any obstacles that might hinder her climb to the upper echelons of society.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims she was in the children's quarters during the incident, a convenient cover that may or may not hold water.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, this case represents a pivotal moment in her quest for wealth and status, a chance to prove her worth and achieve her dreams.",
    "humourStyle": "blunt",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with an enthusiastic cadence, often punctuating her sentences with exclamations and an eagerness that belies her more calculating nature, occasionally revealing her bluntness when pressed.",
    "internalConflict": "Beatrice grapples with the realization that her ambition may lead her down a dark path, forcing her to confront the cost of her desires and the potential fallout of her actions.",
    "personalStakeInCase": "This case is personal for Beatrice as it challenges her sense of self-worth and the lengths she is willing to go to achieve her dreams of wealth and status.",
    "paragraphs": [
      "Beatrice Quill fluttered around the children's quarters, her laughter ringing out like a bell, bright and infectious. To the world outside, she was a charming governess, adored by the children she taught, a beacon of enthusiasm and warmth. But within the confines of her heart lay a fierce ambition that drove her every action. She had her sights set on marrying into wealth, and the murder victim was nothing more than an obstacle in her path, a hurdle that needed to be cleared.",
      "As the news of the murder spread, Beatrice found herself caught in a whirlwind of emotions. On one hand, she feigned shock and dismay, while on the other, a darker thrill coursed through her veins. The victim's demise presented an unexpected opportunity, a chance to reshape her destiny and ascend the social ladder. Her alibi of being in the children's quarters was convenient, but Beatrice knew that the truth w"
    ]
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Middleton Hall",
    "type": "Country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Middleton Hall, an imposing manor house, stands as a testament to the wealth and secrets of its owners, surrounded by sprawling gardens and meticulously kept grounds.",
    "visualDescription": "The manor's weathered stone facade looms above the manicured hedges, while ivy clings to its walls, hinting at the stories hidden within. Tall, narrow windows reflect the overcast sky, and the gravel driveway crunches beneath the tires of the rare petrol automobiles that visit.",
    "atmosphere": "The atmosphere is thick with tension, echoing the class anxieties and secrets that fill the air.",
    "paragraphs": [
      "Nestled in the heart of the English countryside, Middleton Hall is a grand estate that speaks of opulence and hidden narratives. Its vast grounds stretch endlessly, bordered by ancient oaks whose gnarled branches create a natural barrier against the outside world. The estate is a labyrinth of meticulously cultivated gardens, each corner revealing a different facet of its beauty, yet the hedges and towering trees provide ample concealment for secrets waiting to be uncovered.",
      "As one approaches the manor, the sound of gravel crunching underfoot mingles with the distant calls of birds disturbed by the presence of visitors. The air is thick with the scent of damp earth and blooming roses, a reminder of the recent rains that have left the grounds glistening with moisture. The heavy wooden doors of the manor creak open, revealing a darkened interior where shadows dance in the flickering light of gas sconces, illuminating framed portraits of stern ancestors whose eyes seem to follow every movement.",
      "Inside, the layout of the manor is both grand and confining, with long corridors leading to rooms that are often locked to all but a select few. The drawing room, with its plush, worn armchairs and a fireplace that crackles with warmth, serves as a gathering space for the family and their guests, yet whispers of discontent linger in the corners. The study, cluttered with typewritten manuscripts and papers strewn about, is a haven for secrets, each document holding the potential to unravel the carefully woven tapestry of the family’s reputation.",
      "The estate is not merely a backdrop but a character in its own right, its architecture and grounds influencing the unfolding mystery. With each passing hour, the atmosphere shifts, the tension mounting as the storm clouds gather overhead, mirroring the growing unease among the inhabitants. The secrets hidden within Middleton Hall are as intricate as the hedgerows that surround it, waiting for the right moment to reveal themselves."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with a chance of rain, typical for the season",
    "timeFlow": "Days unfold slowly, each filled with mounting tension and unspoken truths.",
    "mood": "Tense, with underlying class anxieties and secrets",
    "eraMarkers": [
      "Petrol automobiles parked along the gravel driveway",
      "Typewriters clacking in the study, echoing the urgency of written correspondence",
      "Rotary dial telephones resting on ornate side tables, connecting the estate to the outside world"
    ],
    "sensoryPalette": {
      "dominant": "The musty scent of old wood and dampness permeates the air, mingling with floral notes from the gardens.",
      "secondary": [
        "The distant sound of thunder rumbling, heralding an approaching storm",
        "The soft rustle of fabric as guests move through the halls, their whispers barely audible"
      ]
    },
    "paragraphs": [
      "The atmosphere within Middleton Hall is palpable, thickening with each tick of the ornate clock that stands watch over the drawing room. The dark wood paneling absorbs the light, casting deep shadows that seem to harbor secrets of their own. A sense of foreboding lingers, punctuated by the distant rumble of thunder, as if the very walls are holding their breath in anticipation of what is to come.",
      "Outside, the expansive grounds appear deceptively serene, with the scent of blooming roses filling the air, yet the oppressive sky looms overhead, threatening rain that could wash away the carefully curated facades of the estate. The sound of wind rustling through the trees adds to the tension, whispering secrets that only the manor seems to understand. Every moment stretches, heavy with the weight of unspoken words, as the characters navigate their intertwined fates within the confines of this grand but isolating home."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room features faded floral wallpaper, large bay windows draped with heavy velvet curtains, and an ornate chandelier casting a warm glow over the room. A grand piano sits in one corner, its surface dusted with neglect, while a collection of well-worn books line the shelves, inviting guests to linger.",
      "sensoryDetails": {
        "sights": [
          "The rich hues of the wallpaper, now dulled with age, create a cozy yet melancholic atmosphere, while the flickering light from the fireplace casts dancing shadows across the room.",
          "A collection of family portraits adorn the walls, their solemn expressions seeming to scrutinize every conversation held beneath their gaze."
        ],
        "sounds": [
          "The soft crackle of the fireplace competes with the muted conversations of guests, creating a symphony of intrigue that echoes through the room.",
          "Occasionally, the distant sound of laughter from the garden breaks through, a reminder of the life outside the drawing room's heavy doors."
        ],
        "smells": [
          "The scent of aged leather from the armchairs mingles with the faint fragrance of burning wood, creating an inviting yet somber air.",
          "Hints of lavender from the potpourri placed strategically around the room offer a subtle contrast to the heavier scents of the manor."
        ],
        "tactile": [
          "The plush texture of the armchairs invites guests to sink into their depths, while the coolness of the marble fireplace provides a stark contrast.",
          "The polished wooden table feels smooth beneath fingertips, yet the weight of the secrets it bears is palpable."
        ]
      },
      "accessControl": "The drawing room is accessible to family and invited guests during social hours, but staff must knock and receive permission to enter, creating a barrier between the household's inner circle and the help.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the windows, distorting the view of the garden beyond, while the light inside is dim and muted.",
            "The room appears softer, as if the rain has washed away some of its former vibrancy."
          ],
          "sounds": [
            "The steady patter of rain against the glass provides a soothing backdrop, while the occasional clap of thunder reverberates through the manor.",
            "The sound of water dripping from the eaves adds a rhythmic quality to the atmosphere."
          ],
          "smells": [
            "The air is heavy with the scent of wet earth and blooming flowers, a reminder of the lush gardens outside.",
            "A faint whiff of damp paper and dust from the bookshelves underlines the age of the room."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is flat and grey, casting a muted glow over the room, while shadows grow long as the day wears on.",
            "The flickering flames in the fireplace create a warm contrast to the chill in the air."
          ],
          "sounds": [
            "Silence reigns, broken only by the occasional creak of the old floorboards or the distant ticking of the clock.",
            "The sound of a typewriter from the study adds a layer of urgency to the stillness."
          ],
          "smells": [
            "The lingering aroma of tobacco smoke from earlier conversations mingles with the scent of polished wood, creating a nostalgic atmosphere.",
            "The faint fragrance of old books hangs in the air, a testament to the history held within the shelves."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers, casting a warm glow that dances across the room, highlighting the rich textures of the furnishings.",
            "The darkening sky outside contrasts sharply with the inviting warmth within."
          ],
          "sounds": [
            "The soft murmur of conversation fills the air, punctuated by the occasional clink of glasses as guests toast to one another.",
            "The distant sounds of laughter from the garden create an atmosphere of camaraderie and tension."
          ],
          "smells": [
            "The scent of candle wax mingles with the aroma of fine wine, creating a sophisticated atmosphere for the evening's gathering.",
            "A hint of woodsmoke from the fireplace adds a rustic charm to the luxurious surroundings."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room is the heart of the manor, where family and guests gather to share stories and secrets beneath the watchful eyes of ancestors. Plush armchairs are arranged around a polished mahogany table, inviting intimate conversations, yet the air is thick with unspoken tension, as if the walls themselves are privy to the secrets that swirl within. The flickering flames of the fireplace cast a warm glow, momentarily dispelling the chill that seeps through the heavy curtains, but the atmosphere is laden with a sense of unease, hinting at the revelations that lie just beneath the surface.",
        "As the day progresses, the drawing room transforms with the changing light; morning rain brings an oppressive stillness, while the afternoon grey creates an uneasy calm. Evening clear heralds a shift, as laughter spills from the garden, echoing the underlying tension that accompanies the guests. Each moment spent in this room feels charged with anticipation, as if the very fabric of the manor is holding its breath, waiting for the next revelation to unfold."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The study is cluttered with bookshelves overflowing with dusty tomes and papers, a large oak desk dominates the space, its surface littered with half-finished manuscripts and a vintage typewriter. A single window overlooks the garden, framed by heavy curtains that block out much of the daylight.",
      "sensoryDetails": {
        "sights": [
          "The study is a chaotic yet inviting space, with stacks of books teetering precariously beside a globe that has seen better days, hinting at the interests of its occupant.",
          "Sunlight filters through the curtain, casting a muted glow over the desk and illuminating the dust motes that dance in the air."
        ],
        "sounds": [
          "The rhythmic clacking of the typewriter fills the room, punctuated by the occasional rustle of papers as ideas are hastily jotted down.",
          "Outside, the faint sound of birds chirping provides a stark contrast to the focused silence within the study."
        ],
        "smells": [
          "The scent of aged paper and leather bindings permeates the air, a reminder of the countless stories contained within the books that line the shelves.",
          "A hint of tobacco smoke lingers, a testament to the late-night musings of the study's frequent occupant."
        ],
        "tactile": [
          "The smooth surface of the desk contrasts with the rough texture of the books piled atop it, creating a tactile reminder of the intellectual pursuits that take place here.",
          "The coolness of the windowpane offers a refreshing respite from the warmth of the study, inviting thoughts to wander beyond the confines of the room."
        ]
      },
      "accessControl": "The study is accessible to family members and trusted guests, but staff must request permission to enter, ensuring that the secrets within are kept guarded.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the window, distorting the view of the garden, while the room is cast in a soft, muted light.",
            "The desk is cluttered with papers, their edges curling from the humidity."
          ],
          "sounds": [
            "The steady patter of rain against the roof creates a soothing ambiance, interrupted only by the clatter of the typewriter as ideas flow.",
            "Occasional rumbles of thunder add a dramatic flair to the atmosphere."
          ],
          "smells": [
            "The scent of damp wood mingles with the mustiness of old books, creating a rich olfactory tapestry that envelops the space.",
            "A hint of mildew lurks in the corners, a reminder of the manor's age."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light is dim, with shadows pooling in the corners, creating a sense of foreboding as the day drags on.",
            "The desk appears more cluttered than usual, as if the weight of the secrets it holds is pressing down."
          ],
          "sounds": [
            "The typewriter's clacking is a steady heartbeat in the silence, while the distant ticking of a clock adds to the mounting tension.",
            "The occasional rustle of paper echoes as thoughts are hastily recorded."
          ],
          "smells": [
            "The air is thick with the scent of ink and paper, a testament to the creativity and frustration that fills the room.",
            "The faint aroma of stale coffee lingers, hinting at late-night work sessions."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The fading light casts long shadows across the room, while the glow from a desk lamp creates a cozy yet isolating atmosphere.",
            "The desk is now covered with notes and manuscripts, evidence of the day's labor."
          ],
          "sounds": [
            "The soft rustle of paper fills the air as ideas are jotted down, while the distant sounds of laughter from the drawing room echo faintly.",
            "The clock ticks steadily, marking time as the evening wears on."
          ],
          "smells": [
            "The warm scent of freshly brewed tea wafts through the air, mingling with the lingering aroma of tobacco.",
            "The scent of polished wood from the desk adds a layer of sophistication to the space."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The study is a sanctuary of thought, where ideas are born and secrets are penned into existence. The cluttered desk, a testament to the tireless pursuit of knowledge, is surrounded by shelves filled with tomes that whisper of past revelations. Here, the air is thick with the scent of ink and aged paper, inviting those who enter to lose themselves in the mysteries that lie within the pages. Yet, amidst the comfort of familiarity, an undercurrent of tension flows through the room, as if the very walls are aware of the hidden truths waiting to be uncovered.",
        "As the day unfolds, the atmosphere of the study shifts dramatically. Morning rain brings a sense of oppression, the sound of water harmonizing with the clatter of the typewriter, while the afternoon grey envelops the room in an uneasy stillness. By evening, the clearing skies bring a tense anticipation, as the soft glow of the desk lamp illuminates the frantic notes and sketches scattered across the desk. The study stands as a crucible of creativity and secrets, its very essence steeped in the weight of what has yet to be revealed."
      ]
    },
    {
      "id": "kitchen",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The kitchen is a bustling hub of activity, filled with the gleaming surfaces of copper pots and pans hanging from racks, while a large wooden table takes center stage, surrounded by mismatched chairs. Sunlight streams through the small window, illuminating the worn tiles that speak to years of hearty meals prepared within.",
      "sensoryDetails": {
        "sights": [
          "The kitchen is alive with color, from the vibrant vegetables piled high on the counter to the warm glow of the stove's flame, creating an inviting and homely atmosphere.",
          "Hanging herbs dry from the ceiling, their earthy tones contrasting with the gleaming silverware and polished surfaces, while the scent of something simmering wafts through the air."
        ],
        "sounds": [
          "The rhythmic chopping of vegetables fills the air, accompanied by the soft bubbling of pots on the stove, creating a symphony of domestic life.",
          "The occasional clang of pots and pans adds a lively cadence to the atmosphere, while the hum of conversation among the kitchen staff underlines the camaraderie present in this bustling space."
        ],
        "smells": [
          "The rich aroma of roasting meat mingles with the sweetness of freshly baked bread, creating an irresistible invitation to linger.",
          "A hint of herbs and spices wafts through the air, tantalizing the senses and hinting at the delicious meals prepared within these walls."
        ],
        "tactile": [
          "The coolness of the tiled floor contrasts with the warmth radiating from the oven, creating a cozy yet functional environment for the cooks.",
          "The smooth surface of the wooden table invites hands to knead dough, while the texture of the worn chairs adds a rustic charm to the space."
        ]
      },
      "accessControl": "The kitchen is accessible to all staff and family members, though the head cook maintains authority over activities, ensuring that the flow of work remains uninterrupted.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the small window, distorting the view of the garden outside, while the kitchen is bathed in a soft, diffused light.",
            "The warmth from the stove contrasts with the coolness of the air, creating a cozy yet slightly damp atmosphere."
          ],
          "sounds": [
            "The sound of rain pattering against the roof creates a soothing backdrop, while the clatter of pots and pans adds a lively rhythm to the morning's preparations.",
            "The occasional shout from the head cook commands attention, punctuating the domestic harmony."
          ],
          "smells": [
            "The scent of freshly baked bread mingles with the aroma of brewing tea, creating a comforting embrace as the day begins.",
            "Hints of damp earth from the garden waft through the window, adding a natural freshness to the air."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The kitchen is dimly lit, with shadows pooling in the corners as the afternoon light wanes, creating a slightly claustrophobic feel.",
            "The table is strewn with ingredients, evidence of the day's labor, while the air hangs heavy with anticipation."
          ],
          "sounds": [
            "The sound of chopping and sizzling fills the air, creating a comforting rhythm that contrasts with the oppressive atmosphere outside.",
            "The chatter amongst the kitchen staff grows more animated, as they share tidbits of gossip and laughter."
          ],
          "smells": [
            "The rich aroma of simmering sauces and baked goods fills the air, creating a sensory feast that is both inviting and overwhelming.",
            "The scent of onions and garlic being sautéed adds an earthy depth to the atmosphere, hinting at the flavors to come."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The kitchen is aglow with the warm light of hanging lamps, casting a soft illumination over the preparations for the evening meal.",
            "The table is beautifully set, with dishes laid out in anticipation of the family gathering."
          ],
          "sounds": [
            "The clatter of dishes being arranged creates a lively atmosphere, while laughter from the dining room filters in, creating a sense of warmth and community.",
            "The soft bubbling of pots on the stove adds a comforting backdrop to the evening's preparations."
          ],
          "smells": [
            "The delicious aroma of roasted vegetables and seasoned meats wafts through the air, creating an intoxicating invitation to the dining table.",
            "The scent of freshly chopped herbs adds a bright note, enhancing the overall culinary experience."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The kitchen is the beating heart of Middleton Hall, a lively hub where the smells of home-cooked meals intermingle with the sounds of laughter and chatter. Sunlight streams through the small window, illuminating the tiled floor and creating a warm atmosphere that invites all who enter. Here, the air is rich with the aromas of roasting meats and baking bread, drawing family members and guests alike into its embrace. Yet, beneath the surface of this culinary paradise lies an undercurrent of tension, as the staff navigate the delicate balance of service and secrecy.",
        "As the day progresses, the kitchen transforms with the weather outside. Morning rain brings a sense of oppression, the sound of pattering drops creating a tranquil yet heavy atmosphere, while the afternoon grey envelops the room in an uneasy stillness, shadows deepening as the light fades. By evening, the kitchen bursts to life, aglow with warm light and the promise of a hearty meal, yet the tension remains palpable, hinting at the secrets that simmer beneath the surface of the family’s carefully curated facade."
      ]
    }
  ],
  "note": "",
  "cost": 0.00275651145,
  "durationMs": 43895
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1930,
    "month": "January",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "overcast skies",
      "chilly temperatures",
      "occasional rain showers"
    ],
    "daylight": "Short days with daylight fading by 4:30 PM, leaving long, dark evenings.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded.",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "indoor gatherings by the fireplace",
      "playing parlor games",
      "reading novels by candlelight"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool three-piece suit",
        "crisp white dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed jacket",
        "corduroy trousers",
        "woolen sweater"
      ],
      "accessories": [
        "pocket watch",
        "felt fedora",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant drop-waist evening gown",
        "embroidered silk shawl",
        "cloche hat"
      ],
      "casual": [
        "knitted cardigan",
        "tea-length dress with floral patterns",
        "ankle boots"
      ],
      "accessories": [
        "string of pearls",
        "feathered headband",
        "leather handbag"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in fashion",
      "increased popularity of tailored garments",
      "use of bold patterns and colors"
    ],
    "socialExpectations": [
      "maintaining formal etiquette at social gatherings",
      "demonstrating class through fashion choices",
      "adherence to gender roles in social interactions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Great Depression continues to impact economies globally",
      "Unrest in Europe with rising unemployment rates",
      "Debates in the U.S. Congress regarding relief measures"
    ],
    "politicalClimate": "Tensions are high as nations grapple with economic turmoil and the implications of the stock market crash of 1929.",
    "economicConditions": "Widespread poverty and unemployment; many families struggle to afford basic necessities.",
    "socialIssues": [
      "rising class tensions",
      "gender inequality in the workplace",
      "racial tensions in various regions"
    ],
    "internationalNews": [
      "Germany faces hyperinflation challenges",
      "Dangerous conditions in the coal mines of Wales lead to protests"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'My Blue Heaven' by Gene Austin",
        "'Ain't She Sweet' by Milton Ager",
        "'The Birth of the Blues' by Paul Whiteman"
      ],
      "films": [
        "'The Love Parade'",
        "'The Big House'",
        "'The Jazz Singer'"
      ],
      "theater": [
        "'The Front Page'",
        "'The Royal Family'",
        "'The Music Box Revue'"
      ],
      "radio": [
        "Amos 'n' Andy",
        "The Shadow",
        "The Columbia Workshop"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Great Gatsby' by F. Scott Fitzgerald"
      ],
      "popularGenres": [
        "mystery novels",
        "social realism",
        "adventure fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator gaining popularity",
        "increased use of the gramophone",
        "the development of early sound recording techniques"
      ],
      "commonDevices": [
        "typewriters",
        "home telephones",
        "petrol automobiles"
      ],
      "emergingTrends": [
        "home appliances becoming more common",
        "the rise of motion picture technology",
        "the spread of radio as a medium for entertainment"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Eggs (dozen): one shilling",
        "Coal (scuttle): one shilling sixpence"
      ],
      "commonActivities": [
        "gathering for tea in the afternoon",
        "attending local dances or social events",
        "participating in charitable activities"
      ],
      "socialRituals": [
        "formal dinner parties",
        "afternoon tea gatherings",
        "Sunday church services"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased awareness of class divide",
      "growing resentment among lower classes towards the wealthy"
    ],
    "gender": [
      "women are increasingly entering the workforce",
      "traditional gender roles are being challenged but still prevalent",
      "expectation for women to maintain domestic duties"
    ],
    "race": [
      "racial segregation persists in many areas",
      "emerging civil rights movements begin to gain traction"
    ],
    "generalNorms": [
      "formality in public and private interactions",
      "expectation of courtesy and respect based on social hierarchy",
      "importance placed on family reputation"
    ]
  },
  "atmosphericDetails": [
    "The smell of burning wood mingled with dampness as the fire crackled in the grand hall.",
    "The muffled sound of rain tapping against the windowpanes creates a tense, foreboding atmosphere.",
    "Chilly drafts seep through old wooden doors, heightening the sense of unease among the guests."
  ],
  "paragraphs": [
    "In January 1930, the country estate is cloaked in a heavy overcast sky, the chill of winter palpable as the rain threatens to dampen the evening's festivities. Gatherings are confined to the warmth of the grand hall, where guests huddle by the fireplace, playing parlor games and recounting tales from the past. The mood is tense, with unspoken class anxieties lingering in the air as staff and guests navigate the rigid etiquette of the times. As darkness falls early in the afternoon, the flickering glow of candles becomes a comforting sight amidst the growing shadows.",
    "Fashion reflects the era, with men donning tailored wool suits adorned with geometric silk ties, while women grace the room in elegant drop-waist gowns, their cloche hats adding an air of sophistication. The popularity of Art Deco influences is evident in bold patterns and tailored garments, showcasing social status even in moments of economic despair. Accessories such as pocket watches and feathered headbands serve as reminders of class distinctions, with every detail carefully curated to maintain appearances amidst the reality of the Great Depression.",
    "Daily life is consumed by the struggle of the current times, with a loaf of bread costing four pence and coal needed to keep homes warm. Despite the financial hardships, social rituals persist, with formal dinner parties and afternoon tea gatherings serving as essential social glue. The growing divide between the wealthy and the working class is palpable; tensions simmer just beneath the surface as whispers of discontent echo through the halls. The social landscape is shifting, yet the expectations of decorum remain unyielding, creating a delicate balance between tradition and the inevitable changes that lie ahead."
  ],
  "note": "",
  "cost": 0.00102754905,
  "durationMs": 16804
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A family gathering for a contentious estate meeting amidst the Great Depression forces the wealthy and their staff into a tense standoff over inheritance and privilege.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class tensions are heightened by the economic downturn, with formal etiquette governing interactions between the affluent owners and their struggling staff."
  },
  "setting": {
    "location": "A large and imposing manor house with expansive grounds, gardens, and outbuildings.",
    "institution": "Country house estate",
    "weather": "Overcast with a chance of rain, typical for the season."
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
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the library shows ten minutes past eleven at the time of discovery.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time of discovery is established.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The time displayed by the clock may not be accurate.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The clock's time cannot be trusted.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Dr. Finch claims he was with Eleanor until ten minutes to eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Dr. Finch's timeline is established.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "Dr. Finch's alibi may conflict with the clock's time.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Dr. Finch's alibi is questionable.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "There are unusual wear patterns on the clock's winding mechanism.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "The clock may have been manipulated.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The clock has been tampered with, indicating foul play.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Foul play is suggested.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "The clock stopped at an earlier time than it should have.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "The clock's time is inconsistent.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "The time discrepancy directly affects the timeline of the murder.",
      "sourceInCML": "CASE.inference_path.steps[3].correction",
      "pointsTo": "The timeline of the murder is questionable.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "behavioral",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was seen leaving the library at eleven o'clock.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Dr. Mallory Finch's alibi is corroborated.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The time displayed by the clock may not be accurate.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The clock's time cannot be trusted.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "A mechanical clock was wound back to create a false time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "The method of deception is revealed.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Eleanor's last known alive time at ten minutes to eleven. remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The library library appears to function normally, suggesting no tampering.",
      "supportsAssumption": "The clock in the library accurately reflects the time of death.",
      "misdirection": "This misleads by implying that the library's condition is reliable, while evidence suggests otherwise."
    },
    {
      "id": "rh_2",
      "description": "Witnesses claim they saw Dr. Finch near the library at the time of death.",
      "supportsAssumption": "The clock in the library accurately reflects the time of death.",
      "misdirection": "This misleads by suggesting Dr. Finch's presence is incriminating, while his alibi is corroborated."
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
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_core_elimination_chain"
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
  "latencyMs": 15370,
  "cost": 0.0047173665
}

---

## OUTPUT INSTRUCTIONS

Produce a single JSON object with ALL of the following fields.

Return the JSON object directly — no preamble, no markdown fences, no commentary.

MANDATORY FIELD LENGTHS:
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- storyEmotionalArc.arcDescription: MINIMUM 300 words, target 350 words. This is an emotional map
  of the full story journey — not a one-paragraph summary. It must trace the emotional register from
  opening chapter through rising tension to climax and resolution. Multiple paragraphs expected.
  A response shorter than 300 words will fail the quality gate. Count your words.
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

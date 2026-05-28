# Actual Prompt Record

- Run ID: `mystery-1779396354473`
- Project ID: ``
- Timestamp: `2026-05-21T20:50:51.553Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `9340f8758851ed8e`

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
    "title": "The Clock Strikes Guilt",
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
      "institution": "country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "inheritance dispute"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Victim",
      "relationships": [
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (distant relative)"
      ],
      "public_persona": "An affluent socialite known for her charm and wit.",
      "private_secret": "Struggling with debts due to her late father's estate.",
      "motive_seed": "Inheritance dispute over her father's estate.",
      "motive_strength": "strong",
      "alibi_window": "None, found dead",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Loss of inheritance",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Friend",
      "relationships": [
        "Eleanor Voss (close friend)",
        "Beatrice Quill (detective)"
      ],
      "public_persona": "A respected physician with a calm demeanor.",
      "private_secret": "Involved in a financial arrangement with Eleanor.",
      "motive_seed": "Concern for Eleanor's wellbeing.",
      "motive_strength": "moderate",
      "alibi_window": "10:00 PM - 11:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "manor access"
      ],
      "behavioral_tells": [
        "excessive concern for the victim"
      ],
      "stakes": "Friendship and reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Relative",
      "relationships": [
        "Eleanor Voss (distant relative)",
        "Dr. Mallory Finch (acquaintance)"
      ],
      "public_persona": "A retired military officer with a stern disposition.",
      "private_secret": "Bitter about his own financial losses.",
      "motive_seed": "Desire for Eleanor's inheritance.",
      "motive_strength": "high",
      "alibi_window": "10:30 PM - 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "garden access"
      ],
      "behavioral_tells": [
        "irritable under pressure"
      ],
      "stakes": "Financial gain from inheritance",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (associate)"
      ],
      "public_persona": "An astute detective known for her clever deductions.",
      "private_secret": "Has a personal interest in the case due to friendship with the victim.",
      "motive_seed": "Desire to solve the case.",
      "motive_strength": "moderate",
      "alibi_window": "None, present at the scene.",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional integrity and friendship",
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
      "summary": "During a family reunion at a sprawling manor house, Eleanor Voss is found dead. As tensions rise among the heirs, Beatrice Quill uncovers a web of deceit linked to a tampered clock that misleads everyone about the time of death."
    },
    "accepted_facts": [
      "Eleanor was found dead in the study.",
      "The clock in the study shows ten minutes past eleven.",
      "Witnesses heard the clock striking the hour shortly before the discovery of the body."
    ],
    "inferred_conclusions": [
      "The time of death may have been manipulated."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was tampered with to misrepresent the time of death.",
      "delivery_path": [
        {
          "step": "The clock was wound back to show a later time than the actual time of death."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is revealed, implicating Captain Ivor Hale."
    }
  },
  "false_assumption": {
    "statement": "The time of death must align with the clock's displayed hour.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock is an authority in the household, and everyone assumes it is functioning correctly.",
    "what_it_hides": "The clock was tampered with to mislead the investigation."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Time of death at 10:15 PM",
        "Clock shows 11:10 PM"
      ],
      "windows": [
        "10:00 PM - 11:00 PM"
      ],
      "contradictions": [
        "Witnesses heard clock striking the hour before discovery, but clock shows a different time."
      ]
    },
    "access": {
      "actors": [
        "Captain Ivor Hale",
        "Dr. Mallory Finch"
      ],
      "objects": [
        "The clock",
        "The study"
      ],
      "permissions": [
        "Access to the study during the reunion"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be manipulated to show incorrect times"
      ],
      "traces": [
        "Scratch marks on the clock's casing indicating tampering"
      ]
    },
    "social": {
      "trust_channels": [
        "Family loyalty",
        "Authority of the clock"
      ],
      "authority_sources": [
        "Captain Hale's status as a family member"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock shows ten minutes past eleven, despite witnesses recalling it striking the hour before discovery.",
        "correction": "The clock's displayed time conflicts with witness statements, indicating possible tampering.",
        "effect": "Narrows the investigation focus to Captain Ivor Hale.",
        "required_evidence": [
          "The clock shows ten minutes past eleven.",
          "Witnesses recall the clock striking the hour just before the murder occurred."
        ],
        "reader_observable": true
      },
      {
        "observation": "Distinct scratch marks are found on the clock's casing.",
        "correction": "These marks suggest recent tampering, contradicting the assumption that the clock is functioning normally.",
        "effect": "Eliminates the idea that the clock was untouched and reliable.",
        "required_evidence": [
          "The clock mechanism contains a distinct scratch indicating recent tampering.",
          "Witness statements about the clock's reliability."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory Finch's alibi places her in a different part of the house during the time of death.",
        "correction": "With her alibi confirmed, focus shifts away from her as a suspect.",
        "effect": "Eliminates Dr. Mallory Finch from suspicion.",
        "required_evidence": [
          "Dr. Mallory Finch's alibi window is verified.",
          "Access records confirm she was in the library at the time."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, minut, and eleven against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, murder, and minut.",
    "pass_condition": "If the clock's time does not match the independent time source, implicating tampering.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_culprit_direct_captain_ivor_hale"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's displayed time and witness statements create a contradiction about the time of death. Step 2: Scratch marks on the clock indicate tampering. Step 3: Dr. Mallory Finch's verified alibi eliminates her from suspicion."
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
        "Observe the clock's timing against an independent source",
        "Draw conclusion about tampering"
      ],
      "test_type": "temporal"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verification",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: None, found dead",
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical examination"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a charming socialite with ambitions that stretch far beyond the confines of her late father's estate. With a penchant for lavish parties and a carefully curated public persona, she is driven by a fear of losing her financial security and social standing.",
    "publicPersona": "Charming and generous, she hosts lavish parties to maintain her social standing.",
    "privateSecret": "Has been embezzling from her late father's estate to fund her lifestyle.",
    "motiveSeed": "Stands to gain a significant inheritance from a disputed family estate if the victim's claims are silenced.",
    "motiveStrength": "strong",
    "alibiWindow": "was seen in the garden from eight to ten o'clock",
    "accessPlausibility": "easy",
    "stakes": "Her reputation and financial security depend on maintaining a favorable image.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks with a refined accent, often using flowery language, but with an edge that hints at her true intentions. Occasionally drops polite barbs that reveal her sharper side.",
    "internalConflict": "Eleanor grapples with the guilt of her embezzlement while fearing the fallout if her secrets come to light. The tension between her ambition and morality weighs heavily on her.",
    "personalStakeInCase": "This crime could expose her financial misdeeds and ruin the carefully constructed facade she has built for herself.",
    "paragraphs": [
      "Eleanor Voss glided through the opulent ballroom of her latest soirée, a vision of grace and charm. The laughter of her guests echoed around her as she deftly maneuvered conversations, ensuring that everyone felt seen and valued. But behind her dazzling smile lay a heart gripped by anxiety. The whispers of a family dispute regarding her late father's estate had reached her ears, and with it a chilling realization: her comfortable life was teetering on the edge of collapse.",
      "In the garden, the moonlight caught the glimmer of her diamond earrings as she wandered amongst the flowers, feigning delight at the evening's festivities. Yet, her thoughts were consumed by the growing threat posed by the victim, whose claims could unravel the delicate threads of her financial security. If only she could silence those claims, she would be free to continue her extravagant lifestyle, unencumbered by the past.",
      "Eleanor's public persona was one of generosity and charm, but her private world was a tangled web of deceit. She had been siphoning funds from her father's estate, a secret that could shatter her reputation if exposed. As she laughed and danced, she felt the weight of her actions pressing down on her, a constant reminder of the moral line she had crossed in pursuit of her ambitions.",
      "The stakes rose higher with each passing moment, and Eleanor could feel the noose tightening. Would she be able to navigate the treacherous waters of her social circle without revealing her secrets? Or would the truth claw its way to the surface, dragging her down into the depths of scandal? With her heart pounding, she vowed to protect her carefully crafted image at any cost, even if it meant resorting to desperate measures."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a compassionate physician whose dedication to her patients is only matched by her unyielding commitment to her public image. Beneath her calm exterior lies a web of secrets that threaten to unravel her career and personal life.",
    "publicPersona": "Respected doctor known for her charity work and advocacy for the underprivileged.",
    "privateSecret": "Is in a romantic relationship with the victim's estranged sibling, which could ruin her career if revealed.",
    "motiveSeed": "Could be coerced into silence about a family secret that would damage her reputation and career.",
    "motiveStrength": "moderate",
    "alibiWindow": "was at a patient’s home from seven to nine o'clock",
    "accessPlausibility": "possible",
    "stakes": "Her professional standing and personal relationships are on the line.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Her speech is measured and precise, often punctuated by a gentle, knowing laugh. She tends to use medical metaphors and has a habit of avoiding direct answers when pressed.",
    "internalConflict": "Mallory is torn between her professional obligations and her personal desires, fearing that revealing her relationship could lead to scandal and professional ruin.",
    "personalStakeInCase": "The crime not only threatens her reputation but also the happiness she has found in her relationship, which she is desperate to protect.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her office, the soft hum of the hospital around her, a sanctuary she had built through years of hard work and dedication. Patients admired her for her unwavering compassion, yet few knew the turmoil that simmered beneath her calm demeanor. Her heart raced as she recalled the secret she harbored — a romance with the victim's estranged sibling, a relationship that could shatter her esteemed reputation should it come to light.",
      "As she made her rounds, Mallory offered soothing words to her patients, her voice a balm for their ailments. Yet, with each appointment, the gnawing worry about the victim's claims loomed larger. If the truth about her relationship were to emerge, it would not only tarnish her career but also expose her to the scorn of a community that had once held her in high regard. The duality of her life felt like a fragile balancing act, one misstep away from disaster.",
      "In the quiet moments between patients, she often found herself lost in thought, weighing the risks of silence against the potential fallout of her truth. Could she maintain her carefully constructed facade while loving someone who was at the center of a family feud? The stakes felt impossibly high, and the fear of losing everything she had worked for was paralyzing.",
      "Ultimately, the case was not just about another patient's well-being — it was about her heart. Mallory knew she had to confront her fears and decide whether to reveal her relationship for the sake of love or continue hiding behind the mask of professionalism. The clock was ticking, and as she pondered her choices, she felt the pressure of her dual life threatening to unravel her."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a stern traditionalist whose life is defined by duty and honor. A retired naval officer, he finds himself grappling with a changing world that threatens his legacy and the very estate that has been in his family for generations.",
    "publicPersona": "A stern but respected figure in the community, known for his strict adherence to duty.",
    "privateSecret": "Struggles with his declining status and fears being viewed as irrelevant in a changing world.",
    "motiveSeed": "Has been threatened to lose his family’s ancestral estate if the victim successfully claims their inheritance.",
    "motiveStrength": "strong",
    "alibiWindow": "was in the library from eight-thirty to ten o'clock",
    "accessPlausibility": "possible",
    "stakes": "His legacy and the family honor are at stake.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "His speech is direct and authoritative, often punctuated by military jargon. He has a tendency to speak in imperatives, reflecting his no-nonsense approach to life.",
    "internalConflict": "Ivor is wrestling with feelings of inadequacy and obsolescence, as he fears becoming irrelevant in a society that no longer values the old ways.",
    "personalStakeInCase": "This crime threatens not only his family's estate but also the honor and legacy he has dedicated his life to preserving.",
    "paragraphs": [
      "Captain Ivor Hale stood in the grand library of his ancestral home, surrounded by the weight of history and tradition. The polished wood and leather-bound tomes offered a sense of comfort, yet his heart was heavy with the burden of impending loss. The whispers of the victim's inheritance claims echoed in his mind, a dissonant reminder that his family's legacy was at stake, and with it, his very sense of self.",
      "As he surveyed the room, Ivor's thoughts turned to the changing tides of society. The rigid structure he had once fought to uphold was crumbling, and he felt himself slipping into irrelevance. The younger generation seemed to scoff at the values he had cherished, and with every passing day, he wrestled with the fear that he would be remembered as a relic, a man out of time.",
      "His public persona commanded respect; he was a figure of authority and duty. Yet beneath that exterior lay a man struggling with his own worth. The stakes were not just about property; they were about honor, about proving to himself and others that he still mattered in this new world. Ivor's mind raced with the implications of the victim's claims — the very estate that had been the pride of his family could slip through his fingers.",
      "With each tick of the clock, he felt the pressure mounting. Would he be able to adapt to the changes around him, or would he stubbornly cling to the ideals that had defined his life? The choice lay heavy upon him, and as he prepared for the confrontation ahead, he steeled himself for the battle, determined to protect his family's legacy at all costs."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an aspiring author whose sensitivity often leaves her feeling overlooked and unappreciated. With a gift for observation, she possesses knowledge that could change the course of the investigation, but her insecurities may prevent her from speaking out.",
    "publicPersona": "An introverted writer who is often overlooked in social situations.",
    "privateSecret": "Is in possession of a diary containing scandalous information about the victim's family.",
    "motiveSeed": "Could be motivated by jealousy of the victim’s success and the fear of being left behind in the literary world.",
    "motiveStrength": "moderate",
    "alibiWindow": "was at the local café from eight to nine-thirty",
    "accessPlausibility": "unlikely",
    "stakes": "Her aspirations and self-worth are tied to her writing and reputation.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks softly and hesitantly, often trailing off as if unsure of her own worth. She has a tendency to use literary references and metaphors, which sometimes makes her appear more thoughtful than confident.",
    "internalConflict": "Beatrice struggles with her own self-worth, torn between her ambition and her fear of being overshadowed by more successful voices.",
    "personalStakeInCase": "The crime affects her not only as a writer but also as a person, as it brings to light her insecurities and the fear of being ignored.",
    "paragraphs": [
      "Beatrice Quill sat in the corner of the local café, her notebook resting on the table before her, a blank canvas for her thoughts. As she nursed her cup of tea, she felt like a shadow in the bustling world around her, an unnoticed observer of the drama that unfolded in the lives of others. Her aspirations of becoming a published author felt increasingly distant, overshadowed by the success of others, particularly the victim, whose life seemed to command the attention of all.",
      "With each scribbled word, Beatrice poured her heart into her writing, but the nagging feeling of inadequacy lingered. She held a secret that could change everything — a diary containing scandalous information about the victim's family. Yet, the fear of stepping into the light and claiming her voice left her paralyzed. What if her revelations only deepened her own insignificance? The thought was unbearable.",
      "In social situations, Beatrice often found herself retreating into her thoughts, her contributions to conversations barely audible. She had a talent for observation, seeing the nuances of human behavior that others missed, but translating that into action was a different story. The stakes felt high, and with each passing day, she grappled with the desire to speak out against her insecurities, wondering if she could ever find the courage to share her knowledge.",
      "As the investigation unfolded, Beatrice felt the weight of her decision growing heavier. Would she remain in the background, allowing her fears to dictate her actions, or would she step forward and risk everything for the sake of her dreams? The clock ticked on, and with it, the opportunity to shape her own narrative slipped further away."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Middleton Manor",
    "type": "country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling manor house enveloped by lush gardens and dense woodlands, reflecting the wealth and status of its owners during a time of societal tension.",
    "visualDescription": "Victorian architecture with ornate gables and intricate stonework; leaded glass windows glinting in the dim light; manicured hedges framing a grand entrance flanked by ancient oaks.",
    "atmosphere": "A place of opulence overshadowed by underlying tension.",
    "paragraphs": [
      "Middleton Manor stands proudly amidst its sprawling estate, a testament to the affluence of the Middleton family. The grandeur of its Victorian architecture is marred only by the creeping shadows of uncertainty that accompany the Great Depression. Ornate gables and intricate stonework rise against a brooding sky, while leaded glass windows reflect the muted light of an overcast day. Outside, manicured gardens burst with color, yet the vibrant blooms offer little solace to those inside, where whispers of discontent linger in the air like the scent of damp earth after a rain.",
      "The estate is a labyrinth of rooms and corridors, each with its own secrets. The grand staircase, with its polished banisters and faded carpet, spirals upward, limiting movement between floors. Each turn reveals another door, some locked tight, restricting access to the private study and the cellar filled with valuables. Shadows dance in the corners, and the silence is punctuated by the ticking of a clock, a constant reminder of time slipping away as tensions mount among the residents and their staff.",
      "Surrounded by dense woodlands, the manor offers secluded spots for both refuge and concealment. The rustling leaves and distant calls of woodland creatures provide an eerie soundtrack to the unfolding drama. As night falls, the estate transforms; candlelight flickers in the windows, casting long shadows that stretch across the manicured lawns. With the nearest village miles away, help is far, and the isolation weighs heavily, amplifying the sense of dread that permeates the air."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "overcast with occasional rain showers, typical of the British countryside",
    "timeFlow": "Three days of mounting tension, each hour heavy with implications.",
    "mood": "tension-filled due to recent economic hardships and social unrest",
    "eraMarkers": [
      "early home telephones in the drawing room",
      "typewriter in the study",
      "radio broadcasting news of the day"
    ],
    "sensoryPalette": {
      "dominant": "damp earth and decaying leaves",
      "secondary": [
        "polished wood and old leather",
        "whispers of discontent"
      ]
    },
    "paragraphs": [
      "The estate is shrouded in a heavy mist, the air thick with the scent of damp earth and decaying leaves. Overhead, the clouds hang low, casting a pall over the lush gardens that seem to wilt under the weight of uncertainty. The distant sound of thunder rumbles, echoing the unrest brewing within the manor's walls. Inside, the atmosphere is charged with tension; the faint crackle of a radio fills the silence, broadcasting news of economic despair, while the clatter of a typewriter punctuates the stillness, a reminder of the work that must be done despite the growing unease.",
      "Time flows slowly within the manor, each hour stretching into eternity as secrets fester and relationships fray. The ticking of the grand clock reverberates through the hall, a constant reminder of the impending confrontation that looms over the household. Shadows lengthen as the day wanes, and the scent of woodsmoke from the fireplace mingles with the musty aroma of old tomes in the library, creating an atmosphere thick with anticipation. The manor, once a sanctuary of wealth and privilege, now feels like a cage, trapping its inhabitants in a web of suspicion and fear."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Bookshelves lined with leather-bound tomes; a large oak table in the center; flickering candlelight casting shadows.",
      "sensoryDetails": {
        "sights": [
          "leather-bound books on shelves",
          "flickering candlelight",
          "dust motes in the air",
          "dark wood paneling",
          "a cracked window"
        ],
        "sounds": [
          "crackling candle wicks",
          "soft rustle of pages",
          "distant thunder rumbling",
          "the ticking clock",
          "footsteps on creaking floorboards"
        ],
        "smells": [
          "old leather and dust",
          "beeswax from candles",
          "musty pages",
          "rain on stone",
          "smoke from the fireplace"
        ],
        "tactile": [
          "smooth leather book covers",
          "cold brass doorknob",
          "worn velvet armchair",
          "chill draft from the window",
          "rough wooden table surface"
        ]
      },
      "accessControl": "Accessible to family and select guests; staff must knock before entering; locked after dinner.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "soft grey light",
            "glossy book spines"
          ],
          "sounds": [
            "steady rain against glass",
            "soft pages turning",
            "gentle creaking of shelves"
          ],
          "smells": [
            "fresh rain on earth",
            "damp wood",
            "cold leather"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light through clouds",
            "shadows creeping",
            "faded upholstery"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "clock ticking loudly",
            "the rustle of fabric"
          ],
          "smells": [
            "musty books",
            "smoke from the fireplace",
            "old varnish"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight illuminating spines",
            "long shadows across the floor",
            "gleaming brass fittings"
          ],
          "sounds": [
            "the gentle crackle of fire",
            "whispers in the dark",
            "the distant sound of laughter"
          ],
          "smells": [
            "warm woodsmoke",
            "freshly polished furniture",
            "the scent of aged paper"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, once a refuge of knowledge, has become a scene of dread. Bookshelves loom like sentinels, filled with tomes that whisper secrets of the past. The large oak table, now cluttered with papers and a single flickering candle, casts dancing shadows that seem to mock the tension in the air. The scent of old leather and dust hangs thick, mingling with the smell of rain seeping through the cracked window. Every sound is amplified in the stillness; the crackling wick of the candle, the distant rumble of thunder, and the soft rustle of pages turning under trembling fingers.",
        "As the day darkens, the atmosphere thickens, and the library transforms. The shadows stretch and deepen, hiding corners where secrets may lie. The ticking clock becomes a metronome of anxiety, each tick echoing the heartbeat of those within. The cold draft from the window sends shivers through the room, a reminder of the storm brewing outside, while the warmth from the fireplace offers little comfort. Here, in this sanctuary of knowledge, a crime has unfolded, and the answers hide among the pages."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Lavishly decorated with heavy drapes and ornate furniture; a grand piano sits in the corner; a large fireplace dominates one wall.",
      "sensoryDetails": {
        "sights": [
          "golden light from the fireplace",
          "heavy drapes framing windows",
          "ornate floral wallpaper",
          "elegant furniture",
          "grand piano in the corner"
        ],
        "sounds": [
          "crackling fire",
          "soft music from the piano",
          "murmurs of conversation",
          "clinking of glasses",
          "the rustle of silk"
        ],
        "smells": [
          "smoky wood from the fireplace",
          "fresh flowers in a vase",
          "polished furniture",
          "scent of perfume",
          "cigar smoke lingering"
        ],
        "tactile": [
          "soft silk upholstery",
          "cold marble hearth",
          "worn leather armchair",
          "smooth wood of the piano",
          "heavy drapes"
        ]
      },
      "accessControl": "Open to guests during gatherings; staff may enter to serve but must remain unobtrusive.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft grey light filtering",
            "rain on window panes",
            "glistening surfaces"
          ],
          "sounds": [
            "soft patter of rain",
            "gentle piano notes",
            "muffled voices from outside"
          ],
          "smells": [
            "fresh rain on flowers",
            "damp wood",
            "freshly brewed tea"
          ],
          "mood": "calm before the storm"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light over furnishings",
            "shadows pooling in corners",
            "dust motes dancing"
          ],
          "sounds": [
            "silence broken by laughter",
            "the crackle of the fire",
            "the ticking of a clock"
          ],
          "smells": [
            "woodsmoke",
            "scent of old books",
            "cooked meats from the kitchen"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm candlelight flickering",
            "reflections in polished surfaces",
            "long shadows from furniture"
          ],
          "sounds": [
            "the soft murmur of conversation",
            "the distant sound of music",
            "the crackling of the fire"
          ],
          "smells": [
            "scent of whiskey",
            "floral arrangements",
            "freshly polished wood"
          ],
          "mood": "festive but strained"
        }
      ],
      "paragraphs": [
        "The drawing room, with its lavish decor and elegant furnishings, serves as the heart of the manor. Heavy drapes frame tall windows, allowing only the faintest light to filter through on gloomy days. The grand piano sits silently in the corner, its polished surface reflecting the flickering flames of the fireplace. A sense of unease permeates the air, as guests gather for drinks, their laughter echoing hollowly against the ornate wallpaper. The scent of smoke from the fire mingles with the lingering perfume of the women, creating a heady atmosphere that belies the tension simmering beneath the surface.",
        "As the evening unfolds, the drawing room transforms into a stage for secrets and lies. Conversations grow quieter, glances exchanged like whispered confessions, while the crackling fire casts long shadows that dance across the walls. The clinking of glasses punctuates the silence, a reminder of the fragile peace that hangs in the air. Here, in this opulent space, the weight of the world outside feels distant, yet the looming threat of the unknown draws ever closer, casting a pall over the festivities."
      ]
    },
    {
      "id": "kitchen",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Staff area and clue discovery",
      "visualDetails": "Large, functional space with a big hearth; shelves lined with jars and utensils; a large oak table at the center.",
      "sensoryDetails": {
        "sights": [
          "large hearth with glowing embers",
          "shelves filled with jars",
          "copper pots hanging from hooks",
          "stainless steel utensils",
          "a large oak table covered in flour"
        ],
        "sounds": [
          "clatter of pots and pans",
          "the crackling fire",
          "voices of staff discussing meals",
          "water boiling",
          "the thud of chopping"
        ],
        "smells": [
          "savory herbs and spices",
          "freshly baked bread",
          "smoke from the hearth",
          "cleaning soap",
          "cooked meats"
        ],
        "tactile": [
          "rough wooden table surface",
          "smooth copper pots",
          "warm stone floor",
          "cool metal utensils",
          "soft flour dusting"
        ]
      },
      "accessControl": "Staff only; family members may enter during meal times; locked after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "light filtering through rain-streaked windows",
            "puddles on the floor",
            "steam rising from pots"
          ],
          "sounds": [
            "steady rain against the roof",
            "the sound of chopping",
            "soft chatter among staff"
          ],
          "smells": [
            "freshly baked pastries",
            "wet earth",
            "sizzling bacon"
          ],
          "mood": "busy and warm"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light in corners",
            "shadows pooling around the hearth",
            "dishes piled high"
          ],
          "sounds": [
            "the crackle of the hearth",
            "voices raised in laughter",
            "the clink of dishes"
          ],
          "smells": [
            "smoke and spices",
            "clean linens",
            "fresh produce"
          ],
          "mood": "cheerful camaraderie"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of the hearth",
            "darkening sky outside",
            "reflections from polished surfaces"
          ],
          "sounds": [
            "the last clatter of dishes",
            "the hum of conversation",
            "the crackle of the fire"
          ],
          "smells": [
            "rich aromas of dinner",
            "smoky herbs",
            "cleaning soap"
          ],
          "mood": "satisfied and relaxed"
        }
      ],
      "paragraphs": [
        "The kitchen is a bustling hub, filled with the aroma of hearty meals being prepared. A large hearth dominates one wall, its glowing embers providing warmth and light as staff move about with purpose. Shelves are lined with jars of spices and preserves, while copper pots hang from hooks, gleaming in the dim light. The oak table at the center is covered in flour, evidence of the day’s baking, and the air is thick with the scents of savory herbs and freshly baked bread. Laughter and chatter among the staff create a lively atmosphere, a stark contrast to the tension simmering in the drawing room above.",
        "As evening approaches, the kitchen transforms into a space of camaraderie and shared secrets. The clatter of pots and pans fills the air, accompanied by the soft crackle of the hearth. Staff members exchange stories and laughter, their voices rising above the sounds of cooking. The warm glow of the fire casts flickering shadows, creating an inviting ambiance. Yet, beneath the surface of this bustling kitchen lies a sense of unease, as whispers of the events unfolding in the manor above seep into the conversations, hinting at a darker undercurrent that threatens to surface."
      ]
    },
    {
      "id": "servants_quarters",
      "name": "Servants' Quarters",
      "type": "interior",
      "purpose": "Staff living area and clue discovery",
      "visualDetails": "Simple, functional rooms with shared amenities; narrow corridors leading to small bedrooms; a communal area with a worn sofa.",
      "sensoryDetails": {
        "sights": [
          "narrow corridors with peeling wallpaper",
          "dimly lit rooms",
          "simple wooden furniture",
          "communal area with a worn sofa",
          "faded photographs on walls"
        ],
        "sounds": [
          "soft whispers among staff",
          "the creak of floorboards",
          "distant laughter from the kitchen",
          "the rustle of linens",
          "water running"
        ],
        "smells": [
          "dampness in the air",
          "clean linens",
          "cooked food from the kitchen",
          "old wood",
          "faint perfume"
        ],
        "tactile": [
          "rough wood surfaces",
          "cool metal doorknobs",
          "soft linens",
          "worn upholstery",
          "chill of the night air"
        ]
      },
      "accessControl": "Restricted to staff; family members do not enter; locked at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft light filtering through windows",
            "puddles on the floor",
            "clothes drying on a line"
          ],
          "sounds": [
            "steady rain against the roof",
            "whispers of staff getting ready",
            "the hum of conversation"
          ],
          "smells": [
            "fresh linen",
            "wet earth",
            "damp wood"
          ],
          "mood": "hushed and busy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light in the corridors",
            "shadows creeping",
            "cluttered surfaces"
          ],
          "sounds": [
            "the creak of floorboards",
            "muffled laughter from the kitchen",
            "soft conversations"
          ],
          "smells": [
            "old wood",
            "clean linens",
            "cooked food"
          ],
          "mood": "tense and watchful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "flickering candlelight",
            "shadows dancing on walls",
            "the glow of a small fire"
          ],
          "sounds": [
            "soft whispers",
            "the crackle of a fire",
            "the rustle of blankets"
          ],
          "smells": [
            "warmth of the fire",
            "faint perfume",
            "old wood"
          ],
          "mood": "quiet contemplation"
        }
      ],
      "paragraphs": [
        "The servants' quarters, tucked away from the grandeur of the manor, offer a stark contrast to the opulence above. Narrow corridors lined with peeling wallpaper lead to small, functional rooms, each furnished simply with wooden beds and shared amenities. The communal area, with its worn sofa and faded photographs, serves as a gathering place for staff, where soft whispers and laughter fill the air. The scent of dampness mingles with the freshness of clean linens, creating an atmosphere that is both homely and stifling, a reminder of their place in the household hierarchy.",
        "As night falls, the quarters become a refuge from the tensions of the manor. Flickering candlelight casts warm shadows on the walls, and the soft crackle of a fire offers a comforting backdrop to hushed conversations. Here, the staff share their thoughts and fears, the weight of their secrets heavy in the air. Outside, the clear night sky contrasts sharply with the darkness within, where uncertainty looms large. In this small haven, the lines of class begin to blur, as the workers of Middleton Manor grapple with the mysteries that intertwine their lives with those of their employers."
      ]
    }
  ],
  "note": "",
  "cost": 0.0047241447,
  "durationMs": 45975
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1932,
    "month": "May",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "mild temperatures"
    ],
    "daylight": "Days are gradually lengthening, with twilight lingering until nearly nine o'clock in the evening.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "May Day (May 1)"
    ],
    "seasonalActivities": [
      "garden parties",
      "flower arranging",
      "hiking in the countryside"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored dark wool suits",
        "white dress shirts with stiff collars",
        "black leather shoes"
      ],
      "casual": [
        "light cotton shirts with short sleeves",
        "tweed caps",
        "corduroy trousers"
      ],
      "accessories": [
        "silk ties",
        "cufflinks",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "floral print tea dresses",
        "tailored jackets with shoulder pads",
        "cloche hats"
      ],
      "casual": [
        "lightweight blouses",
        "pleated skirts",
        "linen trousers"
      ],
      "accessories": [
        "beaded handbags",
        "string of pearls",
        "colorful silk scarves"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "increasing popularity of American jazz",
      "the rise of the flapper style fading into more conservative fashions"
    ],
    "socialExpectations": [
      "men are expected to wear suits for formal occasions",
      "women are expected to dress modestly yet stylishly",
      "the upper classes are anticipated to host social gatherings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Unemployment remains high with new strikes in industrial sectors",
      "The British government debates further austerity measures",
      "Political tensions rise as the Labour Party faces internal dissent"
    ],
    "politicalClimate": "A climate of uncertainty prevails, with growing concerns over the impact of the Great Depression leading to increased unrest across the country.",
    "economicConditions": "The economy is struggling with high unemployment rates, leading to significant public distress and social unrest.",
    "socialIssues": [
      "class divide widening",
      "unemployment protests",
      "debates over welfare reforms"
    ],
    "internationalNews": [
      "Rise of fascism in Germany sparks concern",
      "Increasing tensions between Britain and Italy over colonial interests",
      "Discussion of potential arms reduction at the Geneva Disarmament Conference"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Night and Day' by Cole Porter",
        "Benny Goodman's jazz ensembles",
        "'My Heart Stood Still' by Rodgers and Hart"
      ],
      "films": [
        "'The Champ' starring Wallace Beery",
        "'Grand Hotel' featuring an ensemble cast",
        "'Shanghai Express' starring Marlene Dietrich"
      ],
      "theater": [
        "'Rookery Nook' by Ben Travers",
        "'The Royal Family' by George S. Kaufman",
        "'A Midsummer Night's Dream' revival"
      ],
      "radio": [
        "BBC broadcasts news updates",
        "Variety shows featuring popular musicians",
        "Comedy sketch programs gaining traction"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Good Soldier' by Ford Madox Ford",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "satirical literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial radios becoming commonplace",
        "early consumer telephones",
        "typewriters becoming standard in offices"
      ],
      "commonDevices": [
        "personal radios",
        "manual typewriters",
        "basic home lighting powered by electricity"
      ],
      "emergingTrends": [
        "growth in home entertainment",
        "the rise of cinema as a popular pastime",
        "increasing accessibility of printed media"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Newspaper: three halfpence"
      ],
      "commonActivities": [
        "attending local fairs",
        "visiting parks for walks",
        "participating in community events"
      ],
      "socialRituals": [
        "afternoon tea gatherings",
        "weekly church services",
        "neighborhood picnics"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing resentment towards the wealthy class",
      "increasing solidarity among working-class communities"
    ],
    "gender": [
      "women are increasingly seeking independence",
      "traditional gender roles are being challenged"
    ],
    "race": [
      "racial tensions are surfacing, particularly in urban areas",
      "a growing discourse on immigration and its impact on society"
    ],
    "generalNorms": [
      "politeness and decorum are highly valued",
      "social status greatly influences interactions",
      "charity and community service are deemed noble pursuits"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and blooming lilacs fills the air, mingling with the distant sound of raindrops tapping against the grand estate windows.",
    "The muted tones of the overcast sky cast a somber light over the manicured gardens, where whispers of discontent echo among the elegantly dressed guests.",
    "As the evening settles, shadows dance in the corners of the drawing room, where the sound of a gramophone playing a jazz tune competes with the hushed conversations of a society on edge."
  ],
  "paragraphs": [
    "May 1932 in the British countryside is marked by a tumultuous air, with overcast skies and occasional rain showers reflecting the nation's mood, steeped in economic hardship and social unrest. The gardens of the country house estate bloom vibrantly, yet the tension among its guests is palpable, as recent strikes and high unemployment rates have cast a shadow over the festivities. Afternoon tea gatherings are still held, but the conversation often drifts towards the uncertainty of the future, with whispers of political discontent and rising fascism abroad stirring unease.",
    "Fashion reflects the societal shifts of the time, with men opting for tailored dark wool suits paired with crisp white dress shirts and silk ties, while women adorn themselves in floral print tea dresses complemented by cloche hats. The influence of Art Deco can be seen in both men’s and women’s attire, yet the recent economic downturn pushes some to adopt more conservative styles. The upper classes are expected to maintain an air of elegance, even as they grapple with the realities of their changing world, and the clink of cufflinks and the rustle of silk scarves punctuate the air amid the quiet tension.",
    "Daily life continues to unfold against this backdrop of uncertainty, with typical prices reflecting the strain on household budgets; a loaf of bread costs four pence, and a cinema ticket a shilling. Social rituals remain a comfort, as families gather for weekly church services or neighborhood picnics, yet the undercurrent of class division and rising resentment toward the wealthy are ever-present. This spring, as flowers bloom and daylight stretches longer into the evening, the country house estate stands as a microcosm of a society on the brink of change, where the clock strikes guilt amid laughter and tension, waiting for the inevitable unraveling."
  ],
  "note": "",
  "cost": 0.0010680879,
  "durationMs": 15366
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the estate for a family reunion amidst economic strife and rising tensions forces heirs and staff to confront hidden rivalries and secrets under one roof.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class tensions are heightened by the Great Depression, as the wealthy navigate their privilege against a backdrop of political unrest and economic hardship."
  },
  "setting": {
    "location": "A sprawling manor house set in rural countryside, surrounded by gardens and woodlands.",
    "institution": "country house estate",
    "weather": "overcast with occasional rain showers, typical of the British countryside"
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
    "id": "last_wound_time",
    "value": "a quarter past ten",
    "description": "The last known time the clock was wound before the murder"
  },
  {
    "id": "scratches_on_mechanism",
    "value": "one distinct scratch",
    "description": "A clear sign of recent tampering on the clock mechanism"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The authority shows ten minutes past eleven, despite witnesses recalling it striking the hour before discovery.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Indicates potential tampering with the authority.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The authority's shown time aligns incorrectly with witness statements, indicating possible interference.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Suggests tampering with the authority.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "physical",
      "description": "Distinct scratch marks are found on the authority's casing.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Indicates recent interference with the authority.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "These marks suggest recent interference, contradicting the assumption that the authority is functioning normally.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Indicates the authority has been altered.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Dr. Mallory Finch's alibi places her in a different part of the household during the time of death.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Eliminates Dr. Mallory Finch as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "With her alibi corroborated, attention shifts away from Dr. Mallory Finch as a suspect.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "Confirms Dr. Mallory Finch's non-involvement.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The authority was interfered with to misrepresent the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "Indicates how the time of death was misrepresented.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The authority's shown time conflicts with witness statements, indicating possible interference.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Indicates the authority is not reliable.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because her alibi places her away from the scene during the time of death.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Narrow the solution toward Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "behavioral",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Time of death at ten fifteen in the evening remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Dr. Mallory Finch's alibi places her in a different part of the house during the time of death.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "With her alibi confirmed, focus shifts away from her as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Everyone in the household assumes the time of death must align with the authority's shown hour.",
      "supportsAssumption": "The time of death must align with the authority's displayed hour.",
      "misdirection": "This misleads by suggesting that the authority's time is the only factor to consider."
    },
    {
      "id": "rh_2",
      "description": "The household believes that the authority is functioning correctly, leading to misconceptions about the time of death.",
      "supportsAssumption": "The time of death must align with the authority's displayed hour.",
      "misdirection": "This distracts from the possibility that the authority has been altered."
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
      "clue_4"
    ],
    "mid": [
      "clue_5",
      "clue_6",
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_fp_contradiction_step_3"
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
  "latencyMs": 16385,
  "cost": 0.0043261861499999995
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

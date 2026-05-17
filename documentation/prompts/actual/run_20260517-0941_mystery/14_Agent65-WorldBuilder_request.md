# Actual Prompt Record

- Run ID: `mystery-1779010861918`
- Project ID: ``
- Timestamp: `2026-05-17T11:46:41.329Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `1ab3740c4fee7a4f`

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
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Country house estate (Manor house)"
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
      "relationships": [
        "Dr. Mallory Finch - colleague",
        "Captain Ivor Hale - acquaintance",
        "Beatrice Quill - staff"
      ],
      "public_persona": "Intelligent and observant",
      "private_secret": "Has a history with the victim",
      "motive_seed": "Personal connection",
      "motive_strength": "low",
      "alibi_window": "10:00 - 11:30",
      "access_plausibility": "high",
      "opportunity_channels": [
        "interior access to the manor",
        "access to clock mechanisms"
      ],
      "behavioral_tells": [
        "sharp attention to detail",
        "curious nature"
      ],
      "stakes": "Solving the murder",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "medical expert",
      "relationships": [
        "Eleanor Voss - colleague",
        "Beatrice Quill - acquaintance"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Owes money to the victim",
      "motive_seed": "Financial distress",
      "motive_strength": "moderate",
      "alibi_window": "10:00 - 11:30",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "medical tools",
        "knowledge of poisons"
      ],
      "behavioral_tells": [
        "calm demeanor",
        "knowledgeable"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "military officer",
      "relationships": [
        "Eleanor Voss - acquaintance",
        "Dr. Mallory Finch - colleague"
      ],
      "public_persona": "Charismatic leader",
      "private_secret": "Knows about the victim's affairs",
      "motive_seed": "Jealousy",
      "motive_strength": "low",
      "alibi_window": "10:00 - 11:30",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "military tools",
        "knowledge of security protocols"
      ],
      "behavioral_tells": [
        "confident",
        "assertive"
      ],
      "stakes": "Honor",
      "evidence_sensitivity": [
        "low"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "house staff",
      "relationships": [
        "Eleanor Voss - superior",
        "Dr. Mallory Finch - acquaintance",
        "Captain Ivor Hale - acquaintance"
      ],
      "public_persona": "Helpful maid",
      "private_secret": "In love with the victim",
      "motive_seed": "Unrequited love",
      "motive_strength": "high",
      "alibi_window": "10:00 - 11:30",
      "access_plausibility": "high",
      "opportunity_channels": [
        "house access",
        "knowledge of routines"
      ],
      "behavioral_tells": [
        "nervousness",
        "eager to please"
      ],
      "stakes": "Emotional wellbeing",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Beatrice Quill"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a stormy night at Little Middleton Manor, the wealthy host is found dead, and all evidence points to an intricate clockwork conspiracy. Detective Eleanor Voss navigates through deception and hidden motives to uncover the truth behind the mechanical tampering that misled investigators about the time of death."
    },
    "accepted_facts": [
      "The victim was found dead in the library.",
      "The clock in the library was stopped at a specific time.",
      "Witnesses heard the clock chime at a different time."
    ],
    "inferred_conclusions": [
      "The time of death was misrepresented by tampering with the clock."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock in the manor was tampered with to show a false time of death.",
      "delivery_path": [
        {
          "step": "The clock was wound back to create a false timeline."
        },
        {
          "step": "Witnesses believe the murder occurred during a time when the suspect was accounted for."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is revealed, implicating Beatrice Quill."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred at a time when Beatrice Quill was with other staff.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses recall being in the kitchen, hearing the clock strike at that time.",
    "what_it_hides": "The clock was tampered with to mislead the investigation."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Victim's last known activity",
        "Clock's last recorded time"
      ],
      "windows": [
        "10:00 - 11:30"
      ],
      "contradictions": [
        "Clock shows different time than witness accounts"
      ]
    },
    "access": {
      "actors": [
        "Beatrice Quill",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Clock in the library",
        "Victim's watch"
      ],
      "permissions": [
        "All staff have access to the library during the evening"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be manipulated"
      ],
      "traces": [
        "Fingerprints on the clock mechanism"
      ]
    },
    "social": {
      "trust_channels": [
        "Staff trust each other in the kitchen"
      ],
      "authority_sources": [
        "Eleanor Voss as detective"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the library shows ten minutes past eleven when it is found stopped.",
        "correction": "The clock was manipulated to show a false time of death.",
        "effect": "Narrows the investigation to focus on the clock's tampering.",
        "required_evidence": [
          "Clock shows ten minutes past eleven",
          "Witnesses heard the clock chime a quarter past eleven"
        ],
        "reader_observable": true
      },
      {
        "observation": "The victim's watch shows twenty minutes past eleven.",
        "correction": "The victim was likely killed after the time shown by the clock.",
        "effect": "Eliminates Beatrice Quill as having a solid alibi at that time.",
        "required_evidence": [
          "Victim's watch shows twenty minutes past eleven",
          "Witnesses recall hearing the clock chime at a different time"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witness statements about their whereabouts during the supposed time of death conflict with the clock's time.",
        "correction": "The inconsistency reveals the clock was tampered with to create a false timeline.",
        "effect": "Narrows suspects down to those who had access to the clock.",
        "required_evidence": [
          "Witnesses were in the kitchen at the time",
          "Clock shows a time inconsistent with other accounts"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the clock's mechanism to the victim's watch reveals that the clock was set back to mislead the investigation.",
    "knowledge_revealed": "The clock was tampered with, showing a time that does not match the victim's watch.",
    "pass_condition": "If the clock's mechanism shows fresh tampering marks, it proves the tampering occurred.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_5",
      "clue_6",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock stopping at a specific time and the victim's watch showing a later time indicates tampering. Step 2: Witness statements about hearing the clock chime at a different time further supports this. Step 3: The mechanical examination reveals tampering, directly implicating Beatrice Quill."
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
        "Observe the clock's mechanism",
        "Draw conclusion about guilt"
      ],
      "test_type": "mechanical examination"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Shows medical records and alibi that clear him",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proves he was outside during the murder",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of tampering"
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
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Mechanical examination"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_7",
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
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
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
    "summary": "Eleanor Voss, a charming socialite, finds herself drawn into the depths of intrigue as she investigates a murder that threatens her social standing and financial future.",
    "publicPersona": "Eleanor is the epitome of a 1930s socialite; she lights up any room with her laughter and effortless charm. Known for her lavish soirées, she skillfully navigates the elite circles of Little Middleton, always with a glass of champagne in hand and an impeccable dress that turns heads.",
    "privateSecret": "Beneath the glamour, Eleanor grapples with the harsh reality of her finances. Once a member of an affluent family, her investments have crumbled, leaving her in a precarious situation. She is in desperate need of a wealthy marriage to secure her future, a fact she conceals behind her sparkling facade.",
    "motiveSeed": "The sudden death of a wealthy benefactor presents Eleanor with an opportunity. If the victim is out of the picture, she could inherit a substantial fortune, providing the financial stability she so desperately seeks.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims she was in the garden preparing for the evening event from seven until eight, a time when the murder occurred, giving her a plausible excuse.",
    "accessPlausibility": "easy",
    "stakes": "The stakes for Eleanor are monumental; her social standing and future security hinge on marrying well, and any hint of scandal could ruin her chances.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a sophisticated lilt, often punctuating her sentences with playful sarcasm. She has a tendency to use charming anecdotes to deflect from serious topics, revealing her sharp intellect beneath the surface charm.",
    "internalConflict": "Eleanor wrestles with the moral implications of her ambitions. As she delves deeper into the investigation, she feels the weight of her aspirations clashing with her growing empathy for the victim's plight.",
    "personalStakeInCase": "This crime matters to Eleanor not just for the potential inheritance but also because the victim's death could shatter the very social world she has fought to maintain.",
    "paragraphs": [
      "Eleanor Voss flitted through the garden like a butterfly, her laughter ringing out like the tinkling of crystal. The evening was to be one of her grandest parties yet, a gathering of Little Middleton's elite, but beneath her radiant exterior lay a heart heavy with worry. The recent financial troubles of her family had forced her to reconsider her priorities in life. Marrying for love was a romantic notion, but in the world of the wealthy, love often took a backseat to survival.",
      "As she arranged the last bouquet of roses, Eleanor’s thoughts turned to the victim, a wealthy benefactor whose sudden death could alter the course of her life dramatically. If only the man were out of the picture, she could secure the future she so desperately craved. The thought lingered in her mind like an uninvited guest, stirring both excitement and guilt within her. Could she truly entertain such dark imaginings amid the laughter and gaiety of her soirée?",
      "Her alibi was water-tight, or so she thought. She had been in the garden, surrounded by the fragrance of blooming flowers, when the murder occurred. But as the evening progressed, Eleanor found herself drawn deeper into a web of intrigue. Each guest seemed to harbor secrets of their own, and the once-familiar faces now appeared shrouded in shadows. With every revelation, she felt the thrill of the chase ignite within her, awakening a fierce determination to uncover the truth.",
      "As the night wore on, Eleanor realized that her investigation was not solely about securing her future; it was a journey of self-discovery. She had always been seen as merely a charming socialite, but here she was, stepping into the role of an amateur sleuth, unearthing not just the truth behind the murder, but her own strength and resilience. The stakes were high, but Eleanor was ready to embrace the challenge, even if it meant confronting her own darkest desires."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, finds his career and ethics tested as he becomes embroiled in a murder investigation that could expose his dark secrets.",
    "publicPersona": "Dr. Finch is a figure of authority in Little Middleton, a physician whose aloof demeanor and dedication to his practice earn him both respect and a touch of suspicion. He is known for his meticulous approach to medicine, often seen with a book in hand, lost in thought.",
    "privateSecret": "However, behind his polished exterior lies a troubling truth. Dr. Finch has been conducting unauthorized experiments on his patients, driven by a desire to advance medical science. The fear of exposure weighs heavily on his conscience, creating a conflict that gnaws at his soul.",
    "motiveSeed": "His rivalry with the victim over a romantic interest adds another layer of complexity. The victim's presence in his life is a constant reminder of his own failures, and the thought of his medical transgressions being revealed only heightens his desperation.",
    "motiveStrength": "strong",
    "alibiWindow": "Dr. Finch claims to have been in the library reading from eight to nine, a time that overlaps with the murder, raising questions about his whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "For Dr. Finch, the stakes are monumental. His medical license hangs in the balance, and the prospect of losing everything he has worked for looms large over him.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch's speech is precise and measured, often laced with clinical jargon. He has a habit of adjusting his glasses when deep in thought and employs dry observations about human nature that occasionally reveal his wit.",
    "internalConflict": "Dr. Finch is torn between his ambition to advance medicine and the ethical boundaries he has crossed. He grapples with feelings of guilt and shame, fearing that his pursuit of knowledge may lead to dire consequences.",
    "personalStakeInCase": "This case is personal for Dr. Finch; the victim's death not only threatens to expose his experiments but also forces him to confront the ethical lines he has blurred in his quest for scientific progress.",
    "paragraphs": [
      "Dr. Mallory Finch sat in the dim light of the library, the pages of his medical tome fluttering under his restless fingers. To the outside world, he was a respected physician, a man of science dedicated to healing. Yet, as he turned the crisp pages, his mind wandered to darker thoughts. The recent murder of a benefactor threatened to unravel the carefully constructed life he had built, a life that depended on the secrecy of his experiments.",
      "His rivalry with the victim had always simmered just below the surface, a tension that fueled his ambition. The thought of the man's untimely death brought a strange mix of relief and dread. If the victim were gone, perhaps his own transgressions would remain hidden. Yet, the more he contemplated this, the more he felt the weight of his conscience pressing down upon him. How far was he willing to go to protect his reputation?",
      "Dr. Finch's alibi was shaky at best, and as the investigation unfolded, he felt the noose tightening around him. He had claimed to be in the library, yet his mind raced with the fear that his whereabouts would be questioned, and the truth would surface. He had always prided himself on his intellect, but now he felt trapped in a web of his own making, his scientific ambition leading him down a perilous path.",
      "As he navigated the investigation, Dr. Finch found himself confronted with moral dilemmas that tested his very ethics. Each revelation about the victim's life forced him to examine his own choices, sparking a crisis of conscience that threatened to consume him. In the end, it was not merely about saving his career; it was about redeeming himself and confronting the darkness within."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a charismatic military officer, faces the consequences of his choices as he grapples with his past and the financial stakes of a murder investigation.",
    "publicPersona": "With a confident stride and a winning smile, Captain Ivor Hale is the quintessential war hero. His tales of bravery captivate audiences, and his natural charisma makes him a beloved figure in Little Middleton. He seems to embody adventure, always ready to take on the world.",
    "privateSecret": "Yet beneath this polished exterior lies a troubled man. Struggling with PTSD after the horrors of war, he has turned to gambling as a means to escape, a habit that has left him deep in debt and at odds with his family's legacy.",
    "motiveSeed": "The victim stands in the way of a lucrative deal that could save him from financial ruin, making the stakes personal and dangerous.",
    "motiveStrength": "moderate",
    "alibiWindow": "Captain Hale claims to have been arguing with a servant about money in the study from seven to eight, a time that overlaps with the murder.",
    "accessPlausibility": "unlikely",
    "stakes": "For Captain Hale, the stakes are not just financial; they also include his reputation and the family legacy he is desperate to preserve.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.6,
    "speechMannerisms": "Captain Hale speaks with a confident cadence, often punctuating his stories with self-deprecating humor. He has a penchant for dramatic gestures and an infectious laugh, though the laughter often masks a deeper pain.",
    "internalConflict": "Captain Hale is torn between his public persona as a hero and the private struggles he faces. The burden of his gambling addiction weighs heavily on him, and he grapples with feelings of inadequacy and fear of losing everything he holds dear.",
    "personalStakeInCase": "This crime matters deeply to Captain Hale; it is not just about the financial implications but also about redeeming his image and confronting the demons that haunt him.",
    "paragraphs": [
      "Captain Ivor Hale stood in the study, his brow furrowed in frustration as he argued with a servant over money. To the outside world, he was a charismatic figure, the embodiment of courage and adventure. Yet, within the confines of his mind, a storm raged. The war had left its mark, and gambling had become his escape, a perilous refuge that threatened to consume him whole.",
      "The victim's presence loomed large in his life, a constant reminder of the financial ruin that awaited him if he could not secure a lucrative deal. Ivor's alibi was shaky, and as the investigation unfolded, he felt the walls closing in. He had claimed to be in the study, but the truth of his actions weighed heavily on him, stirring a sense of dread that he could not shake.",
      "In the midst of the chaos, Ivor's charm remained intact, often masking the turmoil beneath. He would regale others with tales of his adventures, punctuating his stories with laughter that rang hollow to his own ears. His self-deprecating humor served as both a shield and a mask, allowing him to deflect attention from the cracks in his facade. But deep down, he knew that the stakes were high, and the consequences of his choices could shatter the life he had built.",
      "As the investigation progressed, Ivor found himself at a crossroads. The murder not only threatened his financial stability but also forced him to confront the demons of his past. He was no longer just a war hero; he was a man grappling with the consequences of his choices, seeking redemption and a path back to honor. The stakes were personal, and he was determined to face them head-on, even if it meant unearthing the darkest corners of his own soul."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a diligent governess, finds herself at the center of a murder investigation, driven by jealousy and unrequited love that may lead her down a dangerous path.",
    "publicPersona": "Beatrice is known for her quiet diligence, a nurturing presence in the lives of the children she cares for. Her gentle demeanor and nurturing nature earn her the affection of both the children and their parents, making her a beloved figure in the household.",
    "privateSecret": "However, beneath her calm exterior lies a tempest of emotions. Beatrice harbors a deep love for the victim's fiancé, a love that remains unacknowledged and unreturned. The victim's very existence stands in the way of her happiness, fueling a resentment that simmers just below the surface.",
    "motiveSeed": "Driven by jealousy and the pain of unrequited love, Beatrice's feelings could easily lead her to a crime of passion, blurring the lines between loyalty and desire.",
    "motiveStrength": "compelling",
    "alibiWindow": "Beatrice claims to have been in the nursery with the children from seven to eight, a time when the murder occurred, giving her a seemingly solid alibi.",
    "accessPlausibility": "easy",
    "stakes": "For Beatrice, the stakes are high; her hope for a better life and love is at risk, and she must confront the lengths she is willing to go to achieve her desires.",
    "humourStyle": "observational",
    "humourLevel": 0.3,
    "speechMannerisms": "Beatrice speaks softly and thoughtfully, often pausing to choose her words carefully. Her dialogue is laced with gentle observations and a hint of wistfulness, reflecting her nurturing nature and inner turmoil.",
    "internalConflict": "Beatrice battles with her feelings of jealousy and inadequacy, torn between her love for the fiancé and her loyalty to the victim. The emotional turmoil creates a conflict that threatens to push her towards the edge of desperation.",
    "personalStakeInCase": "The murder investigation is deeply personal for Beatrice; it forces her to confront her feelings of jealousy and the reality of her unfulfilled desires, putting everything she longs for at stake.",
    "paragraphs": [
      "Beatrice Quill stood by the nursery window, watching the children play, her heart heavy with unspoken words. She was a diligent governess, known for her nurturing nature, yet beneath her calm exterior lay a storm of emotions. The children adored her, and their laughter filled the air, but Beatrice's thoughts were consumed by the man who occupied her heart—a man who belonged to another.",
      "Her love for the victim's fiancé was a secret she guarded fiercely, a flame that flickered in the shadows of her heart. Each moment spent in the presence of the victim was a reminder of her own unfulfilled desires, and as jealousy brewed within her, she felt the chasm between them widen. The victim's very existence stood as a barrier to her happiness, and the resentment simmered just beneath the surface.",
      "Beatrice's alibi was strong, having claimed to be with the children during the time of the murder, but as the investigation unfolded, she felt the weight of her emotions pressing down upon her. The lines between loyalty and desire blurred, and she found herself grappling with the lengths she might go to for love. The stakes were high, and the prospect of losing everything she held dear loomed large.",
      "As the tension of the investigation deepened, Beatrice realized that she was not merely a passive observer. The murder had thrust her into a central role, forcing her to confront her own feelings and the choices she had made. This was her chance to step out of the shadows and into the light, but it would come at a cost. Would she be able to navigate the treacherous waters of jealousy and desire, or would she succumb to the darkness that threatened to consume her?"
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
    "type": "Country house estate (Manor house)",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling estate with elegant architecture, hosting a blend of high society and diligent staff, set against the backdrop of the looming economic crisis.",
    "visualDescription": "Grand stone façade adorned with intricate carvings, multiple gabled roofs, and expansive windows framed by dark timber. The grounds feature manicured lawns, a formal garden with hedges, and a distant view of rolling hills.",
    "atmosphere": "An atmosphere thick with tension, where the weight of class struggles simmers beneath the surface.",
    "paragraphs": [
      "Little Middleton Manor stands resolute against the brooding autumn sky, its grand stone walls absorbing the chill of impending rain. The estate, with its sprawling grounds and meticulous gardens, serves as a microcosm of the social divide that defines this era. Wealthy guests drift through the opulent hallways, their laughter echoing off the high ceilings, while beneath them, the staff scurry about, their movements dictated by an unspoken hierarchy that leaves little room for deviation.",
      "As the sun struggles to break through the clouds, the manor's expansive windows reveal a world cloaked in grey. The scent of damp earth and decaying leaves wafts through the air, mingling with the faint tang of coal smoke from the kitchen. In the drawing room, guests sip tea from fine china, oblivious to the tensions brewing among the staff, who exchange furtive glances as they pass each other in the corridors. The atmosphere is charged, as if the very walls are privy to secrets that could unravel the delicate fabric of their lives.",
      "Outside, the formal gardens lay in a state of melancholy, the once-vibrant blooms wilting under the weight of the weather. Paths lined with meticulously trimmed hedges lead to secluded corners, where whispers of scandal and intrigue swirl like the autumn leaves. The sound of a distant clock chimes, marking the passage of time in a place where every moment feels heavy with consequence. Here, the past lingers like a ghost, and the present is fraught with uncertainty.",
      "As dusk descends, shadows stretch across the manicured lawns, and the manor takes on an even more foreboding presence. Candlelight flickers in the windows, casting a warm glow that belies the chilling truth within. The guests, now gathered for dinner, appear unaware of the storm brewing outside—not just the rain that taps against the glass, but the storm of unrest that threatens to breach the sanctuary of their privileged lives."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical of the British countryside in autumn",
    "timeFlow": "Three days of mounting tension as secrets unfold and alliances shift",
    "mood": "Tense, with underlying class tensions and the threat of economic instability",
    "eraMarkers": [
      "Petrol touring cars parked along the gravel drive",
      "Early telephones with party lines in the drawing room",
      "Typewriters clacking in the study as staff prepare correspondence"
    ],
    "sensoryPalette": {
      "dominant": "The damp, earthy scent of autumn leaves",
      "secondary": [
        "Candle wax melting in the drawing room",
        "Creaking floorboards underfoot"
      ]
    },
    "paragraphs": [
      "The atmosphere within Little Middleton Manor is thick with unspoken words and hidden agendas. The overcast sky casts a pall over the estate, wrapping it in a cloak of unease. The sound of distant thunder rumbles like the tension that simmers just beneath the surface of polite conversation, each clap echoing the uncertainty of the times. Guests, dressed in the finery of the era, attempt to mask their discomfort with laughter, but their eyes betray a flicker of apprehension.",
      "As the rain begins to fall, the manor transforms into a sanctuary of secrets. The scent of damp wood mingles with the faint aroma of freshly baked bread, creating a deceptive sense of comfort. Yet, the flickering candlelight reveals more than it conceals, casting long shadows that dance across the walls, hinting at the darker truths waiting to be uncovered. Here, among the opulence, the weight of the Great Depression looms large, and the air is charged with the potential for both revelation and ruin."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Clue discovery, gathering space",
      "visualDetails": "Luxurious furnishings with velvet upholstery, grand fireplace with a polished brass fender, and an ornate chandelier casting a warm glow.",
      "sensoryDetails": {
        "sights": [
          "Gilded mirrors reflecting candlelight",
          "Rich tapestries hanging on the walls",
          "Fine china displayed in a glass cabinet"
        ],
        "sounds": [
          "Laughter mingling with clinking teacups",
          "Creaking floorboards beneath heavy footfalls",
          "The crackle of the fire"
        ],
        "smells": [
          "Beeswax from candles",
          "Freshly brewed tea",
          "A hint of tobacco smoke"
        ],
        "tactile": [
          "Soft velvet cushions",
          "Cool marble of the fireplace mantle",
          "Worn wood of the armchairs"
        ]
      },
      "accessControl": "Accessible to guests and family during social hours; staff only allowed for service; locked after dinner.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streaking the window panes",
            "Muted colors in the morning light"
          ],
          "sounds": [
            "Steady drumming of rain on the roof",
            "Distant thunder rumbling"
          ],
          "smells": [
            "Damp earth from outside",
            "Freshly polished wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light dulling the colors of the room",
            "Shadows creeping in from the corners"
          ],
          "sounds": [
            "The ticking of a clock on the mantel",
            "Soft whispers of conversation"
          ],
          "smells": [
            "Dusty volumes from the library",
            "Lingering scent of tea"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickering across the room",
            "Long shadows cast by the furniture"
          ],
          "sounds": [
            "The soft crackle of the fire",
            "Muffled laughter from the dining room"
          ],
          "smells": [
            "Warmth of burning wood",
            "Subtle fragrance of flowers from the garden"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room, a centerpiece of social gatherings, is adorned with opulence, yet it carries an air of unease. Gilded mirrors reflect the flickering candlelight, casting an ethereal glow that dances across the rich tapestries that line the walls. Here, laughter mingles with the aroma of freshly brewed tea, but beneath the surface, the atmosphere is thick with suspicion as guests exchange glances, each one wary of the secrets that may lie just out of sight.",
        "In the afternoon, as the clouds gather, the drawing room becomes a haven of whispered conversations and hushed tones. The ticking of a clock on the mantel underscores the tension, each tick echoing the passing of time as the storm outside brews. Shadows creep in from the corners, and the faint smell of dust mingles with the scent of polished wood, creating an unsettling ambiance that hints at the hidden truths waiting to be uncovered."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery, private meetings",
      "visualDetails": "Dark oak shelves filled with leather-bound volumes, a large oak desk cluttered with papers and an antique globe, and a large bay window overlooking the garden.",
      "sensoryDetails": {
        "sights": [
          "Rows of dusty books",
          "The glow of a brass lamp",
          "Sunlight filtering through the window"
        ],
        "sounds": [
          "The rustle of pages turning",
          "The soft creak of the chair",
          "Distant thunder rumbling"
        ],
        "smells": [
          "Old leather and paper",
          "Dust motes dancing in the light",
          "Hints of tobacco"
        ],
        "tactile": [
          "Smooth leather of book covers",
          "Cool surface of the oak desk",
          "Worn fabric of the armchair"
        ]
      },
      "accessControl": "Restricted to family and select guests; staff must knock before entering; locked when not in use.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickling down the window",
            "Dim light filtering through clouds"
          ],
          "sounds": [
            "Steady rain tapping on the roof",
            "Whispers echoing in the silence"
          ],
          "smells": [
            "Wet paper from the rain",
            "Cool stone of the fireplace"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Shadows deepening in the corners",
            "The glow of a single lamp"
          ],
          "sounds": [
            "The rustle of papers",
            "Occasional footsteps outside"
          ],
          "smells": [
            "A hint of mildew",
            "Faint scent of ink"
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Warm light illuminating the pages",
            "Reflections in the window"
          ],
          "sounds": [
            "The ticking of a clock",
            "Muffled conversations from the hall"
          ],
          "smells": [
            "Freshly polished wood",
            "A hint of pipe tobacco"
          ],
          "mood": "contemplative"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary of knowledge, is filled with the scent of old leather and paper, each volume a potential vessel of secrets. Rows of dusty books line the dark oak shelves, and the soft glow of a brass lamp casts shadows that dance across the room. Here, in the quiet solitude, the tension of the manor seems to fade, replaced by a contemplative atmosphere that invites inquiry. Yet, the silence is never truly peaceful; the distant rumble of thunder serves as a reminder of the brewing storm outside.",
        "As the afternoon wears on, the library takes on a more foreboding character. Shadows deepen in the corners, and the ticking of a clock echoes ominously, time slipping away as the secrets of the manor linger just out of reach. The faint scent of mildew and ink fills the air, hinting at forgotten stories and hidden truths, while the rustle of papers turning breaks the heavy silence, reminding all who enter that knowledge can be both a weapon and a shield."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Staff meetings, daily operations",
      "visualDetails": "Functional furnishings with a long wooden table, wooden benches, and a large fireplace with a practical hearth.",
      "sensoryDetails": {
        "sights": [
          "Faded wallpaper peeling at the edges",
          "Scuffed wooden floors",
          "Tattered curtains drawn tight"
        ],
        "sounds": [
          "Clattering of dishes",
          "Muffled laughter",
          "The crackle of the fire"
        ],
        "smells": [
          "Cooking aromas wafting from the kitchen",
          "Wood smoke from the fireplace",
          "Dusty air"
        ],
        "tactile": [
          "Rough texture of the wooden table",
          "Chill from the drafty windows",
          "Worn fabric of the benches"
        ]
      },
      "accessControl": "Exclusive to household staff; guests forbidden; access restricted during meal preparations.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops pooling on the window sill",
            "Grey light filtering through"
          ],
          "sounds": [
            "Pattering rain on the roof",
            "Clattering of dishes in the kitchen"
          ],
          "smells": [
            "Freshly baked bread",
            "Wet wood"
          ],
          "mood": "busy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Dull light casting shadows",
            "The flicker of a candle"
          ],
          "sounds": [
            "Quiet conversations",
            "The crackle of the fire"
          ],
          "smells": [
            "A hint of stew simmering",
            "Dust from the corners"
          ],
          "mood": "tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Warm glow from the fireplace",
            "Shadows flickering on the walls"
          ],
          "sounds": [
            "Muffled voices from the dining room",
            "The chirp of crickets outside"
          ],
          "smells": [
            "The rich aroma of a hearty meal",
            "Freshly brewed tea"
          ],
          "mood": "relaxed"
        }
      ],
      "paragraphs": [
        "The Servants' Hall is a stark contrast to the opulence of the drawing room, filled with the scent of cooking and the sounds of daily operations. Faded wallpaper peels at the edges, and scuffed wooden floors bear witness to the hustle and bustle of the household staff. Here, the air is charged with a sense of urgency, as servants exchange whispered conversations while preparing for the evening's dinner service. The crackle of the fire provides warmth, but the chill of class division remains palpable.",
        "In the morning, as rain patters against the windows, the Servants' Hall comes alive with the clatter of dishes and the aromas of freshly baked bread. The atmosphere is busy, with staff navigating through their tasks, unaware that the very walls may soon echo with darker secrets. As the afternoon light dims, tension hangs in the air, conversations turn quiet, and the flicker of a candle casts long shadows, mirroring the unspoken worries that linger among them."
      ]
    },
    {
      "id": "garden",
      "name": "The Formal Garden",
      "type": "exterior",
      "purpose": "Clue discovery, social gatherings",
      "visualDetails": "Meticulously trimmed hedges, a central fountain surrounded by colorful flower beds, and stone pathways winding through the greenery.",
      "sensoryDetails": {
        "sights": [
          "Vibrant flowers swaying in the breeze",
          "Dappled sunlight filtering through the trees",
          "Stone statues peering over the hedges"
        ],
        "sounds": [
          "Birdsong filling the air",
          "The gentle splash of water from the fountain",
          "Leaves rustling in the wind"
        ],
        "smells": [
          "Fragrance of blooming flowers",
          "Freshly cut grass",
          "Earthy scent after rain"
        ],
        "tactile": [
          "Soft petals brushing against fingers",
          "Cool stone of the fountain's edge",
          "Rough bark of ancient trees"
        ]
      },
      "accessControl": "Open to guests during garden parties; staff allowed only for maintenance; private areas restricted.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Droplets clinging to petals",
            "Muddy paths leading through the garden"
          ],
          "sounds": [
            "Rain tapping on leaves",
            "Distant thunder rumbling"
          ],
          "smells": [
            "Wet earth",
            "Fresh greenery"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Muted colors in the garden",
            "Shadows cast by thick clouds"
          ],
          "sounds": [
            "A soft breeze rustling through leaves",
            "The distant murmur of conversations"
          ],
          "smells": [
            "Faint floral scents",
            "A hint of dampness in the air"
          ],
          "mood": "sombre"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Twilight casting long shadows",
            "The garden illuminated by lanterns"
          ],
          "sounds": [
            "Crickets chirping in the background",
            "Laughter echoing from the manor"
          ],
          "smells": [
            "Night-blooming jasmine",
            "Cool evening air"
          ],
          "mood": "romantic"
        }
      ],
      "paragraphs": [
        "The formal garden, a meticulously maintained paradise, provides a stark contrast to the tension building within the manor's walls. Vibrant flowers sway gently in the breeze, their fragrance intoxicating, while a central fountain bubbles softly, inviting guests to linger. However, beneath the beauty lies an undercurrent of unease, as the shadows lengthen and the distant rumble of thunder hints at a storm approaching, both in the sky and within the household.",
        "As evening descends, the garden transforms into a realm of romance and intrigue. Lanterns flicker to life, casting a warm glow over the pathways, while laughter and soft conversations drift through the air. Yet, the cool night air carries a hint of something darker, as secrets buried within the hedges seem to whisper of betrayal and hidden agendas. The garden, once a place of beauty, now serves as a backdrop for the unfolding drama within Little Middleton Manor."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023322221999999997,
  "durationMs": 23882
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1932,
    "month": "January",
    "day": null,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "overcast skies",
      "occasional drizzle",
      "cold winds"
    ],
    "daylight": "Days are short with sunlight fading around four o'clock in the afternoon, leaving the evenings dark and brooding.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, when guests have retired to their sitting rooms.",
    "holidays": [
      "New Year's Day"
    ],
    "seasonalActivities": [
      "hunting parties in the countryside",
      "indoor card games by the fire",
      "evening tea gatherings"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored wool morning coat",
        "crisp white dress shirt",
        "black bow tie"
      ],
      "casual": [
        "tweed jacket",
        "corduroy trousers",
        "knitted pullover"
      ],
      "accessories": [
        "walking cane",
        "pocket watch",
        "feathered hat"
      ]
    },
    "womensWear": {
      "formal": [
        "long evening gown with lace detailing",
        "silk gloves",
        "pearl necklace"
      ],
      "casual": [
        "tweed skirt and matching blazer",
        "soft knitted sweater",
        "faux fur stole"
      ],
      "accessories": [
        "cloche hat",
        "beaded handbag",
        "brooch"
      ]
    },
    "trendsOfTheMoment": [
      "art deco influences in design",
      "increased popularity of radio programs",
      "rise of the 'flapper' silhouette, albeit more refined for winter wear"
    ],
    "socialExpectations": [
      "men expected to display a sense of propriety and polish",
      "women encouraged to maintain modesty while showcasing elegance",
      "upper classes maintaining a veneer of confidence despite economic despair"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "unemployment rates continue to soar across Europe",
      "the British government enacts new tariffs to protect local industries",
      "the rise of fascist parties in Germany causes concern in Britain"
    ],
    "politicalClimate": "The political atmosphere is tense, with rising political extremism creating divisions among the populace.",
    "economicConditions": "The Great Depression lingers, leading to stark contrasts between wealth and poverty, and causing increased class tensions.",
    "socialIssues": [
      "growing discontent among the working class",
      "debates over unemployment relief",
      "concerns over civil liberties as governments tighten control"
    ],
    "internationalNews": [
      "the League of Nations struggling to maintain peace in Europe",
      "news of the American stock market's slow recovery",
      "conflicts in Asia rising, causing anxiety over colonial holdings"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Ain't She Sweet' by Milton Ager",
        "'My Blue Heaven' by Walter Donaldson",
        "Bing Crosby's latest recordings"
      ],
      "films": [
        "'The Front Page'",
        "'The Smiling Lieutenant'",
        "'The Champ'"
      ],
      "theater": [
        "'The Royal Family'",
        "'The Front Page'",
        "'The Green Goddess'"
      ],
      "radio": [
        "BBC Radio's news broadcasts",
        "variety shows featuring comedy skits",
        "popular serialized dramas"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Glass Key' by Dashiell Hammett",
        "'The Good Earth' by Pearl S. Buck"
      ],
      "popularGenres": [
        "mystery",
        "social commentary novels",
        "escapist fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric toaster gaining popularity in homes",
        "advancements in radio broadcasting technology",
        "the use of typewriters expanding in offices"
      ],
      "commonDevices": [
        "telephones with party lines",
        "cylinder phonographs for music",
        "battery-operated radios"
      ],
      "emergingTrends": [
        "increased home entertainment options due to radio",
        "shift towards modernist architecture",
        "growing interest in automotive travel"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: six pence",
        "Daily newspaper: three pence"
      ],
      "commonActivities": [
        "social visits over tea",
        "participation in local sports like fox hunting",
        "attending church services on Sundays"
      ],
      "socialRituals": [
        "afternoon tea served in the drawing room",
        "formal dinner parties with multiple courses",
        "weekly dances at the local hall"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "disdain for the newly wealthy",
      "strong loyalty among the traditional upper class"
    ],
    "gender": [
      "women increasingly stepping into roles outside the home",
      "men expected to be the primary breadwinners",
      "emerging conversations around women's rights"
    ],
    "race": [
      "racial tensions evident in urban areas",
      "a growing awareness of colonial issues"
    ],
    "generalNorms": [
      "decorum and manners are paramount in social settings",
      "financial disparity dictates social interactions",
      "family names still carry significant weight in society"
    ]
  },
  "atmosphericDetails": [
    "The smell of damp earth mingles with the scent of burning logs from the fireplace, creating a cozy yet oppressive atmosphere.",
    "The sound of rain pattering against the windowpanes, coupled with the distant echo of hounds baying, heightens the tension within the manor.",
    "A chill permeates the air, making the warmth of the drawing room feel both inviting and stifling, as whispers of discontent swirl among the guests."
  ],
  "paragraphs": [
    "In January 1932, the British countryside is shrouded in a damp chill, typical of winter in England. The days are short, with the sun barely breaking through the overcast skies, casting a somber mood over the estate. The residents of the manor, still recovering from the lavishness of the New Year’s celebrations, now face a stark reality marked by the Great Depression. The evenings draw in quickly, and as twilight falls, the echoes of laughter from earlier in the day dissipate into a tense silence, broken only by the occasional sound of rain against the windows.",
    "Fashion during this period reflects the lingering elegance of the previous decade, with men donning tailored wool morning coats and women showcasing their refined silhouettes in long evening gowns adorned with lace. The local gentry place great importance on propriety, evident in their choice of accessories like pocket watches for men and pearl necklaces for women. The cold winter air calls for warm, sophisticated fabrics; tweed and corduroy are favored by those who wish to remain stylish yet practical during their outdoor pursuits.",
    "Daily life in this era is punctuated by social rituals that reinforce class distinctions. Afternoon tea becomes a formal affair, served in the opulent drawing room, while guests engage in hushed discussions about the state of the economy, the rising threat of fascism, and the shifting social landscape. As they gather for evening meals, the stark realities of unemployment weigh heavily on their conversations, and the disparity between the affluent manor residents and the struggling working class becomes increasingly palpable. In this world of privilege, whispers of unrest begin to seep in, casting shadows over the opulence of the estate."
  ],
  "note": "",
  "cost": 0.001063656,
  "durationMs": 13463
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "An inheritance dispute amidst the backdrop of the Great Depression brings together the wealthy and their staff in a tense manor setting, where class tensions and economic instability create a volatile atmosphere.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class divisions, with the wealthy grappling with the threat of losing their status while the staff face precarious employment, all under the shadow of rising fascism in Europe."
  },
  "setting": {
    "location": "A grand manor house in the English countryside",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain"
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
    "id": "wound_back_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  },
  {
    "id": "watch_reading",
    "value": "twenty minutes past eleven",
    "description": "Time displayed on the victim's wristwatch at the time of discovery"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the library shows ten minutes past eleven when it is found stopped.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This indicates the last recorded time before the clock stopped.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The clock was manipulated to show a false time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This suggests the time displayed cannot be trusted.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The victim's watch shows twenty minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This provides a timeline for the victim's last known time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "Witness statements about their whereabouts during the supposed time of death conflict with the clock.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This indicates that the timeline is unreliable.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Comparing the clock's mechanism to the victim's watch reveals that the clock was set back to mislead.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This highlights the tampering of the clock's mechanism.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The inconsistency reveals the clock was tampered with to create a false timeline.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This confirms the clock's time cannot be trusted.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "A mechanical clock in the manor was tampered with to show a false time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "This indicates the core mechanism of the deception.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock was manipulated to show a false time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the assumption that the clock's time is accurate.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he has a verified alibi during the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This narrows the suspect list away from Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Witness statements confirm Captain Ivor Hale was seen at the local pub during the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This provides an alibi for Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "behavioral",
      "description": "Beatrice Quill exhibited signs of unrequited love towards the victim.",
      "sourceInCML": "CASE.cast[3].evidence_sensitivity[0]",
      "pointsTo": "This indicates a potential motive for Beatrice Quill.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "Witnesses claim they were with Beatrice Quill at the time of the murder.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This supports her alibi but may be misleading.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_beatrice_quill",
      "category": "temporal",
      "description": "Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This direct evidence shows Beatrice Quill had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Victim's last known activity remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [],
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
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ],
    "mid": [
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_core_elimination_chain",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_culprit_direct_beatrice_quill"
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
  "latencyMs": 12601,
  "cost": 0.00302346825
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

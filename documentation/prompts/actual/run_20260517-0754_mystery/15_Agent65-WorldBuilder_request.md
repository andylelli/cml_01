# Actual Prompt Record

- Run ID: `mystery-1779004463838`
- Project ID: ``
- Timestamp: `2026-05-17T07:57:21.860Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `6bc02a9acdae95e6`

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
      "institution": "Manor house"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "clock tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Dr. Mallory Finch - friend",
        "Captain Ivor Hale - acquaintance",
        "Beatrice Quill - staff"
      ],
      "public_persona": "Intelligent and observant",
      "private_secret": "Struggles with her own family background",
      "motive_seed": "Desire for justice",
      "motive_strength": "strong",
      "alibi_window": "night of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "access to the clock room",
        "knowledge of the estate"
      ],
      "behavioral_tells": [
        "calm demeanor under pressure"
      ],
      "stakes": "solving the murder to clear her own name",
      "evidence_sensitivity": [
        "clock mechanism tampering",
        "witness statements"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "medical professional",
      "relationships": [
        "Eleanor Voss - friend",
        "Beatrice Quill - patient",
        "Captain Ivor Hale - colleague"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Recently in debt due to gambling",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "night of the murder",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "access to medical supplies",
        "knowledge of the estate's layout"
      ],
      "behavioral_tells": [
        "nervous when questioned"
      ],
      "stakes": "preserving his reputation",
      "evidence_sensitivity": [
        "medical records",
        "time of death estimation"
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
        "Beatrice Quill - staff member",
        "Dr. Mallory Finch - friend"
      ],
      "public_persona": "Charming and authoritative",
      "private_secret": "Secretly involved in political discussions",
      "motive_seed": "Political motivations",
      "motive_strength": "moderate",
      "alibi_window": "night of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "access to the estate grounds",
        "connections with local authorities"
      ],
      "behavioral_tells": [
        "defensive when pressed about his whereabouts"
      ],
      "stakes": "protecting his reputation and influence",
      "evidence_sensitivity": [
        "witness accounts of his location",
        "timing of his conversations"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "house staff",
      "relationships": [
        "Eleanor Voss - employer",
        "Dr. Mallory Finch - patient",
        "Captain Ivor Hale - acquaintance"
      ],
      "public_persona": "Loyal servant",
      "private_secret": "Knows more about the family than she admits",
      "motive_seed": "Protecting family secrets",
      "motive_strength": "strong",
      "alibi_window": "night of the murder",
      "access_plausibility": "high",
      "opportunity_channels": [
        "familiarity with the estate",
        "unrestricted access to rooms"
      ],
      "behavioral_tells": [
        "overly eager to assist"
      ],
      "stakes": "maintaining her position and loyalty to the family",
      "evidence_sensitivity": [
        "family history records",
        "access logs"
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
      "summary": "During a weekend retreat at the grand manor house, Eleanor Voss uncovers a web of deception and class tension when a murder occurs, leading her to a mechanical clock that holds the key to the truth."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead in the library.",
      "The clock in the hallway was tampered with.",
      "Witnesses reported unusual behavior from the staff."
    ],
    "inferred_conclusions": [
      "The clock's time manipulation was a deliberate act to mislead investigators."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was wound back forty minutes to create a false alibi for the murderer.",
      "delivery_path": [
        {
          "step": "Clock tampering occurred before the murder."
        },
        {
          "step": "Witnesses recall the clock chiming at a time inconsistent with the actual events."
        }
      ]
    },
    "outcome": {
      "result": "The tampering misled authorities about the time of death, aiding Beatrice Quill in her deception."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred when the clock showed the correct time.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appears to be functioning normally.",
    "what_it_hides": "The actual time of death was manipulated by the murderer."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Time of the clock's last known correct setting",
        "Time of witnesses hearing the clock chime"
      ],
      "windows": [
        "Time window around the murder event",
        "Time of Eleanor Voss's last known movements"
      ],
      "contradictions": [
        "Clock shows ten minutes past eleven while the murder occurred at quarter to twelve."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "The clock in the hallway",
        "The library where Eleanor was found"
      ],
      "permissions": [
        "House staff have unrestricted access to the manor."
      ]
    },
    "physical": {
      "laws": [
        "The mechanical principles governing clock functioning."
      ],
      "traces": [
        "Scratches on the clock's winding mechanism indicating tampering."
      ]
    },
    "social": {
      "trust_channels": [
        "Staff relationships with the family."
      ],
      "authority_sources": [
        "Social hierarchy within the estate."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock displays ten minutes past eleven when it should read a quarter to twelve.",
        "correction": "The clock was tampered with to mislead the investigation about the time of death.",
        "effect": "Narrows the timeline of events surrounding Eleanor's murder.",
        "required_evidence": [
          "The clock shows ten minutes past eleven.",
          "Witnesses recall the clock chiming at an odd time."
        ],
        "reader_observable": true
      },
      {
        "observation": "A small scratch is found on the clock's winding mechanism.",
        "correction": "The scratch indicates recent tampering, suggesting intent to manipulate the clock's time.",
        "effect": "Eliminates the possibility that the clock's condition is normal.",
        "required_evidence": [
          "The scratch on the clock's winding mechanism.",
          "The clock's malfunction is noted by the house staff."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses state that the clock chimed at an odd time, conflicting with their timelines.",
        "correction": "The discrepancy in clock times indicates a deliberate manipulation to create a false alibi.",
        "effect": "Narrows the suspect pool by revealing the importance of the clock's timing.",
        "required_evidence": [
          "Witness accounts of the clock's chiming.",
          "Dr. Mallory Finch's alibi conflicts with the time indicated by the clock."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A comparison of the clock's timing with Dr. Mallory Finch's alibi reveals that he could not have been present when the murder occurred, due to the clock's tampering.",
    "knowledge_revealed": "Dr. Mallory Finch's alibi is proven false by the clock's time discrepancy.",
    "pass_condition": "If Dr. Mallory's alibi is dependent on the tampered clock, he cannot be the murderer.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_6",
      "clue_4",
      "clue_fp_contradiction_step_3"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time discrepancy (early) and witness statements (mid) reveal the manipulation. Step 2: The scratch on the clock indicates tampering (mid) eliminates the idea of normal functioning. Step 3: The trap design compares alibis against the clock's timing (discriminating test) shows the real timeline."
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
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His alibi is confirmed by the timing discrepancies.",
        "supporting_clues": [
          "The clock's time discrepancy",
          "Witness statements"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His presence is confirmed at a different location during the murder.",
        "supporting_clues": [
          "Witness accounts of his location",
          "Timing of his conversations"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence reveals Beatrice Quill as the murderer."
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
        "delivery_method": "Direct observation of the clock."
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statements about the clock."
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Discovery of the scratch on the clock."
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
        "delivery_method": "Direct observation"
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
        "delivery_method": "Witness statement"
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
    "summary": "Eleanor Voss is a charming socialite and philanthropist, whose elegance masks the desperate struggle to maintain her family's estate amid looming financial ruin.",
    "publicPersona": "Eleanor is the epitome of grace, hosting lavish garden parties that draw the elite of Little Middleton, all while being the heart of numerous charitable endeavors. Her laughter rings like chimes in the air, and her presence is magnetic, drawing people to her as moths to a flame.",
    "privateSecret": "Beneath her polished surface, Eleanor is deeply in debt, facing the threat of losing her family estate. The façade she presents to the world is a delicate illusion, one she fights to preserve at all costs.",
    "motiveSeed": "Her desperation to conceal her financial troubles drives her to investigate the murder, as exposure could shatter her carefully curated image and destroy her family's legacy.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims she was in the garden with guests, enjoying the fragrant blooms until the sudden scream shattered the idyllic scene.",
    "accessPlausibility": "easy",
    "stakes": "The stakes are high for Eleanor; her social standing and her family's legacy hang in the balance, compelling her to dig deeper into the mystery.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a refined cadence, often punctuating her sentences with a soft laugh or a knowing smile. She has a talent for flattery and often employs subtle jabs hidden within compliments, revealing her sharp intellect.",
    "internalConflict": "Eleanor grapples with the fear of losing everything she holds dear, not just her estate, but also the respect and admiration of her peers. This fear fuels her determination to find the truth, even if it means exposing her own vulnerabilities.",
    "personalStakeInCase": "This crime matters to Eleanor because it threatens her very identity; the possibility of losing her social standing and the legacy of her family propels her into the role of an investigator.",
    "paragraphs": [
      "Eleanor Voss floated through the garden, a vision of elegance amidst the vibrant blooms. Guests laughed and mingled, oblivious to the storm brewing within her. As she poured tea into delicate china cups, she wore her smile like armor, masking the turmoil of her financial troubles. Her estate, once a symbol of her family's grandeur, now teetered on the brink of collapse, and the thought gnawed at her insides like a persistent ache.",
      "When the scream pierced the afternoon air, it cut through Eleanor's reverie. Her heart raced as she turned toward the source, her mind racing with possibilities. The world she had so carefully curated was unraveling, and she felt the weight of her secrets pressing down upon her like an anchor. The murder was not just another scandal; it was an opportunity for Eleanor to reclaim control over her life, to divert attention from her own precarious situation.",
      "As she began to investigate, Eleanor found herself stepping into the role of amateur sleuth with surprising ease. She was determined to uncover the truth behind the murder, not only to protect her social standing but also to discover her own strengths. Each clue she uncovered revealed layers of intrigue and deception among the guests, and Eleanor could not help but feel a thrill at the chase. Yet, the fear of exposure lingered, haunting her like a specter.",
      "In the quiet moments between her inquiries, Eleanor pondered her future. Would she emerge from this chaos stronger, or would the truth unravel her? The stakes were higher than she had ever imagined, and as she navigated the treacherous waters of social politics and murder, Eleanor Voss was determined to find her place in a world that threatened to consume her."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected local physician with a hidden past that threatens to unravel his carefully constructed life.",
    "publicPersona": "Known for his expertise and discretion, Dr. Finch is a pillar of the community, often sought after for his medical opinions and advice. His calm demeanor and reassuring presence make him a beloved figure among the townsfolk.",
    "privateSecret": "Beneath the surface, Dr. Finch carries the weight of a disgraceful past — he lost his medical license due to a botched surgery, a secret that could destroy his reputation if exposed.",
    "motiveSeed": "His desire to protect his reputation drives him to remain in the shadows of the investigation, fearing that any scrutiny might lead to the revelation of his past failures.",
    "motiveStrength": "weak",
    "alibiWindow": "He claims to have been attending to a patient in a nearby village at the time of the murder, but the timing of his alibi is vague and unverified.",
    "accessPlausibility": "unlikely",
    "stakes": "The potential exposure of his past could cost him his practice and the respect he has worked so hard to regain.",
    "humourStyle": "observational",
    "humourLevel": 0.3,
    "speechMannerisms": "Dr. Finch speaks with a measured tone, often pausing to choose his words carefully. He has a tendency to use medical jargon that he softens with casual observations, revealing his desire to connect while maintaining a distance.",
    "internalConflict": "Dr. Finch is torn between his desire to assist in the investigation and his fear of being discovered. The shame of his past haunts him, and he struggles with the moral implications of his secrets.",
    "personalStakeInCase": "This crime matters to Dr. Finch as it poses a threat to his hard-earned reputation; he fears that if the truth comes to light, it could ruin not only his practice but also the fragile trust he has built in the community.",
    "paragraphs": [
      "Dr. Mallory Finch stood in his quaint office, the scent of antiseptic mingling with the faint aroma of aged paper. He glanced at the clock, its ticking a constant reminder of the time slipping away from him. As a local physician, he had always been the one to mend others, but now he found himself caught in a web of intrigue that threatened to expose the very foundation of his existence.",
      "When the news of the murder reached him, Dr. Finch felt a familiar knot tighten in his stomach. He had worked tirelessly to rebuild his life after the incident that led to his disgrace, but the specter of his past loomed ever closer. He was determined to remain in the background, offering his expertise only when necessary, but the pull of the investigation was undeniable.",
      "As he navigated the delicate balance of assisting while concealing, Dr. Finch found himself drawn to Eleanor Voss. Her determination and grace sparked something within him, a flicker of hope that perhaps he could be redeemed through her endeavors. Yet, the fear of exposure held him back, a chilling reminder of what he stood to lose. His past was a fragile secret, and he feared that one misstep could lead to his undoing.",
      "With each passing day, Dr. Finch wrestled with his conscience. Could he truly help Eleanor without risking his own safety? The stakes were higher than ever, and as he observed the unfolding drama, he realized that this investigation might not only reveal the murderer but also force him to confront the truths he had buried deep within himself."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a disillusioned retired military officer, whose charm and charisma mask a deep resentment towards the societal elite.",
    "publicPersona": "Ivor is a charismatic figure, often the life of the party, captivating guests with his tales of adventure and valor. His charm makes him popular among the social elite, but few see the discontent brewing beneath his polished exterior.",
    "privateSecret": "Haunted by the class divisions he fought against in the war, Ivor harbors deep resentment toward the wealthy, feeling betrayed by the very society he once defended.",
    "motiveSeed": "He believes the victim epitomizes the elite class that has betrayed his ideals, which fuels his internal conflict regarding the murder.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor claims to have been taking a walk around the estate, but his timing is vague and uncorroborated.",
    "accessPlausibility": "possible",
    "stakes": "The stakes for Ivor revolve around his moral standing; he must confront whether he will succumb to bitterness or rise above it.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a confident swagger, often punctuating his sentences with dry humor and a wry smile. His language is rich with military idioms, and he has a tendency to make light of serious subjects, masking his inner turmoil.",
    "internalConflict": "Ivor wrestles with his disillusionment and conflicting ideals; he longs to uphold the values he once fought for, yet feels betrayed by the very society he sought to protect.",
    "personalStakeInCase": "This crime matters to Ivor because it challenges his beliefs about honor and integrity, forcing him to confront the realities of the class system he despises.",
    "paragraphs": [
      "Captain Ivor Hale strolled through the estate, his posture relaxed yet alert, as if ready for an unseen enemy. The laughter of the elite echoed around him, a sound he once cherished but now found grating. He had fought valiantly for his country, only to return to a society divided by wealth and privilege. The very people he had defended now seemed distant and unworthy of his loyalty.",
      "When the news of the murder broke, Ivor felt a mixture of intrigue and vindication. The victim represented everything he loathed about the upper class, and while he would never condone murder, he couldn't help but feel a flicker of satisfaction at the unraveling of their facade. He found himself torn between his desire to distance himself from the chaos and an insatiable curiosity about the truth behind the crime.",
      "As he engaged in conversations with the other guests, Ivor's sardonic wit flowed freely, masking the bitterness that simmered beneath the surface. He played the role of the charming raconteur, but every laugh felt like a hollow echo in his heart. He knew he had to navigate this treacherous landscape with care, lest he be ensnared in the very web of deceit he sought to expose.",
      "With each revelation, Ivor confronted the reality of his ideals. Would he allow his disillusionment to consume him, or could he find a way to redeem himself in this tangled mystery? The stakes were higher than mere justice; they were about reclaiming his sense of honor in a world that seemed intent on turning its back on him."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an aspiring writer whose ambition drives her to navigate the treacherous waters of Little Middleton's elite, all while harboring a dangerous infatuation.",
    "publicPersona": "Bright-eyed and eager, Beatrice is an ambitious young woman who seeks to make her mark on society. Her enthusiasm is infectious, and she often captivates those around her with her dreams of becoming a renowned author.",
    "privateSecret": "Desperately in love with Eleanor's husband, Beatrice believes that winning his affection is her ticket to success and acceptance in the elite circles she longs to join.",
    "motiveSeed": "Her love for Eleanor's husband may lead her to see the murder as an opportunity to eliminate any rivals, though her motives are muddled by her naivety.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice claims she was in her room working on her manuscript, but her alibi lacks confirmation from anyone.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are her dreams of literary success and societal acceptance, which are intertwined with her feelings for Eleanor's husband.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks with a breathless enthusiasm, often stammering when excited. She has a tendency to sprinkle her dialogue with literary references, and her self-deprecating humor reveals a deep-seated insecurity.",
    "internalConflict": "Beatrice struggles with her feelings of inadequacy and ambition; her infatuation with Eleanor's husband clouds her judgment and complicates her desires.",
    "personalStakeInCase": "This crime matters to Beatrice as it directly impacts her aspirations; she fears that any scandal could jeopardize her dreams and the chance to gain acceptance in the elite society she covets.",
    "paragraphs": [
      "Beatrice Quill sat in her dimly lit room, surrounded by crumpled pages and ink stains, her heart racing with the thrill of creation. The aspiring writer had always dreamed of crafting stories that would capture the imagination of society, but her ambitions were overshadowed by the intoxicating allure of Eleanor's husband. Each glance at him sent her heart fluttering, and she often found herself lost in daydreams of a life intertwined with his.",
      "When the murder occurred, Beatrice felt a peculiar mix of fear and excitement. The chaos of the investigation opened a door to the elite world she yearned to infiltrate, but it also threatened to expose her secret affections. She often joked about her lack of talent, masking her insecurities with self-deprecating humor, but deep down, she feared that her dreams might shatter like glass at the slightest provocation.",
      "As she navigated the aftermath of the murder, Beatrice found herself caught between her desires and the reality of her situation. The whispers of scandal mingled with her aspirations, and she struggled to maintain her composure while grappling with the possibility that her infatuation could lead to dire consequences. Could she eliminate the competition, or would her naïveté lead her down a path of destruction?",
      "With each passing day, Beatrice's ambition clashed with her heart's longing. The stakes were higher than she had ever imagined, and as she penned her thoughts, she realized that her journey was not just about literary success but also about discovering who she truly was amidst the shadows of desire and deception."
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
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A grand estate enveloped in secrecy, where wealth and privilege mask underlying tensions and conspiracies.",
    "visualDescription": "A sprawling manor with ivy-clad stone walls, towering gables, and an entrance flanked by meticulously trimmed hedges. The expansive grounds include formal gardens bursting with blooms, yet shadowed by overhanging trees.",
    "atmosphere": "An air of suspicion and unease permeates every corner, with the looming presence of the manor itself casting long shadows over its inhabitants.",
    "paragraphs": [
      "Little Middleton Manor stands as a testament to opulence, its stone façade draped in the creeping embrace of ivy. The sprawling estate is punctuated by meticulously manicured gardens that bloom with vibrant colors, though even the flowers seem to whisper secrets of the past. As the overcast sky looms overhead, a sense of foreboding settles in the air, mingling with the scent of damp earth and blooming roses, creating a palpable tension that lies just beneath the surface of this elegant façade.",
      "Inside, the manor's grand hall boasts a sweeping staircase adorned with a plush crimson runner, leading to upper chambers where the whispers of the upper class echo against the cold stone walls. Oil paintings of stern ancestors watch from above, their eyes seemingly following every move of the living. The flicker of gas lamps casts a warm glow that struggles against the encroaching shadows, revealing dust motes dancing in the air, remnants of conversations long past. This is a space where every creak of the floorboards tells a story, and every locked door holds a mystery.",
      "The estate, while breathtaking, is not without its secrets. Narrow corridors twist and turn, leading to rooms that are often locked to staff, creating a sense of isolation and inaccessibility. The sound of rain tapping against the leaded windows becomes a soothing backdrop to the mounting tension, while the distant rumble of thunder seems to echo the unrest brewing amongst the manor's residents. In the drawing room, the scent of polished wood and old leather mingles with the faint aroma of tobacco smoke, remnants of late-night discussions that may have crossed into dangerous territory.",
      "As the day wanes and the sun sinks behind the clouds, the atmosphere thickens with anticipation. The flickering candlelight casts long shadows on the walls, and distant voices from the servants' quarters drift through the air, hinting at the secrets shared among the staff. Each tick of the ornate clock in the hall reminds those within of the passage of time, a constant reminder that the truth is ticking away, waiting to be uncovered in this grand, yet deceptive, haven."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical for the season, affecting outdoor activities and movement.",
    "timeFlow": "Three days of mounting tension leading to a revelation.",
    "mood": "Tense and secretive due to underlying class tensions and recent political discussions.",
    "eraMarkers": [
      "Petrol touring cars parked in the courtyard",
      "Typewriter clacking in the study",
      "Telegram received at the manor"
    ],
    "sensoryPalette": {
      "dominant": "The scent of damp earth mixed with blooming roses",
      "secondary": [
        "Crackling fire in the drawing room",
        "Sound of rain tapping on leaded glass"
      ]
    },
    "paragraphs": [
      "The atmosphere is thick with the scent of damp earth and blooming roses, a reminder of the beauty that hides the secrets of Little Middleton Manor. The low rumble of thunder can be heard in the distance, growing closer, as if nature itself is echoing the mounting tensions within the estate. Every corner of the manor whispers of intrigue, with the flickering gas lamps casting shadows that dance along the walls, creating a sense of unease.",
      "As the hours stretch into days, the sense of isolation becomes more pronounced. The overcast skies seem to reflect the mood of the inhabitants, with their hushed conversations and lingering glances. The manor, while a sanctuary of wealth and privilege, is also a cage of secrets, where every locked door and hidden passageway holds the potential for revelation or ruin."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Dark oak shelves lined with books, a large mahogany table at the center, and a single flickering lamp casting shadows.",
      "sensoryDetails": {
        "sights": [
          "Dust motes swirling in the dim light",
          "Leather-bound volumes stacked haphazardly",
          "A shattered glass on the floor"
        ],
        "sounds": [
          "The rustle of pages turning",
          "The clock ticking in the silence",
          "Distant thunder rumbling outside"
        ],
        "smells": [
          "Old leather and musty paper",
          "A hint of burning wax from the lamp",
          "The dampness of the rain outside"
        ],
        "tactile": [
          "Worn velvet armchairs",
          "Cold marble fireplace surround",
          "Rough texture of the book spines"
        ]
      },
      "accessControl": "Accessible only during daylight hours; locked at night with only the housekeeper having the key.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streaking down the window panes",
            "Puddles forming on the floor",
            "Dim light filtering through clouds"
          ],
          "sounds": [
            "Steady drumming of rain on the roof",
            "The creak of damp wood",
            "A distant clap of thunder"
          ],
          "smells": [
            "Freshly wet earth",
            "Mildew in the corners",
            "The sharp scent of rain-soaked pages"
          ],
          "mood": "Oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light casting no shadows",
            "Bookshelves looming like sentinels",
            "A single candle flickering on the table"
          ],
          "sounds": [
            "Silence punctuated by the ticking clock",
            "The rustling of fabric as someone shifts",
            "The distant sound of conversation from the hallway"
          ],
          "smells": [
            "Dust and old paper",
            "A faint hint of tobacco smoke",
            "The lingering scent of polished wood"
          ],
          "mood": "Uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight casting dancing shadows",
            "Reflections of light on polished surfaces",
            "The last rays of sun filtering through the window"
          ],
          "sounds": [
            "The soft crackle of the fire",
            "The distant sound of laughter from the drawing room",
            "The ticking of the mantel clock"
          ],
          "smells": [
            "Warm candle wax",
            "The scent of burning logs",
            "The coolness of the evening air"
          ],
          "mood": "Tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, a sanctuary of knowledge, now serves as the scene of a chilling discovery. Dark oak shelves loom, filled with leather-bound volumes, their spines cracked and faded. At the center, a large mahogany table stands, littered with scattered papers and an overturned glass, a silent witness to the chaos that unfolded. The flickering lamp casts a weak glow, struggling against the encroaching shadows, while the sound of distant thunder rumbles outside, echoing the tension that hangs in the air.",
        "As light filters through the rain-streaked windows, the atmosphere is thick with the scent of old leather and damp paper. The room, once a refuge of intellect, now feels like a trap, where every creak of the floorboards and rustle of pages serves as a reminder of the secrets hidden within these walls. With the clock ticking ominously in the background, time seems to stretch, each second laden with the weight of what has transpired."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Elegant furnishings with rich fabrics, an ornate fireplace, and large windows draped with heavy curtains.",
      "sensoryDetails": {
        "sights": [
          "Gilded frames of portraits lining the walls",
          "Lush, patterned wallpaper",
          "A grand piano in the corner"
        ],
        "sounds": [
          "The soft murmur of conversation",
          "The crackling of the fire",
          "The distant clinking of tea cups"
        ],
        "smells": [
          "Freshly brewed tea",
          "The scent of polished wood",
          "A hint of floral perfume"
        ],
        "tactile": [
          "Soft velvet cushions",
          "Cool marble mantelpiece",
          "Worn wooden armrests"
        ]
      },
      "accessControl": "Open to guests during social gatherings; closed to staff unless specifically permitted.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops tracing patterns on the window",
            "Muted colors in the daylight",
            "A dampness in the air"
          ],
          "sounds": [
            "The steady patter of rain",
            "The rustle of fabric as guests adjust",
            "The distant sound of thunder"
          ],
          "smells": [
            "Wet earth outside",
            "The aroma of brewing tea",
            "A hint of mildew from the dampness"
          ],
          "mood": "Melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Dim light filtering through heavy curtains",
            "Shadows creeping along the floor",
            "A flickering candle on the side table"
          ],
          "sounds": [
            "Quiet conversations hushed by the atmosphere",
            "The ticking of a clock in the corner",
            "Occasional laughter from outside"
          ],
          "smells": [
            "Dust settling in the still air",
            "The scent of warm wood and leather",
            "A lingering floral fragrance"
          ],
          "mood": "Tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight illuminating the room",
            "Reflections of guests in the polished surfaces",
            "The glow of the fireplace"
          ],
          "sounds": [
            "Laughter and chatter filling the space",
            "The soft notes of piano music",
            "The crackling of logs in the hearth"
          ],
          "smells": [
            "Burning wood and coal",
            "The scent of fine tobacco",
            "A hint of evening flowers"
          ],
          "mood": "Sociable yet strained"
        }
      ],
      "paragraphs": [
        "The drawing room serves as a hub of social interaction, where the upper echelons of society gather to exchange pleasantries and hidden glances. Adorned with elegant furnishings and rich fabrics, the room exudes an air of sophistication, yet the tension beneath the surface is palpable. The flickering candlelight casts a warm glow, illuminating gilded portraits that seem to observe the interactions with silent scrutiny. The aroma of freshly brewed tea mingles with the scent of polished wood, creating an inviting atmosphere that belies the secrets swirling within.",
        "As conversations flow, the soft crackle of the fireplace competes with the murmurs of the guests, each word carefully chosen, each laugh tinged with uncertainty. The heavy curtains drawn across the windows filter the afternoon light, creating a dim ambiance that adds to the sense of confinement. Here, in this opulent drawing room, the façade of civility masks the brewing storm of class tensions and conspiracies that threaten to unravel."
      ]
    },
    {
      "id": "servants_quarters",
      "name": "Servants' Quarters",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "Simple furnishings with a communal table, narrow beds, and a small window overlooking the grounds.",
      "sensoryDetails": {
        "sights": [
          "Faded wallpaper peeling at the edges",
          "Bunk beds lined against the wall",
          "A single, flickering gas lamp"
        ],
        "sounds": [
          "Quiet whispers and hushed conversations",
          "The creak of floorboards underfoot",
          "Distant laughter from the drawing room"
        ],
        "smells": [
          "The scent of unwashed linens",
          "Faint traces of cooking from the kitchen",
          "A hint of dampness in the air"
        ],
        "tactile": [
          "Rough fabric of the bedding",
          "Cold metal of the bed frame",
          "Hard wooden chairs"
        ]
      },
      "accessControl": "Restricted to staff; guests may not enter without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streaming down the window",
            "Darkened corners of the room",
            "A grey light filtering through"
          ],
          "sounds": [
            "The sound of rain pattering on the roof",
            "Soft murmurs of early risers",
            "The clatter of dishes in the kitchen"
          ],
          "smells": [
            "The odor of damp linens",
            "A hint of breakfast cooking",
            "The scent of wet earth outside"
          ],
          "mood": "Bleak"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Gloomy light casting shadows",
            "The flicker of the gas lamp",
            "Cluttered corners filled with forgotten items"
          ],
          "sounds": [
            "The quiet rustle of fabric",
            "The distant sound of a clock ticking",
            "Footsteps echoing in the corridor"
          ],
          "smells": [
            "A musty scent of old wood",
            "The aroma of cooking wafting from the kitchen",
            "Faint traces of tobacco smoke"
          ],
          "mood": "Oppressive"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Flickering shadows from the gas lamp",
            "A warm glow from the kitchen",
            "The outline of the manor against the night sky"
          ],
          "sounds": [
            "Soft laughter from the drawing room",
            "The distant sound of a piano playing",
            "The wind rustling through the trees outside"
          ],
          "smells": [
            "The scent of freshly baked bread",
            "A hint of tobacco lingering in the air",
            "The coolness of the night creeping in"
          ],
          "mood": "Restless"
        }
      ],
      "paragraphs": [
        "The servants' quarters, a stark contrast to the opulence of the drawing room, reveal the hidden lives of those who maintain the estate. With simple furnishings and narrow beds, the space is cramped and functional, a communal area where whispers of gossip and secrets thrive. The faded wallpaper peels at the edges, and the flickering gas lamp casts a dim glow over the worn wooden table, where staff gather to share their thoughts, often laced with tension and worry.",
        "In this confined space, the scent of unwashed linens mingles with faint traces of cooking from the kitchen, creating an atmosphere that feels both oppressive and intimate. The soft creak of floorboards underfoot and the distant laughter from the drawing room remind the staff of the divide between their world and that of their employers. Here, amidst the shadows, clues may lie hidden, waiting to be uncovered as the mystery unfolds."
      ]
    },
    {
      "id": "gardens",
      "name": "The Formal Gardens",
      "type": "exterior",
      "purpose": "Gathering space / Clue discovery",
      "visualDetails": "Symmetrical pathways lined with hedges, flower beds bursting with color, and a central fountain surrounded by benches.",
      "sensoryDetails": {
        "sights": [
          "Vibrant flower beds in full bloom",
          "The glint of sunlight on water",
          "Tall hedges framing the pathways"
        ],
        "sounds": [
          "The rustle of leaves in the breeze",
          "Birdsong echoing in the distance",
          "The soft splash of water from the fountain"
        ],
        "smells": [
          "The fragrance of blooming roses",
          "Freshly cut grass",
          "A hint of damp soil"
        ],
        "tactile": [
          "Soft petals brushing against fingertips",
          "Cool stone of the fountain's edge",
          "The rough texture of hedges"
        ]
      },
      "accessControl": "Open to guests during the day; restricted access at night for security reasons.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops clinging to flower petals",
            "Puddles forming along the pathways",
            "Grey clouds casting shadows"
          ],
          "sounds": [
            "The steady patter of rain on leaves",
            "The distant rumble of thunder",
            "A soft drip of water from the fountain"
          ],
          "smells": [
            "Wet earth and foliage",
            "The scent of rain-soaked flowers",
            "A freshness in the air"
          ],
          "mood": "Melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Muted colors under the grey sky",
            "Shadows creeping across the lawns",
            "A stillness hanging in the air"
          ],
          "sounds": [
            "The rustle of leaves in the wind",
            "The distant sound of a clock chiming",
            "The soft murmur of hidden conversations"
          ],
          "smells": [
            "A dampness lingering in the air",
            "The earthiness of wet grass",
            "Faint floral notes from the garden"
          ],
          "mood": "Tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The glow of lanterns illuminating pathways",
            "Stars twinkling in the night sky",
            "The reflection of the moon on the fountain"
          ],
          "sounds": [
            "The soft rustle of night creatures",
            "The distant laughter from the manor",
            "The gentle trickle of water"
          ],
          "smells": [
            "The fragrance of night-blooming flowers",
            "Cool breeze carrying hints of earth",
            "The crispness of evening air"
          ],
          "mood": "Mysterious"
        }
      ],
      "paragraphs": [
        "The formal gardens of Little Middleton Manor present a stunning array of colors and scents, a carefully curated paradise that contrasts sharply with the secrets it harbors. Symmetrical pathways, lined with hedges, guide visitors through vibrant flower beds that burst with life, while a central fountain sings softly, its waters glinting under the sun. Yet, beneath this beauty lies a tension, palpable in the air as whispers of discontent echo among the hedges.",
        "In the early morning, as rain clings to flower petals, the gardens take on a melancholic air, the soft patter of droplets mingling with the rustle of leaves. Evenings bring a different atmosphere, where lanterns illuminate the paths and the moonlight dances upon the fountain, casting an enchanting glow that belies the mysteries lurking in the shadows. Here, in this seemingly idyllic space, the truth may be waiting to be unearthed, hidden among the blooms."
      ]
    }
  ],
  "note": "",
  "cost": 0.0026686555499999998,
  "durationMs": 29625
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1936,
    "month": "June",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "June",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "muggy air"
    ],
    "daylight": "Days are long with twilight stretching well into the evening, though the clouds often obscure the sun.",
    "time_of_day_of_crime": "Late evening — after dinner, around nine to eleven at night.",
    "holidays": [
      "Queen's Birthday (June 3rd)"
    ],
    "seasonalActivities": [
      "garden parties in the manor grounds",
      "afternoon teas on the terrace",
      "picnics by the lake"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suits in light wool",
        "double-breasted blazers",
        "crisp white dress shirts"
      ],
      "casual": [
        "tweed caps",
        "light cotton trousers",
        "short-sleeve shirts"
      ],
      "accessories": [
        "silk ties",
        "pocket squares",
        "dress shoes polished to a shine"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dresses with floral patterns",
        "wide-brim hats adorned with ribbons",
        "long gloves"
      ],
      "casual": [
        "lightweight blouses",
        "high-waisted skirts",
        "sandals with decorative straps"
      ],
      "accessories": [
        "beaded handbags",
        "string of pearls",
        "floral brooches"
      ]
    },
    "trendsOfTheMoment": [
      "influence of Hollywood glamour",
      "rise of Art Deco in architecture",
      "popularity of jazz music"
    ],
    "socialExpectations": [
      "emphasis on propriety and etiquette",
      "strict adherence to class distinctions",
      "women expected to embody grace and charm"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "growing tensions in Europe as fascist regimes consolidate power",
      "debates on military rearmament in Britain",
      "strikes and protests over social conditions in major cities"
    ],
    "politicalClimate": "A period of uncertainty with the rise of fascism influencing political discussions among the elite.",
    "economicConditions": "The Great Depression lingers, affecting the middle and working classes, while the wealthy maintain their lifestyles.",
    "socialIssues": [
      "class disparity exacerbated by economic conditions",
      "discussions on women's rights gaining momentum",
      "rising anti-Semitism in Europe"
    ],
    "internationalNews": [
      "Olympic Games set to take place in Berlin, stirring controversy",
      "Spanish Civil War begins to capture international attention"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Benny Goodman - 'Sing, Sing, Sing'",
        "Glenn Miller - 'In the Mood'",
        "Duke Ellington - 'Mood Indigo'"
      ],
      "films": [
        "'Modern Times' - Charlie Chaplin",
        "'The Great Ziegfeld'",
        "'The King Steps Out'"
      ],
      "theater": [
        "'Porgy and Bess' - George Gershwin",
        "'Show Boat'",
        "'The Royal Family'"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "Lux Radio Theater"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Gone with the Wind' by Margaret Mitchell",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'Of Mice and Men' by John Steinbeck"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "historical novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator becomes common in households",
        "the rise of the automobile with better road infrastructure",
        "early developments in radio technology"
      ],
      "commonDevices": [
        "typewriters in offices",
        "petrol-powered touring cars",
        "wireless radios in homes"
      ],
      "emergingTrends": [
        "increased popularity of cinema",
        "development of sound in films",
        "growing interest in photography"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pint of milk: three pence",
        "Cinema ticket: one shilling"
      ],
      "commonActivities": [
        "social gatherings at country estates",
        "afternoon strolls in gardens",
        "visiting local markets"
      ],
      "socialRituals": [
        "formal dinner parties",
        "afternoon tea with friends",
        "Sunday church services"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "pervasive class consciousness",
      "restricted social mobility",
      "seriousness towards class roles"
    ],
    "gender": [
      "women expected to uphold domestic roles",
      "growing calls for women's rights",
      "men viewed as primary breadwinners"
    ],
    "race": [
      "racial prejudices prevalent",
      "growing awareness of anti-Semitism",
      "discussions on colonialism and its implications"
    ],
    "generalNorms": [
      "strict adherence to etiquette",
      "importance of family reputation",
      "respect for authority and tradition"
    ]
  },
  "atmosphericDetails": [
    "The scent of wet earth mingles with the perfume of blooming roses, creating an intense yet tranquil ambiance as rain patters against the manor windows.",
    "The quiet murmur of distant thunder adds to the tension in the air, creating an atmosphere ripe for secrets and whispered conversations.",
    "Soft jazz melodies drift from the radio, mingling with the sounds of clinking teacups and hushed discussions about the political climate outside the safe confines of the estate."
  ],
  "paragraphs": [
    "June 1936 emerges slowly in the manor house, the overcast skies casting a muted light over the expansive grounds. Occasional rain showers sweep through, leaving the air thick and humid, a reminder of the discontent swirling in the world outside. On the estate, staff are busy preparing for the seasonal garden party, an event that draws the local elite, where conversations are laced with tension over the rising fascist movements in Europe and the implications for Britain. The Queen's Birthday earlier this month offered a brief respite, but it is overshadowed by a growing sense of unease among the privileged classes, eager to discuss the affairs of the world while maintaining their delicate social façades.",
    "Fashion in June 1936 is marked by elegance and propriety. Men are seen in tailored three-piece suits, opting for lighter fabrics that reflect the season's warmth. Women adorn themselves in floral tea dresses and wide-brim hats, embodying the glamour of Hollywood while adhering to strict social norms. Accessories like silk ties and beaded handbags add to the refined atmosphere of the manor, where every detail is a testament to status and class. As the evening draws near, guests will gather for dinner, their attire a reflection of both their wealth and the unspoken tensions simmering beneath the surface.",
    "Daily life within the confines of the estate strikes a peculiar balance between routine and unrest. Formal dinner parties serve as a stage for the upper class to navigate their rigid social hierarchy, while whispers of class struggle echo beyond the manicured hedges. Prices remain stable but the specter of the Great Depression looms large, reminding everyone that the world outside is fraught with hardship. Amidst this, social rituals flourish; the afternoon tea remains a cherished institution, where gossip and social maneuvering take center stage, fueling the intrigue that surrounds the manor house and its inhabitants."
  ],
  "note": "",
  "cost": 0.0010733019000000001,
  "durationMs": 10948
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the estate for a weekend retreat becomes a pressure cooker of class tensions and political discourse as the Great Depression looms, forcing the upper crust and their staff into a confined space where secrets and ambitions clash.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class divisions are stark, with the wealthy elite maintaining strict hierarchies over their staff amid rising economic despair and political anxieties."
  },
  "setting": {
    "location": "A large, stately country house estate with expansive grounds and formal gardens.",
    "institution": "Manor house",
    "weather": "Overcast with occasional rain, creating a tense atmosphere."
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
      "description": "The clock shows ten minutes past eleven when it should read a quarter to twelve.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The clock's time is incorrect, indicating potential foul play.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock was tampered with to mislead the investigation about the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the assumption that the clock showed the correct time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "A small scratch is found on the clock's winding mechanism.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This suggests that the clock may have been tampered with recently.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Witnesses state that the clock chimed at an odd time, conflicting with their timelines.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "This raises questions about the reliability of the clock's time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The scratch indicates recent tampering, suggesting intent to manipulate the clock's time.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "This supports the idea that someone wanted to mislead the investigation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The clock was wound back forty minutes to create a false alibi for the murderer.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This detail reveals how the clock's time was manipulated.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_beatrice_quill",
      "category": "testimonial",
      "description": "Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This direct evidence shows Beatrice Quill had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was attending a medical conference at the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This confirms that Dr. Mallory Finch could not have committed the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_5",
      "category": "behavioral",
      "description": "Beatrice Quill was found nervously adjusting her watch after the murder.",
      "sourceInCML": "CASE.cast[3].evidence_sensitivity[0]",
      "pointsTo": "This behavior suggests she was concerned about the time discrepancy.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "A comparison of the clock's timing with Dr. Mallory Finch's alibi reveals that he could not have been at the scene.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[0]",
      "pointsTo": "This supports Dr. Mallory Finch's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "The clock chimed at an unusual time, which witnesses heard.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[1]",
      "pointsTo": "This adds to the confusion surrounding the clock's reliability.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "The clock was found in a state that suggests it had been recently adjusted.",
      "sourceInCML": "CASE.discriminating_test.evidence_clues[2]",
      "pointsTo": "This reinforces the idea of tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Time of the clock's last known correct setting remains a late texture detail in the case background.",
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
      "description": "Witnesses state that the clock chimed at an odd time, conflicting with their timelines.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The discrepancy in clock times indicates a deliberate manipulation to create a false alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Witnesses claimed they saw a shadowy figure near the showed, but this could have been a trick of the light.",
      "supportsAssumption": "The murder must have occurred when the clock showed the correct time.",
      "misdirection": "This suggests that the figure was unrelated to the actual events, diverting attention from the showed's correct."
    },
    {
      "id": "rh_2",
      "description": "Some believe the appears was functioning normally, as it had been recently serviced.",
      "supportsAssumption": "The murder must have occurred when the clock showed the correct time.",
      "misdirection": "This misleads the functioning by implying the appears's accuracy was not in question."
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
      "clue_core_contradiction_chain",
      "clue_1"
    ],
    "mid": [
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_culprit_direct_beatrice_quill",
      "clue_core_elimination_chain",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
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
  "latencyMs": 13099,
  "cost": 0.0047241447
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

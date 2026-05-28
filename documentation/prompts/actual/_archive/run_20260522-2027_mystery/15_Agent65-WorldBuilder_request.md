# Actual Prompt Record

- Run ID: `mystery-1779481632117`
- Project ID: ``
- Timestamp: `2026-05-22T20:37:17.680Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `19141e86b3095d9f`

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
      "location": "Little Middleton, Yorkshire",
      "place": "A sprawling manor house",
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
      "role_archetype": "Suspect",
      "relationships": [
        "Victim's business partner"
      ],
      "public_persona": "Charming and ambitious",
      "private_secret": "Involved in questionable financial dealings",
      "motive_seed": "Financial gain",
      "motive_strength": "strong",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Study",
        "Library"
      ],
      "behavioral_tells": [
        "Nervous when questioned"
      ],
      "stakes": "High financial investment",
      "evidence_sensitivity": [
        "Alibi check"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Victim's physician"
      ],
      "public_persona": "Respected doctor",
      "private_secret": "Had a past romantic affair with the victim",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining Room",
        "Medical Office"
      ],
      "behavioral_tells": [
        "Fidgeting during interviews"
      ],
      "stakes": "Emotional turmoil",
      "evidence_sensitivity": [
        "Medical records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Victim's old friend"
      ],
      "public_persona": "Military hero",
      "private_secret": "In debt to the victim",
      "motive_seed": "Desperation",
      "motive_strength": "moderate",
      "alibi_window": "7:30 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Garden",
        "Library"
      ],
      "behavioral_tells": [
        "Defensive about finances"
      ],
      "stakes": "Financial ruin",
      "evidence_sensitivity": [
        "Loan documents"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [
        "Investigator"
      ],
      "public_persona": "Intelligent and observant",
      "private_secret": "Has a personal vendetta against crime",
      "motive_seed": "Justice",
      "motive_strength": "strong",
      "alibi_window": "n/a",
      "access_plausibility": "n/a",
      "opportunity_channels": [
        "Entire estate"
      ],
      "behavioral_tells": [
        "Calm under pressure"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
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
      "summary": "During a stormy evening in a Yorkshire manor, a wealthy benefactor is found dead shortly after the mechanical clock is tampered with, leading to a web of deceit and suspicion among the guests."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was wound back to mislead witnesses about the time of death.",
      "delivery_path": [
        {
          "step": "The murderer accessed the clock in the study before the murder."
        },
        {
          "step": "They wound it back to create a false timeline."
        }
      ]
    },
    "outcome": {
      "result": "The murderer is revealed through timeline inconsistencies."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred during dinner, as all witnesses clearly remember the clock striking eight.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock chimed reliably throughout the evening, leading everyone to believe the timing was accurate.",
    "what_it_hides": "The clock was tampered with to show a false time."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner started at 8:00 PM",
        "Victim's body found at 9:00 PM"
      ],
      "windows": [
        "8:00 PM to 9:00 PM"
      ],
      "contradictions": [
        "Witnesses recall the clock striking eight, but the hands were actually stopped."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Clock",
        "Victim's body"
      ],
      "permissions": [
        "Access to the study"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clocks can be tampered with to show false times"
      ],
      "traces": [
        "Fingerprints on the clock"
      ]
    },
    "social": {
      "trust_channels": [
        "Shared relationships"
      ],
      "authority_sources": [
        "Victim's influence over guests"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows the hands stopped at ten minutes past eleven.",
        "correction": "The clock was tampered with to mislead witnesses about the time of death.",
        "effect": "Narrows alibi window for all suspects.",
        "required_evidence": [
          "The clock's hands were found stopped at ten minutes past eleven.",
          "Witnesses recall the clock chiming at an unusual time."
        ],
        "reader_observable": true
      },
      {
        "observation": "Eleanor Voss claims she was in the library at 8:00 PM, but the clock shows a false time.",
        "correction": "Eleanor's alibi is compromised by the tampered clock.",
        "effect": "Eliminates Eleanor Voss as a credible alibi.",
        "required_evidence": [
          "Eleanor's statement about her whereabouts.",
          "The clock's winding key was found in the victim's pocket."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory Finch's medical records show she was present at the hospital until 8:30 PM.",
        "correction": "Dr. Finch cannot be the murderer if the murder occurred at 8:00 PM.",
        "effect": "Eliminates Dr. Mallory Finch as a suspect.",
        "required_evidence": [
          "Dr. Finch's hospital records.",
          "Witnesses confirm her presence at the hospital until 8:30 PM."
        ],
        "reader_observable": true
      },
      {
        "observation": "Captain Ivor Hale was seen entering the study just before dinner.",
        "correction": "His presence near the clock gives him access to tamper with it.",
        "effect": "Narrows the focus to Captain Hale as the primary suspect.",
        "required_evidence": [
          "Witness statements about Captain Hale's movements.",
          "The clock's tampering aligns with Hale's access."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the clock's winding mechanism with the victim's watch shows they have been set differently, indicating tampering.",
    "knowledge_revealed": "The clock was wound back to create a false time, and Hale's alibi does not hold.",
    "pass_condition": "If Hale's watch shows a different time than the clock, it proves he tampered with it.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_5"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's stopped hands (early) and witness recollections (mid) let the reader deduce the tampering. Step 2: Eleanor's compromised alibi (mid) eliminates her. Step 3: Dr. Finch's hospital record (late) confirms her alibi. Step 4: Hale's access to the clock (discriminating test) reveals his guilt."
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
        "Execute the discriminating test.",
        "Observe the clock's winding mechanism.",
        "Draw conclusion about Hale's guilt."
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed presence in the library during the time of the murder.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Hospital records prove her alibi.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 7:30 PM to 9:00 PM",
        "supporting_clues": [
          "clue_3"
        ]
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
        "delivery_method": "Direct observation of the clock."
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness statements about the clock."
      },
      {
        "clue_id": "clue_6",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_9",
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
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Comparison of Hale's watch with the clock."
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_eleanor_voss",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
    "summary": "Eleanor Voss is a high society matriarch known for her lavish soirées, but beneath her polished exterior lies a tumultuous struggle with a gambling addiction that threatens to unravel her carefully curated life.",
    "publicPersona": "Eleanor is the epitome of grace and charm, effortlessly commanding attention in any social setting. Her gatherings are the talk of Little Middleton, filled with laughter, exquisite cuisine, and an air of sophistication. To the outside world, she is a beacon of high society, her laughter ringing like silver chimes in the night.",
    "privateSecret": "Yet, behind the curtains of her grand home, Eleanor grapples with a hidden gambling addiction. The thrill of the wager has ensnared her, leading to debts that could shatter her family’s reputation if exposed. The stakes of her life are not merely social; they are existential.",
    "motiveSeed": "The looming threat of exposure from the victim, who knows her secret, gnaws at her. Eleanor fears that the revelation of her financial ruin will strip her of her social standing, leaving her vulnerable and alone in a world that thrives on appearances.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been tending to her garden, a serene escape, from eight-thirty until shortly after nine, when the body was discovered.",
    "accessPlausibility": "easy",
    "stakes": "For Eleanor, the stakes are monumental: maintaining her status in society and shielding her family from the disgrace that would accompany the reveal of her addiction.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, employing a refined vocabulary that dances between formal and conversational. She often uses irony to navigate social situations, her laughter layered with a hint of sarcasm when discussing the foibles of others.",
    "internalConflict": "Deep down, Eleanor is torn between her desire to maintain her façade and the gnawing guilt of her addiction. Each bet places a greater weight on her conscience, as she fears the day she will lose everything.",
    "personalStakeInCase": "This crime matters to Eleanor not only because of the threat to her reputation but also as a personal reckoning with her own choices. The victim's potential exposure forces her to confront her addiction and the very nature of her social identity.",
    "paragraphs": [
      "Eleanor Voss stood poised at the edge of her garden, the moonlight casting a silvery glow on the meticulously trimmed hedges. To the untrained eye, she was merely the gracious hostess of Little Middleton, her parties whispered about in envious tones. Yet, as she plucked a wilting rose, her thoughts spiraled into a tempest of anxiety. The victim's recent threats echoed in her mind, a constant reminder that her carefully constructed world was teetering on the brink of collapse.",
      "Her soirées, once filled with laughter and light, now felt like a façade, each smile she bestowed tinged with the fear of exposure. Eleanor often found solace in the company of her guests, yet the very gatherings that defined her existence also served as a backdrop for her internal struggle. Behind every glass of champagne was a gamble, a risk she had taken far too often, leaving her family finances in tatters.",
      "As she returned to the house, Eleanor's mind raced. The clock chimed, each note a reminder of the time slipping away from her grasp. How could she maintain her status when the specter of disgrace loomed so large? She had to protect her family, her social standing, and most importantly, her secret. The stakes had never been higher, and the thought of losing everything was unbearable.",
      "In the days that followed, Eleanor's charm took on a sharper edge. Conversations became tinged with an underlying tension, her polite savagery surfacing as she navigated the delicate waters of high society. Her laughter, once genuine, now rang hollow, a mask she wore to shield herself from the truth. It was only a matter of time before the past caught up with her, and she would have to choose between preserving her reputation or confronting her demons."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a progressive physician dedicated to women's health but finds herself ensnared in a web of scandal when her affair with the victim threatens to unravel her career and reputation.",
    "publicPersona": "In the eyes of Little Middleton, Dr. Finch is a beacon of hope, a physician whose advocacy for women’s health has earned her respect and admiration. Her patients adore her, and her colleagues regard her as a trailblazer in a male-dominated field. She carries herself with an air of confidence, her warm smile capable of soothing the most anxious of minds.",
    "privateSecret": "However, beneath her professional exterior lies a tumultuous secret: a passionate affair with the victim that could cost her everything. The victim had threatened to expose their relationship, and the thought of such a scandal sends icy tendrils of fear through Mallory’s heart.",
    "motiveSeed": "The fear of losing her practice, her reputation, and the very foundation of her feminist ideals drives Mallory to desperation. She knows that if the truth surfaces, it could not only ruin her but also set back the progress of women in medicine—a cause she holds dear.",
    "motiveStrength": "compelling",
    "alibiWindow": "Mallory claims to have been occupied with a patient in town from nine until shortly before the body was discovered, a plausible alibi that could either save or condemn her.",
    "accessPlausibility": "possible",
    "stakes": "For Mallory, the stakes are not just personal; they encompass the future of women in medicine. Her fight for respect and equality hinges on her ability to navigate the fallout of this tragedy.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a measured and thoughtful rhythm, often pausing to choose her words carefully. Her observations are sharp, laced with a hint of irony, especially when discussing societal norms that she finds archaic.",
    "internalConflict": "Mallory is torn between her desire for personal happiness and her commitment to her career and ideals. The affair, once a source of passion, has become a symbol of her failure to uphold her principles.",
    "personalStakeInCase": "The crime resonates deeply with Mallory, as it forces her to confront the very real consequences of her actions. It is not merely about self-preservation; it is about the integrity of her profession and the women she represents.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her office, the weight of the world resting heavily on her shoulders. The clock on the wall ticked ominously, each second a reminder of the precariousness of her situation. To her patients, she was a champion of women’s health, a bright light in a dark world. Yet, the shadow of her affair with the victim loomed large, threatening to eclipse everything she had worked for.",
      "As she prepared for her next appointment, Mallory’s thoughts drifted to the victim’s threats. The scandal could unravel her career, discrediting not just her but all women striving for recognition in medicine. The thought ignited a fire of determination within her, fueling a desire to protect her hard-won reputation at any cost.",
      "Despite her inner turmoil, Mallory maintained a composed exterior. In conversations, she wielded her observational wit as a shield, deflecting attention from her personal life. Her laughter, though light, carried an undercurrent of tension, a constant reminder of the storm brewing just beneath the surface.",
      "In the days that followed the murder, Mallory found herself grappling with a choice: to embrace her values and fight for justice or retreat into the shadows, allowing fear to dictate her actions. The path she chose would not only define her fate but also the future of countless women who looked to her as a beacon of hope."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired military officer with a stern demeanor, hiding a dark past that could shatter his legacy if the truth about his involvement in a military scandal were to be revealed.",
    "publicPersona": "To the residents of Little Middleton, Captain Hale is a figure of respect—a stern, no-nonsense veteran whose strong sense of honor and duty commands admiration. His presence is imposing, and he carries himself with a dignity that speaks of a life spent in service to his country.",
    "privateSecret": "Yet, beneath that polished exterior lies a dark secret: a cover-up of a military scandal that the victim had uncovered. The thought of exposure terrifies him, for it could lead to disgrace, not just for himself but for his family as well.",
    "motiveSeed": "The captain would do anything to prevent the victim from revealing his past. The shame of it could tarnish not only his legacy but also the honor of his family name, a burden he has carried for too long.",
    "motiveStrength": "strong",
    "alibiWindow": "Ivor claims to have been in the library from nine until the body was found, yet the absence of witnesses casts doubt on his story.",
    "accessPlausibility": "unlikely",
    "stakes": "For Ivor, the stakes are monumental: protecting his legacy and preserving the honor of his family name, which has been built on a foundation of duty and service.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a clipped, authoritative tone, often punctuating his statements with a dry wit that reflects his military background. He tends to avoid superfluous conversation, preferring to get straight to the point.",
    "internalConflict": "Ivor is plagued by guilt over his past decisions, torn between the honor he once fought for and the shame of his secrets. The prospect of exposure fills him with dread, forcing him to confront the man he has become.",
    "personalStakeInCase": "This crime matters to Ivor not only because of the threat to his reputation but also as a chance for redemption. The unraveling of his past could either lead to disgrace or a path toward atonement.",
    "paragraphs": [
      "Captain Ivor Hale sat in the library, the heavy tomes surrounding him a stark contrast to the turmoil in his heart. His reputation as a stern military figure was well-established, yet the shadows of his past loomed larger than the books that lined the shelves. The victim's discovery of his dark secret threatened to unravel everything he had built, a legacy forged through honor and duty.",
      "In conversations around town, Ivor maintained a stoic exterior, delivering his words with a clipped precision that demanded respect. Yet beneath that veneer of authority lay a man grappling with the consequences of his actions. The dry wit he wielded as a defense mechanism often masked the guilt that gnawed at him, an ever-present reminder of the choices he had made.",
      "As the days unfolded after the murder, the weight of his secrets grew heavier. Ivor found himself at a crossroads, torn between the desire to protect his family’s honor and the need to confront the truth of his past. Each interaction felt weighted, every glance exchanged a silent acknowledgment of the stakes at play.",
      "What lay ahead was uncertain, but Ivor knew that the time for reckoning was upon him. The crime not only threatened to expose his past but also offered a chance for redemption—a path he could choose to embrace or reject. In that choice, he hoped to find a semblance of peace."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an aspiring writer whose charming naivety masks a cunning ambition, as she navigates the murky waters of inspiration drawn from her friends' lives, including the scandalous affairs of the victim.",
    "publicPersona": "To those in Little Middleton, Beatrice is an idealistic dreamer, her charm and enthusiasm infectious. Her aspirations to become a novelist are often met with a mix of admiration and skepticism, as her youthful ambition clashes with the societal norms of the time.",
    "privateSecret": "However, the truth is more complex; Beatrice has been using snippets of her friends' lives as fodder for her writing, including the scandalous affairs of the victim. The lines between inspiration and exploitation blur, revealing a darker side to her ambition.",
    "motiveSeed": "In her mind, the victim's death could elevate her status and provide the attention she craves for her work. The potential for notoriety is an intoxicating lure, one that she can't ignore.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims to have been in her room writing from eight to ten, a solitary pursuit with no witnesses to corroborate her story.",
    "accessPlausibility": "possible",
    "stakes": "For Beatrice, the stakes are tied to her dreams of success and acceptance in a society that often looks down upon artistic ambition. The murder could be the catalyst she needs to propel herself into the literary world.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a youthful exuberance, often punctuating her thoughts with dramatic flair. Her sardonic wit shines through in her commentary on societal expectations, revealing a cleverness that belies her naivety.",
    "internalConflict": "Beatrice wrestles with the tension between her artistic integrity and her desire for success. The allure of using her friends’ lives for inspiration clashes with her moral compass, creating a chasm she must navigate.",
    "personalStakeInCase": "This crime matters to Beatrice as it forces her to confront the ethical implications of her writing. The victim's death could offer her a path to success, but at what cost to her integrity?",
    "paragraphs": [
      "Beatrice Quill sat at her desk, the ink-stained pages before her a testament to her ambition. The world of Little Middleton was both her muse and her prison, each character she crafted a reflection of the people she knew. Yet, as she scribbled away, the thrill of creation was tinged with a sense of guilt, for her inspiration often came from the lives of those around her, including the scandalous affairs of the victim.",
      "To her friends, Beatrice was a charming dreamer, her laughter a sweet melody that filled the air. Yet, beneath that facade lay a cunning ambition, a desire to elevate her status in a society that often dismissed artistic pursuits. The thought that the victim’s death could provide the notoriety she craved sent a shiver of excitement coursing through her veins.",
      "In conversations, Beatrice's sardonic wit often shone through, her commentary on societal norms both clever and biting. She navigated the expectations of her peers with a blend of youthful exuberance and sharp observation, revealing a depth that belied her naivety. Yet, as the murder unfolded, she found herself grappling with the ethical implications of her writing.",
      "The crime not only held the potential to catapult her into the literary spotlight but also forced her to confront the moral ambiguity of her ambitions. In choosing between integrity and success, Beatrice stood at a crossroads, the path ahead fraught with peril but shimmering with possibility."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Ashwood Manor",
    "type": "Country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling manor steeped in secrets, Ashwood Manor looms over the Yorkshire countryside, its grand facade hiding a web of intrigue.",
    "visualDescription": "A majestic stone structure with ivy-clad walls, towering chimneys, and expansive lawns dotted with ancient oaks. The formal dining room, adorned with fine china and crystal chandeliers, overlooks meticulously trimmed hedges.",
    "atmosphere": "An air of tension permeates the manor, where every shadow seems to whisper secrets.",
    "paragraphs": [
      "Nestled amidst the rolling hills of Yorkshire, Ashwood Manor stands as a testament to a bygone era, its grandiosity both inviting and foreboding. The heavy oak doors creak open to reveal a labyrinth of polished wood and dimly lit corridors, where echoes of laughter from past gatherings linger like ghosts. Outside, the gardens stretch toward the horizon, their beauty marred by the chill of the late autumn air, a reminder that the season of decay has settled upon the estate.",
      "As guests gather in the formal dining room, the tension is palpable, heightened by the rhythmic ticking of the ornate grandfather clock that dominates the corner. The flickering candlelight casts dancing shadows across the walls, illuminating the faces of the assembled company, each one a mask of feigned civility. Outside, the sound of rain pattering against the window panes creates a haunting symphony, underscoring the unease that grips the manor like a vice.",
      "The sprawling grounds of Ashwood Manor offer both beauty and isolation, with winding paths leading to secluded alcoves where whispered conversations and clandestine meetings occur. The grand staircase dominates the entrance hall, its polished banister gleaming under the soft glow of gas sconces, yet it also serves as a barrier, limiting access to the upper floors where secrets lie hidden. The library, with its locked door and towering shelves of dusty tomes, promises knowledge but remains an enigma, accessible only to a select few.",
      "As night descends, the atmosphere thickens with uncertainty. The distant sound of a petrol car's engine fades into silence as the last of the guests arrive, their presence only intensifying the mystery that has unfolded within these walls. The manor, with its ornate furnishings and rich history, becomes a character in its own right, harboring secrets that threaten to unravel as the clock ticks down to the inevitable revelation."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "overcast with intermittent rain, typical for late autumn",
    "timeFlow": "Three days of mounting tension leading to the climax",
    "mood": "tense, with a palpable sense of unease among the guests",
    "eraMarkers": [
      "petrol touring cars parked in the drive",
      "domestic telephones with party-line systems",
      "typewriters clattering in the study"
    ],
    "sensoryPalette": {
      "dominant": "the scent of damp earth and wood smoke",
      "secondary": [
        "the crackle of burning logs",
        "the distant sound of rain on leaves"
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of damp earth and wood smoke, mingling with the faint aroma of fine cooking wafting from the kitchen. Shadows stretch long in the fading light, and the occasional crackle of burning logs in the fireplace punctuates the silence, creating a sense of warmth that feels almost deceptive given the underlying tension. Guests exchange furtive glances, their laughter echoing hollowly against the walls adorned with portraits of long-dead ancestors, as if they too are witnesses to the unfolding drama.",
      "As the evening deepens, the atmosphere shifts, becoming heavier with secrets and unspoken words. The distant sound of rain on leaves creates a rhythmic backdrop, a reminder of the world outside, while the manor's interior feels increasingly claustrophobic. Gaslight flickers, casting erratic shadows that dance along the walls, amplifying the unease that has settled over the gathering like a shroud. Each tick of the grandfather clock reverberates, marking not just the passage of time but the growing dread that something is amiss within the very heart of Ashwood Manor."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A grand room lined with dark mahogany shelves filled with dusty tomes and a heavy, locked door",
      "sensoryDetails": {
        "sights": [
          "dim light filtering through heavy drapes",
          "dust motes dancing in the air",
          "leather-bound volumes stacked high",
          "ornate fireplace with cold ashes"
        ],
        "sounds": [
          "whispers of pages turning",
          "the creak of floorboards",
          "the ticking of a wall clock",
          "distant thunder rumbling"
        ],
        "smells": [
          "musty scent of old books",
          "cold stone and damp wood",
          "beeswax from the candle holders",
          "faint aroma of tobacco"
        ],
        "tactile": [
          "smooth leather book covers",
          "cold metal of the lock",
          "worn woolen carpet underfoot",
          "chill draft from the window"
        ]
      },
      "accessControl": "Restricted to family members and select staff; locked after dinner",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked window panes",
            "pools of water on the floor",
            "grey light casting shadows"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft rustling of pages",
            "distant thunder rolling",
            "the click of a typewriter"
          ],
          "smells": [
            "damp earth and mildew",
            "cold stone and old leather",
            "freshly brewed coffee",
            "faint scent of lavender"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light through the drapes",
            "shadows pooling in corners",
            "dust settling on surfaces"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the creak of old timbers",
            "soft whispers from the hall",
            "the rustle of clothing"
          ],
          "smells": [
            "beeswax and dust",
            "fresh ink from the typewriter",
            "faint scent of polished wood",
            "cold stone lingering in the air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on walls",
            "shadows lengthening across the floor",
            "reflections in polished surfaces"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "distant voices from below stairs",
            "the crackle of a small fire",
            "the rustle of fabric"
          ],
          "smells": [
            "candle wax and tobacco",
            "cold fireplace ash",
            "the scent of rich food",
            "faint floral notes from the garden"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, with its towering shelves of dusty tomes and the heavy, locked door, stands as both a sanctuary and a prison. Dim light filters through the heavy drapes, casting an eerie glow on the leather-bound volumes that seem to whisper secrets of their own. The musty scent of old books fills the air, mingling with the cold stone and damp wood that characterizes the room. As guests gather, the atmosphere thickens with tension, each creak of the floorboards echoing like a heartbeat, underscoring the heavy silence.",
        "On this fateful evening, the library transforms into a stage for intrigue, where the ticking of the wall clock serves as a countdown to revelation. Whispers of pages turning punctuate the stillness, while the distant rumble of thunder outside adds to the sense of foreboding. The locked door looms large, a barrier between the guests and the secrets hidden within, heightening the sense of isolation and confinement that permeates the estate."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A lavish room adorned with floral wallpaper, an ornate fireplace, and plush seating arranged for conversation",
      "sensoryDetails": {
        "sights": [
          "floral-patterned wallpaper",
          "glimmering crystal chandelier",
          "plush velvet upholstery",
          "ornate fireplace with gilded mantle"
        ],
        "sounds": [
          "soft laughter and murmurs",
          "clinking of teacups",
          "the rustle of silk dresses",
          "the crackle of a fire"
        ],
        "smells": [
          "freshly brewed tea",
          "rosewater and lavender",
          "burning wood and coal",
          "faint perfume lingering"
        ],
        "tactile": [
          "soft velvet cushions",
          "smooth porcelain teacups",
          "warmth from the fireplace",
          "cool marble surfaces"
        ]
      },
      "accessControl": "Open to all guests; frequented during social gatherings",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through the windows",
            "water droplets on the glass",
            "faded flowers in a vase"
          ],
          "sounds": [
            "soft patter of rain",
            "the rustle of paper",
            "muffled conversations",
            "the ticking of a small clock"
          ],
          "smells": [
            "freshly baked scones",
            "wet earth outside",
            "the scent of fresh flowers",
            "the aroma of brewing coffee"
          ],
          "mood": "cozy warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "furniture arranged for conversation",
            "drapes swaying slightly"
          ],
          "sounds": [
            "soft laughter fading",
            "the rustle of fabric",
            "clinking of silverware",
            "the crackle of a fire"
          ],
          "smells": [
            "the aroma of rich pastries",
            "faint scent of burning wood",
            "the sweetness of fruit preserves",
            "subtle hints of tobacco"
          ],
          "mood": "mellow unease"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on surfaces",
            "long shadows from the fireplace",
            "glinting crystal accents"
          ],
          "sounds": [
            "the hum of conversation",
            "soft music playing",
            "the crackle of the fire",
            "the distant sound of laughter"
          ],
          "smells": [
            "the scent of aged whiskey",
            "candle wax melting",
            "the aroma of rich food",
            "faint floral notes from the garden"
          ],
          "mood": "suspenseful camaraderie"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the heart of Ashwood Manor, a lavish space where guests gather, their laughter and murmurs mingling with the soft crackle of the fire. Floral-patterned wallpaper envelops the room, while the glimmering chandelier casts a warm glow over plush velvet upholstery. Here, conversation flows easily, but beneath the surface, a current of tension simmers, each glance exchanged carrying the weight of unspoken words and hidden agendas.",
        "As evening descends, the atmosphere shifts, the flickering candlelight creating an intimate yet suspenseful ambiance. The scent of aged whiskey and melting wax fills the air, mingling with the aroma of rich food being served from the kitchen. Guests lounge on soft cushions, their laughter ringing hollow against the backdrop of the manor's secrets, unaware that the very walls bear witness to the unfolding conspiracy that threatens to unravel their lives."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A functional room with simple furnishings, a large table for meals, and a line of hooks for coats",
      "sensoryDetails": {
        "sights": [
          "sturdy wooden table set for meals",
          "hooks lined with coats and hats",
          "faded wallpaper peeling at the edges",
          "dim light from a single bulb"
        ],
        "sounds": [
          "clatter of dishes being washed",
          "soft murmurs of conversation",
          "the creak of old furniture",
          "the drip of water from a leaky tap"
        ],
        "smells": [
          "the scent of leftover food",
          "dampness in the air",
          "wood polish and dust",
          "faint tobacco smoke"
        ],
        "tactile": [
          "rough wooden table surface",
          "cool metal of cutlery",
          "worn fabric of chairs",
          "chill draft from the door"
        ]
      },
      "accessControl": "Staff only; accessible during meal times and chores",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water pooling on the floor",
            "grey light filtering through windows",
            "shadows cast by coats on hooks"
          ],
          "sounds": [
            "steady patter of rain",
            "the clatter of dishes",
            "muffled voices from above",
            "the drip of water"
          ],
          "smells": [
            "the aroma of breakfast cooking",
            "damp earth from outside",
            "the scent of fresh bread",
            "the pungent smell of coffee"
          ],
          "mood": "busy urgency"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "empty chairs around the table",
            "dust motes swirling in the air"
          ],
          "sounds": [
            "silence broken by distant laughter",
            "the creak of floorboards",
            "the soft rustle of fabric",
            "the ticking of a clock"
          ],
          "smells": [
            "the scent of stale food",
            "faint smell of cleaning supplies",
            "dampness lingering in the air",
            "the aroma of wood polish"
          ],
          "mood": "quiet tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light from a single bulb",
            "the table set for dinner",
            "shadows flickering on the walls"
          ],
          "sounds": [
            "the clinking of cutlery",
            "voices carrying from the dining room",
            "the rustle of clothing",
            "the soft thud of a door closing"
          ],
          "smells": [
            "the aroma of a hearty stew",
            "the scent of fresh herbs",
            "lingering tobacco smoke",
            "the sweetness of dessert"
          ],
          "mood": "simmering curiosity"
        }
      ],
      "paragraphs": [
        "The Servants' Hall is a stark contrast to the opulence of the drawing room, a functional space where the household staff gather for meals and respite. Sturdy wooden tables are set for communal meals, while hooks line the walls, heavy with coats and hats. Dim light from a single bulb casts shadows across the room, where the sound of dishes being washed fills the air, mingling with the soft murmurs of conversation, creating a backdrop of normalcy amidst the tensions of the manor.",
        "As the evening progresses, the hall becomes a hub of activity, the aroma of hearty stew wafting through the air. Staff members exchange glances, their conversations tinged with curiosity about the unfolding events in the drawing room above. The chill draft from the door serves as a reminder of the storm brewing outside, while the ticking of a clock echoes the urgency of the situation, hinting that the answers they seek may lie not just in the manor's grand spaces but in the shadows of their own lives."
      ]
    }
  ],
  "note": "",
  "cost": 0.0022779966000000002,
  "durationMs": 77631
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1939,
    "month": "January",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "chilly temperatures"
    ],
    "daylight": "Short days with limited sunlight, the sun barely rising before eight and setting by four-thirty.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the house settles into a quiet stillness.",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "indoor gatherings around the fireplace",
      "board games and card games",
      "listening to the radio for news and entertainment"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suit",
        "crisp white dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed jacket",
        "corduroy trousers",
        "plaid flannel shirt"
      ],
      "accessories": [
        "fedoras",
        "leather gloves",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with a fitted bodice",
        "long-sleeved silk blouse",
        "velvet evening gown"
      ],
      "casual": [
        "knitted sweaters with geometric designs",
        "A-line skirts",
        "simple cotton blouses"
      ],
      "accessories": [
        "cloche hats",
        "string pearls",
        "handmade leather handbags"
      ]
    },
    "trendsOfTheMoment": [
      "art deco influences in design",
      "broad-shouldered silhouettes for men",
      "pastel colors in women's outerwear"
    ],
    "socialExpectations": [
      "formal dining etiquette",
      "strict adherence to social class roles",
      "expectations of gender roles in public and private settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "rising tensions in Europe with the impending outbreak of World War II",
      "the Munich Agreement's aftermath affecting British politics",
      "the growing strength of the Nazi regime in Germany"
    ],
    "politicalClimate": "A mix of anxiety and determination as Britain prepares for potential conflict, with increasing public debate about rearmament.",
    "economicConditions": "Lingering effects of the Great Depression with unemployment still a concern, but signs of recovery in some sectors.",
    "socialIssues": [
      "class disparity highlighted by the economic situation",
      "debate over women’s roles in the workforce",
      "growing anti-fascism movements gaining momentum"
    ],
    "internationalNews": [
      "Spanish Civil War nearing its conclusion",
      "The United States focusing on neutrality despite European tensions"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's big band music",
        "Django Reinhardt's jazz compositions",
        "Benny Goodman’s swing tunes"
      ],
      "films": [
        "The Wizard of Oz",
        "Gone with the Wind",
        "Mr. Smith Goes to Washington"
      ],
      "theater": [
        "The Glass Menagerie by Tennessee Williams",
        "Pygmalion by George Bernard Shaw",
        "The Front Page by Ben Hecht and Charles MacArthur"
      ],
      "radio": [
        "The Shadow",
        "The Lone Ranger",
        "Lux Radio Theater"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Grapes of Wrath by John Steinbeck",
        "The Maltese Falcon by Dashiell Hammett",
        "1984 by George Orwell"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "science fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial jet airliner (though not yet operational)",
        "developments in radar technology",
        "improvements in television"
      ],
      "commonDevices": [
        "domestic radios for entertainment and news",
        "typewriters for business and personal use",
        "telephones with party-line systems"
      ],
      "emergingTrends": [
        "increased use of automobiles for travel",
        "growing popularity of suburban living",
        "early forms of consumerism influencing lifestyle choices"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cup of tea: two pence",
        "Cinema ticket: six pence"
      ],
      "commonActivities": [
        "visiting local tea rooms",
        "participating in community dances",
        "attending church services on Sundays"
      ],
      "socialRituals": [
        "formal dinner parties with multiple courses",
        "afternoon tea gatherings",
        "weekly church attendance"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a growing divide between the wealthy and the working class",
      "an increasing awareness of class mobility"
    ],
    "gender": [
      "women expected to manage households while some enter the workforce",
      "men seen as primary breadwinners",
      "traditional gender roles still prevalent"
    ],
    "race": [
      "prejudice against minorities persists",
      "growing civil rights awareness in urban areas"
    ],
    "generalNorms": [
      "emphasis on family values",
      "importance of social status and reputation",
      "conformity to societal expectations"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and woodsmoke fills the air, mingling with the faint hint of rain.",
    "The sound of rain tapping on the windowpanes creates a rhythmic backdrop to the hushed conversations within the estate.",
    "A palpable tension hangs in the air, as whispers of international conflict creep into discussions, overshadowed by the flickering glow of the fireplace."
  ],
  "paragraphs": [
    "In January 1939, the winter air is heavy with the scent of rain-soaked earth and the warmth of a crackling fire. Guests gathered at the sprawling country estate find themselves cocooned against the chill, the overcast skies offering a dreary blanket that mirrors the atmosphere inside. Conversations are punctuated by the sound of raindrops tapping against the windows, a constant reminder of the world outside, fraught with tension and uncertainty as whispers of war loom over Europe. The warmth of the hearth contrasts starkly with the chill of the unknown, creating a palpable sense of unease among the guests, each of whom carries their own secrets, fears, and perhaps, motives.",
    "Fashion during this period reflects the duality of formality and comfort, as men don double-breasted wool suits with crisp white shirts, while women opt for elegant tea-length dresses adorned with geometric patterns. Cloche hats and leather gloves are the finishing touches that speak to a careful adherence to social norms. As guests gather for dinner, the table is set with a careful eye towards etiquette, with multiple courses served in a ritual that emphasizes both status and tradition. The evening’s attire is as much a statement of class as it is a reflection of the individual’s taste, creating a visual tapestry that is both striking and revealing.",
    "Daily life in January 1939 is marked by a mix of simple pleasures and the ever-looming cloud of economic hardship. Guests enjoy indoor activities like board games and listening to the radio, a source of entertainment and news that connects them to the world outside. The price of a loaf of bread at four pence serves as a stark reminder of the lingering effects of the Great Depression, while social rituals such as formal dinner parties and afternoon teas create a veneer of normalcy amid the uncertainty. Yet, the class distinctions remain evident, with the wealthy still able to indulge in luxuries that the working-class guests can only dream of. Conversations at the table navigate the complexities of gender roles, economic strife, and the gathering storm clouds of war in Europe, leaving an indelible mark on the evening's gathering."
  ],
  "note": "",
  "cost": 0.0010996326,
  "durationMs": 132250
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a country house estate for a wealthy benefactor's will reading strains social ties amid economic hardship and rising political tensions, forcing guests to confront their shared vulnerabilities.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class tensions are palpable as the Great Depression exacerbates economic divides, while the threat of fascism looms, influencing interactions among the privileged and their staff."
  },
  "setting": {
    "location": "A sprawling manor house with multiple wings and extensive gardens, typical of the 1930s British countryside",
    "institution": "Country house estate",
    "weather": "overcast with intermittent rain, typical for late autumn"
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
    "id": "time_of_murder",
    "value": "twenty minutes past ten",
    "description": "The actual time of the murder, confirmed by witnesses"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows the hands stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time of death may be misrepresented.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Eleanor Voss claims she was in the library at eight o'clock in the evening, but the clock shows a false time.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Eleanor's claim is questionable.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "Dr. Mallory Finch's medical records show she was present at the hospital until eight thirty in the evening.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Eliminates Dr. Mallory Finch as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "Captain Ivor Hale was seen entering the study just before dinner.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "His presence near the clock raises suspicion.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Comparing the clock's winding mechanism with the victim's watch shows they have been set differently.",
      "sourceInCML": "CASE.inference_path.steps[3].observation",
      "pointsTo": "Indicates tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "Eleanor's alibi is compromised by the tampered clock.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "Her claim cannot be trusted.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because her medical records confirm she was at the hospital until eight thirty in the evening.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "Dr. Mallory Finch is not the murderer.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen entering the study just before dinner.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale is not the murderer.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_9",
      "category": "temporal",
      "description": "The clock was wound back to mislead witnesses about the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[1]",
      "pointsTo": "Indicates the murderer's intent to confuse.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "behavioral",
      "description": "Eleanor Voss has been seen discussing financial matters with the victim days before the murder.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[0]",
      "pointsTo": "Suggests a motive for Eleanor Voss.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_11",
      "category": "temporal",
      "description": "The victim's body was found at a quarter past nine.",
      "sourceInCML": "CASE.constraint_space.time.anchors[1]",
      "pointsTo": "Establishes the timeline of the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "temporal",
      "description": "Witnesses recall the clock striking eight, but the hands were actually stopped.",
      "sourceInCML": "CASE.constraint_space.time.contradictions[0]",
      "pointsTo": "Confirms the clock's tampering.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_eleanor_voss",
      "category": "temporal",
      "description": "Direct evidence ties Eleanor Voss to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows Eleanor Voss had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Dinner started at eight o'clock in the evening remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 4,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "category": "temporal",
      "description": "The clock in the study shows the hands stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The clock was tampered with to mislead witnesses about the time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Dr. Mallory Finch's medical records show she was present at the hospital until eight thirty in the evening.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Dr. Finch cannot be the murderer if the murder occurred at eight o'clock in the evening.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
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
      "clue_6",
      "clue_9",
      "clue_fp_contradiction_step_1"
    ],
    "mid": [
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_7",
      "clue_8",
      "clue_10",
      "clue_11",
      "clue_12",
      "clue_culprit_direct_eleanor_voss",
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
  "latencyMs": 36259,
  "cost": 0.004514281199999999
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

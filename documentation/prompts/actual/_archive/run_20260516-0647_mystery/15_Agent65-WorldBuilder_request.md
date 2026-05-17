# Actual Prompt Record

- Run ID: `mystery-1778914044708`
- Project ID: ``
- Timestamp: `2026-05-16T06:50:33.846Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `443e0fb47ad2c7b7`

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
    "author": "Unknown",
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
      "relationships": [],
      "public_persona": "Diligent and perceptive",
      "private_secret": "Struggles with family loyalty",
      "motive_seed": "Desire for justice",
      "motive_strength": "high",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all rooms in the manor"
      ],
      "behavioral_tells": [],
      "stakes": "Uncovering the truth behind her husband's death",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "medical expert",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Had financial troubles",
      "motive_seed": "Desire for inheritance",
      "motive_strength": "moderate",
      "alibi_window": "Half past eight to quarter past nine",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to medical supplies in the house"
      ],
      "behavioral_tells": [],
      "stakes": "Financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "family friend",
      "relationships": [],
      "public_persona": "Charismatic and charming",
      "private_secret": "Has a gambling addiction",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "Quarter past eight to nine",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Frequent visitor to the manor"
      ],
      "behavioral_tells": [],
      "stakes": "Avoiding debt collectors",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "housekeeper",
      "relationships": [],
      "public_persona": "Loyal and dedicated",
      "private_secret": "Holds a grudge against the family",
      "motive_seed": "Resentment towards her employers",
      "motive_strength": "low",
      "alibi_window": "Half past eight to ten",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to all areas of the house"
      ],
      "behavioral_tells": [],
      "stakes": "Job security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "In the isolated Manor House of Little Middleton, tensions rise when Richard Voss is found dead, and the clock suggests he died at a different time than reported. Eleanor Voss, his wife, takes on the challenge to uncover the truth behind the murder, revealing secrets and lies among her closest friends."
    },
    "accepted_facts": [
      "Richard Voss was found dead in his study.",
      "The clock in the study shows a time that contradicts witness testimonies."
    ],
    "inferred_conclusions": [
      "The time of death is manipulated to create a false timeline."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was tampered with to misrepresent the time of death.",
      "delivery_path": [
        {
          "step": "The clock was wound back to show a different time."
        }
      ]
    },
    "outcome": {
      "result": "The false timeline misleads the investigation."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred at the time indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock is a trusted timekeeper and was in plain sight.",
    "what_it_hides": "The clock has been tampered with to support a false alibi."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Time of death as per initial reports",
        "Witness statements about when Richard was last seen"
      ],
      "windows": [
        "Between half past eight and quarter past nine",
        "Witness testimony indicating Dr. Finch's arrival"
      ],
      "contradictions": [
        "The clock shows a time that conflicts with witness statements."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Eleanor Voss",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "The clock",
        "Richard's study",
        "Medical supplies",
        "Personal items of Richard"
      ],
      "permissions": [
        "All suspects had access to the study."
      ]
    },
    "physical": {
      "laws": [
        "Physical tampering can leave traces on clock mechanisms."
      ],
      "traces": [
        "Dust on the clock suggests it was recently handled.",
        "Footprints near the clock point to a hasty exit."
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor's trust in her husband and friends."
      ],
      "authority_sources": [
        "Local police were called to investigate."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows a time of twenty minutes to nine.",
        "correction": "This contradicts Dr. Mallory Finch's alibi of being with Richard until quarter past nine.",
        "effect": "Eliminates Dr. Mallory Finch from being a credible witness.",
        "required_evidence": [
          "Witness statement about Dr. Finch's alibi.",
          "The clock's time discrepancy.",
          "Eleanor's testimony about Richard's last words."
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints lead away from the clock towards the garden.",
        "correction": "This indicates someone tampered with the clock after Richard was last seen.",
        "effect": "Narrows opportunity channels to those with access to the clock.",
        "required_evidence": [
          "Footprints are identified as belonging to Dr. Mallory Finch.",
          "The clock's internal gears show signs of recent tampering.",
          "Eleanor's access to the study."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dust on the clock shows it was disturbed recently despite being untouched for days.",
        "correction": "The disturbance was likely to alter the time to frame another suspect.",
        "effect": "Narrows suspicion towards Dr. Mallory Finch as the likely culprit.",
        "required_evidence": [
          "Dust analysis from the clock.",
          "Footprint comparison confirming Dr. Finch's presence.",
          "Witnesses recall Dr. Finch's anxious behavior."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, richard, and study against the claimed timeline.",
    "knowledge_revealed": "The clock's tampering directly contradicts Dr. Mallory Finch's alibi.",
    "pass_condition": "If the time on the clock does not match the witness accounts, Dr. Mallory Finch is proven guilty.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_dr_mallory_finch"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock discrepancy (early) and witness testimony (mid) reveal a false timeline. Step 2: Footprint evidence (mid) ties Dr. Finch to the tampering. Step 3: Dust analysis (discriminating test) confirms tampering, proving Dr. Finch's guilt."
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
        "Observe the clock's time against witness accounts",
        "Draw conclusion about Dr. Finch's guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Eleanor's alibi is confirmed by her actions during the time of death.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Captain Hale's gambling debts are established, removing motive.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Beatrice's whereabouts are confirmed by other staff.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
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
        "delivery_method": "Direct observation of the clock"
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
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Dust analysis results"
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
        "clue_id": "clue_core_elimination_chain",
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
    "summary": "Eleanor Voss is a local artist whose vibrant paintings reflect her keen insight into the human experience. However, beneath her charismatic exterior lies a heart burdened by unrequited love.",
    "publicPersona": "Eleanor is the life of every gathering, her laughter ringing out like the tinkling of silver bells. Her art, infused with emotion, captivates the residents of Little Middleton, who often find her hosting gallery showings that double as community events. She’s a beloved figure, known for her insightful observations and warmth, always ready to lend a helping hand.",
    "privateSecret": "Yet, in the solitude of her studio, Eleanor wrestles with feelings for Captain Hale, a man whose charm has ensnared her heart. In secret, she has taken to painting a portrait of him, a reflection of her unvoiced affection, capturing not just his likeness but the very essence of her longing. This secret fuels her creative fire, but it also casts a shadow over her heart, a constant reminder of what she cannot have.",
    "motiveSeed": "Her ties to the victim's family run deep; they have supported her art throughout her career. Attending the gallery showing at the manor, she feels a responsibility to uncover the truth, both out of loyalty to them and to protect her own reputation, which is at stake if she is implicated in the murder.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was in the garden, brush in hand, painting away the hours from 8 until the body was discovered at 9:30. It was a blissful escape until reality crashed down around her.",
    "accessPlausibility": "easy",
    "stakes": "The specter of scandal looms over her; should she be linked to this crime, it could tarnish her reputation irrevocably. The community that once adored her might turn against her, and the very art that defines her could be rendered meaningless.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with an artistic flair, often weaving metaphors into her dialogue. Her laughter is quick, but her words are measured and thoughtful, punctuated by moments of self-reflection that reveal her inner turmoil.",
    "internalConflict": "Eleanor is torn between her feelings for Hale and her desire for independence. Each day spent in his presence is a bittersweet reminder of her unreciprocated love, leading her to question her self-worth and the very nature of love itself.",
    "personalStakeInCase": "For Eleanor, this crime is personal not only because of her ties to the victim but also as a test of her own courage. It represents a chance to reclaim her narrative and confront the feelings that have held her captive.",
    "paragraphs": [
      "Eleanor Voss stood amidst the riot of colors in her garden, the morning sun dappling the canvas before her. Her brush danced across the surface, capturing not just the hues of the flowers but the very essence of the life that bloomed around her. Yet, behind her artistic fervor lay a heart entwined in unrequited love. Captain Ivor Hale, with his roguish charm and thrilling tales, had captured more than just her admiration; he held her heart in a vice grip of longing. The portrait she painted in secret was not merely a likeness but a testament to her feelings, a silent confession that would never escape her lips.",
      "At the gallery showing at the manor, Eleanor's vibrant spirit shone. Laughter mingled with the clinking of glasses, and yet, her eyes often strayed to Hale, who floated from one socialite to another like a moth to flame. In those moments, she felt a pang of jealousy mixed with determination. She had to uncover the truth behind the murder that shattered the evening's festivities. The victim, a family friend, had ties to her art, and she felt a moral obligation to protect their legacy against any scandal that could tarnish it. The thought of being implicated sent shivers down her spine, for her reputation was as delicate as the canvases she painted on.",
      "As the investigation unfolded, Eleanor found herself drawn deeper into the web of intrigue. With each passing hour, the stakes grew higher. She was no longer just a local artist; she had become an amateur sleuth, determined to unearth the truth. The thrill of the chase ignited a fire within her, one that called for her to confront not only the mysteries at hand but also her own feelings for Hale. Could she stand up for herself, or would she remain forever in the shadows of his charm?",
      "Eleanor's journey became one of self-discovery. The more she delved into the case, the more she realized that her love for Hale could not define her worth. She needed to confront her emotions and find the courage to express them, or risk losing herself in the pursuit of someone who might never reciprocate. In the end, the true art Eleanor had to master was not merely painting but the art of standing up for her heart's desires amidst the chaos of a murder investigation."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose philanthropy has earned him admiration in Little Middleton. However, beneath his professional exterior lies a heart burdened by jealousy and unspoken love.",
    "publicPersona": "A pillar of the community, Dr. Finch is often seen in starched collars and tailored coats, a man whose very presence exudes professionalism and warmth. With a reputation for healing and a penchant for philanthropy, he is well-liked and respected by all. His ability to connect with patients and their families has made him a trusted figure, a true healer in every sense of the word.",
    "privateSecret": "Yet, hidden behind his kind smile is a heart that aches for Eleanor Voss. He harbors feelings for her that he believes he cannot compete with, especially when Captain Hale is in the picture. The jealousy gnaws at him, a constant reminder of his own insecurities and fears of inadequacy.",
    "motiveSeed": "The thought of losing Eleanor to Hale, a man whose charm and bravado overshadow his own, ignites a flame of jealousy within him. This jealousy could threaten his standing in the community, casting a shadow over his otherwise pristine reputation.",
    "motiveStrength": "moderate",
    "alibiWindow": "From 7:30 to 9:00, Dr. Finch was attending to a patient in the nearby village, a task that kept him occupied and away from the events unfolding at the manor.",
    "accessPlausibility": "unlikely",
    "stakes": "If any connection to the murder were to be discovered, it could ruin his professional reputation and jeopardize the trust he has built over the years.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch often speaks in a careful, measured tone, his words laced with a hint of humor that reflects his self-awareness. He has a tendency to chuckle at his own misfortunes, often employing dry wit to deflect attention from his insecurities.",
    "internalConflict": "Dr. Finch is caught in a web of conflicting emotions; he longs for Eleanor's affection but fears that his own shortcomings will drive her further into Hale's arms. The jealousy he feels is a double-edged sword, pushing him to act while simultaneously paralyzing him with doubt.",
    "personalStakeInCase": "This case matters to Dr. Finch not just because of the victim but because it represents a chance for him to confront his feelings for Eleanor. He must decide whether to fight for her love or accept that he may never win her heart.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the edge of his clinic, the crisp air of Little Middleton carrying the scents of autumn leaves and freshly baked bread. He was a man of science, yet his heart often felt like a riddle. Patients came to him seeking healing, but it was his own heart that ached for Eleanor Voss, the local artist whose laughter echoed in his dreams. He often found himself lost in thought, contemplating how to capture her attention amidst the distractions of her vibrant social life. His well-meaning attempts at charm often fell flat, leaving him with a self-deprecating chuckle, a defense mechanism against the sting of rejection.",
      "As the evening of the gallery showing unfolded, Dr. Finch was acutely aware of the magnetic pull between Eleanor and Captain Hale. The way she looked at Hale, with admiration in her eyes, stung like a bee. He had arrived late, having been tied up with a patient, and the moment he stepped into the manor, the air felt heavy with tension. Jealousy bubbled beneath the surface, a gnawing reminder that he was competing with a man whose charisma seemed to cast a shadow over his own quiet strength. The thought of losing Eleanor to Hale was unbearable, yet he felt powerless to act.",
      "When the news of the murder broke, Dr. Finch felt a mixture of dread and urgency. He knew he needed to help, to prove himself as more than just a spectator in Eleanor's life. His medical expertise could be invaluable, but the fear of being implicated in the scandal loomed large. The stakes were high; his reputation was on the line, and he could not allow jealousy to cloud his judgment. He resolved to investigate quietly, to uncover the truth without drawing attention to his own feelings.",
      "In the days that followed, Dr. Finch found himself grappling with his emotions. Each clue he uncovered brought him closer to the truth but further from his own desires. The case had become a crucible, forcing him to confront not just the murder but also his feelings for Eleanor. He realized that he had a choice to make: to remain in the shadows of his own making or to step forward, risking everything for a chance at love. The clock was ticking, and the conspiracy surrounding the murder was only the beginning of his own internal battle."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired military officer known for his charm and adventurous spirit. However, his dashing persona hides a web of secrets that could unravel his life.",
    "publicPersona": "With a smile that could light up the darkest room, Captain Hale is the quintessential charming lothario. His tales of adventure and bravery captivate audiences, and his flirtatious nature makes him the darling of every social event in Little Middleton. He wears his charm like a well-tailored suit, effortlessly drawing people into his orbit.",
    "privateSecret": "Behind the bravado, Hale is entangled in a secret engagement with Beatrice Quill, a woman who represents stability in a life filled with chaos. Yet, his heart still flutters for Eleanor, complicating his feelings and his commitments.",
    "motiveSeed": "The victim held a scandalous secret that threatened to expose Hale's past, a revelation that could ruin his reputation and jeopardize his engagement with Beatrice. The risk of being unmasked spurred him to contemplate drastic measures.",
    "motiveStrength": "compelling",
    "alibiWindow": "Hale left the party at 9:00 to meet an acquaintance, but his alibi remains unverified, creating a cloud of suspicion around him.",
    "accessPlausibility": "possible",
    "stakes": "The stakes could not be higher; if the truth comes to light, his engagement with Beatrice could disintegrate, and he could lose the respect of a community that has adored him.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Hale speaks with an effortless charm, often punctuating his sentences with a wry smile or a playful quip. His rhythm is relaxed, almost languid, which allows him to weave in humor even in serious conversations, creating an air of casual confidence.",
    "internalConflict": "Captain Hale is caught in a tempest of emotions; he must navigate his feelings for Eleanor while honoring his commitment to Beatrice. The fear of scandal threatens to unravel the carefully crafted image he has built, leaving him questioning his own values and desires.",
    "personalStakeInCase": "For Hale, the murder investigation is not just a matter of clearing his name; it is an opportunity to confront the consequences of his past choices. He must decide if he is willing to sacrifice his engagement for a chance at true love or if he will continue to hide behind a façade.",
    "paragraphs": [
      "Captain Ivor Hale stood at the edge of the manor's grand balcony, a glass of whiskey in hand, his gaze sweeping over the twinkling lights of Little Middleton. He was the embodiment of charm, a retired military officer whose tales of glory had made him a local legend. Yet, behind that confident exterior lay a man grappling with secrets that could shatter his carefully cultivated image. His heart raced not from the thrill of adventure, but from the weight of the scandal that loomed over him like a dark cloud. The victim had threatened to expose his past, a revelation that could unravel his engagement to Beatrice Quill and tarnish the reputation he had fought so hard to build.",
      "As the evening progressed, Hale found himself drawn to Eleanor, her laughter a siren's call that beckoned him closer. The way she painted the world with her words and colors ignited a longing within him, one that he had tried to suppress in favor of his engagement. But the heart has a way of complicating matters, and Hale's own feelings for Eleanor threatened to derail his plans for a stable future. He chuckled at the absurdity of his situation; here he was, a man of action, paralyzed by the very emotions he prided himself on controlling.",
      "When the news of murder shattered the party's merriment, Hale felt a jolt of panic. The stakes were raised, and he knew he had to tread carefully. The last thing he needed was for suspicion to fall on him, especially with his checkered past hanging like a noose around his neck. He had left the party at 9:00, but his alibi was shaky at best. As whispers of scandal filled the air, Hale resolved to uncover the truth, not just to clear his name but to protect the fragile web of relationships he had spun. The thought of losing both Eleanor and Beatrice drove him to take action, a dangerous game he was all too familiar with.",
      "As the investigation unfolded, Hale found himself at a crossroads. The allure of a life with Eleanor was intoxicating, yet the weight of his engagement to Beatrice pressed heavily on his shoulders. Would he risk everything for a chance at true love, or would he continue to hide behind the façade of a charming lothario? The clockwork of his life was ticking down, and the conspiracy surrounding the murder had the potential to unravel everything he held dear."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a glamorous socialite driven by ambition and the desire to secure her future. However, her insecurities threaten to unravel her plans.",
    "publicPersona": "Beatrice is the epitome of glamour, a socialite who knows how to work a room. With her perfectly coiffed hair and designer gowns, she is often the center of attention at events in Little Middleton. Her charm and connections make her a formidable figure in the social scene, and she is keenly aware of the power that comes with being the belle of the ball.",
    "privateSecret": "Yet, beneath the glitz and glamour, Beatrice's heart is troubled. She is desperate to secure her engagement to Hale, but she knows all too well about his lingering feelings for Eleanor, which gnaw at her self-esteem and sense of security.",
    "motiveSeed": "The fear of losing Hale to Eleanor drives her to desperation, as she knows that the resulting social disgrace could shatter her carefully constructed world.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice was in her room preparing for the evening's event, but the lack of a solid alibi leaves her vulnerable to suspicion.",
    "accessPlausibility": "easy",
    "stakes": "Beatrice's social standing and future with Hale hang in the balance; if she were implicated in the murder, it could lead to her social downfall.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a polished elegance, her words carefully chosen to convey both charm and authority. She often employs a subtle, biting wit that can cut through the air, revealing her insecurities beneath the surface.",
    "internalConflict": "Beatrice's desire for status and security is at odds with her fear of inadequacy. She is constantly battling her own insecurities, questioning whether she is enough for Hale and whether their engagement can withstand the scrutiny of social circles.",
    "personalStakeInCase": "For Beatrice, the murder investigation is not just a matter of clearing her name; it is an opportunity to confront her insecurities and fight for the future she desires with Hale. She must decide how far she is willing to go to secure her place in society.",
    "paragraphs": [
      "Beatrice Quill stood at the mirror, adjusting her pearls with a practiced grace. The reflection staring back at her was that of a woman who had mastered the art of social climbing; she was the belle of the ball, a figure of glamour and poise. Yet, beneath the surface, her heart fluttered with anxiety. Captain Hale, her fiancé, was a man of charm and adventure, but the shadow of Eleanor Voss loomed large in her world. Beatrice could feel the weight of competition pressing down on her, a constant reminder that she must prove herself worthy of Hale's affections.",
      "As she prepared for the evening's event, Beatrice's mind raced with thoughts of the potential scandal that could arise from the murder. The victim's ties to her social circle made the stakes all the more precarious. If she were implicated, it would not only tarnish her reputation but also threaten her future with Hale. She chuckled softly, her laughter tinged with a hint of bitterness; it was as if the universe conspired against her, turning her dreams into a potential nightmare. The thought of losing Hale sent shivers down her spine, igniting a fire of determination within her to ensure that she would not be cast aside.",
      "At the gallery showing, Beatrice worked the room with a practiced finesse, her charm masking the insecurities that plagued her. She engaged in polite conversations, her words laced with a subtle savagery, each compliment delivered with a smile that barely concealed the tension behind it. The whispers of Hale's lingering feelings for Eleanor gnawed at her, making every interaction feel like a performance. She was determined to secure her future, but the fear of inadequacy loomed large, threatening to unravel her carefully constructed façade.",
      "As the investigation unfolded, Beatrice found herself at a crossroads. The murder investigation had become a catalyst for her own insecurities, forcing her to confront the lengths she would go to secure her place in Hale's life. Would she fight for him, or would she let her fears dictate her actions? The clock was ticking, and the pressure to maintain her social standing weighed heavily on her shoulders. In a world where appearances were everything, Beatrice knew she would need to find the strength to confront her demons, or risk losing it all."
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
    "summary": "A sprawling country estate steeped in mystery and social tension, where secrets are as plentiful as the shadows.",
    "visualDescription": "The manor looms with its grey stone façade, ivy creeping up its sides, and tall, narrow windows that seem to watch over the expansive gardens and dark woodlands surrounding it.",
    "atmosphere": "A tense and foreboding atmosphere permeates the estate, as unspoken class tensions simmer beneath the surface.",
    "paragraphs": [
      "Little Middleton Manor stands as a solitary sentinel against the encroaching woods, its imposing grey stone walls cloaked in creeping ivy and shadows. The estate is a labyrinth of secrets, with narrow corridors that twist and turn, leading to locked doors and hidden spaces. A wrought-iron gate at the entrance, flanked by ancient yew trees, offers the only access to the outside world, while the distant sound of rain pattering against the roof echoes the unease within. As the overcast sky looms overhead, the air is thick with the scent of damp earth and decaying leaves, a reminder of the isolation that envelops this grand but troubled abode.",
      "Inside, the drawing room is an elaborate mix of comfort and oppression, with heavy velvet drapes pulled tightly against the windows, blocking any hint of the outside world. The flickering glow of gas lamps casts a warm light over plush armchairs and a grand piano, yet the atmosphere feels stifling, as if the very walls are closing in on the occupants. The soft ticking of a mantel clock punctuates the silence, each tick a reminder of the time slipping away and the secrets that linger just beyond reach. The scent of polished wood and leather mingles with the faintest trace of tobacco smoke, creating an intoxicating mix that heightens the tension in the air.",
      "As night falls, the manor transforms into a shadowy labyrinth, where every creak of the floorboards and rustle of fabric feels amplified in the stillness. The gardens outside, once vibrant and alive, take on an eerie quality, shadows stretching and shifting as the wind whispers through the trees. The distant rumble of thunder adds to the foreboding atmosphere, hinting at the tempest brewing both outside and within the household. Here, secrets are not just whispered; they are felt, hovering in the air like the impending storm, ready to unleash chaos at any moment."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical of the English climate in the fall.",
    "timeFlow": "Three days of mounting tension, where each hour feels longer than the last as the mystery unfolds.",
    "mood": "Tense and foreboding, reflecting underlying class tensions and unease in the household.",
    "eraMarkers": [
      "Petrol touring cars parked haphazardly along the narrow, winding roads leading to the estate.",
      "Typewriters clacking in the study as correspondence is crafted amidst the growing unease.",
      "Frequent power outages due to the aging domestic wiring, leaving rooms dim and shrouded in shadow."
    ],
    "sensoryPalette": {
      "dominant": "The damp, earthy smell of the garden after rain, clinging to everything like a secret waiting to be revealed.",
      "secondary": [
        "The faint, acrid scent of smoke from the fireplace, mingling with the musty air of the old manor.",
        "The metallic tang of tension that hangs in the air, palpable and thick."
      ]
    },
    "paragraphs": [
      "The atmosphere around Little Middleton Manor is steeped in an uneasy silence, broken only by the occasional rustle of leaves in the wind or the distant sound of thunder rumbling ominously. The overcast skies cast a pall over the estate, making the gardens feel like a forgotten realm, where shadows dance and secrets lurk just out of sight. The air is crisp with the promise of rain, and the scent of damp earth permeates the atmosphere, evoking a sense of foreboding that grips the heart.",
      "As the story unfolds over three days, time seems to stretch, each moment filled with the weight of unspoken words and hidden agendas. The walls of the manor seem to close in, pressing down on the occupants as they navigate the treacherous waters of class tensions and familial strife. Each tick of the clock is a reminder that the storm is not just outside but brewing within the very heart of Little Middleton Manor."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library is a grand room lined with dark oak bookshelves, the air thick with dust and the faint smell of old leather bindings. A large, ornate desk stands in the center, papers strewn across its surface, hinting at a struggle that has taken place.",
      "sensoryDetails": {
        "sights": [
          "Sunlight struggles to penetrate the heavy drapes, casting long shadows across the room that seem to dance with the flicker of the gaslight.",
          "The spines of countless books, some cracked and faded, form a silent audience to the unfolding drama, their titles whispering secrets of their own."
        ],
        "sounds": [
          "The creak of the wooden floorboards underfoot echoes ominously in the silence, amplifying the sense of isolation in the expansive room.",
          "A distant clock chimes, its sound reverberating through the air, adding to the tension that hangs like a storm cloud overhead."
        ],
        "smells": [
          "The musty scent of aged paper and leather fills the air, a reminder of the many stories held within the pages of the books.",
          "A hint of smoke from the fireplace lingers, mingling with the dust, evoking a sense of nostalgia and decay."
        ],
        "tactile": [
          "The leather of the armchair is cracked and worn, its texture telling tales of countless hours spent lost in thought or study.",
          "The cool, smooth surface of the desk contrasts sharply with the warmth of the flickering gaslight, creating an unsettling juxtaposition."
        ]
      },
      "accessControl": "The library is accessible only to family members and select staff during daylight hours; it is locked at night to prevent unauthorized entry.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the library's window panes, distorting the view of the garden outside.",
            "The muted colors of the room blend with the grey light, creating an atmosphere of melancholy."
          ],
          "sounds": [
            "The steady patter of rain on the roof adds a rhythmic backdrop to the stillness inside.",
            "Occasional gusts of wind rattle the window shutters, a reminder of the storm brewing outside."
          ],
          "smells": [
            "The scent of wet earth wafts in through the slightly ajar window, mingling with the mustiness of the library.",
            "A faint whiff of mildew hints at the dampness that has seeped into the very fabric of the manor."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is bathed in a flat, grey light that dulls the vibrancy of the library's colors.",
            "Shadows cling to the corners, as if reluctant to leave the sanctuary of the books."
          ],
          "sounds": [
            "The silence is only broken by the occasional rustle of paper, as if the books themselves are whispering to one another.",
            "The ticking of the clock becomes a haunting reminder of the passage of time in this still space."
          ],
          "smells": [
            "The rich aroma of old leather and paper fills the air, a scent that speaks of history and forgotten tales.",
            "The faint smell of ash from the fireplace lingers, adding a layer of warmth to the otherwise cool atmosphere."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The flickering gaslight casts dancing shadows across the bookshelves, creating a sense of movement in the stillness.",
            "The last rays of sunlight filter through the drapes, illuminating dust motes suspended in the air."
          ],
          "sounds": [
            "The distant sound of laughter from the drawing room contrasts sharply with the solitude of the library.",
            "The gentle crackle of the fire adds a sense of warmth, yet feels out of place amidst the tension."
          ],
          "smells": [
            "The inviting scent of burning wood mingles with the musty aroma of the library, creating a cozy yet foreboding atmosphere.",
            "A hint of tobacco smoke drifts in from the adjoining room, a reminder of the tensions simmering just beyond the door."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library serves as the heart of Little Middleton Manor, a place of refuge for the family and a potential crime scene that holds the key to unraveling the mystery. Books line the walls, their spines like sentinels, while the air is thick with the weight of unspoken secrets. Here, amidst the shadows, the tension is palpable, as the search for truth unfolds in the dim light of the gas lamps.",
        "As the rain patters against the window, the library takes on an otherworldly quality, the atmosphere charged with uncertainty. Each creak of the floorboards and flutter of a page seems to echo the whispers of the past, drawing a veil over the present. The library, once a sanctuary of knowledge, now stands as a reminder of the fragile boundaries between safety and danger."
      ]
    },
    {
      "id": "study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The study is a small, intimate room filled with dark wood furniture and a large, imposing desk cluttered with papers and typewriter. A leather armchair sits beside a fireplace, its surface worn and cracked from years of use.",
      "sensoryDetails": {
        "sights": [
          "The flickering light from the fire casts a warm glow over the rich mahogany desk, illuminating scattered papers that hint at the occupant's frantic thoughts.",
          "Framed photographs of family members adorn the walls, their eyes seeming to follow you as you move about the room."
        ],
        "sounds": [
          "The soft crackle of the fire provides a comforting backdrop to the otherwise quiet space, broken only by the occasional rustle of paper.",
          "The rhythmic clacking of a typewriter echoes as correspondence is hastily crafted, each key press a reminder of the urgency of the moment."
        ],
        "smells": [
          "The rich scent of polished wood and leather fills the air, mingling with the faint aroma of smoke from the fireplace.",
          "A hint of ink lingers, a reminder of the letters that have been penned in moments of desperation."
        ],
        "tactile": [
          "The smooth surface of the desk contrasts with the rough texture of the typewriter, its keys worn from constant use.",
          "The warmth radiating from the fireplace creates a comforting cocoon, yet the chill of the surrounding air reminds you of the outside world."
        ]
      },
      "accessControl": "Access to the study is restricted to the family and select staff, with the door kept locked when not in use to protect sensitive documents.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the window, distorting the view of the garden as grey light filters into the room.",
            "The fire crackles softly, its glow a stark contrast to the dullness outside."
          ],
          "sounds": [
            "The steady drumming of rain on the roof creates a rhythmic ambiance, a comforting sound in the otherwise quiet space.",
            "Occasional gusts of wind rattle the window, momentarily breaking the silence."
          ],
          "smells": [
            "The scent of damp earth wafts in through the slightly ajar window, mixing with the rich aroma of wood and leather.",
            "A faint hint of mildew lingers, a reminder of the manor's age and the dampness of the season."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is cast in a muted light, shadows deepening in the corners as the afternoon wears on.",
            "The flickering firelight dances across the walls, illuminating hints of dust motes suspended in the air."
          ],
          "sounds": [
            "The silence is punctuated by the soft rustle of paper as letters are drafted, each sound resonating in the stillness.",
            "The distant sound of thunder rumbles, echoing the tension that hangs in the air."
          ],
          "smells": [
            "The scent of burning wood from the fireplace mingles with the mustiness of the room, creating an atmosphere of nostalgia and unease.",
            "The lingering aroma of ink adds to the weight of the moment, as letters are crafted with urgency."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of the fire casts flickering shadows on the walls, creating an intimate ambiance in the study.",
            "The last rays of sunlight filter through the window, illuminating the dust motes that dance in the air."
          ],
          "sounds": [
            "The crackling of the fire is a soothing sound, a comforting presence in the otherwise tense atmosphere.",
            "The distant laughter from the drawing room contrasts sharply with the solitude of the study, heightening the sense of isolation."
          ],
          "smells": [
            "The inviting scent of burning wood envelops the room, mingling with the rich aroma of leather and ink.",
            "A hint of tobacco smoke wafts in from the adjacent room, a reminder of the looming tensions outside."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The study serves as a sanctuary for the family, a place where decisions are made and secrets are kept. The cluttered desk hints at the weight of responsibility that rests on the shoulders of its occupant, while the flickering fire provides a momentary respite from the storm brewing outside. Each letter typed is a step closer to uncovering the truth, and every shadow feels alive with the potential for revelation.",
        "As the day turns to night, the study becomes a cocoon of intimacy and tension, where the walls seem to listen and the air is thick with unspoken words. The typewriter's keys click rhythmically, a soundtrack to the unfolding mystery, as the flickering flames cast dancing shadows that mirror the turmoil within the household."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is an elegant space adorned with plush furnishings, intricate wallpaper, and a grand chandelier that hangs from the ceiling, its crystals catching the light.",
      "sensoryDetails": {
        "sights": [
          "Lavish drapes frame the tall windows, their rich colors deepening with the evening light as shadows stretch across the room.",
          "An ornate fireplace dominates one wall, its mantle lined with framed photographs and decorative objects that tell the story of the family."
        ],
        "sounds": [
          "The soft murmur of conversation fills the air, punctuated by the occasional clink of glasses as guests navigate the social intricacies of the evening.",
          "The crackling of the fire provides a comforting backdrop, its warmth contrasting with the coolness of the room."
        ],
        "smells": [
          "The scent of fresh flowers from a nearby vase mingles with the lingering aroma of tobacco smoke, creating a fragrant tapestry of the evening.",
          "A hint of polished wood adds to the air of sophistication, evoking the history contained within the room."
        ],
        "tactile": [
          "The plush upholstery of the sofas invites guests to sink in, while the coolness of the marble fireplace contrasts sharply with the warmth of the fire.",
          "The smooth surface of the coffee table offers a sense of elegance, yet feels strangely out of place amidst the tension in the air."
        ]
      },
      "accessControl": "The drawing room is accessible to all guests and family members, serving as the central gathering space for social events and discussions.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the windows, distorting the view of the garden and casting a grey pall over the room.",
            "The morning light is dim, creating an atmosphere of melancholy that hangs heavily in the air."
          ],
          "sounds": [
            "The steady patter of rain on the roof creates a rhythmic backdrop, a reminder of the world outside.",
            "Occasional gusts of wind rattle the window shutters, adding to the feeling of isolation."
          ],
          "smells": [
            "The scent of damp earth wafts in through the slightly ajar window, mingling with the freshness of the flowers in the vase.",
            "A hint of mildew lingers, a reminder of the dampness that seeps into every corner of the manor."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is cast in a muted light, shadows deepening in the corners as the afternoon wears on.",
            "The flickering firelight dances across the walls, illuminating hints of dust motes suspended in the air."
          ],
          "sounds": [
            "The silence is punctuated by the soft rustle of paper as letters are drafted, each sound resonating in the stillness.",
            "The distant sound of thunder rumbles, echoing the tension that hangs in the air."
          ],
          "smells": [
            "The scent of burning wood from the fireplace mingles with the mustiness of the room, creating an atmosphere of nostalgia and unease.",
            "The lingering aroma of ink adds to the weight of the moment, as letters are crafted with urgency."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The warm glow of the chandelier casts a golden light over the room, creating an inviting ambiance.",
            "The last rays of sunlight filter through the windows, illuminating the intricate details of the wallpaper."
          ],
          "sounds": [
            "The gentle hum of conversation fills the air, a mixture of laughter and whispers that hints at underlying tensions.",
            "The crackling of the fire provides a soothing backdrop, its warmth contrasting with the coolness of the evening air."
          ],
          "smells": [
            "The scent of fresh flowers mingles with the warmth of the fire, creating a fragrant atmosphere that feels both inviting and tense.",
            "A hint of tobacco smoke drifts in from the adjoining rooms, a reminder of the complex social dynamics at play."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room is a hub of activity, where laughter and conversation mingle amidst the elegant décor. Plush sofas invite guests to settle in, while the grand chandelier casts a warm glow over the proceedings. Yet beneath the surface, a current of tension flows, as unspoken words linger in the air, waiting for the right moment to erupt. Here, amidst the laughter, secrets are shared, and alliances are formed, but danger lurks just beyond the threshold.",
        "As night descends, the atmosphere in the drawing room shifts, shadows elongating and deepening as the fire crackles softly in the fireplace. The laughter fades, replaced by hushed tones and furtive glances, as guests navigate the delicate web of social interactions. The room, once a sanctuary of warmth and welcome, becomes a stage for intrigue, where every conversation could hold the key to unraveling the mystery that envelops Little Middleton Manor."
      ]
    }
  ],
  "note": "",
  "cost": 0.0026704804499999998,
  "durationMs": 34023
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1932,
    "month": "December",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "December",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "chilly winds"
    ],
    "daylight": "Short daylight hours with twilight settling in by four o'clock in the afternoon, creating an early darkness.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the household settles into its after-dinner routines.",
    "holidays": [
      "Christmas",
      "Boxing Day"
    ],
    "seasonalActivities": [
      "preparing for Christmas festivities",
      "attending local carol services",
      "setting up decorations within the estate"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suit",
        "tailored overcoat",
        "homburg hat"
      ],
      "casual": [
        "tweed jacket",
        "corduroy trousers",
        "knitted sweater"
      ],
      "accessories": [
        "silk tie",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length evening gown",
        "tailored suit with a cinched waist",
        "fur stole"
      ],
      "casual": [
        "knitted cardigan",
        "pleated skirt",
        "blouse with a Peter Pan collar"
      ],
      "accessories": [
        "cloche hat",
        "string of pearls",
        "handbag with a chain strap"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "the rise of streamlined silhouettes",
      "pastel colors in evening wear"
    ],
    "socialExpectations": [
      "men expected to be the primary breadwinners",
      "women encouraged to maintain the household",
      "emphasis on social etiquette and decorum"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Great Depression continues to impact employment and economic stability",
      "Political tension as the rise of fascism in Europe stirs concerns",
      "In Britain, the government grapples with social unrest and calls for reform"
    ],
    "politicalClimate": "A climate of uncertainty and anxiety, with increasing polarization over class issues and responses to economic hardship.",
    "economicConditions": "High unemployment rates, with many families struggling to make ends meet amidst rising prices and limited resources.",
    "socialIssues": [
      "class disparities becoming more pronounced",
      "growing awareness of social justice and labor rights",
      "debates over women's suffrage and roles in society"
    ],
    "internationalNews": [
      "Hitler rises to power in Germany, alarming many in Europe",
      "Tensions in the Far East as Japanese expansionism grows",
      "Economic discussions surrounding the upcoming London Economic Conference"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'The Merry Widow Waltz' by Franz Lehár",
        "George Gershwin's 'Rhapsody in Blue'",
        "Bing Crosby's holiday hits"
      ],
      "films": [
        "'Scarface' starring Paul Muni",
        "'The Sign of the Cross' starring Fredric March",
        "'The Front Page' featuring Adolphe Menjou"
      ],
      "theater": [
        "'The Royal Family' by George S. Kaufman",
        "'Rope' by Patrick Hamilton",
        "'A Midsummer Night's Dream' revival"
      ],
      "radio": [
        "'The Shadow' mystery series",
        "'Amos 'n' Andy' comedy show",
        "news bulletins on the ongoing economic crisis"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Cathedral' by T.S. Eliot",
        "'Brave New World' by Aldous Huxley",
        "'The Glass Key' by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "social realism",
        "science fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator becoming more common in households",
        "the introduction of the first practical radio broadcasting equipment",
        "advancements in aviation technology"
      ],
      "commonDevices": [
        "typewriters for correspondence",
        "phonographs for music",
        "electric lighting in homes, though with frequent outages"
      ],
      "emergingTrends": [
        "the adoption of household appliances like washing machines",
        "the rise of cinema as a primary form of entertainment",
        "increased use of automobiles for leisure travel"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: two pence",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "gathering for tea in the afternoon",
        "attending church services on Sundays",
        "participating in community events like Christmas fairs"
      ],
      "socialRituals": [
        "afternoon tea with friends or family",
        "exchanging Christmas cards and gifts",
        "hosting festive dinners for local acquaintances"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased scrutiny of the wealthy",
      "growing resentment towards the upper classes",
      "awareness of class mobility and its limits"
    ],
    "gender": [
      "traditional gender roles are being challenged",
      "women's participation in the workforce is slowly increasing",
      "expectations for women to maintain social graces"
    ],
    "race": [
      "racial tensions simmering, particularly regarding immigration",
      "growing awareness of racial equality issues",
      "increasingly diverse immigrant populations in urban areas"
    ],
    "generalNorms": [
      "strict adherence to social etiquette",
      "importance of family reputation in society",
      "emphasis on community involvement and charity work"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth and wood smoke fills the air, mingling with the faint aroma of roasted chestnuts.",
    "The sound of rain pattering against the windowpanes creates a rhythmic backdrop to the hushed conversations inside the estate.",
    "Twinkling lights from the Christmas decorations cast a warm glow, contrasting the cold and gloomy exterior of the country house."
  ],
  "paragraphs": [
    "In December 1932, the atmosphere at the country house estate is thick with tension. Overcast skies stretch endlessly above, punctuated only by the intermittent fall of rain, casting a gloom that seems to seep into the very walls of the manor. As the days grow shorter, daylight fades by four o'clock, and the flickering glow of the hearth becomes a refuge for the inhabitants. With Christmas approaching, the estate buzzes with preparations — festive decorations hung and carols practiced, yet a sense of unease lingers in the air, reflecting the broader societal strains of the Great Depression and rising political tensions across Europe.",
    "Fashion at this time reflects the duality of the period; men favor double-breasted wool suits, tailored for both elegance and warmth, while women adorn themselves in tea-length evening gowns that emphasize a cinched waist, often accompanied by fur stoles. Cloche hats and silk ties complete their ensembles, marking a careful adherence to social norms. The Art Deco influence is palpable in the geometrical patterns of their attire, revealing a longing for style amid economic hardship. Yet, beneath the surface, the class disparities are starkly pronounced, with the affluent hosting lavish gatherings while the less fortunate scrape together a meager existence.",
    "Daily life is punctuated by rituals that underscore societal expectations — afternoon tea served with meticulous care, the exchange of Christmas cards, and the hosting of festive dinners among the well-to-do. For many, the prices of everyday items are a constant reminder of the economic strife: a loaf of bread costs four pence, a pint of milk two pence, and a taxi ride across town sets one back two shillings. Community gatherings serve as a vital outlet, providing a sense of connection amidst the pervasive unrest. As the clock ticks toward the holiday, the air grows heavier with anticipation and anxiety, the perfect backdrop for a mystery waiting to unfold."
  ],
  "note": "",
  "cost": 0.0011243991,
  "durationMs": 15802
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A wealthy family gathers at their isolated estate for a tense reunion amid the Great Depression, where class tensions and scrutiny of privilege collide under the shadow of rising fascism.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Heightened class tensions and scrutiny of wealth create a pressure cooker environment, where privilege is both a shield and a target."
  },
  "setting": {
    "location": "A large, isolated manor house surrounded by extensive gardens and woodlands, typical of the English countryside.",
    "institution": "Country house estate",
    "weather": "Overcast with intermittent rain, typical of the English climate in the fall."
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
  },
  {
    "id": "victim_time",
    "value": "a quarter past twelve",
    "description": "The time the victim was last seen alive"
  },
  {
    "id": "murder_time",
    "value": "twenty minutes past twelve",
    "description": "The estimated time of death according to the coroner"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows a time of twenty minutes to nine.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This suggests the time of death may be misrepresented.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "This contradicts Dr. Mallory Finch's alibi of being with Richard until quarter past nine.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "It raises doubts about Dr. Mallory Finch's whereabouts.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "spatial",
      "description": "Footprints lead away from the clock towards the garden.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This indicates someone left the scene quickly.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "This indicates someone tampered with the clock after Richard was last seen.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "It suggests a deliberate attempt to mislead.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "Dust on the clock shows it was disturbed recently despite being untouched for days.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "It implies recent handling of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "The disturbance was likely to alter the time to frame another suspect.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This suggests a premeditated act.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock was tampered with to misrepresent the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "It reveals the core mechanism of the murder.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "This contradicts Dr. Mallory Finch's alibi of being with Richard until quarter past nine.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "It raises doubts about Dr. Mallory Finch's whereabouts.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she was seen at the charity event during the time of Richard's death.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This narrows the solution toward Dr. Mallory Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was at the docks at the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This confirms he could not have committed the murder.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_2",
      "category": "testimonial",
      "description": "Eliminates Beatrice Quill because she was at the theater during the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This confirms she could not have committed the murder.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
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
      "clue_core_contradiction_chain",
      "clue_culprit_direct_dr_mallory_finch"
    ],
    "mid": [
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_core_elimination_chain"
    ],
    "late": [
      "clue_late_optional_slot_1",
      "clue_late_optional_slot_2"
    ]
  },
  "fairPlayChecks": {
    "allEssentialCluesPresent": true,
    "noNewFactsIntroduced": true,
    "redHerringsDontBreakLogic": true
  },
  "latencyMs": 12906,
  "cost": 0.0045406119
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

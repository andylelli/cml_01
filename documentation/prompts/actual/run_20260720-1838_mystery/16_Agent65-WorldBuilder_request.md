# Actual Prompt Record

- Run ID: `mystery-1784572735935`
- Project ID: ``
- Timestamp: `2026-07-20T18:43:02.092Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `ff3abaf149c19654`

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
    "title": "The Delayed Reckoning",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Cannes",
      "country": "France",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "poisoning"
    }
  },
  "death_method": "poisoned with a rare botanical extract",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "An observant guest at the hotel",
      "private_secret": "keeps a secret",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "between 6 PM and 8 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "common areas",
        "dining room"
      ],
      "behavioral_tells": [],
      "stakes": "Discovery of the truth",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A respected physician",
      "private_secret": "Has a history of rivalry with the victim",
      "motive_seed": "Professional jealousy",
      "motive_strength": "strong",
      "alibi_window": "between 6 PM and 8 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "medical supplies",
        "guest areas"
      ],
      "behavioral_tells": [
        "nervous demeanor"
      ],
      "stakes": "Reputation and career",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A charming naval officer",
      "private_secret": "In love with the victim's sister",
      "motive_seed": "Unrequited love",
      "motive_strength": "moderate",
      "alibi_window": "between 6 PM and 8 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "ship supplies",
        "hotel bar"
      ],
      "behavioral_tells": [],
      "stakes": "Love and honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A lively hotel staff member",
      "private_secret": "Has a crush on the victim",
      "motive_seed": "Heartbreak",
      "motive_strength": "weak",
      "alibi_window": "between 6 PM and 8 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "hotel staff areas"
      ],
      "behavioral_tells": [
        "eager to please"
      ],
      "stakes": "Personal happiness",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "An affluent guest",
      "private_secret": "Knows too much about others",
      "motive_seed": "Gossip and manipulation",
      "motive_strength": "moderate",
      "alibi_window": "between 6 PM and 8 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "social gatherings"
      ],
      "behavioral_tells": [
        "curious nature"
      ],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A well-known author",
      "private_secret": "Had many enemies",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "evening",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
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
      "summary": "During a charity gala at a luxurious hotel in Cannes, a beloved author is found dead after collapsing suddenly. As the guests panic, Eleanor Voss steps in to uncover the truth behind the tragic incident, only to discover a web of jealousy, rivalry, and hidden motives."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A rare botanical poison, administered in a drink, takes effect hours later, creating confusion around the time of death.",
      "delivery_path": [
        {
          "step": "The poison is mixed into Hugo's drink during the gala."
        },
        {
          "step": "The poison activates after a delay, causing a sudden collapse that appears natural."
        }
      ]
    },
    "outcome": {
      "result": "Hugo Vane is pronounced dead after being poisoned."
    }
  },
  "false_assumption": {
    "statement": "Hugo died from a sudden heart attack due to stress.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses recall Hugo appearing anxious before his collapse, leading them to believe stress caused his heart attack.",
    "what_it_hides": "The true cause of death was poisoning, ingeniously concealed by the timing of the toxin's effect."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses claim Captain Hale argued with Hugo earlier in the evening.",
      "Hugo was seen with Captain Hale shortly before his collapse."
    ],
    "the_one_flaw": "No evidence of poison found in Captain Hale's possession.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses reported seeing Hugo and Dr. Finch arguing.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The argument was about a literary critique, not related to any motive for murder.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A strange odor reported by guests near Hugo before his collapse.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The odor was from flowers in a nearby vase, not related to the poisoning.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent"
    ],
    "rationale": "All suspects were present at the hotel during the gala and had motives to harm Hugo."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "6 PM - 8 PM"
      ],
      "windows": [
        "poisoning likely occurred before 7 PM"
      ],
      "contradictions": [
        "Hugo's collapse was reported at 7:15 PM, but he was seen drinking at 6:45 PM."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Eleanor Voss"
      ],
      "objects": [
        "Hugo's drink",
        "poison bottle"
      ],
      "permissions": [
        "All guests had access to the bar area during the gala."
      ]
    },
    "physical": {
      "laws": [
        "Poison requires time to take effect."
      ],
      "traces": [
        "Empty poison bottle found in Dr. Finch's room."
      ]
    },
    "social": {
      "trust_channels": [
        "Professional jealousy between Dr. Finch and Hugo."
      ],
      "authority_sources": [
        "Dr. Finch's medical credentials."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall seeing Hugo drinking from a glass shortly before his collapse.",
        "correction": "Hugo's drink was likely tampered with, leading to his death.",
        "effect": "Narrows suspect pool to those with access to the bar.",
        "required_evidence": [
          "Witness statements about Hugo drinking.",
          "Security footage showing guests around the bar."
        ],
        "reader_observable": true
      },
      {
        "observation": "An empty bottle labeled with a rare botanical poison is found in Dr. Finch's room.",
        "correction": "Dr. Finch had access to the poison and could have used it.",
        "effect": "Narrows suspect pool to Dr. Finch.",
        "required_evidence": [
          "The empty bottle found in Dr. Finch's room.",
          "Dr. Finch's alibi for the time of the murder."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses noted a peculiar floral scent lingering on Hugo's clothing.",
        "correction": "The scent matches the poison found in Dr. Finch's possession.",
        "effect": "Eliminates other suspects, confirming Dr. Finch's guilt.",
        "required_evidence": [
          "Witness statements about the floral scent.",
          "Chemical analysis of the residue on Hugo's clothing."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Eleanor Voss stages a reenactment of the drinking scene, using a glass with the same floral scent to provoke a reaction from Dr. Finch.",
    "knowledge_revealed": "Dr. Finch's reaction to the floral scent will indicate her guilt.",
    "pass_condition": "If Dr. Finch shows discomfort or panic when the scent is revealed, it confirms her involvement.",
    "evidence_clues": [
      "clue_8",
      "clue_culprit_direct_1",
      "clue_2",
      "clue_id_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements about Hugo drinking and security footage establish access to the bar. Step 2: The empty poison bottle found in Dr. Finch's room connects her to the crime. Step 3: The floral scent on Hugo's clothing links the poison to Dr. Finch, leading to her guilt."
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
        "Observe Dr. Finch's reaction"
      ],
      "test_type": "behavioral"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by other guests.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No access to Hugo's drink.",
        "supporting_clues": [
          "clue_id_3"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness accounts confirm she was elsewhere.",
        "supporting_clues": [
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with gathered evidence"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_1",
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
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_id_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Security footage"
      },
      {
        "clue_id": "clue_id_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Chemical analysis result"
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_fp_elimination_beatrice_quill",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_fp_elimination_sylvia_trent",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_id_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Empty bottle evidence"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A charismatic traveling journalist grappling with the shadows of her past, Eleanor finds herself at a seaside hotel, drawn into a web of secrets and lies.",
    "publicPersona": "Eleanor is known for her engaging articles that capture the pulse of societal changes, effortlessly charming her readers with her vibrant prose and insightful observations.",
    "privateSecret": "Haunted by the guilt of a tragic affair that left her heart scarred, Eleanor carries the weight of her past decisions like a shroud.",
    "motiveSeed": "Her investigative instincts lead her to the hotel, where whispers of dark secrets surrounding the wealthy guests beckon her like a moth to a flame.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was in the lobby during the murder, with several witnesses ready to vouch for her presence.",
    "accessPlausibility": "easy",
    "stakes": "For Eleanor, uncovering the truth is not just about a story; it’s a chance at personal redemption and a path to confront her past mistakes.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a fluidity that reflects her journalistic background, often punctuating her observations with sharp, witty remarks that reveal her keen intellect. She tends to articulate her thoughts in a manner that is both engaging and reflective, drawing listeners in with her narrative style.",
    "signatureTic": "“Every story has its shadows.”",
    "internalConflict": "Eleanor struggles with her guilt and the fear that her past indiscretions will resurface, potentially ruining her career and personal life.",
    "personalStakeInCase": "This crime represents a pivotal moment for Eleanor, as she seeks not only to uncover the truth but also to find closure for her own troubled history.",
    "paragraphs": [
      "Eleanor Voss stepped into the seaside hotel, the salty air mingling with the scent of fresh linens and unspoken secrets. Charismatic and outgoing, she had spent years traveling the world, capturing stories of societal changes through her insightful articles. Yet, beneath her polished exterior lay a tumultuous heart, one burdened by the guilt of a tragic affair that had ended in heartbreak. As she navigated the opulent corridors, she felt an undeniable pull toward the dark underbelly of the wealthy guests who frequented the hotel, each harboring their own secrets.",
      "Her motive was clear: she was drawn to the whispers of scandal that seemed to dance in the air, tantalizing her journalistic instincts. Eleanor was determined to uncover the truth behind the facade, to expose the hidden stories that lay buried beneath the surface. But the stakes were personal; this investigation could lead her to confront her past mistakes, offering her a chance at redemption. She needed to prove to herself that she could rise above her failures, that she could reclaim her narrative.",
      "In the lobby, Eleanor’s presence was magnetic, her laughter echoing like music. She engaged with the guests, charming them with her wit and warmth, while secretly observing their interactions. It was a game of chess, and she was determined to outmaneuver each player. Yet, as she delved deeper into the investigation, she couldn’t shake the feeling that her past was catching up with her, threatening to unravel the carefully woven fabric of her life.",
      "With every revelation, Eleanor's resolve grew stronger, but so did the shadows of her guilt. She often found herself reflecting on her choices, haunted by the specter of her affair and the consequences it had wrought. Could she truly find redemption in the chaos of this murder? As she pieced together the puzzle, Eleanor realized that the path to uncovering the truth was also a path to confronting her own demons, a reckoning that could either liberate her or ensnare her in the very darkness she sought to expose."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected psychiatrist hiding a dark secret, Dr. Mallory Finch finds herself entangled in a murder investigation that threatens to expose her unethical practices.",
    "publicPersona": "Dr. Finch is known for her compassionate approach to healing, particularly with veterans and trauma survivors, earning respect in her field.",
    "privateSecret": "Beneath her polished exterior, she conducts unethical experiments on her patients, a transgression that could ruin her career.",
    "motiveSeed": "After a drunken confession, the victim threatened to expose her dubious practices, pushing her to the edge.",
    "motiveStrength": "strong",
    "alibiWindow": "Dr. Finch claimed to be in her room during the murder, but witnesses saw her leaving shortly before the incident.",
    "accessPlausibility": "possible",
    "stakes": "Her career and reputation hang in the balance, with the potential for legal repercussions looming over her.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.3,
    "speechMannerisms": "Dr. Finch speaks with a measured cadence, often using clinical jargon that reflects her psychiatric training. Her dialogue is layered with subtle sarcasm, hinting at her inner turmoil, and she occasionally uses dry humor to deflect uncomfortable topics.",
    "signatureTic": "“It’s all in the mind, isn’t it?”",
    "internalConflict": "Dr. Finch grapples with the moral implications of her actions, fearing the consequences of her unethical practices while struggling to maintain her carefully constructed facade.",
    "personalStakeInCase": "The murder investigation represents a potential unraveling of her life; if her secrets come to light, it could destroy everything she has built.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the threshold of her hotel room, the door slightly ajar, as if inviting her into a world of chaos she could no longer ignore. A respected psychiatrist, she had spent years cultivating an image of compassion and understanding, particularly among veterans and trauma survivors. Yet, behind closed doors, her methods were anything but ethical. The weight of her secret sat heavily on her shoulders, a constant reminder of the thin line she walked between healing and harm.",
      "The victim's drunken confession had been a catalyst, a moment that shattered her carefully maintained facade. Threatened with exposure, Dr. Finch felt the walls closing in around her, pushing her to consider desperate measures. Her alibi—claiming she was in her room—was a flimsy shield against the truth that threatened to unravel her life. As she navigated the social labyrinth of the hotel, she found herself trapped between her professional obligations and the dark impulses gnawing at her conscience.",
      "In conversations, Dr. Finch's speech often reflected her clinical background, laced with a veneer of politeness that belied the savagery lurking beneath. She wielded her words like a scalpel, dissecting conversations with precision while carefully avoiding the topics that made her uncomfortable. “It’s all in the mind, isn’t it?” she would say, masking her inner turmoil with a disarming smile, a tactic she had honed to perfection.",
      "As the investigation unfolded, Dr. Finch felt the noose tightening around her neck. Each interaction with the other guests was a delicate dance, a balancing act between maintaining her composure and suppressing the fear that her secrets would be exposed. She was caught in a moral quagmire, grappling with the consequences of her past decisions while desperately seeking a way to salvage her career. But as the truth began to surface, she realized that the path to redemption would require more than just clever maneuvering—it would demand a reckoning with her own actions."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A charming retired naval officer, Captain Ivor Hale conceals the scars of war and a darker side, caught in a web of blackmail and suspicion.",
    "publicPersona": "Ivor is a captivating storyteller, regaling guests with tales of naval history and adventure, his charisma masking deeper struggles.",
    "privateSecret": "He battles PTSD from his service, a dark side that few are aware of, often leading him to confront his demons in solitude.",
    "motiveSeed": "The victim had been blackmailing him over a past incident from the war, threatening to expose his vulnerabilities.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor claims to have been on the beach during the murder, but no one can confirm his whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "Maintaining his reputation and mental stability is paramount, as the threat of exposure looms large.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks in a relaxed, almost theatrical manner, often punctuating his stories with self-deprecating humor that reveals his insecurities. His dialogue is rich with nautical metaphors, and he tends to drift into nostalgia, reminiscing about his past glories while hinting at his inner turmoil.",
    "signatureTic": "“A sailor never reveals his true course.”",
    "internalConflict": "Ivor grapples with the haunting memories of his service, fearing that revealing his past will lead to judgment and loss of the respect he has fought to regain.",
    "personalStakeInCase": "The murder investigation threatens to expose his vulnerabilities, forcing Ivor to confront the very demons he has tried to keep buried.",
    "paragraphs": [
      "Captain Ivor Hale stood at the edge of the beach, the waves crashing against the shore mirroring the tumult within him. Once a respected naval officer, he now found solace in the stories he spun for the hotel guests, charming them with tales of bravery and adventure. Yet, beneath the surface, he battled the scars of war—PTSD that clung to him like barnacles on a ship. Few knew of the darkness that lurked within, a side he kept well hidden behind a charismatic smile.",
      "The murder of Hugo Vane had sent shockwaves through the hotel, and Ivor felt the weight of his own secrets pressing down on him. The victim had been blackmailing him over a past incident during the war, a truth that could shatter the fragile reputation he had fought to rebuild. As he recounted his naval exploits, he often cloaked his self-doubt in self-deprecating humor, using it as a shield against the judgment he feared would come if his past were revealed. “A sailor never reveals his true course,” he would quip, but the truth was that he was lost at sea.",
      "In conversations, Ivor’s dialogue flowed like the tide, filled with nautical metaphors that painted vivid pictures of his adventures. He had a way of drawing people in, captivating them with his charm while masking the turmoil that raged beneath. Yet, as the investigation progressed, he felt the noose tightening around his neck. Each interaction with the other guests felt like a high-stakes game of poker, where revealing too much could expose him to the very judgment he dreaded.",
      "As the truth began to unfurl, Ivor found himself at a crossroads. Would he succumb to the darkness that threatened to engulf him, or could he confront his past and emerge stronger? The murder investigation had become more than a mere crime to solve; it was a reckoning that forced him to face the very demons he had long sought to bury. With every revelation, he felt the call of the sea, urging him to navigate these treacherous waters with courage and resolve."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A vibrant socialite with a penchant for drama, Beatrice Quill finds her glamorous world threatened by a scandal that could shatter her family's honor.",
    "publicPersona": "Beatrice is the life of the party, a fashionable heiress whose charisma draws attention and admiration wherever she goes.",
    "privateSecret": "In a secret relationship with a married man, Beatrice fears the impending exposure of her affair could ruin her future.",
    "motiveSeed": "The victim's discovery of her affair had put her in a precarious position, threatening to reveal her secret to her family.",
    "motiveStrength": "strong",
    "alibiWindow": "She claimed to be attending a party in another part of the hotel, but few can confirm her whereabouts.",
    "accessPlausibility": "easy",
    "stakes": "For Beatrice, her family's honor and her future marriage prospects hang in the balance, with the threat of scandal looming large.",
    "humourStyle": "observational",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with an animated flair, her words often punctuated by dramatic gestures and a theatrical tone. She has a penchant for storytelling, often embellishing her experiences to keep her audience engaged, and her humor is sharp, reflecting her keen observations of the world around her.",
    "signatureTic": "“Oh, darling, you simply must hear this!”",
    "internalConflict": "Beatrice wrestles with the tension between her desire for freedom and the expectations of her family, fearing that her choices could lead to disastrous consequences.",
    "personalStakeInCase": "The murder investigation is a threat to her carefully curated life, as exposure of her affair could unravel the very fabric of her existence.",
    "paragraphs": [
      "Beatrice Quill floated through the hotel like a breath of fresh air, her laughter ringing out like chimes in the breeze. A vibrant socialite, she was the center of attention, her fashion sense and charisma drawing admiration from all corners. Yet, beneath the glamorous façade lay a precarious secret: a relationship with a married man that threatened to unravel her carefully constructed world. The victim, Hugo Vane, had discovered her affair, and the looming threat of exposure sent shivers down her spine.",
      "As she mingled with the guests, Beatrice's observational humor came to the forefront, her sharp wit cutting through the pretense of her surroundings. “Oh, darling, you simply must hear this!” she would exclaim, launching into tales that captivated her audience while cleverly deflecting attention from her own troubles. But the stakes were high; her family's honor and her future marriage prospects hung in the balance, and she felt the weight of expectation pressing down on her like a heavy cloak.",
      "With every interaction, Beatrice danced on the edge of chaos, her words flowing like a stream of consciousness, often laced with dramatic flair. She had a knack for storytelling, embellishing her experiences to keep her audience engaged, even as her heart raced with anxiety. The murder investigation had become a stage, and she was determined to play her part without revealing the cracks in her carefully curated image.",
      "Yet, as the investigation unfolded, Beatrice found herself at a crossroads. Would she continue to hide behind the mask of the perfect socialite, or could she embrace the truth of her situation? The chaos surrounding the murder forced her to confront her own choices, challenging her to reevaluate her values and the cost of her desires. In the end, Beatrice knew that the path to true freedom lay not in deception but in the courage to face her reality head-on."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "An avant-garde fashion designer caught in a web of rivalry and deceit, Sylvia Trent struggles to maintain her career amidst the chaos of murder.",
    "publicPersona": "Sylvia is a charismatic figure in the fashion industry, known for her innovative designs and bold personality, making waves wherever she goes.",
    "privateSecret": "Struggling with debt, Sylvia has resorted to sabotaging her competitors, a decision that weighs heavily on her conscience.",
    "motiveSeed": "The victim, a rival designer, threatened to outshine her at an upcoming showcase, pushing her to the brink.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claimed to be in a fitting session with another model, but the timing of her alibi raises questions.",
    "accessPlausibility": "possible",
    "stakes": "For Sylvia, her career survival and financial security are at stake, with the threat of exposure looming over her.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a sharp, sardonic edge, often using irony to convey her thoughts. Her dialogue is punctuated with bursts of creativity, reflecting her artistic background, and she has a tendency to weave in fashion jargon, making her speech both colorful and pointed.",
    "signatureTic": "“Fashion is a cruel mistress.”",
    "internalConflict": "Sylvia battles with the ethical implications of her actions, torn between her ambition and the morality of her choices as she navigates the cutthroat fashion world.",
    "personalStakeInCase": "The murder investigation threatens not only her career but also her financial stability, pushing her to confront the lengths she has gone to in order to succeed.",
    "paragraphs": [
      "Sylvia Trent strode through the hotel like a whirlwind, her avant-garde style turning heads and sparking conversations. A charismatic figure in the fashion industry, she was known for her bold designs and innovative approach, yet beneath the surface lay a tumultuous struggle. With mounting debt threatening her career, Sylvia had resorted to sabotaging her competitors, a choice that weighed heavily on her conscience. The murder of Hugo Vane had thrown her world into disarray, and she felt the pressure mounting as the investigation unfolded.",
      "In conversations, Sylvia’s sardonic humor emerged as a defense mechanism, her words sharp and pointed. “Fashion is a cruel mistress,” she would quip, deflecting attention from her own insecurities while revealing her awareness of the cutthroat nature of her industry. Her dialogue was peppered with fashion jargon, a testament to her artistic background, and she often used irony to convey her thoughts, making her a captivating conversationalist even amidst the chaos.",
      "As the investigation progressed, Sylvia's alibi—a fitting session with another model—raised eyebrows. The timing was questionable, and she felt the walls closing in around her. Each interaction with the other guests was a reminder of the precariousness of her situation, forcing her to confront the ethical implications of her actions. Was her ambition worth the moral compromises she had made? As she navigated the treacherous waters of the investigation, she felt the weight of her choices bearing down on her, threatening to drown her in the very chaos she had tried to escape.",
      "With every revelation, Sylvia found herself at a crossroads. Would she continue to spiral deeper into unethical decisions, or could she find a path to redemption? The murder investigation had become a mirror, reflecting not only the darkness of the fashion world but also the shadows within her own soul. In the end, Sylvia realized that true success could only be achieved by embracing honesty, even if it meant facing the consequences of her past actions."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A self-made entrepreneur whose charm masked ruthless business practices, Hugo Vane's secrets come to light after his murder.",
    "publicPersona": "Hugo is a charismatic self-made man, known for his charm and business acumen, commanding respect in the social sphere.",
    "privateSecret": "His wealth is built on ruthless business practices and shady deals that he carefully conceals from the public eye.",
    "motiveSeed": "Threatened to sever ties with several guests due to their interference in his business, creating a web of enemies.",
    "motiveStrength": "strong",
    "alibiWindow": "Hugo was last seen in the bar before the murder, with no one to vouch for his whereabouts.",
    "accessPlausibility": "easy",
    "stakes": "For Hugo, preserving his empire and reputation was paramount, but his secrets ultimately led to his demise.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Hugo spoke with confidence, his words carefully chosen to project authority and command attention. His dialogue was often devoid of humor, reflecting the serious nature of his business dealings, and he had a tendency to maintain a formal tone, especially when discussing matters of importance.",
    "signatureTic": "“Business is war.”",
    "internalConflict": "N/A as he is the victim.",
    "personalStakeInCase": "N/A as he is the victim.",
    "paragraphs": [
      "Hugo Vane was the epitome of a self-made man, his charm and business acumen earning him respect and admiration in the social sphere. A successful entrepreneur, he had built an empire on the backs of ruthless business practices and shady deals, carefully concealing the darker side of his wealth from the public eye. But behind the confident facade lay a web of secrets, each thread woven tighter with every transaction, each lie compounding the risk he took in maintaining his empire.",
      "Last seen in the bar, Hugo had been the life of the party, his laughter echoing through the hotel as he mingled with guests. But beneath the surface, tensions simmered. He had threatened to sever ties with several influential guests, their interference in his business affairs creating a landscape fraught with enemies. As the investigation unfolded, it became clear that his charm had masked a dangerous game, one that ultimately led to his untimely demise.",
      "In his conversations, Hugo projected authority, his words carefully chosen to command attention and respect. He maintained a formal tone, especially when discussing matters of importance, revealing little of the man behind the mask. “Business is war,” he would declare, a mantra that reflected his ruthless approach to life. Yet, as the truth began to surface, it was evident that the very tactics that had propelled him to success had also sown the seeds of his downfall.",
      "As the investigation continued, Hugo's secrets began to unravel, exposing the darker aspects of his character. The stakes had been high, but the price of his ambition was ultimately paid in blood. Hugo Vane's life had been a carefully curated performance, one that ended in tragedy, leaving a trail of intrigue and suspicion in its wake. The question remained: who among his circle had the most to gain from his demise?"
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Grand Oceanview Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A luxurious seaside hotel with Art Deco flair, perched on a coastal bluff overlooking the turbulent sea.",
    "visualDescription": "Grand lobby adorned with polished marble, intricate glass chandeliers, and plush velvet furnishings. Ocean views framed by large bay windows, with the sound of crashing waves in the background. Art Deco motifs echo throughout the space, with geometric patterns and bold colors.",
    "atmosphere": "A blend of opulence and foreboding, reflecting the tension of a post-war society.",
    "paragraphs": [
      "The Grand Oceanview Hotel stands majestically on the edge of a craggy bluff, its Art Deco architecture a testament to the elegance of a bygone era. The lobby, a cavernous expanse of polished marble and rich wood, is suffused with the warm glow of glass chandeliers, casting dancing patterns on the walls. Outside, the sea roars against the rocky shore, a constant reminder of nature's raw power, while the fog creeps in, swirling around the hotel's foundations, cloaking secrets within its embrace.",
      "Guests bustle through the lobby, their laughter mingling with the distant strains of a radio broadcasting the latest news, the somber tones of post-war updates a stark contrast to the glamour of their surroundings. The scent of fresh flowers and polished wood mingles with the salty tang of the sea air, creating an intoxicating atmosphere that is both inviting and unsettling. Hidden corners and narrow corridors beckon with the promise of mystery, while the single winding road leading to the hotel remains shrouded in mist, isolating the establishment from the world beyond.",
      "As evening descends, the shadows lengthen, and the hotel transforms. The flickering candlelight casts a warm glow on the faces of guests gathered in the lounge, where an early television set crackles to life, displaying flickering images that capture their attention. Yet, beneath the surface of this seemingly idyllic retreat lies a tension that simmers just below, as whispered conversations hint at hidden agendas and unspoken fears, the air thick with anticipation of what the night might reveal."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "foggy with a slight chill, typical of coastal climates in the late afternoon",
    "timeFlow": "Three days of mounting tension leading to the revelation of a hidden truth",
    "mood": "tense and suspenseful, reflecting the uncertainty of the post-war era",
    "eraMarkers": [
      "radio broadcasts in the lounge",
      "early television set flickering",
      "Art Deco furnishings",
      "military-grade radar systems nearby",
      "rationed public transport affecting guest arrivals"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air mixed with floral fragrances",
      "secondary": [
        "warmth of candlelight",
        "sharpness of damp fog"
      ]
    },
    "paragraphs": [
      "The atmosphere of The Grand Oceanview Hotel is thick with the weight of history, the echoes of laughter and sorrow intertwining in the air. The salty tang of the sea blends with the fragrant blooms that adorn the lobby, creating a heady mix that both entices and unsettles. The murmur of voices fills the space, punctuated by the crackling of a radio announcing the day’s news, reminding patrons of the world beyond their luxurious refuge. Shadows dance across the walls as the fog rolls in, cloaking the hotel in a shroud of mystery and anticipation.",
      "As dusk falls, the ambiance shifts, the once vibrant energy of the day receding into an uneasy stillness. The flickering candle flames cast long shadows, illuminating the faces of guests who exchange wary glances. Outside, the crashing waves hint at secrets hidden beneath the surface, while the scent of damp earth mingles with the sweet aroma of aged wood and wax. The hotel, with its opulent furnishings and hidden corners, stands as a sanctuary of elegance amidst the chaos of a world still reeling from the war."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Seaside Terrace",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "An open terrace with wrought iron railings, overlooking the turbulent sea. Tables and chairs scattered haphazardly, one overturned.",
      "sensoryDetails": {
        "sights": [
          "overturned chair on wet tiles",
          "gray waves crashing below",
          "flickering lanterns in the mist",
          "dark clouds looming overhead",
          "distant lighthouse beam"
        ],
        "sounds": [
          "waves crashing against rocks",
          "distant seagulls screeching",
          "soft rustle of fog",
          "wind whistling through railings",
          "occasional creak of terrace wood"
        ],
        "smells": [
          "salty sea spray",
          "damp fog",
          "wet stone",
          "scent of night-blooming jasmine",
          "hint of burnt tobacco"
        ],
        "tactile": [
          "cold metal of the railing",
          "smoothness of wet tiles",
          "chill of evening air",
          "roughness of the overturned chair",
          "softness of fog against skin"
        ]
      },
      "accessControl": "Restricted to hotel guests after dark; staff access for cleaning in early morning hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "shimmering rain on terrace tiles",
            "mist obscuring the horizon",
            "puddles reflecting gray skies"
          ],
          "sounds": [
            "steady patter of rain",
            "water dripping from railings",
            "distant rumble of thunder"
          ],
          "smells": [
            "freshly washed air",
            "wet earth",
            "scent of soaked wood"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light on the horizon",
            "shadows creeping over the terrace",
            "dark clouds gathering"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "the creak of the terrace wood"
          ],
          "smells": [
            "seaweed and brine",
            "damp stone",
            "hint of mildew"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "stars beginning to twinkle",
            "shadowy outlines of distant cliffs",
            "soft glow of lanterns"
          ],
          "sounds": [
            "gentle lapping of waves",
            "whisper of the wind",
            "distant laughter from the hotel"
          ],
          "smells": [
            "fresh sea air",
            "scent of jasmine",
            "faint aroma of dinner being served"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Seaside Terrace is an open expanse that offers a breathtaking view of the tumultuous sea, now marred by the aftermath of a violent confrontation. Tables are scattered across the tiles, one overturned, a silent witness to the chaos that unfolded. The air is thick with the scent of salty spray mingling with jasmine, while the cold metal of the railings bites against the fingertips. The distant sound of crashing waves fills the air, a reminder of nature's indifference to human strife, while the fog rolls in, thickening the atmosphere with a sense of foreboding.",
        "As night descends, the terrace transforms. Flickering lanterns cast erratic shadows, illuminating the overturned chair that lies like a fallen sentinel. The sound of the wind whispers secrets of the past, while the chill of the evening air wraps around the scene like a shroud. Here, amidst the chaos, lies the evidence of a crime that will unravel the lives of those who sought refuge within the hotel’s grand walls."
      ]
    },
    {
      "id": "library",
      "name": "Library Lounge",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A cozy room lined with dark wood shelves filled with books. Large leather armchairs and a roaring fireplace create an inviting atmosphere.",
      "sensoryDetails": {
        "sights": [
          "glowing fireplace",
          "gold-framed portraits on the walls",
          "ornate rugs underfoot",
          "soft light from brass sconces"
        ],
        "sounds": [
          "crackling fire",
          "pages turning softly",
          "distant laughter from the lobby",
          "soft ticking of a clock",
          "whisper of fabric against leather"
        ],
        "smells": [
          "smoky wood from the fire",
          "old leather bindings",
          "dusty pages",
          "scent of polished wood",
          "hint of lavender from potpourri"
        ],
        "tactile": [
          "warmth of the fire on skin",
          "softness of velvet upholstery",
          "rough texture of old books",
          "coolness of marble fireplace surround",
          "smoothness of polished wood tables"
        ]
      },
      "accessControl": "Available to guests during the day; locked after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "glistening surfaces from moisture",
            "dim light filtering through clouds"
          ],
          "sounds": [
            "steady patter of rain against glass",
            "soft rustle of pages",
            "occasional crack of thunder"
          ],
          "smells": [
            "fresh scent of rain",
            "earthy aroma of wet soil",
            "hint of damp wood"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the room",
            "dust motes dancing in the light",
            "fading colors of the decor"
          ],
          "sounds": [
            "silence punctuated by distant voices",
            "soft ticking of the clock",
            "whisper of turning pages"
          ],
          "smells": [
            "scent of old paper",
            "freshly brewed tea",
            "subtle hint of sandalwood"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight casting flickering shadows",
            "glint of brass fittings",
            "deep colors of the room"
          ],
          "sounds": [
            "soft crackling of the fire",
            "murmurs of conversation",
            "distant clinking of glasses"
          ],
          "smells": [
            "warmth of the fire",
            "scent of leather",
            "faint aroma of cigar smoke"
          ],
          "mood": "comfortable tension"
        }
      ],
      "paragraphs": [
        "The Library Lounge is a sanctuary of knowledge and comfort, its walls lined with shelves of dusty tomes, each holding secrets of the past. The roaring fireplace commands attention, its crackling warmth inviting guests to sink into the oversized leather armchairs, where the scent of old leather and polished wood mingles with the smoky aroma of burning logs. Here, amidst the soft light from brass sconces, clues await discovery, hidden among the pages of forgotten books and the whispers of history.",
        "As guests gather, the atmosphere shifts, the sound of pages turning blending with the distant laughter from the lobby. The soft ticking of a clock marks the passage of time, while the flicker of firelight dances across the room, casting long shadows that hint at the mysteries yet to be uncovered. This is a place where stories intertwine, and the past resonates with the present, weaving a tapestry of intrigue that will draw the curious deeper into its embrace."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "An elegant dining room with large windows overlooking the sea. Tables are set with fine china and crystal glassware, reflecting the hotel's opulence.",
      "sensoryDetails": {
        "sights": [
          "gleaming cutlery on white tablecloths",
          "vibrant flowers in centerpieces",
          "large windows framing ocean views",
          "chandeliers sparkling overhead",
          "softly glowing candles"
        ],
        "sounds": [
          "clinking of glasses",
          "soft murmur of conversation",
          "distant sound of waves",
          "gentle music playing",
          "the rustle of napkins"
        ],
        "smells": [
          "aroma of roasted meat",
          "freshly baked bread",
          "scent of herbs and spices",
          "hint of citrus from desserts",
          "subtle smell of polished wood"
        ],
        "tactile": [
          "smoothness of fine china",
          "coolness of crystal glassware",
          "softness of linen napkins",
          "warmth from nearby heaters",
          "gentle pressure of a chair cushion"
        ]
      },
      "accessControl": "Open to guests for breakfast, lunch, and dinner; closed to non-guests after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops trickling down windows",
            "soft light filtering through clouds",
            "steam rising from hot dishes"
          ],
          "sounds": [
            "soft patter of rain",
            "clinking of dishes",
            "murmurs of breakfast conversation"
          ],
          "smells": [
            "aroma of brewing coffee",
            "freshly baked pastries",
            "scent of sizzling bacon"
          ],
          "mood": "cheerful"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows on tables",
            "cloudy views of the sea",
            "decorative plates on walls"
          ],
          "sounds": [
            "quiet conversation",
            "soft music in the background",
            "the rustle of menus"
          ],
          "smells": [
            "scent of fresh seafood",
            "hint of roasted vegetables",
            "aroma of rich sauces"
          ],
          "mood": "sombre"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering across the tables",
            "glimmer of glassware in the light",
            "twinkling stars visible through windows"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "soft music playing",
            "crackling of a fireplace"
          ],
          "smells": [
            "rich aroma of fine wine",
            "scent of grilled meats",
            "hint of baked goods"
          ],
          "mood": "festive"
        }
      ],
      "paragraphs": [
        "The Dining Room exudes elegance, with large windows framing breathtaking views of the ocean, where waves crash against the rocks below. Tables are meticulously set with gleaming cutlery and vibrant floral centerpieces, creating a feast for the eyes as well as the palate. The air is filled with the rich aroma of roasted meats and freshly baked bread, a tantalizing invitation to indulge in the culinary delights prepared by the hotel's renowned chefs. Amidst the soft sounds of laughter and the gentle clinking of glasses, guests gather to share stories and secrets.",
        "As evening descends, the atmosphere shifts, candlelight casting a warm glow over the room and illuminating the faces of diners. The soft strains of music accompany the murmurs of conversation, creating a sense of intimacy that belies the tension simmering just beneath the surface. Here, in this opulent space, the lines between celebration and suspicion blur, as guests navigate the complexities of their relationships amidst the backdrop of a world still healing from the scars of war."
      ]
    },
    {
      "id": "staff_only_kitchen",
      "name": "Staff-Only Kitchen",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A bustling kitchen filled with industrial appliances and busy staff. Large pots simmer on the stove, and the air is thick with the aroma of cooking.",
      "sensoryDetails": {
        "sights": [
          "steam rising from large pots",
          "chefs chopping vegetables",
          "gleaming stainless steel appliances",
          "colorful ingredients piled on counters",
          "hanging pots and pans"
        ],
        "sounds": [
          "sizzling on the stovetop",
          "clatter of utensils",
          "shouts of kitchen staff",
          "water running in the sink",
          "the thud of chopping boards"
        ],
        "smells": [
          "rich scent of simmering broth",
          "aroma of sautéed garlic",
          "fresh herbs and spices",
          "hint of burnt sugar",
          "scent of roasted vegetables"
        ],
        "tactile": [
          "heat radiating from the stove",
          "smoothness of polished countertops",
          "coolness of stainless steel",
          "roughness of vegetable peels",
          "softness of fresh herbs"
        ]
      },
      "accessControl": "Strictly staff-only; locked outside of meal preparation hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on windows",
            "steam fogging up glass",
            "busy staff preparing breakfast"
          ],
          "sounds": [
            "steady patter of rain",
            "clinking of dishes",
            "muffled conversations"
          ],
          "smells": [
            "scent of brewing coffee",
            "freshly baked pastries",
            "aroma of crisp bacon"
          ],
          "mood": "hectic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the kitchen",
            "dull light filtering through windows",
            "busy staff rushing about"
          ],
          "sounds": [
            "clattering of pots",
            "shouting of orders",
            "sizzling from the grill"
          ],
          "smells": [
            "aroma of frying fish",
            "hint of spices in the air",
            "scent of baking bread"
          ],
          "mood": "tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of overhead lights",
            "busy chefs plating dishes",
            "steam rising from food"
          ],
          "sounds": [
            "clinking of plates",
            "laughter among staff",
            "soft music playing"
          ],
          "smells": [
            "rich scent of roasted meats",
            "freshly made sauces",
            "scent of desserts baking"
          ],
          "mood": "busy anticipation"
        }
      ],
      "paragraphs": [
        "The Staff-Only Kitchen is a whirlwind of activity, filled with the clatter of utensils and the sizzling sounds of food being prepared. Large pots simmer on the stove, releasing rich aromas that mingle in the air, while chefs dart around, chopping, stirring, and plating. The gleaming stainless steel appliances reflect the hustle and bustle of the kitchen staff, who work diligently to ensure that each meal served in the dining room is a masterpiece. Here, amidst the chaos, lies the potential for secrets to be uncovered, as the scent of simmering broth and fresh herbs hints at culinary delights and hidden truths.",
        "As the day progresses, the atmosphere shifts, the kitchen becoming a cacophony of sounds and smells. The heat radiates from the stovetops, creating a tense environment where every detail matters. Shadows dance across the workspace as the staff work tirelessly, their whispered conversations punctuated by the thud of chopping boards and the hiss of frying pans. In this confined space, the line between camaraderie and competition blurs, and the potential for discovery lies just beneath the surface, waiting for the right moment to reveal itself."
      ]
    }
  ],
  "note": "",
  "cost": 0.0025851012,
  "durationMs": 28639
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1942,
    "month": "August",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "foggy with a slight chill",
      "cool breezes from the ocean",
      "overcast skies"
    ],
    "daylight": "Long summer days with brief twilight, sunlight fading by eight o'clock, giving way to a misty dusk.",
    "time_of_day_of_crime": "Late afternoon — between four and six o'clock when fog begins to roll in.",
    "holidays": [
      "Victory in Japan Day (August 15) celebrated informally with parades and local events"
    ],
    "seasonalActivities": [
      "beach outings with families",
      "picnics in coastal parks",
      "fishing trips on weekends"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suit jackets",
        "straw boater hats",
        "crisp white dress shirts"
      ],
      "casual": [
        "lightweight linen trousers",
        "seersucker blazers",
        "short-sleeved collared shirts"
      ],
      "accessories": [
        "pocket squares",
        "leather loafers",
        "classic wristwatches"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with floral patterns",
        "wide-brimmed hats",
        "pearl necklaces"
      ],
      "casual": [
        "breezy cotton blouses",
        "A-line skirts",
        "capri pants"
      ],
      "accessories": [
        "beaded handbags",
        "silk scarves",
        "strappy sandals"
      ]
    },
    "trendsOfTheMoment": [
      "bold floral prints",
      "lightweight fabrics for comfort",
      "utilitarian influences in everyday wear"
    ],
    "socialExpectations": [
      "maintaining proper decorum in public",
      "women's increased roles in wartime jobs",
      "formality in social gatherings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Battle of Stalingrad intensifies",
      "Allied forces prepare for Operation Torch",
      "War rationing continues affecting daily life"
    ],
    "politicalClimate": "Tensions are high as the war persists, with governments focused on military strategies and civilian morale.",
    "economicConditions": "Rationing is common, with shortages affecting everything from food to clothing; black markets begin to emerge.",
    "socialIssues": [
      "gender roles shifting as women take on jobs traditionally held by men",
      "racial tensions simmering in urban areas",
      "sacrifices made by families on the home front"
    ],
    "internationalNews": [
      "U.S. forces land in North Africa",
      "Japanese expansion in the Pacific continues",
      "Europe grapples with resource shortages"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - 'White Christmas'",
        "Glenn Miller - 'In the Mood'",
        "Ella Fitzgerald - 'Into Each Life Some Rain Must Fall'"
      ],
      "films": [
        "Casablanca",
        "Mrs. Miniver",
        "The Pied Piper"
      ],
      "theater": [
        "Oklahoma!",
        "The Glass Menagerie"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "Suspense"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Fountainhead by Ayn Rand",
        "The Maltese Falcon by Dashiell Hammett",
        "The Catcher in the Rye (unpublished but generating buzz)"
      ],
      "popularGenres": [
        "detective fiction",
        "war stories",
        "romantic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "radar technology advances",
        "early computers in military applications",
        "automatic telephone exchanges"
      ],
      "commonDevices": [
        "bicycles for transportation",
        "radio sets in homes",
        "early television sets in public lounges"
      ],
      "emergingTrends": [
        "increased reliance on radio for news",
        "use of propaganda in media",
        "adoption of wartime technologies in civilian life"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Carton of milk: six pence",
        "A pound of sugar: two shillings"
      ],
      "commonActivities": [
        "gathering for community events",
        "listening to radio broadcasts",
        "participating in local wartime fundraisers"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "community dances",
        "monthly meetings at local clubs"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Increased camaraderie among classes due to shared wartime efforts",
      "Pride in working-class contributions to the war"
    ],
    "gender": [
      "Women stepping into roles once reserved for men",
      "Growing acceptance of women in the workforce, yet traditional expectations remain"
    ],
    "race": [
      "Limited opportunities for racial minorities",
      "Racial tension in urban settings due to competition for jobs and housing"
    ],
    "generalNorms": [
      "Patriotism is highly valued",
      "Support for the war effort is a social obligation",
      "Conformity and community support are encouraged"
    ]
  },
  "atmosphericDetails": [
    "The salty mist hangs in the air as the fog rolls in, muffling sounds and cloaking the surroundings in an eerie calm.",
    "The distant sound of waves crashing against the shore mingles with the hushed conversations of hotel guests, each one casting wary glances at their neighbors.",
    "Flickering shadows from gas lamps illuminate the fog, creating a tense atmosphere where secrets feel palpable, and every creak of the floorboards sends a jolt of anxiety through the air."
  ],
  "paragraphs": [
    "On a foggy August afternoon in 1942, the coastal hotel stands half-obscured, its grandeur softened by the shadows of the encroaching mist. The chill in the air speaks of the ocean’s reach, a reminder of the summer’s fleeting warmth. Families gather for picnics in nearby parks, their laughter mingling with the sound of crashing waves, while the world outside grapples with the echoes of war. The local community prepares for informal celebrations of Victory in Japan Day, reflecting a fragile sense of hope amidst ongoing struggles.",
    "Fashion in this summer of 1942 reflects the evolving social fabric. Men don double-breasted suits paired with straw boater hats, while women elegantly navigate the streets in tea-length dresses adorned with vibrant floral patterns. The burgeoning presence of women in the workforce is mirrored in their choice of comfortable yet stylish capri pants and breezy blouses, blending practicality with the era's aesthetic. Accessories such as pearl necklaces and pocket squares add a touch of sophistication, even as the weight of war hangs heavy over daily lives.",
    "Daily life is punctuated by the realities of rationing and communal gatherings. A loaf of bread costs four pence, and families adapt to shortages with creativity, often gathering around radios to listen to the latest news updates or the latest episode of 'The Shadow.' Social norms emphasize patriotism and a shared commitment to the war effort, with community dances and Sunday family dinners serving as vital rituals that foster connections among neighbors. As the fog thickens outside, the hotel becomes a microcosm of the broader societal shifts, where every whispered conversation hints at the tensions of a nation on the brink of change."
  ],
  "note": "",
  "cost": 0.0010589634,
  "durationMs": 12189
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a luxurious hotel for a charity gala becomes a pressure cooker of tension as post-war anxieties and shifting social roles intertwine the lives of guests and staff, leading to deadly consequences.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has disrupted traditional class roles, with women entering the workforce and societal expectations shifting, creating a charged atmosphere where personal ambitions clash with public scrutiny."
  },
  "setting": {
    "location": "A luxurious seaside hotel with Art Deco architectural elements overlooking the ocean.",
    "institution": "hotel",
    "weather": "foggy with a slight chill, typical of coastal climates in the late afternoon."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a delayed-action poison method, where the toxicology and dosage timing conceal when the fatal dose was actually administered."
}

### LOCKED_FACTS
[
  {
    "id": "bottle_label",
    "value": "a quarter ounce",
    "description": "The quantity of the rare botanical extract in the empty bottle."
  },
  {
    "id": "scent_duration",
    "value": "twenty minutes",
    "description": "The duration for which the peculiar floral scent remained on the victim's clothing."
  },
  {
    "id": "collapse_time",
    "value": "ten minutes past eleven",
    "description": "The time of the victim's collapse, which leads to the confusion of the timing of the poisoning."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 23,
  "countsByPlacement": {
    "early": 7,
    "mid": 15,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 21,
    "supporting": 1,
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
      "category": "testimonial"
    },
    {
      "id": "clue_core_elimination_chain",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "supporting",
      "category": "testimonial"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_fp_elimination_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_elimination_beatrice_quill",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_elimination_sylvia_trent",
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
      "category": "spatial"
    },
    {
      "id": "clue_id_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_2",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_4",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
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

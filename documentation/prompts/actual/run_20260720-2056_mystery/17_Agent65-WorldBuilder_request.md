# Actual Prompt Record

- Run ID: `mystery-1784580961906`
- Project ID: ``
- Timestamp: `2026-07-20T21:00:21.383Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `6c5621d6995f9c86`

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
    "title": "A Delayed Demise",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "delayed-action poisoning"
    }
  },
  "death_method": "poisoned with a rare botanical toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [
        "friend of the victim"
      ],
      "public_persona": "charming socialite",
      "private_secret": "conceals a financial dispute with the victim",
      "motive_seed": "jealousy",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "dining area",
        "shared social events"
      ],
      "behavioral_tells": [
        "nervous laughter",
        "frequent glances at the victim"
      ],
      "stakes": "reputation and social standing",
      "evidence_sensitivity": [
        "financial records",
        "guest book"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [
        "former colleague of the victim"
      ],
      "public_persona": "reputable doctor",
      "private_secret": "resentment over the victim's success",
      "motive_seed": "professional rivalry",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 9:15 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "medical supplies",
        "kitchen access"
      ],
      "behavioral_tells": [
        "frequent fidgeting",
        "avoidance of eye contact"
      ],
      "stakes": "career reputation",
      "evidence_sensitivity": [
        "medical records",
        "supply logs"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "suspect",
      "relationships": [
        "acquaintance of the victim"
      ],
      "public_persona": "retired naval officer",
      "private_secret": "involved in illicit activities",
      "motive_seed": "concealment of past actions",
      "motive_strength": "low",
      "alibi_window": "8:30 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "lobby",
        "dining area"
      ],
      "behavioral_tells": [
        "excessive bravado",
        "flashes of anger"
      ],
      "stakes": "personal integrity",
      "evidence_sensitivity": [
        "naval records",
        "guest interactions"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [
        "friend of the victim"
      ],
      "public_persona": "up-and-coming artist",
      "private_secret": "financial dependency on the victim",
      "motive_seed": "financial pressure",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "shared studio",
        "dining area"
      ],
      "behavioral_tells": [
        "overly friendly demeanor",
        "frequent checking of her watch"
      ],
      "stakes": "financial stability",
      "evidence_sensitivity": [
        "bank statements",
        "artistic contracts"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "victim",
      "relationships": [
        "friend to all suspects"
      ],
      "public_persona": "beloved social figure",
      "private_secret": "secretly dating someone's husband",
      "motive_seed": "romantic entanglement",
      "motive_strength": "high",
      "alibi_window": "evening",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "friend of the victim"
      ],
      "public_persona": "inquisitive investigator",
      "private_secret": "holds a personal grudge against one suspect",
      "motive_seed": "personal bias",
      "motive_strength": "low",
      "alibi_window": "evening",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
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
      "summary": "During a charity gala at a seaside hotel, Sylvia Trent collapses and dies after enjoying a specially prepared meal. As friends and acquaintances gather to grieve, Detective Hugo Vane uncovers a web of jealousy, rivalry, and hidden motives. The investigation reveals that the seemingly innocent meal harbored a deadly secret, and the truth behind Sylvia's demise is more sinister than anyone could have imagined."
    },
    "accepted_facts": [
      "Sylvia was found dead after dinner.",
      "She had a history of health issues but seemed well at the event."
    ],
    "inferred_conclusions": [
      "The death was not due to natural causes.",
      "Someone had a motive to harm Sylvia."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on poison, contain, and lemon to expose the false timing.",
      "delivery_path": [
        {
          "step": "The poison was infused into the sauce of the meal."
        },
        {
          "step": "Sylvia drank lemon-infused water with the meal."
        },
        {
          "step": "The reaction between the poison and the lemon caused a delayed fatal reaction."
        }
      ]
    },
    "outcome": {
      "result": "Sylvia's death is attributed to the combination of the poison and the acidic drink, causing a lethal reaction."
    }
  },
  "false_assumption": {
    "statement": "Sylvia died due to her existing health issues.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses noted her previous health struggles, leading to assumptions about the cause of death.",
    "what_it_hides": "The true cause was the poison that was undetectable on its own."
  },
  "false_solution": {
    "accused_suspect": "Eleanor Voss",
    "supporting_points": [
      "Witnesses noted her frequent arguments with Sylvia over financial matters.",
      "She was seen leaving the dining area shortly after the meal was served."
    ],
    "the_one_flaw": "Eleanor's alibi is corroborated by multiple witnesses who saw her in the lobby during the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken perfume bottle was found near the victim's body.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The perfume bottle was knocked over by a guest and had no relation to the murder.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Captain Hale's unusual behavior during the investigation.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was agitated due to his own past traumas from the war, not related to Sylvia's death.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill"
    ],
    "rationale": "All suspects were present at the hotel during the gala and had the opportunity to poison Sylvia."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "8:00 PM",
        "9:30 PM"
      ],
      "windows": [
        "5:00 PM to 9:30 PM"
      ],
      "contradictions": [
        "Witnesses reported seeing Sylvia looking healthy just before dinner.",
        "Dr. Finch's medical records show no recent illness that would cause her death."
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
        "dining area",
        "kitchen",
        "medical supplies"
      ],
      "permissions": [
        "dining access",
        "kitchen access"
      ]
    },
    "physical": {
      "laws": [
        "Poison absorption rates vary with food combinations."
      ],
      "traces": [
        "Footprints leading from the kitchen to the dining area."
      ]
    },
    "social": {
      "trust_channels": [
        "Friendship networks among guests."
      ],
      "authority_sources": [
        "Dr. Mallory Finch as a trusted figure."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The menu from the gala lists a dish containing both a rare poison and a lemon sauce.",
        "correction": "This indicates the potential for a toxic reaction if consumed together.",
        "effect": "Narrows the investigation to the dish served to Sylvia.",
        "required_evidence": [
          "The menu showing the dish.",
          "Witness statements recalling the meal served."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report Sylvia expressing delight over the dish just before her death.",
        "correction": "This suggests she consumed it willingly, unaware of the danger.",
        "effect": "Eliminates the idea that she was coerced into eating.",
        "required_evidence": [
          "Witness accounts of Sylvia's reaction to the meal.",
          "Server's report on the meal served."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory Finch had access to both the kitchen and medical supplies.",
        "correction": "This indicates she could have acquired the poison and administered it without detection.",
        "effect": "Narrows culpability to Dr. Mallory Finch.",
        "required_evidence": [
          "Access logs showing Dr. Finch's movements.",
          "Kitchen inventory revealing the poison's presence."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares reaction, contain, and poison against the claimed timeline.",
    "knowledge_revealed": "The same toxic reaction occurs when the dish is paired with lemon, confirming the poison's nature.",
    "pass_condition": "If any guest shows symptoms similar to Sylvia's, it implicates the dish as the murder weapon.",
    "evidence_clues": [
      "clue_1",
      "clue_6",
      "clue_mechanism_visibility_core",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The menu (early) and witness statements (mid) reveal the toxic dish. Step 2: Sylvia's delight (mid) clarifies she was unaware of the danger, eliminating coercion. Step 3: Dr. Finch's access (early) leads to her as the prime suspect."
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
        "Observe the reactions of the guests",
        "Draw conclusions about the dish's role in the murder"
      ],
      "test_type": "controlled dinner reenactment"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Corroborated alibi with multiple witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His behavior was linked to past traumas, not the murder.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 8:00 PM to 9:30 PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of the poison."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation of the menu."
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements about Sylvia's delight."
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
        "delivery_method": "Direct observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
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
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Access logs from the kitchen."
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, an art gallery owner, presents a façade of sophistication while grappling with deep-seated financial turmoil. Her desperation to maintain her family's reputation could drive her to drastic measures.",
    "publicPersona": "Eleanor is the epitome of grace and sophistication, a luminary in the art community who commands respect with her discerning eye for quality and her impressive collection. She navigates social circles with a charm that draws people to her, her laughter ringing like a bell at charity events and gallery openings.",
    "privateSecret": "Beneath her polished exterior lies a woman suffocated by crippling debt from a disastrous art investment. Eleanor relies heavily on her family's wealth to keep up appearances, living in constant fear that the truth of her financial ruin will surface.",
    "motiveSeed": "The victim, Sylvia, posed a significant threat to Eleanor's carefully curated life, threatening to expose a family secret that could unravel everything she has worked to maintain. The stakes are high, and Eleanor's desperation to secure her family's fortune is palpable.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was seen at a charity event from eight until ten, surrounded by influential patrons, a perfect cover for her dubious intentions.",
    "accessPlausibility": "possible",
    "stakes": "Should her family's reputation crumble, Eleanor would face not only financial ruin but also the end of her carefully crafted social standing.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a smooth, polished cadence, often punctuating her sentences with a slight laugh. She has a habit of using art jargon, which can make her sound pretentious, but her charm usually softens the blow.",
    "signatureTic": "Ah, the beauty of art is in its imperfections.",
    "internalConflict": "Eleanor grapples with guilt over her family's legacy and fears that their secrets will not only ruin her but also tarnish the memory of those who came before her.",
    "personalStakeInCase": "This crime matters to Eleanor because it threatens the very foundation of her family's reputation and the legacy she has tried so hard to uphold.",
    "paragraphs": [
      "The air was thick with the scent of expensive perfume and the soft murmur of cultured conversation as Eleanor Voss navigated through the charity event. Her smile, a calculated blend of warmth and aloofness, masked the storm brewing beneath her poised exterior. A glance at her reflection in a nearby window revealed a woman on the brink, her carefully crafted life teetering on the edge of revelation.",
      "Eleanor's thoughts wandered back to Sylvia Trent, the woman whose relentless pursuit of truth threatened to expose her family's deepest secrets. What right did Sylvia have to unearth the skeletons in her closet? Each day brought fresh reminders of the precariousness of Eleanor's situation, forcing her to cling to the illusion of control as her financial woes loomed ever larger.",
      "As she mingled with the guests, Eleanor's laughter rang out, a melodic sound that belied her internal turmoil. She had perfected the art of conversation, weaving tales of art and culture with a deft hand. Yet, as she caught sight of Sylvia across the room, a flicker of resentment ignited within her. Why should this woman, with her unrefined ideals, challenge the world Eleanor had painstakingly built?",
      "In the hours that followed, Eleanor found herself grappling with a choice. Would she protect her family's reputation at all costs, even if it meant silencing Sylvia? The thought sent a chill down her spine, but as the night wore on, the line between right and wrong blurred further. Perhaps it was time to confront the truth, to shed the layers of secrecy and face the consequences head-on."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a dedicated physician, finds herself entangled in a web of past betrayals and present threats, as her romantic history with the victim resurfaces with deadly implications.",
    "publicPersona": "Mallory is revered in her community as a selfless healer, tirelessly devoted to her patients. Her gentle demeanor and unwavering commitment have earned her respect, making her a beloved figure at the local hospital.",
    "privateSecret": "Beneath her selfless exterior lies a turbulent past marked by a romantic relationship with Sylvia that ended in betrayal. The emotional scars from their affair linger, complicating her feelings towards the victim.",
    "motiveSeed": "Sylvia's intention to disclose their affair threatens Mallory's career and reputation, leaving her feeling cornered and resentful.",
    "motiveStrength": "moderate",
    "alibiWindow": "Mallory was in surgery from six until eight, a plausible cover for her whereabouts during the crucial hours.",
    "accessPlausibility": "easy",
    "stakes": "The potential fallout from Sylvia's revelations could devastate Mallory's career, undermining the trust she has built with her patients and colleagues.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with a calm, measured tone, often punctuating her observations with dry humor. She has a tendency to use medical jargon, which can make her sound clinical even in casual conversation.",
    "signatureTic": "Well, that's just a matter of perspective, isn't it?",
    "internalConflict": "Mallory is torn between her past feelings for Sylvia and the need to protect her career. She feels a profound sense of betrayal that clouds her judgment and complicates her emotions.",
    "personalStakeInCase": "This crime matters to Mallory because it threatens not only her career but also forces her to confront the unresolved feelings she harbors for Sylvia.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the sterile confines of the operating room, her hands steady as she navigated the complexities of surgery. The precision of her movements contrasted sharply with the chaos swirling in her mind. Thoughts of Sylvia Trent invaded her focus, unearthing memories she had buried deep beneath layers of professional obligation.",
      "As the scalpel glided through flesh, Mallory couldn't help but recall the moments of passion and betrayal that had defined her relationship with Sylvia. What had once been a source of joy had devolved into a tangled mess of resentment, and now, the specter of their past threatened to unravel her carefully constructed life.",
      "With each stitch, she fought to maintain her composure, the weight of her emotions pressing heavily on her shoulders. The prospect of Sylvia threatening to expose their affair filled her with dread, igniting a simmering anger that she struggled to suppress. How dare Sylvia jeopardize everything Mallory had worked for? The thought was infuriating, yet it also revealed the depth of her unresolved feelings.",
      "As the surgery concluded, Mallory's heart raced at the thought of what lay ahead. Would she be forced to confront Sylvia once more, to face the ghosts of their past? The stakes were higher than ever, and for the first time, she wondered if it was time to let go of the bitterness and seek closure, rather than revenge."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, grapples with guilt and the fear of exposure regarding his past wartime actions, as the victim's knowledge threatens to shatter his carefully maintained reputation.",
    "publicPersona": "Ivor is a charismatic figure, known for his leadership and captivating war stories that charm guests at the seaside hotel. His authoritative presence commands respect, drawing people into his orbit.",
    "privateSecret": "Haunted by guilt over a wartime incident that connects him to the victim's family, Ivor lives in fear of being exposed for actions that could tarnish his honor.",
    "motiveSeed": "He believes Sylvia possesses documents that could reveal his past misdeeds, threatening to destroy the reputation he has built since retirement.",
    "motiveStrength": "compelling",
    "alibiWindow": "Ivor was on the phone with an old naval friend from seven to eight, a plausible cover for his whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "His reputation and honor are at stake, and the threat of exposure from Sylvia looms large, forcing him to confront the shadows of his past.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a commanding tone, often punctuating his stories with dramatic pauses. He has a tendency to use nautical metaphors, adding flair to his storytelling.",
    "signatureTic": "In the heat of battle, one must always steer true.",
    "internalConflict": "Ivor is torn between his desire to protect his reputation and the guilt that gnaws at him, stemming from his wartime actions. He struggles with the moral implications of his past and its potential to destroy his present.",
    "personalStakeInCase": "This crime matters to Ivor because it threatens to expose the truth about his past, forcing him to confront his guilt and the possibility of redemption.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, a glass of whiskey in hand, his gaze distant as he recalled the battles of his youth. The stories he shared with guests were laced with bravado, yet beneath the surface, a tempest of guilt churned. The weight of his past actions threatened to surface, and with it, the truth that could unravel everything he had built since retiring from the navy.",
      "When news of Sylvia Trent's investigation reached his ears, Ivor's heart sank. She was a determined woman, and her pursuit of truth could lead her to the documents that would expose his darkest secrets. Each day that passed felt like a countdown, the tension mounting as he wrestled with the prospect of being unmasked.",
      "As he engaged in conversation with fellow guests, Ivor's charm shone brightly, masking the turmoil within. He was a master storyteller, weaving tales of valor and heroism, but every laugh and cheer felt like a hollow echo against the backdrop of his guilt. The very fabric of his reputation hung by a thread, and he knew that the slightest misstep could unravel it all.",
      "In the quiet moments, however, Ivor found himself confronting the ghosts of his past. The weight of his actions bore down on him, and he wondered if redemption was even possible. Would he be able to confront Sylvia and the truth she threatened to expose? Or would he be forced to continue living in the shadows, weighed down by the secrets he could no longer keep?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a young waitress with dreams beyond her current circumstances, finds herself envious of the victim's lifestyle, which leads to a dangerous path of resentment and frustration.",
    "publicPersona": "Beatrice is a beacon of brightness at the seaside hotel, beloved by guests for her friendly demeanor and attentive service. Her optimism shines through, making her a favorite among patrons.",
    "privateSecret": "Beneath her cheerful exterior lies a simmering frustration, as Beatrice feels trapped in her circumstances and harbors envy for Sylvia's glamorous lifestyle.",
    "motiveSeed": "She resented Sylvia for flaunting wealth and privilege, believing that her own family ties should have afforded her the same opportunities.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice was working in the dining area from seven to nine, a solid alibi that shields her from suspicion.",
    "accessPlausibility": "easy",
    "stakes": "Beatrice longs for a better life and feels a growing frustration over her unfulfilled dreams, pushing her towards darker thoughts.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a lively, animated tone, often punctuated by bursts of enthusiasm. She has a habit of flirting with sarcasm, especially when discussing her aspirations or the absurdities of her job.",
    "signatureTic": "Ain't life just a grand performance?",
    "internalConflict": "Beatrice grapples with feelings of inadequacy and envy, torn between her aspirations and the reality of her circumstances. She struggles to find her own identity in the shadow of others.",
    "personalStakeInCase": "This crime matters to Beatrice because it forces her to confront her own frustrations and aspirations, challenging her to rise above her circumstances.",
    "paragraphs": [
      "Beatrice Quill glided through the dining area, her smile brightening the faces of the guests she served. As she poured coffee and delivered plates, she couldn't help but dream of a life beyond the confines of her waitress uniform. The seaside hotel was a stage, and she was merely playing a role, longing for the day when she could step into the spotlight as the star of her own story.",
      "Yet, as she watched Sylvia Trent flaunt her wealth and privilege, a flicker of resentment ignited within Beatrice. 'Ain't life just a grand performance?' she often mused, her laughter tinged with bitterness. She felt trapped in a life that seemed predetermined, while Sylvia danced through life with an ease that eluded her. The disparity gnawed at her insides, feeding her envy and frustration.",
      "In the quiet moments, Beatrice would often stare out at the ocean, imagining a life where she could break free from her circumstances. Each wave crashing against the shore echoed her own frustrations, a reminder of the opportunities she believed were stolen from her. The allure of Sylvia's lifestyle only deepened her resolve to seek a better life, even if it meant crossing dangerous lines.",
      "As the evening wore on, Beatrice found herself wrestling with her emotions. Would she allow her envy to spiral into something darker? Or could she channel her frustrations into a pursuit of her own ambitions? The choice loomed before her, and with it, the possibility of redefining her own narrative."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a compassionate social worker, becomes the victim of a deadly plot, her investigation into Eleanor's affairs threatening to expose dark truths that many would prefer to keep hidden.",
    "publicPersona": "Sylvia is known for her unwavering commitment to social justice, advocating for the vulnerable in her community. Her compassion and reliability have made her a respected figure among peers.",
    "privateSecret": "Unbeknownst to many, Sylvia has been investigating Eleanor's art dealings, suspecting fraudulent practices that could harm countless individuals.",
    "motiveSeed": "Her commitment to uncovering the truth regarding Eleanor's dealings puts her at odds with powerful interests.",
    "motiveStrength": "moderate",
    "alibiWindow": "Sylvia's whereabouts during the evening remain uncertain, adding an air of mystery to her demise.",
    "accessPlausibility": "possible",
    "stakes": "Her reputation and the integrity of her work are at stake, with the potential fallout from her investigation threatening to ruin her legacy.",
    "characterArcPotential": "Sylvia's journey could reveal hidden strengths as she navigates the treacherous waters of deceit and betrayal.",
    "paragraphs": [
      "Sylvia Trent stood at the intersection of compassion and justice, her heart full of resolve as she dedicated herself to helping those in need. As a social worker, she was a lifeline for many, tirelessly advocating for the vulnerable in her community. Yet, beneath her altruistic exterior lay a fierce determination to uncover truths that others wished to keep buried.",
      "Her investigation into Eleanor Voss's art dealings had sparked a fire within her, igniting a passion for justice that threatened to consume her. The whispers of fraud echoed in her ears, and Sylvia knew she had to confront the truth, no matter the cost. She was prepared to expose the deception, even if it meant risking her own safety.",
      "Yet, as the days passed, Sylvia felt the weight of her pursuit bearing down on her. The shadows of powerful interests loomed large, and she began to sense that her investigation was not merely a matter of uncovering fraud, but a fight for her very survival. The stakes were higher than she had anticipated, and the danger was palpable.",
      "In the end, Sylvia's commitment to truth would cost her dearly. As she navigated the treacherous waters of deceit, she remained resolute in her mission, unaware of the deadly consequences that awaited her. Her legacy, once defined by compassion, would now be intricately woven with the threads of betrayal and sacrifice."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a witty author and detective, faces the challenge of unraveling the truth behind Sylvia's death, while grappling with his own motivations and fears mirrored in the tragedy.",
    "publicPersona": "Hugo is a celebrated author known for his sharp insights and clever wit. His popularity among readers is matched only by his keen observational skills, making him a formidable presence.",
    "privateSecret": "Hugo has a knack for spinning tales that reflect tragic realities, and the unfolding mystery of Sylvia's death intrigues him on a personal level.",
    "motiveSeed": "His fascination with the darker aspects of human nature fuels his desire to uncover the truth, as he seeks to understand the motives behind the crime.",
    "motiveStrength": "moderate",
    "alibiWindow": "Hugo was working in his room during the evening, a plausible cover for his whereabouts as he delved into his writing.",
    "accessPlausibility": "possible",
    "stakes": "The implications of Sylvia's death could tarnish his reputation as an author, intertwining his literary career with the grim reality of murder.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo's speech is marked by a quick wit, often laced with irony. He has a tendency to make sharp observations about the human condition, using humor as a shield against the darkness he explores.",
    "signatureTic": "Ah, but the plot thickens, doesn't it?",
    "internalConflict": "Hugo wrestles with the morality of his fascination with tragedy, questioning whether his pursuit of truth is a genuine quest for understanding or merely a means to fuel his creative endeavors.",
    "personalStakeInCase": "This crime matters to Hugo because it challenges his perception of reality, forcing him to confront the consequences of his own narratives and the shadows that lurk within.",
    "paragraphs": [
      "Hugo Vane leaned back in his chair, the dim light of his room casting shadows on the pages of his latest manuscript. As an author, he had always been drawn to the darker aspects of human nature, but nothing could have prepared him for the real-life tragedy that had unfolded with Sylvia Trent's untimely death. The lines between fiction and reality blurred as he delved deeper into the mystery, each new detail igniting his curiosity.",
      "As he pondered the implications of her death, Hugo couldn't help but reflect on the irony of his own fascination with tragedy. Had he been too consumed by his own narratives to recognize the weight of real suffering? The question gnawed at him, intertwining with his desire to uncover the truth. 'Ah, but the plot thickens, doesn't it?' he mused, a sardonic smile creeping across his face as he considered the unfolding drama.",
      "In the quiet solitude of his room, Hugo found himself grappling with the morality of his obsession. Was he merely a voyeur, a writer seeking inspiration from the pain of others? Or was there a deeper purpose to his pursuit? Each revelation about Sylvia's life and death peeled back layers of his own motivations, forcing him to confront the shadows that lingered just beyond the light of his words.",
      "As he ventured into the heart of the investigation, Hugo knew that the stakes were high. The truth behind Sylvia's death could shatter not only the lives of those involved but also his own carefully curated identity as an author. The journey ahead would demand more than mere observation; it would require him to confront the darkness within himself and the world around him."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Oceanic Retreat",
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "An Art Deco seaside hotel overlooking the stormy English Channel, where secrets linger in the salty air.",
    "visualDescription": "The hotel boasts a grand lobby with polished marble floors, intricate geometric patterns on the walls, and sweeping views of the turbulent sea through expansive windows. The dining area features elegant chandeliers and plush velvet seating, creating an inviting yet somber atmosphere.",
    "atmosphere": "A blend of nostalgia and tension, underscored by the weight of recent wartime memories.",
    "paragraphs": [
      "The Oceanic Retreat stands resolute against the salty winds, its Art Deco façade a testament to a bygone era of elegance. As waves crash against the pebbled shore, the hotel reflects the turmoil of the world outside, with guests seeking solace in its luxurious embrace. The lobby buzzes softly with muted conversations, while the scent of damp sea air mingles with the lingering aroma of tobacco and coffee.",
      "Inside, the grand staircase spirals upwards, leading to ocean-view rooms adorned with vintage furnishings and delicate lace curtains. The sound of the distant sea accompanies the occasional clink of silverware from the dining area, where patrons gaze out at the tumultuous waters. Despite the beauty, an undercurrent of unease permeates the air, as whispers of the past echo in the corners of the hotel.",
      "Each room holds a story, a fragment of lives intertwined in this coastal refuge. The staff moves discreetly, their presence a reminder of the secrets that lurk behind closed doors. As the storm brews outside, the hotel becomes a microcosm of society, with its guests grappling with the weight of their choices amidst the shadows of war."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical for coastal regions in early spring.",
    "timeFlow": "Three days of mounting tension as secrets unravel.",
    "mood": "Tense due to recent wartime events and social changes, with an underlying current of nostalgia.",
    "eraMarkers": [
      "Ubiquitous radios crackling with news bulletins",
      "Early television sets in the lounge area",
      "Rationed public transport schedules posted in the lobby"
    ],
    "sensoryPalette": {
      "dominant": "Salty sea air and polished wood",
      "secondary": [
        "Muted conversations and the distant roar of waves",
        "A hint of tobacco smoke and coffee"
      ]
    },
    "paragraphs": [
      "The Oceanic Retreat breathes with the rhythm of the sea, its walls echoing the stories of weary travelers seeking refuge. The air is thick with tension, a palpable reminder of the world outside, where the echoes of war still resonate. As the clouds gather overhead, the hotel stands as a sentinel, guarding its secrets beneath layers of history and nostalgia.",
      "Guests drift through the lobby, their faces a tapestry of emotions—hope, fear, and longing. The atmosphere is charged, as if the very walls are privy to whispered confessions and shared glances. The scent of dampness hangs in the air, mingling with the rich aroma of the evening meal, creating an intimate yet uneasy ambiance that invites both connection and suspicion."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests and staff",
      "visualDetails": "Expansive with high ceilings, adorned with geometric patterns and plush seating. A large bay window overlooks the turbulent sea.",
      "sensoryDetails": {
        "sights": [
          "polished marble floors",
          "intricate Art Deco patterns",
          "glistening chandeliers",
          "ocean waves crashing outside",
          "staff uniforms in muted colors"
        ],
        "sounds": [
          "soft murmurs of conversation",
          "distant clinking of glasses",
          "the crash of waves",
          "footsteps on marble",
          "the rustle of newspapers"
        ],
        "smells": [
          "freshly brewed coffee",
          "tobacco smoke",
          "salty sea air",
          "polished wood and varnish",
          "damp wool"
        ],
        "tactile": [
          "cool marble underfoot",
          "soft velvet upholstery",
          "smooth brass fixtures",
          "chill from the open window",
          "worn leather armrests"
        ]
      },
      "accessControl": "Guests and staff have access; security monitors entry to staff-only areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light across marble floors"
          ],
          "sounds": [
            "steady drumming on the roof",
            "water trickling in the gutters"
          ],
          "smells": [
            "damp earth",
            "mildew",
            "coffee grounds"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light",
            "shadows creeping across the room"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the creak of old timbers"
          ],
          "smells": [
            "beeswax polish",
            "dust",
            "old leather"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "long shadows across the floor"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "laughter from the dining area"
          ],
          "smells": [
            "candle wax",
            "freshly baked bread",
            "sea salt"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the heart of The Oceanic Retreat, a gathering place where guests exchange stories and secrets over coffee. High ceilings and grand chandeliers create an atmosphere of elegance, while the smell of tobacco smoke and the sound of distant waves remind everyone of the world outside. It is here that tension simmers just beneath the surface, as whispered conversations hint at the darker truths hidden within the hotel’s walls.",
        "As the sun rises, the ambiance shifts. Rain-streaked windows distort the view of the tumultuous sea, creating a sense of isolation. The once-bustling lobby now feels oppressive, with the weight of unspoken words hanging heavily in the air. Guests shuffle about, their eyes darting nervously, as if sensing that something is amiss within this seemingly idyllic retreat."
      ]
    },
    {
      "id": "dining_area",
      "name": "Dining Area",
      "type": "interior",
      "purpose": "Clue discovery and social interaction",
      "visualDetails": "Elegant setting with ocean views, plush seating, and polished tables set for dinner.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on white tablecloths",
          "ocean waves visible through large windows",
          "hanging crystal chandeliers",
          "artfully arranged floral centerpieces",
          "guests in formal attire"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft music from a radio",
          "laughter and conversation",
          "the rustle of menus",
          "the hum of the sea"
        ],
        "smells": [
          "grilled fish and roasted vegetables",
          "fresh bread and herbs",
          "candle wax",
          "sea breeze",
          "damp fabric"
        ],
        "tactile": [
          "smooth table surfaces",
          "soft velvet chairs",
          "cool glass of water",
          "warm bread rolls",
          "the chill of ocean air"
        ]
      },
      "accessControl": "Open to guests during meal times; staff only during off-hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "wet tables reflecting light"
          ],
          "sounds": [
            "rain pattering against windows",
            "soft music playing on the radio"
          ],
          "smells": [
            "freshly baked pastries",
            "coffee brewing",
            "sea salt"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "empty tables waiting for guests"
          ],
          "sounds": [
            "distant thunder",
            "soft whispers of staff preparing"
          ],
          "smells": [
            "cooked meats",
            "simmering sauces",
            "burnt toast"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering softly",
            "guests toasting with glasses raised"
          ],
          "sounds": [
            "laughter spilling over",
            "the clinking of glasses"
          ],
          "smells": [
            "smoky wood from the kitchen",
            "baked desserts",
            "fresh flowers"
          ],
          "mood": "celebratory tension"
        }
      ],
      "paragraphs": [
        "The Dining Area exudes elegance, with its polished tables set for the evening meal, glimmering under the soft glow of chandeliers. Guests gather here not only to dine but to engage in hushed conversations, their voices barely rising above the gentle hum of the sea outside. The scent of grilled fish mingles with the salty air, creating an inviting atmosphere, yet an unshakable tension lingers, as if each meal holds the potential for revelation or ruin.",
        "As the storm approaches, the mood shifts. The once-vibrant laughter becomes strained, replaced by cautious glances exchanged between diners. Rain taps against the windows, creating a rhythmic backdrop to the unease that permeates the space. Conversations grow quieter, secrets hang heavily in the air, and the food tastes of something more than just the ingredients on the plate—it is flavored with suspicion and fear."
      ]
    },
    {
      "id": "ocean_view_rooms",
      "name": "Ocean View Rooms",
      "type": "interior",
      "purpose": "Crime scene and private retreats",
      "visualDetails": "Rooms with large windows facing the sea, adorned with vintage furnishings and soft textiles.",
      "sensoryDetails": {
        "sights": [
          "waves crashing against the shore",
          "heavy curtains drawn tight",
          "decorative seashells on the dresser",
          "old photographs in frames",
          "faded wallpaper"
        ],
        "sounds": [
          "the roar of the sea",
          "distant thunder",
          "whispers of the wind",
          "creaking floorboards",
          "the rustle of curtains"
        ],
        "smells": [
          "salt and brine from the sea",
          "old wood and dust",
          "fresh linens",
          "faint perfume",
          "mildew in damp corners"
        ],
        "tactile": [
          "soft bedding underfoot",
          "cool glass of the window",
          "roughness of the wallpaper",
          "smoothness of the seashells",
          "the chill of ocean drafts"
        ]
      },
      "accessControl": "Accessible to guests with room keys; staff may enter for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds pressing against glass",
            "dripping condensation on window panes"
          ],
          "sounds": [
            "rain hitting the roof",
            "the low rumble of thunder"
          ],
          "smells": [
            "damp fabric",
            "mildew",
            "freshly laundered sheets"
          ],
          "mood": "claustrophobic isolation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through curtains",
            "shadows pooling in corners"
          ],
          "sounds": [
            "the wind howling outside",
            "the occasional creak of the building"
          ],
          "smells": [
            "faint perfume",
            "old wood",
            "the tang of sea salt"
          ],
          "mood": "suspenseful stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden light",
            "long shadows across the floor"
          ],
          "sounds": [
            "waves crashing rhythmically",
            "distant laughter from the dining area"
          ],
          "smells": [
            "freshly brewed tea",
            "the scent of ocean air",
            "candle wax"
          ],
          "mood": "introspective calm"
        }
      ],
      "paragraphs": [
        "The Ocean View Rooms offer a deceptive sense of tranquility, with their large windows framing the tumultuous sea. Vintage furnishings provide a glimpse into the past, while the salty air seeps in, infusing the atmosphere with both romance and melancholy. Here, guests retreat to ponder their choices, yet the weight of unspoken secrets looms large, as if the very walls are listening.",
        "In the dim afternoon light, the rooms take on a more sinister air. Shadows deepen, and the sound of the waves becomes a haunting reminder of the turmoil outside. As rain begins to fall, the sense of isolation intensifies, and the room transforms into a sanctuary for secrets, each piece of furniture a potential witness to the unfolding drama."
      ]
    },
    {
      "id": "staff_area",
      "name": "Staff Area",
      "type": "interior",
      "purpose": "Restricted access for staff operations",
      "visualDetails": "A narrow hallway leading to the kitchen and storage rooms, cluttered with supplies and equipment.",
      "sensoryDetails": {
        "sights": [
          "dimly lit corridor",
          "stacked crates and supplies",
          "faded staff schedules on the wall",
          "old photographs of past staff",
          "rusty kitchen equipment"
        ],
        "sounds": [
          "footsteps echoing on tile",
          "the hum of refrigerators",
          "clattering of pots and pans",
          "soft murmurs of staff",
          "the creak of old doors"
        ],
        "smells": [
          "cooking oil and spices",
          "old wood and mildew",
          "cleaning supplies",
          "freshly baked bread",
          "the scent of fish"
        ],
        "tactile": [
          "cool tile floor",
          "rough wooden crates",
          "smooth metal utensils",
          "dampness in the air",
          "the chill from the walk-in fridge"
        ]
      },
      "accessControl": "Staff only; security monitors access to ensure privacy and order.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water pooling in the hallway",
            "staff hurrying with supplies"
          ],
          "sounds": [
            "rain tapping on the roof",
            "muffled conversations from the kitchen"
          ],
          "smells": [
            "wet floors",
            "the sharp tang of cleaning supplies",
            "freshly baked pastries"
          ],
          "mood": "hasty urgency"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping down the hallway",
            "flickering fluorescent lights"
          ],
          "sounds": [
            "the clatter of dishes",
            "the hissing of steam",
            "staff whispering"
          ],
          "smells": [
            "cooked meats",
            "simmering sauces",
            "the scent of dampness"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm light spilling from the kitchen",
            "staff preparing for dinner service"
          ],
          "sounds": [
            "the sizzle of frying",
            "laughter from the kitchen",
            "the clinking of glasses"
          ],
          "smells": [
            "herbs and spices",
            "fresh bread",
            "the scent of the sea"
          ],
          "mood": "busy camaraderie"
        }
      ],
      "paragraphs": [
        "The Staff Area is a bustling hub of activity, a narrow corridor filled with the scents of cooking and the sounds of clattering dishes. Here, the staff move with purpose, navigating the clutter of supplies and equipment as they prepare for the day’s service. The air is thick with the promise of meals to come, but beneath the surface, a sense of urgency prevails, as if everyone is aware that something is about to change.",
        "As the day wears on, the atmosphere shifts. Shadows deepen in the dimly lit hallway, and the sounds of laughter from the dining area contrast with the tension building within the staff. The clatter of pots and pans becomes a rhythmic reminder of the secrets that linger just out of sight, and the weight of unspoken truths presses heavily on the shoulders of those who work behind the scenes."
      ]
    }
  ],
  "note": "",
  "cost": 0.0022795607999999998,
  "durationMs": 29146
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "April",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "overcast skies with intermittent rain showers",
      "cool breezes from the coast",
      "occasional bursts of sunshine breaking through clouds"
    ],
    "daylight": "Days are growing longer, with daylight extending until around 7:30 PM.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel guests settle in for the night.",
    "holidays": [
      "Easter Sunday: April 14, 1940"
    ],
    "seasonalActivities": [
      "Spring cleaning in households and hotels",
      "Local flower shows featuring blooming daffodils and tulips",
      "Weekend picnics in parks as the weather begins to warm"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suits in navy or gray wool",
        "white dress shirts with stiff collars",
        "fedoras or snap-brim hats"
      ],
      "casual": [
        "tweed jackets with elbow patches",
        "lightweight chinos or slacks",
        "knit ties in bold patterns"
      ],
      "accessories": [
        "silk pocket squares",
        "leather gloves",
        "silver cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with cinched waists and full skirts",
        "blouses with puffed sleeves paired with tailored skirts",
        "tailored suits in pastel colors for evening events"
      ],
      "casual": [
        "comfortable cardigans over floral blouses",
        "ankle-length skirts with matching belts",
        "simple cotton dresses for day wear"
      ],
      "accessories": [
        "berets or cloche hats",
        "string pearls",
        "leather handbags"
      ]
    },
    "trendsOfTheMoment": [
      "Navy and military-inspired styles as symbols of patriotism",
      "Utilitarian fashion reflecting wartime resourcefulness",
      "Influence of Hollywood glamour on everyday attire"
    ],
    "socialExpectations": [
      "Men are expected to dress formally for evening events",
      "Women are encouraged to wear practical yet stylish clothing",
      "Social gatherings often require adherence to traditional etiquette"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Germany invades Denmark and Norway as part of its expansion strategy",
      "The Blitz begins to loom over Britain as air raids increase",
      "Debates within the British cabinet regarding military strategy and the future of the war"
    ],
    "politicalClimate": "Tension is high as Europe is engulfed in conflict, and Britain faces the threat of invasion.",
    "economicConditions": "Rationing is beginning to take hold in Britain, affecting food and clothing supplies.",
    "socialIssues": [
      "Women increasingly stepping into roles traditionally held by men due to wartime labor shortages",
      "Growing awareness and activism regarding civil rights for marginalized groups",
      "Strain on community resources as the population adjusts to wartime life"
    ],
    "internationalNews": [
      "Reports of the Dunkirk evacuation operations beginning to circulate",
      "Increased naval patrols in the English Channel to counter German U-boats",
      "News of the fall of France beginning to spread, causing alarm among British citizens"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's 'In the Mood'",
        "Bing Crosby's 'I'll Be Seeing You'",
        "The Andrews Sisters' 'Boogie Woogie Bugle Boy'"
      ],
      "films": [
        "The Great Dictator (released in 1940)",
        "The Grapes of Wrath (released in 1940)",
        "Penny Serenade (released in 1941)"
      ],
      "theater": [
        "The original Broadway production of 'Pal Joey'",
        "Revival of 'The Royal Family'",
        "Shows featuring wartime themes gaining popularity"
      ],
      "radio": [
        "The Jack Benny Program",
        "Fibber McGee and Molly",
        "The Shadow"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Grapes of Wrath by John Steinbeck",
        "The Maltese Falcon by Dashiell Hammett",
        "For Whom the Bell Tolls by Ernest Hemingway"
      ],
      "popularGenres": [
        "Detective fiction and mystery novels",
        "Political thrillers reflecting current events",
        "Romantic fiction with strong female protagonists"
      ]
    },
    "technology": {
      "recentInventions": [
        "Radar technology for detecting enemy aircraft",
        "Advances in radio communication for military use",
        "Development of early models of the television set"
      ],
      "commonDevices": [
        "Radios in homes and public places for news broadcasts",
        "Typewriters for business and personal use",
        "Basic cameras for personal photography"
      ],
      "emergingTrends": [
        "Increased use of propaganda in media",
        "Growth of wartime inventions leading to post-war consumer products",
        "Development of synthetic materials due to resource shortages"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pint of milk: three pence",
        "Cinema ticket: one shilling"
      ],
      "commonActivities": [
        "Gathering for radio broadcasts of news updates",
        "Participating in community fundraisers for war efforts",
        "Attending local flower shows and exhibitions"
      ],
      "socialRituals": [
        "Afternoon tea as a social custom among women",
        "Weekly church services bringing communities together"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Upper classes are expected to maintain their status despite the war",
      "Working-class solidarity is growing due to shared struggles"
    ],
    "gender": [
      "Increased acceptance of women in the workforce, yet traditional roles remain prevalent",
      "Growing recognition of the capabilities of women in various professions"
    ],
    "race": [
      "Racial tensions are simmering as the war exposes inequalities",
      "Increased visibility of diverse communities contributing to the war effort"
    ],
    "generalNorms": [
      "Patriotism is widely celebrated, with many supporting the war effort",
      "Social gatherings are often steeped in etiquette and formality"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain-soaked earth mingles with fresh blooms as spring continues to unfold.",
    "Laughter and the clinking of glasses echo from the hotel bar, yet a tension lurks in the air.",
    "The low hum of radios broadcasting news updates punctuates conversations, reminding everyone of the turmoil beyond the coastal town."
  ],
  "paragraphs": [
    "In April 1940, the coastal town where the hotel stands is cloaked in the uncertain atmosphere of early spring. The weather is fickle, with overcast skies that occasionally yield to rain, mirroring the mood of its inhabitants. With Easter just passed, the remnants of celebration linger, yet a palpable tension pervades conversations as news of Germany's advances in Europe reaches distant shores. The daylight stretches longer into the evening, inviting guests to gather in the hotel’s lounge, where the sound of laughter is occasionally interrupted by the crackle of radios broadcasting the latest developments in the war.",
    "Fashion is a reflection of the era’s duality; men in double-breasted suits with crisp white shirts and women in tea-length dresses exude a sense of style despite the looming threat of conflict. The colors are often muted, favoring navy and gray, while accessories such as silk pocket squares and cloche hats offer a hint of glamour amidst the utilitarian backdrop. The influence of Hollywood is evident, as patrons dress for the occasion, embodying an unspoken hope that life will return to normalcy even as they navigate the uncertainties of wartime.",
    "Daily life is marked by a series of small rituals; afternoon tea remains a cherished tradition, fostering connections among women who gather to discuss rations and community efforts. The price of a loaf of bread is four pence, a reminder of the rationing that has begun to grip the nation. As the evening unfolds and shadows lengthen, guests at the hotel find solace in each other's company while grappling with the realities of their world. The air is thick with nostalgia for a peaceful past, yet the thrill of the unknown beckons, setting the stage for a mystery that will unfold against this richly textured backdrop."
  ],
  "note": "",
  "cost": 0.0012443210999999999,
  "durationMs": 14157
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a seaside hotel for a charity event draws together a diverse cast, each grappling with the societal shifts of post-war life and the personal stakes of their intertwined pasts.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The class dynamics reflect the upheaval of WWII, with women stepping into roles traditionally held by men, while the threat of the Cold War looms, creating a tense atmosphere of suspicion and change."
  },
  "setting": {
    "location": "A seaside hotel with Art Deco influences",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain, typical for coastal regions in early spring."
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
    "id": "menu_item",
    "value": "the special crab dish",
    "description": "The victim consumed this specific dish shortly before death."
  },
  {
    "id": "poison_weight",
    "value": "two ounces",
    "description": "The exact amount of poison used in the dish."
  },
  {
    "id": "time_of_death",
    "value": "ten minutes past nine",
    "description": "The time at which the victim was declared dead."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 18,
  "countsByPlacement": {
    "early": 8,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
      "criticality": "essential",
      "category": "behavioral"
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
      "category": "behavioral"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_5",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_6",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
      "category": "temporal"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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

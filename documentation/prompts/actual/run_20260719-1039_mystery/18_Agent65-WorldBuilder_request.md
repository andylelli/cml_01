# Actual Prompt Record

- Run ID: `mystery-1784457594600`
- Project ID: ``
- Timestamp: `2026-07-19T10:43:42.630Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `27d2d224c97949e9`

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
    "title": "The Deceptive Hour",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Brighton",
      "place": "Seaside Hotel",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical deception"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp-minded investigator",
      "private_secret": "None",
      "motive_seed": "Professional curiosity",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Solving the case to earn respect",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Expert",
      "relationships": [],
      "public_persona": "Respected doctor",
      "private_secret": "Has a gambling debt",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical supplies"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation and finances",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Military Man",
      "relationships": [],
      "public_persona": "A decorated war hero",
      "private_secret": "Struggling with PTSD",
      "motive_seed": "Jealousy over a past relationship",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Military connections"
      ],
      "behavioral_tells": [],
      "stakes": "Honor and reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Socialite",
      "relationships": [],
      "public_persona": "Charming and sociable",
      "private_secret": "Has a hidden rivalry with the victim",
      "motive_seed": "Desire for social status",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Well-liked guest",
      "private_secret": "Involved in a controversial affair",
      "motive_seed": "None",
      "motive_strength": "none",
      "alibi_window": "none",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Survival",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Businessman",
      "relationships": [],
      "public_persona": "A wealthy entrepreneur",
      "private_secret": "Involved in shady dealings",
      "motive_seed": "Financial gain from the victim's demise",
      "motive_strength": "high",
      "alibi_window": "8:15 PM to 8:45 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Business transactions"
      ],
      "behavioral_tells": [],
      "stakes": "Financial survival",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Hugo Vane"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In the grand seaside hotel, the murder of Sylvia Trent unfolds under the guise of a tampered clock, revealing a complex web of suspicion among the hotel guests."
    },
    "accepted_facts": [
      "Sylvia Trent was found dead in her room.",
      "The clock in the room showed ten minutes past eight.",
      "Guests reported hearing a struggle around that time."
    ],
    "inferred_conclusions": [
      "The time of death is earlier than reported due to the clock tampering.",
      "The murderer likely has knowledge of mechanical devices."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was rewound to misrepresent the time of death.",
      "delivery_path": [
        {
          "step": "The murderer rewound the clock after committing the crime."
        }
      ]
    },
    "outcome": {
      "result": "The incorrect time misleads the investigation."
    }
  },
  "false_assumption": {
    "statement": "Sylvia Trent was murdered shortly before dinner, as indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock showed a plausible time, and witnesses reported hearing a commotion around that time.",
    "what_it_hides": "The actual time of death was later, allowing the murderer to create an alibi."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses claim to have seen Hale near the victim's room at the time of death.",
      "Hale had a motive due to jealousy over Sylvia's affairs."
    ],
    "the_one_flaw": "Hale had a confirmed alibi from the hotel staff that he was in the lounge during the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses reported seeing Captain Hale near the victim's room at the time of death.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "Hale was actually helping another guest in distress nearby.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A letter found in Sylvia's room suggests she was meeting someone.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The letter was actually a draft for a business deal unrelated to the murder.",
      "resolved_in_chapter": 4
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Hugo Vane"
    ],
    "rationale": "All guests were present at the hotel during the murder, and no outsiders were involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner is scheduled for 8:30 PM.",
        "Clock in Sylvia's room shows 8:10 PM."
      ],
      "windows": [
        "Murder must occur between 8:10 PM and 8:30 PM."
      ],
      "contradictions": [
        "Witnesses heard a struggle after 8:30 PM."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Hugo Vane"
      ],
      "objects": [
        "The clock",
        "Sylvia's room"
      ],
      "permissions": [
        "All guests had access to the dining hall and guest rooms."
      ]
    },
    "physical": {
      "laws": [
        "The clock's mechanism can be rewound manually."
      ],
      "traces": [
        "Fingerprints on the clock casing."
      ]
    },
    "social": {
      "trust_channels": [
        "Guest relationships",
        "Hotel staff credibility"
      ],
      "authority_sources": [
        "Hotel management"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in Sylvia's room shows the time as ten minutes past eight.",
        "correction": "The time shown by the clock is not the actual time of death.",
        "effect": "Narrows the murder timeline.",
        "required_evidence": [
          "The clock's hands were slightly askew.",
          "Guests reported hearing a struggle around 8:45 PM."
        ],
        "reader_observable": true
      },
      {
        "observation": "The hotel staff noted that the clock chimed incorrectly at nine o'clock.",
        "correction": "The clock was tampered with after the murder.",
        "effect": "Eliminates the possibility of the time being accurate.",
        "required_evidence": [
          "Hotel staff testimony about the clock's chime.",
          "The clock's casing shows signs of tampering."
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint scratch on the clock's casing suggests mechanical interference.",
        "correction": "The clock was rewound to create a false timeline.",
        "effect": "Narrows the suspect pool to those with mechanical knowledge.",
        "required_evidence": [
          "The clock's casing has scratch marks.",
          "Witness statements about the struggle time."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the clock's tampering evidence with the alibis of the suspects reveals that only Hugo Vane had the mechanical knowledge to rewind the clock.",
    "knowledge_revealed": "The revealed facts are clock, tamper, and minut.",
    "pass_condition": "If Hugo Vane's alibi fails against the tampering evidence, he is proven guilty.",
    "evidence_clues": [
      "clue_3",
      "clue_6",
      "clue_4"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's time (early) and witness testimony (mid) reveal the timeline discrepancy. Step 2: The clock's chime (mid) eliminates the accuracy of the time. Step 3: The clock's tampering evidence (discriminating test) identifies Hugo Vane as the culprit."
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
        "clearance_method": "Medical records confirm she was in the dining hall during the murder.",
        "supporting_clues": [
          "evidence_3",
          "evidence_4"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm he was entertaining guests in the lounge.",
        "supporting_clues": [
          "evidence_5",
          "evidence_6"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Testimony confirms she was seen outside the hotel during the murder.",
        "supporting_clues": [
          "evidence_7",
          "evidence_8"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence revealing Hugo Vane's guilt."
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
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_hugo_vane",
        "act_number": 1,
        "scene_number": 3,
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
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_12",
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
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
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
    "summary": "Eleanor Voss is a local businesswoman and amateur sleuth, navigating the murky waters of family loyalty and betrayal after her father's death.",
    "publicPersona": "Respected owner of a local boutique, known for her keen sense of style and community involvement.",
    "privateSecret": "Harbors resentment towards her late father's will, which favored her brother over her.",
    "motiveSeed": "Her father's death left her financially stable, but she suspects her brother might manipulate the inheritance.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the hotel lobby at the time of the murder",
    "accessPlausibility": "easy",
    "stakes": "Losing her family's legacy and respect in the community.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured tone, often punctuating her observations with wry humor. She tends to weave in fashion metaphors, reflecting her business background.",
    "signatureTic": "‘Style is all about the details, isn't it?’",
    "internalConflict": "Eleanor grapples with feelings of inadequacy stemming from her father's favoritism, driving her to question her worth and the authenticity of her relationships.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as it threatens not only her family's legacy but also her newfound financial security, compelling her to stand up and fight for her rightful place.",
    "paragraphs": [
      "Eleanor Voss stands behind the counter of her boutique, a sanctuary of silk and lace, where the scent of lavender wafts through the air. Her keen sense of style has made her a beloved figure in Brighton, yet beneath her poised exterior lies a simmering resentment towards the late patriarch of her family. The will that left her brother the lion's share of their father's estate gnaws at her, not merely for the money, but for the recognition she feels she deserves. 'Style is all about the details, isn't it?' she often muses, a phrase that hints at her meticulous nature, yet also serves as a mask for her deeper frustrations.",
      "In the aftermath of her father's death, Eleanor finds herself in a precarious position. Financially stable but emotionally adrift, she fears that her brother, Hugo, might twist the inheritance to his advantage. Her suspicions lead her to investigate the circumstances surrounding not just her father's passing, but also the sudden death of Sylvia Trent, the journalist who threatened to expose the family's secrets. Eleanor's alibi, being in the hotel lobby during the murder, gives her a sense of security, yet she knows that her proximity to the crime scene could lead to unwelcome scrutiny.",
      "As an amateur sleuth, Eleanor approaches her investigation with a blend of determination and an acute sense of style, often employing her keen observational skills to piece together the puzzle. However, her internal conflict looms large over her, as memories of her father's dismissive demeanor resurface, casting shadows on her confidence. Each conversation with her brother feels like a tightrope walk, balancing familial loyalty against her growing need for justice. She finds herself questioning whether her brother is truly the man she thought he was, or merely a reflection of their father's failings.",
      "With each revelation, Eleanor inches closer to the truth, yet the weight of her family's legacy feels heavier. The stakes have never been higher; not only does she risk losing her family's respect, but she also stands to lose the very identity she has crafted for herself. As the investigation unfolds, Eleanor must confront the past, not just to protect her future but to redefine what it means to be a Voss in a community that once revered her. Will she emerge from the shadows of her father's will, or will she be consumed by the very secrets she seeks to unveil?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a compassionate physician entangled in a web of unrequited love and conflicting loyalties, as her past affections complicate the investigation.",
    "publicPersona": "A compassionate physician known for her dedication to her patients.",
    "privateSecret": "Has been secretly in love with Eleanor's brother, which complicates her loyalties.",
    "motiveSeed": "Desires to protect the brother from the victim's manipulations regarding the will.",
    "motiveStrength": "weak",
    "alibiWindow": "was tending to a patient in another room during the murder",
    "accessPlausibility": "possible",
    "stakes": "Her career and reputation in the community are at stake if her affair is exposed.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Mallory speaks with a soothing cadence, often punctuating her words with gentle laughter. Her sentences tend to trail off as she navigates her feelings, revealing her inner turmoil.",
    "signatureTic": "‘I suppose I should be more careful with my heart.’",
    "internalConflict": "Mallory struggles with the guilt of her feelings for Eleanor's brother, torn between her desire for love and her loyalty to the Voss family.",
    "personalStakeInCase": "This crime matters to Mallory as it threatens to expose her hidden affections and could shatter her professional reputation, compelling her to protect her heart at all costs.",
    "paragraphs": [
      "Dr. Mallory Finch is the kind of physician who lends a warm smile to her patients, her compassion evident in every interaction. Yet, beneath her nurturing exterior lies a heart burdened by unrequited love for Eleanor's brother. The secret has nestled itself in the corners of her mind, a constant companion that both comforts and torments her. 'I suppose I should be more careful with my heart,' she often muses, a phrase that echoes her internal struggle. Her dedication to her patients is admirable, but the stakes of her personal life are equally high, as she grapples with the implications of her feelings.",
      "When Sylvia Trent, the investigative journalist, is found dead, Mallory's alibi of tending to a patient feels flimsy; the shadows of her affection cast doubt on her innocence. While she was physically absent from the scene, the emotional turmoil surrounding her complicates her loyalties. Mallory's desire to protect Eleanor's brother from the victim's manipulations regarding the will fuels her need to uncover the truth, but she is acutely aware of how fragile her position is. The community respects her as a physician, but her hidden romance could unravel her carefully constructed life.",
      "In the quiet moments between patients, Mallory reflects on her conflicted heart. She recalls the nights spent in the company of Eleanor's brother, the laughter shared over glasses of wine, and the unspoken words that hung in the air. As the investigation unfolds, she finds herself torn between her duty as a physician and her desire to shield the man she loves from scandal. Each twist in the case brings her closer to the precipice of exposure, threatening not only her career but also the fragile bond she shares with him.",
      "As the truth begins to unravel, Mallory must confront her feelings and decide where her loyalties truly lie. Will she stand by the man she loves, even if it means risking everything she has worked for, or will she prioritize her professional reputation over her heart? The investigation becomes a crucible for her character, forcing her to navigate the perilous waters of love and loyalty while seeking redemption in a world fraught with deception."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a decorated war hero grappling with the ghosts of his past, as the threat of exposure looms over him amidst a murder investigation.",
    "publicPersona": "A decorated war hero, respected but distant, with an impeccable reputation.",
    "privateSecret": "Struggles with PTSD and guilt over wartime decisions, seeking solace in the victim's trust.",
    "motiveSeed": "Fears the victim will expose his mental health struggles to the public.",
    "motiveStrength": "moderate",
    "alibiWindow": "was on the terrace talking to a guest during the murder",
    "accessPlausibility": "easy",
    "stakes": "His reputation and a potential book deal based on his service.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks in a clipped, authoritative manner, often punctuating his statements with a subtle gravitas. He has a tendency to avoid emotional topics, redirecting conversations toward his military experiences.",
    "signatureTic": "‘War is hell, and it doesn’t end when you come home.’",
    "internalConflict": "Ivor is haunted by guilt over decisions made during his service, struggling to reconcile his public persona with the fragility of his mental health.",
    "personalStakeInCase": "This crime matters to Ivor as it threatens to expose his mental health struggles and tarnish the legacy he fought to build, pushing him toward a reckoning with his past.",
    "paragraphs": [
      "Captain Ivor Hale stands as a pillar of strength in the community, a man shaped by the rigors of war and the accolades that followed. His public persona as a decorated war hero commands respect, yet beneath the surface lies a tumultuous sea of guilt and regret. 'War is hell, and it doesn’t end when you come home,' he often states bluntly, a phrase that reveals the weight he carries. The shadows of his past decisions loom large, and the fear of being exposed for his mental health struggles sends him into a spiral of anxiety as he navigates the investigation surrounding Sylvia Trent's murder.",
      "Ivor's alibi, speaking on the terrace with a guest, provides him a semblance of safety, yet he knows that proximity to the victim creates suspicion. The threat of exposure from Sylvia, who had earned his trust, gnaws at him. She had seen through the bravado and recognized the man beneath the medals, and now her death feels like a betrayal he must untangle. His struggle with PTSD makes him vulnerable, and the prospect of his demons being laid bare to the public is a fate worse than death, one he cannot allow.",
      "In his interactions with others, Ivor maintains a stoic demeanor, often redirecting conversations toward his military experiences as a means of control. His words are clipped, authoritative, a shield against the chaos brewing inside him. As the investigation unfolds, he finds himself drawn deeper into a web of secrets that threaten to unravel his carefully constructed life. The stakes are high; a potential book deal based on his service looms in the background, offering financial stability but also the risk of exposing his hidden struggles.",
      "As he grapples with the truth behind Sylvia's murder, Ivor must confront the ghosts of his past while protecting the reputation he has built. The investigation forces him to face his internal demons, leading him toward a reckoning that could either liberate him from his guilt or bury him under the weight of his secrets. Will he rise to the occasion and seek redemption, or will he allow the shadows of his past to consume him?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a vivacious dancer whose charm masks a manipulative nature, as she navigates the dangerous waters of ambition and deception.",
    "publicPersona": "A talented performer, new to the town, charming and vivacious.",
    "privateSecret": "Has been using her charm to secure financial help from wealthy patrons.",
    "motiveSeed": "The victim was about to expose her manipulative schemes to the community.",
    "motiveStrength": "strong",
    "alibiWindow": "was rehearsing in her room at the time of the murder",
    "accessPlausibility": "unlikely",
    "stakes": "Her future in the community and ability to maintain her lifestyle.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a playful lilt, often punctuating her sentences with sarcastic remarks. She has a penchant for dramatic pauses, drawing attention to her words.",
    "signatureTic": "‘Life's a stage, darling, and I’m the star!’",
    "internalConflict": "Beatrice grapples with the fear of losing her status and the facade she has built, as her manipulative tendencies clash with her desire for genuine acceptance.",
    "personalStakeInCase": "This crime matters to Beatrice as it threatens to expose her schemes and jeopardize her standing in the community, pushing her toward a reckoning with her own values.",
    "paragraphs": [
      "Beatrice Quill is the embodiment of charm and vivacity, a dancer whose performances light up the stage and captivate the audience. Yet, behind the curtain, her life is a carefully curated façade, hiding the manipulative nature that drives her ambition. 'Life's a stage, darling, and I’m the star!' she often declares, a phrase that encapsulates her approach to life. Each interaction is a performance, and every smile is a calculated move in her quest for financial support from wealthy patrons, whom she ensnares with her allure.",
      "When news of Sylvia Trent's murder breaks, Beatrice finds herself in a precarious position. Her alibi of rehearsing in her room at the time of the crime feels tenuous, especially as whispers of her schemes begin to circulate. The victim had been on the verge of exposing her manipulative tactics to the community, a revelation that would shatter the illusion she has crafted. The stakes are high; her future in Brighton hinges on her ability to maintain her reputation, and the fear of being unmasked sends her into a spiral of anxiety.",
      "In her interactions, Beatrice employs a sardonic wit that masks her insecurity. She navigates conversations with a playful lilt, often making light of serious matters to deflect attention from her true feelings. However, beneath the surface, she grapples with the fear of losing the status she has worked so hard to achieve. The facade she has built feels increasingly tenuous, and the prospect of genuine acceptance seems like a distant dream, overshadowed by the threat of exposure.",
      "As the investigation unfolds, Beatrice is forced to confront the reality of her actions. The truth behind Sylvia's murder beckons her to reevaluate her values and the lengths she is willing to go to maintain her lifestyle. Will she continue to manipulate those around her, or will she find the courage to embrace authenticity and integrity? The path ahead is fraught with danger, but Beatrice must decide whether to remain the star of her own show or risk stepping into the shadows of her true self."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is an investigative journalist whose pursuit of truth leads to her untimely demise, leaving behind a tangled web of secrets.",
    "publicPersona": "An investigative journalist known for exposing corruption.",
    "privateSecret": "Has withheld key information about the victim's past to protect her own career.",
    "motiveSeed": "The victim threatened to reveal her connections with shady sources.",
    "motiveStrength": "weak",
    "alibiWindow": "was in a café at the time of the murder, seen by others",
    "accessPlausibility": "possible",
    "stakes": "Losing her credibility and access to exclusive stories.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Sylvia speaks in a direct, no-nonsense manner, often delivering her thoughts with a sharp clarity that reflects her journalistic background. She avoids small talk, preferring to dive straight into the heart of the matter.",
    "signatureTic": "‘The truth is a double-edged sword.’",
    "internalConflict": "Sylvia wrestles with the moral implications of her career, torn between her desire for truth and the consequences it brings to her relationships.",
    "personalStakeInCase": "This crime matters to Sylvia as it threatens her hard-earned credibility and access to exclusive stories, compelling her to confront the cost of her secrets.",
    "paragraphs": [
      "Sylvia Trent is a force to be reckoned with, a journalist driven by an insatiable thirst for truth. Her public persona as an investigative journalist known for exposing corruption grants her respect, but beneath the surface lies a tangled web of secrets. 'The truth is a double-edged sword,' she often states, a sentiment that underscores the moral dilemmas she faces. Sylvia's desire to uncover the layers of deception in her community often puts her at odds with those who prefer to keep their skeletons hidden.",
      "In her relentless pursuit of the truth, Sylvia has withheld key information about a victim's past, a choice that weighs heavily on her conscience. As the investigation into her murder unfolds, Sylvia’s alibi of being seen in a café at the time of death provides a sense of security, yet she knows that the whispers of her shady connections could unravel her credibility. The stakes are high; losing her reputation would mean losing access to exclusive stories and the respect she has garnered over the years.",
      "Sylvia's speech is characterized by directness and clarity, often cutting through the noise with a sharp tongue. She has little patience for small talk, preferring to engage in meaningful conversations that delve into the heart of the matter. Her colleagues respect her, yet they often fear her relentless pursuit of truth, which can alienate even the closest of allies. As the investigation continues, the implications of her choices become increasingly apparent, forcing her to confront the consequences of her actions.",
      "As the layers of her life are peeled back, Sylvia is compelled to wrestle with her internal conflict. The cost of her career looms large, leading her to question whether the truth is worth the sacrifices she has made. In the end, her untimely demise serves as a stark reminder of the dangers that come with seeking the truth in a world riddled with deception. Will her legacy be one of bravery, or will it be overshadowed by the very secrets she sought to expose?"
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a wealthy heir whose reckless lifestyle conceals a desperate need to maintain his status, as the threat of exposure looms over him.",
    "publicPersona": "A wealthy but irresponsible heir, known for his indulgent lifestyle.",
    "privateSecret": "Struggles with gambling debts and relies on family money to survive.",
    "motiveSeed": "Fears disinheritance if the victim exposes his financial habits.",
    "motiveStrength": "compelling",
    "alibiWindow": "was at the bar drinking when the murder happened, unverified",
    "accessPlausibility": "easy",
    "stakes": "Risk of losing his family's wealth and status.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks in a casual, almost careless manner, often using humor to deflect serious conversations. He tends to truncate his sentences, giving a sense of urgency to his words.",
    "signatureTic": "‘What’s life without a little risk?’",
    "internalConflict": "Hugo battles with the fear of losing his family's wealth and status, as his gambling habits threaten to expose him and jeopardize his future.",
    "personalStakeInCase": "This crime matters to Hugo as it threatens to unearth his reckless behavior and expose him to the risk of disinheritance, pushing him to confront his need for change.",
    "paragraphs": [
      "Hugo Vane is the quintessential spoiled rich heir, living a life of indulgence and excess that often masks the desperation beneath. His public persona as a wealthy but irresponsible heir is well-known in Brighton, yet few understand the shadows that lurk behind his careless demeanor. 'What’s life without a little risk?' he frequently quips, a phrase that encapsulates his reckless approach to life. However, beneath the bravado lies a man struggling with gambling debts that threaten to unravel his privileged existence.",
      "When Sylvia Trent's murder sends shockwaves through the community, Hugo's alibi of being at the bar drinking feels unverified and flimsy. The fear of disinheritance looms large, especially if the victim had been poised to expose his financial habits. The stakes are high; losing his family's wealth and status would not only strip him of his lifestyle but also force him to confront the consequences of his actions. Each sip of whiskey feels like a fleeting moment of comfort, masking the reality of his precarious situation.",
      "In conversations, Hugo's speech is blunt and casual, often deflecting serious discussions with humor. He truncates his sentences, as if trying to escape the weight of his choices, yet the urgency in his words reveals the turmoil brewing beneath the surface. His charm can be disarming, but it also serves as a shield against the truth he fears confronting. The investigation into Sylvia's murder pushes him closer to the edge, forcing him to grapple with the reality of his situation.",
      "As the truth begins to unravel, Hugo must confront the reality of his reckless behavior. The investigation forces him to reevaluate his life choices, pushing him toward a reckoning that could either lead to redemption or further ruin. Will he continue to gamble with his future, or will he find the courage to change his ways? The path ahead is fraught with danger, but Hugo must decide whether to remain a prisoner of his indulgence or break free from the chains of his past."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Oceanview Grand Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel overlooking the tumultuous English Channel, steeped in post-war uncertainty and personal intrigue.",
    "visualDescription": "Art Deco architecture with sweeping curves, vibrant murals, and polished brass fittings; a large dining hall adorned with crystal chandeliers and ocean views framed by tall windows.",
    "atmosphere": "A sense of unspoken tension permeates the air, filled with secrets and half-glances between guests.",
    "paragraphs": [
      "The Oceanview Grand Hotel rises majestically along the rugged Brighton coastline, its Art Deco facade shimmering beneath the overcast sky. The rhythmic crash of waves against the rocky shore intertwines with the muted conversations of guests, creating an uneasy harmony. Inside, dim lighting casts long shadows across the polished marble floors, while the scent of salt and damp wood lingers in the hallways. Guests often gather in the expansive dining hall, where the clinking of cutlery and hushed whispers add to the atmosphere of anticipation, as if every meal could reveal another layer of deception.",
      "The hotel’s narrow hallways twist and turn, leading to secluded guest rooms with ocean views. Each door is a threshold to personal dramas and hidden agendas, where the past collides with the uncertain present. Staff scurry with purpose, their conversations punctuated by the crackle of military-grade radios, a constant reminder of the world beyond these walls. The rooftop terrace offers a breathtaking view of the stormy sea, but access is strictly controlled after sunset, leaving secrets to fester in the dark. Every creak of the floorboards and flutter of a curtain feels like a whisper of something left unsaid.",
      "As the sun sets and the hotel is cast into shadow, the atmosphere thickens with tension. The flicker of candlelight in the dining hall dances across anxious faces, while the distant echo of the sea serves as a backdrop to the evening's revelations. Here, in this grand hotel, every guest is a potential suspect, and every corner holds a secret waiting to be uncovered. The Oceanview Grand Hotel, with its blend of elegance and unease, becomes a character in its own right, shaping the unfolding mystery."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal regions in the spring",
    "timeFlow": "Two tense days filled with secrets and revelations",
    "mood": "tense and anxious, reflecting post-war uncertainties and personal secrets among guests",
    "eraMarkers": [
      "Radio broadcasts in every room",
      "Early television sets in lounge areas",
      "Military-grade radios for staff communication"
    ],
    "sensoryPalette": {
      "dominant": "The salty tang of the sea mixed with dampness",
      "secondary": [
        "The clatter of cutlery in the dining hall",
        "The soft hum of radios in guest rooms"
      ]
    },
    "paragraphs": [
      "The air is thick with anticipation, a blend of salty sea air and the scent of damp wood, as guests navigate the shadowy corridors of the Oceanview Grand Hotel. The overcast sky casts a muted light through the tall windows, while the distant sound of waves crashing against the rocks sets a foreboding backdrop. Here, the echoes of wartime linger, and the weight of unspoken truths hangs heavy in every conversation, every glance exchanged at the dining table.",
      "As night falls, the hotel transforms into a haven of whispers and secrets. Shadows dance along the walls, while the flickering candlelight provides just enough illumination for anxious faces. The comforting crackle of the radio, broadcasting distant news, contrasts sharply with the tension that fills the air, reminding all within of the world outside—one filled with uncertainty and fear."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "Open terrace with wrought-iron railings, ocean views obscured by mist, scattered furniture",
      "sensoryDetails": {
        "sights": [
          "mist-draped sea horizon",
          "scattered chairs tipped over",
          "dimly lit lanterns swinging",
          "wet stone underfoot",
          "shadowy corners"
        ],
        "sounds": [
          "howling wind off the sea",
          "distant thunder rumbling",
          "flickering lanterns clattering",
          "waves crashing below",
          "footsteps echoing"
        ],
        "smells": [
          "fresh sea brine",
          "wet stone and moss",
          "faint perfume lingering",
          "smoky residue from extinguished candles",
          "damp fabric of cushions"
        ],
        "tactile": [
          "chill of the sea breeze",
          "rough texture of stone railings",
          "cold metal of lanterns",
          "dampness of the air",
          "soggy fabric from spilled drinks"
        ]
      },
      "accessControl": "Restricted access after sunset, staff-only entry without prior permission, guests required to sign in to access",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked terrace",
            "grey clouds hanging low",
            "drops glistening on railings",
            "puddles forming on stone",
            "drizzled shadows"
          ],
          "sounds": [
            "steady rain pattering",
            "water dripping from eaves",
            "distant rumble of thunder",
            "soft rustle of wet fabric",
            "occasional sighs of wind"
          ],
          "smells": [
            "freshly washed air",
            "damp earth",
            "mildew from shadows",
            "wet stone fragrance",
            "cold metal of furniture"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light",
            "shadowy figures across the terrace",
            "tattered cushions fluttering",
            "faint outlines of the sea",
            "dimly lit corners"
          ],
          "sounds": [
            "the occasional creak of metal",
            "the distant sound of seagulls",
            "soft thud of footsteps",
            "the murmuring sea"
          ],
          "smells": [
            "salt air thickening",
            "old wood and rust",
            "the faint scent of damp cloth",
            "candle wax remnants",
            "faint traces of perfume"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "stars twinkling above",
            "soft glow of lanterns",
            "shadows creeping across the terrace",
            "ocean reflecting moonlight",
            "dark outlines of furniture"
          ],
          "sounds": [
            "gentle waves lapping",
            "the soft rustle of leaves",
            "quiet laughter from above",
            "the distant hum of cars",
            "the ticking of a clock"
          ],
          "smells": [
            "warm candle wax",
            "the scent of night-blooming flowers",
            "freshness of the ocean breeze",
            "the lingering aroma of dinner",
            "smoky remnants of earlier fires"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The rooftop terrace, a once-vibrant space for evening gatherings, now stands in eerie silence. Mist clings to the edges, swallowing the sound of the waves below. The scattered chairs lie tipped over, a haunting testimony to the chaos that unfolded. Lanterns flicker in the wind, casting ghostly shadows that seem to dance with memories of laughter now turned to whispers of dread. Here, beneath the watchful gaze of the ocean, the weight of secrets presses heavily on the air, and the chill of the breeze carries a foreboding message.",
        "As the storm clouds roll in, the atmosphere thickens with suspense. Every creak of the terrace, every gust of wind, feels like a portent of the unknown. The elegance of the setting contrasts sharply with the tension, creating a palpable sense of danger that lingers long after the sun sets. All that remains are echoes of what was, mingling with the salty sea air, as if the very foundations of the hotel are steeped in the secrets it harbors."
      ]
    },
    {
      "id": "dining_hall",
      "name": "The Grand Dining Hall",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Expansive room with high ceilings, crystal chandeliers, and long oak tables set for dinner",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on white linen",
          "crystal chandeliers casting warm light",
          "floral arrangements on each table",
          "muffled conversations at each table",
          "staff in crisp uniforms"
        ],
        "sounds": [
          "clinking of glasses",
          "soft laughter mingling",
          "distant piano music",
          "the rustle of tablecloths",
          "conversations hushed between courses"
        ],
        "smells": [
          "roasted meat and fresh bread",
          "sweet notes of dessert",
          "candle wax and polished wood",
          "the faint scent of flowers",
          "the aroma of brewing coffee"
        ],
        "tactile": [
          "smoothness of polished wood tables",
          "soft fabric of chair upholstery",
          "coolness of glassware",
          "warmth of candlelight",
          "the weight of a full plate"
        ]
      },
      "accessControl": "Open to all guests during meal times, staff access at all hours, private events require advance booking",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "sunlight struggling through clouds",
            "water droplets on windowpanes",
            "empty tables awaiting breakfast",
            "flowers slightly drooping",
            "staff preparing for the day"
          ],
          "sounds": [
            "soft rain tapping on glass",
            "the distant sound of waves",
            "the rustle of newspapers",
            "muffled voices in the kitchen"
          ],
          "smells": [
            "freshly baked pastries",
            "strong coffee brewing",
            "citrus from fruit bowls",
            "the scent of wax from polished surfaces",
            "the faint hint of rain outside"
          ],
          "mood": "hopeful beginnings"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through windows",
            "shadows pooling in corners",
            "faded floral wallpaper",
            "guests deep in conversation",
            "staff discreetly observing"
          ],
          "sounds": [
            "soft murmurs of conversation",
            "the faint sound of utensils clinking",
            "the rustle of napkins",
            "the distant ticking of a clock",
            "the low hum of the radio"
          ],
          "smells": [
            "spiced meats simmering",
            "the scent of fresh herbs",
            "lingering aromas from lunch",
            "the bittersweet fragrance of dark chocolate",
            "the scent of old wood"
          ],
          "mood": "quiet tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off glassware",
            "guests dressed in evening attire",
            "tables adorned with elegant place settings",
            "a pianist in the corner",
            "the ocean visible through large windows"
          ],
          "sounds": [
            "lively music from the piano",
            "laughter ringing out",
            "the sound of cutlery against plates",
            "the clink of glasses raised in toast",
            "the soft buzz of chatter"
          ],
          "smells": [
            "scent of roasted meats",
            "sweet aroma of desserts",
            "the fragrance of wine breathing in decanters",
            "the warmth of candle wax",
            "the scent of cologne and perfume"
          ],
          "mood": "celebratory yet nervous"
        }
      ],
      "paragraphs": [
        "The Grand Dining Hall pulses with life as guests gather for dinner, the air rich with the scents of fine dining and the sound of laughter. Crystal chandeliers cast a warm glow over elegantly dressed patrons, while the clinking of silverware punctuates the conversations swirling around the long oak tables. Here, secrets are traded as easily as pleasantries, each interaction laden with unspoken tension. The atmosphere is alive, yet beneath the surface lies an undercurrent of suspicion; eyes dart from plate to plate, searching for truth within the facades of civility.",
        "As evening deepens, the dining hall transforms into a stage for hidden agendas. Candlelight flickers, casting dancing shadows that seem to mirror the guests’ own uncertainties. The soft strains of piano music mingle with the hushed tones of conversation, creating an intimate yet charged environment. In this grand space, every toast carries weight, and every word may lead to revelation or ruin, as the night unfolds in a delicate balance of charm and trepidation."
      ]
    },
    {
      "id": "library",
      "name": "The Hotel Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A dark wood-paneled room filled with shelves of books, plush armchairs, and a large fireplace",
      "sensoryDetails": {
        "sights": [
          "flickering firelight casting shadows",
          "plush armchairs arranged around a table",
          "dust motes floating in the air",
          "old portraits hanging on the walls"
        ],
        "sounds": [
          "crackling fireplace",
          "the rustle of pages turning",
          "the soft creak of chairs",
          "distant murmurs from the hallway",
          "the ticking of a wall clock"
        ],
        "smells": [
          "musty pages and leather",
          "smoky scent of firewood",
          "the fragrance of polished wood",
          "the faint hint of dust",
          "the aroma of coffee brewing nearby"
        ],
        "tactile": [
          "soft upholstery of armchairs",
          "smoothness of leather-bound books",
          "warmth radiating from the fireplace",
          "cold metal of the fireplace tools",
          "the texture of worn carpet underfoot"
        ]
      },
      "accessControl": "Open to guests during operating hours, staff access at all times, quiet conversation encouraged",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops streaking the windows",
            "grey light filtering through curtains",
            "gentle flicker of the fireplace",
            "chairs turned towards the fire",
            "books stacked for reading"
          ],
          "sounds": [
            "soft pattering of rain",
            "the crackle of the fire",
            "quiet whispers of readers",
            "the rustle of pages being turned",
            "the distant sound of thunder"
          ],
          "smells": [
            "freshly brewed coffee",
            "earthy scent from the rain",
            "the warmth of burning wood",
            "the aroma of old paper",
            "the fragrance of polished furniture"
          ],
          "mood": "cozy introspection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "dust floating in the air",
            "bookshelves stretching to the ceiling",
            "a single lamp glowing",
            "notebooks scattered on tables"
          ],
          "sounds": [
            "soft whispers echoing",
            "the ticking of a clock",
            "the rustle of paper",
            "the occasional cough",
            "the distant sound of footsteps"
          ],
          "smells": [
            "the musty scent of old books",
            "the fragrance of fresh ink",
            "the scent of coffee lingering",
            "the aroma of leather",
            "the faint hint of dust"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow from the fireplace",
            "a gathering of guests in deep conversation",
            "shadows playing on the walls",
            "books being browsed",
            "a single candle flickering"
          ],
          "sounds": [
            "the crackle of firewood",
            "soft laughter",
            "murmurs of conversation",
            "the turning of pages",
            "the ticking of a clock"
          ],
          "smells": [
            "the scent of burning wood",
            "the fragrance of leather",
            "the aroma of dark coffee",
            "the hint of cigar smoke",
            "the musty pages of old books"
          ],
          "mood": "intense focus"
        }
      ],
      "paragraphs": [
        "The Hotel Library offers a sanctuary of quiet, a refuge from the tumult outside. Nestled behind heavy oak doors, the dimly lit space is adorned with dark wood paneling and towering shelves filled with volumes of knowledge and intrigue. Plush armchairs invite guests to sink into their depths, while a crackling fireplace casts a golden glow over the room. Here, secrets are buried within the pages of forgotten books, and every whisper seems to carry the weight of history. As guests linger over their selections, the atmosphere grows dense with possibilities, each book potentially holding the key to the unfolding mystery.",
        "As the evening progresses, the library transforms into a haven for those seeking solace or answers. The flickering firelight dances across the spines of the books, illuminating the faces of the guests deep in thought. The air is thick with the scent of old paper and burning wood, and the soft sounds of pages turning create a symphony of quiet contemplation. In this intimate space, the tension rises, as every glance and gesture may reveal hidden truths, while the ticking clock serves as a reminder that time is running out."
      ]
    }
  ],
  "note": "",
  "cost": 0.00462781605,
  "durationMs": 45470
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "December",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "December",
    "weather": [
      "overcast skies",
      "occasional rain",
      "cool coastal breezes"
    ],
    "daylight": "Short winter days, with daylight fading by four o'clock, leaving a heavy gloom in the air",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel guests settle into their rooms",
    "holidays": [
      "Christmas",
      "New Year's Eve"
    ],
    "seasonalActivities": [
      "attending festive parties",
      "holiday shopping in local markets",
      "enjoying seasonal treats like roasted chestnuts"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "dark wool suits",
        "double-breasted jackets",
        "tweed trousers"
      ],
      "casual": [
        "flannel shirts",
        "corduroy jackets",
        "wool sweaters"
      ],
      "accessories": [
        "silk ties",
        "fedora hats",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea dresses with cinched waists",
        "faux fur coats",
        "beaded clutches"
      ],
      "casual": [
        "wool skirts",
        "cashmere sweaters",
        "penny loafers"
      ],
      "accessories": [
        "string of pearls",
        "berets",
        "cashmere scarves"
      ]
    },
    "trendsOfTheMoment": [
      "military-inspired fashion",
      "bold prints and colors",
      "functional yet stylish accessories"
    ],
    "socialExpectations": [
      "men expected to open doors and help with coats",
      "women encouraged to dress elegantly for social events",
      "growing acceptance of women in professional roles"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "ongoing discussions of the Marshall Plan in Europe",
      "tensions rising in the Korean Peninsula",
      "the establishment of the state of Israel causing regional unrest"
    ],
    "politicalClimate": "Post-war recovery efforts are underway, but the threat of communism looms large, leading to rising tensions domestically and abroad.",
    "economicConditions": "A mixed economic landscape with inflation affecting prices, but a growing consumer market as rationing ends.",
    "socialIssues": [
      "displacement of war refugees",
      "gender equality in the workplace",
      "racial segregation and civil rights movements gaining momentum"
    ],
    "internationalNews": [
      "UN debates on human rights",
      "the Berlin Blockade still fresh in memory",
      "concern over Soviet expansion in Eastern Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's holiday classics",
        "Nat King Cole's smooth jazz",
        "Frank Sinatra's romantic ballads"
      ],
      "films": [
        "'The Treasure of the Sierra Madre'",
        "'The Bishop's Wife'",
        "'Key Largo'"
      ],
      "theater": [
        "'Death of a Salesman'",
        "'The King and I'",
        "'A Streetcar Named Desire'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Shadow'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'1984' by George Orwell",
        "'The Naked and the Dead' by Norman Mailer",
        "'The Catcher in the Rye' by J.D. Salinger"
      ],
      "popularGenres": [
        "detective fiction",
        "psychological novels",
        "post-war literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "early computers in experimental phases",
        "the first commercial jet airliner prototype"
      ],
      "commonDevices": [
        "black-and-white television sets",
        "crystal radios",
        "typewriters"
      ],
      "emergingTrends": [
        "increased use of synthetic materials",
        "the rise of consumer electronics",
        "automation beginning to influence manufacturing"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: 10 cents",
        "Movie ticket: 50 cents",
        "Bottle of soda: 15 cents"
      ],
      "commonActivities": [
        "visiting local coffee shops",
        "attending community social events",
        "participating in winter sports like ice skating"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "holiday gift exchanges",
        "New Year's resolutions parties"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing mobility between social classes due to post-war opportunities",
      "class distinctions still significant in urban settings"
    ],
    "gender": [
      "women are increasingly taking on roles previously reserved for men",
      "some resistance to changing gender norms persists",
      "women's rights discussions gaining traction"
    ],
    "race": [
      "increased awareness of racial inequalities",
      "civil rights movements beginning to take shape",
      "racial integration still a contentious issue"
    ],
    "generalNorms": [
      "courtesy and formality in public interactions",
      "expectation of modesty in dress and behavior",
      "increasing acceptance of diverse family structures"
    ]
  },
  "atmosphericDetails": [
    "The scent of pine and cinnamon wafts through the hotel lobby, mingling with the damp air from the rain outside.",
    "The sound of distant laughter and clinking glasses fills the air as guests gather for holiday festivities, creating an ambiance of warmth despite the chilly weather.",
    "Flickering lights from the Christmas decorations cast a soft glow, illuminating the anxious faces of guests who harbor secrets beneath their polished exteriors."
  ],
  "paragraphs": [
    "On a gray December evening in 1948, the hotel buzzes with an undercurrent of tension, as guests gather in the dimly lit lounge. The weather outside is dreary, with overcast skies and a light drizzle that blurs the view of the coastal landscape. As the clock ticks toward ten, the feeling of holiday cheer is marred by unspoken secrets and anxieties that linger like the smoke from the fireplaces. The festive decorations, reminiscent of a simpler time, do little to dispel the atmosphere of uncertainty that envelops the guests, many of whom are still grappling with the scars of the recent war.",
    "Fashion in December 1948 reflects a blend of elegance and practicality, with men sporting dark wool suits, complemented by silk ties and polished shoes. Meanwhile, women adorn themselves in tea dresses cinched at the waist, often paired with faux fur coats that speak to both style and the need for warmth. Accessories such as pearls and leather gloves are common, emphasizing the post-war desire to reclaim normalcy and sophistication. The mingling of guests in their finest attire adds to the hotel’s allure, yet beneath the surface, fashion becomes a façade to mask deeper concerns.",
    "Daily life in the aftermath of World War II is a balance of routine and recovery. Prices for goods remain high, with a loaf of bread costing ten cents and movie tickets at fifty cents, but the economy shows signs of growth as rationing fades. Social rituals, such as Sunday family dinners and holiday gatherings, foster community spirit, yet the societal changes brought on by the war are palpable. The roles of women in the workforce continue to evolve, and conversations about racial equality begin to spark among the guests, hinting at a transformative era. As the guests navigate these shifts, the hotel's atmosphere becomes a microcosm of the larger world, reflective of the uncertainties and hopes that define this moment in history."
  ],
  "note": "",
  "cost": 0.00106743615,
  "durationMs": 10988
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering of hotel guests, each with their own secrets, is overshadowed by the tensions of post-war society and the looming threat of Cold War, as they navigate personal loyalties amidst a murder investigation sparked by a tampered clock.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is shifting with women entering jobs traditionally held by men due to WWII, while post-war trauma and emerging Cold War tensions create an atmosphere of anxiety and secrecy."
  },
  "setting": {
    "location": "A grand seaside hotel with Art Deco architecture",
    "institution": "hotel",
    "weather": "overcast with occasional rain, typical of coastal regions in the spring"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a mechanical clock-tampering method, where a rewound timepiece staged the apparent time of death."
}

### LOCKED_FACTS
[
  {
    "id": "time_of_death",
    "value": "a quarter past nine",
    "description": "the actual time of death of the victim"
  },
  {
    "id": "falsified_time",
    "value": "ten minutes past eight",
    "description": "the time the clock was set to show after tampering"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 15,
  "countsByPlacement": {
    "early": 6,
    "mid": 8,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 14,
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
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_7",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_8",
      "placement": "mid",
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
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_optional_slot_1",
      "placement": "late",
      "criticality": "optional",
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

# Actual Prompt Record

- Run ID: `mystery-1784250382521`
- Project ID: ``
- Timestamp: `2026-07-17T01:10:00.159Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `29fc1a23a0ef3daf`

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
    "title": "Reflections of Deceit",
    "author": "Unknown",
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
      "subtype": "optical deception"
    }
  },
  "death_method": "stabbed with a letter opener",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Successful businesswoman",
      "private_secret": "Involved in a secret business deal",
      "motive_seed": "Professional rivalry",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM to 8:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation and business integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Expert",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Has a past with the victim",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "7:00 PM to 8:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority figure",
      "relationships": [],
      "public_persona": "Nautical expert",
      "private_secret": "Involved in smuggling",
      "motive_seed": "Self-preservation",
      "motive_strength": "weak",
      "alibi_window": "7:00 PM to 8:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Freedom",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Friend",
      "relationships": [],
      "public_persona": "Socialite",
      "private_secret": "In love with the victim's partner",
      "motive_seed": "Unrequited love",
      "motive_strength": "weak",
      "alibi_window": "7:00 PM to 8:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Love and social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Rival",
      "relationships": [],
      "public_persona": "Business competitor",
      "private_secret": "Wants to sabotage the victim's deal",
      "motive_seed": "Professional sabotage",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM to 8:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Business survival",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Private investigator",
      "private_secret": "Has a personal connection to the victim",
      "motive_seed": "Seeking justice",
      "motive_strength": "strong",
      "alibi_window": "evening",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Sylvia Trent"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a business conference at a seaside hotel, Eleanor Voss is found murdered in her room, stabbed with a letter opener. As detective Hugo Vane investigates, he uncovers a sophisticated deception involving optical illusions that mislead witnesses about the murderer's identity."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "Eleanor Voss was attacked while her attacker manipulated the positioning of a mirror to reflect the scene misleadingly.",
      "delivery_path": [
        {
          "step": "The murderer positioned a mirror at an angle to obscure their actual attack."
        }
      ]
    },
    "outcome": {
      "result": "The true murderer is revealed to be Sylvia Trent, who sought to eliminate Eleanor to gain a business advantage."
    }
  },
  "false_assumption": {
    "statement": "Witnesses believed the murder occurred in plain sight.",
    "type": "spatial",
    "why_it_seems_reasonable": "The dining room layout suggested visibility to the scene.",
    "what_it_hides": "The real angle of the attack was obscured by a strategically placed mirror."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses recall Captain Hale being near the victim just before the murder.",
      "He had been seen arguing with Eleanor about a business matter."
    ],
    "the_one_flaw": "Captain Hale's alibi was corroborated by multiple witnesses who placed him elsewhere during the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses saw a figure resembling Captain Hale near the scene.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The figure was actually another guest wearing similar attire.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A heated argument was overheard between Sylvia Trent and Eleanor.",
      "points_at_suspect": "Sylvia Trent",
      "innocent_explanation": "The argument was about business, not a motive for murder.",
      "resolved_in_chapter": 5
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the murder, and no outsiders had access."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "7:45 PM - Time of the murder"
      ],
      "windows": [
        "7:00 PM to 8:00 PM - Alibi window for all suspects"
      ],
      "contradictions": [
        "Witness reports conflicting times of hearing the argument."
      ]
    },
    "access": {
      "actors": [
        "All suspects had access to the victim's room."
      ],
      "objects": [
        "Letter opener found at the scene."
      ],
      "permissions": [
        "Only hotel staff had key access to rooms."
      ]
    },
    "physical": {
      "laws": [
        "Light reflects off surfaces at predictable angles."
      ],
      "traces": [
        "Mirror fingerprints found at the scene."
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses expressed trust in Captain Hale's character."
      ],
      "authority_sources": [
        "Hotel staff corroborated the suspects' whereabouts."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "A mirror placed in the dining room reflects an unusual angle towards the victim's seat.",
        "correction": "The angle of the mirror suggests that the view from the dining area was obscured.",
        "effect": "Narrows the attack angle to suspect Sylvia Trent.",
        "required_evidence": [
          "Mirror position recorded by hotel staff",
          "Witness accounts of position discrepancies"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses claim they saw Captain Hale near the victim before the murder.",
        "correction": "The angle of the mirror contradicts their view, as the reflection would obscure Hale's position.",
        "effect": "Eliminates Captain Hale from suspicion.",
        "required_evidence": [
          "Witness statements claiming visibility",
          "Mirror position documentation"
        ],
        "reader_observable": true
      },
      {
        "observation": "A napkin matching the victim's attire is found near the mirror.",
        "correction": "The positioning of the napkin indicates that it was placed there before the murder, not after.",
        "effect": "Narrows focus back to Sylvia Trent as the last known person near the victim.",
        "required_evidence": [
          "Napkin found at the scene",
          "Victim's outfit description"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares mirror, attack, and dining against the claimed timeline.",
    "knowledge_revealed": "The optimal angle of the mirror and the position of the witnesses proves that their accounts cannot be accurate if Sylvia were the attacker.",
    "pass_condition": "If Sylvia Trent's position during the alleged attack does not allow for visibility, she must be guilty.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The mirror's angle (early) and witness accounts (mid) allow the reader to deduce visibility issues. Step 2: The napkin's position (mid) narrows suspicion back to Sylvia. Step 3: The reconstruction test (discriminating test) confirms the false visibility assumption."
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
        "Reconstruct the mirror angles",
        "Demonstrate the visibility issue with Sylvia's position"
      ],
      "test_type": "angle reconstruction"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Demonstrated angle discrepancy",
        "supporting_clues": [
          "mirror position documentation",
          "witness statements"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi corroborated by multiple witnesses",
        "supporting_clues": [
          "witness statements"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed absence during the murder window",
        "supporting_clues": [
          "witness statements"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 7:00 PM to 8:00 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation based on optical evidence"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Behavioral observation"
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
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_sylvia_trent",
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
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
    "summary": "Eleanor Voss is a charming socialite who hosts extravagant soirées, but beneath her polished exterior lies a desperate ambition to secure her financial future through marriage.",
    "publicPersona": "Eleanor is the epitome of grace and charm, effortlessly mingling with the elite, her laughter ringing like chimes at her lavish parties, each smile a carefully crafted façade designed to conceal her true intentions.",
    "privateSecret": "Behind closed doors, Eleanor is consumed by a gnawing anxiety, aware that her lavish lifestyle hinges precariously on her ability to attract wealthy suitors, particularly the late victim's estate, which she covets even more now that it is up for grabs.",
    "motiveSeed": "Her desire to inherit the wealth of the victim's late husband is not just about money; it's about maintaining the social standing she has painstakingly built, a lifeline to a world that could easily cast her aside.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims she was in her room at the time of the murder, a convenient excuse that may hold more truth than she wishes to reveal.",
    "accessPlausibility": "While her alibi is shaky, she had the opportunity to slip away unnoticed amid the chaos of a party, making her access to the crime scene plausible.",
    "stakes": "The stakes are high for Eleanor; losing the victim's estate would mean not only losing her home but also her status, plunging her into a world of uncertainty she fears more than death itself.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a melodic cadence, her words laced with charm and an undercurrent of sharp wit, often punctuating her sentences with a delicate laugh that disarms her audience.",
    "signatureTic": "‘Oh, darling!’ she often exclaims, rolling her eyes as if the world is a stage and she the leading lady.",
    "internalConflict": "Eleanor battles with her own moral compass, torn between her relentless pursuit of wealth and a growing realization that genuine connections may be worth more than the riches she so desperately seeks.",
    "personalStakeInCase": "This crime matters to Eleanor not just as a socialite but as a woman on the brink of losing everything she holds dear, her entire world threatened by the outcome of the investigation.",
    "paragraphs": [
      "Eleanor Voss glided through the opulent halls of the seaside hotel, her laughter echoing like a siren's call, drawing in the wealthy and influential like moths to a flame. She was the perfect hostess, a vision of elegance and charm, yet behind her dazzling smile lay a desperation that few could fathom. The glint in her eye hinted at ambitions that stretched far beyond mere social gatherings; she was a woman on a mission, intent on securing her future at any cost.",
      "In the shadows of her lavish parties, Eleanor harbored a secret that gnawed at her insides like a ravenous beast. With her marriage prospects dwindling, the death of the victim had opened a door she never thought possible. The late husband's wealth, a golden ticket to the life she craved, now dangled tantalizingly within reach. But with it came the threat of exposure, the risk of losing everything she had worked so hard to build.",
      "As she sipped her champagne, Eleanor's mind raced, strategizing how to navigate the treacherous waters of suspicion that now surrounded her. The murder had thrown her into the spotlight, and while her alibi of being in her room could serve as a shield, the whispers of doubt crept closer with every passing moment. She needed to play her cards right, to charm her way out of this mess while keeping her true motives hidden.",
      "Yet, beneath her polished exterior, a flicker of conscience began to ignite. Eleanor found herself grappling with the realization that perhaps there was more to life than wealth and status. Could it be that the very relationships she had so easily cast aside were the true treasures she had overlooked? As the investigation unfolded, she would be forced to confront not only her own ambitions but also the cost of her relentless pursuit of a life defined by riches."
    ]
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a compassionate physician who finds herself entangled in a web of ethical dilemmas as she faces the consequences of her choices regarding the victim's terminal illness.",
    "publicPersona": "Known for her unwavering dedication to her patients, Dr. Finch is a respected physician who commands admiration for her kindness, particularly towards veterans, often seen tending to their needs with an empathetic ear.",
    "privateSecret": "However, her gentle exterior masks a troubling secret; she has been treating the victim for a terminal illness while withholding the full prognosis, a decision that weighs heavily on her conscience.",
    "motiveSeed": "Driven by a twisted sense of compassion, she believed that ending the victim's suffering might be the only way to truly help, a belief that has now placed her in the crosshairs of suspicion.",
    "motiveStrength": "moderate",
    "alibiWindow": "Dr. Finch claims she was at the nurses' station during the murder, a location that could easily be verified, yet one that leaves room for doubt.",
    "accessPlausibility": "As a physician, she had the access needed to the victim's room, making her presence at the scene of the crime not only plausible but also expected.",
    "stakes": "The stakes for Dr. Finch are monumental; her reputation and medical license hang in the balance, and the fear of losing everything she has built drives her deeper into the shadows.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.3,
    "speechMannerisms": "Dr. Finch speaks with a calm, measured tone, often punctuating her sentences with dry observations that reveal her sharp intellect, though she rarely allows humor to overshadow her serious demeanor.",
    "signatureTic": "‘It’s a delicate matter,’ she often says, her voice steady yet laden with unspoken burdens.",
    "internalConflict": "Dr. Finch is caught in a moral quagmire, wrestling with the implications of her choices and the haunting question of whether her actions were truly justified, or merely a cowardly escape from the truth.",
    "personalStakeInCase": "This case strikes a personal chord for Dr. Finch; the investigation could expose her ethical breaches, shattering the trust she has built with her patients and colleagues alike.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the dimly lit nurses' station, her fingers tracing the edge of a patient file as her mind churned with the weight of her decisions. To the world, she was a beacon of compassion, a doctor who cared deeply for her patients. Yet beneath that veneer lay a tumultuous storm of guilt and fear, the specter of the victim's suffering haunting her every thought.",
      "For months, she had treated the victim, administering care while withholding the full prognosis, believing that ignorance might spare the woman further pain. But now, with the murder casting a pall over her actions, Dr. Finch found herself grappling with the consequences of her choices. Had her misguided sense of compassion led her to the brink of moral ruin?",
      "As the investigation unfolded, the whispers grew louder, and the scrutiny of her colleagues intensified. Dr. Finch felt the walls closing in, her alibi barely holding against the tide of suspicion. Each interaction with the authorities felt like a precarious dance on a tightrope, one misstep away from exposing the truth she fought so hard to conceal.",
      "In the quiet moments, she wrestled with her internal conflict, torn between the ethical lines she had crossed and the genuine care she felt for her patients. Could she find redemption in the chaos, or was she destined to be consumed by the very demons she had sought to silence? As the case progressed, Dr. Finch would have to confront not only the truth of the victim's death but also the truth of her own heart."
    ]
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer whose stoic demeanor hides a tumultuous inner world, as he grapples with PTSD and the fear of losing his family's legacy.",
    "publicPersona": "With a commanding presence, Captain Hale is revered for his steadfastness and traditional values, often found regaling guests with tales of valor from his naval days, his stern exterior masking a tumult of emotions.",
    "privateSecret": "Yet beneath that facade lies a man tormented by the memories of war, battling the demons of PTSD that threaten to unravel the very fabric of his identity.",
    "motiveSeed": "Captain Hale believes the victim's will favors outsiders over true family, a betrayal that stirs a fierce protectiveness over his legacy, pushing him to consider drastic measures.",
    "motiveStrength": "strong",
    "alibiWindow": "He claims to have been seen in the bar on the other side of the hotel, a location that could easily provide him with a plausible alibi.",
    "accessPlausibility": "As a resident of the hotel, access to the victim's quarters was not only plausible but expected, given his familial ties.",
    "stakes": "The stakes for Captain Hale are monumental; he feels compelled to protect the family's honor and estate from being mismanaged, fearing that a loss would tarnish not only his legacy but also the memory of those who served before him.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Captain Hale speaks with a clipped, authoritative tone, often punctuating his statements with a bluntness that leaves little room for ambiguity, his words heavy with unspoken burdens.",
    "signatureTic": "‘Duty above all,’ he often asserts, as if reminding himself of his own creed.",
    "internalConflict": "Captain Hale struggles with the weight of his past, the memories of war clashing with his desire to uphold family honor, leaving him in a constant battle between his sense of duty and the scars he carries.",
    "personalStakeInCase": "This case matters deeply to Captain Hale; the investigation threatens to unearth secrets that could shatter his family's reputation and legacy, making it a personal battle for the heart of his lineage.",
    "paragraphs": [
      "Captain Ivor Hale sat in the bar, nursing a whiskey that burned like the memories he fought to suppress. His stern visage was a mask, a carefully crafted shield against the world that could never understand the battles he had fought, both on the sea and within his own mind. The tales of valor he spun for guests were mere distractions from the chaos that raged beneath the surface.",
      "The news of the victim's murder struck him like a cannonball, forcing him to confront the reality of his family's precarious position. The will, he feared, would favor outsiders over true family, a betrayal that ignited a fierce protectiveness within him. He felt the weight of duty pressing down on him, a relentless reminder that he must safeguard his family's honor at all costs.",
      "With each passing hour, the investigation tightened around him like a noose. His alibi, while plausible, felt like a flimsy cover for the tempest brewing inside. The shadows of his past whispered doubts into his ear, urging him to confront the truths he had long buried. Would he allow the family legacy to be tarnished by the whims of the living, or would he take matters into his own hands?",
      "As the storm of suspicion closed in, Captain Hale found himself at a crossroads, grappling with the demons of his past and the responsibilities of his present. The battle for his family's honor was not just a fight against external forces; it was a fight against himself, a struggle to reclaim the man he had once been, before the war had taken so much from him."
    ]
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious young writer whose desire for success is complicated by her secret love for the victim's late husband's son, intertwining her personal and professional stakes.",
    "publicPersona": "Eager and bright-eyed, Beatrice is the quintessential aspiring writer, often found scribbling furiously in her notebook, seeking inspiration in the lives of the wealthy, her enthusiasm palpable in every conversation.",
    "privateSecret": "Beneath her ambitious exterior lies a heart torn by unrequited love, as she secretly harbors feelings for the victim's late husband's son, complicating her motivations and desires.",
    "motiveSeed": "Her ambition drives her to expose family secrets for a sensational novel that could elevate her career, but her love for him adds a layer of complexity that she cannot ignore.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims she was interviewing local residents for her writing, a cover that could easily be challenged.",
    "accessPlausibility": "As a guest at the hotel, she had ample opportunities to access various areas, making her presence at the scene of the crime plausible.",
    "stakes": "For Beatrice, the stakes are high; success in her writing career could catapult her into the limelight, but the risk of losing everything—especially the man she loves—looms large.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a rapid-fire cadence, her words tumbling out in a whirlwind of excitement and anxiety, often laced with sardonic observations about the world around her.",
    "signatureTic": "‘It’s all fodder for the story,’ she often declares, her eyes glinting with ambition.",
    "internalConflict": "Beatrice is torn between her desire for success and the fear of losing the affection of the man she loves, grappling with the moral implications of using their family's secrets to fuel her ambition.",
    "personalStakeInCase": "This investigation impacts Beatrice on a deeply personal level; the outcome could jeopardize her budding relationship and her writing career, forcing her to choose between ambition and love.",
    "paragraphs": [
      "Beatrice Quill perched on the edge of her seat in the hotel lobby, her notebook clutched tightly in one hand as she observed the world around her with wide-eyed fascination. The rich and powerful were her muse, and she was determined to capture their stories, to weave the fabric of their lives into the pages of her future best-seller. But beneath her eager exterior lay a tempest of emotions, a secret that threatened to unravel her carefully crafted narrative.",
      "Her heart raced at the thought of the victim's late husband's son, a man who occupied her thoughts day and night. The tension between ambition and affection was a tightrope she walked every day, each word she penned a potential dagger to their relationship. Could she expose the family's secrets for the sake of her career, knowing it could destroy the very connection she yearned to build?",
      "As the murder investigation unfolded, Beatrice's mind spun with possibilities, each twist and turn feeding her ambition while simultaneously threatening to shatter her dreams. She had to tread carefully, her alibi of interviewing locals a precarious cover that could be easily dismantled if the wrong questions were asked. The stakes were higher than ever; success was within her grasp, but the price could be too steep to pay.",
      "Caught in the crossfire of her desires, Beatrice began to question her motivations. Was she willing to sacrifice love for ambition, or could she find a way to balance both? The outcome of the investigation loomed like a dark cloud, a reminder that the world she sought to conquer was fraught with dangers she had yet to comprehend."
    ]
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a cunning hotel manager whose charm masks a tumultuous past, as she grapples with the consequences of a secret affair with the victim's husband.",
    "publicPersona": "As the efficient and charming hotel manager, Sylvia is known for her discretion and poise, effortlessly managing the bustling seaside hotel while maintaining an air of sophistication that captivates guests.",
    "privateSecret": "However, behind her polished facade lies a secret that could shatter her carefully constructed world; she had a secret affair with the victim's husband, a liaison that now threatens to come to light.",
    "motiveSeed": "Fearing that their affair would be exposed, Sylvia feels cornered, willing to do anything to protect her career and reputation from being tarnished by the truth.",
    "motiveStrength": "strong",
    "alibiWindow": "She claims to have been managing the dining room during the incident, a position that could lend her credibility but also exposes her to scrutiny.",
    "accessPlausibility": "As the hotel manager, her access to the victim's quarters was not only expected but also routine, making her presence at the scene of the crime plausible.",
    "stakes": "For Sylvia, the stakes are nothing short of her entire career; the exposure of her past could ruin her reputation and dismantle the life she has worked so hard to build.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a measured elegance, her words flowing smoothly as she navigates conversations with a keen observational wit that reveals her intelligence and cunning.",
    "signatureTic": "‘Let’s not make a scene,’ she often says, her tone light yet carrying an edge of urgency.",
    "internalConflict": "Sylvia is locked in a battle between her desire to maintain her successful career and the guilt that gnaws at her for betraying the victim, forcing her to confront the moral implications of her choices.",
    "personalStakeInCase": "This investigation poses a personal threat to Sylvia; the outcome could expose her affair and jeopardize everything she has built, making her desperate to keep her past hidden.",
    "paragraphs": [
      "Sylvia Trent glided through the dining room, her presence commanding attention as guests marveled at her poise and efficiency. She was the epitome of a successful hotel manager, her charm a carefully crafted armor that concealed the turmoil brewing just beneath the surface. With a smile that could light up the room, she maneuvered through the chaos of the dining area, each interaction a dance of diplomacy and grace.",
      "Yet, as she served the guests, her mind raced with the weight of a secret that threatened to unravel her world. The affair with the victim's husband was a chapter she had hoped would remain buried, a reckless decision that now loomed over her like a dark cloud. The murder had cast suspicion on her, and with each passing moment, the risk of exposure felt more imminent.",
      "Sylvia’s alibi of managing the dining room offered her a veneer of credibility, but she knew the truth was far more complicated. The whispers of the hotel staff echoed in her ears, each glance laden with suspicion, each question a reminder of the precariousness of her situation. She had to keep her past hidden, to maintain the façade of the perfect manager while the walls closed in around her.",
      "Caught in a web of deceit, Sylvia faced a reckoning. Would she confess to her past and risk losing everything, or would she spiral deeper into her own lies? The investigation was a mirror reflecting her choices, forcing her to confront the reality of her actions and the lengths she would go to protect the life she had fought so hard to build."
    ]
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a charismatic real estate developer whose charm masks a precarious financial situation, as he navigates a web of ambition and deceit in the wake of the victim's murder.",
    "publicPersona": "With a disarming smile and a silver tongue, Hugo is a well-known figure in the community, his reputation as a charismatic developer enhancing his allure, often seen schmoozing with potential investors and community leaders.",
    "privateSecret": "Beneath the surface, Hugo is deeply in debt, his financial struggles pushing him to manipulate family dynamics in hopes of securing a lucrative estate deal from the victim's estate.",
    "motiveSeed": "His ambition drives him to seek favor with the victim, believing that winning her over could unlock the doors to the financial security he so desperately craves.",
    "motiveStrength": "weak",
    "alibiWindow": "Hugo claims to have been in a meeting with potential investors during the time of the murder, a scenario that could be easily verified but also raises questions about his true intentions.",
    "accessPlausibility": "As a developer, he had ample opportunities to access the hotel and its guests, making his presence plausible but also suspicious given the circumstances.",
    "stakes": "For Hugo, the stakes are high; failing to secure new investments could lead to financial ruin, making the outcome of the investigation a matter of survival.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks with a measured cadence, often lacing his dialogue with dry observations that reveal his sharp wit, though he remains careful to maintain a polished exterior.",
    "signatureTic": "‘Just a minor setback,’ he often quips, his tone light yet betraying the gravity of his situation.",
    "internalConflict": "Hugo grapples with the tension between his ambition and the ethical implications of his actions, questioning whether the ends truly justify the means in his relentless pursuit of success.",
    "personalStakeInCase": "This case holds personal significance for Hugo; the outcome could either propel him toward the financial success he craves or plunge him into deeper despair, making it a pivotal moment in his life.",
    "paragraphs": [
      "Hugo Vane leaned against the polished bar, his disarming smile masking the storm of anxiety brewing within. As a charismatic real estate developer, he was used to charm and manipulate those around him, his silver tongue often securing deals that others deemed impossible. But beneath the surface lay a treacherous undercurrent of financial instability, a secret that threatened to unravel his carefully constructed façade.",
      "The murder of the victim had thrown his plans into disarray, the stakes higher than ever as he sought to win her favor for a lucrative estate deal. Every interaction felt like a gamble, each conversation a potential minefield that could either lead to success or financial ruin. Hugo's alibi of meeting with investors hung precariously in the air, a thin veil that could easily be lifted if anyone dared to question it.",
      "As the investigation unfolded, Hugo felt the walls closing in, his charm and wit becoming increasingly strained. He was forced to grapple with the ethical implications of his pursuit, questioning whether his ambition justified the lengths to which he had gone. The stakes were not merely financial; they were personal, a battle for survival that weighed heavily on his conscience.",
      "Caught in a web of deceit, Hugo faced a turning point. Would he continue to manipulate those around him in his quest for success, or would he find a way to navigate the chaos with integrity? The investigation was a reflection of his choices, a chance to reassess what truly mattered in a life defined by ambition and risk."
    ]
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Oceanview Hotel",
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand Art Deco hotel perched on the cliffs of Brighton, popular with both vacationers and business travelers.",
    "visualDescription": "The hotel boasts sweeping ocean views, elegant geometric patterns in its façade, and large windows that frame the crashing waves below. Inside, polished marble floors reflect the soft glow of vintage chandeliers, while plush velvet furnishings add a touch of luxury.",
    "atmosphere": "A blend of elegance and tension, where the beauty of the seaside masks underlying threats.",
    "paragraphs": [
      "The Oceanview Hotel stands proudly on the Brighton cliffs, its Art Deco design a stark contrast to the rugged coastline it overlooks. A grand entrance leads guests through a lobby adorned with intricate geometric motifs, the air thick with the scent of salt and sea. Outside, the waves crash against the rocks, their rhythmic roar echoing the uncertainty that hangs in the air. As guests gather in the dining room, the glint of silverware reflects not just the flickering candlelight but also the unease that simmers just below the surface.",
      "Brighton, with its bustling promenade and lively atmosphere, might seem like a perfect getaway, but the Oceanview Hotel cloaks a different story. Narrow hallways wind through the building, limiting access and creating isolated pockets of secrecy. Staff scurry about, their footsteps muffled by plush carpets, while guests exchange furtive glances at breakfast. Each room holds its own secrets, with restricted access enforced by stern security, a reminder that not all who enter are welcome. The hotel may be a haven for some, but for others, it is a trap waiting to ensnare.",
      "As evening falls, the hotel's atmosphere shifts. The sound of laughter and clinking glasses in the dining room mixes with the distant crash of waves, creating a symphony of tension. Outside, the overcast sky hints at impending rain, while inside, the warm glow of lights casts long shadows. The scent of freshly prepared seafood wafts through the air, mingling with the more pungent odors of damp wood and old leather. Guests whisper their suspicions as the night deepens, unaware that one of them harbors a deadly secret."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain showers, typical of a coastal climate.",
    "timeFlow": "Three days of mounting tension as secrets unfold.",
    "mood": "Tense and suspenseful, reflecting the uncertainty of post-war society.",
    "eraMarkers": [
      "Radio broadcasts of news updates",
      "Rationed fuel for vehicles",
      "Increased presence of women in the workforce",
      "Military radar installations nearby",
      "Early television sets in guest lounges"
    ],
    "sensoryPalette": {
      "dominant": "Salt air mixed with damp wood",
      "secondary": [
        "Polished marble and velvet",
        "Ocean waves crashing against rocks"
      ]
    },
    "paragraphs": [
      "The Oceanview Hotel is a study in contrasts, where the elegance of the Art Deco design meets the harshness of the coastal elements. Salt air fills the nostrils, mingling with the scent of damp wood and old leather, a reminder of the hotel’s storied past. The sound of crashing waves creates a constant backdrop, a rhythmic pulse that heightens the sense of unease. Guests, both business and leisure, find themselves caught in a web of intrigue, unaware of the secrets that lurk just beyond the polished marble floors.",
      "As the storm clouds gather outside, the hotel’s atmosphere shifts. The flickering lights cast dancing shadows across the walls, while the distant rumble of thunder mirrors the tension building among the guests. The scent of freshly caught fish wafts through the dining room, but it does little to mask the underlying currents of suspicion and fear. Here, in this seemingly idyllic retreat, danger lurks in every shadow, waiting for the perfect moment to reveal itself."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Oceanview Dining Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A large dining area with ocean views, adorned with Art Deco chandeliers and plush seating. Tables are set with fine china and crystal, overlooking the turbulent sea.",
      "sensoryDetails": {
        "sights": [
          "ocean waves crashing against rocks",
          "elegant chandeliers casting soft light",
          "fine china and silverware glinting",
          "dark wood paneling reflecting candlelight"
        ],
        "sounds": [
          "clinking of glasses",
          "distant thunder rumbling",
          "whispers of guests",
          "soft jazz playing from a radio"
        ],
        "smells": [
          "fresh seafood and herbs",
          "salt air mixing with damp wood",
          "candle wax melting",
          "old leather from the seating"
        ],
        "tactile": [
          "smooth marble tabletops",
          "plush velvet seats",
          "cool sea breeze from open windows",
          "slippery floor from spilled drinks"
        ]
      },
      "accessControl": "Access restricted to guests and staff; security checks at the entrance; staff-only areas behind the dining room.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops streaking the windows",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady patter of rain on glass",
            "soft murmurs of early diners"
          ],
          "smells": [
            "wet earth and salt",
            "freshly brewed coffee"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "empty tables waiting for patrons"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "the creak of old wood"
          ],
          "smells": [
            "beeswax from candle holders",
            "damp fabric from the upholstery"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering against the walls",
            "glimmers of silverware under soft light"
          ],
          "sounds": [
            "the tick of an antique clock",
            "laughter from nearby tables"
          ],
          "smells": [
            "smoky aroma from the kitchen",
            "freshly baked bread"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room is a vast expanse of elegance, where guests gather to enjoy the culinary delights while gazing at the tumultuous sea. The scent of fresh seafood wafts through the air, mingling with the saltiness of the ocean breeze that seeps through the open windows. Dark wood paneling frames the room, while chandeliers cast a warm glow, creating an illusion of safety amidst the brewing storm outside. But beneath the polished surface lies a tension that crackles in the air, as whispers of secrets and suspicions circulate among the diners.",
        "As the storm clouds gather, the atmosphere shifts. The sound of rain begins to drum against the windows, drowning out the soft jazz that plays in the background. Guests glance nervously at each other, their conversations hushed as they sense the unease. The flickering candlelight casts eerie shadows on the walls, creating an unsettling ambiance that heightens the sense of danger. Here, in this seemingly idyllic setting, the threat of deceit looms large, waiting to engulf those unsuspecting souls."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious lobby with high ceilings, adorned with intricate Art Deco patterns, and a grand staircase leading to the upper floors.",
      "sensoryDetails": {
        "sights": [
          "intricate geometric patterns on walls",
          "large windows letting in muted light",
          "grand staircase with a polished banister",
          "vintage newspaper clippings in display cases"
        ],
        "sounds": [
          "footsteps echoing on marble",
          "soft conversations of guests",
          "the distant hum of a radio",
          "the rustle of newspapers"
        ],
        "smells": [
          "freshly polished wood",
          "old paper and ink",
          "cigarette smoke lingering",
          "floral arrangements from the reception desk"
        ],
        "tactile": [
          "cool marble flooring",
          "soft fabric of armchairs",
          "smooth brass railings",
          "slippery surface from rain-soaked shoes"
        ]
      },
      "accessControl": "Open to all guests, monitored by hotel staff; restricted access to service areas behind the reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked floor glistening",
            "grey light filtering through windows"
          ],
          "sounds": [
            "dripping water from umbrellas",
            "muffled voices of guests"
          ],
          "smells": [
            "damp fabric from umbrellas",
            "fresh coffee brewing"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "faded colors in the upholstery"
          ],
          "sounds": [
            "the creak of old furniture",
            "soft rustling of newspapers"
          ],
          "smells": [
            "dust motes in the air",
            "old leather from chairs"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft glow of lamps illuminating the space",
            "guests mingling near the reception"
          ],
          "sounds": [
            "laughter and chatter",
            "the ticking of a clock"
          ],
          "smells": [
            "fresh flowers from the reception",
            "cooked meals wafting from the kitchen"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Oceanview Hotel welcomes guests with its soaring ceilings and intricate Art Deco designs. The polished marble floor gleams underfoot, reflecting the muted light filtering through large windows. A grand staircase spirals upward, inviting guests to explore the upper floors. The air is thick with the scents of old leather and fresh flowers, a blend of luxury and history. Guests gather here, exchanging pleasantries, while the distant hum of a radio fills the space with the latest news, a reminder of the world beyond these walls.",
        "As the day progresses, the atmosphere in the lobby shifts. The sound of rain pattering against the windows becomes a constant backdrop, mingling with the soft conversations of guests. Shadows lengthen as the light fades, and the scent of damp fabric hangs in the air. The once vibrant colors of the lobby seem to dull, reflecting the unease that settles among the guests. Here, in this open space, secrets are whispered and alliances formed, setting the stage for the drama that is about to unfold."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A cozy room lined with bookshelves filled with leather-bound volumes, featuring a large fireplace and comfortable seating.",
      "sensoryDetails": {
        "sights": [
          "flickering firelight casting shadows",
          "plush armchairs in deep colors",
          "old globe resting on a mahogany table"
        ],
        "sounds": [
          "crackling fire",
          "pages turning in silence",
          "distant thunder rumbling",
          "soft ticking of a clock"
        ],
        "smells": [
          "old leather and paper",
          "smoky aroma from the fireplace",
          "dust motes floating in the air",
          "freshly brewed tea"
        ],
        "tactile": [
          "worn leather armchair",
          "smooth surface of the globe",
          "soft wool blanket draped over a chair",
          "cool stone hearth"
        ]
      },
      "accessControl": "Restricted to guests with permission; often locked; staff only access during cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain trickling down the window panes",
            "grey light illuminating the room"
          ],
          "sounds": [
            "steady patter of rain",
            "soft whispers of guests"
          ],
          "smells": [
            "damp earth outside",
            "freshly brewed tea"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through curtains",
            "shadows creeping along the bookshelves"
          ],
          "sounds": [
            "silence broken by soft rustling",
            "the creak of old wood"
          ],
          "smells": [
            "beeswax from candles",
            "dust clinging to the air"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight dancing on the walls",
            "golden light from lamps"
          ],
          "sounds": [
            "the crackle of the fire",
            "the distant sound of laughter from the dining room"
          ],
          "smells": [
            "smoky aroma from the fireplace",
            "rich scent of old books"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library of The Oceanview Hotel is a sanctuary of knowledge and secrets, with walls lined by shelves filled with leather-bound tomes. A large fireplace crackles invitingly, casting flickering shadows that dance across the room. The scent of old leather and paper mingles in the air, creating an atmosphere of nostalgia and tension. Guests often retreat here to escape the bustle of the hotel, but the hushed whispers and furtive glances reveal that not all is as serene as it seems. Clues may lie hidden among the pages, waiting to be uncovered.",
        "As dusk settles, the library transforms into a haven of intrigue. The firelight creates a warm glow, contrasting with the growing darkness outside. The distant sound of thunder rumbles, echoing the tension building within the hotel. Dust motes float lazily in the air, illuminated by the flickering flames, as guests delve into their reading, unaware that danger lurks just beyond the door. Here, in this quiet refuge, the atmosphere thickens with anticipation, and the hunt for truth begins."
      ]
    },
    {
      "id": "service_area",
      "name": "The Service Corridor",
      "type": "interior",
      "purpose": "Access to staff-only areas",
      "visualDetails": "A narrow, dimly lit corridor lined with doors leading to staff rooms and service elevators.",
      "sensoryDetails": {
        "sights": [
          "flickering overhead lights",
          "narrow passageways leading off",
          "doors with brass handles",
          "old service call buttons"
        ],
        "sounds": [
          "soft footsteps echoing",
          "muffled conversations from behind doors",
          "the hum of machinery"
        ],
        "smells": [
          "cleaning supplies and dust",
          "faint aroma of food from the kitchen",
          "old wood and varnish"
        ],
        "tactile": [
          "cool metal of door handles",
          "rough texture of the walls",
          "smooth surface of the service buttons",
          "hard tile floor underfoot"
        ]
      },
      "accessControl": "Staff-only access, monitored by security; guest entry prohibited without permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets on the windows"
          ],
          "sounds": [
            "dripping water from umbrellas",
            "the distant sound of rain"
          ],
          "smells": [
            "dampness in the air",
            "cleaning supplies mixed with dust"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through small windows",
            "shadows lurking in corners"
          ],
          "sounds": [
            "the creak of old pipes",
            "soft rustling of uniforms"
          ],
          "smells": [
            "faint aroma of food",
            "old wood and varnish"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "lights casting long shadows",
            "the glow of service buttons illuminating the way"
          ],
          "sounds": [
            "soft murmurs of staff",
            "the distant clatter of dishes"
          ],
          "smells": [
            "the scent of cleaning supplies",
            "freshly prepared meals wafting"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Service Corridor runs like a vein through The Oceanview Hotel, hidden away from the guests and bustling with activity. Narrow and dimly lit, it serves as the lifeline for staff, who navigate its passageways with purpose. Flickering overhead lights cast eerie shadows, while the faint hum of machinery adds to the atmosphere of urgency. The air is thick with the scent of cleaning supplies and old wood, a stark contrast to the elegance of the guest areas. Here, secrets are exchanged behind closed doors, and the undercurrents of tension are palpable.",
        "As the day wears on, the corridor seems to darken, shadows creeping along the walls as the sun sets outside. The muffled sounds of laughter and clinking dishes from the dining room drift in, but they feel worlds away from this hidden space. The scent of freshly prepared meals wafts through the air, but it does little to alleviate the oppressive feeling that lingers. In this confined space, the hotel staff carry the weight of their secrets, and the tension builds with every passing moment."
      ]
    }
  ],
  "note": "",
  "cost": 0.0024301150500000003,
  "durationMs": 34408
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1946,
    "month": "April",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "Overcast skies with frequent rain showers",
      "Cool breezes off the coast",
      "Intermittent bursts of sunshine"
    ],
    "daylight": "Daylight lingers into the evening, with sunset around 7:30 PM, creating a mix of dim light and shadows in the late hours.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel quiets down after dinner service.",
    "holidays": [
      "Easter Sunday (April 7, 1946)"
    ],
    "seasonalActivities": [
      "Spring cleaning and home renovations are common as families prepare for warmer weather.",
      "Garden planting begins as people start to enjoy their private outdoor spaces.",
      "Coastal walks are popular, with locals taking advantage of the improving weather."
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Single-breasted navy suit with wide lapels",
        "White dress shirt with a stiff collar",
        "Silk tie with geometric patterns"
      ],
      "casual": [
        "Lightweight linen trousers",
        "Cotton button-down shirt",
        "Leather loafers"
      ],
      "accessories": [
        "Fedoras with a stylish band",
        "Pocket watches",
        "Leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea-length dress with a cinched waist",
        "Short-sleeved bolero jacket",
        "Clutch purse"
      ],
      "casual": [
        "A-line skirt with a patterned blouse",
        "Cardigan sweaters",
        "Ballet flats"
      ],
      "accessories": [
        "String of pearls",
        "Wide-brimmed hats",
        "Silk scarves tied at the neck"
      ]
    },
    "trendsOfTheMoment": [
      "Pastel colors are popular for spring, especially in women's dresses",
      "Men's suits are tailored, emphasizing a sharp silhouette",
      "Women are beginning to adopt more practical clothing due to increased workforce participation"
    ],
    "socialExpectations": [
      "Men are expected to dress formally for evening outings",
      "Women are increasingly seen in the workforce but are still judged on appearance",
      "Social gatherings often revolve around home-cooked meals and tea parties"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Nuremberg Trials are underway as world leaders face accountability for war crimes.",
      "Tensions escalate in Europe as the Iron Curtain begins to descend, signaling the start of the Cold War.",
      "Labor strikes in Britain are causing unrest as the government struggles with post-war economic recovery."
    ],
    "politicalClimate": "The political climate is marked by uncertainty as the world grapples with the aftermath of World War II and begins to confront the realities of a divided Europe.",
    "economicConditions": "The economy is slowly recovering but facing challenges such as inflation and shortages of consumer goods.",
    "socialIssues": [
      "Rising unemployment among veterans returning from war",
      "Discussions around women's rights and roles post-war",
      "Ongoing racial segregation and civil rights movements gaining traction"
    ],
    "internationalNews": [
      "The United Nations is formed to promote international cooperation.",
      "The U.S. and the U.K. are navigating their roles in a new global order.",
      "Post-war reconstruction efforts in Europe are beginning to take shape."
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Don't Fence Me In' by Bing Crosby",
        "'The Boogie Woogie Bugle Boy' by The Andrews Sisters",
        "'Ain't That a Kick in the Head' by Dean Martin"
      ],
      "films": [
        "'The Best Years of Our Lives'",
        "'It's a Wonderful Life'",
        "'Gilda'"
      ],
      "theater": [
        "'Annie Get Your Gun'",
        "'The King and I'",
        "'The Glass Menagerie'"
      ],
      "radio": [
        "The Jack Benny Program",
        "Suspense",
        "The Lone Ranger"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'Animal Farm' by George Orwell",
        "'The Stranger' by Albert Camus"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Post-war literature reflecting societal changes",
        "Science fiction as a reflection of technological advancements"
      ]
    },
    "technology": {
      "recentInventions": [
        "Transistor radio",
        "First commercial television broadcasts",
        "Early computers like ENIAC"
      ],
      "commonDevices": [
        "Radio sets are a staple in homes",
        "Television sets are starting to appear in urban households",
        "Basic household appliances are becoming more common"
      ],
      "emergingTrends": [
        "Increased use of radar technology for both military and civilian applications",
        "The rise of consumer electronics as wartime innovations transition to peacetime use",
        "Advancements in forensics and crime scene investigation technologies"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "Cigarettes: one shilling",
        "Taxi across town: two shillings"
      ],
      "commonActivities": [
        "Families gather for Sunday dinners",
        "Women attend community events and volunteer opportunities",
        "Men frequent pubs after work for socialization"
      ],
      "socialRituals": [
        "Tea time is a daily ritual, often involving light snacks",
        "Evening strolls become popular as families unwind after dinner"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "A growing middle class emerges, striving for stability after the war",
      "Class distinctions remain significant, influencing social interactions"
    ],
    "gender": [
      "Women are increasingly visible in the workforce, but traditional gender roles persist",
      "There is a tension between the expectations of homemaking and the desire for professional opportunities",
      "Gender equality discussions are beginning to surface subtly in public discourse"
    ],
    "race": [
      "Racial segregation remains a contentious issue, particularly in the southern U.S.",
      "The war has prompted some reconsideration of race relations, but change is slow"
    ],
    "generalNorms": [
      "Conformity is valued in social settings, with a focus on family and community",
      "Anxiety about the future permeates society, leading to both resilience and fear"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain-soaked earth mingles with the salty breeze from the nearby coast, creating an olfactory tapestry that speaks to both renewal and uncertainty.",
    "The muted sounds of clinking glasses and hushed conversations fill the air, punctuated by the occasional burst of laughter, revealing a tension masked by the veneer of civility.",
    "As shadows lengthen in the dimly lit hotel lounge, the flicker of candlelight dances on the walls, echoing the flickering hopes and fears of a nation still grappling with the aftermath of war."
  ],
  "paragraphs": [
    "April 1946 heralds the arrival of spring along the coast, where overcast skies often yield to sporadic showers. The air is crisp, carrying the scent of rain-soaked earth, while the occasional burst of sunshine momentarily brightens the surroundings. In this atmosphere, the Hotel Coral stands as a refuge for weary travelers, its dimly lit lounges filled with the murmur of conversations and the clinking of glasses, creating a tension that mirrors the uncertainty of the post-war society. As daylight lingers into the evening, the hotel becomes a microcosm of a world emerging from the shadows of conflict, where every smile may conceal a deeper story, and every laugh might mask a lurking fear.",
    "Fashion trends in April 1946 reflect the duality of optimism and caution prevalent in society. Men don sharp, tailored suits, often in navy blue or charcoal, complemented by crisp white shirts and patterned ties, while women embrace the elegance of tea-length dresses adorned with pastel hues, cinched at the waist to accentuate their figures. Accessories like pearl necklaces and wide-brimmed hats complete their looks, with both genders adhering to an unspoken expectation to present themselves well in public. This emphasis on appearance is not merely superficial; it reflects a desire to reclaim normalcy in a time when the world feels anything but.",
    "Daily life in this period is shaped by the remnants of wartime experience, with families engaging in spring cleaning and garden planting as they prepare for the warmer months. The price of a loaf of bread sits at four pence, while social rituals such as tea time and evening strolls offer moments of connection amidst the backdrop of uncertainty. As men return from war, they find a society that is not only adjusting to their return but is also grappling with the changing roles of women, who have become an integral part of the workforce. The tension between tradition and progress is palpable, creating an undercurrent that fuels both conversations and conflicts in the vibrant yet anxious tapestry of post-war life."
  ],
  "note": "",
  "cost": 0.0012414534,
  "durationMs": 24630
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense gathering at a seaside hotel for a business conference brings together a diverse group of guests, all grappling with the societal shifts of post-WWII life while secrets and ambitions collide under the watchful eyes of the staff.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII has led to increased roles for women in the workforce, creating a complex dynamic among the upper class, business professionals, and hotel staff, all under the pressure of emerging Cold War tensions."
  },
  "setting": {
    "location": "A seaside hotel with Art Deco elements overlooking the ocean.",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain showers, typical of a coastal climate."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an optical method, where a mirror-and-lens reflection falsified a witness's sightline across the room."
}

### LOCKED_FACTS
[
  {
    "id": "mirror_angle",
    "value": "thirty degrees",
    "description": "The angle at which the mirror is positioned, creating the optical illusion."
  },
  {
    "id": "victim_height",
    "value": "five feet six inches",
    "description": "The height of the victim, which affects the reflection in the mirror."
  },
  {
    "id": "dining_table_length",
    "value": "ten feet",
    "description": "The length of the dining table that influences the distance of the attack from the witnesses."
  },
  {
    "id": "time_of_murder",
    "value": "a quarter past eight",
    "description": "The exact time when the murder occurred, as per the hotel clock."
  },
  {
    "id": "glass_distance",
    "value": "three feet",
    "description": "The distance of the glass from the point of attack, crucial for perception."
  },
  {
    "id": "lamp_brightness",
    "value": "fifty watts",
    "description": "The wattage of the lamp affecting shadow depth and clarity."
  },
  {
    "id": "hat_style",
    "value": "fedora",
    "description": "The type of hat that was part of the disguise."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 6,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 16,
    "optional": 1
  },
  "redHerringCount": 0,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "behavioral"
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
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_7",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "elimination"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_culprit_direct_sylvia_trent",
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
      "category": "behavioral"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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

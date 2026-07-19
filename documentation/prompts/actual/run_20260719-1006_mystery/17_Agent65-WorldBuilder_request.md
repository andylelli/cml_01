# Actual Prompt Record

- Run ID: `mystery-1784455595279`
- Project ID: ``
- Timestamp: `2026-07-19T10:10:11.383Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `fa2fe04a71c1dcc4`

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
    "title": "Masquerade of Authority",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Art Deco Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "disguise-related"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp and observant guest",
      "private_secret": "Has a background in criminal psychology",
      "motive_seed": "Curiosity about the murder",
      "motive_strength": "strong",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Solving the murder",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Professional",
      "relationships": [],
      "public_persona": "Respected doctor at the hotel",
      "private_secret": "Has a past connection with the victim",
      "motive_seed": "Personal grudge",
      "motive_strength": "moderate",
      "alibi_window": "7:00 PM - 8:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Medical equipment access"
      ],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority Figure",
      "relationships": [],
      "public_persona": "Retired naval officer",
      "private_secret": "Knows a secret about the victim",
      "motive_seed": "Protecting a reputation",
      "motive_strength": "weak",
      "alibi_window": "6:30 PM - 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel authority access"
      ],
      "behavioral_tells": [],
      "stakes": "Maintaining honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Socialite",
      "relationships": [],
      "public_persona": "Charming and well-liked guest",
      "private_secret": "Involved in a love triangle with the victim",
      "motive_seed": "Jealousy",
      "motive_strength": "strong",
      "alibi_window": "7:00 PM - 8:30 PM",
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
      "age_range": "20-30",
      "role_archetype": "Young Assistant",
      "relationships": [],
      "public_persona": "Eager and helpful hotel staff",
      "private_secret": "Has a crush on the victim",
      "motive_seed": "Unrequited love",
      "motive_strength": "weak",
      "alibi_window": "6:00 PM - 8:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel staff access"
      ],
      "behavioral_tells": [],
      "stakes": "Emotional stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Prominent businessman",
      "private_secret": "Involved in illicit dealings",
      "motive_seed": "Potential blackmail",
      "motive_strength": "unknown",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Life",
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
      "summary": "During a masquerade ball at a grand seaside hotel, Hugo Vane is found strangled in his room. Detective Eleanor Voss uncovers a web of deception where identities were masked to obscure the truth, leading her to the real killer."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on disguise, murder, and witness to expose the false timing.",
      "delivery_path": [
        {
          "step": "Dr. Finch wore Hugo's distinctive scarf to mislead witnesses."
        },
        {
          "step": "Finch used a wig and makeup to resemble Hugo."
        },
        {
          "step": "Finch ensured that the clock was tampered with to distort the time of death."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor reveals that Dr. Finch exploited the authority of her position to manipulate the investigation."
    }
  },
  "false_assumption": {
    "statement": "Dr. Finch could not have committed the murder because she was seen treating guests during the time of death.",
    "type": "authority",
    "why_it_seems_reasonable": "As a respected doctor, her presence at the scene seemed credible.",
    "what_it_hides": "Her ability to manipulate her authority to create a false alibi."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "He was seen arguing with Hugo earlier in the evening.",
      "He had a motive due to protecting his reputation."
    ],
    "the_one_flaw": "His alibi is confirmed by the hotel staff records showing he was in the lobby at the time of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A witness claims to have seen Captain Hale near the victim's room just before the murder.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was delivering a message from the hotel staff, which he later confirms.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Dr. Finch's previous intimate relationship with Hugo is uncovered.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "Their relationship ended on good terms, and there is no motive for killing him.",
      "resolved_in_chapter": 7
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
    "rationale": "All suspects were present at the hotel during the murder, and no outsiders were involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "6:30 PM",
        "8:30 PM"
      ],
      "windows": [
        "6:00 PM - 8:00 PM"
      ],
      "contradictions": [
        "Witnesses claim they saw Dr. Finch treating guests while the murder occurred."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Hugo Vane"
      ],
      "objects": [
        "Hugo's scarf",
        "the clock"
      ],
      "permissions": [
        "Medical privileges"
      ]
    },
    "physical": {
      "laws": [
        "Disguise manipulation allows for two identities in public"
      ],
      "traces": [
        "Clock tampering evidence",
        "Fibers from the scarf"
      ]
    },
    "social": {
      "trust_channels": [
        "Authority of doctor"
      ],
      "authority_sources": [
        "Dr. Finch's medical credentials"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses describe seeing a man resembling Hugo arguing with a woman near the dining area.",
        "correction": "The argument suggests that the man was not actually Hugo, as he was already killed.",
        "effect": "Eliminates Hugo Vane as the perpetrator.",
        "required_evidence": [
          "Eyewitness accounts from the dining area.",
          "Hugo's body found in his room."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock in Hugo's room shows the time as quarter past nine, but the murder was reported at seven.",
        "correction": "The clock was tampered with to create a false timeline for the murder.",
        "effect": "Narrows the time of death to around seven o'clock.",
        "required_evidence": [
          "Witness report of the clock's time.",
          "Physical evidence of tampering on the clock."
        ],
        "reader_observable": true
      },
      {
        "observation": "A distinctive scarf belonging to Hugo is found at the scene of the crime.",
        "correction": "The scarf indicates someone disguised as Hugo was present.",
        "effect": "Narrows the suspect pool to those with access to the scarf.",
        "required_evidence": [
          "The scarf's fibers matching those of Dr. Finch.",
          "Witnesses recalling Hugo wearing the scarf earlier."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the wear on Hugo's scarf with Dr. Finch's clothing reveals a match, proving she used it to impersonate him.",
    "knowledge_revealed": "The fibers match Dr. Finch's clothing, confirming her presence at the crime scene.",
    "pass_condition": "If the fibers from the scarf match Dr. Finch's clothing, it proves her guilt.",
    "evidence_clues": [
      "clue_11",
      "clue_5",
      "clue_6",
      "clue_parity_bridge"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness accounts of the argument reveal the presence of the impersonator. Step 2: The clock's tampering demonstrates the false timeline. Step 3: The scarf's presence ties Dr. Finch to the scene."
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
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi by hotel staff records.",
        "supporting_clues": [
          "witness statements",
          "staff logs"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No evidence connecting her to the crime.",
        "supporting_clues": [
          "guest logs",
          "witness accounts"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed she was in the lobby when the murder occurred.",
        "supporting_clues": [
          "staff records",
          "time logs"
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: None",
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
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_parity_bridge",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Witness statement"
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
        "clue_id": "clue_9",
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
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct evidence comparison"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Eyewitness account"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a charismatic traveling journalist with a sharp wit, determined to redeem herself in a world that nearly cast her aside.",
    "publicPersona": "Eleanor is known for her engaging articles that captivate readers, often infused with her insightful commentary on society and human nature.",
    "privateSecret": "Haunted by a past scandal involving a fabricated story, Eleanor is desperate to prove that she is more than her mistakes.",
    "motiveSeed": "inheritance",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the lobby interviewing guests prior to the discovery of the crime.",
    "accessPlausibility": "easy",
    "stakes": "Eleanor's personal redemption and professional reputation rest on her ability to uncover the truth behind the crime.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a fluidity that reflects her experience as a journalist, often punctuating her sentences with dry humor or rhetorical questions.",
    "signatureTic": "Well, isn't that just delightful?",
    "internalConflict": "Eleanor grapples with the fear that her past will define her future, pushing her to work harder to avoid the same mistakes.",
    "personalStakeInCase": "This crime matters to Eleanor as it represents her chance to reclaim her credibility and prove herself worthy of her profession.",
    "paragraphs": [
      "Eleanor Voss strode through the Art Deco lobby of the seaside hotel, the scent of saltwater mingling with the rich aroma of freshly brewed coffee. Her sharp eyes darted between the guests, taking in their expressions, their movements, the subtle telltale signs that could unravel the mystery before her. Known for her engaging articles, Eleanor had always possessed an uncanny ability to read people—a trait that had served her well in both journalism and the pursuit of truth. Yet, beneath that charming exterior lay a woman haunted by a scandal that nearly ruined her career. She was determined to prove she was more than a mere footnote in the annals of journalism.",
      "As she interviewed guests in the lobby, Eleanor's mind was a whirlwind of thoughts. The victim, Hugo Vane, had once been a source of intriguing stories, and now his lifeless body lay somewhere within the walls of the hotel. This was her opportunity—not just to solve a mystery, but to reclaim her place in a world that had deemed her unworthy. Yet, as her heart raced with the thrill of the chase, a nagging doubt crept in: could she truly be trusted to uncover the truth, given her past?",
      "Eleanor's wit often shielded her vulnerabilities, but tonight, it felt like a double-edged sword. 'Well, isn't that just delightful?' she quipped to a guest who seemed more interested in gossip than the tragedy at hand. The dry humor masked her anxiety, a defense mechanism honed over years of navigating the male-dominated world of journalism. Yet, deep down, she feared that her past would rear its ugly head, threatening to overshadow her efforts. Each interaction with the guests felt like a high-stakes game, where one misstep could lead to her downfall.",
      "As she delved deeper into the investigation, Eleanor found herself surrounded by a cast of characters—each with their own secrets and motives, each a potential suspect. The thrill of the hunt invigorated her, but the stakes were personal. This was not just about solving a crime; it was about redemption. With each clue she unearthed, Eleanor felt the weight of her past pressing down on her, urging her to succeed where she had once failed. She was determined to prove that she could stand tall, even in the shadows of her mistakes."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected physician with progressive ideas, Dr. Mallory Finch harbors a dangerous vendetta against the victim that could threaten her career.",
    "publicPersona": "Dr. Finch is revered in her field, known for her forward-thinking practices and strong advocacy for women's health.",
    "privateSecret": "Beneath her polished exterior lies a simmering resentment stemming from a financial dispute with the victim that has festered over time.",
    "motiveSeed": "Had hoped to expose corruption in the medical board, which the victim threatened to reveal publicly.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in her room reviewing patient records between 7 PM and 9 PM.",
    "accessPlausibility": "possible",
    "stakes": "Dr. Finch's professional credibility and personal desire for revenge hang in the balance as the investigation unfolds.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with a measured tone, her words carefully chosen, often laced with a biting sarcasm that betrays her true feelings.",
    "signatureTic": "Ah, the joys of modern medicine.",
    "internalConflict": "Dr. Finch wrestles with the ethical implications of her ambitions, as her desire for revenge clashes with her professional integrity.",
    "personalStakeInCase": "The stakes are high for Dr. Finch, as the investigation could expose not only her vendetta but also her professional reputation.",
    "paragraphs": [
      "Dr. Mallory Finch surveyed the elegant surroundings of the seaside hotel, her mind racing with thoughts not of relaxation, but of retribution. A well-respected physician, she had dedicated her career to advancing women's health, yet the shadow of a past financial dispute with the victim loomed large. Hugo Vane had threatened to expose her—an act that could unravel everything she had built. 'Ah, the joys of modern medicine,' she remarked dryly to a fellow guest, masking her turmoil with a veneer of professionalism.",
      "In the quiet confines of her room, Dr. Finch had claimed to be reviewing patient records, but her thoughts were consumed by the bitterness that had festered since the dispute. The victim's influence had stifled her aspirations, and now, with his demise, she felt a twisted sense of liberation. Yet, the question remained: how far was she willing to go to protect her own interests? The prospect of losing everything she had worked for gnawed at her conscience, making every decision feel like a treacherous gamble.",
      "As the investigation unfolded, Dr. Finch found herself caught in a web of deceit, surrounded by suspects who each held a piece of the puzzle. The tension in the air was palpable, and she could feel the weight of scrutiny upon her. Her sardonic humor often served as a shield, but deep down, she was acutely aware of the fragile line she walked between ambition and ethics. The thought of her vendetta becoming public knowledge sent a chill down her spine; she had to stay one step ahead, or risk losing everything.",
      "The stakes had never been higher, and as she navigated the treacherous waters of the investigation, Dr. Finch faced a reckoning. Each encounter with potential suspects forced her to confront her own motivations, and the ethical implications of her actions loomed like a dark cloud overhead. Would she allow her desire for revenge to consume her, or could she find a way to reconcile her ambition with the integrity she once held dear?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer, Captain Ivor Hale is a well-respected figure with a charming facade, concealing connections to a covert operation that could ruin him.",
    "publicPersona": "Known for his war stories and charm, Ivor is a pillar of the community, often sought after for his wisdom and experience.",
    "privateSecret": "He hides a dark secret regarding a covert operation that could destroy his reputation if exposed.",
    "motiveSeed": "Feared exposure of his wartime dealings would ruin his reputation in the town.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was seen in the bar conversing with guests from 8 PM to 9 PM.",
    "accessPlausibility": "easy",
    "stakes": "Maintaining his status and avoiding public disgrace are paramount as the investigation unfolds.",
    "humourStyle": "observational",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a warm, authoritative tone, often punctuating conversations with anecdotes from his naval past.",
    "signatureTic": "In my experience, one must always be prepared.",
    "internalConflict": "Captain Hale struggles with the ghosts of his past, torn between his public persona and the secrets he must keep hidden.",
    "personalStakeInCase": "This crime matters to Captain Hale as the potential exposure of his covert dealings could shatter his carefully constructed life.",
    "paragraphs": [
      "Captain Ivor Hale stood at the bar of the hotel, his presence commanding respect and admiration from the guests around him. With a twinkle in his eye, he regaled them with tales of his naval exploits, weaving narratives that captivated his audience. Yet beneath that charming exterior lay a man grappling with a dark secret—one that, if revealed, could tarnish his reputation and legacy. 'In my experience, one must always be prepared,' he often advised, a mantra that resonated deeply with him as he navigated the complexities of his own life.",
      "The investigation into Hugo Vane's death cast a shadow over Ivor's carefully curated world. He had been seen conversing with guests just before the crime was discovered, and the whispers of suspicion began to swirl around him. The fear of exposure gnawed at his conscience; the covert operations he had been involved in during the war were not just distant memories but potential catalysts for public disgrace. Each laugh and smile he offered felt like a façade, a mask he wore to hide the turmoil within.",
      "As the evening wore on, Ivor found himself navigating a minefield of secrets and lies. The other suspects were not just players in a game; they were reflections of his own struggles, each with their hidden motives. The camaraderie he had forged with the community felt like a fragile thread, one that could snap at any moment if the truth came to light. He observed the interactions around him with a keen eye, noting the subtle shifts in demeanor that spoke volumes, all while wrestling with his own internal conflict.",
      "The stakes had never been higher for Captain Hale, and as he faced the possibility of his past catching up with him, he was forced to confront the consequences of his actions. Would he be able to maintain his status in the community, or would the truth of his wartime dealings unravel the life he had built? The weight of his secrets pressed heavily on his shoulders, and as the investigation unfolded, Ivor realized that the time for reckoning was drawing near."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An aspiring artist, Beatrice Quill is quirky and vibrant, yet beneath her eccentric exterior lies a simmering resentment toward the victim.",
    "publicPersona": "Beatrice is known for her bold and controversial artwork, often drawing attention for her unique perspective on life.",
    "privateSecret": "She harbors a deep-seated resentment towards the victim, who rejected her art for a prestigious exhibit.",
    "motiveSeed": "Believed the victim’s influence kept her from receiving the recognition she deserved in the art world.",
    "motiveStrength": "weak",
    "alibiWindow": "Claimed to be sketching in the garden from 6 PM to 8 PM.",
    "accessPlausibility": "unlikely",
    "stakes": "Her desire for validation and a place in the art community fuels her actions as she navigates the investigation.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a whimsical tone, often punctuated by bursts of enthusiasm and a tendency to ramble when excited.",
    "signatureTic": "What can I say? I'm a tortured artist.",
    "internalConflict": "Beatrice struggles with her insecurities, grappling with the fear that her art may never be truly appreciated.",
    "personalStakeInCase": "This crime matters to Beatrice as it represents her chance to confront her feelings of inadequacy and the impact of rejection on her life and art.",
    "paragraphs": [
      "Beatrice Quill flitted through the vibrant garden of the hotel, her sketchbook clutched tightly to her chest like a talisman. As an aspiring artist, she thrived on inspiration, capturing the world around her with bold strokes and vibrant colors. Yet, beneath her eccentric exterior lay a simmering resentment toward the victim, Hugo Vane, whose rejection of her art for a prestigious exhibit had left a bitter taste in her mouth. 'What can I say? I'm a tortured artist,' she often joked, masking her vulnerabilities with humor.",
      "Claiming to have been sketching in the garden during the time of the crime, Beatrice felt the weight of her alibi pressing down on her. The thought of being a suspect in the investigation both thrilled and terrified her. Her quirky demeanor often drew attention, yet she feared it obscured the depth of her talent. The rejection she faced in the art world had left her feeling like a shadow, and now, with the victim's demise, she saw an opportunity to confront her insecurities head-on.",
      "As the investigation unfolded, Beatrice found herself drawn into a whirlwind of intrigue and suspicion. Her fellow suspects were not just figures in a drama; they were reflections of her own struggles, each carrying their own burdens. The self-deprecating humor she wielded as a shield often fell flat in the face of genuine concern from others. 'Oh, darling, I'm just here for the chaos,' she quipped, attempting to deflect the gravity of the situation, but deep down, she felt the weight of her unfulfilled aspirations pressing heavily upon her.",
      "The stakes had never felt higher for Beatrice, as she grappled with the desire for validation and recognition in a world that often overlooked her. With each passing moment, the investigation became more than just a mystery; it was a chance for her to confront the shadows of rejection and the insecurities that had haunted her. Would she find the courage to embrace her art and her identity, or would she remain forever trapped in the shadows of doubt?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a charming socialite whose extravagant lifestyle conceals a web of deceit and hidden debts, threatening to unravel her social standing.",
    "publicPersona": "Known for her lavish soirées and charming demeanor, Sylvia is the life of the party and a respected figure in high society.",
    "privateSecret": "She maintains hidden debts due to her extravagant spending, which the victim was about to expose.",
    "motiveSeed": "Worried the victim would expose her financial troubles, which would ruin her social standing.",
    "motiveStrength": "weak",
    "alibiWindow": "Was seen hosting a gathering in the dining area from 7 PM to 9 PM.",
    "accessPlausibility": "possible",
    "stakes": "Maintaining her social status and avoiding bankruptcy are paramount as the investigation unfolds.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Sylvia speaks with an air of sophistication, often using elegant language and subtle jabs hidden within compliments.",
    "signatureTic": "Oh darling, don't be such a bore.",
    "internalConflict": "Sylvia struggles with the fear of losing her social status and the façade she has built, torn between ambition and honesty.",
    "personalStakeInCase": "The stakes are high for Sylvia, as the investigation could expose her financial troubles and threaten her social standing.",
    "paragraphs": [
      "Sylvia Trent glided through the dining area, exuding charm and grace as she hosted yet another lavish soirée. Her laughter rang out like music, captivating the guests who surrounded her. Known for her impeccable taste and social prowess, Sylvia was the epitome of high society. Yet, beneath the polished façade lay a tangled web of deceit. Hidden debts threatened to unravel her carefully constructed life, and the victim, Hugo Vane, was poised to expose the truth. 'Oh darling, don't be such a bore,' she quipped to a guest, masking her anxiety with a veneer of charm.",
      "As the evening progressed, Sylvia's mind raced with thoughts of the investigation. She had been seen mingling with guests during the time of the crime, but the whispers of suspicion echoed in her mind. The fear of losing her social standing haunted her; the prospect of bankruptcy loomed like a dark cloud. Her polite savagery often allowed her to navigate conversations with ease, but now, every interaction felt like a precarious dance on the edge of a cliff.",
      "The stakes had never felt higher, and as the investigation unfolded, Sylvia found herself trapped between ambition and honesty. The allure of high society came with a price, and she was well aware that her reputation hung by a thread. With each passing moment, the pressure mounted, forcing her to confront the consequences of her actions. 'What a tangled web we weave, darling,' she mused to herself, reflecting on the delicate balance she must maintain to keep her life intact.",
      "In the midst of the chaos, Sylvia realized that she could no longer hide behind her charm. The investigation offered her a chance to reevaluate her priorities and the cost of her deceit. Would she continue to play the role of the perfect socialite, or would she find the courage to confront her hidden truths? The answers lay within the murky depths of the investigation, and Sylvia was determined to navigate the treacherous waters that lay ahead."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Grand Oceania Hotel",
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "An opulent Art Deco hotel overlooking the turbulent sea, serving as a hub for intrigue and hidden agendas.",
    "visualDescription": "A sweeping facade of geometric patterns and polished chrome, with expansive glass windows framing the stormy ocean. The lobby features a grand staircase, plush velvet furnishings, and a stunning chandelier that casts soft shadows.",
    "atmosphere": "A sense of grandeur tinged with unease, where the beauty of the surroundings contrasts with the weight of unspoken secrets.",
    "paragraphs": [
      "The Grand Oceania Hotel stands as a sentinel against the crashing waves of the English Channel, its Art Deco design both captivating and imposing. The lobby, with its high ceilings and intricate details, echoes the glamour of a bygone era. Yet, beneath the surface, an air of tension lingers, amplified by the muffled sounds of distant thunder and the occasional crackle of a radio broadcasting news from a world still reeling from war.",
      "Guests bustle about, their laughter muted by the oppressive atmosphere that seems to hang in the air like a storm cloud. The scent of damp sea air mixes with the rich aroma of freshly brewed coffee from the dining area, where patrons gather to discuss matters both trivial and pressing. The large windows frame the tumultuous sea, its waves crashing against the shore as if echoing the turmoil within the hotel itself.",
      "As evening descends, the hotel transforms. The flickering candlelight casts dancing shadows along the polished floors, creating an intimate yet unsettling ambiance. In the corners, whispers of clandestine meetings float through the air, and the guests' masks of civility barely conceal their true intentions. The ocean's roar outside becomes a haunting reminder of the isolation that envelops them, as the rain begins to patter against the glass, sealing them within their secrets."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of coastal climates in the fall.",
    "timeFlow": "Days of mounting tension as secrets unravel and trust erodes.",
    "mood": "Tense and suspenseful, with an undercurrent of uncertainty and paranoia due to recent wartime experiences.",
    "eraMarkers": [
      "Ubiquitous radio broadcasts in the lobby",
      "Early television sets in guest rooms",
      "Military-grade radar equipment in the basement"
    ],
    "sensoryPalette": {
      "dominant": "The salty tang of the ocean mixed with the scent of damp wood",
      "secondary": [
        "The clinking of glassware and hushed conversations",
        "The distant crash of waves against the cliffs"
      ]
    },
    "paragraphs": [
      "A sense of anticipation fills the air as guests navigate the narrow hallways, the polished floors reflecting their hurried steps. The hotel, with its grand architecture, feels both inviting and foreboding, each corner a potential hiding place for secrets. The distant sound of waves crashing against the rocks below serves as a constant reminder of the isolation that surrounds this seaside haven.",
      "As night falls, the atmosphere thickens with intrigue. The flickering lights and muted conversations create an almost conspiratorial mood, where every glance carries weight and every whisper could be a revelation. The hotel becomes a microcosm of post-war society, where the scars of conflict linger just below the surface, and the promise of a new beginning is overshadowed by the shadows of the past."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Hotel Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Expansive space with high ceilings, ornate chandeliers, and plush seating areas.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "grand staircase with polished bannister",
          "vibrant floral arrangements",
          "glinting brass fixtures"
        ],
        "sounds": [
          "murmurs of conversation",
          "clinking of glassware",
          "distant radio broadcasts",
          "the rustle of newspapers"
        ],
        "smells": [
          "freshly brewed coffee",
          "polished wood and leather",
          "damp sea air",
          "subtle perfume"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft velvet upholstery",
          "cool brass fixtures",
          "warmth from the fireplace"
        ]
      },
      "accessControl": "Guests and staff access during the day; restricted access to staff-only areas after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on windowpanes",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady rain against glass",
            "soft footsteps on carpet"
          ],
          "smells": [
            "damp earth",
            "freshly brewed tea",
            "wet stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "empty chairs waiting for guests"
          ],
          "sounds": [
            "the ticking of a distant clock",
            "the hum of conversation fading"
          ],
          "smells": [
            "old books and leather",
            "dusty air",
            "wood smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candles flickering on tables",
            "soft glow of lamps"
          ],
          "sounds": [
            "laughter rising from the dining area",
            "the tick of a mantel clock"
          ],
          "smells": [
            "candle wax",
            "cooked seafood",
            "fresh bread"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The lobby of the Grand Oceania Hotel is a breathtaking sight, with its towering ceilings adorned with intricate plasterwork and glimmering chandeliers that catch the light just so. Guests often pause to admire the sweeping staircase that leads to the upper floors, its polished bannister glistening under the soft glow of the lights. Plush seating areas invite conversation, though the air is thick with unspoken tension, as if the very walls are privy to the secrets being exchanged.",
        "As night descends, the atmosphere shifts. The lobby, once bustling with energy, becomes a stage for hushed whispers and sidelong glances. The scent of freshly brewed coffee mingles with the salty tang of the ocean, creating an intoxicating blend that draws guests together while simultaneously forcing them apart. In this grand yet intimate space, the weight of the past hangs heavy, and the promise of a new beginning feels tantalizingly close yet painfully out of reach."
      ]
    },
    {
      "id": "dining_area",
      "name": "Dining Area",
      "type": "interior",
      "purpose": "Social gathering and dining",
      "visualDetails": "Lavishly decorated with art deco motifs, featuring large windows overlooking the sea.",
      "sensoryDetails": {
        "sights": [
          "elegantly set tables",
          "glimmering cutlery",
          "vibrant floral centerpieces",
          "stunning ocean views"
        ],
        "sounds": [
          "clinking of dishes",
          "soft piano music",
          "laughter and chatter",
          "the crash of waves outside"
        ],
        "smells": [
          "roasted meats and fresh herbs",
          "baked goods",
          "seafood and citrus",
          "warm bread"
        ],
        "tactile": [
          "cool glass surfaces",
          "smooth tablecloths",
          "soft leather chairs",
          "warmth of freshly baked bread"
        ]
      },
      "accessControl": "Open to guests during meal times; private events require prior reservation.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "cloudy skies through large windows",
            "puddles forming outside"
          ],
          "sounds": [
            "rain pattering against the windows",
            "soft murmurs of early risers"
          ],
          "smells": [
            "freshly baked pastries",
            "coffee brewing",
            "citrusy scents from fruit"
          ],
          "mood": "quiet reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim lighting casting shadows",
            "empty plates waiting to be cleared"
          ],
          "sounds": [
            "the soft rustle of napkins",
            "distant conversations fading"
          ],
          "smells": [
            "lingering aromas of lunch",
            "freshly washed linen",
            "wood smoke"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelit tables",
            "glittering chandeliers reflecting light"
          ],
          "sounds": [
            "soft laughter and clinking glasses",
            "the strumming of a guitar"
          ],
          "smells": [
            "rich wine and savory dishes",
            "sweet desserts",
            "fresh herbs"
          ],
          "mood": "celebratory warmth"
        }
      ],
      "paragraphs": [
        "The dining area of the Grand Oceania Hotel is a feast for the senses, with its elegant decor and breathtaking sea views. Large windows frame the tumultuous ocean, allowing the sound of waves to mingle with the clinking of cutlery and soft strains of piano music. Each table is meticulously set, with gleaming silverware and vibrant floral arrangements that add a touch of life to the otherwise somber atmosphere. Guests gather here not just to dine, but to share stories, secrets, and perhaps a few unspoken fears.",
        "As evening approaches, the dining area transforms into a haven of warmth and light. Candles flicker gently on each table, casting a golden glow over the room and enhancing the air of intimacy. The aroma of roasted meats and fresh herbs wafts through the space, enticing guests to indulge in the culinary delights being served. Yet, amidst the laughter and conversation, an undercurrent of tension persists, as if the very act of dining is a distraction from the truths lurking just beneath the surface."
      ]
    },
    {
      "id": "guest_rooms",
      "name": "Guest Rooms",
      "type": "interior",
      "purpose": "Private accommodations for guests",
      "visualDetails": "Tastefully decorated with period furniture, featuring large beds and en-suite bathrooms.",
      "sensoryDetails": {
        "sights": [
          "plush bedding and drapes",
          "art deco furnishings",
          "framed black-and-white photographs",
          "soft lighting from bedside lamps"
        ],
        "sounds": [
          "the distant sound of waves crashing",
          "soft rustling of fabric",
          "the ticking of a clock",
          "muffled conversations from the hallway"
        ],
        "smells": [
          "fresh linen and lavender",
          "polished wood",
          "soft perfume",
          "the faint scent of sea salt"
        ],
        "tactile": [
          "soft cotton sheets",
          "cool polished wood surfaces",
          "plush carpet underfoot",
          "smooth ceramic tiles in the bathroom"
        ]
      },
      "accessControl": "Access restricted to registered guests; staff must knock and announce themselves before entering.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through curtains",
            "water droplets on window glass"
          ],
          "sounds": [
            "rain pattering on the roof",
            "distant thunder"
          ],
          "smells": [
            "freshly brewed coffee",
            "wet earth",
            "faint floral notes"
          ],
          "mood": "cozy retreat"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dust motes dancing in the air"
          ],
          "sounds": [
            "the tick-tock of a clock",
            "soft whispers from the hallway"
          ],
          "smells": [
            "stale air",
            "the faint scent of cleaning products",
            "old books"
          ],
          "mood": "claustrophobic tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of bedside lamps",
            "twinkling stars visible through the window"
          ],
          "sounds": [
            "the soft hum of the ocean",
            "distant laughter from the dining area"
          ],
          "smells": [
            "scented candles",
            "fresh linen",
            "the salty breeze"
          ],
          "mood": "intimate serenity"
        }
      ],
      "paragraphs": [
        "The guest rooms of the Grand Oceania Hotel offer a sanctuary of comfort and style, each tastefully appointed with plush bedding and elegant furnishings. The decor, a nod to the Art Deco era, creates an inviting atmosphere that belies the tension outside. Soft lighting casts a warm glow, while framed photographs of the hotel's history line the walls, whispering tales of the past to those who take a moment to glance.",
        "As night falls, the rooms become havens of intimacy, where guests retreat from the world below. The sound of waves crashing against the shore creates a soothing backdrop, while the faint scent of lavender and fresh linen lingers in the air. Yet, within these walls, secrets simmer just beneath the surface, and the comfort of the surroundings cannot quite mask the uncertainty that hangs in the air."
      ]
    },
    {
      "id": "rooftop",
      "name": "Rooftop Terrace",
      "type": "exterior",
      "purpose": "Observation and relaxation space",
      "visualDetails": "A spacious terrace with panoramic views of the coastline and ocean, adorned with wrought iron furniture.",
      "sensoryDetails": {
        "sights": [
          "panoramic ocean views",
          "rolling clouds in the distance",
          "silhouetted figures against the sunset",
          "twinkling lights of the hotel below"
        ],
        "sounds": [
          "the wind rustling through the furniture",
          "distant seagulls calling",
          "the crash of waves below",
          "soft music from the dining area"
        ],
        "smells": [
          "salt air and sea breeze",
          "freshly cut grass",
          "wildflowers in bloom",
          "the faint scent of tobacco smoke"
        ],
        "tactile": [
          "cool metal of the railing",
          "soft cushions on wrought iron chairs",
          "rough texture of the stone floor",
          "gentle breeze against the skin"
        ]
      },
      "accessControl": "Open to all guests during daylight hours; locked at night for safety.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey skies obscuring the horizon",
            "water pooling on the terrace"
          ],
          "sounds": [
            "rain tapping against metal",
            "distant thunder"
          ],
          "smells": [
            "wet earth",
            "fresh rain",
            "the salty tang in the air"
          ],
          "mood": "isolated contemplation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "waves crashing against the rocks below"
          ],
          "sounds": [
            "wind howling softly",
            "the distant sound of conversations"
          ],
          "smells": [
            "the scent of damp wood",
            "seaweed from the shore",
            "the faint aroma of coffee"
          ],
          "mood": "reflective melancholy"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the sky",
            "stars beginning to twinkle"
          ],
          "sounds": [
            "the soft murmur of waves",
            "laughter from below"
          ],
          "smells": [
            "the sweet scent of blooming flowers",
            "fresh air",
            "the lingering aroma of dinner"
          ],
          "mood": "romantic serenity"
        }
      ],
      "paragraphs": [
        "The rooftop terrace of the Grand Oceania Hotel offers a breathtaking view of the coastline, where the vast ocean meets the sky in a seamless blend of colors. Wrought iron furniture is scattered about, inviting guests to sit and soak in the beauty of their surroundings. As the sun sets, the sky transforms into a canvas of oranges and purples, casting a warm glow over the terrace and creating an enchanting atmosphere that contrasts sharply with the tension inside the hotel.",
        "Yet, as night falls, the rooftop becomes a place of solitude for those seeking a moment of escape from the intrigue below. The sounds of the ocean mix with the soft rustle of the wind, creating a serene backdrop for whispered conversations and fleeting glances. In this elevated space, the weight of the world feels momentarily lifted, though the shadows of the past still linger, reminding guests that the peace of the evening is but a fragile illusion."
      ]
    }
  ],
  "note": "",
  "cost": 0.00228308025,
  "durationMs": 20696
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1949,
    "month": "September",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "fall",
    "month": "September",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool coastal breezes"
    ],
    "daylight": "Days are getting shorter; twilight descends early, around six o'clock in the evening.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded.",
    "holidays": [
      "Labor Day (first Monday of September)"
    ],
    "seasonalActivities": [
      "visiting local fairs showcasing autumn produce",
      "attending community harvest festivals",
      "enjoying evening strolls along the beach with warm jackets"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "dark wool suits with wide lapels",
        "crisp white dress shirts",
        "silk ties with geometric patterns"
      ],
      "casual": [
        "tweed jackets with elbow patches",
        "button-up shirts with rolled sleeves",
        "corduroy trousers"
      ],
      "accessories": [
        "fedora hats",
        "leather gloves",
        "pocket watches"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dresses with cinched waists",
        "matching bolero jackets",
        "string of pearls"
      ],
      "casual": [
        "tailored blouses with high collars",
        "A-line skirts with floral patterns",
        "cardigans in autumn colors"
      ],
      "accessories": [
        "felt hats adorned with ribbons",
        "silk scarves",
        "gloves reaching to the elbows"
      ]
    },
    "trendsOfTheMoment": [
      "New Look fashion introduced by Christian Dior",
      "increased use of bold colors in clothing",
      "popularity of tailored suits for women"
    ],
    "socialExpectations": [
      "men expected to wear hats outside",
      "women encouraged to maintain modesty in fashion",
      "social gatherings centered around the home and family"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "U.S. and Soviet Union tensions escalate with nuclear arms race",
      "Germany is in the midst of reconstruction post-war",
      "the start of the Korean War is looming"
    ],
    "politicalClimate": "The political atmosphere is charged with anxiety as the Cold War begins to take shape, with fears of communism spreading in Europe.",
    "economicConditions": "The economy is slowly recovering from wartime rationing, though inflation is becoming a concern.",
    "socialIssues": [
      "gender roles shifting as women enter the workforce",
      "racial segregation remains a contentious issue",
      "debate over labor rights intensifies"
    ],
    "internationalNews": [
      "Formation of NATO in April 1949",
      "discussions about the Marshall Plan for European recovery",
      "tensions in the Middle East following the creation of Israel"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Nature Boy' by Nat King Cole",
        "'Mule Train' by Frankie Laine",
        "'Aba Daba Honeymoon' by Debbie Reynolds and Carleton Carpenter"
      ],
      "films": [
        "'The Third Man'",
        "'All the King's Men'",
        "'On the Town'"
      ],
      "theater": [
        "'Death of a Salesman' by Arthur Miller",
        "'The Glass Menagerie' by Tennessee Williams"
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
        "'Fahrenheit 451' by Ray Bradbury",
        "'The Old Man and the Sea' by Ernest Hemingway"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "science fiction",
        "social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "jet engines for commercial aviation",
        "early computers like the ENIAC",
        "transistor radios starting to emerge"
      ],
      "commonDevices": [
        "wireless radios",
        "black-and-white television sets",
        "photographic film cameras"
      ],
      "emergingTrends": [
        "increased use of consumer electronics",
        "growing interest in backyard nuclear fallout shelters",
        "adoption of kitchen appliances like electric mixers"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: six pence",
        "Movie ticket: one shilling",
        "Pint of milk: four pence"
      ],
      "commonActivities": [
        "attending local fairs and community events",
        "family gatherings for Sunday dinner",
        "visiting parks for picnics and walks"
      ],
      "socialRituals": [
        "afternoon tea with friends",
        "evening card games among neighbors"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing mobility among the middle class",
      "persistent class divisions remain",
      "emphasis on respectability and propriety"
    ],
    "gender": [
      "women are beginning to assert independence through work",
      "traditional gender roles are still prevalent",
      "expectation for women to balance home and career"
    ],
    "race": [
      "racial tensions are high following the civil rights movement beginnings",
      "integration efforts are met with resistance in various areas",
      "increasing awareness of racial equality among younger generations"
    ],
    "generalNorms": [
      "emphasis on family values",
      "conformity to societal expectations is strong",
      "privacy and discretion are highly valued in social interactions"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of damp earth and decaying leaves, punctuated by the sharp aroma of brewing coffee from nearby cafés.",
    "Muted conversations echo in the hotel lobby as guests, clad in woolen coats, huddle together under low lighting, casting anxious glances at the rain-slicked streets outside.",
    "The distant sound of a radio plays a jazzy tune, creating an eerie contrast to the tension that hangs in the air, as people wait for news that might bring uncertainty."
  ],
  "paragraphs": [
    "As September 1949 unfolds, the coastal town is enveloped in a cloak of overcast skies and the occasional drizzle that brings a chill to the air. The days are growing shorter, with twilight creeping in by six o'clock, casting long shadows that seem to stretch with the uncertainty of the times. Local fairs celebrating the harvest season draw families together, yet an undercurrent of anxiety remains palpable, a remnant of the recent war that continues to shape daily lives. Conversations about the world beyond their town are filled with apprehension as the Cold War tensions simmer, leaving many to wonder what the future holds.",
    "In the realm of fashion, both men and women embrace the fresh trends coming out of Paris, with men favoring dark wool suits adorned with geometric ties and women donning elegant tea-length dresses cinched at the waist. Cardigans in rich autumn hues and tailored blouses for women reflect the season’s palette, while accessories like felt hats and silk scarves lend an air of sophistication. This attention to appearance is not merely for style but also a reflection of societal expectations, where propriety and respectability are paramount in a community still grappling with the scars of war.",
    "Daily life in this coastal town is marked by a blend of old rituals and new realities. Families gather for Sunday dinners, sharing stories and laughter over warm meals, while afternoon tea becomes a cherished moment for women to connect amidst shifting gender roles. The streets buzz with the sound of children playing, their laughter mingling with the sounds of radios broadcasting the latest news, as they navigate a world that feels both familiar and foreign. Prices for basic goods reflect the economic recovery, yet there is an underlying concern for the rising costs of living, a reminder that not all is well as they strive to piece their lives back together."
  ],
  "note": "",
  "cost": 0.00110497695,
  "durationMs": 17827
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A masquerade ball at a grand seaside hotel draws a diverse group of guests, each grappling with the societal shifts of post-war life while secrets and identities intertwine under the weight of suspicion.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has led to a reconfiguration of class dynamics, with women entering the workforce and societal norms shifting, creating tension among traditional roles and new opportunities."
  },
  "setting": {
    "location": "A grand, art deco seaside hotel with ocean views",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain, typical of coastal climates in the fall."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an impersonation method, where a masquerade of double identity — a disguise exploited to seem to be in two places — breaks the assumed alibi."
}

### LOCKED_FACTS
[
  {
    "id": "time_of_murder",
    "value": "ten minutes past eight",
    "description": "the exact time of the murder as per the hotel clock"
  },
  {
    "id": "witness_observation",
    "value": "twenty feet",
    "description": "the distance from the dining area where the two individuals were seen"
  },
  {
    "id": "scarf_length",
    "value": "six feet",
    "description": "the length of the scarf worn during the impersonation, later found at the scene"
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 18,
  "countsByPlacement": {
    "early": 5,
    "mid": 12,
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
      "category": "testimonial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "id": "clue_9",
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
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "id": "clue_parity_bridge",
      "placement": "early",
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

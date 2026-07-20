# Actual Prompt Record

- Run ID: `mystery-1784574136763`
- Project ID: ``
- Timestamp: `2026-07-20T19:07:06.301Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `457029d7aa439abd`

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
    "title": "The Masquerade of Authority",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Grand Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "seaside hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "impersonation"
    }
  },
  "death_method": "struck with a heavy object",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A respected investigator known for her sharp intellect.",
      "private_secret": "Struggles with the pressure of her career.",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Justice for the victim.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A well-respected physician at the hotel.",
      "private_secret": "Was involved in a controversial medical experiment.",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Her reputation was at stake.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "45-55",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A naval officer with connections at the hotel.",
      "private_secret": "Has a hidden rivalry with Dr. Finch.",
      "motive_seed": "Jealousy over professional recognition.",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining Room"
      ],
      "behavioral_tells": [],
      "stakes": "Maintaining his status.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "35-45",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A socialite and friend of Dr. Finch.",
      "private_secret": "Has a secret crush on Captain Hale.",
      "motive_seed": "Possibly wanting to protect Hale.",
      "motive_strength": "low",
      "alibi_window": "7:30 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Lobby"
      ],
      "behavioral_tells": [],
      "stakes": "Her social standing.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "25-35",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A hotel staff member with access to all areas.",
      "private_secret": "Knows more about the guests than she lets on.",
      "motive_seed": "Potentially protecting a secret.",
      "motive_strength": "low",
      "alibi_window": "8:15 PM to 9:15 PM",
      "access_plausibility": "very high",
      "opportunity_channels": [
        "Kitchen",
        "Dining Room"
      ],
      "behavioral_tells": [],
      "stakes": "Her job.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A wealthy guest at the hotel.",
      "private_secret": "Involved in illegal activities.",
      "motive_seed": "Prevent Dr. Finch from uncovering his past.",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining Room"
      ],
      "behavioral_tells": [],
      "stakes": "His freedom.",
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
      "summary": "During a lavish masquerade ball at a grand seaside hotel, Dr. Mallory Finch is found dead, struck by a heavy object. As Detective Eleanor Voss investigates, she uncovers a web of impersonation and authority manipulation, leading her to the true culprit."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on witness, report, and seeing to expose the false timing.",
      "delivery_path": [
        {
          "step": "Hugo Vane wore a similar naval costume to Captain Hale's during the masquerade."
        },
        {
          "step": "He strategically positioned himself to be seen entering and exiting the ballroom."
        },
        {
          "step": "The heavy object was moved to a spot where it could be easily struck down."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor Voss reveals Hugo's dual identity and the method of the murder."
    }
  },
  "false_assumption": {
    "statement": "Witnesses believed they saw Captain Hale enter and exit the ballroom shortly before the murder.",
    "type": "authority",
    "why_it_seems_reasonable": "Captain Hale holds a respected position, making witnesses more likely to trust their memories.",
    "what_it_hides": "The true identity of the murderer, Hugo Vane, who exploited Captain Hale's authority."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses recalled seeing Captain Hale shortly before the murder.",
      "Captain Hale had a motive due to jealousy over Dr. Finch's success."
    ],
    "the_one_flaw": "Captain Hale’s alibi is strengthened by concrete evidence of his whereabouts during the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses stated they overheard Captain Hale arguing with Dr. Finch.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The argument was unrelated to the murder and occurred days earlier.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Footprints leading away from the dining room were initially attributed to Captain Hale.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The footprints matched a common shoe type worn by hotel staff.",
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
    "rationale": "All suspects were present at the hotel during the murder and had opportunities."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "8:00 PM",
        "8:30 PM"
      ],
      "windows": [
        "8:00 PM to 9:00 PM"
      ],
      "contradictions": [
        "Witnesses claim Captain Hale was at the ball during the time of the murder, but he did not have time to leave and return."
      ]
    },
    "access": {
      "actors": [
        "Hugo Vane",
        "Captain Hale",
        "Sylvia Trent"
      ],
      "objects": [
        "Heavy object used in the murder",
        "Costume worn by Hugo Vane"
      ],
      "permissions": [
        "Staff access to all areas of the hotel"
      ]
    },
    "physical": {
      "laws": [
        "Two people cannot occupy the same space at the same time.",
        "An object must have a clear path to fall."
      ],
      "traces": [
        "Footprints leading from the dining room to the exit."
      ]
    },
    "social": {
      "trust_channels": [
        "Witness credibility based on authority figures."
      ],
      "authority_sources": [
        "Captain Hale's naval rank."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses report seeing Captain Hale at the ballroom entrance shortly before the murder.",
        "correction": "This suggests that Captain Hale had a presence near the time of the murder.",
        "effect": "Eliminates the possibility that Captain Hale was not at the hotel during the murder.",
        "required_evidence": [
          "Witness statements about Captain Hale's presence",
          "Time logs from the hotel showing Captain Hale's movements"
        ],
        "reader_observable": true
      },
      {
        "observation": "The heavy object used for the murder was positioned unusually close to the ballroom exit.",
        "correction": "This indicates someone with access to the ballroom could have set up the murder.",
        "effect": "Narrows the suspect pool to those who had access to the ballroom.",
        "required_evidence": [
          "Position of the heavy object",
          "Access records for the ballroom"
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints leading away from the dining room match a common shoe type.",
        "correction": "This suggests the footprints belong to a hotel staff member rather than Captain Hale.",
        "effect": "Eliminates Captain Ivor Hale as the murderer.",
        "required_evidence": [
          "Footprint analysis report",
          "Shoe type records for hotel staff"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares witness, presence, and report against the claimed timeline.",
    "knowledge_revealed": "Inconsistencies in witness statements show that they were misled by the impersonation.",
    "pass_condition": "Witness statements must align with evidence showing who truly was present.",
    "evidence_clues": [
      "clue_culprit_direct_1",
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_hugo_vane",
      "clue_id_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements (early) establish Captain Hale's supposed alibi while the heavy object's position (mid) confirms access. Step 2: Footprint analysis (mid) reveals the shoe type is common among staff, eliminating Hale. Step 3: The trap exposes inconsistencies in witness statements, confirming the authority manipulation."
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
      "test_type": ""
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Footprint analysis reveals the shoes are common among staff.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by other guests.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Access logs show she was in the kitchen at the time.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
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
        "clue_id": "clue_5",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_hugo_vane",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
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
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_id_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Physical evidence"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Behavioral observation"
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
        "clue_id": "clue_id_1",
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
    "summary": "Eleanor Voss is a traveling journalist with a knack for uncovering hidden stories, but her past romantic entanglements with influential men complicate her pursuit of truth.",
    "publicPersona": "Charming and inquisitive, always seeking the next big story.",
    "privateSecret": "Has a history of romantic entanglements with influential men for stories.",
    "motiveSeed": "Drawn to the hotel for a story on its history and the impact of war.",
    "motiveStrength": "moderate",
    "alibiWindow": "Present in the hotel lobby at the time of the murder.",
    "accessPlausibility": "easy",
    "stakes": "Her career could take off if she uncovers the truth behind the murder.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a fluidity that reflects her journalistic background, often punctuating her observations with dry quips and a self-aware smile, as if she’s always on the verge of penning her next headline.",
    "signatureTic": "Truth is a slippery fish, isn't it?",
    "internalConflict": "Eleanor grapples with the morality of her past relationships, fearing that her pursuit of stories may have cost her genuine connections.",
    "personalStakeInCase": "This crime matters deeply to Eleanor as it represents her chance to redeem herself and prove she can uncover the truth without the crutch of her past.",
    "paragraphs": [
      "Eleanor Voss stood in the grand lobby of the seaside hotel, the scent of saltwater mingling with the faint aroma of expensive perfume. Her eyes flickered over the guests, sharp as a hawk’s, ever in search of the next story that could propel her career into the stratosphere. Yet, beneath her charming exterior lay a tangled web of past romantic entanglements—affairs that had granted her access to influential circles but had left her heart, and her conscience, in disarray. She had danced with danger before, but never quite like this.",
      "As she observed the crowd, Eleanor’s mind raced with possibilities. The recent murder was a headline waiting to be written, and she was determined to be the one to write it. Yet, the stakes were higher than mere journalistic ambition; the shadows of her past whispered doubts into her ear. What if her connections were discovered? What if the truth she sought only led her deeper into a mire of scandal? Her heart thudded with the weight of her own history, a past that could unravel her present.",
      "Eleanor’s alibi was as solid as the ground beneath her feet; she had been present in the lobby, mingling with the guests, when the crime occurred. Access was easy, but she had no intention of becoming merely a witness. Her journalistic instincts kicked in, and she began to piece together the fragments of conversation and behavior that surrounded her. With each interaction, she felt the thrill of the chase, the intoxicating scent of a story that could make or break her.",
      "Yet, as she delved deeper, Eleanor found herself not just chasing a story, but confronting her own demons. The allure of the truth was strong, but so was the fear of what it might reveal about herself. Could she navigate the murky waters of deceit without succumbing to the very temptations that had once led her astray? In the heart of the grand hotel, amidst the whispers of the past and the shadows of the present, Eleanor Voss would have to decide: would she emerge as a champion of truth or fall victim to her own narrative?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician whose compassionate nature hides a dangerous secret: a clandestine affair that could destroy her career.",
    "publicPersona": "Respected doctor known for her compassion and dedication to the community.",
    "privateSecret": "Has been involved in a clandestine affair with the victim.",
    "motiveSeed": "Fears the victim may expose the affair and damage her professional reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been in her clinic treating a patient.",
    "accessPlausibility": "possible",
    "stakes": "Her career and reputation are on the line, risking her position in the community.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks with a calm and measured tone, her words carefully chosen, reflecting her medical training. There’s a palpable tension in her voice, a tightness that reveals her underlying anxiety.",
    "signatureTic": "I must prioritize my patients.",
    "internalConflict": "Dr. Finch is torn between her professional integrity and the desire to protect her secret, fearing that exposure could ruin her life’s work.",
    "personalStakeInCase": "For Dr. Finch, this crime is a personal nightmare; the potential exposure of her affair threatens not only her career but the trust her patients place in her.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her clinic, the sterile smell of antiseptic wrapping around her like a shroud. Her hands, steady and practiced, had saved countless lives, yet now they trembled at the thought of the recent murder. The victim was not just another person; she was a secret that could unravel Dr. Finch’s carefully constructed life. The affair they had shared, hidden beneath layers of professional decorum, now loomed like a specter, threatening to expose her to the harsh light of judgment.",
      "In public, Dr. Finch was the epitome of compassion, her dedication to her patients unwavering. Yet, the dichotomy of her existence gnawed at her insides. She had always prioritized her patients, but now, as she faced the potential fallout of her secret, she found herself questioning her own values. Had she crossed a line that could not be uncrossed? The thought of losing her reputation, her career, and her place in the community was unbearable.",
      "Her alibi was as solid as the walls of her clinic; she had been treating a patient at the time of the murder. Yet, the truth was a double-edged sword. While it could shield her from suspicion, it also served as a reminder of the life she had built on fragile foundations. Dr. Finch's mind raced with possibilities: if the affair were exposed, would her patients still trust her? Would her colleagues see her as the paragon of virtue she had always strived to be?",
      "As the investigation unfolded, Dr. Finch felt the walls closing in. The weight of her secret bore down on her, threatening to crush her under its enormity. The stakes had never been higher, and as she navigated the treacherous waters of suspicion, she knew she had to make a choice: to fight for her reputation or to confront the truth of her actions, no matter the cost. In the end, it was her integrity that would be tested, and she would have to decide what kind of doctor—and person—she truly wanted to be."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer battling the ghosts of his past, caught between honor and the threat of exposure from a murder investigation.",
    "publicPersona": "A dignified man with a strong sense of honor and duty.",
    "privateSecret": "Struggles with PTSD from his service and has hidden resentments towards modern society.",
    "motiveSeed": "Believes the victim intended to tarnish his reputation by exposing war-related secrets.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be taking a stroll on the beach at the time.",
    "accessPlausibility": "possible",
    "stakes": "His legacy and the honor of his service are at stake.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a gravitas that reflects his military background, often punctuating his sentences with self-deprecating humor that belies the weight of his experiences.",
    "signatureTic": "Honor is a fickle friend.",
    "internalConflict": "Captain Hale battles with the scars of his past, torn between his sense of duty and the fear that his reputation may be irreparably damaged.",
    "personalStakeInCase": "For Captain Hale, this murder is not just a crime; it threatens to dismantle the legacy he fought to uphold, forcing him to confront the darkness of his past.",
    "paragraphs": [
      "Captain Ivor Hale strode along the beach, the waves crashing against the shore like the memories of battles long past. A retired naval officer, he had once been a man of honor, revered by his peers. Now, he found himself entangled in a web of suspicion, his legacy hanging by a thread. The murder of the victim—a woman whose knowledge of his past threatened to tarnish the very reputation he had fought to uphold—had shaken him to his core. Honor, he mused, was indeed a fickle friend.",
      "As he walked, Hale’s mind wandered to the ghosts of his service, the faces of comrades lost etched into his memory. The weight of PTSD clung to him like a heavy cloak, distorting his perception of the world around him. Modern society, with its distractions and superficiality, grated against his sensibilities. He resented how easily people seemed to forget the sacrifices made for their freedoms, and the thought of being exposed for his own struggles filled him with dread.",
      "His alibi was a simple one; he had claimed to be taking a stroll on the beach at the time of the murder. Yet, as he considered the implications of that very act, he felt a pang of guilt. Had he been so lost in his thoughts that he had become a mere observer, blind to the dangers lurking in the shadows? The victim had threatened to expose secrets that could ruin him—secrets he had buried deep, but which now clawed their way back to the surface.",
      "In the days that followed, Hale found himself at a crossroads. He could either confront the truth of his past or allow fear to dictate his actions. The stakes were higher than ever, and as he grappled with his internal demons, he realized that this murder investigation was not just about clearing his name; it was about redefining his values and reclaiming his honor. In the depths of his struggle, Captain Hale would have to decide whether to stand firm against the tides of his past or surrender to the darkness that threatened to engulf him."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a glamorous socialite whose privileged life masks a desperate struggle with gambling debts and a compelling motive for murder.",
    "publicPersona": "A glamorous young woman who seems to have everything.",
    "privateSecret": "Deeply in debt due to gambling and keeping it hidden from her family.",
    "motiveSeed": "Stands to gain a vast inheritance if the victim, her wealthy aunt, is out of the way.",
    "motiveStrength": "compelling",
    "alibiWindow": "Was seen in the dining room moments before the murder.",
    "accessPlausibility": "easy",
    "stakes": "Her financial future and lifestyle depend on her aunt's death.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with an airy confidence, her words laced with a sardonic edge that reflects her privileged upbringing, often punctuated with dramatic flair.",
    "signatureTic": "What a tangled web we weave, darling.",
    "internalConflict": "Beatrice is torn between her desire for freedom and the guilt of betraying her family, fearing that her debts will ultimately consume her.",
    "personalStakeInCase": "For Beatrice, this crime represents not just an opportunity to escape her financial woes but a chance to break free from the suffocating expectations of her privileged life.",
    "paragraphs": [
      "Beatrice Quill floated through the dining room like a summer breeze, her laughter ringing out like a delicate chime. A socialite of the highest order, she wore her privilege like a crown, yet beneath the surface lay a tempest of desperation. Deeply in debt due to her gambling habits, Beatrice had become a master of deception, hiding her financial struggles from her family while dreaming of a life free from the constraints of her gilded cage. The recent murder of her wealthy aunt had stirred a dangerous cocktail of ambition and guilt within her.",
      "In the moments leading up to the murder, Beatrice had been seen mingling among the guests, her charm disarming and her presence commanding. Yet, as the whispers of her aunt's demise began to circulate, Beatrice felt the weight of her secrets bearing down on her. The prospect of inheriting her aunt’s fortune was tantalizing, but at what cost? The thought of betrayal gnawed at her conscience, and she found herself caught in a moral quandary that threatened to unravel the very fabric of her life.",
      "Her alibi was flimsy at best; she had been in the dining room moments before the murder, a fact that could easily be twisted to serve the narrative of guilt. Access to her aunt had never been a challenge, and as she pondered the implications of her actions, Beatrice's mind raced with possibilities. Would her debts be forgiven in the wake of tragedy? Or would the truth of her financial ruin come to light, shattering the illusion she had worked so hard to maintain?",
      "As the investigation unfolded, Beatrice felt the walls closing in, and the stakes grew ever higher. She was faced with a choice: to embrace the freedom that could come from her aunt's death or to confront the reality of her situation and the consequences of her reckless actions. In the depths of her internal struggle, Beatrice Quill would have to decide whether to continue weaving a web of deceit or to finally confront the truth of her life—no matter how tangled it might be."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a fashion designer whose ambition drives her to the edge of ethics, risking everything to keep her plagiarism a secret.",
    "publicPersona": "Innovative and ambitious, known for her cutting-edge designs.",
    "privateSecret": "Used the victim's designs without credit, risking her career.",
    "motiveSeed": "Fears the victim will destroy her career by revealing her plagiarism.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been in her room sketching new designs.",
    "accessPlausibility": "possible",
    "stakes": "Her reputation as a designer hangs in the balance.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with an air of cultured sophistication, her words carefully chosen yet laced with a sharp wit that reveals her keen intellect and ambition.",
    "signatureTic": "Fashion is a battlefield, darling.",
    "internalConflict": "Sylvia struggles with the ethical implications of her actions, torn between her ambition and the fear of losing everything if her secret is exposed.",
    "personalStakeInCase": "For Sylvia, this murder is a direct threat to her career; the exposure of her plagiarism could destroy everything she has worked for.",
    "paragraphs": [
      "Sylvia Trent stood amidst bolts of fabric and sketches, her creative sanctuary a chaotic reflection of her mind. A fashion designer on the rise, she had clawed her way to the top with a fierce ambition that often blurred the lines of ethics. The recent murder of the victim—a woman whose designs Sylvia had borrowed without credit—sent shockwaves through her carefully curated world. The fear of exposure loomed like a dark cloud, threatening to rain down ruin upon her career.",
      "In public, Sylvia was the embodiment of innovation, her cutting-edge designs celebrated by critics and adored by clientele. Yet, behind the scenes, the weight of her secret threatened to crush her spirit. She had taken inspiration from the victim’s work, but now it felt like a ticking time bomb. If the truth were to surface, her reputation would be in tatters, her ambitions dashed against the rocks of scandal. The stakes had never been higher, and Sylvia found herself caught in a web of her own making.",
      "Her alibi was as flimsy as the fabric she worked with; she had claimed to be sketching new designs in her room at the time of the murder. But as she watched the investigation unfold, she felt the noose of suspicion tighten around her. Access to the victim had been easy, and now the question loomed: would her ambition cost her everything? The thought of losing her career, her dreams, and the admiration she had fought so hard to gain was unbearable.",
      "As days turned into a whirlwind of uncertainty, Sylvia faced a choice that would define her future. She could continue to hide behind her lies and risk everything she had built, or she could confront the truth of her actions and the ethical implications of her ambition. In the heart of the fashion world, amidst the glitz and glamour, Sylvia Trent would have to navigate the treacherous waters of her conscience, deciding whether to emerge as a beacon of integrity or sink beneath the weight of her own deceit."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a cunning hotel manager whose charm masks a web of deceit, risking everything to maintain the facade of success.",
    "publicPersona": "Charismatic and persuasive, always knows how to keep guests satisfied.",
    "privateSecret": "Has been embezzling funds from the hotel.",
    "motiveSeed": "Aims to keep the victim quiet about the hotel's financial troubles caused by her reviews.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be dealing with a customer complaint at the time.",
    "accessPlausibility": "easy",
    "stakes": "His career and freedom depend on maintaining the facade of the hotel’s success.",
    "humourStyle": "blunt",
    "humourLevel": 0.6,
    "speechMannerisms": "Hugo speaks with a confident bravado, his words sharp and direct, often cutting through the fluff of conversation with a blunt honesty that disarms those around him.",
    "signatureTic": "Success is just a matter of perspective.",
    "internalConflict": "Hugo is trapped in a cycle of deceit, torn between the desire to maintain his lavish lifestyle and the fear of losing it all if his embezzlement is exposed.",
    "personalStakeInCase": "For Hugo, this murder is a dire threat; if the truth comes to light, it could destroy his career and the carefully constructed facade of success he has built.",
    "paragraphs": [
      "Hugo Vane stood behind the reception desk, a master of charm and persuasion, his smile as polished as the brass fixtures surrounding him. As the hotel manager, he was the face of success, but behind that facade lay a tangled web of deceit. The recent murder of a guest posed a serious threat to the image he had cultivated so meticulously. The victim had been a critic, and her reviews had threatened to expose the hotel’s financial troubles—troubles that Hugo had been embezzling to cover up.",
      "In the moments leading up to the murder, Hugo had claimed to be dealing with a customer complaint, a convenient alibi that provided him with a veil of protection. Yet, as the investigation unfolded, he felt the ground beneath him shift. Access to the victim had never been an issue; she was a guest in his hotel, and her presence was a constant reminder of the precariousness of his situation. The stakes were higher than ever, and Hugo knew that one misstep could lead to his downfall.",
      "With each passing day, the pressure mounted. Hugo’s mind raced with possibilities, and he found himself trapped in a cycle of deceit. The lavish lifestyle he had grown accustomed to depended on maintaining the facade of success, but the weight of his actions pressed down on him like a vice. Would he continue to play the role of the charismatic manager, or would the truth catch up with him? The thought of exposure filled him with dread, and he knew he had to act fast to protect his interests.",
      "As the investigation drew closer to the truth, Hugo faced a reckoning. He could either confront the reality of his actions or continue to spiral deeper into deceit. The murder investigation was not just a threat to his career; it was a reflection of the choices he had made, and the stakes had never been higher. In the grand theatre of the hotel, Hugo Vane would have to decide whether to maintain his charade or risk it all for the sake of his freedom."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Grand Seaside Hotel",
    "type": "seaside hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand hotel perched on the cliffs of Brighton, offering luxurious accommodations with breathtaking ocean views. The hotel buzzes with the tension of wartime secrets and the allure of nightly entertainment.",
    "visualDescription": "Art deco architecture with sweeping curves and bold geometric patterns; polished brass fixtures reflect the dim light of ornate chandeliers; the grand staircase spirals upwards, flanked by plush velvet drapes in deep navy; floor-to-ceiling windows showcase the tumultuous sea below.",
    "atmosphere": "An air of mystery cloaked in elegance, where every shadow seems to whisper secrets.",
    "paragraphs": [
      "The Grand Seaside Hotel stands majestically against the backdrop of the tumultuous English Channel, its art deco façade glistening with the dampness of a persistent drizzle. Inside, the lobby hums with the subdued murmur of conversation, punctuated by the occasional clink of fine china. Guests, wrapped in tailored coats, exchange furtive glances as they navigate the grand staircase, the heavy velvet drapes absorbing the tension that hangs in the air. The scent of saltwater mingles with the rich aroma of roasted lamb wafting from the dining room, where tonight's entertainment promises to be as dramatic as the weather outside.",
      "As evening falls, the dimming light casts elongated shadows across the plush carpeting, and the sound of a piano fills the air, creating an atmosphere both inviting and foreboding. Outside, the ocean roars against the cliffs, a constant reminder of the isolation that surrounds this haven of luxury. The hotel's guests, a mix of weary travelers and local aristocrats, gather close, sharing whispered secrets over glasses of sherry, unaware that the night will soon unravel into chaos. The faint crackling of radios in the background reports on the latest war developments, their ominous tone blending with the laughter and music, as if the very walls are eavesdropping on the conversations.",
      "Yet, beneath the glamour lies a palpable tension; the hotel is a microcosm of the larger world, where danger lurks in every corner. Staff move discreetly through the shadowed hallways, their expressions a mixture of concern and vigilance. The kitchen, bustling with activity, remains off-limits to guests, while the roof, accessible only to maintenance, holds secrets of its own. As the storm outside intensifies, guests are drawn into a web of intrigue, their lives intertwining in ways they cannot yet comprehend."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates",
    "timeFlow": "A single evening filled with mounting tension and unexpected revelations",
    "mood": "tense due to recent wartime events and lingering fears of espionage",
    "eraMarkers": [
      "ubiquitous radios playing news bulletins",
      "rationed wartime vehicles parked outside",
      "military radar equipment on the cliffs"
    ],
    "sensoryPalette": {
      "dominant": "the salty tang of the ocean mixed with the warmth of the dining room",
      "secondary": [
        "the crispness of rain on the windows",
        "the heavy musk of damp velvet drapes"
      ]
    },
    "paragraphs": [
      "The atmosphere within the Grand Seaside Hotel is thick with the weight of secrets, the air heavy with the scent of rain-soaked fabric and the briny tang of the sea. As guests filter in from the storm, they bring with them an air of uncertainty, their laughter strained and eyes darting. The combination of flickering candlelight and the distant roar of the ocean creates a setting ripe for intrigue, where every whispered conversation hints at hidden motives and unspoken fears.",
      "Outside, the cliffs loom like sentinels against the darkening sky, their rugged edges shrouded in mist. The hotel, perched precariously above the crashing waves, feels both a sanctuary and a trap. The distant sound of sirens echoes through the night, a reminder of the world beyond the hotel's walls, where the war rages on. As the evening unfolds, the atmosphere grows increasingly charged, a storm brewing not just in the skies but in the hearts of those gathered, each one a potential player in a deadly game of masquerade."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Spacious lobby with a grand staircase; polished marble floors reflect the chandelier's light; plush seating arranged for conversation.",
      "sensoryDetails": {
        "sights": [
          "gleaming brass railings",
          "ornate chandeliers casting warm light",
          "deep blue velvet drapes",
          "polished marble floors",
          "art deco motifs on walls"
        ],
        "sounds": [
          "murmur of conversations",
          "the creak of the staircase",
          "clinking of glasses",
          "soft piano music in the background",
          "distant laughter from the dining room"
        ],
        "smells": [
          "freshly polished wood",
          "warmth of candle wax",
          "salt air from open windows",
          "roasted coffee and pastries",
          "faint scent of perfume"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft velvet cushions",
          "cool brass railings",
          "chill from the open windows",
          "the warmth of a nearby fire"
        ]
      },
      "accessControl": "Open to guests during lobby hours; staff only access to behind-the-scenes areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked lobby windows",
            "grey light filtering through"
          ],
          "sounds": [
            "steady rain pattering on glass",
            "distant thunder rumbling",
            "soft footsteps on wet floors"
          ],
          "smells": [
            "damp wood and mildew",
            "freshly brewed coffee",
            "wet stone from the outside"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "glistening marble reflecting muted light",
            "guests huddled in conversation"
          ],
          "sounds": [
            "the creak of old wood",
            "soft whispers of intrigue",
            "the distant sound of waves crashing"
          ],
          "smells": [
            "dust from the carpets",
            "the scent of old books",
            "hint of tobacco smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering in the evening",
            "guests in formal attire",
            "twinkling stars visible outside"
          ],
          "sounds": [
            "soft laughter from nearby tables",
            "the ticking of a wall clock",
            "the rustle of evening gowns"
          ],
          "smells": [
            "candle wax and wood smoke",
            "freshly baked bread",
            "faint scent of cologne"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the heart of the hotel, a gathering place where guests come to exchange pleasantries and secrets alike. Grand chandeliers illuminate the space, their light bouncing off polished marble floors and casting intricate shadows. The air is thick with the scent of roasted coffee and the faint aroma of expensive perfumes, mingling with the salty tang of the sea that seeps in through the open windows. Here, conversations flow as freely as the drinks, but beneath the surface, a current of tension runs deep, each guest aware that the night may hold more than just entertainment.",
        "As the evening progresses, the lobby transforms into a stage for hidden dramas. The grand staircase becomes a focal point for intrigue, with guests choosing to linger, their eyes scanning the room for familiar faces. The soft strains of a piano echo in the background, intertwining with the laughter and whispers that fill the air. Yet, amidst the glamour, an undercurrent of fear is palpable; the war looms large in the minds of all present, making the grand lobby a microcosm of the world outside, where danger lurks in every shadow."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Dining and entertainment space",
      "visualDetails": "Elegant dining area with rich tapestries and intricate table settings; large windows overlook the ocean; stage for nightly performances.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware and crystal glassware",
          "richly embroidered tablecloths",
          "large bay windows framing the ocean",
          "performers on a small stage",
          "art deco murals on the walls"
        ],
        "sounds": [
          "clinking of cutlery on plates",
          "soft music playing from a string quartet",
          "the murmur of diners",
          "occasional applause for performances",
          "the crash of waves against the cliffs"
        ],
        "smells": [
          "succulent roasted meats",
          "freshly baked pastries",
          "aromatic herbs and spices",
          "the scent of fine wine",
          "the lingering aroma of dessert"
        ],
        "tactile": [
          "smooth tablecloths beneath fingers",
          "warmth from candle flames",
          "cool glass of wine",
          "soft upholstery of dining chairs",
          "the weight of silverware"
        ]
      },
      "accessControl": "Open to guests during meal times; staff-only access to kitchen areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets on window panes",
            "dim light filtering through clouds",
            "empty tables waiting for breakfast"
          ],
          "sounds": [
            "the patter of rain on the roof",
            "the sound of staff preparing for the day",
            "soft clinking of dishes"
          ],
          "smells": [
            "freshly baked bread",
            "cooked bacon",
            "brewing coffee"
          ],
          "mood": "quiet anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the room",
            "dull light casting a grey hue",
            "guests seated at tables, deep in conversation"
          ],
          "sounds": [
            "soft laughter and chatter",
            "the rustle of napkins",
            "the sound of a waiter taking orders"
          ],
          "smells": [
            "the scent of simmering stew",
            "fresh herbs from the kitchen",
            "the mustiness of old wood"
          ],
          "mood": "sombre reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "dancers performing on stage",
            "the glow of sunset outside the windows"
          ],
          "sounds": [
            "lively music filling the room",
            "the sound of applause from diners",
            "clinking glasses in celebration"
          ],
          "smells": [
            "the aroma of decadent desserts",
            "the scent of wine swirling in glasses",
            "the warm smell of roasted vegetables"
          ],
          "mood": "exuberant celebration"
        }
      ],
      "paragraphs": [
        "The Dining Room of the Grand Seaside Hotel is a feast for the senses, an elegant space where guests indulge in culinary delights while being entertained by live performances. Rich tapestries adorn the walls, and the soft glow of candlelight creates an intimate atmosphere. Tables are set with gleaming silverware and crystal glassware, each detail meticulously attended to by the staff. The scent of roasted meats and aromatic herbs fills the air, mingling with the sound of soft music played by a string quartet, creating an ambiance of refined luxury.",
        "As the evening unfolds, the Dining Room transforms into a vibrant hub of activity. Guests enjoy their meals while glancing at the performers on stage, their laughter and applause punctuating the air. The atmosphere is charged with excitement, yet beneath the surface, an unease simmers. Conversations are often punctuated by furtive glances, as whispers of the war outside find their way into the elegant setting. The Dining Room, while a place of enjoyment, is also a stage for hidden agendas and unspoken fears."
      ]
    },
    {
      "id": "kitchen",
      "name": "Kitchen",
      "type": "interior",
      "purpose": "Food preparation area for the hotel",
      "visualDetails": "Large, bustling kitchen filled with stainless steel appliances and wooden prep tables; shelves stocked with rationed ingredients.",
      "sensoryDetails": {
        "sights": [
          "shiny pots and pans hanging from hooks",
          "fresh produce stacked on wooden crates",
          "chefs in white uniforms moving quickly",
          "steam rising from large pots",
          "shelves lined with rationed goods"
        ],
        "sounds": [
          "clattering of utensils",
          "boiling water bubbling",
          "chefs shouting orders",
          "the hiss of frying food",
          "the sound of a knife chopping"
        ],
        "smells": [
          "sizzling onions and garlic",
          "freshly baked bread",
          "the pungent scent of herbs",
          "smoky bacon cooking",
          "the aroma of rich sauces"
        ],
        "tactile": [
          "smoothness of stainless steel countertops",
          "warmth from the ovens",
          "rough texture of wooden crates",
          "coolness of fresh vegetables",
          "the weight of a heavy pot"
        ]
      },
      "accessControl": "Staff-only access; restricted entry during service hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on kitchen windows",
            "staff preparing for breakfast rush",
            "fresh herbs drying on counters"
          ],
          "sounds": [
            "the sound of rain pattering outside",
            "the sizzle of bacon on the stove"
          ],
          "smells": [
            "the aroma of brewing coffee",
            "the scent of fresh pastries",
            "the sharpness of citrus"
          ],
          "mood": "hustle and bustle"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the workspace",
            "chefs preparing for dinner service",
            "ingredients neatly arranged"
          ],
          "sounds": [
            "the hum of refrigerators",
            "the sound of chopping vegetables",
            "the clatter of pots and pans"
          ],
          "smells": [
            "the scent of simmering stocks",
            "the aroma of baked goods cooling",
            "the earthy smell of root vegetables"
          ],
          "mood": "methodical preparation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "busy chefs plating meals",
            "dimmed lights for ambiance",
            "gleaming utensils ready for service"
          ],
          "sounds": [
            "the sound of orders being called out",
            "the laughter of staff members",
            "the clanging of pots and pans"
          ],
          "smells": [
            "the aroma of rich sauces",
            "the scent of grilled meats",
            "the sweet smell of dessert"
          ],
          "mood": "chaotic energy"
        }
      ],
      "paragraphs": [
        "The kitchen of the Grand Seaside Hotel is a hive of activity, where the air is thick with the scents of sizzling meats and freshly baked bread. Stainless steel appliances gleam under the bright lights, while chefs in crisp white uniforms dart around, their movements choreographed in a dance of efficiency. Shelves stocked with rationed ingredients reflect the ongoing war, yet creativity flourishes as the culinary team transforms simple components into exquisite dishes. The sounds of utensils clattering and pots bubbling create a symphony of culinary artistry, blending seamlessly with the lingering aroma of herbs and spices.",
        "With each passing hour, the kitchen pulses with energy, a stark contrast to the more refined areas of the hotel. As the morning rush gives way to the afternoon lull, the atmosphere shifts; the chatter of staff is replaced by the focused sound of chopping and boiling. Each chef is a master of their craft, preparing for the evening service with precision and care. Yet, amid the hustle, an unspoken tension simmers, a reminder that the world beyond the kitchen doors is fraught with uncertainty, and the food they create may be a small comfort in a time of chaos."
      ]
    },
    {
      "id": "rooftop",
      "name": "Rooftop Terrace",
      "type": "exterior",
      "purpose": "Viewing area and staff access point",
      "visualDetails": "Open terrace with a view of the ocean; sparse furnishings; utility access points for maintenance.",
      "sensoryDetails": {
        "sights": [
          "vast ocean stretching to the horizon",
          "billowing clouds overhead",
          "faded furniture weathered by the elements",
          "distant ships navigating the channel",
          "seagulls soaring overhead"
        ],
        "sounds": [
          "the roar of the ocean below",
          "whipping wind against the terrace",
          "calls of seagulls overhead",
          "the distant sound of music from below",
          "the soft rustle of nearby plants"
        ],
        "smells": [
          "salt air and seaweed",
          "the scent of rain-soaked stone",
          "the faint aroma of grilled food from the kitchen",
          "freshly cut grass from nearby gardens",
          "the mustiness of weathered wood"
        ],
        "tactile": [
          "rough texture of weathered wood",
          "the chill of the evening breeze",
          "smoothness of glass railings",
          "the warmth of the sun on the skin",
          "the dampness of the terrace floor"
        ]
      },
      "accessControl": "Restricted access for maintenance only; guests allowed during specific hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds obscuring the sun",
            "puddles forming on the terrace",
            "dripping plants from overnight rain"
          ],
          "sounds": [
            "the sound of raindrops falling",
            "the distant rumble of thunder",
            "the soft gurgling of rainwater"
          ],
          "smells": [
            "the sharp scent of wet stone",
            "fresh rain on grass",
            "the earthy aroma of damp soil"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "clouds casting shadows over the ocean",
            "the horizon blending with the sea",
            "faint outlines of distant ships"
          ],
          "sounds": [
            "the gentle crash of waves",
            "the rustle of wind through grass",
            "the distant hum of conversation from below"
          ],
          "smells": [
            "the scent of brine and sea air",
            "the mustiness of aging wood",
            "the faint aroma of food wafting from the kitchen"
          ],
          "mood": "pensive solitude"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset painting the sky in hues of orange",
            "the moon rising over the ocean",
            "twinkling lights from the hotel below"
          ],
          "sounds": [
            "the distant laughter of guests",
            "the soft rustle of leaves",
            "the gentle lapping of waves"
          ],
          "smells": [
            "the salty tang of the ocean",
            "the scent of blooming night flowers",
            "the faint aroma of smoke from distant chimneys"
          ],
          "mood": "peaceful contemplation"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers a breathtaking view of the ocean, where the sky meets the sea in a dramatic embrace. Sparse furnishings provide a place for guests to gather, while the distant sound of waves crashing against the cliffs serves as a constant backdrop. The terrace, however, is more than just a viewing platform; it is a place where secrets can be exchanged under the cover of the evening sky. The salty air carries whispers of intrigue, making it a favored spot for those seeking a moment of solitude or a clandestine conversation.",
        "As the evening unfolds, the Rooftop Terrace transforms into a refuge for those wishing to escape the tensions of the hotel below. The gentle breeze carries the scent of the ocean, mingling with the aromas wafting from the kitchen. Guests lean against the glass railings, gazing out at the horizon, lost in thought. Yet, in the shadows, conspiratorial whispers hint at the darker truths that linger just out of sight. The terrace, while a place of beauty, is also a stage for the unfolding drama that will change the course of the night."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028945521,
  "durationMs": 77551
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "January",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "overcast skies with intermittent rain showers",
      "chilly winds blowing in from the sea",
      "occasional bursts of sunlight breaking through the clouds"
    ],
    "daylight": "Short days with daylight fading around 4 PM, giving way to long, cold evenings.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, after dinner service in the hotel dining room.",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "Winter walks along the beach, bundled in heavy coats",
      "Indoor games and card tournaments in the hotel lounge",
      "Social dances held in the hotel ballroom to lift spirits during the war"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits in dark colors",
        "crisp white shirts with wide collars",
        "homburg hats for outdoor events"
      ],
      "casual": [
        "tweed jackets with elbow patches",
        "flannel trousers",
        "knitted sweaters over collared shirts"
      ],
      "accessories": [
        "silk ties with geometric patterns",
        "leather gloves for colder days",
        "pocket squares to add a pop of color"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dresses with cinched waists",
        "matching coats with fur collars",
        "periwinkle blue hats adorned with feathers"
      ],
      "casual": [
        "woolen skirts paired with fitted cardigans",
        "simple blouses with puffed sleeves",
        "ankle-length coats with large buttons"
      ],
      "accessories": [
        "string of pearls",
        "stylish gloves",
        "clutches adorned with sequins"
      ]
    },
    "trendsOfTheMoment": [
      "Utilitarian fashion with a focus on practicality due to rationing",
      "The popularity of bold patterns and colors blending with somber tones",
      "Emergence of shoulder pads in women’s wear to symbolize strength"
    ],
    "socialExpectations": [
      "Men were expected to return from service and reintegrate into work",
      "Women were increasingly taking on roles in the workforce, challenging traditional norms",
      "There was a heightened awareness of espionage and collaboration during wartime"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Battle of Anzio begins, marking a significant campaign in Italy",
      "The Allies continue to strategize post-D-Day plans for the liberation of Europe",
      "Concerns rise over espionage within the UK, leading to increased security measures"
    ],
    "politicalClimate": "Political tensions remain high with the ongoing war; patriotism is mixed with fears of betrayal.",
    "economicConditions": "Rationing persists, affecting consumer goods and food availability, causing widespread discomfort.",
    "socialIssues": [
      "Debate over women's roles as they take more positions in industries traditionally held by men",
      "Struggles with war-induced shortages leading to public discontent",
      "Growing unease about the potential consequences of the war on civil liberties"
    ],
    "internationalNews": [
      "Reports of the atrocities in concentration camps begin to surface, impacting public sentiment",
      "Tensions with the Soviet Union start to emerge as a potential post-war adversary",
      "The establishment of the United Nations is discussed as a hope for future peace"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'I'll Be Seeing You'",
        "Glenn Miller's big band hits",
        "The Andrews Sisters' swing tunes"
      ],
      "films": [
        "Casablanca, which remains a box office hit",
        "Since You Went Away, highlighting wartime family struggles",
        "To Have and Have Not, introducing new Hollywood talent"
      ],
      "theater": [
        "A Streetcar Named Desire making waves in Broadway previews",
        "Musicals like Oklahoma! continuing to attract audiences",
        "War-themed plays reflecting the national mood"
      ],
      "radio": [
        "Suspense, a popular mystery and drama program",
        "The Shadow, captivating audiences with its thrilling tales",
        "News broadcasts keeping citizens informed about wartime events"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Razor's Edge by W. Somerset Maugham",
        "The Glass Menagerie by Tennessee Williams",
        "The Little Prince by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "War fiction reflecting the realities of conflict",
        "Mystery and detective novels gaining traction",
        "Romantic novels exploring love amidst adversity"
      ]
    },
    "technology": {
      "recentInventions": [
        "Advancements in radar technology aiding military operations",
        "The introduction of the first portable radio sets for personal use",
        "Early developments in jet aircraft technology"
      ],
      "commonDevices": [
        "Radios as a staple in homes for news and entertainment",
        "Manual typewriters still prevalent for communication and work",
        "Film projectors used in small theaters and homes for entertainment"
      ],
      "emergingTrends": [
        "Increased use of military technology in civilian life",
        "Early forms of television beginning to appear in urban areas",
        "Wartime innovations making their way into post-war applications"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pound of butter: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "Community gatherings to discuss war efforts and support",
        "Volunteering for local war aid organizations",
        "Participating in rationing efforts and food drives"
      ],
      "socialRituals": [
        "Weekly tea gatherings among friends to maintain morale",
        "Public air raid drills to prepare citizens for potential threats"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Middle and upper classes are expected to contribute to wartime efforts",
      "Working-class individuals gain respect as they take on vital roles in industry"
    ],
    "gender": [
      "Women challenging traditional roles, taking jobs in factories and offices",
      "A growing acceptance of women in leadership positions within community organizations",
      "Men returning from war struggle with reintegration into civilian life"
    ],
    "race": [
      "Continued segregation and discrimination persist in many areas",
      "Some movements for civil rights begin to gain momentum, particularly among African American communities"
    ],
    "generalNorms": [
      "Patriotism is a unifying force, but fear of espionage creates suspicion",
      "Conformity is valued, especially in wartime efforts and community support",
      "Public discourse often reflects the anxieties of war and its impact on daily life"
    ]
  },
  "atmosphericDetails": [
    "The scent of saltwater mixed with the dampness of rain clung to the air, creating a sense of foreboding.",
    "The distant sound of crashing waves provided a rhythmic backdrop, underscored by the occasional rumble of thunder.",
    "Inside the seaside hotel, the flickering glow of lamps cast shadows on the walls, creating an intimate yet tense atmosphere."
  ],
  "paragraphs": [
    "In January 1944, the seaside hotel buzzed with the nervous energy of patrons seeking solace from the stormy weather outside. Overcast skies loomed overhead, occasionally giving way to drizzling rain that swept in from the coast. Inside, the warmth of the fireplace contrasted sharply with the chill in the air, fostering an ambiance that was both cozy and strained by the specter of war. Guests gathered, exchanging glances laced with suspicion, as uncertainty about the future weighed heavily on their minds amidst the flickering glow of the hotel’s lamps.",
    "Fashion in this winter month reflected both the utilitarian needs of wartime life and a yearning for glamour. Men donned double-breasted wool suits, their homburg hats tilted just so, while women embraced elegant tea-length dresses adorned with feathers and pearls. The blend of dark hues and bold patterns spoke to a society striving to maintain a sense of normalcy, even as the shadows of conflict loomed ever larger. Social dances in the hotel ballroom offered brief escapes, where couples twirled beneath the sparkling chandeliers, if only to forget the troubles of the world outside for a moment.",
    "Daily life revolved around a backdrop of rationing and community support, with the price of goods reflecting the challenges of wartime economics. A loaf of bread would cost four pence, while a taxi ride across town set one back two shillings. Weekly tea gatherings and public air raid drills punctuated the routine, as citizens united in their efforts to uphold morale. In this coastal enclave, whispers of espionage and the specter of loss intertwined with the laughter and chatter, creating a unique atmosphere where hope struggled against despair, all within the walls of a hotel that held many secrets."
  ],
  "note": "",
  "cost": 0.00130545525,
  "durationMs": 16674
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A high-stakes masquerade ball at a seaside hotel draws together a diverse cast, each grappling with the societal shifts of the 1940s while secrets and identities intertwine under the shadow of recent wartime tensions.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The class dynamics are shifting as women enter the workforce in greater numbers due to WWII, creating a pressure to conform to new roles while underlying Cold War anxieties amplify distrust among individuals."
  },
  "setting": {
    "location": "A grand hotel overlooking the ocean",
    "institution": "seaside hotel",
    "weather": "overcast with occasional rain"
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
    "id": "costume_switch_time",
    "value": "ten minutes past nine",
    "description": "The exact time of the costume switch during the masquerade."
  },
  {
    "id": "footprint_distance",
    "value": "twenty feet",
    "description": "The distance between the dining room and the ballroom where the costumes were switched."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 8,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 18,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_5",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
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
      "category": "testimonial"
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
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_2",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_3",
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
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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

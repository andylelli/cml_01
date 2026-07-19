# Actual Prompt Record

- Run ID: `mystery-1784466499405`
- Project ID: ``
- Timestamp: `2026-07-19T13:11:48.877Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `1efc5c298b63f185`

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
    "title": "Tides of Deception",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Cliffside Seaside Hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "drowning"
    }
  },
  "death_method": "drowned",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Astute and observant hotel guest",
      "private_secret": "Has a past connection to the victim",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "7:00 PM to 8:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Lobby",
        "Beach"
      ],
      "behavioral_tells": [],
      "stakes": "Uncovering the truth",
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
      "public_persona": "Respected physician",
      "private_secret": "Knew sensitive information about other guests",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "evening",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Life",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Past acquaintance of Dr. Finch"
      ],
      "public_persona": "Retired naval officer",
      "private_secret": "Has a gambling problem",
      "motive_seed": "Gambling debts",
      "motive_strength": "moderate",
      "alibi_window": "6:30 PM to 8:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Beach",
        "Dock"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Close friend of Dr. Finch"
      ],
      "public_persona": "Hotel manager",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Jealousy",
      "motive_strength": "moderate",
      "alibi_window": "7:00 PM to 8:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Lobby",
        "Staff quarters"
      ],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [
        "Acquaintance of Dr. Finch"
      ],
      "public_persona": "Young artist",
      "private_secret": "Paints portraits of guests",
      "motive_seed": "Revenge for a perceived slight",
      "motive_strength": "low",
      "alibi_window": "6:45 PM to 7:45 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Beach",
        "Art studio"
      ],
      "behavioral_tells": [],
      "stakes": "Artistic career",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Business partner of Dr. Finch"
      ],
      "public_persona": "Entrepreneur",
      "private_secret": "Financial troubles",
      "motive_seed": "Intimidation for business deal",
      "motive_strength": "high",
      "alibi_window": "6:30 PM to 8:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Lobby",
        "Beach"
      ],
      "behavioral_tells": [],
      "stakes": "Financial security",
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
      "summary": "In the overcast seaside hotel of Brighton, Dr. Mallory Finch is found drowned during a tidal surge. As Detective Eleanor Voss investigates, she uncovers a web of jealousy, financial woes, and hidden relationships among the guests, leading to a startling revelation about the timing of the crime."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The victim was drowned during a tidal surge, but evidence is manipulated to suggest they drowned during high tide, creating a false narrative.",
      "delivery_path": [
        {
          "step": "Victim is drowned at low tide but positioned to appear as if drowned at high tide."
        },
        {
          "step": "Murderer uses tide charts to create an alibi."
        },
        {
          "step": "Witness account is timed to mislead about the circumstances."
        }
      ]
    },
    "outcome": {
      "result": "Murderer successfully conceals the true timing of the death, misdirecting suspicion."
    }
  },
  "false_assumption": {
    "statement": "The victim drowned during high tide at 7:30 PM.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses recall seeing the victim near the beach around that time, and the tide was high.",
    "what_it_hides": "The actual time of death was during low tide, suggesting premeditated drowning."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses claim to have seen Hale arguing with Finch earlier.",
      "Hale has a motive due to their past acquaintance."
    ],
    "the_one_flaw": "Hale was seen in the lobby during the crucial time based on hotel logs.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Footprints leading to the edge of the dock.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "Footprints were from a fisherman who had been docked nearby.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A diary entry suggesting Finch was meeting someone.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The entry refers to a professional meeting about hotel business.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects are guests or staff of the hotel; no outsiders involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "7:00 PM",
        "8:00 PM"
      ],
      "windows": [
        "6:30 PM to 8:00 PM"
      ],
      "contradictions": [
        "Witnesses claim victim was seen at the beach after 7:30 PM, but tide charts show low tide at that time."
      ]
    },
    "access": {
      "actors": [
        "Hugo Vane",
        "Beatrice Quill"
      ],
      "objects": [
        "Tide charts",
        "Victim's belongings"
      ],
      "permissions": [
        "Access to beach area"
      ]
    },
    "physical": {
      "laws": [
        "Tide schedules dictate water levels"
      ],
      "traces": [
        "Footprints in sand"
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff's word",
        "Witness accounts"
      ],
      "authority_sources": [
        "Hotel ledger"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The tide chart found in the victim's belongings shows low tide at 7:30 PM.",
        "correction": "This contradicts the assumption that the victim drowned during high tide.",
        "effect": "Narrows time of death to before 7:30 PM.",
        "required_evidence": [
          "Tide chart found in victim's belongings",
          "Witness accounts of the calm sea",
          "Hotel ledger recording last drink at 6:45 PM"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall the sea being calm at the time of death.",
        "correction": "The calm sea contradicts the high tide assumption.",
        "effect": "Eliminates the high tide drowning scenario.",
        "required_evidence": [
          "Witness statements about sea conditions",
          "Tide chart showing low tide",
          "Hotel ledger timestamps"
        ],
        "reader_observable": true
      },
      {
        "observation": "A marked timeline in the hotel ledger shows the time of the victim's last drink.",
        "correction": "The victim must have been alive at least until this time, contradicting the high tide drowning.",
        "effect": "Narrows opportunity window for suspects.",
        "required_evidence": [
          "Hotel ledger with marked time",
          "Witness accounts of the victim's interactions",
          "Footprints leading to the beach"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Compare the tide schedule with the victim's last seen time and witness accounts to prove the drowning scenario is fabricated.",
    "knowledge_revealed": "The timeline proves the victim was drowned at a different time than stated.",
    "pass_condition": "If the alibi of drowning at high tide fails against the tide schedule.",
    "evidence_clues": [
      "clue_6",
      "clue_core_contradiction_chain",
      "clue_3",
      "clue_early_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1 shows the tide chart and witness accounts establish the timeline. Step 2 eliminates the high tide scenario through calm sea evidence. Step 3 confirms the victim's last drink time narrows suspect opportunity."
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
        "Observe the results of the comparison",
        "Draw conclusion about the timing of the drowning"
      ],
      "test_type": "timing comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by hotel logs",
        "supporting_clues": [
          "clue_early_1",
          "clue_mid_1"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Hotel business meeting logs",
        "supporting_clues": [
          "clue_mid_2",
          "clue_late_1"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness confirmation of her location",
        "supporting_clues": [
          "clue_mid_3",
          "clue_late_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence from earlier clues"
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
        "clue_id": "clue_culprit_direct_hugo_vane",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements about sea conditions"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Hotel ledger recording last drink"
      },
      {
        "clue_id": "clue_mid_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Footprints in the sand"
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
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_15",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_16",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_17",
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
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Tide chart found in victim's belongings"
      },
      {
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Business meeting logs"
      },
      {
        "clue_id": "clue_late_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness confirmation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a traveling journalist, finds herself embroiled in a murder mystery that forces her to confront her past and seek redemption.",
    "publicPersona": "Charming and inquisitive, Eleanor is known for her captivating travel stories.",
    "privateSecret": "She once had a romantic affair with someone connected to the victim's past.",
    "motiveSeed": "Eleanor feels compelled to uncover the truth due to her connection with the victim.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the hotel lobby during the time of the murder.",
    "accessPlausibility": "easy",
    "stakes": "She seeks redemption and closure for her past mistakes.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a warm, engaging tone, often punctuating her observations with a slight laugh, as if to lighten the weight of her words. She has a tendency to ask rhetorical questions that reflect her curiosity.",
    "signatureTic": "‘Isn’t it curious?’",
    "internalConflict": "Eleanor grapples with guilt over her past affair and its implications on her current investigation, fearing that the truth may unravel her carefully constructed life.",
    "personalStakeInCase": "The crime matters deeply to Eleanor because it forces her to face the consequences of her past choices and the person she has become.",
    "paragraphs": [
      "Eleanor Voss stood at the edge of the hotel lobby, her keen eyes scanning the bustling crowd. As a traveling journalist, she had always been drawn to stories that danced between the lines of truth and deception. Yet, this time, the story had turned personal. The murder of Dr. Mallory Finch had sent ripples through the seaside hotel, and Eleanor felt an unsettling pull to delve deeper, not only as a journalist but as someone who shared a shadowy connection to the victim.",
      "Her charm was undeniable, a quality that had served her well in her career, allowing her to weave captivating tales from the mundane. But beneath that facade lay a well of secrets, one that threatened to surface with each new revelation. The affair she'd once had with a man tied to Mallory's past haunted her, a ghost that whispered doubts into her mind as she navigated the treacherous waters of suspicion and intrigue. ‘Isn’t it curious?’ she often mused, a verbal tic that revealed her knack for finding wonder in the bleakest situations.",
      "As she engaged with the other hotel guests, Eleanor’s warmth and humor drew them in, yet her mind raced with the implications of what she uncovered. Each conversation was a thread in a larger tapestry, one she hoped to unravel before her own past caught up with her. The stakes were high; redemption was not merely a desire, it was a necessity. She longed to confront her past mistakes and emerge not as a mere observer, but as a trusted investigator.",
      "Eleanor's alibi placed her in the hotel lobby at the time of the murder, an easy position to defend. Yet, the access she had to the inner workings of the hotel and its staff allowed her to move through the shadows, gathering clues while battling her own inner demons. As she pieced together the puzzle, she realized that the truth was as elusive as the tides crashing against the cliffs, and she was determined to uncover it, not just for the sake of the victim, but for her own soul."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a well-regarded physician, finds herself at the center of a scandal that threatens to unravel her career and reveal her dark secrets.",
    "publicPersona": "A well-regarded doctor known for her compassionate care.",
    "privateSecret": "She has been involved in unethical medical practices to further her career.",
    "motiveSeed": "Mallory stands to lose her reputation if the victim reveals her malpractice.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be in her office, but no one can verify her whereabouts.",
    "accessPlausibility": "possible",
    "stakes": "Her career and social standing are on the line.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory's speech is precise and clinical, reflecting her background as a physician. She often speaks in a measured tone, avoiding emotional language, as if to maintain an air of professionalism even in distressing situations.",
    "signatureTic": "‘Let’s focus on the facts.’",
    "internalConflict": "Mallory is tormented by the fear that her unethical practices will be exposed, leading her to question her morality and the sacrifices she has made for success.",
    "personalStakeInCase": "The crime matters profoundly to Mallory because it directly threatens her reputation, which she has fought tirelessly to build.",
    "paragraphs": [
      "Dr. Mallory Finch was the picture of professionalism, a well-respected physician whose compassionate care had earned her the admiration of her community. Yet, as the news of her murder spread through the seaside hotel, whispers of her dark past began to surface. Beneath the polished exterior lay a web of unethical practices that could shatter her carefully crafted reputation. ‘Let’s focus on the facts,’ she would often insist, but the truth was anything but clear.",
      "As she navigated her relationships with colleagues and patients, Mallory carried the weight of her secrets like a shroud. The fear of exposure gnawed at her, threatening to unravel everything she had worked for. The victim, with knowledge of her malpractice, had become a liability, and Mallory’s mind raced with the implications. She was in a race against time to silence the voices that threatened her legacy.",
      "Her alibi, claiming to be in her office during the murder, was flimsy at best. No one could verify her whereabouts, leaving her vulnerable to suspicion. The stakes were high, and the pressure mounted with each passing hour. As the investigation unfolded, Mallory found herself caught in a moral quagmire, questioning the very principles that had once guided her career. The line between right and wrong blurred, and she wondered if she could ever return to the woman she once was.",
      "In her quiet moments, Mallory grappled with the reality of her choices. The pursuit of success had come at a cost, and now she faced the possibility of losing everything. The hotel, with its crashing waves and looming cliffs, became a metaphor for her own precarious existence. Would she be able to rise above the tide of deception, or would she be swept away by the very secrets she had tried to bury?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, struggles with the shadows of his past as his reputation hangs by a thread following the murder of Dr. Mallory Finch.",
    "publicPersona": "A dignified gentleman with a history of service and honor.",
    "privateSecret": "He harbors a dark secret about a wartime betrayal involving the victim.",
    "motiveSeed": "Ivor fears the victim will expose his wartime past, damaging his legacy.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was seen at the bar, but his timing is vague.",
    "accessPlausibility": "easy",
    "stakes": "His reputation and the memory of his service are at stake.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a formal cadence, often punctuating his sentences with a hint of self-deprecation. He tends to reflect on his past experiences, drawing parallels that reveal both pride and regret.",
    "signatureTic": "‘In my day…’",
    "internalConflict": "Ivor is tormented by guilt over a wartime betrayal that could tarnish his legacy, creating a moral struggle between his desire to protect his reputation and the need to confront his past.",
    "personalStakeInCase": "The crime is deeply personal for Ivor as it threatens not only his reputation but also the legacy of honor he has fought to uphold throughout his life.",
    "paragraphs": [
      "Captain Ivor Hale, a retired naval officer, wore his dignity like armor, forged in the fires of service and honor. Yet, beneath his composed exterior lay a tumultuous past, one fraught with betrayal and regret. The murder of Dr. Mallory Finch had cast a pall over the seaside hotel, and Ivor found himself caught in the crosshairs of suspicion. ‘In my day…’ he would begin, but the weight of his words often faltered under the scrutiny of his hidden truths.",
      "His public persona was that of a dignified gentleman, respected for his service, yet the shadows of his past loomed large. A wartime betrayal, one he had buried deep, now threatened to surface, and the victim held the key to his undoing. The fear of exposure gnawed at him, compelling Ivor to protect his legacy at all costs. His alibi, being seen at the bar, was vague, leaving him vulnerable to whispers of guilt that echoed through the hotel corridors.",
      "As he interacted with the other guests, Ivor's self-deprecating humor often masked his internal conflict. He would reflect on the choices he had made, drawing parallels between his past and the present, even as he struggled to reconcile his actions with the man he aspired to be. The stakes were high; his reputation and the memory of his service rested on a knife's edge, and he was determined to navigate the treacherous waters of suspicion without succumbing to the tides of deceit.",
      "Ivor’s character arc held the potential for redemption, a chance to confront the demons of his past and emerge with his integrity intact. The hotel, perched on the cliffs, became a symbol of his precarious situation. Would he be able to confront the truth and reclaim his honor, or would he be swept away by the very secrets he had tried to bury?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a glamorous socialite, finds her ambitions threatened as the murder of Dr. Mallory Finch exposes the dark underbelly of her rise to fame.",
    "publicPersona": "A glamorous young woman, constantly seeking to elevate her status.",
    "privateSecret": "Her rise is fueled by manipulation and secrets about others, including the victim.",
    "motiveSeed": "Beatrice fears that the victim will expose her deceptions, ruining her chances at stardom.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be rehearsing lines in her room, but no witnesses confirm.",
    "accessPlausibility": "possible",
    "stakes": "Her dreams of fame and success are threatened.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a playful, flirtatious tone, often using sarcasm to deflect serious topics. She has a tendency to embellish her stories, making her sound more glamorous than she truly is.",
    "signatureTic": "‘You know how it is in our world…’",
    "internalConflict": "Beatrice wrestles with the fear that her carefully constructed persona could crumble under the weight of truth, forcing her to confront the emptiness of her ambitions.",
    "personalStakeInCase": "The crime is significant for Beatrice because it threatens to expose the manipulations that have fueled her rise, jeopardizing her dreams of fame and fortune.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of glamour, a socialite whose every move was meticulously curated to elevate her status. Yet, as the murder of Dr. Mallory Finch sent shockwaves through the hotel, Beatrice felt the ground beneath her feet begin to tremble. ‘You know how it is in our world…’ she would say, her sardonic humor masking the anxiety that simmered just beneath her polished exterior. The victim held secrets that could unravel her carefully constructed facade, and the stakes had never been higher.",
      "Her alibi, rehearsing lines in the privacy of her room, was flimsy at best; no witnesses could confirm her whereabouts. Beatrice had always relied on her charm and wit to navigate the social ladder, but now, those very traits felt like double-edged swords. The fear of exposure loomed large, threatening to strip away the layers of manipulation she had draped over her life, revealing the emptiness beneath. Each interaction with the other guests became a dance of deception, her playful banter concealing the turmoil within.",
      "As she mingled with the other suspects, Beatrice’s sardonic humor often served as a shield, deflecting serious inquiries while allowing her to maintain control of the narrative. Yet, the internal conflict gnawed at her, forcing her to confront the reality of her ambitions. The dreams of fame and success that had once fueled her every decision now felt increasingly fragile, teetering on the brink of collapse with each new revelation.",
      "The hotel, with its sweeping views of the sea, became a metaphor for Beatrice’s own precarious existence. Would she be able to navigate the tides of deception and emerge unscathed, or would the truth wash over her like a relentless wave, dragging her down into the depths of her own making?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, the no-nonsense hotel manager, faces the consequences of her shady dealings as the murder of Dr. Mallory Finch threatens her authority and livelihood.",
    "publicPersona": "An efficient and no-nonsense manager, respected by staff and guests.",
    "privateSecret": "She has been involved in shady dealings regarding hotel finances.",
    "motiveSeed": "Sylvia could lose her job if the victim exposes the hotel’s financial irregularities.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been in her office managing guests, but no records confirm her activities.",
    "accessPlausibility": "easy",
    "stakes": "Her livelihood and authority are on the line.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Sylvia speaks in a direct, no-nonsense manner, often cutting through pleasantries to get to the point. Her tone is authoritative, reflecting her position as hotel manager.",
    "signatureTic": "‘Let’s not waste time.’",
    "internalConflict": "Sylvia is burdened by the fear that her unethical dealings will be exposed, leading her to question her choices and the lengths she has gone to maintain her authority.",
    "personalStakeInCase": "The crime is vital for Sylvia as it threatens her job security and the hard-won respect she has earned in her role as hotel manager.",
    "paragraphs": [
      "Sylvia Trent was the embodiment of efficiency, a hotel manager whose no-nonsense demeanor commanded respect from both staff and guests. Yet, as the news of Dr. Mallory Finch’s murder rippled through the hotel, Sylvia felt the ground beneath her authority begin to shift. ‘Let’s not waste time,’ she would assert, her blunt manner leaving little room for frivolity. The stakes had never been higher, and the threat of exposure loomed like a storm cloud over her carefully constructed world.",
      "Her public persona was that of an unwavering leader, but behind closed doors, Sylvia had engaged in shady dealings that could unravel her career. The fear of the victim revealing the hotel’s financial irregularities gnawed at her, pushing her to maintain control at all costs. Her alibi, claiming to be in her office managing guests, was shaky at best, with no records to support her claims. The pressure mounted as she navigated the treacherous waters of suspicion, knowing that any misstep could lead to her downfall.",
      "Sylvia’s speech was direct and authoritative, often cutting through the noise to get to the heart of the matter. Yet, beneath her tough exterior lay an internal conflict that threatened to disrupt her carefully maintained facade. As she interacted with the other suspects, she felt the weight of her choices pressing down on her, forcing her to confront the lengths she had gone to protect her authority and livelihood.",
      "The hotel, perched on the edge of the cliffs, became a metaphor for Sylvia’s precarious position. Would she be able to weather the storm and emerge with her reputation intact, or would the truth come crashing down like the waves against the rocks below, washing away everything she had built?"
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a charismatic businessman, finds himself entangled in a web of crime and deceit as the murder of Dr. Mallory Finch threatens his empire.",
    "publicPersona": "A charismatic entrepreneur known for his cunning business deals.",
    "privateSecret": "He has ties to organized crime and fears the victim's knowledge could jeopardize him.",
    "motiveSeed": "Hugo sees the victim as a liability due to their knowledge of his illegal dealings.",
    "motiveStrength": "compelling",
    "alibiWindow": "Was reportedly negotiating a deal at the hotel, but details are murky.",
    "accessPlausibility": "possible",
    "stakes": "His fortune and freedom are at risk.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks with a smooth, persuasive tone, often using charm to disarm those around him. He has a tendency to observe his surroundings keenly, making pointed comments that reveal his cunning nature.",
    "signatureTic": "‘Let’s make this interesting.’",
    "internalConflict": "Hugo is tormented by the fear that his illegal dealings will come to light, forcing him to confront the precarious balance he has maintained between success and morality.",
    "personalStakeInCase": "The crime is crucial for Hugo as it threatens not only his wealth but also his freedom, forcing him to confront the reality of his choices.",
    "paragraphs": [
      "Hugo Vane was the epitome of charisma, a businessman whose cunning deals had earned him both fortune and infamy. Yet, as the murder of Dr. Mallory Finch sent shockwaves through the hotel, Hugo found himself standing on shaky ground. ‘Let’s make this interesting,’ he would say, his observational humor a mask for the anxiety that simmered beneath the surface. The victim’s knowledge of his illegal dealings threatened to unravel the empire he had built, and the stakes had never been higher.",
      "His alibi, claiming to be negotiating a deal at the hotel, was murky, leaving room for doubt. As he mingled with the other guests, Hugo’s smooth, persuasive tone often disarmed those around him, but the fear of exposure loomed large. The ties he had to organized crime could spell disaster, and he felt the weight of his choices pressing down on him like a heavy anchor. Each interaction was a delicate dance, a balancing act between charm and desperation.",
      "As the investigation unfolded, Hugo’s internal conflict became more pronounced. The fear that his illegal dealings would come to light forced him to confront the precarious balance he had maintained between success and morality. The hotel, with its sweeping views of the sea, became a metaphor for his own existence, teetering on the edge of ruin. Would he be able to navigate the tides of deception and emerge unscathed, or would the truth pull him under?",
      "Hugo’s character arc held the potential for transformation, a chance to reevaluate his choices and confront the ethical implications of his actions. The crime had thrust him into a world of uncertainty, and he was left to wonder if he could salvage his fortune and freedom, or if the consequences of his past would finally catch up with him."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Cliffside Seaside Hotel",
    "type": "hotel",
    "place": "Whitstable",
    "country": "England",
    "summary": "A cliffside hotel blending Art Deco elegance with Colonial charm, harboring secrets behind its grand facade.",
    "visualDescription": "The hotel features a sweeping facade of white stucco, accented by sea-green shutters and a grand entrance flanked by palm trees. The lobby boasts polished marble floors, a sweeping staircase, and plush velvet armchairs, all under an ornate glass chandelier.",
    "atmosphere": "Mysterious and foreboding, with whispers of the sea mingling with the scent of damp wood.",
    "paragraphs": [
      "Perched high on the cliffs overlooking the turbulent waters of the North Sea, the Cliffside Seaside Hotel stands as a sentinel of elegance amidst the chaos of the world. Its Art Deco lines and Colonial detailing speak of a bygone era, yet the salty air carries with it an air of tension. As waves crash against the rocks below, the hotel seems to absorb the sounds of the sea, only to release them as whispers in the corridors. The lobby, with its marble floors and plush furnishings, feels like a stage set for drama, where the guests are both spectators and actors in a play of deception.",
      "The atmosphere is thick with secrets, each corner of the hotel holding its own story, its own mystery. Staff members move with purpose, their eyes darting to the guests, ensuring that nothing slips past their watchful gaze. The narrow hallways twist and turn, creating a labyrinthine layout that can easily conceal a clandestine meeting or a hurried escape. Outside, the winding coastal road snakes perilously along the cliff edge, a reminder of the isolation that envelops this grand establishment, making it difficult for help to arrive when the tides of trouble rise.",
      "As evening descends, the hotel transforms under the glow of gas lamps. Shadows dance against the walls, and the distant sound of the sea becomes a haunting melody. Guests gather in the lounge, their laughter mingling with the crackling radio, broadcasting the latest news from a world at war. Yet beneath the surface of conviviality lies a current of unease, as each individual is acutely aware that the next moment could bring revelation or ruin. The Cliffside Seaside Hotel is not just a refuge; it is a crucible of tension, where every glance and gesture carries weight."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates",
    "timeFlow": "Days of mounting suspicion and hidden agendas",
    "mood": "tense and suspenseful, with an undercurrent of secrecy",
    "eraMarkers": [
      "Radio broadcasting news updates",
      "Rationed wartime vehicles parked outside",
      "Early television flickering in the lounge",
      "Telegram services sending urgent messages"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air mixed with damp wood",
      "secondary": [
        "faint perfume of vintage cologne",
        "scent of wet earth and seaweed"
      ]
    },
    "paragraphs": [
      "The air hangs heavy with the scent of salt and damp wood, a reminder of the sea’s relentless presence. Each gust of wind carries the distant sound of waves crashing against the cliffs, punctuated by the occasional squawk of a gull. Inside, the hotel exudes a sense of timelessness, with the polished marble floors reflecting the soft glow of gas lamps. The faint rustle of silk dresses blends with the sound of whispered conversations, creating an atmosphere thick with intrigue.",
      "As the day wanes, shadows stretch across the lobby, casting an air of mystery over the guests. The radio crackles softly, delivering news of the war, while the smell of freshly brewed coffee mingles with the lingering aroma of cigars. Guests exchange glances, their expressions revealing the weight of unspoken thoughts. The hotel, with its grand architecture and hidden corners, stands as both a refuge and a stage for the unfolding drama of human emotion and deception."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Ocean-Facing Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A small, elegantly furnished room with an ocean view, featuring a canopied bed and heavy drapes drawn tight. The decor is a mix of Art Deco patterns and Colonial artifacts, with a large mirror reflecting the tumultuous sea.",
      "sensoryDetails": {
        "sights": [
          "stormy sea crashing against rocks",
          "heavy drapes casting shadows",
          "elegant furnishings in disarray",
          "broken glass on the floor"
        ],
        "sounds": [
          "waves crashing against the cliff",
          "wind howling through cracks",
          "distant thunder rumbling",
          "silence punctuated by a ticking clock"
        ],
        "smells": [
          "saltwater mingling with perfume",
          "freshly cut flowers wilting",
          "faint whiff of tobacco smoke",
          "scent of damp upholstery"
        ],
        "tactile": [
          "cold glass shards underfoot",
          "soft silk of the bedspread",
          "chill of the sea breeze",
          "rough texture of the wall plaster"
        ]
      },
      "accessControl": "Access restricted to registered guests; staff must knock and announce themselves. Room remains locked after sunset.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down window panes",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady drumming of rain",
            "gulls calling through the mist"
          ],
          "smells": [
            "damp earth",
            "wet fabric from the curtains"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting muted colors",
            "shadows creeping across the room"
          ],
          "sounds": [
            "silence interrupted by the ticking clock",
            "occasional creak of the building"
          ],
          "smells": [
            "faint scent of mildew",
            "scent of old leather"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "long shadows stretching across the floor"
          ],
          "sounds": [
            "gentle lapping of waves",
            "muffled laughter from the lounge below"
          ],
          "smells": [
            "scent of candle wax",
            "hint of sea breeze"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Ocean-Facing Room, once a sanctuary, now stands as a grim reminder of the peril that lurks within the hotel's walls. The elegant furnishings lie in disarray, a stark contrast to the tranquil view of the sea. Broken glass glitters on the floor, each shard a testament to the chaos that unfolded. Outside, the waves crash relentlessly against the cliffs, echoing the turmoil inside. The air is thick with the mingling scents of salt and wilting flowers, a haunting reminder of a life interrupted.",
        "As the light shifts through the rain-streaked windows, the room takes on an ominous atmosphere. The distant sound of thunder rumbles, a fitting backdrop to the tension that envelops the space. Shadows dance along the walls, creating an unsettling sense of being watched. This room, once filled with laughter and warmth, now holds secrets that threaten to unravel the very fabric of the Cliffside Seaside Hotel."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A spacious lobby with high ceilings adorned with Art Deco chandeliers, plush velvet seating, and a reception desk made of polished mahogany.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate glass chandelier",
          "guests in fashionable attire",
          "potted palms framing the entrance"
        ],
        "sounds": [
          "soft murmurs of conversation",
          "clacking of heels on marble",
          "distant music from a radio",
          "the rustle of newspapers"
        ],
        "smells": [
          "freshly brewed coffee",
          "scent of polished wood",
          "faint floral bouquet from arrangements",
          "hint of cigar smoke"
        ],
        "tactile": [
          "smooth marble underfoot",
          "plush velvet of armchairs",
          "coolness of the reception desk",
          "warmth of sunlight through windows"
        ]
      },
      "accessControl": "Open to all guests and visitors during daylight hours; monitored by staff at all times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked guests entering",
            "glossy reflections on the floor"
          ],
          "sounds": [
            "pitter-patter of rain on the roof",
            "splash of umbrellas opening"
          ],
          "smells": [
            "damp wool from raincoats",
            "scent of wet stone"
          ],
          "mood": "discomforting bustle"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting soft shadows",
            "guests huddled in corners"
          ],
          "sounds": [
            "quiet conversations hushed",
            "the ticking of an ornate clock"
          ],
          "smells": [
            "beeswax polish",
            "dust motes in the air"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of lamps",
            "sparkling reflections on the marble"
          ],
          "sounds": [
            "laughter echoing",
            "clinking of glasses from the bar"
          ],
          "smells": [
            "scent of fresh pastries",
            "hint of whiskey"
          ],
          "mood": "relaxed yet watchful"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of the Cliffside Seaside Hotel is a testament to elegance and sophistication. Its high ceilings are adorned with shimmering chandeliers, casting a warm glow over the marble floors. Plush velvet armchairs invite guests to linger, while the reception desk stands ready to assist weary travelers. Yet beneath the surface of this refined atmosphere lies a current of tension, as guests exchange glances laden with unspoken thoughts.",
        "As rain patters against the windows, the lobby fills with the sound of hurried footsteps and the rustle of newspapers. The scent of freshly brewed coffee mingles with the faint aroma of cigars, creating an atmosphere both inviting and unsettling. In this gathering space, every whisper and every glance seems charged with significance, as if the very walls are privy to the secrets that unfold within."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Dining Room",
      "type": "interior",
      "purpose": "Dining and social interaction",
      "visualDetails": "An opulent dining room with long tables set for dinner, adorned with crisp white linens and silver cutlery. Large windows offer a view of the churning sea.",
      "sensoryDetails": {
        "sights": [
          "long tables elegantly set",
          "crystal glassware catching light",
          "ocean waves visible through windows",
          "floral centerpieces in full bloom"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft music from a gramophone",
          "laughter and chatter of guests",
          "the roar of the sea outside"
        ],
        "smells": [
          "scent of roasted meats",
          "freshly baked bread",
          "aroma of rich red wine",
          "hint of citrus from desserts"
        ],
        "tactile": [
          "smoothness of the tablecloth",
          "coolness of glassware",
          "weight of silver cutlery",
          "softness of upholstered chairs"
        ]
      },
      "accessControl": "Dining area open to all guests during meal times; reservations required for evening dining.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through raindrops",
            "wet surfaces reflecting light"
          ],
          "sounds": [
            "muffled raindrops on the roof",
            "soft clatter of breakfast dishes"
          ],
          "smells": [
            "freshly brewed tea",
            "scent of damp pastries"
          ],
          "mood": "cozy yet melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "gloomy light casting a pall",
            "guests huddled in quiet conversations"
          ],
          "sounds": [
            "low murmur of voices",
            "clinking of glasses"
          ],
          "smells": [
            "scent of stewing vegetables",
            "aroma of brewing coffee"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "glimmer of silverware"
          ],
          "sounds": [
            "lively chatter filling the room",
            "soft strains of music"
          ],
          "smells": [
            "scent of grilled fish",
            "hint of herbs and spices"
          ],
          "mood": "festive and lively"
        }
      ],
      "paragraphs": [
        "The Dining Room of the Cliffside Seaside Hotel is a grand space, where elegance meets the charm of seaside dining. Long tables are meticulously set, adorned with crisp linens and shining cutlery, ready to host an evening of indulgence. As guests gather, the air fills with the tantalizing aromas of roasted meats and freshly baked bread, drawing them into a world of culinary delight. Yet, amidst the laughter and chatter, an undercurrent of tension lingers, as eyes dart to the windows, watching the tumultuous sea.",
        "As evening approaches, the room transforms under the glow of candlelight, casting flickering shadows that dance across the walls. The sound of clinking glasses and soft music creates a lively atmosphere, but the distant roar of the ocean serves as a reminder of the storm brewing outside—and possibly within the hearts of the guests. In this dining room, every meal is a feast for the senses, yet each bite is tinged with the taste of unspoken fears and hidden motives."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Quiet reading and contemplation space",
      "visualDetails": "A cozy library lined with shelves of books, featuring leather armchairs, a large fireplace, and heavy drapes that block out the outside world.",
      "sensoryDetails": {
        "sights": [
          "glow of the fireplace",
          "rich wood paneling",
          "heavy curtains drawn tight"
        ],
        "sounds": [
          "crackling fire",
          "soft rustle of pages turning",
          "distant echoes of footsteps",
          "quiet ticking of a clock"
        ],
        "smells": [
          "scent of aged paper",
          "aroma of burning wood",
          "hint of leather bindings",
          "faint smell of dust"
        ],
        "tactile": [
          "soft leather of armchairs",
          "warmth from the fireplace",
          "coolness of the book covers",
          "texture of woven carpets"
        ]
      },
      "accessControl": "Access limited to guests during library hours; staff may enter for maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops trickling down window panes",
            "dim light filtering through clouds"
          ],
          "sounds": [
            "steady patter of rain",
            "soft crackle of the fire"
          ],
          "smells": [
            "scent of wet pages",
            "aroma of fresh coffee"
          ],
          "mood": "introspective and serene"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the room",
            "dim light filtering through heavy curtains"
          ],
          "sounds": [
            "silence interrupted by a clock ticking",
            "soft whispers of turning pages"
          ],
          "smells": [
            "scent of musty books",
            "hint of smoke from the fireplace"
          ],
          "mood": "suspenseful isolation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight flickering across the room",
            "golden hues of the setting sun"
          ],
          "sounds": [
            "soft crackle of the fire",
            "muffled laughter from the lobby"
          ],
          "smells": [
            "scent of burning wood",
            "hint of leather"
          ],
          "mood": "cozy yet watchful"
        }
      ],
      "paragraphs": [
        "The library of the Cliffside Seaside Hotel offers an escape into the world of literature, with its shelves lined with dusty tomes and the inviting glow of a crackling fire. Plush leather armchairs beckon guests to sink in and lose themselves in the pages of a book. Yet, as the wind howls outside, the atmosphere grows heavy with the weight of secrets. The distant echoes of footsteps remind visitors that they are not alone, and the ticking clock serves as a reminder that time is running out.",
        "In the quiet of the library, the scent of aged paper mingles with the aroma of burning wood, creating a cocoon of warmth. As rain patters against the windows, the space transforms into a sanctuary of introspection. However, beneath the serene surface lies a current of suspense, as the shadows lengthen and the outside world fades away. In this room, every word read could hold the key to unraveling the mysteries that lie within the hotel’s walls."
      ]
    }
  ],
  "note": "",
  "cost": 0.0024099108,
  "durationMs": 25134
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1947,
    "month": "February",
    "day": 14,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast with intermittent rain",
      "cool temperatures averaging 40°F",
      "gale-force winds from the sea"
    ],
    "daylight": "Short days with twilight settling by 5:30 PM, creating a dim and eerie atmosphere",
    "time_of_day_of_crime": "Late evening — between nine and eleven o'clock at night, after dinner service",
    "holidays": [
      "Valentine's Day"
    ],
    "seasonalActivities": [
      "walking along the coastal promenade with heavy coats",
      "attending a local Valentine's Day dance at the hotel",
      "enjoying hot cocoa at cafés"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored dark wool suit",
        "crisp white dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed blazer",
        "corduroy trousers",
        "woolen sweater"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "classic wristwatch"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with a fitted waist",
        "pearl necklace",
        "fur stole"
      ],
      "casual": [
        "tweed skirt and cardigan set",
        "blouse with puffed sleeves",
        "ankle-length wool coat"
      ],
      "accessories": [
        "cloche hat",
        "leather handbag",
        "vintage brooch"
      ]
    },
    "trendsOfTheMoment": [
      "utilitarian style reflecting post-war practicality",
      "influence of Hollywood glamour",
      "emphasis on modesty in fashion choices"
    ],
    "socialExpectations": [
      "women expected to balance work and family responsibilities",
      "growing acceptance of diverse social circles",
      "traditional gender roles still prevalent in social settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "political tensions in Europe with the onset of the Cold War",
      "rising influence of the United States in international affairs",
      "domestic issues around labor strikes and housing shortages"
    ],
    "politicalClimate": "A climate of uncertainty and suspicion, particularly regarding communist influence in Europe and labor unrest at home",
    "economicConditions": "Post-war recovery is uneven; some regions experience boom while others struggle with unemployment",
    "socialIssues": [
      "displacement of war veterans",
      "integration of women into the workforce",
      "racial segregation and civil rights movements gaining traction"
    ],
    "internationalNews": [
      "UN's efforts in Palestine",
      "Soviet Union's increasing control over Eastern Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Frank Sinatra's latest crooner hits",
        "The Ink Spots' popular songs"
      ],
      "films": [
        "'The Best Years of Our Lives'",
        "'It's a Wonderful Life'",
        "'Gentleman's Agreement'"
      ],
      "theater": [
        "Broadway hits like 'Finian's Rainbow'",
        "variety shows featuring big bands",
        "local performances at community theaters"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Adventures of Sam Spade'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'The Naked and the Dead' by Norman Mailer",
        "'The Little Prince' by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "hard-boiled detective fiction",
        "post-war realist literature",
        "romantic fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the transistor radio",
        "the first commercial jet airliner prototype",
        "early computers for military applications"
      ],
      "commonDevices": [
        "table radios",
        "typewriters",
        "mechanical adding machines"
      ],
      "emergingTrends": [
        "increased interest in homeownership",
        "growing popularity of television as a family entertainment device",
        "advancements in consumer products from wartime innovations"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "family gatherings around the radio for entertainment",
        "socializing at local dance halls",
        "visiting the local market for fresh produce"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "Saturday night dances at the hotel",
        "Valentine's Day card exchanges"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing divide between wealthy elites and working-class citizens",
      "increased mobility for the middle class"
    ],
    "gender": [
      "women increasingly accepted in the workforce, but still facing societal pressure to conform to domestic roles",
      "ongoing discussions about equality and women's rights"
    ],
    "race": [
      "tensions surrounding racial segregation and civil rights",
      "growing awareness and activism among African Americans"
    ],
    "generalNorms": [
      "traditional family structures still hold significant weight",
      "importance of reputation and social standing within communities"
    ]
  },
  "atmosphericDetails": [
    "The scent of salt in the air mingled with the smell of wet asphalt as rain pattered on the hotel roof",
    "The sound of distant waves crashing against the rocky shoreline provided a haunting backdrop to the evening's suspense",
    "Flickering lights from the hotel lobby cast long shadows, amplifying the tension of whispered conversations and furtive glances"
  ],
  "paragraphs": [
    "In February 1947, the chill of winter grips the coastal town, where overcast skies loom and rain falls intermittently, saturating the air with a briny freshness. The days are short, with twilight descending by 5:30 PM, casting a dim light over the bustling activity at the local hotel. It is a month marked by Valentine's Day, where couples gather for dances and share sweet nothings, while the atmosphere is thick with secrets and intrigue, perfectly suited for a mystery unfolding behind closed doors.",
    "Fashion reflects the era's duality; men don tailored wool suits and geometric ties, while women grace the ballroom in elegant tea-length dresses adorned with pearls and fur stoles. The utilitarian influences of post-war practicality are punctuated by Hollywood glamour, as both genders navigate social expectations amidst shifting norms. These sartorial choices not only signify status but also serve as a shield against the uncertainties of the outside world, where whispers of the Cold War and economic strife linger.",
    "Daily life in February 1947 is a tapestry of resilience and routine. Families gather around radios for entertainment, while the community dances at local halls, the rhythms of Bing Crosby and Frank Sinatra filling the air. Prices are modest—four pence for a loaf of bread and two shillings for a taxi ride—yet the burden of post-war recovery weighs heavily on many. Traditional rituals, like Sunday dinners and Saturday dances, create a sense of stability, even as societal expectations evolve, with women increasingly stepping into the workforce while navigating the lingering shadows of the past."
  ],
  "note": "",
  "cost": 0.0010417572,
  "durationMs": 19940
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A seaside hotel hosts a tense gathering of guests and staff, all grappling with the pressures of post-war society and the secrets that threaten to surface amid rising tides.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The increasing presence of women in the workforce, the lingering trauma of WWII, and emerging Cold War tensions create a volatile social landscape where personal ambitions and hidden truths collide."
  },
  "setting": {
    "location": "A cliffside seaside hotel",
    "institution": "hotel",
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
  "theme": "Golden Age murder driven by a tidal-drowning method, where the flood-tide timetable and shifting sea level fix — and falsify — the window in which the victim could have drowned."
}

### LOCKED_FACTS
[
  {
    "id": "tide_high_time",
    "value": "ten minutes past eleven",
    "description": "The time of high tide when the victim was believed to have drowned."
  },
  {
    "id": "calm_sea_time",
    "value": "twenty minutes past ten",
    "description": "The time when witnesses reported the sea being calm."
  },
  {
    "id": "victim_last_seen",
    "value": "a quarter to twelve",
    "description": "The time the victim was last seen alive in the hotel."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 20,
  "countsByPlacement": {
    "early": 8,
    "mid": 11,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 19,
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
      "category": "testimonial"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_11",
      "placement": "mid",
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
      "id": "clue_15",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_16",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_17",
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
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_2",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_mid_3",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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

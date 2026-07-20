# Actual Prompt Record

- Run ID: `mystery-1784585699975`
- Project ID: ``
- Timestamp: `2026-07-20T22:18:41.974Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `01461190d82266e2`

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
    "title": "Tide of Deceit",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Cannes",
      "place": "A grand seaside hotel with Art Deco architecture",
      "country": "France",
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
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "A charming socialite",
      "private_secret": "Involved in a scandalous affair",
      "motive_seed": "Jealousy from a rival",
      "motive_strength": "moderate",
      "alibi_window": "10:50 PM to 11:10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Beach access from hotel",
        "Dining area"
      ],
      "behavioral_tells": [
        "Frequent visits to the beach",
        "Discreet conversations"
      ],
      "stakes": "Maintaining her reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Doctor",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Has a financial dependency on the victim",
      "motive_seed": "Financial desperation",
      "motive_strength": "high",
      "alibi_window": "10:50 PM to 11:10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel medical supplies",
        "Dining area"
      ],
      "behavioral_tells": [
        "Nervous during conversations",
        "Keeps to herself"
      ],
      "stakes": "Financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Mariner",
      "relationships": [],
      "public_persona": "Adventurous seafarer",
      "private_secret": "Involved in smuggling",
      "motive_seed": "Fear of exposure",
      "motive_strength": "moderate",
      "alibi_window": "10:50 PM to 11:10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Beach access",
        "Onboard boat"
      ],
      "behavioral_tells": [
        "Evasive when asked about whereabouts",
        "Keeps a low profile"
      ],
      "stakes": "Avoiding prison",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Socialite",
      "relationships": [],
      "public_persona": "Charming hostess",
      "private_secret": "Has a rivalry with the victim",
      "motive_seed": "Jealousy and ambition",
      "motive_strength": "high",
      "alibi_window": "10:50 PM to 11:10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining area",
        "Beach access"
      ],
      "behavioral_tells": [
        "Overly friendly",
        "Fidgety when discussing Eleanor"
      ],
      "stakes": "Social status",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Waitress",
      "relationships": [],
      "public_persona": "Friendly staff member",
      "private_secret": "Witnessed something crucial",
      "motive_seed": "Fear of losing job",
      "motive_strength": "low",
      "alibi_window": "10:50 PM to 11:10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining area",
        "Kitchen"
      ],
      "behavioral_tells": [
        "Avoids confrontation",
        "Nervous around management"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Astute investigator",
      "private_secret": "Has past history with Eleanor",
      "motive_seed": "Personal feelings",
      "motive_strength": "low",
      "alibi_window": "10:50 PM to 11:10 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining area",
        "Beach access"
      ],
      "behavioral_tells": [
        "Calm under pressure",
        "Observant"
      ],
      "stakes": "Solving the case",
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
      "summary": "During a lavish dinner at a grand seaside hotel in Cannes, Eleanor Voss mysteriously disappears, only to be found drowned hours later. As Detective Hugo Vane investigates, he uncovers a web of jealousy, ambition, and hidden motives, revealing the true nature of her death."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on drown, though, and witness to expose the false timing.",
      "delivery_path": [
        {
          "step": "The murderer waited for the tide to reach its peak at ten minutes past eleven."
        },
        {
          "step": "The murderer distracted guests at the party while drowning the victim."
        }
      ]
    },
    "outcome": {
      "result": "The victim's death is staged as an accidental drowning."
    }
  },
  "false_assumption": {
    "statement": "Eleanor must have drowned while everyone was at the party.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses thought the victim was inside the hotel during the timeframe.",
    "what_it_hides": "The murder occurred shortly after she left the party."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses reported seeing him near the beach around the time of the incident.",
      "He had the means to access the beach without being noticed."
    ],
    "the_one_flaw": "He was seen in the dining area just before the drowning occurred.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken bottle is found near the beach, suggesting a fight.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The bottle belonged to another guest who had an unrelated argument in the dining area.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A tide chart is discovered showing high tide at a different time.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The chart was outdated and did not reflect the current tide schedule.",
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
    "rationale": "All suspects were present at the hotel during the incident."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "High tide at 11:10 PM"
      ],
      "windows": [
        "10:50 PM to 11:10 PM"
      ],
      "contradictions": [
        "Witnesses recall seeing Eleanor at the dining area until 11:00 PM."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Beach access",
        "Dining area"
      ],
      "permissions": [
        "Allowed to roam the hotel premises"
      ]
    },
    "physical": {
      "laws": [
        "Tidal patterns are predictable based on the lunar cycle."
      ],
      "traces": [
        "Footprints leading from the hotel to the beach."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust the staff implicitly."
      ],
      "authority_sources": [
        "Doctors have credibility in emergencies."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall Eleanor leaving the party at ten minutes to eleven.",
        "correction": "This indicates she left the party significantly earlier than previously thought.",
        "effect": "Narrows time window for her drowning to after 11:00 PM.",
        "required_evidence": [
          "Witness statements about Eleanor's departure time.",
          "Time logs of the party activities."
        ],
        "reader_observable": true
      },
      {
        "observation": "A tide table indicates high tide was at ten minutes past eleven.",
        "correction": "This confirms the timeline for when drowning could have occurred.",
        "effect": "Eliminates the idea that Eleanor drowned during the party.",
        "required_evidence": [
          "Tide table showing specific tide times.",
          "Witness testimony about the high tide."
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints lead from the hotel to the beach.",
        "correction": "These footprints suggest someone left the party unnoticed.",
        "effect": "Narrows down suspects who had access to the beach around that time.",
        "required_evidence": [
          "Physical evidence of footprints.",
          "Hotel floor plans showing access routes."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Reenact guests' movements during the party to reveal who could have left unnoticed.",
    "knowledge_revealed": "The footprints lead directly to the beach, proving someone left the party.",
    "pass_condition": "Only Dr. Mallory Finch has the means and opportunity to drown Eleanor unnoticed.",
    "evidence_clues": [
      "clue_6",
      "clue_5",
      "clue_3",
      "clue_id_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements reveal Eleanor's departure (early). Step 2: The tide table confirms the high tide timing (mid) eliminating the party drowning theory. Step 3: Footprint evidence shows access to the beach (late)."
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
        "clearance_method": "Witness testimony confirms he was in the dining area.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "The broken bottle is traced to another guest.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her whereabouts are accounted for by other staff.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 10:50 PM to 11:10 PM",
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
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Tide table discovery"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
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
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Direct observation"
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
    "summary": "Eleanor Voss, the poised manager of a luxury hotel in Cannes, appears to embody the very essence of authority and efficiency. Yet, beneath her polished exterior lies a web of deceit that threatens to unravel her carefully constructed world.",
    "publicPersona": "A poised and assertive manager known for her strict policies and efficient operation of the hotel.",
    "privateSecret": "She has been embezzling funds from the hotel for years, fearing exposure from the victim.",
    "motiveSeed": "Fears that the victim will expose her financial misconduct during the upcoming audit.",
    "motiveStrength": "strong",
    "alibiWindow": "was in the office from 8 to 9 PM",
    "accessPlausibility": "easy",
    "stakes": "Losing her position and reputation at the hotel.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Her speech is crisp and formal, often laced with a touch of condescension, especially when addressing staff. She uses precise language but occasionally slips into a more casual tone when frustrated.",
    "signatureTic": "‘One must maintain standards, after all.’",
    "internalConflict": "Eleanor wrestles with the fear of exposure and the weight of her own dishonesty, grappling with the possibility of losing everything she has built.",
    "personalStakeInCase": "The crime strikes at the heart of her carefully curated life; if the truth emerges, her career and reputation will be irrevocably tarnished.",
    "paragraphs": [
      "Eleanor Voss stood at the helm of the Hotel Belle Époque, a bastion of elegance nestled in the sun-drenched streets of Cannes. With her hair swept into a tight bun and a tailored suit that whispered authority, she commanded the respect of her staff and guests alike. To the world, she was a paragon of managerial excellence; behind closed doors, however, she was an architect of deception. For years, she had siphoned funds from the hotel's accounts, her heart pounding with each transaction, the fear of exposure gnawing at her insides.",
      "Her life was a delicate balance; one wrong move could send everything crashing down. The upcoming audit loomed like a storm cloud, and when the victim threatened to expose her financial misconduct, Eleanor's world tilted dangerously. The thought of losing her position and reputation was unbearable, and the lengths she would go to preserve them became a dark mantra in her mind. ‘One must maintain standards, after all,’ she would remind herself, a twisted justification for her increasingly desperate actions.",
      "Eleanor's interactions with her staff were often a performance, a carefully choreographed dance of authority and control. Yet, there were moments when her composure cracked, revealing glimpses of the panic that simmered beneath. Her polite savagery came through in her remarks, as she wielded her words like weapons, leaving those around her feeling both valued and threatened. The duality of her nature was an exhausting mask to wear, but it was one she had perfected over the years.",
      "As the shadow of the victim loomed larger, Eleanor found herself at a crossroads. Would she confront her fears, potentially facing the consequences of her actions, or would she spiral further into the abyss of deceit? The answer lay buried within her, a reflection of the darkness she had nurtured for far too long. In the end, the stakes were not just about money; they were about her identity, her very existence within a world that thrived on appearances."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician with a reputation for her no-nonsense approach, harbors a dark secret. Her dedication to patient care is overshadowed by the unethical experiments she conducts, and the threat of exposure hangs over her like a guillotine.",
    "publicPersona": "A respected doctor who is known for her dedication to patient care and her no-nonsense attitude.",
    "privateSecret": "Has been conducting unethical experiments on patients, fearing the victim's medical board report will ruin her career.",
    "motiveSeed": "The victim discovered her unethical practices and threatened to report her to the medical board.",
    "motiveStrength": "strong",
    "alibiWindow": "attending a charity dinner from 7 to 10 PM",
    "accessPlausibility": "unlikely",
    "stakes": "Her career as a physician is at stake if her practices are revealed.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.3,
    "speechMannerisms": "Dr. Finch speaks in a clipped, clinical manner, often punctuating her sentences with dry humor. She tends to use medical jargon, but her tone softens when discussing her patients.",
    "signatureTic": "‘In medicine, as in life, there are no guarantees.’",
    "internalConflict": "Dr. Finch is torn between her ambition and her moral compass, grappling with the consequences of her unethical choices and the potential fallout from the victim's discovery.",
    "personalStakeInCase": "The case is personal to her because her career and reputation are on the line, and she fears losing everything she has worked for.",
    "paragraphs": [
      "Dr. Mallory Finch was a woman of science, a beacon of hope to her patients, yet beneath her polished exterior lay a murky undercurrent of ambition. Known for her no-nonsense attitude, she commanded respect in the medical community, but her methods were anything but conventional. As whispers of her unethical experiments began to circulate, her world became a precarious tightrope walk, with the victim threatening to expose her practices looming like a specter on the horizon.",
      "At a charity dinner, where the elite mingled and pretended to care, Mallory found herself trapped between her dual personas. To the public, she was a paragon of virtue; in the shadows, she was a woman willing to sacrifice her ethics for the sake of her career. A chill crept down her spine as she recalled the victim's threats, the words hanging in the air like a noose. ‘In medicine, as in life, there are no guarantees,’ she often reminded herself, but the stakes had never felt so high.",
      "Her speech was often laced with dry wit, a defense mechanism against the weight of her conscience. When discussing her patients, her tone softened, revealing a flicker of compassion; however, that compassion was overshadowed by the fear of losing her esteemed position. The irony of her situation was not lost on her: she had dedicated her life to healing, yet here she was, poised to become a cautionary tale of ambition gone awry.",
      "As she navigated the glittering social scene, Mallory was acutely aware of the knife's edge she was walking. Would she confront her choices and seek redemption, or would she double down on her secrecy, entangled in her own web of lies? The answer was as elusive as the truth she had twisted into her own narrative, and with each passing moment, the shadows of her past loomed larger, threatening to consume her whole."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, exudes charm and authority, but hides a past riddled with dark secrets. As the threat of exposure looms, he must navigate the treacherous waters of his own making.",
    "publicPersona": "A charming yet domineering figure with a storied past in the navy, often reminiscing about his glory days.",
    "privateSecret": "He has been using the hotel for clandestine meetings to cover up his war crimes.",
    "motiveSeed": "Victim had threatened to expose his dark past, jeopardizing his respected status in the community.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in his room from 8:30 to 9:30 PM",
    "accessPlausibility": "possible",
    "stakes": "His reputation and freedom could be lost if his past is revealed.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Ivor has a commanding presence, speaking with a deep, resonant voice that often carries a sardonic undertone. His anecdotes are laced with sarcasm, and he enjoys punctuating conversations with dramatic flair.",
    "signatureTic": "‘In my day, we did things differently.’",
    "internalConflict": "Ivor grapples with the weight of his past actions, torn between the desire for redemption and the fear of losing the respect he has cultivated since retirement.",
    "personalStakeInCase": "The case is personal for him as it threatens to unravel the respect and status he has fought to maintain since leaving the navy.",
    "paragraphs": [
      "Captain Ivor Hale, a figure of authority with a storied past, navigated the corridors of the Hotel Belle Époque with the air of a man who had seen it all. His charm was undeniable, but beneath that polished exterior lay a past riddled with dark secrets. The retired naval officer often regaled guests with tales of his glory days, but the memories he cherished were overshadowed by the clandestine meetings he conducted within the hotel’s walls, a façade carefully crafted to mask his war crimes.",
      "When the victim threatened to expose his sordid past, Ivor felt the ground shift beneath him. The stakes were suddenly much higher; his reputation, built on years of respect and admiration, was at risk of crumbling. ‘In my day, we did things differently,’ he would say, a sardonic twist to his words that masked the fear simmering beneath. The irony of his situation was not lost on him; the very thing he had fought to protect now threatened to destroy him.",
      "His speech was often laced with sarcasm, a defense mechanism that allowed him to deflect deeper questions about his past. With a commanding presence, he could draw people in with his stories, yet he found himself increasingly aware of the shadows lurking just behind his charming façade. Ivor’s anecdotes, once a source of pride, began to feel like chains binding him to a past he could not escape.",
      "As he faced the possibility of exposure, Ivor found himself at a crossroads, wrestling with the question of whether he could atone for his past or if he would continue to weave a tapestry of lies. The allure of redemption beckoned, but so did the familiar comfort of deceit. The tide was shifting, and Ivor knew that the choices he made in the coming days would determine not only his fate but the legacy he would leave behind."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious waitress, finds herself entangled in a dangerous affair with the victim. As betrayal looms, she must confront her feelings and the precarious nature of her aspirations.",
    "publicPersona": "An eager and bright young woman, willing to work hard to rise in the hospitality industry.",
    "privateSecret": "She has been in a relationship with the victim and has been manipulated into a compromising position.",
    "motiveSeed": "Felt betrayed by the victim's plans to leave the hotel and her behind, threatening to expose their affair.",
    "motiveStrength": "moderate",
    "alibiWindow": "was serving tables until 9:15 PM",
    "accessPlausibility": "easy",
    "stakes": "Her future in the hospitality industry and her reputation are at risk if their affair is revealed.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with youthful exuberance, often punctuating her sentences with quick, nervous laughter. She tends to use informal language and can be surprisingly blunt when frustrated.",
    "signatureTic": "‘Honestly, what were they thinking?’",
    "internalConflict": "Beatrice is torn between her aspirations and her feelings of betrayal, struggling to navigate the complexities of her relationship with the victim.",
    "personalStakeInCase": "The case matters deeply to her as it threatens her future in the hospitality industry and the reputation she has worked hard to build.",
    "paragraphs": [
      "Beatrice Quill was the epitome of youthful ambition, her bright smile and eager demeanor lighting up the corridors of the Hotel Belle Époque. Yet, beneath the surface of her cheerful exterior lay a tumultuous sea of emotions. Her relationship with the victim had begun as a thrilling dalliance, but as the threat of exposure loomed, the air turned heavy with betrayal. ‘Honestly, what were they thinking?’ she would often mutter, reflecting on the precarious position she found herself in.",
      "Serving tables until the late hours, Beatrice balanced her aspirations with the complexities of her personal life. The victim’s plans to leave the hotel and her behind sent shockwaves through her, igniting a fire of resentment that threatened to consume her. The stakes were high; her future in the hospitality industry hinged on maintaining her reputation, and the affair was a ticking time bomb just waiting to explode.",
      "Her speech was marked by youthful exuberance, punctuated with quick laughter that often masked her anxiety. When frustrated, her tone became surprisingly blunt, revealing the fierce determination that lay beneath her innocent façade. Beatrice was a woman caught in the crossfire of her desires and the harsh realities of her ambitions, and she felt the weight of the world pressing down on her shoulders.",
      "As the shadows of betrayal closed in, Beatrice faced a critical choice: would she allow her desperation to drive her to darker paths, or could she find the strength to rise above the turmoil? The answer lay within her, a reflection of the woman she aspired to be, and the risks she was willing to take to ensure her dreams were not dashed by the cruel hand of fate."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a glamorous socialite, is ensnared in a web of financial deceit. As the threat of exposure looms, she must navigate the treacherous waters of high society while maintaining her façade.",
    "publicPersona": "A glamorous socialite known for her charm and connections in high society.",
    "privateSecret": "She is deeply in debt and has been using her connections to finance her lifestyle unethically.",
    "motiveSeed": "The victim was about to expose her financial troubles to their social circle, risking her social standing.",
    "motiveStrength": "moderate",
    "alibiWindow": "was attending a cocktail party from 7 to 10 PM",
    "accessPlausibility": "unlikely",
    "stakes": "Her entire social life and status could collapse if her debts are revealed.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia speaks with a smooth elegance, often employing sophisticated language. She has a penchant for dramatic flair and subtly cutting remarks hidden beneath a polished veneer.",
    "signatureTic": "‘One must always keep appearances, darling.’",
    "internalConflict": "Sylvia is torn between her desire to maintain her lavish lifestyle and the fear of losing her social standing, grappling with the consequences of her financial choices.",
    "personalStakeInCase": "The case is personal for her as it threatens to unravel her carefully constructed social life and expose her debts to the world.",
    "paragraphs": [
      "Sylvia Trent glided through the cocktail party, a vision of glamour and sophistication, yet beneath her polished exterior lay the cracks of desperation. A socialite revered for her charm and connections, she had crafted an image that masked the truth of her financial woes. As whispers of her debts began to circulate, the victim's threat to expose her troubles sent shivers down her spine. ‘One must always keep appearances, darling,’ she would remind herself, a mantra that became increasingly difficult to uphold.",
      "Her speech was a symphony of smooth elegance, each word chosen with care, yet her ability to charm masked a biting wit that could slice through any pretense. Sylvia's interactions were often laced with polite savagery, her sophisticated language concealing the turmoil that bubbled beneath. The cocktail party was a stage, and she was the leading lady, but the fear of losing her status loomed like a dark cloud overhead.",
      "As the victim threatened to expose her debts, Sylvia felt the walls closing in. The stakes had never been higher; her entire social life hinged on maintaining her façade. Each connection she had cultivated was a fragile thread, and the prospect of losing it all was a nightmare she could not bear to face. Torn between her desire for opulence and the reality of her situation, Sylvia grappled with the consequences of her choices.",
      "In the face of impending exposure, she found herself at a crossroads. Would she confront the truth and risk her lavish lifestyle, or would she manipulate the situation further, weaving an even more intricate web of deceit? The answer lay within her, a reflection of the lengths she was willing to go to preserve her status, and the price she was willing to pay to keep her secrets safe."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a determined journalist, finds himself embroiled in a web of scandal as he investigates corruption within the hotel. With a personal connection to the victim, he must navigate the murky waters of truth and deception.",
    "publicPersona": "A determined journalist with a knack for uncovering scandals, often seen as intrusive.",
    "privateSecret": "He was secretly investigating the hotel for a story on corruption and had a personal connection to the victim.",
    "motiveSeed": "The victim had hinted at critical information regarding corruption within the hotel that could endanger Hugo's career.",
    "motiveStrength": "moderate",
    "alibiWindow": "was at the hotel bar from 8 to 9 PM",
    "accessPlausibility": "easy",
    "stakes": "His career as a journalist and his integrity could be ruined if he can't uncover the truth.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks with a casual yet sharp tone, often employing dry humor to deflect tension. He has a penchant for asking probing questions and can be quite direct when pursuing a story.",
    "signatureTic": "‘Truth is a slippery fish, isn’t it?’",
    "internalConflict": "Hugo struggles with the tension between his journalistic integrity and the personal connection he has to the victim, torn between ambition and loyalty.",
    "personalStakeInCase": "The crime hits close to home for him, as it threatens both his career and the integrity he has built as a journalist.",
    "paragraphs": [
      "Hugo Vane was a man on a mission, a journalist whose reputation for uncovering scandals preceded him. His determination often bordered on intrusive, yet he believed that the truth was a currency worth pursuing. The Hotel Belle Époque, a gilded facade hiding secrets within its walls, had become the focus of his latest investigation. However, this time, the stakes were personal; the victim had hinted at critical information that could unravel the corruption lurking beneath the surface.",
      "At the hotel bar, where shadows danced and whispers flowed like the wine, Hugo found himself wrestling with conflicting emotions. His connection to the victim complicated matters, casting a pall over his journalistic instincts. ‘Truth is a slippery fish, isn’t it?’ he would quip, masking the tension that threatened to overwhelm him. The pressure to uncover the truth weighed heavily on his shoulders, and the fear of losing his integrity gnawed at him.",
      "His speech was casual yet sharp, a blend of observational humor and directness that often caught others off guard. Hugo had a knack for asking probing questions, sometimes to the point of discomfort, but it was this tenacity that had earned him his place in the journalistic world. Yet, as he delved deeper into the web of deceit surrounding the hotel, he found himself questioning the cost of his ambition.",
      "The case was more than just a story for Hugo; it was a test of his values and the integrity he had built over the years. Would he choose to expose the truth, risking his connection to the victim, or would he allow his emotions to cloud his judgment? The answer lay in the murky waters of his own conscience, and with each revelation, the line between right and wrong blurred further, leaving him to navigate a path fraught with danger."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "L'Hôtel de la Mer",
    "type": "hotel",
    "place": "Cannes",
    "country": "France",
    "summary": "A grand Art Deco hotel overlooking the azure waters of the French Riviera, where elegance meets intrigue.",
    "visualDescription": "The hotel features sweeping curves and geometric designs, with polished marble floors and ornate brass fixtures. Tall windows frame stunning ocean views, and the lobby is adorned with lush tropical plants and plush seating.",
    "atmosphere": "A blend of opulence and dread, creating an air of uncertainty.",
    "paragraphs": [
      "L'Hôtel de la Mer stands majestically against the backdrop of the turbulent sea, its Art Deco facade gleaming even under the grey skies. The lobby, a grand expanse of polished marble and brass, welcomes guests with an air of faded glamour, where whispers of secrets mingle with the salty breeze. The distant sound of waves crashing against the shore forms a paradoxical lullaby, soothing yet foreboding, as if the ocean itself holds the answers to the mysteries lurking within the hotel's walls.",
      "Guests glide through narrow hallways, their footsteps echoing softly against the cool marble tiles, passing doors that guard untold stories. The air is thick with the scent of damp sea air and the lingering aroma of expensive perfumes, masking the tension that simmers just beneath the surface. Outside, the weather shifts, casting shadows that dance across the lobby, hinting at the secrets that may soon come to light.",
      "As the day unfolds, the atmosphere grows heavier, punctuated by the occasional crack of thunder in the distance. The hotel is a microcosm of post-war Europe, where the glamour of the Riviera clashes with the harsh realities of a world still grappling with the aftermath of conflict. In this place of beauty, danger lurks, and every glance exchanged could be the key to unraveling the tide of deceit that threatens to engulf them all."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain showers",
    "timeFlow": "Days filled with mounting tension and uncertainty",
    "mood": "tense and suspenseful, reflecting post-war uncertainties",
    "eraMarkers": [
      "Art Deco architecture and decor",
      "Radio broadcasts in the lobby",
      "Limited transport options due to rationing"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and dampness",
      "secondary": [
        "faint perfume of exotic flowers",
        "crisp scent of polished marble"
      ]
    },
    "paragraphs": [
      "The atmosphere is thick with anticipation, as the ocean's roar becomes a constant reminder of the isolation outside. Guests wander through the hotel, their laughter echoing hollowly against the grandeur, while the low hum of a radio broadcasts news from a world still grappling with its demons. Each corner of the hotel holds the potential for revelation or betrayal, where every shadow could conceal a clue.",
      "In the dining area, the clinking of cutlery and soft murmurs compete with the rhythmic crash of waves. The scent of fresh seafood mingles with hints of cigarette smoke, creating a heady mix that both entices and unsettles. As the sun struggles to break through the clouds, the mood shifts, and the tension in the air becomes almost palpable, as if the hotel itself is holding its breath."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space and social hub",
      "visualDetails": "Expansive marble floors, brass accents, and lush tropical plants",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate brass chandeliers",
          "tall windows framing ocean views",
          "lush greenery in corners",
          "art deco murals on walls"
        ],
        "sounds": [
          "soft murmurs of conversation",
          "clinking glasses",
          "distant waves crashing",
          "footsteps echoing on marble",
          "the hum of a radio"
        ],
        "smells": [
          "salty sea air",
          "freshly polished marble",
          "exotic floral perfumes",
          "cigarette smoke",
          "lingering traces of cologne"
        ],
        "tactile": [
          "cool marble underfoot",
          "plush velvet seating",
          "smooth brass railings",
          "soft silk curtains",
          "gentle ocean breeze from open windows"
        ]
      },
      "accessControl": "Open to all guests, but staff-only areas are accessed through locked doors.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked marble",
            "grey light filtering through clouds",
            "puddles forming at the entrance"
          ],
          "sounds": [
            "steady rain drumming on the roof",
            "soft whispers of guests",
            "water trickling from the awnings"
          ],
          "smells": [
            "damp earth",
            "fresh rain on stone",
            "scent of wet flowers"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light across the lobby",
            "shadows creeping along the walls",
            "clouds gathering in the sky"
          ],
          "sounds": [
            "silence punctuated by distant thunder",
            "the creak of furniture",
            "the rustle of newspaper pages"
          ],
          "smells": [
            "beeswax from polished surfaces",
            "dust motes in the air",
            "faint scent of coffee"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "glistening reflections of the sea"
          ],
          "sounds": [
            "the tick of a clock",
            "distant laughter from the dining area",
            "soft music from a gramophone"
          ],
          "smells": [
            "warmth of candle wax",
            "smoky aroma from the kitchen",
            "scent of fresh bread"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the heart of L'Hôtel de la Mer, where guests from various walks of life converge under the opulent glow of brass chandeliers. Polished marble gleams underfoot, and the air is thick with the mingling scents of sea salt and floral perfumes. Here, amid the whispers and laughter, secrets are exchanged and alliances formed, all under the watchful gaze of the hotel's grand architecture.",
        "Narrow hallways lead off from the lobby, creating a sense of intimacy and isolation. Staff-only doors remain locked, adding an air of mystery to the space. The lobby, while bustling with energy, holds a tension in its atmosphere, as if the walls themselves are privy to the secrets concealed within the hotel."
      ]
    },
    {
      "id": "dining_area",
      "name": "Oceanview Dining Room",
      "type": "interior",
      "purpose": "Dining and social interaction",
      "visualDetails": "Large windows overlooking the beach, elegantly set tables, and soft lighting",
      "sensoryDetails": {
        "sights": [
          "crystal chandeliers sparkling",
          "ocean waves visible through windows",
          "tropical plants in decorative pots",
          "waitstaff in crisp uniforms"
        ],
        "sounds": [
          "clinking cutlery",
          "soft piano music",
          "murmurs of conversation",
          "waves lapping at the shore",
          "the rustle of napkins"
        ],
        "smells": [
          "fresh seafood and herbs",
          "cooked vegetables",
          "warm bread from the oven",
          "scent of fine wine",
          "fragrant coffee"
        ],
        "tactile": [
          "smooth tablecloths",
          "cool glassware",
          "soft upholstery of chairs",
          "warmth from nearby heaters",
          "slightly damp air from the ocean"
        ]
      },
      "accessControl": "Open to all guests during meal times; reservations required for evening dining.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on windowpanes",
            "mist obscuring the horizon",
            "dim light filtering through clouds"
          ],
          "sounds": [
            "soft patter of rain",
            "gentle clinking of breakfast dishes",
            "muffled conversations"
          ],
          "smells": [
            "freshly brewed coffee",
            "toasted pastries",
            "scent of wet earth"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light casting muted tones",
            "shadows creeping across tables",
            "distant thunderclouds on the horizon"
          ],
          "sounds": [
            "clinking of glasses",
            "soft laughter",
            "the occasional crash of waves"
          ],
          "smells": [
            "smoky aroma from the kitchen",
            "scent of herbs",
            "freshly baked goods"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candles flickering on tables",
            "golden light reflecting off glassware",
            "sunset casting warm hues"
          ],
          "sounds": [
            "soft jazz music",
            "laughter mingling with conversation",
            "the gentle crash of waves"
          ],
          "smells": [
            "scent of grilled seafood",
            "sweet aroma of desserts",
            "freshness of the sea"
          ],
          "mood": "elegant anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room is a feast for the senses, where guests savor exquisite meals while gazing at the azure sea beyond. Each table is a tableau of elegance, adorned with fine china and crystal glassware, inviting whispers of romance and intrigue. The air is rich with the scent of culinary delights, mingling with the salty breeze that wafts through the open windows.",
        "As guests indulge in their meals, the atmosphere shifts subtly, shaped by the weather and the mood of the diners. On rainy mornings, the room feels intimate and cozy, while overcast afternoons bring a reflective melancholy. In contrast, clear evenings light up the dining room with a sense of elegant anticipation, where the clinking of glasses and soft laughter mask the tension simmering beneath the surface."
      ]
    },
    {
      "id": "manager_office",
      "name": "Manager's Office",
      "type": "interior",
      "purpose": "Administration and private meetings",
      "visualDetails": "Wood-paneled walls, a large mahogany desk, and a view of the lobby",
      "sensoryDetails": {
        "sights": [
          "dark wood paneling",
          "large mahogany desk cluttered with papers",
          "framed photographs on the walls",
          "a vintage typewriter",
          "a globe on a shelf"
        ],
        "sounds": [
          "soft ticking of a clock",
          "muffled conversations from the lobby",
          "the distant sound of waves"
        ],
        "smells": [
          "old leather and polished wood",
          "scent of ink and paper",
          "faint aroma of tobacco"
        ],
        "tactile": [
          "smooth wood of the desk",
          "cool metal of the typewriter",
          "soft leather of the chair",
          "gentle breeze from an open window",
          "the weight of heavy curtains"
        ]
      },
      "accessControl": "Restricted access; only staff members and management allowed.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops trickling down the window",
            "dim light filtering through clouds",
            "papers slightly damp from humidity"
          ],
          "sounds": [
            "steady rain against the window",
            "occasional rustle of paper",
            "muffled voices from the lobby"
          ],
          "smells": [
            "freshly brewed coffee",
            "scent of damp wood",
            "hint of mildew"
          ],
          "mood": "contemplative"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows lengthening across the desk",
            "the glow of a desk lamp in the gloom",
            "cloudy view of the lobby"
          ],
          "sounds": [
            "the ticking of the clock",
            "distant rumble of thunder",
            "soft rustle of paper"
          ],
          "smells": [
            "scent of old books",
            "smoky aroma from a nearby fireplace",
            "faint scent of coffee"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light casting long shadows",
            "the glow of a desk lamp illuminating papers",
            "the lobby bustling with activity"
          ],
          "sounds": [
            "soft music from the lobby",
            "the murmur of conversations",
            "the tick of the clock"
          ],
          "smells": [
            "scent of polished wood",
            "faint aroma of tobacco",
            "the richness of leather"
          ],
          "mood": "urgent focus"
        }
      ],
      "paragraphs": [
        "The Manager's Office exudes authority and control, a stark contrast to the vibrant chaos of the hotel lobby. Dark wood paneling envelops the room, creating a sense of confinement, while the mahogany desk stands as a bastion of power. Framed photographs and awards adorn the walls, hinting at the history and prestige of L'Hôtel de la Mer.",
        "Access to this space is strictly limited; only the hotel management and select staff may enter. The atmosphere shifts dramatically depending on the weather outside, from the contemplative quiet of a rainy morning to the urgent focus required during clear evenings filled with guests' demands. In this room, decisions are made that could alter the course of events, where every detail is scrutinized and every sound is amplified."
      ]
    },
    {
      "id": "beachfront",
      "name": "Beachfront",
      "type": "exterior",
      "purpose": "Recreation and potential crime scene",
      "visualDetails": "Expansive sandy beach, crashing waves, and rocky outcroppings",
      "sensoryDetails": {
        "sights": [
          "crashing waves against the shore",
          "seagulls wheeling overhead",
          "sunlight glinting off the water",
          "footprints in the sand",
          "distant boats on the horizon"
        ],
        "sounds": [
          "roaring surf",
          "calls of seagulls",
          "whispers of the wind",
          "the soft crunch of sand underfoot",
          "distant laughter from hotel guests"
        ],
        "smells": [
          "salty ocean air",
          "freshly caught fish",
          "scent of sunscreen",
          "the tang of seaweed",
          "faint aroma of coconut"
        ],
        "tactile": [
          "warm sand underfoot",
          "cool water lapping at ankles",
          "rough texture of rocky outcroppings",
          "gentle breeze against the skin",
          "the warmth of sunlight on skin"
        ]
      },
      "accessControl": "Open to the public; however, certain areas near the rocks are less frequented.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey skies reflecting on wet sand",
            "waves crashing with more force",
            "distant lightning flashes"
          ],
          "sounds": [
            "heavy rain hitting the sand",
            "the roar of waves",
            "muffled sounds from the hotel"
          ],
          "smells": [
            "damp sea air",
            "scent of wet sand",
            "faint hint of ozone"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "dark clouds gathering on the horizon",
            "occasional breaks of sunlight"
          ],
          "sounds": [
            "the crash of waves",
            "soft whispers of wind",
            "the rustle of beach grass"
          ],
          "smells": [
            "scent of seaweed",
            "freshness of the ocean",
            "the faint aroma of rain"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset over the water",
            "silhouettes of people along the shore",
            "stars beginning to twinkle"
          ],
          "sounds": [
            "gentle lapping of waves",
            "laughter and chatter from the beach",
            "the call of distant gulls"
          ],
          "smells": [
            "scent of grilled seafood from nearby stalls",
            "warmth of sand",
            "the freshness of the sea"
          ],
          "mood": "serene yet watchful"
        }
      ],
      "paragraphs": [
        "The Beachfront stretches out before the hotel, a canvas of golden sand and azure waves, inviting guests to indulge in the sun and surf. Here, the roar of the ocean serves as both a soundtrack and a reminder of the isolation that surrounds them. Seagulls cry overhead, and the air is thick with the scent of salt and adventure, yet something lingers beneath the surface, a tension that hints at the unknown.",
        "As the day progresses, the beachfront transforms, shifting from the foreboding atmosphere of a rainy morning to the melancholic stillness of an overcast afternoon. Clear evenings bring a sense of serenity, but the watchful eye of the ocean remains, hinting at the secrets that may wash ashore, waiting to be discovered. It is a space of recreation, yet it holds the potential for darker revelations, where the line between leisure and danger blurs."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023899672499999997,
  "durationMs": 30287
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1947,
    "month": "August",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "muggy temperatures with humidity"
    ],
    "daylight": "Long summer days with daylight lingering until nearly eight-thirty in the evening, but the thick clouds often obscure the sun.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as evening activities wind down.",
    "holidays": [
      "No major holidays, but summer vacations are in full swing"
    ],
    "seasonalActivities": [
      "beach outings",
      "picnics in local parks",
      "attending county fairs"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "lightweight linen dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "tweed jacket",
        "high-waisted trousers",
        "oxford shoes"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket square"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length floral dress",
        "tailored blazer",
        "pearl necklace"
      ],
      "casual": [
        "swing skirt",
        "blouse with puffed sleeves",
        "ballet flats"
      ],
      "accessories": [
        "wide-brimmed straw hat",
        "silk scarf",
        "beaded clutch purse"
      ]
    },
    "trendsOfTheMoment": [
      "bold prints and patterns",
      "the rise of the 'New Look' by Dior",
      "increased use of synthetic fabrics"
    ],
    "socialExpectations": [
      "women are encouraged to embrace independence",
      "men are expected to return to traditional roles",
      "youth culture is emerging with more leisure activities"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the beginning of the Cold War tensions",
      "the ongoing decolonization movements in Asia and Africa",
      "the establishment of the United Nations as a force for peace"
    ],
    "politicalClimate": "A mix of optimism for prosperity and anxiety over international tensions; local governments are adjusting to the post-war landscape.",
    "economicConditions": "The economy is recovering, but inflation is rising and shortages of goods remain in some areas, leading to cautious consumer spending.",
    "socialIssues": [
      "racial integration movements gaining momentum",
      "discussions about women's rights in the workplace",
      "housing shortages affecting returning veterans"
    ],
    "internationalNews": [
      "India gains independence from British rule",
      "tensions in Palestine rising as Jewish immigration increases",
      "the Marshall Plan begins aiding European recovery"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Blue Moon' by The Marcels",
        "'Near You' by The Andrews Sisters",
        "'Heartaches' by Ted Weems"
      ],
      "films": [
        "'Gentlemen's Agreement'",
        "'The Best Years of Our Lives'",
        "'Miracle on 34th Street'"
      ],
      "theater": [
        "'Annie Get Your Gun'",
        "'Street Scene'",
        "'The King and I'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Shadow'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Member of the Wedding' by Carson McCullers",
        "'The Catcher in the Rye' by J.D. Salinger",
        "'Invisible Man' by Ralph Ellison"
      ],
      "popularGenres": [
        "post-war fiction",
        "mysteries and detective stories",
        "social commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "transistor radio",
        "first commercial jet airliner",
        "early computers in research labs"
      ],
      "commonDevices": [
        "black-and-white television sets",
        "record players",
        "radios for home use"
      ],
      "emergingTrends": [
        "rise of consumer electronics",
        "advancements in car manufacturing",
        "increased popularity of home appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Cup of coffee: six pence"
      ],
      "commonActivities": [
        "visiting local diners",
        "attending community events",
        "spending evenings listening to the radio"
      ],
      "socialRituals": [
        "evening walks in the neighborhood",
        "Sunday family dinners",
        "gathering for card games after dinner"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "the middle class is expanding as post-war prosperity increases",
      "working class struggles with inflation and housing shortages"
    ],
    "gender": [
      "women's roles are evolving, with many continuing to work post-war",
      "men are slowly returning to traditional roles but face pressure to adapt to changing norms",
      "discussions about equality are becoming more mainstream"
    ],
    "race": [
      "increased dialogue about civil rights and integration",
      "racial tensions in urban areas as communities begin to mix"
    ],
    "generalNorms": [
      "family values are emphasized",
      "traditional gender roles are still prevalent but questioned",
      "anxiety about security in a post-war world"
    ]
  },
  "atmosphericDetails": [
    "The smell of rain-soaked pavement mixed with the faint aroma of blooming summer flowers wafting through the air.",
    "The distant sound of laughter from a nearby county fair contrasts with the tension inside the hotel, where whispers of secrets linger.",
    "The soft hum of radios playing popular music fills the lobby, punctuated by the occasional crackle of thunder, creating an uneasy ambiance."
  ],
  "paragraphs": [
    "In August 1947, the heat of summer still clings to the air, but the skies often remain overcast, casting a pall over the bustling hotel. Rain showers sweep through unexpectedly, leaving the pavements glistening and the atmosphere thick with anticipation. Visitors, many still on their summer vacations, bustle in and out of the hotel, their laughter and chatter a stark contrast to the undercurrents of tension that ripple through the air. The hotel, a refuge for weary travelers, is also a gathering place for those whispering about the uncertainties of the post-war world.",
    "Fashion reflects the duality of this time: men don tailored navy suits with silk ties, while women gracefully navigate their day in tea-length floral dresses, embracing the 'New Look' style that emphasizes femininity. Accessories like fedoras for men and wide-brimmed hats for women complete their outfits, reflecting a society caught between the remnants of wartime austerity and the blossoming optimism of peace. The vibrant patterns and textures of their clothing provide a much-needed reprieve from the somber weather outside, yet they also hint at the complexities of a changing social order.",
    "Daily life within the hotel is marked by the rhythm of routine: guests gather for coffee in the lobby, exchanging stories of their travels, while others tune into the radio to catch the latest news or listen to popular shows like 'Suspense.' Prices remain reasonable, with a loaf of bread costing just four pence, but the specter of inflation looms large, influencing the conversations around the dining tables. Social rituals, such as family dinners and card games, continue to bind people together, though there is an underlying awareness that the world is shifting, with discussions about equality and civil rights gaining traction as the nation grapples with its identity in the aftermath of war."
  ],
  "note": "",
  "cost": 0.0010735626,
  "durationMs": 21699
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A grand seaside hotel hosts a diverse group of guests and staff, all grappling with shifting gender roles and post-war trauma, as a murder unfolds amidst the tension of secrets and societal expectations.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has led to changing gender dynamics, with women increasingly stepping into roles traditionally held by men, creating friction and new alliances among guests and staff."
  },
  "setting": {
    "location": "A grand seaside hotel with Art Deco architecture",
    "institution": "hotel",
    "weather": "overcast with occasional rain showers"
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
    "id": "highest_tide_time",
    "value": "ten minutes past eleven",
    "description": "The exact time of the highest tide when the victim could have drowned."
  },
  {
    "id": "footprint_distance",
    "value": "twenty feet",
    "description": "The distance from the hotel to the point where footprints were found leading to the water."
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
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
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
      "category": "testimonial"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_id_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_id_2",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_3",
      "placement": "early",
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

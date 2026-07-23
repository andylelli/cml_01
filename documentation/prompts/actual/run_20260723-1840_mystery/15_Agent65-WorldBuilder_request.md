# Actual Prompt Record

- Run ID: `mystery-1784832044130`
- Project ID: ``
- Timestamp: `2026-07-23T18:44:31.043Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `2062aab3767812cc`

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
    "author": "Your Name",
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
      "subtype": "impersonation"
    }
  },
  "death_method": "strangled",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charming hostess at the hotel",
      "private_secret": "Hiding a past affair with a prominent figure",
      "motive_seed": "Jealousy and betrayal",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation at stake due to past scandals",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Friend of the victim"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Financial troubles hidden from the public",
      "motive_seed": "Desperation for money",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM - 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical supplies"
      ],
      "behavioral_tells": [],
      "stakes": "Financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Suspect",
      "relationships": [
        "Acquaintance of the victim"
      ],
      "public_persona": "Charismatic naval officer",
      "private_secret": "Involved in a blackmail scheme",
      "motive_seed": "Blackmail",
      "motive_strength": "high",
      "alibi_window": "8:30 PM - 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Naval connections"
      ],
      "behavioral_tells": [],
      "stakes": "Avoiding exposure of secrets",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Suspect",
      "relationships": [
        "Friend of the victim"
      ],
      "public_persona": "Socialite",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Jealousy over Captain Hale's attention",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM - 10:00 PM",
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
      "role_archetype": "Suspect",
      "relationships": [
        "Rival of the victim"
      ],
      "public_persona": "Successful businesswoman",
      "private_secret": "Resentful of the victim's charm",
      "motive_seed": "Professional jealousy",
      "motive_strength": "high",
      "alibi_window": "8:45 PM - 9:45 PM",
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
      "name": "Hugo Vane",
      "age_range": "45-55",
      "role_archetype": "Detective",
      "relationships": [
        "Former colleague of the victim"
      ],
      "public_persona": "Private investigator",
      "private_secret": "Struggling to maintain his reputation",
      "motive_seed": "Desire to prove himself",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM - 11:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Captain Ivor Hale"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a masquerade ball at a modest seaside hotel, Eleanor Voss is found strangled. As her friends and acquaintances gather, secrets unravel and identities blur, revealing a crime rooted in manipulation of authority and deception."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on witness, recall, and seeing to expose the false timing.",
      "delivery_path": [
        {
          "step": "Dr. Finch and Captain Hale switch places during the ball, confusing witnesses."
        },
        {
          "step": "Witnesses are misled by the authority of Dr. Finch's medical credentials."
        }
      ]
    },
    "outcome": {
      "result": "Captain Hale appears to have a solid alibi while committing the murder."
    }
  },
  "false_assumption": {
    "statement": "Dr. Mallory Finch was with Eleanor Voss at the time of the murder.",
    "type": "authority",
    "why_it_seems_reasonable": "Dr. Finch is a respected physician, and witnesses believe they saw her with Eleanor.",
    "what_it_hides": "The actual switch between Hale and Finch."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Witnesses claim to have seen Dr. Finch leaving Eleanor's room shortly before the body was found.",
      "Dr. Finch had access to the victim's private affairs due to their friendship."
    ],
    "the_one_flaw": "Dr. Finch's alibi contradicts the timing of Eleanor's death based on the hotel logs.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses reported seeing Eleanor arguing with Beatrice Quill earlier in the evening.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The argument was about social matters, not related to the murder.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A pair of gloves found near the scene belonged to Dr. Finch.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "Dr. Finch had lent them to Eleanor earlier that evening.",
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
    "rationale": "All suspects were present at the hotel during the murder and had relationships with the victim."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "9:00 PM",
        "10:00 PM"
      ],
      "windows": [
        "9:00 PM - 9:20 PM"
      ],
      "contradictions": [
        "Witnesses claim to have seen Dr. Finch with Eleanor at 9:15 PM, while the murder occurred at 9:10 PM."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Victim's room",
        "Masquerade costumes"
      ],
      "permissions": [
        "Both had access to areas restricted to guests."
      ]
    },
    "physical": {
      "laws": [
        "Acoustics in the hotel can distort sounds, making it difficult to pinpoint the source."
      ],
      "traces": [
        "Distinctive tread patterns from shoes found at the scene."
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses trust Dr. Finch due to her profession."
      ],
      "authority_sources": [
        "Dr. Finch's medical degree lends her credibility."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall seeing Dr. Finch in a blue dress at the time of the murder.",
        "correction": "Dr. Finch was not wearing the blue dress later described by witnesses, indicating she may have switched outfits.",
        "effect": "Eliminates Dr. Finch as the murderer.",
        "required_evidence": [
          "Witness statements regarding attire.",
          "The blue dress was found in the hotel laundry."
        ],
        "reader_observable": true
      },
      {
        "observation": "A pair of shoes with a distinctive tread pattern matching Captain Hale's was found near the scene.",
        "correction": "The tread pattern indicates that Captain Hale was present at the scene.",
        "effect": "Narrows suspects to Captain Hale.",
        "required_evidence": [
          "Shoe prints found at the murder scene.",
          "Witnesses identifying Hale's shoes."
        ],
        "reader_observable": true
      },
      {
        "observation": "Hotel logs show discrepancies in the timeline of events.",
        "correction": "The logs indicate that the murder occurred during a time when Hale was supposedly impersonating Finch.",
        "effect": "Narrows the timeline for Captain Hale's opportunity.",
        "required_evidence": [
          "Hotel log entries during the timeframe.",
          "Witnesses' statements about the timing of events."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Reenact witnesses' accounts of the evening to see if they can identify the real Captain Hale.",
    "knowledge_revealed": "The revealed facts are witness, recall, and seeing.",
    "pass_condition": "If the witnesses cannot identify Hale correctly, it proves they were misled by the impersonation.",
    "evidence_clues": [
      "clue_early_1",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witnesses' descriptions of the blue dress (early) and the location of the dress (mid) lead to a contradiction in Finch's alibi. Step 2: The shoe prints (mid) indicate Hale's presence at the scene. Step 3: The hotel logs (late) confirm the narrowed timeline that implicates Hale."
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
        "Observe the witnesses' reactions",
        "Draw conclusion about Hale's guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Contradiction in her alibi due to the blue dress.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm the argument was unrelated to the murder.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses confirm she was at a different location.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence gathered."
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_early_1",
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
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_elimination_beatrice_quill",
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
        "clue_id": "clue_late_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Hotel log entries"
      },
      {
        "clue_id": "clue_mid_2",
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
    "summary": "The hotel manager with a polished exterior conceals a bitter rivalry and deep resentment towards the victim, whose presence threatens her career.",
    "publicPersona": "Charming and meticulous, known for her attention to detail and guest satisfaction.",
    "privateSecret": "Hides her resentment towards the victim, who undermined her authority at the hotel.",
    "motiveSeed": "Fears losing her job and reputation due to the victim's influence over the hotel board.",
    "motiveStrength": "strong",
    "alibiWindow": "was in the kitchen preparing for dinner service from 7:00 PM to 7:30 PM",
    "accessPlausibility": "easy",
    "stakes": "Her career and the hotel's reputation.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks in a precise and controlled manner, often using hotel jargon. Occasionally drops a sardonic remark when pressed.",
    "signatureTic": "‘You know, in hospitality, we say...’",
    "internalConflict": "Struggles with feelings of inadequacy and the fear that her hard work may not be enough to secure her position.",
    "personalStakeInCase": "This crime threatens her career, which she has dedicated her life to building.",
    "paragraphs": [
      "Eleanor Voss was the very embodiment of grace under pressure. At the seaside hotel, she was a whirlwind of charming smiles and meticulous attention to detail, ensuring every guest felt like royalty. Yet beneath her polished exterior lay a simmering resentment, one that threatened to boil over with the untimely death of the victim. Eleanor had worked tirelessly to build her reputation, only to see it undermined by someone who seemed to wield more influence than she could ever hope to grasp.",
      "As she stood in the kitchen, preparing for dinner service, Eleanor couldn't shake the feeling of dread that had settled in her gut. The victim had a knack for making her feel small, a mere footnote in a story where she should have been the lead. With each passing moment, her thoughts spiraled into a dark abyss of 'what-ifs.' What if the hotel board blamed her for the chaos that would ensue? What if her carefully curated image shattered like glass?",
      "Eleanor's alibi seemed solid enough. She had been in the kitchen from seven to seven-thirty, surrounded by the clatter of pots and the aroma of fine cuisine. But in a world where appearances were everything, she couldn’t help but wonder if the truth would be enough to save her. The thought of losing her job, the very essence of her identity, gnawed at her relentlessly. She had to navigate this investigation with finesse, or risk losing everything she had fought to build.",
      "As the detective began to peel back the layers of the case, Eleanor found herself caught between a desire to protect her interests and a burgeoning alliance with the investigator. The more they dug, the more Eleanor realized that her resentment towards the victim was a mask for her own insecurities. Perhaps, if she allowed herself to confront these feelings, she could emerge not just as a survivor, but as a true leader in her own right. But would the truth come at a cost she wasn't prepared to pay?"
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected physician whose professional rivalry with the victim hints at deeper insecurities and a desire for acceptance within the community.",
    "publicPersona": "Respected and knowledgeable, offers medical advice to the community.",
    "privateSecret": "Has a strained relationship with the victim, who criticized her for her treatment methods.",
    "motiveSeed": "Believes the victim's death could elevate her standing in the community and allow her to gain the trust of the hotel staff.",
    "motiveStrength": "moderate",
    "alibiWindow": "attended a medical seminar from 6:00 PM to 8:00 PM",
    "accessPlausibility": "possible",
    "stakes": "Her professional reputation and acceptance in the community.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks with a clinical precision, but often punctuates her dialogue with sardonic observations about human nature.",
    "signatureTic": "‘Well, you know what they say about doctors…’",
    "internalConflict": "Battles feelings of inadequacy stemming from her need for validation from her peers and the community.",
    "personalStakeInCase": "The victim's death could alter the dynamics of her professional standing, presenting both opportunity and peril.",
    "paragraphs": [
      "Dr. Mallory Finch was no stranger to the weight of expectation. As a local physician, she walked the fine line between respect and resentment, particularly when it came to her relationship with the victim. The criticism she had faced from the victim stung deeply, and while she maintained a veneer of professionalism, her rivalry simmered just below the surface. Mallory often found herself at war with her own insecurities, questioning her methods and the respect she commanded from the community.",
      "Attending a medical seminar from six to eight that evening provided her with a solid alibi, but it also left her feeling detached from the chaos that engulfed the hotel. While others were caught up in the drama, Mallory stood on the sidelines, her mind racing with the implications of the victim's demise. Could this be the moment she had been waiting for? A chance to step into the limelight and prove her worth?",
      "As she navigated the aftermath of the murder, Mallory found herself grappling with the duality of her feelings. On one hand, she felt a pang of guilt for even considering the notion that the victim's death could benefit her. On the other, the prospect of gaining the trust of the hotel staff and the community was intoxicating. Would she be able to rise above her personal grievances and confront the reality of her ambitions?",
      "Mallory's sardonic wit often masked her vulnerabilities, allowing her to deflect uncomfortable questions about her past. But as the detective drew closer to the truth, she realized that she would have to confront not only the shadows of her rivalry but also the darker corners of her own psyche. If she wanted to truly succeed, she would need to embrace her insecurities and learn to forge a new path, one that didn’t rely on the misfortune of others."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired Navy captain whose larger-than-life persona hides a deep-seated grudge against the victim, threatening his standing in the community.",
    "publicPersona": "Gregarious and authoritative, often shares war stories with guests.",
    "privateSecret": "Holds a grudge against the victim for publicly embarrassing him at a charity event.",
    "motiveSeed": "Sought to regain respect and authority within the community by silencing the victim.",
    "motiveStrength": "strong",
    "alibiWindow": "was in the bar talking with guests from 7:00 PM to 7:45 PM",
    "accessPlausibility": "possible",
    "stakes": "His reputation and standing among peers.",
    "humourStyle": "observational",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks in a booming voice, often punctuating his stories with dramatic flair and a hearty laugh, but has a tendency to turn serious when discussing personal matters.",
    "signatureTic": "‘In my day, we…’",
    "internalConflict": "Struggles with the embarrassment of his past and the fear that he no longer commands respect.",
    "personalStakeInCase": "The victim's death could either redeem him or further tarnish his reputation, depending on how the investigation unfolds.",
    "paragraphs": [
      "Captain Ivor Hale was known for his gregarious nature and larger-than-life stories of naval exploits. Yet, behind the bravado lay a man grappling with a bitter grudge against the victim. The public embarrassment he suffered at a charity event haunted him, and the need for redemption burned bright in his chest. Ivor had always been a man of authority, and now, as he mingled with guests at the bar, he felt that authority slipping away, like sand through his fingers.",
      "His alibi was as solid as a ship's hull; he had been in the bar, regaling guests with tales of valor from seven to seven-forty-five. But while laughter echoed around him, Ivor's heart was heavy with the weight of his past. The victim's death opened a door to both opportunity and peril. Could this be the chance he needed to regain the respect that had been stripped from him? Or would it only serve to deepen the wounds he had long carried?",
      "As the investigation unfolded, Ivor found himself at a crossroads. His observational wit often cut through the tension in the room, but it also masked the turmoil within. Each inquiry from the detective felt like a reminder of his perceived failures, forcing him to confront the reality of his situation. The desire to silence the victim had been born from a need to reclaim his standing, but now, he questioned whether that was worth the cost of another person's life.",
      "The shadows of his past loomed large, but as Ivor engaged with the detective, he realized that perhaps it was time to let go of the grudges that had defined him. He had the opportunity to redefine himself, to embrace the changing dynamics of respect and authority, and to forge a new legacy that didn’t rely on the ghosts of his past. In the end, would he rise to the occasion, or would he succumb to the weight of his own history?"
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An aspiring writer caught in a web of jealousy and secrecy, whose romantic entanglement with the victim's former partner complicates her ambitions.",
    "publicPersona": "Eager and optimistic, always looking for inspiration in her surroundings.",
    "privateSecret": "Secretly involved in a romantic relationship with the victim's former partner, causing jealousy.",
    "motiveSeed": "Worried the victim may expose their affair, ruining her chances of success.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in her room writing from 6:30 PM to 7:30 PM",
    "accessPlausibility": "possible",
    "stakes": "Her reputation as a writer and her romantic future.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Speaks with an eager lilt, often stumbling over her words when nervous, and uses humor to deflect uncomfortable topics.",
    "signatureTic": "‘I suppose I’m just a bit of a dreamer…’",
    "internalConflict": "Struggles with the tension between her romantic desires and her aspirations as a writer.",
    "personalStakeInCase": "The victim's exposure of her affair could shatter her dreams of becoming a successful writer.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of youthful optimism, with a heart full of dreams and a pen poised to capture the world. Yet, lurking beneath her eager exterior was a tangled web of jealousy and fear. The affair with the victim's former partner had ignited a fire within her, but it also threatened to consume her ambitions. As she sat in her room, the clock ticking ominously, she found herself torn between her desire for love and the aspirations that danced just out of reach.",
      "Her alibi seemed innocuous enough; she had been writing from six-thirty to seven-thirty, lost in the world of her imagination. But as the news of the victim's death spread like wildfire, Beatrice felt the walls closing in. What if the affair was exposed? What if her dreams of becoming a writer crumbled before her eyes, overshadowed by scandal? The very thought sent a chill down her spine, and she found herself questioning the choices she had made.",
      "Beatrice's self-deprecating humor often served as a shield against the harsh realities of life. ‘I suppose I’m just a bit of a dreamer…’ she would say, trying to laugh off her insecurities. But deep down, she knew that this was more than just a passing whim. The stakes were high, and the weight of the victim's death felt like a dark cloud hovering over her head. Could she navigate the storm that was brewing without losing herself in the process?",
      "As the detective began to unravel the threads of the case, Beatrice realized that she could no longer hide behind her dreams. This was her moment to confront the truth, not just about the victim's death, but about her own desires and aspirations. Would she have the courage to emerge from the shadows of jealousy and embrace the person she was meant to be? Or would she remain trapped in a narrative of her own making, forever a dreamer lost in a world of uncertainty?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "The hotel receptionist whose friendly demeanor masks a simmering jealousy of the victim's success and authority, complicating her personal ambitions.",
    "publicPersona": "Friendly and helpful, known for her warm greetings and customer service.",
    "privateSecret": "Harbors a deep-seated jealousy of the victim's authority and success.",
    "motiveSeed": "Believes the victim's demise would allow her to take on more responsibility at the hotel.",
    "motiveStrength": "moderate",
    "alibiWindow": "was at the front desk from 7:00 PM to 7:30 PM",
    "accessPlausibility": "easy",
    "stakes": "Her career advancement and personal satisfaction.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Speaks in a warm, inviting tone, but often delivers sharp remarks with a smile, deflecting deeper inquiries.",
    "signatureTic": "‘Oh, I just adore the hustle and bustle of it all…’",
    "internalConflict": "Struggles with feelings of inadequacy and envy, torn between her desire for success and her loyalty to the hotel.",
    "personalStakeInCase": "The victim's death could pave the way for her own advancement, but at what moral cost?",
    "paragraphs": [
      "Sylvia Trent was the heart of the hotel, her friendly demeanor and warm greetings making guests feel welcome from the moment they arrived. Yet, behind the facade of hospitality lay a simmering jealousy that threatened to consume her. The victim's authority and success felt like a constant reminder of Sylvia's own inadequacies, and as she stood at the front desk, she couldn't help but wonder if the universe was conspiring against her.",
      "Her alibi was straightforward; she had been at the front desk from seven to seven-thirty, smiling and assisting guests. But as the news of the victim's death spread, Sylvia felt a pang of guilt mixed with an unsettling thrill. Could this be the moment she had long awaited? A chance to step into the limelight and claim the responsibility she believed she deserved? The stakes were high, and the moral implications weighed heavily on her conscience.",
      "Sylvia's polite savagery often shone through in her conversations. ‘Oh, I just adore the hustle and bustle of it all…’ she would say, masking her true feelings with a smile. But as the detective probed deeper, her sharp remarks began to reveal the cracks in her carefully constructed facade. The jealousy that had once been a quiet whisper now roared like a tempest, demanding to be acknowledged. Would she allow herself to confront these feelings, or would she remain a bystander in her own life?",
      "As the investigation unfolded, Sylvia found herself at a crossroads. The path to advancement was fraught with moral dilemmas, and she was forced to confront the reality of her ambitions. This was more than just a case of jealousy; it was a test of her character. Could she rise above the envy and claim her own success without sacrificing her integrity? Or would she become another casualty in the dark game of power and authority?"
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A traveling salesman turned detective, whose personal vendetta against the hotel complicates his investigation into the murder.",
    "publicPersona": "Charming and inquisitive, always asking questions about the local scene.",
    "privateSecret": "Has a personal vendetta against the hotel for a prior grievance involving the staff.",
    "motiveSeed": "His past experience with the hotel connects him deeply to the case, leading to his investigation.",
    "motiveStrength": "weak",
    "alibiWindow": "Arrived just before the victim was found, having been caught by a sudden storm.",
    "accessPlausibility": "possible",
    "stakes": "His desire for justice stems from the incident that tarnished his reputation.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks in a smooth, conversational style, often infused with dry humor and curiosity, using questions to guide conversations.",
    "signatureTic": "‘Isn’t it curious how…’",
    "internalConflict": "Struggles with his motivations for investigating, torn between personal vendetta and a genuine desire for justice.",
    "personalStakeInCase": "The investigation represents a chance for redemption after a past grievance with the hotel staff.",
    "paragraphs": [
      "Hugo Vane was no ordinary traveling salesman; he had a penchant for curiosity that often led him into the heart of mysteries. His charming demeanor and inquisitive nature endeared him to locals, but beneath the surface lay a personal vendetta against the hotel that had once tarnished his reputation. As he stepped into the seaside establishment, he couldn’t shake the feeling that he was both an outsider and a reluctant participant in a game of shadows.",
      "Caught in a sudden storm, Hugo arrived just before the victim was discovered, his alibi teetering on the edge of credibility. But as he began to dig into the circumstances surrounding the murder, he found himself entangled in a web of secrets and lies. His past experiences with the hotel staff haunted him, and he grappled with the motivations behind his investigation. Was he seeking justice, or merely trying to settle an old score?",
      "His dry wit often punctuated his conversations, leading others to underestimate the depth of his inquiries. ‘Isn’t it curious how…’ he would begin, smoothly guiding discussions into murky waters. Yet, as he navigated the case, Hugo realized that the stakes were higher than he had anticipated. This was not just about revenge; it was an opportunity for redemption, a chance to reclaim his integrity and prove that he was more than just a disgruntled salesman.",
      "As the detective work progressed, Hugo found himself at a crossroads. The ghosts of his past loomed large, and the line between personal vendetta and a genuine quest for justice blurred. Would he be able to uncover the truth behind the murder without being consumed by his own demons? Or would he allow his past grievances to taint his judgment and cloud his path? In the end, the answers he sought might just lead him to a deeper understanding of himself and the choices he had made."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Driftwood Hotel",
    "type": "Hotel",
    "place": "Whitstable",
    "country": "England",
    "summary": "A modest seaside hotel with Art Deco influences, offering rustic charm and ocean views, frequented by locals and tourists.",
    "visualDescription": "The Driftwood Hotel features a whitewashed facade adorned with Art Deco motifs, large bay windows framing sea vistas, and a weathered wooden sign swaying gently in the salty breeze. Inside, the lobby is decorated with patterned tiles, and plush armchairs in muted pastels invite guests to linger.",
    "atmosphere": "A sense of unease permeates the air, as the echoes of recent conflict linger like the sea fog rolling in from the coast.",
    "paragraphs": [
      "The Driftwood Hotel stands proud against the relentless winds of the North Sea, its Art Deco lines softened by time and the salt-laden air. A worn path leads to its entrance, flanked by wild, wind-sculpted grasses and the distant sound of crashing waves. Inside, the scent of damp wood and brine mingles with the faint aroma of brewing tea, creating a peculiar comfort that belies the tension brewing beneath the surface. Guests come and go, their laughter echoing in the narrow hallways, but there’s an awareness that something is amiss—the air crackles with the weight of unspoken words.",
      "The lobby, with its faded grandeur, is a gathering place for weary travelers and locals alike. The flickering light of a radio broadcasts the day's news, its crackling voice drowned out by the sound of the sea. Outside, the grey sky threatens rain, casting a pall over the bustling conversations. Yet, amidst the chatter, an undercurrent of anxiety is palpable; whispers of war's aftermath linger like the ghost of a storm, echoing through the corridors. The hotel's rustic charm provides little solace as guests exchange furtive glances, sensing that not all is well within these walls.",
      "As night falls, the Driftwood transforms under the dim glow of vintage sconces, casting long shadows across the patterned tiles. The sea's roar becomes a distant murmur, replaced by the creak of old timbers settling in the damp air. Each room holds its own secrets, the thin walls offering little privacy as hushed voices spill into the hall. Outside, the world feels miles away, the isolation of the hotel amplifying the tension within. Here, in this modest retreat, the past collides with the present, and the weight of unspoken authority hangs heavy in the air."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with intermittent rain, typical of coastal climates",
    "timeFlow": "Days of uncertainty, as guests navigate their past and present in a tense atmosphere.",
    "mood": "tense and uncertain, reflecting the recent end of WWII and lingering anxieties about the future",
    "eraMarkers": [
      "Faded Art Deco furnishings",
      "Crackling radio broadcasting news",
      "Rationed fuel and post-war automobile boom",
      "Furtive conversations in narrow hallways"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and damp wood",
      "secondary": [
        "faint aroma of brewing tea",
        "murmurs of distant waves"
      ]
    },
    "paragraphs": [
      "The atmosphere of the Driftwood Hotel is thick with the scent of the sea and the weight of history. Guests shuffle through the narrow hallways, their footsteps echoing against the tiled floors, as rain drizzles against the windows, blurring the line between inside and outside. The lingering presence of war hangs like a fog, and the distant sound of a radio crackles with updates that no one wants to hear. This is a place where secrets are kept close, and the past is never truly buried.",
      "As the day wanes, the mood shifts; shadows grow longer and the gentle hum of conversation fades into whispers. The air feels electric, charged with anticipation, as guests exchange knowing glances. The Driftwood Hotel, with its rustic charm, serves as a refuge and a prison, where each room holds its own mysteries, and the isolation of the coastline amplifies the tension that simmers just beneath the surface."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Seaside Observation Deck",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A weathered wooden deck overlooking turbulent waves, roped off with frayed yellow tape and scattered with debris from a recent storm.",
      "sensoryDetails": {
        "sights": [
          "grey waves crashing against rocks",
          "dilapidated wooden railings",
          "storm clouds gathering overhead",
          "scattered seaweed and driftwood",
          "flickering lanterns in the distance"
        ],
        "sounds": [
          "roaring surf",
          "howling wind",
          "distant gull cries",
          "creaking wood underfoot",
          "the flutter of the tape in the breeze"
        ],
        "smells": [
          "salt and brine",
          "wet earth and seaweed",
          "damp wood",
          "faint whiff of tobacco",
          "mildewy air"
        ],
        "tactile": [
          "rough wooden planks",
          "cold metal railings",
          "chill of the wind against skin",
          "slippery seaweed underfoot",
          "gritty sand between toes"
        ]
      },
      "accessControl": "Restricted access after dark; only authorized staff and police allowed; guests must be escorted.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops splattering on the deck",
            "mist rising from the ocean",
            "grey light filtering through clouds",
            "puddles forming in the wood grain",
            "blurred outlines of distant ships"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft lapping of waves",
            "distant thunder rumbling",
            "the creak of the deck",
            "drip of water from railings"
          ],
          "smells": [
            "fresh rain on sea air",
            "damp wood",
            "wet sand",
            "mildew",
            "cool ocean breeze"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light over the ocean",
            "dark clouds hanging low",
            "waves crashing in muted tones",
            "faint outlines of ships on the horizon",
            "the deck glistening with moisture"
          ],
          "sounds": [
            "silence broken by the crash of waves",
            "the distant call of seagulls",
            "the creak of old wood",
            "muffled voices from the hotel",
            "the rustle of sea grass"
          ],
          "smells": [
            "salty sea air",
            "wet stone",
            "damp driftwood",
            "the faint scent of fish",
            "mysterious undertones of decay"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset reflected on the water",
            "shadows stretching across the deck",
            "lights beginning to twinkle in the hotel",
            "the distant outline of the coastline",
            "stars appearing in the darkening sky"
          ],
          "sounds": [
            "gentle lapping of waves",
            "the distant murmur of guests",
            "the creak of the deck as it settles",
            "the rustle of leaves in the breeze",
            "the soft call of night birds"
          ],
          "smells": [
            "warmed salt air",
            "the faint scent of woodsmoke",
            "cool night air",
            "the lingering aroma of dinner from the hotel",
            "the crispness of approaching night"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Seaside Observation Deck, a weathered platform jutting over the tumultuous waves, serves as a chilling reminder of the untamed power of nature and the secrets it harbors. Roped off with frayed yellow tape, the deck is littered with debris from the recent storm, a testament to the chaos that can descend upon this remote stretch of coastline. The air is thick with the scent of salt and brine, mingling with the damp earth beneath one's feet, creating an unsettling atmosphere that weighs heavily on the mind. Here, the crashing surf echoes with a relentless rhythm, a haunting backdrop to the events that have unfolded.",
        "As the sun sets, the deck transforms into a stage of shadows and whispers. Flickering lanterns in the distance cast an eerie glow, illuminating the wreckage scattered across the planks. The chill of the wind bites at exposed skin, and the sound of waves crashing against the rocks grows louder, drowning out the distant cries of gulls. Each gust of wind seems to carry with it a warning, a reminder that the past is never far behind. This is the place where secrets collide with fate, and the isolation of the hotel amplifies the tension that lingers in the salty air."
      ]
    },
    {
      "id": "lobby",
      "name": "The Driftwood Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "A cozy lobby adorned with patterned tiles, plush chairs, and a reception desk manned by a weary clerk.",
      "sensoryDetails": {
        "sights": [
          "faded wallpaper with floral motifs",
          "dust motes dancing in the light",
          "antique furniture with a polished sheen",
          "a flickering radio on the counter",
          "a small potted plant in the corner"
        ],
        "sounds": [
          "soft chatter of guests",
          "the crackle of radio announcements",
          "the creak of floorboards",
          "the rustle of newspapers",
          "distant laughter from the dining room"
        ],
        "smells": [
          "freshly brewed tea",
          "polished wood and furniture polish",
          "the faint scent of tobacco",
          "a hint of floral perfume",
          "warmth of the hearth"
        ],
        "tactile": [
          "soft upholstery of armchairs",
          "cool surface of marble counter",
          "the roughness of aged wood",
          "the warmth of a woolen blanket",
          "the smoothness of polished brass fixtures"
        ]
      },
      "accessControl": "Open to all guests during the day; restricted access to staff-only areas behind the reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through windows",
            "raindrops tracing patterns on glass",
            "the lobby floor glistening with moisture",
            "faded photographs on the walls",
            "a newspaper left on a table"
          ],
          "sounds": [
            "steady patter of rain against glass",
            "the rustle of a newspaper being read",
            "soft footsteps on wet tiles",
            "the distant sound of thunder",
            "the crackle of the radio"
          ],
          "smells": [
            "dampness in the air",
            "wet wool from guests' coats",
            "the aroma of baked goods from the kitchen",
            "the scent of fresh flowers",
            "the lingering smell of polished wood"
          ],
          "mood": "pensive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "guests huddled in conversation",
            "the flicker of the radio's dial",
            "the clock ticking on the wall",
            "a vase of wilting flowers"
          ],
          "sounds": [
            "soft murmur of conversations",
            "the ticking of the clock",
            "the crackle of the radio",
            "the sound of chairs scraping on the floor",
            "the distant clatter of dishes"
          ],
          "smells": [
            "dust in the air",
            "the scent of old books",
            "the aroma of brewed coffee",
            "the faint scent of cologne",
            "the smell of varnish from the furniture"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of lamp light",
            "reflections of guests in glass surfaces",
            "the flickering flames in the fireplace",
            "the darkening sky outside",
            "the silhouette of the reception desk"
          ],
          "sounds": [
            "the crackle of the fire",
            "laughter from the dining room",
            "the soft clinking of glasses",
            "the rustle of a newspaper",
            "the distant sound of waves crashing"
          ],
          "smells": [
            "wood smoke from the fireplace",
            "the aroma of a hearty stew",
            "the scent of polished brass",
            "the faint whiff of aftershave",
            "the warm scent of baked bread"
          ],
          "mood": "inviting warmth"
        }
      ],
      "paragraphs": [
        "The Driftwood Lobby welcomes guests with its cozy charm, a blend of rustic elegance and the comforting scent of freshly brewed tea. The patterned tiles beneathfoot are worn smooth by countless visitors, while the plush armchairs invite weary travelers to sink in and relax. The reception desk, manned by a weary clerk, stands as a barrier between the public and the staff-only areas beyond. Here, the soft chatter of guests mingles with the crackling radio, broadcasting updates from a world that feels both distant and dangerously close.",
        "As the day unfolds, the lobby transforms with the changing light. In the morning, rain-soaked guests enter, leaving droplets on the polished floor, while the scent of baked goods wafts in from the kitchen. By afternoon, the overcast sky casts a melancholic shadow, and the conversations grow hushed, punctuated only by the ticking clock on the wall. As evening descends, the glow of lamps illuminates the lobby, casting warm reflections that soften the edges of reality. This is a space where secrets are shared, and tensions simmer just below the surface."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Driftwood Dining Room",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A quaint dining area with wooden tables, mismatched chairs, and large windows offering sweeping views of the ocean.",
      "sensoryDetails": {
        "sights": [
          "large windows framing the sea",
          "table settings with faded linens",
          "the flicker of candlelight",
          "walls adorned with nautical decor",
          "a chalkboard menu with daily specials"
        ],
        "sounds": [
          "clinking of cutlery",
          "muffled conversations",
          "the soft music from a radio",
          "the hum of the refrigerator",
          "the distant sound of waves"
        ],
        "smells": [
          "aroma of roasted meats",
          "freshly baked bread",
          "the scent of herbs and spices",
          "the tang of citrus",
          "the sweetness of dessert"
        ],
        "tactile": [
          "smooth wooden tabletops",
          "the coolness of glassware",
          "the warmth of freshly baked bread",
          "the rough texture of linen napkins",
          "the weight of cutlery in hand"
        ]
      },
      "accessControl": "Open to guests during meal times; restricted access to staff-only areas in the kitchen.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops cascading down windows",
            "dim light filtering through clouds",
            "condensation on glass",
            "empty tables awaiting guests",
            "the morning newspaper on a side table"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "the rustle of staff preparing for service",
            "the distant murmur of conversations",
            "the crackle of the radio"
          ],
          "smells": [
            "freshly brewed coffee",
            "the aroma of pancakes on the griddle",
            "the scent of citrus in the air",
            "the lingering smell of smoke from the fireplace",
            "the sweetness of pastries"
          ],
          "mood": "hopeful beginnings"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "guests huddled over coffee",
            "the flicker of candle flames",
            "the chalkboard menu with daily specials",
            "the distant outline of ships on the horizon"
          ],
          "sounds": [
            "soft murmur of conversations",
            "the clinking of cutlery",
            "the hum of the refrigerator",
            "the distant sound of waves",
            "the creak of chairs"
          ],
          "smells": [
            "the scent of simmering stew",
            "the aroma of fresh bread",
            "the tang of vinegar in a salad",
            "the sweetness of desserts being prepared",
            "the warmth of spices"
          ],
          "mood": "sombre reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight casting flickering shadows",
            "the glow of the setting sun through the windows",
            "guests enjoying their meals",
            "the rich colors of the evening sky",
            "a waiter moving gracefully between tables"
          ],
          "sounds": [
            "the laughter of guests",
            "the clinking of glasses",
            "the soft strumming of a guitar",
            "the rustle of linen napkins",
            "the distant sound of waves crashing"
          ],
          "smells": [
            "the aroma of grilled fish",
            "the scent of rosemary and thyme",
            "the sweet fragrance of desserts",
            "the warmth of baked bread",
            "the freshness of a garden salad"
          ],
          "mood": "festive gathering"
        }
      ],
      "paragraphs": [
        "The Driftwood Dining Room is a quaint haven, where the aroma of roasted meats and freshly baked bread fills the air, mingling with the salty scent of the ocean. Wooden tables, each adorned with mismatched chairs, create an inviting atmosphere, while large windows frame sweeping views of the sea, inviting guests to lose themselves in the horizon. The flickering candlelight casts a warm glow, illuminating the nautical decor that tells stories of the ocean's past. Here, guests gather, sharing meals and secrets alike, unaware of the tension that simmers just beneath the surface.",
        "In the morning, the dining room awakens with the soft patter of rain against the windows, the scent of freshly brewed coffee wafting through the air. As the day progresses, the atmosphere shifts; the overcast skies cast a somber tone, and the sounds of clinking cutlery and muffled conversations fill the room. By evening, the space transforms into a festive gathering, the laughter and chatter mingling with the rich aromas of the day's fare. This is a place of connection and discovery, where clues may linger in the air, waiting to be uncovered amidst the warmth of shared meals."
      ]
    },
    {
      "id": "library",
      "name": "The Driftwood Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A small, dimly lit room lined with shelves of dusty books, a large globe in the corner, and a worn leather armchair.",
      "sensoryDetails": {
        "sights": [
          "a flickering oil lamp casting shadows",
          "the large globe with faded continents",
          "framed photographs of past guests",
          "a thick carpet muffling footsteps"
        ],
        "sounds": [
          "the rustle of pages turning",
          "the creak of the armchair",
          "the whisper of wind outside",
          "the distant sound of rain against the window",
          "the ticking of an old clock"
        ],
        "smells": [
          "musty paper and leather",
          "the scent of old varnish",
          "the faint aroma of tobacco",
          "the crispness of aged parchment",
          "the smell of dampness from the rain"
        ],
        "tactile": [
          "the rough texture of old books",
          "the softness of the armchair upholstery",
          "the coolness of the globe's surface",
          "the weight of a thick volume",
          "the smoothness of polished wood"
        ]
      },
      "accessControl": "Open to guests during the day; restricted access to staff-only areas after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops trickling down the window",
            "soft light filtered through clouds",
            "the glow of the lamp against the gloom",
            "the carpet damp with morning dew",
            "the dust motes swirling in the air"
          ],
          "sounds": [
            "steady patter of rain on the roof",
            "the soft rustle of pages turning",
            "the distant rumble of thunder",
            "the creak of the library door",
            "the ticking of the clock"
          ],
          "smells": [
            "the scent of wet earth",
            "the mustiness of old books",
            "the dampness in the air",
            "the faint smell of coffee from the dining room",
            "the aroma of freshly baked pastries"
          ],
          "mood": "introspective stillness"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "the glow of the lamp illuminating pages",
            "the large globe standing sentinel",
            "the dust settling on the carpet",
            "the flicker of candlelight in the corner"
          ],
          "sounds": [
            "the soft rustle of pages",
            "the tick of the clock",
            "the quiet creak of the chair",
            "the distant sound of conversations",
            "the patter of rain against the window"
          ],
          "smells": [
            "the scent of musty paper",
            "the aroma of aged leather",
            "the sweetness of fading flowers",
            "the faint smell of tobacco",
            "the earthy scent of damp wood"
          ],
          "mood": "sombre contemplation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "shadows lengthening in the fading light",
            "the glow of the oil lamp",
            "the large globe reflecting warm light",
            "the spines of books glinting",
            "the silhouette of the armchair"
          ],
          "sounds": [
            "the soft crackle of the lamp's flame",
            "the distant laughter from the dining room",
            "the rustle of a newspaper being read",
            "the ticking of the clock",
            "the quiet whoosh of wind outside"
          ],
          "smells": [
            "the warmth of polished wood",
            "the scent of leather-bound books",
            "the faint smell of fresh ink",
            "the crispness of evening air",
            "the lingering aroma of dinner"
          ],
          "mood": "reflective tranquility"
        }
      ],
      "paragraphs": [
        "The Driftwood Library is a hidden gem, a small, dimly lit room filled with shelves of dusty books that beckon the curious. The air is thick with the scent of musty paper and leather, intertwining with the faint aroma of tobacco that lingers from past guests. A large globe in the corner, its continents faded with time, stands as a reminder of distant places and forgotten stories. This is a space where whispers of the past echo, and the secrets of the hotel seem to reside among the pages of old tomes.",
        "In the morning, the library feels almost sacred, the soft patter of rain against the window creating a gentle rhythm that invites introspection. Dust motes dance in the glow of the flickering lamp, casting playful shadows across the pages of opened books. The atmosphere shifts by afternoon, as grey light seeps in, lending a somber tone to the room. By evening, the library transforms into a sanctuary of reflective tranquility, the warm glow of the oil lamp illuminating the spines of books, inviting guests to explore the mysteries contained within. Here, the past and present intertwine, and the search for answers begins."
      ]
    }
  ],
  "note": "",
  "cost": 0.0030527970000000003,
  "durationMs": 40544
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1947,
    "month": "May",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "May",
    "weather": [
      "overcast with intermittent rain",
      "occasional gusts of wind",
      "cool temperatures around 55°F (13°C)"
    ],
    "daylight": "Days are gradually lengthening, with sunset occurring around 8:30 PM, allowing for a few lingering hours of twilight.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as the hotel guests settle in for the night.",
    "holidays": [
      "May Day (May 1)",
      "Mother's Day (May 11)"
    ],
    "seasonalActivities": [
      "spring cleaning in homes",
      "preparation for upcoming summer events",
      "outdoor gatherings despite the weather"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suit jackets",
        "lightweight wool trousers",
        "fedoras"
      ],
      "casual": [
        "button-down shirts",
        "tweed blazers",
        "slacks"
      ],
      "accessories": [
        "silk ties",
        "cufflinks",
        "wristwatches"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with floral patterns",
        "tailored blouses",
        "swing skirts"
      ],
      "casual": [
        "capri pants",
        "knit sweaters",
        "blouses with Peter Pan collars"
      ],
      "accessories": [
        "small hats with veils",
        "pearl necklaces",
        "gloves"
      ]
    },
    "trendsOfTheMoment": [
      "increased use of synthetic fabrics",
      "bold floral prints",
      "the popularity of the 'New Look' introduced by Dior"
    ],
    "socialExpectations": [
      "greater acceptance of women in professional roles",
      "higher scrutiny on public behavior due to war-time experiences",
      "expectation of politeness and decorum in social settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "the beginning of the Marshall Plan to aid European recovery",
      "tensions arising from the Berlin Blockade",
      "the ongoing trials of war criminals at Nuremberg"
    ],
    "politicalClimate": "A transition from wartime control to peacetime governance, with growing debates about communism and capitalism in Europe.",
    "economicConditions": "Post-war recovery is underway but marked by shortages and inflation, with rising prices affecting everyday goods.",
    "socialIssues": [
      "displacement of war refugees",
      "the question of veterans' rights and reintegration",
      "gender equality in the workplace"
    ],
    "internationalNews": [
      "the United Nations' growing role in international diplomacy",
      "increased tensions in the Middle East following the establishment of Israel"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Nature Boy' by Nat King Cole",
        "'Chantilly Lace' by The Big Bopper",
        "Doris Day's 'Que Sera, Sera'"
      ],
      "films": [
        "'Gentlemen's Agreement'",
        "'Miracle on 34th Street'",
        "'The Best Years of Our Lives'"
      ],
      "theater": [
        "'Death of a Salesman' by Arthur Miller",
        "'A Streetcar Named Desire' by Tennessee Williams"
      ],
      "radio": [
        "The Jack Benny Program",
        "Your Hit Parade",
        "The Shadow"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'The Bell Jar' by Sylvia Plath",
        "'Invisible Man' by Ralph Ellison"
      ],
      "popularGenres": [
        "post-war realism",
        "mystery fiction",
        "social commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial microwave oven",
        "the transistor radio",
        "early prototypes of television remote controls"
      ],
      "commonDevices": [
        "table radios",
        "bicycles",
        "typewriters"
      ],
      "emergingTrends": [
        "increased access to consumer electronics",
        "the rise of home appliances",
        "early adoption of modern household technologies"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Cup of coffee: six pence"
      ],
      "commonActivities": [
        "garden planting as the frost recedes",
        "participating in local events and fairs",
        "attending radio shows and community gatherings"
      ],
      "socialRituals": [
        "weekly church services",
        "afternoon tea gatherings",
        "neighborhood block parties"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a growing middle class with increased aspirations",
      "remnants of class divisions from wartime rationing"
    ],
    "gender": [
      "women are increasingly seen as equals in the workforce",
      "traditional family roles are being challenged"
    ],
    "race": [
      "the beginnings of the civil rights movement gaining momentum",
      "increased awareness of racial inequalities"
    ],
    "generalNorms": [
      "expectation of modesty and decorum in attire",
      "growing curiosity about modern lifestyles and foreign cultures"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of damp earth and blooming lilacs, a testament to spring's reluctant embrace in the coastal town.",
    "The echo of rain on the hotel windows creates a rhythmic backdrop as guests murmur in hushed tones, the tension palpable beneath the surface.",
    "A low hum of conversation fills the lounge, punctuated by the crackling of the radio, where distant melodies provide a fleeting escape from the uncertainty of the world outside."
  ],
  "paragraphs": [
    "May 1947 arrives with a mix of anticipation and trepidation, the coastal town shrouded in overcast skies and the scent of rain-soaked earth. The days grow longer, yet the gloom seems to linger, reflecting the collective anxiety of a populace still grappling with the aftermath of war. As guests gather at the hotel, the tension is almost tangible, punctuated by occasional laughter that barely masks the underlying unease of uncertain futures. The spring rain offers a soothing soundtrack, yet it also serves as a reminder of the fragility of peace, with whispers of political unrest and economic instability hanging in the air.",
    "In the lobby, men and women don the latest fashions that reflect post-war optimism. Men sport double-breasted suit jackets with fedoras perched jauntily, while women twirl in floral tea-length dresses, their small hats adorned with delicate veils. The atmosphere is a blend of formality and casual elegance, as guests navigate the social hierarchy that still echoes the class divisions of the past. Yet, there is an unmistakable shift; women are no longer solely defined by domestic roles, and the burgeoning middle class is beginning to challenge traditional norms.",
    "Daily life in this coastal town is marked by the rhythm of spring activities. Residents partake in spring cleaning, preparing their homes for the warmer months, while outdoor gatherings, despite the drizzling rain, foster a sense of community. With a cup of coffee costing just six pence, patrons frequent the local café, where conversations often turn to recent events — the Marshall Plan and the rising costs of living. The social fabric is woven with rituals such as afternoon teas and weekly church services, where the community finds solace and strength in shared experiences, even as the specter of war's aftermath looms large."
  ],
  "note": "",
  "cost": 0.00107343225,
  "durationMs": 15402
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A masquerade ball at a modest seaside hotel brings together a diverse cast, each grappling with the societal shifts of post-war life, while the pressure of public scrutiny and hidden identities creates a tense atmosphere ripe for deception.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The workforce is evolving with women stepping into roles traditionally held by men, creating tension and scrutiny around public behavior and personal choices."
  },
  "setting": {
    "location": "A modest seaside hotel with Art Deco influences, featuring ocean views and rustic charm.",
    "institution": "Hotel",
    "weather": "Overcast with intermittent rain, typical of coastal climates."
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
    "id": "time_of_signal",
    "value": "ten minutes past eight",
    "description": "The exact time the suspects switched locations, pivotal to the alibi."
  },
  {
    "id": "witness_hat_color",
    "value": "red",
    "description": "The color of the hat matching the suspect's outfit, noted by witnesses."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 13,
  "countsByPlacement": {
    "early": 3,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 12,
    "optional": 1
  },
  "redHerringCount": 0,
  "clues": [
    {
      "id": "clue_early_1",
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
      "id": "clue_mid_1",
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
      "id": "clue_mid_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_fp_elimination_beatrice_quill",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_fp_elimination_sylvia_trent",
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

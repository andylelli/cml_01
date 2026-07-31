# Actual Prompt Record

- Run ID: `mystery-1785512142695`
- Project ID: ``
- Timestamp: `2026-07-31T15:40:10.371Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `0b18f4f480587ca4`

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
    "title": "The Chime of Deceit",
    "author": "Golden Age Mystery Writer",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "British Seaside",
      "place": "Brighton",
      "country": "England",
      "institution": "seaside hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "poisoning"
    }
  },
  "death_method": "struck with a heavy clock",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Guest",
      "relationships": [
        "Friend of Sylvia Trent"
      ],
      "public_persona": "Caring and supportive friend",
      "private_secret": "Hiding a romantic past with Captain Hale",
      "motive_seed": "Jealousy over Captain Hale's attention",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Lobby",
        "Sylvia's room"
      ],
      "behavioral_tells": [
        "Nervous around Captain Hale"
      ],
      "stakes": "Her relationship with Captain Hale",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Doctor",
      "relationships": [
        "Colleague of Captain Hale"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Involved in a malpractice case",
      "motive_seed": "Desire to protect reputation",
      "motive_strength": "low",
      "alibi_window": "9:15 PM to 10:15 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical supply room",
        "Lobby"
      ],
      "behavioral_tells": [
        "Defensive about medical credentials"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Military Officer",
      "relationships": [
        "Admirer of Sylvia Trent",
        "Friend of Eleanor Voss"
      ],
      "public_persona": "Charming and confident",
      "private_secret": "Involved in a scandal",
      "motive_seed": "Disgrace from scandal",
      "motive_strength": "moderate",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Lobby",
        "Sylvia's room"
      ],
      "behavioral_tells": [
        "Evasive when questioned about whereabouts"
      ],
      "stakes": "Maintaining his reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Maid",
      "relationships": [
        "Servant of the hotel",
        "Knows hotel secrets"
      ],
      "public_persona": "Helpful and polite",
      "private_secret": "Has a crush on Captain Hale",
      "motive_seed": "Jealousy over Captain Hale's attention",
      "motive_strength": "low",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Staff areas",
        "Sylvia's room"
      ],
      "behavioral_tells": [
        "Overly eager to please"
      ],
      "stakes": "Her feelings for Captain Hale",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Friend of Eleanor Voss",
        "Admired by Captain Hale"
      ],
      "public_persona": "Charming and sociable",
      "private_secret": "Hiding a past engagement",
      "motive_seed": "Rejection from Captain Hale",
      "motive_strength": "moderate",
      "alibi_window": "N/A",
      "access_plausibility": "none",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Her life",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Detective",
      "relationships": [
        "Friend of Sylvia Trent"
      ],
      "public_persona": "Sharp and observant",
      "private_secret": "Hiding personal connections to the victim",
      "motive_seed": "Personal loss",
      "motive_strength": "high",
      "alibi_window": "9:00 PM to 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Lobby",
        "Sylvia's room"
      ],
      "behavioral_tells": [
        "Overly focused on details"
      ],
      "stakes": "Solving the case",
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
      "summary": "In the overcast atmosphere of a seaside hotel, the charming Sylvia Trent is found dead, struck by a heavy clock. Detective Hugo Vane must untangle a web of jealousy and hidden motives among guests and staff, where a tampered clock holds the key to the truth."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock has been strategically tampered with to mislead witnesses about the time of death.",
      "delivery_path": [
        {
          "step": "The clock was adjusted to chime later than the actual time."
        }
      ]
    },
    "outcome": {
      "result": "The false timing leads witnesses to provide misleading statements about the time of death."
    }
  },
  "false_assumption": {
    "statement": "Sylvia was killed shortly after the clock chimed at ten.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses heard the clock chime at ten, suggesting a late death.",
    "what_it_hides": "The clock was tampered with to chime later than it was set."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Her presence in the hotel was suspicious due to her medical background, suggesting she could have an opportunity to harm Sylvia.",
      "Witnesses noted her arguing with Sylvia earlier that evening."
    ],
    "the_one_flaw": "Dr. Finch was seen leaving the lobby at 9:55 PM, well before the time when the clock indicated Sylvia's death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A heated argument between Dr. Finch and Sylvia before the murder.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The argument was about Sylvia's refusal to follow medical advice.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Captain Hale's nervous demeanor when questioned.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was upset over Sylvia's death, not involved in the murder.",
      "resolved_in_chapter": 7
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
    "rationale": "All suspects were present in the hotel and had potential motives, while no outsider could have entered unnoticed."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock in the lobby"
      ],
      "windows": [
        "9:00 PM to 10:00 PM"
      ],
      "contradictions": [
        "Witnesses claim the clock chimed at ten, while forensic evidence suggests the death occurred at 9:45 PM."
      ]
    },
    "access": {
      "actors": [
        "Hotel staff",
        "Guests"
      ],
      "objects": [
        "The clock",
        "Sylvia's room"
      ],
      "permissions": [
        "Staff access to guest rooms"
      ]
    },
    "physical": {
      "laws": [
        "Sound travels differently in humid conditions"
      ],
      "traces": [
        "Dust on the clock suggests it hasn't been cleaned recently"
      ]
    },
    "social": {
      "trust_channels": [
        "Friendship between guests"
      ],
      "authority_sources": [
        "Hotel management's statements"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the lobby shows the time as ten.",
        "correction": "This indicates a tampering that misrepresents the actual time of death.",
        "effect": "Narrows the window of opportunity for the actual murderer.",
        "required_evidence": [
          "Witness statements about the clock chiming at ten",
          "Forensic report indicating time of death at 9:45 PM"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall arguing between Sylvia and Dr. Finch shortly before ten.",
        "correction": "This suggests Dr. Finch was present but does not prove guilt.",
        "effect": "Narrows suspicion from Dr. Finch to Captain Hale.",
        "required_evidence": [
          "Witness accounts of the argument",
          "Sylvia's diary entry noting her fears of Hale"
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock shows signs of tampering with a layer of dust on its surface.",
        "correction": "This implies that the clock was manipulated recently.",
        "effect": "Eliminates Eleanor Voss as a suspect due to her cleanliness habits.",
        "required_evidence": [
          "Dust on the clock",
          "Eleanor's statement about her cleaning habits"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the chime time with witness accounts and the forensic report reveals the tampering.",
    "knowledge_revealed": "The clock's mechanism was adjusted to chime late, misleading witnesses.",
    "pass_condition": "If the clock chimes later than the time indicated by witnesses, it proves tampering.",
    "evidence_clues": [
      "clue_mid_4",
      "clue_mid_1",
      "clue_core_contradiction_chain"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's chime (early) and forensic report (mid) establish the timeline discrepancy. Step 2: Witness accounts reveal an argument (mid) clarifying motive but not guilt. Step 3: The dust on the clock (discriminating test) indicates tampering that leads to Captain Hale."
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
        "Observe the clock's chime against witness statements",
        "Draw conclusion about guilt"
      ],
      "test_type": ""
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Prove her cleaning habits contradict her opportunity",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her alibi confirms she was not present during the time of death",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 9:00 PM to 10:00 PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence from the clock"
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
        "clue_id": "clue_fp_contradiction_step_1",
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
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Dust observation on the clock"
      },
      {
        "clue_id": "clue_mid_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_mid_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_mid_4",
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
    "summary": "Eleanor Voss, a formidable hotel owner in her fifties, is a respected figure in the community who conceals deep financial troubles and a fraught relationship with her estranged daughter.",
    "publicPersona": "Eleanor is the epitome of hospitality, known for her unwavering will and commitment to her hotel, which stands as a symbol of her status and influence.",
    "privateSecret": "Despite her public persona, Eleanor grapples with the reality of mounting debts that threaten not only her hotel but also her legacy, which she fears will fall into the hands of her estranged daughter.",
    "motiveSeed": "The thought of losing her beloved hotel to her daughter, who would inherit it upon Eleanor's death, fills her with dread.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have left the lobby to oversee preparations at eight o'clock, returning only ten minutes later, a window that raises questions.",
    "accessPlausibility": "With easy access to all areas of the hotel, she could move about undetected.",
    "stakes": "For Eleanor, the hotel represents not just a business but her very identity, and losing it would mean losing herself.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Eleanor speaks with a commanding presence, her words often laced with a subtle sarcasm. She tends to punctuate her thoughts with pointed remarks, revealing her sharp intellect and underlying tension.",
    "signatureTic": "“You must understand, it’s not just a hotel.”",
    "internalConflict": "Eleanor is torn between her fierce desire to protect her legacy and the guilt of neglecting her daughter, whose inheritance she views as a threat rather than a connection.",
    "personalStakeInCase": "The murder and its implications strike at her heart, as Eleanor fears that any scandal could jeopardize her already fragile hold on the hotel and her reputation.",
    "paragraphs": [
      "Eleanor Voss stood at the window of her hotel, gazing out at the tumultuous sea. The waves crashed against the shore, echoing the storm brewing within her. She was the respected owner of the Voss Hotel, a landmark of hospitality and influence in the seaside town. Yet beneath this polished facade lurked a reality that gnawed at her insides: debts that had quietly accumulated like dust in the corners of her once-proud establishment, now threatening to drag her down into obscurity.",
      "Her relationship with her estranged daughter was a constant source of anguish. Eleanor had always envisioned passing the hotel down to her, a legacy of strength and resilience. But as the financial noose tightened, the prospect of losing it to her daughter loomed large, a specter that haunted her every waking moment. She would not allow that to happen; she could not. The thought of her daughter inheriting what she had worked so hard to build was unbearable, a betrayal she could not fathom.",
      "In public, Eleanor exuded confidence, her dry wit often disarming her critics. “You must understand, it’s not just a hotel,” she would retort, as if the very essence of her life were woven into the fabric of the establishment. But behind closed doors, the weight of her burdens pressed heavily upon her heart, and she often found herself grappling with the shadows of her past decisions and the fear of what lay ahead.",
      "The night of the murder, she had left the lobby to oversee preparations, a mere ten minutes during which anything could have transpired. Her alibi was thin, and the whispers of suspicion clung to her like the salty air. Eleanor knew she had to navigate this treacherous situation carefully; the stakes were higher than ever. If her financial troubles were exposed, it could mean the end of her reign as the hotel’s matriarch. And as the investigation unfolded, she would have to confront not only the truth of what happened but also the truth of her own heart."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a compassionate general practitioner in her thirties, finds herself entangled in a web of past betrayals and unresolved feelings in the wake of a murder.",
    "publicPersona": "Known for her empathy and dedication, Mallory is a beloved figure in the community, often making house calls to care for her patients.",
    "privateSecret": "Beneath her professional exterior lies a tumultuous past with the victim, a romance that ended in betrayal, leaving her with unresolved emotions and a tarnished reputation.",
    "motiveSeed": "The victim had once accused her of malpractice, a betrayal that nearly destroyed her career and left a bitter taste in her mouth.",
    "motiveStrength": "compelling",
    "alibiWindow": "Mallory claims to have been tending to a patient in an upstairs room from 8:30 to 9:00, a window that could provide her with plausible deniability.",
    "accessPlausibility": "Though possible, her access to the crime scene was limited, raising questions about her whereabouts during the critical time.",
    "stakes": "If implicated, Mallory risks losing not only her career but also her standing in the community she has worked so hard to build.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Mallory speaks with a gentle cadence, often punctuating her sentences with self-deprecating humor. Her words are thoughtful, though occasionally laced with nervous undertones when discussing sensitive topics.",
    "signatureTic": "“I suppose I should have seen that coming.”",
    "internalConflict": "Mallory is plagued by guilt over her past with the victim and the lingering resentment that threatens to surface, creating a moral quandary as she navigates the investigation.",
    "personalStakeInCase": "The murder has personal ramifications for Mallory; if her past is brought to light, it could ruin her career and reputation, leaving her with nothing.",
    "paragraphs": [
      "Dr. Mallory Finch stood in her examination room, the familiar scent of antiseptic filling her lungs, a comfort in a world that felt increasingly chaotic. Known for her compassion and dedication, she had built a reputation as a skilled general practitioner, often making house calls to those in need. Yet behind her warm smile lay a tumultuous past, a history intertwined with the very person who now lay dead.",
      "The victim, Sylvia Trent, had been more than just a patient; she had been a part of Mallory’s life in ways that were now shrouded in regret. Their brief romance had ended in betrayal, marked by accusations of malpractice that had nearly ruined Mallory’s career. The bitterness of that betrayal lingered, a festering wound that had never fully healed. As the investigation unfolded, Mallory found herself grappling with feelings she thought she had buried long ago.",
      "When the news of Sylvia’s murder reached her, Mallory felt a mix of shock and guilt. How could she mourn someone who had caused her so much pain? Yet, as the details of the case emerged, she realized the complexity of their relationship—one built on love, trust, and ultimately betrayal. “I suppose I should have seen that coming,” she muttered to herself, a self-deprecating smirk betraying the turmoil within.",
      "Her alibi was shaky; tending to a patient in an upstairs room during the critical window left room for doubt. As whispers of suspicion began to circulate, Mallory understood the stakes were higher than merely clearing her name. If her past with Sylvia came to light, the community’s perception of her could shatter, and the career she had worked so hard to build would be reduced to rubble. With each passing moment, the weight of her secrets pressed heavily upon her, forcing her to confront not only the truth of the murder but the truth of her own heart."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a dignified retired naval officer in his forties, carries the scars of war and a burden of mistrust that complicates his involvement in a murder investigation.",
    "publicPersona": "Respected for his principled nature, Ivor has a commanding presence that commands respect from his peers.",
    "privateSecret": "Haunted by PTSD from his service, Ivor has been receiving treatment in secret, struggling to reconcile his past with his present.",
    "motiveSeed": "He believes the victim exploited his family's trust, cheating them out of an inheritance that he feels was rightfully theirs.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor claims to have been at the bar from 8:00 until 8:45, but no one can confirm his whereabouts during that time.",
    "accessPlausibility": "Though possible, his presence at the bar raises questions about his true involvement in the murder.",
    "stakes": "For Ivor, this investigation represents a chance to reclaim his family's dignity and restore their name, which he feels has been tarnished.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a measured tone, often laced with sardonic remarks that reflect his military background. He chooses his words carefully, each one weighted with significance.",
    "signatureTic": "“In my experience, trust is a fragile thing.”",
    "internalConflict": "Ivor grapples with the psychological scars of his past, struggling to maintain his composure while confronting the shadows of his own mind.",
    "personalStakeInCase": "The murder challenges Ivor to confront his family's past while also forcing him to address his own demons, making it personal as well as professional.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, the dim light casting shadows on his rugged features. Once a dignified naval officer, he now found himself adrift in a sea of uncertainty. Respected among his peers for his principles, Ivor had always held a commanding presence, yet beneath that facade lay a man haunted by the echoes of war. PTSD had become his silent companion, a burden he carried in secret, intertwining with the investigation that now enveloped him.",
      "The murder of Sylvia Trent struck a chord deep within him. Ivor believed she had exploited his family’s trust, cheating them out of an inheritance that had been rightfully theirs. The weight of that betrayal festered, igniting a fire of resentment that threatened to consume him. “In my experience, trust is a fragile thing,” he often remarked, his sardonic humor betraying the vulnerability he rarely showed.",
      "His alibi was precarious; having been at the bar during the critical time, he found himself in a web of suspicion. No one could confirm his whereabouts, and as the investigation progressed, he felt the walls closing in. The stakes were high, not just for his reputation but for his family's dignity. This was a chance to reclaim their name, a chance to confront the shadows of his past while navigating the treacherous waters of the present.",
      "As Ivor delved deeper into the investigation, he found himself grappling with more than just the murder. The psychological scars of his service began to surface, forcing him to confront the demons he had long buried. This case was no longer just about justice; it was an opportunity for redemption, a chance to rise above the darkness that had threatened to consume him for far too long."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a charming socialite in her twenties, is caught in a precarious web of financial desperation and social expectations against the backdrop of a murder investigation.",
    "publicPersona": "Known for her lavish parties and infectious charm, Beatrice is a celebrated figure among her peers, living a life of luxury and influence.",
    "privateSecret": "Beneath the surface of her glamorous existence lies a dire financial situation, as Beatrice struggles to maintain appearances while living beyond her means.",
    "motiveSeed": "With the victim poised to cut her off financially, Beatrice faces the prospect of losing her lavish lifestyle.",
    "motiveStrength": "strong",
    "alibiWindow": "During the murder, she was hosting a gathering in another part of the hotel, but the reliability of her witnesses is questionable.",
    "accessPlausibility": "With easy access to various parts of the hotel, she had ample opportunity to move undetected.",
    "stakes": "If her financial troubles are exposed, Beatrice risks falling from grace, losing everything she has built her identity upon.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a lively and engaging tone, often punctuating her stories with observational humor. She has a tendency to embellish details, making her narratives more entertaining while revealing her insecurities.",
    "signatureTic": "“Isn’t it just the most dreadful thing?”",
    "internalConflict": "Beatrice grapples with the conflict between her desire to maintain her social standing and the reality of her financial situation, creating tension in her relationships.",
    "personalStakeInCase": "The murder threatens to expose her financial struggles, and Beatrice understands that her social status hangs by a thread, making the stakes personal.",
    "paragraphs": [
      "Beatrice Quill twirled a strand of her hair as she surveyed the opulent ballroom, her laughter echoing off the gilded walls. A celebrated socialite in her twenties, she had mastered the art of charm, hosting lavish parties that kept her at the center of the local social scene. Yet beneath her sparkling exterior lay a precarious truth: her financial situation was crumbling. Living beyond her means had become a way of life, and the prospect of losing it all loomed like a dark cloud on the horizon.",
      "Her relationship with the victim, Sylvia Trent, had been one of convenience and mutual benefit. Beatrice had relied on Sylvia’s financial support to maintain her lifestyle, but now, with whispers of a cut-off swirling, she felt the ground shifting beneath her feet. “Isn’t it just the most dreadful thing?” she would exclaim, a nervous laugh escaping her lips as she tried to downplay her anxiety. Her observational humor often masked the tension coiling within her, as she struggled to keep her world intact.",
      "During the night of the murder, Beatrice had been hosting a gathering in another part of the hotel, a perfect cover for her possible involvement. The reliability of her witnesses was questionable, and as she navigated the investigation, she could feel the walls closing in. The stakes were high; if her financial troubles were exposed, she risked losing everything she had built her identity upon, and the fear of falling from grace was suffocating.",
      "As the investigation progressed, Beatrice found herself at a crossroads. She could either accept the reality of her situation and confront the truth, or she could continue the charade, risking everything for a lifestyle that was quickly slipping away. The choice weighed heavily on her, and as the tension in the air thickened, she knew that her future hinged on the outcome of this murder case."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a beloved author and the murder victim, was known for her poignant explorations of family and identity, but her upcoming memoir threatened to expose dark family secrets.",
    "publicPersona": "She was a respected figure in literary circles, admired for her deep understanding of human emotions and relationships.",
    "privateSecret": "Sylvia was in the process of writing a scandalous memoir that could potentially ruin the reputations of those closest to her.",
    "motiveSeed": "Her revelations posed a risk to many family members, each with their own secrets to protect.",
    "motiveStrength": "strong",
    "alibiWindow": "As the victim, her alibi window is moot; she was killed before the investigation could begin.",
    "accessPlausibility": "Sylvia had access to all areas of her hotel, where she often held meetings and discussions.",
    "stakes": "Her memoir could have drastically altered her family's relationships and reputations, making her murder a chilling consequence of her revelations.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Sylvia spoke with an eloquent and thoughtful cadence, often weaving intricate narratives that reflected her literary background. Her words were carefully chosen, revealing her introspective nature.",
    "signatureTic": "“Truth has a way of revealing itself.”",
    "internalConflict": "As she penned her memoir, Sylvia grappled with the moral implications of her revelations and the potential fallout on her family, torn between honesty and loyalty.",
    "personalStakeInCase": "The murder of Sylvia Trent serves as a grim reminder of the consequences of her writing and the secrets she had unearthed, making her story one of tragedy and complexity.",
    "paragraphs": [
      "Sylvia Trent was a name that resonated with readers and writers alike, a beloved author whose poignant explorations of family and identity had touched countless lives. Her eloquence and thoughtful prose had earned her a place in literary circles, where she was admired not just for her talent but for her insight into the human condition. Yet beneath the surface of her public persona lay a darker truth, one that would ultimately lead to her untimely demise.",
      "In the process of writing a scandalous memoir, Sylvia had unearthed secrets that threatened to unravel the very fabric of her family. With each keystroke, she grappled with the implications of her revelations, torn between the desire for honesty and the loyalty she felt towards those she loved. “Truth has a way of revealing itself,” she often mused, unaware of the peril that awaited her as she delved deeper into her past.",
      "Her murder sent shockwaves through the community, a chilling reminder of the consequences of her writing. The stakes had never been higher; her memoir could have drastically altered the reputations and relationships of those closest to her, and in the wake of her death, the investigation would peel back the layers of her life, exposing the complexities of her relationships.",
      "As the investigation unfolded, Sylvia’s story became one of tragedy, a life cut short by the very truths she sought to reveal. Her legacy would not only be defined by her literary contributions but also by the darkness that surrounded her final days. The secrets she had unearthed would continue to haunt those she left behind, and in her absence, the echoes of her words would linger, a testament to the power of truth and the fragility of human connections."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a charismatic real estate developer in his thirties, navigates a murder investigation with ambition and a hidden agenda, as the stakes rise for both him and the community.",
    "publicPersona": "With charm and ambition, Hugo is a well-known figure in local real estate, often seen as a driving force behind the town’s development.",
    "privateSecret": "Hugo has been secretly negotiating to buy the hotel, which would greatly benefit him if Eleanor fails, revealing his opportunistic tendencies.",
    "motiveSeed": "His knowledge of the victim's financial troubles could lead to a lucrative takeover, making him a potential suspect.",
    "motiveStrength": "moderate",
    "alibiWindow": "Hugo claims to have been meeting with a client in the hotel restaurant during the incident, a window that could be scrutinized.",
    "accessPlausibility": "With easy access to the hotel, he had the opportunity to maneuver unnoticed during the crucial moments.",
    "stakes": "The acquisition of the hotel would secure his financial future and solidify his legacy, making the murder investigation a personal affair.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Hugo speaks with a smooth, persuasive tone, often employing a mix of charm and subtle sarcasm. His dialogue is laced with clever quips that reveal his ambitious nature.",
    "signatureTic": "“Let’s not beat around the bush.”",
    "internalConflict": "Hugo is torn between his ambition and the ethical implications of his actions, as he grapples with the person he wants to be versus the opportunist he has become.",
    "personalStakeInCase": "The murder investigation threatens to derail his plans and expose his true intentions, making this case a pivotal moment in his life.",
    "paragraphs": [
      "Hugo Vane leaned against the bar, exuding an air of charisma that had made him a well-known figure in the local real estate scene. In his thirties, he was the embodiment of ambition, often seen as a driving force behind the town’s development. Yet, beneath that polished exterior lay a man entangled in a web of ambition and hidden agendas. Hugo had been secretly negotiating to buy the Voss Hotel, a deal that would secure his financial future if Eleanor Voss faltered.",
      "The murder of Sylvia Trent sent shockwaves through the community, and as the investigation unfolded, Hugo found himself navigating treacherous waters. His knowledge of the victim's financial troubles positioned him as a potential suspect, and he couldn't shake the feeling that his ambitions were being scrutinized. “Let’s not beat around the bush,” he often quipped, his polite savagery revealing an underlying tension as he tried to maintain control over the narrative.",
      "His alibi was shaky; claiming to have been meeting with a client in the hotel restaurant during the critical time, he felt the pressure mounting. The stakes had never been higher; the acquisition of the hotel would not only solidify his legacy but also define the trajectory of his career. As whispers of suspicion began to swirl, Hugo knew he had to tread carefully, balancing his ambitions with the ethical implications of his actions.",
      "As the investigation deepened, Hugo grappled with the person he wanted to be versus the opportunist he had become. This murder investigation threatened to derail his carefully laid plans, and as the pressure mounted, he found himself at a crossroads. Would he continue down the path of ambition, or would he choose to confront the darker aspects of his nature? In the shadows of the investigation, Hugo's true character would be tested, and the outcome would shape not only his future but the future of the entire community."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Crestview Hotel",
    "type": "seaside hotel",
    "place": "Lymington",
    "country": "England",
    "summary": "A grand seaside hotel perched on the rugged cliffs of Lymington, offering stunning ocean views and an air of mystery.",
    "visualDescription": "The Crestview Hotel boasts a whitewashed façade adorned with intricate woodwork. Tall windows framed in dark mahogany reflect the turbulent sea, while a wrought-iron balcony juts out over the cliff, inviting the ocean breeze. The lobby features an ornate chandelier casting a warm glow over plush armchairs and polished marble floors, where guests mingle under the watchful eyes of faded portraits.",
    "atmosphere": "A palpable tension hangs in the air, punctuated by the rhythmic crashing of waves against the cliffs and the distant sound of thunder.",
    "paragraphs": [
      "The Crestview Hotel stands as a sentinel against the turbulent sea, its whitewashed walls contrasting sharply with the brooding skies above. The salty scent of the ocean mingles with the faint aroma of fresh coffee wafting from the lobby, where guests gather, their conversations hushed and furtive. The grand chandelier overhead casts flickering shadows, creating an atmosphere thick with anticipation. Outside, the waves crash violently against the rocky shore, echoing the unease that grips the hotel. Rain begins to fall, pattering against the windows as if nature itself is trying to warn of impending doom.",
      "Inside, the narrow hallways are dimly lit, with heavy carpets muffling footsteps as guests navigate their way to their rooms. The stairwell, steep and winding, leads to secluded guest quarters, each with its own balcony overlooking the churning sea. The isolation of the hotel, perched precariously on the edge of the cliffs, adds to the sense of entrapment, making it clear that once inside, escape is not easily attained. The distant sound of a radio playing a somber tune drifts through the air, a reminder of the world outside, now shrouded in mystery and shadows.",
      "As evening descends, the atmosphere thickens with tension. The flickering candlelight casts long shadows across the lobby, where a group of guests huddle together, whispering conspiratorially. The air is heavy with the scent of damp wood and the lingering trace of tobacco smoke, a remnant of the day's conversations. Outside, the ocean roars, its relentless rhythm mirroring the beating hearts of those within. Secrets linger in every corner, and the hotel, with its labyrinthine corridors and hidden rooms, holds the key to a mystery that is only just beginning to unfold."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain showers",
    "timeFlow": "Days of mounting tension culminate in a stormy night.",
    "mood": "tense and suspenseful",
    "eraMarkers": [
      "ubiquitous radios playing somber tunes",
      "rationed wartime vehicles parked outside",
      "faded photographs of wartime heroes"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and damp wood",
      "secondary": [
        "flickering candlelight",
        "crackling fire in the lobby"
      ]
    },
    "paragraphs": [
      "The air is thick with a sense of foreboding, as the overcast sky looms heavy over the sea. The sound of waves crashing against the cliffs fills the spaces between hushed conversations, while the scent of rain-soaked earth mingles with the briny tang of the ocean. Shadows deepen as night falls, creating an atmosphere thick with suspense, where every creak of the building seems to whisper secrets long kept hidden.",
      "As the rain begins to fall in earnest, guests retreat to the comfort of the lobby, their faces illuminated by the soft glow of the chandelier. The crackling fire offers a momentary reprieve from the chill, but the tension remains palpable. Outside, the wind howls, rattling the windows and sending shivers down spines. The hotel, isolated on the cliffs, stands as both a refuge and a prison, holding within its walls the key to unraveling the mystery that unfolds."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Clifftop Balcony",
      "type": "exterior",
      "purpose": "Crime scene",
      "visualDetails": "A wrought-iron balcony overlooking the crashing waves below, with a view of the stormy sea.",
      "sensoryDetails": {
        "sights": [
          "dark clouds roiling above",
          "waves crashing against the rocks",
          "flashes of lightning in the distance",
          "wet iron railing glistening"
        ],
        "sounds": [
          "howling wind",
          "thunder rumbling",
          "waves crashing violently",
          "distant seagulls cawing"
        ],
        "smells": [
          "salted sea air",
          "damp earth",
          "wet iron",
          "faint smoke from a nearby chimney"
        ],
        "tactile": [
          "cold, slick metal railing",
          "chill of the ocean breeze",
          "rough stone underfoot",
          "moist air on the skin"
        ]
      },
      "accessControl": "Access restricted to guests only after dark; staff only during daylight hours for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "mist rising from the sea",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady patter of rain",
            "water dripping from the eaves"
          ],
          "smells": [
            "fresh rain on stone",
            "damp wood",
            "marine brine"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light over the ocean",
            "shadows stretching across the balcony"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "the creak of the balcony underfoot"
          ],
          "smells": [
            "wet earth",
            "seaweed",
            "mildew"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "stars twinkling over the ocean",
            "moonlight reflecting on the water"
          ],
          "sounds": [
            "the whisper of waves",
            "soft rustle of leaves in the breeze"
          ],
          "smells": [
            "cool night air",
            "faint scent of jasmine"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The clifftop balcony, a precarious platform jutting out over the tumultuous sea, offers a breathtaking view marred by an ominous presence. The iron railing, cold to the touch, is slick with rain, and the air is thick with the scent of salt and damp earth. As thunder rumbles in the distance, the atmosphere is charged with a palpable tension. The crashing waves below seem to echo the turmoil within, as the storm gathers strength, mirroring the dark events that have transpired here.",
        "In the aftermath, the balcony holds the secrets of what occurred. The remnants of a struggle are evident in the overturned chairs, their surfaces slick with rain. The distant cry of a seagull breaks the silence, a haunting reminder of the isolation that this cliffside retreat offers. With each crash of the waves, the mystery deepens, drawing the unwitting into its depths, where answers lie hidden among the shadows."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "An opulent lobby with high ceilings, ornate chandeliers, and plush seating areas.",
      "sensoryDetails": {
        "sights": [
          "glistening marble floors",
          "faded portraits on the walls",
          "heavy drapes framing tall windows",
          "glimmering chandelier"
        ],
        "sounds": [
          "murmurs of conversation",
          "clinking of glassware",
          "soft piano music",
          "fire crackling in the hearth"
        ],
        "smells": [
          "rich coffee brewing",
          "old wood polish",
          "tobacco smoke lingering",
          "freshly baked pastries"
        ],
        "tactile": [
          "soft velvet cushions",
          "cool marble underfoot",
          "warmth from the hearth",
          "smooth wood of the reception desk"
        ]
      },
      "accessControl": "Open access for all guests and visitors; staff manage supplies and cleaning throughout the day.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through windows",
            "raindrops streaking the glass"
          ],
          "sounds": [
            "steady rain on the roof",
            "soft whispers of guests"
          ],
          "smells": [
            "freshly brewed tea",
            "damp wool from coats",
            "scent of wet earth"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "guests huddled in corners"
          ],
          "sounds": [
            "quiet conversations",
            "the ticking of a wall clock"
          ],
          "smells": [
            "woodsmoke",
            "fading flowers",
            "dusty books"
          ],
          "mood": "melancholic stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "guests laughing softly"
          ],
          "sounds": [
            "soft piano music",
            "clinking of glasses"
          ],
          "smells": [
            "warm baked bread",
            "wine and cheese",
            "candle wax melting"
          ],
          "mood": "inviting warmth"
        }
      ],
      "paragraphs": [
        "The Grand Lobby, a space designed for elegance and comfort, welcomes all who enter with its warm glow and inviting atmosphere. The air is filled with the rich aroma of coffee and the faint scent of tobacco from the plush seating areas, where guests gather to discuss news of the day. The high ceilings echo with the soft strains of a piano, while the chandelier casts a golden light over the marble floors, reflecting the lives of those who have passed through. Yet beneath the surface charm lies an undercurrent of tension, as secrets swirl among the guests.",
        "As the day progresses, the lobby becomes a stage for whispered conversations and furtive glances. The flickering fire in the hearth provides warmth but also shadows that conceal intentions. Guests arrive and depart, each with their own stories, their own mysteries, and the lobby becomes a tapestry of lives intersecting, where danger and deceit lurk just out of sight."
      ]
    },
    {
      "id": "library",
      "name": "The Hotel Library",
      "type": "interior",
      "purpose": "Quiet refuge and clue discovery",
      "visualDetails": "A dark wood-paneled room filled with shelves of old books and comfortable seating.",
      "sensoryDetails": {
        "sights": [
          "dark wood shelves lined with books",
          "soft glow of table lamps",
          "dust motes dancing in the light",
          "faded upholstery on chairs"
        ],
        "sounds": [
          "pages turning softly",
          "the ticking of a clock",
          "distant laughter from the lobby",
          "the crackle of a fireplace"
        ],
        "smells": [
          "musty pages of old books",
          "leather bindings",
          "hint of tobacco smoke",
          "warmth of burning wood"
        ],
        "tactile": [
          "smooth leather chair seats",
          "cool wood of the book spines",
          "soft woolen throws",
          "warmth from the fireplace"
        ]
      },
      "accessControl": "Access limited to guests with library cards; staff can enter for restocking and cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked windows",
            "grey light filtering in"
          ],
          "sounds": [
            "soft rain pattering against glass",
            "the rustle of pages"
          ],
          "smells": [
            "freshly brewed coffee",
            "damp paper",
            "old leather"
          ],
          "mood": "reflective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "light fading from the windows"
          ],
          "sounds": [
            "silence punctuated by a clock ticking",
            "the occasional cough"
          ],
          "smells": [
            "dusty paper",
            "old varnish",
            "woodsmoke"
          ],
          "mood": "pensive quiet"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "flickering candlelight on the walls",
            "cozy atmosphere with guests reading"
          ],
          "sounds": [
            "whispers of conversation",
            "the crackle of the fire"
          ],
          "smells": [
            "warm wood",
            "freshly brewed tea",
            "the scent of old books"
          ],
          "mood": "intimate warmth"
        }
      ],
      "paragraphs": [
        "The Hotel Library provides a sanctuary from the bustling lobby, its dark wood-paneled walls enveloping visitors in a sense of calm. Shelves lined with dusty tomes hold the whispers of forgotten stories, and the air is thick with the scent of old paper and leather. Soft lighting casts a warm glow over the room, inviting guests to settle into plush chairs and lose themselves in the pages of a book. Yet, among the quietude, there lies an undercurrent of tension, as each guest may hold a key to the mysteries that unfold.",
        "With the rain drumming softly against the windows, the library becomes a refuge for those seeking solace or answers. The ticking clock serves as a reminder of time slipping away, while the occasional creak of the floorboards adds to the atmosphere of suspense. As guests pore over the pages, the library transforms into a repository of secrets, where the past and present collide, and the truth waits to be uncovered amidst the shadows."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Dining Room",
      "type": "interior",
      "purpose": "Gathering space and clue discovery",
      "visualDetails": "An elegant dining area with large windows overlooking the sea, adorned with white tablecloths and fine china.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on crisp white cloths",
          "large windows framing the stormy sea",
          "floral centerpieces on each table",
          "glittering chandeliers overhead"
        ],
        "sounds": [
          "clinking of forks and knives",
          "soft conversations",
          "the rhythmic crash of waves",
          "the hum of the kitchen"
        ],
        "smells": [
          "aromatic herbs and spices",
          "freshly baked bread",
          "grilled fish",
          "sweet dessert pastries"
        ],
        "tactile": [
          "smooth china plates",
          "cool metal cutlery",
          "soft fabric napkins",
          "warmth from the kitchen"
        ]
      },
      "accessControl": "Open access during meal times; restricted access to kitchen for staff only.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "fog rolling in over the sea",
            "damp tables from the morning mist"
          ],
          "sounds": [
            "rain tapping against windows",
            "soft whispers of guests"
          ],
          "smells": [
            "freshly brewed coffee",
            "buttered toast",
            "damp wool"
          ],
          "mood": "cozy warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "guests seated in quiet conversation"
          ],
          "sounds": [
            "soft laughter",
            "the clinking of cups"
          ],
          "smells": [
            "rich beef stew",
            "fading floral arrangements",
            "baking pie"
          ],
          "mood": "introspective calm"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candles flickering on tables",
            "guests toasting with glasses raised"
          ],
          "sounds": [
            "the gentle clink of glass",
            "lively chatter"
          ],
          "smells": [
            "sizzling seafood",
            "fresh herbs",
            "sweet dessert aromas"
          ],
          "mood": "festive celebration"
        }
      ],
      "paragraphs": [
        "The Dining Room, a lavishly appointed space overlooking the turbulent sea, serves as both a gathering place and a backdrop for intrigue. Guests are seated at tables adorned with crisp white tablecloths, where the gleam of silverware reflects the flickering candlelight. The air is rich with the aroma of gourmet dishes being prepared in the kitchen, mingling with the scent of salt from the ocean. Conversations flow as freely as the wine, yet beneath the surface, tension simmers, each guest aware that they share a space fraught with unspoken secrets.",
        "As evening settles in, the atmosphere shifts, transforming the dining experience into one of anticipation. Laughter and clinking glasses fill the air as guests toast to camaraderie. However, the storm outside mirrors the brewing conflicts within, and every shared glance and hushed whisper hints at the mysteries yet to be unraveled. The Dining Room, with its elegant setting, becomes a stage where the drama unfolds, and the truth remains tantalizingly out of reach."
      ]
    }
  ],
  "note": "",
  "cost": 0.00236728635,
  "durationMs": 39928
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1946,
    "month": "January",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "overcast with frequent rain showers",
      "cool temperatures averaging between 35-45°F",
      "occasional gusts of wind off the seaside"
    ],
    "daylight": "Short daylight hours, with the sun rising around 7:45 AM and setting by 4:30 PM, creating a dim ambiance throughout the day.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests settle in after dinner.",
    "holidays": [
      "New Year's Day (January 1)"
    ],
    "seasonalActivities": [
      "brisk walks along the beach",
      "indoor board games by the fire",
      "attending evening dances at the hotel"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy blazer",
        "tweed trousers",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "woolen sweaters",
        "corduroy jackets",
        "flannel shirts"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with a fitted waist",
        "tailored wool coat",
        "pearl necklace"
      ],
      "casual": [
        "knee-length skirts paired with cashmere sweaters",
        "blouses with bow ties",
        "cardigans"
      ],
      "accessories": [
        "cloche hats",
        "fur stoles",
        "handbags with beaded embellishments"
      ]
    },
    "trendsOfTheMoment": [
      "tailored silhouettes for both genders",
      "fabrics like wool and cashmere gaining popularity",
      "bold colors contrasted with muted tones"
    ],
    "socialExpectations": [
      "women expected to balance work with domestic responsibilities",
      "men still viewed as primary breadwinners",
      "polite society emphasizing formal dining etiquette"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "U.S. troops returning home after World War II",
      "Tensions rising between the Soviet Union and the West",
      "The establishment of the United Nations in October 1945"
    ],
    "politicalClimate": "A growing fear of communism in the U.S., leading to increasing scrutiny of political affiliations.",
    "economicConditions": "Post-war economic adjustments, with inflation beginning to rise and shortages still affecting certain consumer goods.",
    "socialIssues": [
      "Struggles of war veterans reintegrating into civilian life",
      "Discussions around civil rights starting to gain traction",
      "Women advocating for continued workforce participation"
    ],
    "internationalNews": [
      "The Nuremberg Trials continuing to dominate headlines",
      "Britain facing severe economic difficulties with rationing still in effect"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "The Ink Spots' 'I Don't Want to Set the World on Fire'",
        "Doris Day's 'Sentimental Journey'"
      ],
      "films": [
        "'It's a Wonderful Life'",
        "'The Best Years of Our Lives'",
        "'Brief Encounter'"
      ],
      "theater": [
        "Broadway shows like 'Annie Get Your Gun'",
        "Local theater productions gaining popularity"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Shadow'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Catcher in the Rye' by J.D. Salinger",
        "'The Thin Man' by Dashiell Hammett",
        "'Animal Farm' by George Orwell"
      ],
      "popularGenres": [
        "detective fiction",
        "post-war literature",
        "romantic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial television broadcasts",
        "improvements in radar technology",
        "advancements in aviation technology"
      ],
      "commonDevices": [
        "radios in most households",
        "early television sets in urban areas",
        "typewriters still prevalent in offices"
      ],
      "emergingTrends": [
        "increased use of plastics",
        "growing interest in home appliances",
        "rise of consumer electronics"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Taxi fare across town: two shillings"
      ],
      "commonActivities": [
        "Socializing at local dances",
        "Participating in community events",
        "Family gatherings around the radio"
      ],
      "socialRituals": [
        "Evening dinners as family time",
        "Sunday church services followed by communal meals"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Growing awareness of class disparities",
      "Emerging middle-class aspirations"
    ],
    "gender": [
      "Women increasingly stepping into roles traditionally held by men",
      "Expectations for women to maintain home and family despite workforce participation",
      "Debates around women's rights beginning to surface"
    ],
    "race": [
      "Racial segregation still prevalent in many areas",
      "Early stirrings of civil rights activism"
    ],
    "generalNorms": [
      "Politeness and etiquette emphasized in social settings",
      "Adherence to traditional gender roles",
      "Community involvement seen as a civic duty"
    ]
  },
  "atmosphericDetails": [
    "The salty scent of the ocean mingled with damp sea air, creating a heavy atmosphere in the seaside hotel.",
    "The soft sound of rain tapping against the windows, combined with distant thunder, adds a layer of suspense to the evening.",
    "Occasional laughter and the clinking of glasses can be heard from the dining room, contrasting with the tense whispers of guests in the lounge."
  ],
  "paragraphs": [
    "In January 1946, the seaside hotel stands as a sanctuary against the dreary winter weather. Overcast skies loom overhead, delivering sporadic rain showers that soak the sandy beach and make the coastal air crisp and invigorating. Guests, seeking respite from the post-war uncertainties, gather near the fireplace, their conversations peppered with memories of the war and hopes for the future. The sun sets early, casting long shadows that dance across the hotel’s polished wooden floors, creating an ambiance thick with tension and anticipation.",
    "Fashion this winter reflects a blend of elegance and practicality. Men don tailored double-breasted blazers over crisp flannel shirts, while women adorn themselves in fitted tea-length dresses, often paired with stylish cloche hats. The colors are a mix of muted tones and bold prints, striking a balance between the somber mood of the times and the desire for personal expression. As guests mingle in the dimly lit hotel lounge, the soft glow of lamps highlights the textured fabrics of their clothing, creating a visual feast of post-war style.",
    "Daily life in January 1946 is a complex tapestry woven from the threads of recent history. Families gather for evening meals, sharing stories of the past year while listening to the crackling radio that fills the room with music and news. Prices for everyday items are modest, reflecting a time still recovering from wartime shortages. The community engages in social rituals, such as Sunday church services followed by hearty meals, reinforcing bonds amidst the uncertainty of the future. As tensions rise on the world stage, the hotel becomes a microcosm of society's struggles and aspirations."
  ],
  "note": "",
  "cost": 0.0010606579500000001,
  "durationMs": 15658
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of hotel guests and staff are drawn together by a mysterious death, where the pressures of post-war life and shifting social roles create an atmosphere of suspicion and hidden agendas.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has altered class dynamics, with women increasingly stepping into roles traditionally held by men, creating tension among guests and staff as they navigate their new societal positions."
  },
  "setting": {
    "location": "A large seaside hotel with a view of the ocean",
    "institution": "seaside hotel",
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
  "theme": "Golden Age country-house murder driven by a mechanical clock-tampering method."
}

### LOCKED_FACTS
[
  {
    "id": "clock_time",
    "value": "ten minutes past eight",
    "description": "The actual time when the murder occurred."
  },
  {
    "id": "clock_chime_time",
    "value": "a quarter to nine",
    "description": "The time displayed when the clock chimed, misleading witnesses."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 12,
  "countsByPlacement": {
    "early": 3,
    "mid": 8,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 11,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_early_1",
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
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_mid_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_4",
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
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
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

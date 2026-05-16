# Actual Prompt Record

- Run ID: `mystery-1778616265039`
- Project ID: ``
- Timestamp: `2026-05-12T20:07:50.131Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `3bb5b0de874cf49e`

## Message 1 (role=system)

```text
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
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
  - storyEmotionalArc.arcDescription MUST be at least 300 words across multiple paragraphs.
    A single-paragraph summary is insufficient regardless of word count — the emotional
    journey must unfold across clearly distinct paragraphs.
    Trace opening → rising tension → first turn → mid → second turn → climax → resolution.
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
    "title": "The Clockwork Conspiracy",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Manor House",
      "country": "England",
      "institution": "Country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "public_persona": "Acclaimed local journalist",
      "private_secret": "Has a hidden past linked to the victim",
      "motive_seed": "Desire for truth and justice",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Manor House access"
      ],
      "behavioral_tells": [
        "Keen observer",
        "Notices inconsistencies"
      ],
      "stakes": "Personal reputation and moral compass",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "medical professional",
      "relationships": [
        "Eleanor Voss",
        "Captain Ivor Hale"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Was in financial trouble due to the Great Depression",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "11:00 AM - 11:45 AM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical supplies",
        "Manor House access"
      ],
      "behavioral_tells": [
        "Nervous when discussing finances"
      ],
      "stakes": "Professional standing and financial security",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "military officer",
      "relationships": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Beatrice Quill"
      ],
      "public_persona": "Retired army officer",
      "private_secret": "Has a grudge against the victim",
      "motive_seed": "Desire for revenge",
      "motive_strength": "high",
      "alibi_window": "11:00 AM - 11:50 AM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Manor House access"
      ],
      "behavioral_tells": [
        "Aggressive when provoked",
        "Defensive about the past"
      ],
      "stakes": "Honor and closure",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "housemaid",
      "relationships": [
        "Eleanor Voss",
        "Captain Ivor Hale"
      ],
      "public_persona": "Diligent servant",
      "private_secret": "In love with Captain Hale",
      "motive_seed": "Protecting Hale's reputation",
      "motive_strength": "moderate",
      "alibi_window": "11:00 AM - 11:30 AM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Manor House access"
      ],
      "behavioral_tells": [
        "Eager to please",
        "Loyal to Hale"
      ],
      "stakes": "Romantic future",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "During a family reunion at a grand manor, the prominent local figure is found dead after a mechanical clock was tampered with, leading to a web of lies, unearthing deep-seated grievances and revealing hidden motives."
    },
    "accepted_facts": [
      "The clock in the study was found stopped at ten minutes past eleven.",
      "A note indicating a meeting scheduled for a quarter past eleven was discovered nearby.",
      "Witnesses recall hearing a chime just before the time of death."
    ],
    "inferred_conclusions": [
      "The clock was tampered to mislead the timing of the murder.",
      "The victim was likely killed at a different time than what was perceived."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was rewound to create a false timeline of the murder.",
      "delivery_path": [
        {
          "step": "The clock was reset in the study, misleading witnesses about the actual time of death."
        }
      ]
    },
    "outcome": {
      "result": "Confusion among witnesses about the timeline leading to the murder."
    }
  },
  "false_assumption": {
    "statement": "The murder must have occurred at the time indicated by the stopped clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses all refer to the clock as accurate at the time of the event.",
    "what_it_hides": "The actual time of death was much earlier due to the clock's tampering."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "10:10 AM",
        "11:15 AM"
      ],
      "windows": [
        "10:00 AM - 11:00 AM"
      ],
      "contradictions": [
        "The clock stopped at 10:10 AM but witnesses claim it was 11:15 AM when the murder happened."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Captain Ivor Hale",
        "Dr. Mallory Finch",
        "Beatrice Quill"
      ],
      "objects": [
        "The clock",
        "The note",
        "The study"
      ],
      "permissions": [
        "All characters had access to the study."
      ]
    },
    "physical": {
      "laws": [
        "Mechanical function of clocks",
        "Time consistency"
      ],
      "traces": [
        "Fingerprints on the clock's mechanism",
        "Footprints in the study"
      ]
    },
    "social": {
      "trust_channels": [
        "Family relationships",
        "Professional respect"
      ],
      "authority_sources": [
        "Local police",
        "Victim's standing in the community"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The study clock shows signs of tampering with fresh tool marks.",
        "correction": "The clock's mechanism was altered to mislead witnesses about the time of death.",
        "effect": "Narrows down the timeframe of the murder, eliminating the possibility of it happening at 11:15 AM.",
        "required_evidence": [
          "The clock was found stopped at ten minutes past eleven.",
          "Witness statements recall the clock chiming inconsistently."
        ],
        "reader_observable": true
      },
      {
        "observation": "The note indicates a meeting time of a quarter past eleven.",
        "correction": "The timing of the meeting suggests that the murder must have happened before this time.",
        "effect": "Eliminates Dr. Mallory Finch as a suspect since her alibi overlaps with the meeting time.",
        "required_evidence": [
          "The note found in the study.",
          "Witness accounts of Dr. Finch's whereabouts during the critical time."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses state they heard a chime at 11:00 AM.",
        "correction": "This contradicts the tampered clock suggesting the murder occurred earlier.",
        "effect": "Narrows the suspect pool by confirming that the murder occurred before the chime.",
        "required_evidence": [
          "Witness statements about the clock chime.",
          "The clock's tampering evidence."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, study, and tamper against the claimed timeline.",
    "knowledge_revealed": "The actual time of death based on the clock's mechanical state.",
    "pass_condition": "Demonstrating the impossibility of Hale's alibi based on the tampered clock.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's tampering evidence and the note (early) set the stage for the timeline. Step 2: Witness statements about the clock's chime contradict Hale's alibi. Step 3: The controlled demonstration exposes the impossibility of his claims."
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
      "test_type": "mechanical demonstration"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi overlaps with the meeting time.",
        "supporting_clues": [
          "clue_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No motive or access during the murder timeframe.",
        "supporting_clues": [
          "clue_1"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of clock tampering."
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation of the clock."
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Discovery of the meeting note."
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statements regarding the chime."
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A retired schoolteacher with a sharp mind and a scandalous past, Eleanor Voss finds herself drawn into a web of intrigue when a former pupil dies unexpectedly.",
    "publicPersona": "Eleanor is the epitome of the respected elder, known for her insightful observations and sharp wit that often leaves her peers in both admiration and awe. Her presence at community gatherings is met with warm greetings and reverent nods, as she often dispenses wisdom like a seasoned oracle.",
    "privateSecret": "Beneath her polished exterior lies a secret that could tarnish her reputation: an affair with a former student that still haunts her. This hidden chapter of her life is a source of both shame and a yearning for redemption.",
    "motiveSeed": "The recent death of her former pupil, who had ties to the victim, stirs a curiosity in Eleanor that she cannot ignore. It beckons her to investigate, to uncover the truth that may provide closure not only for herself but also for those affected by this tragedy.",
    "motiveStrength": "moderate",
    "alibiWindow": "Eleanor claims to have attended a local charity event from six to eight, where she mingled with other community members, seemingly above reproach.",
    "accessPlausibility": "possible",
    "stakes": "For Eleanor, this investigation is a chance at redemption, a way to confront her past mistakes and perhaps make amends, even if only within her own conscience.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured cadence, often punctuating her sentences with a slight, knowing smile. She has a penchant for using literary references, which adds a layer of sophistication to her dialogue, though she can also deliver sharp retorts that reveal her underlying wit.",
    "internalConflict": "Haunted by the ghosts of her past, Eleanor grapples with guilt over her previous indiscretions. As she delves deeper into the investigation, she fears that unearthing the truth might expose her own secrets, further complicating her quest for redemption.",
    "personalStakeInCase": "This crime matters to Eleanor not only because of her connection to the deceased but also because it represents a chance to confront her past and seek forgiveness for her earlier transgressions.",
    "paragraphs": [
      "Eleanor Voss, a name synonymous with wisdom in Little Middleton, had always found solace in the pages of dusty tomes and the laughter of her students. Yet, beneath the surface of her respectable facade lay a tempest of secrets—one that had begun to resurface with the recent death of a former pupil. She had always prided herself on her sharp wit and keen insight, traits that had made her a beloved figure in the community. But now, as shadows from her past loomed larger, Eleanor felt the need to unearth the truth behind the tragedy, not just for the sake of justice but for her own redemption.",
      "At the local charity event, Eleanor mingled with familiar faces, her laughter ringing out like a bell. Yet, even as she exchanged pleasantries, her mind was elsewhere, consumed by thoughts of the deceased and the implications of their intertwined lives. The whispers of scandal that had once clung to her like a shroud now felt like a weight she could no longer bear. Eleanor's heart raced as she pondered the connections between her past and the present—could her former indiscretions have led to this calamity?",
      "As she navigated the labyrinth of her memories, Eleanor was determined to find answers. Her sharp mind, honed over years of teaching, was her greatest asset, yet it also served as a reminder of her failures. The affair with her student had been a reckless mistake, one that she had buried deep within her heart, but now it threatened to rise again, intertwining with her current investigation. Could she uncover the truth without exposing herself? The irony of her situation was not lost on her; she had always been the one to guide others toward the light, yet here she was, shrouded in darkness herself.",
      "With each clue she discovered, Eleanor felt the pull of her past growing stronger. The stakes were high, not just for the case but for her own soul. If she could unravel the mystery surrounding her former pupil's death, perhaps she could begin to mend the rift in her own heart. The path ahead was fraught with danger and uncertainty, yet Eleanor pressed on, driven by a desire for redemption that burned brightly within her. As she delved deeper into the conspiracy, she knew that the truth would either set her free or bind her forever to the shadows of her past."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A talented physician caught in a web of ambition and secrecy, Dr. Mallory Finch must navigate the treacherous waters of her personal life as she becomes embroiled in a murder investigation.",
    "publicPersona": "Mallory is a dedicated doctor, revered in Little Middleton for her medical expertise and progressive views. She commands respect from her peers and patients alike, often seen as a beacon of hope in the community's medical affairs.",
    "privateSecret": "However, behind her professional exterior lies a precarious secret: a clandestine relationship with a wealthy patient that threatens to unravel her carefully constructed life. The fear of exposure looms over her like a dark cloud, casting doubt on her future.",
    "motiveSeed": "The knowledge that the victim was aware of her relationship sends shivers down her spine. The fear that this could ruin her reputation drives her to consider desperate measures to safeguard her career.",
    "motiveStrength": "strong",
    "alibiWindow": "During the hours from seven to ten, Mallory was busy treating patients at the hospital, a fact that she hopes will provide her with a solid alibi.",
    "accessPlausibility": "easy",
    "stakes": "For Mallory, the stakes are high; her career and reputation hang in the balance, and the thought of losing everything she has worked for terrifies her.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Mallory speaks with a brisk efficiency, her words often laced with a sardonic edge. She has a tendency to employ medical jargon even in casual conversations, occasionally catching her listeners off guard. When she is flustered, her sentences can become rapid-fire, revealing her inner turmoil.",
    "internalConflict": "The dichotomy of her ambition and the ethical implications of her secret relationship creates a storm within Mallory. She grapples with the fear that her desire for success may lead her to compromise her values, further complicated by the murder investigation that threatens to expose her.",
    "personalStakeInCase": "This case matters deeply to Mallory as it not only puts her career at risk but also forces her to confront the moral implications of her choices, challenging her ambition against the backdrop of ethical dilemmas.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the bustling hospital, the scent of antiseptic filling the air as she navigated her way through the chaos. Respected and admired, she wore her white coat like armor, a shield against the judgments of the world. Yet, beneath her confident facade lay a tempest of anxiety, fueled by the secret that threatened to unravel her life. The recent murder of a patient who knew too much about her clandestine affair had pushed her to the edge, igniting a fear that had become all-consuming.",
      "As she treated patients, each interaction became a reminder of the precarious balance she walked. Mallory's sharp mind raced with thoughts of the victim and the potential fallout from their connection. The whispers of scandal danced at the edges of her consciousness, and she found herself questioning every decision she had made. Could she keep her secret hidden, or would it soon come crashing down around her like a house of cards? The stakes had never been higher, and she felt the weight of her ambition pressing down like a leaden cloak.",
      "In her quieter moments, Mallory's sardonic humor served as both a defense mechanism and a coping strategy. She often found herself laughing at the absurdity of her situation, using wit to mask her vulnerabilities. But the laughter felt hollow, a façade that could shatter at any moment. The medical jargon that flowed effortlessly from her lips during consultations became a tangled web of words when she was alone, revealing the turmoil that lay just beneath the surface. Each sarcastic quip was a reminder of the walls she had built to protect herself, walls that now felt more like a prison.",
      "As the investigation unfolded, Mallory realized that her ambition was at odds with her moral compass. The fear of losing her career loomed large, yet the thought of compromising her values gnawed at her conscience. She was caught in a vortex of competing desires, each pulling her in a different direction. As she delved deeper into the mystery, she knew that the truth would not only determine her fate but also force her to confront the choices she had made. Would she emerge from this ordeal unscathed, or would it be the catalyst that forced her to reevaluate her life and the secrets she had kept hidden?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A charming retired naval officer, Captain Ivor Hale's past is marred by financial ruin and PTSD, leading him to a precarious position in the wake of a murder investigation.",
    "publicPersona": "Once a respected naval officer, Ivor now carries the charm of a storyteller, captivating those around him with tales of his service. His charisma often masks the turmoil that brews beneath, allowing him to navigate social circles with ease.",
    "privateSecret": "However, the charming exterior belies a troubled soul. Ivor struggles with PTSD from his time in the navy and faces financial ruin, a situation only exacerbated by his debts to the victim.",
    "motiveSeed": "The weight of his financial obligations to the victim looms large, creating a fear of exposure that drives Ivor to desperate measures.",
    "motiveStrength": "moderate",
    "alibiWindow": "From eight to midnight, Ivor was found drinking in a local tavern, a detail that could either serve as an alibi or raise suspicions.",
    "accessPlausibility": "possible",
    "stakes": "For Ivor, the stakes are dire; he must pay off his debts or face the consequences of his past, a burden that threatens to consume him.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor's speech is laced with self-deprecating humor, often punctuated by a wry smile. He has a tendency to speak in a relaxed, almost conversational tone, with a slight drawl that hints at his naval past. When discussing serious matters, he can become unexpectedly earnest, revealing glimpses of the turmoil beneath his jovial surface.",
    "internalConflict": "Ivor wrestles with the ghosts of his past, haunted by the memories of his service and the weight of his financial troubles. The pressure to maintain his charm while grappling with his inner demons creates a conflict that threatens to unravel him.",
    "personalStakeInCase": "This case matters to Ivor on a personal level, as it not only could determine his financial future but also force him to confront the realities of his past and the consequences of his actions.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the bar, a glass of whiskey in hand, his charming smile masking the storm brewing within. A retired naval officer, Ivor had once commanded respect on the high seas, but now he found himself adrift in a sea of financial ruin and haunting memories. His tales of valor and adventure captivated his listeners, yet they served as a smokescreen for the turmoil that plagued him. As he sipped his drink, he pondered the recent murder that had sent shockwaves through Little Middleton, a crime that struck uncomfortably close to home.",
      "The victim had been more than just a name in the headlines; they were a reminder of the debts that loomed over Ivor like a specter. The weight of his financial obligations pressed down on him, and he feared that exposure could lead to dire consequences. He had always been a charming raconteur, but now that charm felt like a mask, one that could slip at any moment. Ivor's self-deprecating humor often lightened the mood, but it also served as a shield against the judgment of others. With each laugh, he tried to distance himself from the reality of his situation.",
      "As the investigation unfolded, Ivor found himself entangled in a web of suspicion. The tavern, once a refuge, now felt like a trap where questions lingered in the air. His alibi, while seemingly solid, did little to quell the nagging doubts that crept into his mind. Ivor's charm could only carry him so far, and he realized that the truth would eventually come to light. The conflict between maintaining his facade and confronting his demons intensified, leaving him on edge as he navigated the treacherous waters of the case.",
      "In the quiet moments between the chaos, Ivor wrestled with his past—his service, his struggles, and the debts that threatened to drown him. The stakes were high, not just for the investigation but for his very future. Ivor's journey would force him to confront the consequences of his actions and the ghosts that haunted him. As he faced the possibility of exposure, he knew that the time had come to either sink or swim, and he was determined to find a way to rise above the depths that threatened to consume him."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A glamorous socialite with a secret activist's heart, Beatrice Quill navigates the complexities of high society while grappling with her disdain for the very world she inhabits.",
    "publicPersona": "Beatrice is the epitome of a glamorous socialite, effortlessly charming those around her with her beauty and poise. She is deeply involved in high society, often attending exclusive events that keep her in the public eye.",
    "privateSecret": "Beneath the surface, however, lies a simmering disdain for the upper class. Beatrice is secretly an activist, passionate about social justice issues, which puts her at odds with her family's expectations and the world she portrays.",
    "motiveSeed": "Her anger towards the victim, who she believes perpetuated social injustices, adds a layer of complexity to her character, fueling her internal conflict.",
    "motiveStrength": "weak",
    "alibiWindow": "Beatrice attended a gala from seven to ten PM, a glamorous affair that kept her in the public eye.",
    "accessPlausibility": "unlikely",
    "stakes": "For Beatrice, the stakes lie in reconciling her family's expectations with her own beliefs, as she struggles to carve out her identity amidst the societal pressures of her upbringing.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a refined elegance, her words often flowing with a melodic cadence. She has a tendency to make keen observations about the absurdities of high society, using her wit to navigate conversations with grace. When she feels strongly about a subject, her passion can ignite her speech, adding a layer of fervor to her dialogue.",
    "internalConflict": "Beatrice is torn between her family's expectations and her own beliefs, struggling to find her place in a world that often feels at odds with her values. The pressure to conform clashes with her desire to make a difference, leaving her in a constant state of internal conflict.",
    "personalStakeInCase": "This case matters to Beatrice as it forces her to confront the contradictions within herself and the society she inhabits, challenging her to reconcile her public persona with her private beliefs.",
    "paragraphs": [
      "Beatrice Quill glided through the gala with an air of effortless elegance, her laughter ringing like chimes in the night. As a socialite, she was accustomed to the glitz and glamour that surrounded her, yet beneath the surface, a tempest of discontent brewed. The victim's recent death was a stark reminder of the social injustices that Beatrice had long wished to expose, a contradiction that gnawed at her conscience. She smiled and nodded at familiar faces, all the while grappling with the anger that simmered just beneath her polished exterior.",
      "In conversations, Beatrice displayed a keen observational wit, often pointing out the absurdities of high society with a knowing glance. Her words danced gracefully, revealing her intelligence as she maneuvered through discussions about fashion and philanthropy. Yet, with each compliment she exchanged, she felt the weight of her family's expectations pressing down on her. The truth was, she despised the very world she was a part of, a realization that clashed violently with her public persona. The murder investigation brought her simmering disdain to the forefront, forcing her to confront the realities of the society she inhabited.",
      "As the night wore on, Beatrice found herself reflecting on the victim's role in perpetuating the very injustices she abhorred. The anger that had once been a quiet whisper now roared to life, demanding to be acknowledged. The stakes were high for her, for this investigation represented not just a crime but a reckoning with her own beliefs. Could she reconcile the glamorous life she led with her desire for social change? The conflict within her grew more pronounced, and she realized that the answers she sought lay within her own heart, waiting to be discovered.",
      "In the days that followed, Beatrice grappled with the implications of the case, torn between her family's legacy and her own convictions. The investigation forced her to confront the contradictions that defined her life, challenging her to step outside the gilded cage of privilege. As she delved deeper into the mystery, Beatrice knew that her journey would not only reveal the truth about the murder but also illuminate the path to her own identity. The time had come for her to decide who she truly wanted to be, and she was determined to forge her own destiny, one step at a time."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Middleton Manor",
    "type": "Country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "Middleton Manor stands as an imposing structure amidst its sprawling grounds, a testament to a bygone era now shrouded in mystery and tension.",
    "visualDescription": "The manor boasts a facade of weathered stone, its tall windows reflecting the overcast sky, while ivy clings to the walls, giving it an air of faded grandeur. A circular driveway leads to the grand entrance, flanked by manicured hedges and a fountain that has long ceased to flow, adding to the desolate atmosphere.",
    "atmosphere": "The air is thick with a sense of foreboding, as if the walls themselves hold secrets that whisper in the shadows.",
    "paragraphs": [
      "Middleton Manor looms over the estate, its stone walls dampened by the persistent drizzle that characterizes a typical British summer. The gardens, once vibrant with blooms, now appear muted under the oppressive grey sky, their carefully trimmed hedges standing as silent sentinels. The distant echoes of thunder rumble ominously, hinting at the tumult that stirs both in nature and within the household. Inside, the air is heavy with the scent of polished wood and the faint trace of mustiness, a reminder of years gone by without a proper airing.",
      "Within the manor, the rooms are adorned with heavy drapes, their rich fabrics absorbing light and sound alike, creating a cocoon of isolation. The drawing room, with its grand fireplace, remains cold and uninviting, while the library, a sanctuary of knowledge, sits locked and untouched, its secrets hidden behind heavy doors. The atmosphere is thick with tension, as each family member and staff member navigates their roles within the estate, each harboring their own motives and fears, all under the watchful eyes of the clock that ticks steadily in the hall, marking the passage of time and the gathering storm.",
      "As night falls, the flickering candlelight casts dancing shadows across the walls, transforming the manor into a labyrinth of uncertainty. The distant sound of rain pattering against the windows creates a rhythmic backdrop, punctuated by the creaks and groans of the old structure settling into the night. Each sound amplifies the feeling of isolation, as the nearest village lies a thirty-minute drive away, and the only company is the faint rustle of leaves outside, whispering secrets that might reveal the dark history of Middleton Manor."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical of a British summer",
    "timeFlow": "Three days of mounting tension leading to a climactic revelation",
    "mood": "Tense and foreboding, with an underlying sense of unease",
    "eraMarkers": [
      "Petrol touring cars parked in the circular driveway",
      "Domestic telephones with party lines ringing occasionally",
      "Typewriters in the study creating a rhythmic clatter"
    ],
    "sensoryPalette": {
      "dominant": "The pervasive smell of damp wood and old paper fills the rooms, a reminder of the manor's history.",
      "secondary": [
        "The faint, acrid scent of burning candle wax mingles in the air, hinting at the flickering lights in the drawing room.",
        "The distant smell of wet earth from the gardens adds to the somber atmosphere."
      ]
    },
    "paragraphs": [
      "The manor's atmosphere is steeped in a palpable tension that seems to cling to the air, thickening with every drop of rain that falls against the window panes. The overcast sky casts a dim light throughout, enhancing the shadows that stretch across the corridors and rooms, where sound is muffled and whispers travel like secrets. Each creak of the floorboards or rustle of fabric feels amplified, as if the house itself is alive, holding its breath in anticipation of the events that are about to unfold.",
      "Outside, the gardens, once a place of leisure, now feel hauntingly desolate, with the hedgerows forming natural barriers that isolate the manor from the world beyond. The scent of damp earth rises with each rain shower, a reminder of nature's encroachment on the estate. The mood is one of unease, as the weather reflects the brewing storm of emotions within, and the ticking of the clock echoes ominously, a constant reminder that time is running out for the secrets hidden within Middleton Manor."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The drawing room is an expansive space dominated by a grand fireplace, its mantle adorned with dusty antiques and family portraits that seem to watch over the proceedings. Richly upholstered furniture, now faded, is arranged in a semi-circle, inviting conversation yet feeling oddly confining under the weight of the tension that fills the air.",
      "sensoryDetails": {
        "sights": [
          "The flickering light from the fireplace casts long shadows across the room, dancing over the ornate wallpaper that has seen better days.",
          "Heavy drapes frame the tall windows, partially drawn, allowing only slivers of the dreary outside light to penetrate the gloom."
        ],
        "sounds": [
          "The soft crackling of the fire contrasts with the distant sound of rain tapping against the window, creating a haunting symphony of nature and confinement.",
          "Occasional creaks from the floorboards add to the unsettling atmosphere, as if the room itself is alive with secrets."
        ],
        "smells": [
          "The air hangs heavy with the scent of old leather and polished wood, mingling with the faint trace of smoke from the fire.",
          "A lingering scent of damp fabric and dust fills the corners, a reminder of the room's neglect over time."
        ],
        "tactile": [
          "The plush fabric of the armchairs feels worn and cool to the touch, a stark contrast to the warmth radiating from the fireplace.",
          "The smooth surface of the coffee table, marred by rings from long-forgotten drinks, offers a sense of history beneath one's fingertips."
        ]
      },
      "accessControl": "Access is restricted to family members and select staff, with the room remaining locked during the night. Scheduled gatherings are the only times when the drawing room is fully utilized.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-streaked windows distort the view of the garden, where droplets cling to the flowers like tears.",
            "The grey light filtering through enhances the shadows, making the room feel even more confined."
          ],
          "sounds": [
            "The steady drumming of rain on the roof creates a rhythmic backdrop that feels both soothing and oppressive.",
            "Occasional rumbles of thunder add a sense of urgency to the scene, echoing the tension in the room."
          ],
          "smells": [
            "The scent of damp earth wafts in through the windows, mingling with the musty aroma of the room.",
            "A faint whiff of mildew hints at the room's neglect, adding to the unease."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light blankets the room, softening the edges of furniture and creating an ethereal quality.",
            "Shadows stretch across the floor, lacking definition, as if the room itself is holding its breath."
          ],
          "sounds": [
            "A distant clock ticks steadily, its sound punctuating the silence, while the creak of old timbers adds to the tension.",
            "The soft rustle of clothing as family members shift nervously heightens the atmosphere of unease."
          ],
          "smells": [
            "The scent of beeswax from the candles lingers in the air, mixing with the dust that has settled over the years.",
            "A faint trace of woodsmoke from the fireplace adds warmth yet feels out of place in the current tension."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the walls, illuminating the dust motes that dance through the air like spirits.",
            "Long shadows stretch across the floor, creating a sense of depth and mystery that beckons exploration."
          ],
          "sounds": [
            "The soft tick of a mantel clock serves as a reminder of time slipping away, while distant voices from below stairs create a sense of life beyond the drawing room.",
            "The occasional crackle of the fire punctuates the silence, offering a brief respite from the tension."
          ],
          "smells": [
            "The warm scent of candle wax fills the air, rich and inviting, contrasting sharply with the tension in the room.",
            "The lingering aroma of tobacco from earlier conversations adds an air of sophistication yet hints at deeper secrets."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room, once a place of laughter and gatherings, now stands as a silent witness to the turmoil that has taken hold of the manor. Its ornate furnishings, though elegant, feel heavy with the weight of unspoken words and hidden agendas. Each family member enters with trepidation, knowing that beneath the surface of polite conversation lies a web of deceit that threatens to unravel at any moment.",
        "As the evening descends, the atmosphere tightens further, and the drawing room becomes a crucible where secrets are tested and alliances are formed. The flickering candlelight casts deceptive shadows that seem to dance with the tension, as if the very walls are eavesdropping on the whispered confessions and accusations that may lead to the unraveling of the clockwork conspiracy."
      ]
    },
    {
      "id": "library",
      "name": "The Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is a cavernous room lined with tall bookshelves filled with dusty tomes and leather-bound volumes that speak of knowledge and secrets. A large mahogany desk sits in the center, cluttered with papers and a typewriter, while a plush armchair invites one to sit and delve into the mysteries contained within the books.",
      "sensoryDetails": {
        "sights": [
          "The tall windows, covered in heavy drapes, allow only slivers of light to seep in, creating a dim, atmospheric glow that clings to the spines of the books.",
          "A globe in the corner, its surface scratched and worn, hints at the adventures and knowledge that lie beyond the manor's confines."
        ],
        "sounds": [
          "The soft rustle of pages turning fills the air, accompanied by the rhythmic click of the typewriter as it punctuates the silence.",
          "Occasional creaks of the floorboards add an air of mystery, as if the library itself is alive with whispers of the past."
        ],
        "smells": [
          "The scent of aged paper and leather permeates the room, evoking a sense of history and forgotten stories waiting to be uncovered.",
          "A faint trace of dust lingers in the corners, a reminder of the neglect that has fallen upon the library over the years."
        ],
        "tactile": [
          "The smooth surface of the mahogany desk contrasts sharply with the rough texture of the books, each one a vessel of knowledge waiting to be explored.",
          "The plush fabric of the armchair feels inviting yet cool, beckoning one to settle in and immerse themselves in the world of literature."
        ]
      },
      "accessControl": "Access to the library is limited to family members and select staff, with a strict schedule for usage. It remains locked during the night and is often the last place to be visited before bedtime.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops streak the glass, distorting the view of the garden and creating a sense of melancholy.",
            "The light filtering through the drapes is dim and grey, casting long shadows across the room."
          ],
          "sounds": [
            "The steady patter of rain against the window provides a soothing backdrop, interrupted only by the sound of the typewriter keys clacking.",
            "Occasional rumbles of thunder echo in the distance, lending an air of urgency to the atmosphere."
          ],
          "smells": [
            "The scent of damp wood and earth wafts in through the slightly open window, mingling with the musty aroma of old books.",
            "A faint aroma of wet ink from the typewriter adds to the sensory experience, creating a connection to the written words."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat, muted light fills the room, softening the colors of the books and furniture, creating an almost dreamlike quality.",
            "Shadows stretch languidly across the floor, blurring the lines between reality and the stories contained within the volumes."
          ],
          "sounds": [
            "The soft rustle of pages turning creates a gentle rhythm, while the ticking of a clock in the corner serves as a reminder of time passing.",
            "The creaking of the shelves adds an air of mystery, as if the books themselves are whispering secrets to one another."
          ],
          "smells": [
            "The rich scent of polished wood combines with the fresh aroma of paper, creating a comforting yet somber atmosphere.",
            "A hint of mildew from the neglected corners brings an unsettling quality to the otherwise inviting space."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers against the dark wood of the shelves, illuminating the spines of the books in a warm glow.",
            "The shadows dance playfully across the room, creating an atmosphere that is both inviting and ominous."
          ],
          "sounds": [
            "The quiet sound of a turned page is punctuated by the occasional crackle of candle wax as it melts, adding to the ambiance.",
            "The distant sound of laughter from the drawing room contrasts sharply with the solemnity of the library, highlighting the divide between public and private worlds."
          ],
          "smells": [
            "The warm scent of beeswax from the candles fills the air, mixing with the earthy aroma of worn pages.",
            "A hint of tobacco smoke lingers, a reminder of the conversations that have taken place within these walls."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library is a treasure trove of knowledge, yet it feels like a crypt holding secrets that are best left undisturbed. The shelves, lined with tomes of varying sizes and colors, create a labyrinthine quality, inviting exploration yet threatening to ensnare those who delve too deeply. It is here that clues may lie hidden, waiting for the right person to uncover them amidst the dust and shadows.",
        "As the clock ticks on, the atmosphere in the library shifts, thickening with anticipation. The faint sound of footsteps echoes from the corridor outside, a reminder that the world continues to turn beyond these walls, yet within the library, time seems to stand still, holding its breath as if awaiting the revelation of the conspiracy that has taken root within the manor."
      ]
    },
    {
      "id": "stables",
      "name": "The Stables",
      "type": "exterior",
      "purpose": "Gathering space",
      "visualDetails": "The stables are a rustic structure, built of weathered wood and stone, with a thatched roof that has seen better days. Inside, the scent of hay and leather fills the air, while the soft whinnies of horses provide a comforting yet lively atmosphere, contrasting with the tension of the manor.",
      "sensoryDetails": {
        "sights": [
          "The stables are lined with stalls, each occupied by a horse that peeks curiously from its enclosure, their coats gleaming in the dim light.",
          "A wooden beam overhead is adorned with old harnesses and tools, their wear and tear telling stories of countless rides through the countryside."
        ],
        "sounds": [
          "The gentle rustling of hay as horses shift in their stalls is accompanied by the rhythmic sound of hooves striking the ground.",
          "The low murmur of voices from stable hands discussing the day's work adds a layer of normalcy to the otherwise tense atmosphere of the manor."
        ],
        "smells": [
          "The rich, earthy scent of hay mixes with the sharp aroma of leather, creating a comforting yet pungent atmosphere.",
          "Occasional whiffs of horse sweat and the tang of metal from the tools contribute to the sensory richness of the stables."
        ],
        "tactile": [
          "The rough texture of the wooden beams contrasts with the soft, warm feel of a horse's muzzle as one reaches out to pet it.",
          "The coolness of the stone floor beneath one’s feet is a stark reminder of the stables' utilitarian purpose, grounding the visitor in the present."
        ]
      },
      "accessControl": "The stables are accessible to family members, staff, and guests with prior approval. They are often bustling with activity during the day but quiet and locked up at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops cling to the thatched roof, creating a rhythmic drumming that echoes through the stables.",
            "The dim light filters through the open doors, casting a soft glow on the wet ground, making it look almost reflective."
          ],
          "sounds": [
            "The sound of rain pattering against the roof is a comforting backdrop, mingling with the soft whinnies and snorts of the horses.",
            "The occasional clatter of hooves on the stone floor adds a lively cadence to the morning's quiet."
          ],
          "smells": [
            "The scent of fresh rain mingles with the earthy aroma of hay, creating a refreshing yet pungent atmosphere.",
            "A hint of wet leather from the harnesses adds a sharpness to the otherwise rich scent of the stables."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The light filtering through the open doors is muted, casting long shadows that stretch across the stalls and floor.",
            "The horses appear restless, their movements more pronounced in the dim light, adding to the feeling of unease."
          ],
          "sounds": [
            "The soft rustling of hay is interrupted by the occasional snort of a horse, creating a sense of agitation in the otherwise still air.",
            "The distant sound of thunder rumbling adds an ominous tone to the atmosphere, as if nature itself is echoing the tension within the manor."
          ],
          "smells": [
            "The rich scent of hay is more pronounced in the still air, mingling with the musk of horses that adds a layer of warmth.",
            "A faint trace of wet earth from the nearby garden seeps in, enhancing the earthy quality of the stables."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "The fading light casts a golden hue over the stables, illuminating the horses' coats and creating a serene atmosphere.",
            "Shadows lengthen as the sun sets, giving the stables an almost ethereal quality in the twilight."
          ],
          "sounds": [
            "The gentle nicker of horses settles into a soft lullaby, harmonizing with the distant sounds of laughter and conversation from the manor.",
            "The occasional creak of the wooden structure settling adds a reassuring familiarity to the evening."
          ],
          "smells": [
            "The warm scent of hay and leather fills the air, creating a comforting atmosphere that contrasts with the tension of the manor.",
            "A hint of sweet grass from the paddock outside wafts in, adding to the pastoral charm of the stables."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The stables serve as a gathering place for both family and staff, a space that feels alive with the energy of the horses and the chatter of stable hands. Here, amidst the rustic charm, conversations flow more freely, and secrets may slip through the cracks of laughter and shared stories. The warmth of the horses and the earthy aromas create an inviting atmosphere that contrasts sharply with the tension simmering within the manor.",
        "As the evening descends, the stables take on a different character, where the fading light casts long shadows and the sound of hooves becomes a soothing rhythm. Yet, even in this sanctuary, the unease from the manor creeps in, reminding all who gather here that the clockwork conspiracy continues to tick, and the truth remains just out of reach, hidden among the stalls and the soft whinnies of the horses."
      ]
    }
  ],
  "note": "",
  "cost": 0.0027498635999999997,
  "durationMs": 38783
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1933,
    "month": "March",
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "March",
    "weather": [
      "overcast skies with intermittent rain",
      "chilly breezes typical of early spring",
      "occasional bursts of sunlight peeking through clouds"
    ],
    "daylight": "Days are gradually lengthening, with daylight lasting until around six o'clock in the evening, though evenings remain cool and damp.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests are gathered for after-dinner conversation.",
    "holidays": [
      "No significant holidays, but preparations for Easter begin to emerge in the following weeks."
    ],
    "seasonalActivities": [
      "Spring cleaning in households as winter ends",
      "Hostile debates about political tensions over tea",
      "Preparations for local agricultural shows begin"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted suits in dark wool",
        "crisp white shirts with stiff collars",
        "bow ties or knitted ties as popular accessories"
      ],
      "casual": [
        "tweed jackets with elbow patches",
        "corduroy trousers",
        "flat caps or fedoras"
      ],
      "accessories": [
        "gold pocket watches",
        "leather gloves",
        "silk handkerchiefs"
      ]
    },
    "womensWear": {
      "formal": [
        "frock dresses with dropped waists and geometric patterns",
        "tailored suits with long jackets",
        "cloche hats adorned with flowers"
      ],
      "casual": [
        "sweater sets with short sleeves",
        "floral-print skirts",
        "cotton blouses with puffed sleeves"
      ],
      "accessories": [
        "string pearls",
        "small leather handbags",
        "feathered fascinators"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design and architecture",
      "Increased popularity of jazz music",
      "The rise of the 'New Woman' in fashion and social roles"
    ],
    "socialExpectations": [
      "Men expected to be the breadwinners",
      "Women encouraged to engage in social and political debates",
      "Class distinctions remain prominent in public and private life"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Debates in Parliament regarding the rising unemployment rates",
      "The start of the New Deal policies in the United States influencing British politics",
      "Political tensions in Europe escalating as the rise of fascism becomes more apparent"
    ],
    "politicalClimate": "The government is under pressure to address the economic crisis, with increasing unrest among the working class and growing fears of totalitarian movements.",
    "economicConditions": "The Great Depression is deeply felt, causing widespread unemployment and poverty, particularly impacting the working class and rural areas.",
    "socialIssues": [
      "Poverty and unemployment affecting social stability",
      "Class tensions rising as the upper class retreats into their estates",
      "Women's rights gaining traction amidst the traditional gender roles"
    ],
    "internationalNews": [
      "Hitler's rise to power in Germany causing alarm across Europe",
      "The League of Nations struggling to maintain peace",
      "The growing influence of fascist movements in various countries"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Benny Goodman and his big band",
        "The Charleston and other jazz dances",
        "Classical music still holds its ground with composers like Stravinsky"
      ],
      "films": [
        "King Kong released in 1933, capturing the public's imagination",
        "The era of talkies flourishing",
        "Romantic and adventure films gaining popularity"
      ],
      "theater": [
        "The play 'The Front Page' showcasing sharp social commentary",
        "Musicals becoming popular in London",
        "Experimental theater challenging traditional forms"
      ],
      "radio": [
        "The BBC is expanding its programming, with news broadcasts and entertainment shows",
        "Popular serials like 'The Shadow' captivating audiences",
        "Live music performances on the radio gaining traction"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Mews' by Agatha Christie",
        "'The Great Gatsby' by F. Scott Fitzgerald",
        "'Brave New World' by Aldous Huxley"
      ],
      "popularGenres": [
        "Detective fiction",
        "Social realism",
        "Political commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "Electric refrigerators becoming more commonplace",
        "Advances in radio technology improving broadcast quality",
        "Early developments in aviation technology"
      ],
      "commonDevices": [
        "Domestic telephones becoming standard with party lines",
        "Typewriters used widely in offices",
        "Petrol-powered cars for personal transport"
      ],
      "emergingTrends": [
        "The beginnings of consumer culture as advertising grows",
        "Increased use of the automobile for leisure activities",
        "Home appliances becoming more common in middle-class households"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: three pence",
        "Cinema ticket: one shilling"
      ],
      "commonActivities": [
        "Gathering for tea and discussions about politics",
        "Participating in local community events",
        "Engaging in gardening as spring arrives"
      ],
      "socialRituals": [
        "Formal evening dinners with layered conversations",
        "Tea parties featuring political discussions",
        "Sunday church services followed by family gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "The upper class remains aloof, holding onto their wealth",
      "Middle class striving for respectability amidst economic hardship"
    ],
    "gender": [
      "Men expected to be stoic and providers",
      "Women beginning to assert their roles in society beyond domesticity",
      "Gender roles still heavily influenced by traditional views"
    ],
    "race": [
      "Racial tensions simmering beneath the surface due to economic strains",
      "Growing awareness of social justice issues, albeit slowly"
    ],
    "generalNorms": [
      "Conformity to social norms is expected",
      "Public displays of wealth are viewed with suspicion",
      "Emerging discussions around personal freedom and rights"
    ]
  },
  "atmosphericDetails": [
    "The air is heavy with the scent of damp earth and fresh blooms as the first signs of spring emerge.",
    "The distant sound of thunder echoes across the estate, hinting at a storm that may soon break, adding to the sense of foreboding.",
    "Chatter from the drawing room mixes with the sound of raindrops tapping against the windows, creating an atmosphere thick with tension and expectation."
  ],
  "paragraphs": [
    "In March 1933, the country estate is a place of stark contrasts. Overcast skies loom overhead, often releasing sporadic rain that dampens the earth and makes the grounds muddy. Guests gather in the drawing room, their conversations punctuated by the murmur of political debates, reflecting the societal unrest of the time. The air is thick with anticipation as the last remnants of winter fade, and yet a chill remains, hinting at the turbulence brewing both outside and within the walls of the estate.",
    "Fashion trends reflect the era's complexity; men dress in dark wool suits, their bow ties neatly knotted, while women don elegantly tailored frocks with cloche hats perched just so. The styles are a testament to both the lingering elegance of the past and the emerging modernity of the present. Accessories such as silk handkerchiefs and string pearls add a touch of sophistication, though beneath the surface, the tension of economic strife and class disparity simmers.",
    "Daily life is shaped by the pressures of the Great Depression, with the price of essentials rising and the specter of unemployment casting a long shadow over the gatherings at the estate. Guests discuss the latest news over tea, their conversations swirling around the rise of fascism in Europe and the uncertain future ahead. The rituals of socializing remain, but they are tinged with an undercurrent of anxiety, as the classes collide and the air grows thick with the weight of unspoken fears and aspirations."
  ],
  "note": "",
  "cost": 0.0011204886,
  "durationMs": 16047
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the estate for a family reunion becomes a pressure cooker of class tensions and political discourse amid the economic strains of the Great Depression.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class divisions are stark, with the wealthy grappling with their privilege while the working class faces economic hardship, creating a backdrop of tension and distrust."
  },
  "setting": {
    "location": "A grand manor house set on sprawling grounds with gardens and stables.",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain, typical of a British summer"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill"
  ],
  "theme": "Golden Age country-house murder driven by a mechanical clock-tampering method."
}

### LOCKED_FACTS
[
  {
    "id": "clock_reading",
    "value": "ten minutes past eleven",
    "description": "The exact time shown on the stopped clock face"
  },
  {
    "id": "tamper_amount",
    "value": "forty minutes",
    "description": "The exact amount the clock was wound back"
  },
  {
    "id": "scheduled_time",
    "value": "a quarter past eleven",
    "description": "The time noted for the meeting that was meant to occur"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The study clock shows signs of tampering with fresh tool marks.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "Indicates that someone may have altered the timekeeping device.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock's mechanism was altered to mislead witnesses about the time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Contradicts the assumption that the stopped clock indicates the time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The note indicates a meeting time of a quarter past eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "Establishes a timeline that suggests the murder occurred before this time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Witnesses state they heard a chime at eleven o'clock in the morning.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "Provides a timeline that conflicts with the stopped clock's indication.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "This contradicts the tampered clock suggesting the murder occurred earlier.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "Reveals discrepancies in the timeline of events.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
      "category": "behavioral",
      "description": "Direct evidence ties Captain Ivor Hale to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[2].access_plausibility",
      "pointsTo": "This direct evidence shows Captain Ivor Hale had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she was seen in a different location at the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "Narrowing the suspect list towards Captain Ivor Hale.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "physical",
      "description": "Footprints in the study lead away from the clock.",
      "sourceInCML": "CASE.constraint_space.access.objects[1]",
      "pointsTo": "Suggests someone may have left the scene after tampering.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "category": "temporal",
      "description": "The note indicates a meeting time of a quarter past eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The timing of the meeting suggests that the murder must have happened before this time.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The stopped stopped indicates the murder must have occurred at that very moment.",
      "supportsAssumption": "The murder must have occurred at the time indicated by the stopped clock.",
      "misdirection": "This misleads by implying that the stopped stopped is an accurate reflection of the time of the murder, which is not the case."
    },
    {
      "id": "rh_2",
      "description": "Some believe the murder happened during a heated argument just before the clock stopped.",
      "supportsAssumption": "The murder must have occurred at the time indicated by the stopped clock.",
      "misdirection": "This suggests a specific timeline that may not align with the actual events."
    }
  ],
  "status": "fail",
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  },
  "clueTimeline": {
    "early": [
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_1",
      "clue_fp_contradiction_step_2"
    ],
    "mid": [
      "clue_2",
      "clue_3",
      "clue_culprit_direct_captain_ivor_hale",
      "clue_core_elimination_chain"
    ],
    "late": [
      "clue_late_optional_slot_1"
    ]
  },
  "fairPlayChecks": {
    "allEssentialCluesPresent": true,
    "noNewFactsIntroduced": true,
    "redHerringsDontBreakLogic": true
  },
  "latencyMs": 10885,
  "cost": 0.004471005
}

---

## OUTPUT INSTRUCTIONS

Produce a single JSON object with ALL of the following fields.

Return the JSON object directly — no preamble, no markdown fences, no commentary.

MANDATORY FIELD LENGTHS:
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- storyEmotionalArc.arcDescription: MINIMUM 300 words, target 350 words. This is an emotional map
  of the full story journey — not a one-paragraph summary. It must trace the emotional register from
  opening chapter through rising tension to climax and resolution. Multiple paragraphs expected.
  A response shorter than 300 words will fail the quality gate. Count your words.
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

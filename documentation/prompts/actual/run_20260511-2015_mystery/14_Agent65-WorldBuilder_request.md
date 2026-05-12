# Actual Prompt Record

- Run ID: `mystery-1778530512992`
- Project ID: ``
- Timestamp: `2026-05-11T20:19:02.806Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `8cb5da9fe8b33758`

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
    "title": "The Clockwork Deception",
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
      "subtype": "clock tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "victim"
      ],
      "public_persona": "Respected hostess and socialite",
      "private_secret": "She harbors deep suspicions about her family",
      "motive_seed": "Fear of inheritance loss",
      "motive_strength": "moderate",
      "alibi_window": "10:00 PM to 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "study",
        "drawing room"
      ],
      "behavioral_tells": [
        "Keen observer, often quiet"
      ],
      "stakes": "Maintain family honor and wealth",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "suspect",
      "relationships": [
        "family friend"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Engaged in an affair with the victim",
      "motive_seed": "Desire to end the affair",
      "motive_strength": "moderate",
      "alibi_window": "10:30 PM to 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "study",
        "library"
      ],
      "behavioral_tells": [
        "Nervous when questioned"
      ],
      "stakes": "Reputation at stake",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [
        "family friend"
      ],
      "public_persona": "Charming war hero",
      "private_secret": "He resents the victim's control over family affairs",
      "motive_seed": "Desire for independence",
      "motive_strength": "high",
      "alibi_window": "10:00 PM to 11:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "garden",
        "dining room"
      ],
      "behavioral_tells": [
        "Overly confident"
      ],
      "stakes": "Family legacy",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "suspect",
      "relationships": [
        "maid",
        "family servant"
      ],
      "public_persona": "Quiet and diligent",
      "private_secret": "Knows more about the family than she admits",
      "motive_seed": "Loyalty to the victim",
      "motive_strength": "low",
      "alibi_window": "10:00 PM to 11:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "kitchen",
        "servants' quarters"
      ],
      "behavioral_tells": [
        "Easily startled"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "During a family reunion at a grand manor house, Eleanor Voss is discovered dead, and the investigation reveals a tampered clock that misleads everyone about the time of her demise."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead in the study.",
      "The clock in the study showed ten minutes past eleven.",
      "Witnesses heard the clock chime at unusual intervals."
    ],
    "inferred_conclusions": [
      "The time of death is misrepresented by the tampered clock.",
      "Dr. Mallory Finch had opportunity to tamper with the clock."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, minut, and study to expose the false timing.",
      "delivery_path": [
        {
          "step": "Dr. Mallory Finch tampered with the clock during his visit to Eleanor's study."
        }
      ]
    },
    "outcome": {
      "result": "The clock misled everyone about the time of death, allowing the true murderer to create an alibi."
    }
  },
  "false_assumption": {
    "statement": "Eleanor's death occurred shortly after the clock chimed eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appeared to function normally and witnesses recall the chime being clear.",
    "what_it_hides": "The clock was tampered with to shift the timeline of the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Eleanor was last seen alive at ten forty-five.",
        "The clock was found showing ten minutes past eleven."
      ],
      "windows": [
        "Witnesses reported hearing unusual clock chimes."
      ],
      "contradictions": [
        "The clock’s actual time of tampering does not match the time of death."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Eleanor Voss"
      ],
      "objects": [
        "The clock in the study"
      ],
      "permissions": [
        "Dr. Finch had access to the study as a family friend."
      ]
    },
    "physical": {
      "laws": [
        "Clock mechanics allow for winding back the time."
      ],
      "traces": [
        "Fingerprints found on the clock’s winding key."
      ]
    },
    "social": {
      "trust_channels": [
        "Family loyalty among the guests."
      ],
      "authority_sources": [
        "Dr. Finch's status as a trusted family physician."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows ten minutes past eleven when found.",
        "correction": "The clock was tampered with to show a later time than actual time of death.",
        "effect": "Eliminates the possibility that Eleanor died at eleven.",
        "required_evidence": [
          "The clock's face time",
          "Witness reports of clock chimes"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses recall hearing the clock chime at unusual times.",
        "correction": "The clock malfunctioned due to tampering.",
        "effect": "Narrows the timeline of the murder.",
        "required_evidence": [
          "Witness testimony about the chime",
          "The clock's time discrepancy"
        ],
        "reader_observable": true
      },
      {
        "observation": "Fingerprints found on the clock's winding key match Dr. Mallory Finch.",
        "correction": "Dr. Finch had access to the clock and had the opportunity to tamper with it.",
        "effect": "Narrows the suspect pool to Dr. Mallory Finch.",
        "required_evidence": [
          "Fingerprint analysis results",
          "Witness statement about Dr. Finch's presence in the study"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares clock, study, and minut against the claimed timeline.",
    "knowledge_revealed": "The revealed facts are clock, tamper, and study.",
    "pass_condition": "Dr. Mallory Finch cannot explain the discrepancies in the clock's time.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_7",
      "clue_core_contradiction_chain"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's face time (early) and witness accounts of chimes (mid) establish the timeline misrepresentation. Step 2: Fingerprint evidence eliminates other suspects and focuses on Dr. Finch. Step 3: The clock winding comparison reveals tampering."
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
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "She is the victim.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi verified by others.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "delivery_method": "Fingerprint analysis"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_8",
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
    "summary": "Eleanor Voss, a charming socialite and philanthropist, hides a web of financial deceit beneath her glamorous public persona. As an amateur sleuth, she finds herself entangled in a mystery that could unravel her carefully constructed world.",
    "publicPersona": "Eleanor is the toast of Little Middleton, known for her lavish charity balls and impeccable taste. With a smile that could light up a room, she moves through the upper echelons of society with grace, often charming the wealthiest of patrons into generous donations.",
    "privateSecret": "Beneath the surface of her opulent life, Eleanor struggles with the harsh realities of the Great Depression. Secretly embezzling from her charity funds, she is driven by desperation to maintain her social standing while keeping her financial misdeeds hidden from prying eyes.",
    "motiveSeed": "Eleanor's primary motivation is to cover up her embezzlement before anyone discovers the truth, which could ruin her reputation and lead to dire consequences.",
    "motiveStrength": "strong",
    "alibiWindow": "She was mingling with guests in the ballroom from eight until ten, a time frame that could provide her the necessary cover.",
    "accessPlausibility": "easy",
    "stakes": "Her social standing and personal freedom depend on her ability to keep her financial indiscretions a secret, making the stakes exceptionally high.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a melodic cadence, often punctuating her sentences with light laughter. She has a penchant for dramatic pauses, particularly when she wishes to draw attention to her charm or deflect suspicion.",
    "internalConflict": "Eleanor grapples with the tension of wanting to maintain her social facade while knowing that her actions are jeopardizing her integrity. Each interaction is laced with the fear that her secrets will be exposed.",
    "personalStakeInCase": "The crime matters deeply to Eleanor as it presents an opportunity for her to redeem herself, not just in the eyes of society but also in her own self-esteem.",
    "paragraphs": [
      "Eleanor Voss glided through the grand ballroom of Little Middleton Manor, the embodiment of elegance. Her laughter rang like chimes in the air, effortlessly charming the wealthy patrons gathered for her charity event. Yet, beneath the surface of her radiant smile lay a heart heavy with secrets. As the Great Depression tightened its grip, Eleanor found herself ensnared in a web of financial deceit, embezzling from the very charity she had once devoted herself to. The stakes were high; the world she had constructed was teetering on the edge of collapse, and she would do anything to maintain it.",
      "Her evenings were filled with the delicate clinking of glasses and the soft rustle of silk gowns, but Eleanor's mind was often elsewhere, shrouded in anxiety. Each guest's laughter felt like a dagger, reminding her of the precarious balance she maintained. She had mingled with guests from eight until ten that fateful evening, a perfect alibi, but as she exchanged pleasantries, her mind raced. What if someone found out? What if the truth came to light? The very thought sent chills down her spine.",
      "In the days leading up to the incident, Eleanor had sensed a shift in the air. Whispers of her financial troubles began to circulate, and the victim, a fellow socialite, had become a looming threat. Eleanor's heart raced at the thought that this individual was onto her, poised to expose her misdeeds. The desperation to keep her secret buried transformed her from a mere socialite into an amateur sleuth, determined to find out who had the power to ruin her life.",
      "As she delved deeper into the investigation, Eleanor discovered a strength within herself she had never acknowledged. She began to shift from the role of a desperate socialite to that of a determined investigator, seeking not only to uncover the truth behind the crime but also to confront the darker corners of her own life. The stakes had never been higher, and as she navigated the treacherous waters of deception, she realized that the path to redemption might lead her closer to the truth than she ever imagined."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician with a no-nonsense demeanor, harbors dark secrets that threaten to dismantle his esteemed reputation. As a rival professional, he finds himself entangled in a web of malpractice and desperation.",
    "publicPersona": "Known for his direct and authoritative manner, Dr. Finch commands respect in the community. His successful medical practice has made him a pillar of Little Middleton, often sought after for his expertise and sound advice.",
    "privateSecret": "Behind the facade of respectability lies a man who has conducted unethical experiments on his patients, driven by a need to validate his controversial theories. The weight of his actions bears heavily on him, a ticking time bomb waiting for the truth to surface.",
    "motiveSeed": "Dr. Finch believes that the victim was about to expose his malpractice, igniting a fire of fear and urgency within him that compels him to act.",
    "motiveStrength": "compelling",
    "alibiWindow": "He claims to have been in the study adjacent to the ballroom from eight until nine, attending to a patient, though his alibi is far from solid.",
    "accessPlausibility": "possible",
    "stakes": "His career, reputation, and freedom are at stake if his unethical practices are revealed, pushing him to the brink of desperation.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks in a clipped, precise manner, often punctuating his sentences with dry observations that reflect his no-nonsense attitude. He rarely indulges in small talk, preferring to get straight to the point.",
    "internalConflict": "Dr. Finch wrestles with the moral implications of his actions, torn between his desire for recognition in the medical field and the fear of losing everything he has worked for. His arrogance blinds him to the true consequences of his choices.",
    "personalStakeInCase": "The case matters to Dr. Finch as it represents a pivotal moment in his career. The potential exposure of his unethical practices could shatter his hard-earned reputation, forcing him to confront the darkness he has tried to suppress.",
    "paragraphs": [
      "Dr. Mallory Finch stood in his study, the weight of his secrets pressing down upon him like the oppressive heat of a summer's day. With a practiced air of authority, he had built a reputation as one of Little Middleton's most respected physicians. Yet, behind the veneer of success lay a man grappling with ethical dilemmas that could unravel his entire existence. He had conducted experiments on his patients, rationalizing his actions in the name of progress, but now the specter of exposure loomed large, threatening to dismantle all he had achieved.",
      "As the evening of the charity event unfolded, Dr. Finch had positioned himself in the adjacent study, ostensibly attending to a patient. His alibi was shaky at best, but the chaotic atmosphere of the ballroom provided him with a certain degree of cover. The laughter and music muffled the sound of his racing heart, each beat a reminder of the stakes. The victim had been a thorn in his side, a potential whistleblower who could expose the very practices he had fought to keep hidden.",
      "Dr. Finch's mind raced as he recalled his interactions with the victim, the subtle hints of suspicion that had begun to surface. He had dismissed them as paranoia, but now he felt a gnawing fear that his world was on the brink of collapse. The thought of losing his career, his reputation, and ultimately his freedom sent him into a spiral of anxiety. He had once been a man of conviction, but now desperation clawed at his resolve, pushing him toward a precipice he could not ignore.",
      "In the face of the unfolding mystery, Dr. Finch was forced to confront the man he had become. The investigation was not merely a threat to his reputation but a reflection of his moral decay. As he navigated the treacherous waters of suspicion, he realized that the truth might not only save him but also serve as a reckoning for the choices he had made. The stakes had never been higher, and as the pieces of the puzzle began to fall into place, he understood that he could either cling to the fragments of his past or embrace the possibility of redemption."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired military officer, presents a dignified facade to the world while grappling with the demons of his past. As an authority figure, he must confront the shadows of his history that threaten to unravel his carefully maintained reputation.",
    "publicPersona": "With a commanding presence and a wealth of stories from his military days, Captain Hale is a respected elder in Little Middleton. His tales of heroism captivate audiences, and he often serves as a mentor to younger generations.",
    "privateSecret": "Beneath the veneer of respectability, he suffers from PTSD, leading to instability and paranoia that he struggles to keep hidden from the world.",
    "motiveSeed": "Captain Hale fears that the victim will reveal secrets from his past that could tarnish his carefully cultivated legacy, igniting a battle between his public persona and private turmoil.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claimed to be in the garden from eight to nine, but no one can confirm his whereabouts during that time.",
    "accessPlausibility": "unlikely",
    "stakes": "His legacy and mental stability are at risk if the truth about his past comes to light, pushing him further into the depths of paranoia.",
    "humourStyle": "sardonic",
    "humourLevel": 0.3,
    "speechMannerisms": "Captain Hale speaks with a commanding authority, often punctuating his stories with sardonic remarks that reflect his disillusionment. His speech is marked by a rhythmic cadence, as if he were still addressing troops rather than friends.",
    "internalConflict": "Haunted by the memories of his military past, Captain Hale faces a profound internal conflict between the man he presents to the world and the soldier he once was. The fear of exposure amplifies his paranoia, creating a tempest within.",
    "personalStakeInCase": "The case holds personal significance for Captain Hale as it forces him to confront the specters of his past. The potential revelation of his secrets could shatter the carefully constructed image he has maintained for years.",
    "paragraphs": [
      "Captain Ivor Hale stood in the garden, the moonlight casting long shadows across his dignified features. A retired military officer, he had spent decades cultivating an image of respectability and strength, often regaling audiences with tales of heroism from his past. Yet, beneath the polished surface lay a man grappling with the demons of his own history. The PTSD that haunted him had transformed his once-commanding presence into a source of paranoia, leaving him teetering on the brink of instability.",
      "As the charity event unfolded within the manor, Captain Hale had claimed to be in the garden from eight to nine, a time frame that provided him with a tenuous alibi. But with no one to confirm his whereabouts, he felt the weight of uncertainty pressing down upon him. The victim had become a potential threat, someone who could unravel the carefully woven tapestry of his reputation and expose the secrets he had fought so hard to keep buried.",
      "Haunted by the specters of his past, Captain Hale wrestled with the tension between his public persona and the turmoil that churned within. Each interaction felt like a performance, a delicate dance between the man he was expected to be and the soldier who had witnessed the horrors of war. The fear of exposure loomed large, fanning the flames of his paranoia and pushing him further into isolation.",
      "As the investigation progressed, Captain Hale found himself at a crossroads. The very case that threatened to expose him also offered a chance for redemption, a moment to confront the shadows of his past and reclaim his narrative. The stakes had never been higher; he could either continue to hide behind the mask of authority or confront the truth that had haunted him for far too long."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a quiet servant often overlooked by the manor's elite, hides a desperate secret. As an outsider, she navigates the treacherous world of Little Middleton while grappling with her own moral dilemmas.",
    "publicPersona": "Beatrice is diligent and hardworking, moving through the background of the manor's social events with a quiet grace. Her presence is often unnoticed, a shadow flitting between tasks as she serves the guests.",
    "privateSecret": "In a bid to support her struggling family, Beatrice has been stealing small valuables from the guests, a secret that weighs heavily on her conscience.",
    "motiveSeed": "With the victim poised to expose her thievery, Beatrice finds herself in a precarious position, fearing for her family's survival.",
    "motiveStrength": "strong",
    "alibiWindow": "She was in the kitchen from eight until ten, but her presence was only noted by other staff, making her alibi tenuous.",
    "accessPlausibility": "easy",
    "stakes": "The survival of her family hinges on not being caught stealing, amplifying the pressure she faces as the investigation unfolds.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks softly, often apologizing for her presence. Her sentences are punctuated with nervous laughter, and she tends to downplay her thoughts, reflecting her position as an outsider in the manor's elite world.",
    "internalConflict": "Beatrice grapples with the moral implications of her actions, torn between her love for her family and the shame of her theft. Each day, she faces the reality of her choices, creating a cycle of guilt and desperation.",
    "personalStakeInCase": "The case is deeply personal for Beatrice, as the potential exposure of her theft could not only jeopardize her position but also threaten her family's very survival.",
    "paragraphs": [
      "Beatrice Quill moved silently through the kitchen, her hands deftly preparing trays for the evening's gala. A quiet servant, she often found herself in the background, unnoticed among the swirl of laughter and music in the grand manor. Yet, beneath her diligent exterior lay a heart heavy with secrets. In her struggle to support her family during hard times, Beatrice had resorted to stealing small valuables from the guests, a choice that weighed heavily on her conscience.",
      "As the charity event unfolded, Beatrice's mind raced with anxiety. The victim, a guest with a keen eye for detail, had begun to suspect her. The thought of exposure sent shivers down her spine, amplifying the already intense pressure she felt. She had been in the kitchen from eight until ten, but her alibi was shaky at best, known only to a handful of other staff members. The stakes had never been higher; her family's survival hinged on her ability to remain undetected.",
      "Beatrice often found herself reflecting on her choices, torn between love for her family and the shame of her actions. Each day, she faced the reality of her theft, creating a cycle of guilt that gnawed at her insides. In moments of solitude, she would whisper apologies to the empty kitchen, as if seeking forgiveness from the very walls that bore witness to her struggles.",
      "Yet, as the investigation began to unfold, Beatrice felt a flicker of determination ignite within her. Perhaps this was her chance to reclaim her narrative, to rise from the shadows and become a key player in the unfolding mystery. The case mattered not just for her position in the household, but for the very survival of her family. In the depths of her turmoil, she found a glimmer of hope, a chance to confront the darkness that had taken root in her life."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Little Middleton Manor",
    "type": "Country house estate",
    "place": "Little Middleton",
    "country": "England",
    "summary": "An imposing manor shrouded in secrets, Little Middleton Manor stands isolated amidst its manicured gardens and dense woodlands, a perfect backdrop for intrigue.",
    "visualDescription": "The manor features a grand façade with towering windows, intricate stonework, and an ornate entrance flanked by aged yew trees. Its sprawling grounds are meticulously maintained, yet the encroaching woodlands offer a stark contrast, their dark, tangled branches creating an air of foreboding.",
    "atmosphere": "A palpable tension hangs in the air, thickened by the overcast skies and the rustling leaves that whisper secrets of the past.",
    "paragraphs": [
      "Little Middleton Manor looms like a sentinel over the surrounding countryside, its stone walls exuding an ancient wisdom steeped in the weight of generations. The manicured gardens, with their neatly trimmed hedges and vibrant flower beds, offer a deceptive beauty, concealing the darker truths that lie within the estate. As the autumn rain begins to fall, the droplets dance upon the stone pathways, each sound echoing like a whispered warning through the air.",
      "The interior of the manor is no less imposing, adorned with heavy drapery and rich tapestries that absorb the light, casting the grand halls into shadow. The scent of polished wood mingles with the faint aroma of damp earth, a reminder of the relentless rain outside. Each room feels alive, as if the very walls are privy to the secrets exchanged within them, the ticking of the ornate grandfather clock in the hallway counting down to an inevitable confrontation.",
      "As guests gather in the drawing room, the tension becomes almost palpable, conversations hushed and eyes darting towards the windows, where the rain blurs the line between inside and out. The crackle of a fire in the hearth contrasts sharply with the chill that seeps through the walls, while the distant sound of thunder rumbles like an ominous prelude to the drama about to unfold. Shadows play across the room, shifting with every flicker of candlelight, as if they too are part of the intricate dance of deception.",
      "Outside, the gardens seem to take on a life of their own, the rustling leaves and the whisper of the wind creating a symphony of unease. The dense woods bordering the estate loom like dark sentinels, their depths hiding secrets of their own. The isolation of Little Middleton Manor, far from the nearest town, amplifies the feeling of entrapment, where every creak of the floorboards could signal an unwanted presence; every gust of wind could carry a message from the past."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical of the English countryside in autumn.",
    "timeFlow": "Days of mounting tension as the mystery unfolds over a single, stormy weekend.",
    "mood": "Tense and foreboding, reflecting the underlying class tensions and paranoia of the era.",
    "eraMarkers": [
      "Petrol-powered automobiles parked in the courtyard, a sign of the family's wealth and status.",
      "An early home telephone with a party line in the study, creating a sense of connectivity yet isolation.",
      "Typewriters in the study, clacking away as urgent messages are composed amid the rising tensions."
    ],
    "sensoryPalette": {
      "dominant": "The heavy scent of rain-soaked earth mingling with the musty aroma of old books.",
      "secondary": [
        "The crackle of the fireplace, providing warmth amidst the cold atmosphere.",
        "The distant rumble of thunder, echoing the unease that permeates the estate."
      ]
    },
    "paragraphs": [
      "The air is thick with the scent of wet foliage and damp stone, a heady mix that clings to the senses, making every breath feel heavy with anticipation. The overcast sky looms above, casting a pall over the estate, while the rhythmic patter of rain creates a haunting melody that plays on repeat throughout the day. This is a world caught between the beauty of the gardens and the encroaching darkness of the woods, where every shadow seems to harbor secrets waiting to be uncovered.",
      "As the day stretches on, the tension in the manor builds, the walls seemingly closing in on the guests gathered within. The flickering candlelight casts dancing shadows that twist and turn, mimicking the confusion and suspicion that fills the air. Each creak of the floorboards reverberates through the silence like an accusation, turning every glance into a potential reveal of hidden motives. The atmosphere is electric, charged with the weight of unsaid words and unspoken fears."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is elegantly appointed with plush sofas and heavy drapery that frame the large windows, allowing only muted light to enter. A grand piano sits in one corner, its polished surface reflecting the flicker of candlelight, while the walls are adorned with portraits of stern ancestors, their gazes omnipresent.",
      "sensoryDetails": {
        "sights": [
          "The rich, dark wood of the furniture contrasts with the vibrant colors of the floral patterns on the upholstery, creating a sense of opulence.",
          "Golden light spills from the chandelier overhead, illuminating dust motes that dance lazily in the air."
        ],
        "sounds": [
          "The soft murmur of conversation fills the air, punctuated by the occasional laughter that feels strangely out of place.",
          "The distant crackle of the fire blends with the sound of the rain tapping against the windowpanes, creating a cozy yet unsettling symphony."
        ],
        "smells": [
          "The scent of burning wood mingles with the faint aroma of aged leather from the books lining the shelves, creating an inviting yet mysterious atmosphere.",
          "Hints of lavender from the potpourri on the mantelpiece add a touch of floral sweetness that contrasts sharply with the tension in the room."
        ],
        "tactile": [
          "The plush fabric of the sofas invites weary guests to sink into their depths, offering a momentary escape from the tension outside.",
          "The chill of the air feels sharper near the windows, where the rain-soaked glass sends a shiver through anyone who dares to draw near."
        ]
      },
      "accessControl": "The drawing room is accessible to all guests but is often the last room to be entered due to its proximity to the main entrance, where secrets are often exchanged.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked windows",
            "grey light filtering through the drapery"
          ],
          "sounds": [
            "steady drumming on the roof",
            "the soft splatter of droplets against the window ledge"
          ],
          "smells": [
            "damp wood",
            "the faint mustiness of the carpet",
            "freshly brewed tea"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light that dulls colors",
            "shadows creeping along the walls"
          ],
          "sounds": [
            "the creaking of old timbers",
            "the distant sound of thunder rumbling ominously"
          ],
          "smells": [
            "beeswax from the candles",
            "the stale scent of unventilated air",
            "the faint hint of burnt toast from the kitchen"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of the fireplace contrasting with the darkening sky outside",
            "the flicker of candlelight casting long shadows"
          ],
          "sounds": [
            "the ticking of a clock echoing in the silence",
            "the murmur of voices as guests begin to grow restless"
          ],
          "smells": [
            "the comforting scent of woodsmoke",
            "the sweet aroma of dessert baking in the kitchen",
            "the lingering smell of tobacco from earlier conversations"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the heart of Little Middleton Manor, where secrets are shared and tensions simmer just beneath the surface. Each evening, as the rain drums against the windows, guests gather here, drawn by the warmth of the fire and the allure of whispered conversations. Yet, amidst the laughter and the clinking of glasses, a palpable unease hangs in the air, as if the very walls are waiting to exhale the truths they have witnessed.",
        "As shadows lengthen and the day fades, the atmosphere shifts, turning the drawing room into a stage for unspoken dramas. The flickering candles cast an eerie glow that dances upon the faces of the guests, revealing fleeting expressions of doubt and suspicion. In this space, every glance exchanged carries the weight of a thousand accusations, and the air grows thick with the promise of revelations yet to come."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The library is lined with dark oak bookshelves, filled with leather-bound tomes that seem to whisper secrets of their own. A large mahogany desk sits in the center, cluttered with papers and an old typewriter, while a plush armchair in the corner invites quiet contemplation.",
      "sensoryDetails": {
        "sights": [
          "The dim light filtering through the tall windows casts elongated shadows across the room, creating an atmosphere of mystery and intrigue.",
          "Dust motes float lazily in the beams of light, illuminating the spines of books that range from history to fiction, each holding its own world within."
        ],
        "sounds": [
          "The soft rustling of pages turning as a reader immerses themselves in a forgotten story, punctuated by the occasional creak of the floorboards.",
          "The rhythmic clacking of the typewriter adds an urgent cadence to the stillness, a reminder that words can shape destinies."
        ],
        "smells": [
          "The rich, earthy scent of old books fills the air, mingling with the faintest hint of polish from the furniture, a testament to the care taken in this sanctuary.",
          "A subtle whiff of tobacco lingers from the last visitor, a trace of their presence that adds to the library's aura of secrecy."
        ],
        "tactile": [
          "The smooth surface of the leather-bound books feels cool to the touch, inviting exploration and discovery within their pages.",
          "The plush fabric of the armchair provides a comforting embrace, a stark contrast to the tension that hangs in the air outside."
        ]
      },
      "accessControl": "Access to the library is restricted after dinner, allowing only the family and select guests to enter, making it a prime location for secrets to be uncovered.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets trickling down the window panes",
            "the soft glow of morning light barely illuminating the room"
          ],
          "sounds": [
            "the persistent patter of rain on the roof",
            "the distant sound of thunder rumbling ominously"
          ],
          "smells": [
            "the scent of damp wood mingling with old paper",
            "the faint aroma of fresh coffee brewing in the adjacent room"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows lengthening as the light fades",
            "the dust settling on the spines of books that have not been touched in days"
          ],
          "sounds": [
            "the ticking of a clock echoing in the silence",
            "the soft rustle of a page turning in a distant corner"
          ],
          "smells": [
            "the mustiness of unventilated air",
            "the lingering scent of polished wood",
            "the faintest hint of mildew from the dampness outside"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of a single lamp illuminating a small reading nook",
            "the shadows creeping closer as the sun sets"
          ],
          "sounds": [
            "the quiet scratching of a pen on paper",
            "the distant sound of laughter from the drawing room"
          ],
          "smells": [
            "the comforting scent of leather and parchment",
            "the faint aroma of herbal tea wafting in from the kitchen",
            "the smoky scent of a dying fire"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library stands as a sanctuary of knowledge and intrigue within Little Middleton Manor, a place where the past is preserved in the pages of countless books. Here, secrets are hidden between the lines, and the weight of history hangs heavy in the air. As guests enter, they are met with the quiet rustle of pages and the faint scent of old paper, creating an atmosphere ripe for discovery.",
        "In the late hours of the evening, the library transforms into a realm of shadows and whispers, where the slightest sound can feel like an intrusion. The flickering candlelight casts an eerie glow upon the shelves, and the silence is only broken by the soft sound of a typewriter clacking away, chronicling the events of the day. Within these walls, every corner holds the promise of revelation, waiting to be unearthed amidst the dust of time."
      ]
    },
    {
      "id": "cellar",
      "name": "Cellar",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The cellar is dimly lit, with exposed stone walls and wooden beams that create a rustic yet foreboding atmosphere. Shelves line the walls, filled with dusty bottles of wine and jars of pickled vegetables, while a single flickering bulb casts an unsettling light over the space.",
      "sensoryDetails": {
        "sights": [
          "The shadows loom larger in the corners of the cellar, where the light struggles to reach, hinting at hidden corners that could conceal secrets.",
          "Dust motes hang in the air, illuminated by the flickering light, creating an ethereal quality that belies the cellar's ominous purpose."
        ],
        "sounds": [
          "The distant drip of water echoes through the cellar, a relentless reminder of the dampness that pervades the space.",
          "The creaking of old wooden shelves adds a sense of unease, as if the very structure of the cellar is alive with the weight of its history."
        ],
        "smells": [
          "The musty scent of damp earth mingles with the sharp tang of wine, creating an acrid atmosphere that hints at decay and neglect.",
          "A faint whiff of mold lingers in the air, a testament to the moisture that seeps through the stone walls, making the space feel trapped in time."
        ],
        "tactile": [
          "The cool stone floor sends a chill through anyone who dares to step inside, a stark contrast to the warmth of the upper floors.",
          "The rough texture of the wooden shelves feels worn underhand, a reminder of the many years they have held their secrets."
        ]
      },
      "accessControl": "The cellar is normally off-limits to guests, accessible only to the household staff for storage purposes, adding an element of mystery to its contents.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "the dim light struggling against the grey outside",
            "water droplets pooling at the base of the stone walls"
          ],
          "sounds": [
            "the steady drip of water echoing in the stillness",
            "the soft patter of rain against the ground above"
          ],
          "smells": [
            "the earthy scent of wet stone",
            "the sharp tang of vinegar from the pickled jars",
            "the musty odor of dampness"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "the shadows growing deeper as the light dims",
            "the faint outline of cobwebs in the corners"
          ],
          "sounds": [
            "the distant sound of thunder rumbling above",
            "the creaking of the cellar door as it shifts slightly"
          ],
          "smells": [
            "the stale air, heavy with the scent of damp wood",
            "the lingering aroma of mold and mildew"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the flickering bulb casting erratic shadows that dance along the walls",
            "the glint of glass bottles catching the light"
          ],
          "sounds": [
            "the echo of footsteps as someone enters",
            "the unsettling silence that follows, heavy with anticipation"
          ],
          "smells": [
            "the faint scent of ripe fruit fermenting",
            "the sharp odor of cleaning supplies freshly used",
            "the musty remnants of the past"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The cellar, with its dim lighting and oppressive atmosphere, serves as the heart of the mystery, where the lines between past and present blur in the shadows. Here, amidst the dust and the cobwebs, secrets lie buried, waiting to be uncovered. The coolness of the stone floor seeps into the bones, creating a sense of foreboding that lingers long after one has left the space.",
        "As the rain patters above, the distant drip of water echoes ominously, filling the silence with a sense of dread. The cellar's isolation adds to its mystique, a hidden world beneath the grandeur of Little Middleton Manor. Every creak of the shelves and every flicker of the bulb seems to whisper of the past, urging those who dare to enter to confront the darkness that lies within."
      ]
    },
    {
      "id": "garden",
      "name": "Gardens",
      "type": "exterior",
      "purpose": "Clue discovery",
      "visualDetails": "The gardens surrounding Little Middleton Manor are a patchwork of color and order, with carefully manicured hedges, vibrant flowerbeds, and winding paths that invite exploration. A stone fountain stands at the center, its water trickling softly, creating a serene yet eerie contrast to the tension within the manor.",
      "sensoryDetails": {
        "sights": [
          "The vibrant hues of blooming flowers stand in stark contrast to the muted colors of the autumn landscape, creating an almost surreal beauty.",
          "Leaves rustle in the gentle breeze, while the dark woods beyond loom ominously, a reminder of the secrets that may lie just outside the manicured borders."
        ],
        "sounds": [
          "The soft trickle of water from the fountain creates a calming backdrop, yet its sound can quickly turn haunting in the stillness.",
          "Birdsong fills the air, a sweet melody that feels oddly out of place given the tension that hangs over the estate."
        ],
        "smells": [
          "The fragrance of blooming roses mingles with the earthy scent of damp soil, creating a rich tapestry of aromas that invigorate the senses.",
          "Hints of decay linger in the air, a reminder of the season's change, as fallen leaves crunch underfoot, adding to the sensory experience."
        ],
        "tactile": [
          "The coolness of the stone pathways contrasts with the warmth of the flowerbeds, inviting visitors to linger and explore.",
          "The texture of the petals feels soft and inviting, yet the thorns of the roses serve as a reminder that beauty can be deceptive."
        ]
      },
      "accessControl": "The gardens are open to guests during the day but are often shunned after dark, as whispers of hauntings and mischief circulate among the manor's inhabitants.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops clinging to the petals of flowers",
            "the garden path glistening with moisture"
          ],
          "sounds": [
            "the sound of rain pattering against the leaves",
            "the muted calls of birds seeking shelter"
          ],
          "smells": [
            "the fresh scent of rain-soaked earth",
            "the fragrant aroma of wet flowers",
            "the musty odor of damp foliage"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "the flowers drooping slightly under the weight of the clouds",
            "the shadows lengthening as the sun struggles to break through"
          ],
          "sounds": [
            "the distant rumble of thunder",
            "the whisper of the wind through the trees"
          ],
          "smells": [
            "the heavy scent of wet grass",
            "the earthy aroma of decaying leaves",
            "the faint sweetness of wilting blooms"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the setting sun casting a warm glow over the flowers",
            "shadows stretching long across the garden path"
          ],
          "sounds": [
            "the chirping of crickets beginning to emerge",
            "the soft rustle of leaves in the evening breeze"
          ],
          "smells": [
            "the sweet fragrance of night-blooming flowers",
            "the earthy scent of freshly turned soil",
            "the lingering aroma of the day's rain"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The gardens of Little Middleton Manor are a tapestry of colors and scents, designed to enchant yet shrouded in an air of mystery. Each flowerbed is a vivid explosion of life, yet the looming shadows of the surrounding woods create a sense of foreboding, as if the beauty is merely a facade masking darker truths. The gentle trickle of the fountain adds a soothing soundtrack, yet in the quiet moments, it echoes eerily, a reminder of the secrets that may linger just out of sight.",
        "As the day wanes and the sun begins to set, the gardens transform into a realm of shadows and whispers, where every rustle of leaves could signal the approach of an unseen presence. The air grows thick with tension, and the vibrant colors of the flowers seem to dull under the weight of the impending night. Guests tread carefully along the paths, aware that beauty can often hide the most dangerous of truths, and the gardens may hold the key to unraveling the web of deception that surrounds them."
      ]
    }
  ],
  "note": "",
  "cost": 0.0029026338,
  "durationMs": 41974
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1933,
    "month": "October",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "chilly breezes"
    ],
    "daylight": "Shortening days with twilight settling around five o'clock in the evening",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the house is quiet and shadows deepen",
    "holidays": [
      "Halloween"
    ],
    "seasonalActivities": [
      "apple picking in local orchards",
      "attending harvest festivals",
      "preparing for Halloween with decorations"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece tweed suits",
        "wing-collared shirts",
        "woolen overcoats"
      ],
      "casual": [
        "corduroy trousers",
        "knit sweaters",
        "flat caps"
      ],
      "accessories": [
        "pocket watches",
        "silk ties",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with dropped waistlines",
        "velvet evening gowns",
        "tailored jackets"
      ],
      "casual": [
        "knitted cardigans",
        "blouses with patterned skirts",
        "long woolen scarves"
      ],
      "accessories": [
        "cloche hats",
        "beaded handbags",
        "string of pearls"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "increased popularity of sportswear",
      "growing interest in travel abroad despite economic hardship"
    ],
    "socialExpectations": [
      "men expected to be the primary breadwinners",
      "women encouraged to embody grace and domesticity",
      "class distinctions strictly observed in social settings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Great Depression continues to affect economies worldwide",
      "Political instability in Germany as Hitler consolidates power",
      "The British government debates further measures to address unemployment"
    ],
    "politicalClimate": "A tense political atmosphere with rising fascism in Europe and increasing calls for social reform within the UK",
    "economicConditions": "Widespread poverty and unemployment, but a burgeoning middle class still participates in leisure activities",
    "socialIssues": [
      "class disparity exacerbated by economic hardship",
      "growing support for labor movements",
      "debate over women's rights and employment opportunities"
    ],
    "internationalNews": [
      "Germany exits the League of Nations",
      "The United States reassesses its foreign policy amid isolationist sentiments"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Smoke Gets in Your Eyes' by Jerome Kern",
        "'Night and Day' by Cole Porter",
        "Swing Jazz gaining popularity"
      ],
      "films": [
        "'King Kong' released this year",
        "'The Invisible Man'",
        "'The Threepenny Opera'"
      ],
      "theater": [
        "'The Front Page'",
        "'Pygmalion'",
        "'Rosencrantz and Guildenstern Are Dead'"
      ],
      "radio": [
        "The BBC broadcasts news and entertainment programs",
        "Musical variety shows growing in popularity",
        "Serialized dramas capturing audiences' imaginations"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Glass Key' by Dashiell Hammett",
        "'Murder in the Cathedral' by T.S. Eliot",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "political commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first practical radio transceiver",
        "the development of the first commercial flight services",
        "the widespread use of the typewriter in homes and offices"
      ],
      "commonDevices": [
        "manual typewriters",
        "early home telephones",
        "petrol-powered cars gaining prominence"
      ],
      "emergingTrends": [
        "an increasing reliance on mass media for information",
        "more households acquiring radios",
        "new interest in aviation and travel"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "A new suit: three pounds",
        "A movie ticket: six pence"
      ],
      "commonActivities": [
        "going for walks in the countryside",
        "attending local fairs and markets",
        "visiting family and friends during weekends"
      ],
      "socialRituals": [
        "afternoon tea with family",
        "weekly church services",
        "evening gatherings for games and card playing"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "strong adherence to class distinctions",
      "aristocratic privilege viewed with skepticism by the working class",
      "middle-class aspirations to emulate upper-class lifestyles"
    ],
    "gender": [
      "men viewed as the primary decision-makers",
      "women encouraged to focus on homemaking and family",
      "emerging discourse around women's independence"
    ],
    "race": [
      "racial prejudices common, particularly against immigrant communities",
      "emerging civil rights discussions in urban centers",
      "class and race intertwined in social hierarchies"
    ],
    "generalNorms": [
      "strict etiquette observed in social interactions",
      "privacy valued in upper-class households",
      "innovation viewed with both excitement and skepticism"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth mingles with the crispness of fallen leaves as the rain sporadically taps against the windows.",
    "The dim light of oil lamps flickers, casting shadows that dance across the ornate wallpaper, enhancing the air of mystery within the country house.",
    "The distant sound of laughter from a harvest festival juxtaposes the tension inside, where whispers of class tensions and fears of the unknown linger."
  ],
  "paragraphs": [
    "In October 1933, the English countryside is cloaked in a muted palette of browns and oranges, with overcast skies that threaten rain at any moment. The brisk air carries a distinct chill that seeps into every corner of the grand country house estate, where guests gather for a weekend retreat. As twilight descends earlier in the day, the atmosphere grows thick with tension, reflecting the underlying unease of a society grappling with the repercussions of an ongoing economic depression and the specter of rising fascism across the channel.",
    "Fashion trends of the time reveal the delicate balance between elegance and practicality. Men don three-piece tweed suits, complemented by woolen overcoats that protect against the autumn chill, while women adorn themselves in tea-length dresses with dropped waistlines, their outfits completed by cloche hats and strings of pearls. As the evening draws near, the flickering light from a nearby hearth illuminates the refined attire, hinting at the social expectations of maintaining appearances despite the turmoil outside.",
    "Daily life in October 1933 is marked by a blend of routine and ritual. Afternoon tea is a cherished tradition, where conversations flow as freely as the tea itself, often veering into discussions on current affairs and the state of the economy. Meanwhile, the weekly church service serves as a reminder of community ties, while evening gatherings filled with games and card playing provide a brief respite from the weight of reality. The crispness of the air is punctuated by the smells of baked goods from local markets, where a loaf of bread costs just four pence, epitomizing the stark economic contrasts that define the era."
  ],
  "note": "",
  "cost": 0.0010576599,
  "durationMs": 13351
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the estate for a family reunion amidst the economic strain of the Great Depression and rising political tensions forces the heirs and staff into a tense atmosphere of suspicion and hidden motives.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class hierarchies are rigidly enforced, with the upper class grappling with financial insecurity while the lower class faces increasing desperation, creating a volatile mix of resentment and loyalty."
  },
  "setting": {
    "location": "A sprawling manor house surrounded by manicured gardens and dense woodlands",
    "institution": "Country house estate",
    "weather": "Overcast with intermittent rain, typical of the English countryside in autumn"
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
    "id": "alibi_time",
    "value": "twenty minutes past ten",
    "description": "The time the murder was intended to appear as happening"
  },
  {
    "id": "chime_time",
    "value": "eleven o'clock",
    "description": "The time the clock is supposed to chime after tampering"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The mechanism relies on the clock in the study to expose the false timing.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The mechanism of the clock is central to understanding the timeline of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The clock was tampered with to show a later time than actual time of death.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the timeline of Eleanor's death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at the tavern until midnight.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "Captain Ivor Hale has a corroborated alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the study shows ten minutes past eleven when found.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "This indicates the time at which the clock was discovered.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Witnesses recall hearing the clock chime at unusual times.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This suggests the clock was not functioning normally.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Fingerprints found on the clock's winding key match Dr. Mallory Finch.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "This links Dr. Finch to the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "The clock malfunctioned due to tampering.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This indicates the clock's time was not reliable.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "behavioral",
      "description": "Dr. Mallory Finch expressed a desire to end the affair with Eleanor.",
      "sourceInCML": "CASE.cast[1].evidence_sensitivity[0]",
      "pointsTo": "This indicates a motive for Dr. Finch.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen leaving the tavern at midnight.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This corroborates Hale's alibi.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "temporal",
      "description": "The clock's actual time of tampering does not match the time of death.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "This indicates a discrepancy in the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "Dr. Mallory Finch had access to the clock and had the opportunity to tamper with it.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This indicates Finch's means to commit the crime.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "The clock chimed normally before Eleanor's death.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This adds context to the clock's behavior.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Eleanor's death occurred shortly after the eleanors chimed eleven.",
      "supportsAssumption": "Eleanor's death occurred shortly after the clock chimed eleven.",
      "misdirection": "This misleads by suggesting a direct correlation between the eleanors's chime and the time of death, while the eleanors's reliability is in question."
    },
    {
      "id": "rh_2",
      "description": "Witnesses claim they saw Eleanor leave the study just before eleven.",
      "supportsAssumption": "Eleanor's death occurred shortly after the clock chimed eleven.",
      "misdirection": "This misleads by implying Eleanor was alive and well shortly before her death, diverting attention from the shortly's chimed."
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
      "clue_2",
      "clue_culprit_direct_dr_mallory_finch"
    ],
    "mid": [
      "clue_core_elimination_chain",
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8"
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
  "latencyMs": 22290,
  "cost": 0.0031698512999999997
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

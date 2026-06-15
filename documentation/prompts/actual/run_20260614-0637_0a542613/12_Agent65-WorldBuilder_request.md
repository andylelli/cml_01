# Actual Prompt Record

- Run ID: `run_0a542613-cbe3-4c99-a4d6-d8fd9637e4e2`
- Project ID: `proj_96693de3-4b79-4142-a188-3013404c7cc9`
- Timestamp: `2026-06-14T06:40:04.337Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `8c2d8ecfcf65c8df`

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
    "title": "A Race Against Time",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton, Yorkshire",
      "place": "Mansfield Manor",
      "country": "England",
      "institution": "Country house estate"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "premeditated murder"
    }
  },
  "cast": [
    {
      "name": "John Devereux",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [
        "Marjorie Drury (victim)",
        "Roy Courtenay (friend)"
      ],
      "public_persona": "A successful businessman with a charming demeanor.",
      "private_secret": "Struggling financially due to the Great Depression.",
      "motive_seed": "Financial gain from Marjorie's inheritance.",
      "motive_strength": "strong",
      "alibi_window": "11:00 - 11:30",
      "access_plausibility": "high",
      "opportunity_channels": [
        "study window",
        "main entrance"
      ],
      "behavioral_tells": [
        "nervous when asked about his whereabouts"
      ],
      "stakes": "High due to financial strain.",
      "evidence_sensitivity": [
        "testimony of being seen in the garden"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Marjorie Drury",
      "age_range": "25-35",
      "role_archetype": "victim",
      "relationships": [
        "John Devereux (suspect)",
        "Solange Mandeville (detective)"
      ],
      "public_persona": "A beloved local figure known for her charity work.",
      "private_secret": "Involved in a secret relationship with Jerome Lovell.",
      "motive_seed": "Unknown to others.",
      "motive_strength": "unknown",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Her life.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Solange Mandeville",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Marjorie Drury (victim)",
        "Jerome Lovell (suspect)"
      ],
      "public_persona": "A sharp and astute investigator.",
      "private_secret": "Under pressure to solve the case quickly.",
      "motive_seed": "Professional integrity.",
      "motive_strength": "strong",
      "alibi_window": "11:15 - 11:45",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "investigation team",
        "guest list"
      ],
      "behavioral_tells": [
        "calm under pressure"
      ],
      "stakes": "Her reputation as a detective.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Jerome Lovell",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [
        "Marjorie Drury (victim)",
        "Roy Courtenay (friend)"
      ],
      "public_persona": "A close friend of Marjorie with a mysterious past.",
      "private_secret": "Had a romantic relationship with Marjorie.",
      "motive_seed": "Jealousy over Marjorie's affections.",
      "motive_strength": "moderate",
      "alibi_window": "11:00 - 11:30",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "backdoor",
        "garden"
      ],
      "behavioral_tells": [
        "agitated when discussing Marjorie's plans"
      ],
      "stakes": "Love and loss.",
      "evidence_sensitivity": [
        "seen entering the manor just before the murder"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Roy Courtenay",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [
        "John Devereux (friend)",
        "Marjorie Drury (victim)"
      ],
      "public_persona": "An amiable gentleman with a penchant for gossip.",
      "private_secret": "Knows more about the relationships than he lets on.",
      "motive_seed": "Desire to protect his friends.",
      "motive_strength": "weak",
      "alibi_window": "11:10 - 11:30",
      "access_plausibility": "high",
      "opportunity_channels": [
        "front door",
        "study window"
      ],
      "behavioral_tells": [
        "too eager to share information"
      ],
      "stakes": "Friendship loyalty.",
      "evidence_sensitivity": [
        "claims to have been in the garden during the murder"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "John Devereux"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In the shadow of the Great Depression, Marjorie Drury is found dead in the library of Mansfield Manor. As tensions rise among the guests, Detective Solange Mandeville must unravel a web of deceit and reveal the truth behind the seemingly perfect facade before time runs out."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock in the library was tampered with to mislead the timing of Marjorie's murder.",
      "delivery_path": [
        {
          "step": "The clock was adjusted to show a time that corresponds with John Devereux's alibi."
        }
      ]
    },
    "outcome": {
      "result": "John Devereux can be proven guilty through the manipulation of the clock."
    }
  },
  "false_assumption": {
    "statement": "Marjorie Drury was murdered shortly after the clock struck a quarter past eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock seemed to be accurate due to the guests' reliance on its display.",
    "what_it_hides": "The clock was deliberately set back to mislead the investigation."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "clock shows quarter past eleven",
        "witnesses heard a scream shortly after"
      ],
      "windows": [
        "11:00 - 11:30"
      ],
      "contradictions": [
        "John claims to be in the garden at 11:10 but the clock showed a different time."
      ]
    },
    "access": {
      "actors": [
        "John Devereux",
        "Jerome Lovell"
      ],
      "objects": [
        "the clock",
        "the library"
      ],
      "permissions": [
        "access to the library during the murder"
      ]
    },
    "physical": {
      "laws": [
        "law of conservation of energy (the clock's mechanism)"
      ],
      "traces": [
        "fingerprints on the clock face"
      ]
    },
    "social": {
      "trust_channels": [
        "friends among the suspects"
      ],
      "authority_sources": [
        "Detective Solange Mandeville's investigation"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The library clock shows a time of ten minutes past eleven.",
        "correction": "This contradicts the statement that Marjorie was murdered at a quarter past eleven.",
        "effect": "Narrows the potential time frame for the murder.",
        "required_evidence": [
          "The clock's hands are visibly misaligned with the other clocks in the manor.",
          "Witnesses recall the clock showing ten minutes past eleven."
        ],
        "reader_observable": true
      },
      {
        "observation": "John Devereux was seen in the garden at 11:10.",
        "correction": "If the clock was tampered with, John could have committed the murder.",
        "effect": "Narrows the suspect pool to John Devereux.",
        "required_evidence": [
          "Witnesses confirm seeing John in the garden.",
          "The clock shows a time inconsistent with John's alibi."
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock was found with fingerprints only belonging to John.",
        "correction": "This indicates John tampered with the clock to create a false alibi.",
        "effect": "Eliminates other suspects by proving only John had access to alter the clock.",
        "required_evidence": [
          "John's fingerprints are on the clock face.",
          "No other fingerprints were found."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled comparison of the clock's time with other timepieces in the manor reveals that John tampered with the clock to cover his tracks.",
    "knowledge_revealed": "The revealed facts are library, clock, and minut.",
    "pass_condition": "If the clock shows a time that does not match the other clocks, John is guilty.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain",
      "clue_3",
      "clue_1",
      "clue_2"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's misalignment and witness testimony reveal a discrepancy in timing. Step 2: John's alibi is contradicted by the clock and witness accounts. Step 3: John's fingerprints on the clock directly link him to the tampering."
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
        "suspect_name": "Jerome Lovell",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proving his alibi was confirmed by other witnesses.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Roy Courtenay",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Clarifying his position at the time of the murder through corroborative testimonies.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Marjorie Drury",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: N/A",
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_john_devereux",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Fingerprint analysis"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_12",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_13",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_14",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness testimony"
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
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "John Devereux",
    "summary": "A retired army officer grappling with the shadows of his past, John Devereux stands as a figure of authority in Little Middleton, yet he harbors deep-seated guilt and trauma from his wartime experiences.",
    "publicPersona": "Respected veteran with a stern demeanor, John commands attention in any room he enters. His upright posture and clipped speech convey a man of discipline, while his piercing gaze often leaves others feeling scrutinized.",
    "privateSecret": "Struggling with PTSD and guilt over past decisions, John finds solace in his military honor, which now feels threatened by the victim's revelations about his wartime conduct.",
    "motiveSeed": "John fears that the victim's knowledge of his past could tarnish his reputation and the honor he has fought to uphold.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the study from 8:30 PM until 9:30 PM, a solitary hour spent wrestling with his thoughts and memories.",
    "accessPlausibility": "easy",
    "stakes": "Protect his reputation and honor in society, which he believes is paramount to his identity.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Speaks in a deliberate, measured tone, often punctuating his sentences with military precision. He has a habit of using metaphors from his army days, like 'holding the line' when discussing personal dilemmas.",
    "internalConflict": "Haunted by memories of decisions made during the war, John grapples with guilt and the fear that he is not the man he once believed himself to be.",
    "personalStakeInCase": "This crime matters deeply to John as it threatens the very essence of his integrity and the respect he has earned over decades.",
    "paragraphs": [
      "John Devereux stood in his study, the heavy oak desk cluttered with papers that whispered of a past he could not escape. The late evening light filtered through the window, casting long shadows that danced across the floor, much like the specters of his memories. His stern visage did little to betray the turmoil within; a retired army officer, he had spent his life commanding respect but now found himself teetering on the precipice of disgrace. As the news of the murder spread, it stirred a deep-seated fear — one that gnawed at the edges of his honor.",
      "The victim, a man whose revelations threatened to expose the tarnished medals of John's past, had become a ghost that haunted his thoughts. Each moment spent in that study felt like a battlefield, where each decision weighed heavily on his conscience. Would he be able to maintain the rigid facade of respectability, or would the truth of his wartime conduct shatter the image he had so carefully constructed?",
      "John's mind often wandered back to the trenches, where the lines between right and wrong blurred under the smoke of conflict. He had made decisions that, while strategic at the time, now felt like chains binding him to a past he wished to forget. The whispers of his comrades echoed in his mind, reminding him that honor was not merely a title; it was a burden, one that he carried alone. The thought of that burden being exposed sent shivers down his spine, igniting a fierce determination to protect what little remained of his dignity.",
      "As the clock struck nine, John glanced at the door, half-expecting the arrival of news that could change everything. He had been in the study during the critical hour, a solitary witness to the unraveling of his world. But now, as he wrestled with the weight of his own history, he understood that the true battle lay not against an external enemy, but within himself. In seeking to protect his reputation, could he also find a path to redemption?"
    ],
    "order": 1
  },
  {
    "name": "Marjorie Drury",
    "summary": "A vibrant socialite with a penchant for the extravagant, Marjorie Drury's charm masks a hidden turmoil as she navigates the treacherous waters of love and reputation in Little Middleton.",
    "publicPersona": "Charming and vivacious, Marjorie is known for her lavish parties and ability to light up any social gathering. Her laughter rings like music, and she effortlessly captivates those around her with her grace and poise.",
    "privateSecret": "Marjorie is entangled in a secret affair with the victim, a relationship that threatens to unravel her carefully curated life if exposed.",
    "motiveSeed": "Fearing social ruin and the loss of her esteemed position in society, Marjorie is desperate to keep her affair hidden.",
    "motiveStrength": "strong",
    "alibiWindow": "Claimed to be at a dinner party with friends from 8:00 PM to 10:00 PM, a well-timed cover that now feels like a fragile façade.",
    "accessPlausibility": "possible",
    "stakes": "To maintain her status and avoid scandal, Marjorie knows that her entire world hinges on the secrets she keeps.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Speaks in a melodic tone, often punctuating her sentences with playful sarcasm. She has a tendency to use grand gestures and expressive language, making her conversations lively and engaging.",
    "internalConflict": "Marjorie grapples with the tension between her desires and the societal expectations that bind her, constantly weighing the cost of her choices.",
    "personalStakeInCase": "This crime matters to Marjorie because her reputation and future hang in the balance; the revelation of her affair could obliterate her standing in society.",
    "paragraphs": [
      "In the heart of Little Middleton, Marjorie Drury was the quintessential socialite, her laughter echoing through the corridors of the grandest homes. Clad in silk and adorned with jewels, she floated through life as if on a cloud of privilege. Yet beneath the surface of her sparkling persona lay a tumultuous secret, one that could shatter her world. The affair with the victim had begun as a thrilling dalliance, a spark in the otherwise mundane routine of society events, but now it felt like a ticking time bomb ready to explode.",
      "At dinner parties, Marjorie dazzled her guests with tales of adventure and wit, her charm a weapon that disarmed even the most discerning critics. However, as she glanced at the faces around her, the laughter felt hollow, the wine tasted bitter. Each clink of glasses reminded her of the precariousness of her situation. The victim, once a source of excitement, had become a threat — a man who held the power to unravel her carefully constructed life with a single word.",
      "The stakes had never been higher. Marjorie had always believed that her social standing was invincible, but now she felt the ground shifting beneath her feet. The prospect of scandal loomed large, and her heart raced at the thought of being exposed. She could envision the whispers, the pointed fingers, the invitations that would dry up like the last rays of sun at dusk. In that moment, the glamorous life she had taken for granted felt like a fragile illusion.",
      "Yet, amidst the chaos of her thoughts, a flicker of defiance ignited within her. Marjorie had always been a woman of action, adept at turning the tides in her favor. If she was to navigate this storm, she would need to be both cunning and composed. As the clock ticked on, she resolved to protect her status at any cost, even if it meant confronting the very secrets that threatened to consume her."
    ],
    "order": 2
  },
  {
    "name": "Solange Mandeville",
    "summary": "A devoted governess with unspoken feelings, Solange Mandeville is caught in a web of longing and betrayal as she navigates her role within the Devereux household.",
    "publicPersona": "As a diligent and caring governess, Solange is well-regarded by the Devereux family, known for her unwavering commitment to the children's education and well-being.",
    "privateSecret": "Solange harbors a deep love for John Devereux, feelings that remain unacknowledged and unreturned, leaving her feeling invisible.",
    "motiveSeed": "Feeling betrayed by John's disregard for her feelings and the manipulation of the victim, Solange is torn between loyalty and her own emotional turmoil.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the children's room from 8:00 PM until 9:15 PM, a sanctuary where her heart ached in silence.",
    "accessPlausibility": "easy",
    "stakes": "Desire for recognition and love from John, as well as the need to protect the children she cares for.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Her speech is gentle and measured, often laced with a hint of wistfulness. Solange occasionally employs humor to deflect from her emotions, using light-hearted quips about her own situation.",
    "internalConflict": "Solange wrestles with the painful contrast between her affections for John and the reality of their relationship, straddling the line between loyalty to him and her own unfulfilled desires.",
    "personalStakeInCase": "This crime matters to Solange because it jeopardizes the stability of the household and the safety of the children she loves, alongside her own unacknowledged feelings for John.",
    "paragraphs": [
      "Solange Mandeville moved gracefully through the Devereux household, her every action a testament to her dedication as a governess. The children adored her, and she wore her role like a badge of honor, yet within the confines of her heart, a storm raged. Her love for John Devereux was a secret, one she tended to like a fragile flower, terrified that the slightest breath would cause it to wither. She had watched him, admired him from afar, but her feelings remained unspoken, buried beneath layers of duty and decorum.",
      "In the children's room, surrounded by laughter and innocent chatter, Solange often felt an aching loneliness. She had devoted herself to their upbringing, yet her own desires felt like a distant dream. The victim's presence had only complicated matters further — a man who wielded his charm like a weapon, manipulating John and leaving Solange feeling powerless. How could she compete with the magnetic pull of a man who made her heart race and her spirit falter?",
      "Every tick of the clock reminded Solange of her unfulfilled aspirations, and the night of the murder brought her feelings to a boiling point. She had been with the children, a mere spectator in her own life as the drama unfolded beyond her reach. The knowledge that her silent affection could be marred by scandal filled her with dread. What if John were to learn of her feelings? Would he see her as a burden, a distraction? Or perhaps a confidante in a world where trust had become a rare commodity?",
      "As she tucked the children into bed that night, Solange's heart ached with the weight of her unspoken words. She longed for recognition, for a moment when John might see her as more than just a governess. The murder had cast a shadow over the household, and she felt an overwhelming urge to protect not only the children but also the fragile dreams she held dear. Could this tragedy be the catalyst for change, or would it only deepen the chasm between her heart's desire and reality?"
    ],
    "order": 3
  },
  {
    "name": "Jerome Lovell",
    "summary": "A charismatic local politician with hidden ambitions, Jerome Lovell is a man of contradictions, navigating the treacherous waters of power and scandal in Little Middleton.",
    "publicPersona": "With a magnetic presence and smooth eloquence, Jerome is a well-known figure in local politics, often seen as a champion of the people, despite his underlying fascist sympathies.",
    "privateSecret": "Jerome is being blackmailed by the victim, who holds damaging information about his political ties, leaving him vulnerable and desperate.",
    "motiveSeed": "In his quest for power, Jerome seeks to eliminate the victim who threatens to expose his dealings, viewing murder as a means to protect his future.",
    "motiveStrength": "strong",
    "alibiWindow": "Reportedly making speeches at the town hall from 7:00 PM to 9:00 PM, a cover that could easily be scrutinized.",
    "accessPlausibility": "unlikely",
    "stakes": "To protect his political future and avoid scandal, Jerome is willing to go to great lengths, even if it means crossing moral lines.",
    "humourStyle": "sardonic",
    "humourLevel": 0.5,
    "speechMannerisms": "Jerome speaks with a confident, almost theatrical flair, often employing irony in his rhetoric. He has a habit of punctuating his statements with dramatic pauses, as if waiting for applause.",
    "internalConflict": "Jerome battles with the moral implications of his ambitions, torn between his desire for power and the ethical lines he is willing to cross to achieve it.",
    "personalStakeInCase": "This crime matters to Jerome because it threatens not only his political career but the very foundation of his identity as a powerful figure.",
    "paragraphs": [
      "Jerome Lovell stood before the crowd at the town hall, his voice a rich baritone that resonated through the room like a well-tuned instrument. He was a master of rhetoric, weaving tales that captivated his audience while masking the darker truths of his existence. Behind the façade of a charismatic politician lay a man ensnared in a web of deceit, his ambitions leading him down a treacherous path where the stakes were higher than ever. The victim, a man who had wielded his knowledge like a sword, had become a threat that could unravel everything Jerome had worked for.",
      "As he delivered impassioned speeches, Jerome felt the weight of his secret pressing against his chest — the blackmail, the fear of exposure. Each word he spoke felt like a performance, one that could come crashing down with a single slip. He had always prided himself on his ability to charm and manipulate, but now he found himself ensnared in a game far more dangerous than politics. The thought of the victim's revelations sent shivers down his spine, igniting a primal urge to protect his future at all costs.",
      "His colleagues regarded him as a rising star, oblivious to the turmoil brewing beneath the surface. Jerome reveled in the power he wielded, yet he was acutely aware of the moral compromises he was making. The line between right and wrong blurred with each calculated move, and as the night of the murder approached, his mind raced with thoughts of what he might be forced to do. Could he silence the victim without losing himself in the process?",
      "As he left the town hall, the applause still ringing in his ears, Jerome felt the weight of his choices pressing down on him. The thrill of power had always been intoxicating, but now it came with a bitter aftertaste. The murder had thrown his life into disarray, and as he pondered the consequences of his actions, he found himself at a crossroads. Would he cling to the ambition that defined him, or would the moral dilemmas he faced lead him down a path of self-destruction?"
    ],
    "order": 4
  },
  {
    "name": "Roy Courtenay",
    "summary": "An investigative journalist with a vendetta, Roy Courtenay finds himself entangled in a web of revenge and ambition as he seeks to expose the dark secrets of the victim.",
    "publicPersona": "Known for his relentless pursuit of truth, Roy is a respected journalist whose articles often expose the scandals of the elite, making him both admired and reviled.",
    "privateSecret": "Harboring a personal vendetta against the victim for ruining his father's reputation, Roy is driven by a desire for revenge that clouds his judgment.",
    "motiveSeed": "Roy aims to expose the victim's dark secrets and gain fame, but his resentment also fuels a deeper need for justice.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be interviewing locals from 8:00 PM to 9:30 PM, a cover that could easily be verified.",
    "accessPlausibility": "possible",
    "stakes": "Desire for revenge and to clear his family's name, Roy's pursuit of truth is intertwined with his personal history.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Roy's speech is punctuated by sharp observations and a wry tone, often employing sarcasm to mask his deeper emotions. He has a tendency to digress into anecdotes that reveal his perspective on justice and morality.",
    "internalConflict": "Roy struggles with the fine line between seeking revenge and pursuing justice, questioning whether his motivations are rooted in righteousness or bitterness.",
    "personalStakeInCase": "This crime matters to Roy because it represents an opportunity to reclaim his father's legacy and bring to light the truths he believes have been buried.",
    "paragraphs": [
      "Roy Courtenay leaned against the bar, nursing a drink as he surveyed the room with a journalist's keen eye. The atmosphere was thick with tension, whispers of scandal swirling like smoke. He had always been drawn to the underbelly of society, uncovering truths that others preferred to keep buried. Yet tonight, his pursuit of the story felt personal. The victim was not just another subject; he was a man who had decimated Roy's father's reputation, leaving a legacy of shame that haunted him like a specter.",
      "In conversations, Roy often wore a mask of dry humor, using wit as both a shield and a weapon. He found solace in sarcasm, a way to distance himself from the pain of his family's past. But beneath the surface, a storm of anger brewed, fueled by memories of his father’s downfall. As he plotted his next move, the desire for revenge began to cloud his judgment, blurring the lines between justice and retribution.",
      "The night of the murder loomed large in his mind, and he had been busy interviewing locals, gathering what he hoped would be the final pieces of a puzzle that had consumed his thoughts for years. Yet, as he navigated the murky waters of ambition, he questioned whether his motivations were truly noble. Was he seeking to expose the victim's secrets for the sake of truth, or was it revenge that drove him forward?",
      "As he left the bar, Roy felt the weight of his choices bearing down on him. The crime mattered deeply to him, a chance to reclaim his father's legacy and to write a story that would resonate far beyond the confines of Little Middleton. Yet, he knew that in seeking vengeance, he risked losing sight of the very principles that had guided his career. In this race against time, would he emerge as a hero or a man consumed by his own vendetta?"
    ],
    "order": 5
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
    "summary": "An imposing manor house surrounded by formal gardens and dense woodlands, steeped in secrets and tension.",
    "visualDescription": "The manor rises majestically, its dark stone facade adorned with ivy and flanked by manicured hedges. Tall windows reflect the brooding sky, while the gabled roof looms over the sprawling grounds. A gravel driveway winds through the gardens, leading to an imposing entrance sheltered by a stone archway.",
    "atmosphere": "A palpable sense of mystery lingers in the air, underscored by the rustle of leaves and distant thunder.",
    "paragraphs": [
      "Middleton Manor, with its grand stone exterior and sprawling gardens, stands as a testament to a bygone era of opulence. The house, dominated by its gabled roof and tall chimneys, appears almost foreboding against the darkening sky. Ivy clings to its walls, whispering secrets of the past, while the meticulously kept hedges create a stark contrast to the wildness of the surrounding woodlands. As the wind stirs, the manor seems to sigh, as if it holds its breath in anticipation of the events about to unfold.",
      "The formal gardens, once a place of joyous gatherings and laughter, now feel heavy with unspoken tension. The vibrant blooms, drenched in the spring rains, bow under the weight of impending storm clouds. The air is thick with the scent of damp earth and floral perfume, mingling with the oppressive humidity that hangs like a shroud over the estate. As shadows stretch across the grounds, the manor's windows, dark and watchful, seem to conceal more than they reveal.",
      "Inside, the atmosphere shifts to one of claustrophobic intimacy. The echo of footsteps on polished oak floors reverberates through the halls, interrupted only by the distant crackle of fire in the drawing room. Each room, with its rich tapestries and antique furniture, tells a story, yet the oppressive silence suggests that secrets linger just beyond the surface. The study, with its locked doors and hidden passages, remains off-limits to all but the most privileged, heightening the sense of isolation that permeates the estate.",
      "As the rain begins to fall, the sound of droplets pattering against the leaded glass windows becomes a rhythmic reminder of the outside world, a world that feels increasingly distant. The weight of recent events hangs heavily in the air, and the manor, with its looming presence, stands as a silent witness to the unfolding mystery. Time moves slowly within these walls, each tick of the clock echoing the urgency of the situation, as if the very fabric of the estate is entwined with the fate of its inhabitants."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain showers, typical of late spring.",
    "timeFlow": "Three days of mounting tension as secrets unravel.",
    "mood": "Tense, with an underlying sense of unease due to recent events.",
    "eraMarkers": [
      "petrol touring cars on winding country roads",
      "typewriters clacking in the study",
      "domestic telephones with party-line exchanges"
    ],
    "sensoryPalette": {
      "dominant": "Damp earth and floral perfume",
      "secondary": [
        "Crackling fire and polished wood",
        "Whispers of rustling leaves"
      ]
    },
    "paragraphs": [
      "The atmosphere at Middleton Manor is thick with anticipation, a sense that something lies just out of reach, hidden within the shadows of its grand architecture. The overcast sky casts a muted light over the estate, enhancing the vibrant greens of the gardens while simultaneously deepening the darkness of its corners. Rain drizzles intermittently, creating a symphony of sound that amplifies the silence within, punctuated only by the distant rumble of thunder.",
      "As the days progress, the mood shifts from oppressive stillness to a charged tension, each character caught in their own web of secrets and lies. The manor, with its labyrinth of rooms and concealed passages, offers both refuge and entrapment, a place where the past collides with the present. The scent of wet stone and blooming flowers fills the air, a reminder of the life that persists outside, contrasting sharply with the growing sense of dread that envelops the inhabitants within."
    ]
  },
  "keyLocations": [
    {
      "id": "drawing_room",
      "name": "Drawing Room",
      "type": "interior",
      "purpose": "Gathering space for the family and guests",
      "visualDetails": "Opulent decor with velvet drapes and an ornate fireplace; portraits of ancestors line the walls.",
      "sensoryDetails": {
        "sights": [
          "flickering candlelight",
          "dark wood paneling",
          "plush velvet furnishings",
          "gilded picture frames"
        ],
        "sounds": [
          "whispers of conversation",
          "crackling fire",
          "soft music from a gramophone",
          "rain tapping on the window"
        ],
        "smells": [
          "old leather and tobacco",
          "burning wood and wax",
          "dusty upholstery",
          "freshly cut flowers"
        ],
        "tactile": [
          "smooth velvet cushions",
          "cool marble fireplace",
          "worn wooden armrests",
          "satin tablecloth"
        ]
      },
      "accessControl": "Accessible to guests during social hours; family members may enter at any time.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through curtains",
            "puddles forming on the terrace"
          ],
          "sounds": [
            "gentle drumming of rain",
            "muffled voices from the kitchen"
          ],
          "smells": [
            "damp fabric and wood",
            "fresh coffee brewing",
            "earthy floral notes"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "the flicker of candles against dark wood"
          ],
          "sounds": [
            "the ticking of a clock",
            "the rustle of silk dresses"
          ],
          "smells": [
            "scent of old books",
            "worn leather and dust",
            "lingering tobacco smoke"
          ],
          "mood": "heavy silence"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of candlelight on polished surfaces",
            "the last rays of sun through windows"
          ],
          "sounds": [
            "laughter from the garden",
            "clinking of glasses"
          ],
          "smells": [
            "scent of fine wine",
            "cooked meats from the kitchen",
            "fresh flowers on the table"
          ],
          "mood": "tense celebration"
        }
      ],
      "paragraphs": [
        "The drawing room at Middleton Manor serves as the heart of social life, filled with an air of elegance and subtle tension. The flickering candlelight casts dancing shadows across the dark wood paneling, illuminating the portraits of ancestors who seem to observe every interaction. Plush velvet furnishings invite guests to linger, but the atmosphere is tinged with unspoken words and hidden agendas, as conversations flow like the rain outside, sometimes soft and gentle, sometimes sharp and abrupt.",
        "As the day progresses, the drawing room transforms with the light, shifting from a somber retreat in the morning to a vibrant gathering space in the evening. The scents of old leather and burning wood blend with the soft notes of music emanating from a gramophone, creating a tapestry of sensory experiences that envelops the occupants. Yet, beneath the surface of laughter and clinking glasses, a current of unease runs deep, suggesting that not all is as it seems within these walls."
      ]
    },
    {
      "id": "study",
      "name": "Study",
      "type": "interior",
      "purpose": "Private space for contemplation and work",
      "visualDetails": "Dark wood shelves filled with books; a large oak desk cluttered with papers and a typewriter.",
      "sensoryDetails": {
        "sights": [
          "dust motes in sunlight",
          "books with worn spines",
          "a heavy oak desk",
          "a globe in the corner"
        ],
        "sounds": [
          "typing on a typewriter",
          "pages rustling",
          "distant clock ticking",
          "soft rain against the window"
        ],
        "smells": [
          "old paper and ink",
          "polished wood",
          "leather bindings",
          "dust"
        ],
        "tactile": [
          "smooth typewriter keys",
          "cool leather chair",
          "rough pages of books",
          "warm sunlight on the desk"
        ]
      },
      "accessControl": "Restricted to the master of the house; staff may enter only with permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "darkened room with muted light",
            "raindrops on the window"
          ],
          "sounds": [
            "steady rain on the roof",
            "distant thunder"
          ],
          "smells": [
            "freshly brewed coffee",
            "wet earth",
            "old wood"
          ],
          "mood": "introspective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows deepening in corners",
            "the glow of a desk lamp"
          ],
          "sounds": [
            "the ticking of a clock",
            "the scratch of a pen on paper"
          ],
          "smells": [
            "faint scent of tobacco",
            "dusty books",
            "old leather"
          ],
          "mood": "contemplative focus"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling from the lamp",
            "the glow of a fireplace"
          ],
          "sounds": [
            "the crackle of firewood",
            "soft footsteps outside"
          ],
          "smells": [
            "scent of burning logs",
            "freshly polished wood",
            "cooked dinner wafting in"
          ],
          "mood": "reflective calm"
        }
      ],
      "paragraphs": [
        "The study is an intimate space filled with the scent of old books and polished wood. Dark shelves, heavy with the weight of knowledge, line the walls, while a large oak desk stands as a command center for the master of the house. Papers are strewn across its surface, hinting at the urgency of the work being done. The typewriter sits poised, ready to capture thoughts and secrets, echoing the solitude of its surroundings, where every sound is amplified—the ticking clock, the rustle of pages, the distant rumble of thunder.",
        "As the day wears on, the study transforms, with the light shifting from a dull grey to a warm golden glow. The atmosphere becomes a cocoon of focus, where the outside world fades away. The soft patter of rain against the window becomes a soothing backdrop, allowing for contemplation and introspection. Yet, even in this sanctuary, an undercurrent of tension persists, as if the shadows themselves are privy to the secrets held within these walls."
      ]
    },
    {
      "id": "cellar",
      "name": "Cellar",
      "type": "interior",
      "purpose": "Storage area for wine and provisions; potential hiding place",
      "visualDetails": "Low stone archways and dim lighting; shelves lined with dusty bottles.",
      "sensoryDetails": {
        "sights": [
          "flickering candlelight",
          "shadowy corners",
          "dusty bottles on shelves",
          "stone walls"
        ],
        "sounds": [
          "dripping water",
          "muffled footsteps",
          "the creak of old wood",
          "echoing silence"
        ],
        "smells": [
          "musty earth and damp stone",
          "aged wine and wood",
          "faint scent of mold",
          "cold air"
        ],
        "tactile": [
          "rough stone walls",
          "cool air brushing the skin",
          "dusty surfaces",
          "heavy wooden barrels"
        ]
      },
      "accessControl": "Locked and only accessible to the butler; family members may enter with permission.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through cracks",
            "puddles from leaks"
          ],
          "sounds": [
            "steady drip of water",
            "the rustle of mice"
          ],
          "smells": [
            "damp wood and stone",
            "faint scent of wine",
            "earthy mold"
          ],
          "mood": "claustrophobic confinement"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows pooling in corners",
            "the glow of a single candle"
          ],
          "sounds": [
            "the creak of shelves",
            "the distant rumble of thunder"
          ],
          "smells": [
            "musty earth",
            "faint wine aromas",
            "damp air"
          ],
          "mood": "ominous anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "flickering shadows dancing on stone",
            "the glow of candlelight"
          ],
          "sounds": [
            "soft rustling of fabric",
            "the distant laughter from above"
          ],
          "smells": [
            "scent of aged wine",
            "freshly polished wood",
            "cool air"
          ],
          "mood": "secretive exploration"
        }
      ],
      "paragraphs": [
        "The cellar below Middleton Manor is a world apart, cloaked in shadows and silence. Low stone archways create a labyrinthine feel, where flickering candlelight struggles to dispel the darkness. Dusty bottles line the shelves, their labels faded and forgotten, while the air is thick with the musty scent of damp stone and aged wood. The coolness of the space contrasts sharply with the warmth above, creating an unsettling atmosphere that hints at secrets long buried.",
        "As the rain taps on the surface above, the sounds of dripping water echo through the cellar, each drop a reminder of the world outside. The oppressive silence is occasionally broken by the creak of old wood, suggesting movement in the shadows. Here, amidst the heavy wooden barrels and the cold stone walls, the cellar holds its own mysteries, a potential hiding place that may reveal more than just provisions."
      ]
    },
    {
      "id": "formal_garden",
      "name": "Formal Garden",
      "type": "exterior",
      "purpose": "Landscaped area for leisure and social gatherings",
      "visualDetails": "Symmetrical flower beds and manicured hedges; statues of nymphs and fountains.",
      "sensoryDetails": {
        "sights": [
          "vibrant flower beds",
          "neatly trimmed hedges",
          "stone statues",
          "a bubbling fountain"
        ],
        "sounds": [
          "birds chirping",
          "water splashing",
          "the rustle of leaves",
          "distant laughter"
        ],
        "smells": [
          "fragrant blooms",
          "freshly cut grass",
          "earthy soil",
          "scent of rain"
        ],
        "tactile": [
          "soft petals brushing against skin",
          "cool stone of statues",
          "damp grass underfoot",
          "smooth fountain surface"
        ]
      },
      "accessControl": "Open to family and guests; staff may enter for maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "droplets clinging to petals",
            "puddles forming on paths"
          ],
          "sounds": [
            "gentle patter of rain",
            "birds flitting in the trees"
          ],
          "smells": [
            "fresh rain on grass",
            "earthy scents rising from soil",
            "scent of damp flowers"
          ],
          "mood": "tranquil solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "cloudy skies casting shadows",
            "flowers drooping under weight of rain"
          ],
          "sounds": [
            "the wind rustling through trees",
            "the distant sound of thunder"
          ],
          "smells": [
            "wet earth",
            "damp foliage",
            "faint floral fragrances"
          ],
          "mood": "heavy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light illuminating flowers",
            "shadows lengthening across paths"
          ],
          "sounds": [
            "crickets chirping",
            "the soft splash of the fountain"
          ],
          "smells": [
            "fresh blooms in the evening air",
            "scent of cut grass",
            "the coolness of night"
          ],
          "mood": "serene reflection"
        }
      ],
      "paragraphs": [
        "The formal garden at Middleton Manor is a stunning display of manicured beauty, designed for leisure and social gatherings. Symmetrical flower beds burst with color, while neatly trimmed hedges create a sense of order and tranquility. Stone statues of nymphs stand sentinel among the blooms, and a bubbling fountain provides a soothing soundtrack to the vibrant life surrounding it. Yet, beneath this picturesque facade, the garden holds its own secrets, with hidden corners where whispers can linger.",
        "In the morning, as rain gently falls, droplets cling to petals, creating a delicate shimmer across the landscape. The scent of fresh rain mixes with earthy notes from the soil, providing a tranquil solitude that invites reflection. As the day progresses, the overcast sky casts shadows over the flowers, and the mood shifts to one of heavy stillness. By evening, the garden transforms once more, illuminated by the golden light of the setting sun, inviting guests to wander and ponder the mysteries that linger just beyond the surface."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023854049999999997,
  "durationMs": 31472
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1932,
    "month": "February",
    "day": 14,
    "era": "1930s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "chilly temperatures ranging from 30 to 40 degrees Fahrenheit",
      "overcast skies with sporadic rain showers",
      "occasional flurries of snow"
    ],
    "daylight": "Short daylight hours with the sun setting around 5:30 PM, creating early darkness.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Valentine's Day"
    ],
    "seasonalActivities": [
      "ice skating on local ponds",
      "sipping hot cocoa by the fire",
      "attending charity events for the local poor"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tailored three-piece suit in wool",
        "double-breasted dinner jacket",
        "white dress shirt with a wing collar"
      ],
      "casual": [
        "knitted pullover sweater",
        "corduroy trousers",
        "herringbone tweed cap"
      ],
      "accessories": [
        "silk tie",
        "leather gloves",
        "dress watch"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with a dropped waist",
        "cloche hat adorned with a feather",
        "long evening gloves"
      ],
      "casual": [
        "simple woolen skirt and blouse",
        "tweed jacket",
        "knitted shawl"
      ],
      "accessories": [
        "string of pearls",
        "silk scarf",
        "small handbag with a chain strap"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "increased popularity of jazz music",
      "shift towards practical, yet stylish clothing"
    ],
    "socialExpectations": [
      "men are expected to maintain a formal appearance",
      "women should dress modestly yet elegantly",
      "social gatherings often emphasize class distinctions"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "intensifying economic struggles as the Great Depression continues",
      "political unrest with rising socialist movements in Britain",
      "increased tensions due to the rise of fascism in Europe"
    ],
    "politicalClimate": "A climate of uncertainty and fear, with economic hardship leading to radical political movements gaining traction across Europe.",
    "economicConditions": "High unemployment rates and widespread poverty, leading to social unrest and charity drives becoming more common.",
    "socialIssues": [
      "class disparity exacerbated by the Great Depression",
      "women's suffrage and ongoing discussions about gender equality",
      "debate over immigration policies due to economic strain"
    ],
    "internationalNews": [
      "the ongoing economic crisis in Germany",
      "the rise of Benito Mussolini's fascist regime in Italy",
      "increased tensions in the Far East as Japan expands its military influence"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Benny Goodman and his orchestra",
        "Duke Ellington's big band",
        "George Gershwin's compositions"
      ],
      "films": [
        "The Front Page",
        "Scarface",
        "The Champ"
      ],
      "theater": [
        "The Royal Family",
        "The Front Page (Broadway)",
        "Porgy and Bess (upcoming)"
      ],
      "radio": [
        "Amos 'n' Andy",
        "The Shadow",
        "The Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Good Earth by Pearl S. Buck",
        "Murder in the Cathedral by T.S. Eliot",
        "The Maltese Falcon by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery fiction",
        "social realism",
        "modernist literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric razor",
        "the television (in experimental stages)",
        "the radio with improved reception"
      ],
      "commonDevices": [
        "domestic telephones",
        "typewriters in offices",
        "petrol cars for transportation"
      ],
      "emergingTrends": [
        "increased use of mechanization in agriculture",
        "growing interest in radio broadcasting",
        "advent of early home appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Dress shirt: six shillings"
      ],
      "commonActivities": [
        "attending local dances",
        "participating in community charity events",
        "gathering around the radio for entertainment"
      ],
      "socialRituals": [
        "afternoon tea served daily",
        "weekly church services followed by community gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing resentment towards the wealthy",
      "nobility is expected to contribute to charity",
      "working-class individuals often feel marginalized"
    ],
    "gender": [
      "women are increasingly entering the workforce",
      "traditional gender roles are being challenged",
      "expectation for women to participate in social events"
    ],
    "race": [
      "racial tensions due to economic hardship",
      "increased awareness of civil rights among marginalized groups"
    ],
    "generalNorms": [
      "emphasis on politeness and decorum in social settings",
      "growing acceptance of modern values and lifestyles",
      "traditional family structures are still prevalent"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth mingles with the faint aroma of wood smoke from the fireplace, creating a cozy yet tense atmosphere inside the grand estate.",
    "The sound of rain pattering against the windowpanes accompanies the occasional crackle of the radio, which provides a backdrop to hushed conversations and stolen glances.",
    "Outside, the landscape is a muted palette of greys and browns, with leafless trees standing stark against the low-hanging clouds, reflecting the somber mood of the nation."
  ],
  "paragraphs": [
    "February 1932 is marked by the chill of winter, with overcast skies frequently punctuated by rain showers that create a sense of gloom across the country house estate. The daylight hours are short, with the sun dipping below the horizon by 5:30 PM, casting an early darkness that seems to amplify the tensions among the manor’s residents. Valentine's Day approaches, yet the atmosphere is anything but romantic; instead, whispers of economic despair and class struggle linger in the air, making the holiday feel hollow.",
    "Fashion during this period reflects both practicality and elegance. Men don tailored three-piece suits in muted colors, often complemented by silk ties and leather gloves, while women favor tea-length dresses with dropped waists, accessorized with cloche hats and strings of pearls. The era's trends are influenced by Art Deco styles, with an emphasis on clean lines and sophisticated detailing. Social gatherings, such as afternoon teas or charity events, remain important, and individuals dress with care to adhere to the expectations of their class.",
    "Daily life is shaped by the ongoing hardships of the Great Depression, with families tightening their belts amidst rising prices and dwindling incomes. A loaf of bread costs four pence, while a cinema ticket is one shilling, making entertainment a luxury for many. Community rituals like afternoon tea and church services foster social bonds, yet underlying tensions simmer as class disparities become more pronounced. People gather around radios to listen to popular shows, finding solace in music and storytelling even as they navigate the challenges of a changing world."
  ],
  "note": "",
  "cost": 0.00106274355,
  "durationMs": 11939
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the manor for a contentious estate meeting forces heirs and staff to confront growing class tensions and the looming shadow of the Great Depression.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class divides, with the wealthy heirs clashing over inheritance while the staff navigate restricted access and precarious job security."
  },
  "setting": {
    "location": "A large, imposing manor house set in sprawling grounds, featuring formal gardens and a backdrop of woodlands.",
    "institution": "Country house estate",
    "weather": "Overcast with occasional rain showers, typical of late spring."
  },
  "castAnchors": [
    "John Devereux",
    "Marjorie Drury",
    "Solange Mandeville",
    "Jerome Lovell",
    "Roy Courtenay"
  ],
  "theme": "A classic murder mystery"
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
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock in the library was tampered with to mislead the timing of Marjorie's murder.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This reveals the core mechanism of the murder being timed incorrectly.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "testimonial",
      "description": "This contradicts the statement that Marjorie was murdered at a quarter past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "It shows that the timeline provided by witnesses is flawed.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "John Devereux was seen in the garden at eleven ten in the morning.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This provides an alibi for John during the time of the murder.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "If the clock was tampered with, John could have committed the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This suggests a possible motive for John to alter the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "The clock was found with fingerprints only belonging to John.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This links John directly to the tampering of the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "temporal",
      "description": "This indicates John tampered with the clock to create a false alibi.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "It shows John's intention to mislead the investigation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_11",
      "category": "behavioral",
      "description": "John had financial motives from Marjorie's inheritance.",
      "sourceInCML": "CASE.cast[0].evidence_sensitivity[0]",
      "pointsTo": "This suggests premeditation on John's part.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_12",
      "category": "testimonial",
      "description": "Eliminates Jerome Lovell because he was seen entering the manor just before the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This provides a corroborated alibi for Jerome.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_13",
      "category": "testimonial",
      "description": "Eliminates Roy Courtenay because he claims to have been in the garden during the murder.",
      "sourceInCML": "CASE.cast[4].alibi_window",
      "pointsTo": "This provides a corroborated alibi for Roy.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_14",
      "category": "testimonial",
      "description": "Eliminates Jerome Lovell because his alibi does not overlap with the time of the murder.",
      "sourceInCML": "CASE.cast[3].alibi_window",
      "pointsTo": "This narrows the investigation toward John Devereux.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_john_devereux",
      "category": "temporal",
      "description": "Direct evidence ties John Devereux to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[0].access_plausibility",
      "pointsTo": "This direct evidence shows John Devereux had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "If the clock was tampered with, John could have committed the murder.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This suggests a possible motive for John to alter the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "This indicates John tampered with the clock to create a false alibi.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "It shows John's intention to mislead the investigation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock shows quarter past eleven remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Witnesses heard a scream shortly after the struck struck a drury past shortly.",
      "supportsAssumption": "Marjorie Drury was murdered shortly after the clock struck a quarter past eleven.",
      "misdirection": "This leads the investigation to focus on the timing rather than the tampering of the struck."
    },
    {
      "id": "rh_2",
      "description": "John claims to have been gardening at the time of the murder.",
      "supportsAssumption": "Marjorie Drury was murdered shortly after the clock struck a quarter past eleven.",
      "misdirection": "This creates an impression of innocence while hiding his involvement with the seemed."
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
      "clue_culprit_direct_john_devereux"
    ],
    "mid": [
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_11",
      "clue_12",
      "clue_13",
      "clue_14",
      "clue_1",
      "clue_2"
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
  "latencyMs": 12566,
  "cost": 0.0013135369499999998
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

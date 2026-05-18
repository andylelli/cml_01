# Actual Prompt Record

- Run ID: `mystery-1779041438220`
- Project ID: ``
- Timestamp: `2026-05-17T18:13:07.445Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `89639fdd73406434`

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
      "institution": "Manor House"
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
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (acquaintance)",
        "Beatrice Quill (servant)"
      ],
      "public_persona": "Respected local detective and socialite",
      "private_secret": "Struggles with the expectations of her social class",
      "motive_seed": "Desire to protect friends and family",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "social events",
        "private gatherings"
      ],
      "behavioral_tells": [
        "noticing small details",
        "sharp observations"
      ],
      "stakes": "Seeking justice for a friend",
      "evidence_sensitivity": [
        "high"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "30-40",
      "role_archetype": "acquaintance",
      "relationships": [
        "Eleanor Voss (friend)",
        "Captain Ivor Hale (colleague)",
        "Beatrice Quill (servant)"
      ],
      "public_persona": "Respected physician in the community",
      "private_secret": "Conceals a past affair with the victim",
      "motive_seed": "Fear of exposure",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 9:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "home visits",
        "social events"
      ],
      "behavioral_tells": [
        "anxious demeanor",
        "avoids eye contact"
      ],
      "stakes": "Reputation at stake",
      "evidence_sensitivity": [
        "medium"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "40-50",
      "role_archetype": "authority",
      "relationships": [
        "Eleanor Voss (acquaintance)",
        "Dr. Mallory Finch (colleague)",
        "Beatrice Quill (servant)"
      ],
      "public_persona": "Military officer with a distinguished record",
      "private_secret": "Hides his disapproval of the victim's lifestyle",
      "motive_seed": "Desire to maintain respectability",
      "motive_strength": "low",
      "alibi_window": "8:30 PM to 9:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "social events"
      ],
      "behavioral_tells": [
        "calm under pressure",
        "stoic expressions"
      ],
      "stakes": "Maintaining social standing",
      "evidence_sensitivity": [
        "low"
      ],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "servant",
      "relationships": [
        "Eleanor Voss (employer)",
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (acquaintance)"
      ],
      "public_persona": "Loyal maid with a keen eye",
      "private_secret": "Holds knowledge of many household secrets",
      "motive_seed": "Protecting her position",
      "motive_strength": "moderate",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "serving meals",
        "cleaning rooms"
      ],
      "behavioral_tells": [
        "nervous tics",
        "distrustful of others"
      ],
      "stakes": "Job security",
      "evidence_sensitivity": [
        "medium"
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
      "summary": "In the midst of a stormy evening at the manor, Eleanor Voss must solve the murder of her friend, whose life was cut short by a tampered clock. As tensions rise and secrets are revealed, the true time of death becomes the key to unraveling the mystery."
    },
    "accepted_facts": [
      "Eleanor Voss was found dead in the drawing room.",
      "The clock in the drawing room was stopped at a peculiar time.",
      "Dr. Mallory Finch was present at the manor shortly before the murder."
    ],
    "inferred_conclusions": [
      "The time indicated by the clock does not match the true time of death.",
      "Dr. Mallory Finch has a motive linked to the victim."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on clock, indicat, and stopp to expose the false timing.",
      "delivery_path": [
        {
          "step": "The murderer rewinds the clock forty minutes before the murder."
        }
      ]
    },
    "outcome": {
      "result": "The true time of death is revealed, implicating Dr. Mallory Finch."
    }
  },
  "false_assumption": {
    "statement": "The murder occurred at the time indicated by the clock.",
    "type": "temporal",
    "why_it_seems_reasonable": "The clock appears to be functioning normally and is trusted by the household.",
    "what_it_hides": "The true time of death is forty minutes earlier than indicated."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "clock stopped at nine o'clock",
        "Eleanor last seen at eight forty"
      ],
      "windows": [
        "8:00 PM to 9:30 PM"
      ],
      "contradictions": [
        "Witness statements conflict with physical evidence regarding the time of death."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Beatrice Quill"
      ],
      "objects": [
        "drawing room clock",
        "Eleanor's drink"
      ],
      "permissions": [
        "access to the drawing room during the event"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical operation of clocks",
        "Physical evidence of tampering"
      ],
      "traces": [
        "Faint scratch on the clock face",
        "Sign of disturbance around the clock"
      ]
    },
    "social": {
      "trust_channels": [
        "Reputation of Dr. Mallory Finch",
        "Eleanor's trust in her friends"
      ],
      "authority_sources": [
        "Local authority respect for Dr. Mallory Finch"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the drawing room shows it stopped at nine o'clock.",
        "correction": "This indicates that the time of death may be misrepresented.",
        "effect": "Narrows investigation to the clock's tampering.",
        "required_evidence": [
          "Clock stopped at nine o'clock",
          "Witness statement of Eleanor last being seen at eight forty"
        ],
        "reader_observable": true
      },
      {
        "observation": "A faint scratch is visible on the clock face.",
        "correction": "The scratch suggests that the clock has been tampered with.",
        "effect": "Eliminates the possibility that the clock was functioning normally.",
        "required_evidence": [
          "Faint scratch on the clock face",
          "Witness statement about the clock's behavior before the murder"
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Mallory Finch's alibi places her at the manor during the time of death.",
        "correction": "This creates an opportunity for her to tamper with the clock.",
        "effect": "Narrows suspect pool to Dr. Mallory Finch.",
        "required_evidence": [
          "Dr. Mallory Finch's alibi",
          "Witness accounts of her presence"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A controlled comparison of the clock's mechanism and the time of death established by witness accounts proves Dr. Mallory Finch's tampering.",
    "knowledge_revealed": "The revealed facts are clock, stopp, and o'clock.",
    "pass_condition": "The clock's manipulation is confirmed through physical evidence.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_fp_contradiction_step_3",
      "clue_culprit_direct_dr_mallory_finch"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The stopped clock indicates misrepresentation of time. Step 2: The scratch confirms tampering. Step 3: Dr. Mallory Finch's alibi places her at the scene, leading to the conclusion of her guilt."
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
        "Execute the controlled comparison of the clock's mechanism",
        "Reveal the evidence of tampering",
        "Conclude Dr. Mallory Finch's guilt"
      ],
      "test_type": "mechanical comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Established military alibi during the time of death",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness statements confirm her location was elsewhere",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of clock tampering"
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
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation of the stopped clock"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statement about Eleanor last seen"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Observation of the clock's scratch"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
    "summary": "Eleanor Voss is a charming socialite who hosts lavish gatherings while concealing her family's financial struggles. As an amateur sleuth, she seeks to protect her reputation and legacy amidst the chaos of a recent murder.",
    "publicPersona": "Eleanor is the quintessential hostess, draped in elegance and charm, effortlessly navigating the upper echelons of Little Middleton's society. Her parties are the talk of the town, filled with laughter, music, and the clinking of crystal glasses, as she entertains a parade of guests with grace and poise.",
    "privateSecret": "Beneath her polished exterior, Eleanor grapples with her family's descent into financial ruin, a reality that threatens to shatter her carefully constructed world. The weight of this secret looms over her, a constant reminder that the lavish lifestyle she presents is but a façade.",
    "motiveSeed": "Her desire to shield her family from the financial fallout and the potential exposure of their secrets drives Eleanor to investigate the murder. She understands that any scandal could unravel the delicate threads of her social standing and her family's legacy.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims she was in the garden during the murder, a fact corroborated by several guests who enjoyed the evening air, oblivious to the dark events unfolding within her home.",
    "accessPlausibility": "easy",
    "stakes": "The future of her family's legacy and her own reputation hang in the balance, as Eleanor realizes that failure to solve the murder could lead to disgrace and ruin.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor's speech is laced with an upper-class cadence, punctuated by charming anecdotes and a subtle edge that hints at her true feelings. She often employs irony and wit, particularly when addressing the absurdities of social expectations.",
    "internalConflict": "Eleanor is torn between her desire to uphold her family's reputation and the moral implications of her investigation. She struggles with the fear that exposing the truth may lead to further ruin, yet she knows that living a lie is no longer tenable.",
    "personalStakeInCase": "This crime matters deeply to Eleanor, as she feels a personal responsibility to protect her family's name and legacy, driving her to seek the truth at any cost.",
    "paragraphs": [
      "Eleanor Voss stood at the edge of her garden, the moonlight casting a silvery glow over the meticulously trimmed hedges. As she inhaled the fragrant scent of blooming roses, she could hear the laughter and music spilling from her grand estate, a stark contrast to the turmoil brewing within her heart. The recent murder had sent shockwaves through Little Middleton, and she felt the weight of expectation pressing down on her shoulders. After all, she was the charming hostess, the one who curated the social scene with effortless grace, yet now she found herself entangled in a web of suspicion and secrets.",
      "Her public persona was that of a gracious socialite, always ready with a smile and a witty remark. Yet, behind closed doors, Eleanor was grappling with the reality of her family's financial ruin, a situation exacerbated by the Great Depression. The lavish parties she threw were not just for enjoyment; they were a desperate attempt to maintain appearances and secure connections that could save her family from disgrace. The thought of losing everything she held dear was unbearable, and it fueled her determination to uncover the truth behind the murder that threatened to upend her world.",
      "As she moved through the crowd, exchanging pleasantries with guests, Eleanor's mind raced with possibilities. She needed to protect her family's legacy, and that meant delving into the murky waters of the investigation. The stakes were high; she could not afford to let a scandal tarnish the Voss name. Her alibi was solid, confirmed by numerous guests, but Eleanor knew that appearances could be deceiving. The delicate balance she maintained in her social life was now a double-edged sword, and she would need to tread carefully to avoid drawing attention to herself.",
      "In her quieter moments, Eleanor often found herself reflecting on the tension between her desire for personal gain and her moral integrity. She had always prided herself on her ability to navigate the complexities of social dynamics, but this case was different. It was personal. With each new revelation, she felt the grip of fear tightening around her. What if the truth was more devastating than she could imagine? As she stood in the garden, surrounded by the beauty of the night, Eleanor Voss knew that she could not turn back. The future of her family depended on her courage to confront the darkness lurking beneath the surface."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician with a reputation for kindness and charity, but she secretly harbors resentment over her treatment in the male-dominated medical field. As a professional outsider, she finds herself entangled in a murder investigation that could impact her career.",
    "publicPersona": "Dr. Finch is the epitome of compassion, known for her tireless work in the community and her dedication to her patients. Her warm smile and gentle demeanor make her a beloved figure, and she is often sought after for her medical expertise and philanthropic efforts.",
    "privateSecret": "Behind her kind façade lies a simmering resentment, a result of being repeatedly overlooked for a prestigious position due to her gender. This bitterness manifests in her interactions, where her professionalism often masks her frustration with the limitations imposed upon her.",
    "motiveSeed": "The death of the victim presents an opportunity for Dr. Finch, as she stands to inherit valuable medical equipment that could enhance her practice. The prospect of benefitting from the murder complicates her feelings about the case, as she grapples with the ethics of her potential gain.",
    "motiveStrength": "moderate",
    "alibiWindow": "During the time of the murder, Dr. Finch was tending to a patient in the east wing of the hospital, a fact verified by multiple hospital calls, providing her with a solid alibi.",
    "accessPlausibility": "unlikely",
    "stakes": "Her professional reputation hangs in the balance, and the outcome of the investigation could either bolster her standing in the community or further entrench her as an outsider.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Dr. Finch speaks with a measured tone, often punctuating her sentences with dry observations about the absurdities of life in medicine. Her wit is subtle, emerging in moments of levity, particularly in the face of serious discussions.",
    "internalConflict": "Dr. Finch is torn between her desire for professional recognition and her growing resentment towards the patriarchal structures that have stifled her career. She fears that her ambition may lead her down a morally compromising path, further alienating her from the very community she seeks to serve.",
    "personalStakeInCase": "This case matters to Dr. Finch not only because of the potential career implications but also because it forces her to confront the bitterness she harbors and the need for change within her profession.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the sterile confines of the hospital, the scent of antiseptic filling the air as she meticulously examined her patient. Her reputation as a compassionate physician preceded her, yet beneath the surface, a quiet storm raged. She had dedicated her life to her work, pouring her heart into every patient, but the recent murder had cast a shadow over her carefully curated existence. As she treated the sick, her mind wandered to the implications of the crime, and how it might affect her own standing in the community.",
      "In her public life, Dr. Finch was a beacon of kindness, known for her charitable endeavors and her unwavering commitment to her patients. Yet, in the recesses of her mind, she harbored a simmering resentment towards a medical establishment that had consistently overlooked her for prestigious positions. The recent death of the victim, a prominent figure in the medical community, opened a door to opportunities she had long been denied, complicating her feelings about the investigation.",
      "As she navigated the halls of the hospital, Dr. Finch often found herself reflecting on the delicate balance between ambition and ethics. The prospect of inheriting valuable medical equipment from the victim weighed heavily on her conscience. Could she truly benefit from a tragedy? Her alibi was sound, confirmed by numerous calls, yet the moral implications of her potential gain gnawed at her. The very thought of capitalizing on someone's death filled her with unease, forcing her to confront the bitterness she had long suppressed.",
      "In quieter moments, she indulged in dry humor, often remarking on the absurdities of her profession. 'If only they awarded degrees for patience,' she would quip, her wit serving as a shield against the frustrations of her reality. However, the murder investigation was different; it forced her to confront the reality of her situation. Dr. Finch understood that her future, both professionally and personally, was intricately tied to the outcome of this case. As she continued to treat her patients, she knew that she must find a way to balance her ambition with her integrity, lest she become a casualty of the very system she sought to change."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a charming naval officer known for his heroic exploits, but he is haunted by the recent end of a tumultuous affair with the murder victim. As a jilted lover, his emotional turmoil complicates his involvement in the investigation.",
    "publicPersona": "Captain Hale is the embodiment of gallantry, a naval officer whose exploits are the stuff of legend. With his striking good looks and charming demeanor, he captivates those around him, often regaling them with tales of bravery and adventure on the high seas.",
    "privateSecret": "Beneath the charm lies a heartbroken man, recently jilted by the victim after a passionate affair that ended in bitter disputes. The emotional fallout of their relationship lingers, clouding his judgment as he navigates the investigation.",
    "motiveSeed": "His heartache over the victim's betrayal fuels a desire for retribution, as he grapples with feelings of betrayal and loss. The emotional stakes are high, and the possibility of revenge complicates his feelings about the case.",
    "motiveStrength": "compelling",
    "alibiWindow": "Captain Hale claimed to be at the local pub at the time of the murder, but his alibi remains unverified, leaving room for suspicion.",
    "accessPlausibility": "possible",
    "stakes": "His emotional well-being hangs in the balance, as he must confront his feelings of betrayal and seek closure rather than vengeance.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Captain Hale speaks with a confident cadence, often punctuating his stories with dramatic flair and sardonic wit. His charm is palpable, yet there is a subtle edge to his humor that suggests deeper emotional currents at play.",
    "internalConflict": "Captain Hale is torn between his desire for revenge and his yearning for closure. He grapples with the pain of his recent breakup, questioning whether his feelings are rooted in love or a desire to reclaim his dignity.",
    "personalStakeInCase": "This case matters to Captain Hale because it forces him to confront the unresolved emotions stemming from his affair, ultimately determining whether he can move on from the past or be consumed by it.",
    "paragraphs": [
      "Captain Ivor Hale leaned against the polished bar of the local pub, nursing a drink as he reflected on the recent turn of events. The vibrant atmosphere around him contrasted sharply with the turmoil within. He was a man of action, a naval officer celebrated for his heroism, yet the recent murder had thrown him into a spiral of emotional conflict. The victim, a woman he had loved deeply, had betrayed him, and now her death left him reeling, caught between grief and anger.",
      "In public, Captain Hale was the picture of charm and gallantry, captivating audiences with tales of his exploits on the high seas. His laughter rang out like music, and his stories were tinged with the spice of adventure. Yet, beneath that charismatic exterior lay a heart in turmoil, haunted by memories of a passionate affair that had ended in bitter disputes. The emotional stakes of the murder investigation were personal, forcing him to confront the pain of betrayal and loss that lingered in the shadows of his heart.",
      "As he navigated the pub, Captain Hale's sardonic humor often surfaced, a coping mechanism for the emotional chaos that threatened to engulf him. 'Ah, love and war,' he would joke, his voice dripping with irony. 'One can never tell which is more treacherous.' Yet, the truth was that his heart was heavy with unresolved feelings, and the prospect of revenge danced tantalizingly at the edges of his consciousness. The idea of reclaiming his dignity through the investigation was seductive, yet he knew it could lead him down a dark path.",
      "In quieter moments, Captain Hale found himself grappling with the duality of his emotions. He longed for closure, yet the desire for revenge tugged at him like a siren's call. The murder investigation was more than a puzzle to solve; it was a reckoning with his past. As he stood in the pub, surrounded by laughter and camaraderie, he realized that the outcome of this case would determine whether he could finally move on or be forever anchored to the pain of his lost love."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious author navigating the literary world with a secret: she has plagiarized from her mentor, the murder victim. As a rising star, her career is at stake, and the murder investigation could either make or break her.",
    "publicPersona": "Beatrice is an up-and-coming novelist, celebrated in literary circles for her fresh voice and captivating narratives. Her charming demeanor and talent have garnered her a following, and she is seen as a bright star in the world of literature.",
    "privateSecret": "Beneath the surface of her literary success lies a dark secret: Beatrice has plagiarized elements of her work from the very victim she now finds herself entangled with. This betrayal weighs heavily on her conscience, complicating her feelings about the investigation.",
    "motiveSeed": "The death of her mentor opens doors to greater fame and notoriety for Beatrice, as she stands to gain recognition in the literary world if the victim is out of the picture.",
    "motiveStrength": "moderate",
    "alibiWindow": "At the time of the murder, Beatrice was said to be writing alone in her room, but no witnesses can verify her whereabouts, leaving her alibi tenuous.",
    "accessPlausibility": "easy",
    "stakes": "Her career and reputation are at stake, as the murder investigation could either cement her status as a literary star or expose her as a fraud.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks with a lively rhythm, often punctuating her thoughts with self-deprecating humor that reveals her insecurities. Her dialogue is peppered with literary references, reflecting her passion for storytelling.",
    "internalConflict": "Beatrice is caught in a moral quagmire, struggling with guilt over her plagiarism while also recognizing the potential benefits of the victim's death. She grapples with the fear of being exposed as a fraud, torn between ambition and integrity.",
    "personalStakeInCase": "This case matters to Beatrice because it forces her to confront the consequences of her actions, determining whether she will rise to greatness or be unmasked as a charlatan.",
    "paragraphs": [
      "Beatrice Quill sat at her cluttered desk, surrounded by crumpled papers and half-finished manuscripts, as she wrestled with the weight of her secret. The murder of her mentor had sent ripples through the literary community, and she found herself at a crossroads. On one hand, the death could propel her career to new heights; on the other, it threatened to unravel the very fabric of her existence. With each passing moment, she felt the pressure mounting, her aspirations clashing with the guilt that gnawed at her conscience.",
      "In public, Beatrice was the darling of literary circles, her talent lauded by critics and peers alike. Yet, behind the façade of success lay a dark truth: she had plagiarized from the very woman who had nurtured her career. The thought of being exposed as a fraud haunted her, casting a shadow over her every achievement. She often employed self-deprecating humor, joking about her 'brilliant' ideas being borrowed from the greats, but the laughter felt hollow, a mask for her insecurities.",
      "As the investigation unfolded, Beatrice found herself grappling with the duality of her emotions. The murder presented an opportunity for fame, yet it also forced her to confront the consequences of her actions. Her alibi, claiming to be writing alone in her room, was flimsy at best, leaving her vulnerable to suspicion. The stakes were high; her career and reputation hung in the balance, and the fear of being unmasked as a charlatan loomed large.",
      "In quieter moments, Beatrice would often reflect on the importance of integrity over ambition. She understood that her rise to greatness could come at a cost, yet the allure of success was hard to resist. As she navigated the swirling currents of the investigation, Beatrice Quill realized that the path to true success lay not in deception but in authenticity. The outcome of the case would determine whether she could rise above her past mistakes or be forever tethered to the shadows of her ambition."
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
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling manor house steeped in history, now the center of unsettling events as class tensions simmer beneath the surface.",
    "visualDescription": "The manor boasts grand neoclassical columns at the entry, flanked by intricate wrought-iron gates, with expansive lawns dotted by ancient oaks and carefully trimmed hedges. Its façade is a mix of warm red brick and pale stone, with tall, narrow windows that seem to watch every movement.",
    "atmosphere": "The air is thick with an unshakable tension, as whispers of discontent and secrets linger among the opulent decor.",
    "paragraphs": [
      "Little Middleton Manor stands imposingly against the backdrop of a brooding autumn sky, its vast grounds encircled by a high stone wall that isolates it from the outside world. The gravel driveway, well-worn by the passage of time and vehicles, leads visitors through a pair of grand wrought-iron gates, where the manicured gardens lie in stark contrast to the encroaching wildness of the surrounding countryside. The structure itself bears the weight of its history, with neoclassical columns rising to meet the slate-grey clouds, framing an entrance that has welcomed both joy and sorrow over the decades.",
      "Inside, the manor is a labyrinth of rooms, each steeped in its own story. The drawing room, with its ornate ceiling and heavy draperies, is filled with the scent of polished wood and aged leather, while the distant sound of rain tapping against the windowpanes creates a rhythm of unease. Here, the flickering gas lamps cast elongated shadows, making the plush furnishings seem to shift and breathe, as if they too are privy to the secrets that unfold within these walls. The air is thick with tension, a palpable reminder of the class struggles that have seeped into the very fabric of the estate.",
      "As guests gather for dinner, the atmosphere grows heavier, punctuated by the soft clinking of silverware and the murmur of polite conversation masking the underlying discord. The dining room, adorned with gilded mirrors and a grand chandelier, feels both extravagant and suffocating. The smell of roasted meats mingles with the musty scent of old books from the nearby library, where access is strictly controlled, a silent testament to the power dynamics at play. The heavy oak doors of the library remain locked, a barrier to the hidden knowledge and secrets that could unravel everything.",
      "Outside, the expansive gardens, once a place of leisure and beauty, now seem to echo with a sense of foreboding. The paths are lined with damp leaves, and the air carries the scent of wet earth, while the distant rumble of thunder hints at the storms brewing not only in the skies but also within the manor itself. With the nearest village miles away, the estate feels like a world unto itself, where the boundaries of class and privilege are starkly drawn, and where every shadow could conceal a truth that longs to be unveiled."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical for a late autumn day",
    "timeFlow": "Days of mounting tension leading to a climactic confrontation",
    "mood": "Tense due to underlying class tensions and recent unsettling events at the estate",
    "eraMarkers": [
      "Petrol-powered cars on gravel driveways",
      "Wired telephones in select rooms",
      "Electric lighting with frequent outages",
      "Typewriters for correspondence",
      "Frequent train services to nearby towns"
    ],
    "sensoryPalette": {
      "dominant": "A heavy, oppressive atmosphere laden with secrets",
      "secondary": [
        "The sharp scent of rain-soaked earth",
        "The muted sounds of distant thunder"
      ]
    },
    "paragraphs": [
      "The heavy clouds loom overhead, casting a pall over Little Middleton Manor, where the atmosphere is thick with unspoken words and hidden agendas. The occasional patter of rain against the windows punctuates the silence, creating a rhythm that mirrors the tension building within the household. Each room feels alive with whispers, shadows stretching and clawing at the edges of perception, as if the very walls hold their breath in anticipation of the unknown.",
      "Inside, the flickering gas lights create a dance of light and shadow, illuminating the ornate furnishings while leaving corners steeped in darkness. The rich scent of beeswax candles mingles with the dampness of the autumn air, heightening the sense of claustrophobia that envelops the manor. Outside, the gardens, once a sanctuary of beauty, now feel like a maze of secrets, where every rustle in the leaves could signal a lurking danger, and every footfall on the gravel path echoes the uncertainty of the events yet to unfold."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The West Wing Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A dimly lit room lined with tall shelves of dusty tomes, heavy drapes covering the windows, and a large oak desk at its center.",
      "sensoryDetails": {
        "sights": [
          "Dust motes swirling in the dim light",
          "Faded leather-bound volumes on shelves",
          "A flickering candle casting shadows",
          "Old maps pinned to the walls",
          "The heavy oak desk strewn with papers"
        ],
        "sounds": [
          "The whisper of turning pages",
          "A distant clock ticking",
          "The creak of old floorboards",
          "The rustle of fabric from the drapes",
          "The soft patter of rain against the window"
        ],
        "smells": [
          "Musty old books",
          "Beeswax from the candle",
          "Damp leather",
          "A hint of mildew",
          "Cold stone from the fireplace"
        ],
        "tactile": [
          "Worn leather chair",
          "Cold brass doorknob",
          "Smooth surface of the oak desk",
          "Rough texture of the old tomes",
          "Chill draft from the window"
        ]
      },
      "accessControl": "Access is restricted to the family and select guests; staff require permission to enter.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-soaked pages on the desk",
            "Grey light filtering through the drapes",
            "Water droplets on the window",
            "Glistening dust motes in the air",
            "Shadows deepening in the corners"
          ],
          "sounds": [
            "Steady rain on the roof",
            "The soft rustle of paper",
            "Distant thunder rumbling",
            "Footsteps echoing on the floor",
            "The ticking clock growing louder"
          ],
          "smells": [
            "Fresh rain on dry wood",
            "A damp, earthy scent",
            "Old leather and paper",
            "The faint aroma of tea brewing nearby",
            "Cold stone from the fireplace"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light dulling colors",
            "Shadows creeping along the floor",
            "The library door slightly ajar",
            "Dust settling on the desk",
            "Old maps fluttering slightly"
          ],
          "sounds": [
            "Silence broken by a distant clock",
            "The faint rustle of fabric",
            "The creak of an unseen presence",
            "A soft sigh from the chair",
            "The wind whispering through the trees"
          ],
          "smells": [
            "Beeswax and dust",
            "A hint of mildew",
            "Old paper and ink",
            "The musty scent of leather",
            "Damp stone from the fireplace"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickering on the desk",
            "Long shadows stretching across the floor",
            "The last light of day fading through the window",
            "The library filled with a warm glow",
            "Old portraits seeming to watch"
          ],
          "sounds": [
            "The tick of a mantel clock",
            "Distant laughter from the drawing room",
            "A soft rustle of paper",
            "The crackle of the candle wick",
            "Footsteps approaching the door"
          ],
          "smells": [
            "Candle wax melting",
            "A faint whiff of tobacco smoke",
            "The scent of polished wood",
            "Damp leather and old books",
            "Cold ash from the fireplace"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The West Wing Library stands as a testament to the manor's storied past, its walls lined with volumes that whisper of secrets long kept. The light is dim, filtered through heavy drapes that seem to swallow sound, creating an atmosphere thick with silence and the scent of aged paper. An old oak desk, scarred by time, dominates the center of the room, papers strewn across its surface as if abandoned in haste. The air is cool and musty, a blend of leather and dampness that hints at the stories locked within these pages. Here, amidst the shadows, the tension is palpable, as if the very room holds its breath, waiting for a revelation.",
        "As the rain begins to patter against the window, the atmosphere shifts, the library becoming a sanctuary of sorts, yet fraught with impending danger. Dust motes dance in the candlelight, illuminated by flickers that cast ghostly shadows across the floor. The ticking clock marks the passage of time, each tick resonating with the weight of unspoken truths. In this room, the line between past and present blurs, and every rustle of paper feels like a step closer to uncovering the mystery that lies at the heart of Little Middleton Manor."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "An opulent room with high ceilings, adorned with rich tapestries and a grand piano in the corner, illuminated by gaslight.",
      "sensoryDetails": {
        "sights": [
          "Richly colored tapestries hanging on the walls",
          "A grand piano gleaming in the corner",
          "Gilded mirrors reflecting flickering gaslight",
          "Plush sofas arranged around a central table",
          "A crystal chandelier casting prismatic light"
        ],
        "sounds": [
          "The soft notes of piano music",
          "Laughter and conversation echoing",
          "The crackle of the fireplace",
          "The rustle of silk dresses",
          "The distant sound of rain against the windows"
        ],
        "smells": [
          "The scent of polished wood",
          "A hint of floral perfume",
          "The warm aroma of burning logs",
          "Dust from the tapestries",
          "A faint whiff of tobacco smoke"
        ],
        "tactile": [
          "Soft velvet upholstery",
          "Cool brass of the piano keys",
          "Worn leather of the armchairs",
          "The warmth of the fireplace",
          "The smooth surface of crystal glassware"
        ]
      },
      "accessControl": "Access is open to guests and family; staff are permitted only during service hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain streaking down the windows",
            "Dim light filtering through clouds",
            "Tapestries appearing muted",
            "The piano waiting silently",
            "Shadows deepening in corners"
          ],
          "sounds": [
            "Rain tapping on the roof",
            "Low murmurs of conversation",
            "The crackle of the fire",
            "The rustle of fabric",
            "A distant clock chiming"
          ],
          "smells": [
            "The scent of damp earth",
            "A hint of mildew from the drapes",
            "The warm aroma of pastries from the kitchen",
            "Polished wood and leather",
            "The faint smell of wet wool"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light dulling the colors",
            "Shadows creeping along the walls",
            "The flicker of gaslight fighting against the gloom",
            "The piano's polished surface reflecting dim light",
            "An empty chair near the fire"
          ],
          "sounds": [
            "The distant sound of rain",
            "Muffled voices from the hallway",
            "The soft thud of a book closing",
            "The rustle of silk as someone moves",
            "The clock ticking steadily"
          ],
          "smells": [
            "The scent of old paper",
            "A hint of dampness in the air",
            "The aroma of fresh tea brewing",
            "Polished furniture and leather",
            "The faint smell of tobacco smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight illuminating the room",
            "Reflections in the mirrors",
            "Long shadows cast by the chandelier",
            "Guests mingling in soft light",
            "The piano waiting for a performance"
          ],
          "sounds": [
            "Laughter rising above the murmur of conversation",
            "A soft melody from the piano",
            "The crackle of the fire",
            "The clinking of glasses",
            "Footfalls on the polished floor"
          ],
          "smells": [
            "A rich scent of floral perfume",
            "The aroma of fine wines",
            "Burning wood and coal",
            "The smell of polished furniture",
            "A hint of smoke from a nearby cigar"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Drawing Room is the heart of Little Middleton Manor, a space where the opulence of its decor contrasts sharply with the underlying tensions that simmer among its occupants. High ceilings adorned with rich tapestries give the room a grandeur that feels both inviting and suffocating. The grand piano, polished to a reflective sheen, stands silently in the corner, waiting for a performance that may never come. Gaslights flicker above, casting a warm glow that dances across the faces of the guests, masking their true emotions beneath a veneer of civility.",
        "As the rain begins to fall outside, the atmosphere shifts, the once vibrant colors of the room dulled by the grey light filtering through the windows. The sound of rain tapping against the glass mingles with the soft notes of piano music, creating a melancholic symphony that echoes the mood within. Laughter and conversation seem forced, their lightness a thin disguise for the tensions that threaten to unravel the evening. In this room, every glance exchanged, every hushed whisper carries the weight of secrets, and the air is thick with anticipation of what is to come."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Staff gathering space",
      "visualDetails": "A modest room with simple wooden furniture, a large table at the center, and a fireplace for warmth.",
      "sensoryDetails": {
        "sights": [
          "Simple wooden tables and chairs",
          "A flickering fire in the hearth",
          "Old photographs on the walls",
          "A large clock ticking on the mantel",
          "Crates of supplies stacked in the corner"
        ],
        "sounds": [
          "The crackle of the fire",
          "Low murmurs of conversation",
          "The clinking of dishes",
          "Footsteps on the wooden floor",
          "The distant sound of laughter from above"
        ],
        "smells": [
          "The aroma of cooking food",
          "A hint of smoke from the fire",
          "The scent of fresh bread",
          "Dust from the old furniture",
          "The mustiness of the room"
        ],
        "tactile": [
          "Rough wood of the table",
          "The warmth of the fire",
          "Coolness of the stone floor",
          "The worn fabric of the chairs",
          "The chill draft from the hallway"
        ]
      },
      "accessControl": "Access is limited to staff during meal hours; family members rarely enter.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Dim light filtering through the window",
            "Raindrops on the glass",
            "Steam rising from a pot on the stove",
            "Shadows lurking in the corners",
            "Old newspapers scattered on the table"
          ],
          "sounds": [
            "Rain drumming on the roof",
            "The clatter of dishes being washed",
            "Soft laughter among the staff",
            "The ticking clock marking the time",
            "The crackle of the fire"
          ],
          "smells": [
            "The aroma of hearty stew",
            "Freshly baked bread wafting in",
            "The scent of damp wood",
            "Smoke curling from the fireplace",
            "A hint of mildew in the corners"
          ],
          "mood": "cozy warmth"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light dulling the room",
            "Shadows lengthening across the floor",
            "The flicker of the fire casting light",
            "Empty chairs around the table",
            "A clock reflecting the passing time"
          ],
          "sounds": [
            "The quiet chatter of staff",
            "The clinking of dishes",
            "The distant sound of rain",
            "The clock ticking steadily",
            "Footsteps approaching the door"
          ],
          "smells": [
            "The scent of stewing meat",
            "Dust from the old furniture",
            "The warmth of fresh bread",
            "A hint of smoke from the fire",
            "The musty smell of old wood"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Warm light from the fireplace",
            "Dishes being cleared from the table",
            "The glow of lanterns outside",
            "Staff moving about efficiently",
            "Shadows dancing on the walls"
          ],
          "sounds": [
            "The clatter of plates being washed",
            "Laughter shared among staff",
            "The crackle of the fire",
            "Footsteps on the wooden floor",
            "The distant sound of music from the drawing room"
          ],
          "smells": [
            "The aroma of a hearty meal",
            "The scent of burning wood",
            "A hint of herbs from the kitchen",
            "Dust in the corners",
            "The mustiness of the room"
          ],
          "mood": "warm camaraderie"
        }
      ],
      "paragraphs": [
        "The Servants' Hall, a modest room tucked away from the grandeur of the manor, serves as the backbone of Little Middleton Manor's daily life. Simple wooden furniture fills the space, with a large table at the center where staff gather to share meals and stories. The flickering fire in the hearth casts a warm glow, contrasting sharply with the cold stone floor. Old photographs hang on the walls, remnants of past generations, while a large clock ticks steadily on the mantel, marking the passage of time in this hidden corner of the house.",
        "As rain begins to fall outside, the Servants' Hall transforms into a cozy refuge, filled with the aromas of hearty stew and freshly baked bread. Laughter echoes softly among the staff, their camaraderie a stark contrast to the tense atmosphere above. The sounds of clinking dishes and the crackle of the fire create a comforting backdrop, but even here, the unease of the manor's secrets looms, casting a shadow over their shared moments. With the distant rumble of thunder outside, the staff huddle closer, aware that the world beyond these walls holds dangers they can only whisper about."
      ]
    }
  ],
  "note": "",
  "cost": 0.0026794745999999996,
  "durationMs": 30540
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1938,
    "month": "August",
    "day": null,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "warm but overcast",
      "occasional rain showers",
      "muggy afternoons"
    ],
    "daylight": "Long summer days with sunset around 8:30 PM, giving way to twilight lingering until nearly nine o'clock.",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, after the last of the dinner guests have departed.",
    "holidays": [
      "Notting Hill Carnival (in London) celebrated on the last weekend of August"
    ],
    "seasonalActivities": [
      "garden parties and picnics",
      "outdoor theater performances",
      "cricket matches in the local park"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tweed jacket",
        "waistcoat",
        "tailored trousers"
      ],
      "casual": [
        "linen shirts",
        "cotton trousers",
        "lightweight blazers"
      ],
      "accessories": [
        "panama hats",
        "leather shoes",
        "silk ties"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses",
        "tailored suits",
        "elegant hats"
      ],
      "casual": [
        "simple blouses",
        "A-line skirts",
        "summer cardigans"
      ],
      "accessories": [
        "clutch bags",
        "pearl necklaces",
        "stylish gloves"
      ]
    },
    "trendsOfTheMoment": [
      "influence of Hollywood glamour",
      "rise of sporty chic styles",
      "the popularity of floral patterns"
    ],
    "socialExpectations": [
      "adherence to traditional gender roles",
      "emphasis on social class distinctions",
      "importance placed on propriety in public behavior"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "rising tensions in Europe with Nazi Germany's aggressive expansionist policies",
      "the Munich Agreement looming on the horizon",
      "the Spanish Civil War drawing to a close"
    ],
    "politicalClimate": "Increasing concern among the British public regarding the threat of fascism, and a growing debate over appeasement versus military preparedness.",
    "economicConditions": "Lingering effects of the Great Depression, with unemployment still a pressing issue, particularly among lower classes.",
    "socialIssues": [
      "emergence of anti-fascist movements",
      "discussions around labor rights and strikes",
      "racial tensions rising in urban areas"
    ],
    "internationalNews": [
      "Germany annexing Austria earlier in the year",
      "the ongoing instability in China due to the Second Sino-Japanese War"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's 'In the Mood'",
        "Benny Goodman's 'Sing, Sing, Sing'",
        "Duke Ellington's 'Take the 'A' Train'"
      ],
      "films": [
        "'The Adventures of Robin Hood'",
        "'The Lady Vanishes'",
        "'The Citadel'"
      ],
      "theater": [
        "'The Lady's Not for Burning'",
        "'The Fourposter'",
        "'The Devil's Disciple'"
      ],
      "radio": [
        "The Shadow",
        "Lux Radio Theater",
        "The Edgar Bergen and Charlie McCarthy Show"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Long Goodbye' by Raymond Chandler",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'The Old Man and the Sea' by Ernest Hemingway"
      ],
      "popularGenres": [
        "detective fiction",
        "social realism",
        "adventure novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial television broadcasts",
        "automated telephone exchanges",
        "the development of radar technology"
      ],
      "commonDevices": [
        "wireless radios",
        "typewriters",
        "petrol-powered cars"
      ],
      "emergingTrends": [
        "increased adoption of household electrification",
        "growth of consumerism post-Depression",
        "early forms of home appliances becoming more common"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cinema ticket: one shilling",
        "Pint of beer: eight pence"
      ],
      "commonActivities": [
        "attending local fairs and markets",
        "going to the cinema for new releases",
        "socializing at pubs or tea rooms"
      ],
      "socialRituals": [
        "afternoon tea gatherings",
        "summer garden parties",
        "Sunday family dinners"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "strong belief in class hierarchies",
      "expectation of aristocratic manners from the upper classes"
    ],
    "gender": [
      "women expected to fulfill domestic roles",
      "men as primary breadwinners",
      "emerging discussions on women's rights"
    ],
    "race": [
      "racial prejudices still prevalent",
      "growing awareness of racial equality",
      "social movements beginning to emerge"
    ],
    "generalNorms": [
      "importance of public decorum",
      "social events as status symbols",
      "community involvement seen as a virtue"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of damp earth and blooming summer flowers, mixed with the distant sound of rain on the manor's slate roof.",
    "A soft hum of conversation and laughter drifts from the drawing room, contrasting with the occasional crack of thunder that echoes through the estate.",
    "The flickering electric lights cast long shadows, creating a sense of unease that hangs palpably in the air, hinting at the tensions beneath the surface."
  ],
  "paragraphs": [
    "In August 1938, the manor house stands as an imposing structure against the backdrop of a warm yet overcast sky, with rain showers breaking the afternoon heat. As twilight descends, the lingering scent of wet grass and blooming flowers fills the air, while the distant sound of a cricket match echoes from the nearby park. The long summer days give way to evenings where the flickering electric lights create a dance of shadows, setting a stage ripe for mystery amidst the tensions of the times.",
    "Fashion during this season remains a reflection of the ongoing social dynamics, with men donning tailored trousers, crisp linen shirts, and elegant tweed jackets, while women favor tea-length dresses adorned with floral patterns. Accessories such as panama hats for men and stylish gloves for women offer a touch of glamour to the otherwise tense atmosphere. Garden parties and outdoor theater performances attract the local gentry, their laughter barely masking the underlying class divisions that threaten to erupt at any moment.",
    "Daily life in this era is marked by the impact of the Great Depression, with prices for basic necessities like bread and beer reflecting a struggle that continues to affect the lower classes. Despite this, the upper crust gathers for summer garden parties and afternoon teas, reinforcing their social status. Meanwhile, the specter of fascism in Europe looms large, creating unease among the populace. The evening air crackles not only with summer storms but also with whispered conversations about the future, each word steeped in apprehension about the world outside the manor walls."
  ],
  "note": "",
  "cost": 0.00103380585,
  "durationMs": 11284
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "The looming inheritance dispute amidst the backdrop of the Great Depression forces the manor's elite and their servants to confront their precarious social standings while a recent tragedy stirs underlying tensions.",
  "era": {
    "decade": "1930s",
    "socialStructure": "A rigid class hierarchy is exacerbated by economic hardship, with the upper class clinging to their status while the lower class faces increasing desperation and resentment."
  },
  "setting": {
    "location": "A large, stately manor house set amidst expansive grounds, featuring a mix of neoclassical and Victorian architectural styles.",
    "institution": "Manor house",
    "weather": "Overcast with occasional rain, typical for a late autumn day."
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
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock in the drawing room shows it stopped at nine o'clock.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This suggests a potential discrepancy in the time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "This indicates that the time of death may be misrepresented.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "Conflicts with witness statements regarding the time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "A faint scratch is visible on the clock face.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This may suggest tampering with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "The scratch suggests that the clock has been tampered with.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This raises questions about the reliability of the clock's time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "Dr. Mallory Finch's alibi places her at the manor during the time of death.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This creates a potential opportunity for her to tamper with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "category": "temporal",
      "description": "Direct evidence ties Dr. Mallory Finch to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[1].access_plausibility",
      "pointsTo": "This direct evidence shows Dr. Mallory Finch had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_4",
      "category": "temporal",
      "description": "Witness statements conflict with physical evidence regarding the time of death.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This adds to the uncertainty surrounding the murder time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "temporal",
      "description": "Eleanor was last seen at eight forty.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "This timeline contradicts the clock's stopped time.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock stopped at nine o'clock remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "Dr. Mallory Finch's alibi places her at the manor during the time of death.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This creates an opportunity for her to tamper with the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "The appears appeared to be functioning normally before the incident.",
      "supportsAssumption": "The murder occurred at the time indicated by the clock.",
      "misdirection": "This misleads by suggesting the appears's time was accurate, despite the evidence."
    },
    {
      "id": "rh_2",
      "description": "Witnesses claimed the functioning was trusted and had never malfunctioned before.",
      "supportsAssumption": "The murder occurred at the time indicated by the clock.",
      "misdirection": "This normally doubt about the functioning's reliability, diverting attention from the actual tampering."
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
      "clue_core_contradiction_chain"
    ],
    "mid": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_culprit_direct_dr_mallory_finch",
      "clue_4",
      "clue_5",
      "clue_fp_contradiction_step_3"
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
  "latencyMs": 8623,
  "cost": 0.0025543386
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

# Actual Prompt Record

- Run ID: `mystery-1784244374547`
- Project ID: ``
- Timestamp: `2026-07-16T23:34:14.142Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `2334b3eb759a7809`

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
    "title": "Reflections of Deceit",
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
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "spatial deception"
    }
  },
  "death_method": "stabbed with a letter opener",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp and observant investigator.",
      "private_secret": "Has a history with the victim.",
      "motive_seed": "Desire for justice.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Personal redemption.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "locked",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Respected doctor with many acquaintances.",
      "private_secret": "Involved in a scandal.",
      "motive_seed": "Potential blackmail.",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation and career.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Friend",
      "relationships": [],
      "public_persona": "Charming naval officer.",
      "private_secret": "Has feelings for Eleanor.",
      "motive_seed": "Jealousy.",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Romantic interest.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Assistant",
      "relationships": [],
      "public_persona": "Loyal companion to Dr. Finch.",
      "private_secret": "Knew about the scandal.",
      "motive_seed": "Protecting reputation.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional integrity.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "25-35",
      "role_archetype": "Acquaintance",
      "relationships": [],
      "public_persona": "Socialite with mysterious connections.",
      "private_secret": "Involved in blackmail.",
      "motive_seed": "Financial gain.",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Financial security.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Business Rival",
      "relationships": [],
      "public_persona": "Wealthy businessman.",
      "private_secret": "Competing with Dr. Finch.",
      "motive_seed": "Professional rivalry.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Business interests.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
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
      "summary": "In the midst of a tense gathering at a grand seaside hotel, Dr. Mallory Finch is found murdered with a letter opener. As Eleanor Voss investigates, she unravels a web of deceit centered around a mirror that misled witnesses about the true location of the killer."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A strategically placed mirror in the lobby created a false visual path, misleading witnesses about the murderer's location.",
      "delivery_path": [
        {
          "step": "Witnesses viewed the murder through the reflection in the mirror."
        },
        {
          "step": "The angle of the mirror distorted the actual sightline."
        }
      ]
    },
    "outcome": {
      "result": "The true murderer was able to escape undetected."
    }
  },
  "false_assumption": {
    "statement": "The murderer was seen in the lobby at the time of the murder.",
    "type": "spatial",
    "why_it_seems_reasonable": "The reflection showed a figure that appeared to match the suspect's description.",
    "what_it_hides": "The true location of the murderer was elsewhere, hidden from sight."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses claimed to have seen him in the lobby near the time of the murder.",
      "He had a known rivalry with Dr. Finch."
    ],
    "the_one_flaw": "Captain Hale's alibi, confirmed by the hotel staff, places him in the dining room at the time of the murder.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A broken vase was found near the victim, suggesting a struggle.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The vase was accidentally knocked over during a commotion after the murder.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "A letter opener was found with Hugo Vane's fingerprints.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "He had handled it earlier while discussing a business matter with Dr. Finch.",
      "resolved_in_chapter": 5
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
    "rationale": "All suspects were present in the hotel during the time of the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "The murder occurred during dinner service."
      ],
      "windows": [
        "The guests were in various locations within the hotel."
      ],
      "contradictions": [
        "Witness accounts of the murderer's location conflict with the actual sightlines."
      ]
    },
    "access": {
      "actors": [
        "All suspects had access to the lobby."
      ],
      "objects": [
        "The letter opener was part of the hotel stationery."
      ],
      "permissions": [
        "All guests had free movement within the hotel."
      ]
    },
    "physical": {
      "laws": [
        "Light refraction and reflection can distort appearances."
      ],
      "traces": [
        "Footprints leading away from the mirror towards the emergency exit."
      ]
    },
    "social": {
      "trust_channels": [
        "Witnesses believed each other's accounts due to their familiarity."
      ],
      "authority_sources": [
        "Hotel staff were considered reliable sources of information."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses reported seeing a figure in the lobby just before the murder.",
        "correction": "The figure seen was a reflection in the mirror, not the actual murderer.",
        "effect": "Eliminates the suspect seen from being the murderer.",
        "required_evidence": [
          "Witness statements about the figure in the lobby.",
          "The position of the mirror as reported by hotel staff."
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints were found leading away from the mirror.",
        "correction": "The footprints indicate someone exited the scene without being seen.",
        "effect": "Narrows suspects to those who had access to the lobby.",
        "required_evidence": [
          "Footprint analysis showing size and tread.",
          "Witness reports confirming the direction of movement."
        ],
        "reader_observable": true
      },
      {
        "observation": "The angle of the mirror was adjusted, evidenced by scratches on its surface.",
        "correction": "This indicates tampering to create a false sightline.",
        "effect": "Points to premeditation involving knowledge of the lobby layout.",
        "required_evidence": [
          "Scratches on the mirror's surface.",
          "Witnesses noting the glare from the mirror."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Re-enacting the murder scene with the mirror adjusted to its original position reveals the true sightline.",
    "knowledge_revealed": "The revealed facts are murderer, witness, and report.",
    "pass_condition": "If the reenactment shows that the murderer could not have been in the lobby, the real culprit is identified.",
    "evidence_clues": [
      "clue_core_contradiction_chain",
      "clue_mechanism_visibility_core",
      "clue_8"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The witness reports (early) clarify the reflection issue. Step 2: Footprint evidence (mid) points to the escape route. Step 3: Mirror tampering (discriminating test) exposes the setup."
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
      "test_type": "spatial deception"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed she was in the dining room at the time.",
        "supporting_clues": [
          "Witness statement from dining guests.",
          "Access records."
        ]
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Evidence shows he was in a meeting during the murder.",
        "supporting_clues": [
          "Meeting logs.",
          "Witness testimonials."
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
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
        "clue_id": "clue_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_captain_ivor_hale",
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
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a local artist whose vibrant public persona belies a dark secret that could shatter her reputation. Known for her kindness and charm, she becomes embroiled in a mystery that forces her to confront her past.",
    "publicPersona": "A charming and vibrant figure in the community, known for her artistic talent and kindness.",
    "privateSecret": "Eleanor had a secret affair with the victim, which could ruin her reputation if revealed.",
    "motiveSeed": "none",
    "motiveStrength": "weak",
    "alibiWindow": "was hosting a gallery event in the hotel lobby until 8:30 PM",
    "accessPlausibility": "easy",
    "stakes": "unveiling the truth and protecting her reputation",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with an artistic flair, often embellishing her thoughts with vivid imagery. Her speech flows gracefully, punctuated by occasional sharp observations that reveal her inner turmoil.",
    "signatureTic": "Ah, the beauty in chaos.",
    "internalConflict": "Eleanor grapples with guilt over her affair with the victim, fearing that the truth will destroy her standing in the community she cherishes.",
    "personalStakeInCase": "This crime is deeply personal for Eleanor as it threatens to unveil her hidden relationship, risking her reputation and the life she has built.",
    "paragraphs": [
      "Eleanor Voss stood in the hotel lobby, a vibrant splash of color amidst the muted tones of the evening crowd. The art gallery event she had organized was meant to showcase the beauty of local talent, but as she mingled with guests, her mind was consumed by darker thoughts. The memory of her secret affair with the victim, Dr. Mallory Finch, loomed like a shadow over her. If anyone discovered the truth, it would not only ruin her reputation but also shatter the community's perception of her as a kind-hearted artist.",
      "Though Eleanor's laughter rang out like music, it was laced with an undercurrent of tension. Her friends admired her for her artistic flair, but they knew little of the turmoil that lay beneath her charming facade. The affair was a reckless mistake, born out of passion and desperation, and now it felt like a noose tightening around her neck. She had to uncover the truth behind Mallory's death, not only to protect her own interests but also to honor the woman she had cared for deeply, despite the complexities of their relationship.",
      "As she navigated through the crowd, Eleanor's sharp observations of her fellow guests offered her a momentary escape. She found solace in the irony of their conversations, where secrets danced just beneath the surface. Perhaps, she thought, they were all hiding something, just like her. The idea of becoming an amateur sleuth thrilled her; it was a chance to reclaim her agency in a world that felt increasingly chaotic. Yet, the stakes were high, and she was painfully aware that the truth could cut deeper than any brushstroke she had ever made.",
      "With each passing hour, Eleanor's resolve grew stronger. She would not let fear dictate her actions. Unraveling the mystery of Mallory's death would mean confronting her past and the choices that had led her here. She hoped that by seeking the truth, she could find a way to redeem herself. Perhaps, in the end, she could learn to embrace both the beauty and chaos of her life, finding a new way to express her art—one that encompassed the full spectrum of human experience."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected physician, becomes the victim of a chilling murder, leaving behind a complicated web of emotions and secrets. Her unrequited love for Captain Hale adds layers to her tragic demise.",
    "publicPersona": "A respected doctor with a busy practice, often seen as a pillar of the community.",
    "privateSecret": "Mallory is secretly in love with Captain Hale, further complicating her relationship with the victim.",
    "motiveSeed": "Jealousy over the victim’s closeness with Captain Hale and her desire to protect him from heartbreak.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in her office until 9 PM, unverified",
    "accessPlausibility": "possible",
    "stakes": "the potential loss of her unrequited love and professional reputation",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory's speech is precise and clinical, reflecting her medical background. She often uses formal language but occasionally slips into an emotional tone when discussing personal matters, revealing her vulnerability.",
    "signatureTic": "It's a matter of life and death.",
    "internalConflict": "Mallory struggles with jealousy and unfulfilled love for Captain Hale, fearing that her feelings will remain unexpressed forever.",
    "personalStakeInCase": "Mallory's death is a personal tragedy that forces her to confront her feelings for Captain Hale and the implications of her professional and personal life intertwining.",
    "paragraphs": [
      "Dr. Mallory Finch had always been a pillar of strength in her community, a respected physician who commanded respect and admiration. Yet, beneath her composed exterior lay a heart burdened by unrequited love and jealousy. Her feelings for Captain Ivor Hale had grown over the years, but the presence of the victim, entwined in his life, became a bitter thorn in her side. The night of her murder, Mallory had been in her office, meticulously tending to her patients, though her mind frequently drifted to thoughts of Ivor.",
      "The irony of her situation gnawed at her. Here she was, a woman of science, grappling with emotions that felt almost primitive. She had always prided herself on her ability to remain detached, but the allure of Ivor, coupled with the pain of watching him grow closer to another, threatened to unravel her. The jealousy that had once seemed manageable now consumed her thoughts, leading her to question her motivations and desires. Would she ever find the courage to confess her feelings, or would she remain forever trapped in this cycle of longing?",
      "Mallory's meticulous nature had served her well in her medical practice, but it was a double-edged sword in her personal life. The emotional weight of her unrequited love felt insurmountable, and as the night wore on, she found herself spiraling into despair. The fear of losing Ivor to someone else fueled her jealousy, but it was also a reflection of her own insecurities. She had to protect him, she thought, from the heartache that seemed inevitable. Yet, in her desperate attempts to shield him, she failed to recognize the danger that lurked within her own heart.",
      "As the clock struck nine, Mallory's world began to unravel. The murder that would claim her life was a manifestation of her unexpressed emotions, a tragic culmination of jealousy and fear. In her final moments, she would become a victim not only of violence but of the complexities of love and longing. Her story would leave echoes in the hearts of those who knew her, a reminder that even the strongest among us can be brought low by their own desires."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a charismatic military officer whose charm masks a troubled past with the victim. As suspicion looms, he must confront the secrets that could jeopardize everything he's worked for.",
    "publicPersona": "A charming and charismatic figure, often the center of attention at social gatherings.",
    "privateSecret": "Ivor is hiding a past relationship with the victim and a secret that could tarnish his military standing.",
    "motiveSeed": "Fearing scandal from his past with the victim that could derail his career.",
    "motiveStrength": "strong",
    "alibiWindow": "was seen at the bar from 8 PM to 9 PM, but few can verify his movements afterward",
    "accessPlausibility": "possible",
    "stakes": "his military career and reputation are at stake, driving him to desperate measures.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a confident and engaging tone, often employing charm to disarm those around him. His dialogue is peppered with witty remarks and a subtle edge, reflecting his inner turmoil.",
    "signatureTic": "Ah, but what is life without a little risk?",
    "internalConflict": "Ivor is torn between his desire to protect his military career and the lingering guilt over his past relationship with the victim, which threatens to surface.",
    "personalStakeInCase": "The murder investigation strikes at the core of Ivor's life, risking not only his career but also forcing him to confront his past mistakes and their consequences.",
    "paragraphs": [
      "Captain Ivor Hale was no stranger to the spotlight. With a charm that could light up a room, he was often the center of attention at social events. Yet, beneath the polished exterior lay a man grappling with secrets that could unravel his carefully constructed life. The murder of Dr. Mallory Finch struck a chord deep within him, awakening memories of a past relationship that he had fought to bury. The fear of scandal loomed large, threatening to derail his military career and tarnish his reputation forever.",
      "Ivor's reputation as a charismatic officer had served him well, but it was a double-edged sword. His flirtations and charm had always masked the insecurities that lay beneath. As he sat at the bar, nursing a drink and attempting to project an air of nonchalance, he couldn't shake the feeling that he was being watched. With every passing moment, the weight of his past pressed down on him, a reminder of the choices he had made in the heat of passion. The thought of Mallory's death felt like a cruel twist of fate, forcing him to confront the very relationship he had tried to forget.",
      "In the days that followed, Ivor found himself caught in a web of suspicion. Whispers of his past with Mallory floated through the hotel like smoke, and he knew that the truth could shatter his reputation. Each interaction felt like a performance, a dance where he had to tread carefully to avoid revealing too much. His sardonic humor became both a shield and a weapon, allowing him to deflect questions while masking the turmoil within. Yet, the more he tried to maintain control, the more he felt the walls closing in around him.",
      "As the investigation progressed, Ivor's internal conflict deepened. He was forced to confront not only his past but also the choices that had led him to this moment. Would he risk everything to protect his military career, or would he find the courage to face the truth? The stakes had never been higher, and with each revelation, he realized that the path to redemption would require more than just charm—it would demand honesty and accountability for the choices he had made."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a glamorous socialite whose ambition drives her to the edge of desperation. As the murder investigation unfolds, her past actions threaten to unravel the life she has carefully curated.",
    "publicPersona": "A glamorous and wealthy socialite known for her high-profile relationships.",
    "privateSecret": "Beatrice once attempted to blackmail the victim over a scandal, leading to lingering resentment.",
    "motiveSeed": "Desire to eliminate the victim, who posed a threat to her pursuit of a wealthy match.",
    "motiveStrength": "moderate",
    "alibiWindow": "was mingling at the party, but some guests noted her absence from certain areas",
    "accessPlausibility": "possible",
    "stakes": "her social standing and future prospects hinge on her ability to maintain her image.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice's speech is articulate and polished, often laced with sharp wit. She has a penchant for dramatic pauses and a flair for the theatrical, making her conversations engaging and memorable.",
    "signatureTic": "It's all about the presentation, darling.",
    "internalConflict": "Beatrice grapples with the fear that her ambition has led her down a dark path, questioning whether her pursuit of wealth and status is worth the cost.",
    "personalStakeInCase": "The murder investigation threatens Beatrice's carefully curated image and her pursuit of a wealthy match, forcing her to confront the consequences of her past actions.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of glamour, a socialite whose presence commanded attention wherever she went. With a reputation for high-profile relationships and a knack for turning heads, she had built her life around the pursuit of wealth and status. Yet, beneath the surface of her polished exterior lay a history of ambition that had led her to make questionable choices. The murder of Dr. Mallory Finch cast a dark shadow over her carefully curated image, forcing Beatrice to confront the consequences of her past.",
      "In the aftermath of the murder, the whispers in the ballroom grew louder. Beatrice's mind raced, recalling the time she had attempted to blackmail Mallory over a scandal that could have ruined her career. The resentment she had harbored towards the victim now felt like a weight on her conscience, a reminder of the lengths she had gone to in pursuit of her ambitions. As she navigated the party, her polite savagery shone through, allowing her to deflect questions while keeping her true feelings hidden behind a mask of charm.",
      "With each passing moment, Beatrice felt the pressure mounting. Her alibi was shaky, and the lingering suspicion surrounding her made her skin crawl. The stakes were high; her social standing depended on maintaining an image of perfection, one that could easily crumble if the truth came to light. She found herself grappling with the fear that her ambition had led her down a dark path, questioning whether the pursuit of wealth was worth the cost of her integrity.",
      "As the investigation unfolded, Beatrice faced an internal battle between her desires and her conscience. The allure of wealth and status had driven her to make choices she now regretted, and the murder investigation forced her to reevaluate her values. Would she continue to chase after the superficial, or could she find a way to redefine her ambitions in a manner that honored her true self? The answer lay within her, and the path forward would require more than just charm—it would demand honesty and accountability for the choices she had made."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is a strong-willed hotel owner whose past affair with the victim haunts her. As the investigation unfolds, she must confront her hidden secrets and the impact they have on her life and business.",
    "publicPersona": "A strong-willed hotel owner who prides herself on maintaining high standards.",
    "privateSecret": "Sylvia had an affair with the victim years ago and is still haunted by it.",
    "motiveSeed": "Anger over the victim's intent to expose her past, which risks her hard-won reputation.",
    "motiveStrength": "weak",
    "alibiWindow": "was attending to guests until 9:15 PM, with no one seeing her leave during that time",
    "accessPlausibility": "easy",
    "stakes": "the stability of her hotel and her reputation depend on keeping her past hidden.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia’s speech is direct and authoritative, reflecting her role as a hotel owner. She often employs dry humor to mask her vulnerabilities, using it as a defense mechanism when faced with uncomfortable truths.",
    "signatureTic": "Standards must be upheld.",
    "internalConflict": "Sylvia struggles with the guilt of her past affair, fearing that its revelation could destroy both her reputation and her hotel.",
    "personalStakeInCase": "The murder investigation threatens the stability of her hotel and her hard-won reputation, forcing Sylvia to confront her past and its implications for her future.",
    "paragraphs": [
      "Sylvia Trent was a force of nature, a hotel owner whose unwavering standards had earned her respect in the community. Yet, beneath her strong-willed exterior lay a past that haunted her like a ghost. Years ago, she had indulged in a fleeting affair with Dr. Mallory Finch, a connection that had been both intoxicating and damaging. Now, as the investigation into Mallory's murder unfolded, Sylvia found herself grappling with the repercussions of a secret she had tried to bury.",
      "Her public persona was one of authority and control, but in private, Sylvia's heart raced with anxiety. The fear of exposure loomed large; if the truth about her affair came to light, it could spell disaster for her hotel and the reputation she had worked tirelessly to uphold. With each passing guest interaction, she felt the walls closing in, her dry wit becoming a shield against the mounting pressure. She would not allow her past to define her, yet the weight of her guilt threatened to crush her resolve.",
      "As the clock ticked closer to nine, Sylvia's mind raced with the implications of the investigation. Her alibi was solid, but the lingering suspicion cast a pall over her once-thriving hotel. She had built her life around maintaining high standards, but the specter of her past threatened to undo it all. Her anger at Mallory's intent to expose her was palpable, but deep down, she knew that the real battle lay within herself. Would she allow her past to dictate her future, or could she find the strength to confront the truth?",
      "In the days that followed, Sylvia's internal conflict deepened. The murder investigation forced her to confront not only her past but also the choices that had shaped her present. She yearned for stability, both in her hotel and in her life, but the truth would demand accountability. As she navigated the murky waters of suspicion, Sylvia realized that the path to redemption lay not in denial but in embracing her past and understanding its impact on her future."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a sharp-tongued journalist whose cynical outlook on life masks a deeper insecurity. As the murder investigation unfolds, he must confront his biases and reevaluate his role in a changing society.",
    "publicPersona": "A sharp-tongued journalist known for his insightful but scathing articles.",
    "privateSecret": "Hugo is secretly critical of the changes women have made in society since the war, creating tension with others.",
    "motiveSeed": "Threatened by the victim's influence on public opinion and desire to silence her.",
    "motiveStrength": "weak",
    "alibiWindow": "was interviewing guests until 8:45 PM, but his whereabouts after are unverified",
    "accessPlausibility": "possible",
    "stakes": "losing his credibility and influence in journalism if he cannot control the narrative.",
    "humourStyle": "observational",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo's speech is characterized by a sharp wit and a cynical edge. He often employs sarcasm and irony, using humor as a defense mechanism against his insecurities.",
    "signatureTic": "The world is a stage, and we're all merely players.",
    "internalConflict": "Hugo struggles with his biases against women and the changing societal norms, fearing that his views will render him obsolete.",
    "personalStakeInCase": "The murder investigation threatens to expose his biases and challenge his credibility as a journalist, forcing him to confront the changing landscape of society.",
    "paragraphs": [
      "Hugo Vane was a journalist whose sharp tongue and cynical outlook had earned him both admiration and disdain. Known for his scathing articles, he reveled in the chaos of public opinion, yet beneath his bravado lay a nagging insecurity. The murder of Dr. Mallory Finch sent ripples through the community, and for Hugo, it felt like a threat to his very existence. As the investigation unfolded, he found himself grappling with the implications of a changing society—one that he was struggling to accept.",
      "With every interview, Hugo's observational wit became a double-edged sword. He wielded his cynicism like a shield, deflecting questions that hit too close to home. The victim's influence on public opinion gnawed at him; her voice had grown louder while his felt increasingly muted. The fear of losing his credibility loomed large, and as he navigated the murky waters of the investigation, he found himself questioning his own biases. The world was changing, but was he capable of evolving alongside it?",
      "As the clock ticked closer to the truth, Hugo felt the pressure mounting. His alibi was shaky, and the whispers of suspicion made him uneasy. The investigation threatened to expose not only the murderer but also his own inadequacies. In a society that was increasingly elevating women's voices, Hugo's critical stance felt increasingly anachronistic. He had to confront the reality that his views, once considered insightful, were now viewed as relics of a bygone era.",
      "In the end, Hugo's internal conflict became a journey of self-discovery. The murder investigation forced him to reevaluate his role in a changing society and confront the biases that had shaped his worldview. Would he cling to his cynicism, or could he find a way to embrace the new narrative unfolding before him? The answers lay within him, and as he navigated the complexities of the case, he realized that the true story was not just about the murder but also about the evolution of a man grappling with his place in a world that was shifting beneath his feet."
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
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel with Art Deco elegance, shrouded in mystery and tension.",
    "visualDescription": "The hotel's façade features streamlined curves and geometric patterns, with large glass windows reflecting the churning sea. Inside, the lobby boasts polished marble floors, ornate chandeliers, and plush velvet furnishings, while narrow hallways lead to more intimate spaces. Ocean-facing balconies, adorned with wrought iron railings, offer glimpses of the turbulent waves crashing against the shore.",
    "atmosphere": "A feeling of unease permeates the hotel, amplified by the distant sound of thunder and the smell of dampness in the air.",
    "paragraphs": [
      "The Grand Seaside Hotel stands majestically against the backdrop of a tumultuous sky, its Art Deco lines melding seamlessly with the rugged coastline. The lobby exudes an air of faded glamour, with the scent of salt and dampness mingling with the rich aroma of tobacco from the lounge. Guests, draped in heavy coats, murmur in hushed tones while the occasional crack of thunder reverberates through the marble corridors, heightening the sense of anticipation in the air.",
      "As the rain begins to fall in earnest, guests retreat to the confines of the hotel, seeking warmth and refuge. The flickering gas lamps cast dancing shadows on the walls, revealing hidden nooks where whispered conversations take place. The atmosphere is thick with secrets, the sound of footsteps echoing in the narrow hallways as wary guests navigate the labyrinthine layout, ever mindful of the isolation that the storm imposes.",
      "With each passing hour, the tension mounts, fueled by the recent wartime experiences that linger in the minds of all present. The hotel, once a sanctuary by the sea, now feels like a gilded cage, its beauty overshadowed by an undercurrent of suspicion and fear. Outside, the relentless waves crash against the cliffs, echoing the turmoil within, while the distant sound of a radio crackles softly, broadcasting news that only deepens the unease."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with intermittent rain, creating a moody, damp environment.",
    "timeFlow": "A night of mounting tension, where every hour brings new revelations.",
    "mood": "Tense and uneasy, heightened by recent wartime experiences and rumors of espionage.",
    "eraMarkers": [
      "Art Deco architecture and furnishings",
      "Flickering gas lamps and radios broadcasting news",
      "Heavy coats and rationed wartime clothing",
      "Whispers of espionage and wartime secrets"
    ],
    "sensoryPalette": {
      "dominant": "Dampness and salt air",
      "secondary": [
        "Polished marble and tobacco smoke",
        "Flickering gaslight shadows"
      ]
    },
    "paragraphs": [
      "The air in the hotel is thick with the scent of dampness and the briny tang of the sea, as waves crash against the rocky shore. Flickering gas lamps cast a warm glow against the polished marble floors, while muted conversations drift through the air like wisps of fog. The sound of distant thunder punctuates the atmosphere, creating an uneasy backdrop to the unfolding drama within.",
      "As the storm intensifies, the hotel becomes a sanctuary of secrets, with shadows dancing along the walls, whispering of hidden truths. The flicker of candlelight in the corners reveals glimpses of anxious faces, each guest harboring their own fears and suspicions. Outside, the relentless rain drums against the windows, echoing the tension that grips the hearts of all who seek refuge within."
    ]
  },
  "keyLocations": [
    {
      "id": "grand_lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "Expansive marble floors, elegant chandeliers, plush velvet seating, and art deco furnishings.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate chandeliers",
          "plush velvet armchairs",
          "art deco motifs",
          "large glass windows"
        ],
        "sounds": [
          "murmurs of conversation",
          "footsteps on marble",
          "crackling gas lamps",
          "distant thunder",
          "clinking of glasses"
        ],
        "smells": [
          "salt air mingling with dampness",
          "tobacco smoke",
          "freshly polished wood",
          "old leather",
          "faint perfume"
        ],
        "tactile": [
          "cool marble underfoot",
          "soft velvet upholstery",
          "smooth brass fixtures",
          "chill of the coastal air",
          "roughness of the stone fireplace"
        ]
      },
      "accessControl": "Open to all guests; staff access for cleaning and maintenance before dawn.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "rain-streaked windows",
            "muffled reflections on marble"
          ],
          "sounds": [
            "steady drumming on the roof",
            "water trickling in the gutters",
            "distant waves crashing"
          ],
          "smells": [
            "damp earth",
            "mildew",
            "fresh coffee brewing"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat pewter light",
            "shadows pooling in corners",
            "glistening surfaces"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the creak of old timbers",
            "soft laughter from the bar"
          ],
          "smells": [
            "old books",
            "beeswax",
            "woodsmoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering in sconces",
            "long shadows across the floor",
            "glimmers of polished brass"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "distant voices from the dining room",
            "clinking of cutlery"
          ],
          "smells": [
            "candles melting",
            "dinner aromas wafting",
            "fresh linen"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby is a breathtaking sight, with its expansive marble floors and elegant chandeliers that cast soft light over the plush velvet seating. Guests mill about, their conversations hushed, as the sound of distant thunder rumbles outside. The air is thick with the scent of salt mingling with the rich aroma of tobacco smoke, creating an intoxicating blend that reflects the tension simmering beneath the surface. Here, secrets are exchanged in quiet corners, the flickering gas lamps casting shadows that dance like specters upon the walls.",
        "As the storm rages outside, the lobby becomes a refuge for those seeking solace from the tempest. The cool marble underfoot contrasts with the warmth of the plush upholstery, inviting weary travelers to take a moment to breathe. Yet, the ambiance is laden with an unshakeable sense of unease, as whispers of espionage and wartime secrets ripple through the air, weaving a web of intrigue that binds all who enter."
      ]
    },
    {
      "id": "private_balcony",
      "name": "Private Balcony",
      "type": "exterior",
      "purpose": "Secluded space for private conversations",
      "visualDetails": "Wrought iron railings, sweeping ocean views, and flower pots with coastal plants.",
      "sensoryDetails": {
        "sights": [
          "ocean waves crashing below",
          "clouds swirling overhead",
          "flower pots with coastal plants",
          "distant ships on the horizon",
          "flickering lights from neighboring homes"
        ],
        "sounds": [
          "crashing waves",
          "whistling wind",
          "thunder rumbling in the distance",
          "seagulls calling",
          "soft rustle of leaves"
        ],
        "smells": [
          "salty sea air",
          "wet earth",
          "fresh blooms",
          "damp wood",
          "faint smoke from distant fires"
        ],
        "tactile": [
          "roughness of wrought iron railings",
          "cool breeze against skin",
          "dampness of the stone floor",
          "smoothness of flower petals",
          "chill from the evening air"
        ]
      },
      "accessControl": "Access restricted to specific guests; monitored by hotel staff.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops clinging to railings",
            "grey clouds obscuring the horizon",
            "damp flower petals"
          ],
          "sounds": [
            "steady patter of rain",
            "splashing waves",
            "soft rustling of leaves"
          ],
          "smells": [
            "freshly washed earth",
            "petrichor",
            "wet flowers"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dulling colors",
            "choppy waves",
            "darkening sky"
          ],
          "sounds": [
            "wind howling softly",
            "distant thunder",
            "the creak of the balcony"
          ],
          "smells": [
            "damp air",
            "seaweed",
            "faint hints of smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "sunset casting golden hues",
            "stars emerging in the sky",
            "gentle waves lapping"
          ],
          "sounds": [
            "soft whispers of conversation",
            "the distant sound of laughter",
            "water lapping against the rocks"
          ],
          "smells": [
            "evening blooms",
            "salted air",
            "smoky barbecue from nearby homes"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Private Balcony offers a breathtaking view of the tumultuous sea, where waves crash against the rocky shore, sending sprays of salty mist into the air. Wrought iron railings frame the space, adorned with flower pots that sway gently in the coastal breeze. Here, the sound of crashing waves mingles with the distant rumble of thunder, creating an atmosphere thick with tension. The air is heavy with the scent of salt and damp earth, as whispered conversations unfold in the shadows, cloaked in secrecy.",
        "As the storm brews, the balcony becomes a refuge for clandestine meetings, the cool breeze brushing against heated skin. The roughness of the iron railings contrasts sharply with the softness of the flowers, a reminder of the beauty that exists even amidst turmoil. Yet, the isolation of the balcony, set apart from the bustling hotel, fosters a sense of unease, as the waves below echo the secrets shared in hushed tones."
      ]
    },
    {
      "id": "library",
      "name": "Library",
      "type": "interior",
      "purpose": "Quiet space for reading and reflection",
      "visualDetails": "Dark wood shelves filled with books, plush armchairs, and a crackling fireplace.",
      "sensoryDetails": {
        "sights": [
          "dark wood shelves lined with books",
          "flickering firelight",
          "plush armchairs",
          "ornate rugs",
          "heavy curtains"
        ],
        "sounds": [
          "crackling fireplace",
          "soft rustle of pages",
          "whispers of conversation",
          "distant thunder",
          "the ticking of a clock"
        ],
        "smells": [
          "old leather and paper",
          "smoky embers",
          "dampness in the air",
          "faint scent of lavender",
          "polished wood"
        ],
        "tactile": [
          "soft upholstery of armchairs",
          "coolness of the stone floor",
          "roughness of book spines",
          "warmth of the fire",
          "thick texture of rugs"
        ]
      },
      "accessControl": "Open to all guests during the day; locked at night.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through heavy curtains",
            "raindrops on window panes",
            "shadows deepening"
          ],
          "sounds": [
            "steady rain pattering on the roof",
            "occasional thunder",
            "the rustle of pages"
          ],
          "smells": [
            "wet paper",
            "moldy books",
            "smoky warmth from the fireplace"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light illuminating the room",
            "dust motes floating in the air",
            "stillness of the shelves"
          ],
          "sounds": [
            "silence punctuated by the ticking clock",
            "soft whispers",
            "the creak of wood"
          ],
          "smells": [
            "old books",
            "beeswax polish",
            "faint traces of smoke"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight casting flickering shadows",
            "golden glow of lamps",
            "books stacked haphazardly"
          ],
          "sounds": [
            "the crackle of the fire",
            "soft laughter from outside",
            "the ticking of a clock"
          ],
          "smells": [
            "burning wood",
            "freshly brewed tea",
            "the musty scent of old books"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, with its dark wood shelves filled to the brim with books, is a sanctuary of quiet contemplation. Plush armchairs invite guests to sink into their depths, while the crackling fireplace casts a warm glow over the room. The air is thick with the scent of old leather and paper, mingling with the faint aroma of lavender from a nearby vase. Outside, thunder rumbles ominously, echoing the tension that lingers within these walls, while the soft rustle of pages turning creates a soothing backdrop to whispered secrets.",
        "As rain patters against the windows, the library transforms into a haven for those seeking solace from the storm. The coolness of the stone floor contrasts with the warmth of the fire, as guests huddle in their corners, lost in thought or conversation. Yet, the atmosphere remains charged, as unspoken fears and suspicions drift through the air, weaving a tapestry of intrigue that binds all who enter."
      ]
    },
    {
      "id": "dining_room",
      "name": "Dining Room",
      "type": "interior",
      "purpose": "Formal dining space for guests",
      "visualDetails": "Long tables set with fine china, crystal glassware, and silver cutlery, with large windows overlooking the sea.",
      "sensoryDetails": {
        "sights": [
          "long tables adorned with white linens",
          "gleaming crystal glassware",
          "elegant silver cutlery",
          "large windows framing the sea",
          "flickering candlelight"
        ],
        "sounds": [
          "clinking of cutlery",
          "soft murmur of conversation",
          "the rustle of napkins",
          "the sound of wine being poured",
          "waves crashing outside"
        ],
        "smells": [
          "aromas of roasted meat",
          "fresh bread baking",
          "faint hints of wine",
          "candle wax melting",
          "cooked vegetables"
        ],
        "tactile": [
          "smoothness of polished wood tables",
          "coolness of glassware",
          "softness of linen napkins",
          "warmth of candlelight",
          "rough texture of bread crust"
        ]
      },
      "accessControl": "Open for breakfast, lunch, and dinner; reserved for hotel guests only.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light creeping through clouds",
            "table settings glistening with raindrops",
            "wet window panes"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "clinking of breakfast dishes",
            "muffled laughter from guests"
          ],
          "smells": [
            "freshly brewed coffee",
            "baking pastries",
            "faint scent of dampness"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light filtering through clouds",
            "shadows stretching across tables",
            "stillness of the room"
          ],
          "sounds": [
            "soft conversation",
            "the clinking of glasses",
            "the creak of chairs"
          ],
          "smells": [
            "aromas of simmering sauces",
            "fresh herbs",
            "the scent of wine"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "golden hues from the setting sun",
            "glimmering glassware"
          ],
          "sounds": [
            "laughter and conversation",
            "the pop of a cork",
            "the clinking of glasses"
          ],
          "smells": [
            "aromas of grilled meats",
            "freshly baked bread",
            "the scent of dessert"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Dining Room is a grand affair, with long tables elegantly set for the evening meal. Fine china and crystal glassware catch the light, while the scent of roasted meat wafts through the air, mingling with the faint aroma of freshly baked bread. Guests, dressed in their best, engage in soft conversation, their laughter punctuated by the clinking of cutlery and glasses. Yet, beneath the surface, the tension is palpable, as eyes dart toward the large windows overlooking the turbulent sea, where the storm mirrors the unrest within.",
        "As evening approaches, the flickering candlelight casts a warm glow over the dining room, transforming it into a haven of elegance. The sound of waves crashing outside provides a rhythmic backdrop to the soft murmur of conversations, while the aromas of delectable dishes tantalize the senses. However, the atmosphere is charged with anticipation, as whispered secrets and furtive glances hint at the intrigue that lies just beneath the surface, waiting to be uncovered."
      ]
    }
  ],
  "note": "",
  "cost": 0.0024646577999999997,
  "durationMs": 41262
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1942,
    "month": "March",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "March",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "cool temperatures around 45°F"
    ],
    "daylight": "Days are gradually lengthening, with daylight lasting until about 6:30 PM.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded.",
    "holidays": [
      "St. Patrick's Day (March 17)"
    ],
    "seasonalActivities": [
      "attending local theater productions",
      "strolling through city parks to see early spring blooms",
      "participating in community events to support war efforts"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "white dress shirt with a stiff collar",
        "a tie featuring geometric patterns"
      ],
      "casual": [
        "tweed jacket with elbow patches",
        "cotton trousers",
        "button-up flannel shirt"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "A-line dress with a cinched waist and knee-length hem",
        "satin gloves",
        "pearl necklace"
      ],
      "casual": [
        "blouse with puffed sleeves",
        "high-waisted skirt",
        "cardigan sweater"
      ],
      "accessories": [
        "cloche hat",
        "silk scarf",
        "nylon stockings"
      ]
    },
    "trendsOfTheMoment": [
      "utilitarian fashion due to fabric rationing",
      "bold patterns in clothing",
      "increased use of bright colors to uplift spirits"
    ],
    "socialExpectations": [
      "men are expected to be the primary breadwinners",
      "women increasingly taking on roles in factories and offices",
      "social gatherings now include discussions about the war"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Battle of the Atlantic continues to escalate with increased U-boat activity",
      "The United States begins to mobilize for war with troop deployments to Europe",
      "The Lend-Lease Act is in full effect, supporting Allied nations"
    ],
    "politicalClimate": "Tensions are high as the U.S. grapples with its role in the war, balancing support for Allies with domestic challenges.",
    "economicConditions": "Rationing is in place, affecting everything from food to clothing, leading to black markets and inflation.",
    "socialIssues": [
      "discrimination against Japanese Americans",
      "women's rights in the workforce",
      "class disparities highlighted by war efforts"
    ],
    "internationalNews": [
      "Germany's continued advances in Europe",
      "Japan's aggressive expansion in the Pacific",
      "Rumors of espionage in major cities"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - 'White Christmas'",
        "Glenn Miller - 'In the Mood'",
        "Doris Day - 'Sentimental Journey'"
      ],
      "films": [
        "Casablanca",
        "The Maltese Falcon",
        "Mrs. Miniver"
      ],
      "theater": [
        "The Glass Menagerie",
        "The Man Who Came to Dinner",
        "The Skin of Our Teeth"
      ],
      "radio": [
        "The Shadow",
        "Gunsmoke",
        "The Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Fountainhead by Ayn Rand",
        "The Little Prince by Antoine de Saint-Exupéry",
        "The Thin Man by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "romantic fiction",
        "war literature"
      ]
    },
    "technology": {
      "recentInventions": [
        "the proximity fuse for artillery",
        "early radar systems for spotting incoming aircraft",
        "the first jet engine prototypes"
      ],
      "commonDevices": [
        "battery-operated radios",
        "manual typewriters",
        "film cameras"
      ],
      "emergingTrends": [
        "women entering technical fields due to wartime needs",
        "increased use of military technology in civilian life",
        "development of wartime propaganda films"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "Movie ticket: one shilling",
        "Newspaper: three pence"
      ],
      "commonActivities": [
        "attending neighborhood rallies for war support",
        "volunteering for local charities",
        "gathering at cafés to discuss news"
      ],
      "socialRituals": [
        "weekly family dinners",
        "community dances to boost morale",
        "tea parties to share rationing tips"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing awareness of class divides exacerbated by the war",
      "nobility of workers celebrated in media",
      "middle class striving for stability amid uncertainty"
    ],
    "gender": [
      "women's contributions to the workforce being increasingly recognized",
      "traditional gender roles beginning to shift",
      "discussions about gender equality becoming more prominent"
    ],
    "race": [
      "racial segregation persists in many areas",
      "increased visibility of African American contributions to the war effort",
      "rising awareness of civil rights issues"
    ],
    "generalNorms": [
      "patriotism is prevalent, with support for the war seen as a civic duty",
      "suspicion towards foreigners, especially those from Axis powers",
      "social gatherings often centered around war news and morale boosting"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of wet earth and moss, a reminder of the rain that has swept through the city, leaving everything glistening under the muted light.",
    "Distant sounds of sirens and the low rumble of military vehicles passing by serve as a reminder of the ongoing war, creating an undercurrent of tension that fills the hotel lobby.",
    "The flickering light of a radio in the corner broadcasts news of the war, punctuated by the hushed conversations of guests discussing the latest rumors of espionage, heightening the atmosphere of unease."
  ],
  "paragraphs": [
    "In March of 1942, the city is awakening from winter’s grasp, but the joy of spring is overshadowed by the somber realities of war. The overcast skies and intermittent rain cast a pall over daily life, with the damp chill seeping into the bones of those who walk the streets. As patrons gather at the hotel, they find solace in the warmth of the lobby, yet the weight of wartime news lingers in the air. With each crackle of the radio, tales of distant battles and the threat of espionage draw anxious glances and hushed whispers, creating a tense atmosphere that envelops everyone present.",
    "Fashion during this time reflects both the practicality demanded by wartime and a desire for beauty amidst hardship. Men don double-breasted navy suits, crisp white shirts, and patterned ties, aiming to maintain a polished appearance despite fabric rationing. Women embrace A-line dresses with cinched waists, often accessorized with cloche hats and pearls, signaling a steadfast commitment to elegance. The streets, though drenched in rain, are vibrant with colors as bold patterns emerge in clothing, a subtle resistance to the drabness of war—a visual echo of hope and resilience.",
    "Daily life in March 1942 is marked by a blend of community spirit and the strain of social changes wrought by the war. Prices reflect the tightening grip of rationing; a loaf of bread can be had for four pence, while a ticket to the cinema—a cherished escape—costs a shilling. Social rituals become increasingly important, with families gathering for weekly dinners and community dances offering a much-needed reprieve from the relentless news cycle. Conversations flow about the war, with a growing recognition of women's vital roles in the workforce, challenging traditional expectations and reshaping societal norms."
  ],
  "note": "",
  "cost": 0.0011165781,
  "durationMs": 11626
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A tense gathering at a grand seaside hotel, where the specter of wartime anxiety and emerging Cold War tensions forces a disparate group of guests and staff to confront their secrets under the watchful eyes of a distorted reflection.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Class dynamics are strained as women increasingly enter the workforce, while the looming threat of espionage creates a shared atmosphere of suspicion and unease among the guests."
  },
  "setting": {
    "location": "A grand seaside hotel featuring Art Deco architecture",
    "institution": "Hotel",
    "weather": "Overcast with intermittent rain, creating a moody, damp environment."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an optical method, where a mirror-and-lens reflection falsified a witness's sightline across the room."
}

### LOCKED_FACTS
[
  {
    "id": "mirror_angle",
    "value": "thirty degrees",
    "description": "The angle of the mirror that creates the false reflection."
  },
  {
    "id": "light_source",
    "value": "twenty feet",
    "description": "The distance from the light source to the mirror."
  },
  {
    "id": "murder_time",
    "value": "ten minutes past nine",
    "description": "The exact time of the murder, as indicated by the hotel clock."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 15,
  "countsByPlacement": {
    "early": 5,
    "mid": 9,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 14,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_core_contradiction_chain",
      "placement": "early",
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
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_6",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
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
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_culprit_direct_captain_ivor_hale",
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
      "id": "clue_fp_contradiction_step_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
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

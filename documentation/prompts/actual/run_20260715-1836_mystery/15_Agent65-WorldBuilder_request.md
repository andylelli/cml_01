# Actual Prompt Record

- Run ID: `mystery-1784140602570`
- Project ID: ``
- Timestamp: `2026-07-15T18:43:49.794Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `ec31fde2a0b2ea84`

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
    "title": "Echoes of Identity",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A grand seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "acoustic manipulation"
    }
  },
  "death_method": "strangled with a silk scarf",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charming socialite",
      "private_secret": "Involved in an illicit affair",
      "motive_seed": "Jealousy",
      "motive_strength": "high",
      "alibi_window": "9:00 PM - 10:00 PM",
      "access_plausibility": "low",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Reputation at risk",
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
      "private_secret": "Had a hidden rivalry with Eleanor",
      "motive_seed": "Professional jealousy",
      "motive_strength": "moderate",
      "alibi_window": "9:30 PM - 10:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical equipment"
      ],
      "behavioral_tells": [
        "Nervous when discussing Eleanor"
      ],
      "stakes": "Career reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Suspect",
      "relationships": [
        "Acquaintance of the victim"
      ],
      "public_persona": "Military officer",
      "private_secret": "Was in love with Eleanor",
      "motive_seed": "Unrequited love",
      "motive_strength": "high",
      "alibi_window": "9:00 PM - 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel staff access"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Emotional turmoil",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Suspect",
      "relationships": [
        "Competes with Eleanor for social standing"
      ],
      "public_persona": "Ambitious social climber",
      "private_secret": "Holds a grudge against Eleanor",
      "motive_seed": "Desire for status",
      "motive_strength": "high",
      "alibi_window": "9:00 PM - 10:00 PM",
      "access_plausibility": "low",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Eager to shift blame"
      ],
      "stakes": "Social position",
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
        "Close friend of Eleanor"
      ],
      "public_persona": "Supportive confidante",
      "private_secret": "Knows about the affair",
      "motive_seed": "Protective of Eleanor",
      "motive_strength": "low",
      "alibi_window": "9:00 PM - 10:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Personal belongings"
      ],
      "behavioral_tells": [
        "Upset during questioning"
      ],
      "stakes": "Friendship",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-50",
      "role_archetype": "Detective",
      "relationships": [
        "Investigator"
      ],
      "public_persona": "Acclaimed detective",
      "private_secret": "Struggling with past failures",
      "motive_seed": "Desire to prove himself",
      "motive_strength": "high",
      "alibi_window": "N/A",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Investigation tools"
      ],
      "behavioral_tells": [],
      "stakes": "Professional reputation",
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
      "summary": "Eleanor Voss, a vibrant socialite, is found murdered in her hotel room during a foggy evening. As tensions rise and allegiances shift among the guests, Detective Hugo Vane must unravel a web of lies and hidden identities, revealing that the true nature of the murder is concealed behind a clever acoustic ruse."
    },
    "accepted_facts": [
      "Eleanor was last seen at dinner with friends.",
      "The gramophone was found in her room playing a fresh record.",
      "Witnesses heard music coming from her room around the time of death."
    ],
    "inferred_conclusions": [
      "Eleanor was alive when the gramophone started playing.",
      "Someone tampered with the gramophone to create an alibi."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "A gramophone recording played in a soundproof room masks the actual time of murder, creating the illusion that Eleanor was alive during the music.",
      "delivery_path": [
        {
          "step": "The murderer plays a gramophone in the soundproof room to fabricate an alibi."
        }
      ]
    },
    "outcome": {
      "result": "The gramophone's recording leads the investigation astray, allowing the true murderer to escape suspicion."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss was murdered by someone she knew well.",
    "type": "identity",
    "why_it_seems_reasonable": "The close relationships among the guests suggest personal motives.",
    "what_it_hides": "The murderer is someone who took advantage of Eleanor's trust."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses claim they saw Ivor arguing with Eleanor shortly before her death.",
      "Ivor had access to Eleanor's room."
    ],
    "the_one_flaw": "Ivor's alibi is corroborated by multiple witnesses who placed him in the lobby at the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Footprints leading away from Eleanor's room.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "The footprints belong to a hotel staff member who was delivering a message.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A torn piece of Eleanor's scarf found near the gramophone.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "Eleanor had been wearing the scarf earlier in the evening, and it snagged on a door.",
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
    "rationale": "All suspects were present at the hotel during the murder, and no outsiders had access."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Eleanor last seen at dinner at 8:30 PM",
        "The gramophone was playing music at 9:15 PM"
      ],
      "windows": [
        "Murder window between 9:00 PM and 10:00 PM"
      ],
      "contradictions": [
        "Witnesses heard music at 9:15 PM, but Eleanor's death was at 9:10 PM."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "Gramophone",
        "Eleanor's room",
        "Soundproofing materials"
      ],
      "permissions": [
        "Hotel staff had access to all guest rooms"
      ]
    },
    "physical": {
      "laws": [
        "Sound cannot travel through soundproofing",
        "Acoustic properties of the room distort sound"
      ],
      "traces": [
        "Tampering marks on the gramophone"
      ]
    },
    "social": {
      "trust_channels": [
        "Friendships with Eleanor create misplaced trust"
      ],
      "authority_sources": [
        "Hotel management confirms guest alibis"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The gramophone was found in Eleanor's room playing a fresh record.",
        "correction": "The gramophone was used to create an alibi for the murderer.",
        "effect": "Narrows suspect pool to those who could access the gramophone.",
        "required_evidence": [
          "Witness statements confirm music played around the time of death.",
          "The gramophone's needle shows recent usage."
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses heard music coming from Eleanor's room around 9:15 PM.",
        "correction": "The timing of the music suggests the murder occurred just before it.",
        "effect": "Narrows murder window to before 9:15 PM.",
        "required_evidence": [
          "Time of music verified by multiple witnesses.",
          "Footprints leading to the gramophone were found."
        ],
        "reader_observable": true
      },
      {
        "observation": "Tampering marks are found on the gramophone's mechanism.",
        "correction": "The gramophone was altered to play automatically at a specific time.",
        "effect": "Eliminates suspects without knowledge of the gramophone's workings.",
        "required_evidence": [
          "Mechanism inspected reveals recent adjustments.",
          "Witness accounts confirm the gramophone had been tampered with."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Testing the gramophone's mechanism proves only Dr. Mallory Finch had the mechanical knowledge to tamper with it.",
    "knowledge_revealed": "The revealed facts are gramophone, alibi, and fresh.",
    "pass_condition": "If only Dr. Mallory can prove the tampering method, she is the murderer.",
    "evidence_clues": [
      "clue_7",
      "clue_5",
      "clue_culprit_direct_1",
      "clue_1",
      "clue_2"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The gramophone's recent use and witness statements (early) establish tampering. Step 2: Music timing and footprints (mid) narrow the murder window. Step 3: Tampering marks and technical knowledge test (discriminating test) identify Dr. Mallory as the culprit."
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
      "test_type": "mechanical proof"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witnesses corroborate his alibi in the lobby.",
        "supporting_clues": [
          "clue_hallway_1",
          "clue_hallway_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Physical evidence shows her movements were elsewhere.",
        "supporting_clues": [
          "clue_hallway_3",
          "clue_hallway_4"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her panic and alibi during the questioning clear her.",
        "supporting_clues": [
          "clue_hallway_5",
          "clue_hallway_6"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 9:00 PM - 10:00 PM",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence"
    },
    "identity_rules": [
      {
        "character_name": "Eleanor Voss",
        "revealed_in_act": 3,
        "before_reveal_reference": "the victim",
        "after_reveal_reference": "Eleanor"
      }
    ],
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
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Investigation findings"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_6",
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
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statements"
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
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a prominent socialite, exuded charm and sophistication, yet her life was a tapestry woven with secrets and financial despair.",
    "publicPersona": "Eleanor was the epitome of grace, hosting opulent soirées that dazzled the elite and cemented her family's social standing. Her philanthropic efforts painted her as benevolent, a woman of the people, but beneath the surface lurked a desperation to maintain appearances amidst impending ruin.",
    "privateSecret": "Despite her glamorous facade, Eleanor concealed the truth about her family's dire financial situation. The weight of her secret affair further complicated her life, threatening the very legacy she sought to protect.",
    "motiveSeed": "Her untimely death would erase the threat posed by her knowledge of her family's sordid dealings, liberating those entangled in their web of deception.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was last seen mingling with guests at her own lavish party, a crowded affair that provided ample opportunity for mischief.",
    "accessPlausibility": "easy",
    "stakes": "The stakes were nothing less than her family's reputation, financial security, and the very identity that Eleanor had painstakingly constructed.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor spoke with a melodic lilt, often punctuating her sentences with a soft laugh or a knowing smile. Her words were carefully chosen, reflecting her social acumen, yet they sometimes dripped with an underlying sharpness when discussing rivals or detractors.",
    "signatureTic": "Oh, darling, you simply must understand...",
    "internalConflict": "Eleanor grappled with the fear that her efforts to sustain her family's image might ultimately lead to their downfall, a conflict that left her feeling increasingly isolated.",
    "personalStakeInCase": "This crime threatened not only her life but the very legacy of her family, which she had desperately tried to uphold.",
    "paragraphs": [
      "Eleanor Voss was a name that echoed through the grand halls of the seaside hotel, a beacon of charm and elegance. Guests would flock to her parties, drawn by the allure of her laughter and the promise of social climbing. Yet, behind her polished smile lay a woman burdened by the weight of her family's crumbling empire. With every toast raised to her health, Eleanor felt the tightening noose of financial ruin, a truth she fiercely guarded.",
      "In the dim light of her lavish ballroom, Eleanor's laughter often masked her anxiety. She had mastered the art of socializing, weaving through conversations with an effortless grace that belied her inner turmoil. The whispers of her family's financial troubles danced just out of earshot, but she was acutely aware of the storm brewing beneath the surface. More troubling was the secret affair she had been conducting, a gamble that threatened to unravel everything she held dear if discovered.",
      "As she mingled with the guests, her heart raced at the thought of what her death might mean for those ensnared in her family's secrets. It was a morbid notion, yet one that pulled at her conscience. Would her demise free them from the shackles of her influence, or would it cast them into deeper shadows? The duality of her existence gnawed at her; she was both the protector and the threat, a paradox that only deepened her isolation amidst the throng of admirers.",
      "Eleanor's life was a delicate balancing act, and with each passing moment, she felt the ground shifting beneath her feet. The stakes had never been higher; not only was her reputation at risk, but her very identity was bound to the family's legacy. As the clock ticked closer to midnight, she could not shake the feeling that the end was nigh, a specter lurking in the corners of her opulent world."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a physician with a sharp tongue and sharper intellect, navigated the complexities of her past while grappling with her present entanglements.",
    "publicPersona": "As a respected doctor, Mallory commanded authority in the hotel clinic, her no-nonsense demeanor earning her the trust of patients and peers alike. Her reputation as a competent physician was marred only by her brusque interactions, often leaving patients feeling more like cases than individuals.",
    "privateSecret": "Behind her stoic facade lay a tumultuous history; once romantically involved with Eleanor's father, Mallory's connection to the Voss family was fraught with tension and unresolved feelings.",
    "motiveSeed": "Resentment simmered beneath her professional exterior, fueled by the mistreatment she had received from Eleanor's family and the potential for financial gain should she inherit from them.",
    "motiveStrength": "moderate",
    "alibiWindow": "At the time of the murder, Mallory was in the hotel clinic, treating a patient—a fact that could either exonerate her or deepen the suspicion surrounding her.",
    "accessPlausibility": "possible",
    "stakes": "Her professional reputation hung in the balance, intertwined with the potential financial windfall that could come from Eleanor's untimely demise.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory's speech was marked by a clipped efficiency, her sentences often devoid of embellishment. When pressed, she would occasionally slip into sardonic remarks, revealing a sharp wit that contrasted with her otherwise serious demeanor.",
    "signatureTic": "It’s not rocket science, you know.",
    "internalConflict": "Mallory wrestled with the resentment she felt towards the Voss family, torn between her desire for justice and the lingering affection she held for Eleanor's father.",
    "personalStakeInCase": "This case was not merely professional; it was a personal reckoning with her past entanglements and the shadow they cast over her present.",
    "paragraphs": [
      "Dr. Mallory Finch moved through the hotel with a purpose, her presence commanding attention even in the most crowded of spaces. As a physician, she was accustomed to the weight of responsibility that came with her profession, yet the air of the seaside hotel felt charged with an uncharacteristic tension. She was there to heal, but the specter of Eleanor Voss loomed large, a reminder of the family that had once been intertwined with her own.",
      "Her reputation as a doctor was well-earned; patients praised her for her no-nonsense approach. Yet, beneath the surface lay a tumult of emotions, particularly regarding Eleanor's family. Long ago, she had shared a passionate affair with Eleanor's father, a liaison that had turned sour amidst the family's disdain for her. Now, as she treated a patient in the hotel clinic, memories of love and loss mingled with the bitter taste of resentment.",
      "Mallory's mind raced as she considered the implications of Eleanor's death. Would it serve as a twisted form of justice for the years of mistreatment she had endured? Or would it merely deepen the wounds of her past? The thought of potential inheritance loomed like a dark cloud, tempting her with promises of financial security but also calling into question her integrity as a physician.",
      "As the hours ticked by, Mallory found herself caught in a web of conflicting emotions, her internal struggle mirroring the chaos unfolding around her. With each passing moment, the stakes grew higher, not just for Eleanor but for herself. This was more than a case; it was a reckoning, a chance to confront the ghosts of her past and redefine her future."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, bore the scars of war both physically and mentally, haunted by memories that threatened to unseat his stoic exterior.",
    "publicPersona": "Ivor presented himself as a paragon of duty and honor, often regaling listeners with tales of his military exploits. His presence was one of strength, a man who had faced the fiercest of battles and emerged unscathed, at least on the surface.",
    "privateSecret": "Beneath the veneer of the stoic captain lay a man grappling with the demons of PTSD, a condition he concealed from the world, fearful of the stigma that would accompany any admission of weakness.",
    "motiveSeed": "The fear that Eleanor's ambition could expose his wartime failures gnawed at him, threatening to unravel the honor he had fought so hard to uphold.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor was in the hotel bar, engaged in conversation with guests, a plausible cover for his whereabouts at the time of the murder.",
    "accessPlausibility": "possible",
    "stakes": "His honor and mental stability were at stake; exposure of his past could lead to public disgrace, a fate he could not bear to contemplate.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor spoke with a measured cadence, often punctuating serious discussions with dry, self-deprecating humor that belied the pain lurking beneath. He had a tendency to reminisce, his stories often meandering yet imbued with a sense of nostalgia.",
    "signatureTic": "Well, I suppose that's the price of honor, isn’t it?",
    "internalConflict": "Ivor battled with the weight of his past, torn between the pride of his service and the shame of his hidden struggles, creating a chasm between his public persona and private reality.",
    "personalStakeInCase": "This case was a personal crucible, forcing him to confront the shadows of his past while protecting the honor he had fought to preserve.",
    "paragraphs": [
      "Captain Ivor Hale stood at the bar of the hotel, a stoic figure amidst the clamor of laughter and revelry. To the outside world, he was a man of honor, a retired naval officer whose tales of valor captivated all who listened. But behind the façade of strength was a man grappling with the ghosts of war, memories that clawed at his mind and threatened to surface at the most inopportune moments.",
      "With each drink, he felt the weight of expectation pressing down on him. Ivor had always prided himself on his unyielding resolve, yet the specter of Eleanor's ambition loomed larger with every passing hour. She was a whirlwind of energy, a force that could either elevate him or expose him for the failures he had buried deep within. The thought of her death sent a chill through him; would it be an end to his torment or merely a prelude to greater disgrace?",
      "As he exchanged pleasantries with guests, Ivor's mind drifted to the war, to the moments that had forged him into the man he had become. Yet, the honor he had fought for felt increasingly elusive, overshadowed by the shame of his hidden struggles. The dichotomy of his existence weighed heavily on him; he was a man revered for his service yet tormented by the very memories that defined it.",
      "In this moment of turmoil, Ivor realized that the stakes had never been higher. His honor, his very identity, hinged on the delicate balance between past and present. As the night wore on, he found himself at a crossroads, forced to confront the demons that had haunted him for far too long."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, an ambitious young journalist, was driven by a desire for notoriety, yet her hunger for success led her down a dark path of blackmail and deceit.",
    "publicPersona": "As a driven journalist, Beatrice was known for her tenacity and willingness to dig deep for the truth. Her ambition was palpable, a spark that ignited her career and captivated her peers, yet it often bordered on recklessness.",
    "privateSecret": "Behind her fierce exterior lay a secret that could ruin her: she had been blackmailing Eleanor over a scandal involving her family, a risk that threatened to consume her if exposed.",
    "motiveSeed": "Beatrice's ambition was her downfall; Eleanor's death would eliminate her main source of income and catapult her into the limelight she so desperately sought.",
    "motiveStrength": "strong",
    "alibiWindow": "At the time of the murder, Beatrice was interviewing guests at the hotel, a cover that could either validate her innocence or raise suspicions.",
    "accessPlausibility": "easy",
    "stakes": "Her career and credibility were on the line; exposure of her blackmail scheme could destroy everything she had worked for.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice spoke with a rapid-fire cadence, her words tumbling out in a breathless rush. Her dialogue was peppered with sharp quips and biting sarcasm, often revealing a keen insight into human nature.",
    "signatureTic": "Truth is stranger than fiction, isn’t it?",
    "internalConflict": "Beatrice wrestled with the moral implications of her actions, torn between her ambition and the guilt of exploiting Eleanor's vulnerabilities.",
    "personalStakeInCase": "This crime represented not just a career opportunity but a reckoning with her own ethics; the outcome could define her future in journalism.",
    "paragraphs": [
      "Beatrice Quill was a whirlwind of energy, her presence electrifying as she navigated the crowded hotel lobby. Driven by an insatiable desire for success, she had honed her skills as a journalist, yet her ambition often led her down treacherous paths. The thrill of uncovering the truth was intoxicating, but the dangerous game of blackmail she played with Eleanor was a double-edged sword, one that could slice through her career in an instant.",
      "With each interview, Beatrice felt the weight of her secret pressing down on her. She had unearthed a scandal involving Eleanor's family, a treasure trove of dirt that she had exploited for her gain. Yet, as she mingled with guests, a gnawing sense of guilt crept in, a reminder that her pursuit of notoriety came at a cost. The thought of Eleanor's demise ignited a mixture of dread and excitement; it could either propel her career to new heights or plunge her into the depths of disgrace.",
      "Beatrice's rapid-fire speech and sardonic wit captivated those around her, yet behind her sharp remarks lay a woman grappling with the moral implications of her choices. Every time she delivered a cutting quip, she felt the sting of hypocrisy; she was a reporter seeking the truth while simultaneously perpetuating a lie. The irony was not lost on her, yet the allure of success often drowned out her better judgment.",
      "As the night unfolded, Beatrice found herself at a crossroads. The stakes had never been higher; her career hung in the balance, and the shadows of her actions loomed large. This was more than just a story; it was a reckoning, a chance to redefine her values and confront the consequences of her ambition."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a savvy entrepreneur, thrived in the competitive business world, yet her hidden partnership with Eleanor threatened to unravel her carefully constructed empire.",
    "publicPersona": "Sylvia was known for her fierce competitiveness and innovative spirit, a businesswoman who carved her path in a male-dominated industry. Her reputation for success was hard-earned, yet her ambition often veered into ruthlessness.",
    "privateSecret": "Beneath her polished exterior lay a hidden partnership with Eleanor that, if exposed, could ruin her standing in the community and her business.",
    "motiveSeed": "Sylvia feared that Eleanor's plans might jeopardize her business interests, a threat that could unravel everything she had built.",
    "motiveStrength": "moderate",
    "alibiWindow": "At the time of the murder, Sylvia was in a conference room meeting with potential investors, a scenario that could either clear her name or cast suspicion.",
    "accessPlausibility": "possible",
    "stakes": "Her business and reputation were at stake, as well as the partnership that could lead to her downfall if revealed.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia spoke with a confident cadence, often punctuating her observations with dry humor. Her dialogue reflected her sharp intellect, with a tendency to dissect situations with precision.",
    "signatureTic": "In the world of business, it’s all about the bottom line.",
    "internalConflict": "Sylvia was torn between her ambition and the loyalty she felt towards Eleanor, grappling with the moral complexities of their partnership.",
    "personalStakeInCase": "This crime threatened not only her business interests but also her integrity and the fragile balance of her relationship with Eleanor.",
    "paragraphs": [
      "Sylvia Trent was a force to be reckoned with, her presence commanding attention as she navigated the hotel corridors. A savvy entrepreneur, she had built her empire from the ground up, yet the price of success often weighed heavily on her shoulders. The seaside hotel was a familiar battleground, a place where deals were struck and alliances forged. Yet, in the midst of her triumphs, a hidden partnership with Eleanor threatened to unravel everything she had worked for.",
      "Her reputation as a fierce competitor was well-earned, yet as she sat in the conference room with potential investors, Sylvia's mind raced with thoughts of Eleanor. The stakes were high; if Eleanor's ambitions jeopardized their partnership, it could spell disaster for her business. The thought of exposure loomed large, a specter that haunted her every decision. She had always prided herself on her ability to navigate the complexities of the business world, but this was a different game altogether.",
      "Sylvia's speech was marked by a confident cadence, her observations often laced with dry humor that hinted at her sharp intellect. Yet, beneath the surface, a storm brewed as she grappled with the moral implications of her partnership with Eleanor. Loyalty battled ambition, and the lines between right and wrong blurred in the pursuit of success. Every decision felt like a high-stakes gamble, one that could either elevate her or lead to her downfall.",
      "As the night unfolded and the shadows of uncertainty deepened, Sylvia knew she had to confront her fears. This crime was not just an external threat; it was a reflection of her internal struggle, a test of her character that would ultimately define her future."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a charismatic local politician, wielded his influence with cunning precision, yet his hidden ties to Eleanor's family threatened to unravel his carefully crafted facade.",
    "publicPersona": "As a local politician, Hugo was known for his charm and political savvy, maneuvering through social circles with ease. His charisma made him a beloved figure, yet whispers of his influence often hinted at deeper, darker dealings.",
    "privateSecret": "Behind the scenes, Hugo had been secretly funding Eleanor's family, a risky endeavor that could expose his own past if discovered.",
    "motiveSeed": "Hugo's desire to protect his political aspirations and maintain the status quo drove him to consider drastic measures in light of Eleanor's potential revelations.",
    "motiveStrength": "moderate",
    "alibiWindow": "At the time of the murder, Hugo was in his office across town, verified by his aides, a scenario that could either solidify his innocence or raise questions about his involvement.",
    "accessPlausibility": "impossible",
    "stakes": "His political future depended on keeping his dealings hidden, a precarious balance that could crumble with a single misstep.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo spoke with a polished eloquence, his words carefully chosen and delivered with a smooth cadence. His humor was often dry and understated, revealing a keen intellect beneath the surface charm.",
    "signatureTic": "After all, politics is a game of perception.",
    "internalConflict": "Hugo faced a moral reckoning, torn between his ambitions and the ethical implications of his clandestine dealings; the truth could shatter his carefully constructed world.",
    "personalStakeInCase": "This case was a personal journey, forcing him to confront the ethical dilemmas of his past while navigating the treacherous waters of his political ambitions.",
    "paragraphs": [
      "Hugo Vane stood at the helm of his political career, a charismatic figure whose charm masked the complexities of his dealings. As a local politician, he had mastered the art of persuasion, effortlessly navigating the intricate web of social and political connections. Yet, beneath the polished exterior lay a man grappling with the shadows of his past, a past intertwined with the Voss family in ways that could spell disaster for his future.",
      "In the quiet confines of his office, Hugo reviewed his plans for the upcoming election, yet his mind was never far from the implications of Eleanor's death. He had been funding her family, a decision that had once seemed prudent but now felt like a ticking time bomb. The stakes were high; exposure could unravel not just his political aspirations but the very fabric of his reputation. The thought sent shivers down his spine, a reminder that in politics, perception was everything.",
      "Hugo's speech was characterized by a smooth eloquence, his words carefully crafted to charm and persuade. Yet, when pressed, his dry wit often revealed a deeper understanding of the game he was playing. He was acutely aware that every move he made was scrutinized, and the shadows of his past loomed large, threatening to upend the carefully constructed narrative he had woven.",
      "As the night unfolded, Hugo found himself at a crossroads, forced to confront the ethical dilemmas that had haunted him. This case was more than a political challenge; it was a reckoning, a chance to redefine his values and navigate the murky waters of ambition and integrity."
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Oceanic Grand Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel with Art Deco elegance, overlooking the stormy English Channel.",
    "visualDescription": "Art Deco façade with sweeping curves and geometric patterns; polished brass fittings gleaming under dim chandelier light; large windows framing tumultuous ocean views; plush carpets muffling footsteps in the lobby.",
    "atmosphere": "Tense and suspenseful, with echoes of past events lingering in the air.",
    "paragraphs": [
      "The Oceanic Grand Hotel stands defiantly against the relentless winds of the English Channel, its Art Deco lines cutting sharply through the overcast sky. The lobby, adorned with polished marble and intricate brass fixtures, exudes an air of faded grandeur. Guests drift through the space, their hushed conversations punctuated by the distant crash of waves against the cliffs, creating an unsettling rhythm that mirrors the tension in the air. The scent of salt and dampness clings to the plush carpets, while the flickering gas lamps cast long shadows that dance along the walls, hinting at secrets hidden in the corners.",
      "As the day unfolds, the oppressive atmosphere thickens, with the fog rolling in from the sea, enshrouding the hotel in a ghostly veil. The dining room, usually vibrant with laughter and clinking cutlery, now feels like a chamber of whispers, the muted tones of conversation barely rising above the sound of the wind howling outside. The guests, draped in the fashion of the era, seem unaware of the unseen eyes watching them, their expressions betraying the weight of recent events. The air is heavy with anticipation, as if the very foundations of the hotel hold their breath, waiting for the next revelation.",
      "In the guest rooms, the atmosphere shifts further into unease. Each room, accessible only by heavy doors requiring a key, offers a glimpse into the lives of those who inhabit them—some in the midst of a luxurious escape, others hiding from a past they cannot shake. The soft ticking of clocks mingles with the distant sound of waves crashing below, reminding the inhabitants of the world outside. Each room feels isolated, yet the thin walls carry echoes of conversations, secrets, and perhaps, the unspoken truth of a crime yet to be uncovered."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional coastal fog",
    "timeFlow": "Three days of mounting tension as secrets unfold",
    "mood": "tense and suspenseful due to recent events",
    "eraMarkers": [
      "Art Deco architecture",
      "rationed petrol for automobiles",
      "early radio broadcasts in the lobby"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and damp fabrics",
      "secondary": [
        "flickering gaslight",
        "crackling fireplace warmth"
      ]
    },
    "paragraphs": [
      "The atmosphere of the Oceanic Grand Hotel is steeped in a palpable tension, the kind that lingers long after the sun has set. Overcast skies loom overhead, casting a gray pallor over the grand structure, while the distant sound of waves crashing against the cliffs creates a symphony of unease. As guests navigate the narrow hallways and plush carpeted stairs, the air is thick with the scent of salt and dampness, remnants of the sea’s relentless embrace.",
      "In the evenings, as fog rolls in from the ocean, the hotel transforms into a labyrinth of shadows and whispers. The dim lighting from gas sconces barely penetrates the gloom, creating an atmosphere ripe for secrets and intrigue. The occasional crackle of the radio in the lobby breaks the silence, broadcasting news from a world at war, a reminder of the outside struggles that echo even within the hotel’s luxurious walls."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space for guests",
      "visualDetails": "Expansive marble floors; high ceilings adorned with intricate plasterwork; plush velvet seating areas.",
      "sensoryDetails": {
        "sights": [
          "gleaming brass chandeliers",
          "polished marble floors",
          "large ocean-view windows",
          "elegantly dressed guests",
          "intricate plaster ceiling"
        ],
        "sounds": [
          "muffled footsteps on carpet",
          "soft laughter and whispers",
          "the distant crash of waves",
          "the crackle of a radio",
          "the rustle of newspaper pages"
        ],
        "smells": [
          "freshly polished wood",
          "salt air from the ocean",
          "warmth of baked goods",
          "damp wool from coats",
          "scent of perfume and cologne"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft velvet upholstery",
          "cool brass fixtures",
          "thick carpet pile",
          "chill of ocean breeze through open windows"
        ]
      },
      "accessControl": "Open to all guests; staff-only areas behind the reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-soaked windows",
            "mist rising from the ocean",
            "grey light filtering through clouds"
          ],
          "sounds": [
            "steady rain pattering on glass",
            "distant thunder rumbling",
            "the soft drip of water from awnings"
          ],
          "smells": [
            "fresh rain on pavement",
            "wet wool coats",
            "earthy scent of soaked earth"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat, dull light",
            "shadows creeping across the floor",
            "glistening wet surfaces"
          ],
          "sounds": [
            "silence punctuated by distant waves",
            "the tick of an ornate clock",
            "soft footsteps echoing"
          ],
          "smells": [
            "damp wood",
            "faint scent of seaweed",
            "cooked seafood from the kitchen"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "long shadows stretching across the lobby",
            "glowing sunset over the ocean"
          ],
          "sounds": [
            "the murmur of voices rising",
            "the clink of glasses",
            "the soft crackle of firewood"
          ],
          "smells": [
            "warm bread from the kitchen",
            "fresh coffee brewing",
            "scent of cigars"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of the Oceanic Grand Hotel is a testament to the opulence of the Art Deco era, its polished marble floors reflecting the soft glow of brass chandeliers hanging overhead. Guests mingle in small groups, laughter and hushed whispers creating a symphony of sound that intertwines with the rhythmic crash of waves just outside. The scent of salt and dampness fills the air, mingling with hints of perfume and freshly baked goods from the kitchen, inviting all who enter to linger a little longer.",
        "As shadows lengthen in the late afternoon, the atmosphere shifts subtly. The once-vibrant lobby now feels laden with tension, the overcast sky casting a pall over the space. Guests glance at each other with furtive expressions, the weight of unspoken secrets hanging heavy in the air. The distant crackle of the radio, broadcasting news from a world embroiled in conflict, serves as a reminder that even in this grand hotel, the outside world cannot be entirely escaped."
      ]
    },
    {
      "id": "dining_room",
      "name": "Oceanview Dining Room",
      "type": "interior",
      "purpose": "Dining space for guests",
      "visualDetails": "Floor-to-ceiling windows offering panoramic ocean views; elegant tables set with fine china and cutlery; soft lighting creating an intimate ambiance.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on white tablecloths",
          "brightly colored floral arrangements",
          "waves crashing against the cliffs",
          "guests in formal attire",
          "softly flickering candle flames"
        ],
        "sounds": [
          "clinking of cutlery",
          "low hum of conversation",
          "the distant roar of the ocean",
          "soft music from a gramophone",
          "the rustle of napkins"
        ],
        "smells": [
          "roasted meats and fresh bread",
          "seafood and herbs",
          "sweet desserts cooling",
          "warmth of freshly brewed tea",
          "scent of polished wood"
        ],
        "tactile": [
          "smooth porcelain plates",
          "crisp linen napkins",
          "cold metal cutlery",
          "soft fabric of cushioned chairs",
          "the warmth of candlelight"
        ]
      },
      "accessControl": "Open during meal times; reservations recommended; staff access limited to service hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on window panes",
            "grey light filtering through clouds",
            "table settings glistening with moisture"
          ],
          "sounds": [
            "steady rain pattering on glass",
            "soft chatter among early diners"
          ],
          "smells": [
            "freshly brewed coffee",
            "warm pastries from the kitchen",
            "scent of wet earth"
          ],
          "mood": "cozy and intimate"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting muted colors",
            "shadows creeping across tables",
            "ocean waves crashing in the distance"
          ],
          "sounds": [
            "quiet conversations",
            "the sound of cutlery scraping plates",
            "the rustling of menus"
          ],
          "smells": [
            "scent of grilled fish",
            "fresh herbs and spices",
            "hint of citrus from desserts"
          ],
          "mood": "melancholic yet warm"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset reflecting on the ocean",
            "candlelight flickering on tables",
            "waitstaff gliding between tables"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "soft piano music in the background",
            "the sound of waves crashing"
          ],
          "smells": [
            "scent of roasted meats",
            "freshly baked bread",
            "aromas of rich desserts"
          ],
          "mood": "festive and vibrant"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room is a feast for the senses, where the elegance of fine dining meets the breathtaking views of the English Channel. Floor-to-ceiling windows frame the tumultuous ocean, waves crashing against the cliffs as guests savor their meals. The tables are adorned with gleaming silverware and delicate floral arrangements, creating an atmosphere of refined opulence. As the aroma of roasted meats and fresh seafood wafts through the air, the soft murmur of conversation mingles with the distant sound of the ocean, setting the stage for an unforgettable dining experience.",
        "As evening descends, the dining room transforms into a sanctuary of warmth and camaraderie. Candlelight flickers gently, casting a warm glow over the guests as laughter fills the air. Conversations flow freely, yet an undercurrent of tension remains palpable, as if everyone is aware that the shadows of the past lurk just beyond the windows. The clinking of glasses and the soft strains of music provide a comforting backdrop, but the weight of unspoken secrets hangs in the air like a heavy fog."
      ]
    },
    {
      "id": "guest_room",
      "name": "Guest Room 312",
      "type": "interior",
      "purpose": "Private space for guests",
      "visualDetails": "Elegantly furnished with a plush bed, vintage decor, and a small writing desk; large windows overlooking the ocean.",
      "sensoryDetails": {
        "sights": [
          "soft pastel wallpaper",
          "heavy drapes framing the window",
          "a vintage writing desk",
          "a plush, inviting bed",
          "faded photographs on the walls"
        ],
        "sounds": [
          "the distant crash of waves",
          "soft ticking of a clock",
          "the rustle of paper",
          "the creak of the floorboards",
          "muffled voices from the hallway"
        ],
        "smells": [
          "fresh linen and lavender",
          "faint scent of old books",
          "the salty tang of the sea air",
          "hint of dust from neglected corners",
          "scent of polished wood"
        ],
        "tactile": [
          "soft cotton sheets",
          "cool glass of the window",
          "worn leather of the writing desk",
          "plush carpet underfoot",
          "the chill of the evening air"
        ]
      },
      "accessControl": "Access limited to registered guests; daily cleaning scheduled; locked door for privacy.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain trickling down the window",
            "grey light flooding the room",
            "puddles forming outside"
          ],
          "sounds": [
            "steady rain tapping on glass",
            "the soft creak of the building",
            "distant thunder rumbling"
          ],
          "smells": [
            "scent of damp wood",
            "fresh linen from the bed",
            "wet earth outside"
          ],
          "mood": "claustrophobic and tense"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "faded photographs on the wall",
            "the room feeling closed in"
          ],
          "sounds": [
            "the distant sound of waves",
            "soft rustle of pages turning",
            "the ticking of the clock"
          ],
          "smells": [
            "dusty air",
            "scent of old leather",
            "hint of lavender from the linens"
          ],
          "mood": "melancholic and introspective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling through the window",
            "the ocean sparkling under the moonlight",
            "shadows dancing on the walls"
          ],
          "sounds": [
            "the soft crash of waves",
            "muffled laughter from the lobby",
            "the ticking of a mantel clock"
          ],
          "smells": [
            "scent of fresh linen",
            "the salty breeze from the ocean",
            "hint of tobacco from a nearby guest"
          ],
          "mood": "reflective and anxious"
        }
      ],
      "paragraphs": [
        "Guest Room 312 offers a sanctuary of elegance amid the tension of the hotel. Decorated with soft pastel wallpaper and vintage furnishings, the room exudes a sense of calm, though the distant sound of crashing waves serves as a constant reminder of the world outside. A plush bed invites rest, while a small writing desk beckons for reflection. Yet, as the hours pass, the room's isolation begins to feel oppressive, the heavy curtains drawn tight against the outside world.",
        "As evening settles in, shadows deepen in the corners of the room, and the atmosphere shifts. The soft glow of the moonlight spills through the window, illuminating the faded photographs that line the walls. The air is thick with the scent of fresh linen mingling with the salty tang of the sea breeze, creating a bittersweet reminder of the life outside. The ticking of the clock becomes a metronome for anxious thoughts, as secrets and fears bubble just beneath the surface, waiting to be revealed."
      ]
    },
    {
      "id": "staff_area",
      "name": "Staff-Only Corridor",
      "type": "interior",
      "purpose": "Service area for hotel staff",
      "visualDetails": "Narrow, dimly lit corridor lined with doors leading to service rooms; utilitarian decor with a stark contrast to guest areas.",
      "sensoryDetails": {
        "sights": [
          "flickering overhead lights",
          "simple wooden doors",
          "cleaning carts stacked against the wall",
          "dusty floor tiles",
          "faded staff schedules pinned to a bulletin board"
        ],
        "sounds": [
          "soft footsteps echoing",
          "the rustle of cleaning supplies",
          "distant chatter from the dining room",
          "the clattering of dishes",
          "the hum of machinery"
        ],
        "smells": [
          "scent of cleaning products",
          "faint odor of old wood",
          "dampness from the ocean",
          "hint of sweat from staff",
          "the scent of food from the kitchen"
        ],
        "tactile": [
          "cold metal doorknobs",
          "smooth wooden surfaces",
          "rough texture of cleaning supplies",
          "cool tiles underfoot",
          "the chill of the corridor air"
        ]
      },
      "accessControl": "Restricted to hotel staff; access through locked doors; staff schedules dictate entry times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain streaming down windows",
            "puddles forming in the corridor",
            "cleaning supplies lined up against the wall"
          ],
          "sounds": [
            "soft drips of water",
            "the hum of machinery starting up",
            "muffled voices from the lobby"
          ],
          "smells": [
            "freshly opened cleaning supplies",
            "scent of damp wood",
            "hint of mildew"
          ],
          "mood": "busy and chaotic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim lighting casting long shadows",
            "dust particles floating in the air",
            "the corridor appearing more confined"
          ],
          "sounds": [
            "the quiet shuffle of staff moving",
            "the distant sound of trays being moved",
            "muffled conversations"
          ],
          "smells": [
            "faint scent of food wafting from the kitchen",
            "cleaning products lingering in the air",
            "the musty smell of old wood"
          ],
          "mood": "oppressive and tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "overhead lights casting a warm glow",
            "cleaning carts arranged neatly",
            "staff hurrying to finish evening tasks"
          ],
          "sounds": [
            "the clattering of dishes being cleaned",
            "low voices discussing the next day",
            "the sound of footsteps echoing"
          ],
          "smells": [
            "freshly cleaned surfaces",
            "the scent of dinner preparations",
            "hint of laundry detergent"
          ],
          "mood": "tense and hurried"
        }
      ],
      "paragraphs": [
        "The Staff-Only Corridor is a stark contrast to the opulence of the hotel’s guest areas, its narrow, dimly lit passageways lined with simple wooden doors leading to service rooms. Flickering overhead lights cast an uneven glow, and the air is thick with the scent of cleaning products, a reminder of the constant upkeep required to maintain the hotel’s façade. The hustle and bustle of staff moving about creates a sense of urgency, whispers of conversations barely audible over the sounds of cleaning supplies clattering against one another.",
        "As the day progresses, the corridor feels increasingly oppressive, shadows creeping along the walls as the natural light fades. The faint odor of food wafts in from the kitchen, mingling with the lingering scent of cleaning products, creating a heady mix that clings to the air. The staff, moving quickly to complete their tasks, exchange furtive glances, aware that the secrets of the hotel are as much their burden as they are the guests'."
      ]
    }
  ],
  "note": "",
  "cost": 0.00257819265,
  "durationMs": 85807
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1941,
    "month": "February",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast skies",
      "occasional coastal fog",
      "chill in the air"
    ],
    "daylight": "Days are short with sunlight fading by 5 PM, leaving a pervasive gloom.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner service in the hotel.",
    "holidays": [
      "Valentine's Day on February 14"
    ],
    "seasonalActivities": [
      "Strolling along foggy coastal paths",
      "Attending local dances or community gatherings",
      "Participating in wartime rationing workshops"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "Double-breasted navy wool suit",
        "White dress shirt with a wing collar",
        "Charcoal grey fedora"
      ],
      "casual": [
        "Tweed jacket",
        "Corduroy trousers",
        "Wool sweater"
      ],
      "accessories": [
        "Leather gloves",
        "Silk tie",
        "Pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "Tea-length dress with a fitted waist and fuller skirt",
        "Tailored wool coat with a fur collar",
        "Accessorized hat with feathers"
      ],
      "casual": [
        "Knit cardigan with pearl buttons",
        "High-waisted slacks",
        "Cotton blouse with a Peter Pan collar"
      ],
      "accessories": [
        "Beaded clutch purse",
        "String of pearls",
        "Knitted scarf"
      ]
    },
    "trendsOfTheMoment": [
      "Utility fashion due to rationing",
      "Military-inspired styles",
      "Bold patterns in fabric"
    ],
    "socialExpectations": [
      "Men are expected to be the primary providers",
      "Women increasingly take on roles in the workforce",
      "Politeness and formality in social settings remain important"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The U.S. Congress has just passed the Lend-Lease Act to support Allied nations",
      "Tensions rise in the Atlantic as U-boats threaten shipping",
      "The Battle of Britain continues to impact European dynamics"
    ],
    "politicalClimate": "The political atmosphere is tense, with increasing support for military interventions abroad as the war escalates.",
    "economicConditions": "The economy is strained but stabilizing, with rationing affecting household budgets across the nation.",
    "socialIssues": [
      "Women’s rights in the workforce",
      "Racial discrimination in job opportunities",
      "Housing shortages in urban areas due to war-related migration"
    ],
    "internationalNews": [
      "Germany's continued aggression in Europe",
      "Japanese expansion in Asia raising concerns",
      "The United Kingdom's resilience against Axis powers"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Glenn Miller's 'In the Mood'",
        "Doris Day's early records"
      ],
      "films": [
        "'The Maltese Falcon'",
        "'How Green Was My Valley'",
        "'Sergeant York'"
      ],
      "theater": [
        "'My Sister Eileen'",
        "'The Glass Menagerie'",
        "'Lady in the Dark'"
      ],
      "radio": [
        "The Shadow",
        "Fibber McGee and Molly",
        "Amos 'n' Andy"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Grapes of Wrath' by John Steinbeck",
        "'For Whom the Bell Tolls' by Ernest Hemingway",
        "'The Last Chronicle of Barset' by Anthony Trollope"
      ],
      "popularGenres": [
        "Mystery and detective fiction",
        "Realistic war novels",
        "Social realism"
      ]
    },
    "technology": {
      "recentInventions": [
        "Radar technology improving military tactics",
        "Development of synthetic rubber due to material shortages",
        "Initial experiments with television broadcasts"
      ],
      "commonDevices": [
        "Battery-operated radios",
        "Table-top phonographs",
        "Basic telephones"
      ],
      "emergingTrends": [
        "Increased use of industrial technology in consumer products",
        "Growth of broadcasting networks",
        "Rationing leading to innovations in food preservation"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: two pence",
        "Coal scuttle refill: one shilling sixpence"
      ],
      "commonActivities": [
        "Gathering for communal meals",
        "Participating in local defense drills",
        "Engaging in letter-writing campaigns to soldiers"
      ],
      "socialRituals": [
        "Monthly community potluck dinners",
        "Regular movie night at local theaters",
        "Sunday church services followed by family gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Growing awareness of class disparities due to wartime needs",
      "Increased solidarity among working-class citizens"
    ],
    "gender": [
      "Women are taking on more roles traditionally held by men",
      "Expectations for women to balance work and home life"
    ],
    "race": [
      "Racial tensions simmering in urban centers",
      "Civil rights movements beginning to gain traction"
    ],
    "generalNorms": [
      "Politeness in public interactions is valued",
      "Community engagement is encouraged due to wartime unity"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the damp chill of coastal fog, wrapping around the hotel like a shroud.",
    "The faint sound of jazz echoes from the hotel lounge, blending with the quiet conversations of guests sharing war stories.",
    "A warm glow from the lobby's fireplace offers a stark contrast to the gloomy weather outside, creating an inviting yet tense atmosphere."
  ],
  "paragraphs": [
    "In February 1941, the coastal town where the mystery unfolds is enveloped in a thick fog, casting a pall over the hotel where guests gather. The chill in the air, coupled with the overcast skies, creates a somber mood as the world grapples with the ongoing realities of World War II. Recent events, including the U.S. passing the Lend-Lease Act, heighten tensions, leaving the community on edge and echoing with uncertainty. A sense of urgency fills the air as locals engage in wartime preparations, balancing their everyday lives with the looming threat of conflict.",
    "Fashion during this period reflects the duality of wartime practicality and emerging trends. Men dress in double-breasted navy suits paired with crisp white shirts, while women opt for tea-length dresses accentuated with tailored coats. Accessories like silk ties and beaded clutch purses are common, showcasing a desire for elegance amidst the constraints of rationing. Utility fashions dominate as both genders adapt to the changing social fabric, with women increasingly stepping into the workforce, leading to a blend of styles that mirror their evolving roles in society.",
    "Daily life in February 1941 is punctuated by both community engagement and the challenges of war. Local potluck dinners foster camaraderie, while rationing workshops educate families on making the most of scarce resources. The typical prices for staples reflect the economic conditions, with a loaf of bread costing four pence, making budgeting a necessity for many. Amidst this backdrop, guests at the hotel find themselves drawn together by shared experiences, creating an atmosphere ripe for intrigue, where whispers of secrets and truths linger in every fog-laden corner."
  ],
  "note": "",
  "cost": 0.0010566171,
  "durationMs": 16860
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A murder at a grand seaside hotel during a tense post-WWII era draws together guests and staff, all navigating the pressures of societal change and suspicion amidst the fog.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Class divisions are blurred as women enter the workforce, while the specter of war and Cold War tensions creates an atmosphere of distrust and anxiety."
  },
  "setting": {
    "location": "A grand seaside hotel overlooking the ocean",
    "institution": "hotel",
    "weather": "overcast with occasional coastal fog"
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by an acoustic method, where a gramophone recording played into a soundproofed room fabricates an alibi for the true moment of death."
}

### LOCKED_FACTS
[
  {
    "id": "record_duration",
    "value": "twenty minutes",
    "description": "The length of the gramophone recording that masked the time of death."
  },
  {
    "id": "recording_start_time",
    "value": "ten minutes past eight",
    "description": "The time the gramophone recording began playing, masking the actual time of the murder."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 5,
    "mid": 11,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 16,
    "optional": 1
  },
  "redHerringCount": 2,
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
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
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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
      "category": "behavioral"
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
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_2",
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

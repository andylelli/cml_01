# Actual Prompt Record

- Run ID: `mystery-1784147217332`
- Project ID: ``
- Timestamp: `2026-07-15T20:31:29.165Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `61ed9c04260b7a10`

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
    "title": "The Subtle Poison",
    "author": "Unknown",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A grand, Art Deco seaside hotel",
      "place": "Brighton",
      "country": "England",
      "institution": "hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "delayed-action poison"
    }
  },
  "death_method": "poisoned with a botanical toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Inquisitive and assertive",
      "private_secret": "Struggles with self-doubt",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Desire to solve the case",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Expert",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Has a hidden romantic history with the victim",
      "motive_seed": "Jealousy",
      "motive_strength": "high",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hotel kitchen"
      ],
      "behavioral_tells": [
        "Nervous when discussing the victim"
      ],
      "stakes": "Fear of past being revealed",
      "evidence_sensitivity": [
        "Medical records"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority Figure",
      "relationships": [],
      "public_persona": "Charismatic and commanding",
      "private_secret": "Hides a gambling addiction",
      "motive_seed": "Financial desperation",
      "motive_strength": "moderate",
      "alibi_window": "8:15 PM to 9:15 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Rooftop terrace"
      ],
      "behavioral_tells": [
        "Avoids eye contact when lying"
      ],
      "stakes": "Reputation at stake",
      "evidence_sensitivity": [
        "Gambling debts"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Mysterious Guest",
      "relationships": [],
      "public_persona": "Enigmatic and alluring",
      "private_secret": "Has a history of blackmail",
      "motive_seed": "Revenge",
      "motive_strength": "high",
      "alibi_window": "7:30 PM to 8:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining area"
      ],
      "behavioral_tells": [
        "Too eager to shift blame"
      ],
      "stakes": "Fear of exposure",
      "evidence_sensitivity": [
        "Past dealings with the victim"
      ],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Innocent Bystander",
      "relationships": [],
      "public_persona": "Sweet and naive",
      "private_secret": "Has a crush on the victim",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "8:00 PM to 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Overly enthusiastic about social events"
      ],
      "stakes": "Hopes to win the victim's affection",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Wealthy and charming",
      "private_secret": "Hiding financial troubles",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Survival and reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
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
      "summary": "At a grand seaside hotel, renowned guests gather for a reunion, but the evening takes a dark turn when Hugo Vane is found dead, poisoned. Eleanor Voss must untangle a web of jealousy and revenge hidden beneath the surface of camaraderie."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on drink, toast, and witness to expose the false timing.",
      "delivery_path": [
        {
          "step": "The poison was mixed into the drink while others were distracted."
        },
        {
          "step": "The effects were felt hours later, leading to confusion about the time of poisoning."
        }
      ]
    },
    "outcome": {
      "result": "Hugo succumbed to the effects of the poison, while guests remained unaware of the true cause."
    }
  },
  "false_assumption": {
    "statement": "Hugo Vane must have died from natural causes due to his known health issues.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Hugo had a history of health problems which made his sudden death seem like a natural progression.",
    "what_it_hides": "The premeditated poisoning that was masked by the event's celebratory atmosphere."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Hale was seen near the victim just before the toast, raising suspicions about his intentions.",
      "He had financial troubles that created a motive for murder."
    ],
    "the_one_flaw": "There is no evidence linking Hale to the poisoning mechanism or the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Captain Hale's gambling debts were uncovered during the investigation.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "Hale borrowed money from Vane but had repaid him before the incident.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Dr. Finch's nervousness when discussing the victim's health.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "Finch was anxious about her past relationship with the victim being exposed.",
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
    "rationale": "All interactions occurred within the hotel, and no outsiders were present."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Time of toast at 8:20 PM",
        "Hugo's symptoms appeared at 9:00 PM"
      ],
      "windows": [
        "8:15 PM to 9:15 PM"
      ],
      "contradictions": [
        "Hugo was seen lively until shortly before his death."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The poisoned drink",
        "The kitchen supplies"
      ],
      "permissions": [
        "Dr. Finch has access to the kitchen"
      ]
    },
    "physical": {
      "laws": [
        "Poison acts over time",
        "Symptoms can mimic natural illness"
      ],
      "traces": [
        "Residue found in Hugo's glass",
        "Poison detected in the drink"
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust each other during celebrations"
      ],
      "authority_sources": [
        "Dr. Finch's medical expertise"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses recall the toast was made at precisely twenty minutes past eight.",
        "correction": "This timing contradicts the initial assumption of natural causes since the symptoms began later.",
        "effect": "Narrows the timeline for poisoning to just before the toast.",
        "required_evidence": [
          "Witness statements about the time of the toast.",
          "Hugo's symptoms reported by Dr. Finch."
        ],
        "reader_observable": true
      },
      {
        "observation": "An unusual residue is found in the bottom of Hugo's glass.",
        "correction": "The residue indicates tampering and suggests the glass was not clean prior to serving.",
        "effect": "Eliminates the possibility of natural causes.",
        "required_evidence": [
          "Forensic analysis of the glass.",
          "Witness reports about drink preparation."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Finch was seen in the kitchen shortly before the toast.",
        "correction": "Her presence in the kitchen allows for access to poison.",
        "effect": "Raises suspicion about Dr. Finch's opportunity.",
        "required_evidence": [
          "Kitchen access records.",
          "Witness statement confirming her presence."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Confronting Dr. Finch with the forensic residue evidence and kitchen access records.",
    "knowledge_revealed": "The revealed facts are residue, report, and witness.",
    "pass_condition": "If Dr. Finch cannot explain her access and presence, her involvement becomes suspect.",
    "evidence_clues": [
      "clue_6",
      "clue_culprit_direct_1",
      "clue_5",
      "clue_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements and Hugo's symptoms (early) highlight the discrepancy in timing. Step 2: The residue found in the glass (mid) confirms tampering. Step 3: Dr. Finch's presence in the kitchen (discriminating test) links her to the poison."
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
        "Confront Dr. Finch with evidence",
        "Observe her reaction or result"
      ],
      "test_type": "Chemical evidence confrontation"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His gambling debts were settled before the murder.",
        "supporting_clues": [
          "red_herring_1"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No evidence of her involvement found in the investigation.",
        "supporting_clues": []
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No motive connected to the case.",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: none",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence linking Dr. Finch to the poisoning."
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
        "clue_id": "clue_10",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness report of Dr. Finch in the kitchen"
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness recall of the toast timing"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Forensic analysis of the glass"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_9",
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
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
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
    "summary": "A traveling journalist with a flair for charm and social connections, Eleanor is determined to uncover the hidden truths of the wealthy elite.",
    "publicPersona": "Charming and well-connected, Eleanor is often seen at social events discussing her latest travel stories.",
    "privateSecret": "Eleanor harbors a secret affection for a married man, which complicates her relationships with others in the hotel.",
    "motiveSeed": "Invited to the hotel to cover a luxurious event, she wants to expose hidden truths about the wealthy elite.",
    "motiveStrength": "moderate",
    "alibiWindow": "present during the murder, discovered the body shortly after",
    "accessPlausibility": "easy",
    "stakes": "Personal integrity as a journalist and her credibility in her social circle.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a light, engaging tone, often peppering her speech with anecdotes. She has a habit of raising an eyebrow when she finds something particularly amusing or absurd.",
    "signatureTic": "Ah, the truth is a slippery creature, isn't it?",
    "internalConflict": "Eleanor grapples with the duality of her professional ambition and her personal desires, fearing that her affection for a married man could lead to scandal.",
    "personalStakeInCase": "This crime matters to Eleanor because it could either cement her reputation as a serious journalist or destroy her credibility if her secret affections are revealed.",
    "paragraphs": [
      "Eleanor Voss, a traveling journalist of considerable charm and wit, found herself drawn into the opulent world of the grand Art Deco seaside hotel. With her keen eye for detail and a nose for scandal, she was there to document the lavish event hosted by the wealthy elite. Yet, underneath her polished exterior lay a tumultuous sea of emotions, particularly her secret affection for a married man whose presence in her life complicated her every interaction.",
      "As she mingled among the rich and powerful, Eleanor's sharp instincts kicked in, sensing the undercurrents of tension that lay beneath the surface of polite conversation. She had a reputation for uncovering hidden truths, and this time, she was determined to expose the darker side of the elite. With a mix of enthusiasm and trepidation, she began to delve into the lives of those around her, hoping to reveal their secrets while wrestling with her own.",
      "But when the body of Hugo Vane was discovered, her world tilted dangerously. Eleanor found herself at the center of a storm, having been present during the murder and the one to stumble upon the gruesome scene. The stakes were high: not only did she need to solve the mystery for her professional integrity, but she also feared that her personal connections would become fodder for gossip, threatening to unravel her carefully constructed facade.",
      "In her quest for the truth, Eleanor faced a moral dilemma. Would exposing the secrets of the elite restore her faith in her abilities as a journalist, or would it lead to a public scandal that could ruin her? As she navigated the treacherous waters of ambition and desire, Eleanor realized that the truth was not only slippery but also perilous, and she would need to tread carefully to avoid being swept away."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected physician with a caring demeanor, Mallory's hidden past with the victim threatens to unravel her professional life.",
    "publicPersona": "A skilled doctor known for her caring nature and meticulous attention to detail.",
    "privateSecret": "Mallory had a romantic affair with the victim, leading to jealousy from her colleagues.",
    "motiveSeed": "Fears her professional reputation might be tarnished if secrets from the affair are revealed.",
    "motiveStrength": "strong",
    "alibiWindow": "In the medical wing of the hotel during the murder, but could have slipped away.",
    "accessPlausibility": "possible",
    "stakes": "Her career and standing in the community could be at risk.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Mallory tends to speak in a calm, measured tone, often using medical jargon that softens into more casual language when she’s relaxed. She has a habit of apologizing unnecessarily, reflecting her caring nature.",
    "signatureTic": "I’m just a doctor, not a detective.",
    "internalConflict": "Mallory struggles with guilt over her affair with Hugo and fears the consequences of its revelation, which could shatter her professional reputation.",
    "personalStakeInCase": "The investigation holds particular significance for Mallory as it threatens to expose her secret relationship with the victim, jeopardizing her career and the trust of her patients.",
    "paragraphs": [
      "Dr. Mallory Finch, a dedicated physician, was known for her meticulous attention to detail and her unwavering commitment to her patients. Yet, beneath her composed exterior lay a tumult of emotions, particularly a secret affair with the victim, Hugo Vane. The relationship, once a source of excitement, now loomed over her like a dark cloud, threatening to overshadow her professional achievements.",
      "During the luxurious event at the hotel, Mallory was busy in the medical wing, tending to a minor injury when the murder occurred. Her alibi, while seemingly solid, was fraught with uncertainty; she could have easily slipped away unnoticed. The fear of being discovered sent shivers down her spine, and as the investigation began, she felt the walls closing in around her. The whispers of her colleagues, fueled by jealousy over her past with Hugo, only added to her anxiety.",
      "As the details of the murder unfolded, Mallory was torn between her desire to help solve the mystery and her instinct to protect herself. The stakes were high; if the truth about her affair were to come out, it could ruin her career and reputation. Guilt gnawed at her, not only for her actions but for the potential fallout that could harm others around her. She found herself questioning her integrity as a physician and a person.",
      "In this dark chapter, Mallory faced a crossroads. Would she choose to remain silent, safeguarding her own interests, or would she step forward, risking everything to assist in unraveling the truth? The answer lay in her ability to confront her past and the tangled web of emotions that came with it. As the investigation progressed, Mallory's journey would reveal whether she could transform her guilt into action and emerge from the shadows of her secret."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A charismatic military officer with a strong sense of duty, Ivor's hidden debts and blackmail scheme create a compelling motive for murder.",
    "publicPersona": "A charismatic officer with a strong sense of duty and leadership.",
    "privateSecret": "Deeply in debt from gambling, he was involved in a plot to blackmail the victim.",
    "motiveSeed": "Intended to use the victim's secrets to pay off his debts and assert his standing.",
    "motiveStrength": "compelling",
    "alibiWindow": "Claimed to be in a meeting with other officers, but the timing is unclear.",
    "accessPlausibility": "unlikely",
    "stakes": "His military career and reputation are at stake if his financial troubles come to light.",
    "humourStyle": "sardonic",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks with a commanding presence, often using military jargon. He has a tendency to punctuate his statements with dry humor, which reveals his sardonic view of the world.",
    "signatureTic": "Duty calls, but sometimes it whispers sweet nothings.",
    "internalConflict": "Ivor battles with the shame of his gambling debts and the lengths he is willing to go to protect his sister from the fallout of his actions.",
    "personalStakeInCase": "The murder investigation impacts Ivor deeply, as his financial troubles could be exposed, jeopardizing not only his military career but also his sister's future.",
    "paragraphs": [
      "Captain Ivor Hale, a charismatic officer steeped in duty, was the embodiment of leadership at the hotel. Yet behind his confident facade lay a tumult of desperation. Deep in gambling debt, Ivor had become ensnared in a web of blackmail, plotting to use the victim's secrets to pay off his financial burdens. The stakes were not just his own reputation; they extended to his sister, whose future depended on his ability to maintain their family's honor.",
      "When the murder of Hugo Vane unfolded, Ivor's alibi—a meeting with fellow officers—became a double-edged sword. While it could shield him from suspicion, the vague timing left room for doubt. As whispers of the investigation began to circulate, Ivor's heart raced, knowing that one misstep could unravel everything he had fought to protect. The pressure weighed heavily on him, twisting his sense of duty into a potential liability.",
      "Ivor's sardonic humor often masked the turmoil within. He understood the absurdity of his situation, yet he remained committed to maintaining a facade of control. With each interaction, he navigated a treacherous landscape of suspicion, trying to deflect attention from his financial woes while desperately seeking a way to extricate himself from the mess he had created. Duty called, but it often whispered sweet nothings that led him into darkness.",
      "As the investigation progressed, Ivor faced a reckoning. Would he sacrifice everything to protect his sister, or would he find a way to confront his debts and emerge with his integrity intact? The choices he made in the coming days would define not only his career but the very essence of who he was—a man caught between the expectations of duty and the shadows of his past."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An ambitious socialite with a keen eye for opportunity, Beatrice's desire for wealth leads her down a dark path of sabotage.",
    "publicPersona": "A glamorous socialite eager to climb the social ladder, known for her wit and charm.",
    "privateSecret": "Has been secretly sabotaging others to gain favor with powerful families.",
    "motiveSeed": "Believes eliminating the victim would clear her path to marry into a wealthy family.",
    "motiveStrength": "strong",
    "alibiWindow": "Was seen dancing at the lobby bar, but could have easily slipped away.",
    "accessPlausibility": "easy",
    "stakes": "Her social ambitions depend on maintaining a façade of respectability.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks in an effervescent manner, often using flowery language and charming anecdotes. She enjoys turning phrases with a sharp edge, revealing her underlying ruthlessness.",
    "signatureTic": "One must always keep one’s enemies close, darling.",
    "internalConflict": "Beatrice is torn between her ruthless ambition and the realization that her actions may lead to isolation and emptiness.",
    "personalStakeInCase": "The murder investigation holds immense importance for Beatrice, as any hint of scandal could shatter her carefully constructed image and derail her social ambitions.",
    "paragraphs": [
      "Beatrice Quill, a glamorous socialite with a penchant for charm and wit, had her sights set firmly on the pinnacle of society. Her ambition knew no bounds, and she maneuvered through the opulent halls of the hotel with the grace of a dancer, always seeking opportunities to climb the social ladder. Yet, beneath her polished exterior lay a darker ambition—one that drove her to sabotage others in her quest for power and wealth.",
      "When the news of Hugo Vane's murder spread like wildfire, Beatrice's heart raced with a mix of fear and exhilaration. She had been seen dancing at the lobby bar, a perfect alibi, yet the thrill of the chase ignited her imagination. In her mind, eliminating the victim had been a necessary step towards securing her future, a means of clearing the path to marry into one of the wealthiest families. The stakes were high, and she was determined to maintain her façade of respectability at all costs.",
      "Beatrice's polite savagery often masked her ruthless nature, allowing her to charm and disarm those around her. She reveled in the art of conversation, spinning tales that captivated her audience while concealing her true intentions. Yet, as the investigation unfolded, she began to grapple with the realization that her actions might lead to isolation—her ambition could ultimately cost her the genuine connections she craved.",
      "As she navigated the treacherous waters of social intrigue, Beatrice faced a critical choice. Would she continue down the path of ruthless ambition, risking everything for the sake of wealth and status, or would she find a way to forge meaningful connections that transcended the superficial? The murder investigation provided a backdrop for her internal struggle, challenging her to confront the emptiness that lay beneath her glamorous existence."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "A passionate artist with a bohemian spirit, Sylvia's frustrations with the elite inspire a dark critique that intertwines with the murder investigation.",
    "publicPersona": "A passionate artist known for her bohemian lifestyle and outspoken opinions.",
    "privateSecret": "Sylvia's latest painting is a brutal critique of the elite, inspired by her frustrations with the social elite, including the victim.",
    "motiveSeed": "Felt betrayed as the victim had copied her earlier work and claimed it as their own.",
    "motiveStrength": "moderate",
    "alibiWindow": "In her studio at the hotel during the murder, but she could have left without anyone noticing.",
    "accessPlausibility": "possible",
    "stakes": "Her career hinges on her ability to gain recognition for her work.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with a passionate cadence, often layering her speech with vivid imagery and emotional undertones. She has a tendency to become animated when discussing her art, punctuating her thoughts with dramatic gestures.",
    "signatureTic": "Art is the only truth that matters, don't you think?",
    "internalConflict": "Sylvia wrestles with feelings of betrayal and anger towards the elite, questioning whether her art can truly make an impact in a world that often dismisses her voice.",
    "personalStakeInCase": "The murder investigation holds personal significance for Sylvia, as it threatens to overshadow her artistic achievements and the recognition she desperately seeks.",
    "paragraphs": [
      "Sylvia Trent, a passionate artist with a bohemian spirit, roamed the halls of the grand hotel with a sense of defiance. Her latest painting, a brutal critique of the elite, was a direct response to her frustrations with the very people who surrounded her, including the victim, Hugo Vane. As a voice of the marginalized, she channeled her anger into her work, believing that art could illuminate the dark truths of society.",
      "When the murder occurred, Sylvia was absorbed in her studio, creating a piece that reflected her disdain for the social elite. While she had an alibi, the possibility of having slipped away without notice gnawed at her. The stakes were high; she craved recognition for her art, yet the murder investigation threatened to eclipse her achievements. Would her voice be drowned out in the chaos of scandal and suspicion?",
      "Observational and often poignant, Sylvia's speech reflected her artistic sensibilities. She spoke with passion, layering her words with vivid imagery that captivated those around her. Yet, beneath her fervor lay a deep-seated anger towards the elite who had betrayed her trust—Hugo, in particular, had copied her earlier work and claimed it as his own, igniting a fire within her that fueled her latest creation.",
      "As the investigation unfolded, Sylvia faced a crossroads. Would she allow her art to be overshadowed by the darker elements of social intrigue, or would she rise above, using her voice to challenge the status quo? The murder not only threatened her career but also forced her to confront the very essence of her artistic identity, revealing deeper personal truths that could either liberate or ensnare her."
    ],
    "order": 5
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Oceanic Grandeur",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand Art Deco hotel perched on a seaside bluff, offering sweeping ocean views and a sense of elegance tinged with secrecy.",
    "visualDescription": "The hotel boasts sweeping curves and geometric patterns, with polished brass fixtures and intricate glasswork. The lobby features a grand staircase leading to a sunlit terrace, while the dining areas are adorned with ocean-blue upholstery and soft, ambient lighting.",
    "atmosphere": "An air of sophistication laced with unease, where whispers of wartime secrets linger in the corners.",
    "paragraphs": [
      "As guests arrive at The Oceanic Grandeur, they are greeted by the shimmering façade reflecting the sun's rays, yet the atmosphere buzzes with an undercurrent of tension. The lobby, a masterpiece of Art Deco design, resonates with the sound of soft jazz from a nearby radio, but the occasional hushed conversation reveals a different narrative—one of hidden truths and unspoken worries. The scent of saltwater mingles with the rich aroma of brewed coffee, creating a dissonance that mirrors the guests' unease.",
      "In the dining areas, the clinking of fine china and the soft murmur of polite conversation offer a veneer of normalcy, yet the guests' eyes dart toward the windows, where fog occasionally rolls in from the ocean, shrouding the hotel in an eerie embrace. The waitstaff, clad in crisp uniforms, navigate the narrow hallways with practiced ease, but their expressions betray a lingering apprehension—rumors of a clandestine meeting scheduled for the rooftop terrace swirl among them, heightening the tension in the air.",
      "As evening descends, the hotel transforms under the glow of ornate sconces, casting elongated shadows on the polished floor. The distant sound of waves crashing against the cliffs becomes a haunting backdrop to the unfolding drama. Guests linger at their tables, their laughter tinged with nervousness, while the scent of grilled seafood wafts through the air, momentarily distracting from the secrets that threaten to surface. The rooftop terrace, now off-limits to many, looms like a dark specter, whispering of hidden dangers and unanticipated revelations."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Cool and breezy, typical of a coastal summer with occasional fog rolling in from the ocean.",
    "timeFlow": "Days of mounting tension leading to a pivotal confrontation.",
    "mood": "Tense, as whispers of wartime secrets and post-war anxieties permeate the air.",
    "eraMarkers": [
      "Art Deco architecture",
      "radio broadcasting in the lobby",
      "rationed wartime vehicles outside"
    ],
    "sensoryPalette": {
      "dominant": "Salt-laden ocean breeze",
      "secondary": [
        "Aromas of grilled seafood",
        "Soft jazz melodies from the radio"
      ]
    },
    "paragraphs": [
      "The Oceanic Grandeur stands as a sentinel over the crashing waves, its Art Deco lines both elegant and imposing. The salty tang of the sea fills the air, mingling with the faint scent of jasmine from the terrace gardens. Inside, the atmosphere is thick with anticipation, as guests navigate the narrow hallways, their laughter a fragile façade against the weight of unspoken fears. The distant sound of a foghorn punctuates the backdrop, a reminder of the isolation this coastal retreat embodies.",
      "As the sun dips below the horizon, the hotel glows with warm light, casting a golden hue on the polished surfaces. Yet, the air grows heavy with tension; hushed conversations swirl around the lavish dining tables, where worries of rationing and wartime losses linger in the minds of the patrons. The rhythmic crash of the surf serves as a constant reminder of the outside world's chaos, contrasting sharply with the intimate gatherings within the hotel’s walls."
    ]
  },
  "keyLocations": [
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "High ceilings with ornate chandeliers, polished marble floors, and plush seating areas.",
      "sensoryDetails": {
        "sights": [
          "gleaming marble floors",
          "ornate chandeliers overhead",
          "vibrant floral arrangements",
          "polished brass fixtures"
        ],
        "sounds": [
          "soft jazz from a radio",
          "murmurs of conversation",
          "footsteps on marble",
          "clinking of glasses"
        ],
        "smells": [
          "freshly brewed coffee",
          "salty ocean air",
          "floral perfume",
          "old leather furniture"
        ],
        "tactile": [
          "smooth marble surfaces",
          "soft upholstery of armchairs",
          "cool brass railings",
          "textured wallpaper"
        ]
      },
      "accessControl": "Open to all guests; staff-only access to back offices and service areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops on glass doors",
            "cloudy light filtering in",
            "wet footprints on the floor"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft chatter of early risers",
            "distant thunder"
          ],
          "smells": [
            "damp earth",
            "freshly brewed tea",
            "wet stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light through clouds",
            "shadows stretching across the floor"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the creak of old timbers"
          ],
          "smells": [
            "beeswax polish",
            "dusty books",
            "old wood"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from sconces",
            "long shadows across the lobby"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "laughter from the dining room"
          ],
          "smells": [
            "candle wax",
            "tobacco smoke",
            "freshly polished floors"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Lobby of The Oceanic Grandeur welcomes guests with its high ceilings and ornate chandeliers that glimmer like stars against the polished marble. Bright floral arrangements punctuate the space, while plush seating areas invite weary travelers to rest. However, beneath the elegance lies a current of tension, as guests whisper in hushed tones, their eyes darting toward the entrance, awaiting news that may change everything.",
        "As the day wears on, the atmosphere shifts; the sounds of laughter and clinking glasses mingle with the soft jazz from a vintage radio, but the undercurrent of anxiety remains palpable. The fragrance of fresh coffee and the salty tang of the sea create an inviting ambiance, yet the coldness of the marble beneath their fingertips serves as a reminder of the secrets hidden within these walls."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Oceanview Dining Room",
      "type": "interior",
      "purpose": "Dining area",
      "visualDetails": "Elegant dining tables with ocean views, soft lighting, and Art Deco-inspired decor.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware on crisp white linens",
          "ocean waves visible through large windows",
          "vibrant floral centerpieces",
          "softly glowing sconces"
        ],
        "sounds": [
          "clattering of dishes",
          "laughter and conversation",
          "the distant sound of waves",
          "soft music playing"
        ],
        "smells": [
          "grilled seafood and herbs",
          "freshly baked bread",
          "citrus from desserts",
          "fine wine"
        ],
        "tactile": [
          "smooth tablecloths",
          "cold glassware",
          "warm bread rolls",
          "soft leather chairs"
        ]
      },
      "accessControl": "Open to all guests during meal times; reservation required for private dining events.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "puddles forming outside",
            "raindrops tapping against windows",
            "grey light filtering in"
          ],
          "sounds": [
            "dripping water from eaves",
            "soft conversations",
            "the clink of coffee cups"
          ],
          "smells": [
            "fresh pastries",
            "wet earth",
            "cooked bacon"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light across the tables",
            "shadows from window frames",
            "distant fog over the sea"
          ],
          "sounds": [
            "muffled conversations",
            "the clink of utensils",
            "the rustle of napkins"
          ],
          "smells": [
            "roasted meats",
            "aromatic spices",
            "sweet desserts"
          ],
          "mood": "somber reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candle flames dancing",
            "glimmering reflections on glass",
            "patrons toasting with glasses raised"
          ],
          "sounds": [
            "the murmur of conversations",
            "the pop of a champagne cork",
            "laughter echoing"
          ],
          "smells": [
            "rich sauces",
            "dark chocolate",
            "fresh herbs"
          ],
          "mood": "celebratory yet tense"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room offers breathtaking vistas of the ocean, where guests dine beneath soft lighting that casts a warm glow over their meals. Each table is adorned with crisp white linens and gleaming silverware, the ambiance both elegant and inviting. Yet, as laughter rings out, there is an undercurrent of tension, as patrons exchange glances, aware that beneath the surface of their fine dining, secrets simmer just below.",
        "As the evening unfolds, the clinking of glasses and the soft music create a soundtrack to the unfolding drama. The aroma of grilled seafood and the scent of fine wine linger in the air, yet the guests' smiles often flicker with unease. The ocean waves crash against the cliffs outside, a reminder of the isolation that surrounds the hotel, creating a cocoon where secrets can thrive."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Restricted access area for private events",
      "visualDetails": "Panoramic views of the sea, elegant seating, and atmospheric lighting.",
      "sensoryDetails": {
        "sights": [
          "twinkling stars above",
          "moonlight reflecting off the water",
          "silhouettes of guests mingling",
          "flickering candles on tables"
        ],
        "sounds": [
          "distant waves crashing",
          "soft laughter",
          "the rustling of leaves",
          "the whisper of the wind"
        ],
        "smells": [
          "night-blooming jasmine",
          "cool sea breeze",
          "smoky charcoal from grilling",
          "freshly mixed cocktails"
        ],
        "tactile": [
          "cool stone underfoot",
          "soft cushions on chairs",
          "gentle breeze against skin",
          "smooth glass of a cocktail"
        ]
      },
      "accessControl": "Restricted to invited guests; staff-only access during private events.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "cloudy skies obscuring the view",
            "rain-soaked furniture",
            "dripping foliage"
          ],
          "sounds": [
            "pattering rain on surfaces",
            "distant thunder",
            "soft rustling of wet leaves"
          ],
          "smells": [
            "fresh rain",
            "damp wood",
            "wet earth"
          ],
          "mood": "dreary and isolating"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey clouds hanging low",
            "distant ships barely visible",
            "fading light"
          ],
          "sounds": [
            "the distant sound of seagulls",
            "the creaking of metal railings",
            "the hush of wind"
          ],
          "smells": [
            "salty sea air",
            "mildew from damp furniture",
            "scent of wet stone"
          ],
          "mood": "foreboding"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "city lights twinkling below",
            "stars dotting the sky",
            "the moon casting silver light"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "the soft crash of waves",
            "the whisper of the wind"
          ],
          "smells": [
            "freshly mixed cocktails",
            "night-blooming jasmine",
            "grilled seafood"
          ],
          "mood": "romantic yet tense"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace presents an enchanting escape, offering panoramic views of the ocean and the twinkling lights of the city below. Flickering candles cast a warm glow against the cool night, while soft laughter and the rustling of leaves create an inviting ambiance. However, the air is thick with tension, as whispered secrets and furtive glances suggest that not all is well among the guests gathered here.",
        "As the evening unfolds, the scent of night-blooming jasmine mingles with the aroma of grilled seafood, creating a sensory delight. But the gentle breeze carries an edge of unease, as the guests lean closer to hear each other over the sound of crashing waves. The rooftop, while a place of beauty, feels like a stage set for a drama that is about to reach its climax."
      ]
    },
    {
      "id": "staff_quarters",
      "name": "The Staff Quarters",
      "type": "interior",
      "purpose": "Private area for hotel staff",
      "visualDetails": "Simple furnishings, a communal kitchen, and a small lounge area.",
      "sensoryDetails": {
        "sights": [
          "dimly lit corridor",
          "functional furnishings",
          "stacks of linens",
          "staff uniforms hanging"
        ],
        "sounds": [
          "soft chatter among staff",
          "the clattering of dishes",
          "the hum of a kettle boiling",
          "the rustle of cleaning supplies"
        ],
        "smells": [
          "cleaning solutions",
          "warm bread from the kitchen",
          "fresh linens",
          "faint scent of sweat"
        ],
        "tactile": [
          "rough fabric of uniforms",
          "cold metal of kitchen utensils",
          "soft blankets on chairs",
          "hard floor tiles"
        ]
      },
      "accessControl": "Staff-only; restricted access to guests at all times.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water dripping from the eaves",
            "fog obscuring windows",
            "dim light filtering through"
          ],
          "sounds": [
            "soft murmurs of conversation",
            "the patter of rain",
            "the clinking of dishes"
          ],
          "smells": [
            "wet earth",
            "freshly baked pastries",
            "clean linens"
          ],
          "mood": "busy yet subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "faded light in the corridor",
            "shadows creeping in corners",
            "staff bustling about"
          ],
          "sounds": [
            "the hum of the refrigerator",
            "the rustle of cleaning supplies",
            "the distant sound of guests"
          ],
          "smells": [
            "faint scent of mildew",
            "cleaning products",
            "cooked vegetables"
          ],
          "mood": "stifled urgency"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "soft glow of overhead lights",
            "staff relaxing in the lounge",
            "the last of the day's tasks being completed"
          ],
          "sounds": [
            "laughter and chatter",
            "the sound of a kettle boiling",
            "the clink of silverware"
          ],
          "smells": [
            "warm bread from the kitchen",
            "freshly brewed tea",
            "the scent of cleaning products"
          ],
          "mood": "relaxed but watchful"
        }
      ],
      "paragraphs": [
        "The Staff Quarters of The Oceanic Grandeur are a stark contrast to the opulence of the guest areas, with simple furnishings and a communal kitchen that buzzes with activity. The dimly lit corridor is lined with functional pieces, and the air is filled with the scent of freshly baked pastries mingling with cleaning solutions. Staff members bustle about, their soft chatter punctuated by the clattering of dishes, as they prepare for the next wave of guests.",
        "As evening approaches, the atmosphere shifts; laughter and camaraderie fill the lounge area, yet an undercurrent of tension remains palpable. The staff knows the secrets that swirl around the hotel, and their watchful eyes reflect the weight of their knowledge. The contrast between their humble surroundings and the grandeur of the guest spaces serves as a constant reminder of the hidden truths that lie just beyond their reach."
      ]
    }
  ],
  "note": "",
  "cost": 0.00233548095,
  "durationMs": 40497
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "April",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "cool breezes off the ocean",
      "occasional fog rolling in",
      "overcast skies punctuated by brief sunny spells"
    ],
    "daylight": "Long spring days with daylight stretching until nearly eight o'clock in the evening, though darkness falls swiftly thereafter.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, when the hotel is at its most vibrant yet shadowy.",
    "holidays": [
      "Easter Sunday (April 14, 1940)"
    ],
    "seasonalActivities": [
      "spring cleaning in homes",
      "visiting local parks for blooming flowers",
      "attending Easter gatherings"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "lightweight wool fedora",
        "white dress shirt with a narrow tie"
      ],
      "casual": [
        "khaki trousers",
        "button-down cotton shirt",
        "leather loafers"
      ],
      "accessories": [
        "silk pocket square",
        "watch with a leather band",
        "cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with floral patterns",
        "tailored blazer",
        "straw hat adorned with ribbons"
      ],
      "casual": [
        "A-line skirt with a fitted blouse",
        "light cardigan",
        "ballet flats"
      ],
      "accessories": [
        "string of pearls",
        "clutch bag",
        "silk scarf"
      ]
    },
    "trendsOfTheMoment": [
      "emphasis on tailoring and fit",
      "use of pastel colors in spring fashion",
      "hats becoming essential accessories"
    ],
    "socialExpectations": [
      "men expected to wear hats outdoors",
      "women encouraged to maintain a polished appearance",
      "social gatherings emphasize conservative dress"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Nazi Germany invades Denmark and Norway (April 9, 1940)",
      "political debates over military support in Britain",
      "increased enlistment in armed forces as war tensions rise"
    ],
    "politicalClimate": "Heightened anxiety about the implications of German expansion and the need for military readiness.",
    "economicConditions": "Strains on the economy due to war preparations, with rationing beginning to be discussed.",
    "socialIssues": [
      "displacement of families due to war",
      "growing concerns about air raid preparedness",
      "women's rights in the workforce"
    ],
    "internationalNews": [
      "French and British forces mobilizing in response to German aggression",
      "diplomatic efforts to negotiate peace faltering"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "“In the Mood” by Glenn Miller",
        "“I'll Be Seeing You” by Bing Crosby",
        "“As Time Goes By” by Herman Hupfeld"
      ],
      "films": [
        "“The Great Dictator” directed by Charlie Chaplin",
        "“The Grapes of Wrath” directed by John Ford",
        "“The Letter” starring Bette Davis"
      ],
      "theater": [
        "“The Philadelphia Story” by Philip Barry",
        "“My Sister Eileen” by Joseph Fields and Jerome Chodorov"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "The Lone Ranger"
      ]
    },
    "literature": {
      "recentPublications": [
        "“For Whom the Bell Tolls” by Ernest Hemingway",
        "“The Grapes of Wrath” by John Steinbeck",
        "“The Maltese Falcon” by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "war novels",
        "romantic fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "first successful radar systems deployed",
        "advancements in military communication technologies"
      ],
      "commonDevices": [
        "radio sets in most homes",
        "typewriters used widely in offices"
      ],
      "emergingTrends": [
        "increased availability of automobiles",
        "early development of production techniques for war materials"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Cigarettes (20 pack): one shilling",
        "Daily newspaper: three halfpence"
      ],
      "commonActivities": [
        "attending local community meetings",
        "engaging in war bond drives",
        "socializing at local cafés"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "weekly visits to local churches",
        "community picnics in the springtime"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing concern for the working class as war impacts jobs",
      "emphasis on patriotism across all classes"
    ],
    "gender": [
      "women increasingly taking on roles in the workforce",
      "traditional gender roles being challenged but still prevalent"
    ],
    "race": [
      "racial tensions simmering, especially with anti-immigration sentiments rising",
      "increased awareness of racial injustices"
    ],
    "generalNorms": [
      "community support for military efforts",
      "deference to authority figures in times of crisis",
      "growing acceptance of women in public roles"
    ]
  },
  "atmosphericDetails": [
    "The scent of blooming daffodils mingles with the salty tang of the ocean air, creating a refreshing yet tense atmosphere.",
    "The soft echoes of jazz music filter through the hotel, accompanied by the muffled chatter of guests exchanging rumors of Europe’s unrest.",
    "The coastal fog rolls in unexpectedly, shrouding the hotel in mystery, as the shadows lengthen and secrets seem to lurk in every corner."
  ],
  "paragraphs": [
    "April 1940 ushers in the delicate balance of spring, where blooms are vibrant against the backdrop of a nation on edge. The coastal hotel, perched on the cliffs, captures both the beauty of the season and the tension of the times. With cool breezes from the ocean and occasional fog rolling in, the atmosphere is thick with whispers of war. Families gather for Easter celebrations, yet the specter of conflict looms as news of Nazi advances in Europe reaches even the most remote corners of England.",
    "Fashion in this moment reflects both a sense of resilience and an adherence to tradition. Men don tailored navy suits with crisp white shirts, hats perched jauntily atop their heads, while women favor tea-length dresses adorned with floral patterns, their outfits completed by elegant accessories like silk scarves and string of pearls. The emphasis on appearance is more than mere vanity; it is a statement of stability in an unstable world, a way to maintain dignity amid the uncertainty of war.",
    "Daily life is marked by a sense of community, as neighbors gather to discuss the implications of global events over cups of tea. Local parks are filled with families enjoying the spring blooms, a brief respite from the grim realities of rationing and economic strain. The price of essentials is rising, yet the spirit of the people remains unbroken. Social rituals, such as Sunday family dinners and community picnics, create bonds of support and camaraderie, essential for weathering the storm of what is to come."
  ],
  "note": "",
  "cost": 0.0010476229500000001,
  "durationMs": 17840
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a prestigious seaside hotel for a wartime reunion exposes tensions among guests, as secrets and ambitions collide under the strain of post-war anxieties and shifting social roles.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII has led to women entering the workforce, creating class tensions as traditional roles are challenged, while emerging Cold War fears amplify the pressure on personal loyalties."
  },
  "setting": {
    "location": "A grand, Art Deco seaside hotel with ocean views",
    "institution": "hotel",
    "weather": "Cool and breezy, typical of a coastal summer with occasional fog rolling in from the ocean."
  },
  "castAnchors": [
    "Eleanor Voss",
    "Dr. Mallory Finch",
    "Captain Ivor Hale",
    "Beatrice Quill",
    "Sylvia Trent",
    "Hugo Vane"
  ],
  "theme": "Golden Age murder driven by a delayed-action poison method, where the toxicology and dosage timing conceal when the fatal dose was actually administered."
}

### LOCKED_FACTS
[
  {
    "id": "event_time",
    "value": "twenty minutes past eight",
    "description": "The specific time at which the toast was made."
  },
  {
    "id": "drink_volume",
    "value": "six ounces",
    "description": "The volume of the drink in which the poison was mixed."
  },
  {
    "id": "poison_weight",
    "value": "one ounce",
    "description": "The amount of poison used in the drink."
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
      "category": "testimonial"
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
      "category": "spatial"
    },
    {
      "id": "clue_7",
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
      "id": "clue_8",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_9",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_10",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
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
      "category": "spatial"
    },
    {
      "id": "clue_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_2",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
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

# Actual Prompt Record

- Run ID: `mystery-1784256689298`
- Project ID: ``
- Timestamp: `2026-07-17T02:55:36.346Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `56ee0105f4a5863e`

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
    "title": "Tides of Deception",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Seaside Hotel",
      "place": "Brighton",
      "country": "England",
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
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "A sharp-witted investigator with a keen eye for detail.",
      "private_secret": "Struggles with self-doubt after the war.",
      "motive_seed": "Desire for truth.",
      "motive_strength": "strong",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Investigative access to all hotel areas"
      ],
      "behavioral_tells": [],
      "stakes": "Personal satisfaction in solving a case.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Witness",
      "relationships": [
        "Hugo Vane (friend)"
      ],
      "public_persona": "Respected local physician.",
      "private_secret": "Has a history of anxiety about professional reputation.",
      "motive_seed": "Concern for reputation.",
      "motive_strength": "moderate",
      "alibi_window": "9 PM to 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to medical supplies"
      ],
      "behavioral_tells": [],
      "stakes": "Reputation and career.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Beatrice Quill (former colleague)"
      ],
      "public_persona": "Retired naval officer, respected in the community.",
      "private_secret": "Burdened by guilt over a past incident.",
      "motive_seed": "Fear of being exposed.",
      "motive_strength": "moderate",
      "alibi_window": "8 PM to 9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to beach area"
      ],
      "behavioral_tells": [],
      "stakes": "Maintaining reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [
        "Hugo Vane (acquaintance)"
      ],
      "public_persona": "Charming and sociable hotel hostess.",
      "private_secret": "Involved in a blackmail scheme.",
      "motive_seed": "Financial gain.",
      "motive_strength": "strong",
      "alibi_window": "7 PM to 9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to guest rooms"
      ],
      "behavioral_tells": [],
      "stakes": "Financial stability.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [
        "Hugo Vane (rival)"
      ],
      "public_persona": "Aspiring actress, known for her beauty.",
      "private_secret": "Harbors jealousy towards Vane.",
      "motive_seed": "Career advancement.",
      "motive_strength": "moderate",
      "alibi_window": "8 PM to 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Access to hotel grounds"
      ],
      "behavioral_tells": [],
      "stakes": "Career success.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [
        "Dr. Mallory Finch (friend)",
        "Captain Ivor Hale (rival)"
      ],
      "public_persona": "Wealthy businessman.",
      "private_secret": "Involved in shady deals.",
      "motive_seed": "N/A",
      "motive_strength": "none",
      "alibi_window": "N/A",
      "access_plausibility": "N/A",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Beatrice Quill"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a stormy night at a seaside hotel, Hugo Vane is found drowned. Investigations reveal conflicting evidence regarding the tide and witness accounts, leading Eleanor Voss to uncover a web of deceit and blackmail."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The timing of the tide's rise and the victim's last known movements contradict each other, suggesting an impossible scenario.",
      "delivery_path": [
        {
          "step": "The victim appeared to have drowned during high tide, as indicated by a nearby tide chart."
        },
        {
          "step": "The tide was at its lowest point when the victim was last seen, making drowning at that time implausible."
        }
      ]
    },
    "outcome": {
      "result": "Beatrice Quill's alibi collapses under scrutiny, revealing her guilt."
    }
  },
  "false_assumption": {
    "statement": "Hugo Vane drowned during high tide.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witness accounts and the tide chart suggest that the drowning occurred during high tide.",
    "what_it_hides": "The tide was actually at its lowest point when the victim was last seen."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Witnesses claim he was seen arguing with Vane shortly before the incident.",
      "His alibi is unverified for the time around the drowning."
    ],
    "the_one_flaw": "Captain Hale was seen in the hotel lobby at the time of drowning, as confirmed by multiple guests.",
    "refuted_in_chapter": 5
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses report seeing Captain Hale near the beach shortly before the drowning.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "He was actually assisting a lost child back to the hotel.",
      "resolved_in_chapter": 4
    },
    {
      "id": "red_herring_2",
      "description": "Dr. Mallory Finch's anxiety about her reputation leads others to suspect her involvement.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "Her concern stemmed from her role as a physician and witnessing a tragedy.",
      "resolved_in_chapter": 4
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
    "rationale": "All characters are guests or staff at the hotel, with no outsiders involved."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Tide chart showing low tide",
        "Witness testimony"
      ],
      "windows": [
        "9 PM to 10 PM"
      ],
      "contradictions": [
        "Witnesses claim the victim drowned at high tide, yet tide charts show otherwise."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill",
        "Sylvia Trent"
      ],
      "objects": [
        "Tide chart",
        "Weather vane",
        "Hotel clock"
      ],
      "permissions": [
        "Access to the beach area",
        "Access to victim's belongings"
      ]
    },
    "physical": {
      "laws": [
        "Tides affect water levels based on gravitational pull"
      ],
      "traces": [
        "Footprints leading to the beach but not indicating a struggle"
      ]
    },
    "social": {
      "trust_channels": [
        "Local gossip",
        "Witness accounts"
      ],
      "authority_sources": [
        "Hotel management",
        "Local authorities"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Tide chart indicates low tide at 8:30 PM.",
        "correction": "This contradicts the claim that Hugo drowned during high tide.",
        "effect": "Narrows the investigation focus away from Captain Hale.",
        "required_evidence": [
          "Tide chart showing low tide at 8:30 PM",
          "Witness testimony stating Hugo was last seen at 8:15 PM"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report conflicting times for the event.",
        "correction": "Inconsistencies in witness accounts suggest a misinterpretation of the timing.",
        "effect": "Eliminates Dr. Mallory Finch as a suspect due to her verified alibi.",
        "required_evidence": [
          "Witness statements with varying timelines",
          "Dr. Finch's alibi confirmed by hotel staff"
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints lead to the beach without signs of struggle.",
        "correction": "The absence of struggle indicates the victim was lured or trapped.",
        "effect": "Points towards Beatrice Quill's involvement.",
        "required_evidence": [
          "Footprints leading to the beach",
          "Witness accounts of Beatrice's interactions with Hugo"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the tide chart with witness accounts reveals inconsistencies.",
    "knowledge_revealed": "The tide was at its lowest during the claimed time of death.",
    "pass_condition": "If Beatrice Quill's statements cannot align with the tide chart evidence, her guilt is confirmed.",
    "evidence_clues": [
      "clue_4",
      "clue_10",
      "clue_11"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The tide chart shows low tide before the drowning, allowing readers to question the timeline. Step 2: Witness inconsistencies eliminate Dr. Finch as a suspect. Step 3: The footprints lead to Beatrice's involvement, confirmed by the discriminating test."
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
      "test_type": "temporal comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 3,
        "clearance_method": "Verified hotel lobby presence during the time of drowning.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 3,
        "clearance_method": "Confirmed alibi by hotel staff.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: 8 PM to 10 PM",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_4",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation of the tide chart."
      },
      {
        "clue_id": "clue_id_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness interviews revealing inconsistencies."
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
        "clue_id": "clue_10",
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
        "delivery_method": "Behavioral observation"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_id_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Dr. Finch's alibi confirmed by staff."
      },
      {
        "clue_id": "clue_id_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Footprints leading to the beach."
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a local journalist with a knack for hard-hitting stories, finds herself entangled in a web of deception at a seaside hotel.",
    "publicPersona": "Outspoken and sharp-witted, Eleanor is known for her hard-hitting articles on social issues.",
    "privateSecret": "She has been secretly investigating the hotel’s ties to post-war black market dealings.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "Arrived at the hotel late afternoon for an interview with the victim.",
    "accessPlausibility": "easy",
    "stakes": "Desire to uncover the truth and protect her community's reputation.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a confident cadence, often punctuating her points with biting remarks. She has a habit of raising an eyebrow when skeptical, and her tone shifts from journalistic detachment to passionate conviction when discussing injustice.",
    "signatureTic": "You know what they say, the pen is mightier than the sword.",
    "internalConflict": "Eleanor grapples with the fear that her investigative pursuits might lead to her ostracization from the very community she seeks to protect, particularly if her suspicions about the hotel’s dealings are proven true.",
    "personalStakeInCase": "This crime matters to Eleanor as it directly threatens her efforts to expose corruption and uphold the integrity of her community.",
    "paragraphs": [
      "Eleanor Voss had always believed that truth was a currency too precious to waste, yet here she stood at the edge of a seaside hotel, a place where the salty breeze mingled with whispers of deceit. Her reputation as a sharp-witted journalist preceded her, but the stakes had never felt higher. A murder, the victim a man whose charm was only eclipsed by his secrets, had thrown the hotel into a maelstrom of suspicion and intrigue. As she stepped through the ornate doors, her instincts screamed that this was more than just a tragic event; it was a story waiting to be uncovered.",
      "With each question she posed to the hotel staff, Eleanor felt the weight of her dual life pressing upon her. While she projected the image of a relentless investigator, her heart was heavy with the knowledge of her own secret inquiries into the hotel’s post-war dealings. What if her pursuit of the truth led to her own downfall? The thought haunted her like a specter, but the thought of letting her community down was unbearable. She steeled herself, determined to navigate the treacherous waters of deception, where every revelation could be a double-edged sword.",
      "Eleanor’s method of communication was both a shield and a weapon. Her dry wit often disarmed those she questioned, allowing her to probe deeper into their motives and fears. As she engaged with the suspects, she couldn’t help but notice the subtle shifts in their demeanor—flinches, eye darts, and the way their smiles faltered at the mention of the victim. She thrived on these nuances, but with each interaction, the shadows of her own secrets loomed larger, threatening to engulf her.",
      "The hotel’s reputation hung in the balance, and Eleanor knew she was the only one who could protect it. As she delved deeper into the murky waters of the investigation, she felt the call of her journalistic integrity clashing with her personal stakes. Would she risk everything she had built for the sake of a community that might not appreciate her sacrifices? With resolve, she pressed on, determined to unveil the truth, even if it meant facing her own demons in the process."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, a respected psychiatrist, finds herself in a precarious position as her professional rivalry with the victim comes to light.",
    "publicPersona": "Respected in her field, Dr. Finch runs a busy practice and is known for her innovative treatments.",
    "privateSecret": "She recently lost a major grant to the victim due to a professional conflict.",
    "motiveSeed": "Resentment over the victim’s supposed sabotage of her career.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claims to have been in her room reviewing patient files.",
    "accessPlausibility": "possible",
    "stakes": "Career advancement and professional reputation.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Dr. Finch speaks with an air of authority, her words carefully chosen and often laced with a biting edge. She has a tendency to punctuate her sentences with a slight smile that belies her true feelings, and her laughter can be both charming and chilling.",
    "signatureTic": "Ah, the tangled web of human emotion.",
    "internalConflict": "Dr. Finch is torn between her professional ambition and the gnawing resentment she feels towards the victim, leading her to question whether she is capable of true compassion or merely driven by envy.",
    "personalStakeInCase": "This crime matters to Dr. Finch as it jeopardizes her career and the reputation she has worked tirelessly to build.",
    "paragraphs": [
      "Dr. Mallory Finch was no stranger to the pressures of a competitive field, but the murder of Hugo Vane had cast a shadow over her carefully constructed life. As a psychiatrist, she was trained to navigate the complexities of the human mind, yet she found herself ensnared in a web of resentment and ambition. Losing a significant grant to Vane had stung, and now, with his death, the stakes had never been higher. Would her professional reputation withstand the scrutiny that would inevitably follow?",
      "In public, Dr. Finch maintained an image of respect and authority, her charming demeanor disarming even the most skeptical of patients. But behind closed doors, she wrestled with the bitterness that had begun to fester since Vane's ascent. The whispers of sabotage echoed in her mind, and as she navigated the investigation, her polite savagery surfaced in the way she spoke to those around her. She had a knack for turning a compliment into a subtle jab, and her laughter often carried an undercurrent of disdain.",
      "The alibi she presented seemed plausible enough—reviewing patient files in the solitude of her room. But what lay beneath that veneer of professionalism? Dr. Finch’s internal conflict gnawed at her, forcing her to confront the darker aspects of her ambition. Was she merely a pawn in a game of rivalry, or was there a deeper truth lurking within her psyche? Each interaction with the other suspects brought her face-to-face with her own insecurities, and she couldn't help but question the lengths she might go to protect her career.",
      "As the investigation unfolded, Dr. Finch felt the pressure mounting. The stakes were high, and the threat of exposure loomed large. Her relationship with the victim had been fraught with tension, and now, with the police closing in, she had to decide whether to embrace her ambition or confront the jealousy that had clouded her judgment. In the end, she knew that the truth would emerge, but the question remained: would she be able to face the consequences of her actions, or would she allow the shadows of her past to consume her?"
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer with a charming demeanor, conceals a troubling past that intertwines with the victim's fate.",
    "publicPersona": "A charming gentleman, Captain Hale is well-liked but has mysterious past ties to the victim.",
    "privateSecret": "He was involved in a morally questionable operation during the war that the victim threatened to expose.",
    "motiveSeed": "Fear of exposure and loss of reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "Dining with guests during the time of the murder.",
    "accessPlausibility": "unlikely",
    "stakes": "Preservation of his honorable image and past.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Captain Hale speaks with a smooth, confident tone, often punctuating his sentences with a sardonic twist. He has a habit of using nautical metaphors, drawing on his naval background, and his laughter can be both warm and unsettling.",
    "signatureTic": "Ahoy, matey, life’s a tempest, isn't it?",
    "internalConflict": "Captain Hale is haunted by the shadows of his past, wrestling with the guilt of his wartime actions while desperately trying to maintain the façade of an honorable man.",
    "personalStakeInCase": "This crime matters to Captain Hale as it threatens to unravel the carefully constructed image he has built since his retirement, exposing the man he truly is.",
    "paragraphs": [
      "Captain Ivor Hale was a man of many stories, each one more charming than the last. Yet beneath the polished exterior lay a past marred by questionable decisions. As a retired naval officer, he was adored by many, but it was the whispers of his wartime exploits that kept him awake at night. The murder of Hugo Vane had thrown him into a storm he thought he had long escaped, and now, the stakes felt dangerously high. Would the truth of his past come crashing down upon him like a rogue wave?",
      "With a sardonic smile, Hale mingled with the hotel guests, his laughter ringing out like a siren's call. He had mastered the art of conversation, weaving nautical metaphors into his speech as if to anchor himself in a world that felt increasingly unstable. But as he navigated the investigation, he could feel the tide shifting. The victim had threatened to expose a secret that could obliterate his carefully crafted reputation, and the thought of being unmasked sent shivers down his spine.",
      "Dining with guests during the hour of the murder had felt like an act of defiance, but Hale knew that appearances could be deceiving. He had to tread carefully, balancing the charm that endeared him to others with the shadows that lurked behind his eyes. Each interaction brought a new wave of tension, and he found himself questioning whether his past was truly behind him or if it was merely lying in wait, ready to drag him under.",
      "As the investigation unfolded, Captain Hale faced the ultimate test of his character. Would he continue to hide behind the façade of a charming gentleman, or would he confront the ghosts of his past? The stakes were higher than ever, and with every passing moment, he felt the pressure building. The truth was a tempest, and he had to decide whether to weather the storm or be swept away by the currents of his own making."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a young hotel waitress, navigates the murky waters of ambition and jealousy in the wake of the victim's death.",
    "publicPersona": "Eager and hardworking, Beatrice is trying to rise in the hotel ranks.",
    "privateSecret": "She had been having an affair with the victim, who was now reconsidering the arrangement.",
    "motiveSeed": "Jealousy over the victim’s decision to end their relationship.",
    "motiveStrength": "moderate",
    "alibiWindow": "Busy serving guests during the hour of the murder.",
    "accessPlausibility": "easy",
    "stakes": "Personal fulfillment and career stability.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Beatrice speaks quickly, often stumbling over her words when nervous. She has a tendency to laugh at her own misfortunes, using self-deprecating humor to deflect attention from her insecurities.",
    "signatureTic": "Well, that’s just my luck, isn’t it?",
    "internalConflict": "Beatrice struggles with the realization that her ambition may have led her to make choices that could cost her everything, including her dignity.",
    "personalStakeInCase": "This crime matters to Beatrice as it threatens her aspirations for a better life and exposes the fragility of her relationships.",
    "paragraphs": [
      "Beatrice Quill was a bundle of nerves wrapped in ambition, her eagerness to please often overshadowed by the weight of her secrets. Working as a waitress in the hotel, she dreamt of climbing the ranks, but the murder of Hugo Vane had thrown her aspirations into disarray. The whispers of jealousy and betrayal hung in the air, and Beatrice found herself at the center of a storm she never intended to join. Her affair with the victim had been a source of both excitement and dread, and now, with his death, she felt the ground shifting beneath her.",
      "Busy serving guests during the hour of the murder, Beatrice had been caught in a whirlwind of activity, but her mind was elsewhere. The thought of Vane reconsidering their arrangement gnawed at her, and she couldn’t shake the feeling that his death had left her adrift. Each interaction with the other suspects felt like walking on a tightrope, and she often stumbled over her words, her nervousness betraying her. When she laughed at her own misfortunes, it was a defense mechanism, a way to cope with the reality of her situation.",
      "The stakes for Beatrice were personal and profound. She yearned for a life beyond the confines of her current existence, but the murder had unveiled the fragility of her dreams. As she navigated the investigation, the whispers of her past echoed in her mind. What if her ambition had led her to make choices that would ultimately cost her everything? Each interaction was a reminder of her precarious position, and the weight of her secret felt heavier with every passing moment.",
      "As the truth began to unravel, Beatrice faced the reality of her choices. Would she continue to chase her ambitions, or would she confront the jealousy that had clouded her judgment? The investigation had become a crucible, forcing her to confront the complexities of her relationships and the power dynamics at play. In the end, she realized that the path to fulfillment might require more than just ambition; it demanded a reckoning with her own desires and the cost they carried."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, the dedicated hotel manager, grapples with the pressures of financial instability and the implications of the victim's death.",
    "publicPersona": "Professional and efficient, Sylvia is dedicated to her job and the hotel’s reputation.",
    "privateSecret": "She is having financial troubles and secretly borrowed money from the victim.",
    "motiveSeed": "Panic over the victim threatening to call in the loan.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the office processing invoices at the time.",
    "accessPlausibility": "easy",
    "stakes": "Job security and financial stability.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with a calm and measured tone, often using precise language to convey her thoughts. She has a habit of pausing to collect her thoughts before responding, and her observational humor often reveals the absurdities of the situations she encounters.",
    "signatureTic": "Well, that’s a curious situation, isn’t it?",
    "internalConflict": "Sylvia is torn between her professional responsibilities and the fear that her financial troubles will come to light, threatening her position and sense of self-worth.",
    "personalStakeInCase": "This crime matters to Sylvia as it threatens her job security and the delicate balance she has maintained in her life.",
    "paragraphs": [
      "Sylvia Trent was the embodiment of professionalism, her calm demeanor masking the turbulent waters beneath the surface. As the hotel manager, she was dedicated to maintaining the establishment's reputation, but the murder of Hugo Vane had thrown her into a precarious position. Financial troubles loomed large, and the secret loan she had taken from the victim now felt like a noose tightening around her neck. The stakes had never felt higher, and she knew that the truth could unravel everything she had worked so hard to build.",
      "Processing invoices in the office had been her refuge, a place where she could escape the chaos of the hotel floor. But with Vane's death, that refuge had transformed into a prison of her own making. Each time the phone rang or footsteps echoed in the hallway, Sylvia felt a pang of anxiety. The observational humor that once helped her navigate the absurdities of hotel life now felt like a distant memory, overshadowed by the weight of her secrets.",
      "The alibi she presented seemed solid enough, yet Sylvia could sense the scrutiny of her colleagues. The tension in the air was palpable, and she found herself questioning whether her careful facade would hold under pressure. The panic that threatened to bubble to the surface was a reminder of the delicate balance she had maintained, and the fear of exposure loomed like a dark cloud over her head. What if her financial troubles were revealed? Would she lose not only her job but also her sense of self-worth?",
      "As the investigation unfolded, Sylvia faced a reckoning. The stakes were no longer just about her job security; they were about her identity. Would she continue to hide behind the mask of professionalism, or would she confront the reality of her situation? The murder had forced her to confront her fears, and in the end, she realized that the path to stability required not just maintaining appearances but facing the truth of her circumstances head-on."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, the charismatic art dealer, becomes the victim whose secrets pose a threat to powerful patrons.",
    "publicPersona": "Charismatic and persuasive, Hugo was known for his keen eye for valuable art and strong negotiation skills.",
    "privateSecret": "He was about to reveal a major art fraud scandal involving powerful patrons.",
    "motiveSeed": "N/A",
    "motiveStrength": "weak",
    "alibiWindow": "N/A",
    "accessPlausibility": "possible",
    "stakes": "N/A",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Hugo spoke with a smooth, persuasive tone, often using charm to disarm those around him. His dialogue was filled with artful metaphors, captivating his audience even as he concealed his true intentions.",
    "signatureTic": "Art speaks where words fail.",
    "internalConflict": "N/A",
    "personalStakeInCase": "N/A",
    "paragraphs": [
      "Hugo Vane was a man who thrived in the limelight, his charisma drawing people into his orbit like moths to a flame. As an art dealer, he had a keen eye for value, but it was his persuasive charm that truly set him apart. Yet beneath the polished exterior lay a web of secrets, one that threatened to unravel at any moment. Hugo was on the verge of exposing a major art fraud scandal involving powerful patrons, and the stakes had never been higher. Little did he know that his own life was about to become the ultimate casualty of his ambition.",
      "In his interactions, Hugo was a master of language, weaving artful metaphors into his speech that captivated his audience. He had a knack for making even the most mundane conversations feel significant, drawing people in with the promise of intrigue. Yet, behind the smooth veneer lay a man burdened by the weight of his secrets. The truth was a ticking time bomb, and Hugo was acutely aware of the danger it posed to his reputation and safety.",
      "As the investigation commenced, the whispers of his past began to surface, revealing the precarious balance he had maintained between success and scandal. The powerful patrons he had courted were not the forgiving type, and the threat of exposure loomed large. Hugo had always played the game of deception, but this time, he had unknowingly placed himself in the crosshairs of his own machinations.",
      "In the end, Hugo Vane's story was one of ambition and tragedy, a cautionary tale of a man who dared to challenge the powerful forces at play in the art world. His demise would not only serve as a catalyst for the investigation but would also reveal the depths of human ambition and the lengths to which individuals would go to protect their secrets."
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
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "An elegant seaside hotel steeped in mystery, where the echoes of the past linger amidst its Art Deco charm.",
    "visualDescription": "The Crestview Hotel boasts a striking Art Deco façade, its sharp lines softened by the salty sea air. Grand windows frame breathtaking ocean views, while a sweeping staircase greets guests in the lobby, adorned with plush velvet furnishings and intricate geometric patterns.",
    "atmosphere": "A tension-filled atmosphere permeates the hotel, underscored by the looming presence of recent unsettling events.",
    "paragraphs": [
      "Perched precariously atop a coastal bluff, The Crestview Hotel stands as a sentinel against the crashing waves below. Its elegant Art Deco architecture, with bold geometric shapes and sweeping curves, captures the essence of the 1940s while hinting at secrets buried within its walls. The air is thick with anticipation, a palpable tension that seeps into every corner of the hotel, echoing the recent turmoil that has unsettled its guests.",
      "Inside, the lobby is a blend of sophistication and unease. The grand staircase spirals upward, flanked by rich mahogany banisters, while the soft glow of sconces casts flickering shadows across the marble floors. The scent of salt and dampness hangs in the air, mingling with the faint aroma of freshly brewed coffee from the adjoining café. Guests exchange nervous glances, their voices hushed as they navigate the narrow hallways lined with ornate wallpaper, each step echoing like a heartbeat in the silence.",
      "The sound of the ocean crashing against the cliffs provides a constant backdrop, a relentless reminder of the isolation that envelops the hotel. Outside, the overcast sky looms heavy with the promise of rain, the occasional flash of lightning illuminating the darkened windows. Inside, the atmosphere grows thick with tension, as whispers of intrigue and suspicion weave through the corridors, drawing guests into a web of deception and uncertainty.",
      "As the day wears on, the hotel transforms into a labyrinth of hidden motives and clandestine meetings. The rooftop terrace, with its sweeping views of the tumultuous sea, becomes a coveted refuge, accessible only to those with permission. The intricate layout of the hotel, with its secluded nooks and crannies, creates an air of mystery, where every glance over a shoulder could reveal a secret, and every footstep could lead to an unexpected encounter."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical for coastal climates",
    "timeFlow": "Days of mounting tension and uncertainty unfold within the hotel's confines.",
    "mood": "tension-filled due to recent events at the hotel",
    "eraMarkers": [
      "Art Deco architecture",
      "early radio broadcasts in the lobby",
      "rationed fuel for automobiles and limited transportation"
    ],
    "sensoryPalette": {
      "dominant": "salty sea air and dampness",
      "secondary": [
        "rich coffee aroma from the café",
        "faint scent of old leather and polish"
      ]
    },
    "paragraphs": [
      "The atmosphere of The Crestview Hotel is thick with tension, as whispers of recent events swirl like the mist rising from the sea. The artfully designed lobby, with its elegant furnishings and soft lighting, feels both inviting and foreboding, as if it harbors secrets waiting to be unearthed. The salty tang of the ocean air mixes with the scent of damp wood, creating an ambiance that is both refreshing and oppressive, reminiscent of the weight of unspoken fears.",
      "As guests navigate the narrow hallways, the air grows heavy with anticipation. The occasional distant sounds of thunder and the rhythmic crashing of waves provide a constant reminder of the isolation that surrounds the hotel. The atmosphere shifts subtly with the weather, as dark clouds loom overhead, casting shadows that dance across the ornate carpets and walls. This tension-filled environment becomes a crucible, where every interaction is charged with the potential for revelation or betrayal."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Seaside Lounge",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The lounge is adorned with plush, sea-blue upholstery and large windows that overlook the turbulent ocean. A grand piano sits in one corner, dust motes dancing in the dim light.",
      "sensoryDetails": {
        "sights": [
          "dark velvet curtains drawn tightly",
          "shimmering glassware on polished tables",
          "shadows flickering against the walls",
          "ocean waves crashing against the rocks"
        ],
        "sounds": [
          "muffled voices from the bar",
          "clinking of glasses",
          "distant thunder rumbling",
          "the piano's soft melancholy notes"
        ],
        "smells": [
          "old whiskey and cigar smoke",
          "scent of sea brine",
          "faint floral notes from the arrangements",
          "musty air from the corners"
        ],
        "tactile": [
          "smooth glass surfaces",
          "soft upholstery under fingertips",
          "coolness of the glass windows",
          "worn leather armrests of chairs"
        ]
      },
      "accessControl": "Guests are permitted during operating hours; access restricted after midnight for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops streaking the windows",
            "dim light filtering through clouds",
            "mist rising from the ocean",
            "wet surfaces reflecting light"
          ],
          "sounds": [
            "steady patter of rain on glass",
            "splashing waves against the shore",
            "soft murmurs of early guests",
            "the creaking of wooden floorboards"
          ],
          "smells": [
            "fresh rain on the sea",
            "damp wood and upholstery",
            "the metallic tang of rain",
            "hint of salt in the air"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat grey light through clouds",
            "shadows without edges",
            "faint outlines of distant ships",
            "hazy view of the stormy sea"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "the creak of old timbers",
            "low murmur of conversations",
            "the soft rustle of fabric"
          ],
          "smells": [
            "dust and old leather",
            "faint scent of mildew",
            "woodsmoke drifting in",
            "the lingering aroma of cocktails"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling through windows",
            "glint of glass and silverware",
            "the deep blue of the evening sea"
          ],
          "sounds": [
            "the tick of a clock",
            "laughter and chatter from guests",
            "the soft notes of the piano",
            "the distant call of seabirds"
          ],
          "smells": [
            "rich cigar smoke",
            "freshly polished wood",
            "the scent of seawater",
            "warm bread from the kitchen"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Seaside Lounge, once a vibrant gathering place, now bears the weight of tragedy. Dark velvet curtains are drawn tightly, blocking out the world beyond, while the muted light casts an eerie glow across the plush furnishings. A grand piano sits silently in one corner, its keys untouched, as if mourning the loss of joy that once filled the room. The air is thick with the scent of old whiskey and cigar smoke, blending with the salty tang of the ocean that crashes violently against the rocks below, each wave a reminder of the storm brewing both outside and within.",
        "As tension mounts, the lounge becomes a stage for whispered conversations and furtive glances. The soft clinking of glasses and muffled voices create a symphony of unease, a stark contrast to the calm facade of the hotel. The dim light flickers, casting shadows that dance across the walls, hinting at secrets hidden in the corners. Each guest feels the weight of suspicion, as the once inviting atmosphere turns into a suffocating enclosure, where every breath feels laden with unspoken truths."
      ]
    },
    {
      "id": "staff_kitchen",
      "name": "The Hotel Kitchen",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "A bustling space filled with stainless steel appliances, large wooden tables, and shelves stocked with jars of preserved goods.",
      "sensoryDetails": {
        "sights": [
          "steam rising from pots on the stove",
          "shiny surfaces of gleaming utensils",
          "colorful jars lining the shelves",
          "busy staff moving with purpose"
        ],
        "sounds": [
          "clattering pots and pans",
          "the hiss of frying food",
          "laughter and chatter of staff",
          "the whir of a mixer"
        ],
        "smells": [
          "sizzling onions and garlic",
          "freshly baked bread",
          "the tang of vinegar and spices",
          "warmth of baked pastries"
        ],
        "tactile": [
          "smooth stainless steel countertops",
          "warmth of the oven's heat",
          "rough texture of burlap sacks",
          "coolness of ceramic bowls"
        ]
      },
      "accessControl": "Staff only; access restricted during meal service hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "wet floors reflecting overhead lights",
            "staff in rain gear hustling in",
            "cloudy light filtering through windows",
            "steam fogging up the glass"
          ],
          "sounds": [
            "dripping water from umbrellas",
            "the bustle of staff preparing breakfast",
            "the clinking of plates",
            "the roar of the dishwasher"
          ],
          "smells": [
            "freshly brewed coffee",
            "the earthy scent of mushrooms",
            "the sharpness of citrus",
            "the warmth of butter melting"
          ],
          "mood": "frantic energy"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "staff moving in organized chaos",
            "pots simmering on the stove",
            "ingredients laid out for dinner prep"
          ],
          "sounds": [
            "the rhythmic chopping of vegetables",
            "the hum of the refrigerator",
            "the bubbling of sauces",
            "the chatter of staff discussing orders"
          ],
          "smells": [
            "rich broth simmering",
            "the aroma of herbs and spices",
            "the sweetness of caramelizing onions",
            "smoky hints from grilled meats"
          ],
          "mood": "busy anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "glow of candlelight reflecting on surfaces",
            "staff preparing for the dinner rush",
            "fresh ingredients arranged artfully",
            "shiny utensils ready for use"
          ],
          "sounds": [
            "the sizzle of food on the grill",
            "lively conversations from the dining room",
            "the soft music playing in the background"
          ],
          "smells": [
            "the aroma of roasted meats",
            "the sweetness of desserts baking",
            "the freshness of herbs",
            "the warmth of cooked vegetables"
          ],
          "mood": "excited bustle"
        }
      ],
      "paragraphs": [
        "The kitchen of The Crestview Hotel is a hive of activity, where the scent of sizzling onions and garlic fills the air, mingling with the warmth of freshly baked bread. Staff members dart about, their laughter and chatter creating a lively atmosphere that contrasts sharply with the tension brewing in the guest areas. Stainless steel appliances gleam under the bright lights, while colorful jars of preserved goods line the shelves, a testament to the hotel's commitment to quality despite rationing.",
        "As the morning rain patters against the windows, the kitchen hums with frantic energy. The sound of clattering pots and pans echoes throughout the space, while the warmth from the ovens envelops the staff in a comforting embrace. Yet, beneath the surface of this bustling environment lies an undercurrent of unease, as whispers of recent events filter through the ranks, and every glance exchanged carries the weight of suspicion. The kitchen, while a place of nourishment, becomes a crucible for hidden truths and unspoken fears."
      ]
    },
    {
      "id": "rooftop_terrace",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Gathering space",
      "visualDetails": "A secluded terrace with wrought iron railings, overlooking the turbulent sea, adorned with potted plants and a few scattered chairs.",
      "sensoryDetails": {
        "sights": [
          "rolling waves crashing against cliffs",
          "dark clouds hanging low in the sky",
          "flickering lights from distant boats",
          "potted plants swaying in the breeze"
        ],
        "sounds": [
          "howling wind whipping through railings",
          "waves crashing below",
          "distant calls of seabirds",
          "the rustle of leaves in the wind"
        ],
        "smells": [
          "fresh sea air mixed with rain",
          "the scent of damp earth",
          "salty tang of the ocean",
          "the faint aroma of blooming flowers"
        ],
        "tactile": [
          "cool metal of the railings",
          "rough texture of stone tiles",
          "softness of moss underfoot",
          "the chill of the evening breeze"
        ]
      },
      "accessControl": "Restricted access after dark; permission required from the hotel manager.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey mist obscuring the horizon",
            "water droplets clinging to leaves",
            "shimmering puddles on the terrace",
            "clouds casting shadows over the sea"
          ],
          "sounds": [
            "steady rain tapping on the terrace",
            "the roar of waves below",
            "the soft rustle of wet leaves",
            "the distant rumble of thunder"
          ],
          "smells": [
            "damp earth and wet stone",
            "the freshness of rain-soaked air",
            "the scent of blooming flowers",
            "the saltiness of the ocean"
          ],
          "mood": "melancholic solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "distant ships barely visible",
            "the churning sea under dark clouds",
            "heavy air thick with moisture"
          ],
          "sounds": [
            "the wind howling through the railings",
            "soft whispers of conversation",
            "the crash of waves below",
            "the flapping of leaves in the breeze"
          ],
          "smells": [
            "the tang of salt in the air",
            "damp foliage and earth",
            "the scent of rain approaching",
            "the faint aroma of distant cooking"
          ],
          "mood": "foreboding tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "twinkling stars appearing in the sky",
            "the horizon glowing with sunset hues",
            "gentle waves lapping at the rocks",
            "silhouettes of plants against the sky"
          ],
          "sounds": [
            "the soft lapping of waves",
            "the distant laughter of guests",
            "the rustle of leaves in the breeze",
            "the quiet hum of night insects"
          ],
          "smells": [
            "the fresh scent of night-blooming flowers",
            "the salty tang of the ocean",
            "the coolness of the evening air",
            "the faint aroma of smoke from distant chimneys"
          ],
          "mood": "reflective calm"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers a breathtaking view of the turbulent sea below, where waves crash against the cliffs with relentless force. The wrought iron railings provide a sense of seclusion, yet the open sky feels vast and daunting. Potted plants sway gently in the wind, their vibrant colors a stark contrast to the dark clouds hanging low. As the storm brews in the distance, the air is thick with the scent of rain and salt, creating an atmosphere of foreboding and anticipation.",
        "Access to the terrace is restricted after dark, heightening the sense of mystery that surrounds this space. The howling wind whips through the railings, carrying with it the echoes of past conversations and secrets shared under the stars. Here, the isolation of the hotel is palpable, and the feeling of being cut off from the outside world intensifies. Each gust of wind seems to whisper warnings, urging guests to tread carefully as they navigate the thin line between safety and danger."
      ]
    },
    {
      "id": "grand_staircase",
      "name": "The Grand Staircase",
      "type": "interior",
      "purpose": "Transitional space",
      "visualDetails": "An imposing staircase of polished mahogany, flanked by intricate wrought iron railings and adorned with plush runner carpets.",
      "sensoryDetails": {
        "sights": [
          "gleaming wood reflecting the light",
          "ornate ironwork detailing",
          "rich colors of the runner carpet",
          "shadows dancing on the walls"
        ],
        "sounds": [
          "echo of footsteps on wood",
          "soft murmurs of passing guests",
          "the rustle of fabric as people ascend",
          "the creak of the staircase underfoot"
        ],
        "smells": [
          "the scent of polished wood",
          "the faint aroma of perfume",
          "dust motes floating in the air",
          "the lingering warmth of the sun"
        ],
        "tactile": [
          "smoothness of polished banisters",
          "softness of the carpet underfoot",
          "coolness of air near the landing",
          "the slight give of the wood"
        ]
      },
      "accessControl": "Open to guests at all times; serves as the main artery of the hotel.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through windows",
            "wet footprints on the wood",
            "glossy surfaces reflecting light",
            "clouds obscuring the sun"
          ],
          "sounds": [
            "water dripping from umbrellas",
            "the soft patter of rain on the roof",
            "the echo of footsteps",
            "distant thunder rumbling"
          ],
          "smells": [
            "the scent of damp wood",
            "the freshness of rain-soaked air",
            "the hint of flowers from the lobby",
            "the earthy aroma of wet earth"
          ],
          "mood": "solemn reflection"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "people moving in hurried silence",
            "ornate details of the railing",
            "faint outlines of guests"
          ],
          "sounds": [
            "the creak of wood underfoot",
            "soft whispers of conversations",
            "the rustling of clothing",
            "the distant clink of glasses"
          ],
          "smells": [
            "the scent of polished wood",
            "the lingering aroma of meals",
            "the faint trace of perfume",
            "the dustiness of the air"
          ],
          "mood": "tense anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering in the lobby",
            "the warm glow of chandeliers",
            "guests mingling in elegant attire",
            "the rich colors of evening shadows"
          ],
          "sounds": [
            "the soft murmur of laughter",
            "the rustle of evening gowns",
            "the echo of footsteps on wood",
            "the distant sound of music"
          ],
          "smells": [
            "the scent of evening perfumes",
            "the warmth of candle wax",
            "the aroma of fine dining",
            "the freshness of the night air"
          ],
          "mood": "elegant intrigue"
        }
      ],
      "paragraphs": [
        "The Grand Staircase serves as the heart of The Crestview Hotel, an impressive structure of polished mahogany that ascends gracefully to the upper floors. Flanked by intricate wrought iron railings, the staircase is adorned with plush runner carpets that absorb the sound of footsteps, creating an air of quiet elegance. As guests traverse this central artery, the echoes of their movements mix with soft murmurs and the rustle of fabric, each sound a reminder of the many stories that unfold within these walls.",
        "In the early morning, the staircase takes on a somber tone, the grey light filtering through the windows casting long shadows on the polished wood. The scent of dampness lingers in the air, mingling with the faint aroma of flowers from the lobby below. As the day progresses, the atmosphere shifts, growing thick with anticipation and unspoken tension, as guests navigate this space with cautious glances and hushed voices, each step a reminder of the secrets waiting to be uncovered."
      ]
    }
  ],
  "note": "",
  "cost": 0.0029257057500000003,
  "durationMs": 51858
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1945,
    "month": "February",
    "day": 14,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast skies with occasional rain showers",
      "cool breezes from the nearby coast",
      "chilly temperatures averaging around 35°F (2°C)"
    ],
    "daylight": "Short winter days with twilight setting in by five o'clock in the afternoon, leaving a lingering sense of darkness.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests settle into their rooms or gather in the hotel's dimly lit lounge.",
    "holidays": [
      "Valentine's Day"
    ],
    "seasonalActivities": [
      "Indoor gatherings and dances at local hotels",
      "Engagements and romantic dinners on Valentine's Day",
      "Coastal walks despite the chill, with locals bundled up"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "dark wool suits with wide lapels",
        "double-breasted blazers in navy or charcoal",
        "crisp white dress shirts with patterned ties"
      ],
      "casual": [
        "tweed jackets with elbow patches",
        "flannel trousers",
        "corduroy caps"
      ],
      "accessories": [
        "fedora hats",
        "leather gloves",
        "wool scarves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with cinched waists and flared skirts",
        "satin evening gowns adorned with beading",
        "tailored jackets with shoulder pads"
      ],
      "casual": [
        "knitted sweaters paired with A-line skirts",
        "button-up blouses tucked into high-waisted skirts",
        "wool cardigans"
      ],
      "accessories": [
        "perched hats adorned with veils",
        "string pearls",
        "leather handbags"
      ]
    },
    "trendsOfTheMoment": [
      "military influences in civilian fashion",
      "the rise of bold, geometric patterns in textiles",
      "the popularity of brooches and pins as statement accessories"
    ],
    "socialExpectations": [
      "traditional gender roles still prevalent but slowly evolving",
      "expectation for women to maintain elegance and poise in public",
      "increasing acceptance of socializing in mixed-gender groups"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Yalta Conference taking place this month, shaping post-war Europe",
      "Intensifying conflict in the Pacific as the United States prepares for the assault on Iwo Jima",
      "Growing concerns about the Soviet Union's intentions in Eastern Europe"
    ],
    "politicalClimate": "Increased tension as the world approaches the end of World War II, with allies debating the future political landscape of Europe.",
    "economicConditions": "Post-war rationing still in effect, but signs of recovery as production ramps up in anticipation of peace.",
    "socialIssues": [
      "Struggles of returning veterans adjusting to civilian life",
      "Debates over women's roles in the workforce post-war",
      "Emerging civil rights discussions as racial tensions persist"
    ],
    "internationalNews": [
      "Reports of the Holocaust's horrors beginning to surface",
      "Allied advances in Europe lead to discussions about war crimes",
      "The burgeoning Cold War atmosphere with increasing distrust of Soviet motives"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "The Andrews Sisters with their upbeat harmonies",
        "Jazz music gaining traction in urban centers"
      ],
      "films": [
        "The Lost Weekend (1945)",
        "Mildred Pierce (1945)",
        "It's a Wonderful Life (1946, still popular in theaters)"
      ],
      "theater": [
        "The Glass Menagerie by Tennessee Williams, capturing audience emotions",
        "Oklahoma! continues to draw crowds with its vibrant story and music",
        "Variety shows featuring song and dance numbers"
      ],
      "radio": [
        "The Jack Benny Program providing comedic relief",
        "Suspense dramas enthralling listeners every week",
        "News broadcasts detailing the war's progress and political developments"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Catcher in the Rye (published in 1951, but gaining attention in literary circles)",
        "A Tree Grows in Brooklyn by Betty Smith (1943)",
        "Animal Farm by George Orwell (1945)"
      ],
      "popularGenres": [
        "detective fiction due to the rise of hard-boiled novels",
        "romantic novels reflecting post-war love stories",
        "social realism capturing the struggles of everyday life"
      ]
    },
    "technology": {
      "recentInventions": [
        "The first electronic computer, the ENIAC, being developed",
        "Advancements in radar technology aiding military efforts",
        "Early experiments in jet propulsion changing aviation"
      ],
      "commonDevices": [
        "Radios dominating households for news and entertainment",
        "Emerging use of early televisions in urban areas",
        "Cigarette lighters becoming a common accessory"
      ],
      "emergingTrends": [
        "Increased use of telephones as more households gain access",
        "Rise of advertising and consumerism post-war",
        "Interest in home appliances and convenience products"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "A pint of milk: three pence",
        "Movie ticket: one shilling"
      ],
      "commonActivities": [
        "Attending dances and social events at local hotels",
        "Gathering at cafes for coffee and conversation",
        "Visiting the cinema for the latest films"
      ],
      "socialRituals": [
        "Sunday family dinners becoming a cherished tradition",
        "Valentine's Day celebrations with gift exchanges",
        "Frequent gatherings for card games or bingo"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "There is a noticeable divide between working-class and upper-class leisure activities.",
      "Upper classes often frequent hotels and resorts, while working classes enjoy local community events."
    ],
    "gender": [
      "Women are increasingly seen in professional roles, yet still face societal expectations to marry and have families.",
      "The war has shifted some gender norms, with women embracing independence."
    ],
    "race": [
      "Racial segregation remains a significant issue, particularly in the southern states.",
      "Awareness is growing in urban areas about racial equality and civil rights."
    ],
    "generalNorms": [
      "There is a strong sense of patriotism as the war nears its end.",
      "Social gatherings are seen as essential for community bonding amidst post-war recovery."
    ]
  },
  "atmosphericDetails": [
    "The smell of damp earth lingers in the air, mingling with the faint scent of salt from the ocean.",
    "The distant sound of crashing waves creates a rhythmic backdrop to the tense whispers in the hotel lobby.",
    "Flickering lights from the lounge cast shadows on the faces of patrons, highlighting the mixture of hope and anxiety in the air."
  ],
  "paragraphs": [
    "In February 1945, the winter chill permeates the coastal town where the hotel stands, its exterior cloaked in a grey mist from the overcast sky. Rain drizzles intermittently, creating a slick sheen on the cobbled streets, while locals hustle about, bundled in woolen garments. The atmosphere is thick with tension; whispers of recent disturbances at the hotel circulate among the guests, each one casting wary glances at strangers who drift through the lobby. Valentine's Day is just around the corner, yet no one seems to have the heart for celebration, as the world outside grapples with the remnants of war.",
    "As evening approaches, the hotel is alive with the hues of 1940s fashion. Men in dark suits and fedora hats gather in the lounge, their ties meticulously knotted, while women in tea-length dresses and tailored jackets navigate the room with grace, pearls glistening against satin fabric. The lingering cold air requires woolen gloves and scarves, yet the elegant attire reflects a society attempting to reclaim normalcy after years of turmoil. Despite the war's impact, the spirit of romance lingers in the air, and the hotel hosts a gathering for couples, a risky flirtation in the midst of uncertainty.",
    "Life within the hotel is a microcosm of the broader societal shifts occurring outside its doors. Prices remain tightly controlled under wartime regulations, yet the occasional splurge on a movie ticket or a café visit provides respite from daily struggles. Social rituals of card games and bingo nights in the lounge foster camaraderie among guests, while Sunday dinners draw families together, reinforcing a sense of community. As conversations shift to the latest news from the front, an undercurrent of anxiety ripples through the gatherings, with the looming specter of the Cold War casting a long shadow over the hopeful glimmers of peace."
  ],
  "note": "",
  "cost": 0.001287858,
  "durationMs": 24905
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "The recent drowning of a guest at the hotel ignites tensions among staff and patrons, revealing the societal pressures of post-war recovery and gender roles in a confined, stormy setting.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Post-WWII trauma influences class dynamics, with women increasingly stepping into roles traditionally held by men, all while the specter of the Cold War looms over personal and professional relationships."
  },
  "setting": {
    "location": "A seaside hotel on a coastal bluff",
    "institution": "hotel",
    "weather": "overcast with occasional rain"
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
    "id": "tide_low_time",
    "value": "ten minutes past nine",
    "description": "The tide was at its lowest point."
  },
  {
    "id": "last_seen_time",
    "value": "a quarter to ten",
    "description": "The victim was last seen at this time."
  },
  {
    "id": "witness_clock_time",
    "value": "half past nine at night",
    "description": "Witnesses report the hotel clock showing this time."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 19,
  "countsByPlacement": {
    "early": 8,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
    "supporting": 1,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "category": "temporal"
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
      "category": "physical"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
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
      "id": "clue_9",
      "placement": "early",
      "criticality": "supporting",
      "category": "testimonial"
    },
    {
      "id": "clue_10",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_11",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_12",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_beatrice_quill",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_2",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_id_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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

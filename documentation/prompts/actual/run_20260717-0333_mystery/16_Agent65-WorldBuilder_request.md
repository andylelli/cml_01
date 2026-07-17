# Actual Prompt Record

- Run ID: `mystery-1784259186554`
- Project ID: ``
- Timestamp: `2026-07-17T03:36:32.958Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `d382208b73506071`

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
    "title": "The Taste of Betrayal",
    "author": "Agent 9",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Brighton",
      "place": "A grand seaside hotel with Art Deco architecture",
      "country": "England",
      "institution": "Hotel"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "delayed-action poisoning"
    }
  },
  "death_method": "poisoned with a botanical extract",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Charming socialite",
      "private_secret": "Had a hidden rivalry with Beatrice Quill",
      "motive_seed": "Jealousy over social standing",
      "motive_strength": "high",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Dining area",
        "Kitchen"
      ],
      "behavioral_tells": [
        "Frequent headaches"
      ],
      "stakes": "Maintaining her reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Professional",
      "relationships": [],
      "public_persona": "Respected physician",
      "private_secret": "Has a crush on Eleanor",
      "motive_seed": "Fear of losing her trust",
      "motive_strength": "moderate",
      "alibi_window": "Time of death",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical supply room"
      ],
      "behavioral_tells": [
        "Nervous when questioned"
      ],
      "stakes": "Professional reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Authority figure",
      "relationships": [],
      "public_persona": "Dignified naval officer",
      "private_secret": "Hiding a past with Eleanor",
      "motive_seed": "Desire to protect his reputation",
      "motive_strength": "moderate",
      "alibi_window": "Evening before the murder",
      "access_plausibility": "low",
      "opportunity_channels": [
        "Dining area"
      ],
      "behavioral_tells": [
        "Defensive when asked about his past"
      ],
      "stakes": "Personal reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Rival",
      "relationships": [],
      "public_persona": "Social climber",
      "private_secret": "Resentment towards Eleanor's status",
      "motive_seed": "Jealousy over Eleanor's charm",
      "motive_strength": "high",
      "alibi_window": "Time of death",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Kitchen",
        "Dining area"
      ],
      "behavioral_tells": [
        "Excited when Eleanor is mentioned"
      ],
      "stakes": "Social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "40-50",
      "role_archetype": "Friend",
      "relationships": [],
      "public_persona": "Supportive companion",
      "private_secret": "Knew about the rivalry",
      "motive_seed": "Concern for Eleanor's wellbeing",
      "motive_strength": "low",
      "alibi_window": "Time of death",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining area"
      ],
      "behavioral_tells": [
        "Worried demeanor"
      ],
      "stakes": "Friendship",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Astute investigator",
      "private_secret": "Has feelings for Eleanor",
      "motive_seed": "Desire to prove himself",
      "motive_strength": "high",
      "alibi_window": "Time of death",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Dining area"
      ],
      "behavioral_tells": [
        "Calm under pressure"
      ],
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
      "Beatrice Quill"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "In a grand seaside hotel, Eleanor Voss is found dead after consuming a meal that was meant to celebrate her recent success. As the storm rages outside, tensions rise among the guests, revealing jealousy and hidden motives. Detective Hugo Vane must navigate the intricacies of social rivalry to uncover the truth behind Eleanor's demise."
    },
    "accepted_facts": [
      "Eleanor was last seen dining with Beatrice Quill.",
      "A glass of lemonade was found near Eleanor's body."
    ],
    "inferred_conclusions": [
      "Eleanor's death was not accidental.",
      "Jealousy among the guests played a role in her demise."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on botanical, witness, and confirm to expose the false timing.",
      "delivery_path": [
        {
          "step": "The extract was mixed into the lemonade served to Eleanor."
        },
        {
          "step": "Eleanor drank the lemonade during her meal."
        }
      ]
    },
    "outcome": {
      "result": "Eleanor's death appeared to be caused by a sudden health crisis."
    }
  },
  "false_assumption": {
    "statement": "Eleanor Voss died from an unexpected health crisis.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Eleanor had a history of headaches and was known to faint occasionally.",
    "what_it_hides": "The true cause was the deliberate poisoning carried out by Beatrice."
  },
  "false_solution": {
    "accused_suspect": "Dr. Mallory Finch",
    "supporting_points": [
      "Dr. Finch was the last person to examine Eleanor before her death.",
      "Witnesses noted Dr. Finch's nervousness during questioning."
    ],
    "the_one_flaw": "Dr. Finch had no access to the kitchen where the poison was prepared.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Dr. Mallory Finch was seen leaving the dining area shortly before Eleanor's collapse.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "Dr. Finch was only attending to another guest and had no involvement in the meal preparation.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A broken glass was found near Eleanor's body.",
      "points_at_suspect": "Sylvia Trent",
      "innocent_explanation": "The glass broke accidentally during the chaos after Eleanor's collapse.",
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
    "rationale": "Only the guests and staff present at the hotel could have committed the crime."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner service commenced at seven o'clock",
        "Eleanor collapsed at eight fifteen"
      ],
      "windows": [
        "Dr. Finch's alibi places her in the medical supply room until eight"
      ],
      "contradictions": [
        "Witnesses reported that Eleanor was seen drinking the lemonade just before her collapse, but nobody acknowledged serving it."
      ]
    },
    "access": {
      "actors": [
        "Beatrice Quill",
        "Dr. Mallory Finch",
        "Sylvia Trent"
      ],
      "objects": [
        "Lemonade pitcher",
        "Kitchen supplies"
      ],
      "permissions": [
        "Only kitchen staff were allowed in the kitchen at the time of preparation."
      ]
    },
    "physical": {
      "laws": [
        "The botanical extract is only lethal when mixed in an acidic solution."
      ],
      "traces": [
        "The glass of lemonade showed traces of the poison once tested."
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust each other due to shared experiences at the hotel."
      ],
      "authority_sources": [
        "Dr. Mallory Finch's medical authority lends her credibility."
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses confirm Eleanor was drinking a glass of lemonade before her collapse.",
        "correction": "Eleanor's drink was likely tampered with since the lemonade was not provided by the restaurant.",
        "effect": "Narrows the focus to Beatrice Quill as she had access to the dining area.",
        "required_evidence": [
          "Witness statements from guests about Eleanor's final moments.",
          "The lemonade pitcher was found in Beatrice's possession."
        ],
        "reader_observable": true
      },
      {
        "observation": "A half-empty glass of lemonade was tested and found to contain traces of a botanical poison.",
        "correction": "The poison found in the glass confirms that Eleanor was deliberately poisoned.",
        "effect": "Eliminates the theory of a natural health crisis.",
        "required_evidence": [
          "Results from the lemonade test showing poison presence.",
          "Dr. Finch's medical history of Eleanor indicating no health issues."
        ],
        "reader_observable": true
      },
      {
        "observation": "Beatrice Quill was seen entering the kitchen shortly before the lemonade was served.",
        "correction": "Beatrice had the opportunity to poison Eleanor's drink.",
        "effect": "Eliminates Dr. Mallory Finch as she was in the medical supply room.",
        "required_evidence": [
          "Kitchen staff saw Beatrice leave the kitchen.",
          "Dr. Finch's alibi confirmed by other guests."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Confronting Beatrice with the evidence of her entering the kitchen and the poison's presence in the lemonade.",
    "knowledge_revealed": "This proves that only Beatrice had access to the poison in the lemonade.",
    "pass_condition": "If Beatrice cannot provide a legitimate reason for her presence in the kitchen, she is guilty.",
    "evidence_clues": [
      "clue_5",
      "clue_culprit_direct_1",
      "clue_3",
      "clue_fp_contradiction_step_3"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements (early) and evidence from the lemonade (mid) establish tampering. Step 2: Poison presence (mid) confirms the murder method. Step 3: Access to the kitchen and Beatrice's entry (discriminating test) directly link her to the crime."
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
        "Present evidence of kitchen access",
        "Draw conclusion about Beatrice's guilt"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi from other guests",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "No access to the kitchen during the meal.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness statements confirm her presence elsewhere.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Eleanor Voss",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: None",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with Beatrice using all evidence gathered."
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
        "clue_id": "clue_3",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_id_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Test results presented"
      },
      {
        "clue_id": "clue_id_3",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_7",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Behavioral observation"
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
        "clue_id": "clue_culprit_direct_beatrice_quill",
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
        "clue_id": "clue_id_1",
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
    "summary": "Eleanor Voss is the efficient hotel manager whose life is overshadowed by a troubled past and a recent dismissal of a long-time employee that has sparked resentment.",
    "publicPersona": "Eleanor is the respected leader of the Brighton hotel, known for her exemplary hospitality and unwavering commitment to her guests and staff alike. Her air of professionalism often masks the turmoil brewing beneath the surface.",
    "privateSecret": "Beneath her polished exterior, Eleanor hides a past riddled with financial struggles and blackmail attempts that threaten to unravel her carefully constructed life.",
    "motiveSeed": "Her decision to dismiss a long-standing employee without warning ignited a flame of bitterness, leading to speculation that her former colleague might seek revenge.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims she was in the hotel office from seven to eight, preparing for the evening dinner service, a routine she never falters from.",
    "accessPlausibility": "easy",
    "stakes": "The hotel's reputation and her authority are at stake, as any scandal could jeopardize both her career and the establishment she has poured her life into.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Eleanor speaks with a commanding presence, her words precise and measured, often laced with a hint of authority that demands respect. Her tone rarely deviates from formality, making her seem distant.",
    "signatureTic": "Let’s not make a fuss about it.",
    "internalConflict": "Eleanor grapples with guilt over her past decisions and their consequences, fearing that her secrets will come to light and shatter the reputation she has fought so hard to build.",
    "personalStakeInCase": "The crime threatens not only her position but also her self-worth, as Eleanor has always identified herself with the hotel and its legacy.",
    "paragraphs": [
      "Eleanor Voss stood in her office, a fortress of order amidst the chaos of the hotel. The scent of polished wood and fresh linens filled the air, but something darker lurked beneath the surface. She had always prided herself on her hospitality, yet the dismissal of a long-time employee had sparked a resentment that was palpable. It gnawed at her, a constant reminder of how quickly loyalty could turn to betrayal.",
      "Her past was a tapestry of financial struggles and blackmail attempts that she had woven into the fabric of her life, carefully hidden beneath layers of professionalism. But now, as she prepared for the evening's dinner service, the weight of her secrets felt heavier than ever. The hotel was her sanctuary, and yet it was also a prison of her own making.",
      "Eleanor's reputation was at stake, and the thought of scandal was unbearable. She had worked tirelessly to build the hotel into a respected establishment, and any hint of impropriety could unravel everything. The stakes were high, and the pressure had never felt more suffocating. As she polished the silverware, her hands trembled slightly, betraying her composed exterior.",
      "In the quiet moments, Eleanor often reflected on her decisions and the paths they had carved. The internal conflict she faced was relentless; the guilt of her past weighed heavily on her conscience, and she feared that the truth would soon come to light. The community she had fought to gain respect from could easily turn against her, and the thought of losing everything she had built was a nightmare she could not afford to entertain."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a caring physician whose dedication to her patients is overshadowed by a struggle with addiction and a fear of exposure.",
    "publicPersona": "Known as a compassionate doctor, Mallory is always ready to lend a helping hand, earning her the trust of the community. Her warm demeanor makes her a beloved figure, though her struggles are hidden from view.",
    "privateSecret": "Behind her caring exterior lies a battle with addiction to pain medication, a secret that could destroy her career if exposed.",
    "motiveSeed": "Mallory feared that Eleanor would discover her addiction and expose her, ruining her reputation and career.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claims to have attended an emergency call from six to eight, her alibi seemingly solid but tinged with uncertainty.",
    "accessPlausibility": "possible",
    "stakes": "Her medical license and professional reputation are on the line, and the fear of losing everything she has worked for looms over her.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a gentle cadence, often punctuating her sentences with self-deprecating humor, which serves as a coping mechanism for her internal turmoil. She occasionally stumbles over her words when nervous, revealing her vulnerability.",
    "signatureTic": "You know how it is.",
    "internalConflict": "Mallory struggles with the duality of her role as a healer while battling her own demons, leading to feelings of shame and guilt that plague her every decision.",
    "personalStakeInCase": "The case is deeply personal for Mallory, as the potential exposure of her secret could not only ruin her career but also shatter her identity as a doctor.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the hospital, her hands trembling slightly as she prepared for yet another long shift. She was known for her caring nature, always the first to arrive and the last to leave, but the façade of the devoted physician was cracking. The weight of her addiction loomed over her like a dark cloud, threatening to engulf her at any moment.",
      "Every time she interacted with her patients, the guilt gnawed at her insides. They trusted her, believed in her ability to heal, yet she was ensnared in a battle with pain medication that threatened to derail her life. The thought of Eleanor discovering her secret was a constant source of anxiety. If her addiction was exposed, it would not only ruin her career but also shatter the trust she had worked so hard to build.",
      "Even in her moments of levity, a dry wit emerged, often masking the pain she carried within. 'You know how it is,' she would say with a half-hearted smile, trying to deflect attention from the cracks in her carefully constructed persona. But inside, she was a tempest of emotions, torn between her desire to help others and her need to confront her own demons.",
      "As the evening wore on and the case unfolded, Mallory found herself questioning her own motives. Was she truly there to assist in the investigation, or was she merely trying to protect herself from the impending fallout? The stakes had never been higher, and the internal conflict she faced threatened to consume her whole."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a retired naval officer whose traditional values clash with the modern world, leading to a simmering resentment towards women in authority.",
    "publicPersona": "A respected figure in the community, Ivor is known for his discipline and leadership, often seen as a pillar of strength among his peers.",
    "privateSecret": "Deep down, Ivor harbors resentment towards women taking on authoritative roles, believing they undermine the values he holds dear.",
    "motiveSeed": "Ivor's belief that Eleanor's management style was undermining the hotel's military discipline fueled a growing discontent within him.",
    "motiveStrength": "moderate",
    "alibiWindow": "He claimed to be walking along the beach from seven to eight, a solitary figure against the crashing waves.",
    "accessPlausibility": "unlikely",
    "stakes": "The very foundation of his traditional values is threatened by changing societal norms, leading to an internal struggle he cannot ignore.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks with a commanding tone, but there is an underlying self-deprecating humor that emerges when he reflects on his own rigidity. He often punctuates his sentences with military jargon, lending a formal air to his speech.",
    "signatureTic": "That’s the way the cookie crumbles.",
    "internalConflict": "Ivor battles with the conflict between his ingrained beliefs and the changing world around him, leading to feelings of inadequacy and frustration as he struggles to adapt.",
    "personalStakeInCase": "The crime challenges Ivor's perception of authority, forcing him to confront his biases and the relevance of his values in a rapidly evolving society.",
    "paragraphs": [
      "Captain Ivor Hale strode along the beach, the salty breeze ruffling his hair as he contemplated the state of the world. To him, the hotel represented a bastion of order, yet Eleanor's management style had stirred a tempest of unrest within him. As a retired naval officer, he believed in discipline and hierarchy, and the thought of a woman undermining those principles was an affront he could scarcely bear.",
      "His public persona as a pillar of the community masked the resentment he felt towards the changing tides of society. He often laced his speech with military jargon, a habit ingrained in him from years of service. 'That’s the way the cookie crumbles,' he would say, a self-deprecating chuckle escaping his lips, yet the bitterness beneath was palpable.",
      "Ivor's alibi of walking along the beach was a feeble attempt to escape the turmoil brewing in his heart. He often found solace in the sea, but even the waves couldn't wash away the conflict he faced. The traditional values he held so dear were being challenged, and the very fabric of his identity felt threatened by the emergence of women in authority.",
      "As the investigation unfolded, Ivor found himself grappling with his beliefs. The crime forced him to confront the biases that had long shaped his worldview. Could he learn to embrace change and diversity, or would he remain anchored in the past, a relic of a bygone era? The stakes were higher than he ever anticipated, and the battle within him raged on."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an ambitious young hotel clerk whose desire for recognition drives her to consider drastic measures to secure her future.",
    "publicPersona": "Eager and enthusiastic, Beatrice is the epitome of a young professional striving for success, always willing to go the extra mile to impress her superiors.",
    "privateSecret": "Behind her bright smile lies a secret ambition; Beatrice has secretly applied for Eleanor's job, willing to do anything to climb the corporate ladder.",
    "motiveSeed": "Beatrice saw Eleanor's death as her golden opportunity for advancement, a chance to finally step out of the shadows and into the limelight.",
    "motiveStrength": "strong",
    "alibiWindow": "She was working the front desk from six to eight, a position that granted her easy access to the inner workings of the hotel.",
    "accessPlausibility": "easy",
    "stakes": "Her career and future depend on her success at the hotel, making the stakes feel insurmountable.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a bubbly enthusiasm, often punctuating her sentences with sardonic wit. She has a tendency to over-exaggerate her feelings, making her appear both eager and somewhat naive.",
    "signatureTic": "Just a thought.",
    "internalConflict": "Beatrice grapples with the moral implications of her ambition, torn between her desire for success and the lengths she is willing to go to achieve it.",
    "personalStakeInCase": "The crime is a pivotal moment for Beatrice, as it could either propel her career forward or shatter her dreams entirely, forcing her to confront the consequences of her ambition.",
    "paragraphs": [
      "Beatrice Quill leaned against the front desk, a picture of eager enthusiasm as she greeted guests with an infectious smile. To her, the hotel was not just a workplace; it was a stepping stone to greatness. Each day, she worked tirelessly, dreaming of the day she would rise above her current position and earn the recognition she so desperately craved.",
      "Yet beneath that bright exterior lay a secret ambition that threatened to consume her. Beatrice had quietly applied for Eleanor's job, convinced that the manager's death could be her ticket to success. 'Just a thought,' she would say when discussing her dreams with colleagues, but the truth was that her ambition was more than a mere thought; it was an obsession.",
      "Her alibi of working the front desk from six to eight provided her with easy access to the hotel's inner workings, but it also heightened her anxiety. What if her ambitions were discovered? The stakes were high, and the fear of failure loomed large in her mind. Every smile she wore felt like a mask, hiding the turmoil brewing beneath.",
      "As the investigation unfolded, Beatrice found herself grappling with the moral implications of her ambition. Was she willing to sacrifice her integrity for success? The crime was a pivotal moment, forcing her to confront her desires and the lengths she was prepared to go to achieve them. The future she dreamed of was within reach, but at what cost?"
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent is an outspoken journalist whose pursuit of the truth often leads her down morally ambiguous paths, leaving her reputation hanging by a thread.",
    "publicPersona": "As a bold reporter, Sylvia is known for her tenacity and unwavering commitment to uncovering the truth, often challenging the status quo with her sensationalist articles.",
    "privateSecret": "In her pursuit of a story, Sylvia silenced Eleanor's criticism of her work with a damaging article, a secret that could destroy her credibility if exposed.",
    "motiveSeed": "Sylvia feared that Eleanor would expose her unethical reporting methods, a revelation that could tarnish her reputation as a journalist.",
    "motiveStrength": "moderate",
    "alibiWindow": "She was in a meeting with the hotel board from seven to eight, a alibi that may not be as solid as it appears.",
    "accessPlausibility": "possible",
    "stakes": "Her reputation as a journalist is on the line, and the fear of losing everything she has built hangs over her like a dark cloud.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.5,
    "speechMannerisms": "Sylvia's speech is sharp and incisive, often punctuated by sarcastic remarks that reveal her quick wit. She has a habit of raising an eyebrow when making a point, adding an air of condescension to her delivery.",
    "signatureTic": "Let’s get to the heart of the matter.",
    "internalConflict": "Sylvia grapples with the ethical implications of her work, torn between her ambition and the consequences of her actions on her integrity as a journalist.",
    "personalStakeInCase": "The case is personal for Sylvia, as the potential exposure of her unethical practices threatens to unravel her career and the reputation she has fought so hard to build.",
    "paragraphs": [
      "Sylvia Trent paced the hotel lobby, her sharp gaze scanning the room for any sign of a story. As an investigative journalist, she was known for her fearless pursuit of the truth, often pushing the boundaries of ethics to get the scoop. Her reputation hinged on her ability to uncover the hidden truths of the world, yet the very foundation of her career was built on shaky ground.",
      "In her pursuit of a sensational story, Sylvia had silenced Eleanor's criticism of her work with a damaging article, a secret that could shatter her credibility if exposed. 'Let’s get to the heart of the matter,' she would often say, a mantra she adhered to in her reporting, but now it felt more like a curse. The stakes were high, and the fear of exposure loomed like a storm cloud.",
      "Her alibi of being in a meeting with the hotel board from seven to eight seemed solid, yet the nagging doubt lingered. What if someone challenged her account? The fear of losing everything she had worked for was palpable, and the internal conflict she faced threatened to consume her. Could she continue to live in the shadows of her own making, or would the truth finally catch up to her?",
      "As the investigation unfolded, Sylvia found herself grappling with the consequences of her ambition. The crime was a turning point, forcing her to confront the ethical implications of her work and the potential fallout from her actions. The stakes had never been higher, and the heart of the matter was now a matter of survival."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane is a charming businessman with a penchant for shady dealings, whose financial stake in the hotel complicates his involvement in the investigation.",
    "publicPersona": "Known for his affability and keen business sense, Hugo presents himself as the charming investor, always ready with a smile and a quick wit.",
    "privateSecret": "Beneath his polished exterior lies a web of shady deals and embezzlement that could unravel his carefully crafted image.",
    "motiveSeed": "Hugo's financial stake in the hotel means that Eleanor's untimely death could benefit him, raising questions about his true intentions.",
    "motiveStrength": "strong",
    "alibiWindow": "He arrived at the hotel at eight, just after the crime, a timing that raises suspicions.",
    "accessPlausibility": "easy",
    "stakes": "His financial future is directly tied to the hotel's success, making the crime a pivotal moment in his life.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks with a smooth, persuasive tone, often peppering his dialogue with observational humor that reveals his keen insight into human nature. He has a tendency to lean in slightly when making a point, drawing others into his charm.",
    "signatureTic": "It’s all part of the game.",
    "internalConflict": "Hugo grapples with the duality of his charm and the darker aspects of his dealings, leading to a moral struggle that questions his integrity and the path he has chosen.",
    "personalStakeInCase": "The crime is deeply personal for Hugo, as it not only threatens his financial future but also challenges him to confront his past and seek redemption.",
    "paragraphs": [
      "Hugo Vane strode into the hotel lobby, a picture of charm and affability. His keen business sense had earned him a reputation as a savvy investor, yet beneath the surface lay a tangled web of shady dealings and embezzlement. 'It’s all part of the game,' he would often say, a phrase that encapsulated his approach to both business and life, but the stakes had never felt higher.",
      "His financial stake in the hotel meant that Eleanor's untimely death could yield significant benefits for him, raising suspicions about his true intentions. As he arrived at the hotel just after the crime, the timing was too convenient to ignore. The internal conflict he faced was palpable; could he reconcile his ambition with the potential consequences of his actions?",
      "Hugo's speech was smooth and persuasive, laced with observational humor that revealed his insight into human nature. Yet, as he leaned in to engage others, the charm felt like a mask, hiding the turmoil beneath. The fear of exposure loomed large, and each interaction felt like a high-stakes game where the rules could change at any moment.",
      "As the investigation unfolded, Hugo found himself at a crossroads. The crime was a pivotal moment, forcing him to confront the darker aspects of his dealings and the choices he had made. Could he seek redemption and mend his past, or would he continue down the path of deception, risking everything he had built?"
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Grand Mariner Hotel",
    "type": "Hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel with Art Deco elegance, overlooking the tumultuous sea.",
    "visualDescription": "The façade glimmers in muted pastels, with geometric patterns framing large windows that reveal expansive ocean views. Inside, polished marble floors reflect the soft glow of crystal chandeliers, while plush velvet furnishings invite guests to linger.",
    "atmosphere": "A blend of opulence and unease, where the beauty of the surroundings belies the tension within.",
    "paragraphs": [
      "The Grand Mariner Hotel stands proudly on the rugged cliffs of Brighton, its Art Deco architecture a bold statement against the stormy sky. Waves crash against the rocky shore below, sending sprays of salty mist that cling to the air and the hotel's ornate railings. The interior, with its grand lobby and sweeping staircase, whispers of glamour and sophistication, yet an unsettling atmosphere permeates every corner, hinting at secrets hidden in the shadows.",
      "As guests gather in the communal dining area, the air is thick with the scent of briny sea and roasted meats, intermingling with the distant sound of a crackling radio broadcasting news from the frontlines. The large windows frame the tumultuous ocean, a constant reminder of the war’s reach, while the flickering candlelight casts dancing shadows upon the walls. Conversations are hushed, eyes darting with suspicion, as if each guest carries their own weight of betrayal.",
      "Narrow hallways lead to locked guest rooms, the doors adorned with brass knobs that glint in the dim light. The fire escape routes are poorly marked, offering little solace should the need arise. Outside, the secluded stretch of coastline isolates the hotel, rendering it a fortress against the storm, yet a prison for those within. As the rain begins to fall, the sound of droplets on the roof creates a rhythm that mirrors the tension building among the guests, each waiting for the other to make a move.",
      "In the evenings, the hotel's grandeur is heightened by the soft glow of vintage lamps casting warm light over the polished wood. Guests gather to share stories of the war, their voices mingling with the sound of clinking glasses and laughter that feels forced. Outside, the wind howls, and the ocean rages, reminding all within that danger is never far away, a taste of betrayal lingering in the air."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical for coastal regions in the fall.",
    "timeFlow": "Three tumultuous days of suspicion and intrigue unfold within the hotel.",
    "mood": "Tense and foreboding, heightened by the recent war and lingering anxieties of the Cold War.",
    "eraMarkers": [
      "crackling radio broadcasts",
      "rationed wartime vehicles parked outside",
      "Art Deco furnishings reflecting post-war optimism"
    ],
    "sensoryPalette": {
      "dominant": "The salty tang of the ocean mingled with the aroma of rich foods",
      "secondary": [
        "Flickering candlelight casting shadows",
        "Distant sounds of crashing waves"
      ]
    },
    "paragraphs": [
      "The atmosphere within The Grand Mariner Hotel is thick with tension, amplified by the rhythmic crash of waves against the rocks below. The scent of the ocean, mixed with the rich aroma of hearty meals, fills the air, creating a dissonance between the hotel’s elegance and the dangers lurking outside. As guests navigate the narrow hallways, whispers of secrets and betrayal hang in the air, suffocating and palpable.",
      "With each passing hour, the mood shifts, echoing the unpredictable weather beyond the walls. The overcast skies mirror the unease felt among the guests, their conversations punctuated by nervous laughter and sidelong glances. This is a place where beauty and danger coexist, where the past looms large, and the taste of betrayal lingers on every tongue."
    ]
  },
  "keyLocations": [
    {
      "id": "dining_area",
      "name": "The Ocean View Dining Room",
      "type": "interior",
      "purpose": "Communal dining and socializing space",
      "visualDetails": "Large bay windows overlook the crashing waves; Art Deco chandeliers cast warm light over linen-draped tables.",
      "sensoryDetails": {
        "sights": [
          "ocean waves crashing against rocks",
          "elegantly set dining tables",
          "crystal chandeliers shimmering",
          "framed black-and-white photographs"
        ],
        "sounds": [
          "clinking silverware",
          "murmurs of conversation",
          "crackling radio news",
          "distant thunder rumbling"
        ],
        "smells": [
          "roasted meats and fresh bread",
          "salted air from the ocean",
          "burning candle wax",
          "lingering perfume from guests"
        ],
        "tactile": [
          "cool marble floors underfoot",
          "soft linen napkins",
          "smooth wood of the dining table",
          "velvet upholstery on chairs"
        ]
      },
      "accessControl": "Open to all guests during meal times; staff-only access to kitchen and storage areas.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "water droplets on window panes"
          ],
          "sounds": [
            "steady rain against the windows",
            "soft chatter of early risers"
          ],
          "smells": [
            "freshly brewed coffee",
            "wet earth from the garden",
            "ocean brine"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting shadows",
            "faded colors of the decor"
          ],
          "sounds": [
            "silence punctuated by distant waves",
            "the occasional creak of old wood"
          ],
          "smells": [
            "beeswax from candle holders",
            "faint aroma of old books",
            "dust from neglected corners"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset reflected on the water",
            "candlelight glowing warmly"
          ],
          "sounds": [
            "distant laughter from the bar",
            "soft jazz playing from a radio"
          ],
          "smells": [
            "cooked seafood",
            "smoky wood from the fireplace",
            "old leather from armchairs"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Ocean View Dining Room is the heart of The Grand Mariner Hotel, a space where guests convene to share meals and whispers. The large bay windows frame the turbulent sea, a constant reminder of nature's unpredictability. Each meal is accompanied by the soft glow of crystal chandeliers and the comforting aroma of roasted meats, yet the tension in the air is palpable, as guests exchange furtive glances.",
        "As the day unfolds, the atmosphere shifts dramatically. The morning rain brings a somber tone, with guests huddled in corners, their conversations hushed. By afternoon, the oppressive stillness hangs heavy, broken only by the sound of waves crashing outside. In the evening, as the sun sets, an air of anticipation fills the room, each guest acutely aware that the next revelation could change everything."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Reception and guest gathering area",
      "visualDetails": "High ceilings adorned with intricate moldings; plush seating arranged around a central fireplace.",
      "sensoryDetails": {
        "sights": [
          "ornate ceiling with Art Deco designs",
          "large reception desk polished to shine",
          "tall potted palms in corners",
          "faded carpets underfoot"
        ],
        "sounds": [
          "footsteps echoing on marble",
          "soft crackling of the fireplace",
          "distant laughter from the dining room",
          "the ticking of a wall clock"
        ],
        "smells": [
          "freshly polished wood",
          "smoky fireplace embers",
          "citrus from cleaning products",
          "old paper from guest registration"
        ],
        "tactile": [
          "smooth marble floor",
          "soft velvet cushions",
          "cool metal of the reception desk",
          "textured wallpaper"
        ]
      },
      "accessControl": "Accessible to all guests; staff have access to storage areas behind the reception desk.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "raindrops on the lobby windows"
          ],
          "sounds": [
            "soft patter of rain on the roof",
            "muffled conversations"
          ],
          "smells": [
            "wet stone from the entrance",
            "faint scent of coffee from the dining room",
            "freshly polished wood"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows deepening in corners",
            "faded photographs on the walls"
          ],
          "sounds": [
            "silence punctuated by distant footsteps",
            "the creak of old furniture"
          ],
          "smells": [
            "dusty air",
            "lingering scent of tobacco",
            "the faint aroma of old leather"
          ],
          "mood": "suspenseful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight dancing in the fireplace",
            "guests in evening attire"
          ],
          "sounds": [
            "soft music from a gramophone",
            "clinking glasses from the bar"
          ],
          "smells": [
            "woodsmoke from the fireplace",
            "the scent of cologne in the air",
            "freshly baked pastries"
          ],
          "mood": "inviting yet tense"
        }
      ],
      "paragraphs": [
        "The Grand Lobby serves as the hotel's welcoming heart, where guests gather beneath the high ceilings adorned with intricate moldings. The scent of polished wood and the crackling fireplace create an inviting atmosphere, yet the tension is palpable. Guests lounge in plush seating, their conversations a mix of pleasantries and furtive whispers, each aware of the secrets that linger just beneath the surface.",
        "As the day progresses, the mood shifts dramatically. The morning rain casts a melancholic tone, with guests huddled together, their voices muffled by the sound of raindrops. By afternoon, the overcast light deepens the shadows, creating a suspenseful silence that envelops the space. In the evening, the warm glow of firelight invites guests to relax, yet an undercurrent of tension remains, as each one is aware that all may not be as it seems."
      ]
    },
    {
      "id": "library",
      "name": "The Hotel Library",
      "type": "interior",
      "purpose": "Quiet reading and reflection space",
      "visualDetails": "Shelves lined with leather-bound books; a cozy reading nook with armchairs and a small fireplace.",
      "sensoryDetails": {
        "sights": [
          "soft glow of table lamps",
          "deep green wallpaper",
          "heavy drapes framing the windows"
        ],
        "sounds": [
          "soft rustling of pages",
          "crackling of the small fireplace",
          "distant sounds from the dining room",
          "occasional coughs"
        ],
        "smells": [
          "old paper and leather",
          "smoky embers from the fireplace",
          "the scent of polished wood",
          "faint floral notes from the drapes"
        ],
        "tactile": [
          "soft upholstery on armchairs",
          "cool leather bindings of books",
          "warmth from the fireplace",
          "rough texture of old pages"
        ]
      },
      "accessControl": "Open to guests during the day; locked after hours; staff access for maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "water droplets on window panes"
          ],
          "sounds": [
            "steady rain against the roof",
            "soft whispers of guests"
          ],
          "smells": [
            "wet paper",
            "mildew from damp corners",
            "freshly brewed coffee"
          ],
          "mood": "somber"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows deepening in corners",
            "faded spines of books"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "the soft closing of a book"
          ],
          "smells": [
            "dust and old leather",
            "faint scent of tobacco",
            "the aroma of fresh ink"
          ],
          "mood": "suspenseful"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "flickering candlelight illuminating pages",
            "shadows dancing on the walls"
          ],
          "sounds": [
            "soft crackling of the fireplace",
            "the rustle of a newspaper"
          ],
          "smells": [
            "warmth of burning wood",
            "the scent of aged paper",
            "faint aroma of tea"
          ],
          "mood": "introspective yet tense"
        }
      ],
      "paragraphs": [
        "The Hotel Library offers a refuge from the chaos outside, its shelves lined with leather-bound books that whisper stories of the past. The cozy reading nook, with its inviting armchairs, beckons guests to lose themselves in the pages, yet the atmosphere is tinged with an unshakable tension. The soft glow of table lamps casts flickering shadows, hinting at secrets hidden within the tomes.",
        "As the day unfolds, the library transforms with the weather. In the morning, the rain creates a somber backdrop, as guests seek solace in the written word, their whispers barely audible over the patter of raindrops. By afternoon, the overcast skies deepen the shadows, and an air of suspense hangs heavy, broken only by the soft rustle of pages. In the evening, the flickering candlelight draws guests into introspection, yet the sense of unease remains, as if the books themselves hold secrets waiting to be uncovered."
      ]
    },
    {
      "id": "rooftop",
      "name": "The Rooftop Terrace",
      "type": "exterior",
      "purpose": "Observation and escape route",
      "visualDetails": "A small terrace with wrought-iron railings; panoramic views of the ocean and surrounding cliffs.",
      "sensoryDetails": {
        "sights": [
          "vast ocean stretching to the horizon",
          "clouds rolling in ominously",
          "seagulls soaring overhead",
          "distant cliffs shrouded in mist"
        ],
        "sounds": [
          "wind whistling through railings",
          "waves crashing far below",
          "faint sounds of laughter from the dining room",
          "the rustle of leaves from nearby trees"
        ],
        "smells": [
          "salt air mixed with damp earth",
          "faint scent of blooming flowers",
          "smoky residue from nearby barbecues",
          "the metallic tang of rain"
        ],
        "tactile": [
          "cool iron of the railings",
          "rough texture of stone underfoot",
          "chill of the sea breeze",
          "smooth surface of the terrace table"
        ]
      },
      "accessControl": "Accessible to guests during the day; locked after sunset; staff access for maintenance.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey clouds looming overhead",
            "puddles forming on the terrace"
          ],
          "sounds": [
            "dripping water from the railings",
            "soft murmurs of guests inside"
          ],
          "smells": [
            "wet sea air",
            "fresh rain on stone",
            "the scent of damp grass"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "clouds hanging low",
            "shadows creeping across the terrace"
          ],
          "sounds": [
            "silence broken by distant thunder",
            "the rustle of seagulls nearby"
          ],
          "smells": [
            "briny sea air",
            "the scent of wet earth",
            "faint trace of smoke"
          ],
          "mood": "tense"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "starlit sky over the ocean",
            "the sun setting on the horizon"
          ],
          "sounds": [
            "the distant sound of waves"
          ],
          "smells": [
            "fresh sea air",
            "the scent of night-blooming flowers",
            "the lingering aroma of dinner"
          ],
          "mood": "serene yet watchful"
        }
      ],
      "paragraphs": [
        "The Rooftop Terrace offers a breathtaking view of the ocean, a place where guests can escape the confines of the hotel. The wrought-iron railings provide a sense of safety, yet the vast expanse of water below can evoke feelings of isolation. As the wind whips through the space, it carries with it the salty tang of the sea, mingling with the sounds of distant waves crashing against the cliffs.",
        "The atmosphere on the terrace shifts with the weather. In the morning, the impending rain casts a foreboding shadow, as guests peer into the distance, searching for signs of the storm. By afternoon, the oppressive clouds create a tense atmosphere, while in the evening, the clear sky invites serenity, yet a watchful eye remains on the horizon, as if anticipating what lies beyond."
      ]
    }
  ],
  "note": "",
  "cost": 0.002395833,
  "durationMs": 32470
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1941,
    "month": "February",
    "day": 1,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast with intermittent rain",
      "chilly winds from the ocean",
      "occasional bursts of sunlight breaking through the clouds"
    ],
    "daylight": "Short daylight hours with the sun setting around five in the afternoon, leading to long, dark evenings.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "Valentine's Day (February 14)"
    ],
    "seasonalActivities": [
      "ice skating at local rinks",
      "attending indoor theater productions",
      "gathering for cozy fireside chats in cafes"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "white dress shirt with a stiff collar",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "herringbone wool sweater",
        "tweed trousers",
        "leather lace-up shoes"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "silver cufflinks"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with a cinched waist",
        "pearl necklace",
        "short tailored coat"
      ],
      "casual": [
        "fitted cardigan with decorative buttons",
        "pencil skirt",
        "brogue ankle boots"
      ],
      "accessories": [
        "felt cloche hat",
        "silk scarf tied around the neck",
        "handbag with a chain strap"
      ]
    },
    "trendsOfTheMoment": [
      "bold colors in evening wear",
      "utilitarian styles for day-to-day wear",
      "increased popularity of tailored suits for women"
    ],
    "socialExpectations": [
      "men are expected to be the primary earners",
      "women are encouraged to balance work and home duties",
      "courting rituals are important leading up to Valentine's Day"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "U.S. involvement in World War II intensifying",
      "increased military presence in Europe",
      "debate over neutrality and support for allied nations"
    ],
    "politicalClimate": "Tensions are high as America grapples with its role in the escalating global conflict, while isolationist sentiments still linger.",
    "economicConditions": "The economy is in a state of cautious recovery, with industries beginning to ramp up production for war efforts.",
    "socialIssues": [
      "debate over women in the workforce",
      "racial segregation tensions in various regions",
      "concerns about civil liberties during wartime"
    ],
    "internationalNews": [
      "Britain continues to face bombing raids in London",
      "Germany's advances in Europe provoke concern",
      "Neutrality Acts under scrutiny as war looms closer"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Glenn Miller's 'In the Mood'",
        "Bing Crosby's 'White Christmas'",
        "The Andrews Sisters' 'Boogie Woogie Bugle Boy'"
      ],
      "films": [
        "'The Maltese Falcon'",
        "'Citizen Kane'",
        "'How Green Was My Valley'"
      ],
      "theater": [
        "'The Glass Menagerie'",
        "'The Skin of Our Teeth'",
        "'Lady in the Dark'"
      ],
      "radio": [
        "'The Shadow'",
        "'The Jack Benny Program'",
        "'The Fred Allen Show'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Grapes of Wrath' by John Steinbeck",
        "'The Maltese Falcon' by Dashiell Hammett",
        "'For Whom the Bell Tolls' by Ernest Hemingway"
      ],
      "popularGenres": [
        "mystery",
        "war fiction",
        "drama"
      ]
    },
    "technology": {
      "recentInventions": [
        "improved radar technology",
        "early television broadcasts gaining popularity",
        "new radar-guided artillery"
      ],
      "commonDevices": [
        "batteries for radios",
        "mechanical typewriters",
        "hand-cranked telephones"
      ],
      "emergingTrends": [
        "adoption of military technology in civilian life",
        "growing interest in household appliances",
        "development of wartime innovations"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Bread loaf: four pence",
        "Coal scuttle refill: one shilling sixpence",
        "Taxi across town: two shillings"
      ],
      "commonActivities": [
        "listening to radio broadcasts in the evening",
        "visiting local diners for warm meals",
        "attending community events at the town hall"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "Valentine's Day card exchanges among young couples"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increased awareness of class disparity due to war",
      "expectation of community support for the less fortunate"
    ],
    "gender": [
      "women increasingly stepping into roles once held by men",
      "traditional gender roles still prevalent but shifting"
    ],
    "race": [
      "racial tensions simmering, especially in urban areas",
      "awareness of civil rights issues beginning to emerge"
    ],
    "generalNorms": [
      "family values are emphasized",
      "community solidarity is encouraged during wartime",
      "patriotism is a prominent sentiment"
    ]
  },
  "atmosphericDetails": [
    "The scent of damp earth mixed with smoke from coal fires lingers in the air, a typical winter evening in a coastal town.",
    "The distant sound of waves crashing against the shore creates a rhythmic backdrop, punctuated by the occasional rumble of thunder from an approaching storm.",
    "Inside the hotel, the warmth of flickering candlelight contrasts with the biting chill outside, creating a sanctuary filled with hushed conversations and the clinking of glasses."
  ],
  "paragraphs": [
    "In February 1941, the coastal town is enveloped in winter's grasp as overcast skies threaten rain at any moment. The chill from the ocean seeps into the cracks of the buildings, compelling townsfolk to don their warmest woolens and turn to indoor amusements. With Valentine's Day approaching, couples whisper sweet nothings over candlelit dinners, while the sounds of laughter and clinking glasses fill the local hotel where many gather to escape the biting cold. Yet beneath this veneer of warmth, a sense of tension simmers, fueled by the looming shadows of global conflict and uncertainty.",
    "Fashion trends for both men and women reflect the duality of wartime practicality and pre-war elegance. Men slip into double-breasted suits paired with silk ties, their fedora hats firmly in place, while women adorn themselves in fitted dresses that accentuate their silhouettes, often complemented with pearls and cloche hats. Tailored coats keep the cold at bay, but as they walk the streets, their casual wear remains stylish yet functional, embodying the era's shift towards more utilitarian garments as women step into the workforce.",
    "Daily life is marked by a sense of urgency and camaraderie, as people gather around radios for news updates on the war. The cost of living reflects a society adjusting to wartime realities, with bread and coal becoming staples of conversation as families plan their budgets. Community rituals, such as Sunday dinners and Valentine's Day card exchanges, reinforce social bonds amid the growing strain of global events. As the town grapples with the challenges of the present, the allure of escapism through music and film offers a temporary reprieve, even as the specter of war casts a long shadow over their lives."
  ],
  "note": "",
  "cost": 0.0010824264,
  "durationMs": 20193
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A group of hotel guests and staff are trapped by a storm, forced to confront their secrets as societal changes and Cold War tensions heighten the stakes of a mysterious death.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The post-war shift sees women entering the workforce, creating new social dynamics and pressures among the upper class and the hotel staff."
  },
  "setting": {
    "location": "A grand seaside hotel with Art Deco architecture",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain, typical for coastal regions in the fall."
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
    "id": "pH_acidity",
    "value": "three",
    "description": "The pH level required for the poison to activate."
  },
  {
    "id": "time_to_dissolve",
    "value": "three hours",
    "description": "The time it takes for the poison to fully dissolve in the lemonade."
  },
  {
    "id": "lemonade_delivery_time",
    "value": "ten minutes past four",
    "description": "The time the lemonade was delivered to the victim."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 8,
    "mid": 8,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 13,
    "supporting": 3,
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
      "criticality": "supporting",
      "category": "testimonial"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_4",
      "placement": "early",
      "criticality": "supporting",
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
      "criticality": "supporting",
      "category": "testimonial"
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
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_beatrice_quill",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_id_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_id_2",
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_id_3",
      "placement": "early",
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
      "id": "clue_fp_contradiction_step_1",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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

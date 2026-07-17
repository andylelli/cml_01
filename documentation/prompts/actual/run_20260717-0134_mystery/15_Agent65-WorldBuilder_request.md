# Actual Prompt Record

- Run ID: `mystery-1784252070066`
- Project ID: ``
- Timestamp: `2026-07-17T01:37:50.241Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `be7aac8ec8acddaf`

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
    "title": "The Tide's Deception",
    "author": "Anonymous",
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
      "public_persona": "A sharp-minded detective known for her keen observation skills.",
      "private_secret": "Struggles with the pressure of her detective work.",
      "motive_seed": "Professional integrity.",
      "motive_strength": "strong",
      "alibi_window": "None",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Solving the case to uphold her reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Respected local physician.",
      "private_secret": "Involved in a controversial medical study.",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "During the party",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "N/A",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A charming naval officer.",
      "private_secret": "Has a hidden debt from gambling.",
      "motive_seed": "Financial gain.",
      "motive_strength": "moderate",
      "alibi_window": "During the party",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Avoiding financial ruin.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "An ambitious journalist.",
      "private_secret": "Wants to expose a scandal involving Dr. Finch.",
      "motive_seed": "Career advancement.",
      "motive_strength": "strong",
      "alibi_window": "During the party",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "A major story that could elevate her career.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "30-40",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A wealthy socialite.",
      "private_secret": "Jealous of Dr. Finch's rising reputation.",
      "motive_seed": "Professional rivalry.",
      "motive_strength": "moderate",
      "alibi_window": "During the party",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Protecting her social status.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [],
      "public_persona": "A local businessman.",
      "private_secret": "Involved in shady dealings.",
      "motive_seed": "To silence Dr. Finch.",
      "motive_strength": "strong",
      "alibi_window": "During the party",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Maintaining his business's reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "guilty",
      "gender": "male"
    }
  ],
  "culpability": {
    "culprit_count": 1,
    "culprits": [
      "Hugo Vane"
    ]
  },
  "surface_model": {
    "narrative": {
      "summary": "During a lavish party at a grand seaside hotel, Dr. Mallory Finch is found drowned just after a high tide, leading to questions about the timing of her death amidst a backdrop of jealousy and ambition."
    },
    "accepted_facts": [
      "Dr. Mallory Finch was last seen at the party before her disappearance.",
      "The tide schedule indicates high tide at half past eleven at night."
    ],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The timing of high tide creates a narrow window for drowning, misinterpreted by witnesses.",
      "delivery_path": [
        {
          "step": "Witnesses believe they saw Dr. Finch at the party until shortly before high tide."
        }
      ]
    },
    "outcome": {
      "result": "The real time of death is during a high tide when no witnesses were present."
    }
  },
  "false_assumption": {
    "statement": "Dr. Mallory Finch drowned during the party.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses claim to have seen her just before she disappeared.",
    "what_it_hides": "The actual timing of her drowning occurred during high tide when she could not have been seen."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "He had a motive due to financial gain.",
      "Witnesses claim to have seen him near the beach."
    ],
    "the_one_flaw": "The tide schedule proves he could not have drowned her without being seen.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "Witnesses saw a struggle near the beach.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The struggle was merely a drunken brawl unrelated to Dr. Finch's death.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "A broken watch found on the victim.",
      "points_at_suspect": "Hugo Vane",
      "innocent_explanation": "The watch was damaged during an earlier incident, unrelated to the murder.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Sylvia Trent",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel and had access during the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "scheduled high tide at half past eleven"
      ],
      "windows": [
        "party from nine to eleven"
      ],
      "contradictions": [
        "Witnesses saw Dr. Finch until eleven, but tide schedule shows she could not have drowned then."
      ]
    },
    "access": {
      "actors": [
        "Hugo Vane",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Beach access",
        "Victim's belongings"
      ],
      "permissions": [
        "Access to beach area during party"
      ]
    },
    "physical": {
      "laws": [
        "Tide rises according to schedule"
      ],
      "traces": [
        "Footprints leading towards the beach"
      ]
    },
    "social": {
      "trust_channels": [
        "Hotel staff witness accounts"
      ],
      "authority_sources": [
        "Hotel manager's timeline"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The tide schedule indicates high tide at half past eleven.",
        "correction": "Dr. Finch could only have drowned at that time.",
        "effect": "Narrows opportunity constraint to high tide only.",
        "required_evidence": [
          "Tide schedule showing high tide at half past eleven",
          "Witness statements confirming last sighting was before high tide"
        ],
        "reader_observable": true
      },
      {
        "observation": "Footprints lead towards the beach but not away from it.",
        "correction": "The lack of footprints leading back suggests no one helped her.",
        "effect": "Eliminates Captain Hale as he would have had to return.",
        "required_evidence": [
          "Footprints leading towards the beach",
          "Witness accounts of crowd behavior near the beach"
        ],
        "reader_observable": true
      },
      {
        "observation": "A broken watch was found on Dr. Finch, stopped precisely at ten minutes past eleven.",
        "correction": "The time suggests she was in the water by that time.",
        "effect": "Narrows window of death to high tide period.",
        "required_evidence": [
          "Broken watch showing stopped time",
          "Witness testimonies about Dr. Finch's last known actions"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Reenacting the timeline with tide simulation to show death could only occur during high tide.",
    "knowledge_revealed": "The tide schedule and watch evidence confirming the time of death.",
    "pass_condition": "Proves Hugo Vane had the opportunity and motive to drown Dr. Finch.",
    "evidence_clues": [
      "clue_5",
      "clue_core_contradiction_chain",
      "clue_culprit_direct_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The tide schedule (early) and witness statements (mid) clarify the time frame for death. Step 2: Footprints leading to the beach (mid) and the broken watch (late) reveal the timeline of events. Step 3: The reenactment confirms Hugo Vane's culpability."
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
      "test_type": "temporal"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Timeline and witness statements prove he could not have returned to the party after going to the beach.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed by staff and her location during the party.",
        "supporting_clues": [
          "clue_id_3",
          "clue_id_4"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness accounts confirm her presence at the party away from the beach.",
        "supporting_clues": [
          "clue_id_5",
          "clue_id_6"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: During the party",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence linking Hugo Vane to the murder."
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
        "clue_id": "clue_culprit_direct_hugo_vane",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
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
        "delivery_method": "Physical evidence"
      },
      {
        "clue_id": "clue_mid_1",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Witness statements"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss, a traveling journalist, finds herself entwined in a murder investigation while covering a story at a seaside hotel, revealing her inner turmoil and sharp wit.",
    "publicPersona": "Charismatic and insightful, known for her sharp wit and well-researched articles.",
    "privateSecret": "Struggles with a recent divorce and harbors resentment towards those in happy relationships.",
    "motiveSeed": "Drawn to the hotel to cover a travel story, she becomes embroiled in the murder investigation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was in the hotel lobby during the murder, speaking with other guests.",
    "accessPlausibility": "easy",
    "stakes": "Desires to prove her worth as a journalist after the divorce.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a fluid rhythm, often punctuating her observations with ironic commentary. She tends to ask rhetorical questions that invite reflection.",
    "signatureTic": "Well, isn't that just the way of the world?",
    "internalConflict": "Eleanor grapples with her feelings of inadequacy stemming from her divorce, unsure if she can reclaim her identity as a respected journalist.",
    "personalStakeInCase": "This crime represents an opportunity for Eleanor to prove herself and regain her confidence after the personal upheaval of her divorce.",
    "paragraphs": [
      "Eleanor Voss stood poised in the hotel lobby, her keen eyes scanning the gathering crowd like a hawk on the hunt. With a notepad in one hand and a pencil in the other, she was a picture of professional focus. Yet beneath her confident exterior lay a tangle of insecurities — a recent divorce had left her feeling unmoored, and the sight of couples whispering sweet nothings only intensified her resentment. 'Well, isn't that just the way of the world?' she would often quip, masking her discomfort with a veneer of humor.",
      "As the murder investigation unfolded, Eleanor's initial curiosity morphed into a deep-seated need to prove her worth. The hotel, with its salty air and echoing hallways, became both her sanctuary and battleground. Each interview with guests revealed more than just clues; they unearthed her own biases about love and trust. The irony wasn't lost on her — how could she investigate the tangled webs of others when her own life felt like a frayed thread?",
      "While she debated the merits of her involvement, Eleanor found herself drawn to the charming Captain Ivor Hale, whose dashing demeanor stirred feelings she had long buried. Yet, the more she learned about him, the more complicated her emotions became. Was her attraction a mere distraction from the chaos of her life? Or was it something more profound? With every revelation about the murder, Eleanor felt the weight of her own choices pressing down on her.",
      "As the investigation spiraled deeper into darkness, Eleanor's resolve hardened. She would uncover the truth, not just for the sake of her career but to reclaim her sense of self. Each step into the world of deception and jealousy forced her to confront her own vulnerabilities. The stakes were high, and with each clue, Eleanor realized that this was not just about solving a murder; it was about understanding who she was amidst the tide of human emotions."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch, the hotel physician, finds herself at the center of a scandal, burdened by her past affair with the murder victim and the looming threat of exposure.",
    "publicPersona": "Respected and compassionate, known for her dedication to the health of the hotel staff and guests.",
    "privateSecret": "Had an affair with the victim, which she ended abruptly, fearing it would jeopardize her career.",
    "motiveSeed": "Felt threatened by the victim's plan to expose their affair, which could ruin her reputation.",
    "motiveStrength": "strong",
    "alibiWindow": "Was in her office tending to a guest during the murder.",
    "accessPlausibility": "possible",
    "stakes": "Risk of losing her position and respect in the community.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Mallory speaks in a calm, measured tone, often using medical terminology. She tends to avoid personal topics, keeping her emotions tightly controlled.",
    "signatureTic": "Let's focus on the facts, shall we?",
    "internalConflict": "Dr. Finch is torn between her professional integrity and the guilt stemming from her past indiscretion, fearing its revelation could unravel her life.",
    "personalStakeInCase": "The murder threatens not only her professional reputation but also her ability to continue practicing medicine in the community she cherishes.",
    "paragraphs": [
      "Dr. Mallory Finch was the embodiment of composure, her presence in the hotel exuding an air of authority that put guests at ease. Yet behind her calm exterior, a storm brewed. The affair with the victim had been a reckless decision, one she had thought she could leave behind. But now, as whispers of murder filled the air, those choices clawed at her conscience. 'Let's focus on the facts, shall we?' she would often say, attempting to redirect conversations that ventured too close to her personal life.",
      "The moment the news broke, Mallory's heart raced. She had seen the victim just days before, their last encounter fraught with unspoken words and a lingering tension. Now, with the threat of exposure looming, her mind spiraled into darker thoughts. Could anyone suspect the truth? Would her colleagues turn on her? The stakes were high, and the weight of her secrets threatened to crush her.",
      "As she navigated the investigation, Mallory found herself walking a tightrope between duty and self-preservation. Each interaction with the detective and other suspects felt like a dangerous game, where one misstep could reveal everything. Her alibi, while seemingly solid, was a fragile shield against the truth that could dismantle her life. She had dedicated herself to healing others; now, she was fighting to heal her own reputation.",
      "In the depths of her turmoil, Mallory realized that the murder was not just a crime; it was a mirror reflecting her own failures and fears. The affair had been a moment of weakness, but the consequences were becoming all too real. As the investigation progressed, she was forced to confront her past, leading her to question if she could ever truly escape the shadows of her choices."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a charming Navy officer, struggles with his unrequited feelings for Eleanor Voss while grappling with jealousy towards the murder victim.",
    "publicPersona": "Charming and dashing, seen as a war hero with many admirers.",
    "privateSecret": "Is secretly in love with Eleanor Voss, which complicates his feelings towards the victim.",
    "motiveSeed": "Jealous of the victim's influence over Eleanor and feared losing her affection.",
    "motiveStrength": "compelling",
    "alibiWindow": "Was on the beach, but returned shortly after the murder was reported.",
    "accessPlausibility": "possible",
    "stakes": "Desires to win Eleanor's heart, potentially at any cost.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a confident cadence, often using playful banter to mask his deeper emotions. He has a tendency to use grand metaphors and dramatic expressions.",
    "signatureTic": "Ah, the tangled web we weave, isn't it?",
    "internalConflict": "Ivor grapples with the line between love and obsession, torn between his feelings for Eleanor and his jealousy of the victim.",
    "personalStakeInCase": "The murder investigation could either grant him a chance to win Eleanor's affection or destroy any hope he has of a future with her.",
    "paragraphs": [
      "Captain Ivor Hale was a man who wore charisma like a well-tailored suit. His charm and gallantry made him a favorite among the hotel guests, yet beneath that polished exterior lay a heart consumed by unrequited love for Eleanor Voss. 'Ah, the tangled web we weave, isn't it?' he would jest, though the truth was far less amusing. The victim's presence had cast a long shadow over his affections, turning admiration into a simmering jealousy.",
      "As the investigation unfolded, Ivor's feelings grew more complicated. Every interaction between Eleanor and the victim felt like a dagger to his heart. He had admired her intellect and tenacity from afar, but now the stakes were higher. Could he reveal his feelings amidst the chaos? Or would he risk losing her forever if the truth of his jealousy came to light? Ivor's mind raced as he pondered these questions, each one weighing heavier than the last.",
      "The beach, where he often sought solace, became a battleground for his emotions. Returning from his contemplative stroll, he found himself thrust into a web of suspicion and intrigue. His alibi was shaky at best, and the circumstances surrounding the murder did nothing to quell his growing anxiety. What if his affection for Eleanor led him to do something he would regret? The fine line between love and obsession blurred with each passing moment.",
      "In his quest to win Eleanor's heart, Ivor faced a moral dilemma. Would he pursue her with honesty, or would he allow his jealousy to overshadow his better judgment? As the investigation deepened, Ivor's journey became one of self-discovery, forcing him to confront not only the murderer's identity but also the depths of his own heart. In a world where love and deception often intertwined, he realized that the greatest battle lay within himself."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill, a wealthy socialite, navigates the treacherous waters of social status and gambling debts while harboring resentment towards the murder victim.",
    "publicPersona": "A wealthy socialite known for her lavish parties and connections.",
    "privateSecret": "Resents the victim for overshadowing her at social events, and is involved in secret gambling debts.",
    "motiveSeed": "Wants to eliminate the victim to reclaim her social status and resolve her financial issues.",
    "motiveStrength": "strong",
    "alibiWindow": "Claims to have been with other guests in the dining room during the murder.",
    "accessPlausibility": "easy",
    "stakes": "Her social reputation and financial stability are on the line.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice speaks with a theatrical flair, often embellishing her words. She has a penchant for dramatic pauses and is prone to gossip-laden anecdotes.",
    "signatureTic": "One simply can't take the risk, can one?",
    "internalConflict": "Beatrice is torn between her desire for social supremacy and the fear of being unmasked as a fraud, as her gambling debts threaten her lifestyle.",
    "personalStakeInCase": "The murder could either free her from the shadow of the victim or expose her own precarious financial situation to the world.",
    "paragraphs": [
      "Beatrice Quill was the epitome of high society, her laughter ringing through the hotel like a bell at a grand ball. Yet beneath the glittering facade lay a simmering resentment towards the murder victim, whose very presence seemed to overshadow her at every gathering. 'One simply can't take the risk, can one?' she would often remark, her eyes glinting with a mix of charm and malice. Her social life was a delicate dance, and the stakes had never been higher.",
      "As whispers of scandal filled the air, Beatrice's heart raced. Her lavish parties, once the talk of the town, now felt like a precarious balancing act. Each guest's gaze seemed to pierce through her carefully constructed persona, threatening to expose the truth behind her gambling debts. The victim's death could serve as a catalyst for her rise, but it could also unravel everything she had worked to maintain. The tension was palpable, and Beatrice thrived in the chaos, her mind racing with possibilities.",
      "In the dining room, where she claimed to have been during the murder, Beatrice found herself playing a dangerous game. She engaged in spirited conversations while keenly observing the reactions of others, her sharp wit serving as both a shield and a weapon. Each laugh was laced with an undercurrent of desperation, a reminder that her social status hung by a thread. She maneuvered through the crowd with a practiced grace, knowing that one misstep could lead to her undoing.",
      "As the investigation deepened, Beatrice's internal conflict grew more pronounced. The desire to reclaim her social standing clashed with the fear of exposure. Would she be able to manipulate the narrative to her advantage, or would the truth catch up to her? In the midst of the swirling rumors and intrigue, Beatrice realized that her fate was intertwined with that of the murder investigation — a high-stakes game where the price of losing could be her entire world."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "Sylvia Trent, a local artist, grapples with insecurity and rumors while navigating her secret relationship with Captain Ivor Hale amidst the murder investigation.",
    "publicPersona": "An enigmatic figure known for her art inspired by the seaside landscape.",
    "privateSecret": "Has been in a secret relationship with Ivor, unaware of his feelings for Eleanor.",
    "motiveSeed": "Believes the victim has been spreading rumors about her art, threatening her livelihood.",
    "motiveStrength": "moderate",
    "alibiWindow": "Was painting in her room at the time of the murder.",
    "accessPlausibility": "possible",
    "stakes": "Her artistic career is at risk due to potential gossip.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks in a gentle, reflective tone, often using metaphorical language related to art. She has a tendency to pause, allowing her thoughts to blossom.",
    "signatureTic": "Art is a reflection of the soul, don’t you think?",
    "internalConflict": "Sylvia struggles with her self-worth as an artist and the fear that her relationship with Ivor might not be what she imagined.",
    "personalStakeInCase": "The murder investigation threatens not only her career but also the fragile relationship she has built with Ivor, which hangs precariously in the balance.",
    "paragraphs": [
      "Sylvia Trent was a woman of few words, her presence often overshadowed by the vibrant colors of her artwork. An artist inspired by the seaside's beauty, she found solace in painting, yet the tranquility of her world shattered with the news of the murder. 'Art is a reflection of the soul, don’t you think?' she mused, though her own soul was clouded by insecurities that gnawed at her heart. The rumors swirling around her art threatened not only her career but also her very identity.",
      "In the wake of the victim's death, Sylvia felt the weight of suspicion settling upon her like a heavy cloak. She had been painting in her room during the murder, but the whispers of gossip echoed louder than the brushstrokes on her canvas. The victim's alleged remarks about her work stung deeply, feeding her fears that she was not good enough. Each glance from others felt like an accusation, and she found herself retreating further into her artistic shell.",
      "Unbeknownst to her, Ivor's feelings for Eleanor were a complication she had never anticipated. Their secret relationship had been a source of joy, but now it felt precarious, teetering on the edge of uncertainty. Would he choose the radiant Eleanor over her? The thought consumed Sylvia's mind, and as she navigated the investigation, she became increasingly aware of the fragility of her own happiness. The stakes were higher than she had ever imagined.",
      "As the truth began to unfold around her, Sylvia's journey became one of self-discovery. She would have to confront not only the rumors threatening her career but also the insecurities that held her back. In a world where perception often overshadowed reality, Sylvia was determined to find her voice — both as an artist and as a woman in love. The murder investigation, with its tangled web of emotions, would ultimately force her to redefine her understanding of herself."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "Hugo Vane, a retired businessman, grapples with the fallout of a bitter dispute with the murder victim, risking his reputation amidst the investigation.",
    "publicPersona": "A wealthy retiree known for his philanthropic endeavors.",
    "privateSecret": "Had a business dispute with the victim over a failed investment, leading to bitter feelings.",
    "motiveSeed": "Angered by the victim's public humiliation of him during a recent social event.",
    "motiveStrength": "moderate",
    "alibiWindow": "Claimed to be at the bar during the murder but has no witnesses.",
    "accessPlausibility": "unlikely",
    "stakes": "His reputation and financial legacy are jeopardized by the victim's actions.",
    "humourStyle": "blunt",
    "humourLevel": 0.3,
    "speechMannerisms": "Hugo speaks in a straightforward manner, often cutting through pleasantries to get to the point. He has a habit of using terse phrases and direct language.",
    "signatureTic": "Let's not beat around the bush.",
    "internalConflict": "Hugo struggles with the bitterness of his past grudge against the victim while questioning whether it could lead him to violence.",
    "personalStakeInCase": "The murder investigation not only threatens his legacy but also forces him to confront the consequences of his past decisions.",
    "paragraphs": [
      "Hugo Vane was a man who had built his life on the foundations of business acumen and philanthropy, yet the recent murder cast a long shadow over his carefully curated reputation. 'Let's not beat around the bush,' he would often say, a bluntness that reflected his no-nonsense approach to life. But behind that exterior lay a simmering resentment towards the victim, whose public humiliation of him had left deep scars.",
      "The failed investment had been a bitter pill to swallow, and the victim's mocking laughter during a recent social event replayed in Hugo's mind like a haunting melody. He had thought himself above petty grievances, yet the murder forced him to confront the darker aspects of his character. Could he truly be capable of violence? The thought unsettled him, and as he navigated the investigation, he found himself grappling with that very question.",
      "At the bar, where he claimed to have been during the murder, Hugo felt a sense of isolation. The laughter and chatter of guests around him felt like a distant echo, and he was left with his thoughts — a storm of anger and regret. His alibi was weak, and without witnesses to vouch for him, the specter of suspicion loomed large. The stakes were not just personal; they were tied to his legacy, a legacy he had fought so hard to build.",
      "As the investigation unfolded, Hugo realized that the murder was not merely a crime; it was a reckoning. He would have to face the consequences of his past decisions and determine whether he would allow bitterness to define him. The path forward was fraught with danger, but perhaps it was also an opportunity to reclaim his integrity. In a world where reputation could be as fragile as glass, Hugo found himself at a crossroads, forced to confront the truth of who he had become."
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
    "place": "Dover",
    "country": "England",
    "summary": "A grand seaside hotel perched on the cliffs of Dover, offering breathtaking ocean views and an air of mystery.",
    "visualDescription": "Art Deco architecture with sweeping curves, large glass windows framing the sea, polished marble floors reflecting muted light, and grand chandeliers hanging from ornate ceilings.",
    "atmosphere": "A sense of foreboding lingers among the guests, each whisper echoing tales of secrets and dangers.",
    "paragraphs": [
      "The Crestview Hotel stands majestically on the cliffs of Dover, its Art Deco façade gleaming even under the overcast sky. The rhythmic sound of waves crashing against the rocks below mingles with the hushed conversations of the guests, each one a potential suspect. The air is thick with tension, as the shadows of the past weigh heavily on the minds of those who seek refuge within its walls. As rain begins to fall, the hotel’s grandeur feels both inviting and ominous, a sanctuary that may harbor dark secrets.",
      "Inside, the lobby bustles with life, adorned with plush seating and gleaming metal accents. The scent of damp sea air mixes with the sweet aroma of freshly baked pastries wafting from the dining area. Guests lounge in corners, their eyes darting toward the ocean-view windows, where grey clouds loom ominously. The ticking of a mantel clock punctuates the silence, reminding all of the fleeting nature of time, while a crackling radio broadcasts news from a world still recovering from war.",
      "As evening approaches, the atmosphere shifts subtly; the flickering lights cast long shadows that dance across the walls. The sound of laughter from the dining area contrasts sharply with the whispers of concern that ripple through the hotel. Outside, the wind howls against the cliffs, creating an eerie symphony that seems to echo the unspoken fears of the guests. The air is thick with the taste of salt and uncertainty, as the tide rolls in, bringing with it the promise of revelations and perhaps, deception."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "overcast with occasional rain, typical of coastal climates",
    "timeFlow": "Days of mounting tension and whispered secrets unfold within the hotel.",
    "mood": "tense and anticipatory, with whispers of recent events affecting guests",
    "eraMarkers": [
      "radio broadcasts in every guest room",
      "manual typewriters for correspondence",
      "rationed fuel impacting travel"
    ],
    "sensoryPalette": {
      "dominant": "the briny scent of the sea mixed with damp air",
      "secondary": [
        "the warmth of polished wood",
        "the cool touch of rain-dampened marble"
      ]
    },
    "paragraphs": [
      "The Crestview Hotel, with its grand entrance and sweeping ocean views, serves as a backdrop to the unfolding mystery. The air is thick with secrets and the salty tang of the sea, while the sound of crashing waves creates a constant reminder of nature's power. Inside, the ambiance shifts from opulence to unease as whispers of discontent circulate among the guests, each one harboring their own hidden truths.",
      "As the clouds gather and rain begins to fall, the atmosphere grows heavier. The flickering lights cast an unsettling glow over the polished surfaces, and the distant sound of thunder reverberates through the hotel, echoing the tension that simmers just beneath the surface. The guests, trapped in this cliffside haven, find themselves drawn into a web of intrigue, where every glance and every word carries the weight of suspicion."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Oceanview Room",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Luxurious room with a large window overlooking the sea, opulent furnishings, and dark curtains drawn tight.",
      "sensoryDetails": {
        "sights": [
          "dark curtains drawn tight",
          "waves crashing against cliffs",
          "elegantly arranged furniture",
          "traces of spilled wine on carpet",
          "shadows creeping across the floor"
        ],
        "sounds": [
          "distant crashing waves",
          "soft rustle of fabric",
          "muffled voices from the hallway",
          "occasional creak of floorboards",
          "the ticking of a clock"
        ],
        "smells": [
          "scent of damp sea air",
          "faint perfume lingering in the air",
          "musty fabric of the armchair",
          "spilled wine staining the carpet",
          "cold metal of a forgotten key"
        ],
        "tactile": [
          "smooth silk of the curtains",
          "cold touch of the window glass",
          "worn upholstery of the armchair",
          "cool marble of the nightstand",
          "slippery feel of spilled liquid"
        ]
      },
      "accessControl": "Guests may only enter during daytime; staff only allowed after hours for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain-streaked window",
            "grey light filtering through clouds",
            "mist rising from the sea"
          ],
          "sounds": [
            "steady drumming of rain",
            "soft whispers of guests",
            "distant thunder rumbling"
          ],
          "smells": [
            "damp wood",
            "fresh rain on stone",
            "salt from the sea"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light dulling colors",
            "shadows creeping along walls",
            "sudden movements in the corner of the eye"
          ],
          "sounds": [
            "silence broken by a distant clock",
            "the creak of old timbers",
            "soft footsteps in the hallway"
          ],
          "smells": [
            "beeswax from candles",
            "dust settling on surfaces",
            "the mustiness of old books"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering",
            "the last light of day fading"
          ],
          "sounds": [
            "the tick of a mantel clock",
            "distant laughter from the dining room",
            "the rustle of fabric as someone shifts"
          ],
          "smells": [
            "candle wax melting",
            "the hint of tobacco smoke",
            "the lingering scent of dinner"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanview Room, where the crime took place, is a study in contrasts. The luxurious decor, once a symbol of comfort, now feels suffocating. Dark curtains are drawn tight, blocking out the fading light, while the scent of damp sea air mingles with something more sinister. The room is eerily silent, save for the distant crashing of waves, creating an unsettling backdrop for the events that unfolded within these walls.",
        "As the investigation begins, every detail is scrutinized—the traces of spilled wine on the plush carpet, the faint perfume lingering in the air, and the cold metal of a forgotten key lying on the nightstand. This room, with its elegant furnishings, now holds the weight of a dark secret, as the shadows of the past loom larger with each passing moment."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Grand Dining Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Spacious room with large windows overlooking the beach, adorned with crystal chandeliers and polished mahogany tables.",
      "sensoryDetails": {
        "sights": [
          "glimmering chandeliers overhead",
          "elegantly set tables",
          "ocean waves visible through large windows",
          "decorative art deco motifs",
          "fresh flowers on every table"
        ],
        "sounds": [
          "clinking of cutlery",
          "murmurs of conversation",
          "soft piano music playing",
          "the rustle of napkins",
          "laughter echoing from guests"
        ],
        "smells": [
          "freshly baked bread",
          "roasted meats",
          "seafood dishes",
          "sweet pastries",
          "the scent of polished wood"
        ],
        "tactile": [
          "smooth surface of the table",
          "cool glass of water",
          "soft fabric of the napkin",
          "heavy silverware",
          "slightly warm bread rolls"
        ]
      },
      "accessControl": "Open to all guests during meal times; staff may enter to serve or clean.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "raindrops on window panes",
            "empty chairs waiting for breakfast"
          ],
          "sounds": [
            "soft patter of rain",
            "clinking of dishes",
            "the hum of conversation growing"
          ],
          "smells": [
            "fresh brewed coffee",
            "warm pastries",
            "the scent of wet earth"
          ],
          "mood": "quiet anticipation"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows falling across tables",
            "clouds rolling in over the sea",
            "distant figures on the beach"
          ],
          "sounds": [
            "the murmur of voices",
            "the soft thump of a waiter setting down plates",
            "the distant crash of the surf"
          ],
          "smells": [
            "the aroma of grilled fish",
            "buttery sauces",
            "fresh herbs"
          ],
          "mood": "sombre reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset over the ocean",
            "glow of candlelight",
            "guests in evening attire"
          ],
          "sounds": [
            "lively chatter and laughter",
            "the clinking of glasses",
            "soft music from a corner band"
          ],
          "smells": [
            "the scent of grilled meats",
            "citrus from desserts",
            "the fragrance of fine wine"
          ],
          "mood": "festive celebration"
        }
      ],
      "paragraphs": [
        "The Grand Dining Room exudes elegance, with its sweeping views of the ocean and luxurious decor. Here, guests gather to share meals and stories, the atmosphere alive with laughter and the clinking of cutlery. Crystal chandeliers cast a warm glow over polished mahogany tables, while the scent of freshly baked bread fills the air, drawing everyone into a shared experience. Yet beneath the surface, the tension grows, as whispers of recent events ripple among the diners.",
        "As evening descends, the mood shifts; the golden sunset spills through the windows, illuminating the faces of those gathered. The lively chatter and laughter mask the undercurrents of suspicion that weave through the room. Each guest is aware of the unspoken truths shared between them, and as the night wears on, the atmosphere grows thick with anticipation, a prelude to the revelations yet to come."
      ]
    },
    {
      "id": "library",
      "name": "The Hotel Library",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "Cozy room lined with dark wood shelves filled with books, a large fireplace, and comfortable reading chairs.",
      "sensoryDetails": {
        "sights": [
          "shelves overflowing with books",
          "flickering flames in the fireplace",
          "ornate rugs covering the floor",
          "soft light from desk lamps",
          "the rich color of leather-bound volumes"
        ],
        "sounds": [
          "crackling fire",
          "soft rustle of pages",
          "occasional coughs",
          "the ticking of a clock",
          "whispers of readers"
        ],
        "smells": [
          "the scent of old paper",
          "smoky aroma from the fireplace",
          "polished wood",
          "fresh ink from new books",
          "the faint scent of tea"
        ],
        "tactile": [
          "smooth leather of a book cover",
          "soft fabric of the armchair",
          "warmth from the fire",
          "cool glass of a reading lamp",
          "slightly rough texture of paper"
        ]
      },
      "accessControl": "Guests may enter during library hours; staff may use the room for meetings.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light spilling through windows",
            "drops of rain on the glass",
            "bookshelves glistening with moisture"
          ],
          "sounds": [
            "steady patter of rain",
            "soft whispers of conversation",
            "the rustle of pages turning"
          ],
          "smells": [
            "the scent of damp wood",
            "mildew from old books",
            "fresh coffee brewing nearby"
          ],
          "mood": "introspective solitude"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "dust motes dancing in the air",
            "the flicker of candlelight"
          ],
          "sounds": [
            "silence interrupted by a cough",
            "the soft thud of a book closing",
            "the ticking of a wall clock"
          ],
          "smells": [
            "the musty scent of aged paper",
            "the rich aroma of leather",
            "the faint whiff of tea"
          ],
          "mood": "sombre reflection"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "firelight casting shadows",
            "the glow of desk lamps",
            "the sparkle of a glass of whiskey"
          ],
          "sounds": [
            "the crackle of the fire",
            "soft murmurs of conversation",
            "the rustle of pages turning"
          ],
          "smells": [
            "the scent of burning wood",
            "the aroma of whiskey",
            "the smell of old books"
          ],
          "mood": "mysterious allure"
        }
      ],
      "paragraphs": [
        "The Hotel Library is a sanctuary of knowledge and secrets, where the air is thick with the scent of old paper and polished wood. Shelves lined with leather-bound tomes beckon to be explored, and the flickering flames in the fireplace create a warm and inviting atmosphere. It is here that clues may be discovered, hidden among the volumes that speak of times long past. The soft rustle of pages turning and the crackling fire provide a comforting backdrop, yet a sense of unease lingers, as if the very walls hold their breath.",
        "As evening falls, the library transforms into a realm of mystery. Shadows dance in the firelight, and the soft glow of lamps illuminates the faces of those who seek refuge here. Whispers of secrets shared and truths concealed fill the air, creating an ambiance ripe for revelation. Each book, each word, holds the potential for discovery, as the guests navigate the delicate balance between knowledge and the unknown."
      ]
    },
    {
      "id": "staff_area",
      "name": "The Kitchen",
      "type": "interior",
      "purpose": "Staff-only area",
      "visualDetails": "Functional space filled with stainless steel appliances, large prep tables, and shelves stocked with ingredients.",
      "sensoryDetails": {
        "sights": [
          "gleaming stainless steel appliances",
          "large pots hanging from hooks",
          "fresh herbs on the counter",
          "busy staff moving about",
          "flour dust settling on surfaces"
        ],
        "sounds": [
          "clattering of pots and pans",
          "sizzling food on the stove",
          "muffled conversations",
          "the hum of kitchen machinery",
          "the sound of running water"
        ],
        "smells": [
          "the aroma of sautéed onions",
          "freshly baked bread",
          "herbs and spices",
          "the scent of cleaning supplies",
          "smoky undertones from the grill"
        ],
        "tactile": [
          "cool metal of the prep table",
          "warmth of the oven",
          "rough texture of burlap sacks",
          "smooth surface of cutting boards",
          "slippery feel of spilled oil"
        ]
      },
      "accessControl": "Staff only; guests prohibited at all times. Locked after hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "steam rising from pots",
            "raindrops on window panes",
            "busy staff preparing breakfast"
          ],
          "sounds": [
            "the hiss of food cooking",
            "the clatter of dishes",
            "the soft patter of rain outside"
          ],
          "smells": [
            "the rich aroma of coffee",
            "freshly baked pastries",
            "the scent of wet earth"
          ],
          "mood": "hasty urgency"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows creeping across the floor",
            "the dull glow of overhead lights",
            "fresh produce stacked on counters"
          ],
          "sounds": [
            "the hum of kitchen machinery",
            "the chopping of vegetables",
            "the distant sound of laughter from the dining room"
          ],
          "smells": [
            "the scent of simmering broth",
            "the sweetness of ripe fruits",
            "the sharpness of spices"
          ],
          "mood": "busy efficiency"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "the warm glow of candlelight",
            "dishes being plated",
            "staff preparing for dinner service"
          ],
          "sounds": [
            "the sizzling of food",
            "the clinking of utensils",
            "the distant sounds of guests dining"
          ],
          "smells": [
            "the rich aroma of roasted meats",
            "the scent of fresh herbs",
            "the inviting smell of dessert"
          ],
          "mood": "preparatory excitement"
        }
      ],
      "paragraphs": [
        "The Kitchen is a hive of activity, where the heart of the hotel beats strongest. The gleaming stainless steel appliances and busy staff create an atmosphere of urgency and purpose. Aromas of sautéed onions and freshly baked bread mingle in the air, drawing the attention of anyone nearby. Here, the secrets of the hotel’s culinary delights are crafted, but whispers of hushed conversations suggest that not all is as it seems in this bustling space.",
        "As evening approaches, the kitchen transforms into a realm of preparation and excitement. The warm glow of candlelight spills in from the dining area, creating a contrast to the bustling efficiency within. Staff rush about, plating dishes with care, each one a piece of art meant to delight the guests. Yet, amidst the clatter of pots and pans, an undercurrent of tension simmers, hinting at the mysteries that lie just beyond the kitchen door."
      ]
    }
  ],
  "note": "",
  "cost": 0.00249190095,
  "durationMs": 36526
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1944,
    "month": "July",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "summer",
    "month": "July",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool coastal breezes"
    ],
    "daylight": "Long summer days with twilight lingering until well after eight o'clock, though often dimmed by heavy clouds.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests unwind after dinner.",
    "holidays": [
      "Independence Day (July 4) celebrations earlier in the month"
    ],
    "seasonalActivities": [
      "beachcombing along the shore",
      "evening strolls through seaside promenades",
      "attending outdoor band concerts"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted navy suit",
        "lightweight linen dress shirt",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "cotton short-sleeve button-up",
        "tweed trousers",
        "canvas loafers"
      ],
      "accessories": [
        "straw fedora",
        "pocket square",
        "classic wristwatch"
      ]
    },
    "womensWear": {
      "formal": [
        "elegant tea-length dress with floral prints",
        "lightweight cardigan",
        "periwinkle blue pumps"
      ],
      "casual": [
        "breezy cotton blouse",
        "high-waisted shorts",
        "comfortable espadrilles"
      ],
      "accessories": [
        "wide-brimmed sun hat",
        "string of pearls",
        "simple clutch handbag"
      ]
    },
    "trendsOfTheMoment": [
      "bold prints and patterns",
      "emphasis on practical wear due to wartime rationing",
      "influence of Hollywood glamour"
    ],
    "socialExpectations": [
      "men are expected to be the primary breadwinners",
      "women increasingly stepping into roles of independence",
      "strict formalities at social gatherings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "D-Day invasion's aftermath still influencing military strategy",
      "U.S. troops advancing in the Pacific Theater",
      "growing concerns about Soviet expansion in Eastern Europe"
    ],
    "politicalClimate": "Tension between the Allies and the Axis remains high, with the Cold War's seeds beginning to sprout.",
    "economicConditions": "Post-war optimism is tempered by ongoing rationing; consumer goods remain scarce, yet hope for a return to normalcy is palpable.",
    "socialIssues": [
      "women's rights and roles in the workforce",
      "racial segregation in many parts of the country",
      "the mental toll of war on returning soldiers"
    ],
    "internationalNews": [
      "Reports of resistance movements in occupied territories",
      "discussions of the formation of the United Nations"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby - 'Swinging on a Star'",
        "The Andrews Sisters - 'Boogie Woogie Bugle Boy'",
        "Frank Sinatra - 'I'll Be Seeing You'"
      ],
      "films": [
        "'To Have and Have Not'",
        "'Double Indemnity'",
        "'The Fighting Lady'"
      ],
      "theater": [
        "'Oklahoma!'",
        "'The Glass Menagerie'"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "The Jack Benny Program"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Fountainhead' by Ayn Rand",
        "'The Thin Man' by Dashiell Hammett",
        "'The Naked and the Dead' by Norman Mailer"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "war novels",
        "romantic fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "improved radio technology",
        "early television sets",
        "advancements in radar technology"
      ],
      "commonDevices": [
        "radio receivers in homes",
        "manual typewriters in offices",
        "steam irons for clothing care"
      ],
      "emergingTrends": [
        "increased availability of consumer goods post-rationing",
        "growing popularity of television in urban areas",
        "expansion of the automobile industry"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Bottle of milk: three pence",
        "Movie ticket: one shilling"
      ],
      "commonActivities": [
        "gathering for community picnics",
        "listening to radio broadcasts",
        "attending local fairs"
      ],
      "socialRituals": [
        "Sunday family dinners",
        "evening walks along the beach",
        "visiting local ice cream parlors"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "a growing middle class due to wartime jobs",
      "class divides still present but less pronounced"
    ],
    "gender": [
      "women are increasingly seen as capable in the workforce",
      "traditional gender roles are being challenged",
      "mixed feelings about women's independence"
    ],
    "race": [
      "racial segregation remains a contentious issue",
      "increasing awareness of civil rights among African Americans"
    ],
    "generalNorms": [
      "politeness and formality are still valued",
      "social gatherings often segregate by gender",
      "anxiety and anticipation of post-war life loom large"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of saltwater mixed with rain, a reminder of the ocean's proximity.",
    "A distant rumble of thunder echoes as guests gather in the hotel lounge, their conversations hushed by a shared tension.",
    "The flickering light of a radio cast shadows on the walls, punctuating the otherwise muted atmosphere with updates from the front lines."
  ],
  "paragraphs": [
    "On a damp July evening in 1944, the coastal hotel stood as a refuge for weary travelers and locals alike. Overcast skies hung low, promising intermittent rain that had already soaked the nearby beach. The air was thick with anticipation, a tension palpable among the guests, many of whom were still recovering from the recent celebrations of Independence Day. Conversations were punctuated by the occasional crack of thunder, and the distant sound of waves crashing against the rocks echoed a constant reminder of nature's power amid their human concerns.",
    "Fashion within the hotel lobby reflected the era's duality; men donned double-breasted navy suits paired with crisp linen shirts, while women embraced floral tea-length dresses that swayed gently with their movements. Accessories like straw fedoras and wide-brimmed hats adorned the guests, lending an air of glamour that masked the underlying anxiety of the times. The allure of Hollywood glamour was strong, influencing styles even in this coastal enclave, with casual attire giving way to a more polished presentation as evening approached.",
    "As the evening wore on, the hotel's common area buzzed with conversations and laughter, yet an undercurrent of uncertainty lingered. The radio crackled with news of military advances in Europe and the Pacific, each announcement met with a mixture of hope and dread. Social expectations dictated that men engage in discussions of war strategy while women navigated the complexities of their evolving roles in society. Outside, the rhythmic sound of rain against the windows provided a backdrop to the unfolding drama within, as whispers of recent events and rumors of shifting alliances filled the air."
  ],
  "note": "",
  "cost": 0.0010524459,
  "durationMs": 12004
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A grand seaside hotel hosts a mix of war-weary guests and ambitious social climbers, all drawn together by the promise of a lavish escape, yet haunted by the specter of recent tragedies and shifting allegiances.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The impact of WWII reshapes gender roles and class dynamics, as women assert their independence while societal tensions rise amid post-war optimism and Cold War anxieties."
  },
  "setting": {
    "location": "A grand seaside hotel perched on a cliffside overlooking the ocean",
    "institution": "hotel",
    "weather": "overcast with occasional rain, typical of coastal climates"
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
    "id": "high_tide_time",
    "value": "half past eleven at night",
    "description": "The exact time of high tide when the victim could have drowned."
  },
  {
    "id": "watch_stopped_time",
    "value": "ten minutes past eleven",
    "description": "The time at which the victim's watch stopped, indicating their last moments."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 18,
  "countsByPlacement": {
    "early": 5,
    "mid": 12,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 17,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_4",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "category": "testimonial"
    },
    {
      "id": "clue_7",
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
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_early_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_mid_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
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

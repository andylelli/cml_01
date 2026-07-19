# Actual Prompt Record

- Run ID: `mystery-1784460757946`
- Project ID: ``
- Timestamp: `2026-07-19T11:36:21.489Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `b6ec958cb67fa70b`

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
    "title": "The Delayed Dandelion",
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
      "subtype": "delayed-action poisoning"
    }
  },
  "death_method": "poisoned with dandelion toxin",
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "Detective",
      "relationships": [],
      "public_persona": "Sharp and observant investigator",
      "private_secret": "Struggles with self-doubt",
      "motive_seed": "inheritance",
      "motive_strength": "moderate",
      "alibi_window": "Time of death around dinner",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Desire for justice",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "Medical Professional",
      "relationships": [
        "Friend of the victim"
      ],
      "public_persona": "Respected doctor, well-liked",
      "private_secret": "Had a romantic interest in the victim",
      "motive_seed": "Unrequited love",
      "motive_strength": "high",
      "alibi_window": "Claims to have been in the lounge",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Medical supplies"
      ],
      "behavioral_tells": [
        "Nervous when discussing the victim"
      ],
      "stakes": "Reputation and emotional turmoil",
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
      "role_archetype": "Authority figure",
      "relationships": [
        "Former military acquaintance of victim"
      ],
      "public_persona": "Commanding officer, authoritative",
      "private_secret": "Regrets past decisions",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "Claims to be in the garden",
      "access_plausibility": "high",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "Professional integrity",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "Friend of the victim",
      "relationships": [
        "Close friend of Sylvia"
      ],
      "public_persona": "Cheerful and supportive",
      "private_secret": "Jealous of Sylvia’s success",
      "motive_seed": "Professional rivalry",
      "motive_strength": "moderate",
      "alibi_window": "Claims to have been in her room",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [
        "Avoids eye contact when asked about Sylvia"
      ],
      "stakes": "Career aspirations",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Sylvia Trent",
      "age_range": "25-35",
      "role_archetype": "victim",
      "relationships": [
        "Friend to Eleanor and Beatrice"
      ],
      "public_persona": "Charming and sociable",
      "private_secret": "Plagued by past mistakes",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "evening",
      "access_plausibility": "medium",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "35-45",
      "role_archetype": "Rival",
      "relationships": [
        "Business rival to Sylvia"
      ],
      "public_persona": "Ambitious and cunning",
      "private_secret": "Desires to eliminate competition",
      "motive_seed": "Financial gain",
      "motive_strength": "high",
      "alibi_window": "Claimed to be in the bar",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Knowledge of the garden layout"
      ],
      "behavioral_tells": [
        "Too eager to point fingers at others"
      ],
      "stakes": "Business success",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
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
      "summary": "In the foggy seaside town of Brighton, a respected doctor, Dr. Mallory Finch, finds herself embroiled in a murder investigation when her friend, Sylvia Trent, is found dead from a delayed-action poisoning. As tensions rise among the hotel guests, Eleanor Voss must sift through jealousy, ambition, and the secrets that lie beneath the surface."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The mechanism relies on dandelion, poison, and witness to expose the false timing.",
      "delivery_path": [
        {
          "step": "Dr. Mallory Finch administered the dandelion toxin to Sylvia during their last meal."
        }
      ]
    },
    "outcome": {
      "result": "Sylvia dies several hours after ingestion, misleading the timeline of her death."
    }
  },
  "false_assumption": {
    "statement": "Dr. Finch could not have poisoned Sylvia since they were seen together before dinner.",
    "type": "behavioral",
    "why_it_seems_reasonable": "Witnesses confirm their presence and conversation right before dinner.",
    "what_it_hides": "The delayed-action poison allows for a significant gap in timing that obscures the actual event."
  },
  "false_solution": {
    "accused_suspect": "Hugo Vane",
    "supporting_points": [
      "Hugo had a business rivalry with Sylvia, giving him a motive.",
      "Witnesses saw Hugo near the garden around the time of death."
    ],
    "the_one_flaw": "Hugo was actually in the bar during the time of poisoning, confirmed by multiple witnesses.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A strange residue found on the table where Sylvia last ate.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "The residue was from a spilled drink, confirmed by the kitchen staff.",
      "resolved_in_chapter": 7
    },
    {
      "id": "red_herring_2",
      "description": "Witnesses report seeing Dr. Finch linger near the garden just after dinner.",
      "points_at_suspect": "Dr. Mallory Finch",
      "innocent_explanation": "Dr. Finch was attending to another guest who had fallen ill, as confirmed by Eleanor.",
      "resolved_in_chapter": 7
    }
  ],
  "closed_circle": {
    "suspects": [
      "Eleanor Voss",
      "Dr. Mallory Finch",
      "Captain Ivor Hale",
      "Beatrice Quill",
      "Hugo Vane"
    ],
    "rationale": "All suspects were present at the hotel during the time of death, and no outsiders had access."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Dinner time approximately 7 PM",
        "Witnesses recall Sylvia's last meal hours before her symptoms appeared."
      ],
      "windows": [
        "Symptoms appeared around 10 PM",
        "Last seen healthy at 6:30 PM."
      ],
      "contradictions": [
        "Witnesses place Dr. Finch with Sylvia until shortly before dinner.",
        "Death occurred hours later, questioning the timeline."
      ]
    },
    "access": {
      "actors": [
        "Dr. Mallory Finch",
        "Sylvia Trent",
        "Beatrice Quill"
      ],
      "objects": [
        "Dandelion leaves",
        "Victim's drink",
        "Medical supplies"
      ],
      "permissions": [
        "Dr. Finch had access to the kitchen."
      ]
    },
    "physical": {
      "laws": [
        "Poison effects take time to manifest."
      ],
      "traces": [
        "No immediate signs of struggle or poison in the drink."
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor trusts Dr. Finch due to their long friendship."
      ],
      "authority_sources": []
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "Witnesses report seeing Sylvia looking healthy and vibrant at 6:30 PM.",
        "correction": "This suggests the poison was administered well before dinner.",
        "effect": "Narrows the time of poisoning to earlier in the day.",
        "required_evidence": [
          "Witness statements about Sylvia's health at 6:30 PM.",
          "Time of dinner confirmed to be at 7 PM."
        ],
        "reader_observable": true
      },
      {
        "observation": "A dandelion leaf was found in Sylvia's pocket.",
        "correction": "This indicates that dandelion was involved in the poisoning.",
        "effect": "Points to Dr. Finch as she discussed gardening with Sylvia.",
        "required_evidence": [
          "The dandelion leaf found in Sylvia's pocket.",
          "Eleanor's recollection of Sylvia discussing the garden."
        ],
        "reader_observable": true
      },
      {
        "observation": "Dr. Finch's alibi places her in the lounge, far from the kitchen.",
        "correction": "Her alibi fails to account for her access to the kitchen earlier.",
        "effect": "Eliminates Captain Hale as a suspect due to lack of motive.",
        "required_evidence": [
          "Dr. Finch's alibi statement.",
          "Kitchen access records confirming Dr. Finch was in the kitchen earlier."
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "The discriminating test compares poison, witness, and report against the claimed timeline.",
    "knowledge_revealed": "The dandelion toxin's delayed effect means the poison could only have been administered earlier in the day.",
    "pass_condition": "Dr. Finch's absence from the kitchen during the time of poisoning becomes evident, confirming her guilt.",
    "evidence_clues": [
      "clue_mechanism_visibility_core",
      "clue_7",
      "clue_culprit_direct_1"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: Witness statements and observations about Sylvia's health point to a delayed poisoning. Step 2: The discovery of the dandelion leaf and garden discussion ties Dr. Finch to the method. Step 3: Dr. Finch's unreliable alibi eliminates other suspects and reveals her access to the poison."
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
      "test_type": ""
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed he was in the garden during the time of death.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: Claims to have been in her room",
        "supporting_clues": []
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: evening",
        "supporting_clues": []
      },
      {
        "suspect_name": "Hugo Vane",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: Claimed to be in the bar",
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_7",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_culprit_direct_dr_mallory_finch",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_4",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_5",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_11",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_6",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
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
        "delivery_method": "Witness statement"
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
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "A retired schoolteacher with a penchant for observation, Eleanor Voss finds herself embroiled in a mystery that could unravel both family secrets and her own precarious financial situation.",
    "publicPersona": "The well-respected former teacher known for her wisdom and keen observations.",
    "privateSecret": "She is struggling with a financial crisis and needs to sell her family home.",
    "motiveSeed": "Curiosity about the family secrets linked to the victim's estate.",
    "motiveStrength": "moderate",
    "alibiWindow": "was in the hotel library reading from eight to nine",
    "accessPlausibility": "easy",
    "stakes": "Desires to uncover the truth for her own peace of mind and financial stability.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured tone, often using analogies and metaphors drawn from her teaching days. Her observations are sharp but delivered with a warmth that invites others to engage.",
    "signatureTic": "You know, it's a curious thing...",
    "internalConflict": "Eleanor grapples with the shame of her financial struggles, feeling that her once-stable life has crumbled into a series of desperate choices.",
    "personalStakeInCase": "The resolution of this crime could determine her financial future, as well as her connection to a community that once revered her.",
    "paragraphs": [
      "Eleanor Voss, once a beacon of wisdom in her small town, now wanders the aisles of the hotel library, her fingers trailing over the spines of dusty books as if searching for a lifeline. The quiet rustle of pages turning echoes her growing anxiety; she is not just reading for pleasure. Her financial situation looms like a specter, threatening to consume her family's legacy. The thought of selling her childhood home gnaws at her, mingling with her curiosity about the tangled web of secrets surrounding the victim's estate.",
      "In the dim light of the library, Eleanor’s sharp eyes catch the subtle nuances of human behavior, a skill honed over decades in the classroom. She notices the way people avoid eye contact or fidget when discussing the deceased; these are the telltale signs of hidden truths. \"You know, it's a curious thing...\" she muses, often to herself, as she pieces together what little information she can gather. Her instincts as an educator compel her to dig deeper, to unearth the truths that others wish to remain buried.",
      "Yet, beneath her composed exterior lies a tumultuous sea of self-doubt. Eleanor feels the weight of her past decisions: her retirement, once a celebration, now feels like a quiet admission of defeat. The impending sale of her family home looms like a dark cloud, overshadowing her every thought. She fears that revealing the secrets of others might expose her own vulnerabilities. What if her curiosity leads to a revelation that shatters her already fragile world?",
      "As the investigation unfolds, Eleanor finds herself reluctantly stepping into the role of an amateur sleuth. Each clue she uncovers is a step closer to not only solving the mystery but also reclaiming her sense of purpose. She recognizes that the stakes are higher than mere financial gain; her quest for truth becomes intertwined with her desire for redemption. If she can unravel the threads of deceit surrounding the victim's family, perhaps she can also weave a new narrative for herself—one where her past does not dictate her future."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A charming psychiatrist with a hidden agenda, Dr. Mallory Finch navigates the delicate balance between professional ethics and personal desires, all while entangled in a web of family secrets.",
    "publicPersona": "A charming psychiatrist who is well-liked in the community.",
    "privateSecret": "Dr. Finch is romantically involved with the victim's estranged sibling.",
    "motiveSeed": "Could inherit a sizeable estate if the victim is out of the picture.",
    "motiveStrength": "strong",
    "alibiWindow": "was in consultation with a patient from seven to eight-thirty",
    "accessPlausibility": "possible",
    "stakes": "Financial gain and desire to secure the future with their partner.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Dr. Finch speaks with a fluid elegance, often punctuating her sentences with a slight, knowing smile. Her tone is warm, yet her words can carry an edge, particularly when addressing uncomfortable truths.",
    "signatureTic": "Isn't it fascinating how people can be so complex?",
    "internalConflict": "Dr. Finch wrestles with the ethics of her dual life, torn between her professional responsibilities and the seductive allure of her personal ambitions.",
    "personalStakeInCase": "The outcome of this crime could drastically alter her future with her partner, as well as her professional reputation.",
    "paragraphs": [
      "Dr. Mallory Finch is the embodiment of charm, her laughter a melodic counterpoint to the somber atmosphere of the hotel. As a psychiatrist, she is accustomed to peeling back layers of human complexity, yet she finds herself entangled in a narrative far more intricate than any case she's ever handled. Her involvement with the victim's estranged sibling adds a layer of danger to her already precarious position. \"Isn't it fascinating how people can be so complex?\" she muses, a hint of irony lacing her voice as she navigates her dual existence.",
      "In public, she is the consummate professional, her every word measured and thoughtful, yet the shadows of her private life cast long over her intentions. The potential for financial gain looms large; the prospect of inheriting a sizeable estate tantalizes her, a siren's call that both excites and terrifies her. As she engages with the other guests, her polite savagery often surfaces, revealing a sharp wit that keeps others off balance. Yet, beneath this polished veneer lies a simmering conflict.",
      "Dr. Finch's consultations with patients have left her feeling increasingly isolated. The weight of her secret relationship presses heavily on her conscience, forcing her to confront the ethical lines she has blurred. With each passing day, she feels the tension between her professional duties and her personal desires grow more pronounced. Can she truly reconcile her ambition with the integrity of her practice, or will she be forced to choose one over the other?",
      "As the investigation unfolds, Dr. Finch realizes that the stakes are higher than she anticipated. The truth about Sylvia's death could shatter her carefully constructed world, threatening not only her future with her partner but also her standing in the community. She must tread carefully, balancing her ambitions against the moral implications of her actions. In the end, her journey may lead her to a reckoning that could redefine her identity, forcing her to confront the very complexities she once found so intriguing."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired naval officer with a storied past, Captain Ivor Hale grapples with the shadows of his former life while fiercely protecting his family's legacy amidst a brewing scandal.",
    "publicPersona": "A gruff yet honorable man with a long military background.",
    "privateSecret": "He has a hidden past involving a scandal during his service that could tarnish his reputation.",
    "motiveSeed": "Believes the victim planned to expose family secrets that would ruin his and the family's reputation.",
    "motiveStrength": "compelling",
    "alibiWindow": "was in his room from eight to nine-thirty, visited by a friend who can corroborate",
    "accessPlausibility": "possible",
    "stakes": "Protecting the family legacy and his own tarnished image.",
    "humourStyle": "deadpan",
    "humourLevel": 0.4,
    "speechMannerisms": "Ivor speaks in a clipped, authoritative manner, often punctuating his statements with a heavy pause that demands attention. His humor is understated, surfacing in dry remarks that reveal his disdain for trivialities.",
    "signatureTic": "In my experience, one must always be prepared for the unexpected.",
    "internalConflict": "Ivor is haunted by the memories of his past mistakes, and the fear of those mistakes resurfacing creates a constant tension within him.",
    "personalStakeInCase": "The investigation threatens to expose not only the family's dark secrets but also the remnants of his own past that he has worked hard to bury.",
    "paragraphs": [
      "Captain Ivor Hale stands as a monument to honor and duty, his gruff exterior masking a lifetime of unspoken regrets. A retired naval officer, he has long since traded the tumult of the sea for the quieter, yet no less turbulent, life of a family protector. His reputation as a man of integrity is hard-earned, yet the specter of a scandal from his past looms large, threatening to unravel the very fabric of his family’s legacy. \"In my experience, one must always be prepared for the unexpected,\" he often reminds those around him, though he knows all too well that some surprises are not easily weathered.",
      "The news of Sylvia's death sends shockwaves through Ivor's carefully constructed world. He believes she was on the verge of exposing secrets that could ruin not just him, but the entire family. The thought ignites a primal instinct to protect, a drive that has guided his actions throughout his military career. Yet, with each passing moment, the weight of his own hidden past constricts around him, a reminder that he cannot escape the consequences of his choices.",
      "As he navigates the investigation, Ivor presents a facade of stoicism, yet internally, he wrestles with the fear that the truth will surface, dragging his name through the mud. His interactions with the other suspects are marked by a tension that is palpable; he can sense their motives, their fears, and their desires, yet he remains guarded, unwilling to expose his vulnerability. His humor, when it surfaces, is laced with a dry wit that reflects his disdain for the frivolities of social life, a coping mechanism for a man who has seen too much.",
      "Ultimately, Ivor's journey is one of redemption. As the investigation unfolds, he must confront not only the secrets of the victim's family but also the shadows of his own past. The stakes are higher than mere reputation; they are a matter of legacy. To protect those he loves, he must reconcile his past mistakes with the man he aspires to be. In doing so, he may discover that true honor lies not in the absence of mistakes, but in the courage to face them."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "An aspiring artist caught between familial expectations and her own ambitions, Beatrice Quill struggles to find her voice amidst a backdrop of wealth and control.",
    "publicPersona": "A talented but struggling artist trying to find her place in the world.",
    "privateSecret": "Beatrice resents her wealthy family for stifling her artistic ambitions.",
    "motiveSeed": "Seeks to claim her inheritance to escape her family's control over her life and pursue her dreams.",
    "motiveStrength": "strong",
    "alibiWindow": "was painting in the garden from six to nine, but nobody saw her during that time",
    "accessPlausibility": "easy",
    "stakes": "Her future as an artist hinges on her family's wealth and support.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Beatrice's speech is infused with a sardonic edge, often laced with artistic jargon and vivid imagery. She speaks passionately, sometimes losing herself in the cadence of her thoughts.",
    "signatureTic": "What a tangled web we weave, isn't it?",
    "internalConflict": "Beatrice is torn between her desire for independence and the suffocating expectations imposed by her family, leading to feelings of resentment and frustration.",
    "personalStakeInCase": "The resolution of this crime could either free her from her family's grasp or further entrap her in their expectations.",
    "paragraphs": [
      "Beatrice Quill sits in the garden, brush in hand, attempting to capture the vibrant hues of the world around her. Yet, no matter how hard she tries, the colors never seem to reflect the turmoil within her. A talented artist, she is suffocated by the weight of her family's expectations, their wealth casting a long shadow over her aspirations. \"What a tangled web we weave, isn't it?\" she quips to herself, a sardonic smile tugging at her lips as she contemplates her situation.",
      "Her resentment towards her family simmers beneath the surface, a constant reminder of the sacrifices she has made for their approval. Each stroke of her brush is an act of rebellion, a desperate plea for independence that feels increasingly out of reach. Beatrice knows that claiming her inheritance could provide the freedom she craves, yet the thought of stepping over her family's corpse to achieve her dreams fills her with conflicting emotions. She yearns for a life where her art can flourish without the constraints of their wealth.",
      "As the investigation into Sylvia's death unfolds, Beatrice finds herself drawn into a world of intrigue that mirrors her own tumultuous existence. The other suspects, each with their own motives, become sources of both inspiration and anxiety. She observes their interactions with a keen eye, using her artistic sensibilities to decipher the unspoken tensions that linger in the air. Her humor, sharp and biting, serves as both a shield and a weapon, allowing her to navigate the complexities of her circumstances.",
      "Yet, the stakes are higher than mere artistic ambition; her future hangs in the balance. The resolution of the crime could either unshackle her from her family's control or further bind her to their expectations. Beatrice realizes that she must confront not only the shadows of her family but also the fears that have held her back. In seeking the truth, she may find the path to her own authenticity, learning that true artistry is born from the courage to embrace one's own voice."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "The glamorous socialite Sylvia Trent is entangled in a web of debt and desperation, leading her to make choices that could ultimately cost her everything.",
    "publicPersona": "A glamorous socialite with a keen interest in high society.",
    "privateSecret": "Sylvia is deeply in debt due to extravagant spending and is desperate for financial stability.",
    "motiveSeed": "Aims to eliminate the victim to gain access to their wealth and social standing.",
    "motiveStrength": "moderate",
    "alibiWindow": "was attending a cocktail party on the other side of the hotel, with several witnesses",
    "accessPlausibility": "unlikely",
    "stakes": "Desperation to maintain her social status and financial security.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Sylvia's speech is polished and articulate, reflecting her socialite status. She often speaks in grandiose terms, yet there is an underlying tension that betrays her desperation.",
    "signatureTic": "One must always maintain appearances, after all.",
    "internalConflict": "Sylvia is torn between her desire for financial stability and the need to uphold her glamorous facade, leading her to make morally questionable decisions.",
    "personalStakeInCase": "The outcome of this crime could determine her future in high society, as well as her ability to escape her financial burdens.",
    "paragraphs": [
      "Sylvia Trent glides through the cocktail party, her laughter ringing like chimes in the summer breeze. A glamorous socialite, she has mastered the art of appearances; yet, beneath the surface lies a tumultuous sea of debt and desperation. With each clink of champagne glasses, she reminds herself, \"One must always maintain appearances, after all.\" The facade is all she has left, a fragile shield against the encroaching reality of her financial instability.",
      "Her extravagant spending, once a source of pride, now feels like a noose tightening around her neck. Sylvia's debts are mounting, and whispers of her financial troubles circulate among the high society she so desperately wishes to impress. The thought of losing her status, of being cast out into obscurity, sends shivers down her spine. She dreams of a life free from the shackles of debt, where she can once again bask in the adoration of her peers.",
      "As the investigation into Sylvia's death unfolds, she becomes acutely aware of the stakes involved. The victim's wealth could solve her problems, a tempting solution that flirts with the edges of morality. Yet, even as she contemplates the unthinkable, a sense of dread washes over her. The very social circles that once embraced her may turn against her if her desperation is exposed. She is trapped in a gilded cage, and the bars are closing in.",
      "Sylvia's journey is one of reckoning, as she confronts the consequences of her choices. The pursuit of wealth and status has led her to a precipice, and the investigation threatens to unravel the carefully constructed image she has worked so hard to maintain. She must navigate a treacherous path, one where the lines between right and wrong blur, and the quest for survival could lead to her ultimate downfall."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "A persuasive financial advisor, Hugo Vane’s charm masks a darker truth as he navigates the dangerous waters of embezzlement and deception.",
    "publicPersona": "A successful and persuasive financial advisor known for his sharp wit.",
    "privateSecret": "Hugo has been embezzling funds from clients, and the victim was about to expose him.",
    "motiveSeed": "Stands to lose everything if the victim reveals his financial misdeeds.",
    "motiveStrength": "strong",
    "alibiWindow": "was in a private meeting from seven to eight-thirty but could have left unnoticed",
    "accessPlausibility": "possible",
    "stakes": "His career and freedom depend on silencing the victim.",
    "humourStyle": "blunt",
    "humourLevel": 0.4,
    "speechMannerisms": "Hugo speaks with a confident, almost aggressive cadence, using sharp, cutting remarks to assert his dominance in conversation. His humor is blunt, often leaving others reeling.",
    "signatureTic": "Let's not beat around the bush, shall we?",
    "internalConflict": "Hugo is caught in a web of lies, struggling with the fear of losing everything he's built through deception.",
    "personalStakeInCase": "The investigation threatens to expose his financial crimes, putting his career and freedom at risk.",
    "paragraphs": [
      "Hugo Vane strides through the hotel lobby with the kind of confidence that can only come from years of success in the cutthroat world of finance. A persuasive financial advisor, he is accustomed to charming his way through life, yet beneath that polished exterior lies a darker truth. He has been embezzling funds from clients, a secret that could unravel everything if the victim reveals his misdeeds. \"Let's not beat around the bush, shall we?\" he often declares, a bluntness that disarms those around him even as it masks his own anxiety.",
      "His alibi is a fragile shield, one that could easily crumble under scrutiny. Though he claims to have been in a private meeting, the truth is that he could have slipped away unnoticed, a fact that gnaws at him. Every interaction with others feels like a high-stakes game of poker, where he must maintain his composure while the cards of deception pile up. The stakes are not just career-related; they are existential, and the fear of being exposed sends chills down his spine.",
      "As the investigation unfolds, Hugo finds himself increasingly on edge. The other suspects seem oblivious to the storm brewing within him, but he knows that their fates are intertwined with his own. The tension in the air is palpable, and he senses that the walls are closing in. His sharp wit, once a tool for persuasion, now feels like a double-edged sword, cutting deeper into his conscience with each passing moment.",
      "Hugo's journey is one of reckoning, as he confronts the ghosts of his choices. The allure of wealth and power has come at a steep price, and as the investigation progresses, he must face the reality of his actions. The question looms large: will he continue to ride the wave of deception, or will he find the courage to confront the truth before it consumes him completely?"
    ],
    "order": 6
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "The Delayed Dandelion Hotel",
    "type": "hotel",
    "place": "Brighton",
    "country": "England",
    "summary": "A grand seaside hotel blending Victorian elegance with Art Deco flair, overlooking the tumultuous ocean and surrounded by lush gardens.",
    "visualDescription": "The hotel's façade boasts ornate cornices and sweeping balconies, with large, artfully etched glass windows framing views of the churning sea. Inside, the lobby features a sweeping staircase, plush velvet furnishings, and a grand chandelier that casts a warm glow over the polished marble floors.",
    "atmosphere": "A mix of grandeur and unease, where the elegance of the past collides with the uncertainty of the present.",
    "paragraphs": [
      "The Delayed Dandelion Hotel stands proudly on the cliffside, its intricate architecture a testament to a bygone era. As guests arrive through the heavy oak doors, they are greeted by the faint scent of salt and dampness from the sea, mingling with the rich aroma of polished wood and old books from the library nearby. The lobby, with its high ceilings and ornate chandelier, feels both welcoming and oppressive, as whispers of secrets and suspicions weave through the air like the fog rolling in off the coast.",
      "Outside, the sprawling gardens are a tangled mix of wildflowers and manicured hedges, leading down to the rocky shoreline. The sound of waves crashing against the cliffs reverberates through the corridors, an ever-present reminder of nature's power. In the evenings, the hotel transforms as candlelight flickers in the dining room, casting dancing shadows on the walls, while the distant hum of a radio broadcasts the latest news, a stark contrast to the stillness of the fog-cloaked night.",
      "As the days pass, the hotel becomes a microcosm of tension, with guests eyeing one another warily, each harboring their own secrets. The narrow hallways create a sense of confinement, amplifying the whispers and soft footfalls of those who tread lightly, as if afraid to disturb the uneasy peace. With each passing moment, the atmosphere thickens, leaving an indelible mark on the hearts of those who linger within its walls."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Foggy with occasional rain, typical of coastal climates",
    "timeFlow": "Days of mounting tension, secrets unfolding",
    "mood": "Tense and reflective, with an undercurrent of uncertainty among guests",
    "eraMarkers": [
      "Radio broadcasts filling the air",
      "Early television sets flickering in guest rooms",
      "Post-war automobiles parked out front"
    ],
    "sensoryPalette": {
      "dominant": "Salty sea air mixed with damp wood",
      "secondary": [
        "Flickering candlelight warmth",
        "Rich aroma of polished leather"
      ]
    },
    "paragraphs": [
      "The atmosphere of The Delayed Dandelion Hotel is one of contrasting elements, where the grandeur of its architecture is shadowed by the weight of unspoken words. The salty tang of the sea mingles with the musty scent of old books, creating a rich tapestry of sensory experiences. Each corner of the hotel seems to hold a story, a secret waiting to be uncovered, as the fog rolls in, obscuring the truth and blurring the lines between past and present.",
      "As guests navigate the narrow hallways and ascending staircases, the echo of their footsteps intertwines with the distant crash of waves, creating a rhythm that underscores the tension in the air. The flickering candlelight casts elongated shadows, enhancing the feeling of isolation and intrigue, while the soft hum of radios in the background offers a reminder of the world outside, a world filled with uncertainties echoing the mysteries within."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Ocean View Lounge",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Floor-to-ceiling windows overlooking the turbulent sea; plush, faded armchairs scattered around a central coffee table; a grand piano in the corner, untouched.",
      "sensoryDetails": {
        "sights": [
          "damp curtains billowing slightly",
          "flickering candle flames",
          "dark wood paneling",
          "ocean waves crashing against rocks"
        ],
        "sounds": [
          "soft murmur of guests",
          "crackling of the fire",
          "distant thunder rolling",
          "the occasional clink of glass"
        ],
        "smells": [
          "wet seaweed and salt air",
          "smoky wood from the fireplace",
          "old leather and varnished wood",
          "hint of damp carpet"
        ],
        "tactile": [
          "cold glass of the window",
          "soft upholstery of armchairs",
          "smooth surface of the coffee table",
          "chill of the evening air"
        ]
      },
      "accessControl": "Restricted to hotel guests after hours; staff only permitted during cleaning hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through clouds",
            "raindrops tracing paths on windows",
            "mist rising from the sea"
          ],
          "sounds": [
            "steady rain tapping on glass",
            "muffled conversations from the lobby",
            "the distant sound of seagulls"
          ],
          "smells": [
            "fresh rain on stone",
            "wet earth and sea air",
            "damp wool from guests' coats"
          ],
          "mood": "oppressive, heavy with secrets"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light casting long shadows",
            "clouds hanging low on the horizon",
            "flickering lights from vintage radios"
          ],
          "sounds": [
            "the ticking of a mantel clock",
            "soft piano notes from the corner",
            "the rustle of newspaper pages"
          ],
          "smells": [
            "dust mingling with dampness",
            "scent of old books",
            "hint of tobacco smoke"
          ],
          "mood": "uneasy stillness, thick with tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden sunset reflecting on the water",
            "long shadows stretching across the floor",
            "glow of candlelight on tables"
          ],
          "sounds": [
            "soft laughter from the bar",
            "the distant sound of waves",
            "the crackle of the fire"
          ],
          "smells": [
            "warmth of baked bread",
            "freshly brewed coffee",
            "scent of polished wood"
          ],
          "mood": "tense anticipation, secrets on the brink of revelation"
        }
      ],
      "paragraphs": [
        "The Ocean View Lounge, once a place of laughter and light, has taken on a somber air. The flickering candle flames cast dancing shadows on the dark wood paneling, while the sound of the ocean's relentless assault on the cliffs serves as a grim reminder of the turmoil within. Plush armchairs, now slightly worn, invite guests to sink in, yet the atmosphere feels heavy, as if the very walls hold their breath, waiting for the truth to be revealed.",
        "As the rain begins to fall, the lounge transforms into a cocoon of warmth and tension. The soft murmur of guests blends with the crackling fire, creating an intimate yet charged environment. Each flicker of light reveals glimpses of anxious faces, eyes darting towards the windows where raindrops race down the glass, mirroring the urgency of the secrets that lie just beneath the surface."
      ]
    },
    {
      "id": "library",
      "name": "The Grand Library",
      "type": "interior",
      "purpose": "Gathering space, clue discovery",
      "visualDetails": "Tall shelves filled with dusty tomes; a large mahogany table at the center, surrounded by high-backed chairs; a large fireplace with a brass fender.",
      "sensoryDetails": {
        "sights": [
          "dust motes dancing in sunlight",
          "old leather-bound books",
          "faded maps pinned to the walls",
          "ornate globe in the corner"
        ],
        "sounds": [
          "soft rustling of pages",
          "crackling fire in the hearth",
          "whispers echoing softly",
          "the tick of a wall clock"
        ],
        "smells": [
          "old paper and ink",
          "smoky scent of burnt wood",
          "freshly brewed tea",
          "hint of polished furniture"
        ],
        "tactile": [
          "smooth leather of book covers",
          "cool marble table surface",
          "soft upholstery of chairs",
          "warmth radiating from the fireplace"
        ]
      },
      "accessControl": "Open to all guests during the day; locked after hours; staff may access for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dim light filtering through clouds",
            "water droplets on window panes"
          ],
          "sounds": [
            "steady rain against the roof",
            "soft footsteps on the carpet",
            "the distant sound of thunder"
          ],
          "smells": [
            "damp wood and paper",
            "scent of wet earth outside",
            "faint aroma of chamomile tea"
          ],
          "mood": "somber and introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flat light casting muted colors",
            "bookshelves stretching into shadows",
            "flickering candle flames"
          ],
          "sounds": [
            "soft creaking of floorboards",
            "the rustle of turning pages",
            "quiet murmurs of discussion"
          ],
          "smells": [
            "dust and old leather",
            "scent of brewing coffee",
            "whiff of burnt toast from the kitchen"
          ],
          "mood": "tense with anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light from the fireplace",
            "long shadows across the floor",
            "glow of table lamps illuminating pages"
          ],
          "sounds": [
            "the crackle of the fire",
            "clinking of teacups",
            "soft laughter from nearby"
          ],
          "smells": [
            "rich aroma of coffee",
            "freshly baked pastries",
            "scent of polished wood"
          ],
          "mood": "warm yet charged"
        }
      ],
      "paragraphs": [
        "The Grand Library serves as a refuge for guests seeking solace or answers. Tall shelves, heavy with dust and knowledge, form a labyrinth of intrigue, inviting exploration. The comforting crackle of the fire and the soft rustling of pages create a serene backdrop, yet an undercurrent of tension lingers in the air. Whispers of secrets exchanged between guests fill the room, amplifying the sense of urgency as they search for clues hidden within the pages of forgotten texts.",
        "As the afternoon wears on, the library becomes a hub of speculation and hushed conversations. The scent of old paper and brewing tea mingles, drawing guests into its warm embrace. Shadows stretch across the floor, creating an atmosphere thick with anticipation, as the weight of the past presses down on those who seek to uncover the truth. Here, amidst the tomes and the whispers, lies the potential for revelation or ruin."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Dining Room",
      "type": "interior",
      "purpose": "Gathering space, clue discovery",
      "visualDetails": "Long, elegantly set tables with fine china; large windows overlooking the ocean; a grand chandelier hanging from the ceiling.",
      "sensoryDetails": {
        "sights": [
          "gleaming silverware and crystal glasses",
          "white tablecloths draped elegantly",
          "fresh flowers in vases",
          "soft glow of candlelight"
        ],
        "sounds": [
          "clinking of cutlery",
          "murmurs of conversation",
          "the soft pop of corks",
          "the distant sound of waves"
        ],
        "smells": [
          "savory aromas of roasted meats",
          "freshly baked bread",
          "scent of herbs and spices",
          "hint of floral perfume"
        ],
        "tactile": [
          "smoothness of polished wood",
          "coolness of glassware",
          "soft fabric of napkins",
          "warmth of the room"
        ]
      },
      "accessControl": "Open to all guests during meal times; staff may access for service; private events restrict access.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "cloudy sky casting dim light",
            "raindrops streaming down window panes",
            "soft glow of breakfast tables"
          ],
          "sounds": [
            "the soft patter of rain outside",
            "clinking of coffee cups",
            "the hum of conversation"
          ],
          "smells": [
            "freshly brewed coffee",
            "scent of sizzling bacon",
            "warmth of freshly baked pastries"
          ],
          "mood": "cozy and intimate"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "soft shadows on the table",
            "candles flickering in the gloom"
          ],
          "sounds": [
            "the rustle of napkins",
            "quiet conversations",
            "the distant sound of waves crashing"
          ],
          "smells": [
            "aroma of simmering sauces",
            "fresh herbs and spices",
            "scent of baked desserts"
          ],
          "mood": "suspenseful and charged"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off glass",
            "glowing sunset through windows",
            "elegantly dressed guests"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "the soft strumming of a guitar",
            "the crackle of the fireplace"
          ],
          "smells": [
            "rich aroma of gourmet dishes",
            "scent of fine wine",
            "freshly cut flowers"
          ],
          "mood": "elegant yet tense"
        }
      ],
      "paragraphs": [
        "The Dining Room, with its long, elegantly set tables, is a feast for the senses. Glistening silverware and crystal glasses catch the candlelight, creating a warm glow that contrasts with the cool sea air wafting through the open windows. The savory aromas of roasted meats and freshly baked bread mingle, inviting guests to indulge in the evening's offerings. Yet, beneath the surface of laughter and clinking glasses, an air of tension simmers, as each guest navigates the delicate dance of polite conversation while harboring their own secrets.",
        "As the evening progresses, the atmosphere shifts, the dining experience transforming into a high-stakes game of intrigue. The soft strumming of a guitar blends with the murmur of conversation, creating a backdrop of intimacy tinged with uncertainty. Guests exchange glances over their plates, aware that the shadows cast by the flickering candlelight may conceal more than just their reflections; they may hide the very truths they seek to uncover."
      ]
    }
  ],
  "note": "",
  "cost": 0.00220982355,
  "durationMs": 21544
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1940,
    "month": "January",
    "day": null,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "January",
    "weather": [
      "foggy with occasional rain",
      "overcast skies",
      "cold winds from the sea"
    ],
    "daylight": "Short daylight hours with the sun rising around 8:00 AM and setting by 4:30 PM, leaving long shadows and an early dusk.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after dinner has concluded",
    "holidays": [
      "New Year's Day"
    ],
    "seasonalActivities": [
      "indoor games by the fireplace",
      "evening dances at the hotel ballroom",
      "reading in cozy nooks with hot tea"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suits",
        "dress shirts with wide collars",
        "crepe-soled shoes"
      ],
      "casual": [
        "tweed sport jackets",
        "corduroy trousers",
        "knit sweaters"
      ],
      "accessories": [
        "fedora hats",
        "silk ties",
        "leather gloves"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dresses with fitted bodices",
        "elegant evening gowns with tailored sleeves",
        "fur-trimmed coats"
      ],
      "casual": [
        "tweed skirts",
        "knitted cardigans",
        "blouses with Peter Pan collars"
      ],
      "accessories": [
        "cloche hats",
        "string of pearls",
        "faux fur stoles"
      ]
    },
    "trendsOfTheMoment": [
      "bold geometric prints",
      "pastel colors for daytime wear",
      "utilitarian fashion for comfort"
    ],
    "socialExpectations": [
      "men are expected to wear hats outdoors",
      "women should wear gloves at formal events",
      "social gatherings are essential for community bonding"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Germany invades Poland, escalating tensions in Europe",
      "the United Kingdom increases preparations for potential conflict",
      "discussions of military alliances intensify"
    ],
    "politicalClimate": "Growing apprehension about the rise of totalitarian regimes in Europe, resulting in increased public interest in military readiness.",
    "economicConditions": "Strained economy recovering from the Great Depression; rationing of certain goods begins to be discussed as a potential necessity.",
    "socialIssues": [
      "women's roles in the workforce are evolving",
      "debates over civil liberties in wartime",
      "the impact of the ongoing war on families and communities"
    ],
    "internationalNews": [
      "the League of Nations struggles to maintain peace",
      "the U.S. remains neutral but faces pressure to aid allies",
      "increased propaganda efforts by various nations"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Bing Crosby's 'White Christmas'",
        "Glenn Miller's swing music",
        "Doris Day's early recordings"
      ],
      "films": [
        "'The Great Dictator' by Charlie Chaplin",
        "'Rebecca' directed by Alfred Hitchcock",
        "'The Letter' starring Bette Davis"
      ],
      "theater": [
        "'The Skin of Our Teeth' by Thornton Wilder",
        "'The Philadelphia Story' starring Katharine Hepburn"
      ],
      "radio": [
        "The Lone Ranger",
        "The Shadow",
        "Lux Radio Theatre"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Grapes of Wrath' by John Steinbeck",
        "'Brave New World' by Aldous Huxley",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "detective fiction",
        "social commentary",
        "romantic novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "radar technology for military use",
        "improvements in radio broadcasting",
        "the early development of television"
      ],
      "commonDevices": [
        "phonographs for music playback",
        "manual typewriters",
        "early vacuum cleaners"
      ],
      "emergingTrends": [
        "increased interest in home appliances",
        "the rise of the automobile culture",
        "adoption of household electrical devices"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Coal scuttle refill: one shilling sixpence",
        "Taxi across town: two shillings"
      ],
      "commonActivities": [
        "gathering for tea in the afternoon",
        "taking evening walks despite the cold",
        "engaging in community fairs or markets"
      ],
      "socialRituals": [
        "afternoon tea served with biscuits",
        "formal dinners with multiple courses",
        "weekly church services followed by social gatherings"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing tensions between social classes due to economic strains",
      "growing awareness of class disparities"
    ],
    "gender": [
      "women are now entering the workforce in greater numbers",
      "traditional gender roles are slowly changing",
      "expectations for women to be homemakers still prevail"
    ],
    "race": [
      "racial tensions simmering in urban areas",
      "a push for civil rights begins to gain traction"
    ],
    "generalNorms": [
      "community and family bonds are valued",
      "patriotism is emphasized amidst global tensions",
      "conformity in social behaviors is encouraged"
    ]
  },
  "atmosphericDetails": [
    "The scent of wet earth mixed with smoke from the fireplace fills the air, lending a cozy yet tense atmosphere to the hotel.",
    "The muted sounds of distant laughter and clinking glasses echo through the dimly lit ballroom as guests gather for a dance, but an undercurrent of anxiety lingers.",
    "Fog rolls in from the coast, obscuring the view of the sea, wrapping the hotel in a shroud that amplifies the whispers of uncertainty among the guests."
  ],
  "paragraphs": [
    "January 1940 brings a chilling embrace to the coastal hotel, where the fog hangs thick, obscuring the world outside and enveloping guests in a sense of mystery and tension. With the sun barely rising by eight and setting long before five, evenings stretch out like the shadows cast by flickering gas lamps. The sound of rain pattering against the windowpanes creates a rhythmic backdrop to the hushed conversations and laughter echoing through the hotel halls, reminding everyone of the uncertainties that linger just beyond the fog.",
    "Fashion reflects the era's complexity, as men don double-breasted wool suits paired with crepe-soled shoes, while women opt for elegant tea-length dresses adorned with bold geometric prints. Cloche hats and silk ties are common accessories, adding a touch of sophistication to the gathering. The ballroom buzzes with excitement as couples dance to Glenn Miller’s swing music, though the atmosphere is tinged with a sense of foreboding, as conversations often drift towards the war brewing in Europe and its implications for those gathered.",
    "Daily life in January 1940 is marked by communal rituals and a shared resilience. Afternoon tea is a cherished tradition, where attendees savor biscuits and exchange pleasantries, while formal dinners serve as an opportunity for families to reconnect amidst the chaos of the world outside. Despite the chill in the air, guests often take evening walks, wrapped in fur-trimmed coats, reflecting on the shifting tides of society and the roles expected of them. Tensions are palpable, yet there is a sense of unity in the face of uncertainty, as everyone clings to the familiar comforts of home and community."
  ],
  "note": "",
  "cost": 0.001071477,
  "durationMs": 14810
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A delayed-action poisoning at a prestigious seaside hotel brings together a diverse group of guests and staff, all navigating the pressures of post-war societal change and Cold War anxieties.",
  "era": {
    "decade": "1940s",
    "socialStructure": "Post-WWII recovery with increased workforce participation of women and heightened tensions from the emerging Cold War, creating a backdrop of uncertainty and shifting social roles."
  },
  "setting": {
    "location": "A grand seaside hotel built in the early 1900s, overlooking the ocean and surrounded by a sprawling garden.",
    "institution": "hotel",
    "weather": "Foggy with occasional rain, typical of coastal climates."
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
    "id": "victim_last_meal",
    "value": "dandelion salad",
    "description": "The victim consumed a meal containing the toxic plant."
  },
  {
    "id": "poisoning_time",
    "value": "ten minutes past eight",
    "description": "The victim was poisoned at this specific time during dinner."
  },
  {
    "id": "toxin_effect_time",
    "value": "three hours",
    "description": "The toxin takes three hours to manifest symptoms."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 16,
  "countsByPlacement": {
    "early": 7,
    "mid": 8,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 15,
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
      "category": "temporal"
    },
    {
      "id": "clue_3",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
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
      "category": "temporal"
    },
    {
      "id": "clue_6",
      "placement": "mid",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_7",
      "placement": "early",
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
      "id": "clue_core_elimination_chain",
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
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_culprit_direct_dr_mallory_finch",
      "placement": "early",
      "criticality": "essential",
      "category": "testimonial"
    },
    {
      "id": "clue_early_1",
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
      "id": "clue_fp_contradiction_step_2",
      "placement": "early",
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

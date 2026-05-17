# Actual Prompt Record

- Run ID: `mystery-1778924663315`
- Project ID: ``
- Timestamp: `2026-05-16T09:47:13.422Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `5f65e8a8db5bce72`

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
      "place": "grand country estate",
      "country": "England",
      "institution": "Manor house"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical tampering"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Dr. Mallory Finch (colleague)",
        "Captain Ivor Hale (friend)",
        "Beatrice Quill (friend)"
      ],
      "public_persona": "Intelligent and observant",
      "private_secret": "Secretly in love with Captain Hale",
      "motive_seed": "Curiosity and justice",
      "motive_strength": "strong",
      "alibi_window": "evening of the party",
      "access_plausibility": "high",
      "opportunity_channels": [
        "attending the party",
        "access to the clock"
      ],
      "behavioral_tells": [
        "Keen attention to detail",
        "Frequent questioning"
      ],
      "stakes": "Finding the truth",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "expert",
      "relationships": [
        "Eleanor Voss (colleague)",
        "Beatrice Quill (acquaintance)"
      ],
      "public_persona": "Respected physician",
      "private_secret": "Financial troubles",
      "motive_seed": "Desperation for money",
      "motive_strength": "moderate",
      "alibi_window": "during the party",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "medical expertise",
        "presence at the estate"
      ],
      "behavioral_tells": [
        "Nervous around money discussions"
      ],
      "stakes": "Protecting his reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "30-40",
      "role_archetype": "friend",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (colleague)"
      ],
      "public_persona": "Charming and brave",
      "private_secret": "Harbors feelings for Eleanor",
      "motive_seed": "Jealousy",
      "motive_strength": "low",
      "alibi_window": "evening of the party",
      "access_plausibility": "high",
      "opportunity_channels": [
        "attending the party",
        "access to the clock"
      ],
      "behavioral_tells": [
        "Protective of Eleanor"
      ],
      "stakes": "Maintaining his honor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "30-40",
      "role_archetype": "friend",
      "relationships": [
        "Eleanor Voss (friend)",
        "Captain Ivor Hale (friend)"
      ],
      "public_persona": "Charming hostess",
      "private_secret": "Envious of Eleanor's intelligence",
      "motive_seed": "Rivalry",
      "motive_strength": "moderate",
      "alibi_window": "during the party",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "hosting the party",
        "control over the schedule"
      ],
      "behavioral_tells": [
        "Defensive when questioned"
      ],
      "stakes": "Preserving her social standing",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
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
      "summary": "During a lavish party at a grand estate, the seemingly accidental death of Eleanor Voss reveals a meticulously planned murder that hinges on a tampered clock. As the guests grapple with their secrets and motivations, Eleanor's keen investigative skills uncover the truth behind the clockwork conspiracy."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A mechanical clock was tampered with to create an alibi for the murder, causing a chandelier to fall at a precisely timed moment.",
      "delivery_path": [
        {
          "step": "The clock was reset to show a different time."
        },
        {
          "step": "A wire was rigged to the chandelier to ensure it would fall."
        },
        {
          "step": "The falling chandelier concealed the murder."
        }
      ]
    },
    "outcome": {
      "result": "The tampering of the clock resulted in Eleanor's death appearing accidental."
    }
  },
  "false_assumption": {
    "statement": "Eleanor was killed by an accidental chandelier fall during the party.",
    "type": "temporal",
    "why_it_seems_reasonable": "The chandelier fell just as the clock struck a certain hour, leading guests to believe it was a tragic accident.",
    "what_it_hides": "The clock was deliberately tampered with to conceal the timing of the murder."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "Clock striking ten minutes past eleven",
        "Chandelier falling at eleven"
      ],
      "windows": [
        "Party beginning at nine",
        "Chandelier falling at eleven"
      ],
      "contradictions": [
        "Witnesses claim the chandelier fell at eleven, but the clock was tampered with to show a different time."
      ]
    },
    "access": {
      "actors": [
        "Beatrice Quill",
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale"
      ],
      "objects": [
        "Chandelier",
        "Clock",
        "Wiring tools"
      ],
      "permissions": [
        "All guests had access to the main hall."
      ]
    },
    "physical": {
      "laws": [
        "Gravity causing the chandelier to fall"
      ],
      "traces": [
        "Wire marks on the chandelier",
        "Clock faces showing tampering"
      ]
    },
    "social": {
      "trust_channels": [
        "Friends among the guests",
        "Professional respect for Dr. Finch"
      ],
      "authority_sources": [
        "Beatrice Quill as the hostess"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The chandelier was rigged with a thin wire that was found nearby.",
        "correction": "This indicates premeditated tampering rather than an accident.",
        "effect": "Eliminates the assumption that the chandelier fell accidentally.",
        "required_evidence": [
          "Wire found near the chandelier",
          "Witnesses heard the clock strike eleven",
          "Eleanor was last seen near the chandelier"
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock in the main hall shows ten minutes past eleven, not eleven.",
        "correction": "This suggests that the clock was tampered with to create a false timeline.",
        "effect": "Narrows the timeline of the murder to before the chandelier fell.",
        "required_evidence": [
          "Clock face showing ten minutes past eleven",
          "Witnesses recalling the time of the chandelier fall",
          "Eleanor's movements prior to the fall"
        ],
        "reader_observable": true
      },
      {
        "observation": "Gears were found scattered near the clock.",
        "correction": "This implies that someone manipulated the clock to confuse witnesses.",
        "effect": "Eliminates Dr. Mallory Finch by proving he had no access to the clock mechanism.",
        "required_evidence": [
          "Gears found near the clock",
          "Dr. Finch's alibi during the clock's tampering",
          "Witness statements about Dr. Finch's location"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A comparison of the rigged clock with the witness statements about the chandelier fall proves that the clock was tampered with to create an alibi for Beatrice.",
    "knowledge_revealed": "The revealed facts are witnes, clock, and chandelier.",
    "pass_condition": "Proves Beatrice Quill's premeditation in tampering with the clock.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_8",
      "clue_10",
      "clue_mechanism_visibility_core"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The wire found near the chandelier and witness statements show the chandelier was rigged. Step 2: The clock showing ten minutes past eleven contradicts the time of the chandelier fall, revealing tampering. Step 3: The scattered gears indicate manipulation of the clock mechanism, eliminating Dr. Finch."
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
        "Observe the clock's time in relation to the chandelier fall",
        "Draw conclusion about Beatrice's guilt"
      ],
      "test_type": "comparison"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Proving he had no access to the clock during the tampering.",
        "supporting_clues": [
          "gears found near the clock",
          "his alibi during the clock's tampering"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Witness statements confirming his location away from the clock.",
        "supporting_clues": [
          "Captain Hale's alibi",
          "clock tampering timeline"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of Beatrice's tampering."
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
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_10",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Physical evidence"
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
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_8",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_9",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a talented author whose charming exterior masks a turbulent emotional life, particularly regarding her unrequited feelings for Captain Hale.",
    "publicPersona": "Eleanor is well-regarded in literary circles, known for her romantic dramas that resonate with readers. She possesses a warm smile and a quick wit, often engaging those around her with lively conversation about her latest works. Her public persona is one of confidence and insight, a woman who seems to have it all figured out, yet beneath this facade lies a heart that yearns for something more.",
    "privateSecret": "Eleanor harbors a deep-seated unrequited love for Captain Hale. She believes he is romantically involved with Beatrice Quill, a thought that not only stings but also threatens her emotional stability and creative inspiration.",
    "motiveSeed": "Her fear of losing both her muse and her emotional grounding if Hale pursues a relationship with Beatrice drives her to investigate the murder, as she believes it may help her reclaim her own narrative.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was in the library, engaged in writing from 8 PM until the body was discovered at 9:30 PM, a solitary endeavor that could either serve as a perfect alibi or a cover for her true intentions.",
    "accessPlausibility": "possible",
    "stakes": "The stakes are high for Eleanor; not only is her professional reputation on the line, but so is her emotional well-being. The outcome of the investigation could very well dictate her future, creatively and personally.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a rhythmic cadence, often punctuating her sentences with clever observations. She has a tendency to use literary references in conversation, which endears her to her peers but may perplex those less acquainted with her work.",
    "internalConflict": "Eleanor grapples with feelings of inadequacy and jealousy, fearing that her emotional turmoil could compromise her ability to write. The thought of Hale's affections for another woman creates a storm of conflict within her, as she questions her worthiness of love.",
    "personalStakeInCase": "This crime matters deeply to Eleanor because it intertwines with her personal life and her creative process. The investigation could either restore her emotional equilibrium or further plunge her into despair, affecting her writing and self-identity.",
    "paragraphs": [
      "Eleanor Voss sat in the corner of the library, the faint smell of old books mingling with the scent of ink and paper. Her fingers danced over the typewriter keys, each tap a small rebellion against the chaos brewing outside. The world beyond the library door was one of intrigue and danger, but for Eleanor, it was also one of unfulfilled love. She often found herself lost in her own stories, crafting romantic tales that were far more satisfying than her reality, yet the ache in her heart reminded her that fiction could never replace the truth of her feelings for Captain Hale.",
      "As she wrote, Eleanor’s mind wandered to Hale's charming smile and the way his laughter seemed to echo in her dreams. Yet, the thought of him with Beatrice Quill, that beautiful socialite whose very presence could illuminate a room, filled her with a bitterness she struggled to suppress. She had always believed that love was a battle worth fighting for, but the prospect of losing Hale to Beatrice felt like a defeat she was unprepared to endure. It was this fear that propelled her into the role of amateur sleuth; solving the mystery would not only distract her but might also keep Hale close, if only for a moment longer.",
      "Eleanor’s investigation revealed a web of secrets that intertwined the lives of those in Little Middleton, and she was determined to uncover the truth. With each revelation, she felt a flicker of empowerment igniting within her. Perhaps this was her chance to reclaim her narrative, to step out of the shadows of unrequited love and into the light of her own strength. Yet, the deeper she delved, the more she realized that her emotions were intricately tied to the outcome of the case. The thought of Hale's potential involvement in the affair weighed heavily on her and threatened to unravel her sense of self.",
      "In the end, Eleanor stood at a crossroads, her heart torn between the man she loved and the woman she had become through her investigation. The stakes were no longer just about the murder; they were about her own identity and the truth she had been avoiding. As the clock ticked ominously, she knew that the resolution of this case would not only determine the fate of those involved but also the course of her own life. She would either emerge stronger, ready to face her feelings for Hale, or be left shattered, a mere character in her own story."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a pragmatic physician whose disillusionment with love and life colors his cynical outlook, especially regarding his past with Beatrice.",
    "publicPersona": "Known for his sharp wit and biting commentary on societal norms, Dr. Finch is a respected physician whose no-nonsense approach has earned him both admiration and disdain. He often uses humor as a shield, deflecting deeper inquiries into his personal life with a sardonic remark or a dismissive wave. His pragmatic nature often puts him at odds with the more romantic notions held by those around him.",
    "privateSecret": "Beneath his cynical exterior lies a tumultuous past affair with Beatrice Quill, one that he regrets but cannot seem to fully escape. His unresolved feelings for her complicate his interactions, leading to a mix of longing and resentment.",
    "motiveSeed": "Dr. Finch resents the victim for rekindling Beatrice's affections, which he had hoped to win back, igniting a fierce desire for revenge that he struggles to suppress.",
    "motiveStrength": "strong",
    "alibiWindow": "He was in the kitchen consulting with the staff about a potential food poisoning case from 7:30 PM until 9 PM, a plausible alibi that provides him with an easy escape from suspicion.",
    "accessPlausibility": "easy",
    "stakes": "For Dr. Finch, the stakes are his professional integrity and the unresolved feelings that linger from his affair with Beatrice. The murder investigation forces him to confront his past, while also threatening to expose his vulnerabilities.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.6,
    "speechMannerisms": "Dr. Finch speaks with a clipped, precise manner, often punctuating his observations with dry humor. He has a habit of raising an eyebrow at the absurdities of life, and his sarcasm often surfaces in unexpected moments, revealing his hidden depths.",
    "internalConflict": "Dr. Finch is torn between his resentment towards the victim and his lingering affection for Beatrice. He grapples with feelings of inadequacy and the fear of being vulnerable again, struggling to reconcile his cynicism with the desire for genuine connection.",
    "personalStakeInCase": "The crime matters personally to Dr. Finch because it forces him to confront his past with Beatrice and the unresolved feelings that threaten to consume him. The outcome could either lead to closure or deepen his disillusionment with love.",
    "paragraphs": [
      "Dr. Mallory Finch stood in the kitchen, the clatter of pots and pans around him serving as an unwelcome distraction from his thoughts. He had always found solace in the precision of medicine, yet tonight, he could not shake the memories of Beatrice Quill that haunted him like a lingering illness. Their affair had been a whirlwind of passion, yet it had left him feeling more jaded than ever. As he consulted with the staff about a potential food poisoning case, his mind wandered to the woman he had once adored, now engaged to another and the object of his disdain.",
      "His sharp wit often served as a barrier against the world, allowing him to deflect inquiries into his personal life with a sardonic remark. Yet, as he navigated the chaos of the evening, he felt the weight of unfulfilled desires pressing down on his shoulders. The murder of the socialite had rekindled old feelings, and Dr. Finch found himself questioning whether he had ever truly moved on from Beatrice. The thought of her with the victim filled him with a bitterness that was difficult to contain, sparking a resentment that he had hoped to bury.",
      "As he pondered the implications of the murder, Dr. Finch realized that his cynicism was both a shield and a prison. He resented the victim for stealing Beatrice's affections, yet he also recognized that his own choices had led them both to this point. The investigation forced him to confront the ghosts of his past, and he found himself torn between the desire for revenge and the hope for redemption. Could he truly let go of the past, or would it continue to haunt him like an unhealed wound?",
      "Ultimately, Dr. Finch stood at a precipice, forced to make a choice between embracing his feelings for Beatrice or allowing his bitterness to consume him. The stakes were high, and as the investigation unfolded, he felt the tightening grip of fate drawing him closer to a reckoning. The resolution of this case could either lead him to a new understanding of love and commitment or leave him trapped in a cycle of cynicism and regret. In the heart of Little Middleton, he was about to discover whether he was ready to face the truth or remain a prisoner of his own making."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a charismatic military officer whose charm conceals a tangled web of romantic entanglements and inner conflict.",
    "publicPersona": "With the magnetic presence of a war hero, Captain Hale is admired by many and often regarded as a charming rogue. He navigates social circles with ease, his laughter infectious and his smile disarming. However, this charm masks a deeper conflict, as he is often perceived as a womanizer, a label he both embraces and resents.",
    "privateSecret": "Ivor is secretly conflicted between his feelings for Eleanor and his attraction to Beatrice. This internal struggle complicates his interactions with both women, leaving him feeling trapped between desire and loyalty.",
    "motiveSeed": "The potential benefit of the victim's death as a means to clear the path for his romantic pursuits adds an unsettling layer to his character, as he grapples with the morality of such thoughts.",
    "motiveStrength": "compelling",
    "alibiWindow": "He claimed to be out walking in the gardens but was seen near the scene at 9 PM, a detail that casts suspicion on his whereabouts during the crucial moments.",
    "accessPlausibility": "possible",
    "stakes": "Ivor's reputation hangs in the balance, as does his potential for romantic entanglements. The investigation could either cement his status as a charming rogue or expose him as a man caught in a web of deceit.",
    "humourStyle": "sardonic",
    "humourLevel": 0.7,
    "speechMannerisms": "Ivor speaks with a confident, almost theatrical flair, often punctuating his statements with a roguish grin. His dialogue is peppered with playful banter, and he has a tendency to raise an eyebrow at the absurdities of life, adding a layer of charm to his wit.",
    "internalConflict": "Ivor is torn between his feelings for Eleanor and his attraction to Beatrice, leading to a moral quandary that tests his loyalties. He fears that his actions may have consequences beyond his control, threatening the relationships he values most.",
    "personalStakeInCase": "This crime matters to Ivor because it could either clear the path for his desires or lead to the unraveling of his carefully constructed life. The investigation forces him to confront the consequences of his choices and the impact of his actions on those he cares about.",
    "paragraphs": [
      "Captain Ivor Hale strolled through the gardens, the moonlight casting shadows that danced around him. With a roguish grin and a twinkle in his eye, he had always been the life of the party, the charming soldier whose stories of valor captivated audiences. Yet beneath this charismatic facade lay a man wrestling with conflicting desires. His thoughts drifted between Eleanor and Beatrice, the two women who had come to represent the duality of his heart—one a beacon of stability, the other a tempest of passion.",
      "The evening's events had not unfolded as he had anticipated. The murder of the victim had thrown a wrench into his plans, and as whispers of suspicion began to circulate, Ivor felt the tightening grip of fate. The thought that the victim's death could potentially clear the path for his romantic pursuits was a dark realization, one that filled him with dread. He had always prided himself on his charm and ability to navigate the complexities of love, but now he found himself caught in a web of deceit that threatened to ensnare him.",
      "As he moved through the gathering, Ivor's sardonic wit served as both a shield and a weapon. He engaged in playful banter with the guests, but the weight of his internal conflict was never far from the surface. He was acutely aware of the eyes upon him, scrutinizing his every move, and he felt the pressure intensifying as the investigation unfolded. His alibi, flimsy at best, hung over him like a guillotine, ready to drop at the slightest misstep.",
      "Ultimately, Ivor stood at a crossroads, the stakes higher than ever. He could either embrace the chaos of his emotions and risk losing everything or retreat into the safety of his charm, a facade that was beginning to crack. The investigation would force him to confront the consequences of his actions, and as the clock ticked ominously, he realized that the resolution of this case would shape not only his reputation but the very fabric of his life. In the heart of Little Middleton, Ivor Hale was about to discover whether he was a man of honor or just another charming rogue in a world filled with secrets."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is an enigmatic socialite whose charm and allure mask a deep yearning for freedom from societal constraints and her engagement.",
    "publicPersona": "As a fashionable host and the center of attention at social gatherings, Beatrice is known for her beauty and quick wit. She navigates the complexities of high society with grace, yet her public persona is a carefully constructed facade that hides her inner turmoil.",
    "privateSecret": "Feeling trapped in her engagement, Beatrice has been having a secret affair with Captain Hale, a relationship that adds to her sense of entrapment and fear of exposure.",
    "motiveSeed": "Her desire for freedom from her engagement and the fear of being exposed for her affair with Hale drive her actions, creating a potent mix of desperation and determination.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claimed to be in her room getting ready for dinner from 8 PM until shortly before the discovery, a detail that raises questions about her whereabouts during the critical moments.",
    "accessPlausibility": "unlikely",
    "stakes": "The stakes for Beatrice are her social standing and the potential fallout from her relationships. The investigation threatens to expose her secrets, putting everything she values at risk.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.4,
    "speechMannerisms": "Beatrice speaks with a refined elegance, her words flowing smoothly with a hint of playful sarcasm. She has a knack for turning a compliment into a subtle jab, revealing her sharp wit while maintaining a veneer of charm.",
    "internalConflict": "Beatrice is torn between her desire for independence and the societal expectations that bind her. She struggles with the fear of losing her social standing and the potential repercussions of her affair, creating a tension that simmers beneath her polished exterior.",
    "personalStakeInCase": "This crime matters personally to Beatrice because it could lead to the exposure of her affair and the unraveling of her carefully curated life. The outcome of the investigation could either grant her freedom or trap her in a gilded cage.",
    "paragraphs": [
      "Beatrice Quill floated through the gathering like a butterfly, her laughter ringing like chimes in the summer air. With her elegance and charm, she captivated the room, yet beneath the surface lay a tempest of emotions. Society had placed her on a pedestal, but the weight of expectations felt like chains, binding her to a life she no longer desired. Her engagement felt more like a prison than a promise, and the thrill of her secret affair with Captain Hale only heightened her sense of entrapment.",
      "As she navigated the conversations of the evening, Beatrice's polite savagery shone through in her witty repartee. She had mastered the art of charm, turning compliments into veiled critiques, but the laughter felt hollow in her chest. The murder of the victim had thrown her into a whirlwind of fear and uncertainty, as she realized that her carefully constructed life could unravel at any moment. The stakes were high, and the thought of her secrets being exposed sent shivers down her spine.",
      "Beatrice's alibi was shaky at best, and as the investigation took shape, she felt the walls closing in around her. The thought of being discovered for her affair with Hale filled her with dread, and she found herself questioning whether she could maintain her facade amidst the chaos. The desire for freedom clashed with the reality of her situation, creating a tension that simmered just beneath her polished exterior.",
      "Ultimately, Beatrice stood at a crossroads, facing the possibility of liberation or ruin. The investigation threatened to expose not just her affair but the very essence of her identity. In a world that demanded conformity, could she find the courage to break free, or would she remain trapped in a gilded cage? As the clock ticked on, Beatrice Quill was about to discover whether she would emerge as a woman of strength or succumb to the societal pressures that sought to define her."
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
    "summary": "Nestled deep within the English countryside, Little Middleton Manor stands as an imposing testament to a bygone era, where elegance meets enigma beneath its grand ceilings.",
    "visualDescription": "The main house, with its ivy-clad stone exterior, rises majestically amidst sprawling gardens, while ornate woodwork and leaded glass windows hint at both luxury and secrets held within.",
    "atmosphere": "A palpable tension hangs in the air, as the manor's opulence contrasts sharply with the unease of its inhabitants.",
    "paragraphs": [
      "Little Middleton Manor is a sprawling estate surrounded by dense thickets and manicured gardens, where the scent of damp earth mingles with the fading autumn leaves. The imposing structure looms against the overcast sky, its grey stone façade softened by the creeping ivy that clings to its walls. Inside, the high ceilings and intricately carved wooden beams create an atmosphere of grandeur, yet the flickering shadows cast by gas lamps seem to whisper secrets of past intrigues. The air is thick with a sense of foreboding, as if the very walls are poised to reveal hidden truths.",
      "As guests gather in the drawing room, the tension is palpable. The sound of distant thunder rumbles outside, blending with the low murmur of anxious conversation. A radio crackles in the corner, broadcasting news of political unrest across Europe, heightening the sense of unease among the guests. Each creak of the floorboards seems to echo with suspicion, while the rich aroma of woodsmoke from the fireplace mixes with the faint scent of polished furniture, creating an oddly comforting yet unsettling atmosphere. The manor, with its hidden nooks and crannies, is a labyrinth of possibilities—where every glance and whisper may conceal a deeper narrative.",
      "As the evening descends, the manor transforms. Candlelight dances across the drawing room, casting long shadows that stretch across the ornate carpets. The muted sounds of clinking glasses and soft laughter are interspersed with the occasional crackle of the fire, but beneath the surface, a current of tension ripples through the air. Guests exchange furtive glances, their conversations laced with veiled implications. Outside, rain begins to fall, tapping rhythmically against the leaded glass windows, a steady reminder of the storm brewing both outside and within the hearts of those gathered. Little Middleton Manor is both a refuge and a trap, its walls steeped in the weight of unspoken truths.",
      "As midnight approaches, the manor stands shrouded in darkness, save for the flickering gaslights that illuminate the path through the gardens. The air is thick with moisture, and the scent of wet earth mingles with the lingering traces of tobacco smoke from earlier conversations. The sound of rain intensifies, creating a symphony of nature that drowns out the whispers of the guests, each one grappling with their own suspicions and fears. The isolation of the estate, miles from the nearest town, adds to the sense of entrapment, as the guests realize that they are not just participants in a gathering, but players in a mystery that is unfolding around them."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with occasional rain, typical for a late autumn day.",
    "timeFlow": "Three days of mounting tension, as secrets unravel with each passing hour.",
    "mood": "Tense and foreboding, with an underlying sense of unease among the guests.",
    "eraMarkers": [
      "Domestic telephones with party-line systems connecting guests and staff.",
      "Typewriters clattering in the study, composing letters and telegrams.",
      "A radio broadcasting news of political turmoil and jazz music in the drawing room."
    ],
    "sensoryPalette": {
      "dominant": "The damp, earthy scent of autumn leaves and rain-soaked soil.",
      "secondary": [
        "The rich aroma of woodsmoke from the fireplace.",
        "The faint metallic tang of old coins and secrets."
      ]
    },
    "paragraphs": [
      "The atmosphere is thick with the scent of damp earth, as rain pelts the manor's stone walls, creating a symphony of sound that echoes through the corridors. Shadows dance in the flickering light of gas lamps, and the air is charged with a sense of anticipation, as if the manor itself holds its breath, waiting for the next move in a game of intrigue. Outside, the sprawling gardens are shrouded in mist, lending an ethereal quality to the already mysterious landscape, while the distant rumble of thunder serves as a reminder of the storm brewing both in the skies and within the hearts of the guests.",
      "As night falls, the atmosphere shifts, becoming more intimate yet fraught with tension. The soft glow of candlelight reveals the anxious faces of the guests, their eyes darting toward the windows as the wind howls and rain lashes against the panes. Conversations grow hushed, filled with double meanings and unspoken fears, while the oppressive weight of the manor's history presses down on everyone present. It is a setting ripe for revelation, where every shadow may hold a clue, and every whispered word could be the key to unlocking the mystery that binds them all."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "The library, lined with dark oak shelves filled with leather-bound tomes, features a grand fireplace that dominates one wall, its mantle adorned with family portraits that seem to watch the unfolding drama.",
      "sensoryDetails": {
        "sights": [
          "Rows of dusty books create a labyrinthine effect, their spines faded and titles obscured by time, while the flickering light from the fireplace casts dancing shadows across the room.",
          "A large, ornate globe sits in one corner, its surface marred by age, hinting at distant lands and forgotten adventures, while a plush armchair, worn from years of use, beckons from the hearth."
        ],
        "sounds": [
          "The crackling of the fire provides a comforting backdrop, punctuated by the occasional rustle of pages turning as if the books themselves are whispering secrets.",
          "A distant clock ticks steadily, its sound echoing in the stillness, marking the passage of time as tension mounts in the heavy air."
        ],
        "smells": [
          "The rich scent of old paper and polished wood fills the air, mingling with the faint aroma of tobacco smoke that lingers from a recent visitor.",
          "A hint of dampness pervades, suggesting the presence of hidden corners where secrets may lie, while the faintest trace of lavender from a long-forgotten sachet adds an unexpected touch of nostalgia."
        ],
        "tactile": [
          "The leather of the armchair is cool to the touch, its texture cracked and worn, a testament to the many hours spent in contemplation or conversation.",
          "The smooth surface of the globe is almost icy against the fingertips, contrasting sharply with the warmth radiating from the fire, creating an unsettling juxtaposition."
        ]
      },
      "accessControl": "Access is restricted to family members and select guests after dinner; the library remains locked until the morning, with staff forbidden from entering unaccompanied.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-streaked windows obscure the view of the gardens, while droplets cling to the edges of the windowpanes like tears.",
            "The muted light filters through the clouds, casting a grey pallor over the room, making the library feel even more isolated."
          ],
          "sounds": [
            "The steady drumming of rain on the roof provides a rhythmic backdrop, while the occasional gust of wind rattles the windowpanes.",
            "The soft patter of raindrops against the ground outside creates an almost melancholic atmosphere."
          ],
          "smells": [
            "The damp earth outside seeps into the room, bringing with it an earthy scent that mingles with the musty aroma of old books.",
            "The faint scent of wet stone adds a chill to the air, heightening the sense of unease."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat pewter light floods the room, casting no shadows and creating an eerie stillness that pervades the space.",
            "The shadows of the bookshelves loom large, their depth obscured by the dim light."
          ],
          "sounds": [
            "Silence reigns, broken only by the distant sound of thunder, creating an atmosphere thick with anticipation.",
            "The creak of the old wooden floorboards adds to the sense of history that envelops the room."
          ],
          "smells": [
            "The scent of beeswax from the polished surfaces hangs heavy in the air, mixing with the dry, dusty aroma of the books.",
            "Faint traces of mildew linger, suggesting that the library has not been visited for some time."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers in the corners, illuminating the spines of books and casting long shadows that stretch across the floor.",
            "The glow from the fireplace dances across the room, creating a warm yet deceptive ambiance."
          ],
          "sounds": [
            "The tick of the mantel clock provides a steady rhythm, punctuating the silence with its metronomic insistence.",
            "In the distance, the soft sound of laughter from the drawing room reaches the library, a reminder of the gathering just beyond."
          ],
          "smells": [
            "The warm scent of candle wax mingles with the rich aroma of tobacco smoke, creating a cozy yet charged atmosphere.",
            "The lingering smell of cold fireplace ash adds a hint of finality to the evening."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, with its towering shelves and dim lighting, serves as a perfect backdrop for secrets to unfold. The air within is thick with the weight of history, each book a repository of untold stories, while the flickering flames cast dancing shadows that seem to whisper to one another. It is here that the discovery of a single, misplaced tome leads to a cascade of revelations, each more shocking than the last, as the guests grapple with their own motives and fears.",
        "As the rain lashes against the windows, the library becomes a sanctuary of sorts, yet it is also a prison of sorts, isolating those within from the outside world. The oppressive atmosphere is palpable; each creak of the floorboards and rustle of paper amplifies the tension, as if the very structure of the manor holds its breath, waiting for the truth to emerge from the depths of its hidden corners."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "The drawing room is adorned with heavy drapes and plush furnishings, offering a striking contrast to the coldness outside, while a grand piano sits silently in one corner, its keys untouched.",
      "sensoryDetails": {
        "sights": [
          "Richly patterned wallpaper envelops the room, creating an atmosphere of warmth and intimacy, while the large bay windows frame views of the gardens beyond, now shrouded in mist.",
          "A crystal chandelier hangs from the ceiling, its prisms catching the light from the gas lamps and casting colorful reflections on the walls."
        ],
        "sounds": [
          "The soft sound of laughter and clinking glasses fills the air, blending with the occasional crackle of the fireplace as logs shift and pop.",
          "The distant hum of a radio broadcasts a popular jazz tune, its lively rhythm providing a stark contrast to the tension simmering beneath the surface."
        ],
        "smells": [
          "The fragrant aroma of fresh flowers from a nearby vase mingles with the scent of aged mahogany, creating a heady perfume that envelops the senses.",
          "Hints of tobacco smoke linger in the air, a remnant of earlier conversations that adds a layer of familiarity to the otherwise charged atmosphere."
        ],
        "tactile": [
          "The plush upholstery of the sofas invites guests to sink into their depths, offering comfort yet also a sense of confinement as the evening wears on.",
          "The cool surface of the crystal glasses feels refreshing against the skin, yet the weight of the glasses in hand serves as a reminder of the tension that lingers."
        ]
      },
      "accessControl": "Access is granted to all guests during social hours, but the room is often closed off for private conversations, limiting access during critical moments.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "The heavy drapes are drawn back to reveal a grey, rain-soaked landscape, while droplets cling to the windowpanes, casting a blurred view of the garden.",
            "The muted colors of the room seem to absorb the light, creating a somber atmosphere that contrasts with the usual vibrancy."
          ],
          "sounds": [
            "The steady patter of rain against the roof creates a rhythmic backdrop, while the sound of thunder occasionally rumbles in the distance.",
            "The crackle of the fire provides a comforting contrast to the outside storm, but it is overshadowed by an undercurrent of tension."
          ],
          "smells": [
            "The scent of wet earth and rain mingles with the floral notes from the vase, creating an oddly refreshing yet melancholic aroma.",
            "The faint whiff of damp wool from the heavy drapes adds to the sense of constriction within the room."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is bathed in a flat, grey light that drains the color from the furnishings, amplifying the sense of unease among the guests.",
            "Shadows stretch across the floor, creating an unsettling atmosphere where every corner seems to hide a secret."
          ],
          "sounds": [
            "The silence is occasionally broken by the sound of a clock ticking, a reminder of the time slipping away as tensions rise.",
            "Soft whispers and nervous laughter fill the room, but there is an undercurrent of anxiety that permeates the air."
          ],
          "smells": [
            "The scent of dust hangs in the air, a reminder of the long hours spent in this room, while the aroma of polished furniture adds an unsettling familiarity.",
            "A hint of mildew lurks, suggesting that the room has not been properly aired out for some time."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers in the corners of the room, casting playful shadows that dance across the walls and furniture.",
            "The warm glow of the fireplace creates a cozy atmosphere, yet the tension among the guests is palpable."
          ],
          "sounds": [
            "The soft strains of jazz from the radio fill the space, providing a lively backdrop that contrasts sharply with the underlying tension.",
            "The laughter of guests rises and falls, but there are moments of silence that amplify the suspense."
          ],
          "smells": [
            "The rich aroma of freshly brewed coffee mingles with the scent of tobacco smoke, creating an inviting yet charged atmosphere.",
            "The lingering scent of woodsmoke from the fireplace adds to the warmth of the room, yet feels ominous against the backdrop of tension."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the heart of social interaction within Little Middleton Manor, where guests gather to share stories and sip drinks. The atmosphere is one of quiet elegance, yet beneath the surface lies a tension that threatens to unravel the carefully woven fabric of civility. The laughter and chatter mask the underlying fears, as each guest grapples with their own suspicions and motivations, the drawing room becoming a stage for the unfolding drama.",
        "As the evening progresses, the drawing room transforms into a space thick with unspoken words and veiled glances. The flickering candlelight casts a warm glow, but the shadows that dance across the walls seem to echo the secrets that linger just beneath the surface. Each creak of the floorboards and soft murmur of conversation is imbued with the weight of anticipation, as the guests await the next revelation that will shatter their fragile façade of normalcy."
      ]
    },
    {
      "id": "the_study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Clue discovery",
      "visualDetails": "The study is a small, intimate room, filled with dark wood furniture and heavy drapes, creating an atmosphere of secrecy and contemplation.",
      "sensoryDetails": {
        "sights": [
          "Books line the walls, their spines cracked and faded, while a large desk sits at the center, cluttered with papers and a vintage typewriter that hints at the secrets held within.",
          "A single window overlooks the gardens, its glass slightly fogged, giving the outside world an ethereal quality, as if filtered through the haze of thought."
        ],
        "sounds": [
          "The soft rustle of paper fills the air, interrupted only by the occasional clack of the typewriter keys, as if someone is working tirelessly to uncover the truth.",
          "The distant ticking of a clock adds a rhythmic element to the room, each tick echoing the urgency of the investigation."
        ],
        "smells": [
          "The scent of old books mingles with the sharp aroma of ink, creating a heady mixture that stimulates the mind and ignites curiosity.",
          "Hints of leather from the armchair add a tactile richness to the space, while the faint whiff of tobacco lingers, suggesting recent contemplation."
        ],
        "tactile": [
          "The polished surface of the desk feels cool beneath the fingertips, while the texture of the aged leather-bound books offers a contrast that invites exploration.",
          "The weight of the typewriter is substantial, its keys responsive and satisfying, making the act of typing feel like a deliberate engagement with the unfolding mystery."
        ]
      },
      "accessControl": "Access is limited to family members and close friends; the study is often locked when not in use, creating an air of exclusivity around its contents.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Raindrops trickle down the window, distorting the view of the gardens, while the dim light creates an intimate atmosphere within the study.",
            "The shadows cast by the heavy drapes give the room an air of secrecy, as if it holds its own hidden narratives."
          ],
          "sounds": [
            "The sound of rain pattering against the roof provides a gentle, rhythmic backdrop, while the occasional creak of the house adds to the sense of isolation.",
            "The soft clattering of a typewriter is almost drowned out by the sound of the storm outside."
          ],
          "smells": [
            "The scent of wet earth outside seeps through the window, mingling with the musty aroma of old books, creating a heady atmosphere of introspection.",
            "A faint hint of mildew lingers, suggesting that the room has been closed off for some time."
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "The room is dimly lit by the overcast sky, shadows pooling in the corners, creating an atmosphere thick with anticipation.",
            "The heavy drapes block most of the light, giving the space a somber, contemplative quality."
          ],
          "sounds": [
            "The ticking of the clock seems louder in the silence, a reminder of the urgency that hangs in the air, while the occasional rustle of paper adds to the tension.",
            "The soft murmur of distant voices echoes from the drawing room, a reminder of the gathering just beyond reach."
          ],
          "smells": [
            "The scent of dust mingles with the aroma of polished wood, creating a nostalgic yet unsettling atmosphere.",
            "A hint of tobacco smoke lingers, a reminder of the thoughts that have been pondered within these walls."
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickers on the desk, casting a warm glow that contrasts with the coolness of the evening air.",
            "The shadows elongate and shift, creating an ever-changing landscape of light and dark."
          ],
          "sounds": [
            "The quiet scratching of a pen or the clacking of typewriter keys fills the air, each sound amplified in the stillness of the evening.",
            "The distant laughter from the drawing room serves as a reminder of the life outside this sanctuary."
          ],
          "smells": [
            "The rich scent of freshly brewed coffee mingles with the aroma of polished wood, creating an inviting yet charged atmosphere.",
            "The lingering smell of tobacco from earlier contemplation adds a sense of familiarity, yet feels heavy with unspoken truths."
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The study, with its intimate setting, serves as a crucial space for unraveling the threads of the mystery. The air is thick with the scent of old books and ink, creating an atmosphere that invites contemplation and discovery. Here, the protagonist finds a crucial piece of evidence hidden among the papers, setting off a chain of events that brings the unfolding intrigue to a head.",
        "As the evening deepens, the study becomes a refuge for those seeking solitude amidst the chaos. The ticking clock echoes the urgency of the investigation, while the shadows play tricks on the mind, hinting at secrets lurking just out of sight. This is a space where the boundaries between the known and unknown blur, and every detail may hold the key to unraveling the conspiracy."
      ]
    }
  ],
  "note": "",
  "cost": 0.0028189491,
  "durationMs": 38319
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1938,
    "month": "April",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "spring",
    "month": "April",
    "weather": [
      "overcast skies",
      "occasional rain showers",
      "cool temperatures around 50°F"
    ],
    "daylight": "Days lengthen as spring settles in, with the sun rising around 5:45 AM and setting near 7:45 PM, though clouds often obscure the light.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, as guests gather for after-dinner conversation.",
    "holidays": [
      "Easter (April 10, 1938)"
    ],
    "seasonalActivities": [
      "spring gardening and planting",
      "attending local fairs or markets",
      "taking leisurely walks in the countryside"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tweed suit with a vest",
        "tailored dress shirt with a stiff collar",
        "silk tie with geometric patterns"
      ],
      "casual": [
        "lightweight cotton trousers",
        "short-sleeved polo shirts",
        "bomber jackets for outdoor wear"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a cinched waist",
        "delicate floral print blouse",
        "tailored blazer with shoulder pads"
      ],
      "casual": [
        "swing skirts paired with blouses",
        "knitted cardigans",
        "lightweight cotton dresses"
      ],
      "accessories": [
        "straw cloche hat",
        "beaded handbag",
        "pearls or simple gold jewelry"
      ]
    },
    "trendsOfTheMoment": [
      "influence of Hollywood glamour",
      "adoption of Art Deco styles",
      "mismatched patterns in casual wear"
    ],
    "socialExpectations": [
      "adherence to strict etiquette during social gatherings",
      "expectation for women to maintain a demure appearance",
      "men's roles as providers and protectors"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "Political tensions rise in Europe with the Munich Agreement looming on the horizon",
      "U.S. economy shows signs of recovery from the Great Depression",
      "Nazi Germany continues its territorial expansion"
    ],
    "politicalClimate": "Tense atmosphere with impending fears of war, as fascist regimes gain power and threaten neighboring nations.",
    "economicConditions": "Gradual recovery noted in urban areas, though rural communities still struggle under economic strain.",
    "socialIssues": [
      "class divisions exacerbated by the Depression",
      "labor strikes for better working conditions",
      "increased awareness of women's suffrage movements"
    ],
    "internationalNews": [
      "the annexation of Austria by Germany",
      "continued conflicts in Spain with the Civil War ongoing",
      "rising anti-Semitic sentiments across Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Benny Goodman - 'Sing, Sing, Sing'",
        "Glenn Miller - 'In the Mood'",
        "Duke Ellington - 'Mood Indigo'"
      ],
      "films": [
        "The Adventures of Robin Hood",
        "Bringing Up Baby",
        "The Lady Vanishes"
      ],
      "theater": [
        "The Boys from Syracuse",
        "I Remember Mama",
        "The Male Animal"
      ],
      "radio": [
        "The Shadow",
        "Amos 'n' Andy",
        "The Lone Ranger"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Maltese Falcon by Dashiell Hammett",
        "Gone with the Wind by Margaret Mitchell",
        "The Grapes of Wrath by John Steinbeck"
      ],
      "popularGenres": [
        "mystery and detective fiction",
        "social realism",
        "historical romance"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first electronic computer prototypes",
        "advancements in aviation technology",
        "development of synthetic materials like nylon"
      ],
      "commonDevices": [
        "domestic telephones with party-line systems",
        "typewriters for correspondence",
        "early radio sets for entertainment"
      ],
      "emergingTrends": [
        "increased popularity of household appliances",
        "growth of the film industry and its impact on fashion",
        "spread of automobile ownership in urban areas"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Pound of butter: one shilling sixpence"
      ],
      "commonActivities": [
        "hosting tea parties",
        "engaging in community events or fairs",
        "playing cards or board games in the evenings"
      ],
      "socialRituals": [
        "formal dinner parties with multiple courses",
        "afternoon teas served with pastries",
        "evening gatherings for music and conversation"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "growing awareness of class disparities",
      "rising resentment towards the wealthy",
      "increasing solidarity among the working class"
    ],
    "gender": [
      "women gaining more social freedoms yet expected to adhere to traditional roles",
      "men retaining dominance in professional spheres",
      "growing acceptance of women's suffrage movements"
    ],
    "race": [
      "racial tensions in urban areas due to migration patterns",
      "general social acceptance of diversity in urban settings",
      "persistent discrimination against minorities in many regions"
    ],
    "generalNorms": [
      "strict adherence to etiquette in formal settings",
      "expectation of modesty in women's fashion",
      "valuing decorum and restraint in public behavior"
    ]
  },
  "atmosphericDetails": [
    "The scent of fresh spring rain mingles with the earthy aroma of damp soil, as flowers begin to bloom in the manor's gardens.",
    "The faint sound of a distant train whistle echoes through the cool air, adding to the sense of isolation that envelops the grand house.",
    "Inside, the soft crackle of vinyl records plays in the background, juxtaposed against the tense silence of the guests, each one acutely aware of the underlying tension."
  ],
  "paragraphs": [
    "In April 1938, the world teetered on the brink of dramatic change, with the scent of spring mingling with the foreboding atmosphere of an impending crisis. As overcast skies loomed overhead, occasional rain showers cast a chill across the countryside, where the sprawling grounds of the manor house served as a backdrop for both beauty and unease. Guests gathered in the dimly lit drawing room, their conversations punctuated by the distant rumble of thunder, hinting at the turbulence that lay beyond the manor's walls. With the recent annexation of Austria by Germany and rising tensions among European nations, the air was thick with apprehension, reflecting the societal anxieties of the time.",
    "Fashion in this era was marked by a blend of formality and practicality, with men donning tailored tweed suits and women adorned in tea-length dresses with cinched waists and delicate floral patterns. The elegance of evening wear was contrasted by the more relaxed styles that emerged in casual settings, where lightweight cotton dresses and bomber jackets became popular. Accessories such as straw cloche hats and silk ties completed their outfits, showcasing the influence of Hollywood glamour and Art Deco styles. Guests at the manor were well aware of these trends, using their attire as silent markers of status and taste.",
    "Daily life, shaped by the lingering effects of the Great Depression, was characterized by both struggle and resilience. Formal dinner parties were common, where multiple courses and fine china set the stage for social interaction, while afternoon teas offered a chance for gossip and camaraderie. The typical price of a loaf of bread at four pence or a movie ticket for one shilling reflected the economic climate, where entertainment served as an escape from the harsh realities outside. In this environment, the strict social hierarchies remained intact, but the growing awareness of class disparities stirred discontent among the guests, creating an undercurrent of tension that permeated their interactions."
  ],
  "note": "",
  "cost": 0.0011241384,
  "durationMs": 15202
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a grand country estate for a family reunion is overshadowed by the economic strains of the Great Depression and rising political tensions, forcing guests to confront their hidden agendas amidst strict social hierarchies.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Class divisions are exacerbated by economic hardship, creating a tense atmosphere where social expectations dictate behavior and alliances."
  },
  "setting": {
    "location": "A grand country estate with sprawling gardens and ornate woodwork.",
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
  },
  {
    "id": "chandelier_weight",
    "value": "two hundred pounds",
    "description": "The weight of the chandelier that fell"
  },
  {
    "id": "fall_distance",
    "value": "twelve feet",
    "description": "The distance the chandelier fell before hitting the floor"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "A mechanical clock was tampered with to create an alibi for the murder, causing a chandelier to fall at a precisely timed moment.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This reveals the core mechanism of the murder setup.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "testimonial",
      "description": "This indicates premeditated tampering rather than an accident.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the assumption that the chandelier fell accidentally.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she was seen in the garden at the time of the incident.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This narrows the solution toward the remaining suspects.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The clock in the main hall shows ten minutes past eleven, not eleven.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This indicates a discrepancy in the timeline of events.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Gears were found scattered near the clock.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This suggests that the clock was tampered with.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "testimonial",
      "description": "This suggests that the clock was tampered with to create a false timeline.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "This contradicts the idea that the clock was functioning normally.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_4",
      "category": "behavioral",
      "description": "Beatrice Quill was observed lingering near the clock shortly before the chandelier fell.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This raises suspicion about her involvement.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "Wire marks on the chandelier indicate it was rigged.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "This provides evidence of foul play.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was attending to a patient at the time of the incident.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This narrows the solution toward the remaining suspects.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_7",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was seen at a different location when the chandelier fell.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This narrows the solution toward Beatrice Quill.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_8",
      "category": "temporal",
      "description": "A comparison of the rigged clock with the witness statements about the chandelier fall proves that the times do not match.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[0]",
      "pointsTo": "This highlights the inconsistencies in the timeline.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_9",
      "category": "physical",
      "description": "The chandelier weighs two hundred pounds, indicating a significant force was needed to rig it.",
      "sourceInCML": "CASE.constraint_space.physical.laws[0]",
      "pointsTo": "This suggests careful planning was involved.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_10",
      "category": "temporal",
      "description": "Witnesses claim the chandelier fell at eleven, but the clock was tampered with to show a different time.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[1]",
      "pointsTo": "This indicates a deliberate attempt to mislead.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "rh_1",
      "description": "Eleanor Voss was known to have a fear of heights, making it unlikely she would tamper with the chandelier.",
      "supportsAssumption": "Eleanor was killed by an accidental chandelier fall during the party.",
      "misdirection": "This misleads by suggesting Eleanor's fear would prevent her from being involved.",
      "evidenceType": "observation",
      "sourceInCML": "CASE.inference_path.steps[0].observation"
    },
    {
      "id": "rh_2",
      "description": "Dr. Mallory Finch had a history of accidents in his practice, leading to speculation that he might have caused the chandelier fall.",
      "supportsAssumption": "Eleanor was killed by an accidental chandelier fall during the party.",
      "misdirection": "This misleads by implying Dr. Finch's past could relate to the chandelier incident.",
      "evidenceType": "observation",
      "sourceInCML": "CASE.inference_path.steps[0].observation"
    },
    {
      "id": "clue_culprit_direct_beatrice_quill",
      "category": "temporal",
      "description": "Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This direct evidence shows Beatrice Quill had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock striking ten minutes past eleven remains a late texture detail in the case background.",
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
      "description": "Gears were found scattered near the clock.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "This implies that someone manipulated the clock to confuse witnesses.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [],
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
      "clue_1"
    ],
    "mid": [
      "clue_core_elimination_chain",
      "clue_2",
      "clue_3",
      "clue_4",
      "clue_5",
      "clue_6",
      "clue_7",
      "clue_8",
      "clue_9",
      "clue_10",
      "rh_1",
      "rh_2",
      "clue_culprit_direct_beatrice_quill",
      "clue_fp_contradiction_step_3"
    ],
    "late": [
      "clue_late_optional_slot_1"
    ]
  },
  "fairPlayChecks": {
    "allEssentialCluesPresent": true,
    "noNewFactsIntroduced": false,
    "redHerringsDontBreakLogic": true
  },
  "latencyMs": 12986,
  "cost": 0.0015177953999999999
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

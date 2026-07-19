# Actual Prompt Record

- Run ID: `mystery-1784456621907`
- Project ID: ``
- Timestamp: `2026-07-19T10:26:39.488Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `9259ca2d966a581e`

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
    "title": "Tide's Deception",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1940s",
      "realism_constraints": []
    },
    "setting": {
      "location": "A seaside hotel built in the early 1920s",
      "place": "Brighton",
      "country": "England",
      "institution": "Hotel"
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
      "public_persona": "A sharp and observant detective.",
      "private_secret": "Has a personal connection to Dr. Finch.",
      "motive_seed": "inheritance",
      "motive_strength": "low",
      "alibi_window": "All evening",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel staff",
        "Guest access"
      ],
      "behavioral_tells": [
        "Calm under pressure"
      ],
      "stakes": "Finding justice for her friend.",
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
      "public_persona": "Respected physician with a kind demeanor.",
      "private_secret": "Knew about several guests' secrets.",
      "motive_seed": "inheritance",
      "motive_strength": "none",
      "alibi_window": "Time of death",
      "access_plausibility": "n/a",
      "opportunity_channels": [],
      "behavioral_tells": [],
      "stakes": "None, as the victim.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "innocent",
      "gender": "female"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "50-60",
      "role_archetype": "Suspect",
      "relationships": [
        "Old friend of Dr. Finch"
      ],
      "public_persona": "A retired sea captain with many adventures.",
      "private_secret": "Has gambling debts.",
      "motive_seed": "Financial desperation.",
      "motive_strength": "moderate",
      "alibi_window": "7 to 9 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel access",
        "Common areas"
      ],
      "behavioral_tells": [
        "Nervous when pressed about finances"
      ],
      "stakes": "Avoiding financial ruin.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "20-30",
      "role_archetype": "Suspect",
      "relationships": [
        "Friend of Dr. Finch"
      ],
      "public_persona": "An aspiring actress with big dreams.",
      "private_secret": "In love with someone unexpected.",
      "motive_seed": "Jealousy over a romantic interest.",
      "motive_strength": "moderate",
      "alibi_window": "6 to 8 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel access",
        "Dining room"
      ],
      "behavioral_tells": [
        "Avoids eye contact when lying"
      ],
      "stakes": "Her aspirations and love life.",
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
        "Acquaintance of Dr. Finch"
      ],
      "public_persona": "A local journalist.",
      "private_secret": "Investigating Dr. Finch's past.",
      "motive_seed": "A story that could ruin Dr. Finch.",
      "motive_strength": "high",
      "alibi_window": "7 to 9 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Hotel access",
        "Library"
      ],
      "behavioral_tells": [
        "Evasive when asked about her investigation"
      ],
      "stakes": "Her career and reputation.",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Hugo Vane",
      "age_range": "40-50",
      "role_archetype": "Suspect",
      "relationships": [
        "Old rival of Dr. Finch"
      ],
      "public_persona": "A businessman with shady dealings.",
      "private_secret": "Has a grudge against Dr. Finch.",
      "motive_seed": "Personal vendetta.",
      "motive_strength": "high",
      "alibi_window": "8 to 10 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Hotel access",
        "Private areas"
      ],
      "behavioral_tells": [
        "Displays anger when reminded of the past"
      ],
      "stakes": "Settling a score.",
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
      "summary": "At a seaside hotel in Brighton, Dr. Mallory Finch is found drowned in her room, leading Detective Eleanor Voss to unravel a web of deception involving tidal schedules and hidden motives."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "A hidden valve that opens at high tide, flooding Dr. Finch's room, disguising the murder as an accident.",
      "delivery_path": [
        {
          "step": "High tide opens the valve."
        },
        {
          "step": "Room floods, making it appear as an accidental drowning."
        }
      ]
    },
    "outcome": {
      "result": "The murder is disguised as an unfortunate accident."
    }
  },
  "false_assumption": {
    "statement": "Dr. Finch drowned during a storm surge, as indicated by the high tide.",
    "type": "temporal",
    "why_it_seems_reasonable": "The weather was stormy, and the tide was high at the time she was found.",
    "what_it_hides": "The valve was deliberately opened at the precise moment of high tide."
  },
  "false_solution": {
    "accused_suspect": "Captain Ivor Hale",
    "supporting_points": [
      "Captain Hale was known to have been near the victim's room shortly before the body was found.",
      "He had financial issues that could motivate foul play."
    ],
    "the_one_flaw": "Witnesses confirm Hale was with them in the bar at the time of death.",
    "refuted_in_chapter": 6
  },
  "red_herrings": [
    {
      "id": "red_herring_1",
      "description": "A stormy night that suggests an accidental drowning.",
      "points_at_suspect": "Captain Ivor Hale",
      "innocent_explanation": "The storm occurred after the time of death.",
      "resolved_in_chapter": 5
    },
    {
      "id": "red_herring_2",
      "description": "Beatrice Quill was seen arguing with Dr. Finch earlier.",
      "points_at_suspect": "Beatrice Quill",
      "innocent_explanation": "They were discussing a personal matter unrelated to the murder.",
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
    "rationale": "All suspects were present at the hotel and had potential motives."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "High tide schedule posted in the lobby",
        "Weather report"
      ],
      "windows": [
        "7 PM to 9 PM"
      ],
      "contradictions": [
        "Tide was low when Dr. Finch was last seen."
      ]
    },
    "access": {
      "actors": [
        "Hotel staff",
        "Guests"
      ],
      "objects": [
        "Room key",
        "Tide schedule"
      ],
      "permissions": [
        "Access to Dr. Finch's room"
      ]
    },
    "physical": {
      "laws": [
        "Water flows into lower areas",
        "Tidal patterns affect sea levels"
      ],
      "traces": [
        "Water marks on the wall",
        "Valve traces"
      ]
    },
    "social": {
      "trust_channels": [
        "Guests trust each other",
        "Hotel staff are viewed as reliable"
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
        "observation": "The tide schedule is posted in the lobby, showing high tide at 8 PM.",
        "correction": "This reveals the timing of the high tide and when the flooding could occur.",
        "effect": "Narrows the window of opportunity for the murder to between 7 PM and high tide at 8 PM.",
        "required_evidence": [
          "Tide schedule posted in the lobby",
          "Witness statement about Dr. Finch's last seen time"
        ],
        "reader_observable": true
      },
      {
        "observation": "Water marks on the wall indicate flooding occurred recently.",
        "correction": "This suggests that the flooding happened close to the time she was discovered.",
        "effect": "Eliminates the possibility that Dr. Finch was drowned earlier.",
        "required_evidence": [
          "Water marks on the wall",
          "Witness statement about the storm occurring after the body was found"
        ],
        "reader_observable": true
      },
      {
        "observation": "The hidden valve was found functional yet rusty, indicating recent use.",
        "correction": "This shows that the valve was deliberately opened, aligning with the timing of the high tide.",
        "effect": "Narrows suspicion towards someone with access to the valve mechanism.",
        "required_evidence": [
          "Functional state of the valve",
          "Maintenance records of the plumbing"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "A reenactment of the timeline is staged, showing that only Hugo Vane could have accessed the valve during the critical time window.",
    "knowledge_revealed": "Hugo was seen near the valve area shortly before the tide came in.",
    "pass_condition": "The reenactment shows that no one else could have opened the valve without being seen or heard.",
    "evidence_clues": [
      "clue_culprit_direct_1",
      "clue_3",
      "clue_5",
      "clue_culprit_direct_hugo_vane"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The tide schedule (early) and witness statements (mid) clarify the timing of death. Step 2: Water marks (mid) indicate recent flooding. Step 3: The valve's condition (discriminating test) reveals Hugo Vane's unique access."
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
        "clearance_method": "Witnesses confirm he was in the bar.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Beatrice Quill",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Discussion was personal and non-threatening.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Sylvia Trent",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Her investigation into Dr. Finch's past was unrelated to her death.",
        "supporting_clues": [
          "clue_id_1",
          "clue_id_2"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Alibi confirmed: Time of death",
        "supporting_clues": []
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence showing Hugo Vane's access to the valve."
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
        "delivery_method": "Witness statement"
      },
      {
        "clue_id": "clue_8",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_early_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_mid_1",
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
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
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
        "clue_id": "clue_culprit_direct_hugo_vane",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_late_1",
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
    "summary": "A charismatic traveling journalist turned amateur sleuth, Eleanor Voss is on a quest to uncover family secrets that could lead to her next major story.",
    "publicPersona": "Eleanor captivates audiences with her travel stories, gracefully weaving together tales of adventure and intrigue. Her charm and insight make her a welcome presence at any gathering, as she effortlessly draws people into her narratives.",
    "privateSecret": "Beneath her confident exterior, Eleanor grapples with a debilitating fear of failure, exacerbated by a recent breakup that has left her questioning her worth and abilities.",
    "motiveSeed": "The allure of a sensational story is not just professional for Eleanor; it’s a chance to reclaim her confidence and prove herself to an unforgiving world.",
    "motiveStrength": "moderate",
    "alibiWindow": "Eleanor was present throughout the evening, mingling with guests and collecting snippets of conversation.",
    "accessPlausibility": "easy",
    "stakes": "Her career hangs in the balance—discovering a major story could be the breakthrough she desperately needs.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a rhythmic cadence, often punctuating her observations with a raised eyebrow or a knowing smile. She has a tendency to ask rhetorical questions, inviting others to think critically.",
    "signatureTic": "‘Isn’t it curious?’ — a phrase she often uses to draw attention to the oddities of life.",
    "internalConflict": "Eleanor is torn between her ambition and her crippling fear of failure, which shadows her every move as she seeks validation in her work.",
    "personalStakeInCase": "This crime represents a pivotal moment for Eleanor; it's not just about uncovering the truth but also about confronting her own insecurities and reclaiming her narrative.",
    "paragraphs": [
      "Eleanor Voss was not just a journalist; she was a storyteller, a weaver of truths hidden beneath layers of deception. Her travels had taken her to far-flung corners of the globe, but now she found herself at a seaside hotel, the waves crashing against the shore mirroring the tumult within her. With each guest she spoke to, her mind was a whirlpool of potential stories, but lurking beneath her charismatic exterior was a fear that threatened to engulf her. The recent breakup had left scars that made her question her every instinct.",
      "As she mingled with the guests, her mind raced through the possibilities that lay before her. Family secrets could be the key to a sensational story—something to elevate her career from the mundane. Yet, with each conversation, she felt the weight of her own insecurities, the nagging voice reminding her of past failures. ‘Isn’t it curious?’ she would muse aloud, but deep down, she was terrified of what was truly lurking beneath the surface of this gathering.",
      "Her instincts as a sleuth began to sharpen, and she found herself drawn to the darker corners of the hotel. With each revelation, the stakes became clearer. Uncovering the truth could not only advance her career but also serve as a personal redemption. Eleanor was determined to confront her fears head-on, even if it meant digging up secrets that could shatter the lives of those around her. The thrill of the chase was intoxicating, but so was the fear of what she might find.",
      "In the end, Eleanor knew this was more than just a crime story; it was a journey into her own psyche. The tide of deception was rising, and she would either learn to navigate its treacherous waters or be swept away by the very thing she sought to uncover. The choice was hers, and for the first time in a long while, she felt the stirrings of hope—hope that perhaps she could emerge from this with not just a story, but an understanding of herself."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "A respected psychiatrist caught in a web of deceit, Dr. Mallory Finch must navigate her conflicting loyalties amidst a scandalous affair.",
    "publicPersona": "Dr. Finch is known for her composed demeanor and insightful therapy practices, earning her the respect of peers and patients alike. Her presence is calming, often bringing clarity to chaotic minds.",
    "privateSecret": "Behind her professional facade lies a troubling secret—an affair with the victim’s spouse that complicates her feelings and threatens her career.",
    "motiveSeed": "Should the victim’s will be contested, Mallory stands to inherit a valuable estate, making her motives appear questionable.",
    "motiveStrength": "strong",
    "alibiWindow": "Mallory claims she was in her office during the murder, a statement that hangs precariously on the edge of truth.",
    "accessPlausibility": "possible",
    "stakes": "The risk to her career and reputation looms large; she must decide whether to come clean about her affair or protect herself at all costs.",
    "humourStyle": "none",
    "humourLevel": 0,
    "speechMannerisms": "Dr. Finch speaks in a measured, soothing tone, often using therapeutic jargon that reflects her profession. She tends to pause thoughtfully before responding, weighing her words carefully.",
    "signatureTic": "‘Let’s unpack that’ — a phrase she often uses to encourage deeper exploration of thoughts and feelings.",
    "internalConflict": "Mallory is torn between her desire to protect herself and the guilt that gnaws at her conscience, knowing she is complicit in a web of lies.",
    "personalStakeInCase": "This case holds personal significance for Mallory as it challenges her ethical boundaries and forces her to confront the consequences of her choices.",
    "paragraphs": [
      "Dr. Mallory Finch stood at the precipice of her own unraveling. A respected psychiatrist, she had spent years helping others navigate their mental labyrinths, yet here she was, ensnared in a tangle of her own making. The affair with the victim’s spouse had begun innocently enough, but as the stakes grew higher, so did the weight of her secret. Each patient she treated felt like a reminder of the betrayal she had committed, a betrayal that now threatened to consume her.",
      "As she moved through the hotel, her mind raced with the possibilities of what could happen if the truth emerged. The victim's death had thrown her life into chaos, and the prospect of inheriting a valuable estate felt like a cruel joke. Mallory’s professional life had been built on trust and integrity, yet now those very principles were at risk of crumbling beneath her feet. The internal conflict raged within her, a battle between self-preservation and moral responsibility.",
      "In the aftermath of the murder, Mallory found herself drawn into a web of suspicion. Her alibi, while seemingly solid, felt like a fragile shield against the mounting scrutiny. She could feel the eyes of the other guests upon her, each glance a reminder of the precarious position she occupied. Would she be able to maintain her composure, or would the truth force its way to the surface, dragging her under?",
      "As the investigation unfolded, Mallory realized she was at a crossroads. The choices she made in the coming days would define not only her future but also her understanding of herself. Would she continue to hide in the shadows, or would she step into the light and confront the ramifications of her actions? The tide of deception was rising, and she could either sink or swim; the outcome depended on the decisions she would soon have to make."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "A retired Navy captain with a gruff exterior, Ivor Hale's resentment towards the victim runs deep, as he grapples with his place in the family legacy.",
    "publicPersona": "Ivor is known for his authoritative presence and often shares tales from his naval days, captivating listeners with his gruff charm.",
    "privateSecret": "Beneath the surface, Ivor harbors deep resentment towards the victim for being cut out of the family fortune, fueling his ambition to reclaim his rightful place.",
    "motiveSeed": "His desire to regain respect and financial stability drives him to consider drastic measures against the victim.",
    "motiveStrength": "compelling",
    "alibiWindow": "Ivor was seen arguing with the victim earlier that day, casting a shadow of doubt over his innocence.",
    "accessPlausibility": "easy",
    "stakes": "Desperate to secure his place in the family legacy, Ivor's actions could have devastating consequences.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.3,
    "speechMannerisms": "Ivor speaks in a booming voice, often punctuated by hearty laughter. He has a tendency to embellish his stories, using nautical jargon that reflects his past.",
    "signatureTic": "‘In my day…’ — a phrase he uses to segue into tales of his naval exploits.",
    "internalConflict": "Ivor grapples with his resentment towards the victim while longing for familial acceptance, torn between his pride and the desire to reconcile.",
    "personalStakeInCase": "This case is deeply personal for Ivor; it’s not just about the murder but also about reclaiming his legacy and confronting his past grievances.",
    "paragraphs": [
      "Captain Ivor Hale was a man of the sea, but now he found himself adrift in a storm of family betrayal. The retired Navy captain had always been the authoritative figure, the one who commanded respect with his booming voice and stories of valor. Yet, beneath that gruff exterior lay a simmering resentment towards the victim, a resentment that had festered over years of being cut out of the family fortune. The argument they had earlier that day was merely a symptom of a deeper rift, one that threatened to tear apart the very fabric of their family.",
      "As he navigated the hotel’s corridors, Ivor felt the weight of his past bearing down on him. The stakes were high; regaining his place in the family legacy meant more than just financial stability—it was about respect, about proving he was not the failure they believed him to be. Each glance from the other guests felt like an accusation, their whispers a reminder of his perceived shortcomings. He had dedicated his life to service, yet here he was, embroiled in scandal, his reputation hanging by a thread.",
      "The tension of that fateful day surged through Ivor as he recalled the confrontation with the victim. He could still hear the words exchanged, the anger bubbling just beneath the surface. Would he be blamed for the murder? The thought gnawed at him, a dark shadow that loomed over his every move. Ivor’s internal conflict was palpable; he wanted to confront his grievances, to reclaim his legacy, yet he feared what that might unleash.",
      "In the days that followed, Ivor would have to confront not only the investigation but also the demons of his past. Would he succumb to the bitterness that had long defined him, or would he find a way to forgive and rebuild? The tide of deception was rising, and Ivor Hale was caught in its relentless pull. It was time for him to decide what family truly meant and whether he could find redemption amidst the chaos."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "A charming socialite with a glamorous facade, Beatrice Quill holds a personal grudge against the victim that complicates her role in the ongoing investigation.",
    "publicPersona": "Beatrice is the quintessential socialite, always the center of attention at gatherings, known for her charm and poise.",
    "privateSecret": "However, her glamorous exterior masks a deep-seated grudge against the victim, stemming from a humiliating public embarrassment.",
    "motiveSeed": "With the potential to gain social standing by revealing damaging secrets about the victim, Beatrice is caught between ambition and morality.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice claims to have been in the garden during the incident, a statement that raises eyebrows.",
    "accessPlausibility": "possible",
    "stakes": "Desperate to reclaim her reputation, Beatrice's actions could either elevate her status or lead to her downfall.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Beatrice speaks with a playful lilt, often employing sarcasm and wit. She has a tendency to use dramatic pauses to build suspense in her narratives.",
    "signatureTic": "‘Oh, darling’ — a phrase she uses to punctuate her observations, often dripping with irony.",
    "internalConflict": "Beatrice wrestles with her insecurities and the desire for revenge, torn between her public persona and her private grievances.",
    "personalStakeInCase": "This crime matters deeply to Beatrice; it’s not just about the victim’s death but about reclaiming her own narrative and social influence.",
    "paragraphs": [
      "Beatrice Quill was the embodiment of charm, a socialite who danced through life with an effortless grace. Her laughter echoed through the halls of the seaside hotel, drawing attention wherever she went. Yet, beneath the glamorous facade lay a simmering resentment towards the victim, a grudge born from a humiliating public embarrassment that had left scars on her pride. As she navigated the social landscape, Beatrice found herself at a crossroads, caught between her desire for revenge and the allure of maintaining her carefully curated image.",
      "In the days leading up to the murder, Beatrice had felt the pressure mounting. The whispers of secrets and scandals surrounded her like a shroud, and her alibi—being in the garden during the incident—felt tenuous at best. She had a motive, one that could elevate her social standing if she played her cards right. Yet, the thought of crossing that line filled her with dread. ‘Oh, darling,’ she would say, feigning nonchalance, but the truth was much darker; the stakes were higher than she had ever anticipated.",
      "As the investigation unfolded, Beatrice found herself grappling with her insecurities. The desire to reclaim her reputation clashed with the moral implications of her actions. Would she reveal the damaging secrets she held, or would she risk losing everything in the pursuit of vengeance? Each interaction with the other guests felt like a tightrope walk, a delicate dance between charm and menace, and Beatrice was acutely aware of the precariousness of her position.",
      "In the end, Beatrice realized this case was not just about the victim’s demise but about her own journey of self-discovery. The tide of deception was rising, and she would have to confront her insecurities and learn to stand firm in her truth. Would she emerge stronger, or would the darkness of her past consume her? The choice lay ahead, and Beatrice Quill was determined to navigate the storm with the same flair she brought to every social gathering."
    ],
    "order": 4
  },
  {
    "name": "Sylvia Trent",
    "summary": "An art curator with a cultured demeanor, Sylvia Trent is entangled in a web of financial troubles that complicates her role in the investigation.",
    "publicPersona": "Sylvia is known for her sophistication and respectability in the art community, often seen as a beacon of culture and refinement.",
    "privateSecret": "Yet, behind her polished exterior lies a significant debt to the victim, creating a precarious situation that could lead to bankruptcy.",
    "motiveSeed": "The threat of losing her collection if the victim's estate seizes it drives Sylvia to consider desperate measures.",
    "motiveStrength": "strong",
    "alibiWindow": "Sylvia reported being at a gallery opening miles away during the murder, a claim that casts doubt on her innocence.",
    "accessPlausibility": "unlikely",
    "stakes": "Her career and financial stability hang in the balance; she must protect everything she has worked for.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Sylvia speaks with a refined eloquence, often employing art-related metaphors. She has a tendency to pause contemplatively, choosing her words with care.",
    "signatureTic": "‘Art is subjective’ — a phrase she often uses to justify her opinions and choices.",
    "internalConflict": "Sylvia faces the weight of her financial mismanagement, torn between the desire to protect her career and the fear of exposure.",
    "personalStakeInCase": "This crime matters deeply to Sylvia; it represents a reckoning for her financial missteps and the potential loss of everything she has built.",
    "paragraphs": [
      "Sylvia Trent was a curator of art and of her public persona, a woman who navigated the world of culture with grace. Her sophistication captivated those around her, yet beneath the polished exterior lay a storm of financial trouble. The victim was not just a colleague; they were the embodiment of her worst fears, a looming threat that could unravel her carefully constructed life. The debt she owed was a dark secret, one that could bring her crashing down if the victim's estate seized her beloved collection.",
      "As the investigation unfolded, Sylvia found herself grappling with a sense of impending doom. Her alibi—being miles away at a gallery opening—felt fragile, a thin veil over her growing anxiety. The stakes were higher than she had ever imagined; her career and financial stability were at risk, and the thought of exposure was unbearable. ‘Art is subjective,’ she would say, attempting to deflect attention, but the truth was far more precarious.",
      "In the days following the murder, Sylvia's mind raced with possibilities. Would her secrets be uncovered? The weight of her financial mismanagement pressed down on her, and she felt the walls closing in. Each conversation with the other suspects felt like a game of chess, where one wrong move could lead to checkmate. She had to protect what she had built, yet the fear of losing it all gnawed at her insides.",
      "Ultimately, this case was not just about the victim's demise; it was about Sylvia's reckoning. Would she confront her financial demons and seek redemption, or would she allow the tide of deception to swallow her whole? The choice lay before her, and as the waves crashed against the shore, she could feel the pressure mounting. Sylvia Trent was at a crossroads, and the art of survival was about to be put to the ultimate test."
    ],
    "order": 5
  },
  {
    "name": "Hugo Vane",
    "summary": "An ambitious real estate developer, Hugo Vane is caught between his aspirations and the dark secrets he harbors regarding the victim's property.",
    "publicPersona": "Hugo is a charismatic figure, often seen as a rising star in the real estate field, known for his persuasive charm and business acumen.",
    "privateSecret": "However, he is secretly attempting to buy the victim’s property for a lucrative deal, complicating his motives.",
    "motiveSeed": "The victim's land is crucial for his plans to build an exclusive resort, making him a suspect in the unfolding investigation.",
    "motiveStrength": "moderate",
    "alibiWindow": "Hugo claims to have been in a meeting with his investors during the murder, a statement that raises eyebrows.",
    "accessPlausibility": "unlikely",
    "stakes": "His future hinges on this deal; failure could spell disaster for his ambitions.",
    "humourStyle": "blunt",
    "humourLevel": 0.5,
    "speechMannerisms": "Hugo speaks in a direct, no-nonsense manner, often cutting to the chase. He has a tendency to use business jargon, making his intentions clear.",
    "signatureTic": "‘Let’s get down to brass tacks’ — a phrase he often uses when discussing business matters.",
    "internalConflict": "Hugo struggles with the ethical implications of his ambition, torn between his desire for success and the moral cost of his actions.",
    "personalStakeInCase": "This crime is significant for Hugo, as it directly impacts his future and the potential loss of a lucrative opportunity.",
    "paragraphs": [
      "Hugo Vane was a man driven by ambition, a real estate developer with eyes set firmly on the prize. His charm was undeniable, often disarming those who crossed his path, yet beneath the surface lay a darker reality. The victim’s property was a key element in his plans to build an exclusive resort, a venture that could secure his future and elevate his status in the business world. Yet, he was also a suspect, caught in a web of suspicion that threatened to unravel everything he had worked for.",
      "As he navigated the hotel, Hugo felt the weight of his secret pressing down on him. His alibi—being in a meeting with investors—was shaky at best, and the stakes were higher than he was willing to admit. ‘Let’s get down to brass tacks,’ he would say, trying to project confidence, but the underlying tension was palpable. Each interaction felt like a tightrope walk, balancing his ambitions against the growing scrutiny of those around him.",
      "In the aftermath of the murder, Hugo found himself questioning his own motives. The ambition that had propelled him forward now felt tainted by the moral implications of his actions. Would he be willing to go to any lengths to secure his success? The internal conflict raged within him, a battle between the desire for achievement and the fear of losing his integrity. As the investigation unfolded, the pressure mounted, and Hugo knew he had to tread carefully.",
      "Ultimately, this case was not just about the victim’s death; it was about Hugo’s reckoning with his own ambitions. The tide of deception was rising, and he would have to confront the consequences of his choices. Would he emerge from this storm as a victor, or would the very ambitions that drove him lead to his downfall? The answer lay in the choices he would make in the days to come."
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
    "type": "Hotel",
    "place": "Clovelly",
    "country": "England",
    "summary": "A seaside hotel with a blend of Art Deco and Colonial Revival styles, overlooking the tumultuous Atlantic, where whispers of espionage linger like sea mist.",
    "visualDescription": "The Crestview Hotel stands resolute against the rugged cliffs, its whitewashed facade adorned with bold geometric patterns of Art Deco, softened by the colonial porch that invites weary travelers. Large windows frame the ocean view, while the interior boasts polished mahogany and brass fittings that reflect the dim light of hanging chandeliers.",
    "atmosphere": "An unsettling blend of elegance and foreboding, punctuated by the crashing waves and the distant echoes of wartime fears.",
    "paragraphs": [
      "The Crestview Hotel, perched precariously on the cliffs of Clovelly, stands as a sentinel against the relentless Atlantic. Built in the early 1920s, its exquisite Art Deco features intertwine seamlessly with Colonial Revival elements, creating a breathtaking yet haunting atmosphere. The salty breeze carries whispers of secrets long buried, while the rhythmic crash of waves below serves as a constant reminder of the isolation that envelops this remote coastal retreat.",
      "As guests enter the lobby, they are greeted by the gleam of polished brass and the muted glow of period sconces casting long shadows across the marble floor. The air is thick with the scent of damp seaweed and fading cologne, mingling with the subtle hint of wax from the grand piano in the corner. The distant sound of a radio broadcasting news of the war adds an undercurrent of tension to the otherwise serene environment, reminding all within of the world beyond the hotel’s walls.",
      "In the evenings, the hotel transforms, its corridors dimly lit and echoing with the soft murmur of conversations that seem to dance in the air. The flickering candlelight casts an eerie glow on the walls, creating shapes that play tricks on the mind. Outside, the relentless rain taps against the windows, a constant reminder of the storm brewing not only in the skies but also in the hearts of the guests who have come to escape their pasts.",
      "Yet, as night falls, the hotel’s true nature reveals itself. The creaking floorboards and the distant sound of a clock ticking seem to synchronize with the mounting tension among the guests. Secrets are whispered in hushed tones, and the feeling of being watched lingers in the corners, leaving an indelible mark on all who seek refuge within the Crestview’s walls."
    ]
  },
  "atmosphere": {
    "era": "1940s",
    "weather": "Overcast with occasional rain, typical of coastal climates in the fall.",
    "timeFlow": "Three days of mounting tension and suspicion as secrets unravel.",
    "mood": "Tense and suspenseful, heightened by the recent war and lingering fears of espionage.",
    "eraMarkers": [
      "Fading radio broadcasts of wartime news",
      "Rationed wartime vehicles parked outside",
      "Distant sounds of military radar from the coast"
    ],
    "sensoryPalette": {
      "dominant": "Salt air mixed with damp wood and wax",
      "secondary": [
        "Faint tobacco smoke in the lounge",
        "Lingering cologne and perfume"
      ]
    },
    "paragraphs": [
      "The atmosphere at The Crestview Hotel is thick with tension, as the ocean’s roar blends with the whispers of its guests. The damp air carries an unsettling chill, a reminder of the stormy skies overhead. Flickering lights cast shadows that seem to breathe, revealing glimpses of the past hidden within the hotel’s elegant facade. Each room holds its secrets, every corridor a potential witness to the unfolding drama.",
      "As the days blend into a haze of uncertainty, the hotel becomes a microcosm of the world outside. The lingering scent of sea salt and dampness hangs in the air, while the sounds of rain against the windows create a rhythm that echoes the pulse of anxious hearts. The atmosphere is charged, electric with the weight of unspoken words and the promise of revelations yet to come."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Oceanview Suite",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "Spacious room with large windows overlooking the tumultuous sea, decorated with muted colors and heavy drapes.",
      "sensoryDetails": {
        "sights": [
          "dark storm clouds over the ocean",
          "splintered furniture near the window",
          "scattered personal belongings",
          "broken glass on the floor"
        ],
        "sounds": [
          "waves crashing violently against rocks",
          "howling wind through the cracks",
          "distant thunder rumbling",
          "the creak of the building settling",
          "a clock ticking ominously"
        ],
        "smells": [
          "damp wood and mildew",
          "salt air mixed with blood",
          "burnt candle wax",
          "faint traces of cologne",
          "the metallic scent of fear"
        ],
        "tactile": [
          "cold metal of broken glass",
          "soft fabric of a disheveled bedspread",
          "chill of the draft from the window",
          "smooth surface of a fallen picture frame",
          "rough texture of the splintered furniture"
        ]
      },
      "accessControl": "Restricted access after hours; only staff members allowed to enter for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "rain pelting against the glass",
            "grey light struggling through clouds",
            "puddles forming on the balcony"
          ],
          "sounds": [
            "steady drumming of rain",
            "water dripping from the eaves",
            "the distant crash of waves"
          ],
          "smells": [
            "fresh rain on earth",
            "dampness in the air",
            "faint smoke from nearby chimneys"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light filtering through clouds",
            "heavy shadows in corners",
            "dark waves crashing on the shore"
          ],
          "sounds": [
            "silence punctuated by distant thunder",
            "the creak of the building",
            "the rustle of wet fabric"
          ],
          "smells": [
            "beeswax from candles",
            "wet stone",
            "scent of old leather"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering against the walls",
            "long shadows stretching across the floor",
            "glimmers of stars through the window"
          ],
          "sounds": [
            "the distant call of seabirds",
            "the soft lapping of waves",
            "the ticking of a clock in the corner"
          ],
          "smells": [
            "smoky aroma from nearby fires",
            "freshly polished wood",
            "the lingering scent of perfume"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Oceanview Suite, once a symbol of luxury, now stands as a stark reminder of betrayal. The room, with its grand windows overlooking the crashing waves, is littered with signs of a struggle. Dark storm clouds loom threateningly outside, casting a pall over the once-vibrant space. The air is thick with the smell of damp wood and something metallic, a scent that sends shivers down the spine. Each creak of the building seems to whisper secrets of what transpired within these walls.",
        "As the light fades, the ambiance shifts, the shadows deepening into corners where eyes might linger too long. Flickering candlelight dances across the walls, revealing remnants of a life interrupted. The cold touch of broken glass underfoot serves as a chilling reminder of the chaos that unfolded here. Outside, the wind howls, echoing the turmoil within, as the ocean rages on, a witness to the deceit that has taken place."
      ]
    },
    {
      "id": "lobby",
      "name": "The Grand Lobby",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Spacious area adorned with Art Deco motifs, featuring an imposing reception desk and plush seating arranged around a grand fireplace.",
      "sensoryDetails": {
        "sights": [
          "gleaming brass fixtures",
          "intricate geometric patterns",
          "large potted palms",
          "heavy velvet drapes",
          "ornate chandeliers"
        ],
        "sounds": [
          "soft murmurs of conversation",
          "the crackle of the fire",
          "footsteps echoing on marble floors",
          "the distant sound of a radio",
          "the rustle of newspapers"
        ],
        "smells": [
          "freshly brewed coffee",
          "polished wood and dust",
          "the faint scent of perfume",
          "burnt wood from the fireplace",
          "old paper from discarded letters"
        ],
        "tactile": [
          "smooth marble underfoot",
          "soft plush upholstery",
          "cold brass of the reception desk",
          "rough texture of newspaper",
          "warmth radiating from the fireplace"
        ]
      },
      "accessControl": "Open to all guests and visitors during daylight hours; staff only access after midnight.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "water droplets on windows",
            "soft morning light filtering through clouds",
            "people huddled under umbrellas"
          ],
          "sounds": [
            "steady tapping of rain",
            "the low hum of conversations",
            "the rustling of wet clothing"
          ],
          "smells": [
            "wet earth",
            "freshly baked pastries",
            "scent of damp wood"
          ],
          "mood": "welcoming yet subdued"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dim light illuminating the lobby",
            "shadows creeping along the walls",
            "faded photographs in frames"
          ],
          "sounds": [
            "the ticking of a large clock",
            "muffled laughter from guests",
            "the sound of a newspaper being unfolded"
          ],
          "smells": [
            "the scent of strong tea",
            "dust motes dancing in the air",
            "the faint aroma of tobacco"
          ],
          "mood": "quiet tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "warm glow of the fireplace",
            "guests mingling with drinks",
            "the last light of the day spilling through windows"
          ],
          "sounds": [
            "clinking of glasses",
            "laughter echoing off the walls",
            "the crackle of the fire"
          ],
          "smells": [
            "the rich scent of whiskey",
            "the warmth of cinnamon",
            "smoky aroma from the fireplace"
          ],
          "mood": "social yet watchful"
        }
      ],
      "paragraphs": [
        "The Grand Lobby is a kaleidoscope of activity, a vibrant hub where guests gather, exchanging stories and secrets. The air is filled with the rich aroma of freshly brewed coffee, mingling with the faint scent of perfume. Brass fixtures gleam in the soft light, casting a warm glow over the plush seating areas arranged around the grand fireplace. The crackling fire adds a sense of comfort, yet the tension is palpable, as if the walls themselves are eavesdropping on hushed conversations.",
        "As the day turns to night, the atmosphere shifts. Shadows deepen, and the sounds of laughter fade, replaced by the soft ticking of a clock that seems to echo the heartbeat of the hotel. The scent of tobacco wafts through the air, mingling with the warmth of the fire. Guests exchange furtive glances, aware that not everything is as it seems within the walls of The Crestview. The lobby, a stage for drama, holds its breath, waiting for the next act to unfold."
      ]
    },
    {
      "id": "dining_room",
      "name": "The Oceanview Dining Room",
      "type": "interior",
      "purpose": "Gathering space for meals",
      "visualDetails": "Elegant room with large windows framing the ocean view, adorned with crisp white table linens and polished silverware.",
      "sensoryDetails": {
        "sights": [
          "gleaming silver cutlery",
          "fresh flowers on each table",
          "sunlight glinting off the ocean",
          "artful centerpieces",
          "heavy drapes framing the windows"
        ],
        "sounds": [
          "clinking of plates and cutlery",
          "soft murmur of conversations",
          "the distant sound of waves crashing",
          "the rustle of napkins",
          "the pop of a champagne bottle"
        ],
        "smells": [
          "aroma of freshly baked bread",
          "scent of simmering seafood",
          "whiff of rich sauces",
          "the sweetness of dessert",
          "faint scent of citrus"
        ],
        "tactile": [
          "smooth surface of the table",
          "soft linen napkins",
          "cold glass of water",
          "warmth of a freshly baked roll",
          "the weight of silver cutlery"
        ]
      },
      "accessControl": "Open for breakfast, lunch, and dinner; staff only access during off-hours for cleaning.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "raindrops sliding down window panes",
            "dim light filtering through clouds",
            "empty tables awaiting guests"
          ],
          "sounds": [
            "the patter of rain",
            "soft murmurs of early risers",
            "the clink of coffee cups"
          ],
          "smells": [
            "freshly brewed coffee",
            "the scent of dampness",
            "baking pastries"
          ],
          "mood": "intimate and quiet"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "grey light casting shadows",
            "tables set for dinner",
            "the ocean appearing dull and choppy"
          ],
          "sounds": [
            "the murmur of subdued conversations",
            "the sound of a fork scraping against a plate",
            "the distant crash of waves"
          ],
          "smells": [
            "the rich scent of simmering dishes",
            "the aroma of fresh herbs",
            "the sweetness of dessert"
          ],
          "mood": "sombre and reflective"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight flickering on tables",
            "the sun setting over the ocean",
            "guests raising their glasses in toasts"
          ],
          "sounds": [
            "laughter and clinking glasses",
            "the soft strumming of a guitar",
            "the gentle sound of waves"
          ],
          "smells": [
            "the aroma of grilled fish",
            "the scent of fresh flowers",
            "the sweetness of dessert"
          ],
          "mood": "celebratory yet tense"
        }
      ],
      "paragraphs": [
        "The Oceanview Dining Room is a feast for the senses, where elegance meets the raw beauty of the sea. Large windows frame breathtaking views of the crashing waves, while crisp white linens adorn the tables, reflecting the light of the setting sun. The air is filled with the enticing aromas of freshly baked bread and simmering seafood, drawing guests into a world of culinary delights. Yet, beneath the surface, tensions simmer, as glances are exchanged and secrets linger over each course.",
        "As night descends, the dining room transforms into a realm of candlelit intimacy. The flickering flames cast dancing shadows on the walls, while laughter mingles with the sound of waves crashing against the cliffs. The scent of rich sauces and sweet desserts fills the air, tantalizing the senses. Yet, amidst the celebration, an undercurrent of unease flows through the room, as guests navigate unspoken truths and hidden agendas, each bite a reminder of the deception lurking just beneath the surface."
      ]
    }
  ],
  "note": "",
  "cost": 0.0021687633,
  "durationMs": 21558
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1948,
    "month": "February",
    "day": 15,
    "era": "1940s"
  },
  "seasonal": {
    "season": "winter",
    "month": "February",
    "weather": [
      "overcast skies",
      "intermittent rain showers",
      "cold winds off the coast"
    ],
    "daylight": "Short days with daylight fading around five o'clock in the evening, making evenings feel enveloped in darkness.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after the hotel’s dining service has concluded.",
    "holidays": [
      "Valentine's Day (February 14)"
    ],
    "seasonalActivities": [
      "Indoor social gatherings at hotels and homes",
      "Valentine's Day celebrations with romantic dinners",
      "Coastal walks to enjoy the crisp winter air"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "double-breasted wool suit",
        "tailored overcoat",
        "silk tie"
      ],
      "casual": [
        "tweed jacket",
        "corduroy trousers",
        "knitted pullover"
      ],
      "accessories": [
        "fedora hat",
        "leather gloves",
        "watch chain"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with fitted bodice",
        "fur stole",
        "pearl necklace"
      ],
      "casual": [
        "wool cardigan",
        "A-line skirt",
        "button-up blouse"
      ],
      "accessories": [
        "cloche hat",
        "silk scarf",
        "gloves"
      ]
    },
    "trendsOfTheMoment": [
      "Utilitarian fashion, influenced by wartime practicality",
      "Bright colors emerging as a post-war trend",
      "Increased use of synthetic fabrics like nylon"
    ],
    "socialExpectations": [
      "Men are typically the breadwinners",
      "Women are expected to maintain a domestic sphere while also entering the workforce",
      "Proper etiquette is emphasized in social gatherings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The United States recognizes Israel",
      "The Cold War tensions escalate with the Soviet Union's influence in Eastern Europe",
      "Debates in the UK parliament over nationalization policies"
    ],
    "politicalClimate": "Increased tension between the capitalist West and the communist East, with fears of espionage and influence permeating society.",
    "economicConditions": "Post-war recovery is underway, but inflation is rising; shortages of goods remain in some areas.",
    "socialIssues": [
      "Discrimination against returning veterans",
      "Rising demand for better housing",
      "Struggles for civil rights, particularly for African Americans"
    ],
    "internationalNews": [
      "The Berlin Blockade begins to loom on the horizon",
      "The Marshall Plan is gaining traction to aid European recovery"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "Nat King Cole - 'Nature Boy'",
        "Frank Sinatra - 'I’ll Be Seeing You'",
        "Doris Day - 'Sentimental Journey'"
      ],
      "films": [
        "'The Treasure of the Sierra Madre'",
        "'Gentlemen's Agreement'",
        "'The Bishop's Wife'"
      ],
      "theater": [
        "'Annie Get Your Gun'",
        "'The King and I'",
        "'A Streetcar Named Desire'"
      ],
      "radio": [
        "'The Jack Benny Program'",
        "'Suspense'",
        "'The Lone Ranger'"
      ]
    },
    "literature": {
      "recentPublications": [
        "'The Naked and the Dead' by Norman Mailer",
        "'The Old Man and the Sea' by Ernest Hemingway",
        "'The Little Prince' by Antoine de Saint-Exupéry"
      ],
      "popularGenres": [
        "Mystery",
        "Historical Fiction",
        "Social Commentary"
      ]
    },
    "technology": {
      "recentInventions": [
        "Transistor radio",
        "Early color television sets",
        "Jet engine advancements"
      ],
      "commonDevices": [
        "Vacuum cleaners",
        "Refrigerators",
        "Washing machines"
      ],
      "emergingTrends": [
        "Increase in consumer goods as wartime production shifts to peacetime",
        "Growth of the automobile industry"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Movie ticket: one shilling",
        "Taxi fare: two shillings"
      ],
      "commonActivities": [
        "Gathering in local pubs for warmth and companionship",
        "Attending community events or dances",
        "Engaging in evening radio programs"
      ],
      "socialRituals": [
        "Evening tea served with biscuits",
        "Sunday family gatherings for dinner",
        "Valentine's Day gift exchanges"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "Emerging middle class is more influential",
      "Class distinctions are still present but less rigid post-war"
    ],
    "gender": [
      "Women are increasingly seen in the workforce",
      "Traditional gender roles still persist, though being challenged"
    ],
    "race": [
      "Growing awareness of civil rights issues",
      "Persistent segregation and discrimination in many areas"
    ],
    "generalNorms": [
      "Emphasis on community, family values, and social etiquette",
      "Increasing acceptance of modern conveniences in daily life"
    ]
  },
  "atmosphericDetails": [
    "The air is thick with the scent of rain-soaked earth, mingling with the salt of the sea as waves crash rhythmically against the rocky shoreline.",
    "The muted glow of lamps casts long shadows in the hotel’s dimly lit corridors, echoing whispers of tense conversations and secrets yet to be revealed.",
    "The distant sound of a jazz band playing softly in the lounge drifts through the air, creating a warm contrast to the chill that seeps through the windows."
  ],
  "paragraphs": [
    "February 1948 finds the coastal hotel engulfed in a cloak of winter gloom, where overcast skies threaten rain at any moment. The air is crisp and damp, making the hotel’s interiors a sanctuary from the biting winds that whip off the ocean. With Valentine’s Day recently passed, couples linger in the lounges, exchanging furtive glances and knowing smiles. The mood is a mixture of romance tinged with an undercurrent of anxiety, as post-war tensions cast long shadows over the lives of those gathered within the hotel walls.",
    "Fashion during this period reflects the transition from wartime necessity to peacetime luxury. Men sport double-breasted wool suits, paired with tailored overcoats and silk ties, while women embrace tea-length dresses that accentuate their figures, often adorned with fur stoles and pearl necklaces. The vibrant colors of spring are beginning to emerge, though the chill of winter still lingers, leading many to accessorize with cloche hats and gloves. This careful attention to appearance speaks to a society eager to reclaim a sense of normalcy and elegance after years of conflict.",
    "Daily life in February 1948 is marked by a mixture of optimism and caution. The typical prices reflect a recovering economy, with a loaf of bread costing four pence and a taxi ride across town two shillings. People gather at local pubs, sharing stories while listening to radio dramas, taking solace in community amidst uncertainty. Valentine's Day has passed, but the rituals of romance continue, with couples exchanging small gifts and enjoying quiet dinners, all while the specter of the Cold War looms larger in the background, raising questions about loyalty and trust."
  ],
  "note": "",
  "cost": 0.00105257625,
  "durationMs": 12169
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A seaside hotel hosts a gathering of war veterans, their families, and staff, all grappling with the societal shifts and traumas of the post-war era while secrets and tensions rise with the tide.",
  "era": {
    "decade": "1940s",
    "socialStructure": "The aftermath of WWII has reshaped class dynamics, with increased female workforce participation creating both opportunity and social pressure among traditional roles."
  },
  "setting": {
    "location": "A seaside hotel built in the early 1920s with a view of the ocean.",
    "institution": "Hotel",
    "weather": "Overcast with occasional rain, typical of coastal climates in the fall."
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
    "value": "ten minutes past midnight",
    "description": "The valve opened at this exact time, allowing the tide to flood the room."
  },
  {
    "id": "water_level_height",
    "value": "three feet",
    "description": "The room was flooded to this height at the time of discovery, indicating the volume of water that entered."
  }
]

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
{
  "totalClues": 17,
  "countsByPlacement": {
    "early": 6,
    "mid": 10,
    "late": 1
  },
  "countsByCriticality": {
    "essential": 16,
    "optional": 1
  },
  "redHerringCount": 0,
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
      "category": "testimonial"
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
      "category": "testimonial"
    },
    {
      "id": "clue_5",
      "placement": "mid",
      "criticality": "essential",
      "category": "behavioral"
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
      "placement": "early",
      "criticality": "essential",
      "category": "physical"
    },
    {
      "id": "clue_culprit_direct_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_culprit_direct_hugo_vane",
      "placement": "mid",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_early_1",
      "placement": "early",
      "criticality": "essential",
      "category": "spatial"
    },
    {
      "id": "clue_mid_1",
      "placement": "early",
      "criticality": "essential",
      "category": "temporal"
    },
    {
      "id": "clue_late_1",
      "placement": "mid",
      "criticality": "essential",
      "category": "physical"
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

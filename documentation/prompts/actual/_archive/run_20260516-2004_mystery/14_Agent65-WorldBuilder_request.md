# Actual Prompt Record

- Run ID: `mystery-1778961897239`
- Project ID: ``
- Timestamp: `2026-05-16T20:07:32.379Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `616971da11f4f544`

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
    "title": "The Clock of Deceit",
    "author": "Anonymous",
    "license": "CC-BY-4.0",
    "era": {
      "decade": "1930s",
      "realism_constraints": []
    },
    "setting": {
      "location": "Little Middleton",
      "place": "Country Estate",
      "country": "England",
      "institution": "Manor house"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "premeditated"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [],
      "public_persona": "Wealthy socialite and host",
      "private_secret": "Struggling with financial issues due to the Great Depression",
      "motive_seed": "Preserve her social standing",
      "motive_strength": "strong",
      "alibi_window": "11:00 PM to 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "kitchen",
        "study",
        "garden"
      ],
      "behavioral_tells": [
        "Nervous laughter when pressed about finances"
      ],
      "stakes": "Her reputation and financial future",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "witness",
      "relationships": [],
      "public_persona": "Esteemed local physician",
      "private_secret": "Involved in an affair with Eleanor",
      "motive_seed": "Desire to protect Eleanor",
      "motive_strength": "moderate",
      "alibi_window": "11:00 PM to 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "library",
        "dining room"
      ],
      "behavioral_tells": [
        "Frequent glances at Eleanor during discussions"
      ],
      "stakes": "His career and reputation",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "35-45",
      "role_archetype": "suspect",
      "relationships": [],
      "public_persona": "Retired military officer",
      "private_secret": "Has a grudge against Eleanor's family",
      "motive_seed": "Revenge for a past slight",
      "motive_strength": "moderate",
      "alibi_window": "11:00 PM to 11:30 PM",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "garden",
        "tool shed"
      ],
      "behavioral_tells": [
        "Irritated by Eleanor's dismissive attitude"
      ],
      "stakes": "His honor and personal vendetta",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "25-35",
      "role_archetype": "victim",
      "relationships": [],
      "public_persona": "Eleanor's childhood friend",
      "private_secret": "Knew about Eleanor's financial troubles",
      "motive_seed": "Jealousy over Eleanor's lifestyle",
      "motive_strength": "strong",
      "alibi_window": "11:00 PM to 11:30 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "drawing room",
        "guest bedroom"
      ],
      "behavioral_tells": [
        "Frequent arguments with Eleanor"
      ],
      "stakes": "Her friendship and hidden grievances",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "guilty",
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
      "summary": "During a stormy birthday celebration at a country estate, Eleanor Voss is found dead. As tensions rise among the guests, Eleanor's past and financial troubles surface, leading to a web of deceit and betrayal. The key to the mystery lies in a tampered clock that misrepresents the time of death."
    },
    "accepted_facts": [],
    "inferred_conclusions": []
  },
  "hidden_model": {
    "mechanism": {
      "description": "The Clock of Deceit",
      "delivery_path": [
        {
          "step": "The clock was deliberately wound back to misrepresent the time of death."
        },
        {
          "step": "Witnesses heard the clock chime at odd intervals indicating tampering."
        },
        {
          "step": "Residue on the clock shows signs of interference."
        }
      ]
    },
    "outcome": {
      "result": "Evidence reveals the true time of death, contradicting alibis."
    }
  },
  "false_assumption": {
    "statement": "Eleanor was killed shortly before the clock chimed eleven.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses confirm the clock's timing was reliable.",
    "what_it_hides": "The clock was tampered with to create a false timeline."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "clock chime at eleven",
        "witness statements about timing"
      ],
      "windows": [
        "11:00 PM to 11:30 PM"
      ],
      "contradictions": [
        "Witnesses recall hearing the clock chime after the murder."
      ]
    },
    "access": {
      "actors": [
        "Eleanor Voss",
        "Dr. Mallory Finch",
        "Captain Ivor Hale",
        "Beatrice Quill"
      ],
      "objects": [
        "the clock",
        "murder weapon"
      ],
      "permissions": [
        "restricted access to the study",
        "garden access during the storm"
      ]
    },
    "physical": {
      "laws": [
        "mechanical clock operation",
        "weather effects on sound"
      ],
      "traces": [
        "residue on clock face",
        "wet ground in garden"
      ]
    },
    "social": {
      "trust_channels": [
        "long-standing friendships",
        "hospitality norms"
      ],
      "authority_sources": [
        "Dr. Finch's medical authority",
        "Eleanor's social standing"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "The clock in the study shows it stopped at ten minutes past eleven.",
        "correction": "The time of death must be before this time, contradicting alibis.",
        "effect": "Narrows time of death window to before ten minutes past eleven.",
        "required_evidence": [
          "The clock's displayed time",
          "Witness statement about the clock's chime",
          "Eleanor's last seen time"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report hearing the clock chime at odd intervals.",
        "correction": "The clock's reliability is called into question, suggesting tampering.",
        "effect": "Eliminates reliance on the clock for establishing time of death.",
        "required_evidence": [
          "Witness statements about clock chimes",
          "Observation of clock's odd chime pattern",
          "Eleanor's arrival time before the murder"
        ],
        "reader_observable": true
      },
      {
        "observation": "Residue on the clock face indicates recent tampering.",
        "correction": "The clock was intentionally altered to mislead about the time.",
        "effect": "Confirms the clock's time is manipulated, affecting the murder timeline.",
        "required_evidence": [
          "Physical examination of the clock face",
          "Witness statements about clock maintenance",
          "Timing logs of the clock's last service"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Comparing the clock's tampered time with witness accounts to reveal inconsistencies.",
    "knowledge_revealed": "The revealed facts are clock, study, and stopp.",
    "pass_condition": "If the clock's tampering is proven, it clears false timings.",
    "evidence_clues": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_fp_contradiction_step_1",
      "clue_mechanism_visibility_core",
      "clue_core_contradiction_chain"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The clock's displayed time (early) and witness statements (mid) let the reader identify the false timing. Step 2: Witness accounts of chimes (mid) eliminate the clock as a reliable timekeeper. Step 3: Physical evidence of tampering (discriminating test) confirms the false timeline."
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
        "Execute the discriminating test comparing clock timings",
        "Observe the contradictions in witness accounts",
        "Draw conclusion about the tampered clock"
      ],
      "test_type": "trap"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His alibi is confirmed through witness statements.",
        "supporting_clues": [
          "clue_1",
          "clue_2"
        ]
      },
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "His access to the clock was limited, confirmed by evidence.",
        "supporting_clues": [
          "clue_1",
          "clue_3"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 6,
      "revelation_method": "Confrontation with evidence of clock tampering."
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
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_fp_contradiction_step_1",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_1",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation of the clock"
      },
      {
        "clue_id": "clue_2",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Witness statement regarding clock chimes"
      },
      {
        "clue_id": "clue_3",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Examination of residue on clock"
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
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Behavioral observation"
      }
    ]
  }
}

### CHARACTER_PROFILES
[
  {
    "name": "Eleanor Voss",
    "summary": "Eleanor Voss is a local historian whose extensive knowledge of Little Middleton's past is both her pride and her burden. As an amateur sleuth, she finds herself entangled in a web of family secrets that threaten to unravel her reputation.",
    "publicPersona": "Eleanor is the respected curator of the local history museum, often seen at community events discussing the rich tapestry of Little Middleton’s past. Her passion for history makes her a beloved figure, though some whisper that her interest might stem from a desire to distract from her own family's skeletons.",
    "privateSecret": "Eleanor grapples with the knowledge that her family harbors a scandal that could tarnish their name if exposed. The thought of revealing this truth is a heavy weight on her conscience, as she fears the repercussions it would have on her standing in the community.",
    "motiveSeed": "When she learned that the victim was poised to unveil her family's hidden past, Eleanor’s desperation to protect her legacy intensified. The thought of losing her hard-won reputation drives her to investigate the murder, perhaps too closely.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor was engrossed in research at the library from 8:30 to 9:15 PM, a fact that she hopes will shield her from suspicion.",
    "accessPlausibility": "easy",
    "stakes": "The stakes are high for Eleanor; not only is her reputation on the line, but the very legacy of her family hangs in the balance. The fear of scandal looms large, pushing her to the brink of moral compromise.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Eleanor speaks with a measured tone, often punctuating her sentences with historical references. She has a habit of using precise language, but her wit surfaces in subtle, ironic remarks that reveal her keen intellect.",
    "internalConflict": "Eleanor is torn between her desire to protect her family's name and the moral implications of concealing the truth. The weight of her family's history is a constant reminder of her own complicity in the potential deception.",
    "personalStakeInCase": "This crime matters to Eleanor not just as a historian but as a member of the Voss family; she feels a duty to confront her family's past and decide whether to safeguard it or let the truth prevail.",
    "paragraphs": [
      "Eleanor Voss stood in the dimly lit library, the scent of aged paper and ink enveloping her like a comforting shawl. She immersed herself in the pages of local history, her fingers tracing the lines of text, yet her mind was elsewhere. The impending scandal loomed like a storm cloud over her family's name, threatening to unravel the delicate tapestry of respect she had woven in Little Middleton. She was a respected historian, known for her meticulous research and engaging lectures, but beneath that facade lay a tumultuous sea of anxiety. The victim's whispered threats echoed in her ears, making her heart race.",
      "With each tick of the clock, Eleanor felt a growing urgency. The victim had been privy to secrets that could tarnish the Voss legacy, and she couldn't shake the fear that the truth would soon be laid bare. She had always prided herself on her integrity, yet the very thought of her family's scandal becoming public knowledge sent shivers down her spine. She had spent years curating the town's history, but now she found herself standing at a crossroads where personal and professional integrity clashed violently. Would she protect her family at the cost of the truth?",
      "As she navigated the investigation, Eleanor's keen intellect served her well. She approached each clue with the same curiosity she applied to history, yet she felt the weight of her family's past pressing down on her. The irony of her situation was not lost on her; a historian who might have to rewrite her own family's narrative to save herself. When she spoke, her words were laced with dry humor, a defense mechanism against the anxiety that threatened to engulf her. 'Ah, the irony of digging into the past while burying one's own,' she quipped to herself, a wry smile playing on her lips.",
      "But Eleanor knew that humor could only mask her internal turmoil for so long. The case was personal, and her stakes were high. With each revelation, she faced the painful truth of her family's history, weighing the potential fallout against her moral compass. As she delved deeper into the investigation, Eleanor realized that uncovering the truth might not only save her reputation but also liberate her from the shackles of her family's past. In this pursuit, she would either reclaim her legacy or watch it crumble under the weight of deceit."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a country doctor whose empathetic demeanor masks a life riddled with financial troubles and moral dilemmas. As he becomes embroiled in a murder investigation, he must confront the dark secrets that could ruin him.",
    "publicPersona": "Known for his kind bedside manner and dedication to his patients, Mallory is a pillar of the Little Middleton community. His reputation as a trusted physician grants him a certain respect, but behind the scenes, he struggles with the weight of his financial failures.",
    "privateSecret": "Mallory's life is a precarious balancing act, as he is deeply in debt due to ill-fated investments. The victim's blackmail threatens to expose his situation, leaving him vulnerable to ruin and disgrace.",
    "motiveSeed": "The victim's threat to reveal his financial troubles unless he participated in a dubious deal has Mallory on edge. The stakes are higher than ever, and desperation drives him to consider actions he would otherwise condemn.",
    "motiveStrength": "compelling",
    "alibiWindow": "Mallory was called to the estate for a medical emergency at 9:00 PM, but the timing of the call raises eyebrows.",
    "accessPlausibility": "possible",
    "stakes": "His career and reputation hang by a thread, and the fear of losing everything propels him into a moral quandary that could shatter his life.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.4,
    "speechMannerisms": "Mallory speaks with a gentle, reassuring tone, often punctuating his sentences with self-deprecating humor. He has a tendency to deflect serious topics with light-hearted comments, revealing his discomfort with confrontation.",
    "internalConflict": "Mallory grapples with guilt over his financial choices and the lengths to which he has gone to protect his image. The blackmail he faces forces him to confront the integrity he has always valued as a physician.",
    "personalStakeInCase": "For Mallory, this case is not just about justice but also about self-preservation; he must navigate the treacherous waters of blackmail and deceit while striving to maintain his integrity.",
    "paragraphs": [
      "Dr. Mallory Finch had always prided himself on being the compassionate doctor, the one who listened to his patients' woes with genuine concern. Yet, as he stood in the estate's drawing room, his mind raced with the implications of the murder that had just taken place. The victim, a man whose threats had loomed over Mallory like a dark cloud, had been silenced. Now, the very thought of being implicated in the murder sent chills down his spine. He could almost hear the whispers of the townsfolk, speculating about the good doctor who had fallen from grace.",
      "His financial troubles were no secret in the confines of his own mind. Failed investments had left him drowning in debt, and the victim had been all too eager to exploit that weakness. Mallory had always believed in the sanctity of his profession, yet here he was, teetering on the edge of moral bankruptcy. 'Ah, the irony of a doctor who can mend broken bones but cannot fix his own finances,' he mused, attempting to inject humor into a situation that felt increasingly dire.",
      "As he navigated the investigation, Mallory's self-deprecating humor emerged as a coping mechanism. He often found himself deflecting serious conversations with light-hearted quips, a way to mask the anxiety gnawing at him. 'Well, if this is what being a country doctor entails, I might as well take up gardening instead,' he joked to a colleague, though the laughter never quite reached his eyes. The internal conflict was palpable; he wanted to uphold his integrity but felt the noose of blackmail tightening around his neck.",
      "With the clock ticking, Mallory knew he had to act swiftly. The stakes were high, and the weight of his decisions pressed heavily on his conscience. He had to confront the victim's threats and navigate the labyrinth of deceit that surrounded him. The thought of losing his career and reputation was unbearable, yet he felt trapped in a web of his own making. In this investigation, he understood that he was not just fighting for his future but also for the very principles that had defined him as a physician."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale, a retired naval officer, carries the weight of a questionable past in the shipping industry. As an outsider in Little Middleton, he grapples with the threat of exposure while trying to maintain his dignity.",
    "publicPersona": "Dignified and disciplined, Captain Hale is known for his tales of naval adventures, often regaling locals with stories of the sea. His commanding presence earns him respect, yet few are aware of the darker aspects of his past.",
    "privateSecret": "Ivor hides a past filled with dubious dealings in the shipping industry, secrets that the victim had unearthed and threatened to expose. The thought of his honor being tarnished is a constant source of anxiety.",
    "motiveSeed": "The victim's intention to reveal Ivor's involvement in smuggling operations has put him on edge, igniting a fire of desperation in his heart.",
    "motiveStrength": "moderate",
    "alibiWindow": "Ivor was on the estate grounds but claimed to be in the garden from 8:45 to 9:20 PM, a story that some find suspicious.",
    "accessPlausibility": "possible",
    "stakes": "For Ivor, the stakes are not just about his freedom but also about preserving the honor he has fought to maintain throughout his life.",
    "humourStyle": "sardonic",
    "humourLevel": 0.6,
    "speechMannerisms": "Ivor speaks with a commanding tone, often punctuated by sardonic remarks that reveal his cynical view of the world. He has a tendency to use nautical metaphors, lending a unique flair to his dialogue.",
    "internalConflict": "Ivor is caught in a moral struggle between the man he wishes to be and the shadow of his past that looms over him. The fear of exposure gnaws at him, forcing him to confront the man he has tried to leave behind.",
    "personalStakeInCase": "This case is deeply personal for Ivor, as it threatens to expose not only his past misdeeds but also the very honor he has fought to reclaim after years of dubious dealings.",
    "paragraphs": [
      "Captain Ivor Hale surveyed the estate grounds with a practiced eye, every inch of the property reminding him of the weight he carried. A retired naval officer, he had spent years cultivating an image of dignity and discipline, yet the shadows of his past threatened to engulf him. The victim's murder had sent ripples through Little Middleton, and Ivor felt the cold grip of fear as he recalled the secrets that could surface. 'Ah, the danger of a tempest brews where one least expects it,' he muttered, his sardonic humor barely masking the tension beneath the surface.",
      "With a history steeped in dubious dealings, Ivor found himself at a crossroads. The victim had uncovered his involvement in smuggling operations, and the threat of exposure loomed large. He had always prided himself on his honor, but now he felt the tide of his past rising to swallow him whole. 'A captain ought to navigate the waters of life with integrity, but alas, my ship has seen rough seas,' he lamented, his words tinged with a sardonic edge that hinted at the conflict within.",
      "As he mingled with the townsfolk, Ivor's commanding presence commanded respect, yet he felt like an outsider in a community that only saw the surface. His stories of naval adventures were met with admiration, but beneath that facade lay a man wrestling with his demons. 'If only the waves could wash away my sins,' he quipped, but the truth was far more complicated. The internal conflict raged on, a battle between the man he had been and the man he aspired to be.",
      "Now, as the investigation unfolded, Ivor knew he had to confront his past misdeeds head-on. The stakes were high, and the threat of exposure pushed him to the brink. He could no longer remain a passive observer in this unfolding drama; he had to decide who he wanted to be. The winds of change were upon him, and he had to navigate the treacherous waters of truth and deception, lest he be swept away by the very secrets he sought to bury."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a housemaid who appears timid and compliant but harbors a wealth of secrets of her own. As a witness to the household's affairs, she must decide whether to remain in the shadows or step into the light.",
    "publicPersona": "Beatrice is often overlooked in the bustling household, her meek demeanor leading others to underestimate her. Yet, her keen observations and quiet presence allow her to gather information that others dismiss.",
    "privateSecret": "Beneath her timid exterior, Beatrice has been documenting the household's secrets, including the victim's illicit activities. Her knowledge places her in a precarious position, forced to weigh her aspirations against the danger of exposure.",
    "motiveSeed": "The victim's threat to fire her for snooping has Beatrice on edge, pushing her to consider actions she never thought possible.",
    "motiveStrength": "moderate",
    "alibiWindow": "Beatrice was cleaning in the east wing from 8:30 to 9:10 PM, a timeframe that leaves her whereabouts open to scrutiny.",
    "accessPlausibility": "easy",
    "stakes": "Her hopes for independence and a better future hinge on the choices she makes in the wake of the murder, and the fear of losing her position adds to her anxiety.",
    "humourStyle": "observational",
    "humourLevel": 0.3,
    "speechMannerisms": "Beatrice speaks softly, often choosing her words carefully. She has a habit of observing her surroundings before responding, and her humor comes in the form of dry observations about the absurdities of life in the household.",
    "internalConflict": "Beatrice struggles with her desire for independence against the safety of her current position. The threat of losing her job looms large, forcing her to confront her own aspirations and the risks involved.",
    "personalStakeInCase": "This case matters deeply for Beatrice, as it represents a chance to break free from her subservient role and assert her independence while grappling with the moral implications of her knowledge.",
    "paragraphs": [
      "Beatrice Quill moved through the estate like a shadow, her presence often unnoticed amidst the chaos of household duties. The timid housemaid was accustomed to being overlooked, yet her keen eyes missed little. As she cleaned the east wing, she took note of the whispered conversations and furtive glances exchanged by the household members. Within her, a silent storm brewed—a wealth of secrets that could change everything. 'If only one could dust away secrets as easily as one cleans furniture,' she mused, her observational humor a quiet rebellion against her circumstances.",
      "The murder of the victim sent ripples through the household, and Beatrice found herself at a crossroads. She had been documenting the affairs of the household, a task born from both curiosity and necessity. The victim had threatened to fire her for snooping, and now she faced a dilemma that loomed larger than her timid exterior suggested. 'Ah, the irony of a maid with secrets of her own,' she thought, her heart racing as she weighed the implications of her knowledge against her aspirations for a better life.",
      "Despite her meek demeanor, Beatrice possessed a sharp mind and a desire for independence that fueled her internal conflict. She observed the world around her with a mix of trepidation and resolve, her humor often tinged with a dry wit that belied her position. 'Perhaps if I were a little more outspoken, I wouldn't find myself cleaning up after others' messes,' she mused, the thought both amusing and painfully true. The fear of losing her job was ever-present, yet the prospect of remaining in the shadows was equally daunting.",
      "As the investigation unfolded, Beatrice felt the weight of her choices pressing down on her. The stakes were high, and the fear of exposure loomed large. She had to decide whether to remain a passive observer or step into the light, risking everything for the chance at independence. In this moment, she understood that her future hung in the balance, and the truth she had gathered might be the key to unlocking her own freedom."
    ],
    "order": 4
  }
]

### LOCATION_PROFILES
{
  "status": "draft",
  "tone": "Classic",
  "primary": {
    "name": "Middleton Manor",
    "type": "Manor house",
    "place": "Little Middleton",
    "country": "England",
    "summary": "A sprawling estate steeped in secrecy, where the elegance of its façade belies the dark undercurrents of its inhabitants.",
    "visualDescription": "The manor boasts a grand neoclassical façade, with tall columns and intricate stonework, surrounded by meticulously landscaped gardens that stretch towards a dense thicket of trees. Inside, high ceilings and ornate moldings create an atmosphere of opulence, while dimly lit corridors whisper of hidden passages.",
    "atmosphere": "An air of foreboding lingers, with shadows deepening as night falls, amplifying the tension among the guests.",
    "paragraphs": [
      "Middleton Manor stands proud amidst the rolling hills of Little Middleton, its grandeur a testament to the wealth of its owners. The estate's sprawling gardens, meticulously kept, contrast sharply with the dark woods that encroach upon the property, creating a sense of isolation. The faint sound of rain pattering against the windowpanes echoes the unease of the gathering within, where laughter is tinged with suspicion. Each guest glances around, measuring their words as they sip from crystal goblets, the clinking sound underscoring the tension in the air.",
      "Entering the manor, one is enveloped by the scent of polished wood and lingering tobacco smoke. The drawing-room, adorned with rich tapestries and heavy drapes, feels both inviting and claustrophobic, as if the walls themselves are privy to the secrets shared within. Outside, the gardens become a natural barrier, isolating the house from prying eyes and potential rescue. The distant rumble of thunder serves as a reminder of the storm brewing, both outside and among the guests, as they navigate the complexities of their host's hospitality.",
      "As twilight descends, gas lamps flicker to life, casting a warm yet eerie glow over the manor's interiors. Shadows dance across the walls, and the sound of the grandfather clock ticking in the hallway serves as a relentless reminder of time slipping away. The guests, once lively and engaging, have turned cautious, their conversations punctuated by uneasy silences. Each creak of the floorboards seems amplified, a harbinger of the events yet to unfold, as the manor transforms into a stage for deceit and revelation, where every glance and gesture is laden with meaning.",
      "In the heart of the manor lies the locked study, a room shrouded in mystery. It is here that the true nature of the estate's secrets resides, behind a door that only a select few may enter. The heavy oak desk, strewn with papers and a typewriter, stands as a silent witness to the machinations that have taken place. As rain lashes against the windows, the isolation of the manor feels palpable, with the nearest town miles away, and the outside world rendered distant and irrelevant. The clock ticks on, marking the time until the truth must be unveiled."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical of the English countryside",
    "timeFlow": "Three days of mounting tension, as secrets unravel and suspicion deepens among the guests",
    "mood": "Tense, with an undercurrent of suspicion among the guests",
    "eraMarkers": [
      "Petrol touring cars parked in gravel driveways",
      "Early home telephones with limited range",
      "Typewriters scattered throughout the manor for correspondence",
      "Gas lamps casting flickering light over polished surfaces",
      "Grandfather clocks marking the passage of time"
    ],
    "sensoryPalette": {
      "dominant": "The scent of damp earth and polished wood",
      "secondary": [
        "Candle wax and tobacco smoke",
        "The sound of rain against windowpanes"
      ]
    },
    "paragraphs": [
      "The pervasive scent of damp earth mingles with the polished wood of the manor, creating an atmosphere that is both comforting and unsettling. As the rain falls intermittently, the sound is a constant backdrop, punctuated by distant thunder and the occasional crackle of lightning. Inside, the flickering gas lamps cast shadows that seem to breathe, adding a layer of mystery to the already tense environment. Each creak of the floorboards echoes through the corridors, a reminder of the secrets lurking just beyond sight.",
      "The manor's opulence is at odds with the growing suspicion among its inhabitants. The gardens, once a place of beauty, now serve as a reminder of the isolation imposed by the estate's grandeur. Guests wander through the rooms, their movements dictated by the invisible lines of social hierarchy and unspoken tension. The atmosphere thickens with every passing hour, as the rain continues to fall, and the clock ticks down to an inevitable confrontation."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A dimly lit room lined with towering bookshelves, rich mahogany furniture, and a large, ornate fireplace.",
      "sensoryDetails": {
        "sights": [
          "dust motes dancing in candlelight",
          "leather-bound volumes stacked haphazardly",
          "dark oak paneling"
        ],
        "sounds": [
          "the crackling of the fire",
          "soft rustling of pages",
          "distant thunder rumbling"
        ],
        "smells": [
          "dust and old paper",
          "smoky fireplace ash",
          "the mustiness of leather"
        ],
        "tactile": [
          "cool marble floor underfoot",
          "soft velvet armchair cushions",
          "smooth wood of the table edge"
        ]
      },
      "accessControl": "Accessible to family and select guests; locked after dinner to prevent unauthorized entry.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through heavy curtains",
            "water droplets clinging to window glass"
          ],
          "sounds": [
            "steady drumming of rain on the roof",
            "occasional crack of thunder"
          ],
          "smells": [
            "damp wood and mildew",
            "the earthy scent of wet stone"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadowy corners of the room",
            "the flicker of candle flames"
          ],
          "sounds": [
            "silence broken by the ticking clock",
            "the creak of a floorboard"
          ],
          "smells": [
            "beeswax from candle stubs",
            "the faint scent of damp paper"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden candlelight illuminating the room",
            "long shadows creeping across the floor"
          ],
          "sounds": [
            "the crackle of burning logs",
            "the distant laughter of guests"
          ],
          "smells": [
            "warm wood and leather",
            "the lingering aroma of pipe tobacco"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The library, with its towering shelves of books and rich mahogany furniture, is a sanctuary of knowledge turned crime scene. Dimly lit by flickering candles, the room feels both inviting and foreboding. Dust motes dance in the air, caught in the soft glow, while the scent of old paper and leather fills the space. A fireplace crackles softly in the corner, its warmth contrasting with the chill of the rain outside. Yet, beneath the surface, a tension simmers, as the secrets held within these walls threaten to unravel.",
        "As the rain pelts against the windows, the library becomes a cocoon, isolating its occupants from the turmoil outside. The cool marble floor feels solid underfoot, grounding the chaos that lurks in the shadows. The soft velvet cushions of the armchairs beckon, yet they offer no comfort, as every creak of the floorboards seems to amplify the unease. Here, in this room of whispers and secrets, the truth awaits discovery, hidden among the pages of forgotten tomes."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "An elegantly furnished room with plush sofas, intricate wallpaper, and a grand piano in the corner.",
      "sensoryDetails": {
        "sights": [
          "opulent wallpaper with floral patterns",
          "gleaming silver candlesticks",
          "a grand piano waiting silently"
        ],
        "sounds": [
          "soft murmur of conversation",
          "the ticking of a clock",
          "occasional laughter from the guests"
        ],
        "smells": [
          "fresh flowers in a vase",
          "the scent of polished wood",
          "the lingering aroma of tea"
        ],
        "tactile": [
          "silk upholstery on the sofas",
          "cool marble fireplace mantle",
          "the weight of a delicate teacup"
        ]
      },
      "accessControl": "Open to all guests during social gatherings; private conversations can occur in secluded corners.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "soft light filtering through heavy drapes",
            "water droplets on window panes"
          ],
          "sounds": [
            "the gentle patter of rain",
            "muffled voices from outside"
          ],
          "smells": [
            "the scent of damp earth",
            "freshly brewed tea"
          ],
          "mood": "intimate"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "dimly lit corners",
            "shadows playing against the walls"
          ],
          "sounds": [
            "the rustle of fabric",
            "the distant sound of thunder"
          ],
          "smells": [
            "the aroma of old books",
            "the faint trace of perfume"
          ],
          "mood": "melancholic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "candlelight reflecting off polished surfaces",
            "the glow of the fireplace"
          ],
          "sounds": [
            "the soft notes of a piano",
            "the murmur of low conversations"
          ],
          "smells": [
            "the scent of burning logs",
            "the sweetness of dessert"
          ],
          "mood": "festive yet tense"
        }
      ],
      "paragraphs": [
        "The drawing room serves as the heart of Middleton Manor, where guests gather to engage in light conversation and share stories. Opulent wallpaper adorned with floral patterns envelops the room, while plush sofas invite relaxation. The gentle ticking of a clock punctuates the air, mingling with the soft murmur of voices, as laughter occasionally breaks the tension. Yet, beneath the surface, a sense of unease simmers among the guests, each one aware that the manor holds its secrets close.",
        "As the rain continues to fall outside, the drawing room feels like a sanctuary, but also a stage for hidden agendas. The scent of fresh flowers fills the air, mingling with the aromas of polished wood and tea. Guests shift on the silk upholstery of the sofas, their conversations punctuated by the occasional glance towards the grand piano, where silence reigns. In this space of elegance, the boundaries between camaraderie and suspicion blur, setting the stage for the revelations that lie ahead."
      ]
    },
    {
      "id": "the_study",
      "name": "The Study",
      "type": "interior",
      "purpose": "Private space for contemplation and secrets",
      "visualDetails": "A dark, intimate room filled with books, a large oak desk, and a single window overlooking the gardens.",
      "sensoryDetails": {
        "sights": [
          "dim light from a single brass lamp",
          "bookshelves crammed with leather-bound volumes",
          "the imposing oak desk"
        ],
        "sounds": [
          "the rustle of paper",
          "the ticking of a clock",
          "the distant sound of rain"
        ],
        "smells": [
          "rich leather and old paper",
          "the faint hint of cigar smoke",
          "the scent of polished wood"
        ],
        "tactile": [
          "smooth leather of the desk chair",
          "the coolness of a glass ink bottle",
          "the weight of a heavy book"
        ]
      },
      "accessControl": "Restricted to the master of the house and select guests; locked during social events.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "grey light filtering through the window",
            "water droplets sliding down the glass"
          ],
          "sounds": [
            "the patter of rain on the roof",
            "the soft rustle of paper"
          ],
          "smells": [
            "damp wood and mildew",
            "the earthy scent of wet stone"
          ],
          "mood": "introspective"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "shadows deepening in the corners",
            "the glow of the lamp light"
          ],
          "sounds": [
            "the ticking clock",
            "the soft sound of a pen scratching on paper"
          ],
          "smells": [
            "the scent of old books",
            "the faint aroma of cigar smoke"
          ],
          "mood": "tense contemplation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "golden light spilling from the lamp",
            "long shadows stretching across the floor"
          ],
          "sounds": [
            "the soft click of the door opening",
            "the distant sounds of laughter"
          ],
          "smells": [
            "the warm scent of polished wood",
            "the lingering aroma of tobacco"
          ],
          "mood": "foreboding"
        }
      ],
      "paragraphs": [
        "The study, a sanctuary of secrets, is where the master of the house often retreats. Dimly lit by a single brass lamp, the space is filled with the rich scent of leather and old paper. Bookshelves crammed with volumes loom over the large oak desk, which bears the weight of unfinished correspondence and unspoken thoughts. The ticking of the clock resonates in the stillness, while the distant sound of rain outside adds to the atmosphere of isolation and introspection.",
        "As the rain continues its relentless dance against the window, the study feels both inviting and forbidding. The smooth leather of the desk chair molds to its occupant, while the coolness of a glass ink bottle rests in hand, heavy with potential. Here, in this intimate space, the boundaries of trust blur, and the air thickens with the promise of revelation. The secrets held within these walls are waiting, poised to change the course of the gathering outside."
      ]
    },
    {
      "id": "the_cellar",
      "name": "The Cellar",
      "type": "interior",
      "purpose": "Storage and concealment",
      "visualDetails": "A dimly lit stone chamber with wooden shelves stacked with dusty bottles and crates.",
      "sensoryDetails": {
        "sights": [
          "flickering candlelight illuminating the stone walls",
          "shadows creeping across the floor",
          "dust-covered bottles lined up on shelves"
        ],
        "sounds": [
          "the drip of water from the ceiling",
          "the soft rustle of something moving in the dark",
          "the echo of footsteps"
        ],
        "smells": [
          "damp stone and mildew",
          "the scent of old wine",
          "the mustiness of stored goods"
        ],
        "tactile": [
          "rough stone underfoot",
          "the chill of the air",
          "the weight of a dusty bottle"
        ]
      },
      "accessControl": "Access limited to staff for storage; rarely visited by guests.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "dark shadows under the stairs",
            "water droplets pooling on the floor"
          ],
          "sounds": [
            "the steady drip of water",
            "the muffled sounds of rain above"
          ],
          "smells": [
            "the scent of wet stone",
            "the musty aroma of aged wood"
          ],
          "mood": "foreboding"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "flickering shadows cast by candlelight",
            "the uneven surface of the stone walls"
          ],
          "sounds": [
            "the creaking of floorboards above",
            "the distant sound of thunder"
          ],
          "smells": [
            "the stale scent of old barrels",
            "the faint aroma of mold"
          ],
          "mood": "claustrophobic"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "shadows lengthening in the dim light",
            "the glint of glass bottles"
          ],
          "sounds": [
            "the silence of the cellar",
            "the distant murmur of guests above"
          ],
          "smells": [
            "the sharp scent of old wine",
            "the earthy aroma of damp stone"
          ],
          "mood": "mysterious"
        }
      ],
      "paragraphs": [
        "The cellar, a dimly lit chamber beneath the manor, holds more than just dusty bottles and crates. Flickering candlelight casts shadows that seem to dance along the stone walls, creating an atmosphere thick with secrets. The dampness of the air clings to the skin, and the musty scent of old wine lingers, a testament to the years gone by. Here, in the depths of the manor, the echoes of footsteps reverberate, hinting at the weight of what lies hidden within these walls.",
        "As the morning rain continues its relentless patter above, the cellar feels even more isolated, a world apart from the gathering above. The chill in the air wraps around like a shroud, while the drip of water from the ceiling punctuates the silence. In this space, where light barely penetrates, the secrets of Middleton Manor remain concealed, waiting for the moment they will be unearthed."
      ]
    }
  ],
  "note": "",
  "cost": 0.0023641579499999997,
  "durationMs": 28674
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1933,
    "month": "August",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "summer",
    "month": "August",
    "weather": [
      "overcast skies",
      "intermittent rain showers",
      "muggy humidity"
    ],
    "daylight": "Long summer days, with daylight lingering until nearly nine o'clock, but often obscured by clouds",
    "time_of_day_of_crime": "Late evening — between eight and ten at night, as guests gather for after-dinner conversation",
    "holidays": [
      "Bank Holiday Monday (August 7)"
    ],
    "seasonalActivities": [
      "garden parties",
      "picnics in the countryside",
      "fishing in nearby streams"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "three-piece wool suit",
        "crisp white shirt",
        "silk tie"
      ],
      "casual": [
        "tweed blazer",
        "cotton trousers",
        "linen shirt"
      ],
      "accessories": [
        "flat cap",
        "leather gloves",
        "pocket watch"
      ]
    },
    "womensWear": {
      "formal": [
        "knee-length silk dress",
        "lightweight cardigan",
        "wide-brimmed hat"
      ],
      "casual": [
        "cotton blouse with floral print",
        "A-line skirt",
        "comfortable sandals"
      ],
      "accessories": [
        "string of pearls",
        "clutch purse",
        "straw hat with ribbon"
      ]
    },
    "trendsOfTheMoment": [
      "Art Deco influences in design",
      "tailored silhouettes for both genders",
      "bright floral patterns in women's clothing"
    ],
    "socialExpectations": [
      "men expected to wear suits at all formal occasions",
      "women encouraged to maintain modesty in attire",
      "strict adherence to social etiquette among the upper class"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "strengthening of the Nazi regime in Germany",
      "political instability in Britain due to economic distress",
      "public outcry over unemployment and poverty"
    ],
    "politicalClimate": "Tension surrounding the rise of fascism in Europe, with many in Britain concerned about the implications for democracy.",
    "economicConditions": "Continued struggles from the Great Depression, with high unemployment and economic uncertainty influencing social dynamics.",
    "socialIssues": [
      "class disparity evident in daily life",
      "growing concerns over civil rights",
      "debates over foreign policy and military preparedness"
    ],
    "internationalNews": [
      "Hitler consolidates power in Germany",
      "Italy's aggressive expansion under Mussolini",
      "rising anti-Semitism in Europe"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "'Stormy Weather' by Etta James",
        "'Puttin' On the Ritz' by Irving Berlin",
        "Jazz compositions from Duke Ellington"
      ],
      "films": [
        "'King Kong' released in March 1933",
        "'The Invisible Man'",
        "'The Threepenny Opera'"
      ],
      "theater": [
        "'The Royal Family' by George S. Kaufman",
        "'The Front Page' by Ben Hecht and Charles MacArthur"
      ],
      "radio": [
        "BBC Radio broadcasts classical music programs",
        "popular serials like 'Dick Barton' capturing audiences"
      ]
    },
    "literature": {
      "recentPublications": [
        "'Murder in the Mews' by Agatha Christie",
        "'The Glass Key' by Dashiell Hammett",
        "'The Maltese Falcon' by Dashiell Hammett"
      ],
      "popularGenres": [
        "mystery",
        "detective fiction",
        "social commentary novels"
      ]
    },
    "technology": {
      "recentInventions": [
        "the electric refrigerator becomes more common",
        "advancements in radio technology",
        "early development of the automatic telephone exchange"
      ],
      "commonDevices": [
        "home telephones",
        "typewriters for correspondence",
        "early cinema projectors"
      ],
      "emergingTrends": [
        "increased use of automobiles for leisure",
        "growing popularity of radio dramas",
        "a rise in interest for modernist architecture"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Bottle of milk: three pence",
        "Taxi ride across town: two shillings"
      ],
      "commonActivities": [
        "afternoon tea gatherings",
        "visiting local markets",
        "attending garden parties"
      ],
      "socialRituals": [
        "formal dining etiquette",
        "weekend excursions to the countryside",
        "seasonal dance events"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasingly rigid class distinctions",
      "resentment from lower classes towards the upper classes"
    ],
    "gender": [
      "women expected to play traditional roles",
      "men viewed as primary breadwinners",
      "greater freedom for women in urban areas"
    ],
    "race": [
      "subtle racism prevalent in social gatherings",
      "growing awareness of racial issues in immigrant communities"
    ],
    "generalNorms": [
      "strict adherence to social etiquette",
      "importance placed on status and appearances",
      "cynicism towards politics amidst economic hardship"
    ]
  },
  "atmosphericDetails": [
    "The scent of rain-soaked earth mingles with the blooming flowers of the manor's gardens, creating an earthy aroma.",
    "The distant sound of thunder resonates, echoing the tension among the gathered guests, whose smiles barely conceal their suspicions.",
    "The flickering candlelight casts dancing shadows on the intricately wallpapered walls, amplifying the sense of mystery and unease."
  ],
  "paragraphs": [
    "In the summer of August 1933, the English countryside is cloaked in overcast skies, with intermittent showers creating a blend of humidity and gloom. The events unfolding within the confines of the manor house are as tumultuous as the weather outside. Guests gather in the opulent drawing room, their laughter occasionally punctuated by the nervous glances exchanged among them, a reflection of the underlying tension fueled by recent political upheaval and economic strife. The lingering effects of the Great Depression weigh heavily on all present, creating an atmosphere charged with suspicion and unspoken fears.",
    "Fashion reflects the sophisticated yet strained social fabric of the era, with men donning three-piece wool suits complemented by silk ties, while women adorn themselves in knee-length silk dresses, their elegance a stark contrast to the discontent simmering outside the manor walls. Accessories like flat caps and pearls serve not only as status symbols but also as reminders of the social expectations that govern their interactions. It is a world where appearances are carefully crafted, masking the growing unease brought on by class tensions and the rise of fascism in Europe.",
    "Daily life in this period is punctuated by rituals such as afternoon tea, where gossip and news mingle over delicate sandwiches and scones. Prices for basic commodities, like a loaf of bread at four pence, reflect the economic struggles felt by many, while the upper crust indulges in fishing trips and garden parties. The strict adherence to social etiquette means that every interaction is laden with significance, as guests navigate the intricate web of class distinctions, all while the specter of political unrest looms large in their conversations. As the evening progresses, the clock strikes another hour, its ticking echoing the tension that hangs palpably in the air."
  ],
  "note": "",
  "cost": 0.0010508816999999998,
  "durationMs": 10530
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at a secluded country manor for a wealthy patron's birthday celebration turns tense as class tensions and personal grievances surface amid the backdrop of the Great Depression and rising fascism.",
  "era": {
    "decade": "1930s",
    "socialStructure": "Strict social hierarchies within manor life are strained by economic hardship, creating a volatile mix of privilege and resentment among guests and staff."
  },
  "setting": {
    "location": "A sprawling country estate featuring a grand façade, extensive gardens, and various outbuildings.",
    "institution": "Manor house",
    "weather": "Overcast with intermittent rain, typical of the English countryside."
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
    "id": "witness_time",
    "value": "a quarter past eleven",
    "description": "The time at which witnesses last heard the clock chime"
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock in the study shows it stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "The time indicated by the clock is crucial for determining the time of death.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "Witnesses report hearing the clock chime at odd intervals.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This contradicts the timeline presented by the suspects.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_1",
      "category": "temporal",
      "description": "The time of death must be before this time, contradicting alibis.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "This evidence challenges the alibis provided by the suspects.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_2",
      "category": "temporal",
      "description": "Residue on the clock face indicates recent tampering.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[1]",
      "pointsTo": "This suggests the clock was manipulated to mislead investigators.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_3",
      "category": "temporal",
      "description": "The clock was intentionally altered to mislead about the time.",
      "sourceInCML": "CASE.inference_path.steps[2].required_evidence[0]",
      "pointsTo": "This indicates a deliberate attempt to create a false narrative.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_culprit_direct_beatrice_quill",
      "category": "behavioral",
      "description": "Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This direct evidence shows Beatrice Quill had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Dr. Mallory Finch because he was seen at the hospital during the time of the murder.",
      "sourceInCML": "CASE.cast[1].alibi_window",
      "pointsTo": "This corroborates his alibi and removes him from suspicion.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_4",
      "category": "behavioral",
      "description": "Beatrice Quill expressed jealousy over Eleanor's lifestyle.",
      "sourceInCML": "CASE.inference_path.steps[1].required_evidence[2]",
      "pointsTo": "This motive could lead to potential premeditation.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_5",
      "category": "physical",
      "description": "Wet ground in the garden suggests recent disturbance.",
      "sourceInCML": "CASE.constraint_space.physical.traces[0]",
      "pointsTo": "This could indicate the presence of someone at the scene.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_6",
      "category": "testimonial",
      "description": "Eliminates Captain Ivor Hale because he was at a meeting during the time of the murder.",
      "sourceInCML": "CASE.cast[2].alibi_window",
      "pointsTo": "This corroborates his alibi and removes him from suspicion.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "temporal",
      "description": "Clock chime at eleven remains a late texture detail in the case background.",
      "sourceInCML": "CASE.constraint_space.time.anchors[0]",
      "pointsTo": "Adds late texture without changing the essential deduction chain.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_1",
      "category": "temporal",
      "description": "The clock in the study shows it stopped at ten minutes past eleven.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "The time of death must be before this time, contradicting alibis.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Eleanor was seen arguing with Beatrice shortly before the clock chimed eleven.",
      "supportsAssumption": "Eleanor was killed shortly before the clock chimed eleven.",
      "misdirection": "This may imply Beatrice's involvement but does not prove it."
    },
    {
      "id": "rh_2",
      "description": "Witnesses recall seeing Eleanor leave the study just before the clock struck eleven.",
      "supportsAssumption": "Eleanor was killed shortly before the clock chimed eleven.",
      "misdirection": "This could lead to the assumption that she was killed right after."
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
      "clue_core_contradiction_chain",
      "clue_fp_contradiction_step_1"
    ],
    "mid": [
      "clue_1",
      "clue_2",
      "clue_3",
      "clue_culprit_direct_beatrice_quill",
      "clue_core_elimination_chain",
      "clue_4",
      "clue_5",
      "clue_6"
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
  "latencyMs": 12545,
  "cost": 0.0029088906
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

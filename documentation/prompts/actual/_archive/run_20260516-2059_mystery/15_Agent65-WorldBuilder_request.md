# Actual Prompt Record

- Run ID: `mystery-1778965185516`
- Project ID: ``
- Timestamp: `2026-05-16T21:02:24.318Z`
- Agent: `Agent65-WorldBuilder`
- Operation: `chat_request_full_prompt`
- Model: `gpt-4o-mini`
- Temperature: `0.7`
- Max Tokens: `6000`
- Attempt: `first`
- Prompt Hash: `5fba83eab4674ec3`

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
      "place": "Manor House",
      "country": "England",
      "institution": "Manor house"
    },
    "crime_class": {
      "category": "murder",
      "subtype": "mechanical deception"
    }
  },
  "cast": [
    {
      "name": "Eleanor Voss",
      "age_range": "30-40",
      "role_archetype": "detective",
      "relationships": [
        "Dr. Mallory Finch (victim)",
        "Captain Ivor Hale (friend)",
        "Beatrice Quill (housekeeper)"
      ],
      "public_persona": "Intrepid detective with a keen mind",
      "private_secret": "Struggles with self-doubt about her abilities",
      "motive_seed": "Desire to prove herself",
      "motive_strength": "high",
      "alibi_window": "none",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the manor",
        "Knowledge of household routines"
      ],
      "behavioral_tells": [
        "Calm demeanor under pressure"
      ],
      "stakes": "Personal reputation and self-worth",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "female"
    },
    {
      "name": "Dr. Mallory Finch",
      "age_range": "40-50",
      "role_archetype": "victim",
      "relationships": [
        "Eleanor Voss (friend)",
        "Captain Ivor Hale (colleague)",
        "Beatrice Quill (servant)"
      ],
      "public_persona": "Respected physician with a large practice",
      "private_secret": "Financial troubles due to the Great Depression",
      "motive_seed": "Potential inheritance disputes",
      "motive_strength": "moderate",
      "alibi_window": "none",
      "access_plausibility": "medium",
      "opportunity_channels": [
        "Visiting the manor frequently"
      ],
      "behavioral_tells": [
        "Nervousness about financial matters"
      ],
      "stakes": "Reputation and financial stability",
      "evidence_sensitivity": [],
      "culprit_eligibility": "ineligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Captain Ivor Hale",
      "age_range": "30-40",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss (friend)",
        "Dr. Mallory Finch (colleague)",
        "Beatrice Quill (housekeeper)"
      ],
      "public_persona": "Charming and charismatic military officer",
      "private_secret": "In love with Eleanor Voss",
      "motive_seed": "Jealousy over Dr. Finch's attention to Eleanor",
      "motive_strength": "low",
      "alibi_window": "between 8:30 and 9:15 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Frequent visitor to the manor"
      ],
      "behavioral_tells": [
        "Flustered when asked about whereabouts"
      ],
      "stakes": "Romantic interest in Eleanor",
      "evidence_sensitivity": [],
      "culprit_eligibility": "eligible",
      "culpability": "unknown",
      "gender": "male"
    },
    {
      "name": "Beatrice Quill",
      "age_range": "50-60",
      "role_archetype": "suspect",
      "relationships": [
        "Eleanor Voss (employer)",
        "Dr. Mallory Finch (doctor)",
        "Captain Ivor Hale (guest)"
      ],
      "public_persona": "Loyal housekeeper devoted to the Finch family",
      "private_secret": "Hides her resentment towards the wealthy",
      "motive_seed": "Financial desperation",
      "motive_strength": "high",
      "alibi_window": "between 8:00 and 9:00 PM",
      "access_plausibility": "high",
      "opportunity_channels": [
        "Access to the entire house"
      ],
      "behavioral_tells": [
        "Defensive when questioned about her duties"
      ],
      "stakes": "Job security and financial survival",
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
      "summary": "During a stormy night at the Finch manor, Dr. Mallory Finch is found dead, seemingly a victim of a tragic accident. However, as Eleanor Voss investigates, she uncovers the manipulation of a mechanical clock that misleads everyone about the time of death, revealing a complex web of motives and secrets."
    },
    "accepted_facts": [
      "Dr. Mallory Finch was found dead in the study.",
      "The clock in the study was tampered with."
    ],
    "inferred_conclusions": [
      "The tampering of the clock indicates premeditation.",
      "Beatrice Quill had access to the study and knowledge of the clock."
    ]
  },
  "hidden_model": {
    "mechanism": {
      "description": "The clock was wound back to create a false timeline for the murder.",
      "delivery_path": [
        {
          "step": "Eleanor finds the clock with dust on its face, suggesting recent tampering."
        },
        {
          "step": "Witnesses report the clock chimed at an unusual hour."
        },
        {
          "step": "Analysis reveals the clock was set back by forty minutes."
        }
      ]
    },
    "outcome": {
      "result": "The false timeline misled the investigation, implicating innocent parties."
    }
  },
  "false_assumption": {
    "statement": "The time of death can be accurately determined by the clock's readings.",
    "type": "temporal",
    "why_it_seems_reasonable": "Witnesses trust the clock as it appears to be functioning normally.",
    "what_it_hides": "The clock was deliberately tampered with to mislead the investigation."
  },
  "constraint_space": {
    "time": {
      "anchors": [
        "8:00 PM (when Beatrice last checked the clock)",
        "9:00 PM (when the murder occurred)"
      ],
      "windows": [
        "7:30 PM to 9:15 PM"
      ],
      "contradictions": [
        "Witnesses claim to have heard the clock strike at 9:15 PM despite evidence showing it was tampered with."
      ]
    },
    "access": {
      "actors": [
        "Beatrice Quill",
        "Captain Ivor Hale"
      ],
      "objects": [
        "The clock in the study",
        "Dr. Finch's personal effects"
      ],
      "permissions": [
        "Beatrice had unrestricted access to the entire house"
      ]
    },
    "physical": {
      "laws": [
        "Mechanical clock behavior",
        "Dust accumulation"
      ],
      "traces": [
        "Dust marks on the clock face indicating tampering"
      ]
    },
    "social": {
      "trust_channels": [
        "Eleanor's relationship with the household staff",
        "Community reputation of Dr. Finch"
      ],
      "authority_sources": [
        "Beatrice's long-standing role as housekeeper"
      ]
    }
  },
  "inference_path": {
    "steps": [
      {
        "observation": "A smudge of dust is found on the clock face.",
        "correction": "The dust suggests recent tampering occurred before the murder.",
        "effect": "Narrows the opportunity window for Beatrice Quill.",
        "required_evidence": [
          "Dust marks on the clock face",
          "Witness statements about the clock's state",
          "Access records of Beatrice Quill in the study"
        ],
        "reader_observable": true
      },
      {
        "observation": "Witnesses report hearing the clock chime at an unusual hour.",
        "correction": "The chiming indicates the clock was tampered with to create a false timeline.",
        "effect": "Eliminates Captain Ivor Hale from suspicion based on his alibi.",
        "required_evidence": [
          "Witness statements about the clock's chiming",
          "Access records showing Hale's location during the chime",
          "Dust marks on the clock face"
        ],
        "reader_observable": true
      },
      {
        "observation": "The clock's pendulum shows signs of having been disturbed.",
        "correction": "The disturbance indicates deliberate tampering to mislead the time of death.",
        "effect": "Confirms that the murder was premeditated by Beatrice Quill.",
        "required_evidence": [
          "Pendulum movement pattern",
          "Witness reports on the clock's behavior",
          "Dust marks on the clock face"
        ],
        "reader_observable": true
      }
    ]
  },
  "discriminating_test": {
    "method": "trap",
    "design": "Eleanor sets a similar clock to a controlled time and observes its behavior, revealing the current clock's tampering.",
    "knowledge_revealed": "The controlled clock shows discrepancies compared to the time reported by witnesses.",
    "pass_condition": "The clock's behavior confirms the time of death was manipulated.",
    "evidence_clues": [
      "clue_dust_marks",
      "clue_chime_report",
      "clue_pendulum_disturbance",
      "clue_fp_contradiction_step_3",
      "clue_core_contradiction_chain"
    ]
  },
  "fair_play": {
    "all_clues_visible": true,
    "no_special_knowledge_required": true,
    "no_late_information": true,
    "reader_can_solve": true,
    "explanation": "Step 1: The dust marks on the clock indicate tampering, allowing readers to infer the timeline was manipulated. Step 2: Witnesses' reports of unusual chimes further clarify the deception. Step 3: The pendulum disturbance confirms the clock was adjusted just before the murder, leading to Beatrice's implication."
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
        "Observe the clock's behavior",
        "Reveal the implications of the tampering"
      ],
      "test_type": "mechanical verification"
    },
    "suspect_clearance_scenes": [
      {
        "suspect_name": "Captain Ivor Hale",
        "act_number": 3,
        "scene_number": 5,
        "clearance_method": "Confirmed alibi during the clock's unusual chime",
        "supporting_clues": [
          "clue_chime_report",
          "clue_access_record"
        ]
      },
      {
        "suspect_name": "Dr. Mallory Finch",
        "act_number": 3,
        "scene_number": 6,
        "clearance_method": "Victim of the murder",
        "supporting_clues": [
          "clue_victim_status"
        ]
      }
    ],
    "culprit_revelation_scene": {
      "act_number": 3,
      "scene_number": 7,
      "revelation_method": "Confrontation with evidence from the clock's tampering"
    },
    "identity_rules": [],
    "clue_to_scene_mapping": [
      {
        "clue_id": "clue_dust_marks",
        "act_number": 1,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_chime_report",
        "act_number": 1,
        "scene_number": 2,
        "delivery_method": "Witness statements"
      },
      {
        "clue_id": "clue_fp_contradiction_step_2",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_mechanism_visibility_core",
        "act_number": 1,
        "scene_number": 3,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_pendulum_disturbance",
        "act_number": 2,
        "scene_number": 1,
        "delivery_method": "Direct observation"
      },
      {
        "clue_id": "clue_culprit_direct_beatrice_quill",
        "act_number": 2,
        "scene_number": 2,
        "delivery_method": "Behavioral observation"
      },
      {
        "clue_id": "clue_core_contradiction_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Cross-check contradiction"
      },
      {
        "clue_id": "clue_core_elimination_chain",
        "act_number": 2,
        "scene_number": 3,
        "delivery_method": "Corroborated elimination"
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
    "summary": "Eleanor Voss is a charming socialite caught in a web of financial despair, desperately clinging to her status in Little Middleton. Beneath her polished exterior lies a woman willing to risk everything to maintain her façade.",
    "publicPersona": "Eleanor is the life of every gathering, radiating warmth and sophistication, effortlessly navigating the elite circles of Little Middleton. Her laughter is the sweetest music, and her conversations are peppered with wit and charm, making her a sought-after companion at any soirée.",
    "privateSecret": "Beneath the glittering surface, Eleanor struggles with significant debt, a fact she hides from her peers. Her desire to keep up appearances drives her to the brink, as she yearns for the financial security that could come with her husband’s life insurance policy.",
    "motiveSeed": "The prospect of alleviating her financial woes through her husband’s life insurance provides a compelling motive, as Eleanor grapples with the morality of her thoughts.",
    "motiveStrength": "strong",
    "alibiWindow": "Eleanor claims to have been in the garden for an hour before the murder, ostensibly tending to her prized roses, a detail that could either bolster or undermine her credibility.",
    "accessPlausibility": "Eleanor had easy access to the victim, as she often frequented the estate and had a free pass to navigate its halls.",
    "stakes": "For Eleanor, the stakes are monumental; failure to maintain her social standing could lead to ruin, both financially and socially.",
    "humourStyle": "polite_savagery",
    "humourLevel": 0.6,
    "speechMannerisms": "Eleanor speaks with a measured cadence, lacing her dialogue with playful jabs and a hint of irony. She often employs elegant phrases that reflect her social status, but when pressed, her wit sharpens into a more pointed commentary.",
    "internalConflict": "Eleanor is torn between her relentless ambition and the growing realization that her values may be misplaced. The thought of sacrificing integrity for wealth gnaws at her conscience.",
    "personalStakeInCase": "This crime matters profoundly to Eleanor, as it directly impacts her financial security and the very lifestyle she has curated, pushing her to confront the lengths she might go to preserve it.",
    "paragraphs": [
      "Eleanor Voss floated through the room like a rare butterfly, her laughter ringing like chimes in the evening breeze. The guests of Little Middleton adored her, gravitating towards her magnetic charm. She was a woman of impeccable taste, draped in the finest silks, her hair a cascade of artful curls. Yet, behind the sparkling facade lay a deep-seated anxiety that threatened to unravel her carefully constructed world. The whispers of her financial troubles were a constant murmur in her mind, a cacophony that drowned out the joy of the moment.",
      "As she arranged the flowers in the garden, Eleanor’s thoughts spiraled into dark territory. Each petal she placed felt like a reminder of her mounting debts, the bills that lay hidden in a drawer, and the unrelenting pressure to maintain her status. If only she could find a way to ease her burden, perhaps her husband’s life insurance could provide the lifeline she so desperately needed. But the thought of such a drastic measure sent shivers down her spine, battling the desire for security with the remnants of her moral compass.",
      "Her alibi was as easy as the breeze that rustled through the garden, a simple truth that could either save or condemn her. She had been alone, surrounded by the beauty of her flowers, but the solitude was deceptive. In her heart, she felt the weight of her ambition pressing down like a leaden cloak. The evening’s events hung heavy over her, each laugh and toast now tainted with the knowledge of what could be lurking beneath the surface.",
      "Eleanor’s journey was not just about maintaining appearances; it was about discovering who she truly was beneath the layers of silk and charm. As the investigation unfolded, she found herself at a crossroads. Would she cling to her ambition, or would she find the strength to embrace integrity? The clock was ticking, and with it, the chance to redefine her legacy in Little Middleton."
    ],
    "order": 1
  },
  {
    "name": "Dr. Mallory Finch",
    "summary": "Dr. Mallory Finch is a respected physician with a hidden agenda, harboring resentment towards the victim who overshadowed his career. His ambition is matched only by his bitterness, leading him down a treacherous path.",
    "publicPersona": "Known for his dedication to the community, Mallory is the epitome of a charitable physician, often seen lending a hand to the less fortunate. His calm demeanor and articulate speech make him a respected figure, and he is often called upon for his expertise.",
    "privateSecret": "Beneath the polished exterior lies a man consumed with envy, as the victim’s success has stolen the accolades he believes he deserves. Mallory’s resentment festers, threatening to cloud his judgment.",
    "motiveSeed": "The victim’s appropriation of Mallory’s medical research not only jeopardizes his career but also threatens to erase his legacy. This drives him to consider extreme measures to reclaim his standing.",
    "motiveStrength": "compelling",
    "alibiWindow": "He was attending to patients in the clinic until 10 PM, a detail verifiable by the clinic's records, but could he have slipped away unnoticed?",
    "accessPlausibility": "Mallory’s access to the victim was limited, but his knowledge of the local community could provide him with opportunities to exploit.",
    "stakes": "For Mallory, the stakes are his reputation and the very foundation of his career, which could crumble if he does not regain recognition in the medical field.",
    "humourStyle": "dry_wit",
    "humourLevel": 0.5,
    "speechMannerisms": "Mallory speaks with a deliberate pace, punctuating his words for emphasis. His dialogue often contains a mix of medical jargon and self-deprecating humor, revealing both his intelligence and his inner turmoil.",
    "internalConflict": "Mallory wrestles with the resentment that threatens to consume him, questioning whether his ambition is worth the moral cost. The path to reclaiming his legacy is fraught with ethical dilemmas.",
    "personalStakeInCase": "The murder investigation strikes a personal chord for Mallory, as it not only threatens his career but also forces him to confront the darker aspects of his ambition.",
    "paragraphs": [
      "Dr. Mallory Finch stood in his clinic, the sterile smell of antiseptic a familiar comfort that belied the turmoil within. His hands, steady and sure as they treated patients, were betraying him with thoughts of vengeance. The victim’s name echoed in his ears, a constant reminder of the accolades stolen from him, of the recognition he deserved but had been denied. He wore a mask of professionalism, but underneath, resentment simmered like an unquenchable fire.",
      "His public persona as a dedicated physician was carefully crafted, a façade that had garnered him respect and admiration. Yet, in the quiet moments, when the clinic emptied, the bitterness clawed at him, whispering that he had been wronged. The victim had taken the limelight, exploiting Mallory’s research for personal gain, and now he felt the walls closing in on him. The desire to reclaim his honor was compelling, and he found himself contemplating paths he had never imagined.",
      "As he attended to patients until 10 PM, Mallory’s mind raced with possibilities. His alibi was solid, yet he could not shake the feeling that it might not be enough. What if he had the opportunity to confront the victim, to right the wrongs that had been inflicted upon him? The stakes were high, and with each passing moment, the weight of his ambition pressed down harder. Could he resist the urge to take matters into his own hands?",
      "The investigation loomed over him like a dark cloud, forcing Mallory to confront the duality of his nature. Would he allow his ambition to lead him down a path of darkness, or could he find a way to reclaim his legacy without succumbing to the shadows? The clock was ticking, and the pressure was mounting, urging him to make a decision that would forever alter the course of his life."
    ],
    "order": 2
  },
  {
    "name": "Captain Ivor Hale",
    "summary": "Captain Ivor Hale is a dignified retired military officer grappling with the ghosts of his past. His sense of honor clashes with a growing disillusionment, leaving him at odds with a world that has moved on.",
    "publicPersona": "A gentleman of impeccable standing, Hale is known for his unwavering sense of duty and honor. He commands respect from his peers, often seen as a pillar of the community, sharing stories of valor and sacrifice.",
    "privateSecret": "Despite his dignified exterior, Hale struggles with post-war trauma, feeling increasingly marginalized and forgotten by a society that no longer values the sacrifices of veterans.",
    "motiveSeed": "Hale believes the victim exploits the legacy of the war for personal gain, a betrayal that stirs his sense of honor and prompts thoughts of retribution.",
    "motiveStrength": "moderate",
    "alibiWindow": "He was in the study with guests until shortly before the crime occurred, a detail that could either lend him credibility or raise suspicions.",
    "accessPlausibility": "Hale had possible access to the victim, as he frequented the estate and mingled with the guests, but his interactions had always been cordial and respectful.",
    "stakes": "For Hale, the stakes revolve around his sense of honor and the legacy he fought to uphold, both of which are threatened by the victim’s actions.",
    "humourStyle": "observational",
    "humourLevel": 0.4,
    "speechMannerisms": "Hale speaks with a formal cadence, often punctuating his statements with anecdotes from his military days. His dialogue reflects a deep sense of pride, but he occasionally allows glimpses of vulnerability to seep through.",
    "internalConflict": "Hale grapples with the trauma of his past and the realization that his values may not align with a changing society, leaving him torn between loyalty and disillusionment.",
    "personalStakeInCase": "The murder investigation strikes at Hale's sense of identity, forcing him to confront the legacy of his service and the values he fought to protect.",
    "paragraphs": [
      "Captain Ivor Hale gazed out of the study window, the world beyond a blur of activity that felt increasingly foreign. Once a man of action, he now found himself relegated to the sidelines, a relic of a bygone era. The stories of valor he shared with others felt hollow against the backdrop of a society that seemed to forget the sacrifices made by men like him. As he reflected on the victim’s actions, a simmering anger began to rise within him, a feeling that the very essence of honor was being exploited.",
      "Hale’s public persona was that of a dignified gentleman, a figure of authority who commanded respect. Yet, beneath that polished exterior lay a man grappling with the ghosts of his past. The trauma of war haunted him, manifesting in quiet moments when he felt the walls closing in. He often wondered if society still valued the principles he fought for, or if he was merely a relic of an old world, clinging to ideals that no longer held weight.",
      "His alibi for the evening was solid, yet he felt the pressure mounting as the investigation unfolded. The victim’s actions had struck a nerve, igniting a sense of betrayal that stirred his sense of honor. Would he allow himself to confront the injustices he perceived, or would he be forced to remain a silent observer? The stakes were high, and the weight of his legacy bore down on him, urging him to take a stand.",
      "As the clock ticked away, Hale found himself at a crossroads. The investigation was not just about the murder; it was about his identity and the values he held dear. Would he succumb to bitterness, or could he find a purpose in defending the ideals that had once defined him? The answer lay within, and the time to act was drawing near."
    ],
    "order": 3
  },
  {
    "name": "Beatrice Quill",
    "summary": "Beatrice Quill is a diligent maid with a keen eye for secrets and a burning ambition to rise above her station. Her loyalty is tested as she navigates the treacherous waters of her employer's household.",
    "publicPersona": "Known for her discretion and diligence, Beatrice is the quintessential maid, seamlessly blending into the background while ensuring that the household runs smoothly. Her loyalty to her employers is unquestionable, but her aspirations are anything but humble.",
    "privateSecret": "Behind her quiet demeanor lies a woman acutely aware of the household’s secrets, with ambitions that extend far beyond her station. She grapples with the dilemma of loyalty versus self-preservation.",
    "motiveSeed": "Beatrice may find herself protecting another staff member with incriminating information, a decision that could jeopardize her position and ambitions.",
    "motiveStrength": "moderate",
    "alibiWindow": "She claims to have been in the kitchen preparing for dinner during the incident, a detail that could be corroborated by the other staff.",
    "accessPlausibility": "Beatrice had easy access to the household, moving freely among the staff and guests, making her privy to many secrets.",
    "stakes": "For Beatrice, the stakes are high; her chance at upward mobility and the safety of her position hinge on the outcome of the investigation.",
    "humourStyle": "self_deprecating",
    "humourLevel": 0.5,
    "speechMannerisms": "Beatrice speaks in a soft, measured tone, often punctuating her sentences with a hint of self-deprecation. Her dialogue is marked by a careful choice of words, reflecting her awareness of her station and the secrets she keeps.",
    "internalConflict": "Beatrice is torn between her loyalty to her employers and her desire for a better life, grappling with the moral implications of her knowledge and the lengths she might go to secure her future.",
    "personalStakeInCase": "The murder investigation directly impacts Beatrice's aspirations, forcing her to confront the risks of her knowledge and the impact it may have on her future.",
    "paragraphs": [
      "Beatrice Quill moved quietly through the kitchen, her hands deftly preparing for the evening meal. The clatter of pots and pans was a familiar symphony, a comfort in the midst of the chaos that often unfolded in her employer's household. Known for her diligence, she was the invisible thread that held everything together, but beneath the surface, her mind raced with thoughts of ambition and the secrets she kept.",
      "Her public persona as a loyal maid was a mask she wore with pride, yet within her lay a burning desire to rise above her station. She was acutely aware of the household’s secrets, knowledge that could either be her salvation or her downfall. The stakes were high; her chance at upward mobility depended on navigating the treacherous waters of loyalty and ambition, a tightrope walk that left her breathless.",
      "As she prepared for dinner, Beatrice remembered the incident that had unfolded earlier. Her alibi was solid, as she had been in the kitchen when the crime occurred, yet the thought of protecting another staff member with incriminating information gnawed at her conscience. Would she choose loyalty over her aspirations? The weight of her decision pressed down on her, a constant reminder of the precarious balance she sought to maintain.",
      "The investigation was more than just a murder; it was a test of her character and her ambitions. Beatrice found herself at a crossroads, where the choices she made could either forge a path to a better life or lead her down a road of ruin. The clock was ticking, and with every passing moment, the stakes grew higher, forcing her to confront the truth of her desires."
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
    "summary": "A grand manor steeped in mystery, set amidst formal gardens and expansive grounds, where secrets lie hidden beneath its stately exterior.",
    "visualDescription": "The manor's imposing façade, adorned with intricate stonework and tall, arched windows, looms against the overcast sky. Ivy creeps up the walls, while manicured hedges and sculpted topiaries frame the entrance, hinting at both elegance and enigma.",
    "atmosphere": "A palpable tension hangs in the air, as the manor stands as a silent witness to the growing unrest outside its walls.",
    "paragraphs": [
      "Little Middleton Manor, with its weathered stone and grand gables, stands resolute against the encroaching shadows of the fall afternoon. The air is thick with the scent of damp earth and decaying leaves, a reminder of the changing seasons. Inside, the flickering gas lamps cast a warm, inviting glow, contrasting starkly with the chill that seeps through the windowpanes. Here, the past lingers in every corner, from the portraits of stern ancestors lining the halls to the ticking of the grand clock that measures time with an unyielding precision.",
      "As guests and staff navigate the labyrinthine corridors, the manor reveals both its charm and its secrets. The drawing room, adorned with plush velvet furnishings and the soft hum of a radio broadcasting news, seems a haven of normalcy amidst the growing tension outside. Yet, behind closed doors, whispered conversations hint at deeper troubles, as the economic struggles of the Great Depression tighten their grip on the household. The staff moves with purpose, their routines dictated by the whims of the family, each moment steeped in unspoken rules and unacknowledged tensions.",
      "The formal gardens, meticulously maintained yet eerily quiet, stretch out behind the manor. Winding pathways lead to hidden alcoves where the light barely penetrates, shrouded in mystery and the scent of wet grass. Here, as the rain begins to fall again, the atmosphere thickens with anticipation. Each drop echoes the heartbeat of the manor, a reminder that beneath its polished exterior lies a world of intrigue and danger, waiting to be uncovered.",
      "Every creak of the floorboards, every distant sound of thunder, reverberates through the manor, amplifying the sense of foreboding. As night falls, the once-familiar rooms transform, shadows deepening in the corners, and the ticking clock becomes a constant reminder of the time slipping away. In this house, secrets are currency, and the truth remains just out of reach, hidden within the clockwork of its grand design."
    ]
  },
  "atmosphere": {
    "era": "1930s",
    "weather": "Overcast with intermittent rain, typical of the British countryside in the fall.",
    "timeFlow": "Three days of mounting tension as events unfold in the manor.",
    "mood": "Tense and foreboding due to recent social unrest and economic struggles.",
    "eraMarkers": [
      "Typewriter clacking in the study",
      "Radio crackling with news broadcasts",
      "Telephones ringing in the drawing room",
      "Petrol automobiles parked in the driveway"
    ],
    "sensoryPalette": {
      "dominant": "The heavy scent of damp earth and decaying leaves",
      "secondary": [
        "Flickering gaslight casting shadows",
        "Soft rustle of fabric against furniture",
        "Distant echoes of thunder"
      ]
    },
    "paragraphs": [
      "The manor's atmosphere is laden with the weight of history, each room narrating tales of past glories and present dilemmas. As the rain falls steadily outside, the air inside becomes thick with the scent of wet stone and the warmth of flickering candlelight. The distant sound of thunder serves as a reminder of the tempest brewing, both outside and within the walls of Little Middleton Manor.",
      "A sense of isolation permeates the estate; the sprawling grounds, while beautiful, serve to distance the inhabitants from the outside world. The formal gardens, though meticulously tended, feel more like a prison than a refuge, with each pathway leading deeper into the heart of the manor's secrets. The tension is palpable, underscored by the soft murmurs of conversation and the occasional crack of thunder, as if the very air holds its breath in anticipation of what is to come."
    ]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "The Grand Library",
      "type": "interior",
      "purpose": "Crime scene",
      "visualDetails": "A vast room lined with dark oak shelves, filled with leather-bound tomes; a large mahogany desk stands at the center, papers strewn about.",
      "sensoryDetails": {
        "sights": [
          "Flickering candlelight on leather spines",
          "Dust motes dancing in dim light",
          "Heavy drapes framing tall windows"
        ],
        "sounds": [
          "Pages turning in the silence",
          "The distant crackle of the fireplace",
          "Rain tapping against the window"
        ],
        "smells": [
          "Old leather and polished wood",
          "Beeswax candles burning",
          "Hints of damp stone"
        ],
        "tactile": [
          "Worn leather armchair",
          "Cool marble of the fireplace",
          "Soft fabric of the drapes"
        ]
      },
      "accessControl": "Accessible to family and select guests; staff may enter only during cleaning hours.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Grey light filtering through clouds",
            "Raindrops streaking the window panes",
            "Shadows deepening in corners"
          ],
          "sounds": [
            "Steady drumming of rain on the roof",
            "Occasional crack of thunder",
            "The sigh of the wind through trees"
          ],
          "smells": [
            "Fresh rain on stone",
            "Mildew on old books",
            "Cold air seeping in"
          ],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat, grey light filling the room",
            "Dust settling over the desk",
            "The glint of brass fittings"
          ],
          "sounds": [
            "Silence broken by the ticking clock",
            "Distant voices from the hallway",
            "The creak of floorboards"
          ],
          "smells": [
            "Dust and old paper",
            "Faint scent of tobacco",
            "Hints of beeswax"
          ],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight flickering against the walls",
            "Long shadows cast by the furniture",
            "The outline of books creating a dark silhouette"
          ],
          "sounds": [
            "The soft tick of the mantel clock",
            "Distant laughter from a gathering",
            "The crackle of the fire"
          ],
          "smells": [
            "Warm candle wax melting",
            "Hints of tobacco smoke",
            "Cold ashes from the fireplace"
          ],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": [
        "The Grand Library, a sanctuary of knowledge and secrets, serves as the heart of Little Middleton Manor. Its dark oak shelves cradle the weight of history, while the scent of old leather and beeswax candles envelops the room in a comforting embrace. Yet, as the storm outside rages, the library takes on a different character, shadows deepening and the flickering candlelight casting eerie shapes against the walls. This is where the crime unfolded, amidst the silent witnesses of countless tomes.",
        "Papers lie strewn across the mahogany desk, a chaotic testament to the hurried moments before the tragedy. The soft rustle of fabric and the crackling fire are the only sounds that dare to break the heavy silence, mirroring the tension that hangs in the air. Here, in this room filled with secrets, the truth waits to be unearthed."
      ]
    },
    {
      "id": "drawing_room",
      "name": "The Drawing Room",
      "type": "interior",
      "purpose": "Gathering space",
      "visualDetails": "Elegant furnishings in rich fabrics, a grand piano tucked in one corner, and a large window overlooking the gardens.",
      "sensoryDetails": {
        "sights": [
          "Richly patterned wallpaper",
          "Gleaming brass fixtures",
          "A large chandelier casting soft light"
        ],
        "sounds": [
          "The soft notes of piano music",
          "Murmurs of conversation",
          "The crackle of the fireplace"
        ],
        "smells": [
          "Freshly polished wood",
          "Delicate floral arrangements",
          "Hints of cigar smoke"
        ],
        "tactile": [
          "Soft velvet cushions",
          "Cool marble mantelpiece",
          "Worn but luxurious rugs"
        ]
      },
      "accessControl": "Open to guests during social gatherings; private discussions often held here.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Rain-drenched garden visible through windows",
            "Puddles forming on the terrace",
            "Gloomy light casting long shadows"
          ],
          "sounds": [
            "Raindrops tapping against the glass",
            "Distant rumbles of thunder",
            "The soft rustle of the curtains"
          ],
          "smells": [
            "Wet earth and leaves",
            "Faint scent of damp fabric",
            "Hints of fresh coffee brewing"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Dull light filtering through clouds",
            "Dust particles dancing in the air",
            "Shadows pooling in corners"
          ],
          "sounds": [
            "Clock ticking steadily",
            "Muffled laughter from the hallway",
            "The crackle of the fire"
          ],
          "smells": [
            "Dust and old books",
            "A hint of tobacco smoke",
            "Fresh flowers wilting slightly"
          ],
          "mood": "restless tension"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Candlelight reflecting off polished surfaces",
            "Guests gathered in lively conversation",
            "Soft light illuminating the piano keys"
          ],
          "sounds": [
            "Laughter echoing off the walls",
            "Piano notes drifting through the air",
            "The soft clink of glasses"
          ],
          "smells": [
            "Rich aroma of fine wine",
            "Freshly baked pastries",
            "Hints of perfume lingering"
          ],
          "mood": "cheerful yet strained"
        }
      ],
      "paragraphs": [
        "The Drawing Room, a space of elegance and charm, is where the household gathers to enjoy both leisure and conversation. Rich fabrics drape over the furniture, and the soft notes of a grand piano fill the air, creating a warm and inviting atmosphere. Yet, beneath the surface, a current of tension runs through the conversations, as the realities of the outside world seep into this haven of luxury.",
        "As guests mill about, laughter mingles with the soft crackle of the fireplace, but the shadows cast by the flickering flames reveal more than mere silhouettes. The scent of freshly polished wood and delicate floral arrangements wafts through the room, yet the faintest hint of cigar smoke lingers, a reminder of whispered secrets and unspoken truths that have been exchanged in this space."
      ]
    },
    {
      "id": "servants_hall",
      "name": "The Servants' Hall",
      "type": "interior",
      "purpose": "Staff gathering space",
      "visualDetails": "A simpler room with wooden benches, a long dining table, and a small fireplace; utilitarian decor reflects the lives of the staff.",
      "sensoryDetails": {
        "sights": [
          "Rough-hewn wooden beams overhead",
          "Simple table set for meals",
          "Flickering light from the fireplace"
        ],
        "sounds": [
          "Clatter of dishes",
          "Muffled laughter from the kitchen",
          "The crackle of the fire"
        ],
        "smells": [
          "Aroma of hearty stew",
          "Hints of woodsmoke",
          "Faint scent of soap from cleaning"
        ],
        "tactile": [
          "Worn wooden benches",
          "Cool stone floor",
          "Soft wool blankets draped over chairs"
        ]
      },
      "accessControl": "Restricted to staff; guests are not permitted.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Dull light filtering through small windows",
            "Raindrops pooling on the stone sill",
            "Steam rising from pots"
          ],
          "sounds": [
            "Gentle patter of rain on the roof",
            "The hum of conversation",
            "Clanking of utensils"
          ],
          "smells": [
            "Freshly baked bread",
            "Wet earth from outside",
            "Faintest hint of mildew"
          ],
          "mood": "cozy yet tense"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Shadows creeping across the floor",
            "Flickering candlelight casting patterns",
            "Dust motes suspended in the air"
          ],
          "sounds": [
            "The distant ticking of a clock",
            "Muffled voices from the kitchen",
            "Occasional crackle from the fire"
          ],
          "smells": [
            "Lingering aroma of stew",
            "Woodsmoke from the fireplace",
            "Hints of cleaning supplies"
          ],
          "mood": "tense camaraderie"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Warm glow from the fireplace",
            "Table set for dinner",
            "Shadows dancing on the walls"
          ],
          "sounds": [
            "Laughter and chatter",
            "The clink of glasses",
            "The crackle of the fire"
          ],
          "smells": [
            "Savory aroma of roasted meat",
            "Freshly brewed tea",
            "Hints of tobacco from staff's leisure"
          ],
          "mood": "relaxed yet watchful"
        }
      ],
      "paragraphs": [
        "The Servants' Hall, a stark contrast to the opulence of the manor, is where the staff gathers to share meals and moments of respite. The flickering light from the small fireplace casts an inviting glow over simple wooden benches and a long dining table set for hearty meals. Here, amidst the clatter of dishes and the aroma of home-cooked stew, the staff exchanges whispers and glances, aware of the tensions simmering just beyond the manor walls.",
        "As the rain patters against the roof, the atmosphere is cozy yet charged with unspoken worries. The scent of freshly baked bread mingles with the earthy smell of the rain-soaked ground outside, creating a warm cocoon. Yet, the distant echoes of laughter from the drawing room serve as a reminder of the divide between the world of the guests and the lives of those who serve them, highlighting the class tensions that define their existence."
      ]
    },
    {
      "id": "garden",
      "name": "The Formal Gardens",
      "type": "exterior",
      "purpose": "Setting for clandestine meetings",
      "visualDetails": "Neatly trimmed hedges, flower beds bursting with color, and stone pathways winding through the landscape.",
      "sensoryDetails": {
        "sights": [
          "Vibrant blooms swaying in the breeze",
          "Clouds casting moving shadows",
          "Intricate stonework of paths"
        ],
        "sounds": [
          "Rustling leaves in the wind",
          "Birdsong echoing in the distance",
          "The soft crunch of gravel underfoot"
        ],
        "smells": [
          "Fragrant blossoms in bloom",
          "Freshly cut grass",
          "Earthy scent after rain"
        ],
        "tactile": [
          "Cool stone beneath bare feet",
          "Soft petals brushing against skin",
          "Chill of evening air"
        ]
      },
      "accessControl": "Open to guests during the day; secluded at night, often used for secretive meetings.",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": [
            "Droplets clinging to petals",
            "Puddles forming on pathways",
            "Muted colors under grey skies"
          ],
          "sounds": [
            "Rain falling softly on leaves",
            "The distant rumble of thunder",
            "Water trickling in gutters"
          ],
          "smells": [
            "Wet earth and grass",
            "Faint scent of mildew",
            "Fresh rain on flowers"
          ],
          "mood": "melancholic"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": [
            "Flat light dulling colors",
            "Shadows pooling in corners",
            "Wind rustling through trees"
          ],
          "sounds": [
            "Silence interrupted by distant voices",
            "Occasional chirping of birds",
            "The rustle of plants in the wind"
          ],
          "smells": [
            "Damp soil and foliage",
            "Hints of decay among flower beds",
            "Fragrant herbs swaying in the breeze"
          ],
          "mood": "restless anticipation"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": [
            "Stars twinkling in the night sky",
            "Moonlight illuminating pathways",
            "Shadows stretching across lawns"
          ],
          "sounds": [
            "Crickets chirping in the distance",
            "The whisper of leaves in the breeze",
            "Laughter from the manor"
          ],
          "smells": [
            "Sweet scent of night-blooming flowers",
            "Freshly mowed grass",
            "Hints of woodsmoke from the manor"
          ],
          "mood": "romantic tension"
        }
      ],
      "paragraphs": [
        "The Formal Gardens, a carefully curated landscape of beauty, provide a stark contrast to the tensions brewing within the manor. Neatly trimmed hedges and vibrant flower beds create an atmosphere of tranquility, yet the air is thick with secrets. The sound of rustling leaves and distant birdsong offers a deceptive sense of peace, masking the undercurrents of unease that ripple through the estate.",
        "As night falls, the gardens transform into a realm of shadows and whispers, where clandestine meetings can take place away from prying eyes. The chill of the evening air carries scents of night-blooming flowers and freshly cut grass, creating an intoxicating blend that beckons the curious. Within these walls of nature, the true nature of the characters begins to reveal itself, hidden among the blooms and beneath the stars."
      ]
    }
  ],
  "note": "",
  "cost": 0.0025806693,
  "durationMs": 26482
}

### TEMPORAL_CONTEXT
{
  "status": "draft",
  "specificDate": {
    "year": 1937,
    "month": "October",
    "day": 15,
    "era": "1930s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": [
      "overcast skies",
      "intermittent rain",
      "cool temperatures averaging around 10°C (50°F)"
    ],
    "daylight": "Days are short with twilight descending around 5:30 PM, casting a gloomy shadow over the countryside.",
    "time_of_day_of_crime": "Late evening — between nine and eleven at night, after a modest supper.",
    "holidays": [
      "Halloween (October 31)"
    ],
    "seasonalActivities": [
      "Harvest festivals celebrating the season's bounty",
      "Preparations for Halloween with decorations and costumes",
      "Outdoor walks to enjoy autumn foliage"
    ]
  },
  "fashion": {
    "mensWear": {
      "formal": [
        "tweed suit with a waistcoat",
        "cravat or tie in autumnal colors",
        "fedora hat"
      ],
      "casual": [
        "knitted cardigan",
        "high-waisted trousers",
        "oxford shoes"
      ],
      "accessories": [
        "pocket watch",
        "leather gloves",
        "umbrella"
      ]
    },
    "womensWear": {
      "formal": [
        "tea-length dress with a fitted waist",
        "long-sleeve blouse with a Peter Pan collar",
        "tailored wool coat"
      ],
      "casual": [
        "tweed skirt with a matching sweater",
        "sensible ankle boots",
        "beret hat"
      ],
      "accessories": [
        "string of pearls",
        "silk scarf",
        "clutch handbag"
      ]
    },
    "trendsOfTheMoment": [
      "the rise of Art Deco influences in fashion",
      "increasing popularity of practical yet stylish attire for women",
      "hats as a staple accessory for both genders"
    ],
    "socialExpectations": [
      "men expected to dress formally for social events",
      "women encouraged to maintain modesty and elegance",
      "strict adherence to etiquette in social gatherings"
    ]
  },
  "currentAffairs": {
    "majorEvents": [
      "The Spanish Civil War continues to escalate, drawing international attention",
      "In the UK, the government faces criticism over unemployment rates",
      "The Munich Agreement leads to growing tensions in Europe"
    ],
    "politicalClimate": "The political climate is tense, with increasing fears of war in Europe and the impact of the Great Depression still felt across society.",
    "economicConditions": "The economy remains fragile, with high unemployment contributing to class unrest and dissatisfaction among the working class.",
    "socialIssues": [
      "class disparity widening between the wealthy and the working class",
      "women's rights movements gaining momentum",
      "racial tensions simmering in various urban centers"
    ],
    "internationalNews": [
      "Nazi Germany's aggressive policies draw global condemnation",
      "The U.S. grapples with isolationism while Europe prepares for potential conflict"
    ]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": [
        "The Andrews Sisters with 'Bei Mir Bist Du Schön'",
        "Bing Crosby's 'White Christmas'",
        "Duke Ellington's big band jazz"
      ],
      "films": [
        "The Adventures of Robin Hood",
        "Snow White and the Seven Dwarfs",
        "The Prisoner of Zenda"
      ],
      "theater": [
        "The King and I",
        "Pygmalion",
        "The Threepenny Opera"
      ],
      "radio": [
        "The Shadow",
        "The Jack Benny Program",
        "Orson Welles' Mercury Theatre on the Air"
      ]
    },
    "literature": {
      "recentPublications": [
        "The Hobbit by J.R.R. Tolkien",
        "Of Mice and Men by John Steinbeck",
        "Brave New World by Aldous Huxley"
      ],
      "popularGenres": [
        "mystery novels",
        "social realism",
        "science fiction"
      ]
    },
    "technology": {
      "recentInventions": [
        "the first commercial television broadcasts begin in the UK",
        "the development of early automatic washing machines",
        "the advent of more sophisticated radio technology"
      ],
      "commonDevices": [
        "household radios",
        "typewriters for personal and professional use",
        "early telephones for communication"
      ],
      "emergingTrends": [
        "the rise of consumer culture in urban areas",
        "increased availability of mass-produced goods",
        "growing interest in home appliances"
      ]
    },
    "dailyLife": {
      "typicalPrices": [
        "Loaf of bread: four pence",
        "Pint of milk: two pence",
        "Cinema ticket: one shilling"
      ],
      "commonActivities": [
        "attending local markets for fresh produce",
        "participating in community harvest events",
        "enjoying evenings in front of the radio"
      ],
      "socialRituals": [
        "formal tea gatherings among friends",
        "Sunday church services followed by family dinners"
      ]
    }
  },
  "socialAttitudes": {
    "class": [
      "increasing resentment toward the upper classes",
      "the working class seeking greater representation",
      "class divisions palpable in social interactions"
    ],
    "gender": [
      "women are increasingly entering the workforce",
      "traditional gender roles remain prevalent in many households",
      "pressure on women to conform to societal expectations of femininity"
    ],
    "race": [
      "racial tensions highlighted by economic struggles",
      "growing awareness of civil rights among minorities",
      "mixed attitudes toward immigrants in urban areas"
    ],
    "generalNorms": [
      "politeness and decorum are expected in public settings",
      "conservative values dominate social interactions",
      "family and community bonds are highly valued"
    ]
  },
  "atmosphericDetails": [
    "The air is crisp, carrying the scent of damp earth and fallen leaves, a reminder of the autumn harvest.",
    "A persistent drizzle creates a dull rhythm on the manor's windows, enhancing the feeling of isolation within its grand yet shadowy halls.",
    "Candles flicker against the encroaching darkness, casting elongated shadows that dance along the wallpaper, whispering secrets of the past."
  ],
  "paragraphs": [
    "In October 1937, the British countryside is engulfed in a spectral gloom, with overcast skies and intermittent rain that signals the heart of autumn. The days grow shorter, with twilight stealing in by half-past five, and the air is tinged with the scent of damp earth and decaying leaves. This atmospheric backdrop is punctuated by the anticipation of Halloween, as villagers prepare for their festivities, dressing in costumes and decorating their homes. The tension of the times is palpable; the specter of economic hardship looms over society like the gray clouds overhead, creating a sense of unease that permeates the very essence of daily life.",
    "Fashion in October 1937 reflects the era's complexities, with men donning tweed suits and fedoras that speak to both tradition and the need for practicality. Women embrace tea-length dresses and tailored coats, with pearls and silk scarves as essential accessories. The trend of practicality marries elegance, as both genders navigate the expectations of social gatherings. The rich textures of wool and cotton in their clothing echo the changing season, while subtle hues of brown and burgundy dominate their wardrobes, mirroring the landscape outside.",
    "Life in this time is a delicate balance of tradition and change. With the Great Depression still casting a long shadow, class tensions simmer beneath the surface, as the working class strives for recognition while the upper classes cling to their privileges. Daily rituals, such as Sunday church services and formal tea gatherings, reflect a society grappling with its identity amidst economic uncertainty. Entertainment thrives through the crackle of radios, as families gather around to listen to the latest programs, while community harvest festivals offer a brief respite from their struggles, uniting people in a shared celebration of resilience and hope."
  ],
  "note": "",
  "cost": 0.0010899867,
  "durationMs": 16297
}

### BACKGROUND_CONTEXT
{
  "status": "ok",
  "backdropSummary": "A gathering at the manor for a wealthy benefactor's will reading forces family and associates to confront their financial desperation amidst rising class tensions during the Great Depression.",
  "era": {
    "decade": "1930s",
    "socialStructure": "The Great Depression exacerbates class disparities, with traditional gender roles and economic pressures creating a tense atmosphere among the manor's elite and their staff."
  },
  "setting": {
    "location": "A large, stately manor house set in expansive grounds, characterized by formal gardens and an imposing façade.",
    "institution": "Manor house",
    "weather": "Overcast with intermittent rain, typical of the British countryside in the fall."
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
  }
]

### CLUE_DISTRIBUTION
{
  "clues": [
    {
      "id": "clue_dust_marks",
      "category": "temporal",
      "description": "A smudge of dust is found on the clock face.",
      "sourceInCML": "CASE.inference_path.steps[0].observation",
      "pointsTo": "This indicates potential tampering with the clock.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_chime_report",
      "category": "temporal",
      "description": "Witnesses report hearing the clock chime at an unusual hour.",
      "sourceInCML": "CASE.inference_path.steps[1].observation",
      "pointsTo": "This raises questions about the accuracy of the clock's readings.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_pendulum_disturbance",
      "category": "temporal",
      "description": "The clock's pendulum shows signs of having been disturbed.",
      "sourceInCML": "CASE.inference_path.steps[2].observation",
      "pointsTo": "This suggests that someone has manipulated the clock.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_culprit_direct_beatrice_quill",
      "category": "behavioral",
      "description": "Direct evidence ties Beatrice Quill to the mechanism access point before the discriminating test.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This direct evidence shows Beatrice Quill had means and opportunity, narrowing the solution uniquely toward the culprit.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "observation"
    },
    {
      "id": "clue_core_contradiction_chain",
      "category": "temporal",
      "description": "The dust suggests recent tampering occurred before the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].correction",
      "pointsTo": "This contradicts the assumption that the clock's readings are reliable.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_core_elimination_chain",
      "category": "testimonial",
      "description": "Eliminates Eleanor Voss because she was at the theater during the time of the murder.",
      "sourceInCML": "CASE.cast[0].alibi_window",
      "pointsTo": "This confirms her alibi and rules her out as a suspect.",
      "placement": "mid",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "elimination"
    },
    {
      "id": "clue_mechanism_visibility_core",
      "category": "temporal",
      "description": "The clock was wound back to create a false timeline for the murder.",
      "sourceInCML": "CASE.inference_path.steps[0].required_evidence[0]",
      "pointsTo": "This reveals the mechanism behind the false timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 1,
      "evidenceType": "observation"
    },
    {
      "id": "clue_late_optional_slot_1",
      "category": "behavioral",
      "description": "Beatrice Quill appears anxious when discussing the clock.",
      "sourceInCML": "CASE.cast[3].access_plausibility",
      "pointsTo": "This may indicate her involvement in the crime.",
      "placement": "late",
      "criticality": "optional",
      "supportsInferenceStep": 3,
      "evidenceType": "observation"
    },
    {
      "id": "clue_fp_contradiction_step_2",
      "category": "temporal",
      "description": "Witnesses report hearing the clock chime at an unusual hour.",
      "sourceInCML": "CASE.inference_path.steps[1].correction",
      "pointsTo": "The chiming indicates the clock was tampered with to create a false timeline.",
      "placement": "early",
      "criticality": "essential",
      "supportsInferenceStep": 2,
      "evidenceType": "contradiction"
    },
    {
      "id": "clue_fp_contradiction_step_3",
      "category": "temporal",
      "description": "The clock's pendulum shows signs of having been disturbed.",
      "sourceInCML": "CASE.inference_path.steps[2].correction",
      "pointsTo": "The disturbance indicates deliberate tampering to mislead the time of death.",
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
      "clue_dust_marks",
      "clue_chime_report",
      "clue_mechanism_visibility_core",
      "clue_fp_contradiction_step_2"
    ],
    "mid": [
      "clue_pendulum_disturbance",
      "clue_culprit_direct_beatrice_quill",
      "clue_core_contradiction_chain",
      "clue_core_elimination_chain",
      "clue_fp_contradiction_step_3"
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
  "latencyMs": 7344,
  "cost": 0.0042637485
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
